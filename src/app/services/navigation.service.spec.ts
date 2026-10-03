/**
 * NavigationService spec — what the menu and the page search may offer.
 *
 * The one rule with teeth: in production (and under the simulate-prod toggle,
 * which goes through the same `isEffectivelyProd` check) no dev workshop page,
 * no showcase page, no unreleased article and no unreleased demo may appear.
 * The route table is the real one, so a new route that forgets its flag is
 * checked too. Content indexes and translations are stubbed; labels are the
 * raw title keys, which is all these tests need to identify an entry.
 */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { NavigationItem, NavigationService } from './navigation.service';
import { extendedRoutes } from '../app.routes';
import { devRoutes } from '../dev/dev.routes';
import { DevModeService } from './dev-mode.service';
import { TranslationService } from './translation.service';
import { LanguageUrlService } from './language-url.service';
import { ArticlesService } from './articles.service';
import { DemosService } from './demos.service';
import { GlossaryService } from './glossary.service';
import { LearningPathService } from './learning-path.service';
import { TimeGateService } from './time-gate.service';
import { LearningPathDefinition } from '../models/learning-path.model';
import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, SiteRules, siteRulesFor } from '../../config/site';

const SIMULATE_PROD_KEY = 'dev-simulate-prod';
const UNRELEASED_DEMO = 'example-demo';

class TranslationStub {
  currentLanguage = 'en';
  readonly currentLanguage$ = signal('en');
  readonly translationsVersion = signal(0);
  readonly translationsReady = signal(true);
  translate = (key: string) => key;
  translateValue = () => null;
  isLanguageFullyLoaded = () => true;
}

/** A learning path whose one required step is written: it gets a menu entry under /learn. */
const READY_PATH = {
  id: 'ready-path',
  titleKey: 'paths.ready',
  steps: [{ required: true, route: '/articles/ready' }],
} as unknown as LearningPathDefinition;

