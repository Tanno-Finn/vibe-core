import { extendedRoutes } from '../app.routes';
import { HIGH_PRIORITY_PRELOAD_ROUTES, MEDIUM_PRIORITY_PRELOAD_ROUTES } from './preloading-strategy';

/**
 * The preloading strategy matches routes by path. When a page is renamed or
 * turned into a redirect, a stale name here silently preloads nothing — which
 * is how the list once ended up naming routes that no longer existed. Pin it:
 * every named path must be a real, component-loading route.
 */
describe('OptimizedPreloadingStrategy route lists', () => {
  const loadable = new Set(
    extendedRoutes.filter((r) => typeof r.path === 'string' && r.loadComponent && !r.redirectTo).map((r) => r.path),
  );

  it('names only component-loading routes (no redirects, no removed pages)', () => {
    const stale = [...HIGH_PRIORITY_PRELOAD_ROUTES, ...MEDIUM_PRIORITY_PRELOAD_ROUTES].filter((p) => !loadable.has(p));
    expect(stale, 'preload paths that are not loadable routes').toEqual([]);
  });

  it('has at least one demo route for the metadata-derived demo tier', () => {
    const demos = extendedRoutes.filter((r) => r.contentType === 'demo' && r.loadComponent && !r.redirectTo);
    expect(demos.length).toBeGreaterThan(0);
  });
});
