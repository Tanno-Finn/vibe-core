<!-- kit -->
# Design System

The semantic design-system hub (SPEC `specs/2026-07-18-workshop-design-system/`, decision D3).

Every genuinely reusable UI component has **one canonical instruction file** that
both humans and agents read from the same source: `src/assets/design-system/<slug>.md`.
The `/dev/design` gallery (dev-only) fetches that exact file for its
Agent-Instructions tab, so on-disk docs and in-app docs can never drift.

New here? Start at `/dev/agents` — the task-oriented "when to read which doc"
index over the registry, plus the loop for adding a component.

## The convention

- **Registry** — `src/app/dev/design-registry.ts` lists every reusable component
  as `{ slug, name, selector, tags, docPath, sourcePath }`. `slug` is the doc
  filename; `sourcePath` is the repo-relative path to the component source (the
  former dynamic-import `load` field was dropped — the live demo now lives
  in `demo-host.component.ts`). Keep the field order fixed: the gate parses this
  file as text (PARSER CONTRACT).
- **Exclusions** — `src/app/dev/design-registry.exclusions.json` lists every other
  `*.component.ts` under `src/app/components/**` with a one-line reason.
- **Canonical doc** — `src/assets/design-system/<slug>.md`: YAML frontmatter
  (`name`, `selector`, `tags`, `status`) plus sections `## Purpose` ·
  `## When to use` · `## When not to use` · `## API` · `## Example` ·
  `## Accessibility`. English (agent-canonical).
- **Live demo** — one `@case ('<slug>')` in `demo-host.component.ts` plus a
  matching `DEMO_SNIPPETS[slug]` entry.
- **Self-maintenance gate** — `scripts/check-design-system.mjs` fails if a
  component is in neither registry nor exclusions, if a registry entry is missing
  its component / doc / tags, if an exclusion points at a deleted file, or if a
  registry slug has no live-demo `@case`. It runs in `npm run build:verify` and in
  `scripts/verify-harness.mjs`.
- **Derived views, no manual upkeep** — the `/dev/design` gallery sections, the
  `/dev/agents` task-index table, and the detail page's component quick-switch
  are all derived from the registry at runtime through ONE shared tag→task-group
  map: `src/app/dev/design-groups.ts` (`groupDesignEntries()`; first matching
  group wins, guaranteed "More components" fallback). Every registry entry
  appears in exactly one group, so a new component surfaces in gallery, agents
  index **and** quick-switch automatically. Only the group titles/hints are
  curated (i18n keys `devWorkshop.groups.*`). To change grouping, edit
  `design-groups.ts` — never a component.
- **Component quick-switch** — `/dev/design/:slug` carries a grouped, filterable
  `p-select` below the header that jumps straight to any other component's
  detail page; the filter matches name, selector, and registry tags. The detail
  page is ONE template for all slugs (header → quick-switch → live demo → tabs);
  per-slug behavior belongs in registry metadata or the demo-host `@case`,
  never in `if (slug === ...)` branches.

Adding a new component therefore forces a conscious **reusable? -> registry, else
exclusion** decision, or the build fails. The `/new-component` skill automates the
whole scaffold.

## Writing a component doc

The doc is the product, not an afterthought — an agent decides whether to use your
component from the doc alone. Write it as a UX writer would: precise, honest,
sourced from the code. Each section has a job:

- **Frontmatter** — `name`, `selector`, `tags` (mirror the registry entry),
  `status` (`documented` once the body is real, `stub` while it is a placeholder).
- **`## Purpose`** — one paragraph: what the component *is* and the one problem it
  solves. Name the concrete shapes it supports (e.g. the `type` variants) rather
  than describing it abstractly.
- **`## When to use`** — the situations that should route to this component. Bullet
  the real triggers ("a sidebar card listing sources", "a single graded question"),
  not restatements of the purpose.
- **`## When not to use`** — the honest boundaries, each pointing at the *right*
  alternative (`use app-example-box instead`). This section is what stops
  duplication; do not skip it.
- **`## API`** — a table of every `@Input()` (`Input · Type · Default · Meaning`),
  every `@Output()`, and whether it projects `<ng-content>`. **Source it from the
  code, not from memory** — read the component and list what is actually there.
- **`## Example`** — one realistic, copy-pasteable usage in a fenced ```html block.
  Prefer the same markup as the live demo's `@case` so they stay coherent.
- **`## Accessibility`** — the real a11y contract: roles/ARIA it sets, keyboard
  behavior, `prefers-reduced-motion` handling, and color-only affordances it
  avoids.

Two rules run through all of it:

