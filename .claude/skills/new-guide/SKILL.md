---
name: new-guide
description: >
  Add a pattern guide to the design system the right way — corpus check first, the category
  decision, then the registry entry, the article component, and the agent doc in one pass,
  proven by the gate. Run it when the user says "new guide" / "write a design guide" /
  "document how to use <thing>" / "add a foundations guide".
layer: kit
capabilitiesUsed: ["file:markdown"]
---

# /new-guide — add a design-system pattern guide

Your job: help the user add a **guide** — a long-form article on how to wield a building block
the kit does not itself own — without writing a second document about a subject the corpus
already answers, and with its three artifacts in step so `check-design-guides.mjs` stays
green. The guide path is the steeper of the two scaffolds: a component gets four small
artifacts, a guide gets a contract, an article, and a registry entry that must agree with each
other field by field.

**A guide is not a component doc.** `/new-component` documents a primitive **this kit ships**
(one canonical doc, six sections, a live demo in the gallery). A guide documents how to **use**
something the kit consumes — an Optimus UI component, a cross-cutting foundation, a layout
pattern — and ships as a tabbed article plus a machine-readable contract. If the subject lives
in `src/app/components/`, you are in the wrong skill.

Read the contract first: `directives/guide-authoring.md` (the authoring directive — artifacts,
tabs, harvest markers, byte ceiling, the provenance register) and `directives/design-system.md`
(the map of both layers). The Button guide is the reference implementation:
`src/app/dev/articles/button/button-article.component.ts` plus
`src/assets/design-system/guides/button.agent.md`. Speak the user's language
(`profile/USER-MANIFEST.MD` → Zone 1 `language`); the guide itself is English-canonical
regardless (hub rule).

## Step 1 — ask the corpus first (do NOT skip)

Three calls, no browser and no running app:

```
node scripts/design-guides.mjs topics                       # what exists at all, per category
node scripts/design-guides.mjs search <term> --scope all     # docs + article tabs + kit docs
node scripts/design-guides.mjs list --tag <tag>              # the index, filtered
```

`topics` closes with the categories nothing covers yet — which is what separates "this is a
real gap" from "the search term was wrong". `search --scope all` reads the article tabs too,
so a subject covered inside an existing guide's Design tab shows up here even though no guide
carries its name.

**If an existing guide covers the need by ~80% or more, STOP.** Say so explicitly and
recommend extending that guide — another section in the tab that owns the ground, another row
in its reference table, another do/don't pair — rather than starting a second document on the
same subject. Two guides that overlap are a cost paid at every later re-measure, because both
have to be updated and neither is obviously the one to read (QUAL-006). Only continue once you
and the user agree nothing existing fits.

## Step 2 — pick the category (the fork)

Every guide sits in exactly one of three categories, and the choice has consequences beyond
the shelf it appears on:

- **`library`** — how to wield one library component. All twenty existing guides are these.
- **`foundations`** — a cross-cutting ground truth (tokens, color, typography, a11y). The
  CLI relates **every** `library` guide to every `foundations` guide *and back*, by category
  rule: a foundations guide needs no `related` entry anywhere to be reachable from the whole
  library shelf, and `bundle <id>` adds those edges itself. That is why foundations guides are
  written before further component guides — a later guide points at the foundation instead of
  re-deriving it.
- **`layouts`** — a page or layout pattern (composition, spacing rhythm, page skeletons).

Two things to tell the user before they choose: an empty category renders **no** gallery
section at all (`groupGuidesByCategory` drops it), and all three category labels already exist
in the chrome i18n in four languages (`devWorkshop.guides.category.*`) — so a guide in any of
the three needs **no** new translation keys. A *fourth* category is a framework change, not a
guide: the type union in `article-registry.ts`, `GUIDE_CATEGORIES`, and four new label keys.
Stop and ask if the subject seems to need one.

## Step 3 — scaffold the three artifacts in one pass

Pick an `id` (kebab-case). It is the route literal, the doc filename stem, the folder name, and
the class-name stem all at once — confirm it with the user before writing anything. Then
create all three artifacts together, so the gate never sees a half-state.

### 3.1 Registry entry

Append to `articleRegistry` in `src/app/dev/articles/article-registry.ts`, **respecting the
PARSER CONTRACT** (the gate reads this file as text, it cannot run TypeScript): field order
exactly `id, title, category, tags, summary, related, agentDocPath, loadComponent`; every
scalar a single-quoted string literal; `tags` and `related` each a single-quoted array on ONE
logical line; `loadComponent` a one-line arrow with a single-quoted `import('...')`.
`agentDocPath` is `assets/design-system/guides/<id>.agent.md`.

