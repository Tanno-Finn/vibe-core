#!/usr/bin/env node
/**
 * check-content-coverage.mjs — the gate that would have caught bug D1.
 *
 * The content bundles (`src/assets/data/content.<locale>.json`) are assembled
 * per entry from `core/<collection>/<id>.json` plus a per-locale translation
 * file. When the translation for a locale is missing, the builder falls back.
 * Until this gate existed, that fallback was hardcoded `<locale>` -> `de` ->
 * `en`, so `en-easy` reached GERMAN before English and 134 of 181 entries in
 * content.en-easy.json shipped as German text — to Easy-Language readers, the
 * audience least able to cope with the wrong language. Nothing printed it and
 * no check looked at it.
 *
 * ## What this checks, and at what severity
 *
 * ERROR (exit 1) — these must never ship:
 *   1. CROSS-LANGUAGE fallback: a locale's entry resolved from a file in a
 *      DIFFERENT base language ('en-easy' served from 'de'). This is D1 itself.
 *   2. An entry that resolves to NO file at all and silently vanishes from the
 *      bundle (dangling cross-references downstream).
 *   3. Bundle drift: the emitted bundle entry does not equal core + the
 *      translation this gate resolved. This is what makes the gate independent
 *      of the builder — a builder that resolves differently is caught here even
 *      though both read the same chain module.
 *   4. Easy-Language coverage REGRESSION: more same-language fallbacks in a
 *      (locale, collection) pair than the recorded baseline below. This is the
 *      A11Y-005 finding: a valid overrides/A11Y-005.md turns it ADVISORY (printed
 *      with the override's rationale, exit 0) via scripts/lib/overrides.mjs.
 *      Checks 1-3 and 5 are correctness bugs and no override relaxes them.
 *   5. Vacuity: no locales, no collections, no entries, or a missing bundle.
 *      A gate that passes on an empty input is not a gate.
 *
 * WARNING (exit 0, but printed with counts) — the honest, measured backlog:
 *   * SAME-LANGUAGE fallback: 'en-easy' served from 'en'. The reader still gets
 *     their own language, just not the Easy-Language register. The gap is pinned
 *     to BASELINE: it can shrink freely, it cannot grow silently. The shipped
 *     kit's baseline is 0 — a new entry without an Easy file fails the build
 *     unless the baseline is raised deliberately or overrides/A11Y-005.md applies.
 *
 * That split is the whole design: *wrong language* is a bug, *missing easy
 * variant* is a backlog — and a backlog with a number attached cannot rot.
 *
 * A collection owned only by features that src/config/site.json switches off
 * (`collections` in src/config/features.json, rule in scripts/lib/feature-scope.mjs)
 * is skipped whole and named in the report: the site shows none of it, so a new
 * language needs no translation of it and an emptied one is no error.
 *
 * Usage: node scripts/check-content-coverage.mjs
 *        (run AFTER `npm run content:build`, which writes the bundles)
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_LOCALES, fallbackChain, isCrossLanguage, isEasyLocale } from './lib/locale-fallback.mjs';
import { applyOverride } from './lib/overrides.mjs';
import { entryIdsOf as entryIdsIn } from './lib/content-entries.mjs';
import { createFeatureScope } from './lib/feature-scope.mjs';
import { loadFeatureCatalog, loadSiteConfig } from './lib/site-config.mjs';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const DATA_DIR = join(REPO_ROOT, 'src', 'assets', 'data');
const CORE_DIR = join(DATA_DIR, 'core');
const TRANSLATIONS_DIR = join(DATA_DIR, 'translations');

/**
 * Collections that merge core + per-locale translation, mirroring
 * CONTENT_TYPES in scripts/build-unified-content.ts. `bundleKey` is the key the
 * builder writes them under. The guard below fails if a translations/
 * subdirectory shows up that is not listed here, so a new collection cannot
 * slip past this gate unchecked.
 */
const COLLECTIONS = [
  { name: 'glossary', bundleKey: 'glossary' },
  { name: 'timeline', bundleKey: 'timeline' },
  { name: 'ai-tools', bundleKey: 'aiTools' },
  { name: 'ai-resources', bundleKey: 'aiResources' },
  // Bibliographic: a source's only translated field is its `title`, and a title
  // must name the work exactly — the Easy page, the standard page and the
  // citation export all cite the same work. So an Easy locale deliberately uses
  // the base-language record (de-easy -> de, en-easy -> en) instead of an Easy
  // file. Its same-language fallbacks are counted and printed separately as
  // "bibliographic", never as backlog. A CROSS-language fallback, a dropped
  // entry or drift is still an error here, like everywhere else.
  // `evidence` is author-only (build-unified-content.ts strips it), so the
  // expected entry leaves it out and a bundle that still carries it is drift.
  { name: 'sources', bundleKey: 'sources', easyPolicy: 'bibliographic', authorOnlyFields: ['evidence'] },
];

