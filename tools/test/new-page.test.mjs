import assert from 'node:assert/strict';
import { chmodSync, cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { BOM, FIX, run, scratch } from './helpers.mjs';

const EXPECTED = join(FIX, 'new-page', 'expected');
const read = (...p) => readFileSync(join(...p), 'utf8');

/** A fresh copy of the fixture root (a tiny kit: languages, routes, angular.json, app.json, demos). */
function kit(t) {
  const dir = scratch(t);
  cpSync(join(FIX, 'new-page', 'root'), dir, { recursive: true });
  return dir;
}
const newPage = (dir, args) =>
  run('new-page', [...args, '--strings', join(dir, 'strings.json'), '--json'], { env: { KIT_TOOLS_ROOT: dir } });

test('new-page: a page — component, spec, modules, allowlist and nav match the snapshots; snippets printed', (t) => {
  const dir = kit(t);
  const r = newPage(dir, ['water-world', '--kind', 'page']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j = r.json();
  // "wate" belongs to the fixture's /water route, so the next candidate is taken.
  assert.deepEqual(
    [j.namespace, j.component, j.pageId, j.group],
    ['waterWorld', 'WaterWorldComponent', 'watr', 'portal'],
  );
  const page = join(dir, 'src', 'app', 'pages', 'water-world');
  assert.equal(read(page, 'water-world.component.ts'), read(EXPECTED, 'water-world.component.ts.snap'));
  assert.equal(read(page, 'water-world.component.spec.ts'), read(EXPECTED, 'water-world.component.spec.ts.snap'));
  assert.equal(read(dir, 'angular.json'), read(EXPECTED, 'angular.json'));
  const modules = join(dir, 'src', 'assets', 'i18n', 'modules');
  assert.equal(read(modules, 'en-easy', 'app.json'), read(EXPECTED, 'en-easy.app.json'));
  assert.equal(read(modules, 'en-easy', 'waterWorld.json'), read(EXPECTED, 'en-easy.waterWorld.json'));
  for (const l of ['de', 'de-easy', 'en']) {
    assert.ok(existsSync(join(modules, l, 'waterWorld.json')), `${l}/waterWorld.json`);
  }
  assert.equal(JSON.parse(read(modules, 'de-easy', 'waterWorld.json')).title, 'Wasser·welt');
  assert.deepEqual(
    j.snippets.map((s) => s.file),
    ['src/app/app.routes.ts', 'scripts/generate-prerender-routes.js'],
  );
  assert.match(j.snippets[0].anchor, /after the route with path 'water'/);
  assert.match(j.snippets[0].code, /pageId: 'watr',/);
  assert.match(j.snippets[0].code, /titleKey: 'app\.nav\.waterWorld',/);
  assert.equal(j.snippets[1].code, "  'water-world',");
});

test('new-page: a demo — demos/index.json entry and a client-only render snippet instead of prerender', (t) => {
  const dir = kit(t);
  const r = newPage(dir, ['sorting-demo', '--kind', 'demo', '--page-id', 'srtd']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j = r.json();
  assert.equal(j.group, 'interaktiveDemos');
  const demos = JSON.parse(read(dir, 'src', 'assets', 'data', 'core', 'demos', 'index.json'));
  assert.deepEqual(
    demos.map((d) => [d.id, d.pageId, d.titleKey]),
    [
      ['seed-demo', 'sdmo', 'exampleDemo.title'],
      ['sorting-demo', 'srtd', 'sortingDemo.title'],
    ],
  );
  // Milestones live in the index entry (C1 of specs/2026-09-28-make-it-yours): without one the
  // demo would drop off /progress and the shipped-index spec would fail.
  assert.deepEqual(demos[1].milestones, [
    { type: 'checkpoint', storageKey: 'sorting-demo-checkpoints', checkpointId: 'main' },
  ]);
  assert.match(r.stderr, /<app-checkpoint storageKey="sorting-demo-checkpoints" checkpointId="main"/);
  assert.deepEqual(
    j.snippets.map((s) => s.file),
    ['src/app/app.routes.ts', 'src/app/app.routes.server.ts'],
  );
  assert.equal(j.snippets[1].code, "  { path: 'sorting-demo', renderMode: RenderMode.Client },");
  assert.match(j.snippets[0].code, /contentType: 'demo',/);
});

test('new-page: --dry-run writes nothing', (t) => {
  const dir = kit(t);
  const before = read(dir, 'angular.json');
  const r = newPage(dir, ['water-world', '--kind', 'page', '--dry-run']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual(r.json().outputs, []);
  assert.equal(read(dir, 'angular.json'), before);
  assert.ok(!existsSync(join(dir, 'src', 'app', 'pages', 'water-world')));
});

test('new-page: a page id in use, a missing language, an existing route and a bad slug are exit 2, nothing written', (t) => {
  const dir = kit(t);
  const before = read(dir, 'angular.json');
  const dup = newPage(dir, ['water-world', '--kind', 'page', '--page-id', 'sdmo']);
  assert.equal(dup.status, 2, dup.stdout + dup.stderr);
  assert.match(dup.stderr, /page id "sdmo" is already used/);
  const noEasy = run(
    'new-page',
    ['water-world', '--kind', 'page', '--strings', join(dir, 'strings-no-easy.json'), '--json'],
    { env: { KIT_TOOLS_ROOT: dir } },
  );
  assert.equal(noEasy.status, 2);
  assert.match(noEasy.stderr, /no texts for de-easy, en-easy/);
  assert.equal(newPage(dir, ['water', '--kind', 'page']).status, 2, 'route exists');
  assert.equal(newPage(dir, ['Water_World', '--kind', 'page']).status, 2, 'bad slug');
  assert.equal(newPage(dir, ['water-world', '--kind', 'page', '--group', 'nope']).status, 2, 'unknown group');
  assert.equal(read(dir, 'angular.json'), before);
  assert.equal(run('new-page', ['--help']).status, 0);
});

test('new-page: a --strings file saved with a byte-order mark (Windows PowerShell 5.1, Notepad) is read', (t) => {
  const dir = kit(t);
  const strings = join(dir, 'strings.json');
  writeFileSync(strings, BOM + read(strings));
  const r = newPage(dir, ['water-world', '--kind', 'page', '--dry-run']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('new-page: a "*/" in the title does not end the component comment and turn the rest into code', (t) => {
  const dir = kit(t);
  const strings = join(dir, 'strings.json');
  const s = JSON.parse(read(strings));
  s.en.title = "Evil */ import 'x'; /* end";
  writeFileSync(strings, JSON.stringify(s));
  const r = newPage(dir, ['water-world', '--kind', 'page']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const ts = read(dir, 'src', 'app', 'pages', 'water-world', 'water-world.component.ts');
  const commentEnd = ts.indexOf('*/');
  assert.ok(commentEnd > ts.indexOf('SSR-safe'), 'the first "*/" is the end of the header comment');
});

test('new-page: a write that fails undoes everything written before it', (t) => {
  const dir = kit(t);
  const angular = join(dir, 'angular.json');
  const app = join(dir, 'src', 'assets', 'i18n', 'modules', 'en', 'app.json');
  const before = [read(angular), read(app)];
  chmodSync(angular, 0o444);
  const r = newPage(dir, ['water-world', '--kind', 'page']);
  assert.equal(r.status, 3, r.stdout + r.stderr);
  assert.match(r.stderr, /undone/);
  assert.deepEqual(r.json().outputs, []);
  assert.ok(!existsSync(join(dir, 'src', 'app', 'pages', 'water-world')));
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'i18n', 'modules', 'en', 'waterWorld.json')));
  assert.deepEqual([read(angular), read(app)], before);
  assert.equal(newPage(dir, ['water-world', '--kind', 'page', '--dry-run']).status, 0, 'a second run is not blocked');
});

test('new-page: an empty test list in angular.json and a group named like an object property are exit 2', (t) => {
  const dir = kit(t);
  const angular = join(dir, 'angular.json');
  writeFileSync(angular, read(angular).replace(/"include": \[[^\]]*\]/, '"include": []'));
  const before = read(angular);
  assert.equal(newPage(dir, ['water-world', '--kind', 'page']).status, 2);
  assert.equal(read(angular), before);
  assert.equal(newPage(dir, ['water-world', '--kind', 'page', '--group', 'constructor', '--dry-run']).status, 2);
});
