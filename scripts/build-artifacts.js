/**
 * Single source of truth for "what must a complete production build contain?".
 *
 * Used by:
 *   - scripts/verify-build.js   (post-build self-check; run it before publishing a dist/)
 *   - scripts/write-build-manifest.js  (writes .build-manifest.json)
 *
 * Adding a new required artifact?
 *   → add it here. build:verify, the final check of build:prod and the manifest all
 *     inherit the new check.
 */

const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.resolve(__dirname, '..');
const BROWSER_DIR = path.join(REPO_ROOT, 'dist', 'vibecore', 'browser');
const SERVER_DIR = path.join(REPO_ROOT, 'dist', 'vibecore', 'server');

// The build-verifier's view of SEO-enabled languages — read from
// src/config/languages.json (`seo: true`) through the shared language rules,
// the same data the sitemap, the prerender list and the runtime hreflang tags
// use. The kit ships de and en (+ their easy variants); URL prefixes and
// prerendering exist for the base languages only.
const LANGUAGES = require('./lib/locale-fallback.mjs');
const SEO_LANGUAGES = LANGUAGES.SEO_LANGUAGES.map((l) => l.code);
const LOCALE_COUNT = LANGUAGES.ALL_LOCALES.length;

// The site's feature switches (src/config/site.json, through the shared site rules):
// nothing is required from a feature that is switched off. The <lang>/home check
// below stays whatever the start page is — /home is always prerendered
// (scripts/generate-prerender-routes.js).
const SITE = require('./lib/site-config.mjs').loadSiteRules();

const REQUIRED_FILES = [
  {
    path: 'index.html',
    minSize: 500,
    reason: 'SPA shell from index.csr.html — small file means Meta-Refresh stub, SPA bootstrap broken at /',
  },
  { path: 'index.csr.html', minSize: 500, reason: 'Source for index.html post-build copy + Angular SSR fallback' },
  // The sitemap is only written when SITE_BASE_URL is set — generate-sitemap.js
  // deliberately skips it rather than emit URLs on a placeholder domain. So it
  // is only a required artifact when the operator has configured a domain.
  ...(process.env.SITE_BASE_URL
    ? [{ path: 'sitemap.xml', minSize: 500, reason: 'SEO sitemap with all enabled languages' }]
    : []),
  { path: 'robots.txt', minSize: 100, reason: 'Required for search engines + Disallow rules' },
  { path: 'favicon.svg', minSize: 100, reason: 'Site favicon' },
];

const REQUIRED_LANGUAGE_DIRS = SEO_LANGUAGES.map((lang) => ({
  path: `${lang}/home/index.html`,
  minSize: 1000,
  reason: `Prerendered ${lang}/home — required for SEO`,
}));

const REQUIRED_BUNDLE_COUNTS = [
  {
    dir: 'assets/data',
    glob: /^content\..+\.json$/,
    minCount: LOCALE_COUNT,
    reason: `${LOCALE_COUNT} content bundles (one per locale in languages.json)`,
  },
  {
    dir: 'assets/i18n',
    glob: /^i18n\..+\.json$/,
    minCount: LOCALE_COUNT,
    reason: `${LOCALE_COUNT} i18n core bundles (one per locale in languages.json)`,
  },
  ...(SITE.isFeatureOn('news')
    ? [{ dir: 'assets/data/notifications', glob: /\.json$/, minCount: 1, reason: 'Notification source files' }]
    : []),
];

const FORBIDDEN_FILES = [{ path: 'highlight-demo.html', reason: 'Dev tool — must not ship to prod' }];

// Dev-only strip sentinel (SPEC N5, D2). The routes, pages and article components
// under src/app/dev/ carry this literal (not the prod route stub, nor a few data
// modules; see docs/DESIGN-SYSTEM.MD "Strip boundary"). A production build swaps
// the dev routes for an empty array via angular.json fileReplacements, so the
// whole src/app/dev/ tree is unreferenced and must not reach dist. Any file in
// dist/vibecore/ (browser AND server — the SSR bundle can carry the same leak)
// containing this literal means dev code leaked into production.
const DEV_SENTINEL = '__VIBE_DEV_ONLY__';

