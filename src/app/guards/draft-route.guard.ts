/**
 * Article Visibility Route Guard (file name kept for backwards-compat —
 * still wired up everywhere as `draftRouteGuard`).
 *
 * Blocks navigation to articles that are either:
 *   - drafts (article.draft === true), OR
 *   - scheduled but not yet released — either via the article's own
 *     publishDate or via the containing learning path's publishDate
 *     (the learning-path cascade). Both gates live inside ArticlesService.isVisible
 *     so this guard transparently inherits the cascade.
 *
 * Redirects to /learn instead (to the start page while site.json switches the
 * learn feature off, to /home when that start page is this very article, so
 * it cannot loop — `SiteRules.fallbackFrom`). In dev mode (`ng serve`) every article is
 * reachable so the author can preview drafts and scheduled releases;
 * the in-page banner ("Scheduled für …") signals the gated state.
 *
 * Uses `isDevMode()` rather than DevModeService.isEffectivelyProd() so
 * an accidentally-on prod-simulation toggle does not silently make
 * scheduled articles disappear from the dev preview. Matches the
 * pattern in demoReleaseGuard.
 *
 * What the publishDate gate is — and is not: a publishing schedule, not a
 * confidentiality boundary. A scheduled article's data is in the production
 * bundle from the moment it is built; the gate only decides when the UI shows
 * it, so a release needs no redeploy. Anyone reading the JSON assets can see it
 * early. Content that must stay private until its release belongs on `draft`,
 * which keeps it out of the bundle altogether.
 */
import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { SITE_CONFIG } from '../../config/site';
import { ArticlesService } from '../services/articles.service';

export const draftRouteGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const site = inject(SITE_CONFIG);

  if (isDevMode()) {
    return true;
  }

  // Extract article ID from path (e.g., 'articles/art-big-o' -> 'art-big-o')
  const path = route.routeConfig?.path;
  if (!path || !path.startsWith('articles/')) {
    return true; // Not an article route
  }

  const articleId = path.replace('articles/', '');
  const articlesService = inject(ArticlesService);

  return articlesService.getById(articleId).pipe(
    map((article) => {
      if (!article) return true; // Unknown ID — let routing fall through to wildcard
      if (articlesService.isVisible(article)) return true;
      return router.createUrlTree([`/${site.fallbackFrom(path)}`]);
    }),
  );
};
