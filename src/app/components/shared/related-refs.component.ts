/**
 * RelatedRefsComponent
 *
 * Renders cross-content "Verwandte Inhalte" — grouped chips for Articles,
 * Glossary terms, Timeline events, and Demos. One component, three density
 * modes, one optional graph-trigger.
 *
 * Density modes:
 *   - `compact` (default) — type-grouped chips, used in Glossary detail,
 *     Timeline event card, Demo page.
 *   - `expansive` — same grouping but `richTypes` get rendered as rich
 *     cards (currently: articles). Used in article footer where there's
 *     room for a Next-Read-CTA.
 *   - `compact-inline` — single-line layout, no group headers, icon+color
 *     do the disambiguation. Used in very tight mounts (glossary-row,
 *     timeline-card-in-list).
 *
 * Map-Trigger:
 *   When `mapTrigger=true`, a "Im Graph" button appears in the heading
 *   row regardless of overflow state. Emits `(mapTriggered)` so the
 *   parent can open the ontology-map dialog.
 *
 * Design: an internal design note.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { Observable, of } from 'rxjs';
import { RelatedRefsService } from '../../services/related-refs.service';
import { TranslationService } from '../../services/translation.service';
import {
  RelatedRefType,
  RelatedRefs,
  RelatedRefsDensity,
  ResolvedRef,
  ResolvedRefGroup,
} from '../../services/related-refs.types';
import { OntologyNodeType } from '../../services/ontology.types';
import { OntologyMapComponent } from './ontology-map.component';
import { FocusReturn } from '../../utils/focus-return';

@Component({
  selector: 'app-related-refs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, DialogModule, OntologyMapComponent],
  template: `
    @if (groups$ | async; as groups) {
      @if (groups.length > 0) {
        <section
          class="related-refs"
          [class.related-refs--card-wrap]="cardWrap"
          [attr.data-density]="effectiveDensity()"
          [attr.aria-labelledby]="density === 'compact-inline' ? null : headingId"
        >
          <!-- The configured compact-inline density mounts once per list row
               (every AI-timeline event): named, each would be one more
               identical "Related content" region landmark (axe
               landmark-unique). Unnamed, the section is no landmark; the h3
               still gives it a heading. Keyed on the configured density, not
               effectiveDensity(), which turns 'compact' on narrow screens. -->
          <div class="related-refs-head">
            <h3 [id]="headingId" class="related-refs-heading">
              <i class="pi pi-link" aria-hidden="true"></i>
              {{ translate('common.relatedContent') }}
            </h3>
            @if (mapTrigger) {
              <button
                type="button"
                class="related-refs-graph-btn"
                (click)="onMapTrigger()"
                [attr.aria-label]="graphAriaLabel()"
              >
                <i class="pi pi-sitemap" aria-hidden="true"></i>
                <span>{{ graphLabel() }}</span>
              </button>
            }
          </div>

          <!-- compact-inline: collapsed = 1-per-type round-robin preview (max
               'maxInline'), expanded = ALL items flat in group order. Chip
               color + icon disambiguate. External items become native <a> with
               target=_blank instead of routerLink. -->
          @if (effectiveDensity() === 'compact-inline') {
            @if (flatItems(groups); as flat) {
              @if (previewItems(groups); as preview) {
                <div class="related-refs-inline">
                  @for (item of expanded() ? flat : preview; track item.type + item.id) {
                    @if (!item.isExternal) {
                      <a
                        [routerLink]="item.route"
                        [queryParams]="queryParamsFor(item.type, item.id)"
                        class="related-refs-tag related-refs-tag-inline"
                        [attr.data-type]="item.type"
                        [attr.aria-label]="typeLabel(item.type) + ': ' + item.title"
                      >
                        <i [class]="item.icon" aria-hidden="true"></i>
                        <span>{{ item.title }}</span>
                      </a>
                    }
                    @if (item.isExternal) {
                      <a
                        [href]="item.route"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="related-refs-tag related-refs-tag-inline"
                        [attr.data-type]="item.type"
                        [attr.aria-label]="item.title + ' — ' + externalLinkLabel()"
                      >
                        <i [class]="item.icon" aria-hidden="true"></i>
                        <span>{{ item.title }}</span>
                      </a>
                    }
                  }
                  @if (!expanded() && flat.length > preview.length) {
                    <button type="button" class="related-refs-expand" (click)="onExpand()">
                      <i class="pi pi-angle-down" aria-hidden="true"></i>
                      <span>{{ showMoreLabel(flat.length - preview.length) }}</span>
                    </button>
                  }
                  @if (expanded() && flat.length > preview.length) {
                    <button type="button" class="related-refs-expand" (click)="onCollapse()">
                      <i class="pi pi-angle-up" aria-hidden="true"></i>
                      <span>{{ translate('common.showLess') }}</span>
                    </button>
                  }
                </div>
              }
            }
          } @else {
            <!-- compact / expansive: type-grouped, per-group cap on chip-only groups -->
            <div class="related-refs-groups">
              @for (group of groups; track group.type) {
                <div class="related-refs-group" [attr.data-type]="group.type">
                  <h4 class="related-refs-group-title">
                    {{ translate('common.contentType.' + groupKey(group.type)) }}
                  </h4>

                  <!-- Expansive + type is rich: render as cards (capped at maxCards).
                       External items become native <a target=_blank> with an
                       EXTERN indicator in the type-chip area. -->
                  @if (renderAsCards(group.type)) {
                    <div class="related-refs-cards">
                      @for (item of visibleItems(group.type, group.items, maxCards); track item.type + item.id) {
                        @if (!item.isExternal) {
                          <a [routerLink]="item.route" class="related-refs-card" [attr.data-type]="item.type">
                            <ng-container *ngTemplateOutlet="cardBody; context: { $implicit: item }"></ng-container>
                          </a>
                        }
                        @if (item.isExternal) {
                          <a
                            [href]="item.route"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="related-refs-card related-refs-card--external"
                            [attr.data-type]="item.type"
                            [attr.aria-label]="item.title + ' — ' + externalLinkLabel()"
                          >
                            <ng-container *ngTemplateOutlet="cardBody; context: { $implicit: item }"></ng-container>
                          </a>
                        }
                      }
                      <!-- Shared card body for both routerLink and external <a>.
                           Keeps the markup DRY and identical styling between the
                           two anchor variants. -->
                      <ng-template #cardBody let-item>
                        <header class="related-refs-card-head">
                          <span class="related-refs-card-type">
                            <i [class]="item.icon" aria-hidden="true"></i>
                            {{ typeLabel(item.type) }}
                          </span>
                          @if (item.isExternal) {
                            <span class="related-refs-card-extern">
                              <i class="pi pi-external-link" aria-hidden="true"></i>
                              {{ translate('common.contentType.external') }}
                            </span>
                          }
                          @if (item.difficulty && !item.isExternal) {
                            <span class="related-refs-card-diff" [attr.data-diff]="item.difficulty">
                              {{ translate('common.difficulty.' + item.difficulty) }}
                            </span>
                          }
                        </header>
                        <h5 class="related-refs-card-title">{{ item.title }}</h5>
                        @if (item.description) {
                          <p class="related-refs-card-desc">{{ item.description }}</p>
                        }
                        <footer class="related-refs-card-foot">
                          @if (item.estimatedTime) {
                            <span class="related-refs-card-time">
                              <i class="pi pi-clock" aria-hidden="true"></i>
                              {{ item.estimatedTime }}
                            </span>
                          }
                          <span class="related-refs-card-arrow-wrap">
                            @if (item.isExternal) {
                              <span class="related-refs-card-extern-label">
                                {{ translate('common.openExternal') }}
                              </span>
                            }
                            <span class="related-refs-card-arrow" aria-hidden="true">{{
                              item.isExternal ? '↗' : '→'
                            }}</span>
                          </span>
                        </footer>
                      </ng-template>
                      @if (hasOverflow(group.type, group.items, maxCards)) {
                        <button
                          type="button"
                          class="related-refs-expand related-refs-expand--card"
                          (click)="onExpandGroup(group.type)"
                        >
                          <i
                            class="pi"
                            [ngClass]="isGroupExpanded(group.type) ? 'pi-angle-up' : 'pi-angle-down'"
                            aria-hidden="true"
                          ></i>
                          <span>{{
                            isGroupExpanded(group.type)
                              ? translate('common.showLess')
                              : showMoreLabel(group.items.length - maxCards)
                          }}</span>
                        </button>
                      }
                    </div>
                  } @else {
                    <!-- Compact (or expansive non-rich): chips with per-group cap.
                         External items use [href]+target=_blank instead of routerLink. -->
                    <div class="related-refs-tags">
                      @for (item of visibleItems(group.type, group.items, maxInline); track item.type + item.id) {
                        @if (!item.isExternal) {
                          <a
                            [routerLink]="item.route"
                            [queryParams]="queryParamsFor(item.type, item.id)"
                            class="related-refs-tag"
                            [attr.data-type]="item.type"
                            [attr.aria-label]="item.title"
                          >
                            <i [class]="item.icon" aria-hidden="true"></i>
                            <span>{{ item.title }}</span>
                          </a>
                        }
                        @if (item.isExternal) {
                          <a
                            [href]="item.route"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="related-refs-tag related-refs-tag--external"
                            [attr.data-type]="item.type"
                            [attr.aria-label]="item.title + ' — ' + externalLinkLabel()"
                          >
                            <i [class]="item.icon" aria-hidden="true"></i>
                            <span>{{ item.title }}</span>
                          </a>
                        }
                      }
                      @if (hasOverflow(group.type, group.items, maxInline)) {
                        <button type="button" class="related-refs-expand" (click)="onExpandGroup(group.type)">
                          <i
                            class="pi"
                            [ngClass]="isGroupExpanded(group.type) ? 'pi-angle-up' : 'pi-angle-down'"
                            aria-hidden="true"
                          ></i>
                          <span>{{
                            isGroupExpanded(group.type)
                              ? translate('common.showLess')
                              : showMoreLabel(group.items.length - maxInline)
                          }}</span>
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
        </section>
      }
    }

    <p-dialog
      [visible]="mapVisible"
      (visibleChange)="onMapDialogVisibleChange($event)"
      (onHide)="onMapDialogHide()"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [closeOnEscape]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="ontology-map-dialog"
      [style]="{ width: '92vw', maxWidth: '1100px', height: '78vh', maxHeight: '78vh' }"
      [contentStyle]="{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }"
      [header]="graphLabel()"
      [closeAriaLabel]="translate('ui.close')"
    >
      <!-- F.4: dialog body — map fills the stable-height container. The
           "Volle Wissenskarte öffnen" link (showFullMapLink) stays off: the
           kit has no /concept-map page, so the link led to the 404 page. -->
      @if (mapVisible && forNode) {
        <div class="ontology-map-dialog-body">
          <app-ontology-map
            [focusType]="forNode.type"
            [focusId]="forNode.id"
            [hops]="1"
            [showFullMapLink]="false"
            (nodeSelected)="onMapNodeSelected()"
            (fullMapClicked)="onMapDialogLinkClick()"
          >
          </app-ontology-map>
        </div>
      }
    </p-dialog>
  `,
  styles: [
    `
      .related-refs {
        margin-top: var(--space-6);
        padding-top: var(--space-5);
        border-top: 1px solid var(--surface-border);
      }
      /* Card-wrap variant — used on article footer so the section sits inside
       a surface card instead of floating on the page background. */
      .related-refs--card-wrap {
        margin-top: var(--space-5);
        padding: var(--space-5) var(--space-5) var(--space-4);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-top: 1px solid var(--surface-border);
        border-radius: var(--border-radius-md);
      }
      .related-refs-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin: 0 0 var(--space-4);
        flex-wrap: wrap;
      }
      .related-refs-heading {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: 1.15rem;
        font-weight: 600;
        margin: 0;
        color: var(--text-color);
      }
      .related-refs-heading i {
        color: var(--primary-color-fg);
      }
      /* Compact-inline tightens the heading */
      .related-refs[data-density='compact-inline'] .related-refs-heading {
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--text-color-secondary);
      }

      .related-refs-graph-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.3rem 0.65rem;
        font: inherit;
        font-size: 0.78rem;
        font-weight: 600;
        background: transparent;
        color: var(--primary-color-fg);
        border: 1px solid var(--primary-color-fg);
        border-radius: 4px;
        cursor: pointer;
        transition:
          background 0.15s ease,
          color 0.15s ease;
      }
      .related-refs-graph-btn:hover {
        background: var(--primary-color);
        color: var(--primary-color-text);
      }
      .related-refs-graph-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .related-refs-graph-btn i {
        font-size: 0.82rem;
      }

      /* Grouped layout (compact + expansive) */
      .related-refs-groups {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      .related-refs-group-title {
        font-size: 0.85rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-2);
      }
      .related-refs[data-density='compact'] .related-refs-groups,
      .related-refs[data-density='compact'] {
        gap: var(--space-3);
      }
      .related-refs[data-density='compact'] .related-refs-group-title {
        font-size: 0.72rem;
      }

      /* Chips (compact + compact-inline + expansive non-rich) */
      .related-refs-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      .related-refs-tag {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: 0.4rem 0.7rem;
        min-height: 1.75rem;
        border-radius: 8px;
        font-size: 0.85rem;
        text-decoration: none;
        border: 1px solid transparent;
        transition:
          filter 0.15s ease,
          border-color 0.15s ease;
      }
      .related-refs-tag:hover {
        filter: brightness(0.96);
      }
      .dark-theme .related-refs-tag:hover {
        filter: brightness(1.15);
      }
      .related-refs-tag:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .related-refs-tag i {
        font-size: 0.85rem;
        opacity: 0.9;
      }
      /* Compact density: slightly smaller chips */
      .related-refs[data-density='compact'] .related-refs-tag {
        padding: 0.25rem 0.6rem;
        font-size: 0.78rem;
        gap: 0.4rem;
      }
      .related-refs[data-density='compact'] .related-refs-tag i {
        font-size: 0.72rem;
      }

      /* Per-type backgrounds.
       Article color is locked to the FIXED amber palette (var(--amber-*))
       so the chip doesn't flip when a user changes the primary theme via
       the theme-picker — the type-identity must stay stable.
       Light theme: 700-shade text on light card-bg = WCAG AA contrast.
       Dark theme: 100-shade text + 20% bg + 50% border → readable on dark card. */
      /* Per-type chips. Colors come from the UNPREFIXED palette
       (--yellow-*, --blue-*, --green-*) which is
       theme-aware via global overrides in styles.scss:
         - --*-500 stays FIXED (so article-amber stays amber even when
           the user picks a different primary theme)
         - --*-700 flips from dark hex (light theme) to light hex
           (dark theme), so the SAME var works for chip text in both
       That means we only need one rule per type — no separate
       .dark-theme overrides (which would fail under Angular
       ViewEncapsulation anyway because .dark-theme sits on body, not
       inside the component subtree). */
      .related-refs-tag[data-type='articles'] {
        background: color-mix(in srgb, var(--yellow-500) 14%, transparent);
        color: var(--yellow-700);
        border-color: color-mix(in srgb, var(--yellow-500) 45%, transparent);
      }
      /* Glossary — pink. The kit has no unprefixed pink scale, so the ink is
       --semantic-pink-fg (mode-aware, contrast-gated) and the tint Aura's
       fixed --p-pink-500. */
      .related-refs-tag[data-type='glossary'] {
        background: color-mix(in srgb, var(--p-pink-500) 14%, transparent);
        color: var(--semantic-pink-fg);
        border-color: color-mix(in srgb, var(--p-pink-500) 45%, transparent);
      }
      .related-refs-tag[data-type='timeline'] {
        background: color-mix(in srgb, var(--blue-500) 14%, transparent);
        color: var(--blue-700);
        border-color: color-mix(in srgb, var(--blue-500) 45%, transparent);
      }
      /* Per-type hover/focus: keep the chip's identity color in interaction
       states instead of falling back to the global amber --primary-color
       outline. Border darkens to the -700 shade for a clear "active" cue. */
      .related-refs-tag[data-type='glossary']:hover {
        border-color: var(--semantic-pink-fg);
      }
      .related-refs-tag[data-type='glossary']:focus-visible {
        outline-color: var(--semantic-pink-fg);
      }
      .related-refs-tag[data-type='timeline']:hover {
        border-color: var(--blue-700);
      }
      .related-refs-tag[data-type='timeline']:focus-visible {
        outline-color: var(--blue-700);
      }
      /* Demos — green: distinct from articles (yellow) and from sources (slate). */
      .related-refs-tag[data-type='demos'] {
        background: color-mix(in srgb, var(--green-500) 14%, transparent);
        color: var(--green-700);
        border-color: color-mix(in srgb, var(--green-500) 45%, transparent);
      }
      /* Sources — slate: citations + book refs, neutral so they don't compete
       visually with the navigational types. Changed 2026-05-17 from green to
       avoid clash with demos. */
      .related-refs-tag[data-type='sources'] {
        background: color-mix(in srgb, var(--neutral-500, #64748b) 14%, transparent);
        color: var(--neutral-700, #334155);
        border-color: color-mix(in srgb, var(--neutral-500, #64748b) 45%, transparent);
      }
      /* Catalog — Tools AND Resources share teal. They sit under one group
       header "Catalog" but keep their individual icon (wrench vs folder-
       open) so users still see which is which. Teal palette is fully defined
       in design-tokens.scss + theme-adapted in styles.scss so contrast holds
       in both light and dark mode (unlike --p-cyan-* which is fixed-dark). */
      .related-refs-tag[data-type='tools'],
      .related-refs-tag[data-type='resources'] {
        background: color-mix(in srgb, var(--teal-500) 14%, transparent);
        color: var(--teal-700);
        border-color: color-mix(in srgb, var(--teal-500) 45%, transparent);
      }
      /* External — amber: matches the EXTERN-Chip and the old <app-link-box> */
      .related-refs-tag[data-type='external'] {
        background: color-mix(in srgb, var(--orange-500) 14%, transparent);
        color: var(--orange-700);
        border-color: color-mix(in srgb, var(--orange-500) 45%, transparent);
      }

      /* Dark-theme background bump: the --<color>-700 foreground already flips
       to a lighter shade in dark mode (handled by styles.scss .dark-theme
       block), so text contrast is fine. The background tints at 14% can look
       too faint on dark surfaces though — bump them to 22% for better
       perceived fill without overwhelming the type chip. */
      .dark-theme .related-refs-tag[data-type='articles'] {
        background: color-mix(in srgb, var(--yellow-500) 22%, transparent);
      }
      .dark-theme .related-refs-tag[data-type='glossary'] {
        background: color-mix(in srgb, var(--p-pink-500) 22%, transparent);
      }
      .dark-theme .related-refs-tag[data-type='timeline'] {
        background: color-mix(in srgb, var(--blue-500) 22%, transparent);
      }
      .dark-theme .related-refs-tag[data-type='demos'] {
        background: color-mix(in srgb, var(--green-500) 22%, transparent);
      }
      .dark-theme .related-refs-tag[data-type='sources'] {
        background: color-mix(in srgb, var(--neutral-500, #64748b) 22%, transparent);
      }
      .dark-theme .related-refs-tag[data-type='tools'],
      .dark-theme .related-refs-tag[data-type='resources'] {
        background: color-mix(in srgb, var(--teal-500) 22%, transparent);
      }
      .dark-theme .related-refs-tag[data-type='external'] {
        background: color-mix(in srgb, var(--orange-500) 22%, transparent);
      }

      /* Inline density — pill-shape only */
      .related-refs-inline {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: center;
      }
      .related-refs-tag-inline {
        border-radius: 999px;
        padding: 0.3rem 0.7rem;
        min-height: 1.75rem;
        font-size: 0.8rem;
      }

      /* Expand "+N weitere" button — borrows chip pill-shape but neutral surface */
      .related-refs-expand {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.3rem 0.7rem;
        min-height: 1.75rem;
        font: inherit;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        background: transparent;
        color: var(--text-color-secondary);
        border: 1px dashed var(--surface-border);
        border-radius: 999px;
        cursor: pointer;
        transition:
          background 0.15s ease,
          color 0.15s ease,
          border-color 0.15s ease;
      }
      .related-refs-expand:hover {
        background: var(--surface-hover);
        color: var(--text-color);
        border-color: var(--primary-color);
        border-style: solid;
      }
      .related-refs-expand:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .related-refs-expand i {
        font-size: 0.78rem;
      }
      .related-refs-expand--card {
        align-self: stretch;
        min-height: 56px;
        border-radius: 6px;
      }

      /* Cards (expansive density only).
       auto-fill (instead of auto-fit) keeps single-card groups at their
       intrinsic min-width instead of stretching them to full row — important
       for groups with just 1-2 items (e.g. a single external link) so they
       visually match the article-card tiles in adjacent groups. */
      .related-refs-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 360px));
        gap: var(--space-3);
      }
      .related-refs-card {
        display: flex;
        flex-direction: column;
        padding: 1rem 1.1rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-left: 3px solid var(--primary-color);
        border-radius: 6px;
        text-decoration: none;
        color: var(--text-color);
        transition:
          box-shadow 0.15s ease,
          border-color 0.15s ease;
      }
      .related-refs-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        border-color: var(--primary-color-fg);
      }
      .related-refs-card:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
      .related-refs-card-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .related-refs-card-type {
        font-size: 0.7rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--primary-color-fg);
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .related-refs-card-diff {
        font-size: 0.7rem;
        letter-spacing: 0.05em;
        padding: 0.15rem 0.5rem;
        border-radius: 3px;
        background: var(--surface-hover);
        /* a11y: plain --text-color-secondary measured 4.44-4.46:1 on the light card
         surfaces (just under WCAG AA 4.5). Mix toward --text-color to clear 4.5 in
         the light theme; the dark theme already passed and stays fine. Same pattern
         is applied to .related-refs-card-desc and .related-refs-card-time below. */
        color: color-mix(in srgb, var(--text-color-secondary) 70%, var(--text-color));
      }
      /* External-link indicator chip in card header.
       Yellow/amber tone matches the old <app-link-box> EXTERN-Chip and signals
       "this leaves the portal" without competing with content-type colors. */
      .related-refs-card-extern {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.68rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-weight: 600;
        padding: 0.18rem 0.55rem;
        border-radius: 999px;
        background: rgba(245, 158, 11, 0.12); /* amber-500 @ 12% */
        color: rgb(180, 116, 0); /* amber-700 */
        border: 1px solid rgba(245, 158, 11, 0.4);
      }
      .dark-theme .related-refs-card-extern {
        background: rgba(245, 158, 11, 0.18);
        color: rgb(252, 196, 96);
        border-color: rgba(245, 158, 11, 0.5);
      }
      .related-refs-card-extern i {
        font-size: 0.78rem;
      }
      /* External-link card variant: subtle amber accent on the left edge,
       gentle amber-tinted background, and a "Externe Quelle öffnen" label
       paired with the ↗ arrow in the footer. */
      .related-refs-card--external {
        border-left: 4px solid rgba(245, 158, 11, 0.7);
        background: color-mix(in srgb, var(--orange-500) 5%, var(--surface-card));
      }
      .dark-theme .related-refs-card--external {
        background: color-mix(in srgb, var(--orange-500) 8%, var(--surface-card));
      }
      /* Article card variant: soft yellow tint to match the chip palette.
       Same 5%/8% intensity as the demo + external variants so all three
       rich-card types share the same visual weight. */
      .related-refs-card[data-type='articles'] {
        background: color-mix(in srgb, var(--yellow-500) 5%, var(--surface-card));
      }
      .dark-theme .related-refs-card[data-type='articles'] {
        background: color-mix(in srgb, var(--yellow-500) 8%, var(--surface-card));
      }
      /* Demo card variant: green accent matching the demo-chip palette.
       Same visual weight as the external variant — subtle bg tint + bolder
       left border — so demos and articles stay visually distinct even when
       both render as rich cards next to each other. */
      .related-refs-card[data-type='demos'] {
        border-left: 4px solid color-mix(in srgb, var(--green-500) 70%, transparent);
        background: color-mix(in srgb, var(--green-500) 5%, var(--surface-card));
      }
      .dark-theme .related-refs-card[data-type='demos'] {
        background: color-mix(in srgb, var(--green-500) 8%, var(--surface-card));
      }
      .related-refs-card[data-type='demos'] .related-refs-card-type {
        color: var(--green-700);
      }
      /* Demo cards: hover/focus accent stays green instead of flipping to the
       portal's amber --primary-color-fg, so the type-identity holds in all
       interaction states (consistent with the chip palette). */
      .related-refs-card[data-type='demos']:hover {
        border-color: var(--green-700);
      }
      .related-refs-card[data-type='demos']:hover .related-refs-card-arrow {
        color: var(--green-700);
      }
      .related-refs-card[data-type='demos']:focus-visible {
        outline-color: var(--green-700);
      }
      .related-refs-card-arrow-wrap {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        margin-left: auto;
      }
      .related-refs-card-extern-label {
        font-size: 0.74rem;
        font-weight: 500;
        letter-spacing: 0.02em;
        color: rgb(180, 116, 0);
        white-space: nowrap;
      }
      .dark-theme .related-refs-card-extern-label {
        color: rgb(252, 196, 96);
      }
      /* External-link chip variant: tiny ↗ glyph appended visually via the
       icon column, plus a slightly different hover state. The chip itself
       keeps the data-type color so the external-ness is signaled by the
       icon + aria-label, not by overriding the content-type color. */
      .related-refs-tag--external::after {
        content: '↗';
        margin-left: 0.15rem;
        opacity: 0.7;
        font-size: 0.85rem;
      }
      .related-refs-card-title {
        font-size: 1.05rem;
        font-weight: 600;
        line-height: 1.3;
        margin: 0 0 0.5rem;
        color: var(--text-color);
      }
      .related-refs-card-desc {
        font-size: 0.88rem;
        line-height: 1.5;
        color: color-mix(in srgb, var(--text-color-secondary) 70%, var(--text-color));
        margin: 0 0 0.75rem;
        flex: 1;
      }
      .related-refs-card-foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0.5rem;
        border-top: 1px dashed var(--surface-border);
      }
      .related-refs-card-time {
        font-size: 0.78rem;
        color: color-mix(in srgb, var(--text-color-secondary) 70%, var(--text-color));
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .related-refs-card-arrow {
        color: var(--text-color-secondary);
        font-size: 1.1rem;
        transition: color 0.15s ease;
      }
      .related-refs-card:hover .related-refs-card-arrow {
        color: var(--primary-color-fg);
      }

      /* Reduced motion: drop subtle transitions, too */
      @media (prefers-reduced-motion: reduce) {
        .related-refs-tag,
        .related-refs-card,
        .related-refs-card-arrow,
        .related-refs-graph-btn {
          transition: none !important;
        }
      }

      @media print {
        .related-refs {
          display: none !important;
        }
      }

      /* Dialog body: fixed-height container so the canvas and the table
       fallback share the same outer box. Toggling between them does NOT
       change the dialog's height — only the inner content swaps. The
       inner ontology-map and its canvas/table-wrap are flex children
       with their own overflow handling. */
      .ontology-map-dialog-body {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        flex: 1 1 auto;
        min-height: 0;
        height: 100%;
      }
      .ontology-map-dialog-body app-ontology-map {
        flex: 1 1 auto;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      /* Force the inner ontology-map root to fill the flex parent + clip
       overflow so the table fallback scrolls inside, not the dialog. */
      .ontology-map-dialog-body app-ontology-map > .ontology-map-root {
        flex: 1 1 auto;
        min-height: 0;
        overflow: hidden;
      }
      /* Inside the dialog the canvas + table-wrap fill the remaining height
       instead of using their viewport-based default heights. */
      .ontology-map-dialog-body .ontology-map-canvas,
      .ontology-map-dialog-body .ontology-map-table-wrap {
        flex: 1 1 auto;
        min-height: 0;
        max-height: none;
        height: auto;
      }
      /* F.4: dialog-link now lives in the OntologyMap toolbar via
       [showFullMapLink]. The bottom-of-dialog link CSS is retired. */
    `,
  ],
})
export class RelatedRefsComponent implements OnChanges, OnInit, OnDestroy {
  private static instanceCounter = 0;
  /** Per-instance heading id — glossary and timeline mount this component in
   *  loops, so a static id would duplicate across the document. */
  readonly headingId = `related-refs-heading-${RelatedRefsComponent.instanceCounter++}`;

  /**
   * Explicit ref list (editorial override). Pass either this OR `forNode`,
   * not both. If both are set, `refs` wins and a warning is logged.
   */
  @Input() refs: RelatedRefs | null | undefined = null;
  /**
   * Pull refs from the ontology for a given node. Mutually exclusive with
   * `[refs]`. The focus node is automatically excluded from results.
   */
  @Input() forNode?: { type: OntologyNodeType; id: string };
  @Input() excludeSelf?: { type: RelatedRefType; id: string };
  @Input() density: RelatedRefsDensity = 'compact';
  /**
   * Which types render as rich cards in expansive mode (others stay chips).
   * Default: articles + external. Articles get cards for the "next read"
   * CTA; external items get cards because they replace the old
   * `<app-link-box>` editorial cards (full title + curated description).
   * Tools/resources stay as chips (catalog entries, low visual weight).
   */
  @Input() richTypes: RelatedRefType[] = ['articles', 'external'];
  /** Show a "Im Graph" button in the heading row */
  @Input() mapTrigger: boolean = false;
  /** Wrap the section in a card-style surface (used in article footer where the
      section otherwise floats on the page background). */
  @Input() cardWrap: boolean = false;
  /** Max items shown before the "+N weitere" expand-button kicks in.
      Applies to compact-inline (preview is 1-per-type round-robin up to
      this cap; expanded reveals the full list). Also caps chip-groups in
      grouped densities. Default 5. */
  @Input() maxInline: number = 5;
  /** Max rich cards shown in expansive density before the expand button.
      Cards take more space so the cap is the same default 7. */
  @Input() maxCards: number = 7;

  @Output() mapTriggered = new EventEmitter<void>();

  /** Dialog visibility — controlled internally, exposed for parents that
      want to observe (rare). */
  mapVisible = false;

  /** Inline-density expand state (one boolean — flat list). */
  expanded = signal(false);
  /** Grouped-density per-group expand state. Map key = group type. */
  private groupExpanded = signal<Record<string, boolean>>({});

  private relatedRefsService = inject(RelatedRefsService);
  private translationService = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  /**
   * Viewport-narrow flag. When true, the component renders in compact-mode
   * style regardless of the configured `density` Input — i.e. all groups
   * become chips, no rich cards. Updated via `matchMedia` change listener
   * (SSR-safe via isPlatformBrowser guard). Breakpoint 720px matches the
   * project's existing narrow-viewport convention.
   */
  private narrowViewport = signal(false);
  private narrowMQ: MediaQueryList | null = null;
  private narrowMQHandler: ((e: MediaQueryListEvent) => void) | null = null;

  groups$: Observable<ResolvedRefGroup[]> = of([]);

  // Defensive: mount points commonly bind fresh object literals on every
  // change-detection pass (e.g. `[excludeSelf]="{ type: 'x', id: row.id }"`).
  // ngOnChanges fires on identity diff, so re-subscribing every CD pass spins
  // a new combineLatest emission → triggers CD → infinite loop. We resubscribe
  // only when the VALUES actually change, regardless of reference identity.
  private _lastRefsSig = '';
  private _lastExcludeSig = '';
  private _lastForNodeSig = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.narrowMQ = window.matchMedia('(max-width: 720px)');
    this.narrowViewport.set(this.narrowMQ.matches);
    this.narrowMQHandler = (e: MediaQueryListEvent) => {
      this.narrowViewport.set(e.matches);
      this.cdr.markForCheck();
    };
    this.narrowMQ.addEventListener('change', this.narrowMQHandler);
  }

  ngOnDestroy(): void {
    if (this.narrowMQ && this.narrowMQHandler) {
      this.narrowMQ.removeEventListener('change', this.narrowMQHandler);
      this.narrowMQ = null;
      this.narrowMQHandler = null;
    }
  }

  /**
   * Effective density: `compact` when the viewport is narrow regardless of
   * the configured `density` Input. Templates + renderAsCards consult this
   * instead of `density` directly so a single signal controls the visual.
   */
  effectiveDensity(): RelatedRefsDensity {
    return this.narrowViewport() ? 'compact' : this.density;
  }

  ngOnChanges(_changes: SimpleChanges): void {
    const refsSig = JSON.stringify(this.refs ?? {});
    const excludeSig = this.excludeSelf ? this.excludeSelf.type + ':' + this.excludeSelf.id : '';
    const forNodeSig = this.forNode ? this.forNode.type + ':' + this.forNode.id : '';

    if (refsSig === this._lastRefsSig && excludeSig === this._lastExcludeSig && forNodeSig === this._lastForNodeSig)
      return;

    this._lastRefsSig = refsSig;
    this._lastExcludeSig = excludeSig;
    this._lastForNodeSig = forNodeSig;

    const hasRefs = !!this.refs && Object.keys(this.refs).length > 0;
    const hasForNode = !!this.forNode;

    // Hybrid mode: [forNode] + [refs] both set → union of ontology neighbors
    // and editorial pins, with V2 types (tools/resources/external) preserved
    // from the editorial side since they're not in the ontology.
    if (hasForNode && hasRefs && this.forNode) {
      this.groups$ = this.relatedRefsService.resolveForNodeWithEditorial(
        this.forNode.type,
        this.forNode.id,
        this.refs ?? null,
      );
    } else if (hasRefs) {
      this.groups$ = this.relatedRefsService.resolveGroups(this.refs ?? undefined, this.excludeSelf);
    } else if (hasForNode && this.forNode) {
      this.groups$ = this.relatedRefsService.resolveForNode(this.forNode.type, this.forNode.id);
    } else {
      this.groups$ = of([]);
    }
  }

  /** Hands focus back to the button that opened the map — Optimus UI does not. */
  private readonly mapFocusReturn = new FocusReturn();

  onMapTrigger(): void {
    this.mapTriggered.emit();
    // Open the in-component dialog only when we have a node to focus on.
    // Editorial-only [refs] mounts have no graph context — emit only.
    if (this.forNode) {
      this.mapFocusReturn.capture();
      this.mapVisible = true;
    }
  }

  /** Every close path ends here: close button, Escape, dismissable mask. */
  onMapDialogHide(): void {
    this.mapFocusReturn.restore();
  }

  /** Flatten all groups into one ordered list — group order preserved
      (articles → glossary → timeline → demos → sources). Used by
      compact-inline rendering and for the overflow-count. */
  flatItems(groups: ResolvedRefGroup[]): ResolvedRef[] {
    const out: ResolvedRef[] = [];
    for (const g of groups) {
      for (const it of g.items) out.push(it);
    }
    return out;
  }

  /** Preview slice for the collapsed compact-inline state.
      Tries to show ONE item per type first (round-robin in group order),
      so the user sees a representative mix instead of N articles in a row.
      Capped at `maxInline` (default 7) total. When expanded, callers
      use the full `flatItems` list instead. */
  previewItems(groups: ResolvedRefGroup[]): ResolvedRef[] {
    const cursors = groups.map(() => 0);
    const out: ResolvedRef[] = [];
    let progress = true;
    while (progress && out.length < this.maxInline) {
      progress = false;
      for (let i = 0; i < groups.length && out.length < this.maxInline; i++) {
        const g = groups[i];
        const c = cursors[i];
        if (c < g.items.length) {
          out.push(g.items[c]);
          cursors[i] = c + 1;
          progress = true;
        }
      }
    }
    return out;
  }

  /** Slice helper that respects per-group expand state (for grouped densities). */
  visibleItems(type: RelatedRefType, items: ResolvedRef[], cap: number): ResolvedRef[] {
    // Phase I.13 (2026-05-14): User-Wunsch — in expansive Density (Article-Footer)
    // immer alle Tags zeigen, kein „Weitere/Weniger". Cap wird ignoriert.
    if (this.effectiveDensity() === 'expansive') return items;
    if (items.length <= cap) return items;
    return this.isGroupExpanded(type) ? items : items.slice(0, cap);
  }

  hasOverflow(type: RelatedRefType, items: ResolvedRef[], cap: number): boolean {
    // Phase I.13: in expansive Density nie Overflow → Expand-Button verschwindet.
    if (this.effectiveDensity() === 'expansive') return false;
    return items.length > cap;
  }

  isGroupExpanded(type: RelatedRefType): boolean {
    return !!this.groupExpanded()[type];
  }

  onExpand(): void {
    this.expanded.set(true);
  }
  onCollapse(): void {
    this.expanded.set(false);
  }
  onExpandGroup(type: RelatedRefType): void {
    const cur = this.groupExpanded();
    this.groupExpanded.set({ ...cur, [type]: !cur[type] });
  }

  showMoreLabel(count: number): string {
    const t = this.translationService.translate('common.showMore');
    if (t === 'common.showMore') return `+ ${count} weitere`;
    return t.replace('{{count}}', String(count));
  }

  onMapDialogVisibleChange(visible: boolean): void {
    this.mapVisible = visible;
  }

  onMapNodeSelected(): void {
    // Node clicks navigate via the map's internal router call; closing
    // the dialog avoids it covering the destination page. Focus belongs to
    // the destination, not to a trigger that is about to be destroyed.
    this.mapFocusReturn.release();
    this.mapVisible = false;
  }

  onMapDialogLinkClick(): void {
    // Navigation handled by routerLink; just close the dialog so the
    // destination page isn't covered.
    this.mapFocusReturn.release();
    this.mapVisible = false;
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  graphLabel(): string {
    return this.translationService.translate('common.viewInGraph');
  }

  /** Accessible name of the graph button. Every locale's value starts with
   *  the visible label (common.viewInGraph), so a voice-control user can say
   *  what they see (WCAG 2.5.3 label in name). */
  graphAriaLabel(): string {
    return this.translationService.translate('common.viewInGraphLong');
  }

  typeLabel(type: RelatedRefType): string {
    return this.translate('common.contentType.' + this.groupKey(type));
  }

  /** Whether the group should render as rich cards (expansive + listed in richTypes) */
  renderAsCards(type: RelatedRefType): boolean {
    return this.effectiveDensity() === 'expansive' && this.richTypes.includes(type);
  }

  /**
   * Map type to the singular contentType i18n key.
   * Plural → singular for ontology and portal-content types; `external`
   * is already singular in i18n.
   */
  groupKey(type: RelatedRefType): string {
    if (type === 'articles') return 'article';
    if (type === 'demos') return 'demo';
    if (type === 'sources') return 'source';
    if (type === 'tools') return 'tool';
    if (type === 'resources') return 'resource';
    if (type === 'catalogue') return 'catalogue';
    return type; // 'glossary' | 'timeline' | 'external'
  }

  /**
   * Aria-label suffix for external links — appended to the item title so
   * screen readers announce "<Title> — Externer Link (öffnet in neuem Tab)".
   * Falls back to a German sentence if the i18n key is missing.
   */
  externalLinkLabel(): string {
    const t = this.translationService.translate('common.externalLink');
    return t === 'common.externalLink' ? 'Externer Link (öffnet in neuem Tab)' : t;
  }

  /**
   * For glossary/timeline (no per-entry route), use the existing search/anchor
   * convention so the list page filters to the target.
   */
  queryParamsFor(type: RelatedRefType, id: string): Record<string, string> | null {
    if (type === 'glossary' || type === 'timeline') {
      return { search: 'exact:' + id };
    }
    return null;
  }
}
