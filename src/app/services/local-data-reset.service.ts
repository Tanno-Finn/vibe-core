/**
 * LocalDataResetService — what "Delete all my data" in the settings actually does.
 *
 * Two halves, in this order:
 *  1. Put the services that hold the data in memory back to empty, so nothing
 *     still on screen writes the old state back before the page reloads.
 *  2. Remove every browser-storage key the kit owns, as listed in
 *     `utils/storage-keys.ts` (user data, preferences, caches, legacy keys).
 *
 * The settings page reloads afterwards; everything else (theme, font, language,
 * toggles) then starts from its defaults and the cookie banner asks again.
 * Kept out of the 1,500-line settings component so it can be tested on its own.
 */
import { Injectable, inject } from '@angular/core';
import { UserProgressService } from './user-progress.service';
import { FeedbackInboxService } from './feedback-inbox.service';
import { removeAllKitStorage } from '../utils/storage-keys';

@Injectable({ providedIn: 'root' })
export class LocalDataResetService {
  private readonly userProgress = inject(UserProgressService);
  private readonly feedbackInbox = inject(FeedbackInboxService);

  /** Returns the storage keys that were present and removed. */
  resetAll(): string[] {
    // resetProgress() empties the in-memory progress and removes its stored record.
    this.userProgress.resetProgress();
    this.feedbackInbox.clear();
    return removeAllKitStorage();
  }
}
