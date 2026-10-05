import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  PLATFORM_ID,
  TemplateRef,
  afterNextRender,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SelectModule } from '@openng/optimus-ui/select';
import { ButtonModule } from '@openng/optimus-ui/button';
import { marked } from 'marked';
import { TranslationService } from '../../services/translation.service';

import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';
import { findArticle, localizedGuide, ArticleRegistryEntry } from './article-registry';
import { LANGUAGE_RULES } from '../../../config/languages';
import { buildSwitchGroups, resolveSwitchRoute, guideSwitchValue } from '../switch-options';
import { VIBE_DEV_SENTINEL } from '../dev-sentinel';
import { ScrollRegionWatcher } from './scroll-regions';

/**
 * The canonical tab order for every guide (SPEC N5, Guides extension). A guide
 * delivers a subset of the content tabs via `*guideTab`; the shell renders only
 * the delivered ones, in THIS order, and always appends the Agent tab last.
 *
 * Six tabs render in the bar: Examples · Usage · Design · Development · I18n ·
 * Agent. Two former tabs folded into their neighbors (sources → end of Usage,
 * the quality checklist → end of Development). `history` is NOT a tab: a guide
 * still projects it via `appGuideTab="history"`, but the shell renders it below
 * the panels as a compact `<details>` footer, not in the tablist.
 */
export type GuideTabId = 'examples' | 'usage' | 'design' | 'development' | 'i18n' | 'history' | 'agent';

const CONTENT_TAB_ORDER: GuideTabId[] = ['examples', 'usage', 'design', 'development', 'i18n'];

/**
 * Marker on a `<ng-template appGuideTab="usage">…</ng-template>` in a guide
 * article. The shell collects these via `contentChildren`, so an article
 * declares its tab content declaratively and the shell owns the chrome (tablist,
 * keyboard nav, ordering, the always-present Agent tab). Selector is `app`-
 * prefixed per the kit's directive-selector lint rule.
 */
@Directive({ selector: '[appGuideTab]', standalone: true })
export class GuideTabDirective {
  @Input('appGuideTab') tabId!: GuideTabId;
  readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}

type DocState = { status: 'loading' } | { status: 'loaded'; html: string } | { status: 'error'; detail: string };

