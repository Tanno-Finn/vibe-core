/**
 * Glossary Component
 *
 * AI terminology and definitions with interactive features.
 *
 * Features:
 * - Reactive translations with signal-based language switching
 * - AI term highlighting with interactive popovers
 * - Modern Angular patterns (signals, computed, takeUntilDestroyed)
 * - Proper RxJS patterns and memory management
 * - Responsive design with loading states
 * - Advanced filtering and search functionality
 */
import {
  Component,
  computed,
  signal,
  inject,
  ViewEncapsulation,
  PLATFORM_ID,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { HighlightingService } from '../../services/highlighting.service';
import { ToastService } from '../../services/toast.service';
import { GlossaryService, GlossaryEntry } from '../../services/glossary.service';
import { UnifiedContentService } from '../../services/unified-content.service';

// Optimus UI Imports
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TagModule } from '@openng/optimus-ui/tag';
import { SelectModule, SelectChangeEvent } from '@openng/optimus-ui/select';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { CardModule } from '@openng/optimus-ui/card';
import { ChipModule } from '@openng/optimus-ui/chip';
import { BadgeModule } from '@openng/optimus-ui/badge';
import { DividerModule } from '@openng/optimus-ui/divider';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { AccordionModule } from '@openng/optimus-ui/accordion';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { InputGroupModule } from '@openng/optimus-ui/inputgroup';
import { InputGroupAddonModule } from '@openng/optimus-ui/inputgroupaddon';

// Universal Highlighting System
import { HighlightDirective } from '../../directives/highlight.directive';
import { GlossaryPopoverComponent } from '../../components/shared/glossary-popover.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';

// FAB Components
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';

// Related-Refs (universal cross-content links)
import { RelatedRefsComponent } from '../../components/shared/related-refs.component';

// Active-filter chips (shared with the AI-timeline filter sidebar)
import { ActiveFilterChipsComponent, ActiveFilterChip } from '../../components/shared/active-filter-chips.component';
import { foldForSearch } from '../../utils/search-fold';
import { scrollBehavior } from '../../utils/reduced-motion';
import { translatedOr } from '../../utils/translate-or';

