/**
 * FeedbackInboxService — the store behind the /feedback page.
 *
 * The kit ships no feedback backend: `FeedbackService` posts to
 * `environment.feedback.endpoint`, which is empty by default (see that file and
 * docs/how-to/add-a-backend.md). This service is the standing-in-for-a-server
 * half of the /feedback page — it validates a submission, waits the way a
 * network round-trip waits, and writes the result to `localStorage`. Nothing
 * ever leaves the browser, which is exactly what the page tells the visitor.
 *
 * Swapping in a real endpoint later means replacing `submit()` with an HTTP
 * call; the page holds no assumption beyond "this returns a Promise that either
 * resolves with the stored entry or rejects with a FeedbackSubmitError".
 *
 * Privacy: the payload can contain an e-mail address, so PRIV-002 (collect the
 * least) and PRIV-005 (offer a way to delete) apply — hence the entry cap and
 * `clear()`. SSR-safe: every `localStorage` access is guarded.
 */
import { Injectable, InjectionToken, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** The four categories the page offers. Deliberately narrower than the dialog's six. */
export type FeedbackPageCategory = 'praise' | 'bug' | 'feature' | 'general';

export const FEEDBACK_PAGE_CATEGORIES: readonly FeedbackPageCategory[] = ['praise', 'bug', 'feature', 'general'];

/** What the form hands over. Name and e-mail may be empty strings. */
export interface FeedbackDraft {
  name: string;
  email: string;
  category: FeedbackPageCategory;
  message: string;
  consent: boolean;
}

/** What the store keeps. */
export interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  category: FeedbackPageCategory;
  message: string;
  /** ISO-8601, set at submit time. */
  submittedAt: string;
  /** Language the page was in when the message was written — helps whoever reads it. */
  language: string;
}

/**
 * Field-level validation failures. The values double as i18n key suffixes under
 * `feedback.page.error.*`, so a new rule needs a key and nothing else.
 */
export type FeedbackFieldError = 'emailInvalid' | 'messageTooShort' | 'messageTooLong' | 'consentRequired';

/** Why a submit did not go through. `storage` is a genuine write failure, not a simulation. */
export type FeedbackSubmitFailure = 'validation' | 'storage';

export class FeedbackSubmitError extends Error {
  constructor(
    readonly reason: FeedbackSubmitFailure,
    readonly fieldErrors: readonly FeedbackFieldError[] = [],
  ) {
    super(`feedback submit failed: ${reason}`);
    this.name = 'FeedbackSubmitError';
  }
}

export const FEEDBACK_MESSAGE_MIN_LENGTH = 20;
export const FEEDBACK_MESSAGE_MAX_LENGTH = 2000;
export const FEEDBACK_NAME_MAX_LENGTH = 80;

/** Same shape as the one in FeedbackService — one obviously-an-address check, no RFC theater. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STORAGE_KEY = 'vibecore.feedback.inbox.v1';

/**
 * Newest entries are kept, older ones fall off the end. A browser-local inbox
 * that grows without bound is a quota failure waiting to happen, and holding a
 * hundred old messages serves nobody (PRIV-002).
 */
const MAX_ENTRIES = 50;

/**
 * How long a submit pretends to take, in milliseconds. Injectable so tests can
 * set it to 0 instead of sleeping — see feedback-inbox.service.spec.ts.
 */
export const FEEDBACK_SUBMIT_LATENCY_MS = new InjectionToken<number>('FEEDBACK_SUBMIT_LATENCY_MS', {
  providedIn: 'root',
  factory: () => 900,
});

