#!/usr/bin/env node
/**
 * overrides.mjs — the one place that decides whether an override is in force.
 *
 * overrides/README.md promises that a committed, valid `overrides/<ID>.md` turns the
 * gate enforcing an `[overridable]` standard from blocking into ADVISORY — still run,
 * still printed, never off. This module is what the gates call to keep that promise,
 * and what scripts/check-overrides.mjs uses to validate the files, so the validator and
 * the gates can never disagree about which overrides count.
 *
 * An override is ACTIVE only when all of these hold (anything else is "no override",
 * and the gate stays blocking):
 *   - the file has a frontmatter block with all five required fields;
 *   - the file is named after the standard it overrides (`overrides/A11Y-005.md`
 *     overrides A11Y-005 and nothing else);
 *   - the named standard exists in base/standards/*.md and is tagged `[overridable]` —
 *     a `[hard]` rule is refused, whatever the file says;
 *   - `decided` and `revisit_after` are real YYYY-MM-DD dates;
 *   - `revisit_after` is today or later. An expired override is a debt that fell due:
 *     it relaxes nothing until someone revisits it and moves the date.
 *
 * Gate API:
 *   applyOverride(id, findings, { gate })  — the call a gate makes. Returns the findings
 *     that still block: `[]` when a valid override for `id` is active (the findings are
 *     then printed as ADVISORY with the file path and its rationale), otherwise the
 *     findings unchanged (and, if an override file for `id` exists but is rejected, why).
 *   isOverridden(id) / activeOverride(id) — the underlying lookups.
 *   printAdvisory(override, findings, { gate }) — the standard advisory block.
 *
 * There is deliberately no flag or environment variable that points this at another
 * overrides directory: the only way to relax a gate is a file in this repo's
 * overrides/. The `root` option exists for the self-test, which builds a throwaway
 * fixture repo and runs a gate inside it.
 *
 * Dependency-free (Node core only).
 *
 * Usage:  node scripts/lib/overrides.mjs --selftest
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = fileURLToPath(import.meta.url);
const DEFAULT_ROOT = path.resolve(path.dirname(HERE), '..', '..');
export const REQUIRED = ['standard', 'rationale', 'decided', 'decided_by', 'revisit_after'];

/**
 * Which gate honours which override. Only standards listed here have a scripted gate
 * that turns advisory; the other `[overridable]` standards are honoured by agent
 * judgement (the /ship skill) or have no automated check at all — see
 * overrides/README.md. The self-test checks that each listed gate really calls
 * this module for its ID.
 */
export const HONOURED_BY = {
  'A11Y-005': ['scripts/check-content-coverage.mjs'],
};

/** Local calendar date as YYYY-MM-DD. */
export function isoToday(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function isRealDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

/** ID -> 'hard' | 'overridable', read from the standards tables. */
export function readTags(root = DEFAULT_ROOT) {
  const tagOf = new Map();
  const dir = path.join(root, 'base', 'standards');
  if (!fs.existsSync(dir)) return tagOf;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    // table rows: | ID | rule | `[hard]`/`[overridable]` | why |
    for (const m of text.matchAll(/\|\s*([A-Z][A-Z0-9]*-\d+)\s*\|[^\n]*?\|\s*`?\[(hard|overridable)\]`?\s*\|/g)) {
      tagOf.set(m[1], m[2]);
    }
  }
  return tagOf;
}

/** Minimal frontmatter parse (no YAML dep): "key: value" and "key: >" folded blocks. */
export function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const fields = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    // An inline comment ("standard: A11Y-005   # the ID"), as in the README's example,
    // is not part of the value — the same rule YAML applies.
    let val = kv[2].replace(/(^|\s+)#.*$/, '');
    if (val === '>' || val === '|') {
      const buf = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) buf.push(lines[++i].trim());
      val = buf.join(' ');
    }
    fields[key] = val.trim();
  }
  return fields;
}

