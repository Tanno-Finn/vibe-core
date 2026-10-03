/**
 * UnifiedContentService + GlossaryService spec — one bundle per language
 * (`content.<lang>.json`), and the glossary as the most-used reader of it.
 *
 * HTTP goes through HttpTestingController, so every test states exactly which
 * bundle answered and which failed. TranslationService is a stub: the current
 * language signal is the only thing these services read.
 */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { UnifiedContentBundle, UnifiedContentService } from './unified-content.service';
import { GlossaryEntry, GlossaryService } from './glossary.service';
import { TranslationService } from './translation.service';

class TranslationStub {
  readonly currentLanguage$ = signal('en');
  get currentLanguage(): string {
    return this.currentLanguage$();
  }
  set currentLanguage(lang: string) {
    this.currentLanguage$.set(lang);
  }

  /** Switch the language signal and flush the effects that follow it. */
  switchTo(lang: string): void {
    this.currentLanguage$.set(lang);
    TestBed.tick();
  }
}

function glossaryEntry(id: string, term: string, extra: Partial<GlossaryEntry> = {}): GlossaryEntry {
  return { id, term, definition: `${term} explained`, category: 'basics', ...extra };
}

function bundle(language: string, glossary: GlossaryEntry[]): UnifiedContentBundle {
  return {
    meta: {
      language,
      version: '1',
      generatedAt: '2026-01-01',
      checksum: 'x',
      entryCounts: { glossary: glossary.length },
    },
    glossary: Object.fromEntries(glossary.map((g) => [g.id, g])),
    timeline: {},
    aiTools: {},
    aiResources: {},
    catalog: {},
    sources: {},
    achievements: {},
    articleMeta: {},
  };
}

const EN = bundle('en', [
  glossaryEntry('llm', 'Large Language Model', { abbreviations: ['LLM'], related: { glossary: ['token'] } }),
  glossaryEntry('token', 'Token'),
  glossaryEntry('agent', 'Agent', { related: { glossary: ['llm'] } }),
]);
const DE = bundle('de', [glossaryEntry('llm', 'Großes Sprachmodell', { abbreviations: ['LLM'] })]);

