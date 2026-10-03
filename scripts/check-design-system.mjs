#!/usr/bin/env node
/**
 * check-design-system — the design-system self-maintenance gate (SPEC N5, D4;
 * amended in N5.2).
 *
 * Fails (exit 1) when the registry and the component tree have drifted:
 *   1. A `*.component.ts` under src/app/components/** is in NEITHER
 *      design-registry.ts NOR design-registry.exclusions.json (unlisted).
 *   2. A registry entry lacks its component file, its canonical doc, or tags.
 *   3. An exclusions.json entry points at a component file that no longer exists.
 *   4. A component is listed in BOTH the registry and the exclusions (ambiguous).
 *   5. A registry slug has no live demo — i.e. no `@case ('<slug>')` in
 *      src/app/dev/demo-host.component.ts (added in N5.2).
 *   6. A kit doc (`src/assets/design-system/<slug>.md`) does not carry the six
 *      mandatory sections, in order, as `##` headings.
 *   7. A slug's `@case ('<slug>')` markup and its `DEMO_SNIPPETS['<slug>']`
 *      string have drifted apart.
 *
 * Effect: adding a component forces a conscious "reusable? -> registry, else
 * exclusion" decision, and a registered component forces a matching live demo,
 * or the build breaks.
 *
 * Check 6 exists because existence was the only thing checked about a kit doc.
 * The CLI (`design-guides.mjs`) harvests kit docs BY HEADING — `sections "when
 * to use"` pulls that one section out of every doc in one call, and `topics`
 * advertises the first doc's headings as THE kit section list. A doc that
 * renamed a heading would drop out of those harvests silently: no error, just an
 * answer with a hole in it, and an agent reading the hole as "not documented".
 * The rule below is calibrated on the corpus, not guessed: all 18 docs carry the
 * six headings with identical wording, identical case and identical order, so
 * that is what is enforced. Comparison is case-insensitive (the CLI's own
 * heading lookup is), spelling and order are not.
 *
 * Check 7 closes the last hand-kept contract in this file's neighbourhood. The
 * detail page renders the live demo from `@case ('<slug>')` and shows
 * `DEMO_SNIPPETS['<slug>']` beside it as the copyable source — two texts that
 * are only equal because someone remembers to edit both. Documentation that
 * shows different markup from what the reader sees rendered is worse than none:
 * they copy it, it behaves differently, and the kit taught them something false.
 *
 * NORMALISATION (deliberate, and the whole design of the check): both sides are
 * compared with every run of whitespace — spaces, tabs, newlines — collapsed to
 * a single space, then trimmed. Formatting is therefore free: the `@case` body
 * sits eight levels deep in a template while the snippet starts at column 0, and
 * either may re-wrap its attributes at any time without the gate noticing. Only
 * the TOKENS are compared, so any real divergence — a renamed input, a changed
 * literal, a dropped attribute, an element that exists on one side only — fails.
 * The one thing this deliberately does NOT police is whitespace inside a text
 * node or an attribute value; a snippet whose only difference is a double space
 * misleads no one.
 *
 * Dependency-free (Node core only), so it runs in CI without an install step and
 * matches scripts/verify-harness.mjs. It parses design-registry.ts as TEXT (no
 * ts-node): the file keeps a fixed field order per entry
 * (slug, name, selector, tags, docPath, sourcePath) exactly so this regex can
 * read it (the former `load` dynamic-import field was replaced by `sourcePath`
 * in N5.2 — the live demo now lives in demo-host.component.ts).
 *
 * Usage:  node scripts/check-design-system.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'app', 'components');
const DEV_DIR = path.join(ROOT, 'src', 'app', 'dev');
const REGISTRY_FILE = path.join(DEV_DIR, 'design-registry.ts');
const EXCLUSIONS_FILE = path.join(DEV_DIR, 'design-registry.exclusions.json');
const DEMO_HOST_FILE = path.join(DEV_DIR, 'demo-host.component.ts');
const KIT_DOCS_DIR = path.join(ROOT, 'src', 'assets', 'design-system');

/**
 * The kit doc's content model, in canonical order (`docs/DESIGN-SYSTEM.MD`).
 * Distinct from the guide docs' nine sections, which `check-design-guides.mjs`
 * enforces — two content models, one query surface.
 */
const KIT_DOC_SECTIONS = ['Purpose', 'When to use', 'When not to use', 'API', 'Example', 'Accessibility'];

const errors = [];
const ok = [];

const toPosix = (p) => p.split(path.sep).join('/');

