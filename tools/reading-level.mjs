#!/usr/bin/env node
/**
 * reading-level.mjs — advice on how easy a text is to read (kit tool `reading-level`,
 * capability `check:reading-level`).
 *
 * WHAT: per section (a heading starts one): sentences, words per sentence (mean and
 * max), LIX, the share of long words (more than 6 letters), and every sentence over the
 * limit (15 words with --easy, else 25; --max-sentence sets it). With --easy and a German
 * text it also lists words over 12 letters with neither a Mediopunkt (·) nor a hyphen —
 * the kit's `de-easy` house style splits long compounds as "Wasser·kreislauf". Input is a
 * Markdown or HTML file, or the strings of one UI module
 * (`src/assets/i18n/modules/<lang>/<namespace>.json`, a section per top-level key).
 *
 * HOW: Markdown goes through `marked`, HTML through `jsdom`; the content root is `<main>`,
 * else `<body>`. Every block (paragraph, list item, table cell …) is split into sentences at
 * `.`, `!`, `?` and `…`; a block without an end mark counts as one sentence (a list item,
 * say). An abbreviation made of single letters with dots (`z. B.`, `e.g.`), a few common
 * ones (`bzw.`, `usw.`, `ca.` …), `No.`/`Nr.` before a number, and an ordinal (`3.`, only in a
 * language that writes ordinals that way, like German, or when the language is unknown) do not
 * end a sentence.
 * Headings name sections and are not counted; `pre`, `script`, `style`, `template` and
 * `aria-hidden` content are skipped; `{placeholders}` and tags inside UI strings are
 * removed. LIX = words per sentence + 100 × long words / words (Björnsson): under 30 very
 * easy, 30–40 easy, 40–50 medium, 50–60 hard, above 60 very hard. Advice only: exit 0,
 * unless --max-sentence is given and a sentence is longer (exit 1).
 *
 * WHAT IT CANNOT SEE: whether a text is understandable. Heuristics do not prove Easy
 * Language; people from the target group do. Also not: word choice (foreign words,
 * abstract nouns, negations), whether a hard word is explained, layout and pictures.
 *
 * Run:  node tools/reading-level.mjs <file.md|file.html> [--easy] [--lang de]
 *       node tools/reading-level.mjs --i18n home --lang de-easy
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { EXIT, ToolError, inputFile, positiveInt, readText, rel, requireDep, runTool } from './lib/cli.mjs';

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'PRE', 'NOSCRIPT', 'SVG']);
const BLOCK = new Set(
  'ADDRESS ARTICLE ASIDE BLOCKQUOTE CAPTION DD DETAILS DIALOG DIV DL DT FIELDSET FIGCAPTION FIGURE FOOTER FORM HEADER HR LABEL LI MAIN NAV OL P SECTION SUMMARY TABLE TBODY TD TFOOT TH THEAD TR UL BR'.split(
    ' ',
  ),
);
const ABBREV = new Set([
  'bzw',
  'usw',
  'ca',
  'vgl',
  'etc',
  'nr',
  'dr',
  'mr',
  'mrs',
  'ms',
  'st',
  'sog',
  'ggf',
  'evtl',
  'inkl',
  'zb',
  'dh',
  'uvm',
  'vs',
]);
// Before a number only: "No. 5" — "The answer is no. Then …" ends a sentence.
const ABBREV_BEFORE_NUMBER = new Set(['no']);
// Languages that write ordinals as "3." ("am 3. Oktober"). Elsewhere "It is 42. Then …" ends a sentence.
const DOTTED_ORDINALS = /^(de|da|nb|nn|no|fi|is|et|lv|cs|sk|sl|hr|sr|bs|pl|hu|tr|eu)(-|$)/i;
const LIX_BANDS = [
  [30, 'very easy'],
  [40, 'easy'],
  [50, 'medium'],
  [60, 'hard'],
  [Infinity, 'very hard'],
];

const letters = (w) => (w.match(/\p{L}/gu) || []).length;
const clean = (s) =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Words of a text: whitespace-separated tokens holding a letter or digit, edge punctuation removed. */
const wordsOf = (text) =>
  text
    .split(/\s+/)
    .map((t) => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}.·-]+$/gu, ''))
    .filter((t) => /[\p{L}\p{N}]/u.test(t));

/**
 * Splits one block of text into sentences (arrays of raw tokens). `ordinals`: the language
 * writes ordinals as "3.", so a number with a dot does not end a sentence (unknown language: yes).
 */