@Injectable({ providedIn: 'root' })
export class FeedbackInboxService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly latencyMs = inject(FEEDBACK_SUBMIT_LATENCY_MS);

  /** Starts empty on purpose — see loadStored(). */
  private readonly stored = signal<readonly FeedbackEntry[]>([]);

  /** Language stamp for new entries; the page keeps it in step with the active language. */
  private language = 'en';

  /** Newest first. Empty until `loadStored()` has run. */
  readonly entries = this.stored.asReadonly();
  readonly entryCount = computed(() => this.stored().length);

  /**
   * Read the persisted entries into the signal.
   *
   * NOT called from the constructor: the page is prerendered, so the server
   * renders an empty list. Filling the signal during client bootstrap would
   * make the first client render disagree with that markup and hydration would
   * throw the DOM away. The page calls this from `afterNextRender()` instead,
   * after hydration has matched.
   */
  loadStored(): void {
    if (!this.isBrowser) return;
    this.stored.set(this.readFromStorage());
  }

  /**
   * Validate a draft. Returns the failing rules, empty array = good to send.
   * Pure — the page calls it on every keystroke to drive its inline messages.
   */
  validate(draft: FeedbackDraft): readonly FeedbackFieldError[] {
    const errors: FeedbackFieldError[] = [];
    const message = draft.message.trim();
    const email = draft.email.trim();

    if (message.length < FEEDBACK_MESSAGE_MIN_LENGTH) errors.push('messageTooShort');
    else if (message.length > FEEDBACK_MESSAGE_MAX_LENGTH) errors.push('messageTooLong');

    if (email.length > 0 && !EMAIL_PATTERN.test(email)) errors.push('emailInvalid');

    if (!draft.consent) errors.push('consentRequired');

    return errors;
  }

  /**
   * Send a draft. Rejects with a FeedbackSubmitError on invalid input or on a
   * storage write that genuinely failed (private mode, quota, disabled storage).
   */
  async submit(draft: FeedbackDraft): Promise<FeedbackEntry> {
    const fieldErrors = this.validate(draft);
    if (fieldErrors.length > 0) {
      throw new FeedbackSubmitError('validation', fieldErrors);
    }

    const entry: FeedbackEntry = {
      id: this.newId(),
      name: draft.name.trim().slice(0, FEEDBACK_NAME_MAX_LENGTH),
      email: draft.email.trim(),
      category: draft.category,
      message: draft.message.trim(),
      submittedAt: new Date().toISOString(),
      language: this.language,
    };

    await this.pause(this.latencyMs);

    const next = [entry, ...this.readFromStorage()].slice(0, MAX_ENTRIES);
    if (!this.writeToStorage(next)) {
      throw new FeedbackSubmitError('storage');
    }
    this.stored.set(next);

    return entry;
  }

  /** Delete every stored message (PRIV-005). Returns false if the write failed. */
  clear(): boolean {
    this.stored.set([]);
    if (!this.isBrowser) return true;
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  /** Called by the page so a stored entry records the language it was written in. */
  useLanguage(language: string): void {
    this.language = language;
  }

  // ── internals ──────────────────────────────────────────────────────────────

  private pause(ms: number): Promise<void> {
    if (ms <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private newId(): string {
    // crypto.randomUUID is not universally available on older Safari; the id is
    // a list key, not a secret, so a timestamped counter is enough.
    return `fb-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
  }

  private readFromStorage(): FeedbackEntry[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isFeedbackEntry).map(normalise) : [];
    } catch {
      return [];
    }
  }

  private writeToStorage(entries: readonly FeedbackEntry[]): boolean {
    if (!this.isBrowser) return true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Anything already in storage came from an older build (or from someone editing
 * devtools) — keep what still carries an identity, drop the rest.
 */
function isFeedbackEntry(value: unknown): value is FeedbackEntry {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e['id'] === 'string' &&
    typeof e['message'] === 'string' &&
    typeof e['submittedAt'] === 'string' &&
    FEEDBACK_PAGE_CATEGORIES.includes(e['category'] as FeedbackPageCategory)
  );
}

/** Fill the optional fields a stored entry from an older shape may be missing. */
function normalise(entry: FeedbackEntry): FeedbackEntry {
  return {
    ...entry,
    name: typeof entry.name === 'string' ? entry.name : '',
    email: typeof entry.email === 'string' ? entry.email : '',
    language: typeof entry.language === 'string' ? entry.language : '',
  };
}
