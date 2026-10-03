/**
 * LernbereichComponent (Unified Learning Area Hub)
 *
 * Replaces 3 separate hub pages (/demos, /guides, /learning-paths) with
 * a single unified page featuring two views:
 * - Lernpfade (default): embeds LearningPathsOverviewComponent
 * - Inhalte: grouped layout of all demos + lessons with filters
 *
 * View is controlled via ?view=paths|content query param.
 */
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ViewEncapsulation,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';
import { skip, take } from 'rxjs/operators';

// Optimus UI
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { TagModule } from '@openng/optimus-ui/tag';

// Components
import { LearningPathsOverviewComponent } from '../learning-paths/learning-paths-overview.component';
import { IllustrationComponent } from '../../components/shared/illustration.component';
import { BAKED_ILLUSTRATION } from '../../components/shared/baked-thumbnails.manifest';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

// Services
import { TranslationService } from '../../services/translation.service';
import { DemosService } from '../../services/demos.service';
import { ArticlesService } from '../../services/articles.service';
import { LearningPathService } from '../../services/learning-path.service';
import { LearningPathDefinition, LearningPathSector } from '../../models/learning-path.model';

// Environment & Dev tools
import { DevModeService } from '../../services/dev-mode.service';
import { TimeGateService } from '../../services/time-gate.service';
import { dateLocaleFor } from '../../utils/date-locale';
import { SITE_CONFIG } from '../../../config/site';

/** Unified content item for the Inhalte view */
interface LernbereichItem {
  id: string;
  path: string;
  titleKey: string;
  descriptionKey: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
  type: 'demo' | 'lesson';
  pageId?: string;
  draft?: boolean;
  timeLocked?: boolean;
  publishDate?: string;
}

/** Thematic group definition */
interface ContentGroup {
  key: string;
  labelKey: string;
  itemIds: string[];
}

/** View toggle option */
interface ViewOption {
  label: string;
  value: string;
  icon: string;
}

