/**
 * User Progress Service
 *
 * Holds the visitor's learning progress — completed quizzes, checkpoints and
 * learning paths — and exposes it reactively.
 *
 * Consent gate: progress is written to localStorage only while
 * `PrivacyConsentService.hasProgressConsent()` is true. Before any decision the
 * progress lives in memory for the session and nothing is written; when the
 * visitor then agrees, `applyConsent()` saves what the session gathered. After
 * a "no" nothing is written and the stored record (plus its older formats) is
 * removed. Reading a record that already exists is not gated — it was stored
 * under an earlier consent, and a later "yes" saves it together with the
 * session's additions instead of overwriting it.
 */

import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProgress, DEFAULT_USER_PROGRESS } from '../models/user-progress.model';
import { UserDataProvider } from '../models/user-data-provider';
import { PrivacyConsentService } from './privacy-consent.service';
import { safeStorage } from '../utils/safe-storage';
import { removeLegacyProgressKeys } from '../utils/storage-keys';

/**
 * A deep copy of the defaults. Spreading DEFAULT_USER_PROGRESS copies only the
 * top level, so a fresh visitor's progress shared its arrays with the constant
 * and the first quiz was pushed into the default itself.
 */
function freshDefaults(): UserProgress {
  return structuredClone(DEFAULT_USER_PROGRESS);
}

const stringArray = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === 'string') : []);

@Injectable({
  providedIn: 'root',
})
export class UserProgressService implements UserDataProvider<'gamification'> {
  /** UserDataProvider contract */
  readonly sliceKey = 'gamification' as const;
  readonly storageKeys = ['user_progress'] as const;

  /**
   * Storage key. Versioning lives in the schema (`UserProgress.version`),
   * not in the key name. `_v2` suffix would just leak schema concerns into
   * storage layout — kept out deliberately. If the schema ever incompatibly
   * changes, migrate the value, not the key.
   */
  private readonly STORAGE_KEY = 'user_progress';

  /** Legacy v1 key from the original gamification service. */
  private static readonly LEGACY_V1_KEY = 'learning_platform_gamification';
  /** Legacy v2 key — same data shape, just a renamed key. One-shot migration to STORAGE_KEY. */
  private static readonly LEGACY_V2_KEY = 'user_progress_v2';

  private progressSubject = new BehaviorSubject<UserProgress>(freshDefaults());
  public progress$ = this.progressSubject.asObservable();

  private privacyConsent = inject(PrivacyConsentService);

  constructor() {
    if (this.privacyConsent.isProgressDeclined()) {
      // A "no" on record: whatever an earlier version stored goes, nothing is loaded.
      this.clearStoredProgress();
      return;
    }
    this.migrateLegacyKeys();
    this.loadProgress();
  }

  /**
   * One-shot cleanup/migration of retired storage keys.
   *  - v1 (`learning_platform_gamification`): migration was retired earlier; just delete.
   *  - v2 (`user_progress_v2`): same shape, just a renamed key. Copied to STORAGE_KEY
   *    only with consent (copying is a write); without a decision it stays where
   *    it is until the visitor decides.
   */
  private migrateLegacyKeys(): void {
    safeStorage.remove(UserProgressService.LEGACY_V1_KEY);

    if (!this.privacyConsent.hasProgressConsent()) return;
    const v2Data = safeStorage.get(UserProgressService.LEGACY_V2_KEY);
    if (v2Data !== null) {
      // Don't clobber if a value already exists at the new key (defensive — shouldn't happen).
      if (safeStorage.get(this.STORAGE_KEY) === null) {
        safeStorage.set(this.STORAGE_KEY, v2Data);
      }
      safeStorage.remove(UserProgressService.LEGACY_V2_KEY);
    }
  }

  /**
   * Load progress from localStorage (a read — allowed without consent, see the
   * header).
   */
  private loadProgress(): void {
    try {
      const savedProgress = safeStorage.get(this.STORAGE_KEY);
      if (savedProgress) {
        this.validateAndSetProgress(JSON.parse(savedProgress) as Partial<UserProgress>);
        return;
      }

      // No saved progress — start fresh
      this.progressSubject.next(freshDefaults());
    } catch (error) {
      console.warn('Error loading user progress, using defaults:', error);
      this.progressSubject.next(freshDefaults());
    }
  }

  /**
   * Validate and set progress data. Keeps only the fields the model knows:
   * records written by older versions carry retired metrics (streaks, demo
   * counters …), which are dropped here rather than written back forever.
   */
  private validateAndSetProgress(progress: Partial<UserProgress>): void {
    const defaults = freshDefaults();
    const checkpoints: { [storageKey: string]: string[] } = {};
    const rawCheckpoints = progress.completedCheckpoints;
    if (rawCheckpoints && typeof rawCheckpoints === 'object' && !Array.isArray(rawCheckpoints)) {
      for (const [key, ids] of Object.entries(rawCheckpoints)) {
        checkpoints[key] = stringArray(ids);
      }
    }

    this.progressSubject.next({
      totalPoints: typeof progress.totalPoints === 'number' ? progress.totalPoints : defaults.totalPoints,
      quizCount: typeof progress.quizCount === 'number' ? progress.quizCount : defaults.quizCount,
      unlockedAchievements: stringArray(progress.unlockedAchievements),
      completedQuizzes: stringArray(progress.completedQuizzes),
      completedLearningPaths: stringArray(progress.completedLearningPaths),
      completedCheckpoints: checkpoints,
      version: typeof progress.version === 'number' ? progress.version : defaults.version,
    });
  }

