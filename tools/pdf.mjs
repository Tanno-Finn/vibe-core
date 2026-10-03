#!/usr/bin/env node
/**
 * pdf.mjs — HTML → PDF with a fit check (kit tool `pdf`, capability `file:pdf`).
 *
 * WHAT: prints one self-contained HTML file (a handout, a worksheet) to PDF in headless
 * Chrome with print media, so the file's own `@page` rule wins and --format is only the
 * fallback. Reads the page count out of the PDF, fails with exit 1 when it is above
 * --max-pages, and warns about elements wider than the printable area (a table or an
 * image that would be cut off). --bw-check lists colours that may turn into grey on a
 * black-and-white copier.
 *
 * HOW: the browser may read files in the input's folder (and below) and `data:` URIs;
 * every other request is aborted and reported. The page count is the root `/Pages`
 * `/Count`, cross-checked against the number of `/Type /Page` objects — a mismatch is
 * exit 3, never a guess. Chrome stamps `/CreationDate` and `/ModDate`; both values are
 * replaced in place with a fixed date of the same byte length, so the xref offsets stay
 * valid and two runs on the same input give identical bytes (nothing else varies).
 *
 * WHAT IT CANNOT SEE: whether the content is right, whether the layout looks good (open
 * the PDF), overflow inside a table cell that the cell clips, and colours inside images.
 * The overflow check measures in print media at the printable width of the first page.
 *
 * Run:  node tools/pdf.mjs <input.html> [--max-pages 1] [--bw-check]   (--help for all)
 */
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gotoSettled, launchBrowser, openOffline } from '../scripts/lib/browser.mjs';
import { EXIT, ToolError, inputFile, outputPath, positiveInt, runTool } from './lib/cli.mjs';

const PAPER = { A4: [210, 297], Letter: [215.9, 279.4] }; // mm, portrait
const PX_PER_MM = 96 / 25.4;

/** Reads the page count; throws ToolError(3) when the two ways of counting disagree. */
function pageCount(buf) {
  const s = buf.toString('latin1');
  const counts = [];
  for (const m of s.matchAll(/\/Type\s*\/Pages\b/g)) {
    const start = s.lastIndexOf(' obj', m.index);
    const end = s.indexOf('endobj', m.index);
    const c = /\/Count\s+(\d+)/.exec(s.slice(start, end));
    if (c) counts.push(Number(c[1]));
  }
  const root = counts.length ? Math.max(...counts) : 0;
  const pages = [...s.matchAll(/\/Type\s*\/Page(?![A-Za-z])/g)].length;
  if (!root || root !== pages) {
    throw new ToolError(EXIT.ENV, `cannot read the page count from the PDF (/Count ${root}, ${pages} page objects).`);
  }
  return root;
}

/** Replaces the digits of /CreationDate and /ModDate with 1980-01-01 00:00 UTC, same length. */
function maskDates(buf) {
  const tmpl = "D:19800101000000+00'00'";
  const s = buf
    .toString('latin1')
    .replace(/\/(CreationDate|ModDate)\s*\((D:[^)]*)\)/g, (all, _key, value) =>
      all.replace(
        value,
        [...value].map((ch, i) => (/\d/.test(ch) ? (/\d/.test(tmpl[i] ?? '') ? tmpl[i] : '0') : ch)).join(''),
      ),
    );
  return Buffer.from(s, 'latin1');
}

/** CSS length → mm (mm, cm, in, pt, px); null if unknown. */
const toMm = (v) => {
  const m = /^(-?[\d.]+)(mm|cm|in|pt|px)$/.exec(String(v).trim());
  if (!m) return null;
  return Number(m[1]) * { mm: 1, cm: 10, in: 25.4, pt: 25.4 / 72, px: 25.4 / 96 }[m[2]];
};

/** Printable width in CSS px of the first page: @page size and margins if set, else --format. */
function printableWidth(pageRule, { format, landscape }) {
  let [w, h] = PAPER[format];
  let land = landscape;
  const size = (pageRule.size || '').trim();
  if (size) {
    const parts = size.split(/\s+/);
    const named = parts.find((p) => /^(a4|letter|a5|a3)$/i.test(p));
    if (named) [w, h] = { a4: [210, 297], letter: [215.9, 279.4], a5: [148, 210], a3: [297, 420] }[named.toLowerCase()];
    if (parts.includes('landscape')) land = true;
    if (parts.includes('portrait')) land = false;
    const lengths = parts.map(toMm).filter((x) => x !== null);
    if (lengths.length === 2) [w, h] = lengths;
    else if (lengths.length === 1) [w, h] = [lengths[0], lengths[0]];
  }
  if (land && w < h) [w, h] = [h, w];
  const left = toMm(pageRule.left ?? '0mm') ?? 0;
  const right = toMm(pageRule.right ?? '0mm') ?? 0;
  return { px: Math.round((w - left - right) * PX_PER_MM), paper: size || `${format}${land ? ' landscape' : ''}` };
}

