/**
 * samples.mjs — the kit's sample content: what `src/config/samples.json` lists, whether
 * that list still matches the files, and whether anything that stays refers to a sample.
 *
 * Two callers need the same answers: `scripts/check-site-config.mjs` (the gate, so the
 * manifest cannot drift as samples are added) and `tools/make-it-yours.mjs` (the removal,
 * which must not start when a removal would break the site). Nothing here writes; the
 * reading goes through an `io` object (`diskIo(root)` for a folder on disk), so the gate's
 * selftest runs every rule on files held in memory and the tool can check its plan before
 * the first write.
 *
 * The rules:
 *   * SHAPE — samples.json has the lists `articles` (objects with `id`, `pageId`,
 *     `namespace`, `folder`), `glossary`, `sources`, `learningPaths`, `i18nKeys`,
 *     `notSamples` (strings). A seed (`seed-*`, `example-demo`, page id `sda1`) is never a
 *     sample: the seeds are the blueprints that stay. Ids are plain path segments, an
 *     article's `folder` is exactly `src/app/pages/articles/<id>` and an i18n key is a
 *     path below a namespace, because the removal deletes what these values name.
 *   * FILES — every listed id exists: an article's folder, core file, index entry (same
 *     page id) and i18n module in the key-source language; a glossary term's or source's
 *     core file and index entry; a learning path's entry; every listed i18n key path in
 *     the key-source language. While samples.json lists sample articles, every `art-*`
 *     article on disk is listed (or named in `notSamples`), so a new sample cannot be
 *     forgotten.
 *   * MARKERS — in src/app/app.routes.ts each sample article's routes stand between
 *     `// sample:begin <id>` and `// sample:end <id>`: pairs balanced, not nested, not
 *     repeated, one pair per listed article and none for anything else, and the article's
 *     routes (`articles/<id>`, `article/<pageId>`) only inside its pair.
 *   * REFERENCES — nothing that stays names a sample: in the content under
 *     src/assets/data a `related` list, a `*References` list, `sources`,
 *     `childConcepts`/`parentConcepts`, `prerequisitePathIds`, a typed `{ type, id }`
 *     reference (learning-path steps, references.json, the ontology), a `<type>:<id>`
 *     key, or an `articles/<id>` route; in src/app (specs left out, marker blocks
 *     blanked) and in the i18n strings outside the samples' own an `articles/<id>` route
 *     or an import from a sample's folder.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const SAMPLES_FILE = 'src/config/samples.json';
export const ROUTES_FILE = 'src/app/app.routes.ts';
export const CORE = 'src/assets/data/core';
export const TRANSLATIONS = 'src/assets/data/translations';
export const MODULES = 'src/assets/i18n/modules';
const LISTS = ['glossary', 'sources', 'learningPaths', 'i18nKeys', 'notSamples'];
const MARKER_RE = /^[ \t]*\/\/ sample:(begin|end)(?: (\S+))?[ \t]*$/;
const ARTICLE_PAGES = 'src/app/pages/articles';
const ID_SHAPE = /^[a-z0-9][a-z0-9-]*$/;
const ENTRY_ID_SHAPE = /^[A-Za-z0-9][\w.-]*$/;
const NAMESPACE_SHAPE = /^[A-Za-z][A-Za-z0-9]*$/;
/** At least `ns.key`: a whole namespace goes only with its sample article (`namespace`). */
const KEY_PATH_SHAPE = /^[A-Za-z][\w-]*(\.[\w-]+)+$/;

/** Reads files below `root` by project-relative path (forward slashes). */
export function diskIo(root) {
  const abs = (rel) => join(root, ...rel.split('/'));
  return {
    exists: (rel) => existsSync(abs(rel)),
    isDir: (rel) => existsSync(abs(rel)) && statSync(abs(rel)).isDirectory(),
    read: (rel) => readFileSync(abs(rel), 'utf8').replace(/^\uFEFF/, ''),
    list: (rel) => (existsSync(abs(rel)) && statSync(abs(rel)).isDirectory() ? readdirSync(abs(rel)).sort() : []),
  };
}

