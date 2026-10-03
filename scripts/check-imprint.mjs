#!/usr/bin/env node
/**
 * check-imprint — refuse to ship the kit's imprint/privacy placeholders to a real domain.
 *
 * The kit ships an Impressum and a privacy notice with placeholders on purpose: a
 * starter kit cannot know who runs the site. For a German-language site those two pages
 * are a legal duty (§ 5 DDG imprint, Art. 13 DSGVO information), and a page reading
 * "you@example.com" or "[Trage hier … ein]" is not a harmless leftover once it is online.
 * Until 2026-09-22 nothing stopped that: the deploy guide never mentioned the imprint and
 * no build step looked.
 *
 * What it scans (the two places those values live, see docs/how-to/deploy.md):
 *   - src/config/site.json (`operator`)      name, address, e-mail, supervisory authority
 *     (src/config/site-operator.ts hands these to the app; it holds no values itself)
 *   - src/assets/i18n/modules/<lang>/impressum.json   the bracketed fill-in instructions
 *   - src/assets/i18n/modules/<lang>/easyLanguage.json, the imprint's Easy-Language
 *     preview (`content.impressum`): it names the operator through `{operator}`; a
 *     literal placeholder name written there instead is caught
 *   - dist/vibecore/browser/assets/i18n/i18n.<lang>.json, `impressum` namespace — the
 *     built output, when one exists, so a stale or hand-edited bundle is caught too
 *
 * When it FAILS — the "real deployment" rule. The kit has no separate demo/production
 * switch: `npm run build:prod` is the only production build and it must stay green for
 * a fresh checkout. What does mark a build as meant for a real site is its domain, which
 * the operator sets in exactly two places (docs/how-to/deploy.md, "Set your site URL"):
 *   - `siteUrl` in src/environments/environment.prod.ts, compiled into the bundle
 *   - the SITE_BASE_URL environment variable, read by the sitemap step
 * If either names a real domain (not empty, not example.com/.org/.net, not a reserved
 * .example/.test/.invalid/.localhost name, not localhost), placeholders are an error
 * (exit 1). Otherwise they are reported as an advisory and the check passes (exit 0).
 * `--strict` forces the deployment rule regardless — for a pre-upload check by hand.
 *
 * One more place, with a stricter rule: the services under src/app/services/ (specs
 * and comments left out). Until 2026-09-23 the JSON-LD there named "Your Name, UX
 * Architect & Author" as author of every page. An identity invented in code is not
 * operator data waiting to be filled — the operator's name comes from site.json —
 * so CODE_PATTERNS fail the check whatever the domain, and the kit itself holds none.
 * The example.com URL is not among them: LanguageUrlService keeps it as a documented
 * last-resort origin that MetaSeoService strips before anything ships.
 *
 * Operator claims, a third rule: advisory only, whatever the domain. The accessibility
 * statement (`accessibility.json`) and the Easy-Language notice (`easyLanguage.json`,
 * `dialog.fullPortalNotice`) say how the kit's demo works: a person has read its texts
 * ("ein Mensch hat sie durchgelesen", "A person reads the texts"), with no editorial review.
 * Stronger claims of the same kind ("redaktionell begleitet", "Menschen prüfen die Texte",
 * German and English as the "editorially reviewed" versions) are listed too. A kit user
 * may work exactly so, or not at all, so these are no placeholders and never fail the build;
 * CLAIM_PATTERNS only lists them, with file and line, so the operator makes them true or
 * rewrites them (docs/how-to/make-it-yours.md).
 *
 * There is deliberately no skip variable. The fix is always to fill in the data; a
 * bypass here would be a way to publish a legally incomplete imprint (SEC-006 spirit).
 *
 * Wired into scripts/verify-build.js, which build:prod runs (twice) and which is the
 * pre-upload check. Dependency-free (Node core only).
 *
 * Usage:
 *   node scripts/check-imprint.mjs              apply the rule above
 *   node scripts/check-imprint.mjs --strict     treat this as a deployment, whatever the domain
 *   node scripts/check-imprint.mjs --json       machine-readable result
 *   node scripts/check-imprint.mjs --selftest   prove the patterns and the domain rule on fixtures
 *
 * Exit codes: 0 pass (or advisory) · 1 placeholders in a deployment build / an invented
 *             identity in service code / selftest failed
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OPERATOR_FILE = 'src/config/site.json';
const MODULES_DIR = 'src/assets/i18n/modules';
const ENV_PROD_FILE = 'src/environments/environment.prod.ts';
const BUILT_I18N_DIR = 'dist/vibecore/browser/assets/i18n';
const SERVICES_DIR = 'src/app/services';

/** Invented identity in service code — an error whatever the domain (see the header). */
export const CODE_PATTERNS = [
  { label: 'invented person name', re: /\bYour Name\b/gi },
  { label: 'placeholder name', re: /\[NAME\]/g },
  { label: 'example-domain e-mail', re: /[\w.+-]+@(?:[\w-]+\.)*example\.(?:com|org|net)\b/gi },
];

