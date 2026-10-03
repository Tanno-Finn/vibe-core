import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { get } from 'node:http';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { test } from 'node:test';
import { FIX, ROOT, run, scratch } from './helpers.mjs';

const SITE = join(FIX, 'site');

/** A port that is free right now (the OS picks it, then it is released). */
const freePort = () =>
  new Promise((ok) => {
    const s = createServer().listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => ok(port));
    });
  });

/** Starts preview, resolves { url, child } once it prints its address. */
function start(args) {
  const child = spawn(process.execPath, [join(ROOT, 'tools', 'preview.mjs'), ...args], { cwd: ROOT });
  return new Promise((ok, fail) => {
    let out = '';
    child.stdout.on('data', (d) => {
      out += d;
      const m = /open (http:\/\/127\.0\.0\.1:\d+\/)/.exec(out);
      if (m) ok({ url: m[1], child });
    });
    child.on('exit', (code) => fail(new Error(`preview exited with ${code}: ${out}`)));
  });
}

/** GET with the path sent exactly as written (fetch would normalise "/../"). */
const raw = (url, path, headers = {}) =>
  new Promise((ok, fail) => {
    const { hostname, port } = new URL(url);
    get({ hostname, port, path, headers }, (res) => {
      let body = '';
      res.on('data', (d) => (body += d));
      res.on('end', () => ok({ status: res.statusCode, body }));
    }).on('error', fail);
  });

test('preview: serves /, answers a deep route with index.html, refuses a path outside the folder', async (t) => {
  const port = await freePort();
  const { url, child } = await start([SITE, '--port', String(port)]);
  t.after(() => child.kill());
  assert.equal(url, `http://127.0.0.1:${port}/`);
  const index = readFileSync(join(SITE, 'index.html'), 'utf8');
  const home = await raw(url, '/');
  assert.equal(home.status, 200);
  assert.equal(home.body, index);
  const deep = await raw(url, '/de/no-such-page/deeper');
  assert.equal(deep.status, 200);
  assert.equal(deep.body, index);
  assert.equal((await raw(url, '/..%2f..%2f..%2fkit.json')).status, 403);
});

test('preview: --no-spa answers an unknown path with 404', async (t) => {
  const { url, child } = await start([SITE, '--port', String(await freePort()), '--no-spa']);
  t.after(() => child.kill());
  assert.equal((await raw(url, '/de/no-such-page')).status, 404);
});

test('preview: a port that is taken is exit 2', async (t) => {
  const port = await freePort();
  const { child } = await start([SITE, '--port', String(port)]);
  t.after(() => child.kill());
  const r = run('preview', [SITE, '--port', String(port)]);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stdout + r.stderr, /taken/);
});

test('preview: --help exits 0, a folder outside the project is exit 2', () => {
  assert.equal(run('preview', ['--help']).status, 0);
  assert.equal(run('preview', [join(ROOT, '..')]).status, 2);
});

test('preview: a link inside the folder that points elsewhere and a foreign Host header are 403', async (t) => {
  const dir = scratch(t);
  const site = join(dir, 'site');
  cpSync(SITE, site, { recursive: true });
  mkdirSync(join(dir, 'elsewhere'));
  writeFileSync(join(dir, 'elsewhere', 'secret.txt'), 'not part of the site');
  symlinkSync(join(dir, 'elsewhere'), join(site, 'link'), 'junction');
  const { url, child } = await start([site]);
  t.after(() => child.kill());
  assert.equal((await raw(url, '/link/secret.txt')).status, 403);
  // DNS rebinding: a web page whose own domain name now points at 127.0.0.1.
  assert.equal((await raw(url, '/', { host: 'attacker.example' })).status, 403);
  assert.equal((await raw(url, '/', { host: new URL(url).host.replace('127.0.0.1', 'localhost') })).status, 200);
});
