#!/usr/bin/env node
/**
 * corpus-measure — build and compare text corpora for a language guide's §8.
 *
 * ⚠ MAKES OUTBOUND NETWORK REQUESTS — the only script in this repo that does.
 *   `fetch` and `pdf` download from whatever hosts you point them at (a WordPress
 *   REST endpoint, a sitemap, a MediaWiki API, a list of URLs). Nothing is uploaded:
 *   the traffic is one-way reads, and results are written to local JSON.
 *
 *   It is opt-in and stands apart from everything else here: no npm script runs it,
 *   no build or gate depends on it, and it is never invoked automatically. You run it
 *   by hand, deliberately, while authoring a language guide. Every other script in
 *   scripts/ works offline (build-thumbnails talks to your own dev server on
 *   localhost, which is not an outbound request).
 *
 * §8 of a language guide asks a question that can only be answered by counting: which
 * words actually separate plainer text from standard text in this language? The
 * intuitive answer — the learned or borrowed word is the harder one — is measurably
 * false often enough that the reversals are the most valuable rows in the section.
 *
 * Doing that counting inside a model is the single most expensive way to do it. Every
 * fetched article stays in context and is re-sent on every later step, so a few hundred
 * pages cost more than the entire guide they inform. Fetching, tokenizing and tallying
 * are ordinary programs. This is that program: it writes a frequency table to disk, and
 * the model reads the table.
 *
 * It also encodes the traps that produced confident WRONG numbers before they were
 * caught (see language-guide-authoring, "Measuring a corpus without fooling yourself"):
 * ASCII-only word boundaries that split every word at a diacritic, an entity decoder
 * that silently deleted two Romanian vowels, and page-builder residue that manufactured
 * hits for a word absent from the prose.
 *
 * Dependency-free (Node core only), like the other gates — except `pdf`, which shells
 * out to `pdftotext` because reimplementing a PDF text layer here would be its own
 * error class. Every other command runs without an install step.
 *
 * Usage:
 *   # 1. collect. WordPress REST is the most common shape; a URL list always works.
 *   node scripts/corpus-measure.mjs fetch --wp https://example.org --out plain.json --max 400
 *   node scripts/corpus-measure.mjs fetch --urls list.txt --out standard.json
 *   node scripts/corpus-measure.mjs fetch --sitemap https://example.org/sitemap.xml --out c.json
 *       --match '/[0-9]{7}$'      # keep only article URLs; sitemaps list landing pages too
 *   node scripts/corpus-measure.mjs fetch --mediawiki https://example.org/api.php --out c.json
 *
 *   # PDFs, for the bodies whose only plain-language publication is a set of leaflets.
 *   # Needs pdftotext on PATH. Embedded text only: a scan is reported, never OCR'd here.
 *   # ALWAYS pass --alphabet: a broken subset font reads as text and a script check
 *   # cannot see it, because Latin Extended-A is still Latin.
 *   node scripts/corpus-measure.mjs pdf --urls list.txt --out plain.json \
 *       --alphabet 'abcdefghijklmnopqrstuvwxyzàèéìòù' --drop-until 'Creative Commons'
 *
 *   --drop-until cuts a licence or attribution front page that does NOT repeat verbatim
 *   (the author and the level change), so the recurring-line stripper cannot see it.
 *   Left in, it added four long sentences to every short children's book and moved the
 *   mean sentence length of the plainer corpus the wrong way.
 *
 *   The fetcher REFUSES a host whose robots.txt disallows "/" for User-agent: * or for
 *   any named text-collection agent. That refusal is a finding: record in section 8c
 *   which pair could not be built and why.
 *
 *   # 2. describe one corpus (size, sentence length, long-word share, tokenizer sanity)
 *   node scripts/corpus-measure.mjs stats plain.json --sanity <a-word-that-cannot-be-rare>
 *
 *   # 3. contrast two corpora — this is what surfaces reversals
 *   node scripts/corpus-measure.mjs compare plain.json standard.json --top 40
 *   node scripts/corpus-measure.mjs compare plain.json standard.json --probe pairs.txt
 *
 * `pairs.txt` holds one candidate pair per line, "formal everyday", and reports the
 * direction each pair actually runs in. A pair whose right-hand column is flat or
 * inverted is a 🔴 do-NOT-simplify row.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// Fetching
// ---------------------------------------------------------------------------

const UA = 'Mozilla/5.0 (compatible; corpus-measure/1.0; language-guide research; +respects robots.txt)';

/**
 * Deliberately serial with a delay. A corpus is built once and kept; hammering a
 * publisher to save four minutes is not a trade worth making, and several of the
 * sources worth using are small non-profits.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, { retries = 2, delay = 1000 } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) return { ok: false, status: res.status, body: '' };
      return { ok: true, status: res.status, body: await res.text() };
    } catch (e) {
      if (attempt >= retries) return { ok: false, status: 0, body: '', error: String(e) };
      await sleep(delay * (attempt + 1));
    }
  }
}

// A publisher that names automated text-collection agents and disallows them has stated
// its position on this use, and a generic User-agent that is not on the list is not a
// loophole. Checking only the blanket "*" rule would have collected from a broadcaster
// whose robots.txt disallows a dozen such agents by name.
const CORPUS_AGENT_MARKERS = /bot\b|crawler|spider|-ai\b|^ai|search|extended|research|scrape|gpt|llm/i;

/**
 * robots.txt is a hard constraint on this method, not an obstacle to route around. When
 * a pair cannot be built, that fact belongs in section 8c of the guide.
 */
