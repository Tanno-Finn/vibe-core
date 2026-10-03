/**
 * site-config.mjs — the build scripts' door to the site configuration.
 *
 * Nothing is decided in this file. The data is `src/config/site.json` (name, start
 * page, feature switches, operator) plus `src/config/features.json` (what each switchable
 * feature owns), the rules are `src/config/site-rules.mts` — the
 * SAME module the Angular app runs (Node strips its types on import), so the app and
 * the scripts cannot disagree about the site's name or what a valid site.json is.
 * CommonJS scripts reach this module with `require('./lib/site-config.mjs')`.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createSiteRules } from '../../src/config/site-rules.mts';

export {
  validateSiteConfig,
  validateFeatureCatalog,
  createSiteRules,
  featureOfRoute,
  isRouteOn,
  activeFeatures,
  KIT_DEFAULT_SITE,
} from '../../src/config/site-rules.mts';

export const REPO_ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
export const SITE_CONFIG_PATH = join(REPO_ROOT, 'src', 'config', 'site.json');
export const FEATURES_PATH = join(REPO_ROOT, 'src', 'config', 'features.json');

/** Raw site.json (single source of truth). */
export function loadSiteConfig(configPath = SITE_CONFIG_PATH) {
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

/** Raw features.json (the kit's feature catalog). */
export function loadFeatureCatalog(featuresPath = FEATURES_PATH) {
  return JSON.parse(readFileSync(featuresPath, 'utf-8'));
}

/**
 * The derived rules with the feature catalog — throws on an invalid site.json
 * (a start page inside a switched-off feature included). `rules.isRouteOn(path)`
 * is what the prerender list, the sitemap and check-a11y filter by.
 */
export function loadSiteRules(configPath = SITE_CONFIG_PATH, featuresPath = FEATURES_PATH) {
  return createSiteRules(loadSiteConfig(configPath), { catalog: loadFeatureCatalog(featuresPath) });
}
