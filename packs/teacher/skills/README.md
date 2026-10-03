<!-- pack -->
# `teacher` pack — skills area

The teacher **job-skills** live here, one folder each, every one a `SKILL.md` with YAML
frontmatter carrying `layer: pack` and a `capabilitiesUsed:` list drawn from the ids in
[`../pack.json`](../pack.json) — the same skill shape as `.claude/skills/*/SKILL.md`. Each job is
**kit-blind**: it reads `kit.json` → `capabilities`, uses the richest path the kit offers, and
falls back to `file:markdown` (the base-guaranteed floor) when a richer capability is absent.
Skill *instructions* are English (agent-facing); the material each job *produces* is in the teacher's manifest language (German in the shipped examples)
(pupil- and teacher-facing).

| Slot | Does | Capabilities used (→ fallback) |
|---|---|---|
| [`worksheet`](./worksheet/SKILL.md) | Printable worksheet (Arbeitsblatt) from an article. | `content:article`, `content:glossary`, `file:html-print` → `file:markdown`; `file:pdf` → `file:html-print`; `check:a11y`, `file:docx` → `file:markdown`; `file:html-single` → `file:html-print` |
| [`practice-quiz`](./practice-quiz/SKILL.md) | Practice quiz (Übungsquiz) with an answer key. | `content:article`, `content:glossary`, `file:html-print` → `file:markdown`; `file:pdf` → `file:html-print`; `check:a11y`, `file:docx` → `file:markdown`; `file:html-single` → `file:html-print` |
| [`differentiation`](./differentiation/SKILL.md) | Easier / harder variants (Differenzierung) of a task. | `content:article`, `content:glossary`, `file:docx`, `check:reading-level` → `file:markdown` |
| [`cover-lesson`](./cover-lesson/SKILL.md) | Self-contained cover / substitute lesson (Vertretungsstunde). | `content:article`, `file:html-print` → `file:markdown`; `file:pdf` → `file:html-print`; `check:a11y`, `file:docx` → `file:markdown`; `file:html-single` → `file:html-print` |
| [`teaching-unit`](./teaching-unit/SKILL.md) | Sequences articles into a multi-lesson unit (Unterrichtsreihe). | `content:article`, `file:docx` → `file:markdown` |

The PDF, Word, accessibility, single-file and reading-level steps run the kit's registered tools (`kit.json` → `tools`, found
by the capability they provide), never a converter or check script written on the spot, and
nothing they produce for the agent lands in the teacher's folder.

Shared assets the jobs draw on live in [`../assets/`](../assets/): the print stylesheet
(`print.css`, inlined into printable handouts) and the German fill-in scaffolds under
`assets/templates/`. Teacher-specific profile defaults are in
[`../presets/teacher.preset.md`](../presets/teacher.preset.md). Worked dry-run outputs of every
job are in [`../examples/`](../examples/).

> **Guardrails are a separate concern.** Each job ends by handing off to the teacher guardrails
> (student-data check, AI-authorship note, draft→checked, copyright) — that policy is owned by a
> dedicated guardrails skill, not authored inside these jobs.
