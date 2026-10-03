import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SelectModule } from '@openng/optimus-ui/select';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TranslationService } from '../services/translation.service';

// `marked` is imported ONLY from files under src/app/dev/ so it ends up
// EXCLUSIVELY in the lazy dev chunk. The whole src/app/dev/ tree is stripped
// from production (dev.routes.ts -> dev.routes.prod.ts fileReplacement), so
// marked never reaches a prod bundle — the sentinel + prod bundle grep prove it.
import { marked } from 'marked';

import { PageHeaderComponent } from '../components/shared/page-header.component';
import { CursorGlowDirective } from '../directives/cursor-glow.directive';
import { designRegistry, DesignRegistryEntry } from './design-registry';
import { DESIGN_GROUP_DEFS, FALLBACK_GROUP_DEF } from './design-groups';
import { DemoHostComponent, DEMO_SNIPPETS } from './demo-host.component';
import { buildSwitchGroups, resolveSwitchRoute } from './switch-options';
import { VIBE_DEV_SENTINEL } from './dev-sentinel';

type DocState =
  | { status: 'loading' }
  | { status: 'unknown' }
  | { status: 'loaded'; raw: string }
  | { status: 'error'; docPath: string; detail: string };

type Tab = 'example' | 'usage' | 'agent';

/**
 * /dev/design/:slug — per-component detail page (SPEC N5.2, decision D5).
 *
 * ONE TEMPLATE FOR ALL SLUGS: every registry entry renders through the exact
 * same structure — header (name, selector, tags) → component quick-switch →
 * live demo (via DemoHostComponent) → three tabs. There are deliberately NO
 * per-slug conditionals here; anything slug-specific must come from registry
 * metadata or the demo-host `@case`, never from `if (slug === ...)`.
 *
 * QUICK-SWITCH: a grouped, filterable `p-select` (the app's established
 * Optimus UI pattern — see glossary/content-filter; AutoComplete is unused in
 * this codebase) jumps straight to another component's detail route. Options
 * come from the shared `design-groups.ts` derivation (same groups as gallery
 * + agents index) and the filter matches name, selector AND registry tags.
 * On navigation the tab state resets to Example and the doc reload runs
 * through the existing paramMap→switchMap pipe (loading state, no stale doc).
 *
 * The three tabs:
 *   - Example: the exact usage snippet from the demo host, escaped + copyable.
 *   - Usage: the canonical doc's "When to use" / "When not to use" sections only.
 *   - Agent instructions: the FULL canonical .md.
 * Both Usage and Agent render Markdown fetched over HttpClient from the same
 * asset an agent opens on disk (`/${docPath}`).
 *
 * MARKDOWN SANITIZATION: `marked` output is bound via `[innerHTML]`, which runs
 * Angular's default DomSanitizer (SecurityContext.HTML) — scripts, event
 * handlers, and unsafe URLs are stripped. Raw-HTML passthrough
 * (`bypassSecurityTrustHtml`) is deliberately NOT enabled: the docs are
 * first-party assets, but we sanitize anyway as defense in depth.
 *
 * UI CONVENTIONS: `app-page-header` for the <h1>, `--container-*` width, chips
 * and links per app convention (`--primary-color-fg` text tier). Navigation +
 * meta live in a controls toolbar BELOW the page-header that mirrors the
 * article page's `.lesson-toolbar` (lesson-template.component.ts): outlined
 * back-button left, centered meta chips (task group amber, selector as code,
 * registry tags), the quick-switch `p-select` right. No ad-hoc breadcrumbs
 * (see dev-hub.component.ts).
 *
 * i18n: workshop chrome resolves through TranslationService (namespace
 * `devWorkshop`); the canonical docs themselves stay English (agent-canonical).
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking.
 */
