import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { BOM, FIX, run, scratch } from './helpers.mjs';

const MD = join(FIX, 'reading-level', 'easy-de.md');

// Hand-counted in easy-de.md (headings are section names, not counted):
//   "Der Wasser·kreislauf": 3 sentences of 3, 6 and 7 words = 16 words; one long word
//     ("überall", 7 letters) → LIX 16/3 + 100·1/16 = 11.6.
//   "Wolken": 5 + 3 + 27 words = 35; long words Niederschlagswahrscheinlichkeit, Nachmittag,
//     deutlich, schwere, sammeln, langsam, herüber·treibt = 7 → LIX 35/3 + 100·7/35 = 31.7.
//   Whole text: 6 sentences, 51 words, 8 long → LIX 8.5 + 15.7 = 24.2.
test('reading-level: counts sentences, words and LIX per section as counted by hand', () => {
  const r = run('reading-level', [MD, '--lang', 'de', '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j = r.json();
  const [first, second] = j.sections;
  assert.deepEqual(
    [first.title, first.sentences, first.words, first.maxWords, first.lix],
    ['Der Wasser·kreislauf', 3, 16, 7, 11.6],
  );
  assert.deepEqual(
    [second.title, second.sentences, second.words, second.maxWords, second.lix],
    ['Wolken', 3, 35, 27, 31.7],
  );
  assert.deepEqual(j.total, { sentences: 6, words: 51, meanWords: 8.5, lix: 24.2 });
  assert.equal(j.limit, 25);
  assert.equal(second.longSentences.length, 1, 'the 27-word sentence is over the standard limit of 25');
  assert.deepEqual(second.longCompounds, [], 'no compound list without --easy');
});

test('reading-level: --easy with German lists the long compound without a Mediopunkt, not the one with it', () => {
  const r = run('reading-level', [MD, '--lang', 'de', '--easy', '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j = r.json();
  assert.equal(j.limit, 15);
  assert.deepEqual(j.sections[1].longCompounds, ['Niederschlagswahrscheinlichkeit']);
  assert.ok(
    j.findings.every((f) => !f.blocking),
    'advice only without --max-sentence',
  );
});

test('reading-level: --max-sentence is exit 1 when a sentence is longer, 0 when none is', () => {
  const over = run('reading-level', [MD, '--lang', 'de', '--max-sentence', '20', '--json']);
  assert.equal(over.status, 1, over.stdout + over.stderr);
  assert.ok(over.json().findings.some((f) => f.kind === 'long-sentence' && f.words === 27 && f.blocking));
  assert.equal(run('reading-level', [MD, '--lang', 'de', '--max-sentence', '30']).status, 0);
});

test('reading-level: --i18n reads a UI module; "z. B." does not end a sentence; placeholders and tags are removed', () => {
  const r = run('reading-level', ['--i18n', 'demo', '--lang', 'de-easy', '--json'], {
    env: { KIT_TOOLS_ROOT: join(FIX, 'reading-level', 'root') },
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const j = r.json();
  assert.equal(j.easy, true, 'a -easy code turns on --easy');
  assert.deepEqual(
    j.sections.map((s) => [s.title, s.sentences, s.words]),
    [
      ['intro', 3, 14],
      ['outro', 2, 3],
    ],
  );
});

test('reading-level: usage errors are exit 2', () => {
  assert.equal(run('reading-level', ['--help']).status, 0);
  assert.equal(run('reading-level', []).status, 2);
  assert.equal(run('reading-level', ['--i18n', 'home']).status, 2, '--i18n without --lang');
  assert.equal(run('reading-level', ['--i18n', 'no-such-module', '--lang', 'de']).status, 2);
});

test('reading-level: a byte-order mark and front matter with Windows line endings are not read as text', (t) => {
  const dir = scratch(t);
  const bom = join(dir, 'bom.md');
  writeFileSync(bom, BOM + '# Titel\n\nEin kurzer Satz.\n');
  const crlf = join(dir, 'crlf.md');
  writeFileSync(crlf, '---\r\ntitle: Probe\r\n---\r\n\r\nNoch nichts.\r\n\r\n# Titel\r\n\r\nEin kurzer Satz.\r\n');
  const sections = (input) => {
    const r = run('reading-level', [input, '--lang', 'de', '--json']);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    return r.json().sections.map((s) => [s.title, s.sentences, s.words]);
  };
  assert.deepEqual(sections(bom), [['Titel', 1, 3]]);
  assert.deepEqual(sections(crlf), [
    ['(before the first heading)', 1, 2],
    ['Titel', 1, 3],
  ]);
});

test('reading-level: "no." and "42." end an English sentence; "No. 5" and the German "3. Oktober" do not', (t) => {
  const dir = scratch(t);
  const en = join(dir, 'en.md');
  writeFileSync(en, '# Title\n\nThe answer is no. Then we stop.\n\nIt is 42. Then we go.\n\nSee No. 5 here.\n');
  const de = join(dir, 'de.md');
  writeFileSync(de, '# Titel\n\nWir treffen uns am 3. Oktober am Fluss.\n');
  const count = (input, lang) => {
    const r = run('reading-level', [input, '--lang', lang, '--json']);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    return r.json().total.sentences;
  };
  assert.equal(count(en, 'en'), 5);
  assert.equal(count(de, 'de'), 1);
});