async function robotsCheck(base) {
  const origin = new URL(base).origin;
  const res = await get(`${origin}/robots.txt`);
  if (!res.ok) return { origin, unknown: true };

  // Group the file into User-agent -> rules blocks. Several agents may share one block.
  const blocks = [];
  let current = null;
  for (const raw of res.body.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const ua = line.match(/^User-agent:\s*(\S+)/i);
    if (ua) {
      if (!current || current.rules.length) blocks.push((current = { agents: [], rules: [] }));
      current.agents.push(ua[1]);
      continue;
    }
    const rule = line.match(/^(Disallow|Allow):\s*(\S*)/i);
    if (rule && current) current.rules.push({ kind: rule[1].toLowerCase(), path: rule[2] || '' });
  }

  const blocksAll = (b) => b.rules.some((r) => r.kind === 'disallow' && r.path === '/');
  const blanket = blocks.some((b) => b.agents.includes('*') && blocksAll(b));
  const deniedAgents = blocks
    .filter((b) => blocksAll(b))
    .flatMap((b) => b.agents)
    .filter((a) => a !== '*' && CORPUS_AGENT_MARKERS.test(a));

  const starRules = blocks.filter((b) => b.agents.includes('*')).flatMap((b) => b.rules);
  return { origin, blanket, deniedAgents: [...new Set(deniedAgents)], rules: starRules };
}

/**
 * Longest-match Allow/Disallow, the standard resolution: the most specific rule wins and
 * Allow beats Disallow at equal length.
 *
 * Path rules matter more here than they look. One publisher's robots.txt disallowed
 * `/wp-`, which covers `/wp-json/` - exactly the REST path this tool reaches for first.
 * Checking only for a blanket block would have collected from a disallowed endpoint while
 * reporting the host as open. The articles themselves were allowed, so the correct
 * response was to switch to the sitemap, not to give up and not to proceed regardless.
 */
function pathAllowed(rules, urlPath) {
  if (!rules?.length) return true;
  let best = { len: -1, allow: true };
  for (const r of rules) {
    if (!r.path) continue;
    const pattern = r.path.replace(/\*$/, '');
    if (!urlPath.startsWith(pattern)) continue;
    const len = pattern.length;
    if (len > best.len || (len === best.len && r.kind === 'allow')) {
      best = { len, allow: r.kind === 'allow' };
    }
  }
  return best.allow;
}

async function fetchWordPress(base, max) {
  const out = [];
  const per = 100;
  for (let page = 1; out.length < max; page++) {
    const url = `${base.replace(/\/$/, '')}/wp-json/wp/v2/posts?per_page=${per}&page=${page}&_fields=id,link,title,content`;
    const res = await get(url);
    if (!res.ok) break;
    let items;
    try {
      items = JSON.parse(res.body);
    } catch {
      break;
    }
    if (!Array.isArray(items) || items.length === 0) break;
    for (const it of items) {
      out.push({
        url: it.link,
        title: htmlToText(it.title?.rendered || ''),
        text: htmlToText(it.content?.rendered || ''),
      });
      if (out.length >= max) break;
    }
    process.stderr.write(`\r  fetched ${out.length}`);
    await sleep(400);
  }
  process.stderr.write('\n');
  return out;
}

/**
 * MediaWiki. Worth its own path because the plainest available corpus for several
 * languages is a children's encyclopedia running MediaWiki, and its API returns clean
 * plaintext extracts — no scraping, no template residue, and far gentler on the host
 * than fetching rendered pages.
 */
