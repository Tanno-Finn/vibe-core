/**
 * Privacy Consent Service
 *
 * Canonical owner of the privacy-related localStorage keys.
 * All readers and writers across the app go through this service —
 * direct safeStorage access for these keys is forbidden.
 *
 * One source of truth for progress storage: `cookiePreferences.progress`.
 * Learning progress is written to the browser only after the visitor agreed
 * to it — "accept all" in the cookie banner, or the progress switch turned on
 * in the cookie settings or on the settings page. Before any decision nothing
 * is written (progress lives in memory for the session); after a "no" nothing
 * is written and what was stored is removed. `hasProgressConsent()` is the one
 * predicate every progress writer asks.
 *
 * Migration: earlier versions kept a second flag, `disableProgressTracking`
 * (`'true'` = opted out, absent = tracking on — even before any decision). It
 * is folded into `cookiePreferences.progress` once, on construction, and then
 * removed: a stored `'true'` turns a saved `progress: true` into `false` (the
 * later opt-out wins); a visitor who accepted and never opted out keeps
 * `progress: true` and with it every stored record.
 *
 * `analyticsConsent` is stored as the literal `'true'`/`'false'`.
 *
 * `preferencesChanged` emits every decision written through this service,
 * whoever wrote it — the banner, its dialog or the settings page. The banner
 * listens so that a decision made elsewhere removes it at once, instead of it
 * asking for a decision that already exists until the next reload.
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDataProvider } from '../models/user-data-provider';
import { PrivacySlice } from '../models/user-data-envelope';
import { safeStorage } from '../utils/safe-storage';

const KEY_COOKIE_PREFS = 'cookiePreferences';
/** Retired opt-out flag; read once by the migration, never written. */
const KEY_LEGACY_DISABLE_TRACKING = 'disableProgressTracking';
const KEY_ANALYTICS_CONSENT = 'analyticsConsent';

/** The consent decision the cookie banner, its dialog and the settings page write. */
export interface CookiePrefs {
  essential: boolean;
  progress: boolean; // Saving learning progress (quizzes, checkpoints, learning paths); opt-in
  analytics: boolean; // Anonymous usage analytics (TDDDG § 25 consent); opt-in
}

@Injectable({ providedIn: 'root' })
export class PrivacyConsentService implements UserDataProvider<'privacy'> {
  readonly sliceKey = 'privacy' as const;
  readonly storageKeys = [KEY_COOKIE_PREFS, KEY_ANALYTICS_CONSENT] as const;

  private readonly changes = new Subject<CookiePrefs>();
  /** Emits each consent decision stored through `setCookiePreferences()` or `setProgressConsent()`. */
  readonly preferencesChanged = this.changes.asObservable();

  constructor() {
    this.migrateLegacyTrackingFlag();
  }

  // === Public API — canonical readers/writers ===

