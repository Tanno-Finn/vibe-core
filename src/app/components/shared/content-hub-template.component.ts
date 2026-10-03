/**
 * ContentHubTemplateComponent
 *
 * Reusable template for content hub pages (Demos, Guides, Articles).
 * Provides consistent layout with search, filtering, and sorting.
 */
import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  effect,
  input,
  signal,
  inject,
  PLATFORM_ID,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Optimus UI imports
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { ChipModule } from '@openng/optimus-ui/chip';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { TagModule } from '@openng/optimus-ui/tag';

// Services
import { TranslationService } from '../../services/translation.service';

import { PageHeaderComponent } from './page-header.component';
import { dateLocaleFor } from '../../utils/date-locale';
import { foldForSearch } from '../../utils/search-fold';

/**
 * Configuration for the hub template
 */
export interface ContentHubConfig {
  /** Translation key for page title */
  titleKey: string;
  /** Translation key for page subtitle */
  subtitleKey: string;
  /** Translation key for CTA button label */
  ctaLabelKey: string;
  /** Optional query param 'from' value to pass when navigating to content */
  fromParam?: string;
}

/**
 * Content item structure
 */
export interface ContentItem {
  /** Unique identifier */
  id: string;
  /** Route path */
  path: string;
  /** Translation key for title */
  titleKey: string;
  /** Translation key for description */
  descriptionKey: string;
  /** Category for filtering */
  category: string;
  /** Difficulty level */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  /** Estimated time (e.g., "20min") */
  estimatedTime?: string;
  /** Whether to feature prominently */
  featured?: boolean;
  /** Icon class */
  icon?: string;
  /** Optional tags */
  tags?: string[];
  /** Draft status - hidden in production */
  draft?: boolean;
  /** Scheduled release date (ISO 'YYYY-MM-DD'). Filtered out of prod
   *  listings by the consuming service; in dev shown with a SCHEDULED tag. */
  publishDate?: string;
}

/**
 * How long the result count trails the last filter change before the live region
 * speaks it. Long enough to swallow a burst of keystrokes, short enough to still
 * read as the answer to the last one.
 */
export const RESULT_ANNOUNCE_DELAY_MS = 500;

