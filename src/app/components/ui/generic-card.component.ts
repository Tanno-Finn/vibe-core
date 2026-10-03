/**
 * Generic Card Component
 *
 * A flexible, grid-based card component that can be used for displaying various types of content.
 * Uses CSS Grid for layout with a single container (no nested structures). Supports customizable
 * content areas for header, body, footer, and actions. Fully theme-compatible and accessible.
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  computed,
  inject,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { TranslationService } from '../../services/translation.service';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

// Optimus UI Imports
import { ButtonModule } from '@openng/optimus-ui/button';
import { ChipModule } from '@openng/optimus-ui/chip';
import { TagModule } from '@openng/optimus-ui/tag';
import { RatingModule } from '@openng/optimus-ui/rating';
import { TooltipModule } from '@openng/optimus-ui/tooltip';

export interface CardAction {
  icon?: string;
  label?: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'help' | 'danger' | 'contrast';
  outlined?: boolean;
  text?: boolean;
  size?: 'small' | 'large';
  tooltip?: string;
  styleClass?: string;
  action: () => void;
  disabled?: boolean;
}

export interface CardChip {
  label: string;
  style?: Record<string, string | number>;
  styleClass?: string;
  icon?: string;
  removable?: boolean;
}

@Component({
  selector: 'app-generic-card',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ButtonModule, ChipModule, TagModule, RatingModule, TooltipModule, CursorGlowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="generic-card"
      [class.hoverable]="hoverable"
      [class.selected]="selected"
      [class.elevated]="elevated"
      [style.border-color]="borderColor"
      [style.background]="backgroundColor"
      [style.--icon-color]="iconColor || 'var(--primary-color)'"
      [style.--cursor-glow-color]="iconColor || 'var(--primary-color)'"
      [attr.tabindex]="interactive ? 0 : null"
      [attr.role]="interactive ? 'button' : null"
      [attr.aria-label]="interactive ? ariaLabel : null"
      (click)="debugCardClick($event)"
      (keydown.enter)="onKeyActivate($event)"
      (keydown.space)="onKeyActivate($event)"
      appCursorGlow
    >
      <!-- Header Section -->
      @if (hasHeader()) {
        <header class="card-header">
          <div class="header-main">
            <div class="header-left">
              <!-- Icon and Title in same row -->
              @if (icon || title) {
                <div class="icon-title-row">
                  @if (icon) {
                    <i [class]="'pi ' + icon + ' card-icon'" [style.color]="iconColor || 'var(--primary-color)'"></i>
                  }
                  @if (title) {
                    @switch (headingLevel) {
                      @case (2) {
                        <h2 class="card-title">{{ title }}</h2>
                      }
                      @case (3) {
                        <h3 class="card-title">{{ title }}</h3>
                      }
                      @case (4) {
                        <h4 class="card-title">{{ title }}</h4>
                      }
                      @case (5) {
                        <h5 class="card-title">{{ title }}</h5>
                      }
                      @default {
                        <h6 class="card-title">{{ title }}</h6>
                      }
                    }
                  }
                </div>
              }
              <!-- Rating and Chips Container -->
              <div class="rating-chips-container">
                <!-- Rating -->
                @if (rating) {
                  <div class="card-rating" role="img" [attr.aria-label]="ratingLabel(rating)">
                    <div class="rating-stars" aria-hidden="true">
                      @for (star of [1, 2, 3, 4, 5]; track star) {
                        <i
                          class="pi"
                          [class.pi-star-fill]="star <= rating"
                          [class.pi-star]="star > rating"
                          [style]="{
                            color: star <= rating ? 'var(--primary-color)' : 'var(--control-border)',
                            'font-size': '0.9rem',
                          }"
                        ></i>
                      }
                    </div>
                    <span class="rating-text" aria-hidden="true">({{ rating }})</span>
                  </div>
                }
                <!-- Header Chips (Tags) -->
                @if (chips?.length) {
                  <div class="header-chips">
                    @for (chip of chips; track $index) {
                      <span
                        class="custom-chip"
                        [class]="'custom-chip' + (chip.styleClass ? ' ' + chip.styleClass : '')"
                        [style]="chip.style"
                        [attr.aria-label]="chip.label"
                      >
                        @if (chip.icon) {
                          <i [class]="'pi ' + chip.icon" class="chip-icon" aria-hidden="true"></i>
                        }
                        <span class="chip-text">{{ chip.label }}</span>
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
            <!-- Header Actions -->
            @if (headerActions?.length) {
              <div class="header-actions">
                @for (action of headerActions; track trackAction($index, action)) {
                  <p-button
                    [icon]="action.icon"
                    [label]="action.label"
                    [severity]="action.severity || 'secondary'"
                    [outlined]="action.outlined"
                    [text]="action.text"
                    [size]="action.size || 'small'"
                    [disabled]="action.disabled"
                    [styleClass]="action.styleClass"
                    [pTooltip]="action.tooltip"
                    [ariaLabel]="action.tooltip || action.label"
                    (click)="action.action(); $event.stopPropagation()"
                  ></p-button>
                }
              </div>
            }
          </div>
        </header>
      }

      <!-- Content Section -->
      @if (hasContent()) {
        <div class="card-content">
          <!-- Subtitle -->
          @if (subtitle) {
            <p class="card-subtitle">{{ subtitle }}</p>
          }
          <!-- Description -->
          @if (description) {
            <p class="card-description">{{ description }}</p>
          }
          <!-- Custom Content Template -->
          @if (customContent) {
            <ng-container *ngTemplateOutlet="customContent"></ng-container>
          }
        </div>
      }

      <!-- Metadata Section -->
      @if (hasMetadata()) {
        <section class="card-metadata">
          <!-- Meta Info -->
          @if (metaInfo?.length) {
            <div class="meta-info">
              @for (info of metaInfo; track $index) {
                <div class="meta-item">
                  @if (info.icon) {
                    <i [class]="'pi ' + info.icon + ' meta-icon'"></i>
                  }
                  @if (info.label) {
                    <span class="meta-label">{{ info.label }}:</span>
                  }
                  <span class="meta-value">{{ info.value }}</span>
                </div>
              }
            </div>
          }
        </section>
      }

      <!-- Footer Section -->
      @if (hasFooter()) {
        <footer class="card-footer">
          <!-- Primary Actions -->
          @if (primaryActions?.length) {
            <div class="primary-actions">
              <!-- WORKING SIMPLE ACTION BUTTONS -->
              @for (action of primaryActions; track trackAction($index, action)) {
                <button
                  class="p-button p-component p-button-primary"
                  [disabled]="action.disabled"
                  (click)="handleActionClick(action, $event)"
                >
                  @if (action.icon) {
                    <i [class]="'pi ' + action.icon"></i>
                  }
                  @if (action.label) {
                    <span>{{ action.label }}</span>
                  }
                </button>
              }
            </div>
          }
          <!-- Secondary Actions -->
          @if (secondaryActions?.length) {
            <div class="secondary-actions">
              <!-- WORKING SIMPLE ACTION BUTTONS -->
              @for (action of secondaryActions; track trackAction($index, action)) {
                <button
                  class="p-button p-component p-button-secondary p-button-outlined p-button-sm"
                  [disabled]="action.disabled"
                  (click)="handleActionClick(action, $event)"
                >
                  @if (action.icon) {
                    <i [class]="'pi ' + action.icon"></i>
                  }
                  @if (action.label) {
                    <span>{{ action.label }}</span>
                  }
                </button>
              }
            </div>
          }
          <!-- Custom Footer Template -->
          @if (customFooter) {
            <ng-container *ngTemplateOutlet="customFooter"></ng-container>
          }
        </footer>
      }
    </article>
  `,
  styles: [
    `
      app-generic-card .generic-card {
        /* CSS Grid Layout - Single Container */
        display: grid;
        grid-template-areas:
          'header'
          'content'
          'metadata'
          'footer';
        grid-template-rows: auto 1fr auto auto;

        /* Card Styling */
        background: var(--surface-card);
        border: 2px solid var(--surface-border);
        border-radius: var(--border-radius-lg);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

        /* Layout Properties */
        height: 100%;
        min-height: 200px;
        overflow: hidden;
        position: relative;

        /* Container Query Support */
        container-type: inline-size;

        /* Transitions */
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Interactive States */
      app-generic-card .generic-card.hoverable {
        cursor: pointer;
      }

      app-generic-card .generic-card.hoverable:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        border-color: var(--icon-color, var(--primary-color));
      }

      app-generic-card .generic-card.selected {
        border-color: var(--icon-color, var(--primary-color));
        box-shadow: 0 0 0 1px var(--icon-color, var(--primary-color));
      }

      app-generic-card .generic-card.elevated {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }

      /* Grid Areas */
      app-generic-card .card-header {
        grid-area: header;
        padding: 1.25rem 1.25rem 0 1.25rem;
      }

      app-generic-card .header-main {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
      }

      app-generic-card .card-content {
        grid-area: content;
        padding: 1rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        min-height: 0;
      }

      app-generic-card .card-metadata {
        grid-area: metadata;
        padding: 0 1.25rem 1rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      app-generic-card .card-footer {
        grid-area: footer;
        padding: 1rem 1.25rem 1.25rem 1.25rem;
        border-top: 1px solid var(--surface-border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        min-height: 3rem;
        flex-wrap: nowrap;
      }

      /* Header Content */
      app-generic-card .header-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 0; /* Prevent overflow */
      }

      app-generic-card .rating-chips-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      /* Header Chips Styling */
      app-generic-card .header-chips {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
      }

      app-generic-card .custom-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.75rem;
        border: 1px solid currentColor;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        line-height: 1.2;
        white-space: nowrap;
        color: var(--text-color-secondary);
        background: color-mix(in srgb, currentColor 8%, transparent);
        transition: all 0.2s ease;
      }

      app-generic-card .custom-chip:hover {
        border-color: var(--primary-color-fg);
        color: var(--text-color);
      }

      app-generic-card .chip-icon {
        font-size: 0.8rem;
        line-height: 1;
        display: flex;
        align-items: center;
      }

      app-generic-card .chip-text {
        line-height: 1.2;
      }

      app-generic-card .icon-title-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      app-generic-card .card-icon {
        font-size: 1.5rem;
        color: var(--icon-color, var(--primary-color));
        flex-shrink: 0;
      }

      app-generic-card .card-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        line-height: 1.3;
        word-wrap: break-word;
        flex: 1;
      }

      app-generic-card .card-rating {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      app-generic-card .rating-stars {
        display: flex;
        gap: 0.1rem;
      }

      app-generic-card .rating-text {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        font-weight: 500;
      }

      app-generic-card .header-actions {
        display: flex;
        gap: 0.25rem;
        flex-shrink: 0;
        align-self: flex-start;
      }

      /* Content Styling */
      app-generic-card .card-subtitle {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-color-secondary);
        line-height: 1.4;
      }

      app-generic-card .card-description {
        margin: 0;
        color: var(--text-color-secondary);
        line-height: 1.6;
        flex: 1;
        display: flex;
        align-items: flex-start;
      }

      /* Metadata Styling removed (chips moved to header) */

      app-generic-card .meta-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      app-generic-card .meta-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
      }

      app-generic-card .meta-icon {
        font-size: 0.875rem;
        color: var(--primary-color-fg);
        width: 1rem;
        text-align: center;
      }

      app-generic-card .meta-label {
        font-weight: 500;
        color: var(--text-color);
      }

      app-generic-card .meta-value {
        color: var(--text-color-secondary);
      }

      /* Footer Actions */
      app-generic-card .primary-actions {
        display: flex;
        gap: 0.5rem;
        flex: 1;
        align-items: center;
      }

      app-generic-card .primary-actions p-button {
        flex: 1;
        min-width: 0;
      }

      app-generic-card .secondary-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
        align-items: center;
      }

      /* Ensure buttons never wrap by making text smaller if needed */
      app-generic-card .card-footer .p-button .p-button-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      app-generic-card .card-footer .p-button {
        min-width: auto;
        max-width: none;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        app-generic-card .card-header {
          padding: 1rem 1rem 0 1rem;
          flex-direction: column;
          gap: 0.75rem;
          align-items: stretch;
        }

        app-generic-card .header-actions {
          align-self: flex-end;
        }

        app-generic-card .card-content {
          padding: 0.75rem 1rem;
        }

        app-generic-card .card-metadata {
          padding: 0 1rem 0.75rem 1rem;
        }

        app-generic-card .card-footer {
          padding: 0.75rem 1rem 1rem 1rem;
          flex-direction: row;
          gap: 0.5rem;
          align-items: center;
          min-height: 2.5rem;
        }

        app-generic-card .primary-actions {
          flex: 1;
          min-width: 0;
        }

        app-generic-card .secondary-actions {
          flex-shrink: 0;
        }

        /* Make button text smaller on mobile if needed */
        app-generic-card .card-footer .p-button .p-button-label {
          font-size: 0.85rem;
        }
      }

      /* Focus and Accessibility */
      app-generic-card .generic-card:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-generic-card .generic-card[tabindex]:focus {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* High Contrast Mode Support */
      @media (prefers-contrast: high) {
        app-generic-card .generic-card {
          border-width: 3px;
        }

        app-generic-card .card-footer {
          border-top-width: 2px;
        }
      }

      /* Container Queries for Card Responsiveness */
      @container (max-width: 400px) {
        app-generic-card .rating-chips-container {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        app-generic-card .card-rating {
          order: 1;
        }

        app-generic-card .header-chips {
          order: 2;
        }
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        app-generic-card .generic-card {
          transition: none;
        }

        app-generic-card .generic-card.hoverable:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class GenericCardComponent {
  // Injected services
  protected themeService = inject(ThemeService);
  protected translationService = inject(TranslationService);

  // Basic Properties
  @Input() title?: string;
  @Input() headingLevel: 2 | 3 | 4 | 5 | 6 = 3;
  @Input() subtitle?: string;
  @Input() description?: string;
  @Input() icon?: string;
  @Input() iconColor?: string;
  @Input() rating?: number;

  // Visual Properties
  @Input() hoverable = true;
  /**
   * Marks the whole card as an interactive control. When true, the host
   * <article> becomes keyboard-reachable (tabindex + role="button" + Enter/Space
   * activation) and exposes `ariaLabel`. Default false: the card is a passive
   * surface and only its child buttons are focusable. Set this when `cardClick`
   * is the primary interaction.
   */
  @Input() interactive = false;
  /** Accessible name for the card when `interactive` is true. */
  @Input() ariaLabel?: string;
  @Input() selected = false;
  @Input() elevated = false;
  @Input() borderColor?: string;
  @Input() backgroundColor?: string;

  // Content Arrays
  @Input() chips?: CardChip[];
  @Input() metaInfo?: { icon?: string; label?: string; value: string }[];
  @Input() headerActions?: CardAction[];
  @Input() primaryActions?: CardAction[];
  @Input() secondaryActions?: CardAction[];

  // Template References
  @ContentChild('customContent') customContent?: TemplateRef<unknown>;
  @ContentChild('customFooter') customFooter?: TemplateRef<unknown>;

  // Events
  @Output() cardClick = new EventEmitter<MouseEvent>();

  /** Accessible name of the star rating, e.g. "Rating: 4 of 5 stars" — translated. */
  ratingLabel(rating: number): string {
    return this.translationService.translate('ui.ratingLabel').replace('{{rating}}', String(rating));
  }

  // Computed visibility helpers
  hasHeader = computed(() => {
    return !!(
      this.title ||
      this.subtitle ||
      this.icon ||
      this.rating ||
      this.chips?.length ||
      this.headerActions?.length
    );
  });

  hasContent = computed(() => {
    return !!(this.subtitle || this.description || this.customContent);
  });

  hasMetadata = computed(() => {
    return !!this.metaInfo?.length;
  });

  hasFooter = computed(() => {
    return !!(this.primaryActions?.length || this.secondaryActions?.length || this.customFooter);
  });

  /**
   * Track function for actions
   */
  trackAction(index: number, action: CardAction): string {
    return (action.icon || '') + (action.label || '') + index.toString();
  }

  /**
   * Handle card click events
   */
  onCardClick(event: MouseEvent): void {
    if (this.hoverable) {
      this.cardClick.emit(event);
    }
  }

  /**
   * Handle card click wrapper
   */
  debugCardClick(event: MouseEvent): void {
    this.onCardClick(event);
  }

  /**
   * Keyboard activation for interactive cards. Enter/Space emit cardClick,
   * mirroring a native button. No-op unless `interactive` is set, so passive
   * cards keep their non-focusable behavior.
   */
  onKeyActivate(event: Event): void {
    if (!this.interactive) return;
    event.preventDefault();
    this.cardClick.emit(new MouseEvent('click'));
  }

  /**
   * Translation helper
   */
  protected translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Handle card action button clicks
   */
  handleActionClick(action: CardAction, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (action.action && typeof action.action === 'function') {
      action.action();
    }
  }
}
