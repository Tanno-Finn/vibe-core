#!/usr/bin/env node
/**
 * check-test-baseline — the test-suite regression gate.
 *
 * The kit ships a CURATED Vitest subset (the `test` target's `include` list in
 * angular.json), not the 88 orphaned specs inherited from the source portal.
 * The pattern it models is agent-first: test the logic engine, not the canvas.
 * This gate pins the floor so the subset can only grow, never silently rot:
 *
 *   1. Runs the suite once, headless, via the Angular `@angular/build:unit-test`
 *      builder with the Vitest runner (`ng test --watch=false`), asking for BOTH
 *      the `default` console reporter (for a human) and the `json` reporter
 *      (written to a throwaway temp file) in the same run.
 *   2. Reads the number of GREEN test files and tests from that JSON report —
 *      not screen-scraped from console text, which a spec's own console.log or
 *      a failure diff could mis-parse.
 *   3. Fails (exit 1) if either count drops below the recorded baseline, if
 *      any test/file is reported as failed, or if any test is skipped/todo —
 *      all regressions.
 *
 * Raising the baseline is a deliberate act: add specs to angular.json's `include`,
 * confirm they are green, then bump BASELINE_FILES / BASELINE_TESTS here.
 *
 * Dependency-free (Node core only), like scripts/verify-harness.mjs and
 * scripts/check-design-system.mjs — no test framework is imported here; it drives
 * the real runner and reads its output.
 *
 * Since 2026-09-07 this gate is also the last step of `npm run build:prod`, before the
 * manifest is written. Two working sessions had reported "build:prod PASS" over a suite
 * in which six spec files did not load at all (a dev-tree import that only the test
 * build evaluates) — nothing routine ran the tests, and the devOnly-route guard from the
 * 2026-09-01 security assessment was silent for a night. A prod build now cannot finish
 * over a red suite. The one escape is deliberate and leaves a trace:
 * `SKIP_TEST_GATE=1 npm run build:prod` skips the run, prints so, and the build manifest
 * records `tests.gate: "skipped"` for the deploy to see.
 *
 * Usage:  node scripts/check-test-baseline.mjs
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * The gate leaves its verdict next to the build output so write-build-manifest can
 * record what actually happened (passed / failed / skipped, with the counts) instead
 * of inferring it. Written only when dist/vibecore exists — a standalone run before
 * any build has nowhere to leave it, and that is fine.
 *
 * A timestamp alone was not enough to say WHICH build a verdict belongs to. Three
 * things travel with it now, and write-build-manifest checks all three:
 *
 *   `build`     the sha256 of the `browser/index.html` that existed when the suite
 *               ran. A verdict written against a different artifact is `stale`,
 *               whatever its clock says.
 *   `invokedBy` `npm_lifecycle_event` of the run. Inside `build:prod` the gate is
 *               invoked as a direct `node …` step, so it reads `build:prod`; a
 *               standalone `npm run test:baseline` reads `test:baseline`. That is
 *               the difference between a verdict the production chain produced and
 *               one someone produced beside it (measured on Windows npm: a nested
 *               `npm run` resets the variable, a direct `node` call inherits it).
 *   `git`       HEAD and dirtiness AT TEST TIME. The manifest reads its own a step
 *               later; if the tree moved in between, the verdict describes a
 *               different source than the one being shipped.
 */
const GATE_RESULT_FILE = path.join(ROOT, 'dist', 'vibecore', '.test-gate.json');
const BUILT_INDEX = path.join(ROOT, 'dist', 'vibecore', 'browser', 'index.html');

function safeGit(args) {
  try {
    return spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' }).stdout?.trim() ?? null;
  } catch {
    return null;
  }
}

/** The build output this verdict is about, or null when there is none yet. */
function builtArtifact() {
  try {
    return { indexSha256: createHash('sha256').update(fs.readFileSync(BUILT_INDEX)).digest('hex') };
  } catch {
    return null;
  }
}

