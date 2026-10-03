/**
 * Site rules spec — site.json is checked and turned into what the app shows by
 * ONE module (site-rules.mts), which the build scripts run too
 * (scripts/lib/site-config.mjs, scripts/check-site-config.mjs). These tests
 * pin the rules; the gate's --selftest pins the same rules from the script side.
 */
import siteJson from './site.json';
import {
  activeFeatures,
  composePageTitle,
  createSiteRules,
  DEFAULT_LOGO_ICON,
  FeatureCatalog,
  FeatureDefinition,
  featureOfRoute,
  fillSitePlaceholders,
  isRouteOn,
  KIT_DEFAULT_SITE,
  SiteConfig,
  validateFeatureCatalog,
  validateSiteConfig,
} from './site-rules.mjs';
import { FEATURES, KIT_DEFAULT_SITE_RULES, SITE, siteRulesFor } from './site';
import { SITE_OPERATOR } from './site-operator';

const site = (patch: Partial<SiteConfig> = {}): SiteConfig => ({ ...structuredClone(KIT_DEFAULT_SITE), ...patch });

/** A catalog entry with no routes; tests set what they need. */
const feature = (): FeatureDefinition => ({
  routes: [],
  i18n: [],
  collections: [],
  prerenderTier: null,
  sitemap: false,
  a11yPages: [],
});