async function fetchMediaWiki(api, max, random) {
  const out = [];
  const seen = new Set();
  let cont = '';
  let empty = 0;
  while (out.length < max && empty < 5) {
    // allpages walks the title index alphabetically, which on a large wiki means a
    // corpus of articles starting with "A". For anything but a small site that is a
    // sampling bias dressed as a corpus, so random selection is the default there.
    const listUrl = random
      ? `${api}?action=query&list=random&rnnamespace=0&rnlimit=50&format=json`
      : `${api}?action=query&list=allpages&apnamespace=0&apfilterredir=nonredirects` +
        `&aplimit=200&format=json${cont}`;
    const res = await get(listUrl);
    if (!res.ok) break;
    let data;
    try {
      data = JSON.parse(res.body);
    } catch {
      break;
    }
    const pages = (random ? data?.query?.random : data?.query?.allpages) || [];
    const fresh = pages.filter((p) => !seen.has(p.id ?? p.pageid));
    for (const p of fresh) seen.add(p.id ?? p.pageid);
    if (!fresh.length) {
      empty++;
      continue;
    }
    empty = 0;

    for (let i = 0; i < fresh.length && out.length < max; i += 20) {
      const batch = fresh.slice(i, i + 20);
      const ex = await get(
        `${api}?action=query&pageids=${batch.map((p) => p.id ?? p.pageid).join('|')}` +
          `&prop=extracts&explaintext=1&exlimit=20&format=json`,
      );
      if (!ex.ok) continue;
      let ed;
      try {
        ed = JSON.parse(ex.body);
      } catch {
        continue;
      }
      for (const p of Object.values(ed?.query?.pages || {})) {
        const text = (p.extract || '').normalize('NFC').trim();
        // Stubs are mostly infobox leftovers and skew a frequency table toward
        // template vocabulary rather than prose.
        if (text.length < 400) continue;
        out.push({ url: `${api.replace(/\/api\.php$/, '')}/index.php?curid=${p.pageid}`, title: p.title, text });
        if (out.length >= max) break;
      }
      process.stderr.write(`\r  fetched ${out.length}`);
      await sleep(400);
    }
    if (random) continue;
    if (!data.continue?.apcontinue) break;
    cont = `&apcontinue=${encodeURIComponent(data.continue.apcontinue)}`;
  }
  process.stderr.write('\n');
  return out;
}

// ---------------------------------------------------------------------------
// PDF
// ---------------------------------------------------------------------------

/**
 * PDFs, because for several languages the only plain-language publication a body issues
 * is a set of leaflets rather than a website. Format is not absence, and a corpus that
 * exists and is permitted should not be recorded as unavailable because the pipeline
 * read HTML only.
 *
 * Embedded text first, always. Most digitally typeset documents carry it; OCR is slower
 * and introduces its own error class (confused characters, lost diacritics), so it is
 * for scans and nothing else. A document that yields no text here is REPORTED as a
 * probable scan rather than silently contributing an empty string - "the extractor found
 * nothing" and "the document contains nothing" are different findings, and a row derived
 * from an OCR'd source belongs in a different evidence tier.
 */
function pdfToText(file) {
  const r = spawnSync('pdftotext', ['-enc', 'UTF-8', '-nopgbrk', file, '-'], {
    encoding: 'utf8',
    maxBuffer: 1 << 28,
  });
  if (r.error) {
    console.error('pdftotext is not on PATH. Install poppler-utils, or extract out of');
    console.error('band and feed the result to `fetch --urls`.');
    process.exit(4);
  }
  return (r.stdout || '').normalize('NFC');
}

/**
 * A damaged ToUnicode CMap does not look damaged in aggregate - it looks like text.
 * Whole Italian pages came back as Latin Extended-A because a subset font mapped its
 * glyphs into that block, and every frequency built on top of it would have been
 * fiction that read as data. So each document is scored on the share of its letters
 * that fall in the script the corpus is supposed to be in, and anything below the floor
 * is dropped WITH A NOTICE rather than quietly averaged in.
 *
 * The script test is the coarse net and it MISSES the case that motivated it: Latin
 * Extended-A is still Latin, so a Latin-scripted language passes a script check while
 * reading as noise. `--alphabet` is the fine net - give it the letters the language
 * actually uses and the same run rejects the same document. Prefer it whenever the
 * language's inventory is known, which is always, because the guide's §3 lists it.
 */
const SCRIPTS = {
  latin: /[\p{Script=Latin}]/u,
  cyrillic: /[\p{Script=Cyrillic}]/u,
  greek: /[\p{Script=Greek}]/u,
  arabic: /[\p{Script=Arabic}]/u,
  devanagari: /[\p{Script=Devanagari}]/u,
};
function scriptShare(text, script) {
  const re = SCRIPTS[script] || SCRIPTS.latin;
  let letters = 0,
    inScript = 0;
  for (const ch of text) {
    if (!/\p{L}/u.test(ch)) continue;
    letters++;
    if (re.test(ch)) inScript++;
  }
  return letters ? inScript / letters : 0;
}

/** Share of letters drawn from an explicit inventory, plus the worst offenders by count. */
function alphabetShare(text, alphabet) {
  const allowed = new Set([...alphabet.toLowerCase()]);
  let letters = 0,
    inSet = 0;
  const strays = new Map();
  for (const ch of text) {
    if (!/\p{L}/u.test(ch)) continue;
    letters++;
    if (allowed.has(ch.toLowerCase())) inSet++;
    else strays.set(ch, (strays.get(ch) || 0) + 1);
  }
  const worst = [...strays.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([c, n]) => `${c}×${n}`)
    .join(' ');
  return { share: letters ? inSet / letters : 0, worst };
}

