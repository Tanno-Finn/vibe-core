/**
 * Translation Ready Guard
 *
 * Holds a route until the strings it renders are loaded, so neither the
 * prerenderer nor the browser renders raw keys (FOUC).
 *
 * The i18n bundles are split (scripts/build-i18n-bundles.ts): a small core
 * bundle per language plus lazily loaded chunks. This guard waits for the core
 * AND for the chunks of the route's own namespaces — the first segment of its
 * `titleKey` / `descriptionKey` (an article route's `articleGitIntro.hero.title`
 * names the `articleGitIntro` chunk) plus anything listed in the route's `i18n`
 * array. A namespace that is part of the core needs no declaration; one that is
 * neither declared nor in the core still loads on first lookup (a safety net
 * with a short flash in the browser — declare it on the route instead).
 *
 * Applied to every component route by applyGuards() in app.routes.ts.
 */
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { TranslationService } from '../services/translation.service';
import type { ExtendedRoute } from '../app.routes';

/** The i18n namespaces a route declares, directly or through its title keys. */
export function routeNamespaces(route: ExtendedRoute | null | undefined): string[] {
  if (!route) return [];
  const keys = [route.titleKey, route.descriptionKey].filter((k): k is string => !!k);
  const namespaces = [...keys.map((k) => k.split('.', 1)[0]), ...(route.i18n ?? [])];
  return namespaces.filter((ns, i) => namespaces.indexOf(ns) === i);
}

/**
 * Functional guard that ensures translations are loaded before allowing navigation
 */
export const translationReadyGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const translationService = inject(TranslationService);

  return from(translationService.whenReady(routeNamespaces(route.routeConfig as ExtendedRoute | null))).pipe(
    map(() => true),

    // Timeout after 20 seconds to prevent infinite waiting
    // (raised from 10s to tolerate slow connections / 3G)
    // The app-loading-overlay (app.component.ts) stays visible until this
    // resolves, so users see a loading UI instead of raw keys while waiting.
    timeout(20000),

    // If timeout or error, allow navigation anyway to prevent app being stuck.
    // Raw keys are better than a permanently frozen app — the global
    // ErrorHandler logs the problem and sessions have a reload option.
    catchError((error) => {
      console.warn('TranslationReadyGuard: Timeout or error, allowing navigation anyway:', error);
      return of(true);
    }),
  );
};
