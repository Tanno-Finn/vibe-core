<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/explanation/the-pack-layer.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 96e99ec837ac1b112d57fd65b1b66d6593c2cf2213b8c41466d6694d5aa5067a
-->

# Die Pack-Ebene

Dieses Kit ist in drei Ebenen gebaut: **base**, **kit** und **pack**. Die ersten beiden sind das
Fundament und die konkrete App. Diese Seite handelt von der dritten — der optionalen Ebene, die
es einem einzigen Kit erlaubt, sehr unterschiedlichen Nutzergruppen zu dienen, ohne für jede
eine neue Kopie wachsen zu lassen.

## Warum es Packs gibt

Ein einzelnes Portal muss oft mehrere Hüte gleichzeitig tragen. Derselbe Inhalt — Artikel, ein
Glossar, eine Timeline — ist Rohmaterial, das eine *Lehrkraft* in Arbeitsblätter verwandelt, ein
*Forscher* in eine Literaturrecherche, eine *Redakteurin* in einen Stil-Durchgang. Wäre jede
dieser Rollen fest ins Kit eingebacken, würde das Kit mit Jobs aufgebläht, die die meisten
Nutzer nie anfassen, und die, die sie doch anfassen, gingen darin unter.

Ein **Pack** ist die Antwort: ein optionales, in sich geschlossenes Bündel von *Task-Skills* für
eine Rolle oder einen Workflow. Nichts installieren, standardmäßig nichts zusätzlich
ausliefern — ein Pack konversationell aktivieren, wenn du es brauchst, ignorieren, wenn nicht.
Die Lehrkraft, die *„switch to teacher mode“* sagt, bekommt die Klassenzimmer-Jobs; alle
anderen sehen sie nie.

## Base, Kit, Pack — drei Rollen

| Ebene | Was sie ist | Hängt ab von |
|---|---|---|
| **base** | Das Agenten-Betriebssystem — Standards, Sicherheit, Bookkeeping, generische Skills. Gilt für *jedes* Kit. | Nur dem Kit-**Vertrag** (`kit.json`) — nie vom Kit-Code. |
| **kit** | Eine konkrete App: dieses Angular-Bildungsportal, seine Komponenten, seine Content-Builder. | Seinem eigenen Framework und Code; erfüllt den Vertrag. |
| **pack** | Ein optionales Bündel von Task-Skills für eine Rolle (Lehrkraft, Forscher, …). | Den vom Kit deklarierten **Capabilities** — nie vom Kit-Code. |

Der rote Faden ist Konstitutions-Prinzip 5: **jede Ebene hängt vom Vertrag der darunterliegenden
ab, nicht von deren Interna.** Die Base lebt diese Regel bereits gegenüber dem Kit. Ein Pack
lebt dieselbe Regel gegenüber den Capabilities des Kits.

## Kit-blind: die Regel, nach der ein Pack lebt

Ein Pack darf nie annehmen, wie ein Kit gebaut ist. Es weiß nicht, dass es auf Angular läuft; es
weiß nicht, ob ein „Arbeitsblatt“ eine HTML-Komponente oder ein PDF ist. Alles, was es weiß, ist
das, was das Kit *deklariert*, produzieren zu können: die `capabilities`-Liste in `kit.json` —
grobe, benannte Fähigkeiten wie `content:article`, `file:html-print`, `page:interactive`, und
die, die jedes Kit garantiert hat, `file:markdown`.

Weil ein Pack kit-blind ist, muss es eine naheliegende Frage beantworten: *Was passiert, wenn
dem Kit, auf dem es läuft, eine gewünschte Capability fehlt?* Ein Pack, das dabei einfach
zerbricht, hat sich Kit-Interna durch die Hintertür angenommen. Also verlangt der Vertrag das
Gegenteil:

## Capability-Fallbacks: degradieren, nie annehmen

Jede Capability, die ein Pack in seinem Manifest deklariert, trägt einen **Fallback** — die
schwächere Capability, auf die zurückgegriffen wird, wenn die gewünschte fehlt. Ein
Lehrkraft-Job, der gerne ein druckfertiges Handout hätte (`file:html-print`), deklariert einen
Fallback auf `file:markdown`: Auf einem Kit mit Druck-Export erzeugt er das polierte Handout;
auf einem Kit ohne einen solchen erzeugt er stattdessen immer noch ein einfaches
Markdown-Handout, statt zu scheitern. `file:markdown` ist der von der Base garantierte Boden,
also ist es der Fallback letzter Instanz, der immer aufgelöst werden kann.

Das wird mechanisch geprüft. `scripts/check-packs.mjs` liest das Manifest eines Packs und die
Capability-Liste des Kits und verweigert jedes Pack, das eine Capability braucht, die dem Kit
fehlt, *ohne* dass ein funktionierender Fallback existiert — ein Fallback muss selbst zu einer
Capability auflösen, die das Kit tatsächlich bereitstellt. Das Ergebnis: Ein Pack degradiert auf
einem gegebenen Kit entweder graziös, oder es wird auf diesem Kit gar nicht erst ausgeliefert.
Es bricht nie mitten in einem Job ab, weil es etwas angenommen hat, das nicht da war.

## Konversationelle Aktivierung, keine Installation

Packs werden **an Ort und Stelle, durch Reden** eingeschaltet — es gibt keinen
Installationsschritt, keine Konfigurationsänderung, keinen separaten Build. Das Manifest listet
`activation.phrases` (*„switch to teacher mode“*, *„help me prepare a lesson“*); hört der Agent
die Absicht heraus, kündigt er den Wechsel an und bietet die Jobs des Packs an. Den Modus zu
verlassen ist genauso konversationell. Das hält die Standard-Erfahrung für alle schlank und
macht eine Rolle zu etwas, in das man *hineinsteigt*, nicht zu etwas, das man erst einrichten
muss.

## Woraus ein Pack besteht

Ein Pack liegt unter `packs/<id>/`:

- `pack.json` — das Manifest, validiert durch
  [`base/pack.schema.json`](../../../base/pack.schema.json) und geprüft durch
  `scripts/check-packs.mjs`. Es deklariert die ID des Packs, seine Aktivierungsphrasen und die
  Capabilities-mit-Fallbacks, von denen seine Jobs abhängen.
- `skills/` — die Job-Skills, jeder eine `SKILL.md` mit `layer: pack`-Frontmatter, in derselben
  Form wie die Base-Skills unter `.claude/skills/`.
- `GUARDRAILS.md` (wenn ein Pack heiklen Boden berührt) — die Tier-1/Tier-2-Guardrails des
  Packs im Base-Modell Grün/Gelb/Rot; jede `SKILL.md` verlinkt darauf und prüft dessen
  Tier-1-Regeln als Vorbedingungen. Siehe
  [`packs/teacher/GUARDRAILS.md`](../../../packs/teacher/GUARDRAILS.md).
- eine kurze `README.md`, die auf beides zeigt.

Der Vertrag (Schema + Gate) ist **base-eigen**, weil Kit-Blindheit ein Base-Prinzip ist; die
einzelnen Packs sind ihre eigene Sache, additiv hinzugefügt — ein neues Pack ändert nie die Base
oder das Kit, genau wie ein neues Kit nie die Base ändert. Das ist es, was die Plattform durch
Addition wachsen lässt, nicht durch Multiplikation.
