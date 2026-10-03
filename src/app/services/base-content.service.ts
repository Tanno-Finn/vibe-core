/**
 * Base Content Service
 *
 * Abstract base class for all content services (Glossary, Timeline, AI Tools, etc.)
 * Now uses UnifiedContentService for single-bundle loading.
 *
 * Benefits:
 * - Single HTTP request for ALL content instead of N requests per content type
 * - Automatic caching with language-aware invalidation
 * - Consistent API across all content services
 * - Simplified service implementations
 *
 * Architecture:
 * - Build-time: All content aggregated into content.[lang].json (scripts/build-unified-content.ts)
 * - Runtime: UnifiedContentService loads bundle once, all services read from it
 */

import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { UnifiedContentService, UnifiedContentBundle } from './unified-content.service';

/**
 * Content type keys matching UnifiedContentBundle structure
 */
export type ContentTypeKey =
  'glossary' | 'timeline' | 'aiTools' | 'aiResources' | 'catalog' | 'sources' | 'achievements';

/**
 * Abstract base class for content services
 *
 * @typeParam T - The type of content entry (e.g., GlossaryEntry, TimelineEvent)
 */
export abstract class BaseContentService<T extends { id: string }> {
  protected unifiedContent = inject(UnifiedContentService);

  /**
   * The content type key used to access the unified bundle section
   */
  protected abstract readonly contentType: ContentTypeKey;

  /**
   * BehaviorSubject for reactive access to entries
   */
  protected entriesSubject = new BehaviorSubject<T[]>([]);

  /**
   * Observable of all entries (reactive)
   */
  public entries$ = this.entriesSubject.asObservable();

  /**
   * Flag to track if initial load has been triggered
   */
  private initialLoadDone = false;

  /**
   * Initialize the service by subscribing to unified content changes
   * Call this from the constructor of derived classes
   */
  protected initialize(): void {
    // Subscribe to bundle changes from UnifiedContentService
    this.unifiedContent.bundle$.pipe(takeUntilDestroyed()).subscribe((bundle) => {
      if (bundle) {
        this.updateEntriesFromBundle(bundle);
      }
    });
  }

  /**
   * Update entries from the unified bundle
   */
  private updateEntriesFromBundle(bundle: UnifiedContentBundle): void {
    const section = bundle[this.contentType] as Record<string, T> | undefined;
    if (section) {
      const entries = Object.values(section);
      this.entriesSubject.next(entries);
      this.initialLoadDone = true;
    }
  }

  /**
   * Check if initial load is complete
   */
  isLoaded(): boolean {
    return this.initialLoadDone;
  }
}
