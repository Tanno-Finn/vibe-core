#!/usr/bin/env node
/**
 * check-site-config — site.json is valid, and the files that cannot read it agree with it.
 *
 * `src/config/site.json` holds the user's choices: the site's name, the start page, the
 * feature switches and the operator. The app and the scripts read it through the same
 * rules (`src/config/site-rules.mts`), so a broken file already stops the app at load —
 * but only at runtime, and only the parts the page happens to touch. This gate says it
 * before the build, in words:
 *
 *   1. site.json passes the rules: a non-empty name, a start page that is a routed page
 *      of src/app/app.routes.ts (not a redirect, not the wildcard) and not a page of a
 *      feature site.json switches off, feature switches that are true/false and name a
 *      feature of src/config/features.json, the operator's fields all present.
 *   2. Drift: two files are served before any script runs and so carry the name as a
 *      literal — `src/index.html` (`<title>`, `og:site_name`), which link previews and
 *      crawlers read without JavaScript, and `src/assets/images/og-image.svg` (the title
 *      text of the preview image). Each must equal site.json's name. The fix is to edit
 *      them, or to let the make-it-yours tool write them.
 *   3. The feature catalog (src/config/features.json) tells the truth: it is well-formed,
 *      its shell pages are routed pages, every route it assigns is declared in
 *      app.routes.ts, and its `prerenderTier` and `sitemap` facts match the tables of
 *      scripts/generate-prerender-routes.js and scripts/generate-sitemap.js — so the
 *      switches hide exactly what the build would otherwise render.
 *   4. The sample manifest (src/config/samples.json) tells the truth, so
 *      `node tools/make-it-yours.mjs --remove-samples` removes exactly the samples and
 *      nothing that stays breaks: every listed sample exists on disk, every `art-*`
 *      article is listed while samples are listed, the `// sample:begin <id>` …
 *      `// sample:end <id>` markers in app.routes.ts are balanced and hold each sample's
 *      routes, and no seed or other content that stays refers to a sample id. The rules
 *      live in scripts/lib/samples.mjs, shared with the tool.
 *
 * Dependency-free (Node core only). Wired into `npm run build:verify`; its --selftest runs
 * in scripts/verify-harness.mjs.
 *
 * Usage:
 *   node scripts/check-site-config.mjs              check the repo
 *   node scripts/check-site-config.mjs --json       machine-readable result
 *   node scripts/check-site-config.mjs --selftest   prove the rules and the drift check on fixtures
 *
 * Exit codes: 0 pass · 1 a problem (or a failed selftest)
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateSiteConfig, validateFeatureCatalog, KIT_DEFAULT_SITE } from './lib/site-config.mjs';
import {
  SAMPLES_FILE,
  consistencyProblems,
  cutMarkerBlocks,
  diskIo,
  emptiedSamples,
  referenceProblems,
} from './lib/samples.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_FILE = 'src/config/site.json';
const FEATURES_FILE = 'src/config/features.json';
const ROUTES_FILE = 'src/app/app.routes.ts';
const INDEX_FILE = 'src/index.html';
const OG_SVG_FILE = 'src/assets/images/og-image.svg';

/** Feature ids site.json may switch: the features of src/config/features.json ([] while it cannot be read). */
export const KNOWN_FEATURES = (() => {
  try {
    return Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, FEATURES_FILE), 'utf8')).features ?? {});
  } catch {
    return [];
  }
})();

/**
 * Collections generate-sitemap.js lists page by page (loadDemoRoutes): a feature owning
 * one is in the sitemap without a route in its ROUTES table.
 */
const SITEMAP_COLLECTIONS = ['demos'];

/** The top-level route objects of app.routes.ts (two-space indent, as the file is formatted). */
function topLevelRouteBlocks(source) {
  return source
    .split(/\n {2}\{\r?\n/)
    .slice(1)
    .map((raw) => raw.split(/\n {2}\},?\r?\n/)[0]);
}

/**
 * The routed pages of app.routes.ts, read from its source: every top-level route object
 * whose `path` loads a component and does not redirect. The same definition
 * app.routes.maps.spec.ts uses on the live array.
 */
