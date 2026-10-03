<!-- base -->
<!-- TRANSLATION-MIRROR
source: docs/explanation/directives-and-skills.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 2f865a342643cbbdf1280d631ab2cd945916a27f2b50019297e17051763e1e52
-->

# Directives & Skills

Dieses Kit weist seinen Agenten auf zwei sehr unterschiedliche Arten an, und genau diese
Trennung verhindert, dass das Ganze zu einem einzigen, unlesbaren Regelwerk verschmilzt. Wenn du
dich je fragst, *„woher weiß der Agent, dass er das tun soll?“*, ist die Antwort fast immer
eines von beiden: eine **Directive** oder ein **Skill**.

Das Ein-Satz-Modell:

> **Eine Directive ist Wissen. Ein Skill ist ein Verb.**
> Eine Directive ist etwas, das der Agent *weiß* und auf alles anwendet, was er tut. Ein Skill
> ist etwas, das du ihn *tun bittest*.

## Directives — das dauerhafte Wissen

Eine **Directive** ist ein Stück bleibendes Know-how, das der Agent in jede Aufgabe mitnimmt:
ein Coding-Standard, eine Sicherheitsgewohnheit, ein Qualitätsanspruch, eine Art zu
kommunizieren. Directives werden nicht „ausgeführt“ — sie sind die Hintergrundregeln, die
prägen, *wie* der Agent an dem arbeitet, was er gerade tut. Einmal aufgeschrieben, leben sie
nicht mehr nur im Kopf eines einzelnen Agenten und gelten jedes Mal konsistent.

Sie liegen unter [`../../../directives/`](../../../directives/), und die Landkarte dorthin ist
[`../../../directives/index.yml`](../../../directives/index.yml) — eine Zeile pro Directive,
damit der Agent die richtige findet, ohne alle zu lesen. Ein paar echte Beispiele aus diesem
Index:

- **`core-principles`** — Belege vor Behauptungen, „eine Frage ist kein Befehl“, die kleinste
  Änderung wählen, die funktioniert, der Nutzer besitzt die Methode.
- **`verification`** — ein Eigen-Bericht ist kein Beweis; ein frischer Skeptiker prüft die
  Arbeit des Erbauers nach, und „reproduzieren, oder es ist nicht passiert“.
- **`communication`** — der Hausstil: keine Übertreibungen, ehrlicher Status, auf `datei:zeile`
  zeigen, Superlative im Budget halten.
- **`translation-quality`** — das Qualitätsmodell, die Terminologie-Hierarchie und die vom
  Nutzer abgenommenen Term-Sheets, die beim Übersetzen von Inhalten benutzt werden.

Keine davon ist eine *Aufgabe* — es sind stehende Regeln, die alles einfärben.

## Skills — die Jobs, um die du bittest

Ein **Skill** ist ein abgegrenzter Job, den der Agent ausführt, wenn du danach fragst — oft
namentlich, wie ein Befehl. Jeder hat einen klaren Anfang, ein klares Ende und ein klares
Ergebnis. Echte Beispiele aus diesem Kit:

- **`/onboarding`** — ein Erstkontakt-Interview, das genug über dich lernt, um gut zu helfen,
  und es in dein Manifest schreibt: wie du Dinge erklärt haben willst (samt der Welt, in der du
  dich am besten auskennst, damit er Bilder statt Fachjargon nehmen kann), worauf er von Tag
  eins an bauen soll, und die sieben Themen, die er für dich im Blick behält — jedes auf
  `quiet`, `normal` oder `active`. Hörst du mittendrin auf, macht er später dort weiter, statt
  von vorn zu beginnen.
- **`/help`** — listet die verfügbaren Skills in deiner eigenen Sprache auf und lädt dich ein,
  einen auszuwählen.
- **`/status`** — ein ehrliches, aktuelles Bild des Projekts: was in Arbeit ist, was fertig ist,
  was als Nächstes kommt, was dich braucht.
- **`/new-content`** — ein Stück Inhalt anlegen (einen Artikel, einen Glossareintrag, ein
  Timeline-Ereignis oder ein einfaches Dokument), zugeschnitten auf das, was das Kit tatsächlich
  produzieren kann.
- **`/new-component`** — eine wiederverwendbare UI-Komponente auf die richtige Art hinzufügen:
  zuerst Galerie-Check, dann die Komponente, ihr Registry-Eintrag, ihre Doku und ihre Live-Demo
  in einem Zug.
