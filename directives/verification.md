<!-- base -->
# verification — directive

Self-reports are not proof. An agent (or a person) saying "done, it works" is a claim,
not evidence — and the whole value of an agent that reports its own work rests on that
claim being true (`[QUAL-007]`). This directive is how a change earns the word "done": by
being independently checked against something mechanical that no one can talk their way
past. It is the sign-off discipline; how you *find* a cause is [debugging](debugging.md)'s
job, and how you run more than one agent at once is [orchestration](orchestration.md)'s.

## Builder and verifier are different roles

Split the work of making a change from the work of proving it.

- **The builder persists.** It carries the context of what it built and iterates
  efficiently across rounds — it should remember its own decisions.
- **The verifier is fresh and skeptical, each round.** Instantiate it anew every pass,
  with no memory of what it "already approved" last time. Its instruction is to *refute*,
  not to confirm: try to break the change, and when uncertain, default to **not
  verified**. It must be convinced from zero that every stated goal holds — even the ones
  that were green last round, which is how regressions get caught.

This asymmetry is deliberate: **memory in the builder, fresh doubt in the checker.** Three
parties agreeing "it's done" is not proof if they share the same blind spot; the point is
*independent* checks, and a checker with no sunk cost and no relationship to the builder
is the cheapest independent check there is. A second independent model, or a human, is the
`[QUAL-003]` second-set-of-eyes made adversarial. See [orchestration](orchestration.md)
for running the two as separate agents.

## Reproduce or it didn't happen

A defect counts only with an executable reproduction — a failing assertion with its
output, or a screenshot showing the fault, with a path to it. No reproduction, no finding:
don't file it, and don't let one through. Symmetrically, "fixed" counts only with an
artifact you re-ran yourself and watched pass. Prose is not evidence in either direction.

## The judge does the mechanical check, not vibes

Whoever signs off does exactly one thing: **runs the thing and reads the result** — does
it actually build, run, pass? That check is the floor, and it is un-talk-past-able
precisely because it is mechanical. Don't trust an exit code alone if the tool can fail
silently — read the actual output. Judge artifacts (the diff, the reproduction, the
screenshot, the test output), never persuasiveness. What you did not measure yourself is
not "done".

## The verification-first protocol

Before a change is finished:

1. **Minimal fix.** Change the smallest thing that solves the stated problem — no scope
   the goal didn't ask for.
2. **A test that would fail without the change** (`[QUAL-004]`). The proof the behavior
   works now and the alarm when it later breaks. Test the real contract, not inputs that
   can't occur.
3. **A gate before any destructive action.** Anything irreversible or outward-facing
   stops for an explicit human go-ahead before it runs — see [`base/SAFETY.md`](../base/SAFETY.md)
   for which actions those are and the one warning format. (Don't restate the tiers here;
   link and defer.) The gate is the same idea as this whole directive: prove it holds
   *before* you can't take it back.

## Why a second, adversarial pass earns its cost

It is tempting to skip the fresh check — the builder already looked, and looking twice
costs a round. Two recurring patterns say otherwise:

- **Independent reviews still miss real defects.** A whole panel of careful reviewers can
  sign off on completeness while a plain, obvious fault sits on the live page — because
  every reviewer analyzed the *description* of the thing and none *exercised* the thing.
  The defect surfaces the moment one fresh pass actually runs it.
- **Some defects hide until the code is documented.** A bug can stay invisible through
  review after review and only reveal itself when someone sits down to write the docs for
  the code and has to state, in plain words, what it actually does — at which point the
  contradiction is obvious.

Both are the same lesson: a builder's own confidence is correlated with its blind spots.
A fresh pass told to *refute*, exercising the real thing, finds what agreement never will.
That is what the extra round buys, and why it is worth its cost.