@Component({
  selector: 'app-glossary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    SelectModule,
    SkeletonModule,
    CardModule,
    ChipModule,
    BadgeModule,
    DividerModule,
    TooltipModule,
    AccordionModule,
    SelectButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    HighlightDirective,
    GlossaryPopoverComponent,
    PageHeaderComponent,
    SimpleEasyLanguageFabComponent,
    TableOfContentsFabComponent,
    FabStackComponent,
    RelatedRefsComponent,
    ActiveFilterChipsComponent,
  ],
  template: `
    <div class="glossary-page">
      <!-- CP-2: Live region outside sidebar for mobile accessibility.
           Stays SILENT while the entries are still loading or the load failed:
           bound to not-yet-arrived data it used to announce "0 of 0 terms", which
           is worse than saying nothing. The skeleton container announces the load,
           this region announces the result. -->
      <div class="sr-only" aria-live="polite" aria-atomic="true">
        @if (!isLoadingEntries() && !entriesLoadFailed()) {
          {{ filteredEntries().length }} {{ ofLabel() }} {{ allEntries().length }} {{ termsLabel() }}
        }
      </div>

      <!-- Header -->
      <app-page-header titleKey="glossary.title">
        <p class="ph-sub" [appHighlight]="pageDescription()">{{ pageDescription() }}</p>
      </app-page-header>

      <!-- Main Content Layout with Sidebar -->
      <div class="content-layout">
        <!-- Sticky Sidebar with Filters (copied from original glossary) -->
        <aside class="filter-sidebar" [attr.aria-label]="translate('glossary.filters.title')">
          <div class="sidebar-content">
            <!-- Search Bar -->
            <div class="sidebar-section">
              <h2 class="sidebar-title"><i class="pi pi-search"></i> {{ searchLabel() }}</h2>
              <p-inputgroup>
                <p-inputgroup-addon>
                  <i class="pi pi-search"></i>
                </p-inputgroup-addon>
                <label for="glossary-search-input" class="sr-only">{{ searchLabel() }}</label>
                <input
                  id="glossary-search-input"
                  type="text"
                  pInputText
                  [value]="searchQuery()"
                  [placeholder]="searchPlaceholder()"
                  (input)="onSearchInput($event)"
                  class="search-field"
                  [attr.aria-label]="searchLabel()"
                />
                @if (searchQuery()) {
                  <p-inputgroup-addon>
                    <button
                      class="clear-search-btn"
                      (click)="clearSearch()"
                      [attr.aria-label]="clearSearchLabel()"
                      type="button"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  </p-inputgroup-addon>
                }
              </p-inputgroup>
            </div>

            <!-- Category Filter -->
            <div class="sidebar-section">
              <h2 id="category-filter-label" class="sidebar-title"><i class="pi pi-tags"></i> {{ categoryLabel() }}</h2>
              <!-- [ariaLabelledBy] (the Input), not [attr.aria-labelledby]: p-select's
                   focusable element is a <span role="combobox"> inside the host, so a host
                   attribute is ignored and the current value gets announced as the name. -->
              <p-select
                [ngModel]="selectedCategory()"
                [options]="categoryOptions()"
                optionLabel="label"
                optionValue="value"
                [placeholder]="categoryPlaceholder()"
                (onChange)="onCategoryChange($event)"
                styleClass="sidebar-dropdown"
                [style]="{ width: '100%' }"
                [ariaLabelledBy]="'category-filter-label'"
              ></p-select>
            </div>

            <!-- Sort Options -->
            <div class="sidebar-section">
              <h2 id="sort-filter-label" class="sidebar-title"><i class="pi pi-sort"></i> {{ sortLabel() }}</h2>
              <p-select
                [ngModel]="sortOption()"
                [options]="sortOptions()"
                optionLabel="label"
                optionValue="value"
                [placeholder]="sortPlaceholder()"
                (onChange)="onSortChange($event)"
                styleClass="sidebar-dropdown"
                [style]="{ width: '100%' }"
                [ariaLabelledBy]="'sort-filter-label'"
              ></p-select>
            </div>

            <!-- A-Z Navigation -->
            <div class="sidebar-section">
              <h2 class="sidebar-title"><i class="pi pi-list"></i> {{ alphabetNavigationLabel() }}</h2>
              <nav class="alphabet-buttons" [attr.aria-label]="alphabetNavigationLabel()">
                @for (letter of alphabetLetters(); track $index) {
                  <button
                    type="button"
                    class="alphabet-btn"
                    [class.active]="selectedLetter() === letter"
                    [class.disabled]="!availableLetters().has(letter)"
                    [attr.aria-pressed]="selectedLetter() === letter"
                    [attr.aria-disabled]="!availableLetters().has(letter)"
                    [disabled]="!availableLetters().has(letter)"
                    (click)="selectLetter(letter)"
                    [attr.aria-label]="translate('glossary.filters.letterButton') + ' ' + letter"
                  >
                    {{ letter }}
                  </button>
                }
                <button
                  type="button"
                  class="alphabet-btn reset-btn"
                  [class.active]="selectedLetter() === ''"
                  [attr.aria-pressed]="selectedLetter() === ''"
                  (click)="selectLetter('')"
                  [attr.aria-label]="showAllLettersLabel()"
                >
                  {{ allLabel() }}
                </button>
              </nav>
            </div>

            <!-- Active Filter Chips (one removable chip per active filter) -->
            @if (activeFilterChips().length > 0) {
              <div class="sidebar-section">
                <h2 class="sidebar-title"><i class="pi pi-filter"></i> {{ activeFiltersLabel() }}</h2>
                <app-active-filter-chips
                  [chips]="activeFilterChips()"
                  [groupLabel]="activeFiltersLabel()"
                  (remove)="removeFilterChip($event)"
                ></app-active-filter-chips>
              </div>
            }

            <!-- Results Info & Clear Filters -->
            <div class="sidebar-section">
              @if (filteredEntries().length > 0 || allEntries().length > 0) {
                <div class="results-info">
                  <div aria-live="polite" aria-atomic="true">
                    <span class="results-count"
                      >{{ filteredEntries().length }} {{ ofLabel() }} {{ allEntries().length }} {{ termsLabel() }}</span
                    >
                  </div>
                  <p-button
                    [label]="clearAllLabel()"
                    icon="pi pi-refresh"
                    severity="secondary"
                    size="small"
                    (click)="clearAllFilters()"
                    [style]="{ width: '100%', 'margin-top': '0.5rem' }"
                  ></p-button>
                </div>
              }
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="main-content">
          <!-- Loading Skeletons.
               role="status" + aria-busy make the container a polite live region that
               is mid-update; the sr-only line gives it something to say, because every
               p-skeleton is hard-coded aria-hidden="true" and contributes nothing. -->
          @if (isLoadingEntries()) {
            <div class="glossary-entries" role="status" aria-busy="true">
              <span class="sr-only">{{ loadingLabel() }}</span>
              @for (item of [1, 2, 3, 4, 5, 6]; track item) {
                <div class="entry-card">
                  <div class="entry-header">
                    <div class="skeleton-title-section">
                      <p-skeleton width="70%" height="1.25rem"></p-skeleton>
                    </div>
                    <p-skeleton width="80px" height="1.2rem" borderRadius="12px"></p-skeleton>
                  </div>
                  <div class="entry-content">
                    <p-skeleton width="100%" height="1.2rem"></p-skeleton>
                    <p-skeleton width="98%" height="1.2rem"></p-skeleton>
                    <p-skeleton width="92%" height="1.2rem"></p-skeleton>
                    <p-skeleton width="85%" height="1.2rem"></p-skeleton>
                    <p-skeleton width="40%" height="1rem"></p-skeleton>
                    <p-skeleton width="30%" height="1rem"></p-skeleton>
                    <p-skeleton width="88%" height="1rem"></p-skeleton>
                    <p-skeleton width="75%" height="1rem"></p-skeleton>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Load Failure. A failed fetch is not an empty glossary and not a
               pending one — it gets its own state and a way out. -->
          @if (entriesLoadFailed()) {
            <div class="no-results" role="alert">
              <p class="no-results-text">{{ loadErrorText() }}</p>
              <p class="no-results-hint">{{ loadErrorHintText() }}</p>
              <p-button
                [label]="retryLabel()"
                icon="pi pi-refresh"
                severity="secondary"
                (click)="retryLoad()"
              ></p-button>
            </div>
          }

          <!-- No Results Message -->
          @if (!isLoadingEntries() && filteredEntries().length === 0 && allEntries().length > 0) {
            <div class="no-results">
              <p class="no-results-text">{{ noResultsText() }}</p>
              <p-button
                [label]="clearAllLabel()"
                icon="pi pi-refresh"
                severity="secondary"
                (click)="clearAllFilters()"
              ></p-button>
            </div>
          }

          <!-- Glossary Entries with V2 Highlighting - Grouped by Letter -->
          @if (!isLoadingEntries() && filteredEntries().length > 0) {
            <div class="glossary-entries">
              <!-- Letter Groups -->
              @for (group of entriesByLetter(); track trackByGroupLetter($index, group)) {
                <div class="letter-group">
                  <!-- Letter Header -->
                  <h2 [id]="'letter-' + group.letter" class="letter-header">{{ group.letter }}</h2>
                  <!-- Entries for this letter -->
                  @for (entry of group.entries; track trackByEntryId($index, entry)) {
                    <div class="entry-card" [id]="'entry-' + entry.id">
                      <div class="entry-header">
                        <h3 class="entry-term">{{ entry.term }}</h3>
                        <div class="entry-badges">
                          <span class="category-badge category-{{ entry.category }}">
                            {{ getCategoryLabel(entry.category) }}
                          </span>
                        </div>
                      </div>
                      <div class="entry-content">
                        <!-- Definition with appHighlight Directive — suppress self-link to current entry -->
                        <div class="entry-definition" [appHighlight]="entry.definition" [suppressEntryId]="entry.id">
                          {{ entry.definition }}
                        </div>
                        <!-- Alternative Names: NOT highlighted — they are synonyms of the current entry, linking out would be incoherent -->
                        @if (entry.alternativeNames?.length) {
                          <div class="alternative-names">
                            <strong>{{ alternativeNamesLabel() }}:</strong>
                            <span class="alt-names-list">{{ entry.alternativeNames?.join(', ') }}</span>
                          </div>
                        }
                        <!-- Example -->
                        @if (entry.example) {
                          <div class="entry-example">
                            <strong>{{ exampleLabel() }}:</strong>
                            <p class="example-text">{{ entry.example }}</p>
                          </div>
                        }
                        <!-- Related Refs — hybrid: ontology neighbors + editorial
                             pins (V2 types tools/resources/external from entry.related). -->
                        <app-related-refs
                          density="compact-inline"
                          [forNode]="{ type: 'glossary', id: entry.id }"
                          [refs]="entry.related ?? null"
                          [mapTrigger]="true"
                        >
                        </app-related-refs>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>

    <!-- FAB Stack: Table of Contents & Easy Language -->
    <app-fab-stack>
      <app-table-of-contents-fab [items]="tocItems()" [title]="translate('glossary.tableOfContents')">
      </app-table-of-contents-fab>

      <app-simple-easy-language-fab contentId="glossary" contentType="article"> </app-simple-easy-language-fab>
    </app-fab-stack>

    <!-- Universal Popover System -->
    <app-glossary-popover></app-glossary-popover>
  `,
  styles: [
    `
      app-glossary .glossary-page {
        max-width: var(--container-section);
        margin: 0 auto;
        padding: 0 1.5rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      /* Main Layout with Sidebar */
      app-glossary .content-layout {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
      }

      /* Sticky Sidebar */
      app-glossary .filter-sidebar {
        flex: 0 0 300px;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        position: sticky;
        top: 1rem;
        max-height: calc(100vh - 2rem);
        overflow-y: auto;
      }

      /* Responsive Layout - Mobile */
      @media (max-width: 1024px) {
        app-glossary .content-layout {
          flex-direction: column;
          gap: 1.5rem;
        }

        app-glossary .filter-sidebar {
          position: static;
          flex: 1 1 auto;
          width: 100%;
          max-height: none;
          order: -1; /* Move sidebar above main content */
        }

        app-glossary .main-content {
          order: 1;
        }
      }

      app-glossary .sidebar-content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      app-glossary .sidebar-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      app-glossary .sidebar-title {
        color: var(--text-color);
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--surface-border);
      }

      app-glossary .sidebar-title i {
        color: var(--primary-color-fg);
      }

      /* Search Input with Optimus UI InputGroup */
      app-glossary .clear-search-btn {
        background: none;
        border: none;
        color: var(--text-color-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }

      app-glossary .clear-search-btn:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      app-glossary .clear-search-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: 4px;
      }

      /* Dropdowns */
      app-glossary .sidebar-dropdown {
        width: 100%;
      }

      app-glossary .sidebar-dropdown .p-select {
        width: 100%;
        font-size: 0.9rem;
      }

      /* Alphabet Navigation */
      app-glossary .alphabet-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
        gap: 0.25rem;
        margin-bottom: 0.5rem;
      }

      /* Indic scripts (Devanagari/Bengali) have more characters - use smaller grid on sidebar */
      [lang='hi'] app-glossary .alphabet-buttons,
      [lang='hi-easy'] app-glossary .alphabet-buttons,
      [lang='bn'] app-glossary .alphabet-buttons,
      [lang='bn-easy'] app-glossary .alphabet-buttons {
        grid-template-columns: repeat(6, 1fr);
      }

      app-glossary .alphabet-btn {
        padding: 0.5rem 0.25rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-0);
        color: var(--text-color);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        font-weight: 500;
        text-align: center;
        transition: all 0.2s ease;
        min-height: 44px;
        min-width: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Indic script characters (Devanagari/Bengali) need slightly larger font for readability */
      [lang='hi'] app-glossary .alphabet-btn,
      [lang='hi-easy'] app-glossary .alphabet-btn,
      [lang='bn'] app-glossary .alphabet-btn,
      [lang='bn-easy'] app-glossary .alphabet-btn {
        font-size: 0.9rem;
        padding: 0.35rem 0.15rem;
      }

      app-glossary .alphabet-btn:hover:not(.disabled) {
        background: var(--surface-hover);
        border-color: var(--primary-color-fg);
      }

      app-glossary .alphabet-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-glossary .alphabet-btn.active {
        background: var(--primary-color);
        color: var(--primary-color-text, #fff);
        border-color: var(--primary-color-fg);
      }

      app-glossary .alphabet-btn.disabled {
        opacity: 0.55;
        cursor: not-allowed;
        background: var(--surface-ground);
      }

      app-glossary .alphabet-btn.reset-btn {
        grid-column: span 2;
        font-size: 0.75rem;
      }

      /* Results Info */
      app-glossary .results-info {
        padding: 0.75rem;
        background: var(--surface-ground);
        border-radius: var(--border-radius);
        text-align: center;
      }

      app-glossary .results-count {
        display: block;
        color: var(--text-color-secondary);
        font-size: 0.85rem;
        margin-bottom: 0.5rem;
      }

      /* Main Content Area */
      app-glossary .main-content {
        flex: 1;
        min-width: 0;
        width: 100%;
      }

      /* No Results */
      app-glossary .no-results {
        text-align: center;
        padding: 2rem;
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
      }

      app-glossary .no-results-text {
        color: var(--text-color-secondary);
        margin-bottom: 1rem;
      }

      app-glossary .no-results-hint {
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        margin: -0.5rem 0 1rem;
      }

      /* Glossary Entries */
      app-glossary .glossary-entries {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      /* Letter Group */
      app-glossary .letter-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      app-glossary .letter-header {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--primary-color-fg);
        margin: 0;
        padding: 0.5rem 0;
        border-bottom: 2px solid var(--primary-color);
        scroll-margin-top: 80px; /* Account for sticky header */
      }

      app-glossary .entry-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: box-shadow 0.2s ease;
      }

      app-glossary .entry-card:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      /* Entry Header */
      app-glossary .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.75rem 1rem;
        background: var(--surface-ground);
        border-bottom: 1px solid var(--surface-border);
        gap: 1rem;
      }

      app-glossary .entry-term {
        color: var(--primary-color-fg);
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        flex: 1;
      }

      app-glossary .entry-badges {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
        flex-shrink: 0;
      }

      /* Badges */
      app-glossary .category-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-weight: 500;
        white-space: nowrap;
      }

      /* Category Colors */
      app-glossary .category-fundamentals {
        background: var(--blue-100);
        color: var(--blue-800);
      }
      app-glossary .category-ml {
        background: var(--green-100);
        color: var(--green-800);
      }
      app-glossary .category-nlp {
        background: var(--p-amber-100);
        color: var(--p-amber-800);
      }
      app-glossary .category-cv {
        background: var(--orange-100);
        color: var(--orange-800);
      }
      app-glossary .category-dl {
        background: var(--red-100);
        color: var(--red-800);
      }
      app-glossary .category-rl {
        background: var(--teal-100);
        color: var(--teal-800);
      }
      app-glossary .category-ethics {
        background: var(--p-pink-100);
        color: var(--p-pink-800);
      }
      app-glossary .category-applications {
        background: var(--p-slate-100);
        color: var(--p-slate-700);
      }

      /* CTM-2: Dark mode badge overrides */
      .dark-theme app-glossary .category-fundamentals {
        background: rgba(59, 130, 246, 0.15);
        color: var(--blue-400);
      }
      .dark-theme app-glossary .category-ml {
        background: rgba(16, 185, 129, 0.15);
        color: var(--green-400);
      }
      .dark-theme app-glossary .category-nlp {
        background: rgba(245, 158, 11, 0.15);
        color: var(--p-amber-300);
      }
      .dark-theme app-glossary .category-cv {
        background: rgba(249, 115, 22, 0.15);
        color: var(--orange-400);
      }
      .dark-theme app-glossary .category-dl {
        background: rgba(239, 68, 68, 0.15);
        color: var(--red-400);
      }
      .dark-theme app-glossary .category-rl {
        background: rgba(20, 184, 166, 0.15);
        color: var(--teal-400);
      }
      .dark-theme app-glossary .category-ethics {
        background: rgba(236, 72, 153, 0.15);
        color: var(--p-pink-400);
      }
      .dark-theme app-glossary .category-applications {
        background: rgba(100, 116, 139, 0.2);
        color: var(--p-slate-300);
      }

      /* Entry Content */
      app-glossary .entry-content {
        padding: 1rem;
      }

      app-glossary .entry-definition {
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 0.75rem;
        color: var(--text-color);
      }

      /* Skeleton Styles */
      app-glossary .skeleton-title-section {
        flex: 1;
      }

      app-glossary .entry-content p-skeleton {
        display: block;
        margin-bottom: 0.75rem;
      }

      app-glossary .entry-content p-skeleton:last-child {
        margin-bottom: 0;
      }

      /* Alternative Names */
      app-glossary .alternative-names {
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
      }

      app-glossary .alternative-names strong {
        color: var(--text-color);
        margin-right: 0.5rem;
      }

      app-glossary .alt-names-list {
        color: var(--text-color-secondary);
        font-style: italic;
      }

      /* Example */
      app-glossary .entry-example {
        margin-bottom: 0.75rem;
      }

      app-glossary .entry-example strong {
        color: var(--text-color);
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
        display: block;
      }

      app-glossary .example-text {
        color: var(--text-color-secondary);
        font-style: italic;
        font-size: 0.85rem;
        margin: 0;
        padding: 0.5rem;
        background: var(--surface-ground);
        border-radius: 0;
        border-left: 2px solid var(--primary-color);
      }

      /* Related Terms */
      app-glossary .related-terms {
        margin-top: 0.75rem;
      }

      app-glossary .related-terms strong {
        color: var(--text-color);
        font-size: 0.9rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      app-glossary .related-tags {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
      }

      app-glossary .related-tag {
        background: var(--primary-50);
        color: var(--primary-700);
        padding: 0.25rem 0.5rem;
        border-radius: 8px;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid var(--primary-200);
        font-family: inherit;
        font-weight: inherit;
      }

      app-glossary .related-tag:hover {
        background: var(--primary-100);
      }

      app-glossary .related-tag:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .dark-theme app-glossary .related-tag {
        background: var(--surface-card);
        color: var(--primary-400);
        border-color: var(--surface-border);
      }

      .dark-theme app-glossary .related-tag:hover {
        background: var(--surface-hover);
      }

      /* Filters */
      app-glossary .filters-section {
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-wrap: wrap;
      }

      app-glossary .search-wrapper {
        flex: 1;
        min-width: 200px;
      }

      app-glossary .search-field {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        background: var(--surface-0);
        color: var(--text-color);
      }

      app-glossary .filter-dropdown {
        min-width: 200px;
      }

      /* Entries */
      app-glossary .entries-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      app-glossary .entry-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: box-shadow 0.2s ease;
        /* Perf: the A-Z list holds 600+ entries (~30k DOM nodes, page ~400k px tall).
         content-visibility lets the browser skip layout + paint for off-screen
         cards on initial render and during scroll. The DOM stays intact, so
         jump-navigation, deep-links, search and term-highlighting are unaffected.
         The auto intrinsic-size keeps the scrollbar stable by remembering each
         card real height after it has rendered once. */
        content-visibility: auto;
        contain-intrinsic-size: auto 500px;
      }

      app-glossary .entry-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      app-glossary .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background: var(--surface-ground);
        border-bottom: 1px solid var(--surface-border);
      }

      app-glossary .entry-term {
        color: var(--primary-color-fg);
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      app-glossary .category-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
      }

      app-glossary .category-fundamentals {
        background: var(--blue-100);
        color: var(--blue-800);
      }
      app-glossary .category-ml {
        background: var(--green-100);
        color: var(--green-800);
      }
      app-glossary .category-nlp {
        background: var(--p-amber-100);
        color: var(--p-amber-800);
      }
      app-glossary .category-cv {
        background: var(--orange-100);
        color: var(--orange-800);
      }
      app-glossary .category-dl {
        background: var(--red-100);
        color: var(--red-800);
      }
      app-glossary .category-rl {
        background: var(--teal-100);
        color: var(--teal-800);
      }
      app-glossary .category-ethics {
        background: var(--p-pink-100);
        color: var(--p-pink-800);
      }

      app-glossary .entry-content {
        padding: 1rem;
      }

      app-glossary .entry-definition {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--text-color);
        margin-bottom: 1rem;
      }

      app-glossary .alternative-names {
        margin-top: 1rem;
        font-size: 0.9rem;
      }

      app-glossary .alternative-names strong {
        color: var(--text-color);
        margin-right: 0.5rem;
      }

      app-glossary .alt-names-content {
        color: var(--text-color-secondary);
        font-style: italic;
      }

      /* V2 Highlighting Styles */
      /* V2 Popover Styles - Content-Attached, Scrolls with Page */
      app-glossary .glossary-popover-v2 {
        position: absolute;
        z-index: 10000;
        background: var(--surface-card);
        border: 2px solid var(--surface-border);
        border-radius: var(--border-radius);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
        max-width: 320px;
        font-size: 0.9rem;
        opacity: 1;
        backdrop-filter: blur(8px);
        transform: translateZ(0);
      }

      app-glossary .popover-content {
        padding: 0;
      }

      app-glossary .popover-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: var(--primary-50);
        border-bottom: 1px solid var(--surface-border);
      }

      app-glossary .popover-header h4 {
        margin: 0;
        color: var(--primary-color-fg);
        font-size: 1rem;
        font-weight: 600;
      }

      app-glossary .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-color-secondary);
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }

      app-glossary .close-btn:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      app-glossary .popover-body {
        padding: 0.75rem;
      }

      app-glossary .popover-body p {
        margin: 0 0 0.5rem 0;
        color: var(--text-color);
        line-height: 1.4;
      }

      app-glossary .popover-category {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      app-glossary .popover-footer {
        padding: 0.5rem 0.75rem;
        border-top: 1px solid var(--surface-border);
        background: var(--surface-ground);
      }

      app-glossary .go-to-glossary-btn {
        background: var(--primary-color);
        color: var(--primary-contrast-color);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.8rem;
        transition: background-color 0.2s;
        width: 100%;
      }

      app-glossary .go-to-glossary-btn:hover {
        background: var(--primary-600);
      }

      app-glossary .popover-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9998;
        background: transparent;
      }

      /* No Results */
      app-glossary .no-results {
        text-align: center;
        padding: 2rem;
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
      }

      app-glossary .clear-btn {
        background: var(--primary-color);
        color: var(--primary-contrast-color);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        margin-top: 1rem;
      }

      /* Responsive */
      @media (max-width: 768px) {
        app-glossary .glossary-page {
          padding: 1rem;
        }

        app-glossary .glossary-entries {
          width: 100%;
        }

        app-glossary .entry-card {
          width: 100%;
        }

        app-glossary .filters-section {
          flex-direction: column;
          align-items: stretch;
        }

        app-glossary .language-buttons {
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        app-glossary .lang-btn {
          padding: 0.375rem 0.75rem;
          font-size: 0.9rem;
        }

        app-glossary .entry-badges {
          display: none;
        }
      }

      /* CP-7: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        app-glossary .entry-card,
        app-glossary .alphabet-btn,
        app-glossary .related-tag,
        app-glossary .clear-search-btn {
          transition: none;
        }
        app-glossary .entry-card-pulse {
          animation: none;
          outline: 3px solid var(--primary-color);
          outline-offset: 2px;
        }
      }

      /* Anchor-link arrival highlight: brief pulse so the user sees where they landed
       while keeping the rest of the glossary visible around it. */
      @keyframes app-glossary-entry-pulse {
        0% {
          box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-color) 55%, transparent);
          outline-color: color-mix(in srgb, var(--primary-color) 90%, transparent);
        }
        50% {
          box-shadow: 0 0 0 14px color-mix(in srgb, var(--primary-color) 0%, transparent);
          outline-color: color-mix(in srgb, var(--primary-color) 50%, transparent);
        }
        100% {
          box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary-color) 0%, transparent);
          outline-color: color-mix(in srgb, var(--primary-color) 0%, transparent);
        }
      }
      app-glossary .entry-card-pulse {
        outline: 3px solid color-mix(in srgb, var(--primary-color) 90%, transparent);
        outline-offset: 2px;
        animation: app-glossary-entry-pulse 2.6s ease-out 1;
        scroll-margin-top: 96px;
      }
      app-glossary .entry-card {
        scroll-margin-top: 96px;
      }
    `,
  ],
})
export class GlossaryComponent {
  private translationService = inject(TranslationService);
  private highlightingService = inject(HighlightingService);
  private glossaryService = inject(GlossaryService);
  private unifiedContent = inject(UnifiedContentService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Session flag so the HAL 9000 search easter egg toast only fires once.
  private halEasterEggShown = false;
  private platformId = inject(PLATFORM_ID);

  // Core reactive state
  searchQuery = signal('');
  debouncedSearchQuery = signal(''); // Debounced version for filtering
  selectedCategory = signal('all');
  selectedLetter = signal('');
  sortOption = signal('alphabetical');
  allEntries = signal<GlossaryEntry[]>([]);

  /**
   * Three states, one explicit flag — not "empty means loading".
   *
   * `entriesLoadFailed` comes from UnifiedContentService, which flips it once the
   * whole language fallback chain has been exhausted without a bundle. Without it
   * a failed fetch is indistinguishable from a fetch still in flight and the
   * skeleton shimmers forever.
   */
  private contentLoadFailed = toSignal(this.unifiedContent.loadFailed$, { initialValue: false });
  entriesLoadFailed = computed(() => this.contentLoadFailed() && this.allEntries().length === 0);
  isLoadingEntries = computed(() => this.allEntries().length === 0 && !this.entriesLoadFailed());

  // Debounce timeout reference
  private searchDebounceTimeout: ReturnType<typeof setTimeout> | null = null;

  // Service state
  currentLanguage = computed(() => this.translationService.currentLanguage);
  currentPopover = computed(() => this.highlightingService.currentPopover$());

  // Computed translations
  pageTitle = computed(() => this.translationService.translate('glossary.title'));
  searchPlaceholder = computed(() => this.translationService.translate('glossary.filters.searchPlaceholder'));
  categoryPlaceholder = computed(() => this.translationService.translate('glossary.filters.categoryPlaceholder'));
  alternativeNamesLabel = computed(() => this.translationService.translate('glossary.entry.alsoKnownAs'));
  noResultsText = computed(() => this.translationService.translate('glossary.results.noResults'));
  loadingLabel = computed(() => this.translationService.translate('common.loading'));
  loadErrorText = computed(() => this.translationService.translate('common.loadError'));
  loadErrorHintText = computed(() => this.translationService.translate('common.loadErrorHint'));
  retryLabel = computed(() => this.translationService.translate('common.retry'));

  // Additional translations for new filter UI
  activeFiltersLabel = computed(() => this.translationService.translate('glossary.filters.active'));
  searchLabel = computed(() => this.translationService.translate('glossary.filters.search'));
  clearSearchLabel = computed(() => this.translationService.translate('glossary.filters.clearSearch'));
  categoryLabel = computed(() => this.translationService.translate('glossary.filters.category'));
  sortLabel = computed(() => this.translationService.translate('glossary.filters.sort'));
  sortPlaceholder = computed(() => this.translationService.translate('glossary.filters.sortPlaceholder'));
  alphabetNavigationLabel = computed(() => this.translationService.translate('glossary.filters.alphabetNavigation'));
  showAllLettersLabel = computed(() => this.translationService.translate('glossary.filters.showAllLetters'));
  allLabel = computed(() => this.translationService.translate('glossary.filters.all'));
  ofLabel = computed(() => this.translationService.translate('glossary.results.of'));
  termsLabel = computed(() => this.translationService.translate('glossary.results.terms'));
  clearAllLabel = computed(() => this.translationService.translate('glossary.filters.clearAll'));
  exampleLabel = computed(() => this.translationService.translate('glossary.entry.example'));

  // Simple description for appHighlight directive
  pageDescription = computed(() => this.translationService.translate('glossary.description'));

  // UI Options
  categoryOptions = computed(() => [
    { label: this.translationService.translate('glossary.categories.all'), value: 'all' },
    { label: this.translationService.translate('glossary.categories.fundamentals'), value: 'fundamentals' },
    { label: this.translationService.translate('glossary.categories.ml'), value: 'ml' },
    { label: this.translationService.translate('glossary.categories.nlp'), value: 'nlp' },
    { label: this.translationService.translate('glossary.categories.cv'), value: 'cv' },
    { label: this.translationService.translate('glossary.categories.dl'), value: 'dl' },
    { label: this.translationService.translate('glossary.categories.rl'), value: 'rl' },
    { label: this.translationService.translate('glossary.categories.ethics'), value: 'ethics' },
    { label: this.translationService.translate('glossary.categories.applications'), value: 'applications' },
  ]);

  sortOptions = computed(() => [
    { label: this.translationService.translate('glossary.sort.alphabetical'), value: 'alphabetical' },
    { label: this.translationService.translate('glossary.sort.category'), value: 'category' },
  ]);

  /** Active collation/uppercasing locale (BCP-47), '-easy' suffix stripped. */
  private get groupingLocale(): string {
    return this.translationService.currentLanguage.replace(/-easy$/, '');
  }

  private groupingCollator(): Intl.Collator {
    return new Intl.Collator(this.groupingLocale, { sensitivity: 'base', numeric: true });
  }

  /** Group key for a term: its first letter (locale-uppercased), or '#' when the
   *  term starts with a non-letter. Script-agnostic — never returns empty, never
   *  drops. This replaces the former hardcoded per-language alphabet branches
   *  that silently dropped any term outside the listed script (e.g. ALL Cyrillic
   *  terms on /ru, all Devanagari on /mr — neither had a branch). */
  private groupKeyOf(term: string): string {
    const first = [...(term ?? '').trim()][0];
    if (!first || !/\p{L}/u.test(first)) return '#';
    return first.toLocaleUpperCase(this.groupingLocale);
  }

  // A–Z navigation: the distinct first-letters actually present for the current
  // language, in locale order, with '#' last. Script-correct everywhere because
  // it is derived from the real entries, not a hardcoded list.
  alphabetLetters = computed(() => {
    const keys = new Set<string>();
    for (const e of this.allEntries()) keys.add(this.groupKeyOf(e.term));
    const collator = this.groupingCollator();
    const letters = Array.from(keys)
      .filter((k) => k !== '#')
      .sort((a, b) => collator.compare(a, b));
    if (keys.has('#')) letters.push('#');
    return letters;
  });

  // Every nav letter is present by construction (alphabetLetters is derived from
  // the real entries), so all are selectable. Kept as a Set for the template's
  // availability check.
  availableLetters = computed(() => new Set(this.alphabetLetters()));

  // Filtered entries - uses debounced search for performance
  filteredEntries = computed(() => {
    let entries = this.allEntries();

    // Apply search filter (debounced) - only matches term and alternativeNames
    const query = this.debouncedSearchQuery().toLowerCase().trim();
    if (query) {
      if (query.startsWith('exact:')) {
        // Exact match by ID or term name for deep linking
        const exactValue = query.substring(6);
        entries = entries.filter(
          (entry) => entry.id.toLowerCase() === exactValue || foldForSearch(entry.term) === foldForSearch(exactValue),
        );
      } else {
        // Tokenized AND search across term + alternativeNames (synonyms): every
        // whitespace-separated word must match. A single word behaves exactly as
        // the previous substring search; each word is its own removable chip.
        // Compound joiners are folded away on both sides (Code·review = Code-Review).
        const words = this.searchWords(query).map(foldForSearch);
        entries = entries.filter((entry) => {
          const term = foldForSearch(entry.term);
          const alts = entry.alternativeNames?.map(foldForSearch) ?? [];
          return words.every((word) => term.includes(word) || alts.some((alt) => alt.includes(word)));
        });
      }
    }

    // Apply category filter
    const category = this.selectedCategory();
    if (category && category !== 'all') {
      entries = entries.filter((entry) => entry.category === category);
    }

    // Apply alphabet filter — same script-agnostic grouping as entriesByLetter,
    // so selecting a letter (or the '#' bucket) matches exactly what is rendered.
    const letter = this.selectedLetter();
    if (letter) {
      entries = entries.filter((entry) => this.groupKeyOf(entry.term) === letter);
    }

    // Apply sorting
    const sort = this.sortOption();
    entries = [...entries].sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.term.localeCompare(b.term);
        case 'category':
          return a.category.localeCompare(b.category) || a.term.localeCompare(b.term);
        default:
          return 0;
      }
    });