// Only text-ish build outputs can carry the ASCII sentinel; skip binary assets
// (fonts/images) to keep the scan fast.
const SENTINEL_SCAN_EXTS = new Set(['.js', '.mjs', '.cjs', '.css', '.html', '.json', '.txt', '.map']);

// `stats` is mutated in place (not returned) so a caller scanning multiple
// directories in sequence (browser + server) can pass one shared counter and
// read the running total without stitching return values back together.
function scanForSentinel(dir, needle, baseDir = dir, hits = [], stats = { filesScanned: 0 }) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    // Directory vanished/unreadable mid-scan — nothing to report, not a leak.
    return hits;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForSentinel(abs, needle, baseDir, hits, stats);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!SENTINEL_SCAN_EXTS.has(ext)) continue;
      let content;
      try {
        content = fs.readFileSync(abs, 'utf8');
      } catch {
        continue;
      }
      stats.filesScanned++;
      if (content.includes(needle)) hits.push(path.relative(baseDir, abs).split(path.sep).join('/'));
    }
  }
  return hits;
}

// Raw i18n keys in prerendered HTML. A key that renders as itself ("glossary.title")
// is the bug the i18n split could reintroduce: a string whose namespace is a lazy chunk
// the prerenderer never loaded. Only tokens that ARE keys (a leaf in the key-source
// modules) count, so prose like "app.py" never trips it.
const I18N_MODULES_DIR = path.join(REPO_ROOT, 'src', 'assets', 'i18n', 'modules', LANGUAGES.KEY_SOURCE_LANG);

function loadKnownKeys() {
  const keys = new Set();
  const walk = (node, prefix) => {
    for (const [k, v] of Object.entries(node)) {
      const full = `${prefix}.${k}`;
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, full);
      else keys.add(full);
    }
  };
  let files = [];
  try {
    files = fs.readdirSync(I18N_MODULES_DIR).filter((f) => f.endsWith('.json'));
  } catch {
    return keys;
  }
  for (const f of files) {
    try {
      walk(JSON.parse(fs.readFileSync(path.join(I18N_MODULES_DIR, f), 'utf8')), f.slice(0, -5));
    } catch {
      // A broken module is check-i18n-keys.mjs's finding, not this gate's.
    }
  }
  return keys;
}

/** Visible text + labelling attributes of one HTML file, scripts and styles removed. */
function visibleText(html) {
  const attrs = [...html.matchAll(/\s(?:aria-label|title|placeholder|alt)="([^"]*)"/g)].map((m) => m[1]);
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]*>/g, ' ');
  return `${body} ${attrs.join(' ')}`;
}

function scanRawKeys(browserDir) {
  const known = loadKnownKeys();
  const hits = [];
  if (known.size === 0) return hits;
  const tokenRe = /\b[a-zA-Z][\w-]*(?:\.[\w-]+)+\b/g;
  const visit = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) visit(abs);
      else if (e.name === 'index.html') {
        let html;
        try {
          html = fs.readFileSync(abs, 'utf8');
        } catch {
          continue;
        }
        const keys = [...new Set(visibleText(html).match(tokenRe) ?? [])].filter((t) => known.has(t));
        if (keys.length) hits.push({ file: path.relative(browserDir, abs).split(path.sep).join('/'), keys });
      }
    }
  };
  for (const lang of SEO_LANGUAGES) visit(path.join(browserDir, lang));
  return hits;
}

// Placeholder domains in the prerendered <head>. The kit ships without a domain
// (environment.siteUrl is '' and SITE_BASE_URL unset), and MetaSeoService then
// leaves canonical, og:url, og:image and the hreflang links out rather than point
// them at a domain the operator does not own. Until 2026-09-23 the head carried
// https://your-domain.example/ in all of them — a canonical that asks search
// engines to index someone else's URL. This check keeps that from coming back:
// any absolute URL on a reserved example host (RFC 2606: example.com/.net/.org
// and the .example TLD, e.g. your-domain.example) in those head tags fails the build.
const PLACEHOLDER_HOST_RE = /^(?:[\w-]+\.)*(?:example\.(?:com|net|org)|example)$/i;
const HEAD_URL_TAG_RE =
  /<(meta|link)\b(?=[^>]*\b(?:property|name|rel)="(og:[\w:]+|twitter:[\w:]+|canonical|alternate)")[^>]*>/gi;

