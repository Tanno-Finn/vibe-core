<!-- base -->
# human-gate — directive

Where an agent's judgment is not enough and a human has to decide, this directive gives you
three reusable ways to *build that decision point in* — so the choice is legible, resumable,
and genuinely the human's. It is about the **shape of the loop**, not about *whether* a given
action needs consent: that line lives in [`base/SAFETY.md`](../base/SAFETY.md) (the tiers, and
the Red-tier go-ahead an irreversible action requires) and rests on Constitution Principle 1
(the user owns irreversible decisions). This directive assumes you already know a human gate
is warranted and shows you how to run one well.

Two kinds of gate live here. A **taste gate** protects choices where there is no single right
answer — wording, layout, visual direction — and the human's preference *is* the spec. A
**quality gate** protects correctness where the agent might be confidently wrong — facts,
teaching, safety of a change — and a human confirms before it ships. The three blocks below
serve one or both.

## The feedback-file loop

For review that comes back with a list of findings, route it through a file instead of
scattering it across chat. The file is the shared, resumable state:

1. The human writes findings into a review file — one entry per issue, each concrete enough to
   act on (what's wrong, and enough to locate it).
2. The agent works the list top to bottom, fixing each finding.
3. The agent flips a per-file status marker (e.g. an unchecked box to `[x] addressed`) and
   records what changed in a short protocol section at the bottom — not silently, so the human
   can diff intent against outcome.
4. The changes travel in a commit whose message names the item and summarizes the fixes.

Why a file and not a chat thread: it survives a context reset, it lets a second agent pick the
loop up mid-way, and the status marker makes "what's left" answerable at a glance. Keep the
docs-in-the-same-commit habit from QUAL-002 — the updated review file *is* part of the change.
State the outcome honestly (QUAL-007): "6 of 7 addressed, one deferred with a note" beats a
blanket "done." How you word that back to the human is [communication](communication.md); how
you *confirm* each fix actually holds is [verification](verification.md).

## Generate N variants, the human picks

When the artifact is taste-dependent — the choice turns on preference, not correctness — do
not guess one answer and present it as final. Produce several *genuine* alternatives and let
the human choose. This keeps the creative decision where Principle 1 puts it, and turns a
vague "is this right?" into a fast concrete pick.

**Use it when** the work splits into many small per-item choices, each with a handful of real
options, and the human wants to *choose* rather than receive a synthesis — for example a
taste-dependent artifact like the phrasing of a heading, a card layout, or a set of visual
options for the same content.

**Don't use it when** the human wants the model's synthesis (asking for one finished essay —
producing five to pick from is waste), when the decision can't be made by looking (semantic
correctness of code is a quality gate, not a taste pick), or when there are so few items that
a plain back-and-forth is faster than setting the pattern up.

Make the variants *differ meaningfully* — several takes on the same safe idea is a false
choice. Present them side by side so the pick costs the human seconds, capture the choice, and
only then wire the winners into the real artifacts. The generation can fan out to parallel
sub-agents (see [orchestration](orchestration.md)); the selection stays with the human.

> **Green / Ask first / Never**
> - **Green:** generate the alternatives, show them side by side, apply the human's pick.
> - **Ask first:** collapsing to one "obvious best" option yourself, or shipping a pick the
>   human hasn't actually made.
> - **Never:** treat a taste call as a correctness call and decide it silently.

## Automatic post-work quality review

After a content-bearing change, run a structured self-review and *surface* the findings —
don't silently apply them. The point is a standing quality gate that catches drift without a
human having to open a ticket for every page.

- **Trigger it after any substantive touch to content.** Skip it for purely mechanical passes
  (a dependency bump, a mechanical translation sync) and during time-critical bulk runs where
  review would be noise.
- **Review the substance first.** The failure mode is a review that only flags technical or
  cosmetic nits and misses that an explanation is wrong or a quiz answer is ambiguous. Spend
  the effort on correctness, teaching quality, and accessibility of the change — not on code
  style a linter already owns.
- **Use a fixed finding format** so findings are actionable and comparable: quote the exact
  text at issue, say what's wrong, give the replacement, and cite why the correction is right.
  A finding you can't quote is a finding you didn't verify. When your own knowledge is thin on
  a factual claim, check a source before asserting a correction (that discipline is
  [verification](verification.md)).
- **Surface, don't auto-apply.** Write the findings where the human reviews them and let the
  human decide: accept, reject, or discuss. Silent "improvements" are exactly what Principle 1
  reserves to the user. Rank findings by severity so the human reads the important ones first,
  and don't invent issues — "this is genuinely fine" is a valid, honest result (QUAL-007).

A related gate lives in [translation-quality](translation-quality.md): a translated variant
does not ship until a human has approved its term sheet. Same shape as the loops here — the
agent prepares, the human decides.
