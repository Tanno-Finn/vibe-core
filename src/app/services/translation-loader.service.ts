/**
 * Translation Loader Service
 *
 * Fetches the split i18n bundles that scripts/build-i18n-bundles.ts writes:
 *
 *   assets/i18n/i18n.<lang>.json            CORE — loaded before the first route
 *     { "namespaces": { <ns>: {...}, ... },   the shell namespaces
 *       "chunks": ["articleGitIntro", ...],   every chunk this language has
 *       "splitParents": ["easyLanguage.content"] }
 *   assets/i18n/chunks/<lang>/<id>.json     CHUNK — one namespace (or one child
 *                                           of a split parent), loaded on demand
 *
 * Both go through the HTTP transfer cache (app.config.ts), so a prerendered
 * page's core and chunks are embedded in its HTML and hydration does not
 * download them a second time.
 *
 * @see scripts/build-i18n-bundles.ts for bundle generation
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BUILD_VERSION } from '../../build-version';
import { KEY_SOURCE_LANGUAGE } from '../../config/languages';

export interface TranslationModule {
  [key: string]: unknown;
}

/** The up-front bundle of one language. */
export interface I18nCoreBundle {
  namespaces: TranslationModule;
  /** Chunk ids: a namespace ('articleGitIntro') or a split child ('easyLanguage.content.home'). */
  chunks: string[];
  /** Objects whose children are chunks of their own ('easyLanguage.content'). */
  splitParents: string[];
}

const EMPTY_CORE: I18nCoreBundle = { namespaces: {}, chunks: [], splitParents: [] };

@Injectable({
  providedIn: 'root',
})
export class TranslationLoaderService {
  private http = inject(HttpClient);
  private coreCache = new Map<string, Promise<I18nCoreBundle>>();

  /**
   * Load the core bundle of a language (cached per language).
   *
   * Strategy (no silent fail):
   *   1. GET the bundle; on error retry exactly once.
   *   2. If the retry fails: fall back to the key-source language's core — the
   *      page renders in that language rather than as raw keys.
   *   3. If that fails too: an empty core; the caller renders keys, the app
   *      still starts.
   */
  loadCore(languageCode: string): Promise<I18nCoreBundle> {
    let cached = this.coreCache.get(languageCode);
    if (!cached) {
      cached = this.fetchCore(languageCode, false);
      this.coreCache.set(languageCode, cached);
    }
    return cached;
  }

  /**
   * Load one chunk (retry once). Rejects when both attempts fail; the caller
   * treats that as "settled, missing" and walks its fallback chain.
   */
  async loadChunk(languageCode: string, chunkId: string): Promise<unknown> {
    const url = `assets/i18n/chunks/${languageCode}/${chunkId}.json?v=${BUILD_VERSION}`;
    try {
      return await firstValueFrom(this.http.get<unknown>(url));
    } catch (error: unknown) {
      console.warn(`[TranslationLoader] Failed to load chunk "${languageCode}/${chunkId}", retrying once...`, error);
    }
    return firstValueFrom(this.http.get<unknown>(url));
  }

  private async fetchCore(languageCode: string, isFallback: boolean): Promise<I18nCoreBundle> {
    const url = `assets/i18n/i18n.${languageCode}.json?v=${BUILD_VERSION}`;
    for (const attempt of [1, 2]) {
      try {
        const core = await firstValueFrom(this.http.get<I18nCoreBundle>(url));
        if (core && core.namespaces && Object.keys(core.namespaces).length > 0) {
          return { namespaces: core.namespaces, chunks: core.chunks ?? [], splitParents: core.splitParents ?? [] };
        }
        throw new Error('Empty bundle response');
      } catch (error: unknown) {
        console.warn(
          `[TranslationLoader] Failed to load bundle for "${languageCode}" (attempt ${attempt}/2)`,
          error instanceof Error ? error.message : error,
        );
      }
    }

    // Fallback: the key-source core — but only if we're not already loading it
    // (prevents infinite recursion when it is missing itself)
    if (!isFallback && languageCode !== KEY_SOURCE_LANGUAGE) {
      console.warn(
        `[TranslationLoader] Falling back to "${KEY_SOURCE_LANGUAGE}" bundle for failed language "${languageCode}"`,
      );
      return this.fetchCore(KEY_SOURCE_LANGUAGE, true);
    }

    // Last resort: empty (avoids crashing the app; the caller renders keys).
    console.error(`[TranslationLoader] Key-source bundle also failed; returning empty translations.`);
    return EMPTY_CORE;
  }
}
