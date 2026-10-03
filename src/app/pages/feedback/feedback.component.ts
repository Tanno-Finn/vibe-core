/**
 * Feedback page (/feedback, page id `fdbk`).
 *
 * The long-form sibling of the feedback FAB dialog: a routed page with room to
 * write, reachable from navigation and by URL. Shaped in
 * specs/2026-08-20-feedback-page/shape.md.
 *
 * There is no backend. `FeedbackInboxService` stands in for one — it waits the
 * way a round-trip waits and then writes to localStorage, so idle → sending →
 * sent/error is a real state machine rather than a decoration. The page says
 * plainly where the message ends up (PRIV-004) and offers a delete-everything
 * action (PRIV-005).
 *
 * SSR-safe: the page is prerendered (TIER_1_ROUTES), so nothing touches
 * localStorage during construction — the stored list is pulled in from
 * `afterNextRender`, once hydration has matched the server markup.
 */
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from '@openng/optimus-ui/button';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { MessageModule } from '@openng/optimus-ui/message';
import { SelectModule } from '@openng/optimus-ui/select';
import { TextareaModule } from '@openng/optimus-ui/textarea';

import { ToastService } from '../../services/toast.service';
import { TranslationService } from '../../services/translation.service';
import {
  FEEDBACK_MESSAGE_MAX_LENGTH,
  FEEDBACK_NAME_MAX_LENGTH,
  FEEDBACK_PAGE_CATEGORIES,
  FeedbackDraft,
  FeedbackFieldError,
  FeedbackInboxService,
  FeedbackPageCategory,
} from '../../services/feedback-inbox.service';
import { ArticleComponent } from '../../components/shared/article.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { StandardContainerComponent } from '../../components/shared/standard-container.component';
import { dateLocaleFor } from '../../utils/date-locale';

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

