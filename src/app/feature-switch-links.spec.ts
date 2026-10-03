/**
 * Feature switches spec — no link into a feature that site.json switches off.
 *
 * A page of a switched-off feature is not served: the feature guard sends the
 * visitor to the start page. So a link to it from a page that stays on (an
 * article's back button and "view in catalog" buttons, a notice's links, the
 * roadmap's /news link and demo tiles, the learn hub's demo cards, a path's demo
 * steps) would silently land somewhere else. Each of these surfaces hides such
 * links; this spec holds each one to it, with the kit defaults as the control.
 * The related-content chips are covered in services/related-refs.service.spec.ts,
 * the progress page's demo topics in services/learning-progress.service.spec.ts.
 *
 * Component classes are under test, not their full templates (the template is
 * replaced by an empty one) — except the article wrapper, whose button is small.
 */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { Subject, of } from 'rxjs';

import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, SiteRules, siteRulesFor } from '../config/site';
import { learnBackLink } from './utils/learn-back-link';
import { ArticleComponent } from './components/shared/article.component';
import { LessonTemplateComponent } from './components/shared/lesson-template.component';
import { NotificationService } from './services/notification.service';
import { NotificationEntry } from './models/notification.model';
import { RoadmapComponent } from './pages/roadmap/roadmap.component';
import { LernbereichComponent } from './pages/lernbereich/lernbereich.component';
import { LearningPathsOverviewComponent } from './pages/learning-paths/learning-paths-overview.component';
import { TranslationService } from './services/translation.service';
import { LearningPathService } from './services/learning-path.service';
import { DemosService } from './services/demos.service';
import { ArticlesService } from './services/articles.service';
import { DevModeService } from './services/dev-mode.service';
import { LearningPathDefinition } from './models/learning-path.model';
import { FabRegistryService } from './services/fab-registry.service';
import { EasyLanguageService } from './services/easy-language.service';
import { ArticleMetaService } from './services/article-meta.service';
import { AiToolsService } from './services/ai-tools.service';
import { AiResourcesService } from './services/ai-resources.service';
import { SourcesService } from './services/book-sources.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage = 'en';
  readonly currentIntlLocale = 'en';
  translate(key: string): string {
    return `[${key}]`;
  }
}

const site = (features: Record<string, boolean>, startPage = 'home'): SiteRules =>
  siteRulesFor({ ...KIT_DEFAULT_SITE, startPage, features });

/** A learning path with one article step and one demo step. */
const PATH = {
  id: 'p-1',
  titleKey: 'p.title',
  steps: [
    { type: 'article', id: 'a-1', route: '/articles/a-1', titleKey: 'a.title', required: true, parts: [] },
    { type: 'demo', id: 'd-1', route: '/example-demo', titleKey: 'd.title', required: false, parts: [] },
  ],
} as unknown as LearningPathDefinition;

/** One demo shipped at go-live, one dated. */
const DEMOS = [
  { id: 'd-1', path: 'example-demo', titleKey: 'd.title' },
  { id: 'd-2', path: 'later-demo', titleKey: 'd2.title', publishDate: '2026-01-07T00:00:00Z' },
];

function configure(siteRules: SiteRules, providers: unknown[] = []): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: TranslationService, useClass: TranslationServiceStub },
      { provide: SITE_CONFIG, useValue: siteRules },
      ...(providers as never[]),
    ],
  });
}

