import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { FIX, browserTest, run, scratch } from './helpers.mjs';

const fx = (name) => join(FIX, 'pdf', name);
const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');

browserTest('pdf: a one-page file gives 1 page', (t) => {
  const out = join(scratch(t), 'one.pdf');
  const r = run('pdf', [fx('one-page.html'), '--out', out, '--json']);
  assert.equal(r.status, 0, r.stderr);
  const j = r.json();
  assert.equal(j.pages, 1);
  assert.deepEqual(j.outputs, [out]);
  assert.ok(readFileSync(out).subarray(0, 5).toString() === '%PDF-');
});

browserTest('pdf: forced breaks give 3 pages, and --max-pages 2 fails with exit 1', (t) => {
  const dir = scratch(t);
  const r = run('pdf', [fx('three-pages.html'), '--out', join(dir, 'a.pdf'), '--json']);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.json().pages, 3);
  const over = run('pdf', [fx('three-pages.html'), '--out', join(dir, 'b.pdf'), '--max-pages', '2', '--json']);
  assert.equal(over.status, 1);
  assert.match(over.json().findings[0].message, /1 more than --max-pages 2/);
});

browserTest('pdf: a too-wide table is a warning naming it; --strict makes it exit 1', (t) => {
  const dir = scratch(t);
  const r = run('pdf', [fx('overflow.html'), '--out', join(dir, 'a.pdf'), '--json']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(
    r.json().warnings.some((w) => w.includes('table#wide')),
    r.stdout,
  );
  const strict = run('pdf', [fx('overflow.html'), '--out', join(dir, 'b.pdf'), '--strict']);
  assert.equal(strict.status, 1);
});

browserTest('pdf: --bw-check names the coloured element, not the black text', (t) => {
  const r = run('pdf', [fx('color.html'), '--out', join(scratch(t), 'c.pdf'), '--bw-check', '--json']);
  assert.equal(r.status, 0, r.stderr);
  const bw = r.json().findings.filter((f) => f.kind === 'bw');
  assert.ok(
    bw.some((f) => f.selector === 'p#red'),
    JSON.stringify(bw),
  );
  assert.ok(!bw.some((f) => f.selector === 'p#plain'), JSON.stringify(bw));
});

browserTest('pdf: two runs give identical bytes', (t) => {
  const dir = scratch(t);
  assert.equal(run('pdf', [fx('three-pages.html'), '--out', join(dir, 'a.pdf')]).status, 0);
  assert.equal(run('pdf', [fx('three-pages.html'), '--out', join(dir, 'b.pdf')]).status, 0);
  assert.equal(sha(join(dir, 'a.pdf')), sha(join(dir, 'b.pdf')));
});

browserTest('pdf: a remote image is not fetched and is reported', (t) => {
  const r = run('pdf', [fx('remote-image.html'), '--out', join(scratch(t), 'r.pdf'), '--json']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(
    r.json().warnings.some((w) => w.includes('https://example.org/picture.png')),
    r.stdout,
  );
});

test('pdf: an existing output without --force is exit 2', (t) => {
  const out = join(scratch(t), 'exists.pdf');
  writeFileSync(out, 'x');
  const r = run('pdf', [fx('one-page.html'), '--out', out]);
  assert.equal(r.status, 2);
  assert.match(r.stdout + r.stderr, /--force/);
});

test('pdf: an input outside the project is exit 2', (t) => {
  const outside = join(tmpdir(), `kit-tools-outside-${process.pid}.html`);
  writeFileSync(outside, '<!doctype html><title>x</title><p>x</p>');
  t.after(() => rmSync(outside, { force: true }));
  const r = run('pdf', [outside]);
  assert.equal(r.status, 2);
  assert.match(r.stdout + r.stderr, /outside the project/);
});

test('pdf: --help exits 0, an unknown flag exits 2', () => {
  const help = run('pdf', ['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /--max-pages/);
  assert.equal(run('pdf', ['--nope']).status, 2);
});

test('pdf: --json on a usage error still prints the one JSON object', () => {
  const r = run('pdf', ['--bogus', '--json']);
  assert.equal(r.status, 2);
  assert.deepEqual([r.json().tool, r.json().ok, r.json().exitCode], ['pdf', false, 2]);
  const choice = run('shot', ['x.html', '--scheme', 'purple', '--json']);
  assert.equal(choice.status, 2);
  assert.equal(choice.json().exitCode, 2);
});

test('pdf: an output through a link that points at nothing is exit 2', (t) => {
  const dir = scratch(t);
  symlinkSync(join(dir, 'not-there-yet'), join(dir, 'link'), 'junction');
  const r = run('pdf', [join(FIX, 'pdf', 'one-page.html'), '--out', join(dir, 'link', 'x.pdf')]);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stdout + r.stderr, /points at nothing/);
});
