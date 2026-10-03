import { extendedRoutes } from './app.routes';
import { devRoutes } from './dev/dev.routes';
import { adminDebugGuard } from './guards/admin-debug.guard';

/**
 * `devOnly: true` hides a route from navigation — it is NOT a guard. The kit
 * keeps its workshop routes safe by a different mechanism: they all live in
 * `dev.routes.ts`, which the production build swaps for an empty file, so the
 * pages never reach the prod bundle at all.
 *
 * That protection covers exactly one file. A `devOnly` route declared directly
 * in `app.routes.ts` would ship to production, stay reachable by URL, and only
 * disappear from the menu — which is how a sibling project shipped seven
 * anonymous design explorations (external security assessment, 2026-09-01).
 *
 * So: every `devOnly` route that is not part of `devRoutes` must carry
 * `adminDebugGuard` (redirects to `/` under effective prod). Today that set is
 * empty; this spec fails the moment it stops being empty without the guard.
 */
describe('app.routes — devOnly routes outside the dev workshop are hard-guarded', () => {
  const workshopPaths = new Set(devRoutes.map((r) => r.path));

  const devOnlyOutsideWorkshop = extendedRoutes.filter((r) => r.devOnly === true && !workshopPaths.has(r.path));

  it('keeps the dev workshop in dev.routes.ts (sanity: the split is real)', () => {
    expect(devRoutes.length).toBeGreaterThan(0);
    expect(devRoutes.every((r) => r.devOnly === true)).toBe(true);
  });

  it('attaches adminDebugGuard to every devOnly route that ships to production', () => {
    const unguarded = devOnlyOutsideWorkshop
      .filter((r) => !(r.canActivate ?? []).includes(adminDebugGuard))
      .map((r) => r.path);
    expect(unguarded, 'devOnly routes outside devRoutes without adminDebugGuard').toEqual([]);
  });
});