/**
 * article-shell — ONE dynamic template for every guide article (SPEC N5, Guides
 * extension).
 *
 * A guide component renders `<app-guide-shell [entryId]="'button'">` and projects
 * its tab bodies as `<ng-template *guideTab="'examples'">…`. The shell provides:
 *   - the page header (title from the registry entry),
 *   - a controls toolbar that is a VISUAL TWIN of the component detail page's
 *     `.detail-toolbar` — outlined back-button (→ /dev/design) left, meta chips
 *     centered (category chip amber, tag chips neutral), the shared grouped
 *     quick-switch `p-select` right (components AND guide categories, from
 *     `switch-options.ts`),
 *   - a tablist (role/tab + arrow-key nav, mirroring the detail page) in the
 *     canonical order, rendering only delivered content tabs, Agent always last,
 *   - a `history` footer: a guide's `appGuideTab="history"` template is NOT a
 *     tab — the shell renders it under the panels as a compact `<details>`,
 *   - the Agent tab: fetches `agentDocPath`, strips frontmatter, renders the
 *     Markdown via `marked` bound through `[innerHTML]` (default DomSanitizer —
 *     no bypassSecurityTrust), plus a hint that agents get the same file from
 *     `node scripts/design-guides.mjs show <id>`.
 *
 * SSR: `navigator`/`document` touches are guarded; the doc fetch runs through
 * HttpClient (SSR-safe). The `sentinel` binding keeps VIBE_DEV_SENTINEL
 * referenced so the strip-proof literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-guide-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    RouterLink,
    FormsModule,
    SelectModule,
    ButtonModule,
    PageHeaderComponent,
    CursorGlowDirective,
  ],
  template: `
    <div class="guide" [attr.data-dev-sentinel]="sentinel">
      @if (entry(); as e) {
        <app-page-header [title]="display().title">
          <p class="guide__summary">{{ display().summary }}</p>
        </app-page-header>

        <!-- Controls toolbar — visual twin of the component detail toolbar. -->
        <div class="guide__controls">
          <div class="detail-toolbar" appCursorGlow>
            <div class="detail-toolbar__nav">
              <button
                pButton
                type="button"
                [outlined]="true"
                size="small"
                (click)="backToGallery()"
                class="detail-toolbar__back"
                [attr.aria-label]="labels().backToGallery"
              >
                <i class="pi pi-arrow-left" pButtonIcon aria-hidden="true"></i
                ><span pButtonLabel>{{ labels().backToGallery }}</span>
              </button>
            </div>
            <div class="detail-toolbar__meta">
              <span class="meta-chip meta-chip--group">
                <i class="pi pi-book" aria-hidden="true"></i>
                {{ categoryLabel() }}
              </span>
              @for (tag of e.tags; track tag) {
                <span class="meta-chip">{{ tag }}</span>
              }
            </div>
            <div class="detail-toolbar__switch">
              <!-- The name MUST come from [ariaLabelledBy]: p-select's focusable element is
                   a <span role="combobox">, and <label for> only binds to labelable
                   elements — see the Select guide's naming table. -->
              <span class="sr-only" id="guide-quick-switch-label">
                {{ labels().quickSwitchLabel }}
              </span>
              <p-select
                inputId="guide-quick-switch"
                [ariaLabelledBy]="'guide-quick-switch-label'"
                size="small"
                [options]="switchGroups()"
                [group]="true"
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionLabel="label"
                optionValue="value"
                [filter]="true"
                filterBy="label,search"
                [filterPlaceholder]="labels().quickSwitchFilterPlaceholder"
                [ariaFilterLabel]="labels().quickSwitchFilterPlaceholder"
                [emptyFilterMessage]="labels().quickSwitchEmpty"
                [placeholder]="labels().quickSwitchPlaceholder"
                [ngModel]="currentSwitchValue()"
                (onChange)="onQuickSwitch($event.value)"
              />
            </div>
          </div>
        </div>

        <!-- Related guides — above the tabs, because "which guide am I actually
             in?" is a question a reader has BEFORE reading, not after. Each card
             carries the target's registry summary (single source: the same
             sentence the gallery and the CLI show), so the neighborhood can be
             judged without a round-trip. Forward-ref ids (planned: targets and
             guides not built yet) resolve to nothing and are skipped. -->
        @if (relatedGuides().length) {
          <nav class="guide__related" [attr.aria-label]="labels().relatedTitle">
            <h2 class="guide__related-title">{{ labels().relatedTitle }}</h2>
            <ul class="guide__related-list">
              @for (r of relatedGuides(); track r.id) {
                <li>
                  <a class="guide__related-card" [routerLink]="['/dev/design/guide', r.id]">
                    <span class="guide__related-name">{{ r.title }}</span>
                    <span class="guide__related-summary">{{ r.summary }}</span>
                  </a>
                </li>
              }
            </ul>
          </nav>
        }

        <section class="guide__tabs" [attr.aria-label]="labels().docsAriaLabel">
          <div class="tabs__bar" role="tablist" [attr.aria-label]="labels().docsAriaLabel">
            @for (t of tabs(); track t.id) {
              <button
                type="button"
                class="tabs__tab"
                role="tab"
                [id]="'guide-tab-' + t.id"
                [attr.aria-selected]="effectiveTab() === t.id"
                [attr.aria-controls]="'guide-panel-' + t.id"
                [attr.tabindex]="effectiveTab() === t.id ? 0 : -1"
                [class.tabs__tab--active]="effectiveTab() === t.id"
                (click)="activeTab.set(t.id)"
                (keydown)="onTabKeydown($event, t.id)"
              >
                {{ t.label }}
              </button>
            }
          </div>

          @for (t of contentTabs(); track t.id) {
            <div
              class="tabs__panel"
              role="tabpanel"
              tabindex="0"
              [id]="'guide-panel-' + t.id"
              [attr.aria-labelledby]="'guide-tab-' + t.id"
              [hidden]="effectiveTab() !== t.id"
            >
              <ng-container [ngTemplateOutlet]="t.template" />
            </div>
          }

          <!-- Agent tab — always present, rendered by the shell. -->
          <div
            class="tabs__panel"
            role="tabpanel"
            tabindex="0"
            id="guide-panel-agent"
            aria-labelledby="guide-tab-agent"
            [hidden]="effectiveTab() !== 'agent'"
          >
            <p class="guide__agent-hint" role="note">
              <i class="pi pi-bolt" aria-hidden="true"></i>
              <span
                >{{ agentHint() }} <code>node scripts/design-guides.mjs show {{ e.id }}</code></span
              >
            </p>
            <!-- The agent doc is the contract for AI agents and stays English (ADR-0018);
                 a German reader is told so instead of meeting it unannounced. -->
            @if (isGerman()) {
              <p class="guide__agent-hint" role="note">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span>{{ agentLanguageNote() }}</span>
              </p>
            }
            @switch (doc().status) {
              @case ('loading') {
                <p class="tabs__muted">{{ labels().loading }}</p>
              }
              @case ('error') {
                <p class="tabs__error" role="alert">{{ errorMessage() }}</p>
              }
              @case ('loaded') {
                <!-- English text inside a German page: lang="en" for screen readers (SC 3.1.2). -->
                <div class="markdown" [attr.lang]="isGerman() ? 'en' : null" [innerHTML]="agentHtml()"></div>
              }
            }
          </div>
        </section>

        @if (historyTemplate(); as tpl) {
          <details class="guide__history">
            <summary>{{ historyLabel() }}</summary>
            <div class="guide__history-body">
              <ng-container [ngTemplateOutlet]="tpl" />
            </div>
          </details>
        }
      } @else {
        <app-page-header [title]="labels().notFoundTitle">
          <p class="guide__missing-note">
            {{ labels().notFoundNote }} <code>{{ entryId() }}</code>
          </p>
        </app-page-header>
      }
    </div>
  `,
  styles: [
    `
      .guide {
        max-width: var(--container-demo);
        margin: 0 auto;
        padding: 0 1.5rem 1.5rem;
      }
      .guide__summary {
        margin: var(--space-3) 0 0;
        max-width: 46rem;
        line-height: 1.6;
        color: var(--text-color-secondary);
      }
      .guide__controls {
        margin: 0 0 var(--space-6);
      }
      /* Toolbar — same shape as dev-design-detail's .detail-toolbar. */
      .detail-toolbar {
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
      .detail-toolbar__nav {
        flex-shrink: 0;
      }
      .detail-toolbar__back {
        font-size: 0.9rem;
      }
      .detail-toolbar__meta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-2);
        flex: 1;
        flex-wrap: wrap;
        min-width: 0;
      }
      .meta-chip {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-1) var(--space-3);
        background: var(--surface-100);
        color: var(--text-color);
        border: 1px solid var(--surface-200);
        border-radius: 20px;
        font-size: 0.85rem;
        line-height: 1.5;
      }
      .meta-chip i {
        font-size: 0.85rem;
      }
      .meta-chip--group {
        background: var(--primary-100);
        border-color: var(--primary-200);
        color: var(--primary-700);
      }
      .detail-toolbar__switch {
        flex-shrink: 0;
      }
      .detail-toolbar__switch p-select {
        min-width: 16rem;
      }

      @media (max-width: 1100px) {
        .detail-toolbar {
          flex-wrap: wrap;
          row-gap: var(--space-3);
        }
        .detail-toolbar__meta {
          order: 3;
          flex-basis: 100%;
          justify-content: center;
        }
      }
      @media (max-width: 768px) {
        .detail-toolbar {
          flex-direction: column;
          align-items: stretch;
          gap: var(--space-3);
          padding: var(--space-3);
        }
        .detail-toolbar__nav {
          order: 1;
          align-self: stretch;
        }
        .detail-toolbar__nav .detail-toolbar__back {
          width: 100%;
          justify-content: center;
        }
        .detail-toolbar__meta {
          order: 2;
          flex-basis: auto;
          justify-content: center;
        }
        .detail-toolbar__switch {
          order: 3;
        }
        .detail-toolbar__switch p-select {
          width: 100%;
          min-width: 0;
        }
      }

      .tabs__bar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        border-bottom: 1px solid var(--surface-border);
        margin-bottom: var(--space-4);
      }
      .tabs__tab {
        appearance: none;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        padding: 0.6rem 0.9rem;
        font-family: inherit;
        font-size: 0.95rem;
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        cursor: pointer;
        transition:
          color 0.15s ease,
          border-color 0.15s ease;
      }
      .tabs__tab:hover {
        color: var(--text-color);
      }
      .tabs__tab--active {
        color: var(--primary-color-fg);
        border-bottom-color: var(--primary-color-fg);
      }
      .tabs__tab:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: var(--radius-sm);
      }
      /* The panel is a tab stop (APG: a panel whose content may hold nothing
       focusable must be reachable), so it needs the same ring as the tabs —
       the UA default resolves to near-black and disappears on the dark theme. */
      .tabs__panel:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: var(--radius-sm);
      }
      /* Code blocks and tables that scroll sideways become focusable groups
       (scroll-regions.ts). They live in the guides' own templates and in the
       rendered agent doc, outside this component's style scope, hence ::ng-deep. */
      :host ::ng-deep [data-scroll-region]:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .guide__agent-hint {
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
        margin: 0 0 var(--space-4);
        max-width: 46rem;
        padding: var(--space-3) var(--space-4);
        border: 1px solid var(--surface-border);
        border-left: 3px solid var(--primary-color-fg);
        border-radius: var(--radius-md);
        background: var(--surface-card);
        color: var(--text-color-secondary);
        line-height: 1.6;
      }
      .guide__agent-hint .pi {
        margin-top: 0.2rem;
        color: var(--primary-color-icon-fg);
      }
      .guide__agent-hint code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      .tabs__muted {
        margin: 0;
        color: var(--text-color-secondary);
        font-style: italic;
      }
      .tabs__error {
        margin: 0;
        padding: var(--space-3) var(--space-4);
        color: var(--semantic-red-fg);
        background: color-mix(in srgb, var(--semantic-red-fg) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--semantic-red-fg) 30%, transparent);
        border-radius: var(--radius-md);
      }
      .markdown {
        line-height: 1.6;
        color: var(--text-color);
      }
      .markdown :is(h1, h2, h3, h4) {
        margin: 1.4rem 0 0.6rem;
        line-height: 1.25;
        color: var(--text-color);
      }
      .markdown h1 {
        font-size: 1.5rem;
      }
      .markdown h2 {
        font-size: 1.25rem;
      }
      .markdown h3 {
        font-size: 1.05rem;
      }
      .markdown p {
        margin: 0 0 0.9rem;
      }
      .markdown ul,
      .markdown ol {
        margin: 0 0 0.9rem;
        padding-left: 1.5rem;
      }
      .markdown li {
        margin: 0.3rem 0;
      }
      .markdown code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      .markdown pre {
        overflow-x: auto;
        padding: var(--space-4);
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
      }
      .markdown pre code {
        background: none;
        padding: 0;
      }
      .markdown a {
        color: var(--primary-color-fg);
      }
      .guide__missing-note {
        margin: 0.75rem 0 0;
        color: var(--text-color-secondary);
        line-height: 1.6;
      }
      .guide__missing-note code {
        font-family: var(--font-mono);
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      .guide__history {
        margin: var(--space-6) 0 0;
        padding-top: var(--space-4);
        border-top: 1px solid var(--surface-border);
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }
      .guide__history > summary {
        cursor: pointer;
        list-style: none;
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .guide__history > summary::-webkit-details-marker {
        display: none;
      }
      .guide__history > summary::before {
        content: '\\203A';
        display: inline-block;
        transition: transform 0.15s ease;
        color: var(--text-color-secondary);
      }
      .guide__history[open] > summary::before {
        transform: rotate(90deg);
      }
      .guide__history > summary:hover {
        color: var(--text-color);
      }
      .guide__history > summary:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: var(--radius-sm);
      }
      /* Related guides — compact cards above the tabs. Title plus the target's
       registry summary; both themes read from surface/text tokens, so neither
       needs a per-theme rule. */
      .guide__related {
        margin: 0 0 var(--space-6);
      }
      .guide__related-title {
        margin: 0 0 var(--space-3);
        font-size: 0.8rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }
      .guide__related-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
        gap: var(--space-3);
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .guide__related-card {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        height: 100%;
        padding: var(--space-3) var(--space-4);
        border: 1px solid var(--surface-border);
        border-left: 3px solid color-mix(in srgb, var(--primary-color) 45%, var(--surface-border));
        border-radius: var(--radius-md);
        background: var(--surface-card);
        text-decoration: none;
        transition:
          border-color 0.15s ease,
          background-color 0.15s ease;
      }
      .guide__related-card:hover {
        border-color: color-mix(in srgb, var(--primary-color) 45%, var(--surface-border));
        background: var(--surface-section);
      }
      .guide__related-card:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .guide__related-name {
        font-size: 0.95rem;
        font-weight: var(--font-weight-medium);
        color: var(--primary-color-fg);
      }
      .guide__related-card:hover .guide__related-name {
        text-decoration: underline;
      }
      .guide__related-summary {
        font-size: 0.82rem;
        line-height: 1.5;
        color: var(--text-color-secondary);
      }
      .guide__history-body {
        margin-top: var(--space-3);
        line-height: 1.6;
      }
      @media (prefers-reduced-motion: reduce) {
        .tabs__tab {
          transition: none;
        }
        .guide__history > summary::before {
          transition: none;
        }
        .guide__related-card {
          transition: none;
        }
      }
    `,
  ],
})
export class GuideShellComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly i18n = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** The article this shell renders, looked up from the registry by id. */
  readonly entryId = input.required<string>();
  readonly entry = computed<ArticleRegistryEntry | undefined>(() => findArticle(this.entryId()));

  /** True while the base language is German (de, de-easy): German titles, the agent-tab note. */
  readonly isGerman = computed(() => LANGUAGE_RULES.baseLanguageOf(this.i18n.currentLanguage$()) === 'de');

  /** This guide's title and summary in the reader's language (registry `titleDe` / `summaryDe` on de). */
  readonly display = computed(() => {
    const e = this.entry();
    return e ? localizedGuide(e, this.i18n.currentLanguage$()) : { title: '', summary: '' };
  });

  /** Projected `*guideTab` templates (declared by the concrete article). */
  private readonly projectedTabs = contentChildren(GuideTabDirective);

  /**
   * Explicit tab choice, if any. `effectiveTab` falls back to the first
   * delivered tab, so a guide without an Examples tab still opens on a real
   * panel — and a stale choice after a guide switch resolves the same way.
   */
  readonly activeTab = signal<GuideTabId | null>(null);

  /** Reactive workshop-chrome labels (recompute on language switch). */
  readonly labels = computed(() => ({
    backToGallery: this.i18n.translate('devWorkshop.detail.backToGallery'),
    docsAriaLabel: this.i18n.translate('devWorkshop.detail.docsAriaLabel'),
    loading: this.i18n.translate('devWorkshop.detail.loading'),
    docError: this.i18n.translate('devWorkshop.detail.docError'),
    quickSwitchLabel: this.i18n.translate('devWorkshop.detail.quickSwitchLabel'),
    quickSwitchPlaceholder: this.i18n.translate('devWorkshop.detail.quickSwitchPlaceholder'),
    quickSwitchFilterPlaceholder: this.i18n.translate('devWorkshop.detail.quickSwitchFilterPlaceholder'),
    quickSwitchEmpty: this.i18n.translate('devWorkshop.detail.quickSwitchEmpty'),
    notFoundTitle: this.i18n.translate('devWorkshop.guides.notFoundTitle'),
    notFoundNote: this.i18n.translate('devWorkshop.guides.notFoundNote'),
    relatedTitle: this.i18n.translate('devWorkshop.guides.relatedTitle'),
  }));

  /** Names of the keyboard-scrollable regions (code blocks, tables). */
  private readonly regionLabels = computed(() => ({
    code: this.i18n.translate('devWorkshop.detail.codeRegion'),
    table: this.i18n.translate('devWorkshop.detail.tableRegion'),
  }));

  constructor() {
    // Every guide's code blocks and wide tables scroll sideways on a phone; the
    // watcher makes each one that overflows a focusable, named group (SC 2.1.1).
    let watcher: ScrollRegionWatcher | undefined;
    afterNextRender(() => {
      if (!this.isBrowser) return;
      watcher = new ScrollRegionWatcher(this.host.nativeElement, (el) =>
        el.tagName === 'PRE' ? this.regionLabels().code : this.regionLabels().table,
      );
      watcher.start();
    });
    effect(() => {
      this.regionLabels();
      watcher?.refresh();
    });
    inject(DestroyRef).onDestroy(() => watcher?.stop());
  }

  readonly agentHint = computed(() => this.i18n.translate('devWorkshop.guides.agentTabHint'));
  readonly agentLanguageNote = computed(() => this.i18n.translate('devWorkshop.guides.agentTabLanguageNote'));

  /** Localized category chip label (amber toolbar chip). */
  readonly categoryLabel = computed(() => {
    const e = this.entry();
    return e ? this.i18n.translate(`devWorkshop.guides.category.${e.category}`) : '';
  });

  /** Shared grouped quick-switch options (components + guide categories). */
  readonly switchGroups = computed(() => buildSwitchGroups(this.i18n));

  /** This guide's own quick-switch value (keeps the p-select selection marked). */
  readonly currentSwitchValue = computed(() => {
    const e = this.entry();
    return e ? guideSwitchValue(e.id) : null;
  });

  /**
   * Sibling guides worth reading next — ONLY the `related` ids that already
   * resolve in the registry. Forward references (an id whose guide is not built
   * yet) are silently skipped, so a chip appears the moment its guide ships.
   */
  readonly relatedGuides = computed<{ id: string; title: string; summary: string }[]>(() => {
    const e = this.entry();
    if (!e) return [];
    const language = this.i18n.currentLanguage$();
    return e.related
      .map((id) => findArticle(id))
      .filter((g): g is ArticleRegistryEntry => g !== undefined)
      .map((g) => ({ id: g.id, ...localizedGuide(g, language) }));
  });

  /**
   * Delivered content tabs in the canonical order — only the `*guideTab`s the
   * article actually projected, never an empty panel. Labels are i18n.
   */
  readonly contentTabs = computed(() => {
    const byId = new Map<GuideTabId, GuideTabDirective>();
    for (const d of this.projectedTabs()) byId.set(d.tabId, d);
    return CONTENT_TAB_ORDER.filter((id) => byId.has(id)).map((id) => ({
      id,
      template: byId.get(id)!.template,
      label: this.i18n.translate(`devWorkshop.guideTabs.${id}`),
    }));
  });

  /**
   * The `history` template, if the article projected one. It is NOT a tab — the
   * shell renders it below the panels as a compact `<details>` footer.
   */
  readonly historyTemplate = computed<TemplateRef<unknown> | null>(() => {
    for (const d of this.projectedTabs()) if (d.tabId === 'history') return d.template;
    return null;
  });

  /** Summary label for the history footer (`guideTabs.history`, e.g. "Verlauf"). */
  readonly historyLabel = computed(() => this.i18n.translate('devWorkshop.guideTabs.history'));

  /** Full tab bar = delivered content tabs + the always-present Agent tab. */
  readonly tabs = computed<{ id: GuideTabId; label: string }[]>(() => [
    ...this.contentTabs().map((t) => ({ id: t.id, label: t.label })),
    { id: 'agent' as GuideTabId, label: this.i18n.translate('devWorkshop.guideTabs.agent') },
  ]);

  /** The tab that actually renders: the explicit choice while it exists, else the first tab. */
  readonly effectiveTab = computed<GuideTabId>(() => {
    const chosen = this.activeTab();
    const tabs = this.tabs();
    return chosen && tabs.some((t) => t.id === chosen) ? chosen : tabs[0].id;
  });

  /**
   * Agent doc fetch, driven reactively off the resolved entry: GET the canonical
   * .md, strip frontmatter, render to HTML. `toObservable(this.entry)` re-runs
   * when the input settles (and on any future re-use of the shell), so there is
   * no reading of an unbound input during construction.
   */
  readonly doc = toSignal(
    toObservable(this.entry).pipe(
      switchMap((e) => {
        if (!e) return of<DocState>({ status: 'error', detail: 'no registry entry' });
        return this.http.get(`/${e.agentDocPath}`, { responseType: 'text' }).pipe(
          map((raw): DocState => ({ status: 'loaded', html: this.render(stripFrontmatter(raw)) })),
          startWith<DocState>({ status: 'loading' }),
          catchError((err) => of<DocState>({ status: 'error', detail: String(err?.status || 'network error') })),
        );
      }),
    ),
    { initialValue: { status: 'loading' } as DocState },
  );

  readonly agentHtml = computed(() => {
    const d = this.doc();
    return d.status === 'loaded' ? d.html : '';
  });

  readonly errorMessage = computed(() => {
    const d = this.doc();
    const e = this.entry();
    return d.status === 'error' ? `${this.labels().docError} ${e?.agentDocPath ?? this.entryId()} (${d.detail})` : '';
  });

  backToGallery(): void {
    void this.router.navigate(['/dev/design']);
  }

  onQuickSwitch(value: string | null): void {
    if (value && value !== this.currentSwitchValue()) {
      void this.router.navigate(resolveSwitchRoute(value));
    }
  }

  onTabKeydown(event: KeyboardEvent, id: GuideTabId): void {
    const tabs = this.tabs();
    const idx = tabs.findIndex((t) => t.id === id);
    let next = idx;
    if (event.key === 'ArrowRight') next = (idx + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    const target = tabs[next].id;
    this.activeTab.set(target);
    if (typeof document !== 'undefined') {
      document.getElementById('guide-tab-' + target)?.focus();
    }
  }

  private render(md: string): string {
    return marked.parse(md, { async: false }) as string;
  }
}

/** Strip a leading YAML frontmatter block (`---\n…\n---`) before rendering. */
function stripFrontmatter(md: string): string {
  const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/.exec(md);
  return m ? md.slice(m[0].length) : md;
}
