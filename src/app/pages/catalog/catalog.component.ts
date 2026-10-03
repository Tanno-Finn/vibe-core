/**
 * Catalog Component - tools and resources in one catalog
 *
 * Merges tools and resources into a single browsable catalog, using
 * CatalogService which provides catalog$ observable of CatalogEntry[].
 *
 * This is the page's container: it owns the filter, sort, pagination,
 * compare-mode and drawer state, reads `?search=` from the URL, and hands
 * the pieces to focused children in this folder:
 *
 *   - CatalogResultsComponent       count, sort switch, card grid
 *   - CatalogCompareViewComponent   compare table (desktop) and list (mobile)
 *   - CatalogDetailsDrawerComponent details drawer (+ tool / resource parts)
 *   - CatalogSkeletonComponent      loading placeholder
 *   - CatalogQuickFiltersComponent  the three quick filter toggles
 *   - catalog-filtering.ts          filter / quick-filter / sort / page functions
 *   - CatalogStateService           favorites + comparison list, persisted and
 *                                   part of the user-data export/import
 *   - CatalogEntryPresenter         labels, icons, colors, visit and share
 *
 * Entry type discrimination:
 *   - Tools have `name`, `category`, `pricing`, `deployment`, `features`, `useCases`, `pros`, `cons`, `alternatives`
 *   - Resources have `title`, `mediaType`, `topic`, `language`, `source`, `author`, `estimatedTime`
 *   - Both share `id`, `entryType`, `url`, `rating`, `difficulty`, `tags`, `description`, `shortDescription`
 *
 * Styles stay global (ViewEncapsulation.None) under `app-catalog` selectors;
 * each child carries the rules for its own markup and a `display: contents`
 * host, so the rendered boxes are the ones the single component produced.
 */

import {
  Component,
  OnInit,
  computed,
  signal,
  inject,
  DestroyRef,
  ViewEncapsulation,
  PLATFORM_ID,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationService } from '../../services/translation.service';
