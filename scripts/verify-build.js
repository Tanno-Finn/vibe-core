#!/usr/bin/env node
/**
 * Verify that dist/vibecore/browser/ contains a complete production build.
 *
 * Used by:
 *   - build:verify, as `--mid-chain` (self-verify post-build, exits non-zero on FAIL).
 *     It runs before the manifest is written, so it alone may pass over a missing or
 *     stale manifest — see checkTestGate()
 *   - build:prod, once more as its LAST step — after write-build-manifest.js, so this
 *     run judges the manifest belonging to the build that just happened
 *   - by hand before publishing a dist/ (`node scripts/verify-build.js`), which is the
 *     pre-upload check any publishing step should make. Like the final step it FAILS
 *     when the manifest is missing or older than the index.html beside it (a raw
 *     `ng build` leaves exactly that)
 *
 * Rules live in scripts/build-artifacts.js (single source of truth).
 *
 * It also runs scripts/check-imprint.mjs: once siteUrl / SITE_BASE_URL names a real
 * domain, an imprint or privacy notice still carrying the kit's placeholders fails the
 * build (§ 5 DDG, Art. 13 DSGVO). With no real domain set it is an advisory line only.
 *
 * Usage:
 *   node scripts/verify-build.js
 *   node scripts/verify-build.js --json   # machine-readable
 *   node scripts/verify-build.js --mid-chain   # build:verify only — tolerate a missing
 *                                              # or stale manifest (not for hand runs)
 *   node scripts/verify-build.js --selftest    # prove the placeholder-domain rule on fixtures
 *
 * Exit codes:
 *   0  build is complete
 *   1  build incomplete (FAIL)
 *   2  internal error
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { runChecks, findPlaceholderDomains, BROWSER_DIR } = require('./build-artifacts');

const jsonMode = process.argv.includes('--json');
// Opt-in leniency for the one call that runs before the manifest exists (build:verify,
// inside build:prod). Every other run — by hand, or build:prod's final step — is strict.
const midChain = process.argv.includes('--mid-chain');

function fmt(p) {
  if (p.kind === 'missing-file') return `  MISSING  ${p.path}\n           → ${p.reason}`;
  if (p.kind === 'undersize-file')
    return `  TOO SMALL ${p.path} (${p.actualSize} < ${p.expectedMinSize} bytes)\n           → ${p.reason}`;
  if (p.kind === 'missing-prerender') return `  MISSING PRERENDER ${p.path}\n           → ${p.reason}`;
  if (p.kind === 'undersize-prerender')
    return `  STUB PRERENDER ${p.path} (${p.actualSize} < ${p.expectedMinSize} bytes)\n           → ${p.reason}`;
  if (p.kind === 'missing-dir') return `  MISSING DIR ${p.path}\n           → ${p.reason}`;
  if (p.kind === 'undercount-bundle')
    return `  UNDERCOUNT ${p.path} (${p.actual} < ${p.expectedMin})\n           → ${p.reason}`;
  if (p.kind === 'forbidden-file') return `  FORBIDDEN  ${p.path}\n           → ${p.reason}`;
  if (p.kind === 'sentinel-leak') return `  DEV LEAK   ${p.path}\n           → ${p.reason}`;
  if (p.kind === 'raw-i18n-key') return `  RAW KEY    ${p.path}\n           → ${p.reason}`;
  return `  UNKNOWN ${JSON.stringify(p)}`;
}

/**
 * The manifest's test verdict, enforced — until 2026-09-07 `tests.gate` had no reader
 * at all: every script, this one included, ignored it, so the field a bypass leaves
 * behind was a note for a human and nothing else.
 *
 * Only a FINISHED build is judged. Inside `build:verify` this script runs (with
 * `--mid-chain`) before the manifest is rewritten, so what it finds there belongs to
 * the previous build; in that run alone a missing manifest, or one older than the
 * index.html beside it, is skipped rather than failed. `build:prod` then runs this
 * script a second time as its final step, after write-build-manifest.js — that run
 * sees the current manifest and a gate that is not "passed" refuses the build. Without
 * `--mid-chain` (the final step, a hand run before publishing) a missing or stale
 * manifest FAILS: until 2026-09-23 a hand run exited 0 on a dist/ from a raw `ng build`
 * with "no build manifest yet", which is exactly the dist/ this check exists to catch.
 * (Before 2026-09-10 no such second run existed and the comment here deferred
 * enforcement to a `scripts/deploy.py` that was never written, so nothing ever read the
 * verdict.) `SKIP_TEST_GATE` remains the escape for a verdict that is not "passed", and
 * it now has to be set at THIS step too, so the override is a decision someone makes
 * while shipping rather than one made hours earlier. It does not excuse a missing or
 * stale manifest — skipping the tests still goes through build:prod, which records the
 * skip.
 */
