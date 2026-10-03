import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { readZip } from '../../scripts/lib/zip.mjs';
import { FIX, ROOT, run, scratch } from './helpers.mjs';

/** The manifest build:prod writes: verification, and the test gate's verdict on this index.html. */
function manifest(dist, { passed = true, gate = 'passed' } = {}) {
  const indexSha256 = createHash('sha256')
    .update(readFileSync(join(dist, 'index.html')))
    .digest('hex');
  writeFileSync(
    join(dist, '.build-manifest.json'),
    JSON.stringify({ verification: { passed }, tests: { gate, build: { indexSha256 } } }),
  );
}

/** A copy of the fixture site with a build manifest saying `passed` (or not). */
function site(t, passed) {
  const dir = scratch(t);
  const dist = join(dir, 'dist');
  cpSync(join(FIX, 'site'), dist, { recursive: true });
  manifest(dist, { passed });
  return { dir, dist };
}

test('export-site: a verified build becomes a zip with every file, forward slashes, no manifest', (t) => {
  const { dir, dist } = site(t, true);
  const out = join(dir, 'site.zip');
  const r = run('export-site', ['--dist', dist, '--out', out, '--json']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.deepEqual(r.json().outputs, [out, join(dir, 'SERVER-SETUP.md')]);
  const names = [...readZip(readFileSync(out)).keys()];
  assert.deepEqual(names, ['de/example/index.html', 'index.html']);
  const setup = readFileSync(join(dir, 'SERVER-SETUP.md'), 'utf8');
  assert.match(setup, /## Deutsch/);
  assert.match(setup, /## English/);
  // nginx: `$uri/` would match every folder and answer one without index.html with 403
  assert.match(setup, /try_files \$uri \$uri\/index\.html \/index\.html;/);
  assert.doesNotMatch(setup, /try_files \$uri \$uri\/ /);
  assert.match(setup, /location ~ \^\/\(de\|en\)\/\?\$ \{\n\s+return 302 \/\$1\/home\/;/);
  assert.match(
    setup,
    /if \(\$http_accept_language ~\* "\^\\s\*en"\) \{ return 302 \/en\/home\/; \}\n\s+return 302 \/de\/home\/;/,
  );
  // Apache: the deploy guide's rules, not FallbackResource (folders without index.html: 403)
  assert.doesNotMatch(setup, /FallbackResource/);
  assert.match(setup, /RewriteCond %\{REQUEST_FILENAME\}\/index\.html !-f/);
});

test('export-site: two runs give identical bytes; --apache adds the .htaccess', (t) => {
  const { dir, dist } = site(t, true);
  assert.equal(run('export-site', ['--dist', dist, '--out', join(dir, 'a', 'x.zip')]).status, 0);
  assert.equal(run('export-site', ['--dist', dist, '--out', join(dir, 'b', 'x.zip')]).status, 0);
  assert.ok(readFileSync(join(dir, 'a', 'x.zip')).equals(readFileSync(join(dir, 'b', 'x.zip'))));
  assert.equal(run('export-site', ['--dist', dist, '--out', join(dir, 'c', 'x.zip'), '--apache']).status, 0);
  const htaccess = readZip(readFileSync(join(dir, 'c', 'x.zip')))
    .get('.htaccess')
    .toString();
  // The rules of docs/how-to/deploy.md: entry points redirect to a prerendered /<lang>/home/,
  // a folder counts as a page only with its own index.html, everything else gets the app shell.
  assert.doesNotMatch(htaccess, /FallbackResource/);
  for (const line of [
    'Options -Indexes',
    'RewriteRule ^ - [R=405,L]',
    'RewriteCond %{HTTP:Accept-Language} ^\\s*en [NC]',
    'RewriteRule ^$ /en/home/ [R=302,L]',
    'RewriteRule ^$ /de/home/ [R=302,L]',
    'RewriteRule ^(de|en)/?$ /$1/home/ [R=302,L]',
    'RewriteCond %{REQUEST_FILENAME}/index.html !-f',
    'RewriteRule ^ /index.html [L]',
  ])
    assert.ok(htaccess.split('\n').includes(line), `.htaccess lacks: ${line}`);
  // The language redirects come before the fallback, or /de/ would get the app shell.
  assert.ok(htaccess.indexOf('/$1/home/') < htaccess.indexOf('RewriteRule ^ /index.html'));
});

test('export-site: the server rules match the deploy guide, line for line', (t) => {
  // docs/how-to/deploy.md is the reference; for the kit's two languages export-site must
  // write the same Apache rules, so a fix to one cannot silently miss the other.
  const { dir, dist } = site(t, true);
  assert.equal(run('export-site', ['--dist', dist, '--out', join(dir, 'x.zip'), '--apache']).status, 0);
  const rules = (text) =>
    text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));
  const guide = readFileSync(join(ROOT, 'docs', 'how-to', 'deploy.md'), 'utf8');
  const block = /```apache\n(RewriteEngine On[\s\S]*?)```/.exec(guide);
  assert.ok(block, 'deploy.md has no Apache block starting with RewriteEngine On');
  const htaccess = readZip(readFileSync(join(dir, 'x.zip')))
    .get('.htaccess')
    .toString();
  assert.deepEqual(rules(htaccess), rules(block[1]));
});

test('export-site: an unverified build is exit 1 and writes nothing; --allow-unverified packs it and says so', (t) => {
  const { dir, dist } = site(t, false);
  const out = join(dir, 'u.zip');
  const refused = run('export-site', ['--dist', dist, '--out', out, '--json']);
  assert.equal(refused.status, 1, refused.stdout + refused.stderr);
  assert.deepEqual(refused.json().outputs, []);
  const allowed = run('export-site', ['--dist', dist, '--out', out, '--allow-unverified', '--json']);
  assert.equal(allowed.status, 0, allowed.stdout + allowed.stderr);
  assert.equal(allowed.json().verified, false);
  assert.ok(allowed.json().warnings.some((w) => w.includes('UNVERIFIED')));
});

test('export-site: an existing zip without --force is exit 2; a missing build is exit 3', (t) => {
  const { dir, dist } = site(t, true);
  const out = join(dir, 'e.zip');
  writeFileSync(out, 'x');
  assert.equal(run('export-site', ['--dist', dist, '--out', out]).status, 2);
  assert.equal(run('export-site', ['--dist', join(dir, 'nothing-here')]).status, 3);
  assert.equal(run('export-site', ['--help']).status, 0);
});

test('export-site: a build whose test gate did not pass, or whose manifest is older than index.html, is exit 1', (t) => {
  const { dir, dist } = site(t, true);
  manifest(dist, { gate: 'failed' });
  const failed = run('export-site', ['--dist', dist, '--out', join(dir, 'a.zip'), '--json']);
  assert.equal(failed.status, 1, failed.stdout + failed.stderr);
  assert.match(failed.json().findings[0].message, /test gate is "failed"/);
  manifest(dist);
  writeFileSync(join(dist, 'index.html'), '<!doctype html><title>rebuilt</title>');
  const stale = run('export-site', ['--dist', dist, '--out', join(dir, 'b.zip'), '--json']);
  assert.equal(stale.status, 1, stale.stdout + stale.stderr);
  assert.match(stale.json().findings[0].message, /earlier build/);
  assert.ok(!existsSync(join(dir, 'a.zip')) && !existsSync(join(dir, 'b.zip')));
});

test('export-site: a link inside the build is exit 2, nothing it points at is packed', (t) => {
  const { dir, dist } = site(t, true);
  mkdirSync(join(dir, 'elsewhere'));
  writeFileSync(join(dir, 'elsewhere', 'secret.txt'), 'not part of the site');
  symlinkSync(join(dir, 'elsewhere'), join(dist, 'link'), 'junction');
  const r = run('export-site', ['--dist', dist, '--out', join(dir, 'x.zip')]);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stdout + r.stderr, /is a link/);
  assert.ok(!existsSync(join(dir, 'x.zip')));
});

test('export-site: --dist and --out are relative to the current folder, like every path', (t) => {
  const { dir } = site(t, true);
  const r = run('export-site', ['--dist', 'dist', '--out', 'here.zip'], { cwd: dir });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(existsSync(join(dir, 'here.zip')));
});