async function fetchPdfs(urls, max, { script, alphabet, floor, cacheDir, dropUntil }) {
  const out = [];
  const rejected = [];
  fs.mkdirSync(cacheDir, { recursive: true });
  const list = urls.slice(0, max);
  for (const url of list) {
    const file = path.join(cacheDir, Buffer.from(url).toString('base64url').slice(-100) + '.pdf');
    if (!fs.existsSync(file)) {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
      if (!res.ok) {
        rejected.push([url, `HTTP ${res.status}`]);
        continue;
      }
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      await sleep(400);
    }
    const raw = pdfToText(file);
    // Page furniture interleaved with body text breaks sentence segmentation, and a
    // standalone page number between two blocks is the specific case that produced a
    // BACKWARDS sentence-length figure in one language.
    let lines = raw.split(/\r?\n/).filter((l) => !/^\s*\d{1,4}\s*$/.test(l));
    // A licence and attribution front page is not prose in the target language, and it
    // does not repeat verbatim (the level and the author change), so the recurring-line
    // stripper cannot see it. Left in, it added four long sentences to every short
    // children's book and moved the mean sentence length of the PLAINER corpus up.
    if (dropUntil) {
      const re = new RegExp(dropUntil, 'i');
      const at = lines.findIndex((l) => re.test(l));
      if (at >= 0) lines = lines.slice(at + 1);
    }
    const text = lines
      .join('\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (text.replace(/\s/g, '').length < 200) {
      rejected.push([url, 'no embedded text - probably a scan; OCR is a separate evidence tier']);
      continue;
    }
    const share = scriptShare(text, script);
    if (share < floor) {
      rejected.push([url, `only ${(share * 100).toFixed(0)}% of letters are ${script} - broken font encoding`]);
      continue;
    }
    if (alphabet) {
      const a = alphabetShare(text, alphabet);
      if (a.share < floor) {
        rejected.push([
          url,
          `only ${(a.share * 100).toFixed(0)}% of letters are in --alphabet (${a.worst}) - broken font encoding`,
        ]);
        continue;
      }
    }
    out.push({ url, title: '', text });
    process.stderr.write(`\r  extracted ${out.length}/${list.length}`);
  }
  process.stderr.write('\n');
  if (rejected.length) {
    console.error(`${rejected.length} document(s) NOT used - this is a finding, not a gap:`);
    for (const [u, why] of rejected.slice(0, 25)) console.error(`  ${why}  ${u}`);
  }
  return out;
}

async function fetchUrls(urls, max, selector) {
  const out = [];
  for (const url of urls.slice(0, max)) {
    const res = await get(url);
    if (!res.ok) continue;
    const text = htmlToText(articleBody(res.body, selector));
    if (text.length > 200) out.push({ url, title: '', text });
    process.stderr.write(`\r  fetched ${out.length}/${urls.length}`);
    await sleep(400);
  }
  process.stderr.write('\n');
  return out;
}

async function sitemapUrls(url, depth = 0) {
  const res = await get(url);
  if (!res.ok) return [];
  // CDATA is common in news sitemaps and `[^<]` cannot match through it, so a plain
  // pattern silently returns zero URLs and the run reports an empty corpus rather than
  // an error. Accept both forms.
  const locs = [...res.body.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^\]<]+?)\s*(?:\]\]>)?\s*<\/loc>/gi)]
    .map((m) => m[1].trim())
    .filter(Boolean);
  if (/<sitemapindex/i.test(res.body) && depth < 2) {
    const all = [];
    for (const l of locs.slice(0, 20)) all.push(...(await sitemapUrls(l, depth + 1)));
    return all;
  }
  return locs;
}

/**
 * Prefer a recognisable article container, but only if it actually holds the article.
 *
 * Plenty of sites wrap a teaser, a related-items rail or a comment box in <article>.
 * Taking the first match unconditionally then yields a few dozen characters, the
 * document is dropped for being too short, and the run reports an empty corpus while
 * every page fetched fine - which is what happened on a Korean newspaper. So: take the
 * LARGEST candidate, and fall back to the whole document when it is implausibly small.
 */
/**
 * Explicit container, for sites where the heuristic loses.
 *
 * Nested divs cannot be matched with a regex, so a container has to be sliced rather than
 * captured: from its opening tag to whichever end marker comes first. Over-inclusive by
 * design - it is far better to carry a little trailing markup than to fall back to the
 * whole page, which on one Korean newspaper meant a corpus made largely of the navigation
 * menu, with "subscribe", "close" and "search" among the most register-distinctive words.
 */
function sliceContainer(html, needle) {
  const at = html.indexOf(needle);
  if (at < 0) return null;
  const open = html.lastIndexOf('<', at);
  const rest = html.slice(open < 0 ? at : open);
  const end = rest.slice(1).search(/<footer|<\/body|class="[^"]*(?:footer|related|comment|share|recommend)/i);
  return end > 0 ? rest.slice(0, end + 1) : rest;
}