const SKIP_VALUES = new Set(['1', 'true', 'yes', 'on']);

function checkTestGate() {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(`${BROWSER_DIR}/.build-manifest.json`, 'utf8'));
  } catch {
    // No (readable) manifest. Mid-chain that is expected — the final step judges it.
    if (midChain) return null;
    return {
      fail: 'no readable build manifest (.build-manifest.json) — this dist/ did not come out of npm run build:prod',
    };
  }
  // The manifest is judged against the index.html beside it. If that file is gone the
  // comparison has no meaning, so say so rather than dying on a raw ENOENT — the missing
  // required-file check below is the one that should report an absent index.html.
  let indexMtime;
  try {
    indexMtime = fs.statSync(`${BROWSER_DIR}/index.html`).mtimeMs;
  } catch {
    return { skipped: 'no browser/index.html to compare the manifest against' };
  }
  const createdAt = Date.parse(manifest.createdAt);
  if (!(createdAt >= indexMtime)) {
    // Older than the build output (or no parseable timestamp): it describes another build.
    if (midChain) {
      return { skipped: 'the manifest predates this build output — the test verdict is checked once it is rewritten' };
    }
    return {
      fail: 'the build manifest predates this build output (stale) — its test verdict belongs to an earlier build',
    };
  }
  const gate = manifest.tests?.gate;
  if (gate === 'passed')
    return { ok: `test gate: passed (${manifest.tests.files} files / ${manifest.tests.tests} tests)` };
  const detail = manifest.tests?.reason ? ` — ${manifest.tests.reason}` : '';
  if (SKIP_VALUES.has((process.env.SKIP_TEST_GATE ?? '').trim().toLowerCase())) {
    return {
      override: `test gate is "${gate}"${detail}; SKIP_TEST_GATE is set, so this build is allowed to ship untested`,
    };
  }
  return { fail: `test gate is "${gate}", not "passed"${detail}`, overridable: true };
}

/**
 * The imprint gate (scripts/check-imprint.mjs) — a child process because that script is
 * an ES module with its own CLI. In text mode its report goes straight to the terminal;
 * in --json mode its JSON result is embedded under `imprint`.
 */
