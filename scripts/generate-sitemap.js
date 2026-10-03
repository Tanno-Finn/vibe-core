/**
 * Sitemap Generator for vibecore Portal
 *
 * Generates XML sitemaps with per-language URL prefixes and hreflang alternates.
 * Only SEO-enabled languages (`"seo": true` in src/config/languages.json) get URLs.
 *
 * Run: node scripts/generate-sitemap.js
 *
 * Output:
 * - public/sitemap.xml (main sitemap)
 * - public/sitemap-main.xml (copy for index reference)
 * - public/sitemap-index.xml (sitemap index)
 */

const fs = require('fs');
const path = require('path');

// Configuration
//
// No fallback host on purpose. A sitemap is a set of absolute URLs telling search
// engines "these pages are mine", so a placeholder default writes a file that either
// points crawlers at a domain someone else owns, or gets deployed and quietly indexes
// nothing. There is no safe guess here — without SITE_BASE_URL the only correct
// output is no output, so the script says so loudly and skips (see main()).
const BASE_URL = process.env.SITE_BASE_URL;
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

// SEO languages and the x-default target come from src/config/languages.json
// (`seo` / `defaultLanguage`) through the shared language rules — the same data
// the app's hreflang tags, the prerender list and the build verifier read, so a
// sitemap can no longer list a language the prerender skipped.
const { SEO_LANGUAGES, DEFAULT_LANGUAGE } = require('./lib/locale-fallback.mjs');

const seoLangs = SEO_LANGUAGES;
const defaultLang = DEFAULT_LANGUAGE;

// The site's feature switches (src/config/site.json): a route of a switched-off
// feature is not listed — see siteRoutes() below.
const { loadSiteRules } = require('./lib/site-config.mjs');

// Routes extracted from app.routes.ts (only public, non-hidden routes)
//
// NOTE: Do NOT add `{ path: '' }` here. Angular SSR prerenders empty-path
// redirect routes (`{ path: '', redirectTo: 'home' }` in app.routes.ts) as
// HTML Meta-Refresh stubs (<title>Redirecting</title>, ~250 bytes) which
// Google indexes as Soft-404 / duplicate content. /<lang>/home/ is the URL
// listed; /<lang>/ is left to the SPA fallback and the client redirect.
const ROUTES = [
  // Portal
  { path: 'home', priority: 1.0, changefreq: 'weekly' },

  // KI Wissen
  { path: 'glossary', priority: 0.9, changefreq: 'weekly' },
  { path: 'ai-timeline', priority: 0.8, changefreq: 'monthly' },
  // `catalog` is the hub page for AI tools + AI resources. The legacy
  // `ai-tools` and `ai-resources` routes are `redirectTo: 'catalog'` in
  // app.routes.ts and would prerender as Meta-Refresh stubs, so only
  // `catalog` is listed.
  { path: 'catalog', priority: 0.9, changefreq: 'weekly' },

  // Interactive Demos are NOT hardcoded here — they are derived from
  // demos/index.json (single source of truth) with publishDate gating via
  // loadDemoRoutes() below, mirroring loadArticleRoutes(). This auto-includes
  // newly-released demos and keeps pre-release ones (future publishDate) out of
  // the sitemap, so Google never sees a URL the demoReleaseGuard redirects.

  // System
  { path: 'impressum', priority: 0.3, changefreq: 'yearly' },
  // Accessibility statement — same SEO pattern as impressum: listed here and
  // prerendered as a hub page (TIER_1_ROUTES in generate-prerender-routes.js).
  { path: 'accessibility', priority: 0.4, changefreq: 'yearly' },
];

// Path → Article publishDate cascade
// Mirror of loadPathSchedule in generate-prerender-routes.js. The two scripts
// MUST stay in sync — when an article appears in the prerender output but not
// the sitemap (or vice versa), Google indexes 404s. Same data file, same logic.
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

/**
 * Load visible articles from the articles index and convert them into
 * sitemap route entries. An article is visible iff:
 *   - a.draft !== true
 *   - a.publishDate (if set) is <= today
 *   - containing path's publishDate (if any) is <= today
 * Mirrors loadArticleRoutes in generate-prerender-routes.js — sitemap and
 * prerender MUST agree on which articles are part of the production artefact.
 */