import { CatalogService } from '../../services/catalog.service';
import { CatalogEntry, CatalogToolEntry } from '../../models/catalog.model';
import { ResourceFilters } from '../../models/ai-resource.model';
import { ContentFilterComponent } from '../../components/shared/content-filter.component';
import { SimpleCompareFabComponent } from '../../components/shared/simple-compare-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { GlossaryPopoverComponent } from '../../components/shared/glossary-popover.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CatalogStateService } from './catalog-state.service';
import { CatalogResultsComponent } from './catalog-results.component';
import { CatalogQuickFiltersComponent } from './catalog-quick-filters.component';
import {
  CatalogSortOrder,
  applyQuickFilters,
  pageWindow,
  sortCatalogEntries,
  toCatalogFilters,
} from './catalog-filtering';
import { CatalogCompareViewComponent } from './catalog-compare-view.component';
import { CatalogDetailsDrawerComponent } from './catalog-details-drawer.component';
import { CatalogSkeletonComponent } from './catalog-skeleton.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ContentFilterComponent,
    PageHeaderComponent,
    SimpleCompareFabComponent,
    FabStackComponent,
    SimpleEasyLanguageFabComponent,
    TableOfContentsFabComponent,
    ButtonModule,
    HighlightDirective,
    GlossaryPopoverComponent,
    CatalogResultsComponent,
    CatalogCompareViewComponent,
    CatalogDetailsDrawerComponent,
    CatalogSkeletonComponent,
    CatalogQuickFiltersComponent,
  ],
  template: `
    <div class="catalog-page">
      <!-- Header Section -->
      <div id="catalog-header">
        <app-page-header titleKey="catalog.title">
          <p class="ph-sub" [appHighlight]="translate('catalog.subtitle')">{{ translate('catalog.subtitle') }}</p>
        </app-page-header>
      </div>

      <!-- Content Filter Component -->
      <div id="catalog-filters">
        <app-content-filter
          [disclaimerKey]="'catalog.disclaimer'"
          [searchPlaceholderKey]="'catalog.filter.search'"
          [initialFilters]="currentFilters()"
          [showFavoritesButton]="false"
          (filtersChanged)="onFiltersChanged($event)"
        >
          <!-- Quick Filter Buttons projected into the filter card -->
          @if (!compareMode()) {
            <app-catalog-quick-filters
              [active]="activeQuickFilters()"
              [favoriteCount]="state.favoriteEntries().size"
              (toggled)="toggleQuickFilter($event)"
            />
          }
        </app-content-filter>
      </div>

      <!-- Compare Table View -->
      @if (compareMode() && state.compareTools().size > 0) {
        <app-catalog-compare-view
          [tools]="compareToolsList()"
          [count]="state.compareTools().size"
          (removed)="removeFromCompare($event)"
          (cleared)="clearCompareTools()"
          (closed)="toggleCompareMode()"
        />
      }

      <!-- Loading Skeleton -->
      @if (isLoading() && !compareMode()) {
        <app-catalog-skeleton />
      }

      <!-- Catalog Content -->
      @if (!compareMode() && !isLoading()) {
        <app-catalog-results
          [entries]="displayedEntries()"
          [total]="totalFilteredEntries()"
          [(sortOrder)]="sortOrder"
          (opened)="openEntryDetails($event)"
        />
      }

      <!-- Load More Section -->
      @if (hasMoreItems() && displayedEntries().length > 0 && !compareMode()) {
        <div class="load-more-section">
          @if (isLoadingMore()) {
            <div class="loading-more">
              <div class="loading-more-content">
                <i class="pi pi-spin pi-spinner loading-spinner"></i>
                <span class="loading-text">{{ translate('catalog.loadingMore') }}</span>
              </div>
            </div>
          }
          @if (!isLoadingMore()) {
            <p-button
              [label]="translate('catalog.loadMore')"
              icon="pi pi-angle-down"
              severity="secondary"
              [outlined]="true"
              size="large"
              (click)="loadMoreItems()"
              class="load-more-button"
            ></p-button>
          }
        </div>
      }

      <!-- No Results -->
      @if (totalFilteredEntries() === 0 && !isLoading()) {
        <div class="no-results">
          <i class="pi pi-search no-results-icon" aria-hidden="true"></i>
          <h3 [appHighlight]="translate('catalog.noResults.title')">{{ translate('catalog.noResults.title') }}</h3>
          <p>{{ translate('catalog.noResults.subtitle') }}</p>
        </div>
      }

      <!-- Entry Details Sidebar -->
      <app-catalog-details-drawer
        [selectedEntry]="selectedEntry()"
        [visible]="showDetailsModal()"
        [entries]="entries()"
        (closed)="closeEntryDetails()"
        (opened)="openEntryDetails($event)"
      />

      <!-- FAB Stack -->
      <app-fab-stack>
        <app-table-of-contents-fab [items]="tocItems()" [title]="translate('catalog.title')">
        </app-table-of-contents-fab>
        <app-simple-compare-fab
          [compareCount]="state.compareTools().size"
          [compareMode]="compareMode()"
          [labelKey]="'catalog.buttons.startCompare'"
          [tooltipKey]="'catalog.buttons.startCompare'"
          (compareTriggered)="onCompareTriggered($event)"
        >
        </app-simple-compare-fab>
        <app-simple-easy-language-fab contentId="ai-tools-catalog" contentType="article" [inStack]="true">
        </app-simple-easy-language-fab>
      </app-fab-stack>
    </div>

    <!-- Global Glossary Popover -->
    <app-glossary-popover></app-glossary-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-catalog .catalog-page {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem 2rem;
        font-family: var(--font-primary);
      }

      /* Quick Filters Section (projected inside filter card) */
      app-catalog .quick-filters-section {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--surface-border);
      }

      app-catalog .quick-filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
      }

      app-catalog .quick-filters p-button {
        flex-shrink: 0;
      }

      /* Card Grid */
      app-catalog .catalog-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
      }

      /* Entry Type Badge */
      app-catalog .entry-type-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-transform: uppercase;
      }

      app-catalog .entry-type-badge i {
        font-size: 0.7rem;
      }

      app-catalog .badge-tool {
        background: color-mix(in srgb, var(--blue-500) 10%, transparent);
        color: var(--blue-500);
        border: 1px solid color-mix(in srgb, var(--blue-500) 20%, transparent);
      }

      app-catalog .badge-resource {
        background: color-mix(in srgb, var(--green-500) 10%, transparent);
        color: var(--green-500);
        border: 1px solid color-mix(in srgb, var(--green-500) 20%, transparent);
      }

      /* Load More Section */
      app-catalog .load-more-section {
        text-align: center;
        padding: 2rem 1rem;
        margin-top: 2rem;
      }

      app-catalog .loading-more {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1.5rem;
      }

      app-catalog .loading-more-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-color-secondary);
      }

      app-catalog .loading-spinner {
        font-size: 1.2rem;
        color: var(--primary-color-fg);
      }

      app-catalog .loading-text {
        font-size: 0.95rem;
        font-weight: 500;
      }

      app-catalog .load-more-button {
        margin: 0 auto;
        min-width: 200px;
      }

      app-catalog .load-more-button .p-button {
        transition: all 0.3s ease;
        border: 2px solid var(--surface-border);
      }

      app-catalog .load-more-button .p-button:hover {
        border-color: var(--primary-color-fg);
        background: var(--primary-color);
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      app-catalog .no-results {
        text-align: center;
        padding: 3rem;
        color: var(--text-color-secondary);
      }

      app-catalog .no-results-icon {
        font-size: 3rem;
        color: var(--text-color-secondary);
        display: block;
        margin: 0 auto 1rem auto;
      }

      app-catalog .no-results h3 {
        margin: 1rem 0;
        color: var(--text-color);
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        app-catalog .catalog-page {
          padding: 1rem;
        }

        app-catalog .catalog-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        app-catalog .entry-type-badge {
          transition: none;
        }
      }

      /* High Contrast Mode Support */
      @media (prefers-contrast: high) {
        app-catalog .entry-type-badge {
          border-width: 2px;
        }
      }
    `,
  ],
})
export class CatalogComponent implements OnInit {
  // Injected services
  private translationService = inject(TranslationService);
  private catalogService = inject(CatalogService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);
  /** Favorites and the comparison list (persisted, part of the data export). */
  protected readonly state = inject(CatalogStateService);

