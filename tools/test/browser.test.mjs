import assert from 'node:assert/strict';
import { mkdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { DEAD_PROXY, allowFor, launchBrowser } from '../../scripts/lib/browser.mjs';
import { browserTest, scratch } from './helpers.mjs';

// The shared browser setup (scripts/lib/browser.mjs) every browser tool and the a11y gate use.

test('browser: the request filter lets through its own origin exactly, not a look-alike', () => {
  const allow = allowFor({ origin: 'http://127.0.0.1:1234' });
  assert.ok(allow('http://127.0.0.1:1234/de/home'));
  assert.ok(allow('data:image/png;base64,AAAA'));
  assert.ok(!allow('http://127.0.0.1:1234@example.org/steal'), 'user-info trick: the host is example.org');
  assert.ok(!allow('http://127.0.0.1:12345/'), 'another port that starts with the same digits');
  assert.ok(!allow('https://example.org/'));
});

test('browser: a file behind a link inside the folder that points elsewhere is refused', (t) => {
  const dir = scratch(t);
  const outside = join(tmpdir(), `kit-browser-outside-${process.pid}`);
  mkdirSync(outside, { recursive: true });
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(join(outside, 'secret.png'), 'x');
  writeFileSync(join(dir, 'ok.png'), 'x');
  symlinkSync(outside, join(dir, 'link'), 'junction');
  const allow = allowFor({ fileDir: dir });
  assert.ok(allow(pathToFileURL(join(dir, 'ok.png')).href));
  assert.ok(!allow(pathToFileURL(join(dir, 'link', 'secret.png')).href));
  assert.ok(!allow(pathToFileURL(join(outside, 'secret.png')).href));
});

browserTest('browser: every connection that leaves this computer goes to the dead proxy and fails', async (t) => {
  const browser = await launchBrowser();
  t.after(() => browser.close());
  assert.ok(browser.process().spawnargs.includes(`--proxy-server=${DEAD_PROXY}`));
  const page = await browser.newPage();
  // Without the proxy this page loads from the internet (or, offline, fails with a DNS error).
  await assert.rejects(
    page.goto('http://example.org/', { timeout: 15_000 }),
    /ERR_(PROXY_CONNECTION_FAILED|BLOCKED_BY_CLIENT)/,
  );
});
