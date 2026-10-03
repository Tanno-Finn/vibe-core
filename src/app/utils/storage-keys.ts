/**
 * Storage-key registry — the one list of every browser-storage key the kit
 * writes, reads or migrates away from.
 *
 * Why this exists: two code paths have to know the whole set, and both used to
 * guess. The update check wiped `localStorage` on every deploy and restored only
 * what the `UserDataProvider`s declared, so theme, font, language, catalog
 * favorites and the feedback inbox disappeared with each release. "Delete all
 * my data" did the opposite mistake: it removed a hand-picked handful and left
 * the feedback inbox (name, e-mail, message) behind. Both now read from here.
 *
 * Classes:
 *  - `user-data`  — something the visitor made or earned (progress, favorites,
 *                   feedback messages, read state). Never touched by a deploy.
 *  - `preference` — a choice the visitor made (theme, font, language, consent,
 *                   toggles). Never touched by a deploy.
 *  - `cache`      — technical state the kit can rebuild. Only entries with
 *                   `clearOnUpdate: true` are dropped when a new version loads.
 *
 * `legacy: true` marks a key the current code no longer writes but may still
 * find in an older browser: a migration source or a retired feature. Legacy
 * user-data is left alone on deploy (its migration may not have run yet) but is
 * removed by "delete all my data".
 *
 * Adding a key: add an entry here in the same change. `storage-keys.spec.ts`
 * checks that every `UserDataProvider.storageKeys` entry is registered, and
 * `scripts/check-storage-keys.mjs` (part of `build:verify`) checks every
 * `safeStorage` / `localStorage` / `sessionStorage` call site in src/app. The
 * reset and the privacy page (`impressum.dsgvoLocalStorage*`) are only as
 * complete as this list.
 *
 * The kit uses `localStorage` only. `sessionStorage` has no kit keys today; the
 * `area` field exists so a future one is registered rather than wiped blindly.
 */

export type StorageKeyClass = 'user-data' | 'preference' | 'cache';

export interface StorageKeyEntry {
  /**
   * The exact storage key. Called `name`, not `key`: scripts/check-i18n-keys.mjs
   * reads any `…key: 'a.b'` literal as a translation key, and two of these
   * (`notifications.*`) look like one.
   */
  readonly name: string;
  readonly class: StorageKeyClass;
  /** Which storage area holds it. Every kit key is `local` today. */
  readonly area: 'local' | 'session';
  /** Source file that owns the key, relative to `src/app/`. */
  readonly owner: string;
  /** One line: what is stored and why. */
  readonly purpose: string;
  /** No longer written by current code; kept so reset can still delete it. */
  readonly legacy?: boolean;
  /** Only meaningful for `cache`: drop this key when a new app version is detected. */
  readonly clearOnUpdate?: boolean;
}

