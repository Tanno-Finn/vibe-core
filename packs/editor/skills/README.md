<!-- pack -->
# `editor` pack — skills area

The editor **job-skills** live here, one folder each, every one a `SKILL.md` with YAML
frontmatter carrying `layer: pack` and a `capabilitiesUsed:` list drawn from the ids in
[`../pack.json`](../pack.json) — the same skill shape as `.claude/skills/*/SKILL.md`. Each job is
**kit-blind**: it reads `kit.json` → `capabilities`, uses the richest path the kit offers, and
falls back to `file:markdown` (the base-guaranteed floor) when a richer capability is absent.
Skill *instructions* are English (agent-facing); the artifact each job *produces* is in the
author's manifest language (German in the shipped examples).

The six jobs are a **chain**, not a menu — each one's output is the next one's input. An author
can enter anywhere, and no job insists that the previous one has run.

| Slot | Does | Capabilities used (→ fallback) |
|---|---|---|
| [`article-draft`](./article-draft/SKILL.md) | Draft in the didactic anatomy + numbered claim list. | `content:article`, `content:glossary` → `file:markdown` |
| [`glossary-entry`](./glossary-entry/SKILL.md) | Glossary entry + Easy variant + parity line. | `content:glossary` → `file:markdown` |
| [`source-wiring`](./source-wiring/SKILL.md) | Source map: claim → source → quote → evidence class → action. | `content:source`, `content:article`, `content:glossary` → `file:markdown` |
| [`style-pass`](./style-pass/SKILL.md) | Findings on style, register, hype, vendor names, own voice. | `content:article`, `content:glossary`, `check:reading-level` → `file:markdown` |
| [`variants-brief`](./variants-brief/SKILL.md) | Easy adaptation of the primary language + translation brief with term sheet. | `content:article`, `content:glossary`, `content:timeline` → `file:markdown` |
| [`release-check`](./release-check/SKILL.md) | Pre-flight checklist + news draft, handing over to `/ship`. | `content:news`, `content:article`, `content:glossary`, `content:timeline`, `check:reading-level` → `file:markdown` |

```
article-draft ──┐
glossary-entry ─┴─→ source-wiring ─→ style-pass ─→ variants-brief ─→ release-check ─→ /ship
                         ↑ claim list also goes to the researcher role, if there is one
```

The German fill-in scaffolds the jobs work from live in
[`../assets/templates/`](../assets/templates/), one per job. Editorial profile defaults are in
[`../presets/editor.preset.md`](../presets/editor.preset.md). Worked outputs of every job on one
fictional input are in [`../examples/`](../examples/).

> **Guardrails are a separate concern.** Each job ends by applying the editor guardrails (no
> invented sources, draft stamp, no third-party text, publishing stays human, AI footer) — that
> policy is owned by [`../GUARDRAILS.md`](../GUARDRAILS.md), not authored inside these jobs.
