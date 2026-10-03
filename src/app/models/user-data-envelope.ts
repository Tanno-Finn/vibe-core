/**
 * User Data Envelope
 *
 * The wire format for the manual export/import feature in user settings.
 * Each `slices.<key>` is owned by exactly one `UserDataProvider`.
 *
 * Schema versioning lives in `schemaVersion` (envelope-level) and inside
 * `gamification.version` (legacy field on UserProgress). The envelope-level
 * version governs envelope structure; per-slice versions remain the slice's
 * own concern and are migrated by their owning provider.
 */
import { UserProgress } from './user-progress.model';

export const USER_DATA_SCHEMA_VERSION = 2;

export interface HighlightingSlice {
  enabled: boolean;
}

/**
 * Older files also carry `gameOfLife` and `snake`, settings for features that
 * never existed; PlaygroundSettingsService accepts and ignores them.
 */
export interface PlaygroundSlice {
  cursorTrail?: boolean;
}

/**
 * Exported for transparency; never applied on import — consent is not
 * restored from a file. `disableProgressTracking` is the retired opt-out flag:
 * older files carry it, current exports do not.
 */
export interface PrivacySlice {
  cookiePreferences?: {
    essential: boolean;
    progress: boolean;
    analytics: boolean;
  };
  disableProgressTracking?: boolean;
  analyticsConsent?: boolean;
}

export interface NotificationsSlice {
  /** ISO timestamp of the last time the bell/news feed was acknowledged. */
  lastSeenAt?: string;
  /** IDs the user explicitly marked read (capped, newest-last). */
  readIds?: string[];
}

/**
 * Catalog favorites and comparison list (entry ids). Optional slice added
 * without a schema bump: older files simply do not carry it.
 */
export interface CatalogSlice {
  favorites?: string[];
  compare?: string[];
}

export interface UserDataSlices {
  gamification?: UserProgress;
  highlighting?: HighlightingSlice;
  playground?: PlaygroundSlice;
  privacy?: PrivacySlice;
  notifications?: NotificationsSlice;
  catalog?: CatalogSlice;
}

export type UserDataSliceKey = keyof UserDataSlices;

export interface UserDataEnvelope {
  schemaVersion: typeof USER_DATA_SCHEMA_VERSION;
  exportedAt: string;
  appVersion?: string;
  slices: UserDataSlices;
}

/**
 * Type guard for our envelope format. Strict — anything missing
 * `schemaVersion` or `slices` is rejected as foreign.
 */
export function isUserDataEnvelope(data: unknown): data is UserDataEnvelope {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj['schemaVersion'] === 'number' &&
    typeof obj['exportedAt'] === 'string' &&
    typeof obj['slices'] === 'object' &&
    obj['slices'] !== null
  );
}
