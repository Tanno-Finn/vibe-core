/**
 * Route guards spec — the five gates in src/app/guards/.
 *
 * Three of them only gate in production. Two decide that with Angular's
 * `isDevMode()`, which reads the global `ngDevMode`; the test build is a dev
 * build, so `asProduction()` switches that global off for exactly the length
 * of one guard call. The third reads DevModeService, which is stubbed. The
 * feature guard gates everywhere, by the site.json switches it gets through
 * SITE_CONFIG.
 */
import { isDevMode, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { Observable, firstValueFrom, isObservable, of } from 'rxjs';

import { adminDebugGuard } from './admin-debug.guard';
import { demoReleaseGuard } from './demo-release.guard';
import { draftRouteGuard } from './draft-route.guard';
import { translationReadyGuard } from './translation-ready.guard';
import { featureGuard } from './feature.guard';
import type { ExtendedRoute } from '../app.routes';
import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, siteRulesFor } from '../../config/site';
import { DevModeService } from '../services/dev-mode.service';
import { ArticlesService } from '../services/articles.service';
import { DemosService } from '../services/demos.service';
import { TranslationService } from '../services/translation.service';

/** A site with the learn hub switched off and the glossary as its start page. */
const learnOffSite = siteRulesFor({ ...KIT_DEFAULT_SITE, startPage: 'glossary', features: { learn: false } });

const routeFor = (path?: string) => ({ routeConfig: path === undefined ? null : { path } }) as ActivatedRouteSnapshot;
const state = {} as RouterStateSnapshot;

function run(guard: CanActivateFn, path?: string): MaybeAsync<GuardResult> {
  return TestBed.runInInjectionContext(() => guard(routeFor(path), state));
}

/** Run `fn` with `isDevMode()` reporting false, as in a production build. */
function inProduction<T>(fn: () => T): T {
  const g = globalThis as { ngDevMode?: unknown };
  const saved = g.ngDevMode;
  g.ngDevMode = false;
  try {
    return fn();
  } finally {
    g.ngDevMode = saved;
  }
}

/** Call a guard the way a production build would see it. */
function asProduction(guard: CanActivateFn, path?: string): MaybeAsync<GuardResult> {
  return inProduction(() => run(guard, path));
}

async function resolve(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
  if (isObservable(result)) return firstValueFrom(result as Observable<GuardResult>);
  return result;
}

/** A redirect as a string (`/learn`), or the boolean the guard returned. */
async function outcome(result: MaybeAsync<GuardResult>): Promise<string | boolean> {
  const value = await resolve(result);
  if (value instanceof UrlTree) return TestBed.inject(Router).serializeUrl(value);
  return value as boolean;
}

