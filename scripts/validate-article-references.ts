#!/usr/bin/env node

/**
 * Article Reference Validation Script
 *
 * Validates that all tool and resource references in article metadata
 * actually exist in the ai-tools and ai-resources indexes.
 *
 * This script is run as part of the build process and will fail the build
 * if any invalid references are found.
 *
 * Usage: node scripts/validate-article-references.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// Types
// ============================================================================

/**
 * Article metadata with tool/resource references
 * (stored in individual article JSON files like ki-ethik-praxis.json)
 */
interface ArticleRefMeta {
  id: string;
  pageId: string;
  created: string;
  updated: string;
  toolReferences: string[];
  resourceReferences: string[];
  sourceReferences: string[];
}

interface ValidationError {
  articleId: string;
  type: 'tool' | 'resource' | 'source';
  referenceId: string;
  suggestions: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  stats: {
    articlesChecked: number;
    toolReferencesChecked: number;
    resourceReferencesChecked: number;
    sourceReferencesChecked: number;
  };
}

// ============================================================================
// Configuration
// ============================================================================

const ARTICLES_PATH = 'src/assets/data/core/articles';
const AI_TOOLS_PATH = 'src/assets/data/core/ai-tools';
const AI_RESOURCES_PATH = 'src/assets/data/core/ai-resources';
const SOURCES_PATH = 'src/assets/data/core/sources';

// ============================================================================
// Helper Functions
// ============================================================================

function readJsonFile<T>(filePath: string): T {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xfeff) {
      content = content.slice(1);
    }
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(`Failed to read JSON file: ${filePath} - ${(error as Error).message}`);
  }
}

