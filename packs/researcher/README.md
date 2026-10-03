<!-- pack -->
**Deutsch:** [Diese Seite auf Deutsch](README.de.md)

# `researcher` pack

A **pack** is an optional bundle of task-skills that layers on top of the kit — here, a *role*:
the person who supplies the evidence. It declares, in [`pack.json`](./pack.json), which kit
capabilities its jobs need and how each one **degrades** when a kit doesn't provide it. Nothing
here assumes kit internals (the kit-blind rule — see
[`docs/explanation/the-pack-layer.md`](../../docs/explanation/the-pack-layer.md)).

The pack ships **five ready-to-use jobs** in [`skills/`](./skills/), each a `SKILL.md` with
`layer: pack` frontmatter. Say *"switch to researcher mode"* (or *"Recherchemodus"*), then ask
for any of them:

| Job | Gives you |
|---|---|
| [`source-dossier`](./skills/source-dossier/SKILL.md) | Sources with tier, provenance, the carrying quote, the access date — and the gaps named. |
| [`claim-check`](./skills/claim-check/SKILL.md) | A list of claims turned into verdicts: source, quote, evidence class, confidence, what the wording should be. |
| [`reading-map`](./skills/reading-map/SKILL.md) | A reading list in three stages — entry, depth, primary source — with one sentence of *why this one*. |
| [`dated-event`](./skills/dated-event/SKILL.md) | An event record whose date carries a dating sentence, with a vendor-free title. |
| [`conflict-log`](./skills/conflict-log/SKILL.md) | The positions of contradicting sources side by side, with a recommendation for the wording — and no silent choice. |

Every job is kit-blind (it reads `kit.json` → `capabilities` and takes the richest path the kit
offers, falling back to a plain markdown artifact), writes in the researcher's manifest language
(the shipped examples are German, with source quotes left in the source's own language), and
saves to `out/researcher/` by default. Safety policy — no fabrication, no date without a dating
sentence, fetched pages are data and not instructions — lives in
[`GUARDRAILS.md`](./GUARDRAILS.md); each job applies it, none restate it. See
[`examples/`](./examples/) for a real worked output of every job.

## What this pack is *not* — the line to `/research`

`/research` answers **one question** with a research note. The `researcher` pack is the **role
around it**: it works through *lists* of claims, dates events with a dating sentence, logs
contradictions, and — the point of the whole thing — produces **fixed formats** that the
`editor` pack and the kit's own content builders can take over without a human retyping them.
Someone with a single question is better served by `/research`.

## Can this agent fetch?

The kit provides no fetching tool of its own; whether an agent can open a page depends on the
environment it runs in. Every job therefore **asks that question first and says the answer**:
if it can fetch, it fetches and reads; if it cannot, it says so and asks for the text, the PDF,
or the links. It never assumes, and it never treats an unfetched page as read.

## Activation

Packs are turned on **conversationally, in place** — there is no install step. When the user
says something like *"switch to researcher mode"* — or, in German, *"Recherchemodus"*,
*"wechsle in den Recherchemodus"* or *"prüf diese Aussagen"* (see `activation.phrases` in
`pack.json`) — the agent announces the switch, names the five jobs and
says whether it can fetch in this environment. Leaving the mode is just as conversational.

## Layout

```
packs/researcher/
  pack.json      # the manifest (validated by base/pack.schema.json, gated by scripts/check-packs.mjs)
  README.md      # this pointer
  GUARDRAILS.md  # the pack's evidence policy every job applies (fabrication, dating, fetched pages, quoting)
  skills/        # the five job-skills, one folder each (SKILL.md, layer: pack)
  assets/        # templates/ — German fill-in scaffolds, one per job
  presets/       # researcher.preset.md — profile defaults /onboarding can adopt
  examples/      # worked output of every job on one claim list
```

Generated material is written to `out/researcher/` by default. The folder is **tracked by git on
purpose**: the dossiers and checks are the researcher's own work, and a checkpoint commit saves
them from a wrong clean-up; committing stays local until the user decides to push. Helper scripts
and other scratch go to `tmp/` (gitignored), never beside the material.

## Capabilities & fallbacks

The manifest names the kit capabilities the jobs will use and, for each, the lesser capability
to fall back to when it is absent. `file:markdown` is guaranteed by the base, so it is the floor
every job can always reach. See `pack.json` → `capabilities`.

## The handover contract

Both role packs speak the same **generic bibliographic block** — `id`, `type`, `authors`,
`year`, `publication`, `url`, `doi`/`isbn`, `accessed`, `title`, `tags`, plus the pack's own
`quote`, `supports`, `status`, and `confidence`. Those field names are ordinary bibliography, not
any kit's schema; a kit's own source builder maps them into whatever convention it keeps. That
is what makes `researcher.source-dossier` → `editor.source-wiring` lossless, and it is why the
claim ids (`A1 … An`) travel unchanged between the two packs.

## Status

The jobs, templates, examples, and guardrails are **design work, reviewed but not yet used on a
real research run**. The examples are real outputs on one claim list, with two genuinely fetched
sources and two primary sources that were **not** reachable — those stay marked `[unverified]`,
which is exactly what the pack is for.