  // Core state signals
  entries = signal<CatalogEntry[]>([]);
  _filters = signal<ResourceFilters>({
    searchTerm: '',
    mediaTypes: [],
    topics: [],
    difficulties: [],
    languages: [],
    onlyFree: false,
    minRating: undefined,
  });

  // Pagination
  currentPage = signal(1);
  readonly itemsPerPage = 50;
  isLoadingMore = signal(false);

  // Sort, compare mode and quick filters
  sortOrder = signal<CatalogSortOrder>('rating');
  compareMode = signal(false);
  activeQuickFilters = signal<Set<string>>(new Set());

  // Sidebar detail view
  selectedEntry = signal<CatalogEntry | null>(null);
  showDetailsModal = signal(false);

  // Loading state
  isLoading = computed(() => this.entries().length === 0);

  // Computed: full filtered dataset
  allFilteredEntries = computed(() => {
    // Service-level filtering, then the quick filters, then the sort.
    const filtered = this.catalogService.filterEntries([...this.entries()], toCatalogFilters(this._filters()));
    const narrowed = applyQuickFilters(filtered, this.activeQuickFilters(), this.state.favoriteEntries());
    return sortCatalogEntries(narrowed, this.sortOrder());
  });

  // Computed: paginated entries
  displayedEntries = computed(() => pageWindow(this.allFilteredEntries(), this.currentPage(), this.itemsPerPage));

  // Computed: has more items
  hasMoreItems = computed(() => {
    return this.displayedEntries().length < this.allFilteredEntries().length;
  });

  // Computed: total filtered count
  totalFilteredEntries = computed(() => this.allFilteredEntries().length);

  // Computed: compare tools list (only tool entries)
  compareToolsList = computed(() => {
    const compareIds = Array.from(this.state.compareTools());
    return this.entries().filter((e): e is CatalogToolEntry => e.entryType === 'tool' && compareIds.includes(e.id));
  });

