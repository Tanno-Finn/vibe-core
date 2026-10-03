#!/usr/bin/env node
/**
 * Genericity gate — fails the build when product-specific branding leaks into
 * user-visible i18n content or timeline events.
 *
 * Background: a kit extracted from a production site carries that site's identity
 * further than a name-and-domain scrub reaches — nav titles, purchase copy, story
 * lines in the i18n layer. This gate scans every i18n module VALUE (not key names)
 * and every timeline event field for a tight denylist.
 *
 * Deliberately narrow: didactic content about AI/ML is legitimate in a kit that
 * ships an ML demo, so plain topic words are NOT flagged, only branding-shaped
 * markers. Keep every entry explainable.
 *
 * Three lists:
 *
 *   1. Generic markers (DENYLIST) — every i18n module value AND every timeline
 *      event field.
 *   2. Vendor names (VENDOR_DENYLIST) — timeline event data only, and there only
 *      outside the event body. ADR-0015: an event is a dated fact, so its body may
 *      name the vendor it is about; its title may not, because titles carry lists,
 *      navigation and snippets that must stay neutral. Vendor names elsewhere
 *      (i18n chrome, article prose) stay an editorial rule under ADR-0013, not a
 *      gate — judging those needs intent, which a regex does not have.
 *   3. A workspace denylist (optional, WORKSPACE_DENYLIST) — the names of whatever
 *      a project was derived from belong in no published file, not even in a gate
 *      that keeps them out. A workspace can list them in a module outside its
 *      published tree; it is merged into list 1 when present. Without it the gate
 *      runs its generic checks alone and says so.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { entryFor, hashedMatcher } from './lib/hashed-denylist.mjs';

const MODULES_DIR = 'src/assets/i18n/modules';
const TIMELINE_DIR = 'src/assets/data/translations/timeline';

/**
 * Optional workspace module. It may export
 *   DENYLIST      — [pattern, reason, allowlist?] entries, same shape as below;
 *   IDENTITIES    — salted digests built with entryFor() (scripts/lib/hashed-denylist.mjs),
 *                   for names whose plain text should not sit even in that file;
 *   SELFTEST_HITS — strings the merged denylist must flag (proves the entries still match).
 */
const WORKSPACE_DENYLIST = 'internal/genericity-denylist.mjs';

/**
 * [pattern, reason, allowlist of "namespace:keyPath" exceptions]
 *
 * The namespace is the i18n module name (`glossary`), or `timeline-event` for a
 * timeline translation file. The key path is the dotted path to the value, with
 * `*` matching exactly one path segment (`details.*.text`).
 */
const DENYLIST = [
  // A product reference (a book's ISBN) does not belong in UI copy of a kit.
  [/\b97[89][- –]?\d[\d –-]{8,}\d\b/u, 'ISBN-shaped number'],
];

let workspace = null;
if (existsSync(WORKSPACE_DENYLIST)) {
  workspace = await import(pathToFileURL(resolve(WORKSPACE_DENYLIST)).href);
  DENYLIST.push(...(workspace.DENYLIST ?? []));
  // Each digest becomes a matcher shaped like a RegExp, see scripts/lib/hashed-denylist.mjs.
  for (const { reason, ...entry } of workspace.IDENTITIES ?? []) DENYLIST.push([hashedMatcher([entry]), reason]);
}

/**
 * Vendor and product names as word-boundary patterns, checked against timeline
 * event data only. The allowlist opens the event *body* (ADR-0015) and leaves the
 * title sharp. Keep the list short and explicit — it names the vendors whose
 * products actually turn up in AI timeline entries, not every company on earth.
 */
const VENDOR_DENYLIST = [
  [
    /\b(Anthropic|OpenAI|Google|Microsoft|Meta|Amazon|Apple|Nvidia)\b/u,
    'vendor name outside a timeline event body (ADR-0015: bodies may name vendors, titles may not)',
    ['timeline-event:description', 'timeline-event:details.*.text'],
  ],
];

const escapeRe = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Does "namespace:keyPath" match one of an entry's allowlist exceptions? */
function isAllowed(namespace, keyPath, allowlist) {
  if (!allowlist) return false;
  return allowlist.some((entry) => {
    const [ns, keys = ''] = entry.split(':');
    if (ns !== namespace) return false;
    const pattern = keys
      .split('.')
      .map((segment) => (segment === '*' ? '[^.]+' : escapeRe(segment)))
      .join('\\.');
    return new RegExp(`^${pattern}$`, 'u').test(keyPath);
  });
}

function* walkValues(obj, path = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') yield* walkValues(value, [...path, key]);
    else if (typeof value === 'string') yield [[...path, key].join('.'), value];
  }
}

/** Runs the given denylists over one parsed JSON document; returns the leaks found. */
function scan(namespace, label, data, denylists) {
  const found = [];
  for (const [keyPath, value] of walkValues(data)) {
    for (const list of denylists) {
      for (const [pattern, reason, allowlist] of list) {
        if (!pattern.test(value)) continue;
        if (isAllowed(namespace, keyPath, allowlist)) continue;
        found.push(`LEAK [${reason}] ${label} → ${keyPath}: ${value.slice(0, 100)}`);
      }
    }
  }
  return found;
}

const leaks = [];

// 1. i18n modules — branding markers.
let moduleFiles = 0;
for (const lang of readdirSync(MODULES_DIR)) {
  const dir = join(MODULES_DIR, lang);
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    moduleFiles++;
    const data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    leaks.push(...scan(file.replace(/\.json$/u, ''), `${lang}/${file}`, data, [DENYLIST]));
  }
}

