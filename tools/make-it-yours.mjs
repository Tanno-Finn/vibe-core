#!/usr/bin/env node
/**
 * make-it-yours.mjs — turn the kit's showcase into your own portal (kit tool
 * `make-it-yours`, capability `site:make-it-yours`).
 *
 * WHAT: three jobs, one per mode.
 *   * No mode: a read-only status in plain words — the site's name and start page, which
 *     features are on, how much sample content is left, which imprint facts are still
 *     placeholders, how many strings a new language would need (counted by
 *     tools/lang-status.mjs), and the next step.
 *   * `--site <answers.json>`: the site's name, short name, logo icon, start page, feature
 *     switches and operator go into `src/config/site.json`; the short description per
 *     language into `meta.description` of every locale's `meta.json`; and the two files
 *     served before any script runs follow: `src/index.html` (`<title>`, `og:site_name`,
 *     `og:title`, `twitter:title`, and the three description tags in the site's default
 *     language) and the title text of `src/assets/images/og-image.svg` — the name tags and
 *     the image only when the answers give a name, the description tags only with a
 *     description. A new name needs a new description in every configured locale
 *     (src/config/languages.json).
 *   * `--remove-samples`: deletes the kit's sample content listed in
 *     `src/config/samples.json` — the sample articles (page folder, core file, i18n module in
 *     every locale folder on disk, their two routes between the `// sample:begin <id>` /
 *     `// sample:end <id>` markers of src/app/app.routes.ts, their entries in the article
 *     index and in angular.json's test list), the sample glossary terms and sources (core and
 *     translation files, index entries, references.json), the sample learning paths, the
 *     listed i18n keys, then every key only the removed samples read (the orphan rule of
 *     scripts/check-i18n-keys.mjs, scripts/lib/i18n-orphans.mjs); regenerates
 *     src/config/easy-language-availability.json; empties the lists in samples.json. Seeds
 *     (seed-*, example-demo, the seed article) stay: they are the blueprints.
 *
 * HOW: every check that can run on the plan runs before the first write, and a write that fails undoes all the ones
 * before it (exit 3). `--site` refuses unknown answers, an unknown feature, a start page that
 * is no page or is switched off, a missing language (exit 2, nothing written) — by the rules
 * of src/config/site-rules.mts and the drift check of scripts/check-site-config.mjs, run on
 * the planned files. `--remove-samples` refuses a folder with unsaved git changes (exit 2), so
 * one `git revert` undoes it; then it needs the i18n gate green (the orphan rule is only safe
 * on a green gate), samples.json in step with the files and markers, and nothing that stays
 * referring to a sample (scripts/lib/samples.mjs) — else exit 3, nothing written. After
 * writing it runs the i18n gate once more on the written tree (a key that code which stays
 * still reads, locale parity) and puts every file back when it is red (exit 3). A second
 * run finds nothing to remove (exit 0). It never commits: it prints the staging line and the
 * undo. `--dry-run` shows the plan and writes nothing. Same input, same bytes.
 *
 * WHAT IT CANNOT SEE: whether the texts you gave fit your site, the imprint's legal
 * content, and whether the build still renders every page (run `npm run build:prod`).
 *
 * Run:  node tools/make-it-yours.mjs
 *       node tools/make-it-yours.mjs --site answers.json [--dry-run]
 *       node tools/make-it-yours.mjs --remove-samples [--dry-run]
 */
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXIT, ToolError, inputFile, outputPath, readText, runTool } from './lib/cli.mjs';
import { formatConfigJson } from './lib/config-json.mjs';
import {
  CORE,
  MODULES,
  ROUTES_FILE,
  SAMPLES_FILE,
  TRANSLATIONS,
  consistencyProblems,
  cutMarkerBlocks,
  diskIo,
  emptiedSamples,
  isEmptySamples,
  referenceProblems,
} from '../scripts/lib/samples.mjs';
import { findOrphans, isOrphanSource, leafKeys, stripCodeSamples } from '../scripts/lib/i18n-orphans.mjs';
import { easyAvailabilityFromModules } from '../scripts/lib/i18n-split.mjs';
import { KIT_DEFAULT_SITE, validateSiteConfig } from '../scripts/lib/site-config.mjs';
import { checkSite, routedPagesFromSource } from '../scripts/check-site-config.mjs';
import { findPlaceholders, stripJsonComments } from '../scripts/check-imprint.mjs';

const TOOLS_DIR = dirname(fileURLToPath(import.meta.url));
const SITE_FILE = 'src/config/site.json';
const FEATURES_FILE = 'src/config/features.json';
const LANGUAGES_FILE = 'src/config/languages.json';
const INDEX_FILE = 'src/index.html';
const OG_SVG_FILE = 'src/assets/images/og-image.svg';
const AVAILABILITY_FILE = 'src/config/easy-language-availability.json';
const ANSWER_KEYS = ['name', 'shortName', 'logoIcon', 'startPage', 'features', 'operator', 'description'];
const OPERATOR_KEYS = ['name', 'address', 'email', 'supervisoryAuthority'];
const AUTHORITY_KEYS = ['name', 'address', 'website'];

