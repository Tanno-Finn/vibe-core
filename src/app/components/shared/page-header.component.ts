import { ChangeDetectorRef, Component, Input, ViewEncapsulation, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header class="ph">
      <div class="ph-content">
        <h1 class="ph-title">{{ resolvedTitle }}</h1>
        <div class="ph-bar" aria-hidden="true"></div>
        @if (resolvedSubtitle) {
          <p class="ph-sub">{{ resolvedSubtitle }}</p>
        }
        <ng-content></ng-content>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* =================================================================
       PAGE HEADER — self-isolating, defends against parent CSS
       ================================================================= */
      app-page-header {
        display: block;
        /* Own top spacing — minimal, just clears the app header */
        padding-top: 0.5rem;
        /* Own bottom spacing — constant regardless of subtitle length */
        margin-bottom: 1.75rem;
        /* Reset any inherited text-align */
        text-align: initial;
      }

      app-page-header .ph {
        /* Force centering for OUR content, regardless of parent text-align */
        text-align: center;
        /* No own padding — content spans the full container width */
        padding: 0;
        margin: 0;
      }

      app-page-header .ph-bar {
        /* Brand-bar: 3px gradient, 66% width, centered between title and subtitle.
         Uses theme color scheme: --primary-color → --gradient-accent-color
         (set by ThemeService.setColor — reacts to user's color picker choice) */
        display: block;
        width: 66%;
        height: 3px;
        border-radius: 2px;
        background: linear-gradient(
          90deg,
          var(--primary-color, #f59e0b) 0%,
          var(--gradient-accent-color, #f97316) 100%
        );
        margin: 0.6rem auto 0.6rem;
      }

      app-page-header .ph-content {
        width: 100%;
      }

      app-page-header .ph-title {
        font-size: clamp(1.75rem, 4vw, 2.25rem);
        font-weight: 700;
        font-style: italic;
        letter-spacing: -0.02em;
        line-height: 1.2;
        margin: 0 auto;
        /* Large bold text qualifies as "Large Text" per WCAG 1.4.3 — 3:1 is
         the required ratio. Use icon-fg variant (3:1 target) instead of fg
         (4.5:1) to keep brand color vibrant on bold display headings. */
        background: linear-gradient(90deg, var(--primary-color-icon-fg) 0%, var(--gradient-accent-color-icon-fg) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        width: fit-content;
      }

      app-page-header .ph-sub {
        font-size: 1.0625rem;
        line-height: 1.5;
        font-style: normal;
        font-weight: 400;
        color: var(--text-color-secondary);
        margin: 0 auto;
        max-width: 100%;
        text-align: center;
      }
    `,
  ],
})
export class PageHeaderComponent {
  @Input() title?: string;
  @Input() titleKey?: string;
  @Input() subtitle?: string;
  @Input() subtitleKey?: string;

  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => this.cdr.detectChanges());
  }

  get resolvedTitle(): string {
    if (this.titleKey) {
      return this.translationService.translate(this.titleKey);
    }
    return this.title || '';
  }

  get resolvedSubtitle(): string {
    if (this.subtitleKey) {
      return this.translationService.translate(this.subtitleKey);
    }
    return this.subtitle || '';
  }
}
