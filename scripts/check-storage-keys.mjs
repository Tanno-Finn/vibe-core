#!/usr/bin/env node
/**
 * Storage-key registration gate — fails when code reads or writes a browser-storage
 * key that `src/app/utils/storage-keys.ts` does not list.
 *
 * The registry is what "delete all my data", the deploy-time cache clear and the
 * privacy page are built from, so an unregistered key is a key none of them know
 * about: never deleted on request, never disclosed. storage-keys.spec.ts already
 * checks the keys the UserDataProviders declare; this gate checks the call sites.
 *
 * It scans every non-spec `.ts` file under src/app for
 *   safeStorage.get|set|remove(<key>, …)
 *   localStorage|sessionStorage.getItem|setItem|removeItem(<key>, …)
 * and resolves <key>:
 *   - a string literal                       → that string;
 *   - an identifier or `this.X` / `Class.X`  → a `X = '…'` const or class field
 *     declared in the same file;
 *   - a parameter of a small helper (`private persist(key: string, …)`) → the first
 *     argument at each call of that helper in the same file, resolved the same way.
 * Every resolved string must be a registered `name`. Anything that cannot be resolved
 * statically must be listed in DYNAMIC_KEYS below with the reason it is safe.
 *
 * Run: node scripts/check-storage-keys.mjs   (SELFTEST=1 adds in-memory proof cases)
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const APP_DIR = 'src/app';
const REGISTRY = 'src/app/utils/storage-keys.ts';

/**
 * Call sites whose key is decided at run time. `file::expression`, file relative to
 * src/app. Each needs a reason a reviewer can check.
 */
const DYNAMIC_KEYS = new Map([
  ['utils/safe-storage.ts::key', 'the wrapper itself; its callers are what this gate checks'],
  [
    'components/shared/checkpoint.component.ts::this.storageKey',
    'legacy per-guide keys, only read and removed during migration; matched by LEGACY_KEY_PATTERNS',
  ],
]);

const CALL =
  /\b(?:safeStorage\.(?:get|set|remove)|(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem))\(\s*([^,)]+?)\s*[,)]/g;
