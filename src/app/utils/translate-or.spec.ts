import { Injector } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { translatedOr, translateOr } from './translate-or';

describe('translateOr', () => {
  const withTranslate = (translate: (key: string) => string) =>
    Injector.create({ providers: [{ provide: TranslationService, useValue: { translate } }] });

  it('returns the translated string when the key is loaded', () => {
    const injector = withTranslate(() => 'Neu laden');
    expect(translateOr(injector, 'errors.app.reload', 'Reload')).toBe('Neu laden');
  });

  it('falls back when the translation is not loaded (translate echoes the key)', () => {
    const injector = withTranslate((key) => key);
    expect(translateOr(injector, 'errors.app.reload', 'Reload')).toBe('Reload');
  });

  it('falls back when TranslationService cannot be resolved', () => {
    const injector = Injector.create({ providers: [] });
    expect(translateOr(injector, 'errors.app.reload', 'Reload')).toBe('Reload');
  });
});

describe('translatedOr', () => {
  it('returns the translation when the key has one', () => {
    expect(translatedOr(() => 'Kapitel Eins', 'sources.chapters.ch1', 'ch1')).toBe('Kapitel Eins');
  });

  it('falls back when translate() echoes a missing key, where `|| fallback` would show the key', () => {
    const echo = (key: string) => key;
    expect(echo('sources.chapters.unknown') || 'unknown').toBe('sources.chapters.unknown');
    expect(translatedOr(echo, 'sources.chapters.unknown', 'unknown')).toBe('unknown');
  });

  it('falls back on an empty translation', () => {
    expect(translatedOr(() => '', 'glossary.categories.new', 'new')).toBe('new');
  });
});
