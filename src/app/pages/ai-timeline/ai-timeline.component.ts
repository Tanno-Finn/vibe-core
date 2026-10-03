/**
 * Timeline Component (route /ai-timeline)
 *
 * This component displays a chronological timeline of important AI events
 * and milestones using Optimus UI Timeline. Events are loaded from JSON files
 * with German and English translations, including sources and references.
 */

import {
  Component,
  signal,
  computed,
  ChangeDetectorRef,
  inject,
  ViewEncapsulation,
  PLATFORM_ID,
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { HighlightingService } from '../../services/highlighting.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimelineService, TimelineEvent } from '../../services/timeline.service';
import { RelatedRefsComponent } from '../../components/shared/related-refs.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { ArticleComponent } from '../../components/shared/article.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { GlossaryPopoverComponent } from '../../components/shared/glossary-popover.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { ActiveFilterChipsComponent, ActiveFilterChip } from '../../components/shared/active-filter-chips.component';
import { TimelineModule } from '@openng/optimus-ui/timeline';
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectModule } from '@openng/optimus-ui/select';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { PanelModule } from '@openng/optimus-ui/panel';
import { SliderModule } from '@openng/optimus-ui/slider';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { openExternal } from '../../utils/open-external';
import { scrollBehavior } from '../../utils/reduced-motion';

/** Shape of the value emitted by Optimus UI's range slider (or a raw range array). */
// Optimus UI's slider events type `value` as `number` even in range mode, so the
// union admits `number | number[]`; extractRange() narrows via Array.isArray.
type SliderRangeEvent = number[] | { value?: number | number[]; values?: number[] };

