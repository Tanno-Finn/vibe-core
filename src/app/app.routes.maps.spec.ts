import { ExtendedRoute, extendedRoutes, routes } from './app.routes';
import { featureGuard } from './guards/feature.guard';
import { devRoutes } from './dev/dev.routes';
import { HOME_PATH, routeBreadcrumbs } from './components/shared/breadcrumb.component';
import {
  DEMO_ROUTE_TO_ILLUSTRATION,
  DEMO_ROUTE_TO_SNIPPET,
  SECTION_PATH_TO_SNIPPET,
} from './components/shared/thumbnail.component';
import { SEO_ROUTE_KEYS } from './services/meta-seo.service';
import { STRUCTURED_DATA_ROUTES } from './services/structured-data.service';
import { routedPagesByPath } from './utils/routed-pages';
import { FEATURES, SITE } from '../config/site';

/**
 * Route maps may only name routes that exist.
 *
 * The breadcrumb, JSON-LD and SEO services used to carry hand-written
 * route-to-label maps, and those kept naming demo routes the kit no longer
 * ships (anomaly-detection-demo, gans-demo, /timeline, ...) long after the
 * routes were gone — silently, because an unmatched key just never fires.
 * The trails are now derived from the routes; the few literal paths left are
 * exported so this spec can hold them against app.routes.ts.
 *
 * "Exists" means a routed page of the PRODUCTION config: loads a component,
 * is not a redirect (every lookup runs after redirects), and is not a dev
 * workshop route (dev.routes.ts is swapped for an empty file in prod).
 */
describe('app.routes — route maps name only real pages', () => {
  const workshopPaths = new Set(devRoutes.map((r) => r.path));
  const prodRoutes = extendedRoutes.filter((r) => !workshopPaths.has(r.path));
  const pagePaths = new Set(
    prodRoutes
      .filter((r) => r.path && r.path !== '**' && !r.redirectTo && (r.loadComponent || r.component))
      .map((r) => r.path as string),
  );
  const notAPage = (paths: readonly string[]) => paths.filter((p) => !pagePaths.has(p));

  it('finds the page set (sanity: the filter is not vacuous)', () => {
    expect(pagePaths.has('home')).toBe(true);
    expect(pagePaths.has('glossary')).toBe(true);
    expect(pagePaths.has('ai-tools')).toBe(false); // a redirect, not a page
  });

  it('SEO_ROUTE_KEYS (meta-seo.service) names only routed pages', () => {
    expect(notAPage(Object.keys(SEO_ROUTE_KEYS)), 'SEO_ROUTE_KEYS keys that are not a routed page').toEqual([]);
  });

  it('STRUCTURED_DATA_ROUTES (structured-data.service) names only routed pages', () => {
    expect(
      notAPage(Object.values(STRUCTURED_DATA_ROUTES)),
      'STRUCTURED_DATA_ROUTES that are not a routed page',
    ).toEqual([]);
  });

  it('the breadcrumb home path is a routed page', () => {
    expect(notAPage([HOME_PATH])).toEqual([]);
  });

  it('the start page of site.json is a routed page', () => {
    expect(notAPage([SITE.startPage])).toEqual([]);
  });

  describe('feature switches (src/config/features.json)', () => {
    const declared = new Set(prodRoutes.map((r) => r.path));

    it('every route a feature owns is declared, and every shell page is a routed page', () => {
      const undeclared = Object.entries(FEATURES.features).flatMap(([id, f]) =>
        f.routes.filter((r) => !declared.has(r)).map((r) => `${id}: ${r}`),
      );
      expect(undeclared, 'feature routes app.routes.ts does not declare').toEqual([]);
      expect(notAPage(FEATURES.shellPages)).toEqual([]);
    });

    it('the feature guard sits on exactly the component routes a feature owns', () => {
      const pages = (routes as ExtendedRoute[]).filter((r) => r.loadComponent && !r.redirectTo);
      const guarded = pages.filter((r) => r.canMatch?.includes(featureGuard)).map((r) => r.path);
      const owned = pages.filter((r) => SITE.featureOfRoute(r.path ?? '', r.group)).map((r) => r.path);
      expect(guarded).toEqual(owned);
      expect(guarded).toEqual(expect.arrayContaining(['glossary', 'news', 'learn', 'example-demo']));
      expect(guarded).not.toContain('home');
    });

    it('the root and the retired paths lead to the start page', () => {
      for (const path of ['', 'defaultsite', 'topics', 'ai-topics', 'unsupervised-learning-demo']) {
        expect(extendedRoutes.find((r) => r.path === path)?.redirectTo, path).toBe(SITE.startPage);
      }
    });
  });

  it('the thumbnail maps (thumbnail.component) name only routed pages', () => {
    const keys = [
      ...Object.keys(DEMO_ROUTE_TO_ILLUSTRATION),
      ...Object.keys(DEMO_ROUTE_TO_SNIPPET),
      ...Object.keys(SECTION_PATH_TO_SNIPPET).map((path) => path.replace(/^\//, '')),
    ];
    expect(notAPage(keys), 'thumbnail map keys that are not a routed page').toEqual([]);
  });

  describe('derived breadcrumb trails', () => {
    const pages = routedPagesByPath(prodRoutes);

    it('index only routed pages', () => {
      expect(notAPage([...pages.keys()])).toEqual([]);
    });

    it('link only to routed pages and label with the route’s own keys', () => {
      for (const [path, route] of pages) {
        const trail = routeBreadcrumbs(path, pages);
        const links = trail.filter((item) => item.url).map((item) => item.url!.replace(/^\//, ''));
        expect(notAPage(links), `trail links for ${path}`).toEqual([]);
        if (path === HOME_PATH) {
          expect(trail).toEqual([]);
        } else {
          expect(trail.at(-1)).toEqual({ label: path, translateKey: route.titleKey, url: `/${path}` });
        }
      }
    });

    it('yield no trail for a path that is not a routed page', () => {
      expect(routeBreadcrumbs('anomaly-detection-demo', pages)).toEqual([]);
      expect(routeBreadcrumbs('ai-tools', pages)).toEqual([]);
    });
  });
});
