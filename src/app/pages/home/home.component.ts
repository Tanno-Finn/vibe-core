/**
 * Home Component
 * Landing page for the portal with content showcase and navigation help.
 */
import {
  Component,
  computed,
  inject,
  ChangeDetectorRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Optimus UI Components
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ChipModule } from '@openng/optimus-ui/chip';
import { TagModule } from '@openng/optimus-ui/tag';
import { DividerModule } from '@openng/optimus-ui/divider';
import { PanelModule } from '@openng/optimus-ui/panel';
import { BadgeModule } from '@openng/optimus-ui/badge';
import { TooltipModule } from '@openng/optimus-ui/tooltip';

// Shared Components
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { StandardContainerComponent } from '../../components/shared/standard-container.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { ContentVisualSnippetComponent } from '../../components/shared/content-visual-snippet.component';
import { ContentMarqueeComponent } from '../../components/shared/content-marquee.component';

// Directives
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';

// Services
import { TranslationService } from '../../services/translation.service';

import { environment } from '../../../environments/environment';
import { SITE_CONFIG } from '../../../config/site';

/**
 * A card leads into one route; it is shown only while that route is on
 * (site.json feature switches). `features` names further features the card
 * is about beyond its route (the demos card opens the /learn hub on demos).
 */
interface FeatureBound {
  route: string;
  features?: string[];
}

export interface ShowcaseItem extends FeatureBound {
  id: string;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  queryParams?: Record<string, string>;
  visualType: string;
}

export interface QuickStartItem extends FeatureBound {
  id: string;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  fragment?: string;
  visualType: string;
  accent: string;
}