export const STORAGE_KEYS: readonly StorageKeyEntry[] = [
  // ── user-data ────────────────────────────────────────────────────────────
  {
    name: 'user_progress',
    class: 'user-data',
    area: 'local',
    owner: 'services/user-progress.service.ts',
    purpose:
      'Learning progress: completed quizzes, checkpoints and learning paths. Written only with consent (cookiePreferences.progress).',
  },
  {
    name: 'notifications.lastSeenAt',
    class: 'user-data',
    area: 'local',
    owner: 'services/notification.service.ts',
    purpose: 'When the news feed was last opened, so only newer items count as unread.',
  },
  {
    name: 'notifications.readIds',
    class: 'user-data',
    area: 'local',
    owner: 'services/notification.service.ts',
    purpose: 'IDs of news items the visitor marked as read (capped).',
  },
  {
    name: 'vibecore.feedback.inbox.v1',
    class: 'user-data',
    area: 'local',
    owner: 'services/feedback-inbox.service.ts',
    purpose: 'Messages sent from the /feedback page, with optional name and e-mail (max. 50).',
  },
  {
    name: 'catalog-favorites',
    class: 'user-data',
    area: 'local',
    owner: 'pages/catalog/catalog-state.service.ts',
    purpose: 'Catalog entries the visitor starred.',
  },
  {
    name: 'catalog-compare',
    class: 'user-data',
    area: 'local',
    owner: 'pages/catalog/catalog-state.service.ts',
    purpose: 'Catalog entries on the comparison list.',
  },
  {
    name: 'learning_platform_gamification',
    class: 'user-data',
    area: 'local',
    owner: 'services/user-progress.service.ts',
    purpose: 'Progress format v1; deleted on first load.',
    legacy: true,
  },
  {
    name: 'user_progress_v2',
    class: 'user-data',
    area: 'local',
    owner: 'services/user-progress.service.ts',
    purpose: 'Progress format v2; migrated into user_progress on first load.',
    legacy: true,
  },
  {
    name: 'ai-tools-favorites',
    class: 'user-data',
    area: 'local',
    owner: 'pages/catalog/catalog-state.service.ts',
    purpose: 'Old tools favorites; merged into catalog-favorites when the catalog opens.',
    legacy: true,
  },
  {
    name: 'ai-resources-favorites',
    class: 'user-data',
    area: 'local',
    owner: 'pages/catalog/catalog-state.service.ts',
    purpose: 'Old resources favorites; merged into catalog-favorites when the catalog opens.',
    legacy: true,
  },
  {
    name: 'ai-tools-compare',
    class: 'user-data',
    area: 'local',
    owner: 'pages/catalog/catalog-state.service.ts',
    purpose: 'Old comparison list; merged into catalog-compare when the catalog opens.',
    legacy: true,
  },

  // ── preference ───────────────────────────────────────────────────────────
  {
    name: 'cookiePreferences',
    class: 'preference',
    area: 'local',
    owner: 'services/privacy-consent.service.ts',
    purpose:
      'The consent decision (essential / progress / analytics). progress: true is the only thing that lets learning progress be saved.',
  },
  {
    name: 'disableProgressTracking',
    class: 'preference',
    area: 'local',
    owner: 'services/privacy-consent.service.ts',
    purpose: 'Retired progress opt-out flag; folded into cookiePreferences.progress and deleted on first load.',
    legacy: true,
  },
  {
    name: 'analyticsConsent',
    class: 'preference',
    area: 'local',
    owner: 'services/privacy-consent.service.ts',
    purpose: 'Analytics consent, "true" or "false".',
  },
  {
    name: 'theme',
    class: 'preference',
    area: 'local',
    owner: 'services/theme.service.ts',
    purpose: 'Chosen UI style (also read pre-paint by index.html).',
  },
  {
    name: 'mode',
    class: 'preference',
    area: 'local',
    owner: 'services/theme.service.ts',
    purpose: 'Light, dark or system (also read pre-paint by index.html).',
  },
  {
    name: 'themeColor',
    class: 'preference',
    area: 'local',
    owner: 'services/theme.service.ts',
    purpose: 'Chosen accent color, including high contrast.',
  },
  {
    name: 'preferred-font-v1',
    class: 'preference',
    area: 'local',
    owner: 'services/font.service.ts',
    purpose: 'Chosen reading font.',
  },
  {
    name: 'preferred-language-v2',
    class: 'preference',
    area: 'local',
    owner: 'services/translation.service.ts',
    purpose: 'Chosen display language (also read by index.html).',
  },
  {
    name: 'easy-language-mode',
    class: 'preference',
    area: 'local',
    owner: 'services/translation.service.ts',
    purpose: 'Present when the Easy-Language variant is active.',
  },
  {
    name: 'glossaryHighlightingEnabled',
    class: 'preference',
    area: 'local',
    owner: 'services/highlighting.service.ts',
    purpose: 'Whether glossary terms are highlighted in texts.',
  },
  {
    name: 'cursorGlowAfterburn',
    class: 'preference',
    area: 'local',
    owner: 'services/playground-settings.service.ts',
    purpose: 'Playground: cursor trail on/off.',
  },
  // The Game-of-Life background and the snake game were never built; their
  // switches were removed. Kept so "delete all my data" still removes them.
  {
    name: 'gameOfLifeBackground',
    class: 'preference',
    area: 'local',
    owner: 'services/playground-settings.service.ts',
    purpose: 'Retired switch for a Game-of-Life background that never existed; only ever deleted.',
    legacy: true,
  },
  {
    name: 'snakeGame',
    class: 'preference',
    area: 'local',
    owner: 'services/playground-settings.service.ts',
    purpose: 'Retired switch for a snake game that never existed; only ever deleted.',
    legacy: true,
  },
  {
    name: 'snakeSpeed',
    class: 'preference',
    area: 'local',
    owner: 'services/playground-settings.service.ts',
    purpose: 'Retired snake-game setting; only ever deleted.',
    legacy: true,
  },
  {
    name: 'snakeAutoMode',
    class: 'preference',
    area: 'local',
    owner: 'services/playground-settings.service.ts',
    purpose: 'Retired snake-game setting; only ever deleted.',
    legacy: true,
  },
  {
    name: 'snakePlayerCount',
    class: 'preference',
    area: 'local',
    owner: 'services/playground-settings.service.ts',
    purpose: 'Retired snake-game setting; only ever deleted.',
    legacy: true,
  },
  {
    name: 'dev-simulate-prod',
    class: 'preference',
    area: 'local',
    owner: 'services/dev-mode.service.ts',
    purpose: 'Developer toggle: preview the production view in a dev build.',
  },
  {
    name: 'aiToolsDisclaimerDismissed',
    class: 'preference',
    area: 'local',
    owner: 'pages/user-settings/user-settings.component.ts',
    purpose: 'Retired AI-tools disclaimer; only ever deleted.',
    legacy: true,
  },

  // ── cache ────────────────────────────────────────────────────────────────
  {
    name: 'app_version',
    class: 'cache',
    area: 'local',
    owner: 'services/update-detection.service.ts',
    purpose: 'Build version last seen, to notice a deploy. Rewritten, not cleared, on update.',
  },
  {
    name: 'boot-tokens',
    class: 'cache',
    area: 'local',
    owner: 'services/theme.service.ts',
    // Not cleared on update: every applyTheme() at boot rewrites it from the
    // running bundle, so by the time a version change is noticed it is already
    // current, and deleting it would only buy one flash of unstyled colors.
    purpose: 'Color tokens of the chosen theme, so index.html can paint without a flash.',
  },
  {
    name: 'easyLanguageAnalytics',
    class: 'cache',
    area: 'local',
    owner: 'services/easy-language.service.ts',
    purpose: 'Retired local usage log (never read, no longer written).',
    legacy: true,
    clearOnUpdate: true,
  },
  {
    name: 'easyLanguagePreferences',
    class: 'cache',
    area: 'local',
    owner: 'services/easy-language.service.ts',
    // Was a preference; nothing has read it since the unused preferences API
    // was removed, so it is leftover data, not a choice worth keeping.
    purpose: 'Retired Easy-Language display options (never read, no longer written).',
    legacy: true,
    clearOnUpdate: true,
  },
];

