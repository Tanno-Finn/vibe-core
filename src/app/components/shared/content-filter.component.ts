/**
 * Content Filter Component - Reusable filter component for AI-Resources and AI-Tools pages
 * Supports configurable disclaimer messages based on the context where it's used
 */

import {
  Component,
  computed,
  signal,
  inject,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';
import { MEDIA_TYPES, TOPICS, DIFFICULTIES, LANGUAGES, ResourceFilters } from '../../models/ai-resource.model';

// Optimus UI Imports - copied from AI-Resources
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { ChipModule } from '@openng/optimus-ui/chip';
import { TagModule } from '@openng/optimus-ui/tag';
import { BadgeModule } from '@openng/optimus-ui/badge';
import { DividerModule } from '@openng/optimus-ui/divider';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { AccordionModule } from '@openng/optimus-ui/accordion';
import { CheckboxModule } from '@openng/optimus-ui/checkbox';
import { MessageModule } from '@openng/optimus-ui/message';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { TabsModule } from '@openng/optimus-ui/tabs';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { RatingModule } from '@openng/optimus-ui/rating';
import { SliderModule } from '@openng/optimus-ui/slider';
import { SelectModule } from '@openng/optimus-ui/select';
import { MultiSelectModule } from '@openng/optimus-ui/multiselect';
import { ActiveFilterChipsComponent, ActiveFilterChip } from './active-filter-chips.component';

interface ContentFilters {
  mediaTypes: string[];
  topics: string[];
  difficulties: string[];
  languages: string[];
  onlyFree: boolean;
}

/** Keys of ContentFilters whose value is a string[] (i.e. all except onlyFree). */
type ArrayFilterKey = 'mediaTypes' | 'topics' | 'difficulties' | 'languages';

@Component({
  selector: 'app-content-filter',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ChipModule,
    TagModule,
    BadgeModule,
    DividerModule,
    TooltipModule,
    AccordionModule,
    CheckboxModule,
    MessageModule,
    SelectButtonModule,
    TabsModule,
    SkeletonModule,
    RatingModule,
    SliderModule,
    SelectModule,
    MultiSelectModule,
    ActiveFilterChipsComponent,
  ],
  template: `
    <!-- Disclaimer Message -->
    @if (!disclaimerDismissed()) {
      <p-message severity="secondary" [closable]="true" (onClose)="dismissDisclaimer()" styleClass="disclaimer-message">
        <ng-template #icon>
          <i class="pi pi-info-circle"></i>
        </ng-template>
        {{ translate(disclaimerKey) }}
      </p-message>
    }

    <!-- Filter Section -->
    <div class="filter-section">
      <!-- Search and Favorites Row -->
      <div class="search-favorites-row">
        <!-- Search Input -->
        <div class="search-container">
          <span class="p-input-icon-left search-wrapper" role="search">
            <i class="pi pi-search search-icon"></i>
            <input
              pInputText
              type="text"
              [ngModel]="searchTerm()"
              (ngModelChange)="onSearchTermChange($event)"
              [placeholder]="translate(searchPlaceholderKey)"
              [attr.aria-label]="translate(searchPlaceholderKey)"
              class="search-input"
            />
          </span>
        </div>

        <!-- Favorites Filter Button (optional, disabled in contexts that have their own) -->
        @if (showFavoritesButton) {
          <p-button
            [label]="'Nur Favoriten (' + favoriteCount + ')'"
            icon="pi pi-heart-fill"
            severity="secondary"
            size="small"
            [outlined]="!showOnlyFavorites"
            [disabled]="favoriteCount === 0"
            (click)="toggleFavorites()"
            class="favorites-button"
          ></p-button>
        }
      </div>

      <!-- Category Tags -->
      <div class="category-tags">
        @for (mediaType of mediaTypes(); track trackByKey($index, mediaType)) {
          <p-tag
            [value]="translate(mediaType.labelKey) + (isFilterActive('mediaTypes', mediaType.key) ? ' ✓' : '')"
            [icon]="mediaType.icon"
            [severity]="getFilterTagSeverity('mediaTypes', mediaType.key)"
            (click)="toggleFilter('mediaTypes', mediaType.key)"
            (keydown.enter)="toggleFilter('mediaTypes', mediaType.key)"
            (keydown.space)="toggleFilter('mediaTypes', mediaType.key)"
            class="category-tag"
            [attr.aria-label]="getTagAriaLabel('mediaTypes', mediaType.key, mediaType.labelKey)"
            [attr.aria-pressed]="isFilterActive('mediaTypes', mediaType.key)"
            tabindex="0"
            role="button"
          ></p-tag>
        }
      </div>

      <!-- Advanced Filters Toggle -->
      <div class="advanced-filters-toggle">
        <p-button
          [label]="
            showAdvancedFilters()
              ? translate('aiResources.filter.hideAdvanced')
              : translate('aiResources.filter.showAdvanced')
          "
          [icon]="showAdvancedFilters() ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          [outlined]="true"
          size="small"
          (onClick)="showAdvancedFilters.set(!showAdvancedFilters())"
          [attr.aria-expanded]="showAdvancedFilters()"
          [attr.aria-controls]="'advanced-filters-content'"
          styleClass="advanced-filters-button"
        ></p-button>
      </div>

      <!-- Advanced Tag Filters -->
      @if (showAdvancedFilters()) {
        <div class="tag-filters-container" id="advanced-filters-content">
          <div class="tag-filters-grid">
            <!-- Topic Filters -->
            <fieldset class="filter-group">
              <legend class="sr-only">{{ translate('aiResources.filter.topic') }}</legend>
              <h4 class="filter-group-title">
                <i class="pi pi-tags filter-group-icon"></i>
                {{ translate('aiResources.filter.topic') }}
              </h4>
              @for (topic of topics(); track trackByKey($index, topic)) {
                <div class="filter-options">
                  <div class="checkbox-wrapper">
                    <p-checkbox
                      [inputId]="'topic-' + topic.key"
                      [value]="topic.key"
                      [ngModel]="filters().topics"
                      (onChange)="toggleArrayFilter('topics', topic.key)"
                    ></p-checkbox>
                    <label [for]="'topic-' + topic.key" class="checkbox-label">
                      <i [class]="topic.icon"></i>
                      {{ translate(topic.labelKey) }}
                    </label>
                  </div>
                </div>
              }
            </fieldset>
            <!-- Difficulty Filters -->
            <fieldset class="filter-group">
              <legend class="sr-only">{{ translate('aiResources.filter.difficulty') }}</legend>
              <h4 class="filter-group-title">
                <i class="pi pi-star filter-group-icon"></i>
                {{ translate('aiResources.filter.difficulty') }}
              </h4>
              @for (difficulty of difficulties(); track trackByKey($index, difficulty)) {
                <div class="filter-options">
                  <div class="checkbox-wrapper">
                    <p-checkbox
                      [inputId]="'difficulty-' + difficulty.key"
                      [value]="difficulty.key"
                      [ngModel]="filters().difficulties"
                      (onChange)="toggleArrayFilter('difficulties', difficulty.key)"
                    ></p-checkbox>
                    <label [for]="'difficulty-' + difficulty.key" class="checkbox-label">
                      <i [class]="difficulty.icon"></i>
                      {{ translate(difficulty.labelKey) }}
                    </label>
                  </div>
                </div>
              }
            </fieldset>
            <!-- Language Filters -->
            <fieldset class="filter-group">
              <legend class="sr-only">{{ translate('aiResources.filter.language') }}</legend>
              <h4 class="filter-group-title">
                <i class="pi pi-globe filter-group-icon"></i>
                {{ translate('aiResources.filter.language') }}
              </h4>
              @for (language of languages(); track trackByKey($index, language)) {
                <div class="filter-options">
                  <div class="checkbox-wrapper">
                    <p-checkbox
                      [inputId]="'language-' + language.key"
                      [value]="language.key"
                      [ngModel]="filters().languages"
                      (onChange)="toggleArrayFilter('languages', language.key)"
                    ></p-checkbox>
                    <label [for]="'language-' + language.key" class="checkbox-label">
                      @if (language.key === 'de') {
                        <span class="language-tag">DE</span>
                      }
                      @if (language.key === 'en') {
                        <span class="language-tag">EN</span>
                      }
                      @if (language.key === 'multilingual') {
                        <i [class]="language.icon"></i>
                      }
                      {{ translate(language.labelKey) }}
                    </label>
                  </div>
                </div>
              }
            </fieldset>
            <!-- Access Filters -->
            <fieldset class="filter-group">
              <legend class="sr-only">{{ translate('aiResources.filter.access') }}</legend>
              <h4 class="filter-group-title">
                <i class="pi pi-lock filter-group-icon"></i>
                {{ translate('aiResources.filter.access') }}
              </h4>
              <div class="filter-options">
                <div class="checkbox-wrapper">
                  <p-checkbox
                    inputId="only-free"
                    [ngModel]="filters().onlyFree"
                    (onChange)="toggleBooleanFilter('onlyFree')"
                    [binary]="true"
                  ></p-checkbox>
                  <label for="only-free" class="checkbox-label">
                    <i class="pi pi-check"></i>
                    {{ translate('aiResources.filter.onlyFree') }}
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <!-- Clear Filters Action -->
          <div class="clear-filters-action">
            <p-button
              [label]="translate('aiResources.filter.clear')"
              icon="pi pi-times"
              severity="secondary"
              [outlined]="true"
              size="small"
              (onClick)="clearFilters()"
            ></p-button>
          </div>
        </div>
      }

      <!-- Projected content (e.g. quick-filter buttons from parent) -->
      <ng-content></ng-content>

      <!-- Active Filters.
           Each chip carries a real <button> for its ×: the previous <p-tag (click)>
           was reachable by mouse only — measured, the whole row held exactly one tab
           stop (the clear-all button) and the tags had no role, tabindex or name. -->
      @if (activeFilters().length > 0) {
        <div class="active-filters">
          <span class="filter-label" id="content-filter-active-label"
            >{{ translate('aiResources.filter.active') }}:</span
          >
          <app-active-filter-chips
            [chips]="activeFilterChips()"
            [groupLabel]="translate('aiResources.filter.active')"
            (remove)="onChipRemove($event)"
          />
          <p-button
            [label]="translate('aiResources.filter.clearAll')"
            icon="pi pi-times-circle"
            severity="secondary"
            size="small"
            [text]="true"
            (click)="clearAllFilters()"
          ></p-button>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Disclaimer Message Styling */
      app-content-filter .disclaimer-message {
        margin-bottom: 2rem;
      }

      app-content-filter .disclaimer-message .p-message {
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        color: var(--text-color-secondary);
        border-radius: var(--border-radius);
      }

      app-content-filter .disclaimer-message .p-message-icon {
        color: var(--primary-color-fg);
      }

      app-content-filter .filter-section {
        background: var(--surface-card);
        padding: 1.5rem;
        border-radius: var(--border-radius-lg);
        margin-bottom: 2rem;
        border: 1px solid var(--surface-border);
        border-top: 2px solid var(--primary-color);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
      }

      app-content-filter .search-favorites-row {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1rem;
      }

      app-content-filter .search-container {
        flex: 1;
        min-width: 0;
      }

      app-content-filter .search-wrapper {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
      }

      app-content-filter .favorites-button {
        flex-shrink: 0;
      }

      app-content-filter .search-input {
        width: 100%;
        font-size: 1rem;
        padding-left: 2.5rem !important;
        box-sizing: border-box;
      }

      app-content-filter .search-icon {
        position: absolute;
        left: 12px;
        color: var(--text-color-secondary);
        z-index: 2;
        pointer-events: none;
      }

      app-content-filter .category-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        margin-bottom: 1rem;
      }

      app-content-filter .category-tag {
        cursor: pointer;
        margin-right: 0.25rem;
        margin-bottom: 0.25rem;
        transition: all 0.3s ease;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        border-radius: var(--border-radius);
      }

      app-content-filter .category-tag:hover {
        filter: brightness(1.1);
      }

      /* Focus states for accessibility */
      .category-tag:focus,
      app-content-filter .category-tag:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        z-index: 10;
      }

      app-content-filter .category-tag .p-tag {
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        padding: 0.125rem 0.5rem;
      }

      /* Enhanced Tag Styles for Better Dark Mode Visibility with Color Inversion */
      app-content-filter .category-tag .p-tag.p-tag-secondary {
        background: var(--surface-card);
        color: var(--text-color-secondary);
        border: 2px solid var(--surface-border);
        font-weight: 500;
        transition: all 0.2s ease;
      }

      app-content-filter .category-tag .p-tag.p-tag-secondary:hover {
        border-color: var(--primary-color-fg);
        color: var(--text-color);
        transform: scale(1.02);
      }

      /* Selected items with primary colors */
      app-content-filter .category-tag .p-tag.p-tag-primary {
        background: var(--primary-color);
        color: var(--primary-color-text);
        border: 2px solid var(--primary-color);
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);
        transform: scale(1.02);
      }

      app-content-filter .category-tag .p-tag.p-tag-primary:hover {
        background: var(--primary-600);
        border-color: var(--primary-600);
        color: var(--primary-color-text);
        box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.4);
        transform: scale(1.04);
      }

      /* "All Categories" selected state with inverted colors */
      app-content-filter .category-tag .p-tag.p-tag-info {
        background: var(--surface-0);
        color: var(--text-color);
        border: 2px solid var(--blue-500);
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        transform: scale(1.02);
      }

      app-content-filter .category-tag .p-tag.p-tag-info:hover {
        background: var(--surface-50);
        border-color: var(--blue-600);
        color: var(--blue-500);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        transform: scale(1.04);
      }

      /* Advanced Filters Toggle */
      app-content-filter .advanced-filters-toggle {
        margin-top: 1rem;
        margin-bottom: 1rem;
        text-align: center;
      }

      app-content-filter .advanced-filters-button {
        transition: all 0.2s ease;
        border-radius: var(--border-radius);
      }

      app-content-filter .advanced-filters-button:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      app-content-filter .advanced-filters-button .p-button-label {
        font-weight: 500;
        font-size: 0.9rem;
      }

      app-content-filter .tag-filters-container {
        margin-top: 1rem;
        width: 100%;
        clear: both;
      }

      app-content-filter .tag-filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      /* <fieldset>, so the checkboxes inside are announced as one named group.
       Three UA defaults have to go for it to sit in the grid like the <div> did:
       the 2px inline margin, the inline padding, and 'min-inline-size: min-content',
       which otherwise refuses to shrink below the widest option label.
       NOTE: no backticks in this comment - it sits inside a template literal. */
      app-content-filter .filter-group {
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: 1rem;
        margin: 0;
        min-width: 0;
      }

      app-content-filter .filter-group-title {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      app-content-filter .filter-group-icon {
        font-size: 0.8rem;
        color: var(--primary-color-fg);
      }

      app-content-filter .filter-options {
        margin-bottom: 0.5rem;
      }

      app-content-filter .checkbox-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }

      app-content-filter .checkbox-label {
        font-size: 0.9rem;
        color: var(--text-color);
        line-height: 1.4;
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      app-content-filter .checkbox-label:hover {
        color: var(--primary-color-fg);
      }

      app-content-filter .language-tag {
        background: var(--primary-color);
        color: white;
        font-size: 0.7rem;
        font-weight: bold;
        padding: 0.1rem 0.3rem;
        border-radius: var(--border-radius);
        min-width: 20px;
        text-align: center;
      }

      /* Clear Filters Action */
      app-content-filter .clear-filters-action {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--surface-border);
        display: flex;
        justify-content: flex-end;
      }

      /* Active Filters */
      app-content-filter .active-filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--surface-border);
      }

      app-content-filter .filter-label {
        font-weight: 600;
        color: var(--text-color);
        margin-right: 0.5rem;
      }

      /* The chip row is one flex item in this row, not a block of its own. */
      app-content-filter .active-filters .active-filter-chips {
        margin-bottom: 0;
      }

      /* Responsive Design */

      /* Tablet Portrait: 768px - 1024px */
      @media (max-width: 1024px) and (min-width: 769px) {
        app-content-filter .tag-filters-grid {
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.75rem;
        }

        app-content-filter .filter-group {
          padding: 0.875rem;
        }
      }

      /* Mobile Landscape & Small Tablet: 481px - 768px */
      @media (max-width: 768px) and (min-width: 481px) {
        app-content-filter .filter-section {
          padding: 1rem;
        }

        app-content-filter .search-favorites-row {
          flex-direction: column;
          gap: 0.75rem;
        }

        app-content-filter .search-container {
          width: 100%;
        }

        app-content-filter .favorites-button {
          width: 100%;
        }

        app-content-filter .tag-filters-grid {
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.75rem;
        }

        app-content-filter .category-tags {
          justify-content: center;
          gap: 0.375rem;
        }

        app-content-filter .category-tag {
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }

        app-content-filter .filter-group {
          padding: 0.75rem;
        }

        app-content-filter .search-input {
          font-size: 1rem;
        }
      }

      /* Mobile Portrait: 320px - 480px */
      @media (max-width: 480px) {
        app-content-filter .filter-section {
          padding: 0.75rem;
          margin-bottom: 1.5rem;
        }

        app-content-filter .search-favorites-row {
          flex-direction: column;
          gap: 0.75rem;
        }

        app-content-filter .search-container {
          width: 100%;
        }

        app-content-filter .favorites-button {
          width: 100%;
        }

        app-content-filter .tag-filters-grid {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }

        app-content-filter .category-tags {
          justify-content: center;
          gap: 0.25rem;
        }

        app-content-filter .category-tag {
          margin-right: 0.125rem;
          margin-bottom: 0.125rem;
          flex: 0 1 auto;
        }

        app-content-filter .category-tag .p-tag {
          padding: 0.1rem 0.4rem;
          font-size: 0.8rem;
          min-height: 32px;
        }

        app-content-filter .filter-group {
          padding: 0.5rem;
          margin-bottom: 0.5rem;
        }

        app-content-filter .filter-group-title {
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        app-content-filter .checkbox-wrapper {
          margin-bottom: 0.5rem;
        }

        app-content-filter .checkbox-label {
          font-size: 0.85rem;
        }

        app-content-filter .search-input {
          font-size: 16px; /* Prevents zoom on iOS */
          padding-left: 2.25rem !important;
        }

        app-content-filter .search-icon {
          left: 12px;
        }

        app-content-filter .advanced-filters-button .p-button-label {
          font-size: 0.85rem;
        }

        app-content-filter .active-filters {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        app-content-filter .filter-label {
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }

        app-content-filter .active-filters .p-button {
          font-size: 0.8rem;
          padding: 0.375rem 0.75rem;
        }
      }

      /* Extra Small Mobile: below 320px */
      @media (max-width: 319px) {
        app-content-filter .filter-section {
          padding: 0.5rem;
        }

        app-content-filter .category-tags {
          flex-direction: column;
          align-items: stretch;
        }

        app-content-filter .category-tag {
          width: 100%;
          margin: 0 0 0.25rem 0;
          justify-content: center;
        }

        app-content-filter .category-tag .p-tag {
          width: 100%;
          justify-content: center;
          text-align: center;
        }

        app-content-filter .search-input {
          padding-left: 2rem !important;
        }
      }
    `,
  ],
})
export class ContentFilterComponent {
  private translationService = inject(TranslationService);