const readJson = (io, rel) => JSON.parse(io.read(rel));
const isSeed = (id) => /^seed-/.test(id) || id === 'example-demo' || id === 'sda1';

/** The listed ids per collection, as sets. */
export function sampleIdSets(samples) {
  return {
    articles: new Set((samples.articles ?? []).map((a) => a.id)),
    glossary: new Set(samples.glossary ?? []),
    sources: new Set(samples.sources ?? []),
    learningPaths: new Set(samples.learningPaths ?? []),
  };
}

/** Does samples.json list nothing to remove (the kit after `--remove-samples`)? */
export function isEmptySamples(samples) {
  return ['articles', 'glossary', 'sources', 'learningPaths', 'i18nKeys'].every((k) => !(samples[k] ?? []).length);
}

/** samples.json with every list emptied — the notes and `notSamples` stay. */
export function emptiedSamples(samples) {
  const out = {};
  for (const [k, v] of Object.entries(samples)) {
    out[k] = ['articles', 'glossary', 'sources', 'learningPaths', 'i18nKeys'].includes(k) ? [] : v;
  }
  return out;
}

/** Pure: shape problems of a parsed samples.json, as sentences. */
export function shapeProblems(samples) {
  const problems = [];
  if (!samples || typeof samples !== 'object' || Array.isArray(samples)) return [`${SAMPLES_FILE}: not an object`];
  if (!Array.isArray(samples.articles)) problems.push(`${SAMPLES_FILE}: "articles" must be a list`);
  else {
    samples.articles.forEach((a, i) => {
      for (const f of ['id', 'pageId', 'namespace', 'folder']) {
        if (typeof a?.[f] !== 'string' || !a[f])
          problems.push(`${SAMPLES_FILE}: articles[${i}] needs a non-empty "${f}"`);
      }
    });
  }
  for (const k of LISTS) {
    if (!Array.isArray(samples[k]) || samples[k].some((x) => typeof x !== 'string' || !x))
      problems.push(`${SAMPLES_FILE}: "${k}" must be a list of non-empty strings`);
  }
  if (problems.length) return problems;
  // The removal builds paths from these values and deletes what they name: an id must be
  // one plain path segment, and an article's folder must be its own page folder, so a
  // typo cannot reach a seed, your own pages or anything outside the listed places.
  samples.articles.forEach((a, i) => {
    for (const f of ['id', 'pageId']) {
      if (!ID_SHAPE.test(a[f]))
        problems.push(`${SAMPLES_FILE}: articles[${i}] "${f}" "${a[f]}" is not an id like "art-x"`);
    }
    if (!NAMESPACE_SHAPE.test(a.namespace))
      problems.push(
        `${SAMPLES_FILE}: articles[${i}] "namespace" "${a.namespace}" is not a module name like "articleX"`,
      );
    if (a.folder !== `${ARTICLE_PAGES}/${a.id}`)
      problems.push(
        `${SAMPLES_FILE}: articles[${i}] "folder" is "${a.folder}" — a sample article's folder is its own page folder, ${ARTICLE_PAGES}/${a.id}`,
      );
  });
  for (const k of ['glossary', 'sources', 'learningPaths']) {
    for (const id of samples[k]) {
      if (!ENTRY_ID_SHAPE.test(id) || id.includes('..'))
        problems.push(`${SAMPLES_FILE}: "${id}" under "${k}" is not an entry id (letters, digits, - _ .)`);
    }
  }
  for (const key of samples.i18nKeys) {
    if (!KEY_PATH_SHAPE.test(key))
      problems.push(`${SAMPLES_FILE}: "${key}" under "i18nKeys" is not a key path below a namespace like "ns.key"`);
  }
  if (problems.length) return problems;
  const all = [
    ...samples.articles.flatMap((a) => [a.id, a.pageId]),
    ...samples.glossary,
    ...samples.sources,
    ...samples.learningPaths,
  ];
  for (const id of all.filter(isSeed)) {
    problems.push(`${SAMPLES_FILE}: "${id}" is a seed — seeds are the blueprints that stay, never samples`);
  }
  for (const k of ['glossary', 'sources', 'learningPaths']) {
    const dup = samples[k].filter((x, i) => samples[k].indexOf(x) !== i);
    for (const d of new Set(dup)) problems.push(`${SAMPLES_FILE}: "${d}" is listed twice under "${k}"`);
  }
  return problems;
}

