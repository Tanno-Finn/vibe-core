#!/usr/bin/env node
/**
 * check-i18n-keys.mjs — guard against the "raw key in the UI" bug.
 *
 * Statically extracts every literal i18n key the app references
 * (`translate('ns.key')` and `*Key: 'ns.key'` props) and verifies each one
 * resolves in the reference-language module bundle (English). A missing key
 * would render as its own raw string to the user (e.g. an <h1> reading
 * "glossary.title"), which the compiler and the build cannot otherwise catch.
 *
 * Scans `.ts`, `.html` and `.md` under `src/` — the guide agent docs are shipped
 * source, and a key named there gets copied by a reader just like one in a
 * component. Code samples the design guides SHOW as text (a snippet string, a
 * `<code>` element quoting a call) are not calls and are blanked before the
 * scan — see `stripCodeSamples`; `--selftest` proves the split on fixtures.
 *
 * Reference language: the key-source language from src/config/languages.json
 * (`keySourceLanguage`, English in the kit). Only keys whose first
 * segment matches a known namespace file are checked, so non-i18n string
 * literals are ignored. Dynamic/interpolated keys can't be checked statically
 * and are skipped by design.
 *
 * ## Beyond the reference language
 *
 * This gate used to open the `en` tree and nothing else — it never compared
 * locale key sets, never looked at empty values, and passed vacuously on an
 * empty input directory (0 namespaces means the key filter rejects everything,
 * so "0 referenced keys ... PASS"). These checks close that:
 *
 *   * VACUITY — 0 namespaces or 0 referenced keys is an error, not a pass.
 *   * PARSE — every locale's modules are parsed, and a failure names the file.
 *     A module that will not parse drops its whole namespace from the bundle.
 *   * PARITY — every locale must carry every key the reference language has.
 *     A missing key renders in the fallback language (a degradation), a missing
 *     namespace renders as raw text. Both are hard errors: all four shipped
 *     locales are complete today, so there is no backlog to grandfather.
 *   * EMPTY — a key present but set to "" renders as a blank in the UI, which
 *     no other check can see. Pinned to EMPTY_BASELINE: it can shrink freely,
 *     it cannot grow silently.
 *   * ORPHANS — the reverse direction: a key defined in the modules that no
 *     source file references. Every orphan ships in every locale's bundle and
 *     is translated, reviewed and kept in parity for nothing. Pinned to
 *     ORPHAN_BASELINE the same way. What counts as a reference, and which keys
 *     are built at runtime, is spelled out at `findOrphans` in
 *     scripts/lib/i18n-orphans.mjs (shared with tools/make-it-yours.mjs); the
 *     rule proves itself on fixtures on every run (`--selftest` runs only that).
 *     `--list-orphans` prints every current orphan.
 *
 * ## Feature scope (what a locale other than the key source must carry)
 *
 * PARITY asks each locale only for the strings of what the site uses, by the rule in
 * `scripts/lib/feature-scope.mjs` over `src/config/features.json` and the switches in
 * `src/config/site.json`:
 *
 *   * A key that belongs only to switched-off features (their `i18n` entries, minus
 *     `i18nShared`) is not required outside the key source. The key source keeps it,
 *     because the feature's code is still in the repo — so it is no orphan either, and
 *     the referenced-key check still resolves it there.
 *   * A key under `devOnly.i18n` (the dev workshop, src/app/dev/, stripped from
 *     production builds) is required only in the key source, the runtime fallback of
 *     every locale: the workshop never shows a raw key, a locale without the workshop
 *     strings shows it in the key source language. A locale that carries some keys of a
 *     dev-only entry must carry all of them (the kit's own locales do), so a translated
 *     workshop cannot silently go half-translated.
 *   * OWNERSHIP — "still read by code that is on stays required" is held statically,
 *     independent of the switches: a key of a namespace a feature owns whole (an `i18n`
 *     entry without a dot, such as `glossary`) that a literal, a runtime prefix builder
 *     or a `*Prefix:` input in src/app names outside the feature's `code` paths (and
 *     outside its own route blocks in app.routes.ts) must be listed in the feature's
 *     `i18nShared`, else this gate fails. Key-path entries in shared namespaces
 *     (`app.nav.glossary`, `home.showcase.glossary`, `seo.pages.glossary`) are the
 *     catalog's statement that their readers (navigation, home, not-found, roadmap, SEO,
 *     Easy-Language FAB, search) show them only while the feature is on. Specs and the
 *     dev workshop do not count as readers.
 *
 * Exit 0 = all of the above hold. Exit 1 = at least one violation.
 * Wired into `build:verify` so `build:prod` fails on a regression.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_LOCALES, BASE_LANGUAGES, DEFAULT_LANGUAGE, KEY_SOURCE_LANG } from './lib/locale-fallback.mjs';
import { easyAvailabilityFromModules } from './lib/i18n-split.mjs';
import { createFeatureScope } from './lib/feature-scope.mjs';
import { featureOfRoute, loadFeatureCatalog, loadSiteConfig } from './lib/site-config.mjs';
// The orphan rule, the runtime-built prefixes (DYNAMIC_PREFIXES — add a new one there)
// and the code-sample blanking live in one module, shared with tools/make-it-yours.mjs,
// which drops the keys only removed samples read and must agree with this gate.
import {
  DYNAMIC_PREFIXES,
  ORPHAN_SOURCE_EXTS,
  PREFIX_INPUT_RE,
  findOrphans,
  isOrphanSource,
  stripCodeSamples,
} from './lib/i18n-orphans.mjs';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC_DIR = join(REPO_ROOT, 'src');
// The canonical key source — languages.json `keySourceLanguage`. It used to be
// a literal 'en' here while the parity check below compared against the CONTENT
// reference language ('de'): two references for one key set.
const REFERENCE_LANG = KEY_SOURCE_LANG;
const ALL_MODULES_DIR = join(REPO_ROOT, 'src', 'assets', 'i18n', 'modules');
const MODULES_DIR = join(ALL_MODULES_DIR, REFERENCE_LANG);

/**
 * Keys that exist in a locale but hold an empty string. The last twelve (the
 * three `articleApisMcp.*.checkpointQuestion` keys in four locales) were filled
 * on 2026-09-23, so the baseline is zero: any new blank fails the gate.
 */
