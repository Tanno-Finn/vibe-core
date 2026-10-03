---
name: new-component
description: >
  Add a reusable UI component to the design system the right way — gallery check first, the
  "reusable?" decision, then scaffold the component, its registry entry, its canonical doc,
  and its live demo in one pass. Run it when the user says "new component" / "add a
  component" / "build a <thing> widget" / "make this reusable".
layer: kit
capabilitiesUsed: ["file:markdown"]
---

# /new-component — add a design-system primitive

Your job: help the user add a UI component *without* growing a pile of near-duplicates and
*without* letting the design-system registry drift. You do two things a hurried agent skips:
you check whether the need is already met, and you keep the four artifacts (component,
registry entry, canonical doc, live demo) in step so the self-maintenance gate stays green.

Read the map first: `docs/DESIGN-SYSTEM.MD` (the hub, incl. the doc-writing contract) and
`/dev/agents` (the task-oriented "when to read which doc" index). Speak the user's language
(`profile/USER-MANIFEST.MD` → Zone 1 `language`); the component doc itself is
English-canonical regardless (hub rule).

## Step 1 — check the gallery first (do NOT skip)

Read `src/app/dev/design-registry.ts` and skim the `/dev/agents` index table (derived
live from the registry — it always shows every registered primitive). Match the user's
need against the existing primitives by tag and purpose.

**If an existing component covers the need by ~80% or more, STOP.** Say so explicitly and
recommend using it — or extending it with a new input — instead of building a near-duplicate.
A second component that overlaps an existing one is a cost, not progress (QUAL-006). Only
continue past this step once you and the user agree nothing existing fits.

## Step 2 — ask: is it reusable? (the fork)

Put the question to the human plainly, because it decides the whole path:

- **Reusable primitive** — used across pages, no coupling to one article's data or one
  page's state → it earns a **registry entry** (Step 3, full scaffold).
- **One-off** — page-specific, tied to a single article/feature, a whole-page template → it
  does **not** go in the registry. Build the component, then add a one-line entry to
  `src/app/dev/design-registry.exclusions.json` (key = path relative to
  `src/app/components/`, value = the reason). That satisfies the gate without pretending it
  is a gallery primitive. You are done after that plus the check in Step 4.

When unsure, lean one-off — the exclusion is cheap and reversible; a wrongly-registered
component invites misuse. Let the user make the call.

## Step 3 — scaffold the four artifacts in one pass

For a reusable component, create all four together so the gate never sees a half-state.
Pick a `slug` (kebab-case, URL-safe, also the doc filename).

**Boilerplate first — let the Angular CLI make the file (ADR-0011).** Don't hand-type the
empty component; generate it, then edit. `angular.json` already defaults components to
`standalone`, `inlineTemplate`, `inlineStyle`, `style: scss`, `type: component`, prefix `app`,
which is exactly the single-file shape the primitives use — so the only flags you need are
`--flat` (primitives are flat `.component.ts` files in their area folder, **not** in a
per-component subfolder) and `--skip-tests` (primitives don't ship a spec by default):

```
ng generate component components/<area>/<slug> --flat --skip-tests
```

That writes `src/app/components/<area>/<slug>.component.ts` with `selector: 'app-<slug>'`,
class `<Slug>Component`, standalone + inline template/style. (There are **no** custom
`vibecore:` schematics — the CLI makes the empty file, the steps below add the three artifacts
it knows nothing about; that split is ADR-0011.) Then fill it in:

1. **Component file** — the generated `src/app/components/<area>/<slug>.component.ts`. Add
   `ChangeDetectionStrategy.OnPush`, Educational Amber design tokens (`var(--...)` with
   fallbacks, mirror a sibling), a11y basics (semantic roles, `:focus-visible`,
   `prefers-reduced-motion` if it animates, no color-only affordances). Guard any
   `window`/`document`/`localStorage` with `isPlatformBrowser` (prerender rule).
2. **Registry entry** — append to `designRegistry` in `src/app/dev/design-registry.ts`,
   **respecting the PARSER CONTRACT**: field order exactly
   `slug, name, selector, tags, docPath, sourcePath`, every value a single-quoted string
   literal (tags a single-quoted array on one logical line). `docPath` is
   `assets/design-system/<slug>.md`; `sourcePath` is the repo-relative component path.
3. **Canonical doc** — `src/assets/design-system/<slug>.md`. You act as **UX writer**:
   follow the hub's *Writing a component doc* contract (frontmatter + `## Purpose` ·
   `## When to use` · `## When not to use` · `## API` · `## Example` · `## Accessibility`),
   sourced from the code you just wrote, honest about any limitation. English-canonical.
