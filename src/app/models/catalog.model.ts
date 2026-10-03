/**
 * Catalog Data Models
 *
 * Unified model for the catalog, which merges tools and resources
 * into a single browsable catalog with type discrimination.
 */

export type EntryType = 'tool' | 'resource';

export interface CatalogEntryBase {
  id: string;
  entryType: EntryType;
  url: string;
  rating?: number;
  difficulty: string;
  tags: string[];
  description: string;
  shortDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogToolEntry extends CatalogEntryBase {
  entryType: 'tool';
  name: string;
  category: string;
  pricing: string;
  deployment: string;
  // The list-shaped fields are optional because the actual JSON content does
  // not always carry them: features/useCases live in the per-language
  // translation files (always present there today, but not guaranteed by
  // schema), while pros/cons/alternatives are 100 % absent from the current
  // 137 DE tool translations. Marking them optional matches runtime reality
  // and lets templates / services use `?.` / `?? []` honestly without
  // tripping NG8107.
  features?: string[];
  useCases?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  privacy?: string;
  integration?: string;
  support?: string;
  performance?: string;
  targetAudience?: string;
  platform?: string;
  language?: string;
}

export interface CatalogResourceEntry extends CatalogEntryBase {
  entryType: 'resource';
  title: string;
  mediaType: string;
  topic: string;
  language: string;
  source: string;
  author?: string;
  publishedDate?: string;
  lastUpdated?: string;
  estimatedTime?: string;
  isFreeBehindPaywall?: boolean;
  requiresRegistration?: boolean;
}

export type CatalogEntry = CatalogToolEntry | CatalogResourceEntry;

export interface CatalogFilters {
  searchTerm: string;
  entryTypes: EntryType[];
  categories: string[];
  mediaTypes: string[];
  topics: string[];
  difficulties: string[];
  languages: string[];
  pricing: string[];
  onlyFree: boolean;
  maxEstimatedTime?: number;
  minRating?: number;
}

/** Get display name regardless of entry type */
export function getDisplayName(entry: CatalogEntry): string {
  return entry.entryType === 'tool' ? entry.name : entry.title;
}
