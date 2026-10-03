# Make it yours — plan

**Status:** in progress · **Date:** 2026-09-28 · What and why: [`shape.md`](shape.md)

Line numbers are from the tree of 2026-09-28 and drift as commits land; search by name.

## 1 Where sample content is wired (the map)

### 1.1 Routes — `src/app/app.routes.ts`
Start redirects 55-60 (`''`→home), 63-68 (`defaultsite`→home); legacy→home 83-96 (topics,
ai-topics), 861-866 (`unsupervised-learning-demo`); landing 71-80 (`home`). Portal group: 100-110
news, 113-123 roadmap, 126-135 sources, 140-150 progress, 153-162 user-settings (shell), 167-177
feedback, 180-189 impressum (shell), 195-205 accessibility (shell). Knowledge: 208-217 glossary,
220-229 ai-timeline, 232-241 catalog (+ legacy 244-268 ai-resources, ai-tools, rsrc, tool). Learn
276-285 (+ redirects 288-293 lernen, 302-307 guides, 790-795 lektionen, 802-807 learning-paths).
Seed article 317-341 (`articles/seed-article-1` + `article/sda1`). Samples 345-787 (15 ×
`articles/art-*` + `article/<pageId>` redirect). Demos 826-837 (hub, hidden), 841-856
(example-demo). Guards 891-902 `applyGuards` — the hook for a feature `canMatch` guard.
`src/app/app.routes.server.ts` 27-37 `DEMO_ROUTES`: the dev server refuses a server route not
declared on the client, so switched-off routes stay declared and are blocked by `canMatch`.

### 1.2 Navigation and frame
`src/app/services/navigation.service.ts` 73-91 `GROUP_OVERFLOW_CONFIGS` (→`/learn`), 160-215
search corpus (article index, demo index, glossary synonyms), 325-328 route loop, 390/405+
`addLearningPathsToNavigation`, 393 `groupOrder`. `components/frame/app-header.component.ts`
80-89 logo (86 icon `pi pi-box`, 87 `translate('app.title')`), 94-97 bell.
`notification-bell.component.ts:125` → `/news`. `app-footer.component.ts:18` hard-codes
"© … vibecore". `app.component.ts:126,146` print header/footer hard-code "vibecore".
`utils/sitemap-groups.ts` from NavigationService. `components/shared/breadcrumb.component.ts:38`
`HOME_PATH='home'`. `utils/preloading-strategy.ts:19,22`. Guard redirects to `/learn`:
`guards/draft-route.guard.ts:53`, `demo-release.guard.ts:59`. `thumbnail.component.ts:51-73`,
`baked-thumbnails.manifest.ts:10-27` (seeds only).

### 1.3 Home — `src/app/pages/home/home.component.ts`
Template: 97 hero (`home.hero.title`="vibecore"), 101-106 dev template bridge, 113 translation
notice, 129-153 quick start, 159 marquee (real indexes), 162-190 navigation examples, 193-218
showcase. Data: 668-707 `quickStartItems` (example-demo, glossary#seed-term-1,
ai-timeline#seed-event-1, articles/seed-article-1), 709-782 `showcaseItems` (learn, demos,
glossary, ai-timeline, catalog, roadmap, sources), 802-819 nav examples, 831-835 translation
notice with a fixed list of four languages.

### 1.4 Content data and builders
`src/assets/data/core/`: articles 16 (seed + 15 `art-*`), demos 1, glossary 49 (5 seeds + 44
samples; 225 sample files with translations), timeline 3 seeds, ai-tools/ai-resources 2+2 seeds,
sources 119 samples and no seed (360 files incl. `chapters.json`, `references.json`),
`learning-paths.json` seed-path-1/2 + 5 samples, ontology seeds only. Seeds reference only seeds.
`scripts/build-unified-content.ts` 87-127 `CONTENT_TYPES`, 228 `prodVisible`, 429-504
references.json auto-fill, 511-566 related-ref validation (523 needs `demos/index.json`).
`scripts/validate-article-references.ts:135-140` (tool/resource indexes must exist),
`scripts/sync-related-to-index.mjs:31-34`, `scripts/build-compiled-glossary.ts:77-83` throws on
an empty glossary, 152-155.

