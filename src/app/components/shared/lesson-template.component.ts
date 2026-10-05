/**
 * LessonTemplateComponent - Unified lesson presentation template
 *
 * Replaces both ArticleTemplateComponent and GuideTemplateComponent.
 * The `focus` field in LessonMeta controls the content type:
 * - 'theory' = former Article (THESIS framework, conceptual content)
 * - 'practice' = former Guide (DEP pattern, hands-on content)
 *
 * Features: back-button, scroll progress, FAB stack (Easy Language, ToC),
 * share buttons, draft badge, Related Tools/Resources sections.
 */
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  inject,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of, map, merge } from 'rxjs';
import { RelatedRefs } from '../../services/related-refs.types';

import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';
import { DividerModule } from '@openng/optimus-ui/divider';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { TranslationService } from '../../services/translation.service';
import { AiToolsService } from '../../services/ai-tools.service';
import { AiResourcesService } from '../../services/ai-resources.service';
import { ArticleMetaService } from '../../services/article-meta.service';
import { ArticlesService } from '../../services/articles.service';
import { SourcesService, Source } from '../../services/book-sources.service';
import { TableOfContentsFabComponent, TocItem } from './table-of-contents-fab.component';
import { PageHeaderComponent } from './page-header.component';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

// Highlighting System
import { HighlightDirective } from '../../directives/highlight.directive';
import { GlossaryPopoverComponent } from './glossary-popover.component';
import { SimpleEasyLanguageFabComponent } from './simple-easy-language-fab.component';
import { FabRegistryService, FAB_PRIORITIES } from '../../services/fab-registry.service';
import { EasyLanguageService } from '../../services/easy-language.service';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { RelatedRefsComponent } from './related-refs.component';
import { dateLocaleFor } from '../../utils/date-locale';
import { scrollBehavior } from '../../utils/reduced-motion';
import { learnBackLink } from '../../utils/learn-back-link';
import { SITE_CONFIG } from '../../../config/site';

export interface LessonMeta {
  id: string;
  titleKey: string;
  subtitleKey?: string;
  title?: string; // Static title (used if titleKey doesn't resolve)
  subtitle?: string; // Static subtitle
  readingTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyKey: string;
  focus: 'theory' | 'practice';
  category?: string;
  categoryKey?: string;
  publishDate?: Date;
  chapters?: number;
  draft?: boolean;
  /**
   * Scheduled release date. Only renders the "Geplant für DD.MM.YYYY" badge
   * in dev mode (in prod the route guard blocks the page entirely before
   * this component mounts). Independent from `publishDate` which is the
   * "Erschienen am"-stamp shown in the meta toolbar.
   */
  scheduledFor?: Date;
}