/** All *.component.ts (not *.spec.ts) under components/, as posix paths relative to COMPONENTS_DIR. */
function listComponentFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listComponentFiles(abs));
    } else if (entry.name.endsWith('.component.ts') && !entry.name.endsWith('.spec.ts')) {
      out.push(toPosix(path.relative(COMPONENTS_DIR, abs)));
    }
  }
  return out;
}

/** Parse registry entries from source text (fixed field order per PARSER CONTRACT). */
function parseRegistry(src) {
  const entries = [];
  const re =
    /slug:\s*'([^']+)'[\s\S]*?tags:\s*\[([^\]]*)\][\s\S]*?docPath:\s*'([^']+)'[\s\S]*?sourcePath:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const [, slug, tagsRaw, docPath, sourcePath] = m;
    const tags = tagsRaw
      .split(',')
      .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
    entries.push({ slug, tags, docPath, sourcePath });
  }
  return entries;
}

/** Resolve a repo-relative `sourcePath` to a posix path relative to COMPONENTS_DIR. */
function sourcePathToRel(sourcePath) {
  return toPosix(path.relative(COMPONENTS_DIR, path.join(ROOT, sourcePath)));
}

// --- Gather inputs ---------------------------------------------------------
if (!fs.existsSync(COMPONENTS_DIR)) {
  console.error(`FAIL  components dir not found: ${COMPONENTS_DIR}`);
  process.exit(1);
}
if (!fs.existsSync(REGISTRY_FILE)) {
  console.error(`FAIL  registry not found: ${REGISTRY_FILE}`);
  process.exit(1);
}
if (!fs.existsSync(EXCLUSIONS_FILE)) {
  console.error(`FAIL  exclusions not found: ${EXCLUSIONS_FILE}`);
  process.exit(1);
}
if (!fs.existsSync(DEMO_HOST_FILE)) {
  console.error(`FAIL  demo host not found: ${DEMO_HOST_FILE}`);
  process.exit(1);
}

const allComponents = listComponentFiles(COMPONENTS_DIR).sort();
const registry = parseRegistry(fs.readFileSync(REGISTRY_FILE, 'utf8'));
const demoHostSrc = fs.readFileSync(DEMO_HOST_FILE, 'utf8');

let exclusions;
try {
  exclusions = JSON.parse(fs.readFileSync(EXCLUSIONS_FILE, 'utf8'));
} catch (e) {
  console.error(`FAIL  exclusions.json does not parse: ${e.message}`);
  process.exit(1);
}
const exclusionKeys = Object.keys(exclusions).filter((k) => !k.startsWith('_'));

const registeredRel = new Set();
for (const entry of registry) registeredRel.add(sourcePathToRel(entry.sourcePath));
const excludedRel = new Set(exclusionKeys);

if (registry.length === 0)
  errors.push('design-registry.ts: no entries parsed — check the field order / parser contract.');

// --- Check 2: every registry entry is well-formed --------------------------
for (const entry of registry) {
  const compAbs = path.join(ROOT, entry.sourcePath);
  if (!fs.existsSync(compAbs)) {
    errors.push(`registry "${entry.slug}": component file missing — ${entry.sourcePath}`);
  }
  const docAbs = path.join(ROOT, 'src', entry.docPath); // docPath is browser-asset URL: assets/... -> src/assets/...
  if (!fs.existsSync(docAbs)) {
    errors.push(`registry "${entry.slug}": doc missing — src/${entry.docPath}`);
  }
  if (!entry.tags || entry.tags.length === 0) {
    errors.push(`registry "${entry.slug}": tags are empty.`);
  }
}
if (!errors.some((e) => e.startsWith('registry '))) ok.push(`registry entries valid: ${registry.length}`);

// --- Check 5: every registry slug has a live demo @case --------------------
// Text scan of demo-host.component.ts — a registry entry without a matching
// `@case ('<slug>')` fails the gate (single OR double quotes accepted).
const missingDemos = registry
  .filter((entry) => !new RegExp(`@case\\s*\\(\\s*['"]${entry.slug}['"]\\s*\\)`).test(demoHostSrc))
  .map((entry) => entry.slug);
if (missingDemos.length) {
  errors.push(
    `${missingDemos.length} registry slug(s) have no @case in demo-host.component.ts ` +
      `(add a live demo): ${missingDemos.join(', ')}`,
  );
} else {
  ok.push(`live demos present: ${registry.length} @case blocks in demo-host.component.ts`);
}

