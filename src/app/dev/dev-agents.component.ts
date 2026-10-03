import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { PageHeaderComponent } from '../components/shared/page-header.component';
import { designRegistry } from './design-registry';
import { groupDesignEntries } from './design-groups';
import { articleRegistry, groupGuidesByCategory } from './articles/article-registry';
import { VIBE_DEV_SENTINEL } from './dev-sentinel';

/**
 * /dev/agents — the agent entry page (SPEC N5.3, decision D7).
 *
 * A task-oriented index for agents working ON this kit: what the design system
 * is, the one-canonical-doc principle, an index table mapping a concrete task to
 * the component docs worth reading, and the decision loop for adding a new
 * component (which the `/new-component` skill automates).
 *
 * SELF-MAINTAINING INDEX: the task table is DERIVED at runtime from
 * `design-registry.ts` via the shared tag→group map in `design-groups.ts`
 * (plus a guaranteed fallback group), so a new registry entry appears here
 * automatically — no manual table edit. The SAME module drives the gallery
 * sections and the detail quick-switch; only the curated group titles/hints
 * are hand-written (i18n keys under `devWorkshop.groups`).
 *
 * UI CONVENTIONS: `app-page-header` for the <h1>, `--container-*` width,
 * text-tier brand color via `--primary-color-fg`. No ad-hoc breadcrumbs (see
 * dev-hub.component.ts).
 *
 * i18n: workshop chrome resolves through TranslationService (namespace
 * `devWorkshop`). The canonical component docs stay ENGLISH on purpose (one
 * source for humans + agents, no translation drift) — the page says so in a
 * visible note. The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so
 * the strip-proof literal survives tree-shaking (see dev-sentinel.ts).
 */
