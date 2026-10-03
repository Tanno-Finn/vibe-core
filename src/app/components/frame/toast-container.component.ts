/**
 * Toast Container Component
 *
 * A reusable component for displaying toast notifications
 * across the application with animations and positioning.
 */
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// Optimus UI Imports
import { ButtonModule } from '@openng/optimus-ui/button';
import { RippleModule } from '@openng/optimus-ui/ripple';

// Services
import { ToastService, Toast, ToastPosition } from '../../services/toast.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule],
  template: `
    <div class="toast-container" role="region" [attr.aria-label]="translate('toast.notifications')">
      <!-- Create a container for each position -->
      @for (position of positions; track trackByPosition($index, position)) {
        <div class="toasts-position-container" [class]="position">
          <!-- Toasts in this position -->
          @for (toast of getToastsForPosition(position); track trackByToastId($index, toast)) {
            <div
              class="toast-item"
              [ngClass]="toast.type"
              role="alert"
              [attr.aria-live]="getToastAriaLive(toast.type)"
              [attr.aria-atomic]="true"
              [attr.aria-label]="getToastAriaLabel(toast)"
            >
              <!-- Main content area with icon, text and close button -->
              <div class="toast-main-content">
                <!-- Icon -->
                @if (toast.icon) {
                  <div class="toast-icon" aria-hidden="true">
                    <i [class]="toast.icon"></i>
                  </div>
                }
                <!-- Content -->
                <div class="toast-content">
                  <div class="toast-summary" [id]="'toast-summary-' + toast.id">{{ toast.summary }}</div>
                  @if (toast.detail) {
                    <div
                      class="toast-detail"
                      [id]="'toast-detail-' + toast.id"
                      [attr.aria-describedby]="'toast-summary-' + toast.id"
                    >
                      {{ toast.detail }}
                    </div>
                  }
                </div>
                <!-- Close button -->
                @if (toast.closable) {
                  <button
                    class="toast-close"
                    type="button"
                    [attr.aria-label]="getCloseButtonAriaLabel(toast)"
                    [attr.aria-describedby]="'toast-summary-' + toast.id"
                    (click)="removeToast(toast.id)"
                  >
                    <i class="pi pi-times" aria-hidden="true"></i>
                  </button>
                }
              </div>
              <!-- Action button unter dem Text -->
              @if (toast.action) {
                <div class="toast-action-bottom">
                  <button
                    pButton
                    pRipple
                    class="p-button-text p-button-sm toast-action-btn"
                    type="button"
                    [attr.aria-describedby]="'toast-summary-' + toast.id"
                    [attr.aria-label]="getActionButtonAriaLabel(toast)"
                    (click)="onActionClick(toast)"
                  >
                    <span pButtonLabel>{{ toast.action.label }}</span>
                  </button>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .toast-container {
        position: fixed;
        z-index: 1000;
        pointer-events: none;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
      }

      .toasts-position-container {
        position: absolute;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        max-width: 25rem;
        gap: 0.5rem;
        pointer-events: none;
      }

      .top-right {
        top: 0;
        right: 0;
      }

      .top-left {
        top: 0;
        left: 0;
      }

      .top-center {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .bottom-right {
        bottom: 0;
        right: 0;
      }

      .bottom-left {
        bottom: 0;
        left: 0;
      }

      .bottom-center {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .toast-item {
        display: flex;
        flex-direction: column;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-3);
        padding: 1rem;
        margin-bottom: 0.5rem;
        width: 100%;
        pointer-events: auto;
        position: relative;
        animation: toast-in 0.3s ease forwards;
        color: var(--text-color);
        backdrop-filter: blur(10px);
        /* Ensure solid background with high specificity */
        background-color: var(--surface-card);
        opacity: 1;
      }

      .toast-main-content {
        display: flex;
        align-items: flex-start;
      }

      /* Margin nur wenn Action Button vorhanden */
      .toast-item:has(.toast-action-bottom) .toast-main-content {
        margin-bottom: 0.75rem;
      }

      .toast-container .toast-item.success {
        border-left: 6px solid var(--green-500);
        background: var(--green-50);
        border-top-color: var(--green-200);
        border-right-color: var(--green-200);
        border-bottom-color: var(--green-200);
      }

      .toast-container .toast-item.info {
        border-left: 6px solid var(--blue-500);
        background: var(--blue-50);
        border-top-color: var(--blue-200);
        border-right-color: var(--blue-200);
        border-bottom-color: var(--blue-200);
      }

      .toast-container .toast-item.warning {
        border-left: 6px solid var(--orange-500);
        background: var(--orange-50);
        border-top-color: var(--orange-200);
        border-right-color: var(--orange-200);
        border-bottom-color: var(--orange-200);
      }

      .toast-container .toast-item.error {
        border-left: 6px solid var(--red-500);
        background: var(--red-50);
        border-top-color: var(--red-200);
        border-right-color: var(--red-200);
        border-bottom-color: var(--red-200);
      }

      .toast-icon {
        margin-right: 0.75rem;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toast-item.success .toast-icon {
        color: var(--green-600);
      }

      .toast-item.info .toast-icon {
        color: var(--blue-600);
      }

      .toast-item.warning .toast-icon {
        color: var(--orange-600);
      }

      .toast-item.error .toast-icon {
        color: var(--red-600);
      }

      .toast-content {
        flex: 1;
      }

      .toast-summary {
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: var(--text-color);
      }

      .toast-detail {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }

      .toast-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        padding: 0.25rem;
        margin-left: 0.5rem;
        opacity: 0.8;
        transition: opacity 0.2s;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .toast-close:hover {
        opacity: 1;
      }

      .toast-close:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Action button unter dem Text */
      .toast-action-bottom {
        margin-top: 0.5rem;
        padding-left: 2rem; /* Align with text content (icon width + gap) */
      }

      .toast-container .toast-action-bottom .toast-action-btn {
        font-size: 0.8rem;
        padding: 0.375rem 0.75rem;
        color: var(--primary-color-fg);
        border: 1px solid var(--primary-200);
        background: transparent;
      }

      .toast-container .toast-action-bottom .toast-action-btn:hover {
        background: var(--primary-50);
        border-color: var(--primary-300);
      }

      /* Dark mode overrides */
      :host-context(.dark-theme) .toast-item.success {
        background: color-mix(in srgb, var(--green-500) 15%, var(--surface-card));
        border-top-color: var(--green-800);
        border-right-color: var(--green-800);
        border-bottom-color: var(--green-800);
      }
      :host-context(.dark-theme) .toast-item.info {
        background: color-mix(in srgb, var(--blue-500) 15%, var(--surface-card));
        border-top-color: var(--blue-800);
        border-right-color: var(--blue-800);
        border-bottom-color: var(--blue-800);
      }
      :host-context(.dark-theme) .toast-item.warning {
        background: color-mix(in srgb, var(--orange-500) 15%, var(--surface-card));
        border-top-color: var(--orange-800);
        border-right-color: var(--orange-800);
        border-bottom-color: var(--orange-800);
      }
      :host-context(.dark-theme) .toast-item.error {
        background: color-mix(in srgb, var(--red-500) 15%, var(--surface-card));
        border-top-color: var(--red-800);
        border-right-color: var(--red-800);
        border-bottom-color: var(--red-800);
      }
      :host-context(.dark-theme) .toast-item.success .toast-icon {
        color: var(--green-400);
      }
      :host-context(.dark-theme) .toast-item.info .toast-icon {
        color: var(--blue-400);
      }
      :host-context(.dark-theme) .toast-item.warning .toast-icon {
        color: var(--orange-400);
      }
      :host-context(.dark-theme) .toast-item.error .toast-icon {
        color: var(--red-400);
      }

      /* SHELL-5: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .toast-item {
          animation: none;
        }
      }

      /* SHELL-3: Mobile toast positioning */
      @media (max-width: 480px) {
        .toasts-position-container {
          max-width: calc(100vw - 1rem);
          left: 0.5rem !important;
          right: 0.5rem !important;
          transform: none !important;
        }
        .toasts-position-container.top-right,
        .toasts-position-container.top-left,
        .toasts-position-container.top-center {
          top: 70px;
        }
      }

      @keyframes toast-in {
        from {
          opacity: 0;
          transform: translateY(15px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);
  private translationService = inject(TranslationService);

  readonly toasts = toSignal(this.toastService.toasts$, { initialValue: [] as Toast[] });

  positions: ToastPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'];

  /**
   * Get toasts for a specific position
   */
  trackByPosition(_index: number, position: ToastPosition): string {
    return position;
  }

  trackByToastId(_index: number, toast: Toast): string {
    return toast.id;
  }

  getToastsForPosition(position: ToastPosition): Toast[] {
    return this.toasts().filter((toast) => (toast.position || 'top-right') === position);
  }

  /**
   * Handle action button click
   */
  onActionClick(toast: Toast): void {
    if (toast.action && toast.action.command) {
      toast.action.command();
      this.removeToast(toast.id);
    }
  }

  /**
   * Remove a toast from display
   */
  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  /**
   * Get translation
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Get appropriate aria-live value based on toast type
   */
  getToastAriaLive(type: string): 'polite' | 'assertive' {
    // Error toasts should be assertive to interrupt screen readers
    return type === 'error' ? 'assertive' : 'polite';
  }

  /**
   * Get comprehensive ARIA label for toast
   */
  getToastAriaLabel(toast: Toast): string {
    const typeLabel = this.translate('toast.type.' + toast.type);
    return `${typeLabel}: ${toast.summary}${toast.detail ? '. ' + toast.detail : ''}`;
  }

  /**
   * Get ARIA label for close button
   */
  getCloseButtonAriaLabel(toast: Toast): string {
    const typeLabel = this.translate('toast.type.' + toast.type);
    return `${this.translate('toast.close')}: ${typeLabel} - ${toast.summary}`;
  }

  /**
   * Get ARIA label for action button
   */
  getActionButtonAriaLabel(toast: Toast): string {
    return `${toast.action?.label}: ${toast.summary}`;
  }
}
