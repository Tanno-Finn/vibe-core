/**
 * Empty state of the sitemap overlay: shown when the live filter matches no
 * page. Echoes the query and offers to clear it.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-sitemap-empty-state',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Empty state when the live filter has zero matches. We
         announce via role="status" + aria-live="polite" so SRs
         pick up the transition from results → no results. -->
    <div class="sitemap-empty" role="status" aria-live="polite">
      <i class="pi pi-search sitemap-empty-icon" aria-hidden="true"></i>
      <h3 class="sitemap-empty-title">{{ translate('app.nav.emptyTitle') }}</h3>
      @if (query().trim()) {
        <p class="sitemap-empty-query">
          <span class="sitemap-empty-query-value">{{ query() }}</span>
        </p>
      }
      <p class="sitemap-empty-hint">{{ translate('app.nav.emptyHint') }}</p>
      @if (query().trim()) {
        <button type="button" class="sitemap-empty-clear" (click)="clearRequested.emit()">
          <i class="pi pi-refresh" aria-hidden="true"></i>
          <span>{{ translate('app.nav.emptyClearAction') }}</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      app-sitemap-empty-state {
        display: contents;
      }

      app-root .sitemap-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.6rem;
        padding: 3rem 1.5rem;
        max-width: 480px;
        margin: 0 auto;
        /* Flex children inherit min-width: auto by default — explicit 0 lets
         the query-pill shrink instead of forcing horizontal overflow when
         the user pastes a long unbreakable string. */
        min-width: 0;
        width: 100%;
        box-sizing: border-box;
      }

      app-root .sitemap-empty-icon {
        font-size: 3rem;
        line-height: 1;
        background: linear-gradient(135deg, var(--primary-fg) 0%, var(--accent-fg) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        margin-bottom: 0.25rem;
        animation: sitemap-empty-float 2.8s ease-in-out infinite;
      }

      @keyframes sitemap-empty-float {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-3px);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        app-root .sitemap-empty-icon {
          animation: none;
        }
      }

      app-root .sitemap-empty-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
      }

      app-root .sitemap-empty-query {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        margin: 0;
        width: 100%;
        min-width: 0;
      }

      app-root .sitemap-empty-query-value {
        display: inline-block;
        font-family: 'SF Mono', 'Monaco', 'Roboto Mono', monospace;
        background: var(--surface-section);
        padding: 3px 10px;
        border-radius: 4px;
        border: 1px solid var(--surface-border);
        color: var(--text-color);
        max-width: 100%;
        box-sizing: border-box;
        /* overflow-wrap: anywhere lets the browser break at any character to
         keep the badge inside its container — required for pasted URLs or
         long tokens without natural break points. word-break: break-word is
         the legacy alias for older Safari/Firefox. */
        overflow-wrap: anywhere;
        word-break: break-word;
        white-space: normal;
      }

      app-root .sitemap-empty-hint {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        margin: 0 0 0.5rem 0;
        line-height: 1.5;
      }

      app-root .sitemap-empty-clear {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.6rem 1.25rem;
        border: 2px solid transparent;
        border-radius: var(--border-radius);
        background: var(--surface-card);
        background-image:
          linear-gradient(var(--surface-card), var(--surface-card)),
          linear-gradient(135deg, var(--primary-fg) 0%, var(--accent-fg) 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        color: var(--text-color);
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: filter 0.15s ease;
      }

      app-root .sitemap-empty-clear:hover {
        filter: brightness(1.05);
      }

      app-root .sitemap-empty-clear:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Mobile: Single column layout */
      @media (max-width: 640px) {
        app-root .sitemap-empty {
          padding: 2rem 1rem;
        }

        app-root .sitemap-empty-icon {
          font-size: 2.5rem;
        }
      }
    `,
  ],
})
export class SitemapEmptyStateComponent {
  private translationService = inject(TranslationService);

  /** The query that matched nothing. */
  readonly query = input('');
  /** "Clear search" was pressed. */
  readonly clearRequested = output<void>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
