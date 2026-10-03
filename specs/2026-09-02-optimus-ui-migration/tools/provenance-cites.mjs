#!/usr/bin/env node
/**
 * Provenance-citation migrator for the PrimeNG 22 → Optimus UI 2 move (ADR-0014).
 *
 * The design-system guides (`src/assets/design-system/guides/*.agent.md`) and the
 * workshop articles (`src/app/dev/articles/**\/*.ts`) cite library source by flat
 * bundle + line (`primeng-select.mjs:1735`, `@primeuix/styles/dist/tabs/index.mjs`,
 * and bare `:438` refs whose bundle is implied by context). Optimus UI 2 is a fork of
 * the PrimeNG 21 tree, so every line number moves and some cited lines no longer exist.
 *
 *   node provenance-cites.mjs snapshot   # record the cited PrimeNG 22 source lines
 *   node provenance-cites.mjs locate     # find the same lines in the installed Optimus bundles
 *   node provenance-cites.mjs apply      # rewrite the confident citations in place
 *   node provenance-cites.mjs review     # print the leftovers grouped by document, for a reviewer
 *
 * `snapshot` reads the OLD bundles from `OLD_ROOT` (default `node_modules`; after the
 * install, point it at an extracted `npm pack primeng@22.1.0` etc. — the layout must be
 * `<OLD_ROOT>/primeng/fesm2022/...` and `<OLD_ROOT>/@primeuix/<pkg>/dist/...`).
 *
 * How a bare `:NNN` finds its bundle: an explicit bundle earlier on the same line wins;
 * otherwise the document's own component bundle (`select.agent.md` → `primeng-select.mjs`)
 * if one exists; otherwise the last explicit bundle mentioned above in the document.
 *
 * How a line is re-located, in order: exact trimmed match (unique, or unique once the
 * neighbouring lines agree); the same after normalising the fork's renames
 * (`PrimeNG` → `Optimus`, `primeng` → `optimus`, version strings); a token-similarity
 * search over the whole bundle that must be both strong and clearly the best (a "fuzzy"
 * hit — applied, but listed so a reviewer can spot-check). A range's end line is found
 * inside a window after the start. Everything else is left untouched and listed under
 * `review` for a human or a reviewing agent.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const SNAP = path.join(HERE, 'cites.snapshot.json');
const MAP = path.join(HERE, 'cites.mapping.json');
const OLD_ROOT = process.env.OLD_ROOT ? path.resolve(process.env.OLD_ROOT) : path.join(ROOT, 'node_modules');
const NEW_ROOT = path.join(ROOT, 'node_modules');

/** Old bundle locations (PrimeNG 22 tree), relative to OLD_ROOT. `ext` is 'mjs' (FESM) or 'd.ts' (typings). */
const OLD = {
  primeng: (name, ext) =>
    ext === 'd.ts' ? `primeng/types/primeng-${name}.d.ts` : `primeng/fesm2022/primeng-${name}.mjs`,
  primeuix: (pkg, rest) => `@primeuix/${pkg}/dist/${rest}`,
};
/** New bundle locations (Optimus UI 2 tree), relative to NEW_ROOT. */
const NEW = {
  primeng: (name, ext) =>
    ext === 'd.ts'
      ? `@openng/optimus-ui/types/openng-optimus-ui-${name}.d.ts`
      : `@openng/optimus-ui/fesm2022/openng-optimus-ui-${name}.mjs`,
  primeuix: (pkg, rest) => `@openng/optimus-ui-${pkg}/dist/${rest}`,
};
const NEW_BUNDLE_BASENAME = (name, ext) => `openng-optimus-ui-${name}.${ext}`;
const NEW_PRIMEUIX_PREFIX = (pkg) => `@openng/optimus-ui-${pkg}/dist/`;

const CITE_SOURCES = [
  { dir: 'src/assets/design-system/guides', ext: /\.agent\.md$/, id: (f) => path.basename(f, '.agent.md') },
  { dir: 'src/app/dev/articles', ext: /\.ts$/, id: (f) => path.basename(f).replace(/-article\.component\.ts$/, '') },
];

const RE_PRIMENG = /primeng-([a-z-]+?)\.(mjs|d\.ts)(?::(\d+)(?:-(\d+))?)?/g;
const RE_PRIMEUIX = /@primeuix\/(themes|styles)\/dist\/([A-Za-z0-9/._-]+?)(?::(\d+)(?:-(\d+))?)?(?=[\s`'")\],;:]|$)/g;
// A bare line ref: ":438" or ":580-584", not preceded by a word char, '.', '/', '-' or
// another ':' (so "12:30", URLs and "primeng-tabs.mjs:438" don't match twice), and
// followed by a delimiter.
const RE_BARE = /(?<![\w.:/-]):(\d{2,5})(?:-(\d{2,5}))?(?=[\s,;)\]`'"]|$)/g;

function walk(dir, ext, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, out);
    else if (ext.test(e.name)) out.push(p);
  }
  return out;
}