function articleBody(html, selector) {
  if (selector) {
    const seg = sliceContainer(html, selector);
    if (seg) return seg;
  }
  const candidates = [
    ...html.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi),
    ...html.matchAll(/<main[^>]*>([\s\S]*?)<\/main>/gi),
    ...html.matchAll(/<div[^>]+(?:id|class)="[^"]*(?:article|content|body|entry)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi),
  ].map((m) => m[1]);

  // Rank by the length of the TEXT a candidate yields, not the length of its markup.
  // Ranking by raw HTML picked a nested wrapper whose inner divs truncate the match, so
  // a container of 800+ characters of tags reduced to a single word - 100 Korean
  // articles came back with one token each and the run looked like a success.
  let best = { text: '', raw: null };
  for (const c of candidates) {
    const t = htmlToText(c);
    if (t.length > best.text.length) best = { text: t, raw: c };
  }
  const whole = htmlToText(html);
  return best.text.length >= whole.length * 0.5 ? best.raw : html;
}

// ---------------------------------------------------------------------------
// HTML -> text
// ---------------------------------------------------------------------------

// A named-entity decoder that maps unknown names to "" is the specific bug that deleted
// every circumflex vowel from a corpus and produced tables that looked entirely
// plausible. Anything not in this table is left as literal source text rather than
// silently dropped - visible damage beats invisible damage.
const ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  shy: '',
  laquo: '«',
  raquo: '»',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  bdquo: '„',
  sbquo: '‚',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  middot: '·',
  deg: '°',
  bull: '·',
  prime: '′',
};

// The 64 Latin-1 named entities, which map one-to-one onto U+00C0..U+00FF in this exact
// order. They are spelled out rather than hand-picked because a MISSING accented entity
// does not go missing quietly: the cleanup below removes the unrecognised name and
// SPLITS the word around it, so `ci&ecirc;ncia` becomes the two tokens `ci` and `ncia`.
// A trial run had `ncia`, `es` and `ch` among the most register-distinctive "words" in
// Portuguese before this table was completed.
const LATIN1_NAMES = (
  'Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml ' +
  'Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times ' +
  'Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde ' +
  'auml aring aelig ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ' +
  'ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml ' +
  'yacute thorn yuml'
).split(' ');
LATIN1_NAMES.forEach((name, i) => {
  ENTITIES[name] = String.fromCodePoint(0x00c0 + i);
});

const UNKNOWN_ENTITIES = new Map();

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z][a-z0-9]*);/gi, (m, name) => {
      // Case-sensitive FIRST: Agrave and agrave are different characters, and folding
      // case here would quietly turn every capital into a lowercase one.
      if (Object.prototype.hasOwnProperty.call(ENTITIES, name)) return ENTITIES[name];
      const k = name.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(ENTITIES, k)) return ENTITIES[k];
      UNKNOWN_ENTITIES.set(name, (UNKNOWN_ENTITIES.get(name) || 0) + 1);
      return m;
    });
}

function stripMarkup(s) {
  s = s.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ');
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  // Page-builder shortcode residue made up 37% of one easy-read corpus and manufactured
  // 65 hits for a word that never appeared in the prose. A publication's own furniture
  // is not evidence about the language.
  s = s.replace(/\[\/?[a-z_][^\]]{0,200}\]/gi, ' ');
  s = s.replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  // Attribute values routinely contain ">" - a JSON blob in a data- attribute is the
  // common case - and `<[^>]+>` stops at that character, leaking the rest of the tag into
  // the text. On one site that meant JSON keys and unicode escapes were tokenised as
  // words: `url`, `title`, `type`, plus the fragments `u`, `e` and `ed` left by escape
  // sequences - which duly ranked as the most register-distinctive vocabulary in Czech.
  // Quoted spans are skipped so a ">" inside an attribute no longer ends the tag.
  return s.replace(/<[a-zA-Z!/][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g, ' ');
}

/**
 * Drop lines that recur across the corpus: licence footers, credit lines, standing calls
 * to action. They are the publication's furniture, not evidence about the language, and
 * because they repeat in every document they dominate a keyness list. The threshold is
 * deliberately low - genuine prose does not repeat verbatim across articles.
 */
