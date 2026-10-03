import type { ExtendedRoute } from '../app.routes';
import { VIBE_DEV_SENTINEL } from './dev-sentinel';
import { articleRegistry } from './articles/article-registry';

/**
 * One lazy child route per guide article, GENERATED from `articleRegistry`
 * (SPEC N5, Guides extension). Path is the literal `dev/design/guide/<id>` (a
 * distinct 3-segment path, so it never collides with the 2-segment
 * `dev/design/:slug` component-detail route). Each carries the entry's own
 * `loadComponent`, plus `devOnly`/`hidden`/`data.devSentinel` like every other
 * workshop route — so the whole set is stripped in prod via the same
 * dev.routes.ts -> dev.routes.prod.ts fileReplacement. New registry entry ->
 * new route automatically; check-design-guides.mjs verifies the 1:1 mapping.
 */
const guideRoutes: ExtendedRoute[] = articleRegistry.map((article) => ({
  path: `dev/design/guide/${article.id}`,
  devOnly: true,
  hidden: true,
  // staticTitle: literal <title> source for MetaSeoService's route-title
  // fallback (guides are English-canonical, so no i18n key exists for them).
  data: { devSentinel: VIBE_DEV_SENTINEL, staticTitle: article.title },
  loadComponent: article.loadComponent,
}));

/**
 * Real dev-only workshop routes (SPEC N5, decision D1).
 *
 * Spread into `app.routes.ts` before the wildcard route. In a production build
 * this whole file is swapped for `dev.routes.prod.ts` (which exports `[]`) via
 * the `fileReplacements` entry in angular.json, so none of these lazy chunks —
 * nor the `src/app/dev/` tree they import — reach the prod bundle.
 *
 * The hub, gallery and agents pages are listed in the navigation while the
 * dev server runs (group `development` — NavigationService drops that group,
 * and every `devOnly` route, under effective prod, incl. the PROD-simulate
 * toggle). The `:slug` detail route stays `hidden` (no direct nav entry).
 * Sitemap and prerender never see any of these routes: both scripts read
 * app.routes.ts only, and the prod build swaps this file for the empty
 * `dev.routes.prod.ts`. The `data.devSentinel` binding keeps
 * VIBE_DEV_SENTINEL referenced so the strip-proof literal survives
 * tree-shaking in dev builds (see dev-sentinel.ts).
 *
 * `import type { ExtendedRoute }` is deliberately type-only: it erases at
 * runtime, so the app.routes <-> dev.routes pair has no runtime import cycle.
 */
export const devRoutes: ExtendedRoute[] = [
  {
    path: 'dev',
    devOnly: true,
    titleKey: 'app.nav.devWorkshop',
    icon: 'pi pi-wrench',
    group: 'development',
    groupTitleKey: 'app.nav.group.development',
    data: { devSentinel: VIBE_DEV_SENTINEL },
    loadComponent: () => import('./dev-hub.component').then((m) => m.DevHubComponent),
  },
  {
    path: 'dev/design',
    devOnly: true,
    titleKey: 'app.nav.devDesign',
    icon: 'pi pi-palette',
    group: 'development',
    groupTitleKey: 'app.nav.group.development',
    data: { devSentinel: VIBE_DEV_SENTINEL },
    loadComponent: () =>
      import('./dev-design-gallery.component').then((m) => m.DevDesignGalleryComponent),
  },
  {
    path: 'dev/design/:slug',
    devOnly: true,
    hidden: true,
    // No nav entry, but the titleKey keeps the browser <title> speaking
    // (MetaSeoService route-title fallback) instead of the generic default.
    titleKey: 'app.nav.devDesign',
    data: { devSentinel: VIBE_DEV_SENTINEL },
    loadComponent: () =>
      import('./dev-design-detail.component').then((m) => m.DevDesignDetailComponent),
  },
  {
    path: 'dev/agents',
    devOnly: true,
    titleKey: 'app.nav.devAgents',
    icon: 'pi pi-map',
    group: 'development',
    groupTitleKey: 'app.nav.group.development',
    data: { devSentinel: VIBE_DEV_SENTINEL },
    loadComponent: () =>
      import('./dev-agents.component').then((m) => m.DevAgentsComponent),
  },
  // Generated guide-article routes (dev/design/guide/<id>), one per registry entry.
  ...guideRoutes,
];
