/**
 * UpdateDetectionService spec — a new build must refresh caches and nothing
 * else. It used to call localStorage.clear() and restore only the keys that
 * UserDataProviders declared, so every deploy erased theme, font, language,
 * catalog favorites and the feedback inbox. These tests seed every registered
 * key, simulate a version change and check what survives.
 */
import { TestBed } from '@angular/core/testing';

import { UpdateDetectionService } from './update-detection.service';
import { NotificationService } from './notification.service';
import { STORAGE_KEYS, keysClearedOnUpdate } from '../utils/storage-keys';

const STALE_VERSION = JSON.stringify({ version: '19990101-deadbeef', buildTime: '19990101', hash: 'deadbeef' });

/** Enough ticks for clearAllCaches() → then(storeCurrentVersion) to settle. */
async function settle(): Promise<void> {
  for (let i = 0; i < 10; i++) await Promise.resolve();
}

function createService(): UpdateDetectionService {
  TestBed.configureTestingModule({
    providers: [{ provide: NotificationService, useValue: { injectClientNotification: () => undefined } }],
  });
  return TestBed.inject(UpdateDetectionService);
}

describe('UpdateDetectionService', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // the 5-minute poll must not outlive the test
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps every user-data and preference key when the version changes', async () => {
    for (const { name: key } of STORAGE_KEYS) localStorage.setItem(key, `seed:${key}`);
    localStorage.setItem('app_version', STALE_VERSION);

    const service = createService();
    await settle();

    for (const { name: key, class: cls } of STORAGE_KEYS) {
      if (cls === 'user-data' || cls === 'preference') {
        expect(localStorage.getItem(key), key).toBe(`seed:${key}`);
      }
    }
    expect(localStorage.getItem('app_version')).toBe(JSON.stringify(service.getCurrentVersion()));
  });

  it('drops the clear-on-update caches when the version changes', async () => {
    for (const key of keysClearedOnUpdate()) localStorage.setItem(key, 'stale');
    localStorage.setItem('app_version', STALE_VERSION);

    createService();
    await settle();

    for (const key of keysClearedOnUpdate()) {
      expect(localStorage.getItem(key), key).toBeNull();
    }
  });

  it('leaves keys it does not own and sessionStorage alone', async () => {
    localStorage.setItem('someone-elses-key', 'x');
    sessionStorage.setItem('someone-elses-session', 'y');
    localStorage.setItem('app_version', STALE_VERSION);

    createService();
    await settle();

    expect(localStorage.getItem('someone-elses-key')).toBe('x');
    expect(sessionStorage.getItem('someone-elses-session')).toBe('y');
  });

  it('only records the version on a first visit and deletes nothing', async () => {
    localStorage.setItem('easyLanguageAnalytics', 'kept');

    const service = createService();
    await settle();

    expect(localStorage.getItem('app_version')).toBe(JSON.stringify(service.getCurrentVersion()));
    expect(localStorage.getItem('easyLanguageAnalytics')).toBe('kept');
  });

  it('does nothing when the stored version matches the running build', async () => {
    const service = createService();
    await settle();
    localStorage.setItem('easyLanguageAnalytics', 'kept');

    service.forceUpdateCheck();
    await settle();

    expect(localStorage.getItem('easyLanguageAnalytics')).toBe('kept');
  });
});
