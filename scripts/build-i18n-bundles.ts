#!/usr/bin/env node

/**
 * i18n Bundle Build Script
 *
 * Folds the translation modules of each language into a small CORE bundle and
 * a set of lazily loaded CHUNKS, as src/config/i18n-bundles.json decides:
 *
 * Input:  src/assets/i18n/modules/[lang]/*.json
 * Output: src/assets/i18n/i18n.[lang].json          core: { namespaces, chunks, splitParents }
 *         src/assets/i18n/chunks/[lang]/[id].json    one lazy namespace, or one child of a split parent
 *         src/config/easy-language-availability.json  which pages have an Easy-Language preview
 *
 * Why split: every route used to wait for one ~750 KB bundle per language (and
 * the fallback language's bundle downloaded behind it). The shell needs a
 * fraction of that; articles need their own namespace and nothing else. The
 * runtime side is TranslationService (chunk lookup, route preloading via
 * translationReadyGuard, transfer-state replay for hydration).
 *
 * The availability index is committed (the app imports it synchronously and the
 * unit tests run without a build); check-i18n-keys.mjs fails when it is stale.
 *
 * Usage: node scripts/build-i18n-bundles.ts [--prod]
 */

import * as fs from 'fs';
import * as path from 'path';
import { ALL_LOCALES, KEY_SOURCE_LANG } from './lib/locale-fallback.mjs';
import { easyAvailabilityFromModules, readSplitConfig, splitLocale } from './lib/i18n-split.mjs';
import { createFeatureScope } from './lib/feature-scope.mjs';
import { loadFeatureCatalog, loadSiteConfig } from './lib/site-config.mjs';

// ============================================================================
// Configuration
// ============================================================================

// Language list from the single source of truth (src/config/languages.json)
const LANGUAGES: string[] = ALL_LOCALES;

const MODULES_DIR = 'src/assets/i18n/modules';
const OUTPUT_DIR = 'src/assets/i18n';
const CHUNKS_DIR = path.join(OUTPUT_DIR, 'chunks');
const AVAILABILITY_FILE = 'src/config/easy-language-availability.json';

// --prod flag: Strict mode for production builds. Missing language directory
// becomes a hard error instead of a warning, preventing builds that ship
// empty i18n bundles (which would display raw keys to users).
// Passed from package.json build:prod script.
const IS_PROD_BUILD = process.argv.includes('--prod');

// Files to ignore (metadata files)
const IGNORE_FILES = ['_index.json', '_moduleCount.json', '_note.json', '_system.json', '_totalSize.json'];

const SPLIT = readSplitConfig();

// ============================================================================
// Helper Functions
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Read a module file. A parse failure is a HARD ERROR for every locale.
 *
 * This used to `return null` and the caller skipped the module — which meant a
 * broken `modules/de/glossary.json` silently dropped the whole `glossary`
 * namespace out of `i18n.de.json`. The build stayed green, the gap report used
 * `de` as its own reference so it saw nothing, and every German glossary string
 * rendered on screen as its raw key. Only `en` failed loudly, and only by
 * accident (check-i18n-keys.mjs parses the `en` tree without a try/catch).
 */
