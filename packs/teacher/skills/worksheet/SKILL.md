---
name: worksheet
description: >
  Turn a topic or an article into a print-ready worksheet (Arbeitsblatt) a teacher can hand
  out. Reads the kit's article + glossary when present, degrades to a pasted text, and prints
  clean A4 or falls back to markdown. Run it in teacher mode on "make a worksheet" /
  "Arbeitsblatt" / "handout from this article".
layer: pack
capabilitiesUsed: ["content:article", "content:glossary", "file:html-print", "file:pdf", "file:docx", "check:a11y", "file:html-single", "file:markdown"]
---

# worksheet — a ready-to-hand-out Arbeitsblatt

Your job: give a teacher a worksheet they can print and use in the next lesson — a title, a
short source text or summary, and a graded set of tasks — without them touching any tooling.
Instructions here are English (for you, the agent); **everything you put on the worksheet is
in the manifest language** (German in the examples), because it goes in front of a class.

Be warm and concrete. A teacher is time-poor: ask the few things you truly need, then produce
the artifact.

## Step 1 — know the class (read, don't interrogate)

Read `profile/USER-MANIFEST.MD` → Zone 1 for `language` and `reading_level`, and — if a teacher
preset is active — `packs/teacher/presets/teacher.preset.md` for **subject, grade band, school
type, class size, language level**. Use those defaults; only ask for what's missing (usually
just the topic and, if unknown, the grade). One or two questions, not a form.

## Step 2 — get the source material (kit-blind)

Read `kit.json` → `capabilities` and choose the richest path the kit actually offers:

- **`content:article` present** → pull the didactic article through the kit's own article
  path and use it as the worksheet's raw material.
- **`content:glossary` present** → pull the relevant term definitions for a vocabulary task
  (`Fachbegriffe`). Optional but nice.
- **Neither present** → **fall back to `file:markdown`**: ask the teacher to paste the text or
  point to a file, and build from that. Never fake a source you don't have (QUAL-007).

## Step 3 — build the worksheet

Fill `../../assets/templates/worksheet.vorlage.md` (the German scaffold). A good Arbeitsblatt has:

- **Kopf**: Titel, Fach/Thema, Klasse, Platz für *Name* und *Datum*.
- **Kurzinput**: 3–6 sentences of source text or a compact summary — enough to solve the tasks.
- **Aufgaben, gestaffelt**: number them and rise in difficulty (reproduce → apply → transfer).
  Mix task types (Lücke, Zuordnung, offene Frage, kleine Zeichnung).
- **Fachbegriffe**: 3–6 key terms with room to note a definition (from the glossary if you have it).
- Optional **Lösungshinweise** on a separate page, so the teacher can print the sheet without them.

Match the language level to the grade band and the manifest's `reading_level` / language level:
short sentences and concrete verbs for a low level; more transfer for a high one. If
`easy_language: true`, write the whole sheet in simplified language.

## Step 4 — output (capability-aware, always a fallback)

- **`file:html-print` present** → render a single self-contained A4 HTML file with the print
  stylesheet **inlined** (copy `../../assets/print.css` into a `<style>` block) so the teacher
  can double-click and print, or email one file. Wrap the page in the `.sheet` container and use
  the classes the CSS defines (`.draft-stamp`, `.handout-head`, `.ab-tag` for the
  Anforderungsbereich, `.answer-lines`, `.answer-key`).
- **Otherwise → `file:markdown`** (the base-guaranteed floor): a clean markdown worksheet that
  still prints acceptably from any editor. Say which path you took and why.

Then check and convert it with the kit's tools. For each capability below, find the
`kit.json` → `tools` entry whose `provides` holds it and run its `run` command (`--help` first):

- **`file:pdf` present** → make the PDF with `--max-pages 1` (a worksheet is one page unless the
  teacher said otherwise; the answer key on its own page counts as one more). On exit 1 shorten
  or tighten the sheet and run it again; pass on any "too wide" warning. Absent → the teacher
  prints the HTML from the browser (`file:html-print`).
- **`check:a11y` present** → check the HTML, with one `--click` per state the sheet has (a
  "show solutions" button, a language switch). Fix every blocking finding and rerun. Absent → add
  a short manual checklist to your handover (headings in order, alt texts, contrast, reading
  order).
- **`file:docx`** → when the manifest (`delivery.assistive_tech`, `accessibility.notes`) or the preset
  mentions screen-reader users, or the teacher asks for Word: convert the same HTML file. Absent
  → hand over the markdown version.
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
[`README.md`](../../README.md)). Give the teacher the exact path.

## Guardrails

Before handing it over, apply the teacher guardrails — see [`../../GUARDRAILS.md`](../../GUARDRAILS.md)
(student-data stop, copyright note, draft→checked, AI footer). Do not restate that policy here.
Every generated output **must** carry both stamps from the top of the material down: the **T1-C
draft stamp** (`Entwurf, ungeprüft` for German material) and the **T2-B AI footer**. A handout
missing either is incomplete.

## Boundaries

- Writing the worksheet file locally is Green (reversible) — just tell them where it is.
- Use only synthetic names/details in examples (PRIV-001); never put a real pupil's data on a sheet.
- Don't paste copyrighted textbook text as the "Kurzinput" — summarize in your own words, or use
  the kit's own article. Publishing/printing at scale is the teacher's call, not yours.
