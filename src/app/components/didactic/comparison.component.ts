/**
 * ComparisonComponent
 *
 * Reusable before/after comparison for showing improvements.
 * Extracted from Prompting Guide for reuse across guides and articles.
 */
import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../services/translation.service';

export type ComparisonLayout = 'horizontal' | 'vertical' | 'stacked';
export type ComparisonVariant = 'neutral' | 'bad-good';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [],
  template: `
    <div
      class="comparison-wrapper"
      [class]="'layout-' + layout"
      role="group"
      [attr.aria-label]="ariaLabel || undefined"
    >
      <!-- Before Side -->
      <div class="comparison-side before">
        <span class="side-label" [class.bad]="variant === 'bad-good'" [class.neutral-a]="variant === 'neutral'">
          @if (variant === 'bad-good') {
            <i class="pi pi-times-circle" aria-hidden="true"></i>
          } @else {
            <i class="pi pi-circle-fill side-dot side-dot-a" aria-hidden="true"></i>
          }
          {{ beforeLabelKey ? t(beforeLabelKey) : beforeLabel }}
        </span>
        <div class="content-box" [class.bad]="variant === 'bad-good'" [class.neutral-a]="variant === 'neutral'">
          <ng-content select="[slot=before]"></ng-content>
          @if (beforeCode) {
            <code>{{ beforeCode }}</code>
          }
        </div>
        @if (beforeResultKey || beforeResult) {
          <p class="result-text">
            {{ beforeResultKey ? t(beforeResultKey) : beforeResult }}
          </p>
        }
      </div>

      <!-- Arrow -->
      <div class="comparison-arrow" aria-hidden="true">
        @if (layout === 'horizontal') {
          <i class="pi" [class.pi-arrow-right]="variant === 'bad-good'" [class.pi-arrows-h]="variant === 'neutral'"></i>
        }
        @if (layout !== 'horizontal') {
          <i class="pi" [class.pi-arrow-down]="variant === 'bad-good'" [class.pi-arrows-v]="variant === 'neutral'"></i>
        }
      </div>

      <!-- After Side -->
      <div class="comparison-side after">
        <span class="side-label" [class.good]="variant === 'bad-good'" [class.neutral-b]="variant === 'neutral'">
          @if (variant === 'bad-good') {
            <i class="pi pi-check-circle" aria-hidden="true"></i>
          } @else {
            <i class="pi pi-circle-fill side-dot side-dot-b" aria-hidden="true"></i>
          }
          {{ afterLabelKey ? t(afterLabelKey) : afterLabel }}
        </span>
        <div class="content-box" [class.good]="variant === 'bad-good'" [class.neutral-b]="variant === 'neutral'">
          <ng-content select="[slot=after]"></ng-content>
          @if (afterCode) {
            <code>{{ afterCode }}</code>
          }
        </div>
        @if (afterResultKey || afterResult) {
          <p class="result-text">
            {{ afterResultKey ? t(afterResultKey) : afterResult }}
          </p>
        }
      </div>
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

      .comparison-wrapper {
        margin: var(--space-4) 0;
      }

      /* Horizontal Layout (default) */
      .layout-horizontal {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: var(--space-4);
        align-items: flex-start;
      }

      /* Vertical Layout */
      .layout-vertical {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .layout-vertical .comparison-arrow {
        align-self: center;
      }

      /* Stacked Layout (labels on top) */
      .layout-stacked {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
      }

      .layout-stacked .comparison-arrow {
        display: none;
      }

      .comparison-side {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .side-label {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-1) var(--space-3);
        border-radius: var(--border-radius);
        font-weight: 600;
        font-size: 0.85rem;
        width: fit-content;
      }

      .side-label.bad {
        background: var(--red-100);
        color: var(--red-700);
      }

      .side-label.good {
        background: var(--green-100);
        color: var(--green-700);
      }

      .side-label.neutral-a,
      .side-label.neutral-b {
        background: var(--surface-100);
        color: var(--text-color);
        border: 1px solid var(--surface-border);
      }

      .side-dot {
        font-size: 0.6rem;
      }

      .side-dot-a {
        color: var(--blue-500);
      }

      .side-dot-b {
        color: var(--orange-500);
      }

      :host-context(.dark-theme) .side-label.bad {
        background: rgba(var(--red-500-rgb), 0.2);
        color: var(--red-400);
      }

      :host-context(.dark-theme) .side-label.good {
        background: rgba(var(--green-500-rgb), 0.2);
        color: var(--green-400);
      }

      :host-context(.dark-theme) .side-label.neutral-a,
      :host-context(.dark-theme) .side-label.neutral-b {
        background: var(--surface-200);
        color: var(--text-color);
      }

      .content-box {
        padding: var(--space-3) var(--space-4);
        border-radius: var(--border-radius);
        border: 2px solid;
        background: var(--surface-card);
      }

      .content-box.bad {
        border-color: var(--red-300);
        background: var(--red-50);
      }

      .content-box.good {
        border-color: var(--green-300);
        background: var(--green-50);
      }

      .content-box.neutral-a {
        border-color: var(--blue-300);
        background: var(--surface-card);
      }

      .content-box.neutral-b {
        border-color: var(--orange-300);
        background: var(--surface-card);
      }

      :host-context(.dark-theme) .content-box.bad {
        background: rgba(var(--red-500-rgb), 0.1);
        border-color: var(--red-700);
      }

      :host-context(.dark-theme) .content-box.good {
        background: rgba(var(--green-500-rgb), 0.1);
        border-color: var(--green-700);
      }

      :host-context(.dark-theme) .content-box.neutral-a {
        border-color: var(--blue-700);
        background: rgba(var(--blue-500-rgb), 0.05);
      }

      :host-context(.dark-theme) .content-box.neutral-b {
        border-color: var(--orange-700);
        background: rgba(var(--orange-500-rgb), 0.05);
      }

      .content-box:not(:has(*)) {
        display: none;
      }

      .content-box code {
        display: block;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .result-text {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        font-style: italic;
        margin: 0;
        padding: 0 var(--space-2);
      }

      .comparison-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color-secondary);
        font-size: 1.5rem;
        padding: var(--space-4) 0;
      }

      @container (max-width: 768px) {
        .layout-horizontal {
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }

        .layout-horizontal .comparison-arrow i {
          transform: rotate(90deg);
        }

        .layout-stacked {
          grid-template-columns: 1fr;
        }
      }

      /* Print-friendly styles */
      @media print {
        /* Force all layouts to vertical for paper */
        .layout-horizontal {
          display: flex !important;
          flex-direction: column !important;
          grid-template-columns: unset !important;
          gap: var(--space-3) !important;
        }

        .layout-stacked {
          display: flex !important;
          flex-direction: column !important;
          grid-template-columns: unset !important;
          gap: var(--space-3) !important;
        }

        /* Arrow always visible and pointing down */
        .comparison-arrow {
          display: flex !important;
          align-self: center;
          color: #666;
          padding: var(--space-2) 0;
        }

        .comparison-arrow i {
          transform: rotate(0deg) !important;
        }

        /* Simplify labels - high contrast for print */
        .side-label {
          border: 1px solid #000;
          border-radius: 2px;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.3rem 0.6rem;
        }

        .side-label.bad {
          background: transparent !important;
          color: #a00 !important;
          border-color: #a00 !important;
        }

        .side-label.good {
          background: transparent !important;
          color: #0a0 !important;
          border-color: #0a0 !important;
        }

        .side-label.neutral-a,
        .side-label.neutral-b {
          background: transparent !important;
          color: #000 !important;
          border-color: #666 !important;
        }

        /* Simplify content boxes for print */
        .content-box {
          page-break-inside: avoid;
          background: transparent !important;
          border: 1px solid #999;
          border-radius: 0;
        }

        .content-box.bad {
          border-color: #a00 !important;
        }

        .content-box.good {
          border-color: #0a0 !important;
        }

        .content-box.neutral-a,
        .content-box.neutral-b {
          border-color: #666 !important;
        }

        /* Code blocks remain visible */
        .content-box code {
          display: block;
          font-family: 'Courier New', monospace;
          color: #000;
        }

        /* Result text */
        .result-text {
          color: #666;
          font-style: italic;
          font-size: 0.8rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparisonComponent {
  private translationService = inject(TranslationService);

  @Input() ariaLabel?: string;
  @Input() layout: ComparisonLayout = 'horizontal';
  @Input() variant: ComparisonVariant = 'neutral';

  // Before side
  @Input() beforeLabel: string = 'Before';
  @Input() beforeLabelKey?: string;
  @Input() beforeCode?: string;
  @Input() beforeResult?: string;
  @Input() beforeResultKey?: string;

  // After side
  @Input() afterLabel: string = 'After';
  @Input() afterLabelKey?: string;
  @Input() afterCode?: string;
  @Input() afterResult?: string;
  @Input() afterResultKey?: string;

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
