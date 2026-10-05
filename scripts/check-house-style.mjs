#!/usr/bin/env node
/**
 * check-house-style — the mechanical half of the German and English house style.
 *
 * The house style was decided row by row on 2026-09-23; the language guides write
 * the rules out
 * (directives/languages/de.md §4, §8f; en.md §5, §9). This gate enforces the part of
 * those rules a machine can decide without false positives, on the shipped strings:
 *
 *   src/assets/i18n/modules/<locale>/*.json            (except searchTerms.json)
 *   src/assets/data/translations/<collection>/<locale>/*.json   (except `sources`)
 *   src/app/dev/articles/<id>/<id>-article.de.component.ts      (German guide twins, ADR-0018)
 *
 * A German guide twin is checked as `de`: its inline template line by line, with
 * markup, {{bindings}}, comments and everything inside <pre>, <code> and <kbd> blanked
 * first (code stays verbatim, never restyled), plus its translatable attribute values
 * (aria-label, title, alt, placeholder, label-like inputs) and the single-quoted prose strings
 * of the class body (the overridden measured-value texts). A finding names file:line.
 *
 * `searchTerms.json` is a keyword list, not prose (it deliberately carries English and
 * misspelled search words), and `sources` holds bibliographic titles, which are quoted
 * verbatim and never restyled.
 *
 * Rules (each finding names its rule id):
 *   de-register      de, de-easy: no Sie-address outside impressum.json. A capitalised
 *                    Sie / Ihnen / Ihr… that follows a word is formal address (the
 *                    pronoun "sie" = they/she is lower-case mid-sentence), and that also
 *                    catches every imperative such as „Wählen Sie“. Sentence-initial
 *                    „Sie“ is tolerated: it may mean "they".
 *   de-guillemets    de, de-easy: no »…« or ›…‹; the kit writes „…“ and ‚…‘.
 *   de-quote-pair    de, de-easy: no „ closed by a straight ", no ‚ closed by a straight ',
 *                    and no English closing mark ”. (The typographic apostrophe ’ is fine.)
 *   de-gender        de, de-easy: generic masculine. No gender star, colon, underscore,
 *                    slash or Binnen-I form, and no pair form („Nutzerinnen und Nutzer“).
 *                    Participle nouns (Lernende) are allowed and not matched.
 *   de-mediopunkt    de: the Mediopunkt is a de-easy device only; standard German
 *                    writes no letter·letter compound, except where a string quotes the
 *                    de-easy spelling as an example (MEDIOPUNKT_ALLOW).
 *   de-easy-hyphen   de-easy: a two-part hyphenated compound of two full words is
 *                    written closed (≤ 10 letters) or with the Mediopunkt (longer:
 *                    Computer·programm). The hyphen stays when a part is an abbreviation
 *                    (≥2 capitals), a single letter or has a digit, in compounds of 3+
 *                    parts, and in the fixed terms listed in EASY_HYPHEN_ALLOW (English
 *                    terms hyphenated in English, names, pronunciation spellings).
 *
 *   The Mediopunkt rule of 2026-09-23 (de.md §8f): the dot marks the joints of LONG
 *   compound NOUNS only. Four rules enforce the mechanical part of it:
 *   de-easy-wordclass  de-easy: no Mediopunkt outside a noun — a compound that starts
 *                    lower-case (verb, adjective, adverb, participle: zusammen·hängen,
 *                    nicht·linear), one whose first part is a particle or prefix
 *                    (PARTICLES: Vor·wissen, Meta·daten), one whose last part is an
 *                    infinitive (VERB_PARTS: Code·schreiben) or an adjective/participle
 *                    (ADJ_PARTS: Regel·basierte).
 *   de-easy-short    de-easy: a Mediopunkt compound of ≤ 10 letters is written closed
 *                    (Werk·zeug → Werkzeug), unless a part is a name or an English word
 *                    listed in FOREIGN_PARTS (Git·befehle, Wetter·app); and a word on the
 *                    STOP_LIST (lexicalised: Schreibtisch, Telefonnummer) is never split,
 *                    also not inside a longer compound.
 *   de-easy-split    de-easy: one compound, one spelling. A closed word that shares a stem
 *                    (the word as is or without a final -en/-es/-er/-e/-n/-s) with a
 *                    Mediopunkt compound elsewhere in de-easy is flagged (Testdatei beside
 *                    Test·dateien, Lernfortschritt beside Lern·fortschritt).
 *   de-easy-deep     de-easy: a long compound is split at every joint the corpus
 *                    already shows. A part of ≥ 11 letters that is itself written with
 *                    the Mediopunkt elsewhere must be split here too
 *                    (Datenschutz·details → Daten·schutz·details); two parts of a 3+-part
 *                    compound that are written closed elsewhere must be joined
 *                    (Alltags·werk·zeuge → Alltags·werkzeuge).
 *   Not checked: a long compound written closed that never appears split (Laufzeitumgebung)
 *   — telling a compound from a derivation (Entwicklung, Verständnis) needs a dictionary,
 *   so that stays with the reader; the base-form length of an inflected word is also only
 *   approximated (see stemsOf).
 *   en-spelling      en, en-easy: no British spelling from the short list in BRITISH.
 *   en-date          en, en-easy: no day-month-year date („15 July 2026“); the kit
 *                    writes „July 15, 2026“.
 *
 * Not checked, on purpose: the serial comma (whether a list has three items is not
 * decidable from the text) and straight quotes in German prose (ASCII quotes are also
 * code, JSON and shell syntax inside the same strings; the guide states the rule).
 *
 * What is ignored inside a string: <code>…</code> and `…` spans, {{placeholders}} and
 * {placeholders}, HTML tags and URLs.
 *
 * ERROR must be fixed and exits non-zero. WARN needs a human look and does not; today
 * the only WARN is a stale allowlist entry (one that no longer suppresses anything).
 * Every exception lives in an allowlist below with its reason — an unexplained
 * exception is a mute button, not a decision.
 *
 * Known blind spot: a sentence-initial „Sie“ is never flagged, because it is far more
 * often „sie“ = she/they (about 280 such sentences on the tree of 2026-09-23). A formal
 * „Sie können …“ at the start of a sentence therefore needs a reader.
 *
 * Dependency-free (Node core only).
 *
 * Usage:  node scripts/check-house-style.mjs              # check the tree
 *         node scripts/check-house-style.mjs --selftest   # prove every rule bites
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES_DIR = path.join(ROOT, 'src', 'assets', 'i18n', 'modules');
const DATA_DIR = path.join(ROOT, 'src', 'assets', 'data', 'translations');
const ARTICLES_DIR = path.join(ROOT, 'src', 'app', 'dev', 'articles');

const LOCALES = ['de', 'de-easy', 'en', 'en-easy'];
const SKIP_MODULES = new Set(['searchTerms.json']);
const SKIP_COLLECTIONS = new Set(['sources']);
/** The legal pages (imprint + privacy notice) may stay formal (decision 2026-09-23). */
const REGISTER_EXEMPT_FILES = new Set(['impressum.json']);

