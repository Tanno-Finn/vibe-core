<!-- pack -->
<!-- TRANSLATION-MIRROR
source: packs/editor/README.md
canonical: en
mirror-lang: de
status: TRANSLATED
source-sha256: 1d609b3c61715c30a7bb155485f964183665f6e6c1987d8a86c71d5bcd6ba546
-->

**English:** [This page in English](README.md)

# `editor`-Pack

Ein **Pack** ist ein optionales Bündel von Task-Skills, das sich über das Kit legt — hier eine
*Rolle*: die Person, die das Kit mit ihrem eigenen Fach füllt. Es legt in
[`pack.json`](./pack.json) fest, welche Capabilities des Kits seine Jobs brauchen und wie jede
davon **degradiert**, also auf eine schwächere Form zurückfällt, wenn ein Kit sie nicht
bereitstellt. Nichts hier setzt Kit-Interna voraus (die Kit-blind-Regel — siehe
[`docs/de/explanation/the-pack-layer.md`](../../docs/de/explanation/the-pack-layer.md)).

Das Pack bringt **sechs einsatzbereite Jobs** in [`skills/`](./skills/) mit, jeder eine
`SKILL.md` mit `layer: pack`-Frontmatter. Sie folgen der Redaktionskette: Entwurf → Belege →
Stil → Varianten → Freigabe. Sag *„Redaktionsmodus“* (oder auf Englisch *„switch to editor
mode“*) und bitte dann um einen davon:

| Job | Liefert dir |
|---|---|
| [`article-draft`](./skills/article-draft/SKILL.md) | Einen Entwurf in didaktischer Anatomie (Einstieg, Definition mit Analogie *und* ihrer Bruchstelle, Schritte, Vergleich, Kernaussagen, Selbstcheck) plus eine nummerierte Aussagen-Liste. |
| [`glossary-entry`](./skills/glossary-entry/SKILL.md) | Einen Glossar-Eintrag mit seinem Zwilling in Einfacher Sprache und einer Zeile zur Begriffsparität. |
| [`source-wiring`](./skills/source-wiring/SKILL.md) | Eine Quellenkarte: Aussage → Quelle → wörtliches Zitat → Evidenzklasse → Aktion. |
| [`style-pass`](./skills/style-pass/SKILL.md) | Eine Review-Datei mit Befunden — Substanz, Hype, unbelegte Zahlen, Herstellernamen, deine eigene Stimme, Register — im Feedback-File-Format. |
| [`variants-brief`](./skills/variants-brief/SKILL.md) | Die Fassung in Einfacher Sprache für deine Hauptsprache plus einen Übersetzungs-Brief mit einem Term-Sheet, das auf deine Freigabe wartet. |
| [`release-check`](./skills/release-check/SKILL.md) | Eine Pre-Flight-Checkliste vor `/ship`, samt News-Entwurf und Lizenzzeile. |

Jeder Job ist kit-blind (er liest `kit.json` → `capabilities` und nimmt den reichhaltigsten Weg,
den das Kit anbietet, und fällt sonst auf ein einfaches Markdown-Artefakt zurück), schreibt in der
Sprache des Manifests (die mitgelieferten Beispiele sind deutsch) und speichert standardmäßig nach
`out/editor/`. Die Sicherheitsregeln — keine erfundenen Quellen, der Entwurfsstempel, kein
fremder Text in CC-BY-Inhalte, das Veröffentlichen bleibt beim Menschen — stehen in
[`GUARDRAILS.de.md`](./GUARDRAILS.de.md); jeder Job wendet sie an, keiner wiederholt sie. In
[`examples/`](./examples/README.de.md) findest du ein echtes, durchgearbeitetes Ergebnis jedes Jobs.

## Was dieses Pack *nicht* ist — die Grenze zu `/new-content` und `/ship`

`/new-content` erstellt **ein** Artefakt und legt es nach der eigenen Konvention des Kits ab;
`/ship` prüft die Definition of Done, das Changelog und den Build. Das `editor`-Pack ist die
**Redaktionskette davor und danach**: Es formt den Entwurf, verknüpft die Belege, prüft den Stil,
bereitet die Varianten vor und meldet, was noch fehlt — und übergibt dann an `/new-content`
(Ablage) und `/ship` (Freigabe). **Das Pack legt selbst nie Dateien im Kit an.** Wenn du nur ein
einzelnes Artefakt ins Kit schreiben lassen willst, ist `/new-content` der kürzere Weg.

## Aktivierung

Packs werden **konversationell, an Ort und Stelle** eingeschaltet — es gibt keinen
Installationsschritt. Sagt der Nutzer etwas wie *„Redaktionsmodus“*, *„wechsle in den
Redaktionsmodus“* oder *„hilf mir, einen Artikel zu schreiben“* — oder auf Englisch *„switch to
editor mode“* (siehe `activation.phrases` in `pack.json`) —, kündigt der Agent den Wechsel an,
nennt die sechs Jobs und sagt, wo die Kette meist beginnt (`article-draft` für ein Thema,
`glossary-entry` für einen Begriff). Den Modus zu verlassen ist genauso konversationell.

## Aufbau

```
packs/editor/
  pack.json      # das Manifest (validiert durch base/pack.schema.json, geprüft durch scripts/check-packs.mjs)
  README.md      # dieser Wegweiser
  GUARDRAILS.md  # die redaktionellen Regeln des Packs, die jeder Job anwendet (Quellen, Entwurfsstempel, fremder Text, Veröffentlichen)
  skills/        # die sechs Job-Skills, je ein Ordner (SKILL.md, layer: pack)
  assets/        # templates/ — deutsche Vorlagen zum Ausfüllen, eine je Job
  presets/       # editor.preset.md — Profil-Voreinstellungen, die /onboarding übernehmen kann
  examples/      # durchgearbeitetes Ergebnis jedes Jobs an einer erfundenen Eingabe
```

Erzeugtes Material wird standardmäßig nach `out/editor/` geschrieben. Der Ordner wird **mit
Absicht von git erfasst**: Die Entwürfe und Berichte sind die eigene Arbeit des Redakteurs, und ein
Checkpoint-Commit schützt sie vor einem falschen Aufräumen; jede Datei trägt weiterhin ihren
Entwurfsstatus, und Commits bleiben lokal, bis der Nutzer entscheidet, sie zu pushen.
Hilfsskripte und anderes Wegwerfmaterial kommen nach `tmp/` (von git ignoriert), nie neben das
Material.

## Capabilities und Fallbacks

Das Manifest nennt die Capabilities des Kits, die die Jobs nutzen werden, und für jede die
schwächere Capability, auf die sie zurückfallen, wenn sie fehlt. `file:markdown` garantiert die
Base, also ist das der Boden, den jeder Job immer erreicht. Zwei der deklarierten Capabilities —
`content:source` und `content:news` — sind die, die ein Kit am wenigsten wahrscheinlich hat; wo
sie fehlen, bleiben die Quellen-Datensätze in der Quellenkarte und der News-Eintrag in der
Pre-Flight-Datei, als Text, den ein Mensch ablegt. Siehe `pack.json` → `capabilities`.

## Stand

Die Jobs, Vorlagen, Beispiele und Guardrails sind **Entwurfsarbeit, geprüft, aber noch nicht in
einem echten Redaktionsdurchgang eingesetzt**. Die Beispiele sind echte Ergebnisse der Jobs an
einer erfundenen Eingabe mit zwei echten amtlichen Quellen; sie sind Vorführungen, keine
veröffentlichten Inhalte.