function readLines(file) {
  return fs.readFileSync(file, 'utf8').split('\n');
}

function resolveBundle(root, rel) {
  let abs = path.join(root, rel);
  // a directory citation (`@primeuix/styles/dist/card`) means its index.mjs
  if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) abs = path.join(abs, 'index.mjs');
  return fs.existsSync(abs) ? abs : null;
}

const fileCache = new Map();
function bundleLines(root, rel) {
  const key = root + '::' + rel;
  if (!fileCache.has(key)) {
    const abs = rel ? resolveBundle(root, rel) : null;
    fileCache.set(key, abs ? readLines(abs) : null);
  }
  return fileCache.get(key);
}

function oldPath(b) {
  if (!b) return null;
  return b.kind === 'primeng' ? OLD.primeng(b.name, b.ext ?? 'mjs') : OLD.primeuix(b.pkg, b.rest);
}
function newPath(b) {
  if (!b) return null;
  return b.kind === 'primeng' ? NEW.primeng(b.name, b.ext ?? 'mjs') : NEW.primeuix(b.pkg, b.rest);
}

/** Every citation occurrence in one file, in document order, with the implied bundle for bare refs. */
function scanFile(file, docId) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const hits = [];
  const ownBundle =
    docId && resolveBundle(OLD_ROOT, OLD.primeng(docId, 'mjs')) ? { kind: 'primeng', name: docId, ext: 'mjs' } : null;
  let lastBundle = null;
  lines.forEach((line, i) => {
    const local = [];
    for (const m of line.matchAll(RE_PRIMENG)) {
      const b = { kind: 'primeng', name: m[1], ext: m[2] };
      local.push({
        idx: m.index,
        text: m[0],
        bundle: b,
        from: m[3] ? +m[3] : null,
        to: m[4] ? +m[4] : null,
        implied: false,
      });
    }
    for (const m of line.matchAll(RE_PRIMEUIX)) {
      const b = { kind: 'primeuix', pkg: m[1], rest: m[2] };
      local.push({
        idx: m.index,
        text: m[0],
        bundle: b,
        from: m[3] ? +m[3] : null,
        to: m[4] ? +m[4] : null,
        implied: false,
      });
    }
    local.sort((a, b) => a.idx - b.idx);
    const spans = local.map((h) => [h.idx, h.idx + h.text.length]);
    for (const m of line.matchAll(RE_BARE)) {
      const inside = spans.some(([s, e]) => m.index >= s && m.index < e);
      if (inside) continue;
      const before = local.filter((h) => !h.implied && h.idx < m.index).pop();
      const bundle = before ? before.bundle : (ownBundle ?? lastBundle);
      const via = before ? 'same-line' : ownBundle ? 'own-bundle' : lastBundle ? 'last-mention' : 'none';
      local.push({ idx: m.index, text: m[0], bundle, from: +m[1], to: m[2] ? +m[2] : null, implied: true, via });
    }
    local.sort((a, b) => a.idx - b.idx);
    for (const h of local) {
      if (!h.implied) lastBundle = h.bundle;
      hits.push({ file: path.relative(ROOT, file).replace(/\\/g, '/'), docLine: i + 1, ...h });
    }
  });
  return hits;
}