// ---------------------------------------------------------------------------
// Allowlists — each entry is a decision with its reason
// ---------------------------------------------------------------------------

/**
 * de-easy-hyphen: two-part hyphenated compounds of full words that keep the hyphen.
 * Matched case-insensitively against the whole token.
 */
const EASY_HYPHEN_ALLOW = new Map(
  Object.entries({
    // English fixed terms, hyphenated in English too (de.md §8f, rule 6)
    'few-shot': 'English fixed term',
    'one-shot': 'English fixed term',
    'zero-shot': 'English fixed term',
    'fine-tuning': 'English fixed term',
    'self-attention': 'English fixed term',
    'opt-out': 'English fixed term',
    'opt-in': 'English fixed term',
    'no-code': 'English fixed term',
    'low-code': 'English fixed term',
    'open-source': 'English fixed term',
    'real-time': 'English fixed term',
    'end-to-end': 'English fixed term',
    'chain-of-thought': 'English fixed term',
    'human-in-the-loop': 'English fixed term',
    'pull-request': 'English fixed term',
    'auto-play': 'English fixed term (UI label "Auto-Play AN/AUS")',
    'pre-training': 'English fixed term',
    'multi-armed': 'English fixed term (Multi-Armed Bandit)',
    'retrieval-augmented': 'English fixed term (Retrieval-Augmented Generation)',
    // pronunciation spellings: the hyphen marks the syllables of the spoken term
    'ei-ai': 'pronunciation spelling of "AI"',
    'kohd-riwju': 'pronunciation spelling of "Code Review"',
    // code tokens in running text (a shell argument, not a German word)
    'ai-project': 'folder name in the mkdir/cd walkthrough (articleTerminalIntro)',
  }),
);

/**
 * de-easy-hyphen: lower-case first parts that are command or folder names, so the token
 * is a code reference, not a compound (git-Ordner, docs-Ordner).
 */
const EASY_HYPHEN_CODE_PARTS = new Map(
  Object.entries({
    git: 'the git command (git-Ordner, git-Knöpfe)',
    docs: 'the docs/ folder (docs-Ordner)',
  }),
);

/**
 * de-easy-short: parts that keep the Mediopunkt even in a short compound — names and
 * English words, where the closed form hides the joint (Gitbefehle, Wetterapp) and the
 * reader stumbles. Lower-case; matched against each part of the compound.
 * English words that German writes closed (Chatbot, Webseite, Spamfilter) are NOT here.
 */
const FOREIGN_PARTS = new Map(
  Object.entries({
    git: 'name (Git·befehle, Git·artikel)',
    qwen: 'name (Qwen·modelle)',
    turing: 'name (Turing·test)',
    app: 'English word (Wetter·app, Notiz·app, App·daten)',
    cloud: 'English word (Cloud·leser)',
    cookie: 'English word (Cookie·wahl, as Cookie·banner, Cookie·hinweis)',
    dev: 'English word (Dev·modus)',
    enter: 'key name (Enter·taste)',
    tab: 'key or UI name (Tab·taste, Artikel·tab)',
    tabs: 'UI name (Browser·tabs)',
    gates: 'English word (Prüf·gates)',
    home: 'English word (Home·ordner)',
    hubs: 'English word (Modell·hubs)',
    linter: 'English tool name (Linter·fund)',
    live: 'English word (Live·daten)',
    loop: 'English word (Specs·loop)',
    push: 'git command (Push·befehl, Push·schutz)',
    review: 'English word (Code·review, glossary term)',
    reviews: 'English word (Code·reviews)',
    skill: 'the kit term (Skill·text)',
    specs: 'the kit term (Specs·loop)',
    stack: 'English word (Tech·stack)',
    tech: 'English word (Tech·stack)',
    tool: 'English word (Tool·hilfe)',
    unit: 'English word (Unit·tests)',
  }),
);

/**
 * de-easy-short: lexicalised words that stay closed at any length and are never split,
 * also not inside a longer compound. Lower-case stems, matched inside the joined word.
 */
const STOP_LIST = new Map(
  Object.entries({
    // named by the user on 2026-09-23 as wrongly split
    werkzeug: 'lexicalised everyday word',
    startseite: 'lexicalised everyday word',
    wörterbuch: 'lexicalised everyday word',
    wörterbüch: 'lexicalised everyday word (Wörterbücher)',
    webseite: 'lexicalised everyday word',
    schreibtisch: 'lexicalised everyday word (12 letters, stays closed)',
    lehrbuch: 'lexicalised everyday word',
    herzstück: 'lexicalised (meaning not from the parts)',
    augenlicht: 'lexicalised (meaning not from the parts)',
    chatbot: 'English loan, written closed in German',
    hyperparameter: 'prefix word, a fixed technical term',
    metadaten: 'prefix word',
    // long everyday words every reader knows as one word
    telefonnummer: 'everyday word (13 letters, stays closed)',
    telefonbuch: 'everyday word (11 letters, stays closed)',
    kühlschrank: 'everyday word',
    screenreader: 'English loan, written closed in German (Duden)',
    meilenstein: 'lexicalised (meaning not from the parts)',
    mittelpunkt: 'lexicalised',
    schwerpunkt: 'lexicalised (meaning not from the parts)',
    bestandteil: 'lexicalised',
    reihenfolge: 'lexicalised',
    privatsphäre: 'lexicalised',
    leerzeichen: 'everyday word',
    arbeitgeber: 'lexicalised',
    reißverschluss: 'lexicalised (meaning not from the parts)',
    gebrauchtwagen: 'participle + noun, not a noun joint',
    platzhalter: 'lexicalised (stays closed inside Platzhalter·vorlage, Platzhalter·wert)',
    barrierefrei: 'adjective (and Barrierefreiheit)',
  }),
);