/** Which inline errors are visible. A field speaks up once it has been left, or on submit. */
type TouchableField = 'email' | 'message' | 'consent';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    MessageModule,
    SelectModule,
    TextareaModule,
    ArticleComponent,
    PageHeaderComponent,
    StandardContainerComponent,
  ],
  template: `
    <app-article width="page" [transparentBackground]="true">
      <app-page-header titleKey="feedback.page.title" subtitleKey="feedback.page.subtitle"></app-page-header>

      <!-- Status is announced as text, not only as a color or a spinner. -->
      <p class="sr-only" role="status" aria-live="polite">{{ statusAnnouncement() }}</p>

      <app-standard-container
        id="feedback-form"
        [config]="{
          titleKey: 'feedback.page.formTitle',
          type: 'primary',
          elevation: 'md',
          icon: 'pi pi-comment',
          headingLevel: 2,
        }"
      >
        @if (status() === 'sent') {
          <div class="fb-success">
            <h3 class="fb-success__title" tabindex="-1" #successTitle>
              <i class="pi pi-check-circle" aria-hidden="true"></i>
              {{ t('feedback.page.successTitle') }}
            </h3>
            <p class="fb-success__text">{{ t('feedback.page.successText') }}</p>
            <button pButton type="button" [attr.aria-label]="t('feedback.page.successAgain')" (click)="writeAnother()">
              <i class="pi pi-pencil" pButtonIcon aria-hidden="true"></i
              ><span pButtonLabel>{{ t('feedback.page.successAgain') }}</span>
            </button>
          </div>
        } @else {
          <form class="fb-form" (ngSubmit)="submit()" novalidate>
            <div class="fb-field">
              <label for="fb-name">{{ t('feedback.page.nameLabel') }}</label>
              <input
                pInputText
                #nameInput
                id="fb-name"
                type="text"
                name="name"
                autocomplete="name"
                [maxlength]="maxNameLength"
                [placeholder]="t('feedback.page.namePlaceholder')"
                [ngModel]="name()"
                (ngModelChange)="name.set($event)"
              />
            </div>

            <div class="fb-field">
              <label for="fb-email">{{ t('feedback.page.emailLabel') }}</label>
              <input
                pInputText
                id="fb-email"
                type="email"
                name="email"
                autocomplete="email"
                inputmode="email"
                [placeholder]="t('feedback.emailPlaceholder')"
                [invalid]="shows('emailInvalid')"
                [attr.aria-invalid]="shows('emailInvalid')"
                [attr.aria-describedby]="shows('emailInvalid') ? 'fb-email-error' : null"
                [ngModel]="email()"
                (ngModelChange)="email.set($event)"
                (blur)="touch('email')"
              />
              @if (shows('emailInvalid')) {
                <small class="fb-error" id="fb-email-error">
                  <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                  {{ t('feedback.page.error.emailInvalid') }}
                </small>
              }
            </div>

            <div class="fb-field">
              <!-- Two things this control cannot do for itself: its focusable element
                   is a span[role=combobox], which no label[for] can bind to (caption
                   plus ariaLabelledBy instead), and its overlay would be clipped by
                   app-standard-container's overflow:hidden content area without
                   appendTo="body". -->
              <span class="fb-label" id="fb-category-label">{{ t('feedback.category.label') }}</span>
              <p-select
                inputId="fb-category"
                [ariaLabelledBy]="'fb-category-label'"
                [options]="categoryOptions()"
                optionLabel="label"
                optionValue="value"
                styleClass="fb-select"
                appendTo="body"
                [ngModel]="category()"
                (ngModelChange)="category.set($event)"
                name="category"
              />
            </div>

            <div class="fb-field">
              <label for="fb-message">
                {{ t('feedback.page.messageLabel') }}
                <span class="fb-required">{{ t('feedback.page.requiredMark') }}</span>
              </label>
              <textarea
                pTextarea
                id="fb-message"
                name="message"
                rows="7"
                [placeholder]="t('feedback.messagePlaceholder')"
                [invalid]="shows('messageTooShort') || shows('messageTooLong')"
                [attr.aria-invalid]="shows('messageTooShort') || shows('messageTooLong')"
                [attr.aria-describedby]="messageDescribedBy()"
                [ngModel]="message()"
                (ngModelChange)="message.set($event)"
                (blur)="touch('message')"
              ></textarea>
              <!-- No maxlength attribute on purpose: a hard cap swallows keystrokes
                   without saying so, and it would make the "too long" rule unreachable
                   and its four translations dead. The counter and the rule both measure
                   the trimmed message, so the two never disagree.
                   NOTE: no backticks in this comment - it sits inside a template literal. -->
              <div class="fb-meta">
                <small id="fb-message-hint">{{ t('feedback.page.messageHint') }}</small>
                <small class="fb-counter" [class.fb-counter--over]="messageLength() > maxMessageLength">
                  <span class="sr-only">{{ t('feedback.page.charCounterLabel') }}:</span>
                  {{ messageLength() }} / {{ maxMessageLength }}
                </small>
              </div>
              @if (shows('messageTooShort') || shows('messageTooLong')) {
                <small class="fb-error" id="fb-message-error">
                  <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                  {{
                    shows('messageTooShort')
                      ? t('feedback.page.error.messageTooShort')
                      : t('feedback.page.error.messageTooLong')
                  }}
                </small>
              }
            </div>

            <div class="fb-consent">
              <p-checkbox
                inputId="fb-consent"
                [binary]="true"
                name="consent"
                [invalid]="shows('consentRequired')"
                [pt]="consentPt()"
                [ngModel]="consent()"
                (ngModelChange)="onConsentChange($event)"
              />
              <label for="fb-consent">
                {{ t('feedback.page.consentLabel') }}
                <span class="fb-required">{{ t('feedback.page.requiredMark') }}</span>
              </label>
            </div>
            @if (shows('consentRequired')) {
              <small class="fb-error" id="fb-consent-error">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                {{ t('feedback.page.error.consentRequired') }}
              </small>
            }

            @if (status() === 'error') {
              <p-message severity="error" [closable]="false">
                <span class="fb-message-body">
                  <strong>{{ t('feedback.page.errorTitle') }}</strong>
                  {{ t('feedback.page.error.storage') }}
                </span>
              </p-message>
            }

            <div class="fb-actions">
              <button pButton type="submit" [attr.aria-label]="submitLabel()" [disabled]="status() === 'sending'">
                <i
                  [class]="status() === 'sending' ? 'pi pi-spin pi-spinner' : 'pi pi-send'"
                  pButtonIcon
                  aria-hidden="true"
                ></i
                ><span pButtonLabel>{{ submitLabel() }}</span>
              </button>
            </div>

            <p class="fb-privacy">
              <strong>{{ t('feedback.page.privacyTitle') }}</strong>
              {{ t('feedback.page.privacyText') }}
            </p>
          </form>
        }
      </app-standard-container>

      <app-standard-container
        id="feedback-inbox"
        [config]="{
          titleKey: 'feedback.page.inboxTitle',
          type: 'info',
          elevation: 'md',
          icon: 'pi pi-inbox',
          headingLevel: 2,
        }"
      >
        <p class="fb-inbox__note">{{ t('feedback.page.inboxNote') }}</p>

        @if (entries().length === 0) {
          <p class="fb-inbox__empty" tabindex="-1" #inboxEmpty>{{ t('feedback.page.inboxEmpty') }}</p>
        } @else {
          <ul class="fb-inbox__list">
            @for (entry of entries(); track entry.id) {
              <li class="fb-entry">
                <div class="fb-entry__head">
                  <span class="fb-entry__category">{{ categoryLabel(entry.category) }}</span>
                  <span class="fb-entry__date">
                    <span class="sr-only">{{ t('feedback.page.entryDateLabel') }}:</span>
                    {{ formatDate(entry.submittedAt) }}
                  </span>
                </div>
                <p class="fb-entry__from">{{ entry.name || t('feedback.page.anonymous') }}</p>
                <p class="fb-entry__message">{{ entry.message }}</p>
              </li>
            }
          </ul>

          <div class="fb-inbox__actions">
            <!-- Two-step instead of a native confirm(): a blocking browser dialog is
                 not part of the page and cannot be styled, translated or focused. -->
            @if (confirmClear()) {
              <button
                pButton
                #clearConfirmButton
                type="button"
                severity="danger"
                [attr.aria-label]="t('feedback.page.clearConfirmLabel')"
                (click)="clearAll()"
              >
                <i class="pi pi-trash" pButtonIcon aria-hidden="true"></i
                ><span pButtonLabel>{{ t('feedback.page.clearConfirmLabel') }}</span>
              </button>
              <button
                pButton
                type="button"
                severity="secondary"
                [outlined]="true"
                [attr.aria-label]="t('feedback.page.clearCancel')"
                (click)="cancelClear()"
              >
                <span pButtonLabel>{{ t('feedback.page.clearCancel') }}</span>
              </button>
            } @else {
              <button
                pButton
                #clearButton
                type="button"
                severity="danger"
                [outlined]="true"
                [attr.aria-label]="t('feedback.page.clear')"
                (click)="askToClear()"
              >
                <i class="pi pi-trash" pButtonIcon aria-hidden="true"></i
                ><span pButtonLabel>{{ t('feedback.page.clear') }}</span>
              </button>
            }
          </div>
        }
      </app-standard-container>
    </app-article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .fb-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }

      .fb-field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .fb-field > label,
      .fb-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .fb-field input,
      .fb-field textarea,
      .fb-select {
        width: 100%;
      }

      .fb-field textarea {
        resize: vertical;
        min-height: 160px;
        max-height: 480px;
        line-height: 1.6;
        font-family: inherit;
      }

      /* WCAG 2.4.7, buttons only. Inputs, textarea and the checkbox box get their ring
       from the kit-wide rules in styles.scss (Aura's formField focusRing is width 0 —
       measured there); a page-local checkbox rule on the host would draw a SECOND ring
       around the kit's box ring. Buttons do have an Aura ring, but a 1px one — the kit
       standard is 2px --primary-color-fg at 2px offset, so upgrade them here. */
      .fb-actions button:focus-visible,
      .fb-inbox__actions button:focus-visible,
      .fb-success button:focus-visible {
        outline: 2px solid var(--primary-color-fg, #f59e0b);
        outline-offset: 2px;
      }

      .fb-consent p-checkbox {
        display: inline-flex;
        border-radius: 4px;
      }

      .fb-required {
        margin-left: var(--space-2);
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .fb-meta {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--space-2);
        color: var(--text-color-secondary);
        font-size: 0.8rem;
      }

      .fb-counter {
        font-variant-numeric: tabular-nums;
      }

      /* Over the limit: the inline error below says so in words — this is the second
       carrier, not the only one. */
      .fb-counter--over {
        color: var(--red-600);
        font-weight: 600;
      }

      /* Errors carry an icon and a sentence, never color alone (A11Y-006). */
      .fb-error {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--red-600);
      }

      .fb-error i {
        margin-top: 0.15em;
        font-size: 0.85rem;
      }

      .fb-consent {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .fb-consent label {
        font-size: 0.95rem;
        line-height: 1.6;
        color: var(--text-color);
        cursor: pointer;
      }

      .fb-message-body {
        display: block;
        line-height: 1.6;
      }

      .fb-message-body strong {
        display: block;
      }

      .fb-actions {
        display: flex;
        justify-content: flex-end;
      }

      .fb-privacy {
        margin: 0;
        padding: var(--space-4);
        background: var(--surface-50);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius-lg, 12px);
        font-size: 0.85rem;
        line-height: 1.6;
        color: var(--text-color-secondary);
      }

      .fb-privacy strong {
        display: block;
        margin-bottom: var(--space-1);
        color: var(--text-color);
      }

      /* Success panel */
      .fb-success {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-3);
      }

      .fb-success__title {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-color);
      }

      .fb-success__title:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .fb-success__text {
        margin: 0;
        color: var(--text-color-secondary);
        line-height: 1.7;
      }

      /* Inbox */
      .fb-inbox__note,
      .fb-inbox__empty {
        margin: 0 0 var(--space-4) 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .fb-inbox__list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin: 0 0 var(--space-4) 0;
        padding: 0;
        list-style: none;
      }

      .fb-entry {
        padding: var(--space-4);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        border-radius: var(--border-radius-lg, 12px);
      }

      .fb-entry__head {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
      }

      .fb-entry__category {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-color);
      }

      .fb-entry__date {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        font-variant-numeric: tabular-nums;
      }

      .fb-entry__from {
        margin: 0 0 var(--space-2) 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      .fb-entry__message {
        margin: 0;
        color: var(--text-color);
        font-size: 0.95rem;
        line-height: 1.65;
        white-space: pre-wrap;
      }

      .fb-inbox__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-3);
      }

      /* Mobile: one action per row, full width (kit convention for stacked buttons). */
      @media (max-width: 600px) {
        .fb-actions,
        .fb-inbox__actions {
          flex-direction: column;
          align-items: stretch;
        }

        .fb-actions button,
        .fb-inbox__actions button,
        .fb-success button {
          width: 100%;
          justify-content: center;
        }
      }
    `,
  ],
})
export class FeedbackComponent {
  private readonly inbox = inject(FeedbackInboxService);
  private readonly translation = inject(TranslationService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly maxMessageLength = FEEDBACK_MESSAGE_MAX_LENGTH;
  readonly maxNameLength = FEEDBACK_NAME_MAX_LENGTH;

  // Form state
  readonly name = signal('');
  readonly email = signal('');
  readonly category = signal<FeedbackPageCategory>('general');
  readonly message = signal('');
  readonly consent = signal(false);

  // Page state
  readonly status = signal<SubmitStatus>('idle');
  readonly confirmClear = signal(false);
  private readonly touched = signal<ReadonlySet<TouchableField>>(new Set());

  readonly entries = this.inbox.entries;
  readonly messageLength = computed(() => this.message().trim().length);

  // Every one of these sits inside an @if branch: whenever the page swaps a branch
  // it destroys the element the user was standing on, so each swap has to hand
  // focus somewhere that still exists (A11Y-001 — an unreachable control is broken,
  // and focus dumped on <body> is where a keyboard user gets lost).
  private readonly successTitle = viewChild<ElementRef<HTMLElement>>('successTitle');
  private readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  private readonly inboxEmpty = viewChild<ElementRef<HTMLElement>>('inboxEmpty');
  private readonly clearButton = viewChild<ElementRef<HTMLElement>>('clearButton');
  private readonly clearConfirmButton = viewChild<ElementRef<HTMLElement>>('clearConfirmButton');

  /** Tracked so every t() call re-runs after an in-place language switch. */
  private readonly currentLanguage = computed(() => this.translation.currentLanguage);

  constructor() {
    this.translation.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => this.cdr.detectChanges());

    // Storage may only speak after hydration has matched the prerendered markup.
    afterNextRender(() => this.inbox.loadStored());
  }