- **`/ship`** — das „sind wir fertig?“-Tor: grüner Build, grüne Tests, Doku im selben Commit,
  ein zweites Review bei nicht-trivialer Arbeit. Es bereitet vor und fragt nach — es
  veröffentlicht nie von sich aus.

Jeder Skill ist eine `SKILL.md`-Datei unter [`../../../.claude/skills/`](../../../.claude/skills/)
(ein Ordner pro Skill). Optionale [**Packs**](the-pack-layer.md) fügen auf dieselbe Weise
weitere Skills hinzu, unter `packs/*/skills/` — zum Beispiel die Jobs `worksheet`,
`practice-quiz` und `differentiation` des Teacher-Packs, die nur erscheinen, wenn du diesen
Modus einschaltest.

## Wie die Skills ausgeliefert werden — und zu anderen Tools wandern

Es gibt nichts zu installieren. Ein Skill ist bloß eine `SKILL.md`-Datei in einem
eingecheckten Ordner unter `.claude/skills/` (Packs fügen weitere unter `packs/*/skills/`
hinzu) — reines Markdown, in git versioniert wie der Rest des Repos, nicht per gitignore
ausgeschlossen und kein Build-Artefakt. Klone das Repo, und die Skills kommen mit.

Genau diese Wahl — reines Markdown in git — macht sie tool-übergreifend portabel:

- **Claude Code lädt sie nativ.** Es entdeckt jeden Ordner und bietet den Skill namentlich an
  (`/new-component`) und führt die Schritte so aus, wie sie geschrieben stehen.
- **Andere Tools lesen sie als Dokumentation.** Ein Tool, das Skills nicht nativ ausführt,
  liest ihr Markdown trotzdem als einfache Anweisungen — an die Konventionen des Repos
  verwiesen durch [`../../../AGENTS.md`](../../../AGENTS.md), die kanonische Anweisungsdatei,
  die andere Agenten (Copilot, Cursor, Gemini) direkt lesen.

So sind dieselben eingecheckten Dateien in einem Tool ein ausführbarer Befehl und im nächsten
ein lesbares Playbook — kein Export-Schritt, keine zweite Kopie, die synchron gehalten werden
muss. (Dasselbe gilt für Directives: Markdown unter `directives/`, kartiert von
`directives/index.yml`.)

## Warum sie getrennt halten?

Weil sie unterschiedliche Fragen beantworten. Wissen sollte immer aktiv sein — du willst nie
den Agenten *daran erinnern müssen*, die Sicherheitsregeln zu befolgen. Jobs sollten auf Abruf
sein — du willst nicht, dass jede Regel im Buch bei jeder Anfrage feuert. Beides zu mischen
würde bedeuten, entweder jede Aufgabe in Regeln zu ertränken, die sie nicht braucht, oder die
Regeln in einzelnen Jobs zu vergraben, wo sie nur halb greifen. Die Trennung hält beide Seiten
kurz, auffindbar und ehrlich.

## Der Schalter zwischen beiden: `/new-directive`

Wenn du dem Agenten etwas Neues beibringen willst, musst du nicht selbst entscheiden, in
welchen Topf es gehört — dafür gibt es genau einen Skill. **`/new-directive`** ist der
*Schalter*: beschreibe das Muster, den Workaround oder die Meinung, die du ständig wiederholst,
und er findet heraus, wohin es gehört. Ist es wirklich ein wiederholbarer *Job*, wird daraus ein
neuer Skill; ist es *Wissen oder eine Regel*, die alles prägen soll, wird daraus eine neue
Directive. So oder so schreibt er nur mit deinem ausdrücklichen Okay, damit Wissen nicht mehr
nur in einem einzelnen Gespräch lebt, sondern Teil des Kits wird.

## Wo als Nächstes nachsehen

- [`../../../AGENTS.md`](../../../AGENTS.md) — die Referenzdatei, die der Agent tatsächlich
  zuerst liest: eine Landkarte, die auf die Standards, Directives, Skills und das
  Sicherheitsmodell zeigt.
- [Die Pack-Ebene](the-pack-layer.md) — wie optionale Packs ganze Bündel rollenspezifischer
  Skills (wie das Teacher-Pack) hinzufügen, ohne die Base oder das Kit anzufassen.
