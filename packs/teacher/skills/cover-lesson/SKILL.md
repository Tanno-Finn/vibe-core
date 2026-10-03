---
name: cover-lesson
description: >
  Assemble a self-contained cover / substitute lesson (Vertretungsstunde) a stand-in teacher can
  run with zero prep — clear timing, pupil tasks, and everything on paper. Uses the kit's article
  when present, else a pasted topic; prints A4 or falls back to markdown. Run it in teacher mode
  on "cover lesson" / "Vertretungsstunde" / "I'm out tomorrow".
layer: pack
capabilitiesUsed: ["content:article", "file:html-print", "file:pdf", "file:docx", "check:a11y", "file:html-single", "file:markdown"]
---

# cover-lesson — a Vertretungsstunde that runs itself

Your job: produce a **self-contained** lesson a substitute — who may not know the subject — can
pick up and run for one period. The test is: *could someone who has never met this class deliver
it from this sheet alone?* Instructions are English; **the lesson and pupil material are in the manifest language** (German in the examples).

Assume the cover teacher has no context and no time. Everything they and the pupils need is on the
page: what to say, what pupils do, and a fallback if pupils finish early.

## Step 1 — the constraints

Read `profile/USER-MANIFEST.MD` → Zone 1 and, if active, `packs/teacher/presets/teacher.preset.md`
(**subject, grade band, school type, class size, language level**). Then confirm the three things
that shape a cover lesson: **topic**, **lesson length** (default 45 min), and whether it should
**advance the syllabus or be a stand-alone consolidation** (a cover lesson is usually the latter —
low-risk, no new hard content, no equipment).

## Step 2 — get the content (kit-blind)

Read `kit.json` → `capabilities`:

- **`content:article` present** → build the pupil reading around the kit's article so the
  substitute doesn't need subject knowledge.
- **Otherwise → `file:markdown`**: ask for a topic or short text. Keep the content self-explanatory
  so a non-specialist can supervise it.

## Step 3 — assemble the lesson

Fill `../../assets/templates/cover-lesson.vorlage.md`. A cover lesson has two parts:

**A — Für die Vertretung (teacher sheet):**
- **Stundenziel** in one sentence, and a **Ablauf** with minute markers
  (Einstieg → Arbeitsphase → Sicherung → Puffer).
- **Ansagen**: the exact one or two sentences to say to the class.
- **Material-Check** (only no-prep items — paper, the printed sheet), **Regeln/Classroom-Management**,
  and a **Wenn-fertig / Puffer** task so no one is idle.

**B — Für die Klasse (pupil sheet):**
- A short reading or recap and a set of tasks pupils can do **independently and silently** —
  self-checking where possible (a mini answer box the substitute can read out at the end).

Keep the demand modest and the instructions unambiguous; a cover lesson should never depend on
subject expertise or on equipment that might not be there.

## Step 4 — output (capability-aware, always a fallback)

- **`file:html-print` present** → one self-contained A4 HTML file, print CSS **inlined** from
  `../../assets/print.css`, with a `.page-break` between the teacher sheet and the pupil sheet so
  each prints on its own page.
- **Otherwise → `file:markdown`**: the two sheets as two clearly separated sections.

Then check and convert it with the kit's tools. For each capability below, find the
`kit.json` → `tools` entry whose `provides` holds it and run its `run` command (`--help` first):

- **`file:pdf` present** → make the PDF with `--max-pages 2` (teacher sheet plus pupil sheet,
  unless the teacher said otherwise). On exit 1 tighten the sheets and run it again; pass on any
  "too wide" warning. Absent → the teacher prints the HTML from the browser (`file:html-print`).
- **`check:a11y` present** → check the HTML, with one `--click` per state the page has. Fix every
  blocking finding and rerun. Absent → add a short manual checklist to your handover (headings in
  order, alt texts, contrast, reading order).
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
[`README.md`](../../README.md)). Tell the teacher the exact path and remind
them to print both sheets.

## Guardrails

Before handover, apply the teacher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md)
(student-data stop, copyright note, draft→checked, AI footer). Don't restate that policy here.
Every generated output **must** carry both stamps: the **T1-C draft stamp** (`Entwurf, ungeprüft`
for German material) at the top of each sheet and the **T2-B AI footer**.

## Boundaries

- Writing the file locally is Green — tell them where it is.
- No real pupil names or class data on the sheet (PRIV-001) — the substitute doesn't need them.
- It's a draft plan: the class teacher should skim it before leaving it for a colleague.
