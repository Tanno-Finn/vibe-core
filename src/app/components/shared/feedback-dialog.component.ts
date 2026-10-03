/**
 * Feedback Dialog Component
 *
 * Pure dialog component for collecting user feedback.
 * The FAB button is rendered by FabContainerComponent via FabRegistry.
 * This component only handles the dialog display and form submission.
 */

import {
  Component,
  signal,
  computed,
  effect,
  untracked,
  inject,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { SelectModule } from '@openng/optimus-ui/select';
import { RatingModule } from '@openng/optimus-ui/rating';
import { FeedbackService, type FeedbackData, type FeedbackCategory } from '../../services/feedback.service';
import { TranslationService } from '../../services/translation.service';
import { ToastService } from '../../services/toast.service';
import { FabRegistryService, FAB_DIALOG } from '../../services/fab-registry.service';

/** Shared FAB-dialog slot id — see FabRegistryService.openDialogId. */
const DIALOG_ID = FAB_DIALOG.FEEDBACK;

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, RouterModule, DialogModule, SelectModule, RatingModule],
  template: `
    <!-- #dlg: [showHeader]="false" leaves Optimus UI's generated 'ariaLabelledBy'
         id pointing at nothing (the <span> carrying it lives inside the
         header's *ngIf), so the dialog has no accessible name. Putting that
         same id on the visible heading below repairs the reference.
         NOTE: no backticks in this comment - it sits inside a template literal. -->
    <p-dialog
      #dlg
      [visible]="dialogVisible()"
      (visibleChange)="dialogVisible.set($event)"
      (onHide)="closeDialog()"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [closeOnEscape]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="feedback-dialog"
      [style]="{ width: '90vw', maxWidth: '460px' }"
      [header]="''"
      [showHeader]="false"
    >
      <div class="dialog-content">
        <!-- Custom Header -->
        <div class="dialog-header">
          <div class="header-icon">
            <i class="pi pi-megaphone"></i>
          </div>
          <h2 class="dialog-title" [attr.id]="dlg.computedAriaLabelledBy()">{{ t('feedback.dialog.title') }}</h2>
          <button
            class="close-btn"
            (click)="closeDialog()"
            [attr.aria-label]="t('ui.close')"
            [title]="t('ui.close')"
            type="button"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="dialog-body">
          <!-- Intro -->
          <p class="dialog-intro">{{ t('feedback.intro') }}</p>

          <!-- Category Dropdown -->
          <div class="form-field">
            <!-- <label for> never binds to p-select: its focusable element is a
                 <span role="combobox">, not a labelable control. Caption + [ariaLabelledBy]. -->
            <span class="field-label" id="feedback-category-label">{{ t('feedback.category.label') }}</span>
            <p-select
              inputId="feedback-category"
              [ariaLabelledBy]="'feedback-category-label'"
              [options]="categoryOptions()"
              [(ngModel)]="selectedCategoryValue"
              (ngModelChange)="onCategoryChange($event)"
              optionLabel="label"
              optionValue="value"
              appendTo="body"
              styleClass="feedback-select"
            />
          </div>

          <!-- Rating (General only) -->
          @if (selectedCategory() === 'general') {
            <div class="form-field">
              <span class="field-label" id="feedback-rating-label">{{ t('feedback.rating.label') }}</span>
              <p-rating
                [(ngModel)]="ratingValue"
                (ngModelChange)="rating.set($event)"
                [attr.aria-labelledby]="'feedback-rating-label'"
                styleClass="feedback-rating"
              />
            </div>
          }

          <!-- Accessibility barrier fields (accessibility category only) -->
          @if (selectedCategory() === 'accessibility') {
            <div class="form-field">
              <label for="feedback-a11y-page">{{ t('feedback.a11y.pageLabel') }}</label>
              <input
                id="feedback-a11y-page"
                type="text"
                [(ngModel)]="affectedPageValue"
                (ngModelChange)="affectedPage.set($event)"
                class="feedback-input"
              />
            </div>

            <div class="form-field">
              <label for="feedback-a11y-tech">{{ t('feedback.a11y.techLabel') }}</label>
              <input
                id="feedback-a11y-tech"
                type="text"
                [(ngModel)]="assistiveTechValue"
                (ngModelChange)="assistiveTech.set($event)"
                [placeholder]="t('feedback.a11y.techPlaceholder')"
                class="feedback-input"
              />
            </div>

            <p class="privacy-note">{{ t('feedback.a11y.anonymNote') }}</p>
          }

          <!-- Message -->
          <div class="form-field">
            <label for="feedback-message">{{ t('feedback.message') }}</label>
            <textarea
              id="feedback-message"
              rows="4"
              [(ngModel)]="messageValue"
              (ngModelChange)="message.set($event)"
              [placeholder]="messagePlaceholder()"
              [maxLength]="5000"
              class="feedback-textarea"
            >
            </textarea>
            <span class="char-count">{{ message().length }} / 5000</span>
          </div>

          <!-- Email (optional) -->
          <div class="form-field">
            <label for="feedback-email">{{ t('feedback.email') }}</label>
            <input
              id="feedback-email"
              type="email"
              [(ngModel)]="emailValue"
              (ngModelChange)="email.set($event)"
              [placeholder]="t('feedback.emailPlaceholder')"
              [class.invalid]="emailValue && !isValidEmail()"
              class="feedback-input"
            />
            @if (emailValue && !isValidEmail()) {
              <span class="email-hint">
                {{ t('feedback.emailHint') }}
              </span>
            }
            <!-- DSGVO Art. 13 privacy note (Y7) -->
            <p class="privacy-note">
              {{ t('feedback.privacyNote') }}
              <a routerLink="/impressum" fragment="data-protection" (click)="closeDialog()">
                {{ t('feedback.privacyNoteLink') }}
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="dialog-footer">
          <button class="cancel-btn" (click)="closeDialog()" type="button">
            <i class="pi pi-times"></i>
            <span>{{ t('ui.cancel') }}</span>
          </button>

          <button
            class="submit-btn"
            (click)="submitFeedback()"
            [disabled]="!canSubmit() || isSubmitting()"
            type="button"
          >
            @if (isSubmitting()) {
              <i class="pi pi-spin pi-spinner"></i>
            }
            <span>{{ isSubmitting() ? t('feedback.sending') : t('feedback.send') }}</span>
          </button>
        </div>
      </div>
    </p-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Dialog Styles */
      .feedback-dialog .p-dialog-mask {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .feedback-dialog .p-dialog {
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
      }

      .feedback-dialog .p-dialog-content {
        padding: 0;
        border-radius: 16px;
        background: var(--surface-ground);
      }

      .feedback-dialog .dialog-content {
        background: var(--surface-ground);
      }

      /* Custom Header - Teal theme */
      .feedback-dialog .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-5) var(--space-6);
        background: var(--teal-50);
        border-bottom: 3px solid var(--teal-500);
      }

      app-feedback-dialog .header-icon {
        display: flex;
        align-items: center;
        color: var(--teal-500);
      }

      .feedback-dialog .header-icon i {
        font-size: 1.5rem;
        line-height: 1;
      }

      .feedback-dialog .dialog-title {
        flex: 1;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--teal-700);
        margin: 0 var(--space-4);
      }

      .feedback-dialog .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 50%;
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1.1rem;
      }

      .feedback-dialog .close-btn:hover {
        background: var(--red-50);
        border-color: var(--red-400);
        color: var(--red-600);
      }

      .feedback-dialog .close-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Dialog Body */
      .feedback-dialog .dialog-body {
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .feedback-dialog .dialog-intro {
        margin: 0;
        font-size: 1rem;
        line-height: 1.7;
        color: var(--text-color);
        font-weight: 500;
      }

      /* Form Fields */
      .form-field {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .form-field > label,
      .form-field > .field-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }

      /* Select styling */
      .feedback-select {
        width: 100%;
      }

      /* Rating styling */
      .feedback-rating {
        padding: var(--space-1) 0;
      }

      /* Input Styles */
      .feedback-textarea,
      .feedback-input {
        width: 100%;
        padding: var(--space-3);
        font-size: 1rem;
        font-family: inherit;
        color: var(--text-color);
        background: var(--surface-0);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
        box-sizing: border-box;
      }

      .feedback-textarea:focus,
      .feedback-input:focus {
        outline: none;
        border-color: var(--primary-color-fg);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
      }

      .feedback-textarea::placeholder,
      .feedback-input::placeholder {
        color: var(--text-color-secondary);
      }

      .feedback-textarea {
        resize: vertical;
        min-height: 120px;
        line-height: 1.5;
      }

      .char-count {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        text-align: right;
      }

      .feedback-input.invalid {
        border-color: var(--orange-400);
      }

      .email-hint {
        font-size: 0.8rem;
        color: var(--orange-600);
        font-style: italic;
      }

      .privacy-note {
        margin: var(--space-2) 0 0 0;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        line-height: 1.4;
      }

      .privacy-note a {
        color: var(--primary-color-fg);
        text-decoration: underline;
      }

      .privacy-note a:hover,
      .privacy-note a:focus-visible {
        text-decoration: none;
      }

      /* Dialog Footer */
      .feedback-dialog .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-3);
        padding: var(--space-4) var(--space-6);
        background: var(--surface-50);
        border-top: 1px solid var(--surface-border);
      }

      .cancel-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-4);
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        color: var(--text-color-secondary);
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .cancel-btn:hover {
        background: var(--red-50);
        border-color: var(--red-400);
        color: var(--red-600);
      }

      .cancel-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .submit-btn {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3) var(--space-5);
        background: var(--teal-500);
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .submit-btn:hover:not(:disabled) {
        background: var(--teal-600);
      }

      .submit-btn:focus-visible {
        outline: 2px solid var(--teal-500);
        outline-offset: 2px;
      }

      .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Mobile: Stack buttons full-width with centered labels */
      @media (max-width: 600px) {
        .feedback-dialog .dialog-footer {
          flex-direction: column-reverse;
          align-items: stretch;
          gap: var(--space-2);
        }

        .feedback-dialog .cancel-btn,
        .feedback-dialog .submit-btn {
          width: 100%;
          justify-content: center;
        }
      }

      /* Dark Theme — note: in this codebase --surface-800 inverts to near-white
       (#f8fafc) in .dark-theme (see styles.scss line ~534), so it is NOT a
       dark surface. Use --surface-50 (= #1e293b in dark) for tinted dark
       backgrounds. Inputs/footer base rules already use adaptive tokens
       (--surface-0, --surface-50) and need no override. */
      .dark-theme .feedback-dialog .dialog-header {
        background: var(--surface-50);
      }

      .dark-theme .feedback-dialog .dialog-title {
        color: var(--teal-400);
      }

      .dark-theme app-feedback-dialog .header-icon {
        color: var(--teal-400);
      }
    `,
  ],
})
export class FeedbackDialogComponent {
  private feedbackService = inject(FeedbackService);
  private translationService = inject(TranslationService);
  private toastService = inject(ToastService);
  private fabRegistry = inject(FabRegistryService);
  private router = inject(Router);

