/**
 * browser.mjs — the one headless-browser setup the gates and the kit tools share.
 *
 * WHAT: `launchBrowser()` starts Puppeteer's Chrome (or the one PUPPETEER_EXECUTABLE_PATH
 * names) with background networking, component updates, first-run and sync off.
 * `openOffline()` opens a page that fetches nothing but what the caller allows (a local
 * origin, a folder on disk, `data:`), emulates the colour scheme and reduced motion, and
 * clears localStorage before every load (optionally setting the kit's Easy-Language
 * preference). `gotoSettled()` loads a URL and waits until the page stands still:
 * network idle, transitions and animations off, fonts loaded, two animation frames.
 * Every aborted request is recorded, so a caller can report what the page wanted and
 * did not get instead of measuring a silently incomplete page.
 *
 * Puppeteer is imported lazily, so a tool's `--help` never needs it installed. A launch
 * that fails throws BrowserUnavailableError with the fix in one sentence; tools turn it
 * into exit 3, the gates into their own failure.
 *
 * `--no-sandbox` is used only when CI is set: GitHub's Ubuntu runners forbid the
 * unprivileged user namespaces Chrome's sandbox needs, and every page this module opens
 * is offline (all other requests are aborted).
 *
 * Offline twice over: request interception sees only the page's own requests, not
 * WebSockets, pop-ups or Chrome's background calls to Google (update, time, account
 * checks, which run even with background networking off). So the browser also gets a
 * proxy on 127.0.0.1 port 1, where nothing listens: every connection that leaves this
 * computer fails there, while loopback addresses bypass a proxy by Chrome's default.
 */
import { realpathSync } from 'node:fs';
import { sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Where every non-loopback connection goes to fail (see the header). */
export const DEAD_PROXY = 'http://127.0.0.1:1';

export const BROWSER_HINT =
  'Install the bundled one (npx puppeteer browsers install chrome) or point PUPPETEER_EXECUTABLE_PATH at a Chrome/Edge binary that is already there.';

/** The storage key the portal reads for the Easy-Language preference. */
export const EASY_KEY = 'easy-language-mode';

/** The two viewports the tools know. Mobile is a 390 px phone at device scale 2. */
export const VIEWPORTS = {
  desktop: { width: 1280, height: 800, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

export class BrowserUnavailableError extends Error {
  constructor(message, hint) {
    super(message);
    this.name = 'BrowserUnavailableError';
    this.hint = hint;
  }
}

export async function launchBrowser() {
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch (err) {
    throw new BrowserUnavailableError(
      `puppeteer is not installed — ${err.message}`,
      'Run `npm install` in the project folder.',
    );
  }
  try {
    return await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        ...(process.env.CI ? ['--no-sandbox'] : []),
        '--disable-background-networking',
        '--disable-component-update',
        '--no-first-run',
        '--disable-sync',
        `--proxy-server=${DEAD_PROXY}`,
      ],
    });
  } catch (err) {
    throw new BrowserUnavailableError(`could not start a browser — ${err.message}`, BROWSER_HINT);
  }
}

/**
 * Request filter: true for `data:`, for URLs whose origin is exactly `origin` (a prefix
 * would let `http://127.0.0.1:1234@elsewhere/` and port 12345 through), and for files
 * whose real path (links resolved) lies inside `fileDir`.
 */
export function allowFor({ origin, fileDir }) {
  const dir = fileDir ? fileDir.replace(/[\\/]+$/, '') + sep : null;
  const norm = (p) => (process.platform === 'win32' ? p.toLowerCase() : p);
  return (url) => {
    if (url.startsWith('data:')) return true;
    let u;
    try {
      u = new URL(url);
    } catch {
      return false;
    }
    if (origin && u.origin === origin) return true;
    if (dir && u.protocol === 'file:') {
      try {
        let file = fileURLToPath(u.href.split('#')[0].split('?')[0]);
        try {
          file = realpathSync(file);
        } catch {
          /* missing file: the browser gets a not-found, nothing outside is read */
        }
        return norm(file).startsWith(norm(dir));
      } catch {
        return false;
      }
    }
    return false;
  };
}

/**
 * A new page that can only reach `origin` (http) or `fileDir` (file://) and `data:`.
 * Returns { page, aborted } — `aborted` fills with every refused URL as the page loads.
 */
export async function openOffline(
  browser,
  { origin, fileDir, viewport = VIEWPORTS.desktop, scheme = 'light', easy = false, media } = {},
) {
  const page = await browser.newPage();
  const aborted = [];
  await page.setViewport(viewport);
  if (media) await page.emulateMediaType(media);
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: scheme },
    // No half-finished fade can be measured as a contrast failure.
    { name: 'prefers-reduced-motion', value: 'reduce' },
  ]);
  await page.evaluateOnNewDocument(
    (easyOn, key) => {
      try {
        localStorage.clear();
        if (easyOn) localStorage.setItem(key, 'true');
      } catch {
        /* storage blocked — the run reports what the page then shows */
      }
    },
    easy,
    EASY_KEY,
  );
  const allow = allowFor({ origin, fileDir });
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (allow(req.url())) req.continue();
    else {
      aborted.push(req.url());
      req.abort();
    }
  });
  return { page, aborted };
}

/** Transitions and animations off, fonts loaded, two animation frames: a page that stands still. */
export async function settle(page) {
  // Measure the settled page, not a frame of an entrance transition: a floating
  // button still sliding in is reported against whatever happens to be behind it.
  await page.addStyleTag({
    content: '*, *::before, *::after { transition: none !important; animation: none !important; }',
  });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
}

export async function gotoSettled(page, url, { timeout = 60_000 } = {}) {
  await page.goto(url, { waitUntil: 'networkidle0', timeout });
  await settle(page);
}
