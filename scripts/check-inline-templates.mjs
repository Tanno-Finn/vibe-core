#!/usr/bin/env node
/**
 * check-inline-templates — the inline-literal integrity gate.
 *
 * Background: an Angular inline template is a JS template literal
 * (`template: <backtick>...<backtick>`). A backtick typed into the TEMPLATE
 * CONTENT — most often inside an HTML comment that quotes a binding name, the
 * way one would quote code in Markdown — terminates that literal early. What
 * followed as markup is then parsed as TypeScript, and the file is syntactically
 * dead. The failure is nasty because it is silent in the worst place: `ng serve`
 * keeps serving the last good bundle, so the page looks fine while every later
 * edit is invisible. Nothing else in the toolchain catches it early — this gate
 * does, deterministically, before a build.
 *
 * The decorator's OTHER inline literal is `styles:` — written bare
 * (`styles: <backtick>…<backtick>`) or as an array (`styles: [<backtick>…<backtick>]`).
 * It breaks exactly the same way and twice actually did: a backtick inside a CSS
 * comment, and a `${…}` sequence written as literal CSS text (a `content:` value,
 * an escaped glyph) which the compiler reads as an interpolation into an
 * undefined identifier. The gate was blind to both because it only tracked
 * `template:`. It now tracks both, and calls the two kinds apart in its output.
 *
 * Detection: the file is run through a small TypeScript-aware lexer (comments,
 * '…' / "…" strings, and template literals with `${…}` interpolation, nested).
 * A backtick opened directly after a `template:` or `styles:` property — or as a
 * further element of an open `styles: [ … ]` array — is tracked; when it closes,
 * the gate looks at what follows. A healthy inline literal is followed by the
 * decorator continuing — `,` `}` `)` `]` `;` or end of file. Anything else
 * (markup, CSS, prose, a bare identifier) means the literal ended somewhere it
 * should not have. A literal that never closes at all is reported the same way.
 *
 * The lexer matters: this kit's guide articles legitimately embed the TEXT
 * "template: <escaped backtick>" inside snippet strings they render on the page.
 * Those live inside another literal, so the lexer never treats them as code and
 * they are correctly ignored — a plain regex would flag every one of them.
 *
 * Dependency-free (Node core only).
 *
 * Usage:  node scripts/check-inline-templates.mjs [dir]
 *         VERBOSE=1 lists every file and how many inline literals it holds, so
 *         a green run can be told apart from a run that matched nothing.
 *         SELFTEST=1 additionally lexes a catalogue of planted damage patterns
 *         (template and styles, bare and array form) and of healthy shapes that
 *         must stay silent, and fails if the detector has gone dead or noisy.
 *         [dir] overrides the scanned root (used to test the gate on fixtures).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, 'src');

const BACKTICK = String.fromCharCode(96);
const BACKSLASH = String.fromCharCode(92);

/** A backtick opened right after this is an Angular inline template. */
const TEMPLATE_PROP = /template\s*:\s*$/;
/** A backtick opened right after this is a bare inline styles literal. */
const STYLES_PROP = /styles\s*:\s*$/;
/** …and after this, the FIRST element of a `styles: [ … ]` array. */
const STYLES_ARRAY_OPEN = /styles\s*:\s*\[\s*$/;
/** How far back the lexer looks for one of the property markers above. */
const LOOKBEHIND = 60;

/** What may legitimately follow a closing inline literal inside a decorator. */
const LEGIT_CONTINUATION = /^[,)\];}]/;

/** Human label per literal kind, used in both the report and the counters. */
const KIND_LABEL = { template: 'inline template', styles: 'inline styles' };

/** Collect every .ts file under src/, excluding generated output. */
function collectFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      collectFiles(full, acc);
    } else if (entry.name.endsWith('.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

const lineOf = (src, index) => src.slice(0, index).split('\n').length;

/**
 * Skip whitespace and comments forward from `i`; return the next code index.
 * Used to read what really follows a closing inline template.
 */
function nextCodeIndex(src, i) {
  while (i < src.length) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
      i++;
    } else if (c === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      if (nl < 0) return src.length;
      i = nl + 1;
    } else if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      if (end < 0) return src.length;
      i = end + 2;
    } else {
      return i;
    }
  }
  return src.length;
}