  // Focus management
  private triggerElement: HTMLElement | null = null;

  constructor() {
    // Mutual exclusion: if another FAB dialog (e.g. Easy Language) claims the
    // shared slot while we're open, close ourselves so only one is ever shown.
    effect(() => {
      const active = this.fabRegistry.openDialogId();
      if (active !== null && active !== DIALOG_ID) {
        untracked(() => {
          if (this.dialogVisible()) {
            this.dialogVisible.set(false);
            this.resetForm();
          }
        });
      }
    });
  }

  // State
  dialogVisible = signal(false);
  message = signal('');
  email = signal('');
  selectedCategory = signal<FeedbackCategory>('general');
  rating = signal<number>(0);
  isSubmitting = signal(false);
  // Accessibility ("report a barrier") fields — only shown for that category
  affectedPage = signal('');
  assistiveTech = signal('');

  // For ngModel
  messageValue = '';
  emailValue = '';
  selectedCategoryValue: string = 'general';
  ratingValue: number = 0;
  affectedPageValue = '';
  assistiveTechValue = '';

  // Category dropdown options (reactive to language changes)
  categoryOptions = computed((): SelectOption[] => {
    // Language dependency is established by the this.t(...) calls below, which
    // read the current-language signal via TranslationService.translate().
    return [
      { label: this.t('feedback.category.general'), value: 'general' },
      { label: this.t('feedback.category.bug'), value: 'bug' },
      { label: this.t('feedback.category.feature'), value: 'feature' },
      { label: this.t('feedback.category.content'), value: 'content' },
      { label: this.t('feedback.category.praise'), value: 'praise' },
      { label: this.t('feedback.category.accessibility'), value: 'accessibility' },
    ];
  });

