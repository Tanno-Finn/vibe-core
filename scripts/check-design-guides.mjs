#!/usr/bin/env node
/**
 * check-design-guides — the "Guides" self-maintenance gate (SPEC N5, Guides
 * extension).
 *
 * The guide-article counterpart to check-design-system.mjs. Fails (exit 1) when
 * the guide registry, the article components, the canonical agent docs, and the
 * routes have drifted:
 *   1. A registry entry's article component file is missing (from its import path).
 *   2. A registry entry's `<id>.agent.md` is missing.
 *   3. An agent doc's frontmatter is incomplete or its `id` disagrees with the registry.
 *   4. An agent doc is missing one of the nine mandatory sections.
 *   5. A `guides/*.agent.md` on disk has no registry entry (orphan).
 *   6. A registry entry has no generated route (`dev/design/guide/<id>`) in dev.routes.ts.
 *   7. A registry entry's `related` list disagrees with the doc frontmatter's, or
 *      names a non-kebab-case id.
 *   8. The doc's `tabs:` map and the article's `appGuideTab` templates disagree —
 *      in either direction — or a declared tab cannot actually be sliced out.
 *   9. A guide cites a kit file or component selector that does not exist.
 *  10. An agent doc exceeds the byte ceiling the authoring contract states —
 *      8,500 B for one covered component plus 1,500 B per further one, the aim
 *      2,000 B under it (a contract obeyed from memory drifts upward, and the
 *      corpus had drifted to within 1 byte of the cap).
 *  11. A `related` id names neither an existing guide nor a `planned:` target —
 *      forward references are legitimate, but the CLI cannot tell an intended
 *      forward reference from a typo unless the intent is written down.
 *  12. The do/don't harvest contract: every `dd__cell` marker in the tree is
 *      recognised by `design-guides.mjs blocks dodont`, and every guide with a
 *      Usage tab yields at least one pair.
 *  13. `measured-against:` is missing (via REQUIRED_FRONTMATTER) or is not a
 *      `<package>@<version>` pin — the guide must say which shipped build its
 *      line numbers and dead-API findings were read off.
 *  14. The reference-table harvest contract: every `<table>` in a tab body sits
 *      inside a `table-wrap` that `design-guides.mjs blocks table` recognises.
 *  15. The provenance-note harvest contract: every `src-note` marker in the tree
 *      is recognised by `design-guides.mjs blocks source`.
 *  16. The code-recipe harvest contract: every `code-block` marker in the tree is
 *      recognised by `design-guides.mjs blocks snippet`.
 *  17. `covers:` — the library components a guide explains — is missing, is not
 *      a list, is empty on a `library` guide, names something the installed
 *      library does not export as a component, omits the component the guide is
 *      named after, or claims a component another guide already claims. The
 *      list sets the ceiling of check 10 and is what `design-guides.mjs coverage`
 *      counts, so a generous list buys room AND inflates the coverage figure.
 *      Its counterpart, DECLINED_COMPONENTS (design-guides.mjs), names what the
 *      corpus leaves out on purpose; an entry fails without a reason, when it is
 *      not a component, when a guide covers it after all, or when
 *      docs/DESIGN-SYSTEM.MD does not record it. A component neither covered nor
 *      declined is a warning.
 *  18. The agent doc does not close with the standard pointer line, word for word
 *      (guide-authoring.md). An ERROR since 2026-09-23, when the last guide
 *      (feedback-messages) was brought in line; see POINTER_SEVERITY.
 *
 * Checks 8 and 9 exist because the agent doc is a CONTRACT and the article tabs
 * are the depth behind it: the doc promises, per tab, what an agent will find if
 * it spends the tokens (`design-guides.mjs tab <id> <tab>`). A promise pointing
 * at a tab that was renamed, or prose citing a file that was deleted, is worse
 * than no pointer — it costs a fetch and returns nothing. The concrete regression
 * that motivated check 9: a guide went on citing `glossary-tooltip.component.ts`
 * after that file was deleted, and nothing noticed.
 *
 * Dependency-free (Node core only) — no ts-node. It parses article-registry.ts
 * as TEXT per that file's PARSER CONTRACT (fixed field order, single-quoted
 * scalars, single-line tags, single-line `import('...')`). Each entry is checked
 * against that contract before the parse, so a break (a double-quoted summary,
 * say) fails naming the entry and the rule instead of misaligning the parse.
 *
 * The harvest contracts (12, 14, 15, 16) IMPORT the harvesters from `design-guides.mjs`
 * rather than copying them. The frontmatter and tab-slicing parses are duplicated
 * on purpose (two small, stable text parses, no shared module), but a harvest
 * contract that asserted a COPY of the parser would assert nothing: the point is
 * that the markup the CLI actually serves stays complete.
 *
 * Usage:  node scripts/check-design-guides.mjs
 *         SELFTEST=1 additionally runs the detectors against synthetic markup and
 *         fails if a planted violation is NOT flagged: check 9 against a guide
 *         citing a deleted file and a deleted selector (while bundle shorthands such
 *         as `password.mjs` stay silent), the registry contract against a
 *         double-quoted summary, and each harvest contract
 *         against a block whose marker has been renamed. A gate that never fires
 *         is indistinguishable from a gate that cannot fire.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadGuides,
  harvestDoDont,
  harvestTables,
  harvestTablesIn,
  countTableMarkers,
  harvestSources,
  harvestSourcesIn,
  countSourceMarkers,
  harvestSnippets,
  harvestSnippetsIn,
  countSnippetMarkers,
  PLANNED_PREFIX,
  LIBRARY_PACKAGE,
  LIBRARY_INFRASTRUCTURE,
  DECLINED_COMPONENTS,
  libraryEntrypoints,
  coverage,
  declinedProblems,
} from './design-guides.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARTICLES_DIR = path.join(ROOT, 'src', 'app', 'dev', 'articles');
const REGISTRY_FILE = path.join(ARTICLES_DIR, 'article-registry.ts');
const GUIDES_DIR = path.join(ROOT, 'src', 'assets', 'design-system', 'guides');
const ROUTES_FILE = path.join(ROOT, 'src', 'app', 'dev', 'dev.routes.ts');

const REQUIRED_FRONTMATTER = ['id', 'title', 'category', 'tags', 'summary', 'related', 'tabs', 'measured-against'];

/**
 * The version pin's shape: `<package>@<version>`.
 *
 * A guide's authority is that its claims were read off a shipped bundle — line
 * numbers, dead inputs, tokens with no reader. Which BUILD it was read off was
 * only ever in the prose, unevenly, so nothing could answer "is this guide still
 * measured against what we ship" without a human reading twenty documents. The
 * field makes it one query (`list --json`, `topics`) and this check makes it a
 * field that cannot be forgotten. The shape is enforced loosely on purpose: it
 * must name a package and a version, not conform to semver's full grammar.
 */
const MEASURED_AGAINST = /^@?[a-z0-9][a-z0-9._/-]*@[0-9][A-Za-z0-9.+-]*$/;
/** A tab's curated line says what is IN the tab; longer than this is an abstract. */
const MAX_TAB_LINE = 140;
const REQUIRED_SECTIONS = [
  'When to use',
  'When not to use',
  'Key API',
  'Accessibility',
  'Pitfalls',
  'Sources',
  'Semantic mapping',
  'Rules',
  'Default snippet',
];

