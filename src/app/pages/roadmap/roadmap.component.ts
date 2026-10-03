/**
 * RoadmapComponent — the release roadmap page
 *
 * Two sections (post Phase H of the Header-Combo concept):
 * 1. Learning Path Release Timeline (from LearningPathService + TimeGateService)
 * 2. Translation Quality Status (from static JSON: assets/data/roadmap/language-review.json)
 *
 * The chronological news feed lives at /news now (paired but separate
 * page — see Header-Combo concept §4 for the no-merge decision). A
 * cross-link banner above the sections points users to it.
 *
 * DATA SOURCE:
 * src/assets/data/roadmap/language-review.json is a static, committed seed file
 * (de + en as reference entries) that ships with the kit. It describes
 * per-language key-coverage status against the de reference. There is no
 * generator in this kit — edit the JSON directly, or add a downstream generator
 * (optional) that regenerates it from real coverage data.
 */
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  computed,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { of, catchError } from 'rxjs';

// Optimus UI
import { TagModule } from '@openng/optimus-ui/tag';

// Components
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { ThumbnailComponent } from '../../components/shared/thumbnail.component';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

// Services
import { TranslationService } from '../../services/translation.service';
import { getDisplayAsset, hasFlag } from '../../services/flags';
import { getLanguageInfo } from '../../../config/languages';
import { LearningPathService } from '../../services/learning-path.service';
import { LearningPathDefinition } from '../../models/learning-path.model';
import { DemosService, DemoMeta } from '../../services/demos.service';
import { TimeGateService } from '../../services/time-gate.service';
import { DevModeService } from '../../services/dev-mode.service';
import { dateLocaleFor } from '../../utils/date-locale';
import { SITE_CONFIG } from '../../../config/site';

/** Portal launch date — everything without a publishDate shipped on this day. */
const GO_LIVE_DATE = '2026-05-02';

/**
 * Year sentinel for dev-only placeholder content. By convention an unfinished
 * demo carries `publishDate: '2099-01-01T…'` so it stays hidden in prod (its
 * date is never reached) while `isDevMode()` reveals it for preview — see
 * DemosService.isVisible. The roadmap must NOT list these as real scheduled
 * "planned 2099" drops in prod; they only belong on the dev timeline.
 */
const DEV_PLACEHOLDER_YEAR = '2099';

/**
 * A constituent tile inside a drop card: one article, demo or hub section.
 * `route` is the raw path handed to <app-thumbnail> (which resolves it to a
 * Schaubild / visual-snippet / icon) and also the router link. `published`
 * decides clickable-vs-locked. Title reuses the existing translation key — no
 * new i18n keys are introduced by the sub-tile grid.
 */
interface DropChild {
  route: string;
  titleKey: string;
  /** Only used for <app-thumbnail>'s icon fallback when no visual matches. */
  pageType: string;
  published: boolean;
}

/**
 * Hub sections that were live at go-live (glossary, timeline, …). Titles reuse
 * the existing route titleKeys; <app-thumbnail> renders each via its
 * SECTION_PATH_TO_SNIPPET visual. Canonical routes only, like that map.
 */
const GO_LIVE_SECTIONS: Omit<DropChild, 'published'>[] = [
  { route: '/glossary', titleKey: 'app.nav.glossary', pageType: 'Glossar' },
  { route: '/ai-timeline', titleKey: 'app.nav.aiTimeline', pageType: 'Timeline' },
  { route: '/catalog', titleKey: 'app.nav.catalog', pageType: 'AI Tools' },
  { route: '/sources', titleKey: 'sources.title', pageType: 'Portal' },
];

/**
 * A single scheduled content drop on the combined weekly timeline — the
 * go-live launch baseline, a learning path or an interactive demo. Built from
 * LearningPathService + DemosService, interleaved chronologically by
 * publishDate (RELEASE-PLAN.MD). Each drop carries its constituent `children`
 * which render as a grid of visual sub-tiles.
 */
interface TimelineDrop {
  kind: 'golive' | 'path' | 'demo' | 'mystery';
  id: string;
  titleKey: string;
  icon: string;
  publishDate: string;
  link: string;
  queryParams: Record<string, string> | null;
  fragment?: string;
  difficulty: string;
  steps?: number;
  estimatedTime?: string;
  children: DropChild[];
  /** Bonus-stream reveal flag (demos only). `false` ⇒ force-named flagship; else collapses into the Mystery-Box. */
  mystery?: boolean;
  /** Marks the single named "next bonus" preview demo (gets a "Nächste Demo" tag, not "Nächster Release"). */
  bonusPreview?: boolean;
}

/** Language review status from static JSON */
interface LanguageReviewEntry {
  code: string;
  status: 'reference' | 'complete' | 'in_progress' | 'pending';
  progress: number;
}

interface LanguageReviewData {
  lastUpdated: string;
  languages: LanguageReviewEntry[];
}

/** Language priority for display order (LANGUAGE-FIX.MD §10: DACH-Diaspora > Global Reach > Tech/AI) */
const LANG_PRIORITY: Record<string, number> = {
  de: 0,
  en: 0, // Reference
  ru: 1,
  uk: 2,
  bn: 3, // Already reviewed (early)
  el: 4,
  cs: 5,
  da: 6, // Already reviewed (later)
  'pt-br': 7,
  it: 8,
  fr: 9,
  tr: 10,
  pl: 11,
  hi: 12, // Top priority
  mr: 13,
  pa: 14,
  es: 15,
  ko: 16,
  hr: 17,
  nl: 18, // Tier 2-3
  ro: 19,
  vi: 20,
  id: 21,
  ms: 22,
  sv: 23,
  no: 24, // Tier 3-4
  sw: 25,
  tl: 26, // Supplementary
};

/** Script mapping for display */
const LANG_SCRIPT: Record<string, string> = {
  de: 'latin',
  en: 'latin',
  tr: 'latin',
  bn: 'bengali',
  ru: 'cyrillic',
  uk: 'cyrillic',
  pl: 'latin',
  el: 'greek',
  hi: 'devanagari',
  mr: 'devanagari',
  pa: 'gurmukhi',
  es: 'latin',
  fr: 'latin',
  ko: 'hangul',
  hr: 'latin',
  it: 'latin',
  nl: 'latin',
  'pt-br': 'latin',
  ro: 'latin',
  cs: 'latin',
  vi: 'latin',
  id: 'latin',
  ms: 'latin',
  sv: 'latin',
  da: 'latin',
  no: 'latin',
  sw: 'latin',
  tl: 'latin',
};

