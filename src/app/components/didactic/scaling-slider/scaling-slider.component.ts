/**
 * ScalingSliderComponent
 *
 * One slider, several growth curves: the reader drags the input size `n` and
 * watches how differently constant, linear and quadratic work grow. Bars sit
 * on a fixed logarithmic scale, and a table below puts every curve in relation
 * to one chosen reference curve.
 *
 * The widget owns the maths and its table chrome (`scalingSlider.*`). What the
 * caller supplies through `config` is the subject: which curves are shown,
 * what they are called, which one is the reference, and a `translationPrefix`
 * for the four banded insight texts — so the same slider can talk about
 * sorting in one article and about a context budget in the next.
 *
 * The bar scale is fixed to the worst case at `sliderMax`, not to the current
 * maximum: with a moving ceiling every bar would look equally full at every n,
 * which is the opposite of the point being made.
 *
 * SSR-safe: no timers and no browser globals — the slider is a plain range
 * input, so an embedding page prerenders at the default n.
 */
import { Component, ChangeDetectionStrategy, signal, computed, input, inject } from '@angular/core';

import { TranslationService } from '../../../services/translation.service';
import { formatNumberFor } from '../../../utils/date-locale';

/** The growth curves the widget knows how to compute. */
export type ScalingCurveType = 'constant' | 'logarithmic' | 'linear' | 'nlogn' | 'quadratic' | 'cubic';

/** One curve in the bar chart and in the ratio table. */
export interface ScalingCurve {
  /** Which growth function to evaluate. */
  type: ScalingCurveType;
  /** i18n key for the curve's name — mathematical notation or plain words. */
  labelKey: string;
  /** Design-token color for the bar. */
  color: string;
}

/** Configuration for one embedded slider. */
export interface ScalingSliderConfig {
  /** Slider bounds and starting position. */
  sliderMin: number;
  sliderMax: number;
  defaultN: number;
  /** The curve every ratio is measured against. Must appear in `curves`. */
  referenceCurve: ScalingCurveType;
  /** Curves in display order, cheapest first by convention. */
  curves: ScalingCurve[];
  /**
   * i18n prefix for the insight box. For each of the four bands — `small`,
   * `moderate`, `large`, `veryLarge` — `<prefix>.insight.<band>.title` and
   * `<prefix>.insight.<band>.description` must exist. The description may use
   * `{{n}}`, `{{reference}}`, `{{worst}}` and `{{factor}}`.
   */
  translationPrefix: string;
}

/** Growth functions. `Math.max(1, n)` keeps log2 defined at the slider floor. */
const CURVE_FUNCTIONS: Record<ScalingCurveType, (n: number) => number> = {
  constant: () => 1,
  logarithmic: (n) => Math.log2(Math.max(1, n)),
  linear: (n) => n,
  nlogn: (n) => n * Math.log2(Math.max(1, n)),
  quadratic: (n) => n * n,
  cubic: (n) => n * n * n,
};

/** Band thresholds for the insight text, in units of n. */
const BAND_SMALL = 10;
const BAND_MODERATE = 100;
const BAND_LARGE = 500;

/** Deterministic instance counter — a random id would differ between the
 *  server render and the hydrated one. */
let instanceCounter = 0;

