#!/usr/bin/env node
/**
 * check-packs — the pack-contract conformance gate (N8.1).
 *
 * A pack (packs/<id>/pack.json) is an optional bundle of task-skills that layers on
 * top of the kit. Like the base, a pack is KIT-BLIND: it programs against the kit's
 * declared capabilities (kit.json), never against kit code, and every capability it
 * needs must carry a fallback so it degrades gracefully when the capability is absent.
 *
 * This gate validates every pack manifest against base/pack.schema.json's rules
 * (shape) AND enforces the one semantic rule a JSON-Schema can't express on its own:
 *
 *   the kit-blind capability-fallback rule
 *   -> for each capability a pack declares, if the kit does NOT provide it, the pack
 *      must declare a `fallback` that the kit DOES provide (ultimately file:markdown,
 *      the base-guaranteed floor). A required-but-absent capability with no working
 *      fallback means the pack assumes kit internals and would break on this kit — FAIL.
 *
 * Dependency-free (Node core only), matching scripts/verify-harness.mjs and
 * scripts/check-overrides.mjs — no JSON-Schema validator, no install step.
 *
 * Usage:
 *   node scripts/check-packs.mjs            validate every packs/<id>/pack.json against kit.json
 *   node scripts/check-packs.mjs --selftest prove the fallback rule on embedded fixtures
 *                                           (negative case FAILs, positive case PASSes)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKS_DIR = path.join(ROOT, 'packs');
const KIT_FILE = path.join(ROOT, 'kit.json');

const CAP_RE = /^(file|content|page|check|site):[a-z0-9-]+$/;
const ID_RE = /^[a-z0-9-]+$/;
const SEMVER_RE = /^\d+\.\d+\.\d+$/;
const REQUIRED = ['id', 'name', 'layer', 'packVersion', 'baseVersion', 'activation', 'capabilities'];

/**
 * Validate one pack manifest against the contract + the kit's capability set.
 * Returns an array of human-readable problem strings (empty === conformant).
 * Pure: no I/O, so the same function checks real packs and the selftest fixtures.
 */
function validatePack(manifest, kitCaps, label) {
  const problems = [];
  const at = (msg) => problems.push(`${label}: ${msg}`);

  for (const f of REQUIRED) {
    if (!(f in manifest)) at(`missing required field "${f}".`);
  }
  if (manifest.id !== undefined && !ID_RE.test(manifest.id)) at(`id "${manifest.id}" is not kebab-case.`);
  if (manifest.layer !== undefined && manifest.layer !== 'pack') at(`layer must be "pack", got "${manifest.layer}".`);
  if (manifest.packVersion !== undefined && !SEMVER_RE.test(manifest.packVersion))
    at(`packVersion "${manifest.packVersion}" is not semver.`);
  if (manifest.baseVersion !== undefined && !SEMVER_RE.test(manifest.baseVersion))
    at(`baseVersion "${manifest.baseVersion}" is not semver.`);

  const phrases = manifest.activation && manifest.activation.phrases;
  if (!Array.isArray(phrases) || phrases.length === 0) {
    at('activation.phrases must be a non-empty array (a pack activates conversationally).');
  }

  if (!Array.isArray(manifest.capabilities)) {
    at('capabilities must be an array.');
    return problems; // can't run the fallback rule without it
  }

  const kit = new Set(kitCaps);
  for (const cap of manifest.capabilities) {
    if (!cap || typeof cap.id !== 'string') {
      at('a capability entry has no id.');
      continue;
    }
    if (!CAP_RE.test(cap.id)) {
      at(`capability "${cap.id}" is not a valid capability id.`);
      continue;
    }

    // --- the kit-blind capability-fallback rule --------------------------------
    if (kit.has(cap.id)) continue; // kit provides it directly — fine
    if (cap.fallback === undefined) {
      at(
        `needs "${cap.id}" but the kit does not provide it and no fallback is declared ` +
          `(kit-blind rule: degrade gracefully or don't assume the capability).`,
      );
      continue;
    }
    if (!CAP_RE.test(cap.fallback)) {
      at(`fallback "${cap.fallback}" for "${cap.id}" is not a valid capability id.`);
      continue;
    }
    if (!kit.has(cap.fallback)) {
      at(
        `falls back from "${cap.id}" to "${cap.fallback}", but the kit provides neither — ` +
          `a fallback must resolve to a capability the kit actually has.`,
      );
    }
  }
  return problems;
}

const bar = '='.repeat(66);