/**
 * Lex `src` and return the findings for its inline template / styles literals.
 *
 * The stack holds the nesting of literal contexts: a `code` frame counts braces
 * so a `${…}` interpolation knows which `}` closes it; a `template` frame is
 * inside a template literal and carries `kind` ('template' | 'styles' | null)
 * when a decorator property opened it.
 *
 * `styles: [ … ]` needs one bit of state beyond the lookbehind: only the FIRST
 * element is preceded by `styles: [`, the rest by `, `. The code frame therefore
 * remembers that a styles array is open (set when the first element opens, clear
 * at the `]` that closes it), so every element of the array is tracked, not just
 * the first.
 */
function scan(src) {
  const findings = [];
  const stack = [{ type: 'code', brace: 0, stylesArray: false }];
  const counts = { template: 0, styles: 0 };
  let i = 0;

  while (i < src.length) {
    const frame = stack[stack.length - 1];
    const c = src[i];

    if (frame.type === 'template') {
      if (c === BACKSLASH) {
        i += 2;
        continue;
      }
      if (c === '$' && src[i + 1] === '{') {
        stack.push({ type: 'code', brace: 0, stylesArray: false });
        i += 2;
        continue;
      }
      if (c === BACKTICK) {
        stack.pop();
        if (frame.kind) {
          const after = nextCodeIndex(src, i + 1);
          const rest = src.slice(after, after + 120);
          if (rest.length > 0 && !LEGIT_CONTINUATION.test(rest)) {
            findings.push({
              kind: frame.kind,
              openLine: frame.openLine,
              closeLine: lineOf(src, i),
              before: src
                .slice(Math.max(frame.openIndex, i - 70), i)
                .replace(/\s+/g, ' ')
                .trim(),
              after: rest.split('\n')[0].trim().slice(0, 80),
            });
          }
        }
        i++;
        continue;
      }
      i++;
      continue;
    }

    // --- code frame ---
    if (c === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      i = nl < 0 ? src.length : nl + 1;
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end < 0 ? src.length : end + 2;
      continue;
    }
    if (c === "'" || c === '"') {
      i++;
      while (i < src.length) {
        if (src[i] === BACKSLASH) {
          i += 2;
          continue;
        }
        if (src[i] === c || src[i] === '\n') {
          i++;
          break;
        }
        i++;
      }
      continue;
    }
    if (c === BACKTICK) {
      const behind = src.slice(Math.max(0, i - LOOKBEHIND), i);
      let kind = null;
      if (TEMPLATE_PROP.test(behind)) {
        kind = 'template';
      } else if (STYLES_ARRAY_OPEN.test(behind)) {
        kind = 'styles';
        frame.stylesArray = true; // the remaining elements are styles too
      } else if (STYLES_PROP.test(behind) || frame.stylesArray) {
        kind = 'styles';
      }
      if (kind) counts[kind]++;
      stack.push({ type: 'template', kind, openIndex: i + 1, openLine: lineOf(src, i) });
      i++;
      continue;
    }
    if (c === ']') {
      frame.stylesArray = false;
      i++;
      continue;
    }
    if (c === '{') {
      frame.brace++;
      i++;
      continue;
    }
    if (c === '}') {
      if (frame.brace === 0 && stack.length > 1) stack.pop();
      else frame.brace--;
      i++;
      continue;
    }
    i++;
  }

  // A literal still open at end of file never terminated.
  for (const frame of stack) {
    if (frame.type === 'template' && frame.kind) {
      findings.push({
        kind: frame.kind,
        openLine: frame.openLine,
        closeLine: null,
        before: src
          .slice(frame.openIndex, frame.openIndex + 70)
          .replace(/\s+/g, ' ')
          .trim(),
        after: '<end of file>',
      });
    }
  }
  return { findings, counts };
}

// --- Run ---------------------------------------------------------------------
if (!fs.existsSync(SRC_DIR)) {
  console.error(`FAIL  source directory not found: ${SRC_DIR}`);
  process.exit(1);
}

const files = collectFiles(SRC_DIR);
const errors = [];
const total = { template: 0, styles: 0 };

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('template:') && !src.includes('styles:')) continue;
  const { findings, counts } = scan(src);
  total.template += counts.template;
  total.styles += counts.styles;
  const seen = counts.template + counts.styles;
  if (process.env.VERBOSE && seen) {
    console.log(
      `  ok   ${path.relative(ROOT, file).replace(/\\/g, '/')} — ` +
        `${counts.template} inline template(s), ${counts.styles} inline styles`,
    );
  }
  for (const f of findings) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const where =
      f.closeLine === null
        ? `opened line ${f.openLine}, never closed`
        : `opened line ${f.openLine}, closed line ${f.closeLine}`;
    errors.push(
      `${rel} — ${KIND_LABEL[f.kind]} ${where}\n         literal text before the close: …${f.before}\n         code after the close:           ${f.after}`,
    );
  }
}