describe('UnifiedContentService', () => {
  let http: HttpTestingController;
  let translation: TranslationStub;

  beforeEach(() => {
    translation = new TranslationStub();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslationService, useValue: translation },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  /** Answer the one pending request for `lang` with a bundle, or fail it. */
  function answer(lang: string, body: UnifiedContentBundle | 'fail'): void {
    const req = http.expectOne((r) => r.url.startsWith(`/assets/data/content.${lang}.json`));
    if (body === 'fail') req.flush('not found', { status: 404, statusText: 'Not Found' });
    else req.flush(body);
  }

  describe('loading', () => {
    it('fetches the current language’s bundle on start and exposes its sections', async () => {
      const service = TestBed.inject(UnifiedContentService);
      answer('en', EN);

      expect(service.getMeta()?.language).toBe('en');
      expect(service.getEntriesArray('glossary')).toHaveLength(3);
      expect(await firstValueFrom(service.loadFailed$)).toBe(false);
      expect(await firstValueFrom(service.error$)).toBeNull();
    });

    it('finds an entry by id, and answers null for an id it does not have', () => {
      const service = TestBed.inject(UnifiedContentService);
      answer('en', EN);

      expect(service.getEntry<GlossaryEntry>('glossary', 'token')?.term).toBe('Token');
      expect(service.getEntry('glossary', 'no-such-term')).toBeNull();
      expect(service.getEntry('timeline', 'token')).toBeNull();
    });

    it('answers null and empty before any bundle has arrived', () => {
      const service = TestBed.inject(UnifiedContentService);

      expect(service.getSection('glossary')).toBeNull();
      expect(service.getEntriesArray('glossary')).toEqual([]);
      expect(service.getEntry('glossary', 'llm')).toBeNull();
      answer('en', EN);
    });

    it('loads the new language’s bundle on a language change', () => {
      const service = TestBed.inject(UnifiedContentService);
      answer('en', EN);

      translation.switchTo('de');
      answer('de', DE);

      expect(service.getEntry<GlossaryEntry>('glossary', 'llm')?.term).toBe('Großes Sprachmodell');
    });

    it('serves a language it already loaded from cache, without a second request', () => {
      const service = TestBed.inject(UnifiedContentService);
      answer('en', EN);
      translation.switchTo('de');
      answer('de', DE);

      translation.switchTo('en');

      http.expectNone((r) => r.url.includes('content.en.json'));
      expect(service.getMeta()?.language).toBe('en');
    });

    it('shares one request between callers asking for the same language at once', () => {
      const service = TestBed.inject(UnifiedContentService);
      answer('en', EN);

      const results: (UnifiedContentBundle | null)[] = [];
      service.loadBundle('de').subscribe((b) => results.push(b));
      service.loadBundle('de').subscribe((b) => results.push(b));
      answer('de', DE);

      expect(results).toEqual([DE, DE]);
    });
  });

  describe('fallback chain', () => {
    it('falls back from an Easy-Language variant to its own base language first', async () => {
      translation.currentLanguage = 'en-easy';
      const service = TestBed.inject(UnifiedContentService);

      answer('en-easy', 'fail');
      answer('en', EN);

      expect(service.getMeta()?.language).toBe('en');
      expect(await firstValueFrom(service.error$)).toContain('using "en" as fallback');
    });

    it('walks de-easy -> de', () => {
      translation.currentLanguage = 'de-easy';
      const service = TestBed.inject(UnifiedContentService);

      answer('de-easy', 'fail');
      answer('de', DE);

      expect(service.getMeta()?.language).toBe('de');
    });

    it('walks en -> de when English itself is missing', () => {
      const service = TestBed.inject(UnifiedContentService);

      answer('en', 'fail');
      answer('de', DE);

      expect(service.getMeta()?.language).toBe('de');
    });

    it('reports a fatal failure once the whole chain is exhausted', async () => {
      translation.currentLanguage = 'de';
      const service = TestBed.inject(UnifiedContentService);

      answer('de', 'fail');
      answer('en', 'fail');

      expect(service.getCurrentBundle()).toBeNull();
      expect(await firstValueFrom(service.loadFailed$)).toBe(true);
      expect(await firstValueFrom(service.loading$)).toBe(false);
    });

    it('keeps the fallback banner on a cache hit for the same language', async () => {
      translation.currentLanguage = 'de-easy';
      const service = TestBed.inject(UnifiedContentService);
      answer('de-easy', 'fail');
      answer('de', DE);

      translation.switchTo('de');
      expect(await firstValueFrom(service.error$)).toBeNull();

      translation.switchTo('de-easy');
      expect(await firstValueFrom(service.error$)).toContain('"de-easy" not available');
    });
  });
});

describe('GlossaryService', () => {
  let http: HttpTestingController;
  let translation: TranslationStub;
  let glossary: GlossaryService;

  beforeEach(() => {
    translation = new TranslationStub();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslationService, useValue: translation },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    glossary = TestBed.inject(GlossaryService);
  });

  afterEach(() => http.verify());

  const answer = (lang: string, body: UnifiedContentBundle) =>
    http.expectOne((r) => r.url.startsWith(`/assets/data/content.${lang}.json`)).flush(body);

  it('has no entries and reports not-loaded before the bundle arrives', async () => {
    expect(await firstValueFrom(glossary.getAllEntries())).toEqual([]);
    expect(glossary.isLoaded()).toBe(false);
    answer('en', EN);
    expect(glossary.isLoaded()).toBe(true);
  });

  it('looks an entry up by id, and answers undefined for a missing one', async () => {
    answer('en', EN);

    expect((await firstValueFrom(glossary.getEntryById('token')))?.term).toBe('Token');
    expect(await firstValueFrom(glossary.getEntryById('no-such-term'))).toBeUndefined();
  });

  it('serves the entries of the current language, and switches with it', async () => {
    answer('en', EN);
    expect((await firstValueFrom(glossary.getEntryById('llm')))?.term).toBe('Large Language Model');

    translation.switchTo('de');
    answer('de', DE);

    expect((await firstValueFrom(glossary.getEntryById('llm')))?.term).toBe('Großes Sprachmodell');
    expect(await firstValueFrom(glossary.getEntryById('token'))).toBeUndefined();
  });

  it('answers entries for a language only once that language’s bundle is current, never the old one', () => {
    answer('en', EN);
    const seen: string[][] = [];
    const sub = glossary.getEntriesForLanguage('de').subscribe((entries) => seen.push(entries.map((e) => e.term)));

    translation.switchTo('de');
    expect(seen).toEqual([]); // English is still current while the German bundle loads
    answer('de', DE);

    expect(seen).toEqual([['Großes Sprachmodell']]);
    sub.unsubscribe();
  });

  it('answers a fallback-served language with the bundle that serves it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    answer('en', EN);
    const seen: string[][] = [];
    const sub = glossary.getEntriesForLanguage('en-easy').subscribe((entries) => seen.push(entries.map((e) => e.id)));

    translation.switchTo('en-easy');
    http
      .expectOne((r) => r.url.startsWith('/assets/data/content.en-easy.json'))
      .flush('missing', { status: 404, statusText: 'Not Found' });
    answer('en', EN);

    expect(seen).toEqual([['llm', 'token', 'agent']]);
    sub.unsubscribe();
    warn.mockRestore();
  });

  it('normalizes entries: `description` fills `definition`, and alternativeNames is always an array', async () => {
    const odd = {
      ...glossaryEntry('odd', 'Odd'),
      definition: '',
      description: 'from description',
      alternativeNames: { en: 'x' } as unknown as string[],
    };
    answer('en', bundle('en', [odd]));

    const entry = await firstValueFrom(glossary.getEntryById('odd'));

    expect(entry?.definition).toBe('from description');
    expect(entry?.alternativeNames).toEqual([]);
  });
});