const EMPTY_BASELINE = 0;

/**
 * Keys defined in the modules that nothing references (union over all locales,
 * so an Easy-Language extra counts too). Cleared on 2026-09-23: first down to
 * the 64 orphans in namespaces another change was editing at the time
 * (impressum, cookie, settings, quiz), then to zero, together with the dead
 * snake and Game-of-Life settings. Any orphan now fails the gate. Delete the
 * key in all four locales, or reference it, or — if it is built at runtime —
 * add its prefix to DYNAMIC_PREFIXES (scripts/lib/i18n-orphans.mjs) with the reason.
 */
const ORPHAN_BASELINE = 0;

/** Proves the orphan rule on fixtures: it must bite, and it must not bite live keys. */
function orphanSelftest() {
  const keys = [
    'a.used',
    'a.inTemplate',
    'a.dead',
    'a.onlyInSpec',
    'b.dyn.x',
    'c.pre.front',
    'd.quiz.q1',
    'e.quiz.q1',
    'f.used.deeper',
    // code samples (stripCodeSamples): only named in text shown to the reader
    'g.concat',
    'g.template',
    'g.pre',
    'g.htmlCode',
    'h.inline',
    'h.rendered',
    'h.literal',
    'h.built.x',
    'h.afterRegex',
    'gone.left',
  ];
  const sources = [
    { path: 'x.component.ts', text: "translate('a.used'); const q = (k) => t('d.quiz.' + k);" },
    { path: 'x.component.html', text: "{{ translate('a.inTemplate') }} {{ translate(`b.dyn.${kind}`) }}" },
    { path: 'y.component.ts', text: "cards = [{ translationKeyPrefix: 'c.pre' }]; t('f.used.deeper.more')" },
    { path: 'x.component.spec.ts', text: "translate('a.onlyInSpec')" },
    {
      path: 'z-article.component.ts',
      text: [
        '@Component({',
        "  template: `<h1>{{ translate('h.inline') }}</h1>",
        "    <pre><code>{{ t('h.rendered') }}</code></pre> <p>{{ ${'x'} }}</p>",
        "    <code class=\"dd__code\">t('g.pre').replace('&#123;n&#125;', n)</code>`,",
        '})',
        'export class Z {',
        "  titleKey = 'h.literal';",
        '  build = (k) => this.i18n.translate(`h.built.${k}`);',
        "  quote = /['\"]/.test(s) ? 1 : 2; label = this.i18n.translate('h.afterRegex');",
        "  readonly snippet = '  label: this.i18n.translate(\\'g.concat\\'),\\n' + '}';",
        '  readonly code = `<p-dialog [header]="t(\'g.template\')" ${this.attrs}>`;',
        '}',
      ].join('\n'),
    },
    { path: 'z.component.html', text: "<p>Call it like <code>translate('g.htmlCode')</code>.</p>" },
  ].map((s) => ({ ...s, text: stripCodeSamples(s.path, s.text) }));
  const prefixes = [
    { prefix: 'b.dyn.', reason: 'fixture' },
    { prefix: /^[a-z]\.quiz\./, reason: 'fixture' },
    { prefix: 'gone.', reason: 'fixture: nothing builds it, a key still under it' },
    { prefix: 'emptied.', reason: 'fixture: nothing builds it, no key under it — idle, not stale' },
    { prefix: /^[a-z].gone.quiz./, reason: 'fixture: a family with no key left — idle, not stale' },
    { prefix: 'h.built.', reason: 'fixture: a template literal without a call is a real builder' },
  ];
  const { orphans, stale, idle } = findOrphans(keys, sources, prefixes);
  const want = [
    'a.dead',
    'a.onlyInSpec',
    'e.quiz.q1',
    'f.used.deeper',
    'g.concat',
    'g.htmlCode',
    'g.pre',
    'g.template',
    'gone.left',
  ];
  const problems = [];
  if (JSON.stringify(orphans) !== JSON.stringify(want)) {
    problems.push(`orphans ${JSON.stringify(orphans)}, expected ${JSON.stringify(want)}`);
  }
  if (JSON.stringify(stale) !== JSON.stringify(['gone.'])) {
    problems.push(`stale prefixes ${JSON.stringify(stale)}, expected ["gone."]`);
  }
  const wantIdle = ['emptied.', String(/^[a-z].gone.quiz./)];
  if (JSON.stringify(idle) !== JSON.stringify(wantIdle)) {
    problems.push(`idle prefixes ${JSON.stringify(idle)}, expected ${JSON.stringify(wantIdle)}`);
  }
  return problems;
}

