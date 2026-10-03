/**
 * ExampleBoxComponent - Reusable example/code box for guides
 *
 * Displays examples with various styles (good/bad/neutral/info).
 * Supports labels, titles, code mode, and result text.
 * Used for before/after comparisons and prompt examples.
 *
 * Usage:
 * <app-example-box
 *   type="good"
 *   titleKey="example.title"
 *   contentKey="example.prompt"
 *   [codeMode]="true"
 *   labelKey="common.after">
 * </app-example-box>
 *
 * Or with ng-content:
 * <app-example-box type="bad" label="Before">
 *   <code>Your custom content here</code>
 * </app-example-box>
 */
import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';

import { TranslationService } from '../../services/translation.service';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

export type ExampleBoxType = 'neutral' | 'good' | 'bad' | 'info' | 'warning';

@Component({
  selector: 'app-example-box',
  standalone: true,
  imports: [CursorGlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="example-box" [class]="type" role="region" [attr.aria-label]="displayTitle || null" appCursorGlow>
      <!-- Label (e.g., "Before", "After") -->
      @if (displayLabel) {
        <span class="example-label">
          {{ displayLabel }}
        </span>
      }

      <!-- Title with optional icon -->
      @if (displayTitle) {
        <div class="example-title">
          @if (effectiveIcon) {
            <i [class]="effectiveIcon" aria-hidden="true"></i>
          }
          {{ displayTitle }}
        </div>
      }

      <!-- Content area -->
      <div class="example-content">
        <!-- Code mode -->
        @if (codeMode && displayContent) {
          <code>{{ displayContent }}</code>
        }

        <!-- Regular text mode -->
        @if (!codeMode && displayContent) {
          <span>{{ displayContent }}</span>
        }

        <!-- Projected content -->
        <ng-content></ng-content>
      </div>

      <!-- Result text -->
      @if (displayResult) {
        <p class="example-result">
          {{ displayResult }}
        </p>
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

      .example-box {
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: var(--space-4);
        position: relative;
      }

      /* Type variants */
      .example-box.neutral {
        border-left: 4px solid var(--surface-400);
      }

      .example-box.good {
        border-left: 4px solid var(--green-500);
        background: color-mix(in srgb, var(--green-500) 5%, var(--surface-ground));
      }

      .example-box.bad {
        border-left: 4px solid var(--red-500);
        background: color-mix(in srgb, var(--red-500) 5%, var(--surface-ground));
      }

      .example-box.info {
        border-left: 4px solid var(--blue-500);
        background: color-mix(in srgb, var(--blue-500) 5%, var(--surface-ground));
      }

      .example-box.warning {
        border-left: 4px solid var(--orange-500);
        background: color-mix(in srgb, var(--orange-500) 5%, var(--surface-ground));
      }

      /* Label */
      .example-label {
        display: inline-block;
        padding: var(--space-1) var(--space-3);
        background: var(--surface-200);
        border-radius: var(--border-radius);
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-color-secondary);
        margin-bottom: var(--space-2);
      }

      /* 800, not 700: on the 20% tint green-700 measured 4.21:1 (A11Y-004). The
         800 shades do not flip in the dark theme, so the dark labels are set below
         with :host-context — the ".dark-theme ..." rules further down are scoped by
         the emulated encapsulation to an <html> that never carries the attribute,
         so they never match. */
      .example-box.good .example-label {
        background: color-mix(in srgb, var(--green-500) 20%, var(--surface-ground));
        color: var(--green-800);
      }

      .example-box.bad .example-label {
        background: color-mix(in srgb, var(--red-500) 20%, var(--surface-ground));
        color: var(--red-800);
      }

      :host-context(.dark-theme) .example-box.good .example-label {
        color: var(--green-400);
      }

      :host-context(.dark-theme) .example-box.bad .example-label {
        color: var(--red-400);
      }

      /* Title */
      .example-title {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: var(--space-3);
      }

      .example-title i {
        font-size: 1.1rem;
      }

      .example-box.good .example-title {
        color: var(--green-700);
      }

      .example-box.good .example-title i {
        color: var(--green-500);
      }

      .example-box.bad .example-title {
        color: var(--red-700);
      }

      .example-box.bad .example-title i {
        color: var(--red-500);
      }

      /* Content */
      .example-content {
        color: var(--text-color);
      }

      .example-content code {
        display: block;
        background: var(--surface-card);
        padding: var(--space-3);
        border-radius: var(--border-radius);
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
      }

      /* Result text */
      .example-result {
        margin: var(--space-3) 0 0 0;
        padding-top: var(--space-3);
        border-top: 1px dashed var(--surface-border);
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      /* Dark theme adjustments */
      .dark-theme .example-box.good {
        background: color-mix(in srgb, var(--green-500) 10%, var(--surface-ground));
      }

      .dark-theme .example-box.bad {
        background: color-mix(in srgb, var(--red-500) 10%, var(--surface-ground));
      }

      .dark-theme .example-box.good .example-title,
      .dark-theme .example-box.good .example-label {
        color: var(--green-400);
      }

      .dark-theme .example-box.bad .example-title,
      .dark-theme .example-box.bad .example-label {
        color: var(--red-400);
      }

      /* WCAG 1.4.10 Reflow — narrow column */
      @container (max-width: 480px) {
        .example-box {
          padding: var(--space-2);
        }

        .example-content code {
          padding: var(--space-2);
          font-size: 0.8rem;
          overflow-x: auto;
        }
      }

      /* Print styles */
      @media print {
        .example-box {
          break-inside: avoid;
          border: 1px solid #ccc;
          background: #f9f9f9 !important;
        }

        .example-box.good {
          border-left-color: #22c55e;
        }

        .example-box.bad {
          border-left-color: #ef4444;
        }
      }
    `,
  ],
})
export class ExampleBoxComponent {
  @Input() type: ExampleBoxType = 'neutral';

  // Title
  @Input() title = '';
  @Input() titleKey = '';

  // Content
  @Input() content = '';
  @Input() contentKey = '';

  // Label (e.g., "Before", "After")
  @Input() label = '';
  @Input() labelKey = '';

  // Result text
  @Input() result = '';
  @Input() resultKey = '';

  // Icon (auto-set for good/bad types)
  @Input() icon = '';

  // Code mode renders content in <code> tag
  @Input() codeMode = false;

  private translationService = inject(TranslationService);

  t(key: string): string {
    return this.translationService.translate(key);
  }

  get displayTitle(): string {
    if (this.title) return this.title;
    if (this.titleKey) return this.t(this.titleKey);
    return '';
  }

  get displayContent(): string {
    if (this.content) return this.content;
    if (this.contentKey) return this.t(this.contentKey);
    return '';
  }

  get displayLabel(): string {
    if (this.label) return this.label;
    if (this.labelKey) return this.t(this.labelKey);
    return '';
  }

  get displayResult(): string {
    if (this.result) return this.result;
    if (this.resultKey) return this.t(this.resultKey);
    return '';
  }

  get effectiveIcon(): string {
    if (this.icon) return this.icon;

    // Default icons for types
    switch (this.type) {
      case 'good':
        return 'pi pi-check';
      case 'bad':
        return 'pi pi-times';
      case 'info':
        return 'pi pi-info-circle';
      case 'warning':
        return 'pi pi-exclamation-triangle';
      default:
        return '';
    }
  }
}