@Component({
  selector: 'app-dev-design-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SelectModule, ButtonModule, DemoHostComponent, PageHeaderComponent, CursorGlowDirective],
  template: `
    <div class="detail" [attr.data-dev-sentinel]="sentinel">
      <!-- Kopf: identical for every slug (not-found shares the position). -->
      @if (entry(); as e) {
        <app-page-header [title]="e.name">
          <p class="detail__source">
            {{ labels().sourceLabel }}: <code>{{ e.sourcePath }}</code>
          </p>
        </app-page-header>
      } @else {
        <app-page-header [title]="labels().notFoundTitle">
          <p class="detail__missing-note">
            {{ labels().notFoundNote }} <code>{{ slug() }}</code>
          </p>
        </app-page-header>
      }

      <!-- Controls toolbar — back-button + meta chips + quick-switch, sits
           BELOW the page-header. Mirrors the article page's .lesson-toolbar
           (lesson-template.component.ts); class names are dev-scoped. -->
      <div class="detail__controls">
        <div class="detail-toolbar" appCursorGlow>
          <!-- Back navigation on left -->
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
          <!-- Component meta centered: task group (amber) + selector + tags -->
          <div class="detail-toolbar__meta">
            @if (entry(); as e) {
              <span class="meta-chip meta-chip--group">
                <i class="pi pi-folder" aria-hidden="true"></i>
                {{ groupChip() }}
              </span>
              <code class="meta-chip meta-chip--code">{{ e.selector }}</code>
              @for (tag of e.tags; track tag) {
                <span class="meta-chip">{{ tag }}</span>
              }
            }
          </div>
          <!-- Quick-switch on right: direct jump to any other component. -->
          <div class="detail-toolbar__switch">
            <!-- The name MUST come from [ariaLabelledBy]: p-select's focusable element is a
                 <span role="combobox">, and <label for> only binds to labelable elements —
                 see the Select guide's naming table. -->
            <span class="sr-only" id="component-quick-switch-label">
              {{ labels().quickSwitchLabel }}
            </span>
            <p-select
              inputId="component-quick-switch"
              [ariaLabelledBy]="'component-quick-switch-label'"
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
              [ngModel]="slug()"
              (onChange)="onQuickSwitch($event.value)"
            />
          </div>
        </div>
      </div>

      @if (entry(); as e) {
        <section class="detail__demo" [attr.aria-label]="labels().liveDemo">
          <h2 class="detail__section-title">{{ labels().liveDemo }}</h2>
          <div class="detail__demo-stage">
            <app-demo-host [slug]="e.slug" />
          </div>
        </section>

        <section class="detail__tabs" [attr.aria-label]="labels().docsAriaLabel">
          <div class="tabs__bar" role="tablist" [attr.aria-label]="labels().docsAriaLabel">
            @for (t of tabs(); track t.id) {
              <button
                type="button"
                class="tabs__tab"
                role="tab"
                [id]="'tab-' + t.id"
                [attr.aria-selected]="activeTab() === t.id"
                [attr.aria-controls]="'panel-' + t.id"
                [attr.tabindex]="activeTab() === t.id ? 0 : -1"
                [class.tabs__tab--active]="activeTab() === t.id"
                (click)="activeTab.set(t.id)"
                (keydown)="onTabKeydown($event, t.id)"
              >
                {{ t.label }}
              </button>
            }
          </div>

          <!-- Example -->
          <div
            class="tabs__panel"
            role="tabpanel"
            tabindex="0"
            id="panel-example"
            aria-labelledby="tab-example"
            [hidden]="activeTab() !== 'example'"
          >
            <div class="tabs__panel-head">
              <p class="tabs__panel-note">{{ labels().exampleNote }}</p>
              <button type="button" class="copy-btn" (click)="copySnippet()">
                {{ copied() ? labels().copied : labels().copy }}
              </button>
            </div>
            <!-- A scrollable region: focusable so the keyboard can scroll it (SC 2.1.1). -->
            <pre class="code-block" tabindex="0" role="group" [attr.aria-label]="labels().codeRegion"><code>{{
              snippet()
            }}</code></pre>
          </div>

          <!-- Usage -->
          <div
            class="tabs__panel"
            role="tabpanel"
            tabindex="0"
            id="panel-usage"
            aria-labelledby="tab-usage"
            [hidden]="activeTab() !== 'usage'"
          >
            @switch (doc().status) {
              @case ('loading') {
                <p class="tabs__muted">{{ labels().loading }}</p>
              }
              @case ('error') {
                <p class="tabs__error" role="alert">{{ errorMessage() }}</p>
              }
              @case ('loaded') {
                @if (usageHtml()) {
                  <div class="markdown" [innerHTML]="usageHtml()"></div>
                } @else {
                  <p class="tabs__muted">{{ labels().noUsageSections }}</p>
                }
              }
            }
          </div>

          <!-- Agent instructions -->
          <div
            class="tabs__panel"
            role="tabpanel"
            tabindex="0"
            id="panel-agent"
            aria-labelledby="tab-agent"
            [hidden]="activeTab() !== 'agent'"
          >
            @switch (doc().status) {
              @case ('loading') {
                <p class="tabs__muted">{{ labels().loading }}</p>
              }
              @case ('error') {
                <p class="tabs__error" role="alert">{{ errorMessage() }}</p>
              }
              @case ('loaded') {
                <div class="markdown" [innerHTML]="agentHtml()"></div>
              }
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [
    `
      .detail {
        max-width: var(--container-demo);
        margin: 0 auto;
        padding: 0 1.5rem 1.5rem;
      }
      .detail__source {
        margin: var(--space-3) 0 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .detail__source code {
        font-family: var(--font-mono);
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      /* Controls toolbar — visual twin of the article page's .lesson-toolbar
       (same surface, radius, chip shapes), sits below <app-page-header>. */
      .detail__controls {
        margin: 0 0 var(--space-6);
      }
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
      .meta-chip--code {
        font-family: var(--font-mono);
        color: var(--text-color-secondary);
      }
      .detail-toolbar__switch {
        flex-shrink: 0;
      }
      .detail-toolbar__switch p-select {
        min-width: 16rem;
      }

      /* Wide tablet — meta chips wrap onto their own centered row. */
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

      /* Phone — stack into rows: back | meta | switch (full width). */
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
      .detail__section-title {
        margin: 0 0 var(--space-3);
        font-size: 1.1rem;
        color: var(--text-color);
      }
      .detail__demo {
        margin-bottom: var(--space-8);
      }
      .detail__demo-stage {
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
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
      .tabs__panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-3);
      }
      .tabs__panel-note {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .copy-btn {
        appearance: none;
        flex: 0 0 auto;
        padding: 0.35rem 0.8rem;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: var(--font-weight-medium);
        color: var(--primary-color-fg);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition:
          border-color 0.15s ease,
          background 0.15s ease;
      }
      .copy-btn:hover {
        border-color: var(--primary-color-fg);
      }
      .copy-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .code-block {
        margin: 0;
        padding: var(--space-4);
        overflow-x: auto;
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        font-family: var(--font-mono);
        font-size: 0.82rem;
        line-height: 1.55;
        color: var(--text-color);
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
      .code-block:focus-visible,
      .markdown pre:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .markdown pre code {
        background: none;
        padding: 0;
      }
      .markdown table {
        width: 100%;
        border-collapse: collapse;
        margin: 0 0 1rem;
        font-size: 0.9rem;
      }
      .markdown th,
      .markdown td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
      }
      .markdown a {
        color: var(--primary-color-fg);
      }
      .detail__missing-note {
        margin: 0.75rem 0 0;
        color: var(--text-color-secondary);
        line-height: 1.6;
      }
      .detail__missing-note code {
        font-family: var(--font-mono);
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      @media (prefers-reduced-motion: reduce) {
        .tabs__tab,
        .copy-btn {
          transition: none;
        }
      }
    `,
  ],
})
export class DevDesignDetailComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(TranslationService);

  constructor() {
    // Quick-switch / route change: reset transient view state deterministically
    // (Example tab active, copy feedback cleared). The doc itself reloads via
    // the paramMap→switchMap pipe below, which re-emits 'loading' first — so
    // no stale doc and no error flicker from the previous component.
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(() => {
      this.activeTab.set('example');
      this.copied.set(false);
    });
  }

  /** Reactive workshop-chrome labels (recompute on language switch). */
  readonly labels = computed(() => ({
    backToGallery: this.i18n.translate('devWorkshop.detail.backToGallery'),
    sourceLabel: this.i18n.translate('devWorkshop.detail.sourceLabel'),
    liveDemo: this.i18n.translate('devWorkshop.detail.liveDemo'),
    docsAriaLabel: this.i18n.translate('devWorkshop.detail.docsAriaLabel'),
    exampleNote: this.i18n.translate('devWorkshop.detail.exampleNote'),
    copy: this.i18n.translate('devWorkshop.detail.copy'),
    copied: this.i18n.translate('devWorkshop.detail.copied'),
    codeRegion: this.i18n.translate('devWorkshop.detail.codeRegion'),
    loading: this.i18n.translate('devWorkshop.detail.loading'),
    noUsageSections: this.i18n.translate('devWorkshop.detail.noUsageSections'),
    docError: this.i18n.translate('devWorkshop.detail.docError'),
    notFoundTitle: this.i18n.translate('devWorkshop.detail.notFoundTitle'),
    notFoundNote: this.i18n.translate('devWorkshop.detail.notFoundNote'),
    quickSwitchLabel: this.i18n.translate('devWorkshop.detail.quickSwitchLabel'),
    quickSwitchPlaceholder: this.i18n.translate('devWorkshop.detail.quickSwitchPlaceholder'),
    quickSwitchFilterPlaceholder: this.i18n.translate('devWorkshop.detail.quickSwitchFilterPlaceholder'),
    quickSwitchEmpty: this.i18n.translate('devWorkshop.detail.quickSwitchEmpty'),
  }));

  /**
   * Grouped quick-switch options from the SHARED derivation (switch-options.ts):
   * every component group PLUS every guide-article category. `search` folds
   * selector + tags (components) / tags + category (guides) so
   * `filterBy="label,search"` matches name, selector/tags AND category. The
   * component items keep `value = slug`, so this page's `[ngModel]="slug()"`
   * selection still highlights correctly. Recomputes on language switch.
   */
  readonly switchGroups = computed(() => buildSwitchGroups(this.i18n));

  /**
   * Short label of the task group this component belongs to (amber toolbar
   * chip). Same first-match-wins derivation as design-groups.ts.
   */
  readonly groupChip = computed(() => {
    const e = this.entry();
    if (!e) return '';
    const def = DESIGN_GROUP_DEFS.find((g) => g.tags.some((t) => e.tags.includes(t))) ?? FALLBACK_GROUP_DEF;
    return this.i18n.translate(def.chipKey);
  });

  /** Toolbar back-button → gallery (imperative twin of the old backlink). */
  backToGallery(): void {
    void this.router.navigate(['/dev/design']);
  }

  /**
   * Route jump from the quick-switch. The chosen value is either a component
   * slug or a `guide:<id>` token (shared switch-options.ts); resolveSwitchRoute
   * maps it to the right route. For a same-page component slug the paramMap pipe
   * handles the reload; a guide value navigates to the article route.
   */
  onQuickSwitch(value: string | null): void {
    if (value && value !== this.slug()) {
      void this.router.navigate(resolveSwitchRoute(value));
    }
  }

  /** Tab bar entries (labels reactive to language switch). */
  readonly tabs = computed<{ id: Tab; label: string }[]>(() => [
    { id: 'example', label: this.i18n.translate('devWorkshop.detail.tabExample') },
    { id: 'usage', label: this.i18n.translate('devWorkshop.detail.tabUsage') },
    { id: 'agent', label: this.i18n.translate('devWorkshop.detail.tabAgent') },
  ]);

  readonly activeTab = signal<Tab>('example');
  readonly copied = signal(false);

  readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), {
    initialValue: '',
  });

  readonly entry = computed<DesignRegistryEntry | null>(
    () => designRegistry.find((e) => e.slug === this.slug()) ?? null,
  );

  readonly snippet = computed(() => DEMO_SNIPPETS[this.slug()] ?? '');

  /**
   * Doc fetch driven off the route param: for a known slug, GET its canonical
   * .md as text; unknown slug or fetch error is surfaced as a visible state, not
   * a blank panel.
   */
  readonly doc = toSignal(
    this.route.paramMap.pipe(
      map((p) => p.get('slug') ?? ''),
      switchMap((slug) => {
        const e = designRegistry.find((x) => x.slug === slug);
        if (!e) return of<DocState>({ status: 'unknown' });
        return this.http.get(`/${e.docPath}`, { responseType: 'text' }).pipe(
          map((raw): DocState => ({ status: 'loaded', raw })),
          startWith<DocState>({ status: 'loading' }),
          catchError((err) =>
            of<DocState>({
              status: 'error',
              docPath: e.docPath,
              detail: String(err?.status || 'network error'),
            }),
          ),
        );
      }),
    ),
    { initialValue: { status: 'loading' } as DocState },
  );

  /** Localized chrome + technical detail (path, HTTP status) untranslated. */
  readonly errorMessage = computed(() => {
    const d = this.doc();
    return d.status === 'error' ? `${this.labels().docError} ${d.docPath} (${d.detail})` : '';
  });

  /** Full doc rendered to sanitized HTML (bound via [innerHTML]; see class doc). */
  readonly agentHtml = computed(() => {
    const d = this.doc();
    return d.status === 'loaded' ? this.render(d.raw) : '';
  });

  /** Only the "When to use" / "When not to use" sections, rendered to HTML. */
  readonly usageHtml = computed(() => {
    const d = this.doc();
    if (d.status !== 'loaded') return '';
    const parts = [extractSection(d.raw, 'When to use'), extractSection(d.raw, 'When not to use')].filter(Boolean);
    return parts.length ? this.render(parts.join('\n\n')) : '';
  });

  /**
   * Markdown -> HTML. The string is bound via [innerHTML], so Angular's default
   * DomSanitizer strips anything unsafe. No bypassSecurityTrustHtml is used.
   * Every code block scrolls sideways, so it becomes a focusable, named
   * region the keyboard can scroll (SC 2.1.1); the sanitizer keeps
   * tabindex, role and aria-label.
   */
  private render(md: string): string {
    const html = marked.parse(md, { async: false }) as string;
    const label = this.labels().codeRegion.replace(/"/g, '&quot;');
    return html.replace(/<pre>/g, `<pre tabindex="0" role="group" aria-label="${label}">`);
  }

  // browser-only: keydown handler.
  onTabKeydown(event: KeyboardEvent, id: Tab): void {
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
    const el = document.getElementById('tab-' + target);
    el?.focus();
  }

  copySnippet(): void {
    const text = this.snippet();
    if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1500);
      },
      () => {
        /* clipboard denied — leave the button label unchanged */
      },
    );
  }
}

/**
 * Extract a single `## <heading>` section (heading line + body up to the next
 * `## ` heading) from Markdown. Case-insensitive on the heading text. Returns ''
 * when the heading is absent.
 */
function extractSection(md: string, heading: string): string {
  const lines = md.split(/\r?\n/);
  const target = heading.trim().toLowerCase();
  const out: string[] = [];
  let capturing = false;
  for (const line of lines) {
    const h2 = /^##\s+(.*)$/.exec(line);
    if (h2) {
      if (capturing) break; // next ## ends the captured section
      if (h2[1].trim().toLowerCase() === target) {
        capturing = true;
        out.push(line);
        continue;
      }
    }
    if (capturing) out.push(line);
  }
  return out.join('\n').trim();
}
