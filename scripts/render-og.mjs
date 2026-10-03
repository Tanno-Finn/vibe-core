#!/usr/bin/env node
/**
 * render-og.mjs — rasterises the kit's hand-authored SVG assets to the PNGs that
 * ship in `src/assets/images/`.
 *
 * WHY: a few assets exist twice — an SVG that is the editable source of truth, and
 * a PNG that has to be a bitmap at the consumer end (Open Graph crawlers do not
 * render SVG; the language picker's <img> wants a raster). Without a generator the
 * two drift: the OG SVG was scrubbed to the kit's own branding while the PNG kept
 * showing the origin portal's title for months, because nobody could re-bake it.
 *
 * HOW: Puppeteer (already a devDependency) loads the SVG inside a bare HTML page
 * sized to the target's exact pixel box and screenshots the viewport at scale 1.
 * No dev server, no network — the SVG is inlined from disk as a data URI.
 *
 * Run:  node scripts/render-og.mjs
 *       node scripts/render-og.mjs --only=og
 *
 * Re-run whenever one of the source SVGs listed in TARGETS changes.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES = join(ROOT, 'src/assets/images');

/**
 * One entry per SVG source. `out` may list several files when the same bitmap is
 * referenced under more than one name (index.html points at og-image.png, the
 * MetaSeoService at og-image-default.png — they must stay identical).
 */
const TARGETS = [
  {
    name: 'og',
    src: join(IMAGES, 'og-image.svg'),
    width: 1200,
    height: 630,
    out: [join(IMAGES, 'og-image.png'), join(IMAGES, 'og-image-default.png')],
  },
  {
    name: 'easy-language',
    src: join(IMAGES, 'leichte-sprache.svg'),
    width: 360,
    height: 240,
    out: [join(IMAGES, 'leichte-sprache.png')],
  },
];

const onlyArg = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1];
const only = onlyArg ? new Set(onlyArg.split(',').map((s) => s.trim())) : null;
const targets = TARGETS.filter((t) => !only || only.has(t.name));

if (targets.length === 0) {
  console.error(`render-og: no target matches --only=${onlyArg}. Known: ${TARGETS.map((t) => t.name).join(', ')}`);
  process.exit(1);
}

// A page whose body is exactly the target box, so the viewport screenshot is the
// asset and nothing else — no margins, no scrollbars, no background bleed.
function page(svg, width, height) {
  const uri = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
  return `<!doctype html><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;background:transparent}
    img{display:block;width:${width}px;height:${height}px}
  </style><img src="${uri}" alt="">`;
}

/**
 * Puppeteer's bundled Chrome is an optional download — a `--no-download` install, a
 * locked-down machine or a CI image without it leaves the package there and the
 * browser absent. PUPPETEER_EXECUTABLE_PATH then points at a Chrome or Edge that
 * already exists; `undefined` keeps Puppeteer's own resolution, so the normal case
 * is unchanged. The failure is caught here because the raw launch error names a
 * path nobody chose and no way out.
 */
async function launchBrowser() {
  try {
    return await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
  } catch (error) {
    console.error(`render-og: no browser to render with — ${error.message}`);
    console.error('Either install the bundled one (npx puppeteer browsers install chrome)');
    console.error('or point PUPPETEER_EXECUTABLE_PATH at a Chrome/Edge binary that is already there:');
    console.error('  PUPPETEER_EXECUTABLE_PATH="<msedge.exe or chrome.exe>" node scripts/render-og.mjs');
    process.exit(1);
  }
}

const browser = await launchBrowser();
try {
  const tab = await browser.newPage();
  for (const target of targets) {
    const svg = readFileSync(target.src, 'utf8');
    await tab.setViewport({ width: target.width, height: target.height, deviceScaleFactor: 1 });
    await tab.setContent(page(svg, target.width, target.height), { waitUntil: 'load' });
    // A malformed SVG decodes to a broken <img> and would screenshot as a blank
    // plate — silently shipping an empty asset. naturalWidth is the honest signal.
    // (XML comments may not contain a double hyphen; that alone once produced one.)
    const decoded = await tab.evaluate(() => document.querySelector('img').naturalWidth);
    if (!decoded) {
      throw new Error(
        `render-og: ${relative(ROOT, target.src)} did not decode as an image — check it is well-formed XML`,
      );
    }
    // Fonts are system stacks; give the layout one frame to settle before capture.
    await tab.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    // omitBackground keeps whatever the SVG does not paint transparent. It matters
    // for rounded plates (the corners would otherwise bake in as opaque black) and
    // costs the OG image nothing — its background rect is full-bleed and opaque.
    const png = await tab.screenshot({ type: 'png', omitBackground: true });
    for (const file of target.out) {
      writeFileSync(file, png);
      console.log(
        `render-og: ${relative(ROOT, file)} ← ${relative(ROOT, target.src)} (${target.width}×${target.height}, ${png.length} bytes)`,
      );
    }
  }
} finally {
  await browser.close();
}
