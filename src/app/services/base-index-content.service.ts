import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map, catchError, throwError } from 'rxjs';

/**
 * Base interface for index-based content metadata (Articles, Guides)
 * These load from separate index.json files, not the unified content bundle.
 */
export interface BaseIndexContentMeta {
  /** Unique identifier */
  id: string;
  /**
   * Editorial cross-references — pinned IDs (articles/glossary/timeline/
   * demos/sources/tools/resources) plus inline external URLs. Synced from
   * the per-id JSON file's `related` block by scripts/sync-related-to-index.mjs.
   *
   * Consumed by LessonTemplate as `[refs]` alongside the ontology-driven
   * `[forNode]` flow — the two are merged in the component when both inputs
   * are present (V1 ontology types via union, V2 types tools/resources/external
   * via editorial only since they're not in the ontology graph).
   */
  related?: import('./related-refs.types').RelatedRefs;
  /** Route path (e.g., "articles/neural-networks" or "guides/prompting") */
  path: string;
  /** Translation key for title */
  titleKey: string;
  /** Translation key for description */
  descriptionKey: string;
  /** Category for filtering */
  category: string;
  /** Estimated time (e.g., "10min") */
  estimatedTime: string;
  /** Difficulty level */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Whether to feature prominently */
  featured: boolean;
  /** Optional tags for filtering */
  tags?: string[];
  /** Draft status - hidden in PROD, shown with badge in DEV */
  draft?: boolean;
  /**
   * Optional scheduled release date (ISO 'YYYY-MM-DD'). Items with a
   * future publishDate are filtered out of production listings/routes
   * by the consuming service (e.g. ArticlesService.isVisible). In dev
   * they remain visible and get a "Scheduled" tag on the card.
   */
  publishDate?: string;
}

/**
 * BaseIndexContentService - Generic base class for index-based content services
 *
 * Provides common CRUD-like operations for content metadata loaded from index.json files.
 * ArticlesService extends this class. (DemosService predates it and implements
 * the same load-and-cache shape itself — its meta type and visibility gates differ.)
 *
 * Note: This is separate from BaseContentService which uses the UnifiedContentBundle.
 * Articles and Guides load from their own index.json files for historical reasons
 * and because their component structure differs from other content types.
 *
 * @template T - The content metadata type (must extend BaseIndexContentMeta)
 */
export abstract class BaseIndexContentService<T extends BaseIndexContentMeta> {
  protected http = inject(HttpClient);
  private cache$: Observable<T[]> | null = null;

  /** Subclasses must provide the URL to their JSON data */
  protected abstract readonly DATA_URL: string;

  /**
   * Get all content items
   * Results are cached after first load. A failed load is NOT cached:
   * shareReplay(1) would replay the error to every future subscriber
   * forever, so the cache resets itself before the error propagates.
   */
  getAll(): Observable<T[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<T[]>(this.DATA_URL).pipe(
        catchError((err) => {
          this.cache$ = null;
          return throwError(() => err);
        }),
        shareReplay(1),
      );
    }
    return this.cache$;
  }

  /**
   * Get a specific item by ID
   */
  getById(id: string): Observable<T | undefined> {
    return this.getAll().pipe(map((items) => items.find((item) => item.id === id)));
  }

  /**
   * Clear cache (useful for testing or language changes)
   */
  clearCache(): void {
    this.cache$ = null;
  }
}
