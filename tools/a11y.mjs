#!/usr/bin/env node
/**
 * a11y.mjs — accessibility check of one file or one portal route (kit tool `a11y`,
 * capability `check:a11y`).
 *
 * WHAT: runs axe-core in headless Chrome on a local HTML file (a handout, a learning
 * page) or on a route of the portal, in the light and the dark colour scheme, and
 * judges the result with the kit's own verdict (scripts/lib/a11y-verdict.mjs, the same
 * one the `check:a11y` gate uses): a violation of a `[hard]` A11Y rule is exit 1,
 * unmapped or overridden rules are advice. Pages that change on a click are checked in
 * every state: one more audit after each --click, cumulative and in order.
 * --open-details opens every <details> before each audit, --easy switches the portal's
 * Easy-Language preference on before loading, --tab-order n lists the first n stops of
 * the keyboard path.
 *
 * HOW: offline — the browser loads the file's folder (or the served build, or the
 * loopback dev server) and `data:`, nothing else; blocked requests are warnings.
 * axe's "incomplete" results (it could not decide) are listed as "check by hand".
 *
 * WHAT IT CANNOT SEE: whether alt texts are meaningful, whether the keyboard path
 * through a canvas demo makes sense, meaning carried by colour inside images, whether
 * Easy-Language text is actually easy, and every state you did not --click into.
 *
 * Run:  node tools/a11y.mjs <input.html> [--click "#show-answer"] [--tab-order 10]
 *       node tools/a11y.mjs --route /de/demos/example-demo      (needs npm run build:prod)
 */
import { VIEWPORTS, gotoSettled, launchBrowser, openOffline } from '../scripts/lib/browser.mjs';
import { AXE_CANNOT_SEE, loadAxe, readTags, runAxe, verdict } from '../scripts/lib/a11y-verdict.mjs';
import { printAdvisory } from '../scripts/lib/overrides.mjs';
import { EXIT, ToolError, positiveInt, runTool } from './lib/cli.mjs';
import { TARGET_OPTIONS, clickAndSettle, openDetails, openTarget } from './lib/target.mjs';

/** Tab n times from the top of a fresh page; each stop with role, name and what is off about it. */
async function tabOrder(page, n) {
  const stops = [];
  for (let i = 1; i <= n; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        body: el === document.body || el === document.documentElement,
        zero: r.width === 0 || r.height === 0,
        outside: r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth,
      };
    });
    // Focus back on the page itself: Tab has left the last focusable element (or there is
    // none). That is the end of the keyboard path, not a stop, so the list ends here.
    if (info.body) break;
    const handle = await page.evaluateHandle(() => document.activeElement);
    const snap = await page.accessibility.snapshot({ root: handle, interestingOnly: false }).catch(() => null);
    await handle.dispose();
    const name = (snap?.name || '').replace(/\s+/g, ' ').trim();
    const problems = [];
    if (info.zero) problems.push('focused element has no size (invisible)');
    else if (info.outside) problems.push('focused element is outside the visible area');
    stops.push({
      n: i,
      tag: info.tag,
      role: snap?.role || '',
      name: name.length > 60 ? `${name.slice(0, 59)}…` : name,
      problems,
    });
  }
  return stops;
}

