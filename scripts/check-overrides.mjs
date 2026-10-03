#!/usr/bin/env node
/**
 * check-overrides — validate and report the two-tier override mechanic.
 *
 * Validation lives in scripts/lib/overrides.mjs, the same module the gates call, so
 * this report and the gates' verdicts cannot disagree. An override is active only if:
 *
 *   - its frontmatter carries all five required fields
 *     (standard, rationale, decided, decided_by, revisit_after);
 *   - it is named after its standard (overrides/<STANDARD-ID>.md);
 *   - the named standard exists and is [overridable] — an override of a [hard] /
 *     SECURITY rule is REFUSED;
 *   - its dates are real YYYY-MM-DD dates and revisit_after has not passed.
 *
 * An active override turns the gates that honour it (HONOURED_BY in the module,
 * listed in overrides/README.md) from blocking into ADVISORY — never off. Anything
 * else is treated as NO override (gate stays blocking) and fails this check.
 *
 * Dependency-free (Node core only). Exit 1 if any override is invalid or expired.
 *
 * Usage:  node scripts/check-overrides.mjs
 */

import { HONOURED_BY, loadOverrides } from './lib/overrides.mjs';

const { tagOf, files, active, rejected, problems } = loadOverrides();
const invalid = [...problems, ...rejected.map((r) => `${r.rel}: ${r.reason}`)];

const bar = '='.repeat(66);
console.log(bar);
console.log('  check-overrides — two-tier standard overrides');
console.log(bar);
console.log(
  `  standards known: ${tagOf.size} (${[...tagOf.values()].filter((t) => t === 'overridable').length} overridable)`,
);
if (!files.length) console.log('  no override files — all gates blocking (default).');
for (const a of active.values()) {
  const gates = HONOURED_BY[a.id];
  console.log(`  ADVISORY  ${a.id}  (${a.rel})`);
  console.log(`            rationale: ${a.rationale}`);
  console.log(`            decided ${a.decided} by ${a.decidedBy} · revisit after: ${a.revisit}`);
  console.log(
    gates
      ? `            relaxes: ${gates.join(', ')}`
      : '            relaxes: no scripted gate — honored by agent judgment (see overrides/README.md)',
  );
}
for (const p of invalid) console.log('  INVALID   ' + p);
console.log(bar);
if (invalid.length) {
  console.log(`  ${invalid.length} invalid override(s) — treated as NO override (gate stays blocking).`);
  process.exit(1);
}
console.log(`  ${active.size} active override(s), all valid. Gates advisory, never off.`);
process.exit(0);
