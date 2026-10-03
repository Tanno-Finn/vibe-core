/**
 * StatCardComponent
 *
 * Modern metric display card with multiple visual variants.
 * For dashboards, algorithm stats, and educational data displays.
 */
import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../services/translation.service';
import { formatNumberFor, numberLocaleFor } from '../../utils/date-locale';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

export type StatTrend = 'up' | 'down' | 'neutral';
export type StatVariant = 'default' | 'gradient' | 'outlined' | 'minimal';
export type StatColor = 'primary' | 'blue' | 'green' | 'orange' | 'purple' | 'teal' | 'red';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CursorGlowDirective],
  template: `
    <div
      class="stat-card"
      [class]="'variant-' + variant + ' color-' + color"
      [class.with-icon]="!!icon"
      [class.highlighted]="highlighted"
      [class.compact]="compact"
      appCursorGlow
    >
      <!-- Icon -->
      @if (icon) {
        <div class="stat-icon">
          <i [class]="icon" aria-hidden="true"></i>
        </div>
      }

      <!-- Main Content -->
      <div class="stat-main">
        <!-- Value Row -->
        <div class="value-row">
          <span class="stat-value">{{ prefix }}{{ formattedValue }}{{ suffix }}</span>
          @if (trend && trend !== 'neutral') {
            <span class="trend-badge" [class]="'trend-' + trend">
              <i
                class="pi"
                [class.pi-arrow-up]="trend === 'up'"
                [class.pi-arrow-down]="trend === 'down'"
                aria-hidden="true"
              ></i>
              <span class="sr-only">{{ trend === 'up' ? t('stat.trendUp') : t('stat.trendDown') }}</span>
              @if (trendValue) {
                <span>{{ trendValue }}</span>
              }
            </span>
          }
        </div>

        <!-- Label -->
        <span class="stat-label">{{ labelKey ? t(labelKey) : label }}</span>

        <!-- Description -->
        @if (descriptionKey || description) {
          <span class="stat-desc">
            {{ descriptionKey ? t(descriptionKey) : description }}
          </span>
        }
      </div>

      <!-- Progress Bar -->
      @if (showProgress) {
        <div class="progress-wrap">
          <div
            class="progress-track"
            role="progressbar"
            [attr.aria-valuenow]="progressValue"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-label]="labelKey ? t(labelKey) : label"
          >
            <div class="progress-fill" [style.width.%]="progressValue"></div>
          </div>
          @if (progressLabel) {
            <span class="progress-label">{{ progressLabel }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      /* ═══════════════════════════════════════════════════════════════
       BASE CARD
       ═══════════════════════════════════════════════════════════════ */
      .stat-card {
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 16px;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .stat-card:hover {
      }

      /* ═══════════════════════════════════════════════════════════════
       VARIANT: DEFAULT
       ═══════════════════════════════════════════════════════════════ */
      .variant-default {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
      }

      .variant-default:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }

      /* ═══════════════════════════════════════════════════════════════
       VARIANT: GRADIENT - Direct background colors
       ═══════════════════════════════════════════════════════════════ */
      .variant-gradient {
        border: none;
      }

      .variant-gradient.color-primary {
        background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      }
      .variant-gradient.color-blue {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      }
      .variant-gradient.color-green {
        background: linear-gradient(135deg, #15803d 0%, #166534 100%);
      }
      .variant-gradient.color-orange {
        background: linear-gradient(135deg, #c2410c 0%, #9a3412 100%);
      }
      .variant-gradient.color-purple {
        background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
      }
      .variant-gradient.color-teal {
        background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
      }
      .variant-gradient.color-red {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }

      .variant-gradient:hover {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
      }

      /* Gradient text colors - all white */
      .variant-gradient .stat-value,
      .variant-gradient .stat-label,
      .variant-gradient .stat-desc,
      .variant-gradient .stat-icon i,
      .variant-gradient .progress-label {
        color: white;
      }

      .variant-gradient .stat-label,
      .variant-gradient .stat-desc {
        opacity: 1;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .variant-gradient .stat-icon {
        background: rgba(255, 255, 255, 0.2);
      }

      .variant-gradient .trend-badge {
        background: rgba(255, 255, 255, 0.25);
        color: white;
      }

      .variant-gradient .progress-track {
        background: rgba(255, 255, 255, 0.25);
      }

      .variant-gradient .progress-fill {
        background: rgba(255, 255, 255, 0.9);
      }

      /* ═══════════════════════════════════════════════════════════════
       VARIANT: OUTLINED
       ═══════════════════════════════════════════════════════════════ */
      .variant-outlined {
        background: transparent;
        border: 2px solid var(--surface-300);
      }

      .variant-outlined.color-primary {
        border-color: var(--primary-400);
      }
      .variant-outlined.color-blue {
        border-color: #60a5fa;
      }
      .variant-outlined.color-green {
        border-color: #4ade80;
      }
      .variant-outlined.color-orange {
        border-color: #fb923c;
      }
      .variant-outlined.color-purple {
        border-color: #c084fc;
      }
      .variant-outlined.color-teal {
        border-color: #2dd4bf;
      }
      .variant-outlined.color-red {
        border-color: #f87171;
      }

      /* --surface-50 flips to a subtle dark tint (#1e293b) in dark mode, so this
       base rule gives the correct hover in BOTH themes. Do not add a
       dark-theme override to --surface-800: that token flips to near-white
       (#f8fafc), producing a light background under light text → unreadable. */
      .variant-outlined:hover {
        background: var(--surface-50);
      }

      /* ═══════════════════════════════════════════════════════════════
       VARIANT: MINIMAL
       ═══════════════════════════════════════════════════════════════ */
      .variant-minimal {
        background: transparent;
        padding: 16px 0;
        border-radius: 0;
        border-bottom: 1px solid var(--surface-200);
      }

      .variant-minimal:hover {
        background: var(--surface-50);
        padding-left: 16px;
        margin-left: -16px;
        padding-right: 16px;
        margin-right: -16px;
        border-radius: 12px;
        border-bottom-color: transparent;
      }

      :host-context(.dark-theme) .variant-minimal {
        border-bottom-color: var(--surface-700);
      }
      /* No dark-theme hover override here either — the base rule's --surface-50
       already flips to a subtle dark tint. --surface-800 would flip to
       near-white and make the text unreadable (same bug as variant-outlined). */

      /* ═══════════════════════════════════════════════════════════════
       ICON
       ═══════════════════════════════════════════════════════════════ */
      .stat-icon {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: var(--surface-100);
        transition: transform 0.2s ease;
      }

      .stat-card:hover .stat-icon {
        transform: scale(1.05);
      }

      .stat-icon i {
        font-size: 1.2rem;
        color: var(--text-color-secondary);
      }

      /* Icon colors by variant */
      .variant-default.color-primary .stat-icon {
        background: var(--primary-50);
      }
      .variant-default.color-primary .stat-icon i {
        color: var(--primary-500);
      }
      .variant-default.color-blue .stat-icon {
        background: #eff6ff;
      }
      .variant-default.color-blue .stat-icon i {
        color: #3b82f6;
      }
      .variant-default.color-green .stat-icon {
        background: #f0fdf4;
      }
      .variant-default.color-green .stat-icon i {
        color: #22c55e;
      }
      .variant-default.color-orange .stat-icon {
        background: #fff7ed;
      }
      .variant-default.color-orange .stat-icon i {
        color: #f97316;
      }
      .variant-default.color-purple .stat-icon {
        background: #faf5ff;
      }
      .variant-default.color-purple .stat-icon i {
        color: #a855f7;
      }
      .variant-default.color-teal .stat-icon {
        background: #f0fdfa;
      }
      .variant-default.color-teal .stat-icon i {
        color: #14b8a6;
      }
      .variant-default.color-red .stat-icon {
        background: #fef2f2;
      }
      .variant-default.color-red .stat-icon i {
        color: #ef4444;
      }

      :host-context(.dark-theme) .variant-default .stat-icon,
      :host-context(.dark-theme) .variant-outlined .stat-icon {
        background: var(--surface-700);
      }

      .variant-minimal .stat-icon {
        position: static;
        margin-bottom: 12px;
        width: 40px;
        height: 40px;
      }

      /* ═══════════════════════════════════════════════════════════════
       MAIN CONTENT
       ═══════════════════════════════════════════════════════════════ */
      .stat-main {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .with-icon:not(.variant-minimal):not(.variant-gradient) .stat-main {
        padding-right: 52px;
      }

      .value-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-color);
        line-height: 1.1;
        letter-spacing: -0.02em;
      }

      .stat-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-color-secondary);
        margin-top: 4px;
      }

      .stat-desc {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      /* ═══════════════════════════════════════════════════════════════
       TREND BADGE
       ═══════════════════════════════════════════════════════════════ */
      .trend-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .trend-up {
        background: rgba(34, 197, 94, 0.12);
        color: #16a34a;
      }

      .trend-down {
        background: rgba(239, 68, 68, 0.12);
        color: #dc2626;
      }

      :host-context(.dark-theme) .trend-up {
        background: rgba(34, 197, 94, 0.2);
        color: #4ade80;
      }

      :host-context(.dark-theme) .trend-down {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
      }

      .trend-badge i {
        font-size: 0.7rem;
      }

      /* ═══════════════════════════════════════════════════════════════
       PROGRESS BAR
       ═══════════════════════════════════════════════════════════════ */
      .progress-wrap {
        margin-top: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .progress-track {
        flex: 1;
        height: 6px;
        background: var(--surface-200);
        border-radius: 3px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 3px;
        transition: width 0.5s ease;
      }

      .color-primary .progress-fill {
        background: var(--primary-500);
      }
      .color-blue .progress-fill {
        background: #3b82f6;
      }
      .color-green .progress-fill {
        background: #22c55e;
      }
      .color-orange .progress-fill {
        background: #f97316;
      }
      .color-purple .progress-fill {
        background: #a855f7;
      }
      .color-teal .progress-fill {
        background: #14b8a6;
      }
      .color-red .progress-fill {
        background: #ef4444;
      }

      .progress-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-color-secondary);
        min-width: 32px;
        text-align: right;
      }

      /* ═══════════════════════════════════════════════════════════════
       COMPACT
       ═══════════════════════════════════════════════════════════════ */
      .compact {
        padding: 14px 16px;
      }

      .compact .stat-value {
        font-size: 1.5rem;
      }

      .compact .stat-icon {
        width: 36px;
        height: 36px;
      }

      .compact .stat-icon i {
        font-size: 1rem;
      }

      /* ═══════════════════════════════════════════════════════════════
       HIGHLIGHTED
       ═══════════════════════════════════════════════════════════════ */
      .highlighted {
        box-shadow: 0 0 0 2px var(--primary-color);
      }

      /* ═══════════════════════════════════════════════════════════════
       RESPONSIVE
       ═══════════════════════════════════════════════════════════════ */
      @media print {
        .stat-card {
          box-shadow: none !important;
          transform: none !important;
          break-inside: avoid;
        }

        /* Gradient → flat white card with colored left border */
        .variant-gradient {
          background: white !important;
          border: 1px solid #ccc !important;
          border-left: 4px solid #666 !important;
        }
        .variant-gradient.color-primary {
          border-left-color: var(--primary-500, #f59e0b) !important;
        }
        .variant-gradient.color-blue {
          border-left-color: #3b82f6 !important;
        }
        .variant-gradient.color-green {
          border-left-color: #15803d !important;
        }
        .variant-gradient.color-orange {
          border-left-color: #c2410c !important;
        }
        .variant-gradient.color-purple {
          border-left-color: #a855f7 !important;
        }
        .variant-gradient.color-teal {
          border-left-color: #0f766e !important;
        }
        .variant-gradient.color-red {
          border-left-color: #ef4444 !important;
        }

        .variant-gradient .stat-value {
          color: #111 !important;
        }
        .variant-gradient .stat-label,
        .variant-gradient .stat-desc,
        .variant-gradient .progress-label {
          color: #444 !important;
          text-shadow: none !important;
          opacity: 1 !important;
        }
        .variant-gradient .stat-icon {
          background: #f3f4f6 !important;
        }
        .variant-gradient .stat-icon i {
          color: #333 !important;
        }
        .variant-gradient .trend-badge {
          background: #f3f4f6 !important;
          color: #333 !important;
        }

        /* Progress bar: solid fill for print */
        .variant-gradient .progress-track {
          background: #e5e7eb !important;
        }
        .variant-gradient .progress-fill {
          background: #666 !important;
        }

        /* Trend badges: solid backgrounds */
        .trend-up {
          background: #dcfce7 !important;
          color: #166534 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .trend-down {
          background: #fee2e2 !important;
          color: #991b1b !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Progress fill: print colors */
        .progress-fill {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .progress-track {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Icon backgrounds */
        .stat-icon {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* Highlighted: border instead of box-shadow */
        .highlighted {
          box-shadow: none !important;
          border: 2px solid var(--primary-color, #f59e0b) !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .stat-card,
        .stat-card *,
        .progress-fill {
          transition: none;
          animation: none;
        }
      }

      @media (max-width: 640px) {
        .stat-card {
          padding: 16px;
        }

        .stat-value {
          font-size: 1.75rem;
        }

        .stat-icon {
          width: 38px;
          height: 38px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  private translationService = inject(TranslationService);

  @Input() label?: string;
  @Input() labelKey?: string;
  @Input() value: number | string = 0;
  @Input() description?: string;
  @Input() descriptionKey?: string;
  @Input() icon?: string;
  @Input() color: StatColor = 'primary';
  @Input() variant: StatVariant = 'default';
  @Input() trend?: StatTrend;
  @Input() trendValue?: string;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() decimals: number = 0;
  @Input() highlighted: boolean = false;
  @Input() compact: boolean = false;
  @Input() showProgress: boolean = false;
  @Input() progressValue: number = 0;
  @Input() progressLabel?: string;

  get formattedValue(): string {
    if (typeof this.value === 'string') {
      return this.value;
    }
    // In the page language (grouping, decimal separator), never the browser's.
    const language = this.translationService.currentLanguage;
    if (this.decimals > 0) {
      return formatNumberFor(this.value, language, this.decimals);
    }
    return this.value.toLocaleString(numberLocaleFor(language));
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
