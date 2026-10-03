<!-- kit -->
# Spec — Workshop & Semantic Design System (Phase N5)

**Status:** implemented · **Date:** 2026-07-18 · **Decides for:** N5.1–N5.3

## Goal

A dev-only workshop area (`/dev`) whose centrepiece is a semantic design-system
gallery: every reusable UI component gets a tile, a live demo page, and a
canonical machine-readable instruction file that agents and humans read from the
**same source**. The whole area is provably stripped from production builds.

## Decisions

### D1 — Location & strip mechanism
- All workshop code lives in `src/app/dev/` (single strip boundary).
- `src/app/dev/dev.routes.ts` exports the real lazy routes (`/dev`, `/dev/design`,
  `/dev/design/:slug`, `/dev/agents`); `src/app/dev/dev.routes.prod.ts` exports `[]`.
- `angular.json` production config adds a `fileReplacements` entry swapping the two
  (same pattern as the existing `illustration-source` replacement).
- `app.routes.ts` spreads `...devRoutes` before the wildcard route.

**Amended 2026-07-21:** the original decision (`hidden: true` everywhere, no nav
entry) contradicted the platform requirement "in dev mode the design system is
always available; UIs guide the user to it". The hub, gallery and agents routes
now carry `titleKey` + `group: 'development'` and appear in the navigation
while the dev server runs; NavigationService drops the `development` group and
all `devOnly` routes under effective prod (incl. the PROD-simulate toggle), and
the prod build still strips the whole tree via `dev.routes.prod.ts`. Only the
`:slug` detail route remains `hidden`.

### D2 — Sentinel proof
- Every file under `src/app/dev/` contains the literal `__VIBE_DEV_ONLY__`
  (exported const, referenced in each component so it cannot be tree-shaken away
  in dev builds).
- `scripts/verify-build.js` gains a check: grep all of `dist/vibecore/` for
  `__VIBE_DEV_ONLY__` → **0 hits required** in production. A dev build (`ng build`
  dev config) must contain ≥1 hit (tested once manually, not in the prod gate).

### D3 — One canonical doc per component
- Canonical instruction file: `src/assets/design-system/<slug>.md`.
  Served as an asset → the gallery's Agent-Instructions tab fetches **the same
  file** an agent opens on disk. (Assets ship in prod; that is deliberate — they
  are public docs, no secrets. Only *code* chunks are stripped.)
- Doc format: YAML frontmatter (`name`, `selector`, `tags`, `status`) + sections
  `## Purpose` · `## When to use` · `## When not to use` · `## API` ·
  `## Example` · `## Accessibility`. English (agent-canonical, consistent with
  `base/` and skills).
- `docs/DESIGN-SYSTEM.MD` becomes the hub: convention, registry pointer, links.

### D4 — Registry & self-maintenance gate
- `src/app/dev/design-registry.ts`: array of
  `{ slug, name, selector, tags, docPath, load }` (dynamic import for live demo).

**Amended in N5.2:** the `load` dynamic-import field is dropped. The live demo is
now rendered by `src/app/dev/demo-host.component.ts` (a static `@switch (slug)`
that imports every component statically, so `<ng-content>` projection works),
which `load`'s `createComponent` path could not do. `load` is replaced by
`sourcePath` (a repo-relative string) — new field order
`slug, name, selector, tags, docPath, sourcePath`. The gate
(`check-design-system.mjs`) gains **check 5**: every registry slug must appear as
`@case ('<slug>')` in the demo host, so a registered component with no live demo
fails the build.
- `src/app/dev/design-registry.exclusions.json`: every component file under
  `src/app/components/**` that is *not* in the registry, with a one-line reason
  (e.g. "page-specific, not reusable").
- `scripts/check-design-system.mjs` fails when: a component file is in neither
  registry nor exclusions; a registry entry lacks component, doc file, or tags;
  an exclusion points to a deleted file. Wired into `verify-harness.mjs` and run
  by `npm run build:verify`. → Any newly added component forces a conscious
  registry-or-exclusion decision. This is the self-maintenance gate.

### D5 — Gallery UX (N5.2)
- `/dev/design`: tile grid (name, selector, tags), client-side keyword filter over
  name+tags. Educational Amber tokens, keyboard-navigable, visible focus.
- `/dev/design/:slug`: live demo (component mounted with minimal example inputs)
  + tabs **Example / Usage / Agent instructions**. Usage renders the
  "When (not) to use" sections; Agent-instructions renders the full canonical .md.
- Markdown rendering: prefer an existing in-repo mechanism; if none fits, a small
  renderer imported **only from dev code** (must not appear in prod chunks —
  sentinel + bundle check prove it).

### D6 — Curation (initial scope)
- Initial registry: ~12–18 genuinely reusable components (containers, info/example
  boxes, tooltips, cards, headers, quiz/checkpoint, progress, step indicator …).
- Didactic one-off demo visualisations and page-specific components go to
  exclusions. Curation list is proposed by the implementing agent and reviewed.

### D7 — Agent entry & creation loop (N5.3)
- `/dev/agents`: entry page indexing *when to read which* design-system doc.
- DS article type: guidelines for writing docs (incl. translation & plain-language
  notes) in `docs/DESIGN-SYSTEM.MD`.
- `/new-component` skill: checks the gallery first ("does a reusable component
  already cover this?"), asks the "reusable?" question, then scaffolds component +
  gallery page entry + canonical .md + registry entry in one pass; agent acts as
  UX writer for the doc.

## Verification (phase gate)
1. `npm run build:prod` green; verifier PASS incl. sentinel = 0 hits in dist.
2. Dev build serves `/dev` + `/dev/design`; every registry entry has page + doc.
3. `check-design-system.mjs` green; deliberately breaking it (unregistered
   component) fails with a clear message.
4. `/new-component` dry run produces all four artefacts in one pass.