/** A guide id (and every `related` entry) must be kebab-case. */
const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * The agent doc's byte contract, from `directives/guide-authoring.md`: aim for
 * ≲6 KB, never exceed 8 KB. Stated as prose it drifted — 19 of 20 docs sat over
 * the aim and twelve within 200 bytes of the ceiling. The WARN band is the aim
 * plus a working margin; the FAIL line is the ceiling itself.
 *
 * Measured over the AUTHORED BODY, frontmatter excluded. The frontmatter is not
 * prose an author can trim: every field in it is gate-checked against the
 * registry, and check 11's own `planned:` markers add bytes to it. A budget an
 * author cannot spend does not belong in their budget.
 *
 * The FAIL line was 8000 until 2026-09-06, when the `menu` fix round measured
 * what that costs: correcting one wrong, security-relevant claim needed ~470 B,
 * and the only way to pay for it under the old ceiling was to delete three
 * correct source annotations. A ceiling that funds itself by discarding evidence
 * is set too low, so it moved to 8500 — the measured cost of one blocker fix on
 * top of the old line. The 6500 aim is unchanged: headroom for provenance, not
 * licence for prose.
 *
 * Since 2026-09-07 the ceiling is per COVERED COMPONENT, read off the doc's
 * `covers:` list (check 17). One wave after the raise, the three guides at the
 * cap were the three that carry three components each (`dataview`, `listbox`,
 * `tree`: 9, 11 and 52 B of room), and the `listbox` fix had already paid for a
 * blocker by dropping a sourced accessibility fact — a fixed line taxed the
 * size of the subject, not the prose. The slope is measured, not guessed: in
 * the two-component guides that were NOT pressed against the cap, the sibling's
 * share of Key API + Accessibility + Pitfalls is 1.2–3.4 KB (median 2.1 KB;
 * `badge`/`overlaybadge` 1.2, `stepper`/`steps` 1.9, `progress` 2.2,
 * `fieldset` 2.4, `feedback-messages` 3.0, `confirmdialog` 3.4), while a
 * component alone spends a median 4.3 KB on the same three sections. 1,500 B
 * sits in the lower third of the sibling range — room for one more contract
 * at the density the corpus already writes siblings, not for a second
 * standalone treatment. The aim moves by the same step so the 2,000 B band
 * between aim and ceiling — headroom for provenance — is the same for every
 * guide. A one-component guide is exactly where it was: 8500 / 6500.
 */
const AGENT_DOC_BASE_BYTES = 8500;
const AGENT_DOC_PER_EXTRA_COMPONENT = 1500;
const AGENT_DOC_AIM_GAP = 2000;

/** The FAIL line for a doc that covers `n` components; `n` ≤ 1 is the base line. */
function docCeiling(n) {
  return AGENT_DOC_BASE_BYTES + AGENT_DOC_PER_EXTRA_COMPONENT * Math.max(0, n - 1);
}

/** The WARN line, a constant band under the ceiling. */
function docAim(n) {
  return docCeiling(n) - AGENT_DOC_AIM_GAP;
}

/** A covered component is one entrypoint name: lowercase, letters and digits. */
const COMPONENT_NAME = /^[a-z][a-z0-9]*$/;

/**
 * Check 17 — what is wrong with one guide's `covers:` list, as messages.
 *
 * `inventory` is the installed library's entrypoint set, or null when the package
 * is absent; then only the shape rules run and the caller reports the blind spot
 * once. The same-component-twice case across guides is checked by the caller,
 * which sees every list.
 */
function coversProblems(id, category, covers, inventory) {
  const out = [];
  if (covers === undefined)
    return [
      `guide "${id}": frontmatter missing covers — list the library components this guide explains, or [] for a guide with none.`,
    ];
  if (!Array.isArray(covers))
    return [`guide "${id}": frontmatter covers must be a list ([a, b] or []), got "${covers}".`];
  if (category === 'library' && covers.length === 0) {
    out.push(`guide "${id}": a library guide must cover at least one component (covers: []).`);
  }
  const seen = new Set();
  for (const c of covers) {
    if (!COMPONENT_NAME.test(c)) {
      out.push(
        `guide "${id}": covers entry "${c}" is not an entrypoint name (lowercase letters and digits, e.g. treetable).`,
      );
      continue;
    }
    if (seen.has(c)) out.push(`guide "${id}": covers lists "${c}" twice.`);
    seen.add(c);
    if (inventory && !inventory.has(c)) {
      out.push(
        `guide "${id}": covers "${c}", which ${LIBRARY_PACKAGE} does not export — a typo, or an entrypoint that no longer ships.`,
      );
    } else if (LIBRARY_INFRASTRUCTURE.has(c)) {
      out.push(
        `guide "${id}": covers "${c}", which is library infrastructure, not a component — it cannot be covered.`,
      );
    }
  }
  // A guide named after a component must claim it: `badge` covering only
  // `overlaybadge` is a mis-authored list, not a design choice.
  if (inventory && inventory.has(id) && !LIBRARY_INFRASTRUCTURE.has(id) && !covers.includes(id)) {
    out.push(`guide "${id}": is named after the "${id}" component but does not cover it.`);
  }
  return out;
}

/**
 * Doc bytes the author controls: everything after the frontmatter block, counted on
 * LF-normalised text — a CRLF checkout (Windows autocrlf) must not turn a passing guide
 * into a FAIL that a Linux clone of the same commit does not see.
 */
function authoredBytes(raw) {
  const text = raw.replace(/\r\n/g, '\n');
  const m = /^---\n[\s\S]*?\n---\n?/.exec(text);
  return Buffer.byteLength(m ? text.slice(m[0].length) : text, 'utf8');
}

const errors = [];
const warnings = [];
const ok = [];

// --- Guards ----------------------------------------------------------------
if (!fs.existsSync(REGISTRY_FILE)) {
  console.error(`FAIL  guide registry not found: ${REGISTRY_FILE}`);
  process.exit(1);
}
if (!fs.existsSync(ROUTES_FILE)) {
  console.error(`FAIL  dev.routes.ts not found: ${ROUTES_FILE}`);
  process.exit(1);
}

/** The registry fields in contract order; each scalar is a single-quoted literal. */
const REGISTRY_FIELDS = ['id', 'title', 'category', 'tags', 'summary', 'related', 'agentDocPath', 'loadComponent'];
const REGISTRY_SCALARS = new Set(['id', 'title', 'category', 'summary', 'agentDocPath']);

/**
 * Where an entry breaks the PARSER CONTRACT, one message per break, naming the
 * entry and the rule. The extraction regex below crosses entry boundaries
 * lazily: an entry whose summary is double-quoted does not fail to match, it
 * borrows the NEXT entry's summary and the rest of its fields, and the only
 * symptom used to be a confusing "frontmatter id disagrees" several checks
 * later. So each entry is checked against the contract on its own first, and
 * the gate reports the entry it actually is.
 */
