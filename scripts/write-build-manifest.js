#!/usr/bin/env node
/**
 * Write dist/vibecore/browser/.build-manifest.json with build provenance.
 *
 * Runs at the end of `npm run build:prod`. Records:
 *   - git commit + branch
 *   - timestamp + script that produced the build
 *   - artifact inventory snapshot
 *   - the test gate's verdict for THIS build output (see readTestGate)
 *
 * `ng build` standalone does NOT run this → the manifest stays stale → the final
 * `node scripts/verify-build.js` step of build:prod detects it (a manifest older than
 * the index.html beside it), as does anyone running verify-build before publishing.
 *
 * This step is also where the test verdict becomes binding: a `tests.gate` that is not
 * "passed" exits non-zero, so `npm run build:prod` cannot finish over a red, missing or
 * stale verdict. `SKIP_TEST_GATE` (1/true/yes/on) is the one deliberate escape and has
 * to be set at THIS step, not merely hours earlier when the suite was skipped.
 *
 * `buildScript` is `npm_lifecycle_event`, which npm sets per script: it reads
 * `build:prod` because that chain now calls this file directly. It read
 * `build:manifest` on every manifest ever written while the chain went through a
 * nested `npm run build:manifest` — a nested run overwrites the variable, so the
 * field said "the manifest step ran" and never which build it belonged to.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');
const {
  runChecks,
  BROWSER_DIR,
  REQUIRED_FILES,
  REQUIRED_LANGUAGE_DIRS,
  REQUIRED_BUNDLE_COUNTS,
} = require('./build-artifacts');

function safeGit(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: path.join(__dirname, '..'), encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

/**
 * What the test gate (scripts/check-test-baseline.mjs, the step before this one in
 * build:prod) recorded for THIS build output: passed / failed / skipped with the counts.
 *
 * The clock was the only binding until 2026-09-07, and a clock cannot tell a verdict
 * that belongs to this build from one produced beside it. The laundering path was
 * three commands: `SKIP_TEST_GATE=1 npm run build:prod` (manifest says "skipped"),
 * then `npm run test:baseline && npm run build:manifest` — a manifest claiming
 * "passed" over an artifact no test ever saw, because the second verdict is newer
 * than the index.html nobody rebuilt. Four questions now, and any "no" downgrades:
 *
 *   1. Is there a verdict at all?                              -> not-run
 *   2. Was it written against THIS index.html (sha256)?        -> stale
 *   3. Did the production chain write it (`invokedBy`)?        -> not-run
 *   4. Was the tree the same as the one being shipped?         -> stale
 *
 * Question 3 is the one that closes the laundering path: inside `build:prod` the
 * gate is a direct `node …` step and inherits `npm_lifecycle_event=build:prod`,
 * while `npm run test:baseline` records `test:baseline` (measured, Windows npm).
 * `reason` says which question failed, so the downgrade is readable.
 */
const CHAIN_SCRIPTS = new Set(['build:prod']);

/** Same affirmative-only reading of SKIP_TEST_GATE as the other two scripts in the chain. */
const SKIP_VALUES = new Set(['1', 'true', 'yes', 'on']);

function readTestGate() {
  const gateFile = path.join(BROWSER_DIR, '..', '.test-gate.json');
  const script = 'scripts/check-test-baseline.mjs';
  let verdict;
  try {
    verdict = JSON.parse(fs.readFileSync(gateFile, 'utf8'));
  } catch {
    return { gate: 'not-run', script, reason: 'no verdict file — the test gate did not run for this build' };
  }
  const down = (gate, reason) => ({ gate, script, reason, recorded: verdict });

  let indexSha256 = null;
  try {
    indexSha256 = crypto
      .createHash('sha256')
      .update(fs.readFileSync(path.join(BROWSER_DIR, 'index.html')))
      .digest('hex');
  } catch {
    return down('stale', 'there is no browser/index.html to bind the verdict to');
  }
  // Order matters for the diagnosis, not for the outcome: both downgrades stop the build,
  // but a truncated verdict file has no gate field and would otherwise be reported as
  // "stale" — sending the reader off to compare hashes for a file that says nothing at all.
  if (typeof verdict.gate !== 'string' || !verdict.gate) {
    return down('not-run', 'the verdict file has no gate field — it is truncated or was not written by the test gate');
  }
  if (verdict.build?.indexSha256 !== indexSha256) {
    return down('stale', 'the verdict was written against a different browser/index.html than the one in dist');
  }
  if (!CHAIN_SCRIPTS.has(verdict.invokedBy)) {
    return down(
      'not-run',
      `the verdict came from "${verdict.invokedBy ?? 'an unnamed run'}", not from the production build chain`,
    );
  }
  const head = safeGit('rev-parse HEAD');
  const dirty = safeGit('status --porcelain')?.length > 0;
  if (verdict.git?.head !== head || verdict.git?.dirty !== dirty) {
    return down('stale', 'the working tree moved between the test run and the manifest');
  }
  return { script, ...verdict };
}

