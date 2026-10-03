/**
 * Route Generator Utility
 * This file contains utility functions for generating Angular routes.
 */
import type { ExtendedRoute } from '../app.routes';

/**
 * Generates redirect routes for all page IDs.
 * This allows navigation using the short page ID instead of the full path.
 *
 * @param routes The extended routes to process
 * @returns An array of redirect routes
 */
export function generatePageIdRedirects(routes: ExtendedRoute[]): ExtendedRoute[] {
  const redirectRoutes: ExtendedRoute[] = [];
  const usedPageIds = new Set<string>();

  // Pre-scan: collect every explicit pageId (case-sensitive). Used below to
  // suppress lowercase-alias creation when another route already declares the
  // lowercase form as its own explicit pageId — e.g. a route with pageId `ABCD`
  // must not shadow another route's explicit `abcd`. Without this guard, the
  // alias from the first route claims `abcd` and the second route logs a noisy
  // "Duplicate page ID" warning.
  const explicitPageIds = new Set<string>();
  for (const route of routes) {
    if (route.pageId) explicitPageIds.add(route.pageId);
  }

  // Process each route
  for (const route of routes) {
    // Skip routes without pageId or path, or redirect routes
    if (!route.pageId || !route.path || route.redirectTo || route.hidden) {
      continue;
    }

    // Skip if the pageId is the same as the path (would cause infinite redirect)
    if (route.pageId === route.path) {
      continue;
    }

    // Skip if this pageId is already used for another redirect
    if (usedPageIds.has(route.pageId)) {
      console.warn(`Duplicate page ID detected: ${route.pageId}. Skipping redirect for ${route.path}`);
      continue;
    }

    // Skip if this pageId is already a path for another route
    if (routes.some((r) => r.path === route.pageId && !r.redirectTo && !r.hidden)) {
      console.warn(`Page ID ${route.pageId} conflicts with existing route path. Skipping redirect.`);
      continue;
    }

    // Create redirect route (uppercase pageId as canonical)
    redirectRoutes.push({
      path: route.pageId,
      redirectTo: route.path,
      pathMatch: 'full',
      hidden: true,
    });

    // Mark this pageId as used
    usedPageIds.add(route.pageId);

    // Also create lowercase alias so book URLs like /euai work
    // (Angular router is case-sensitive, but printed book URLs use lowercase).
    // Skip if another route declares this lowercase form as its OWN explicit
    // pageId — that route gets to claim the redirect on its turn.
    const lowerPageId = route.pageId.toLowerCase();
    if (
      lowerPageId !== route.pageId &&
      !usedPageIds.has(lowerPageId) &&
      !explicitPageIds.has(lowerPageId) &&
      !routes.some((r) => r.path === lowerPageId && !r.redirectTo && !r.hidden)
    ) {
      redirectRoutes.push({
        path: lowerPageId,
        redirectTo: route.path,
        pathMatch: 'full',
        hidden: true,
      });
      usedPageIds.add(lowerPageId);
    }
  }

  return redirectRoutes;
}
