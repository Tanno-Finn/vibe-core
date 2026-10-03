<!-- pack -->
**Deutsch:** [Diese Seite auf Deutsch](README.de.md)

# `editor` pack

A **pack** is an optional bundle of task-skills that layers on top of the kit — here, a
*role*: the person who fills the kit with their own subject. It declares, in
[`pack.json`](./pack.json), which kit capabilities its jobs need and how each one **degrades**
when a kit doesn't provide it. Nothing here assumes kit internals (the kit-blind rule — see
[`docs/explanation/the-pack-layer.md`](../../docs/explanation/the-pack-layer.md)).

The pack ships **six ready-to-use jobs** in [`skills/`](./skills/), each a `SKILL.md` with
`layer: pack` frontmatter. They follow the editorial chain: draft → evidence → style →
variants → release. Say *"switch to editor mode"* (or *"Redaktionsmodus"*), then ask for any
of them:

| Job | Gives you |
|---|---|
| [`article-draft`](./skills/article-draft/SKILL.md) | A draft in a didactic anatomy (Einstieg, Definition with analogy *and* its breaking point, steps, comparison, takeaways, self-check) plus a numbered claim list. |
| [`glossary-entry`](./skills/glossary-entry/SKILL.md) | A glossary entry with its Easy-Language twin and a term-parity line. |
| [`source-wiring`](./skills/source-wiring/SKILL.md) | A source map: claim → source → verbatim quote → evidence class → action. |
| [`style-pass`](./skills/style-pass/SKILL.md) | A review file of findings — substance, hype, unsourced numbers, vendor names, your own voice, register — in the feedback-file format. |
| [`variants-brief`](./skills/variants-brief/SKILL.md) | The Easy-Language adaptation of your primary language plus a translation brief with a term sheet that waits for your approval. |
| [`release-check`](./skills/release-check/SKILL.md) | A pre-flight checklist before `/ship`, including a news draft and a license line. |

Every job is kit-blind (it reads `kit.json` → `capabilities` and takes the richest path the
kit offers, falling back to a plain markdown artifact), writes in the manifest language (the
shipped examples are German), and saves to `out/editor/` by default. Safety policy — no
invented sources, the draft stamp, no third-party text into CC BY content, publishing stays
human — lives in [`GUARDRAILS.md`](./GUARDRAILS.md); each job applies it, none restate it. See
[`examples/`](./examples/) for a real worked output of every job.

## What this pack is *not* — the line to `/new-content` and `/ship`

`/new-content` creates **one** artifact and places it in the kit's own convention;
`/ship` checks the definition of done, the changelog, and the build. The `editor` pack is the
**editorial chain before and after them**: it shapes the draft, wires the evidence, reviews the
style, prepares the variants, and reports what is still missing — then hands over to
`/new-content` (placement) and `/ship` (release). **The pack never creates kit files itself.**
If you only want one artifact written into the kit, `/new-content` is the shorter path.

## Activation

Packs are turned on **conversationally, in place** — there is no install step. When the user
says something like *"switch to editor mode"* — or, in German, *"Redaktionsmodus"*, *"wechsle
in den Redaktionsmodus"* or *"hilf mir, einen Artikel zu schreiben"* (see `activation.phrases`
in `pack.json`) — the agent announces the switch, names the six jobs and where the chain usually
starts (`article-draft` for a topic, `glossary-entry` for a term). Leaving the mode is just as
conversational.

## Layout

```
packs/editor/
  pack.json      # the manifest (validated by base/pack.schema.json, gated by scripts/check-packs.mjs)
  README.md      # this pointer
  GUARDRAILS.md  # the pack's editorial policy every job applies (sources, draft stamp, third-party text, publishing)
  skills/        # the six job-skills, one folder each (SKILL.md, layer: pack)
  assets/        # templates/ — German fill-in scaffolds, one per job
  presets/       # editor.preset.md — profile defaults /onboarding can adopt
  examples/      # worked output of every job on one fictional input
```

Generated material is written to `out/editor/` by default. The folder is **tracked by git on
purpose**: the drafts and reports are the editor's own work, and a checkpoint commit saves them
from a wrong clean-up; each file still carries its draft status, and committing stays local until
the user decides to push. Helper scripts and other scratch go to `tmp/` (gitignored), never beside
the material.

## Capabilities & fallbacks

The manifest names the kit capabilities the jobs will use and, for each, the lesser capability
to fall back to when it is absent. `file:markdown` is guaranteed by the base, so it is the floor
every job can always reach. Two of the declared capabilities — `content:source` and
`content:news` — are the ones a kit is least likely to have; where they are missing, the source
records stay in the source map and the news entry stays in the pre-flight file, as text a human
places. See `pack.json` → `capabilities`.

## Status

The jobs, templates, examples, and guardrails are **design work, reviewed but not yet used on a
real editorial run**. The examples are real outputs of the jobs on a fictional input with two
genuine official sources; they are demonstrations, not published content.
