#!/usr/bin/env node
/**
 * design-guides — the agent CLI for the design system (SPEC N5, Guides
 * extension; query layer added 2026-08).
 *
 * A token-cheap way for an agent to consult the design system without loading a
 * page or the app. Two layers, one query surface:
 *
 *   - GUIDES  `src/assets/design-system/guides/*.agent.md` (+ the article tabs
 *     behind them) — how to wield a library/layout building block.
 *   - KIT     `src/assets/design-system/*.md` — the kit's own reusable
 *     primitives, one canonical doc each.
 *
 * The two CONTENT models stay separate (a kit doc is `Purpose · When to use ·
 * When not to use · API · Example · Accessibility`; a guide doc is the nine
 * mandatory sections). Only the QUERY surface is unified: `--layer` on
 * list/show/section/sections, `--scope` on search.
 *
 * The agent doc is the CONTRACT: what an agent must always know, small enough to
 * keep loaded. The article tabs are the ENCYCLOPAEDIA: token derivations,
 * measurement tables, i18n mechanics — depth an agent pulls only when the task
 * touches that ground. `tab` is how it pulls one, and each doc's `tabs:`
 * frontmatter says what is in each (`list --json` exposes the whole mapping).
 *
 * Each guide also carries `measured-against: <package>@<version>` — the shipped
 * build its line numbers and dead-API findings were read off. `topics` shows the
 * corpus-wide pin (and any split, which is the interesting case); `list --json`
 * carries it per guide, so "is this still measured against what we ship" is one
 * call against package.json rather than twenty documents read by hand.
 *
 * And `covers: [<entrypoint>, …]` — the library components the guide EXPLAINS
 * (contract, keyboard, tokens), not the ones it merely routes to. `coverage`
 * counts the corpus against the installed library's `exports` from that field
 * alone, and the gate's byte ceiling grows with the list: a guide carrying three
 * components' contracts gets three components' room.
 *
 * Dependency-free (Node core only), matching scripts/verify-harness.mjs and
 * scripts/check-design-system.mjs — no install step, runs anywhere Node runs.
 *
 * Read in four graded steps — never read everything:
 *   1. MAP        `topics`                     what exists at all, both layers
 *   2. CROSS-CUT  `sections` `blocks` `search` one heading / block type / term
 *                                              across every guide, in ONE call
 *   3. ONE TOPIC  `section` `bundle`           a guide and its related closure
 *   4. DEPTH      `show` `tab`                 the full contract, one tab body
 *
 * Usage:
 *   design-guides topics                                   Coverage map: categories, tab inventory, both layers
 *   design-guides coverage [--json]                        Library components the guides explain (`covers:`), and the ones none does
 *   design-guides list [--json] [--layer L] [--tag T]      Compact table: id · category · tags · related · summary
 *   design-guides show <id> [--layer L]                    The full doc (guide agent doc or kit doc)
 *   design-guides section <id> <heading> [--json] [--layer L]   One "## <heading>" section of one doc
 *   design-guides sections <heading> [--json] [--layer L] [--tag T]   That heading across EVERY doc — one call
 *   design-guides blocks <type> [--json] [--tag T] [--brief]   Typed block harvest across every article (see BLOCK_TYPES)
 *   design-guides bundle <id> [--depth N] [--include-tabs] [--json]   A guide + its related closure
 *   design-guides tab <id> <tab> [--raw]                   One article tab body, interpolations resolved
 *   design-guides search <term> [--scope S] [--limit N] [--json]      Search docs + tabs + kit
 *
 *   L = guides | kit | all      S = docs | tabs | kit | all      T = a frontmatter tag
 *
 * `bundle --include-tabs` adds each related guide's `tabs:` pointer map — the
 * curated line per tab that says what is IN it — NOT the tab bodies. The bodies
 * are the expensive part and are fetched one at a time with `tab <id> <tab>`,
 * which is the escalation the pointer map exists to inform.
 *
 * Unknown commands, flags and flag values are rejected with a non-zero exit — a
 * silently ignored flag is worse than a rejected one, because the agent reads
 * the unfiltered result as an answer. To search for a term that begins with
 * dashes, end the flags first: `search -- --primary-color`.
 *
 * `tab` resolves interpolations by TEXT-PARSING the component's own string
 * constants (`readonly m = { … }`, `readonly rtlSnippet = \`…\``): flat string
 * literals, template literals without `${}`, and `'a' + 'b'` concatenations.
 * Anything computed at runtime (signals, `@for` loop variables, ternaries) stays
 * as written and is counted on stderr. Still string slicing, not an Angular
 * parse — the zero-dependency rule is intact. `--raw` restores the old verbatim
 * output.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GUIDES_DIR = path.join(ROOT, 'src', 'assets', 'design-system', 'guides');
const KIT_DIR = path.join(ROOT, 'src', 'assets', 'design-system');
const ARTICLES_DIR = path.join(ROOT, 'src', 'app', 'dev', 'articles');
const REGISTRY_FILE = path.join(ARTICLES_DIR, 'article-registry.ts');

/** A related id may name a guide that is not built yet, marked by this prefix. */
export const PLANNED_PREFIX = 'planned:';

// --- The library's component inventory -------------------------------------
// `covers:` in a guide's frontmatter names the library components the guide
// EXPLAINS — contract, keyboard, tokens — as entrypoint names of the package
// (`badge`, `overlaybadge`, `treetable`). Two things hang off it: the gate's
// byte ceiling grows with the list's length, and `coverage` counts the corpus
// against the library from the guides themselves instead of a hand-kept table.

/** The package the `library` guides are about; its `exports` map is the inventory. */
export const LIBRARY_PACKAGE = '@openng/optimus-ui';

/**
 * Entrypoints of LIBRARY_PACKAGE that are NOT components, and the rule that
 * decides it — one a reader can apply to an export this list has never seen:
 *
 *   An entrypoint COUNTS as a component when an application author writes it
 *   into their own template for behaviour of its own: a widget element
 *   (`p-listbox`, `p-scroller`) or a directive attribute that gives an element
 *   the author owns its own interaction contract — keyboard, focus, pointer
 *   (`[pKeyFilter]`, `[pAutoFocus]`, `[pFocusTrap]`, `[pStyleClass]`,
 *   `[pRipple]`, `[pDraggable]`, `[pAnimateOnScroll]`).
 *
 *   It does NOT count when it exists so that those components can be built and
 *   an author reaches it only THROUGH one: the base classes and the config/API
 *   surface, the DOM, style and type helpers, the pass-through and class-binding
 *   plumbing a library template applies to itself (`[pBind]`, `[pClass]`), the
 *   content-projection markers those components read (`p-header`, `p-footer` in
 *   `api`), and the motion and overlay engines a widget embeds (`p-motion`,
 *   `p-overlay`).
 *
 * The test is therefore "who writes it, and does it do something on its own",
 * not "does it export a selector" — half this list does export one.
 *
 * The list held four entrypoints the rule does not reach (`autofocus`,
 * `focustrap`, `scroller`, `styleclass`) until 2026-09-07: each is written by an
 * author and each carries its own contract, while `keyfilter`, `ripple`,
 * `dragdrop` and `animateonscroll` — the same gattung — were counted. The
 * denominator went 95 → 99 when the rule replaced the inherited list.
 *
 * The ONE hand-kept list in this file — everything else the package exports
 * (icons and `types/*` aside) counts as a component a guide could cover. A new
 * infrastructure entrypoint that is missing here shows up in `coverage` as an
 * uncovered component, which is the right failure: visible, and fixed by one line.
 */
export const LIBRARY_INFRASTRUCTURE = new Set([
  'api',
  'base',
  'basecomponent',
  'baseeditableholder',
  'baseinput',
  'basemodelholder',
  'bind',
  'classnames',
  'config',
  'dom',
  'motion',
  'overlay',
  'passthrough',
  'ts-helpers',
  'usestyle',
  'utils',
]);

/**
 * Components of LIBRARY_PACKAGE the corpus deliberately does NOT cover, each
 * with the one-line reason — so `coverage` can say "88 covered + 11 declined"
 * instead of leaving eleven names looking like a backlog. The gate
 * (check-design-guides.mjs, check 17) fails on an entry without a reason, on an
 * entry the inventory does not contain, on an entry a guide claims after all,
 * and on an entry docs/DESIGN-SYSTEM.MD ("Declined components") does not name.
 * A component that is neither covered nor declined is reported as undecided.
 * Checked against @openng/optimus-ui 2.0.2 and the kit on 2026-09-23.
 */
export const DECLINED_COMPONENTS = new Map([
  [
    'blockui',
    "the kit's own app-loading-overlay (a full-screen mask with a progress spinner and role=status) already blocks the page while it loads; a second masking mechanism would be a second way to do one thing",
  ],
  [
    'speeddial',
    "the kit's own FAB stack (fab-container) already fans its floating buttons out as a speed dial on narrow screens; a p-speeddial beside it would put two floating-action systems on one page",
  ],
  [
    'knob',
    'a number dragged round a circle; the slider and inputnumber guides cover picking a value with shapes readers already know, and the knob adds nothing an educational page needs',
  ],
  [
    'inplace',
    'click-to-edit hides the input behind display text, so nobody can see a value is editable until they try; the portal has no inline-edit surface, and a visible input (text-inputs) is the plainer answer',
  ],
  [
    'colorpicker',
    "its hue/saturation panel is pointer-only (the keyboard handler only opens and closes it); the kit's theme choice offers fixed palettes, and a free color field would be the native input type=color",
  ],
  [
    'dock',
    'a launcher bar of icon items pinned to a screen edge; nothing in an educational portal launches apps, and the menubar/panelmenu guides cover the navigation it would stand in for',
  ],
  [
    'scrollpanel',
    "draws its own scrollbar over the browser's; native overflow scrolling keeps the platform scrollbar, touch momentum and assistive-technology behavior for free (long lists: the scroller guide)",
  ],
  [
    'styleclass',
    'toggles classes with enter/leave animations on another element; Angular [class] bindings and the motion tokens do that without a second animation path to keep reduced-motion safe',
  ],
  [
    'animateonscroll',
    'animates elements as they scroll into view; a reading page gains nothing from text that moves in while it is being read, and each use would need its own reduced-motion opt-out',
  ],
  [
    'splitter',
    'resizable panes for tool layouts; no kit page shows two side-by-side panes a reader has to resize, and a drag handle has no room on a phone',
  ],
  [
    'terminal',
    'an emulated command prompt answering typed commands through a TerminalService; the articles show commands to read and copy, which a code block does, and a fake shell invites typing into something that is not one',
  ],
]);

/**
 * Every subpath entrypoint of the installed library, as a Set of bare names
 * (`./tree` → `tree`), or `null` when the package is not installed — the gate
 * then says so instead of failing every guide against an empty inventory.
 * Icons, `types/*` and the schematics are not components and are left out.
 */
