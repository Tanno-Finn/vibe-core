/**
 * Unified Content Service
 *
 * Central service that loads the unified content bundle (content.[lang].json)
 * and provides access to all content types through a single HTTP request per language.
 *
 * This replaces multiple HTTP requests with one bundled request, improving performance.
 */

import { Injectable, effect, inject, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from './translation.service';
import { BehaviorSubject, Observable, of, catchError, filter, tap, map, shareReplay, take } from 'rxjs';
import { BUILD_VERSION } from '../../build-version';
import { RelatedRefs } from './related-refs.types';

export interface UnifiedContentMeta {
  language: string;
  version: string;
  generatedAt: string;
  checksum: string;
  entryCounts: Record<string, number>;
}

export interface ArticleMeta {
  id: string;
  pageId: string;
  created: string;
  updated: string;
  toolReferences: string[];
  resourceReferences: string[];
  sourceReferences: string[];
  /** Universal cross-content refs (articles/glossary/timeline/demos). */
  related?: RelatedRefs;
}

export interface UnifiedContentBundle {
  meta: UnifiedContentMeta;
  glossary: Record<string, unknown>;
  timeline: Record<string, unknown>;
  aiTools: Record<string, unknown>;
  aiResources: Record<string, unknown>;
  catalog: Record<string, unknown>;
  sources: Record<string, unknown>;
  achievements: Record<string, unknown>;
  articleMeta: Record<string, ArticleMeta>;
  sourcesChapters?: unknown[];
  sourcesReferences?: Record<string, unknown>;
}

type ContentType = 'glossary' | 'timeline' | 'aiTools' | 'aiResources' | 'catalog' | 'sources' | 'achievements';

@Injectable({
  providedIn: 'root',
})
export class UnifiedContentService {
  private http = inject(HttpClient);
  private translationService = inject(TranslationService);

  // State
  private bundleSubject = new BehaviorSubject<UnifiedContentBundle | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  // Fatal load failure: the whole fallback chain was exhausted and no bundle exists.
  // Distinct from errorSubject, which also carries the NON-fatal "served via fallback
  // language" banner message. Consumers that render a skeleton need this one: without
  // it an empty entry list is indistinguishable from a load still in flight, and the
  // skeleton shimmers forever.
  private loadFailedSubject = new BehaviorSubject<boolean>(false);

  // Cache per language
  private bundleCache = new Map<string, UnifiedContentBundle>();
  private loadingPromises = new Map<string, Observable<UnifiedContentBundle | null>>();

  // Tracks which requested languages were actually served via fallback.
  // Map<requestedLanguage, actualLanguageServed> — only populated when fallback was used.
  private bundleFallbackSources = new Map<string, string>();

  // Public observables
  public bundle$ = this.bundleSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  /** True once the fallback chain has been exhausted without producing a bundle. */
  public loadFailed$ = this.loadFailedSubject.asObservable();

  // Computed sections
  public articleMeta$ = this.bundle$.pipe(map((b) => b?.articleMeta ?? {}));

  constructor() {
    // Initial load — synchronous, so the first reader does not wait for an
    // effect flush. The language is already resolved: TranslationService
    // detects it in its constructor.
    this.loadBundleForCurrentLanguage();

    // Follow the language signal. The first run sees the language just loaded;
    // loadBundle() is cached per language, so it costs nothing.
    effect(() => {
      this.translationService.currentLanguage$();
      untracked(() => this.loadBundleForCurrentLanguage());
    });
  }

  /**
   * Load bundle for current language
   */
  private loadBundleForCurrentLanguage(): void {
    const lang = this.translationService.currentLanguage;
    this.loadBundle(lang).pipe(take(1)).subscribe();
  }

  /**
   * Load bundle for a specific language with caching and fallback chain.
   *
   * Fallback chain: [requestedLanguage] -> its base language (for '-easy') -> 'de' -> 'en'
   * If the requested bundle fails to load (404, network error, etc.), the service
   * automatically retries with 'de', then 'en'. The error$ observable is populated
   * with a message describing the fallback so that UI components can display a banner.

   */
  loadBundle(language: string): Observable<UnifiedContentBundle | null> {
    // Return cached bundle if available
    if (this.bundleCache.has(language)) {
      const cached = this.bundleCache.get(language)!;
      this.bundleSubject.next(cached);
      // Re-emit fallback error state if this language was previously served via fallback,
      // so UI banner stays in sync across cache hits.
      this.loadFailedSubject.next(false);
      const fallbackSource = this.bundleFallbackSources.get(language);
      if (fallbackSource) {
        this.errorSubject.next(this.buildFallbackMessage(language, fallbackSource));
      } else {
        this.errorSubject.next(null);
      }
      return of(cached);
    }

    // Return existing loading promise if in progress
    if (this.loadingPromises.has(language)) {
      return this.loadingPromises.get(language)!;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    this.loadFailedSubject.next(false);

    const chain = this.buildFallbackChain(language);
    const request$ = this.tryLoadChain(language, chain, 0).pipe(shareReplay(1));

    this.loadingPromises.set(language, request$);
    return request$;
  }

  /**
   * Build the fallback chain for a given language.
   * [requested, its base language for an '-easy' variant, 'de', 'en'] —
   * deduplicated so each language is attempted once. The base language comes
   * first so an Easy-English reader whose bundle is missing gets English, not
   * German (the same order TranslationService and the content build use).
   */
  private buildFallbackChain(language: string): string[] {
    const chain: string[] = [language];
    const base = language.replace(/-easy$/, '');
    if (!chain.includes(base)) chain.push(base);
    if (!chain.includes('de')) chain.push('de');
    if (!chain.includes('en')) chain.push('en');
    return chain;
  }

  /**
   * Recursively attempt to load bundles along the fallback chain until one succeeds.
   * Each step makes a fresh HTTP request; the result is cached under both the language
   * that actually loaded AND the originally-requested language (so subsequent calls
   * short-circuit via bundleCache).
   */
  private tryLoadChain(
    requestedLanguage: string,
    chain: string[],
    index: number,
  ): Observable<UnifiedContentBundle | null> {
    if (index >= chain.length) {
      // Fallback chain exhausted — nothing to do but surface the error.
      console.error(
        `Failed to load unified content bundle for ${requestedLanguage} and all fallbacks (${chain.join(', ')})`,
      );
      this.errorSubject.next(`Failed to load content for "${requestedLanguage}" — fallback chain exhausted.`);
      this.loadFailedSubject.next(true);
      this.loadingSubject.next(false);
      this.loadingPromises.delete(requestedLanguage);
      return of(null);
    }

    const attemptLanguage = chain[index];
    const url = `/assets/data/content.${attemptLanguage}.json?v=${BUILD_VERSION}`;
    const isFallback = attemptLanguage !== requestedLanguage;

    return this.http.get<UnifiedContentBundle>(url).pipe(
      tap((bundle) => {
        // Cache under the language we actually loaded
        this.bundleCache.set(attemptLanguage, bundle);
        // Also mirror under the requested language so future loadBundle(requestedLanguage)
        // calls short-circuit to cache without re-running the fallback chain.
        if (isFallback) {
          this.bundleCache.set(requestedLanguage, bundle);
          this.bundleFallbackSources.set(requestedLanguage, attemptLanguage);
        } else {
          this.bundleFallbackSources.delete(requestedLanguage);
        }

        this.bundleSubject.next(bundle);
        this.loadFailedSubject.next(false);
        this.loadingSubject.next(false);
        this.loadingPromises.delete(requestedLanguage);

        if (isFallback) {
          const msg = this.buildFallbackMessage(requestedLanguage, attemptLanguage);
          console.warn(msg);
          this.errorSubject.next(msg);
        }
      }),
      catchError((error) => {
        console.warn(
          `Failed to load unified content bundle for ${attemptLanguage} (step ${index + 1}/${chain.length} of fallback chain for ${requestedLanguage}):`,
          error,
        );
        // Try the next language in the fallback chain.
        return this.tryLoadChain(requestedLanguage, chain, index + 1);
      }),
    );
  }

  private buildFallbackMessage(requestedLanguage: string, fallbackLanguage: string): string {
    return `Content for "${requestedLanguage}" not available, using "${fallbackLanguage}" as fallback.`;
  }

  /**
   * The bundle that serves `language` (its own, or the fallback it was served
   * from), as soon as it is the current one. Unlike loadBundle() this triggers no
   * load and re-emits nothing to other readers; it waits for the load the
   * language switch already started, and never answers with a stale language.
   */
  bundleFor$(language: string): Observable<UnifiedContentBundle> {
    return this.bundle$.pipe(
      filter((bundle): bundle is UnifiedContentBundle => !!bundle && this.bundleCache.get(language) === bundle),
    );
  }

  /**
   * Get a specific content section from the current bundle
   */
  getSection<T>(contentType: ContentType): T | null {
    const bundle = this.bundleSubject.value;
    if (!bundle) return null;
    return bundle[contentType] as T;
  }

  /**
   * Get all entries from a content type as array
   */
  getEntriesArray<T>(contentType: ContentType): T[] {
    const section = this.getSection<Record<string, T>>(contentType);
    if (!section) return [];
    return Object.values(section);
  }

  /**
   * Get a specific entry by ID from a content type
   */
  getEntry<T>(contentType: ContentType, id: string): T | null {
    const section = this.getSection<Record<string, T>>(contentType);
    if (!section) return null;
    return section[id] ?? null;
  }

  /**
   * Get current bundle synchronously
   */
  getCurrentBundle(): UnifiedContentBundle | null {
    return this.bundleSubject.value;
  }

  /**
   * Get meta information
   */
  getMeta(): UnifiedContentMeta | null {
    return this.bundleSubject.value?.meta ?? null;
  }

  /**
   * Force refresh the bundle for current language
   */
  refresh(): void {
    const lang = this.translationService.currentLanguage;
    this.bundleCache.delete(lang);
    this.bundleFallbackSources.delete(lang);
    this.loadBundle(lang).pipe(take(1)).subscribe();
  }

  /**
   * Clear all cached bundles
   */
  clearCache(): void {
    this.bundleCache.clear();
    this.bundleFallbackSources.clear();
  }
}