/**
 * The top-level route objects of app.routes.ts as separate source units, each with the
 * feature its path (or route group) belongs to — so a feature route's own `titleKey`
 * counts as the feature's code. The text before the first route is a unit without one.
 */
function routeUnits(path, text, catalog) {
  return text.split(/\n {2}\{\r?\n/).map((block, i) => {
    const routePath = i === 0 ? undefined : /^ {4}path:\s*'([^']*)'/m.exec(block)?.[1];
    const group = /\bgroup:\s*'([^']+)'/.exec(block)?.[1];
    return { path, text: block, feature: routePath ? featureOfRoute(catalog, routePath, group) : undefined };
  });
}

/**
 * The OWNERSHIP rule, pure so the selftest can run it. `reads` is `[{ path, key, feature? }]`
 * — every key (or runtime prefix, ending in ".") a source unit names, with the feature
 * the unit belongs to when it is a route block. A read of a key in a namespace some
 * feature owns whole, from outside that feature's `code` paths, must be covered by the
 * feature's `i18nShared`; otherwise switching the feature off would drop a string that
 * code which stays on still shows. Returns the problems as sentences, one per key.
 */
function featureReadProblems(catalog, reads) {
  const problems = new Map();
  const inCode = (feature, path) =>
    (feature.code ?? []).some((c) => path === c || (c.endsWith('/') && path.startsWith(c)));
  for (const { path, key, feature: unitFeature } of reads) {
    const bare = key.replace(/\.$/, '');
    for (const [id, feature] of Object.entries(catalog.features ?? {})) {
      if (unitFeature === id || inCode(feature, path)) continue;
      const ns = feature.i18n.find((e) => !e.includes('.') && (bare === e || bare.startsWith(`${e}.`)));
      if (!ns) continue;
      if ((feature.i18nShared ?? []).some((e) => bare === e || bare.startsWith(`${e}.`))) continue;
      const id2 = `${id}|${bare}`;
      if (problems.has(id2)) continue;
      problems.set(
        id2,
        `src/config/features.json: "${bare}" belongs to the feature "${id}" (namespace "${ns}"), but ${path} reads it ` +
          `outside the feature's code — with "${id}" off a new language would lack it. List it in "${id}.i18nShared", ` +
          `or add the file to "${id}.code" if only that feature uses it.`,
      );
    }
  }
  return [...problems.values()];
}