export function routedPagesFromSource(source) {
  const pages = [];
  for (const block of topLevelRouteBlocks(source)) {
    const m = /^ {4}path:\s*'([^']*)'/m.exec(block);
    if (!m || !m[1] || m[1] === '**') continue;
    if (/^ {4}redirectTo:/m.test(block)) continue;
    if (!/^ {4}(loadComponent|component):/m.test(block)) continue;
    pages.push(m[1]);
  }
  return pages;
}

/** Every top-level route path of app.routes.ts, pages and redirects alike (not '' or the wildcard). */
export function declaredPathsFromSource(source) {
  return topLevelRouteBlocks(source)
    .map((block) => /^ {4}path:\s*'([^']*)'/m.exec(block)?.[1])
    .filter((p) => p && p !== '**');
}

/**
 * Pure: every way the feature catalog disagrees with the route table and the build
 * tables. `tier0`/`tier1` are the kit's prerender tables (generate-prerender-routes.js,
 * before site.json is applied), `sitemapPaths` the paths of generate-sitemap.js's ROUTES.
 */
export function catalogProblems(catalog, { routesSource, tier0, tier1, sitemapPaths }) {
  const problems = validateFeatureCatalog(catalog).map((p) => p.replace(/^features\.json/, FEATURES_FILE));
  if (problems.length) return problems;
  const pages = routedPagesFromSource(routesSource);
  const declared = declaredPathsFromSource(routesSource);
  for (const shell of catalog.shellPages) {
    if (!pages.includes(shell))
      problems.push(`${FEATURES_FILE}: shell page "${shell}" is not a page of ${ROUTES_FILE}`);
  }
  for (const [id, feature] of Object.entries(catalog.features)) {
    for (const route of feature.routes) {
      if (!declared.includes(route)) {
        problems.push(`${FEATURES_FILE}: "${id}" owns the route "${route}", which ${ROUTES_FILE} does not declare`);
      }
    }
    const owns = (list) => list.some((r) => feature.routes.some((own) => r === own || r.startsWith(`${own}/`)));
    const tier = owns(tier0) ? 0 : owns(tier1) ? 1 : null;
    if (tier !== feature.prerenderTier) {
      problems.push(
        `${FEATURES_FILE}: "${id}.prerenderTier" is ${feature.prerenderTier}, scripts/generate-prerender-routes.js prerenders it at ${tier === null ? 'no tier' : `tier ${tier}`}`,
      );
    }
    const inSitemap = owns(sitemapPaths) || feature.collections.some((c) => SITEMAP_COLLECTIONS.includes(c));
    if (inSitemap !== feature.sitemap) {
      problems.push(
        `${FEATURES_FILE}: "${id}.sitemap" is ${feature.sitemap}, but scripts/generate-sitemap.js ${inSitemap ? 'lists' : 'does not list'} its pages`,
      );
    }
  }
  return problems;
}

const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** The name-bearing literals of index.html: `<title>` and `og:site_name`. */
export function namesInIndexHtml(html) {
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  const siteName = /<meta\s+property="og:site_name"\s+content="([^"]*)"/i.exec(html)?.[1];
  return {
    '<title>': title === undefined ? undefined : decodeEntities(title.trim()),
    'og:site_name': siteName === undefined ? undefined : decodeEntities(siteName.trim()),
  };
}

/** The OG image's title: the first <text> element of the SVG, whitespace collapsed. */
export function nameInOgSvg(svg) {
  const text = /<text\b[^>]*>([\s\S]*?)<\/text>/i.exec(svg)?.[1];
  return text === undefined ? undefined : decodeEntities(text.replace(/\s+/g, ' ').trim());
}

/** Pure: every drift between the site name and the literal files, as sentences. */
export function driftProblems(name, { indexHtml, ogSvg }) {
  const problems = [];
  for (const [where, value] of Object.entries(namesInIndexHtml(indexHtml))) {
    if (value === undefined) problems.push(`${INDEX_FILE}: no ${where} found — the drift check has nothing to hold`);
    else if (value !== name) problems.push(`${INDEX_FILE}: ${where} is "${value}", site.json's name is "${name}"`);
  }
  const svgName = nameInOgSvg(ogSvg);
  if (svgName === undefined) problems.push(`${OG_SVG_FILE}: no <text> title found`);
  else if (svgName !== name)
    problems.push(`${OG_SVG_FILE}: the title text is "${svgName}", site.json's name is "${name}"`);
  return problems;
}

