#!/usr/bin/env node

/**
 * Unified Content Aggregation Build Script
 *
 * Aggregates ALL content types into a SINGLE JSON file per language.
 * This reduces HTTP requests from ~8 per language to exactly 1.
 *
 * Output: src/assets/data/content.[lang].json
 *
 * Usage: node scripts/build-unified-content.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { globSync } from 'glob';
// The fallback order is derived from src/config/languages.json — never hardcoded.
// See scripts/lib/locale-fallback.mjs for the rules and why they exist.
import { ALL_LOCALES, fallbackChain, isCrossLanguage } from './lib/locale-fallback.mjs';

// Language list - Single Source of Truth (src/config/languages.json via the shared
// language rules in scripts/lib/locale-fallback.mjs)
const ALL_LANGUAGES: string[] = ALL_LOCALES;

// ============================================================================
// Types
// ============================================================================

interface RelatedRefs {
  articles?: string[];
  glossary?: string[];
  timeline?: string[];
  demos?: string[];
}

interface ArticleMeta {
  id: string;
  pageId: string;
  created: string;
  updated: string;
  toolReferences: string[];
  resourceReferences: string[];
  sourceReferences: string[];
  related?: RelatedRefs;
}

interface UnifiedBundle {
  meta: {
    language: string;
    version: string;
    generatedAt: string;
    checksum: string;
    entryCounts: Record<string, number>;
  };
  glossary: Record<string, unknown>;
  timeline: Record<string, unknown>;
  aiTools: Record<string, unknown>;
  aiResources: Record<string, unknown>;
  catalog: Record<string, unknown>;
  sources: Record<string, unknown>;
  achievements: Record<string, unknown>;
  articleMeta: Record<string, ArticleMeta>;
  // Additional metadata
  sourcesChapters?: unknown[];
  sourcesReferences?: Record<string, unknown>;
}

interface ContentTypeConfig {
  name: string;
  bundleKey: keyof UnifiedBundle;
  corePath: string;
  translationsPath: string;
  additionalFiles?: { key: string; path: string }[];
  /**
   * Fields that live in the source files for authors and reviewers but must not
   * ship in the runtime bundle. Removed from the merged entry (core and
   * translation alike) before it is written.
   */
  authorOnlyFields?: string[];
}

// ============================================================================
// Configuration
// ============================================================================

const CONTENT_TYPES: ContentTypeConfig[] = [
  {
    name: 'glossary',
    bundleKey: 'glossary',
    corePath: 'src/assets/data/core/glossary',
    translationsPath: 'src/assets/data/translations/glossary',
  },
  {
    name: 'timeline',
    bundleKey: 'timeline',
    corePath: 'src/assets/data/core/timeline',
    translationsPath: 'src/assets/data/translations/timeline',
  },
  {
    name: 'ai-tools',
    bundleKey: 'aiTools',
    corePath: 'src/assets/data/core/ai-tools',
    translationsPath: 'src/assets/data/translations/ai-tools',
  },
  {
    name: 'ai-resources',
    bundleKey: 'aiResources',
    corePath: 'src/assets/data/core/ai-resources',
    translationsPath: 'src/assets/data/translations/ai-resources',
  },
  {
    name: 'sources',
    bundleKey: 'sources',
    corePath: 'src/assets/data/core/sources',
    translationsPath: 'src/assets/data/translations/sources',
    additionalFiles: [
      { key: 'sourcesChapters', path: 'src/assets/data/core/sources/chapters.json' },
      { key: 'sourcesReferences', path: 'src/assets/data/core/sources/references.json' },
    ],
    // `evidence` ({ claim, quote, locator? }[]) is the verbatim proof behind each
    // claim, kept next to the record for review (docs/how-to/add-a-source.md,
    // step 4). No page reads it, and the quotes are third-party text, so it
    // stays out of content.<lang>.json.
    authorOnlyFields: ['evidence'],
  },
];

// Language list from central config
const LANGUAGES = ALL_LANGUAGES;

const OUTPUT_DIR = 'dist-content';
const ASSETS_DIR = 'src/assets/data';
const VERSION = '2.0.0';

// ============================================================================
// Helper Functions
// ============================================================================