await runTool({
  id: 'pdf',
  summary: 'HTML → PDF with a page count and a fit check',
  usage: 'node tools/pdf.mjs <input.html> [options]',
  description: [
    'Prints one self-contained HTML file to PDF (print media; an @page rule in the file wins).',
    'Prints the page count and warns about anything wider than the printable area.',
  ],
  options: {
    out: { type: 'string', arg: '<file.pdf>', help: 'where to write the PDF', defaultText: 'next to the input, .pdf' },
    format: {
      type: 'string',
      arg: 'A4|Letter',
      help: 'paper size when the file has no @page size',
      default: 'A4',
      choices: ['A4', 'Letter'],
    },
    landscape: { type: 'boolean', help: 'landscape when the file has no @page size' },
    'max-pages': { type: 'string', arg: '<n>', help: 'exit 1 if the PDF has more pages than n' },
    'bw-check': { type: 'boolean', help: 'list colours that may turn grey on a black-and-white copier (advice)' },
    strict: { type: 'boolean', help: 'treat warnings (overflow, blocked requests) as a failure (exit 1)' },
    force: { type: 'boolean', help: 'replace an existing output file' },
  },
  examples: [
    'node tools/pdf.mjs out/teacher/arbeitsblatt.html --max-pages 1',
    'node tools/pdf.mjs handout.html --bw-check --json',
  ],
  async run({ values, positionals, report, root }) {
    if (positionals.length !== 1) throw new ToolError(EXIT.USAGE, 'give exactly one input file (an .html file).');
    const input = inputFile(root, positionals[0], { exts: ['.html', '.htm'] });
    const maxPages = positiveInt('max-pages', values['max-pages']);
    const out = outputPath(root, values.out ?? input.replace(/\.html?$/i, '.pdf'), { force: values.force, input });

    const browser = await launchBrowser();
    let pdf;
    try {
      const { page, aborted } = await openOffline(browser, { fileDir: dirname(input), media: 'print' });
      await gotoSettled(page, pathToFileURL(input).href);
      const pageRule = await page.evaluate(() => {
        const found = {};
        for (const sheet of document.styleSheets) {
          let rules;
          try {
            rules = sheet.cssRules;
          } catch {
            continue;
          }
          for (const r of rules) {
            if (!(r instanceof CSSPageRule) || r.selectorText) continue;
            const s = r.style;
            if (s.getPropertyValue('size')) found.size = s.getPropertyValue('size');
            for (const side of ['left', 'right']) {
              const v = s.getPropertyValue(`margin-${side}`);
              if (v) found[side] = v;
            }
          }
        }
        return found;
      });
      const width = printableWidth(pageRule, { format: values.format, landscape: !!values.landscape });
      await page.setViewport({ width: width.px, height: 1123 });
      await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));

      const overflow = await page.evaluate((limit) => {
        const path = (el) => {
          const parts = [];
          for (let e = el; e && e !== document.body && parts.length < 4; e = e.parentElement) {
            let part = e.tagName.toLowerCase();
            if (e.id) {
              parts.unshift(`${part}#${e.id}`);
              break;
            }
            if (e.classList.length) part += `.${[...e.classList].join('.')}`;
            const same = e.parentElement ? [...e.parentElement.children].filter((c) => c.tagName === e.tagName) : [];
            if (same.length > 1) part += `:nth-of-type(${same.indexOf(e) + 1})`;
            parts.unshift(part);
          }
          return parts.join(' > ');
        };
        const hits = [];
        for (const el of document.body.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.right <= limit + 1 && r.left >= -1) continue;
          if (hits.some((h) => h.el.contains(el))) continue;
          hits.push({ el, selector: path(el), image: el.tagName === 'IMG', over: Math.max(r.right - limit, -r.left) });
        }
        return hits.map(({ selector, image, over }) => ({ selector, image, overMm: Math.round((over * 25.4) / 96) }));
      }, width.px);

      let bw = [];
      if (values['bw-check']) {
        bw = await page.evaluate(() => {
          const rgba = (c) => {
            const m = /rgba?\(([^)]+)\)/.exec(c);
            if (!m) return null;
            const [r, g, b, a = 1] = m[1]
              .split(/[\s,/]+/)
              .filter(Boolean)
              .map(Number);
            return { r, g, b, a };
          };
          const hsl = ({ r, g, b }) => {
            const [R, G, B] = [r, g, b].map((x) => x / 255);
            const max = Math.max(R, G, B);
            const min = Math.min(R, G, B);
            const l = (max + min) / 2;
            const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
            return { s, l };
          };
          const lum = ({ r, g, b }) => {
            const f = (x) => ((x /= 255) <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          };
          const chromatic = (c) => {
            if (!c || c.a === 0) return false;
            const { s, l } = hsl(c);
            return s > 0.15 && l > 0.1 && l < 0.95;
          };
          const bgOf = (el) => {
            for (let e = el; e; e = e.parentElement) {
              const c = rgba(getComputedStyle(e).backgroundColor);
              if (c && c.a > 0) return c;
            }
            return { r: 255, g: 255, b: 255, a: 1 };
          };
          const name = (e) =>
            e.tagName.toLowerCase() + (e.id ? `#${e.id}` : e.classList.length ? `.${[...e.classList].join('.')}` : '');
          const notes = [];
          for (const el of document.body.querySelectorAll('*')) {
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
            const why = [];
            if (text && chromatic(rgba(cs.color))) why.push(`coloured text (${cs.color})`);
            if (chromatic(rgba(cs.backgroundColor))) why.push(`coloured background (${cs.backgroundColor})`);
            const border = ['Top', 'Right', 'Bottom', 'Left'].find(
              (s) =>
                parseFloat(cs[`border${s}Width`]) > 0 &&
                cs[`border${s}Style`] !== 'none' &&
                chromatic(rgba(cs[`border${s}Color`])),
            );
            if (border) why.push(`coloured border (${cs[`border${border}Color`]})`);
            if (text && lum(bgOf(el)) < 0.9 && !why.some((w) => w.startsWith('coloured background'))) {
              why.push('text on a tinted background');
            }
            if (
              ['IMG', 'SVG', 'CANVAS', 'PICTURE'].includes(el.tagName.toUpperCase()) ||
              cs.backgroundImage !== 'none'
            ) {
              why.push('image: check by eye');
            }
            if (why.length) notes.push({ selector: name(el), why: why.join(', ') });
          }
          return notes;
        });
      }

      pdf = await page.pdf({
        preferCSSPageSize: true,
        printBackground: true,
        format: values.format,
        landscape: !!values.landscape,
      });
      pdf = maskDates(Buffer.from(pdf));
      const pages = pageCount(pdf);
      report.write(out, pdf);
      report.data.pages = pages;
      report.data.paper = width.paper;
      report.say(`${pages} page${pages === 1 ? '' : 's'} (${width.paper})`);

      if (maxPages !== undefined && pages > maxPages) {
        report.finding(
          { kind: 'max-pages', message: `${pages} pages, ${pages - maxPages} more than --max-pages ${maxPages}` },
          { blocking: true },
        );
        report.say(`  FAIL: ${pages} pages is ${pages - maxPages} more than --max-pages ${maxPages}.`);
      }
      for (const o of overflow) {
        report.warn(`${o.image ? 'image' : 'element'} ${o.selector} is ${o.overMm} mm wider than the printable area`);
      }
      for (const url of aborted) report.warn(`blocked request (the tool works offline): ${url}`);
      if (bw.length) {
        report.say('');
        report.say(`Black-and-white check (advice, ${bw.length} element(s)):`);
        for (const n of bw) {
          report.findings.push({ kind: 'bw', selector: n.selector, message: n.why, blocking: false });
          report.say(`  - ${n.selector}: ${n.why}`);
        }
      }
      if (values.strict && report.warnings.length) {
        report.say(`  FAIL: --strict and ${report.warnings.length} warning(s).`);
        report.fail(EXIT.FINDING);
      }
    } finally {
      await browser.close();
    }
    report.notChecked.push(
      'whether the layout looks right: open the PDF',
      'text cut off inside a table cell or a box that clips it',
      ...(values['bw-check'] ? ['colours inside images'] : ['black-and-white printing (use --bw-check)']),
    );
  },
});
