import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { PageHeaderComponent } from '../components/shared/page-header.component';
import { designRegistry } from './design-registry';
import { groupDesignEntries } from './design-groups';
import { articleRegistry, groupGuidesByCategory, localizedGuide } from './articles/article-registry';
import { VIBE_DEV_SENTINEL } from './dev-sentinel';

/**
 * /dev/design — the design-system gallery (SPEC N5.2, decision D5).
 *
 * A tile per `designRegistry` entry (name, selector, tag chips) linking to the
 * per-component detail page. Tiles render in GROUPED SECTIONS: the same
 * tag→task-group derivation as the `/dev/agents` index, from the shared
 * `design-groups.ts` module (one source — edit groups there). A single
 * client-side keyword filter matches over name + selector + tags (live,
 * case-insensitive) across ALL groups; empty groups disappear and the visible
 * result count is announced via `aria-live="polite"`.
 *
 * UI CONVENTIONS: `app-page-header` for the <h1>, `--container-*` width, card
 * surfaces on `--surface-card`, tag chips as NEUTRAL surface chips (passive
 * metadata — the primary tint is reserved for interactive elements; matches
 * the detail-page toolbar chips), text-tier brand color via
 * `--primary-color-fg`. No ad-hoc breadcrumbs (app nav handles navigation).
 * See dev-hub.component.ts for the full rationale.
 *
 * i18n: workshop chrome resolves through TranslationService (namespace
 * `devWorkshop`). The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so
 * the strip-proof literal survives tree-shaking (see dev-sentinel.ts).
 */
