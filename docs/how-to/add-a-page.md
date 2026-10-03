<!-- kit -->
# Add a page

Goal: a new routed page — reachable, translated, navigable, prerender-safe, and with tests
that actually run. Every step below exists because skipping it fails either loudly (build)
or, worse, silently (tests, stale prerender). Written after a real build session
reconstructed all of this from source; now it's a recipe.

Worked example throughout: a page at `/my-page`, component `MyPageComponent`.

**Shortcut:** `node tools/new-page.mjs my-page --kind page --strings <file.json>` does steps
1, 3 and 6 and prints the lines for steps 2 and 4 to paste ([Use the kit tools](use-the-kit-tools.md#start-a-new-page-of-the-portal)).

## 1 · Component

`src/app/pages/my-page/my-page.component.ts` — standalone, `@if`/`@for`, and every
`window`/`document`/`localStorage`/`navigator` access behind `isPlatformBrowser(...)`
(unguarded browser globals crash the prerender build; see `AGENTS.md` → Code style).
Use an existing page as the template — `src/app/pages/accessibility/accessibility-statement.component.ts`
is a small, current one. Before building any UI, follow
[`directives/design-system.md`](../../directives/design-system.md) (the CLI-first
reading path).

## 2 · Route (`src/app/app.routes.ts`)

Add an `ExtendedRoute` entry — the interface at the top of the file documents every
field. The ones that are always needed:

```ts
{
  path: 'my-page',
  titleKey: 'app.nav.myPage',        // translation key, not literal text
  icon: 'pi pi-star',
  group: 'portal',                    // nav dropdown group (see neighbours for options)
  groupTitleKey: 'app.nav.group.portal',
  pageId: 'mypg',                     // unique 4-char ID — grep app.routes.ts first!
  showByDefault: true,                // visible in the unfiltered nav dropdown?
  loadComponent: () => import('./pages/my-page/my-page.component').then(m => m.MyPageComponent)
}
```

`pageId` feeds `generatePageIdRedirects` — it becomes a short URL (`/mypg`) for QR/book
links, so it must be unique. If the page must not render under Node (canvas, animation
loops), also give it `RenderMode.Client` in `src/app/app.routes.server.ts`; otherwise the
default applies.

## 3 · i18n — all four languages, no registration

Create `src/assets/i18n/modules/<lang>/myPage.json` for **`de`, `en`, `de-easy`,
`en-easy`** (the module name becomes the key namespace), plus every language added since
([Add a language](add-a-language.md)). Modules are auto-discovered from
the directory — there is no registry to edit. `scripts/check-i18n-keys.mjs` fails when a
language lacks a key English has, and when a literal `translate('…')` call or `*Key:`
property does not resolve in the **English** modules; keys read through the pages' one-line
`t()` helper are outside that second net. It also fails the other way round, when a module
gains a key no source references: delete what the page stops using, and give a key that is
built at runtime (`translate('myPage.kind.' + kind)`) its prefix in the script's
`DYNAMIC_PREFIXES`, with the reason.

A new namespace lands in the small **core** bundle every page loads up front. If it is
page-sized (an article's text, say), list it in `lazyNamespaces` in
`src/config/i18n-bundles.json` — `article<Name>` namespaces already match — so it becomes a
chunk loaded only with the page. The route guard loads the namespace of the route's
`titleKey`/`descriptionKey` by itself; name any other lazy namespace the page reads in the
route's `i18n: [...]` list, or the browser shows its raw keys for a moment.

The nav title is the one key that does **not** live in your new module: the module
basename *is* the namespace, so `app.nav.myPage` belongs under `nav` in
`src/assets/i18n/modules/<lang>/app.json` — all four languages, same as above. There is no
`nav.json`.

## 4 · Prerender tier (`scripts/generate-prerender-routes.js`)

Decide the tier and add the path to the matching array (`TIER_0_ROUTES` /
`TIER_1_ROUTES`); the file's comments define the tiers. Rule of thumb: **every
statically-visible page goes into T1** — not for SEO, but because prerendering is the
proof that the page survives under Node: if it crashes during SSR, `build:prod` fails
loudly instead of shipping a broken page.

The two switches are **independent**: this list decides what gets rendered at build time,
while `RenderMode.Client` in `src/app/app.routes.server.ts` decides how a route that was
*not* prerendered is served. `RenderMode.Client` alone therefore does **not** keep a page
out of the prerender — `demos` is Client-mode *and* listed in `TIER_1_ROUTES`, and
`dist/vibecore/browser/de/demos/index.html` holds its real rendered content. What stays
out are the pages that genuinely cannot survive Node — the individual interactive demos
(canvas, `requestAnimationFrame`, animation loops). Those get both: `RenderMode.Client`
*and* no entry here.

## 5 · Sitemap (`scripts/generate-sitemap.js`) — usually no

Prerender and sitemap are separate decisions. Add a page to the sitemap only if it should
**rank**: content pages yes; forms, settings, and legal pages no. (A page can prerender
without being in the sitemap — that is the normal case for utility pages.)

## 6 · Tests — the silent trap

`angular.json → projects → … → test → options → include` is an **explicit allowlist**.
A new `.spec.ts` that is not listed there is simply never executed — the suite stays
green and tells you nothing. Add every new spec file to that array in the same commit
that creates it.

On Windows, run `npm run test:ci` from **PowerShell** — under Git Bash it can die with a
npm segfault that looks like a code failure but isn't.

## 7 · Verify

- `npm run test:ci` — and check your new specs appear in the run count.
- `node scripts/verify-harness.mjs` — the agent-harness gates. It checks the harness files
  itself, runs further gates as child processes (among them `check-design-system.mjs`,
  `check-design-guides.mjs`, `check-contrast.mjs`, `check-packs.mjs` and
  `check-doc-drift.mjs`) and the self-tests of other gates (imprint, overrides, house style);
  its header lists them all. Relevant to a new page: check 11, which
  cross-checks `angular.json`'s `test.include` allowlist against the specs on disk in both
  directions.
- `npm run build:verify` — the wider gate chain. The i18n-key gate
  (`check-i18n-keys.mjs`), the inline-template gate and the genericity gate live here, not
  in the harness. (It runs the harness too, passing `--skip` for the three design gates it
  invokes itself, so nothing runs twice.)
- `npm run build:prod` — then confirm `dist/vibecore/browser/.build-manifest.json` has
  `verification.passed: true` and `tests.gate: "passed"` (the curated suite runs after the
  build and its gate chain, before the manifest is written; `verify-build.js` checks that
  manifest last), and that `dist/vibecore/browser/de/my-page/index.html`
  contains your real content (that file is the proof the page prerenders).

Docs and the journal entry travel in the same commit (`base/BOOKKEEPING.md`).