export interface NavigationExample extends FeatureBound {
  title: string;
  description: string;
  pageId: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    CardModule,
    ButtonModule,
    ChipModule,
    TagModule,
    DividerModule,
    PanelModule,
    BadgeModule,
    TooltipModule,
    PageHeaderComponent,
    StandardContainerComponent,
    SimpleEasyLanguageFabComponent,
    TableOfContentsFabComponent,
    FabStackComponent,
    ContentVisualSnippetComponent,
    ContentMarqueeComponent,
    CursorGlowDirective,
  ],
  template: `
    <div class="vibecore-home">
      <app-page-header [title]="site.name" subtitleKey="home.hero.subtitle"></app-page-header>

      <!-- Template bridge (dev builds only): tells first-time kit users that
           everything on this page is a template and how to make it theirs.
           Deliberately workshop-scoped — a deployed production site never
           shows it, so nobody has to remember to remove it. -->
      @if (isDevBuild) {
        <aside class="template-bridge" role="note">
          <i class="pi pi-wrench" aria-hidden="true"></i>
          <p>{{ translate('home.templateBridge.text') }}</p>
        </aside>
      }

      <!-- AI Translation Notice - Only shown for non-DE/EN languages. Placed first
           (even before Quick Start) so non-native readers see the caveat immediately. -->
      @if (showTranslationNotice()) {
        <app-standard-container
          id="translation-notice"
          [config]="{
            titleKey: 'home.translationNotice.title',
            type: 'warning',
            icon: 'pi pi-info-circle',
            headingLevel: 2,
          }"
        >
          <p class="translation-notice-text">{{ translate('home.translationNotice.text') }}</p>
        </app-standard-container>
      }

      <!-- Quick Start Section: 4 curated entry points (above the broader showcase) -->
      <section id="quick-start" class="quick-start-section" aria-labelledby="quick-start-heading">
        <h2 id="quick-start-heading" class="quick-start-title">{{ translate('home.quickStart.title') }}</h2>
        <p class="quick-start-subtitle">{{ translate('home.quickStart.subtitle') }}</p>
        <div class="quick-start-grid">
          @for (item of quickStartItems; track item.id) {
            <a
              class="quick-start-card"
              [routerLink]="item.route"
              [fragment]="item.fragment"
              appCursorGlow
              [style.--qs-accent]="item.accent"
              [style.--cursor-glow-color]="item.accent"
              [attr.aria-label]="translate(item.titleKey) + ' — ' + translate(item.ctaKey)"
            >
              <div class="quick-start-visual" aria-hidden="true">
                <app-content-visual-snippet [type]="item.visualType" size="md" />
              </div>
              <h3 class="quick-start-card-title">{{ translate(item.titleKey) }}</h3>
              <p class="quick-start-card-description">{{ translate(item.descriptionKey) }}</p>
              <span class="quick-start-cta">
                {{ translate(item.ctaKey) }}
                <i class="pi pi-arrow-right" aria-hidden="true"></i>
              </span>
            </a>
          }
        </div>
      </section>

      <!-- Endlos-Band: alle freigeschalteten Inhalte (Bild + Titel), getaktet
           durchlaufend. In einer Box wie die übrigen (kein Full-Bleed).
           Self-contained + client-only (s. ContentMarqueeComponent). -->
      <app-content-marquee />

      <!-- Navigation / Quick-navigation Section -->
      <section id="navigation" class="page-panel" aria-labelledby="navigation-heading">
        <h2 id="navigation-heading" class="page-panel-title">{{ translate('home.navigation.title') }}</h2>
        <div class="navigation-explanation">
          <p>{{ translate('home.navigation.bookIntegration') }}</p>
          <p>{{ translate('home.navigation.searchFeature') }}</p>

          @if (navigationExamples().length) {
            <div class="navigation-examples">
              <h3>{{ translate('home.navigation.examplesTitle') }}</h3>
              <div class="example-grid">
                @for (example of navigationExamples(); track trackByPageId($index, example); let i = $index) {
                  <a
                    class="example-item"
                    [routerLink]="example.route"
                    appCursorGlow
                    [style.--cursor-glow-color]="getExampleGlowColor(i)"
                  >
                    <div class="example-id">
                      <code>{{ example.pageId }}</code>
                    </div>
                    <div class="example-content">
                      <i [class]="example.icon" class="example-icon" [attr.aria-hidden]="true"></i>
                      <span>{{ example.title }}</span>
                      <i class="pi pi-arrow-right" [attr.aria-hidden]="true"></i>
                    </div>
                  </a>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Content Showcase Section (only while at least one of its features is on) -->
      @if (filteredShowcaseItems().length) {
        <section id="showcase" class="showcase-section">
          <h2 class="showcase-title">{{ translate('home.showcase.title') }}</h2>

          @for (item of filteredShowcaseItems(); track item.id) {
            <div
              class="showcase-row"
              role="article"
              [attr.aria-labelledby]="'showcase-title-' + item.id"
              appCursorGlow
              [style.--cursor-glow-color]="getShowcaseGlowColor(item)"
            >
              <h3 class="showcase-item-title" [id]="'showcase-title-' + item.id">{{ translate(item.titleKey) }}</h3>
              <p class="showcase-item-description">{{ translate(item.descriptionKey) }}</p>
              <!-- Real link (not a button): navigation must keep middle-click,
                 open-in-new-tab and copy-link working. pButton directive keeps
                 the outlined-button styling on the anchor. -->
              <a
                pButton
                [routerLink]="item.route"
                [queryParams]="item.queryParams || {}"
                class="showcase-cta p-button-outlined"
                ><i class="pi pi-arrow-right" pButtonIcon aria-hidden="true"></i
                ><span pButtonLabel>{{ translate(item.ctaKey) }}</span>
              </a>
              <app-content-visual-snippet [type]="item.visualType" size="md" aria-hidden="true" />
            </div>
          }
        </section>
      }

      <!-- FAB Stack: Table of Contents & Easy Language -->
      <app-fab-stack>
        <app-table-of-contents-fab [items]="tocItems()" [title]="translate('home.tableOfContents')">
        </app-table-of-contents-fab>

        <app-simple-easy-language-fab contentId="home" contentType="article"> </app-simple-easy-language-fab>
      </app-fab-stack>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-home .vibecore-home {
        min-height: 100vh;
        max-width: var(--container-page);
        margin: 0 auto;
        padding: 0 1rem;
      }

      app-home .translation-notice-text {
        margin: 0;
        line-height: 1.6;
        color: var(--text-color-secondary);
      }

      /* ===== TEMPLATE BRIDGE (dev builds only) ===== */
      app-home .template-bridge {
        display: flex;
        align-items: baseline;
        gap: 0.75rem;
        max-width: 46rem;
        margin: 0 auto 1.5rem auto;
        padding: 0.75rem 1.25rem;
        border: 1px dashed var(--surface-border);
        border-radius: 0.75rem;
        background: var(--surface-section);
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.55;
      }

      app-home .template-bridge i {
        color: var(--primary-color-fg);
        font-size: 0.9rem;
        flex-shrink: 0;
      }

      app-home .template-bridge p {
        margin: 0;
      }

      /* ===== SHARED PAGE-PANEL — Quick-Start, Navigation ===== */
      app-home .quick-start-section,
      app-home .page-panel {
        margin: 1.5rem 0 2.5rem 0;
        padding: 2rem 1.5rem 2.25rem 1.5rem;
        border-radius: 1.25rem;
        background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-section) 100%);
        border: 1px solid var(--surface-border);
      }

      app-home .quick-start-title,
      app-home .page-panel-title {
        font-size: 1.875rem;
        font-weight: 800;
        color: var(--text-color);
        text-align: center;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.01em;
      }

      app-home .quick-start-subtitle {
        font-size: 1rem;
        color: var(--text-color-secondary);
        text-align: center;
        margin: 0 0 2rem 0;
      }

      app-home .quick-start-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.25rem;
      }

      app-home .quick-start-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.75rem;
        padding: 1.5rem 1rem 1.75rem 1rem;
        background: var(--surface-card);
        border-radius: 1rem;
        border: 2px solid transparent;
        text-decoration: none;
        color: var(--text-color);
        transition:
          box-shadow 0.25s ease,
          border-color 0.25s ease;
        position: relative;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }

      app-home .quick-start-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, transparent 40%, var(--qs-accent, var(--primary-color)));
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      app-home .quick-start-card:hover {
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.12);
        border-color: var(--qs-accent, var(--primary-color));
        text-decoration: none;
        color: var(--text-color);
      }

      app-home .quick-start-card:hover::before {
        opacity: 0.05;
      }

      app-home .quick-start-card:visited {
        color: var(--text-color);
      }

      app-home .quick-start-card:focus-visible {
        outline: 3px solid var(--primary-color-fg);
        outline-offset: 3px;
      }

      app-home .quick-start-visual {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 130px;
      }

      app-home .quick-start-card-title {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-color);
        line-height: 1.3;
      }

      app-home .quick-start-card-description {
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
        margin: 0;
        flex: 1;
      }

      app-home .quick-start-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: var(--qs-accent, var(--primary-color));
        color: #fff;
        border-radius: 999px;
        font-weight: 700;
        font-size: 0.95rem;
        letter-spacing: 0.01em;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        white-space: nowrap;
      }

      app-home .quick-start-cta i {
        font-size: 0.85rem;
      }

      /* ===== SHOWCASE SECTION ===== */
      app-home .showcase-section {
        margin: 2rem 0 3rem 0;
      }

      app-home .showcase-title {
        font-size: 1.75rem;
        font-weight: bold;
        color: var(--text-color);
        text-align: center;
        margin: 0 0 1.5rem 0;
      }

      app-home .showcase-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          'title  visual'
          'desc   visual'
          'cta    visual';
        align-items: start;
        column-gap: 2rem;
        margin-bottom: 1.5rem;
        padding: 1.5rem 1.5rem 1.75rem 1.5rem;
        border-radius: 1.25rem;
        background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-section) 100%);
        border: 1px solid var(--surface-border);
        transition: box-shadow 0.3s ease;
      }

      app-home .showcase-row > .showcase-item-title {
        grid-area: title;
        font-size: 1.375rem;
        font-weight: 700;
        color: var(--text-color);
        margin: 0 0 0.75rem 0;
        line-height: 1.3;
      }

      app-home .showcase-row > .showcase-item-description {
        grid-area: desc;
        font-size: 0.95rem;
        color: var(--text-color-secondary);
        line-height: 1.6;
        margin: 0 0 1.25rem 0;
      }

      app-home .showcase-row > .showcase-cta {
        grid-area: cta;
        align-self: start;
        justify-self: start;
        text-decoration: none;
      }

      app-home .showcase-row > app-content-visual-snippet {
        grid-area: visual;
        align-self: center;
      }

      app-home .showcase-cta {
        font-weight: 600;
      }

      /* ===== NAVIGATION HELP ===== */
      app-home .navigation-explanation {
        line-height: 1.6;
      }

      app-home .example-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      app-home .example-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface-card);
        border-radius: 0.5rem;
        border: 1px solid var(--surface-border);
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        color: var(--text-color);
      }

      app-home .example-item:hover {
        background: var(--surface-hover);
        box-shadow: var(--shadow-2);
        text-decoration: none;
        color: var(--text-color);
      }

      app-home .example-item:visited {
        color: var(--text-color);
      }

      app-home .example-item:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-home .example-id {
        flex-shrink: 0;
        padding: 0.5rem;
        /* --surface-card, not --surface-100: --primary-color-fg is contrast-gated on
           card and ground only, and on --surface-100 the default accent measured 4.1:1. */
        background: var(--surface-card);
        border-radius: 0.25rem;
        border: 1px solid var(--surface-border);
      }

      app-home .example-id code {
        font-family: 'Courier New', monospace;
        font-weight: bold;
        color: var(--primary-color-fg);
        font-size: 0.875rem;
      }

      app-home .example-content {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      app-home .example-icon {
        color: var(--primary-color-fg);
        font-size: 1.25rem;
      }

      /* ===== RESPONSIVE ===== */
      /* Quick-Start grid: with exactly 4 tiles, skip the 3-col layout (would leave
       a lonely 4th tile in row 2). Symmetric jumps only: 4 → 2x2 → 1.
       4 cols ≥ 1280  ·  2 cols (2x2) 640–1279  ·  1 col < 640 */
      @media (max-width: 1279px) {
        app-home .quick-start-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 639px) {
        app-home .quick-start-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        app-home .quick-start-section {
          padding: 1.5rem 1rem 1.75rem 1rem;
        }
        app-home .quick-start-title {
          font-size: 1.5rem;
        }
      }

      /* Tablet & below: stack + center, but buttons keep their natural width */
      @media (max-width: 900px) {
        app-home .showcase-row {
          grid-template-columns: minmax(0, 1fr);
          grid-template-areas:
            'title'
            'desc'
            'visual'
            'cta';
          row-gap: 1.5rem;
          padding: 1.25rem;
          text-align: center;
        }

        app-home .showcase-row > .showcase-item-title,
        app-home .showcase-row > .showcase-item-description {
          margin-bottom: 0;
        }

        app-home .showcase-row > .showcase-cta {
          justify-self: center;
        }

        app-home .showcase-row > app-content-visual-snippet {
          justify-self: center;
        }

        app-home .showcase-row > .showcase-item-title {
          font-size: 1.25rem;
        }

        app-home .example-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 768px) {
        app-home .vibecore-home {
          padding: 0 0.5rem;
        }
      }

      /* Small phones: CTAs go full-width (centered container, so visually centered) */
      @media (max-width: 480px) {
        app-home .vibecore-home {
          padding: 0 0.25rem;
        }

        app-home .showcase-row {
          padding: 1rem;
          margin-bottom: 2rem;
        }

        app-home .showcase-row > .showcase-cta {
          display: flex;
          justify-content: center;
          width: 100%;
        }
      }

      /* HUB-4: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        app-home .showcase-row,
        app-home .example-item,
        app-home .quick-start-card,
        app-home .quick-start-card::before {
          transition: none;
        }
      }
    `,
  ],
})
export class HomeComponent {
  private translationService = inject(TranslationService);
  /** The site's name is the hero heading (src/config/site.json). */
  readonly site = inject(SITE_CONFIG);
  private cdr = inject(ChangeDetectorRef);