  // ── labels ─────────────────────────────────────────────────────────────────

  t(key: string): string {
    this.currentLanguage();
    return this.translation.translate(key);
  }

  readonly categoryOptions = computed(() =>
    FEEDBACK_PAGE_CATEGORIES.map((value) => ({ value, label: this.t(`feedback.category.${value}`) })),
  );

  categoryLabel(category: FeedbackPageCategory): string {
    return this.t(`feedback.category.${category}`);
  }

  /** Dates follow the active locale, never a hard-coded one (i18n guide). */
  formatDate(iso: string): string {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return iso;
    return new Intl.DateTimeFormat(dateLocaleFor(this.translation.currentIntlLocale), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed);
  }

  readonly submitLabel = computed(() =>
    this.status() === 'sending' ? this.t('feedback.page.submitting') : this.t('feedback.page.submit'),
  );

  /** What the live region says. Empty while nothing has happened yet. */
  readonly statusAnnouncement = computed(() => {
    switch (this.status()) {
      case 'sending':
        return this.t('feedback.page.submitting');
      case 'sent':
        return this.t('feedback.page.successText');
      case 'error':
        return this.t('feedback.page.error.storage');
      default:
        return '';
    }
  });

  // ── validation ─────────────────────────────────────────────────────────────

  private readonly fieldErrors = computed(() => this.inbox.validate(this.draft()));

