/**
 * User Data Service
 *
 * Orchestrates the manual export/import feature for user data.
 *
 * Architecture:
 *  - Each domain service that owns user state implements `UserDataProvider`
 *    and registers itself via the multi-provider token `USER_DATA_PROVIDERS`.
 *  - This service composes the envelope on export, validates and applies
 *    on import, and rolls back on failure.
 *  - **Export is not gated**: it reads in-memory state whatever the consent
 *    state (a download is an explicit user action and writes nothing).
 *  - **Import is not consent**: the progress slice is saved only when the
 *    visitor has agreed to progress storage (UserProgressService gates it, and
 *    the settings page withholds it without consent and says so); the privacy
 *    slice never grants or withdraws consent (PrivacyConsentService).
 *
 * Slice apply order on import: everything else first, privacy last.
 */
import { Injectable, inject } from '@angular/core';
import { UserDataProvider, USER_DATA_PROVIDERS } from '../models/user-data-provider';
import {
  UserDataEnvelope,
  UserDataSliceKey,
  USER_DATA_SCHEMA_VERSION,
  isUserDataEnvelope,
} from '../models/user-data-envelope';

export type ParseError = 'invalid_json' | 'legacy_v1_format' | 'unknown_format';

export interface ParseResult {
  envelope: UserDataEnvelope | null;
  error?: ParseError;
}

export interface ImportResult {
  success: boolean;
  appliedSlices: string[];
  skippedSlices: string[];
  rolledBack: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class UserDataService {
  /** Privacy last: kept from when it carried a setting; today its import is a no-op (consent never comes from a file). */
  private static readonly APPLY_ORDER_TAIL: UserDataSliceKey[] = ['privacy'];

  private readonly providers: UserDataProvider[] = inject(USER_DATA_PROVIDERS, { optional: true }) ?? [];

  // -------- Export --------

  buildEnvelope(): UserDataEnvelope {
    const envelope: UserDataEnvelope = {
      schemaVersion: USER_DATA_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      slices: {},
    };

    for (const provider of this.providers) {
      const slice = provider.exportSlice();
      if (slice !== null && slice !== undefined) {
        (envelope.slices as Record<string, unknown>)[provider.sliceKey] = slice;
      }
    }

    return envelope;
  }

  // -------- Parse --------

  parseEnvelope(raw: string): ParseResult {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { envelope: null, error: 'invalid_json' };
    }

    if (isUserDataEnvelope(parsed)) {
      return { envelope: parsed };
    }

    if (this.looksLikeLegacyV1(parsed)) {
      return { envelope: null, error: 'legacy_v1_format' };
    }

    return { envelope: null, error: 'unknown_format' };
  }

  private looksLikeLegacyV1(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return (
      typeof obj['exportDate'] === 'string' &&
      ('points' in obj || 'achievements' in obj || 'theme' in obj || 'language' in obj)
    );
  }

  // -------- Apply --------

  applyEnvelope(envelope: UserDataEnvelope): ImportResult {
    const ordered = this.orderProviders();

    // Snapshot before any apply, for rollback on failure
    const snapshots = new Map<string, unknown>();
    for (const provider of ordered) {
      try {
        snapshots.set(provider.sliceKey, provider.exportSlice());
      } catch {
        snapshots.set(provider.sliceKey, null);
      }
    }

    const appliedSlices: string[] = [];
    const skippedSlices: string[] = [];

    // Track which provider keys exist for "unknown slice" detection
    const knownKeys = new Set(ordered.map((p) => p.sliceKey));
    for (const key of Object.keys(envelope.slices)) {
      if (!knownKeys.has(key as UserDataSliceKey)) {
        skippedSlices.push(key);
      }
    }

    for (const provider of ordered) {
      const sliceData = (envelope.slices as Record<string, unknown>)[provider.sliceKey];
      if (sliceData === undefined) continue;

      if (!provider.validateSlice(sliceData)) {
        skippedSlices.push(provider.sliceKey);
        continue;
      }

      try {
        provider.importSlice(sliceData as never);
        appliedSlices.push(provider.sliceKey);
      } catch (err) {
        // Roll back every slice that already applied
        this.rollback(appliedSlices, snapshots);
        return {
          success: false,
          appliedSlices: [],
          skippedSlices,
          rolledBack: true,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }

    return {
      success: true,
      appliedSlices,
      skippedSlices,
      rolledBack: false,
    };
  }

  /**
   * Returns providers in apply order: tail-keys (e.g. 'privacy') applied last.
   * Stable within each group (insertion order from DI).
   */
  private orderProviders(): UserDataProvider[] {
    const tail = UserDataService.APPLY_ORDER_TAIL;
    const tailSet = new Set<string>(tail);
    const head = this.providers.filter((p) => !tailSet.has(p.sliceKey));
    const tailProviders: UserDataProvider[] = [];
    for (const key of tail) {
      const found = this.providers.find((p) => p.sliceKey === key);
      if (found) tailProviders.push(found);
    }
    return [...head, ...tailProviders];
  }

  private rollback(applied: string[], snapshots: Map<string, unknown>): void {
    for (const key of applied) {
      const provider = this.providers.find((p) => p.sliceKey === key);
      if (!provider) continue;
      const snapshot = snapshots.get(key);
      try {
        if (snapshot === null || snapshot === undefined) {
          // No prior state — best effort: nothing to restore. Provider stays at the imported value.
          // Real-world providers should be idempotent enough to handle this.
          continue;
        }
        if (provider.validateSlice(snapshot)) {
          provider.importSlice(snapshot as never);
        }
      } catch {
        // Rollback is best-effort; swallow secondary failures
      }
    }
  }
}
