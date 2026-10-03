#!/usr/bin/env node
/**
 * Prints the review brief for ONE guide/article pair - the material a reviewing agent
 * needs to re-verify the pair against Optimus UI (ADR-0014) without reading the files
 * whole:
 *
 *   A. the citations provenance-cites.mjs could not relocate (from cites.mapping.json,
 *      filtered to this pair, re-checked against the file's current text),
 *   B. every line that still carries a PrimeNG-22-era tag (v22, 22.1, Aura 3.0, ...),
 *   C. the bundles the pair cites, the guide's current body size, the article's
 *      history-tab position.
 *
 *   node review-brief.mjs <id>          # e.g. popover, dialog, table
 *   node review-brief.mjs --list        # every pair with its counts (for planning)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const MAP = path.join(HERE, 'cites.mapping.json');
const TAG = /Aura 3|\bv22\b|22\.1\b|PrimeNG 22|PrimeNG|\bv21\b|Themes 3|primeuix|primeng-[a-z-]+\.(?:mjs|d\.ts)/;

const guideOf = (id) => `src/assets/design-system/guides/${id}.agent.md`;
const articleOf = (id) => `src/app/dev/articles/${id}/${id}-article.component.ts`;
const read = (rel) =>
  fs.existsSync(path.join(ROOT, rel)) ? fs.readFileSync(path.join(ROOT, rel), 'utf8').split('\n') : null;

function authoredBytes(lines) {
  const text = lines.join('\n').replace(/\r\n?/g, '\n');
  const m = /^---\n[\s\S]*?\n---\n/.exec(text);
  return Buffer.byteLength(m ? text.slice(m[0].length) : text, 'utf8');
}

function brief(id) {
  const mapping = JSON.parse(fs.readFileSync(MAP, 'utf8'));
  const files = [guideOf(id), articleOf(id)].filter((f) => fs.existsSync(path.join(ROOT, f)));
  const out = [];
  for (const rel of files) {
    const lines = read(rel);
    const isGuide = rel.endsWith('.md');
    out.push(`\n### ${rel}${isGuide ? ` (guide body ${authoredBytes(lines)} B of max 8000)` : ''}`);
    // A. unresolved citations
    const rev = mapping.review.filter((e) => e.file === rel);
    const still = rev.filter((e) => (lines[e.docLine - 1] ?? '').includes(e.text));
    out.push(`\n**A. Unresolved citations (${still.length})** - the tool's candidate is a hint, not an answer:`);
    for (const e of still) {
      const bundle = e.bundle
        ? e.bundle.name
          ? `openng-optimus-ui-${e.bundle.name}.${e.bundle.ext ?? 'mjs'}`
          : `@openng/optimus-ui-${e.bundle.pkg}/dist/${e.bundle.rest}`
        : '(bundle unknown)';
      const old =
        e.src?.from != null
          ? JSON.stringify(e.src.from.trim().slice(0, 120))
          : '(the cited line did not exist in PrimeNG 22.1.0 either)';
      const cand = e.bestLine ?? e.newFrom;
      out.push(
        `- line ${e.docLine}: \`${e.text}\` -> ${bundle}; old source line: ${old}${cand ? `; candidate :${cand}` : ''}`,
      );
    }
    // B. tagged lines (excluding the citation lines already listed)
    const listed = new Set(still.map((e) => e.docLine));
    const tagged = [];
    lines.forEach((l, i) => {
      if (TAG.test(l) && !listed.has(i + 1)) tagged.push(`- line ${i + 1}: ${l.trim().slice(0, 240)}`);
    });
    out.push(`\n**B. Lines with a PrimeNG-era tag to re-check (${tagged.length})**:`);
    out.push(...tagged);
    if (!isGuide) {
      const h = lines.findIndex((l) => l.includes('<ul class="history">'));
      if (h >= 0)
        out.push(
          `\n**C. History tab** starts at line ${h + 1}; newest entry format: ${lines[h + 2]?.trim().slice(0, 160) ?? ''}`,
        );
    }
  }
  const cited = new Set();
  for (const rel of files)
    for (const l of read(rel))
      for (const m of l.matchAll(/(?:openng-optimus-ui-|primeng-)([a-z-]+)\.(?:mjs|d\.ts)/g))
        cited.add(m[1].replace(/^types-/, ''));
  out.unshift(`## Review brief: ${id}\nBundles this pair cites: ${[...cited].sort().join(', ') || '(none)'}`);
  return out.join('\n');
}

function list() {
  const mapping = JSON.parse(fs.readFileSync(MAP, 'utf8'));
  const ids = new Set();
  for (const f of fs.readdirSync(path.join(ROOT, 'src/assets/design-system/guides')))
    if (f.endsWith('.agent.md')) ids.add(f.replace('.agent.md', ''));
  const rows = [];
  for (const id of [...ids].sort()) {
    const files = [guideOf(id), articleOf(id)];
    let unresolved = 0;
    let tagged = 0;
    for (const rel of files) {
      const lines = read(rel);
      if (!lines) continue;
      unresolved += mapping.review.filter(
        (e) => e.file === rel && (lines[e.docLine - 1] ?? '').includes(e.text),
      ).length;
      tagged += lines.filter((l) => TAG.test(l)).length;
    }
    rows.push({ id, unresolved, tagged, guideBytes: authoredBytes(read(guideOf(id))) });
  }
  console.table(rows);
}

if (process.argv[2] === '--list') list();
else if (process.argv[2]) console.log(brief(process.argv[2]));
else {
  console.error('usage: review-brief.mjs <id> | --list');
  process.exit(2);
}