/** Every head tag (og:*, twitter:*, canonical, hreflang alternate) whose URL sits on a placeholder host. */
function findPlaceholderDomains(html) {
  const head = (html.match(/<head\b[\s\S]*?<\/head>/i) ?? [html])[0];
  const hits = [];
  for (const m of head.matchAll(HEAD_URL_TAG_RE)) {
    const tag = m[0];
    const url = (tag.match(/\b(?:content|href)="([^"]*)"/i) ?? [])[1];
    if (!url) continue;
    let host;
    try {
      host = new URL(url).hostname;
    } catch {
      continue; // not an absolute URL, so not a domain claim
    }
    if (PLACEHOLDER_HOST_RE.test(host)) {
      const hreflang = (tag.match(/\bhreflang="([^"]*)"/i) ?? [])[1];
      hits.push({ tag: hreflang ? `hreflang=${hreflang}` : m[2], url });
    }
  }
  return hits;
}

/** Scan every prerendered index.html for placeholder domains in its head. */
function scanPlaceholderDomains(browserDir) {
  const hits = [];
  const visit = (dir) => {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== 'assets') visit(abs);
      } else if (e.name === 'index.html' || e.name === 'index.csr.html') {
        let html;
        try {
          html = fs.readFileSync(abs, 'utf8');
        } catch {
          continue;
        }
        const found = findPlaceholderDomains(html);
        if (found.length) hits.push({ file: path.relative(browserDir, abs).split(path.sep).join('/'), found });
      }
    }
  };
  visit(browserDir);
  return hits;
}

/**
 * Run all checks. Returns { ok: bool, problems: [{kind, path, expected, actual, reason}], summary: {...} }.
 */
// existsSync says the path is there; statSync can still fail after that (a
// permission error, a lock held by an indexer/AV scanner on Windows, a race
// where the file vanished in between). Turn that into a reported problem
// instead of an uncaught exception taking the whole gate down.
function safeStatSize(abs) {
  try {
    return { size: fs.statSync(abs).size };
  } catch (err) {
    return { error: err.message };
  }
}

