#!/usr/bin/env node
/**
 * check-guide-translations — the English ↔ German parity gate for the design-system
 * guide articles (ADR-0018).
 *
 * Every guide has an English canonical component and, once translated, a German twin
 * (`<id>-article.de.component.ts`) that extends it with its own template. The two
 * templates must say the same thing in two languages, so they must have the same
 * SKELETON. Fails (exit 1) when, for a guide with a twin:
 *   1. the twin is malformed: it does not extend the English class, does not use the
 *      shared `ARTICLE_STYLES` / `ARTICLE_IMPORTS`, or its id/class is not what the
 *      generated loader map expects (problems from sync-guide-translations.mjs);
 *   2. the `appGuideTab` sets differ (a tab missing or added in one language);
 *   3. the element / attribute / binding skeleton differs — compared as a tree,
 *      ignoring prose text nodes and the VALUES of translatable attributes
 *      (aria-label, title, alt, placeholder, label-like inputs; string literals in a
 *      bound translatable input). Block children are compared in order; inline
 *      phrasing children (code, em, strong, a, kbd, span, interpolations …) as a
 *      multiset, because German word order may move them inside a sentence;
 *   4. verbatim content differs: the text inside <pre>, <code>, <kbd> and <samp> is
 *      code, a file:line citation or a key name and stays byte-identical
 *      (whitespace-normalised);
 *   5. the generated loader map (guide-translations.generated.ts) is stale.
 * The first divergence per guide is reported with the line in each file.
 *
 * WARN (exit 0): a prose text node of six or more words that is identical in both
 * files — usually a sentence the translator missed. Titles of cited sources stay
 * English on purpose; a WARN is a prompt to look, not a failure.
 *
 * Guides without a twin are not checked: they fall back to English at runtime.
 *
 * Usage:  node scripts/check-guide-translations.mjs             # every twin
 *         node scripts/check-guide-translations.mjs accordion   # one or more ids
 *         node scripts/check-guide-translations.mjs --selftest  # prove the detector bites
 * Dependency-free (Node core only).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ARTICLES_DIR, GENERATED_FILE, findTwins, renderLoaderMap } from './sync-guide-translations.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
]);
const INLINE = new Set([
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'dfn',
  'em',
  'i',
  'kbd',
  'mark',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
]);
/** Elements whose text is code or a key name, never prose: compared byte for byte. */
const VERBATIM = new Set(['pre', 'code', 'kbd', 'samp']);
const TRANSLATABLE_EXACT = new Set(['alt', 'value', 'unit', 'content', 'ptooltip', 'tooltip', 'legend', 'text']);
const TRANSLATABLE_SUFFIX =
  /(label|placeholder|tooltip|message|title|header|legend|caption|summary|detail|description|text)$/i;
const NOT_TRANSLATABLE = /(labelledby|describedby|labelid|key|icon|class|style)$/i;

/** Is the VALUE of this attribute prose (so it may differ between the languages)? */
function isTranslatable(rawName) {
  const name = rawName
    .replace(/^\[|\]$/g, '')
    .replace(/^attr\./, '')
    .replace(/^bind-/, '');
  if (NOT_TRANSLATABLE.test(name)) return false;
  return TRANSLATABLE_EXACT.has(name.toLowerCase()) || TRANSLATABLE_SUFFIX.test(name);
}

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const STRING_LITERAL = /'(?:[^'\\]|\\.)*'/g;
/** In a bound object literal (e.g. [pt]), the value of a prose-named key may differ. */
const PROSE_KEY_LITERAL =
  /((?:'[\w-]*(?:label|title|placeholder|alt|description)'|\b\w*(?:label|Label|title|Title|placeholder|Placeholder))\s*:\s*)'(?:[^'\\]|\\.)*'/g;

// --- Template extraction ------------------------------------------------------

/** The inline template of a component file and the 1-based line it starts on. */
export function extractTemplate(src) {
  const m = /template:\s*`/.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  let i = start;
  while (i < src.length && !(src[i] === '`' && src[i - 1] !== '\\')) i++;
  return { text: src.slice(start, i), line: src.slice(0, start).split('\n').length };
}