/** de-easy-wordclass: first parts that are particles or prefixes, not nouns. */
const PARTICLES = new Set([
  'zusammen',
  'zurück',
  'nicht',
  'meist',
  'mehr',
  'vor',
  'nach',
  'gegen',
  'über',
  'unter',
  'mit',
  'hyper',
  'meta',
  'selbst',
  'wieder',
  'weiter',
]);

/**
 * de-easy-wordclass: last parts that are infinitives — a nominalised verb gets no
 * Mediopunkt (Code·schreiben → „Code schreiben“). Only verbs that are no noun or noun
 * plural: *speichern* (dat. pl. of Speicher), *spielen* and *laden* are left out on
 * purpose, so „Fortschritt·speichern“ needs the reader.
 */
const VERB_PARTS = new Set([
  'lernen',
  'suchen',
  'sammeln',
  'werden',
  'schreiben',
  'hängen',
  'führen',
  'lesen',
  'rechnen',
  'machen',
  'prüfen',
  'testen',
  'finden',
  'bauen',
]);

/** de-easy-wordclass: last parts that make an adjective or participle (Regel·basierte). */
const ADJ_PARTS = /^(?:basiert|getrieben|trainiert|genutzt|frei|linear|dimensional)(?:e|en|er|es|em)?$/u;

/**
 * de-register: strings that contain a capitalised Sie-form after a word and are NOT
 * address — e.g. a quoted title. Keyed by "<repo-relative file>#<key path>", exactly as
 * a finding prints its location. Empty on the tree of 2026-09-23.
 */
const REGISTER_ALLOW = new Map(Object.entries({}));

/**
 * en-spelling: strings that may keep a British form — a proper name, or a known miss
 * waiting for a human. Keyed like REGISTER_ALLOW. An entry that no longer matches
 * anything is reported (WARN) so it gets removed instead of lingering.
 */
const BRITISH_ALLOW = new Map(Object.entries({}));

/**
 * de-mediopunkt: standard-German strings that may show a Mediopunkt because they QUOTE
 * the de-easy spelling as an example, not use it. Keyed like REGISTER_ALLOW (for a
 * guide twin that is "<file>:<line>", as a finding prints it). A stale entry is a WARN.
 */
const MEDIOPUNKT_ALLOW = new Map(
  Object.entries({
    'src/app/dev/articles/i18n-localization/i18n-localization-article.de.component.ts:170':
      'The I18n guide names the three spellings of one compound across the variants; ' +
      '„Code·review“ is the quoted de-easy form, the example the search folding must match.',
  }),
);

// ---------------------------------------------------------------------------
// Rule patterns
// ---------------------------------------------------------------------------

const SIE_FORMS = '(?:Sie|Ihnen|Ihr|Ihre|Ihrem|Ihren|Ihrer|Ihres)';
// A Sie-form that follows a word (letters, digits, closing punctuation other than a
// sentence end) and a single space: never sentence-initial, so never "they".
const SIE_AFTER_WORD = new RegExp(`(?<=[\\p{L}\\p{N},;)\\]“])[ \\u00a0]${SIE_FORMS}(?![\\p{L}])`, 'gu');

