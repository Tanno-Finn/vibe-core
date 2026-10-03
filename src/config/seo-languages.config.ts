/**
 * SEO Language Configuration
 *
 * Which languages get their own URL prefix (/<lang>/...), a sitemap entry and
 * an hreflang alternate. Derived from src/config/languages.json — the `seo`
 * and `prerenderTier` fields of each language — so there is nothing to keep in
 * sync by hand any more. The same fields drive scripts/generate-sitemap.js,
 * scripts/generate-prerender-routes.js and scripts/build-artifacts.js through
 * scripts/lib/locale-fallback.mjs; the bare-URL redirect in src/index.html is
 * inline script that cannot import, so scripts/check-i18n-keys.mjs fails the
 * build when its language list or default drifts from languages.json.
 *
 * To enable a new language for SEO: set `"seo": true` and a `prerenderTier`
 * on its entry in languages.json, then `npm run build:prod`.
 *
 * Prerender Tiers:
 *   1 = Full prerender (home + hubs + articles) — core languages
 *   2 = Partial prerender (home + hubs) — established extended audience
 *   3 = Minimal prerender (home only) — low expected traffic
 */

import { BASE_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_RULES } from './languages';

export interface SeoLanguageEntry {
  code: string; // 'de', 'en', 'fr', ...
  hreflang: string; // BCP 47 code for hreflang attribute
  prerenderTier?: 1 | 2 | 3; // Prerender depth.
}

/** Languages that appear in sitemap + hreflang tags (base languages only —
 *  easy variants stay a stored toggle, not a URL prefix). */
export const SEO_ENABLED_LANGS: SeoLanguageEntry[] = LANGUAGE_RULES.seoLanguages.map((l) => ({
  code: l.code,
  hreflang: l.hreflang,
  prerenderTier: l.prerenderTier,
}));

/** All base language codes (for URL prefix matching) */
export const ALL_LANG_CODES: string[] = BASE_LANGUAGES;

/** Default language for x-default hreflang and fallback redirects — the site default. */
export const DEFAULT_SEO_LANG = DEFAULT_LANGUAGE;

/**
 * Whether a language variant is considered final / production-ready.
 * Authoritative status — same property that drives sitemap, hreflang and prerendering.
 * Easy variants inherit the base language's status.
 * Unknown codes are treated as non-final (conservative default).
 */
export function isLanguageFinal(code: string): boolean {
  return LANGUAGE_RULES.isSeoLanguage(code);
}

/** Inverse of {@link isLanguageFinal} — convenient for UI Beta tagging. */
export function isLanguageBeta(code: string): boolean {
  return !isLanguageFinal(code);
}
