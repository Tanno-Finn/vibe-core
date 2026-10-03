<!-- base -->
# translation-quality — directive

The quality bar for turning content into another language — the same bar for a button
tooltip and a long essay. It exists because a translation that is only "technically
correct" quietly changes what the reader learns, and multilingual reach is a core promise
of an educational kit. This directive is about *quality* — the levels, the terminology
discipline, the checks. It does **not** own the mechanics of any particular pipeline, nor
the accessibility rule that a simplified path must exist at all: that is
[A11Y-005](../base/standards/A11Y.md). Factual accuracy in source content lives in
[content-integrity](content-integrity.md); this directive extends the same spirit —
*don't change the facts* — into every target language.

## The three levels — all three are required

A translation is finished only when a native reader of the target language meets the
**same author**: same facts, same precision, same voice. Check all three, in order:

1. **Facts.** Numbers, dates, names, sources, examples, and structure are identical to the
   original. Culture-bound details *are* facts — a local marketplace name, a product, a
   study stays exactly as written. Never "localize" a fact away.
2. **Meaning.** The claim and the intent transfer exactly. No creative liberty with
   content.
3. **Language.** Idiomatic, natural to a native speaker. Idioms, metaphors, and
   collocations are replaced with target-language equivalents, never carried across
   word-for-word. The test: if a mental back-translation would land you exactly on the
   original wording, it is too literal.

Level 1 is a factual-accuracy obligation — the same one [content-integrity](content-integrity.md)
sets for source content. A mistranslated number is a wrong fact, not a style choice.

## Terminology — four classes, one hierarchy

Every term the author uses falls into one of four classes, each handled differently:

| Class | What it is | Rule |
|---|---|---|
| **C1 — Author coinage / project term** | A word the author minted, or a name specific to this project | Keep the original spelling in **every** language (usually the original coinage). Never translate, never mangle its inflection. Fixed in the term-sheet. |
| **C2 — Guiding metaphor** | A recurring image the text is built on | Translate it — but as **one** consistent target term per language, identical across title, body, and sibling content. No synonym drift. |
| **C3 — Established domain term** | A real term of art the field already has | Use the field's standard term in the target language. Apply the **sandwich** on first mention (below). |
| **C4 — Proper name / source** | Product names, people, studies, laws, numbers | Never translate, never "correct". The one exception is a work title with an official localized form. |

**When two rules could apply, resolve in this order:** term-sheet → the language's own
guide (`directives/languages/<code>.md`, authored per
[language-guide-authoring](language-guide-authoring.md)) → this directive → general
intuition. "It sounds better in the target language"
is never a reason to deviate from a higher source — raise it with the user instead (a
question is not an order; see [core-principles](core-principles.md)).

**The sandwich principle.** On the *first* mention of a C3 term, give the reader all three
at once: the native/target term, the original term, and a short plain explanation — e.g.
"*target term* (original term) — one clause of what it means". This lets a reader learn the
word instead of just meeting it. After the first mention, the target term alone is enough.

## Term-sheet before bulk translation

Author coinages (C1) and guiding metaphors (C2) are **author decisions**, not translator
decisions. Before any bulk run, the main session drafts a small term-sheet — each term, its
class, its rule, a one-line definition, where it appears — and the **user approves it
first**. Bulk translation over an unapproved term-sheet is exactly the kind of hard-to-undo,
wide-blast-radius action that needs an explicit human go-ahead: see
[human-gate](human-gate.md). Once approved, the sheet is binding for every worker on that
content, and siblings of a series read the already-translated terms before starting, so the
whole set stays consistent.

A minimal shape (store it as data next to the content, in whatever format the kit uses):

```json
{
  "approvedBy": "user",
  "approvedDate": "YYYY-MM-DD",
  "styleNotes": "2-4 sentences: the guiding image, the tone, anything unusual here.",
  "terms": [
    { "term": "<coinage>", "class": "C1", "rule": "keep original in all languages",
      "definition": "one sentence", "occursIn": ["title", "body"] }
  ]
}
```