@Component({
  selector: 'app-lesson-template',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
    TableOfContentsFabComponent,
    SimpleEasyLanguageFabComponent,
    HighlightDirective,
    GlossaryPopoverComponent,
    PageHeaderComponent,
    CursorGlowDirective,
    RelatedRefsComponent,
  ],
  template: `
    <article class="lesson-container" [attr.aria-labelledby]="'lesson-title'" #lessonContainer>
      <!-- Loading State -->
      @if (!meta) {
        <div class="lesson-loading"><i class="pi pi-spinner pi-spin"></i> {{ translate('lessons.loading') }}</div>
      }

      <!-- Lesson Content (only when loaded) -->
      @if (meta) {
        <div>
          <!-- Page Header — directly under page-root; see src/assets/design-system/page-header.md -->
          <app-page-header [title]="meta.title" [titleKey]="meta.titleKey">
            @if (meta.subtitle || meta.subtitleKey) {
              <p class="ph-sub" [appHighlight]="meta.subtitle || translate(meta.subtitleKey!)">
                {{ meta.subtitle || translate(meta.subtitleKey!) }}
              </p>
            }
            @if (meta.draft) {
              <span class="draft-badge">
                <i class="pi pi-pencil" aria-hidden="true"></i>
                {{ translate('lessons.draftBadge') }}
              </span>
            }
            @if (isScheduledFuture()) {
              <span class="scheduled-badge">
                <i class="pi pi-calendar-clock" aria-hidden="true"></i>
                {{ translate('lessons.scheduledFor') }} {{ formatDate(meta.scheduledFor!) }}
              </span>
            }
          </app-page-header>
          <!-- Controls toolbar — back-button + meta + share, sits BELOW page-header -->
          <div class="lesson-controls">
            <div class="lesson-toolbar" appCursorGlow>
              <!-- Back Navigation on left -->
              <div class="lesson-toolbar-nav">
                <button
                  pButton
                  type="button"
                  [outlined]="true"
                  size="small"
                  (click)="navigateBack()"
                  class="back-button-header"
                  [attr.aria-label]="backButtonLabel"
                >
                  <i class="pi pi-arrow-left" pButtonIcon aria-hidden="true"></i
                  ><span pButtonLabel>{{ backButtonLabel }}</span>
                </button>
              </div>
              <!-- Meta info centered -->
              <div class="lesson-toolbar-meta">
                @if (meta.categoryKey) {
                  <span class="meta-item category">
                    <i class="pi pi-folder" aria-hidden="true"></i>
                    <span class="meta-text">{{ translate(meta.categoryKey) }}</span>
                  </span>
                }
                <span class="meta-item">
                  <i class="pi pi-clock" aria-hidden="true"></i>
                  <span class="meta-text">{{ meta.readingTime }}</span>
                </span>
                <span class="meta-item">
                  <i class="pi pi-chart-bar" aria-hidden="true"></i>
                  <span class="meta-text">{{ translate(meta.difficultyKey) }}</span>
                </span>
                @if (meta.chapters) {
                  <span class="meta-item">
                    <i class="pi pi-list" aria-hidden="true"></i>
                    <span class="meta-text">{{ meta.chapters }} {{ translate('lessons.chapters') }}</span>
                  </span>
                }
                @if (meta.publishDate) {
                  <span class="meta-item">
                    <i class="pi pi-calendar" aria-hidden="true"></i>
                    <span class="meta-text">{{ formatDate(meta.publishDate) }}</span>
                  </span>
                }
              </div>
              <!-- Header Share Buttons on right -->
              <div class="lesson-toolbar-share">
                <button
                  class="lesson-toolbar-btn"
                  (click)="copyLink()"
                  [pTooltip]="translate('lessons.copyLink')"
                  tooltipPosition="top"
                  [attr.aria-label]="translate('lessons.copyLink')"
                >
                  <i class="pi pi-link"></i>
                </button>
                <button
                  class="lesson-toolbar-btn"
                  (click)="shareOnTwitter()"
                  [pTooltip]="translate('lessons.shareOnX')"
                  tooltipPosition="top"
                  [attr.aria-label]="translate('lessons.shareOnX')"
                >
                  <i class="pi pi-twitter"></i>
                </button>
                <button
                  class="lesson-toolbar-btn"
                  (click)="shareOnLinkedIn()"
                  [pTooltip]="translate('lessons.shareOnLinkedIn')"
                  tooltipPosition="top"
                  [attr.aria-label]="translate('lessons.shareOnLinkedIn')"
                >
                  <i class="pi pi-linkedin"></i>
                </button>
                <button
                  class="lesson-toolbar-btn print-btn"
                  (click)="printLesson()"
                  [pTooltip]="translate('lessons.print')"
                  tooltipPosition="top"
                  [attr.aria-label]="translate('lessons.print')"
                >
                  <i class="pi pi-print"></i>
                </button>
                <!-- More share options (⋯) -->
                <div class="share-more-wrapper">
                  <button
                    class="lesson-toolbar-btn"
                    (click)="toggleMoreShareOptions($event)"
                    [pTooltip]="translate('lessons.moreShareOptions')"
                    tooltipPosition="top"
                    [attr.aria-label]="translate('lessons.moreShareOptions')"
                    [attr.aria-expanded]="showMoreShareOptions()"
                  >
                    <i class="pi pi-ellipsis-h"></i>
                  </button>
                  @if (showMoreShareOptions()) {
                    <div class="share-more-menu" role="menu">
                      <button class="share-more-item" (click)="shareOnWhatsApp()" role="menuitem">
                        <i class="pi pi-whatsapp"></i>
                        <span>{{ translate('lessons.shareOnWhatsApp') }}</span>
                      </button>
                      <button class="share-more-item" (click)="shareViaEmail()" role="menuitem">
                        <i class="pi pi-envelope"></i>
                        <span>{{ translate('lessons.shareViaEmail') }}</span>
                      </button>
                      <button class="share-more-item" (click)="shareOnFacebook()" role="menuitem">
                        <i class="pi pi-facebook"></i>
                        <span>{{ translate('lessons.shareOnFacebook') }}</span>
                      </button>
                      <button class="share-more-item" (click)="shareOnTelegram()" role="menuitem">
                        <i class="pi pi-telegram"></i>
                        <span>{{ translate('lessons.shareOnTelegram') }}</span>
                      </button>
                      <button class="share-more-item" (click)="shareOnReddit()" role="menuitem">
                        <i class="pi pi-reddit"></i>
                        <span>{{ translate('lessons.shareOnReddit') }}</span>
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <!-- Progress Indicator -->
          <div
            class="progress-container"
            role="progressbar"
            [attr.aria-valuenow]="scrollProgress()"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-label]="translate('lessons.readingProgress')"
          >
            <div class="progress-bar" [style.width.%]="scrollProgress()"></div>
          </div>
          <!-- Dialog-only components (buttons rendered via FAB Registry) -->
          <!-- Easy Language Dialog -->
          <app-simple-easy-language-fab
            #easyLanguageFab
            [contentId]="meta.id || 'lesson'"
            [contentType]="easyContentType()"
            [hideButton]="true"
          >
          </app-simple-easy-language-fab>
          <!-- Table of Contents Popover -->
          <app-table-of-contents-fab
            #tocFab
            [items]="tocItems"
            [title]="translate('lessons.tableOfContents')"
            [hideButton]="true"
            (itemClicked)="onTocItemClicked($event)"
          >
          </app-table-of-contents-fab>
          <!-- Lesson Content - Projected content goes here -->
          <div class="lesson-layout">
            <div class="lesson-main">
              <ng-content></ng-content>
              <!-- Related Tools Section -->
              @if (hasToolReferences()) {
                <section class="related-tools-section" aria-labelledby="related-tools-heading">
                  <h2 id="related-tools-heading" class="section-heading">
                    <i class="pi pi-wrench"></i>
                    {{ translate('articles.relatedTools') }}
                  </h2>
                  <div class="tool-links-grid">
                    @for (tool of getToolData(); track tool.id) {
                      <div class="tool-link-card">
                        <div class="tool-info">
                          <h3 class="tool-name">{{ tool.name }}</h3>
                          <p class="tool-description">{{ tool.shortDescription }}</p>
                        </div>
                        <div class="tool-actions">
                          @if (catalogOn) {
                            <a
                              [routerLink]="['/catalog']"
                              [queryParams]="{ search: 'exact:' + tool.id }"
                              class="tool-action-btn outline-link"
                              [attr.aria-label]="translate('articles.viewInCatalog') + ': ' + tool.name"
                            >
                              <i class="pi pi-list"></i>
                              {{ translate('articles.viewInCatalog') }}
                            </a>
                          }
                          <a
                            [href]="tool.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="tool-action-btn outline-link"
                            [attr.aria-label]="translate('articles.openExternal') + ': ' + tool.name"
                          >
                            <i class="pi pi-external-link"></i>
                            {{ translate('articles.openExternal') }}
                          </a>
                        </div>
                      </div>
                    }
                  </div>
                </section>
              }
              <!-- Related Resources Section -->
              @if (hasResourceReferences()) {
                <section class="related-resources-section" aria-labelledby="related-resources-heading">
                  <h2 id="related-resources-heading" class="section-heading">
                    <i class="pi pi-book"></i>
                    {{ translate('articles.relatedResources') }}
                  </h2>
                  <div class="tool-links-grid">
                    @for (resource of getResourceData(); track resource.id) {
                      <div class="tool-link-card resource-card">
                        <div class="tool-info">
                          <h3 class="tool-name">{{ resource.name }}</h3>
                          <p class="tool-description">{{ resource.shortDescription }}</p>
                        </div>
                        <div class="tool-actions">
                          @if (catalogOn) {
                            <a
                              [routerLink]="['/catalog']"
                              [queryParams]="{ search: 'exact:' + resource.id }"
                              class="tool-action-btn outline-link"
                              [attr.aria-label]="translate('articles.viewInCatalog') + ': ' + resource.name"
                            >
                              <i class="pi pi-list"></i>
                              {{ translate('articles.viewInCatalog') }}
                            </a>
                          }
                          <a
                            [href]="resource.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="tool-action-btn outline-link"
                            [attr.aria-label]="translate('articles.openExternal') + ': ' + resource.name"
                          >
                            <i class="pi pi-external-link"></i>
                            {{ translate('articles.openExternal') }}
                          </a>
                        </div>
                      </div>
                    }
                  </div>
                </section>
              }
              <!-- Cited Sources Section (same card style as /sources page) -->
              @if (hasSourceReferences()) {
                <section class="related-sources-section" aria-labelledby="cited-sources-heading">
                  <h2 id="cited-sources-heading" class="section-heading">
                    <i class="pi pi-bookmark"></i>
                    {{ translate('articles.citedSources') }}
                  </h2>
                  <div class="cited-sources-grid">
                    @for (source of getSourceData(); track source.id) {
                      <div class="cited-source-card" [attr.data-type]="source.type">
                        <div class="cited-card-header">
                          <div class="cited-card-header-left">
                            <span class="cited-type-icon">
                              <i [class]="getSourceTypeIcon(source.type)"></i>
                            </span>
                            <span class="cited-type-label">{{ translate('sources.types.' + source.type) }}</span>
                          </div>
                          @if (source.url) {
                            <a
                              [href]="source.url"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="cited-external-btn"
                              [attr.aria-label]="translate('articles.openExternal') + ': ' + source.title"
                            >
                              <i class="pi pi-external-link"></i>
                            </a>
                          } @else if (source.doi) {
                            <a
                              [href]="'https://doi.org/' + source.doi"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="cited-external-btn"
                              [attr.aria-label]="translate('articles.openExternal') + ' (DOI): ' + source.title"
                            >
                              <i class="pi pi-external-link" aria-hidden="true"></i>
                            </a>
                          }
                        </div>
                        <div class="cited-card-content">
                          <h3 class="cited-source-title">{{ source.title }}</h3>
                          <div class="cited-citation-info">
                            @if (source.authors) {
                              <span><i class="pi pi-user"></i> {{ source.authors }}</span>
                            }
                            @if (source.year) {
                              <span><i class="pi pi-calendar"></i> {{ source.year }}</span>
                            }
                            @if (source.publication) {
                              <span><i class="pi pi-book"></i> {{ source.publication }}</span>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </section>
              }
              <!-- Verwandte Inhalte — ontology-driven (V1 types) + editorial pin
                   from article JSON (V2 types: tools/resources/external). Hybrid
                   merge is handled by RelatedRefsService.resolveForNodeWithEditorial. -->
              @if (meta.id) {
                <app-related-refs
                  density="expansive"
                  [richTypes]="['articles', 'demos', 'external', 'tools', 'resources']"
                  [forNode]="{ type: 'article', id: meta.id }"
                  [refs]="(articleRelated$ | async) ?? null"
                  [mapTrigger]="true"
                  [cardWrap]="true"
                >
                </app-related-refs>
              }
            </div>
          </div>
        </div>
      }
    </article>

    <!-- Global Glossary Popover -->
    <app-glossary-popover></app-glossary-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Main Container */
      .lesson-container {
        max-width: var(--container-section);
        margin: 0 auto;
        /* Top padding minimal — page-header brings own top spacing */
        padding: var(--space-2) var(--space-4) var(--space-6);
        background: var(--surface-0);
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* Loading State */
      .lesson-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        font-size: 1.2rem;
        color: var(--text-color-secondary);
        gap: var(--space-3);
      }

      .lesson-loading i {
        font-size: 2rem;
      }

      /* Controls Toolbar — sits BELOW <app-page-header>, holds back-button + meta + share */
      .lesson-controls {
        margin-bottom: var(--space-8);
      }

      /* Lesson Toolbar - Clean card layout. Hover-glow via appCursorGlow directive.
       Class names are scoped (lesson-toolbar-*) to avoid colliding with the
       global app-root .header-navigation rule that hides the navbar dropdown. */
      .lesson-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
        padding: var(--space-3) var(--space-4);
        border-radius: var(--border-radius);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }

      /* The dark rules below use :host-context, not a bare .dark-theme: view
         encapsulation scoped a plain ancestor selector to this component, so
         none of them ever matched. */
      :host-context(.dark-theme) .lesson-toolbar {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      }

      /* Icon contrast — full --text-color (theme-adaptive) on toolbar icons. */
      .lesson-toolbar .meta-item:not(.category),
      .lesson-toolbar .meta-item:not(.category) i {
        color: var(--text-color);
      }
      .lesson-toolbar .lesson-toolbar-btn,
      .lesson-toolbar .lesson-toolbar-btn i {
        color: var(--text-color);
      }

      .lesson-toolbar-nav {
        flex-shrink: 0;
      }

      .lesson-toolbar-meta {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        justify-content: center;
        flex: 1;
        flex-wrap: wrap;
        min-width: 0;
      }

      .lesson-toolbar-share {
        display: flex;
        gap: var(--space-2);
        align-items: center;
        flex-shrink: 0;
      }

      /* Meta Items - Chip style */
      .meta-item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        background: var(--surface-100);
        color: var(--text-color);
        border: 1px solid var(--surface-200);
        border-radius: 20px;
        font-size: 0.9rem;
      }

      /* primary-800: primary-700 measured 4.44:1 on primary-100 in Skizzenbuch. */
      .meta-item.category {
        background: var(--primary-100);
        border-color: var(--primary-200);
        color: var(--primary-800);
      }

      /* :host-context, not a bare .dark-theme: view encapsulation scopes a
         plain ancestor selector to this component, so it never matched. */
      :host-context(.dark-theme) .meta-item.category {
        background: var(--primary-900);
        border-color: var(--primary-700);
        color: var(--primary-200);
      }

      .meta-item i {
        font-size: 0.85rem;
      }

      /* Share Buttons */
      .lesson-toolbar-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border: 1px solid var(--surface-border);
        border-radius: 50%;
        background: var(--surface-ground);
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        flex-shrink: 0;
      }

      .lesson-toolbar-btn:hover {
        background: var(--surface-hover);
        color: var(--primary-color-fg);
        border-color: var(--primary-color-fg);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .lesson-toolbar-btn:active {
        transform: translateY(0) scale(0.95);
      }

      .lesson-toolbar-btn:focus-visible {
        background: var(--surface-hover);
        color: var(--primary-color-fg);
        border-color: var(--primary-color-fg);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Background only: a border-color here would outrank the hover and focus
         border above, now that the rule matches. */
      :host-context(.dark-theme) .lesson-toolbar-btn {
        background: var(--surface-card);
      }

      :host-context(.dark-theme) .lesson-toolbar-btn:hover,
      :host-context(.dark-theme) .lesson-toolbar-btn:focus-visible {
        background: var(--surface-hover);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .lesson-toolbar-btn i {
        font-size: 1rem;
      }

      /* More Share Options Menu */
      .share-more-wrapper {
        position: relative;
      }

      .share-more-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: var(--space-2);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        z-index: 100;
        min-width: 220px;
        padding: var(--space-2) 0;
        animation: shareMenuFadeIn 0.15s ease-out;
      }

      @keyframes shareMenuFadeIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .share-more-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        width: 100%;
        padding: var(--space-3) var(--space-4);
        border: none;
        background: transparent;
        color: var(--text-color);
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.15s ease;
        text-align: left;
      }

      .share-more-item:hover {
        background: var(--surface-hover);
      }

      .share-more-item:focus-visible {
        background: var(--surface-hover);
        outline: 2px solid var(--primary-color-fg);
        outline-offset: -2px;
      }

      .share-more-item i {
        font-size: 1.1rem;
        width: 20px;
        text-align: center;
        color: var(--text-color-secondary);
      }

      .share-more-item:hover i {
        color: var(--primary-color-fg);
      }

      /* Title with Badge */
      .title-with-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-3);
        flex-wrap: wrap;
      }

      /* Lesson Title */
      .lesson-title {
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: var(--space-4);
        color: var(--text-color);
      }

      /* Draft Badge */
      .draft-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        background: var(--orange-100);
        border: 1px solid var(--orange-300);
        border-radius: 20px;
        color: var(--orange-700);
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .draft-badge i {
        font-size: 0.8rem;
      }

      /* Dark: --orange-200 is a 30% tint in dark mode, so the 900/700/200 trio
         rendered translucent text at 1.48:1. Tint, ring and gated text token. */
      :host-context(.dark-theme) .draft-badge {
        background: var(--orange-100);
        border-color: var(--orange-600);
        color: var(--semantic-orange-fg);
      }

      /* Scheduled Badge — author preview only; route guard blocks the page
       entirely in prod, so this is dev-mode-only signage. */
      .scheduled-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        margin-left: var(--space-2);
        background: var(--blue-100);
        border: 1px solid var(--blue-300);
        border-radius: 20px;
        color: var(--blue-700);
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .scheduled-badge i {
        font-size: 0.8rem;
      }

      /* Same as the draft badge: the 900/700/200 trio measured 1.38:1 in dark. */
      :host-context(.dark-theme) .scheduled-badge {
        background: var(--blue-100);
        border-color: var(--blue-600);
        color: var(--semantic-blue-fg);
      }

      .lesson-subtitle {
        font-size: 1.3rem;
        font-weight: 400;
        color: var(--text-color-secondary);
        margin-bottom: var(--space-4);
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
      }

      :host-context(.dark-theme) .lesson-subtitle {
        color: var(--text-color);
        opacity: 0.8;
      }

      /* Progress Indicator */
      .progress-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--surface-200);
        z-index: 1100;
      }

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--gradient-accent-color));
        transition: width 0.1s ease-out;
      }

      /* Lesson Layout */
      .lesson-layout {
        margin-top: var(--space-6);
      }

      .lesson-main {
        max-width: 100%;
      }

      /* Back Button Styling - using button pButton directive, styles apply directly */
      .back-button-header {
        font-size: 0.9rem;
      }

      /* Responsive Design */

      /* Wide tablet / small desktop — meta wraps below back+share row, centered */
      @media (max-width: 1024px) {
        .lesson-toolbar {
          flex-wrap: wrap;
          row-gap: var(--space-3);
        }

        .lesson-toolbar-meta {
          order: 3;
          flex-basis: 100%;
          justify-content: center;
        }
      }

      /* Tablet/Phone — stack into 3 rows: nav | meta | share, centered */
      @media (max-width: 768px) {
        .lesson-container {
          padding: var(--space-4) var(--space-3);
        }

        .lesson-controls {
          margin-bottom: var(--space-6);
        }

        .lesson-toolbar {
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-3);
          padding: var(--space-3);
        }

        .lesson-toolbar-nav {
          order: 1;
          align-self: stretch;
        }

        .lesson-toolbar-nav .back-button-header {
          width: 100%;
          justify-content: center;
        }

        .lesson-toolbar-meta {
          order: 2;
          flex-basis: auto;
          justify-content: center;
          gap: var(--space-2);
        }

        .lesson-toolbar-share {
          order: 3;
          justify-content: center;
          flex-wrap: wrap;
        }
      }

      /* Small phone — compact spacing */
      @media (max-width: 480px) {
        .lesson-toolbar-btn {
          width: 40px;
          height: 40px;
        }

        .lesson-toolbar-share {
          gap: var(--space-1);
        }

        .meta-item {
          padding: var(--space-1) var(--space-3);
          font-size: 0.85rem;
          gap: var(--space-1);
        }
      }

      /* Related Tools/Resources/Sources Section */
      .related-tools-section,
      .related-resources-section,
      .related-sources-section {
        margin-top: var(--space-8);
        padding-top: var(--space-6);
        border-top: 1px solid var(--surface-border);
      }

      .section-heading {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: var(--space-5);
        color: var(--text-color);
      }

      .section-heading i {
        color: var(--primary-color-fg);
      }

      .tool-links-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
        gap: var(--space-4);
      }

      .tool-link-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        transition: all 0.2s ease;
      }

      .tool-link-card:hover {
        border-color: var(--primary-color-fg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      :host-context(.dark-theme) .tool-link-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .tool-info {
        flex: 1;
      }

      .tool-name {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 var(--space-2) 0;
        color: var(--text-color);
      }

      .tool-description {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        margin: 0;
        line-height: 1.5;
      }

      .tool-actions {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }

      .tool-action-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-3);
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.2s ease;
      }

      .tool-action-btn.outline-link {
        background: var(--surface-100);
        color: var(--text-color);
        border: 1px solid var(--surface-border);
      }

      .tool-action-btn.outline-link:hover {
        background: var(--surface-200);
        border-color: var(--primary-color-fg);
      }

      /* Dark: the surface scale is inverted there, so surface-700/600 are light
         greys (text 1.32:1). The hover surface and the control border instead. */
      :host-context(.dark-theme) .tool-action-btn.outline-link {
        background: var(--surface-hover);
        border-color: var(--control-border);
      }

      :host-context(.dark-theme) .tool-action-btn.outline-link:hover {
        background: var(--surface-200);
        border-color: var(--primary-color-fg);
      }

      .resource-card {
        border-left: 4px solid var(--blue-500);
      }

      /* Cited Sources - matching /sources page card design */
      .cited-sources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(380px, 100%), 1fr));
        gap: 1.5rem;
      }

      .cited-source-card {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
        padding: 1.25rem;
        transition: box-shadow 0.3s ease;
      }

      .cited-source-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .cited-source-card[data-type='paper'] {
        border-left-color: #3b82f6;
      }
      .cited-source-card[data-type='book'] {
        border-left-color: #10b981;
      }
      .cited-source-card[data-type='website'] {
        border-left-color: #06b6d4;
      }
      .cited-source-card[data-type='wikipedia'] {
        border-left-color: #64748b;
      }
      .cited-source-card[data-type='blog'] {
        border-left-color: #f59e0b;
      }
      .cited-source-card[data-type='video'] {
        border-left-color: #ef4444;
      }
      .cited-source-card[data-type='interview'] {
        border-left-color: #ec4899;
      }
      .cited-source-card[data-type='article'] {
        border-left-color: #14b8a6;
      }

      .cited-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .cited-card-header-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .cited-type-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        font-size: 0.85rem;
      }

      .cited-source-card[data-type='paper'] .cited-type-icon {
        background: #3b82f6;
      }
      .cited-source-card[data-type='book'] .cited-type-icon {
        background: #10b981;
      }
      .cited-source-card[data-type='website'] .cited-type-icon {
        background: #06b6d4;
      }
      .cited-source-card[data-type='wikipedia'] .cited-type-icon {
        background: #64748b;
      }
      .cited-source-card[data-type='blog'] .cited-type-icon {
        background: #f59e0b;
      }
      .cited-source-card[data-type='video'] .cited-type-icon {
        background: #ef4444;
      }
      .cited-source-card[data-type='interview'] .cited-type-icon {
        background: #ec4899;
      }
      .cited-source-card[data-type='article'] .cited-type-icon {
        background: #14b8a6;
      }

      .cited-type-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .cited-external-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: transparent;
        color: var(--text-color-secondary);
        text-decoration: none;
        transition: all 0.2s ease;
      }

      .cited-external-btn:hover {
        background: var(--surface-hover);
        color: var(--primary-color-fg);
      }

      .cited-card-content {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .cited-source-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
        line-height: 1.4;
      }

      .cited-citation-info {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }

      .cited-citation-info span {
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }

      .cited-citation-info i {
        font-size: 0.8rem;
        color: var(--primary-color-fg);
      }

      @media (max-width: 480px) {
        .cited-sources-grid {
          grid-template-columns: 1fr;
        }

        .cited-citation-info {
          flex-direction: column;
          gap: 0.5rem;
        }
      }

      /* Related Articles Section */
      .related-articles-section {
        margin-top: var(--space-6);
      }

      .related-articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-4);
      }

      .related-article-card {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-4);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        text-decoration: none;
        color: var(--text-color);
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .related-article-card:hover {
        border-color: var(--primary-color-fg);
        box-shadow: 0 2px 8px color-mix(in srgb, var(--primary-color) 15%, transparent);
      }

      .related-article-meta {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: 0.8rem;
      }

      .related-article-difficulty {
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 500;
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      .related-article-difficulty[data-difficulty='beginner'] {
        background: var(--p-green-100);
        color: var(--p-green-900);
      }

      .related-article-difficulty[data-difficulty='intermediate'] {
        background: var(--p-orange-100);
        color: var(--p-orange-900);
      }

      .related-article-difficulty[data-difficulty='advanced'] {
        background: var(--p-red-100);
        color: var(--p-red-900);
      }

      :host-context(.dark-theme) .related-article-difficulty[data-difficulty='beginner'] {
        background: var(--p-green-900);
        color: var(--p-green-100);
      }

      :host-context(.dark-theme) .related-article-difficulty[data-difficulty='intermediate'] {
        background: var(--p-orange-900);
        color: var(--p-orange-100);
      }

      :host-context(.dark-theme) .related-article-difficulty[data-difficulty='advanced'] {
        background: var(--p-red-900);
        color: var(--p-red-100);
      }

      .related-article-time {
        color: var(--text-color-secondary);
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .related-article-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.4;
      }

      .related-article-description {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      @media (max-width: 480px) {
        .related-articles-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Print Styles */
      @media print {
        .lesson-toolbar-share,
        .progress-container,
        .lesson-toolbar-nav,
        .related-tools-section,
        .related-resources-section,
        .related-sources-section,
        .related-articles-section,
        .draft-badge,
        .scheduled-badge {
          display: none !important;
        }

        .lesson-container {
          padding: 0 !important;
          max-width: 100% !important;
          min-height: auto !important;
        }

        .lesson-controls {
          margin-bottom: 0.5rem !important;
        }

        .lesson-toolbar {
          background: none !important;
          padding: 0 !important;
          margin-bottom: 0.5rem !important;
          justify-content: flex-start;
        }

        .lesson-title {
          font-size: 20pt !important;
          margin: 0 0 0.25rem 0 !important;
          text-align: left !important;
        }

        .lesson-subtitle {
          font-size: 11pt !important;
          color: #555 !important;
          text-align: left !important;
          margin: 0 !important;
        }

        .title-with-badge {
          justify-content: flex-start;
        }

        .meta-item {
          background: none !important;
          border: 1px solid #ccc !important;
          padding: 2px 8px !important;
          font-size: 8pt !important;
          color: #333 !important;
        }

        .meta-item.category {
          background: none !important;
          border-color: #999 !important;
          color: #333 !important;
          font-weight: 600;
        }

        .lesson-layout,
        .lesson-main {
          padding: 0 !important;
          margin: 0 !important;
        }
      }

      @media (max-width: 480px) {
        .tool-links-grid {
          grid-template-columns: 1fr;
        }

        .tool-actions {
          flex-direction: column;
        }

        .tool-action-btn {
          justify-content: center;
        }
      }

      @media (max-width: 380px) {
        .meta-item {
          padding: var(--space-1) var(--space-2);
          font-size: 0.8rem;
        }
      }

      @media (max-width: 360px) {
        /* text-overflow works on a block container's inline content, and
         .meta-item is flex — the ellipsis has to live on the text child
         (same pattern as .item-text in table-of-contents-fab). */
        .meta-item {
          max-width: 100%;
          min-width: 0;
        }
        .meta-item .meta-text {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .lesson-toolbar-btn,
        .tool-link-card,
        .tool-action-btn,
        .progress-bar {
          transition: none;
        }
      }
    `,
  ],
})
export class LessonTemplateComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() meta!: LessonMeta;
  @Input() tocItems: TocItem[] = [];

  // ViewChild references for dialog components
  @ViewChild('easyLanguageFab') easyLanguageFab!: SimpleEasyLanguageFabComponent;
  @ViewChild('tocFab') tocFab!: TableOfContentsFabComponent;

  /** Signal: written from the throttled window-scroll stream, outside any template event. */
  scrollProgress = signal(0);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private fabRegistry = inject(FabRegistryService);
  private easyLanguageService = inject(EasyLanguageService);
  private articleMetaService = inject(ArticleMetaService);
  private articlesService = inject(ArticlesService);
  private aiToolsService = inject(AiToolsService);
  private aiResourcesService = inject(AiResourcesService);
  private sourcesService = inject(SourcesService);
  private activatedRoute = inject(ActivatedRoute);
  private fromParam: string | null = null;

  private router = inject(Router);
  private translationService = inject(TranslationService);

  private site = inject(SITE_CONFIG);
  /** The learning area, or the start page while site.json switches `learn` off. */
  private backLink = learnBackLink(this.site);
  /** "View in catalog" buttons only while the catalog is on (site.json). */
  readonly catalogOn = this.site.isRouteOn('catalog');

  get backButtonLabel(): string {
    return this.translate(this.backLink.labelKey);
  }

  /**
   * Editorial `related` block for the current article (from
   * articles/index.json, synced from per-id JSON by
   * scripts/sync-related-to-index.mjs). Passed to <app-related-refs> as
   * `[refs]` alongside `[forNode]` so V2 types (tools/resources/external)
   * render — they're not in the ontology graph by design.
   * Emits null until the meta is ready or for non-article focus types.
   */
  get articleRelated$(): Observable<RelatedRefs | null> {
    if (!this.meta?.id) return of(null);
    return this.articlesService.getById(this.meta.id).pipe(map((a) => (a?.related ?? null) as RelatedRefs | null));
  }

  ngOnInit(): void {
    this.fromParam = this.activatedRoute.snapshot.queryParamMap.get('from');
    this.setupScrollTracking();

    // The tool/resource/source sections read service BehaviorSubject values
    // imperatively; the bundle usually lands after first render, so re-check
    // this OnPush view whenever one of them emits.
    merge(
      this.aiToolsService.entries$,
      this.aiResourcesService.entries$,
      this.sourcesService.entries$,
      this.sourcesService.references$,
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

  /**
   * The content type the easy-language layer files this page under. Single
   * source for the FAB binding and the registry check — a hard-coded 'page'
   * on the FAB made the two disagree for articles.
   */
  easyContentType(): 'page' | 'article' {
    return this.meta?.focus === 'practice' ? 'page' : 'article';
  }

  ngAfterViewInit(): void {
    const contentId = this.meta?.id || 'lesson';
    const contentType = this.easyContentType();

    // Register Easy Language FAB if content is available
    if (this.easyLanguageService.hasEasyVersion(contentId, contentType)) {
      this.fabRegistry.register({
        id: `easy-language-${contentId}`,
        priority: FAB_PRIORITIES.EASY_LANGUAGE,
        icon: 'pi-language',
        labelKey: 'easyLanguage.fab.label',
        color: 'default',
        onClick: () => this.easyLanguageFab?.open(),
      });
    }

    // Register ToC FAB if items are available
    if (this.tocItems.length > 0) {
      this.fabRegistry.register({
        id: `toc-${contentId}`,
        priority: FAB_PRIORITIES.TABLE_OF_CONTENTS,
        icon: 'pi-list',
        labelKey: 'lessons.tableOfContents',
        color: 'default',
        onClick: () => this.tocFab?.open(),
      });
    }
  }

  ngOnDestroy(): void {
    const contentId = this.meta?.id || 'lesson';
    this.fabRegistry.unregister(`easy-language-${contentId}`);
    this.fabRegistry.unregister(`toc-${contentId}`);

    // The share menu's document listener is otherwise only removed by a click:
    // navigating away while the menu is open would leave it attached.
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this.closeMoreHandler);
    }
  }

  private setupScrollTracking(): void {
    if (typeof window !== 'undefined') {
      fromEvent(window, 'scroll')
        .pipe(throttleTime(16), takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.updateScrollProgress();
        });
    }
  }

  // browser-only: window scroll subscription, set up behind a typeof-window guard.
  private updateScrollProgress(): void {
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) {
      this.scrollProgress.set(100);
      return;
    }

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom) {
      this.scrollProgress.set(100);
    } else {
      const rawProgress = (scrollTop / maxScroll) * 100;
      this.scrollProgress.set(Math.max(0, Math.min(99, rawProgress)));
    }
  }

  navigateBack(): void {
    this.router.navigate([this.backLink.route]);
  }

  // Sharing Functions
  /** Signal: also closed from a document-level click listener, outside the view. */
  showMoreShareOptions = signal(false);
  private closeMoreHandler = (e: MouseEvent) => this.onDocumentClick(e);

  // browser-only: click handler.
  copyLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  // browser-only: click handler.
  shareOnTwitter(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.translate(this.meta?.titleKey || ''));
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'noopener,noreferrer');
  }

  // browser-only: click handler.
  shareOnLinkedIn(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
  }

  // browser-only: click handler.
  shareOnWhatsApp(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.translate(this.meta?.titleKey || ''));
    window.open(`https://wa.me/?text=${title}%20${url}`, '_blank', 'noopener,noreferrer');
    this.showMoreShareOptions.set(false);
  }

  // browser-only: click handler.
  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    this.showMoreShareOptions.set(false);
  }

  // browser-only: click handler.
  shareOnTelegram(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.translate(this.meta?.titleKey || ''));
    window.open(`https://t.me/share/url?url=${url}&text=${title}`, '_blank', 'noopener,noreferrer');
    this.showMoreShareOptions.set(false);
  }

  // browser-only: click handler.
  shareOnReddit(): void {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.translate(this.meta?.titleKey || ''));
    window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank', 'noopener,noreferrer');
    this.showMoreShareOptions.set(false);
  }

  // browser-only: click handler.
  shareViaEmail(): void {
    const url = window.location.href;
    const title = this.translate(this.meta?.titleKey || '');
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`, '_self');
    this.showMoreShareOptions.set(false);
  }

  // browser-only: click handler.
  toggleMoreShareOptions(event: Event): void {
    event.stopPropagation();
    this.showMoreShareOptions.update((open) => !open);
    if (this.showMoreShareOptions()) {
      setTimeout(() => document.addEventListener('click', this.closeMoreHandler), 0);
    } else {
      document.removeEventListener('click', this.closeMoreHandler);
    }
  }

  // browser-only: document click listener.
  private onDocumentClick(_e: MouseEvent): void {
    this.showMoreShareOptions.set(false);
    document.removeEventListener('click', this.closeMoreHandler);
  }

  // browser-only: click handler.
  printLesson(): void {
    window.print();
  }

  // ToC Navigation
  // browser-only: table-of-contents click handler.
  onTocItemClicked(item: TocItem): void {
    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    }
  }

  // Date Formatting
  formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString(dateLocaleFor(this.translationService.currentIntlLocale), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * True iff `meta.scheduledFor` is in the future relative to wallclock now.
   * Cheap enough to call per-CD-cycle (single Date compare).
   * In prod the route guard already blocked the page; this gate exists so
   * the badge disappears the moment the date is reached during a long-running
   * dev session.
   */
  isScheduledFuture(): boolean {
    const d = this.meta?.scheduledFor;
    if (!d) return false;
    return d.getTime() > Date.now();
  }

  // Translation
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // Tool/Resource Reference Methods
  hasToolReferences(): boolean {
    if (!this.meta?.id) return false;
    const refs = this.articleMetaService.getToolReferences(this.meta.id);
    return refs.length > 0;
  }

  hasResourceReferences(): boolean {
    if (!this.meta?.id) return false;
    const refs = this.articleMetaService.getResourceReferences(this.meta.id);
    return refs.length > 0;
  }

  getToolData(): { id: string; name: string; shortDescription: string; url: string }[] {
    if (!this.meta?.id) return [];
    const toolIds = this.articleMetaService.getToolReferences(this.meta.id);
    return toolIds
      .map((id) => {
        const tool = this.aiToolsService.getToolById(id);
        if (!tool) return null;
        return {
          id: tool.id,
          name: tool.name,
          shortDescription: tool.shortDescription || '',
          url: tool.url || '',
        };
      })
      .filter((t): t is { id: string; name: string; shortDescription: string; url: string } => t !== null);
  }

  getResourceData(): { id: string; name: string; shortDescription: string; url: string }[] {
    if (!this.meta?.id) return [];
    const resourceIds = this.articleMetaService.getResourceReferences(this.meta.id);
    return resourceIds
      .map((id) => {
        const resource = this.aiResourcesService.getResourceById(id);
        if (!resource) return null;
        return {
          id: resource.id,
          name: resource.title,
          shortDescription: resource.shortDescription || '',
          url: resource.url || '',
        };
      })
      .filter((r): r is { id: string; name: string; shortDescription: string; url: string } => r !== null);
  }

  // Source Reference Methods
  getSourceTypeIcon(type: string): string {
    const icons: Record<string, string> = {
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
    return icons[type] || 'pi pi-file';
  }

  hasSourceReferences(): boolean {
    if (!this.meta?.id) return false;
    return this.sourcesService.getSourcesForPortalContent('article', this.meta.id).length > 0;
  }

  getSourceData(): Source[] {
    if (!this.meta?.id) return [];
    return this.sourcesService.getSourcesForPortalContent('article', this.meta.id);
  }
}
