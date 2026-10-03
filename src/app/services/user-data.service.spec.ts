/**
 * UserDataService spec — export and import have to be inverses. State is set
 * through the real providers, exported, serialized the way the download does,
 * wiped, and imported into a fresh injector; what comes back must equal what
 * went out. Also pins the parse errors and the roll-back on a failing slice.
 *
 * Providers used: progress, playground and privacy — the three with no HTTP or
 * translation dependencies. The contract is the same for the other two.
 */
import { TestBed } from '@angular/core/testing';

import { UserDataService } from './user-data.service';
import { UserProgressService } from './user-progress.service';
import { PlaygroundSettingsService } from './playground-settings.service';
import { PrivacyConsentService } from './privacy-consent.service';
import { USER_DATA_PROVIDERS, UserDataProvider } from '../models/user-data-provider';
import { HighlightingSlice, USER_DATA_SCHEMA_VERSION } from '../models/user-data-envelope';

const REAL_PROVIDERS = [
  { provide: USER_DATA_PROVIDERS, useExisting: UserProgressService, multi: true },
  { provide: USER_DATA_PROVIDERS, useExisting: PlaygroundSettingsService, multi: true },
  { provide: USER_DATA_PROVIDERS, useExisting: PrivacyConsentService, multi: true },
];

function freshInjector(extra: unknown[] = []): void {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [...REAL_PROVIDERS, ...(extra as never[])] });
}

describe('UserDataService', () => {
  beforeEach(() => {
    localStorage.clear();
    freshInjector();
  });

  it('round-trips progress, playground and privacy through a JSON file', () => {
    const progress = TestBed.inject(UserProgressService);
    const playground = TestBed.inject(PlaygroundSettingsService);
    const privacy = TestBed.inject(PrivacyConsentService);

    privacy.setCookiePreferences({ essential: true, progress: true, analytics: false });
    progress.setCheckpointCompleted('guide-a', 'step-1');
    progress.setCheckpointCompleted('guide-a', 'step-2');
    playground.setCursorGlowAfterburn(true);

    const envelope = TestBed.inject(UserDataService).buildEnvelope();
    expect(envelope.schemaVersion).toBe(USER_DATA_SCHEMA_VERSION);
    expect(Object.keys(envelope.slices).sort()).toEqual(['gamification', 'playground', 'privacy']);
    const file = JSON.stringify(envelope);
    const exportedProgress = envelope.slices.gamification;

    // A different device where the visitor has agreed to progress storage
    // (an import is not consent — see the next test), new service instances.
    localStorage.clear();
    localStorage.setItem('cookiePreferences', JSON.stringify({ essential: true, progress: true, analytics: false }));
    freshInjector();

    const service = TestBed.inject(UserDataService);
    const parsed = service.parseEnvelope(file);
    expect(parsed.error).toBeUndefined();
    const result = service.applyEnvelope(parsed.envelope!);

    expect(result).toEqual({
      success: true,
      appliedSlices: ['gamification', 'playground', 'privacy'],
      skippedSlices: [],
      rolledBack: false,
    });
    expect(TestBed.inject(UserProgressService).getCheckpoints('guide-a')).toEqual(['step-1', 'step-2']);
    expect(TestBed.inject(UserProgressService).exportSlice()).toEqual(exportedProgress);
    expect(TestBed.inject(PlaygroundSettingsService).cursorGlowAfterburn()).toBe(true);
    // Consent is never imported from a file (see privacy-consent.service.spec.ts):
    // the device keeps its own decision, whatever the file says.
    expect(TestBed.inject(PrivacyConsentService).getCookiePreferences()).toEqual({
      essential: true,
      progress: true,
      analytics: false,
    });
    // And the import persisted, so a reload sees the same state.
    expect(JSON.parse(localStorage.getItem('user_progress')!).completedCheckpoints).toEqual({
      'guide-a': ['step-1', 'step-2'],
    });
  });

  it('does not save imported progress on a device without progress consent', () => {
    const file = JSON.stringify({
      schemaVersion: USER_DATA_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      slices: {
        gamification: {
          totalPoints: 0,
          quizCount: 0,
          unlockedAchievements: [],
          completedQuizzes: ['quiz-a'],
          completedCheckpoints: {},
          completedLearningPaths: [],
          version: 1,
        },
        privacy: { cookiePreferences: { essential: true, progress: true, analytics: true } },
      },
    });

    const service = TestBed.inject(UserDataService);
    const result = service.applyEnvelope(service.parseEnvelope(file).envelope!);

    expect(result.success).toBe(true);
    expect(localStorage.getItem('user_progress')).toBeNull();
    expect(TestBed.inject(PrivacyConsentService).hasProgressConsent()).toBe(false);
  });

  it('reports a file that is not JSON', () => {
    expect(TestBed.inject(UserDataService).parseEnvelope('{not json').error).toBe('invalid_json');
  });

  it('recognizes the old v1 export format', () => {
    const v1 = JSON.stringify({ exportDate: '2024-01-01', theme: 'dark', language: 'de' });
    expect(TestBed.inject(UserDataService).parseEnvelope(v1).error).toBe('legacy_v1_format');
  });

  it('rejects a foreign JSON file', () => {
    expect(TestBed.inject(UserDataService).parseEnvelope('{"hello":"world"}').error).toBe('unknown_format');
  });

  it('skips unknown and malformed slices without failing the import', () => {
    const service = TestBed.inject(UserDataService);
    const result = service.applyEnvelope({
      schemaVersion: USER_DATA_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      slices: {
        playground: { cursorTrail: 'yes' },
        somethingNew: { x: 1 },
      } as never,
    });

    expect(result.success).toBe(true);
    expect(result.skippedSlices.sort()).toEqual(['playground', 'somethingNew']);
    expect(TestBed.inject(PlaygroundSettingsService).cursorGlowAfterburn()).toBe(false);
  });

  it('accepts an older file with the retired Game-of-Life and snake settings and ignores them', () => {
    const service = TestBed.inject(UserDataService);
    const result = service.applyEnvelope({
      schemaVersion: USER_DATA_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      slices: {
        playground: { cursorTrail: true, gameOfLife: true, snake: { enabled: true, speed: 80, playerCount: 3 } },
      } as never,
    });

    expect(result.appliedSlices).toEqual(['playground']);
    expect(TestBed.inject(PlaygroundSettingsService).cursorGlowAfterburn()).toBe(true);
    for (const retired of ['gameOfLifeBackground', 'snakeGame', 'snakeSpeed', 'snakePlayerCount']) {
      expect(localStorage.getItem(retired)).toBeNull();
    }
  });

  it('rolls back slices already applied when a later one throws', () => {
    const exploding: UserDataProvider<'highlighting'> = {
      sliceKey: 'highlighting',
      storageKeys: [],
      exportSlice: () => null,
      validateSlice: (d: unknown): d is HighlightingSlice => typeof d === 'object' && d !== null,
      importSlice: () => {
        throw new Error('boom');
      },
    };
    freshInjector([{ provide: USER_DATA_PROVIDERS, useValue: exploding, multi: true }]);
    const playground = TestBed.inject(PlaygroundSettingsService);
    playground.setCursorGlowAfterburn(false);

    const result = TestBed.inject(UserDataService).applyEnvelope({
      schemaVersion: USER_DATA_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      slices: { playground: { cursorTrail: true }, highlighting: { enabled: false } },
    });

    expect(result.success).toBe(false);
    expect(result.rolledBack).toBe(true);
    expect(result.error).toBe('boom');
    expect(playground.cursorGlowAfterburn()).toBe(false);
  });
});
