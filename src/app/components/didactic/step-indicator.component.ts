/**
 * StepIndicatorComponent
 *
 * Modern step/progress indicator for tutorials and multi-step processes.
 * Clean design with elegant connectors and smooth animations.
 */
import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../services/translation.service';

export interface StepItem {
  id?: string | number;
  labelKey?: string;
  label?: string;
  descriptionKey?: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon?: string;
}

export type StepLayout = 'horizontal' | 'vertical' | 'compact';

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [],
  template: `
    <div
      class="stepper"
      [class]="'layout-' + layout"
      [class.clickable]="clickable"
      role="list"
      [attr.aria-label]="ariaLabel"
    >
      @for (step of steps; track step; let i = $index; let last = $last) {
        <!-- Step Item -->
        <div
          class="step"
          [class.active]="step.status === 'active'"
          [class.completed]="step.status === 'completed'"
          [class.error]="step.status === 'error'"
          [class.pending]="step.status === 'pending'"
          (click)="onStepClick(step, i)"
          (keydown.enter)="onStepClick(step, i)"
          (keydown.space)="onStepClick(step, i); $event.preventDefault()"
          [attr.tabindex]="clickable ? 0 : null"
          role="listitem"
          [attr.aria-label]="layout === 'compact' ? stepAriaLabel(step, i) : null"
          [attr.aria-current]="step.status === 'active' ? 'step' : null"
        >
          <!-- Step Indicator Circle -->
          <div class="step-indicator">
            <!-- Completed Check -->
            @if (step.status === 'completed') {
              <svg class="check-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            }
            <!-- Error X -->
            @if (step.status === 'error') {
              <svg class="error-icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
            }
            <!-- Custom Icon -->
            @if (step.icon && step.status !== 'completed' && step.status !== 'error') {
              <i [class]="step.icon"></i>
            }
            <!-- Number -->
            @if (!step.icon && step.status !== 'completed' && step.status !== 'error') {
              <span class="step-number">
                {{ i + 1 }}
              </span>
            }
            <!-- Active Pulse -->
            @if (step.status === 'active') {
              <span class="pulse-ring"></span>
            }
          </div>
          <!-- Step Content (not in compact mode) -->
          @if (layout !== 'compact') {
            <div class="step-content">
              <span class="step-label">{{ step.labelKey ? t(step.labelKey) : step.label }}</span>
              @if (step.descriptionKey || step.description) {
                <span class="step-desc">
                  {{ step.descriptionKey ? t(step.descriptionKey) : step.description }}
                </span>
              }
            </div>
          }
        </div>
        <!-- Connector Line (not for last step) -->
        @if (!last && showConnectors) {
          <div class="connector" [class.completed]="step.status === 'completed'">
            <div class="connector-progress"></div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      /* A query container: the @container rules below read the width of the
       column this widget sits in (article, demo frame, card), not the window. */
      :host {
        display: block;
        container-type: inline-size;
      }

      .stepper {
        --step-size: 40px;
        --step-size-compact: 28px;
        --connector-thickness: 3px;
        --color-active: var(--primary-color);
        /* Completed fill and its check icon (SC 1.4.11, 3:1). #22c55e under a white
           check measured 2.28:1 and 1.95:1 against the Werkbund surface, so light
           mode takes the gated --semantic-green-fg (white check 5.02:1); dark mode
           keeps #22c55e and turns the check dark (see the dark block below). */
        --color-completed: var(--semantic-green-fg);
        --color-completed-icon: #fff;
        /* The label is text (4.5:1): --semantic-green-fg reached only 4.28:1 on the
           tinted Werkbund demo surface, p-green-800 reads on every light surface. */
        --color-completed-text: #166534;
        --color-error: #ef4444;
        --color-pending: var(--neutral-400);
      }

      /* ═══════════════════════════════════════════════════════════════
       HORIZONTAL LAYOUT
       ═══════════════════════════════════════════════════════════════ */
      .layout-horizontal {
        display: flex;
        align-items: flex-start;
      }

      .layout-horizontal .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 1;
      }

      .layout-horizontal .step-content {
        text-align: center;
        margin-top: 12px;
        max-width: 120px;
      }

      .layout-horizontal .connector {
        flex: 1;
        height: var(--connector-thickness);
        min-width: 40px;
        max-width: 120px;
        background: var(--color-pending);
        border-radius: 2px;
        margin-top: calc(var(--step-size) / 2 - var(--connector-thickness) / 2);
        position: relative;
        overflow: hidden;
      }

      .layout-horizontal .connector-progress {
        position: absolute;
        inset: 0;
        background: var(--color-completed);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
      }

      .layout-horizontal .connector.completed .connector-progress {
        transform: scaleX(1);
      }

      /* ═══════════════════════════════════════════════════════════════
       VERTICAL LAYOUT
       ═══════════════════════════════════════════════════════════════ */
      .layout-vertical {
        display: flex;
        flex-direction: column;
      }

      .layout-vertical .step {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        position: relative;
        z-index: 1;
      }

      .layout-vertical .step-content {
        padding-top: 8px;
        padding-bottom: 4px;
      }

      .layout-vertical .connector {
        width: var(--connector-thickness);
        height: 32px;
        background: var(--color-pending);
        border-radius: 2px;
        margin-left: calc(var(--step-size) / 2 - var(--connector-thickness) / 2);
        position: relative;
        overflow: hidden;
      }

      .layout-vertical .connector-progress {
        position: absolute;
        inset: 0;
        background: var(--color-completed);
        transform: scaleY(0);
        transform-origin: top;
        transition: transform 0.4s ease;
      }

      .layout-vertical .connector.completed .connector-progress {
        transform: scaleY(1);
      }

      /* ═══════════════════════════════════════════════════════════════
       COMPACT LAYOUT
       ═══════════════════════════════════════════════════════════════ */
      .layout-compact {
        display: flex;
        align-items: center;
        gap: 0;
      }

      .layout-compact .step-indicator {
        width: var(--step-size-compact);
        height: var(--step-size-compact);
        font-size: 0.75rem;
      }

      .layout-compact .connector {
        flex: 1;
        height: var(--connector-thickness);
        min-width: 20px;
        max-width: 48px;
        background: var(--color-pending);
        border-radius: 2px;
        position: relative;
        overflow: hidden;
      }

      .layout-compact .connector-progress {
        position: absolute;
        inset: 0;
        background: var(--color-completed);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s ease;
      }

      .layout-compact .connector.completed .connector-progress {
        transform: scaleX(1);
      }

      /* ═══════════════════════════════════════════════════════════════
       STEP INDICATOR (CIRCLE)
       ═══════════════════════════════════════════════════════════════ */
      .step-indicator {
        width: var(--step-size);
        height: var(--step-size);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--neutral-100);
        border: 3px solid var(--color-pending);
        /* neutral-600: neutral-500 measured 4.34:1 on neutral-100 (SC 1.4.3). */
        color: var(--neutral-600);
        font-weight: 700;
        font-size: 0.9rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        flex-shrink: 0;
      }

      .step-number {
        font-family:
          'Inter',
          -apple-system,
          sans-serif;
      }

      /* Active State */
      .step.active .step-indicator {
        border-color: var(--color-active);
        background: var(--color-active);
        /* Reads on --primary-color in every palette (white: 1.05:1 on contrast dark). */
        color: var(--primary-color-text);
        box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.2);
      }

      /* Completed State */
      .step.completed .step-indicator {
        border-color: var(--color-completed);
        background: var(--color-completed);
        color: var(--color-completed-icon);
      }

      /* Error State */
      .step.error .step-indicator {
        border-color: var(--color-error);
        background: var(--color-error);
        color: white;
      }

      /* Icons */
      .check-icon,
      .error-icon {
        width: 18px;
        height: 18px;
      }

      .layout-compact .check-icon,
      .layout-compact .error-icon {
        width: 14px;
        height: 14px;
      }

      .step-indicator i {
        font-size: 1rem;
      }

      /* Pulse Animation for Active */
      .pulse-ring {
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 2px solid var(--color-active);
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.15);
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pulse-ring,
        .step-indicator,
        .connector-progress,
        .step-label {
          transition: none;
          animation: none;
        }
      }

      /* ═══════════════════════════════════════════════════════════════
       STEP CONTENT
       ═══════════════════════════════════════════════════════════════ */
      .step-content {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .step-label {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        transition: color 0.3s ease;
      }

      .step.active .step-label {
        color: var(--primary-color-fg);
      }

      .step.completed .step-label {
        color: var(--color-completed-text);
      }

      .step.error .step-label {
        color: var(--color-error);
      }

      .step-desc {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        line-height: 1.4;
      }

      /* ═══════════════════════════════════════════════════════════════
       CLICKABLE STATE
       ═══════════════════════════════════════════════════════════════ */
      .clickable .step {
        cursor: pointer;
      }

      .clickable .step:hover .step-indicator {
        transform: scale(1.1);
      }

      .clickable .step:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: 8px;
      }

      .clickable .step:focus:not(:focus-visible) {
        outline: none;
      }

      .clickable .step:focus-visible .step-indicator {
        box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.3);
      }

      /* ═══════════════════════════════════════════════════════════════
       RESPONSIVE
       ═══════════════════════════════════════════════════════════════ */
      @media print {
        .stepper {
          break-inside: avoid;
        }

        .pulse-ring {
          display: none !important;
        }

        .step-indicator {
          transition: none !important;
          box-shadow: none !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .step.active .step-indicator,
        .step.completed .step-indicator,
        .step.error .step-indicator {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .connector,
        .connector-progress {
          transition: none !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .connector.completed .connector-progress {
          transform: scaleX(1) !important;
        }

        .layout-vertical .connector.completed .connector-progress {
          transform: scaleY(1) !important;
        }

        .clickable .step {
          cursor: default;
        }
      }

      @container (max-width: 640px) {
        .layout-horizontal {
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .layout-horizontal .connector {
          display: none;
        }

        .layout-horizontal .step {
          flex-basis: calc(50% - 8px);
          margin-bottom: 16px;
        }

        .layout-horizontal .step-content {
          max-width: none;
        }

        .step-label {
          font-size: 0.8rem;
        }
      }

      /* ═══════════════════════════════════════════════════════════════
       DARK THEME
       ═══════════════════════════════════════════════════════════════ */
      :host-context(.dark-theme) .stepper {
        --color-pending: var(--neutral-500);
        /* The bright fill stays; a green-950 check on it instead of white. */
        --color-completed: #22c55e;
        --color-completed-icon: #052e16;
        --color-completed-text: var(--semantic-green-fg);
      }

      :host-context(.dark-theme) .step-indicator {
        background: var(--neutral-700);
        border-color: var(--neutral-500);
        color: var(--neutral-300);
      }

      :host-context(.dark-theme) .step.active .step-indicator {
        background: var(--color-active);
      }

      :host-context(.dark-theme) .step.completed .step-indicator {
        background: var(--color-completed);
      }

      :host-context(.dark-theme) .step.error .step-indicator {
        background: var(--color-error);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepIndicatorComponent {
  private translationService = inject(TranslationService);

  @Input() steps: StepItem[] = [];
  @Input() layout: StepLayout = 'horizontal';
  @Input() showConnectors: boolean = true;
  @Input() clickable: boolean = false;
  @Input() ariaLabel: string = 'Progress steps';

  @Output() stepClick = new EventEmitter<{ step: StepItem; index: number }>();

  onStepClick(step: StepItem, index: number): void {
    if (this.clickable) {
      this.stepClick.emit({ step, index });
    }
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Accessible name for a step in `compact` layout, where the visible label is
   * omitted from the DOM. Falls back to "Step N" when no label is provided so a
   * screen reader still gets the step name/position, not just "list item".
   */
  stepAriaLabel(step: StepItem, index: number): string {
    const label = step.labelKey ? this.t(step.labelKey) : step.label;
    return label ? `${index + 1}. ${label}` : `Step ${index + 1}`;
  }
}
