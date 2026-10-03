# 4. Strip the dev workshop from production, and prove it

Status: accepted

## Context and Problem Statement

The kit ships a **developer workshop** (the design-system gallery, the agent-instructions
page, a live component demo host) under `src/app/dev/`. It is useful while building and must
never reach a production build — it would bloat the bundle and expose internal tooling. "We
took the routes out" is not enough; we need a build that *cannot* contain the workshop, and a
check that proves it.

## Decision Drivers

- Zero dev code in the production bundle — verifiable, not assumed.
- The workshop stays a first-class dev experience (real routes, real components).
- The proof must be mechanical, so a regression fails the build rather than shipping.

## Considered Options

1. **Runtime flag** — ship the workshop but hide it behind an `if (production) return`.
   The code still ships in the bundle.
2. **Manual discipline** — remember to remove the dev routes before a prod build.
3. **Build-time swap + a strip sentinel** — a production `fileReplacements` entry swaps
   `dev.routes.ts` → `dev.routes.prod.ts` (which exports `devRoutes` as `[]`), leaving the whole
   `src/app/dev/` tree unreferenced by the prod route graph and tree-shaken out. Every dev file
   references a sentinel literal (`__VIBE_DEV_ONLY__`) the optimizer cannot drop; a build check
   greps `dist/` and requires **0** occurrences in production (and ≥1 in a dev build).

## Decision Outcome

**Option 3.** The swap makes the strip structural (an empty `devRoutes` export severs the only
reference); the sentinel makes it *falsifiable* — `scripts/verify-build.js` fails if a single
`__VIBE_DEV_ONLY__` survives into the prod dist. The one file that does ship, `dev.routes.prod.ts`,
is deliberately sentinel-free.

Option 1 leaves dev code in the shipped bundle (bloat + exposure). Option 2 relies on memory,
which fails silently exactly when it matters.

## Consequences

- **Good:** a proven-empty production bundle, enforced on every build. Verified during N5: the
  sentinel is present in the dev chunk and absent from `dist/` in prod.
- **Good:** the workshop is real code, not a stubbed toy — same components, same routes, in dev.
- **Cost:** two route files to keep in sync (`dev.routes.ts` and its prod stub) and a discipline
  that every dev file touch the sentinel. Both are cheap and the check catches a lapse.
- **Watch:** anything under `src/app/dev/` that gets imported from production code would defeat
  the strip. The sentinel check is the tripwire that would catch it.