  // Dynamic placeholder based on category
  messagePlaceholder = computed((): string => {
    const cat = this.selectedCategory();
    const placeholderKey = `feedback.placeholder.${cat}`;
    const translated = this.t(placeholderKey);
    return translated !== placeholderKey ? translated : this.t('feedback.messagePlaceholder');
  });

  canSubmit = computed(() => {
    if (this.isSubmitting()) return false;
    const cat = this.selectedCategory();
    const hasMessage = this.message().trim().length > 0;

    if (cat === 'praise') return true;
    if (cat === 'general') return hasMessage || this.rating() > 0;
    return hasMessage; // bug, feature, content
  });

  /**
   * Open the dialog (called by FAB click handler)
   * browser-only: opened by a click, never during prerender.
   */
  open(): void {
    this.triggerElement = document.activeElement as HTMLElement;
    // Pre-fill the "affected page" field with the current route (SSR-safe:
    // Router.url does not touch window/document). Editable by the user.
    this.affectedPage.set(this.router.url);
    this.affectedPageValue = this.router.url;
    // Claim the shared FAB-dialog slot — closes any sibling dialog.
    this.fabRegistry.setActiveDialog(DIALOG_ID);
    this.dialogVisible.set(true);
    setTimeout(() => {
      document.getElementById('feedback-category')?.focus();
    }, 100);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.resetForm();
    // Release the shared slot if we still own it.
    if (this.fabRegistry.openDialogId() === DIALOG_ID) {
      this.fabRegistry.setActiveDialog(null);
    }
    // Restore focus to the element that opened the dialog
    this.triggerElement?.focus();
    this.triggerElement = null;
  }