/**
 * Pure: every problem of a repo state. With `catalog` (features.json) the switches are
 * checked against its features, the start page against the switches, and — with
 * `tables` ({ tier0, tier1, sitemapPaths }) — the catalog against the route and build tables.
 */
export function checkSite({ site, routesSource, indexHtml, ogSvg, catalog, tables, knownFeatures }) {
  const knownPages = routedPagesFromSource(routesSource);
  if (knownPages.length === 0) return [`${ROUTES_FILE}: no routed page found — the start page cannot be checked`];
  const catalogFindings = catalog && tables ? catalogProblems(catalog, { routesSource, ...tables }) : [];
  // A malformed catalog cannot judge site.json; say what is wrong with it first.
  const usableCatalog = catalog && validateFeatureCatalog(catalog).length === 0 ? catalog : undefined;
  const problems = validateSiteConfig(site, {
    knownPages,
    knownFeatures: knownFeatures ?? (usableCatalog ? undefined : KNOWN_FEATURES),
    catalog: usableCatalog,
  });
  const name = typeof site?.name === 'string' ? site.name.trim() : '';
  if (name) problems.push(...driftProblems(name, { indexHtml, ogSvg }));
  return [...catalogFindings, ...problems];
}

/** Rule 4: the sample manifest against the files, the markers and the content that stays. */
export function samplesProblems(samples, io, routesSource) {
  return [...consistencyProblems(samples, io, routesSource), ...referenceProblems(samples, io, routesSource)];
}

/** An `io` (scripts/lib/samples.mjs) over files held in memory: `{ 'a/b.json': '…' }`. */
function memoryIo(files) {
  const has = (rel) => Object.hasOwn(files, rel);
  const isDir = (rel) => Object.keys(files).some((f) => f.startsWith(`${rel}/`));
  return {
    exists: (rel) => has(rel) || isDir(rel),
    isDir,
    read: (rel) => {
      if (!has(rel)) throw new Error(`no such file ${rel}`);
      return files[rel];
    },
    list: (rel) =>
      [
        ...new Set(
          Object.keys(files)
            .filter((f) => f.startsWith(`${rel}/`))
            .map((f) => f.slice(rel.length + 1).split('/')[0]),
        ),
      ].sort(),
  };
}

