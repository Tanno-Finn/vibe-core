/**
 * Site rules — the ONE implementation of "what is a valid site.json and what
 * does the site call itself", shared by the Angular app and the Node scripts.
 *
 * The data lives in `site.json` (the user's choices: name, start page, feature
 * switches, operator) and `features.json` (kit knowledge: which routes, strings
 * and content each switchable feature owns). This file only checks them and
 * derives what the app shows and which routes are on.
 * Same pattern as `language-rules.mts`: no imports, so the app loads it through
 * `src/config/site.ts` (which passes the imported JSON in) and the scripts load
 * it directly (`scripts/lib/site-config.mjs`; Node strips the types). Keep it to
 * erasable TypeScript: no enums, no namespaces, no parameter properties.
 */

export interface SiteOperatorConfig {
  /** Name of the person or organisation responsible for the site (§ 5 DDG). */
  name: string;
  /** Full postal address that can receive mail — a P.O. box is not enough. */
  address: string;
  /** Contact e-mail, used for the imprint and for data-subject requests. */
  email: string;
  /** The data-protection supervisory authority responsible for the operator (Art. 13 (2) (d) DSGVO). */
  supervisoryAuthority: {
    name: string;
    address: string;
    website: string;
  };
}

export interface SiteConfig {
  /** The site's name, shown in the header, footer, page titles and search-engine data. */
  name: string;
  /** Optional shorter name for the header logo. */
  shortName?: string;
  /** Optional PrimeIcons class of the header logo icon. */
  logoIcon?: string;
  /** Route path (no language prefix, no leading slash) the site root leads to. */
  startPage: string;
  /** Feature switches by feature id; a feature not listed is on. */
  features: Record<string, boolean>;
  operator: SiteOperatorConfig;
}

/**
 * One kit feature as `features.json` describes it: what it owns, so a switch in
 * site.json can hide it everywhere. Kit knowledge, not the user's choice.
 */
export interface FeatureDefinition {
  /** Route paths it owns (pages and legacy redirects); a path owns everything below it. */
  routes: string[];
  /** Route groups (`group` in app.routes.ts) it owns: a new page in the group belongs to it. */
  navGroups?: string[];
  /** i18n namespaces or key paths it owns (a key path owns everything below it). */
  i18n: string[];
  /** Key paths below `i18n` that other parts of the site read, so they stay required. */
  i18nShared?: string[];
  /** Source files and folders (ending in /) only this feature uses (scripts/check-i18n-keys.mjs, ownership rule). */
  code?: string[];
  /** Its content collections under src/assets/data. */
  collections: string[];
  /** 0 = prerendered for every SEO language, 1 = for language tiers 1 and 2, null = not prerendered. */
  prerenderTier: 0 | 1 | null;
  /** Its pages are listed in the sitemap. */
  sitemap: boolean;
  /** Page keys of scripts/check-a11y.mjs it owns. */
  a11yPages: string[];
}

/** The whole of `features.json`. */
export interface FeatureCatalog {
  /** Pages that are no feature and are always on. */
  shellPages: string[];
  /** Strings only the dev workshop reads. */
  devOnly?: { i18n: string[] };
  features: Record<string, FeatureDefinition>;
}

/** A catalog without features: every route is always on. */
export const EMPTY_FEATURE_CATALOG: FeatureCatalog = { shellPages: [], features: {} };