@Component({
  selector: 'app-dev-design-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <div class="gallery" [attr.data-dev-sentinel]="sentinel">
      <app-page-header
        titleKey="devWorkshop.gallery.title"
        subtitleKey="devWorkshop.gallery.subtitle">
        <p class="gallery__badge-row">
          <span class="dev-badge">
            <i class="pi pi-wrench" aria-hidden="true"></i>
            {{ labels().devOnly }}
          </span>
        </p>
      </app-page-header>

      <div class="gallery__filter">
        <label class="gallery__filter-label" for="gallery-filter">{{ labels().filterLabel }}</label>
        <input
          id="gallery-filter"
          class="gallery__filter-input"
          type="text"
          inputmode="search"
          autocomplete="off"
          [placeholder]="labels().filterPlaceholder"
          [value]="query()"
          (input)="onQuery($event)" />
        <p class="gallery__count" aria-live="polite">
          {{ filtered().length }} {{ labels().countOf }} {{ total }} {{ labels().countComponents }}
        </p>
      </div>

      @if (filtered().length > 0 || guideGroups().length > 0) {
        @for (group of groups(); track group.id) {
          <section class="gallery__group" [attr.aria-labelledby]="'group-h-' + group.id">
            <h2 class="gallery__group-title" [id]="'group-h-' + group.id">{{ group.title }}</h2>
            <p class="gallery__group-hint">{{ group.hint }}</p>
            <ul class="gallery__grid">
              @for (entry of group.entries; track entry.slug) {
                <li>
                  <a class="tile" [routerLink]="['/dev/design', entry.slug]">
                    <span class="tile__name">{{ entry.name }}</span>
                    <code class="tile__selector">{{ entry.selector }}</code>
                    <span class="tile__tags">
                      @for (tag of entry.tags; track tag) {
                        <span class="tile__tag">{{ tag }}</span>
                      }
                    </span>
                  </a>
                </li>
              }
            </ul>
          </section>
        }

        <!-- GUIDES — long-form articles about library primitives / patterns,
             grouped by category. Caught by the same keyword filter. -->
        @if (guideGroups().length > 0) {
          <section class="gallery__guides" aria-labelledby="guides-super-h">
            <h2 class="gallery__super-title" id="guides-super-h">{{ labels().guidesTitle }}</h2>
            <p class="gallery__group-hint">{{ labels().guidesHint }}</p>
            @for (cat of guideGroups(); track cat.id) {
              <div class="gallery__guide-cat" [attr.aria-labelledby]="'guide-cat-h-' + cat.id">
                <h3 class="gallery__guide-cat-title" [id]="'guide-cat-h-' + cat.id">{{ cat.title }}</h3>
                <ul class="gallery__grid">
                  @for (guide of cat.entries; track guide.id) {
                    <li>
                      <a class="tile" [routerLink]="['/dev/design/guide', guide.id]">
                        <span class="tile__name">{{ guide.title }}</span>
                        <span class="tile__cat-chip">{{ cat.title }}</span>
                        <span class="tile__summary">{{ guide.summary }}</span>
                        <span class="tile__tags">
                          @for (tag of guide.tags; track tag) {
                            <span class="tile__tag">{{ tag }}</span>
                          }
                        </span>
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </section>
        }
      } @else {
        <p class="gallery__empty">{{ labels().noMatches }} &ldquo;{{ query() }}&rdquo;.</p>
      }
    </div>
  `,
  styles: [`
    .gallery {
      max-width: var(--container-section);
      margin: 0 auto;
      padding: 0 1.5rem 1.5rem;
    }
    .gallery__badge-row { margin: 0.75rem 0 0; }
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
    .gallery__filter {
      margin-bottom: var(--space-6);
    }
    .gallery__filter-label {
      display: block;
      margin-bottom: var(--space-2);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-color);
    }
    .gallery__filter-input {
      width: 100%;
      max-width: 28rem;
      padding: 0.6rem 0.85rem;
      font-size: 1rem;
      font-family: inherit;
      color: var(--text-color);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .gallery__filter-input::placeholder { color: var(--text-color-muted); }
    .gallery__filter-input:focus-visible {
      outline: none;
      border-color: var(--primary-color-fg);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color-fg) 25%, transparent);
    }
    .gallery__count {
      margin: var(--space-2) 0 0;
      font-size: var(--font-size-sm);
      color: var(--text-color-secondary);
    }
    .gallery__group { margin-bottom: var(--space-8); }
    .gallery__group-title {
      margin: 0 0 var(--space-1);
      font-family: var(--font-heading);
      font-size: 1.375rem;
      line-height: 1.25;
      color: var(--text-color);
    }
    .gallery__group-hint {
      margin: 0 0 var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-color-secondary);
    }
    .gallery__grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--space-4);
      grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    }
    .tile {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      height: 100%;
      padding: var(--space-5);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      background: var(--surface-card);
      color: inherit;
      text-decoration: none;
      box-shadow: var(--shadow-sm);
      transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
    }
    .tile:hover {
      border-color: var(--primary-color-fg);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
    .tile:focus-visible {
      outline: 2px solid var(--primary-color-fg);
      outline-offset: 2px;
    }
    .tile__name {
      font-weight: var(--font-weight-medium);
      font-size: 1.05rem;
      color: var(--text-color);
    }
    .tile__selector {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-color-secondary);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-sm);
      padding: 0.1em 0.4em;
      align-self: flex-start;
    }
    .tile__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: auto;
      padding-top: var(--space-2);
    }
    /* Tags are passive metadata — neutral surface chips (same treatment as the
       detail-page toolbar chips), so the brand tint stays reserved for
       interactive elements and true accents. */
    .tile__tag {
      font-size: 0.75rem;
      line-height: 1.2;
      color: var(--text-color);
      background: var(--surface-100);
      border: 1px solid var(--surface-200);
      border-radius: 999px;
      padding: 0.15rem 0.55rem;
    }
    .gallery__guides { margin-top: var(--space-8); }
    .gallery__super-title {
      margin: 0 0 var(--space-1);
      font-family: var(--font-heading);
      font-size: 1.5rem;
      line-height: 1.2;
      color: var(--text-color);
    }
    .gallery__guide-cat { margin: var(--space-5) 0 var(--space-6); }
    .gallery__guide-cat-title {
      margin: 0 0 var(--space-3);
      font-size: 1.05rem;
      color: var(--text-color);
    }
    .tile__cat-chip {
      align-self: flex-start;
      font-size: 0.72rem;
      line-height: 1.2;
      color: var(--primary-700);
      background: var(--primary-100);
      border: 1px solid var(--primary-200);
      border-radius: 999px;
      padding: 0.15rem 0.55rem;
    }
    .tile__summary {
      font-size: var(--font-size-sm);
      line-height: 1.5;
      color: var(--text-color-secondary);
    }
    .gallery__empty {
      margin: 0;
      color: var(--text-color-secondary);
      font-style: italic;
    }
    @media (prefers-reduced-motion: reduce) {
      .tile, .gallery__filter-input { transition: none; }
      .tile:hover { transform: none; }
    }
  `],
})
export class DevDesignGalleryComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly i18n = inject(TranslationService);

  readonly total = designRegistry.length;
  readonly query = signal('');

  /** Reactive workshop-chrome labels (recompute on language switch). */
  readonly labels = computed(() => ({
    devOnly: this.i18n.translate('devWorkshop.common.devOnlyBadge'),
    filterLabel: this.i18n.translate('devWorkshop.gallery.filterLabel'),
    filterPlaceholder: this.i18n.translate('devWorkshop.gallery.filterPlaceholder'),
    countOf: this.i18n.translate('devWorkshop.gallery.countOf'),
    countComponents: this.i18n.translate('devWorkshop.gallery.countComponents'),
    noMatches: this.i18n.translate('devWorkshop.gallery.noMatches'),
    guidesTitle: this.i18n.translate('devWorkshop.guides.sectionTitle'),
    guidesHint: this.i18n.translate('devWorkshop.guides.sectionHint'),
  }));

  /** Case-insensitive filter over name + selector + tags (all groups). */
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return designRegistry;
    return designRegistry.filter((e) => {
      const haystack = (e.name + ' ' + e.selector + ' ' + e.tags.join(' ')).toLowerCase();
      return haystack.includes(q);
    });
  });

  /**
   * Filtered entries partitioned into the shared task groups (design-groups.ts
   * — same sections as the /dev/agents index). Empty groups are dropped by the
   * derivation, so a narrow filter collapses the page to the matching sections
   * while `filtered().length` keeps the aria-live counter exact.
   */
  readonly groups = computed(() =>
    groupDesignEntries(this.filtered()).map((g) => ({
      id: g.def.id,
      title: this.i18n.translate(g.def.titleKey),
      hint: this.i18n.translate(g.def.hintKey),
      entries: g.entries,
    })),
  );

  /** Case-insensitive filter over guide title + summary (both languages) + tags + category. */
  readonly filteredGuides = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return articleRegistry;
    return articleRegistry.filter((a) => {
      const haystack = [a.title, a.titleDe, a.summary, a.summaryDe, a.category, ...a.tags].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  });

  /** Filtered guides grouped by category (empty categories dropped), titles in the reader's language. */
  readonly guideGroups = computed(() => {
    const language = this.i18n.currentLanguage$();
    return groupGuidesByCategory(this.filteredGuides()).map((bucket) => ({
      id: bucket.id,
      title: this.i18n.translate(`devWorkshop.guides.category.${bucket.id}`),
      entries: bucket.entries.map((a) => ({ ...a, ...localizedGuide(a, language) })),
    }));
  });

  onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