  /** Is this error both present and allowed to show yet? */
  shows(error: FeedbackFieldError): boolean {
    if (!this.fieldErrors().includes(error)) return false;
    const field: TouchableField =
      error === 'emailInvalid' ? 'email' : error === 'consentRequired' ? 'consent' : 'message';
    return this.touched().has(field);
  }

  touch(field: TouchableField): void {
    this.touched.update((current) => new Set(current).add(field));
  }

  messageDescribedBy(): string {
    return this.shows('messageTooShort') || this.shows('messageTooLong')
      ? 'fb-message-hint fb-message-error'
      : 'fb-message-hint';
  }

  /**
   * p-checkbox has no ariaDescribedBy input — the pass-through hook is the only
   * way onto the real <input> it renders (checkbox guide, "Key API").
   */
  consentPt(): Record<string, Record<string, string | null>> {
    return {
      input: { 'aria-describedby': this.shows('consentRequired') ? 'fb-consent-error' : null },
    };
  }

  onConsentChange(checked: boolean): void {
    this.consent.set(checked);
    this.touch('consent');
  }

  // ── actions ────────────────────────────────────────────────────────────────

  private draft(): FeedbackDraft {
    return {
      name: this.name(),
      email: this.email(),
      category: this.category(),
      message: this.message(),
      consent: this.consent(),
    };
  }

