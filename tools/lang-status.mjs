#!/usr/bin/env node
/**
 * lang-status.mjs — how far is one language of the portal? (kit tool `lang-status`,
 * capability `check:lang-coverage`).
 *
 * WHAT: for a language code and its Easy variant (`it` and `it-easy`), counts instead of
 * guessing: the UI keys of the key-source language (`keySourceLanguage` in
 * `src/config/languages.json`) that are present and non-empty per module in
 * `src/assets/i18n/modules/<locale>/`; keys whose text equals the source (probably not
 * translated yet); the words of the source text still to translate; content entries per
 * collection (`src/assets/data/core/<collection>/`) that have a translation file in
 * `src/assets/data/translations/<collection>/<locale>/`, with the words of the reference
 * language (`contentReferenceLanguage`) still to translate; and whether the code is set up
 * (an entry in languages.json, the redirect list in src/index.html). Works for a code that
 * is not configured yet: then everything is missing, and it says so.
 *
 * FEATURES: only what the site uses counts. Keys and content collections of features that
 * `src/config/site.json` switches off (ownership in `src/config/features.json`) are left out
 * and the output names those features; so are the dev workshop's strings (`devOnly`) for a
 * locale that has none of them, because the workshop runs only in development and falls back
 * to the key-source language. The rule is scripts/lib/feature-scope.mjs, the same one
 * check-i18n-keys.mjs applies. Without site.json or features.json every feature is on.
 *
 * HOW: the Easy variant is compared with the source language's Easy modules
 * (`en-easy`), falling back to the source language where none exists. A collection without
 * any `*-easy` folder has no Easy files by design (sources: a title names the work exactly)
 * and is reported as such, not as missing. Counts only: exit 0; no time estimate, because
 * that depends on who translates. Steps to add a language: docs/how-to/add-a-language.md.
 *
 * WHAT IT CANNOT SEE: whether a translation is good, whether an Easy text follows the
 * language's Easy-Language rules, and texts outside the UI modules and content collections
 * (the example articles' components, images with text in them).
 *
 * Run:  node tools/lang-status.mjs it      node tools/lang-status.mjs it --json
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { entryIdsOf } from '../scripts/lib/content-entries.mjs';
import { createFeatureScope } from '../scripts/lib/feature-scope.mjs';
import { EXIT, ToolError, readText, runTool } from './lib/cli.mjs';

const readJson = (file) => JSON.parse(readText(file));
const dirs = (p) =>
  existsSync(p)
    ? readdirSync(p, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort()
    : [];
const jsonFiles = (p) =>
  existsSync(p)
    ? readdirSync(p)
        .filter((f) => f.endsWith('.json'))
        .sort()
    : [];

/** { 'a.b.c': 'text' } for every string leaf (array items by index). */
function flatten(v, prefix = '', out = {}) {
  if (typeof v === 'string') out[prefix] = v;
  else if (Array.isArray(v)) v.forEach((x, i) => flatten(x, `${prefix}[${i}]`, out));
  else if (v && typeof v === 'object') {
    for (const [k, x] of Object.entries(v)) flatten(x, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

/** Words a translator reads: tags and {placeholders} removed, tokens with a letter. */
const words = (s) =>
  s
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .split(/\s+/)
    .filter((t) => /\p{L}/u.test(t)).length;

/** Every string leaf of a locale's modules as `{ '<module>.<key>': text }`. */
function localeTexts(modulesDir, locale) {
  const out = {};
  for (const file of jsonFiles(join(modulesDir, locale)))
    flatten(readJson(join(modulesDir, locale, file)), file.slice(0, -5), out);
  return out;
}

function uiStatus(root, locale, sourceLocale, scope) {
  const modulesDir = join(root, 'src', 'assets', 'i18n', 'modules');
  const sourceTexts = localeTexts(modulesDir, sourceLocale);
  const targetTexts = localeTexts(modulesDir, locale);
  // Only what the site uses: no keys of switched-off features, no dev workshop the locale lacks.
  const split = scope.splitKeys(Object.keys(sourceTexts), new Set(Object.keys(targetTexts)), {
    isKeySource: locale === sourceLocale,
  });
  const required = new Set(split.required);
  const modules = [];
  for (const file of jsonFiles(join(modulesDir, sourceLocale))) {
    const name = file.slice(0, -5);
    const m = { module: name, keys: 0, translated: 0, same: 0, missing: 0, missingWords: 0 };
    for (const [full, text] of Object.entries(sourceTexts)) {
      if (!full.startsWith(`${name}.`) || !required.has(full)) continue;
      const t = targetTexts[full];
      m.keys++;
      // The key-source language (and its Easy variant) is the reference itself: nothing to translate.
      if (locale === sourceLocale) m.translated++;
      else if (typeof t !== 'string' || !t.trim()) {
        m.missing++;
        m.missingWords += words(text);
      } else if (t === text && /\p{L}/u.test(text)) {
        m.same++;
        m.missingWords += words(text);
      } else m.translated++;
    }
    if (m.keys) modules.push(m);
  }
  const sum = (k) => modules.reduce((a, m) => a + m[k], 0);
  return {
    locale,
    source: sourceLocale,
    reference: locale === sourceLocale,
    skipped: { offFeatures: split.off.length, devOnly: split.devOnly.length },
    modules,
    totals: {
      modules: modules.length,
      keys: sum('keys'),
      translated: sum('translated'),
      same: sum('same'),
      missing: sum('missing'),
      missingWords: sum('missingWords'),
    },
  };
}

function contentStatus(root, locale, easy, reference, scope) {
  const core = join(root, 'src', 'assets', 'data', 'core');
  const translations = join(root, 'src', 'assets', 'data', 'translations');
  const collections = [];
  const skipped = [];
  for (const collection of dirs(translations)) {
    if (scope.isCollectionOff(collection)) {
      skipped.push(collection);
      continue;
    }
    const ids = entryIdsOf(join(core, collection));
    const localeDirs = dirs(join(translations, collection));
    if (easy && !localeDirs.some((d) => d.endsWith('-easy'))) {
      collections.push({ collection, entries: ids.length, byDesign: 'no Easy files in this collection' });
      continue;
    }
    // The text to translate from, not the build's fallback chain (scripts/lib/locale-fallback.mjs):
    // that chain says what a reader sees when a file is missing; here we count what is left to write.
    const refLocale = easy && localeDirs.includes(`${reference}-easy`) ? `${reference}-easy` : reference;
    const c = { collection, entries: ids.length, present: 0, missing: 0, missingWords: 0 };
    for (const id of ids) {
      if (existsSync(join(translations, collection, locale, `${id}.json`))) c.present++;
      else {
        c.missing++;
        const refFile = join(translations, collection, refLocale, `${id}.json`);
        if (existsSync(refFile))
          c.missingWords += Object.values(flatten(readJson(refFile))).reduce((a, s) => a + words(s), 0);
      }
    }
    collections.push(c);
  }
  return { locale, reference, collections, skipped };
}

await runTool({
  id: 'lang-status',
  summary: 'how far one language of the portal is: keys, content entries and words still to translate',
  usage: 'node tools/lang-status.mjs <code> [--json]',
  description: [
    'Counts, for a language and its Easy variant, the interface texts and content entries that',
    'exist, those still in the source language, and the words left to translate.',
  ],
  options: {},
  examples: ['node tools/lang-status.mjs it', 'node tools/lang-status.mjs de --json'],
  async run({ positionals, report, root }) {
    if (positionals.length !== 1) throw new ToolError(EXIT.USAGE, 'give one language code, e.g. it.');
    const code = positionals[0];
    if (!/^[a-z]{2,3}$/.test(code)) {
      throw new ToolError(
        EXIT.USAGE,
        `"${code}" is not a base language code — give two or three small letters (it, fr, lld); the Easy variant is counted with it.`,
      );
    }
    const config = readJson(join(root, 'src', 'config', 'languages.json'));
    const keySource = config.keySourceLanguage;
    const reference = config.contentReferenceLanguage;
    const configured = (config.languages || []).some((l) => l.code === code);
    const indexHtml = join(root, 'src', 'index.html');
    const codesMatch = existsSync(indexHtml) && /var codes = \[([^\]]*)\];/.exec(readFileSync(indexHtml, 'utf8'));
    const redirect = codesMatch ? [...codesMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]).includes(code) : false;

    // The site's feature switches; a missing site.json or features.json means every feature on.
    const optionalJson = (file) => (existsSync(file) ? readJson(file) : undefined);
    const catalog = optionalJson(join(root, 'src', 'config', 'features.json'));
    const site = optionalJson(join(root, 'src', 'config', 'site.json'));
    const scope = createFeatureScope(catalog, site?.features);

    const modulesDir = join(root, 'src', 'assets', 'i18n', 'modules');
    const easySource = existsSync(join(modulesDir, `${keySource}-easy`)) ? `${keySource}-easy` : keySource;
    const ui = [uiStatus(root, code, keySource, scope), uiStatus(root, `${code}-easy`, easySource, scope)];
    const content = [
      contentStatus(root, code, false, reference, scope),
      contentStatus(root, `${code}-easy`, true, reference, scope),
    ];

    report.say(`Language ${code} (and ${code}-easy)`);
    report.say(`  set up in src/config/languages.json: ${configured ? 'yes' : 'NO — not configured'}`);
    report.say(`  in the redirect list of src/index.html: ${redirect ? 'yes' : 'no'}`);
    if (code === keySource) report.say(`  (${code} is the key-source language: its UI texts are the reference)`);
    report.say(
      scope.offFeatures.length
        ? `  features switched off in src/config/site.json: ${scope.offFeatures.join(', ')} — their texts and content are not counted`
        : '  features switched off in src/config/site.json: none — every feature is counted',
    );
    for (const u of ui) {
      const t = u.totals;
      report.say('');
      if (u.reference) {
        report.say(
          `UI texts ${u.locale}: the reference the other languages are compared with (${t.modules} modules, ${t.keys} keys), nothing to translate.`,
        );
        continue;
      }
      report.say(`UI texts ${u.locale} (compared with ${u.source}, ${t.modules} modules, ${t.keys} keys):`);
      report.say(
        `  translated ${t.translated} · same as ${u.source} ${t.same} · missing ${t.missing} · words to translate ${t.missingWords}`,
      );
      if (u.skipped.offFeatures || u.skipped.devOnly) {
        report.say(
          `  not counted: ${u.skipped.offFeatures} keys of switched-off features, ${u.skipped.devOnly} keys of the dev workshop (development only, shown in ${keySource})`,
        );
      }
      const gaps = u.modules.filter((m) => m.missing || m.same);
      if (gaps.length && (t.translated || t.same)) {
        for (const m of gaps)
          report.say(`  - ${m.module}: missing ${m.missing}, same ${m.same} (${m.missingWords} words)`);
      } else if (gaps.length) {
        report.say(`  no texts for ${u.locale} yet`);
      }
    }
    for (const c of content) {
      report.say('');
      const counted = c.locale.endsWith('-easy')
        ? `${c.reference}-easy where it exists, else ${c.reference}`
        : c.reference;
      report.say(`Content ${c.locale} (entries with a translation file; words counted in ${counted}):`);
      for (const k of c.collections) {
        if (k.byDesign) report.say(`  - ${k.collection}: ${k.entries} entries, ${k.byDesign}`);
        else
          report.say(
            `  - ${k.collection}: ${k.present} of ${k.entries} present, ${k.missing} missing (${k.missingWords} words)`,
          );
      }
      if (c.skipped.length) report.say(`  not counted (feature switched off): ${c.skipped.join(', ')}`);
    }
    if (!configured) {
      report.say('');
      report.say(`${code} is not configured. Steps: docs/how-to/add-a-language.md`);
    }
    report.data.code = code;
    report.data.configured = configured;
    report.data.redirect = redirect;
    report.data.features = { off: scope.offFeatures };
    report.data.ui = ui;
    report.data.content = content;
    report.notChecked.push(
      'whether a translation is good, and whether an Easy text follows that language’s Easy-Language rules',
      'texts outside the UI modules and content collections (article components, text inside images)',
    );
  },
});
