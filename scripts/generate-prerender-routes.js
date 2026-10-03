/**
 * Generates prerender-routes.txt for Angular SSR static prerendering.
 *
 * Implements Tiered Selective Prerendering:
 *
 * Page Tiers:
 *   T0 (start page, home, learn) — prerendered for ALL SEO languages
 *   T1 (hub pages)  — prerendered for language tiers 1+2
 *   T2 (articles)   — prerendered for language tier 1 only
 *   T3 (demos etc.) — never prerendered
 *
 * Language Tiers (`prerenderTier` in src/config/languages.json):
 *   T1 — full prerender (T0 + T1 + T2); the kit ships de and en here
 *   T2 — partial prerender (T0 + T1)
 *   T3 — minimal prerender (T0 only)
 *
 * Routes of a feature that src/config/site.json switches off are left out.
 *
 * Run: node scripts/generate-prerender-routes.js
 */

const fs = require('fs');
const path = require('path');

// ── Language Tiers (`seo` + `prerenderTier` in src/config/languages.json) ──
//
// Read through the shared language rules, the same data the sitemap, the
// runtime hreflang tags and the build verifier use — there is no second list
// to keep in sync. An SEO language without a tier counts as tier 1.
const { SEO_LANGUAGES } = require('./lib/locale-fallback.mjs');
const tierOf = (l) => l.prerenderTier ?? 1;
const LANG_TIER_1 = SEO_LANGUAGES.filter((l) => tierOf(l) === 1).map((l) => l.code); // Full: T0 + T1 + T2
const LANG_TIER_2 = SEO_LANGUAGES.filter((l) => tierOf(l) === 2).map((l) => l.code); // Partial: T0 + T1
const LANG_TIER_3 = SEO_LANGUAGES.filter((l) => tierOf(l) === 3).map((l) => l.code); // Minimal: T0 only

// ── Site switches (src/config/site.json) ────────────────────────────────
// The start page leads tier 0, and every route of a feature that site.json
// switches off is left out (src/config/features.json says which route belongs
// to which feature; scripts/lib/site-config.mjs runs the app's own rules). The
// tables below are the kit's full lists; activeTiers() applies the switches.
const { loadSiteRules } = require('./lib/site-config.mjs');

// ── Page Tiers ────────────────────────────────────────────────────────────
// T0: Universal entry points — prerendered for ALL SEO languages, led by the
// start page of site.json. `home` stays whatever the start page is: it is the
// kit's landing page, and the build verifier checks <lang>/home.
//
// NOTE: Do NOT add `''` (empty path) here. Angular SSR prerenders the
// `{ path: '', redirectTo: 'home' }` route as an HTML Meta-Refresh stub
// (~250 bytes, <title>Redirecting</title>) at dist/vibecore/browser/<lang>/
// index.html. Google indexes those as Soft-404 / duplicate content. Without
// a stub, /<lang>/ falls through to the host's SPA fallback and the client
// router redirects to /<lang>/home/. A host that can do it may redirect
// on the server as well (the Apache rules in docs/how-to/deploy.md §5) — the kit assumes none.
const TIER_0_ROUTES = [
  'home', // Startseite
  'learn', // Lernpfade-Hub (zentraler Navigationseinstieg)
];

