---
name: translate
description: >
  Translate a document the user made with the kit (a handout, a worksheet, a letter, a page as
  HTML or Markdown) into one or more languages, and hand over each language as HTML, Word and
  PDF, marked as an unchecked draft. Right-to-left languages (Arabic, Persian, Hebrew …) are laid
  out correctly. Run it when the user says "übersetze" / "translate this" / "auf Türkisch und
  Arabisch" / "in mehreren Sprachen" / "for the parents in their language".
layer: base
capabilitiesUsed: ["file:docx", "file:pdf", "check:a11y", "check:reading-level", "file:markdown"]
---

# /translate — one document, several languages

Your job: turn one finished document into the same document in other languages, so that each
version looks and works like the original — same structure, same page count, correct language
and reading direction — and nobody mistakes a machine translation for a checked one.

Talk to the user as [`directives/communication.md`](../../../directives/communication.md) says:
result first, plain words. The quality bar is
[`directives/translation-quality.md`](../../../directives/translation-quality.md); read its
three levels and the draft marker before you start.

## Step 1 — pin down four things (ask only what you cannot see)

1. **The source file.** A `.html` or `.md` the kit made (usually under `out/`). A Word file the
   user brings cannot be read by the kit's tools: ask them to save it from Word as "Web page
   (.htm)" or to paste the text, and say why in one sentence.
2. **The target languages**, as codes you confirm back in words ("Turkish, Ukrainian and
   Arabic — right?").
3. **Who reads it** (learners, parents, colleagues) and whether it should be in easy language.
   That sets the register; take it from the manifest (Zone 1 `audience`, `delivery`) if it is
   there.
4. **What must stay unchanged**: names, product names, technical terms the reader learns in
   the source language (a worksheet on German grammar keeps its German examples).

## Step 2 — translate, one file per language

- For more than about a page, write a short term sheet first (translation-quality §"Term-sheet
  before bulk translation") and keep every term consistent across the languages.
- Write `<name>.<code>.html` (or `.md`) next to the source. Never overwrite the source.
- Set the language and direction on the root: `<html lang="tr">`; for a right-to-left
  language also `dir="rtl"` (`ar`, `fa`, `he`, `ur`, `ps` …). A quote that stays in the source
  language gets its own `lang` (and `dir="ltr"` inside a right-to-left page).
- Translate every visible text **and** the invisible ones: `<title>`, `alt` texts,
  `aria-label`s, table headers, the footer.
- Keep structure, classes, numbering, blanks and answer lines exactly as they are, so the page
  count stays the same.
- The draft marker stays, in the target language (e.g. `Taslak, kontrol edilmedi`,
  `Чернетка, не перевірено`, `مسودة، لم تتم مراجعتها`), and so does the note that AI helped.
  Nothing machine-translated may look checked.

## Step 3 — check each language with the kit's tools

For each capability below, find the `kit.json` → `tools` entry whose `provides` holds it and
run its `run` command (`--help` first):

- **`check:a11y`** on each HTML file: it catches a missing or wrong `lang`, contrast and
  headings. Fix every blocking finding.
- **`file:pdf`** with `--max-pages` set to the source's page count. On exit 1 the translation
  runs longer (German → Turkish often does): tighten spacing or wording, never drop content.
- **`file:docx`** for each language, when the user wants Word or a reader uses a screen
  reader. The tool reads `lang` and `dir` from the file and lays out right-to-left languages
  mirrored. It warns when Word has no region for a language: pass that on.
- **`check:reading-level`** when the version is meant to be easy language (numbers are advice).
- Absent capability → say which check is missing and give the manual one-line check instead.

## Step 4 — hand over

A short list per language: the HTML, PDF and Word file with their full paths. Then, in
plain words:

- **Who should check it:** someone who speaks the language well, before it goes out, and why
  (a machine translation can be fluent and still wrong about a fact or a tone).
- **What the tools checked** (language marked, layout, page count) and **what they cannot**
  (whether the translation is right).
- **Fonts:** scripts that need their own font (Amharic, Tigrinya, Tamil …) may show as boxes
  in Word on a computer without that font. Say so when it applies.

## Boundaries

- Writing new files next to the source is **Green**. Overwriting the source or sending a
  translation anywhere (e-mail, a platform) is not this skill's job — the user does that.
- Personal data in the document (a pupil's name, a parent's address) stays out of any online
  service; translate here, in the session, or leave the name as is.
