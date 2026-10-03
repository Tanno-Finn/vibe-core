# 5. One canonical doc per design-system component

Status: accepted

## Context and Problem Statement

Two audiences need to understand each design-system component: the **agent** deciding whether
to reuse it, and a **human** browsing the gallery. If each audience reads a different source,
the two drift — the gallery says one thing, the agent's instructions say another, and the
component's real API a third. We need one description that cannot disagree with itself.

## Decision Drivers

- A single source of truth per component — no agent-copy vs human-copy divergence.
- The doc must be authored from, and stay close to, the component's real code.
- Both the gallery UI and an agent must consume the *same* file.

## Considered Options

1. **Separate docs per audience** — a human README and an agent-facing note per component.
2. **Doc generated from code comments** — extract JSDoc into a rendered page.
3. **One canonical markdown doc per component** — `src/assets/design-system/<slug>.md` with a
   fixed contract (Purpose · When to use · When not to use · API · Example · Accessibility),
   read *identically* by the gallery's detail view and by any agent (the same file the
   `/new-component` skill writes and the registry points at via `docPath`).

## Decision Outcome

**Option 3.** One file, one contract, two readers. The gallery renders it; the agent reads it;
the registry links it. Writing these docs during N5 also paid an unexpected dividend — the act
of documenting each component surfaced eight real API/accessibility defects that code review
had missed.

Option 1 guarantees drift — two docs for one thing always diverge. Option 2 couples the
description to comment syntax and tends to produce API dumps without the "when *not* to use it"
judgment an agent most needs.

## Consequences

- **Good:** the gallery and the agent can never disagree — they read the same bytes.
- **Good:** the doc-writing pass is itself a lightweight audit (it found 8 defects).
- **Cost:** a component isn't "done" until its canonical doc exists; the registry gate enforces
  that (see ADR-0006). This is deliberate friction against half-documented primitives.
- **Watch:** a doc can still fall behind its component's code. The `/new-component` and `/ship`
  flows keep doc and code in the same commit (QUAL-002); a stale doc is a review miss, not a
  structural one.