  async submit(): Promise<void> {
    if (this.status() === 'sending') return;

    // A submit attempt makes every pending complaint visible at once, so the
    // user is not sent hunting field by field.
    this.touched.set(new Set<TouchableField>(['email', 'message', 'consent']));
    if (this.fieldErrors().length > 0) {
      this.status.set('idle');
      return;
    }

    this.status.set('sending');
    this.inbox.useLanguage(this.translation.currentLanguage);

    try {
      await this.inbox.submit(this.draft());
      this.status.set('sent');
      // The success panel replaced the form, so focus goes to its heading — which
      // is also what the user needs to read. No toast on top of that: the live
      // region and the moved focus already say it, and a third announcement of the
      // same event is noise in a screen reader.
      this.moveFocusTo(this.successTitle);
    } catch {
      // Validation ran above, so the only way down here is the storage path —
      // the one failure mode a browser-local inbox actually has. It renders as
      // an inline message, never as a toast: an error is worth re-reading.
      this.status.set('error');
      this.cdr.detectChanges();
    }
  }

  writeAnother(): void {
    this.name.set('');
    this.email.set('');
    this.category.set('general');
    this.message.set('');
    this.consent.set(false);
    this.touched.set(new Set());
    this.status.set('idle');
    this.moveFocusTo(this.nameInput);
  }

  askToClear(): void {
    this.confirmClear.set(true);
    this.moveFocusTo(this.clearConfirmButton);
  }

  cancelClear(): void {
    this.confirmClear.set(false);
    this.moveFocusTo(this.clearButton);
  }

  clearAll(): void {
    this.inbox.clear();
    this.confirmClear.set(false);
    // Both buttons are gone with the list; the empty-inbox note is what replaced
    // them, and it carries the only wording that says the deletion happened.
    this.moveFocusTo(this.inboxEmpty);
    this.toast.showSuccess(this.t('feedback.page.cleared'));
  }

  /**
   * Render the pending state change, then focus whatever it put on screen. The
   * detectChanges is not optional: the target does not exist until the @if branch
   * it lives in has been rendered.
   */
  private moveFocusTo(target: () => ElementRef<HTMLElement> | undefined): void {
    this.cdr.detectChanges();
    target()?.nativeElement.focus();
  }
}
