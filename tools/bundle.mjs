#!/usr/bin/env node
/**
 * bundle.mjs — one offline HTML file from a local HTML page, for e-mail or a learning
 * platform such as Moodle (kit tool `bundle`, capability `file:html-single`).
 *
 * WHAT: reads one HTML file and writes a copy that needs nothing beside it: local
 * stylesheets (and their @import) become <style> blocks, local scripts become inline
 * scripts, and images, icons, media and fonts become `data:` URIs — in `src`, `poster`,
 * the first `srcset` candidate, `style` attributes and every CSS `url()`. Default output
 * `<input>.single.html` next to the input. Reports the final size and warns above 10 MB.
 *
 * HOW: parsed and written back with jsdom (no script runs, nothing is fetched). A
 * reference to the web (`https://…`, `//…`) stays as it is and is a warning — the file then
 * needs the internet, and the tool never downloads anything; --strict turns warnings into
 * exit 1. A local reference that cannot be inlined (a missing file, a file outside the
 * project — links resolved —, a hidden file or folder such as `.env` or `.git/`, a link to
 * another page, a root-relative `/path`) is a warning too: the single file is meant to be
 * sent away. A `defer` or `async` script keeps its timing as a `data:` src. A `srcset`
 * keeps its first candidate only. Same input, same bytes.
 *
 * WHAT IT CANNOT SEE: what scripts load while they run (fetch(), a module's `import` of
 * another file, an iframe's own resources) — open the single file once and click through
 * it; links to other pages of your material, which a single file cannot carry.
 *
 * Run:  node tools/bundle.mjs <input.html> [--strict]   (--help for all)
 */
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { MIME } from '../scripts/lib/static-server.mjs';
import { EXIT, ToolError, inputFile, isInside, outputPath, readText, rel, requireDep, runTool } from './lib/cli.mjs';

const LIMIT = 10 * 1024 * 1024;
const MORE_MIME = {
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt',
  '.bmp': 'image/bmp',
};
const mimeOf = (file) =>
  (MIME[extname(file).toLowerCase()] || MORE_MIME[extname(file).toLowerCase()] || 'application/octet-stream').replace(
    /; charset=utf-8$/,
    '',
  );