function readJsonFile(filePath: string): Record<string, unknown> {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Cannot read i18n module ${filePath}: ${(error as Error).message}`);
  }
  if (content.charCodeAt(0) === 0xfeff) content = content.slice(1);
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(
      `Invalid JSON in i18n module ${filePath}\n` +
        `  ${(error as Error).message}\n` +
        `  A module that will not parse drops its ENTIRE namespace from i18n.<lang>.json,\n` +
        `  and every key in it then renders as raw text to the user. Fix the file.`,
    );
  }
}

// ============================================================================
// Main Build Function
// ============================================================================

interface BuiltLocale {
  modules: Record<string, unknown>;
  moduleCount: number;
  coreSize: number;
  chunkCount: number;
  chunkSize: number;
}

function readModules(language: string): Record<string, unknown> | null {
  const langDir = path.join(MODULES_DIR, language);

  if (!fs.existsSync(langDir)) {
    // Prod builds must not ship empty bundles - raw keys would leak to users.
    if (IS_PROD_BUILD) {
      throw new Error(
        `Language directory not found for "${language}": ${langDir}\n` +
          `  Prod builds require a module directory for all ${LANGUAGES.length} configured locales.\n` +
          `  Either create the directory or remove "${language}" from src/config/languages.json.`,
      );
    }
    console.warn(`  Warning: Directory not found for ${language}`);
    return null;
  }

  const modules: Record<string, unknown> = {};
  const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json') && !IGNORE_FILES.includes(f));
  for (const file of files.sort()) {
    // Throws on a parse failure — see readJsonFile. Never skip a module.
    modules[file.replace('.json', '')] = readJsonFile(path.join(langDir, file));
  }
  if (Object.keys(modules).length === 0) {
    throw new Error(
      `No i18n modules found for "${language}" in ${langDir}.\n` + `  An empty bundle renders every key as raw text.`,
    );
  }
  return modules;
}

function buildLocale(language: string): BuiltLocale {
  const modules = readModules(language);
  if (!modules) return { modules: {}, moduleCount: 0, coreSize: 0, chunkCount: 0, chunkSize: 0 };

  const { core, chunks } = splitLocale(modules, SPLIT);

  const corePayload = JSON.stringify({
    namespaces: core,
    chunks: Object.keys(chunks).sort(),
    splitParents: SPLIT.splitChildren,
  });
  fs.writeFileSync(path.join(OUTPUT_DIR, `i18n.${language}.json`), corePayload, 'utf-8');

  const chunkDir = path.join(CHUNKS_DIR, language);
  fs.mkdirSync(chunkDir, { recursive: true });
  let chunkSize = 0;
  for (const [id, data] of Object.entries(chunks)) {
    const json = JSON.stringify(data);
    fs.writeFileSync(path.join(chunkDir, `${id}.json`), json, 'utf-8');
    chunkSize += Buffer.byteLength(json, 'utf-8');
  }

  return {
    modules,
    moduleCount: Object.keys(modules).length,
    coreSize: Buffer.byteLength(corePayload, 'utf-8'),
    chunkCount: Object.keys(chunks).length,
    chunkSize,
  };
}

// ============================================================================
// Translation Gap Check
// ============================================================================

// The key-source language (languages.json `keySourceLanguage`) — the same
// reference check-i18n-keys.mjs uses. This report used to compare against the
// CONTENT reference language (German) while the gate compared against English.
const REFERENCE_LANG: string = KEY_SOURCE_LANG;

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * The gaps of each locale against the key source, counting only what the site uses:
 * keys of features switched off in src/config/site.json and a dev workshop the locale
 * does not carry are no gap (scripts/lib/feature-scope.mjs, the rule check-i18n-keys.mjs
 * applies).
 */
function checkTranslationGaps(bundles: Map<string, Record<string, unknown>>): void {
  const refBundle = bundles.get(REFERENCE_LANG);
  if (!refBundle) return;
  const scope = createFeatureScope(loadFeatureCatalog(), loadSiteConfig().features);

  // Reference keys, full paths (`<module>.<key>`), grouped by module
  const refKeys: string[] = [];
  for (const [mod, data] of Object.entries(refBundle)) {
    refKeys.push(...flattenKeys(data as Record<string, unknown>).map((k) => `${mod}.${k}`));
  }

  // Compare each language
  const gaps: {
    lang: string;
    missing: number;
    required: number;
    byModule: { mod: string; missing: number; absent: boolean }[];
  }[] = [];

  for (const [lang, bundle] of bundles) {
    if (lang === REFERENCE_LANG) continue;
    const present = new Set<string>();
    for (const [mod, data] of Object.entries(bundle)) {
      for (const k of flattenKeys(data as Record<string, unknown>)) present.add(`${mod}.${k}`);
    }
    const { required } = scope.splitKeys(refKeys, present);
    const missingByModule = new Map<string, number>();
    for (const key of required) {
      if (present.has(key)) continue;
      const mod = key.split('.')[0];
      missingByModule.set(mod, (missingByModule.get(mod) ?? 0) + 1);
    }
    const byModule = [...missingByModule].map(([mod, missing]) => ({ mod, missing, absent: !bundle[mod] }));
    const missingCount = byModule.reduce((sum, m) => sum + m.missing, 0);

    if (missingCount > 0) {
      byModule.sort((a, b) => b.missing - a.missing);
      gaps.push({ lang, missing: missingCount, required: required.length, byModule });
    }
  }

  if (gaps.length === 0) return;

  const totalMissing = gaps.reduce((sum, g) => sum + g.missing, 0);

  console.log('='.repeat(70));
  console.log(`  TRANSLATION GAPS (vs ${REFERENCE_LANG.toUpperCase()} reference)`);
  if (scope.offFeatures.length)
    console.log(`  Not counted: the strings of ${scope.offFeatures.join(', ')} (off in site.json)`);
  console.log('='.repeat(70));
  console.log('');

  for (const { lang, missing, required, byModule } of gaps) {
    const pct = ((1 - missing / required) * 100).toFixed(1);
    console.log(`  ${lang.padEnd(12)} ${pct.padStart(5)}%  (${missing} missing keys)`);
    for (const m of byModule) {
      const how = m.absent ? 'no module file' : 'partial';
      console.log(`      ${m.mod.padEnd(26)} ${String(m.missing).padStart(4)}  (${how})`);
    }
  }

  console.log('');
  console.log(`  Total: ${totalMissing} missing keys across ${gaps.length} languages`);
  // A gap is a degradation, never a raw key on screen: TranslationService walks
  // the i18nFallbackChain from src/config/language-rules.mts, so a key the easy
  // bundle lacks renders in the base language instead. check-i18n-keys.mjs is
  // the gate that fails on it; this report only prints.
  console.log(`  Each gap falls back along the i18n fallback chain at runtime; the list is a backlog.`);
  console.log('='.repeat(70));
  console.log('');
}

// ============================================================================
// Main Execution
// ============================================================================

function main(): void {
  console.log('');
  console.log('='.repeat(70));
  console.log('  i18n BUNDLE BUILD');
  console.log('='.repeat(70));
  console.log('');
  console.log('Language     Modules   Core size   Chunks  Chunk size');
  console.log('-'.repeat(56));

  const startTime = Date.now();
  let totalModules = 0;
  let totalCore = 0;
  let totalChunks = 0;
  const allModules = new Map<string, Record<string, unknown>>();

  // Old chunk files of namespaces that are no longer lazy must not linger.
  fs.rmSync(CHUNKS_DIR, { recursive: true, force: true });

  for (const language of LANGUAGES) {
    try {
      const built = buildLocale(language);
      totalModules += built.moduleCount;
      totalCore += built.coreSize;
      totalChunks += built.chunkSize;
      allModules.set(language, built.modules);
      console.log(
        `${language.padEnd(12)} ${String(built.moduleCount).padStart(7)} ${formatFileSize(built.coreSize).padStart(11)} ` +
          `${String(built.chunkCount).padStart(8)} ${formatFileSize(built.chunkSize).padStart(11)}`,
      );
    } catch (error) {
      // Every locale, every build mode. A broken module is not a degradation
      // that falls back at runtime — the namespace disappears and raw keys
      // render. Dev used to swallow this and only `en` happened to be caught
      // downstream, so a broken `de` module could reach a commit unnoticed.
      console.error('');
      console.error(`  ERROR building i18n bundle for "${language}":`);
      console.error(`  ${(error as Error).message}`);
      console.error('');
      process.exit(1);
    }
  }

  // Easy-Language availability index (committed; rewritten only on change).
  const availability = easyAvailabilityFromModules(allModules);
  const availabilityJson = JSON.stringify(availability, null, 2) + '\n';
  const existing = fs.existsSync(AVAILABILITY_FILE) ? fs.readFileSync(AVAILABILITY_FILE, 'utf-8') : '';
  if (existing !== availabilityJson) {
    fs.writeFileSync(AVAILABILITY_FILE, availabilityJson, 'utf-8');
    console.log(`  Updated ${AVAILABILITY_FILE} (${availability.ids.length} pages) — commit it.`);
  }

  console.log('');
  console.log('='.repeat(70));
  console.log('  BUILD SUMMARY');
  console.log('='.repeat(70));
  console.log(`  Languages built:    ${LANGUAGES.length}`);
  console.log(`  Total modules:      ${totalModules}`);
  console.log(`  Core bundles:       ${formatFileSize(totalCore)}`);
  console.log(`  Lazy chunks:        ${formatFileSize(totalChunks)}`);
  console.log(`  Easy previews:      ${availability.ids.length} pages`);
  console.log(`  Build duration:     ${Date.now() - startTime}ms`);
  console.log('');
  console.log(`  Output: i18n.[lang].json + chunks/[lang]/*.json (${LANGUAGES.length} locales)`);
  console.log('='.repeat(70));
  console.log('');

  // Gap check after successful build
  checkTranslationGaps(allModules);
}

main();