/** A mini kit with one sample article, one sample term, one sample source, one sample path. */
function sampleFixture() {
  const j = (v) => JSON.stringify(v);
  const routes = [
    'export const extendedRoutes = [',
    '  {',
    "    path: 'articles/seed-article-1',",
    "    loadComponent: () => import('./pages/articles/seed-article-1/seed.component'),",
    '  },',
    '',
    '  // sample:begin art-one',
    '  {',
    "    path: 'articles/art-one',",
    "    loadComponent: () => import('./pages/articles/art-one/art-one.component'),",
    '  },',
    '',
    '  {',
    "    path: 'article/aone',",
    "    redirectTo: 'articles/art-one',",
    '  },',
    '  // sample:end art-one',
    '',
    '  {',
    "    path: 'home',",
    '  },',
    '];',
  ].join('\n');
  const samples = {
    articles: [{ id: 'art-one', pageId: 'aone', namespace: 'articleOne', folder: 'src/app/pages/articles/art-one' }],
    glossary: ['term-x'],
    sources: ['src-x'],
    learningPaths: ['path-x'],
    i18nKeys: ['easyLanguage.content.artOne'],
    notSamples: [],
  };
  const files = {
    'src/config/languages.json': j({ keySourceLanguage: 'en' }),
    'src/app/app.routes.ts': routes,
    'src/app/pages/articles/art-one/art-one.component.ts': 'x',
    'src/app/pages/articles/seed-article-1/seed.component.ts': 'x',
    'src/app/pages/home/home.component.ts': "const link = '/articles/seed-article-1';",
    'src/assets/data/core/articles/index.json': j([
      { id: 'seed-article-1', pageId: 'sda1', related: { glossary: ['seed-term-1'] } },
      { id: 'art-one', pageId: 'aone', related: { glossary: ['term-x'] } },
    ]),
    'src/assets/data/core/articles/seed-article-1.json': j({ id: 'seed-article-1' }),
    'src/assets/data/core/articles/art-one.json': j({ id: 'art-one', related: { glossary: ['term-x'] } }),
    'src/assets/data/core/glossary/index.json': j(['seed-term-1', 'term-x']),
    'src/assets/data/core/glossary/seed-term-1.json': j({ id: 'seed-term-1', integration: 'term-x' }),
    'src/assets/data/core/glossary/term-x.json': j({ id: 'term-x', related: { glossary: ['seed-term-1'] } }),
    'src/assets/data/translations/glossary/de/term-x.json': j({ title: 'X' }),
    'src/assets/data/core/sources/index.json': j(['seed-source-1', 'src-x']),
    'src/assets/data/core/sources/seed-source-1.json': j({ id: 'seed-source-1', type: 'website' }),
    'src/assets/data/core/sources/src-x.json': j({ id: 'src-x' }),
    'src/assets/data/core/sources/references.json': j({
      'seed-source-1': { portal: [{ type: 'article', id: 'seed-article-1' }] },
      'src-x': { portal: [{ type: 'article', id: 'art-one' }] },
    }),
    'src/assets/data/core/learning-paths.json': j([
      { id: 'seed-path-1', steps: [{ type: 'article', id: 'seed-article-1', route: '/articles/seed-article-1' }] },
      { id: 'path-x', steps: [{ type: 'article', id: 'art-one', route: '/articles/art-one' }] },
    ]),
    'src/assets/i18n/modules/en/articleOne.json': j({ hero: { title: 'One' } }),
    'src/assets/i18n/modules/en/easyLanguage.json': j({ content: { artOne: { title: 'One' }, home: { a: 'b' } } }),
  };
  return { samples, files, routes };
}

