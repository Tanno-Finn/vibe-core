---
name: practice-quiz
description: >
  Build a practice quiz (Übungsquiz / Lernzielkontrolle) on a topic — mixed question types,
  an answer key, and difficulty matched to the class. Uses the kit's article + glossary when
  present, else a pasted text; prints A4 or falls back to markdown. Run it in teacher mode on
  "make a quiz" / "Übungsquiz" / "Test vorbereiten".
layer: pack
capabilitiesUsed: ["content:article", "content:glossary", "file:html-print", "file:pdf", "file:docx", "check:a11y", "file:html-single", "file:markdown"]
---

# practice-quiz — a quiz with an answer key

Your job: produce a usable practice quiz a teacher can hand out — a set of well-formed
questions, a mix of formats, and a separate **Lösungsschlüssel**. Instructions are English;
**the quiz itself is in the manifest language** (German in the examples), because pupils read it.

This is a *practice* quiz by default (formative, for learning) — not a graded exam. If the
teacher wants a real Lernzielkontrolle, say so and keep the answer key on its own page.

## Step 1 — know the class

Read `profile/USER-MANIFEST.MD` → Zone 1 (`language`, `reading_level`) and, if active,
`packs/teacher/presets/teacher.preset.md` (**subject, grade band, school type, class size,
language level**). Ask only for the topic and question count if they aren't obvious. Default to
~8–12 questions unless told otherwise.

## Step 2 — get the source material (kit-blind)

Read `kit.json` → `capabilities`:

- **`content:article` present** → base the questions on the kit's article so they're accurate
  and on-topic.
- **`content:glossary` present** → use term definitions for vocabulary / matching items.
- **Neither** → **fall back to `file:markdown`**: ask for the text or a file reference. Don't
  invent facts to quiz on (QUAL-007) — quiz only what the source supports.

## Step 3 — write the quiz

Fill `../../assets/templates/practice-quiz.vorlage.md`. A good practice quiz:

- **Mixes formats**: Multiple-Choice (one correct, plausible distractors), Wahr/Falsch with a
  *Begründung*, Zuordnung/Matching, Lückentext, and 1–2 open questions (`offene Fragen`).
- **Rises in difficulty** and tags each item lightly (Wissen · Anwenden · Transfer) so the
  teacher can see the spread.
- **Points**: give each question a Punktzahl and a total, so it doubles as a quick check.
- **Answer key**: a complete `Lösungsschlüssel` on a **separate page** — for open questions,
  give an *Erwartungshorizont* (what a good answer contains), not a single rigid solution.

Match wording to the grade band and `reading_level`; if `easy_language: true`, simplify the
question stems and avoid double negatives and nested clauses.

## Step 4 — output (capability-aware, always a fallback)

- **`file:html-print` present** → one self-contained A4 HTML file, print CSS **inlined** from
  `../../assets/print.css`; put the `Lösungsschlüssel` after a page break (the CSS provides a
  `.page-break` helper) so the quiz can be printed without it.
- **Otherwise → `file:markdown`**: quiz and answer key as two clearly separated sections.

Then check and convert it with the kit's tools. For each capability below, find the
`kit.json` → `tools` entry whose `provides` holds it and run its `run` command (`--help` first):

- **`file:pdf` present** → make the PDF with `--max-pages` set to the quiz pages plus the key
  page (usually 2). On exit 1 tighten the quiz and run it again; pass on any "too wide" warning.
  Absent → the teacher prints the HTML from the browser (`file:html-print`).
- **`check:a11y` present** → check the HTML, with one `--click` per state the quiz has (a
  "show answers" button, a checked answer). Fix every blocking finding and rerun. Absent → add a
  short manual checklist to your handover (headings in order, alt texts, contrast, labels on
  answer fields).
- **`file:docx`** → when the manifest (`delivery.assistive_tech`, `accessibility.notes`) or the
  preset mentions screen-reader users, or the teacher asks for Word: convert the same HTML file.
  Absent → hand over the markdown version.
- **`file:html-single`** → when the manifest's `delivery.route` names a school platform
  (Moodle, itslearning …) or e-mail, and the HTML uses files beside it (an image, a font): pack it
  into one file and hand over that file. For Moodle, say to upload it as a *File* resource, because
  a Moodle *Page* strips scripts. Pass on every warning (a picture from the web still needs the
  internet). Absent → hand over the HTML together with the files it uses, in one folder.

Never write your own converter or check script, and never put helper files, screenshots or
reports in the teacher's folder. If a tool is missing or fails with exit 3, say so plainly and use
the fallback; a registered check-up tool (`doctor` in the tool list) names what is missing.

Save it to `out/teacher/` by default (create the directory if it doesn't exist — it's tracked, so
the material is covered by the next checkpoint commit; why, and what never goes in it:
[`README.md`](../../README.md)). Tell the teacher the exact path and how to
print without the key.

## Guardrails

Before handover, apply the teacher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md)
(student-data stop, copyright note, draft→checked, AI footer). Don't restate that policy here.
Every generated output **must** carry both stamps: the **T1-C draft stamp** (`Entwurf, ungeprüft`
for German material) at the top and the **T2-B AI footer**. A quiz missing either is incomplete.

## Boundaries

- Writing the file locally is Green — tell them where it is.
- Never store or process real pupil data; examples use synthetic names (PRIV-001).
- A practice quiz is a draft aid — remind the teacher to check every item and the key before use;
  don't present it as an authoritative graded exam.
