<!-- pack -->
**Deutsch:** [Diese Seite auf Deutsch](README.de.md)

# `teacher` pack

A **pack** is an optional bundle of task-skills that layers on top of the kit — here, a
*role*: the teacher. It declares, in [`pack.json`](./pack.json), which kit capabilities its
jobs need and how each one **degrades** when a kit doesn't provide it. Nothing here assumes
kit internals (the kit-blind rule — see
[`docs/explanation/the-pack-layer.md`](../../docs/explanation/the-pack-layer.md)).

The pack ships **five ready-to-use jobs** in [`skills/`](./skills/), each a `SKILL.md` with
`layer: pack` frontmatter. Say *"switch to teacher mode"* (or, in German, *"Lehrkraft-Modus"*),
then ask for any of them:

| Job | Gives you |
|---|---|
| [`worksheet`](./skills/worksheet/SKILL.md) | A print-ready Arbeitsblatt with tasks and an answer key. |
| [`practice-quiz`](./skills/practice-quiz/SKILL.md) | An Übungsquiz with mixed question types and a Lösungsschlüssel. |
| [`differentiation`](./skills/differentiation/SKILL.md) | Easier / harder variants of one task, same learning goal. |
| [`cover-lesson`](./skills/cover-lesson/SKILL.md) | A self-contained Vertretungsstunde a stand-in can run cold. |
| [`teaching-unit`](./skills/teaching-unit/SKILL.md) | A multi-lesson Unterrichtsreihe that sequences the others. |

Every job is kit-blind (it produces a polished print handout where the kit can, and a plain
markdown artifact where it can't), writes teacher material in the manifest language (the
shipped examples are German), and saves to `out/teacher/` by default. Safety policy — student-data stop, draft→checked stamp, AI footer, copyright — lives
in [`GUARDRAILS.md`](./GUARDRAILS.md); each job applies it, none restate it. See
[`examples/`](./examples/) for a real worked output of every job.

## Activation

Packs are turned on **conversationally, in place** — there is no install step. When the user
says something like *"switch to teacher mode"* — or, in German, *"wechsle in den
Lehrkraft-Modus"*, *"ich bin Lehrerin"* or *"Arbeitsblatt erstellen"* (see `activation.phrases`
in `pack.json`) — the agent announces the switch and offers the pack's jobs. Leaving the mode is just as
conversational.

## Layout

```
packs/teacher/
  pack.json      # the manifest (validated by base/pack.schema.json, gated by scripts/check-packs.mjs)
  README.md      # this pointer
  GUARDRAILS.md  # the pack's safety policy every job applies (student-data, draft, AI footer, copyright)
  skills/        # the five job-skills, one folder each (SKILL.md, layer: pack)
  assets/        # print.css (inlined into handouts) + templates/ (German fill-in scaffolds)
  presets/       # teacher.preset.md — profile defaults /onboarding can adopt
  examples/      # worked dry-run output of every job on a fictional input
  pilot/         # the pilot kit for trying the pack with real teachers (German + English, see below)
```

Generated material is written to `out/teacher/` by default, so a teacher always knows where to
find the last handout. The folder is **tracked by git on purpose**: the handouts are the
teacher's own work, and a checkpoint commit is what saves them from a wrong clean-up — pupil data
never reaches them (Tier-1 stop in [`GUARDRAILS.md`](./GUARDRAILS.md)), and committing stays local
until the teacher decides to push. Helper scripts, screenshots and other scratch go to `tmp/`
(gitignored), never beside the material.

## Erprobung (pilot)

The pack has **not yet been tried with real teachers** — the jobs, templates, examples, and
guardrails are design work, reviewed but unpiloted. Everything a small pilot needs sits in
[`pilot/`](./pilot/): a moderation guide for a 60–90-minute session with two or three
teachers, a before/after questionnaire, an observer sheet, a consent form, and an evaluation
template that turns two or three sessions into findings, backlog entries, and one measured
sentence. The materials are written in German, like the pack's examples, and each has an English
translation beside it (`*.en.md`); the kit owner organizes the teachers and the date. Until that evaluation exists, this paragraph and the status note in the
kit's README stay as they are.

## Capabilities & fallbacks

The manifest names the kit capabilities the jobs will use and, for each, the lesser
capability to fall back to when it is absent. `file:markdown` is guaranteed by the base, so it
is the floor every job can always reach. See `pack.json` → `capabilities`.
