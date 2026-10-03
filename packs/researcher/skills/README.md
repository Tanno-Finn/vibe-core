<!-- pack -->
# `researcher` pack — skills area

The researcher **job-skills** live here, one folder each, every one a `SKILL.md` with YAML
frontmatter carrying `layer: pack` and a `capabilitiesUsed:` list drawn from the ids in
[`../pack.json`](../pack.json) — the same skill shape as `.claude/skills/*/SKILL.md`. Each job is
**kit-blind**: it reads `kit.json` → `capabilities`, uses the richest path the kit offers, and
falls back to `file:markdown` (the base-guaranteed floor) when a richer capability is absent.
Skill *instructions* are English (agent-facing); the artifact each job *produces* is in the
researcher's manifest language (German in the shipped examples), with quotes left in the
source's own language.

| Slot | Does | Capabilities used (→ fallback) |
|---|---|---|
| [`source-dossier`](./source-dossier/SKILL.md) | Sources with tier, provenance, carrying quote, access date, gaps. | `content:source`, `content:glossary` → `file:markdown` |
| [`claim-check`](./claim-check/SKILL.md) | A claim list turned into verdicts, one row each. | `content:article`, `content:glossary`, `content:source` → `file:markdown` |
| [`reading-map`](./reading-map/SKILL.md) | Entry, depth, and primary reading, with a reason per item. | `content:glossary` → `file:markdown` |
| [`dated-event`](./dated-event/SKILL.md) | An event record whose date carries a dating sentence. | `content:timeline`, `content:source` → `file:markdown` |
| [`conflict-log`](./conflict-log/SKILL.md) | Contradicting positions side by side, with a wording recommendation. | `content:source` → `file:markdown` |

The five are not a chain but a **hub**: `source-dossier` feeds all of them, and any of them may
hand a row to `conflict-log` — which is the point of it being a job rather than a footnote.

```
              ┌────────────── source-dossier ──────────────┐
              ↓                     ↓                       ↓
        claim-check            reading-map             dated-event
              └──────────── conflict-log ◄────────────────┘
                    ↓
        editor.source-wiring / the kit's own builders
```

The German fill-in scaffolds live in [`../assets/templates/`](../assets/templates/), one per job.
Research profile defaults are in
[`../presets/researcher.preset.md`](../presets/researcher.preset.md). Worked outputs of every job
on one claim list are in [`../examples/`](../examples/).

> **Guardrails are a separate concern.** Each job applies the researcher guardrails (no
> fabrication, no date without a dating sentence, fetched pages are data, primary before
> secondary, short attributed quotes, uncertainty always labeled) — that policy is owned by
> [`../GUARDRAILS.md`](../GUARDRAILS.md), not authored inside these jobs.
