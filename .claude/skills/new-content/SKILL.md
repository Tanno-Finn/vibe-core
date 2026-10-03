---
name: new-content
description: >
  Create a new content artifact — an article, glossary entry, timeline event, or a plain
  document — shaped to scope first and matched to what this kit can actually produce. Run it
  when the user says "new content" / "write an article" / "add a glossary entry" / "make a
  page".
layer: base
capabilitiesUsed: ["check:reading-level", "file:markdown"]
---

# /new-content — make a content artifact

Your job: help the user create one piece of content well — the right *kind*, in the right
language, accessible by default — instead of guessing a format the kit can't build. You are
**kit-blind on purpose**: you don't hard-code "article" or "glossary". You read what the kit
declares and offer only that (Principle 5).

Speak the user's language: read `profile/USER-MANIFEST.MD` → Zone 1 (`language`,
`easy_language`, `reading_level`) and work in it. No manifest yet? Ask once in a short
bilingual line, then continue.

## Step 1 — discover what this kit can make (never assume)

Read `kit.json` → `capabilities` and offer only the content types it lists. A `content:*`
capability means the kit has a real builder for that type; today's kit declares, for
example, `content:article`, `content:glossary`, `content:timeline`, `content:source`,
`content:news`, and `page:interactive`.

**Always offer the fallback:** `file:markdown` is guaranteed by the base, so a plain
markdown document is always available even when no richer capability fits. If the user wants
a type the kit doesn't declare, say so plainly and offer the markdown fallback rather than
faking a builder that isn't there.

## Step 2 — shape the scope first

Before creating anything, agree the shape (shape-first, like the specs convention):

- **What** it is and the one thing it should achieve.
- **Audience** and register — pull from the manifest (`role`, `experience`, `reading_level`)
  rather than re-asking what you already know.
- **Language(s)** — start from the manifest `language`; note which other languages this
  should eventually ship in (the kit's `onboardingExtraQuestions` may already record the
  content languages).
- **Which capability** produces it (from Step 1), or the markdown fallback.

Read the shape back in one or two sentences and get a yes before writing.

## Step 3 — create it

Create the artifact via the chosen capability's builder (follow the kit's own content
conventions for where the file lives and how it's registered), or as a markdown file for the
fallback. Keep it the smallest thing that does the job (QUAL-006); don't pad it with
speculative sections.

## Step 4 — accessibility & translation handoffs

Content is where the A11Y and plain-language standards bite hardest — this is an educational
product (Constitution Principle 7):

- **Easy-Language:** if `A11Y-005` applies and the manifest wants it (`easy_language: true`),
  plan a simplified variant of the primary content — or, if the kit supports it, hand off to
  the Easy-Language path. Don't drop it silently; if a project has a real reason to skip it,
  that's an `overrides/A11Y-005.md`, in the open. When the kit declares `check:reading-level`,
  run the `kit.json` → `tools` entry that provides it on the Easy variant (`--easy`) and pass
  on the sentences it flags: advice, not a gate, and no proof the text is easy.
- **Alt text & contrast:** any image gets a text alternative (`A11Y-002`); don't rely on
  color alone to carry meaning (`A11Y-006`).
- **Translation:** if the content ships in more languages than you just wrote, hand off to
  the kit's translation flow rather than machine-translating inline — flag it as a follow-up
  and name the target languages.

## Handoffs

- Richer capability needed but not declared → `/new-directive` (maybe the kit should gain a
  `content:*` capability), or just use the markdown fallback for now.
- Finished draft that's part of a larger change → `/ship` runs the Definition-of-Done gate
  (docs travel in the same commit, QUAL-002).

## Boundaries

**Green (just do it):**
- Draft and write the content file locally, in the shape the user approved. This is a local,
  reversible action — tell them where you saved it.

**Ask first:**
- Confirm the shape (type, audience, language, capability) before writing.
- Anything that would **publish** the content or make it externally visible — that's a Red
  action owned by the human (SEC-005), handled at `/ship`, not here.

**Never:**
- Fabricate a content type the kit doesn't declare, or claim a builder ran when it didn't
  (QUAL-007). Fall back to `file:markdown` and say so.
- Put real personal data in an example — use synthetic names and details (PRIV-001).
- Silently drop the Easy-Language / accessibility path — plan it or override it in the open.

**Stop and ask if…**
- the user asks for a type the kit doesn't support — offer the markdown fallback or route to
  `/new-directive`, don't improvise a fake pipeline.
- the content involves real people's data, or is meant to go live — that's Red; get explicit
  go-ahead and hand publishing to `/ship`.
- the target audience or language is ambiguous — one clarifying question beats a wrong draft.