// --- A small HTML + Angular control-flow parser ------------------------------

/** Parse a template into a tree: element / block / interp / text nodes, each with its line. */
export function parseTemplate(text, baseLine = 1) {
  const root = { type: 'root', tag: '#root', attrs: [], children: [], line: baseLine };
  const stack = [root];
  let i = 0;
  const lineAt = (pos) => baseLine + text.slice(0, pos).split('\n').length - 1;
  const top = () => stack[stack.length - 1];
  const inVerbatim = () => stack.some((n) => n.type === 'element' && VERBATIM.has(n.tag));
  const pushText = (from, to) => {
    if (to <= from) return;
    const raw = text.slice(from, to);
    // Interpolations and control-flow braces live in text; split them out.
    let j = 0;
    let buf = '';
    let bufStart = from;
    const flush = () => {
      if (buf.trim()) top().children.push({ type: 'text', text: norm(buf), line: lineAt(bufStart) });
      buf = '';
    };
    while (j < raw.length) {
      if (raw.startsWith('{{', j)) {
        flush();
        const end = raw.indexOf('}}', j + 2);
        const expr = raw.slice(j + 2, end < 0 ? raw.length : end);
        top().children.push({ type: 'interp', expr: norm(expr), line: lineAt(from + j) });
        j = end < 0 ? raw.length : end + 2;
        bufStart = from + j;
        continue;
      }
      if (!inVerbatim() && raw[j] === '@' && /[a-z]/.test(raw[j + 1] ?? '')) {
        flush();
        const kw = /^@(else if|[a-z]+)/.exec(raw.slice(j))[1];
        let k = j + 1 + kw.length;
        let params = '';
        while (/\s/.test(raw[k] ?? '')) k++;
        if (raw[k] === '(') {
          let depth = 0;
          const p0 = k;
          for (; k < raw.length; k++) {
            if (raw[k] === '(') depth++;
            else if (raw[k] === ')' && --depth === 0) break;
          }
          params = raw.slice(p0 + 1, k);
          k++;
        }
        while (/\s/.test(raw[k] ?? '')) k++;
        const block = {
          type: 'block',
          tag: '@' + kw,
          params: norm(params),
          attrs: [],
          children: [],
          line: lineAt(from + j),
        };
        top().children.push(block);
        if (raw[k] === '{') {
          stack.push(block);
          k++;
        }
        j = k;
        bufStart = from + j;
        continue;
      }
      if (!inVerbatim() && raw[j] === '}' && top().type === 'block') {
        flush();
        stack.pop();
        j++;
        bufStart = from + j;
        continue;
      }
      buf += raw[j];
      j++;
    }
    flush();
  };

  while (i < text.length) {
    const lt = text.indexOf('<', i);
    if (lt < 0) {
      pushText(i, text.length);
      break;
    }
    pushText(i, lt);
    if (text.startsWith('<!--', lt)) {
      const end = text.indexOf('-->', lt + 4);
      i = end < 0 ? text.length : end + 3;
      continue;
    }
    if (text[lt + 1] === '/') {
      const end = text.indexOf('>', lt);
      const tag = text
        .slice(lt + 2, end)
        .trim()
        .toLowerCase();
      // Close up to the matching open element (tolerant of stray markup).
      for (let s = stack.length - 1; s > 0; s--) {
        if (stack[s].type === 'element' && stack[s].tag === tag) {
          stack.length = s;
          break;
        }
      }
      i = end + 1;
      continue;
    }
    if (!/[a-zA-Z]/.test(text[lt + 1] ?? '')) {
      pushText(lt, lt + 1);
      i = lt + 1;
      continue;
    }
    // Opening tag: name, then attributes (quoted values may contain '>').
    let k = lt + 1;
    while (k < text.length && /[^\s/>]/.test(text[k])) k++;
    const tag = text.slice(lt + 1, k).toLowerCase();
    const attrs = [];
    let selfClosing = false;
    while (k < text.length) {
      while (/\s/.test(text[k])) k++;
      if (text[k] === '>') {
        k++;
        break;
      }
      if (text[k] === '/' && text[k + 1] === '>') {
        selfClosing = true;
        k += 2;
        break;
      }
      const n0 = k;
      while (k < text.length && /[^\s=/>]/.test(text[k])) k++;
      const name = text.slice(n0, k);
      let value = null;
      while (/\s/.test(text[k])) k++;
      if (text[k] === '=') {
        k++;
        while (/\s/.test(text[k])) k++;
        const q = text[k];
        if (q === '"' || q === "'") {
          const end = text.indexOf(q, k + 1);
          value = text.slice(k + 1, end);
          k = end + 1;
        } else {
          const v0 = k;
          while (k < text.length && /[^\s>]/.test(text[k])) k++;
          value = text.slice(v0, k);
        }
      }
      if (name) attrs.push({ name, value, line: lineAt(n0) });
      else k++;
    }
    const el = { type: 'element', tag, attrs, children: [], line: lineAt(lt) };
    top().children.push(el);
    if (!selfClosing && !VOID.has(tag)) stack.push(el);
    i = k;
  }
  return root;
}