const abs = (root, p) => join(root, ...p.split('/'));
const readJsonAt = (root, p) => JSON.parse(readText(abs(root, p)));
const json = (v) => JSON.stringify(v, null, 2) + '\n';
const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The configured locales, Easy variants included, from languages.json. */
function configuredLocales(root) {
  const cfg = readJsonAt(root, LANGUAGES_FILE);
  return {
    locales: (cfg.languages || []).flatMap((l) => [l.code, l.easyCode].filter(Boolean)),
    defaultLanguage: cfg.defaultLanguage,
    keySource: cfg.keySourceLanguage,
  };
}

/** Every folder under src/assets/i18n/modules — configured or not (an Italian draft counts). */
function localeFolders(root) {
  const dir = abs(root, MODULES);
  return existsSync(dir)
    ? readdirSync(dir)
        .filter((d) => statSync(join(dir, d)).isDirectory())
        .sort()
    : [];
}

/** Every file below `p` (project-relative, forward slashes), sorted. */
function filesBelow(root, p) {
  const dir = abs(root, p);
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const child = `${p}/${name}`;
    if (statSync(abs(root, child)).isDirectory()) out.push(...filesBelow(root, child));
    else out.push(child);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Writing with undo
// ---------------------------------------------------------------------------

/**
 * Applies `ops` — `{ path, content }` (write) or `{ path, content: null }` (delete) — in
 * order. The bytes before each op are kept; a failure puts every earlier op back and stops
 * with exit 3. Returns `undo()`, which puts every op back after a later check fails.
 */
function applyWithUndo(root, report, ops) {
  const done = [];
  const undo = () => {
    for (const [file, before] of [...done].reverse()) {
      if (before) {
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, before);
      } else if (existsSync(file)) unlinkSync(file);
    }
    report.outputs.length = 0;
  };
  try {
    for (const op of ops) {
      const file = outputPath(root, abs(root, op.path), { force: true });
      const before = existsSync(file) ? readFileSync(file) : null;
      if (op.content === null) {
        unlinkSync(file);
        done.push([file, before]);
      } else {
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, op.content);
        done.push([file, before]);
        report.outputs.push(file);
      }
    }
  } catch (err) {
    undo();
    throw new ToolError(
      EXIT.ENV,
      `writing failed (${err.message}) — everything written or deleted before it was put back; nothing changed.`,
    );
  }
  return undo;
}