### 1.5 i18n
`src/assets/i18n/modules/{de,de-easy,en,en-easy}/`: 69 namespaces, en 4,037 keys / 66,407 words.
Sample-article namespaces (15 × `article*`) 2,311 keys, ~59,000 words. Feature namespaces:
learningPaths 119, devWorkshop 112 (dev-only, still required in every locale), catalog 58,
roadmap 56, aiResources 55, sources 54, home 63, exampleDemo 46, glossary 46, timeline 39,
news 35 … Shell ≈639 keys / 5,124 words (imprint 1,802). Cross-page keys:
`easyLanguage.content.<page>` (19 previews, 6 `art*`), `searchTerms.<pageId>`,
`seo.pages.<key>`, `app.nav.<key>`, `home.quickStart|showcase.<x>`. `src/config/i18n-bundles.json`
(lazy `^article[A-Z]`, devWorkshop; coreKeys hero). `scripts/build-i18n-bundles.ts` gaps are a
report only. `src/config/easy-language-availability.json` lists a page only if every locale has
its preview.

### 1.6 Prerender, sitemap, build verification
`scripts/generate-prerender-routes.js` 44-47 `TIER_0` (home, learn), 60-82 `TIER_1`, 117-142
articles from the index. `scripts/generate-sitemap.js` 44-68 `ROUTES`, 96-125 articles, 139-163
demos. `scripts/build-artifacts.js` 46-50 needs `<lang>/home/index.html` ≥1000 B, 52-66 bundle
counts, 155-184 raw-key scan. `angular.json` prerender `discoverRoutes:false`.

### 1.7 Gates — what breaks when samples are hidden (H) or deleted (D)
- `check-i18n-keys.mjs`: every key in every locale (616-647) — H: a new language still needs all
  sample strings. Zero orphans (82, 739-745) — D: leftover keys become orphans. Stale dynamic
  prefix is an error (365-367, 746) — D: `articleSecondBrain.origin.` (102) and
  `/^article[A-Z]…quiz/` (101) go stale. `easyLanguage.content.` / `searchTerms.` prefixes keep
  dead previews alive — D: `art*` previews must be removed explicitly. Easy-availability file
  stale (689-704) — D: regenerate.
- `check-content-coverage.mjs`: 0 entries in a collection is an error (199-204) — D: sources → 0
  (hence `seed-source-1`); Easy baseline 100-103.
- `build-compiled-glossary.ts:77-83` throws on empty (only if seeds go too).
- `check-genericity.mjs:243-245` 0 timeline files is an error (seeds stay).
- `validate:refs` / related refs: indexes must exist, refs must resolve (pre-run reference check).
- `thumbs:validate` (seeds only baked). `verify-build`/`build-artifacts`: `<lang>/home`.
- `check-a11y.mjs:77-86` `PAGES` must be prerendered (article, glossary, demos, ai-timeline,
  sources …) — H: breaks for switched-off features.
- `check-design-guides` check 9: cited files must exist (`article-layout.agent.md:58`,
  `demo-layout.agent.md:33,61`, `chart.agent.md:26`) — seeds must stay.
- `check-test-baseline.mjs:144-145` floor; `verify-harness` check 11 (`test.include` ↔ disk).
- house-style: stale allowlist entry `ai-project` (139), warning only.

### 1.8 Specs bound to real sample data
`learning-progress.service.spec.ts` 25-27 real indexes, 125-132 index ids == `TOPIC_MILESTONES`,
157 pins "15", 173-280 `art-git-intro` vs `learning-progress.service.ts:120-186`.
`structured-data.service.spec.ts:9-11` imports sample glossary files (`agent-loop`, `agent`).
`content-marquee.previews.spec.ts:24-25` real indexes (seeds pass). `navigation.service.spec.ts:
124-128` expects `/glossary`, `/learn`. `easy-language.service.spec.ts:40-53` expects
`aiTimeline`. `app.routes.maps.spec.ts:36-40`, `preloading-strategy.spec.ts:20-24`
declarations only (fine while routes stay declared).

