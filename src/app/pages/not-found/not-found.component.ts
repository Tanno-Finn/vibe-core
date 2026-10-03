/**
 * NotFoundComponent - 404 Error Page
 *
 * Displays a user-friendly 404 error page when users navigate to non-existent routes.
 */
import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { DividerModule } from '@openng/optimus-ui/divider';

// Services
import { TranslationService } from '../../services/translation.service';

// Shared Components
import { HighlightDirective } from '../../directives/highlight.directive';
import { GlossaryPopoverComponent } from '../../components/shared/glossary-popover.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { SITE_CONFIG } from '../../../config/site';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    HighlightDirective,
    GlossaryPopoverComponent,
    RouterModule,
    SimpleEasyLanguageFabComponent,
  ],
  template: `
    <div class="not-found-container">
      <div class="error-card">
        <p-card>
          <div class="error-content">
            <!-- 404 Error Icon -->
            <div class="error-icon" role="img" aria-hidden="true">🔍</div>

            <h1 class="error-title" [appHighlight]="title()">{{ title() }}</h1>

            <p class="error-description" [appHighlight]="description()">
              {{ description() }}
            </p>

            <p-divider></p-divider>

            <!-- Navigation Options -->
            <div class="action-buttons">
              <p-button
                [label]="goBack()"
                icon="pi pi-arrow-left"
                severity="secondary"
                [outlined]="true"
                (click)="goBackAction()"
              >
              </p-button>

              <p-button [label]="backToHome()" icon="pi pi-home" severity="primary" (click)="navigateToHome()">
              </p-button>
            </div>

            <!-- Popular Pages: only those of features that are on (site.json) -->
            @if (showCatalog || showGlossary || showDemo) {
              <div class="popular-pages">
                <h3 [appHighlight]="popularPages()">{{ popularPages() }}</h3>
                <div class="page-links">
                  @if (showCatalog) {
                    <a routerLink="/catalog" class="popular-page-link">
                      <i class="pi pi-desktop" aria-hidden="true"></i>
                      {{ aiToolsLabel() }}
                    </a>
                  }

                  @if (showGlossary) {
                    <a routerLink="/glossary" class="popular-page-link">
                      <i class="pi pi-book" aria-hidden="true"></i>
                      {{ glossaryLabel() }}
                    </a>
                  }

                  @if (showDemo) {
                    <a routerLink="/example-demo" class="popular-page-link">
                      <i class="pi pi-chart-line" aria-hidden="true"></i>
                      {{ exampleDemoLabel() }}
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>
    </div>

    <!-- Global Glossary Popover -->
    <app-glossary-popover></app-glossary-popover>

    <!-- Easy-Language FAB (auto-registers via FabRegistry) -->
    <app-simple-easy-language-fab contentId="not-found" contentType="page"> </app-simple-easy-language-fab>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .not-found-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 80vh;
        padding: 2rem;
      }

      .error-card {
        max-width: 600px;
        width: 100%;
      }

      .error-content {
        text-align: center;
        padding: 2rem;
      }

      .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        display: inline-block;
        color: var(--text-color-secondary);
      }

      .error-title {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--text-color);
      }

      .error-description {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 2rem;
        flex-wrap: wrap;
      }

      .popular-pages {
        margin-top: 2rem;
      }

      .popular-pages h3 {
        margin-bottom: 1rem;
        color: var(--text-color);
        font-size: 1.1rem;
      }

      .page-links {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        flex-wrap: wrap;
      }

      @media (max-width: 768px) {
        .error-title {
          font-size: 2rem;
        }

        .error-description {
          font-size: 1rem;
        }

        .action-buttons {
          flex-direction: column;
          align-items: center;
        }

        .page-links {
          flex-direction: column;
          gap: 0.25rem;
        }
      }

      @media (max-width: 480px) {
        .error-content {
          padding: 1rem;
        }
        .error-title {
          font-size: 1.5rem;
        }
      }

      /* HUB-21: Popular page link styles */
      .popular-page-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        color: var(--primary-color-fg);
        text-decoration: none;
        border-radius: var(--border-radius);
        font-size: 0.875rem;
        transition: background 0.2s;
      }

      .popular-page-link:hover {
        background: var(--surface-hover);
        text-decoration: none;
      }

      .popular-page-link:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
    `,
  ],
})
export class NotFoundComponent {
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private site = inject(SITE_CONFIG);

  // Popular-page links, each only while its feature is on (site.json)
  readonly showCatalog = this.site.isRouteOn('catalog');
  readonly showGlossary = this.site.isRouteOn('glossary');
  readonly showDemo = this.site.isRouteOn('example-demo');

  // Reactive translations using computed signals
  title = computed(() => this.translationService.translate('errors.404.title'));
  description = computed(() => this.translationService.translate('errors.404.description'));
  backToHome = computed(() => this.translationService.translate('errors.404.backToHome'));
  goBack = computed(() => this.translationService.translate('errors.404.goBack'));
  popularPages = computed(() => this.translationService.translate('errors.404.popularPages'));

  // Navigation labels
  aiToolsLabel = computed(() => this.translationService.translate('app.nav.aiTools'));
  glossaryLabel = computed(() => this.translationService.translate('app.nav.glossary'));
  exampleDemoLabel = computed(() => this.translationService.translate('exampleDemo.title'));

  /**
   * Navigate to home page
   */
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Go back to previous page
   */
  goBackAction(): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Navigate to specific route
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