function readJsonFile(filePath: string): unknown {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${filePath} - ${(error as Error).message}`);
  }
}

function writeJsonFile(filePath: string, data: unknown): void {
  const content = JSON.stringify(data);
  fs.writeFileSync(filePath, content, 'utf-8');
}

function calculateChecksum(data: unknown): string {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(data));
  return `sha256:${hash.digest('hex').substring(0, 16)}`;
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function getEntryIdsFromIndex(corePath: string): string[] {
  const indexPath = path.join(corePath, 'index.json');
  if (!fs.existsSync(indexPath)) {
    const files = globSync(`${corePath}/*.json`.replace(/\\/g, '/'));
    return files.map((f) => path.basename(f, '.json')).filter((id) => id !== 'index' && id !== 'chapters');
  }
  return readJsonFile(indexPath) as string[];
}

// ============================================================================
// Content Type Builders
// ============================================================================

// Prod-Visibility-Gate (Glossar/Timeline-Erweiterung, 2026-06-22).
// Items mit `prodVisible: false` im Core sind NUR im Dev-Bundle — im
// Production-Build (`--prod`, gesetzt von prebuild:prod via content:build:prod)
// werden sie aus ALLEN Sprach-Bundles gestrippt. Zweck: neu angelegte, noch
// nicht in alle 56 Varianten übersetzte Begriffe/Events können gefahrlos im
// Repo liegen + auf dem Dev-Server sichtbar sein, ohne halbfertig auf Prod zu
// landen. Default (Feld fehlt) = sichtbar. Sobald die Übersetzung steht → Flag
// entfernen.
const IS_PROD = process.argv.includes('--prod');

/**
 * One resolved translation lookup. `usedLocale === null` means no file was
 * found anywhere in the chain and the entry was dropped from the bundle.
 */
interface FallbackRecord {
  collection: string;
  entryId: string;
  locale: string;
  usedLocale: string | null;
  crossLanguage: boolean;
}

function buildContentType(
  config: ContentTypeConfig,
  language: string,
  fallbacks: FallbackRecord[],
): { entries: Record<string, unknown>; count: number } {
  const entryIds = getEntryIdsFromIndex(config.corePath);
  const entries: Record<string, unknown> = {};
  const chain = fallbackChain(language);

  for (const entryId of entryIds) {
    const coreFilePath = path.join(config.corePath, `${entryId}.json`);
    if (!fs.existsSync(coreFilePath)) continue;

    const core = readJsonFile(coreFilePath) as Record<string, unknown>;

    // Prod-Strip: nicht-prod-sichtbare Items kommen im Prod-Bundle gar nicht erst
    // vor (kein Eintrag in glossary/timeline/… → Listenseite, Suche, Highlighting
    // und Concept-Map sehen sie auf Prod nicht). Dev-Build behält sie.
    if (IS_PROD && core['prodVisible'] === false) continue;

    // Translation with LOCALE-AWARE fallback chain.
    //
    // The chain used to be hardcoded `<lang>` -> `de` -> `en`, which meant
    // `en-easy` tried GERMAN before English and won every time an `en-easy`
    // file was missing: 134 of 181 entries in content.en-easy.json shipped as
    // German text to Easy-Language readers. fallbackChain() derives the order
    // from src/config/languages.json instead, so an easy variant always reaches
    // its own base language first and adding a locale cannot bring the bug back.
    let translation: Record<string, unknown> | null = null;
    let usedLocale: string | null = null;
    for (const candidate of chain) {
      const candidatePath = path.join(config.translationsPath, candidate, `${entryId}.json`);
      if (!fs.existsSync(candidatePath)) continue;
      translation = readJsonFile(candidatePath) as Record<string, unknown>;
      usedLocale = candidate;
      break;
    }

    if (usedLocale !== language) {
      fallbacks.push({
        collection: config.name,
        entryId,
        locale: language,
        usedLocale,
        crossLanguage: usedLocale === null || isCrossLanguage(language, usedLocale),
      });
    }

    if (!translation) continue;

    const entry: Record<string, unknown> = { ...core, ...translation };
    for (const field of config.authorOnlyFields ?? []) delete entry[field];
    entries[entryId] = entry;
  }

  return { entries, count: Object.keys(entries).length };
}

function buildAchievements(language: string): { entries: Record<string, unknown>; count: number } {
  const achievementsPath = 'src/assets/data/achievements';
  const indexPath = path.join(achievementsPath, 'index.json');

  if (!fs.existsSync(indexPath)) {
    return { entries: {}, count: 0 };
  }

  const achievementIds = readJsonFile(indexPath) as string[];
  const entries: Record<string, unknown> = {};

  for (const id of achievementIds) {
    const filePath = path.join(achievementsPath, `${id}.json`);
    if (!fs.existsSync(filePath)) continue;

    const achievement = readJsonFile(filePath) as Record<string, unknown>;

    // Load external translation if exists
    const translationPath = path.join(achievementsPath, 'translations', language, `${id}.json`);
    if (fs.existsSync(translationPath)) {
      const translation = readJsonFile(translationPath) as Record<string, unknown>;
      const translations = (achievement['translations'] as Record<string, unknown>) || {};
      translations[language] = translation;
      achievement['translations'] = translations;
    }

    entries[id] = achievement;
  }

  return { entries, count: Object.keys(entries).length };
}

function buildArticleMeta(): { entries: Record<string, ArticleMeta>; count: number } {
  const articlesPath = 'src/assets/data/core/articles';

  if (!fs.existsSync(articlesPath)) {
    return { entries: {}, count: 0 };
  }

  // Scan all .json files in articles folder EXCEPT index.json
  // index.json contains hub metadata (full objects for ArticlesService)
  // Individual files like ki-ethik-praxis.json contain tool/resource references
  const articleRefFiles = fs
    .readdirSync(articlesPath)
    .filter((file) => file.endsWith('.json') && file !== 'index.json');

  const entries: Record<string, ArticleMeta> = {};

  for (const fileName of articleRefFiles) {
    const filePath = path.join(articlesPath, fileName);
    const id = fileName.replace('.json', '');

    try {
      const article = readJsonFile(filePath) as ArticleMeta;
      // Only include if it has the expected structure (toolReferences/resourceReferences/sourceReferences)
      if (article && (article.toolReferences || article.resourceReferences || article.sourceReferences)) {
        // Ensure sourceReferences exists (backwards compatibility)
        if (!article.sourceReferences) {
          article.sourceReferences = [];
        }
        entries[id] = article;
      }
    } catch {
      // Skip files that can't be parsed
    }
  }

  return { entries, count: Object.keys(entries).length };
}

// ============================================================================
// Main Build
// ============================================================================

function buildUnifiedBundle(language: string): {
  bundle: UnifiedBundle;
  fileSize: number;
  fallbacks: FallbackRecord[];
} {
  const entryCounts: Record<string, number> = {};
  const fallbacks: FallbackRecord[] = [];

  // Build all content types
  const glossaryResult = buildContentType(CONTENT_TYPES[0], language, fallbacks);
  const timelineResult = buildContentType(CONTENT_TYPES[1], language, fallbacks);
  const aiToolsResult = buildContentType(CONTENT_TYPES[2], language, fallbacks);
  const aiResourcesResult = buildContentType(CONTENT_TYPES[3], language, fallbacks);
  const sourcesResult = buildContentType(CONTENT_TYPES[4], language, fallbacks);
  const achievementsResult = buildAchievements(language);
  const articleMetaResult = buildArticleMeta();

  // Build catalog: virtual merge of aiTools + aiResources with entryType discriminator
  const catalogEntries: Record<string, unknown> = {};
  for (const [id, tool] of Object.entries(aiToolsResult.entries)) {
    catalogEntries[`tool-${id}`] = { ...(tool as Record<string, unknown>), entryType: 'tool' };
  }
  for (const [id, resource] of Object.entries(aiResourcesResult.entries)) {
    catalogEntries[`rsrc-${id}`] = { ...(resource as Record<string, unknown>), entryType: 'resource' };
  }

  entryCounts['glossary'] = glossaryResult.count;
  entryCounts['timeline'] = timelineResult.count;
  entryCounts['aiTools'] = aiToolsResult.count;
  entryCounts['aiResources'] = aiResourcesResult.count;
  entryCounts['catalog'] = Object.keys(catalogEntries).length;
  entryCounts['sources'] = sourcesResult.count;
  entryCounts['achievements'] = achievementsResult.count;
  entryCounts['articleMeta'] = articleMetaResult.count;

  const bundle: UnifiedBundle = {
    meta: {
      language,
      version: VERSION,
      generatedAt: new Date().toISOString(),
      checksum: '', // Will be set after
      entryCounts,
    },
    glossary: glossaryResult.entries,
    timeline: timelineResult.entries,
    aiTools: aiToolsResult.entries,
    aiResources: aiResourcesResult.entries,
    catalog: catalogEntries,
    sources: sourcesResult.entries,
    achievements: achievementsResult.entries,
    articleMeta: articleMetaResult.entries,
  };

  // Add chapters and references for sources
  const chaptersPath = 'src/assets/data/core/sources/chapters.json';
  if (fs.existsSync(chaptersPath)) {
    const chaptersData = readJsonFile(chaptersPath) as Record<string, unknown>;
    bundle.sourcesChapters = (chaptersData['chapters'] as unknown[]) || [];
  }

  const referencesPath = 'src/assets/data/core/sources/references.json';
  if (fs.existsSync(referencesPath)) {
    bundle.sourcesReferences = readJsonFile(referencesPath) as Record<string, unknown>;
  }

  // Calculate checksum
  bundle.meta.checksum = calculateChecksum(bundle);

  // Write files
  const outputPath = path.join(OUTPUT_DIR, `content.${language}.json`);
  const assetsPath = path.join(ASSETS_DIR, `content.${language}.json`);

  writeJsonFile(outputPath, bundle);
  writeJsonFile(assetsPath, bundle);

  const fileSize = fs.statSync(outputPath).size;

  return { bundle, fileSize, fallbacks };
}

/**
 * Auto-populate references.json portal entries from declarative `sourceReferences`
 * in article meta (core/articles/<id>.json) AND demo entries (core/demos/index.json).
 * The declaration lives with the content; references.json portal[] is the derived
 * index, kept in sync here. Only auto-managed types ('article', 'demo') are touched —
 * hand-curated 'book' refs and other portal types are preserved.
 */
function autoPopulateSourceReferences(): void {
  const referencesPath = 'src/assets/data/core/sources/references.json';
  if (!fs.existsSync(referencesPath)) return;

  const references = readJsonFile(referencesPath) as Record<
    string,
    { book: string[]; portal: { type: string; id: string }[] }
  >;
  const articleMetaResult = buildArticleMeta();

  // Clear existing auto-populated portal references ('article' + 'demo') to rebuild
  // fresh. `curatedCount` remembers how many hand-curated entries survived per
  // source, so the auto-appended tail can be sorted below without disturbing them.
  const curatedCount: Record<string, number> = {};
  for (const sourceId of Object.keys(references)) {
    if (references[sourceId].portal) {
      references[sourceId].portal = references[sourceId].portal.filter(
        (p) => p.type !== 'article' && p.type !== 'demo',
      );
    }
    curatedCount[sourceId] = references[sourceId].portal?.length ?? 0;
  }

  // Helper: link a source -> portal content, guarding against unknown source ids
  const link = (sourceId: string, type: 'article' | 'demo', contentId: string): void => {
    if (!references[sourceId]) {
      console.warn(`  ⚠ ${type} '${contentId}' references unknown source '${sourceId}' (skipped)`);
      return;
    }
    if (!references[sourceId].portal) references[sourceId].portal = [];
    const exists = references[sourceId].portal.some((p) => p.type === type && p.id === contentId);
    if (!exists) references[sourceId].portal.push({ type, id: contentId });
  };

  // Add portal references from article sourceReferences
  for (const [articleId, meta] of Object.entries(articleMetaResult.entries)) {
    for (const sourceId of meta.sourceReferences || []) link(sourceId, 'article', articleId);
  }

  // Add portal references from demo sourceReferences (core/demos/index.json)
  const demosIndexPath = 'src/assets/data/core/demos/index.json';
  if (fs.existsSync(demosIndexPath)) {
    const demosIndex = readJsonFile(demosIndexPath) as unknown;
    type DemoRef = { id?: string; sourceReferences?: string[] };
    const demos: DemoRef[] = Array.isArray(demosIndex)
      ? (demosIndex as DemoRef[])
      : (demosIndex as { demos?: DemoRef[] })?.demos || [];
    for (const demo of demos) {
      if (!demo?.id) continue;
      for (const sourceId of demo.sourceReferences || []) {
        link(sourceId, 'demo', demo.id);
      }
    }
  }

  // Sort the auto-appended tail per source. Without this the order follows whatever
  // order the article meta and demo index happen to iterate in, so a rebuild after
  // an unrelated content change reshuffles entries and dirties the checked-in file.
  for (const sourceId of Object.keys(references)) {
    const portal = references[sourceId].portal;
    if (!portal) continue;
    const head = portal.slice(0, curatedCount[sourceId] ?? 0);
    const tail = portal.slice(curatedCount[sourceId] ?? 0);
    tail.sort((a, b) => a.type.localeCompare(b.type) || a.id.localeCompare(b.id));
    references[sourceId].portal = [...head, ...tail];
  }

  // Write updated references.json. Trailing newline: the file is checked in, and
  // without it every build leaves the tree dirty against the editor-written source.
  const content = JSON.stringify(references, null, 2) + '\n';
  fs.writeFileSync(referencesPath, content, 'utf-8');

  const articleLinked = Object.values(references).filter((r) => r.portal?.some((p) => p.type === 'article')).length;
  const demoLinked = Object.values(references).filter((r) => r.portal?.some((p) => p.type === 'demo')).length;
  console.log(`  Auto-populated references.json: ${articleLinked} sources linked to articles, ${demoLinked} to demos`);
}

/**
 * Strict validator: every `entry.related.<type>[*]` ID must resolve to a real
 * entry of `<type>`. Fails the build on dangling refs. Runs once over the
 * language-neutral core JSONs (articles, glossary, timeline, demos).
 */
function validateRelatedRefs(): void {
  const readDir = (dir: string) =>
    fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter((f) => f.endsWith('.json') && f !== 'index.json')
          .map((f) => readJsonFile(path.join(dir, f)) as Record<string, unknown>)
      : [];

  const articles = readDir('src/assets/data/core/articles');
  const glossary = readDir('src/assets/data/core/glossary');
  const timeline = readDir('src/assets/data/core/timeline');
  const demos = (readJsonFile('src/assets/data/core/demos/index.json') as Record<string, unknown>[]) ?? [];

  const ids: Record<string, Set<string>> = {
    articles: new Set(articles.map((a) => a['id'] as string)),
    glossary: new Set(glossary.map((g) => g['id'] as string)),
    timeline: new Set(timeline.map((t) => t['id'] as string)),
    demos: new Set(demos.map((d) => d['id'] as string)),
  };

  const sources = [
    { type: 'articles', entries: articles },
    { type: 'glossary', entries: glossary },
    { type: 'timeline', entries: timeline },
    { type: 'demos', entries: demos },
  ];

  const dangling: string[] = [];
  let total = 0;
  for (const { type: src, entries } of sources) {
    for (const entry of entries) {
      const refs = entry['related'] as RelatedRefs | undefined;
      if (!refs) continue;
      for (const t of ['articles', 'glossary', 'timeline', 'demos'] as const) {
        const arr = refs[t];
        if (!Array.isArray(arr)) continue;
        for (const id of arr) {
          total++;
          if (!ids[t].has(id)) {
            dangling.push(`  ${src}/${entry['id']} → related.${t}: ${id}`);
          }
        }
      }
    }
  }

  console.log(`  Validated ${total} related-refs.`);
  if (dangling.length > 0) {
    console.error(`\n  ${dangling.length} DANGLING related-refs:`);
    for (const d of dangling) console.error(d);
    throw new Error(
      `${dangling.length} dangling related-refs — fix the source JSONs or run scripts/validate-related-refs.mjs --prune`,
    );
  }
}

function buildAll(): void {
  console.log('');
  console.log('='.repeat(70));
  console.log('  UNIFIED CONTENT AGGREGATION BUILD');
  console.log('='.repeat(70));
  console.log('');

  const overallStart = Date.now();
  ensureDir(OUTPUT_DIR);

  // Strict cross-ref validation — fails the build on dangling related-refs.
  // Core JSONs are language-neutral, so this runs once.
  validateRelatedRefs();

  // Auto-populate references.json before building bundles
  autoPopulateSourceReferences();

  let totalSize = 0;
  let totalEntries = 0;
  const allFallbacks: FallbackRecord[] = [];

  console.log('Language'.padEnd(12) + 'Entries'.padStart(8) + 'Size'.padStart(12) + 'Time'.padStart(10));
  console.log('-'.repeat(42));

  for (const language of LANGUAGES) {
    const startTime = Date.now();

    try {
      const { bundle, fileSize, fallbacks } = buildUnifiedBundle(language);
      allFallbacks.push(...fallbacks);
      const duration = Date.now() - startTime;
      const entries = Object.values(bundle.meta.entryCounts).reduce((a, b) => a + b, 0);

      console.log(
        language.padEnd(12) +
          entries.toString().padStart(8) +
          formatFileSize(fileSize).padStart(12) +
          `${duration}ms`.padStart(10),
      );

      totalSize += fileSize;
      totalEntries += entries;
    } catch (error) {
      console.error(`${language}: ERROR - ${(error as Error).message}`);
    }
  }

  // ---------------------------------------------------------------------
  // Locale fallback report
  //
  // Two kinds of fallback, and they are NOT the same severity:
  //   * within-language ("en-easy" served from "en") is a known, measured
  //     Easy-Language backlog — the reader still gets their own language.
  //   * CROSS-LANGUAGE ("en-easy" served from "de") ships text in a language
  //     the reader did not ask for. That was bug D1, and it shipped silently
  //     because nothing printed and nothing checked. It is loud now, and
  //     scripts/check-content-coverage.mjs fails the build on it.
  // ---------------------------------------------------------------------
  const crossLang = allFallbacks.filter((f) => f.crossLanguage);
  const withinLang = allFallbacks.filter((f) => !f.crossLanguage);

  console.log('');
  console.log('='.repeat(70));
  console.log('  LOCALE FALLBACK REPORT');
  console.log('='.repeat(70));

  const byLocale = new Map<string, Map<string, number>>();
  for (const f of withinLang) {
    const key = `${f.locale} <- ${f.usedLocale}`;
    if (!byLocale.has(key)) byLocale.set(key, new Map());
    const m = byLocale.get(key)!;
    m.set(f.collection, (m.get(f.collection) ?? 0) + 1);
  }
  if (byLocale.size === 0) {
    console.log('  Same-language fallbacks: none — every locale has a native file everywhere.');
  } else {
    console.log(`  Same-language fallbacks (backlog, not an error): ${withinLang.length}`);
    for (const [key, mods] of [...byLocale].sort()) {
      const detail = [...mods]
        .sort()
        .map(([c, n]) => `${c}:${n}`)
        .join(', ');
      console.log(
        `    ${key.padEnd(22)} ${String([...mods.values()].reduce((a, b) => a + b, 0)).padStart(4)}  (${detail})`,
      );
    }
  }

  if (crossLang.length > 0) {
    console.warn('');
    console.warn(`  !! ${crossLang.length} CROSS-LANGUAGE fallback(s) — content in the WRONG LANGUAGE:`);
    for (const f of crossLang) {
      const to = f.usedLocale === null ? 'NOTHING (entry dropped from the bundle)' : f.usedLocale;
      console.warn(`     ${f.collection}/${f.entryId}  [${f.locale}] <- ${to}`);
    }
    console.warn('  Add the missing translation file, or accept a build failure in');
    console.warn('  scripts/check-content-coverage.mjs — this must not ship silently.');
  }
  console.log('='.repeat(70));

  const overallDuration = Date.now() - overallStart;

  console.log('');
  console.log('='.repeat(70));
  console.log('  BUILD SUMMARY');
  console.log('='.repeat(70));
  console.log(`  Languages built:    ${LANGUAGES.length}`);
  console.log(`  Total entries:      ${totalEntries}`);
  console.log(`  Total size:         ${formatFileSize(totalSize)}`);
  console.log(`  Build duration:     ${overallDuration}ms`);
  console.log('');
  console.log(`  Output: content.[lang].json (${LANGUAGES.length} files)`);
  console.log('='.repeat(70));
  console.log('');
}

// ============================================================================
// Entry Point
// ============================================================================

try {
  buildAll();
} catch (error) {
  console.error('BUILD FAILED');
  console.error((error as Error).message);
  process.exit(1);
}