  /**
   * Save progress to localStorage — only with consent. Without it this is a
   * no-op and the progress stays in memory for the session.
   */
  private saveProgress(): void {
    if (!this.privacyConsent.hasProgressConsent()) return;
    safeStorage.set(this.STORAGE_KEY, JSON.stringify(this.progressSubject.value));
  }

  /** Remove the stored record and every older home of progress. Writes nothing. */
  private clearStoredProgress(): void {
    safeStorage.remove(this.STORAGE_KEY);
    removeLegacyProgressKeys();
  }

  /**
   * Get current progress snapshot
   */
  getCurrentProgress(): UserProgress {
    return { ...this.progressSubject.value };
  }

  // === Collections ===

  addCompletedQuiz(quizId: string): void {
    const current = this.getCurrentProgress();
    if (!current.completedQuizzes.includes(quizId)) {
      current.completedQuizzes = [...current.completedQuizzes, quizId];
      current.quizCount += 1;
      this.progressSubject.next(current);
      this.saveProgress();
    }
  }

  addCompletedLearningPath(pathId: string): void {
    const current = this.getCurrentProgress();
    if (!current.completedLearningPaths.includes(pathId)) {
      current.completedLearningPaths = [...current.completedLearningPaths, pathId];
      this.progressSubject.next(current);
      this.saveProgress();
    }
  }

  // === Checkpoint Management ===

  getCheckpoints(storageKey: string): string[] {
    const current = this.progressSubject.value;
    return current.completedCheckpoints?.[storageKey] || [];
  }

  isCheckpointCompleted(storageKey: string, checkpointId: string): boolean {
    return this.getCheckpoints(storageKey).includes(checkpointId);
  }

  setCheckpointCompleted(storageKey: string, checkpointId: string): void {
    const current = this.getCurrentProgress();
    const done = current.completedCheckpoints[storageKey] ?? [];
    if (!done.includes(checkpointId)) {
      current.completedCheckpoints = { ...current.completedCheckpoints, [storageKey]: [...done, checkpointId] };
      this.progressSubject.next(current);
      this.saveProgress();
    }
  }

  removeCheckpointCompleted(storageKey: string, checkpointId: string): void {
    const current = this.getCurrentProgress();
    if (!current.completedCheckpoints?.[storageKey]) return;
    const remaining = current.completedCheckpoints[storageKey].filter((id) => id !== checkpointId);
    const next = { ...current.completedCheckpoints, [storageKey]: remaining };
    if (remaining.length === 0) {
      delete next[storageKey];
    }
    current.completedCheckpoints = next;
    this.progressSubject.next(current);
    this.saveProgress();
  }

  // === Consent ===

  /** Whether progress is currently being saved to this browser (consent given). */
  isSaving(): boolean {
    return this.privacyConsent.hasProgressConsent();
  }

  /**
   * Whether the visitor decided against progress storage (banner "essential
   * only", or the switch turned off). Undecided visitors are not "disabled":
   * they have simply not been asked yet.
   */
  isTrackingDisabled(): boolean {
    return this.privacyConsent.isProgressDeclined();
  }

  /**
   * Act on the consent decision just recorded in `PrivacyConsentService`:
   * with consent, save what this session gathered (so nothing done before the
   * "yes" is lost); without it, reset the progress and remove what is stored.
   * Called by the cookie banner/dialog and the settings page after they record
   * a decision.
   */
  applyConsent(): void {
    if (this.privacyConsent.hasProgressConsent()) {
      this.saveProgress();
    } else {
      this.resetProgress();
    }
  }

  // === Utility ===

  /**
   * Reset all progress: back to the defaults in memory, and the stored record
   * (with its older formats) removed. Writes nothing.
   */
  resetProgress(): void {
    this.progressSubject.next(freshDefaults());
    this.clearStoredProgress();
  }

  // === UserDataProvider implementation ===

  /**
   * Read-only snapshot of the current in-memory state. Not consent-gated:
   * a manual export is an explicit user action and writes nothing to storage.
   */
  exportSlice(): UserProgress | null {
    return this.getCurrentProgress();
  }

  validateSlice(data: unknown): data is UserProgress {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    // Spot-check load-bearing fields. We're permissive on optional fields
    // so older valid exports still validate; validateAndSetProgress fills gaps.
    return (
      typeof obj['totalPoints'] === 'number' &&
      Array.isArray(obj['unlockedAchievements']) &&
      Array.isArray(obj['completedQuizzes'])
    );
  }

  /**
   * Import replaces the in-memory progress and saves it **only with consent**
   * — an import is not a consent decision. The settings page withholds this
   * slice when there is no consent and tells the visitor why, because it
   * reloads after an import and an unsaved import would silently vanish.
   */
  importSlice(data: UserProgress): void {
    this.validateAndSetProgress(data);
    this.saveProgress();
  }
}
