/**
 * Timeline Service
 *
 * Manages AI timeline events with full localization support.
 * Handles loading, filtering, and grouping of historical AI events.
 *
 * Uses aggregated content bundles for efficient loading (single HTTP request).
 *
 * @see BaseContentService for bundle loading implementation
 */

import { Injectable, signal, computed } from '@angular/core';
import { BaseContentService } from './base-content.service';
import { RelatedRefs } from './related-refs.types';
import { foldForSearch } from '../utils/search-fold';

/**
 * Timeline event for display (with current language)
 */
export interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  category: string;
  importance: 'revolutionary' | 'major' | 'important' | 'minor';
  icon: string;
  color: string;
  details?: { icon: string; text: string }[];
  sources?: { title: string; url: string; type: string }[];
  people?: string[];
  organizations?: string[];
  /** Universal cross-content refs (articles/glossary/timeline/demos). */
  related?: RelatedRefs;
  createdAt?: string;
  updatedAt?: string;
  title: string;
  description: string;
  link?: string;
  // Detail fields from bundle (different format)
  detailIds?: string[];
}

export interface TimelineFilters {
  category?: string;
  importance?: string;
  dateRange?: { start: number; end: number };
  search?: string;
}

/** The searchable fields of an event, folded for comparison (see foldForSearch). */
function foldedSearchFields(event: TimelineEvent): string[] {
  return [
    event.title,
    event.description,
    event.category,
    event.importance,
    ...(event.people ?? []),
    ...(event.organizations ?? []),
  ].map(foldForSearch);
}

@Injectable({
  providedIn: 'root',
})
export class TimelineService extends BaseContentService<TimelineEvent> {
  protected readonly contentType = 'timeline';

  private categories = signal<Record<string, string>>({});
  private filters = signal<TimelineFilters>({});

  /**
   * Signal that mirrors BehaviorSubject for reactivity in computed().
   * BehaviorSubject.value is NOT reactive in computed() - only Signals are.
   */
  private entriesSignal = signal<TimelineEvent[]>([]);

  // Reactive computed properties - use entriesSignal() for proper reactivity
  filteredEvents = computed(() => this.applyFilters(this.entriesSignal(), this.filters()));
  availableCategories = computed(() => this.categories());
  totalEvents = computed(() => this.entriesSignal().length);

  constructor() {
    super();
    this.initialize();

    // Sync BehaviorSubject to Signal and transform events
    this.entries$.subscribe((events) => {
      const transformedEvents = events.map((event) => this.transformEvent(event));
      this.entriesSignal.set(transformedEvents);
      this.updateCategories(transformedEvents);
    });
  }

  /**
   * Transform event data from bundle format to template format.
   * Bundle stores details as object { id: { icon, text } }
   * Template expects array [{ icon, text }] for @for loop
   */
  private transformEvent(event: TimelineEvent): TimelineEvent {
    // If details is undefined or already an array, return as-is
    if (!event.details || Array.isArray(event.details)) {
      return event;
    }

    // Convert details object to array
    const detailsObj = event.details as unknown as Record<string, { icon: string; text: string }>;
    const detailsArray = Object.values(detailsObj);

    return {
      ...event,
      details: detailsArray,
    };
  }

  /**
   * Update categories from events
   */
  private updateCategories(events: TimelineEvent[]): void {
    const categoryMap: Record<string, string> = {};
    events.forEach((event) => {
      categoryMap[event.category] = event.category;
    });
    this.categories.set(categoryMap);
  }

  /**
   * Apply filters to timeline events
   */
  private applyFilters(events: TimelineEvent[], filters: TimelineFilters): TimelineEvent[] {
    let filtered = [...events];

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((event) => event.category === filters.category);
    }

    // Importance filter
    if (filters.importance && filters.importance !== 'all') {
      filtered = filtered.filter((event) => event.importance === filters.importance);
    }

    // Date range filter
    if (filters.dateRange) {
      filtered = filtered.filter((event) => {
        const eventYear = parseInt(event.year);
        return eventYear >= filters.dateRange!.start && eventYear <= filters.dateRange!.end;
      });
    }

    // Search filter
    if (filters.search && filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();

      // Exact match by ID - used for deep linking to specific events
      if (searchLower.startsWith('exact:')) {
        const exactId = searchLower.substring(6);
        filtered = filtered.filter((event) => event.id.toLowerCase() === exactId);
      } else {
        // Tokenized AND search: every whitespace-separated word must appear in at
        // least one searchable field. A single word behaves exactly as the previous
        // substring search; each word is its own removable chip in the sidebar.
        // Words and fields are folded (foldForSearch), so the Easy-German
        // Mediopunkt compound "Sprach·modell" is found by "Sprachmodell" too.
        const words = searchLower.split(/\s+/).map(foldForSearch).filter(Boolean);
        filtered = filtered.filter((event) => {
          const haystacks = foldedSearchFields(event);
          return words.every((word) => haystacks.some((haystack) => haystack.includes(word)));
        });
      }
    }

    return filtered;
  }

  /**
   * Update active filters
   */
  updateFilters(newFilters: Partial<TimelineFilters>): void {
    this.filters.update((current) => ({ ...current, ...newFilters }));
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filters.set({});
  }
}
