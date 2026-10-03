/**
 * CatalogStateService — the visitor's catalog favorites and comparison list.
 *
 * Both used to live in CatalogComponent's own fields, so they were stored in
 * localStorage but never reached the user-data export/import. This service
 * owns them now and is a `UserDataProvider` (slice `catalog`), registered in
 * app.config.ts; its keys are in utils/storage-keys.ts.
 *
 * Reading from storage is still triggered by the page (`load()` on every
 * visit, as before), which also runs the one-time merge of the old
 * ai-tools / ai-resources keys.
 */
import { Injectable, signal } from '@angular/core';
import { UserDataProvider } from '../../models/user-data-provider';
import { CatalogSlice } from '../../models/user-data-envelope';
import { safeStorage } from '../../utils/safe-storage';

const FAVORITES_KEY = 'catalog-favorites';
const COMPARE_KEY = 'catalog-compare';

@Injectable({ providedIn: 'root' })
export class CatalogStateService implements UserDataProvider<'catalog'> {
  readonly sliceKey = 'catalog' as const;
  readonly storageKeys = [FAVORITES_KEY, COMPARE_KEY] as const;

  readonly favoriteEntries = signal<Set<string>>(new Set());
  readonly compareTools = signal<Set<string>>(new Set());

  // --- Loading ---

  load(): void {
    // Migrate old localStorage keys if present
    this.migrateOldFavorites();

    // Start from empty lists, as the page's own fields used to on every visit:
    // storage is the source of truth, not what an earlier visit left here.
    this.favoriteEntries.set(new Set());
    this.compareTools.set(new Set());

    // Load favorites
    const favorites = safeStorage.get(FAVORITES_KEY);
    if (favorites) {
      try {
        this.favoriteEntries.set(new Set(JSON.parse(favorites)));
      } catch {
        // Unparseable storage value: keep the empty default set — the next
        // toggle rewrites the key with valid JSON.
      }
    }

    // Load compare list
    const compareList = safeStorage.get(COMPARE_KEY);
    if (compareList) {
      try {
        this.compareTools.set(new Set(JSON.parse(compareList)));
      } catch {
        // Same as above: an empty compare list is the safe fallback.
      }
    }
  }

  // --- Favorites ---

  toggleFavorite(id: string): void {
    const currentList = new Set(this.favoriteEntries());

    if (currentList.has(id)) {
      currentList.delete(id);
    } else {
      currentList.add(id);
    }

    this.favoriteEntries.set(currentList);
    safeStorage.set(FAVORITES_KEY, JSON.stringify([...currentList]));
  }

  // --- Compare ---

  toggleCompare(id: string): void {
    const currentList = new Set(this.compareTools());

    if (currentList.has(id)) {
      currentList.delete(id);
    } else {
      currentList.add(id);
    }

    this.compareTools.set(currentList);
    safeStorage.set(COMPARE_KEY, JSON.stringify([...currentList]));
  }

  clearCompare(): void {
    this.compareTools.set(new Set());
    safeStorage.remove(COMPARE_KEY);
  }

  // --- UserDataProvider ---

  exportSlice(): CatalogSlice | null {
    const slice: CatalogSlice = {};
    const favorites = this.readIds(FAVORITES_KEY);
    const compare = this.readIds(COMPARE_KEY);
    if (favorites.length > 0) slice.favorites = favorites;
    if (compare.length > 0) slice.compare = compare;
    return slice.favorites || slice.compare ? slice : null;
  }

  validateSlice(data: unknown): data is CatalogSlice {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    const obj = data as Record<string, unknown>;
    for (const field of ['favorites', 'compare']) {
      const value = obj[field];
      if (value === undefined) continue;
      if (!Array.isArray(value) || !value.every((id) => typeof id === 'string')) return false;
    }
    return true;
  }

  importSlice(data: CatalogSlice): void {
    if (data.favorites) {
      this.favoriteEntries.set(new Set(data.favorites));
      safeStorage.set(FAVORITES_KEY, JSON.stringify(data.favorites));
    }
    if (data.compare) {
      this.compareTools.set(new Set(data.compare));
      safeStorage.set(COMPARE_KEY, JSON.stringify(data.compare));
    }
  }

  /**
   * Export reads storage, not the signals: the signals are only filled once
   * the catalog page has been opened in this session, the stored lists exist
   * either way.
   */
  private readIds(key: string): string[] {
    const raw = safeStorage.get(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }

  /**
   * Migrate old ai-tools-favorites and ai-resources-favorites
   * into unified catalog-favorites, then remove old keys.
   * Same for compare.
   */
  private migrateOldFavorites(): void {
    const oldToolsFav = safeStorage.get('ai-tools-favorites');
    const oldResourcesFav = safeStorage.get('ai-resources-favorites');

    if (oldToolsFav || oldResourcesFav) {
      const existing = safeStorage.get(FAVORITES_KEY);
      const mergedSet = new Set<string>();

      // Load existing catalog favorites if any
      if (existing) {
        try {
          JSON.parse(existing).forEach((id: string) => mergedSet.add(id));
        } catch {
          // Corrupt current favorites: fall back to the legacy keys below
          // rather than losing the migration entirely.
        }
      }

      // Merge old tools favorites
      if (oldToolsFav) {
        try {
          JSON.parse(oldToolsFav).forEach((id: string) => mergedSet.add(id));
        } catch {
          // Corrupt legacy JSON: the entries are unrecoverable, so keep the
          // ones already merged instead of aborting the whole migration.
        }
      }

      // Merge old resources favorites
      if (oldResourcesFav) {
        try {
          JSON.parse(oldResourcesFav).forEach((id: string) => mergedSet.add(id));
        } catch {
          // Same as above: skip the unreadable list, keep what parsed.
        }
      }

      // Write first, verify, only then drop the old keys. safeStorage.set
      // swallows quota/Private-Mode errors by design, so an unverified
      // remove-then-write would silently destroy the user's favorites.
      const merged = JSON.stringify([...mergedSet]);
      safeStorage.set(FAVORITES_KEY, merged);
      if (safeStorage.get(FAVORITES_KEY) === merged) {
        safeStorage.remove('ai-tools-favorites');
        safeStorage.remove('ai-resources-favorites');
      }
    }

    // Migrate compare
    const oldToolsCompare = safeStorage.get('ai-tools-compare');
    if (oldToolsCompare) {
      const existing = safeStorage.get(COMPARE_KEY);
      const mergedSet = new Set<string>();

      if (existing) {
        try {
          JSON.parse(existing).forEach((id: string) => mergedSet.add(id));
        } catch {
          // Corrupt current compare list: start from the legacy entries only.
        }
      }

      try {
        JSON.parse(oldToolsCompare).forEach((id: string) => mergedSet.add(id));
      } catch {
        // Corrupt legacy compare list: nothing to migrate, keep what exists.
      }

      // Same write-verify-remove order as the favorites above.
      const mergedCompare = JSON.stringify([...mergedSet]);
      safeStorage.set(COMPARE_KEY, mergedCompare);
      if (safeStorage.get(COMPARE_KEY) === mergedCompare) {
        safeStorage.remove('ai-tools-compare');
      }
    }
  }
}
