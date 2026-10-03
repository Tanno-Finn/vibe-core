import type { ExtendedRoute } from '../app.routes';

/**
 * Production replacement for dev.routes.ts (SPEC N5, decision D1).
 *
 * Swapped in by the `fileReplacements` entry in angular.json (production). It
 * exports the SAME symbol (`devRoutes`) as an empty array, so `...devRoutes` in
 * app.routes.ts contributes nothing and the entire `src/app/dev/` tree is left
 * unreferenced by the prod route graph — and therefore stripped from the bundle.
 *
 * IMPORTANT: this is the one file under src/app/dev/ that DOES ship to
 * production, so it must NOT contain the strip sentinel literal. If it did, the
 * verify-build.js sentinel check would (correctly) fail.
 */
export const devRoutes: ExtendedRoute[] = [];