There is **no route work**: `dev.routes.ts` generates `dev/design/guide/<id>` from the
registry, and the gallery tile, the quick-switch group, the `/dev/agents` row, and the CLI index
all derive from the same entry.

`related` names the sibling guides worth reading next and must not be empty — the gate reads
an empty list as a missing field. An id whose guide is not written yet carries the **`planned:`
prefix** (`'planned:multiselect'`), in the registry **and** in the doc frontmatter: a bare id
that resolves to nothing fails the gate (a forward reference and a typo look identical from the
outside), and a `planned:` id that *does* resolve fails too — drop the prefix in the commit
that ships that guide.

### 3.2 Article component

`src/app/dev/articles/<id>/<id>-article.component.ts` — class `<Id>ArticleComponent`, selector
`app-<id>-article`, standalone, `ChangeDetectionStrategy.OnPush`. It renders
`<app-guide-shell [entryId]="'<id>'">` and projects each tab body as
`<ng-template appGuideTab="…">`; the shell owns all chrome (header, tablist, quick-switch, the
always-present Agent tab). Tab ids are typed in `article-shell.component.ts` (`GuideTabId`):
`examples` · `usage` · `design` · `development` · `i18n` · `history`. A subset is fine — only
delivered tabs render — and `history` renders as a quiet footer rather than a tab, but it is
declared like any other.

Boilerplate first — let the Angular CLI make the file (ADR-0011); `angular.json` already
defaults components to standalone, inline template, inline style, scss, and prefix `app`, which
is the single-file shape every article uses:

```
ng generate component dev/articles/<id>/<id>-article --flat --skip-tests
```