/**
 * Loads and validates every overrides/*.md (README excepted).
 * Returns { tagOf, files, active: Map<id, override>, rejected: [{ rel, id, reason }], problems }.
 * `problems` are repository-level faults (no standards parsed) that make any verdict unsafe.
 */
export function loadOverrides({ root = DEFAULT_ROOT, today = isoToday() } = {}) {
  const tagOf = readTags(root);
  const problems = [];
  // Silent-pass guard: an empty tag map would make every override "unknown" — and, with
  // zero override files (the default), let the validator pass having validated nothing.
  if (tagOf.size === 0) {
    problems.push(
      'base/standards/*.md yielded 0 known standard IDs — the parser broke, or the directory is empty/missing. Cannot validate overrides against nothing.',
    );
  }
  const dir = path.join(root, 'overrides');
  const files = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.md') && f !== 'README.md')
        .sort()
    : [];
  const active = new Map();
  const rejected = [];
  for (const file of files) {
    const rel = `overrides/${file}`;
    const fileId = file.replace(/\.md$/, '');
    const reject = (reason, id = fileId) => rejected.push({ rel, id, reason });
    const fm = frontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!fm) {
      reject('no valid frontmatter block.');
      continue;
    }
    const missing = REQUIRED.filter((k) => !fm[k]);
    if (missing.length) {
      reject(`missing frontmatter field(s): ${missing.join(', ')}.`);
      continue;
    }
    const id = fm.standard;
    if (id !== fileId) {
      reject(`names standard "${id}" but the file must be called overrides/${id}.md — one file per standard.`, id);
      continue;
    }
    const tag = tagOf.get(id);
    if (!tag) {
      reject(`names unknown standard "${id}".`);
      continue;
    }
    if (tag === 'hard') {
      reject(`standard "${id}" is [hard] and cannot be overridden — REFUSED.`);
      continue;
    }
    const badDates = ['decided', 'revisit_after'].filter((k) => !isRealDate(fm[k]));
    if (badDates.length) {
      reject(`${badDates.join(', ')} must be a real date as YYYY-MM-DD.`);
      continue;
    }
    if (fm.revisit_after < today) {
      reject(
        `EXPIRED — revisit_after ${fm.revisit_after} has passed (today ${today}). Revisit the decision: delete the file, or renew it with a new revisit_after.`,
      );
      continue;
    }
    active.set(id, {
      id,
      rel,
      rationale: fm.rationale,
      decided: fm.decided,
      decidedBy: fm.decided_by,
      revisit: fm.revisit_after,
    });
  }
  return { tagOf, files, active, rejected, problems };
}

const cache = new Map();
function state(opts = {}) {
  const key = `${opts.root ?? DEFAULT_ROOT}|${opts.today ?? isoToday()}`;
  if (!cache.has(key)) cache.set(key, loadOverrides(opts));
  return cache.get(key);
}

/** The active override for a standard, or null. Never non-null for a [hard] rule. */
export function activeOverride(id, opts) {
  const s = state(opts);
  if (s.problems.length) return null;
  return s.active.get(id) ?? null;
}

export function isOverridden(id, opts) {
  return activeOverride(id, opts) !== null;
}

/** The standard ADVISORY block a gate prints for findings its override relaxes. */
export function printAdvisory(override, findings, { gate = 'gate', log = console.log } = {}) {
  log('');
  log(`  ADVISORY — ${override.id} is overridden by ${override.rel}; ${gate} does not block on it.`);
  log(`    rationale: ${override.rationale}`);
  log(`    decided ${override.decided} by ${override.decidedBy} · revisit after ${override.revisit}`);
  log(`    ${findings.length} finding(s) that would otherwise block:`);
  for (const f of findings) log(`      - ${f}`);
}

/**
 * The call a gate makes: returns the findings that still block. With an active
 * override for `id` that is `[]` and the findings are printed as ADVISORY; without one
 * they come back unchanged (and a rejected override file for `id` is named, so nobody
 * wonders why their override "did nothing").
 */