function runChecks(browserDir = BROWSER_DIR) {
  const problems = [];
  let okFileCount = 0;

  // Required files
  for (const f of REQUIRED_FILES) {
    const abs = path.join(browserDir, f.path);
    if (!fs.existsSync(abs)) {
      problems.push({ kind: 'missing-file', path: f.path, reason: f.reason });
      continue;
    }
    const stat = safeStatSize(abs);
    if (stat.error) {
      problems.push({
        kind: 'unreadable-file',
        path: f.path,
        reason: `${f.reason} (could not stat file: ${stat.error})`,
      });
      continue;
    }
    if (stat.size < f.minSize) {
      problems.push({
        kind: 'undersize-file',
        path: f.path,
        expectedMinSize: f.minSize,
        actualSize: stat.size,
        reason: f.reason,
      });
      continue;
    }
    okFileCount++;
  }

  // Prerendered languages
  let okLangCount = 0;
  for (const f of REQUIRED_LANGUAGE_DIRS) {
    const abs = path.join(browserDir, f.path);
    if (!fs.existsSync(abs)) {
      problems.push({ kind: 'missing-prerender', path: f.path, reason: f.reason });
      continue;
    }
    const stat = safeStatSize(abs);
    if (stat.error) {
      problems.push({
        kind: 'unreadable-prerender',
        path: f.path,
        reason: `${f.reason} (could not stat file: ${stat.error})`,
      });
      continue;
    }
    if (stat.size < f.minSize) {
      problems.push({
        kind: 'undersize-prerender',
        path: f.path,
        expectedMinSize: f.minSize,
        actualSize: stat.size,
        reason: f.reason,
      });
      continue;
    }
    okLangCount++;
  }

  // Bundle counts
  for (const b of REQUIRED_BUNDLE_COUNTS) {
    const abs = path.join(browserDir, b.dir);
    if (!fs.existsSync(abs)) {
      problems.push({ kind: 'missing-dir', path: b.dir, reason: b.reason });
      continue;
    }
    // existsSync doesn't guarantee it's a readable directory — e.g. a file has
    // landed where a directory was expected. Report that as a problem, not a crash.
    let entries;
    try {
      entries = fs.readdirSync(abs);
    } catch (err) {
      problems.push({
        kind: 'unreadable-dir',
        path: b.dir,
        reason: `${b.reason} (could not list directory: ${err.message})`,
      });
      continue;
    }
    const count = entries.filter((n) => b.glob.test(n)).length;
    if (count < b.minCount) {
      problems.push({
        kind: 'undercount-bundle',
        path: b.dir,
        expectedMin: b.minCount,
        actual: count,
        reason: b.reason,
      });
      continue;
    }
  }

  // Forbidden files (positive when ABSENT)
  for (const f of FORBIDDEN_FILES) {
    const abs = path.join(browserDir, f.path);
    if (fs.existsSync(abs)) {
      problems.push({ kind: 'forbidden-file', path: f.path, reason: f.reason });
    }
  }

  // Dev-sentinel leak scan (SPEC N5, D2): 0 hits required in production, across
  // the WHOLE dist/vibecore/ tree — browser bundle and the SSR server bundle
  // (a sibling of browserDir, normally dist/vibecore/server). The server dir
  // is optional (a browser-only build/test fixture may not have one).
  const sentinelStats = { filesScanned: 0 };
  const sentinelHits = scanForSentinel(browserDir, DEV_SENTINEL, browserDir, [], sentinelStats).map(
    (hit) => `browser/${hit}`,
  );

  const serverDir = path.join(browserDir, '..', 'server');
  let serverDirScanned = false;
  if (fs.existsSync(serverDir)) {
    serverDirScanned = true;
    const serverHits = scanForSentinel(serverDir, DEV_SENTINEL, serverDir, [], sentinelStats);
    for (const hit of serverHits) sentinelHits.push(`server/${hit}`);
  }

  for (const hit of sentinelHits) {
    problems.push({
      kind: 'sentinel-leak',
      path: hit,
      reason: `Contains the dev-only sentinel ${DEV_SENTINEL} — src/app/dev/ code leaked into the production bundle.`,
    });
  }

  // Raw i18n keys in the prerendered pages.
  const rawKeyHits = scanRawKeys(browserDir);
  for (const hit of rawKeyHits) {
    problems.push({
      kind: 'raw-i18n-key',
      path: hit.file,
      reason: `Prerendered with raw i18n key(s) ${hit.keys.slice(0, 5).join(', ')} — a namespace the page reads was not loaded (see src/config/i18n-bundles.json and the route's i18n list).`,
    });
  }

  // Placeholder domains in the prerendered heads.
  const placeholderHits = scanPlaceholderDomains(browserDir);
  for (const hit of placeholderHits) {
    const sample = hit.found
      .slice(0, 3)
      .map((f) => `${f.tag} → ${f.url}`)
      .join('; ');
    problems.push({
      kind: 'placeholder-domain',
      path: hit.file,
      reason: `Head names a placeholder domain in ${hit.found.length} tag(s): ${sample} — set environment.siteUrl / SITE_BASE_URL to the real origin, or leave it empty so the tags are left out.`,
    });
  }

  return {
    ok: problems.length === 0,
    problems,
    summary: {
      filesChecked: REQUIRED_FILES.length,
      filesOk: okFileCount,
      languagesChecked: REQUIRED_LANGUAGE_DIRS.length,
      languagesOk: okLangCount,
      bundleGroupsChecked: REQUIRED_BUNDLE_COUNTS.length,
      forbiddenAbsent: FORBIDDEN_FILES.length - problems.filter((p) => p.kind === 'forbidden-file').length,
      sentinelClean: sentinelHits.length === 0,
      sentinelLeaks: sentinelHits.length,
      sentinelFilesScanned: sentinelStats.filesScanned,
      sentinelServerDirScanned: serverDirScanned,
      rawI18nKeyPages: rawKeyHits.length,
      placeholderDomainPages: placeholderHits.length,
    },
  };
}

module.exports = {
  REPO_ROOT,
  BROWSER_DIR,
  SERVER_DIR,
  SEO_LANGUAGES,
  REQUIRED_FILES,
  REQUIRED_LANGUAGE_DIRS,
  REQUIRED_BUNDLE_COUNTS,
  FORBIDDEN_FILES,
  DEV_SENTINEL,
  scanForSentinel,
  scanRawKeys,
  findPlaceholderDomains,
  scanPlaceholderDomains,
  runChecks,
};
