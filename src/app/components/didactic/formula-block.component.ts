/**
 * FormulaBlockComponent
 *
 * Block-level container for mathematical formulas in articles.
 * Used in Path L (Math) articles: art-linear-algebra, art-calculus-essentials.
 *
 * Renders formulas using system math fonts (no external dependency like KaTeX/MathJax).
 * Authors write formulas using Unicode math symbols + HTML <sub>/<sup> tags.
 *
 * Usage:
 *   <app-formula-block label="Gradient Descent">
 *     w<sub>new</sub> = w<sub>old</sub> − η · ∇L(w)
 *   </app-formula-block>
 *
 * With a limit:
 *   <app-formula-block label="Ableitung">
 *     f'(x) = lim<sub>h→0</sub> (f(x + h) − f(x)) / h
 *   </app-formula-block>
 *
 * Follows the didactic component pattern (standalone, OnPush, design tokens only).
 */
import { Component, ChangeDetectionStrategy, Input, inject } from '@angular/core';

import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-formula-block',
  standalone: true,
  imports: [],
  template: `
    <figure class="formula-block" role="math" [attr.aria-label]="ariaLabel || label || undefined">
      @if (label || labelKey) {
        <figcaption class="formula-label">{{ labelKey ? t(labelKey) : label }}</figcaption>
      }
      <div class="formula-content" tabindex="0">
        <ng-content></ng-content>
      </div>
    </figure>
  `,
  styles: [
    `
      /* A query container: the @container rules below read the width of the
       column this widget sits in (article, demo frame, card), not the window. */
      :host {
        display: block;
        container-type: inline-size;
        margin: 1.5rem 0;
      }

      .formula-block {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.25rem 1.5rem;
        margin: 0;
        background: var(--surface-ground);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        page-break-inside: avoid;
      }

      .formula-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--primary-color-fg);
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .formula-content {
        font-family: 'Cambria Math', 'STIX Two Math', 'Noto Sans Math', 'Latin Modern Math', Georgia, serif;
        font-size: 1.15rem;
        line-height: 2;
        color: var(--text-color);
        text-align: center;
      }

      :host-context(.dark-theme) .formula-block {
        background: var(--surface-card);
      }

      @container (max-width: 768px) {
        .formula-block {
          padding: 1rem;
        }

        .formula-content {
          font-size: 1rem;
          overflow-x: auto;
          max-width: 100%;
          -webkit-overflow-scrolling: touch;
        }
      }

      /* Print styles */
      @media print {
        .formula-block {
          background: #fff;
          border: 1px solid #999;
          page-break-inside: avoid;
          padding: 1rem;
        }

        .formula-label {
          color: #333;
        }

        .formula-content {
          color: #000;
          font-size: 1.05rem;
        }

        :host-context(.dark-theme) .formula-block {
          background: #fff;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormulaBlockComponent {
  @Input() label?: string;
  @Input() labelKey?: string;
  @Input() ariaLabel?: string;

  private translationService = inject(TranslationService);

  t(key: string): string {
    return this.translationService.translate(key);
  }
}