export function libraryEntrypoints() {
  const pkgFile = path.join(ROOT, 'node_modules', ...LIBRARY_PACKAGE.split('/'), 'package.json');
  if (!fs.existsSync(pkgFile)) return null;
  const exportsMap = JSON.parse(fs.readFileSync(pkgFile, 'utf8')).exports || {};
  const names = new Set();
  for (const key of Object.keys(exportsMap)) {
    if (!key.startsWith('./') || key === './package.json') continue;
    const name = key.slice(2);
    if (name.startsWith('icons') || name.startsWith('types/') || name.startsWith('schematics')) continue;
    names.add(name);
  }
  return names;
}

/** The `covers:` list of a guide, always an array. */
export function coversOf(g) {
  return Array.isArray(g.fm.covers) ? g.fm.covers : [];
}

/**
 * Coverage of the library by the guides, read off `covers:` alone.
 *
 * `components` is the inventory minus LIBRARY_INFRASTRUCTURE; `covered` maps a
 * component to the guide that claims it; `uncovered` is the rest; `foreign` is
 * what a guide claims that the inventory does not contain (a typo, a removed
 * entrypoint, or infrastructure); `shared` lists components claimed by more than
 * one guide. With the library not installed the inventory is null and only the
 * per-guide lists can be reported.
 */
export function coverage(guides) {
  const inventory = libraryEntrypoints();
  const components = inventory ? [...inventory].filter((n) => !LIBRARY_INFRASTRUCTURE.has(n)).sort() : null;
  const claims = new Map(); // component → [guide ids]
  const byGuide = [];
  for (const g of guides) {
    const covers = coversOf(g);
    byGuide.push({ id: g.id, category: g.fm.category || '', covers });
    for (const c of covers) claims.set(c, [...(claims.get(c) || []), g.id]);
  }
  const covered = new Map();
  const shared = [];
  for (const [c, ids] of claims) {
    covered.set(c, ids[0]);
    if (ids.length > 1) shared.push({ component: c, guides: ids });
  }
  const isComponent = (c) => !components || components.includes(c);
  const foreign = [...claims.keys()].filter((c) => !isComponent(c)).sort();
  const uncovered = components ? components.filter((c) => !claims.has(c)) : null;
  // Declined: uncovered on purpose, with a reason (DECLINED_COMPONENTS). The
  // rest of `uncovered` is `undecided`. The gate judges the declined list itself.
  const declined = uncovered ? uncovered.filter((c) => DECLINED_COMPONENTS.has(c)) : null;
  const undecided = uncovered ? uncovered.filter((c) => !DECLINED_COMPONENTS.has(c)) : null;
  return {
    library: LIBRARY_PACKAGE,
    installed: !!inventory,
    components,
    covered,
    uncovered,
    declined,
    undecided,
    foreign,
    shared,
    byGuide,
  };
}

/**
 * What is wrong with a declined list, as messages — pure, so it can be proven on
 * fixtures. `declined` is a Map name → reason, `cov` a `coverage()` result,
 * `docText` the text of docs/DESIGN-SYSTEM.MD (or null when unreadable).
 * An entry fails when its reason is blank, when the installed inventory does not
 * contain it, when a guide claims it after all, or when the doc does not name it
 * as `name` in backticks.
 */
