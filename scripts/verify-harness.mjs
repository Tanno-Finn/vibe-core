#!/usr/bin/env node
/**
 * verify-harness — the agent-system integrity check.
 *
 * Fails (exit 1) if the base agent harness is incomplete or has drifted:
 *   1. Every mandatory harness file exists — including the PreToolUse safety hook and
 *      the settings file that wires it in, which are checked for wiring too (1b): the
 *      matcher must reach Bash/PowerShell/Write/Edit/MultiEdit/NotebookEdit/Read and MCP
 *      tools, and permissions.deny must refuse Edit of the gate's own files.
 *   2. AGENTS.md is within its hard line cap (a bloated map is a broken map).
 *   3. CLAUDE.md still imports AGENTS.md (the wrapper wasn't hollowed out).
 *   4. kit.json parses, has the required contract fields, and declares file:markdown.
 *   5. Every standard listed in base/standards/index.yml actually exists on disk.
 *   6. Every skill carries required frontmatter (name, description, layer).
 *   7. The design-system self-maintenance gates are green — registry/components,
 *      guide articles, and colour contrast (WCAG SC 1.4.3 / 1.4.11).
 *   8. The directives index and the directive files agree (no missing, no orphan).
 *   9. Every pack manifest is well-formed and kit-blind (capability fallbacks).
 *  10. The user-facing-doc translation mirrors are in sync.
 *  11. angular.json's test.include allowlist and the specs on disk agree BOTH ways
 *      (an unlisted spec never runs; a listed-but-deleted spec is a dead entry).
 *  12. No literal C0 control bytes in source text (they turn files binary for grep/git).
 *  13. Every markdown link in AGENTS.md resolves — the map's own entry points.
 *  14. The imprint gate (check-imprint.mjs) passes its own --selftest, so the check
 *      that refuses placeholder imprints for a real domain is proven to still bite.
 *  15. The override mechanic (scripts/lib/overrides.mjs) passes its --selftest: a valid
 *      override turns a gate advisory, an absent, expired, malformed or [hard] one does not.
 *  16. The house-style gate (check-house-style.mjs) passes its --selftest, so every
 *      German/English style rule is proven to still bite on fixtures.
 *  17. The kit tools and kit.json → tools agree BOTH ways; each tool's run file exists,
 *      provides only declared capabilities, answers --help, has a test and is documented.
 *  18. The site-config gate (check-site-config.mjs) passes its --selftest, so the rules
 *      over src/config/site.json and the index.html / og-image drift check still bite.
 *
 * Two rules hold throughout:
 *   - The registry indexes (base/standards, directives) are PARSED, not regexed. A
 *     registry that does not parse is a broken map, and reading it with a `file:` regex
 *     is how this gate once printed "harness intact" over an unparseable index.
 *   - An empty or missing input is a FAILURE, never a pass. A check that silently
 *     inspects nothing is worse than no check: it reports green for an absence.
 *
 * Dependency-free (Node core only) so it runs in CI without an install step — including
 * the strict index parser below, which is why no YAML library is imported here.
 * Later phases extend this (secret scan) — keep it fast.
 *
 * Usage:  node scripts/verify-harness.mjs                       (npm run verify:harness)
 *         node scripts/verify-harness.mjs --skip a.mjs,b.mjs    (caller runs those itself)
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AGENTS_LINE_CAP = 150;

// --- `--skip <gate.mjs,gate.mjs>` -------------------------------------------
// This harness spawns other gates (7, 7b, 7c, 9, 10). `npm run build:verify` runs three
// of the same ones itself, so the build chain passes `--skip` for those and the harness
// contributes only the checks nothing else performs (chiefly 11, the spec-orphan check).
// A skipped gate is reported as skipped, never as green.
const skipIdx = process.argv.indexOf('--skip');
const SKIPPED_GATES = new Set(
  skipIdx === -1
    ? []
    : (process.argv[skipIdx + 1] ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
);
const skipGate = (name) => SKIPPED_GATES.has(name);

const errors = [];
const ok = [];
// Skipped gates live in their own bucket. Counting them as green is how a report
// starts claiming coverage the run did not have — the exact failure mode this
// harness exists to catch elsewhere.
const skipped = [];

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));

// --- strict registry-index parser (no YAML dependency) ---------------------
// The two registry indexes (base/standards/index.yml, directives/index.yml) used to be
// read with a `/^\s*file:\s*(\S+)/` regex. A regex cannot tell a broken file from a
// healthy one: directives/index.yml sat unparseable for weeks — one summary was a plain
// scalar containing a colon-space — while this gate printed "harness intact" and
// `prettier` choked on the same file.
//
// This parses instead, and does it STRICTLY: it accepts only the narrow shape these
// registries actually use, and rejects any plain scalar carrying a construct YAML would
// reinterpret (`: `, ` #`, a leading indicator character). Strictness is the point — the
// accepted language is a subset of YAML, so anything this parser accepts is guaranteed
// to parse the same way in every real YAML reader, and the hazards that bite later are
// refused today rather than the day someone writes one.
//
// Deliberately no js-yaml: it is only a transitive dependency here (eslint ->
// @eslint/eslintrc -> js-yaml), so relying on it would tie this gate to another
// package's dependency choices, and importing it would break the "Node core only"
// property that lets the harness run before an install.
//
// Grammar (indent is significant, spaces only):
//   # comment | <blank>
//   key: value                      top level
//   key:                            top level, opens a sequence
//     - key: value                  sequence item, first field
//       key: value                  further fields
//       key: >-                     folded block scalar
//         continuation line
function parseRegistryIndex(rel) {
  const problems = [];
  const top = {};
  let collection = null; // { name, items }
  let entry = null;
  let block = null; // { entry, key, lines, indent }
  const at = (n) => `${rel}:${n}`;

  const plainValue = (raw, n, key) => {
    const v = raw.trim();
    if (v === '') {
      problems.push(`${at(n)}: "${key}:" has an empty value.`);
      return '';
    }
    if (v.startsWith('"')) {
      try {
        return JSON.parse(v);
      } catch {
        problems.push(`${at(n)}: "${key}:" opens a double-quoted scalar that does not close cleanly.`);
        return '';
      }
    }
    if (v.startsWith("'")) {
      problems.push(
        `${at(n)}: "${key}:" uses a single-quoted scalar; this registry uses plain, "double-quoted" or >- block scalars.`,
      );
      return v.slice(1, -1);
    }
    if (/:(\s|$)/.test(v)) {
      problems.push(
        `${at(n)}: "${key}:" is an unquoted scalar containing a colon — YAML reads that as a nested mapping and the file stops parsing. Use a >- block scalar.`,
      );
      return v;
    }
    if (/\s#/.test(v)) {
      problems.push(
        `${at(n)}: "${key}:" is an unquoted scalar containing " #" — YAML truncates it there as a comment. Use a >- block scalar.`,
      );
      return v;
    }
    if (/^[*&!%@`>|{}[\],?]/.test(v)) {
      problems.push(
        `${at(n)}: "${key}:" is an unquoted scalar starting with the YAML indicator "${v[0]}". Use a >- block scalar.`,
      );
      return v;
    }
    if (/^-\s/.test(v)) {
      problems.push(`${at(n)}: "${key}:" is an unquoted scalar starting with "- ". Use a >- block scalar.`);
      return v;
    }
    return v;
  };

  const closeBlock = () => {
    if (!block) return;
    if (block.lines.length === 0)
      problems.push(`${at(block.line)}: "${block.key}:" opens a block scalar with no content.`);
    block.entry[block.key] = block.lines.join(' ');
    block = null;
  };

  const lines = read(rel).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const n = i + 1;
    if (raw.includes('\t')) {
      problems.push(`${at(n)}: contains a TAB. YAML forbids tabs for indentation.`);
      continue;
    }
    if (block) {
      // A block scalar continues while lines are blank or indented past its key.
      if (raw.trim() === '') {
        continue;
      }
      if (/^ +/.test(raw) && raw.match(/^ */)[0].length > block.indent) {
        block.lines.push(raw.trim());
        continue;
      }
      closeBlock();
    }
    if (raw.trim() === '' || /^\s*#/.test(raw)) continue;
    const indent = raw.match(/^ */)[0].length;
    const body = raw.slice(indent);

    if (indent === 0) {
      const m = body.match(/^([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
      if (!m) {
        problems.push(`${at(n)}: not a top-level "key: value" or "key:" line.`);
        continue;
      }
      entry = null;
      if (m[2] === undefined || m[2].trim() === '') {
        collection = { name: m[1], items: [] };
        top[m[1]] = collection.items;
      } else {
        top[m[1]] = plainValue(m[2], n, m[1]);
      }
      continue;
    }
    if (indent === 2 && body.startsWith('- ')) {
      if (!collection) {
        problems.push(`${at(n)}: a sequence item appears before any collection key.`);
        continue;
      }
      const m = body.slice(2).match(/^([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
      if (!m) {
        problems.push(`${at(n)}: sequence item does not start with "key: value".`);
        continue;
      }
      entry = { __line: n };
      collection.items.push(entry);
      if (m[2] === undefined || m[2].trim() === '') {
        problems.push(`${at(n)}: "${m[1]}:" has no value.`);
      } else entry[m[1]] = plainValue(m[2], n, m[1]);
      continue;
    }
    if (indent === 4 && entry) {
      const m = body.match(/^([A-Za-z0-9_-]+):(?:\s+(.*))?$/);
      if (!m) {
        problems.push(`${at(n)}: not a "key: value" line inside a sequence item.`);
        continue;
      }
      const v = (m[2] ?? '').trim();
      if (v === '>-' || v === '>' || v === '|' || v === '|-') {
        block = { entry, key: m[1], lines: [], indent, line: n };
        entry.__blocks = entry.__blocks ?? new Set();
        entry.__blocks.add(m[1]);
      } else entry[m[1]] = plainValue(m[2] ?? '', n, m[1]);
      continue;
    }
    problems.push(`${at(n)}: unexpected indentation (${indent} spaces) — this registry nests 0 / 2 / 4 spaces only.`);
  }
  closeBlock();
  return { data: top, problems };
}

// Shared shape check for both registries: parse, require a non-empty collection, and
// require every summary to be a block scalar (the convention both index headers state).
function checkRegistryIndex(rel, collectionKey, requiredKeys) {
  const { data, problems } = parseRegistryIndex(rel);
  for (const p of problems) errors.push(p);
  const items = data[collectionKey];
  if (!Array.isArray(items) || items.length === 0) {
    errors.push(`${rel}: "${collectionKey}:" lists nothing — an empty registry is a broken map, not a pass.`);
    return [];
  }
  if (data.version === undefined) errors.push(`${rel}: no "version:" field.`);
  for (const it of items) {
    const missing = requiredKeys.filter((k) => it[k] === undefined);
    if (missing.length) errors.push(`${rel}:${it.__line}: entry "${it.id ?? '?'}" is missing ${missing.join(', ')}.`);
    if (it.summary !== undefined && !(it.__blocks && it.__blocks.has('summary'))) {
      errors.push(
        `${rel}:${it.__line}: entry "${it.id ?? '?'}" writes its summary as an inline scalar. This registry's convention is a ">-" block scalar (see the file header) — inline prose summaries are what broke this file before.`,
      );
    }
  }
  if (problems.length === 0) ok.push(`${rel} parses and is well-formed (${items.length} entries)`);
  return items;
}

// --- 1. Mandatory files ----------------------------------------------------
const MANDATORY = [
  'AGENTS.md',
  'CLAUDE.md',
  'kit.json',
  'base/README.md',
  'base/kit.schema.json',
  'base/standards/index.yml',
  'base/standards/SECURITY.md',
  'base/standards/A11Y.md',
  'base/standards/PRIVACY.md',
  'base/standards/QUALITY.md',
  'base/SAFETY.md',
  'base/BOOKKEEPING.md',
  'JOURNAL.md',
  'OPEN-QUESTIONS.md',
  'overrides/README.md',
  'specs/README.md',
  'docs/CONSTITUTION.MD',
  'directives/index.yml',
  // The second enforcement layer (ADR-0003). Without these two the harness still looks
  // healthy while every Red action runs unguarded — so their absence is a hard failure,
  // not a warning.
  '.claude/hooks/guard-red-actions.mjs',
  '.claude/settings.json',
];
for (const f of MANDATORY) {
  if (exists(f)) ok.push(`present: ${f}`);
  else errors.push(`MISSING mandatory harness file: ${f}`);
}

// --- 1b. safety hook is actually WIRED IN ----------------------------------
// A present hook file proves nothing: the enforcement layer is only live if
// settings.json registers it as a PreToolUse hook. Unhooking it (deleting the entry,
// pointing it elsewhere, matching nothing) is the silent failure this check exists for.
// Note this covers the Claude Code harness specifically — see base/SAFETY.md on why the
// second layer is agent-specific.
{
  const HOOK_REL = '.claude/hooks/guard-red-actions.mjs';
  const SETTINGS = '.claude/settings.json';
  if (exists(SETTINGS)) {
    try {
      const settings = JSON.parse(read(SETTINGS));
      const pre = settings?.hooks?.PreToolUse;
      if (!Array.isArray(pre) || pre.length === 0) {
        errors.push(`${SETTINGS} declares no PreToolUse hooks — the Red-action gate is not wired in (ADR-0003).`);
      } else {
        // Find a command hook whose command line mentions the guard.
        const entries = pre.flatMap((m) =>
          Array.isArray(m?.hooks) ? m.hooks.map((h) => ({ matcher: m.matcher, ...h })) : [],
        );
        const guard = entries.find(
          (h) => typeof h?.command === 'string' && /guard-red-actions(\.mjs)?/.test(h.command),
        );
        if (!guard) {
          errors.push(
            `${SETTINGS} has PreToolUse hooks, but none runs guard-red-actions — the Red-action gate is unwired (ADR-0003).`,
          );
        } else {
          // The matcher must still cover the tools the hook classifies. Bash is the one
          // that carries every irreversible command; Write/Edit carry the secret-file and
          // out-of-repo path rules; PowerShell is the Windows twin of Bash; MultiEdit and
          // NotebookEdit write files too; Read carries the secret-read rule; MCP servers
          // ship their own terminal and file tools under `mcp__<server>__<tool>`.
          //
          // The matcher is tested the way Claude Code applies it (code.claude.com/docs/en/
          // hooks, "Matcher patterns"): letters, digits, `_`, `-`, spaces, `,` and `|`
          // only -> an exact list; anything else -> an UNANCHORED JavaScript regex. So the
          // check asks whether real tool names MATCH, not whether a word appears in it.
          const matcher = String(guard.matcher ?? '');
          let covers;
          if (matcher === '' || matcher === '*') covers = () => true;
          else if (/^[\w\s,|-]*$/.test(matcher)) {
            const names = matcher.split(/[|,]/).map((s) => s.trim());
            covers = (t) => names.includes(t);
          } else {
            let re = null;
            try {
              re = new RegExp(matcher);
            } catch {
              /* reported below */
            }
            covers = (t) => !!re && re.test(t);
          }
          const MUST_COVER = [
            'Bash',
            'PowerShell',
            'Write',
            'Edit',
            'MultiEdit',
            'NotebookEdit',
            'Read',
            'mcp__webstorm__execute_terminal_command',
            'mcp__any_server__write_file',
          ];
          const uncovered = MUST_COVER.filter((t) => !covers(t));
          if (uncovered.length) {
            errors.push(
              `${SETTINGS}: the guard-red-actions PreToolUse matcher "${matcher}" does not cover ${uncovered.join(', ')} — those tool calls run unguarded.`,
            );
          } else {
            ok.push(
              'safety hook wired in (PreToolUse -> guard-red-actions, covers Bash/PowerShell/Write/Edit/MultiEdit/NotebookEdit/Read and MCP tools)',
            );
          }
        }
      }
      // Third layer: permission rules that refuse edits to the gate itself, which
      // hold even in bypassPermissions mode. The hook refuses the same writes; these make
      // sure a hook that fails to start does not leave the gate's own files open.
      const deny = Array.isArray(settings?.permissions?.deny) ? settings.permissions.deny : [];
      const MUST_DENY = [
        'Edit(/.claude/hooks/**)',
        'Edit(/.claude/settings.json)',
        'Edit(/.claude/settings.local.json)',
        'Edit(/.git/config)',
        'Edit(/.git/hooks/**)',
      ];
      const missingDeny = MUST_DENY.filter((r) => !deny.includes(r));
      if (missingDeny.length) {
        errors.push(
          `${SETTINGS}: permissions.deny is missing ${missingDeny.join(', ')} — the gate's own files are guarded by the hook alone (SEC-006).`,
        );
      } else {
        ok.push('gate files denied to Edit/Write in permissions.deny (hook, settings, .git/config, .git/hooks)');
      }
    } catch (e) {
      errors.push(`${SETTINGS} does not parse: ${e.message} — the Red-action gate cannot be verified.`);
    }
  }
  if (!exists(HOOK_REL)) {
    // Already reported as a missing mandatory file above; restate the consequence once,
    // because "a file is missing" and "nothing is enforcing Red actions" read differently.
    errors.push(
      'the PreToolUse safety hook is gone — Red actions (force-push, secret writes, deploys) are unenforced (ADR-0003).',
    );
  }
}

// --- 2. AGENTS.md line cap -------------------------------------------------
if (exists('AGENTS.md')) {
  const lines = read('AGENTS.md').split(/\r?\n/);
  // trailing newline produces one empty element; don't count it.
  const count = lines.length && lines[lines.length - 1] === '' ? lines.length - 1 : lines.length;
  if (count > AGENTS_LINE_CAP) {
    errors.push(`AGENTS.md is ${count} lines, over the ${AGENTS_LINE_CAP}-line cap. Link out, don't inline.`);
  } else {
    ok.push(`AGENTS.md within cap: ${count}/${AGENTS_LINE_CAP} lines`);
  }
}

// --- 3. CLAUDE.md wrapper still imports AGENTS.md --------------------------
if (exists('CLAUDE.md')) {
  if (/@AGENTS\.md/.test(read('CLAUDE.md'))) ok.push('CLAUDE.md imports @AGENTS.md');
  else errors.push('CLAUDE.md no longer imports @AGENTS.md — the wrapper was hollowed out.');
}

// --- 4. kit.json contract sanity ------------------------------------------
if (exists('kit.json')) {
  try {
    const kit = JSON.parse(read('kit.json'));
    for (const field of ['name', 'baseVersion', 'kitVersion', 'commands', 'healthChecks', 'capabilities']) {
      if (!(field in kit)) errors.push(`kit.json is missing required contract field: ${field}`);
    }
    for (const cmd of ['build', 'serve', 'test', 'lint']) {
      if (!kit.commands || !kit.commands[cmd]) errors.push(`kit.json commands.${cmd} is not declared.`);
    }
    if (!Array.isArray(kit.capabilities) || !kit.capabilities.includes('file:markdown')) {
      errors.push('kit.json capabilities must include the mandatory "file:markdown".');
    }
    // kitVersion names this kit's release and must equal package.json's version: unchecked,
    // the contract would go on stating a version the kit had long left behind. baseVersion is deliberately NOT checked here: it tracks the agent-system
    // layer on its own 0.x line, for the reason base/kit.schema.json gives.
    const pkgVersion = JSON.parse(read('package.json')).version;
    if (kit.kitVersion !== pkgVersion) {
      errors.push(
        `kit.json kitVersion is "${kit.kitVersion}" but package.json says "${pkgVersion}" — the contract names a release that does not exist.`,
      );
    }
    if (!errors.some((e) => e.startsWith('kit.json'))) ok.push('kit.json contract fields present');
  } catch (e) {
    errors.push(`kit.json does not parse: ${e.message}`);
  }
}

// --- 5. standards index <-> files -----------------------------------------
if (!exists('base/standards/index.yml')) {
  // Also reported as a missing mandatory file; restate it here so this section can
  // never be the one that quietly checks nothing.
  errors.push('base/standards/index.yml is missing — no standard can be verified.');
} else {
  const items = checkRegistryIndex('base/standards/index.yml', 'standards', ['id', 'file', 'summary']);
  for (const it of items) {
    const f = it.file;
    if (!f) continue;
    if (exists(f)) ok.push(`standard registered & present: ${f}`);
    else errors.push(`base/standards/index.yml lists ${f}, but it does not exist.`);
  }
}

// --- 6. skills carry required frontmatter ----------------------------------
// Convention (specs/2026-07-17-skill-system): <root>/<name>/SKILL.md with frontmatter
// name + description + layer (base|kit|pack). Two skill roots exist: the base skills
// under .claude/skills, and pack job-skills under packs/<id>/skills.
function checkSkill(skillPath, label) {
  if (!exists(skillPath)) {
    errors.push(`skill "${label}" has no SKILL.md.`);
    return;
  }
  const fm = read(skillPath).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    errors.push(`${skillPath}: no frontmatter block.`);
    return;
  }
  const missing = ['name', 'description', 'layer'].filter((k) => !new RegExp(`^${k}:`, 'm').test(fm[1]));
  if (missing.length) errors.push(`${skillPath}: frontmatter missing ${missing.join(', ')}.`);
  else if (!/^layer:\s*(base|kit|pack)\b/m.test(fm[1])) errors.push(`${skillPath}: layer must be base|kit|pack.`);
  else ok.push(`skill ok: ${label}`);
}
// A missing or empty skills root is a FAILURE. This block used to be wrapped in a bare
// `if (fs.existsSync(...))`, so deleting .claude/skills made the gate check zero skills
// and still print "harness intact" — the gate passed by finding nothing.
const SKILLS_DIR = path.join(ROOT, '.claude', 'skills');
if (!fs.existsSync(SKILLS_DIR)) {
  errors.push(
    '.claude/skills is missing — the base skill layer is gone, and zero skills would otherwise be "checked" silently.',
  );
} else {
  const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (skillDirs.length === 0)
    errors.push('.claude/skills contains no skills — an empty skill layer is a failure, not a pass.');
  for (const entry of skillDirs) checkSkill(path.join('.claude', 'skills', entry.name, 'SKILL.md'), entry.name);
}
// pack job-skills: packs/<id>/skills/<name>/SKILL.md
// packs/ is part of the map AGENTS.md hands an agent, so its absence is a failure too.
// A pack without a skills/ folder is fine (packs need not ship job-skills); a pack whose
// skills/ folder exists but is empty is not.
const PACKS_DIR = path.join(ROOT, 'packs');
if (!fs.existsSync(PACKS_DIR)) {
  errors.push(
    'packs/ is missing — AGENTS.md points agents at it, and its pack skills would otherwise go unchecked in silence.',
  );
} else {
  const packDirs = fs.readdirSync(PACKS_DIR, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (packDirs.length === 0) errors.push('packs/ contains no packs — an empty pack layer is a failure, not a pass.');
  for (const pack of packDirs) {
    const packSkills = path.join(PACKS_DIR, pack.name, 'skills');
    if (!fs.existsSync(packSkills)) continue;
    const entries = fs.readdirSync(packSkills, { withFileTypes: true }).filter((e) => e.isDirectory());
    if (entries.length === 0) {
      errors.push(`packs/${pack.name}/skills exists but is empty.`);
      continue;
    }
    for (const entry of entries) {
      checkSkill(path.join('packs', pack.name, 'skills', entry.name, 'SKILL.md'), `${pack.name}/${entry.name}`);
    }
  }
}

// --- 7. design-system self-maintenance gate (SPEC N5, D4) ------------------
// Spawn the dependency-free gate; a non-zero exit means the registry and the
// component tree have drifted (unlisted component, broken entry, dead exclusion).
{
  const gate = path.join('scripts', 'check-design-system.mjs');
  if (skipGate('check-design-system.mjs')) {
    skipped.push('design-system registry gate (--skip — the caller runs it itself)');
  } else if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate)], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('design-system registry gate green (check-design-system.mjs)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`design-system registry gate failed (check-design-system.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- 7b. design-guides self-maintenance gate (SPEC N5, Guides extension) ---
// The guide-article counterpart to check-design-system: registry <-> component
// files <-> canonical agent docs (frontmatter + mandatory sections) <-> routes.
{
  const gate = path.join('scripts', 'check-design-guides.mjs');
  if (skipGate('check-design-guides.mjs')) {
    skipped.push('design-guides gate (--skip — the caller runs it itself)');
  } else if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate)], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('design-guides gate green (check-design-guides.mjs)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`design-guides gate failed (check-design-guides.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- 7c. colour-contrast gate (SPEC D4) ------------------------------------
// The third design-system gate: WCAG SC 1.4.3 / 1.4.11 recomputed from the real token
// values, plus a freshness check on the compilat that guides cite. Spawned like its two
// siblings so the harness stays the single "is the system intact" answer — a gate that
// only runs inside build:verify is invisible to anyone checking harness health.
{
  const gate = path.join('scripts', 'check-contrast.mjs');
  if (skipGate('check-contrast.mjs')) {
    skipped.push('contrast gate (--skip — the caller runs it itself)');
  } else if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate)], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('contrast gate green (check-contrast.mjs)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`contrast gate failed (check-contrast.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- 8. directives index <-> files (missing + orphan) ----------------------
// A directive is durable know-how that guides work but doesn't gate. The index is
// its map (Principle 6): every listed file must exist, and every directive file must
// be listed — an unlisted directive is invisible to any agent reading only the index.
{
  const DIR = 'directives';
  const idxPath = `${DIR}/index.yml`;
  if (!exists(idxPath)) {
    errors.push(`${idxPath} is missing — no directive can be verified.`);
  } else {
    const items = checkRegistryIndex(idxPath, 'directives', ['id', 'file', 'layer', 'summary']);
    const listed = items.map((it) => it.file).filter(Boolean);
    for (const f of listed) {
      if (exists(f)) ok.push(`directive registered & present: ${f}`);
      else errors.push(`${idxPath} lists ${f}, but it does not exist.`);
    }
    // Orphan check — RECURSIVE. It used to be a flat readdirSync, which made the index's
    // own promise ("no directive file is left out") false for all 31 files under
    // directives/languages/: they sat unlisted and unnoticed in a subfolder.
    const listedSet = new Set(listed);
    const onDisk = [];
    const walkDir = (rel) => {
      for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
        const child = `${rel}/${e.name}`;
        if (e.isDirectory()) walkDir(child);
        else if (e.name.endsWith('.md')) onDisk.push(child);
      }
    };
    walkDir(DIR);
    if (onDisk.length === 0)
      errors.push(`${DIR}/ contains no directive files — an empty directives tree is a failure, not a pass.`);
    // The one documented exemption (see the index header): a language guide is
    // deliberately two files, and `<code>.setup.md` is the once-per-language companion
    // reached through `<code>.md`. It is exempt ONLY while that sibling exists and is
    // itself listed — otherwise the companion really is unreachable and must be reported.
    let exempt = 0;
    for (const f of onDisk) {
      if (listedSet.has(f)) continue;
      const sibling = f.replace(/\.setup\.md$/, '.md');
      if (sibling !== f && exists(sibling) && listedSet.has(sibling)) {
        exempt++;
        continue;
      }
      if (sibling !== f) {
        errors.push(
          `orphan directive not in ${idxPath}: ${f} — a ".setup.md" companion is only exempt while its guide ${sibling} exists and is listed, and it is not.`,
        );
        continue;
      }
      errors.push(`orphan directive not in ${idxPath}: ${f}`);
    }
    ok.push(
      `directives orphan check recursive over ${onDisk.length} files (${exempt} .setup.md companions covered by their listed guide)`,
    );
  }
}

// --- 9. pack-contract conformance gate -------------------------------------
// A pack is an optional role/workflow bundle layered on the kit. The gate proves
// each pack manifest is well-formed and kit-blind (every capability it needs is
// either provided by the kit or has a declared fallback). packs/ is optional, so
// only run when at least one pack exists.
if (exists('packs')) {
  const gate = path.join('scripts', 'check-packs.mjs');
  if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate)], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('pack-contract gate green (check-packs.mjs)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`pack-contract gate failed (check-packs.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- 10. bilingual user-facing-doc mirrors ---------------------------------
// User-facing docs ship bilingually (canonical source + translated mirror). The
// gate confirms every source has a mirror, tolerates PLACEHOLDER status, and flags
// a TRANSLATED mirror that drifted from its source. See docs/DOC-TRANSLATION.MD.
{
  const gate = path.join('scripts', 'check-doc-drift.mjs');
  if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate)], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('doc-translation mirror gate green (check-doc-drift.mjs)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`doc-translation mirror gate failed (check-doc-drift.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- 11. spec files are actually executed ----------------------------------
// angular.json's test target uses an EXPLICIT include allowlist: a .spec.ts that
// is not listed there is never run, and the suite stays green anyway — the most
// dangerous kind of gap, because it looks like coverage. Found the hard way by an
// agent whose new specs silently didn't run; see docs/how-to/add-a-page.md §6.
{
  const specs = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = dir + '/' + e.name;
      if (e.isDirectory()) walk(rel);
      else if (e.name.endsWith('.spec.ts')) specs.push(rel);
    }
  };
  walk('src');
  const ngJson = JSON.parse(read('angular.json'));
  const include = [
    ...Object.values(ngJson.projects ?? {}).flatMap(
      (p) => p.architect?.test?.options?.include ?? p.targets?.test?.options?.include ?? [],
    ),
  ];
  const includeSet = new Set(include);
  if (specs.length === 0)
    errors.push('no .spec.ts files found under src/ — a suite with nothing in it is a failure, not a pass.');
  if (include.length === 0) errors.push('angular.json declares an empty test.include allowlist — nothing would run.');
  const orphans = specs.filter((s) => !includeSet.has(s));
  if (orphans.length === 0 && specs.length > 0) {
    ok.push(`all ${specs.length} spec files registered in angular.json test.include`);
  } else {
    for (const o of orphans) errors.push(`spec file NOT in angular.json test.include (it never runs): ${o}`);
  }
  // The reverse direction. An entry left behind by a renamed or deleted spec matches no
  // file: the allowlist keeps looking complete while the coverage it names is gone, and
  // an explicit include list gives no "0 files matched" warning of its own.
  const onDisk = new Set(specs);
  const dead = include.filter((i) => !onDisk.has(i) && !exists(i));
  if (dead.length === 0 && include.length > 0) {
    ok.push(`all ${include.length} angular.json test.include entries exist on disk`);
  } else {
    for (const d of dead)
      errors.push(
        `angular.json test.include names a file that does not exist (dead allowlist entry — a renamed or deleted spec): ${d}`,
      );
  }
}

// --- 12. no literal C0 control bytes in source text ------------------------
// A literal control byte (NUL, ESC, ...) in a source file makes grep and git treat
// the whole file as binary, so searches run into silence — found the hard way when
// three NUL separators in highlighting.service.ts hid the file from every scan
// (fixed 2026-08-20 as escape sequences, behaviour-identical). Tab/LF/CR are the
// only C0 bytes with a legitimate place in text; everything else must be an escape.
{
  const TEXT_EXT = new Set([
    '.ts',
    '.html',
    '.scss',
    '.css',
    '.js',
    '.mjs',
    '.json',
    '.md',
    '.yml',
    '.yaml',
    '.svg',
    '.txt',
  ]);
  let scanned = 0;
  const offenders = [];
  const scan = (dir) => {
    for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = dir + '/' + e.name;
      if (e.isDirectory()) {
        scan(rel);
        continue;
      }
      if (!TEXT_EXT.has(path.extname(e.name).toLowerCase())) continue;
      scanned++;
      const buf = fs.readFileSync(path.join(ROOT, rel));
      for (let i = 0; i < buf.length; i++) {
        const b = buf[i];
        if (b < 0x20 && b !== 0x09 && b !== 0x0a && b !== 0x0d) {
          offenders.push(`${rel} (byte 0x${b.toString(16).padStart(2, '0')} at offset ${i})`);
          break; // one report per file is enough to act on
        }
      }
    }
  };
  scan('src');
  scan('scripts');
  if (scanned === 0) {
    errors.push(
      'the C0 control-byte scan found no source text files to scan — an empty scan is a failure, not a pass.',
    );
  } else if (offenders.length === 0) {
    ok.push(`no literal C0 control bytes in ${scanned} source text files`);
  } else {
    for (const o of offenders)
      errors.push(
        `literal C0 control byte in source (grep/git will treat the file as binary — use an escape sequence): ${o}`,
      );
  }
}

// --- 13. AGENTS.md cross-link integrity ------------------------------------
// AGENTS.md is a map, not an encyclopedia — which means its value is entirely in its
// links. The MANDATORY list above is hand-maintained and drifted from it: five targets
// AGENTS.md points at (docs/explanation/the-pack-layer.md, docs/how-to/add-a-page.md,
// directives/stewardship.md, docs/DOC-TRANSLATION.MD, README.md) were in no list at all,
// so deleting one left the gate printing "harness intact" over a broken entry point.
// Derive the list from the document instead of restating it: every relative markdown
// link target must resolve. (Header phase "cross-link integrity", now implemented.)
if (exists('AGENTS.md')) {
  const md = read('AGENTS.md');
  const targets = new Set();
  for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) {
    const t = m[1].split('#')[0].trim();
    if (!t) continue; // pure in-page anchor
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(t)) continue; // http(s):, mailto:, ...
    targets.add(t);
  }
  if (targets.size === 0) {
    errors.push('AGENTS.md contains no relative links — the map lost its pointers (or this check stopped matching).');
  } else {
    const broken = [...targets].filter((t) => !exists(decodeURIComponent(t)));
    if (broken.length === 0) ok.push(`all ${targets.size} AGENTS.md link targets resolve`);
    else
      for (const b of broken)
        errors.push(`AGENTS.md links to ${b}, which does not exist — the map's entry point is broken.`);
  }
}