/**
 * Collections of switched-off features: not checked, only named. The gate still knows
 * them (the translations/ guard below), so switching a feature back on checks them again.
 */
const SCOPE = createFeatureScope(loadFeatureCatalog(), loadSiteConfig().features);
const SKIPPED = COLLECTIONS.filter((c) => SCOPE.isCollectionOff(c.name)).map((c) => c.name);
const CHECKED = COLLECTIONS.filter((c) => !SKIPPED.includes(c.name));

/** Collections whose Easy locales use the base-language record by design. */
const BIBLIOGRAPHIC = new Set(COLLECTIONS.filter((c) => c.easyPolicy === 'bibliographic').map((c) => c.name));

/** Collections that legitimately carry no translations/ subtree in the kit. */
const UNSEEDED_COLLECTIONS = [];

/**
 * Recorded Easy-Language backlog: same-language fallbacks per locale and
 * collection, as of the D1 fix. These are entries with no `<locale>` file that
 * correctly fall back to their OWN base language.
 *
 * Lower a number when you add Easy-Language content (the gate tells you when it
 * can be lowered). Raising a number means Easy-Language coverage went
 * BACKWARDS — do it only deliberately, in a commit that says why.
 */
// 2026-09-23: backlog closed (was 12 per Easy locale outside sources). Bibliographic
// collections (see BIBLIOGRAPHIC above) have no baseline: they are not backlog.
const BASELINE = {
  'de-easy': { glossary: 0, timeline: 0, 'ai-tools': 0, 'ai-resources': 0 },
  'en-easy': { glossary: 0, timeline: 0, 'ai-tools': 0, 'ai-resources': 0 },
};

const errors = [];
const notes = [];

function readJson(path) {
  try {
    let text = readFileSync(path, 'utf-8');
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Cannot parse ${path.replace(REPO_ROOT, '')}: ${e.message}`);
  }
}

/**
 * Top-level keys where two entries disagree, ignoring key order.
 *
 * Deliberately not `JSON.stringify(a) !== JSON.stringify(b)`: that compares insertion
 * order too, so an editor reordering a translation file — or a builder adding one
 * computed field — would fail the build and
 * point the reader at a file that is perfectly fine. Naming the keys that actually
 * differ turns a mysterious "drift" into something diagnosable.
 */
function differingKeys(expected, shipped) {
  const stable = (v) =>
    JSON.stringify(v, (_k, val) =>
      val && typeof val === 'object' && !Array.isArray(val)
        ? Object.fromEntries(
            Object.keys(val)
              .sort()
              .map((k) => [k, val[k]]),
          )
        : val,
    );
  const keys = new Set([...Object.keys(expected ?? {}), ...Object.keys(shipped ?? {})]);
  return [...keys].filter((k) => stable(expected?.[k]) !== stable(shipped?.[k])).sort();
}

/** Entry ids of a collection — index.json if present, else the *.json files. */
const entryIdsOf = (collection) => entryIdsIn(join(CORE_DIR, collection));

// ---------------------------------------------------------------------------
// Vacuity guards — an empty input must be an error, never a green PASS.
// ---------------------------------------------------------------------------
if (ALL_LOCALES.length === 0) {
  errors.push('No locales configured (src/config/languages.json is empty?).');
}
if (COLLECTIONS.length === 0) {
  errors.push('No collections configured in this gate.');
}
if (!existsSync(TRANSLATIONS_DIR) || !statSync(TRANSLATIONS_DIR).isDirectory()) {
  errors.push(`Translations directory missing: ${TRANSLATIONS_DIR.replace(REPO_ROOT, '')}`);
}

// Guard: every translations/ subdirectory must be a collection this gate knows.
if (existsSync(TRANSLATIONS_DIR)) {
  const known = new Set([...COLLECTIONS.map((c) => c.name), ...UNSEEDED_COLLECTIONS]);
  for (const dir of readdirSync(TRANSLATIONS_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    if (!known.has(dir.name)) {
      errors.push(
        `translations/${dir.name}/ exists but is not listed in COLLECTIONS in this gate — ` +
          `it would ship unchecked. Add it (and its bundleKey) to scripts/check-content-coverage.mjs.`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Load bundles
// ---------------------------------------------------------------------------
const bundles = new Map();
for (const locale of ALL_LOCALES) {
  const p = join(DATA_DIR, `content.${locale}.json`);
  if (!existsSync(p)) {
    errors.push(`Bundle missing: src/assets/data/content.${locale}.json — run \`npm run content:build\` first.`);
    continue;
  }
  bundles.set(locale, readJson(p));
}