  // Input parameters
  @Input() disclaimerKey: string = 'aiResources.disclaimer';
  @Input() searchPlaceholderKey: string = 'aiResources.search.placeholder';
  @Input() initialFilters: ResourceFilters = {
    searchTerm: '',
    mediaTypes: [],
    topics: [],
    difficulties: [],
    languages: [],
    onlyFree: false,
    minRating: undefined,
  };
  @Input() favoriteCount: number = 0;
  @Input() showOnlyFavorites: boolean = false;
  @Input() showFavoritesButton: boolean = true;

  // Output events
  @Output() filtersChanged = new EventEmitter<ResourceFilters>();
  @Output() favoritesToggled = new EventEmitter<void>();

  // State management
  disclaimerDismissed = signal(false);
  showAdvancedFilters = signal(false);
  searchTerm = signal('');
  filters = signal<ContentFilters>({
    mediaTypes: ['all'], // "All Categories" is selected by default
    topics: [],
    difficulties: [],
    languages: [],
    onlyFree: false,
  });

  // Data from AI-Resources model with "All Categories" option added
  mediaTypes = computed(() => [
    { key: 'all', labelKey: 'aiResources.mediaType.all', icon: 'pi pi-list', color: 'primary' },
    ...MEDIA_TYPES,
  ]);
  topics = computed(() => TOPICS);
  difficulties = computed(() => DIFFICULTIES);
  languages = computed(() => LANGUAGES);

