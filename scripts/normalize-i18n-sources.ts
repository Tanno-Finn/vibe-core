#!/usr/bin/env node

/**
 * i18n Source Normalizer
 *
 * Normalizes Unicode escape sequences (\u00e9 → é) in i18n source module files.
 * Also detects and fixes HTML entities (&aring; → å) in JSON string values.
 *
 * Why: LLM translation workers sometimes write \u00e9 instead of é.
 * The built bundles are fine (JSON.stringify normalizes), but source files
 * become hard to read and inconsistent.
 *
 * Usage: node scripts/normalize-i18n-sources.ts [--dry-run]
 */

import * as fs from 'fs';
import * as path from 'path';

const MODULES_DIR = 'src/assets/i18n/modules';
const DRY_RUN = process.argv.includes('--dry-run');

// HTML entities that might appear in translations
const HTML_ENTITIES: Record<string, string> = {
  '&aring;': 'å',
  '&Aring;': 'Å',
  '&auml;': 'ä',
  '&Auml;': 'Ä',
  '&ouml;': 'ö',
  '&Ouml;': 'Ö',
  '&uuml;': 'ü',
  '&Uuml;': 'Ü',
  '&szlig;': 'ß',
  '&eacute;': 'é',
  '&Eacute;': 'É',
  '&egrave;': 'è',
  '&Egrave;': 'È',
  '&ecirc;': 'ê',
  '&Ecirc;': 'Ê',
  '&agrave;': 'à',
  '&Agrave;': 'À',
  '&acirc;': 'â',
  '&Acirc;': 'Â',
  '&ocirc;': 'ô',
  '&Ocirc;': 'Ô',
  '&ugrave;': 'ù',
  '&Ugrave;': 'Ù',
  '&ucirc;': 'û',
  '&Ucirc;': 'Û',
  '&ccedil;': 'ç',
  '&Ccedil;': 'Ç',
  '&ntilde;': 'ñ',
  '&Ntilde;': 'Ñ',
  '&oslash;': 'ø',
  '&Oslash;': 'Ø',
  '&aelig;': 'æ',
  '&AElig;': 'Æ',
  '&nbsp;': ' ',
  '&amp;': '&',
};

const HTML_ENTITY_REGEX = new RegExp(
  Object.keys(HTML_ENTITIES)
    .map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'g',
);

function replaceHtmlEntities(str: string): string {
  return str.replace(HTML_ENTITY_REGEX, (match) => HTML_ENTITIES[match] || match);
}

function normalizeValues(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return replaceHtmlEntities(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeValues);
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = normalizeValues(value);
    }
    return result;
  }
  return obj;
}

function main(): void {
  console.log('');
  console.log('='.repeat(60));
  console.log(`  i18n SOURCE NORMALIZER ${DRY_RUN ? '(DRY RUN)' : ''}`);
  console.log('='.repeat(60));
  console.log('');

  let filesChecked = 0;
  let filesNormalized = 0;
  let unicodeEscapesFixed = 0;
  let htmlEntitiesFixed = 0;

  const langDirs = fs.readdirSync(MODULES_DIR).filter((d) => fs.statSync(path.join(MODULES_DIR, d)).isDirectory());

  for (const lang of langDirs) {
    const langDir = path.join(MODULES_DIR, lang);
    const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json') && !f.startsWith('_'));

    for (const file of files) {
      const filePath = path.join(langDir, file);
      filesChecked++;

      try {
        const raw = fs.readFileSync(filePath, 'utf-8');

        // Only process files with actual issues (not just formatting)
        const unicodeMatches = raw.match(/\\u00[a-f0-9]{2}/gi);
        const entityMatches = raw.match(HTML_ENTITY_REGEX);

        if (!unicodeMatches && !entityMatches) continue;

        // Parse → normalize HTML entities → re-serialize (preserve original formatting)
        const parsed = JSON.parse(raw);
        const normalized = normalizeValues(parsed);

        // Detect original indentation
        const indentMatch = raw.match(/\n(\s+)"/);
        const indent = indentMatch ? indentMatch[1].length : 2;
        const output = JSON.stringify(normalized, null, indent) + (raw.endsWith('\n') ? '\n' : '');

        if (output !== raw) {
          if (!DRY_RUN) {
            fs.writeFileSync(filePath, output, 'utf-8');
          }
          filesNormalized++;
          if (unicodeMatches) unicodeEscapesFixed += unicodeMatches.length;
          if (entityMatches) htmlEntitiesFixed += entityMatches.length;
          console.log(
            `  ${DRY_RUN ? 'WOULD FIX' : 'FIXED'}: ${lang}/${file}` +
              (unicodeMatches ? ` (${unicodeMatches.length} unicode escapes)` : '') +
              (entityMatches ? ` (${entityMatches.length} HTML entities)` : ''),
          );
        }
      } catch (error) {
        console.error(`  ERROR: ${lang}/${file} — ${error}`);
      }
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(`  Files checked:         ${filesChecked}`);
  console.log(`  Files normalized:      ${filesNormalized}`);
  console.log(`  Unicode escapes fixed: ${unicodeEscapesFixed}`);
  console.log(`  HTML entities fixed:   ${htmlEntitiesFixed}`);
  console.log('='.repeat(60));
  console.log('');
}

main();
