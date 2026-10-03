/**
 * Glossary Service
 *
 * Manages AI glossary entries with full localization support.
 * Handles loading, filtering, searching, and navigation of AI terminology.
 *
 * Uses aggregated content bundles for efficient loading (single HTTP request).
 *
 * @see BaseContentService for bundle loading implementation
 */

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseContentService } from './base-content.service';
import { RelatedRefs } from './related-refs.types';

/**
 * Processed glossary entry for component consumption
 */
export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  description?: string; // Alias for definition (bundle uses 'description')
  example?: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  popularity?: 'low' | 'medium' | 'high';
  alternativeNames?: string[];
  abbreviations?: string[];
  childConcepts?: string[];
  parentConcepts?: string[];
  /** Universal cross-content refs (articles/glossary/timeline/demos). */
  related?: RelatedRefs;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlossaryService extends BaseContentService<GlossaryEntry> {
  protected readonly contentType = 'glossary';

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Get all glossary entries as an observable
   */
  getAllEntries(): Observable<GlossaryEntry[]> {
    return this.entries$.pipe(map((entries) => this.normalizeEntries(entries)));
  }

  /**
   * Get a specific entry by ID
   */
  getEntryById(id: string): Observable<GlossaryEntry | undefined> {
    return this.entries$.pipe(
      map((entries) => {
        const entry = entries.find((e) => e.id === id);
        return entry ? this.normalizeEntry(entry) : undefined;
      }),
    );
  }

  /**
   * The entries of one language, once that language's bundle is current — never
   * the previous language's entries during a switch (getAllEntries() may still
   * hold those). Used for the glossary's JSON-LD.
   */
  getEntriesForLanguage(language: string): Observable<GlossaryEntry[]> {
    return this.unifiedContent
      .bundleFor$(language)
      .pipe(map((bundle) => this.normalizeEntries(Object.values(bundle.glossary ?? {}) as GlossaryEntry[])));
  }

  /**
   * Normalize entry - ensure definition field is populated and alternativeNames is array
   */
  private normalizeEntry(entry: GlossaryEntry): GlossaryEntry {
    return {
      ...entry,
      definition: entry.definition || entry.description || '',
      // Ensure alternativeNames is always an array (some entries have it as object)
      alternativeNames: Array.isArray(entry.alternativeNames) ? entry.alternativeNames : [],
    };
  }

  /**
   * Normalize multiple entries
   */
  private normalizeEntries(entries: GlossaryEntry[]): GlossaryEntry[] {
    return entries.map((e) => this.normalizeEntry(e));
  }
}