- **Sourced from code.** Every claim (an input's default, a role, a keyboard path)
  must be verifiable in the component source. If you did not read it, do not
  write it.
- **Honest about limitations.** If an input is declared but does nothing, say so in
  the API row and add a **Known gap** note to `## Accessibility` (see
  `circular-progress.md` for the pattern). A doc that hides a dead input is worse
  than no doc — it makes an agent rely on something that will silently fail.

### Translation

Docs are **English-canonical**, consistent with `base/` and the skills. (The
workshop *chrome* — headings, filter, tab labels, empty states on the `/dev`
pages — is localized like every app page, namespace `devWorkshop` in
de/en/de-easy/en-easy; only the canonical component docs stay English.) English is
the shared working language for agents across tools (Copilot, Cursor, Gemini), and
one source keeps docs and code from drifting. If a project ever needs localized
component docs, treat them as **derived views** of the English original — generated
from it and clearly marked as translations, never edited independently — so the
canonical doc stays the single source of truth (the same "roadmap docs are derived,
not truth" discipline the kit uses elsewhere).

The guide **articles** (`/dev/design/guide/<id>`) are read by people and ship in two
languages: an English canonical component plus a German twin that extends it, shown on
`de` and `de-easy` (ADR-0018, `directives/guide-authoring.md`). Their agent docs stay
English like every other canonical doc.

### Plain language

Write for a **competent non-native reader**, not for a compiler and not for a
native English stylist. Short sentences, one idea each. Prefer plain verbs over
jargon; expand an acronym on first use. **No idioms or cultural metaphors** — they
do not survive translation and they slow a reader down. This is the same
plain-language standard the kit applies to user-facing educational content
(`A11Y-005`); a component doc read under time pressure benefits from it just as
much.

## Guides layer

The component gallery documents the kit's OWN reusable primitives. The **Guides** layer
documents how to wield the building blocks the kit does not own — library components
(Optimus UI), cross-cutting foundations, and layout/page patterns. A guide is a long-form,
tab-structured article; its machine-readable twin is one canonical **agent doc** that the
in-app Agent tab, the CLI, and an agent on disk all read from the same file.

- **Guide registry** — `src/app/dev/articles/article-registry.ts` lists every guide as
  `{ id, title, category, tags, summary, related, agentDocPath, loadComponent }`. `category`
  is `library | foundations | layouts`; `related` is a kebab-case list of sibling guide
  ids to read next (forward references allowed — an id may name a guide not built yet).
  Fixed field order — the gate parses it as text (PARSER CONTRACT), same discipline as the
  component registry.
- **Article component** — `src/app/dev/articles/<id>/<id>-article.component.ts` renders
  through the shared `<app-guide-shell>` and projects each tab body as
  `*guideTab="'…'"`. Six tabs, in fixed order: Examples · Usage · Design · Development ·
  I18n · Agent (the Agent tab is always present, rendered by the shell from `agentDocPath`).
  Sources links belong at the end of Usage, the quality/accessibility checklist at the end
  of Development. A guide may still project `*guideTab="'history'"`, but that is NOT a tab:
  the shell renders it below the panels as a compact `<details>` footer.
- **Canonical agent doc** — `src/assets/design-system/guides/<id>.agent.md`: YAML
  frontmatter (`id`, `title`, `category`, `tags`, `summary`, `related`) plus the nine
  mandatory sections `## When to use` · `## When not to use` · `## Key API` ·
  `## Accessibility` · `## Pitfalls` · `## Sources` · `## Semantic mapping` · `## Rules` ·
  `## Default snippet`, in that order. English-canonical, compact, imperative — written
  for an agent, not for prose. The last three make the doc machine-harder: `Semantic
  mapping` is an intent→props table, `Rules` are checkable MUST/SHOULD/NEVER bullets, and
  `Default snippet` is one canonical, safe-by-default code block. The doc's `related`
  frontmatter must equal the registry entry's `related`.
- **Route** — `dev/design/guide/<id>`, generated from the registry in `dev.routes.ts`
  (one per entry). Reachable from the `/dev/design` gallery "Guides" sections and the
  shared quick-switch (`src/app/dev/switch-options.ts`, which folds component groups AND
  guide categories into one grouped `p-select` used by both the component detail page and
  the guide shell).
- **Agent CLI** — `node scripts/design-guides.mjs`, dependency-free, four graded steps
  over BOTH layers (`--layer guides|kit|all`, `--scope docs|tabs|kit|all`):
  `topics` (coverage map: categories, tab inventory, kit slugs, and what nothing covers),
  `list [--json] [--tag]` (index), `sections <heading>` and `blocks dodont` (one heading /
  every rendered do/don't pair across all guides in ONE call), `search <term>` (agent docs
  + article tabs + kit docs; a miss reports which scopes were read and which were not),
  `section <id> <heading>` and `bundle <id>` (one topic, related closure included),
  `show <id>` and `tab <id> <tab>` (depth; `tab` substitutes the article's own string
  constants, so measurement tables and code samples arrive complete). Unknown commands,
  flags, and flag values exit non-zero — a silently ignored flag reads as a filtered
  answer. This is how an agent consults the design system without loading a page.
- **Self-maintenance gate** — `scripts/check-design-guides.mjs` fails if a registry entry
  is missing its component / agent doc, if frontmatter is incomplete or its `id` disagrees,
  if a doc lacks one of the nine sections, if the doc and registry `related` lists disagree
  or a related id is not kebab-case, if a related id names neither an existing guide nor a
  `planned:` target, if an agent doc body exceeds its ceiling — 8,500 bytes for one covered
  component plus 1,500 per further one named in `covers:`, warning 2,000 under it — if a
  `covers:` list is missing, names something the library does not export, or claims a
  component another guide already covers, if a declined component (below) lacks a
  reason or its line here, if a
  `dd__cell` marker in the tree is not recognized by the do/don't harvester or a guide with
  a Usage tab yields no pair, if a doc on disk is unregistered (orphan), or if a registry
  entry has no generated route. It runs in `npm run build:verify` and in
  `scripts/verify-harness.mjs`, alongside the component gate.

The workflow habit — when to consult which layer, and how deep — is the
[`design-system`](../directives/design-system.md) directive. Writing a new guide
(artifacts, quality bar, lockstep rule) is the
[`guide-authoring`](../directives/guide-authoring.md) directive.

### Declined components

`node scripts/design-guides.mjs coverage` counts the library against the guides'
`covers:` lists: **88 covered + 11 declined = 99** `@openng/optimus-ui` components
(checked against 2.0.2 and the kit on 2026-09-23). The eleven below are left out on
purpose. The list with its reasons lives in `DECLINED_COMPONENTS`
(`scripts/design-guides.mjs`); the gate fails on an entry without a reason, on one a
guide covers after all, and on one this section does not name. A component that is
neither covered nor declined — say, one a library update adds — shows up as
*undecided*, a warning.

| Component | Why no guide |
|---|---|
| `blockui` | The kit's own loading overlay (`app-loading-overlay`: a full-screen mask with a progress spinner and `role="status"`) already blocks the page while it loads; a second masking mechanism would be a second way to do one thing. |
| `speeddial` | The kit's own FAB stack (`fab-container`) already fans its floating buttons out as a speed dial on narrow screens; a `p-speeddial` beside it would put two floating-action systems on one page. |
| `knob` | A number dragged round a circle. The slider and inputnumber guides cover picking a value with shapes readers already know; the knob adds nothing an educational page needs. |
| `inplace` | Click-to-edit hides the input behind display text, so nobody can see a value is editable until they try. The portal has no inline-edit surface, and a visible input (text-inputs) is the plainer answer. |
| `colorpicker` | Its hue/saturation panel is pointer-only (the keyboard handler only opens and closes it). The kit's theme choice offers fixed palettes; a free color field would be the native `<input type="color">`. |
| `dock` | A launcher bar of icon items pinned to a screen edge. Nothing in an educational portal launches apps, and the menubar and panelmenu guides cover the navigation it would stand in for. |
| `scrollpanel` | Draws its own scrollbar over the browser's. Native overflow scrolling keeps the platform scrollbar, touch momentum and assistive-technology behavior for free; long lists are the scroller guide. |
| `styleclass` | Toggles classes with enter/leave animations on another element. Angular `[class]` bindings and the motion tokens do that without a second animation path to keep reduced-motion safe. |
| `animateonscroll` | Animates elements as they scroll into view. A reading page gains nothing from text that moves in while it is being read, and each use would need its own reduced-motion opt-out. |
| `splitter` | Resizable panes for tool layouts. No kit page shows two side-by-side panes a reader has to resize, and a drag handle has no room on a phone. |
| `terminal` | An emulated command prompt answering typed commands through a `TerminalService`. The articles show commands to read and copy, which a code block does; a fake shell invites typing into something that is not one. |

## Strip boundary

The whole workshop (`src/app/dev/`) is stripped from production: `dev.routes.ts`
is swapped for an empty `dev.routes.prod.ts` via `angular.json` `fileReplacements`,
which leaves the whole tree unreferenced. As a leak detector, the routes, the workshop
pages, and the guide-article components reference the `__VIBE_DEV_ONLY__` sentinel
(`dev-sentinel.ts`), which `verify-build.js` requires to be absent from `dist/`. Not every
dev file carries it: a few data modules (`article-registry.ts`, `design-groups.ts`,
`switch-options.ts`) and the nested `cascade-select-demo.component.ts` do not, and the prod
stub `dev.routes.prod.ts` must not. The canonical docs under `src/assets/` **do**
ship (they are public docs, no secrets) — only dev *code* is stripped.

Two thirds of the design-token reference are now written: color is the
`color-system` guide and type is the `typography` guide, both under
`src/assets/design-system/guides/` and rendered at `/dev/design/guide/<id>`. Until
the same exists for spacing, the spacing tokens live in the kit stylesheets under
`src/styles/` (Educational Amber) and the registered components are the working
reference.

## Status

- **N5.1 (done):** registry, exclusions, doc stubs, gate, strip boundary, `/dev`
  hub + placeholders.
- **Done:** gallery grid + per-component live demo / tabs; doc bodies filled.
- **N5.3 (done):** `/dev/agents` entry page, the doc-writing contract above, and
  the `/new-component` creation loop (D7).
- **Guides (done):** the Guides layer — registry, article shell + `*guideTab`
  projection, agent-doc format, the `design-guides.mjs` CLI, the
  `check-design-guides.mjs` gate, and the Button pilot article.