function selftest() {
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });
  const routes = [
    'export const extendedRoutes: ExtendedRoute[] = [',
    '  {',
    "    path: '',",
    "    redirectTo: 'home',",
    '  },',
    '  {',
    "    path: 'home',",
    "    titleKey: 'app.nav.home',",
    "    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),",
    '  },',
    '  {',
    "    path: 'glossary',",
    '    children: [',
    '      {',
    "        path: 'x',",
    '      },',
    '    ],',
    '    component: GlossaryComponent,',
    '  },',
    '  {',
    "    path: 'ai-tools',",
    "    redirectTo: 'catalog',",
    '  },',
    '  {',
    "    path: '**',",
    '    component: NotFound,',
    '  },',
    '];',
  ].join('\n');
  const html = (title, siteName) =>
    `<head>\n    <title>${title}</title>\n    <meta property="og:site_name" content="${siteName}" />\n</head>`;
  const svg = (name) => `<svg>\n  <text x="1">\n    ${name}\n  </text>\n  <text>Subtitle</text>\n</svg>`;
  const good = { indexHtml: html('vibecore', 'vibecore'), ogSvg: svg('vibecore'), routesSource: routes };
  const kit = structuredClone(KIT_DEFAULT_SITE);
  const withSite = (patch) => ({ ...good, site: { ...structuredClone(KIT_DEFAULT_SITE), ...patch } });

  check(
    'routes: pages are read, redirects / wildcard / child paths are not',
    JSON.stringify(routedPagesFromSource(routes)) === JSON.stringify(['home', 'glossary']),
  );
  check('the kit default site passes', checkSite({ ...good, site: kit }).length === 0);
  check(
    'an empty name fails',
    checkSite(withSite({ name: '  ' })).some((p) => /"name"/.test(p)),
  );
  check(
    'a start page that is a redirect fails',
    checkSite(withSite({ startPage: 'ai-tools' })).some((p) => /not a page/.test(p)),
  );
  check(
    'a start page with a slash or language prefix fails',
    checkSite(withSite({ startPage: '/de/home' })).some((p) => /not a route path/.test(p)),
  );
  check('another routed page is a valid start page', checkSite(withSite({ startPage: 'glossary' })).length === 0);
  check(
    'an unknown feature fails',
    checkSite(withSite({ features: { weather: false } })).some((p) => /not a kit feature/.test(p)),
  );
  check(
    'a known feature switched with a non-boolean fails',
    checkSite({ ...withSite({ features: { glossary: 'off' } }), knownFeatures: ['glossary'] }).some((p) =>
      /true or false/.test(p),
    ),
  );
  check(
    'a missing operator field fails',
    checkSite(withSite({ operator: { ...kit.operator, email: '' } })).some((p) => /operator\.email/.test(p)),
  );
  check(
    'a missing supervisory authority fails',
    checkSite(withSite({ operator: { name: 'A', address: 'B', email: 'c@d.test' } })).some((p) =>
      /supervisoryAuthority/.test(p),
    ),
  );
  check(
    'a bad logo icon fails',
    checkSite(withSite({ logoIcon: 'fa fa-book' })).some((p) => /logoIcon/.test(p)),
  );
  check(
    'a renamed site with unchanged index.html and og image fails three times (drift)',
    checkSite(withSite({ name: 'Mathe mit Frau Schulz' })).filter((p) => /site\.json's name/.test(p)).length === 3,
  );
  check(
    'a renamed site with index.html and og image rewritten passes (entities decoded)',
    checkSite({
      site: { ...kit, name: 'Tom & Jerry' },
      routesSource: routes,
      indexHtml: html('Tom &amp; Jerry', 'Tom &amp; Jerry'),
      ogSvg: svg('Tom &amp; Jerry'),
    }).length === 0,
  );
  check(
    'an index.html without og:site_name fails',
    checkSite({ ...good, site: kit, indexHtml: '<title>vibecore</title>' }).some((p) => /no og:site_name/.test(p)),
  );

  // Feature catalog (features.json) on a mini route table: glossary owns its page and a redirect.
  const feature = {
    routes: ['glossary', 'ai-tools'],
    i18n: ['glossary'],
    collections: ['glossary'],
    prerenderTier: 1,
    sitemap: true,
    a11yPages: ['glossary'],
  };
  const catalog = { shellPages: ['home'], features: { glossary: feature } };
  const tables = { tier0: ['home'], tier1: ['glossary'], sitemapPaths: ['home', 'glossary'] };
  const withCatalog = (sitePatch = {}, catalogPatch = {}, featurePatch = {}, tablesPatch = {}) => ({
    ...withSite(sitePatch),
    catalog: { ...catalog, ...catalogPatch, features: { glossary: { ...feature, ...featurePatch } } },
    tables: { ...tables, ...tablesPatch },
  });
  check(
    'routes: every declared top-level path is read, redirects included',
    JSON.stringify(declaredPathsFromSource(routes)) === JSON.stringify(['home', 'glossary', 'ai-tools']),
  );
  check('a catalog that matches the routes and tables passes', checkSite(withCatalog()).length === 0);
  check(
    'switching a catalog feature off passes',
    checkSite(withCatalog({ features: { glossary: false } })).length === 0,
  );
  check(
    'a start page inside a switched-off feature fails',
    checkSite(withCatalog({ startPage: 'glossary', features: { glossary: false } })).some((p) =>
      /switches off/.test(p),
    ),
  );
  check(
    'a feature the catalog does not know fails',
    checkSite(withCatalog({ features: { weather: false } })).some((p) =>
      /not a kit feature \(known: glossary\)/.test(p),
    ),
  );
  check(
    'a catalog route app.routes.ts does not declare fails',
    checkSite(withCatalog({}, {}, { routes: ['glossary', 'gone'] })).some((p) => /does not declare/.test(p)),
  );
  check(
    'a prerender tier the prerender tables contradict fails',
    checkSite(withCatalog({}, {}, { prerenderTier: 0 })).some((p) => /prerenderTier/.test(p)),
  );
  check(
    'a sitemap flag the sitemap table contradicts fails',
    checkSite(withCatalog({}, {}, { sitemap: false })).some((p) => /"glossary\.sitemap" is false/.test(p)),
  );
  check(
    'a shell page that is not a routed page fails',
    checkSite(withCatalog({}, { shellPages: ['nowhere'] })).some((p) => /shell page "nowhere"/.test(p)),
  );
  check(
    'a route owned by two features fails',
    catalogProblems(
      { shellPages: [], features: { a: { ...feature }, b: { ...feature, routes: ['glossary'] } } },
      { routesSource: routes, ...tables },
    ).some((p) => /belongs to both/.test(p)),
  );

  // Sample manifest (rule 4) on a mini kit held in memory.
  const fx = () => structuredClone(sampleFixture());
  const samplesRun = ({ samples, files }) => samplesProblems(samples, memoryIo(files), files['src/app/app.routes.ts']);
  check('a sample manifest that matches files, markers and content passes', samplesRun(fx()).length === 0);
  {
    const f = fx();
    delete f.files['src/app/pages/articles/art-one/art-one.component.ts'];
    check(
      'a listed sample whose folder is missing fails',
      samplesRun(f).some((p) => /folder .* is missing/.test(p)),
    );
  }
  {
    const f = fx();
    f.files['src/assets/data/core/articles/art-two.json'] = '{}';
    const unlisted = samplesRun(f).some((p) => /"art-two" is on disk but not listed/.test(p));
    f.samples.notSamples.push('art-two');
    check(
      'an art-* article on disk that is not listed fails, and passes once named in notSamples',
      unlisted && samplesRun(f).length === 0,
    );
  }
  {
    const f = fx();
    f.samples.glossary.push('seed-term-1');
    check(
      'a seed listed as a sample fails',
      samplesRun(f).some((p) => /"seed-term-1" is a seed/.test(p)),
    );
  }
  {
    const shapeOf = (patch) => {
      const f = fx();
      patch(f.samples);
      return samplesRun(f);
    };
    check(
      'a sample folder that is not the article’s own page folder, a path in an id or a bare namespace key fails',
      shapeOf((s) => (s.articles[0].folder = 'src/app/pages/articles')).some((p) => /own page folder/.test(p)) &&
        shapeOf((s) => (s.articles[0].folder = 'src')).some((p) => /own page folder/.test(p)) &&
        shapeOf((s) => (s.glossary[0] = '../../../../package')).some((p) => /not an entry id/.test(p)) &&
        shapeOf((s) => (s.articles[0].namespace = '../app')).some((p) => /not a module name/.test(p)) &&
        shapeOf((s) => (s.i18nKeys[0] = 'app')).some((p) => /not a key path/.test(p)),
    );
  }
  {
    const f = fx();
    f.files['src/app/app.routes.ts'] = f.routes.replace('  // sample:end art-one\n', '');
    check(
      'a sample:begin without its sample:end fails',
      samplesRun(f).some((p) => /never closed/.test(p)),
    );
  }
  {
    const f = fx();
    f.files['src/app/app.routes.ts'] = f.routes
      .replace('  // sample:end art-one\n', '')
      .replace("  {\n    path: 'article/aone',", "  // sample:end art-one\n  {\n    path: 'article/aone',");
    check(
      "a sample's route outside its marker block fails",
      samplesRun(f).some((p) => /'article\/aone' stands outside/.test(p)),
    );
  }
  {
    const f = fx();
    f.files['src/assets/data/core/articles/index.json'] = f.files['src/assets/data/core/articles/index.json'].replace(
      '["seed-term-1"]',
      '["seed-term-1","term-x"]',
    );
    const found = samplesRun(f);
    check(
      'a seed that lists a sample term under related fails (a plain field with the same word does not)',
      found.length === 1 && /lists the sample "term-x" under "related\.glossary"/.test(found[0]),
    );
  }
  {
    const f = fx();
    f.files['src/assets/data/core/sources/references.json'] = JSON.stringify({
      'seed-source-1': { portal: [{ type: 'article', id: 'art-one' }] },
      'src-x': { portal: [] },
    });
    check(
      'a kept source whose references name a sample article fails',
      samplesRun(f).some((p) => /refers to the sample article "art-one"/.test(p)),
    );
  }
  {
    const f = fx();
    f.files['src/app/pages/home/home.component.ts'] = "const link = '/articles/art-one';";
    check(
      'app code linking a sample route outside the markers fails',
      samplesRun(f).some((p) => /home\.component\.ts: refers to the sample "articles\/art-one"/.test(p)),
    );
  }
  {
    // The state after --remove-samples: lists empty, markers cut, sample files gone.
    const f = fx();
    const emptied = emptiedSamples(f.samples);
    const kept = Object.fromEntries(
      Object.entries(f.files).filter(([p]) => !/art-one|term-x|src-x|articleOne/.test(p)),
    );
    kept['src/app/app.routes.ts'] = cutMarkerBlocks(f.routes, ['art-one']);
    kept['src/assets/data/core/sources/references.json'] = JSON.stringify({
      'seed-source-1': { portal: [{ type: 'article', id: 'seed-article-1' }] },
    });
    check(
      'after the removal: empty lists and no markers pass; the cut leaves no double blank line',
      samplesRun({ samples: emptied, files: kept }).length === 0 &&
        !/sample:|art-one/.test(kept['src/app/app.routes.ts']) &&
        !/\n\s*\n\s*\n/.test(kept['src/app/app.routes.ts']),
    );
    check(
      'after the removal: a leftover marker block fails',
      samplesRun({ samples: emptied, files: { ...kept, 'src/app/app.routes.ts': f.routes } }).some((p) =>
        /does not list as a sample/.test(p),
      ),
    );
  }

  for (const r of results) console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} SELFTEST: ${r.name}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `check-site-config --selftest: FAIL — ${failed} case(s)` : 'check-site-config --selftest: PASS');
  return failed === 0;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) process.exit(selftest() ? 0 : 1);
  const json = args.includes('--json');
  const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

  let problems = [];
  let site = null;
  let catalog = null;
  for (const [file, set] of [
    [SITE_FILE, (v) => (site = v)],
    [FEATURES_FILE, (v) => (catalog = v)],
  ]) {
    try {
      set(JSON.parse(read(file)));
    } catch (e) {
      problems.push(`${file}: cannot be read as JSON — ${e.message}`);
    }
  }
  if (site && catalog) {
    const missing = [ROUTES_FILE, INDEX_FILE, OG_SVG_FILE].filter((p) => !fs.existsSync(path.join(ROOT, p)));
    if (missing.length) {
      problems = missing.map((p) => `${p} is missing`);
    } else {
      // The kit's full build tables, before site.json is applied (both scripts only run
      // their main() when executed directly).
      const require = createRequire(import.meta.url);
      const { TIER_0_ROUTES, TIER_1_ROUTES } = require('./generate-prerender-routes.js');
      const { ROUTES } = require('./generate-sitemap.js');
      problems = checkSite({
        site,
        catalog,
        tables: { tier0: TIER_0_ROUTES, tier1: TIER_1_ROUTES, sitemapPaths: ROUTES.map((r) => r.path) },
        routesSource: read(ROUTES_FILE),
        indexHtml: read(INDEX_FILE),
        ogSvg: read(OG_SVG_FILE),
      });
    }
  }
  let samples = null;
  try {
    samples = JSON.parse(read(SAMPLES_FILE));
  } catch (e) {
    problems.push(`${SAMPLES_FILE}: cannot be read as JSON — ${e.message}`);
  }
  if (samples && fs.existsSync(path.join(ROOT, ROUTES_FILE))) {
    problems.push(...samplesProblems(samples, diskIo(ROOT), read(ROUTES_FILE)));
  }

  if (json) {
    console.log(JSON.stringify({ ok: problems.length === 0, name: site?.name ?? null, problems }, null, 2));
    process.exit(problems.length ? 1 : 0);
  }
  if (problems.length === 0) {
    const off = Object.entries(site.features)
      .filter(([id, on]) => !id.startsWith('_') && on === false)
      .map(([id]) => id);
    const left = ['articles', 'glossary', 'sources', 'learningPaths'].map((k) => `${samples[k].length} ${k}`);
    console.log(
      `check-site-config: PASS — "${site.name}", start page "${site.startPage}", features off: ${off.length ? off.join(', ') : 'none'}; index.html, og image and features.json agree; samples left: ${left.join(', ')} (manifest, markers and references agree).`,
    );
    process.exit(0);
  }
  console.error(`check-site-config: FAIL — ${problems.length} problem(s):`);
  for (const p of problems) console.error(`    ${p}`);
  console.error(`  The site's choices live in ${SITE_FILE}; see the "_…" notes in that file.`);
  process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