await runTool({
  id: 'bundle',
  summary: 'one offline HTML file (styles, scripts, images, fonts inside) for e-mail or Moodle',
  usage: 'node tools/bundle.mjs <input.html> [--out <file.html>] [--strict] [--force] [--json]',
  description: [
    'Writes a copy of an HTML page with every local stylesheet, script, image and font packed',
    'inside, so the one file works on its own. References to the web stay and are listed.',
  ],
  options: {
    out: {
      type: 'string',
      arg: '<file.html>',
      help: 'where to write the file',
      defaultText: 'next to the input, .single.html',
    },
    strict: { type: 'boolean', help: 'treat warnings (web references, files not found) as a failure (exit 1)' },
    force: { type: 'boolean', help: 'replace an existing output file' },
  },
  examples: ['node tools/bundle.mjs out/teacher/learning-page.html', 'node tools/bundle.mjs page.html --strict --json'],
  async run({ values, positionals, report, root }) {
    if (positionals.length !== 1) throw new ToolError(EXIT.USAGE, 'give exactly one input file (an .html file).');
    const input = inputFile(root, positionals[0], { exts: ['.html', '.htm'] });
    const out = outputPath(root, values.out ?? input.replace(/\.html?$/i, '.single.html'), {
      force: values.force,
      input,
    });
    const { JSDOM } = await requireDep('jsdom');

    const warned = new Set();
    const warnOnce = (msg) => {
      if (warned.has(msg)) return;
      warned.add(msg);
      report.warn(msg);
    };
    let inlined = 0;

    /** What a reference points at: skip | remote | root | local (with the resolved file). */
    const classify = (ref, baseDir) => {
      const v = (ref ?? '').trim();
      if (!v || v.startsWith('#') || /^(data|mailto|tel|javascript|about|blob):/i.test(v)) return { kind: 'skip' };
      if (v.startsWith('//') || /^[a-z][a-z0-9+.-]*:/i.test(v)) return { kind: 'remote', url: v };
      if (v.startsWith('/')) return { kind: 'root', ref: v };
      let path = v.split('#')[0].split('?')[0];
      try {
        path = decodeURIComponent(path);
      } catch {
        /* keep it as written */
      }
      return { kind: 'local', ref: v, file: resolve(baseDir, path) };
    };

    /** The file behind a local reference, or null with a warning saying why. */
    const readLocal = (c, where) => {
      const real = existsSync(c.file) ? realpathSync(c.file) : c.file;
      if (!isInside(root, real)) {
        warnOnce(`${where}: ${c.ref} is outside the project — left as it is`);
        return null;
      }
      if (
        rel(root, real)
          .split('/')
          .some((part) => part.startsWith('.'))
      ) {
        warnOnce(`${where}: ${c.ref} is a hidden file or inside a hidden folder — never packed in, left as it is`);
        return null;
      }
      if (!existsSync(real) || !statSync(real).isFile()) {
        warnOnce(`${where}: ${c.ref} not found (${c.file}) — left as it is`);
        return null;
      }
      return readFileSync(real);
    };

    /** A data: URI for `ref`, or the reference unchanged (with a warning) when it cannot be inlined. */
    const asData = (ref, baseDir, where) => {
      const c = classify(ref, baseDir);
      if (c.kind === 'skip') return ref;
      if (c.kind === 'remote') {
        warnOnce(`${where}: ${c.url} is on the web — left as it is, the file needs the internet for it`);
        return ref;
      }
      if (c.kind === 'root') {
        warnOnce(`${where}: ${c.ref} starts with "/" and has no meaning for a single file — left as it is`);
        return ref;
      }
      const buf = readLocal(c, where);
      if (!buf) return ref;
      inlined++;
      return `data:${mimeOf(c.file)};base64,${buf.toString('base64')}`;
    };

    /** CSS with every url() inlined and every local @import replaced by the imported CSS. */
    const inlineCss = (css, baseDir, where, depth = 0) => {
      const imported = css.replace(
        /@import\s+(?:url\(\s*)?(['"]?)([^'")\s;]+)\1\s*\)?\s*([^;]*);/g,
        (all, _q, ref, media) => {
          const c = classify(ref, baseDir);
          if (c.kind !== 'local') {
            if (c.kind === 'remote') warnOnce(`${where}: @import ${ref} is on the web — left as it is`);
            return all;
          }
          if (depth > 10) {
            warnOnce(`${where}: @import chain deeper than 10 — ${ref} left as it is`);
            return all;
          }
          const buf = readLocal(c, where);
          if (!buf) return all;
          inlined++;
          const inner = inlineCss(buf.toString('utf8'), dirname(c.file), rel(root, c.file), depth + 1);
          return media.trim() ? `@media ${media.trim()} {\n${inner}\n}` : inner;
        },
      );
      return imported.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (all, q, ref) => {
        const data = asData(ref, baseDir, where);
        return data === ref ? all : `url(${q || '"'}${data}${q || '"'})`;
      });
    };

    const html = readText(input);
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const dir = dirname(input);
    const here = rel(root, input);

    // A <style> made from a linked stylesheet is already inlined, relative to that stylesheet.
    const packed = new Set();
    for (const link of [...doc.querySelectorAll('link[rel~="stylesheet" i][href]')]) {
      const c = classify(link.getAttribute('href'), dir);
      if (c.kind !== 'local') {
        if (c.kind !== 'skip') asData(link.getAttribute('href'), dir, here);
        continue;
      }
      const buf = readLocal(c, here);
      if (!buf) continue;
      inlined++;
      const style = doc.createElement('style');
      if (link.getAttribute('media')) style.setAttribute('media', link.getAttribute('media'));
      style.textContent = inlineCss(buf.toString('utf8'), dirname(c.file), rel(root, c.file));
      packed.add(style);
      link.replaceWith(style);
    }
    for (const style of doc.querySelectorAll('style')) {
      if (!packed.has(style)) style.textContent = inlineCss(style.textContent, dir, here);
    }
    for (const el of doc.querySelectorAll('[style]'))
      el.setAttribute('style', inlineCss(el.getAttribute('style'), dir, here));

    for (const script of [...doc.querySelectorAll('script[src]')]) {
      const c = classify(script.getAttribute('src'), dir);
      if (c.kind !== 'local') {
        if (c.kind !== 'skip') asData(script.getAttribute('src'), dir, here);
        continue;
      }
      const buf = readLocal(c, here);
      if (!buf) continue;
      inlined++;
      const code = buf.toString('utf8');
      if (script.getAttribute('type') === 'module' && /\bimport\b[^;]*['"]\.{0,2}\//.test(code)) {
        warnOnce(`${here}: the module ${c.ref} imports other files — those are not packed in; test the single file`);
      }
      if (script.hasAttribute('defer') || script.hasAttribute('async')) {
        // Inline, defer and async have no effect: the script would run before the page it waits for.
        script.setAttribute('src', `data:text/javascript;base64,${buf.toString('base64')}`);
        continue;
      }
      script.removeAttribute('src');
      script.textContent = code.replace(/<\/(script)/gi, '<\\/$1');
    }

    for (const el of doc.querySelectorAll(
      'img[src], source[src], video[src], audio[src], track[src], input[type="image" i][src], embed[src]',
    )) {
      el.setAttribute('src', asData(el.getAttribute('src'), dir, here));
    }
    for (const el of doc.querySelectorAll('video[poster]'))
      el.setAttribute('poster', asData(el.getAttribute('poster'), dir, here));
    for (const el of doc.querySelectorAll('link[rel~="icon" i][href], link[rel~="apple-touch-icon" i][href]')) {
      el.setAttribute('href', asData(el.getAttribute('href'), dir, here));
    }
    for (const el of doc.querySelectorAll('image[href], image[xlink\\:href]')) {
      const attr = el.hasAttribute('href') ? 'href' : 'xlink:href';
      el.setAttribute(attr, asData(el.getAttribute(attr), dir, here));
    }
    for (const el of doc.querySelectorAll('img[srcset], source[srcset]')) {
      const candidates = el
        .getAttribute('srcset')
        .split(/,\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (!candidates.length) continue;
      const first = candidates[0].split(/\s+/)[0];
      const data = asData(first, dir, here);
      el.setAttribute('srcset', data === first ? candidates[0] : data);
      if (candidates.length > 1) {
        warnOnce(`${here}: srcset "${first}" — kept the first of ${candidates.length} image sizes, dropped the others`);
      }
    }

    // What still points at a local file cannot work from a single file: say so.
    for (const el of doc.querySelectorAll(
      'a[href], area[href], iframe[src], object[data], link[href]:not([rel~="icon" i]):not([rel~="apple-touch-icon" i]):not([rel~="stylesheet" i])',
    )) {
      const attr = el.hasAttribute('href') ? 'href' : el.hasAttribute('src') ? 'src' : 'data';
      const c = classify(el.getAttribute(attr), dir);
      if (c.kind === 'local' || c.kind === 'root') {
        warnOnce(
          `${here}: <${el.tagName.toLowerCase()} ${attr}="${el.getAttribute(attr)}"> points at another file, which the single file does not carry`,
        );
      } else if (c.kind === 'remote' && el.tagName !== 'A' && el.tagName !== 'AREA') {
        warnOnce(`${here}: <${el.tagName.toLowerCase()} ${attr}="${c.url}"> is on the web — left as it is`);
      }
    }

    const result = Buffer.from(dom.serialize(), 'utf8');
    report.write(out, result);
    report.data.bytes = result.length;
    report.data.inlined = inlined;
    report.say(`${inlined} reference(s) packed in, ${(result.length / 1024).toFixed(1)} KB`);
    if (result.length > LIMIT) {
      report.warn(
        `the file is ${(result.length / 1024 / 1024).toFixed(1)} MB — above 10 MB, many mail systems and platforms refuse it`,
      );
    }
    if (values.strict && report.warnings.length) {
      report.say(`  FAIL: --strict and ${report.warnings.length} warning(s).`);
      report.fail(EXIT.FINDING);
    }
    report.notChecked.push(
      'what scripts load while they run (fetch, module imports): open the single file once and click through it',
      'links to other pages of your material: a single file cannot carry them',
    );
  },
});