  // Active filters computed
  activeFilters = computed(() => {
    const active: Array<{ key: string; label: string; type: string }> = [];
    const currentFilters = this.filters();
    const currentSearchTerm = this.searchTerm();

    // Add search filter
    if (currentSearchTerm) {
      active.push({
        key: 'search',
        label: `${this.translationService.translate('aiResources.filter.search')}: "${currentSearchTerm}"`,
        type: 'search',
      });
    }

    // Add media type filters (skip "all" as it's the default state)
    currentFilters.mediaTypes.forEach((key) => {
      if (key !== 'all') {
        // Don't show "All Categories" in active filters
        const mediaType = this.mediaTypes().find((m) => m.key === key);
        if (mediaType) {
          active.push({
            key,
            label: this.translationService.translate(mediaType.labelKey),
            type: 'mediaTypes',
          });
        }
      }
    });

    // Add topic filters
    currentFilters.topics.forEach((key) => {
      const topic = this.topics().find((t) => t.key === key);
      if (topic) {
        active.push({
          key,
          label: this.translationService.translate(topic.labelKey),
          type: 'topics',
        });
      }
    });

    // Add difficulty filters
    currentFilters.difficulties.forEach((key) => {
      const difficulty = this.difficulties().find((d) => d.key === key);
      if (difficulty) {
        active.push({
          key,
          label: this.translationService.translate(difficulty.labelKey),
          type: 'difficulties',
        });
      }
    });

    // Add language filters
    currentFilters.languages.forEach((key) => {
      const language = this.languages().find((l) => l.key === key);
      if (language) {
        active.push({
          key,
          label: this.translationService.translate(language.labelKey),
          type: 'languages',
        });
      }
    });

    // Add free filter
    if (currentFilters.onlyFree) {
      active.push({
        key: 'onlyFree',
        label: this.translationService.translate('aiResources.filter.onlyFree'),
        type: 'access',
      });
    }

    return active;
  });

