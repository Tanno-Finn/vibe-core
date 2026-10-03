#!/usr/bin/env node
/**
 * Sync each `related` block from the per-id core JSON into the type's index.json.
 *
 * The app reads article metadata from `articles/index.json` (ArticlesService,
 * `article-meta.service.ts`), but the editorial `related` block — pinned
 * articles, glossary terms, timeline events — is authored in
 * `articles/<id>.json`. `build-unified-content.ts` validates the per-id block
 * (every ID must resolve), and the index is what the lesson template reads to
 * render "related" refs and glossary links. When the two drift, the page shows
 * nothing and no gate complains: five of sixteen articles shipped that way
 * (`art-tour`, `art-digital-twins`, `art-second-brain`, `art-secrets-security`,
 * `art-code-review-basics`), because the importer that created them wrote an
 * empty block into the index and the rewiring happened in the per-id file.
 *
 * This script is the one place the index learns about `related`: read every
 * per-id JSON, copy its `related` block over the index entry, write the index
 * only when something changed. Idempotent; runs as the first step of
 * `content:build` so the index can no longer fall behind.
 *
 * Usage:  node scripts/sync-related-to-index.mjs [--check]
 *   --check   exit 1 if the index is out of sync instead of writing it
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

const TYPES = [
  { type: 'articles', dir: 'src/assets/data/core/articles' },
  { type: 'demos', dir: 'src/assets/data/core/demos' },
];

function syncIndex({ type, dir }) {
  const indexPath = path.join(ROOT, dir, 'index.json');
  if (!fs.existsSync(indexPath)) return { type, total: 0, touched: [], skipped: true };
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const entries = Array.isArray(index) ? index : index.entries || index[type] || [];
  const touched = [];
  for (const entry of entries) {
    const idJson = path.join(ROOT, dir, `${entry.id}.json`);
    if (!fs.existsSync(idJson)) continue;
    const data = JSON.parse(fs.readFileSync(idJson, 'utf8'));
    if (!data.related) continue;
    if (JSON.stringify(entry.related) !== JSON.stringify(data.related)) {
      entry.related = data.related;
      touched.push(entry.id);
    }
  }
  if (touched.length > 0 && !CHECK) {
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
  }
  return { type, total: entries.length, touched, skipped: false };
}

let outOfSync = 0;
for (const t of TYPES) {
  const r = syncIndex(t);
  if (r.skipped) continue;
  outOfSync += r.touched.length;
  const verb = CHECK ? 'out of sync' : 'synced';
  const list = r.touched.length ? ` (${r.touched.join(', ')})` : '';
  console.log(`  related → ${r.type}/index.json: ${r.touched.length}/${r.total} ${verb}${list}`);
}

if (CHECK && outOfSync > 0) {
  console.error(
    `  FAIL — ${outOfSync} index entries lag their per-id related block; run: node scripts/sync-related-to-index.mjs`,
  );
  process.exit(1);
}