describe('no link into a switched-off feature (site.json)', () => {
  describe("an article's back button", () => {
    it('goes back to the learning area while learn is on, else to the start page with a label that says so', () => {
      expect(learnBackLink(KIT_DEFAULT_SITE_RULES)).toEqual({
        route: '/learn',
        labelKey: 'lernbereich.backToLernbereich',
      });
      expect(learnBackLink(site({ learn: false }, 'glossary'))).toEqual({
        route: '/glossary',
        labelKey: 'common.backToStartPage',
      });
    });

    it('the article wrapper follows it: label and target', () => {
      configure(site({ learn: false }, 'glossary'), [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({ from: 'learn' }) } } },
      ]);
      const fixture = TestBed.createComponent(ArticleComponent);
      fixture.detectChanges();
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
      expect(button.textContent).toContain('[common.backToStartPage]');
      button.click();
      expect(navigate).toHaveBeenCalledWith(['/glossary']);
    });

    it('the lesson template follows it and shows "view in catalog" only while the catalog is on', () => {
      const create = (siteRules: SiteRules) => {
        // The content services are only injected, not called, while the lesson is built.
        configure(siteRules, [
          { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } },
          { provide: FabRegistryService, useValue: { register: () => undefined, unregister: () => undefined } },
          ...[
            EasyLanguageService,
            ArticleMetaService,
            ArticlesService,
            AiToolsService,
            AiResourcesService,
            SourcesService,
          ].map((provide) => ({ provide, useValue: {} })),
        ]);
        TestBed.overrideComponent(LessonTemplateComponent, { set: { template: '', imports: [] } });
        return TestBed.createComponent(LessonTemplateComponent).componentInstance;
      };
      const kit = create(KIT_DEFAULT_SITE_RULES);
      expect(kit.catalogOn).toBe(true);
      expect(kit.backButtonLabel).toBe('[lernbereich.backToLernbereich]');

      const lesson = create(site({ learn: false, catalog: false }, 'glossary'));
      expect(lesson.catalogOn).toBe(false);
      expect(lesson.backButtonLabel).toBe('[common.backToStartPage]');
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      lesson.navigateBack();
      expect(navigate).toHaveBeenCalledWith(['/glossary']);
    });
  });

  describe('notices (bell and /news)', () => {
    const notice: NotificationEntry = {
      id: '2026-01-01-new-terms',
      publishedAt: '2026-01-01T08:00:00Z',
      type: 'glossary',
      titleKey: 'n.title',
      descriptionKey: 'n.description',
      link: '/glossary',
      linkQueryParams: { search: 'x' },
      linkLabelKey: 'n.cta',
      links: [
        { route: '/glossary', labelKey: 'Term' },
        { route: '/articles/a-1', labelKey: 'Article' },
      ],
    };

    function load(siteRules: SiteRules): NotificationService {
      configure(siteRules);
      const service = TestBed.inject(NotificationService);
      TestBed.inject(HttpTestingController).expectOne('/assets/data/notifications.compiled.json').flush([notice]);
      return service;
    }

    it('keep every link with the kit defaults', () => {
      const [n] = load(KIT_DEFAULT_SITE_RULES).allNotifications();
      expect(n.link).toBe('/glossary');
      expect(n.links?.map((l) => l.route)).toEqual(['/glossary', '/articles/a-1']);
    });

    it('drop the links into a switched-off feature and keep the notice', () => {
      const service = load(site({ glossary: false }));
      service.injectClientNotification({ ...notice, id: 'client' });
      for (const n of service.allNotifications()) {
        expect(n.titleKey).toBe('n.title');
        expect(n.link).toBeUndefined();
        expect(n.linkQueryParams).toBeUndefined();
        expect(n.linkLabelKey).toBeUndefined();
        expect(n.links?.map((l) => l.route)).toEqual(['/articles/a-1']);
      }
      expect(service.allNotifications().length).toBe(2);
    });
  });

  describe('the roadmap', () => {
    function create(siteRules: SiteRules): RoadmapComponent {
      configure(siteRules, [
        { provide: LearningPathService, useValue: { paths$: of([PATH]) } },
        { provide: DemosService, useValue: { getAllDemos: () => of(DEMOS) } },
        { provide: DevModeService, useValue: { isEffectivelyProd: signal(false) } },
      ]);
      TestBed.overrideComponent(RoadmapComponent, { set: { template: '', imports: [] } });
      const roadmap = TestBed.createComponent(RoadmapComponent).componentInstance;
      roadmap.ngOnInit();
      return roadmap;
    }
    const routes = (roadmap: RoadmapComponent) =>
      roadmap['allDrops']().map((d) => [d.kind, d.children.map((c) => c.route)]);

    it('shows the /news link, the path, its demo step and both demos with the kit defaults', () => {
      const roadmap = create(KIT_DEFAULT_SITE_RULES);
      expect(roadmap.newsOn).toBe(true);
      expect(routes(roadmap)).toEqual([
        ['golive', ['/articles/a-1', '/example-demo', '/glossary', '/ai-timeline', '/catalog', '/sources']],
        ['demo', ['/later-demo']],
      ]);
    });

    it('drops the /news link, the paths without learn and every demo without demos', () => {
      const roadmap = create(site({ news: false, learn: false, demos: false }, 'glossary'));
      expect(roadmap.newsOn).toBe(false);
      expect(routes(roadmap)).toEqual([['golive', ['/glossary', '/ai-timeline', '/catalog', '/sources']]]);
    });
  });

  describe('the learn hub (learn on, demos off)', () => {
    function create(siteRules: SiteRules): LernbereichComponent {
      configure(siteRules, [
        { provide: LearningPathService, useValue: { paths$: of([PATH]) } },
        { provide: DemosService, useValue: { getAllDemos: () => of(DEMOS), isVisible: () => true } },
        {
          provide: ArticlesService,
          useValue: { getAll: () => of([{ id: 'a-1', path: 'articles/a-1', titleKey: 'a.title' }]) },
        },
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}), snapshot: { queryParamMap: convertToParamMap({}) } },
        },
      ]);
      TestBed.overrideComponent(LernbereichComponent, { set: { template: '', imports: [] } });
      const hub = TestBed.createComponent(LernbereichComponent).componentInstance;
      hub.ngOnInit();
      return hub;
    }

    it('lists no demo card and offers no demo filter while demos are off', () => {
      const kit = create(KIT_DEFAULT_SITE_RULES);
      expect(kit.allItems().map((i) => i.type)).toEqual(['demo', 'demo', 'lesson']);
      expect(kit.typeFilterOptions().map((o) => o.value)).toEqual(['all', 'demo', 'lesson']);

      const hub = create(site({ demos: false }));
      expect(hub.allItems().map((i) => i.id)).toEqual(['a-1']);
      expect(hub.typeFilterOptions().map((o) => o.value)).toEqual(['all', 'lesson']);
    });

    it("hides a path's demo step and makes it unclickable while demos are off", () => {
      const overview = (siteRules: SiteRules) => {
        configure(siteRules, [{ provide: DevModeService, useValue: { isEffectivelyProd: signal(false) } }]);
        TestBed.overrideComponent(LearningPathsOverviewComponent, { set: { template: '', imports: [] } });
        return TestBed.createComponent(LearningPathsOverviewComponent).componentInstance;
      };
      expect(
        overview(KIT_DEFAULT_SITE_RULES)
          .visibleSteps(PATH)
          .map((s) => s.id),
      ).toEqual(['a-1', 'd-1']);

      const off = overview(site({ demos: false }));
      expect(off.visibleSteps(PATH).map((s) => s.id)).toEqual(['a-1']);
      expect(off.isStepAvailable(PATH.steps[1])).toBe(false);
    });
  });
});