function registryContractProblems(src) {
  const problems = [];
  // Only the array literal holds entries: the interface above it and the
  // helper types below it declare `id:` too. It closes with `];` at column 0.
  const open = Math.max(0, src.search(/articleRegistry\s*:[^=]*=\s*\[/));
  const close = src.slice(open).search(/^\];/m);
  const body = src.slice(open, close < 0 ? src.length : open + close);
  const starts = [...body.matchAll(/^[ \t]*id:[ \t]*(.*)$/gm)];
  starts.forEach((start, i) => {
    const chunk = body.slice(start.index, i + 1 < starts.length ? starts[i + 1].index : body.length);
    const idLit = /^'([^']+)',?\s*$/.exec(start[1].trim());
    const name = idLit ? `"${idLit[1]}"` : `at "id: ${start[1].trim()}"`;
    const rule = (what) =>
      problems.push(`article-registry.ts entry ${name}: ${what} — PARSER CONTRACT (top of article-registry.ts).`);
    let last = -1;
    for (const field of REGISTRY_FIELDS) {
      const at = new RegExp(`^[ \\t]*${field}:[ \\t]*(.*)$`, 'm').exec(chunk);
      if (!at) {
        rule(`field "${field}" is missing`);
        continue;
      }
      if (at.index < last) rule(`field "${field}" is out of order (the order is ${REGISTRY_FIELDS.join(', ')})`);
      last = at.index;
      const value = at[1].trim();
      if (REGISTRY_SCALARS.has(field) && !/^'[^']*',?$/.test(value)) {
        rule(`"${field}" must be ONE single-quoted string literal on its line, found ${value.slice(0, 40)}`);
      } else if ((field === 'tags' || field === 'related') && !/^\[.*\],?$/.test(value)) {
        rule(`"${field}" must be an array on ONE line`);
      } else if ((field === 'tags' || field === 'related') && /"/.test(value)) {
        rule(`"${field}" must list single-quoted strings`);
      } else if (field === 'loadComponent' && !/import\(\s*'[^']+'\s*\)/.test(value)) {
        rule(`"loadComponent" must be a ONE-line arrow with a single-quoted import('...') path`);
      }
    }
  });
  return problems;
}

/** Parse article-registry.ts entries from source text (PARSER CONTRACT). */
function parseRegistry(src) {
  const entries = [];
  const re =
    /id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'[\s\S]*?tags:\s*\[([^\]]*)\][\s\S]*?summary:\s*'([^']*)'[\s\S]*?related:\s*\[([^\]]*)\][\s\S]*?agentDocPath:\s*'([^']+)'[\s\S]*?import\(\s*'([^']+)'\s*\)/g;
  const splitList = (raw) =>
    raw
      .split(',')
      .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  let m;
  while ((m = re.exec(src)) !== null) {
    const [, id, title, category, tagsRaw, summary, relatedRaw, agentDocPath, importPath] = m;
    entries.push({
      id,
      title,
      category,
      tags: splitList(tagsRaw),
      summary,
      related: splitList(relatedRaw),
      agentDocPath,
      importPath,
    });
  }
  return entries;
}

/**
 * Parse a `---` frontmatter block into an object (string | string[] | object).
 *
 * Kept byte-identical in behaviour to the one in `design-guides.mjs`: the two
 * scripts are deliberately dependency-free and share no module, so the parse is
 * duplicated rather than imported. Values are scalars, single-line `[a, b]`
 * lists, or ONE level of indented block mapping — the shape `tabs:` uses.
 * Top-level keys may contain hyphens (`measured-against`).
 */
function parseFrontmatter(raw) {
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

// --- Tab slicing (mirrors design-guides.mjs) --------------------------------
// String slicing at the framework marker, not an Angular parse. `<ng-template>`
// nests inside tab bodies (the UI library's `pTemplate` slots), so the closing tag is
// found by depth counting.

/** Tab names an article delivers, in source order (duplicates preserved). */
function tabsIn(src) {
  return [...src.matchAll(/<ng-template\s+appGuideTab="([^"]+)"/g)].map((m) => m[1]);
}

/** One tab body, or `null` when it is absent or its markup is unbalanced. */
function extractTab(src, tab) {
  const esc = tab.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const open = new RegExp(`<ng-template\\s+appGuideTab="${esc}"\\s*>`).exec(src);
  if (!open) return null;
  const start = open.index + open[0].length;
  const tags = /<ng-template\b|<\/ng-template\s*>/g;
  tags.lastIndex = start;
  let depth = 1;
  let m;
  while ((m = tags.exec(src)) !== null) {
    if (m[0][1] === '/') {
      if (--depth === 0) return src.slice(start, m.index);
    } else {
      depth++;
    }
  }
  return null;
}

// --- Check 9 machinery: what the kit actually contains -----------------------
// Two indexes and two exemption rules, all derived from the tree and
// package.json — nothing hand-maintained, so they cannot go stale.

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', '.angular', 'coverage', '.vscode']);

/** Every file in the repo, by basename and by repo-relative path. */
function indexFiles() {
  const basenames = new Set();
  const paths = new Set();
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED_DIRS.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else {
        basenames.add(e.name);
        paths.add(path.relative(ROOT, p).replace(/\\/g, '/'));
      }
    }
  })(ROOT);
  return { basenames, paths };
}

/** Every component/directive selector declared under `src/`. */
function indexSelectors() {
  const selectors = new Set();
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED_DIRS.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.ts')) {
        for (const m of fs.readFileSync(p, 'utf8').matchAll(/selector:\s*'([^']+)'/g)) selectors.add(m[1]);
      }
    }
  })(path.join(ROOT, 'src'));
  return selectors;
}

/**
 * Package names of every declared dependency, unscoped and first segment only
 * (`@openng/optimus-ui` → `openng`, `chart.js` → `chart.js`). Used for both
 * exemptions below, so adding a library needs no edit here.
 */
function dependencyNames() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const names = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})];
  return new Set(names.map((n) => (n.startsWith('@') ? n.slice(1) : n).split('/')[0]));
}

/** Top-level repo directories — the marker of a path citation that is OURS. */
function topLevelDirs() {
  return new Set(
    fs
      .readdirSync(ROOT, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !IGNORED_DIRS.has(e.name))
      .map((e) => e.name),
  );
}

const FILES = indexFiles();
const SELECTORS = indexSelectors();
const DEPS = dependencyNames();
const TOP_DIRS = topLevelDirs();
/** First dash-segment of every kit `.mjs` basename (`check`, `verify`, …), from the tree. */
const KIT_MJS_PREFIXES = new Set(
  [...FILES.basenames].filter((b) => b.endsWith('.mjs') && b.includes('-')).map((b) => b.slice(0, b.indexOf('-'))),
);

/** A filename token, plus whatever path it sits in. */
const FILE_REF = /([A-Za-z0-9@._/~-]*\/)?([A-Za-z0-9][A-Za-z0-9._-]*\.(?:ts|scss|mjs|json))\b/g;
const SELECTOR_REF = /\bapp-[a-z0-9]+(?:-[a-z0-9]+)*\b/g;

/**
 * Kit file references that no longer resolve.
 *
 * IN SCOPE — the two shapes a guide uses to name one of OUR files:
 *   - a bare filename (`styles.scss`, `switch-options.ts`), matched by basename
 *     anywhere in the tree. Basename matching is deliberately loose: the question
 *     is "does this file still exist", and requiring the full path would flag
 *     every citation that names a file the way prose names files.
 *   - a repo-relative path whose first segment is a top-level directory of this
 *     repo (`src/app/utils/focus-return.ts`), matched exactly.
 *
 * OUT OF SCOPE — library citations, which name files under `node_modules`. That
 * tree is not the guides' integrity surface and is not guaranteed to be present
 * when the gate runs. Two forms, both recognised from package.json rather than a
 * hand-written list:
 *   - any path whose first segment is a declared dependency's package name, or
 *     an elided/foreign path that is not rooted in a top-level repo directory
 *     (`@openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs`, `…/aura/base/index.mjs`);
 *   - a bare flat-bundle filename `<package>-<entrypoint>.mjs|.d.ts`, the FESM
 *     naming convention (`openng-optimus-ui-select.mjs` is `@openng/optimus-ui`'s bundle). The guides
 *     cite these without a path, with a line number, throughout.
 *   - the SHORTHANDS prose uses for such a bundle: an elided tail
 *     (`…-tieredmenu.mjs`, `...-select.mjs`), which is a fragment of a longer
 *     name, never a filename of its own; and a bare entrypoint `.mjs`
 *     (`password.mjs`). A bare `.mjs` is read as OURS only when its stem starts
 *     with a prefix the kit's own `.mjs` files use (`check-`, `verify-`, …, see
 *     KIT_MJS_PREFIXES): the kit's scripts are all `<verb>-<object>.mjs`, a
 *     library entrypoint is one word. With a path (`scripts/check-x.mjs`) it is
 *     judged like any other repo path.
 */