function loadArticleRoutes() {
  const indexPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'core', 'articles', 'index.json');
  const raw = fs.readFileSync(indexPath, 'utf8');
  const parsed = JSON.parse(raw);
  const articles = Array.isArray(parsed) ? parsed : parsed.articles || Object.values(parsed);

  const today = new Date();
  today.setHours(23, 59, 59, 999);
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
    .map((a) => ({
      path: a.path,
      priority: 0.8,
      changefreq: 'monthly',
    }));
}

/**
 * Load visible demos from the demos index and convert them into sitemap route
 * entries. A demo is visible iff its `publishDate` (if set) is <= today.
 * Mirrors `DemosService.isVisible` (production half) + `loadArticleRoutes`;
 * pre-release demos (future publishDate, e.g. markov-chain) are excluded so
 * Google never sees a URL the `demoReleaseGuard` would redirect. Uses the
 * canonical `path` from the index (the same one nav/grid/guard use), not the
 * legacy duplicate-content alias routes.
 *
 * NOTE: demo publishDates are full ISO timestamps (`…T18:00:00Z`), unlike the
 * date-only article/path dates — so we parse them directly.
 */
function loadDemoRoutes() {
  const indexPath = path.join(__dirname, '..', 'src', 'assets', 'data', 'core', 'demos', 'index.json');
  let demos;
  try {
    demos = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  } catch {
    return [];
  }
  if (!Array.isArray(demos)) return [];

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return demos
    .filter((d) => {
      if (!d || !d.path) return false;
      if (d.publishDate && new Date(d.publishDate) > today) return false; // scheduled release not yet reached
      return true;
    })
    .map((d) => ({
      path: d.path,
      priority: 0.9,
      changefreq: 'monthly',
    }));
}

/**
 * The routes of this site: ROUTES, the visible articles and the released demos,
 * without every route of a feature that src/config/site.json switches off (the
 * same rules and data as the prerender list, scripts/lib/site-config.mjs). The
 * demos come from the demos collection, so they go with the `demos` feature.
 * The start page leads with home's priority when no table lists it already,
 * as it leads tier 0 of the prerender list.
 */
function siteRoutes(site = loadSiteRules()) {
  const articles = loadArticleRoutes().filter((r) => site.isRouteOn(r.path));
  const demos = site.isFeatureOn('demos') ? loadDemoRoutes() : [];
  const listed = [...ROUTES, ...articles, ...demos].some((r) => r.path === site.startPage);
  const start = listed ? [] : [{ path: site.startPage, priority: 1.0, changefreq: 'weekly' }];
  const hubs = [...start, ...ROUTES.filter((r) => site.isRouteOn(r.path))];
  return { hubs, articles, demos, all: [...hubs, ...articles, ...demos] };
}

/**
 * Build the absolute URL for a single (lang, routePath) tuple.
 *
 * Trailing-slash is mandatory: the prerendered file lives at
 * de/home/index.html, and most static hosts answer /de/home with a 301 to
 * /de/home/. Listing `/de/home` in the sitemap would force crawlers through
 * that 301 on every visit AND disagree with the canonical URL the page names.
 */
function buildLangUrl(langCode, routePath) {
  if (!routePath) {
    return `${BASE_URL}/${langCode}/`;
  }
  // Strip leading slash from routePath if present, ensure trailing slash on result
  const cleanPath = routePath.replace(/^\//, '').replace(/\/$/, '');
  return `${BASE_URL}/${langCode}/${cleanPath}/`;
}

/**
 * Generate URL entries for a single route across all SEO languages.
 * Each language gets its own <url> with hreflang alternates pointing
 * to the other language versions.
 */
function generateUrlEntries(route, lastmod) {
  let xml = '';

  for (const lang of seoLangs) {
    const loc = buildLangUrl(lang.code, route.path);

    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;

    // hreflang alternates for all SEO languages
    for (const alt of seoLangs) {
      const altHref = buildLangUrl(alt.code, route.path);
      xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${altHref}"/>\n`;
    }

    // x-default points to default language
    const defaultHref = buildLangUrl(defaultLang, route.path);
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}"/>\n`;

    xml += `  </url>\n`;
  }

  return xml;
}