function main() {
  if (!fs.existsSync(BROWSER_DIR)) {
    console.error(`write-build-manifest: ${BROWSER_DIR} does not exist`);
    process.exit(1);
  }

  const result = runChecks(BROWSER_DIR);

  const manifest = {
    schema: 1,
    createdAt: new Date().toISOString(),
    buildScript: process.env.npm_lifecycle_event || 'unknown',
    git: {
      commit: safeGit('rev-parse HEAD'),
      shortCommit: safeGit('rev-parse --short HEAD'),
      branch: safeGit('rev-parse --abbrev-ref HEAD'),
      dirty: safeGit('status --porcelain')?.length > 0,
    },
    node: {
      version: process.version,
      platform: process.platform,
    },
    verification: {
      passed: result.ok,
      problemCount: result.problems.length,
      summary: result.summary,
    },
    tests: readTestGate(),
    expectedArtifacts: {
      files: REQUIRED_FILES.length,
      prerenderedLanguages: REQUIRED_LANGUAGE_DIRS.length,
      bundleGroups: REQUIRED_BUNDLE_COUNTS.length,
    },
  };

  const manifestPath = path.join(BROWSER_DIR, '.build-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${manifestPath}`);
  console.log(`  commit: ${manifest.git.shortCommit} (${manifest.git.branch})`);
  console.log(`  verification: ${manifest.verification.passed ? 'PASS' : 'FAIL'}`);
  // `gate` is read out of a file on disk, so it can be anything (or absent) if that file
  // was truncated. Narrowing it to a non-empty string first: a crash here used to take the
  // whole build down with a TypeError instead of the readable verdict this line exists to print.
  const gate = typeof manifest.tests.gate === 'string' && manifest.tests.gate ? manifest.tests.gate : 'unknown';
  console.log(
    `  test gate:    ${gate === 'passed' ? `PASS (${manifest.tests.files} files / ${manifest.tests.tests} tests)` : gate.toUpperCase()}`,
  );
  if (manifest.tests.reason) console.log(`                → ${manifest.tests.reason}`);

  if (!manifest.verification.passed) {
    console.error(`\nManifest written but build verification FAILED — see verify-build output.`);
    process.exit(1);
  }

  // The test verdict is binding here, at the step that records it. Until 2026-09-10 only
  // `verification.passed` could fail this script, so a manifest saying `failed` /
  // `stale` / `not-run` was printed and the build exited 0 — the whole enforcement chain
  // ended in a script (scripts/deploy.py) that has never existed in this repo.
  if (gate !== 'passed') {
    if (SKIP_VALUES.has((process.env.SKIP_TEST_GATE ?? '').trim().toLowerCase())) {
      console.log(
        `\nOVERRIDE — test gate is "${gate}"; SKIP_TEST_GATE is set, so this build is allowed to ship untested.`,
      );
      return;
    }
    console.error(`\nFAIL  test gate is "${gate}", not "passed" — this build is not shippable.`);
    if (manifest.tests.reason) console.error(`      → ${manifest.tests.reason}`);
    console.error(`      Fix:      npm run build:prod   (runs the curated suite as its last gate)`);
    console.error(`      Override: SKIP_TEST_GATE=1 npm run build:prod   ships it untested, on purpose`);
    console.error(`      Windows:  $env:SKIP_TEST_GATE='1'; npm run build:prod\n`);
    process.exit(1);
  }
}

main();