export function declinedProblems(declined, cov, docText) {
  const problems = [];
  // Only the "Declined components" section counts as the record.
  let record = null;
  if (docText !== null) {
    const m = /^(#{2,3}) Declined components[^\n]*\n([\s\S]*?)(?=^#{1,3} |(?![\s\S]))/m.exec(docText);
    if (m) record = m[2];
    else problems.push('declined: docs/DESIGN-SYSTEM.MD has no "Declined components" section.');
  }
  for (const [name, reason] of declined) {
    if (typeof reason !== 'string' || reason.trim().length === 0) {
      problems.push(`declined: "${name}" has no reason — say in one line why the corpus leaves it out.`);
    }
    if (cov.installed && !cov.components.includes(name)) {
      problems.push(`declined: "${name}" is not a ${cov.library} component — remove it from DECLINED_COMPONENTS.`);
    }
    if (cov.covered.has(name)) {
      problems.push(
        `declined: "${name}" is covered by guide "${cov.covered.get(name)}" — remove it from DECLINED_COMPONENTS.`,
      );
    }
    if (record !== null && !record.includes(`\`${name}\``)) {
      problems.push(`declined: "${name}" is missing from docs/DESIGN-SYSTEM.MD "Declined components".`);
    }
  }
  if (docText === null)
    problems.push('declined: docs/DESIGN-SYSTEM.MD is unreadable — the declined list has no record.');
  return problems;
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

// --- Frontmatter ------------------------------------------------------------

/**
 * Parse a `---`-delimited YAML frontmatter block.
 *
 * Values are scalars, single-line `[a, b]` lists, or ONE level of indented block
 * mapping (a key with no value followed by indented `name: text` lines) — that
 * last shape is what `tabs:` uses. Deeper nesting is not supported and not used;
 * this stays a text parse so the script keeps its zero dependencies.
 *
 * Top-level keys may contain hyphens (`measured-against`). They could not until
 * the version pin was introduced, which meant the field parsed as nothing and
 * `list --json` served it as absent — a key the parser silently drops is a field
 * no gate can enforce.
 */
export function parseFrontmatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  if (!m) return null;
  const fm = {};
  let openMap = null; // key currently collecting indented `name: text` lines
  for (const line of m[1].split(/\r?\n/)) {
    const nested = /^\s+([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (openMap && nested) {
      fm[openMap][nested[1]] = nested[2].trim().replace(/^['"]|['"]$/g, '');
      continue;
    }
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    openMap = null;
    const key = kv[1];
    let val = kv[2].trim();
    if (val === '') {
      // A bare `key:` opens a block mapping; the indented lines follow.
      fm[key] = {};
      openMap = key;
      continue;
    }
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else {
      val = val.replace(/^['"]|['"]$/g, '');
    }
    fm[key] = val;
  }
  return fm;
}

// --- The two document layers ------------------------------------------------

/** All guide docs on disk, sorted, as { layer, id, file, raw, fm }. */
export function loadGuides() {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.agent.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8');
      const fm = parseFrontmatter(raw) || {};
      return { layer: 'guides', id: fm.id || file.replace(/\.agent\.md$/, ''), file, raw, fm };
    });
}

/** All kit-primitive docs on disk, sorted, as { layer, id, file, raw, fm }. */
export function loadKitDocs() {
  if (!fs.existsSync(KIT_DIR)) return [];
  return fs
    .readdirSync(KIT_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(KIT_DIR, file), 'utf8');
      const fm = parseFrontmatter(raw) || {};
      return { layer: 'kit', id: file.replace(/\.md$/, ''), file, raw, fm };
    });
}

/** Docs of the requested layer(s). The two id namespaces do not overlap. */
function docsFor(layer, guides, kit) {
  if (layer === 'kit') return kit;
  if (layer === 'all') return [...guides, ...kit];
  return guides;
}

/**
 * Narrow a doc set by frontmatter tag. `list --tag form` used to be accepted and
 * silently ignored — the unfiltered list came back and read like a filtered
 * answer. It now filters, and an unknown tag fails with the tags that exist.
 */
function byTag(docs, tag) {
  if (!tag) return docs;
  const want = tag.trim().toLowerCase();
  const hits = docs.filter((d) => (Array.isArray(d.fm.tags) ? d.fm.tags : []).some((t) => t.toLowerCase() === want));
  if (hits.length === 0) {
    const all = new Set();
    for (const d of docs) for (const t of Array.isArray(d.fm.tags) ? d.fm.tags : []) all.add(t);
    fail(`No doc carries the tag "${tag}". Tags in scope: ${[...all].sort().join(', ') || '(none)'}`);
  }
  return hits;
}

function findDoc(docs, id) {
  return docs.find((d) => d.id === id);
}

function knownIds(docs) {
  return docs.map((d) => d.id).join(', ') || '(none)';
}

/** Extract one `## <heading>` section (heading + body up to the next `## `). */
export function extractSection(raw, needle) {
  const lines = raw.split(/\r?\n/);
  const target = needle.trim().toLowerCase();
  const out = [];
  let capturing = false;
  for (const line of lines) {
    const h2 = /^##\s+(.*)$/.exec(line);
    if (h2) {
      if (capturing) break;
      if (h2[1].trim().toLowerCase().includes(target)) {
        capturing = true;
        out.push(line);
        continue;
      }
    }
    if (capturing) out.push(line);
  }
  return out.join('\n').trim();
}

function headingsIn(raw) {
  return [...raw.matchAll(/^##\s+(.*)$/gm)].map((m) => m[1].trim());
}

// --- Article tabs ----------------------------------------------------------
// The agent doc is the contract; the article tabs are the depth behind it. The
// tab bodies live as `<ng-template appGuideTab="…">` blocks inside the article
// component's inline template, so pulling one means slicing source text.

let registryCache = null;

/**
 * The registry parsed as TEXT (article-registry.ts PARSER CONTRACT) — the same
 * parse `check-design-guides.mjs` does, so CLI and gate never disagree about
 * which file a guide's tabs come from.
 */
export function registryEntries() {
  if (registryCache) return registryCache;
  if (!fs.existsSync(REGISTRY_FILE)) return (registryCache = []);
  const src = fs.readFileSync(REGISTRY_FILE, 'utf8');
  const re = /id:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?import\(\s*'([^']+)'\s*\)/g;
  const out = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({ id: m[1], category: m[2], file: path.join(ARTICLES_DIR, m[3].replace(/^\.\//, '')) + '.ts' });
  }
  return (registryCache = out);
}

/** The categories the registry TYPE permits — derived, so it cannot go stale. */
export function declaredCategories() {
  if (!fs.existsSync(REGISTRY_FILE)) return [];
  const src = fs.readFileSync(REGISTRY_FILE, 'utf8');
  const m = /category:\s*((?:'[a-z-]+'\s*\|\s*)+'[a-z-]+')\s*;/.exec(src);
  if (!m) return [];
  return [...m[1].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]);
}

/** Article component file for a guide id, or null. */
export function articleFileFor(id) {
  const e = registryEntries().find((x) => x.id === id);
  return e ? e.file : null;
}

const sourceCache = new Map();
function articleSource(id) {
  if (sourceCache.has(id)) return sourceCache.get(id);
  const file = articleFileFor(id);
  const src = file && fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  sourceCache.set(id, src);
  return src;
}

/** Tab names an article delivers, in source order. */
export function tabsIn(src) {
  return [...src.matchAll(/<ng-template\s+appGuideTab="([^"]+)"/g)].map((m) => m[1]);
}

/** Strip the common leading indentation so a sliced block reads on its own. */
function dedent(block) {
  const lines = block
    .replace(/^\r?\n/, '')
    .replace(/\s+$/, '')
    .split(/\r?\n/);
  const indents = lines.filter((l) => l.trim()).map((l) => /^[ \t]*/.exec(l)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join('\n');
}

/**
 * Slice one tab body out of an article component's source.
 *
 * String slicing at the framework marker, NOT an Angular parse: the marker is
 * the directive selector the shell projects on, it is stable, and the parse
 * would cost this script its zero dependencies. `<ng-template>` legitimately
 * NESTS inside tab bodies (the UI library's `pTemplate` slots — the Dialog article has
 * five in one tab), so the closing tag is found by depth counting, never by
 * "the next `</ng-template>`".
 *
 * Returns `{ found, balanced, body }`; an unbalanced block is reported rather
 * than silently truncated, because a wrong slice reads like a real answer.
 */
export function extractTab(src, tab) {
  const esc = tab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const open = new RegExp(`<ng-template\\s+appGuideTab="${esc}"\\s*>`).exec(src);
  if (!open) return { found: false };
  const start = open.index + open[0].length;
  const tags = /<ng-template\b|<\/ng-template\s*>/g;
  tags.lastIndex = start;
  let depth = 1;
  let m;
  while ((m = tags.exec(src)) !== null) {
    if (m[0][1] === '/') {
      if (--depth === 0) return { found: true, balanced: true, body: dedent(src.slice(start, m.index)) };
    } else {
      depth++;
    }
  }
  return { found: true, balanced: false };
}

// --- Interpolation resolution ----------------------------------------------
// An article's measured numbers and code samples live in string constants next
// to the template (`readonly m = { boxSmall: '16 × 16 px', … }`) and reach the
// page as `{{ m.boxSmall }}`. Slicing the template alone therefore returned the
// guide's measurement table with every value removed. Resolving them is a text
// parse of string literals, not an Angular parse.

/** Consume a JS string literal starting at `i`; returns { value, end } or null. */
function readString(src, i) {
  const q = src[i];
  if (q !== "'" && q !== '"' && q !== '`') return null;
  let out = '';
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') {
      const n = src[j + 1];
      out += n === 'n' ? '\n' : n === 't' ? '\t' : n === 'r' ? '' : n;
      j += 2;
      continue;
    }
    if (c === q) return { value: out, end: j + 1, template: q === '`' };
    if (q === '`' && c === '$' && src[j + 1] === '{') return { value: null, end: skipTemplate(src, i), template: true };
    out += c;
    j++;
  }
  return { value: null, end: src.length, template: q === '`' };
}

/** End index of a template literal that contains `${…}` (nesting-aware). */
function skipTemplate(src, i) {
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '\\') {
      j += 2;
      continue;
    }
    if (c === '`') return j + 1;
    if (c === '$' && src[j + 1] === '{') {
      let depth = 1;
      j += 2;
      while (j < src.length && depth > 0) {
        if (src[j] === '{') depth++;
        else if (src[j] === '}') depth--;
        else if (src[j] === "'" || src[j] === '"' || src[j] === '`') {
          const s = readString(src, j);
          j = s.end;
          continue;
        }
        j++;
      }
      continue;
    }
    j++;
  }
  return src.length;
}

/** A string expression: one literal, or literals joined by `+`. Else null. */
function readStringExpr(src, i) {
  while (/\s/.test(src[i])) i++;
  const first = readString(src, i);
  if (!first || first.value === null) return null;
  let value = first.value;
  let j = first.end;
  for (;;) {
    let k = j;
    while (/\s/.test(src[k])) k++;
    if (src[k] !== '+') return { value, end: j };
    k++;
    while (/\s/.test(src[k])) k++;
    const next = readString(src, k);
    if (!next || next.value === null) return { value, end: j };
    value += next.value;
    j = next.end;
  }
}

const DECL = /(?:readonly|const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*/y;

/**
 * Every flat string constant an article declares, as `name` → string and
 * `name.key` → string.
 *
 * Single pass over the source with string and comment literals consumed as
 * units, so a declaration that only APPEARS inside a code sample (snippets show
 * the reader's markup, and that markup contains `readonly` declarations of its
 * own) can never be mistaken for one of the article's own constants.
 */
export function parseStringConstants(src) {
  const flat = new Map();
  let i = 0;
  while (i < src.length) {
    if (src.startsWith('//', i)) {
      const nl = src.indexOf('\n', i);
      i = nl < 0 ? src.length : nl + 1;
      continue;
    }
    if (src.startsWith('/*', i)) {
      const e = src.indexOf('*/', i);
      i = e < 0 ? src.length : e + 2;
      continue;
    }
    const c = src[i];
    if (c === "'" || c === '"' || c === '`') {
      i = readString(src, i).end;
      continue;
    }
    if (/[A-Za-z_$]/.test(c) && !/[\w$.]/.test(src[i - 1] || ' ')) {
      DECL.lastIndex = i;
      const d = DECL.exec(src);
      if (d) {
        const name = d[1];
        const j = DECL.lastIndex;
        const str = readStringExpr(src, j);
        if (str) {
          flat.set(name, str.value);
          i = str.end;
          continue;
        }
        if (src[j] === '{') {
          const obj = readFlatObject(src, j);
          for (const [k, v] of obj.entries) flat.set(`${name}.${k}`, v);
          i = obj.end;
          continue;
        }
        i = j;
        continue;
      }
      // Not a declaration: skip the whole identifier so `i` always advances.
      while (i < src.length && /[\w$]/.test(src[i])) i++;
      continue;
    }
    i++;
  }
  return flat;
}

/** Read `{ key: <string expr>, … }`; non-string members are skipped, not guessed. */
function readFlatObject(src, i) {
  const entries = [];
  let j = i + 1;
  let depth = 1;
  while (j < src.length && depth > 0) {
    const c = src[j];
    if (c === '{' || c === '[' || c === '(') {
      depth++;
      j++;
      continue;
    }
    if (c === '}' || c === ']' || c === ')') {
      depth--;
      j++;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') {
      j = readString(src, j).end;
      continue;
    }
    if (src.startsWith('//', j)) {
      const nl = src.indexOf('\n', j);
      j = nl < 0 ? src.length : nl + 1;
      continue;
    }
    if (src.startsWith('/*', j)) {
      const e = src.indexOf('*/', j);
      j = e < 0 ? src.length : e + 2;
      continue;
    }
    if (depth === 1 && /[A-Za-z_$]/.test(c) && !/[\w$]/.test(src[j - 1] || ' ')) {
      const key = /^[A-Za-z_$][\w$]*/.exec(src.slice(j))[0];
      let k = j + key.length;
      while (/\s/.test(src[k])) k++;
      if (src[k] === ':') {
        const str = readStringExpr(src, k + 1);
        if (str) {
          entries.push([key, str.value]);
          j = str.end;
          continue;
        }
      }
      j += key.length;
      continue;
    }
    j++;
  }
  return { entries, end: j };
}

/**
 * Replace `{{ name }}` / `{{ name.key }}` with the constant's text where the
 * constant is a flat string; everything else (signals, `@for` variables,
 * ternaries) stays verbatim and is reported.
 */
export function resolveInterpolations(text, consts) {
  let resolved = 0;
  const unresolved = new Set();
  const out = text.replace(/\{\{([^{}]*)\}\}/g, (whole, expr) => {
    const key = expr.trim();
    if (/^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*)?$/.test(key) && consts.has(key)) {
      resolved++;
      return consts.get(key);
    }
    unresolved.add(key);
    return whole;
  });
  return { text: out, resolved, unresolved: [...unresolved] };
}

/** A tab body with the article's own string constants substituted in. */
export function tabBody(id, tab, { raw = false } = {}) {
  const src = articleSource(id);
  if (!src) return { error: 'no-article' };
  const res = extractTab(src, tab);
  if (!res.found) return { error: 'no-tab', tabs: tabsIn(src) };
  if (!res.balanced) return { error: 'unbalanced' };
  if (raw) return { body: res.body, resolved: 0, unresolved: [] };
  const r = resolveInterpolations(res.body, parseStringConstants(src));
  return { body: r.text, resolved: r.resolved, unresolved: r.unresolved };
}

// --- Typed block harvest ----------------------------------------------------
// The semantic markers the harvest keys off already exist — spelled as CSS class
// names, uniformly, in every article. `blocks` reads them; the gate
// (check-design-guides.mjs, check G-c) asserts that every marker in the tree is
// recognised here, which freezes an accidental convention into a checked
// contract without changing a byte of markup.

/** End of the tag starting at `i`, honouring quoted attribute values. */
function readTag(src, i) {
  let j = i;
  while (j < src.length) {
    const c = src[j];
    if (c === '"' || c === "'") {
      const q = c;
      j++;
      while (j < src.length && src[j] !== q) j++;
      j++;
      continue;
    }
    if (c === '>') return { end: j + 1, selfClosing: src[j - 1] === '/' };
    j++;
  }
  return { end: src.length, selfClosing: false };
}

/** Inner text of the element opening at `i`, by depth counting. */
function sliceElement(src, i, name) {
  const open = readTag(src, i);
  if (open.selfClosing) return { inner: '', end: open.end };
  const openTag = `<${name}`;
  const closeTag = `</${name}`;
  let depth = 1;
  let j = open.end;
  while (j < src.length) {
    const nextOpen = src.indexOf(openTag, j);
    const nextClose = src.indexOf(closeTag, j);
    if (nextClose < 0) return null;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      const t = readTag(src, nextOpen);
      if (!t.selfClosing) depth++;
      j = t.end;
      continue;
    }
    depth--;
    const closeEnd = src.indexOf('>', nextClose) + 1;
    if (depth === 0) return { inner: src.slice(open.end, nextClose), end: closeEnd };
    j = closeEnd;
  }
  return null;
}

const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  times: '×',
};

/** Entity decoding alone — for code, where the markup IS the payload. */
function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n] ?? m);
}