/** Removes the now-empty folders below (and including) each of `dirs`, deepest first. */
function removeEmptyFolders(root, dirs) {
  const prune = (p) => {
    const dir = abs(root, p);
    if (!existsSync(dir) || !statSync(dir).isDirectory()) return;
    for (const name of readdirSync(dir)) prune(`${p}/${name}`);
    if (readdirSync(dir).length === 0) rmdirSync(dir);
  };
  for (const d of dirs) prune(d);
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

/** How many strings and words a brand-new language would need (tools/lang-status.mjs on an unused code). */
function newLanguageNeeds(root) {
  const res = spawnSync(process.execPath, [join(TOOLS_DIR, 'lang-status.mjs'), 'xx', '--json'], {
    cwd: root,
    encoding: 'utf8',
    timeout: 60_000,
  });
  if (res.status !== 0) return null;
  try {
    const j = JSON.parse(res.stdout);
    const words = (c) => c.collections.reduce((a, k) => a + (k.missingWords ?? 0), 0);
    return {
      uiKeys: j.ui[0].totals.keys,
      uiWords: j.ui[0].totals.missingWords,
      easyUiWords: j.ui[1].totals.missingWords,
      contentWords: words(j.content[0]),
      easyContentWords: words(j.content[1]),
    };
  } catch {
    return null;
  }
}

/** Placeholder facts of the imprint: site.json's operator and every configured locale's impressum.json. */
function imprintGaps(root, locales) {
  const gaps = [];
  const siteText = existsSync(abs(root, SITE_FILE)) ? readText(abs(root, SITE_FILE)) : '';
  gaps.push(...findPlaceholders(stripJsonComments(siteText), SITE_FILE, { operator: true }));
  for (const l of locales) {
    const file = `${MODULES}/${l}/impressum.json`;
    if (existsSync(abs(root, file))) gaps.push(...findPlaceholders(readText(abs(root, file)), file));
  }
  return gaps;
}

function status(root, report) {
  const site = readJsonAt(root, SITE_FILE);
  const catalog = existsSync(abs(root, FEATURES_FILE)) ? readJsonAt(root, FEATURES_FILE) : { features: {} };
  const samples = existsSync(abs(root, SAMPLES_FILE)) ? readJsonAt(root, SAMPLES_FILE) : null;
  const { locales } = configuredLocales(root);
  const ids = Object.keys(catalog.features ?? {});
  const off = ids.filter((id) => site.features?.[id] === false);
  const on = ids.filter((id) => !off.includes(id));
  const left = samples
    ? Object.fromEntries(
        ['articles', 'glossary', 'sources', 'learningPaths'].map((k) => [k, (samples[k] ?? []).length]),
      )
    : null;
  const samplesLeft = left ? Object.values(left).some((n) => n > 0) : false;
  const gaps = imprintGaps(root, locales);
  const needs = newLanguageNeeds(root);
  const named = site.name !== KIT_DEFAULT_SITE.name;

  let next;
  if (!named)
    next = {
      step: 'site',
      say: 'give the site its name and description: node tools/make-it-yours.mjs --site answers.json',
    };
  else if (samplesLeft)
    next = {
      step: 'remove-samples',
      say: 'remove the sample content: node tools/make-it-yours.mjs --remove-samples --dry-run, then without --dry-run',
    };
  else if (gaps.length)
    next = {
      step: 'imprint',
      say: 'fill in the imprint: the operator through --site, the site subject in impressum.json of every language',
    };
  else
    next = {
      step: 'content',
      say: 'add your own content (/new-content) or a language (docs/how-to/add-a-language.md)',
    };

  report.say(
    `Your site: "${site.name}"${site.shortName ? ` (short: "${site.shortName}")` : ''}${named ? '' : ' — still the kit’s name'}`,
  );
  report.say(`  start page: /${site.startPage}`);
  report.say(`  features on: ${on.length ? on.join(', ') : 'none'}`);
  report.say(`  features off: ${off.length ? off.join(', ') : 'none'}`);
  report.say('');
  if (left) {
    report.say(
      samplesLeft
        ? `Sample content left: ${plural(left.articles, 'article')}, ${plural(left.glossary, 'glossary term')}, ${plural(left.sources, 'source')}, ${plural(left.learningPaths, 'learning path')}.`
        : 'Sample content left: none — the samples are removed.',
    );
    report.say(
      '  The blueprints (seed-*, example-demo, the seed article) stay: they show how each kind of page is built,',
    );
    report.say('  and the site shows them while their feature is on.');
  }
  report.say('');
  if (gaps.length) {
    const byFile = new Map();
    for (const g of gaps) byFile.set(g.file, (byFile.get(g.file) ?? new Set()).add(g.label));
    report.say(
      `Imprint: ${plural(gaps.length, 'placeholder')} still to fill in (a real domain refuses to build with them):`,
    );
    for (const [file, labels] of byFile) report.say(`  - ${file}: ${[...labels].join(', ')}`);
  } else report.say('Imprint: no placeholders left.');
  report.say('');
  if (needs) {
    report.say(
      `A new language would need ${needs.uiKeys} interface texts (${needs.uiWords} words, ${needs.easyUiWords} in Easy Language) and ${needs.contentWords} words of content (${needs.easyContentWords} in Easy Language).`,
    );
  } else report.warn('could not count what a new language needs (tools/lang-status.mjs did not answer)');
  report.say('');
  report.say(`Next step: ${next.say}`);

  report.data.mode = 'status';
  report.data.site = {
    name: site.name,
    shortName: site.shortName ?? null,
    logoIcon: site.logoIcon ?? null,
    startPage: site.startPage,
    named,
  };
  report.data.features = { on, off };
  report.data.samples = left;
  report.data.imprint = { gaps: gaps.map(({ file, line, label }) => ({ file, line, label })) };
  report.data.newLanguage = needs;
  report.data.next = next.step;
  report.notChecked.push(
    'whether the imprint facts are legally complete — only that no kit placeholder is left',
    'whether the build renders every page: npm run build:prod',
  );
}

// ---------------------------------------------------------------------------
// --site
// ---------------------------------------------------------------------------

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** One `<meta attr="name" content="…" />`, on one line when it fits in 120 characters (as Prettier writes it). */
function metaTag(indent, attr, name, value) {
  const one = `${indent}<meta ${attr}="${name}" content="${escAttr(value)}" />`;
  if (one.length <= 120) return one;
  return `${indent}<meta\n${indent}  ${attr}="${name}"\n${indent}  content="${escAttr(value)}"\n${indent}/>`;
}

/**
 * index.html with the name and the description in the tags crawlers read — each only when
 * the answers give it (undefined leaves those tags as they are), so an answers file with
 * just the operator does not reset a richer `og:title` to the bare name.
 */
function rewriteIndexHtml(html, name, description) {
  let out = html;
  const set = (attr, key, value) => {
    const re = new RegExp(`([ \\t]*)<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/>`);
    out = out.replace(re, (_, indent) => metaTag(indent, attr, key, value));
  };
  if (name !== undefined) {
    // Replacer functions, not strings: a name like "Spar$$" or "A$&B" must not be read as `$` patterns.
    out = out.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escText(name)}</title>`);
    for (const [attr, key] of [
      ['property', 'og:site_name'],
      ['property', 'og:title'],
      ['name', 'twitter:title'],
    ])
      set(attr, key, name);
  }
  if (description !== undefined) {
    for (const [attr, key] of [
      ['name', 'description'],
      ['property', 'og:description'],
      ['name', 'twitter:description'],
    ])
      set(attr, key, description);
  }
  return out;
}

/** The OG image with the name as the text of its first `<text>` element. */
function rewriteOgSvg(svg, name) {
  return svg.replace(/(<text\b[^>]*>)([\s\S]*?)(<\/text>)/i, (_, open, inner, close) => {
    const text = inner.replace(/\S(?:[\s\S]*\S)?/, () => escText(name));
    return `${open}${/\S/.test(inner) ? text : escText(name)}${close}`;
  });
}

function readAnswers(root, file) {
  let answers;
  try {
    answers = JSON.parse(readText(inputFile(root, file, { exts: ['.json'] })));
  } catch (err) {
    if (err instanceof ToolError) throw err;
    throw new ToolError(EXIT.USAGE, `--site is not valid JSON: ${err.message}`);
  }
  if (!isObject(answers)) throw new ToolError(EXIT.USAGE, '--site must hold one JSON object.');
  const unknown = Object.keys(answers).filter((k) => !ANSWER_KEYS.includes(k));
  if (unknown.length)
    throw new ToolError(
      EXIT.USAGE,
      `--site has answers the tool does not know: ${unknown.join(', ')} (known: ${ANSWER_KEYS.join(', ')}).`,
    );
  return answers;
}

function siteMode(root, report, { file, dryRun }) {
  const answers = readAnswers(root, file);
  const site = readJsonAt(root, SITE_FILE);
  const catalog = existsSync(abs(root, FEATURES_FILE)) ? readJsonAt(root, FEATURES_FILE) : undefined;
  const { locales, defaultLanguage } = configuredLocales(root);

  // Merge the answers into site.json, keeping its notes and order.
  const merged = structuredClone(site);
  for (const k of ['name', 'startPage']) if (answers[k] !== undefined) merged[k] = answers[k];
  for (const k of ['shortName', 'logoIcon']) {
    if (answers[k] === null) delete merged[k];
    else if (answers[k] !== undefined) merged[k] = answers[k];
  }
  if (answers.features !== undefined) {
    if (!isObject(answers.features))
      throw new ToolError(EXIT.USAGE, '--site "features" must be an object like { "news": false }.');
    merged.features = { ...site.features, ...answers.features };
  }
  if (answers.operator !== undefined) {
    const op = answers.operator;
    if (!isObject(op)) throw new ToolError(EXIT.USAGE, '--site "operator" must be an object.');
    const bad = Object.keys(op).filter((k) => !OPERATOR_KEYS.includes(k));
    if (bad.length)
      throw new ToolError(
        EXIT.USAGE,
        `--site "operator" has unknown fields: ${bad.join(', ')} (known: ${OPERATOR_KEYS.join(', ')}).`,
      );
    if (op.supervisoryAuthority !== undefined) {
      if (!isObject(op.supervisoryAuthority))
        throw new ToolError(EXIT.USAGE, '--site "operator.supervisoryAuthority" must be an object.');
      const badA = Object.keys(op.supervisoryAuthority).filter((k) => !AUTHORITY_KEYS.includes(k));
      if (badA.length)
        throw new ToolError(
          EXIT.USAGE,
          `--site "operator.supervisoryAuthority" has unknown fields: ${badA.join(', ')}.`,
        );
    }
    merged.operator = {
      ...site.operator,
      ...op,
      supervisoryAuthority: { ...site.operator?.supervisoryAuthority, ...op.supervisoryAuthority },
    };
  }
  // Insert optional fields right after their note, so the file reads as before.
  const ordered = {};
  for (const [k, v] of Object.entries(merged)) {
    if (k === 'shortName' || k === 'logoIcon') continue;
    ordered[k] = v;
    if (k === '_shortName' && 'shortName' in merged) ordered.shortName = merged.shortName;
    if (k === '_logoIcon' && 'logoIcon' in merged) ordered.logoIcon = merged.logoIcon;
  }
  for (const k of ['shortName', 'logoIcon']) if (k in merged && !(k in ordered)) ordered[k] = merged[k];

  // The description, per configured locale.
  const description = answers.description;
  if (description !== undefined) {
    if (!isObject(description))
      throw new ToolError(
        EXIT.USAGE,
        `--site "description" must be an object with one text per language (${locales.join(', ')}).`,
      );
    const missing = locales.filter((l) => typeof description[l] !== 'string' || !description[l].trim());
    if (missing.length)
      throw new ToolError(
        EXIT.USAGE,
        `--site "description" has no text for ${missing.join(', ')} — every configured language and Easy variant needs its own (${locales.join(', ')}).`,
      );
    const extra = Object.keys(description).filter((l) => !locales.includes(l));
    if (extra.length)
      throw new ToolError(
        EXIT.USAGE,
        `--site "description" names ${extra.join(', ')}, which is not configured (${locales.join(', ')}).`,
      );
  }
  const renamed = answers.name !== undefined && answers.name !== site.name;
  if (renamed && description === undefined) {
    throw new ToolError(
      EXIT.USAGE,
      `a new name needs a new short description too: add "description": { ${locales.map((l) => `"${l}": "…"`).join(', ')} } to the answers.`,
    );
  }

  // Validate with the app's rules, then the planned files with the gate's drift check.
  const routesSource = readText(abs(root, ROUTES_FILE));
  const problems = validateSiteConfig(ordered, { knownPages: routedPagesFromSource(routesSource), catalog });
  if (problems.length)
    throw new ToolError(EXIT.USAGE, `the answers do not make a valid site:\n    ${problems.join('\n    ')}`);
  const indexBefore = readText(abs(root, INDEX_FILE));
  const svgBefore = readText(abs(root, OG_SVG_FILE));
  // Only what the answers give: without a name, neither the name-bearing tags nor the OG image change.
  const indexAfter = rewriteIndexHtml(indexBefore, answers.name, description?.[defaultLanguage]);
  const svgAfter = answers.name === undefined ? svgBefore : rewriteOgSvg(svgBefore, ordered.name);
  const drift = checkSite({ site: ordered, routesSource, indexHtml: indexAfter, ogSvg: svgAfter, catalog });
  if (drift.length)
    throw new ToolError(EXIT.USAGE, `the site would not pass check-site-config:\n    ${drift.join('\n    ')}`);

  const ops = [];
  const plan = (path, before, after) => {
    if (before !== after) ops.push({ path, content: after });
  };
  plan(SITE_FILE, readText(abs(root, SITE_FILE)), formatConfigJson(ordered));
  if (description !== undefined) {
    for (const l of locales) {
      const path = `${MODULES}/${l}/meta.json`;
      if (!existsSync(abs(root, path))) throw new ToolError(EXIT.USAGE, `${path} is missing — is ${l} set up?`);
      const text = readText(abs(root, path));
      const meta = JSON.parse(text);
      meta.description = description[l];
      plan(path, text, json(meta));
    }
  }
  plan(INDEX_FILE, indexBefore, indexAfter);
  plan(OG_SVG_FILE, svgBefore, svgAfter);

  report.say(
    ops.length === 0
      ? 'Nothing to change: the files already say what the answers say.'
      : `${dryRun ? 'Plan (dry run, nothing written)' : 'Your site'}: "${ordered.name}", start page /${ordered.startPage}`,
  );
  if (dryRun) for (const op of ops) report.say(`  would write ${op.path}`);
  else if (ops.length) {
    applyWithUndo(root, report, ops);
    for (const op of ops) report.say(`  wrote ${abs(root, op.path)}`);
  }
  report.say('');
  report.say('Check it: node scripts/check-site-config.mjs   Then look at it: npm start');
  report.data.mode = 'site';
  report.data.changed = ops.map((o) => o.path);
  report.data.site = { name: ordered.name, startPage: ordered.startPage, features: ordered.features };
  report.notChecked.push(
    'the texts themselves: they were copied from the answers as given',
    'the site subject in impressum.json ("[Thema der Website]") — fill it in by hand in every language',
    'the preview picture src/assets/images/og-image.png: render it again with node scripts/render-og.mjs',
  );
}

// ---------------------------------------------------------------------------
// --remove-samples
// ---------------------------------------------------------------------------

/** An io (scripts/lib/samples.mjs) that sees the disk with the planned writes and deletes applied. */
function overlayIo(root, overlay) {
  const disk = diskIo(root);
  const io = {
    exists: (p) =>
      overlay.has(p) ? overlay.get(p) !== null : disk.exists(p) && (!disk.isDir(p) || io.list(p).length > 0),
    isDir: (p) => disk.isDir(p) && io.list(p).length > 0,
    read: (p) => {
      if (overlay.has(p)) {
        if (overlay.get(p) === null) throw new Error(`${p} is deleted in the plan`);
        return overlay.get(p);
      }
      return disk.read(p);
    },
    list: (p) =>
      disk.list(p).filter((name) => {
        const child = `${p}/${name}`;
        if (overlay.has(child)) return overlay.get(child) !== null;
        return !disk.isDir(child) || io.list(child).length > 0;
      }),
  };
  return io;
}

/** Deletes a key path (`ns.a.b`) from a locale's modules; returns the number of leaf keys removed. */
function deleteKeyPath(modules, keyPath) {
  const [ns, ...rest] = keyPath.split('.');
  if (!modules[ns]) return 0;
  if (rest.length === 0) {
    const n = leafKeys({ [ns]: modules[ns] }).size;
    modules[ns] = {};
    return n;
  }
  const trail = [modules[ns]];
  for (const part of rest.slice(0, -1)) {
    const next = trail[trail.length - 1][part];
    if (!isObject(next)) return 0;
    trail.push(next);
  }
  const last = rest[rest.length - 1];
  const parent = trail[trail.length - 1];
  if (!(last in parent)) return 0;
  const n = isObject(parent[last]) ? leafKeys({ x: parent[last] }).size : 1;
  delete parent[last];
  // Drop parents the removal left empty.
  for (let i = trail.length - 1; i > 0; i--) {
    if (Object.keys(trail[i]).length === 0) delete trail[i - 1][rest[i - 1]];
  }
  return n;
}

/** Loads every module of every locale folder: { locale: { ns: object } } and their original texts. */
function loadModules(root, folders) {
  const modules = {};
  const texts = {};
  for (const l of folders) {
    modules[l] = {};
    for (const f of readdirSync(abs(root, `${MODULES}/${l}`))
      .filter((x) => x.endsWith('.json') && !x.startsWith('_'))
      .sort()) {
      const path = `${MODULES}/${l}/${f}`;
      texts[path] = readText(abs(root, path));
      try {
        modules[l][f.slice(0, -5)] = JSON.parse(texts[path]);
      } catch (err) {
        throw new ToolError(
          EXIT.ENV,
          `${path} is not valid JSON (${err.message}) — the i18n gate should have caught it.`,
        );
      }
    }
  }
  return { modules, texts };
}

/** The staging line: `git add -u --` with the touched top folders (the tree was clean before). */
function stagingLine(paths) {
  const tops = new Set(paths.map((p) => (p.split('/').length > 2 ? p.split('/').slice(0, 2).join('/') : p)));
  return `git add -u -- ${[...tops].sort().join(' ')}`;
}

function removeSamples(root, report, { dryRun }) {
  if (!existsSync(abs(root, SAMPLES_FILE)))
    throw new ToolError(EXIT.ENV, `${SAMPLES_FILE} is missing — the tool reads the list of samples from it.`);
  const samples = readJsonAt(root, SAMPLES_FILE);
  report.data.mode = 'remove-samples';
  report.data.dryRun = !!dryRun;
  if (isEmptySamples(samples)) {
    report.say('Nothing to remove: src/config/samples.json lists no sample content (the samples are already gone).');
    report.data.removed = { articles: 0, glossary: 0, sources: 0, learningPaths: 0 };
    report.data.deleted = [];
    report.data.edited = [];
    return;
  }

  // 1. A clean git tree, so one revert undoes the removal.
  const git = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
  if (git.error || git.status !== 0) {
    throw new ToolError(
      EXIT.USAGE,
      'this folder is not a git repository (or git is not installed). The removal deletes hundreds of files; git is what lets you undo it. Set up the safety net first (base/BOOKKEEPING.md).',
    );
  }
  const dirty = git.stdout.split('\n').filter((l) => l.trim());
  if (dirty.length) {
    const msg =
      `your folder has ${plural(dirty.length, 'change')} that git has not saved yet (e.g. ${dirty
        .slice(0, 3)
        .map((l) => l.slice(3))
        .join(', ')}). ` +
      'Save them first with a commit, so the removal stands alone and one `git revert` can undo it.';
    if (!dryRun) throw new ToolError(EXIT.USAGE, msg);
    report.warn(msg);
  }

  // 2. Pre-checks: the i18n gate is green, samples.json matches the files, nothing refers to a sample.
  const gate = join(root, 'scripts', 'check-i18n-keys.mjs');
  if (!existsSync(gate))
    throw new ToolError(EXIT.ENV, 'scripts/check-i18n-keys.mjs is missing — the removal needs the i18n gate.');
  /** Runs the real i18n gate on the tree as it is on disk: null when green, else its last lines. */
  const i18nGateRed = () => {
    const res = spawnSync(process.execPath, [gate], { cwd: root, encoding: 'utf8', timeout: 180_000 });
    if (res.status === 0) return null;
    return `${res.stdout ?? ''}${res.stderr ?? ''}${res.error ? res.error.message : ''}`
      .trim()
      .split(/\r?\n/)
      .slice(-6)
      .join('\n    ');
  };
  const redBefore = i18nGateRed();
  if (redBefore !== null) {
    throw new ToolError(
      EXIT.ENV,
      `the i18n check is red before the removal, so the tool cannot tell which texts only the samples use. Fix it first (node scripts/check-i18n-keys.mjs):\n    ${redBefore}`,
    );
  }
  const io = diskIo(root);
  const routesSource = io.read(ROUTES_FILE);
  const pre = [...consistencyProblems(samples, io, routesSource), ...referenceProblems(samples, io, routesSource)];
  // The start page may be a sample article while the samples are here; after the removal
  // the site root would lead nowhere.
  const startPage = existsSync(abs(root, SITE_FILE)) ? readJsonAt(root, SITE_FILE).startPage : undefined;
  const startSample = (Array.isArray(samples.articles) ? samples.articles : []).find(
    (a) => startPage === `articles/${a?.id}` || startPage === `article/${a?.pageId}`,
  );
  if (startSample)
    pre.push(
      `${SITE_FILE}: the start page "${startPage}" is the sample article ${startSample.id} — choose another start page first (--site with "startPage")`,
    );
  if (pre.length) {
    throw new ToolError(
      EXIT.ENV,
      `the samples cannot be removed safely yet — nothing was changed:\n    ${pre.join('\n    ')}\n  Fix these first; node scripts/check-site-config.mjs shows the same list.`,
    );
  }

  // 3. The plan, in memory.
  const overlay = new Map(); // path -> new text, or null for a delete
  const del = (p) => {
    if (existsSync(abs(root, p))) overlay.set(p, null);
  };
  const folders = localeFolders(root);
  const { locales } = configuredLocales(root);
  const sampleFolders = [];
  for (const a of samples.articles) {
    for (const f of filesBelow(root, a.folder)) del(f);
    sampleFolders.push(a.folder);
    del(`${CORE}/articles/${a.id}.json`);
    for (const l of folders) del(`${MODULES}/${l}/${a.namespace}.json`);
    for (const l of existsSync(abs(root, `${TRANSLATIONS}/articles`))
      ? readdirSync(abs(root, `${TRANSLATIONS}/articles`))
      : [])
      del(`${TRANSLATIONS}/articles/${l}/${a.id}.json`);
  }
  for (const [collection, list] of [
    ['glossary', samples.glossary],
    ['sources', samples.sources],
  ]) {
    const trDir = abs(root, `${TRANSLATIONS}/${collection}`);
    const trLocales = existsSync(trDir) ? readdirSync(trDir).sort() : [];
    for (const id of list) {
      del(`${CORE}/${collection}/${id}.json`);
      for (const l of trLocales) del(`${TRANSLATIONS}/${collection}/${l}/${id}.json`);
    }
  }

  const edit = (p, before, after) => {
    if (before !== after) overlay.set(p, after);
  };
  const editJson = (p, fn) => {
    if (!existsSync(abs(root, p))) return;
    const text = readText(abs(root, p));
    edit(p, text, json(fn(JSON.parse(text))));
  };
  const artIds = new Set(samples.articles.map((a) => a.id));
  const drop = (set) => (list) => list.filter((e) => !set.has(typeof e === 'string' ? e : e?.id));
  editJson(`${CORE}/articles/index.json`, drop(artIds));
  editJson(`${CORE}/glossary/index.json`, drop(new Set(samples.glossary)));
  editJson(`${CORE}/sources/index.json`, drop(new Set(samples.sources)));
  editJson(`${CORE}/sources/references.json`, (refs) =>
    Object.fromEntries(Object.entries(refs).filter(([k]) => !samples.sources.includes(k))),
  );
  editJson(`${CORE}/learning-paths.json`, drop(new Set(samples.learningPaths)));
  const routesAfter = cutMarkerBlocks(routesSource, [...artIds]);
  edit(ROUTES_FILE, routesSource, routesAfter);

  // angular.json: specs of deleted folders leave the test allowlist.
  if (existsSync(abs(root, 'angular.json'))) {
    const text = readText(abs(root, 'angular.json'));
    const gone = sampleFolders.map((f) => `${f}/`);
    const lines = text.split('\n');
    const kept = lines.filter((l) => {
      const m = /^\s*"([^"]+\.spec\.ts)",?\s*$/.exec(l);
      return !(m && gone.some((g) => m[1].startsWith(g)));
    });
    if (kept.length !== lines.length) {
      // A removed last entry leaves a comma before "]": take it off.
      const fixed = kept.join('\n').replace(/,(\s*\n\s*\])/g, '$1');
      try {
        JSON.parse(fixed);
      } catch {
        throw new ToolError(
          EXIT.ENV,
          'angular.json: could not take the sample specs out of test → include. Remove them by hand.',
        );
      }
      edit('angular.json', text, fixed);
    }
  }

  // i18n: sample namespaces go with their files; listed key paths; then orphans.
  const deletedNamespaces = new Set(samples.articles.map((a) => a.namespace));
  const { modules, texts } = loadModules(root, folders);
  const { keySource } = configuredLocales(root);
  const keyCount = { namespaces: 0, listed: 0, orphans: 0 };
  for (const ns of deletedNamespaces) keyCount.namespaces += leafKeys({ [ns]: modules[keySource]?.[ns] ?? {} }).size;
  for (const l of folders) for (const ns of deletedNamespaces) delete modules[l][ns];
  for (const key of samples.i18nKeys) {
    for (const l of folders) {
      const n = deleteKeyPath(modules[l], key);
      if (l === keySource) keyCount.listed += n;
    }
  }
  // Orphans, by the gate's rule, on the planned sources (deleted files gone, the routes cut).
  // The planned data files count with their new text: a removed learning path takes its keys with it.
  const sources = [];
  for (const f of filesBelow(root, 'src')) {
    if (!isOrphanSource(f) || overlay.get(f) === null) continue;
    const text = overlay.has(f) ? overlay.get(f) : readText(abs(root, f));
    sources.push({ path: f, text: stripCodeSamples(f, text) });
  }
  const configured = locales.filter((l) => modules[l]);
  const allKeys = new Set();
  for (const l of configured) leafKeys(modules[l], allKeys);
  const { orphans } = findOrphans([...allKeys], sources);
  keyCount.orphans = orphans.length;
  for (const key of orphans) for (const l of folders) deleteKeyPath(modules[l], key);
  const after = new Set();
  for (const l of configured) leafKeys(modules[l], after);
  const { orphans: still, stale } = findOrphans([...after], sources);
  if (still.length || stale.length) {
    throw new ToolError(
      EXIT.ENV,
      `after the removal the i18n check would still fail (${still.length} unreferenced keys, stale prefixes: ${stale.join(', ') || 'none'}) — nothing was changed. Please report this; the sample list needs a fix.`,
    );
  }
  for (const l of folders) {
    for (const [ns, obj] of Object.entries(modules[l])) {
      const path = `${MODULES}/${l}/${ns}.json`;
      if (Object.keys(obj).length === 0) overlay.set(path, null);
      // Only a module that lost keys is written: an untouched one keeps its bytes.
      else if (JSON.stringify(JSON.parse(texts[path])) !== JSON.stringify(obj)) edit(path, texts[path], json(obj));
    }
    for (const ns of deletedNamespaces) del(`${MODULES}/${l}/${ns}.json`);
  }
  // The Easy-Language availability index, as scripts/build-i18n-bundles.ts writes it.
  if (existsSync(abs(root, AVAILABILITY_FILE))) {
    const byLocale = new Map(configured.map((l) => [l, modules[l]]));
    edit(AVAILABILITY_FILE, readText(abs(root, AVAILABILITY_FILE)), json(easyAvailabilityFromModules(byLocale)));
  }
  const emptied = emptiedSamples(samples);
  edit(SAMPLES_FILE, readText(abs(root, SAMPLES_FILE)), formatConfigJson(emptied));

  // 4. The planned state must pass the same checks the gate runs.
  const planned = overlayIo(root, overlay);
  const post = [
    ...consistencyProblems(emptied, planned, routesAfter),
    ...referenceProblems(emptied, planned, routesAfter),
  ];
  if (post.length) {
    throw new ToolError(
      EXIT.ENV,
      `the planned result would not pass check-site-config — nothing was changed:\n    ${post.join('\n    ')}`,
    );
  }

  const deleted = [...overlay]
    .filter(([, v]) => v === null)
    .map(([p]) => p)
    .sort();
  const edited = [...overlay]
    .filter(([, v]) => v !== null)
    .map(([p]) => p)
    .sort();
  const removed = {
    articles: samples.articles.length,
    glossary: samples.glossary.length,
    sources: samples.sources.length,
    learningPaths: samples.learningPaths.length,
  };
  report.say(
    `${dryRun ? 'Plan (dry run, nothing written)' : 'Removed'}: ${plural(removed.articles, 'sample article')}, ${plural(removed.glossary, 'glossary term')}, ${plural(removed.sources, 'source')}, ${plural(removed.learningPaths, 'learning path')}.`,
  );
  const verb = dryRun ? 'would be ' : '';
  report.say(`  files: ${deleted.length} ${verb}deleted, ${edited.length} ${verb}edited`);
  report.say(
    `  interface texts: ${keyCount.namespaces} in the sample articles' modules, ${keyCount.listed} listed in samples.json, ${keyCount.orphans} that only the samples used (counted in ${keySource}; taken out of every locale folder: ${folders.join(', ')})`,
  );
  report.say(`  sample folders: ${sampleFolders.join(', ')}`);
  report.say(
    `  The blueprints stay: seed-article-1, example-demo, seed-term-*, seed-event-*, seed-path-*, seed-source-1, the seed tool and resource.`,
  );

  const touched = [...deleted, ...edited];
  const staging = stagingLine(touched);
  const undo = 'git revert HEAD';
  if (dryRun) {
    for (const p of edited) report.say(`  would edit   ${p}`);
    report.say(`  (every deleted file is listed under "deleted" with --json)`);
  } else {
    const ops = [
      ...deleted.map((path) => ({ path, content: null })),
      ...edited.map((path) => ({ path, content: overlay.get(path) })),
    ];
    const undoAll = applyWithUndo(root, report, ops);
    removeEmptyFolders(root, sampleFolders);
    // 5. The real i18n gate on the written tree. The plan was checked for orphans and stale
    // prefixes; only the gate sees a key that code which stays still reads, and locale parity.
    const redAfter = i18nGateRed();
    if (redAfter !== null) {
      undoAll();
      throw new ToolError(
        EXIT.ENV,
        `after the removal the i18n check was red, so every deleted and written file was put back; nothing changed. Most likely code that stays still reads a text the removal takes out, and src/config/samples.json needs a fix. The check said:\n    ${redAfter}`,
      );
    }
    for (const p of edited) report.say(`  wrote ${abs(root, p)}`);
    report.say('');
    report.say('Nothing is committed. Look at the site (npm start), then save the removal as one commit:');
    report.say(`  ${staging}`);
    report.say('  git diff --cached --name-only');
    report.say('  git commit -m "chore(content): remove the kit\'s sample content"');
    report.say(
      `Undo after the commit: ${undo}   (before it: git restore --staged --worktree -- ${[...new Set(touched.map((p) => p.split('/').slice(0, 2).join('/')))].sort().join(' ')})`,
    );
    report.say('Then run: node scripts/check-i18n-keys.mjs, node scripts/check-site-config.mjs, npm run build:prod');
  }
  report.data.removed = removed;
  report.data.keys = keyCount;
  report.data.deleted = deleted;
  report.data.edited = edited;
  report.data.staging = staging;
  report.data.undo = undo;
  report.notChecked.push(
    'whether the build still renders every page: npm run build:prod',
    'shared components only the samples used stay in src/app/components (unused, not in the bundle)',
  );
}