/**
 * Pure: the sample marker pairs of app.routes.ts. Returns `{ blocks: [{ id, begin, end }],
 * problems }` — `begin`/`end` are 0-based line numbers of the two marker lines.
 */
export function parseMarkers(source) {
  const lines = source.split('\n');
  const blocks = [];
  const problems = [];
  let open = null;
  lines.forEach((line, i) => {
    const m = MARKER_RE.exec(line.replace(/\r$/, ''));
    if (!m) {
      if (/^\s*\/\/\s*sample:/.test(line))
        problems.push(
          `${ROUTES_FILE}:${i + 1}: "${line.trim()}" is not a marker — write "// sample:begin <id>" or "// sample:end <id>" on a line of its own`,
        );
      return;
    }
    const [, kind, id] = m;
    if (!id) {
      problems.push(`${ROUTES_FILE}:${i + 1}: a sample:${kind} marker without an id`);
      return;
    }
    if (kind === 'begin') {
      if (open)
        problems.push(
          `${ROUTES_FILE}:${i + 1}: sample:begin ${id} inside the block of ${open.id} (line ${open.begin + 1}) — blocks do not nest`,
        );
      open = { id, begin: i };
    } else if (!open) {
      problems.push(`${ROUTES_FILE}:${i + 1}: sample:end ${id} without a sample:begin before it`);
    } else if (open.id !== id) {
      problems.push(
        `${ROUTES_FILE}:${i + 1}: sample:end ${id} closes the block of ${open.id} (line ${open.begin + 1})`,
      );
      open = null;
    } else {
      blocks.push({ ...open, end: i });
      open = null;
    }
  });
  if (open) problems.push(`${ROUTES_FILE}:${open.begin + 1}: sample:begin ${open.id} is never closed`);
  const seen = new Set();
  for (const b of blocks) {
    if (seen.has(b.id)) problems.push(`${ROUTES_FILE}:${b.begin + 1}: a second marker block for ${b.id}`);
    seen.add(b.id);
  }
  return { blocks, problems };
}

/**
 * Pure: `source` without the marker blocks of `ids` (marker lines included). When the cut
 * leaves two blank lines side by side, one goes, so the file keeps its spacing.
 */
export function cutMarkerBlocks(source, ids) {
  const { blocks } = parseMarkers(source);
  const cut = new Set();
  for (const b of blocks.filter((x) => ids.includes(x.id))) {
    for (let i = b.begin; i <= b.end; i++) cut.add(i);
  }
  const kept = [];
  for (const [i, line] of source.split('\n').entries()) {
    if (cut.has(i)) continue;
    if (line.trim() === '' && kept.length && kept[kept.length - 1].trim() === '' && cut.has(i - 1)) continue;
    kept.push(line);
  }
  return kept.join('\n');
}

/** `source` with the lines of every marker block blanked (line count kept). */
function blankMarkerBlocks(source) {
  const { blocks } = parseMarkers(source);
  const lines = source.split('\n');
  for (const b of blocks) for (let i = b.begin; i <= b.end; i++) lines[i] = '';
  return lines.join('\n');
}

/** Does the key path exist (as a leaf or a subtree) in a module object `{ ns: {...} }`? */
function hasKeyPath(io, locale, keyPath) {
  const [ns, ...rest] = keyPath.split('.');
  const file = `${MODULES}/${locale}/${ns}.json`;
  if (!io.exists(file)) return false;
  let node = readJson(io, file);
  for (const part of rest) {
    if (!node || typeof node !== 'object' || !(part in node)) return false;
    node = node[part];
  }
  return true;
}

/** The key-source language (languages.json `keySourceLanguage`), `en` when unreadable. */
export function keySourceLanguage(io) {
  try {
    return readJson(io, 'src/config/languages.json').keySourceLanguage || 'en';
  } catch {
    return 'en';
  }
}

