import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * SplitBarComponent
 *
 * Zeigt zwei einander ergänzende Anteile (z.B. Zugestimmt/Abgelehnt, Männer/Frauen,
 * Pro/Contra) als horizontaler Balken mit Tick-Marker an der Grenze.
 *
 * Design-Variante 6 aus dem Consent-Bar-Showcase:
 * - Hintergrund = rechte Farbe (durchgehend), Fill = linke Farbe (von links)
 * - Vertikaler Tick markiert die Grenze
 * - Labels darunter, links- bzw. rechtsbündig, in der jeweiligen Farbe
 *
 * Theme-Awareness:
 * - Default-Farben sind --semantic-green-fg / --semantic-red-fg (theme-adaptiv)
 * - Custom-Farben über Inputs überschreibbar (CSS-Werte oder var(...))
 *
 * Barrierefreiheit:
 * - role="progressbar" mit aria-valuenow/min/max
 * - aria-label kombiniert beide Werte
 * - Icons aria-hidden, Werte als Text lesbar
 */
@Component({
  selector: 'app-split-bar',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="split-bar-wrap" [style.--bar-left-color]="leftColor" [style.--bar-right-color]="rightColor">
      <div
        class="bar"
        role="progressbar"
        [attr.aria-valuenow]="leftValue"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-label]="effectiveAriaLabel"
      >
        <div class="fill" [style.width.%]="clampedValue"></div>
        <div class="marker" [style.left.%]="clampedValue" aria-hidden="true">
          <div class="tick"></div>
        </div>
      </div>
      <div class="labels">
        <span class="end left">
          @if (leftIcon) {
            <i [class]="leftIcon" aria-hidden="true"></i>
          }
          {{ leftLabel }}
          <strong>{{ clampedValue | number: '1.1-1' }}%</strong>
        </span>
        <span class="end right">
          <strong>{{ 100 - clampedValue | number: '1.1-1' }}%</strong>
          {{ rightLabel }}
          @if (rightIcon) {
            <i [class]="rightIcon" aria-hidden="true"></i>
          }
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      .split-bar-wrap {
        width: 100%;
        --bar-left-color: var(--semantic-green-fg);
        --bar-right-color: var(--semantic-red-fg);
      }

      .bar {
        position: relative;
        width: 100%;
        height: 8px;
        background: var(--bar-right-color);
        border-radius: 999px;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
      }

      .fill {
        position: absolute;
        inset: 0 auto 0 0;
        height: 100%;
        background: var(--bar-left-color);
        border-radius: 999px 0 0 999px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Beide Enden rund wenn Fill 0 oder 100% */
      .fill[style*='width: 100%'] {
        border-radius: 999px;
      }

      .marker {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
      }

      .tick {
        width: 4px;
        height: 22px;
        background: var(--text-color);
        border-radius: 2px;
        box-shadow: 0 0 0 2px var(--surface-card);
      }

      .labels {
        display: flex;
        justify-content: space-between;
        gap: var(--space-3);
        margin-top: var(--space-3);
        font-size: 0.875rem;
        flex-wrap: wrap;
      }

      .end {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-weight: 600;
      }

      .end strong {
        font-weight: 800;
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.005em;
      }

      .end.left {
        color: var(--bar-left-color);
      }
      .end.right {
        color: var(--bar-right-color);
      }

      .end i {
        font-size: 0.85em;
      }

      @media (prefers-reduced-motion: reduce) {
        .fill,
        .marker {
          transition: none !important;
        }
      }
    `,
  ],
})
export class SplitBarComponent {
  /** Anteil der linken Seite in Prozent (0-100). Rechte Seite = 100 - leftValue. */
  @Input({ required: true }) leftValue: number = 0;

  /** Label-Text der linken Seite (z.B. "Zugestimmt"). */
  @Input({ required: true }) leftLabel: string = '';

  /** Label-Text der rechten Seite (z.B. "Abgelehnt"). */
  @Input({ required: true }) rightLabel: string = '';

  /** Optionales PrimeIcon-Class für links (z.B. "pi pi-check"). */
  @Input() leftIcon?: string;

  /** Optionales PrimeIcon-Class für rechts (z.B. "pi pi-times"). */
  @Input() rightIcon?: string;

  /** CSS-Farbe für linke Seite. Default: theme-adaptiv green. */
  @Input() leftColor: string = 'var(--semantic-green-fg)';

  /** CSS-Farbe für rechte Seite. Default: theme-adaptiv red. */
  @Input() rightColor: string = 'var(--semantic-red-fg)';

  /** ARIA-Label für Screen-Reader. Default: kombiniert beide Labels und Werte. */
  @Input() ariaLabel?: string;

  get clampedValue(): number {
    return Math.max(0, Math.min(100, this.leftValue));
  }

  /**
   * Accessible name for the progressbar. Uses the explicit `ariaLabel` when
   * provided, otherwise builds a default that combines both labels and their
   * rounded percentages (e.g. "Zugestimmt 63%, Abgelehnt 37%").
   */
  get effectiveAriaLabel(): string {
    if (this.ariaLabel) return this.ariaLabel;
    const left = Math.round(this.clampedValue);
    const right = 100 - left;
    return `${this.leftLabel} ${left}%, ${this.rightLabel} ${right}%`;
  }
}
