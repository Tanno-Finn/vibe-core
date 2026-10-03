/**
 * TranslationService spec — the contract every page leans on: which language a
 * visitor lands in, what a missing key falls back to, that switching the
 * language really moves the signal the templates read, and that a page's lazy
 * i18n chunk arrives before (or, as a safety net, right after) it is needed.
 *
 * The HTTP loader is replaced by an in-memory stub so each test decides which
 * bundles exist: `fixture` is a core namespace, `page` a lazy chunk. The
 * language is resolved in the constructor, so every test arranges URL, storage
 * and browser languages BEFORE injecting the service.
 */
import { computed, makeStateKey, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LanguageChangeEvent, TranslationService } from './translation.service';
import { I18nCoreBundle, TranslationLoaderService, TranslationModule } from './translation-loader.service';

const PREFERRED_KEY = 'preferred-language-v2';
const EASY_FLAG_KEY = 'easy-language-mode';

/** Each key lives in exactly the bundles that tell the fallback chain apart. */
const BUNDLES: Record<string, TranslationModule> = {
  en: {
    fixture: { title: 'Portal', onlyEn: 'English only', section: { a: 'A', b: 'B' } },
    page: { heading: 'Page' },
  },
  de: { fixture: { title: 'Portal DE', onlyDe: 'Nur Deutsch' }, page: { heading: 'Seite' } },
  'de-easy': { fixture: { title: 'Portal leicht' }, page: { heading: 'Seite leicht' } },
  'en-easy': { fixture: { title: 'Portal easy' }, page: { heading: 'Page easy' } },
};
const CHUNKS = ['page'];

class LoaderStub {
  bundles: Record<string, TranslationModule> = { ...BUNDLES };
  failing = new Set<string>();
  calls: string[] = [];

  loadCore(lang: string): Promise<I18nCoreBundle> {
    this.calls.push(lang);
    if (this.failing.has(lang)) return Promise.reject(new Error(`offline: ${lang}`));
    const all = this.bundles[lang] ?? {};
    const namespaces = Object.fromEntries(Object.entries(all).filter(([ns]) => !CHUNKS.includes(ns)));
    return Promise.resolve({ namespaces, chunks: CHUNKS, splitParents: [] });
  }

  loadChunk(lang: string, id: string): Promise<unknown> {
    this.calls.push(`${lang}/${id}`);
    if (this.failing.has(`${lang}/${id}`)) return Promise.reject(new Error(`offline: ${lang}/${id}`));
    return Promise.resolve(this.bundles[lang]?.[id]);
  }
}

