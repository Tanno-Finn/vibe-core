---
name: differentiation
description: >
  Take one task or text and produce differentiated variants (Differenzierung) — an easier and a
  harder version, plus optional scaffolds — so one class can work at three levels on the same
  topic. Uses the kit's article + glossary when present, else a pasted task. Run it in teacher
  mode on "differentiate this" / "Differenzierung" / "einfachere und schwerere Variante".
layer: pack
capabilitiesUsed: ["content:article", "content:glossary", "file:docx", "check:reading-level", "file:markdown"]
---

# differentiation — same topic, three levels

Your job: take an existing task, text, or worksheet and produce **differentiated variants** so a
mixed-ability class can all work on the same content. The standard output is a three-column
table — *Basis · leichter (⭐) · anspruchsvoller (⭐⭐⭐)* — plus the scaffolds the lower level needs.
Instructions are English; **the variants are in the manifest language** (German in the examples).

## Step 1 — know the class and the starting task

Read `profile/USER-MANIFEST.MD` → Zone 1 (`language`, `reading_level`, `easy_language`) and, if
active, `packs/teacher/presets/teacher.preset.md` (**subject, grade band, language level**).
Then get the **source task**: what should everyone learn, and what's the current (Basis) version?

## Step 2 — get supporting material (kit-blind)

Read `kit.json` → `capabilities`:

- **`content:article` present** → use the kit's article to keep all levels factually aligned.
- **`content:glossary` present** → term definitions are the backbone of scaffolding — offer them
  as a word bank (`Wortspeicher`) for the easier level and as precise-usage prompts for the harder one.
- **Neither** → **fall back to `file:markdown`**: ask the teacher to paste the task/text.

## Step 3 — differentiate (vary the support, not the goal)

Fill `../../assets/templates/differentiation.vorlage.md`. Keep the **learning goal identical**
across levels; change the *support and the demand*, not the topic:

- **leichter (⭐)**: shorter text, simplified sentences, a `Wortspeicher`, sentence starters
  (`Satzanfänge`), a worked example, or multiple-choice instead of open response.
- **Basis**: the original task, cleaned up.
- **anspruchsvoller (⭐⭐⭐)**: less scaffolding, a transfer or justification step (`Begründe…`,
  `Vergleiche…`, `Übertrage auf…`), an extension question, or an open-ended product.

Name the scaffold each level gets so the teacher can hand out the right sheet. If
`easy_language: true`, make the ⭐ column follow Easy-Language rules (one idea per sentence, no
nested clauses, concrete verbs).

## Step 4 — output

Differentiation is planning material, so the base **`file:markdown`** path is the natural output:
a clean three-column table plus the scaffolds below it. (If the teacher then wants each level as a
printable sheet, hand off to the `worksheet` job, which owns the print path.)

If the kit declares **`file:docx`**, offer a Word version of the markdown file (screen-reader users,
or a teacher who edits in Word): find the `kit.json` → `tools` entry that provides it and run it
with the material's language (`--lang`). Never write your own converter; if the capability is
absent, the markdown file is the handover.

If the kit declares **`check:reading-level`**, run its tool on the markdown file with the
material's language (`--lang`, and `--easy` when the ⭐ column follows Easy-Language rules) and
pass the sentences it lists as too long on to the teacher as advice, per level. It is not a gate
and not proof that a text is easy; say so. Absent → read sentence length by eye and say that no
measure ran.

Save it to `out/teacher/` by default (create the directory if it doesn't exist — it's tracked, so
the material is covered by the next checkpoint commit; why, and what never goes in it:
[`README.md`](../../README.md)). Tell the teacher the exact path.

## Guardrails

Before handover, apply the teacher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md)
(student-data stop, copyright note, draft→checked, AI footer). Don't restate that policy here.
Every generated output **must** carry both stamps: the **T1-C draft stamp** (`Entwurf, ungeprüft`
for German material) at the top and the **T2-B AI footer**.

## Boundaries

- Writing the file locally is Green — tell them where it is.
- Differentiate by *support*, never by watering the goal down for named pupils — and never label a
  variant with a real pupil's name (PRIV-001); levels are neutral (⭐ / Basis / ⭐⭐⭐).
- These are drafts — the teacher decides which pupil gets which level.
