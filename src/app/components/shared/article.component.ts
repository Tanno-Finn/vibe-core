/**
 * Generic article wrapper component that provides consistent content width limiting
 * and spacing for all article-type pages in the portal.
 * This replaces individual page-specific container styles with a reusable component.
 */

import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TranslationService } from '../../services/translation.service';
import { SITE_CONFIG } from '../../../config/site';
import { learnBackLink } from '../../utils/learn-back-link';

// Container width types matching the design system standards
export type ArticleWidth = 'page' | 'section' | 'demo' | 'component' | 'full';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [ButtonModule],
  template: `
    <article class="article-wrapper" [class]="'width-' + width" [class.transparent-bg]="transparentBackground">
      <div class="article-container">
        @if (fromParam) {
          <div class="article-back-navigation">
            <button
              pButton
              type="button"
              [outlined]="true"
              size="small"
              (click)="navigateBack()"
              class="article-back-button"
              [attr.aria-label]="backButtonLabel"
            >
              <i class="pi pi-arrow-left" pButtonIcon aria-hidden="true"></i
              ><span pButtonLabel>{{ backButtonLabel }}</span>
            </button>
          </div>
        }
        <ng-content></ng-content>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Article wrapper provides consistent spacing and background */
      .article-wrapper {
        min-height: calc(100vh - 1px); /* Prevent scrollbar on exact fit */
        background: var(--surface-ground);
        /* Top-padding 0: <app-page-header> brings its own top spacing (see src/assets/design-system/page-header.md) */
        padding: 0 var(--space-4) var(--space-6);
        box-sizing: border-box; /* Include padding in height calculation */
      }

      .article-wrapper.transparent-bg {
        background: transparent;
      }

      /* Article container provides max-width constraints */
      .article-container {
        margin: 0 auto;
        width: 100%;
      }

      /* Width variants using design system container tokens */
      .width-page .article-container {
        max-width: var(--container-page); /* 1400px - Wide screens */
      }

      .width-section .article-container {
        max-width: var(--container-section); /* 1200px - Standard articles */
      }

      .width-demo .article-container {
        max-width: var(--container-demo); /* 1000px - Interactive demos */
      }

      .width-component .article-container {
        max-width: var(--container-component); /* 800px - Smaller components */
      }

      .width-full .article-container {
        max-width: none; /* Full width */
      }

      /* Tablet adjustments */
      @media (max-width: 1024px) {
        .article-wrapper {
          padding: 0 var(--space-3) var(--space-5);
        }
      }

      /* Mobile adjustments */
      @media (max-width: 768px) {
        .article-wrapper {
          padding: 0 var(--space-3) var(--space-4);
          min-height: auto; /* Allow natural height on mobile */
        }
      }

      /* Small mobile adjustments */
      @media (max-width: 480px) {
        .article-wrapper {
          padding: var(--space-3) var(--space-2); /* 12px 8px */
        }
      }

      /* Back navigation button */
      .article-back-navigation {
        margin-bottom: var(--space-4);
      }

      .article-back-button {
        font-size: 0.9rem;
      }

      /* Print styles */
      @media print {
        .article-wrapper {
          background: white;
          padding: 0;
          min-height: auto;
        }

        .article-container {
          max-width: none;
        }

        .article-back-navigation {
          display: none;
        }
      }
    `,
  ],
})
export class ArticleComponent {
  private activatedRoute = inject(ActivatedRoute, { optional: true });
  private router = inject(Router);
  private translationService = inject(TranslationService);

  // ActivatedRoute is `optional` to keep article specs running without provideRouter.
  // In a routed production app the route is always present — warn so a real DI
  // regression (component hosted outside router outlet) is visible.
  fromParam: string | null = this.readFromParam();

  private readFromParam(): string | null {
    if (!this.activatedRoute) {
      console.warn('[article] back-navigation disabled: ActivatedRoute unavailable');
      return null;
    }
    return this.activatedRoute.snapshot.queryParamMap.get('from');
  }

  /** The learning area, or the start page while site.json switches `learn` off. */
  private backLink = learnBackLink(inject(SITE_CONFIG));

  get backButtonLabel(): string {
    return this.translationService.translate(this.backLink.labelKey);
  }

  navigateBack(): void {
    this.router.navigate([this.backLink.route]);
  }

  /**
   * Width variant for the article container
   * - 'page': 1400px - Wide screens (default)
   * - 'section': 1200px - Standard articles
   * - 'demo': 1000px - Interactive demos
   * - 'component': 800px - Smaller components
   * - 'full': No max-width constraint
   */
  @Input() width: ArticleWidth = 'page';

  /**
   * Whether to use a transparent background instead of surface-ground.
   * Allows the global portal gradient to show through.
   */
  @Input() transparentBackground: boolean = false;
}