/** Ids of a collection index (`core/<c>/index.json`): a list of ids or of `{ id }` entries. */
function indexIds(io, collection) {
  const file = `${CORE}/${collection}/index.json`;
  if (!io.exists(file)) return [];
  const idx = readJson(io, file);
  return Array.isArray(idx) ? idx.map((e) => (typeof e === 'string' ? e : e?.id)).filter(Boolean) : [];
}

/** FILES and MARKERS (see the header), as sentences. `routesSource` defaults to the file. */
export function consistencyProblems(samples, io, routesSource = io.read(ROUTES_FILE)) {
  const shape = shapeProblems(samples);
  if (shape.length) return shape;
  const problems = [];
  const keySource = keySourceLanguage(io);
  const notSamples = new Set(samples.notSamples);

  // Articles
  const articleIndex = io.exists(`${CORE}/articles/index.json`) ? readJson(io, `${CORE}/articles/index.json`) : [];
  const byId = new Map((Array.isArray(articleIndex) ? articleIndex : []).map((e) => [e.id, e]));
  for (const a of samples.articles) {
    if (notSamples.has(a.id)) problems.push(`${SAMPLES_FILE}: "${a.id}" is listed as a sample and under notSamples`);
    if (!io.isDir(a.folder)) problems.push(`${SAMPLES_FILE}: sample article "${a.id}" — folder ${a.folder} is missing`);
    if (!io.exists(`${CORE}/articles/${a.id}.json`))
      problems.push(`${SAMPLES_FILE}: sample article "${a.id}" — ${CORE}/articles/${a.id}.json is missing`);
    const entry = byId.get(a.id);
    if (!entry) problems.push(`${SAMPLES_FILE}: sample article "${a.id}" is not in ${CORE}/articles/index.json`);
    else if (entry.pageId !== a.pageId)
      problems.push(
        `${SAMPLES_FILE}: sample article "${a.id}" has page id "${a.pageId}", the index says "${entry.pageId}"`,
      );
    if (!io.exists(`${MODULES}/${keySource}/${a.namespace}.json`))
      problems.push(
        `${SAMPLES_FILE}: sample article "${a.id}" — ${MODULES}/${keySource}/${a.namespace}.json is missing`,
      );
  }
  if (samples.articles.length) {
    const listed = new Set(samples.articles.map((a) => a.id));
    const onDisk = new Set([
      ...io
        .list(`${CORE}/articles`)
        .filter((f) => /^art-.*\.json$/.test(f))
        .map((f) => f.slice(0, -5)),
      ...io.list('src/app/pages/articles').filter((d) => /^art-/.test(d) && io.isDir(`src/app/pages/articles/${d}`)),
    ]);
    for (const id of [...onDisk].sort()) {
      if (!listed.has(id) && !notSamples.has(id)) {
        problems.push(
          `${SAMPLES_FILE}: the article "${id}" is on disk but not listed — a kit sample goes under "articles"; ` +
            `your own article goes under "notSamples" (or give it an id that does not start with art-)`,
        );
      }
    }
  }

  // Glossary, sources, learning paths, i18n keys
  for (const [collection, list] of [
    ['glossary', samples.glossary],
    ['sources', samples.sources],
  ]) {
    const ids = new Set(indexIds(io, collection));
    for (const id of list) {
      if (!io.exists(`${CORE}/${collection}/${id}.json`))
        problems.push(
          `${SAMPLES_FILE}: sample ${collection} entry "${id}" — ${CORE}/${collection}/${id}.json is missing`,
        );
      if (!ids.has(id)) problems.push(`${SAMPLES_FILE}: sample ${collection} entry "${id}" is not in its index.json`);
    }
  }
  const paths = io.exists(`${CORE}/learning-paths.json`) ? readJson(io, `${CORE}/learning-paths.json`) : [];
  const pathIds = new Set((Array.isArray(paths) ? paths : []).map((p) => p.id));
  for (const id of samples.learningPaths) {
    if (!pathIds.has(id))
      problems.push(`${SAMPLES_FILE}: sample learning path "${id}" is not in ${CORE}/learning-paths.json`);
  }
  for (const key of samples.i18nKeys) {
    if (!hasKeyPath(io, keySource, key))
      problems.push(`${SAMPLES_FILE}: the i18n key "${key}" does not exist in ${MODULES}/${keySource}/`);
  }

  // Markers
  const { blocks, problems: markerProblems } = parseMarkers(routesSource);
  problems.push(...markerProblems);
  const listed = new Map(samples.articles.map((a) => [a.id, a]));
  const lines = routesSource.split('\n');
  for (const b of blocks) {
    if (!listed.has(b.id))
      problems.push(
        `${ROUTES_FILE}:${b.begin + 1}: a marker block for "${b.id}", which ${SAMPLES_FILE} does not list as a sample`,
      );
  }
  for (const a of samples.articles) {
    const block = blocks.find((b) => b.id === a.id);
    if (!block) {
      problems.push(
        `${ROUTES_FILE}: no "// sample:begin ${a.id}" … "// sample:end ${a.id}" around the routes of ${a.id}`,
      );
      continue;
    }
    const inside = lines.slice(block.begin, block.end + 1).join('\n');
    const outside = [...lines.slice(0, block.begin), ...lines.slice(block.end + 1)].join('\n');
    if (!inside.includes(`path: 'articles/${a.id}'`))
      problems.push(`${ROUTES_FILE}: the marker block of ${a.id} does not hold its route 'articles/${a.id}'`);
    for (const p of [`articles/${a.id}`, `article/${a.pageId}`]) {
      if (new RegExp(`path:\\s*'${p}'`).test(outside))
        problems.push(`${ROUTES_FILE}: the route '${p}' stands outside the marker block of ${a.id}`);
    }
  }
  return problems;
}