  /** OpenNG Icons class per filter family, for the chip's leading icon. */
  private static readonly CHIP_ICONS: Record<string, string> = {
    search: 'pi pi-search',
    mediaTypes: 'pi pi-tag',
    topics: 'pi pi-tags',
    difficulties: 'pi pi-star',
    languages: 'pi pi-globe',
    access: 'pi pi-lock',
  };

  /**
   * `activeFilters()` shaped for `<app-active-filter-chips>`, the kit's keyboard-
   * accessible chip row. The chip key is `type::key` because a plain key is not
   * unique across families (a language and a topic can both be `de`); `onChipRemove`
   * splits it again.
   */
  readonly activeFilterChips = computed<ActiveFilterChip[]>(() => {
    const removePrefix = this.translationService.translate('aiResources.filter.removeFilter');
    return this.activeFilters().map((f) => ({
      key: `${f.type}::${f.key}`,
      label: f.label,
      icon: ContentFilterComponent.CHIP_ICONS[f.type] ?? 'pi pi-filter',
      removeAriaLabel: `${removePrefix}: ${f.label}`,
    }));
  });

  /** Chip × → the existing removal path, with the composite key split back apart. */
  onChipRemove(compositeKey: string): void {
    const separator = compositeKey.indexOf('::');
    if (separator < 0) return;
    const type = compositeKey.slice(0, separator);
    const key = compositeKey.slice(separator + 2);
    this.removeFilter(key, type);
  }

