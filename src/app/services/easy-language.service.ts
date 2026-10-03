/**
 * Easy Language Service — answers the question the Easy-Language FAB asks of
 * every page: "is there an Easy-Language version of this?".
 *
 * The answer is DERIVED, not maintained: a page has an Easy-Language version
 * when every locale carries its preview under `easyLanguage.content.<id>` in
 * src/assets/i18n/modules. scripts/build-i18n-bundles.ts writes that set to
 * src/config/easy-language-availability.json (committed; check-i18n-keys.mjs
 * fails when it is stale). This replaced a hand-written map of 126 entries,
 * most of them pages the kit does not ship.
 *
 * It used to append every mode switch to a local `easyLanguageAnalytics` log
 * that nothing ever read (PRIV-002). That log is gone; old copies are removed
 * via the storage-key registry (utils/storage-keys.ts).
 */

import { Injectable } from '@angular/core';
import availability from '../../config/easy-language-availability.json';

export type EasyContentType = 'article' | 'interview' | 'tool' | 'resource' | 'demo' | 'page' | 'blog';

export interface EasyLanguageContent {
  originalId: string;
  hasEasyVersion: boolean;
  qualityLevel: 'A1' | 'A2' | 'B1';
  contentType?: EasyContentType;
  lastUpdated?: Date;
}

/**
 * The register the kit writes Easy Language in. Every entry of the former
 * hand-written registry said A2; the kit has no per-page level data.
 */
export const EASY_LANGUAGE_LEVEL = 'A2' as const;

/** Route slug -> preview key: art-eu-ai-act -> artEuAiAct, seed-article-1 -> seedArticle1. */
export function easyPreviewId(contentId: string): string {
  return contentId.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

@Injectable({
  providedIn: 'root',
})
export class EasyLanguageService {
  private readonly available = new Set<string>(availability.ids);
  // Explicit registrations (addEasyContent) override the derived index, keyed by slug.
  private readonly overrides = new Map<string, EasyLanguageContent>();

  /**
   * Check if specific content has an Easy Language version. The contentType
   * parameter is accepted for callers that pass one but never gates: callers
   * derive it themselves and often disagree, which once hid the FAB silently.
   */
  hasEasyVersion(contentId: string, _contentType?: string): boolean {
    return this.getEasyContent(contentId)?.hasEasyVersion ?? false;
  }

  /**
   * Easy Language information for a page, or null when the kit knows nothing
   * about it. A registered entry without a version is returned too, so callers
   * can tell "known, no" from "unknown".
   */
  getEasyContent(contentId: string): EasyLanguageContent | null {
    const registered = this.overrides.get(contentId);
    if (registered) return registered;
    if (!contentId || !this.available.has(easyPreviewId(contentId))) return null;
    return { originalId: contentId, hasEasyVersion: true, qualityLevel: EASY_LANGUAGE_LEVEL };
  }

  /**
   * All pages with an Easy Language version. Ids from the derived index are
   * the camelCase preview ids (the slug is not recoverable from them).
   */
  getAllEasyContent(): EasyLanguageContent[] {
    const derived = [...this.available]
      .filter((id) => ![...this.overrides.keys()].some((slug) => easyPreviewId(slug) === id))
      .map((id): EasyLanguageContent => ({ originalId: id, hasEasyVersion: true, qualityLevel: EASY_LANGUAGE_LEVEL }));
    const registered = [...this.overrides.values()].filter((c) => c.hasEasyVersion);
    return [...derived, ...registered];
  }

  /**
   * Register (or override) a page's Easy Language information at runtime.
   */
  addEasyContent(content: EasyLanguageContent): void {
    this.overrides.set(content.originalId, content);
  }

  /**
   * Remove a runtime registration; the derived index answers again.
   */
  removeEasyContent(contentId: string): void {
    this.overrides.delete(contentId);
  }
}
