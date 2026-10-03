import { Injector } from '@angular/core';
import { TranslationService } from '../services/translation.service';

/**
 * Translate `key` through a lazily resolved TranslationService, or return
 * `fallback` when that is not possible.
 *
 * For code that runs outside the normal component tree and may run before the
 * translations are ready: the global ErrorHandler (created before most
 * services) and the HTTP error interceptor (which must not inject
 * TranslationService eagerly, since TranslationService itself loads over
 * HttpClient). TranslationService.translate() returns the key itself when the
 * string is not loaded, so that case falls back too. The fallback is English,
 * the key-source language (src/config/languages.json).
 */
export function translateOr(injector: Injector, key: string, fallback: string): string {
  try {
    return translatedOr((k) => injector.get(TranslationService).translate(k), key, fallback);
  } catch {
    return fallback;
  }
}

/**
 * `translate(key)`, or `fallback` when the key has no string.
 *
 * TranslationService.translate() returns the key itself for a missing key, never
 * an empty string, so `translate(key) || fallback` never reaches its fallback and
 * the page shows the raw key. Use this wherever the key is built at run time
 * from data (a chapter id, a glossary category, a learning path) and may be missing.
 */
export function translatedOr(translate: (key: string) => string, key: string, fallback: string): string {
  const value = translate(key);
  return value && value !== key ? value : fallback;
}