export interface SiteRules {
  readonly config: SiteConfig;
  /** The feature catalog the rules were made with (`features.json`). */
  readonly catalog: FeatureCatalog;
  /** The ids of the catalog's features that are on, in catalog order. */
  readonly activeFeatures: readonly string[];
  /** The feature a route belongs to (by path, then by route group), or undefined for shell and content pages. */
  featureOfRoute(path: string, group?: string): string | undefined;
  /** Is the route reachable? True unless it belongs to a feature that is off. */
  isRouteOn(path: string, group?: string): boolean;
  /** `path` when its route is on, else the start page: where a guard sends a visitor. */
  routeOrStartPage(path: string): string;
  /**
   * Where a guard sends a visitor it turns away from `refused` (a draft article,
   * an unreleased demo): the learning area, else the start page — and `home`
   * (a shell page, always on) when the start page is `refused` itself, so a
   * start page the guard refuses cannot redirect to itself.
   */
  fallbackFrom(refused: string): string;
  /** The full site name. */
  readonly name: string;
  /** The header logo text: `shortName` when set, else the name. */
  readonly logoText: string;
  /** The header logo icon class: `logoIcon` when set, else the kit's. */
  readonly logoIcon: string;
  readonly startPage: string;
  readonly operator: SiteOperatorConfig;
  /** Is the feature on? A feature site.json does not name is on. */
  isFeatureOn(id: string): boolean;
  /** "Glossary" -> "Glossary - vibecore": a page's browser/SEO title. */
  pageTitle(pageTitle: string): string;
  /** Fill `{siteName}` and `{operator}` in a UI string. */
  fill(text: string): string;
}

/** The kit's landing page: a shell page (features.json), always on and always prerendered. */
export const FALLBACK_PAGE = 'home';

/** The kit's logo icon, used while site.json names none. */
export const DEFAULT_LOGO_ICON = 'pi pi-box';

/**
 * The site as the kit ships it. Specs render against this constant (through the
 * SITE_CONFIG token) so they keep passing after a user renames their site; the
 * site-rules spec holds site.json's kit state against it where it still applies.
 */
export const KIT_DEFAULT_SITE: SiteConfig = {
  name: 'vibecore',
  startPage: 'home',
  features: {},
  operator: {
    name: '[NAME]',
    address: 'Your Street 1, 12345 Your City, Germany',
    email: 'you@example.com',
    supervisoryAuthority: {
      name: '[Your competent data protection supervisory authority]',
      address: 'Authority Street 1, 12345 Authority City, Germany',
      website: 'https://example.com',
    },
  },
};