4. **Live demo** — in `src/app/dev/demo-host.component.ts`: add the component to `imports`,
   add one `@case ('<slug>') { ... }` with a realistic inline usage, and add the matching
   `DEMO_SNIPPETS['<slug>']` string **token-for-token in step** with that markup. The gate
   checks this (`check-design-system.mjs`, check 7): it compares both sides with whitespace
   collapsed, so indentation and line wrapping are yours to choose, but any renamed input,
   changed literal or dropped attribute fails the build. Write the snippet as what the
   reader will actually see rendered, never as an idealized version of it.

## Step 4 — prove it green

Run both gates and show the output:

```
node scripts/check-design-system.mjs   # registry <-> components <-> demo coverage
node scripts/verify-harness.mjs        # harness integrity (also runs the gate)
```

Both must PASS with the new component counted (registered → registry count +1; one-off →
exclusions count +1). A green gate is the evidence the scaffold is complete. There is no
manual index upkeep: the `/dev/design` gallery sections, the `/dev/agents` task table,
and the detail page's quick-switch all derive from `design-registry.ts` at runtime via
the shared tag→group map in `src/app/dev/design-groups.ts`, so the new entry appears in
all of them automatically (under the tag-matched task group, or under the
"More components" fallback group if no tag matches — pick registry tags that fit an
existing group when one applies). Do **not** run
`npm run build:prod` / `ng build` / the test suite unless the user asks — the gates above are
the fast proof; a full build is `/ship`'s job.

## Handoffs

- The subject is a building block the kit *consumes* rather than ships — an Optimus UI component,
  a cross-cutting foundation, a layout pattern → `/new-guide` (a tabbed guide article plus its
  agent doc, not a registry primitive).
- Need a whole *page* or content artifact, not a primitive → `/new-content`.
- The pattern is a policy/convention, not a component → `/new-directive`.
- Finished and ready to land → `/ship` runs the Definition-of-Done gate (build + tests +
  docs in the same commit, QUAL-002). Cross-links: this skill ↔ `/dev/agents` ↔
  `docs/DESIGN-SYSTEM.MD`.

## Boundaries

**Green (just do it, after Step 2 is settled):**
- Create the component file, registry/exclusions entry, canonical doc, and demo `@case`
  locally. These are local, reversible edits — tell the user which files you touched.

**Ask first:**
- Confirm the reusable-vs-one-off call before scaffolding (Step 2). It changes where the
  code lives and whether it becomes public API.
- Confirm the slug/selector and the component's area folder before writing.

**Never:**
- Register a component without its doc and its live demo `@case` — that breaks the gate and
  ships a half-primitive.
- Claim a gate ran green when it did not (QUAL-007) — paste the real output.
- Reorder or reformat the registry fields away from the PARSER CONTRACT (it is parsed as
  text, not compiled).
- Put real personal data in the doc's example — use synthetic content (PRIV-001).

**Stop and ask if…**
- the component would pull in a **new dependency** (npm package, new Optimus UI module) — that
  is a bigger decision than a scaffold; surface it, don't add it silently.
- it would touch **production routes / app-shell wiring** (anything outside
  `src/app/components/**` and `src/app/dev/**`) — out of scope for this skill; flag it.
- its selector **duplicates an existing one**, or Step 1 found a ≥80% match — that is a reuse
  decision, not a new component.
- you are unsure whether it is reusable or one-off — ask the human (Step 2), don't guess.