// --- --selftest: prove the rule on embedded fixtures -----------------------
if (process.argv.includes('--selftest')) {
  const SYNTH_KIT = ['file:markdown', 'content:article']; // a deliberately small kit
  const base = { name: 'x', layer: 'pack', packVersion: '0.1.0', baseVersion: '0.1.0', activation: { phrases: ['x'] } };

  // NEGATIVE: needs a capability the kit lacks, with NO fallback -> must FAIL.
  const negative = { ...base, id: 'needs-absent-no-fallback', capabilities: [{ id: 'page:interactive' }] };
  // POSITIVE: needs the same absent capability but falls back to file:markdown -> must PASS.
  const positive = {
    ...base,
    id: 'needs-absent-with-fallback',
    capabilities: [{ id: 'page:interactive', fallback: 'file:markdown' }],
  };

  // check: is a capability prefix too (a verification the kit can run): the same rule holds.
  const checkNeg = { ...base, id: 'needs-check-no-fallback', capabilities: [{ id: 'check:a11y' }] };
  const checkPos = {
    ...base,
    id: 'needs-check-with-fallback',
    capabilities: [{ id: 'check:a11y', fallback: 'file:markdown' }],
  };
  const badPrefix = { ...base, id: 'unknown-prefix', capabilities: [{ id: 'verify:a11y', fallback: 'file:markdown' }] };

  const negProblems = [
    ...validatePack(negative, SYNTH_KIT, 'negative-fixture'),
    ...validatePack(checkNeg, SYNTH_KIT, 'negative-check-fixture'),
  ];
  const posProblems = validatePack(positive, SYNTH_KIT, 'positive-fixture');
  const checkPosProblems = validatePack(checkPos, SYNTH_KIT, 'positive-check-fixture');
  const badPrefixProblems = validatePack(badPrefix, SYNTH_KIT, 'unknown-prefix-fixture');

  console.log(bar);
  console.log('  check-packs --selftest — proving the kit-blind fallback rule');
  console.log(bar);
  console.log(`  synthetic kit capabilities: ${SYNTH_KIT.join(', ')}`);

  const negOk = negProblems.length === 2; // both expected to be rejected
  const posOk = posProblems.length === 0 && checkPosProblems.length === 0; // expected to be accepted
  const prefixOk = badPrefixProblems.length > 0; // an unknown prefix is not a capability
  console.log(
    `  negative (absent file:/check: cap, no fallback): ${negOk ? 'correctly REJECTED' : 'WRONGLY ACCEPTED'}`,
  );
  for (const p of negProblems) console.log(`            -> ${p}`);
  console.log(
    `  positive (absent file:/check: cap, with fallback): ${posOk ? 'correctly ACCEPTED' : 'WRONGLY REJECTED'}`,
  );
  for (const p of [...posProblems, ...checkPosProblems]) console.log(`            -> ${p}`);
  console.log(`  unknown prefix (verify:): ${prefixOk ? 'correctly REJECTED' : 'WRONGLY ACCEPTED'}`);
  for (const p of badPrefixProblems) console.log(`            -> ${p}`);
  console.log(bar);

  if (negOk && posOk && prefixOk) {
    console.log('  PASS — the fallback rule accepts graceful degradation and rejects blind assumption.');
    process.exit(0);
  }
  console.log('  FAIL — the fallback rule did not behave as specified.');
  process.exit(1);
}

// --- Normal run: validate every real pack against kit.json -----------------
let kitCaps;
try {
  kitCaps = JSON.parse(fs.readFileSync(KIT_FILE, 'utf8')).capabilities || [];
} catch (e) {
  console.error(`FAIL  kit.json does not parse: ${e.message}`);
  process.exit(1);
}

const problems = [];
const ok = [];
let scanned = 0;

if (fs.existsSync(PACKS_DIR)) {
  for (const entry of fs.readdirSync(PACKS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const relManifest = `packs/${entry.name}/pack.json`;
    const manifestPath = path.join(PACKS_DIR, entry.name, 'pack.json');
    if (!fs.existsSync(manifestPath)) {
      problems.push(`packs/${entry.name}/: no pack.json manifest.`);
      continue;
    }
    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch (e) {
      problems.push(`${relManifest}: does not parse — ${e.message}`);
      continue;
    }
    scanned++;
    if (manifest.id && manifest.id !== entry.name) {
      problems.push(`${relManifest}: id "${manifest.id}" does not match folder "${entry.name}".`);
    }
    const found = validatePack(manifest, kitCaps, relManifest);
    if (found.length) problems.push(...found);
    else ok.push(`pack conformant: ${entry.name} (${manifest.capabilities.length} capability declaration(s))`);
  }
}

console.log(bar);
console.log('  check-packs — pack-contract conformance');
console.log(bar);
console.log(`  kit capabilities: ${kitCaps.join(', ') || '(none)'}`);
if (scanned === 0) console.log('  no packs found — nothing to validate.');
if (process.env.VERBOSE) for (const s of ok) console.log('  ok   ' + s);
if (problems.length === 0) {
  console.log(`  PASS — ${scanned} pack(s) scanned, all conformant.`);
  console.log(bar);
  process.exit(0);
}
for (const p of problems) console.log('  FAIL ' + p);
console.log(bar);
console.log(`  ${problems.length} problem(s). Fix before shipping.`);
process.exit(1);