// 2. Timeline events — branding markers everywhere, vendor names outside the body.
let eventFiles = 0;
for (const lang of readdirSync(TIMELINE_DIR)) {
  const dir = join(TIMELINE_DIR, lang);
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    eventFiles++;
    const data = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    leaks.push(...scan('timeline-event', `timeline/${lang}/${file}`, data, [DENYLIST, VENDOR_DENYLIST]));
  }
}

// ---------------------------------------------------------------------------
// Self-test (SELFTEST=1) — prove the two scopes are actually distinguished.
// Runs on planted in-memory documents, so no fixture is ever written to disk.
// ---------------------------------------------------------------------------
if (process.env.SELFTEST) {
  const check = (name, condition, detail) => {
    if (condition) console.log(`  ok   SELFTEST: ${name}`);
    else leaks.push(`SELFTEST FAIL: ${name} — ${detail}`);
  };
  const inTitle = { title: 'OpenAI ships a chat product', description: 'A neutral sentence.' };
  const inBody = {
    title: 'A chat product reaches the public',
    description: 'OpenAI released it in November 2022.',
    details: { d1: { icon: 'pi pi-info', text: 'Microsoft invested in the same year.' } },
  };
  const branded = { title: 'The guide ISBN 978-3-16-148410-0 launches', description: 'A neutral sentence.' };
  const lists = [DENYLIST, VENDOR_DENYLIST];
  const t = scan('timeline-event', 'selftest', inTitle, lists);
  const b = scan('timeline-event', 'selftest', inBody, lists);
  const o = scan('timeline-event', 'selftest', branded, lists);
  check('a vendor name in an event title fails', t.length === 1, `got ${t.length} leak(s)`);
  check('the same vendor names in description and details pass', b.length === 0, b.join(' | '));
  check('a generic marker in an event still fails', o.length === 1, `got ${o.length} leak(s)`);
  check(
    'the body exception is namespaced, not global',
    scan('glossary', 'selftest', inBody, [VENDOR_DENYLIST]).length === 2,
    'an i18n module inherited the timeline body exception',
  );
  check(
    'both scans found files',
    moduleFiles > 0 && eventFiles > 0,
    `${moduleFiles} module file(s), ${eventFiles} event file(s)`,
  );
}

// ---------------------------------------------------------------------------
// Hashed-matcher self-test — always on. It is cheap, runs in memory, and is the only
// proof that the digest entries still match anything: a digest that silently stopped
// matching (a changed normalisation, a broken salt) would pass every real scan.
// Uses invented phrases, never the stored ones.
// ---------------------------------------------------------------------------
{
  const before = leaks.length;
  const fail = (name) => leaks.push(`SELFTEST FAIL: hashed matcher — ${name}`);
  const folded = hashedMatcher([entryFor('Quorvel Mäßig', { fold: true, suffix: 'any' })]);
  const exact = hashedMatcher([entryFor('Zandrik', { fold: false, suffix: 'word' })]);
  const cases = [
    [folded, 'Ein Buch von Quorvel Mäßig.', true, 'plain two-word phrase'],
    [folded, 'QUORVEL MÄSSIG', true, 'case-insensitive entry ignores case'],
    [folded, 'quorvel maessig', true, 'umlaut and "e" spelling hash alike'],
    [folded, 'Quorvel-Mäßigs Werk', true, 'inflected form and hyphen still match'],
    [folded, 'Quorvel', false, 'half of a two-word phrase does not match'],
    [folded, 'XQuorvel Mäßig', false, 'a slice must start at a word start'],
    [exact, 'published by Zandrik.', true, 'case-sensitive entry matches exact case'],
    [exact, 'published by zandrik', false, 'case-sensitive entry rejects other case'],
    [exact, 'Zandriks', false, 'word-bounded entry rejects a longer word'],
  ];
  for (const [matcher, text, expected, name] of cases) {
    if (matcher.test(text) !== expected) fail(`${name} (expected ${expected} for "${text}")`);
  }
  if (!(workspace?.IDENTITIES ?? []).every((e) => /^[0-9a-f]{64}$/u.test(e.sha256)))
    fail('a workspace entry is not a SHA-256 digest');
  if (process.env.SELFTEST && leaks.length === before)
    console.log(`  ok   SELFTEST: hashed matcher (${cases.length} cases)`);
}

// Workspace self-test — always on when the workspace denylist is loaded: every planted
// string must be flagged, or an entry silently stopped matching.
if (workspace) {
  for (const text of workspace.SELFTEST_HITS ?? []) {
    if (scan('selftest', 'selftest', { text }, [DENYLIST]).length === 0)
      leaks.push(`SELFTEST FAIL: workspace denylist does not flag a planted string (${text.length} chars)`);
  }
}

// Silent-pass guard: an empty MODULES_DIR/TIMELINE_DIR (renamed, moved, or a
// glob that stopped matching) would otherwise scan zero files and report a
// clean PASS — "no leaks found" because nothing was looked at, not because
// nothing leaked. This ran only under SELFTEST before; it now runs always.
if (moduleFiles === 0) {
  leaks.push(`SETUP: found 0 i18n module files under ${MODULES_DIR} — the gate scanned nothing.`);
}
if (eventFiles === 0) {
  leaks.push(`SETUP: found 0 timeline event files under ${TIMELINE_DIR} — the gate scanned nothing.`);
}

const violations = leaks.length;
for (const leak of leaks) console.error(leak);

if (violations > 0) {
  console.error(`\ncheck-genericity: FAIL — ${violations} leak(s).`);
  process.exit(1);
}
const scope = workspace
  ? `generic + workspace denylist (${DENYLIST.length} entries)`
  : `generic denylist only, no workspace denylist`;
console.log(
  `check-genericity: PASS — no branding in ${moduleFiles} i18n module file(s), ` +
    `no branding and no title vendor names in ${eventFiles} timeline event file(s) [${scope}].`,
);
