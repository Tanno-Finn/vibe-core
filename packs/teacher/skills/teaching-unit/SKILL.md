---
name: teaching-unit
description: >
  Sequence several articles/topics into a coherent multi-lesson unit (Unterrichtsreihe) — a
  lesson-by-lesson plan with goals, a through-line, and links to the other teacher jobs for the
  material. Uses the kit's articles when present, else a pasted list of topics. Run it in teacher
  mode on "plan a unit" / "Unterrichtsreihe" / "sequence these into lessons".
layer: pack
capabilitiesUsed: ["content:article", "file:docx", "file:markdown"]
---

# teaching-unit — a planned Unterrichtsreihe

Your job: turn a topic (or a handful of articles) into a **sequence of lessons** with a clear
arc — where the class starts, what each lesson adds, and where they land. This is the *planning*
job that ties the others together: it plans the reihe and points at `worksheet`, `practice-quiz`,
`differentiation`, and `cover-lesson` for the actual per-lesson material. Instructions are
English; **the plan is in the manifest language** (German in the examples).

## Step 1 — the frame

Read `profile/USER-MANIFEST.MD` → Zone 1 and, if active, `packs/teacher/presets/teacher.preset.md`
(**subject, grade band, school type, language level**). Then agree the frame:

- The **overarching topic / Leitfrage** for the whole unit.
- **How many lessons** (default 4–6) and roughly how long each.
- The **exit goal** — what pupils should be able to do at the end (`Am Ende können die Schüler …`).

## Step 2 — gather the building blocks (kit-blind)

Read `kit.json` → `capabilities`:

- **`content:article` present** → list the relevant kit articles and treat each as raw material for
  one or more lessons; note which article feeds which lesson.
- **Otherwise → `file:markdown`**: ask the teacher for the list of topics/texts they want to cover.

Do not invent sources — plan around what actually exists (QUAL-007).

## Step 3 — sequence the unit

Fill `../../assets/templates/teaching-unit.vorlage.md`. A good unit:

- Opens with a **Unit overview**: Leitfrage, Stundenzahl, exit goal, and a one-line rationale for
  the order (`vom Konkreten zum Abstrakten`, `Problem → Modell → Anwendung`, …).
- Gives, **per lesson**, a compact row: *Stunde · Thema · Stundenziel · Kernaktivität · Material ·
  Quelle (article)*. Keep the goals cumulative — each lesson builds on the last.
- Names, per lesson, **which teacher job produces the material** (e.g. *Stunde 2 → `worksheet` aus
  Artikel X*; *Stunde 4 → `practice-quiz`*) and where **differentiation** matters most.
- Ends with an **assessment / Sicherung** note: how the exit goal gets checked (a `practice-quiz`,
  a product, a short presentation).

## Step 4 — output

A unit plan is planning material, so the base **`file:markdown`** path is the natural output: the
overview plus the per-lesson table and the assessment note. Then offer to generate the first
lesson's material via the `worksheet` job.

If the kit declares **`file:docx`**, offer a Word version of the markdown file (screen-reader users,
or a teacher who edits in Word): find the `kit.json` → `tools` entry that provides it and run it
with the material's language (`--lang`). Never write your own converter; if the capability is
absent, the markdown file is the handover.

Save it to `out/teacher/` by default (create the directory if it doesn't exist — it's tracked, so
the material is covered by the next checkpoint commit; why, and what never goes in it:
[`README.md`](../../README.md)). Tell the teacher the exact path.

## Guardrails

Before handover, apply the teacher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md)
(student-data stop, copyright note, draft→checked, AI footer). Don't restate that policy here.
Every generated output **must** carry both stamps: the **T1-C draft stamp** (`Entwurf, ungeprüft`
for German material) at the top and the **T2-B AI footer**.

## Boundaries

- Writing the plan file locally is Green — tell them where it is.
- It's a proposed sequence, not a mandate — the teacher owns the pacing and can reorder freely.
- Plan only around sources that exist; flag gaps as "Material noch zu erstellen" rather than
  pretending an article is there (QUAL-007).