// T1: Primary hub pages — prerendered for language tiers 1+2
//
// `ai-tools` and `ai-resources` were listed here historically but are
// `redirectTo: 'catalog'` in app.routes.ts → they would prerender as
// Meta-Refresh stubs. `catalog` is the actual hub page; the legacy paths are
// left to the client router's redirect.
// Every statically-visible page ships here so build:prod actually SSR-renders
// it — if any page crashes during prerender (e.g. an unhandled HTTP error in a
// component's ngOnInit), the production build fails loudly instead of shipping a
// page that dies under Node SSR. All entries are prerendered for de + en (the
// only kit languages).
const TIER_1_ROUTES = [
  'glossary',
  'ai-timeline',
  'catalog',
  'news',
  'roadmap',
  'sources',
  'user-settings',
  // The progress overview. Listed for the reason stated above, not for SEO: it
  // reads localStorage through UserProgressService, so having build:prod render
  // it under Node is the cheapest proof that access is guarded. Like /feedback it
  // is deliberately absent from generate-sitemap.js — a personal view of one
  // browser's stored progress has nothing to rank.
  'progress',
  'impressum',
  'accessibility',
  // The feedback form. Listed for the reason stated above rather than for SEO —
  // it reads localStorage, so having build:prod render it under Node is the
  // cheapest proof that every browser-global access on it is guarded. It is
  // deliberately absent from generate-sitemap.js: a form has nothing to rank.
  'feedback',
  'demos',
];
// NOTE: interactive demos (e.g. /example-demo) are deliberately NOT listed —
// they are RenderMode.Client in app.routes.server.ts (canvas/animation, no SEO
// value) and must stay out of the prerender target list.

// Path → Article publishDate cascade
//
// Returns Map<articleId, ISO date string> with one entry for every step in a
// learning path that has its own `publishDate`. Mirrors the runtime cascade
// in ArticlesService.isVisible: an article is gated by `max(article.publishDate,
// path.publishDate)`. Demos are excluded — they are stand-alone pages whose
// availability is independent of their parent path.
function loadPathSchedule() {
  const pathsFile = path.join(__dirname, '..', 'src', 'assets', 'data', 'core', 'learning-paths.json');
  const paths = JSON.parse(fs.readFileSync(pathsFile, 'utf8'));
  const schedule = new Map();
  for (const p of paths) {
    if (!p.publishDate) continue;
    for (const step of p.steps) {
      if (step.type === 'article') schedule.set(step.id, p.publishDate);
    }
  }
  return schedule;
}

// T2: Article routes — prerendered for language tier 1 only
// Loaded dynamically from articles/index.json. An article is prerendered iff:
//   - a.draft !== true
//   - a.path is set
//   - a.publishDate (if present) is <= today
//   - the containing learning path's publishDate (if any) is <= today
//
// Future-scheduled articles stay out of the prerender output and the route
// guard blocks direct URL access until the next deploy after the date is
// reached. Mirrors draftRouteGuard / ArticlesService.isVisible.
function loadArticleRoutes() {
  const indexPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'core', 'articles', 'index.json');
  const raw = fs.readFileSync(indexPath, 'utf8');
  const parsed = JSON.parse(raw);
  const articles = Array.isArray(parsed) ? parsed : parsed.articles || Object.values(parsed);

  const today = new Date();
  today.setHours(23, 59, 59, 999); // Build-time check uses end-of-day
  const pathSchedule = loadPathSchedule();

  function isFutureISO(iso) {
    // Date-only OR full ISO — appending 'T00:00:00' to full ISO yields
    // Invalid Date (gate silently open). Mirror TimeGateService parsing.
    return new Date(iso.includes('T') ? iso : iso + 'T00:00:00') > today;
  }

  return articles
    .filter((a) => {
      if (!a || a.draft || !a.path) return false;
      if (a.publishDate && isFutureISO(a.publishDate)) return false;
      const pathDate = pathSchedule.get(a.id);
      if (pathDate && isFutureISO(pathDate)) return false; // cascade gate
      return true;
    })
    .map((a) => a.path);
}

// T3: Never prerendered (interactive demos and anything not listed above).
// These are served by the host's SPA fallback to index.html, which
// dist:prepare:prod copies from index.csr.html (docs/how-to/deploy.md §5).

/**
 * The tiers with site.json applied: tier 0 is the start page, then the
 * TIER_0_ROUTES, without duplicates; tier 1 is TIER_1_ROUTES minus what tier 0
 * already has; the articles are those of loadArticleRoutes(). A route of a
 * switched-off feature is in none of them.
 */