@Component({
  selector: 'app-content-hub-template',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    SelectButtonModule,
    ChipModule,
    SkeletonModule,
    TagModule,
    PageHeaderComponent,
  ],
  template: `
    <div class="hub-container">
      <!-- Header Section -->
      <div class="hub-header" role="region" [attr.aria-label]="translate(config.titleKey)">
        <app-page-header [titleKey]="config.titleKey" [subtitleKey]="config.subtitleKey"></app-page-header>
        <div class="header-content">
          <!-- Search and Filters -->
          <div class="filters-section" role="search" [attr.aria-label]="translate('common.searchAndFilter')">
            <div class="search-container">
              <span class="p-input-icon-left search-wrapper">
                <i class="pi pi-search"></i>
                <input
                  type="text"
                  pInputText
                  [placeholder]="translate('common.search')"
                  [attr.aria-label]="translate('common.search')"
                  [ngModel]="searchTerm()"
                  (ngModelChange)="searchTerm.set($event)"
                  class="search-input"
                />
              </span>
            </div>

            @if (availableCategories().length > 1) {
              <div class="filter-chips" role="group" [attr.aria-label]="translate('common.filterByCategory')">
                @for (cat of availableCategories(); track cat) {
                  <button
                    class="filter-chip"
                    [class.active]="selectedCategory() === cat"
                    [attr.aria-pressed]="selectedCategory() === cat"
                    (click)="toggleCategory(cat)"
                  >
                    {{ translate('categories.' + cat) }}
                  </button>
                }
                <button
                  class="filter-chip"
                  [class.active]="!selectedCategory()"
                  [attr.aria-pressed]="!selectedCategory()"
                  (click)="selectedCategory.set(null)"
                >
                  {{ translate('common.all') }}
                </button>
              </div>
            }

            @if (availableDifficulties().length > 1) {
              <div
                class="filter-chips difficulty-chips"
                role="group"
                [attr.aria-label]="translate('common.filterByDifficulty')"
              >
                @for (diff of availableDifficulties(); track diff) {
                  <button
                    class="filter-chip difficulty-chip"
                    [class.active]="selectedDifficulty() === diff"
                    [attr.aria-pressed]="selectedDifficulty() === diff"
                    [class.beginner]="diff === 'beginner'"
                    [class.intermediate]="diff === 'intermediate'"
                    [class.advanced]="diff === 'advanced'"
                    (click)="toggleDifficulty(diff)"
                  >
                    {{ translate('difficulty.' + diff) }}
                  </button>
                }
              </div>
            }

            <div class="sort-wrapper">
              <p-selectbutton
                [options]="sortOptions()"
                [ngModel]="selectedSort()"
                (ngModelChange)="selectedSort.set($event)"
                optionLabel="label"
                optionValue="value"
                styleClass="sort-select-buttons"
                [attr.aria-label]="translate('common.sortBy')"
              >
              </p-selectbutton>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="hub-main">
        <!-- The page's one polite live region (hub-layout guide). Every p-skeleton
             is hard-coded aria-hidden="true", so the load needs this region:
             role="status" + aria-busy say it is mid-update while the data is in
             flight. Once the data has landed it reports how many cards survive the
             filters, trailing the last change by RESULT_ANNOUNCE_DELAY_MS so typing
             in the search field yields one announcement, not one per keystroke. -->
        <div
          class="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          [attr.aria-busy]="loading() ? 'true' : null"
        >
          @if (loading()) {
            {{ translate('common.loading') }}
          } @else if (loadFailed()) {
            {{ translate('common.loadError') }}
          } @else {
            {{ resultAnnouncement() }}
          }
        </div>

        <!-- Loading State -->
        @if (loading()) {
          <div class="loading-grid">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="skeleton-card">
                <p-skeleton height="200px"></p-skeleton>
                <p-skeleton width="60%" height="1.5rem"></p-skeleton>
                <p-skeleton width="100%" height="1rem"></p-skeleton>
                <p-skeleton width="80%" height="1rem"></p-skeleton>
              </div>
            }
          </div>
        }

        <!-- Load-failed State. It replaces the cards, so its heading takes the
             level the card titles have: h2 under the page header's h1. -->
        @if (!loading() && loadFailed()) {
          <div class="empty-state">
            <i class="pi pi-exclamation-triangle empty-icon" aria-hidden="true"></i>
            <h2>{{ translate('common.loadError') }}</h2>
            <p>{{ translate('common.loadErrorHint') }}</p>
            <button pButton (click)="retry.emit()" class="p-button-outlined">
              <span pButtonLabel>{{ translate('common.retry') }}</span>
            </button>
          </div>
        }

        <!-- Content Grid -->
        @if (!loading() && !loadFailed() && filteredItems().length > 0) {
          <div class="content-grid">
            @for (item of filteredItems(); track trackById($index, item)) {
              <article class="content-card" [class.featured]="item.featured">
                <div class="card-header">
                  <i [class]="item.icon || 'pi pi-box'" class="card-icon" aria-hidden="true"></i>
                  <div class="card-badges">
                    @if (item.draft) {
                      <p-tag
                        [value]="translate('lessons.draftBadge') || 'DRAFT'"
                        severity="warn"
                        [rounded]="true"
                        styleClass="draft-tag"
                      >
                      </p-tag>
                    }
                    @if (isScheduled(item)) {
                      <p-tag [value]="scheduledLabel(item)" severity="info" [rounded]="true" styleClass="scheduled-tag">
                      </p-tag>
                    }
                    @if (item.featured) {
                      <p-tag [value]="translate('common.featured')" severity="warn" [rounded]="true"> </p-tag>
                    }
                    @if (item.difficulty) {
                      <p-tag
                        [value]="translate('difficulty.' + item.difficulty)"
                        [severity]="getDifficultySeverity(item.difficulty)"
                        [rounded]="true"
                      >
                      </p-tag>
                    }
                  </div>
                </div>
                <div class="card-content">
                  <h2 class="card-title" [id]="cardTitleId(item)">{{ translate(item.titleKey) }}</h2>
                  <p class="card-description">{{ translate(item.descriptionKey) }}</p>
                  <div class="card-meta">
                    @if (item.estimatedTime) {
                      <span class="meta-item">
                        <i class="pi pi-clock" aria-hidden="true"></i>
                        {{ item.estimatedTime }}
                      </span>
                    }
                    <span class="meta-item category-badge">
                      {{ translate('categories.' + item.category) }}
                    </span>
                  </div>
                </div>
                <div class="card-actions">
                  <!-- A real link, not a button: the card navigates, so the prerendered
                       HTML carries an href and middle-click, open-in-new-tab and
                       copy-link keep working. Every CTA reads the same, so the card
                       title describes which card it belongs to. -->
                  <a
                    pButton
                    [routerLink]="['/' + item.path]"
                    [queryParams]="config.fromParam ? { from: config.fromParam } : {}"
                    [attr.aria-describedby]="cardTitleId(item)"
                    class="cta-button p-button-outlined"
                  >
                    <span pButtonLabel>{{ translate(config.ctaLabelKey) }}</span
                    ><i class="pi pi-arrow-right" pButtonIcon aria-hidden="true"></i>
                  </a>
                </div>
              </article>
            }
          </div>
        }

        <!-- Empty State (data loaded, nothing matched); h2 like the cards it replaces. -->
        @if (!loading() && !loadFailed() && filteredItems().length === 0) {
          <div class="empty-state">
            <i class="pi pi-inbox empty-icon" aria-hidden="true"></i>
            <h2>{{ translate('common.noResults') }}</h2>
            <p>{{ translate('common.tryDifferentFilter') }}</p>
            <button pButton (click)="clearFilters()" class="p-button-outlined">
              <span pButtonLabel>{{ translate('common.clearFilters') }}</span>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-content-hub-template .hub-container {
        max-width: var(--container-section);
        margin: 0 auto;
        padding: var(--space-6) var(--space-4);
        min-height: 100vh;
      }

      /* Header */
      app-content-hub-template .hub-header {
        text-align: center;
        margin-bottom: var(--space-8);
        padding: var(--space-8) var(--space-4);
        background: linear-gradient(135deg, var(--surface-0), var(--surface-50));
        border-radius: 16px;
        border: 1px solid var(--surface-border);
      }

      /* Filters */
      app-content-hub-template .filters-section {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: var(--space-4);
      }

      app-content-hub-template .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      app-content-hub-template .search-wrapper > i {
        position: absolute;
        left: 12px;
        color: var(--text-color-secondary);
        z-index: 1;
      }

      app-content-hub-template .search-input {
        min-width: 280px;
        padding-left: 2.5rem !important;
      }

      app-content-hub-template .filter-chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      app-content-hub-template .filter-chip {
        padding: var(--space-2) var(--space-3);
        border: 1px solid var(--surface-border);
        border-radius: 20px;
        background: var(--surface-card);
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.85rem;
      }

      app-content-hub-template .filter-chip:hover {
        border-color: var(--primary-color-fg);
      }

      app-content-hub-template .filter-chip.active {
        background: var(--primary-color);
        border-color: var(--primary-color-fg);
        color: white;
      }

      app-content-hub-template .filter-chip:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Difficulty filter chips */
      app-content-hub-template .difficulty-chips {
        margin-top: var(--space-2);
      }

      app-content-hub-template .difficulty-chip.beginner {
        border-color: var(--green-500);
      }
      .difficulty-chip.beginner:hover,
      app-content-hub-template .difficulty-chip.beginner.active {
        background: var(--green-500);
        border-color: var(--green-500);
        color: white;
      }

      app-content-hub-template .difficulty-chip.intermediate {
        border-color: var(--blue-500);
      }
      .difficulty-chip.intermediate:hover,
      app-content-hub-template .difficulty-chip.intermediate.active {
        background: var(--blue-500);
        border-color: var(--blue-500);
        color: white;
      }

      app-content-hub-template .difficulty-chip.advanced {
        border-color: var(--orange-500);
      }
      .difficulty-chip.advanced:hover,
      app-content-hub-template .difficulty-chip.advanced.active {
        background: var(--orange-500);
        border-color: var(--orange-500);
        color: white;
      }

      app-content-hub-template .sort-select-buttons .p-button {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
      }

      /* Content Grid */
      app-content-hub-template .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
        gap: var(--space-6);
      }

      app-content-hub-template .loading-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
        gap: var(--space-6);
      }

      app-content-hub-template .skeleton-card {
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        background: var(--surface-card);
      }

      /* Content Card */
      app-content-hub-template .content-card {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        background: var(--surface-card);
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      app-content-hub-template .content-card:hover {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
      }

      app-content-hub-template .content-card.featured {
        border-color: var(--primary-color-fg);
        border-width: 2px;
      }

      app-content-hub-template .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: var(--space-4);
        background: var(--surface-ground);
      }

      app-content-hub-template .card-icon {
        font-size: 2rem;
        color: var(--primary-color-fg);
      }

      app-content-hub-template .card-badges {
        display: flex;
        gap: var(--space-2);
      }

      app-content-hub-template .card-content {
        flex: 1;
        padding: var(--space-4);
      }

      app-content-hub-template .card-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: var(--space-2);
        color: var(--text-color);
      }

      app-content-hub-template .card-description {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        line-height: 1.6;
        margin-bottom: var(--space-4);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      app-content-hub-template .card-meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      app-content-hub-template .meta-item {
        display: flex;
        align-items: center;
        gap: var(--space-1);
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        padding: var(--space-1) var(--space-2);
        background: var(--surface-100);
        border-radius: 12px;
      }

      app-content-hub-template .category-badge {
        background: var(--accent-surface);
        color: var(--accent-on-surface);
      }

      app-content-hub-template .card-actions {
        padding: var(--space-4);
        border-top: 1px solid var(--surface-border);
      }

      app-content-hub-template .cta-button {
        width: 100%;
        text-decoration: none;
      }

      /* Empty State */
      app-content-hub-template .empty-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-color-secondary);
      }

      app-content-hub-template .empty-icon {
        font-size: 4rem;
        margin-bottom: var(--space-4);
      }

      app-content-hub-template .empty-state h2 {
        font-size: 1.5rem;
        margin-bottom: var(--space-2);
        color: var(--text-color);
      }

      app-content-hub-template .empty-state p {
        margin-bottom: var(--space-4);
      }

      /* Responsive */
      @media (max-width: 768px) {
        app-content-hub-template .hub-header {
          padding: var(--space-4);
        }

        app-content-hub-template .filters-section {
          flex-direction: column;
        }

        app-content-hub-template .search-input {
          min-width: 100%;
        }

        app-content-hub-template .filters-section > p-selectbutton {
          display: flex !important;
          flex-wrap: wrap !important;
          max-width: 100%;
          gap: 4px;
        }

        app-content-hub-template .filters-section p-togglebutton {
          flex: 1 1 auto;
          min-width: 0;
        }

        app-content-hub-template .content-grid,
        app-content-hub-template .loading-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Dark Theme */
      .dark-theme app-content-hub-template .hub-header {
        background: linear-gradient(135deg, var(--surface-100), var(--surface-200));
      }

      .dark-theme app-content-hub-template .card-header {
        background: var(--surface-200);
      }
    `,
  ],
})
export class ContentHubTemplateComponent {
  @Input() config!: ContentHubConfig;
  /** Signal input: a plain @Input read inside computed() would freeze the
   *  computeds at their first (empty) value — no signal read, no re-run. */
  items = input<ContentItem[]>([]);
  @Input() loading = signal(false);
  /** Load failed (network/parse error) — renders a retry state distinct
   *  from "nothing matched the filters". */
  @Input() loadFailed = signal(false);
  /** Emitted by the load-failed state's retry button. */
  @Output() retry = new EventEmitter<void>();

