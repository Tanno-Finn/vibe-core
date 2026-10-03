/**
 * locale-fallback.mjs — the build scripts' door to the language rules.
 *
 * Every builder that resolves per-locale content (content bundles, glossary,
 * i18n) must derive its fallback order and its language lists from here instead
 * of hardcoding a language. The old hardcoded content chain (`<lang>` -> `de` ->
 * `en`) shipped German content inside the English Easy-Language bundle, because
 * German was tried before English for *every* locale — including `en-easy`.
 *
 * Nothing is decided in this file. The data is `src/config/languages.json`, the
 * rules are `src/config/language-rules.mts` — the SAME module the Angular app runs
 * (Node strips its types on import; the .mts extension makes it an ES module
 * without the reparse warning a typeless .ts would cost), so the app and the build cannot disagree
 * about which locales exist or how one falls back. CommonJS scripts reach this
 * module with `require('./lib/locale-fallback.mjs')` (require(esm), Node >= 22).
 *
 * ## The content rules (contentFallbackChain)
 *
 * 1. A locale always tries itself first.
 * 2. An Easy-Language variant (`xx-easy`) then tries its OWN base language
 *    (`xx`). Easy Language is an accessibility register, not a language: an
 *    `en-easy` reader reads English. Never another language first.
 * 3. Only when neither exists does the chain cross a language boundary, and
 *    then only to the content reference language (`contentReferenceLanguage`) —
 *    the tree that is by definition the most complete. This is the deliberate
 *    LAST resort: keeping the entry (in the wrong language) beats dropping it,
 *    because a dropped entry breaks cross-references (an article citing a
 *    source that no longer exists in the bundle) — but it is never silent.
 *    Builders warn, and `scripts/check-content-coverage.mjs` turns it into a
 *    build error.
 * 4. A NON-easy locale never falls back to an Easy-Language file. Easy Language
 *    is a different register; rendering it inside a standard page is wrong, and
 *    it would mask a missing standard translation.
 *
 * Example chains for the shipped four locales:
 *   de       -> [de]
 *   en       -> [en, de]
 *   de-easy  -> [de-easy, de]
 *   en-easy  -> [en-easy, en, de, de-easy]
 *
 * UI strings (src/assets/i18n) use a different chain that ends in the
 * key-source language instead — see `i18nFallbackChain` in language-rules.mts.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLanguageRules } from '../../src/config/language-rules.mts';

const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const CONFIG_PATH = join(REPO_ROOT, 'src', 'config', 'languages.json');

/** Raw languages.json (single source of truth). */
export function loadLanguagesConfig(configPath = CONFIG_PATH) {
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

/** The derived rules — throws on an inconsistent languages.json. */
export const RULES = createLanguageRules(loadLanguagesConfig());

/** 'de' | 'en' — base language codes, no easy variants. */
export const BASE_LANGUAGES = RULES.baseLanguages;

/** 'de-easy' | 'en-easy' — the easy variant of each base language. */
export const EASY_LANGUAGES = RULES.easyLanguages;

/** Every locale the kit ships, base + easy, in config order. */
export const ALL_LOCALES = RULES.allLocales;

/** Site default language (redirects, x-default). */
export const DEFAULT_LANGUAGE = RULES.defaultLanguage;

/** Canonical UI-string key source (check-i18n-keys reference, last UI fallback). */
export const KEY_SOURCE_LANG = RULES.keySourceLanguage;

/** The content reference language — the last resort of every content chain. */
export const REFERENCE_LANG = RULES.contentReferenceLanguage;

/** SEO-enabled base languages: [{ code, hreflang, prerenderTier, ... }]. */
export const SEO_LANGUAGES = RULES.seoLanguages;

/** Is this locale an Easy-Language variant? */
export const isEasyLocale = RULES.isEasyLocale;

/** The base language of a locale: 'en-easy' -> 'en', 'de' -> 'de'. */
export const baseLanguageOf = RULES.baseLanguageOf;

/** The ordered CONTENT fallback chain for a locale. Index 0 is the locale itself. */
export const fallbackChain = RULES.contentFallbackChain;

/** The ordered UI-STRING fallback chain for a locale. */
export const i18nFallbackChain = RULES.i18nFallbackChain;

/**
 * Did resolving `locale` to `usedLocale` cross a language boundary?
 * `en-easy` -> `en` is fine (same language, different register).
 * `en-easy` -> `de` is the D1 bug: content in a language the reader did not ask
 * for, served to the audience least able to cope with it.
 */
export const isCrossLanguage = RULES.isCrossLanguage;