function deadFileRefs(text) {
  const dead = new Set();
  for (const m of text.matchAll(FILE_REF)) {
    const dir = m[1] || '';
    const base = m[2];
    // An elided name: the match starts right after `-`, `…` or `.` (the regex
    // cannot start a basename on those, so it starts one character later).
    if (!dir && m.index > 0 && /[-….]/.test(text[m.index - 1])) continue;
    if (dir) {
      const full = (dir + base).replace(/^\.?\//, '');
      const first = full.split('/')[0];
      if (!TOP_DIRS.has(first)) continue; // library or elided path — out of scope
      if (!FILES.paths.has(full)) dead.add(full);
      continue;
    }
    if (FILES.basenames.has(base)) continue;
    // A bare `d.ts` is the declaration-file EXTENSION named in prose ("the d.ts
    // says …", "`.d.ts`"), not a file. The regex reads it as a basename because
    // `d` is a legal stem; a real declaration file always carries a longer name.
    if (base === 'd.ts') continue;
    const stem = base.replace(/\.(?:ts|scss|mjs|json)$/, '').replace(/\.d$/, '');
    const pkg = stem.includes('-') ? stem.slice(0, stem.indexOf('-')) : null;
    if (pkg && DEPS.has(pkg)) continue; // library flat bundle
    if (base.endsWith('.mjs') && !(pkg && KIT_MJS_PREFIXES.has(pkg))) continue; // bundle shorthand
    dead.add(base);
  }
  return [...dead];
}

/**
 * `app-…` selectors a guide names that this kit does not declare.
 *
 * Scoped to the doc and to the article's TAB BODIES — the surface that asserts
 * something about the kit. The snippet constants further down an article file
 * are excluded on purpose: a snippet shows the READER's markup, so an
 * `<app-author-card />` in one names a component they have, not one we ship.
 */
function deadSelectorRefs(text) {
  const dead = new Set();
  for (const m of text.matchAll(SELECTOR_REF)) {
    if (!SELECTORS.has(m[0])) dead.add(m[0]);
  }
  return [...dead];
}

/**
 * The line every agent doc closes with, verbatim (guide-authoring.md, "Every agent
 * doc therefore ends with the same line"). An agent that loads only the doc learns
 * from this line how to reach the depth; a paraphrase ("Deeper material per tab:
 * …") drops the half that says WHERE the tabs are declared.
 */
const POINTER_LINE =
  'Deeper material per tab is declared in the frontmatter; extract with `node scripts/design-guides.mjs tab <id> <tab>`.';

/**
 * Check 18's severity. It started as WARN while one guide (feedback-messages) still closed
 * with a non-standard line, so the check could land without editing a guide another
 * change owned. That guide is fixed, so a drift is now a regression (2026-09-23).
 */
const POINTER_SEVERITY = 'error';

/** Null when the last non-blank line is the pointer line, else what is wrong. */
function pointerLineProblem(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const last = [...lines].reverse().find((l) => l.trim() !== '');
  if (last !== undefined && last.trim() === POINTER_LINE) return null;
  const at = lines.findIndex((l) => l.trim() === POINTER_LINE);
  if (at >= 0) return `the pointer line is at line ${at + 1}, not the last line`;
  const near = lines.findIndex((l) => l.startsWith('Deeper material'));
  return near >= 0 ? `line ${near + 1} is not the verbatim pointer line` : 'no closing pointer line';
}

const pointerOffenders = [];

const registrySrc = fs.readFileSync(REGISTRY_FILE, 'utf8');
// A contract break misaligns every field after it, so nothing downstream of the
// parse can be trusted: report the break itself and stop.
const contractProblems = registryContractProblems(registrySrc);
if (contractProblems.length) {
  for (const p of contractProblems) console.error(`FAIL  ${p}`);
  process.exit(1);
}
const registry = parseRegistry(registrySrc);
const routesSrc = fs.readFileSync(ROUTES_FILE, 'utf8');

/** The library's entrypoints for check 17, or null when it is not installed. */
const INVENTORY = libraryEntrypoints();
if (!INVENTORY) {
  warnings.push(
    `${LIBRARY_PACKAGE} is not installed — covers: lists are checked for shape only, not against the library's exports.`,
  );
}

if (registry.length === 0) {
  errors.push('article-registry.ts: no entries parsed — check the field order / parser contract.');
}

// --- Checks 1–4 & 6: per registry entry ------------------------------------
const registeredDocs = new Set();
const registryIds = new Set(registry.map((e) => e.id));
for (const entry of registry) {
  // 1. component file exists (resolve import path relative to the articles dir).
  const compRel = entry.importPath.replace(/^\.\//, '');
  const compAbs = path.join(ARTICLES_DIR, compRel) + '.ts';
  let compSrc = null;
  if (!fs.existsSync(compAbs)) {
    errors.push(`guide "${entry.id}": article component missing — ${path.relative(ROOT, compAbs)}`);
  } else {
    compSrc = fs.readFileSync(compAbs, 'utf8');
  }

  // 2. agent doc exists (agentDocPath is a browser-asset URL: assets/... -> src/assets/...).
  const docAbs = path.join(ROOT, 'src', entry.agentDocPath);
  registeredDocs.add(path.basename(docAbs));
  if (!fs.existsSync(docAbs)) {
    errors.push(`guide "${entry.id}": agent doc missing — src/${entry.agentDocPath}`);
  } else {
    const raw = fs.readFileSync(docAbs, 'utf8');
    const fm = parseFrontmatter(raw);
    // 10. the byte contract, enforced rather than remembered. The ceiling is
    //     read off `covers:` (check 17), so a doc with a broken list is measured
    //     against the one-component line — the list's own error says why.
    const covers = fm && Array.isArray(fm.covers) ? fm.covers : [];
    const n = Math.max(1, covers.length);
    const bytes = authoredBytes(raw);
    const ceiling = docCeiling(n);
    const aim = docAim(n);
    const perN = n > 1 ? ` for ${n} components` : '';
    if (bytes > ceiling) {
      errors.push(
        `guide "${entry.id}": agent doc body is ${bytes} B (max ${ceiling}${perN}) — trim prose, never provenance.`,
      );
    } else if (bytes > aim) {
      warnings.push(`guide "${entry.id}": agent doc body is ${bytes} B (aim ≲${aim}, ceiling ${ceiling}${perN}).`);
    }
    // 3. frontmatter complete + id consistent.
    if (!fm) {
      errors.push(`guide "${entry.id}": agent doc has no frontmatter block.`);
    } else {
      // 17. the covers list, per guide; the cross-guide collision is checked
      //     once all lists are in (below).
      for (const p of coversProblems(entry.id, entry.category, fm.covers, INVENTORY)) errors.push(p);
      const isEmpty = (v) =>
        v === '' ||
        v === undefined ||
        (Array.isArray(v) ? v.length === 0 : typeof v === 'object' && Object.keys(v).length === 0);
      const missing = REQUIRED_FRONTMATTER.filter((k) => !(k in fm) || isEmpty(fm[k]));
      if (missing.length) errors.push(`guide "${entry.id}": frontmatter missing ${missing.join(', ')}.`);
      if (fm.id && fm.id !== entry.id) {
        errors.push(`guide "${entry.id}": frontmatter id "${fm.id}" disagrees with registry id "${entry.id}".`);
      }
      if (!KEBAB_CASE.test(entry.id)) {
        errors.push(`guide "${entry.id}": id is not kebab-case.`);
      }
      // 13. the version pin is present (via REQUIRED_FRONTMATTER) and shaped
      //     like a pin. A pin nobody can parse is a comment.
      if (
        typeof fm['measured-against'] === 'string' &&
        fm['measured-against'] &&
        !MEASURED_AGAINST.test(fm['measured-against'])
      ) {
        errors.push(
          `guide "${entry.id}": measured-against "${fm['measured-against']}" is not a <package>@<version> pin (e.g. @openng/optimus-ui@2.0.2).`,
        );
      }
      if (fm.title !== undefined && fm.title !== entry.title) {
        errors.push(`guide "${entry.id}": frontmatter title "${fm.title}" disagrees with registry "${entry.title}".`);
      }
      // Registry and doc frontmatter must agree on the shared metadata, or the
      // CLI (reads the doc) and the gallery/quick-switch (read the registry)
      // would show different facts for the same guide.
      if (fm.category !== undefined && fm.category !== entry.category) {
        errors.push(
          `guide "${entry.id}": frontmatter category "${fm.category}" disagrees with registry "${entry.category}".`,
        );
      }
      if (fm.summary !== undefined && fm.summary !== entry.summary) {
        errors.push(`guide "${entry.id}": frontmatter summary disagrees with registry summary.`);
      }
      if (Array.isArray(fm.tags) && fm.tags.join('|') !== entry.tags.join('|')) {
        errors.push(`guide "${entry.id}": frontmatter tags [${fm.tags}] disagree with registry tags [${entry.tags}].`);
      }
      // Registry and frontmatter must agree on `related` (same source, two files).
      // NOTE: forward references are intentional — a related id may name a guide
      // that does not exist yet (the backlog points ahead as it grows), so target
      // existence is NOT required here. Only the FORMAT (kebab-case) is enforced.
      const fmRelated = Array.isArray(fm.related) ? fm.related : [];
      if (fmRelated.join('|') !== entry.related.join('|')) {
        errors.push(
          `guide "${entry.id}": frontmatter related [${fmRelated}] disagree with registry related [${entry.related}].`,
        );
      }
      // 11. related hygiene. A forward reference is legitimate and stays
      //     legitimate — but it must SAY it is one. Without the marker the CLI
      //     cannot distinguish "the guide is not written yet" from a typo, and
      //     an agent building a closure from `list --json` tries to `show` an id
      //     that will never resolve.
      for (const rid of entry.related) {
        const planned = rid.startsWith(PLANNED_PREFIX);
        const bare = planned ? rid.slice(PLANNED_PREFIX.length) : rid;
        if (!KEBAB_CASE.test(bare)) {
          errors.push(`guide "${entry.id}": related id "${rid}" is not kebab-case.`);
          continue;
        }
        if (!planned && !registryIds.has(bare)) {
          errors.push(
            `guide "${entry.id}": related id "${rid}" names no guide. Write it as "${PLANNED_PREFIX}${bare}" if the guide is planned, or drop it.`,
          );
        }
        if (planned && registryIds.has(bare)) {
          errors.push(
            `guide "${entry.id}": related id "${rid}" is marked planned, but guide "${bare}" exists — drop the prefix.`,
          );
        }
      }
    }
    // 4. all nine mandatory sections present.
    const headings = [...raw.matchAll(/^##\s+(.*)$/gm)].map((h) => h[1].trim().toLowerCase());
    const missingSections = REQUIRED_SECTIONS.filter((s) => !headings.includes(s.toLowerCase()));
    if (missingSections.length) {
      errors.push(`guide "${entry.id}": agent doc missing section(s): ${missingSections.join(', ')}.`);
    }

    // 18. the closing pointer line, word for word.
    const pointer = pointerLineProblem(raw);
    if (pointer) pointerOffenders.push(`${entry.id} (${pointer})`);

    // 8. the doc's `tabs:` promises and the article's templates agree, both ways.
    //    `history` is included: it renders as a footer rather than a tab, but it
    //    is projected as an `appGuideTab` and `design-guides tab` slices it like
    //    any other, so the doc declares it like any other.
    const declared = fm && !Array.isArray(fm.tabs) && typeof fm.tabs === 'object' ? fm.tabs : null;
    if (fm && 'tabs' in fm && !declared) {
      // Absent entirely is already reported as missing frontmatter; this is the
      // "present but written as a scalar or a list" case.
      errors.push(`guide "${entry.id}": frontmatter "tabs" must be an indented block mapping of tab → one line.`);
    } else if (declared && compSrc) {
      const present = tabsIn(compSrc);
      const dupes = present.filter((t, i) => present.indexOf(t) !== i);
      if (dupes.length)
        errors.push(`guide "${entry.id}": article projects duplicate tab(s): ${[...new Set(dupes)].join(', ')}.`);
      const undeclared = present.filter((t) => !(t in declared));
      if (undeclared.length) {
        errors.push(
          `guide "${entry.id}": article tab(s) not declared in the doc's tabs: ${[...new Set(undeclared)].join(', ')}.`,
        );
      }
      for (const [tab, line] of Object.entries(declared)) {
        if (!present.includes(tab)) {
          errors.push(
            `guide "${entry.id}": doc declares tab "${tab}", the article has no <ng-template appGuideTab="${tab}">.`,
          );
          continue;
        }
        if (!line) errors.push(`guide "${entry.id}": tab "${tab}" is declared with no description.`);
        else if (line.length > MAX_TAB_LINE) {
          errors.push(
            `guide "${entry.id}": tab "${tab}" description is ${line.length} chars (max ${MAX_TAB_LINE}) — say what is in it, do not abstract it.`,
          );
        }
        // A declared tab must be extractable, or the pointer costs a fetch and
        // returns nothing (unbalanced markup, most likely a stray </ng-template>).
        if (extractTab(compSrc, tab) === null) {
          errors.push(`guide "${entry.id}": tab "${tab}" cannot be sliced — unbalanced <ng-template> nesting.`);
        }
      }
    }

    // 9. every kit file / selector the guide names still exists.
    const deadFiles = new Set(deadFileRefs(raw));
    const deadSelectors = new Set(deadSelectorRefs(raw));
    if (compSrc) {
      for (const f of deadFileRefs(compSrc)) deadFiles.add(f);
      // Selectors only from the rendered surface — see deadSelectorRefs.
      for (const tab of tabsIn(compSrc)) {
        const body = extractTab(compSrc, tab);
        if (body) for (const s of deadSelectorRefs(body)) deadSelectors.add(s);
      }
    }
    if (deadFiles.size) {
      errors.push(`guide "${entry.id}": cites file(s) that do not exist: ${[...deadFiles].join(', ')}.`);
    }
    if (deadSelectors.size) {
      errors.push(
        `guide "${entry.id}": cites component selector(s) this kit does not declare: ${[...deadSelectors].join(', ')}.`,
      );
    }
  }

  // 6. a generated route exists for this id.
  if (!routesSrc.includes(`dev/design/guide/${entry.id}`) && !/dev\/design\/guide\/\$\{[^}]*\.id\}/.test(routesSrc)) {
    errors.push(`guide "${entry.id}": no route "dev/design/guide/${entry.id}" in dev.routes.ts.`);
  }
}
if (!errors.some((e) => e.startsWith('guide '))) ok.push(`registry entries valid: ${registry.length}`);

// --- Check 18: the closing pointer line ------------------------------------
if (pointerOffenders.length) {
  const msg = `closing pointer line not verbatim in ${pointerOffenders.length} guide(s): ${pointerOffenders.join('; ')} — it must read: ${POINTER_LINE}`;
  (POINTER_SEVERITY === 'error' ? errors : warnings).push(msg);
} else if (registry.length) {
  ok.push(`closing pointer line verbatim in all ${registry.length} guides`);
}

// Route generation sanity: dev.routes.ts must build guide routes from the registry.
if (!/articleRegistry/.test(routesSrc) || !/dev\/design\/guide\//.test(routesSrc)) {
  errors.push('dev.routes.ts does not generate guide routes from articleRegistry (dev/design/guide/…).');
} else {
  ok.push('dev.routes.ts generates guide routes from articleRegistry');
}

// --- Check 5: no orphan agent docs -----------------------------------------
// Silent-pass guard: a missing GUIDES_DIR used to skip this whole check —
// no error, no "ok" — instead of failing. The dir (and its 50+ .agent.md
// docs) is load-bearing for the corpus; treat its absence as a failure, not
// as "nothing to check".
if (!fs.existsSync(GUIDES_DIR)) {
  errors.push(`guides dir not found: ${GUIDES_DIR} — check 5 (orphan agent docs) could not run.`);
} else {
  const onDisk = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.agent.md'));
  if (onDisk.length === 0) {
    errors.push(`guides dir ${GUIDES_DIR} has 0 .agent.md files — check 5 scanned nothing.`);
  } else {
    const orphans = onDisk.filter((f) => !registeredDocs.has(f));
    if (orphans.length) {
      errors.push(`${orphans.length} guide doc(s) not in article-registry.ts (orphan): ${orphans.join(', ')}`);
    } else {
      ok.push(`no orphan guide docs: ${onDisk.length} on disk, all registered`);
    }
  }
}

// --- Check 17, corpus-wide: one component, one guide -------------------------
// Two guides claiming the same component would each get its room and the
// coverage count would still be one — and the reader would have two contracts
// for one thing, which is the drift `related`/`planned:` exists to prevent.
let coverageLine = '';
{
  const cov = coverage(loadGuides());
  for (const s of cov.shared) {
    errors.push(
      `covers: "${s.component}" is claimed by ${s.guides.join(' and ')} — one component, one guide; the others point at it via related.`,
    );
  }
  // The declined list: every entry with a reason, a real component, unclaimed,
  // and on record in docs/DESIGN-SYSTEM.MD. A component neither covered nor
  // declined is a warning — a library update that adds one should be noticed,
  // not block a release.
  let docText = null;
  try {
    docText = fs.readFileSync(path.join(ROOT, 'docs', 'DESIGN-SYSTEM.MD'), 'utf8');
  } catch {
    // reported by declinedProblems
  }
  const declinedErrors = declinedProblems(DECLINED_COMPONENTS, cov, docText);
  errors.push(...declinedErrors);
  if (cov.installed) {
    const covered = cov.covered.size - cov.foreign.length;
    coverageLine =
      `${covered} covered + ${cov.declined.length} declined` +
      `${cov.undecided.length ? ` + ${cov.undecided.length} undecided` : ''}` +
      ` = ${cov.components.length} ${LIBRARY_PACKAGE} components`;
    ok.push(`covers: ${coverageLine}, no shared claims`);
    if (declinedErrors.length === 0)
      ok.push(`declined: ${cov.declined.length} entries, each with a reason and on record`);
    if (cov.undecided.length) {
      warnings.push(
        `covers: ${cov.undecided.length} component(s) neither covered nor declined: ${cov.undecided.join(', ')} — ` +
          'cover each in a guide, or add it to DECLINED_COMPONENTS (scripts/design-guides.mjs) with a reason.',
      );
    }
  }
}

// --- Checks 12, 14, 15 & 16: the harvest contracts --------------------------
// The semantic markers a cross-guide harvest keys off are CSS class names that
// nobody ever declared as an interface — `dd__cell dd__cell--bad`, `tag tag--good`,
// `dd__why`, `table-wrap`, `src-note`, `code-block`. They are uniform by habit. These checks turn the habit
// into a contract WITHOUT touching a byte of markup: rename a class in a refactor
// and the gate says so, instead of the harvest quietly returning half the corpus.
//
// RECOGNITION, not presence. A guide that carries no reference table is not
// failed for it; a table the harvester cannot see is. The one presence rule
// (a Usage tab must yield a do/don't pair) predates the contract and stays.
{
  const guides = loadGuides();
  // Silent-pass guard: `if (guides.length)` with no else used to make checks
  // 12/14/15/16 vanish without a trace whenever loadGuides() came back empty
  // (a broken glob in design-guides.mjs, a moved GUIDES_DIR) — exactly the
  // "harvest quietly returning half the corpus" failure mode these checks
  // exist to catch, just one level up: the corpus itself silently at zero.
  if (guides.length === 0) {
    errors.push('loadGuides() returned 0 guides — checks 12/14/15/16 (harvest contracts) could not run.');
  } else {
    const h = harvestDoDont(guides);
    if (h.cellsHarvested !== h.cellsSeen) {
      errors.push(
        `do/don't harvest: ${h.cellsHarvested} of ${h.cellsSeen} dd__cell markers were recognized — ` +
          'the markup and `design-guides.mjs blocks dodont` have drifted apart.',
      );
    } else {
      ok.push(`do/don't harvest complete: ${h.cellsSeen} cells, ${h.pairs.length} pairs`);
    }
    const withUsage = new Set(h.guidesWithUsage);
    const withPairs = new Set(h.guidesWithPairs);
    const barren = [...withUsage].filter((id) => !withPairs.has(id)).sort();
    if (barren.length) {
      errors.push(
        `guide(s) with a Usage tab but no do/don't pair: ${barren.join(', ')} — the pairs are the tab's job.`,
      );
    } else if (withUsage.size) {
      ok.push(`every guide with a Usage tab yields do/don't pairs: ${withUsage.size}`);
    }

    // 14. reference tables. The probe counts `<table>` elements and knows nothing
    //     about the wrapper class the harvester keys on, so a renamed or dropped
    //     `table-wrap` shows up as present-but-unharvested. Every measured number
    //     the corpus states lives in one of these; a half-empty answer to "what
    //     does the kit measure" is worse than no answer.
    const t = harvestTables(guides);
    if (t.harvested !== t.seen) {
      errors.push(
        `reference-table harvest: ${t.harvested} of ${t.seen} tables were recognized — ` +
          'a <table> outside a `table-wrap`, or the wrapper class has been renamed since ' +
          '`design-guides.mjs blocks table` was written.',
      );
    } else {
      ok.push(`reference-table harvest complete: ${t.seen} tables, ${t.guidesWith.length} guides`);
    }

    // 15. provenance notes. Every measured claim in the corpus is backed by a
    //     `src-note`, and those notes are the re-measure worklist when the
    //     `measured-against` pin moves (check 13). A note the harvest cannot see
    //     is a claim whose evidence has quietly left the query surface.
    const s = harvestSources(guides);
    if (s.harvested !== s.seen) {
      errors.push(
        `provenance-note harvest: ${s.harvested} of ${s.seen} src-note markers were recognized — ` +
          'a note has moved off its <p>, or the class has been renamed since ' +
          '`design-guides.mjs blocks source` was written.',
      );
    } else {
      ok.push(`provenance-note harvest complete: ${s.seen} notes, ${s.guidesWith.length} guides`);
    }

    // 16. code recipes. The marker carries modifiers (`code-block--inline`), so
    //     both sides tokenise the class list; a harvester that string-compared it
    //     would have dropped four recipes while reporting a full corpus. Only the
    //     MARKER is gated — whether a recipe's text is a flat constant or a live
    //     expression is an authoring rule, because 53 of the corpus's blocks are
    //     live outputs by design (see guide-authoring.md, "Code recipes").
    const r = harvestSnippets(guides);
    if (r.harvested !== r.seen) {
      errors.push(
        `code-recipe harvest: ${r.harvested} of ${r.seen} code-block markers were recognized — ` +
          'a recipe has left the <pre>/<code> pair, or the class has been renamed since ' +
          '`design-guides.mjs blocks snippet` was written.',
      );
    } else {
      ok.push(`code-recipe harvest complete: ${r.seen} recipes, ${r.guidesWith.length} guides`);
    }
  }
}

// --- Self-test (SELFTEST=1) -------------------------------------------------
// A gate that never fires is indistinguishable from a gate that cannot fire.
// This runs check 9's two detectors over synthetic text that cites a deleted
// file and a deleted selector — the exact 2026 regression, where a guide kept
// citing `glossary-tooltip.component.ts` after the file was gone — plus the four
// live citation shapes that must stay silent.
if (process.env.SELFTEST) {
  const planted = [
    'The tooltip lives in `glossary-tooltip.component.ts` and renders `<app-glossary-tooltip />`.',
    'Its stylesheet is `src/app/shared/glossary-tooltip.component.scss`.',
    // A deleted kit script, bare and with its path: the bundle-shorthand rule must not swallow it.
    'The gate was `check-tooltip-drift.mjs`, run as `scripts/check-tooltip-drift.mjs`.',
  ].join('\n');
  const live = [
    'Focus ring rules live in `styles.scss`; the trap is `src/app/utils/focus-return.ts`.',
    'The combobox span is `openng-optimus-ui-select.mjs:1677`, tokens from `@openng/optimus-ui-themes/dist/aura/base/index.mjs`',
    'and `@openng/optimus-ui/fesm2022/openng-optimus-ui-dialog.mjs`. The shell renders `<app-guide-shell>`.',
    // The declaration-file extension named in prose, bare and dotted (the pilot's false positive).
    'The d.ts declares it optional; every `.d.ts` in the bundle agrees.',
    // Bundle shorthands in prose: a bare entrypoint and elided tails (the review's false positive).
    'The meter is drawn in `password.mjs:412`; the submenu in `…-tieredmenu.mjs` and `...-select.mjs:90`.',
  ].join('\n');
  const caught = [...deadFileRefs(planted), ...deadSelectorRefs(planted)];
  const noise = [...deadFileRefs(live), ...deadSelectorRefs(live)];
  const expected = [
    'glossary-tooltip.component.ts',
    'src/app/shared/glossary-tooltip.component.scss',
    'check-tooltip-drift.mjs',
    'scripts/check-tooltip-drift.mjs',
    'app-glossary-tooltip',
  ];
  const missed = expected.filter((e) => !caught.includes(e));
  if (missed.length) errors.push(`SELFTEST: check 9 did not flag ${missed.join(', ')} — the detector is dead.`);
  else ok.push(`SELFTEST: dead refs flagged (${caught.join(', ')})`);
  if (noise.length) errors.push(`SELFTEST: check 9 false-positived on live citations: ${noise.join(', ')}.`);
  else
    ok.push(
      'SELFTEST: bare / repo-path / flat-bundle / scoped-package / bare-d.ts / bundle-shorthand citations all silent',
    );

  // Registry PARSER CONTRACT: a double-quoted summary must be named as such, on
  // its own entry, instead of the regex borrowing the next entry's fields.
  const entry = (id, summary) =>
    [
      '  {',
      `    id: '${id}',`,
      `    title: '${id}',`,
      "    category: 'library',",
      "    tags: ['a'],",
      `    summary: ${summary},`,
      '    related: [],',
      `    agentDocPath: 'assets/design-system/guides/${id}.agent.md',`,
      `    loadComponent: () => import('./${id}/${id}-article.component').then((m) => m.X),`,
      '  },',
    ].join('\n');
  const head =
    'export interface ArticleRegistryEntry {\n  id: string;\n}\nexport const articleRegistry: ArticleRegistryEntry[] = [\n';
  const sound = head + entry('alpha', "'Fine.'") + '\n' + entry('beta', "'Also fine.'") + '\n];\n';
  const broken = head + entry('alpha', '"Double-quoted."') + '\n' + entry('beta', "'Fine.'") + '\n];\n';
  const soundProblems = registryContractProblems(sound);
  const brokenProblems = registryContractProblems(broken);
  if (soundProblems.length) {
    errors.push(`SELFTEST: registry contract check false-positived on sound entries: ${soundProblems.join(' | ')}`);
  } else if (
    brokenProblems.length !== 1 ||
    !brokenProblems[0].includes('entry "alpha"') ||
    !brokenProblems[0].includes('"summary" must be ONE single-quoted string literal')
  ) {
    errors.push(
      `SELFTEST: a double-quoted summary was not reported on its own entry: ${brokenProblems.join(' | ') || '(silent)'}`,
    );
  } else {
    ok.push('SELFTEST: a double-quoted registry summary fails naming the entry and the rule');
  }

  // Check 18: the verbatim line passes (trailing blank lines allowed); a paraphrase,
  // a line that is not last, and a missing line are each flagged.
  const body = '## Default snippet\n\n```html\n<p-x />\n```\n\n';
  const pointerCases = [
    ['verbatim', body + POINTER_LINE + '\n\n', false],
    ['paraphrase', body + 'Deeper material per tab: `node scripts/design-guides.mjs tab <id> <tab>`.\n', true],
    ['not last', body + POINTER_LINE + '\n\nA trailing note.\n', true],
    ['missing', body, true],
  ];
  const wrong18 = pointerCases.filter(([, raw, bad]) => (pointerLineProblem(raw) !== null) !== bad).map(([n]) => n);
  if (wrong18.length) errors.push(`SELFTEST: check 18 misjudged: ${wrong18.join(', ')}.`);
  else ok.push('SELFTEST: check 18 accepts the verbatim pointer line and flags paraphrase, misplacement, absence');

  // Check 14: a table written as the corpus writes them is recognised; the same
  // table with a renamed wrapper is still SEEN and no longer HARVESTED, which is
  // exactly the divergence the contract reports.
  const tableOk =
    '<h3>Size scale</h3><div class="table-wrap"><table>' +
    '<thead><tr><th>Token</th><th>default</th></tr></thead>' +
    '<tbody><tr><td>font-size</td><td>1rem (16px)</td></tr></tbody>' +
    '</table></div><p class="src-note">Values from the Aura preset.</p>';
  const tableRenamed = tableOk.replace('table-wrap', 'table-shell');
  const tableInRecipe = '<pre class="code-block"><code><table><tr><td>a</td></tr></table></code></pre>';
  const good = harvestTablesIn(tableOk);
  if (countTableMarkers(tableOk) !== 1 || good.length !== 1) {
    errors.push(
      `SELFTEST: check 14 does not recognize a well-formed table (seen ${countTableMarkers(tableOk)}, harvested ${good.length}).`,
    );
  } else if (good[0].columns.length !== 2 || good[0].rows.length !== 1 || !good[0].source || !good[0].caption) {
    errors.push('SELFTEST: check 14 recognized the table but lost its caption, columns, rows or provenance.');
  } else {
    ok.push('SELFTEST: a well-formed reference table harvests with caption, columns, rows and source');
  }
  if (countTableMarkers(tableRenamed) !== 1 || harvestTablesIn(tableRenamed).length !== 0) {
    errors.push('SELFTEST: check 14 did not notice a renamed table-wrap — the detector is dead.');
  } else {
    ok.push('SELFTEST: a renamed table-wrap reads as present-but-unharvested');
  }
  if (countTableMarkers(tableInRecipe) !== 0) {
    errors.push('SELFTEST: check 14 counted table markup that a code recipe merely SHOWS the reader.');
  } else {
    ok.push('SELFTEST: table markup inside a code recipe is not counted as a table');
  }

  // Check 15: a note written as the corpus writes them is recognised with the
  // artefacts it cites; the same note moved onto a <div> is still SEEN and no
  // longer HARVESTED.
  const noteOk = '<h3>Size scale</h3><p class="src-note">Values from <code>aura/button/index.mjs</code>.</p>';
  const noteOnDiv = noteOk.replace('<p class="src-note">', '<div class="src-note">').replace('</p>', '</div>');
  const noteHit = harvestSourcesIn(noteOk);
  if (countSourceMarkers(noteOk) !== 1 || noteHit.length !== 1) {
    errors.push(
      `SELFTEST: check 15 does not recognize a well-formed src-note (seen ${countSourceMarkers(noteOk)}, harvested ${noteHit.length}).`,
    );
  } else if (!noteHit[0].under || noteHit[0].cites.length !== 1) {
    errors.push('SELFTEST: check 15 recognized the note but lost its heading or the artifact it cites.');
  } else {
    ok.push('SELFTEST: a well-formed provenance note harvests with its heading and its citation');
  }
  if (countSourceMarkers(noteOnDiv) !== 1 || harvestSourcesIn(noteOnDiv).length !== 0) {
    errors.push('SELFTEST: check 15 did not notice a src-note that had left its <p> — the detector is dead.');
  } else {
    ok.push('SELFTEST: a src-note off its <p> reads as present-but-unharvested');
  }

  // Check 16: the modifier variant must harvest like the bare one (a harvester
  // that string-compared the class attribute would drop 4 of the corpus's 179);
  // a recipe that has left the <pre>/<code> pair must read as unharvested; and a
  // block that is nothing but an interpolation must be reported as generated
  // rather than served as if it were code.
  const recipeOk =
    '<h3>Import</h3><pre class="code-block"><code>import { CardModule } from &#39;@openng/optimus-ui/card&#39;;</code></pre>';
  const recipeModifier = recipeOk.replace('class="code-block"', 'class="code-block code-block--inline"');
  const recipeLoose = recipeOk.replace('<code>', '<span>').replace('</code>', '</span>');
  const recipeGenerated = '<pre class="code-block"><code>{{ pgCode() }}</code></pre>';
  const hit = harvestSnippetsIn(recipeOk);
  if (countSnippetMarkers(recipeOk) !== 1 || hit.length !== 1 || !hit[0].under || hit[0].live.length !== 0) {
    errors.push('SELFTEST: check 16 does not recognize a well-formed code recipe with its heading and literal code.');
  } else if (!hit[0].code.includes("'@openng/optimus-ui/card'")) {
    errors.push('SELFTEST: check 16 recognized the recipe but did not decode its entities back into code.');
  } else {
    ok.push('SELFTEST: a well-formed code recipe harvests with its heading and its decoded code');
  }
  if (harvestSnippetsIn(recipeModifier).length !== 1) {
    errors.push('SELFTEST: check 16 drops a recipe that carries a class modifier — the class list is not tokenized.');
  } else {
    ok.push('SELFTEST: a code-block--inline modifier harvests like the bare marker');
  }
  if (countSnippetMarkers(recipeLoose) !== 1 || harvestSnippetsIn(recipeLoose).length !== 0) {
    errors.push('SELFTEST: check 16 did not notice a recipe outside the <pre>/<code> pair — the detector is dead.');
  } else {
    ok.push('SELFTEST: a recipe off the <pre>/<code> pair reads as present-but-unharvested');
  }
  const gen = harvestSnippetsIn(recipeGenerated);
  if (gen.length !== 1 || !gen[0].generated) {
    errors.push('SELFTEST: check 16 served a runtime-generated block as if it were copyable code.');
  } else {
    ok.push('SELFTEST: a block that is only an interpolation is reported as generated, not as code');
  }

  // Checks 10 and 17: the ceiling must be the base line for zero or one
  // component and grow by exactly one step per further one; the covers
  // validator must flag each planted defect and stay silent on a sound list.
  if (docCeiling(0) !== 8500 || docCeiling(1) !== 8500 || docCeiling(3) !== 11500 || docAim(3) !== 9500) {
    errors.push(
      `SELFTEST: check 10 ceiling curve is off (${docCeiling(0)}, ${docCeiling(1)}, ${docCeiling(3)}, aim ${docAim(3)}).`,
    );
  } else {
    ok.push('SELFTEST: the ceiling is 8500 for one component and 11500 (aim 9500) for three');
  }
  const inv = new Set(['tree', 'treetable', 'treeselect', 'badge', 'motion']);
  const planted17 = [
    ...coversProblems('tree', 'library', undefined, inv),
    ...coversProblems('tree', 'library', [], inv),
    ...coversProblems('tree', 'library', ['tree', 'treetabel'], inv),
    ...coversProblems('tree', 'library', ['tree', 'tree'], inv),
    ...coversProblems('tree', 'library', ['tree', 'p-treeTable'], inv),
    ...coversProblems('tree', 'library', ['tree', 'motion'], inv),
    ...coversProblems('badge', 'library', ['treeselect'], inv),
  ];
  const wanted17 = [
    'missing covers',
    'at least one component',
    '"treetabel"',
    'twice',
    'not an entrypoint name',
    'infrastructure',
    'does not cover it',
  ];
  const missed17 = wanted17.filter((w) => !planted17.some((p) => p.includes(w)));
  const quiet17 = [
    ...coversProblems('tree', 'library', ['tree', 'treetable', 'treeselect'], inv),
    ...coversProblems('forms', 'foundations', [], inv),
  ];
  if (missed17.length) {
    errors.push(`SELFTEST: check 17 did not flag ${missed17.join(', ')} — the validator is dead.`);
  } else if (quiet17.length) {
    errors.push(`SELFTEST: check 17 false-positived on a sound list: ${quiet17.join(' | ')}`);
  } else {
    ok.push(`SELFTEST: covers validator flags ${wanted17.length} planted defects and accepts a sound list`);
  }
}

// --- Report ----------------------------------------------------------------
const line = '='.repeat(66);
console.log(line);
console.log('  check-design-guides — guide registry / doc / route coverage');
console.log(line);
if (process.env.VERBOSE) for (const s of ok) console.log('  ok   ' + s);
// Warnings never fail the build: they mark drift toward a ceiling, which is a
// thing to notice at authoring time, not a thing to block a release on.
for (const w of warnings) console.log('  WARN ' + w);
if (errors.length === 0) {
  console.log(
    `  PASS — ${ok.length} checks green; ${registry.length} guide(s) fully accounted for` +
      `${coverageLine ? `; ${coverageLine}` : ''}` +
      `${warnings.length ? `; ${warnings.length} warning(s)` : ''}.`,
  );
  console.log(line);
  process.exit(0);
}
for (const e of errors) console.log('  FAIL ' + e);
console.log(line);
console.log(`  ${errors.length} problem(s). Fix before shipping.`);
process.exit(1);