await runTool({
  id: 'a11y',
  summary: "accessibility check of a file or a portal route, with the kit's A11Y verdict",
  usage: 'node tools/a11y.mjs <input.html> | --route </de/…> [options]',
  description: [
    'Runs axe-core in a headless browser, light and dark, in every state you --click into,',
    'and judges the result by the A11Y standard: a [hard] rule violated means exit 1.',
  ],
  options: {
    ...TARGET_OPTIONS,
    scheme: {
      type: 'string',
      arg: 'light|dark|both',
      help: 'colour scheme(s) to check',
      default: 'both',
      choices: ['light', 'dark', 'both'],
    },
    viewport: {
      type: 'string',
      arg: 'desktop|mobile',
      help: 'window size',
      default: 'desktop',
      choices: ['desktop', 'mobile'],
    },
    easy: { type: 'boolean', help: "switch the portal's Easy-Language preference on before loading" },
    'open-details': { type: 'boolean', help: 'open every <details> before each audit' },
    click: { type: 'string', arg: '<selector>', help: 'click this element, then audit again', multiple: true },
    'tab-order': { type: 'string', arg: '<n>', help: 'list the first n stops of the keyboard (Tab) path' },
  },
  examples: [
    'node tools/a11y.mjs out/teacher/lernseite.html --click "#mode-easy" --tab-order 8',
    'node tools/a11y.mjs --route /de/demos/example-demo --scheme dark',
  ],
  async run({ values, positionals, report, root }) {
    const tabs = positiveInt('tab-order', values['tab-order']);
    const clicks = values.click ?? [];
    const schemes = values.scheme === 'both' ? ['light', 'dark'] : [values.scheme];
    let tags;
    let axe;
    try {
      tags = readTags();
      axe = loadAxe();
    } catch (err) {
      throw new ToolError(EXIT.ENV, `${err.message.split('\n')[0]} — run \`npm install\` in the project folder.`);
    }

    const target = await openTarget(root, { positionals, values });
    const blocking = [];
    const advisory = [];
    const byHand = new Map();
    const blocked = new Set();
    let states = 0;
    let stops = [];
    try {
      const browser = await launchBrowser();
      try {
        const open = async (scheme) => {
          const { page, aborted } = await openOffline(browser, {
            origin: target.origin,
            fileDir: target.fileDir,
            viewport: VIEWPORTS[values.viewport],
            scheme,
            easy: !!values.easy,
          });
          await gotoSettled(page, target.url);
          return { page, aborted };
        };
        for (const scheme of schemes) {
          const { page, aborted } = await open(scheme);
          for (let k = 0; k <= clicks.length; k++) {
            if (k > 0) await clickAndSettle(page, clicks[k - 1]);
            if (values['open-details']) await openDetails(page);
            const label = `${target.slug}${values.easy ? ' (easy)' : ''} [${scheme}]${k ? ` after click ${k} (${clicks[k - 1]})` : ''}`;
            const { violations, incomplete } = await runAxe(page, axe.source, { incomplete: true });
            const judged = verdict(violations, { tags });
            for (const v of judged.blocking) blocking.push({ label, ...v });
            for (const a of judged.advisory) advisory.push({ label, ...a });
            for (const i of incomplete) {
              const seen = byHand.get(i.id) || { ...i, nodes: new Set() };
              for (const node of i.nodes) seen.nodes.add(node);
              byHand.set(i.id, seen);
            }
            states++;
            const n = judged.blocking.length;
            report.say(`  ${n ? 'FAIL' : 'ok  '} ${label} — ${violations.length} violation(s), ${n} blocking`);
          }
          for (const url of aborted) blocked.add(url);
          await page.close();
        }
        if (tabs) {
          const { page } = await open(schemes[0]);
          stops = await tabOrder(page, tabs);
          await page.close();
        }
      } finally {
        await browser.close();
      }
    } finally {
      await target.close();
    }

    const print = (list) => {
      for (const e of list) {
        report.say(`  - ${e.label}  ${e.rule}  axe:${e.id} (${e.impact}) — ${e.help}`);
        for (const n of e.nodes.slice(0, 5)) report.say(`      ${n}`);
        if (e.nodes.length > 5) report.say(`      … and ${e.nodes.length - 5} more`);
      }
    };
    report.say('');
    report.say(
      `axe-core ${axe.version} · ${target.slug} · ${schemes.length} colour scheme(s) · ${states} audited state(s)`,
    );
    if (advisory.length) {
      report.say(`\nAdvisory (${advisory.length}) — not mapped to an A11Y rule, or relaxed by an override:`);
      print(advisory);
      for (const ovr of new Set(advisory.map((e) => e.override).filter(Boolean))) {
        const hits = advisory.filter((e) => e.override === ovr).map((e) => `${e.label}  axe:${e.id}`);
        printAdvisory(ovr, hits, { gate: 'a11y', log: (l) => report.say(l) });
      }
    }
    for (const a of advisory) {
      report.finding({
        kind: 'violation',
        state: a.label,
        rule: a.rule,
        axe: a.id,
        impact: a.impact,
        help: a.help,
        nodes: a.nodes,
      });
    }
    if (byHand.size) {
      report.say(`\nCheck by hand (${byHand.size}) — axe could not decide:`);
      for (const i of byHand.values()) {
        report.say(`  - axe:${i.id} on ${i.nodes.size} element(s) — ${i.help}`);
        report.finding({ kind: 'check-by-hand', axe: i.id, help: i.help, nodes: [...i.nodes] });
      }
    }
    if (tabs) {
      report.say(`\nTab order (${stops.length} of the ${tabs} stop(s) asked for):`);
      for (const s of stops) {
        report.say(
          `  ${String(s.n).padStart(2)}. ${s.role || s.tag} "${s.name}"${s.problems.length ? `  ← ${s.problems.join('; ')}` : ''}`,
        );
        for (const p of s.problems) report.warn(`tab stop ${s.n} (${s.tag}): ${p}`);
      }
      if (stops.length < tabs) {
        report.say(
          stops.length
            ? `  (the keyboard path ends after ${stops.length} stop(s): the next Tab leaves the page)`
            : '  (nothing on the page takes keyboard focus)',
        );
      }
      report.data.tabOrder = stops;
    }
    for (const url of blocked) report.warn(`blocked request (the tool works offline): ${url}`);
    if (blocking.length) {
      report.say(`\nBlocking (${blocking.length}) — violations of [hard] A11Y rules:`);
      print(blocking);
      for (const b of blocking) {
        report.finding(
          {
            kind: 'violation',
            state: b.label,
            rule: b.rule,
            axe: b.id,
            impact: b.impact,
            help: b.help,
            nodes: b.nodes,
          },
          { blocking: true },
        );
      }
      report.say('\na11y: FAIL');
    } else {
      report.say(`\na11y: PASS — no violation of a [hard] A11Y rule in the ${states} checked state(s).`);
    }
    report.notChecked.push(...AXE_CANNOT_SEE, 'every state you did not --click into');
  },
});