/** Let pending loads (microtasks and deferred requests) finish. */
const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('TranslationService', () => {
  let loader: LoaderStub;
  let languagesSpy: ReturnType<typeof vi.spyOn> | null = null;

  beforeEach(() => {
    localStorage.removeItem(PREFERRED_KEY);
    localStorage.removeItem(EASY_FLAG_KEY);
    history.replaceState(null, '', '/');
    loader = new LoaderStub();
    TestBed.configureTestingModule({
      providers: [{ provide: TranslationLoaderService, useValue: loader }],
    });
  });

  afterEach(() => {
    languagesSpy?.mockRestore();
    languagesSpy = null;
    localStorage.removeItem(PREFERRED_KEY);
    localStorage.removeItem(EASY_FLAG_KEY);
    history.replaceState(null, '', '/');
  });

  function browserLanguages(...langs: string[]): void {
    languagesSpy = vi.spyOn(window.navigator, 'languages', 'get').mockReturnValue(langs);
  }

  async function create(): Promise<TranslationService> {
    const service = TestBed.inject(TranslationService);
    await service.whenReady();
    await settle();
    return service;
  }

  /** Subscribe to the compatibility Observable; events arrive when effects flush. */
  function recordChanges(service: TranslationService): LanguageChangeEvent[] {
    const events: LanguageChangeEvent[] = [];
    service.languageChanged.subscribe((e) => events.push(e));
    TestBed.tick();
    return events;
  }

  describe('language detection on start', () => {
    it('takes the language from the URL prefix first, over a stored preference', async () => {
      history.replaceState(null, '', '/de/glossary');
      localStorage.setItem(PREFERRED_KEY, 'en');

      const service = await create();

      expect(service.currentLanguage).toBe('de');
      expect(localStorage.getItem(PREFERRED_KEY)).toBe('de');
    });

    it('recovers the Easy-Language variant from the stored flag, since the URL carries only the base language', async () => {
      history.replaceState(null, '', '/de/');
      localStorage.setItem(EASY_FLAG_KEY, 'true');

      const service = await create();

      expect(service.currentLanguage).toBe('de-easy');
    });

    it('uses the stored preference when the URL has no language prefix', async () => {
      localStorage.setItem(PREFERRED_KEY, 'en-easy');

      const service = await create();

      expect(service.currentLanguage).toBe('en-easy');
      expect(localStorage.getItem(EASY_FLAG_KEY)).toBe('true');
    });

    it('ignores a stored language the kit does not ship and asks the browser instead', async () => {
      localStorage.setItem(PREFERRED_KEY, 'fr');
      browserLanguages('ja-JP', 'de-AT');

      const service = await create();

      expect(service.currentLanguage).toBe('de');
      expect(localStorage.getItem(PREFERRED_KEY)).toBe('de');
    });

    it('stays on the site default (languages.json defaultLanguage) when nothing points anywhere', async () => {
      browserLanguages('ja-JP');

      const service = await create();

      expect(service.currentLanguage).toBe('de');
      expect(localStorage.getItem(PREFERRED_KEY)).toBeNull();
    });

    it('resolves the language synchronously, so services built after it read the right one', () => {
      history.replaceState(null, '', '/en/');

      const service = TestBed.inject(TranslationService);

      // No event needed (the old Subject needed one, and a late subscriber missed it):
      // the signal already holds the resolved language before any bundle has loaded.
      expect(service.currentLanguage$()).toBe('en');
      expect(service.translationsReady()).toBe(false);
    });

    it('reports ready through the signal and its compatibility Observable', async () => {
      const service = await create();
      const seen: boolean[] = [];
      service.isTranslationsLoaded.subscribe((v) => seen.push(v));
      TestBed.tick();

      expect(service.translationsReady()).toBe(true);
      expect(seen).toEqual([true]);
    });

    it('still reports "loaded" when the bundle cannot be fetched, so the route guard lets the app start', async () => {
      loader.failing.add('en');
      browserLanguages('en-US');

      const service = await create();

      expect(service.isLanguageFullyLoaded('en')).toBe(false);
      expect(service.translate('fixture.title')).toBe('fixture.title');
    });
  });

  describe('fallback chains for a missing key', () => {
    let service: TranslationService;

    beforeEach(async () => {
      browserLanguages('en-US');
      service = await create();
      // Load every bundle the chains below walk through.
      await service.setLanguage('de');
      await service.setLanguage('en-easy');
    });

    it('answers from the current language when the key is there', async () => {
      await service.setLanguage('de-easy');

      expect(service.translate('fixture.title')).toBe('Portal leicht');
    });

    it('walks de-easy -> de -> en', async () => {
      await service.setLanguage('de-easy');

      expect(service.translate('fixture.onlyDe')).toBe('Nur Deutsch');
      expect(service.translate('fixture.onlyEn')).toBe('English only');
    });

    it('walks en-easy -> en and never into German', async () => {
      expect(service.currentLanguage).toBe('en-easy');

      expect(service.translate('fixture.onlyEn')).toBe('English only');
      expect(service.translate('fixture.onlyDe')).toBe('fixture.onlyDe');
    });

    it('walks de -> en', async () => {
      await service.setLanguage('de');

      expect(service.translate('fixture.onlyEn')).toBe('English only');
    });

    it('returns the key itself when no language in the chain has it', async () => {
      await service.setLanguage('de-easy');

      expect(service.translate('nowhere.to.be.found')).toBe('nowhere.to.be.found');
    });

    it('treats a key that points at an object, not a string, as missing', async () => {
      await service.setLanguage('en');

      expect(service.translate('fixture.section')).toBe('fixture.section');
      expect(service.translateValue('fixture.section')).toEqual({ a: 'A', b: 'B' });
    });

    it('flattens a namespace, and falls back to English for a namespace the language lacks', async () => {
      await service.setLanguage('de');

      expect(service.getTranslations('fixture.section')).toEqual({ a: 'A', b: 'B' });
    });
  });

  describe('switching language', () => {
    let service: TranslationService;

    beforeEach(async () => {
      browserLanguages('en-US');
      service = await create();
    });

    it('moves the signal, emits the change once and persists the choice', async () => {
      const events = recordChanges(service);

      await service.setLanguage('de');
      TestBed.tick();

      expect(service.currentLanguage$()).toBe('de');
      expect(service.lastLanguageChange()).toEqual({ oldLang: 'en', newLang: 'de' });
      expect(events).toEqual([{ oldLang: 'en', newLang: 'de' }]);
      expect(localStorage.getItem(PREFERRED_KEY)).toBe('de');
      expect(localStorage.getItem(EASY_FLAG_KEY)).toBeNull();
    });

    it('keeps the easy-mode flag in step with the language', async () => {
      await service.setLanguage('de-easy');
      expect(localStorage.getItem(EASY_FLAG_KEY)).toBe('true');

      await service.setLanguage('de');
      expect(localStorage.getItem(EASY_FLAG_KEY)).toBeNull();
    });

    it('re-evaluates a computed translation after the switch', async () => {
      const title = computed(() => service.translate('fixture.title'));
      expect(title()).toBe('Portal');

      await service.setLanguage('de');

      expect(title()).toBe('Portal DE');
    });

    it('ignores a language the kit does not ship', async () => {
      const events = recordChanges(service);

      await service.setLanguage('fr');
      TestBed.tick();

      expect(service.currentLanguage).toBe('en');
      expect(events).toEqual([]);
    });

    it('does not emit when the language is already current', async () => {
      const events = recordChanges(service);

      await service.setLanguage('en');
      TestBed.tick();

      expect(events).toEqual([]);
    });

    it('switches even if the new bundle fails, and serves the fallback instead', async () => {
      loader.failing.add('en-easy');

      await service.setLanguage('en-easy');

      expect(service.currentLanguage).toBe('en-easy');
      expect(service.translate('fixture.title')).toBe('Portal');
    });

    it('downloads a fallback language only when a key actually needs it', async () => {
      await service.setLanguage('de-easy');
      await settle();

      // Every shipped locale is complete, so a switch alone fetches nothing else.
      expect(service.isLanguageFullyLoaded('de')).toBe(false);

      const onlyDe = computed(() => service.translate('fixture.onlyDe'));
      expect(onlyDe()).toBe('fixture.onlyDe');
      await settle();

      expect(service.isLanguageFullyLoaded('de')).toBe(true);
      expect(onlyDe()).toBe('Nur Deutsch');
    });

    it('in production, does not fetch a fallback language for a key the loaded language lacks', async () => {
      await service.setLanguage('de-easy');
      await settle();
      const g = globalThis as { ngDevMode?: unknown };
      const saved = g.ngDevMode;
      g.ngDevMode = false; // isDevMode() -> false, as in a production build
      try {
        // The gate guarantees every shipped locale is complete, so the key is missing everywhere.
        expect(service.translate('fixture.onlyDe')).toBe('fixture.onlyDe');
        // English is loaded already, so it is still consulted — just never fetched for this.
        expect(service.translate('fixture.onlyEn')).toBe('English only');
      } finally {
        g.ngDevMode = saved;
      }
      await settle();

      expect(service.isLanguageFullyLoaded('de')).toBe(false);
    });

    it("brings the current page's chunks along, so the switched page does not flash keys", async () => {
      await service.whenReady(['page']);

      await service.setLanguage('de');

      expect(service.translate('page.heading')).toBe('Seite');
    });

    it('gives Intl a locale without the easy suffix', async () => {
      await service.setLanguage('de-easy');

      expect(service.currentIntlLocale).toBe('de');
      expect(service.getCurrentLanguageInfo()?.code).toBe('de-easy');
    });
  });

  describe('lazy chunks', () => {
    beforeEach(() => browserLanguages('en-US'));

    it('keeps a lazy namespace out of the up-front load', async () => {
      await create();

      expect(loader.calls).toEqual(['en']);
    });

    it("loads a route's namespaces before it resolves (the guard's contract)", async () => {
      const service = await create();

      await service.whenReady(['page', 'fixture', 'no-such-namespace']);

      expect(loader.calls).toEqual(['en', 'en/page']);
      expect(service.translate('page.heading')).toBe('Page');
    });

    it('serves a key the core carries for a lazy namespace without fetching the chunk (coreKeys)', async () => {
      const loadCore = loader.loadCore.bind(loader);
      loader.loadCore = async (lang: string) => {
        const core = await loadCore(lang);
        return { ...core, namespaces: { ...core.namespaces, page: { title: 'Page title' } } };
      };
      const service = await create();

      expect(service.translate('page.title')).toBe('Page title');
      await settle();
      expect(loader.calls).toEqual(['en']);

      // Any other key of the namespace still brings the whole chunk in.
      expect(service.translate('page.heading')).toBe('page.heading');
      await settle();
      expect(service.translate('page.heading')).toBe('Page');
    });

    it('fetches a chunk on first lookup and re-evaluates the computed that asked', async () => {
      const service = await create();
      const heading = computed(() => service.translate('page.heading'));

      expect(heading()).toBe('page.heading');
      await settle();

      expect(heading()).toBe('Page');
      expect(loader.calls.filter((c) => c === 'en/page')).toEqual(['en/page']);
    });

    it('falls back along the chain when a chunk cannot be fetched', async () => {
      loader.failing.add('en-easy/page');
      localStorage.setItem(PREFERRED_KEY, 'en-easy');
      const service = await create();

      await service.whenReady(['page']);

      expect(service.translate('page.heading')).toBe('page.heading');
      await settle();
      expect(service.translate('page.heading')).toBe('Page');
    });

    it('replays the chunks the prerendered page used before the app starts, for hydration', async () => {
      TestBed.inject(TransferState).set(makeStateKey<{ lang: string; chunks: string[] }>('i18n-chunks'), {
        lang: 'en',
        chunks: ['page'],
      });

      const service = await create();

      expect(loader.calls).toEqual(['en', 'en/page']);
      expect(service.translate('page.heading')).toBe('Page');
    });
  });
});
