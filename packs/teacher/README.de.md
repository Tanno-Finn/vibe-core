<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/teacher/README.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: c7fe80cb98104e440043bbea38748613b970de18c4b43d087efc4db5a3fd8adc
-->

**English:** [This page in English](README.md)

# `teacher`-Pack

Ein **Pack** ist ein optionales Bündel von Task-Skills, das sich über das Kit legt — hier eine
*Rolle*: die Lehrkraft. Es legt in [`pack.json`](./pack.json) fest, welche Capabilities des Kits
seine Jobs brauchen und wie jede davon **degradiert**, also auf eine schwächere Form zurückfällt,
wenn ein Kit sie nicht bereitstellt. Nichts hier setzt Kit-Interna voraus (die Kit-blind-Regel —
siehe [`docs/de/explanation/the-pack-layer.md`](../../docs/de/explanation/the-pack-layer.md)).

Das Pack bringt **fünf einsatzbereite Jobs** in [`skills/`](./skills/) mit, jeder eine
`SKILL.md` mit `layer: pack`-Frontmatter. Sag *„Lehrkraft-Modus“* (oder auf Englisch *„switch to
teacher mode“*) und bitte dann um einen davon:

| Job | Liefert dir |
|---|---|
| [`worksheet`](./skills/worksheet/SKILL.md) | Ein druckfertiges Arbeitsblatt mit Aufgaben und Lösungsschlüssel. |
| [`practice-quiz`](./skills/practice-quiz/SKILL.md) | Ein Übungsquiz mit gemischten Fragetypen und einem Lösungsschlüssel. |
| [`differentiation`](./skills/differentiation/SKILL.md) | Leichtere und schwerere Varianten einer Aufgabe, bei gleichem Lernziel. |
| [`cover-lesson`](./skills/cover-lesson/SKILL.md) | Eine in sich geschlossene Vertretungsstunde, die eine Vertretung ohne Vorbereitung halten kann. |
| [`teaching-unit`](./skills/teaching-unit/SKILL.md) | Eine Unterrichtsreihe über mehrere Stunden, die die anderen Jobs in eine Abfolge bringt. |

Jeder Job ist kit-blind (er erzeugt ein poliertes Druck-Handout, wo das Kit das kann, und ein
einfaches Markdown-Artefakt, wo es das nicht kann), schreibt Material für Lehrkräfte in der
Sprache des Manifests (die mitgelieferten Beispiele sind deutsch) und speichert standardmäßig nach
`out/teacher/`. Die Sicherheitsregeln — Stopp bei Schülerdaten, Stempel Entwurf→geprüft,
KI-Fußzeile, Urheberrecht — stehen in [`GUARDRAILS.de.md`](./GUARDRAILS.de.md); jeder Job wendet sie
an, keiner wiederholt sie. In [`examples/`](./examples/README.de.md) findest du ein echtes,
durchgearbeitetes Ergebnis jedes Jobs.

## Aktivierung

Packs werden **konversationell, an Ort und Stelle** eingeschaltet — es gibt keinen
Installationsschritt. Sagt der Nutzer etwas wie *„wechsle in den Lehrkraft-Modus“*, *„ich bin
Lehrerin“* oder *„Arbeitsblatt erstellen“* — oder auf Englisch *„switch to teacher mode“* (siehe
`activation.phrases` in `pack.json`) —, kündigt der Agent den Wechsel an und bietet die Jobs des
Packs an. Den Modus zu verlassen ist genauso konversationell.

## Aufbau

```
packs/teacher/
  pack.json      # das Manifest (validiert durch base/pack.schema.json, geprüft durch scripts/check-packs.mjs)
  README.md      # dieser Wegweiser
  GUARDRAILS.md  # die Sicherheitsregeln des Packs, die jeder Job anwendet (Schülerdaten, Entwurf, KI-Fußzeile, Urheberrecht)
  skills/        # die fünf Job-Skills, je ein Ordner (SKILL.md, layer: pack)
  assets/        # print.css (in die Handouts eingebettet) + templates/ (deutsche Vorlagen zum Ausfüllen)
  presets/       # teacher.preset.md — Profil-Voreinstellungen, die /onboarding übernehmen kann
  examples/      # durchgearbeitetes Probelauf-Ergebnis jedes Jobs an einer erfundenen Eingabe
  pilot/         # das Pilot-Kit, um das Pack mit echten Lehrkräften zu erproben (Deutsch + Englisch, siehe unten)
```

Erzeugtes Material wird standardmäßig nach `out/teacher/` geschrieben, damit eine Lehrkraft immer
weiß, wo sie das letzte Handout findet. Der Ordner wird **mit Absicht von git erfasst**: Die
Handouts sind die eigene Arbeit der Lehrkraft, und ein Checkpoint-Commit ist das, was sie vor einem
falschen Aufräumen schützt — Schülerdaten gelangen nie hinein (Stopp auf Tier 1 in
[`GUARDRAILS.de.md`](./GUARDRAILS.de.md)), und Commits bleiben lokal, bis die Lehrkraft entscheidet, sie
zu pushen. Hilfsskripte, Screenshots und anderes Wegwerfmaterial kommen nach `tmp/` (von git
ignoriert), nie neben das Material.

## Erprobung (Pilot)

Das Pack ist **noch nicht mit echten Lehrkräften erprobt** — die Jobs, Vorlagen, Beispiele und
Guardrails sind Entwurfsarbeit, geprüft, aber ohne Pilot. Alles, was ein kleiner Pilot braucht,
liegt in [`pilot/`](./pilot/): ein Moderationsleitfaden für eine Sitzung von 60–90 Minuten mit zwei
oder drei Lehrkräften, ein Fragebogen für vorher und nachher, ein Beobachtungsbogen, eine
Einwilligungserklärung und eine Auswertungsvorlage, die aus zwei oder drei Sitzungen Befunde,
Backlog-Einträge und einen gemessenen Satz macht. Die Materialien sind auf Deutsch geschrieben, wie
die Beispiele des Packs, und jedes hat eine englische Übersetzung daneben (`*.en.md`); der
Eigentümer des Kits organisiert die Lehrkräfte und den Termin. Bis diese Auswertung vorliegt,
bleiben dieser Absatz und der Statushinweis in der README des Kits, wie sie sind.

## Capabilities und Fallbacks

Das Manifest nennt die Capabilities des Kits, die die Jobs nutzen werden, und für jede die
schwächere Capability, auf die sie zurückfallen, wenn sie fehlt. `file:markdown` garantiert die
Base, also ist das der Boden, den jeder Job immer erreicht. Siehe `pack.json` → `capabilities`.