### 1.9 Identity and imprint
Name: `src/index.html` 5, 136-161 (description, og, twitter), redirect codes 182, default 194;
`app.json:44 title`; `seo.json` (every `pages.*.title` has "- vibecore", `site.name`);
`meta.json` description; `home.json:4`; `easyLanguage.json` de/de-easy:196, en/en-easy:178
"Sie gehört Your Name." (a placeholder `check-imprint` misses);
`services/meta-seo.service.ts` 56-64 `SEO_ROUTE_KEYS`, 185-191 title, 255-260 fallback
"vibecore"; `services/structured-data.service.ts` 70-75, 272 alternateName, 305 SearchAction →
glossary; `src/assets/images/og-image.svg` 51-53 (PNG via `scripts/render-og.mjs`).
Imprint: `src/config/site-operator.ts:32-41`; `impressum.json` "[Thema der Website]" and
legal-basis placeholders; `scripts/check-imprint.mjs` fails only with a real domain set.

## 2 Design

**Config**, after the `languages.json` + `language-rules.mts` pattern:
- `src/config/site.json` — the user's choices: `name`, `shortName?`, `logoIcon?`, `startPage`,
  `features{<id>: true|false}`, `operator{name, address, email, supervisoryAuthority{…}}`.
- `src/config/features.json` — kit knowledge per feature: `routes` (prefixes, `articles/*`),
  `i18n` namespaces/prefixes, `collections`, prerender tier, `sitemap`, `a11yPages`, `devOnly`.
- `src/config/samples.json` — sample ids per collection plus explicit i18n keys and namespaces.
- `src/config/site-rules.mts` — pure functions used by the app (`src/config/site.ts`, a
  `SITE_CONFIG` injection token with `KIT_DEFAULT_SITE` for specs) and by scripts
  (`scripts/lib/site-config.mjs`).

**Tool** `tools/make-it-yours.mjs` (tools convention, model `tools/new-page.mjs`):
```
node tools/make-it-yours.mjs                    status: name, start page, features, samples left,
                                                imprint gaps, strings a new language needs
node tools/make-it-yours.mjs --site <answers.json>   merge into site.json + meta.description per
                                                locale; write index.html / og svg / impressum subject
node tools/make-it-yours.mjs --remove-samples [--dry-run] [--json]   needs a clean git tree
```
Every locale required; all checks before the first write; a failed write is rolled back (exit 3);
same input, same bytes; never commits — prints the staging line and `git revert` as the undo.
Removal: pre-checks (i18n gate green, no content refers to a sample id, markers balanced) →
delete page folders, core + translation files, i18n namespaces in every locale folder → edit
indexes, `references.json`, `learning-paths.json`, `easyLanguage.content.*` → cut the marker
blocks in `app.routes.ts` → regenerate the Easy availability file → drop orphan keys (logic moved
to `scripts/lib/i18n-orphans.mjs`) → empty `samples.json`.

**Feature switches:** a `canMatch` feature guard in `applyGuards` plus feature-aware redirects;
nav and learning-path group skip switched-off features; home items filtered; bell hidden when
news is off; guards fall back to the start page when `/learn` is off; SearchAction only with the
glossary; breadcrumb and preload lists read the config.

**Start page (decided, shape.md):** `startPage` drives `''`/`defaultsite` redirects, the logo
link, the breadcrumb root and prerender tier 0; `/home` stays and is always prerendered.

## 3 Build order (one commit each, `build:prod` green after each, kit defaults unchanged)

- **C1 Preparation**, no behaviour change: milestones move from `learning-progress.service.ts`
  into the article/demo indexes (types in the services); `learning-progress.service.spec.ts` and
  `structured-data.service.spec.ts` get inline fixtures; `check-i18n-keys.mjs`: a prefix is stale
  only if it matches no key (+ selftest fixture); `seed-source-1` (core, de/en, index,
  references). ~10 files.
- **C2 Identity:** `site.json`, `site-rules.mts`, `site.ts`, `scripts/check-site-config.mjs`
  (+ selftest) in `build:verify` and the harness selftests; header, footer, `app.component`,
  meta-seo, structured-data and home hero read the name; i18n drops `app.title` and
  `seo.site.name`, strips "- vibecore" from `seo.pages`, `{siteName}`/`{operator}` in the Easy
  imprint block; operator into `site.json`, `site-operator.ts` re-exports it, `check-imprint`
  reads it; specs (`site-rules.spec.ts`, meta-seo, app.component); baseline raised; `deploy.md`
  EN+DE. ~25 files.
