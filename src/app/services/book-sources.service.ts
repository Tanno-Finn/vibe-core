/**
 * Sources Service (Unified)
 *
 * Manages all bibliographic sources with full localization support.
 * Supports both chapters of a companion book and portal content (articles, glossary, timeline).
 *
 * Uses UnifiedContentService for efficient loading (single HTTP request for all content).
 *
 * @see BaseContentService for bundle loading implementation
 * @see UnifiedContentService for the single-bundle loading architecture
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseContentService } from './base-content.service';

/**
 * Chapter structure
 */
export interface Chapter {
  id: string;
  number: number;
  title: string;
  displayTitle?: string;
  subchapterIds: string[];
}

/**
 * Portal content reference (for articles, glossary, timeline)
 */
export interface PortalReference {
  type: 'article' | 'glossary' | 'timeline' | 'guide' | 'demo';
  id: string;
}

/**
 * Source references mapping
 */
export interface SourceReferences {
  book: string[]; // chapter IDs of a companion book
  portal: PortalReference[];
}

/**
 * One claim a piece of content makes on the strength of this source, with the
 * verbatim sentence from the source that carries it (directives/content-integrity.md,
 * "Exact quote, not paraphrase"). `locator` says where the quote sits: a page,
 * section, figure or anchor. Checked by scripts/validate-article-references.ts.
 */
export interface SourceEvidence {
  claim: string;
  quote: string;
  locator?: string;
}

/**
 * Source entry for component consumption
 */
export interface Source {
  id: string;
  type: 'paper' | 'book' | 'website' | 'wikipedia' | 'blog' | 'video' | 'interview' | 'article' | 'other';
  authors?: string;
  /**
   * Four-digit publication year as a string. `null` means the source itself
   * states no date: formatters print "o. J." / "n.d." for it, never a guess.
   */
  year?: string | null;
  publication?: string;
  volume?: string;
  pages?: string;
  url?: string;
  doi?: string;
  isbn?: string;
  accessed?: string;
  tags?: string[];
  /** Optional, core-record only: the quotes that back the claims resting on this source. */
  evidence?: SourceEvidence[];
  title: string;
  // Enriched fields for book sources view (backwards compatible)
  chapter?: string;
  chapterId?: string;
  parentChapterId?: string;
  subChapter?: string;
  chapterNumber?: number;
  // Dev-only flag for citation export
  bookCitation?: boolean;
  // Hidden entries filtered from display
  hidden?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SourcesService extends BaseContentService<Source> {
  protected readonly contentType = 'sources' as const;

  private referencesSubject = new BehaviorSubject<Record<string, SourceReferences>>({});

  public sources$ = this.entries$;
  public references$ = this.referencesSubject.asObservable();

  constructor() {
    super();
    this.initializeWithChaptersAndReferences();
  }

  /**
   * Custom initialization to handle chapters and references
   */
  private initializeWithChaptersAndReferences(): void {
    this.unifiedContent.bundle$.subscribe((bundle) => {
      if (bundle) {
        // Get chapters from bundle
        const chapters = (bundle.sourcesChapters as Chapter[]) || [];

        // Get references mapping
        const references = (bundle.sourcesReferences as Record<string, SourceReferences>) || {};
        this.referencesSubject.next(references);

        // Get entries and enrich with chapter info for book sources view
        const section = bundle.sources as Record<string, Source> | undefined;
        if (section) {
          const entries = Object.values(section)
            .filter((entry) => !entry.hidden)
            .map((entry) => this.enrichWithChapterInfo(entry, chapters, references));
          this.entriesSubject.next(entries);
        }
      }
    });
  }

  /**
   * Enrich source with chapter information based on references
   */
  private enrichWithChapterInfo(
    source: Source,
    chapters: Chapter[],
    references: Record<string, SourceReferences>,
  ): Source {
    const sourceRefs = references[source.id];
    const firstChapterId = sourceRefs?.book?.[0];

    if (firstChapterId) {
      const chapter = this.getChapterBySubchapterId(firstChapterId, chapters);
      return {
        ...source,
        chapterId: firstChapterId,
        chapter: chapter?.displayTitle || chapter?.title || firstChapterId,
        parentChapterId: chapter?.id,
        chapterNumber: chapter?.number,
      };
    }

    return source;
  }

  /**
   * Find parent chapter by subchapterId
   */
  private getChapterBySubchapterId(subchapterId: string, chapters: Chapter[]): Chapter | undefined {
    return chapters.find((ch) => ch.subchapterIds.includes(subchapterId));
  }

  /**
   * Get sources for portal content (article, glossary, timeline)
   */
  getSourcesForPortalContent(type: string, contentId: string): Source[] {
    const references = this.referencesSubject.value;
    return this.entriesSubject.value.filter((source) => {
      const refs = references[source.id];
      return refs?.portal?.some((p) => p.type === type && p.id === contentId);
    });
  }

  /**
   * Get all book sources (sources that are referenced by chapters)
   */
  getBookSources(): Source[] {
    const references = this.referencesSubject.value;
    return this.entriesSubject.value.filter((source) => {
      const refs = references[source.id];
      return refs?.book && refs.book.length > 0;
    });
  }

  /**
   * Get all portal sources (sources that are referenced by portal content)
   */
  getPortalSources(): Source[] {
    const references = this.referencesSubject.value;
    return this.entriesSubject.value.filter((source) => {
      const refs = references[source.id];
      return refs?.portal && refs.portal.length > 0;
    });
  }

  /**
   * Get all portal references for a source
   */
  getPortalRefsForSource(sourceId: string): PortalReference[] {
    const refs = this.referencesSubject.value[sourceId];
    return refs?.portal || [];
  }
}
