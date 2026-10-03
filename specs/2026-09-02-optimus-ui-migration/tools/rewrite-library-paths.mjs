#!/usr/bin/env node
/**
 * Rewrites the library package paths the schematic never sees - the ones inside prose,
 * code samples and citations of the guides (`*.agent.md`) and workshop articles
 * (`*-article.component.ts`) - from the PrimeNG names to the Optimus names (ADR-0014):
 *
 *   'primeng/<module>'                      -> '@openng/optimus-ui/<module>'      (import samples)
 *   primeng/fesm2022/<bundle>               -> @openng/optimus-ui/fesm2022/<bundle>
 *   primeng/types/<typing>                  -> @openng/optimus-ui/types/<typing>
 *   @primeuix/{themes,styles,utils,motion,styled}[/...] -> @openng/optimus-ui-<pkg>[/...]
 *   providePrimeNG -> provideOptimus, PrimeNGConfigType -> OptimusConfigType
 *
 * Inside an Angular inline template a raw `@` starts a control-flow block, so there the
 * `@` is written as `&#64;` (the form the articles already use); everywhere else in a
 * .ts file - comments, TS strings, code-sample literals - it is a plain `@`. The
 * template region is the first `template: \`` literal up to its closing backtick.
 * Markdown gets the plain `@`.
 *
 *   node rewrite-library-paths.mjs          # rewrite in place, print a per-file count
 *   node rewrite-library-paths.mjs --dry    # count only
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const DRY = process.argv.includes('--dry');
const SOURCES = [
  { dir: 'src/assets/design-system/guides', ext: /\.agent\.md$/ },
  { dir: 'src/app/dev/articles', ext: /\.ts$/ },
];

function walk(dir, ext, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, out);
    else if (ext.test(e.name)) out.push(p);
  }
  return out;
}

/** [start, end) of the component's inline template literal, or null. */
function templateSpan(src) {
  const m = /\btemplate:\s*`/.exec(src);
  if (!m) return null;
  const start = m.index + m[0].length;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '\\') {
      i++;
      continue;
    }
    if (src[i] === '`') return [start, i];
  }
  return null;
}

const RULES = [
  // import samples: 'primeng/card', "primeng/card", &#39;primeng/card&#39;
  [/(['"]|&#39;)primeng\/([a-z]+)\1/g, (at) => (_, q, mod) => `${q}${at}openng/optimus-ui/${mod}${q}`],
  // bundle and typing paths
  [/(?<![\w@/])primeng\/fesm2022\//g, (at) => () => `${at}openng/optimus-ui/fesm2022/`],
  [/(?<![\w@/])primeng\/types\//g, (at) => () => `${at}openng/optimus-ui/types/`],
  // companion packages, entity-escaped or plain
  [/(?:&#64;|@)primeuix\/(themes|styles|utils|motion|styled)\b/g, (at) => (_, pkg) => `${at}openng/optimus-ui-${pkg}`],
  // identifiers
  [/providePrimeNG/g, () => () => 'provideOptimus'],
  [/PrimeNGConfigType/g, () => () => 'OptimusConfigType'],
];

function rewriteRegion(text, at) {
  let n = 0;
  for (const [re, make] of RULES) {
    text = text.replace(re, (...args) => {
      n++;
      return make(at)(...args);
    });
  }
  return [text, n];
}

let total = 0;
for (const s of SOURCES) {
  for (const f of walk(path.join(ROOT, s.dir), s.ext)) {
    const src = fs.readFileSync(f, 'utf8');
    let out;
    let n = 0;
    if (f.endsWith('.md')) {
      [out, n] = rewriteRegion(src, '@');
    } else {
      const span = templateSpan(src);
      if (!span) {
        [out, n] = rewriteRegion(src, '@');
      } else {
        const [a, b] = span;
        const [head, n1] = rewriteRegion(src.slice(0, a), '@');
        const [tpl, n2] = rewriteRegion(src.slice(a, b), '&#64;');
        const [tail, n3] = rewriteRegion(src.slice(b), '@');
        out = head + tpl + tail;
        n = n1 + n2 + n3;
      }
    }
    if (n) {
      total += n;
      console.log(`${n}\t${path.relative(ROOT, f).replace(/\\/g, '/')}`);
      if (!DRY) fs.writeFileSync(f, out);
    }
  }
}
console.log(`${DRY ? 'would rewrite' : 'rewrote'} ${total} occurrence(s)`);