function sentencesOf(block, ordinals = true) {
  const tokens = block.split(/\s+/).filter(Boolean);
  const out = [];
  let cur = [];
  tokens.forEach((tok, i) => {
    cur.push(tok);
    const bare = tok.replace(/["'»«“”„‘’)\]]+$/u, '');
    if (!/[.!?…]$/.test(bare)) return;
    const stem = bare.replace(/[.!?…]+$/, '');
    const last = i === tokens.length - 1;
    const key = stem.toLowerCase().replace(/\./g, '');
    const nextIsNumber = /^\d/.test(tokens[i + 1] ?? '');
    const nextIsLower = /^\p{Ll}/u.test(tokens[i + 1] ?? '');
    const abbrev =
      bare.endsWith('.') &&
      !/[!?…]/.test(bare) &&
      (/^(\p{L}\.)*\p{L}$/u.test(stem) ||
        ABBREV.has(key) ||
        (ABBREV_BEFORE_NUMBER.has(key) && nextIsNumber) ||
        (/^\d+$/.test(stem) && (ordinals || nextIsLower)));
    if (abbrev && !last) return;
    out.push(cur);
    cur = [];
  });
  if (cur.length) out.push(cur);
  return out.map((s) => s.join(' ')).filter((s) => wordsOf(s).length);
}

/** Sections [{ title, blocks: [text] }] of an HTML document's content root. */
function sectionsOfHtml(doc) {
  const rootEl = doc.querySelector('main') || doc.body;
  const sections = [{ title: '(before the first heading)', blocks: [] }];
  let buf = '';
  const flush = () => {
    const t = clean(buf);
    if (t) sections[sections.length - 1].blocks.push(t);
    buf = '';
  };
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        buf += child.textContent;
        continue;
      }
      if (child.nodeType !== 1) continue;
      if (SKIP.has(child.tagName.toUpperCase()) || child.getAttribute('aria-hidden') === 'true') continue;
      if (/^H[1-6]$/.test(child.tagName)) {
        flush();
        sections.push({ title: clean(child.textContent), blocks: [] });
        continue;
      }
      const block = BLOCK.has(child.tagName.toUpperCase());
      // Two elements side by side (`<span>A</span><span>B</span>`, often laid out as separate
      // items) are two words, not one.
      if (child.previousSibling?.nodeType === 1) buf += ' ';
      if (block) flush();
      walk(child);
      if (block) flush();
    }
  };
  walk(rootEl);
  flush();
  return sections.filter((s) => s.blocks.length);
}

/** Sections of a UI module: one per top-level key, a block per string. */
function sectionsOfModule(json) {
  const strings = (v, out = []) => {
    if (typeof v === 'string') out.push(clean(v));
    else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
    else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, out));
    return out;
  };
  return Object.entries(json)
    .map(([key, v]) => ({ title: key, blocks: strings(v).filter(Boolean) }))
    .filter((s) => s.blocks.length);
}

const round = (n) => Math.round(n * 10) / 10;
const band = (lix) => LIX_BANDS.find(([max]) => lix < max)[1];

function measure({ title, blocks }, { limit, compounds, ordinals }) {
  const sentences = blocks.flatMap((b) => sentencesOf(b, ordinals));
  const counts = sentences.map((s) => wordsOf(s).length);
  const words = sentences.flatMap(wordsOf);
  const long = words.filter((w) => letters(w) > 6).length;
  const n = sentences.length;
  const lix = n && words.length ? round(words.length / n + (100 * long) / words.length) : 0;
  return {
    title,
    sentences: n,
    words: words.length,
    meanWords: n ? round(words.length / n) : 0,
    maxWords: n ? Math.max(...counts) : 0,
    lix,
    longWordShare: words.length ? round((100 * long) / words.length) : 0,
    longSentences: sentences
      .map((s, i) => ({ words: counts[i], text: s.length > 140 ? `${s.slice(0, 137)}…` : s }))
      .filter((s) => s.words > limit),
    longCompounds: compounds
      ? [...new Set(words.filter((w) => letters(w) > 12 && !/[·‐-]/.test(w)).map((w) => w.replace(/\.+$/, '')))]
      : [],
  };
}