/**
 * The placeholder patterns. Each is specific enough not to hit real prose: the
 * licence-attribution sample in impressum.json ("[Titel des Inhalts]", "[path]") is an
 * example format for readers, not operator data, and deliberately matches nothing here.
 * Its "by <operator> (<site>)" part is filled from site.json's operator and the site URL at
 * runtime ({operator}/{siteUrl}); the kit's old hard-coded "by vibecore
 * (https://example.com…)" is caught by the last two patterns, so a translation that
 * brings it back cannot ship to a real domain.
 */
export const PATTERNS = [
  { label: 'example-domain e-mail', re: /[\w.+-]+@(?:[\w-]+\.)*example\.(?:com|org|net)\b/gi },
  { label: 'example-domain URL', re: /https?:\/\/(?:[\w-]+\.)*example\.(?:com|org|net)\b/gi },
  { label: 'placeholder address', re: /\b(?:Your Street|Your City|Authority Street|Authority City)\b/g },
  { label: 'placeholder name', re: /\[NAME\]/g },
  {
    label: 'fill-in instruction',
    re: /\[(?:Trage hier|Beschreibe hier|Hier muss der Betreiber|Ihre zuständige|Enter |Describe here|Here the operator|Your competent)[^\]]*\]/g,
  },
  { label: 'kit name as attribution holder', re: /\b(?:von|by) vibecore\b/gi },
  // The site's subject in the imprint's purpose / audience texts (all four locales).
  { label: 'site-subject placeholder', re: /\[(?:Thema der Website|subject of the site)\]/g },
  // Unbracketed notes to the operator that visitors would read: the privacy section's
  // intro calls itself a template (`dsgvoSectionIntro`, all four locales), and the
  // sentence after the bracketed data-processing instruction (`dataProtectionText3`)
  // survives when only the bracket is replaced. Until 2026-10-02 none of them was caught.
  {
    label: 'template notice',
    re: /\b(?:Platzhalter-Template|nur ein Muster|placeholder template|only a template)\b/gi,
  },
  {
    label: 'note to the operator',
    re: /\b(?:Der (?:Seiten·?)?[Bb]etreiber muss sie an|The (?:site )?operator must adapt|Diese Angaben muss der Betreiber selbst anpassen|Diese Angaben müssen an das konkrete Setup|This information must be adapted)/g,
  },
];

/**
 * Statements about how the site's texts are made that the kit's demo makes and an operator
 * must confirm or rewrite (see the header): reported, never a failure. Each phrase is the
 * kit's own wording in one of the four locales, the current one and the earlier one, so
 * rewritten text stops matching. A negated review ("nicht redaktionell geprüft", "not
 * editorially reviewed") is a disclaimer, not a claim, and is not listed.
 */
export const CLAIM_PATTERNS = [
  {
    label: 'claim: editorial review',
    re: /(?<!\bnicht )\bredaktionell (?:begleitet|geprüft\w*)|(?<!\bnot )\b(?:reviewed editorially|editorially reviewed)\b/gi,
  },
  {
    label: 'claim: people check the texts',
    re: /\bMenschen (?:prüfen die Texte|haben diese \d+ Sprachen geprüft)|\bPeople (?:check the texts|have checked these \d+ languages)/g,
  },
  {
    label: 'claim: a person reads the texts',
    re: /\b[Ee]in Mensch (?:hat (?:sie|die Texte)\b[^."]*?durchgelesen|liest die Texte\b[^."]*?\bdurch\b)|\bvon einem Menschen durchgelesen|\b[Aa] person (?:has read (?:them|the texts)|reads the texts)\b|\bread through by a person\b/g,
  },
];