  resetForm(): void {
    this.message.set('');
    this.email.set('');
    this.selectedCategory.set('general');
    this.rating.set(0);
    this.affectedPage.set('');
    this.assistiveTech.set('');
    this.messageValue = '';
    this.emailValue = '';
    this.selectedCategoryValue = 'general';
    this.ratingValue = 0;
    this.affectedPageValue = '';
    this.assistiveTechValue = '';
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value as FeedbackCategory);
  }

  isValidEmail(): boolean {
    if (!this.emailValue) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.emailValue);
  }

  submitFeedback(): void {
    if (!this.canSubmit()) return;

    this.isSubmitting.set(true);

    const category = this.selectedCategory();

    // For barrier reports, prepend the (editable) affected page and optional
    // assistive technology to the message — no backend schema change needed
    // (the endpoint stores the message verbatim + passes the category through).
    let message = this.message() || undefined;
    if (category === 'accessibility') {
      const lines = [`${this.t('feedback.a11y.pageLabel')}: ${this.affectedPage().trim() || '—'}`];
      const tech = this.assistiveTech().trim();
      if (tech) {
        lines.push(`${this.t('feedback.a11y.techLabel')}: ${tech}`);
      }
      message = `${lines.join('\n')}\n\n${this.message()}`;
    }

    const data: FeedbackData = {
      type: this.feedbackService.mapCategoryToType(category),
      message,
      email: this.email() || undefined,
      category,
      rating: this.rating() > 0 ? this.rating() : undefined,
    };

    this.feedbackService.sendFeedback(data).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toastService.showSuccess(this.t('feedback.sent'), this.t('feedback.sentDetail'));
        this.closeDialog();
      },
      error: (err: Error) => {
        this.isSubmitting.set(false);
        console.error('Feedback submission failed:', err.message, err);
        if (err.message === 'feedback.error.rateLimit') {
          this.toastService.showWarning(this.t('feedback.error'), this.t('feedback.errorRateLimit'));
        } else {
          this.toastService.showError(this.t('feedback.error'), this.t('feedback.errorDetail'));
        }
      },
    });
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
