/**
 * helpers.mjs — shared plumbing for the kit-tool tests (node:test, `npm run test:tools`).
 *
 * Tools are tested as a user runs them: a child process with arguments, judged by exit
 * code, stdout (the --json object) and the files it wrote. Scratch output goes to a
 * fresh folder under tmp/ inside the project (tools refuse to write outside it) and is
 * removed after the test.
 *
 * Browser tests FAIL when no browser can start — a test that silently inspects nothing
 * reports green for an absence. TOOLS_TEST_SKIP_BROWSER=1 skips them instead, and the
 * test reporter lists every skipped test by name.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const FIX = join(ROOT, 'tools', 'test', 'fixtures');
export const SKIP_BROWSER = process.env.TOOLS_TEST_SKIP_BROWSER === '1';
/** The byte-order mark Windows PowerShell 5.1 and some editors write in front of a text file. */
export const BOM = String.fromCharCode(0xfeff);

/** Runs `node tools/<tool>.mjs ...args` from the project root (or `cwd`). */
export function run(tool, args = [], { env = {}, cwd = ROOT, timeout = 120_000 } = {}) {
  const res = spawnSync(process.execPath, [join(ROOT, 'tools', `${tool}.mjs`), ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...env },
    timeout,
  });
  return {
    status: res.status,
    stdout: res.stdout,
    stderr: res.stderr,
    json() {
      return JSON.parse(res.stdout);
    },
  };
}

/** A fresh scratch folder under tmp/ in the project, removed after the test. */
export function scratch(t) {
  mkdirSync(join(ROOT, 'tmp'), { recursive: true });
  const dir = mkdtempSync(join(ROOT, 'tmp', 'tools-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** A test that needs a browser: skipped (and named as skipped) only with TOOLS_TEST_SKIP_BROWSER=1. */
export function browserTest(name, fn) {
  if (SKIP_BROWSER) return test(name, { skip: 'TOOLS_TEST_SKIP_BROWSER=1 — this test needs a browser' }, fn);
  return test(name, fn);
}

/** Width and height from a PNG's IHDR chunk. */
export function pngSize(file) {
  const b = readFileSync(file);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}