const GUILLEMETS = /[»«›‹]/gu;
// A German opening mark closed by an ASCII stand-in, and the English closing mark ”.
// (’ is not flagged: it is also the typographic apostrophe.)
const QUOTE_PAIR = [
  [/„[^“"„]*"/gu, '„ closed by a straight " - close with “'],
  [/‚[^‘'‚]*'(?!\p{L})/gu, "‚ closed by a straight ' - close with ‘"],
  [/”/gu, 'English closing mark ” in German - the kit closes with “'],
];

const GENDER = [
  [/\p{L}[*:_]innen\b/gu, 'gender star/colon/underscore (…*innen, …:innen, …_innen)'],
  [/\p{L}[*:_]in\b(?![-\p{L}])/gu, 'gender star/colon/underscore (…*in, …:in, …_in)'],
  [/\p{Ll}\/-?innen\b/gu, 'slash form (…/innen, …/-innen)'],
  [/\p{Ll}Innen\b/gu, 'Binnen-I (…Innen)'],
  // Pair forms: "Nutzerinnen und Nutzer", "die Nutzerin oder der Nutzer"
  [/\b(\p{Lu}\p{Ll}+?)innen (?:und|oder|bzw\.) (?:die |den |der )?\1(?:n|en)?\b/gu, 'pair form (…innen und …)'],
  [/\b(\p{Lu}\p{Ll}+?)in (?:und|oder|bzw\.) (?:der |den |dem |die )?\1\b/gu, 'pair form (…in oder …)'],
  [/\b(\p{Lu}\p{Ll}+?)(?:n|en)? (?:und|oder) (?:die |den |der )?\1innen\b/gu, 'pair form (… und …innen)'],
];

const MEDIOPUNKT = /\p{L}·\p{L}/gu;
// A whole Mediopunkt compound. One glued to a hyphen part (KI-Werk·zeug) is not matched;
// the tree of 2026-09-23 has none.
const MEDIOPUNKT_COMPOUND = /(?<![\p{L}\p{N}·-])\p{L}+(?:·\p{L}+)+(?![\p{L}\p{N}·-])/gu;

// A hyphenated token: letter runs joined by hyphens, bounded by non-letters/non-hyphens.
const HYPHEN_TOKEN = /(?<![\p{L}\p{N}-])[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+(?![\p{L}\p{N}-])/gu;

const BRITISH = [
  /\bcolour(?:s|ed|ing|ful|less)?\b/giu,
  /\bbehaviour(?:s|al)?\b/giu,
  /\bfavour(?:s|ed|ing|ite|ites|able)?\b/giu,
  /\bhonour(?:s|ed|ing|able)?\b/giu,
  /\blabour(?:s|ed|ing)?\b/giu,
  /\bneighbour(?:s|hood|hoods|ing)?\b/giu,
  /\bcentre(?:s|d)?\b/giu,
  /\b(?:kilo|centi|milli)?metres?\b/giu,
  /\blicence(?:s)?\b/giu,
  /\bcatalogue(?:s|d)?\b/giu,
  /\bprogrammes?\b/giu,
  /\borganis(?:e|es|ed|ing|ation|ations|ational|er|ers)\b/giu,
  /\brecognis(?:e|es|ed|ing|able)\b/giu,
  // not "analyses": that is also the American plural of "analysis"
  /\banalys(?:e|ed|ing)\b/giu,
  /\boptimis(?:e|es|ed|ing|ation|ations|er|ers)\b/giu,
  /\bsummaris(?:e|es|ed|ing|ation)\b/giu,
  /\bvisualis(?:e|es|ed|ing|ation|ations|er)\b/giu,
  /\bprioritis(?:e|es|ed|ing|ation)\b/giu,
  /\bcustomis(?:e|es|ed|ing|ation|able)\b/giu,
  /\bmodelling\b/giu,
  /\blabelled\b/giu,
  /\btravelled\b/giu,
  /\bcancelled\b/giu,
  /\bjudgements?\b/giu,
  /\bwhilst\b/giu,
  /\bamongst\b/giu,
  /\bper cent\b/giu,
  /\bgrey(?:s|ed|ish|scale)?\b/giu,
];

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const DMY_DATE = new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)? (?:${MONTHS}),? \\d{4}\\b`, 'gu');

// ---------------------------------------------------------------------------
// String extraction
// ---------------------------------------------------------------------------

/** Blank what is not prose: code, placeholders, markup, URLs. */
function prose(text) {
  return text
    .replace(/<code\b[^>]*>[\s\S]*?<\/code>/giu, ' ')
    .replace(/`[^`]*`/gu, ' ')
    .replace(/\{\{[^}]*\}\}/gu, ' ')
    .replace(/\{[A-Za-z_][\w.]*\}/gu, ' ')
    .replace(/<\/?[a-zA-Z][^>]*>/gu, ' ')
    .replace(/\b(?:https?:\/\/|www\.)[^\s"'<>)]+/giu, ' ');
}

function* walk(value, keyPath = '') {
  if (typeof value === 'string') yield { keyPath, text: value };
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* walk(value[i], `${keyPath}[${i}]`);
  else if (value && typeof value === 'object')
    for (const [k, v] of Object.entries(value)) yield* walk(v, keyPath ? `${keyPath}.${k}` : k);
}

function collectFiles() {
  const files = [];
  for (const locale of LOCALES) {
    const dir = path.join(MODULES_DIR, locale);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith('.json') || SKIP_MODULES.has(f)) continue;
      files.push({ locale, file: path.join(dir, f) });
    }
  }
  if (fs.existsSync(DATA_DIR)) {
    for (const coll of fs.readdirSync(DATA_DIR).sort()) {
      if (SKIP_COLLECTIONS.has(coll)) continue;
      for (const locale of LOCALES) {
        const dir = path.join(DATA_DIR, coll, locale);
        if (!fs.existsSync(dir)) continue;
        for (const f of fs.readdirSync(dir).sort())
          if (f.endsWith('.json')) files.push({ locale, file: path.join(dir, f) });
      }
    }
  }
  return files;
}

/** Every German guide twin on disk (`<id>/<id>-article.de.component.ts`). */
function collectTwins() {
  const out = [];
  if (!fs.existsSync(ARTICLES_DIR)) return out;
  for (const dir of fs
    .readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    if (!dir.isDirectory()) continue;
    const file = path.join(ARTICLES_DIR, dir.name, `${dir.name}-article.de.component.ts`);
    if (fs.existsSync(file)) out.push(file);
  }
  return out;
}

/**
 * The German prose of one guide twin, one string per template line (markup, bindings,
 * comments and the verbatim <pre>/<code>/<kbd> content blanked, line count kept), each
 * translatable attribute value (aria-label, title, alt, placeholder, label-like inputs),
 * and each single-quoted class-body string that holds a space. `rel` names the file.
 */
function twinStrings(src, rel) {
  const strings = [];
  const keepLines = (m) => m.replace(/[^\n]/g, ' ');
  const tm = /template:\s*`([\s\S]*?)`/.exec(src);
  const before = tm ? src.slice(0, tm.index + tm[0].indexOf('`') + 1) : '';
  const firstLine = before.split('\n').length;
  if (tm) {
    const blanked = tm[1]
      .replace(/<!--[\s\S]*?-->/g, keepLines)
      .replace(/<(pre|code|kbd)\b[\s\S]*?<\/\1>/g, keepLines)
      .replace(/\{\{[\s\S]*?\}\}/g, keepLines)
      .replace(/<[^>]*>/g, keepLines);
    blanked.split('\n').forEach((text, i) => {
      if (text.trim())
        strings.push({ locale: 'de', base: path.basename(rel), id: `${rel}:${firstLine + i}`, keyPath: '', text });
    });
    const ATTR =
      /\s(aria-label|title|alt|placeholder|label|header|legend|pTooltip|[a-zA-Z]+(?:Label|Message|Placeholder))="([^"]*)"/g;
    for (const m of tm[1].matchAll(ATTR)) {
      const line = firstLine + tm[1].slice(0, m.index).split('\n').length - 1;
      strings.push({ locale: 'de', base: path.basename(rel), id: `${rel}:${line}`, keyPath: m[1], text: m[2] });
    }
  }
  const rest = tm ? src.slice(tm.index + tm[0].length) : src;
  const restLine = tm ? src.slice(0, tm.index + tm[0].length).split('\n').length : 1;
  rest.split('\n').forEach((line, i) => {
    if (/^\s*import\b/.test(line)) return;
    for (const m of line.matchAll(/'((?:[^'\\]|\\.)*)'/g))
      if (/\s/.test(m[1]))
        strings.push({ locale: 'de', base: path.basename(rel), id: `${rel}:${restLine + i}`, keyPath: '', text: m[1] });
  });
  return strings;
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/**
 * @param {{locale:string, base:string, id:string, keyPath:string, text:string}} s
 * @param {{mediopunktCompounds:Set<string>}} ctx
 * @returns {{level:'ERROR'|'WARN', rule:string, match:string, msg:string}[]}
 */
