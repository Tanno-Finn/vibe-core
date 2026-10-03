<!-- pack -->
# Editor pack — guardrails

The six editor jobs (`article-draft`, `glossary-entry`, `source-wiring`, `style-pass`,
`variants-brief`, `release-check`) all run under these guardrails. They are **not a new safety
model** — they are the [base Green/Yellow/Red model](../../base/SAFETY.md) applied to the one
place an editorial role touches sensitive ground: **text that looks as if a human had checked
it, and text that belongs to somebody else.** Where a guardrail must warn, it uses the *one*
[warning format](../../base/SAFETY.md#the-one-warning-format) — never a new shape.

These tighten, they never loosen. They sit on top of the base standards
[`QUALITY`](../../base/standards/QUALITY.md) (QUAL-002/003/007),
[`PRIVACY`](../../base/standards/PRIVACY.md) (PRIV-001/004),
[`SECURITY`](../../base/standards/SECURITY.md) (SEC-005) and the directives
[`content-integrity`](../../directives/content-integrity.md),
[`translation-quality`](../../directives/translation-quality.md),
[`accessibility-workflow`](../../directives/accessibility-workflow.md) and
[`human-gate`](../../directives/human-gate.md) — this file references those ids and rules, it
does not restate them.

Every editor `SKILL.md` links here and treats the Tier-1 rules as preconditions. They are
checked **before** any work **and again at every turn** — third-party text can arrive in the
third message just as easily as in the first, and a guardrail that only looked at the opening
prompt would be trivially smuggled past.

---

## Tier-1 — hard stops (🔴 Red, and not approvable inside the pack)

| # | Rule | Base id / source | The safe path offered instead |
|---|---|---|---|
| E1-A | **No invented sources.** No invented DOI, author, quote, page number, or date — not even "just as an illustration", not even as a placeholder that "will be replaced later". | `content-integrity` ("Do not invent sources"), QUAL-007 | The marker `[Quelle fehlt]` in the claim list, with the candidate you would look for. A draft with markers is complete; a draft with an invented source is not a draft. Hand the gaps to the researcher role (`claim-check`) or to the author. |
| E1-B | **Draft stamp until a human has checked.** Every artifact carries `Entwurf, ungeprüft` (in the language of the material) at the top — except the pack's two report artifacts, named below. **No job removes it — `release-check` included.** Only the author, having said they reviewed it, may take it off. | QUAL-007, `human-gate` (quality gate) | Not a refusal, a required stamp. See [the draft status marker](#the-draft-status-marker). `release-check` reports "stamp present, so point 1 is still open" rather than clearing it. |
| E1-C | **No third-party text into the kit.** More than one or two short, marked, attributed quoted sentences from someone else's material is not taken over — not "paraphrased a bit", not "only that one paragraph". Everything under the kit's content directory ships as **CC BY 4.0**, and neither you nor the author can re-license someone else's rights. | [`LICENSING.md`](../../LICENSING.md), [ADR-0012](../../docs/adr/0012-content-license-cc-by-not-sa.md), `content-integrity` §Anti-plagiarism | Write it new from understanding and cite the source **for the fact**; the search test with two or three distinctive phrases evidences the own voice. The author's own earlier text is not third-party text — if they say they hold the rights, proceed. |
| E1-D | **Publishing is a human act.** No job flips a draft flag, sets a publication date, commits, or pushes. | SEC-005, Constitution Principle 1, [`base/SAFETY.md`](../../base/SAFETY.md) Red | Referenced only — the base carries the rule. `release-check` ends at "ready for `/ship`" and hands over. |

### Why these are Tier-1

An invented source in an educational portal is the most expensive lie the kit can produce — it
gets copied onward, and the copy carries no marker. A missing stamp makes unchecked text *look*
checked, which is the quiet way unreviewed material reaches readers (the same logic as the
teacher pack's T1-C). Third-party text under CC BY is a rights violation the clone cannot
recall once the portal is live.

### When Tier-1 A/C trips — the one warning format

The job stops and answers in the [canonical shape](../../base/SAFETY.md#the-one-warning-format).
Worked example (the author pastes three textbook paragraphs and says "use that as the
Kurzinput"):

> **What could happen:** I'd be putting three verbatim textbook paragraphs into content that
> this kit ships under CC BY 4.0 — a license neither of us can grant for someone else's text.
> **How bad:** Not reversible once published: the passage would be re-licensed under your name
> and could be copied onward under that license.
> **My suggestion:** I'll stop here. Tell me the three facts the paragraphs carry and I'll
> write the input in our own words, citing the textbook for the facts. If you hold the rights
> (your own earlier text), say so and I'll proceed.

Same shape for E1-A: name what would enter the artifact, say that a fabricated citation is not
reversible once it has been quoted onward, and offer the marker plus the search you would run.

### The draft status marker

Every artifact an editor job outputs carries a visible status line, in the **material's own
language**, at the top of the document:

- German material (the shipped examples): **`Entwurf, ungeprüft`**
- English material: **`Draft — unchecked`**

It stays until the author confirms they have reviewed the material. This is a stamp on the
*output*, not a warning to the user — so it does not use the warning format, and (being Green:
a local, additive edit) it never prompts. A job that would emit an artifact without it is
incomplete.

**Two artifacts are exempt by design — the pack's two report artifacts.** The `style-pass`
review file and the `release-check` pre-flight are lists of findings *about* content, not
material that could be mistaken for finished content; stamping a finding list "unchecked" would
drain the stamp of meaning exactly where it matters most. Both carry the AI footer, neither
carries the draft stamp — and the pre-flight's whole point is to report that the *content* still
carries one. There is no third exemption.

---

## Tier-2 — proceed with a note (🟡 Yellow)

The job **does** proceed, leaving a plain one-line note (not the full warning shape — Yellow is
a heads-up, not a go/no-go).

| # | Rule | Base id / source | The note |
|---|---|---|---|
| E2-A | **Vendor neutrality in teaching text.** Product names in explaining or recommending text are replaced by the pattern they stand for; where a concrete name is genuinely needed, it goes into a dated box ("this box ages, the rest doesn't"). Dated events: vendor in the body, never in the title. | [ADR-0013](../../docs/adr/0013-articles-teach-patterns-not-products.md), [ADR-0015](../../docs/adr/0015-timeline-events-are-dated-facts.md) | "Two product names in the teaching text replaced / moved into a dated box — see finding 3." |
| E2-B | **Easy-Language rules and term preservation.** The technical term stays in the Easy variant and gets explained; a request "make it simpler, drop the term" is carried out as "term stays plus explanation". | A11Y-005, `accessibility-workflow`, `translation-quality` §Term preservation | "Kept the term *Kondensation* and explained it — dropping it would be a change of content." |
| E2-C | **Synthetic people and data.** Examples name no real people, pupils, colleagues, or customers. | PRIV-001 | "Example uses an invented name." |
| E2-D | **AI note on drafts.** Every artifact carries the footer `Mit KI-Unterstützung erstellt — vor Verwendung prüfen.` Whether *published* reader-facing text carries a disclosure as well is the portal owner's policy — the preset field `ai_disclosure` (`drafts` or `published`) records it and `release-check` reads it. The pack enforces the footer on artifacts, never a policy on published text. | QUAL-007; teacher pack T2-B | The footer on the artifact; no interruption. |

---

## Why no extra hook (and where enforcement actually lives)

The base ships a [`PreToolUse` hook](../../.claude/hooks/guard-red-actions.mjs) for Red actions
that are **recognizable from a command string** (force-push, `rm -rf /`, a secret path). None of
the Tier-1 rules here are added to it.

A hook sees a tool name and its arguments. Whether a paragraph is somebody else's, whether a
name is a product or a pattern, whether a sentence is a fact or an inference — these are
*semantic* judgments no string match can make. A regex broad enough to catch pasted textbook
prose would fire on every draft, and a guardrail that cries wolf on every job trains the author
to ignore it (see
[cry-wolf prevention](../../base/SAFETY.md#cry-wolf-prevention-a-design-duty-not-a-nicety)).

So Tier-1 lives in **instruction** — this file, checked by each job as a precondition. Where a
kit has a *mechanical* subset of the same concern, that is the kit's business, not the pack's:
`release-check` asks whether the kit's own health checks are green (`kit.json` → `healthChecks`)
and quotes the result, without naming a single script.

## Referenced, not restated

Green/Yellow/Red, the one warning format, cry-wolf prevention (`base/SAFETY.md`) · SEC-001…006,
PRIV-001/004, QUAL-002/003/007 · source tiers and the evidence classes
STRONG/MODERATE/WEAK/MISSING, the URL-health protocol, metadata forensics, the anti-plagiarism
search test (`content-integrity`) · the three levels, the classes C1–C4, the term-sheet JSON
with its `approvedBy`, the anti-hype budget (`translation-quality`) · the plain-language core
rules (`accessibility-workflow`) · the feedback-file loop and "surface, don't auto-apply"
(`human-gate`).
