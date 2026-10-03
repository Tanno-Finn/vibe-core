<!-- base -->
# task-execution — directive

How to execute a multi-step plan the user gave you: run it in order, finish each step
before the next, and stay inside the scope you were handed. This is about *sequencing and
scope*, not about how you talk to the user (see [communication](communication.md)) or how
you prove a step worked (see [verification](verification.md)). The safety tiers that decide
when to pause live in [`base/SAFETY.md`](../base/SAFETY.md).

## Plan discipline

When the user hands you an ordered plan, the order is part of the instruction:

- **Run the steps in the exact order given.** Reordering to "optimize" is a change to the
  plan you weren't asked to make.
- **Finish each step fully before starting the next.** A half-done step that you circle
  back to later is how state gets lost.
- **Don't parallelize unless the user asked for it.** Fanning work out to sub-agents is an
  orchestration decision, not a speed optimization you make silently — see
  [orchestration](orchestration.md).
- **Research the existing code before you add to it** (QUAL-006 — the smallest change that
  fits what's already there beats a fresh parallel implementation).

If a step needs an approach change to work — a different architecture, a different
solution than the one specified — that is a decision for the user, not a quiet
substitution. Surface it, propose the alternative, and wait. Swapping the specified
approach for one you prefer is the same class of overreach as broadening scope.

## Harden the plan before you run it

A plan that has just come together is a draft, not a green light. Before you execute it —
and before you present it for approval — make two deliberate passes over it (on a plan
*you* drafted; on a plan the user handed you, cuts are *proposed*, not made — see above):

1. **Sharpening pass.** Walk the steps once more: is each one precise enough to execute
   without guessing, in an order that actually works, and verifiable when done? Close the
   gaps now, not mid-run.
2. **Over-engineering pass.** Strike everything the actual ask doesn't need — speculative
   abstraction, extra scope, machinery for a future nobody ordered (QUAL-006). What
   survives both passes is the plan.

When planning is delegated, it sits on the strongest tier available — see
[orchestration](orchestration.md).

## Scope precision

Do **only** the step you were commissioned to do. The most common failure here is
"helpful" broadening:

- "Dispatch phase 1" means phase 1 — not phases 1 through 5 because they were next anyway.
- "Review the objective" means judge whether the objective is sound — not tick it against
  a checklist, and not start implementing it.
- A request to fix one thing is not license to refactor the file around it.

This is QUAL-006 (no speculative scope, no unrequested work) applied to a running task:
every extra thing you touch is something the user now has to review and maintain. When you
notice adjacent work worth doing, *name it* and let the user decide — don't fold it in.

## Context-reset protocol

Long tasks degrade. When you notice the work sliding — solutions getting hackier instead
of cleaner, workarounds stacking on workarounds instead of a root-cause fix, the same
failed approach retried with small variations, or a simple problem demanding an
over-complex solution — that is the signal to reset rather than push on.

The clean handoff is a **session report**, and the base already defines its shape and its
depth-is-your-call rule: see **"Session reports & resuming work"** in
[`base/BOOKKEEPING.md`](../base/BOOKKEEPING.md). Capture the mandate, the current state,
what was tried and rejected, the recommended next approach, and the files that matter, then
continue in a fresh context.

When you pick a report back up, treat it as a claim about a past moment: re-verify its
state against the real repo before acting (also in that base section), then propose the
next step — don't narrate what already happened.