- **C3 App switches:** `features.json`, guard, redirects, NavigationService, home, header,
  guards, breadcrumb, preload, structured-data; specs (navigation with the default token and a
  switched-off test, guards, a new `home.component.spec.ts`). ~14 files.
- **C4 Build switches:** `generate-prerender-routes.js` (T0 = start page, deduplicated),
  `generate-sitemap.js`, `build-artifacts.js`, `check-a11y.mjs` page list. ~6 files.
- **C5 Feature-aware gates:** `check-i18n-keys` scoped by feature, dev-only exemption
  (+ selftest); `check-content-coverage` skips switched-off collections; compiled glossary empty
  when off; bundle builder gap report; `tools/lang-status.mjs` (+ test); easy-language spec on
  shell pages; `add-a-language.md` EN+DE. ~9 files.
- **C6 Manifest:** `samples.json`; marker comments around the sample routes in `app.routes.ts`;
  consistency and reference checks in `check-site-config`. ~4 files.
- **C7 Tool:** `tools/make-it-yours.mjs`, `scripts/lib/i18n-orphans.mjs` (shared with
  `check-i18n-keys`), `tools/test/make-it-yours.test.mjs` with a mini-kit fixture git-inited in
  scratch. Tests: `--help`; status JSON; `--site` snapshot + determinism; bad feature / start page
  / missing locale → exit 2, nothing written; dirty tree → exit 2; dry run writes nothing; full
  removal matches snapshots incl. an extra `it` locale; twice is safe; reference violation, bad
  markers, read-only rollback → exit 3. `kit.json` entry, `tools/README.md`,
  `use-the-kit-tools.md` EN+DE, new `docs/how-to/make-it-yours.md` + DE mirror,
  `translation-manifest.json`, onboarding hand-off line, CHANGELOG, JOURNAL.
- **C8 Trial** on a throwaway copy: tool run, add Italian, `lang-status` before/after,
  `build:prod`, `test:ci`, `check:a11y`; the measured numbers go into the how-to.

## 4 Risks

1. Manifest and markers drift as samples are added — `check-site-config` guards it.
2. Deleting ~670 tracked files is Yellow: the tool refuses a dirty tree; staging afterwards with
   `git add -u -- <paths>` (the safety hook treats `git add -A` as Red); undo `git revert`.
3. Orphan removal is only safe when the i18n gate is green before the run (pre-check).
4. Seeds stay public while their feature is on; the status output says so.
5. Parked: a cookie-notice switch, OG PNG rebake.

## Log