  /** Template-bridge note is workshop-only: never rendered in prod builds. */
  protected readonly isDevBuild = !environment.production;

  navigationExamples = computed(() => this.initializeNavigationExamples());

  tocItems = computed<TocItem[]>(() => {
    // Reactive dependency: recompute labels on every language switch.
    void this.translationService.currentLanguage;
    return [
      {
        id: 'hero',
        label: this.translate('home.toc.hero'),
        icon: 'pi pi-home',
      },
      {
        id: 'quick-start',
        label: this.translate('home.toc.quickStart'),
        icon: 'pi pi-bolt',
      },
      {
        id: 'navigation',
        label: this.translate('home.toc.navigation'),
        icon: 'pi pi-compass',
      },
      {
        id: 'showcase',
        label: this.translate('home.toc.showcase'),
        icon: 'pi pi-th-large',
      },
    ].filter((entry) => entry.id !== 'showcase' || this.filteredShowcaseItems().length > 0);
  });

  // Fixed 700-shade hex values for CTA backgrounds: theme-stable + WCAG AA on white text.
  // blue-700 #1d4ed8 → 6.70:1 · green-700 #15803d → 5.02:1 ·
  // cyan-700 #0e7490 → 5.36:1 · orange-700 (peach) #c2410c → 5.18:1, all AA.
  // Only the cards of features that are on (site.json); the article card always stays.
  quickStartItems: QuickStartItem[] = (
    [
      {
        id: 'qs-evolution',
        titleKey: 'home.quickStart.evolution.title',
        descriptionKey: 'home.quickStart.evolution.description',
        ctaKey: 'home.quickStart.evolution.cta',
        route: '/example-demo',
        visualType: 'qs-evolution-genetic',
        accent: '#1d4ed8',
      },
      {
        id: 'qs-glossary',
        titleKey: 'home.quickStart.glossary.title',
        descriptionKey: 'home.quickStart.glossary.description',
        ctaKey: 'home.quickStart.glossary.cta',
        route: '/glossary',
        fragment: 'seed-term-1',
        visualType: 'qs-glossary-term',
        accent: '#15803d',
      },
      {
        id: 'qs-timeline',
        titleKey: 'home.quickStart.timeline.title',
        descriptionKey: 'home.quickStart.timeline.description',
        ctaKey: 'home.quickStart.timeline.cta',
        route: '/ai-timeline',
        fragment: 'seed-event-1',
        visualType: 'qs-timeline-event',
        accent: '#0e7490',
      },
      {
        id: 'qs-prompting',
        titleKey: 'home.quickStart.prompting.title',
        descriptionKey: 'home.quickStart.prompting.description',
        ctaKey: 'home.quickStart.prompting.cta',
        route: '/articles/seed-article-1',
        visualType: 'qs-prompting-race',
        accent: '#c2410c',
      },
    ] satisfies QuickStartItem[]
  ).filter((item) => this.isOn(item));