function checkString(s, ctx) {
  const out = [];
  const t = prose(s.text);
  const hit = (rule, match, msg, level = 'ERROR') => out.push({ level, rule, match, msg });
  const isDe = s.locale === 'de' || s.locale === 'de-easy';
  const isEn = s.locale === 'en' || s.locale === 'en-easy';

  if (isDe) {
    if (!REGISTER_EXEMPT_FILES.has(s.base)) {
      const found = [...t.matchAll(SIE_AFTER_WORD)];
      if (REGISTER_ALLOW.has(s.id)) {
        if (found.length) ctx.usedAllow.add(s.id);
      } else
        for (const m of found)
          hit(
            'de-register',
            m[0].trim(),
            'formal address (Sie-form after a word); the kit says du outside impressum.json',
          );
    }
    for (const m of t.matchAll(GUILLEMETS)) hit('de-guillemets', m[0], 'guillemet in German text; write „…“ / ‚…‘');
    for (const [re, label] of QUOTE_PAIR) for (const m of t.matchAll(re)) hit('de-quote-pair', m[0], label);
    for (const [re, label] of GENDER)
      for (const m of t.matchAll(re)) hit('de-gender', m[0], `${label}; the kit writes the generic masculine`);
  }

  if (s.locale === 'de') {
    const found = [...t.matchAll(MEDIOPUNKT)];
    if (MEDIOPUNKT_ALLOW.has(s.id)) {
      if (found.length) ctx.usedAllow.add(s.id);
    } else
      for (const m of found) hit('de-mediopunkt', m[0], 'Mediopunkt in standard German; it is a de-easy device only');
  }

  if (s.locale === 'de-easy') {
    for (const m of t.matchAll(HYPHEN_TOKEN)) {
      const tok = m[0];
      const parts = tok.split('-');
      if (parts.length !== 2) continue; // 3+ parts keep the hyphen
      if (EASY_HYPHEN_ALLOW.has(tok.toLowerCase())) continue;
      if (EASY_HYPHEN_CODE_PARTS.has(parts[0])) continue;
      // A path, domain, file name or slash command: .git-Ordner, /new-content,
      // scripts/verify-harness.mjs, api.example-weather.com, Chart.js-Helfer.
      const before = t[m.index - 1] ?? '';
      const after = t.slice(m.index + tok.length, m.index + tok.length + 2);
      if (/[./\\@~]/u.test(before) || /^\.\p{L}/u.test(after)) continue;
      const keeps = parts.some(
        (p) => /\p{N}/u.test(p) || [...p].length === 1 || (/^\p{Lu}{2,}\p{Ll}?s?$/u.test(p) && p.length <= 6),
      );
      if (keeps) continue;
      const joined = parts[0] + parts[1].toLowerCase();
      const want =
        letters(joined) <= 10 && !parts.some((p) => FOREIGN_PARTS.has(p.toLowerCase()))
          ? joined
          : `${parts[0]}·${parts[1].toLowerCase()}`;
      hit('de-easy-hyphen', tok, `hyphenated compound of two full words; write ${want}`);
    }
    for (const m of t.matchAll(MEDIOPUNKT_COMPOUND)) for (const f of checkMediopunkt(m[0], ctx)) hit(...f);
    // Whole closed words only: a part of a Mediopunkt or hyphen compound
    // (Extra·werkzeuge, KI-Werkzeug) is not a closed spelling of the compound.
    for (const m of t.matchAll(/[\p{L}·-]+/gu)) {
      if (/[·-]/u.test(m[0])) continue;
      const twin = twinIn(ctx.mediopunktStems, m[0]);
      if (twin)
        hit(
          'de-easy-split',
          m[0],
          `written with the Mediopunkt elsewhere in de-easy (${twin}); one compound, one spelling — ` +
            'base form ≤ 10 letters: closed everywhere, longer: split everywhere',
        );
    }
  }

  if (isEn) {
    const found = BRITISH.flatMap((re) => [...t.matchAll(re)]);
    if (BRITISH_ALLOW.has(s.id)) {
      if (found.length) ctx.usedAllow.add(s.id);
    } else for (const m of found) hit('en-spelling', m[0], 'British spelling; the kit writes American English');
    for (const m of t.matchAll(DMY_DATE)) hit('en-date', m[0], 'day-month-year date; write "July 15, 2026"');
  }
  return out;
}

/** Letters of a word, joiners not counted ("Werk·zeug" -> 8). */
function letters(word) {
  return [...word.replace(/[·-]/gu, '')].length;
}

/**
 * The stems that tie the forms of one compound together: joined, lower-cased, as is and
 * without each possible final inflection ending. Two forms are the same compound when
 * their stem sets meet (Baustein {baustein, baustei} and Bausteine {bausteine,
 * baustein}). An approximation — umlaut plurals (Testfall/Testfälle) are not tied.
 */
function stemsOf(word) {
  const w = word.replace(/·/gu, '').toLowerCase();
  const out = [w];
  for (const end of ['en', 'es', 'er', 'e', 'n', 's'])
    if (w.endsWith(end) && [...w].length - end.length >= 4) out.push(w.slice(0, -end.length));
  return out;
}

