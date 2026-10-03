/**
 * Details drawer of the catalog: the entry's header (type, rating, chips,
 * visit and share), its description and tags, the tool or resource details,
 * and the articles that reference it.
 *
 * The drawer is appended to <body>, so its styles are keyed on the
 * `catalog-details-sidebar` style class, not on `app-catalog`.
 */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DrawerModule } from '@openng/optimus-ui/drawer';
import { TagModule } from '@openng/optimus-ui/tag';
import { TranslationService } from '../../services/translation.service';
import { ArticleMetaService } from '../../services/article-meta.service';
import { ArticlesService, ArticleMeta as ArticleIndexMeta } from '../../services/articles.service';
import { CatalogEntry, CatalogToolEntry, CatalogResourceEntry } from '../../models/catalog.model';
import { CatalogEntryPresenter } from './catalog-entry-presenter.service';
import { CatalogEntryHeaderComponent } from './catalog-entry-header.component';
import { CatalogToolDetailsComponent } from './catalog-tool-details.component';
import { CatalogResourceDetailsComponent } from './catalog-resource-details.component';

@Component({
  selector: 'app-catalog-details-drawer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    DrawerModule,
    TagModule,
    CatalogEntryHeaderComponent,
    CatalogToolDetailsComponent,
    CatalogResourceDetailsComponent,
  ],
  template: `
    <p-drawer
      [visible]="visible()"
      position="right"
      [style]="{ width: 'min(900px, 100vw)' }"
      styleClass="catalog-details-sidebar"
      appendTo="body"
      [showCloseIcon]="false"
      [blockScroll]="false"
      [dismissible]="true"
      [closeOnEscape]="true"
      (onHide)="closed.emit()"
    >
      @if (selectedEntry()) {
        <div class="sidebar-content">
          <!-- Compact Header -->
          <app-catalog-entry-header [selectedEntry]="selectedEntry()" (closed)="closed.emit()" />
          <!-- Scrollable Content -->
          <div class="sidebar-scrollable-content">
            <!-- Description + Tags -->
            <p class="sidebar-description">{{ selectedEntry()?.description }}</p>
            @if (selectedEntry()?.tags && selectedEntry()!.tags.length > 0) {
              <div class="sidebar-tags">
                @for (tag of selectedEntry()!.tags.slice(0, 5); track tag) {
                  <p-tag [value]="tag" [style]="p.getEnhancedTagStyle()" class="enhanced-tag"></p-tag>
                }
                @if (selectedEntry()!.tags.length > 5) {
                  <span class="more-tags"
                    >+{{ selectedEntry()!.tags.length - 5 }} {{ translate('catalog.tags.more') }}</span
                  >
                }
              </div>
            }
            <!-- Tool Details (flat scroll) -->
            @if (selectedEntry()!.entryType === 'tool') {
              <app-catalog-tool-details
                [tool]="p.asToolEntry(selectedEntry()!)"
                [similar]="similarTools()"
                (opened)="opened.emit($event)"
              />
            }
            <!-- Resource Details -->
            @if (selectedEntry()!.entryType === 'resource') {
              <app-catalog-resource-details
                [resource]="p.asResourceEntry(selectedEntry()!)"
                [similar]="similarResources()"
                (opened)="opened.emit($event)"
              />
            }
            <!-- Referenced in Articles -->
            @if (referencingArticles().length > 0) {
              <div class="info-card referenced-articles-card">
                <div class="detail-card-header">
                  <i class="pi pi-file-edit header-icon"></i>
                  <h4>{{ translate('articles.referencedInArticles') }}</h4>
                </div>
                <div class="referenced-articles-list">
                  @for (article of referencingArticles(); track article.id) {
                    <a [routerLink]="['/articles', article.id]" class="referenced-article-item" (click)="closed.emit()">
                      <div class="referenced-article-info">
                        <i class="pi pi-align-left"></i><span>{{ translate(article.titleKey) }}</span>
                      </div>
                      <i class="pi pi-angle-right"></i>
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </p-drawer>
  `,
  styles: [
    `
      app-catalog-entry-header {
        display: contents;
      }

      /* Sidebar / Drawer Styles */
      .catalog-details-sidebar {
        width: min(900px, 100vw) !important;
        max-width: 100vw;
      }

      .catalog-details-sidebar .p-sidebar,
      .catalog-details-sidebar .p-drawer {
        background: var(--surface-card);
        border-left: 2px solid var(--surface-border);
      }

      .catalog-details-sidebar .p-sidebar-header,
      .catalog-details-sidebar .p-drawer-header {
        display: none !important;
      }

      .catalog-details-sidebar .p-sidebar-content,
      .catalog-details-sidebar .p-drawer-content {
        padding: 0 !important;
        height: 100%;
      }

      .catalog-details-sidebar .sidebar-content {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .catalog-details-sidebar .sidebar-header {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--surface-border);
        background: var(--surface-section);
        flex-shrink: 0;
      }

      .catalog-details-sidebar .sidebar-header-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.5rem;
        margin-bottom: 0.375rem;
      }

      .catalog-details-sidebar .sidebar-header-left {
        flex: 1;
        min-width: 0;
      }

      .catalog-details-sidebar .sidebar-close-btn {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 44px;
        min-height: 44px;
        border: none;
        background: transparent;
        color: var(--text-color-secondary);
        border-radius: 50%;
        cursor: pointer;
        transition:
          background 0.2s,
          color 0.2s;
      }

      .catalog-details-sidebar .sidebar-close-btn:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      .catalog-details-sidebar .sidebar-header-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .catalog-details-sidebar .sidebar-header-actions {
        display: flex;
        gap: 0.375rem;
        flex-shrink: 0;
      }

      .catalog-details-sidebar .entry-type-indicator {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.15rem 0.5rem;
        border-radius: 8px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .catalog-details-sidebar .indicator-tool {
        background: color-mix(in srgb, var(--blue-500) 10%, transparent);
        color: var(--blue-500);
        border: 1px solid color-mix(in srgb, var(--blue-500) 20%, transparent);
      }

      .catalog-details-sidebar .indicator-resource {
        background: color-mix(in srgb, var(--green-500) 10%, transparent);
        color: var(--green-500);
        border: 1px solid color-mix(in srgb, var(--green-500) 20%, transparent);
      }

      .catalog-details-sidebar .sidebar-title-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .catalog-details-sidebar .entry-sidebar-title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-color);
        line-height: 1.25;
      }

      .catalog-details-sidebar .entry-sidebar-rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .catalog-details-sidebar .rating-value {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        margin-left: 0.125rem;
      }

      .catalog-details-sidebar .entry-sidebar-chips {
        display: flex;
        gap: 0.375rem;
        flex-wrap: wrap;
      }

      .catalog-details-sidebar .drawer-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.75rem;
        border: 1px solid currentColor;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
        background: color-mix(in srgb, currentColor 8%, transparent);
      }

      .catalog-details-sidebar .drawer-chip i {
        font-size: 0.8rem;
      }

      .catalog-details-sidebar .more-tags {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      .catalog-details-sidebar .sidebar-scrollable-content {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
      }

      .catalog-details-sidebar .sidebar-description {
        margin: 0 0 0.625rem 0;
        color: var(--text-color);
        line-height: 1.5;
        font-size: 0.9rem;
      }

      .catalog-details-sidebar .sidebar-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.875rem;
        border-bottom: 1px solid var(--surface-border);
      }

      /* Info Cards */
      .catalog-details-sidebar .info-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: 0.75rem;
        margin-bottom: 0.625rem;
      }

      .catalog-details-sidebar .detail-card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.625rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--surface-border);
      }

      .catalog-details-sidebar .header-icon {
        color: var(--primary-color-fg);
        font-size: 1rem;
      }

      .catalog-details-sidebar .detail-card-header h4 {
        margin: 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .catalog-details-sidebar .enhanced-tag,
      .catalog-details-sidebar .enhanced-alternative {
        font-size: 0.85rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .catalog-details-sidebar .enhanced-tag:hover,
      .catalog-details-sidebar .enhanced-alternative:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .catalog-details-sidebar .referenced-articles-card {
        margin-top: 1rem;
      }

      .catalog-details-sidebar .referenced-articles-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .catalog-details-sidebar .referenced-article-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        background: var(--surface-card);
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        color: var(--text-color);
      }

      .catalog-details-sidebar .referenced-article-item:hover {
        border-color: var(--primary-color-fg);
        background: var(--primary-color-alpha);
      }

      .catalog-details-sidebar .referenced-article-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .catalog-details-sidebar .referenced-article-info i {
        color: var(--primary-color-fg);
        font-size: 0.9rem;
      }

      /* Tab Styles */
      .catalog-details-sidebar .entry-details-tabs {
        height: 100%;
      }

      .catalog-details-sidebar .entry-details-tabs .p-tabpanels {
        padding: 0;
        background: transparent;
        border: none;
        height: calc(100% - 42px);
        overflow-y: auto;
      }

      .catalog-details-sidebar .entry-details-tabs .p-tabpanel {
        padding: 0;
        height: 100%;
      }

      .catalog-details-sidebar .entry-details-tabs .p-tablist {
        background: var(--surface-ground);
        border-bottom: 1px solid var(--surface-border);
        margin-bottom: 1rem;
      }

      .catalog-details-sidebar .entry-details-tabs .p-tab {
        color: var(--text-color-secondary);
        font-weight: 500;
        font-size: 0.9rem;
      }

      .catalog-details-sidebar .entry-details-tabs .p-tab:focus {
        box-shadow: 0 0 0 2px var(--primary-color-alpha);
      }

      .catalog-details-sidebar .entry-details-tabs .p-tab[aria-selected='true'] {
        color: var(--primary-color-fg);
        border-bottom-color: var(--primary-color-fg);
      }

      .catalog-details-sidebar .tab-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 0.5rem;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .catalog-details-sidebar .p-sidebar,
        .catalog-details-sidebar .p-drawer {
          width: 100vw !important;
        }

        .catalog-details-sidebar .sidebar-header {
          padding: 1rem;
        }

        .catalog-details-sidebar .sidebar-header-content {
          flex-direction: column;
          gap: 1rem;
        }

        .catalog-details-sidebar .entry-sidebar-title {
          font-size: 1.4rem;
        }

        .catalog-details-sidebar .sidebar-scrollable-content {
          padding: 1rem;
        }

        .catalog-details-sidebar .sidebar-footer {
          padding: 1rem;
        }

        .catalog-details-sidebar .info-card {
          padding: 1rem;
        }

        .catalog-details-sidebar .detail-card-header h4 {
          font-size: 1rem;
        }
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        .catalog-details-sidebar .feature-badge,
        .catalog-details-sidebar .info-card {
          transition: none;
        }

        .catalog-details-sidebar .feature-badge:hover {
          transform: none;
        }
      }

      /* High Contrast Mode Support */
      @media (prefers-contrast: high) {
        .catalog-details-sidebar .info-card {
          border-width: 3px;
        }
      }
    `,
  ],
})
export class CatalogDetailsDrawerComponent {
  private translationService = inject(TranslationService);
  private articleMetaService = inject(ArticleMetaService);
  protected readonly p = inject(CatalogEntryPresenter);