export interface SiteValidationOptions {
  /** Routed page paths the start page may name. Without it, only the path's shape is checked. */
  knownPages?: readonly string[];
  /** Feature ids site.json may switch. Without it, the catalog's ids; without both, any id. */
  knownFeatures?: readonly string[];
  /** The feature catalog (`features.json`): names the known features and lets the start page be checked against the switches. */
  catalog?: FeatureCatalog;
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

/** A route path without language prefix: `home`, `articles/seed-article-1`. */
const START_PAGE_SHAPE = /^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*$/;
/** A PrimeIcons class list: `pi pi-book`. */
const ICON_SHAPE = /^pi( pi-[a-z0-9-]+)+$/;

/**
 * Every problem with a site.json value, as readable sentences; an empty list
 * means valid. Keys starting with `_` are comments and ignored.
 */
export function validateSiteConfig(value: unknown, options: SiteValidationOptions = {}): string[] {
  const problems: string[] = [];
  if (!isObject(value)) return ['site.json is not a JSON object'];

  if (!isText(value['name'])) problems.push('site.json: "name" must be a non-empty text');
  for (const optional of ['shortName', 'logoIcon'] as const) {
    if (optional in value && !isText(value[optional])) {
      problems.push(`site.json: "${optional}" must be a non-empty text or be left out`);
    }
  }
  if (isText(value['logoIcon']) && !ICON_SHAPE.test(value['logoIcon'])) {
    problems.push(`site.json: "logoIcon" "${value['logoIcon']}" is not a PrimeIcons class like "pi pi-book"`);
  }

  const startPage = value['startPage'];
  if (!isText(startPage)) {
    problems.push('site.json: "startPage" must name a page, e.g. "home"');
  } else if (!START_PAGE_SHAPE.test(startPage)) {
    problems.push(
      `site.json: "startPage" "${startPage}" is not a route path like "home" (no slash, no language prefix)`,
    );
  } else if (options.knownPages && !options.knownPages.includes(startPage)) {
    problems.push(`site.json: "startPage" "${startPage}" is not a page of src/app/app.routes.ts`);
  }

  const knownFeatures = options.knownFeatures ?? (options.catalog ? Object.keys(options.catalog.features) : undefined);
  const features = value['features'];
  if (!isObject(features)) {
    problems.push('site.json: "features" must be an object (empty = every feature on)');
  } else {
    for (const [id, on] of Object.entries(features)) {
      if (id.startsWith('_')) continue;
      if (typeof on !== 'boolean') problems.push(`site.json: feature "${id}" must be true or false`);
      if (knownFeatures && !knownFeatures.includes(id)) {
        const known = knownFeatures.length ? knownFeatures.join(', ') : 'none yet';
        problems.push(`site.json: "${id}" is not a kit feature (known: ${known})`);
      }
    }
    // The start page must be reachable: a shell or content page, or a page of a feature that is on.
    if (options.catalog && isText(startPage)) {
      const owner = featureOfRoute(options.catalog, startPage);
      if (owner && features[owner] === false) {
        problems.push(
          `site.json: "startPage" "${startPage}" belongs to the feature "${owner}", which "features" switches off — switch it on or choose another start page`,
        );
      }
    }
  }

  const operator = value['operator'];
  if (!isObject(operator)) {
    problems.push('site.json: "operator" is missing — the imprint has no operator data');
  } else {
    for (const field of ['name', 'address', 'email'] as const) {
      if (!isText(operator[field])) problems.push(`site.json: "operator.${field}" must be a non-empty text`);
    }
    const authority = operator['supervisoryAuthority'];
    if (!isObject(authority)) {
      problems.push('site.json: "operator.supervisoryAuthority" is missing');
    } else {
      for (const field of ['name', 'address', 'website'] as const) {
        if (!isText(authority[field])) {
          problems.push(`site.json: "operator.supervisoryAuthority.${field}" must be a non-empty text`);
        }
      }
    }
  }
  return problems;
}

/**
 * Validate site.json and derive the rules. Throws on the first list of problems.
 * With `options.catalog` (features.json) the rules know which route belongs to
 * which feature; without it every route counts as always on.
 */
export function createSiteRules(config: SiteConfig, options: SiteValidationOptions = {}): SiteRules {
  const problems = validateSiteConfig(config, options);
  if (problems.length) throw new Error(problems.join('\n'));
  const name = config.name.trim();
  const catalog = options.catalog ?? EMPTY_FEATURE_CATALOG;
  const isRouteOnHere = (path: string, group?: string) => isRouteOn(catalog, config.features, path, group);
  const routeOrStartPage = (path: string) => (isRouteOnHere(path) ? normalizeRoutePath(path) : config.startPage);
  return {
    config,
    catalog,
    name,
    logoText: config.shortName?.trim() || name,
    logoIcon: config.logoIcon?.trim() || DEFAULT_LOGO_ICON,
    startPage: config.startPage,
    operator: config.operator,
    activeFeatures: activeFeatures(catalog, config.features),
    isFeatureOn: (id) => isFeatureOn(config.features, id),
    featureOfRoute: (path, group) => featureOfRoute(catalog, path, group),
    isRouteOn: isRouteOnHere,
    routeOrStartPage,
    fallbackFrom: (refused) => {
      const target = routeOrStartPage('learn');
      return target === normalizeRoutePath(refused) ? FALLBACK_PAGE : target;
    },
    pageTitle: (pageTitle) => composePageTitle(pageTitle, name),
    fill: (text) => fillSitePlaceholders(text, { siteName: name, operator: config.operator.name }),
  };
}

// ── Feature switches ─────────────────────────────────────────────────────────

/** A feature is on unless site.json switches it off: a missing key means on. */
export function isFeatureOn(features: Record<string, boolean>, id: string): boolean {
  return features[id] !== false;
}

/** The catalog's feature ids that are on, in catalog order. */
export function activeFeatures(catalog: FeatureCatalog, features: Record<string, boolean>): string[] {
  return Object.keys(catalog.features).filter((id) => isFeatureOn(features, id));
}

/** A route path without slashes at the ends, query or fragment: "/learn?view=x#y" -> "learn". */
export function normalizeRoutePath(path: string): string {
  return path
    .split('#')[0]
    .split('?')[0]
    .replace(/^\/+|\/+$/g, '');
}

/**
 * The feature a route belongs to: the first whose `routes` names the path or a
 * parent of it, else the first whose `navGroups` names the route's group. Shell
 * pages, articles and anything else no feature names yield undefined.
 */
export function featureOfRoute(catalog: FeatureCatalog, path: string, group?: string): string | undefined {
  const p = normalizeRoutePath(path);
  for (const [id, feature] of Object.entries(catalog.features)) {
    if (feature.routes.some((r) => p === r || p.startsWith(`${r}/`))) return id;
  }
  if (group) {
    for (const [id, feature] of Object.entries(catalog.features)) {
      if (feature.navGroups?.includes(group)) return id;
    }
  }
  return undefined;
}

/** A route is on unless it belongs to a feature that site.json switches off. */
export function isRouteOn(
  catalog: FeatureCatalog,
  features: Record<string, boolean>,
  path: string,
  group?: string,
): boolean {
  const owner = featureOfRoute(catalog, path, group);
  return owner === undefined || isFeatureOn(features, owner);
}

/** Every problem with a features.json value, as sentences; an empty list means valid. */
export function validateFeatureCatalog(value: unknown): string[] {
  const problems: string[] = [];
  if (!isObject(value)) return ['features.json is not a JSON object'];
  const texts = (v: unknown) => Array.isArray(v) && v.every(isText);
  if (!texts(value['shellPages'])) problems.push('features.json: "shellPages" must be a list of route paths');
  const features = value['features'];
  if (!isObject(features)) return [...problems, 'features.json: "features" must be an object'];
  const owners = new Map<string, string>();
  for (const [id, raw] of Object.entries(features)) {
    if (!isObject(raw)) {
      problems.push(`features.json: feature "${id}" must be an object`);
      continue;
    }
    for (const list of ['routes', 'i18n', 'collections', 'a11yPages'] as const) {
      if (!texts(raw[list])) problems.push(`features.json: "${id}.${list}" must be a list of texts`);
    }
    for (const list of ['navGroups', 'i18nShared', 'code'] as const) {
      if (list in raw && !texts(raw[list])) problems.push(`features.json: "${id}.${list}" must be a list of texts`);
    }
    if (![0, 1, null].includes(raw['prerenderTier'] as number | null)) {
      problems.push(`features.json: "${id}.prerenderTier" must be 0, 1 or null`);
    }
    if (typeof raw['sitemap'] !== 'boolean') problems.push(`features.json: "${id}.sitemap" must be true or false`);
    if (texts(raw['routes'])) {
      for (const route of raw['routes'] as string[]) {
        if (!START_PAGE_SHAPE.test(route)) problems.push(`features.json: "${id}" route "${route}" is not a route path`);
        const other = owners.get(route);
        if (other) problems.push(`features.json: route "${route}" belongs to both "${other}" and "${id}"`);
        owners.set(route, id);
        if (texts(value['shellPages']) && (value['shellPages'] as string[]).includes(route)) {
          problems.push(`features.json: "${route}" is a shell page and cannot belong to the feature "${id}"`);
        }
      }
    }
  }
  return problems;
}

/**
 * A page's title with the site name: "Glossary" -> "Glossary - vibecore". A
 * title that names the site itself through `{siteName}` ("{siteName} - Your
 * Gateway to Learning") is filled instead, never suffixed twice.
 */
export function composePageTitle(pageTitle: string, siteName: string): string {
  if (pageTitle.includes('{siteName}')) return pageTitle.split('{siteName}').join(siteName);
  return `${pageTitle} - ${siteName}`;
}

/** Replace every `{siteName}` and `{operator}` in a UI string. */
export function fillSitePlaceholders(text: string, values: { siteName: string; operator: string }): string {
  return text.split('{siteName}').join(values.siteName).split('{operator}').join(values.operator);
}