    return entries;
  });

  // Active filters as removable chips (shown above the "clear all" button).
  // The search is split into one chip per word so each can be removed on its own;
  // an EXACT: deep-link is shown as a single chip with the clean term.
  activeFilterChips = computed<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    const removePrefix = this.translate('glossary.filters.removeFilter');
    const searchLabel = this.translate('glossary.filters.search');

    const query = this.debouncedSearchQuery().trim();
    if (query) {
      if (query.toLowerCase().startsWith('exact:')) {
        const term = query.substring(6);
        chips.push({
          key: 'search',
          label: term,
          icon: 'pi pi-search',
          removeAriaLabel: `${removePrefix}: ${searchLabel} – ${term}`,
        });
      } else {
        this.searchWords(query).forEach((word, index) =>
          chips.push({
            key: `word:${index}`,
            label: word,
            icon: 'pi pi-search',
            removeAriaLabel: `${removePrefix}: ${searchLabel} – ${word}`,
          }),
        );
      }
    }

    const category = this.selectedCategory();
    if (category && category !== 'all') {
      const name = this.getCategoryLabel(category);
      chips.push({
        key: 'category',
        label: name,
        icon: 'pi pi-tag',
        removeAriaLabel: `${removePrefix}: ${this.translate('glossary.filters.category')} – ${name}`,
      });
    }

    const letter = this.selectedLetter();
    if (letter) {
      chips.push({
        key: 'letter',
        label: letter,
        icon: 'pi pi-sort-alpha-down',
        removeAriaLabel: `${removePrefix}: ${this.translate('glossary.filters.letter')} – ${letter}`,
      });
    }

    return chips;
  });

  // Group entries by first letter — script-agnostic, never drops (see groupKeyOf).
  // The rendered list therefore always equals filteredEntries (the count can't lie).
  entriesByLetter = computed(() => {
    const entries = this.filteredEntries();
    const collator = this.groupingCollator();
    const groups = new Map<string, GlossaryEntry[]>();
    for (const entry of entries) {
      const key = this.groupKeyOf(entry.term);
      let bucket = groups.get(key);
      if (!bucket) {
        bucket = [];
        groups.set(key, bucket);
      }
      bucket.push(entry);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => {
        if (a === '#') return b === '#' ? 0 : 1; // '#' (non-letter) bucket always last
        if (b === '#') return -1;
        return collator.compare(a, b);
      })
      .map(([letter, list]) => ({ letter, entries: list }));
  });

  // Table of Contents - dynamically generate sections based on filters and available letters
  tocItems = computed<TocItem[]>(() => {
    // Establish a reactive dependency on the active language so the TOC labels
    // recompute on every language switch — including switches back to an
    // already-loaded language, which do not bump the translations version.
    void this.translationService.currentLanguage;
    const items: TocItem[] = [
      {
        id: 'filters',
        label: this.translate('glossary.toc.filters'),
        icon: 'pi pi-filter',
      },
    ];

    // Add letter sections from grouped entries
    const letterGroups = this.entriesByLetter();
    letterGroups.forEach(({ letter }) => {
      items.push({
        id: `letter-${letter}`,
        label: letter,
        icon: 'pi pi-bookmark',
      });
    });

    return items;
  });

  constructor() {
    // Load glossary entries with proper cleanup
    this.glossaryService
      .getAllEntries()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (entries) => {
          // Ensure alternativeNames is always an array for each entry
          const normalizedEntries = entries.map((entry) => ({
            ...entry,
            alternativeNames: Array.isArray(entry.alternativeNames) ? entry.alternativeNames : [],
          }));
          this.allEntries.set(normalizedEntries);
        },
        error: (error) => {
          // NOTE: this path is effectively unreachable — entries$ is a
          // BehaviorSubject that UnifiedContentService never errors. The real
          // failure signal is loadFailed$, read via entriesLoadFailed(). Setting
          // [] here does NOT end the loading state (the old comment claimed it
          // did); it is exactly what "still loading" looks like.
          console.error('Error loading glossary entries:', error);
          this.allEntries.set([]);
        },
      });

    // Handle language changes
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.allEntries.set([]); // Clear entries, will trigger isLoadingEntries to true via computed
    });

    // Handle URL parameters.
    // The INITIAL ?search value must NOT be applied during hydration: a deep-link
    // (e.g. ?search=EXACT:Open Source) serves the prerendered full term list, and
    // mutating the @for's data mid-hydration wedges it — the prerendered cards stay
    // in the DOM while only sibling bindings (the counter) update. So we apply the
    // initial value AFTER the first render (afterNextRender, browser-only); by then
    // the list has hydrated cleanly and reconciles normally to the filtered set.
    // The index.html gate keeps the full list hidden until we reveal it here.
    let initialParamHandled = !isPlatformBrowser(this.platformId);
    afterNextRender(() => {
      this.applySearchParam(this.route.snapshot.queryParamMap.get('search'));
      initialParamHandled = true;
      // Reveal only after the now-filtered list has actually painted, so the full
      // list (still in the prerendered DOM until this CD flushes) never flashes.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.documentElement.classList.remove('gloss-deeplink-pending')),
      );
    });

    // Later query-param changes (in-app SPA navigation) apply immediately — there is
    // no hydration in flight at that point, so the @for reconciles normally.
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (!initialParamHandled) return; // initial value owned by afterNextRender above
      this.applySearchParam(params['search']);
    });

    // Anchor-link support: /glossary#term-id scrolls to entry + briefly highlights it,
    // showing the rest of the list around it (better discovery than EXACT: filter).
    this.route.fragment.pipe(takeUntilDestroyed()).subscribe((fragment) => {
      if (fragment && isPlatformBrowser(this.platformId)) {
        this.scrollToEntryWithRetry(fragment, 15);
      }
    });

    // Initialize highlighting service
    this.initializeHighlighting();
  }

  /**
   * Apply a `search` query-param value to the filter state.
   * `EXACT:` prefix → exact id/term match; clean term shown in the input.
   */
  private applySearchParam(searchParam: string | null | undefined): void {
    if (!searchParam) return;
    if (searchParam.toUpperCase().startsWith('EXACT:')) {
      this.searchQuery.set(searchParam.substring(6)); // Display clean term in input
      this.debouncedSearchQuery.set(searchParam); // Keep prefix for filtering
      this.resetSecondaryFilters(); // exact target must survive an active letter/category filter
    } else {
      this.searchQuery.set(searchParam);
      this.debouncedSearchQuery.set(searchParam);
    }
  }

  /**
   * Clear the category + alphabet (letter) filters. Called when an EXACT deep-link
   * is applied: the single target term must not be hidden by a previously-active
   * letter or category selection (e.g. letter "B" selected, deep-link to a "Z" term).
   */
  private resetSecondaryFilters(): void {
    this.selectedCategory.set('all');
    this.selectedLetter.set('');
  }

  // browser-only: the fragment subscription calls it behind isPlatformBrowser.
  private scrollToEntryWithRetry(termId: string, attemptsLeft: number): void {
    const element = document.getElementById('entry-' + termId);
    if (element) {
      element.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
      element.classList.add('entry-card-pulse');
      setTimeout(() => element.classList.remove('entry-card-pulse'), 2800);
      return;
    }
    if (attemptsLeft > 0) {
      // Entries load async — retry until rendered
      setTimeout(() => this.scrollToEntryWithRetry(termId, attemptsLeft - 1), 200);
    }
  }

  /**
   * Initialize highlighting service
   */
  private async initializeHighlighting(): Promise<void> {
    try {
      await this.highlightingService.initialize();
    } catch (error) {
      console.error('Failed to initialize highlighting service:', error);
    }
  }

  /**
   * Get category label
   */
  getCategoryLabel(category: string): string {
    return translatedOr((key) => this.translationService.translate(key), `glossary.categories.${category}`, category);
  }

  /**
   * Translation helper method
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Handle search input
   */
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const value = target.value;
      // Update searchQuery immediately for UI binding
      this.searchQuery.set(value);

      // Debounce the actual filtering (150ms)
      if (this.searchDebounceTimeout) {
        clearTimeout(this.searchDebounceTimeout);
      }
      this.searchDebounceTimeout = setTimeout(() => {
        this.debouncedSearchQuery.set(value);
      }, 150);

      // Easter Egg Detection: HAL 9000
      this.checkForHAL9000EasterEgg(value);
    }
  }

  /**
   * Check if search query contains HAL 9000 and trigger easter egg
   */
  private checkForHAL9000EasterEgg(searchQuery: string): void {
    // Normalize search query (lowercase, remove spaces and dashes)
    const normalized = searchQuery.toLowerCase().replace(/[\s-]/g, '');

    // Check for HAL 9000 variations (hal9000, hal 9000, hal-9000, etc.)
    if (normalized.includes('hal9000') || normalized.includes('hal2001')) {
      // Show the easter egg once per session to avoid duplicate toasts
      if (!this.halEasterEggShown) {
        this.halEasterEggShown = true;

        // Show HAL 9000 easter egg message
        const summary = this.translationService.translate('easterEgg.hal.sorryDave');
        const detail = this.translationService.translate('easterEgg.hal.discovered');
        this.toastService.showSuccess(summary, detail, { duration: 5000 });
      }
    }
  }

  /**
   * Clear the search query
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.debouncedSearchQuery.set(''); // Immediate for clear action
  }

  /**
   * Handle category change
   */
  onCategoryChange(event: SelectChangeEvent): void {
    this.selectedCategory.set(event.value);
  }

  /**
   * Handle sort option changes
   */
  onSortChange(event: SelectChangeEvent): void {
    this.sortOption.set(event.value);
  }

  /**
   * Select a specific letter for alphabet navigation
   */
  selectLetter(letter: string): void {
    this.selectedLetter.set(letter);
    // Clear search when using alphabet navigation
    if (letter) {
      this.searchQuery.set('');
      this.debouncedSearchQuery.set(''); // Immediate for letter selection
    }
  }

  /**
   * Retry the content bundle load after a failed fetch.
   * Nothing is cached on failure, so this re-runs the full fallback chain.
   */
  retryLoad(): void {
    this.unifiedContent.loadBundle(this.translationService.currentLanguage).pipe(take(1)).subscribe();
  }

  /**
   * Clear all filters and search
   */
  clearAllFilters(): void {
    this.searchQuery.set('');
    this.debouncedSearchQuery.set(''); // Immediate for clear action
    this.selectedCategory.set('all');
    this.selectedLetter.set('');
    this.sortOption.set('alphabetical');
  }

  /** Split a search string into its whitespace-separated words (no empties). */
  private searchWords(query: string): string[] {
    return query
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean);
  }

  /**
   * Remove a single active filter via its chip (key from {@link activeFilterChips}).
   * Search words are removed one at a time, re-joining the remaining words; the
   * category and letter filters reset to their defaults.
   */
  removeFilterChip(key: string): void {
    if (key === 'category') {
      this.selectedCategory.set('all');
      return;
    }
    if (key === 'letter') {
      this.selectedLetter.set('');
      return;
    }
    if (key === 'search') {
      this.clearSearch();
      return;
    }
    if (key.startsWith('word:')) {
      const index = Number(key.slice(5));
      const words = this.searchWords(this.debouncedSearchQuery().trim());
      if (index < 0 || index >= words.length) return;
      words.splice(index, 1);
      const next = words.join(' ');
      if (this.searchDebounceTimeout) {
        clearTimeout(this.searchDebounceTimeout); // cancel a pending keystroke so it can't restore the word
      }
      this.searchQuery.set(next);
      this.debouncedSearchQuery.set(next);
    }
  }

  /**
   * TrackBy function for performance
   */
  trackByEntryId(index: number, entry: GlossaryEntry): string {
    return entry.id;
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByGroupLetter(_index: number, group: { letter: string }): string {
    return group.letter;
  }
}
