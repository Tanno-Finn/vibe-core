/**
 * NotificationService — runtime backbone for the bell popover and the
 * /news page.
 *
 * Source data: src/assets/data/notifications.compiled.json (built by
 * scripts/sync-notifications.mjs from per-file sources). Read-state lives
 * in LocalStorage; hydration is deferred to afterNextRender so that
 * server-rendered HTML and the first client paint stay identical (no NG0500).
 *
 * Concept reference: an internal design note.
 */
import { Injectable, inject, signal, computed, afterNextRender, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { safeStorage } from '../utils/safe-storage';
import { NotificationEntry } from '../models/notification.model';
import { TimeGateService } from './time-gate.service';
import { UserDataProvider } from '../models/user-data-provider';
import { NotificationsSlice } from '../models/user-data-envelope';
import { SITE_CONFIG } from '../../config/site';

const COMPILED_URL = '/assets/data/notifications.compiled.json';
const STORAGE_KEY_LAST_SEEN = 'notifications.lastSeenAt';
const STORAGE_KEY_READ_IDS = 'notifications.readIds';

const READ_IDS_CAP = 100;
const VISIBLE_LIMIT = 5;
const LIVE_ANNOUNCEMENT_TIMEOUT_MS = 5000;

const I18N_KEY_LIVE_UPDATE = 'notifications.bell.ariaLiveUpdate';

@Injectable({ providedIn: 'root' })
export class NotificationService implements UserDataProvider<'notifications'> {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private timeGate = inject(TimeGateService);
  private site = inject(SITE_CONFIG);

  // === UserDataProvider contract ===
  // Registered in app.config.ts for export/import. Both keys are classified as
  // user-data in utils/storage-keys.ts, which is what keeps the read state
  // across deploys (the update check only drops clear-on-update caches).
  readonly sliceKey = 'notifications' as const;
  readonly storageKeys = [STORAGE_KEY_LAST_SEEN, STORAGE_KEY_READ_IDS] as const;

  private rawNotifications = signal<NotificationEntry[]>([]);
  private clientInjected = signal<NotificationEntry[]>([]);
  private lastSeenAtSig = signal<string | null>(null);
  // True for the whole first-ever browser session (no stored lastSeenAt when
  // hydrate() ran). Drives the welcome card; see hydrate() for why the seen
  // watermark is advanced immediately on the first visit.
  private firstVisitSig = signal(false);
  private readIdsSig = signal<Set<string>>(new Set());
  private hydratedSig = signal(false);
  private liveAnnouncementSig = signal('');
  private liveTimeoutId: ReturnType<typeof setTimeout> | null = null;

  // IDs that were unread at the moment the popover was opened. Stays frozen
  // for the duration of the open-popover session so the user keeps seeing
  // which entries were "new for this visit" — even though `lastSeenAt` has
  // already been advanced. Cleared on popover close.
  private popoverSnapshotSig = signal<Set<string>>(new Set());

  hydrated = this.hydratedSig.asReadonly();
  liveAnnouncement = this.liveAnnouncementSig.asReadonly();

  /**
   * All notifications (loaded + client-injected), sorted with pinned
   * entries first and publishedAt desc within each group. No cap, no
   * welcome notification — for the chronological /news page.
   *
   * Future-dated entries (publishedAt > now) are filtered out via
   * TimeGateService so a notification scheduled to coincide with a
   * learning-path release stays invisible until its date.
   */
  allNotifications = computed<NotificationEntry[]>(() => {
    const merged: NotificationEntry[] = [...this.rawNotifications(), ...this.clientInjected()].filter((n) =>
      this.timeGate.isPublishedAt(n.publishedAt),
    );
    merged.sort((a, b) => {
      const ap = a.pinned ? 1 : 0;
      const bp = b.pinned ? 1 : 0;
      if (ap !== bp) return bp - ap;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
    return merged;
  });

  /**
   * Full bell candidate list (loaded + client-injected + optional welcome),
   * sorted but NOT yet capped. Backs both `visibleNotifications` (slice 5)
   * and `unreadCount` (full count, so the badge can show "9+").
   *
   * Welcome shows up while either of these holds:
   * - `firstVisit` — true first-ever visit (session-scoped flag), OR
   * - it's inside the active popover snapshot — keeps it on screen while the
   *   user is reading the bell, so it doesn't pop out mid-frame the moment
   *   `markPopoverOpened()` advances `lastSeenAt`.
   * Once explicitly read (id in `readIdsSig`), welcome never returns.
   */
  private mergedSorted = computed<NotificationEntry[]>(() => {
    // Filter future-dated entries before adding the welcome card so the
    // bell badge count + visible slice both honor the publish gate. The
    // welcome card uses Date.now() as its publishedAt and therefore always
    // passes the filter (defensive: never gate the welcome).
    const merged: NotificationEntry[] = [...this.rawNotifications(), ...this.clientInjected()].filter((n) =>
      this.timeGate.isPublishedAt(n.publishedAt),
    );
    const wantsWelcome =
      this.hydratedSig() &&
      !this.readIdsSig().has('_welcome') &&
      (this.firstVisitSig() || this.popoverSnapshotSig().has('_welcome'));
    if (wantsWelcome) {
      merged.unshift(this.welcomeNotification());
    }
    merged.sort((a, b) => {
      const ap = a.pinned ? 1 : 0;
      const bp = b.pinned ? 1 : 0;
      if (ap !== bp) return bp - ap;
      return b.publishedAt.localeCompare(a.publishedAt);
    });
    return merged;
  });

  visibleNotifications = computed<NotificationEntry[]>(() => {
    return this.mergedSorted().slice(0, VISIBLE_LIMIT);
  });

  unreadCount = computed<number>(() => {
    if (!this.hydratedSig()) return 0;
    // Count over the full (uncapped) list so the badge can legitimately
    // show "9+" even though the popover renders only the top N entries.
    return this.mergedSorted().filter((n) => this.isUnread(n)).length;
  });

  constructor() {
    this.fetchNotifications();
    // afterNextRender is a no-op on the server, so this guard is mostly
    // belt-and-braces — the inner code is also browser-only.
    afterNextRender(() => this.hydrate());
  }

  /**
   * Read LocalStorage state into signals. Idempotent — repeat calls are
   * silently dropped. Public so unit tests can drive hydration without
   * the Angular render lifecycle.
   */
  hydrate(): void {
    if (this.hydratedSig()) return;
    if (!isPlatformBrowser(this.platformId)) {
      // Defensive: hydration is meaningless on the server. Mark as hydrated
      // anyway so SSR-side computed signals don't get stuck reporting 0
      // forever in non-browser test harnesses that call hydrate() manually.
      this.hydratedSig.set(true);
      return;
    }
    const storedLastSeen = safeStorage.get(STORAGE_KEY_LAST_SEEN);
    if (storedLastSeen === null) {
      // First-ever visit: whatever notifications ship with the app (the seed
      // entries, or a real backlog) are the site's history, not news for this
      // user — deliver them as already seen so the bell doesn't open with a
      // red badge on second one. Only entries published AFTER this moment
      // will badge. The welcome card still shows for this session via the
      // firstVisit flag (it is a greeting, not an unread item — see isUnread).
      this.firstVisitSig.set(true);
      const now = new Date().toISOString();
      this.lastSeenAtSig.set(now);
      safeStorage.set(STORAGE_KEY_LAST_SEEN, now);
    } else {
      this.lastSeenAtSig.set(storedLastSeen);
    }

    const rawIds = safeStorage.get(STORAGE_KEY_READ_IDS);
    if (rawIds) {
      try {
        const arr = JSON.parse(rawIds);
        if (Array.isArray(arr)) this.readIdsSig.set(new Set(arr));
      } catch {
        // Corrupted storage — fall back to empty set silently.
      }
    }
    this.subscribeStorageEvent();
    this.hydratedSig.set(true);
  }

  isUnread(n: NotificationEntry): boolean {
    if (!this.hydratedSig()) return false;
    if (this.readIdsSig().has(n.id)) return false;
    if (this.popoverSnapshotSig().has(n.id)) return true;
    // The welcome card is a greeting, not news: it must never light up the
    // badge (its publishedAt is "now", which would always be past the
    // first-visit watermark set in hydrate()).
    if (n.id === '_welcome') return false;
    const seen = this.lastSeenAtSig();
    if (seen === null) return true;
    return n.publishedAt > seen;
  }

  /**
   * Advance the "seen" watermark to now so every currently-published entry
   * counts as read for the bell badge — WITHOUT freezing a popover snapshot.
   * Used by the /news archive page: visiting the archive marks the backlog
   * seen, and that page keeps its own "new since visit" markers. (The bell uses
   * markPopoverOpened()/markPopoverClosed(), which additionally freeze the
   * unread set so the open popover stays visually consistent while reading.)
   */
  markAllSeen(): void {
    const now = new Date().toISOString();
    this.lastSeenAtSig.set(now);
    safeStorage.set(STORAGE_KEY_LAST_SEEN, now);
  }

  markPopoverOpened(): void {
    // Freeze the current unread set BEFORE advancing lastSeenAt — otherwise
    // isUnread() would already have flipped to false and the snapshot would
    // come out empty. We snapshot over the full merged list (not just the
    // visible 5) so the badge keeps reflecting the real unread count if the
    // user has more pending than the popover renders. markPopoverClosed()
    // drops the snapshot.
    const snapshot = new Set<string>();
    for (const n of this.mergedSorted()) {
      if (this.isUnread(n)) snapshot.add(n.id);
    }
    this.popoverSnapshotSig.set(snapshot);
    this.markAllSeen();
  }

  markPopoverClosed(): void {
    if (this.popoverSnapshotSig().size > 0) {
      this.popoverSnapshotSig.set(new Set());
    }
  }

  markRead(id: string): void {
    this.persistReadIds((prev) => {
      prev.add(id);
      return prev;
    });
  }

  /**
   * Push a notification that wasn't sourced from the JSON bundle (e.g. the
   * UpdateDetectionService announcing a new build). Triggers an aria-live
   * announcement for screenreaders.
   */
  injectClientNotification(n: NotificationEntry): void {
    this.clientInjected.update((list) => [...list, this.withReachableLinks(n)]);
    this.announce(I18N_KEY_LIVE_UPDATE);
  }

  /** Sets the aria-live region content and clears it after a short delay. */
  announce(message: string): void {
    this.liveAnnouncementSig.set(message);
    if (this.liveTimeoutId !== null) clearTimeout(this.liveTimeoutId);
    this.liveTimeoutId = setTimeout(() => {
      this.liveAnnouncementSig.set('');
      this.liveTimeoutId = null;
    }, LIVE_ANNOUNCEMENT_TIMEOUT_MS);
  }

  // === UserDataProvider implementation ===

  /** Snapshot read-state for the manual data export. Reads LocalStorage
   *  directly (browser-only) so it works regardless of hydration timing. */
  exportSlice(): NotificationsSlice | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const slice: NotificationsSlice = {};
    const lastSeen = safeStorage.get(STORAGE_KEY_LAST_SEEN);
    if (lastSeen) slice.lastSeenAt = lastSeen;
    const rawIds = safeStorage.get(STORAGE_KEY_READ_IDS);
    if (rawIds) {
      try {
        const arr = JSON.parse(rawIds);
        if (Array.isArray(arr) && arr.length > 0) {
          slice.readIds = arr.filter((id): id is string => typeof id === 'string');
        }
      } catch {
        // Corrupted storage — omit readIds from the export.
      }
    }
    return Object.keys(slice).length === 0 ? null : slice;
  }

  validateSlice(data: unknown): data is NotificationsSlice {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    const obj = data as Record<string, unknown>;
    if (obj['lastSeenAt'] !== undefined && typeof obj['lastSeenAt'] !== 'string') return false;
    if (obj['readIds'] !== undefined) {
      if (!Array.isArray(obj['readIds'])) return false;
      if (!obj['readIds'].every((id) => typeof id === 'string')) return false;
    }
    return true;
  }

  importSlice(data: NotificationsSlice): void {
    if (data.lastSeenAt) {
      this.lastSeenAtSig.set(data.lastSeenAt);
      safeStorage.set(STORAGE_KEY_LAST_SEEN, data.lastSeenAt);
    }
    if (data.readIds && data.readIds.length > 0) {
      const capped = data.readIds.slice(-READ_IDS_CAP);
      this.readIdsSig.set(new Set(capped));
      safeStorage.set(STORAGE_KEY_READ_IDS, JSON.stringify(capped));
    }
  }

  // ── Internal ──────────────────────────────────────────────────────────────

  private fetchNotifications(): void {
    this.http.get<NotificationEntry[]>(COMPILED_URL).subscribe({
      next: (list) => this.rawNotifications.set(Array.isArray(list) ? list.map((n) => this.withReachableLinks(n)) : []),
      error: () => this.rawNotifications.set([]),
    });
  }

  /**
   * Drop the links of a notice that lead into a feature site.json switches off
   * (they would only land on the start page); the notice itself stays.
   */
  private withReachableLinks(n: NotificationEntry): NotificationEntry {
    const on = (route: string) => this.site.isRouteOn(route);
    const linkOn = !n.link || on(n.link);
    const links = n.links?.filter((l) => on(l.route));
    if (linkOn && links?.length === n.links?.length) return n;
    const out: NotificationEntry = { ...n, links };
    if (!linkOn) {
      delete out.link;
      delete out.linkQueryParams;
      delete out.linkFragment;
      delete out.linkLabelKey;
    }
    return out;
  }

  private persistReadIds(mutate: (set: Set<string>) => Set<string>): void {
    let next = mutate(new Set(this.readIdsSig()));
    if (next.size > READ_IDS_CAP) {
      const tail = [...next].slice(-READ_IDS_CAP);
      next = new Set(tail);
    }
    this.readIdsSig.set(next);
    safeStorage.set(STORAGE_KEY_READ_IDS, JSON.stringify([...next]));
  }

  private subscribeStorageEvent(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY_LAST_SEEN) {
        this.lastSeenAtSig.set(event.newValue);
      } else if (event.key === STORAGE_KEY_READ_IDS) {
        try {
          const arr = JSON.parse(event.newValue ?? '[]');
          if (Array.isArray(arr)) this.readIdsSig.set(new Set(arr));
        } catch {
          // ignore corrupted cross-tab payload
        }
      }
    });
  }

  // Lazily built once and reused so re-runs of the visibleNotifications
  // computed don't generate a new publishedAt on every recompute (which
  // would shake up sort order and break the popover-snapshot tracking).
  private welcomeCache: NotificationEntry | null = null;
  private welcomeNotification(): NotificationEntry {
    if (!this.welcomeCache) {
      this.welcomeCache = {
        id: '_welcome',
        publishedAt: new Date().toISOString(),
        type: 'feature',
        titleKey: 'notifications.welcome.title',
        descriptionKey: 'notifications.welcome.description',
        priority: 'normal',
        pinned: true,
      };
    }
    return this.welcomeCache;
  }
}
