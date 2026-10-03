import { HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideOfflineHttp } from '../testing/offline-http';
import { HighlightingService } from './highlighting.service';
import { TranslationService } from './translation.service';

/**
 * The glossary tooltips follow the configured fallback chain (languages.json),
 * but never across a language boundary: an Easy-Language page may borrow its
 * base language's glossary, an English page must not get German definitions.
 */
describe('HighlightingService glossary fallback', () => {
  let service: HighlightingService;
  let controller: HttpTestingController;
  let translation: { currentLanguage: string; currentLanguage$: ReturnType<typeof signal<string>> };
  const url = (lang: string) => `/assets/data/core/glossary/compiled-glossary.${lang}.json`;
  const glossary = {
    transformer: {
      id: 't1',
      term: 'Transformer',
      definition: 'd',
      category: 'c',
      popularity: 'high',
      alternatives: [],
    },
  };

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    translation = { currentLanguage: 'en', currentLanguage$: signal('en') };
    TestBed.configureTestingModule({
      providers: [provideOfflineHttp(), { provide: TranslationService, useValue: translation }],
    });
    service = TestBed.inject(HighlightingService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    vi.restoreAllMocks();
  });

  const fail = (lang: string) => controller.expectOne(url(lang)).flush(null, { status: 404, statusText: 'Not Found' });
  const settle = () => new Promise((resolve) => setTimeout(resolve));

  it('does not fall back to German when the English glossary fails', async () => {
    const done = service.ensureLanguageLoaded('en');
    fail('en');
    await done;
    controller.expectNone(url('de'));
    expect(service.isReady()).toBe(false);
  });

  it('serves the base-language glossary to its Easy-Language variant', async () => {
    const done = service.ensureLanguageLoaded('en-easy');
    fail('en-easy');
    await settle();
    controller.expectOne(url('en')).flush(glossary);
    await done;
    controller.expectNone(url('de'));
    expect(service.getEntryById('t1', 'en-easy')?.term).toBe('Transformer');
    expect(service.processContent('A Transformer model.', 'en-easy').matches).toHaveLength(1);
  });

  it('starts with the configured default language when no language is set yet', async () => {
    translation.currentLanguage = '';
    const done = service.initialize();
    controller.expectOne(url('de')).flush(glossary);
    await done;
    expect(service.getEntryById('t1', 'de')).not.toBeNull();
  });
});
