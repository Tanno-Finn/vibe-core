/**
 * validate-thumbnails.js — build-time guard for the baked thumbnail manifest.
 *
 * Kit-simplified (2026-07): the original Portal validator also fingerprinted the
 * dev-only @case source components (illustration-source / content-visual-snippet-source)
 * and required every @case id to be baked. In this starter kit the shipped thumbnails
 * are generic PLACEHOLDERS covering only the surviving seed content — they are NOT
 * re-baked from those (still Portal-flavoured, dev-only) source components, and the
 * `thumbnail-source-hash` helper is not part of the kit. So this validator now checks
 * exactly one thing, which is what actually breaks at runtime:
 *
 *   Every id listed in BAKED_ILLUSTRATION / BAKED_SNIPPET has both its light and dark
 *   WebP present under src/assets/images/thumbnails/  (a missing file → blank tile).
 *
 * Wired in as the last step of `prebuild:prod` (`npm run thumbs:validate`), so
 * `npm run build:prod` fails before `ng build` when a thumbnail is missing. Escape
 * hatch: THUMBS_SKIP_VALIDATE=1 (use deliberately).
 *
 * The check is non-vacuous: every entry of each Set literal must parse as a quoted id
 * ('…' or "…" — Prettier writes single quotes). Until 2026-09-23 only double-quoted ids
 * were recognised, so the gate reported "0 illustrations + 0 snippets" as OK while the
 * manifest listed 2 + 15; an entry the parser cannot read now fails the gate instead.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MANIFEST = path.join(ROOT, 'src/app/components/shared/baked-thumbnails.manifest.ts');
const DIR = path.join(ROOT, 'src/assets/images/thumbnails');

// Returns { found: true, ids } when the `NAME = new Set<string>([...])` assignment
// was located (ids may legitimately be empty — a manifest CAN ship with no baked
// ids of one kind). Returns { found: false } when the assignment itself could not
// be located at all — e.g. the manifest was reformatted/regenerated in a shape this
// regex no longer matches. Those two cases must stay distinguishable: silently
// treating "couldn't find the assignment" as "found, and it's empty" would make
// this gate report a broken/unparsable manifest as fully valid (0 ids to check).
//
// `entries` counts the items of the literal (comma-separated, comments stripped) without
// caring what they look like, so a quoting style the id regex does not know shows up as
// ids.length < entries instead of silently shrinking the set of files to check.
function arr(src, name) {
  const m = src.match(new RegExp(name + '\\s*=\\s*new Set<string>\\(\\[([^\\]]*)\\]'));
  if (!m) return { found: false, ids: [], entries: 0 };
  const body = m[1].replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const entries = body.split(',').filter((part) => part.trim() !== '').length;
  const ids = [...body.matchAll(/'([^'\n]+)'|"([^"\n]+)"/g)].map((q) => q[1] ?? q[2]);
  return { found: true, ids, entries };
}

function main() {
  if (process.env.THUMBS_SKIP_VALIDATE === '1') {
    console.log('thumbs:validate SKIPPED (THUMBS_SKIP_VALIDATE=1)');
    return;
  }
  let man;
  try {
    man = fs.readFileSync(MANIFEST, 'utf8');
  } catch (err) {
    console.error(`\n✘ thumbs:validate FAILED: could not read ${path.relative(ROOT, MANIFEST)}: ${err.message}`);
    console.error('  Restore the manifest from git; the kit ships no thumbnail baker.\n');
    process.exit(1);
  }
  const illResult = arr(man, 'BAKED_ILLUSTRATION');
  const snipResult = arr(man, 'BAKED_SNIPPET');
  if (!illResult.found || !snipResult.found) {
    console.error(
      `\n✘ thumbs:validate FAILED: could not find ${!illResult.found ? 'BAKED_ILLUSTRATION' : 'BAKED_SNIPPET'} = new Set<string>([...]) in the manifest.`,
    );
    console.error(
      `  ${path.relative(ROOT, MANIFEST)} may have been reformatted or regenerated in a shape this validator no longer recognizes —`,
    );
    console.error('  treating that as a failure, not as "0 ids to check".\n');
    process.exit(1);
  }
  for (const [name, r] of [
    ['BAKED_ILLUSTRATION', illResult],
    ['BAKED_SNIPPET', snipResult],
  ]) {
    if (r.ids.length !== r.entries) {
      console.error(
        `\n✘ thumbs:validate FAILED: ${name} has ${r.entries} entr${r.entries === 1 ? 'y' : 'ies'} but ${r.ids.length} parse as a quoted id.`,
      );
      console.error('  An entry this validator cannot read would go unchecked — fix the manifest or this parser,');
      console.error('  do not let the gate pass over ids it never looked at.\n');
      process.exit(1);
    }
  }
  const ill = illResult.ids;
  const snip = snipResult.ids;

  const missing = [];
  const check = (id, prefix) => {
    for (const v of [`${prefix}${id}.webp`, `${prefix}${id}.dark.webp`]) {
      if (!fs.existsSync(path.join(DIR, v))) missing.push(v);
    }
  };
  ill.forEach((id) => check(id, ''));
  snip.forEach((id) => check(id, 'snip__'));

  if (missing.length) {
    console.error('\n✘ thumbs:validate FAILED:');
    console.error(
      `  - ${missing.length} missing webp file(s): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''}`,
    );
    console.error('\n  Every manifest id needs a <id>.webp and <id>.dark.webp (snippets: snip__<id>).');
    console.error('  Override (deliberately): THUMBS_SKIP_VALIDATE=1\n');
    process.exit(1);
  }
  console.log(
    `OK  thumbs:validate — ${ill.length} illustrations + ${snip.length} snippets, all light+dark files present.`,
  );
}
main();
