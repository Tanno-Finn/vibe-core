/**
 * Demo Release Route Guard
 *
 * Blocks navigation to a demo route until its scheduled `publishDate`
 * (set in src/assets/data/core/demos/index.json) has been reached.
 * Redirects to /learn instead (to the start page while site.json switches the
 * learn feature off, to /home when that start page is this very demo, so it
 * cannot loop — `SiteRules.fallbackFrom`). This is the route-level half of the staged
 * weekly demo drop; the UI surfaces (nav, /demos grid, learning-path
 * overview) hide the demo independently via DemosService.isVisible.
 *
 * In dev mode (`ng serve`) every demo is reachable so the author can
 * preview unreleased demos. Uses `isDevMode()` (not DevModeService) to
 * match draftRouteGuard — an accidentally-on
 * prod-simulation toggle must not silently hide scheduled demos in dev.
 *
 * What this gate is — and is not: a publishing schedule, not a confidentiality
 * boundary. The scheduled item's data (index entry, translations, chunk) is in
 * the production bundle from the moment it is built; the gate only decides when
 * the UI shows it, so a release needs no redeploy. Anyone reading the JSON
 * assets can see it early. Content that must stay private until its release
 * belongs on `draft`, which keeps it out of the bundle altogether.
 */
import { inject, isDevMode } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { SITE_CONFIG } from '../../config/site';
import { DemosService } from '../services/demos.service';

export const demoReleaseGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const site = inject(SITE_CONFIG);
  const path = route.routeConfig?.path;
  const demosService = inject(DemosService);

  if (isDevMode()) {
    // Dev allows everything, but a demo route with no registry entry means
    // release gating silently cannot apply in prod — say so where the author
    // can see it, instead of failing silently there.
    if (path) {
      demosService.getAllDemos().subscribe((demos) => {
        if (!demos.some((d) => d.path === path)) {
          console.warn(
            `[demoReleaseGuard] route '${path}' has no entry in ` +
              `src/assets/data/core/demos/index.json — it will be reachable in ` +
              `prod regardless of any intended publishDate.`,
          );
        }
      });
    }
    return true;
  }

  if (!path) {
    return true;
  }

  return demosService.getAllDemos().pipe(
    map((demos) => {
      const demo = demos.find((d) => d.path === path);
      if (!demo) return true; // Not a registered demo — let routing fall through
      if (demosService.isVisible(demo)) return true;
      return router.createUrlTree([`/${site.fallbackFrom(path)}`]);
    }),
  );
};