@Component({
  selector: 'app-dev-agents',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <div class="agents" [attr.data-dev-sentinel]="sentinel">
      <app-page-header titleKey="devWorkshop.agents.title" subtitleKey="devWorkshop.agents.subtitle">
        <p class="agents__badge-row">
          <span class="dev-badge">
            <i class="pi pi-wrench" aria-hidden="true"></i>
            {{ labels().devOnly }}
          </span>
        </p>
      </app-page-header>

      <section class="agents__section" aria-labelledby="orientation-h">
        <h2 class="agents__h2" id="orientation-h">{{ labels().orientationTitle }}</h2>
        <p class="agents__lede">{{ labels().orientationP1 }}</p>
        <dl class="agents__facts">
          <div class="agents__fact">
            <dt>{{ labels().factDocs }}</dt>
            <dd><code>src/assets/design-system/&lt;slug&gt;.md</code></dd>
          </div>
          <div class="agents__fact">
            <dt>{{ labels().factRegistry }}</dt>
            <dd><code>src/app/dev/design-registry.ts</code></dd>
          </div>
          <div class="agents__fact">
            <dt>{{ labels().factGate }}</dt>
            <dd><code>scripts/check-design-system.mjs</code></dd>
          </div>
          <div class="agents__fact">
            <dt>{{ labels().factHub }}</dt>
            <dd><code>docs/DESIGN-SYSTEM.MD</code></dd>
          </div>
          <div class="agents__fact">
            <dt>{{ labels().factGuides }}</dt>
            <dd><code>src/assets/design-system/guides/&lt;id&gt;.agent.md</code></dd>
          </div>
          <div class="agents__fact">
            <dt>{{ labels().factScript }}</dt>
            <dd><code>node scripts/design-guides.mjs</code></dd>
          </div>
        </dl>
        <p class="agents__note-box" role="note">
          <i class="pi pi-language" aria-hidden="true"></i>
          <span>{{ labels().englishNote }}</span>
        </p>
      </section>

      <section class="agents__section" aria-labelledby="index-h">
        <h2 class="agents__h2" id="index-h">{{ labels().indexTitle }}</h2>
        <p class="agents__lede">{{ labels().indexLede }}</p>
        <div class="agents__table-wrap">
          <table class="agents__table">
            <thead>
              <tr>
                <th scope="col">{{ labels().thTask }}</th>
                <th scope="col">{{ labels().thDocs }}</th>
              </tr>
            </thead>
            <tbody>
              @for (group of groups(); track group.id) {
                <tr>
                  <th scope="row" class="agents__task">
                    <span class="agents__task-name">{{ group.title }}</span>
                    <span class="agents__task-hint">{{ group.hint }}</span>
                  </th>
                  <td class="agents__docs">
                    @for (doc of group.docs; track doc.slug) {
                      <a class="agents__doc" [routerLink]="['/dev/design', doc.slug]">{{ doc.slug }}</a>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="agents__summary">
          {{ indexSummary() }}
          <a routerLink="/dev/design">/dev/design</a>
        </p>
      </section>

      <section class="agents__section" aria-labelledby="guides-h">
        <h2 class="agents__h2" id="guides-h">{{ labels().guidesTitle }}</h2>
        <p class="agents__lede">{{ labels().guidesLede }}</p>
        <div class="agents__cli">
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs topics</code>
            <span class="agents__cli-note">{{ labels().cliTopicsNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs list</code>
            <span class="agents__cli-note">{{ labels().cliListNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs list --json</code>
            <span class="agents__cli-note">{{ labels().cliJsonNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs show &lt;id&gt;</code>
            <span class="agents__cli-note">{{ labels().cliShowNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs section &lt;id&gt; "when to use"</code>
            <span class="agents__cli-note">{{ labels().cliSectionNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs sections &lt;heading&gt;</code>
            <span class="agents__cli-note">{{ labels().cliSectionsNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs blocks dodont</code>
            <span class="agents__cli-note">{{ labels().cliBlocksNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs bundle &lt;id&gt;</code>
            <span class="agents__cli-note">{{ labels().cliBundleNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs tab &lt;id&gt; &lt;tab&gt;</code>
            <span class="agents__cli-note">{{ labels().cliTabNote }}</span>
          </div>
          <div class="agents__cli-row">
            <code>node scripts/design-guides.mjs search &lt;term&gt;</code>
            <span class="agents__cli-note">{{ labels().cliSearchNote }}</span>
          </div>
        </div>
        <div class="agents__table-wrap">
          <table class="agents__table">
            <thead>
              <tr>
                <th scope="col">{{ labels().thGuide }}</th>
                <th scope="col">{{ labels().thGuideCat }}</th>
                <th scope="col">{{ labels().thGuideDoc }}</th>
              </tr>
            </thead>
            <tbody>
              @for (cat of guideGroups(); track cat.id) {
                @for (guide of cat.entries; track guide.id) {
                  <tr>
                    <th scope="row" class="agents__task">
                      <span class="agents__task-name">{{ guide.title }}</span>
                      <span class="agents__task-hint">{{ guide.summary }}</span>
                    </th>
                    <td>{{ cat.title }}</td>
                    <td class="agents__docs">
                      <a class="agents__doc" [routerLink]="['/dev/design/guide', guide.id]">{{ guide.id }}</a>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="agents__section" aria-labelledby="loop-h">
        <h2 class="agents__h2" id="loop-h">{{ labels().loopTitle }}</h2>
        <p class="agents__lede">{{ labels().loopLede }}</p>
        <ol class="agents__loop">
          <li>
            <strong>{{ labels().step1Title }}</strong>
            {{ labels().step1Body }}
          </li>
          <li>
            <strong>{{ labels().step2Title }}</strong>
            {{ labels().step2Body }}
            <code>design-registry.exclusions.json</code>
          </li>
          <li>
            <strong>{{ labels().step3Title }}</strong>
            {{ labels().step3Body }}
          </li>
          <li>
            <strong>{{ labels().step4Title }}</strong>
            {{ labels().step4Body }}
            <code>node scripts/check-design-system.mjs</code>
            <code>node scripts/verify-harness.mjs</code>
          </li>
        </ol>
        <p class="agents__cta">{{ labels().ctaBody }}</p>
      </section>
    </div>
  `,
  styles: [`
    .agents {
      max-width: var(--container-section);
      margin: 0 auto;
      padding: 0 1.5rem 1.5rem;
      color: var(--text-color);
    }
    .agents__badge-row { margin: 0.75rem 0 0; }
    .dev-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-card));
      border: 1px solid color-mix(in srgb, var(--primary-color) 30%, var(--surface-border));
      color: var(--text-color);
      font-size: 0.8125rem;
      line-height: 1.2;
    }
    .dev-badge .pi {
      font-size: 0.75rem;
      color: var(--primary-color-icon-fg);
    }
    .agents__section { margin-bottom: var(--space-8); }
    .agents__h2 {
      margin: 0 0 var(--space-3);
      font-family: var(--font-heading);
      font-size: 1.375rem;
      line-height: 1.25;
      color: var(--text-color);
    }
    .agents__lede {
      margin: 0 0 var(--space-4);
      max-width: 46rem;
      line-height: 1.6;
      color: var(--text-color-secondary);
    }
    code {
      font-family: var(--font-mono);
      font-size: 0.85em;
      color: var(--text-color);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-sm);
      padding: 0.1em 0.35em;
    }
    .agents__facts {
      margin: 0 0 var(--space-4);
      display: grid;
      gap: var(--space-2) var(--space-6);
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    }
    .agents__fact {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      padding: var(--space-3);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      background: var(--surface-card);
    }
    .agents__fact dt {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-color);
    }
    .agents__fact dd { margin: 0; }
    .agents__note-box {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      margin: 0;
      max-width: 46rem;
      padding: var(--space-3) var(--space-4);
      border: 1px solid var(--surface-border);
      border-left: 3px solid var(--primary-color-fg);
      border-radius: var(--radius-md);
      background: var(--surface-card);
      color: var(--text-color-secondary);
      line-height: 1.6;
    }
    .agents__note-box .pi {
      margin-top: 0.2rem;
      color: var(--primary-color-icon-fg);
    }
    .agents__cli {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin: 0 0 var(--space-4);
    }
    .agents__cli-row {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: var(--space-2) var(--space-3);
    }
    .agents__cli-row code { flex: 0 0 auto; }
    .agents__cli-note { font-size: 0.8rem; color: var(--text-color-secondary); }
    .agents__table-wrap { overflow-x: auto; }
    .agents__table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
    }
    .agents__table th, .agents__table td {
      text-align: left;
      vertical-align: top;
      padding: var(--space-3);
      border-bottom: 1px solid var(--surface-border);
    }
    .agents__table thead th {
      font-size: 0.72rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-color-secondary);
      border-bottom: 2px solid var(--surface-border);
    }
    .agents__task { min-width: 14rem; font-weight: var(--font-weight-medium); }
    .agents__task-name { display: block; color: var(--text-color); }
    .agents__task-hint {
      display: block;
      margin-top: 0.2rem;
      font-weight: var(--font-weight-normal);
      font-size: 0.8rem;
      color: var(--text-color-secondary);
    }
    .agents__docs { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .agents__doc {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      line-height: 1.4;
      /* The gated accent-surface pair (>= 4.5:1 for every palette and mode);
         --primary-color-fg on a 10% tint measured 4.48:1 in light mode. */
      color: var(--accent-on-surface);
      background: var(--accent-surface);
      border: 1px solid color-mix(in srgb, var(--primary-color) 30%, var(--surface-border));
      border-radius: 999px;
      padding: 0.15rem 0.6rem;
      text-decoration: none;
    }
    .agents__doc:hover { text-decoration: underline; }
    .agents__doc:focus-visible {
      outline: 2px solid var(--primary-color-fg);
      outline-offset: 2px;
    }
    .agents__summary {
      margin: var(--space-3) 0 0;
      font-size: var(--font-size-sm);
      color: var(--text-color-secondary);
    }
    /* Underlined: in running text a link needs a cue beyond colour (SC 1.4.1). */
    .agents__summary a { color: var(--primary-color-fg); text-decoration: underline; text-underline-offset: 2px; }
    .agents__summary a:hover { text-decoration-thickness: 2px; }
    .agents__summary a:focus-visible {
      outline: 2px solid var(--primary-color-fg);
      outline-offset: 2px;
      border-radius: var(--radius-sm);
    }
    .agents__loop {
      margin: 0 0 var(--space-4);
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      max-width: 48rem;
    }
    .agents__loop li { line-height: 1.6; color: var(--text-color-secondary); }
    .agents__loop strong { color: var(--text-color); }
    .agents__cta {
      margin: 0;
      max-width: 48rem;
      padding: var(--space-4);
      border: 1px solid var(--surface-border);
      border-left: 3px solid var(--primary-color-fg);
      border-radius: var(--radius-md);
      background: var(--surface-card);
      color: var(--text-color-secondary);
      line-height: 1.6;
    }
  `],
})
export class DevAgentsComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly i18n = inject(TranslationService);

  /** Total registered components (ground truth: the registry itself). */
  readonly total = designRegistry.length;

  /** Reactive workshop-chrome labels (recompute on language switch). */
  readonly labels = computed(() => ({
    devOnly: this.i18n.translate('devWorkshop.common.devOnlyBadge'),
    orientationTitle: this.i18n.translate('devWorkshop.agents.orientationTitle'),
    orientationP1: this.i18n.translate('devWorkshop.agents.orientationP1'),
    factDocs: this.i18n.translate('devWorkshop.agents.factDocs'),
    factRegistry: this.i18n.translate('devWorkshop.agents.factRegistry'),
    factGate: this.i18n.translate('devWorkshop.agents.factGate'),
    factHub: this.i18n.translate('devWorkshop.agents.factHub'),
    factGuides: this.i18n.translate('devWorkshop.agents.factGuides'),
    factScript: this.i18n.translate('devWorkshop.agents.factScript'),
    guidesTitle: this.i18n.translate('devWorkshop.guides.agentsTitle'),
    guidesLede: this.i18n.translate('devWorkshop.guides.agentsLede'),
    cliTopicsNote: this.i18n.translate('devWorkshop.guides.cliTopicsNote'),
    cliListNote: this.i18n.translate('devWorkshop.guides.cliListNote'),
    cliJsonNote: this.i18n.translate('devWorkshop.guides.cliJsonNote'),
    cliSectionNote: this.i18n.translate('devWorkshop.guides.cliSectionNote'),
    cliSectionsNote: this.i18n.translate('devWorkshop.guides.cliSectionsNote'),
    cliBlocksNote: this.i18n.translate('devWorkshop.guides.cliBlocksNote'),
    cliBundleNote: this.i18n.translate('devWorkshop.guides.cliBundleNote'),
    cliTabNote: this.i18n.translate('devWorkshop.guides.cliTabNote'),
    cliSearchNote: this.i18n.translate('devWorkshop.guides.cliSearchNote'),
    cliShowNote: this.i18n.translate('devWorkshop.guides.cliShowNote'),
    thGuide: this.i18n.translate('devWorkshop.guides.thGuide'),
    thGuideCat: this.i18n.translate('devWorkshop.guides.thGuideCat'),
    thGuideDoc: this.i18n.translate('devWorkshop.guides.thGuideDoc'),
    englishNote: this.i18n.translate('devWorkshop.agents.englishNote'),
    indexTitle: this.i18n.translate('devWorkshop.agents.indexTitle'),
    indexLede: this.i18n.translate('devWorkshop.agents.indexLede'),
    thTask: this.i18n.translate('devWorkshop.agents.thTask'),
    thDocs: this.i18n.translate('devWorkshop.agents.thDocs'),
    loopTitle: this.i18n.translate('devWorkshop.agents.loopTitle'),
    loopLede: this.i18n.translate('devWorkshop.agents.loopLede'),
    step1Title: this.i18n.translate('devWorkshop.agents.step1Title'),
    step1Body: this.i18n.translate('devWorkshop.agents.step1Body'),
    step2Title: this.i18n.translate('devWorkshop.agents.step2Title'),
    step2Body: this.i18n.translate('devWorkshop.agents.step2Body'),
    step3Title: this.i18n.translate('devWorkshop.agents.step3Title'),
    step3Body: this.i18n.translate('devWorkshop.agents.step3Body'),
    step4Title: this.i18n.translate('devWorkshop.agents.step4Title'),
    step4Body: this.i18n.translate('devWorkshop.agents.step4Body'),
    ctaBody: this.i18n.translate('devWorkshop.agents.ctaBody'),
  }));

  /**
   * The task index, DERIVED from `design-registry.ts` at runtime through the
   * shared tag→group map in `design-groups.ts` (one source with the gallery
   * sections and the detail quick-switch). Every entry appears in exactly one
   * row, including future ones — the table maintains itself.
   */
  readonly groups = computed(() =>
    groupDesignEntries(designRegistry).map((g) => ({
      id: g.def.id,
      title: this.i18n.translate(g.def.titleKey),
      hint: this.i18n.translate(g.def.hintKey),
      docs: g.entries,
    })),
  );

  /**
   * The guide index, DERIVED from `article-registry.ts` at runtime (grouped by
   * category). A new guide entry appears here automatically — the table
   * maintains itself, exactly like the component index above.
   */
  readonly guideGroups = computed(() =>
    groupGuidesByCategory(articleRegistry).map((bucket) => ({
      id: bucket.id,
      title: this.i18n.translate(`devWorkshop.guides.category.${bucket.id}`),
      entries: bucket.entries,
    })),
  );

  /** "{count} components in {groups} task groups ..." with numbers filled in. */
  readonly indexSummary = computed(() =>
    this.i18n
      .translate('devWorkshop.agents.indexSummary')
      .replace('{count}', String(this.total))
      .replace('{groups}', String(this.groups().length)),
  );
}