/**
 * Generate sitemap XML content
 */
function generateSitemap(routes = siteRoutes().all) {
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = routes.map((route) => generateUrlEntries(route, lastmod)).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}</urlset>`;
}

/**
 * Generate sitemap index
 */
function generateSitemapIndex() {
  const lastmod = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * Main execution
 */
function main() {
  console.log('Generating sitemaps for vibecore Portal...\n');
  // Read first, so a broken site.json fails here even when no sitemap is written.
  const site = loadSiteRules();
  const routes = siteRoutes(site);
  const switchedOff = Object.keys(site.catalog.features).filter((id) => !site.isFeatureOn(id));

  // No base URL -> write nothing, and be loud about it. Skipping (exit 0) rather than
  // failing is deliberate: a sitemap is an SEO artefact, and `npm run build:prod` must
  // still produce a working site for anyone who has not set a domain yet.
  if (!BASE_URL) {
    console.warn('!'.repeat(74));
    console.warn('! SITEMAP SKIPPED — SITE_BASE_URL is not set.');
    console.warn('!');
    console.warn('! A sitemap lists absolute URLs, so it cannot be written without knowing');
    console.warn("! the site's own domain. Nothing was generated; the build continues.");
    console.warn('!');
    console.warn('! To generate one, set the public base URL of the deployed site:');
    console.warn('!     SITE_BASE_URL=https://your-domain.example npm run sitemap');
    console.warn('! (see .env.example)');

    // Skipping means not overwriting — so an older sitemap stays where it is, and
    // public/ ships with the build. Name it rather than delete it silently.
    const stale = ['sitemap.xml', 'sitemap-main.xml', 'sitemap-index.xml'].filter((f) =>
      fs.existsSync(path.join(OUTPUT_DIR, f)),
    );
    if (stale.length > 0) {
      console.warn('!');
      console.warn('! NOTE: sitemap files already exist and were left untouched:');
      for (const f of stale) console.warn(`!     public/${f}`);
      console.warn('! They ship with the build. Delete them if they were generated with a');
      console.warn('! different or placeholder domain.');
    }
    console.warn('!'.repeat(74));
    return;
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate main sitemap
  const sitemapContent = generateSitemap(routes.all);
  const sitemapPath = path.join(OUTPUT_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent);
  console.log(`Created: ${sitemapPath}`);

  // Also save as sitemap-main.xml for index reference
  const sitemapMainPath = path.join(OUTPUT_DIR, 'sitemap-main.xml');
  fs.writeFileSync(sitemapMainPath, sitemapContent);
  console.log(`Created: ${sitemapMainPath}`);

  // Generate sitemap index
  const indexContent = generateSitemapIndex();
  const indexPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`Created: ${indexPath}`);

  // Stats
  const totalUrls = routes.all.length * seoLangs.length;
  console.log(`\nSitemap Statistics:`);
  console.log(`- Features switched off (site.json): ${switchedOff.length ? switchedOff.join(', ') : 'none'}`);
  console.log(`- Hub routes: ${routes.hubs.length}`);
  console.log(`- Article routes: ${routes.articles.length}`);
  console.log(`- Demo routes (publishDate-gated): ${routes.demos.length}`);
  console.log(`- Routes total: ${routes.all.length}`);
  console.log(`- SEO languages: ${seoLangs.map((l) => l.code).join(', ')}`);
  console.log(`- Total URLs: ${totalUrls} (${routes.all.length} routes x ${seoLangs.length} languages)`);
  console.log(`- Output directory: ${OUTPUT_DIR}`);

  console.log('\nDone! Submit sitemap.xml to Google Search Console.');
}

// CLI entry point — only run main() when executed directly, not when required
// by tests. Tests import the generator functions and validate output without
// touching public/sitemap.xml.
if (require.main === module) {
  main();
}

module.exports = {
  SEO_LANGUAGES,
  ROUTES,
  siteRoutes,
  loadArticleRoutes,
  loadDemoRoutes,
  loadPathSchedule,
  generateSitemap,
  generateSitemapIndex,
  generateUrlEntries,
  buildLangUrl,
};