@Component({
  selector: 'app-roadmap',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    TagModule,
    TableOfContentsFabComponent,
    FabStackComponent,
    PageHeaderComponent,
    SimpleEasyLanguageFabComponent,
    ThumbnailComponent,
    CursorGlowDirective,
  ],
  template: `
    <section class="roadmap-page">
      <app-page-header titleKey="roadmap.hero.title" subtitleKey="roadmap.hero.description"></app-page-header>

      <!-- Cross-link to /news (chronological news feed lives there now) -->
      @if (newsOn) {
        <a class="updates-cross-link" routerLink="/news">
          <i class="pi pi-megaphone" aria-hidden="true"></i>
          <span>{{ t('notifications.bell.viewAll') }}</span>
          <i class="pi pi-arrow-right" aria-hidden="true"></i>
        </a>
      }

      <!-- Section 1: Learning Path Timeline (formerly §2 in the V1 layout) -->
      <section class="roadmap-section roadmap-section-paths" id="timeline">
        <div class="section-header">
          <div class="section-icon"><i class="pi pi-calendar"></i></div>
          <div>
            <h2>{{ t('roadmap.timeline.title') }}</h2>
            <p class="section-description">{{ t('roadmap.timeline.description') }}</p>
          </div>
        </div>

        <!-- Progress Summary -->
        <div class="progress-summary" appCursorGlow [style.--cursor-glow-color]="'var(--semantic-green-fg)'">
          <div class="progress-stats">
            <div class="progress-number">
              <span class="big-number">{{ releasedCount() }}</span>
              <span class="total-number">/ {{ totalCount() }}</span>
            </div>
            <div class="progress-label">{{ progressLabel() }}</div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" [style.width.%]="progressPercent()"></div>
            </div>
            <div class="progress-phases">
              <div class="phase-segment">
                <span class="phase-dot type-path"></span>
                <span>{{ t('roadmap.timeline.paths') }}</span>
              </div>
              <div class="phase-segment">
                <span class="phase-dot type-demo"></span>
                <span>{{ t('lernbereich.filterDemos') }}</span>
              </div>
              <div class="phase-segment cadence-note">
                <i class="pi pi-calendar" aria-hidden="true"></i>
                <span>{{ t('roadmap.timeline.phaseSprint') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Combined chronological drop timeline — Go-Live-Block + Lernpfade + Demos im wöchentlichen Wechsel (RELEASE-PLAN.MD §3) -->
        <div class="drop-timeline" #timeline>
          @for (drop of scheduledDrops(); track drop.kind + '-' + drop.id) {
            @if (drop.kind === 'mystery') {
              <article
                class="path-card drop-card kind-mystery"
                appCursorGlow
                [style.--cursor-glow-color]="'var(--p-purple-500)'"
              >
                <div class="path-status-indicator" style="background:var(--p-purple-500)"></div>
                <div class="path-content">
                  <div class="path-header">
                    <span class="path-name">
                      <i [class]="drop.icon"></i>
                      {{ t('roadmap.mystery.title') }}
                    </span>
                    <p-tag severity="secondary" [value]="t('roadmap.timeline.planned')" />
                  </div>
                  <div class="path-meta">
                    <span class="meta-item date-text">
                      <i class="pi pi-calendar" aria-hidden="true"></i>
                      {{ formatDate(drop.publishDate) }}
                    </span>
                  </div>
                  <div class="mystery-body">
                    <div class="mystery-thumb" aria-hidden="true">
                      <span class="mq mq1">?</span>
                      <span class="mq mq2">?</span>
                      <span class="mq mq3">?</span>
                      <span class="mq mq4">?</span>
                      <span class="mq mq5">?</span>
                      <span class="mq mq6">?</span>
                      <i class="pi pi-gift"></i>
                    </div>
                    <p class="mystery-text">{{ t('roadmap.mystery.description') }}</p>
                  </div>
                </div>
              </article>
            } @else {
              <article
                class="path-card drop-card"
                [class.released]="published(drop.publishDate)"
                [class.next-release]="isNextDrop(drop)"
                [class.kind-demo]="drop.kind === 'demo'"
                [class.kind-golive]="drop.kind === 'golive'"
                appCursorGlow
                [style.--cursor-glow-color]="dropColor(drop)"
              >
                <div class="path-status-indicator" [style.background-color]="dropColor(drop)"></div>
                <div class="path-content">
                  <div class="path-header">
                    @if (drop.kind === 'golive') {
                      <span class="path-name">
                        <i [class]="drop.icon"></i>
                        Go Live
                      </span>
                    } @else if (published(drop.publishDate)) {
                      <a
                        class="path-name path-name-link"
                        [routerLink]="drop.link"
                        [queryParams]="drop.queryParams"
                        [fragment]="drop.fragment"
                      >
                        <i [class]="drop.icon"></i>
                        {{ t(drop.titleKey) }}
                      </a>
                    } @else {
                      <span class="path-name">
                        <i [class]="drop.icon"></i>
                        {{ t(drop.titleKey) }}
                      </span>
                    }
                    @if (published(drop.publishDate)) {
                      <p-tag severity="success" [value]="t('roadmap.timeline.released')" icon="pi pi-check" />
                    } @else if (isDevPlaceholder(drop.publishDate)) {
                      <p-tag severity="danger" value="DEV" icon="pi pi-wrench" />
                    } @else if (isNextDrop(drop)) {
                      <p-tag severity="warn" [value]="t('roadmap.timeline.upcoming')" icon="pi pi-clock" />
                    } @else {
                      <p-tag severity="secondary" [value]="t('roadmap.timeline.planned')" />
                    }
                  </div>
                  <div class="path-meta">
                    @if (drop.kind === 'golive') {
                      <span class="meta-item type-chip">{{ t('roadmap.hero.title') }}</span>
                      <span class="meta-item">
                        <i class="pi pi-book"></i>
                        {{ launchPathCount() }} {{ t('roadmap.timeline.paths') }}
                      </span>
                      <span class="meta-item">
                        <i class="pi pi-bolt"></i>
                        {{ launchDemoCount() }} {{ t('lernbereich.filterDemos') }}
                      </span>
                    } @else {
                      <span class="meta-item type-chip" [class.type-demo]="drop.kind === 'demo'">
                        {{ drop.kind === 'demo' ? t('lernbereich.filterDemos') : t('roadmap.timeline.paths') }}
                      </span>
                      @if (drop.kind === 'path') {
                        <span class="meta-item">
                          <i class="pi pi-book"></i>
                          {{ drop.steps }} {{ t('roadmap.timeline.articles') }}
                        </span>
                      } @else {
                        <span class="meta-item">
                          <i class="pi pi-clock"></i>
                          {{ drop.estimatedTime }}
                        </span>
                      }
                      <span class="meta-item">
                        <i class="pi pi-gauge"></i>
                        {{ t('roadmap.timeline.difficulty.' + drop.difficulty) }}
                      </span>
                    }
                    @if (isDevPlaceholder(drop.publishDate)) {
                      <span class="meta-item date-text">
                        <i class="pi pi-wrench" aria-hidden="true"></i>
                        dev-only
                      </span>
                    } @else {
                      <span class="meta-item date-text">
                        <i class="pi pi-calendar" aria-hidden="true"></i>
                        {{ formatDate(drop.publishDate) }}
                      </span>
                    }
                  </div>

                  <!-- Visual sub-tiles: each constituent article / demo / section.
                     Released → clickable link, locked → dimmed, no link.
                     Large groups collapse to a teased first row (toggle below). -->
                  <div class="child-grid-wrap" [class.collapsed]="isCollapsible(drop) && !isExpanded(drop.id)">
                    <div class="child-grid">
                      @for (child of drop.children; track child.route) {
                        @if (child.published) {
                          <a class="child-tile" [routerLink]="child.route">
                            <app-thumbnail [path]="child.route" [pageType]="child.pageType" />
                            <span class="child-title">{{ t(child.titleKey) }}</span>
                          </a>
                        } @else {
                          <div class="child-tile locked" aria-disabled="true">
                            <app-thumbnail [path]="child.route" [pageType]="child.pageType" />
                            <span class="child-title">{{ t(child.titleKey) }}</span>
                            <i class="pi pi-lock child-lock" aria-hidden="true"></i>
                          </div>
                        }
                      }
                    </div>
                  </div>
                  @if (isCollapsible(drop)) {
                    <div class="grid-toggle-row">
                      <button
                        type="button"
                        class="grid-toggle"
                        (click)="toggleExpanded(drop.id)"
                        [attr.aria-expanded]="isExpanded(drop.id)"
                      >
                        @if (isExpanded(drop.id)) {
                          <i class="pi pi-chevron-up" aria-hidden="true"></i>
                          <span>{{ t('common.showLess') }}</span>
                        } @else {
                          <i class="pi pi-chevron-down" aria-hidden="true"></i>
                          <span>{{ showMoreLabel(hiddenCount(drop)) }}</span>
                        }
                      </button>
                    </div>
                  }
                </div>
              </article>
            }
          }
        </div>
      </section>

      <!-- Section 2: Language Review Status (formerly §3 in the V1 layout) -->
      <section class="roadmap-section roadmap-section-langs" id="languages">
        <div class="section-header">
          <div class="section-icon"><i class="pi pi-globe"></i></div>
          <div>
            <h2>{{ t('roadmap.languages.title') }}</h2>
            <p class="section-description">{{ t('roadmap.languages.description') }}</p>
          </div>
        </div>
        @if (languageReview()) {
          <div class="language-grid">
            @for (lang of allLanguagesSorted(); track lang.code) {
              <div
                class="language-card"
                [class.reference]="lang.status === 'reference'"
                [class.complete]="lang.status === 'complete'"
                [class.in-progress]="lang.status === 'in_progress' && lang.progress >= 10"
                appCursorGlow
                [style.--cursor-glow-color]="getLanguageGlowColor(lang)"
              >
                <div class="lang-flag">
                  @if (flagUrl(lang.code); as src) {
                    <img class="flag" [src]="src" width="42" height="28" alt="" aria-hidden="true" />
                  } @else {
                    <span class="flag lang-badge" aria-hidden="true">{{ lang.code.toUpperCase() }}</span>
                  }
                </div>
                <div class="lang-info">
                  <div class="lang-name">{{ t('roadmap.languages.languageNames.' + lang.code) }}</div>
                  <div class="lang-script">{{ t('roadmap.languages.scripts.' + getScript(lang.code)) }}</div>
                </div>
                <div class="lang-status">
                  @if (lang.status === 'reference') {
                    <span class="status-badge reference"
                      ><i class="pi pi-star-fill"></i> {{ t('roadmap.languages.statusReference') }}</span
                    >
                  } @else if (lang.status === 'complete') {
                    <span class="status-badge complete"
                      ><i class="pi pi-check-circle"></i> {{ t('roadmap.languages.statusComplete') }}</span
                    >
                  } @else if (lang.status === 'in_progress' && lang.progress >= 10) {
                    <span class="status-badge in-progress"><i class="pi pi-sync"></i> {{ lang.progress }}%</span>
                  } @else {
                    <span class="status-badge pending"
                      ><i class="pi pi-clock"></i> {{ t('roadmap.languages.statusPending') }}</span
                    >
                  }
                </div>
              </div>
            }
          </div>
        }
      </section>

      <!-- FAB Stack -->
      <app-fab-stack>
        <app-table-of-contents-fab [items]="tocItems()" [title]="t('roadmap.hero.title')"> </app-table-of-contents-fab>
        <app-simple-easy-language-fab contentId="roadmap" contentType="article"> </app-simple-easy-language-fab>
      </app-fab-stack>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-roadmap {
        display: block;
      }

      .roadmap-page {
        max-width: 1080px;
        margin: 0 auto;
        padding: 0 1.25rem 5rem;
      }

      /* ─── Sections ──────────────────────────────────────────────── */
      .roadmap-section {
        margin-bottom: 3rem;
        background: var(--surface-card);
        border-radius: 20px;
        padding: 2.25rem 2rem;
        border: 1px solid var(--surface-border);
      }

      .section-header {
        display: flex;
        align-items: flex-start;
        gap: 1.125rem;
        margin-bottom: 1.75rem;
      }

      .section-icon {
        width: 52px;
        height: 52px;
        border-radius: 14px;
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--primary-color) 18%, transparent),
          color-mix(in srgb, var(--primary-color) 6%, transparent)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 14%, transparent);
      }

      .section-icon i {
        font-size: 1.5rem;
        color: var(--primary-color-fg);
      }

      .roadmap-section h2 {
        font-size: 1.625rem;
        font-weight: 800;
        color: var(--text-color);
        margin: 0 0 0.35rem;
        letter-spacing: -0.025em;
        line-height: 1.15;
      }

      .section-description {
        color: var(--text-color-secondary);
        margin: 0;
        line-height: 1.6;
        font-size: 1rem;
      }

      /* ─── Progress Summary (Hero Metric) ────────────────────────── */
      .progress-summary {
        display: flex;
        align-items: center;
        gap: 2rem;
        background: var(--surface-50, var(--surface-card));
        border: 1px solid var(--surface-border);
        border-radius: 16px;
        padding: 1.75rem 2rem;
        margin-bottom: 2rem;
        position: relative;
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease;
      }

      .progress-summary:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px -10px rgba(0, 0, 0, 0.1);
      }

      .progress-stats {
        flex-shrink: 0;
      }

      .progress-number {
        display: flex;
        align-items: baseline;
        gap: 4px;
      }

      .big-number {
        font-size: 3.5rem;
        font-weight: 800;
        color: var(--semantic-green-fg);
        line-height: 1;
        letter-spacing: -0.04em;
        font-variant-numeric: tabular-nums;
        background: linear-gradient(135deg, var(--semantic-green-fg) 0%, var(--p-teal-500) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .total-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--text-color-secondary);
        letter-spacing: -0.02em;
      }

      .progress-label {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        margin-top: 6px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 700;
      }

      .progress-bar-container {
        flex: 1;
        min-width: 0;
      }

      .progress-bar-track {
        height: 14px;
        background: var(--surface-100);
        border-radius: 999px;
        overflow: hidden;
        margin-bottom: 1rem;
        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
      }

      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--semantic-green-fg) 0%, var(--p-teal-500) 100%);
        border-radius: 999px;
        transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 16px color-mix(in srgb, var(--semantic-green-fg) 50%, transparent);
      }

      .progress-phases {
        display: flex;
        gap: 1.5rem;
        font-size: 0.8125rem;
        color: var(--text-color-secondary);
        flex-wrap: wrap;
        font-weight: 500;
      }

      .phase-segment {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .phase-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 8%, transparent);
      }

      .phase-dot.launched {
        background: var(--semantic-green-fg);
        box-shadow: 0 0 8px color-mix(in srgb, var(--semantic-green-fg) 60%, transparent);
      }
      .phase-dot.biweekly {
        background: var(--p-teal-500);
        box-shadow: 0 0 8px color-mix(in srgb, var(--p-teal-500) 60%, transparent);
      }
      .phase-dot.sprint {
        background: var(--semantic-blue-fg);
        box-shadow: 0 0 8px color-mix(in srgb, var(--semantic-blue-fg) 60%, transparent);
      }

      /* Type legend dots (combined timeline): paths blue, demos teal */
      .phase-dot.type-path {
        background: var(--semantic-blue-fg);
        box-shadow: 0 0 8px color-mix(in srgb, var(--semantic-blue-fg) 60%, transparent);
      }
      .phase-dot.type-demo {
        background: var(--p-teal-500);
        box-shadow: 0 0 8px color-mix(in srgb, var(--p-teal-500) 60%, transparent);
      }
      .cadence-note {
        font-weight: 700;
        color: var(--text-color);
      }
      .cadence-note i {
        font-size: 0.85rem;
        opacity: 0.8;
      }

      /* ─── Combined Drop Timeline ────────────────────────────────── */
      .drop-timeline {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
      }

      .path-card.drop-card.kind-demo {
        border-left: 3px solid color-mix(in srgb, var(--p-teal-500) 55%, var(--surface-border));
      }

      /* ─── Visual sub-tile grid (children of a drop card) ─────────── */
      .child-grid-wrap {
        margin-top: 1.1rem;
      }

      /* Collapsed: tease the top of the first row, fade out the rest. The mask
       fades over the card background regardless of its color (works on the
       gradient Go-Live card too). */
      .child-grid-wrap.collapsed {
        max-height: 172px;
        overflow: hidden;
        -webkit-mask-image: linear-gradient(to bottom, #000 52%, transparent 100%);
        mask-image: linear-gradient(to bottom, #000 52%, transparent 100%);
      }

      .child-grid {
        display: grid;
        /* min(150px, 100%) guarantees a column never exceeds the container —
         no horizontal overflow even in very narrow / nested layouts. */
        grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
        gap: 0.75rem;
        align-items: start;
      }

      /* ─── Expand / collapse toggle ──────────────────────────────── */
      .grid-toggle-row {
        text-align: center;
        margin-top: 0.7rem;
      }

      .grid-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.4rem 1rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 999px;
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.82rem;
        cursor: pointer;
        transition:
          background 0.2s ease,
          border-color 0.2s ease;
      }

      .grid-toggle:hover {
        background: var(--surface-hover);
        border-color: var(--primary-color);
      }

      .grid-toggle:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .grid-toggle i {
        font-size: 0.75rem;
      }

      .child-tile {
        display: flex;
        flex-direction: column;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 11px;
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        position: relative;
        transition:
          box-shadow 0.2s ease,
          border-color 0.2s ease;
      }

      a.child-tile:hover {
        border-color: var(--primary-color);
        box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.2);
      }

      a.child-tile:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .child-tile app-thumbnail {
        display: block;
        width: 100%;
      }

      .child-title {
        font-size: 0.78rem;
        font-weight: 600;
        line-height: 1.25;
        padding: 0.5rem 0.6rem 0.6rem;
        color: var(--text-color);
      }

      .child-tile.locked {
        opacity: 0.5;
        cursor: default;
      }

      .child-lock {
        position: absolute;
        top: 0.45rem;
        right: 0.45rem;
        font-size: 0.7rem;
        color: var(--text-color);
        background: var(--surface-card);
        border-radius: 999px;
        padding: 0.3rem;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
      }

      .type-chip {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.12rem 0.55rem;
        border-radius: 999px;
        color: var(--p-blue-700);
        background: color-mix(in srgb, var(--semantic-blue-fg) 12%, transparent);
      }

      .type-chip.type-demo {
        color: var(--p-teal-700);
        background: color-mix(in srgb, var(--p-teal-500) 14%, transparent);
      }

      .dark-theme app-roadmap .type-chip {
        color: var(--p-blue-300);
        background: color-mix(in srgb, var(--semantic-blue-fg) 20%, transparent);
      }
      .dark-theme app-roadmap .type-chip.type-demo {
        color: var(--p-teal-300);
        background: color-mix(in srgb, var(--p-teal-500) 22%, transparent);
      }

      /* ─── Sector Groups ─────────────────────────────────────────── */
      .sector-group {
        margin-bottom: 2rem;
      }

      .sector-group:last-child {
        margin-bottom: 0;
      }

      .sector-title {
        font-size: 0.8125rem;
        font-weight: 700;
        color: var(--text-color-secondary);
        border-left: 4px solid;
        padding: 0.25rem 0 0.25rem 1rem;
        margin: 0 0 1rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      /* ─── Path Cards ────────────────────────────────────────────── */
      .path-timeline {
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        margin-left: 0;
      }

      .path-card {
        display: flex;
        align-items: stretch;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 14px;
        overflow: hidden;
        transition:
          box-shadow 0.25s ease,
          border-color 0.25s ease;
        color: inherit;
      }

      .path-card.released {
        opacity: 1;
      }

      .path-card.next-release {
        border-color: color-mix(in srgb, var(--p-orange-400) 80%, transparent);
        box-shadow:
          0 0 0 1px var(--p-orange-400),
          0 4px 12px -4px color-mix(in srgb, var(--p-orange-400) 35%, transparent);
      }

      .path-card:not(.released):not(.next-release) {
        opacity: 0.6;
      }

      /* ─── Go-Live launch card (amber accent, slightly elevated) ─── */
      .path-card.kind-golive {
        border-color: color-mix(in srgb, var(--primary-color) 45%, var(--surface-border));
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--primary-color) 7%, var(--surface-card)) 0%,
          var(--surface-card) 55%
        );
      }

      .path-card.kind-golive .path-name i {
        color: var(--primary-color);
      }

      /* ─── Mystery-Box card (the "übernächste" bonus, kept a surprise) ─ */
      .path-card.drop-card.kind-mystery {
        opacity: 1;
        position: relative;
        overflow: hidden;
        border: 1.5px dashed color-mix(in srgb, var(--p-purple-500) 55%, var(--surface-border));
        border-left: 4px solid var(--p-purple-500);
        background:
          radial-gradient(
            135% 130% at 100% 0%,
            color-mix(in srgb, var(--p-purple-500) 18%, transparent) 0%,
            transparent 55%
          ),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--p-purple-500) 10%, var(--surface-card)) 0%,
            var(--surface-card) 62%
          );
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--p-purple-500) 10%, transparent);
      }

      .path-card.drop-card.kind-mystery .path-content {
        position: relative;
        z-index: 1;
      }

      .path-card.drop-card.kind-mystery .path-name {
        color: var(--p-purple-700);
      }
      .dark-theme app-roadmap .path-card.drop-card.kind-mystery .path-name {
        color: var(--p-purple-200);
      }

      .path-card.drop-card.kind-mystery .path-name i {
        color: var(--p-purple-500);
        font-size: 1.3rem;
      }

      /* Mystery "content" thumbnail — always shown, generic surprise cover (3:2 like app-thumbnail). */
      .mystery-body {
        display: flex;
        gap: 1.1rem;
        align-items: center;
        margin-top: 0.5rem;
      }

      .mystery-thumb {
        flex: 0 0 190px;
        aspect-ratio: 3 / 2;
        border-radius: 11px;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--p-purple-500) 10%, var(--surface-card));
        border: 1px solid var(--surface-border);
      }
      .dark-theme app-roadmap .mystery-thumb {
        background: color-mix(in srgb, var(--p-purple-500) 18%, var(--surface-card));
      }

      /* Gift icon carries the gradient (clipped to the glyph via ::before). */
      .mystery-thumb i {
        position: relative;
        z-index: 1;
        font-size: 2.9rem;
        filter: drop-shadow(0 2px 5px color-mix(in srgb, var(--p-purple-700) 35%, transparent));
      }
      .mystery-thumb i::before {
        background: linear-gradient(135deg, var(--p-purple-400) 0%, var(--p-purple-700) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }

      /* Scattered, slightly tilted question marks in the background. */
      .mystery-thumb .mq {
        position: absolute;
        font-weight: 800;
        line-height: 1;
        color: color-mix(in srgb, var(--p-purple-500) 22%, transparent);
        user-select: none;
        pointer-events: none;
      }
      .mystery-thumb .mq1 {
        top: 8%;
        left: 9%;
        font-size: 1.5rem;
        transform: rotate(-18deg);
      }
      .mystery-thumb .mq2 {
        top: 11%;
        right: 11%;
        font-size: 2.3rem;
        transform: rotate(13deg);
      }
      .mystery-thumb .mq3 {
        bottom: 7%;
        left: 15%;
        font-size: 2rem;
        transform: rotate(9deg);
      }
      .mystery-thumb .mq4 {
        bottom: 13%;
        right: 9%;
        font-size: 1.4rem;
        transform: rotate(-15deg);
      }
      .mystery-thumb .mq5 {
        top: 45%;
        left: 6%;
        font-size: 1.1rem;
        transform: rotate(22deg);
      }
      .mystery-thumb .mq6 {
        top: 52%;
        right: 28%;
        font-size: 1.2rem;
        transform: rotate(-10deg);
      }

      .mystery-text {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.55;
        font-style: italic;
      }

      @media (max-width: 768px) {
        .mystery-body {
          flex-direction: column;
          align-items: stretch;
        }
        .mystery-thumb {
          flex: none;
          width: 100%;
        }
      }

      .type-chip.type-mystery {
        color: var(--p-purple-700);
        background: color-mix(in srgb, var(--p-purple-500) 14%, transparent);
      }

      .dark-theme app-roadmap .type-chip.type-mystery {
        color: var(--p-purple-300);
        background: color-mix(in srgb, var(--p-purple-500) 22%, transparent);
      }

      /* Title becomes the card's primary link (whole card is no longer an <a>) */
      a.path-name-link {
        text-decoration: none;
        color: inherit;
      }

      a.path-name-link:hover {
        color: var(--primary-color);
      }

      a.path-name-link:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 3px;
        border-radius: 4px;
      }

      .path-status-indicator {
        width: 6px;
        flex-shrink: 0;
      }

      .path-content {
        flex: 1;
        padding: 1rem 1.25rem;
      }

      .path-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }

      .path-name {
        font-weight: 700;
        color: var(--text-color);
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        gap: 0.625rem;
        letter-spacing: -0.01em;
      }

      .path-name i {
        font-size: 1rem;
        color: var(--primary-color-fg);
        width: 22px;
        text-align: center;
      }

      .path-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      .meta-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }

      .meta-item i {
        font-size: 0.85rem;
        opacity: 0.8;
      }

      .released-text {
        color: var(--p-green-600);
        font-weight: 600;
      }

      .date-text {
        color: var(--text-color-secondary);
        font-weight: 500;
      }

      /* ─── Language Cards ────────────────────────────────────────── */
      .language-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 0.875rem;
      }

      .language-card {
        display: flex;
        align-items: center;
        gap: 0.875rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 14px;
        padding: 0.875rem 1.125rem;
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease,
          border-color 0.25s ease;
      }

      .language-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.1);
      }

      .language-card.reference {
        border-color: color-mix(in srgb, var(--semantic-blue-fg) 35%, var(--surface-border));
        background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--semantic-blue-fg) 6%, var(--surface-card)) 0%,
          var(--surface-card) 60%
        );
      }

      .language-card.complete {
        border-color: color-mix(in srgb, var(--semantic-green-fg) 30%, var(--surface-border));
      }

      .language-card.in-progress {
        border-color: color-mix(in srgb, var(--semantic-orange-fg) 30%, var(--surface-border));
      }

      .lang-flag {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 42px;
      }

      .lang-flag .lang-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.8rem;
        color: var(--text-color);
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
      }

      .lang-flag .flag {
        display: inline-block;
        width: 42px;
        height: 28px;
        margin: 0;
        border-radius: 3px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      }

      .lang-info {
        flex: 1;
        min-width: 0;
      }

      .lang-name {
        font-weight: 700;
        color: var(--text-color);
        font-size: 0.9375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        letter-spacing: -0.005em;
      }

      .lang-script {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
      }

      .lang-status {
        flex-shrink: 0;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.75rem;
        font-weight: 700;
        white-space: nowrap;
        padding: 0.3rem 0.65rem;
        border-radius: 999px;
        letter-spacing: 0.01em;
      }

      .status-badge i {
        font-size: 0.7rem;
      }

      /* WCAG 1.4.3: filled pills with strong contrast */
      .status-badge.reference {
        color: var(--p-blue-700);
        background: color-mix(in srgb, var(--semantic-blue-fg) 12%, transparent);
      }
      .status-badge.complete {
        color: var(--p-green-700);
        background: color-mix(in srgb, var(--semantic-green-fg) 12%, transparent);
      }
      .status-badge.in-progress {
        color: var(--p-orange-700);
        background: color-mix(in srgb, var(--semantic-orange-fg) 12%, transparent);
      }
      .status-badge.pending {
        color: var(--text-color-secondary);
        background: var(--surface-100);
      }

      .dark-theme app-roadmap .status-badge.reference {
        color: var(--p-blue-300);
        background: color-mix(in srgb, var(--semantic-blue-fg) 18%, transparent);
      }
      .dark-theme app-roadmap .status-badge.complete {
        color: var(--p-green-300);
        background: color-mix(in srgb, var(--semantic-green-fg) 18%, transparent);
      }
      .dark-theme app-roadmap .status-badge.in-progress {
        color: var(--p-orange-300);
        background: color-mix(in srgb, var(--semantic-orange-fg) 18%, transparent);
      }

      /* ─── Updates Cross-Link Banner ─────────────────────────────── */
      .updates-cross-link {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        margin: 0.5rem 0 2rem;
        padding: 0.7rem 1.1rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 999px;
        color: var(--primary-color-fg);
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .updates-cross-link:hover {
        background: var(--surface-hover);
        border-color: var(--primary-color-fg);
        transform: translateY(-1px);
      }

      .updates-cross-link:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .updates-cross-link i {
        font-size: 1rem;
      }

      /* ─── Responsive ────────────────────────────────────────────── */
      @media (max-width: 768px) {
        .roadmap-page {
          padding: 1.5rem 1rem 4rem;
        }

        .roadmap-section {
          padding: 1.5rem 1.25rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .section-header {
          gap: 0.875rem;
          margin-bottom: 1.25rem;
        }

        .section-icon {
          width: 44px;
          height: 44px;
        }

        .section-icon i {
          font-size: 1.25rem;
        }

        .roadmap-section h2 {
          font-size: 1.35rem;
        }

        .progress-summary {
          flex-direction: column;
          text-align: center;
          gap: 1.25rem;
          padding: 1.5rem 1.25rem;
        }

        .progress-number {
          justify-content: center;
        }
        .big-number {
          font-size: 3rem;
        }

        .progress-phases {
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.875rem;
        }

        .progress-bar-container {
          width: 100%;
        }

        .path-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .language-grid {
          grid-template-columns: 1fr;
        }

        /* Denser sub-tiles on phones (2 cols where width allows) + tighter gap. */
        .child-grid {
          grid-template-columns: repeat(auto-fill, minmax(min(130px, 100%), 1fr));
          gap: 0.5rem;
        }
        .child-grid-wrap.collapsed {
          max-height: 156px;
        }
        .child-title {
          font-size: 0.74rem;
          padding: 0.4rem 0.5rem 0.5rem;
        }
      }

      /* ─── Reduced motion ───────────────────────────────────────── */
      @media (prefers-reduced-motion: reduce) {
        .path-card,
        .child-tile,
        .language-card,
        .progress-summary,
        .progress-bar-fill {
          transition: none !important;
        }
        .language-card:hover,
        .progress-summary:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class RoadmapComponent implements OnInit, AfterViewInit, OnDestroy {
  private translationService = inject(TranslationService);
  private learningPathService = inject(LearningPathService);
  private demosService = inject(DemosService);
  private timeGateService = inject(TimeGateService);
  private devMode = inject(DevModeService);
  private http = inject(HttpClient);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private destroyRef = inject(DestroyRef);
  private site = inject(SITE_CONFIG);
  /** Feature switches (site.json): no link to /news, no path drops without learn, no demos without demos. */
  readonly newsOn = this.site.isRouteOn('news');
  private readonly learnOn = this.site.isRouteOn('learn');
  private readonly demosOn = this.site.isFeatureOn('demos');

  @ViewChild('timeline') private timelineRef?: ElementRef<HTMLElement>;
  private gridObserver?: ResizeObserver;

  // Data signals
  paths = signal<LearningPathDefinition[]>([]);
  demos = signal<DemoMeta[]>([]);
  languageReview = signal<LanguageReviewData | null>(null);

  /**
   * Combined chronological release timeline: learning paths and interactive
   * demos that carry a publishDate, interleaved and sorted ascending by date.
   * Mirrors the weekly cadence in RELEASE-PLAN.MD (one drop per Wednesday).
   */
  /** Drop duplicate routes (first wins) — a demo can appear both as a path
   *  step and as a standalone demo, which would otherwise collide in @for track. */
  private dedupeByRoute(children: DropChild[]): DropChild[] {
    const seen = new Set<string>();
    return children.filter((c) => (seen.has(c.route) ? false : (seen.add(c.route), true)));
  }

  /** Demo metadata keyed by canonical route ('/' + path) for step→demo lookup. */
  private demoByRoute = computed<Map<string, DemoMeta>>(() => {
    const m = new Map<string, DemoMeta>();
    for (const d of this.demos()) m.set('/' + d.path, d);
    return m;
  });

  /**
   * Whether the demo behind a step route has reached its OWN publishDate.
   * Undated (go-live) demos and unknown / non-demo routes count as released.
   */
  private isDemoRouteReleased(route: string): boolean {
    const demo = this.demoByRoute().get(route);
    if (!demo) return true; // non-demo / unknown route — not gated here
    if (!demo.publishDate) return true; // undated = shipped at go-live
    return this.published(demo.publishDate);
  }

  /**
   * Map a learning-path's steps to roadmap sub-tiles, applying the demo/article
   * release split (the rule book-referenced demos depend on):
   *   • Demos are gated by their OWN publishDate — a demo referenced from the
   *     book may go live independently of its learning path. A not-yet-released
   *     demo step is therefore hidden ENTIRELY in (simulate-)prod, never leaking
   *     its title or route onto the roadmap. Mirrors
   *     LearningPathsOverview.visibleSteps; dev shows everything for authoring.
   *   • Articles unlock WITH the path, so they inherit the path's live state.
   */
  private pathStepChildren(steps: LearningPathDefinition['steps'], pathLive: boolean): DropChild[] {
    const effProd = this.devMode.isEffectivelyProd();
    return steps
      .filter((s) => !(s.type === 'demo' && !this.demosOn)) // demos switched off (site.json)
      .filter((s) => !(effProd && s.type === 'demo' && !this.isDemoRouteReleased(s.route)))
      .map((s) => ({
        route: s.route,
        titleKey: s.titleKey,
        pageType: s.type === 'demo' ? 'Demo' : 'Artikel',
        published: s.type === 'demo' ? this.isDemoRouteReleased(s.route) : pathLive,
      }));
  }

  private allDrops = computed<TimelineDrop[]>(() => {
    // ── Go-Live baseline: everything that shipped on day one (undated paths'
    // articles + undated demos + the always-available hub sections), folded
    // into one aggregate card. Its sub-tiles are all live → all clickable.
    const goLiveChildren: DropChild[] = [];
    for (const p of this.paths()) {
      if (p.publishDate) continue; // dated paths are drip, below
      // pathLive = true: a go-live path's articles are all live. Demo steps are
      // still gated by their own date (a future demo added to a day-one path
      // must not leak), so route through the shared splitter.
      goLiveChildren.push(...this.pathStepChildren(p.steps, true));
    }
    for (const d of this.demos()) {
      if (d.publishDate) continue; // dated demos are drip, below
      goLiveChildren.push({ route: '/' + d.path, titleKey: d.titleKey, pageType: 'Demo', published: true });
    }
    // A section of a feature site.json switches off is not shown (src/config/features.json).
    for (const sec of GO_LIVE_SECTIONS.filter((s) => this.site.isRouteOn(s.route))) {
      goLiveChildren.push({ ...sec, published: true });
    }
    const goLive: TimelineDrop = {
      kind: 'golive',
      id: 'go-live',
      titleKey: '',
      icon: 'pi pi-flag-fill',
      publishDate: GO_LIVE_DATE,
      difficulty: '',
      link: '/learn',
      queryParams: null,
      children: this.dedupeByRoute(goLiveChildren),
    };

    // ── Weekly drip: only DATED paths + demos, interleaved chronologically.
    // (Undated content was absorbed into the Go-Live card above.) Dev-only
    // 2099 placeholders are dropped when effectively prod — that tracks the
    // DevModeService "simulate prod" toggle (reactive), so flipping it to PROD
    // hides them live; in dev they show with a DEV badge. Unlike drafts (which
    // use build-time isDevMode so a stray toggle can't hide real content),
    // these throwaway placeholders are *meant* to follow the toggle.
    const effectivelyProd = this.devMode.isEffectivelyProd();
    const drip: TimelineDrop[] = [];
    for (const p of this.paths()) {
      if (!p.publishDate) continue;
      if (this.isDevPlaceholder(p.publishDate) && effectivelyProd) continue;
      const live = this.published(p.publishDate);
      drip.push({
        kind: 'path',
        id: p.id,
        titleKey: p.titleKey,
        icon: p.icon,
        publishDate: p.publishDate,
        difficulty: p.difficulty,
        steps: p.steps.length,
        link: '/learn',
        queryParams: { view: 'paths' },
        fragment: p.id,
        children: this.dedupeByRoute(this.pathStepChildren(p.steps, live)),
      });
    }
    for (const d of this.demos()) {
      if (!d.publishDate) continue;
      if (this.isDevPlaceholder(d.publishDate) && effectivelyProd) continue;
      const live = this.published(d.publishDate);
      drip.push({
        kind: 'demo',
        id: d.id,
        titleKey: d.titleKey,
        icon: d.icon,
        publishDate: d.publishDate,
        difficulty: d.difficulty,
        estimatedTime: d.estimatedTime,
        link: '/' + d.path,
        queryParams: null,
        mystery: d.mystery,
        children: [{ route: '/' + d.path, titleKey: d.titleKey, pageType: 'Demo', published: live }],
      });
    }
    drip.sort((a, b) => a.publishDate.localeCompare(b.publishDate));
    return [goLive, ...drip];
  });

  /**
   * Display timeline: paths AND demos stay interleaved chronologically (the
   * "verschränkte Wochen-Timeline") — UP TO & INCLUDING the last learning path.
   * AFTER the last learning path, only published items + AT MOST ONE upcoming
   * (not-yet-published) item are shown by name; everything beyond is folded into
   * a SINGLE Mystery-Box — shown ONLY when such hidden content exists, carrying
   * the NEXT hidden item's date (+ a "Geplant" badge in the template, like every
   * other planned item). Dev-only 2099 placeholders sink to the very end (dev preview).
   */
  scheduledDrops = computed<TimelineDrop[]>(() => {
    const all = this.allDrops();
    const real = all.filter((d) => !this.isDevPlaceholder(d.publishDate)); // chronological, goLive first
    const devOnly = all.filter((d) => this.isDevPlaceholder(d.publishDate));

    // Dev mode (DevModeService "simulate prod" toggle OFF) shows the FULL planned
    // timeline by name — the Mystery-Box spoiler-fold is a PROD-only affordance.
    // Flipping the toggle to PROD restores the folded box (reactive recompute).
    if (!this.devMode.isEffectivelyProd()) {
      return [...real, ...devOnly];
    }

    // Boundary = the last learning path by date. Up to & incl. it the timeline is
    // fully chronological (demos interleaved between paths). After it: keep any
    // already-released item + the FIRST upcoming one; fold the rest into the box.
    const lastPathDate = real
      .filter((d) => d.kind === 'path')
      .reduce((max, d) => (d.publishDate > max ? d.publishDate : max), '');

    const head: TimelineDrop[] = [];
    const after: TimelineDrop[] = [];
    for (const d of real) {
      if (!lastPathDate || d.publishDate <= lastPathDate) head.push(d);
      else after.push(d);
    }

    const tail: TimelineDrop[] = [];
    const folded: TimelineDrop[] = [];
    let upcomingShown = false;
    for (const d of after) {
      if (this.published(d.publishDate))
        tail.push(d); // already live → keep named
      else if (!upcomingShown) {
        tail.push(d);
        upcomingShown = true;
      } // first upcoming → keep named
      else folded.push(d); // further upcoming → into the box
    }

    const result = [...head, ...tail];
    // Mystery-Box nur, wenn es verdeckten Content gibt; sie trägt das Datum des
    // NÄCHSTEN verdeckten Inhalts + (im Template) den „Geplant"-Badge wie alle anderen.
    if (folded.length > 0) {
      result.push({
        kind: 'mystery',
        id: 'mystery-box',
        titleKey: 'roadmap.mystery.title',
        icon: 'pi pi-gift',
        publishDate: folded[0].publishDate,
        link: '',
        queryParams: null,
        difficulty: '',
        children: [],
      });
    }

    return [...result, ...devOnly];
  });

  /** Dev-only placeholder content (publishDate in the 2099 sentinel year). */
  isDevPlaceholder(publishDate?: string): boolean {
    return !!publishDate && publishDate.slice(0, 4) >= DEV_PLACEHOLDER_YEAR;
  }

  /** Counts for the Go-Live card's meta row (launch baseline sizing). */
  launchPathCount = computed(() => this.paths().filter((p) => !p.publishDate).length);
  launchDemoCount = computed(() => this.demos().filter((d) => !d.publishDate).length);

  /**
   * Tiles visible in the first (teased) row = current column count of the
   * sub-tile grid. Measured live (ResizeObserver) so "+ N weitere" reflects
   * what's actually hidden at the current width, not the static total. All
   * grids share the timeline width, so one measurement applies to every card.
   */
  tilesPerRow = signal(6);

  /** Per-drop expand state for the sub-tile grid (collapsed → teaser + toggle). */
  private expandedDrops = signal<Set<string>>(new Set());

  /** A drop collapses only if it has more tiles than fit in one row. */
  isCollapsible(drop: TimelineDrop): boolean {
    return drop.children.length > this.tilesPerRow();
  }

  /** Tiles hidden below the teased first row — the "+ N weitere" number. */
  hiddenCount(drop: TimelineDrop): number {
    return Math.max(0, drop.children.length - this.tilesPerRow());
  }

  isExpanded(id: string): boolean {
    return this.expandedDrops().has(id);
  }

  toggleExpanded(id: string): void {
    const next = new Set(this.expandedDrops());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.expandedDrops.set(next);
  }

  /** Localized "+ N weitere" — reuses common.showMore (manual {{count}} fill,
   *  mirrors related-refs.component.ts). No new i18n key. */
  showMoreLabel(count: number): string {
    const t = this.translationService.translate('common.showMore');
    if (t === 'common.showMore') return `+ ${count} weitere`;
    return t.replace('{{count}}', String(count));
  }

  /** Earliest unreleased drop (path or demo) — that item gets the "Nächster Release" badge. */
  private nextDropDate = computed(() => {
    const next = this.allDrops().find((d) => !this.timeGateService.isPublished(d.publishDate));
    return next?.publishDate ?? null;
  });

  /**
   * Progress stats — across all scheduled content (paths + announced demos):
   * "9 / 28 Erweiterungen". scheduledDrops already holds all paths plus the
   * dated demos, so released = published drops, total = all drops.
   */
  // "Erweiterungen" = additions SINCE launch, so the Go-Live baseline card is
  // excluded from the counter — only the weekly drip counts toward progress.
  releasedCount = computed(
    () => this.allDrops().filter((d) => d.kind !== 'golive' && this.timeGateService.isPublished(d.publishDate)).length,
  );
  totalCount = computed(() => this.allDrops().filter((d) => d.kind !== 'golive').length);

  /**
   * Counter unit label. Uses the new "updates" key (→ "Erweiterungen") where
   * translated; falls back to the existing "paths" label in languages the
   * translation pipeline hasn't reached yet — so non-core langs never show a raw key.
   */
  progressLabel = computed(() => {
    const key = 'roadmap.timeline.updates';
    const val = this.t(key);
    return val === key ? this.t('roadmap.timeline.paths') : val;
  });
  progressPercent = computed(() => {
    const total = this.totalCount();
    return total > 0 ? Math.round((this.releasedCount() / total) * 100) : 0;
  });

  /** All languages sorted: completed first, then pending by priority (LANGUAGE-FIX.MD §10) */
  allLanguagesSorted = computed(() => {
    const review = this.languageReview();
    if (!review) return [];
    return [...review.languages].sort((a, b) => {
      const doneA = a.status === 'reference' || a.status === 'complete' ? 0 : 1;
      const doneB = b.status === 'reference' || b.status === 'complete' ? 0 : 1;
      if (doneA !== doneB) return doneA - doneB;
      return (LANG_PRIORITY[a.code] ?? 99) - (LANG_PRIORITY[b.code] ?? 99);
    });
  });

  /** Table of contents */
  tocItems = computed<TocItem[]>(() => [
    { id: 'timeline', label: this.t('roadmap.timeline.title'), icon: 'pi pi-map' },
    { id: 'languages', label: this.t('roadmap.languages.title'), icon: 'pi pi-globe' },
  ]);

  ngOnInit(): void {
    // Load learning paths. paths$ is a BehaviorSubject that never completes —
    // without teardown every visit to this page would leave a live subscriber.
    this.learningPathService.paths$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((paths) => {
      // Learning paths belong to the learn feature: none while it is switched off.
      this.paths.set(this.learnOn ? paths : []);
    });

    // Load demos (interleaved into the same timeline). Same rule as below: an
    // unhandled error here would crash the prerender, so a failure means no demos.
    this.demosService
      .getAllDemos()
      .pipe(catchError(() => of([])))
      .subscribe((demos) => this.demos.set(this.demosOn ? demos : []));

    // Load language review data. Must not throw on a missing/broken file:
    // an unhandled HttpErrorResponse here would crash the Node SSR process
    // (the section is `@if (languageReview())`-guarded, so null is safe).
    this.http
      .get<LanguageReviewData>('assets/data/roadmap/language-review.json')
      .pipe(catchError(() => of(null)))
      .subscribe((data) => this.languageReview.set(data));
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.timelineRef) return;
    // Recompute the column count whenever the timeline resizes — drives the
    // accurate "+ N weitere" count and the collapse threshold.
    this.gridObserver = new ResizeObserver(() => this.measureColumns());
    this.gridObserver.observe(this.timelineRef.nativeElement);
    this.measureColumns();
  }

  ngOnDestroy(): void {
    this.gridObserver?.disconnect();
  }

  /** Read the grid's actual rendered column count (exact — no min/gap guesswork). */
  private measureColumns(): void {
    const grid = this.timelineRef?.nativeElement.querySelector('.child-grid') as HTMLElement | null;
    if (!grid) return;
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
    if (cols > 0 && cols !== this.tilesPerRow()) this.tilesPerRow.set(cols);
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  /** Whether a drop's publishDate has been reached (handles date-only + full ISO). */
  published(publishDate?: string): boolean {
    return this.timeGateService.isPublished(publishDate);
  }

  isNextDrop(drop: TimelineDrop): boolean {
    const next = this.nextDropDate();
    return next !== null && drop.publishDate === next;
  }

  /** Accent color by drop kind: go-live amber, demos teal, learning paths blue. */
  dropColor(drop: TimelineDrop): string {
    if (drop.kind === 'golive') return 'var(--primary-color)';
    return drop.kind === 'demo' ? 'var(--p-teal-500)' : 'var(--semantic-blue-fg)';
  }

  /** The kit's own flag for a language (from languages.json), or '' for a code badge. */
  flagUrl(langCode: string): string {
    const key = getLanguageInfo(langCode)?.flag;
    return key && hasFlag(key) ? getDisplayAsset('flag', key) : '';
  }

  getScript(langCode: string): string {
    return LANG_SCRIPT[langCode] || 'latin';
  }

  getLanguageGlowColor(lang: LanguageReviewEntry): string {
    if (lang.status === 'reference') return 'var(--semantic-blue-fg)';
    if (lang.status === 'complete') return 'var(--semantic-green-fg)';
    if (lang.status === 'in_progress' && lang.progress >= 10) return 'var(--semantic-orange-fg)';
    return 'var(--p-gray-400)';
  }

  formatDate(dateStr: string): string {
    // Date-only ('YYYY-MM-DD') → local midnight; full ISO ('…T18:00:00Z') as-is.
    const date = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    const locale = dateLocaleFor(this.translationService.currentLanguage);
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