function snapshot() {
  const hits = [];
  for (const src of CITE_SOURCES) {
    for (const f of walk(path.join(ROOT, src.dir), src.ext)) hits.push(...scanFile(f, src.id(f)));
  }
  let missingBundle = 0;
  for (const h of hits) {
    const rel = oldPath(h.bundle);
    const lines = rel ? bundleLines(OLD_ROOT, rel) : null;
    h.oldPath = rel;
    if (!lines) {
      h.src = null;
      missingBundle++;
      continue;
    }
    if (h.from != null) {
      h.src = { from: lines[h.from - 1] ?? null, to: h.to != null ? (lines[h.to - 1] ?? null) : null };
      h.ctx = { prev: lines[h.from - 2] ?? null, next: lines[h.from] ?? null };
      // Optimus bundles carry two copies of many templates; so did PrimeNG 22. When the
      // cited line is one of several identical ones, remember WHICH (1st, 2nd, ...) so the
      // same ordinal can be picked in the new bundle.
      if (h.src.from != null && h.src.from.trim()) {
        const t = h.src.from.trim();
        const same = [];
        lines.forEach((l, i) => {
          if (l.trim() === t) same.push(i + 1);
        });
        if (same.length > 1) h.ordinal = { index: same.indexOf(h.from), of: same.length };
      }
      if (h.to != null) h.block = lines.slice(h.from - 1, Math.min(h.to, h.from - 1 + 40)).map((l) => l.trim());
    }
  }
  fs.writeFileSync(SNAP, JSON.stringify(hits, null, 1));
  const byKind = {};
  for (const h of hits) {
    const k = `${h.bundle?.kind ?? 'none'}/${h.implied ? `implied:${h.via}` : 'explicit'}/${h.from != null ? 'line' : 'path-only'}`;
    byKind[k] = (byKind[k] || 0) + 1;
  }
  console.log(
    `snapshot (old root ${OLD_ROOT}): ${hits.length} citations in ${new Set(hits.map((h) => h.file)).size} files -> ${path.relative(ROOT, SNAP)}`,
  );
  console.table(byKind);
  if (missingBundle)
    console.log(`${missingBundle} citation(s) point at bundles not present under OLD_ROOT (src: null).`);
}

// ---------------------------------------------------------------------------------
// matching

const norm = (s) =>
  s
    .replace(/PrimeNG/g, 'Optimus')
    .replace(/primeng/g, 'optimus')
    .replace(/PRIMENG/g, 'OPTIMUS')
    .replace(/version: "[\d.]+"/g, 'version: "x"')
    .replace(/\s+/g, ' ')
    .trim();

const tokens = (s) => new Set(norm(s).match(/[A-Za-z_$][\w$]*|[^\s\w]/g) ?? []);
function similarity(a, b) {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}
// Identifiers that say nothing about WHICH line this is — Angular/TS boilerplate that
// every signal declaration and every component metadata line shares. A fuzzy hit must
// keep the line's own names (the ones not in this list), or `filter = input(true, …)`
// happily matches `fluid = input(undefined, …)`.
const BOILERPLATE = new Set(
  'input output model signal computed effect viewChild contentChild viewChildren contentChildren ngDevMode debugName istanbul ignore next static ɵcmp ɵdir ɵfac ɵprov i0 ɵɵngDeclareComponent ɵɵngDeclareDirective ɵɵngDeclareFactory ɵɵngDeclareInjectable minVersion version type isStandalone selector this const let var return if else new function true false null undefined event value ts'.split(
    ' ',
  ),
);
for (const t of 'transform booleanAttribute numberAttribute alias required readonly private protected public async await'.split(
  ' ',
))
  BOILERPLATE.add(t);
