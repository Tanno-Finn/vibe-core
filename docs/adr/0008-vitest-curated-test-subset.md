# 8. Vitest on a curated engine-spec subset, not an inherited portal suite

Status: accepted

## Context and Problem Statement

The kit was exported from a portal that shipped 88 Jasmine/Karma component specs. Karma
needs a real browser to run — hostile to CI and to the "no local setup" Codespaces path the
kit promises. And 88 portal specs are the wrong test surface for a *starter kit*: most exercise
the source portal's pages and canvas demos, not anything a kit user keeps. We need a test story
that runs headless in bare CI and teaches the right habit.

## Decision Drivers

- Tests must run headless, with no browser and no install step, in CI and Codespaces.
- The shipped suite should model *how to test in this kit*, not carry portal baggage.
- Stay on Angular-native tooling — no bespoke runner config to rot.
- Dependency-free harness scripts stay dependency-free (they are their own kind of test).

## Considered Options

1. **Keep Karma, headless Chrome in CI.** Requires a browser in every CI/Codespace image;
   slow; the 88 portal specs stay as-is.
2. **Migrate all 88 specs to Vitest.** Jasmine→Vitest is not free (`spyOn`, `createSpyObj`,
   `.and.*`, canvas 2D context jsdom lacks); porting 88 — most of them portal cruft — is a
   large, low-value rewrite.
3. **Vitest on Angular's native `@angular/build:unit-test` runner, over a curated subset.**
   Keep a small green set that models the pattern; remove the rest; gate it with a baseline.

## Decision Outcome

**Option 3.** The `test` target moves to `@angular/build:unit-test` with `runner: vitest` in a
Node/jsdom environment (headless by construction — no `browsers`). The kept subset is **9 specs
/ 104 tests**: the 7 pure-logic *engine* specs (no DOM — they test the algorithm, not the
canvas) plus two TestBed exemplars (`active-filter-chips`, `highlight.directive`) that show
component/directive testing under jsdom. The other ~79 specs and the Jasmine-only `test-utils.ts`
were removed, zeroing the Jasmine footprint; Karma and its devDeps are gone. A dependency-free
`scripts/check-test-baseline.mjs` drives the run and fails on any red test or a drop below the
recorded baseline (9 files / 104 tests). The separately-run, deliberately dependency-free hook
test (`guard-red-actions.test.mjs`, 108 cases) stays outside Vitest.

Option 1 keeps a browser in the CI critical path forever. Option 2 pays a large migration cost
to preserve specs a kit user does not want.

## Consequences

- **Good:** `npm run test:ci` runs headless in seconds; nothing to install but node_modules.
- **Good:** the suite *teaches* — "separate your logic engine from rendering and unit-test the
  engine" is the agent-first habit the kit wants to model.
- **Good:** the baseline script turns "green" into a machine fact, catching silent regressions.
- **Cost:** component-test coverage is deliberately thin (two exemplars). A kit user grows it;
  the pattern (Vitest + `vi.fn`, not Jasmine) is set. Reviving richer component specs means
  authoring them against Vitest, not restoring the removed Jasmine ones.
- **Amendment 2026-09-07:** the baseline gate is now the last step of `npm run build:prod`
  (before the manifest), with `SKIP_TEST_GATE=1` as the one explicit bypass that the manifest
  records. Trigger: six of sixteen spec files silently stopped loading for a night (a
  dev-tree import only the test build evaluates), and every routine chain still said PASS.
  A red suite blocking an unrelated prod build is the intended cost; a skipped suite is a
  fact the deploy can read, not a default. Baseline raised to 16 files / 276 tests.
- **Watch:** `package-lock.json` still lists `karma` transitively (an optional peer of the
  Angular build package). Nothing ships it; no action unless that dep is dropped upstream.
