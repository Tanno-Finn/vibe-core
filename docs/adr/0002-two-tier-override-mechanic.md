# 2. Standards are defaults you may relax in the open

Status: accepted

## Context and Problem Statement

A starter kit ships opinionated standards (accessibility, quality, privacy). Real projects
have legitimate reasons to bend some of them — a throwaway prototype may skip an Easy-Language
variant, a niche internal tool may not need consent-gated analytics. If the standards are
absolute, people fork or ignore them silently; if they are toothless, they mean nothing. How
do we let a project relax a standard *without* the relaxation becoming invisible?

## Decision Drivers

- An exception must be **visible and attributable**, never a silent edit.
- Security and privacy-of-people must stay non-negotiable.
- A relaxed rule should still *warn*, so the cost is never fully hidden.

## Considered Options

1. **All standards hard** — no exceptions; projects that disagree fork or disable checks.
2. **Two-tier override mechanic** — each rule is tagged `[hard]` or `[overridable]`; an
   `[overridable]` rule can be relaxed only by a committed file in `overrides/`, which turns
   its gate from blocking into an advisory warning — never off. `[hard]` (all of SECURITY, and
   named privacy/quality rules) can never be overridden.
3. **Config flags** — a settings file toggles checks on/off.

## Decision Outcome

**Option 2.** Constitution Principle 4. An override is a committed markdown file with a
verbatim rationale; `scripts/check-overrides.mjs` refuses an override against a `[hard]` rule.
"An undocumented exception does not exist."

It beat option 1 because a rule with no legitimate escape hatch gets bypassed dishonestly. It
beat option 3 because a boolean flag records *that* something was turned off but not *why*, and
tends to drift to "everything off".

## Consequences

- **Good:** every exception is a diff with a reason, reviewable and greppable. The gate still
  warns, so the trade-off stays on-screen.
- **Good:** the security floor is structurally un-relaxable — the mechanic simply does not apply
  to `[hard]`.
- **Cost:** slightly more ceremony than a flag. That is the point — the ceremony *is* the
  visibility.
- **Watch:** an over-large `overrides/` folder is a smell that a default is wrong; revisit the
  standard rather than accumulating exceptions.
