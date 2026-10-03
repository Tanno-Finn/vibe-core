import { TestBed } from '@angular/core/testing';
import { Optimus } from '@openng/optimus-ui/config';
import { OPTIMUS_ARIA_KEYS, OptimusA11yService } from './optimus-a11y.service';
import { TranslationService } from './translation.service';
import de from '../../assets/i18n/modules/de/optimus.json';
import deEasy from '../../assets/i18n/modules/de-easy/optimus.json';
import en from '../../assets/i18n/modules/en/optimus.json';
import enEasy from '../../assets/i18n/modules/en-easy/optimus.json';

/**
 * OptimusA11yService.syncAriaStrings() — the Optimus screen-reader vocabulary in
 * the page language. The image-preview, carousel/galleria and paginator labels
 * used to stay English on a German page because they were missing from the
 * hand-written list; these cases pin the list, the four locale files and the
 * merge into the library config to one another.
 */
describe('OptimusA11yService.syncAriaStrings', () => {
  const LOCALES: Record<string, Record<string, string>> = {
    de,
    'de-easy': deEasy,
    en,
    'en-easy': enEasy,
  };

  function setup() {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslationService, useValue: { translate: (key: string) => `T(${key})` } }],
    });
    return { service: TestBed.inject(OptimusA11yService), optimus: TestBed.inject(Optimus) };
  }

  it('hands every listed key to the library, translated', () => {
    const { service, optimus } = setup();
    service.syncAriaStrings();
    const aria = optimus.translation.aria as Record<string, string>;
    for (const key of OPTIMUS_ARIA_KEYS) {
      expect(aria[key], key).toBe(`T(optimus.${key})`);
    }
  });

  it('covers the image preview, carousel/galleria and paginator labels', () => {
    const keys: readonly string[] = OPTIMUS_ARIA_KEYS;
    for (const key of [
      'zoomImage',
      'zoomIn',
      'zoomOut',
      'rotateRight',
      'rotateLeft',
      'slide',
      'pageLabel',
      'prevPageLabel',
      'nextPageLabel',
    ]) {
      expect(keys, key).toContain(key);
    }
  });

  it('keeps the library defaults of the keys it does not translate', () => {
    const { service, optimus } = setup();
    const before = { ...(optimus.translation.aria as Record<string, string>) };
    service.syncAriaStrings();
    const aria = optimus.translation.aria as Record<string, string>;
    const untouched = Object.keys(before).filter((k) => !(OPTIMUS_ARIA_KEYS as readonly string[]).includes(k));
    expect(untouched.length).toBeGreaterThan(0);
    for (const key of untouched) expect(aria[key], key).toBe(before[key]);
    // slideNumber stays the bare number on purpose (see OPTIMUS_ARIA_KEYS).
    expect(aria['slideNumber']).toBe('{slideNumber}');
  });

  for (const [locale, strings] of Object.entries(LOCALES)) {
    it(`${locale}/optimus.json carries exactly the listed keys, none blank, placeholders intact`, () => {
      expect(Object.keys(strings).sort()).toEqual([...OPTIMUS_ARIA_KEYS].sort());
      for (const key of OPTIMUS_ARIA_KEYS) expect(strings[key].trim(), key).not.toBe('');
      expect(strings['pageLabel']).toContain('{page}');
      expect(strings['stars']).toContain('{star}');
    });
  }

  it('names the German preview and carousel controls in German', () => {
    expect(de['zoomImage']).not.toBe(en['zoomImage']);
    expect(de['slide']).not.toBe(en['slide']);
    expect(de['prevPageLabel']).not.toBe(en['prevPageLabel']);
  });
});
