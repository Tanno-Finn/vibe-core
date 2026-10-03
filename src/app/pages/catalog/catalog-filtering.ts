/**
 * The catalog's list pipeline as pure functions: filter-bar state to service
 * filters, the quick filters on top, the sort, and the page window. Moved
 * verbatim out of CatalogComponent's computeds so the page only wires them.
 */
import { CatalogEntry, CatalogFilters, getDisplayName } from '../../models/catalog.model';
import { ResourceFilters } from '../../models/ai-resource.model';

export type CatalogSortOrder = 'rating' | 'alphabetical' | 'newest';

/** The filter bar speaks ResourceFilters; CatalogService.filterEntries takes CatalogFilters. */
export function toCatalogFilters(filters: ResourceFilters): CatalogFilters {
  return {
    searchTerm: filters.searchTerm,
    entryTypes: [],
    categories: [],
    mediaTypes: filters.mediaTypes,
    topics: filters.topics,
    difficulties: filters.difficulties,
    languages: filters.languages,
    pricing: [],
    onlyFree: filters.onlyFree,
    minRating: filters.minRating,
  };
}

/** Quick filters: 'topRated', 'freeAndGerman', 'onlyFavorites' — each narrows further. */
export function applyQuickFilters(
  entries: CatalogEntry[],
  quickFilters: ReadonlySet<string>,
  favorites: ReadonlySet<string>,
): CatalogEntry[] {
  let filtered = entries;

  if (quickFilters.has('topRated')) {
    filtered = filtered.filter((e) => (e.rating || 0) >= 4.5);
  }

  if (quickFilters.has('freeAndGerman')) {
    // NOTE: Tool-Daten nutzen englische pricing-Keys (free/freemium/premium/
    // enterprise); das language-Feld der Tools ist die Bundle-Sprache (immer
    // = UI-Sprache), taugt also nicht als Sprach-Capability-Filter — daher
    // filtern Tools nur nach pricing. Resources kennen de/multilingual/multi.
    filtered = filtered.filter((entry) => {
      if (entry.entryType === 'tool') {
        return entry.pricing === 'free' || entry.pricing === 'freemium';
      } else {
        return (
          !entry.isFreeBehindPaywall &&
          (entry.language === 'de' || entry.language === 'multilingual' || entry.language === 'multi')
        );
      }
    });
  }

  if (quickFilters.has('onlyFavorites')) {
    filtered = filtered.filter((e) => favorites.has(e.id));
  }

  return filtered;
}

export function sortCatalogEntries(entries: CatalogEntry[], order: CatalogSortOrder): CatalogEntry[] {
  const sorted = [...entries];

  switch (order) {
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'alphabetical':
      return sorted.sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));
    case 'newest':
      return sorted.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || '1970-01-01').getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || '1970-01-01').getTime();
        return dateB - dateA;
      });
    default:
      return sorted;
  }
}

/** The first `page` pages; a final batch of fewer than 20 is shown at once. */
export function pageWindow(all: CatalogEntry[], page: number, perPage: number): CatalogEntry[] {
  let maxItems = page * perPage;

  // Auto-load final batch if < 20 remaining
  const remaining = all.length - maxItems;
  if (remaining > 0 && remaining < 20) {
    maxItems = all.length;
  }

  return all.slice(0, maxItems);
}
