/**
 * Dev-only strip sentinel (SPEC N5, decision D2).
 *
 * The dev routes, workshop pages and guide-article components under `src/app/dev/`
 * import this constant (a few data modules do not; see DESIGN-SYSTEM.MD) and reference
 * it in a way the optimizer cannot tree-shake away (a rendered data attribute,
 * a route `data` value, an exported binding). The literal below therefore ends
 * up in the dev chunk of any dev-build, but must be ENTIRELY ABSENT from a
 * production build — the whole `src/app/dev/` tree is swapped out via the
 * `dev.routes.ts` -> `dev.routes.prod.ts` fileReplacement (angular.json).
 *
 * `scripts/verify-build.js` greps all of `dist/vibecore/` for this literal and
 * requires 0 hits in production. A dev build (`npm run build`) must contain >=1.
 *
 * The one exception is `dev.routes.prod.ts` (the prod replacement): it ships to
 * production and therefore must NOT contain the sentinel.
 */
export const VIBE_DEV_SENTINEL = '__VIBE_DEV_ONLY__';