// --- Self-test (SELFTEST=1) --------------------------------------------------
// A gate that never fires is indistinguishable from a gate that cannot fire.
// The catalogue below is the damage this gate exists for, in both literal kinds
// and both `styles:` spellings, plus the healthy shapes that must stay silent —
// including the one that made a plain regex unusable here: an article snippet
// that quotes "template: <backtick>" as TEXT inside another literal.
if (process.env.SELFTEST) {
  const B = BACKTICK;
  const damage = [
    [
      'template, backtick in an HTML comment',
      `@Component({ template: ${B}<!-- the ${B}items${B} input --><p>hi</p>${B} })`,
    ],
    [
      'styles, bare, backtick in a CSS comment',
      `@Component({ styles: ${B}/* the ${B}--gap${B} token */ .a { gap: 1px; }${B} })`,
    ],
    [
      'styles, array, backtick in a CSS comment',
      `@Component({ styles: [${B}/* ${B}--gap${B} */ .a { gap: 1px; }${B}] })`,
    ],
    ['styles, array second element, backtick', `@Component({ styles: [${B}.a{}${B}, ${B}/* ${B}x${B} */ .b{}${B}] })`],
    ['styles, bare, never closed', `@Component({ styles: ${B}.a { color: red; } })`],
  ];
  const healthy = [
    ['template + bare styles', `@Component({ template: ${B}<p>hi</p>${B}, styles: ${B}p { margin: 0; }${B} })`],
    [
      'template + styles array, two entries',
      `@Component({ template: ${B}<p>hi</p>${B}, styles: [${B}p{margin:0}${B}, ${B}a{color:red}${B}] })`,
    ],
    ['styles with a real ${…} interpolation', `const g = '1px'; @Component({ styles: [${B}p { gap: \${g}; }${B}] })`],
    ['an array of plain strings after styles', `@Component({ styles: ['p{margin:0}'], template: ${B}<p>ok</p>${B} })`],
    [
      'a snippet that quotes the syntax as TEXT',
      `const doc = ${B}Write it as template: \\${B}<p>x</p>\\${B} in the decorator, and styles: \\${B}p{}\\${B}.${B};`,
    ],
  ];
  for (const [label, src] of damage) {
    if (scan(src).findings.length === 0)
      errors.push(`SELFTEST: planted damage went unflagged — ${label}. The detector is dead.`);
  }
  for (const [label, src] of healthy) {
    const f = scan(src).findings;
    if (f.length)
      errors.push(
        `SELFTEST: false positive on a healthy shape — ${label} (${f.map((x) => KIND_LABEL[x.kind]).join(', ')}).`,
      );
  }
  const kinds = scan(healthy[1][1]).counts;
  if (kinds.template !== 1 || kinds.styles !== 2) {
    errors.push(
      `SELFTEST: styles array under-counted — expected 1 template / 2 styles, got ${kinds.template} / ${kinds.styles}.`,
    );
  }
}

// Silent-pass guard: a scan that lexed 0 files, or lexed files but matched 0
// inline templates, would still print "PASS — none terminates early" — true
// only because nothing was looked at. This app inlines every component
// template/styles (the whole point of this gate), so both counts should
// never legitimately be 0 while SRC_DIR exists.
if (errors.length === 0 && files.length === 0) {
  errors.push(`0 .ts files found under ${SRC_DIR} — the scan ran over nothing.`);
} else if (errors.length === 0 && total.template === 0 && total.styles === 0) {
  errors.push(
    `${files.length} .ts file(s) lexed but 0 inline template(s)/styles literal(s) were found — the TEMPLATE_PROP/STYLES_PROP detection is likely broken, not the codebase suddenly template-free.`,
  );
}

const line = '  ' + '-'.repeat(72);
console.log(line);
console.log('  check-inline-templates — backticks inside Angular template/styles literals');
console.log(line);

if (errors.length === 0) {
  console.log(`  PASS — ${files.length} .ts file(s) lexed, ${total.template} inline template(s)`);
  console.log(`         and ${total.styles} inline styles literal(s) checked, none terminates early.`);
  if (process.env.SELFTEST) console.log('  ok   SELFTEST: 5 damage patterns flagged, 5 healthy shapes silent.');
  console.log(line);
  process.exit(0);
}
for (const e of errors) console.log('  FAIL ' + e);
console.log(line);
console.log(`  ${errors.length} broken inline literal(s). A backtick in the template or CSS`);
console.log("  content ends the literal early — remove it (quote code with '…' instead).");
process.exit(1);
