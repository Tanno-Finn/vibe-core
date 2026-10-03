#!/usr/bin/env node
/**
 * shot.mjs — screenshots of a file or a portal route (kit tool `shot`, capability
 * `check:screenshot`).
 *
 * WHAT: takes PNG screenshots of a local HTML file or a portal route in the desktop
 * (1280×800) and mobile (390×844 at device scale 2, touch) viewport, in the light and/or
 * dark colour scheme, optionally with the portal's Easy-Language preference on, and one
 * more shot after each --click. It prints the absolute path of every PNG, so an agent
 * can open them and look at what it built instead of guessing.
 *
 * HOW: offline, like every kit tool (the file's folder, the served build or a loopback
 * dev server, and `data:`; other requests are blocked and reported). Transitions and
 * animations are off and fonts loaded before each shot, so two runs on the same input
 * and machine give the same bytes. Names: <slug>-<viewport>-<scheme>[-easy][-click<k>].png,
 * slug = the file name or the route with "/" → "-". Default folder out/tools/shot/
 * (git-ignored evidence, never next to the material).
 *
 * WHAT IT CANNOT SEE: it takes pictures; judging them is yours. Hover and focus
 * states, and anything that needs more than a click, are not captured.
 *
 * Run:  node tools/shot.mjs <input.html> [--scheme both] [--full-page]
 *       node tools/shot.mjs --route /de/demos/example-demo --viewport mobile
 */
import { join } from 'node:path';
import { VIEWPORTS, gotoSettled, launchBrowser, openOffline } from '../scripts/lib/browser.mjs';
import { runTool, outputPath } from './lib/cli.mjs';
import { TARGET_OPTIONS, clickAndSettle, openTarget } from './lib/target.mjs';

await runTool({
  id: 'shot',
  summary: 'screenshots of a file or a portal route (desktop/mobile × light/dark × easy)',
  usage: 'node tools/shot.mjs <input.html> | --route </de/…> [options]',
  description: ['Takes PNG screenshots and prints where each one is, so you (or an agent) can look at them.'],
  options: {
    ...TARGET_OPTIONS,
    viewport: {
      type: 'string',
      arg: 'desktop|mobile|both',
      help: 'window size(s)',
      default: 'both',
      choices: ['desktop', 'mobile', 'both'],
    },
    scheme: {
      type: 'string',
      arg: 'light|dark|both',
      help: 'colour scheme(s)',
      default: 'light',
      choices: ['light', 'dark', 'both'],
    },
    easy: { type: 'boolean', help: "switch the portal's Easy-Language preference on before loading" },
    'full-page': { type: 'boolean', help: 'the whole page, not just the visible window' },
    click: { type: 'string', arg: '<selector>', help: 'click this element, then take one more shot', multiple: true },
    'out-dir': { type: 'string', arg: '<dir>', help: 'folder for the PNGs', defaultText: 'out/tools/shot' },
    force: { type: 'boolean', help: 'replace existing PNGs of the same name' },
  },
  examples: [
    'node tools/shot.mjs out/teacher/lernseite.html --scheme both',
    'node tools/shot.mjs --route /de/home --viewport mobile --easy',
  ],
  async run({ values, positionals, report, root }) {
    const viewports = values.viewport === 'both' ? ['desktop', 'mobile'] : [values.viewport];
    const schemes = values.scheme === 'both' ? ['light', 'dark'] : [values.scheme];
    const clicks = values.click ?? [];
    const dir = values['out-dir'] ?? join(root, 'out', 'tools', 'shot');
    const target = await openTarget(root, { positionals, values });
    const blocked = new Set();
    // Inside the try: a --route target runs a server, which must stop even when a name below is refused.
    try {
      // Every file name is known up front, so an existing one stops the run before any browser starts.
      const plan = [];
      for (const viewport of viewports) {
        for (const scheme of schemes) {
          const shots = [];
          for (let k = 0; k <= clicks.length; k++) {
            const name = `${target.slug}-${viewport}-${scheme}${values.easy ? '-easy' : ''}${k ? `-click${k}` : ''}.png`;
            shots.push(outputPath(root, join(dir, name), { force: values.force }));
          }
          plan.push({ viewport, scheme, shots });
        }
      }

      // Pictures are written only after every --click matched, so a refused click leaves none behind.
      const taken = [];
      const browser = await launchBrowser();
      try {
        for (const { viewport, scheme, shots } of plan) {
          const { page, aborted } = await openOffline(browser, {
            origin: target.origin,
            fileDir: target.fileDir,
            viewport: VIEWPORTS[viewport],
            scheme,
            easy: !!values.easy,
          });
          await gotoSettled(page, target.url);
          for (let k = 0; k < shots.length; k++) {
            if (k > 0) await clickAndSettle(page, clicks[k - 1]);
            taken.push([
              shots[k],
              Buffer.from(await page.screenshot({ type: 'png', fullPage: !!values['full-page'] })),
            ]);
          }
          for (const url of aborted) blocked.add(url);
          await page.close();
        }
      } finally {
        await browser.close();
      }
      for (const [file, png] of taken) report.write(file, png);
    } finally {
      await target.close();
    }
    for (const url of blocked) report.warn(`blocked request (the tool works offline): ${url}`);
    report.say(`${report.outputs.length} screenshot(s) — open them to look.`);
    report.notChecked.push(
      'what the screenshots show: open and look at them',
      'hover and focus states, and anything behind more than a click',
    );
  },
});
