import { Injectable, signal } from '@angular/core';
import { UserDataProvider } from '../models/user-data-provider';
import { PlaygroundSlice } from '../models/user-data-envelope';
import { safeStorage } from '../utils/safe-storage';

/**
 * The playground's one setting: the comet trail behind the cursor.
 *
 * Earlier versions also offered a Game-of-Life background and a snake game
 * (speed, autopilot, players). Neither was ever built, so their switches did
 * nothing and are gone. Their storage keys stay registered as legacy in
 * utils/storage-keys.ts, so "delete all my data" still removes them, and an
 * export file that carries `gameOfLife` or `snake` is accepted and those
 * fields are ignored.
 */
@Injectable({ providedIn: 'root' })
export class PlaygroundSettingsService implements UserDataProvider<'playground'> {
  readonly sliceKey = 'playground' as const;
  readonly storageKeys = ['cursorGlowAfterburn'] as const;

  private static readonly CURSOR_KEY = 'cursorGlowAfterburn';

  readonly cursorGlowAfterburn = signal(this.readBool(PlaygroundSettingsService.CURSOR_KEY, false));

  setCursorGlowAfterburn(value: boolean): void {
    this.persist(PlaygroundSettingsService.CURSOR_KEY, value);
    this.cursorGlowAfterburn.set(value);
  }

  private readBool(key: string, defaultValue = false): boolean {
    const stored = safeStorage.get(key);
    if (stored === null) return defaultValue;
    return stored === 'true';
  }

  private persist(key: string, value: boolean): void {
    safeStorage.set(key, String(value));
  }

  // === UserDataProvider implementation ===

  exportSlice(): PlaygroundSlice {
    return {
      cursorTrail: this.cursorGlowAfterburn(),
    };
  }

  /** Files exported before the retired settings were removed carry `gameOfLife` and `snake`; both are ignored. */
  validateSlice(data: unknown): data is PlaygroundSlice {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    const obj = data as Record<string, unknown>;
    return obj['cursorTrail'] === undefined || typeof obj['cursorTrail'] === 'boolean';
  }

  importSlice(data: PlaygroundSlice): void {
    if (data.cursorTrail !== undefined) this.setCursorGlowAfterburn(data.cursorTrail);
  }
}