export function applyOverride(id, findings, { gate = 'gate', log = console.log, ...opts } = {}) {
  if (findings.length === 0) return findings;
  const ovr = activeOverride(id, opts);
  if (ovr) {
    printAdvisory(ovr, findings, { gate, log });
    return [];
  }
  for (const r of state(opts).rejected.filter((x) => x.id === id)) {
    log(`  NOTE — ${r.rel} is not honored (${r.reason}) — ${id} stays blocking.`);
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Self-test: a throwaway fixture repo with one [hard] and one [overridable] rule and a
// tiny gate that reports one finding against each ID it is given, exactly as a real
// gate does: blocking = applyOverride(id, findings), exit 1 if anything still blocks.
// ---------------------------------------------------------------------------
function selftest() {
  const results = [];
  const check = (name, cond, detail = '') => results.push({ name, ok: !!cond, detail });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'overrides-selftest-'));
  try {
    fs.mkdirSync(path.join(tmp, 'base', 'standards'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'overrides'));
    fs.mkdirSync(path.join(tmp, 'scripts', 'lib'), { recursive: true });
    fs.writeFileSync(
      path.join(tmp, 'base', 'standards', 'FIX.md'),
      [
        '| ID | Rule | Tag | Why |',
        '|---|---|---|---|',
        '| FIX-001 | A hard rule. | `[hard]` | Fixture. |',
        '| FIX-002 | A relaxable rule. | `[overridable]` | Fixture. |',
        '',
      ].join('\n'),
    );
    fs.copyFileSync(HERE, path.join(tmp, 'scripts', 'lib', 'overrides.mjs'));
    const gateFile = path.join(tmp, 'scripts', 'fixture-gate.mjs');
    fs.writeFileSync(
      gateFile,
      [
        "import { applyOverride } from './lib/overrides.mjs';",
        'const id = process.argv[2];',
        "const blocking = applyOverride(id, [`${id} violated in fixture`], { gate: 'fixture-gate' });",
        "if (blocking.length) { console.log('BLOCKED'); process.exit(1); }",
        "console.log('PASSED (advisory)');",
        '',
      ].join('\n'),
    );
    const runGate = (id) => spawnSync(process.execPath, [gateFile, id], { encoding: 'utf8' });
    const ovr = (id, extra = {}) => {
      const fm = {
        standard: id,
        rationale: 'Fixture rationale for the self-test.',
        decided: '2026-01-01',
        decided_by: 'selftest',
        revisit_after: '2999-12-31',
        ...extra,
      };
      const body = Object.entries(fm)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
      return `---\n${body}\n---\n\nFixture.\n`;
    };
    const put = (name, text) => fs.writeFileSync(path.join(tmp, 'overrides', name), text);
    const clear = () => {
      for (const f of fs.readdirSync(path.join(tmp, 'overrides'))) fs.rmSync(path.join(tmp, 'overrides', f));
    };

    let r = runGate('FIX-002');
    check('no override: the gate blocks on an [overridable] finding', r.status === 1, r.stdout);

    put('FIX-002.md', ovr('FIX-002'));
    r = runGate('FIX-002');
    check('valid override: the gate turns advisory and exits 0', r.status === 0, r.stdout);
    check(
      'valid override: the advisory names the file and quotes the rationale',
      /ADVISORY/.test(r.stdout) && r.stdout.includes('overrides/FIX-002.md') && r.stdout.includes('Fixture rationale'),
      r.stdout,
    );
    check('valid override: the finding is still printed', r.stdout.includes('FIX-002 violated in fixture'), r.stdout);

    clear();
    put(
      'FIX-002.md',
      [
        '---',
        'standard: FIX-002          # the exact ID being overridden',
        'rationale: >               # WHY, in your own words',
        '  Folded rationale, written',
        '  the way the README example shows it.',
        'decided: 2026-01-01        # YYYY-MM-DD',
        'decided_by: selftest',
        'revisit_after: 2999-12-31  # an override is a debt',
        '---',
        '',
      ].join('\n'),
    );
    r = runGate('FIX-002');
    check(
      'README-style frontmatter (inline comments, folded rationale) is honored',
      r.status === 0 && r.stdout.includes('Folded rationale, written the way the README example shows it.'),
      r.stdout,
    );

    clear();
    put('FIX-002.md', ovr('FIX-002', { revisit_after: '2000-01-01' }));
    r = runGate('FIX-002');
    check('expired override: the gate blocks', r.status === 1 && /EXPIRED/.test(r.stdout), r.stdout);

    clear();
    put('FIX-002.md', ovr('FIX-002', { decided_by: null }));
    r = runGate('FIX-002');
    check('override missing a field: the gate blocks', r.status === 1, r.stdout);

    clear();
    put('FIX-002.md', 'standard: FIX-002\nno frontmatter fence at all\n');
    r = runGate('FIX-002');
    check('override without frontmatter: the gate blocks', r.status === 1, r.stdout);

    clear();
    put('FIX-002.md', ovr('FIX-002', { revisit_after: '2999-02-30' }));
    r = runGate('FIX-002');
    check('override with an impossible date: the gate blocks', r.status === 1, r.stdout);

    clear();
    put('OTHER.md', ovr('FIX-002'));
    r = runGate('FIX-002');
    check('override whose file name does not match its standard: the gate blocks', r.status === 1, r.stdout);

    clear();
    put('FIX-001.md', ovr('FIX-001'));
    r = runGate('FIX-001');
    check('override of a [hard] rule: refused, the gate blocks', r.status === 1 && /REFUSED/.test(r.stdout), r.stdout);

    clear();
    put('FIX-002.md', ovr('FIX-002'));
    r = runGate('FIX-001');
    check('an override of one rule does not relax another', r.status === 1, r.stdout);

    // The in-process view check-overrides.mjs reports from.
    clear();
    put('FIX-001.md', ovr('FIX-001'));
    put('FIX-002.md', ovr('FIX-002'));
    const s = loadOverrides({ root: tmp, today: '2026-06-01' });
    check(
      'loadOverrides: one active, one rejected',
      s.active.size === 1 && s.active.has('FIX-002') && s.rejected.length === 1,
    );
    check(
      'expiry is a date comparison: revisit_after today is still active',
      (() => {
        clear();
        put('FIX-002.md', ovr('FIX-002', { revisit_after: '2026-06-01' }));
        return loadOverrides({ root: tmp, today: '2026-06-01' }).active.has('FIX-002');
      })(),
    );
    check(
      'an empty standards tree is a problem, not a pass',
      (() => {
        fs.rmSync(path.join(tmp, 'base', 'standards', 'FIX.md'));
        return loadOverrides({ root: tmp }).problems.length === 1;
      })(),
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // Wiring: every gate that claims to honour an override really asks this module.
  for (const [id, gates] of Object.entries(HONOURED_BY)) {
    for (const gate of gates) {
      const file = path.join(DEFAULT_ROOT, gate);
      const src = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
      check(
        `${gate} honors ${id} through this module`,
        /from '\.\/lib\/overrides\.mjs'/.test(src) && src.includes(`'${id}'`),
      );
    }
  }
  const tags = readTags(DEFAULT_ROOT);
  for (const id of Object.keys(HONOURED_BY)) {
    check(`${id} is an [overridable] standard in base/standards`, tags.get(id) === 'overridable');
  }

  for (const r of results) {
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} SELFTEST: ${r.name}`);
    if (!r.ok && r.detail) for (const l of r.detail.trim().split(/\r?\n/)) console.log(`         | ${l}`);
  }
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `overrides --selftest: FAIL — ${failed} case(s)` : 'overrides --selftest: PASS');
  return failed === 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  if (process.argv.includes('--selftest')) process.exit(selftest() ? 0 : 1);
  console.log('usage: node scripts/lib/overrides.mjs --selftest   (gates import this module)');
}
