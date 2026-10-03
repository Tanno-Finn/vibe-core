#!/usr/bin/env node
/**
 * Build Compiled Glossary for Highlighting Service
 *
 * Generates /assets/data/core/glossary/compiled-glossary.json from glossary bundles.
 * This file is used by the HighlightingService for glossary term highlighting.
 *
 * With the glossary feature switched off in src/config/site.json, every locale
 * gets an empty map: no term is highlighted, and the glossary content may be
 * empty or absent without failing the build.
 *
 * Usage: node scripts/build-compiled-glossary.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ALL_LOCALES } from './lib/locale-fallback.mjs';
import { createFeatureScope } from './lib/feature-scope.mjs';
import { loadFeatureCatalog, loadSiteConfig } from './lib/site-config.mjs';

// Language list - Single Source of Truth (src/config/languages.json via the shared
// language rules in scripts/lib/locale-fallback.mjs)
const ALL_LANGUAGES: string[] = ALL_LOCALES;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Language list from central config
const LANGUAGES = ALL_LANGUAGES;
const INPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'data', 'core', 'glossary');

interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category?: string;
  alternatives?: string[];
  [key: string]: unknown;
}

interface GlossaryBundle {
  meta: unknown;
  entries: Record<string, GlossaryEntry>;
}

interface CompiledGlossary {
  [language: string]: {
    [searchTerm: string]: {
      id: string;
      term: string;
      definition: string;
      category: string;
      alternatives?: string[];
    };
  };
}

/** Glossary off in site.json: an empty map per locale, whatever the content says. */
function writeEmptyGlossaries(): void {
  console.log('Glossary feature is off in src/config/site.json — writing empty compiled glossaries.\n');
  for (const lang of LANGUAGES) {
    fs.writeFileSync(path.join(OUTPUT_DIR, `compiled-glossary.${lang}.json`), '{}', 'utf-8');
    console.log(`  ✅ compiled-glossary.${lang.padEnd(8)}.json → empty (glossary off)`);
  }
}

function buildCompiledGlossary(): void {
  if (createFeatureScope(loadFeatureCatalog(), loadSiteConfig().features).isCollectionOff('glossary')) {
    writeEmptyGlossaries();
    return;
  }
  console.log('Building compiled glossary for highlighting (per-language split)...\n');

  let totalFiles = 0;
  let totalSizeKB = 0;

  for (const lang of LANGUAGES) {
    // Try dedicated glossary bundle first, then fall back to unified content bundle
    const glossaryBundlePath = path.join(INPUT_DIR, `glossary.${lang}.json`);
    const contentBundlePath = path.join(INPUT_DIR, `content.${lang}.json`);

    let entries: Record<string, GlossaryEntry>;

    // No cross-language fallback lives here: this builder consumes the already
    // language-resolved content bundle, so the locale-aware chain in
    // scripts/lib/locale-fallback.mjs has already done its work upstream.
    // What DID hide here was a silent `continue` — a missing or empty bundle
    // produced no compiled-glossary.<lang>.json at all and term highlighting
    // was simply off for that locale, with nothing printed. Now it is fatal.
    if (fs.existsSync(glossaryBundlePath)) {
      const bundle: GlossaryBundle = JSON.parse(fs.readFileSync(glossaryBundlePath, 'utf-8'));
      entries = bundle.entries;
    } else if (fs.existsSync(contentBundlePath)) {
      const content = JSON.parse(fs.readFileSync(contentBundlePath, 'utf-8'));
      if (!content.glossary || Object.keys(content.glossary).length === 0) {
        throw new Error(
          `content.${lang}.json contains no glossary entries — term highlighting would be silently off for "${lang}".`,
        );
      }
      entries = content.glossary;
    } else {
      throw new Error(
        `No content bundle for "${lang}" (looked for ${glossaryBundlePath} and ${contentBundlePath}).\n` +
          `  Run \`npm run content:build\` first.`,
      );
    }

    try {
      const langMap: CompiledGlossary[string] = {};

      let termCount = 0;

      for (const [id, entry] of Object.entries(entries)) {
        // Support both 'definition' and 'description' fields
        const definition = entry.definition || (entry['description'] as string | undefined);
        if (!entry.term || !definition) continue;

        // Support both 'alternatives' (array) and 'alternativeNames' (object with lang keys)
        let alternatives: string[] = [];
        if (entry.alternatives && Array.isArray(entry.alternatives)) {
          alternatives = entry.alternatives;
        } else if (entry['alternativeNames']) {
          const altNames = entry['alternativeNames'];
          // If alternativeNames is an object with language keys, extract for current language
          if (typeof altNames === 'object' && !Array.isArray(altNames)) {
            // Try exact lang match, then base lang (e.g., 'es' for 'es-easy')
            const baseLang = lang.split('-')[0];
            const altMap = altNames as Record<string, string[]>;
            alternatives = altMap[lang] || altMap[baseLang] || [];
          } else if (Array.isArray(altNames)) {
            alternatives = altNames;
          }
        }

        const compiledEntry = {
          id: entry.id || id,
          term: entry.term,
          definition: definition,
          category: entry.category || 'general',
          alternatives: alternatives,
        };

        // Add by term (primary lookup) — only the canonical term is a highlight trigger.
        // Aliases are intentionally NOT indexed: LLM-translated alternativeNames are user-facing
        // information, not reliable machine indices, and produced cross-entry collisions
        // (e.g. DE "Genauigkeit" matched both accuracy and precision).
        langMap[entry.term.toLowerCase()] = compiledEntry;

        // Add by ID for lookup (slugs, mostly hyphenated — won't match arbitrary prose)
        langMap[id.toLowerCase()] = compiledEntry;

        termCount++;
      }

      // Write per-language file
      const outputFile = path.join(OUTPUT_DIR, `compiled-glossary.${lang}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(langMap), 'utf-8');

      const stats = fs.statSync(outputFile);
      const sizeKB = (stats.size / 1024).toFixed(1);
      totalSizeKB += stats.size / 1024;
      totalFiles++;

      console.log(`  ✅ compiled-glossary.${lang.padEnd(8)}.json → ${sizeKB.padStart(7)} KB, ${termCount} terms`);
    } catch (error) {
      console.error(`  ❌ Error processing ${lang}: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  if (totalFiles !== LANGUAGES.length) {
    console.error(`\n❌ Wrote ${totalFiles} compiled-glossary files but ${LANGUAGES.length} locales are configured.`);
    process.exit(1);
  }

  console.log(`\n✅ Compiled glossary split complete:`);
  console.log(`   Files: ${totalFiles}`);
  console.log(`   Total size: ${totalSizeKB.toFixed(1)} KB`);
  console.log(`   Output: ${OUTPUT_DIR}/compiled-glossary.[lang].json`);
}

try {
  buildCompiledGlossary();
} catch (error) {
  console.error('\n❌ COMPILED GLOSSARY BUILD FAILED');
  console.error(`   ${(error as Error).message}`);
  process.exit(1);
}
