/**
 * Storage-key registry spec — the registry is only useful while it is complete
 * and its classes are honest, so this pins both: no duplicates, only caches may
 * be cleared on update, every UserDataProvider key is registered, and the two
 * helpers delete exactly what they claim and nothing the kit does not own.
 */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { TranslationService } from '../services/translation.service';
import { USER_DATA_PROVIDERS } from '../models/user-data-provider';
import { UserProgressService } from '../services/user-progress.service';
import { HighlightingService } from '../services/highlighting.service';
import { PlaygroundSettingsService } from '../services/playground-settings.service';
import { PrivacyConsentService } from '../services/privacy-consent.service';
import { NotificationService } from '../services/notification.service';
import { CatalogStateService } from '../pages/catalog/catalog-state.service';
import {
  LEGACY_KEY_PATTERNS,
  STORAGE_KEYS,
  clearUpdateCaches,
  keysClearedOnUpdate,
  removeAllKitStorage,
  storageKeysOf,
} from './storage-keys';

class TranslationServiceStub {
  readonly languageChanged = new Subject<{ newLang: string }>().asObservable();
  readonly currentLanguage$ = signal('en');
  get currentLanguage(): string {
    return 'en';
  }
  translate(key: string): string {
    return key;
  }
}

/** Write a recognizable value under every registered key. */
function seedAllRegisteredKeys(): void {
  for (const { name: key } of STORAGE_KEYS) localStorage.setItem(key, `seed:${key}`);
}

describe('storage-key registry', () => {
  beforeEach(() => localStorage.clear());

  it('registers each key once', () => {
    const keys = STORAGE_KEYS.map((e) => e.name);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('only lets cache entries be cleared on update', () => {
    const offenders = STORAGE_KEYS.filter((e) => e.clearOnUpdate && e.class !== 'cache');
    expect(offenders).toEqual([]);
    for (const key of keysClearedOnUpdate()) {
      expect(storageKeysOf('user-data')).not.toContain(key);
      expect(storageKeysOf('preference')).not.toContain(key);
    }
  });

  it('treats the retired easyLanguagePreferences as legacy: deploys drop it, reset deletes it', () => {
    const entry = STORAGE_KEYS.find((e) => e.name === 'easyLanguagePreferences');
    expect(entry).toMatchObject({ class: 'cache', legacy: true, clearOnUpdate: true });
    expect(keysClearedOnUpdate()).toContain('easyLanguagePreferences');
    expect(storageKeysOf('preference')).not.toContain('easyLanguagePreferences');
  });

  it('never clears the version marker on update (it is rewritten instead)', () => {
    expect(keysClearedOnUpdate()).not.toContain('app_version');
  });

  it('lists the keys that a deploy used to wipe as user state', () => {
    // The regression this registry exists for: all of these were lost on every deploy.
    const kept = [...storageKeysOf('user-data'), ...storageKeysOf('preference')];
    for (const key of [
      'vibecore.feedback.inbox.v1',
      'theme',
      'mode',
      'themeColor',
      'preferred-font-v1',
      'preferred-language-v2',
      'easy-language-mode',
      'catalog-favorites',
      'catalog-compare',
    ]) {
      expect(kept).toContain(key);
    }
  });

  it('registers every key a UserDataProvider declares', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TranslationService, useClass: TranslationServiceStub },
        { provide: USER_DATA_PROVIDERS, useExisting: UserProgressService, multi: true },
        { provide: USER_DATA_PROVIDERS, useExisting: HighlightingService, multi: true },
        { provide: USER_DATA_PROVIDERS, useExisting: PlaygroundSettingsService, multi: true },
        { provide: USER_DATA_PROVIDERS, useExisting: PrivacyConsentService, multi: true },
        { provide: USER_DATA_PROVIDERS, useExisting: NotificationService, multi: true },
        { provide: USER_DATA_PROVIDERS, useExisting: CatalogStateService, multi: true },
      ],
    });
    const providers = TestBed.inject(USER_DATA_PROVIDERS);
    const registered = new Set(STORAGE_KEYS.map((e) => e.name));

    expect(providers.length).toBe(6);
    for (const provider of providers) {
      for (const key of provider.storageKeys) {
        expect(registered.has(key), `${provider.sliceKey}: ${key}`).toBe(true);
      }
    }
  });

  describe('clearUpdateCaches()', () => {
    it('removes only the clear-on-update caches and leaves user data and preferences', () => {
      seedAllRegisteredKeys();
      localStorage.setItem('someone-elses-key', 'x');

      const removed = clearUpdateCaches();

      expect(removed.sort()).toEqual(keysClearedOnUpdate().sort());
      for (const { name: key, clearOnUpdate } of STORAGE_KEYS) {
        if (clearOnUpdate) {
          expect(localStorage.getItem(key)).toBeNull();
        } else {
          expect(localStorage.getItem(key)).toBe(`seed:${key}`);
        }
      }
      expect(localStorage.getItem('someone-elses-key')).toBe('x');
    });

    it('reports nothing when there is nothing to clear', () => {
      expect(clearUpdateCaches()).toEqual([]);
    });
  });

  describe('removeAllKitStorage()', () => {
    it('removes every registered key and legacy checkpoint keys, but not foreign keys', () => {
      seedAllRegisteredKeys();
      localStorage.setItem('prompting-guide-checkpoints', '["a"]');
      localStorage.setItem('art-agent-tests-checkpoint', '["b"]');
      localStorage.setItem('someone-elses-key', 'x');

      const removed = removeAllKitStorage();

      expect(removed).toContain('vibecore.feedback.inbox.v1');
      expect(removed).toContain('prompting-guide-checkpoints');
      for (const { name: key } of STORAGE_KEYS) {
        expect(localStorage.getItem(key)).toBeNull();
      }
      expect(localStorage.getItem('prompting-guide-checkpoints')).toBeNull();
      expect(localStorage.getItem('art-agent-tests-checkpoint')).toBeNull();
      expect(localStorage.getItem('someone-elses-key')).toBe('x');
      expect(localStorage.length).toBe(1);
    });

    it('does not throw when storage refuses to delete', () => {
      localStorage.setItem('theme', 'aura');
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new DOMException('denied', 'SecurityError');
      });
      expect(() => removeAllKitStorage()).not.toThrow();
      vi.restoreAllMocks();
    });

    it('has no legacy pattern that would match a current key by accident', () => {
      for (const { name: key } of STORAGE_KEYS) {
        for (const { pattern } of LEGACY_KEY_PATTERNS) {
          expect(pattern.test(key), key).toBe(false);
        }
      }
    });
  });
});
