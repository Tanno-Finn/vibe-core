/**
 * FrameworkCardsComponent
 *
 * Reusable letter-based framework cards (e.g., RACE, CRISPE, SMART).
 * Extracted from Prompting Guide for reuse across guides and articles.
 */
import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../services/translation.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

export interface FrameworkCard {
  /** The letter to display (e.g., 'R' for Role) */
  letter: string;
  /** Translation key for title */
  titleKey?: string;
  /** Static title */
  title?: string;
  /** Translation key for description */
  descriptionKey?: string;
  /** Static description */
  description?: string;
  /** Optional custom color */
  color?: string;
}

export type FrameworkColorScheme = 'rainbow' | 'primary' | 'monochrome' | 'custom';

// Rainbow colors for frameworks
const RAINBOW_COLORS = [
  'var(--blue-500)',
  'var(--green-500)',
  'var(--orange-500)',
  'var(--yellow-500)',
  'var(--teal-500)',
  'var(--p-pink-500)',
  'var(--p-cyan-500)',
  'var(--red-500)',
];

@Component({
  selector: 'app-framework-cards',
  standalone: true,
  imports: [HighlightDirective, CursorGlowDirective],
  template: `
    <div class="framework-cards-wrapper">
      <!-- Framework Name Header -->
      @if (frameworkName) {
        <div class="framework-header">
          <span class="framework-name">{{ frameworkName }}</span>
          @if (frameworkDescriptionKey || frameworkDescription) {
            <span class="framework-desc">
              {{ frameworkDescriptionKey ? t(frameworkDescriptionKey) : frameworkDescription }}
            </span>
          }
        </div>
      }

      <!-- Cards Grid -->
      <div class="cards-grid" [class]="'columns-' + columns">
        @for (card of cards; track card; let i = $index) {
          <div class="framework-card" [style.--card-color]="getCardColor(card, i)" appCursorGlow>
            <div class="card-letter" aria-hidden="true">
              {{ card.letter }}
            </div>
            <div class="card-content">
              @switch (headingLevel) {
                @case (2) {
                  <h2 class="card-title" [appHighlight]="card.titleKey ? t(card.titleKey) : card.title">
                    {{ card.titleKey ? t(card.titleKey) : card.title }}
                  </h2>
                }
                @case (3) {
                  <h3 class="card-title" [appHighlight]="card.titleKey ? t(card.titleKey) : card.title">
                    {{ card.titleKey ? t(card.titleKey) : card.title }}
                  </h3>
                }
                @case (4) {
                  <h4 class="card-title" [appHighlight]="card.titleKey ? t(card.titleKey) : card.title">
                    {{ card.titleKey ? t(card.titleKey) : card.title }}
                  </h4>
                }
                @case (5) {
                  <h5 class="card-title" [appHighlight]="card.titleKey ? t(card.titleKey) : card.title">
                    {{ card.titleKey ? t(card.titleKey) : card.title }}
                  </h5>
                }
                @default {
                  <h6 class="card-title" [appHighlight]="card.titleKey ? t(card.titleKey) : card.title">
                    {{ card.titleKey ? t(card.titleKey) : card.title }}
                  </h6>
                }
              }
              <p [appHighlight]="card.descriptionKey ? t(card.descriptionKey) : card.description">
                {{ card.descriptionKey ? t(card.descriptionKey) : card.description }}
              </p>
            </div>
          </div>
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

      .framework-cards-wrapper {
        margin: var(--space-4) 0;
      }

      .framework-header {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        margin-bottom: var(--space-4);
      }

      .framework-name {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color);
        letter-spacing: 0.1em;
      }

      .framework-desc {
        color: var(--text-color-secondary);
        font-size: 0.95rem;
      }

      .cards-grid {
        display: grid;
        gap: var(--space-3);
      }

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
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }

      .framework-card {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-4);
        background: var(--surface-card);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--surface-border);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        position: relative;
      }

      .framework-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .card-letter {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        background: var(--card-color, var(--primary-color));
        border-radius: var(--border-radius);
        align-self: center;
      }

      .card-content {
        flex: 1;
        min-width: 0;
      }

      .card-content .card-title {
        margin: 0 0 var(--space-2) 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        text-align: center;
      }

      .card-content p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
        /* Ragged right: justified text in a card this narrow opens rivers
           between words (SC 1.4.8 advises against it). */
        text-align: start;
      }

      @media print {
        .framework-cards-wrapper {
          break-inside: avoid;
        }

        .cards-grid {
          grid-template-columns: 1fr !important;
        }

        .framework-card {
          box-shadow: none !important;
          transform: none !important;
          break-inside: avoid;
          border: 1px solid #ccc;
        }

        .card-letter {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .framework-card {
          transition: none;
        }
      }

      @container (max-width: 768px) {
        .columns-2,
        .columns-3,
        .columns-4 {
          grid-template-columns: 1fr;
        }

        .framework-card {
          flex-direction: row;
          align-items: flex-start;
        }

        .card-letter {
          width: 40px;
          height: 40px;
          font-size: 1.25rem;
          align-self: auto;
        }

        .card-content .card-title {
          text-align: left;
        }

        .card-content p {
          text-align: left;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameworkCardsComponent {
  private translationService = inject(TranslationService);

  @Input() cards: FrameworkCard[] = [];
  @Input() frameworkName?: string;
  @Input() frameworkDescription?: string;
  @Input() frameworkDescriptionKey?: string;
  @Input() colorScheme: FrameworkColorScheme = 'rainbow';
  @Input() columns: 2 | 3 | 4 | 'auto' = 'auto';
  @Input() headingLevel: 2 | 3 | 4 | 5 | 6 = 3;

  t(key: string): string {
    return this.translationService.translate(key);
  }

  getCardColor(card: FrameworkCard, index: number): string {
    if (card.color) {
      return card.color;
    }

    switch (this.colorScheme) {
      case 'rainbow':
        return RAINBOW_COLORS[index % RAINBOW_COLORS.length];
      case 'primary':
        return 'var(--primary-color)';
      case 'monochrome':
        return 'var(--surface-500)';
      default:
        return 'var(--primary-color)';
    }
  }
}
