import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { FIX, browserTest, pngSize, run, scratch } from './helpers.mjs';

const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');

browserTest('shot: desktop and mobile, at their sizes, with the paths printed', (t) => {
  const dir = scratch(t);
  const r = run('shot', [join(FIX, 'a11y', 'clean.html'), '--out-dir', dir, '--json']);
  assert.equal(r.status, 0, r.stderr);
  const [desktop, mobile] = r.json().outputs;
  assert.equal(desktop, join(dir, 'clean-desktop-light.png'));
  assert.equal(mobile, join(dir, 'clean-mobile-light.png'));
  assert.deepEqual(pngSize(desktop), { width: 1280, height: 800 });
  assert.deepEqual(pngSize(mobile), { width: 780, height: 1688 });
});

browserTest('shot: --full-page is taller than the window', (t) => {
  const dir = scratch(t);
  const r = run('shot', [join(FIX, 'shot', 'long.html'), '--viewport', 'desktop', '--full-page', '--out-dir', dir]);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(pngSize(join(dir, 'long-desktop-light.png')).height > 800);
});

browserTest('shot: --scheme both gives a different light and dark picture', (t) => {
  const dir = scratch(t);
  const r = run('shot', [
    join(FIX, 'a11y', 'low-contrast-dark.html'),
    '--viewport',
    'desktop',
    '--scheme',
    'both',
    '--out-dir',
    dir,
  ]);
  assert.equal(r.status, 0, r.stderr);
  assert.notEqual(
    sha(join(dir, 'low-contrast-dark-desktop-light.png')),
    sha(join(dir, 'low-contrast-dark-desktop-dark.png')),
  );
});

browserTest('shot: two runs give identical bytes; an existing file without --force is exit 2', (t) => {
  const a = scratch(t);
  const b = scratch(t);
  const input = join(FIX, 'a11y', 'clean.html');
  assert.equal(run('shot', [input, '--viewport', 'desktop', '--out-dir', a]).status, 0);
  assert.equal(run('shot', [input, '--viewport', 'desktop', '--out-dir', b]).status, 0);
  assert.equal(sha(join(a, 'clean-desktop-light.png')), sha(join(b, 'clean-desktop-light.png')));
  const again = run('shot', [input, '--viewport', 'desktop', '--out-dir', a]);
  assert.equal(again.status, 2);
  assert.match(again.stdout + again.stderr, /--force/);
});

browserTest('shot: one more picture after each --click', (t) => {
  const dir = scratch(t);
  const r = run('shot', [
    join(FIX, 'a11y', 'toggle.html'),
    '--viewport',
    'desktop',
    '--click',
    '#b',
    '--out-dir',
    dir,
    '--json',
  ]);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(
    r.json().outputs.map((p) => p.slice(dir.length + 1)),
    ['toggle-desktop-light.png', 'toggle-desktop-light-click1.png'],
  );
});

browserTest('shot: a --click that matches nothing is exit 2 and leaves no picture behind', (t) => {
  const dir = scratch(t);
  const r = run('shot', [
    join(FIX, 'a11y', 'toggle.html'),
    '--viewport',
    'desktop',
    '--click',
    '#nope',
    '--out-dir',
    dir,
  ]);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stdout + r.stderr, /matches nothing/);
  assert.deepEqual(readdirSync(dir), []);
});

test('shot: writing into .git is refused (exit 2)', () => {
  const r = run('shot', [join(FIX, 'a11y', 'clean.html'), '--out-dir', '.git/shots']);
  assert.equal(r.status, 2);
  assert.match(r.stdout + r.stderr, /never write there/);
});

test('shot: --help exits 0', () => {
  assert.equal(run('shot', ['--help']).status, 0);
});

test('shot: a --route whose picture exists is exit 2 and the tool ends (the server it started stops)', (t) => {
  const dir = scratch(t);
  writeFileSync(join(dir, 'de-example-desktop-light.png'), 'x');
  const r = run(
    'shot',
    ['--route', '/de/example', '--dist', join(FIX, 'site'), '--viewport', 'desktop', '--out-dir', dir],
    {
      timeout: 20_000,
    },
  );
  assert.equal(r.status, 2, `status ${r.status} (null = still running after 20 s): ${r.stdout}${r.stderr}`);
  assert.match(r.stdout + r.stderr, /already exists/);
});