function stripBoilerplate(docs, threshold = 0.12) {
  const seen = new Map();
  for (const d of docs) {
    const lines = new Set(
      d.text
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 3),
    );
    for (const line of lines) seen.set(line, (seen.get(line) || 0) + 1);
  }
  const min = Math.max(3, Math.ceil(docs.length * threshold));
  const boiler = new Set([...seen.entries()].filter(([, n]) => n >= min).map(([l]) => l));
  let removed = 0;
  for (const d of docs) {
    d.text = d.text
      .split('\n')
      .filter((l) => {
        if (!boiler.has(l.trim())) return true;
        removed++;
        return false;
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  return { distinctLines: boiler.size, linesRemoved: removed };
}

/**
 * Decode and strip ALTERNATELY until the text stops changing.
 *
 * Order matters here and getting it wrong fails silently. Feeds routinely carry escaped
 * markup (`&lt;a href=...&gt;`) and double-encoded entities (`&amp;atilde;`). Stripping
 * tags once and then decoding leaves that markup as visible prose: a trial run produced
 * `href`, `index` and `atilde` among the most register-distinctive "words" in
 * Portuguese, which reads as a finding about the language and is a finding about the
 * scraper.
 */
function htmlToText(html) {
  let s = String(html);
  for (let i = 0; i < 4; i++) {
    const before = s;
    s = decodeEntities(stripMarkup(s));
    if (s === before) break;
  }
  // A bare entity name surviving irreparable double-encoding is not a word.
  s = s.replace(/&[a-z][a-z0-9]{1,10};?/gi, ' ');
  s = s.replace(/https?:\/\/\S+|\bwww\.\S+/gi, ' ');
  s = s.replace(/[ \t\u00a0]+/g, ' ').replace(/\n{3,}/g, '\n\n');
  return s.normalize('NFC').trim();
}

// ---------------------------------------------------------------------------
// Tokenizing
// ---------------------------------------------------------------------------

// \b is ASCII-only in JS, so /\bword\b/ splits at every diacritic and silently measures
// fragments. Everything here works on Unicode letter classes instead.
const TOKEN_RE = /[\p{L}\p{M}]+(?:['’ʼ-][\p{L}\p{M}]+)*/gu;

const tokenize = (text) => text.normalize('NFC').toLowerCase().match(TOKEN_RE) || [];

/** Sentence split that does not treat a decimal point or an abbreviation as an end. */
function sentences(text) {
  return text
    .split(/(?<=[.!?…。॥։؟।])\s+(?=[\p{Lu}\p{Lo}“"«(\p{L}])/gu)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function tally(docs) {
  const counts = new Map();
  let total = 0;
  for (const d of docs) {
    for (const t of tokenize(d.text)) {
      counts.set(t, (counts.get(t) || 0) + 1);
      total++;
    }
  }
  return { counts, total };
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

function corpusStats(docs, sanityWord) {
  const { counts, total } = tally(docs);
  const sents = docs.flatMap((d) => sentences(d.text));
  const lens = sents
    .map((s) => tokenize(s).length)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const long = [...counts.entries()].filter(([w]) => [...w].length >= 12).reduce((a, [, n]) => a + n, 0);

  const stats = {
    documents: docs.length,
    tokens: total,
    types: counts.size,
    typeTokenRatio: total ? +(counts.size / total).toFixed(4) : 0,
    sentences: lens.length,
    meanSentenceWords: lens.length ? +(lens.reduce((a, b) => a + b, 0) / lens.length).toFixed(2) : 0,
    medianSentenceWords: lens.length ? lens[Math.floor(lens.length / 2)] : 0,
    pctSentencesUnder16: lens.length ? +((lens.filter((n) => n <= 15).length / lens.length) * 100).toFixed(1) : 0,
    pctTokensOver11Chars: total ? +((long / total) * 100).toFixed(1) : 0,
  };

  // The tokenizer self-test. A corpus whose commonest function word comes back zero is
  // damaged, and the frequency table built from it will look entirely reasonable. This
  // is how a decoder bug that deleted two vowels was finally caught.
  if (sanityWord) {
    const n = counts.get(sanityWord.normalize('NFC').toLowerCase()) || 0;
    stats.sanity = { word: sanityWord, count: n, ok: n > 0 };
  }
  return { stats, counts, total };
}

const per100k = (n, total) => (total ? +((n / total) * 100000).toFixed(1) : 0);

/**
 * Log-likelihood keyness. Run this BEFORE writing a probe list: a probe list written
 * from intuition measures the intuition. Let the data nominate the rows.
 */
function keyness(aCounts, aTotal, bCounts, bTotal, minCount) {
  const rows = [];
  const words = new Set([...aCounts.keys(), ...bCounts.keys()]);
  for (const w of words) {
    const a = aCounts.get(w) || 0;
    const b = bCounts.get(w) || 0;
    if (a + b < minCount) continue;
    const eA = (aTotal * (a + b)) / (aTotal + bTotal);
    const eB = (bTotal * (a + b)) / (aTotal + bTotal);
    const ll = 2 * ((a ? a * Math.log(a / eA) : 0) + (b ? b * Math.log(b / eB) : 0));
    rows.push({
      word: w,
      a,
      b,
      aPer100k: per100k(a, aTotal),
      bPer100k: per100k(b, bTotal),
      ll: +ll.toFixed(1),
      favours: a / aTotal >= b / bTotal ? 'A' : 'B',
    });
  }
  return rows.sort((x, y) => y.ll - x.ll);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (name, dflt = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes(`--${name}`);

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const writeJson = (p, v) => {
  fs.mkdirSync(path.dirname(path.resolve(p)), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 1), 'utf8');
};

function usage(code = 0) {
  console.log(
    fs
      .readFileSync(new URL(import.meta.url), 'utf8')
      .split('\n')
      .filter((l) => l.startsWith(' *'))
      .map((l) => l.replace(/^ \*ance?/, ' *').slice(3))
      .join('\n'),
  );
  process.exit(code);
}

if (!cmd || has('help')) usage(cmd ? 0 : 1);

if (cmd === 'fetch') {
  const out = flag('out');
  const max = Number(flag('max', '400'));
  if (!out) usage(1);

  let docs = [];
  const wp = flag('wp');
  const sm = flag('sitemap');
  const urlFile = flag('urls');

  const mw = flag('mediawiki');
  const base = wp || sm || mw || null;
  if (base && !has('i-have-permission')) {
    const rb = await robotsCheck(base);
    if (rb.blanket) {
      console.error(`REFUSING: ${rb.origin}/robots.txt disallows "/" for User-agent: *.`);
      console.error('Record in section 8c which pair could not be built, and why.');
      process.exit(3);
    }
    if (rb.deniedAgents?.length) {
      console.error(`REFUSING: ${rb.origin}/robots.txt disallows "/" by name for: ${rb.deniedAgents.join(', ')}.`);
      console.error('The publisher has stated its position on automated text collection.');
      console.error('A user-agent string that is not on the list is not a loophole.');
      console.error('Record in section 8c that this pair could not be built, and why.');
      process.exit(3);
    }
    if (rb.unknown) console.error(`note: ${rb.origin}/robots.txt could not be read; proceeding.`);

    // Path-level rules, checked against the endpoint this run will actually request.
    const probePath = wp ? '/wp-json/wp/v2/posts' : mw ? new URL(mw).pathname : new URL(sm).pathname;
    if (rb.rules && !pathAllowed(rb.rules, probePath)) {
      console.error(`REFUSING: ${rb.origin}/robots.txt disallows the path ${probePath}.`);
      console.error('If the articles themselves are allowed, collect them via --sitemap or --urls instead.');
      process.exit(3);
    }
  }

  if (wp) docs = await fetchWordPress(wp, max);
  else if (mw) docs = await fetchMediaWiki(mw, max, has('random'));
  else if (sm) {
    let urls = await sitemapUrls(sm);
    // A sitemap routinely lists section and landing pages alongside articles. Those are
    // navigation and widget furniture, not prose, and they poison a frequency table with
    // player metadata - one run returned `url`, `title` and `type` among the most
    // register-distinctive "words" in Czech. --match keeps only real article URLs.
    const m = flag('match');
    if (m) {
      const re = new RegExp(m);
      const before = urls.length;
      urls = urls.filter((u) => re.test(u));
      console.error(`--match kept ${urls.length} of ${before} sitemap URLs`);
    }
    docs = await fetchUrls(urls, max, flag('selector'));
  } else if (urlFile)
    docs = await fetchUrls(fs.readFileSync(urlFile, 'utf8').split(/\r?\n/).filter(Boolean), max, flag('selector'));
  else usage(1);

  const bp = stripBoilerplate(docs);
  writeJson(out, docs);
  const chars = docs.reduce((a, d) => a + d.text.length, 0);
  console.log(`${docs.length} documents, ${chars.toLocaleString()} chars -> ${out}`);
  console.log(`boilerplate: ${bp.distinctLines} recurring line(s) dropped, ${bp.linesRemoved} occurrence(s)`);
  if (UNKNOWN_ENTITIES.size) {
    // An unrecognised named entity splits the word around it, so it must never pass
    // unreported: a silent split produces plausible-looking fake tokens.
    const top = [...UNKNOWN_ENTITIES.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    console.log(`WARNING unknown entities (word-splitting risk): ${top.map(([n, c]) => `&${n}; x${c}`).join(', ')}`);
  }
  process.exit(0);
}

if (cmd === 'pdf') {
  const out = flag('out');
  const urlFile = flag('urls');
  if (!out || !urlFile) usage(1);
  const urls = fs
    .readFileSync(urlFile, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  // One robots check per host, on the same terms as every other collector here.
  if (!has('i-have-permission')) {
    for (const origin of new Set(urls.map((u) => new URL(u).origin))) {
      const rb = await robotsCheck(origin);
      if (rb.blanket || rb.deniedAgents?.length) {
        console.error(
          `REFUSING: ${origin}/robots.txt disallows automated collection` +
            (rb.deniedAgents?.length ? ` by name for: ${rb.deniedAgents.join(', ')}` : ' for User-agent: *') +
            '.',
        );
        console.error('Record in section 8c that this pair could not be built, and why.');
        process.exit(3);
      }
    }
  }
  const docs = await fetchPdfs(urls, Number(flag('max', '400')), {
    script: flag('script', 'latin'),
    alphabet: flag('alphabet'),
    dropUntil: flag('drop-until'),
    floor: Number(flag('script-floor', '0.9')),
    cacheDir: flag('cache', path.join(path.dirname(path.resolve(out)), '.pdf-cache')),
  });
  const bp = stripBoilerplate(docs);
  writeJson(out, docs);
  const chars = docs.reduce((a, d) => a + d.text.length, 0);
  console.log(`${docs.length} documents, ${chars.toLocaleString()} chars -> ${out}`);
  console.log(`boilerplate: ${bp.distinctLines} recurring line(s) dropped, ${bp.linesRemoved} occurrence(s)`);
  process.exit(0);
}

if (cmd === 'stats') {
  const file = argv[1];
  if (!file) usage(1);
  const { stats } = corpusStats(readJson(file), flag('sanity'));
  console.log(JSON.stringify(stats, null, 2));
  if (stats.sanity && !stats.sanity.ok) {
    console.error(`\nFAIL: sanity word "${stats.sanity.word}" occurs 0 times.`);
    console.error('The tokenizer or the extraction is damaged. Do not trust any count from this corpus.');
    process.exit(1);
  }
  process.exit(0);
}

if (cmd === 'compare') {
  const [, aFile, bFile] = argv;
  if (!aFile || !bFile) usage(1);
  const A = corpusStats(readJson(aFile), null);
  const B = corpusStats(readJson(bFile), null);

  console.log(
    `A (plainer)  ${aFile}: ${A.total.toLocaleString()} tokens, ` + `mean sentence ${A.stats.meanSentenceWords} words`,
  );
  console.log(
    `B (standard) ${bFile}: ${B.total.toLocaleString()} tokens, ` +
      `mean sentence ${B.stats.meanSentenceWords} words\n`,
  );

  const probeFile = flag('probe');
  if (probeFile) {
    // Explicit pair testing. The column that matters is `verdict`: a pair whose
    // "everyday" member is not actually commoner in the plainer corpus is a candidate
    // do-NOT-simplify row, and those are worth more than the pairs that confirm.
    const pairs = fs
      .readFileSync(probeFile, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => l.split(/\s+/));
    console.log('| formal | everyday | formal A/B per 100k | everyday A/B per 100k | verdict |');
    console.log('|---|---|---|---|---|');
    for (const [formal, everyday] of pairs) {
      if (!formal || !everyday) continue;
      const f = [formal, everyday].map((w) => {
        const k = w.normalize('NFC').toLowerCase();
        return { a: A.counts.get(k) || 0, b: B.counts.get(k) || 0 };
      });
      const fa = per100k(f[0].a, A.total),
        fb = per100k(f[0].b, B.total);
      const ea = per100k(f[1].a, A.total),
        eb = per100k(f[1].b, B.total);
      // A verdict needs a tolerance band. Without one, a 4% gap between two rates reads
      // as a reversal, which is the same over-reading of a small number that this whole
      // procedure exists to prevent. FLAT is the honest answer far more often than
      // either direction, and a thin row is not a finding at all.
      const ratio = eb === 0 ? Infinity : ea / eb;
      const fRatio = fb === 0 ? Infinity : fa / fb;
      const BAND = 1.25;
      const THIN = 3; // per 100k in both corpora - too rare to carry a claim
      let verdict;
      // If the FORMAL word is absent from both corpora there is nothing to measure about
      // the swap, whatever the everyday word does - and reporting a direction there is
      // actively misleading. A whole official plain-language wordlist scored zero on both
      // sides in one language because it targets administrative prose that neither a
      // newspaper nor a science magazine contains. That is a finding about the corpora,
      // not evidence against the list.
      if (f[0].a + f[0].b === 0 && f[1].a + f[1].b === 0) verdict = 'untestable (both absent)';
      else if (f[0].a + f[0].b === 0)
        verdict =
          'untestable: formal word absent from both corpora - it belongs to a register these corpora do not contain';
      else if (ea === 0 && eb === 0) verdict = 'untestable: "everyday" absent from both';
      else if (ea < THIN && eb < THIN) verdict = 'thin: too few tokens to judge';
      // A formal word present only a token or two either side cannot support a direction
      // either. Without this, a row whose formal member appears ONCE was reported as a
      // reversal on the strength of the everyday member alone - the same over-reading the
      // absent-formal case already guards against, one token further along.
      else if (fa < THIN && fb < THIN) verdict = 'thin: formal word too rare in both corpora to judge the swap';
      else if (ratio >= BAND && fRatio <= 1 / BAND) verdict = 'holds';
      else if (ratio >= BAND) verdict = 'partial: "everyday" is plainer, but the formal word is not a formality marker';
      else if (ratio <= 1 / BAND) verdict = 'REVERSED: "everyday" is rarer in plain text';
      else verdict = 'flat: no register signal';
      console.log(`| ${formal} | ${everyday} | ${fa} / ${fb} | ${ea} / ${eb} | ${verdict} |`);
    }
    process.exit(0);
  }

  const top = Number(flag('top', '40'));
  const rows = keyness(A.counts, A.total, B.counts, B.total, Number(flag('min', '10')));
  console.log(`| word | A/100k | B/100k | LL | favors |`);
  console.log(`|---|---|---|---|---|`);
  for (const r of rows.slice(0, top)) {
    console.log(`| ${r.word} | ${r.aPer100k} | ${r.bPer100k} | ${r.ll} | ${r.favours} |`);
  }
  process.exit(0);
}

usage(1);
