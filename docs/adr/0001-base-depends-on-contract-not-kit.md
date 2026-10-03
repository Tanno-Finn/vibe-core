# 1. Base depends on the kit contract, not kit code

Status: accepted

## Context and Problem Statement

vibecore ships an **agent-operating-system** (standards, safety model, skills, bookkeeping)
on top of a **kit** (here, an Angular educational-portal app). We want the same agent system
to serve a second, different kit later (e.g. a plain-HTML kit) without rewriting it. The
question is how the base layer is allowed to know about the kit it runs on.

## Decision Drivers

- The base must be reusable across kits that share nothing but a shape of capabilities.
- A new kit should be addable *additively*, without editing the base.
- Drift between "what the base assumes" and "what the kit provides" must be detectable.

## Considered Options

1. **Base imports kit code directly** — simplest today; the base calls Angular/kit modules.
2. **Base programs against a declared contract** (`kit.json`) — the kit declares its commands,
   health checks, and capabilities; the base only ever reads that contract.
3. **No base/kit split** — one monolith, copied and edited per project.

## Decision Outcome

**Option 2.** The base depends only on `kit.json`. Kit- and framework-specific knowledge
stays in the kit; the base names capabilities (`file:markdown`, `page:interactive`, …), never
Angular symbols. This is Constitution Principle 5, realized.

It beat option 1 because a direct import welds the base to one framework — the second kit would
force a rewrite. It beat option 3 because a copied monolith diverges instantly and no fix
propagates.

## Consequences

- **Good:** the base is portable; a new kit satisfies the contract and inherits the whole
  agent system. `scripts/verify-harness.mjs` checks the contract's required fields exist.
- **Good:** the boundary is legible — anything framework-specific that leaks into `base/` is a
  visible bug.
- **Cost:** an indirection. A base feature that needs a new kit ability must first extend the
  contract (a new capability), not just call kit code. That friction is deliberate — it is what
  keeps the base honest.
- **Watch:** capabilities can rot into a dumping ground. Keep them coarse and few.
