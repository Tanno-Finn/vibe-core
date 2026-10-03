/**
 * a11y-verdict.mjs — the kit's accessibility verdict on axe-core results, shared by the
 * gate (scripts/check-a11y.mjs) and the `a11y` kit tool, so a teacher's handout and the
 * built site are judged by one set of rules.
 *
 * WHAT: AXE_TO_A11Y attributes an axe rule to the A11Y rule it is evidence against.
 * `verdict()` splits violations into blocking and advisory: a violation mapped to a
 * `[hard]` rule blocks, one mapped to an `[overridable]` rule blocks unless a valid
 * overrides/<ID>.md relaxes it (scripts/lib/overrides.mjs), and an unmapped axe rule is
 * advice only. The tags are read from base/standards/A11Y.md, so a tag changed there
 * changes the verdict without touching this file. `runAxe()` injects axe into a page
 * and returns its findings in the one shape both callers print.
 *
 * The gate's KNOWN list (site findings parked for a decision) stays in the gate: it is
 * about the portal's pages, not about a file someone checks with the tool.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { activeOverride } from './overrides.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const require = createRequire(import.meta.url);

/**
 * axe rule id → the A11Y rule it is evidence against. Only rules listed here can
 * block; the mapping is deliberately narrow — an axe rule is mapped only when a
 * failure of it is, on its face, a failure of that A11Y rule.
 */
export const AXE_TO_A11Y = {
  // A11Y-001 — keyboard-reachable and operable, visible focus
  'scrollable-region-focusable': 'A11Y-001',
  'frame-focusable-content': 'A11Y-001',
  'aria-hidden-focus': 'A11Y-001',
  'nested-interactive': 'A11Y-001',
  // A11Y-002 — text alternative for meaningful images / icons
  'image-alt': 'A11Y-002',
  'input-image-alt': 'A11Y-002',
  'area-alt': 'A11Y-002',
  'svg-img-alt': 'A11Y-002',
  'role-img-alt': 'A11Y-002',
  'object-alt': 'A11Y-002',
  // A11Y-003 — custom widgets expose a role and an accessible name
  'button-name': 'A11Y-003',
  'link-name': 'A11Y-003',
  'input-button-name': 'A11Y-003',
  label: 'A11Y-003',
  'select-name': 'A11Y-003',
  'aria-allowed-attr': 'A11Y-003',
  'aria-allowed-role': 'A11Y-003',
  'aria-command-name': 'A11Y-003',
  'aria-input-field-name': 'A11Y-003',
  'aria-toggle-field-name': 'A11Y-003',
  'aria-meter-name': 'A11Y-003',
  'aria-progressbar-name': 'A11Y-003',
  'aria-tooltip-name': 'A11Y-003',
  'aria-treeitem-name': 'A11Y-003',
  'aria-required-attr': 'A11Y-003',
  'aria-required-children': 'A11Y-003',
  'aria-required-parent': 'A11Y-003',
  'aria-roles': 'A11Y-003',
  'aria-prohibited-attr': 'A11Y-003',
  'aria-valid-attr': 'A11Y-003',
  'aria-valid-attr-value': 'A11Y-003',
  // A11Y-004 — WCAG AA contrast (the AAA rule `color-contrast-enhanced` is not mapped)
  'color-contrast': 'A11Y-004',
  // A11Y-006 — not by colour alone
  'link-in-text-block': 'A11Y-006',
};

/** What axe cannot see — printed by every caller, because a green run does not cover it. */
export const AXE_CANNOT_SEE = [
  'whether alt texts are meaningful',
  'whether the keyboard path through a canvas or custom demo makes sense',
  'whether focus order is logical beyond the listed tab stops',
  'meaning carried by colour alone inside images',
  'whether Easy-Language text is actually easy',
];

/** Reads each A11Y rule's tag from the standard: { 'A11Y-001': 'hard', ... }. Throws if none. */
export function readTags(root = ROOT) {
  const file = join(root, 'base/standards/A11Y.md');
  const tags = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = /^\|\s*(A11Y-\d{3})\s*\|.*\|\s*`\[(hard|overridable)\]`\s*\|/.exec(line);
    if (m) tags[m[1]] = m[2];
  }
  if (Object.keys(tags).length === 0) throw new Error(`no rule tags found in ${file}`);
  return tags;
}

/**
 * Splits axe violations ({ id, impact, help, nodes }) into
 * { blocking: [{ rule, ...v }], advisory: [{ rule | '—', override, ...v }] }, order kept.
 */
export function verdict(violations, { tags }) {
  const blocking = [];
  const advisory = [];
  for (const v of violations) {
    const rule = AXE_TO_A11Y[v.id];
    // A mapped rule blocks — [hard] always, [overridable] unless a valid
    // overrides/<ID>.md relaxes it. Unmapped axe rules are advice only.
    const override = rule && tags[rule] === 'overridable' ? activeOverride(rule) : null;
    if (!rule || override) advisory.push({ rule: rule || '—', override, ...v });
    else blocking.push({ rule, ...v });
  }
  return { blocking, advisory };
}

/** axe-core's browser bundle and version, from the installed package. */
export function loadAxe() {
  return {
    source: readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8'),
    version: require('axe-core/package.json').version,
  };
}

/**
 * Runs axe in `page` and returns { violations, incomplete }, each [{ id, impact, help, nodes }]
 * where a node is its selector plus axe's own one-line reason (for contrast: the ratio).
 * `incomplete` (axe could not decide: check by hand) is empty unless asked for.
 */
export async function runAxe(page, axeSource, { incomplete = false } = {}) {
  await page.evaluate(axeSource);
  return await page.evaluate(async (withIncomplete) => {
    // `axe` is the global the injected axe.min.js defines in the page.
    const result = await axe.run(document, {
      resultTypes: withIncomplete ? ['violations', 'incomplete'] : ['violations'],
    });
    const shape = (list) =>
      list.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.map((n) => {
          const why = [...n.any, ...n.all, ...n.none].find((c) => c.message)?.message;
          return why ? `${n.target.join(' ')}  → ${why}` : n.target.join(' ');
        }),
      }));
    return { violations: shape(result.violations), incomplete: withIncomplete ? shape(result.incomplete) : [] };
  }, incomplete);
}
