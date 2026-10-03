#!/usr/bin/env node
/**
 * Font licence bundle — and the gate that keeps the font record honest.
 *
 * The OFL-1.1 requires that the licence travels with the font files. The build copies
 * `.woff2` files out of `@fontsource/*` packages into `dist/…/assets/fonts/<family>/`
 * and left the `LICENSE` beside them behind, so the shipped artefact carried the fonts
 * without their licence. This script writes the missing half:
 *
 *   src/assets/fonts/LICENSES.txt   (gitignored, regenerated each build)
 *
 * which the existing `src/assets/**` asset glob then copies into the build output.
 * One file rather than fourteen: the licence text is identical across the packages —
 * only the copyright lines differ, and those are reproduced per family below.
 *
 * It also *checks*, because a licence record that nobody verifies drifts. Three sources
 * have to agree — `angular.json` (what actually ships), `package.json` (what is
 * installed) and `docs/THIRD-PARTY-FONTS.md` (what we tell people) — and any
 * disagreement fails the build rather than shipping a false statement:
 *
 *   - every shipped family is a *runtime* dependency (`--omit=dev` must not break the
 *     build — `@fontsource/opendyslexic` sat in devDependencies while being copied
 *     into the production output)
 *   - every package declares OFL-1.1 and carries a LICENSE file
 *   - the doc table names exactly the shipped families, with the installed versions
 *   - the doc's stated family count matches reality (it said "eleven" for 14)
 *
 * Usage: node scripts/build-font-licenses.mjs   (wired into prebuild and prebuild:prod)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOC = 'docs/THIRD-PARTY-FONTS.md';
const OUT = 'src/assets/fonts/LICENSES.txt';
const EXPECTED_LICENCE = 'OFL-1.1';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const errors = [];

// --- 1. what actually ships, straight out of the build config --------------
const angular = JSON.parse(read('angular.json'));
const assets = angular.projects?.vibecore?.architect?.build?.options?.assets ?? [];
const shipped = [];
for (const a of assets) {
  const m = typeof a === 'object' && /^node_modules\/(@fontsource\/[^/]+)\/files$/.exec(a.input ?? '');
  if (m) shipped.push({ pkg: m[1], glob: a.glob, output: a.output });
}
if (shipped.length === 0) {
  console.error(
    `${OUT}: no @fontsource asset entries found in angular.json — refusing to write an empty license file.`,
  );
  process.exit(1);
}

// --- 2. cross-check against package.json and the packages themselves -------
const pkg = JSON.parse(read('package.json'));
const families = [];
for (const { pkg: name, glob } of shipped.sort((a, b) => a.pkg.localeCompare(b.pkg))) {
  if (!pkg.dependencies?.[name]) {
    errors.push(
      pkg.devDependencies?.[name]
        ? `${name} ships into the production build but is a devDependency — \`npm ci --omit=dev\` would produce a build with a missing font.`
        : `${name} is copied by angular.json but is not a dependency at all.`,
    );
    continue;
  }
  let meta;
  try {
    meta = JSON.parse(read(`node_modules/${name}/package.json`));
  } catch {
    errors.push(`${name} is not installed — run npm install before building.`);
    continue;
  }
  if (meta.license !== EXPECTED_LICENCE) {
    errors.push(
      `${name} declares "${meta.license}", not ${EXPECTED_LICENCE} — the license section of ${DOC} no longer covers it.`,
    );
    continue;
  }
  let text;
  try {
    text = read(`node_modules/${name}/LICENSE`);
  } catch {
    errors.push(`${name} ships no LICENSE file — the OFL requires the license to travel with the fonts.`);
    continue;
  }
  families.push({ name, version: meta.version, glob, text: text.trim() });
}

// --- 3. cross-check against the doc ----------------------------------------
const doc = read(DOC);
const documented = new Map();
for (const m of doc.matchAll(/`(@fontsource\/[a-z0-9-]+)`\s*\(([^)]+)\)/g)) documented.set(m[1], m[2]);
for (const f of families) {
  if (!documented.has(f.name)) {
    errors.push(`${f.name} ships but has no row in ${DOC} — a family that ships without a row is a compliance gap.`);
  } else if (documented.get(f.name) !== f.version) {
    errors.push(`${DOC} lists ${f.name} as ${documented.get(f.name)}, installed is ${f.version}.`);
  }
}
for (const name of documented.keys()) {
  if (!families.some((f) => f.name === name)) errors.push(`${DOC} lists ${name}, which nothing ships.`);
}
const claimed = /All (\d+) families are licensed/.exec(doc);
if (!claimed) {
  errors.push(
    `${DOC}: cannot find the "All <n> families are licensed under …" sentence — the count is no longer checkable.`,
  );
} else if (Number(claimed[1]) !== families.length) {
  errors.push(`${DOC} says "All ${claimed[1]} families", ${families.length} ship.`);
}

if (errors.length) {
  console.error('font license check FAILED:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

// --- 4. write the bundle ---------------------------------------------------
const header = [
  'FONT LICENSES',
  '',
  `Every typeface bundled with this site is licensed under the SIL Open Font License 1.1.`,
  `The full text of each package's license is reproduced below, one section per family,`,
  `so that the license travels with the font files as the OFL requires.`,
  '',
  `Generated by scripts/build-font-licenses.mjs — do not edit.`,
  '',
];
const body = families.map((f) => `${'='.repeat(78)}\n${f.name} ${f.version}\n${'='.repeat(78)}\n\n${f.text}\n`);
fs.mkdirSync(path.join(ROOT, path.dirname(OUT)), { recursive: true });
fs.writeFileSync(path.join(ROOT, OUT), header.join('\n') + '\n' + body.join('\n'), 'utf8');
console.log(`Wrote ${OUT} — ${families.length} families, all ${EXPECTED_LICENCE}.`);