/** The first form in `index` that shares a stem with `word`, or undefined. */
function twinIn(index, word) {
  for (const s of stemsOf(word)) if (index.has(s)) return index.get(s);
  return undefined;
}

/**
 * The Mediopunkt findings for one compound (de-easy-wordclass, -short, -deep).
 * @returns {[string, string, string][]} [rule, match, message] triples
 */
function checkMediopunkt(tok, ctx) {
  const out = [];
  const parts = tok.split('·');
  const lower = parts.map((p) => p.toLowerCase());
  const joined = lower.join('');
  const closed = parts[0] + lower.slice(1).join('');
  const last = lower[lower.length - 1];

  if (/^\p{Ll}/u.test(tok))
    out.push(['de-easy-wordclass', tok, `not a noun (verb, adjective, adverb): no Mediopunkt; write ${closed}`]);
  else if (PARTICLES.has(lower[0]))
    out.push(['de-easy-wordclass', tok, `„${parts[0]}“ is a particle or prefix, not a noun joint; write ${closed}`]);
  else if (VERB_PARTS.has(last))
    out.push(['de-easy-wordclass', tok, 'a nominalised verb gets no Mediopunkt; rephrase („Code schreiben“)']);
  else if (ADJ_PARTS.test(last))
    out.push(['de-easy-wordclass', tok, `an adjective or participle gets no Mediopunkt; write ${closed}`]);
  else if (letters(tok) <= 10 && !lower.some((p) => FOREIGN_PARTS.has(p)))
    out.push(['de-easy-short', tok, `short compound (≤ 10 letters); write ${closed}`]);

  if (out.length) return out; // one finding per compound is enough to send the author back
  // Stop-list words, also inside a longer compound: a joint that falls inside the stem.
  const joints = [];
  for (let i = 0, at = 0; i < lower.length - 1; i++) joints.push((at += lower[i].length));
  for (const stem of STOP_LIST.keys()) {
    for (let at = joined.indexOf(stem); at !== -1; at = joined.indexOf(stem, at + 1))
      if (joints.some((j) => j > at && j < at + stem.length))
        out.push(['de-easy-short', tok, `„${stem}“ is on the stop-list (${STOP_LIST.get(stem)}); write it closed`]);
  }

  // de-easy-deep: a long part the corpus splits elsewhere; adjacent parts it writes closed.
  for (const p of parts) {
    const twin = letters(p) >= 11 && twinIn(ctx.mediopunktStems, p);
    if (twin && twin.toLowerCase() !== tok.toLowerCase())
      out.push(['de-easy-deep', tok, `the part „${p}“ is split elsewhere (${twin}); split it here too`]);
  }
  if (parts.length >= 3)
    for (let i = 0; i < parts.length - 1; i++) {
      const pair = lower[i] + lower[i + 1];
      const twin = letters(pair) <= 10 && twinIn(ctx.closedStems, pair);
      if (twin)
        out.push(['de-easy-deep', tok, `„${parts[i]}·${parts[i + 1]}“ is written closed elsewhere (${twin}); join it`]);
    }
  return out;
}

/**
 * The de-easy compound index: every stem of every Mediopunkt compound ("Test·dateien"
 * under "testdateien" and "testdatei") and of every closed word, each with one example.
 */
function compoundIndexOf(strings) {
  const mediopunktStems = new Map();
  const closedStems = new Map();
  const add = (index, word) => {
    for (const s of stemsOf(word)) if (!index.has(s)) index.set(s, word);
  };
  for (const s of strings) {
    if (s.locale !== 'de-easy') continue;
    const t = prose(s.text);
    for (const m of t.matchAll(MEDIOPUNKT_COMPOUND)) add(mediopunktStems, m[0]);
    for (const m of t.matchAll(/[\p{L}·-]+/gu)) if (!/[·-]/u.test(m[0])) add(closedStems, m[0]);
  }
  return { mediopunktStems, closedStems };
}