@Component({
  selector: 'app-lernbereich',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    SelectButtonModule,
    InputTextModule,
    TagModule,
    LearningPathsOverviewComponent,
    IllustrationComponent,
    PageHeaderComponent,
    SimpleEasyLanguageFabComponent,
    TableOfContentsFabComponent,
    FabStackComponent,
    CursorGlowDirective,
    RouterModule,
  ],
  template: `
    <section class="lernbereich-page" [attr.aria-label]="t('lernbereich.title')">
      <app-page-header titleKey="lernbereich.title" subtitleKey="lernbereich.subtitle">
        <div class="lernbereich-view-toggle">
          <p-selectbutton
            [options]="viewOptions()"
            [ngModel]="currentView()"
            (ngModelChange)="currentView.set($event)"
            (onChange)="onViewChange($event)"
            optionLabel="label"
            optionValue="value"
            [allowEmpty]="false"
            styleClass="view-select-buttons"
            [attr.aria-label]="t('lernbereich.viewLabel')"
          >
          </p-selectbutton>
        </div>
      </app-page-header>

      <!-- Lernpfade View -->
      @if (currentView() === 'paths') {
        <app-learning-paths-overview [embedded]="true"></app-learning-paths-overview>
      }

      <!-- Inhalte View -->
      @if (currentView() === 'content') {
        <div class="inhalte-view">
          <!-- Filters -->
          <div class="filters-bar">
            <div class="filter-group">
              <p-selectbutton
                [options]="typeFilterOptions()"
                [ngModel]="selectedType()"
                (ngModelChange)="selectedType.set($event)"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                styleClass="type-filter-buttons"
                [attr.aria-label]="t('lernbereich.filterType')"
              >
              </p-selectbutton>
            </div>

            <div class="filter-group">
              <p-selectbutton
                [options]="difficultyFilterOptions()"
                [ngModel]="selectedDifficulty()"
                (ngModelChange)="selectedDifficulty.set($event)"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                styleClass="difficulty-filter-buttons"
                [attr.aria-label]="t('lernbereich.filterDifficulty')"
              >
              </p-selectbutton>
            </div>

            <div class="search-container">
              <span class="p-input-icon-left search-wrapper">
                <i class="pi pi-search"></i>
                <input
                  type="text"
                  pInputText
                  [placeholder]="t('lernbereich.searchPlaceholder')"
                  [attr.aria-label]="t('lernbereich.searchPlaceholder')"
                  [ngModel]="searchTerm()"
                  (ngModelChange)="searchTerm.set($event)"
                  class="search-input"
                />
              </span>
            </div>
          </div>

          <!-- Grouped Content -->
          @if (filteredGroups().length > 0) {
            @for (group of filteredGroups(); track group.key) {
              <section class="content-group" [id]="group.key">
                <h2 class="group-title">{{ t(group.labelKey) }}</h2>
                <div class="content-grid">
                  @for (item of group.items; track item.id) {
                    @if (isTimeLocked(item)) {
                      <div
                        class="card-link card-locked"
                        [attr.aria-label]="t(item.titleKey) + ' - ' + t('learningPaths.comingSoon')"
                      >
                        <article
                          class="content-card"
                          [class.demo]="item.type === 'demo'"
                          [class.lesson]="item.type === 'lesson'"
                        >
                          <div class="coming-soon-stamp" aria-hidden="true">
                            <div class="stamp-inner">
                              <span class="stamp-text">{{ t('learningPaths.comingSoon') }}</span>
                            </div>
                          </div>
                          <div class="card-top">
                            <app-illustration [stepId]="illustrationKey(item)" size="fluid" class="card-illustration" />
                            <i
                              [class]="item.icon || 'pi pi-box'"
                              class="card-icon card-icon-fallback"
                              aria-hidden="true"
                            ></i>
                            <div class="card-badges">
                              <span class="release-date-badge">
                                <i class="pi pi-calendar" aria-hidden="true"></i>
                                {{ formatReleaseDate(item.publishDate!) }}
                              </span>
                            </div>
                          </div>
                          <h3 class="card-title">{{ t(item.titleKey) }}</h3>
                          <p class="card-description">{{ t(item.descriptionKey) }}</p>
                          @if (item.difficulty) {
                            <span class="difficulty-indicator" [class]="item.difficulty">
                              {{ t('learningPaths.difficulty.' + item.difficulty) }}
                            </span>
                          }
                        </article>
                      </div>
                    } @else {
                      <a
                        [routerLink]="'/' + item.path"
                        [queryParams]="{ from: 'learn' }"
                        class="card-link"
                        [attr.aria-label]="t(item.titleKey)"
                      >
                        <article
                          class="content-card"
                          [class.demo]="item.type === 'demo'"
                          [class.lesson]="item.type === 'lesson'"
                          appCursorGlow
                        >
                          <div class="card-top">
                            <app-illustration [stepId]="illustrationKey(item)" size="fluid" class="card-illustration" />
                            <i
                              [class]="item.icon || 'pi pi-box'"
                              class="card-icon card-icon-fallback"
                              aria-hidden="true"
                            ></i>
                            <div class="card-badges">
                              @if (item.draft) {
                                <p-tag value="DRAFT" severity="warn" [rounded]="true"></p-tag>
                              }
                              @if (item.type === 'demo') {
                                <span class="type-badge demo-badge">
                                  <i class="pi pi-play" aria-hidden="true"></i> {{ t('lernbereich.badgeDemo') }}
                                </span>
                              } @else {
                                <span class="type-badge lesson-badge">
                                  <i class="pi pi-book" aria-hidden="true"></i> {{ t('lernbereich.badgeLesson') }}
                                </span>
                              }
                            </div>
                          </div>
                          <h3 class="card-title">{{ t(item.titleKey) }}</h3>
                          <p class="card-description">{{ t(item.descriptionKey) }}</p>
                          @if (item.difficulty) {
                            <span class="difficulty-indicator" [class]="item.difficulty">
                              {{ t('learningPaths.difficulty.' + item.difficulty) }}
                            </span>
                          }
                        </article>
                      </a>
                    }
                  }
                </div>
              </section>
            }
          } @else {
            <div class="empty-state">
              <i class="pi pi-search" aria-hidden="true"></i>
              <p>{{ t('lernbereich.emptyState') }}</p>
              <p class="empty-state-hint">{{ t('lernbereich.emptyStateHint') }}</p>
              <button class="clear-btn" (click)="clearFilters()">
                {{ t('lernbereich.clearFilters') }}
              </button>
            </div>
          }
        </div>
      }

      <!-- FAB Stack: Table of Contents & Easy Language -->
      <app-fab-stack>
        <app-table-of-contents-fab [items]="tocItems()" [title]="t('lernbereich.title')"> </app-table-of-contents-fab>

        <app-simple-easy-language-fab contentId="lernbereich" contentType="page"> </app-simple-easy-language-fab>
      </app-fab-stack>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-lernbereich {
        display: block;
      }

      app-lernbereich .lernbereich-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem 2rem;
      }

      /* View toggle inside page-header ng-content slot */
      app-lernbereich .lernbereich-view-toggle {
        margin-top: 1rem;
      }

      app-lernbereich .view-select-buttons .p-button {
        min-width: 120px;
        justify-content: center;
      }

      /* Inhalte View */
      app-lernbereich .inhalte-view {
        margin-top: 0.5rem;
      }

      app-lernbereich .filters-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
      }

      app-lernbereich .filter-group {
        flex-shrink: 0;
      }

      app-lernbereich .search-container {
        flex: 1;
        min-width: 200px;
      }

      app-lernbereich .search-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        width: 100%;
      }

      app-lernbereich .search-wrapper i {
        position: absolute;
        left: 0.75rem;
        color: var(--text-color-secondary);
        z-index: 1;
      }

      app-lernbereich .search-input {
        width: 100%;
        padding-left: 2.5rem !important;
      }

      /* Content Groups */
      app-lernbereich .content-group {
        margin-bottom: 2.5rem;
      }

      app-lernbereich .group-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--primary-color);
      }

      app-lernbereich .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1rem;
      }

      /* Content Cards */
      app-lernbereich .content-card.demo {
        --cursor-glow-color: var(--blue-500);
      }

      app-lernbereich .content-card.lesson {
        --cursor-glow-color: var(--green-500);
      }

      app-lernbereich .content-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        padding: 1.25rem;
        cursor: pointer;
        transition: box-shadow 0.2s;
      }

      app-lernbereich .content-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      app-lernbereich .card-top {
        position: relative;
        margin-bottom: 0.75rem;
        min-height: 1.5rem;
      }

      app-lernbereich .card-icon {
        font-size: 1.5rem;
        color: var(--primary-color-fg);
      }
      /* Schaubild replaces the icon when present; fallback icon stays hidden by default.
       The schaubild registry's @default branch renders an empty placeholder, so we
       can simply show the schaubild and keep the icon as a deeper fallback. */
      /* Schaubild fills the card-top area as block; badges float over top-right corner. */
      app-lernbereich .card-illustration {
        display: block;
        width: 100%;
        max-width: 100%;
        margin-bottom: 0.5rem;
      }
      app-lernbereich .card-icon-fallback {
        display: none;
      }

      app-lernbereich .card-badges {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        z-index: 2;
      }

      app-lernbereich .type-badge {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      /* Badges sitzen absolut über dem Schaubild — Hintergrund MUSS opak sein,
       sonst scheint das Visual durch. Mix mit surface-card statt transparent. */
      app-lernbereich .demo-badge {
        background: color-mix(in srgb, var(--blue-500) 18%, var(--surface-card));
        color: var(--blue-500);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        border: 1px solid color-mix(in srgb, var(--blue-500) 30%, transparent);
      }

      app-lernbereich .lesson-badge {
        background: color-mix(in srgb, var(--green-500) 18%, var(--surface-card));
        color: var(--green-500);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        border: 1px solid color-mix(in srgb, var(--green-500) 30%, transparent);
      }

      app-lernbereich .card-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0 0 0.5rem 0;
        line-height: 1.3;
      }

      app-lernbereich .card-description {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
        margin: 0 0 0.75rem 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      app-lernbereich .difficulty-indicator {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        text-transform: uppercase;
      }

      app-lernbereich .difficulty-indicator.beginner {
        background: color-mix(in srgb, var(--green-500) 15%, transparent);
        color: var(--green-500);
      }

      app-lernbereich .difficulty-indicator.intermediate {
        background: color-mix(in srgb, var(--yellow-500) 15%, transparent);
        color: var(--yellow-500);
      }

      app-lernbereich .difficulty-indicator.advanced {
        background: color-mix(in srgb, var(--red-500) 15%, transparent);
        color: var(--red-500);
      }

      /* Empty State */
      app-lernbereich .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--text-color-secondary);
      }

      app-lernbereich .empty-state i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }

      app-lernbereich .empty-state p {
        font-size: 1.1rem;
        margin: 0 0 1rem 0;
      }

      app-lernbereich .empty-state .empty-state-hint {
        font-size: 0.9rem;
        max-width: 34rem;
        margin: -0.25rem auto 1.25rem auto;
      }

      app-lernbereich .clear-btn {
        background: none;
        border: 1px solid var(--primary-color);
        color: var(--primary-color-fg);
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 0.9rem;
      }

      app-lernbereich .clear-btn:hover {
        background: var(--primary-color);
        color: var(--primary-color-text);
      }

      app-lernbereich .clear-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* HUB-5: Card link wrapper */
      app-lernbereich .card-link {
        text-decoration: none;
        color: inherit;
        display: block;
      }

      app-lernbereich .card-link:hover .content-card {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      app-lernbereich .card-link:focus-visible .content-card {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-lernbereich .card-link:focus-visible {
        outline: none;
      }

      /* Locked card (time-gated content) */
      app-lernbereich .card-locked {
        display: block;
        cursor: default;
      }

      app-lernbereich .card-locked .content-card {
        opacity: 0.65;
        border-style: dashed;
        filter: saturate(0.4);
        cursor: default;
        position: relative;
        overflow: visible;
      }

      app-lernbereich .card-locked .content-card:hover {
        box-shadow: none;
      }

      /* Coming Soon stamp */
      app-lernbereich .coming-soon-stamp {
        position: absolute;
        top: 0.5rem;
        right: -0.6rem;
        transform: rotate(12deg);
        z-index: 10;
        pointer-events: none;
      }

      app-lernbereich .coming-soon-stamp .stamp-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.15rem 0.6rem;
        border: 2px solid #c41e3a;
        border-radius: 2px;
        background: transparent;
        box-shadow:
          inset 0 0 0 1px transparent,
          inset 0 0 0 2px #c41e3a;
      }

      app-lernbereich .coming-soon-stamp .stamp-text {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.55rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #c41e3a;
        max-width: 4.5rem;
        text-align: center;
      }

      /* Release date badge */
      app-lernbereich .release-date-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.2rem 0.5rem;
        border-radius: 20px;
        background: color-mix(in srgb, var(--semantic-blue-fg) 12%, transparent);
        color: var(--semantic-blue-fg);
      }

      /* Responsive */
      @media (max-width: 768px) {
        app-lernbereich .lernbereich-page {
          padding: 1rem 0.5rem;
        }

        app-lernbereich .filters-bar {
          flex-direction: column;
          align-items: stretch;
        }

        app-lernbereich .filter-group {
          flex-shrink: 1;
          max-width: 100%;
        }

        app-lernbereich .filter-group > p-selectbutton {
          display: flex !important;
          flex-wrap: wrap !important;
          max-width: 100%;
          gap: 4px;
        }

        app-lernbereich .filter-group p-togglebutton {
          flex: 1 1 auto;
          min-width: 0;
          text-align: center;
          justify-content: center;
        }

        app-lernbereich .filter-group p-togglebutton.difficulty-filter-buttons {
          flex: 1 1 calc(50% - 4px);
        }

        app-lernbereich .filter-group p-togglebutton .p-togglebutton-label {
          font-size: 0.85rem;
          white-space: nowrap;
        }

        app-lernbereich .content-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class LernbereichComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private translationService = inject(TranslationService);
  private demosService = inject(DemosService);
  private articlesService = inject(ArticlesService);
  private learningPathService = inject(LearningPathService);
  private devModeService = inject(DevModeService);
  private timeGateService = inject(TimeGateService);
  /** With the demos feature switched off (site.json) the hub lists no demos and offers no demo filter. */
  private readonly demosOn = inject(SITE_CONFIG).isFeatureOn('demos');
  private subscriptions: Subscription[] = [];

  // View state
  currentView = signal('paths');

  // Learning paths for ToC
  paths = signal<LearningPathDefinition[]>([]);

  // Content state
  allItems = signal<LernbereichItem[]>([]);
  searchTerm = signal('');
  selectedType = signal('all');
  selectedDifficulty = signal('all');

  // Static thematic groups: each group lists the item ids (demo ids from
  // core/demos/index.json, article ids from core/articles/index.json) it
  // contains; groups whose items don't exist are hidden. Replace this seed
  // group with your own topic groups as your content grows.
  private readonly contentGroups: ContentGroup[] = [
    {
      key: 'examples',
      labelKey: 'lernbereich.group.examples',
      itemIds: ['seed-demo', 'seed-article-1'],
    },
  ];

  // View options for toggle
  viewOptions = computed<ViewOption[]>(() => [
    { label: this.t('lernbereich.viewPaths'), value: 'paths', icon: 'pi pi-map' },
    { label: this.t('lernbereich.viewContent'), value: 'content', icon: 'pi pi-th-large' },
  ]);

  // Type filter options
  typeFilterOptions = computed(() => [
    { label: this.t('lernbereich.filterAll'), value: 'all' },
    ...(this.demosOn ? [{ label: this.t('lernbereich.filterDemos'), value: 'demo' }] : []),
    { label: this.t('lernbereich.filterLessons'), value: 'lesson' },
  ]);

  // Difficulty filter options
  difficultyFilterOptions = computed(() => [
    { label: this.t('lernbereich.difficultyAll'), value: 'all' },
    { label: this.t('learningPaths.difficulty.beginner'), value: 'beginner' },
    { label: this.t('learningPaths.difficulty.intermediate'), value: 'intermediate' },
    { label: this.t('learningPaths.difficulty.advanced'), value: 'advanced' },
  ]);

  private static readonly SECTOR_ORDER: LearningPathSector[] = ['foundation', 'workshop', 'academy', 'society'];

  // Dynamic ToC items based on current view
  tocItems = computed<TocItem[]>(() => {
    // Reactive dependency: recompute labels on every language switch.
    void this.translationService.currentLanguage;
    if (this.currentView() === 'paths') {
      const paths = this.paths();
      const items: TocItem[] = [];
      for (const s of LernbereichComponent.SECTOR_ORDER) {
        const sectorPaths = paths.filter((p) => p.sector === s);
        if (!sectorPaths.length) continue;
        items.push({
          id: 'sector-' + s,
          label: this.t('learningPaths.sectors.' + s),
          icon: 'pi pi-folder',
          children: sectorPaths.map((p) => ({
            id: p.id,
            label: this.t(p.titleKey),
            icon: p.icon || 'pi pi-map',
          })),
        });
      }
      return items;
    }
    // Content view: show visible content groups
    return this.filteredGroups().map((g) => ({
      id: g.key,
      label: this.t(g.labelKey),
      icon: 'pi pi-folder',
    }));
  });

  // Filtered groups for display
  filteredGroups = computed(() => {
    const items = this.allItems();
    const typeFilter = this.selectedType();
    const diffFilter = this.selectedDifficulty();
    const search = this.searchTerm().toLowerCase().trim();

    return this.contentGroups
      .map((group) => {
        const groupItems = group.itemIds
          .map((id) => items.find((item) => item.id === id))
          .filter((item): item is LernbereichItem => {
            if (!item) return false;
            if (this.devModeService.isEffectivelyProd() && item.draft) return false;
            if (typeFilter !== 'all' && item.type !== typeFilter) return false;
            if (diffFilter !== 'all' && item.difficulty !== diffFilter) return false;
            if (search) {
              const title = this.t(item.titleKey).toLowerCase();
              const desc = this.t(item.descriptionKey).toLowerCase();
              return title.includes(search) || desc.includes(search);
            }
            return true;
          });

        return { ...group, items: groupItems };
      })
      .filter((group) => group.items.length > 0);
  });

  // Translation shorthand
  t(key: string): string {
    return this.translationService.translate(key);
  }

  constructor() {
    // Initial-Query-Params NICHT synchron anwenden: /learn ist in 28 Sprachen
    // prerendert; ein View-Wechsel mid-hydration verkeilt die prerenderten
    // Knoten (Glossar-Pattern, Incident 2026-06-08). Der Initialwert kommt
    // nach dem ersten Render (afterNextRender = browser-only); alle späteren
    // Emissionen (SPA-Navigation auf /learn) greifen sofort — vorher wurden
    // sie via Snapshot-Read komplett ignoriert. skip(1) überspringt genau die
    // synchrone Initial-Emission, die mid-hydration läge.
    afterNextRender(() => this.applyQueryParams());
    this.route.queryParams.pipe(skip(1), takeUntilDestroyed()).subscribe(() => this.applyQueryParams());
  }

  private applyQueryParams(): void {
    const viewParam = this.route.snapshot.queryParamMap.get('view');
    if (viewParam === 'content' || viewParam === 'paths') {
      this.currentView.set(viewParam);
    }
    const typeParam = this.route.snapshot.queryParamMap.get('type');
    if ((typeParam === 'demo' && this.demosOn) || typeParam === 'lesson') {
      this.selectedType.set(typeParam);
    }
  }

  ngOnInit(): void {
    // Subscribe to learning paths for ToC
    this.subscriptions.push(
      this.learningPathService.paths$.subscribe((paths) => {
        this.paths.set(paths);
      }),
    );

    this.loadContent();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onViewChange(event: { value?: string }): void {
    if (!event.value) return;
    this.currentView.set(event.value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: event.value },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  navigateTo(item: LernbereichItem): void {
    this.router.navigate(['/' + item.path], {
      queryParams: { from: 'learn' },
    });
  }

  /**
   * Maps a content-view item to its baked-thumbnail key.
   * Articles use their full id ('seed-article-1'). Demos usually use their
   * pageId ('sdmo' for the example demo), which equals the baked key — but a
   * pageId can differ from the baked key, so we prefer pageId only when it is
   * actually baked, else fall back to the demo id (which the paths view /
   * learning-paths step.id also use). Without this, such demos request an
   * unbaked id and render an empty placeholder.
   */
  illustrationKey(item: LernbereichItem): string {
    if (item.type !== 'demo') return item.id;
    const pid = item.pageId || item.id;
    return BAKED_ILLUSTRATION.has(pid) ? pid : item.id;
  }

  clearFilters(): void {
    this.selectedType.set('all');
    this.selectedDifficulty.set('all');
    this.searchTerm.set('');
  }

  isTimeLocked(item: LernbereichItem): boolean {
    return (
      this.devModeService.isEffectivelyProd() &&
      !!item.publishDate &&
      !this.timeGateService.isPublished(item.publishDate)
    );
  }

  formatReleaseDate(dateStr: string): string {
    // Date-only or full ISO — appending 'T00:00:00' to full ISO yields
    // Invalid Date (demo publishDates are full ISO). Mirrors TimeGateService.
    const date = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    const locale = dateLocaleFor(this.translationService.currentIntlLocale);
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  private loadContent(): void {
    forkJoin({
      demos: this.demosService.getAllDemos(),
      articles: this.articlesService.getAll(),
    }).subscribe({
      next: ({ demos, articles }) => {
        // Hide not-yet-released demos (staged weekly drop); dev shows all.
        const demoItems: LernbereichItem[] = demos
          .filter((d) => this.demosOn && this.demosService.isVisible(d))
          .map((d) => ({
            id: d.id,
            path: d.path,
            titleKey: d.titleKey,
            descriptionKey: d.descriptionKey,
            difficulty: d.difficulty,
            icon: d.icon,
            type: 'demo' as const,
            pageId: d.pageId,
          }));

        const articleItems: LernbereichItem[] = articles.map((a) => ({
          id: a.id,
          path: a.path,
          titleKey: a.titleKey,
          descriptionKey: a.descriptionKey,
          difficulty: a.difficulty,
          icon: a.icon || 'pi pi-file-edit',
          type: 'lesson' as const,
          draft: a.draft,
        }));

        const allItems = [...demoItems, ...articleItems];

        // Enrich items with publishDate from learning paths (always, regardless of dev/prod)
        this.learningPathService.paths$.pipe(take(1)).subscribe((paths) => {
          const publishDateMap = new Map<string, string>();
          for (const path of paths) {
            if (path.publishDate) {
              for (const step of path.steps) {
                publishDateMap.set(step.id, path.publishDate);
              }
            }
          }

          const enriched = allItems.map((item) => {
            // Demos are always available — never inherit publishDate from paths
            if (item.type === 'demo') return item;
            const pubDate = publishDateMap.get(item.id);
            if (pubDate) {
              return { ...item, publishDate: pubDate };
            }
            return item;
          });
          this.allItems.set(enriched);
        });
      },
      error: (err) => {
        console.error('Failed to load Lernbereich content:', err);
      },
    });
  }
}