const REF_KEY_RE = /^(related|[A-Za-z]*References|sources|childConcepts|parentConcepts|prerequisitePathIds|detailIds)$/;
const TYPE_TO_SET = {
  article: 'articles',
  articles: 'articles',
  glossary: 'glossary',
  term: 'glossary',
  source: 'sources',
  sources: 'sources',
  path: 'learningPaths',
  learningPath: 'learningPaths',
  'learning-path': 'learningPaths',
};

/** Walk a data file: every string leaf with the keys above it, and every typed `{ type, id }`. */
function scanJson(node, visit, keys = []) {
  if (typeof node === 'string') return visit({ value: node, keys });
  if (Array.isArray(node)) return node.forEach((x) => scanJson(x, visit, keys));
  if (!node || typeof node !== 'object') return undefined;
  if (typeof node.type === 'string' && typeof node.id === 'string') visit({ typed: node, keys });
  for (const [k, v] of Object.entries(node)) {
    visit({ key: k, keys });
    scanJson(v, visit, [...keys, k]);
  }
  return undefined;
}

/** Every `.json` file below `rel` (project-relative), sorted. */
function jsonFilesBelow(io, rel) {
  const out = [];
  for (const name of io.list(rel)) {
    const p = `${rel}/${name}`;
    if (io.isDir(p)) out.push(...jsonFilesBelow(io, p));
    else if (name.endsWith('.json')) out.push(p);
  }
  return out;
}

/** Every file below `rel` whose name matches `re`, sorted. */
function filesBelow(io, rel, re) {
  const out = [];
  for (const name of io.list(rel)) {
    const p = `${rel}/${name}`;
    if (io.isDir(p)) out.push(...filesBelow(io, p, re));
    else if (re.test(name)) out.push(p);
  }
  return out;
}

