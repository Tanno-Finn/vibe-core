/**
 * User Data Provider — domain-service contract for export/import.
 *
 * Each Angular service that owns user-persisted state implements this
 * interface and registers itself via the `USER_DATA_PROVIDERS` multi-token.
 * The `UserDataService` orchestrates, but the provider owns the slice.
 */
import { InjectionToken } from '@angular/core';
import { UserDataSliceKey, UserDataSlices } from './user-data-envelope';

export interface UserDataProvider<K extends UserDataSliceKey = UserDataSliceKey> {
  /** Slice key in the envelope. Must be unique across providers. */
  readonly sliceKey: K;

  /**
   * The localStorage keys this provider owns. Every one must also be listed
   * in `utils/storage-keys.ts` (the registry that drives the update-time cache
   * cleanup and "delete all my data"); `storage-keys.spec.ts` enforces that.
   *
   * Being a provider is about export/import, not survival: since the update
   * check stopped wiping localStorage, a key survives a deploy because the
   * registry does not classify it as a clear-on-update cache.
   */
  readonly storageKeys: readonly string[];

  /**
   * Read the current in-memory state. Returns `null` to skip this slice
   * in the export (e.g. if the user has nothing to export yet).
   *
   * Important: must not consult privacy gates — export is a manual,
   * user-initiated action. The orchestrator will not call this unless
   * the user explicitly requested an export.
   */
  exportSlice(): NonNullable<UserDataSlices[K]> | null;

  /**
   * Type guard that runs before `importSlice` is called.
   * Return `false` for any malformed input — the orchestrator will
   * skip the slice and report it.
   */
  validateSlice(data: unknown): data is NonNullable<UserDataSlices[K]>;

  /**
   * Apply the validated slice. Implementations must:
   *  - update in-memory state
   *  - persist to localStorage the way their own writes do. An import is an
   *    explicit user action, but not a consent decision: the progress slice is
   *    saved only with progress consent, and the privacy slice never changes
   *    consent.
   *
   * May throw on internal failure; the orchestrator will catch and roll back
   * via `importSlice(snapshot)` on each provider that already applied.
   */
  importSlice(data: NonNullable<UserDataSlices[K]>): void;
}

/**
 * Multi-provider DI token. Domain services contribute to this list via
 * `{ provide: USER_DATA_PROVIDERS, useExisting: MyService, multi: true }`
 * in app.config.ts.
 */
export const USER_DATA_PROVIDERS = new InjectionToken<UserDataProvider[]>('USER_DATA_PROVIDERS');
