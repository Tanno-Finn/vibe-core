/**
 * Article Meta Service
 *
 * Provides access to article metadata including tool and resource references.
 * This service enables:
 * - Looking up tool/resource references for an article
 * - Reverse lookups (which articles reference a specific tool/resource)
 * - Integration with the unified content bundle
 */

import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UnifiedContentService, ArticleMeta } from './unified-content.service';

@Injectable({
  providedIn: 'root',
})
export class ArticleMetaService {
  private unifiedContent = inject(UnifiedContentService);

  // Convert observable to signal for reactive access
  private articleMetaSignal = toSignal(this.unifiedContent.articleMeta$, {
    initialValue: {} as Record<string, ArticleMeta>,
  });

  /**
   * Get all article metadata as a record
   */
  getAllArticleMeta(): Record<string, ArticleMeta> {
    return this.articleMetaSignal() ?? {};
  }

  /**
   * Get metadata for a specific article
   */
  getArticle(articleId: string): ArticleMeta | undefined {
    return this.getAllArticleMeta()[articleId];
  }

  /**
   * Get tool references for a specific article
   */
  getToolReferences(articleId: string): string[] {
    return this.getArticle(articleId)?.toolReferences ?? [];
  }

  /**
   * Get resource references for a specific article
   */
  getResourceReferences(articleId: string): string[] {
    return this.getArticle(articleId)?.resourceReferences ?? [];
  }

  /**
   * Reverse lookup: Find all articles that reference a specific tool
   */
  getArticlesReferencingTool(toolId: string): string[] {
    const allMeta = this.getAllArticleMeta();
    return Object.entries(allMeta)
      .filter(([_, meta]) => meta.toolReferences?.includes(toolId))
      .map(([id]) => id);
  }

  /**
   * Reverse lookup: Find all articles that reference a specific resource
   */
  getArticlesReferencingResource(resourceId: string): string[] {
    const allMeta = this.getAllArticleMeta();
    return Object.entries(allMeta)
      .filter(([_, meta]) => meta.resourceReferences?.includes(resourceId))
      .map(([id]) => id);
  }
}