function checkImprint() {
  const script = path.join(__dirname, 'check-imprint.mjs');
  const args = jsonMode ? [script, '--json'] : [script];
  const res = spawnSync(process.execPath, args, {
    encoding: 'utf8',
    stdio: jsonMode ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
  if (!jsonMode) return { ok: res.status === 0 };
  try {
    return JSON.parse(res.stdout);
  } catch {
    return { ok: false, error: `check-imprint.mjs produced no JSON (exit ${res.status})` };
  }
}

/**
 * The placeholder-domain rule (build-artifacts.js findPlaceholderDomains) on fixtures:
 * it must catch the kit's old head, and must spare a real domain, a relative URL,
 * a placeholder outside the head, and a look-alike host.
 */
function selftest() {
  const head = (tags) => `<html><head>${tags}</head><body><a href="https://example.com/x">x</a></body></html>`;
  const cases = [
    {
      name: 'the old head: canonical, og:url, og:image, hreflang on your-domain.example',
      html: head(
        '<link rel="canonical" href="https://your-domain.example/de/home">' +
          '<meta property="og:url" content="https://your-domain.example/">' +
          '<meta property="og:image" content="https://your-domain.example/assets/images/og-image.png">' +
          '<link rel="alternate" hreflang="en" href="https://your-domain.example/en/home">',
      ),
      want: 4,
    },
    {
      name: 'example.com in twitter:image',
      html: head('<meta name="twitter:image" content="http://www.example.com/i.png">'),
      want: 1,
    },
    {
      name: 'a domain outside the example names',
      html: head(
        '<link rel="canonical" href="https://lernportal.test/de/home"><meta property="og:url" content="https://lernportal.test/">',
      ),
      want: 0,
    },
    { name: 'a relative og:image', html: head('<meta property="og:image" content="/assets/og.png">'), want: 0 },
    {
      name: 'a look-alike host',
      html: head('<meta property="og:url" content="https://example.community.test/">'),
      want: 0,
    },
    { name: 'a placeholder only in the body', html: head('<meta property="og:type" content="website">'), want: 0 },
  ];
  let failed = 0;
  for (const c of cases) {
    const got = findPlaceholderDomains(c.html).length;
    if (got !== c.want) {
      failed++;
      console.error(`  FAIL  ${c.name}: ${got} hit(s), expected ${c.want}`);
    }
  }
  console.log(failed ? `verify-build --selftest: FAIL — ${failed} case(s)` : 'verify-build --selftest: PASS');
  return failed === 0;
}

function main() {
  if (process.argv.includes('--selftest')) process.exit(selftest() ? 0 : 1);
  if (!fs.existsSync(BROWSER_DIR)) {
    if (jsonMode) {
      console.log(
        JSON.stringify({ ok: false, error: 'dist/vibecore/browser does not exist', browserDir: BROWSER_DIR }),
      );
    } else {
      console.error(`\nFAIL  dist/vibecore/browser/ does not exist.\n      Did you run \`npm run build:prod\`?\n`);
    }
    process.exit(1);
  }

  const result = runChecks(BROWSER_DIR);
  const testGate = checkTestGate();
  const imprint = checkImprint();

  if (jsonMode) {
    const ok = result.ok && !testGate?.fail && imprint.ok;
    console.log(JSON.stringify({ ...result, ok, testGate, imprint }, null, 2));
    process.exit(ok ? 0 : 1);
  }

  if (!imprint.ok) {
    // check-imprint.mjs has already printed the findings and the bilingual fix.
    console.error(`FAIL  verify-build: the imprint gate refused this build (see above).\n`);
    process.exit(1);
  }

  if (testGate?.fail) {
    console.error(`\nFAIL  ${testGate.fail}`);
    console.error(`      This build is not shippable: its manifest does not say the curated suite ran green.`);
    console.error(`      Fix:      npm run build:prod            (runs the suite as its last gate)`);
    if (testGate.overridable) {
      console.error(`      Override: SKIP_TEST_GATE=1 node scripts/verify-build.js   ships it anyway, on purpose`);
      console.error(`      Windows:  $env:SKIP_TEST_GATE='1'; node scripts/verify-build.js`);
    }
    console.error('');
    process.exit(1);
  }

  if (result.ok) {
    console.log(`\nOK  Build looks complete.`);
    console.log(`    ${result.summary.filesOk}/${result.summary.filesChecked} required files present`);
    console.log(`    ${result.summary.languagesOk}/${result.summary.languagesChecked} SEO languages prerendered`);
    console.log(`    ${result.summary.bundleGroupsChecked} bundle groups OK`);
    console.log(`    ${result.summary.forbiddenAbsent} forbidden files absent`);
    console.log(`    dev sentinel absent from dist (0 leaks, dev code stripped)`);
    console.log(`    no placeholder domain in any prerendered head`);
    if (testGate?.ok) console.log(`    ${testGate.ok}`);
    if (testGate?.skipped) console.log(`    ${testGate.skipped}`);
    if (testGate?.override) console.log(`    OVERRIDE — ${testGate.override}`);
    if (!testGate) console.log(`    no build manifest yet (mid-chain) — the final step of build:prod judges it`);
    console.log('');
    process.exit(0);
  }

  console.error(`\nFAIL  Build is INCOMPLETE — ${result.problems.length} problem(s):\n`);
  for (const p of result.problems) {
    console.error(fmt(p));
  }
  console.error(`\n  Most likely cause:`);
  console.error(`    Someone ran \`ng build\` instead of \`npm run build:prod\`.`);
  console.error(`    \`ng build\` skips the prebuild steps (content and i18n bundles, prerender`);
  console.error(`    routes, sitemap) and dist:prepare:prod (the index.html restore).`);
  console.error(`\n  Fix:`);
  console.error(`    npm run build:prod\n`);
  process.exit(1);
}

main();
