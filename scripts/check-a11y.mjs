#!/usr/bin/env node
/**
 * check-a11y.mjs — the automated accessibility pass on the built pages that
 * base/standards/A11Y.md promises.
 *
 * WHAT: serves the production output (dist/vibecore/browser, as `npm run build:prod`
 * leaves it) from a tiny local static server, opens a representative set of
 * prerendered routes in a real headless Chrome (Puppeteer), lets each page hydrate,
 * and runs axe-core against the live DOM — once with a light and once with a dark
 * colour scheme, because contrast (A11Y-004) differs between the two.
 *
 * VERDICT: every axe violation is attributed to an A11Y rule through AXE_TO_A11Y in
 * scripts/lib/a11y-verdict.mjs, the verdict the `a11y` kit tool shares. A violation
 * mapped to a `[hard]` rule fails the run (exit 1), and so does
 * one mapped to an `[overridable]` rule unless a valid overrides/<ID>.md relaxes it
 * (scripts/lib/overrides.mjs) — then it is printed as ADVISORY with the override's
 * rationale. Axe rules with no A11Y mapping at all (landmarks, heading order, …)
 * are printed as advisory and do not block. The one exception is KNOWN below: [hard]
 * violations that are real but parked for a design decision, printed on every run
 * and never silent. The tags are read from base/standards/A11Y.md, so a tag changed
 * there changes the verdict here without touching this file. Today no axe rule is
 * mapped to either `[overridable]` rule (A11Y-005, A11Y-007), so no override can
 * change this gate's verdict yet; the wiring is here so mapping one cannot quietly
 * make it advisory-by-default.
 *
 * WHAT IT CANNOT SEE: axe checks what is in the DOM at one moment. It cannot tell
 * whether a keyboard path through a canvas demo makes sense, whether focus order
 * is logical, whether alt text is *meaningful*, whether meaning is carried by
 * colour alone in an image, or whether Easy-Language text is actually easy. It
 * only visits the routes listed below, in their initial state — menus, dialogs and
 * demo states that need a click are not opened. Those remain manual review.
 *
 * Run:  npm run build:prod && npm run check:a11y
 *       node scripts/check-a11y.mjs --dist=dist/vibecore/browser
 *
 * Puppeteer's bundled Chrome is an optional download (an install with scripts
 * disabled skips it). PUPPETEER_EXECUTABLE_PATH then points at an existing Chrome
 * or Edge, exactly as for scripts/render-og.mjs.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gotoSettled, launchBrowser, openOffline } from './lib/browser.mjs';
import { loadAxe, readTags as readA11yTags, runAxe, verdict } from './lib/a11y-verdict.mjs';
import { printAdvisory } from './lib/overrides.mjs';
import { originOf, serve } from './lib/static-server.mjs';
import { loadSiteRules } from './lib/site-config.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const distArg = (process.argv.find((a) => a.startsWith('--dist=')) || '').split('=')[1];
/** `--only=<text>` narrows the run to routes containing <text> — for iterating on a fix, never for CI. */
const onlyArg = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1];
const DIST = resolve(ROOT, distArg || 'dist/vibecore/browser');
const ROUTES_FILE = join(ROOT, 'prerender-routes.txt');

/**
 * KNOWN — violations of [hard] rules that are real, found, NOT fixed, and parked
 * for a decision because the fix changes a component's design or contract. They
 * are printed on every run under their own heading and do not block. This list
 * is an admission, not a filter: an entry names the exact axe rule and node, says
 * why it is not fixed yet and where the decision waits, and it only ever shrinks.
 * An entry that no longer matches anything on a full run is reported as stale.
 *
 * Empty since 2026-09-22: both original entries were fixed, not waived —
 * `nested-interactive` on the collapsible container header (the toggle is now a
 * separate disclosure <button>) and `color-contrast` on the FAB label (the FABs
 * paint their own opaque surface, gated in scripts/check-contrast.mjs).
 */
/** @type {{ rule: string, node: string, route: string, reason: string }[]} */
const KNOWN = [];