/**
 * Keys that cannot be listed one by one. `CheckpointComponent` used to store
 * each guide's ticks under its own `storageKey` input (e.g.
 * `prompting-guide-checkpoints`); it migrates them into `user_progress` and
 * deletes them on first render, but a browser that never opened that page still
 * holds one. Matched by name so "delete all my data" catches them too.
 */
export const LEGACY_KEY_PATTERNS: readonly { readonly pattern: RegExp; readonly purpose: string }[] = [
  {
    pattern: /-checkpoints?$/,
    purpose: 'Per-guide checkpoint ticks from before user_progress; migrated on first render.',
  },
];

/** Minimal surface of `Storage`, so the helpers below can be tested with a fake. */
export interface KeyValueStore {
  readonly length: number;
  key(index: number): string | null;
  removeItem(key: string): void;
}

function localStore(): KeyValueStore | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

function keysOf(store: KeyValueStore): string[] {
  const keys: string[] = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k !== null) keys.push(k);
  }
  return keys;
}

function removeEach(store: KeyValueStore, keys: Iterable<string>): string[] {
  const removed: string[] = [];
  for (const key of keys) {
    try {
      store.removeItem(key);
      removed.push(key);
    } catch {
      // Blocked storage — nothing we can do; the rest may still succeed.
    }
  }
  return removed;
}

/** Every registered key of one class. */
export function storageKeysOf(cls: StorageKeyClass): string[] {
  return STORAGE_KEYS.filter((e) => e.class === cls).map((e) => e.name);
}

/** Registered keys that a version change may delete. Never user-data or a preference. */
export function keysClearedOnUpdate(): string[] {
  return STORAGE_KEYS.filter((e) => e.class === 'cache' && e.clearOnUpdate === true).map((e) => e.name);
}

/**
 * Delete the cache keys a new build invalidates. Leaves everything else alone —
 * this replaced a `localStorage.clear()` that took every preference with it.
 * Returns the keys it attempted to remove that were present.
 */
export function clearUpdateCaches(store: KeyValueStore | null = localStore()): string[] {
  if (!store) return [];
  const present = new Set(keysOf(store));
  return removeEach(
    store,
    keysClearedOnUpdate().filter((k) => present.has(k)),
  );
}

/**
 * Delete the older homes of learning progress: the retired `user_progress`
 * formats and the per-guide checkpoint keys (`LEGACY_KEY_PATTERNS`). Used when
 * a visitor declines progress storage, so a "no" clears what an older version
 * stored too, not only the current record. Returns the keys that were removed.
 */
export function removeLegacyProgressKeys(store: KeyValueStore | null = localStore()): string[] {
  if (!store) return [];
  const legacyProgress = new Set(
    STORAGE_KEYS.filter((e) => e.legacy && e.owner === 'services/user-progress.service.ts').map((e) => e.name),
  );
  const targets = keysOf(store).filter(
    (k) => legacyProgress.has(k) || LEGACY_KEY_PATTERNS.some(({ pattern }) => pattern.test(k)),
  );
  return removeEach(store, targets);
}

/**
 * Delete every key the kit owns in this browser: all registered keys plus
 * anything matching a legacy pattern. Keys the kit does not know (another app
 * on the same origin during development, a browser extension) are left alone.
 * Returns the keys that were present and removed.
 */
export function removeAllKitStorage(store: KeyValueStore | null = localStore()): string[] {
  if (!store) return [];
  const registered = new Set(STORAGE_KEYS.filter((e) => e.area === 'local').map((e) => e.name));
  const targets = keysOf(store).filter(
    (k) => registered.has(k) || LEGACY_KEY_PATTERNS.some(({ pattern }) => pattern.test(k)),
  );
  return removeEach(store, targets);
}