<!-- One line per finished step: date, commit, what, deviations from this plan. -->
2026-09-28 C1 — milestones moved from `TOPIC_MILESTONES` into `milestones` of each entry in `articles/index.json` and `demos/index.json` (type in `services/milestones.types.ts`, field on `ArticleMeta`/`DemoMeta`; same 17 ids, same values); `learning-progress.service.spec.ts` on fixture ids, its "15 paths" pin replaced by a check over whatever steps declare parts; `structured-data.service.spec.ts` inline glossary fixtures; `check-i18n-keys` reports a prefix as stale only while keys still start with it and nothing builds it, a prefix that matches no key is listed as idle (selftest: `gone.left`, `emptied.`, a regex family); `seed-source-1` (Project Gutenberg, type website, year null, de/en title, index, references), deviations: the brief said "stale only if it matches NO key" — implemented the inverse, since after the sample removal the entries `articleSecondBrain.origin.` and `/^article[A-Z]…quiz/` match no key and must not fail; `sources.chapters.` is idle already today.
2026-09-28 C2 — `src/config/site.json` (name, startPage, features `{}`, operator with today's placeholders), `site-rules.mts` (validateSiteConfig, createSiteRules → name/logoText/logoIcon/pageTitle/fill/isFeatureOn, KIT_DEFAULT_SITE), `site.ts` (SITE, SITE_CONFIG token, KIT_DEFAULT_SITE_RULES), `scripts/lib/site-config.mjs`; `site-operator.ts` re-exports `SITE.operator`; header (logo text + icon + aria-label), footer, print header/footer, home hero, MetaSeoService (titles `<page> - <name>`, `{siteName}` in seo strings), StructuredDataService read SITE_CONFIG; Easy fab fills `{siteName}`/`{operator}`; i18n drops `app.title`, `home.hero.title`, `seo.site.name` and the "- vibecore" suffixes (default title `{siteName} - …`, descriptions/keywords `{siteName}`); `check-imprint` scans site.json's operator and the Easy imprint preview; new `check-site-config.mjs` (+14-case selftest) in `build:verify`, `npm run check:site`, harness check 18; specs site-rules (new), app.component, meta-seo, routes-maps; baseline 59/719; deploy.md EN+DE, add-a-language.md example key EN+DE, deviations: (1) the Easy imprint preview now shows the operator's real placeholder "[NAME]" instead of the invented "Your Name" until the operator is filled in; (2) JSON-LD `alternateName` ['vibecore','vibecore Portal'] dropped — it is `[shortName]` when a shortName is set, absent otherwise; (3) the logo icon's class order in the DOM is `app-title-icon pi pi-box` (bound), same look; (4) `seo.pages.default.description` kept: it differs from `meta.description`; (5) start-page validation in the gate parses top-level route objects of `app.routes.ts` (a spec holds `SITE.startPage` against the live routes too); `KNOWN_FEATURES` in `check-site-config.mjs` is `[]` until C3's `features.json`.
2026-09-28 C3 — `src/config/features.json` (10 features: routes incl. legacy redirects, `navGroups` for routes added later — `learningPaths`, `interaktiveDemos` —, i18n key paths + `i18nShared`, collections, prerender tier, sitemap, a11y pages; `shellPages` home/user-settings/impressum/accessibility; `devOnly.i18n` devWorkshop); `site-rules.mts` gets the catalog (`featureOfRoute`, `isRouteOn`, `activeFeatures`, `validateFeatureCatalog`, start page inside a switched-off feature refused; `SiteRules.isRouteOn/featureOfRoute/routeOrStartPage/activeFeatures`), `site.ts` `FEATURES` + `siteRulesFor`; `feature.guard.ts` (`canMatch`, added in `applyGuards` to component routes a feature owns) redirects to the start page; `''`/`defaultsite`/`topics`/`ai-topics`/`unsupervised-learning-demo` redirect to `SITE.startPage`; draft/demo guards fall back via `routeOrStartPage('learn')`; breadcrumb `HOME_PATH = SITE.startPage`; preloading skips off routes; NavigationService skips off routes and groups, the learning-path group without learn, the overflow hub link (`getGroupConfig` → undefined, so the sitemap overlay follows), glossary/demo search sources; home quick-start/showcase/nav examples/TOC filtered (showcase hidden when empty), marquee tiles, header bell only with news, SearchAction only with the glossary; specs site-rules (+8), routes-maps (+3: feature routes declared, guard on exactly the owned routes, redirects to the start page), guards (+6), navigation (+2, default token via factory), new `home.component.spec.ts` (4); baseline 60/742; kit defaults: `features` stays `{}` (a missing key is on — documented in site.json's `_features`), deviations: (1) a switched-off route redirects to the start page instead of the 404 page (an old link was valid once); (2) articles are no feature — always on, like the shell pages (the map lists them apart from learn); (3) the logo link stays `routerLink="/"`, which follows the start page through the `''` redirect, so the kit's markup is unchanged; (4) also filtered, beyond the brief: the home marquee tiles and the not-found page's three popular links; (5) build-artifacts' notifications requirement goes with the news feature.
2026-09-28 C4 — `generate-prerender-routes.js` `activeTiers()` (T0 = start page + `TIER_0_ROUTES`, deduplicated; T1 minus T0; articles filtered; the tables stay the kit's full lists, new-page's "end of TIER_1_ROUTES" anchor unchanged), `generate-sitemap.js` `siteRoutes()` (hub table and articles filtered, demos only with the demos feature, the start page leads when no table lists it), `build-artifacts.js` (the `<lang>/home` check stays), `check-a11y.mjs` skips the `a11yPages` of switched-off features and says so; `check-site-config.mjs`: `KNOWN_FEATURES` from features.json, catalog held against app.routes.ts (every feature route declared, shell pages routed) and against the prerender/sitemap tables (`prerenderTier`, `sitemap`), selftest 14 → 24 cases; kit-default prerender list and sitemap byte-identical to before. Switch experiment (site.json restored byte-identical afterwards): news/roadmap/timeline off + start page glossary → 54 prerendered routes (T0 glossary, home, learn), sitemap hubs home, glossary, catalog, impressum, accessibility; gate PASS; start page news → gate FAIL in words, generators throw; test:ci 60/742 green with the switches set. The how-to comes in C7 (`docs/how-to/make-it-yours.md`), not in deploy.md.
2026-09-28 C5 — new `scripts/lib/feature-scope.mjs` (one rule for gates, gap report and lang-status: a key owned only by switched-off features, minus `i18nShared`, is not required outside the key source; `devOnly` keys are required only in the key source, and a locale that carries some keys of a dev-only entry must carry all of them; a collection owned only by off features is skipped); `check-i18n-keys` parity by that scope + OWNERSHIP rule (a literal, prefix builder or `*Prefix:` input in src/app — not specs, not src/app/dev — naming a key of a namespace a feature owns whole, outside the feature's new `code` paths and its own route blocks in app.routes.ts, must be in `i18nShared`; key-path entries in shared namespaces are the catalog's statement that their readers filter), selftest +11 checks; `features.json` gets `code` per feature, `i18nShared` + `glossary.title`/`glossary.description` (structured data), `sources.title` + `lernbereich.filterDemos` (roadmap), `exampleDemo.title` (home, not-found), `devOnly` + `app.nav.devWorkshop`; `site-rules.mts` accepts `code`; `check-content-coverage` skips and names off collections; `build-compiled-glossary` writes `{}` per locale with the glossary off; bundle gap report counts only required keys; `lang-status` counts only what is on (`features.off`, `skipped` per UI and content part) + test; glossary popover hides "go to glossary" when the glossary is off (+2 specs, baseline 60/744); easy-language spec on shell pages; add-a-language EN+DE with measured numbers (it: 3,921 keys/63,961 words + 8,053 content words → 3,447/62,634 + 0 with glossary, timeline, catalog, sources, news, roadmap off; without the 15 sample articles 18,249 → 8,869 words), deviations: (1) roadmap's go-live sections now skip switched-off features (it read `app.nav.*` unfiltered, which the key-path declaration assumes); (2) the "still read by code that is on" requirement is held statically against the catalog, not computed per switch; (3) with the glossary off nothing is highlighted, so the popover link change is a safeguard; (4) older rough word counts in add-a-language (13,000/55,000/22,000/9,000) replaced by the measured ones.
2026-09-28 C6 — `src/config/samples.json` (15 articles with `id`/`pageId`/`namespace`/`folder`, 44 glossary terms, 119 sources, 5 learning paths, 11 `i18nKeys`: the 6 `easyLanguage.content.art*` previews and the 5 `learningPaths.<path>` blocks; `notSamples: []`); one marker pair per sample (`// sample:begin <id>` … `// sample:end <id>`, around the description comment, the route and the `article/<pageId>` redirect) plus a note above them in `app.routes.ts`; rules in the new `scripts/lib/samples.mjs` (shared with the tool, reads through an `io` so the selftest runs in memory): shape (a seed is never a sample), files (folder, core file, index entry with the same page id, key-source module, glossary/source files + index, learning-path entry, i18n key paths; while samples are listed every `art-*` on disk is listed or in `notSamples`), markers (balanced, not nested, one pair per listed article, the article's routes only inside), references (in `src/assets/data`: `related`, `*References`, `sources`, `*Concepts`, `prerequisitePathIds`, `detailIds`, typed `{ type, id }`, `<type>:<id>` keys, `articles/<id>` routes; in `src/app` (no specs, marker blocks blanked) and in non-sample i18n strings: a sample route or folder import); `check-site-config.mjs` rule 4 + 13 selftest cases (37 total); `searchTerms`/`seo.pages`/`app.nav`/home items hold no sample key today, deviations: (1) `notSamples` added — the "every `art-*` is listed" rule would otherwise fail a user who writes an own `art-…` article before removing the samples; the rule only holds while samples are listed; (2) the reference check reads reference-bearing fields, not every string: a plain field like `"integration": "api"` (seed tool) would otherwise hit the sample term `api`.
2026-09-28 C7 — `tools/make-it-yours.mjs` (status / `--site` / `--remove-samples`, `--dry-run`, `--json`), `tools/lib/config-json.mjs` (writes site.json/samples.json byte-identical to the hand layout), `scripts/lib/i18n-orphans.mjs` (DYNAMIC_PREFIXES, stripCodeSamples, findOrphans, `isOrphanSource` — now also excludes samples.json —, `leafKeys`; `check-i18n-keys.mjs` imports it), `tools/test/make-it-yours.test.mjs` (12 tests; the mini kit is written by the test, git-inited in scratch, and carries a copy of the REAL i18n gate, so "gate green before/after" is the gate's verdict; the read-only rollback runs for real on Windows, no injected hook), `new-page --kind demo` writes `milestones` (one checkpoint `<slug>-checkpoints`/`main`) and prints the `<app-checkpoint>` line (+ test), `kit.json` tool + capability `site:make-it-yours`, `tools/README.md`, `docs/how-to/make-it-yours.md` + DE mirror + manifest, links in how-to README / add-a-language / use-the-kit-tools EN+DE, onboarding finish point 5, CHANGELOG; `content-marquee.previews.spec.ts` gets an inline unbaked article (after the removal only the baked seed and demo were left and its "a fallback tile exists" and "> 2 paths" checks failed — plan §1.8 said "seeds pass"). Trial on a `git clone --local` copy: `--remove-samples` 667 files deleted, 20 edited, keys 2,311 (sample modules) + 72 (listed) + 4 (orphans, `articles.json`), en keys 3,863 → 1,476, namespaces 69 → 54; check-i18n-keys, check-content-coverage (after `content:build`), check-site-config green; `lang-status it` UI 3,921 keys/63,961 words → 1,504/8,861 (it-easy 48,552 → 8,431), content 8,053 → 302 words (it-easy 5,095 → 473); second run exit 0; test:ci 60/744; build:prod EXIT 0 in 129 s, 31 prerendered routes (kit: 60 in the route list, now 30); `--site` there: 7 files, gate green, Prettier-clean. Deviations: (1) the capability prefix `site:` is new — kit/pack schema and `check-packs.mjs` accept it, because the base onboarding skill finds the tool only through a capability; (2) `description` in `--site` is required only with a new name (a feature switch alone needs no four texts), but complete when given; (3) the impressum subject and the OG PNG are named in `notChecked`, not written; (4) failed pre-checks exit 3 as briefed, a dirty tree exit 2, `--dry-run` on a dirty tree only warns; (5) sample-only shared components (path resolver, prompt builder …) and their namespaces stay — still read by their code, so no orphans, and unused.
2026-09-28 review follow-up — the four open findings of the second review: (5, major) no link into a switched-off feature: `RelatedRefsService` drops references whose feature is off (`isTypeOn`, glossary/timeline/sources/catalog/demos, plus an `isRouteOn` safety net) and gives the knowledge map no such node (`ontology-map` filters nodes and edges); article and lesson back buttons go through `utils/learn-back-link.ts` (learning area, else the start page with the new key `common.backToStartPage` in all four locales); the lesson template hides "view in catalog" while the catalog is off; beyond the brief, found by grepping links to feature routes: notices drop links into off features (`NotificationService`), the roadmap hides its /news link, path drops without learn and demos without demos, the learn hub lists no demos and offers no demo filter without demos, a path's demo steps are hidden and unclickable, the progress page counts no demos; (6) `--remove-samples` runs the real i18n gate on the written tree and puts every file back when it is red (exit 3; `applyWithUndo` returns its undo; tool test with a home page reading a listed `i18nKeys` path); (7) `SiteRules.fallbackFrom` — draft and demo guards send to `home` when the start page is the refused route itself, so no redirect loop (chosen over a gate rule because visibility changes with the date, not the build); (8) make-it-yours how-to EN+DE: `shortName` replaces the name in the header on every screen size. Tests: new `related-refs.service.spec.ts` (4), `feature-switch-links.spec.ts` (9), guards +2, site-rules +1, learning-progress +1, make-it-yours tool +1; baseline 62/761; test:tools 108/108. CHANGELOG unchanged (nothing in it became untrue). Deviation: the dead `/concept-map` link of the knowledge map (no such route, lands on the 404 page) predates this work and stays.
