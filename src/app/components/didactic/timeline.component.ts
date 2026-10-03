/**
 * TimelineComponent
 *
 * Reusable vertical timeline for displaying chronological events.
 * Extracted from EU-AI-ACT article for reuse across guides and articles.
 */
import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../services/translation.service';
import { HighlightDirective } from '../../directives/highlight.directive';

export interface TimelineEvent {
  /** Translation key for date display */
  dateKey?: string;
  /** Static date string (if not using i18n) */
  date?: string;
  /** Translation key for title */
  titleKey?: string;
  /** Static title (if not using i18n) */
  title?: string;
  /** Translation key for description */
  descriptionKey?: string;
  /** Static description (if not using i18n) */
  description?: string;
  /** Whether this event is in the past (affects styling) */
  past?: boolean;
  /** Optional icon class (Optimus UI icons) */
  icon?: string;
}

export type TimelineOrientation = 'vertical' | 'horizontal';
export type TimelineColor = 'primary' | 'success' | 'warning' | 'info';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [HighlightDirective],
  template: `
    <div class="timeline-wrapper" [class]="'timeline-' + orientation + ' timeline-' + color">
      <div class="timeline-container" role="list" [attr.tabindex]="orientation === 'horizontal' ? 0 : null">
        @for (event of events; track event; let i = $index; let last = $last) {
          <div class="timeline-item" role="listitem" [class.past]="event.past" [class.last]="last">
            <!-- Timeline Point -->
            <div class="timeline-point">
              @if (event.icon) {
                <i [class]="event.icon" aria-hidden="true"></i>
              }
              @if (!event.icon) {
                <span class="point-dot"></span>
              }
            </div>
            <!-- Timeline Content -->
            <div class="timeline-content">
              <div class="timeline-date" [class.past]="event.past">
                {{ event.dateKey ? t(event.dateKey) : event.date }}
              </div>
              @if (event.titleKey || event.title) {
                @switch (headingLevel) {
                  @case (2) {
                    <h2 class="timeline-title" [appHighlight]="event.titleKey ? t(event.titleKey) : event.title">
                      {{ event.titleKey ? t(event.titleKey) : event.title }}
                    </h2>
                  }
                  @case (3) {
                    <h3 class="timeline-title" [appHighlight]="event.titleKey ? t(event.titleKey) : event.title">
                      {{ event.titleKey ? t(event.titleKey) : event.title }}
                    </h3>
                  }
                  @case (4) {
                    <h4 class="timeline-title" [appHighlight]="event.titleKey ? t(event.titleKey) : event.title">
                      {{ event.titleKey ? t(event.titleKey) : event.title }}
                    </h4>
                  }
                  @case (5) {
                    <h5 class="timeline-title" [appHighlight]="event.titleKey ? t(event.titleKey) : event.title">
                      {{ event.titleKey ? t(event.titleKey) : event.title }}
                    </h5>
                  }
                  @default {
                    <h6 class="timeline-title" [appHighlight]="event.titleKey ? t(event.titleKey) : event.title">
                      {{ event.titleKey ? t(event.titleKey) : event.title }}
                    </h6>
                  }
                }
              }
              @if (event.descriptionKey || event.description) {
                <p [appHighlight]="event.descriptionKey ? t(event.descriptionKey) : event.description">
                  {{ event.descriptionKey ? t(event.descriptionKey) : event.description }}
                </p>
              }
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

      .timeline-wrapper {
        margin: var(--space-4) 0;
      }

      /* Vertical Timeline */
      .timeline-vertical .timeline-container {
        position: relative;
        padding-left: var(--space-6);
      }

      .timeline-vertical .timeline-container::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 0;
        bottom: 0;
        width: 3px;
        background: var(--timeline-color, var(--primary-color));
        border-radius: 2px;
      }

      .timeline-vertical .timeline-item {
        position: relative;
        padding-bottom: var(--space-5);
      }

      .timeline-vertical .timeline-item.last {
        padding-bottom: 0;
      }

      .timeline-vertical .timeline-point {
        position: absolute;
        left: calc(-1 * var(--space-6) - 1px);
        top: 4px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--timeline-color, var(--primary-color));
        border: 2px solid var(--surface-0);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }

      .timeline-vertical .timeline-point i {
        font-size: 0.6rem;
        color: var(--surface-0);
      }

      .timeline-vertical .timeline-point .point-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--surface-0);
      }

      .timeline-vertical .timeline-item.past .timeline-point {
        background: var(--green-500);
      }

      .timeline-content {
        background: var(--surface-card);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
      }

      .timeline-date {
        font-weight: 600;
        color: var(--timeline-color, var(--primary-color));
        margin-bottom: var(--space-2);
        font-size: 0.9rem;
      }

      .timeline-date.past {
        color: var(--green-500);
      }

      .timeline-content .timeline-title {
        margin: 0 0 var(--space-2) 0;
        font-size: 1.1rem;
        color: var(--text-color);
      }

      .timeline-content p {
        margin: 0;
        color: var(--text-color-secondary);
        line-height: 1.5;
      }

      /* Color Variants */
      .timeline-primary {
        --timeline-color: var(--primary-color-fg);
      }
      .timeline-success {
        --timeline-color: var(--green-500);
      }
      .timeline-warning {
        --timeline-color: var(--orange-500);
      }
      .timeline-info {
        --timeline-color: var(--blue-500);
      }

      /* Horizontal Timeline (for future use) */
      .timeline-horizontal .timeline-container {
        display: flex;
        overflow-x: auto;
        padding-bottom: var(--space-4);
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
      }

      .timeline-horizontal .timeline-container[tabindex] {
        outline: none;
      }

      .timeline-horizontal .timeline-container:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: var(--border-radius);
      }

      .timeline-horizontal .timeline-item {
        scroll-snap-align: start;
      }

      .timeline-horizontal .timeline-item {
        flex: 0 0 200px;
        padding: 0 var(--space-3);
        position: relative;
      }

      @media print {
        .timeline-item {
          break-inside: avoid;
        }

        .timeline-point,
        .timeline-point .point-dot {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .timeline-vertical .timeline-container::before {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Force horizontal to vertical for print */
        .timeline-horizontal .timeline-container {
          display: flex;
          flex-direction: column;
          overflow-x: visible;
          padding-left: var(--space-6);
          padding-bottom: 0;
        }

        .timeline-horizontal .timeline-item {
          flex: none;
          padding: 0 0 var(--space-5) 0;
        }
      }

      @container (max-width: 768px) {
        .timeline-vertical .timeline-container {
          padding-left: var(--space-5);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  private translationService = inject(TranslationService);

  @Input() events: TimelineEvent[] = [];
  @Input() orientation: TimelineOrientation = 'vertical';
  @Input() color: TimelineColor = 'primary';
  @Input() headingLevel: 2 | 3 | 4 | 5 | 6 = 3;

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