@Component({
  selector: 'app-scaling-slider',
  standalone: true,
  imports: [],
  template: `
    <div class="scaling">
      <!-- The one control -->
      <div class="slider-section">
        <label [attr.for]="sliderId">
          {{ translate('scalingSlider.label.inputSize') }} <strong>{{ n() }}</strong>
        </label>
        <input
          [id]="sliderId"
          type="range"
          class="slider"
          [min]="config().sliderMin"
          [max]="config().sliderMax"
          [value]="n()"
          (input)="onSliderInput($event)"
        />
        <div class="slider-labels">
          <span>{{ config().sliderMin }}</span>
          <span>{{ config().sliderMax }}</span>
        </div>
      </div>

      <!-- One bar per curve, on a shared logarithmic scale -->
      <div class="bars-section">
        @for (curve of config().curves; track curve.type) {
          <div class="bar-row">
            <div class="bar-label">
              <span class="curve-name">{{ translate(curve.labelKey) }}</span>
              <span class="curve-value">{{ formatValue(curve.type) }}</span>
            </div>
            <div class="bar-track">
              <div class="bar" [style.width.%]="barWidth(curve.type)" [style.background]="curve.color"></div>
            </div>
          </div>
        }
      </div>

      <!-- What the current n actually means -->
      <div class="insight-box" aria-live="polite">
        <strong>{{ insightTitle() }}</strong>
        <p>{{ insightText() }}</p>
      </div>

      <!-- The same numbers as a table, for readers who prefer them -->
      <div class="ratio-section">
        <h3>{{ translate('scalingSlider.ratio.title') }}</h3>
        <div class="table-scroll">
          <table class="ratio-table">
            <thead>
              <tr>
                <th scope="col">{{ translate('scalingSlider.ratio.curve') }}</th>
                <th scope="col">{{ translate('scalingSlider.ratio.operations') }}</th>
                <th scope="col">{{ translate('scalingSlider.ratio.factor') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (curve of config().curves; track curve.type) {
                <tr>
                  <td>{{ translate(curve.labelKey) }}</td>
                  <td>{{ formatValue(curve.type) }}</td>
                  @if (isReference(curve.type)) {
                    <td>{{ translate('scalingSlider.ratio.reference') }}</td>
                  } @else {
                    <td>
                      {{ ratio(curve.type) }}&times;
                      {{
                        isCheaper(curve.type)
                          ? translate('scalingSlider.ratio.cheaper')
                          : translate('scalingSlider.ratio.costlier')
                      }}
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
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

      .scaling {
        display: block;
      }

      /* ── Control ── */
      .slider-section {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      }

      .slider-section label {
        display: block;
        font-size: 1.05rem;
        margin-bottom: 0.75rem;
        color: var(--text-color);
      }

      .slider {
        width: 100%;
        height: 8px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 4px;
        outline: none;
        cursor: pointer;
      }

      .slider:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 3px;
      }

      .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        background: var(--primary-color);
        border: 2px solid var(--surface-card);
        border-radius: 50%;
        cursor: pointer;
      }

      .slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        background: var(--primary-color);
        border: 2px solid var(--surface-card);
        border-radius: 50%;
        cursor: pointer;
      }

      .slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        margin-top: 0.25rem;
      }

      /* ── Bars ── */
      .bars-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .bar-row {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .bar-label {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 0.75rem;
        font-size: 0.9rem;
      }

      .curve-name {
        font-weight: 600;
        color: var(--text-color);
      }

      .curve-value {
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 0.85rem;
        color: var(--text-color);
      }

      .bar-track {
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 4px;
        height: 28px;
        overflow: hidden;
      }

      .bar {
        height: 100%;
        border-radius: 3px;
        transition: width 0.15s ease-out;
        min-width: 2px;
      }

      /* ── Insight ── */
      .insight-box {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        border-radius: 0 8px 8px 0;
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
      }

      .insight-box strong {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }

      .insight-box p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }

      /* ── Table ── */
      .ratio-section {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1.25rem;
      }

      .ratio-section h3 {
        margin: 0 0 1rem;
        font-size: 1rem;
        color: var(--text-color);
      }

      .table-scroll {
        overflow-x: auto;
      }

      .ratio-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        color: var(--text-color);
      }

      .ratio-table th,
      .ratio-table td {
        padding: 0.5rem 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--surface-border);
      }

      .ratio-table th {
        font-weight: 600;
        color: var(--text-color-secondary);
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      .ratio-table td:nth-child(2) {
        font-family: 'Fira Code', 'Consolas', monospace;
      }

      @container (max-width: 480px) {
        .slider-section {
          padding: 1rem;
        }
        .ratio-table th,
        .ratio-table td {
          padding: 0.4rem 0.5rem;
          font-size: 0.8rem;
        }
      }

      /* Print: the slider itself is meaningless on paper, but the bars at the
       printed n, the insight and the table all still carry the argument. */
      @media print {
        .slider,
        .slider-labels {
          display: none !important;
        }

        .slider-section {
          border: none;
          background: none;
          padding: 0.5rem 0;
        }

        .bar,
        .bar-track {
          transition: none;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .insight-box,
        .ratio-section {
          break-inside: avoid;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScalingSliderComponent {
  readonly config = input.required<ScalingSliderConfig>();

  private readonly translationService = inject(TranslationService);

  /** Stable id so several sliders on one page keep distinct label targets. */
  readonly sliderId = `scaling-slider-${++instanceCounter}`;

  private readonly nOverride = signal<number | null>(null);

  /** Current input size: the reader's choice, else the configured default. */
  readonly n = computed(() => this.nOverride() ?? this.config().defaultN);

  onSliderInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(value)) this.nOverride.set(value);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /** A number in the page language (grouping, decimal separator), never the browser's. */
  private num(value: number, fractionDigits = 0): string {
    return formatNumberFor(value, this.translationService.currentLanguage, fractionDigits);
  }

  value(type: ScalingCurveType): number {
    return CURVE_FUNCTIONS[type](this.n());
  }

  formatValue(type: ScalingCurveType): string {
    const val = this.value(type);
    if (type === 'logarithmic') return this.num(val, 1);
    if (val >= 10000) return this.num(val);
    return Math.round(val).toString();
  }

  /**
   * Bar fill as a percentage of a FIXED logarithmic scale whose ceiling is the
   * worst case any shown curve reaches at `sliderMax`. Logarithmic because the
   * values span many orders of magnitude — on a linear axis the cheap curves
   * would be invisible lines.
   */
  barWidth(type: ScalingCurveType): number {
    const cfg = this.config();
    const ceiling = Math.max(1, ...cfg.curves.map((c) => CURVE_FUNCTIONS[c.type](cfg.sliderMax)));
    const logCeiling = Math.log10(ceiling) || 1;
    const pct = (Math.log10(Math.max(1, this.value(type))) / logCeiling) * 100;
    return Math.max(0.5, Math.min(100, pct));
  }

  isReference(type: ScalingCurveType): boolean {
    return type === this.config().referenceCurve;
  }

  isCheaper(type: ScalingCurveType): boolean {
    return this.value(type) < this.value(this.config().referenceCurve);
  }

  /** Ratio against the reference curve, always expressed as a number ≥ 1. */
  ratio(type: ScalingCurveType): string {
    const refVal = this.value(this.config().referenceCurve) || 1;
    const val = this.value(type);
    const r = val < refVal ? refVal / val : val / refVal;
    return r >= 10 ? this.num(r) : this.num(r, 1);
  }

  private readonly band = computed(() => {
    const n = this.n();
    if (n <= BAND_SMALL) return 'small';
    if (n <= BAND_MODERATE) return 'moderate';
    if (n <= BAND_LARGE) return 'large';
    return 'veryLarge';
  });

  readonly insightTitle = computed(() =>
    this.translate(`${this.config().translationPrefix}.insight.${this.band()}.title`),
  );

  readonly insightText = computed(() => {
    const cfg = this.config();
    const worstCurve = cfg.curves.reduce(
      (worst, c) => (this.value(c.type) > this.value(worst.type) ? c : worst),
      cfg.curves[0],
    );
    const refVal = this.value(cfg.referenceCurve) || 1;
    const worstVal = this.value(worstCurve.type);
    const factor = worstVal / refVal;

    return this.translate(`${cfg.translationPrefix}.insight.${this.band()}.description`)
      .replaceAll('{{n}}', this.num(this.n()))
      .replaceAll('{{reference}}', this.num(refVal))
      .replaceAll('{{worst}}', this.num(worstVal))
      .replaceAll('{{factor}}', factor >= 10 ? this.num(factor) : this.num(factor, 1));
  });
}