describe('route guards', () => {
  it('the production switch really flips isDevMode (sanity for the tests below)', () => {
    expect(isDevMode()).toBe(true);
    expect(inProduction(() => isDevMode())).toBe(false);
    expect(isDevMode()).toBe(true);
  });

  describe('adminDebugGuard', () => {
    const effectivelyProd = signal(false);

    beforeEach(() => {
      effectivelyProd.set(false);
      TestBed.configureTestingModule({
        providers: [provideRouter([]), { provide: DevModeService, useValue: { isEffectivelyProd: effectivelyProd } }],
      });
    });

    it('lets a dev-only page open on the dev server', async () => {
      expect(await outcome(run(adminDebugGuard))).toBe(true);
    });

    it('sends production (and the simulate-prod toggle) home', async () => {
      effectivelyProd.set(true);

      expect(await outcome(run(adminDebugGuard))).toBe('/');
    });
  });

  describe('featureGuard', () => {
    const matchRoute = (route: Partial<ExtendedRoute>) =>
      TestBed.runInInjectionContext(() =>
        featureGuard(route as Route, [] as UrlSegment[], {} as Parameters<CanMatchFn>[2]),
      );
    const newsOff = siteRulesFor({ ...KIT_DEFAULT_SITE, features: { news: false, demos: false } });

    it('matches every route with the kit defaults (every feature on)', async () => {
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      TestBed.overrideProvider(SITE_CONFIG, { useValue: KIT_DEFAULT_SITE_RULES });
      expect(await outcome(matchRoute({ path: 'news' }))).toBe(true);
      expect(await outcome(matchRoute({ path: 'example-demo', group: 'interaktiveDemos' }))).toBe(true);
    });

    it('sends a page of a switched-off feature to the start page, by path or by route group', async () => {
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      TestBed.overrideProvider(SITE_CONFIG, { useValue: newsOff });
      expect(await outcome(matchRoute({ path: 'news' }))).toBe('/home');
      expect(await outcome(matchRoute({ path: 'a-new-demo', group: 'interaktiveDemos' }))).toBe('/home');
    });

    it('lets shell pages, articles and pages of features that are on through', async () => {
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      TestBed.overrideProvider(SITE_CONFIG, { useValue: newsOff });
      for (const path of ['home', 'impressum', 'articles/seed-article-1', 'glossary', 'roadmap']) {
        expect(await outcome(matchRoute({ path })), path).toBe(true);
      }
    });

    it('redirects to a start page other than home', async () => {
      TestBed.configureTestingModule({ providers: [provideRouter([])] });
      TestBed.overrideProvider(SITE_CONFIG, { useValue: learnOffSite });
      expect(await outcome(matchRoute({ path: 'lernen' }))).toBe('/glossary');
    });
  });

  describe('draftRouteGuard', () => {
    type Article = { id: string; visible: boolean };
    const articles = new Map<string, Article>();
    const getById = vi.fn((id: string) => of(articles.get(id)));

    beforeEach(() => {
      articles.clear();
      articles.set('art-live', { id: 'art-live', visible: true });
      articles.set('art-draft', { id: 'art-draft', visible: false });
      getById.mockClear();
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          { provide: ArticlesService, useValue: { getById, isVisible: (a: Article) => a.visible } },
        ],
      });
    });

    it('lets every article through on the dev server, drafts included, without asking the index', async () => {
      expect(await outcome(run(draftRouteGuard, 'articles/art-draft'))).toBe(true);
      expect(getById).not.toHaveBeenCalled();
    });

    it('redirects a draft or scheduled article to /learn in production', async () => {
      expect(await outcome(asProduction(draftRouteGuard, 'articles/art-draft'))).toBe('/learn');
      expect(getById).toHaveBeenCalledWith('art-draft');
    });

    it('lets a released article through in production', async () => {
      expect(await outcome(asProduction(draftRouteGuard, 'articles/art-live'))).toBe(true);
    });

    it('lets an unknown article id fall through to the wildcard route', async () => {
      expect(await outcome(asProduction(draftRouteGuard, 'articles/art-nope'))).toBe(true);
    });

    it('ignores routes that are not articles', async () => {
      expect(await outcome(asProduction(draftRouteGuard, 'glossary'))).toBe(true);
      expect(await outcome(asProduction(draftRouteGuard))).toBe(true);
      expect(getById).not.toHaveBeenCalled();
    });

    it('redirects to the start page instead while site.json switches the learn feature off', async () => {
      TestBed.overrideProvider(SITE_CONFIG, { useValue: learnOffSite });
      expect(await outcome(asProduction(draftRouteGuard, 'articles/art-draft'))).toBe('/glossary');
    });

    it('sends a draft start page to /home instead of back to itself while learn is off (no redirect loop)', async () => {
      const draftStart = siteRulesFor({
        ...KIT_DEFAULT_SITE,
        startPage: 'articles/art-draft',
        features: { learn: false },
      });
      TestBed.overrideProvider(SITE_CONFIG, { useValue: draftStart });
      expect(await outcome(asProduction(draftRouteGuard, 'articles/art-draft'))).toBe('/home');
      expect(await outcome(asProduction(draftRouteGuard, 'articles/art-live'))).toBe(true);
    });
  });

  describe('demoReleaseGuard', () => {
    type Demo = { path: string; visible: boolean };
    let demos: Demo[];
    let warn: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      demos = [
        { path: 'released-demo', visible: true },
        { path: 'scheduled-demo', visible: false },
      ];
      warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      TestBed.configureTestingModule({
        providers: [
          provideRouter([]),
          {
            provide: DemosService,
            useValue: { getAllDemos: () => of(demos), isVisible: (d: Demo) => d.visible },
          },
        ],
      });
    });

    afterEach(() => warn.mockRestore());

    it('redirects a demo before its publish date to /learn in production', async () => {
      expect(await outcome(asProduction(demoReleaseGuard, 'scheduled-demo'))).toBe('/learn');
    });

    it('redirects to the start page instead while site.json switches the learn feature off', async () => {
      TestBed.overrideProvider(SITE_CONFIG, { useValue: learnOffSite });
      expect(await outcome(asProduction(demoReleaseGuard, 'scheduled-demo'))).toBe('/glossary');
    });

    it('sends an unreleased start-page demo to /home instead of back to itself while learn is off', async () => {
      const demoStart = siteRulesFor({ ...KIT_DEFAULT_SITE, startPage: 'scheduled-demo', features: { learn: false } });
      TestBed.overrideProvider(SITE_CONFIG, { useValue: demoStart });
      expect(await outcome(asProduction(demoReleaseGuard, 'scheduled-demo'))).toBe('/home');
    });

    it('lets a released demo through in production', async () => {
      expect(await outcome(asProduction(demoReleaseGuard, 'released-demo'))).toBe(true);
    });

    it('lets a route with no registry entry, or no path, fall through in production', async () => {
      expect(await outcome(asProduction(demoReleaseGuard, 'not-a-demo'))).toBe(true);
      expect(await outcome(asProduction(demoReleaseGuard))).toBe(true);
    });

    it('opens a scheduled demo on the dev server so the author can preview it', async () => {
      expect(await outcome(run(demoReleaseGuard, 'scheduled-demo'))).toBe(true);
      expect(warn).not.toHaveBeenCalled();
    });

    it('warns on the dev server about a demo route the registry does not know', async () => {
      expect(await outcome(run(demoReleaseGuard, 'forgotten-demo'))).toBe(true);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining(`route 'forgotten-demo' has no entry`));
    });
  });

  describe('translationReadyGuard', () => {
    let ready: { resolve: () => void; reject: (e: unknown) => void };
    let whenReady: ReturnType<typeof vi.fn>;
    let warn: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      vi.useFakeTimers();
      whenReady = vi.fn(
        () =>
          new Promise<void>((resolve, reject) => {
            ready = { resolve, reject };
          }),
      );
      warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      TestBed.configureTestingModule({
        providers: [{ provide: TranslationService, useValue: { whenReady } }],
      });
    });

    afterEach(() => {
      warn.mockRestore();
      vi.useRealTimers();
    });

    function subscribe(routeConfig: Record<string, unknown> | null = { path: 'x' }) {
      const values: GuardResult[] = [];
      let done = false;
      const snapshot = { routeConfig } as unknown as ActivatedRouteSnapshot;
      (
        TestBed.runInInjectionContext(() => translationReadyGuard(snapshot, state)) as Observable<GuardResult>
      ).subscribe({
        next: (v) => values.push(v),
        complete: () => (done = true),
      });
      return { values, completed: () => done };
    }

    it('holds navigation while translations are still loading', async () => {
      const guard = subscribe();

      await vi.advanceTimersByTimeAsync(19_999);

      expect(guard.values).toEqual([]);
      expect(guard.completed()).toBe(false);
    });

    it('releases navigation once, as soon as translations are loaded', async () => {
      const guard = subscribe();

      ready.resolve();
      await vi.advanceTimersByTimeAsync(0);

      expect(guard.values).toEqual([true]);
      expect(guard.completed()).toBe(true);
    });

    it("asks for the route's own namespaces: its title keys and its i18n list", () => {
      subscribe({
        path: 'a',
        titleKey: 'articleGitIntro.hero.title',
        descriptionKey: 'articleGitIntro.hero.subtitle',
        i18n: ['quiz'],
      });

      expect(whenReady).toHaveBeenCalledWith(['articleGitIntro', 'quiz']);
    });

    it('waits for the core bundle alone on a route without title keys', () => {
      subscribe(null);

      expect(whenReady).toHaveBeenCalledWith([]);
    });

    it('gives up waiting after 20 seconds and lets the app start anyway', async () => {
      const guard = subscribe();

      await vi.advanceTimersByTimeAsync(20_000);

      expect(guard.values).toEqual([true]);
      expect(guard.completed()).toBe(true);
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Timeout or error'), expect.anything());
    });

    it('lets the app start if loading itself fails', async () => {
      const guard = subscribe();

      ready.reject(new Error('boom'));
      await vi.advanceTimersByTimeAsync(0);

      expect(guard.values).toEqual([true]);
    });
  });
});