await runTool({
  id: 'reading-level',
  summary: 'advice on how easy a text is to read (sentence length, LIX, Easy-Language flags)',
  usage: 'node tools/reading-level.mjs <file.md|file.html> | --i18n <namespace> --lang <code> [options]',
  description: [
    'Counts sentences, words and long words per section and lists sentences that are too long.',
    'It is advice: numbers cannot prove that a text is easy — people from the audience can.',
  ],
  options: {
    i18n: { type: 'string', arg: '<namespace>', help: 'read the UI strings of one module instead of a file' },
    lang: {
      type: 'string',
      arg: '<code>',
      help: 'language of the text (needed with --i18n; a code ending in -easy turns on --easy)',
      defaultText: '<html lang> of the file',
    },
    easy: { type: 'boolean', help: 'Easy Language: sentence limit 15, and for German the long-compound list' },
    'max-sentence': { type: 'string', arg: '<n>', help: 'exit 1 if any sentence has more than n words' },
  },
  examples: [
    'node tools/reading-level.mjs out/teacher/learning-page.html --easy',
    'node tools/reading-level.mjs --i18n home --lang de-easy',
  ],
  async run({ values, positionals, report, root }) {
    const max = positiveInt('max-sentence', values['max-sentence']);
    let sections;
    let lang = values.lang;
    let source;
    if (values.i18n) {
      if (positionals.length) throw new ToolError(EXIT.USAGE, 'give either a file or --i18n, not both.');
      if (!lang) throw new ToolError(EXIT.USAGE, '--i18n needs --lang <code> (e.g. de-easy).');
      if (!/^[a-z]{2,3}(-easy)?$/.test(lang) || !/^[A-Za-z][\w-]*$/.test(values.i18n)) {
        throw new ToolError(EXIT.USAGE, `--lang "${lang}" or --i18n "${values.i18n}" is not a module name.`);
      }
      const file = join(root, 'src', 'assets', 'i18n', 'modules', lang, `${values.i18n}.json`);
      if (!existsSync(file)) throw new ToolError(EXIT.USAGE, `no UI module ${rel(root, file)}.`);
      sections = sectionsOfModule(JSON.parse(readText(file)));
      source = rel(root, file);
    } else {
      if (positionals.length !== 1) throw new ToolError(EXIT.USAGE, 'give one .md or .html file, or --i18n.');
      const file = inputFile(root, positionals[0], { exts: ['.md', '.markdown', '.html', '.htm'] });
      const { JSDOM } = await requireDep('jsdom');
      let html = readText(file);
      if (/\.(md|markdown)$/i.test(file)) {
        const { marked } = await requireDep('marked');
        html = `<!doctype html><html><body><main>${marked.parse(html.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''))}</main></body></html>`;
      }
      const doc = new JSDOM(html).window.document;
      lang ??= doc.documentElement.getAttribute('lang') || undefined;
      sections = sectionsOfHtml(doc);
      source = rel(root, file);
    }
    const easy = !!values.easy || /-easy$/.test(lang || '');
    const german = /^de(-|$)/i.test(lang || '');
    const limit = max ?? (easy ? 15 : 25);
    const ordinals = !lang || DOTTED_ORDINALS.test(lang);
    const results = sections.map((s) => measure(s, { limit, compounds: easy && german, ordinals }));
    const all = measure(
      { title: '(whole text)', blocks: sections.flatMap((s) => s.blocks) },
      { limit, compounds: false, ordinals },
    );

    report.say(`${source}${lang ? ` (${lang}${easy ? ', Easy Language' : ''})` : ''} — sentence limit ${limit} words`);
    for (const r of results) {
      report.say('');
      report.say(`## ${r.title}`);
      report.say(
        `  ${r.sentences} sentence(s), ${r.words} words, ${r.meanWords} words per sentence (max ${r.maxWords}), LIX ${r.lix} (${band(r.lix)}), long words ${r.longWordShare} %`,
      );
      for (const s of r.longSentences) {
        report.say(`  - ${s.words} words: ${s.text}`);
        report.finding({ kind: 'long-sentence', section: r.title, ...s }, { blocking: max !== undefined });
      }
      if (r.longCompounds.length) {
        report.say(`  long words without "·" or "-": ${r.longCompounds.join(', ')}`);
        for (const w of r.longCompounds) report.finding({ kind: 'long-compound', section: r.title, word: w });
      }
    }
    report.say('');
    report.say(
      `Whole text: ${all.sentences} sentence(s), ${all.words} words, ${all.meanWords} words per sentence, LIX ${all.lix} (${band(all.lix)}).`,
    );
    if (max !== undefined && report.exitCode === EXIT.FINDING) {
      report.say(`  FAIL: at least one sentence has more than --max-sentence ${max} words.`);
    }
    if (!lang) report.warn('no language known (give --lang): the German long-compound check did not run');
    report.data.lang = lang ?? null;
    report.data.easy = easy;
    report.data.limit = limit;
    report.data.sections = results;
    report.data.total = { sentences: all.sentences, words: all.words, meanWords: all.meanWords, lix: all.lix };
    report.notChecked.push(
      'whether the text is understandable: numbers do not prove Easy Language, people from the target group do',
      'word choice (foreign words, abstract nouns, negations) and whether hard words are explained',
      ...(easy && lang && !german ? ['the long-compound list (German only)'] : []),
    );
  },
});