// --- Check 6: every kit doc carries the six mandatory sections -------------
// Scanned from disk rather than from the registry so an orphan doc is covered
// too. `guides/` is a directory, not a `.md`, so the guide layer stays out —
// its docs answer to a different content model and a different gate.
function kitDocHeadings(raw) {
  return [...raw.matchAll(/^##\s+(.*)$/gm)].map((m) => m[1].trim());
}

/** Missing / misordered sections of one kit doc, as human sentences. */
function kitDocSectionProblems(raw) {
  const found = kitDocHeadings(raw).map((h) => h.toLowerCase());
  const want = KIT_DOC_SECTIONS.map((s) => s.toLowerCase());
  const missing = KIT_DOC_SECTIONS.filter((s) => !found.includes(s.toLowerCase()));
  if (missing.length) {
    return [
      `missing section(s): ${missing.join(', ')} — the CLI harvests kit docs BY HEADING, ` +
        'so a renamed one drops out of `sections` and `topics` in silence',
    ];
  }
  // All six are present; now they must appear in the canonical order, because
  // `topics` presents one doc's heading list as the kit's section model.
  const positions = want.map((s) => found.indexOf(s));
  const ordered = positions.every((p, i) => i === 0 || p > positions[i - 1]);
  return ordered ? [] : [`sections out of order — the kit content model is ${KIT_DOC_SECTIONS.join(' · ')}`];
}

// Silent-pass guard: this whole check used to be skipped — no error, no "ok" —
// whenever KIT_DOCS_DIR didn't exist, and would report "structurally complete"
// over 0 docs if it existed but was empty. Both are "found nothing, called it
// clean"; check 6 is meant to run over all 18 kit docs every time.
if (!fs.existsSync(KIT_DOCS_DIR)) {
  errors.push(`kit docs dir not found: ${KIT_DOCS_DIR} — check 6 (mandatory sections) could not run.`);
} else {
  const kitDocs = fs
    .readdirSync(KIT_DOCS_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => e.name)
    .sort();
  if (kitDocs.length === 0) {
    errors.push(`kit docs dir ${KIT_DOCS_DIR} has 0 .md files — check 6 (mandatory sections) scanned nothing.`);
  } else {
    let malformed = 0;
    for (const name of kitDocs) {
      const problems = kitDocSectionProblems(fs.readFileSync(path.join(KIT_DOCS_DIR, name), 'utf8'));
      for (const p of problems) {
        malformed++;
        errors.push(`kit doc "${name}": ${p}.`);
      }
    }
    if (!malformed) ok.push(`kit docs structurally complete: ${kitDocs.length} × ${KIT_DOC_SECTIONS.length} sections`);
  }
}

// --- Check 7: @case markup and DEMO_SNIPPETS say the same thing ------------
// Both parses are string slicing, not an Angular/TS parse — the zero-dependency
// rule holds here as it does in design-guides.mjs.

const BACKTICK = String.fromCharCode(96);
const BACKSLASH = String.fromCharCode(92);

/** Whitespace-insensitive comparison form — see NORMALISATION in the header. */
const normaliseMarkup = (s) => s.replace(/\s+/g, ' ').trim();

/**
 * The body of `@case ('<slug>') { … }`, or null when it cannot be sliced.
 *
 * Depth counting skips double-quoted attribute values wholesale, because those
 * are full of braces (`[config]="{ type: 'info' }"`). Apostrophes are NOT
 * treated as delimiters at markup level — an apostrophe in prose ("don't") is
 * ordinary text, and the braces that matter never live inside one.
 */
function caseBody(src, slug) {
  const open = new RegExp(`@case\\s*\\(\\s*['"]${slug}['"]\\s*\\)\\s*\\{`).exec(src);
  if (!open) return null;
  const start = open.index + open[0].length;
  let i = start;
  let depth = 1;
  while (i < src.length) {
    const c = src[i];
    if (c === '"') {
      i = src.indexOf('"', i + 1);
      if (i < 0) return null;
      i++;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return src.slice(start, i);
    i++;
  }
  return null;
}

/** `DEMO_SNIPPETS` as a slug -> template-literal-body map. */
function parseSnippets(src) {
  const out = new Map();
  const at = src.indexOf('export const DEMO_SNIPPETS');
  if (at < 0) return out;
  const key = /'([^']+)'\s*:\s*/g;
  key.lastIndex = at;
  let m;
  while ((m = key.exec(src)) !== null) {
    let i = key.lastIndex;
    if (src[i] !== BACKTICK) continue; // not a snippet entry
    const start = ++i;
    while (i < src.length && src[i] !== BACKTICK) i += src[i] === BACKSLASH ? 2 : 1;
    out.set(m[1], src.slice(start, i));
    key.lastIndex = i + 1;
  }
  return out;
}

/** The first token that differs, with a little context on both sides. */
function firstDivergence(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const window = (s) => (i > 30 ? '…' : '') + s.slice(Math.max(0, i - 30), i + 40) + (i + 40 < s.length ? '…' : '');
  return { markup: window(a), snippet: window(b) };
}

{
  const snippets = parseSnippets(demoHostSrc);
  const drifted = [];
  for (const entry of registry) {
    const snippet = snippets.get(entry.slug);
    if (snippet === undefined) {
      drifted.push(`registry "${entry.slug}": no DEMO_SNIPPETS['${entry.slug}'] entry in demo-host.component.ts.`);
      continue;
    }
    const body = caseBody(demoHostSrc, entry.slug);
    if (body === null) {
      drifted.push(
        `registry "${entry.slug}": the @case block cannot be sliced — unbalanced braces in demo-host.component.ts.`,
      );
      continue;
    }
    const a = normaliseMarkup(body);
    const b = normaliseMarkup(snippet);
    if (a !== b) {
      const d = firstDivergence(a, b);
      drifted.push(
        `registry "${entry.slug}": the @case markup and DEMO_SNIPPETS have drifted apart —\n` +
          `         rendered: ${d.markup}\n` +
          `         snippet : ${d.snippet}\n` +
          '         The snippet documents the demo, so bring the snippet to the markup.',
      );
    }
  }
  const orphans = [...snippets.keys()].filter((s) => !registry.some((e) => e.slug === s));
  if (orphans.length) drifted.push(`DEMO_SNIPPETS has entr(ies) for no registry slug: ${orphans.join(', ')}`);
  for (const d of drifted) errors.push(d);
  if (!drifted.length) ok.push(`demo snippets in sync: ${snippets.size} @case blocks match their DEMO_SNIPPETS`);
}

// --- Check 3: every exclusion points at a real file ------------------------
const deadExclusions = exclusionKeys.filter((k) => !fs.existsSync(path.join(COMPONENTS_DIR, k)));
if (deadExclusions.length) {
  errors.push(`exclusions.json points at ${deadExclusions.length} deleted file(s): ${deadExclusions.join(', ')}`);
} else {
  ok.push(`exclusions valid: ${exclusionKeys.length}`);
}

// --- Check 4: no component in both sets ------------------------------------
const inBoth = [...registeredRel].filter((r) => excludedRel.has(r));
if (inBoth.length) {
  errors.push(`listed in BOTH registry and exclusions: ${inBoth.join(', ')}`);
}

// Silent-pass guard: if listComponentFiles ever stopped matching real files (a
// changed extension convention, a broken recursion, COMPONENTS_DIR resolving
// somewhere near-empty) the "every component is listed somewhere" check below
// is vacuously true over an empty list — 0 unlisted, reported as "coverage
// complete". Rule out that shape before trusting an empty unlisted[].
if (allComponents.length === 0) {
  errors.push(`listComponentFiles(${COMPONENTS_DIR}) found 0 component files — the scan is broken, not the coverage.`);
}

// --- Check 1: every component is listed somewhere --------------------------
const unlisted = allComponents.filter((c) => !registeredRel.has(c) && !excludedRel.has(c));
if (unlisted.length) {
  errors.push(
    `${unlisted.length} component(s) in neither registry nor exclusions ` +
      `(add to design-registry.ts or design-registry.exclusions.json): ${unlisted.join(', ')}`,
  );
} else {
  ok.push(
    `coverage complete: ${allComponents.length} components (${registeredRel.size} registered, ${excludedRel.size} excluded)`,
  );
}

// --- Report ----------------------------------------------------------------
const line = '='.repeat(66);
console.log(line);
console.log('  check-design-system — registry / component coverage');
console.log(line);
if (process.env.VERBOSE) for (const s of ok) console.log('  ok   ' + s);
if (errors.length === 0) {
  console.log(`  PASS — ${ok.length} checks green; ${allComponents.length} components fully accounted for.`);
  console.log(line);
  process.exit(0);
}
for (const e of errors) console.log('  FAIL ' + e);
console.log(line);
console.log(`  ${errors.length} problem(s). Fix before shipping.`);
process.exit(1);
