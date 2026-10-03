#!/usr/bin/env node
/**
 * check-language-guide — deterministic gate for `directives/languages/<code>.md`
 * and its companion `directives/languages/<code>.setup.md`.
 *
 * One guide, two files, split by when a reader needs a section rather than by what
 * kind of content it is: `<code>.md` carries §1 and §4-9, the six sections consulted
 * on every translation job; `<code>.setup.md` carries §2, §3, §10 and §11, read once
 * when a language is added or verified. Section numbers are shared, so "§3" means the
 * same section in both. Both halves run every check below; only template completeness
 * and the nested-quotation rule are half-specific.
 *
 * Language guides are long, multi-script, quote-heavy documents. The defects that
 * actually hit them are mechanical, not editorial: a codepoint claimed in prose but
 * a different byte written next to it, a "wrong" example that is byte-identical to
 * the "right" one, a homoglyph letter smuggled into a non-Latin word, a relative
 * link copied without accounting for a directory level. Every one of those is
 * decidable by a machine, so it belongs here and not in a review prompt. What is
 * left for a human or a model afterwards is fidelity — does this quote really appear
 * in the cited source — which no script can answer.
 *
 * Checks (see the section banners below for the implementation of each):
 *   1. Encoding hygiene      — UTF-8, no BOM, NFC-stable, no U+FFFD, no mojibake,
 *                              no stray zero-width characters.
 *   2. Mixed-script tokens   — a Latin letter inside a non-Latin word (or the
 *                              reverse): the classic homoglyph corruption.
 *   3. Quote-codepoint self-consistency — a named U+XXXX must match the glyph the
 *                              guide writes next to it. Highest-value check.
 *   4. Example distinctness  — a right/wrong example pair must not be byte-identical.
 *   5. Template completeness — the sections this half of the template owns, in order,
 *                              each with a `Sources:` footer, plus a `Status:` line in
 *                              the guide's header block.
 *   6. Nested quotation pair — the guide must show its inner quotation convention,
 *                              or opt out explicitly.
 *   7. Scrub law             — no AI vendor / model / tool names.
 *   8. Provenance honesty    — no audit-score self-certification.
 *   9. Dead relative links   — every relative markdown link resolves on disk.
 *
 * Opt-out markers. A guide may suppress a check where the finding is genuinely
 * legitimate, by carrying an HTML comment anywhere in the file:
 *
 *   <!-- lang-check: no-nested-quotes - <reason> -->
 *   <!-- lang-check: allow-zero-width - <reason> -->
 *   <!-- lang-check: allow-mixed-script <token> - <reason> -->
 *
 * A marker without a reason is itself an error: an opt-out is a documented decision,
 * not a mute button.
 *
 * ERROR must be fixed and exits non-zero. WARN needs a human look and does not.
 *
 * Dependency-free (Node core only) so it runs in CI without an install step.
 *
 * Usage:  node scripts/check-language-guide.mjs           # all guides
 *         node scripts/check-language-guide.mjs uk        # one guide
 *         VERBOSE=1 node scripts/check-language-guide.mjs # list green files too
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GUIDES_DIR = path.join(ROOT, 'directives', 'languages');

// ---------------------------------------------------------------------------
// Finding collection
// ---------------------------------------------------------------------------

/** @type {{file:string, line:number, level:'ERROR'|'WARN', check:string, msg:string}[]} */
const findings = [];
let currentFile = '';

const add = (level, check, line, msg) => findings.push({ file: currentFile, line, level, check, msg });
const err = (check, line, msg) => add('ERROR', check, line, msg);
const warn = (check, line, msg) => add('WARN', check, line, msg);

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const cp = (ch) => 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
/** "U+0027 (')" — codepoint plus the glyph, so a report is copy-pasteable. */
const show = (ch) => `${cp(ch)} (${ch})`;