/** The KNOWN entry covering one violating node, matched on its selector, not on axe's message. */
const knownFor = (id, route, node) =>
  KNOWN.find((k) => k.rule === id && route.includes(k.route) && node.split('  → ')[0].includes(k.node));

/**
 * The pages checked per language. Each key must match a prerendered route —
 * except a page that src/config/features.json assigns (`a11yPages`) to a feature
 * site.json switches off: that page is not built, so it is skipped, and said so.
 */
const ALL_PAGES = [
  { key: 'home', match: (r) => r.endsWith('/home') },
  { key: 'article', match: (r) => r.includes('/articles/') },
  { key: 'glossary', match: (r) => r.endsWith('/glossary') },
  // The one page on the content-hub template (cards, filters, live result count).
  { key: 'demos', match: (r) => r.endsWith('/demos') },
  { key: 'timeline', match: (r) => r.endsWith('/ai-timeline') },
  { key: 'sources', match: (r) => r.endsWith('/sources') },
  { key: 'settings', match: (r) => r.endsWith('/user-settings') },
  { key: 'impressum', match: (r) => r.endsWith('/impressum') },
];

/** The page keys of switched-off features (site.json + features.json). */
function switchedOffPageKeys(site) {
  return Object.entries(site.catalog.features)
    .filter(([id]) => !site.isFeatureOn(id))
    .flatMap(([, feature]) => feature.a11yPages);
}

const OFF_PAGE_KEYS = switchedOffPageKeys(loadSiteRules());
const PAGES = ALL_PAGES.filter((p) => !OFF_PAGE_KEYS.includes(p.key));
const LANGS = ['de', 'en'];
/** Easy Language is a stored preference, not a URL: these pages are re-run with it on. */
const EASY_PAGES = ['home', 'article'];
const SCHEMES = ['light', 'dark'];

function fail(msg) {
  console.error(`check-a11y: ${msg}`);
  process.exit(1);
}

/** Each A11Y rule's tag, read from base/standards/A11Y.md by the shared verdict module. */
function readTags() {
  try {
    return readA11yTags(ROOT);
  } catch (err) {
    return fail(err.message);
  }
}

async function launch() {
  try {
    return await launchBrowser();
  } catch (err) {
    console.error(`check-a11y: ${err.message}`);
    console.error('Install the bundled one (npx puppeteer browsers install chrome)');
    console.error('or point PUPPETEER_EXECUTABLE_PATH at a Chrome/Edge binary that is already there.');
    process.exit(1);
  }
}

/** One audit: the route in one scheme, offline, settled, then axe's violations. */
async function audit(browser, origin, run, scheme, axeSource) {
  const { page } = await openOffline(browser, {
    origin,
    viewport: { width: 1280, height: 900 },
    scheme,
    easy: run.easy,
  });
  try {
    await gotoSettled(page, origin + run.route);
    return (await runAxe(page, axeSource)).violations;
  } finally {
    await page.close();
  }
}