// ---------------------------------------------------------------------------
// Resolve every (collection, entry, locale) and compare against the bundle
// ---------------------------------------------------------------------------
/** locale -> collection -> count of same-language fallbacks */
const sameLanguage = {};
/** locale -> collection -> count of by-design base-record uses (bibliographic collections) */
const bibliographic = {};
/** locale -> collection -> count of cross-language fallbacks (for the table) */
const crossByCell = {};
const crossLanguage = [];
const dropped = [];
const drift = [];
let checked = 0;

for (const { name, bundleKey, authorOnlyFields } of CHECKED) {
  const ids = entryIdsOf(name);
  if (ids.length === 0) {
    errors.push(`Collection "${name}" resolved 0 entries — core/${name}/index.json empty or missing.`);
    continue;
  }

  for (const id of ids) {
    const corePath = join(CORE_DIR, name, `${id}.json`);
    if (!existsSync(corePath)) continue; // index lists an id with no core file — not this gate's job
    const core = readJson(corePath);

    for (const locale of ALL_LOCALES) {
      const bundle = bundles.get(locale);
      if (!bundle) continue;

      // Resolve the translation exactly the way the builder must.
      let used = null;
      let translation = null;
      for (const candidate of fallbackChain(locale)) {
        const p = join(TRANSLATIONS_DIR, name, candidate, `${id}.json`);
        if (!existsSync(p)) continue;
        translation = readJson(p);
        used = candidate;
        break;
      }
      checked++;

      if (used === null) {
        dropped.push(`${name}/${id} [${locale}]`);
        continue;
      }

      if (used !== locale) {
        if (isCrossLanguage(locale, used)) {
          crossLanguage.push(`${name}/${id} [${locale}] <- ${used}`);
          crossByCell[locale] ??= {};
          crossByCell[locale][name] = (crossByCell[locale][name] ?? 0) + 1;
        } else if (BIBLIOGRAPHIC.has(name) && isEasyLocale(locale)) {
          // By design, not backlog: see the easyPolicy note in COLLECTIONS.
          bibliographic[locale] ??= {};
          bibliographic[locale][name] = (bibliographic[locale][name] ?? 0) + 1;
        } else {
          sameLanguage[locale] ??= {};
          sameLanguage[locale][name] = (sameLanguage[locale][name] ?? 0) + 1;
        }
      }

      // Bundle drift: what shipped must be what we just resolved.
      const shipped = bundle[bundleKey]?.[id];
      if (shipped === undefined) {
        // A prod build legitimately strips prodVisible:false entries.
        if (core.prodVisible === false) continue;
        drift.push(`${name}/${id} [${locale}]: missing from content.${locale}.json`);
        continue;
      }
      const expected = { ...core, ...translation };
      for (const field of authorOnlyFields ?? []) delete expected[field];
      const differing = differingKeys(expected, shipped);
      if (differing.length) {
        drift.push(
          `${name}/${id} [${locale}]: bundle content differs from core + translations/${name}/${used}/${id}.json` +
            ` — ${differing.slice(0, 5).join(', ')}${differing.length > 5 ? `, +${differing.length - 5} more` : ''}`,
        );
      }
    }
  }
}

if (checked === 0 && CHECKED.length > 0) {
  errors.push('0 (collection, entry, locale) combinations checked — nothing was verified.');
}

// ---------------------------------------------------------------------------
// Severity
// ---------------------------------------------------------------------------
for (const line of crossLanguage) {
  errors.push(`CROSS-LANGUAGE fallback (wrong language shipped): ${line}`);
}
for (const line of dropped) {
  errors.push(`Entry resolves to NO translation in any locale and vanishes from the bundle: ${line}`);
}
for (const line of drift) {
  errors.push(`BUNDLE DRIFT: ${line}`);
}

