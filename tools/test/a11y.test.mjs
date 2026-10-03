import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';
import { FIX, browserTest, run } from './helpers.mjs';

const fx = (name) => join(FIX, 'a11y', name);
const blocking = (j) => j.findings.filter((f) => f.blocking);

browserTest('a11y: a clean file passes in both schemes', () => {
  const r = run('a11y', [fx('clean.html'), '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(blocking(r.json()).length, 0);
});

browserTest('a11y: a missing alt text is exit 1, named as A11Y-002 with the node', () => {
  const r = run('a11y', [fx('missing-alt.html'), '--scheme', 'light', '--json']);
  assert.equal(r.status, 1);
  const [f] = blocking(r.json());
  assert.equal(f.rule, 'A11Y-002');
  assert.ok(
    f.nodes.some((n) => n.startsWith('#no-alt')),
    JSON.stringify(f),
  );
});

browserTest('a11y: low contrast only in dark mode fails the dark run, not the light one', () => {
  const r = run('a11y', [fx('low-contrast-dark.html'), '--json']);
  assert.equal(r.status, 1);
  const states = blocking(r.json()).map((f) => f.state);
  assert.ok(states.length && states.every((s) => s.includes('[dark]')), JSON.stringify(states));
});

browserTest('a11y: a problem behind a click is found only with --click', () => {
  assert.equal(run('a11y', [fx('toggle.html'), '--scheme', 'light']).status, 0);
  const r = run('a11y', [fx('toggle.html'), '--scheme', 'light', '--click', '#b', '--json']);
  assert.equal(r.status, 1);
  assert.match(blocking(r.json())[0].state, /after click 1 \(#b\)/);
});

browserTest('a11y: a route is served from --dist (with the SPA fallback) and audited', () => {
  const dist = join('tools', 'test', 'fixtures', 'site');
  const r = run('a11y', ['--route', '/de/example', '--dist', dist, '--scheme', 'light']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /de-example \[light\]/);
  const fallback = run('a11y', ['--route', '/de/not-a-file', '--dist', dist, '--scheme', 'light']);
  assert.equal(fallback.status, 0, fallback.stdout + fallback.stderr);
});

browserTest('a11y: --tab-order 3 lists three stops in document order', () => {
  const r = run('a11y', [fx('clean.html'), '--scheme', 'light', '--tab-order', '3', '--json']);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(
    r.json().tabOrder.map((s) => s.name),
    ['First link', 'Second link', 'A button'],
  );
});

browserTest('a11y: the tab list ends where the keyboard path ends, without warnings', () => {
  const r = run('a11y', [fx('clean.html'), '--scheme', 'light', '--tab-order', '6', '--json']);
  assert.equal(r.status, 0, r.stderr);
  const j = r.json();
  assert.equal(j.tabOrder.length, 3);
  assert.deepEqual(j.warnings, []);
});

test('a11y: --base must be a loopback address (exit 2)', () => {
  const r = run('a11y', ['--route', '/de/home', '--base', 'https://example.org']);
  assert.equal(r.status, 2);
  assert.match(r.stdout + r.stderr, /local address/);
});

test('a11y: a missing build is exit 3 with the fix', () => {
  const r = run('a11y', ['--route', '/de/home', '--dist', 'tmp/no-such-build']);
  assert.equal(r.status, 3);
  assert.match(r.stdout + r.stderr, /npm run build:prod/);
});

test('a11y: --help exits 0, a file and --route together exit 2', () => {
  assert.equal(run('a11y', ['--help']).status, 0);
  assert.equal(run('a11y', [fx('clean.html'), '--route', '/de/home']).status, 2);
});
