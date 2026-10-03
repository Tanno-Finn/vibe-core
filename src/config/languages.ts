/**
 * Language Configuration - SINGLE SOURCE OF TRUTH (app side)
 *
 * Import this module instead of hardcoding language codes, defaults or
 * fallback chains. The data lives in src/config/languages.json; the rules that
 * derive lists and chains from it live in src/config/language-rules.mts and are
 * the same code the build scripts run (scripts/lib/locale-fallback.mjs).
 */

import languagesConfig from './languages.json';
import { createLanguageRules, LanguageEntry, LanguagesConfig } from './language-rules.mjs';

export type { LanguageEntry, LanguagesConfig } from './language-rules.mjs';

export const LANGUAGE_RULES = createLanguageRules(languagesConfig as LanguagesConfig);

/**
 * Site default language: bare-URL redirect target, hreflang x-default and the
 * value of the language signal before detection has run.
 */
export const DEFAULT_LANGUAGE = LANGUAGE_RULES.defaultLanguage;

/**
 * Canonical key source for UI strings and the last resort of the UI-string
 * fallback chain. Not the same idea as DEFAULT_LANGUAGE — see language-rules.mts.
 */
export const KEY_SOURCE_LANGUAGE = LANGUAGE_RULES.keySourceLanguage;

// All language objects
export const LANGUAGE_INFO: LanguageEntry[] = LANGUAGE_RULES.config.languages;

// Base language codes (without -easy variants) — also the valid URL prefixes
export const BASE_LANGUAGES: string[] = LANGUAGE_RULES.baseLanguages;

// Easy language codes
export const EASY_LANGUAGES: string[] = LANGUAGE_RULES.easyLanguages;

// All language codes (base + easy) - flat array for iteration
export const ALL_LANGUAGES: string[] = LANGUAGE_RULES.allLocales;

// Helper to check if a language code is valid
export function isValidLanguage(code: string): boolean {
  return LANGUAGE_RULES.isKnownLocale(code);
}

// Helper to get language info by code
export function getLanguageInfo(code: string): LanguageEntry | undefined {
  const baseCode = LANGUAGE_RULES.baseLanguageOf(code);
  return LANGUAGE_INFO.find((l) => l.code === baseCode);
}