await runTool({
  id: 'make-it-yours',
  summary: 'make the kit your own portal: status, name and description, sample content out',
  usage: 'node tools/make-it-yours.mjs [--site <answers.json> | --remove-samples] [--dry-run] [--json]',
  description: [
    'Without a mode: where your site stands (name, start page, features, samples left, imprint',
    'placeholders, what a new language would need) and the next step. --site writes the name,',
    'start page, feature switches, operator and description; --remove-samples deletes the kit’s',
    'sample content and keeps the blueprints. Nothing is committed; every change can be undone.',
  ],
  options: {
    site: {
      type: 'string',
      arg: '<answers.json>',
      help: 'your answers: { name, shortName?, logoIcon?, startPage?, features?, operator?, description: { <locale>: … } }',
    },
    'remove-samples': {
      type: 'boolean',
      help: 'delete the sample content listed in src/config/samples.json (needs a clean git tree)',
    },
    'dry-run': { type: 'boolean', help: 'show the plan, write nothing' },
  },
  examples: [
    'node tools/make-it-yours.mjs',
    'node tools/make-it-yours.mjs --site tmp/answers.json --dry-run',
    'node tools/make-it-yours.mjs --remove-samples --dry-run',
  ],
  async run({ values, positionals, report, root }) {
    if (positionals.length) throw new ToolError(EXIT.USAGE, `unexpected argument "${positionals[0]}" — see --help.`);
    if (values.site !== undefined && values['remove-samples'])
      throw new ToolError(EXIT.USAGE, 'choose one: --site or --remove-samples, not both in one run.');
    if (values.site !== undefined) siteMode(root, report, { file: values.site, dryRun: values['dry-run'] });
    else if (values['remove-samples']) removeSamples(root, report, { dryRun: values['dry-run'] });
    else {
      if (values['dry-run'])
        throw new ToolError(EXIT.USAGE, '--dry-run goes with --site or --remove-samples; the status never writes.');
      status(root, report);
    }
  },
});