  showcaseItems: ShowcaseItem[] = [
    {
      id: 'learning-paths',
      titleKey: 'home.showcase.learningPaths.title',
      descriptionKey: 'home.showcase.learningPaths.description',
      ctaKey: 'home.showcase.learningPaths.cta',
      route: '/learn',
      queryParams: { view: 'paths' },
      visualType: 'learningPaths',
    },
    {
      id: 'demos',
      titleKey: 'home.showcase.demos.title',
      descriptionKey: 'home.showcase.demos.description',
      ctaKey: 'home.showcase.demos.cta',
      route: '/learn',
      features: ['demos'],
      queryParams: { view: 'content', type: 'demo' },
      visualType: 'demos',
    },
    {
      id: 'glossary',
      titleKey: 'home.showcase.glossary.title',
      descriptionKey: 'home.showcase.glossary.description',
      ctaKey: 'home.showcase.glossary.cta',
      route: '/glossary',
      visualType: 'glossary',
    },
    {
      id: 'timeline',
      titleKey: 'home.showcase.timeline.title',
      descriptionKey: 'home.showcase.timeline.description',
      ctaKey: 'home.showcase.timeline.cta',
      route: '/ai-timeline',
      visualType: 'timeline',
    },
    {
      id: 'tools',
      titleKey: 'home.showcase.tools.title',
      descriptionKey: 'home.showcase.tools.description',
      ctaKey: 'home.showcase.tools.cta',
      route: '/catalog',
      visualType: 'tools',
    },
    {
      id: 'roadmap',
      titleKey: 'home.showcase.roadmap.title',
      descriptionKey: 'home.showcase.roadmap.description',
      ctaKey: 'home.showcase.roadmap.cta',
      route: '/roadmap',
      visualType: 'roadmap',
    },
    {
      id: 'lessons',
      titleKey: 'home.showcase.lessons.title',
      descriptionKey: 'home.showcase.lessons.description',
      ctaKey: 'home.showcase.lessons.cta',
      route: '/learn',
      queryParams: { view: 'content', type: 'lesson' },
      visualType: 'lessons',
    },
    {
      id: 'sources',
      titleKey: 'home.showcase.sources.title',
      descriptionKey: 'home.showcase.sources.description',
      ctaKey: 'home.showcase.sources.cta',
      route: '/sources',
      visualType: 'sources',
    },
  ];