describe('site rules', () => {
  describe('this repo', () => {
    it('site.json passes the rules, against the kit feature catalog too', () => {
      expect(validateSiteConfig(siteJson)).toEqual([]);
      expect(validateSiteConfig(siteJson, { catalog: FEATURES })).toEqual([]);
    });

    it('SITE_OPERATOR is the operator of site.json', () => {
      expect(SITE_OPERATOR).toBe(SITE.operator);
      expect(SITE_OPERATOR.name).toBe(siteJson.operator.name);
    });

    it('the kit default names the site "vibecore", starts at home and switches nothing off', () => {
      expect(KIT_DEFAULT_SITE.name).toBe('vibecore');
      expect(KIT_DEFAULT_SITE.startPage).toBe('home');
      expect(KIT_DEFAULT_SITE.features).toEqual({});
      expect(validateSiteConfig(KIT_DEFAULT_SITE)).toEqual([]);
    });
  });

  describe('validateSiteConfig', () => {
    it('refuses a value that is not an object', () => {
      expect(validateSiteConfig(null)).toEqual(['site.json is not a JSON object']);
      expect(validateSiteConfig([])).toEqual(['site.json is not a JSON object']);
    });

    it('needs a non-empty name', () => {
      expect(validateSiteConfig(site({ name: ' ' })).join()).toContain('"name"');
    });

    it('accepts shortName and logoIcon only as non-empty text, the icon as a PrimeIcons class', () => {
      expect(validateSiteConfig(site({ shortName: 'VC', logoIcon: 'pi pi-book' }))).toEqual([]);
      expect(validateSiteConfig(site({ shortName: '' })).join()).toContain('"shortName"');
      expect(validateSiteConfig(site({ logoIcon: 'fa fa-book' })).join()).toContain('PrimeIcons');
    });

    it('needs a start page shaped like a route path, and a known one when the pages are given', () => {
      expect(validateSiteConfig(site({ startPage: 'articles/seed-article-1' }))).toEqual([]);
      expect(validateSiteConfig(site({ startPage: '/home' })).join()).toContain('not a route path');
      expect(validateSiteConfig(site({ startPage: 'de/home' }), { knownPages: ['home'] }).join()).toContain(
        'not a page',
      );
      expect(validateSiteConfig(site({ startPage: 'glossary' }), { knownPages: ['home', 'glossary'] })).toEqual([]);
    });

    it('needs features as an object of true/false, with known ids when the ids are given', () => {
      expect(validateSiteConfig(site({ features: [] as unknown as Record<string, boolean> })).join()).toContain(
        '"features"',
      );
      expect(
        validateSiteConfig(site({ features: { glossary: 'no' } as unknown as Record<string, boolean> })).join(),
      ).toContain('true or false');
      expect(validateSiteConfig(site({ features: { glossary: false } }), { knownFeatures: [] }).join()).toContain(
        'not a kit feature',
      );
      expect(validateSiteConfig(site({ features: { glossary: false } }), { knownFeatures: ['glossary'] })).toEqual([]);
    });

    it('needs every operator field, the supervisory authority included', () => {
      const operator = { ...KIT_DEFAULT_SITE.operator, email: '' };
      expect(validateSiteConfig(site({ operator })).join()).toContain('operator.email');
      const noAuthority = { name: 'A', address: 'B', email: 'c@d.test' } as SiteConfig['operator'];
      expect(validateSiteConfig(site({ operator: noAuthority })).join()).toContain('supervisoryAuthority');
    });
  });

  describe('createSiteRules', () => {
    it('throws on an invalid site.json instead of rendering a nameless site', () => {
      expect(() => createSiteRules(site({ name: '' }))).toThrow(/"name"/);
    });

    it('shows the name and the kit icon when nothing shorter is set', () => {
      const rules = createSiteRules(site());
      expect(rules.logoText).toBe('vibecore');
      expect(rules.logoIcon).toBe(DEFAULT_LOGO_ICON);
      expect(DEFAULT_LOGO_ICON).toBe('pi pi-box');
    });

    it('uses shortName and logoIcon for the header logo when set', () => {
      const rules = createSiteRules(
        site({ name: 'Mathe mit Frau Schulz', shortName: 'Mathe', logoIcon: 'pi pi-book' }),
      );
      expect(rules.name).toBe('Mathe mit Frau Schulz');
      expect(rules.logoText).toBe('Mathe');
      expect(rules.logoIcon).toBe('pi pi-book');
    });

    it('treats a feature site.json does not name as on', () => {
      const rules = createSiteRules(site({ features: { news: false } }));
      expect(rules.isFeatureOn('news')).toBe(false);
      expect(rules.isFeatureOn('glossary')).toBe(true);
    });

    it('fills {siteName} and {operator} from the config', () => {
      const rules = createSiteRules(site({ name: 'Portal' }));
      expect(rules.fill('Diese Website heißt {siteName}. Sie gehört {operator}.')).toBe(
        'Diese Website heißt Portal. Sie gehört [NAME].',
      );
    });
  });

  describe('feature switches (features.json)', () => {
    const catalog: FeatureCatalog = {
      shellPages: ['home'],
      features: {
        glossary: { ...feature(), routes: ['glossary'] },
        learn: { ...feature(), routes: ['learn', 'lernen'], navGroups: ['learningPaths'] },
        demos: { ...feature(), routes: ['demos'], navGroups: ['interaktiveDemos'] },
      },
    };

    it('the kit catalog is valid and names the ten switchable features', () => {
      expect(validateFeatureCatalog(FEATURES)).toEqual([]);
      expect(Object.keys(FEATURES.features)).toEqual([
        'glossary',
        'timeline',
        'catalog',
        'sources',
        'learn',
        'news',
        'roadmap',
        'progress',
        'feedback',
        'demos',
      ]);
    });

    it('with kit defaults every feature is on and every route reachable', () => {
      expect(KIT_DEFAULT_SITE_RULES.activeFeatures).toEqual(Object.keys(FEATURES.features));
      for (const route of ['home', 'glossary', 'news', 'learn', 'example-demo', 'articles/seed-article-1']) {
        expect(KIT_DEFAULT_SITE_RULES.isRouteOn(route), route).toBe(true);
      }
    });

    it('finds a route’s feature by path (a path owns what is below it), then by route group', () => {
      expect(featureOfRoute(catalog, 'glossary')).toBe('glossary');
      expect(featureOfRoute(catalog, '/learn?view=content&type=demo#x')).toBe('learn');
      expect(featureOfRoute(catalog, 'learn/deep')).toBe('learn');
      expect(featureOfRoute(catalog, 'learning-paths')).toBeUndefined();
      expect(featureOfRoute(catalog, 'my-new-demo', 'interaktiveDemos')).toBe('demos');
      expect(featureOfRoute(catalog, 'home', 'knowledge')).toBeUndefined();
      expect(featureOfRoute(catalog, 'articles/seed-article-1')).toBeUndefined();
    });

    it('a route is off only while its feature is switched off; shell and content pages stay on', () => {
      const features = { glossary: false, demos: false };
      expect(isRouteOn(catalog, features, 'glossary')).toBe(false);
      expect(isRouteOn(catalog, features, 'any-demo', 'interaktiveDemos')).toBe(false);
      expect(isRouteOn(catalog, features, 'learn')).toBe(true);
      expect(isRouteOn(catalog, features, 'home')).toBe(true);
      expect(isRouteOn(catalog, features, 'articles/seed-article-1')).toBe(true);
      expect(activeFeatures(catalog, features)).toEqual(['learn']);
    });

    it('sends a guard to the start page when the preferred route is off', () => {
      const rules = createSiteRules(site({ features: { learn: false }, startPage: 'glossary' }), { catalog });
      expect(rules.routeOrStartPage('learn')).toBe('glossary');
      expect(rules.routeOrStartPage('/glossary')).toBe('glossary');
      expect(createSiteRules(site(), { catalog }).routeOrStartPage('learn')).toBe('learn');
    });

    it('a guard turning a visitor away from the start page itself sends them home, never back to it', () => {
      const learnOff = createSiteRules(site({ features: { learn: false }, startPage: 'articles/a-draft' }), {
        catalog,
      });
      expect(learnOff.fallbackFrom('articles/a-draft')).toBe('home');
      expect(learnOff.fallbackFrom('/articles/a-draft/')).toBe('home');
      expect(learnOff.fallbackFrom('articles/another-draft')).toBe('articles/a-draft');
      expect(
        createSiteRules(site({ startPage: 'articles/a-draft' }), { catalog }).fallbackFrom('articles/a-draft'),
      ).toBe('learn');
    });

    it('refuses a start page inside a switched-off feature, and an id the catalog does not know', () => {
      const bad = site({ startPage: 'lernen', features: { learn: false } });
      expect(validateSiteConfig(bad, { catalog }).join()).toContain('belongs to the feature "learn"');
      expect(() => createSiteRules(bad, { catalog })).toThrow(/switches off/);
      expect(validateSiteConfig(site({ features: { weather: false } }), { catalog }).join()).toContain(
        'not a kit feature (known: glossary, learn, demos)',
      );
    });

    it('siteRulesFor applies the kit catalog', () => {
      const rules = siteRulesFor(site({ features: { news: false, timeline: false } }));
      expect(rules.isRouteOn('news')).toBe(false);
      expect(rules.isRouteOn('ai-timeline')).toBe(false);
      expect(rules.featureOfRoute('ai-resources')).toBe('catalog');
      expect(rules.activeFeatures).not.toContain('news');
    });

    it('validateFeatureCatalog names malformed entries and doubly owned routes', () => {
      expect(validateFeatureCatalog(null)).toEqual(['features.json is not a JSON object']);
      const broken = {
        shellPages: ['home'],
        features: {
          a: { ...feature(), routes: ['x'], prerenderTier: 2 },
          b: { ...feature(), routes: ['x', 'home'], sitemap: 'yes' },
        },
      };
      const problems = validateFeatureCatalog(broken).join('\n');
      expect(problems).toContain('"a.prerenderTier" must be 0, 1 or null');
      expect(problems).toContain('"b.sitemap" must be true or false');
      expect(problems).toContain('route "x" belongs to both "a" and "b"');
      expect(problems).toContain('"home" is a shell page');
    });
  });

  describe('composePageTitle / fillSitePlaceholders', () => {
    it('appends the site name to a page title', () => {
      expect(composePageTitle('Glossary', 'vibecore')).toBe('Glossary - vibecore');
    });

    it('fills a title that names the site itself, and does not suffix it twice', () => {
      expect(composePageTitle('{siteName} - Your Gateway to Learning', 'vibecore')).toBe(
        'vibecore - Your Gateway to Learning',
      );
    });

    it('replaces every occurrence and leaves other braces alone', () => {
      expect(
        fillSitePlaceholders('{siteName}, {siteName} by {operator} ({siteUrl})', { siteName: 'S', operator: 'O' }),
      ).toBe('S, S by O ({siteUrl})');
    });
  });
});
