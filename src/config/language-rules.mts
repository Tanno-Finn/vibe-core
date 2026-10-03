/**
 * Language rules — the ONE implementation of "which locales exist and how a
 * locale falls back", shared by the Angular app and the Node build scripts.
 *
 * The data lives in `languages.json`; this file only turns it into lists and
 * chains. It has no imports on purpose: the app loads it through
 * `src/config/languages.ts` (which passes the imported JSON in), and the build
 * scripts load it directly (`scripts/lib/locale-fallback.mjs` imports this file
 * and Node strips the types; `.mts` makes it an ES module outright, so Node does
 * not have to guess and warn). Keep it to erasable TypeScript: no enums, no
 * namespaces, no parameter properties, no imports.
 *
 * ## Three named languages, three different jobs
 *
 * - `defaultLanguage` — the SITE default: where a visitor with nothing to go on
 *   lands (bare-URL redirect, hreflang x-default, the signal before detection).
 * - `keySourceLanguage` — the canonical source of the UI string keys and the
 *   last resort of the UI-string chain ({@link LanguageRules.i18nFallbackChain}).
 * - `contentReferenceLanguage` — the most complete CONTENT tree and the last
 *   resort of the content chain ({@link LanguageRules.contentFallbackChain}).
 *
 * They used to be one blurred idea: a comment said German was the last resort
 * while the code fell back to English, and x-default was a literal '/de'.
 */

export interface LanguageEntry {
  code: string;
  easyCode: string;
  name: string;
  nativeName: string;
  easyName: string;
  easyNativeName: string;
  /** Flag sprite key (src/assets/images/flags). */
  flag: string;
  /** BCP 47 tag for hreflang. */
  hreflang: string;
  /** Full locale with region, e.g. de-DE — og:locale (as de_DE). */
  locale: string;
  /** true = own URL prefix, sitemap entry, hreflang alternate. */
  seo: boolean;
  /** Prerender depth when `seo` is on: 1 full, 2 home + hubs, 3 home only. */
  prerenderTier?: 1 | 2 | 3;
}

export interface LanguagesConfig {
  defaultLanguage: string;
  keySourceLanguage: string;
  contentReferenceLanguage: string;
  languages: LanguageEntry[];
}

export interface LanguageRules {
  readonly config: LanguagesConfig;
  readonly defaultLanguage: string;
  readonly keySourceLanguage: string;
  readonly contentReferenceLanguage: string;
  /** 'de', 'en' — base codes, no easy variants. Also the valid URL prefixes. */
  readonly baseLanguages: string[];
  /** 'de-easy', 'en-easy'. */
  readonly easyLanguages: string[];
  /** Every locale, base + easy, in config order. */
  readonly allLocales: string[];
  /** Base languages that get a URL prefix, sitemap entry and hreflang. */
  readonly seoLanguages: LanguageEntry[];
  isKnownLocale(locale: string): boolean;
  isEasyLocale(locale: string): boolean;
  /** 'en-easy' -> 'en', 'de' -> 'de'. Unknown codes degrade to a stripped suffix. */
  baseLanguageOf(locale: string): string;
  /** 'de' -> 'de-easy'; null for a code the config does not know. */
  easyVariantOf(locale: string): string | null;
  /**
   * Missing UI string (src/assets/i18n): the locale, then — for an easy variant —
   * its own base language, then the key-source language. Index 0 is the locale.
   *   de -> [de, en]   de-easy -> [de-easy, de, en]   en-easy -> [en-easy, en]
   * An easy variant never reaches another language before its own base; a base
   * language never falls into an Easy-Language register.
   */
  i18nFallbackChain(locale: string): string[];
  /**
   * Missing CONTENT entry (content bundles): see scripts/lib/locale-fallback.mjs
   * for the rules and the bug they close.
   *   de -> [de]   en -> [en, de]   de-easy -> [de-easy, de]   en-easy -> [en-easy, en, de, de-easy]
   */
  contentFallbackChain(locale: string): string[];
  /** Did resolving `locale` from `usedLocale` cross a language boundary? */
  isCrossLanguage(locale: string, usedLocale: string): boolean;
  /** Is this base language final (SEO-enabled)? Easy variants inherit it. */
  isSeoLanguage(locale: string): boolean;
}

const dedupe = (list: string[]): string[] => list.filter((l, i) => list.indexOf(l) === i);

/**
 * Validate the config and derive the rules. Throws on a config that would
 * silently produce empty lists or chains ending in an unknown language.
 */
export function createLanguageRules(config: LanguagesConfig): LanguageRules {
  const languages = config.languages;
  if (!Array.isArray(languages) || languages.length === 0) {
    throw new Error('languages.json defines no languages');
  }
  const baseLanguages = languages.map((l) => l.code);
  for (const field of ['defaultLanguage', 'keySourceLanguage', 'contentReferenceLanguage'] as const) {
    if (!baseLanguages.includes(config[field])) {
      throw new Error(`languages.json: ${field} "${config[field]}" is not one of ${baseLanguages.join(', ')}`);
    }
  }
  const easyLanguages = languages.map((l) => l.easyCode);
  const allLocales = languages.flatMap((l) => [l.code, l.easyCode]);
  const referenceEasy = languages.find((l) => l.code === config.contentReferenceLanguage)?.easyCode ?? null;

  const isEasyLocale = (locale: string): boolean => easyLanguages.includes(locale);
  const baseLanguageOf = (locale: string): string => {
    const easyMatch = languages.find((l) => l.easyCode === locale);
    if (easyMatch) return easyMatch.code;
    if (baseLanguages.includes(locale)) return locale;
    return locale.replace(/-easy$/, '');
  };

  return {
    config,
    defaultLanguage: config.defaultLanguage,
    keySourceLanguage: config.keySourceLanguage,
    contentReferenceLanguage: config.contentReferenceLanguage,
    baseLanguages,
    easyLanguages,
    allLocales,
    seoLanguages: languages.filter((l) => l.seo),
    isKnownLocale: (locale) => allLocales.includes(locale),
    isEasyLocale,
    baseLanguageOf,
    easyVariantOf: (locale) => languages.find((l) => l.code === baseLanguageOf(locale))?.easyCode ?? null,
    i18nFallbackChain(locale) {
      const chain = [locale];
      if (isEasyLocale(locale)) chain.push(baseLanguageOf(locale));
      chain.push(config.keySourceLanguage);
      return dedupe(chain);
    },
    contentFallbackChain(locale) {
      const chain = [locale];
      if (isEasyLocale(locale)) chain.push(baseLanguageOf(locale));
      chain.push(config.contentReferenceLanguage);
      if (isEasyLocale(locale) && referenceEasy) chain.push(referenceEasy);
      return dedupe(chain);
    },
    isCrossLanguage: (locale, usedLocale) => baseLanguageOf(locale) !== baseLanguageOf(usedLocale),
    isSeoLanguage: (locale) => languages.some((l) => l.code === baseLanguageOf(locale) && l.seo),
  };
}
