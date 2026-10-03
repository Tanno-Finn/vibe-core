import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { readZip, writeZip } from '../../scripts/lib/zip.mjs';
import { ROOT, run } from './helpers.mjs';

const registered = JSON.parse(readFileSync(join(ROOT, 'kit.json'), 'utf8')).tools;

test('tools list: names every registered tool with its command', () => {
  assert.ok(registered.length > 0, 'kit.json registers tools');
  const r = run('index');
  assert.equal(r.status, 0, r.stderr);
  for (const t of registered) {
    assert.match(r.stdout, new RegExp(`^${t.id}\\b`, 'm'));
    assert.ok(r.stdout.includes(t.run), t.run);
  }
});

test('tools list: --json is the registry array', () => {
  assert.deepEqual(run('index', ['--json']).json(), registered);
});

test('zip: a round trip keeps names and bytes, the chosen entry comes first, same input gives same bytes', () => {
  const entries = [
    { name: 'b/two.txt', data: 'zwei' },
    { name: 'a.xml', data: '<a/>' },
    { name: '[first].xml', data: Buffer.from([0, 1, 2, 3]) },
  ];
  const zip = writeZip(entries, { first: ['[first].xml'] });
  const back = readZip(zip);
  assert.deepEqual([...back.keys()], ['[first].xml', 'a.xml', 'b/two.txt']);
  assert.equal(back.get('b/two.txt').toString(), 'zwei');
  assert.ok(back.get('[first].xml').equals(Buffer.from([0, 1, 2, 3])));
  assert.ok(zip.equals(writeZip([...entries].reverse(), { first: ['[first].xml'] })));
});