  // Computed: current filters for template binding
  currentFilters = computed(() => this._filters());

  // Computed: Table of Contents items
  tocItems = computed<TocItem[]>(() => {
    return [
      { id: 'catalog-header', label: this.translate('catalog.title'), icon: 'pi pi-home' },
      { id: 'catalog-filters', label: this.translate('catalog.filter.search'), icon: 'pi pi-filter' },
      { id: 'catalog-results', label: this.translate('catalog.results.entries'), icon: 'pi pi-th-large' },
    ];
  });

  constructor() {
    // Handle URL query parameters for deep linking.
    // Der INITIALE ?search-Wert darf NICHT während der Hydration angewendet
    // werden: /catalog ist prerendert, und ein synchroner Filter mid-hydration
    // verkeilt die prerenderte @for-Liste (Glossar-Pattern, Incident 2026-06-08).
    let initialParamHandled = !isPlatformBrowser(this.platformId);
    afterNextRender(() => {
      const searchParam = this.route.snapshot.queryParamMap.get('search');
      if (searchParam) {
        this._filters.update((filters) => ({
          ...filters,
          searchTerm: searchParam,
        }));
      }
      initialParamHandled = true;
    });

    // Spätere Query-Param-Änderungen (SPA-Navigation) greifen sofort —
    // dann ist keine Hydration mehr im Flug.
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (!initialParamHandled) return; // Initialwert gehört afterNextRender
      const searchParam = params['search'];
      if (searchParam) {
        this._filters.update((filters) => ({
          ...filters,
          searchTerm: searchParam,
        }));
      }
    });

    this.destroyRef.onDestroy(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      // Reset body styles in case sidebar was open during navigation
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    });
  }

  // --- Lifecycle ---

  ngOnInit(): void {
    this.catalogService.catalog$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((entries) => {
      this.entries.set(entries);
    });
    this.state.load();
    this.setupScrollListener();
  }

  // --- Translation ---

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // --- Filter Handling ---

  onFiltersChanged(filters: ResourceFilters): void {
    this._filters.set(filters);
    this.currentPage.set(1);
  }

  // --- Quick Filters ---

  toggleQuickFilter(filterType: string): void {
    const filters = new Set(this.activeQuickFilters());
    if (filters.has(filterType)) {
      filters.delete(filterType);
    } else {
      filters.add(filterType);
    }
    this.activeQuickFilters.set(filters);
  }

  // --- Compare ---

  /** Removal from inside the compare view: below two tools there is nothing left to compare. */
  removeFromCompare(id: string): void {
    this.state.toggleCompare(id);
    if (this.state.compareTools().size < 2 && this.compareMode()) {
      this.compareMode.set(false);
    }
  }

  toggleCompareMode(): void {
    this.compareMode.set(!this.compareMode());
  }

  onCompareTriggered(_event: { count: number; event: Event }): void {
    this.toggleCompareMode();
  }

  clearCompareTools(): void {
    this.state.clearCompare();
    this.compareMode.set(false);
  }

  // --- Entry Details Sidebar ---

  openEntryDetails(entry: CatalogEntry): void {
    this.selectedEntry.set(entry);
    this.showDetailsModal.set(true);
  }

  closeEntryDetails(): void {
    this.selectedEntry.set(null);
    this.showDetailsModal.set(false);
    if (!isPlatformBrowser(this.platformId)) return;
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  // --- Pagination ---

  loadMoreItems(): void {
    if (this.isLoadingMore() || !this.hasMoreItems()) {
      return;
    }

    this.isLoadingMore.set(true);

    setTimeout(() => {
      this.currentPage.set(this.currentPage() + 1);
      this.isLoadingMore.set(false);
    }, 300);
  }

  private setupScrollListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollHandler = () => {
      const threshold = 200;
      const position = window.innerHeight + window.scrollY;
      const height = document.documentElement.offsetHeight;

      if (position >= height - threshold && this.hasMoreItems() && !this.isLoadingMore()) {
        this.loadMoreItems();
      }
    };

    let ticking = false;
    const throttledHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollHandler();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandler, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('scroll', throttledHandler));
  }
}
