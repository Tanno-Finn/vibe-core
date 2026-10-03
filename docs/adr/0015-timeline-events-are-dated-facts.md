# ADR-0015 — Timeline events are dated facts; vendor names live in the body, not the title

**Status:** accepted · **Date:** 2026-09-03

## Context

The kit ships an AI timeline as one of its content types: language-neutral event records in
`src/assets/data/core/timeline/` (id, date, category, importance, `sources`, `people`,
`organizations`) paired with per-language text in `src/assets/data/translations/timeline/<lang>/`
(`title`, `description`, optional `details[].text`). Today those are three placeholder seeds;
every real event a downstream portal writes will be about something that happened, and a
large part of what happened in AI history happened at a named company.

[ADR-0013](0013-articles-teach-patterns-not-products.md) settled the question for teaching
text: recommendations and explanations name no products, and concrete products appear only in
dated aging boxes. It also said, in one line under "unchanged by this decision", that
historical facts stay free. That line was never turned into a rule anyone could follow or
check. It leaves two things open that a timeline author hits immediately: whether an event
*title* may carry the vendor name, and whether anything about this is enforced.

What was measured before deciding (2026-09-03):

- `scripts/check-genericity.mjs` reads **only** `src/assets/i18n/modules/**`. Timeline event
  data was outside every gate in the kit.
- Its denylist matches **origin branding** — the identity of the project this kit was
  extracted from and ISBN shapes. It contained, and was never meant to contain, any
  vendor pattern. ADR-0013 says as much: "the genericity gate is deliberately narrow and
  blocks only origin branding, not AI vendor names."
- The denylist entry shape was documented as `[pattern, reason, allowlist of
  "namespace:keyPath" exceptions]`, but the third element was neither implemented in the
  scan loop nor used by any entry.

So the honest starting position was: nothing about vendor names was enforced anywhere, and a
per-namespace allowlist could not exempt anything, because there was nothing to exempt from.

## Options considered

- **A — Dated facts, vendor-free titles.** A timeline event is a dated fact: it recommends
  nothing and does not age, because the date is part of the statement. Vendor names are
  therefore allowed in event data — but only in the body (`description`, `details[].text`),
  never in the `title`.
- **B — Paraphrase the vendor away.** Write "a major vendor released…" and keep every field
  neutral. Rejected: it obscures a verifiable fact behind a vague label, makes the claim
  harder to check against the event's own sources, and buys neutrality the reader never
  asked for. A fact that cannot name its subject is a worse fact.
- **C — Drop the events that need a vendor name.** Rejected: it cuts exactly the moments that
  give a learner historical footing — the releases and papers a glossary entry points back
  to. A timeline without them is a timeline of things nobody remembers.

## Decision

**Option A.** Timeline events are dated facts and may name vendors and products, under four
conditions:

1. **Body only.** Vendor and product names belong in `description` and `details[].text`. The
   `title` stays vendor-free — "Open tool-connection standard MCP appears", not
   "Vendor X publishes MCP". Titles are the field that travels: list pages, navigation,
   search results, related-content snippets, and card teasers render the title alone, out of
   its dated context, where a product name reads as a mention rather than as a record.
2. **Provenance per mention.** An event that names a product carries at least one entry in
   its core record's `sources` array pointing at the primary announcement or paper. A name
   without a source is an unsupported claim, and
   [content-integrity](../../directives/content-integrity.md) already says what that is worth.
3. **No ranking, no evaluation.** State what shipped and when. Superlatives, "the leading",
   comparisons between vendors, and anything that reads as a recommendation belong to
   ADR-0013's teaching text, where they are not allowed either.
4. **Person names are untouched.** They were never restricted, in any content type, and this
   decision does not change that.

This scope is exactly timeline event data. Article prose, glossary entries, and i18n chrome
stay under ADR-0013 as before.

**Enforcement.** `scripts/check-genericity.mjs` gains a second scan over
`src/assets/data/translations/timeline/**`:

- The existing origin-branding denylist now runs over timeline event data too — origin
  branding is a leak wherever it appears.
- A new, short vendor denylist (`Anthropic|OpenAI|Google|Microsoft|Meta|Amazon|Apple|Nvidia`,
  word-boundary) runs over timeline event data only, with the documented
  `namespace:keyPath` allowlist now implemented and carrying exactly two exceptions:
  `timeline-event:description` and `timeline-event:details.*.text`. Title and every other
  field stay sharp.
- `SELFTEST=1 node scripts/check-genericity.mjs` proves the distinction on planted in-memory
  documents: a vendor name in a title fails, the same names in description and details pass,
  a branding marker in an event still fails, and the body exception does not leak into another
  namespace. The kit has no `scripts/*.test.mjs` convention; `SELFTEST=1` is the pattern the
  other gates use (`check-contrast.mjs`).

## Consequences

- The rule that mattered most is the one that is now machine-checked: the title. The rest of
  the ADR-0013 boundary — what counts as teaching text, whether a mention is a recommendation
  — stays an editorial criterion in review, because judging it needs intent and a regex has
  none.
- The vendor denylist is deliberately a short list of names, not an attempt at completeness.
  It covers the vendors that actually appear in AI timeline entries. A title naming a vendor
  outside the list passes the gate and must be caught in review; extending the list is a
  one-line change with the same word-boundary shape.
- Downstream portals whose subject is not AI will want other names in that list, or none.
  The list is a constant at the top of the gate, next to the branding denylist, for that reason.
- Timeline event data is now inside a gate for the first time, which also means origin
  branding can no longer be smuggled into a portal's events. The cost is that a portal
  legitimately writing about the origin brand would have to say so somewhere other than a
  timeline event — the same trade the i18n scan has always made.
- `check-genericity` now reports what it covered (310 i18n module files, 6 timeline event
  files on the seed tree), so a scan that silently stops finding files is visible instead of
  passing vacuously.
- The allowlist mechanism its header comment always described is real now. Any future denylist
  entry can carve out a namespace and key path without a code change.