function selectRoutes() {
  if (!existsSync(ROUTES_FILE)) fail('prerender-routes.txt is missing — run `npm run build:prod` first.');
  const all = readFileSync(ROUTES_FILE, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const runs = [];
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const route = all.find((r) => r.startsWith(`/${lang}/`) && page.match(r));
      // A page that silently drops out of the set shrinks the check without anyone
      // noticing — so a missing one is an error, not a skip.
      if (!route) fail(`no prerendered route for "${page.key}" in ${lang} — update PAGES or the prerender list.`);
      runs.push({ route, lang, page: page.key, easy: false });
      if (EASY_PAGES.includes(page.key)) runs.push({ route, lang, page: page.key, easy: true });
    }
  }
  return runs;
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) fail(`${DIST} has no index.html — run \`npm run build:prod\` first.`);
  const tags = readTags();
  const runs = selectRoutes().filter((r) => !onlyArg || r.route.includes(onlyArg));
  if (runs.length === 0) fail(`--only=${onlyArg} matches none of the checked routes.`);
  if (onlyArg) console.log(`check-a11y: --only=${onlyArg} — a partial run, not a verdict on the site.\n`);
  if (OFF_PAGE_KEYS.length) {
    console.log(`check-a11y: skipped ${OFF_PAGE_KEYS.join(', ')} — their feature is switched off in site.json.\n`);
  }
  const { source: axeSource, version: axeVersion } = loadAxe();

  const server = await serve(DIST);
  const origin = originOf(server);
  const browser = await launch();

  const blocking = [];
  const advisory = [];
  const known = [];
  const knownSeen = new Set();
  try {
    for (const run of runs) {
      for (const scheme of SCHEMES) {
        const label = `${run.route}${run.easy ? ' (easy)' : ''} [${scheme}]`;
        const violations = await audit(browser, origin, run, scheme, axeSource);
        let hard = 0;
        // The shared verdict (scripts/lib/a11y-verdict.mjs) decides blocking vs advisory;
        // this gate only adds KNOWN on top.
        const judged = verdict(violations, { tags });
        for (const a of judged.advisory) advisory.push({ label, ...a });
        for (const v of judged.blocking) {
          // Split the nodes: those a KNOWN entry covers are reported, the rest block.
          const open = [];
          for (const node of v.nodes) {
            const k = knownFor(v.id, run.route, node);
            if (k) {
              knownSeen.add(k);
              known.push({ label, ...v, nodes: [node], reason: k.reason });
            } else open.push(node);
          }
          if (open.length) {
            blocking.push({ label, ...v, nodes: open });
            hard++;
          }
        }
        console.log(`  ${hard ? 'FAIL' : 'ok  '} ${label} — ${violations.length} violation(s), ${hard} blocking`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const print = (list) => {
    for (const e of list) {
      console.log(`  - ${e.label}  ${e.rule}  axe:${e.id} (${e.impact}) — ${e.help}`);
      for (const n of e.nodes.slice(0, 5)) console.log(`      ${n}`);
      if (e.nodes.length > 5) console.log(`      … and ${e.nodes.length - 5} more`);
    }
  };
  console.log('');
  console.log(`axe-core ${axeVersion} · ${runs.length} page runs × ${SCHEMES.length} color schemes`);
  if (advisory.length) {
    console.log(`\nAdvisory (${advisory.length}) — not mapped to an A11Y rule, or relaxed by an override:`);
    print(advisory);
    for (const ovr of new Set(advisory.map((e) => e.override).filter(Boolean))) {
      const hits = advisory.filter((e) => e.override === ovr).map((e) => `${e.label}  axe:${e.id}`);
      printAdvisory(ovr, hits, { gate: 'check-a11y' });
    }
  }
  if (known.length) {
    console.log(`\nKnown, NOT fixed (${known.length}) — [hard] violations parked for a decision, see KNOWN:`);
    for (const k of KNOWN.filter((e) => knownSeen.has(e))) {
      const hits = known.filter((e) => e.reason === k.reason);
      console.log(`  - axe:${k.rule} on ${k.node} — ${hits.length} hit(s), e.g. ${hits[0].label}`);
      console.log(`      ${hits[0].nodes[0]}`);
      console.log(`      why not fixed: ${k.reason}`);
    }
  }
  if (!onlyArg) {
    for (const k of KNOWN.filter((e) => !knownSeen.has(e))) {
      console.log(
        `\nStale KNOWN entry — axe:${k.rule} on ${k.node} no longer occurs. Remove it from scripts/check-a11y.mjs.`,
      );
    }
  }
  if (blocking.length) {
    console.log(`\nBlocking (${blocking.length}) — violations of [hard] A11Y rules:`);
    print(blocking);
    console.log('\ncheck-a11y: FAIL');
    process.exit(1);
  }
  const caveat = known.length ? ` (${known.length} known [hard] violation(s) listed above remain open)` : '';
  console.log(`\ncheck-a11y: PASS — no new violation of a [hard] A11Y rule on the checked pages${caveat}.`);
}

main().catch((err) => fail(err.stack || String(err)));
