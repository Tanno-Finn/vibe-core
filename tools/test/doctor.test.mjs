import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { ROOT, browserTest, run } from './helpers.mjs';

browserTest('doctor: on a working checkout every check that blocks is ok, exit 0', () => {
  const r = run('doctor', ['--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const checks = r.json().checks;
  assert.deepEqual(
    checks.map((c) => c.id),
    ['node', 'packages', 'browser', 'write', 'build'],
  );
  for (const c of checks.filter((c) => c.blocking)) assert.ok(c.ok, JSON.stringify(c));
});

test('doctor: a browser that cannot start is named with its fix, exit 3', () => {
  const r = run('doctor', ['--json'], { env: { PUPPETEER_EXECUTABLE_PATH: join(ROOT, 'tmp', 'no-such-browser.exe') } });
  assert.equal(r.status, 3, r.stdout + r.stderr);
  const browser = r.json().checks.find((c) => c.id === 'browser');
  assert.equal(browser.ok, false);
  assert.match(browser.fix, /PUPPETEER_EXECUTABLE_PATH/);
});

test('doctor: --help exits 0, an input is exit 2', () => {
  assert.equal(run('doctor', ['--help']).status, 0);
  assert.equal(run('doctor', ['something.html']).status, 2);
});

test('doctor: every tool file is plain UTF-8, not double-encoded (a dash shown as three odd letters)', () => {
  for (const file of readdirSync(join(ROOT, 'tools')).filter((f) => f.endsWith('.mjs'))) {
    assert.doesNotMatch(readFileSync(join(ROOT, 'tools', file), 'utf8'), /\u00e2[\u0080-\u20ff]/, file);
  }
});