  /** The entry shown, or null while the drawer is closed. */
  readonly selectedEntry = input<CatalogEntry | null>(null);
  readonly visible = input(false);
  /** The whole catalog, for the "similar" lists. */
  readonly entries = input.required<CatalogEntry[]>();

  /** The drawer was dismissed (close button, Escape, outside click, article link). */
  readonly closed = output<void>();
  /** A similar entry was chosen; the page shows it instead. */
  readonly opened = output<CatalogEntry>();

  // Articles index for reverse-lookup display
  private articlesIndex = signal<ArticleIndexMeta[]>([]);

  constructor() {
    inject(ArticlesService)
      .getAll()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((articles) => {
        this.articlesIndex.set(articles);
      });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // Computed: Similar entries (avoids duplicate calls in template)
  similarTools = computed(() => {
    const current = this.selectedEntry();
    if (!current || current.entryType !== 'tool') return [];

    const toolEntry = current as CatalogToolEntry;
    return this.entries()
      .filter(
        (e): e is CatalogToolEntry =>
          e.entryType === 'tool' && e.id !== current.id && e.category === toolEntry.category,
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  });

  similarResources = computed(() => {
    const current = this.selectedEntry();
    if (!current || current.entryType !== 'resource') return [];

    const resourceEntry = current as CatalogResourceEntry;
    return this.entries()
      .filter(
        (e): e is CatalogResourceEntry =>
          e.entryType === 'resource' &&
          e.id !== current.id &&
          (e.topic === resourceEntry.topic || e.mediaType === resourceEntry.mediaType),
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  });

  referencingArticles = computed(() => {
    const entry = this.selectedEntry();
    if (!entry) return [];

    const originalId = entry.id.replace(/^(tool-|rsrc-)/, '');
    let articleIds: string[] = [];

    if (entry.entryType === 'tool') {
      articleIds = this.articleMetaService.getArticlesReferencingTool(originalId);
    } else if (entry.entryType === 'resource') {
      articleIds = this.articleMetaService.getArticlesReferencingResource(originalId);
    }

    if (articleIds.length === 0) return [];

    const index = this.articlesIndex();
    return articleIds
      .map((id) => {
        const article = index.find((a) => a.id === id);
        if (!article) return null;
        return { id: article.id, titleKey: article.titleKey, path: article.path };
      })
      .filter((a): a is { id: string; titleKey: string; path: string } => a !== null);
  });
}
