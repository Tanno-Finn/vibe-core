<!-- TRANSLATION-MIRROR
source: docs/explanation/choosing-an-ai-agent.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 8b120154582032b10bd3d4b57f53d6bacbd7c1193d2971c85da19735a53560da
-->

# Den richtigen KI-Coding-Agenten wählen

Dieses Kit ist dafür gebaut, *mit* einem KI-Coding-Agenten benutzt zu werden — einem Programm,
das deine Dateien liest und schreibt und oft auch Befehle für dich ausführt. Wenn das für dich
neu ist: Die erste echte Entscheidung ist, welchen du nimmst. Diese Seite gibt dir Kriterien,
keinen Testsieger — welcher Agent gerade „der beste“ ist, ändert sich alle paar Monate, aber
worauf es bei der Auswahl ankommt, bleibt gleich.

## Was ist ein KI-Coding-Agent?

Ein KI-Coding-Agent ist ein Programm auf Basis eines Sprachmodells, das dein Projekt lesen,
Änderungen an deinen Dateien vorschlagen oder direkt vornehmen und — je nach Werkzeug — Befehle
ausführen kann, etwa Pakete installieren oder eine Testsuite starten, alles aus Anweisungen in
normaler Sprache heraus. Das unterscheidet sich von reinem Chat mit einer KI: Ein Agent handelt
*innerhalb* deines Projekts, statt dir nur zu beschreiben, was du eintippen sollst.

## Die Kriterien, auf die es ankommt

Kein einzelnes Kriterium entscheidet allein; sie stehen in Wechselwirkung zueinander und mit
deiner Situation.

| Kriterium | Was es bedeutet | Der Zielkonflikt |
|---|---|---|
| **Kostenmodell** | Pauschal-Abo, Pay-per-Use oder eine kostenlose Stufe | Abos lohnen sich bei starker Nutzung; nutzungsbasierte Preise passen zu gelegentlicher Nutzung, können aber überraschen; kostenlose Stufen deckeln meist Umfang oder Modellqualität |
| **Wo er läuft** | In deinem Editor, im Terminal, in einem Browser-Tab oder komplett in der Cloud | Editor-/Terminal-Werkzeuge brauchen Installation und ordentliche Hardware; Browser- oder Cloud-Werkzeuge brauchen kein lokales Setup und laufen auch auf schwachen Rechnern — auf Kosten davon, dass dein Code über den Server von jemand anderem läuft |
| **Ganzes Repo vs. einzelne Datei** | Kann er über dein ganzes Projekt hinweg denken, oder meist nur über eine Datei? | Verständnis über das ganze Repo hinweg zählt, sobald eine Änderung mehrere Dateien berührt — bei den meisten echten Änderungen der Fall; Einzeldatei-Werkzeuge sind schlanker, aber die Verdrahtung machst du selbst |
| **Autonomie** | Kann er selbstständig Dateien ändern und Befehle ausführen, oder nur Text vorschlagen? | Mehr Autonomie heißt schnellere Iteration, aber mehr Vertrauen pro Schritt; nur-Vorschlagen ist langsamer, lässt dich aber jede Änderung prüfen |
| **Datenschutz / Umgang mit Daten** | Verlässt dein Code deinen Rechner, und fließt er ins Training künftiger Modelle ein? | Sensible Codebasen (Kundendaten, unveröffentlichte Arbeit, alles unter Vertrag) brauchen womöglich ein Werkzeug, das Code lokal hält oder vom Training ausschließt |
| **Konventions-Unterstützung** | Liest er die eigene Anweisungsdatei deines Projekts, bevor er handelt? | Ein Agent, der deine Konventionen ignoriert, kämpft bei jeder Änderung gegen dich; die meisten modernen Agenten lesen `AGENTS.md`, eine aufkommende offene Konvention dafür — dieses Kit liefert eine an seiner Wurzel mit |
| **Ökosystem / Lock-in** | Wie viel deines Setups ist werkzeugspezifisch? | Werkzeuge, die auf offenen, geteilten Konventionen aufbauen, sind später billig zu verlassen; proprietäre Konfiguration oder Workflows treiben die Wechselkosten hoch |
| **Sprach-/Framework-Unterstützung** | Funktioniert er gut mit dem Stack, den du tatsächlich benutzt? | Allzweck-Agenten decken die meisten Mainstream-Stacks halbwegs gut ab; bei Nischen-Stacks kann die Qualität zwischen Werkzeugen stark schwanken |

## Kriterien auf deine Situation anwenden

Du musst nicht alle acht Kriterien gleich gewichten — deine Situation sollte dir sagen, welche
davon Priorität haben:

- **Kein lokales Setup, oder ein alter/schwacher Rechner** → „wo er läuft“ stark gewichten. Ein
  browser- oder cloud-basierter Agent braucht nichts Installiertes und erledigt die
  Rechenlast anderswo.
- **Datenschutz-sensibler Kontext** (Schuldaten, Schülerdaten, unveröffentlichte Arbeit, alles
  unter NDA) → „Datenschutz / Umgang mit Daten“ stark gewichten. Prüfe, ob der Anbieter erklärt,
  dass dein Code nicht fürs Training genutzt wird, und ob er gegen ein lokales Modell laufen
  kann, falls dir das wichtig ist.
- **Knappes oder kein Budget** → „Kostenmodell“ stark gewichten und die tatsächlichen Limits der
  kostenlosen Stufe nachlesen (Anfragen pro Tag, Kontextgröße, welches Modell), statt
  anzunehmen, dass „kostenlos“ auch „unbegrenzt“ bedeutet.
- **Arbeit über viele Dateien gleichzeitig** (das meiste echte Arbeiten mit diesem Kit, da eine
  Konventionsänderung oft mehrere Routen und Services berührt) → „Verständnis übers ganze Repo“
  und „Autonomie“ stark gewichten; Einzeldatei-Vorschlagswerkzeuge bremsen dich hier aus.
- **Nur mal ausprobieren, wenig auf dem Spiel** → „Kosten“ und „einfache Einrichtung“ über alles
  andere stellen; du kannst später immer noch wechseln, sobald du weißt, was du wirklich
  brauchst.

> **Stand 2026-07-17 — diese Box veraltet, der Rest nicht.** Dieses Kit ist so geschrieben, dass
> es mit jedem Agenten funktioniert, der eine `AGENTS.md`-Datei liest — das trifft auf die
> meisten aktuellen Mainstream-Coding-Agenten zu. Ursprünglich wurde es für **Claude Code**
> verfasst, den terminal-basierten Agenten von Anthropic, der eine `CLAUDE.md`-Datei liest, die
> wiederum `AGENTS.md` importiert — ein Detail aus der Geschichte dieses Kits, keine
> Voraussetzung, um es zu nutzen. Wenn du diese Box löschst, bleibt der Rest dieser Seite
> trotzdem zutreffend.

## Entscheiden und weitermachen

Wähle den Agenten, der deine wichtigsten zwei oder drei Kriterien klar erfüllt, und fang an, ihn
zu benutzen. Versuch nicht, den objektiv besten zu finden — bis du mit dem Vergleichen aller
Optionen fertig bist, hat sich die Landschaft ohnehin wieder verschoben. Dieses Kit ist an
keinen bestimmten Agenten gebunden: Weil es seine Konventionen in der offenen,
standardisierten `AGENTS.md`-Datei hält, bedeutet ein späterer Werkzeugwechsel meist nur, welches
Programm diese Datei liest — nicht, dein Setup von Grund auf neu aufzubauen. Behandle deine
erste Wahl als Ausgangspunkt, nicht als Verpflichtung.
