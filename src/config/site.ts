/**
 * Site configuration — SINGLE SOURCE OF TRUTH (app side)
 *
 * The data lives in src/config/site.json (the user's choices) and
 * src/config/features.json (kit knowledge: what each switchable feature owns);
 * the rules that check them and derive the logo text, page titles, placeholders
 * and which routes are on live in src/config/site-rules.mts, the same code the
 * build scripts run (scripts/lib/site-config.mjs).
 *
 * Components and services inject SITE_CONFIG instead of importing SITE, so a
 * spec can render against KIT_DEFAULT_SITE_RULES (or `siteRulesFor(...)` with a
 * feature switched off) and stay green after a user changes site.json.
 */
import { InjectionToken } from '@angular/core';

import siteJson from './site.json';
import featuresJson from './features.json';
import { createSiteRules, FeatureCatalog, KIT_DEFAULT_SITE, SiteConfig, SiteRules } from './site-rules.mjs';

export type { FeatureCatalog, FeatureDefinition, SiteConfig, SiteOperatorConfig, SiteRules } from './site-rules.mjs';
export { KIT_DEFAULT_SITE } from './site-rules.mjs';

/** The kit's feature catalog (features.json). */
export const FEATURES: FeatureCatalog = featuresJson as FeatureCatalog;

/** Rules over any site config with the kit's feature catalog. Throws on an invalid config. */
export function siteRulesFor(config: SiteConfig): SiteRules {
  return createSiteRules(config, { catalog: FEATURES });
}

/** The rules over this site's site.json. Throws at load on an invalid file. */
export const SITE: SiteRules = siteRulesFor(siteJson as SiteConfig);

/** The site the app renders. Provide `KIT_DEFAULT_SITE_RULES` (or `siteRulesFor(...)`) in a spec. */
export const SITE_CONFIG = new InjectionToken<SiteRules>('SITE_CONFIG', {
  providedIn: 'root',
  factory: () => SITE,
});

/** The kit's defaults as rules — what specs provide for SITE_CONFIG. */
export const KIT_DEFAULT_SITE_RULES: SiteRules = siteRulesFor(KIT_DEFAULT_SITE);
