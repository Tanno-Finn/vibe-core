/**
 * featureGuard — a page of a feature that src/config/site.json switches off
 * (`features: { "news": false }`) is not served; the visitor lands on the start
 * page instead of a 404, because the link that led there (an old bookmark, a
 * search result from before the switch) was valid once.
 *
 * It is a `canMatch` guard, added by `applyGuards` in app.routes.ts to every
 * component route that src/config/features.json assigns to a feature. The
 * routes themselves stay declared: the server routes (app.routes.server.ts)
 * must name only client routes, and the prerender list and sitemap skip the
 * switched-off pages on their own (scripts/lib/site-config.mjs). Legacy
 * redirects need no guard — they lead to a guarded page.
 *
 * The start page itself can never be switched off: site-rules.mts refuses such
 * a site.json at load and scripts/check-site-config.mjs before the build, so
 * this redirect cannot loop.
 */
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { SITE_CONFIG } from '../../config/site';
import type { ExtendedRoute } from '../app.routes';

export const featureGuard: CanMatchFn = (route) => {
  const site = inject(SITE_CONFIG);
  const { path = '', group } = route as ExtendedRoute;
  if (site.isRouteOn(path, group)) return true;
  return inject(Router).createUrlTree([`/${site.startPage}`]);
};