/** Where the claims live: the accessibility statement and the Easy-Language notice, every locale. */
const CLAIM_FILES = ['accessibility.json', 'easyLanguage.json'];

/** Placeholder domains: empty, the IANA example domains, reserved TLDs (RFC 2606/6761), localhost. */
export function isRealDomain(url) {
  const value = (url ?? '').trim();
  if (!value) return false;
  let host;
  try {
    host = new URL(value).hostname.toLowerCase();
  } catch {
    return false; // not a URL at all — the build would not produce working links either
  }
  if (!host || host === 'localhost' || /^127\.|^0\.0\.0\.0$|^\[?::1\]?$/.test(host)) return false;
  if (/(^|\.)example\.(com|org|net)$/.test(host)) return false;
  if (/\.(example|test|invalid|localhost)$/.test(host) || /^(example|test|invalid)$/.test(host)) return false;
  return true;
}

/** Read `siteUrl: '…'` from environment.prod.ts source text. */
export function readSiteUrl(source) {
  const m = /\bsiteUrl\s*:\s*(['"`])([^'"`]*)\1/.exec(source);
  return m ? m[2] : '';
}

/** Drop comment lines so the file's own documentation cannot trip (or satisfy) the scan. */
export function stripTsComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
    .split('\n')
    .map((line) => (/^\s*\/\//.test(line) ? '' : line))
    .join('\n');
}

/** Blank the `"_…"` comment lines of a JSON config so its own documentation cannot trip the scan. */
export function stripJsonComments(source) {
  return source
    .split('\n')
    .map((line) => (/^\s*"_/.test(line) ? '' : line))
    .join('\n');
}

/** Easy-Language imprint preview: the operator comes in through `{operator}`, never as a literal. */
export const EASY_PREVIEW_PATTERNS = [...PATTERNS, CODE_PATTERNS[0]];

/** Pure: every placeholder in `text`, with its 1-based line. */
export function findPlaceholders(text, file, { operator = false, patterns = PATTERNS } = {}) {
  const hits = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { label, re, operatorOnly } of patterns) {
      if (operatorOnly && !operator) continue;
      for (const m of line.matchAll(re)) {
        const match = m[0].length > 60 ? `${m[0].slice(0, 57)}...]` : m[0];
        hits.push({ file, line: i + 1, label, match });
      }
    }
  });
  return hits;
}

/** Deployment decision from the two domain sources (+ --strict). */
export function deploymentTarget({ siteUrl, siteBaseUrl, strict }) {
  if (strict) return { deploy: true, reason: '--strict' };
  if (isRealDomain(siteUrl)) return { deploy: true, reason: `siteUrl in ${ENV_PROD_FILE} is ${siteUrl}` };
  if (isRealDomain(siteBaseUrl)) return { deploy: true, reason: `SITE_BASE_URL is ${siteBaseUrl}` };
  return { deploy: false, reason: 'no real domain set (siteUrl empty/placeholder, SITE_BASE_URL unset/placeholder)' };
}

function scanRepo() {
  const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
  const hits = [];
  const scanned = [];
  const setup = [];

  if (fs.existsSync(path.join(ROOT, OPERATOR_FILE))) {
    hits.push(...findPlaceholders(stripJsonComments(read(OPERATOR_FILE)), OPERATOR_FILE, { operator: true }));
    scanned.push(OPERATOR_FILE);
  } else {
    setup.push(`${OPERATOR_FILE} is missing — the imprint has no operator data at all.`);
  }

  const modulesDir = path.join(ROOT, MODULES_DIR);
  const langs = fs.existsSync(modulesDir) ? fs.readdirSync(modulesDir).sort() : [];
  for (const lang of langs) {
    const rel = `${MODULES_DIR}/${lang}/impressum.json`;
    if (!fs.existsSync(path.join(ROOT, rel))) continue;
    hits.push(...findPlaceholders(read(rel), rel));
    scanned.push(rel);
  }
  for (const lang of langs) {
    const rel = `${MODULES_DIR}/${lang}/easyLanguage.json`;
    if (!fs.existsSync(path.join(ROOT, rel))) continue;
    let preview;
    try {
      preview = JSON.parse(read(rel)).content?.impressum;
    } catch {
      continue; // an unparseable module is check-i18n-keys' finding
    }
    if (!preview) continue;
    const label = `${rel} (content.impressum)`;
    hits.push(...findPlaceholders(JSON.stringify(preview, null, 1), label, { patterns: EASY_PREVIEW_PATTERNS }));
    scanned.push(label);
  }
  if (!scanned.some((f) => f.endsWith('impressum.json'))) {
    setup.push(`found no impressum.json under ${MODULES_DIR} — the scan would have looked at nothing.`);
  }

  const builtDir = path.join(ROOT, BUILT_I18N_DIR);
  if (fs.existsSync(builtDir)) {
    for (const f of fs.readdirSync(builtDir).filter((n) => /^i18n\..+\.json$/.test(n))) {
      const rel = `${BUILT_I18N_DIR}/${f}`;
      let ns;
      try {
        ns = JSON.parse(read(rel)).impressum;
      } catch {
        continue; // a broken bundle is verify-build's finding, not this gate's
      }
      if (!ns) continue;
      hits.push(...findPlaceholders(JSON.stringify(ns, null, 1), `${rel} (impressum)`));
      scanned.push(rel);
    }
  }

  const claims = [];
  for (const lang of langs) {
    for (const name of CLAIM_FILES) {
      const rel = `${MODULES_DIR}/${lang}/${name}`;
      if (!fs.existsSync(path.join(ROOT, rel))) continue;
      claims.push(...findPlaceholders(read(rel), rel, { patterns: CLAIM_PATTERNS }));
    }
  }

  const codeHits = [];
  const servicesDir = path.join(ROOT, SERVICES_DIR);
  const serviceFiles = fs.existsSync(servicesDir)
    ? fs.readdirSync(servicesDir, { recursive: true }).map((f) => String(f).replace(/\\/g, '/'))
    : [];
  for (const f of serviceFiles.filter((n) => n.endsWith('.ts') && !n.endsWith('.spec.ts')).sort()) {
    const rel = `${SERVICES_DIR}/${f}`;
    codeHits.push(...findPlaceholders(stripTsComments(read(rel)), rel, { patterns: CODE_PATTERNS }));
    scanned.push(rel);
  }
  if (serviceFiles.length === 0)
    setup.push(`found no services under ${SERVICES_DIR} — the code scan looked at nothing.`);
  return { hits, codeHits, claims, scanned, setup };
}

/**
 * Advisory lines for the operator claims, never a failure: one line for the kit demo, each
 * claim with file and line once the build targets a real domain (or with --strict).
 */
function reportClaims(claims, listEach) {
  if (claims.length === 0) return;
  const files = [...new Set(claims.map((c) => c.file))];
  console.log(
    `check-imprint: NOTE — ${claims.length} statement(s) about how the texts are made (a person ` +
      `reading them, editorial review) in ${files.length} file(s). They describe the kit's demo; ` +
      `make them true for your site or rewrite them (docs/how-to/make-it-yours.md)${listEach ? ':' : '.'}`,
  );
  if (!listEach) return;
  for (const c of claims) console.log(`    ${c.file}:${c.line}  ${c.label}: ${c.match}`);
}

function selftest() {
  const results = [];
  const check = (name, cond) => results.push({ name, ok: !!cond });

  const operatorFixture = [
    '  "_operator": "Placeholder like you@example.com in a comment is ignored.",',
    '  "operator": { "name": "[NAME]", "address": "Your Street 1, 12345 Your City",',
    '    "email": "you@example.com", "supervisoryAuthority": { "website": "https://example.com" } }',
  ].join('\n');
  const opHits = findPlaceholders(stripJsonComments(operatorFixture), 'site.json', { operator: true });
  check('operator placeholders: name, street, city, e-mail, URL all found (5)', opHits.length === 5);
  check(
    'a placeholder inside a comment is not counted',
    opHits.every((h) => h.line !== 1),
  );

  const filled =
    '"operator": { "name": "Erika Mustermann", "address": "Hauptstr. 5, 10115 Berlin", "email": "kontakt@schule.test", "supervisoryAuthority": { "website": "https://www.datenschutz-berlin.de" } }';
  check('filled operator data passes', findPlaceholders(filled, 'site.json', { operator: true }).length === 0);

  const easyHits = (content) =>
    findPlaceholders(JSON.stringify({ blocks: [{ content }] }, null, 1), 'fixture.json', {
      patterns: EASY_PREVIEW_PATTERNS,
    });
  check(
    'Easy-Language imprint preview: a literal "Your Name" is found, `{operator}` passes',
    easyHits('Diese Website heißt vibecore. Sie gehört Your Name.').length === 1 &&
      easyHits('Diese Website heißt {siteName}. Sie gehört {operator}.').length === 0,
  );

  const i18nFixture = JSON.stringify(
    {
      a: 'Text. [Trage hier die tatsächliche Rechtsgrundlage ein.]',
      b: '[Enter here the actual legal basis.]',
      c: '[Hier muss der Betreiber eintragen, wie lange er Daten speichert.]',
      d: 'Quelle: „[Titel des Inhalts]“ von {operator} ({siteUrl}/[pfad]). [Bearbeitet.]',
    },
    null,
    1,
  );
  const i18nHits = findPlaceholders(i18nFixture, 'fixture.json');
  check('German and English fill-in instructions found (3)', i18nHits.length === 3);
  check(
    'licence-attribution sample brackets are not flagged',
    !i18nHits.some((h) => /Titel|pfad|Bearbeitet/.test(h.match)),
  );
  const subjectHits = findPlaceholders(
    JSON.stringify({
      de: 'Ein Bildungsportal rund um [Thema der Website].',
      en: 'An educational site on [subject of the site].',
      filled: 'Ein Bildungsportal rund um Künstliche Intelligenz.',
    }),
    'fixture.json',
  );
  check(
    'site-subject placeholders found in German and English (2), filled text passes',
    subjectHits.length === 2 && subjectHits.every((h) => h.label === 'site-subject placeholder'),
  );
  const noticeHits = (text) => findPlaceholders(JSON.stringify({ text }), 'fixture.json');
  const intros = [
    'Die folgenden Angaben sind ein Platzhalter-Template. Der Seitenbetreiber muss sie an seine tatsächliche Datenverarbeitung anpassen.',
    'Die folgenden Angaben sind nur ein Muster. Der Betreiber muss sie an seine echte Daten·verarbeitung anpassen.',
    'The following information is a placeholder template. The site operator must adapt it to their actual data processing.',
    'The following information is only a template. The operator must adapt it to the real data processing.',
  ];
  check(
    'the privacy intro that calls itself a template is flagged in all four locales (2 each)',
    intros.every((t) => {
      const hits = noticeHits(t);
      return (
        hits.length === 2 &&
        hits.some((h) => h.label === 'template notice') &&
        hits.some((h) => h.label === 'note to the operator')
      );
    }),
  );
  check(
    'the note left behind after a replaced data-processing bracket is flagged in all four locales',
    [
      'Wir nutzen Plausible. Diese Angaben müssen an das konkrete Setup und die geltende Rechtsordnung angepasst werden.',
      'Wir nutzen Plausible. Diese Angaben muss der Betreiber selbst anpassen.',
      'We use Plausible. This information must be adapted to the specific setup and the applicable legal framework.',
      'We use Plausible. The operator must adapt this information themselves.',
    ].every((t) => noticeHits(t).length === 1),
  );
  check(
    'real privacy prose and the licence text ("share and adapt") pass',
    noticeHits(
      'Die folgenden Angaben beschreiben unsere Datenverarbeitung. You are free to share and adapt this content. The operator of this kit must provide the backend.',
    ).length === 0,
  );
  const oldSample = findPlaceholders(
    '"x": "Source: “[content title]” by vibecore (https://example.com/[path]), licensed under CC BY 4.0"',
    'fixture.json',
  );
  check(
    'the old hard-coded attribution (kit name + example.com) is flagged',
    oldSample.some((h) => h.label === 'kit name as attribution holder') &&
      oldSample.some((h) => h.label === 'example-domain URL'),
  );

  check('empty siteUrl is not a deployment', !deploymentTarget({ siteUrl: '', siteBaseUrl: '' }).deploy);
  check(
    'your-domain.example is not a deployment',
    !deploymentTarget({ siteUrl: 'https://your-domain.example' }).deploy,
  );
  check('example.org is not a deployment', !deploymentTarget({ siteBaseUrl: 'https://www.example.org' }).deploy);
  check('localhost is not a deployment', !deploymentTarget({ siteBaseUrl: 'http://localhost:2000' }).deploy);
  // Any host outside the example names counts as real; RFC 5737 documentation addresses stand in.
  check('a real siteUrl is a deployment', deploymentTarget({ siteUrl: 'https://203.0.113.10' }).deploy);
  check('a real SITE_BASE_URL is a deployment', deploymentTarget({ siteBaseUrl: 'https://198.51.100.7' }).deploy);
  check('--strict is a deployment', deploymentTarget({ strict: true }).deploy);
  check(
    'siteUrl is read from environment source',
    readSiteUrl("  siteUrl: 'https://schule.example',") === 'https://schule.example',
  );

  const claimTexts = [
    'Unsere Texte in Einfacher Sprache entstehen KI-gestützt und werden redaktionell begleitet.',
    'Die redaktionell geprüften und maßgeblichen Fassungen sind Deutsch und Englisch.',
    'Eine KI hilft uns dabei. Menschen prüfen die Texte danach.',
    'Deutsch und Englisch sind am sichersten. Menschen haben diese 2 Sprachen geprüft.',
    'Our Plain Language texts are produced with AI support and reviewed editorially.',
    'The editorially reviewed and authoritative versions are German and English.',
    'An AI helps us with this. People check the texts afterwards.',
    'German and English are the safest. People have checked these 2 languages.',
    'Unsere Texte in Einfacher Sprache entstehen KI-gestützt; ein Mensch hat sie durchgelesen, eine redaktionelle Prüfung gibt es nicht.',
    'Maßgeblich sind die Fassungen auf Deutsch und Englisch; auch sie entstehen KI-gestützt und sind von einem Menschen durchgelesen, nicht redaktionell geprüft.',
    'Eine KI hilft uns dabei. Ein Mensch liest die Texte danach durch. Eine genaue Prüfung gibt es nicht.',
    'Deutsch und Englisch sind am sichersten. Ein Mensch hat die Texte in diesen 2 Sprachen durchgelesen. Eine genaue Prüfung gibt es nicht.',
    'Our Plain Language texts are produced with AI support; a person has read them through, but they are not editorially reviewed.',
    'Our Plain Language texts are AI-assisted; a person has read them through, but they are not editorially reviewed.',
    'The authoritative versions are German and English; they too are produced with AI support and read through by a person, not editorially reviewed.',
    'An AI helps us with this. A person reads the texts afterwards. Nobody checks them in detail.',
    'German and English are the safest. A person has read the texts in these 2 languages. Nobody checks them in detail.',
  ];
  const claimHits = (text) => findPlaceholders(JSON.stringify({ text }), 'fixture.json', { patterns: CLAIM_PATTERNS });
  check(
    "the demo's operator claims, current and earlier wording, are listed in all four locales (1 each)",
    claimTexts.every((t) => claimHits(t).length === 1),
  );
  check(
    'operator claims are advisory: none of them is an imprint placeholder that could fail a deployment',
    claimTexts.every((t) => findPlaceholders(JSON.stringify({ text: t }), 'fixture.json').length === 0),
  );
  check(
    'a disclaimer alone is no claim ("nicht redaktionell geprüft", "not editorially reviewed")',
    claimHits('Die Texte sind nicht redaktionell geprüft. The texts are not editorially reviewed.').length === 0,
  );
  check(
    'rewritten statements pass ("Eine Lehrerin liest jeden Text", "A teacher reads every text")',
    claimHits('Eine Lehrerin liest jeden Text. Die Übersetzungen prüft niemand. A teacher reads every text.').length ===
      0,
  );

  const serviceFixture = [
    '/** The operator used to be "Your Name" here; comments do not count. */',
    "author: { '@type': 'Person', name: 'Your Name', jobTitle: 'UX Architect & Author' },",
    "const fallback = 'https://example.com'; // documented last-resort origin",
    "contact: 'you@example.com',",
  ].join('\n');
  const codeHits = findPlaceholders(stripTsComments(serviceFixture), 'fixture.ts', { patterns: CODE_PATTERNS });
  check(
    'service code: the invented name and the example e-mail are found, the comment and the URL are not (2)',
    codeHits.length === 2 && codeHits.every((h) => h.line !== 1 && h.line !== 3),
  );
  check(
    'service code naming the operator through SITE_OPERATOR passes',
    findPlaceholders('const author = operatorAsPerson(SITE_OPERATOR.name);', 'fixture.ts', { patterns: CODE_PATTERNS })
      .length === 0,
  );

  for (const r of results) console.log(`  ${r.ok ? 'ok  ' : 'FAIL'} SELFTEST: ${r.name}`);
  const failed = results.filter((r) => !r.ok).length;
  console.log(failed ? `check-imprint --selftest: FAIL — ${failed} case(s)` : 'check-imprint --selftest: PASS');
  return failed === 0;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--selftest')) process.exit(selftest() ? 0 : 1);
  const json = args.includes('--json');

  const envProd = path.join(ROOT, ENV_PROD_FILE);
  const siteUrl = fs.existsSync(envProd) ? readSiteUrl(fs.readFileSync(envProd, 'utf8')) : '';
  const target = deploymentTarget({
    siteUrl,
    siteBaseUrl: process.env.SITE_BASE_URL,
    strict: args.includes('--strict'),
  });
  const { hits, codeHits, claims, scanned, setup } = scanRepo();
  const fail = setup.length > 0 || codeHits.length > 0 || (target.deploy && hits.length > 0);

  if (json) {
    console.log(
      JSON.stringify(
        { ok: !fail, deploy: target.deploy, reason: target.reason, hits, codeHits, claims, scanned, setup },
        null,
        2,
      ),
    );
    process.exit(fail ? 1 : 0);
  }

  for (const s of setup) console.error(`check-imprint: SETUP — ${s}`);
  if (codeHits.length > 0) {
    console.error(`check-imprint: FAIL — ${codeHits.length} invented identity value(s) in service code:`);
    for (const h of codeHits) console.error(`    ${h.file}:${h.line}  ${h.label}: ${h.match}`);
    console.error(`  Name the operator through SITE_OPERATOR (from ${OPERATOR_FILE}), or leave the property out.`);
  }

  reportClaims(claims, target.deploy);

  if (hits.length === 0) {
    if (!setup.length)
      console.log(`check-imprint: PASS — no imprint/privacy placeholders in ${scanned.length} file(s).`);
    process.exit(fail ? 1 : 0);
  }

  if (!target.deploy) {
    console.log(
      `check-imprint: ADVISORY — ${hits.length} imprint/privacy placeholder(s) remain; fine for the kit demo ` +
        `(${target.reason}). A build for a real domain refuses them.`,
    );
    process.exit(fail ? 1 : 0);
  }

  const byFile = new Map();
  for (const h of hits) byFile.set(h.file, [...(byFile.get(h.file) ?? []), h]);
  console.error('');
  console.error(`FAIL  Impressum/Datenschutz enthalten noch Platzhalter — dieser Build ist für eine echte Domain.`);
  console.error(`      Imprint/privacy notice still contain placeholders — this build targets a real domain.`);
  console.error(`      (${target.reason})`);
  console.error('');
  for (const [file, list] of byFile) {
    console.error(`  ${file}`);
    for (const h of list) console.error(`    ${String(h.line).padStart(4)}  ${h.label}: ${h.match}`);
  }
  console.error('');
  console.error(`  DE: Trage Betreiberdaten (Name, ladungsfähige Anschrift, E-Mail, Aufsichtsbehörde) in`);
  console.error(`      ${OPERATOR_FILE} (operator) ein und ersetze die [Klammer-Anweisungen] in allen vier`);
  console.error(`      ${MODULES_DIR}/<lang>/impressum.json. Impressumspflicht: § 5 DDG; Art. 13 DSGVO.`);
  console.error(`  EN: Fill in the operator data (name, postal address, e-mail, supervisory authority) in`);
  console.error(`      ${OPERATOR_FILE} (operator) and replace the [bracketed instructions] in all four`);
  console.error(`      ${MODULES_DIR}/<lang>/impressum.json. See docs/how-to/deploy.md.`);
  console.error(`  There is no override: the fix is the data, then \`npm run build:prod\` again.`);
  console.error('');
  process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
