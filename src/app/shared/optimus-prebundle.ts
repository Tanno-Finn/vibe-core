/**
 * Optimus UI prebundle hint (dev-only effect)
 *
 * Side-effect imports for every Optimus UI submodule the Portal touches.
 * Purpose: force Vite's optimizeDeps to discover all Optimus UI packages at
 * dev-server start, instead of incrementally re-optimizing while a heavy
 * lazy chunk (e.g. /catalog) loads. Re-Optimize-during-Lazy-Load is what
 * causes the NG0912 "Component ID generation collision" warning storm
 * (multiple _Header / _Footer / _BaseIcon copies in the runtime) and the
 * spürbare Verzögerung on first /catalog visit.
 *
 * In production MOST of this file is tree-shaken to zero bytes: @openng/optimus-ui's
 * package.json declares `sideEffects: false`, so esbuild/Rollup drop the
 * static side-effect imports when none of their named exports are referenced.
 * The pages that actually use these modules continue to lazy-import them.
 *
 * EXCEPTION — @openng/optimus-ui/chart: chart.js declares `sideEffects` in its own
 * package.json and @openng/optimus-ui/chart runs `Chart.register(...registerables)` at
 * module top-level, so a static `import '@openng/optimus-ui/chart'` is NOT tree-shaken and
 * drags all of chart.js (its lazy chunk in the `build:prod` output shows the
 * current size) into the INITIAL bundle, even
 * though only lazy demo pages ever render <p-chart>. It
 * is therefore gated behind isDevMode() at the bottom of this file: the dev
 * pre-optimization hint stays, but prod ships chart.js lazily.
 *
 * Imported once from main.ts (browser) and main.server.ts (SSR) — both
 * codepaths bootstrap AppComponent, so we hit each runtime exactly once.
 *
 * Maintenance: when a new @openng/optimus-ui/<name> import lands anywhere in src/,
 * add a side-effect line here. Catch via:
 *   grep -rho "from '@openng/optimus-ui/[a-z-]*'" src | sort -u
 */

import { isDevMode } from '@angular/core';

import '@openng/optimus-ui/accordion';
import '@openng/optimus-ui/autocomplete';
import '@openng/optimus-ui/avatar';
import '@openng/optimus-ui/badge';
import '@openng/optimus-ui/breadcrumb';
import '@openng/optimus-ui/button';
import '@openng/optimus-ui/card';
import '@openng/optimus-ui/checkbox';
import '@openng/optimus-ui/chip';
import '@openng/optimus-ui/dialog';
import '@openng/optimus-ui/divider';
import '@openng/optimus-ui/drawer';
import '@openng/optimus-ui/fileupload';
import '@openng/optimus-ui/image';
import '@openng/optimus-ui/inputgroup';
import '@openng/optimus-ui/inputgroupaddon';
import '@openng/optimus-ui/inputtext';
import '@openng/optimus-ui/menubar';
import '@openng/optimus-ui/message';
import '@openng/optimus-ui/multiselect';
import '@openng/optimus-ui/panel';
import '@openng/optimus-ui/popover';
import '@openng/optimus-ui/progressbar';
import '@openng/optimus-ui/progressspinner';
import '@openng/optimus-ui/radiobutton';
import '@openng/optimus-ui/rating';
import '@openng/optimus-ui/ripple';
import '@openng/optimus-ui/select';
import '@openng/optimus-ui/selectbutton';
import '@openng/optimus-ui/skeleton';
import '@openng/optimus-ui/slider';
import '@openng/optimus-ui/table';
import '@openng/optimus-ui/tabs';
import '@openng/optimus-ui/tag';
import '@openng/optimus-ui/textarea';
import '@openng/optimus-ui/timeline';
import '@openng/optimus-ui/toast';
import '@openng/optimus-ui/togglebutton';
import '@openng/optimus-ui/toggleswitch';
import '@openng/optimus-ui/tooltip';

// @openng/optimus-ui/chart is gated behind isDevMode() (see EXCEPTION note in the file
// header). As a dynamic import it still gives the dev-server the optimizeDeps
// hint for chart.js (no NG0912 re-optimize storm on the first chart page), but
// the prod build keeps chart.js OUT of the initial bundle — it loads lazily,
// and at prod runtime isDevMode() is false so this branch never executes.
if (isDevMode()) {
  void import('@openng/optimus-ui/chart');
}
