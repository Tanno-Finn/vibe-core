import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';

import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';

import { TranslationService } from '../../services/translation.service';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';
import { openExternal } from '../../utils/open-external';
import { SourceGroup, chapterAnchorId } from './sources-filter';

const TYPE_ICONS: Record<string, string> = {
  paper: 'pi pi-file-pdf',
  book: 'pi pi-book',
  website: 'pi pi-globe',
  wikipedia: 'pi pi-info-circle',
  blog: 'pi pi-pencil',
  video: 'pi pi-video',
  interview: 'pi pi-comments',
  article: 'pi pi-file-edit',
  other: 'pi pi-file',
};

/**
 * The sources page's result area: loading skeletons until the sources arrive,
 * then one heading and card grid per group, or the empty state when the
 * filters leave nothing. Presentational only — the page hands in the groups.
 *
 * Styles stay ViewEncapsulation.None and scoped under app-sources, exactly as
 * they were when this markup lived in the page.
 */
@Component({
  selector: 'app-sources-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TooltipModule, SkeletonModule, CursorGlowDirective],
  template: `
    <!-- Loading Skeletons - 2 groups with headers like real content.
         role="status" + aria-busy make the container a polite live region that is
         mid-update; the sr-only line gives it something to say, because every
         p-skeleton is hard-coded aria-hidden="true" and contributes nothing. -->
    @if (!loaded()) {
      <div class="sources-container" role="status" aria-busy="true">
        <span class="sr-only">{{ translate('common.loading') }}</span>
        @for (group of [1, 2]; track group) {
          <div class="skeleton-chapter-group">
            <!-- Skeleton Chapter Header -->
            <div class="skeleton-chapter-header">
              <p-skeleton width="40%" height="1.75rem"></p-skeleton>
            </div>
            <!-- Skeleton Cards Grid -->
            <div class="sources-grid">
              @for (item of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]; track item) {
                <div class="skeleton-source-card">
                  <div class="skeleton-header">
                    <p-skeleton shape="circle" size="2rem"></p-skeleton>
                    <p-skeleton width="30%" height="1rem"></p-skeleton>
                  </div>
                  <div class="skeleton-content">
                    <p-skeleton width="90%" height="1.25rem"></p-skeleton>
                    <p-skeleton width="100%" height="1rem"></p-skeleton>
                    <p-skeleton width="80%" height="1rem"></p-skeleton>
                    <p-skeleton width="60%" height="1rem"></p-skeleton>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    }

    <!-- Sources Grid - Grouped by Chapter -->
    @if (loaded() && groups().length > 0) {
      <div class="sources-container">
        <!-- Chapter Groups -->
        @for (group of groups(); track group.chapterId) {
          <div class="chapter-group">
            <!-- Chapter Header -->
            <!-- The ToC links here; chapterAnchorId() explains why it is keyed on chapterId. -->
            <h2 [id]="anchorId(group.chapterId)" class="chapter-header">
              {{ group.chapterName }}
            </h2>
            <!-- Sources for this chapter -->
            <div class="sources-grid">
              @for (source of group.sources; track source.id) {
                @defer (on viewport; prefetch on idle) {
                  <div class="source-card" [attr.data-type]="source.type" appCursorGlow>
                    <!-- Card Header -->
                    <div class="card-header">
                      <div class="card-header-left">
                        <span
                          class="source-type-icon"
                          role="img"
                          [attr.aria-label]="typeLabel(source.type)"
                          [pTooltip]="typeLabel(source.type)"
                        >
                          <i [class]="typeIcon(source.type)" aria-hidden="true"></i>
                        </span>
                        @if (source.subChapter) {
                          <div class="chapter-info">
                            <span class="source-sub-chapter">{{ source.subChapter }}</span>
                          </div>
                        }
                      </div>
                      @if (source.url) {
                        <div class="card-header-right">
                          <button
                            pButton
                            class="p-button-text p-button-sm"
                            (click)="openUrl(source.url)"
                            [pTooltip]="translate('common.openLink')"
                            [attr.aria-label]="translate('common.openLink') + ': ' + source.title"
                          >
                            <i class="pi pi-external-link" pButtonIcon aria-hidden="true"></i>
                          </button>
                        </div>
                      }
                    </div>
                    <!-- Card Content -->
                    <div class="card-content">
                      <!-- Title -->
                      <h3 class="source-title">{{ source.title }}</h3>
                      <!-- Citation Info -->
                      <div class="citation-info">
                        @if (source.authors) {
                          <span class="citation-authors">
                            <i class="pi pi-user"></i>
                            {{ source.authors }}
                          </span>
                        }
                        @if (source.year) {
                          <span class="citation-year">
                            <i class="pi pi-calendar"></i>
                            {{ source.year }}
                          </span>
                        } @else if (source.year === null) {
                          <!-- year: null = the source states no date; absent = not recorded -->
                          <span class="citation-year">
                            <i class="pi pi-calendar"></i>
                            {{ translate('sources.noDate') }}
                          </span>
                        }
                        @if (source.publication) {
                          <span class="citation-publication">
                            <i class="pi pi-book"></i>
                            {{ source.publication }}
                          </span>
                        }
                        @if (source.pages) {
                          <span class="citation-pages">
                            <i class="pi pi-file"></i>
                            {{ source.pages }}
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                } @placeholder {
                  <div class="source-card-placeholder" [attr.data-type]="source.type"></div>
                }
              }
            </div>
          </div>
        }
      </div>
    }

    <!-- No Results (only show when sources are loaded but filtered to empty) -->
    @if (loaded() && groups().length === 0) {
      <div class="no-results">
        <div class="no-results-content">
          <i class="pi pi-search no-results-icon"></i>
          <h3>{{ translate('sources.noResults.title') }}</h3>
          <p>{{ translate('sources.noResults.message') }}</p>
          <button
            pButton
            [attr.aria-label]="translate('sources.filter.clearAll')"
            class="p-button-outlined"
            (click)="clearFilters.emit()"
          >
            <i class="pi pi-refresh" pButtonIcon aria-hidden="true"></i
            ><span pButtonLabel>{{ translate('sources.filter.clearAll') }}</span>
          </button>
        </div>
      </div>
    }
  `,
  styles: [
    `
      /* Sources Container */
      app-sources .sources-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      /* Chapter Group */
      app-sources .chapter-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      /* Chapter Header (like Glossary letter headers) */
      app-sources .chapter-header {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--primary-color-fg);
        margin: 0;
        padding: 0.5rem 0;
        border-bottom: 2px solid var(--primary-color);
        scroll-margin-top: 80px;
      }

      /* Sources Grid */
      app-sources .sources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr));
        gap: 1.5rem;
      }

      /* Source Card */
      app-sources .source-card {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        padding: 1.25rem;
        transition: box-shadow 0.3s ease;
        position: relative;
      }

      /* Placeholder fuer @defer(hydrate on viewport) — zeigt Card-Dimension ohne Inhalt.
       In Prod (SSR/Prerender) wird dieser Placeholder ~nie gezeigt, da SSR die echte
       Card rendert und erst die Hydration lazy laeuft. Relevant fuer Dev-Mode/CSR. */
      app-sources .source-card-placeholder {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        min-height: 12rem;
        content-visibility: auto;
        contain-intrinsic-size: auto 12rem;
      }

      app-sources .source-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      /* Type-specific accent colors + cursor glow color */
      app-sources .source-card[data-type='paper'] {
        border-left-color: #3b82f6;
        --cursor-glow-color: #3b82f6;
      }
      app-sources .source-card[data-type='book'] {
        border-left-color: #10b981;
        --cursor-glow-color: #10b981;
      }
      app-sources .source-card[data-type='website'] {
        border-left-color: #06b6d4;
        --cursor-glow-color: #06b6d4;
      }
      app-sources .source-card[data-type='wikipedia'] {
        border-left-color: #6366f1;
        --cursor-glow-color: #6366f1;
      }
      app-sources .source-card[data-type='blog'] {
        border-left-color: #f59e0b;
        --cursor-glow-color: #f59e0b;
      }
      app-sources .source-card[data-type='video'] {
        border-left-color: #ef4444;
        --cursor-glow-color: #ef4444;
      }
      app-sources .source-card[data-type='interview'] {
        border-left-color: #8b5cf6;
        --cursor-glow-color: #8b5cf6;
      }
      app-sources .source-card[data-type='article'] {
        border-left-color: #14b8a6;
        --cursor-glow-color: #14b8a6;
      }

      /* Card Header */
      app-sources .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      app-sources .card-header-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      app-sources .source-type-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        font-size: 0.9rem;
      }

      app-sources .source-card[data-type='paper'] .source-type-icon {
        background: #3b82f6;
      }

      app-sources .source-card[data-type='book'] .source-type-icon {
        background: #10b981;
      }

      app-sources .source-card[data-type='website'] .source-type-icon {
        background: #06b6d4;
      }

      app-sources .source-card[data-type='wikipedia'] .source-type-icon {
        background: #6366f1;
      }

      app-sources .source-card[data-type='blog'] .source-type-icon {
        background: #f59e0b;
      }

      app-sources .source-card[data-type='video'] .source-type-icon {
        background: #ef4444;
      }

      app-sources .source-card[data-type='interview'] .source-type-icon {
        background: #8b5cf6;
      }

      app-sources .source-card[data-type='article'] .source-type-icon {
        background: #14b8a6;
      }

      app-sources .chapter-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      app-sources .source-sub-chapter {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      /* Card Content */
      app-sources .card-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      app-sources .source-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0 0 0.5rem 0;
        line-height: 1.4;
      }

      app-sources .citation-info {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }

      app-sources .citation-info span {
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }

      app-sources .citation-info i {
        font-size: 0.8rem;
        color: var(--primary-color-fg);
      }

      /* Skeleton Loaders */
      app-sources .skeleton-chapter-group {
        margin-bottom: 2rem;
      }

      app-sources .skeleton-chapter-header {
        margin-bottom: 1.25rem;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid var(--surface-border);
      }

      app-sources .skeleton-source-card {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        padding: 1.25rem;
        margin-bottom: 1.5rem;
      }

      app-sources .skeleton-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      app-sources .skeleton-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      /* No Results */
      app-sources .no-results {
        text-align: center;
        padding: 3rem 1rem;
      }

      app-sources .no-results-content {
        max-width: 400px;
        margin: 0 auto;
      }

      app-sources .no-results-icon {
        font-size: 3rem;
        color: var(--text-color-secondary);
        margin-bottom: 1rem;
      }

      app-sources .no-results h3 {
        margin-bottom: 1rem;
        color: var(--text-color);
      }

      app-sources .no-results p {
        color: var(--text-color-secondary);
        margin-bottom: 2rem;
      }

      @media (max-width: 768px) {
        app-sources .sources-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        app-sources .source-card {
          padding: 1rem;
        }

        app-sources .citation-info {
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
      }

      @media (max-width: 480px) {
        app-sources .source-title {
          font-size: 1rem;
        }

        app-sources .chapter-info {
          font-size: 0.75rem;
        }
      }

      /* CP-21: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        app-sources .source-card {
          transition: none;
        }
      }
    `,
  ],
})
export class SourcesListComponent {
  private translationService = inject(TranslationService);

  /** The groups to render (already filtered and ordered by the page). */
  readonly groups = input<SourceGroup[]>([]);
  /** false while the sources have not arrived yet: shows the skeletons. */
  readonly loaded = input(false);
  /** The empty state's "clear all filters" button. */
  readonly clearFilters = output<void>();

  readonly anchorId = chapterAnchorId;

  typeIcon(type: string): string {
    return TYPE_ICONS[type] || 'pi pi-file';
  }

  typeLabel(type: string): string {
    return this.translate(`sources.types.${type}`);
  }

  openUrl(url: string | undefined): void {
    // Scheme-checked: source URLs come from content JSON, and window.open
    // is not covered by Angular's URL sanitizer. See utils/open-external.
    openExternal(url);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