/** Proves the feature-scope and ownership rules on fixtures. */
function scopeSelftest() {
  const problems = [];
  const catalog = {
    shellPages: ['home'],
    devOnly: { i18n: ['dev', 'app.nav.dev'] },
    features: {
      gloss: {
        routes: ['gloss'],
        i18n: ['gloss', 'app.nav.gloss'],
        i18nShared: ['gloss.popover'],
        collections: ['gloss'],
        code: ['src/app/pages/gloss/'],
      },
      news: { routes: ['news'], i18n: ['news'], collections: ['notes'], code: ['src/app/pages/news/news.ts'] },
    },
  };
  const refKeys = [
    'app.nav.gloss',
    'app.nav.dev',
    'app.title',
    'gloss.title',
    'gloss.popover.go',
    'news.title',
    'dev.hub.title',
    'dev.hub.text',
  ];
  const expect = (label, got, want) => {
    if (JSON.stringify(got) !== JSON.stringify(want)) {
      problems.push(`${label}: ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
    }
  };
  const off = createFeatureScope(catalog, { gloss: false, news: true });
  // A new locale with nothing: the off feature's own keys and the workshop are not required,
  // the shared popover key and everything else is.
  const fresh = off.splitKeys(refKeys, new Set());
  expect('new locale, gloss off: required', fresh.required, ['app.title', 'gloss.popover.go', 'news.title']);
  expect('new locale, gloss off: off', fresh.off, ['app.nav.gloss', 'gloss.title']);
  expect('new locale, gloss off: devOnly', fresh.devOnly, ['app.nav.dev', 'dev.hub.title', 'dev.hub.text']);
  // A locale that carries one workshop key must carry that entry whole; the other entry stays optional.
  const partial = off.splitKeys(refKeys, new Set(['dev.hub.title']));
  expect('partial workshop: devOnly', partial.devOnly, ['app.nav.dev']);
  expect(
    'partial workshop: dev keys required',
    partial.required.filter((k) => k.startsWith('dev.')),
    ['dev.hub.title', 'dev.hub.text'],
  );
  // The key source carries everything, off or not.
  expect('key source', off.splitKeys(refKeys, new Set(), { isKeySource: true }).required.length, refKeys.length);
  // Every feature on (no switches, or no catalog at all): only the workshop is optional.
  expect('all on', createFeatureScope(catalog, {}).splitKeys(refKeys, new Set()).off, []);
  expect('no catalog', createFeatureScope(undefined, undefined).splitKeys(refKeys, new Set()).required.length, 8);
  // A collection is off when its only owner is off; one nobody owns is never off.
  expect(
    'collections',
    [off.isCollectionOff('gloss'), off.isCollectionOff('notes'), off.isCollectionOff('x')],
    [true, false, false],
  );

  const routes = [
    "import x from 'y';",
    '  {',
    "    path: 'gloss',",
    "    data: { titleKey: 'gloss.title' },",
    '  },',
    '  {',
    "    path: 'home',",
    "    data: { titleKey: 'gloss.title' },",
    '  },',
  ].join('\n');
  const units = routeUnits('src/app/app.routes.ts', routes, catalog);
  expect(
    'route units',
    units.map((u) => u.feature ?? null),
    [null, 'gloss', null],
  );
  const reads = [
    { path: 'src/app/pages/gloss/gloss.component.ts', key: 'gloss.title' }, // own code
    { path: 'src/app/app.routes.ts', key: 'gloss.title', feature: 'gloss' }, // own route block
    { path: 'src/app/pages/home/home.ts', key: 'gloss.popover.go' }, // shared
    { path: 'src/app/pages/home/home.ts', key: 'app.nav.gloss' }, // key-path entry: a declaration
    { path: 'src/app/pages/news/news.ts', key: 'news.title' }, // own code (a file entry)
    { path: 'src/app/pages/home/home.ts', key: 'gloss.title' }, // outside: must be shared
    { path: 'src/app/pages/home/home.ts', key: 'news.' }, // a builder of every news key, outside
    { path: 'src/app/pages/news/other.ts', key: 'news.title' }, // a file entry covers only that file
  ];
  const found = featureReadProblems(catalog, reads).map((p) =>
    p
      .match(/"([^"]+)" belongs to the feature "([^"]+)"/)
      .slice(1)
      .join('@'),
  );
  expect('ownership problems', found, ['gloss.title@gloss', 'news@news', 'news.title@news']);
  return problems;
}

{
  const problems = [...orphanSelftest(), ...scopeSelftest()];
  if (process.argv.includes('--selftest') || problems.length > 0) {
    if (problems.length > 0) {
      console.error(`check-i18n-keys --selftest: FAIL — ${problems.join('; ')}`);
      process.exit(1);
    }
    console.log(
      'check-i18n-keys --selftest: PASS — the orphan rule bites on fixtures and spares live keys; the feature scope ' +
        'drops switched-off and dev-only strings outside the key source, and the ownership rule bites.',
    );
    process.exit(0);
  }
}

/** Recursively collect files under dir matching one of the extensions. */
function walk(dir, exts, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, exts, acc);
    else if (exts.includes(extname(entry.name))) acc.push(p);
  }
  return acc;
}

/**
 * Load one locale's modules: { <namespace>: <parsed json> }.
 * A parse failure throws with the file name — never a silent skip, because a
 * skipped module is a whole namespace missing from the shipped bundle.
 */
function loadLocaleBundle(locale) {
  const dir = join(ALL_MODULES_DIR, locale);
  if (!existsSync(dir)) {
    throw new Error(`i18n module directory missing for locale "${locale}": ${dir.replace(REPO_ROOT, '')}`);
  }
  const bundle = {};
  for (const f of readdirSync(dir)) {
    if (extname(f) !== '.json' || f.startsWith('_')) continue;
    const p = join(dir, f);
    let text = readFileSync(p, 'utf-8');
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    try {
      bundle[basename(f, '.json')] = JSON.parse(text);
    } catch (e) {
      throw new Error(`Invalid JSON in ${p.replace(REPO_ROOT, '').replace(/\\/g, '/')}: ${e.message}`);
    }
  }
  return bundle;
}

/** Every leaf key path in a bundle, plus the paths whose value is empty. */
function inspectKeys(node, prefix, keys, empties) {
  for (const [k, v] of Object.entries(node)) {
    const full = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      inspectKeys(v, full, keys, empties);
    } else {
      keys.add(full);
      if (v === '' || v === null) empties.push(full);
    }
  }
}

/** Resolve a dotted key against the bundle; return true if it lands on a leaf. */
function resolves(bundle, key) {
  const parts = key.split('.');
  let node = bundle[parts[0]];
  if (node === undefined) return false;
  for (let i = 1; i < parts.length; i++) {
    if (node === null || typeof node !== 'object') return false;
    node = node[parts[i]];
    if (node === undefined) return false;
  }
  // A leaf is a string (or number); an object means the key is an unfinished path.
  return typeof node !== 'object' || node === null;
}

// ---------------------------------------------------------------------------
// Load every locale. Parse failures and a missing/empty directory are fatal.
// ---------------------------------------------------------------------------
const fatal = [];
const localeBundles = new Map();
for (const locale of ALL_LOCALES) {
  try {
    localeBundles.set(locale, loadLocaleBundle(locale));
  } catch (e) {
    fatal.push(e.message);
  }
}

if (fatal.length > 0) {
  console.error('==================================================================');
  console.error(`  check-i18n-keys — FAIL: ${fatal.length} i18n module(s) could not be loaded:`);
  for (const f of fatal) console.error(`    ${f}`);
  console.error('  A module that will not parse drops its ENTIRE namespace from the bundle');
  console.error('  and every key in it renders as raw text to the user.');
  console.error('==================================================================');
  process.exit(1);
}

const bundle = localeBundles.get(REFERENCE_LANG) ?? {};
const namespaces = new Set(Object.keys(bundle));

// VACUITY GUARD (D4). With 0 namespaces the key filter below rejects every
// literal, `referenced` stays empty, and the gate used to print
// "0 referenced keys ... PASS". An empty input proves nothing.
if (namespaces.size === 0) {
  console.error('==================================================================');
  console.error(`  check-i18n-keys — FAIL: 0 namespaces loaded from ${MODULES_DIR.replace(REPO_ROOT, '')}`);
  console.error('  With no namespaces this gate cannot check anything; a PASS here would be a lie.');
  console.error('==================================================================');
  process.exit(1);
}

// translate('ns.key') / translate("ns.key")  and  someKey: 'ns.key'
const TRANSLATE_RE = /\btranslate\(\s*\\?['"]([^'"$)\\]+)\\?['"]/g;
// Most pages define a one-line `t(key)` helper. Its literals count only where that helper
// passes the key straight to the service. A helper that prepends its own namespace
// (`translate(`articleGitIntro.${key}`)`) makes the literal a fragment, and a file
// without a helper (a guide article quoting another page's code) is not calling anything.
const T_HELPER_RE = /\bt\(\s*\\?['"]([^'"$)\\]+)\\?['"]/g;
const PASS_THROUGH_HELPER_RE = /\bt\(key:\s*string\)[^{]*\{[^}]*\.translate\(key\)/;
const KEYPROP_RE = /\b\w*[Kk]ey\s*:\s*\\?['"]([^'"$\\]+)\\?['"]/g;

// The feature catalog and this site's switches (see "Feature scope" above). A catalog
// that will not load is a problem of its own; the scope then treats every feature as on.
const scopeProblems = [];
let featureCatalog;
let siteSwitches;
try {
  featureCatalog = loadFeatureCatalog();
  siteSwitches = loadSiteConfig().features;
} catch (e) {
  scopeProblems.push(`src/config/site.json or features.json cannot be read: ${e.message}`);
}
const scope = createFeatureScope(featureCatalog, siteSwitches);
for (const [id, feature] of Object.entries(featureCatalog?.features ?? {})) {
  for (const p of feature.code ?? []) {
    if (!existsSync(join(REPO_ROOT, p)))
      scopeProblems.push(`src/config/features.json: "${id}.code" path ${p} does not exist`);
  }
}

const referenced = new Map(); // key -> first file it appears in
// Every key or runtime prefix a live app source names (OWNERSHIP rule): src/app only,
// no specs, no dev workshop; app.routes.ts split into route blocks.
const featureReads = [];
for (const file of walk(SRC_DIR, ['.ts', '.html', '.md'])) {
  const text = stripCodeSamples(file, readFileSync(file, 'utf-8'));
  const rel = file.replace(REPO_ROOT, '').replace(/\\/g, '/').replace(/^\//, '');
  const isReader = /^src\/app\/(?!dev\/).*\.(ts|html)$/.test(rel) && !rel.endsWith('.spec.ts');
  const units =
    isReader && featureCatalog && rel === 'src/app/app.routes.ts'
      ? routeUnits(rel, text, featureCatalog)
      : [{ path: rel, text, feature: undefined }];
  for (const unit of units) {
    const patterns = [TRANSLATE_RE, KEYPROP_RE];
    if (PASS_THROUGH_HELPER_RE.test(text)) patterns.push(T_HELPER_RE);
    for (const re of patterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(unit.text)) !== null) {
        const key = m[1];
        // Skip dynamic prefixes: `translate('toast.type.' + type)` captures "toast.type."
        // — a concatenation base, not a resolvable key. Require a full dotted identifier path.
        if (!/^[\w-]+(\.[\w-]+)+$/.test(key)) continue;
        // Only treat it as an i18n key if its first segment is a real namespace.
        if (!namespaces.has(key.split('.')[0])) continue;
        if (!referenced.has(key)) referenced.set(key, file);
        if (isReader) featureReads.push({ path: unit.path, key, feature: unit.feature });
      }
    }
    if (!isReader) continue;
    for (const { prefix } of DYNAMIC_PREFIXES) {
      if (typeof prefix === 'string' && new RegExp(`['"\`]${prefix.replace(/\./g, '\\.')}`).test(unit.text)) {
        featureReads.push({ path: unit.path, key: prefix, feature: unit.feature });
      }
    }
    for (const m of unit.text.matchAll(PREFIX_INPUT_RE)) {
      featureReads.push({ path: unit.path, key: `${m[1]}.`, feature: unit.feature });
    }
  }
}
if (featureCatalog) scopeProblems.push(...featureReadProblems(featureCatalog, featureReads));

const missing = [];
for (const [key, file] of referenced) {
  if (!resolves(bundle, key)) missing.push({ key, file: file.replace(REPO_ROOT, '').replace(/\\/g, '/') });
}

// VACUITY GUARD (D4), second half: namespaces exist but nothing referenced them.
// Either src/ was not scanned or the extraction regexes broke — in both cases
// this gate verified nothing and must not report PASS.
if (referenced.size === 0) {
  console.error('==================================================================');
  console.error(`  check-i18n-keys — FAIL: 0 i18n keys found in ${SRC_DIR.replace(REPO_ROOT, '')}`);
  console.error(`  ${namespaces.size} namespaces are loaded, so the app must reference some.`);
  console.error('  Either the source tree is empty or the key extraction broke — nothing was checked.');
  console.error('==================================================================');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Cross-locale parity + empty values (D3 / D6)
// ---------------------------------------------------------------------------
const keysByLocale = new Map();
const emptiesByLocale = new Map();
for (const [locale, b] of localeBundles) {
  const keys = new Set();
  const empties = [];
  for (const [ns, data] of Object.entries(b)) inspectKeys(data, ns, keys, empties);
  keysByLocale.set(locale, keys);
  emptiesByLocale.set(locale, empties.sort());
}

// Parity against the key source. A BASE language is also checked the other
// way round — a key it has and the key source lacks is a key no fallback can
// serve, and it is what the old parity reference ('de') used to catch. Extra
// keys in an Easy-Language locale are only counted: the easy trees carry some
// extra explanation keys (and dead ones from the full portal) by design.
const parityRef = REFERENCE_LANG;
const refKeys = keysByLocale.get(parityRef) ?? new Set();
const parityProblems = [];
const easyExtras = [];
const notRequired = []; // "<locale>=<off>+<dev>" for the report
for (const [locale, keys] of keysByLocale) {
  if (locale === parityRef) continue;
  // Only what the site uses (see "Feature scope" above): keys of switched-off features
  // and a dev workshop the locale does not carry are not asked for.
  const { required, off: offKeys, devOnly: devKeys } = scope.splitKeys([...refKeys], keys);
  if (offKeys.length || devKeys.length) notRequired.push(`${locale}=${offKeys.length}+${devKeys.length}`);
  const requiredNs = new Set(required.map((k) => k.split('.')[0]));
  for (const ns of requiredNs) {
    if (!(ns in (localeBundles.get(locale) ?? {}))) {
      parityProblems.push(`${locale}: namespace "${ns}" is missing entirely (would render as raw keys).`);
    }
  }
  const gap = required.filter((k) => !keys.has(k));
  if (gap.length > 0) {
    parityProblems.push(
      `${locale}: ${gap.length} key(s) missing vs "${parityRef}" — e.g. ${gap.slice(0, 5).join(', ')}`,
    );
  }
  const extra = [...keys].filter((k) => !refKeys.has(k));
  if (extra.length > 0 && !BASE_LANGUAGES.includes(locale)) {
    easyExtras.push(`${locale}=${extra.length}`);
  } else if (extra.length > 0) {
    parityProblems.push(
      `${locale}: ${extra.length} key(s) the key source "${parityRef}" lacks — e.g. ${extra.slice(0, 5).join(', ')}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Language config drift: src/index.html cannot import languages.json
// ---------------------------------------------------------------------------
// The bare-URL redirect runs as inline script before Angular loads, so its
// language list and default are literals. They must equal languages.json
// (base languages = URL prefixes, defaultLanguage = redirect target), and the
// static <html lang> must name the site default, or a visitor lands in a
// language the app does not consider the default.
const configProblems = [];
{
  const indexHtml = readFileSync(join(SRC_DIR, 'index.html'), 'utf-8');
  const codesMatch = indexHtml.match(/var codes = \[([^\]]*)\];/);
  const defaultMatch = indexHtml.match(/codes\.indexOf\(saved\) !== -1 \? saved : '([^']+)'/);
  const htmlLangMatch = indexHtml.match(/<html lang="([^"]+)"/);
  const codes = codesMatch ? [...codesMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]) : null;
  if (!codes) configProblems.push('src/index.html: redirect script `var codes = [...]` not found.');
  else if (codes.join(',') !== BASE_LANGUAGES.join(',')) {
    configProblems.push(
      `src/index.html: redirect codes [${codes.join(', ')}] differ from languages.json [${BASE_LANGUAGES.join(', ')}].`,
    );
  }
  if (!defaultMatch) configProblems.push('src/index.html: redirect default language not found.');
  else if (defaultMatch[1] !== DEFAULT_LANGUAGE) {
    configProblems.push(
      `src/index.html: redirect default '${defaultMatch[1]}' differs from languages.json defaultLanguage '${DEFAULT_LANGUAGE}'.`,
    );
  }
  if (htmlLangMatch?.[1] !== DEFAULT_LANGUAGE) {
    configProblems.push(
      `src/index.html: <html lang="${htmlLangMatch?.[1]}"> differs from languages.json defaultLanguage '${DEFAULT_LANGUAGE}'.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Easy-Language availability index: committed, derived from the modules
// ---------------------------------------------------------------------------
// EasyLanguageService imports src/config/easy-language-availability.json
// synchronously; scripts/build-i18n-bundles.ts regenerates it. A module edit
// without a rebuild would leave the FAB answering from an old set.
{
  const availabilityPath = join(SRC_DIR, 'config', 'easy-language-availability.json');
  const expected = easyAvailabilityFromModules(localeBundles).ids;
  let committed = null;
  try {
    committed = JSON.parse(readFileSync(availabilityPath, 'utf-8')).ids;
  } catch (e) {
    configProblems.push(`src/config/easy-language-availability.json unreadable: ${e.message}`);
  }
  if (committed && JSON.stringify(committed) !== JSON.stringify(expected)) {
    configProblems.push(
      'src/config/easy-language-availability.json is stale — run `npm run i18n:build` and commit it ' +
        `(derived: ${expected.length} pages, committed: ${committed.length}).`,
    );
  }
}

const emptyTotal = [...emptiesByLocale.values()].reduce((n, e) => n + e.length, 0);

// ---------------------------------------------------------------------------
// Orphans: keys defined but referenced nowhere (see findOrphans)
// ---------------------------------------------------------------------------
// Sources are every text file under src/ except the i18n modules and bundles
// themselves, the git-ignored build outputs (content bundles, compiled glossary)
// and src/config/samples.json — `isOrphanSource` in scripts/lib/i18n-orphans.mjs
// says why. Specs are dropped inside findOrphans.
const orphanSources = walk(SRC_DIR, ORPHAN_SOURCE_EXTS)
  .map((f) => ({ file: f, rel: f.replace(REPO_ROOT, '').replace(/\\/g, '/').replace(/^\//, '') }))
  .filter(({ rel }) => isOrphanSource(rel))
  .map(({ file }) => ({ path: file.replace(/\\/g, '/'), text: stripCodeSamples(file, readFileSync(file, 'utf-8')) }));
const allKeys = new Set();
for (const keys of keysByLocale.values()) for (const k of keys) allKeys.add(k);
const {
  orphans,
  stale: stalePrefixes,
  idle: idlePrefixes,
} = findOrphans([...allKeys], orphanSources, DYNAMIC_PREFIXES);

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const problems = [];
missing.sort((a, b) => a.key.localeCompare(b.key));
for (const { key, file } of missing) {
  problems.push(`referenced key missing from the ${REFERENCE_LANG} bundle: ${key}   (${file})`);
}
problems.push(...parityProblems);
problems.push(...configProblems);
problems.push(...scopeProblems);
if (emptyTotal > EMPTY_BASELINE) {
  problems.push(
    `${emptyTotal} empty i18n values, baseline is ${EMPTY_BASELINE} — ${emptyTotal - EMPTY_BASELINE} new blank(s). ` +
      `Fill them, or raise EMPTY_BASELINE in this file deliberately.`,
  );
}
if (orphans.length > ORPHAN_BASELINE) {
  problems.push(
    `${orphans.length} unreferenced i18n key(s), baseline is ${ORPHAN_BASELINE} — ${orphans.length - ORPHAN_BASELINE} new. ` +
      `Delete them in every locale, or reference them; a key built at runtime needs its prefix in ` +
      `DYNAMIC_PREFIXES. e.g. ${orphans.slice(0, 5).join(', ')} (all: --list-orphans)`,
  );
}
for (const p of stalePrefixes) {
  problems.push(
    `DYNAMIC_PREFIXES entry "${p}" is stale: keys still start with it, but no source builds a key from it any ` +
      `more — delete those keys (or reference them), then remove the entry.`,
  );
}

console.log('==================================================================');
console.log(
  `  check-i18n-keys — ${referenced.size} referenced keys across ${namespaces.size} namespaces (ref: ${REFERENCE_LANG})`,
);
console.log(
  `  Locales checked: ${[...keysByLocale].map(([l, k]) => `${l}=${k.size}`).join('  ')}  (parity ref: ${parityRef})`,
);
if (easyExtras.length > 0) {
  console.log(`  Easy-Language keys the key source lacks (counted, not an error): ${easyExtras.join('  ')}`);
}
console.log(
  `  Features off in site.json: ${scope.offFeatures.length ? scope.offFeatures.join(', ') : 'none'}` +
    (notRequired.length
      ? ` — keys not required (switched off + dev workshop): ${notRequired.join('  ')}`
      : ' — every locale carries every key'),
);
console.log(`  Empty values: ${emptyTotal} (baseline ${EMPTY_BASELINE})`);
if (emptyTotal > 0) {
  const shown = emptiesByLocale.get(parityRef) ?? [];
  for (const k of shown) console.log(`    (blank in every locale) ${k}`);
}
if (emptyTotal < EMPTY_BASELINE) {
  console.log(`  Baseline is now pessimistic — lower EMPTY_BASELINE to ${emptyTotal} to lock the gain in.`);
}
console.log(
  `  Unreferenced keys: ${orphans.length} (baseline ${ORPHAN_BASELINE}; ${DYNAMIC_PREFIXES.length} dynamic prefixes)`,
);
if (idlePrefixes.length > 0) {
  console.log(`  Dynamic prefixes that match no key (keep nothing alive, not an error): ${idlePrefixes.join('  ')}`);
}
if (process.argv.includes('--list-orphans')) {
  for (const k of orphans) console.log(`    (unreferenced) ${k}`);
}
if (orphans.length < ORPHAN_BASELINE) {
  console.log(`  Baseline is now pessimistic — lower ORPHAN_BASELINE to ${orphans.length} to lock the gain in.`);
}

if (problems.length === 0) {
  console.log('  PASS — every referenced key resolves, every locale is complete, no new blanks, no new orphans.');
  console.log('==================================================================');
  process.exit(0);
}

console.error(`  FAIL — ${problems.length} problem(s):`);
for (const p of problems) console.error(`    ${p}`);
console.error('  These render as raw text, as a blank, or in the wrong language. Fix the modules.');
console.error('==================================================================');
process.exit(1);
