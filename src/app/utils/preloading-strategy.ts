/**
 * Custom Preloading Strategy
 * Optimizes route preloading to improve performance while maintaining user experience.
 *
 * All delayed preloading uses timers OUTSIDE Angular zone so they don't prevent
 * hydration from completing (zone stability requires no pending macrotasks).
 */
import { Injectable, inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { SITE_CONFIG } from '../../config/site';

/**
 * Route paths preloaded right after bootstrap. Each must be a real,
 * component-loading route in app.routes.ts — not a redirect, which has nothing
 * to preload (checked by preloading-strategy.spec.ts). A path of a feature that
 * src/config/site.json switches off is skipped at runtime.
 */
export const HIGH_PRIORITY_PRELOAD_ROUTES: readonly string[] = ['home', 'glossary', 'catalog', 'learn'];

/** Route paths preloaded after a short delay. Same rule as above. */
export const MEDIUM_PRIORITY_PRELOAD_ROUTES: readonly string[] = ['ai-timeline'];

@Injectable({
  providedIn: 'root',
})
export class OptimizedPreloadingStrategy implements PreloadingStrategy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly site = inject(SITE_CONFIG);
  private preloadedRoutes = new Set<string>();

  /**
   * Determines which routes to preload and when
   */
  preload(route: Route, fn: () => Observable<unknown>): Observable<unknown> {
    // Never preload if already preloaded
    if (route.path && this.preloadedRoutes.has(route.path)) {
      return of(null);
    }

    const meta = route as Route & { devOnly?: boolean; contentType?: string; group?: string };

    // Never preload a page of a feature that site.json switches off (featureGuard blocks it anyway)
    if (route.path && !this.site.isRouteOn(route.path, meta.group)) {
      return of(null);
    }

    // Never preload the dev workshop (it only exists in dev builds anyway)
    if (meta.devOnly && !this.isDevMode()) {
      return of(null);
    }

    // High priority routes - preload immediately
    if (route.path && HIGH_PRIORITY_PRELOAD_ROUTES.includes(route.path)) {
      this.preloadedRoutes.add(route.path);
      return fn();
    }

    // Medium priority routes - preload with delay (outside zone)
    if (route.path && MEDIUM_PRIORITY_PRELOAD_ROUTES.includes(route.path)) {
      return this.deferPreload(2000, route.path, fn);
    }

    // Demo routes - derived from the route metadata (contentType: 'demo'), so a
    // new demo is picked up without touching this file. Longer delay, and only
    // if the user seems engaged.
    if (route.path && meta.contentType === 'demo' && !route.redirectTo) {
      return this.deferPreload(30000, route.path, fn, true);
    }

    // Low priority routes - only preload on user interaction
    return of(null);
  }

  /**
   * Defer route preloading with a timer that runs OUTSIDE Angular zone.
   * This prevents the timer macrotask from blocking zone stability / hydration.
   * The actual module load (fn()) re-enters the zone so Angular can process it.
   */
  private deferPreload(
    delayMs: number,
    routePath: string,
    fn: () => Observable<unknown>,
    checkEngagement = false,
  ): Observable<unknown> {
    return new Observable((subscriber) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      this.ngZone.runOutsideAngular(() => {
        timeoutId = setTimeout(() => {
          if (checkEngagement && !this.shouldPreloadDemo()) {
            subscriber.next(null);
            subscriber.complete();
            return;
          }
          this.preloadedRoutes.add(routePath);
          this.ngZone.run(() => {
            fn().subscribe({
              next: (val) => subscriber.next(val),
              error: (err) => subscriber.error(err),
              complete: () => subscriber.complete(),
            });
          });
        }, delayMs);
      });
      return () => clearTimeout(timeoutId);
    });
  }

  /**
   * Check if we should preload demo routes based on user engagement
   */
  private shouldPreloadDemo(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    // Check if user has interacted with the page
    const hasInteracted = document.body.dataset['userInteracted'] === 'true';

    // Check connection quality (avoid preloading on slow connections)
    const nav = navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } };
    if (nav.connection) {
      const isSlowConnection =
        nav.connection.effectiveType === 'slow-2g' || nav.connection.effectiveType === '2g' || nav.connection.saveData;
      if (isSlowConnection) return false;
    }

    return hasInteracted;
  }

  private isDevMode(): boolean {
    return !environment.production;
  }
}

// Add user interaction detection
if (typeof document !== 'undefined') {
  const markUserInteraction = () => {
    document.body.dataset['userInteracted'] = 'true';
  };

  // Listen for user interactions
  ['click', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
    document.addEventListener(event, markUserInteraction, { once: true, passive: true });
  });
}
