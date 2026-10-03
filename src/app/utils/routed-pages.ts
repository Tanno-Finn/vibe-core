/**
 * Routed pages — the routes of a config that render a page of their own.
 *
 * Breadcrumb trails (the visible `app-breadcrumb` and the JSON-LD
 * BreadcrumbList) read their labels from here instead of keeping a
 * hand-written route-to-label map, so they can only ever name a route that
 * exists. Hand-written maps of this kind drifted: they still named demo routes
 * the kit no longer ships.
 */
import type { ExtendedRoute } from '../app.routes';

/**
 * Index the routes that load a component and carry a `titleKey`, keyed by
 * their path. Redirects, the wildcard and parameterized paths (`:slug`) are
 * left out: none of them is a page a trail could link to.
 */
export function routedPagesByPath(routes: readonly ExtendedRoute[]): Map<string, ExtendedRoute> {
  const pages = new Map<string, ExtendedRoute>();
  for (const route of routes) {
    if (!route.path || route.path === '**' || route.path.includes(':')) continue;
    if (route.redirectTo || !(route.loadComponent || route.component) || !route.titleKey) continue;
    pages.set(route.path, route);
  }
  return pages;
}