// --- Canonical signatures -----------------------------------------------------

function attrSig(a) {
  if (a.value === null) return a.name;
  const bound = /^[[(*]|^bind-|^on-/.test(a.name);
  if (isTranslatable(a.name)) {
    // Prose: a static value may differ; in a bound one only the string literals may.
    return bound ? `${a.name}=${norm(a.value).replace(/'(?:[^'\\]|\\.)*'/g, "'…'")}` : `${a.name}=…`;
  }
  if (bound) return `${a.name}=${norm(a.value).replace(PROSE_KEY_LITERAL, "$1'…'")}`;
  return `${a.name}=${norm(a.value)}`;
}

const isInline = (n, verbatimParent) =>
  !verbatimParent && (n.type === 'interp' || (n.type === 'element' && INLINE.has(n.tag)));

/** Children that count: prose text drops out, except inside verbatim elements. */
function significant(node) {
  const verbatim = node.type === 'element' && VERBATIM.has(node.tag);
  return node.children.filter((c) => c.type !== 'text' || verbatim || insideVerbatim(c));
}
function insideVerbatim(c) {
  return c._verbatim === true;
}

/** Mark text nodes that live under a verbatim element (pre > code > text). */
function markVerbatim(node, inside = false) {
  const here = inside || (node.type === 'element' && VERBATIM.has(node.tag));
  for (const c of node.children ?? []) {
    if (c.type === 'text' || c.type === 'interp') c._verbatim = here;
    else markVerbatim(c, here);
  }
}

function headSig(n) {
  // Outside code, string literals in an interpolation are shown text (a fallback, a
  // ternary's two labels) and may be translated; inside <code>/<pre> they are code.
  if (n.type === 'interp') return `{{${n._verbatim ? n.expr : n.expr.replace(STRING_LITERAL, "'…'")}}}`;
  if (n.type === 'text') return `text:${JSON.stringify(n.text)}`;
  if (n.type === 'block') return `${n.tag}(${n.params})`;
  return `<${n.tag} ${n.attrs.map(attrSig).sort().join(' ')}>`;
}

function partition(n) {
  const verbatim = n.type === 'element' && VERBATIM.has(n.tag);
  const kids = significant(n);
  return {
    ordered: kids.filter((c) => !isInline(c, verbatim)),
    inline: kids.filter((c) => isInline(c, verbatim)),
  };
}

function sig(n) {
  if (n._sig) return n._sig;
  if (n.type === 'interp' || n.type === 'text') return (n._sig = headSig(n));
  const { ordered, inline } = partition(n);
  return (n._sig = `${headSig(n)}[${ordered.map(sig).join(',')}]{${inline.map(sig).sort().join(',')}}`);
}

// --- Comparison ----------------------------------------------------------------

const describe = (n) => (n ? headSig(n).slice(0, 110) : '(nothing)');

/** First divergence between two trees, or null. */
export function firstDivergence(en, de) {
  if (sig(en) === sig(de)) return null;
  if (headSig(en) !== headSig(de)) {
    return { enLine: en.line, deLine: de.line, what: `differs:\n      en: ${describe(en)}\n      de: ${describe(de)}` };
  }
  const a = partition(en);
  const b = partition(de);
  const n = Math.max(a.ordered.length, b.ordered.length);
  for (let k = 0; k < n; k++) {
    const x = a.ordered[k];
    const y = b.ordered[k];
    if (!x || !y) {
      return {
        enLine: (x ?? en).line,
        deLine: (y ?? de).line,
        what: x
          ? `missing in de (inside ${describe(en)}):\n      en: ${describe(x)}`
          : `extra in de (inside ${describe(de)}):\n      de: ${describe(y)}`,
      };
    }
    const d = firstDivergence(x, y);
    if (d) return d;
  }
  const count = (list) => {
    const m = new Map();
    for (const c of list) m.set(sig(c), (m.get(sig(c)) ?? 0) + 1);
    return m;
  };
  const ca = count(a.inline);
  const cb = count(b.inline);
  for (const c of a.inline) {
    if ((cb.get(sig(c)) ?? 0) < ca.get(sig(c))) {
      return {
        enLine: c.line,
        deLine: de.line,
        what: `inline node missing or changed in de (inside ${describe(de)}):\n      en: ${describe(c)}${c.type === 'element' && VERBATIM.has(c.tag) ? ' — verbatim text: ' + JSON.stringify(c.children.map((t) => t.text ?? sig(t)).join(' ')).slice(0, 80) : ''}`,
      };
    }
  }
  for (const c of b.inline) {
    if ((ca.get(sig(c)) ?? 0) < cb.get(sig(c))) {
      return {
        enLine: en.line,
        deLine: c.line,
        what: `inline node extra or changed in de (inside ${describe(en)}):\n      de: ${describe(c)}${c.type === 'element' && VERBATIM.has(c.tag) ? ' — verbatim text: ' + JSON.stringify(c.children.map((t) => t.text ?? sig(t)).join(' ')).slice(0, 80) : ''}`,
      };
    }
  }
  return { enLine: en.line, deLine: de.line, what: 'subtrees differ (unlocated)' };
}

function tabsOf(tree) {
  const out = [];
  (function walk(n) {
    for (const c of n.children ?? []) {
      if (c.type === 'element' && c.tag === 'ng-template') {
        const t = c.attrs.find((a) => a.name === 'appGuideTab');
        if (t) out.push(t.value);
      }
      walk(c);
    }
  })(tree);
  return out;
}

/** Prose text nodes (≥ 6 words) that are identical in both trees — probably untranslated. */
function identicalProse(en, de) {
  const words = (s) => s.split(/\s+/).filter((w) => /[A-Za-z]{2,}/.test(w)).length;
  const collect = (t) => {
    const out = [];
    (function walk(n) {
      for (const c of n.children ?? []) {
        if (c.type === 'text' && !c._verbatim && words(c.text) >= 6) out.push(c);
        else walk(c);
      }
    })(t);
    return out;
  };
  const enTexts = new Set(collect(en).map((c) => c.text));
  return collect(de).filter((c) => enTexts.has(c.text));
}

/** Compare one guide; returns { errors: string[], warns: string[] }. */
export function checkPair(id, enSrc, deSrc, enRel, deRel) {
  const errors = [];
  const warns = [];
  const enT = extractTemplate(enSrc);
  const deT = extractTemplate(deSrc);
  if (!enT || !deT) return { errors: [`${id}: no inline template in ${enT ? deRel : enRel}`], warns };
  const en = parseTemplate(enT.text, enT.line);
  const de = parseTemplate(deT.text, deT.line);
  markVerbatim(en);
  markVerbatim(de);
  const ta = tabsOf(en);
  const tb = tabsOf(de);
  if (ta.join(',') !== tb.join(',')) {
    errors.push(`${id}: appGuideTab sets differ — en [${ta.join(', ')}] vs de [${tb.join(', ')}]`);
    return { errors, warns };
  }
  const d = firstDivergence(en, de);
  if (d) errors.push(`${id}: first divergence at ${enRel}:${d.enLine} ↔ ${deRel}:${d.deLine} — ${d.what}`);
  for (const t of identicalProse(en, de).slice(0, 5))
    warns.push(`${id}: ${deRel}:${t.line} reads the same as the English text — untranslated? "${t.text.slice(0, 70)}"`);
  return { errors, warns };
}

/** Structural rules for the twin file itself. */
function twinShapeProblems(twin, enSrc, deSrc) {
  const out = [];
  const enClass = /^export class (\w+)/m.exec(enSrc)?.[1];
  if (!new RegExp(`class ${twin.className} extends ${enClass}\\b`).test(deSrc))
    out.push(`${twin.id}: ${twin.className} must extend the English ${enClass}.`);
  if (!/styles:\s*\[\s*ARTICLE_STYLES\s*\]/.test(deSrc))
    out.push(`${twin.id}: the twin must use styles: [ARTICLE_STYLES].`);
  if (!/imports:\s*ARTICLE_IMPORTS\b/.test(deSrc)) out.push(`${twin.id}: the twin must use imports: ARTICLE_IMPORTS.`);
  for (const prop of ['providers', 'encapsulation']) {
    const en = new RegExp(`^\\s{2}${prop}:\\s*(.+)$`, 'm').exec(enSrc)?.[1];
    const de = new RegExp(`^\\s{2}${prop}:\\s*(.+)$`, 'm').exec(deSrc)?.[1];
    if ((en ?? '') !== (de ?? ''))
      out.push(`${twin.id}: "${prop}" must match the English decorator (en: ${en ?? 'none'}, de: ${de ?? 'none'}).`);
  }
  return out;
}

// --- Self-test --------------------------------------------------------------------

function selftest() {
  const wrap = (body) => `@Component({\n  template: \`\n${body}\n\`,\n})`;
  const base = `<app-guide-shell [entryId]="'x'">
  <ng-template appGuideTab="usage">
    <p class="lead">The <code>value</code> input is a <strong>model</strong>, see {{ m.a }}.</p>
    <section class="pg" aria-label="Playground"><button type="button" [label]="'Save now'" (click)="go()"></button></section>
    @if (open()) { <p>Open state text here.</p> }
    <pre class="code-block"><code>{{ snippet }}</code></pre>
    <p>{{ copied() ? 'Copied' : 'Copy' }} <code>{{ mode || 'single' }}</code></p>
    <div [pt]="{ root: { 'aria-label': 'Birds', class: 'x' } }"></div>
    <kbd>Home</kbd>
  </ng-template>
</app-guide-shell>`;
  const cases = [
    ['identical twin passes', base, false],
    [
      'German prose, moved inline nodes, translated aria-label and [label] literal pass',
      base
        .replace(
          'The <code>value</code> input is a <strong>model</strong>, see {{ m.a }}.',
          'Siehe {{ m.a }}: Der Input <code>value</code> ist ein <strong>model</strong>.',
        )
        .replace('aria-label="Playground"', 'aria-label="Spielwiese"')
        .replace('[label]="\'Save now\'"', '[label]="\'Jetzt speichern\'"')
        .replace('Open state text here.', 'Text für den offenen Zustand.')
        .replace("'Copied' : 'Copy'", "'Kopiert' : 'Kopieren'")
        .replace("'aria-label': 'Birds'", "'aria-label': 'Vögel'"),
      false,
    ],
    ['a translated literal inside <code> fails', base.replace("mode || 'single'", "mode || 'einzeln'"), true],
    ['a changed non-prose key in a bound object fails', base.replace("class: 'x'", "class: 'y'"), true],
    ['a missing tab fails', base.replace('appGuideTab="usage"', 'appGuideTab="design"'), true],
    ['a changed binding fails', base.replace('(click)="go()"', '(click)="stop()"'), true],
    ['a changed entryId literal fails', base.replace('[entryId]="\'x\'"', '[entryId]="\'y\'"'), true],
    ['a dropped element fails', base.replace('<kbd>Home</kbd>', ''), true],
    ['translated <kbd> text fails', base.replace('<kbd>Home</kbd>', '<kbd>Pos1</kbd>'), true],
    ['translated <code> text fails', base.replace('<code>value</code>', '<code>Wert</code>'), true],
    [
      'a removed control-flow block fails',
      base.replace('@if (open()) { <p>Open state text here.</p> }', '<p>Immer offen.</p>'),
      true,
    ],
    ['a changed class fails', base.replace('class="lead"', 'class="intro"'), true],
  ];
  let failed = 0;
  for (const [name, de, shouldFail] of cases) {
    const r = checkPair('selftest', wrap(base), wrap(de), 'en.ts', 'de.ts');
    const ok = shouldFail ? r.errors.length > 0 : r.errors.length === 0;
    if (!ok) failed++;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} SELFTEST: ${name}${ok ? '' : ' — ' + (r.errors[0] ?? 'no error raised')}`);
  }
  console.log(
    failed
      ? `check-guide-translations --selftest: FAIL — ${failed} case(s)`
      : 'check-guide-translations --selftest: PASS',
  );
  return failed === 0;
}

// --- Main -------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) process.exit(selftest() ? 0 : 1);
  const wanted = args.filter((a) => !a.startsWith('--'));
  const { twins, problems } = findTwins();
  // Named guides: another guide's broken twin (one being written in parallel) is not theirs to fix.
  const errors = wanted.length ? problems.filter((p) => wanted.some((id) => p.includes(`/${id}/`))) : [...problems];
  const warns = [];
  const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

  for (const id of wanted) {
    if (!fs.existsSync(path.join(ARTICLES_DIR, id, `${id}-article.component.ts`))) errors.push(`${id}: no such guide.`);
    else if (!twins.some((t) => t.id === id))
      errors.push(`${id}: no German twin yet (${id}/${id}-article.de.component.ts).`);
  }
  const selected = wanted.length ? twins.filter((t) => wanted.includes(t.id)) : twins;
  for (const twin of selected) {
    const enFile = path.join(ARTICLES_DIR, twin.id, `${twin.id}-article.component.ts`);
    const enSrc = fs.readFileSync(enFile, 'utf8');
    const deSrc = fs.readFileSync(twin.file, 'utf8');
    errors.push(...twinShapeProblems(twin, enSrc, deSrc));
    const r = checkPair(twin.id, enSrc, deSrc, rel(enFile), rel(twin.file));
    errors.push(...r.errors);
    warns.push(...r.warns);
  }
  if (!problems.length && !wanted.length) {
    const current = fs.existsSync(GENERATED_FILE) ? fs.readFileSync(GENERATED_FILE, 'utf8').replace(/\r\n/g, '\n') : '';
    if (current !== renderLoaderMap(twins))
      errors.push(`${rel(GENERATED_FILE)} is stale — run: node scripts/sync-guide-translations.mjs`);
  }

  const line = '='.repeat(74);
  console.log(line);
  console.log(`  check-guide-translations - ${selected.length} German twin(s) checked against English`);
  console.log(line);
  for (const w of warns) console.log(`  WARN  ${w}`);
  for (const e of errors) console.log(`  FAIL  ${e}`);
  if (errors.length) {
    console.log(
      `\n  ${errors.length} problem(s). The twin must keep the English skeleton (directives/guide-authoring.md).`,
    );
    process.exit(1);
  }
  console.log(
    `  PASS - ${selected.length} twin(s) in step with English; ${twins.length} of the guides have a German twin.`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
