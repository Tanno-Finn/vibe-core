import { KEY_SOURCE_LANGUAGE, LANGUAGE_RULES } from '../../config/languages';

/**
 * Regional locales for the languages whose date style is a house-style decision
 * (2026-09-23): English is
 * American (*July 15, 2026*, numeric *07/15/2026*), German is German
 * (*15. Juli 2026*, *15.07.2026*). Spelled out rather than left to the bare
 * code, so the order does not hang on the engine's default region for "en".
 */
const DATE_LOCALES: Record<string, string> = {
  en: 'en-US',
  de: 'de-DE',
};

/**
 * The locale to hand to toLocaleDateString / Intl.DateTimeFormat for a UI
 * language code. An '-easy' variant formats like its base language; a language
 * without a house-style region formats under its base code; an empty code
 * falls back to the key-source language.
 */
export function dateLocaleFor(language: string | null | undefined): string {
  const base = LANGUAGE_RULES.baseLanguageOf(language || KEY_SOURCE_LANGUAGE);
  return DATE_LOCALES[base] ?? base;
}

/**
 * The locale for Number#toLocaleString / Intl.NumberFormat. Numbers follow the
 * same house-style regions as dates (American English: 12,345.6; German:
 * 12.345,6), so this is the date mapping under a name that says what it is for.
 * Never call toLocaleString() without it: a bare call formats in the visitor's
 * browser locale, not the page language, and differs between prerender and browser.
 */
export function numberLocaleFor(language: string | null | undefined): string {
  return dateLocaleFor(language);
}

/**
 * Format a number for a UI language with a fixed number of fraction digits
 * (0 by default) — the localized replacement for Math.round(n).toLocaleString()
 * and n.toFixed(d).
 */
export function formatNumberFor(value: number, language: string | null | undefined, fractionDigits = 0): string {
  return value.toLocaleString(numberLocaleFor(language), {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