/** Byte-offset -> 1-based line number, via a prefix table built once per file. */
function lineIndexer(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') starts.push(i + 1);
  return (offset) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

/** Replace a slice with spaces of equal length, so every offset stays valid. */
function blank(text, re) {
  return text.replace(re, (m) => m.replace(/[^\n]/g, ' '));
}

// ---------------------------------------------------------------------------
// Check 1 — encoding hygiene
// ---------------------------------------------------------------------------

// UTF-8 bytes read as Latin-1: the giveaway is a C3/C2 lead byte (rendered as
// U+00C3 / U+00C2) or an E2-80 sequence (rendered as "â€") followed by a
// continuation byte. Restricting the follower to U+0080..U+00BF keeps real
// Portuguese/French capitals ("Ambito", "Age" with circumflex) out of the net —
// those are always followed by plain ASCII.
const MOJIBAKE = [
  [/[ÃÂÅÐÑ][-¿]/gu, 'Latin-1 re-read of a UTF-8 two-byte sequence'],
  [/â[-¿™¦“”žš]/gu, 'Latin-1 re-read of a UTF-8 punctuation sequence'],
  [/â[-¿][-¿]/gu, 'Latin-1 re-read of a UTF-8 three-byte sequence'],
];

const ZERO_WIDTH = {
  '​': 'ZERO WIDTH SPACE',
  '‌': 'ZERO WIDTH NON-JOINER',
  '‍': 'ZERO WIDTH JOINER',
  '⁠': 'WORD JOINER',
  '﻿': 'ZERO WIDTH NO-BREAK SPACE',
};
// ZWNJ/ZWJ are load-bearing orthography in Indic, Arabic and Thai text; a guide
// that documents them is expected to contain them. The other three never are.
const JOINERS = new Set(['‌', '‍']);

// Spaces a guide may prescribe. They are invisible, which is the whole problem:
// a guide can spend a paragraph explaining that an ordinary space is wrong in
// some construction and then use one in every example, and nothing looks amiss.
// One guide named the narrow no-break space five times while containing zero of
// them. The quote-codepoint check cannot see this - these are single examples and
// pattern strings, not correct/incorrect pairs - so it needs its own check.
const SPACE_CPS = {
  '00A0': 'NO-BREAK SPACE',
  '202F': 'NARROW NO-BREAK SPACE',
  2007: 'FIGURE SPACE',
  2009: 'THIN SPACE',
  2060: 'WORD JOINER',
};

/**
 * `presence` is the whole guide - both halves concatenated - while `text` and `lineOf`
 * stay scoped to the file being reported on. The claim ("this guide prescribes U+202F")
 * and the evidence ("its examples use one") routinely sit in different halves: §3 states
 * the typography rule, §5 writes the numbers that obey it. Scoping the evidence to one
 * file turned that normal arrangement into five false positives the moment the split
 * landed.
 */
function checkSpaceCodepoints(text, lineOf, markers, presence = text) {
  for (const [hex, name] of Object.entries(SPACE_CPS)) {
    if (markers.has(`space-codepoint:${hex}`)) continue;
    const mentions = [...text.matchAll(new RegExp(`U\\+${hex}`, 'gi'))];
    if (!mentions.length) continue;
    if (presence.includes(String.fromCodePoint(parseInt(hex, 16)))) continue;
    warn(
      'space-codepoint',
      lineOf(mentions[0].index),
      `names U+${hex} (${name}) ${mentions.length}x but the file contains none. ` +
        `If the guide prescribes this character, its own examples are not using it - ` +
        `check them, or say the character is named rather than shown.`,
    );
  }
}

function checkEncoding(buf, text, lineOf, markers) {
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    err('encoding', 1, 'file starts with a UTF-8 BOM (EF BB BF) - strip it.');
  }
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buf);
  } catch {
    err('encoding', 1, 'file is not valid UTF-8.');
  }

  for (const m of text.matchAll(/�/gu)) {
    err('encoding', lineOf(m.index), `U+FFFD replacement character - a decode already failed here.`);
  }

  const nfc = text.normalize('NFC');
  if (nfc !== text) {
    // Report the first few differing positions with their codepoints rather than
    // "file is not NFC", which is unfixable advice.
    let reported = 0;
    for (let i = 0; i < text.length && reported < 5; i++) {
      if (text[i] !== nfc[i]) {
        const around = [...text.slice(Math.max(0, i - 1), i + 3)].map(show).join(' ');
        err('encoding', lineOf(i), `not NFC-stable near: ${around}`);
        reported++;
        // skip ahead so one decomposed cluster is not reported per code unit
        i += 3;
      }
    }
    if (reported === 0) err('encoding', 1, 'file is not NFC-stable (length differs after normalization).');
  }

  // A language guide is one of the few documents that legitimately PRINTS mojibake:
  // several guides teach their reader to recognise it ("flag mojibake: <sequence>").
  // A signature inside such an explanation is illustrative, not damage - so context
  // decides the level, and the finding is never silently dropped.
  const lines = text.split('\n');
  const teachesMojibake = (idx) => {
    const n = lineOf(idx) - 1;
    const ctx = lines.slice(Math.max(0, n - 3), n + 3).join(' ');
    return /mojibake|double[- ]encod|mis-?encod|Latin-1|non-UTF-8|not UTF-8|encoding/iu.test(ctx);
  };
  for (const [re, reason] of MOJIBAKE) {
    for (const m of text.matchAll(re)) {
      const label = `mojibake signature ${[...m[0]].map(show).join(' ')} - ${reason}`;
      if (teachesMojibake(m.index))
        warn('encoding', lineOf(m.index), `${label}; shown as an example, confirm it is deliberate.`);
      else err('encoding', lineOf(m.index), `${label}.`);
    }
  }

  const zwAllowed = markers.has('allow-zero-width');
  const namesJoiners = /\bZWN?J\b|U\+200C|U\+200D/u.test(text);
  const joinerTally = new Map();
  for (const m of text.matchAll(/\u200B|\u200C|\u200D|\u2060|\uFEFF/gu)) {
    if (m.index === 0) continue; // already reported as a BOM
    const ch = m[0];
    const label = `${show(ch)} ${ZERO_WIDTH[ch]}`;
    if (JOINERS.has(ch) && (zwAllowed || namesJoiners)) {
      // Eyelash-ra, Indic conjunct control and Arabic joining forms are orthography,
      // not litter. One aggregate line per character beats forty identical ones.
      const t = joinerTally.get(ch) || { n: 0, first: m.index };
      t.n++;
      joinerTally.set(ch, t);
    } else {
      err('encoding', lineOf(m.index), `stray zero-width character ${label}.`);
    }
  }
  for (const [ch, t] of joinerTally) {
    warn(
      'encoding',
      lineOf(t.first),
      `${t.n}x ${show(ch)} ${ZERO_WIDTH[ch]} - the guide documents this joiner, so it is presumed orthographic; spot-check it.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Check 2 — mixed-script tokens (homoglyph corruption)
// ---------------------------------------------------------------------------

const SCRIPTS = [
  ['Arabic', /\p{Script=Arabic}/u],
  ['Bengali', /\p{Script=Bengali}/u],
  ['Cyrillic', /\p{Script=Cyrillic}/u],
  ['Devanagari', /\p{Script=Devanagari}/u],
  ['Greek', /\p{Script=Greek}/u],
  ['Gurmukhi', /\p{Script=Gurmukhi}/u],
  ['Hangul', /\p{Script=Hangul}/u],
  ['Hebrew', /\p{Script=Hebrew}/u],
  ['Han', /\p{Script=Han}/u],
  ['Tamil', /\p{Script=Tamil}/u],
  ['Telugu', /\p{Script=Telugu}/u],
  ['Thai', /\p{Script=Thai}/u],
];
const scriptOf = (ch) => (SCRIPTS.find(([, re]) => re.test(ch)) || ['non-Latin'])[0];

const isLatin = (ch) => /\p{Script=Latin}/u.test(ch);
const isLetter = (ch) => /\p{L}/u.test(ch);
// Script-neutral for this check: combining marks, and letters whose script is
// Common or Inherited. The latter matters - U+02BC MODIFIER LETTER APOSTROPHE is a
// letter with no script of its own and is a full alphabetic character in Hausa, so
// counting it as "non-Latin" would report every Hausa word as a homoglyph.
const isNeutral = (ch) =>
  /\p{M}/u.test(ch) || (/\p{L}/u.test(ch) && /[\p{Script=Common}\p{Script=Inherited}]/u.test(ch));

// Latin acronyms that legitimately glue onto a native word with no hyphen. Kept as
// a documented list rather than "any uppercase run", so a new one is a decision.
const ACRONYM_OK = new Set([
  'AI',
  'ML',
  'LLM',
  'NLP',
  'API',
  'UI',
  'UX',
  'URL',
  'HTML',
  'CSS',
  'PDF',
  'CLDR',
  'ISO',
  'WCAG',
  'RTL',
  'LTR',
  'CPU',
  'GPU',
  'OCR',
  'TTS',
  'ASR',
  'IT',
  'ICT',
  'SMS',
  'DNA',
  'EU',
  'UN',
  'ID',
  'OK',
  'TV',
  'PC',
  'USB',
  'QR',
  'SEO',
  'CSV',
  'JSON',
  'XML',
]);

function checkMixedScript(prose, lineOf, markers) {
  const allowTokens = new Set(
    [...markers.entries()]
      .filter(([k]) => k.startsWith('allow-mixed-script'))
      .map(([k]) => k.split(/\s+/)[1])
      .filter(Boolean),
  );

  // A token is a maximal run of letters + combining marks. Hyphens, apostrophes and
  // digits therefore split tokens, which is exactly what makes a legitimate
  // hyphenated compound ("AI-<native word>") invisible to this check.
  for (const m of prose.matchAll(/[\p{L}\p{M}]+/gu)) {
    const token = m[0];
    if (token.length < 2) continue;
    const chars = [...token];
    const cls = chars.map((c) => (isNeutral(c) ? 'M' : isLatin(c) ? 'L' : isLetter(c) ? 'N' : 'M'));
    if (!cls.includes('L') || !cls.includes('N')) continue;
    if (allowTokens.has(token)) continue;

    const letters = cls.filter((c) => c !== 'M');
    const firstL = letters.indexOf('L');
    const lastL = letters.lastIndexOf('L');
    const firstN = letters.indexOf('N');
    const lastN = letters.lastIndexOf('N');

    // Interior intrusion: a letter of one script with letters of the other script on
    // BOTH sides. That is the homoglyph shape, and it is never a legitimate compound.
    const latinInterior = firstL > firstN && lastL < lastN;
    const nativeInterior = firstN > firstL && lastN < lastL;
    const foreign = chars.find((c) => !isNeutral(c) && (latinInterior ? isLatin(c) : !isLatin(c) && isLetter(c)));
    const other = chars.find((c) => !isNeutral(c) && (latinInterior ? !isLatin(c) && isLetter(c) : isLatin(c)));

    if (latinInterior || nativeInterior) {
      const script = scriptOf(latinInterior ? other : foreign);
      err(
        'mixed-script',
        lineOf(m.index),
        `"${token}" mixes scripts mid-word: ${show(foreign)} sits inside a ${script} run - probable homoglyph.`,
      );
      continue;
    }

    // Edge contact: a Latin run at the start or end of a native word, unhyphenated.
    // Legitimate for established acronyms; anything else wants a human look.
    const latinRun = token.match(/\p{Script=Latin}+/u)[0];
    if (ACRONYM_OK.has(latinRun.toUpperCase()) && latinRun === latinRun.toUpperCase()) continue;
    warn(
      'mixed-script',
      lineOf(m.index),
      `"${token}" glues Latin "${latinRun}" to ${scriptOf(chars.find((c) => isLetter(c) && !isLatin(c) && !isNeutral(c)))} with no hyphen - confirm it is intended.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Check 3 — quote-codepoint self-consistency
// ---------------------------------------------------------------------------

// Quotation and apostrophe characters a guide is likely to name a codepoint for.
const QUOTE_CPS = [
  0x0022, 0x0027, 0x00ab, 0x00bb, 0x2018, 0x2019, 0x201a, 0x201b, 0x201c, 0x201d, 0x201e, 0x201f, 0x2039, 0x203a,
  0x2e42, 0x300c, 0x300d, 0x300e, 0x300f, 0x3008, 0x3009, 0xff62, 0xff63, 0x02bb, 0x02bc, 0x02ee, 0x05f3, 0x05f4,
  0x2035, 0x2032,
];
const QUOTE_CHARS = new Set(QUOTE_CPS.map((c) => String.fromCodePoint(c)));

const CODE_RE = /U\+([0-9A-Fa-f]{4,6})/g;

// Codepoints that belong to one notation ("U+201C ... U+201D", "U+2018 / U+2019")
// may be separated by this much filler and still count as a single claim. A gap
// containing a quotation glyph is NOT filler - it means the glyphs are interleaved
// with the codes ("U+201C " / U+201D "), which is handled as two single claims.
const CODE_GAP =
  /^[\s,;/()…–—·*_-]*(?:open|close|opening|closing|start|end|and|or|resp\.?|to|inner|outer|left|right)?[\s,;/()…–—·*_-]*$/i;

/** Characters that may sit between a codepoint name and the glyph it labels. */
const ABUT_FILLER = /[\s*_()[\]:=\u00b7-]/u;

/**
 * Check 3 - quote-codepoint self-consistency.
 *
 * A guide that *names* U+201E and *writes* an ASCII " next to it is the defect
 * class that hit six guides at once. Three passes, deliberately ordered from the
 * least assumption-laden to the most:
 *
 *   3a  paragraph presence - a named quotation codepoint whose glyph appears
 *       nowhere in its own paragraph, while some other quotation glyph does, is
 *       a claim contradicted by the bytes right around it.
 *   3b  cluster ordering  - "GLYPH ... GLYPH (U+AAAA ... U+BBBB)" pair/triple
 *       notation: when the same line carries exactly as many glyphs as the
 *       cluster has codes, they must line up position by position. This is what
 *       catches a swapped open/close pair.
 *   3c  abutting glyph    - a lone codepoint with a typographic quotation glyph
 *       directly beside it ("<< U+00AB") must name that glyph.
 *
 * What it deliberately does NOT do: demand a glyph next to every codepoint. Prose
 * that names U+02BC without printing it is normal, correct writing.
 */
function checkQuoteCodepoints(text, lineOf) {
  const matches = [...text.matchAll(CODE_RE)];
  if (!matches.length) return;

  const glyphsIn = (s) => [...s].filter((ch) => QUOTE_CHARS.has(ch));
  const typographic = (list) => list.filter((ch) => ch !== '"' && ch !== "'");

  // Paragraph = a run of consecutive non-blank lines. Quotation rules are stated
  // across two or three wrapped lines far more often than on one.
  const paragraphs = [];
  {
    let start = 0;
    let inPara = false;
    const lines = text.split('\n');
    let offset = 0;
    for (const l of lines) {
      const blank = l.trim() === '';
      if (!inPara && !blank) {
        start = offset;
        inPara = true;
      } else if (inPara && blank) {
        paragraphs.push({ start, end: offset });
        inPara = false;
      }
      offset += l.length + 1;
    }
    if (inPara) paragraphs.push({ start, end: text.length });
  }
  const paragraphOf = (i) => paragraphs.find((p) => i >= p.start && i < p.end) || { start: 0, end: text.length };

  // Line helpers.
  const lineBounds = (i) => {
    const s = text.lastIndexOf('\n', i - 1) + 1;
    let e = text.indexOf('\n', i);
    if (e < 0) e = text.length;
    return [s, e];
  };

  // --- cluster the codepoint mentions ---------------------------------------
  const clusters = [];
  for (const m of matches) {
    const last = clusters[clusters.length - 1];
    if (last) {
      const gap = text.slice(last.end, m.index);
      if (gap.length <= 24 && !glyphsIn(gap).length && CODE_GAP.test(gap)) {
        last.codes.push(m[1]);
        last.end = m.index + m[0].length;
        continue;
      }
    }
    clusters.push({ start: m.index, end: m.index + m[0].length, codes: [m[1]] });
  }

  for (const c of clusters) {
    const chars = c.codes.map((h) => String.fromCodePoint(parseInt(h, 16)));
    if (!chars.every((ch) => QUOTE_CHARS.has(ch))) continue;

    const [ls, le] = lineBounds(c.start);
    const before = text.slice(ls, c.start);
    const after = text.slice(c.end, le).replace(CODE_RE, '      ');
    const gBefore = glyphsIn(before);
    const gAfter = glyphsIn(after);

    // --- 3b. pair / triple notation: equal counts on one side must line up. ---
    // Only for a genuine multi-code cluster, and only when the glyph run actually
    // abuts the cluster. Requiring adjacency is what keeps this from comparing a
    // cluster against some unrelated glyph that merely shares the line.
    let ordered = false;
    if (chars.length >= 2) {
      const abuts = (side) => {
        if (side.length !== chars.length) return false;
        const gap =
          side === gBefore
            ? before.slice(before.lastIndexOf(side[side.length - 1]) + 1)
            : after.slice(0, after.indexOf(side[0]));
        return gap.length <= 5 && [...gap].every((ch) => ABUT_FILLER.test(ch));
      };
      for (const side of [gBefore, gAfter]) {
        if (!abuts(side)) continue;
        ordered = true;
        for (let i = 0; i < chars.length; i++) {
          if (side[i] === chars[i]) continue;
          // Only report when the OTHER side does not vindicate the notation.
          const other = side === gBefore ? gAfter : gBefore;
          if (other.length === chars.length && other.every((g, k) => g === chars[k])) break;
          err(
            'quote-codepoint',
            lineOf(c.start),
            `pair notation is out of step at position ${i + 1}: the line writes ${show(side[i])} where it names ${show(chars[i])}.`,
          );
          break;
        }
        break;
      }
    }
    if (ordered) continue;

    // --- 3c. a lone code with a typographic glyph abutting it. ---------------
    if (chars.length === 1) {
      const nearest = (s, reverse) => {
        const arr = reverse ? [...s].reverse() : [...s];
        for (let i = 0; i < Math.min(arr.length, 4); i++) {
          if (QUOTE_CHARS.has(arr[i])) return { ch: arr[i], dist: i };
          if (!ABUT_FILLER.test(arr[i])) return null;
        }
        return null;
      };
      const b = nearest(before, true);
      const a = nearest(after, false);
      const cand = [b, a].filter(Boolean).sort((x, y) => x.dist - y.dist);
      const typo = cand.filter((x) => x.ch !== '"' && x.ch !== "'");
      if (typo.length) {
        if (!cand.some((x) => x.ch === chars[0])) {
          err(
            'quote-codepoint',
            lineOf(c.start),
            `writes ${show(typo[0].ch)} directly beside a claim of ${show(chars[0])} - glyph and codepoint disagree.`,
          );
          continue;
        }
        continue;
      }
    }

    // --- 3a. paragraph presence (WARN only) -----------------------------------
    // Weakest of the three and deliberately not an ERROR: a paragraph can name a
    // codepoint for perfectly good reasons without printing it (a census of an
    // external page, a rule stated in words). It earns a WARN when a paragraph
    // shows typographic quotation glyphs yet not the one it names - the shape of
    // a mismatch, but not proof of one.
    const para = paragraphOf(c.start);
    const paraGlyphs = glyphsIn(text.slice(para.start, para.end).replace(CODE_RE, '      '));
    const missing = chars.filter((ch) => !paraGlyphs.includes(ch));
    if (!missing.length) continue;
    if (!typographic(paraGlyphs).length) continue;
    if (!typographic(missing).length) continue;
    warn(
      'quote-codepoint',
      lineOf(c.start),
      `names ${missing.map(show).join(', ')} but the surrounding paragraph writes only ${[...new Set(paraGlyphs)].map(show).join(' ')} - confirm the claim matches the bytes.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Check 4 — right/wrong example distinctness
// ---------------------------------------------------------------------------

const YES = '✅';
const NO = '❌';
const LABELS =
  /^\s*(?:right|wrong|correct|incorrect|avoid|good|bad|yes|no|do|don'?t|default|better|worse|preferred|idiomatic|literal(?:\s+calque)?|calque|native|editorial|ok)\b\s*[:—–-]?\s*/i;

/**
 * Ordinary spacing only. The exact space codepoint is the LESSON in several of these
 * guides — French sets U+202F inside its guillemets, and the ❌ twin of that example is
 * the same words with a plain U+0020 — so folding every whitespace character together
 * reported a correct pair as "byte-identical" and failed the build. Runs of ordinary
 * space still collapse, so incidental spacing is still ignored; a no-break, narrow or
 * thin space now survives as itself.
 *
 * This only ever showed up on an LF checkout (CI, Linux, and this repo since
 * .gitattributes): with CRLF the bullet-continuation lines concatenate differently and
 * the two segments never met.
 */
const ORDINARY_SPACE = /[ \t\r\n\u00b7]+/gu;
const trimOrdinary = (s) => s.replace(/^[ \t\r\n]+|[ \t\r\n]+$/gu, '');

/** Reduce an example to the thing being demonstrated, so only real duplicates match. */
function exampleCore(segment) {
  let s = segment.replace(/^[\s✅❌]+/u, '');
  s = s.replace(/[*_~`]/gu, '');
  for (let i = 0; i < 2; i++) s = s.replace(LABELS, '');
  s = s.replace(/\s*\([^()]*\)\s*/gu, ' '); // parenthetical commentary
  s = s.replace(/\s+[—–]\s+.*$/u, ''); // em-dash commentary tail
  s = trimOrdinary(s.replace(ORDINARY_SPACE, ' '));
  s = trimOrdinary(s.replace(/^[.,;:·]+|[.,;:·]+$/gu, ''));
  return s;
}

function checkExamplePairs(prose, lineOf) {
  const lines = prose.split('\n');
  let offset = 0;
  const offsets = lines.map((l) => {
    const o = offset;
    offset += l.length + 1;
    return o;
  });

  const compare = (aSeg, bSeg, lineNo) => {
    const a = exampleCore(aSeg);
    const b = exampleCore(bSeg);
    if (!a || a.length < 3) return;
    if (a !== b) return;
    if (!/\p{L}|\p{N}|["'‘-‟«»]/u.test(a)) return;
    err(
      'example-pair',
      lineNo,
      `the correct and the incorrect example are byte-identical ("${a.slice(0, 60)}") - the pair demonstrates nothing.`,
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const hasYes = line.includes(YES);
    const hasNo = line.includes(NO);

    if (hasYes && hasNo) {
      // Split the line at every marker; compare neighbouring segments of opposite sign.
      const marks = [];
      for (let j = 0; j < line.length; j++) {
        if (line[j] === YES || line[j] === NO) marks.push({ at: j, sign: line[j] });
      }
      for (let k = 0; k + 1 < marks.length; k++) {
        if (marks[k].sign === marks[k + 1].sign) continue;
        const segA = line.slice(marks[k].at, marks[k + 1].at);
        const segB = line.slice(marks[k + 1].at, marks[k + 2] ? marks[k + 2].at : line.length);
        compare(segA, segB, lineOf(offsets[i]));
      }
      continue;
    }

    if (!hasYes) continue;
    // Bullet form: a positive line, then a negative one within the next few lines.
    for (let j = i + 1; j < Math.min(lines.length, i + 4); j++) {
      if (lines[j].includes(YES)) break;
      if (!lines[j].includes(NO)) continue;
      // Continuation lines (indented, no marker) belong to their bullet.
      let a = lines[i];
      for (let k = i + 1; k < j && /^\s{2,}\S/.test(lines[k]); k++) a += ' ' + lines[k].trim();
      let b = lines[j];
      for (let k = j + 1; k < lines.length && /^\s{2,}\S/.test(lines[k]); k++) b += ' ' + lines[k].trim();
      compare(a.slice(a.indexOf(YES)), b.slice(b.indexOf(NO)), lineOf(offsets[i]));
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Check 5 — template completeness
// ---------------------------------------------------------------------------

const SECTION_TITLES = {
  1: 'Header block',
  2: 'Authorities & primary sources',
  3: 'Script & typography',
  4: 'Grammar for translators',
  5: 'Numbers, dates, currency',
  6: 'Terminology strategy',
  7: 'Idiom anti-patterns',
  8: 'Simplified-language pendant',
  9: 'Regional variation',
  10: 'Technical integration checklist',
  11: 'Verification additions',
};

// The eleven-section template is split across two files by *when* a reader needs a
// section, not by what kind of content it is. Six sections are consulted on every
// translation job; four are read once, when a language is added or verified, and
// carrying them into every job cost roughly 43% of each file for nothing.
//
// Section numbers are deliberately NOT reassigned. The corpus already contains ~160
// prose cross-references of the form "see §3" / "the §2 authorities", none of them
// markdown links; they all stay correct exactly as long as a section keeps the number
// it was written with. Renumbering would have silently inverted every one of them.
const GUIDE_SECTIONS = [1, 4, 5, 6, 7, 8, 9];
const SETUP_SECTIONS = [2, 3, 10, 11];

/** @returns {{n:number, title:string, start:number, end:number, body:string}[]} */
function splitSections(text) {
  const heads = [...text.matchAll(/^## +(\d+)\. +(.+?)\s*$/gmu)];
  return heads.map((h, i) => ({
    n: Number(h[1]),
    title: h[2],
    start: h.index,
    end: i + 1 < heads.length ? heads[i + 1].index : text.length,
    body: text.slice(h.index, i + 1 < heads.length ? heads[i + 1].index : text.length),
  }));
}

function checkTemplate(text, lineOf, sections, isSetup) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const expect = isSetup ? SETUP_SECTIONS : GUIDE_SECTIONS;
  const half = isSetup ? 'setup file' : 'guide';

  for (let i = 0; i < expect.length; i++) {
    const n = expect[i];
    const want = SECTION_TITLES[n];
    const got = sections[i];
    if (!got) {
      err('template', 1, `section ${n} "${want}" is missing from the ${half}.`);
      continue;
    }
    if (got.n !== n) {
      // A section landing in the wrong half is the migration's characteristic failure,
      // so name where it belongs rather than only that the order is wrong.
      const belongs = (isSetup ? GUIDE_SECTIONS : SETUP_SECTIONS).includes(got.n)
        ? ` — section ${got.n} belongs in the ${isSetup ? 'guide' : 'setup file'}`
        : '';
      err(
        'template',
        lineOf(got.start),
        `section out of order: found "## ${got.n}. ${got.title}" where section ${n} was expected${belongs}.`,
      );
      continue;
    }
    if (!norm(got.title).startsWith(norm(want))) {
      err('template', lineOf(got.start), `section ${n} is titled "${got.title}"; the template says "${want}".`);
    }
  }
  if (sections.length > expect.length) {
    for (const extra of sections.slice(expect.length)) {
      warn(
        'template',
        lineOf(extra.start),
        `extra numbered section "## ${extra.n}. ${extra.title}" beyond this half of the eleven-section template.`,
      );
    }
  }

  const header = sections.length ? text.slice(0, sections[0].start) : text;
  // "Sources:" and the tiered variant "Sources (community-tier):" both count.
  const SOURCES_FOOTER = /^\s*(?:\*\*)?Sources?\b(?:\s*\([^)]{0,240}\))?\s*:/mu;
  const headerHasSources = SOURCES_FOOTER.test(header);

  for (const s of sections.slice(0, expect.length)) {
    if (SOURCES_FOOTER.test(s.body)) continue;
    // Section 1 is by convention a back-reference to the header block above it; the
    // header carries the evidence footer, so that counts.
    if (s.n === 1 && headerHasSources) continue;
    err('template', lineOf(s.start), `section ${s.n} "${s.title}" has no "Sources:" footer.`);
  }

  // Status belongs to the guide, which is the half that carries the header block and
  // therefore the half whose maturity a reader is deciding about. Requiring it on the
  // setup file too would only produce two copies to drift apart.
  if (!isSetup && !/^\s*\*\*Status:?\*\*/mu.test(header) && !/^\s*\*\*Status[^*]*:\*\*/mu.test(header)) {
    err('template', 1, 'the header block has no "**Status:**" line - guide maturity must be stated, not implied.');
  }
}

// ---------------------------------------------------------------------------
// Check 6 — nested quotation pair
// ---------------------------------------------------------------------------

// The guides are written in English, so English wording carries most of the signal.
// The last few entries are phrasings that occur inside the verbatim quotes the guides
// take from their own national authorities - a documented list, extended when a new
// guide states the rule in its own language.
const NESTED_RE =
  /nested|\binner\b|second[- ]level|quotes? within|quote[- ]within[- ]a[- ]quote|quot\w* inside|embedded quot|polunavodnic|citaat binnen|innere? Anf|лапки-ла/iu;

function checkNestedQuotes(text, lineOf, markers) {
  if (markers.has('no-nested-quotes')) return;

  const lines = text.split('\n');
  let offset = 0;
  const offsets = lines.map((l) => {
    const o = offset;
    offset += l.length + 1;
    return o;
  });

  let sawKeyword = false;
  let asciiOnlyLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (!NESTED_RE.test(lines[i])) continue;
    // "inner"/"nested" also turn up in grammar and font prose; require quotation
    // context in the immediate neighbourhood before treating the line as a claim.
    const ctx = lines.slice(Math.max(0, i - 2), i + 3).join(' ');
    if (!/quot|navodnik|лапк|aanhaling|guillemet|따옴표|„|“|”|«|»|‘|’/iu.test(ctx)) continue;
    sawKeyword = true;
    // Scope is the claim line itself. A pair shown three lines away belongs to some
    // other rule - that is precisely how an ASCII nested pair stayed invisible in a
    // guide whose OUTER pair, on a neighbouring line, was written correctly.
    let glyphs = [...lines[i]].filter((ch) => QUOTE_CHARS.has(ch));
    if (!glyphs.length && i + 1 < lines.length) {
      glyphs = [...lines[i + 1]].filter((ch) => QUOTE_CHARS.has(ch));
    }
    if (!glyphs.length) continue;
    const ascii = glyphs.some((ch) => ch === '"' || ch === "'");
    // A clean claim shows typographic marks and no ASCII stand-in on the same line.
    // "nested: <<text 'inside' text>>" is the exact shape that has to keep failing:
    // the outer pair is right, the inner one is an ASCII apostrophe.
    if (!ascii && glyphs.length) return;
    if (ascii && asciiOnlyLine < 0) asciiOnlyLine = i;
  }

  const optOut = 'or opt out with <!-- lang-check: no-nested-quotes - reason -->';
  if (asciiOnlyLine >= 0) {
    err(
      'nested-quotes',
      lineOf(offsets[asciiOnlyLine]),
      `the nested/inner quotation pair is written with ASCII " or ' only - state the real codepoints, ${optOut}.`,
    );
  } else if (!sawKeyword) {
    err(
      'nested-quotes',
      1,
      `no nested/inner quotation convention is shown anywhere - add the sourced inner pair, ${optOut}.`,
    );
  } else {
    err(
      'nested-quotes',
      1,
      `nested quotation is mentioned but no quotation glyph is ever shown for it - add the sourced inner pair, ${optOut}.`,
    );
  }
}

// ---------------------------------------------------------------------------
// Check 7 — scrub law
// ---------------------------------------------------------------------------

// This array IS the denylist, so it necessarily spells out the terms it forbids -
// the same convention check-genericity.mjs uses for its generic denylist. Matching is
// word-bounded on purpose: real words in the corpus contain these letter sequences
// as substrings (Finnish "lopussa", Turkish "Bardaktan"), and a substring match
// would bury the real findings in noise.
const VENDOR_TERMS = [
  'claude',
  'anthropic',
  'fable',
  'opus',
  'sonnet',
  'haiku',
  'gemini',
  'perplexity',
  'openai',
  'gpt',
  'copilot',
  'chatgpt',
  'grok',
];
const VENDOR_RE = new RegExp(`(?<![\\p{L}\\p{N}])(?:${VENDOR_TERMS.join('|')})(?![\\p{L}\\p{N}])`, 'giu');

// Documented exceptions: contexts where the bare word is not a vendor reference.
const VENDOR_ALLOW = [
  /\bopus\b(?=\s*(?:no\.|number|\d))/i, // musical work numbering
  /magnum opus/i,
];

function checkScrub(text, lineOf) {
  for (const m of text.matchAll(VENDOR_RE)) {
    const ctx = text.slice(Math.max(0, m.index - 30), m.index + 30);
    if (VENDOR_ALLOW.some((re) => re.test(ctx))) continue;
    err(
      'scrub',
      lineOf(m.index),
      `vendor/model name "${m[0]}" - the kit is vendor-neutral. Context: ...${ctx.replace(/\n/g, ' ').trim()}...`,
    );
  }
}

// ---------------------------------------------------------------------------
// Check 8 — provenance honesty
// ---------------------------------------------------------------------------

const SELF_CERT = [
  [/independently\s+audited/iu, 'audit self-certification'],
  [/full\s+quote[-\s]?compliance/iu, 'quote-compliance self-score'],
  [/\bquote[-\s]?compliance\s*[:=]?\s*(?:100|full)/iu, 'quote-compliance self-score'],
  [/\b(?:0|zero|no)\s+fabrication/iu, 'fabrication self-score'],
  [/\b100\s*%\s*(?:verified|sourced|accurate|quote)/iu, 'verification self-score'],
  [/\bfully\s+verified\b/iu, 'verification self-score'],
  [/\baudit\s+score\b/iu, 'audit self-score'],
  [/\bpassed\s+(?:an?\s+)?independent\s+audit/iu, 'audit self-certification'],
  [/\bfabrication[- ]free\b/iu, 'fabrication self-score'],
];
// The kit-standard process phrase describes what was DONE, claims no score, and is
// explicitly legitimate.
const PROCESS_OK = /independently\s+reviewed\s+against\s+(?:its|the)\s+cited\s+sources/iu;

function checkProvenance(text, lineOf) {
  const lines = text.split('\n');
  let offset = 0;
  for (const line of lines) {
    // Blank the legitimate process phrase rather than exempting the whole line -
    // a self-awarded score sitting in the same sentence must still be caught.
    const scanned = line.replace(new RegExp(PROCESS_OK.source, 'giu'), (m) => ' '.repeat(m.length));
    for (const [re, reason] of SELF_CERT) {
      const m = scanned.match(re);
      if (m)
        err(
          'provenance',
          lineOf(offset + m.index),
          `${reason}: "${m[0]}" - state what was done, never a self-awarded score.`,
        );
    }
    offset += line.length + 1;
  }
}

// ---------------------------------------------------------------------------
// Check 9 — dead relative links
// ---------------------------------------------------------------------------

function checkLinks(text, lineOf, filePath) {
  const dir = path.dirname(filePath);
  const seen = new Set();
  for (const m of text.matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/gu)) {
    let target = m[1].trim();
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(target)) continue;
    target = target.replace(/#.*$/, '');
    if (!target) continue;
    const resolved = path.resolve(dir, decodeURIComponent(target));
    const key = `${lineOf(m.index)}:${target}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (!fs.existsSync(resolved)) {
      err(
        'dead-link',
        lineOf(m.index),
        `relative link "${target}" does not resolve (${path.relative(ROOT, resolved)}).`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Markers
// ---------------------------------------------------------------------------

function parseMarkers(text, lineOf) {
  const markers = new Map();
  for (const m of text.matchAll(/<!--\s*lang-check:\s*([^>]*?)\s*-->/gu)) {
    const raw = m[1].trim();
    const split = raw.split(/\s+[-–—]\s+/);
    const key = split[0].trim();
    const reason = split.slice(1).join(' - ').trim();
    if (!reason) {
      err('marker', lineOf(m.index), `opt-out marker "${key}" has no reason - an opt-out is a documented decision.`);
    }
    markers.set(key, reason);
    // "allow-mixed-script <token>" is also addressable by its bare verb.
    const verb = key.split(/\s+/)[0];
    if (!markers.has(verb)) markers.set(verb, reason);
  }
  return markers;
}

// ---------------------------------------------------------------------------
// Per-file driver
// ---------------------------------------------------------------------------

function checkGuide(filePath) {
  currentFile = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const isSetup = filePath.endsWith('.setup.md');
  const buf = fs.readFileSync(filePath);
  const text = buf.toString('utf8').replace(/^\uFEFF/, '');
  const lineOf = lineIndexer(text);

  // Views. Offsets are preserved everywhere: blanked spans keep their length.
  const noFences = blank(text, /^```[\s\S]*?^```/gmu);
  const noUrls = blank(noFences, /<https?:\/\/[^>\s]+>|\bhttps?:\/\/[^\s)>\]]+/gu);
  const prose = blank(noUrls, /`[^`\n]*`/gu);

  const markers = parseMarkers(text, lineOf);

  // The other half of this guide, for the checks whose evidence is guide-wide rather
  // than file-wide. Absent for a guide that has not been split.
  const companionPath = isSetup ? filePath.replace(/\.setup\.md$/, '.md') : filePath.replace(/\.md$/, '.setup.md');
  const companion = fs.existsSync(companionPath) ? fs.readFileSync(companionPath, 'utf8') : '';

  checkEncoding(buf, text, lineOf, markers);
  checkMixedScript(prose, lineOf, markers);
  checkQuoteCodepoints(noUrls, lineOf);
  checkSpaceCodepoints(noUrls, lineOf, markers, text + companion);
  checkExamplePairs(noFences, lineOf);
  checkTemplate(text, lineOf, splitSections(text), isSetup);
  // The quotation convention is stated in §3 Script & typography, which lives in the
  // setup half. Running this against the guide half would demand the rule be restated
  // where it does not belong - and two copies of a codepoint claim is exactly the
  // drift this check exists to catch.
  if (isSetup) checkNestedQuotes(noUrls, lineOf, markers);
  // Scrub reads `noUrls`, not `prose`: the scrub law admits no exception for
  // formatting, and a vendor name is at its most plausible-looking inside code
  // ticks, where it reads as a technical token rather than a brand. A model
  // acronym reached a committed guide exactly that way while this check was
  // reading the inline-code-blanked view. URLs stay excluded because the
  // allowed font URLs are the only vendor-shaped strings among them.
  checkScrub(noUrls, lineOf);
  checkProvenance(noFences, lineOf);
  checkLinks(text, lineOf, filePath);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const arg = process.argv[2];
let files = fs
  .readdirSync(GUIDES_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map((f) => path.join(GUIDES_DIR, f));

if (arg) {
  // A bare language code selects BOTH halves - they are one guide, and a check run
  // that silently covered half of it would be worse than no run at all.
  const wanted = arg.endsWith('.md')
    ? [path.join(GUIDES_DIR, arg)]
    : [path.join(GUIDES_DIR, `${arg}.md`), path.join(GUIDES_DIR, `${arg}.setup.md`)];
  const found = wanted.filter((f) => fs.existsSync(f));
  if (!found.length) {
    console.error(`check-language-guide: no guide at directives/languages/${path.basename(wanted[0])}`);
    process.exit(2);
  }
  files = found;
} else if (!files.length) {
  // Silent-pass guard: the default (no-arg) run used to have no floor at all - an
  // empty/renamed GUIDES_DIR would run the loop over nothing and still print
  // "0 error(s), 0 warning(s) across 0 guide(s)... PASS". That is 62 language
  // guides going unchecked while the gate reports clean.
  console.error(`check-language-guide: found 0 .md files under ${GUIDES_DIR} - the gate would check nothing.`);
  process.exit(2);
}

for (const f of files) checkGuide(f);

const line = '='.repeat(74);
console.log(line);
const guideCount = files.filter((f) => !f.endsWith('.setup.md')).length;
const setupCount = files.length - guideCount;
console.log(`  check-language-guide - ${guideCount} guide(s) + ${setupCount} setup file(s), 9 deterministic checks`);
console.log(line);

const errors = findings.filter((f) => f.level === 'ERROR');
const warns = findings.filter((f) => f.level === 'WARN');
const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  const list = byFile.get(rel);
  if (!list) {
    if (process.env.VERBOSE) console.log(`  ok   ${rel}`);
    continue;
  }
  console.log(`\n  ${rel}`);
  for (const item of list.sort((a, b) => a.line - b.line)) {
    console.log(`    ${item.level.padEnd(5)} ${String(item.line).padStart(5)}  [${item.check}] ${item.msg}`);
  }
}

const tally = (list) => {
  const counts = new Map();
  for (const f of list) counts.set(f.check, (counts.get(f.check) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
};

console.log('\n' + line);
if (errors.length) console.log(`  ERROR by check: ${tally(errors)}`);
if (warns.length) console.log(`  WARN  by check: ${tally(warns)}`);
console.log(`  ${errors.length} error(s), ${warns.length} warning(s) across ${files.length} guide(s).`);
console.log(line);

if (errors.length) {
  console.log('  FAIL - fix every ERROR. WARN entries need a human decision, not a mute.');
  process.exit(1);
}
console.log('  PASS - guides are mechanically clean. Fidelity to sources still needs a reader.');
process.exit(0);
