#!/usr/bin/env node
/**
 * doctor.mjs — can the kit tools run on this computer? (kit tool `doctor`).
 *
 * WHAT: one line per check, each ok or missing, and for every missing one the fix in one
 * sentence: the Node version against package.json → engines; the packages the tools load
 * (puppeteer, axe-core, jsdom, marked) resolvable; a browser starts and closes again
 * (about two seconds); `out/` writable. A last line says whether a verified build of the
 * portal exists.
 *
 * HOW: exit 0 when every tool can run, 3 when one of the checks above fails. The build
 * line is information, not a failure: only the portal-route modes of `a11y` and `shot`,
 * `preview` and `export-site` need a build, and a fresh checkout has none until
 * `npm run build:prod` — the file tools (pdf, docx, a11y on a file …) run without it.
 * The write check creates one empty file in out/tools/ and removes it again.
 *
 * WHAT IT CANNOT SEE: whether the tools give the right answers (that is
 * `npm run test:tools`), fonts a handout names but this computer lacks, and anything the
 * portal build itself needs beyond Node (the build says so when it runs).
 *
 * Run:  node tools/doctor.mjs   (--json for one JSON object)
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXIT, ToolError, runTool } from './lib/cli.mjs';

const DEPS = ['puppeteer', 'axe-core', 'jsdom', 'marked'];

/** Does `version` (x.y.z) satisfy an engines range made of `^a.b.c`, `>=a.b.c` and `||`? */
function satisfies(version, range) {
  const v = version.replace(/^v/, '').split('.').map(Number);
  const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  return range.split('||').some((part) => {
    const m = /^\s*(\^|>=)?\s*(\d+)\.(\d+)\.(\d+)\s*$/.exec(part);
    if (!m) return false;
    const want = [Number(m[2]), Number(m[3]), Number(m[4])];
    if (m[1] === '>=') return cmp(v, want) >= 0;
    if (m[1] === '^') return v[0] === want[0] && cmp(v, want) >= 0;
    return cmp(v, want) === 0;
  });
}

await runTool({
  id: 'doctor',
  summary: 'can the kit tools run on this computer?',
  usage: 'node tools/doctor.mjs [--json]',
  description: [
    'Checks Node, the installed packages, the browser the tools use and write access,',
    'and says in one sentence how to fix anything that is missing.',
  ],
  options: {},
  examples: ['node tools/doctor.mjs'],
  async run({ positionals, report, root }) {
    if (positionals.length) throw new ToolError(EXIT.USAGE, 'doctor takes no input.');
    const checks = [];
    const check = (id, ok, detail, fix, { blocking = true } = {}) => {
      checks.push({ id, ok, detail, ...(ok ? {} : { fix }), blocking });
      report.say(`${ok ? '  ok      ' : blocking ? '  MISSING ' : '  not yet '}${id}: ${detail}`);
      if (!ok) report.say(`          fix: ${fix}`);
      if (!ok && blocking) report.fail(EXIT.ENV);
    };

    // Node
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    const range = pkg.engines?.node;
    if (range) {
      check(
        'node',
        satisfies(process.version, range),
        `${process.version} (the kit wants ${range})`,
        `install a Node version that matches ${range} (the file .nvmrc names the one the kit is built with).`,
      );
    } else {
      check('node', true, `${process.version} (package.json names no engines range)`);
    }

    // Packages
    const missing = [];
    for (const dep of DEPS) {
      try {
        import.meta.resolve(dep);
      } catch {
        missing.push(dep);
      }
    }
    check(
      'packages',
      missing.length === 0,
      missing.length ? `not installed: ${missing.join(', ')}` : `${DEPS.join(', ')} installed`,
      'run `npm install` in the project folder.',
    );

    // Browser
    if (missing.includes('puppeteer')) {
      check('browser', false, 'cannot try: puppeteer is not installed', 'run `npm install` in the project folder.');
    } else {
      const { launchBrowser } = await import('../scripts/lib/browser.mjs');
      try {
        const browser = await launchBrowser();
        try {
          check('browser', true, `${await browser.version()} starts and closes`);
        } finally {
          await browser.close();
        }
      } catch (err) {
        check('browser', false, err.message.split('\n')[0], err.hint || 'run `npm install` in the project folder.');
      }
    }

    // Write access
    const probeDir = join(root, 'out', 'tools');
    const probe = join(probeDir, `.doctor-${process.pid}`);
    try {
      mkdirSync(probeDir, { recursive: true });
      try {
        writeFileSync(probe, '');
      } finally {
        rmSync(probe, { force: true });
      }
      check('write', true, 'out/tools/ is writable');
    } catch (err) {
      check(
        'write',
        false,
        `cannot write to out/tools/ (${err.code || err.message})`,
        'make sure the project folder is not read-only and not open in a program that locks it.',
      );
    }

    // Build (information)
    const manifest = join(root, 'dist', 'vibecore', 'browser', '.build-manifest.json');
    let built = null;
    try {
      built = JSON.parse(readFileSync(manifest, 'utf8'));
    } catch {
      /* no build */
    }
    const verified = built?.verification?.passed === true;
    check(
      'build',
      verified,
      built
        ? verified
          ? 'a verified build of the portal exists'
          : 'a build exists, but it is not verified'
        : 'no build of the portal yet (only needed for --route, preview and export-site)',
      'run `npm run build:prod` (about three minutes).',
      { blocking: false },
    );

    report.data.checks = checks;
    report.say('');
    report.say(
      report.exitCode === EXIT.OK
        ? 'All kit tools can run here.'
        : 'Some kit tools cannot run here yet — fix the MISSING lines above.',
    );
    report.notChecked.push('whether the tools give the right answers: run `npm run test:tools`');
  },
});