// --- 14. imprint gate self-test --------------------------------------------
// check-imprint.mjs runs for real inside verify-build.js, where on a kit checkout it
// is advisory (no real domain set) — so a broken pattern would stay invisible until
// someone deploys. Its --selftest proves the patterns and the domain rule on fixtures.
{
  const gate = path.join('scripts', 'check-imprint.mjs');
  if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate), '--selftest'], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('imprint gate self-test green (check-imprint.mjs --selftest)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`imprint gate self-test failed (check-imprint.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- 15. override mechanic self-test ---------------------------------------
// overrides/ is empty on a kit checkout, so the path where a valid override turns a gate
// advisory never runs for real. The --selftest builds a fixture repo and proves both
// directions: a valid override relaxes, an absent / expired / malformed / [hard] one
// does not — and that each gate listed as honouring an override really calls the module.
{
  const helper = path.join('scripts', 'lib', 'overrides.mjs');
  if (exists(helper)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, helper), '--selftest'], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('override mechanic self-test green (scripts/lib/overrides.mjs --selftest)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`override mechanic self-test failed (scripts/lib/overrides.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING override helper: ${helper}`);
  }
}

// --- 16. house-style gate self-test ----------------------------------------
// check-house-style.mjs runs for real in `build:verify`. The tree it checks is clean, so
// a rule that stopped matching (a broken regex, a too-wide exception) would still print
// PASS. Its --selftest proves every rule on fixtures that must fail and must pass.
{
  const gate = path.join('scripts', 'check-house-style.mjs');
  if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate), '--selftest'], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('house-style gate self-test green (check-house-style.mjs --selftest)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`house-style gate self-test failed (check-house-style.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- 17. kit tools registered both ways -------------------------------------
// The kit tools (tools/*.mjs) are found through kit.json → tools, so a tool missing from
// the registry is invisible to every skill, and an entry without its file sends a skill
// to a command that does not exist. Both directions are checked, plus what makes a tool
// usable: its `provides` ids are declared capabilities, it answers --help (exit 0, within
// 5 s, before any browser starts), it has a test, and tools/README.md documents it.
// tools/index.mjs is the list itself, not a tool. An empty side is a failure, not a pass.
{
  const before = errors.length;
  let kitTools = null;
  let kitCaps = [];
  try {
    const kit = JSON.parse(read('kit.json'));
    kitTools = kit.tools;
    kitCaps = kit.capabilities || [];
  } catch {
    /* check 4 reports an unparseable kit.json */
  }
  const files = exists('tools')
    ? fs
        .readdirSync(path.join(ROOT, 'tools'))
        .filter((f) => f.endsWith('.mjs') && f !== 'index.mjs')
        .map((f) => f.replace(/\.mjs$/, ''))
        .sort()
    : [];
  if (!Array.isArray(kitTools) || kitTools.length === 0) {
    errors.push('kit.json declares no tools — the kit tools (tools/*.mjs) are unreachable for skills.');
  } else if (files.length === 0) {
    errors.push('kit.json registers tools but tools/ holds no tool file.');
  } else {
    const ids = kitTools.map((t) => t.id);
    for (const f of files) if (!ids.includes(f)) errors.push(`tools/${f}.mjs is not registered in kit.json → tools.`);
    const readme = exists('tools/README.md') ? read('tools/README.md') : '';
    if (!readme) errors.push('MISSING tools/README.md (the agent reference for the kit tools).');
    for (const t of kitTools) {
      const m = /^node (tools\/[a-z0-9-]+\.mjs)$/.exec(t.run || '');
      if (!m || !exists(m[1])) {
        errors.push(`kit.json tool "${t.id}": run "${t.run}" is not "node tools/<file>.mjs" of an existing file.`);
        continue;
      }
      for (const cap of t.provides || []) {
        if (!kitCaps.includes(cap))
          errors.push(`kit.json tool "${t.id}" provides "${cap}", which is not in capabilities.`);
      }
      if (!exists(`tools/test/${t.id}.test.mjs`))
        errors.push(`kit tool "${t.id}" has no test (tools/test/${t.id}.test.mjs).`);
      if (readme && !new RegExp(`\\b${t.id}\\b`).test(readme))
        errors.push(`tools/README.md does not document the tool "${t.id}".`);
      const res = spawnSync(process.execPath, [path.join(ROOT, m[1]), '--help'], { encoding: 'utf8', timeout: 5000 });
      if (res.status !== 0) {
        errors.push(
          `kit tool "${t.id}" does not answer --help with exit 0 within 5 s (exit ${res.status ?? 'timeout'}).`,
        );
      }
    }
  }
  if (errors.length === before) ok.push(`kit tools registered both ways (${files.length} tool(s))`);
}

// --- 18. site-config gate self-test -----------------------------------------
// check-site-config.mjs runs for real in `build:verify`, on the kit's own site.json,
// which is valid and in step with index.html — so a rule that stopped biting (a start
// page that is a redirect, a renamed site whose preview image still says the old name)
// would still print PASS. Its --selftest proves each rule on fixtures.
{
  const gate = path.join('scripts', 'check-site-config.mjs');
  if (exists(gate)) {
    const res = spawnSync(process.execPath, [path.join(ROOT, gate), '--selftest'], { encoding: 'utf8' });
    if (res.status === 0) {
      ok.push('site-config gate self-test green (check-site-config.mjs --selftest)');
    } else {
      const tail = (res.stdout || '')
        .split(/\r?\n/)
        .filter((l) => /FAIL/.test(l))
        .join(' | ');
      errors.push(`site-config gate self-test failed (check-site-config.mjs)${tail ? ': ' + tail : ''}`);
    }
  } else {
    errors.push(`MISSING gate script: ${gate}`);
  }
}

// --- Report ----------------------------------------------------------------
const line = '='.repeat(66);
console.log(line);
console.log('  verify-harness — agent-system integrity');
console.log(line);
if (process.env.VERBOSE) for (const s of ok) console.log('  ok   ' + s);
for (const s of skipped) console.log('  skip ' + s);
if (errors.length === 0) {
  const tally = `${ok.length} checks green${skipped.length ? `, ${skipped.length} skipped` : ''}`;
  console.log(`  PASS — ${tally}, harness intact.`);
  console.log(line);
  process.exit(0);
}
for (const e of errors) console.log('  FAIL ' + e);
console.log(line);
console.log(`  ${errors.length} problem(s). Fix before shipping.`);
process.exit(1);