function run(strings, { reportStale = false } = {}) {
  const ctx = { ...compoundIndexOf(strings), usedAllow: new Set() };
  const findings = [];
  for (const s of strings) for (const f of checkString(s, ctx)) findings.push({ ...f, where: s.id });
  if (reportStale) {
    for (const [rule, list] of [
      ['de-register', REGISTER_ALLOW],
      ['en-spelling', BRITISH_ALLOW],
      ['de-mediopunkt', MEDIOPUNKT_ALLOW],
    ])
      for (const id of list.keys())
        if (!ctx.usedAllow.has(id))
          findings.push({
            level: 'WARN',
            rule,
            match: 'allowlist',
            msg: 'stale allowlist entry: the string no longer needs it (or is gone) - remove it',
            where: id,
          });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// Self-test — every rule must bite, and the tolerated shapes must stay green
// ---------------------------------------------------------------------------

function selftest() {
  const results = [];
  const S = (locale, text, base = 'fixture.json') => ({ locale, base, id: `${locale}/${base}#x`, keyPath: 'x', text });
  const rulesOf = (strings) => run(strings).map((f) => f.rule);
  const expect = (name, strings, want) => {
    const got = rulesOf(strings);
    const ok = want.length === got.length && want.every((w, i) => got[i] === w);
    results.push({ name, ok, detail: ok ? '' : `expected [${want}] got [${got}]` });
  };

  // de-register
  expect('„Wählen Sie“ imperative is flagged', [S('de', 'Wählen Sie Format und Dateityp.')], ['de-register']);
  expect('mid-sentence „Ihnen“ is flagged', [S('de-easy', 'Wir zeigen Ihnen den Weg.')], ['de-register']);
  expect('„Ihre Daten“ after a comma is flagged', [S('de', 'Keine Sorge, Ihre Daten bleiben hier.')], ['de-register']);
  expect('sentence-initial „Sie“ (= they) is tolerated', [S('de', 'Modelle lernen. Sie brauchen Daten.')], []);
  expect('„Sie“ after a colon is tolerated', [S('de', 'Wichtig: Sie lernen aus Beispielen.')], []);
  expect('lower-case „sie“ is not address', [S('de', 'Die Modelle, die sie trainieren.')], []);
  expect('impressum.json may stay formal', [S('de', 'Hier finden Sie das Impressum.', 'impressum.json')], []);
  expect('Sie inside <code> is ignored', [S('de', 'Tippe <code>echo Sie</code> ein.')], []);
  // de-guillemets
  expect(
    '»…« is flagged',
    [S('de', 'Die Meldung »Befehl nicht gefunden« erscheint.')],
    ['de-guillemets', 'de-guillemets'],
  );
  expect('„…“ passes', [S('de', 'Die Meldung „Befehl nicht gefunden“ erscheint.')], []);
  expect('„…" mixed pair is flagged', [S('de', 'Die Spalte „Tabelle" fehlt.')], ['de-quote-pair']);
  expect("‚…' mixed inner pair is flagged", [S('de', "Die KI ‚halluziniert' nicht.")], ['de-quote-pair']);
  expect('English “…” in German is flagged', [S('de-easy', 'Sag “Hallo”.')], ['de-quote-pair']);
  expect(
    'matched inner pair and the typographic apostrophe pass',
    [S('de', '„Er sagte ‚in der Vorstellung‘ und geht’s.“')],
    [],
  );
  // de-gender
  expect('colon form is flagged', [S('de', 'Für Nutzer:innen gedacht.')], ['de-gender']);
  expect('star form is flagged', [S('de-easy', 'Für Lehrer*innen.')], ['de-gender']);
  expect('Binnen-I is flagged', [S('de', 'Alle LehrerInnen.')], ['de-gender']);
  expect('pair form is flagged', [S('de', 'Für Besucherinnen und Besucher.')], ['de-gender']);
  expect(
    'generic masculine and participle nouns pass',
    [S('de', 'Der Nutzer hilft Lernenden. Die Nutzer lernen.')],
    [],
  );
  // de-mediopunkt
  expect('Mediopunkt in standard de is flagged', [S('de', 'Ein Computer·programm.')], ['de-mediopunkt']);
  expect('a spaced middle dot separator in de passes', [S('de', 'Artikel · 5 Minuten')], []);
  // de-easy-hyphen
  expect('Computer-Programm in de-easy is flagged', [S('de-easy', 'Ein Computer-Programm.')], ['de-easy-hyphen']);
  expect(
    'abbreviation, single letter, digit, 3+ parts and fixed terms keep the hyphen',
    [
      S(
        'de-easy',
        'Der KI-Agent schreibt eine E-Mail mit K-Means für ein 3D-Modell, 10-mal, Deep-Learning-Grundlagen, Few-Shot.',
      ),
    ],
    [],
  );
  expect('Mediopunkt compound in de-easy passes', [S('de-easy', 'Ein Computer·programm.')], []);
  expect(
    'code tokens keep the hyphen (.git-Ordner, git-Knöpfe, /new-content, verify-harness.mjs)',
    [S('de-easy', 'Im .git-Ordner und bei den git-Knöpfen. Sag /new-content. Starte scripts/verify-harness.mjs.')],
    [],
  );
  expect(
    'a closed compound inside a hyphen compound is not a split miss',
    [S('de-easy', 'Ein Sprach·modell.'), S('de-easy', 'Ein KI-Sprachmodell.')],
    [],
  );
  expect('a short hyphen compound is flagged too', [S('de-easy', 'Ein Test-Lauf.')], ['de-easy-hyphen']);
  // de-easy-wordclass
  expect(
    'lower-case Mediopunkt words (verb, adjective) are flagged',
    [S('de-easy', 'Wie Dinge zusammen·hängen. Linear oder nicht·linear. Der meist·genutzte Editor.')],
    ['de-easy-wordclass', 'de-easy-wordclass', 'de-easy-wordclass'],
  );
  expect(
    'a particle or prefix as first part is flagged',
    [S('de-easy', 'Dein Vor·wissen. Die Meta·daten. Der Selbst·check.')],
    ['de-easy-wordclass', 'de-easy-wordclass', 'de-easy-wordclass'],
  );
  expect(
    'a nominalised infinitive and a capitalised adjective are flagged',
    [S('de-easy', 'Programm zum Code·schreiben. Regel·basierte KI.')],
    ['de-easy-wordclass', 'de-easy-wordclass'],
  );
  // de-easy-short
  expect(
    'short compounds (≤ 10 letters) with a Mediopunkt are flagged',
    [S('de-easy', 'Das Werk·zeug auf der Start·seite im Wörter·buch.')],
    ['de-easy-short', 'de-easy-short', 'de-easy-short'],
  );
  expect(
    'stop-list words are flagged at any length, also inside a longer compound',
    [S('de-easy', 'Am Schreib·tisch. Der Werk·zeug·kasten. Die Telefon·nummer.')],
    ['de-easy-short', 'de-easy-short', 'de-easy-short'],
  );
  expect(
    'two parts written closed elsewhere must be joined in a 3-part compound',
    [S('de-easy', 'Die Alltags·bau·steine.'), S('de-easy', 'Ein Baustein.')],
    ['de-easy-deep'],
  );
  expect(
    'long compounds, names and English parts keep the Mediopunkt',
    [S('de-easy', 'Ein Sprach·modell, die Git·befehle, eine Wetter·app, der Werkzeug·kasten, ein Code·review.')],
    [],
  );
  // de-easy-split
  expect(
    'closed compound beside its Mediopunkt twin is flagged',
    [S('de-easy', 'Ein Sprach·modell.'), S('de-easy', 'Noch ein Sprachmodell.')],
    ['de-easy-split'],
  );
  expect(
    'an inflected form counts as the same compound',
    [S('de-easy', 'Die Test·dateien.'), S('de-easy', 'Eine Testdatei.')],
    ['de-easy-split'],
  );
  // de-easy-deep
  expect(
    'a long part that is split elsewhere must be split here too',
    [S('de-easy', 'Die Datenschutz·details.'), S('de-easy', 'Der Daten·schutz.')],
    ['de-easy-deep'],
  );
  expect(
    'fully split long compounds pass',
    [
      S('de-easy', 'Die Daten·schutz·details.'),
      S('de-easy', 'Der Daten·schutz. Das Produkt·lebens·zyklus·management.'),
    ],
    [],
  );
  // en-spelling
  expect(
    'British spellings are flagged',
    [S('en', 'The colour and behaviour of the centre, organised whilst modelling.')],
    ['en-spelling', 'en-spelling', 'en-spelling', 'en-spelling', 'en-spelling', 'en-spelling'],
  );
  expect(
    'American spellings and look-alikes pass',
    [S('en-easy', 'The color of the organism; two analyses; optimism.')],
    [],
  );
  expect('British spelling inside a URL is ignored', [S('en', 'See https://example.org/colour for details.')], []);
  // en-date
  expect('day-month-year date is flagged', [S('en', 'Published 15 July 2026.')], ['en-date']);
  expect('US date passes', [S('en', 'Published July 15, 2026.')], []);
  // locale isolation
  expect('German rules do not run on English', [S('en', 'Wählen Sie »x«.')], []);
  // allowlists: an entry suppresses its string, and a stale entry is reported
  const [allowedId] = BRITISH_ALLOW.keys();
  if (allowedId) {
    const allowed = { ...S('en', 'It was 89 per cent.'), id: allowedId };
    const withIt = run([allowed], { reportStale: true });
    results.push({ name: 'an allowlisted string is not flagged', ok: withIt.length === 0, detail: '' });
    const without = run([S('en', 'Nothing here.')], { reportStale: true });
    results.push({
      name: 'an allowlist entry that suppresses nothing is a WARN, not an ERROR',
      ok: without.some((f) => f.level === 'WARN' && f.where === allowedId) && !without.some((f) => f.level === 'ERROR'),
      detail: '',
    });
  }
  const [quotedId] = MEDIOPUNKT_ALLOW.keys();
  if (quotedId) {
    const quoted = { ...S('de', 'In einfachem Deutsch heißt es Code·review.'), id: quotedId };
    const withIt = run([quoted], { reportStale: true });
    results.push({ name: 'an allowlisted quoted Mediopunkt is not flagged', ok: withIt.length === 0, detail: '' });
    const elsewhere = run([S('de', 'In einfachem Deutsch heißt es Code·review.')]).map((f) => f.rule);
    results.push({
      name: 'the same Mediopunkt outside its allowlisted string is still flagged',
      ok: elsewhere.length === 1 && elsewhere[0] === 'de-mediopunkt',
      detail: '',
    });
    const without = run([S('de', 'Nichts hier.')], { reportStale: true });
    results.push({
      name: 'a Mediopunkt allowlist entry that suppresses nothing is a WARN, not an ERROR',
      ok: without.some((f) => f.level === 'WARN' && f.where === quotedId) && !without.some((f) => f.level === 'ERROR'),
      detail: '',
    });
  }

  // German guide twins (ADR-0018): template prose is checked, markup and code are not.
  {
    const twin = [
      '@Component({',
      '  template: `',
      '    <p class="lead">Wählen Sie ein Panel. Tippe <code>Sie</code> oder <kbd>Ihr</kbd>.</p>',
      '    <pre class="code-block"><code>// Wählen Sie</code></pre>',
      '    <section aria-label="Nutzer:innen">{{ m.a }}</section>',
      '  `,',
      '})',
      'export class XArticleDeComponent extends XArticleComponent {',
      "  override readonly m = { a: 'Für Nutzer:innen gedacht.', b: '1.125rem' };",
      '}',
    ].join('\n');
    const strings = twinStrings(twin, 'x/x-article.de.component.ts');
    const got = run(strings).map((x) => `${x.rule}@${x.where}`);
    const want = [
      'de-register@x/x-article.de.component.ts:3',
      'de-gender@x/x-article.de.component.ts:5',
      'de-gender@x/x-article.de.component.ts:9',
    ];
    const ok = want.length === got.length && want.every((w, i) => got[i] === w);
    results.push({
      name: 'a German guide twin: template prose, translatable attributes and class strings are checked, code is not',
      ok,
      detail: ok ? '' : `expected [${want}] got [${got}]`,
    });
  }

  for (const r of results)
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} SELFTEST: ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `check-house-style --selftest: FAIL — ${failed} case(s)` : 'check-house-style --selftest: PASS');
  return failed === 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  if (process.argv.includes('--selftest')) process.exit(selftest() ? 0 : 1);

  const files = collectFiles();
  if (!files.length) {
    console.error('check-house-style: found 0 content files - the gate would check nothing.');
    process.exit(2);
  }
  const strings = [];
  for (const { locale, file } of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    let json;
    try {
      json = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      continue; // a broken module is check-i18n-keys.mjs's finding, not this gate's
    }
    for (const { keyPath, text } of walk(json))
      strings.push({ locale, base: path.basename(file), id: `${rel}#${keyPath}`, keyPath, text });
  }

  const twins = collectTwins();
  for (const file of twins) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    strings.push(...twinStrings(fs.readFileSync(file, 'utf8'), rel));
  }

  const findings = run(strings, { reportStale: true });
  const line = '='.repeat(74);
  console.log(line);
  console.log(
    `  check-house-style - ${strings.length} strings in ${files.length} files (de, de-easy, en, en-easy) + ${twins.length} German guide twin(s)`,
  );
  console.log(line);
  for (const f of findings)
    console.log(`  ${f.level.padEnd(5)} [${f.rule}] "${f.match}" - ${f.msg}\n        ${f.where}`);
  const errors = findings.filter((f) => f.level === 'ERROR');
  const warns = findings.filter((f) => f.level === 'WARN');
  console.log(`\n  ${errors.length} error(s), ${warns.length} warning(s).`);
  if (errors.length) {
    console.log('  FAIL - fix every ERROR (rules: directives/languages/de.md, en.md).');
    process.exit(1);
  }
  console.log('  PASS - the mechanically checkable house style holds.');
}

main();
