/**
 * hashed-denylist.mjs — a denylist that does not spell out what it denies.
 *
 * Some gate entries are identities: a brand, a person, a publisher. Listing them in
 * plain text in a file that ships publicly would republish exactly the thing the gate
 * keeps out. So those entries are stored as salted SHA-256 digests of a normalised
 * phrase, and the scanned text is normalised the same way, cut into word-anchored
 * slices of the stored lengths, hashed, and compared.
 *
 * What this is and is not: it keeps the names out of the source, out of grep and out
 * of search indexes. It is not a secret — anyone holding a candidate name can hash it
 * and compare, and short names can be guessed from a dictionary. It hides, it does not
 * protect.
 *
 * Normalisation (canonical()):
 *   - Unicode NFKC, then German umlauts folded to their two-letter spellings (the
 *     umlaut and the "e" spelling of a name hash alike), then any other diacritic
 *     stripped;
 *   - optionally lowercased (`fold`), for entries that match case-insensitively;
 *   - every run of characters that is neither a letter nor a digit becomes one space,
 *     so "A-B", "A  B" and "A B" are the same two-word phrase.
 *
 * Matching (per entry): a slice of the canonical text that starts at a word start and
 * has the entry's canonical length is hashed. `suffix: 'word'` additionally requires the
 * slice to end at a word end; `suffix: 'any'` lets it run into more letters, which is
 * what catches inflected forms ("-s", "-e", "-en") and compounds that follow the name.
 * Word n-grams fall out of the same rule, because a phrase with spaces is just a longer
 * slice.
 */

import { createHash } from 'node:crypto';

/** Public on purpose — the salt stops precomputed tables, not a determined reader. */
export const SALT = 'vibe-core:check-genericity:v1';

const UMLAUTS = { ä: 'ae', ö: 'oe', ü: 'ue', Ä: 'Ae', Ö: 'Oe', Ü: 'Ue', ß: 'ss', ẞ: 'SS' };

/** The canonical form both the stored phrases and the scanned text are reduced to. */
export function canonical(text, fold) {
  let s = String(text).normalize('NFKC');
  if (fold) s = s.toLowerCase();
  s = s.replace(/[äöüÄÖÜßẞ]/gu, (c) => UMLAUTS[c]);
  s = s.normalize('NFD').replace(/\p{M}+/gu, '');
  return s.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

/** Salted SHA-256 of an already-canonical phrase. */
export function digest(canonicalPhrase) {
  return createHash('sha256').update(`${SALT}\u0000${canonicalPhrase}`).digest('hex');
}

/**
 * Builds an entry from a plain phrase. Used by the selftest and by whoever adds an
 * entry (run it once in a REPL, paste the printed object, never commit the phrase).
 */
export function entryFor(phrase, { fold = true, suffix = 'any' } = {}) {
  const c = canonical(phrase, fold);
  return { sha256: digest(c), length: c.length, fold, suffix };
}

// One-value memo: a gate runs several matchers over the same value in a row, and the
// canonical form is the expensive part.
let memoText;
const memoForms = new Map();
function canonicalMemo(text, fold) {
  if (text !== memoText) {
    memoText = text;
    memoForms.clear();
  }
  let s = memoForms.get(fold);
  if (s === undefined) {
    s = canonical(text, fold);
    memoForms.set(fold, s);
  }
  return s;
}

/**
 * A matcher over a list of stored entries, shaped like a RegExp (`test(text)`) so it
 * slots into the same denylist tables. Digests are cached per slice, across matchers:
 * i18n text repeats the same words thousands of times.
 */
const digestCache = new Map();
function hashOf(slice) {
  let h = digestCache.get(slice);
  if (h === undefined) {
    h = digest(slice);
    digestCache.set(slice, h);
  }
  return h;
}

export function hashedMatcher(entries) {
  for (const e of entries) {
    if (!/^[0-9a-f]{64}$/u.test(e.sha256) || !(e.length > 0) || !['any', 'word'].includes(e.suffix)) {
      throw new Error(`hashed-denylist: malformed entry ${JSON.stringify(e)}`);
    }
  }
  return {
    test(text) {
      for (const e of entries) {
        const s = canonicalMemo(text, e.fold);
        for (let i = 0; i + e.length <= s.length; i = s.indexOf(' ', i) + 1 || s.length) {
          const end = i + e.length;
          if (e.suffix === 'word' && end < s.length && s[end] !== ' ') continue;
          if (hashOf(s.slice(i, end)) === e.sha256) return true;
        }
      }
      return false;
    },
  };
}
