/**
 * Notification entry — V2 schema per
 * an internal design note.
 *
 * Source files live one-entry-per-file in
 *   src/assets/data/notifications/<id>.json
 * The build step `scripts/sync-notifications.mjs` aggregates them into
 *   src/assets/data/notifications.compiled.json
 * which the NotificationService fetches at runtime. Entries older than
 * 6 months are auto-archived into `_archive.json`.
 */

export type NotificationType =
  | 'launch'
  | 'feature'
  | 'release'
  | 'bugfix'
  | 'article'
  | 'blog'
  | 'demo'
  | 'glossary'
  | 'timeline'
  | 'tool'
  | 'language'
  | 'quality'
  | 'maintenance';

export type NotificationPriority = 'high' | 'normal' | 'low';

/**
 * Secondary link rendered as a chip below the entry's main CTA. Useful for
 * aggregated notifications like "5 new glossary entries" — one card lists
 * all five chip-links instead of spawning five separate notifications.
 */
export interface NotificationLink {
  /** Internal route (e.g. "/glossary/transformer"). */
  route: string;
  /** i18n key OR plain text — NewsComponent falls back to translate(). */
  labelKey: string;
  /** Optional PrimeIcon class override. Falls back to the entry's type-icon. */
  icon?: string;
}

export interface NotificationEntry {
  /** Stable identifier, format `YYYY-MM-DD-slug`. Used for read-state tracking. */
  id: string;
  /** ISO 8601 timestamp (e.g. "2026-05-04T08:00:00Z"). */
  publishedAt: string;
  /** Determines the default icon when the optional `icon` field is absent. */
  type: NotificationType;
  /** i18n key for the title (module `notifications`). */
  titleKey: string;
  /** i18n key for the description (module `notifications`). */
  descriptionKey: string;
  /** Optional internal route — renders the primary CTA button. */
  link?: string;
  /** Optional query params passed alongside `link` (Angular router). */
  linkQueryParams?: Record<string, string>;
  /** Optional URL fragment passed alongside `link` — relies on
   *  `withInMemoryScrolling({ anchorScrolling: 'enabled' })` to scroll to
   *  the matching `[id]` on the target route. */
  linkFragment?: string;
  /** Optional i18n key for the CTA label; falls back to `notifications.cta.open`. */
  linkLabelKey?: string;
  /** Optional secondary chip-links. Rendered below the primary CTA. */
  links?: NotificationLink[];
  /** Optional PrimeIcon class override (e.g. `pi pi-flag`). */
  icon?: string;
  /** Visibility hint for the bell. Default: "normal". */
  priority?: NotificationPriority;
  /** Pinned entries stay at the top of the bell list, regardless of date. */
  pinned?: boolean;
  /** Aggregation key — entries sharing one key may be collapsed in the bell. */
  groupKey?: string | null;
  /** Schema version for forward-compat. Increment when fields change. */
  schemaVersion?: number;
}