/** Markup → one line of readable text (labels and rationales only, never code). */
function plainText(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * The nearest `<h3>`/`<h4>` before `at` — a block's caption as the page shows it.
 *
 * Captions are not marked; they are the heading a reader has just passed. 171 of
 * the corpus's 172 tables sit under one, so reading backwards costs nothing and
 * turns an anonymous table into an answerable one.
 */
function nearestHeading(body, at) {
  const h = [...body.slice(0, at).matchAll(/<(h3|h4)\b[^>]*>([\s\S]*?)<\/\1>/g)].pop();
  return h ? plainText(h[2]) : '';
}

/**
 * Every guide's every tab, sliced and resolved — the surface a harvest reads.
 *
 * One generator so a new block type is a matcher, not another walk of the corpus,
 * and so every type sees exactly what `tab <id> <tab>` would print.
 */
function* tabBodies(guides) {
  for (const g of guides) {
    const src = articleSource(g.id);
    if (!src) continue;
    const consts = parseStringConstants(src);
    for (const tab of tabsIn(src)) {
      const res = extractTab(src, tab);
      if (!res.balanced) continue;
      yield { id: g.id, tab, body: resolveInterpolations(res.body, consts).text };
    }
  }
}

/**
 * Cells the harvester can key on — the EXACT class pair it slices for.
 */
export function countDoDontCells(body) {
  return [...body.matchAll(/class="dd__cell dd__cell--(bad|good)"/g)].length;
}

/**
 * Cells that are PRESENT, detected loosely and independently of the harvester.
 *
 * The distinction is the whole point of the harvest contract. Counting present
 * cells with the harvester's own regex asserts nothing: rename `dd__cell--bad`
 * to `dd__cell--negative` and both counts fall by one together. This probe asks
 * only "does a class attribute here mention `dd__cell`", so a partial rename
 * shows up as present-but-unharvested.
 */
export function countDoDontMarkers(body) {
  return [...body.matchAll(/class="[^"]*\bdd__cell\b[^"]*"/g)].length;
}

/**
 * Harvest one cell: its tag label, its `dd__why` rationale, and the markup of
 * its `dd__stage` (the rendered example itself).
 */
function harvestCell(body, at, kind) {
  const openIdx = body.lastIndexOf('<', at);
  const el = sliceElement(body, openIdx, 'div');
  if (!el) return null;
  const inner = el.inner;
  const cell = { kind, label: '', why: '', markup: '' };
  const tagAt = inner.search(/class="tag tag--(bad|good)"/);
  if (tagAt >= 0) {
    const s = sliceElement(inner, inner.lastIndexOf('<', tagAt), 'span');
    if (s) cell.label = plainText(s.inner);
  }
  const whyAt = inner.search(/class="dd__why"/);
  if (whyAt >= 0) {
    const p = sliceElement(inner, inner.lastIndexOf('<', whyAt), 'p');
    if (p) cell.why = plainText(p.inner);
  }
  const stageAt = inner.search(/class="dd__stage"/);
  if (stageAt >= 0) {
    const d = sliceElement(inner, inner.lastIndexOf('<', stageAt), 'div');
    if (d) cell.markup = dedent(d.inner);
  }
  return { cell, end: el.end };
}

/**
 * Every do/don't pair in the corpus: guide id, tab, the don't and the do, each
 * with label, rationale and the markup of the rendered stage.
 *
 * Pairs come from the `dd` container that wraps them; a cell outside a container
 * is reported as an orphan rather than dropped, so the cell count stays honest.
 */
export function harvestDoDont(guides) {
  const pairs = [];
  const orphans = [];
  let cellsSeen = 0;
  let cellsHarvested = 0;
  const guidesWithUsage = [];
  const guidesWithPairs = new Set();
  for (const g of guides) {
    const src = articleSource(g.id);
    if (!src) continue;
    for (const tab of tabsIn(src)) {
      const res = extractTab(src, tab);
      if (!res.balanced) continue;
      const consts = parseStringConstants(src);
      const body = resolveInterpolations(res.body, consts).text;
      cellsSeen += countDoDontMarkers(body);
      if (tab === 'usage') guidesWithUsage.push(g.id);
      const claimed = new Set();
      // Containers first: `<div class="dd">` holds one don't/do pair.
      for (const m of body.matchAll(/class="dd"/g)) {
        const box = sliceElement(body, body.lastIndexOf('<', m.index), 'div');
        if (!box) continue;
        const cells = [];
        for (const c of box.inner.matchAll(/class="dd__cell dd__cell--(bad|good)"/g)) {
          const h = harvestCell(box.inner, c.index, c[1] === 'bad' ? "don't" : 'do');
          if (h) {
            cells.push(h.cell);
            cellsHarvested++;
            claimed.add(m.index + c.index);
          }
        }
        if (cells.length) {
          pairs.push({ id: g.id, tab, cells });
          guidesWithPairs.add(g.id);
        }
      }
      // Any cell that was not inside a `dd` container.
      for (const c of body.matchAll(/class="dd__cell dd__cell--(bad|good)"/g)) {
        const insideBox = [...body.matchAll(/class="dd"/g)].some((b) => {
          const box = sliceElement(body, body.lastIndexOf('<', b.index), 'div');
          return box && c.index > b.index && c.index < box.end;
        });
        if (insideBox) continue;
        const h = harvestCell(body, c.index, c[1] === 'bad' ? "don't" : 'do');
        if (h) {
          orphans.push({ id: g.id, tab, cell: h.cell });
          cellsHarvested++;
          guidesWithPairs.add(g.id);
        }
      }
    }
  }
  return { pairs, orphans, cellsSeen, cellsHarvested, guidesWithUsage, guidesWithPairs: [...guidesWithPairs] };
}

// --- Reference tables -------------------------------------------------------
// The measured numbers live in tables: token values per size, state styles per
// theme, keyboard maps, contrast ratios. Every one of the corpus's 172 tables is
// wrapped in `<div class="table-wrap">`, carries a `<thead>` and a `<tbody>`, and
// sits under a heading — so the wrapper is the marker and the table's own
// structure supplies caption, columns, rows and provenance without any new
// authoring work.

/**
 * Tables that are PRESENT, detected WITHOUT the harvester's marker.
 *
 * The probe counts `<table>` elements; the harvester keys on the `table-wrap`
 * class. Rename the wrapper and the probe still finds every table while the
 * harvest drops to nothing — which is the divergence the gate exists to catch.
 * `<pre>` blocks are removed first: a code recipe SHOWS the reader table markup,
 * escaped, and a sample is not a table this corpus documents.
 */
export function countTableMarkers(body) {
  return [...body.replace(/<pre\b[\s\S]*?<\/pre>/g, '').matchAll(/<table[\s>]/g)].length;
}

/**
 * The `src-note` that vouches for a block, if one follows it.
 *
 * Scoped to the gap before the next heading or the next table, so a note keeps
 * belonging to what it was written under — 124 of 172 tables have one.
 */
function followingSourceNote(body, from) {
  const rest = body.slice(from);
  const stop = /<h3\b|<h4\b|class="[^"]*\btable-wrap\b[^"]*"/.exec(rest);
  const win = stop ? rest.slice(0, stop.index) : rest;
  const at = win.search(/class="[^"]*\bsrc-note\b[^"]*"/);
  if (at < 0) return '';
  const p = sliceElement(win, win.lastIndexOf('<', at), 'p');
  return p ? plainText(p.inner) : '';
}

/** Every reference table in one tab body, as caption / columns / rows / source. */
export function harvestTablesIn(body) {
  const out = [];
  for (const m of body.matchAll(/class="[^"]*\btable-wrap\b[^"]*"/g)) {
    const box = sliceElement(body, body.lastIndexOf('<', m.index), 'div');
    if (!box || !/<table[\s>]/.test(box.inner)) continue;
    const head = /<thead\b[^>]*>([\s\S]*?)<\/thead>/.exec(box.inner);
    const rows = /<tbody\b[^>]*>([\s\S]*?)<\/tbody>/.exec(box.inner);
    // A real `<caption>` outranks the heading heuristic — it was written for
    // this table. Only 3 of 172 have one, which is why the heading is the rule
    // and the element is the exception, not the other way round.
    const cap = /<caption\b[^>]*>([\s\S]*?)<\/caption>/.exec(box.inner);
    out.push({
      caption: cap ? plainText(cap[1]) : nearestHeading(body, m.index),
      columns: head ? [...head[1].matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((c) => plainText(c[1])) : [],
      rows: rows
        ? [...rows[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map((r) =>
            [...r[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => plainText(c[1])),
          )
        : [],
      // A `@for` in the wrapper means the literal rows are a template and the
      // rendered table is longer. Saying so beats printing a row count that is
      // right about the source and wrong about the page.
      dynamic: /@(?:for|if|switch)\b/.test(box.inner),
      source: followingSourceNote(body, box.end),
    });
  }
  return out;
}

/** Every reference table in the corpus, with what was present but not harvested. */
export function harvestTables(guides) {
  const blocks = [];
  const guidesWith = new Set();
  let seen = 0;
  for (const { id, tab, body } of tabBodies(guides)) {
    seen += countTableMarkers(body);
    for (const b of harvestTablesIn(body)) {
      blocks.push({ id, tab, ...b });
      guidesWith.add(id);
    }
  }
  return { blocks, seen, harvested: blocks.length, guidesWith: [...guidesWith] };
}

// --- Provenance notes -------------------------------------------------------
// "Provenance, not process" (directives/guide-authoring.md) demands a
// half-sentence of evidence beside every measured claim, and in the tabs that
// half-sentence has exactly one shape: a `<p class="src-note">` next to what it
// vouches for. 241 of them, in every guide. Harvesting them answers the question
// the `measured-against` pin raises but cannot answer on its own — WHICH files,
// presets and artefacts would have to be re-read when that pin moves.

/**
 * Provenance notes that are PRESENT, detected loosely.
 *
 * The probe asks only whether a class attribute mentions `src-note`; the
 * harvester additionally requires the element to be a `<p>`, which all 241 are.
 * A note moved onto a `<div>`, or a class renamed on one element, therefore
 * reads as present-but-unharvested instead of vanishing from the answer.
 */
export function countSourceMarkers(body) {
  return [...body.matchAll(/class="[^"]*\bsrc-note\b[^"]*"/g)].length;
}

/** Every provenance note in one tab body, with the artefacts it names. */
export function harvestSourcesIn(body) {
  const out = [];
  for (const m of body.matchAll(/class="[^"]*\bsrc-note\b[^"]*"/g)) {
    const open = body.lastIndexOf('<', m.index);
    if (!/^<p[\s>]/.test(body.slice(open, open + 3))) continue;
    const p = sliceElement(body, open, 'p');
    if (!p) continue;
    const text = plainText(p.inner);
    if (!text) continue;
    // The `<code>` spans inside a note are its artefacts: the FESM file, the
    // preset path, the token name, the stylesheet selector. Deduped, in order —
    // that list is the re-measure worklist when the version pin moves.
    const cites = [
      ...new Set([...p.inner.matchAll(/<code[^>]*>([\s\S]*?)<\/code>/g)].map((c) => plainText(c[1])).filter(Boolean)),
    ];
    out.push({ under: nearestHeading(body, m.index), text, cites });
  }
  return out;
}

/** Every provenance note in the corpus, with what was present but not harvested. */
export function harvestSources(guides) {
  const notes = [];
  const guidesWith = new Set();
  let seen = 0;
  for (const { id, tab, body } of tabBodies(guides)) {
    seen += countSourceMarkers(body);
    for (const n of harvestSourcesIn(body)) {
      notes.push({ id, tab, ...n });
      guidesWith.add(id);
    }
  }
  return { notes, seen, harvested: notes.length, guidesWith: [...guidesWith] };
}

// --- Code recipes -----------------------------------------------------------
// The block a reader copies: `<pre class="code-block"><code>…</code></pre>`, 179
// of them, in every guide. Whether a recipe survives leaving the page is decided
// by where its text lives — a flat string constant resolves under `tab`, under
// `search` and here; a computed signal or a `@for` variable does not, and the
// harvest says which of the two it got rather than serving a placeholder as code.

/**
 * Recipes that are PRESENT, detected loosely.
 *
 * The probe asks only whether a class attribute mentions `code-block`; the
 * harvester additionally requires the `<pre>`/`<code>` pair all 179 use. The
 * class list is TOKENISED on both sides rather than compared — 4 of the 179 add
 * `code-block--inline`, and a harvester that string-matched `class="code-block"`
 * would have dropped them while reporting a full corpus.
 */
export function countSnippetMarkers(body) {
  return [...body.matchAll(/class="[^"]*\bcode-block\b[^"]*"/g)].length;
}

/** Every code recipe in one tab body, with what it still leaves to runtime. */
export function harvestSnippetsIn(body) {
  const out = [];
  for (const m of body.matchAll(
    /<pre\s+class="[^"]*\bcode-block\b[^"]*"\s*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/g,
  )) {
    // Entities decoded but markup untouched: in a recipe the markup IS the
    // payload, so `&lt;p-card&gt;` must come back as the tag a reader pastes.
    const code = dedent(decodeEntities(m[1]));
    const live = [...new Set([...code.matchAll(/\{\{([^{}]*)\}\}/g)].map((x) => x[1].trim()))];
    out.push({
      under: nearestHeading(body, m.index),
      code,
      lines: code ? code.split('\n').length : 0,
      live,
      // Nothing but interpolation left: the block is a live output (a playground
      // printing what its own controls produce), not a recipe that travels.
      generated: live.length > 0 && code.replace(/\{\{[^{}]*\}\}/g, '').trim() === '',
    });
  }
  return out;
}

/** Every code recipe in the corpus, with what was present but not harvested. */
export function harvestSnippets(guides) {
  const recipes = [];
  const guidesWith = new Set();
  let seen = 0;
  for (const { id, tab, body } of tabBodies(guides)) {
    seen += countSnippetMarkers(body);
    for (const r of harvestSnippetsIn(body)) {
      recipes.push({ id, tab, ...r });
      guidesWith.add(id);
    }
  }
  return { recipes, seen, harvested: recipes.length, guidesWith: [...guidesWith] };
}

// --- Related closure --------------------------------------------------------

/**
 * The related graph, UNDIRECTED.
 *
 * `related` is hand-maintained and directed, and 34 of its edges point one way
 * only — `card → table` without `table → card`. That asymmetry is authorial
 * reality, not a maintenance debt: an author names what is worth reading next
 * from where they stand. So the closure reads edges in both directions rather
 * than asking twenty authors to keep a symmetric graph by hand.
 *
 * On top of that, one CATEGORY rule: every `library` guide is implicitly related
 * to every `foundations` guide and back. A cross-cutting guide should not cost
 * forty hand edits to become reachable — the rule lives here, not in the
 * frontmatters.
 */
export function relatedGraph(guides) {
  const byId = new Map(guides.map((g) => [g.id, g]));
  const adj = new Map(guides.map((g) => [g.id, new Map()]));
  const dead = [];
  const planned = [];
  const listOf = (g) => (Array.isArray(g.fm.related) ? g.fm.related : []);
  for (const g of guides) {
    for (const raw of listOf(g)) {
      if (raw.startsWith(PLANNED_PREFIX)) {
        planned.push({ from: g.id, id: raw.slice(PLANNED_PREFIX.length) });
        continue;
      }
      if (!byId.has(raw)) {
        dead.push({ from: g.id, id: raw });
        continue;
      }
      if (!adj.get(g.id).has(raw)) adj.get(g.id).set(raw, 'direct');
      if (!adj.get(raw).has(g.id)) adj.get(raw).set(g.id, 'reverse');
    }
  }
  const byCategory = (c) => guides.filter((g) => g.fm.category === c).map((g) => g.id);
  const library = byCategory('library');
  const foundations = byCategory('foundations');
  for (const a of library) {
    for (const b of foundations) {
      if (!adj.get(a).has(b)) adj.get(a).set(b, 'category');
      if (!adj.get(b).has(a)) adj.get(b).set(a, 'category');
    }
  }
  return { adj, dead, planned, categoryEdges: library.length * foundations.length * 2 };
}

/** Breadth-first closure from `rootId`, recording how each node was reached. */
export function relatedClosure(graph, rootId, depth) {
  const seen = new Map([[rootId, { depth: 0, via: null, edge: 'root' }]]);
  let frontier = [rootId];
  for (let d = 1; d <= depth; d++) {
    const next = [];
    for (const node of frontier) {
      for (const [to, edge] of graph.adj.get(node) || []) {
        if (seen.has(to)) continue;
        seen.set(to, { depth: d, via: node === rootId ? null : node, edge });
        next.push(to);
      }
    }
    frontier = next;
  }
  seen.delete(rootId);
  return seen;
}

// --- Commands ---------------------------------------------------------------

function cmdList(guides, kit, { json, layer, tag }) {
  const docs = byTag(docsFor(layer, guides, kit), tag);
  if (json) {
    console.log(
      JSON.stringify(
        docs.map((d) => ({ layer: d.layer, id: d.id, ...d.fm })),
        null,
        2,
      ),
    );
    return;
  }
  if (docs.length === 0) {
    console.log('No docs found.');
    return;
  }
  const asList = (v) => (Array.isArray(v) ? v.join(',') : String(v || ''));
  const rows = docs.map((d) => ({
    id: d.id,
    category: String(d.fm.category || (d.layer === 'kit' ? 'kit' : '')),
    tags: asList(d.fm.tags),
    related: asList(d.fm.related),
    summary: String(d.fm.summary || d.fm.name || ''),
  }));
  const w = (key, min) => Math.max(min, ...rows.map((r) => r[key].length));
  const wId = w('id', 2);
  const wCat = w('category', 8);
  const wTags = Math.min(w('tags', 4), 28);
  const wRel = Math.min(w('related', 7), 28);
  let truncated = 0;
  const pad = (s, n) => (s.length > n ? (truncated++, s.slice(0, n - 1) + '…') : s.padEnd(n));
  console.log(`${pad('id', wId)}  ${pad('category', wCat)}  ${pad('tags', wTags)}  ${pad('related', wRel)}  summary`);
  console.log(`${'-'.repeat(wId)}  ${'-'.repeat(wCat)}  ${'-'.repeat(wTags)}  ${'-'.repeat(wRel)}  ${'-'.repeat(7)}`);
  for (const r of rows) {
    console.log(
      `${pad(r.id, wId)}  ${pad(r.category, wCat)}  ${pad(r.tags, wTags)}  ${pad(r.related, wRel)}  ${r.summary}`,
    );
  }
  if (truncated > 0) {
    // A cut cell reads like a complete answer; say that it isn't one.
    console.error(`[list] ${truncated} cell(s) truncated to fit the table — use --json for full values.`);
  }
  if (layer === 'guides' && kit.length) {
    console.error(
      `[list] guides layer only — ${kit.length} kit-primitive doc(s) not shown; add --layer kit or --layer all.`,
    );
  }
}

function cmdShow(guides, kit, id, layer) {
  const docs = docsFor(layer, guides, kit);
  const d = findDoc(docs, id);
  if (!d) {
    const other = findDoc(docsFor('all', guides, kit), id);
    if (other) fail(`"${id}" is a ${other.layer}-layer doc. Run: design-guides show ${id} --layer ${other.layer}`);
    fail(`Unknown id "${id}" in layer "${layer}". Known ids: ${knownIds(docs)}`);
  }
  process.stdout.write(d.raw.endsWith('\n') ? d.raw : d.raw + '\n');
}

function cmdSection(guides, kit, id, heading, { json, layer }) {
  const docs = docsFor(layer, guides, kit);
  const d = findDoc(docs, id);
  if (!d) {
    const other = findDoc(docsFor('all', guides, kit), id);
    if (other)
      fail(
        `"${id}" is a ${other.layer}-layer doc. Run: design-guides section ${id} "${heading}" --layer ${other.layer}`,
      );
    fail(`Unknown id "${id}" in layer "${layer}". Known ids: ${knownIds(docs)}`);
  }
  if (!heading) fail(`Missing heading. Usage: design-guides section ${id} "when to use"`);
  const section = extractSection(d.raw, heading);
  if (!section) {
    fail(`No section matching "${heading}" in "${id}". Sections: ${headingsIn(d.raw).join(', ')}`);
  }
  if (json)
    console.log(
      JSON.stringify(
        {
          layer: d.layer,
          id: d.id,
          heading: headingsIn(d.raw).find((h) => h.toLowerCase().includes(heading.trim().toLowerCase())),
          body: section,
        },
        null,
        2,
      ),
    );
  else console.log(section);
}

/** D1 — one heading across EVERY doc of the layer, in one call. */
function cmdSections(guides, kit, heading, { json, layer, tag }) {
  if (!heading) fail('Missing heading. Usage: design-guides sections "when to use" [--layer guides|kit|all] [--tag T]');
  const docs = byTag(docsFor(layer, guides, kit), tag);
  const hits = [];
  for (const d of docs) {
    const body = extractSection(d.raw, heading);
    if (!body) continue;
    const h = headingsIn(d.raw).find((x) => x.toLowerCase().includes(heading.trim().toLowerCase()));
    hits.push({ layer: d.layer, id: d.id, heading: h, body });
  }
  if (hits.length === 0) {
    const all = new Map();
    for (const d of docs) for (const h of headingsIn(d.raw)) all.set(h, (all.get(h) || 0) + 1);
    const known = [...all.entries()].sort((a, b) => b[1] - a[1]).map(([h, n]) => `${h} (${n})`);
    fail(`No "## ${heading}" section in any ${layer} doc. Headings that exist: ${known.join(', ')}`);
  }
  if (json) {
    console.log(JSON.stringify(hits, null, 2));
    return;
  }
  for (const h of hits) {
    console.log(`=== ${h.id}${h.layer === 'kit' ? ' (kit)' : ''} ===`);
    console.log(h.body);
    console.log('');
  }
  const bytes = hits.reduce((n, h) => n + h.body.length, 0);
  console.error(
    `[sections] "${heading}" — ${hits.length}/${docs.length} ${layer} doc(s), ${bytes.toLocaleString('en-US')} B in one call.`,
  );
  if (layer === 'guides' && kit.length) {
    console.error(`[sections] kit layer excluded — ${kit.length} kit doc(s) share these headings; add --layer all.`);
  }
}

/**
 * Harvestable block types — the corpus's content-block vocabulary, keyed off the
 * class markers the articles already carry uniformly. Each one is also a GATE
 * contract (check-design-guides.mjs): a marker present in the tree that this file
 * does not recognise fails the build.
 *
 * ADDING A TYPE. Measure first — `directives/guide-authoring.md`, "Harvest
 * contracts", carries the inventory and the rule. A type needs a marker that
 * already exists uniformly in all twenty guides, or it costs an edit to every
 * shipped article. The other regular structure in the tabs is the `<h3>` heading
 * family: 509 headings, 338 distinct, with a vocabulary in the repeats — Sources
 * (17 guides), Import (15), Accessibility (15), Anatomy (14), SSR (11), RTL (9),
 * Theming with CSS custom properties (8). A type such as `anatomy` is a heading
 * matcher plus a slice to the next heading, reusing `tabBodies`, `sliceElement`
 * and `resolveInterpolations` unchanged.
 *
 * What a heading family CANNOT do is guarantee presence: it finds what is there,
 * it cannot assert that every guide has an Anatomy block. Which is why the gate
 * enforces RECOGNITION and not presence for every type but `dodont`, whose
 * presence rule predates the contract.
 */
const BLOCK_TYPES = {
  dodont: "Rendered do/don't pairs from the article tabs (dd__cell markers).",
  table: 'Reference tables with caption, columns, rows and provenance (table-wrap markers).',
  source: 'Provenance notes — what each claim was read off, and the artifacts it names (src-note markers).',
  snippet: 'Copy-paste code recipes, and what each still leaves to runtime (code-block markers).',
};

/** `--brief` cuts a note to this, at a word boundary — a locator, not the note. */
const BRIEF_CHARS = 160;

/** D2 — every block of one type, across every article, in one call. */
function cmdBlocks(guides, type, { json, tag, brief }) {
  if (!type) fail(`Missing type. Usage: design-guides blocks <type>. Types: ${Object.keys(BLOCK_TYPES).join(', ')}`);
  if (!(type in BLOCK_TYPES)) {
    fail(
      `Unknown block type "${type}". Types: ${Object.entries(BLOCK_TYPES)
        .map(([k, v]) => `${k} — ${v}`)
        .join('; ')}`,
    );
  }
  const scope = byTag(guides, tag);
  if (type === 'table') return blocksTable(scope, { json, tag, brief });
  if (type === 'source') return blocksSource(scope, { json, tag, brief });
  if (type === 'snippet') return blocksSnippet(scope, { json, tag, brief });
  return blocksDoDont(scope, { json, tag, brief });
}

/** `blocks snippet` — every copy-paste recipe, and what each leaves to runtime. */
function blocksSnippet(scope, { json, tag, brief }) {
  const h = harvestSnippets(scope);
  if (json) {
    console.log(JSON.stringify({ recipes: h.recipes, harvested: h.harvested, seen: h.seen }, null, 2));
    return;
  }
  let n = 0;
  for (const r of h.recipes) {
    n++;
    console.log(`=== ${r.id} · ${r.tab} · snippet ${n} ===`);
    console.log(`under: ${r.under || '(no heading above it)'}`);
    console.log(
      `lines: ${r.lines}` +
        (r.generated
          ? ' — generated at runtime, nothing to copy from here'
          : r.live.length
            ? ` · ${r.live.length} value(s) still computed at runtime: ${r.live.join(', ')}`
            : ''),
    );
    if (!brief && !r.generated)
      console.log(
        r.code
          .split('\n')
          .map((l) => '  | ' + l)
          .join('\n'),
      );
    console.log('');
  }
  const literal = h.recipes.filter((r) => r.live.length === 0).length;
  const generated = h.recipes.filter((r) => r.generated).length;
  console.error(
    `[blocks snippet${tag ? ` --tag ${tag}` : ''}] ${h.harvested}/${h.seen} recipes harvested · ` +
      `${literal} literal · ${h.harvested - literal - generated} partly live · ${generated} generated at runtime · ` +
      `${h.guidesWith.length}/${scope.length} guides${brief ? ' · --brief: code omitted' : ''}.`,
  );
}

/** `blocks source` — the evidence the whole corpus rests on, in one call. */
function blocksSource(scope, { json, tag, brief }) {
  const h = harvestSources(scope);
  if (json) {
    console.log(JSON.stringify({ notes: h.notes, harvested: h.harvested, seen: h.seen }, null, 2));
    return;
  }
  let n = 0;
  for (const s of h.notes) {
    n++;
    console.log(`=== ${s.id} · ${s.tab} · source ${n} ===`);
    console.log(`under: ${s.under || '(no heading above it)'}`);
    if (s.cites.length) console.log(`cites: ${s.cites.join(' · ')}`);
    console.log(
      brief && s.text.length > BRIEF_CHARS ? s.text.slice(0, s.text.lastIndexOf(' ', BRIEF_CHARS)) + ' …' : s.text,
    );
    console.log('');
  }
  const artefacts = new Set(h.notes.flatMap((s) => s.cites));
  console.error(
    `[blocks source${tag ? ` --tag ${tag}` : ''}] ${h.harvested}/${h.seen} notes harvested · ` +
      `${artefacts.size} distinct artifact(s) cited · ${h.guidesWith.length}/${scope.length} guides` +
      `${brief ? ` · --brief: notes cut to ${BRIEF_CHARS} chars` : ''}.`,
  );
}

/** `blocks table` — the measured numbers of the whole corpus, in one call. */
function blocksTable(scope, { json, tag, brief }) {
  const h = harvestTables(scope);
  if (json) {
    console.log(JSON.stringify({ tables: h.blocks, harvested: h.harvested, seen: h.seen }, null, 2));
    return;
  }
  let n = 0;
  for (const b of h.blocks) {
    n++;
    console.log(`=== ${b.id} · ${b.tab} · table ${n} ===`);
    console.log(`caption: ${b.caption || '(no heading above it)'}`);
    console.log(`columns: ${b.columns.join(' | ') || '(no header row)'}`);
    console.log(`rows: ${b.rows.length}${b.dynamic ? ' literal, plus rows generated at runtime' : ''}`);
    if (!brief) for (const r of b.rows) console.log('  | ' + r.join(' | '));
    if (b.source) console.log(`source: ${b.source}`);
    console.log('');
  }
  console.error(
    `[blocks table${tag ? ` --tag ${tag}` : ''}] ${h.harvested}/${h.seen} tables harvested · ` +
      `${h.guidesWith.length}/${scope.length} guides${brief ? ' · --brief: rows omitted' : ''}.`,
  );
}

/** `blocks dodont` — every rendered do/don't pair with its rationale. */
function blocksDoDont(scope, { json, tag, brief }) {
  const h = harvestDoDont(scope);
  if (json) {
    console.log(JSON.stringify({ pairs: h.pairs, orphans: h.orphans, cells: h.cellsHarvested }, null, 2));
    return;
  }
  let n = 0;
  for (const p of h.pairs) {
    n++;
    console.log(`=== ${p.id} · ${p.tab} · pair ${n} ===`);
    for (const c of p.cells) {
      console.log(`[${c.kind}] ${c.label || '(label is computed at runtime)'}`);
      if (c.why) console.log(`  why: ${c.why}`);
      if (c.markup && !brief)
        console.log(
          c.markup
            .split('\n')
            .map((l) => '  | ' + l)
            .join('\n'),
        );
    }
    console.log('');
  }
  for (const o of h.orphans) {
    console.log(`=== ${o.id} · ${o.tab} · unpaired cell ===`);
    console.log(`[${o.cell.kind}] ${o.cell.label}`);
    if (o.cell.why) console.log(`  why: ${o.cell.why}`);
    console.log('');
  }
  console.error(
    `[blocks dodont${tag ? ` --tag ${tag}` : ''}] ${h.cellsHarvested}/${h.cellsSeen} cells harvested · ${h.pairs.length} pair(s)` +
      `${h.orphans.length ? ` · ${h.orphans.length} unpaired` : ''} · ${h.guidesWithPairs.length}/${scope.length} guides.`,
  );
}

/** D3 — a guide plus its related closure, in one call. */
function cmdBundle(guides, id, { depth, includeTabs, json }) {
  const root = findDoc(guides, id);
  if (!root) fail(`Unknown guide id "${id}". Known ids: ${knownIds(guides)}`);
  const graph = relatedGraph(guides);
  const closure = relatedClosure(graph, id, depth);
  const byId = new Map(guides.map((g) => [g.id, g]));
  const members = [...closure.entries()].map(([mid, info]) => {
    const g = byId.get(mid);
    return {
      id: mid,
      depth: info.depth,
      edge: info.edge,
      via: info.via,
      summary: String(g.fm.summary || ''),
      whenToUse: extractSection(g.raw, 'when to use'),
      whenNotToUse: extractSection(g.raw, 'when not to use'),
      ...(includeTabs ? { tabs: g.fm.tabs || {} } : {}),
    };
  });
  const deadHere = graph.dead.filter((d) => d.from === id || closure.has(d.from));
  const plannedHere = graph.planned.filter((d) => d.from === id || closure.has(d.from));
  if (json) {
    console.log(
      JSON.stringify({ id, depth, doc: root.raw, related: members, dead: deadHere, planned: plannedHere }, null, 2),
    );
    return;
  }
  const out = [];
  out.push(`=== bundle: ${id} · depth ${depth} · ${members.length} related guide(s) ===`);
  out.push('');
  out.push(root.raw.trim());
  out.push('');
  for (const m of members) {
    const origin = m.edge === 'category' ? 'category rule' : m.edge;
    out.push(`--- related: ${m.id} · ${origin}${m.via ? ` via ${m.via}` : ''} · depth ${m.depth} ---`);
    out.push(`summary: ${m.summary}`);
    if (m.whenToUse) out.push(m.whenToUse);
    if (m.whenNotToUse) out.push(m.whenNotToUse);
    if (includeTabs && m.tabs) {
      out.push('tabs:');
      for (const [t, line] of Object.entries(m.tabs)) out.push(`  ${t}: ${line}`);
    }
    out.push('');
  }
  const text = out.join('\n');
  console.log(text);
  const notes = [
    `[bundle ${id}] ${text.length.toLocaleString('en-US')} B in one call · edges: direct/reverse/category`,
  ];
  if (deadHere.length) {
    notes.push(
      `[bundle ${id}] filtered ${deadHere.length} related id(s) that name no guide and carry no "${PLANNED_PREFIX}" prefix: ${deadHere.map((d) => `${d.id} (from ${d.from})`).join(', ')}`,
    );
  }
  if (plannedHere.length) {
    notes.push(
      `[bundle ${id}] planned, not built yet: ${plannedHere.map((d) => `${d.id} (from ${d.from})`).join(', ')}`,
    );
  }
  const foundations = guides.filter((g) => g.fm.category === 'foundations').length;
  if (foundations === 0) {
    notes.push(`[bundle ${id}] category rule library ↔ foundations added nothing: 0 foundations guides exist.`);
  }
  for (const n of notes) console.error(n);
}

function cmdTab(guides, id, tab, { raw }) {
  const g = findDoc(guides, id);
  if (!g) fail(`Unknown guide id "${id}". Known ids: ${knownIds(guides)}`);
  const file = articleFileFor(id);
  if (!file || !fs.existsSync(file)) {
    fail(`Guide "${id}": article component not found${file ? ` — ${rel(file)}` : ' in article-registry.ts'}.`);
  }
  const src = articleSource(id);
  const available = tabsIn(src);
  if (!tab)
    fail(`Missing tab. Usage: design-guides tab ${id} <tab>. Tabs in "${id}": ${available.join(', ') || '(none)'}`);
  const res = tabBody(id, tab, { raw });
  if (res.error === 'no-tab') fail(`No tab "${tab}" in "${id}". Tabs in "${id}": ${available.join(', ') || '(none)'}`);
  if (res.error === 'unbalanced')
    fail(`Tab "${tab}" in "${id}": no matching </ng-template> — the article's markup is unbalanced.`);
  // The provenance note goes to stderr so a redirect keeps stdout pure markup.
  console.error(
    `[tab ${id}/${tab}] article markup from ${rel(file)} — ` +
      (raw
        ? 'raw: Angular bindings are NOT resolved; the `m` constant they read lives in that same file.'
        : `${res.resolved} interpolation(s) resolved from the component's string constants; ` +
          `${res.unresolved.length} computed at runtime and left verbatim${res.unresolved.length ? `: ${res.unresolved.slice(0, 8).join(', ')}${res.unresolved.length > 8 ? ', …' : ''}` : ''}.`),
  );
  console.log(res.body);
}

// --- Search -----------------------------------------------------------------

const SCOPES = ['docs', 'tabs', 'kit', 'all'];

/**
 * A hit line LOCATES a passage; it is not the passage. Tab markup lines run to
 * several hundred characters, so a hit is cut here and the passage fetched in
 * full with `tab <id> <tab>` — a locator that costs a page of markup per hit is
 * the problem `search` exists to solve.
 */
const MAX_HIT_LINE = 200;

function corpusSizes(guides, kit) {
  const docs = guides.reduce((n, g) => n + g.raw.length, 0);
  let tabs = 0;
  let tabCount = 0;
  for (const g of guides) {
    const src = articleSource(g.id);
    if (!src) continue;
    for (const t of tabsIn(src)) {
      const r = extractTab(src, t);
      if (r.balanced) {
        tabs += r.body.length;
        tabCount++;
      }
    }
  }
  const kitBytes = kit.reduce((n, d) => n + d.raw.length, 0);
  return { docs, tabs, tabCount, kit: kitBytes, total: docs + tabs + kitBytes };
}

/**
 * D4 — search every layer by default, and never report an out-of-scope miss as
 * an absence. A miss says which scopes were read and which were not; a confident
 * "no such thing" makes an agent re-derive a rule the kit already documents.
 */
function cmdSearch(guides, kit, term, { scope, limit, json }) {
  const needle = term.trim().toLowerCase();
  if (!needle) fail('Missing term. Usage: design-guides search <term> [--scope docs|tabs|kit|all]');
  const want = (s) => scope === 'all' || scope === s;
  const hits = [];
  if (want('docs')) {
    for (const g of guides) {
      let section = '(frontmatter)';
      for (const line of g.raw.split(/\r?\n/)) {
        const h2 = /^##\s+(.*)$/.exec(line);
        if (h2) section = h2[1].trim();
        if (line.toLowerCase().includes(needle))
          hits.push({ scope: 'docs', id: g.id, where: section, line: line.trim() });
      }
    }
  }
  if (want('tabs')) {
    for (const g of guides) {
      const src = articleSource(g.id);
      if (!src) continue;
      const consts = parseStringConstants(src);
      for (const t of tabsIn(src)) {
        const r = extractTab(src, t);
        if (!r.balanced) continue;
        const body = resolveInterpolations(r.body, consts).text;
        let h3 = t;
        for (const line of body.split(/\r?\n/)) {
          const m = /<h3[^>]*>(.*?)<\/h3>/.exec(line);
          if (m) h3 = `${t} › ${plainText(m[1])}`;
          if (line.toLowerCase().includes(needle)) hits.push({ scope: 'tabs', id: g.id, where: h3, line: line.trim() });
        }
      }
    }
  }
  if (want('kit')) {
    for (const d of kit) {
      let section = '(frontmatter)';
      for (const line of d.raw.split(/\r?\n/)) {
        const h2 = /^##\s+(.*)$/.exec(line);
        if (h2) section = h2[1].trim();
        if (line.toLowerCase().includes(needle))
          hits.push({ scope: 'kit', id: d.id, where: section, line: line.trim() });
      }
    }
  }
  const sizes = corpusSizes(guides, kit);
  const covered = (want('docs') ? sizes.docs : 0) + (want('tabs') ? sizes.tabs : 0) + (want('kit') ? sizes.kit : 0);
  const pct = (n) => `${((n / sizes.total) * 100).toFixed(1)} %`;
  if (hits.length === 0) {
    const read = [];
    const skipped = [];
    (want('docs') ? read : skipped).push(
      `docs (${guides.length} agent docs, ${sizes.docs.toLocaleString('en-US')} B, ${pct(sizes.docs)})`,
    );
    (want('tabs') ? read : skipped).push(
      `tabs (${sizes.tabCount} tabs, ${sizes.tabs.toLocaleString('en-US')} B, ${pct(sizes.tabs)})`,
    );
    (want('kit') ? read : skipped).push(
      `kit (${kit.length} docs, ${sizes.kit.toLocaleString('en-US')} B, ${pct(sizes.kit)})`,
    );
    const lines = [
      `No match for "${term}".`,
      `  searched : ${read.join(' · ')}`,
      `  excluded : ${skipped.length ? skipped.join(' · ') : 'nothing — this is the whole documented corpus'}`,
    ];
    lines.push(
      skipped.length
        ? `  ${pct(sizes.total - covered)} of the corpus was NOT read. Re-run with --scope all before concluding the kit is silent on this.`
        : `  The term is absent from all ${sizes.total.toLocaleString('en-US')} B of design-system text — absent, not out of scope.`,
    );
    console.error(lines.join('\n'));
    process.exit(1);
  }
  if (json) {
    console.log(JSON.stringify(hits.slice(0, limit), null, 2));
    if (hits.length > limit) console.error(`[search] ${hits.length} hits, ${limit} shown (--limit N).`);
    return;
  }
  // `--limit` caps OUTPUT LINES here (group headers included), so the cap means
  // what a reader pays, not what the matcher counted.
  let printed = 0;
  let shownHits = 0;
  let lastKey = '';
  for (const h of hits) {
    const key = `${h.id} ${h.scope} ${h.where}`;
    const cost = key === lastKey ? 1 : 2;
    if (printed + cost > limit) break;
    if (key !== lastKey) {
      console.log(`${h.id}  ·  ${h.scope}  ·  ${h.where}`);
      lastKey = key;
    }
    console.log(`  ${h.line.length > MAX_HIT_LINE ? h.line.slice(0, MAX_HIT_LINE) + ' …' : h.line}`);
    printed += cost;
    shownHits++;
  }
  const shown = hits.slice(0, shownHits);
  const perScope = SCOPES.filter((s) => s !== 'all')
    .map((s) => `${s} ${hits.filter((h) => h.scope === s).length}`)
    .join(' · ');
  console.error(
    `[search "${term}"] ${hits.length} hit(s) — ${perScope}${hits.length > shown.length ? ` · ${hits.length - shown.length} more not shown (--limit N)` : ''}` +
      ` · scope ${scope} covers ${pct(covered)} of the corpus.`,
  );
}

/** D7 — one call that says what the design system covers at all. */
function cmdTopics(guides, kit) {
  const sizes = corpusSizes(guides, kit);
  const entries = registryEntries();
  const catOf = new Map(entries.map((e) => [e.id, e.category]));
  const declared = declaredCategories();
  const cats = new Map(declared.map((c) => [c, []]));
  for (const g of guides) {
    const c = g.fm.category || catOf.get(g.id) || '(none)';
    if (!cats.has(c)) cats.set(c, []);
    cats.get(c).push(g.id);
  }
  const tabTally = new Map();
  let tabTotal = 0;
  for (const g of guides) {
    const src = articleSource(g.id);
    if (!src) continue;
    for (const t of tabsIn(src)) {
      tabTally.set(t, (tabTally.get(t) || 0) + 1);
      tabTotal++;
    }
  }
  const kb = (n) => `${Math.round(n / 1024).toLocaleString('en-US')} KB`;
  console.log(
    `design-system coverage map — 2 layers, ${guides.length + kit.length} docs, ${kb(sizes.total)} of queryable text`,
  );
  console.log('');
  console.log(
    `GUIDES  ${rel(GUIDES_DIR)}/*.agent.md — ${guides.length} docs, ${kb(sizes.docs)} contract + ${kb(sizes.tabs)} article tabs`,
  );
  for (const [c, ids] of cats) {
    console.log(
      `  ${c.padEnd(12)} ${String(ids.length).padStart(3)}  ${ids.length ? ids.join(', ') : '— declared in the registry type, none written yet'}`,
    );
  }
  console.log(
    `  tabs         ${String(tabTotal).padStart(3)}  ${[...tabTally.entries()].map(([t, n]) => `${t} ${n}`).join(' · ')}`,
  );
  console.log(`  sections       9  ${headingsIn(guides[0]?.raw || '').join(' · ') || '(none)'}`);
  // The version pin, aggregated: one line when the corpus agrees, the split when
  // it does not — that split IS the answer to "is any guide measured against
  // something we no longer ship".
  const pins = new Map();
  for (const g of guides) {
    const pin = String(g.fm['measured-against'] || '(unpinned)');
    pins.set(pin, (pins.get(pin) || 0) + 1);
  }
  const pinText = [...pins.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([p, n]) => (pins.size === 1 ? p : `${p} ${n}`))
    .join(' · ');
  console.log(`  measured     ${String(guides.length).padStart(3)}  ${pinText || '(none)'}`);
  // The library inventory against the guides' own `covers:` lists — one line
  // here, the per-component answer under `coverage`.
  const cov = coverage(guides);
  const claiming = cov.byGuide.filter((g) => g.covers.length).length;
  const covLine = cov.installed
    ? `${cov.covered.size - cov.foreign.length} of ${cov.components.length} ${cov.library} components, in ${claiming} guides; ${cov.declined.length} declined on purpose${cov.undecided.length ? `, ${cov.undecided.length} undecided` : ''} — \`coverage\` lists them`
    : `${cov.covered.size} components claimed by ${claiming} guides — ${cov.library} not installed, inventory unknown`;
  console.log(`  covers       ${String(claiming).padStart(3)}  ${covLine}`);
  console.log('');
  console.log(`KIT     ${rel(KIT_DIR)}/*.md — ${kit.length} docs, ${kb(sizes.kit)}`);
  console.log(
    `  sections       ${headingsIn(kit[0]?.raw || '').length}  ${headingsIn(kit[0]?.raw || '').join(' · ') || '(none)'}`,
  );
  console.log(`  slugs        ${String(kit.length).padStart(3)}  ${kit.map((d) => d.id).join(', ')}`);
  console.log('');
  console.log('Query surface');
  console.log(
    `  cross-cut : sections <heading> · blocks <type> [${Object.keys(BLOCK_TYPES).join(' | ')}] · search <term> --scope all`,
  );
  console.log('  one topic : section <id> <heading> · bundle <id>');
  console.log('  depth     : show <id> · tab <id> <tab>');
  console.log('  layers    : --layer guides|kit|all (list/show/section/sections) · --scope docs|tabs|kit|all (search)');
  const missing = declared.filter((c) => (cats.get(c) || []).length === 0);
  if (missing.length) {
    console.log('');
    console.log(
      `Not covered by any guide: ${missing.join(', ')}. A search that misses here misses because the guide does not exist,`,
    );
    console.log('not because the term was wrong — `search --scope all` says which of the two it was.');
  }
}

/**
 * Which library components the guides explain, read off `covers:` — the number
 * a coverage report used to resolve by hand against guide titles. Prints the
 * inventory split (covered / declined on purpose, with the reason / undecided),
 * then each guide's list; `--json`
 * returns the structure. Foreign and shared claims are printed too, but the
 * GATE is what rejects them — this command reports, it does not judge.
 */
function cmdCoverage(guides, { json }) {
  const cov = coverage(guides);
  if (json) {
    console.log(
      JSON.stringify(
        {
          library: cov.library,
          installed: cov.installed,
          components: cov.components,
          covered: Object.fromEntries([...cov.covered].sort()),
          uncovered: cov.uncovered,
          declined: cov.declined && Object.fromEntries(cov.declined.map((c) => [c, DECLINED_COMPONENTS.get(c)])),
          undecided: cov.undecided,
          foreign: cov.foreign,
          shared: cov.shared,
          guides: cov.byGuide,
        },
        null,
        2,
      ),
    );
    return;
  }
  const claiming = cov.byGuide.filter((g) => g.covers.length);
  if (!cov.installed) {
    console.log(
      `${cov.library} is not installed — no inventory to count against; ${cov.covered.size} component(s) claimed by ${claiming.length} guide(s).`,
    );
  } else {
    const n = cov.covered.size - cov.foreign.length;
    const undecidedPart = cov.undecided.length ? ` + ${cov.undecided.length} undecided` : '';
    console.log(
      `${cov.library} — ${n} covered + ${cov.declined.length} declined${undecidedPart} = ${cov.components.length} components; covered by ${claiming.length} guide(s).`,
    );
    console.log('');
    console.log(`Declined on purpose (${cov.declined.length}):`);
    for (const c of cov.declined) console.log(`  ${c.padEnd(16)} ${DECLINED_COMPONENTS.get(c)}`);
    if (cov.undecided.length) {
      console.log(
        `Undecided (${cov.undecided.length}): ${cov.undecided.join(', ')} — cover it in a guide, or decline it in DECLINED_COMPONENTS with a reason.`,
      );
    }
  }
  console.log('');
  const wId = Math.max(2, ...claiming.map((g) => g.id.length));
  console.log(`${'guide'.padEnd(wId)}  n  covers`);
  console.log(`${'-'.repeat(wId)}  -  ${'-'.repeat(6)}`);
  for (const g of claiming) console.log(`${g.id.padEnd(wId)}  ${g.covers.length}  ${g.covers.join(', ')}`);
  const silent = cov.byGuide.filter((g) => !g.covers.length).map((g) => g.id);
  if (silent.length) console.log(`\nNo library component (${silent.length}): ${silent.join(', ')}`);
  if (cov.foreign.length)
    console.error(`[coverage] claimed but not in the inventory: ${cov.foreign.join(', ')} — the gate rejects these.`);
  for (const s of cov.shared)
    console.error(`[coverage] "${s.component}" is claimed by ${s.guides.join(' and ')} — the gate rejects this.`);
}

// --- Argument parsing -------------------------------------------------------

const USAGE = [
  'Usage:',
  '  design-guides topics                                   coverage map — what exists at all, both layers',
  '  design-guides coverage [--json]                        which library components the guides explain (`covers:`), and which none does',
  '  design-guides list [--json] [--layer L] [--tag T]      compact index: id · category · tags · related · summary',
  '  design-guides show <id> [--layer L]                    one full doc',
  '  design-guides section <id> <heading> [--json] [--layer L]    one section of one doc',
  '  design-guides sections <heading> [--json] [--layer L] [--tag T]   that heading across every doc — ONE call',
  `  design-guides blocks <type> [--json] [--tag T] [--brief]   typed blocks across every article (types: ${Object.keys(BLOCK_TYPES).join(', ')})`,
  '  design-guides bundle <id> [--depth N] [--include-tabs] [--json]   a guide + its related closure',
  '  design-guides tab <id> <tab> [--raw]                   one article tab, interpolations resolved',
  '  design-guides search <term> [--scope S] [--limit N] [--json]      docs + tabs + kit; --limit caps output LINES (200)',
  '',
  '  L = guides | kit | all        S = docs | tabs | kit | all',
  '  A term that begins with dashes goes after `--`:  design-guides search -- --primary-color',
].join('\n');

const COMMANDS = {
  topics: { boolean: [], value: [] },
  coverage: { boolean: ['json'], value: [] },
  list: { boolean: ['json'], value: ['layer', 'tag'] },
  show: { boolean: [], value: ['layer'] },
  section: { boolean: ['json'], value: ['layer'] },
  sections: { boolean: ['json'], value: ['layer', 'tag'] },
  blocks: { boolean: ['json', 'brief'], value: ['tag'] },
  bundle: { boolean: ['include-tabs', 'json'], value: ['depth'] },
  tab: { boolean: ['raw'], value: [] },
  search: { boolean: ['json'], value: ['scope', 'limit'] },
};

/**
 * Positionals and flags, with unknown flags REJECTED.
 *
 * A silently ignored flag (`list --tag form` used to return the unfiltered list)
 * is worse than a rejected one: the agent reads the unfiltered result as a
 * filtered answer.
 */
function parseArgs(argv, spec, cmd) {
  const positionals = [];
  const flags = {};
  let noMoreFlags = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (noMoreFlags || !a.startsWith('--')) {
      positionals.push(a);
      continue;
    }
    if (a === '--') {
      noMoreFlags = true;
      continue;
    }
    const eq = a.indexOf('=');
    const name = (eq > 0 ? a.slice(2, eq) : a.slice(2)).toLowerCase();
    const inline = eq > 0 ? a.slice(eq + 1) : null;
    if (spec.boolean.includes(name)) {
      if (inline !== null) fail(`Flag --${name} takes no value.\n\n${USAGE}`);
      flags[name] = true;
      continue;
    }
    if (spec.value.includes(name)) {
      const v = inline !== null ? inline : argv[++i];
      if (v === undefined) fail(`Flag --${name} needs a value.\n\n${USAGE}`);
      flags[name] = v;
      continue;
    }
    const known = [...spec.boolean, ...spec.value].map((f) => '--' + f).join(', ') || '(none)';
    fail(
      `Unknown flag "--${name}" for "${cmd}". Flags for "${cmd}": ${known}.\n` +
        `To pass a literal argument that begins with dashes, end the flags first: design-guides ${cmd} -- --${name}\n\n${USAGE}`,
    );
  }
  return { positionals, flags };
}

function pickEnum(value, allowed, flag) {
  if (value === undefined) return allowed[0];
  if (!allowed.includes(value)) fail(`Invalid --${flag} "${value}". Allowed: ${allowed.join(', ')}`);
  return value;
}

function pickInt(value, fallback, flag) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(String(value))) fail(`Invalid --${flag} "${value}". Expected a whole number.`);
  return Number(value);
}

const DEFAULT_SEARCH_LIMIT = 200;

function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  if (!cmd || !(cmd in COMMANDS)) {
    fail(cmd ? `Unknown command "${cmd}".\n\n${USAGE}` : USAGE);
  }
  const { positionals, flags } = parseArgs(argv.slice(1), COMMANDS[cmd], cmd);
  const guides = loadGuides();
  const kit = loadKitDocs();

  switch (cmd) {
    case 'topics':
      cmdTopics(guides, kit);
      break;
    case 'coverage':
      cmdCoverage(guides, { json: !!flags.json });
      break;
    case 'list':
      cmdList(guides, kit, {
        json: !!flags.json,
        layer: pickEnum(flags.layer, ['guides', 'kit', 'all'], 'layer'),
        tag: flags.tag,
      });
      break;
    case 'show':
      if (!positionals[0]) fail('Usage: design-guides show <id> [--layer guides|kit|all]');
      cmdShow(guides, kit, positionals[0], pickEnum(flags.layer, ['all', 'guides', 'kit'], 'layer'));
      break;
    case 'section':
      if (!positionals[0]) fail('Usage: design-guides section <id> <heading> [--layer guides|kit|all]');
      cmdSection(guides, kit, positionals[0], positionals.slice(1).join(' '), {
        json: !!flags.json,
        layer: pickEnum(flags.layer, ['all', 'guides', 'kit'], 'layer'),
      });
      break;
    case 'sections':
      cmdSections(guides, kit, positionals.join(' '), {
        json: !!flags.json,
        layer: pickEnum(flags.layer, ['guides', 'kit', 'all'], 'layer'),
        tag: flags.tag,
      });
      break;
    case 'blocks':
      cmdBlocks(guides, positionals[0], { json: !!flags.json, tag: flags.tag, brief: !!flags.brief });
      break;
    case 'bundle':
      if (!positionals[0]) fail('Usage: design-guides bundle <id> [--depth N] [--include-tabs]');
      cmdBundle(guides, positionals[0], {
        depth: pickInt(flags.depth, 1, 'depth'),
        includeTabs: !!flags['include-tabs'],
        json: !!flags.json,
      });
      break;
    case 'tab':
      if (!positionals[0]) fail('Usage: design-guides tab <id> <tab> [--raw]');
      cmdTab(guides, positionals[0], positionals.slice(1).join(' ').trim(), { raw: !!flags.raw });
      break;
    case 'search':
      if (!positionals.length)
        fail('Usage: design-guides search <term> [--scope docs|tabs|kit|all] [--limit N] [--json]');
      cmdSearch(guides, kit, positionals.join(' '), {
        scope: pickEnum(flags.scope, ['all', 'docs', 'tabs', 'kit'], 'scope'),
        limit: pickInt(flags.limit, DEFAULT_SEARCH_LIMIT, 'limit'),
        json: !!flags.json,
      });
      break;
  }
}

// Run only as a program; `check-design-guides.mjs` imports the harvest and the
// constant parser so the gate asserts THIS parser, never a copy of it.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