  private translationService = inject(TranslationService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * The result count the live region speaks, or null while there is nothing to
   * say. It trails `filteredItems()` by RESULT_ANNOUNCE_DELAY_MS, and is cleared
   * while data is in flight or failed, so a stale count never follows a reload.
   * Browser-only: the prerendered HTML carries an empty region, not a count.
   */
  private announcedCount = signal<number | null>(null);

  /** Live-region text for the settled result count; '' until there is one. */
  resultAnnouncement = computed(() => {
    const count = this.announcedCount();
    if (count === null) return '';
    return this.translate('common.resultCount')
      .replace('{{count}}', String(count))
      .replace('{{total}}', String(this.items().length));
  });

  constructor() {
    effect((onCleanup) => {
      const count = this.filteredItems().length;
      if (this.loading() || this.loadFailed() || !this.isBrowser) {
        this.announcedCount.set(null);
        return;
      }
      const timer = setTimeout(() => this.announcedCount.set(count), RESULT_ANNOUNCE_DELAY_MS);
      onCleanup(() => clearTimeout(timer));
    });
  }

  // Filter state - all signals for reactivity
  searchTerm = signal('');
  selectedCategory = signal<string | null>(null);
  selectedDifficulty = signal<string | null>(null);
  selectedSort = signal('featured');

  // Computed: available categories from items
  availableCategories = computed(() => {
    return [...new Set(this.items().map((i) => i.category))];
  });

  // Computed: available difficulties from items
  availableDifficulties = computed(() => {
    return [
      ...new Set(
        this.items()
          .map((i) => i.difficulty)
          .filter(Boolean),
      ),
    ] as string[];
  });

  // Computed: filtered and sorted items
  filteredItems = computed(() => {
    let result = [...this.items()];
    const searchValue = this.searchTerm();
    const sortValue = this.selectedSort();

    // Search filter
    // Folded on both sides, so an Easy-German "Sprach·modell" is found by "Sprachmodell".
    const search = foldForSearch(searchValue.trim());
    if (search) {
      result = result.filter(
        (item) =>
          foldForSearch(this.translate(item.titleKey)).includes(search) ||
          foldForSearch(this.translate(item.descriptionKey)).includes(search),
      );
    }

    // Category filter
    if (this.selectedCategory()) {
      result = result.filter((item) => item.category === this.selectedCategory());
    }

    // Difficulty filter
    if (this.selectedDifficulty()) {
      result = result.filter((item) => item.difficulty === this.selectedDifficulty());
    }

    // Sorting
    switch (sortValue) {
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'title':
        result.sort((a, b) => this.translate(a.titleKey).localeCompare(this.translate(b.titleKey)));
        break;
      case 'time':
        result.sort((a, b) => this.estimatedMinutes(a) - this.estimatedMinutes(b));
        break;
    }

    return result;
  });

  // Sort options
  sortOptions = computed(() => [
    { label: this.translate('sort.featured'), value: 'featured' },
    { label: this.translate('sort.title'), value: 'title' },
    { label: this.translate('sort.time'), value: 'time' },
  ]);

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  toggleCategory(category: string): void {
    if (this.selectedCategory() === category) {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(category);
    }
  }

  toggleDifficulty(difficulty: string): void {
    if (this.selectedDifficulty() === difficulty) {
      this.selectedDifficulty.set(null);
    } else {
      this.selectedDifficulty.set(difficulty);
    }
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set(null);
    this.selectedDifficulty.set(null);
  }

  getDifficultySeverity(difficulty: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'info';
      case 'advanced':
        return 'warn';
      default:
        return 'info';
    }
  }

