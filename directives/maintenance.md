<!-- base -->
# maintenance — directive

How to **care for the product over time**: pay down technical debt, consolidate what has
grown crooked, and keep tests, docs, and dependencies from quietly rotting. A codebase
is a garden, not a monument — but the gardener proposes and the owner decides:
**a maintenance pass is always announced and always a list the user picks from, never
silent side-work** ([stewardship](stewardship.md)). Nobody asked for a weeded garden and
got their roses refactored.

## When a pass happens

- **On request** — the user says "maintenance", "clean up", "how healthy is this?".
- **Offered, not imposed** — when signals accumulate during normal work (the third
  copy-paste of the same block, a test suite that no longer covers what changed, a pile
  of TODOs), *say so once* and offer a pass. If the user declines, park it in
  `OPEN-QUESTIONS.md` and move on.
- Never as a stowaway inside an unrelated task (QUAL-006 — no unrequested scope).

## The survey — what to actually look at

Walk these axes and collect findings with evidence (file:line, counts), not vibes:

- **Duplication & consolidation** — the same logic or markup living in several places;
  components that should share a base; parallel mechanisms doing one job.
- **Dead weight** — unused exports, unreachable routes, orphaned assets and i18n keys,
  dependencies nothing imports. (Deletion is Yellow: checkpoint first, then remove.)
- **Test coverage where it matters** — not a percentage fetish: which *recently changed
  or load-bearing* behavior has no test that would fail if it broke (QUAL-004)?
- **Dependency staleness** — how far behind are the majors, which ones carry known
  advisories (hand those to [security-workflow](security-workflow.md)), which are
  abandoned upstream?
- **Doc drift** — places where README, ADRs, or content docs describe a world the code
  has left behind. Check the gates still gate (drift checks, harness).
- **Declared debt** — the TODO/FIXME inventory and every debt the journal or past
  commits took "for now". "For now" has a shelf life.

## The report — findings become choices

One prioritized list, each entry in this shape:

> **Finding** (with evidence) — **why it costs something** if left (in plain language:
> "every new demo copies this bug", "next Angular major will break here") — **suggested
> smallest fix** — **rough effort**.

Priority = cost of leaving it × how load-bearing the area is, not how offended the code
makes you feel. Then the user picks what gets done ([human-gate](human-gate.md)); what
they park goes to `OPEN-QUESTIONS.md` with the reason. **Debt knowingly kept is a
decision and fine; debt nobody knew about is the only bad kind.**

## Executing the picked items

- One finding at a time, smallest change that resolves it, checkpoint commit per item
  ([BOOKKEEPING](../base/BOOKKEEPING.md)) — a maintenance pass must be abortable at any
  point with the tree green.
- Behavior-preserving is the default claim, so prove it: the existing tests (plus the
  ones a finding said were missing) run green after each item, not just at the end.
- A consolidation that changes the architecture is a decision → offer `/adr`.
- Finish through the `/ship` gate like any other work; the changelog line says what got
  healthier.