@Component({
  selector: 'app-ai-timeline',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    SimpleEasyLanguageFabComponent,
    ArticleComponent,
    TableOfContentsFabComponent,
    FabStackComponent,
    HighlightDirective,
    GlossaryPopoverComponent,
    PageHeaderComponent,
    TimelineModule,
    CardModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TooltipModule,
    PanelModule,
    SliderModule,
    SkeletonModule,
    RelatedRefsComponent,
    ActiveFilterChipsComponent,
  ],
  template: `
    <app-article width="page" [transparentBackground]="true">
      <div class="ai-timeline-page">
        <!-- CP-10: Filter results live region.
             Silent while the events are still loading: bound to not-yet-arrived data
             it used to announce "0 results" during the load, which is worse than
             saying nothing. The skeleton below announces the load, this announces
             the result. -->
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          @if (!isLoading()) {
            {{ allFilteredEvents().length }} {{ translate('timeline.aiTimeline.results') }}
          }
        </div>
        <app-page-header titleKey="app.nav.aiTimeline" subtitleKey="aiTimeline.subtitle"></app-page-header>

        <!-- Main Layout with Sticky Sidebar -->
        <div class="content-layout">
          <!-- Sticky Filter Sidebar -->
          <div id="filters" class="filter-sidebar">
            <div class="sidebar-content">
              <!-- Search Filter -->
              <div class="sidebar-section">
                <h2 class="sidebar-title">
                  <i class="pi pi-search"></i> {{ translate('timeline.aiTimeline.filters.search') }}
                </h2>
                <div class="search-input-wrapper">
                  <i class="pi pi-search search-icon"></i>
                  <input
                    type="text"
                    pInputText
                    [ngModel]="searchQuery()"
                    (input)="onSearchChange($event)"
                    [placeholder]="translate('timeline.aiTimeline.filters.searchPlaceholder')"
                    [attr.aria-label]="translate('timeline.aiTimeline.filters.search')"
                    class="search-field"
                  />
                  @if (searchQuery()) {
                    <button
                      class="clear-search-btn"
                      (click)="clearSearch()"
                      [attr.aria-label]="translate('timeline.aiTimeline.filters.clearSearch')"
                      type="button"
                    >
                      <i class="pi pi-times"></i>
                    </button>
                  }
                </div>
                <small class="search-help-text">
                  {{ translate('timeline.aiTimeline.filters.searchHelp') }}
                </small>
              </div>

              <!-- Category Filter -->
              <div class="sidebar-section">
                <h2 id="category-label" class="sidebar-title">
                  <i class="pi pi-tags"></i> {{ translate('timeline.aiTimeline.filters.category') }}
                </h2>
                <!-- [ariaLabelledBy] (the Input), not [attr.aria-labelledby]: p-select's
                     focusable element is a <span role="combobox"> inside the host, so a host
                     attribute is ignored and the current value gets announced as the name. -->
                <p-select
                  [options]="categoryOptions()"
                  [ngModel]="selectedCategory()"
                  (onChange)="onCategoryChange($event)"
                  [placeholder]="translate('timeline.aiTimeline.categories.all')"
                  optionLabel="label"
                  optionValue="value"
                  styleClass="sidebar-dropdown"
                  [ariaLabelledBy]="'category-label'"
                  [style]="{ width: '100%' }"
                >
                </p-select>
              </div>

              <!-- Date Range Filter -->
              <div class="sidebar-section">
                <h2 id="date-range-label" class="sidebar-title">
                  <i class="pi pi-calendar"></i> {{ translate('timeline.aiTimeline.filters.dateRange') }}
                </h2>
                <div class="date-range-wrapper">
                  <p-slider
                    #dateSlider
                    [ngModel]="[dateRange()[0], dateRange()[1]]"
                    (onChange)="onDateRangeDrag($event)"
                    (onSlideEnd)="onDateRangeCommit($event)"
                    [min]="minYear"
                    [max]="maxYear"
                    [range]="true"
                    [step]="1"
                    styleClass="date-range-slider"
                    [ariaLabelledBy]="'date-range-label'"
                    [style]="{ width: '100%' }"
                  >
                  </p-slider>
                  <div class="date-range-labels">
                    <span class="range-start">{{ dateRange()[0] || minYear }}</span>
                    <span class="range-end">{{ dateRange()[1] || maxYear }}</span>
                  </div>
                </div>
              </div>

              <!-- Active Filter Chips (one removable chip per active filter) -->
              @if (activeFilterChips().length > 0) {
                <div class="sidebar-section">
                  <h2 class="sidebar-title">
                    <i class="pi pi-filter"></i> {{ translate('timeline.aiTimeline.filters.active') }}
                  </h2>
                  <app-active-filter-chips
                    [chips]="activeFilterChips()"
                    [groupLabel]="translate('timeline.aiTimeline.filters.active')"
                    (remove)="removeFilterChip($event)"
                  ></app-active-filter-chips>
                </div>
              }

              <!-- Clear Filters -->
              <div class="sidebar-section">
                <p-button
                  [label]="translate('timeline.aiTimeline.filters.clear')"
                  icon="pi pi-refresh"
                  severity="secondary"
                  size="small"
                  (onClick)="clearAllFilters()"
                  [style]="{ width: '100%' }"
                >
                </p-button>
              </div>
            </div>
          </div>

          <!-- Main Timeline Content -->
          <section class="main-content" [attr.aria-label]="translate('timeline.aiTimeline.results')">
            <!-- Loading Skeleton -->
            @if (isLoading()) {
              <!-- role="status" + aria-busy make this a polite live region that is
                   mid-update; the sr-only line gives it something to say, because
                   every p-skeleton is hard-coded aria-hidden="true". -->
              <div class="loading-skeleton" role="status" aria-busy="true">
                <span class="sr-only">{{ translate('common.loading') }}</span>
                <!-- Desktop Timeline Skeleton -->
                <div class="desktop-timeline">
                  @for (item of [1, 2, 3, 4, 5, 6]; track item) {
                    <div class="skeleton-timeline-item">
                      <div class="skeleton-marker">
                        <p-skeleton shape="circle" size="3rem"></p-skeleton>
                      </div>
                      <div class="skeleton-card">
                        <div class="skeleton-header">
                          <p-skeleton width="80px" height="1.5rem"></p-skeleton>
                          <p-skeleton width="120px" height="1.2rem"></p-skeleton>
                        </div>
                        <div class="skeleton-content">
                          <p-skeleton width="70%" height="1.8rem"></p-skeleton>
                          <p-skeleton width="100%" height="4rem"></p-skeleton>
                          <p-skeleton width="90%" height="1rem"></p-skeleton>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <!-- Mobile Timeline Skeleton -->
                <div class="custom-mobile-timeline">
                  <div class="timeline-line"></div>
                  @for (item of [1, 2, 3, 4, 5, 6]; track item) {
                    <div class="skeleton-mobile-item">
                      <div class="skeleton-mobile-marker">
                        <p-skeleton shape="circle" size="2.5rem"></p-skeleton>
                      </div>
                      <div class="skeleton-mobile-card">
                        <p-skeleton width="60px" height="1.2rem"></p-skeleton>
                        <p-skeleton width="80%" height="1.5rem"></p-skeleton>
                        <p-skeleton width="100%" height="3rem"></p-skeleton>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Timeline Content -->
            @if (!isLoading()) {
              <!-- Empty state when filters yield zero results (new 2026-05-17) -->
              @if (allFilteredEvents().length === 0) {
                <section class="timeline-empty-state" role="status" aria-live="polite">
                  <i class="pi pi-filter-slash timeline-empty-icon" aria-hidden="true"></i>
                  <h2 class="timeline-empty-title">{{ translate('timeline.aiTimeline.empty.title') }}</h2>
                  <p class="timeline-empty-text">
                    {{ translate('timeline.aiTimeline.empty.text') }}
                  </p>
                  <button
                    type="button"
                    class="timeline-empty-reset"
                    (click)="clearAllFilters()"
                    [attr.aria-label]="translate('timeline.aiTimeline.empty.resetButton')"
                  >
                    <i class="pi pi-refresh" aria-hidden="true"></i>
                    {{ translate('timeline.aiTimeline.empty.resetButton') }}
                  </button>
                </section>
              }
              <section id="timeline-section" class="timeline-section" [hidden]="allFilteredEvents().length === 0">
                <!-- Desktop Timeline - Single continuous timeline -->
                <div class="desktop-timeline">
                  <p-timeline [value]="allFilteredEvents()" align="alternate">
                    <ng-template #marker let-event>
                      <span class="timeline-marker" [style.background-color]="event.color">
                        <i [class]="event.icon || 'pi pi-calendar'" aria-hidden="true"></i>
                      </span>
                    </ng-template>
                    <ng-template #content let-event>
                      <p-card styleClass="timeline-card" [id]="'event-' + event.id">
                        <ng-template #header>
                          <div class="card-header">
                            <span class="event-year">{{ event.year }}</span>
                            <span class="event-category">{{
                              translate('timeline.aiTimeline.categories.' + event.category)
                            }}</span>
                          </div>
                        </ng-template>
                        <div class="timeline-content">
                          <h3 class="event-title" [appHighlight]="event.title">{{ event.title }}</h3>
                          <p class="event-description" [appHighlight]="event.description">{{ event.description }}</p>
                          @if (event.details) {
                            <div class="event-details">
                              @for (detail of event.details; track $index) {
                                <div class="detail-item">
                                  <i [class]="detail.icon || 'pi pi-circle'" aria-hidden="true"></i>
                                  <span [appHighlight]="detail.text">{{ detail.text }}</span>
                                </div>
                              }
                            </div>
                          }
                          <!-- People + Organizations (new 2026-05-17) -->
                          @if (event.people?.length || event.organizations?.length) {
                            <div class="event-meta">
                              @if (event.people?.length) {
                                <p class="event-meta-row">
                                  <i class="pi pi-users event-meta-icon" aria-hidden="true"></i>
                                  <span class="event-meta-label">{{ translate('aiTimeline.peopleLabel') }}</span>
                                  <span class="event-meta-value">{{ event.people!.join(', ') }}</span>
                                </p>
                              }
                              @if (event.organizations?.length) {
                                <p class="event-meta-row">
                                  <i class="pi pi-building event-meta-icon" aria-hidden="true"></i>
                                  <span class="event-meta-label">{{ translate('aiTimeline.organizationsLabel') }}</span>
                                  <span class="event-meta-value">{{ event.organizations!.join(', ') }}</span>
                                </p>
                              }
                            </div>
                          }
                          @if (event.link) {
                            <div class="event-actions">
                              <p-button
                                [label]="translate('timeline.aiTimeline.readMore')"
                                icon="pi pi-external-link"
                                size="small"
                                severity="secondary"
                                (onClick)="openLink(event.link)"
                              >
                              </p-button>
                            </div>
                          }
                          <app-related-refs
                            density="compact-inline"
                            [forNode]="{ type: 'timeline', id: event.id }"
                            [refs]="event.related ?? null"
                            [mapTrigger]="true"
                          >
                          </app-related-refs>
                        </div>
                      </p-card>
                    </ng-template>
                  </p-timeline>
                </div>
                <!-- Custom Mobile Timeline - Single continuous timeline -->
                <div class="custom-mobile-timeline">
                  <div class="timeline-line"></div>
                  <div class="timeline-events">
                    @for (event of allFilteredEvents(); track trackByEvent($index, event)) {
                      <div class="timeline-event" [id]="'event-m-' + event.id">
                        <!-- Marker -->
                        <div class="event-marker" [style.background-color]="event.color">
                          <i [class]="event.icon || 'pi pi-calendar'" aria-hidden="true"></i>
                        </div>
                        <!-- Content -->
                        <div class="event-content">
                          <p-card styleClass="mobile-timeline-card">
                            <ng-template #header>
                              <div class="card-header">
                                <span class="event-year">{{ event.year }}</span>
                                <span class="event-category">{{
                                  translate('timeline.aiTimeline.categories.' + event.category)
                                }}</span>
                              </div>
                            </ng-template>
                            <div class="timeline-content">
                              <h3 class="event-title" [appHighlight]="event.title">{{ event.title }}</h3>
                              <p class="event-description" [appHighlight]="event.description">
                                {{ event.description }}
                              </p>
                              @if (event.details) {
                                <div class="event-details">
                                  @for (detail of event.details; track $index) {
                                    <div class="detail-item">
                                      <i [class]="detail.icon || 'pi pi-circle'" aria-hidden="true"></i>
                                      <span [appHighlight]="detail.text">{{ detail.text }}</span>
                                    </div>
                                  }
                                </div>
                              }
                              <!-- People + Organizations (new 2026-05-17, mobile view) -->
                              @if (event.people?.length || event.organizations?.length) {
                                <div class="event-meta">
                                  @if (event.people?.length) {
                                    <p class="event-meta-row">
                                      <i class="pi pi-users event-meta-icon" aria-hidden="true"></i>
                                      <span class="event-meta-label">{{ translate('aiTimeline.peopleLabel') }}</span>
                                      <span class="event-meta-value">{{ event.people!.join(', ') }}</span>
                                    </p>
                                  }
                                  @if (event.organizations?.length) {
                                    <p class="event-meta-row">
                                      <i class="pi pi-building event-meta-icon" aria-hidden="true"></i>
                                      <span class="event-meta-label">{{
                                        translate('aiTimeline.organizationsLabel')
                                      }}</span>
                                      <span class="event-meta-value">{{ event.organizations!.join(', ') }}</span>
                                    </p>
                                  }
                                </div>
                              }
                              @if (event.link) {
                                <div class="event-actions">
                                  <p-button
                                    [label]="translate('timeline.aiTimeline.readMore')"
                                    icon="pi pi-external-link"
                                    size="small"
                                    severity="secondary"
                                    (onClick)="openLink(event.link)"
                                  >
                                  </p-button>
                                </div>
                              }
                              <app-related-refs
                                density="compact-inline"
                                [forNode]="{ type: 'timeline', id: event.id }"
                                [mapTrigger]="true"
                              >
                              </app-related-refs>
                            </div>
                          </p-card>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </section>
            }
          </section>
        </div>

        <!-- FAB Stack with ToC and Easy Language -->
        <app-fab-stack>
          <app-table-of-contents-fab [items]="tocItems()" [title]="translate('timeline.aiTimeline.tableOfContents')">
          </app-table-of-contents-fab>

          <app-simple-easy-language-fab contentId="ai-timeline" contentType="article"> </app-simple-easy-language-fab>
        </app-fab-stack>
      </div>

      <!-- Global Popover for SmartText highlighting -->
      <app-glossary-popover></app-glossary-popover>
    </app-article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* ========== BASE LAYOUT ========== */
      app-ai-timeline .ai-timeline-page {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 var(--space-4) var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      /* ========== MAIN LAYOUT WITH SIDEBAR ========== */
      app-ai-timeline .content-layout {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
      }

      /* ========== STICKY SIDEBAR ========== */
      app-ai-timeline .filter-sidebar {
        flex: 0 0 300px;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        position: sticky;
        top: 1rem;
        max-height: calc(100vh - 2rem);
        overflow-y: auto;
      }

      app-ai-timeline .sidebar-content {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      app-ai-timeline .sidebar-section {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      app-ai-timeline .sidebar-title {
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

      app-ai-timeline .sidebar-title i {
        color: var(--primary-color-fg);
        font-size: 0.875rem;
      }

      /* ========== MAIN CONTENT AREA ========== */
      app-ai-timeline .main-content {
        flex: 1;
        min-width: 0;
        width: 100%;
        background: transparent;
      }

      /* ========== LOADING SKELETON ========== */
      app-ai-timeline .loading-skeleton {
        padding: var(--space-4) 0;
      }

      app-ai-timeline .skeleton-timeline-item {
        display: flex;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        align-items: flex-start;
      }

      app-ai-timeline .skeleton-timeline-item:nth-child(even) {
        flex-direction: row-reverse;
      }

      app-ai-timeline .skeleton-marker {
        flex-shrink: 0;
      }

      app-ai-timeline .skeleton-card {
        flex: 1;
        max-width: 600px;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: var(--space-4);
      }

      app-ai-timeline .skeleton-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-3);
        padding-bottom: var(--space-2);
        border-bottom: 1px solid var(--surface-border);
      }

      app-ai-timeline .skeleton-mobile-item {
        position: relative;
        padding-left: 3.5rem;
        margin-bottom: var(--space-6);
      }

      app-ai-timeline .skeleton-mobile-marker {
        position: absolute;
        left: 0;
        top: 0;
      }

      app-ai-timeline .skeleton-mobile-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: var(--space-3);
      }

      .skeleton-card p-skeleton,
      app-ai-timeline .skeleton-mobile-card p-skeleton {
        display: block;
        margin-bottom: 0.75rem;
      }

      .skeleton-card p-skeleton:last-child,
      app-ai-timeline .skeleton-mobile-card p-skeleton:last-child {
        margin-bottom: 0;
      }

      app-ai-timeline .skeleton-content p-skeleton {
        margin-bottom: 1rem;
      }

      app-ai-timeline .skeleton-content p-skeleton:last-child {
        margin-bottom: 0;
      }

      /* ========== SIDEBAR CONTROLS ========== */

      /* Search Input */
      app-ai-timeline .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        margin-bottom: 0.5rem;
      }

      app-ai-timeline .search-icon {
        position: absolute;
        left: 12px;
        color: var(--text-color-secondary);
        z-index: 2;
      }

      app-ai-timeline .search-field {
        width: 100%;
        padding-left: 2.5rem;
        padding-right: 2.5rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        background: var(--surface-0);
        color: var(--text-color);
        font-size: 0.9rem;
      }

      /* Search clear (X) button — mirrors app-navigation-dropdown .omnibar-clear
       for visual consistency: 28x28 transparent, perfect-circle hover. */
      app-ai-timeline .clear-search-btn {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        color: var(--text-color-secondary);
        border-radius: 50%;
        cursor: pointer;
        z-index: 2;
        transition:
          background-color 150ms ease,
          color 150ms ease;
      }

      app-ai-timeline .clear-search-btn:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      app-ai-timeline .clear-search-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 1px;
      }

      app-ai-timeline .search-help-text {
        color: var(--text-color-secondary);
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
      }

      /* Date Range Filter */
      app-ai-timeline .date-range-wrapper {
        padding: 1rem 0.5rem;
        /* Prevent browser touch scroll interference with slider drag */
        touch-action: none;
      }

      app-ai-timeline .date-range-labels {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.75rem;
        font-size: 0.9rem;
        font-weight: 600;
      }

      app-ai-timeline .range-start {
        color: var(--primary-color-fg);
      }

      app-ai-timeline .range-end {
        color: var(--primary-color-fg);
      }

      /* Date Range Slider Styling */
      app-ai-timeline .date-range-slider {
        .p-slider {
          background: var(--surface-300);
          border: none;
          border-radius: 6px;
          height: 6px;
        }

        .p-slider-range {
          background: var(--primary-color);
          border-radius: 6px;
        }

        .p-slider-handle {
          background: var(--primary-color);
          border: 2px solid var(--surface-0);
          border-radius: 50%;
          width: 20px;
          height: 20px;
          transition: all 0.2s;
          cursor: grab;
        }

        .p-slider-handle:active {
          cursor: grabbing;
        }

        .p-slider-handle:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 8px rgba(var(--primary-color-rgb), 0.16);
        }

        .p-slider-handle.p-focus {
          box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.24);
        }
      }

      /* Sidebar Dropdowns */
      app-ai-timeline .sidebar-dropdown {
        width: 100% !important;
      }

      app-ai-timeline .sidebar-dropdown .p-select {
        width: 100%;
        font-size: 0.9rem;
      }

      /* ========== TIMELINE SECTION ========== */
      app-ai-timeline .timeline-section {
        padding: 0;
        background: transparent;
      }

      /* ========== TIMELINE DISPLAY CONTROL ========== */
      app-ai-timeline .desktop-timeline {
        display: block;
      }

      app-ai-timeline .mobile-timeline {
        display: none;
      }

      app-ai-timeline .custom-mobile-timeline {
        display: none;
      }

      /* ========== DESKTOP TIMELINE STYLES ONLY ========== */
      app-ai-timeline .desktop-timeline .p-timeline {
        background: transparent;

        .p-timeline-event {
          /* Content padding. Alignment is not keyed per event: the library puts
             p-timeline-<align> on the ROOT only and gives every event the bare
             p-timeline-event class (class map, openng-optimus-ui-timeline.mjs:13-21),
             so the .p-timeline-event-left / -right rules that stood here matched
             nothing. Key on the root class or :nth-child() if sides ever diverge. */
          .p-timeline-event-content {
            padding: 0 var(--space-4);
            width: 100%;
          }

          .p-timeline-event-marker {
            border: 2px solid var(--surface-border);
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
          }

          .p-timeline-event-connector {
            background: var(--primary-color);
            width: 2px;
          }
        }
      }

      /* ========== TIMELINE MARKER ========== */
      app-ai-timeline .timeline-marker {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      app-ai-timeline .timeline-marker i {
        font-size: 1.2rem;
      }

      /* Mobile-specific marker adjustments */
      @media (max-width: 1068px) {
        app-ai-timeline .timeline-marker {
          width: 2rem;
          height: 2rem;
        }

        app-ai-timeline .timeline-marker i {
          font-size: 1rem;
        }
      }

      /* ========== TIMELINE CARD ========== */
      app-ai-timeline .timeline-card {
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        max-width: 500px;
        overflow: hidden; /* Ensures content stays within rounded corners */
        scroll-margin-top: 100px; /* Offset for ToC scroll navigation */

        &:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .p-card-header {
          background: var(--primary-50);
          color: var(--primary-700);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--surface-border);
        }

        .p-card-body {
          padding: var(--space-4);
          overflow: hidden; /* Additional safety for card body content */
        }
      }

      /* ========== CARD HEADER ========== */
      app-ai-timeline .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .event-year {
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--accent-on-surface);
        }

        .event-category {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--accent-on-surface);
          background: var(--accent-surface);
          padding: var(--space-1) var(--space-2);
          border-radius: 12px;
        }
      }

      /* ========== TIMELINE CONTENT ========== */
      app-ai-timeline .timeline-content {
        .event-title {
          color: var(--text-color);
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: var(--space-2);
          line-height: 1.4;
          text-align: left;
        }

        .event-description {
          color: var(--text-color-secondary);
          line-height: 1.6;
          margin-bottom: var(--space-3);
          text-align: left;
        }

        .event-details {
          margin: var(--space-3) 0;
          text-align: left;

          .detail-item {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            margin-bottom: var(--space-2);
            font-size: 0.9rem;
            color: var(--text-color-secondary);
            text-align: left;

            i {
              color: var(--primary-500);
              width: 1rem;
              min-width: 1rem;
              font-size: 1rem;
              display: inline-block;
              flex-shrink: 0;
            }

            span {
              text-align: left;
            }
          }
        }

        /* ===== Empty state when filters yield zero results (new 2026-05-17) ===== */
      }

      app-ai-timeline .timeline-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 4rem 1.5rem;
        margin: 2rem auto;
        max-width: 32rem;
        text-align: center;
        background: var(--surface-card);
        border: 1px dashed var(--surface-border);
        border-radius: 12px;
      }

      app-ai-timeline .timeline-empty-icon {
        font-size: 2.5rem;
        color: var(--text-color-secondary);
        opacity: 0.6;
        margin-bottom: 0.25rem;
      }

      app-ai-timeline .timeline-empty-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-color);
        letter-spacing: -0.015em;
      }

      app-ai-timeline .timeline-empty-text {
        margin: 0;
        font-size: 0.95rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
        max-width: 28rem;
      }

      app-ai-timeline .timeline-empty-reset {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px solid var(--primary-color);
        border-radius: 6px;
        color: var(--primary-color);
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        transition:
          background 150ms ease,
          color 150ms ease;
      }

      app-ai-timeline .timeline-empty-reset:hover {
        background: var(--primary-color);
        color: var(--primary-color-text);
      }

      app-ai-timeline .timeline-empty-reset:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-ai-timeline .timeline-content {
        /* ===== People + Organizations (new 2026-05-17) ===== */
        .event-meta {
          margin: var(--space-3) 0 var(--space-2) 0;
          text-align: left;
        }

        .event-meta-row {
          display: flex;
          align-items: baseline;
          gap: var(--space-2);
          margin: 0 0 var(--space-2) 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--text-color-secondary);
          flex-wrap: wrap;
        }

        /* Icon color matches existing .detail-item icons for visual consistency */
        .event-meta-icon {
          color: var(--primary-500);
          font-size: 1rem;
          width: 1rem;
          min-width: 1rem;
          flex-shrink: 0;
          display: inline-block;
          transform: translateY(2px);
        }

        .event-meta-label {
          font-weight: 600;
          color: var(--text-color);
          flex-shrink: 0;
        }

        .event-meta-value {
          color: var(--text-color-secondary);
          word-break: break-word;
        }

        .event-image {
          margin: var(--space-3) 0;
          text-align: center;

          .timeline-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
        }

        .event-actions {
          margin-top: var(--space-4);
          padding-top: var(--space-3);
          border-top: 1px solid var(--surface-border);
        }
      }

      /* ========== FILTER SECTION ========== */
      app-ai-timeline .filter-section {
        margin-bottom: var(--space-5);
      }

      app-ai-timeline .p-panel {
        border: 1px solid var(--surface-border);
        border-radius: 12px;

        .p-panel-header {
          background: var(--primary-50);
          color: var(--primary-700);
          padding: var(--space-3) var(--space-4);
          font-weight: 600;
        }

        .p-panel-content {
          padding: var(--space-4);
        }
      }

      app-ai-timeline .filter-controls {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        align-items: start;
      }

      app-ai-timeline .filter-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);

        label {
          font-weight: 600;
          color: var(--text-color);
          font-size: 0.9rem;
        }

        &.date-range {
          grid-column: 1 / -1;

          .date-range-controls {
            max-width: none;
            width: 100%;
          }
        }
      }

      app-ai-timeline .filter-actions {
        grid-column: 1 / -1;
        display: flex;
        gap: var(--space-2);
        justify-content: flex-end;
        margin-top: var(--space-3);
        padding-top: var(--space-3);
        border-top: 1px solid var(--surface-border);
      }

      app-ai-timeline .filter-dropdown {
        width: 100%;

        .p-select {
          width: 100%;
          border: 1px solid var(--surface-border);
          border-radius: 6px;

          &:hover {
            border-color: var(--primary-500);
          }

          &.p-focus {
            border-color: var(--primary-500);
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-500) 20%, transparent);
          }
        }
      }

      app-ai-timeline .search-input {
        width: 100%;
        padding: var(--space-2) var(--space-3);
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        font-size: 0.9rem;

        &:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-500) 20%, transparent);
        }

        &::placeholder {
          color: var(--text-color-secondary);
        }
      }

      /* ========== RESPONSIVE DESIGN ========== */
      @media (max-width: 1324px) {
        app-ai-timeline .filter-sidebar {
          flex: 0 0 260px;
        }
      }

      @media (max-width: 1324px) {
        app-ai-timeline .ai-timeline-page {
          padding: var(--space-3);
        }

        /* Mobile: Stack sidebar on top */
        app-ai-timeline .content-layout {
          flex-direction: column;
          gap: 1rem;
        }

        app-ai-timeline .filter-sidebar {
          position: static;
          flex: none;
          max-height: none;
          order: -1;
          align-self: center;
          width: 100%;
          max-width: 500px;
        }

        app-ai-timeline .sidebar-content {
          padding: 1rem;
          gap: 1rem;
        }

        app-ai-timeline .sidebar-section {
          gap: 0.5rem;
        }

        /* Switch to custom mobile timeline */
        app-ai-timeline .desktop-timeline {
          display: none;
        }

        app-ai-timeline .mobile-timeline {
          display: none;
        }

        app-ai-timeline .custom-mobile-timeline {
          display: block;
        }

        /* ========== CUSTOM MOBILE TIMELINE STYLES ========== */
        app-ai-timeline .custom-mobile-timeline {
          position: relative;
          padding-left: 2.5rem;
        }

        /* Vertical line on the left */
        app-ai-timeline .timeline-line {
          position: absolute;
          left: 1rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--surface-border);
          z-index: 1;
        }

        /* Timeline events container */
        app-ai-timeline .timeline-events {
          position: relative;
          z-index: 2;
        }

        /* Individual timeline event */
        app-ai-timeline .timeline-event {
          position: relative;
          margin-bottom: 3px;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          scroll-margin-top: 80px; /* Offset for ToC scroll navigation */
        }

        /* Event marker positioned on the line */
        app-ai-timeline .event-marker {
          position: absolute;
          left: -2.5rem;
          top: 1rem;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 3;
        }

        app-ai-timeline .event-marker i {
          font-size: 1rem;
        }

        /* Event content takes up remaining space */
        app-ai-timeline .event-content {
          flex: 1;
          min-width: 0;
        }

        /* Mobile timeline card styling */
        app-ai-timeline .mobile-timeline-card {
          border: 1px solid var(--surface-border);
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          margin-bottom: 0;
          overflow: hidden; /* Ensures content stays within rounded corners */

          .p-card-header {
            background: var(--accent-surface);
            color: var(--accent-on-surface);
            padding: var(--space-2) var(--space-3);
            border-bottom: 1px solid var(--surface-border);
          }

          .p-card-body {
            padding: var(--space-3);
            overflow: hidden; /* Additional safety for card body content */
          }
        }

        /* Timeline responsiveness */
        app-ai-timeline .p-timeline .p-timeline-event {
          .p-timeline-event-content {
            padding: 0 var(--space-2) !important;
          }
        }

        app-ai-timeline .timeline-card {
          font-size: 0.9rem;
        }
      }

      @media (max-width: 480px) {
        app-ai-timeline .ai-timeline-page {
          padding: var(--space-2);
        }

        app-ai-timeline .search-field {
          font-size: 16px; /* Prevents zoom on iOS */
        }
      }

      /* CP-13: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        app-ai-timeline .timeline-card,
        app-ai-timeline .timeline-event {
          transition: none;
        }
      }

      /* CTM-18: Print styles - hide interactive controls */
      @media print {
        app-ai-timeline .filter-sidebar {
          display: none !important;
        }
      }

      /* Anchor-link arrival highlight: brief outline-pulse around the targeted event card. */
      @keyframes app-timeline-event-pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(14, 116, 144, 0.55);
          outline-color: rgba(14, 116, 144, 0.9);
        }
        50% {
          box-shadow: 0 0 0 14px rgba(14, 116, 144, 0);
          outline-color: rgba(14, 116, 144, 0.5);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(14, 116, 144, 0);
          outline-color: rgba(14, 116, 144, 0);
        }
      }
      app-ai-timeline .event-pulse {
        outline: 3px solid rgba(14, 116, 144, 0.9);
        outline-offset: 2px;
        border-radius: 12px;
        animation: app-timeline-event-pulse 2.6s ease-out 1;
        scroll-margin-top: 96px;
      }
      app-ai-timeline [id^='event-'] {
        scroll-margin-top: 96px;
      }
      @media (prefers-reduced-motion: reduce) {
        app-ai-timeline .event-pulse {
          animation: none;
          outline: 3px solid var(--p-cyan-700, #0e7490);
        }
      }
    `,
  ],
})
export class AiTimelineComponent {
  // Services injected using modern Angular patterns
  private translationService = inject(TranslationService);
  private timelineService = inject(TimelineService);
  private cdr = inject(ChangeDetectorRef);
  private highlightingService = inject(HighlightingService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  // Filter state
  selectedCategory = signal<string>('all');
  searchQuery = signal<string>('');
  dateRange = signal<number[]>([1950, 2024]);

  // Date range constants
  readonly minYear = 1950;
  readonly maxYear = 2024;

  private readonly dateSlider = viewChild('dateSlider', { read: ElementRef });

  // Computed properties
  isLoading = computed(() => this.timelineService.totalEvents() === 0);

  categoryOptions = computed(() => {
    const categories = this.timelineService.availableCategories();
    return [
      { label: this.translate('timeline.aiTimeline.categories.all'), value: 'all' },
      ...Object.entries(categories).map(([key]) => ({
        label: this.translate(`timeline.aiTimeline.categories.${key}`),
        value: key,
      })),
    ];
  });

  // Active filters as removable chips (shown above the "clear all" button).
  // The search is split into one chip per word; an EXACT: deep-link shows a single
  // chip; a narrowed date range shows a "start–end" chip.
  activeFilterChips = computed<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    const removePrefix = this.translate('timeline.aiTimeline.filters.removeFilter');

    const query = this.searchQuery().trim();
    if (query) {
      const searchLabel = this.translate('timeline.aiTimeline.filters.search');
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
      const name = this.translate(`timeline.aiTimeline.categories.${category}`);
      chips.push({
        key: 'category',
        label: name,
        icon: 'pi pi-tag',
        removeAriaLabel: `${removePrefix}: ${this.translate('timeline.aiTimeline.filters.category')} – ${name}`,
      });
    }

    const [start, end] = this.dateRange();
    if (start > this.minYear || end < this.maxYear) {
      const range = `${start}–${end}`;
      chips.push({
        key: 'dateRange',
        label: range,
        icon: 'pi pi-calendar',
        removeAriaLabel: `${removePrefix}: ${this.translate('timeline.aiTimeline.filters.dateRange')} – ${range}`,
      });
    }

    return chips;
  });

  // Public getters for template access
  get timelineServicePublic() {
    return this.timelineService;
  }

  constructor() {
    // Optimus UI's range slider binds each handle's aria-valuenow to `value[i]`, but
    // in range mode it stores the model in `values` — `value` stays undefined, so both
    // handles render without aria-valuenow (A11Y-003, found by check-a11y). The model
    // is dateRange(), so the attribute is written from it after every render.
    afterRenderEffect(() => {
      const handles = this.dateSlider()?.nativeElement.querySelectorAll('[role="slider"]');
      const range = this.dateRange();
      handles?.forEach((handle: Element, i: number) => handle.setAttribute('aria-valuenow', String(range[i])));
    });

    // V2 Pattern: Subscribe to language changes in constructor with takeUntilDestroyed
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.detectChanges();
    });

    // Handle URL query parameters for deep linking (e.g., ?search=exact:eu-ai-act-2024).
    // The INITIAL ?search must NOT be applied during hydration: /ai-timeline is
    // prerendered, and mutating the filtered p-timeline/@for mid-hydration wedges
    // the prerendered nodes (Glossar/Catalog pattern, Incident 2026-06-08). Apply it
    // AFTER the first render (browser-only); later SPA navigations apply immediately.
    let initialParamHandled = !isPlatformBrowser(this.platformId);
    afterNextRender(() => {
      this.applySearchParam(this.route.snapshot.queryParamMap.get('search'));
      initialParamHandled = true;
    });

    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (!initialParamHandled) return; // initial value owned by afterNextRender above
      this.applySearchParam(params['search']);
    });

    // Anchor-link support: /ai-timeline#turing-test-1950 scrolls to event + briefly
    // highlights it, keeping the rest of the timeline visible around it.
    this.route.fragment.pipe(takeUntilDestroyed()).subscribe((fragment) => {
      if (fragment && isPlatformBrowser(this.platformId)) {
        this.scrollToEventWithRetry(fragment, 15);
      }
    });
  }

  /**
   * Apply a `search` query-param value to the timeline filter state. Extracted so
   * the initial (post-hydration) application and later SPA-navigation updates share
   * one path.
   */
  private applySearchParam(searchParam: string | null | undefined): void {
    if (!searchParam) return;
    this.searchQuery.set(searchParam);

    // An EXACT: deep-link (e.g. ?search=exact:turing-test-1950) targets one specific
    // event. Reset every other filter first so a previously-active category or
    // date-range selection can't hide the deep-link target.
    if (searchParam.toLowerCase().startsWith('exact:')) {
      this.selectedCategory.set('all');
      this.dateRange.set([this.minYear, this.maxYear]);
      this.timelineService.clearFilters();
    }

    this.timelineService.updateFilters({ search: searchParam });
  }

  // browser-only: the fragment subscription calls it behind isPlatformBrowser.
  private scrollToEventWithRetry(eventId: string, attemptsLeft: number): void {
    // Both desktop and mobile timelines render the same event at different IDs.
    // Whichever is currently visible (offsetParent !== null) is the scroll target.
    const desktopEl = document.getElementById('event-' + eventId);
    const mobileEl = document.getElementById('event-m-' + eventId);
    const target =
      desktopEl && desktopEl.offsetParent !== null
        ? desktopEl
        : mobileEl && mobileEl.offsetParent !== null
          ? mobileEl
          : null;
    if (target) {
      target.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
      target.classList.add('event-pulse');
      setTimeout(() => target.classList.remove('event-pulse'), 2800);
      return;
    }
    if (attemptsLeft > 0) {
      // Events load async — retry until rendered
      setTimeout(() => this.scrollToEventWithRetry(eventId, attemptsLeft - 1), 200);
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  openLink(url: string): void {
    // Scheme-checked: event links come from content JSON, and window.open
    // is not covered by Angular's URL sanitizer. See utils/open-external.
    openExternal(url);
  }

  onCategoryChange(event: { value: string }): void {
    this.selectedCategory.set(event.value);
    this.timelineService.updateFilters({ category: event.value });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.timelineService.updateFilters({ search: target.value });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.timelineService.updateFilters({ search: '' });
  }

  /**
   * Extract range array from slider event (handles various event formats)
   */
  private extractRange(event: SliderRangeEvent): number[] | null {
    let range: number[];
    if (Array.isArray(event)) {
      range = event;
    } else if (event?.value && Array.isArray(event.value)) {
      range = event.value;
    } else if (event && Array.isArray(event.values)) {
      range = event.values;
    } else {
      return null;
    }

    if (!Array.isArray(range) || range.length !== 2 || range[0] == null || range[1] == null) {
      return null;
    }

    // Ensure proper order
    return [Math.min(range[0], range[1]), Math.max(range[0], range[1])];
  }

  /**
   * Called during slider drag - updates filter only when year value changes.
   * Since step=1 (years), this fires ~74 times max instead of thousands.
   */
  onDateRangeDrag(event: SliderRangeEvent): void {
    const range = this.extractRange(event);
    if (!range) return;

    const currentRange = this.dateRange();
    const yearChanged = range[0] !== currentRange[0] || range[1] !== currentRange[1];

    if (yearChanged) {
      this.dateRange.set([...range]);
      this.timelineService.updateFilters({
        dateRange: { start: range[0], end: range[1] },
      });
    }
  }

  /**
   * Called when slider drag ends - ensures final value is committed.
   */
  onDateRangeCommit(event: SliderRangeEvent): void {
    const range = this.extractRange(event);
    if (range) {
      this.dateRange.set([...range]);
      this.timelineService.updateFilters({
        dateRange: { start: range[0], end: range[1] },
      });
    }
  }

  clearAllFilters(): void {
    this.selectedCategory.set('all');
    this.searchQuery.set('');
    this.dateRange.set([this.minYear, this.maxYear]);
    this.timelineService.clearFilters();
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
   * category and date-range filters reset to their defaults.
   */
  removeFilterChip(key: string): void {
    if (key === 'category') {
      this.selectedCategory.set('all');
      this.timelineService.updateFilters({ category: 'all' });
      return;
    }
    if (key === 'dateRange') {
      this.dateRange.set([this.minYear, this.maxYear]);
      this.timelineService.updateFilters({ dateRange: undefined });
      return;
    }
    if (key === 'search') {
      this.clearSearch();
      return;
    }
    if (key.startsWith('word:')) {
      const index = Number(key.slice(5));
      const words = this.searchWords(this.searchQuery().trim());
      if (index < 0 || index >= words.length) return;
      words.splice(index, 1);
      const next = words.join(' ');
      this.searchQuery.set(next);
      this.timelineService.updateFilters({ search: next });
    }
  }

  // All filtered events sorted chronologically (for continuous timeline)
  allFilteredEvents = computed(() => {
    const events = this.timelineServicePublic.filteredEvents();
    return [...events].sort((a, b) => a.date.localeCompare(b.date));
  });

  // Group events by decade (for ToC navigation anchors only)
  eventsByDecade = computed(() => {
    const events = this.timelineServicePublic.filteredEvents();
    const grouped = new Map<number, TimelineEvent[]>();

    events.forEach((event) => {
      const decade = Math.floor(Number(event.year) / 10) * 10;
      if (!grouped.has(decade)) {
        grouped.set(decade, []);
      }
      grouped.get(decade)!.push(event);
    });

    // Convert to sorted array, with events sorted chronologically within each decade
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([decade, decadeEvents]) => ({
        decade,
        events: decadeEvents.sort((a, b) => a.date.localeCompare(b.date)),
      }));
  });

  // Table of Contents - dynamically generate decades from filtered events
  // Points to the first event of each decade for smooth scrolling
  tocItems = computed<TocItem[]>(() => {
    const items: TocItem[] = [
      {
        id: 'filters',
        label: this.translate('timeline.aiTimeline.sections.filters'),
        icon: 'pi pi-filter',
      },
    ];

    // Get decades from grouped events - link to first event of each decade.
    // Both desktop (`event-X`) and mobile (`event-m-X`) IDs are provided —
    // the ToC FAB picks whichever is currently visible. Without the mobile
    // alternate, scroll on mobile lands on the hidden desktop element.
    const decadeGroups = this.eventsByDecade();
    decadeGroups.forEach(({ decade, events }) => {
      if (events.length > 0) {
        items.push({
          id: `event-${events[0].id}`,
          alternateIds: [`event-m-${events[0].id}`],
          label: `${decade}s`,
          icon: 'pi pi-calendar',
        });
      }
    });

    return items;
  });

  // TrackBy functions for ngFor performance optimization
  trackByEvent(index: number, event: TimelineEvent): string {
    return event.id;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
