/**
 * content-entries.mjs — the entry ids of one content collection, read one way for everyone.
 *
 * `scripts/check-content-coverage.mjs` (the gate) and `tools/lang-status.mjs` (the kit tool)
 * both count entries per collection; if they read them differently, the tool reports a number
 * the gate does not check. The rule: `core/<collection>/index.json` when it is a list, else the
 * collection's `*.json` files without `index` and `chapters`. A missing folder has no entries.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Entry ids of the collection folder `dir` (`src/assets/data/core/<collection>`). */
export function entryIdsOf(dir) {
  if (!existsSync(dir)) return [];
  const indexPath = join(dir, 'index.json');
  if (existsSync(indexPath)) {
    const text = readFileSync(indexPath, 'utf8');
    const ids = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
    return Array.isArray(ids) ? ids : [];
  }
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => f.slice(0, -5))
    .filter((id) => id !== 'index' && id !== 'chapters');
}