const STRING = /^(['"`])((?:(?!\1)[^\\$]|\\.)*)\1$/;

function registeredNames(source) {
  return new Set([...source.matchAll(/^\s*name:\s*'([^']+)'/gm)].map((m) => m[1]));
}

/** `X = 'lit'` / `X: string = 'lit'` as a const or (static/readonly/private) class field. */
function constantValue(source, name) {
  const re = new RegExp(
    `(?:\\bconst\\s+|(?:^|[{;])\\s*(?:(?:private|public|protected|static|readonly)\\s+)*)${name}\\s*(?::\\s*string\\s*)?=\\s*(['"])([^'"]*)\\1`,
    'm',
  );
  const m = source.match(re);
  return m ? m[2] : null;
}

/** Callers' first arguments when `name` is a parameter of a helper method in the file. */
function helperArguments(source, param) {
  const sig = new RegExp(`\\b(\\w+)\\s*\\(\\s*${param}\\s*:\\s*string\\b`, 'g');
  const args = [];
  for (const m of source.matchAll(sig)) {
    const helper = m[1];
    const call = new RegExp(`(?:this\\.|\\b)${helper}\\(\\s*([^,)]+?)\\s*[,)]`, 'g');
    for (const c of source.matchAll(call)) {
      if (c.index === m.index) continue; // the signature itself
      if (c[1].trim() === `${param}: string` || c[1].includes(':')) continue;
      args.push(c[1].trim());
    }
  }
  return args;
}

/** Returns { keys: string[] } when resolved, or { dynamic: true } when it cannot be. */
function resolve(source, expr, depth = 0) {
  const lit = expr.match(STRING);
  if (lit) return lit[1] === '`' && lit[2].includes('${') ? { dynamic: true } : { keys: [lit[2]] };
  const member = expr.match(/^(?:this|[A-Z]\w*)\.(\w+)$/);
  const name = member ? member[1] : /^\w+$/.test(expr) ? expr : null;
  if (!name) return { dynamic: true };
  const value = constantValue(source, name);
  if (value !== null) return { keys: [value] };
  if (member || depth > 0) return { dynamic: true };
  const args = helperArguments(source, name);
  if (args.length === 0) return { dynamic: true };
  const keys = [];
  for (const a of args) {
    const r = resolve(source, a, depth + 1);
    if (r.dynamic) return { dynamic: true };
    keys.push(...r.keys);
  }
  return { keys };
}

/** All findings for one file's source. `file` is relative to src/app, with forward slashes. */
function checkSource(file, source, registered) {
  const problems = [];
  let calls = 0;
  for (const m of source.matchAll(CALL)) {
    calls++;
    const expr = m[1].trim();
    const line = source.slice(0, m.index).split('\n').length;
    const lineText = source.split('\n')[line - 1].trim();
    if (lineText.startsWith('*') || lineText.startsWith('//')) {
      calls--;
      continue; // a usage example in a comment
    }
    const r = resolve(source, expr);
    if (r.dynamic) {
      if (!DYNAMIC_KEYS.has(`${file}::${expr}`)) {
        problems.push(
          `${file}:${line}: key \`${expr}\` cannot be resolved statically — register the call site in DYNAMIC_KEYS with a reason`,
        );
      }
      continue;
    }
    for (const key of r.keys) {
      if (!registered.has(key)) {
        problems.push(`${file}:${line}: storage key '${key}' is not registered in ${REGISTRY}`);
      }
    }
  }
  return { problems, calls };
}

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.ts') && !p.endsWith('.spec.ts')) out.push(p);
  }
  return out;
}

const registered = registeredNames(readFileSync(REGISTRY, 'utf8'));
const problems = [];
let files = 0;
let calls = 0;
const usedDynamic = new Set();
for (const path of walk(APP_DIR)) {
  const file = relative(APP_DIR, path).split(sep).join('/');
  const source = readFileSync(path, 'utf8');
  const result = checkSource(file, source, registered);
  if (result.calls > 0) files++;
  calls += result.calls;
  problems.push(...result.problems);
  for (const key of DYNAMIC_KEYS.keys()) if (key.startsWith(`${file}::`)) usedDynamic.add(key);
}
for (const key of DYNAMIC_KEYS.keys()) {
  if (!usedDynamic.has(key))
    problems.push(`DYNAMIC_KEYS entry '${key}' names a file that no longer exists — remove it`);
}
if (registered.size === 0)
  problems.push(`SETUP: no \`name: '…'\` entries found in ${REGISTRY} — the gate compared against nothing.`);
if (calls === 0) problems.push(`SETUP: no storage calls found under ${APP_DIR} — the gate scanned nothing.`);

if (process.env.SELFTEST) {
  const reg = new Set(['known']);
  const cases = [
    ["safeStorage.get('known');", 0, 'a registered literal passes'],
    ["safeStorage.set('stray', 'v');", 1, 'an unregistered literal fails'],
    ["const K = 'stray';\nlocalStorage.getItem(K);", 1, 'a const is resolved'],
    [
      "class A { private static readonly K = 'known'; f() { safeStorage.remove(A.K); } }",
      0,
      'a static field is resolved',
    ],
    ["class A { private readonly K = 'stray'; f() { safeStorage.get(this.K); } }", 1, 'a this. field is resolved'],
    [
      "class A { f() { this.save('stray'); } private save(key: string) { safeStorage.set(key, '1'); } }",
      1,
      'a helper parameter resolves to its callers',
    ],
    ['safeStorage.get(`x-${id}`);', 1, 'a template key must be registered as dynamic'],
    [" * safeStorage.get('stray');", 0, 'a comment example is ignored'],
  ];
  for (const [src, expected, name] of cases) {
    const got = checkSource('selftest.ts', src, reg).problems.length;
    if (got === expected) console.log(`  ok   SELFTEST: ${name}`);
    else problems.push(`SELFTEST FAIL: ${name} — expected ${expected} problem(s), got ${got}`);
  }
}

for (const p of problems) console.error(p);
if (problems.length > 0) {
  console.error(`\ncheck-storage-keys: FAIL — ${problems.length} problem(s).`);
  process.exit(1);
}
console.log(
  `check-storage-keys: PASS — ${calls} storage call(s) in ${files} file(s), every key registered ` +
    `(${registered.size} in the registry, ${DYNAMIC_KEYS.size} dynamic call site(s) allowlisted).`,
);