  trackById(index: number, item: ContentItem): string {
    return item.id;
  }

  /** Per-item heading id: a static id inside a card would repeat once per card. */
  cardTitleId(item: ContentItem): string {
    return 'hub-card-title-' + item.id;
  }

  /**
   * estimatedTime normalized to minutes for sorting: "20min" → 20, "1h" → 60.
   * Unparseable values ("varies") sort last — bare parseInt turned them into
   * NaN, which poisons every comparison it appears in.
   */
  private estimatedMinutes(item: ContentItem): number {
    const m = /(\d+)\s*(h|min)?/i.exec(item.estimatedTime ?? '');
    if (!m) return Number.MAX_SAFE_INTEGER;
    const n = parseInt(m[1], 10);
    return (m[2] || '').toLowerCase() === 'h' ? n * 60 : n;
  }

  /**
   * Item has a publishDate in the future. In prod, scheduled items are
   * already filtered out of `filteredItems()` by the consuming service —
   * this gate only fires in dev (author preview).
   */
  isScheduled(item: ContentItem): boolean {
    if (!item.publishDate) return false;
    // Date-only or full ISO — appending 'T00:00:00' to full ISO (demo dates)
    // yields Invalid Date: NaN comparisons made this gate silently pass.
    return this.parsePublishDate(item.publishDate).getTime() > Date.now();
  }

  scheduledLabel(item: ContentItem): string {
    if (!item.publishDate) return '';
    const d = this.parsePublishDate(item.publishDate);
    const date = d.toLocaleDateString(dateLocaleFor(this.translationService.currentIntlLocale), {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const prefix = this.translate('lessons.scheduledBadge') || 'SCHEDULED';
    return `${prefix} ${date}`;
  }

  private parsePublishDate(publishDate: string): Date {
    return new Date(publishDate.includes('T') ? publishDate : publishDate + 'T00:00:00');
  }
}
