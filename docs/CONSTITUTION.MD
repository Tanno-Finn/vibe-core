<!-- base -->
# Constitution

The small set of stable principles this project is built on. It changes rarely and
deliberately. Where a standard (`base/standards/`) says *what* the bar is, the
constitution says *why we work this way at all*. When something here changes, the
Sync-Impact-Report below records what downstream docs had to move with it.

- **Version:** 1.0.0 (Semver: MAJOR = a principle removed or reversed · MINOR = a
  principle added or materially expanded · PATCH = wording only)
- **Ratified:** 2026-07-17
- **Last amended:** 2026-07-17

<!--
SYNC-IMPACT-REPORT (newest first). Every amendment appends one block. This is the
solution to constitutional drift: an amendment is not done until this report lists the
dependent docs that were updated in the SAME commit.

- 1.0.0 (2026-07-17): Initial ratification.
  Propagated to: AGENTS.md (## Map link + Boundaries), base/standards/*.md (four
  standards realize the principles), overrides/README.md (two-tier mechanic realizes
  Principle 4), specs/README.md (shaping-not-documentation realizes Principle 6).
  No [NEEDS CLARIFICATION] markers open.
-->

## Principles

1. **The user owns irreversible decisions.** The agent proposes; a human disposes of
   anything that can't be taken back — publishing, deploying, deleting, sending, granting
   access. This is not delegable and not automatable away.

2. **The agent keeps the books; the user reads them.** Work is recorded as it happens —
   checkpoint commits, a running journal, honest status — so a non-developer can always
   see where things stand without reading code. State outcomes truthfully, including
   failures and skipped steps.

3. **Security and privacy are the floor, not a feature.** The `[hard]` rules in
   `base/standards/SECURITY.md` and `PRIVACY.md` are never traded away for convenience or
   speed. A breach of an irreversible kind outweighs any deadline.

4. **Standards are defaults you may relax in the open.** Every non-security standard can
   be overridden — but only by a committed file in `overrides/`, which turns the gate
   advisory (visible warning), never off. An undocumented exception does not exist.

5. **Base depends on the contract, not the kit.** The base system programs against
   `kit.json` only. Kit- and framework-specific knowledge stays in the kit. This is what
   lets the platform grow additively.

6. **Shape, don't over-document.** Specs and directives are maps, not encyclopedias.
   Prefer a short doc that links to the source of truth over a long one that copies it
   and rots. Derived views (roadmaps, status docs) yield to the underlying data when they
   disagree.

7. **Meet the learner where they are.** This is an educational product: accessibility and
   plain language are first-class, and the agent adapts its communication to the user's
   profile without changing what is safe.

## Amending this document

Open a spec (`specs/`), state the principle change and its Semver bump, list the docs
that must move with it, and update them in the same commit as this file. Use a
`[NEEDS CLARIFICATION: ...]` marker (max 3, greppable) for any point that can't be
resolved yet — an amendment must close all of its own markers before it ships.
