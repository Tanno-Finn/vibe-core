<!-- base -->
# design-system — directive

Before writing or reshaping any UI, consult the design system — **as deep as the task
needs, no deeper**. The kit ships two layers that answer two different questions, and a
token-cheap way to read both without loading a page or the whole app. This directive is the
map; the writing contract for docs lives in [`docs/DESIGN-SYSTEM.MD`](../docs/DESIGN-SYSTEM.MD).

## Two layers

- **Component gallery** — the kit's own reusable primitives (containers, boxes, cards,
  progress, quiz, tooltip). One canonical doc each at
  `src/assets/design-system/<slug>.md`, in six sections — **Purpose · When to use · When
  not to use · API · Example · Accessibility**, in that order. That structure is
  gate-checked (`check-design-system.mjs`): the CLI harvests kit docs BY HEADING, so a
  doc that renamed one would drop out of `sections` and `topics` in silence. Reachable
  from the CLI as the `kit` layer (`--layer kit`), and browsable at `/dev/agents` (task
  index) and `/dev/design` (filterable gallery + live demos) when the app is running.
  Reach here for a KIT PRIMITIVE.
- **Guides** — long-form articles on wielding building blocks the kit does not itself own:
  library components (Optimus UI), cross-cutting foundations, and layout/page patterns. One
  canonical agent doc each at `src/assets/design-system/guides/<id>.agent.md`. Reach here
  for a LIBRARY, LAYOUT, or PATTERN question. Writing one is the `/new-guide` skill;
  the rules it enforces are [`guide-authoring`](guide-authoring.md).

Registries are the source of truth (`src/app/dev/design-registry.ts`,
`src/app/dev/articles/article-registry.ts`); gallery, indexes, and quick-switch are derived
from them, so a new entry surfaces everywhere with no manual upkeep. Components that are
deliberately NOT gallery entries (page-specific didactic widgets and the like) are listed
in `src/app/dev/design-registry.exclusions.json` — the registry gate fails on any shared
component that is in neither place, so consult the exclusions file before concluding a
component is unregistered.

## Read in four graded steps — token-cheap

Never read everything. Escalate only as far as the decision requires, via the design-system
CLI (`scripts/design-guides.mjs`, dependency-free, Node core only). It serves BOTH layers:
`--layer guides|kit|all` on the reading commands, `--scope docs|tabs|kit|all` on search.

1. **Map** — `node scripts/design-guides.mjs topics`, then
   `node scripts/design-guides.mjs list [--tag <tag>] [--layer all]`. What exists at all:
   categories, how many guides each holds, the tab inventory, the kit slugs, and the
   areas nothing covers yet. Orient before you commit to reading anything.
2. **Cross-cut** — one question across the whole system, in ONE call:
   - `sections "<heading>"` — that heading from every doc (`sections rules`,
     `sections accessibility` — an A11y sweep is two calls, not forty).
   - `blocks <type>` — every block of one kind, from every article tab, in one call:
     `dodont` (rendered do/don't pairs with their rationale), `table` (reference
     tables with caption, columns, rows, and provenance), `source` (every provenance
     note and the artifacts it cites — the corpus's evidence, and its re-measure
     worklist), `snippet` (every copy-paste recipe, and what each still leaves to
     runtime). Add `--tag form` to narrow, `--brief` to drop the bulky half.
   - `search <term>` — docs + article tabs + kit docs. A miss names the scopes it read
     and the ones it skipped, so "not documented" and "wrong word" stay distinguishable.
3. **One topic** — `section <id> "when to use"` for a single decision, or
   `bundle <id>` for a guide plus its related guides (their summaries and both
   "when to use" sections) in one call, dead references filtered.
4. **Depth** — `show <id>` for the full contract, `tab <id> <tab>` for the encyclopedia
   behind it (measurement tables, token chains, i18n mechanics). Only once you are
   building with it.

Kit primitives answer to the same commands: `show standard-container`,
`section info-tooltip "when not to use"`, `list --layer kit`. `/dev/agents` and
`/dev/design` are the human browsing surfaces for the same files — an agent with a shell
does not need the app running.

## Reuse before build

- **Check the gallery first.** If an existing primitive covers ~80% of the need, use or
  extend it — do not build a near-duplicate. From a shell that is
  `design-guides.mjs list --layer kit`, not a browser. Adding a genuinely reusable component follows
  the loop on `/dev/agents` (the `/new-component` skill scaffolds it), and the
  self-maintenance gates (`check-design-system.mjs`, `check-design-guides.mjs`) fail the
  build if registry, docs, and routes drift.
- **Color contrast is a measured number, not an opinion.** `scripts/check-contrast.mjs`
  recomputes every token-level pair the kit renders — body and semantic text, brand
  foreground role, filled-button labels, accent surfaces, control boundaries — against the
  success criterion that governs it (SC 1.4.3 for text, SC 1.4.11 for control edges), for
  both themes, from the real token values. It runs in `build:verify` and in
  `verify-harness`, and writes [`docs/generated/CONTRAST.MD`](../docs/generated/CONTRAST.MD)
  (+ `contrast.json`). **Read a ratio from there; never eyedrop one.** Changing a color
  token means running `node scripts/check-contrast.mjs --write` in the same commit — the
  gate fails on a stale compilat, deliberately, so no guide can go on quoting a number the
  tokens abandoned.
## Before you call UI done — two checks

- **Interaction states, complete where reachable:** loading · empty (first visit) ·
  error (with a way out — retry or guidance) · success · disabled (reason discernible) ·
  focus-visible · hover. Don't invent unreachable states (no fake random errors) — but
  "unreachable" must be argued from the code/data flow, not assumed. Note the kit-wide
  trap: Aura ships `formField.focusRing.width: 0`, so a form control has **no** focus
  indicator unless `styles.scss` or your code provides one — verify focus visibly, never
  presume the library did it.
- **Hierarchy, judged separately from taste:** ignore whether it looks good — does the
  visual weight reflect the *importance* of each piece of information and action? One
  primary action per view; state changes visible where the user is looking.

## Feed knowledge back

- **New insight becomes a durable artifact, not a chat reply.** When you work out how to
  use a library/layout well, or a real pitfall, capture it as a new guide (or extend an
  existing one) so the next agent inherits it — knowledge that lives only in a conversation
  is lost. Canonical docs are English (one source for humans and agents, no i18n drift).
