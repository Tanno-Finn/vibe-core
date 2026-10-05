/**
 * IconGridComponent
 *
 * Reusable grid of icons with labels for category displays.
 * Extracted from EU-AI-ACT article for reuse across guides and articles.
 */
import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../services/translation.service';
import { HighlightDirective } from '../../directives/highlight.directive';

export interface IconGridItem {
  /** Optimus UI icon class */
  icon: string;
  /** Translation key for label */
  labelKey?: string;
  /** Static label */
  label?: string;
  /** Translation key for description (shown on hover or below) */
  descriptionKey?: string;
  /** Static description */
  description?: string;
  /** Optional badge/tag text */
  badge?: string;
  /** Badge color */
  badgeColor?: 'success' | 'warning' | 'danger' | 'info';
}

export type IconGridSize = 'small' | 'medium' | 'large';
export type IconGridColor = 'primary' | 'orange' | 'green' | 'blue' | 'pink' | 'teal';

@Component({
  selector: 'app-icon-grid',
  standalone: true,
  imports: [HighlightDirective],
  template: `
    <div class="icon-grid" [class]="'size-' + size + ' color-' + color + ' columns-' + columns">
      @for (item of items; track item) {
        <!-- No native title: hover-only text reaches neither touch nor
             keyboard. The description renders visibly via showDescriptions. -->
        <div class="grid-item">
          <div class="item-icon">
            <i [class]="item.icon" aria-hidden="true"></i>
          </div>
          <div class="item-content">
            <span class="item-label" [appHighlight]="item.labelKey ? t(item.labelKey) : item.label">
              {{ item.labelKey ? t(item.labelKey) : item.label }}
            </span>
            @if (showDescriptions && (item.descriptionKey || item.description)) {
              <span
                class="item-description"
                [appHighlight]="item.descriptionKey ? t(item.descriptionKey) : item.description"
              >
                {{ item.descriptionKey ? t(item.descriptionKey) : item.description }}
              </span>
            }
            @if (!showDescriptions && (item.descriptionKey || item.description)) {
              <span class="sr-only">{{ item.descriptionKey ? t(item.descriptionKey) : item.description }}</span>
            }
          </div>
          @if (item.badge) {
            <span class="item-badge" [class]="'badge-' + (item.badgeColor || 'info')">
              {{ item.badge }}
            </span>
          }
        </div>
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
        margin-block: var(--space-4);
      }

      .icon-grid {
        display: grid;
        gap: var(--space-3);
      }

      /* Column variants */
      .columns-2 {
        grid-template-columns: repeat(2, 1fr);
      }
      .columns-3 {
        grid-template-columns: repeat(3, 1fr);
      }
      .columns-4 {
        grid-template-columns: repeat(4, 1fr);
      }
      .columns-auto {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }

      .grid-item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3);
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        position: relative;
      }

      .grid-item:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .item-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: var(--border-radius);
        background: var(--icon-bg, var(--accent-surface));
      }

      .item-icon i {
        font-size: 1.1rem;
        color: var(--icon-color, var(--accent-on-surface));
      }

      .item-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }

      .item-label {
        font-weight: 500;
        color: var(--text-color);
        font-size: 0.9rem;
      }

      .item-description {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        line-height: 1.4;
      }

      .item-badge {
        position: absolute;
        top: var(--space-1);
        right: var(--space-1);
        padding: 2px 6px;
        font-size: 0.7rem;
        font-weight: 600;
        border-radius: var(--border-radius);
      }

      .badge-success {
        background: var(--green-100);
        color: var(--green-700);
      }
      .badge-warning {
        background: var(--orange-100);
        color: var(--orange-700);
      }
      .badge-danger {
        background: var(--red-100);
        color: var(--red-700);
      }
      .badge-info {
        background: var(--blue-100);
        color: var(--blue-700);
      }

      /* Size variants */
      .size-small .grid-item {
        padding: var(--space-2);
      }
      .size-small .item-icon {
        width: 28px;
        height: 28px;
      }
      .size-small .item-icon i {
        font-size: 0.9rem;
      }
      .size-small .item-label {
        font-size: 0.85rem;
      }

      .size-large .grid-item {
        padding: var(--space-4);
      }
      .size-large .item-icon {
        width: 48px;
        height: 48px;
      }
      .size-large .item-icon i {
        font-size: 1.4rem;
      }
      .size-large .item-label {
        font-size: 1rem;
      }

      /* Color variants */
      .color-primary .item-icon {
        --icon-bg: var(--accent-surface);
        --icon-color: var(--accent-on-surface);
      }
      .color-orange .item-icon {
        --icon-bg: var(--orange-100);
        --icon-color: var(--orange-500);
      }
      .color-green .item-icon {
        --icon-bg: var(--green-100);
        --icon-color: var(--green-500);
      }
      .color-blue .item-icon {
        --icon-bg: var(--blue-100);
        --icon-color: var(--blue-500);
      }
      .color-pink .item-icon {
        --icon-bg: var(--p-pink-100);
        --icon-color: var(--p-pink-500);
      }
      .color-teal .item-icon {
        --icon-bg: var(--teal-100);
        --icon-color: var(--teal-500);
      }

      :host-context(.dark-theme) .color-primary .item-icon {
        --icon-bg: var(--accent-surface);
        --icon-color: var(--accent-on-surface);
      }
      :host-context(.dark-theme) .color-orange .item-icon {
        --icon-bg: rgba(var(--orange-500-rgb), 0.2);
      }
      :host-context(.dark-theme) .color-green .item-icon {
        --icon-bg: rgba(var(--green-500-rgb), 0.2);
      }
      :host-context(.dark-theme) .color-blue .item-icon {
        --icon-bg: rgba(var(--blue-500-rgb), 0.2);
      }
      :host-context(.dark-theme) .color-pink .item-icon {
        --icon-bg: color-mix(in srgb, var(--p-pink-500) 20%, transparent);
      }
      :host-context(.dark-theme) .color-teal .item-icon {
        --icon-bg: rgba(var(--teal-500-rgb), 0.2);
      }

      @media (prefers-reduced-motion: reduce) {
        .grid-item {
          transition: none;
        }
      }

      @container (max-width: 768px) {
        .columns-2,
        .columns-3,
        .columns-4 {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @container (max-width: 480px) {
        .columns-2,
        .columns-3,
        .columns-4 {
          grid-template-columns: 1fr;
        }

        .item-badge {
          position: static;
          align-self: flex-start;
          margin-top: var(--space-1);
        }
      }

      /* Print-friendly styles */
      @media print {
        /* Limit grid width for print */
        .icon-grid {
          page-break-inside: avoid;
        }

        /* Force max 2 columns for print width */
        .columns-2,
        .columns-3,
        .columns-4,
        .columns-auto {
          grid-template-columns: repeat(2, 1fr) !important;
        }

        /* Remove hover effects and shadows */
        .grid-item {
          page-break-inside: avoid;
          background: transparent !important;
          border: 1px solid #999 !important;
          box-shadow: none !important;
          transition: none;
        }

        .grid-item:hover {
          box-shadow: none !important;
          transform: none;
        }

        /* Simplify icon box */
        .item-icon {
          background: transparent !important;
          border: 1px solid #999;
          border-radius: 0;
        }

        .item-icon i {
          color: #000 !important;
        }

        /* Text styling for print */
        .item-label {
          color: #000;
          font-weight: 700;
        }

        .item-description {
          color: #666;
          display: block;
        }

        /* Reposition badges to static for print */
        .item-badge {
          position: static !important;
          align-self: flex-start;
          margin-top: var(--space-1);
          margin-left: auto;
          background: transparent !important;
          color: #000 !important;
          border: 1px solid #999;
          border-radius: 2px;
        }

        .badge-success {
          background: transparent !important;
          color: #0a0 !important;
          border-color: #0a0;
        }
        .badge-warning {
          background: transparent !important;
          color: #aa0 !important;
          border-color: #aa0;
        }
        .badge-danger {
          background: transparent !important;
          color: #a00 !important;
          border-color: #a00;
        }
        .badge-info {
          background: transparent !important;
          color: #06f !important;
          border-color: #06f;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconGridComponent {
  private translationService = inject(TranslationService);

  @Input() items: IconGridItem[] = [];
  @Input() size: IconGridSize = 'medium';
  @Input() color: IconGridColor = 'primary';
  @Input() columns: 2 | 3 | 4 | 'auto' = 'auto';
  @Input() showDescriptions: boolean = false;

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
