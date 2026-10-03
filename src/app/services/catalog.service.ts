/**
 * Catalog Service
 *
 * Unified service for the catalog, merging tools and resources.
 * Reads from the 'catalog' key in the unified content bundle.
 *
 * @see BaseContentService for bundle loading implementation
 */

import { Injectable } from '@angular/core';
import { BaseContentService } from './base-content.service';
import { foldForSearch } from '../utils/search-fold';
import { CatalogEntry, CatalogFilters, getDisplayName } from '../models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService extends BaseContentService<CatalogEntry> {
  protected readonly contentType = 'catalog' as const;

  public catalog$ = this.entries$;

  constructor() {
    super();
    this.initialize();
  }

  /** Filter entries with the full filter set */
  filterEntries(entries: CatalogEntry[], filters: CatalogFilters): CatalogEntry[] {
    return entries.filter((entry) => {
      // Entry type filter
      if (filters.entryTypes.length > 0 && !filters.entryTypes.includes(entry.entryType)) {
        return false;
      }

      // Search term
      if (filters.searchTerm.trim()) {
        const searchTerm = filters.searchTerm.toLowerCase().trim();

        if (searchTerm.startsWith('exact:')) {
          const exactId = searchTerm.substring(6);
          if (entry.id.toLowerCase() !== exactId) return false;
        } else {
          const displayName = getDisplayName(entry);
          const searchableFields = [displayName, entry.description, entry.shortDescription, ...(entry.tags || [])];

          // Add type-specific fields
          if (entry.entryType === 'tool') {
            searchableFields.push(...(entry.features || []), ...(entry.pros || []), ...(entry.cons || []));
          } else {
            searchableFields.push(entry.source, entry.author || '');
          }

          const searchableText = foldForSearch(searchableFields.join(' '));
          if (!searchableText.includes(foldForSearch(searchTerm))) return false;
        }
      }

      // Category filter (tools only)
      if (filters.categories.length > 0) {
        if (entry.entryType === 'tool') {
          if (!filters.categories.includes(entry.category)) return false;
        } else {
          return false; // resources don't have categories
        }
      }

      // Media type filter (resources only)
      if (filters.mediaTypes.length > 0) {
        if (entry.entryType === 'resource') {
          if (!filters.mediaTypes.includes(entry.mediaType)) return false;
        } else {
          return false; // tools don't have media types
        }
      }

      // Topic filter (resources only)
      if (filters.topics.length > 0) {
        if (entry.entryType === 'resource') {
          if (!filters.topics.includes(entry.topic)) return false;
        } else {
          return false;
        }
      }

      // Difficulty filter
      if (filters.difficulties.length > 0) {
        const d = entry.difficulty?.toLowerCase() || '';
        const matches = filters.difficulties.some(
          (diff) =>
            diff === d ||
            (diff === 'beginner' && (d === 'anfänger' || d === 'beginner')) ||
            (diff === 'intermediate' && (d === 'fortgeschritten' || d === 'intermediate')) ||
            (diff === 'expert' && (d === 'experte' || d === 'expert' || d === 'advanced')),
        );
        if (!matches) return false;
      }

      // Language filter (resources only)
      if (filters.languages.length > 0) {
        if (entry.entryType === 'resource') {
          if (!filters.languages.includes(entry.language)) return false;
        }
        // Tools: don't filter out (tools don't have standardized language field)
      }

      // Pricing filter (tools only)
      if (filters.pricing.length > 0) {
        if (entry.entryType === 'tool') {
          if (!filters.pricing.includes(entry.pricing)) return false;
        } else {
          return false;
        }
      }

      // Free content filter
      if (filters.onlyFree) {
        if (entry.entryType === 'tool') {
          if (entry.pricing !== 'kostenlos' && entry.pricing !== 'free' && entry.pricing !== 'freemium') return false;
        } else {
          if (entry.isFreeBehindPaywall) return false;
        }
      }

      // Estimated time filter (resources only)
      if (filters.maxEstimatedTime && entry.entryType === 'resource' && entry.estimatedTime) {
        const minutes = this.parseEstimatedTime(entry.estimatedTime);
        if (minutes > filters.maxEstimatedTime) return false;
      }

      // Rating filter
      if (filters.minRating && entry.rating && entry.rating < filters.minRating) {
        return false;
      }

      return true;
    });
  }

  /** Parse estimated time string to minutes */
  private parseEstimatedTime(timeString: string): number {
    const timeStr = timeString.toLowerCase();
    const match = timeStr.match(/(\d+)\s*(min|h|hour|hours|minutes?|day|days?)/);
    if (!match) return 0;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'min':
      case 'minutes':
      case 'minute':
        return value;
      case 'h':
      case 'hour':
      case 'hours':
        return value * 60;
      case 'day':
      case 'days':
        return value * 60 * 24;
      default:
        return value;
    }
  }
}