  // Methods
  dismissDisclaimer() {
    this.disclaimerDismissed.set(true);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  onSearchChange() {
    // Search logic would go here
  }

  trackByKey(index: number, item: { key: string }): string {
    return item.key;
  }

  getFilterTagSeverity(type: string, key: string): 'success' | 'secondary' | 'info' {
    const currentFilters = this.filters();
    const filterArray = currentFilters[type as ArrayFilterKey];
    const isSelected = filterArray && filterArray.includes(key);

    // Special handling for 'all' category - use info severity when selected
    if (key === 'all' && isSelected) {
      return 'info';
    }

    return isSelected ? 'success' : 'secondary';
  }

  toggleFilter(type: string, key: string) {
    const currentFilters = this.filters();
    const filterArray = currentFilters[type as ArrayFilterKey];
    const index = filterArray.indexOf(key);

    const newFilters = { ...currentFilters };
    let newFilterArray = [...filterArray];

    // Special handling for mediaTypes with "all" option
    if (type === 'mediaTypes') {
      if (key === 'all') {
        // If clicking "all", clear all other selections and select only "all"
        newFilterArray = ['all'];
      } else {
        // If clicking specific category
        if (index > -1) {
          // Remove the specific category
          newFilterArray.splice(index, 1);
          // If no specific categories left, select "all"
          if (newFilterArray.length === 0 || (newFilterArray.length === 1 && newFilterArray[0] === 'all')) {
            newFilterArray = ['all'];
          }
        } else {
          // Add specific category and remove "all" if present
          const allIndex = newFilterArray.indexOf('all');
          if (allIndex > -1) {
            newFilterArray.splice(allIndex, 1);
          }
          newFilterArray.push(key);
        }
      }
    } else {
      // Default behavior for other filter types
      if (index > -1) {
        newFilterArray.splice(index, 1);
      } else {
        newFilterArray.push(key);
      }
    }

    newFilters[type as ArrayFilterKey] = newFilterArray;
    this.filters.set(newFilters);
    this.applyFilters();
  }

  toggleArrayFilter(type: string, key: string) {
    this.toggleFilter(type, key);
  }

  toggleBooleanFilter(key: string) {
    const currentFilters = this.filters();
    const newFilters = { ...currentFilters };
    newFilters[key as 'onlyFree'] = !currentFilters[key as 'onlyFree'];
    this.filters.set(newFilters);
    this.applyFilters();
  }

  onSearchTermChange(value: string) {
    this.searchTerm.set(value);
    this.applyFilters();
  }

  applyFilters() {
    // Convert internal filter format to ResourceFilters and emit
    const resourceFilters: ResourceFilters = this.convertToResourceFilters();
    this.filtersChanged.emit(resourceFilters);
  }

  private convertToResourceFilters(): ResourceFilters {
    const currentFilters = this.filters();

    // Convert internal format to ResourceFilters format
    let mediaTypes = currentFilters.mediaTypes;
    // Remove 'all' from mediaTypes if present, as it means no filter
    if (mediaTypes.includes('all')) {
      mediaTypes = [];
    }

    return {
      searchTerm: this.searchTerm(),
      mediaTypes,
      topics: currentFilters.topics,
      difficulties: currentFilters.difficulties,
      languages: currentFilters.languages,
      onlyFree: currentFilters.onlyFree,
      minRating: undefined,
    };
  }

  clearFilters() {
    this.filters.set({
      mediaTypes: ['all'], // Reset to "All Categories"
      topics: [],
      difficulties: [],
      languages: [],
      onlyFree: false,
    });
    this.applyFilters();
  }

  removeFilter(key: string, type: string) {
    if (type === 'search') {
      this.searchTerm.set('');
    } else if (type === 'access' && key === 'onlyFree') {
      const currentFilters = this.filters();
      this.filters.set({ ...currentFilters, onlyFree: false });
    } else {
      const currentFilters = this.filters();
      const filterArray = currentFilters[type as ArrayFilterKey];
      const index = filterArray.indexOf(key);
      if (index > -1) {
        const newFilters = { ...currentFilters };
        const newFilterArray = [...filterArray];
        newFilterArray.splice(index, 1);
        newFilters[type as ArrayFilterKey] = newFilterArray;
        this.filters.set(newFilters);
      }
    }
    this.applyFilters();
  }

  clearAllFilters() {
    this.searchTerm.set('');
    this.clearFilters();
  }

  toggleFavorites() {
    this.favoritesToggled.emit();
  }

  // Accessibility helper methods
  isFilterActive(type: string, key: string): boolean {
    const currentFilters = this.filters();
    const filterArray = currentFilters[type as ArrayFilterKey];
    return filterArray && filterArray.includes(key);
  }

  getTagAriaLabel(type: string, key: string, labelKey: string): string {
    const label = this.translate(labelKey);
    const isActive = this.isFilterActive(type, key);
    const status = isActive
      ? this.translate('aiResources.filter.selected')
      : this.translate('aiResources.filter.notSelected');
    return `${label} - ${status}`;
  }
}
