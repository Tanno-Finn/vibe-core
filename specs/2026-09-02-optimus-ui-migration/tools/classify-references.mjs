#!/usr/bin/env node
/**
 * Classifies every "PrimeNG / PrimeUIX / PrimeIcons / PrimeTek" mention in the repo so
 * the post-migration sweep (ADR-0014) can be sighted by kind instead of read file by
 * file. Pure measurement — writes nothing but a report.
 *
 *   node classify-references.mjs            # summary table + per-file counts
 *   node classify-references.mjs --json out.json   # every hit with its class
 *   node classify-references.mjs --kind prose      # print the hits of one class
 *
 * Classes (first match wins, top to bottom):
 *   import        an import / provider / package path that the schematic should have rewritten
 *   cite          a provenance citation (`primeng-select.mjs:1735`, `@primeuix/...`)
 *   pin           a `measured-against:` frontmatter pin
 *   category      the guide category literal `primeng`
 *   i18n          a translation string (src/assets/i18n)
 *   code-sample   a code sample inside prose (backticks, <code>, <pre>, template literal)
 *   comment       a code comment line
 *   historical    prose that names a past version or the fork ("PrimeNG 21", "v22", "fork of")
 *   prose         everything else
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', '.git', 'coverage', 'out-tsc', 'dist-content']);
const SKIP_FILES = new Set(['package-lock.json', 'cites.snapshot.json', 'cites.mapping.json']);
const SKIP_RE = /^references\.(before|after)\.json$/;
const HIT = /prime(?:ng|uix|icons|tek|ui)/i;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (
      !SKIP_FILES.has(e.name) &&
      !SKIP_RE.test(e.name) &&
      /\.(ts|mjs|js|json|md|MD|scss|html|yml|yaml|txt)$/.test(e.name)
    )
      out.push(p);
  }
  return out;
}

function fileKind(rel) {
  if (/design-system\/guides\/.*\.agent\.md$/.test(rel)) return 'guide';
  if (/^src\/app\/dev\/articles\//.test(rel)) return 'article';
  if (/^src\/assets\/i18n\//.test(rel)) return 'i18n';
  if (/^src\/.*\.ts$/.test(rel)) return 'app-ts';
  if (/^src\/.*\.scss$/.test(rel)) return 'scss';
  if (/^scripts\//.test(rel)) return 'script';
  if (/^specs\//.test(rel)) return 'spec';
  if (/\.(md|MD)$/.test(rel)) return 'doc';
  if (/\.json$/.test(rel)) return 'json';
  return 'other';
}

function classify(line, rel, kind) {
  const l = line;
  if (/measured-against:/.test(l)) return 'pin';
  if (/category:\s*'?primeng'?/.test(l) || /"primeng":\s*"/.test(l)) return 'category';
  if (
    /from\s+['"]primeng\/|import\s+['"]primeng\/|['"]primeng\/[a-z]+['"]|providePrimeNG|from\s+['"]@primeuix|primeicons\/primeicons\.css|require\(['"]primeng/.test(
      l,
    )
  )
    return 'import';
  if (/primeng-[a-z]+\.mjs|@primeuix\/(themes|styles|utils|styled)\/dist/.test(l)) return 'cite';
  if (kind === 'i18n') return 'i18n';
  if (/^\s*(\/\/|\*|\/\*|<!--|#)/.test(l)) return 'comment';
  if (/`[^`]*prime[^`]*`|<code>[^<]*prime[^<]*<\/code>|<pre|\$\{|^\s*'[^']*prime/i.test(l)) return 'code-sample';
  if (
    /PrimeNG\s*(v?2[12]|21\.|22\.)|v2[12]\b|fork(ed)? (of|from)|no longer|was PrimeNG|formerly|ehemals|früher|inherited from|continuation of/i.test(
      l,
    )
  )
    return 'historical';
  return 'prose';
}

const args = process.argv.slice(2);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const onlyKind = args.includes('--kind') ? args[args.indexOf('--kind') + 1] : null;

const hits = [];
for (const f of walk(ROOT)) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const kind = fileKind(rel);
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!HIT.test(line)) return;
    hits.push({
      file: rel,
      line: i + 1,
      fileKind: kind,
      class: classify(line, rel, kind),
      text: line.trim().slice(0, 200),
    });
  });
}

const matrix = {};
for (const h of hits) {
  matrix[h.fileKind] ??= {};
  matrix[h.fileKind][h.class] = (matrix[h.fileKind][h.class] || 0) + 1;
}
const files = new Set(hits.map((h) => h.file));
console.log(`${hits.length} mention(s) in ${files.size} file(s)`);
console.table(matrix);
const byClass = {};
for (const h of hits) byClass[h.class] = (byClass[h.class] || 0) + 1;
console.table(byClass);

if (onlyKind) for (const h of hits.filter((h) => h.class === onlyKind)) console.log(`${h.file}:${h.line}  ${h.text}`);
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(hits, null, 1));