const names = (s) => new Set([...(norm(s).match(/[A-Za-z_$][\w$]{2,}/g) ?? [])].filter((t) => !BOILERPLATE.has(t)));
/** A declaration's own name (`filter = input(…)`, `hide(event) {`, `get label() {`), if the line is one. */
const declared = (s) =>
  s
    .trim()
    .match(
      /^(?:get |set |async |static |readonly |private |protected |public )*([A-Za-z_$][\w$]*)\s*(?:=|\(|:)/,
    )?.[1] ?? null;
/**
 * Do the line's own names survive in the candidate? A declaration must keep its declared
 * name (`filter = …` never matches `fluid = …`, however similar the rest); otherwise three
 * quarters of the non-boilerplate identifiers must be there. True when the old line has
 * no such names at all (then only the token similarity speaks).
 */
function namesKept(oldText, newText) {
  const d = declared(oldText);
  if (d && !BOILERPLATE.has(d) && declared(newText) !== d) return false;
  const o = names(oldText);
  if (!o.size) return true;
  const n = names(newText);
  let kept = 0;
  for (const t of o) if (n.has(t)) kept++;
  return kept / o.size >= 0.75;
}

const OK = new Set(['unique', 'unique-with-context', 'unique-normalised', 'ordinal', 'fuzzy']);

/** Find `text` in `lines`. Returns { line, how, matches, score? }. */
function findLine(lines, text, oldNo, ctx, ordinal) {
  if (text == null) return { line: null, matches: [], how: 'no-source' };
  const t = text.trim();
  if (!t) return { line: null, matches: [], how: 'blank-source' };
  let matches = [];
  lines.forEach((l, i) => {
    if (l.trim() === t) matches.push(i + 1);
  });
  const disambiguate = (ms, how) => {
    if (ms.length === 1) return { line: ms[0], matches: ms, how };
    if (ordinal && ms.length === ordinal.of && ordinal.index >= 0)
      return { line: ms[ordinal.index], matches: ms, how: 'ordinal' };
    const withCtx = ms.filter((n) => {
      const p = lines[n - 2]?.trim();
      const x = lines[n]?.trim();
      return (
        (ctx?.prev == null || norm(p ?? '') === norm(ctx.prev)) &&
        (ctx?.next == null || norm(x ?? '') === norm(ctx.next))
      );
    });
    if (withCtx.length === 1) return { line: withCtx[0], matches: ms, how: 'unique-with-context' };
    const closest = ms.reduce((a, b) => (Math.abs(b - oldNo) < Math.abs(a - oldNo) ? b : a));
    return { line: closest, matches: ms, how: 'ambiguous' };
  };
  if (matches.length) return disambiguate(matches, 'unique');
  const nt = norm(text);
  lines.forEach((l, i) => {
    if (norm(l) === nt) matches.push(i + 1);
  });
  if (matches.length) return disambiguate(matches, 'unique-normalised');
  // fuzzy: token similarity over the whole bundle; must be strong and clearly the best
  const tt = tokens(text);
  if (tt.size < 3) return { line: null, matches: [], how: 'missing' };
  let best = { line: null, score: 0 };
  let second = 0;
  lines.forEach((l, i) => {
    if (!l.trim()) return;
    const s = similarity(tt, tokens(l));
    if (s > best.score) {
      second = best.score;
      best = { line: i + 1, score: s };
    } else if (s > second) second = s;
  });
  if (best.score >= 0.75 && best.score - second >= 0.15 && namesKept(text, lines[best.line - 1])) {
    return {
      line: best.line,
      matches: [best.line],
      how: 'fuzzy',
      score: +best.score.toFixed(2),
      runnerUp: +second.toFixed(2),
    };
  }
  return { line: null, matches: [], how: 'missing', bestScore: +best.score.toFixed(2), bestLine: best.line };
}

/** The end line of a range: same relative offset if that line matches, else the first match within a window. */
function findRangeEnd(lines, h, newFrom) {
  const len = h.to - h.from;
  const want = h.src?.to;
  if (want == null) return { line: null, how: 'no-source' };
  const wt = want.trim();
  const same = lines[newFrom + len - 1];
  if (same != null && (same.trim() === wt || (wt && norm(same) === norm(want))))
    return { line: newFrom + len, how: 'offset' };
  if (!wt) return { line: null, how: 'blank-source' };
  const limit = Math.min(lines.length, newFrom + len * 2 + 20);
  for (let n = newFrom; n <= limit; n++) {
    const l = lines[n - 1];
    if (l != null && (l.trim() === wt || norm(l) === norm(want))) return { line: n, how: 'window' };
  }
  return { line: null, how: 'missing' };
}

function locate() {
  const hits = JSON.parse(fs.readFileSync(SNAP, 'utf8'));
  const confident = [];
  const review = [];
  for (const h of hits) {
    const rel = newPath(h.bundle);
    const lines = rel ? bundleLines(NEW_ROOT, rel) : null;
    const entry = { ...h, newPath: rel };
    delete entry.block;
    if (!h.bundle) {
      entry.status = 'no-bundle';
      review.push(entry);
      continue;
    }
    if (!lines) {
      entry.status = 'new-bundle-missing';
      review.push(entry);
      continue;
    }
    if (h.from == null) {
      entry.status = 'path-only';
      confident.push(entry);
      continue;
    }
    const f = findLine(lines, h.src?.from, h.from, h.ctx, h.ordinal);
    entry.newFrom = f.line;
    entry.howFrom = f.how;
    if (f.score != null) entry.score = f.score;
    if (f.bestScore != null) entry.bestScore = f.bestScore;
    if (f.bestLine != null) entry.bestLine = f.bestLine;
    if (h.to != null && f.line != null) {
      const t = findRangeEnd(lines, h, f.line);
      entry.newTo = t.line;
      entry.howTo = t.how;
    }
    const okFrom = OK.has(f.how);
    const okTo = h.to == null || entry.newTo != null;
    if (okFrom && okTo) {
      entry.status = 'located';
      entry.newText = lines[entry.newFrom - 1];
      confident.push(entry);
    } else {
      entry.status = 'review';
      entry.newText =
        entry.newFrom != null ? lines[entry.newFrom - 1] : entry.bestLine ? lines[entry.bestLine - 1] : null;
      review.push(entry);
    }
  }
  fs.writeFileSync(MAP, JSON.stringify({ confident, review }, null, 1));
  console.log(`locate: ${confident.length} confident, ${review.length} for review -> ${path.relative(ROOT, MAP)}`);
  const byStatus = {};
  for (const e of [...confident, ...review]) {
    const k = `${e.status}/${e.howFrom ?? '-'}${e.to != null ? '/' + (e.howTo ?? 'to?') : ''}`;
    byStatus[k] = (byStatus[k] || 0) + 1;
  }
  console.table(byStatus);
  const byFile = {};
  for (const e of review) byFile[e.file.replace(/.*\//, '')] = (byFile[e.file.replace(/.*\//, '')] || 0) + 1;
  console.log('review by document:', JSON.stringify(byFile));
}

/** The replacement text for one citation (new bundle name + new line numbers). */
function rewrite(e) {
  const nums = e.from == null ? '' : `:${e.newFrom}${e.to != null ? `-${e.newTo}` : ''}`;
  if (e.implied) return nums;
  if (e.bundle.kind === 'primeng') return `${NEW_BUNDLE_BASENAME(e.bundle.name, e.bundle.ext ?? 'mjs')}${nums}`;
  return `${NEW_PRIMEUIX_PREFIX(e.bundle.pkg)}${e.bundle.rest}${nums}`;
}

function apply() {
  const { confident } = JSON.parse(fs.readFileSync(MAP, 'utf8'));
  const byFile = new Map();
  for (const e of confident) {
    if (!byFile.has(e.file)) byFile.set(e.file, []);
    byFile.get(e.file).push(e);
  }
  let changed = 0;
  let files = 0;
  for (const [file, entries] of byFile) {
    const abs = path.join(ROOT, file);
    const lines = readLines(abs);
    const byLine = new Map();
    for (const e of entries) {
      if (!byLine.has(e.docLine)) byLine.set(e.docLine, []);
      byLine.get(e.docLine).push(e);
    }
    for (const [no, es] of byLine) {
      let line = lines[no - 1];
      es.sort((a, b) => b.idx - a.idx);
      for (const e of es) {
        if (line.slice(e.idx, e.idx + e.text.length) !== e.text) {
          console.error(`skip ${file}:${no} - text moved since snapshot (${e.text})`);
          continue;
        }
        const nt = rewrite(e);
        if (nt === e.text) continue;
        line = line.slice(0, e.idx) + nt + line.slice(e.idx + e.text.length);
        changed++;
      }
      lines[no - 1] = line;
    }
    fs.writeFileSync(abs, lines.join('\n'));
    files++;
  }
  console.log(`apply: ${changed} citation(s) rewritten in ${files} file(s).`);
}

function review() {
  const { review: r, confident } = JSON.parse(fs.readFileSync(MAP, 'utf8'));
  const only = process.argv[3];
  const byFile = new Map();
  for (const e of r) {
    if (only && !e.file.includes(only)) continue;
    if (!byFile.has(e.file)) byFile.set(e.file, []);
    byFile.get(e.file).push(e);
  }
  for (const [file, es] of byFile) {
    console.log(`\n## ${file} (${es.length} to review)`);
    for (const e of es) {
      const old = e.src?.from != null ? JSON.stringify(e.src.from.trim().slice(0, 110)) : '(no source line)';
      const cand =
        e.newText != null
          ? ` | candidate ${e.bestLine ?? e.newFrom}: ${JSON.stringify(e.newText.trim().slice(0, 110))}`
          : '';
      console.log(
        `- line ${e.docLine}: ${e.text}  [${e.implied ? 'implied:' + e.via : 'explicit'} ${e.bundle ? (e.bundle.name ?? e.bundle.rest) : '?'}; ${e.status}/${e.howFrom ?? '-'}${e.howTo ? '/' + e.howTo : ''}${e.bestScore != null ? ' best ' + e.bestScore : ''}] old: ${old}${cand}`,
      );
    }
  }
  const fuzzy = confident.filter((e) => e.howFrom === 'fuzzy');
  if (fuzzy.length && !only) {
    console.log(`\n## ${fuzzy.length} fuzzy relocations (applied; spot-check)`);
    for (const e of fuzzy)
      console.log(
        `- ${e.file.replace(/.*\//, '')}:${e.docLine} ${e.text} -> :${e.newFrom} (score ${e.score}) old ${JSON.stringify(e.src.from.trim().slice(0, 80))} new ${JSON.stringify(e.newText.trim().slice(0, 80))}`,
      );
  }
}

const cmd = process.argv[2];
if (cmd === 'snapshot') snapshot();
else if (cmd === 'locate') locate();
else if (cmd === 'apply') apply();
else if (cmd === 'review') review();
else {
  console.error('usage: provenance-cites.mjs snapshot|locate|apply|review [file-filter]');
  process.exit(2);
}