function recordGate(result) {
  if (!fs.existsSync(path.dirname(GATE_RESULT_FILE))) return;
  const verdict = {
    at: new Date().toISOString(),
    invokedBy: process.env.npm_lifecycle_event || null,
    build: builtArtifact(),
    git: { head: safeGit(['rev-parse', 'HEAD']), dirty: (safeGit(['status', '--porcelain']) || '').length > 0 },
    ...result,
  };
  fs.writeFileSync(GATE_RESULT_FILE, `${JSON.stringify(verdict, null, 2)}\n`, 'utf8');
}

// --- Baseline (raise deliberately when the curated subset grows) ------------
// 2026-09-10: lowered 17->15 / 280->239. A concurrent cleanup deleted 26 orphaned
// components/services that arrived dead from the source-portal extraction; two of
// the curated spec files went with them (rag-vector.engine.spec.ts,
// tfidf.engine.spec.ts, 41 tests together) and their entries were removed from
// angular.json's test.include in the same pass. Lowering the floor is the
// deliberate act this comment already asks for when the curated subset shrinks on
// purpose, not just when it grows.
// 2026-09-22: raised 15->31 / 239->394 by the storage and privacy hardening — storage/privacy
// specs (storage-key registry, safeStorage, update detection, reset, export/import,
// cookie banner), the collapsible-header spec, and specs for the translation,
// meta-SEO, navigation, unified-content/glossary and easy-language services, the
// route generator, all four route guards, JSON-LD escaping and the preloading list.
// 2026-09-22: raised 31->33 / 394->444 by the sources-page split — characterisation
// specs for the citation formats, export generators and escaping, and the page's
// filtering, grouping and export paths.
// 2026-09-23: raised 33->36 / 444->481 by the app-shell and catalog splits —
// characterisation specs for the shell (skip link, both sitemap modes, focus
// return, language switch) and the catalog page, plus the catalog export slice.
// 2026-09-23: raised again by the i18n split — lazy i18n chunks (route preload,
// first-lookup load, failed chunk, core keys, hydration replay), the production
// fallback rule, signal state and the guard: 36 / 497 after the merge.
// 2026-09-23: raised 36->40 / 497->524 by the route-map and date-format work — the route-map spec
// (maps may name only routed pages), the date-locale spec (US and German date
// formats), the glossary search-fold spec, and the orphan-map cleanup.
// 2026-09-23: raised 40->49 / 524->601 by a round of fixes — specs for the
// HTTP error interceptor, highlighting fallback, feedback rejection, timeline and
// page-search folding, the glossary popover's keyboard path, reduced motion, the
// interactive timeline's auto-play and the printed site host.
// 2026-09-23: raised 49->52 / 601->651 to the real count after the consent and
// dead-code follow-ups — among them the cookie settings reopened from the
// footer, the checkpoint toast spec, the progress-storage notes and the real SEO
// metadata.
// 2026-09-23: raised 52->56 / 651->684 to the real count after the design-system
// review follow-ups — the hub template's link, headings and result count, the
// FAB stack's roles and back-to-top focus, the banner hiding on a settings-page
// decision, the image alt with the image, and the narrow scrollBehavior() type.
// 2026-09-23: raised 56->57 / 684->692 — the Optimus aria-key spec: the key
// list, the four locale files and the merge into the library config held equal.
// 2026-09-23: raised 692->694 to the real count after the last style round —
// the ThemeService print switch (light paper on beforeprint, restored afterprint).
// 2026-09-28: raised 57->59 / 694->719 to the real count after make-it-yours C2 — the
// site-rules spec (site.json validation, logo text, page titles, placeholders), the
// shell and SEO titles naming the site from SITE_CONFIG, the start page as a routed page.
// 2026-09-28: raised 59->60 / 719->742 to the real count after make-it-yours C3/C4 — the
// feature catalog and switches (site-rules), the feature guard and the learn fallbacks,
// the menu without switched-off features, the new home spec (cards filtered), the
// feature routes held against app.routes.ts.
// 2026-09-28: raised 742->744 after make-it-yours C5 — the glossary popover drops its
// "go to glossary" link when the glossary is switched off, and keeps it while it is on.
// 2026-09-28: raised 60->62 / 744->761 after the make-it-yours review follow-up — no link
// into a switched-off feature (related refs, back buttons, catalog buttons, notices,
// roadmap, learn hub, path steps, progress) and no guard redirect loop on the start page.
// 2026-10-05: raised 62->64 / 761->783 to the real count (775 at 1.0.0, plus the eight
// German-guide-twin tests: the language switch, its resolver, the registry's German strings).
const BASELINE_FILES = 64;
const BASELINE_TESTS = 783;

