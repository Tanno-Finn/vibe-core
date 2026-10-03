/**
 * EasyLanguageService spec — the question the Easy-Language FAB asks of every
 * page: "is there an Easy-Language version of this?".
 *
 * Deliberately written against the public API only (`hasEasyVersion`,
 * `getEasyContent` and the registry mutators). The registry's storage is due
 * to be refactored; these tests must keep passing across that change.
 */
import { TestBed } from '@angular/core/testing';

import { EasyLanguageContent, EasyLanguageService } from './easy-language.service';

function content(originalId: string, hasEasyVersion: boolean): EasyLanguageContent {
  return {
    originalId,
    contentType: 'article',
    hasEasyVersion,
    lastUpdated: new Date('2026-01-01'),
    qualityLevel: 'A2',
  };
}

describe('EasyLanguageService', () => {
  let service: EasyLanguageService;

  beforeEach(() => {
    localStorage.removeItem('easyLanguagePreferences');
    localStorage.removeItem('easyLanguageAnalytics');
    TestBed.configureTestingModule({});
    service = TestBed.inject(EasyLanguageService);
  });

  afterEach(() => {
    localStorage.removeItem('easyLanguagePreferences');
    localStorage.removeItem('easyLanguageAnalytics');
  });

  describe('hasEasyVersion', () => {
    // Shell pages only (src/config/features.json `shellPages`): every locale carries
    // their previews, while a switched-off feature's preview may be missing in a new
    // language and then drops out of easy-language-availability.json.
    it('says yes for a page the kit ships in Easy Language', () => {
      expect(service.hasEasyVersion('user-settings')).toBe(true);
      expect(service.hasEasyVersion('home')).toBe(true);
    });

    it('says no for content it has never heard of', () => {
      expect(service.hasEasyVersion('no-such-page')).toBe(false);
      expect(service.hasEasyVersion('')).toBe(false);
    });

    it('does not let a disagreeing content type hide a registered version', () => {
      // Callers derive the type themselves and often disagree with the registry;
      // that must not switch the FAB off.
      expect(service.hasEasyVersion('user-settings', 'demo')).toBe(true);
      expect(service.hasEasyVersion('user-settings', 'something-else')).toBe(true);
    });

    it('says no for content registered explicitly without an Easy version', () => {
      service.addEasyContent(content('art-hard', false));

      expect(service.hasEasyVersion('art-hard')).toBe(false);
    });

    it('follows content being added and removed', () => {
      service.addEasyContent(content('art-new', true));
      expect(service.hasEasyVersion('art-new')).toBe(true);

      service.removeEasyContent('art-new');
      expect(service.hasEasyVersion('art-new')).toBe(false);
    });

    it('is case-sensitive: ids are route slugs, not free text', () => {
      expect(service.hasEasyVersion('USER-SETTINGS')).toBe(false);
    });
  });

  describe('getEasyContent', () => {
    it('returns the registry entry for known content', () => {
      const entry = service.getEasyContent('user-settings');

      expect(entry).not.toBeNull();
      expect(entry?.originalId).toBe('user-settings');
      expect(entry?.hasEasyVersion).toBe(true);
      expect(['A1', 'A2', 'B1']).toContain(entry?.qualityLevel);
    });

    it('returns null for unknown content', () => {
      expect(service.getEasyContent('no-such-page')).toBeNull();
    });

    it('still returns an entry that has no Easy version, so callers can tell "known, no" from "unknown"', () => {
      service.addEasyContent(content('art-hard', false));

      expect(service.getEasyContent('art-hard')?.hasEasyVersion).toBe(false);
    });

    it('agrees with hasEasyVersion for every entry it lists', () => {
      for (const entry of service.getAllEasyContent()) {
        expect(service.hasEasyVersion(entry.originalId), entry.originalId).toBe(true);
        expect(service.getEasyContent(entry.originalId)).toEqual(entry);
      }
    });

    it('leaves entries without an Easy version out of the full list', () => {
      service.addEasyContent(content('art-hard', false));

      expect(service.getAllEasyContent().map((e) => e.originalId)).not.toContain('art-hard');
    });
  });
});