  /**
   * Returns null if no preferences saved yet, or if the stored value is malformed.
   * Backward-compatible: legacy entries that pre-date the `analytics` field are
   * accepted and default `analytics` to `false` (the safe opt-in default).
   */
  getCookiePreferences(): CookiePrefs | null {
    const raw = safeStorage.get(KEY_COOKIE_PREFS);
    if (raw === null) return null;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (this.isCookiePrefs(parsed)) {
        return parsed;
      }
      // Backward-compat: accept entries with essential+progress only (older format)
      if (parsed && typeof parsed === 'object') {
        const o = parsed as Record<string, unknown>;
        if (typeof o['essential'] === 'boolean' && typeof o['progress'] === 'boolean') {
          return {
            essential: o['essential'],
            progress: o['progress'],
            analytics: typeof o['analytics'] === 'boolean' ? o['analytics'] : false,
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  setCookiePreferences(prefs: CookiePrefs): void {
    safeStorage.set(KEY_COOKIE_PREFS, JSON.stringify(prefs));
    this.changes.next({ ...prefs });
  }

  /**
   * THE progress-storage predicate: true only when the visitor has saved a
   * consent decision and switched progress storage on in it. No decision yet
   * and "no" both answer false. Every write of learning progress asks this.
   */
  hasProgressConsent(): boolean {
    return this.getCookiePreferences()?.progress === true;
  }

  /** True when the visitor decided and said no to progress storage (not merely undecided). */
  isProgressDeclined(): boolean {
    const prefs = this.getCookiePreferences();
    return prefs !== null && !prefs.progress;
  }

  /**
   * Record a progress decision made outside the banner (the settings page).
   * Writes the same `cookiePreferences` the banner writes, so the two can
   * never disagree; the analytics choice already stored is kept, and a visitor
   * who never decided on analytics gets the opt-in default, `false`.
   */
  setProgressConsent(granted: boolean): void {
    const existing = this.getCookiePreferences();
    this.setCookiePreferences({
      essential: true,
      progress: granted,
      analytics: existing?.analytics ?? false,
    });
  }

  /** True iff analytics is explicitly consented to. False or null both mean "no consent". */
  hasAnalyticsConsent(): boolean {
    return safeStorage.get(KEY_ANALYTICS_CONSENT) === 'true';
  }

  setAnalyticsConsent(consent: boolean): void {
    safeStorage.set(KEY_ANALYTICS_CONSENT, consent ? 'true' : 'false');
  }

  /**
   * Fold the retired `disableProgressTracking` flag into `cookiePreferences`
   * and delete it. Only ever narrows consent: an opt-out recorded in the old
   * flag turns a saved `progress: true` off; nothing here turns progress on.
   */
  private migrateLegacyTrackingFlag(): void {
    const legacy = safeStorage.get(KEY_LEGACY_DISABLE_TRACKING);
    if (legacy === null) return;
    const prefs = this.getCookiePreferences();
    if (legacy === 'true' && prefs?.progress) {
      this.setCookiePreferences({ ...prefs, progress: false });
    }
    safeStorage.remove(KEY_LEGACY_DISABLE_TRACKING);
  }

  // === UserDataProvider implementation ===

  exportSlice(): PrivacySlice | null {
    const slice: PrivacySlice = {};

    const cookiePrefs = this.getCookiePreferences();
    if (cookiePrefs) slice.cookiePreferences = cookiePrefs;

    if (safeStorage.get(KEY_ANALYTICS_CONSENT) !== null) {
      slice.analyticsConsent = this.hasAnalyticsConsent();
    }

    return Object.keys(slice).length === 0 ? null : slice;
  }

  validateSlice(data: unknown): data is PrivacySlice {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    const obj = data as Record<string, unknown>;

    const okBool = (v: unknown) => v === undefined || typeof v === 'boolean';
    // Files exported before the flag was retired still carry it; accepted, then ignored.
    if (!okBool(obj['disableProgressTracking'])) return false;
    if (!okBool(obj['analyticsConsent'])) return false;

    if (obj['cookiePreferences'] !== undefined) {
      if (!this.isCookiePrefs(obj['cookiePreferences'])) return false;
    }

    return true;
  }

  /**
   * Consent is a decision, not a setting: a backup file must never grant or
   * withdraw consent on the importing device — neither for analytics nor for
   * progress storage. The slice stays in the export (transparency — the user
   * sees everything the kit stored) but is deliberately ignored on import,
   * including the retired `disableProgressTracking` of older files. The device
   * keeps its own consent state; a device without one shows the cookie banner
   * as usual.
   */
  importSlice(_data: PrivacySlice): void {
    // Intentionally empty — see above.
  }

  private isCookiePrefs(v: unknown): v is CookiePrefs {
    if (!v || typeof v !== 'object') return false;
    const o = v as Record<string, unknown>;
    return (
      typeof o['essential'] === 'boolean' && typeof o['progress'] === 'boolean' && typeof o['analytics'] === 'boolean'
    );
  }
}
