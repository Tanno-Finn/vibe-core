import assert from 'node:assert/strict';
import { cpSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { FIX, run, scratch } from './helpers.mjs';

const env = { KIT_TOOLS_ROOT: join(FIX, 'lang-status') };
const status = (code) => run('lang-status', [code, '--json'], { env });

// The fixture root: en is the key source (2 modules, 6 keys), de the content reference.
// Italian: app.json has one key equal to English ("Home"), one translated, one empty;
// home.json is missing (8 words: the placeholder and the tag are not words). No it-easy.
test('lang-status: exact counts for a half-translated language that is not configured', () => {
  const r = status('it');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j = r.json();
  assert.equal(j.configured, false);
  assert.equal(j.redirect, false);
  const [it, itEasy] = j.ui;
  assert.deepEqual(it.totals, { modules: 2, keys: 6, translated: 1, same: 1, missing: 4, missingWords: 11 });
  assert.deepEqual(
    it.modules.map((m) => [m.module, m.missing, m.same]),
    [
      ['app', 1, 1],
      ['home', 3, 0],
    ],
  );
  assert.equal(itEasy.source, 'en-easy');
  assert.deepEqual(itEasy.totals, { modules: 2, keys: 6, translated: 0, same: 0, missing: 6, missingWords: 10 });
  const [content, contentEasy] = j.content;
  assert.deepEqual(content.collections, [
    { collection: 'glossary', entries: 2, present: 1, missing: 1, missingWords: 4 },
    { collection: 'sources', entries: 1, present: 0, missing: 1, missingWords: 2 },
  ]);
  assert.deepEqual(contentEasy.collections, [
    { collection: 'glossary', entries: 2, present: 0, missing: 2, missingWords: 8 },
    { collection: 'sources', entries: 1, byDesign: 'no Easy files in this collection' },
  ]);
  assert.match(r.stderr, /not configured/);
  // The fixture has no site.json and no features.json: every feature is on, nothing is left out.
  assert.deepEqual(j.features, { off: [] });
  assert.deepEqual(it.skipped, { offFeatures: 0, devOnly: 0 });
});

test('lang-status: a code with nothing yet has every key missing and says it is not configured', () => {
  const j = status('fr').json();
  assert.equal(j.configured, false);
  assert.equal(j.ui[0].totals.missing, 6);
  assert.equal(j.ui[0].totals.translated, 0);
  assert.equal(j.ui[0].totals.missingWords, 12);
});

test('lang-status: a configured language is reported as set up', () => {
  const j = status('de').json();
  assert.equal(j.configured, true);
  assert.equal(j.redirect, true);
  assert.deepEqual(j.ui[0].totals, { modules: 2, keys: 6, translated: 6, same: 0, missing: 0, missingWords: 0 });
});

test('lang-status: not a base code is exit 2; --help exits 0', () => {
  assert.equal(run('lang-status', ['it-easy'], { env }).status, 2);
  assert.equal(run('lang-status', [], { env }).status, 2);
  assert.equal(run('lang-status', ['--help']).status, 0);
});

test('lang-status: the key-source language is the reference, not a language with everything left to translate', () => {
  const r = status('en');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const [ui] = r.json().ui;
  assert.equal(ui.reference, true);
  assert.deepEqual([ui.totals.same, ui.totals.missing, ui.totals.missingWords], [0, 0, 0]);
  assert.equal(ui.totals.translated, ui.totals.keys);
});

// The same fixture with a site that switched its glossary off: features.json gives the
// glossary the key app.nav.glossary and the glossary collection, and makes home.items the
// dev workshop's strings. Italian then needs neither, and neither is counted.
test('lang-status: counts only what the switched-on features and the site need', (t) => {
  const root = scratch(t);
  cpSync(join(FIX, 'lang-status'), root, { recursive: true });
  const feature = { routes: ['glossary'], i18n: ['app.nav.glossary'], collections: ['glossary'] };
  const catalog = { shellPages: ['home'], devOnly: { i18n: ['home.items'] }, features: { glossary: feature } };
  writeFileSync(join(root, 'src', 'config', 'features.json'), JSON.stringify(catalog));
  writeFileSync(join(root, 'src', 'config', 'site.json'), JSON.stringify({ features: { glossary: false } }));
  const at = (code) => run('lang-status', [code, '--json'], { env: { KIT_TOOLS_ROOT: root } });

  const r = at('it');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j = r.json();
  assert.deepEqual(j.features, { off: ['glossary'] });
  const [it, itEasy] = j.ui;
  // Left: app.nav.home (same as English, 1 word), app.title (empty, 2), home.welcome (missing, 4).
  assert.deepEqual(it.totals, { modules: 2, keys: 3, translated: 0, same: 1, missing: 2, missingWords: 7 });
  assert.deepEqual(it.skipped, { offFeatures: 1, devOnly: 2 });
  assert.deepEqual(itEasy.totals, { modules: 2, keys: 3, translated: 0, same: 0, missing: 3, missingWords: 4 });
  const [content, contentEasy] = j.content;
  assert.deepEqual(content.collections, [
    { collection: 'sources', entries: 1, present: 0, missing: 1, missingWords: 2 },
  ]);
  assert.deepEqual(content.skipped, ['glossary']);
  assert.deepEqual(contentEasy.skipped, ['glossary']);
  assert.match(r.stderr, /switched off in src\/config\/site\.json: glossary/);

  // German carries the workshop strings, so it keeps them complete; the glossary key is still not counted.
  const de = at('de').json().ui[0];
  assert.deepEqual(de.totals, { modules: 2, keys: 5, translated: 5, same: 0, missing: 0, missingWords: 0 });
  assert.deepEqual(de.skipped, { offFeatures: 1, devOnly: 0 });
});