## Anti-hype budget

Overselling destroys the credibility an educational text runs on. Treat hype words as a
**budget, not a ban**: cap their frequency to a small number per 1000 words, and calibrate
the list and the cap **per language** — each language has its own set of superlatives that
read as marketing (for example, the "revolutionary / game-changing" family and its
equivalents in other languages). A word over budget is a real defect a reviewer removes, not
a matter of taste. Credibility comes from precision; let the facts carry the weight.

## Term-preservation in simplified variants

A simplified (Easy-Language) variant reaches readers who take words literally, so it is its
own editorial product, not a shortened copy — but it does **not** get to dumb down the
vocabulary. The rule is strict and specific:

- **Keep the technical term.** Never silently swap a real term for an everyday
  approximation — inventing a folksy stand-in for an established concept is a hard error,
  because the reader is here to *learn that term*.
- **Always explain it.** Term first, then "that means: …", then a concrete example.
- **Same term in the base and simplified variant** — cross-check so they don't drift apart.

That a simplified path exists at all, and when a niche surface may skip it, is
[A11Y-005](../base/standards/A11Y.md); this directive only governs how terminology behaves
*inside* it.

## Verification — deterministic checks before subjective ones

A translation agent's own word ("all diacritics correct", "valid file") does **not** count
as verification — machine checks and spot-samples do. (Silently stripped diacritics and
broken files have shipped under green self-reports; honest status is
[QUAL-007](../base/standards/QUALITY.md), and proving a change really works is
[verification](verification.md).) Run the cheap, certain checks first; only then spend a
reviewer's judgment.

**Deterministic (script, every delivery):**

- **Parse validity** of every changed file (for a JSON-based pipeline, `JSON.parse` each
  one — see the escaping rule below).
- **Structure parity** with the source: same keys / same block count and order, nothing
  merged, split, added, or dropped.
- **Character hygiene:** no ASCII approximation of diacritics; no Latin transliteration in a
  non-Latin script; a plausible script ratio for the target.
- **Source-language leak scan:** function words or compound prefixes from the source
  language left in the target.
- **Terminology spot-check:** C1 terms present verbatim; the C2 term used with no synonym
  drift; the language's over-budget hype words absent.

**Subjective (human/model judgment, after the scripts pass):** does each idiom land, does
the voice survive, is a simplified variant genuinely simpler and not just shorter. Reserve
model-review passes for this level — don't burn them re-checking what a script can prove.

### JSON-escaping safety rule (JSON-based i18n)

When translations live in JSON, this is a build-safety rule, not a style nicety: **never put
a literal typographic character directly in a JSON value** — no curly quotes, en/em dashes,
or typographic apostrophes as raw code points. Use HTML entities or proper escapes so the
string round-trips. A single raw smart-quote can make a file fail to parse and take the whole
language bundle's build down with it. Validate with a real parse, not by eye.

## Reviewer rules

A reviewer works with the **whole page in context**, never isolated key-value triples. Use
it: hero headlines and body copy carry different registers; a quiz answer must match its
question's tone; a term introduced in the lead must stay consistent to the end. A literal
rendering that a native speaker would never say is **wrong**, even if every individual word
is accurate.

The core reviewer discipline is knowing when to **fix** and when to **flag**:

- **Fix** what you are sure of: an unnatural phrasing, a wrong register, a term-list
  violation, a spelling or grammar error, a script-hygiene problem.
- **Flag** — record the concern, don't change the text — when you are *not* sure a change is
  an improvement, when a fix would touch a **fact** (numbers, dates, proper names: flag,
  never silently rewrite), or when you believe an entry in the binding term-list is itself
  wrong. Flagging routes the decision to a second reviewer or the user instead of burying it.
- **Leave it alone** when the target is already natural and correct. Not every entry needs a
  change; echoing the current text back as a "fix" is noise.

A non-trivial body of translation is itself a change that earns a second set of eyes
([QUAL-003](../base/standards/QUALITY.md)) — a fresh model or a native reader — before it
ships.