function activeTiers(site = loadSiteRules(), articleRoutes = loadArticleRoutes()) {
  const tier0 = [...new Set([site.startPage, ...TIER_0_ROUTES])].filter((r) => r && site.isRouteOn(r));
  const tier1 = TIER_1_ROUTES.filter((r) => site.isRouteOn(r) && !tier0.includes(r));
  const articles = articleRoutes.filter((r) => site.isRouteOn(r) && !tier0.includes(r) && !tier1.includes(r));
  return { tier0, tier1, articles };
}

function main() {
  const site = loadSiteRules();
  const { tier0, tier1, articles: articleRoutes } = activeTiers(site);
  const switchedOff = Object.keys(site.catalog.features).filter((id) => !site.isFeatureOn(id));

  const allLangs = [...LANG_TIER_1, ...LANG_TIER_2, ...LANG_TIER_3];
  const lines = [];

  // T0 routes: ALL SEO languages
  // (Empty path '' is intentionally rejected — see TIER_0_ROUTES comment.)
  for (const lang of allLangs) {
    for (const route of tier0) {
      lines.push(`/${lang}/${route}`);
    }
  }

  // T1 routes: Language tier 1 + 2
  const tier1And2Langs = [...LANG_TIER_1, ...LANG_TIER_2];
  for (const lang of tier1And2Langs) {
    for (const route of tier1) {
      lines.push(`/${lang}/${route}`);
    }
  }

  // T2 article routes: language tier 1 only. The kit ships one seed article
  // (articles/seed-article-1) whose route component is a static lesson page —
  // SSR-safe and prerender-worthy. Every published article in
  // articles/index.json lands here automatically (draft/publishDate gated by
  // loadArticleRoutes above).
  for (const lang of LANG_TIER_1) {
    for (const route of articleRoutes) {
      lines.push(`/${lang}/${route}`);
    }
  }

  const outputPath = path.join(__dirname, '..', 'prerender-routes.txt');
  fs.writeFileSync(outputPath, lines.join('\n') + '\n');

  // Stats
  const t0Count = tier0.length * allLangs.length;
  const t1Count = tier1.length * tier1And2Langs.length;
  const t2ArticlesCount = articleRoutes.length * LANG_TIER_1.length;

  console.log(`Generated prerender-routes.txt (Tiered Selective Prerendering):\n`);
  console.log(`  Site (src/config/site.json):`);
  console.log(`    Start page:   ${site.startPage}`);
  console.log(`    Switched off: ${switchedOff.length ? switchedOff.join(', ') : 'none'}`);
  console.log();
  console.log(`  Language Tiers:`);
  console.log(`    T1 (full):    ${LANG_TIER_1.join(', ')} (${LANG_TIER_1.length})`);
  console.log(`    T2 (partial): ${LANG_TIER_2.join(', ')} (${LANG_TIER_2.length})`);
  console.log(`    T3 (minimal): ${LANG_TIER_3.join(', ')} (${LANG_TIER_3.length})`);
  console.log();
  console.log(`  Page Tiers:`);
  console.log(`    T0 (start/home):  ${tier0.length} routes × ${allLangs.length} langs = ${t0Count}`);
  console.log(`    T1 (hub pages):   ${tier1.length} routes × ${tier1And2Langs.length} langs = ${t1Count}`);
  console.log(
    `    T2 (articles):    ${articleRoutes.length} routes × ${LANG_TIER_1.length} langs = ${t2ArticlesCount}`,
  );
  console.log();
  console.log(`  Total: ${lines.length} prerendered routes`);
  console.log(`  Output: ${outputPath}`);
}

// CLI entry point — only run main() when executed directly, not when required
// by tests. Tests import the route arrays and helper functions to validate
// the configuration without writing prerender-routes.txt.
if (require.main === module) {
  main();
}

module.exports = {
  LANG_TIER_1,
  LANG_TIER_2,
  LANG_TIER_3,
  TIER_0_ROUTES,
  TIER_1_ROUTES,
  activeTiers,
  loadArticleRoutes,
  loadPathSchedule,
};