(`--flat` keeps the file in the guide's own folder instead of nesting another one.) A checkout
without `node_modules` has no CLI to run — the kit ships without an installed tree — so there,
copy the shape from a sibling article instead. The file path, class name, and selector above are
the contract either way.

Then write the tabs, under the conventions the gate and the harvesters hold you to:

1. **The four block markers.** Content of the same kind carries the same marker everywhere, so
   one call can harvest it across the corpus — and the gate fails the build when a marker is
   present but unrecognized: do/don't pairs (`dd__cell dd__cell--bad` / `--good`), reference
   tables (a `table-wrap` around every `<table>`, with `<thead>`/`<tbody>` and a heading),
   provenance notes (`<p class="src-note">`, a `<p>` and nothing else), code recipes
   (`<pre class="code-block"><code>…</code></pre>`). The exact markup, with a wrong/right pair
   each, is in `guide-authoring.md` → "Harvest contracts". Deviating does not merely look
   different — it removes the content from every cross-guide answer.
2. **A Usage tab must yield at least one do/don't pair.** That is the one *presence* rule; the
   rest are recognition rules.
3. **Facts live in flat string constants.** The tab extractor substitutes `readonly m = { … }`
   measurement objects and `readonly …Snippet = '…'` code samples, so a table arrives with its
   numbers and a recipe with its code. Anything computed at runtime (a signal, a `@for`
   variable, a ternary) prints as written outside the browser — legitimate only where the block
   IS the live output.
4. **Contrast ratios are quoted, never eyedropped.** Take them from
   `docs/generated/CONTRAST.MD` (or `contrast.json`), which `scripts/check-contrast.mjs`
   regenerates from the real tokens; cite the pair and the criterion. If the pair you need is
   one of the declared exceptions, say so and link the compilat — do not quietly cite a passing
   neighbor.
5. **One explicit statement about narrow screens**, in the Design tab: the behavior, its
   breakpoint or its absence, and what the caller must do. "No intrinsic responsive behavior"
   is a legitimate answer; silence is not. Not gated — carried by new guides from the first
   commit.
6. **No backtick inside the `template:` or `styles:` literals** — both are lexed by
   `check-inline-templates.mjs`, and a stray backtick in a CSS comment has broken this build
   twice.
7. **Cite only what exists.** Every kit file (`*.ts|scss|mjs|json`) and every `app-…` selector
   the doc or a tab body names is checked against the tree. Library citations under
   `node_modules` are out of scope by construction; kit citations are not.

### 3.3 Agent doc

`src/assets/design-system/guides/<id>.agent.md` — the contract an agent keeps loaded, while the
tabs are the encyclopaedia it opens when a task lands on their ground. Frontmatter:

- `id, title, category, tags, summary, related` — **identical to the registry entry**, string
  for string and order for order; the gate compares all six.
- `tabs:` — an indented block mapping, one curated line per projected tab, `history` included.
  The line says what is IN the tab, not how it got there; max 140 characters. The gate checks
  it against the article's `appGuideTab` templates in **both** directions and verifies each
  declared tab can actually be sliced.
- `measured-against: <package>@<version>` — the build you actually read the claims off. Take
  it from `package-lock.json` (or `node_modules/<pkg>/package.json` in an installed tree), not
  from the range in `package.json`: a guide whose line numbers came from 21.1.9 says 21.1.9
  even if the manifest says `^21.1.5`.
- `covers: [<entrypoint>, …]` — the library components the doc **explains** (contract,
  keyboard, tokens), as entrypoint names (`badge`, `overlaybadge`, `treetable`); `[]` for a
  guide with no library surface. A component the doc only routes to is not covered. The list
  sets the byte ceiling and feeds `design-guides.mjs coverage`; the gate checks each name
  against the installed package and rejects a component two guides claim.

Then the nine mandatory sections, in this order, and no tenth: **When to use · When not to
use · Key API · Accessibility · Pitfalls · Sources · Semantic mapping · Rules · Default
snippet**. Close with the pointer line, verbatim:

```
Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.
```

Budget from the first draft: the gate measures the **authored body** (frontmatter excluded) and
fails over 8,500 bytes for one covered component plus 1,500 per further one, warns 2,000 under
that line (6,500 / 8,000 / 9,500 for one, two, three). Most existing docs sit in the warn band,
so there is no headroom to inherit — when a byte target and a citation collide, the
evidence wins and the overrun is declared in the commit body. Trim prose, never provenance. No
per-call-site inventories of the host app, and no session narrative: how you found out belongs
in the commit body, what holds belongs in the guide.

## Step 4 — prove it green

Run the gates and show the real output:

```
node scripts/check-design-guides.mjs      # registry <-> component <-> doc <-> routes + harvest contracts
node scripts/check-inline-templates.mjs   # backticks in the article's inline template / styles
node scripts/verify-harness.mjs           # harness integrity
```

All must PASS with the new guide counted — the guide count in the `check-design-guides` PASS
line goes up by one, and every harvest line reports *seen == harvested*. Size warnings do not
fail the build; a warning on a brand-new doc means write less, not ship it anyway. A green gate
is the evidence the scaffold is complete: there is no manual index upkeep, because the route,
the gallery tile, the quick-switch entry, and the CLI index all derive from the registry. Do
**not** run `npm run build:prod` / `ng build` / the test suite unless the user asks — the gates
above are the fast proof; a full build is `/ship`'s job.

## Handoffs

- The subject is a primitive **this kit ships**, not one it consumes → `/new-component`.
- A page or a reader-facing content artifact, not a design-system article → `/new-content`.
- The knowledge is a policy or convention rather than a pattern article → `/new-directive`.
- You changed the guides *framework* itself (the tab set, the registry contract, the nine
  sections, the CLI, the gate) → `directives/guide-authoring.md` is updated in the **same
  commit**; that directive says so about itself.
- Finished and ready to land → `/ship` runs the Definition-of-Done gate. Cross-links: this
  skill ↔ `directives/guide-authoring.md` ↔ `/dev/agents`.

## Boundaries

**Green (just do it, once Steps 1 and 2 are settled):**
- Create the registry entry, the article component, and the agent doc locally, and run the
  gates. These are local, reversible edits — tell the user which files you touched.

**Ask first:**
- The `id` — it is the route, the doc stem, the folder, and the class name at once, and changing
  it later touches all three artifacts.
- The category (Step 2) — it decides the shelf and, for `foundations`, an automatic relation to
  every library guide.
- The tab set and the `related` list, before writing the frontmatter that must match them.

**Never:**
- Register a guide before its gates are green — a half-guide fails the build for everyone
  working in the tree.
- Claim a gate ran green when it did not (QUAL-007) — paste the real output.
- Reflow a registry entry away from the PARSER CONTRACT (it is parsed as text, not compiled).
- Edit the existing guides' agent docs or article components to make room for the new one; the
  only legitimate touch is dropping a `planned:` prefix that your guide has just resolved.
- Hand-measure a contrast ratio, or cite a file or `app-…` selector you have not verified
  exists.
- Put real personal data in an example — use synthetic content (PRIV-001).

**Stop and ask if…**
- the guide would pull in a **new dependency** (an npm package, an Optimus UI module the kit does
  not use yet) — that is a bigger decision than a scaffold; surface it, don't add it silently.
- it would touch **production routes or app-shell wiring** — anything outside
  `src/app/dev/**` and `src/assets/design-system/guides/**` is out of scope for this skill.
- it needs a **new category**, a new tab id, or a tenth doc section — those are framework
  changes with their own directive lockstep, not part of writing one guide.
- Step 1 found a ≥80 % match, or the subject turns out to be a kit primitive — both are reuse
  decisions, not a new guide.