/** REFERENCES (see the header), as sentences — one per referring place. */
export function referenceProblems(samples, io, routesSource = io.read(ROUTES_FILE)) {
  if (shapeProblems(samples).length) return [];
  const sets = sampleIdSets(samples);
  const any = new Set([...sets.articles, ...sets.glossary, ...sets.sources, ...sets.learningPaths]);
  const artIds = [...sets.articles];
  const routeRe = artIds.length
    ? new RegExp(`articles/(${artIds.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![a-z0-9-])`)
    : null;
  const problems = [];
  const say = (file, what) => problems.push(`${file}: ${what}`);

  // Content under src/assets/data (the samples' own files and entries left out).
  const own = (file) => {
    const hit =
      /^src\/assets\/data\/core\/([^/]+)\/([^/]+)\.json$/.exec(file) ??
      /^src\/assets\/data\/translations\/([^/]+)\/[^/]+\/([^/]+)\.json$/.exec(file);
    return Boolean(hit && sets[hit[1]]?.has(hit[2]));
  };
  const generated = (file) =>
    /^src\/assets\/data\/(content\.[^/]+|core\/glossary\/compiled-glossary\.[^/]+)\.json$/.test(file);
  for (const file of jsonFilesBelow(io, 'src/assets/data')) {
    if (generated(file) || own(file)) continue;
    if (/^src\/assets\/data\/core\/(glossary|sources)\/index\.json$/.test(file)) continue; // the lists themselves
    let data;
    try {
      data = readJson(io, file);
    } catch {
      continue; // an unreadable data file is the content gates' finding, not this one
    }
    if (file === `${CORE}/articles/index.json` && Array.isArray(data))
      data = data.filter((e) => !sets.articles.has(e?.id));
    if (file === `${CORE}/learning-paths.json` && Array.isArray(data))
      data = data.filter((p) => !sets.learningPaths.has(p?.id));
    if (file === `${CORE}/sources/references.json` && data && typeof data === 'object') {
      data = Object.fromEntries(Object.entries(data).filter(([k]) => !sets.sources.has(k)));
    }
    const seen = new Set();
    const report = (what) => {
      if (!seen.has(what)) say(file, what);
      seen.add(what);
    };
    scanJson(data, ({ value, keys, typed, key }) => {
      if (typed) {
        const set = TYPE_TO_SET[typed.type];
        if (set && sets[set].has(typed.id)) report(`refers to the sample ${typed.type} "${typed.id}"`);
        return;
      }
      if (key !== undefined) {
        const m = /^([A-Za-z-]+):(.+)$/.exec(key);
        if (m && TYPE_TO_SET[m[1]] && sets[TYPE_TO_SET[m[1]]].has(m[2]))
          report(`refers to the sample ${m[1]} "${m[2]}"`);
        return;
      }
      if (routeRe && routeRe.test(value)) report(`links the sample article route "${routeRe.exec(value)[0]}"`);
      else if (keys.some((k) => REF_KEY_RE.test(k)) && any.has(value))
        report(`lists the sample "${value}" under "${keys.join('.')}"`);
    });
  }

  // App code and guide docs: a sample route or an import from a sample's folder.
  const folders = (samples.articles ?? []).map((a) => a.folder);
  const folderRe = artIds.length
    ? new RegExp(`pages/articles/(${artIds.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})/`)
    : null;
  for (const file of filesBelow(io, 'src/app', /\.(ts|html|md)$/)) {
    if (/\.spec\.ts$/.test(file) || folders.some((f) => file.startsWith(`${f}/`))) continue;
    const text = file === ROUTES_FILE ? blankMarkerBlocks(routesSource) : io.read(file);
    const hit = (routeRe && routeRe.exec(text)?.[0]) || (folderRe && folderRe.exec(text)?.[0]);
    if (hit) say(file, `refers to the sample "${hit}" outside a sample marker block`);
  }

  // i18n strings outside the samples' own namespaces and keys: a sample route.
  if (routeRe) {
    const namespaces = new Set((samples.articles ?? []).map((a) => `${a.namespace}.json`));
    for (const locale of io.list(MODULES).filter((d) => io.isDir(`${MODULES}/${d}`))) {
      for (const f of io.list(`${MODULES}/${locale}`).filter((x) => x.endsWith('.json') && !namespaces.has(x))) {
        const file = `${MODULES}/${locale}/${f}`;
        let data;
        try {
          data = readJson(io, file);
        } catch {
          continue;
        }
        const ns = f.slice(0, -5);
        scanJson(data, ({ value, keys }) => {
          if (value === undefined) return;
          const path = [ns, ...keys].join('.');
          if (samples.i18nKeys.some((k) => path === k || path.startsWith(`${k}.`))) return;
          if (routeRe.test(value)) say(file, `the string ${path} links the sample route "${routeRe.exec(value)[0]}"`);
        });
      }
    }
  }
  return problems;
}
