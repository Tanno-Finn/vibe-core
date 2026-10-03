import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import { BOM, browserTest, FIX, ROOT, run, scratch } from './helpers.mjs';

const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');

/**
 * The fixture page in a scratch folder, with a real font copied in from an installed
 * @fontsource package (a font file is not committed as a fixture: it would need its licence
 * beside it).
 */
function page(t) {
  const dir = scratch(t);
  cpSync(join(FIX, 'bundle'), dir, { recursive: true });
  copyFileSync(
    join(ROOT, 'node_modules', '@fontsource', 'lexend', 'files', 'lexend-latin-400-normal.woff2'),
    join(dir, 'font.woff2'),
  );
  return dir;
}

test('bundle: stylesheet, @import, image, srcset, style url(), icon, font and script are packed in', (t) => {
  const dir = page(t);
  const r = run('bundle', [join(dir, 'page.html'), '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = join(dir, 'page.single.html');
  assert.deepEqual(r.json().outputs, [out]);
  const html = readFileSync(out, 'utf8');
  assert.doesNotMatch(html, /<link[^>]+stylesheet/);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /(src|href|srcset)="(?!data:|#)[^"]*"/, 'no relative reference left in an attribute');
  assert.doesNotMatch(html, /url\(\s*(?!['"]?data:)/, 'no relative url() left');
  assert.match(html, /data:font\/woff2;base64,/);
  assert.match(html, /data:image\/png;base64,/);
  assert.match(html, /<\\\/script> steht hier nur als Text/, 'a "</script>" inside the script is escaped');
  assert.ok(
    r.json().warnings.some((w) => w.includes('kept the first of 2')),
    r.stdout,
  );
});

browserTest('bundle: the single file looks exactly like the original', (t) => {
  const dir = page(t);
  assert.equal(run('bundle', [join(dir, 'page.html')]).status, 0);
  const a = run('shot', [join(dir, 'page.html'), '--viewport', 'desktop', '--out-dir', join(dir, 'a'), '--json']);
  const b = run('shot', [
    join(dir, 'page.single.html'),
    '--viewport',
    'desktop',
    '--out-dir',
    join(dir, 'b'),
    '--json',
  ]);
  assert.equal(a.status, 0, a.stderr);
  assert.equal(b.status, 0, b.stderr);
  assert.deepEqual(b.json().warnings, [], 'the single file asks for nothing outside itself');
  assert.equal(sha(a.json().outputs[0]), sha(b.json().outputs[0]));
});

test('bundle: a web image and a link to another page are warnings; --strict makes them exit 1', (t) => {
  const dir = scratch(t);
  const r = run('bundle', [join(FIX, 'bundle', 'remote.html'), '--out', join(dir, 'r.html'), '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const warnings = r.json().warnings.join('\n');
  assert.match(warnings, /https:\/\/example\.org\/remote\.png is on the web/);
  assert.match(warnings, /other-page\.html/);
  assert.equal(run('bundle', [join(FIX, 'bundle', 'remote.html'), '--out', join(dir, 's.html'), '--strict']).status, 1);
});

test('bundle: an existing output without --force is exit 2; --help exits 0', (t) => {
  const dir = scratch(t);
  const out = join(dir, 'x.html');
  writeFileSync(out, 'x');
  assert.equal(run('bundle', [join(FIX, 'bundle', 'remote.html'), '--out', out]).status, 2);
  assert.equal(run('bundle', ['--help']).status, 0);
});

test('bundle: a byte-order mark in front of the page keeps its doctype and its <title> in <head>', (t) => {
  const input = join(scratch(t), 'bom.html');
  writeFileSync(
    input,
    BOM + '<!doctype html><html lang="de"><head><title>Blatt</title></head><body><p>Hallo</p></body></html>',
  );
  const r = run('bundle', [input, '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = readFileSync(join(input, '..', 'bom.single.html'), 'utf8');
  assert.match(out, /^<!DOCTYPE html>/i, 'no doctype means quirks mode in the browser');
  assert.match(out, /<head><title>Blatt<\/title><\/head>/);
});

test('bundle: nothing outside the project (also through a link) and no hidden file such as .env is packed in', (t) => {
  const dir = scratch(t);
  const outside = join(tmpdir(), `kit-bundle-outside-${process.pid}`);
  mkdirSync(outside, { recursive: true });
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(join(outside, 'secret.png'), 'outside the project');
  symlinkSync(outside, join(dir, 'link'), 'junction');
  writeFileSync(join(dir, '.env'), 'TOKEN=not-for-e-mail');
  writeFileSync(
    join(dir, 'page.html'),
    '<!doctype html><html lang="de"><head><title>x</title></head><body>' +
      '<img src="link/secret.png" alt="a"><img src=".env" alt="b"></body></html>',
  );
  const r = run('bundle', [join(dir, 'page.html'), '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = readFileSync(join(dir, 'page.single.html'), 'utf8');
  assert.doesNotMatch(out, /data:/, 'nothing was packed in');
  const warnings = r.json().warnings.join('\n');
  assert.match(warnings, /link\/secret\.png is outside the project/);
  assert.match(warnings, /\.env is a hidden file/);
});

test('bundle: a defer script keeps its timing, a linked stylesheet is not inlined twice, an empty srcset is skipped', (t) => {
  const dir = scratch(t);
  mkdirSync(join(dir, 'css'));
  writeFileSync(join(dir, 'css', 'a.css'), '.box { background: url(img.png); }');
  writeFileSync(join(dir, 'img.png'), 'a png beside the page, not the one the stylesheet means');
  writeFileSync(join(dir, 'late.js'), "document.getElementById('late').textContent = 'ran';");
  writeFileSync(
    join(dir, 'page.html'),
    '<!doctype html><html lang="de"><head><title>x</title><link rel="stylesheet" href="css/a.css">' +
      '<script src="late.js" defer></script></head><body><p id="late">waiting</p><img srcset="" alt=""></body></html>',
  );
  const r = run('bundle', [join(dir, 'page.html'), '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const out = readFileSync(join(dir, 'page.single.html'), 'utf8');
  assert.match(out, /<script src="data:text\/javascript;base64,[^"]+" defer=""><\/script>/);
  assert.match(out, /url\(img\.png\)/, 'css/img.png does not exist, so the reference stays as written');
  assert.doesNotMatch(out, /data:image\/png/, "the page folder's img.png is not what the stylesheet means");
  assert.ok(r.json().warnings.some((w) => w.includes('img.png not found')));
});
