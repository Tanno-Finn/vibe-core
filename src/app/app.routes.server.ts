import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server-side rendering configuration per route.
 *
 * Default: every route is prerendered at build time and SSR-rendered at dev/edge
 * (Tiered Selective Prerendering — the tiers themselves are defined in
 * `scripts/generate-prerender-routes.js`). The wildcard at the bottom catches
 * everything not listed above.
 *
 * Demos are forced to `RenderMode.Client`: they have no SEO value (interactive
 * canvas / animation / state, no indexable content), and putting them through
 * the server-renderer just produces noise — `requestAnimationFrame is not
 * defined`, `window is not defined`, `HTMLCanvasElement.fillText: NotYetImplemented`,
 * etc. With Client mode the server returns the bare app-shell and the demo
 * mounts entirely in the browser.
 *
 * This file and the prerender list are separate switches. What actually gets
 * rendered at build time is the route list `scripts/generate-prerender-routes.js`
 * writes; `RenderMode.Client` here governs how a NON-prerendered route is served.
 * `demos` is deliberately in both — Client here, and in TIER_1_ROUTES there, so
 * the overview still ships prerendered content.
 *
 * If you add a new interactive demo, add its route here too.
 */

const DEMO_ROUTES: ServerRoute[] = [
  // Overview page (lists all demos — also interactive filtering, no SEO need)
  { path: 'demos', renderMode: RenderMode.Client },

  // Interactive demos (canvas / animation / state — no SEO value, Client-only).
  // Every path here must also exist in the client routing (app.routes.ts):
  // Angular's dev server validates server routes against it and refuses to
  // start on a mismatch. If you add a new interactive demo, add its route here.
  { path: 'example-demo', renderMode: RenderMode.Client },
  { path: 'unsupervised-learning-demo', renderMode: RenderMode.Client },
];

export const serverRoutes: ServerRoute[] = [...DEMO_ROUTES, { path: '**', renderMode: RenderMode.Prerender }];