  // Rotating glow colors for the quick-navigation example tiles.
  private readonly exampleGlowColors = ['var(--p-blue-500)', 'var(--p-orange-500)', 'var(--p-teal-500)'];
  getExampleGlowColor(index: number): string {
    return this.exampleGlowColors[index % this.exampleGlowColors.length];
  }

  getShowcaseGlowColor(item: ShowcaseItem): string {
    const map: Record<string, string> = {
      learningPaths: 'var(--semantic-cyan-fg)',
      demos: 'var(--semantic-blue-fg)',
      lessons: 'var(--semantic-green-fg)',
      tools: 'var(--semantic-orange-fg)',
      timeline: 'var(--p-yellow-500)',
      glossary: 'var(--p-slate-500)',
      sources: 'var(--p-rose-500)',
      roadmap: 'var(--p-teal-500)',
    };
    return map[item.visualType] ?? 'var(--primary-color)';
  }

  /** Showcase items rendered on the home page: those of features that are on. */
  filteredShowcaseItems = computed(() => this.showcaseItems.filter((item) => this.isOn(item)));

  private initializeNavigationExamples(): NavigationExample[] {
    return [
      {
        title: this.translationService.translate('exampleDemo.title'),
        description: this.translationService.translate('home.navigation.examples.exampleDemo'),
        pageId: 'sdmo',
        route: '/example-demo',
        icon: 'pi pi-play',
      },
      {
        title: this.translationService.translate('app.nav.catalog'),
        description: this.translationService.translate('home.navigation.examples.tools'),
        pageId: 'ctlg',
        route: '/catalog',
        icon: 'pi pi-th-large',
      },
    ].filter((example) => this.isOn(example));
  }

  /** Is the card's route on, and every feature it names? (site.json feature switches) */
  private isOn(item: FeatureBound): boolean {
    return this.site.isRouteOn(item.route) && (item.features ?? []).every((id) => this.site.isFeatureOn(id));
  }

  constructor() {
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  showTranslationNotice(): boolean {
    const lang = this.translationService.currentLanguage;
    const excludedLanguages = ['de', 'de-easy', 'en', 'en-easy'];
    return !excludedLanguages.includes(lang);
  }

  trackByPageId(_index: number, item: { pageId: string }): string {
    return item.pageId;
  }
}
