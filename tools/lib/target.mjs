/**
 * target.mjs — what a browser tool (`a11y`, `shot`) opens: a local HTML file, or one
 * route of the portal, served from the build (--dist, default dist/vibecore/browser,
 * with the SPA fallback) or from a dev server that is already running (--base, which
 * must be a loopback URL). Shared so both tools accept exactly the same targets.
 */
import { existsSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { serve, originOf } from '../../scripts/lib/static-server.mjs';
import { EXIT, ToolError, inputDir, inputFile } from './cli.mjs';

export const DEFAULT_DIST = 'dist/vibecore/browser';
const NO_BUILD = 'run `npm run build:prod`, or start `npm start` and pass --base http://localhost:2000';
const LOOPBACK = new Set(['127.0.0.1', 'localhost', '[::1]', '::1']);

/** The options every browser tool shares, in --help order. */
export const TARGET_OPTIONS = {
  route: { type: 'string', arg: '</de/…>', help: 'check a portal route instead of a file' },
  dist: { type: 'string', arg: '<dir>', help: 'built site to serve the route from', defaultText: DEFAULT_DIST },
  base: { type: 'string', arg: '<url>', help: 'a running dev server instead of the build (loopback only)' },
};

/**
 * Resolves the target. Returns { url, slug, origin?, fileDir?, close() };
 * close() stops the static server if one was started.
 */
export async function openTarget(root, { positionals, values }) {
  if (positionals.length > 1) throw new ToolError(EXIT.USAGE, 'give one input file, or --route.');
  if (positionals.length === 1 && values.route)
    throw new ToolError(EXIT.USAGE, 'give either an input file or --route, not both.');
  if (!positionals.length && !values.route)
    throw new ToolError(EXIT.USAGE, 'give an input file (.html) or --route </de/…>.');
  if ((values.dist || values.base) && !values.route)
    throw new ToolError(EXIT.USAGE, '--dist and --base only go with --route.');

  if (positionals.length) {
    const file = inputFile(root, positionals[0], { exts: ['.html', '.htm'] });
    return {
      url: pathToFileURL(file).href,
      slug: basename(file).replace(/\.html?$/i, ''),
      fileDir: dirname(file),
      close: async () => {},
    };
  }

  const route = values.route;
  if (/^[A-Za-z]:[\\/]/.test(route)) {
    // Git Bash on Windows rewrites an argument that starts with "/" into a Windows path.
    throw new ToolError(
      EXIT.USAGE,
      `--route arrived as "${route}" — Git Bash rewrote it into a path. Run the tool from PowerShell, or prefix the command with MSYS_NO_PATHCONV=1.`,
    );
  }
  if (!route.startsWith('/'))
    throw new ToolError(EXIT.USAGE, `--route must start with "/", e.g. /de/home (got "${route}").`);
  const slug = route.replace(/^\/+|\/+$/g, '').replace(/[^A-Za-z0-9._-]+/g, '-') || 'root';
  if (values.dist && values.base) throw new ToolError(EXIT.USAGE, 'give either --dist or --base, not both.');

  if (values.base) {
    let base;
    try {
      base = new URL(values.base);
    } catch {
      throw new ToolError(EXIT.USAGE, `--base "${values.base}" is not a URL.`);
    }
    if (!/^https?:$/.test(base.protocol) || !LOOPBACK.has(base.hostname)) {
      throw new ToolError(
        EXIT.USAGE,
        `--base must be a local address (127.0.0.1, localhost, [::1]), not ${base.origin} — the tools never go online.`,
      );
    }
    return { url: base.origin + route, slug, origin: base.origin, close: async () => {} };
  }

  const dist = inputDir(root, values.dist || join(root, DEFAULT_DIST), { missing: NO_BUILD });
  if (!existsSync(join(dist, 'index.html'))) throw new ToolError(EXIT.ENV, `${dist} has no index.html — ${NO_BUILD}.`);
  const server = await serve(dist, { spa: true });
  const origin = originOf(server);
  return { url: origin + route, slug, origin, close: () => new Promise((ok) => server.close(ok)) };
}

/** Clicks `selector` and lets the page settle; exit 2 if nothing matches. */
export async function clickAndSettle(page, selector) {
  let found;
  try {
    found = await page.$(selector);
  } catch {
    throw new ToolError(EXIT.USAGE, `--click "${selector}" is not a valid CSS selector.`);
  }
  if (!found) throw new ToolError(EXIT.USAGE, `--click "${selector}" matches nothing on the page.`);
  await found.click();
  await page.waitForNetworkIdle({ idleTime: 200, timeout: 5000 }).catch(() => {});
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
}

/** Opens every <details> element on the page. */
export async function openDetails(page) {
  await page.evaluate(() => {
    for (const d of document.querySelectorAll('details')) d.open = true;
  });
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
}
