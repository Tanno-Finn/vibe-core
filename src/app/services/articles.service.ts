import { Injectable, inject, isDevMode } from '@angular/core';
import { BaseIndexContentService, BaseIndexContentMeta } from './base-index-content.service';
import { TimeGateService } from './time-gate.service';
import { LearningPathService } from './learning-path.service';
import { Milestones } from './milestones.types';

/**
 * Article metadata interface
 * Extends base with article-specific fields
 */
export interface ArticleMeta extends BaseIndexContentMeta {
  /** Optimus UI icon class - OPTIONAL for articles (they inherit hub icon) */
  icon?: string;
  /** 4-character page ID for book integration */
  pageId: string;
  /**
   * Scheduled publish date (ISO 'YYYY-MM-DD'). Until reached, the article is
   * blocked from production listings, prerender output, sitemap and direct
   * URL navigation. In dev mode the article stays visible but is marked
   * with a "Scheduled" badge so the author can preview the content.
   * Omitted ⇒ no per-article time gate. A second, cascading
   * gate from the containing learning path's `publishDate`.
   */
  publishDate?: string;
  /** What finishing this article means on the /progress page (see milestones.types.ts). */
  milestones?: Milestones;
}

/**
 * ArticlesService
 *
 * Provides access to article metadata for hub pages and navigation.
 * Extends BaseIndexContentService for common functionality.
 *
 * Visibility = !draft
 *           && timeGate.isPublished(article.publishDate)
 *           && timeGate.isPublished(containingPath.publishDate)   ← path cascade
 *
 * The path cascade closes the gap where articles in time-locked learning
 * paths were freely reachable on prod because only the path overview UI
 * read the path-level publishDate. Single source of truth remains the
 * path definition in `learning-paths.json` — no per-article duplicate.
 */
@Injectable({
  providedIn: 'root',
})
export class ArticlesService extends BaseIndexContentService<ArticleMeta> {
  protected readonly DATA_URL = 'assets/data/core/articles/index.json';

  private timeGate = inject(TimeGateService);
  private learningPaths = inject(LearningPathService);

  /**
   * Visibility predicate. In dev mode every article visible (author preview);
   * in production builds, both gating layers must pass.
   *
   * Uses Angular's `isDevMode()` rather than DevModeService's toggleable
   * `isEffectivelyProd()` signal (the same rule the route guards follow):
   * an accidentally-on prod-simulation toggle would silently hide drafts
   * and scheduled articles with no obvious cause.
   */
  isVisible(article: ArticleMeta): boolean {
    if (isDevMode()) return true;
    return this.isVisibleInProd(article);
  }

  /**
   * The production-visibility gate WITHOUT the dev-mode preview shortcut:
   * not draft, publishDate reached, and the containing learning path released
   * (the path cascade). Used by toggle-aware discovery surfaces (concept-map,
   * related-refs) that honor `DevModeService.isEffectivelyProd` rather than
   * `isDevMode` — so flipping "simulate prod" hides scheduled content.
   */
  isVisibleInProd(article: ArticleMeta): boolean {
    if (article.draft) return false;
    if (!this.timeGate.isPublished(article.publishDate)) return false;
    return this.isContainingPathPublished(article.id);
  }

  /**
   * Whether a given article is scheduled but not yet released. Considers both
   * per-article publishDate and the cascading path publishDate. True only in
   * dev mode (in prod, gated articles are filtered out by the isVisible
   * consumers and blocked by the route guard so this signal does not fire).
   * Used by templates to render the "scheduled" badge.
   */
  isScheduled(article: ArticleMeta | undefined | null): boolean {
    if (!article) return false;
    if (article.publishDate && !this.timeGate.isPublished(article.publishDate)) {
      return true;
    }
    return !this.isContainingPathPublished(article.id);
  }

  private isContainingPathPublished(articleId: string): boolean {
    const pathId = this.learningPaths.getPathForArticle(articleId);
    if (!pathId) return true; // not in any path → no cascade gate
    const path = this.learningPaths.getPath(pathId);
    if (!path) return true;
    return this.learningPaths.isPathPublished(path);
  }
}
