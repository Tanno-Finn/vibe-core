import { TestBed } from '@angular/core/testing';
import { PrivacyConsentService } from './privacy-consent.service';

/**
 * Two promises:
 *  - `hasProgressConsent()` is the one progress predicate, and it is true only
 *    after a saved "yes" — undecided and "no" are both false. The retired
 *    `disableProgressTracking` flag is folded into it once and deleted; a
 *    visitor who accepted earlier keeps their consent.
 *  - The privacy slice is exported for transparency but never imported:
 *    consent is a decision the user makes on this device, never a setting a
 *    file can carry in (or take away).
 */
describe('PrivacyConsentService', () => {
  function fresh(): PrivacyConsentService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [PrivacyConsentService] });
    return TestBed.inject(PrivacyConsentService);
  }

  beforeEach(() => localStorage.clear());

  describe('progress consent', () => {
    it('is false before any decision', () => {
      const service = fresh();
      expect(service.hasProgressConsent()).toBe(false);
      expect(service.isProgressDeclined()).toBe(false);
    });

    it('is true only after a saved "yes"', () => {
      const service = fresh();
      service.setCookiePreferences({ essential: true, progress: true, analytics: false });
      expect(service.hasProgressConsent()).toBe(true);

      service.setCookiePreferences({ essential: true, progress: false, analytics: true });
      expect(service.hasProgressConsent()).toBe(false);
      expect(service.isProgressDeclined()).toBe(true);
    });

    it('records a settings-page decision in cookiePreferences and keeps the analytics choice', () => {
      const service = fresh();
      service.setCookiePreferences({ essential: true, progress: false, analytics: true });

      service.setProgressConsent(true);
      expect(service.getCookiePreferences()).toEqual({ essential: true, progress: true, analytics: true });

      service.setProgressConsent(false);
      expect(service.getCookiePreferences()).toEqual({ essential: true, progress: false, analytics: true });
    });

    it('announces every stored decision, from the banner and from the settings page alike', () => {
      const service = fresh();
      const seen: { progress: boolean }[] = [];
      service.preferencesChanged.subscribe((p) => seen.push({ progress: p.progress }));

      service.setCookiePreferences({ essential: true, progress: true, analytics: false });
      service.setProgressConsent(false);

      expect(seen).toEqual([{ progress: true }, { progress: false }]);
    });

    it('defaults analytics to off when the settings page records the first decision', () => {
      const service = fresh();
      service.setProgressConsent(true);
      expect(service.getCookiePreferences()).toEqual({ essential: true, progress: true, analytics: false });
    });
  });

  describe('migration of the retired disableProgressTracking flag', () => {
    it('keeps the consent of a visitor who accepted and never opted out', () => {
      localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: false }));

      expect(fresh().hasProgressConsent()).toBe(true);
    });

    it('turns a saved "yes" off when the old flag recorded a later opt-out, then deletes the flag', () => {
      localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: true }));
      localStorage.setItem('disableProgressTracking', 'true');

      const service = fresh();

      expect(service.hasProgressConsent()).toBe(false);
      expect(service.getCookiePreferences()).toEqual({ essential: true, progress: false, analytics: true });
      expect(localStorage.getItem('disableProgressTracking')).toBeNull();
    });

    it('never grants consent from the old flag alone', () => {
      localStorage.setItem('disableProgressTracking', 'false');

      const service = fresh();

      expect(service.hasProgressConsent()).toBe(false);
      expect(service.getCookiePreferences()).toBeNull();
      expect(localStorage.getItem('disableProgressTracking')).toBeNull();
    });
  });

  describe('user-data slice', () => {
    it('exports every privacy key that exists in storage', () => {
      const service = fresh();
      service.setCookiePreferences({ essential: true, progress: true, analytics: false });
      service.setAnalyticsConsent(false);

      expect(service.exportSlice()).toEqual({
        cookiePreferences: { essential: true, progress: true, analytics: false },
        analyticsConsent: false,
      });
    });

    it('exports null when nothing privacy-related was ever stored', () => {
      expect(fresh().exportSlice()).toBeNull();
    });

    it('still accepts files that carry the retired flag', () => {
      expect(fresh().validateSlice({ disableProgressTracking: true })).toBe(true);
    });

    it('never grants consent from a file', () => {
      const service = fresh();
      service.importSlice({
        cookiePreferences: { essential: true, progress: true, analytics: true },
        disableProgressTracking: false,
        analyticsConsent: true,
      });

      expect(service.getCookiePreferences()).toBeNull();
      expect(service.hasProgressConsent()).toBe(false);
      expect(service.hasAnalyticsConsent()).toBe(false);
      expect(localStorage.getItem('disableProgressTracking')).toBeNull();
    });

    it('never withdraws consent from a file either', () => {
      const service = fresh();
      service.setCookiePreferences({ essential: true, progress: true, analytics: false });
      service.setAnalyticsConsent(false);

      service.importSlice({
        cookiePreferences: { essential: true, progress: false, analytics: true },
        disableProgressTracking: true,
        analyticsConsent: true,
      });

      expect(service.hasProgressConsent()).toBe(true);
      expect(service.hasAnalyticsConsent()).toBe(false);
      expect(service.getCookiePreferences()).toEqual({ essential: true, progress: true, analytics: false });
    });
  });
});
