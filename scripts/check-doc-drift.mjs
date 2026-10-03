#!/usr/bin/env node
/**
 * check-doc-drift — bilingual user-facing-doc mirror integrity (N9.1).
 *
 * User-facing docs are canonical in one language and shipped with a translated
 * mirror in another (see docs/DOC-TRANSLATION.MD). This gate keeps the two from
 * silently drifting apart. It reads the curated set from docs/translation-manifest.json
 * and, for every declared source -> mirror pair, checks:
 *
 *   1. The canonical source file still exists.
 *   2. Its mirror file exists at the declared path.
 *   3. The mirror carries a well-formed TRANSLATION-MIRROR marker whose recorded
 *      `source:` matches the manifest (the mirror knows what it mirrors).
 *   4. status: PLACEHOLDER is tolerated — an untranslated stub is not drift.
 *   5. status: TRANSLATED must record `source-sha256:` equal to the CURRENT hash of
 *      the canonical source. A mismatch means the source moved on after the mirror
 *      was translated -> DRIFT (fail). A content hash is used deliberately: git does
 *      not preserve mtimes, so timestamps are not a reliable signal.
 *   6. `canonical` and `mirror-lang` are real: the manifest's `canonical` matches the
 *      mirror's marker, and `mirror-lang` matches the language directory (or, for a
 *      sibling mirror, the language suffix) the mirror actually carries. These fields
 *      are enforced, not decoration.
 *   7. The mirror path follows the convention docs/DOC-TRANSLATION.MD states:
 *      `docs/<mirror-lang>/<source path with a leading docs/ stripped>`, except for a
 *      source under a `siblingMirrorRoots` entry (the packs), whose mirror sits right
 *      beside it as `<name>.<mirror-lang>.<ext>` so a pack stays self-contained.
 *   8. No orphan mirrors: every doc under a mirror dir (docs/<lang>/), and every
 *      `<name>.<xx>.<ext>` file under a sibling-mirror root, must be in the manifest,
 *      mirroring the "no orphan directive" rule in verify-harness.
 *   9. THE INVERSE: every doc under the user-facing paths the manifest declares
 *      (`userFacingPaths`) is a declared source or mirror, or is exempt with a reason —
 *      `exempt` names single files, `exemptGlobs` whole groups (a pack's skills, its
 *      fill-in templates). A declared pair wins over an exempting glob, and a glob that
 *      matches nothing fails, so it cannot quietly swallow what lands there next.
 *      Without this, adding a user-facing doc and simply not registering it passed
 *      green — the gate could only validate what it had been told about.
 *
 * Dependency-free (Node core only) so it runs in CI without an install step.
 *
 * Usage:  node scripts/check-doc-drift.mjs        (VERBOSE=1 lists the green checks)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = 'docs/translation-manifest.json';
const DOC_EXT = /\.(md|html)$/i;
// Mirror trees are the 2-letter language dirs directly under `docs/` — `de` today,
// any further mirror language tomorrow. Discovered, not hard-coded, so a new mirror
// language is covered for free.
const LANG_DIR = /^[a-z]{2}$/;
function mirrorDirs() {
  const docsAbs = abs('docs');
  if (!fs.existsSync(docsAbs)) return [];
  return fs
    .readdirSync(docsAbs, { withFileTypes: true })
    .filter((e) => e.isDirectory() && LANG_DIR.test(e.name))
    .map((e) => `docs/${e.name}`);
}
// Sibling mirrors: `packs/teacher/README.md` + `de` -> `packs/teacher/README.de.md`.
const SIBLING_MIRROR = /\.[a-z]{2}\.(md|html)$/i;
function siblingMirrorPath(source, lang) {
  const m = source.match(/^(.*)(\.[^./]+)$/);
  return m ? `${m[1]}.${lang}${m[2]}` : `${source}.${lang}`;
}
// A minimal glob for `exemptGlobs`: `**` spans directories, `*` stays inside one segment.
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*' && glob[i + 1] === '*') {
      re += '.*';
      i++;
    } else if (c === '*') {
      re += '[^/]*';
    } else {
      re += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${re}$`);
}

const errors = [];
const ok = [];

const abs = (p) => path.join(ROOT, p);
const exists = (p) => fs.existsSync(abs(p));
const read = (p) => fs.readFileSync(abs(p), 'utf8');
const sha256 = (p) =>
  crypto
    .createHash('sha256')
    .update(fs.readFileSync(abs(p)))
    .digest('hex');

// --- Parse a TRANSLATION-MIRROR marker (HTML comment, valid in .md and .html) ---
// <!-- TRANSLATION-MIRROR
// source: docs/explanation/choosing-an-ai-agent.md
// canonical: en
// status: PLACEHOLDER|TRANSLATED
// source-sha256: <64-hex or empty>
// -->
function parseMarker(text) {
  const block = text.match(/<!--\s*TRANSLATION-MIRROR\s*\r?\n([\s\S]*?)-->/);
  if (!block) return null;
  const fields = {};
  for (const line of block[1].split(/\r?\n/)) {
    const kv = line.match(/^\s*([a-z0-9-]+):\s*(.*?)\s*$/i);
    if (kv) fields[kv[1].toLowerCase()] = kv[2];
  }
  return fields;
}

// --- Load the manifest -----------------------------------------------------
let manifest = null;
if (!exists(MANIFEST)) {
  errors.push(`MISSING manifest: ${MANIFEST}`);
} else {
  try {
    manifest = JSON.parse(read(MANIFEST));
    if (!Array.isArray(manifest.mirrors)) {
      errors.push(`${MANIFEST}: "mirrors" must be an array.`);
      manifest = null;
    } else {
      ok.push(`manifest parsed: ${manifest.mirrors.length} declared mirror(s)`);
    }
  } catch (e) {
    errors.push(`${MANIFEST} does not parse: ${e.message}`);
  }
}

// --- Validate every declared pair ------------------------------------------
const declaredMirrors = new Set();
const declaredSources = new Set();
const siblingRoots = (manifest && manifest.siblingMirrorRoots) || [];
const underSiblingRoot = (p) => siblingRoots.some((r) => p.startsWith(`${r}/`));
if (manifest) {
  // JSON.parse keeps the last of two equal keys and says nothing, so a doubled
  // "canonical" in one entry would pass unseen. The manifest's entries are flat objects;
  // check each for a key that appears twice.
  for (const obj of read(MANIFEST).match(/\{[^{}]*\}/g) || []) {
    const seen = new Set();
    for (const [, key] of obj.matchAll(/"([^"\\]+)"\s*:/g)) {
      if (seen.has(key)) errors.push(`${MANIFEST}: key "${key}" appears twice in one entry: ${obj.slice(0, 90)}…`);
      seen.add(key);
    }
  }
  for (const entry of manifest.mirrors) {
    const { source, mirror } = entry;
    if (!source || !mirror) {
      errors.push(`${MANIFEST}: an entry is missing "source" or "mirror".`);
      continue;
    }
    declaredMirrors.add(mirror);
    declaredSources.add(source);

    // The path convention from docs/DOC-TRANSLATION.MD: the mirror lives at
    // docs/<mirror-lang>/<the source's path with a leading "docs/" stripped> — or, for a
    // source under a sibling-mirror root (a pack), right beside it as <name>.<lang>.<ext>.
    const mirrorLang = entry['mirror-lang'];
    if (!mirrorLang) {
      errors.push(`${MANIFEST}: entry for "${source}" is missing "mirror-lang".`);
    } else {
      const sibling = underSiblingRoot(source);
      const expected = sibling
        ? siblingMirrorPath(source, mirrorLang)
        : `docs/${mirrorLang}/${source.replace(/^docs\//, '')}`;
      if (mirror !== expected) {
        const rule = sibling ? '<name>.<mirror-lang>.<ext> sibling' : 'docs/<mirror-lang>/<rel-path>';
        errors.push(
          `${mirror}: breaks the ${rule} convention — ` +
            `for source "${source}" with mirror-lang "${mirrorLang}" it must be ${expected}.`,
        );
        continue;
      }
    }
    if (!entry.canonical) {
      errors.push(`${MANIFEST}: entry for "${source}" is missing "canonical".`);
    }

    if (!exists(source)) {
      errors.push(`${mirror}: canonical source "${source}" does not exist.`);
      continue;
    }
    if (!exists(mirror)) {
      errors.push(`missing mirror for "${source}" — expected ${mirror} (run the mirror scaffold).`);
      continue;
    }

    const marker = parseMarker(read(mirror));
    if (!marker) {
      errors.push(`${mirror}: no TRANSLATION-MIRROR marker block.`);
      continue;
    }
    if (marker.source !== source) {
      errors.push(`${mirror}: marker source "${marker.source || ''}" != manifest source "${source}".`);
      continue;
    }
    // The two language fields carry weight: the marker must agree with the manifest
    // about the canonical language, and about the language this file is written in.
    if (entry.canonical && marker.canonical && marker.canonical !== entry.canonical) {
      errors.push(`${mirror}: marker canonical "${marker.canonical}" != manifest canonical "${entry.canonical}".`);
      continue;
    }
    if (marker['mirror-lang'] && entry['mirror-lang'] && marker['mirror-lang'] !== entry['mirror-lang']) {
      errors.push(
        `${mirror}: marker mirror-lang "${marker['mirror-lang']}" != manifest mirror-lang ` +
          `"${entry['mirror-lang']}".`,
      );
      continue;
    }

    // Entry docs — every README and the documents at the repo root — must be findable in
    // both languages: the source links to its mirror and the mirror links back (the
    // language-switch line). A German reader who only ever sees the English README never
    // learns a German one exists.
    if (/(^|\/)README\.md$/.test(source) || !source.includes('/')) {
      const linksTo = (from, to) => {
        const rel = path.posix.relative(path.posix.dirname(from), to);
        return read(from).includes(`](${rel})`) || read(from).includes(`](./${rel})`);
      };
      if (!linksTo(source, mirror)) {
        errors.push(`${source}: entry doc does not link to its mirror ${mirror} (add the language-switch line).`);
      }
      if (!linksTo(mirror, source)) {
        errors.push(`${mirror}: entry-doc mirror does not link back to ${source} (add the language-switch line).`);
      }
    }

    const status = (marker.status || '').toUpperCase();
    if (status !== 'PLACEHOLDER' && status !== 'TRANSLATED') {
      errors.push(`${mirror}: status must be PLACEHOLDER or TRANSLATED (got "${marker.status || ''}").`);
      continue;
    }

    if (status === 'PLACEHOLDER') {
      // Untranslated stub — tolerated, never counts as drift.
      ok.push(`placeholder ok: ${mirror}  <- ${source}`);
      continue;
    }

    // status === TRANSLATED — the recorded hash must match the live source.
    const recorded = (marker['source-sha256'] || '').toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(recorded)) {
      errors.push(`${mirror}: status TRANSLATED but source-sha256 is missing/invalid.`);
      continue;
    }
    const current = sha256(source);
    if (recorded !== current) {
      errors.push(
        `DRIFT: ${mirror} was translated from an older ${source} ` +
          `(marker ${recorded.slice(0, 12)}… vs current ${current.slice(0, 12)}…). ` +
          `Re-translate and update source-sha256.`,
      );
    } else {
      ok.push(`in sync: ${mirror}  <- ${source}`);
    }
  }
}

// --- Orphan check: every mirror-dir doc must be declared -------------------
function walk(dirRel) {
  const out = [];
  const dirAbs = abs(dirRel);
  if (!fs.existsSync(dirAbs)) return out;
  for (const entry of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    const childRel = `${dirRel}/${entry.name}`;
    if (entry.isDirectory()) out.push(...walk(childRel));
    else if (entry.isFile() && DOC_EXT.test(entry.name)) out.push(childRel);
  }
  return out;
}
if (manifest) {
  for (const dir of mirrorDirs()) {
    for (const f of walk(dir)) {
      if (!declaredMirrors.has(f)) {
        errors.push(`orphan mirror not in ${MANIFEST}: ${f}`);
      }
    }
  }
  // Sibling mirrors carry their language in the name; one nobody declared is an orphan.
  for (const root of siblingRoots) {
    if (!exists(root)) {
      errors.push(`${MANIFEST}: siblingMirrorRoots entry "${root}" does not exist.`);
      continue;
    }
    for (const f of walk(root)) {
      if (SIBLING_MIRROR.test(f) && !declaredMirrors.has(f)) {
        errors.push(
          `orphan mirror not in ${MANIFEST}: ${f} — declare it, or rename it if the .<xx> is not a language code.`,
        );
      }
    }
  }
}

// --- The inverse check: no undeclared user-facing doc ----------------------
// The checks above can only validate what the manifest already knows about, so on their
// own a new user-facing doc that nobody registered ships monolingual and the gate stays
// green. This closes that hole from the other side: enumerate the user-facing paths and
// require every doc found there to be either a declared source or an explicit exemption.
// The exemption list lives in the manifest (one place) and each entry carries a reason.
if (manifest) {
  const cfg = manifest.userFacingPaths;
  if (!cfg || !Array.isArray(cfg.roots) || !Array.isArray(cfg.files)) {
    errors.push(`${MANIFEST}: "userFacingPaths" must declare { roots: [], files: [] }.`);
  } else {
    const exempt = new Map();
    for (const e of manifest.exempt || []) {
      if (!e || !e.path) {
        errors.push(`${MANIFEST}: an "exempt" entry is missing "path".`);
        continue;
      }
      if (!e.reason || !String(e.reason).trim()) {
        errors.push(`${MANIFEST}: exemption for "${e.path}" has no reason. Say why, or declare it.`);
        continue;
      }
      if (!exists(e.path)) {
        // "optional": a file one checkout keeps and another does not (a status file a
        // project may keep for itself).
        if (e.optional === true) continue;
        errors.push(`${MANIFEST}: exemption for "${e.path}" points at a file that does not exist.`);
        continue;
      }
      exempt.set(e.path, e.reason);
    }
    const exemptGlobs = [];
    for (const g of manifest.exemptGlobs || []) {
      if (!g || !g.glob) {
        errors.push(`${MANIFEST}: an "exemptGlobs" entry is missing "glob".`);
        continue;
      }
      if (!g.reason || !String(g.reason).trim()) {
        errors.push(`${MANIFEST}: exempt glob "${g.glob}" has no reason. Say why, or declare the files.`);
        continue;
      }
      exemptGlobs.push({ glob: g.glob, re: globToRegExp(g.glob), hits: 0 });
    }

    const candidates = [];
    for (const root of cfg.roots) {
      if (!fs.existsSync(abs(root))) {
        errors.push(`${MANIFEST}: userFacingPaths root "${root}" does not exist.`);
        continue;
      }
      candidates.push(...walk(root));
    }
    for (const f of cfg.files) {
      if (!exists(f)) errors.push(`${MANIFEST}: userFacingPaths file "${f}" does not exist.`);
      else candidates.push(f);
    }
    // Documents sitting directly in docs/ (not in a subdirectory) count too — that is
    // where a loose user-facing doc lands when nobody thinks about the convention.
    const docsDir = cfg.topLevelDocsDir;
    if (docsDir) {
      if (!fs.existsSync(abs(docsDir))) {
        errors.push(`${MANIFEST}: userFacingPaths topLevelDocsDir "${docsDir}" does not exist.`);
      } else {
        for (const e of fs.readdirSync(abs(docsDir), { withFileTypes: true })) {
          if (e.isFile() && DOC_EXT.test(e.name)) candidates.push(`${docsDir}/${e.name}`);
        }
      }
    }

    // An empty candidate set is a failure, never a pass: a check that inspects nothing
    // reports green for an absence (the same rule verify-harness states for its inputs).
    if (candidates.length === 0) {
      errors.push(
        `${MANIFEST}: the user-facing paths matched no documents at all — the inverse check would inspect nothing.`,
      );
    }
    for (const f of new Set(candidates)) {
      // A declared mirror is the other half of a pair, not a doc of its own.
      if (declaredSources.has(f) || declaredMirrors.has(f) || exempt.has(f)) continue;
      const g = exemptGlobs.find((x) => x.re.test(f));
      if (g) {
        g.hits++;
        continue;
      }
      errors.push(
        `undeclared user-facing doc: ${f} — add it to "mirrors" in ${MANIFEST} (and create ` +
          `its mirror), or exempt it there ("exempt" or "exemptGlobs") with a reason. See docs/DOC-TRANSLATION.MD.`,
      );
    }
    // A glob that exempts nothing is stale and would silently swallow whatever lands there next.
    for (const g of exemptGlobs) {
      if (g.hits === 0) errors.push(`${MANIFEST}: exempt glob "${g.glob}" matches no document — remove it.`);
    }
    if (!errors.length) {
      ok.push(`inverse check: ${new Set(candidates).size} user-facing doc(s), all declared or exempt`);
    }
  }
}

// --- Report ----------------------------------------------------------------
const bar = '='.repeat(66);
console.log(bar);
console.log('  check-doc-drift — bilingual user-facing-doc mirrors');
console.log(bar);
if (process.env.VERBOSE) for (const s of ok) console.log('  ok   ' + s);
if (errors.length === 0) {
  console.log(`  PASS — ${ok.length} check(s) green, mirrors in sync.`);
  console.log(bar);
  process.exit(0);
}
for (const e of errors) console.log('  FAIL ' + e);
console.log(bar);
console.log(`  ${errors.length} problem(s). Fix before shipping.`);
process.exit(1);