const line = '='.repeat(66);
console.log(line);
console.log('  check-test-baseline — curated Vitest subset regression gate');
console.log(line);

// Only an affirmative value skips. `SKIP_TEST_GATE=0` and `=false` read as "do not
// skip" to anyone typing them, and a bare truthiness test would silently do the
// opposite — the one place where guessing wrong turns the gate off without saying so.
const SKIP_VALUES = new Set(['1', 'true', 'yes', 'on']);
const skipRequested = SKIP_VALUES.has((process.env.SKIP_TEST_GATE ?? '').trim().toLowerCase());

if (skipRequested) {
  console.log('  SKIPPED — SKIP_TEST_GATE is set; the suite did NOT run.');
  console.log('  The build manifest will record tests.gate = "skipped". Unset it before shipping.');
  console.log(line);
  recordGate({ gate: 'skipped' });
  process.exit(0);
}

// --- Run the suite once, headless (Node/jsdom, no browser) ------------------
//
// The verdict is parsed from Vitest's machine-readable JSON reporter, not
// screen-scraped from console text. The old approach ran an unanchored regex
// (`out.match(/Tests[^\n]*?(\d+)\s+passed/)`) over combined stdout+stderr and
// took the FIRST match anywhere in the buffer — a spec's own `console.log`,
// or a failure diff that happens to contain text like "Tests  3 passed",
// could mis-parse the verdict undetected. The JSON reporter's structured
// counts can't be spoofed by incidental text on stdout.
//
// Both reporters run in the same invocation: `json` (first in the list, so
// --output-file binds to it — see the unit-test builder's schema) writes the
// structured report to a throwaway temp file, `default` still prints the
// familiar human-readable summary to the console. The console output is a
// feature, not a byproduct — VERBOSE and interactive runs keep it.
const ngBin = path.join(ROOT, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const reportFile = path.join(os.tmpdir(), `vibecore-vitest-report-${process.pid}-${Date.now()}.json`);
const res = spawnSync(
  process.execPath,
  [ngBin, 'test', '--watch=false', '--reporters=json', '--reporters=default', `--output-file=${reportFile}`],
  {
    cwd: ROOT,
    encoding: 'utf8',
    // The build banner + Vitest summary can be large; give it room.
    maxBuffer: 64 * 1024 * 1024,
  },
);

const raw = `${res.stdout || ''}\n${res.stderr || ''}`;
// Strip ANSI colour codes so VERBOSE output (and any fallback text below) is
// readable. Build the pattern from the ESC char code so the source carries
// no literal control character.
const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, 'g');
const out = raw.replace(ansi, '');

if (res.error) {
  console.log(`  FAIL could not launch the test runner: ${res.error.message}`);
  console.log(line);
  process.exit(1);
}

// --- Parse Vitest's JSON report ----------------------------------------------
// `testResults` has one entry per test FILE (Vitest's "Test Files" line);
// numTotalTests / numPassedTests / etc. are already aggregated per-test
// counts — no string parsing involved on either axis.
let report = null;
let reportError = null;
try {
  report = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
} catch (err) {
  reportError = err.message;
} finally {
  try {
    fs.unlinkSync(reportFile);
  } catch {
    // Nothing to clean up — the report was never written (reportError already covers why).
  }
}

