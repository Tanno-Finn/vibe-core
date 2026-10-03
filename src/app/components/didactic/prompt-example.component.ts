/**
 * PromptExampleComponent
 *
 * Reusable prompt example box with good/bad/neutral styling and optional tags.
 * Extracted from Prompting Guide for reuse across guides and articles.
 */
import { Component, Input, inject, PLATFORM_ID, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TranslationService } from '../../services/translation.service';

export type PromptExampleType = 'good' | 'bad' | 'neutral' | 'demo';

export interface PromptTag {
  /** Tag label (e.g., "[ROLE]", "[ACTION]") */
  label: string;
  /** Tag color */
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'pink';
  /** Translation key for tag content */
  contentKey?: string;
  /** Static content */
  content?: string;
}

@Component({
  selector: 'app-prompt-example',
  standalone: true,
  imports: [],
  template: `
    <div class="prompt-example" [class]="'type-' + type">
      <!-- Header with label -->
      @if (label || labelKey || showIcon) {
        <div class="example-header">
          @if (showIcon) {
            <i [class]="getIconClass()" aria-hidden="true"></i>
          }
          @if (label || labelKey) {
            <span>{{ labelKey ? t(labelKey) : label }}</span>
          }
        </div>
      }

      <!-- Simple code content -->
      @if (!tags?.length) {
        <div class="example-content">
          <code>{{ codeKey ? t(codeKey) : code }}</code>
        </div>
      }

      <!-- Tagged content (e.g., RACE framework) -->
      @if (tags?.length) {
        <div class="example-content tagged">
          @for (tag of tags; track tag) {
            <div class="tag-section" [class]="'tag-' + (tag.color || 'blue')">
              <span class="tag-label">{{ tag.label }}</span>
              <span class="tag-content">{{ tag.contentKey ? t(tag.contentKey) : tag.content }}</span>
            </div>
          }
        </div>
      }

      <!-- Copyable indicator -->
      @if (copyable) {
        <button
          class="copy-button"
          [class.copied]="copyStatus === 'success'"
          [class.failed]="copyStatus === 'error'"
          (click)="copyToClipboard()"
          [attr.aria-label]="t('common.copy')"
        >
          <i
            class="pi"
            aria-hidden="true"
            [class.pi-copy]="copyStatus === 'idle'"
            [class.pi-check]="copyStatus === 'success'"
            [class.pi-times]="copyStatus === 'error'"
          ></i>
        </button>
        <span class="copy-status sr-only" role="status" aria-live="polite">
          @if (copyStatus === 'success') {
            {{ t('common.copied') }}
          }
          @if (copyStatus === 'error') {
            {{ t('common.copyFailed') }}
          }
        </span>
      }
    </div>
  `,
  styles: [
    `
      .prompt-example {
        position: relative;
        margin: var(--space-3) 0;
        border-radius: var(--border-radius);
        border: 2px solid;
        overflow: hidden;
      }

      /* Type variants */
      .type-good {
        border-color: var(--green-300);
        background: var(--green-50);
      }

      .type-bad {
        border-color: var(--red-300);
        background: var(--red-50);
      }

      .type-neutral {
        border-color: var(--surface-border);
        background: var(--surface-ground);
      }

      .type-demo {
        border-color: var(--yellow-300);
        background: var(--yellow-50);
      }

      :host-context(.dark-theme) .type-good {
        background: rgba(var(--green-500-rgb), 0.1);
        border-color: var(--green-700);
      }

      :host-context(.dark-theme) .type-bad {
        background: rgba(var(--red-500-rgb), 0.1);
        border-color: var(--red-700);
      }

      :host-context(.dark-theme) .type-neutral {
        background: var(--surface-card);
      }

      :host-context(.dark-theme) .type-demo {
        background: rgba(var(--yellow-500-rgb), 0.1);
        border-color: var(--yellow-700);
      }

      .example-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        font-weight: 600;
        font-size: 0.85rem;
        border-bottom: 1px solid inherit;
      }

      .type-good .example-header {
        background: var(--green-100);
        color: var(--green-700);
        border-color: var(--green-200);
      }

      .type-bad .example-header {
        background: var(--red-100);
        color: var(--red-700);
        border-color: var(--red-200);
      }

      .type-neutral .example-header {
        background: var(--surface-100);
        color: var(--text-color);
      }

      .type-demo .example-header {
        background: var(--yellow-100);
        color: var(--yellow-700);
        border-color: var(--yellow-200);
      }

      .example-content {
        padding: var(--space-3) var(--space-4);
      }

      .example-content code {
        display: block;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        line-height: 1.6;
        white-space: pre-wrap;
        word-break: break-word;
        color: var(--text-color);
      }

      /* Tagged content */
      .example-content.tagged {
        padding: var(--space-2);
      }

      .tag-section {
        display: flex;
        gap: var(--space-3);
        padding: var(--space-2) var(--space-3);
        margin-bottom: var(--space-2);
        background: var(--surface-card);
        border-radius: var(--border-radius);
      }

      .tag-section:last-child {
        margin-bottom: 0;
      }

      .tag-label {
        flex-shrink: 0;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--border-radius);
        font-family: 'Fira Code', monospace;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .tag-content {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-color);
      }

      /* Tag colors */
      .tag-blue .tag-label {
        background: var(--blue-100);
        color: var(--blue-700);
      }
      .tag-green .tag-label {
        background: var(--green-100);
        color: var(--green-700);
      }
      .tag-orange .tag-label {
        background: var(--orange-100);
        color: var(--orange-700);
      }
      .tag-purple .tag-label {
        background: var(--purple-100);
        color: var(--purple-700);
      }
      .tag-teal .tag-label {
        background: var(--teal-100);
        color: var(--teal-700);
      }
      .tag-pink .tag-label {
        background: var(--pink-100);
        color: var(--pink-700);
      }

      /* CTM-2: Dark mode tag overrides */
      :host-context(.dark-theme) .tag-blue .tag-label {
        background: rgba(59, 130, 246, 0.15);
        color: var(--blue-400);
      }
      :host-context(.dark-theme) .tag-green .tag-label {
        background: rgba(16, 185, 129, 0.15);
        color: var(--green-400);
      }
      :host-context(.dark-theme) .tag-orange .tag-label {
        background: rgba(249, 115, 22, 0.15);
        color: var(--orange-400);
      }
      :host-context(.dark-theme) .tag-purple .tag-label {
        background: rgba(168, 85, 247, 0.15);
        color: var(--purple-400);
      }
      :host-context(.dark-theme) .tag-teal .tag-label {
        background: rgba(20, 184, 166, 0.15);
        color: var(--teal-400);
      }
      :host-context(.dark-theme) .tag-pink .tag-label {
        background: rgba(236, 72, 153, 0.15);
        color: var(--pink-400);
      }

      .copy-button {
        position: absolute;
        top: var(--space-2);
        right: var(--space-2);
        padding: var(--space-2);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        cursor: pointer;
        opacity: 0.6;
        transition: opacity 0.2s ease;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .prompt-example:hover .copy-button,
      .prompt-example:focus-within .copy-button,
      .copy-button:focus-visible {
        opacity: 1;
      }

      .copy-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .copy-button:hover {
        background: var(--surface-hover);
      }

      /* Transient copy feedback */
      .copy-button.copied {
        opacity: 1;
        border-color: var(--green-500);
        color: var(--green-600);
      }

      .copy-button.failed {
        opacity: 1;
        border-color: var(--red-500);
        color: var(--red-600);
      }

      @media print {
        .prompt-example {
          break-inside: avoid;
          background: white !important;
          border: 1px solid #ccc !important;
          border-left: 4px solid #999 !important;
        }

        .type-good {
          border-left-color: #16a34a !important;
        }
        .type-bad {
          border-left-color: #dc2626 !important;
        }
        .type-demo {
          border-left-color: #ca8a04 !important;
        }
        .type-neutral {
          border-left-color: #666 !important;
        }

        .example-header {
          background: #f9fafb !important;
          color: #111 !important;
          border-color: #e5e7eb !important;
        }

        .type-good .example-header {
          color: #166534 !important;
        }
        .type-bad .example-header {
          color: #991b1b !important;
        }
        .type-demo .example-header {
          color: #854d0e !important;
        }

        .example-content code {
          color: #111 !important;
        }

        .tag-label {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          border: 1px solid #ccc;
        }

        .tag-section {
          background: #f9fafb !important;
        }

        .copy-button {
          display: none !important;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptExampleComponent {
  private translationService = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  /** Transient copy feedback state, reset after a short delay. */
  copyStatus: 'idle' | 'success' | 'error' = 'idle';
  private statusTimer?: ReturnType<typeof setTimeout>;

  @Input() type: PromptExampleType = 'neutral';
  @Input() code?: string;
  @Input() codeKey?: string;
  @Input() label?: string;
  @Input() labelKey?: string;
  @Input() showIcon: boolean = true;
  @Input() copyable: boolean = false;
  @Input() tags?: PromptTag[];

  t(key: string): string {
    return this.translationService.translate(key);
  }

  getIconClass(): string {
    switch (this.type) {
      case 'good':
        return 'pi pi-check-circle';
      case 'bad':
        return 'pi pi-times-circle';
      case 'demo':
        return 'pi pi-code';
      default:
        return 'pi pi-info-circle';
    }
  }

  copyToClipboard(): void {
    // Guard against SSR / non-browser platforms where navigator is undefined.
    if (!isPlatformBrowser(this.platformId) || !navigator?.clipboard) {
      this.setCopyStatus('error');
      return;
    }

    const text = this.tags ? this.tags.map((t) => `${t.label} ${t.content || ''}`).join('\n') : this.code || '';

    navigator.clipboard
      .writeText(text)
      .then(() => this.setCopyStatus('success'))
      .catch(() => this.setCopyStatus('error'));
  }

  /** Show transient success/error feedback on the copy button (2s), then reset. */
  private setCopyStatus(status: 'success' | 'error'): void {
    this.copyStatus = status;
    this.cdr.markForCheck();
    if (this.statusTimer) clearTimeout(this.statusTimer);
    this.statusTimer = setTimeout(() => {
      this.copyStatus = 'idle';
      this.cdr.markForCheck();
    }, 2000);
  }
}