function findSimilar(needle: string, haystack: string[], maxResults = 3): string[] {
  // Simple substring matching for suggestions
  const matches = haystack.filter(
    (item) => item.toLowerCase().includes(needle.toLowerCase()) || needle.toLowerCase().includes(item.toLowerCase()),
  );

  // If no substring matches, try Levenshtein-like simple matching
  if (matches.length === 0) {
    const scored = haystack.map((item) => ({
      item,
      score: calculateSimilarity(needle.toLowerCase(), item.toLowerCase()),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored
      .slice(0, maxResults)
      .filter((s) => s.score > 0.3)
      .map((s) => s.item);
  }

  return matches.slice(0, maxResults);
}

function calculateSimilarity(a: string, b: string): number {
  // Simple character overlap ratio
  const aChars = new Set(a.split(''));
  const bChars = new Set(b.split(''));
  let overlap = 0;
  aChars.forEach((char) => {
    if (bChars.has(char)) overlap++;
  });
  return overlap / Math.max(aChars.size, bChars.size);
}

// ============================================================================
// Validation
// ============================================================================

function validateArticleReferences(): ValidationResult {
  const errors: ValidationError[] = [];
  let articlesChecked = 0;
  let toolReferencesChecked = 0;
  let resourceReferencesChecked = 0;
  let sourceReferencesChecked = 0;

  // Check if articles folder exists
  if (!fs.existsSync(ARTICLES_PATH)) {
    console.log('  No article metadata folder found. Skipping validation.');
    return {
      valid: true,
      errors: [],
      stats: { articlesChecked: 0, toolReferencesChecked: 0, resourceReferencesChecked: 0, sourceReferencesChecked: 0 },
    };
  }

  // Load tool, resource, and source indexes
  const toolIndex = readJsonFile<string[]>(path.join(AI_TOOLS_PATH, 'index.json'));
  const resourceIndex = readJsonFile<string[]>(path.join(AI_RESOURCES_PATH, 'index.json'));
  const sourceIndex = fs.existsSync(path.join(SOURCES_PATH, 'index.json'))
    ? readJsonFile<string[]>(path.join(SOURCES_PATH, 'index.json'))
    : [];

  const toolSet = new Set(toolIndex);
  const resourceSet = new Set(resourceIndex);
  const sourceSet = new Set(sourceIndex);

  // Find all article reference files (*.json except index.json)
  // These are individual files like ki-ethik-praxis.json that contain toolReferences
  const articleRefFiles = fs
    .readdirSync(ARTICLES_PATH)
    .filter((file) => file.endsWith('.json') && file !== 'index.json');

  if (articleRefFiles.length === 0) {
    console.log('  No article reference files found. Skipping validation.');
    return {
      valid: true,
      errors: [],
      stats: { articlesChecked: 0, toolReferencesChecked: 0, resourceReferencesChecked: 0, sourceReferencesChecked: 0 },
    };
  }

  // Validate each article reference file
  for (const fileName of articleRefFiles) {
    const articlePath = path.join(ARTICLES_PATH, fileName);
    const articleId = fileName.replace('.json', '');

    try {
      const article = readJsonFile<ArticleRefMeta>(articlePath);
      articlesChecked++;

      // Validate tool references
      for (const toolId of article.toolReferences || []) {
        toolReferencesChecked++;
        if (!toolSet.has(toolId)) {
          errors.push({
            articleId,
            type: 'tool',
            referenceId: toolId,
            suggestions: findSimilar(toolId, toolIndex),
          });
        }
      }

      // Validate resource references
      for (const resourceId of article.resourceReferences || []) {
        resourceReferencesChecked++;
        if (!resourceSet.has(resourceId)) {
          errors.push({
            articleId,
            type: 'resource',
            referenceId: resourceId,
            suggestions: findSimilar(resourceId, resourceIndex),
          });
        }
      }

      // Validate source references
      for (const sourceId of article.sourceReferences || []) {
        sourceReferencesChecked++;
        if (!sourceSet.has(sourceId)) {
          errors.push({
            articleId,
            type: 'source',
            referenceId: sourceId,
            suggestions: findSimilar(sourceId, sourceIndex),
          });
        }
      }
    } catch {
      console.warn(`  Warning: Could not parse article reference file: ${fileName}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    stats: {
      articlesChecked,
      toolReferencesChecked,
      resourceReferencesChecked,
      sourceReferencesChecked,
    },
  };
}

// ============================================================================
// Source records
// ============================================================================

/**
 * The fields of a core source record (src/assets/data/core/sources/<id>.json)
 * this script type-checks. The title lives in the translation files.
 */
interface SourceRecord {
  id?: unknown;
  year?: unknown;
  doi?: unknown;
  evidence?: unknown;
}

/** Keys an evidence entry may carry: `claim` and `quote` required, `locator` optional. */
const EVIDENCE_KEYS = new Set(['claim', 'quote', 'locator']);

/** A four-digit year as a string, or null for a source that states no date. */
const YEAR_RE = /^\d{4}$/;

/** A DOI is `10.<registrant>/<suffix>`; stored bare, without a https://doi.org/ prefix. */
const DOI_RE = /^10\.\d{4,9}\/\S+$/;

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/**
 * Check the shape of one source record. Pure, so it can be exercised without files.
 * Returns human-readable problems, empty when the record is fine.
 */
function checkSourceRecord(fileId: string, record: SourceRecord): string[] {
  const problems: string[] = [];

  if (record.id !== fileId) {
    problems.push(`id ${JSON.stringify(record.id)} does not match its file name "${fileId}.json"`);
  }

  // year: "2024", or null when the source itself states no date. A display
  // string like "n.d." belongs to the citation formatter, not to the data.
  if (record.year !== null && !(typeof record.year === 'string' && YEAR_RE.test(record.year))) {
    problems.push(`year ${JSON.stringify(record.year)} must be a four-digit string or null (no date stated)`);
  }

  if (record.doi !== undefined && record.doi !== '') {
    if (typeof record.doi !== 'string' || !DOI_RE.test(record.doi)) {
      problems.push(`doi ${JSON.stringify(record.doi)} must be empty or a bare DOI ("10.xxxx/...")`);
    }
  }

  if (record.evidence !== undefined) {
    if (!Array.isArray(record.evidence)) {
      problems.push('evidence must be an array of { claim, quote, locator? }');
    } else {
      record.evidence.forEach((entry: unknown, i: number) => {
        const at = `evidence[${i}]`;
        if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
          problems.push(`${at} must be an object { claim, quote, locator? }`);
          return;
        }
        const e = entry as Record<string, unknown>;
        if (!isNonEmptyString(e['claim'])) problems.push(`${at}.claim must be a non-empty string`);
        if (!isNonEmptyString(e['quote'])) problems.push(`${at}.quote must be a non-empty string (verbatim)`);
        if (e['locator'] !== undefined && !isNonEmptyString(e['locator'])) {
          problems.push(`${at}.locator, when present, must be a non-empty string`);
        }
        for (const key of Object.keys(e)) {
          if (!EVIDENCE_KEYS.has(key)) problems.push(`${at} has unknown key "${key}"`);
        }
      });
    }
  }

  return problems;
}

/** Every record the sources index lists, checked. Returns "<id>: <problem>" lines. */
function validateSourceRecords(): { checked: number; evidence: number; problems: string[] } {
  const indexPath = path.join(SOURCES_PATH, 'index.json');
  if (!fs.existsSync(indexPath)) return { checked: 0, evidence: 0, problems: [] };

  const problems: string[] = [];
  let checked = 0;
  let evidence = 0;
  for (const id of readJsonFile<string[]>(indexPath)) {
    const recordPath = path.join(SOURCES_PATH, `${id}.json`);
    if (!fs.existsSync(recordPath)) {
      problems.push(`${id}: listed in sources/index.json but ${id}.json does not exist`);
      continue;
    }
    const record = readJsonFile<SourceRecord>(recordPath);
    checked++;
    if (Array.isArray(record.evidence)) evidence += record.evidence.length;
    for (const problem of checkSourceRecord(id, record)) problems.push(`${id}: ${problem}`);
  }
  return { checked, evidence, problems };
}

/** Known-bad records must be caught and a known-good one must pass, or the check is decoration. */
function selftest(): void {
  const cases: Array<[string, SourceRecord, boolean]> = [
    ['good', { id: 'good', year: '2024', doi: '10.48550/arXiv.2402.09171' }, true],
    ['undated', { id: 'undated', year: null, doi: '' }, true],
    [
      'with-evidence',
      { id: 'with-evidence', year: '2020', evidence: [{ claim: 'c', quote: 'q', locator: 'p. 3' }] },
      true,
    ],
    ['n-d-string', { id: 'n-d-string', year: 'n.d.' }, false],
    ['numeric-year', { id: 'numeric-year', year: 2024 }, false],
    ['url-doi', { id: 'url-doi', year: '2024', doi: 'https://doi.org/10.1/x' }, false],
    ['evidence-object', { id: 'evidence-object', year: '2024', evidence: { claim: 'c', quote: 'q' } }, false],
    ['empty-quote', { id: 'empty-quote', year: '2024', evidence: [{ claim: 'c', quote: ' ' }] }, false],
    ['stray-key', { id: 'stray-key', year: '2024', evidence: [{ claim: 'c', quote: 'q', page: 3 }] }, false],
    ['wrong-id', { id: 'other', year: '2024' }, false],
  ];
  let failed = 0;
  for (const [fileId, record, shouldPass] of cases) {
    const passed = checkSourceRecord(fileId, record).length === 0;
    const ok = passed === shouldPass;
    if (!ok) failed++;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${fileId} (${shouldPass ? 'should pass' : 'should be rejected'})`);
  }
  console.log(failed ? `\n  selftest FAILED (${failed})` : '\n  selftest passed');
  process.exit(failed ? 1 : 0);
}

// ============================================================================
// Main
// ============================================================================

function main(): void {
  if (process.argv.includes('--selftest')) selftest();

  console.log('');
  console.log('='.repeat(70));
  console.log('  ARTICLE REFERENCE VALIDATION');
  console.log('='.repeat(70));
  console.log('');

  const result = validateArticleReferences();
  const sources = validateSourceRecords();

  console.log(`  Articles checked:           ${result.stats.articlesChecked}`);
  console.log(`  Tool references checked:    ${result.stats.toolReferencesChecked}`);
  console.log(`  Resource references checked: ${result.stats.resourceReferencesChecked}`);
  console.log(`  Source references checked:  ${result.stats.sourceReferencesChecked}`);
  console.log(`  Source records checked:     ${sources.checked} (${sources.evidence} evidence entries)`);
  console.log('');

  if (sources.problems.length > 0) {
    console.log('  ✗ SOURCE RECORD VALIDATION FAILED');
    console.log('');
    for (const problem of sources.problems) console.log(`  ${problem}`);
    console.log('');
    console.log('  Fix: see docs/how-to/add-a-source.md for the record format.');
    console.log('');
    console.log('='.repeat(70));
    console.log('');
    process.exit(1);
  }

  if (result.valid) {
    console.log('  ✓ All article references are valid');
    console.log('');
    console.log('='.repeat(70));
    console.log('');
    process.exit(0);
  } else {
    console.log('  ✗ VALIDATION FAILED');
    console.log('');
    console.log('-'.repeat(70));
    console.log('  ERRORS:');
    console.log('-'.repeat(70));

    for (const error of result.errors) {
      console.log('');
      console.log(`  Article: "${error.articleId}"`);
      console.log(`  Missing ${error.type}: "${error.referenceId}"`);

      if (error.suggestions.length > 0) {
        console.log(`  Did you mean: ${error.suggestions.join(', ')}`);
      }
    }

    console.log('');
    console.log('-'.repeat(70));
    console.log('');
    console.log('  Fix: Either add the missing tool/resource to the respective index,');
    console.log('       or remove the invalid reference from the article metadata.');
    console.log('');
    console.log('='.repeat(70));
    console.log('');
    process.exit(1);
  }
}

main();