describe('NavigationService', () => {
  let devMode: DevModeService;
  let glossaryStub: { getAllEntries: ReturnType<typeof vi.fn> };
  let siteRules: SiteRules;

  beforeEach(() => {
    localStorage.removeItem(SIMULATE_PROD_KEY);
    siteRules = KIT_DEFAULT_SITE_RULES;
    glossaryStub = { getAllEntries: vi.fn(() => of([])) };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: TranslationService, useClass: TranslationStub },
        { provide: LanguageUrlService, useValue: { currentUrlLang: 'en' } },
        {
          provide: ArticlesService,
          // Article routes are all `hidden` in the kit (the /learn catalog lists
          // them), so the article index has nothing to filter here.
          useValue: { getAll: () => of([]), isVisibleInProd: () => true },
        },
        {
          provide: DemosService,
          useValue: { getAllDemos: () => of([{ path: UNRELEASED_DEMO, publishDate: '2999-01-01' }]) },
        },
        { provide: TimeGateService, useValue: { isPublished: (date?: string) => !date || date < '2100-01-01' } },
        { provide: GlossaryService, useValue: glossaryStub },
        { provide: LearningPathService, useValue: { paths$: of([READY_PATH]), isPathPublished: () => true } },
        // The kit's defaults, not this repo's site.json: the spec stays green after a user
        // switches features off. Read when NavigationService is created, so a test can swap it first.
        { provide: SITE_CONFIG, useFactory: () => siteRules },
      ],
    });
    devMode = TestBed.inject(DevModeService);
  });

  afterEach(() => localStorage.removeItem(SIMULATE_PROD_KEY));

  const routesOf = (items: NavigationItem[]) => items.map((i) => i.route);

  /** Every route that must never reach a production menu, from the real table. */
  const devOnlyNavRoutes = extendedRoutes
    .filter((r) => r.devOnly || r.group === 'development' || r.path?.startsWith('showcase/'))
    .map((r) => `/${r.path}`);

  function simulateProd(on: boolean): NavigationService {
    const service = TestBed.inject(NavigationService);
    devMode.simulateProd.set(on);
    TestBed.tick(); // runs the effect that rebuilds the menu on a toggle
    return service;
  }

  it('the dev workshop really is in the route table this spec checks (sanity)', () => {
    expect(devRoutes.some((r) => r.group === 'development' && !r.hidden)).toBe(true);
  });

  describe('on the dev server', () => {
    it('lists the dev workshop pages, in their own group', () => {
      const service = simulateProd(false);

      expect(routesOf(service.getAvailablePages())).toContain('/dev');
      expect(service.getNavigationGroups().map((g) => g.key)).toContain('development');
    });

    it('lists an unreleased demo so the author can reach it', () => {
      expect(routesOf(simulateProd(false).getAvailablePages())).toContain(`/${UNRELEASED_DEMO}`);
    });
  });

  describe('in production', () => {
    it('lists no dev-only, development-group or showcase route', () => {
      const routes = routesOf(simulateProd(true).getAvailablePages());

      expect(routes.filter((r) => devOnlyNavRoutes.includes(r))).toEqual([]);
    });

    it('drops the development group entirely', () => {
      const groups = simulateProd(true).getNavigationGroups();

      expect(groups.map((g) => g.key)).not.toContain('development');
      expect(groups.flatMap((g) => g.items).filter((i) => i.route.startsWith('/dev'))).toEqual([]);
    });

    it('finds no dev page through the search either', () => {
      const service = simulateProd(true);

      expect(service.filterPages('dev').filter((i) => i.route.startsWith('/dev'))).toEqual([]);
      expect(service.filterPages('').filter((i) => i.route.startsWith('/dev'))).toEqual([]);
    });

    it('hides a demo before its publish date, and keeps the rest of the portal', () => {
      const routes = routesOf(simulateProd(true).getAvailablePages());

      expect(routes).not.toContain(`/${UNRELEASED_DEMO}`);
      expect(routes).toEqual(expect.arrayContaining(['/home', '/glossary', '/learn']));
    });

    it('never lists a hidden route or a redirect', () => {
      const hidden = extendedRoutes.filter((r) => r.hidden || r.redirectTo).map((r) => `/${r.path}`);
      const routes = routesOf(simulateProd(true).getAvailablePages());

      expect(routes.filter((r) => hidden.includes(r))).toEqual([]);
    });

    it('rebuilds the menu when the simulate-prod toggle flips back', () => {
      const service = simulateProd(true);
      expect(routesOf(service.getAvailablePages())).not.toContain('/dev');

      devMode.simulateProd.set(false);
      TestBed.tick();

      expect(routesOf(service.getAvailablePages())).toContain('/dev');
    });
  });

  describe('feature switches (site.json)', () => {
    it('with the kit defaults lists every feature, the learning paths and the /learn overflow hub', () => {
      const service = simulateProd(true);
      const routes = routesOf(service.getAvailablePages());

      expect(routes).toEqual(expect.arrayContaining(['/glossary', '/news', '/learn', '/ai-timeline']));
      expect(routes).toContain('/learn#ready-path');
      expect(service.getGroupConfig('lessons')?.hubRoute).toBe('/learn?view=content&type=lesson');
      expect(glossaryStub.getAllEntries).toHaveBeenCalled();
    });

    it('hides a switched-off feature: its pages, its group, its hub link and its search source', () => {
      siteRules = siteRulesFor({ ...KIT_DEFAULT_SITE, features: { glossary: false, news: false, learn: false } });
      const service = simulateProd(true);
      const routes = routesOf(service.getAvailablePages());

      expect(routes).not.toContain('/glossary');
      expect(routes).not.toContain('/news');
      expect(routes.filter((r) => r.startsWith('/learn'))).toEqual([]);
      expect(service.getNavigationGroups().map((g) => g.key)).not.toContain('learningPaths');
      expect(service.getGroupConfig('lessons')).toBeUndefined();
      expect(service.filterPages('glossary').map((i) => i.route)).not.toContain('/glossary');
      expect(glossaryStub.getAllEntries).not.toHaveBeenCalled();
      // The rest of the portal stays.
      expect(routes).toEqual(expect.arrayContaining(['/home', '/ai-timeline', '/catalog', '/impressum']));
    });
  });

  it('builds nothing until the current language is loaded', () => {
    const translation = TestBed.inject(TranslationService) as unknown as TranslationStub;
    translation.isLanguageFullyLoaded = () => false;
    const service = TestBed.inject(NavigationService);
    TestBed.tick();
    // Translation data arriving clears the cached menu; the loaded-check guards the rebuild.
    translation.translationsVersion.update((v) => v + 1);
    TestBed.tick();

    expect(service.getAvailablePages()).toEqual([]);
  });

  // Easy German writes compounds with a Mediopunkt; the page search folds both sides
  // (foldForSearch), so the joiner a visitor types — or leaves out — does not decide.
  describe('page search across compound joiners', () => {
    const pages: NavigationItem[] = [
      { label: 'Code·review', route: '/review', icon: '' },
      { label: 'Glossar', route: '/glossary', icon: '', groupLabel: 'Lern·bereich' },
      { label: 'Tools', route: '/tools', icon: '', searchText: ['ein sprach·modell erklärt'] },
      { label: 'Pfad', route: '/path', icon: '', matchTerms: ['Prompt-Engineering'] },
    ];

    it.each([
      ['code-review', '/review'],
      ['codereview', '/review'],
      ['Code·Review', '/review'],
      ['lernbereich', '/glossary'],
      ['Sprach-Modell', '/tools'],
      ['sprachmodell', '/tools'],
      ['prompt·engineering', '/path'],
      ['promptengineering', '/path'],
    ])('finds %s on %s', (query, route) => {
      const service = TestBed.inject(NavigationService);
      vi.spyOn(service, 'getAvailablePages').mockReturnValue(pages);
      expect(routesOf(service.filterPages(query))).toEqual([route]);
    });
  });
});