// Baseline comparison for the Easy-Language backlog. A regression here is the one
// finding in this gate that belongs to A11Y-005 ([overridable]); it is collected
// separately so a valid overrides/A11Y-005.md can turn it advisory. Everything else in
// this gate — wrong language, vanished entries, drift, vacuity — is a correctness bug
// no override touches.
const easyRegressions = [];
let backlogTotal = 0;
const easyLocales = ALL_LOCALES.filter(isEasyLocale);
for (const locale of easyLocales) {
  const actual = sameLanguage[locale] ?? {};
  const base = BASELINE[locale] ?? {};
  for (const collection of new Set([...Object.keys(actual), ...Object.keys(base)])) {
    if (SKIPPED.includes(collection)) continue;
    const a = actual[collection] ?? 0;
    const b = base[collection] ?? 0;
    backlogTotal += a;
    if (a > b) {
      easyRegressions.push(
        `Easy-Language coverage REGRESSED: ${locale}/${collection} now falls back ${a} time(s), baseline is ${b}. ` +
          `Restore the translation file, or raise the baseline deliberately in scripts/check-content-coverage.mjs.`,
      );
    } else if (a < b) {
      notes.push(`${locale}/${collection}: ${a} fallbacks, baseline ${b} — lower the baseline to lock the gain in.`);
    }
  }
}

// Non-easy locales falling back within their own language is impossible by
// construction (their chain leaves the language immediately), so any
// same-language fallback recorded for them would be a chain bug.
for (const locale of ALL_LOCALES.filter((l) => !isEasyLocale(l))) {
  if (sameLanguage[locale]) {
    errors.push(`Unexpected same-language fallback for base locale "${locale}" — the chain is wrong.`);
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const LINE = '='.repeat(70);
console.log(LINE);
console.log(`  check-content-coverage — ${checked} (entry x locale) resolutions across ${CHECKED.length} collections`);
if (SKIPPED.length > 0) {
  console.log(`  Skipped (every feature owning them is off in site.json): ${SKIPPED.join(', ')}`);
}
console.log(LINE);
console.log('');
console.log('  Coverage: native file / fallback, per collection x locale');
console.log('  ' + 'collection'.padEnd(16) + ALL_LOCALES.map((l) => l.padStart(14)).join(''));
for (const { name } of CHECKED) {
  const total = entryIdsOf(name).length;
  const cells = ALL_LOCALES.map((l) => {
    const same = sameLanguage[l]?.[name] ?? 0;
    const bib = bibliographic[l]?.[name] ?? 0;
    const cross = crossByCell[l]?.[name] ?? 0;
    const native = total - same - bib - cross;
    // `<-xx` = same-language fallback source; `=xx` = base record by design
    // (bibliographic); `!xx` = CROSS-language (an error).
    const via = same > 0 ? `<-${fallbackChain(l)[1] ?? '?'}` : bib > 0 ? `=${fallbackChain(l)[1] ?? '?'}` : '';
    const bad = cross > 0 ? `!${cross}` : '';
    return `${native}/${total}${via}${bad}`.padStart(14);
  });
  console.log('  ' + name.padEnd(16) + cells.join(''));
}
console.log('');
console.log(`  Easy-Language backlog (same-language fallback): ${backlogTotal} entries`);
for (const name of [...BIBLIOGRAPHIC].filter((n) => !SKIPPED.includes(n))) {
  const perLocale = easyLocales.map((l) => `${l} ${bibliographic[l]?.[name] ?? 0}`).join(', ');
  const n = easyLocales.reduce((sum, l) => sum + (bibliographic[l]?.[name] ?? 0), 0);
  console.log(`  ${name} — bibliographic: ${n} entries use the base record by design (${perLocale})`);
}
console.log(`  Cross-language fallbacks: ${crossLanguage.length}  (must be 0)`);

if (notes.length > 0) {
  console.log('');
  console.log('  Baseline is now pessimistic (coverage improved):');
  for (const n of notes) console.log(`    ${n}`);
}

// A valid overrides/A11Y-005.md turns the backlog regressions advisory (printed, with
// the override's rationale) — never the language errors above.
const stillBlocking = applyOverride('A11Y-005', easyRegressions, { gate: 'check-content-coverage' });
errors.push(...stillBlocking);
const relaxed = easyRegressions.length - stillBlocking.length;

if (errors.length === 0) {
  console.log('');
  console.log(
    `  PASS — no locale serves content from another language` +
      (relaxed ? ` (${relaxed} ADVISORY finding(s) under overrides/A11Y-005.md, see above).` : '.'),
  );
  console.log(LINE);
  process.exit(0);
}

console.error('');
console.error(`  FAIL — ${errors.length} problem(s):`);
for (const e of errors) console.error(`    ${e}`);
console.error('');
console.error('  A locale must never serve content in another language. Easy Language is an');
console.error('  accessibility feature; its readers are the least able to cope with the wrong one.');
console.error(LINE);
process.exit(1);