let totalFiles = 0;
let passedFiles = 0;
let failedFiles = 0;
let otherFiles = 0; // file-level status that is neither 'passed' nor 'failed' — unexpected, not ignored
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let pendingTests = 0; // Vitest's "skipped" tests (it.skip / describe.skip)
let todoTests = 0; // it.todo

if (report && Array.isArray(report.testResults)) {
  totalFiles = report.testResults.length;
  for (const tr of report.testResults) {
    if (tr.status === 'passed') passedFiles++;
    else if (tr.status === 'failed') failedFiles++;
    else otherFiles++;
  }
  totalTests = report.numTotalTests ?? 0;
  passedTests = report.numPassedTests ?? 0;
  failedTests = report.numFailedTests ?? 0;
  pendingTests = report.numPendingTests ?? 0;
  todoTests = report.numTodoTests ?? 0;
}

const errors = [];

if (!report || !Array.isArray(report.testResults)) {
  errors.push(
    `could not read/parse the Vitest JSON report (${reportFile}): ${reportError || 'testResults missing from report'}. See output below.`,
  );
} else {
  if (failedFiles > 0 || failedTests > 0) {
    errors.push(`suite is RED: ${failedFiles} file(s) / ${failedTests} test(s) failed.`);
  }
  if (otherFiles > 0) {
    errors.push(
      `${otherFiles} file(s) reported a status other than passed/failed — treating as unresolved, not silently passing.`,
    );
  }
  if (passedFiles < BASELINE_FILES) {
    errors.push(`green test FILES regressed: ${passedFiles} < baseline ${BASELINE_FILES}.`);
  }
  if (passedTests < BASELINE_TESTS) {
    errors.push(`green TESTS regressed: ${passedTests} < baseline ${BASELINE_TESTS}.`);
  }
  // The curated subset's baseline today exactly equals its passing count (17/280,
  // zero headroom) — a skip or todo shrinks real coverage while the pass/fail
  // counts still look green. Treat that as a gate failure, not a footnote: a
  // "curated, stays green" claim over a suite with a quietly skipped test isn't one.
  if (pendingTests > 0 || todoTests > 0) {
    errors.push(
      `${pendingTests} skipped / ${todoTests} todo test(s) in the curated subset — un-skip, remove, or address them; a skip is not green.`,
    );
  }
}

// The builder's own non-zero exit is authoritative for a runner-level failure.
if (res.status !== 0 && errors.length === 0) {
  errors.push(`test runner exited ${res.status} despite a clean report — treating as a failure.`);
}

console.log(`  reported:  ${totalFiles ? `${passedFiles} passed (${totalFiles})` : '(no Test Files reported)'}`);
console.log(`             ${totalTests ? `${passedTests} passed (${totalTests})` : '(no Tests reported)'}`);
console.log(`  skipped:   ${pendingTests} skipped, ${todoTests} todo`);
console.log(`  baseline:  ${BASELINE_FILES} files / ${BASELINE_TESTS} tests (must not drop below)`);

if (errors.length === 0) {
  console.log(`  PASS — ${passedFiles} files / ${passedTests} tests green, at or above baseline.`);
  console.log(line);
  recordGate({
    gate: 'passed',
    files: passedFiles,
    tests: passedTests,
    skippedTests: pendingTests,
    todoTests,
    baseline: { files: BASELINE_FILES, tests: BASELINE_TESTS },
  });
  process.exit(0);
}

for (const e of errors) console.log('  FAIL ' + e);
console.log(line);
if (process.env.VERBOSE) console.log(out);
console.log(`  ${errors.length} problem(s). The curated subset must stay green. Fix before shipping.`);
recordGate({
  gate: 'failed',
  files: passedFiles,
  tests: passedTests,
  failedFiles,
  failedTests,
  skippedTests: pendingTests,
  todoTests,
  problems: errors,
});
process.exit(1);
