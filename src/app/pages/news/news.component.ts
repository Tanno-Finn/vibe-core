/**
 * NewsComponent — chronological news-feed for portal-wide notifications.
 *
 * Reads `NotificationService.allNotifications()` (no welcome, no 20-cap) and
 * presents the entries grouped by year-month, with type-based filter tabs,
 * full-text search, and link-chip support for aggregated entries.
 *
 * UX nods to the home page: each card carries the cursor-glow directive
 * tinted with a per-type accent color (see TYPE_GLOW_COLOR).
 *
 * Pairs with `/roadmap` (strategic outlook) but stays a separate page —
 * see Header-Combo concept §4 for the no-merge decision.
 */
import {
  Component,
  inject,
  signal,
  computed,
  ViewEncapsulation,
  afterNextRender,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SelectModule } from '@openng/optimus-ui/select';
import { ButtonModule } from '@openng/optimus-ui/button';

import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { NotificationService } from '../../services/notification.service';
import { TranslationService } from '../../services/translation.service';
import { NotificationEntry, NotificationLink, NotificationType } from '../../models/notification.model';
import { dateLocaleFor } from '../../utils/date-locale';
import { foldForSearch } from '../../utils/search-fold';

const TYPE_ICONS: Record<NotificationType, string> = {
  launch: 'pi pi-sparkles',
  feature: 'pi pi-star',
  release: 'pi pi-bolt',
  bugfix: 'pi pi-wrench',
  article: 'pi pi-file',
  blog: 'pi pi-pencil',
  demo: 'pi pi-play',
  glossary: 'pi pi-book',
  timeline: 'pi pi-clock',
  tool: 'pi pi-th-large',
  language: 'pi pi-flag',
  quality: 'pi pi-check-circle',
  maintenance: 'pi pi-cog',
};

/**
 * Per-type accent. CursorGlow reads this via --cursor-glow-color.
 * Names match `src/styles/design-tokens.scss` (unprefixed Optimus UI palette
 * re-exports — fixed colors that do NOT auto-flip in dark mode).
 */
const TYPE_GLOW_COLOR: Record<NotificationType, string> = {
  launch: 'var(--p-rose-500)',
  feature: 'var(--p-amber-500)',
  release: 'var(--p-yellow-500)',
  bugfix: 'var(--p-red-500)',
  article: 'var(--p-blue-500)',
  blog: 'var(--p-pink-500)',
  demo: 'var(--p-cyan-500)',
  glossary: 'var(--p-emerald-500)',
  timeline: 'var(--p-teal-500)',
  tool: 'var(--p-orange-500)',
  language: 'var(--p-sky-500)',
  quality: 'var(--p-green-500)',
  maintenance: 'var(--p-slate-500)',
};

const FALLBACK_ICON = 'pi pi-info-circle';
const FALLBACK_GLOW = 'var(--primary-color)';

interface MonthGroup {
  key: string; // "YYYY-MM"
  domId: string; // "month-YYYY-MM" — ToC scroll target
  label: string; // "2026-05 · May 2026"
  shortLabel: string; // "May 2026" — ToC label
  items: NotificationEntry[];
}

/**
 * Vereinheitlichte Section-Form: Pinned-Sektion und Monats-Gruppen
 * werden im Template ueber EINE @for iteriert, damit die <li>-Markup
 * nicht dupliziert werden muss.
 */
interface UpdateSection {
  id: string;
  label: string;
  isPinned: boolean;
  items: NotificationEntry[];
}

type Filter = 'all' | NotificationType;

@Component({
  selector: 'app-news',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    PageHeaderComponent,
    CursorGlowDirective,
    TableOfContentsFabComponent,
    SimpleEasyLanguageFabComponent,
    FabStackComponent,
  ],
  template: `
    <section class="updates-page">
      <app-page-header titleKey="news.page.title" subtitleKey="news.page.subtitle"></app-page-header>

      <!-- Filter toolbar — same shell as /blog: search input + p-select
           dropdown in a deterministic CSS Grid. Clean replaces the previous
           scrollable pill row which felt out of place next to the rest of
           the portal. -->
      <div class="news-toolbar">
        <div class="filters-grid">
          <div class="filter-cell filter-search">
            <span class="search-wrapper">
              <i class="pi pi-search search-icon" aria-hidden="true"></i>
              <input
                type="search"
                class="search-input"
                [attr.aria-label]="t('news.search.label')"
                [placeholder]="t('news.search.placeholder')"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
              />
              @if (searchQuery()) {
                <button
                  type="button"
                  class="search-clear"
                  [attr.aria-label]="t('news.search.clear')"
                  (click)="clearSearch()"
                >
                  <i class="pi pi-times" aria-hidden="true"></i>
                </button>
              }
            </span>
          </div>

          @if (availableTypes().length > 0) {
            <div class="filter-cell filter-type">
              <!-- The name MUST come from [ariaLabelledBy]: p-select's focusable element is a
                   <span role="combobox">, so aria-label on the host lands on a roleless
                   element and the current value is announced instead of the label. -->
              <span class="sr-only" id="news-type-filter-label">{{ t('news.filters.label') }}</span>
              <p-select
                [options]="typeFilterOptions()"
                [ngModel]="activeFilter()"
                (ngModelChange)="selectFilter($event)"
                optionLabel="label"
                optionValue="value"
                styleClass="filter-dropdown"
                [appendTo]="'body'"
                [ariaLabelledBy]="'news-type-filter-label'"
              >
                <ng-template let-selected #selectedItem>
                  @if (selected) {
                    <span class="dropdown-option">
                      @if (selected.icon) {
                        <i [class]="selected.icon" aria-hidden="true"></i>
                      }
                      {{ selected.label }}
                    </span>
                  }
                </ng-template>
                <ng-template let-option #item>
                  <span class="dropdown-option">
                    @if (option.icon) {
                      <i [class]="option.icon" aria-hidden="true"></i>
                    }
                    {{ option.label }}
                  </span>
                </ng-template>
              </p-select>
            </div>
          }
        </div>
      </div>

      <div class="updates-result-count" aria-live="polite" aria-atomic="true">
        {{ resultCountLabel() }}
      </div>

      @if (sections().length === 0) {
        <div class="updates-empty">
          <p class="updates-empty-msg">{{ t('news.empty.message') }}</p>
          @if (hasActiveFilters()) {
            <p class="updates-empty-context">{{ activeFiltersLabel() }}</p>
            <button type="button" class="updates-empty-reset" (click)="resetFilters()">
              <i class="pi pi-refresh" aria-hidden="true"></i>
              {{ t('news.empty.reset') }}
            </button>
          }
        </div>
      } @else {
        @for (section of sections(); track section.id) {
          <section class="month-group" [class.pinned-group]="section.isPinned" [id]="section.id">
            <h2 class="month-heading" [class.pinned-heading]="section.isPinned">
              @if (section.isPinned) {
                <i class="pi pi-bookmark-fill" aria-hidden="true"></i>
              }
              {{ section.label }}
            </h2>
            <ul class="update-list">
              @for (n of section.items; track n.id) {
                <li
                  class="update-item"
                  [class.is-pinned]="n.pinned"
                  [class.is-new]="isNewSinceVisit(n.id)"
                  [attr.data-id]="n.id"
                  [attr.data-type]="n.type"
                  appCursorGlow
                  [style.--cursor-glow-color]="glowColorForType(n.type)"
                  [style.--type-accent]="glowColorForType(n.type)"
                >
                  <div class="update-stamp">
                    <div class="update-icon-wrap" [attr.aria-label]="t('news.filters.' + n.type)">
                      <i class="update-icon {{ n.icon || iconForType(n.type) }}" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div class="update-body">
                    <div class="update-meta">
                      <time
                        class="update-time"
                        [attr.datetime]="n.publishedAt"
                        [attr.title]="formatDateLong(n.publishedAt)"
                      >
                        {{ formatDate(n.publishedAt) }}
                      </time>
                      <span class="update-type-tag">{{ t('news.filters.' + n.type) }}</span>
                      @if (isNewSinceVisit(n.id)) {
                        <span class="update-new-tag" [attr.aria-label]="t('news.new.aria')">
                          <span class="update-new-dot" aria-hidden="true"></span>
                          {{ t('news.new.label') }}
                        </span>
                      }
                      @if (n.pinned && !section.isPinned) {
                        <span class="update-pinned-tag" [attr.aria-label]="t('news.pinned')">
                          <i class="pi pi-bookmark-fill" aria-hidden="true"></i>
                          {{ t('news.pinned') }}
                        </span>
                      }
                    </div>
                    <h3 class="update-title" [id]="'news-title-' + n.id">{{ t(n.titleKey) }}</h3>
                    <p class="update-description">{{ t(n.descriptionKey) }}</p>
                    @if (n.link) {
                      <!-- Outlined p-button — matcht das Standard-CTA-Pattern
                           der Showcase-Reihen auf /home (.showcase-cta) und
                           Interview-Liste (.interview-button). Aria-Label
                           kombiniert CTA-Text + Eintrags-Titel, damit
                           Screenreader pro Karte ein eindeutiges Ziel
                           hoeren ("Demo starten: Evolutionsalgorithmus-
                           Demo: Bugfix eingespielt") statt drei mal denselben
                           Text. -->
                      <p-button
                        [label]="t(n.linkLabelKey || 'notifications.cta.open')"
                        icon="pi pi-arrow-right"
                        iconPos="right"
                        [routerLink]="n.link"
                        [queryParams]="n.linkQueryParams || undefined"
                        [fragment]="n.linkFragment || undefined"
                        [outlined]="true"
                        styleClass="news-cta"
                        [ariaLabel]="ctaAriaLabel(n)"
                      >
                      </p-button>
                    }
                    @if (n.links && n.links.length > 0) {
                      <ul class="update-chips">
                        @for (lnk of visibleChips(n); track lnk.route) {
                          <li>
                            <a
                              class="update-chip"
                              [routerLink]="lnk.route"
                              [style.--chip-accent]="glowColorForType(n.type)"
                            >
                              <span class="update-chip-icon" aria-hidden="true">
                                <i class="{{ lnk.icon || iconForType(n.type) }}"></i>
                              </span>
                              <span class="update-chip-label">{{ t(lnk.labelKey) }}</span>
                              <i class="pi pi-arrow-up-right update-chip-arrow" aria-hidden="true"></i>
                            </a>
                          </li>
                        }
                        @if (hiddenChipCount(n) > 0) {
                          <li>
                            <button type="button" class="update-chip update-chip-toggle" (click)="toggleChips(n.id)">
                              + {{ hiddenChipCount(n) }} {{ t('news.chips.more') }}
                            </button>
                          </li>
                        }
                        @if (isChipExpanded(n.id) && n.links.length > CHIP_LIMIT) {
                          <li>
                            <button type="button" class="update-chip update-chip-toggle" (click)="toggleChips(n.id)">
                              {{ t('news.chips.less') }}
                            </button>
                          </li>
                        }
                      </ul>
                    }
                  </div>
                </li>
              }
            </ul>
          </section>
        }
      }

      <app-fab-stack>
        <app-table-of-contents-fab [items]="tocItems()" [title]="t('news.toc.title')" tocId="updates-months">
        </app-table-of-contents-fab>
        <app-simple-easy-language-fab contentId="news" contentType="article"> </app-simple-easy-language-fab>
      </app-fab-stack>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .updates-page {
        max-width: 860px;
        margin: 0 auto;
        padding: 0 1rem 5rem;
      }

      /* ── Filter toolbar (mirrors /blog blog-toolbar pattern) ───────────── */
      .news-toolbar {
        margin: 1.25rem 0 1rem;
        padding: 0.75rem 1rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
      }
      .news-toolbar .filters-grid {
        display: grid;
        gap: 0.75rem;
        align-items: center;
        grid-template-columns: 1fr;
        grid-template-areas: 'search' 'type';
      }
      @media (min-width: 720px) {
        .news-toolbar .filters-grid {
          grid-template-columns: minmax(220px, 1fr) minmax(180px, 240px);
          grid-template-areas: 'search type';
        }
      }
      .news-toolbar .filter-cell {
        min-width: 0;
      }
      .news-toolbar .filter-search {
        grid-area: search;
      }
      .news-toolbar .filter-type {
        grid-area: type;
      }

      /* Search input: icon inside, optional clear button on the right. */
      .news-toolbar .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
      }
      .news-toolbar .search-icon {
        /* Position the icon by spanning the full input height and centering
         the glyph via line-height. This is more deterministic than
         top:50%/translateY(-50%) for icon fonts: OpenNG Icons' glyphs sit
         a few px below the geometric center of their EM box, and
         align-items: center on a tiny 16×16 box doesn't compensate.
         Using line-height = input height places the glyph at the line
         baseline of a 40px-tall line, which lines up with the input
         placeholder visually. */
        position: absolute;
        left: 14px;
        top: 0;
        height: 40px;
        line-height: 40px;
        width: 16px;
        text-align: center;
        color: var(--text-color-secondary);
        pointer-events: none;
        font-size: 0.9rem;
      }
      .news-toolbar .search-input {
        width: 100%;
        height: 40px;
        padding: 0 2.5rem 0 2.5rem;
        background: var(--surface-0);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        color: var(--text-color);
        font-size: 0.95rem;
        transition:
          border-color 0.15s,
          box-shadow 0.15s;
        box-sizing: border-box;
      }
      .news-toolbar .search-input:focus {
        outline: none;
        border-color: var(--primary-color-fg);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 25%, transparent);
      }
      .news-toolbar .search-clear {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--text-color-secondary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .news-toolbar .search-clear:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      /* p-select dropdown styling — match the search input height/border so
       the two cells read as a single control row. */
      .news-toolbar .filter-dropdown {
        width: 100%;
      }
      .news-toolbar .filter-dropdown.p-select {
        width: 100%;
        height: 40px;
      }
      .news-toolbar .dropdown-option {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        line-height: 1;
      }
      .news-toolbar .dropdown-option i {
        font-size: 0.9rem;
        color: var(--p-orange-600, var(--primary-color));
      }

      /* ── Result-Count (aria-live polite) ──────────────────────────────── */
      .updates-result-count {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        padding: 0 0.25rem 0.4rem;
        min-height: 1.2em; /* Layout-Stabilitaet wenn Text wechselt */
      }

      /* ── Empty state ───────────────────────────────────────────────────── */
      .updates-empty {
        padding: 3rem 1rem;
        text-align: center;
        color: var(--text-color-secondary);
        font-size: 0.95rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.85rem;
      }
      .updates-empty-msg {
        margin: 0;
      }
      .updates-empty-context {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        opacity: 0.85;
      }
      .updates-empty-reset {
        appearance: none;
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.5rem 1rem;
        border: 1px solid var(--primary-color);
        border-radius: 999px;
        background: transparent;
        color: var(--primary-color);
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
        transition:
          background 0.18s ease,
          color 0.18s ease;
      }
      .updates-empty-reset:hover,
      .updates-empty-reset:focus-visible {
        background: var(--primary-color);
        color: var(--primary-color-text, #fff);
      }
      .updates-empty-reset:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* ── Month groups ──────────────────────────────────────────────────── */
      .month-group {
        margin: 1.5rem 0 2.5rem;
        scroll-margin-top: 5rem; /* offset sticky header for ToC anchor */
      }
      .month-heading {
        display: flex;
        align-items: baseline;
        gap: 0.85rem;
        margin: 2.5rem 0 1.25rem;
        padding-bottom: 0;
        border-bottom: none;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-color);
        text-transform: none;
        letter-spacing: -0.01em;
      }
      .month-heading::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--surface-border);
      }
      .month-group:first-of-type .month-heading {
        margin-top: 1rem;
      }
      .pinned-heading {
        color: var(--p-amber-600);
      }
      .pinned-heading i {
        color: var(--p-amber-500);
        font-size: 1.1rem;
      }
      .pinned-group {
        scroll-margin-top: 5rem;
      }
      @media (max-width: 720px) {
        .month-heading {
          font-size: 1.2rem;
          margin-top: 2rem;
        }
      }

      .update-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }

      /* ── Chip-Toggle Button (mehr/weniger Chips) ──────────────────────── */
      .update-chip-toggle {
        appearance: none;
        cursor: pointer;
        font-family: inherit;
        font-weight: 600;
        color: var(--text-color-secondary);
      }
      .update-chip-toggle:hover,
      .update-chip-toggle:focus-visible {
        color: var(--text-color);
        border-color: var(--text-color-secondary);
      }

      /* ── Update card ──────────────────────────────────────────────────── */
      /* Pseudo-elements ::before/::after are reserved for the global
       CursorGlow directive — do NOT use them here, or the border ring
       and background fill of the cursor-glow stop working. The single
       remaining decorative layer (soft radial accent in the top-right
       corner) is layered into background-image so the cursor-glow stays
       the dominant ::before/::after consumer. Top-stripe and diagonal
       tint were dropped 2026-05-09 — they made cards feel like Discord
       cards rather than a portal news feed. */
      .update-item {
        position: relative;
        display: grid;
        grid-template-columns: 56px 1fr;
        gap: 1.1rem;
        padding: 1.1rem 1.3rem;
        background-color: var(--surface-card);
        background-image: radial-gradient(
          circle at 100% 0%,
          color-mix(in srgb, var(--type-accent) 14%, transparent) 0%,
          transparent 38%
        );
        background-repeat: no-repeat;
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        transition: border-color 0.18s ease;
      }
      .update-item.is-pinned {
        border-color: color-mix(in srgb, var(--type-accent) 35%, var(--surface-border));
      }
      .update-item:hover,
      .update-item.is-pinned:hover {
        border-color: color-mix(in srgb, var(--type-accent) 55%, var(--surface-border));
      }

      /* ── Left "stamp" column (icon only — type-label moved into meta row) ── */
      .update-stamp {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 0.15rem;
      }
      .update-icon-wrap {
        position: relative;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: color-mix(in srgb, var(--type-accent) 12%, var(--surface-card));
        color: var(--type-accent);
        border: 1px solid color-mix(in srgb, var(--type-accent) 22%, transparent);
      }
      .update-icon {
        font-size: 1.05rem;
      }

      /* ── Right body column ────────────────────────────────────────────── */
      .update-body {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 0;
      }
      .update-meta {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        font-size: 0.78rem;
        color: var(--text-color-secondary);
      }
      .update-time {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-variant-numeric: tabular-nums;
      }
      .update-type-tag {
        /* Tiny inline label that names the entry's type ("Bugfix", "Artikel", …).
         Replaces the old top-stripe + diagonal-tint as the primary type
         signal. Foreground is the accent so it ties to the icon-wrap, but
         the background stays neutral so cards don't look like colored
         confetti when stacked. */
        display: inline-flex;
        align-items: center;
        padding: 1px 8px;
        border-radius: 999px;
        background: color-mix(in srgb, var(--type-accent) 10%, var(--surface-0));
        color: color-mix(in srgb, var(--type-accent) 75%, var(--text-color));
        border: 1px solid color-mix(in srgb, var(--type-accent) 28%, var(--surface-border));
        font-weight: 600;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
      }
      /* "Neu seit letztem Besuch"-Tag — Snapshot-State, bleibt fuer die ganze
       Session sichtbar auch nachdem markPopoverOpened() den Bell-Counter
       resettet hat. Eigene Farbe (Primary) statt --type-accent damit der
       Marker konsistent erkennbar ist. */
      .update-new-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 2px 9px;
        border-radius: 999px;
        background: var(--primary-color);
        color: var(--primary-color-text, #fff);
        font-weight: 700;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .update-new-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
      .update-item.is-new {
        border-left-width: 3px;
        border-left-color: var(--primary-color);
      }

      .update-pinned-tag {
        /* Decoupled from --type-accent on purpose: "pinned" is editorial state,
         not a content type. Solid surface fill + theme text guarantees
         WCAG AA contrast in both light and dark mode regardless of which
         accent color the card carries. The pin icon picks up the accent
         so it still ties visually to the card. */
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        padding: 2px 9px;
        border-radius: 999px;
        background: var(--surface-100, var(--surface-card));
        color: var(--text-color);
        border: 1px solid var(--surface-border);
        font-weight: 700;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .update-pinned-tag i {
        font-size: 0.7rem;
        color: var(--type-accent);
      }

      .update-title {
        /* h3 reset */
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text-color);
        line-height: 1.3;
        letter-spacing: -0.005em;
      }
      .update-description {
        margin: 0;
        font-size: 0.95rem;
        color: var(--text-color-secondary);
        line-height: 1.6;
      }

      /* ── Outlined p-button CTA (matches /home .showcase-cta pattern) ───── */
      /* Wir benutzen den Standard Optimus UI outlined p-button und tinten ihn
       per --type-accent passend zur Karte. Layout-mäßig nur align-self
       und margin-top setzen — den Rest macht Optimus UI. */
      .update-body p-button {
        align-self: flex-start;
        margin-top: 0.85rem;
      }
      .update-body .news-cta.p-button {
        font-weight: 600;
        color: var(--type-accent);
        border-color: var(--type-accent);
      }
      .update-body .news-cta.p-button:not(:disabled):hover,
      .update-body .news-cta.p-button:not(:disabled):focus-visible {
        color: var(--type-accent);
        border-color: var(--type-accent);
        background: color-mix(in srgb, var(--type-accent) 8%, transparent);
      }

      /* ── Link chips (aggregated entries) ──────────────────────────────── */
      .update-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin: 0.65rem 0 0;
        padding: 0;
        list-style: none;
      }
      .update-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 5px 12px 5px 5px;
        background: var(--surface-card);
        color: var(--text-color);
        border: 1px solid color-mix(in srgb, var(--chip-accent) 35%, var(--surface-border));
        border-radius: 999px;
        font-size: 0.82rem;
        font-weight: 500;
        text-decoration: none;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        transition: all 0.18s ease;
      }
      .update-chip-icon {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: color-mix(in srgb, var(--chip-accent) 18%, var(--surface-card));
        color: var(--chip-accent);
        font-size: 0.65rem;
        transition:
          background 0.18s ease,
          color 0.18s ease;
      }
      .update-chip-icon i {
        font-size: 0.65rem;
      }
      .update-chip-arrow {
        font-size: 0.65rem;
        opacity: 0.5;
        margin-left: 0.1rem;
        transition:
          opacity 0.18s ease,
          transform 0.18s ease;
      }
      .update-chip:hover,
      .update-chip:focus-visible {
        transform: translateY(-1px);
        border-color: var(--chip-accent);
        box-shadow: 0 6px 14px -4px color-mix(in srgb, var(--chip-accent) 35%, transparent);
      }
      .update-chip:focus-visible {
        outline: 2px solid var(--chip-accent);
        outline-offset: 2px;
      }
      .update-chip:hover .update-chip-icon,
      .update-chip:focus-visible .update-chip-icon {
        background: var(--chip-accent);
        color: #fff;
      }
      .update-chip:hover .update-chip-arrow,
      .update-chip:focus-visible .update-chip-arrow {
        opacity: 1;
        transform: translate(2px, -2px);
      }

      /* ── Mobile ────────────────────────────────────────────────────────── */
      @media (max-width: 720px) {
        .update-item {
          grid-template-columns: 36px 1fr;
          gap: 0.85rem;
          padding: 0.95rem 1rem;
        }
        .update-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 9px;
        }
        .update-icon {
          font-size: 0.95rem;
        }
        .update-title {
          font-size: 1.05rem;
        }
        /* Pill-CTAs nehmen die volle Body-Breite ein — auf Phones ist
         der angedeutete „Restplatz" rechts vom Button keine Affordance,
         sondern wirkt nur unfertig. Volle Breite + zentrierte Beschriftung
         spiegelt den Mobile-Pattern aus dem Rest des Portals. */
        .update-body p-button {
          align-self: stretch;
        }
        .update-body .news-cta.p-button {
          width: 100%;
          justify-content: center;
        }
      }

      /* ── Reduced motion ───────────────────────────────────────────────── */
      @media (prefers-reduced-motion: reduce) {
        .update-item,
        .update-chip,
        .update-chip-arrow {
          transition: none;
        }
        .update-chip:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class NewsComponent {
  service = inject(NotificationService);
  private translationService = inject(TranslationService);

  activeFilter = signal<Filter>('all');
  searchQuery = signal<string>('');

  /**
   * Snapshot der unread-IDs zum Mount-Zeitpunkt. Bleibt fuer die ganze
   * Session stabil, damit "Neu"-Marker sichtbar bleiben auch nachdem
   * `markAllSeen()` (siehe markArchiveVisited) den Bell-Counter resettet.
   */
  private wasNewOnVisitSig = signal<Set<string>>(new Set());

  constructor() {
    // afterNextRender ist Browser-only → SSR bleibt sauber.
    afterNextRender(() => this.markArchiveVisited());
  }

  /**
   * Visiting the /news archive marks the whole backlog as seen (resets the bell
   * badge) while preserving this page's own "new since visit" markers. Public so
   * unit tests can drive it without the render lifecycle (mirrors
   * NotificationService.hydrate()).
   */
  markArchiveVisited(): void {
    // 1. Snapshot ZUERST: erfasst was vor dem Reset noch unread war, damit die
    //    "Neu"-Marker den Badge-Reset ueberleben.
    this.snapshotUnreadOnVisit();
    // 2. Backlog als gesehen markieren → Bell-Counter resettet. (Frueher
    //    markPopoverOpened(), das den Snapshot einfror und den Badge bei
    //    direktem /news-Besuch stehen liess.)
    this.service.markAllSeen();
  }

  private snapshotUnreadOnVisit(): void {
    const ids = new Set<string>();
    for (const n of this.service.allNotifications()) {
      if (this.service.isUnread(n)) ids.add(n.id);
    }
    this.wasNewOnVisitSig.set(ids);
  }

  isNewSinceVisit(id: string): boolean {
    return this.wasNewOnVisitSig().has(id);
  }

  /** Aggregierte Eintraege mit vielen Chips zeigen erste N + "+M weitere"-Toggle. */
  readonly CHIP_LIMIT = 5;
  private chipExpandedSig = signal<Set<string>>(new Set());

  visibleChips(n: NotificationEntry): NotificationLink[] {
    if (!n.links) return [];
    if (this.chipExpandedSig().has(n.id)) return n.links;
    return n.links.slice(0, this.CHIP_LIMIT);
  }

  hiddenChipCount(n: NotificationEntry): number {
    if (!n.links || this.chipExpandedSig().has(n.id)) return 0;
    return Math.max(0, n.links.length - this.CHIP_LIMIT);
  }

  isChipExpanded(id: string): boolean {
    return this.chipExpandedSig().has(id);
  }

  toggleChips(id: string): void {
    this.chipExpandedSig.update((set) => {
      const next = new Set(set);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  availableTypes = computed<NotificationType[]>(() => {
    const types = new Set<NotificationType>();
    for (const n of this.service.allNotifications()) types.add(n.type);
    return [...types].sort((a, b) => this.typeOrder(a) - this.typeOrder(b));
  });

  /**
   * Optionen fuer den Type-Filter-Dropdown (analog zu /blog filter-dropdown):
   * 'all' als erstes Item, dann die in den Eintraegen tatsaechlich vorkommenden
   * Types in stable Order. Icon nur fuer Type-Items, 'all' bleibt iconlos.
   */
  typeFilterOptions = computed<{ label: string; value: Filter; icon?: string }[]>(() => {
    const options: { label: string; value: Filter; icon?: string }[] = [
      { label: this.t('news.filters.all'), value: 'all' },
    ];
    for (const type of this.availableTypes()) {
      options.push({
        label: this.t('news.filters.' + type),
        value: type,
        icon: this.iconForType(type),
      });
    }
    return options;
  });

  filteredNotifications = computed<NotificationEntry[]>(() => {
    const filter = this.activeFilter();
    // Folded on both sides, so an Easy-German "Sprach·modell" is found by "Sprachmodell".
    const query = foldForSearch(this.searchQuery().trim());
    let list = this.service.allNotifications();
    if (filter !== 'all') list = list.filter((n) => n.type === filter);
    if (query) {
      list = list.filter((n) =>
        [this.t(n.titleKey), this.t(n.descriptionKey), n.titleKey, n.descriptionKey].some((field) =>
          foldForSearch(field).includes(query),
        ),
      );
    }
    return list;
  });

  /** Pinned-Items werden aus der Chronologie ausgegliedert in eine eigene Sektion oben. */
  pinnedNotifications = computed<NotificationEntry[]>(() => this.filteredNotifications().filter((n) => n.pinned));

  /**
   * Chronologie-Stream — pinned-Items bleiben drin, sodass die Liste
   * zeitlich vollstaendig ist. Sie tauchen zusaetzlich in der Pinned-
   * Sektion oben auf (Sichtbarkeit), erscheinen aber auch hier am
   * Veroeffentlichungsdatum mit einem "Angeheftet"-Tag (siehe Template).
   */
  chronologicalNotifications = computed<NotificationEntry[]>(() => this.filteredNotifications());

  groupedByMonth = computed<MonthGroup[]>(() => {
    const groups = new Map<string, NotificationEntry[]>();
    for (const n of this.chronologicalNotifications()) {
      const key = n.publishedAt.substring(0, 7); // "YYYY-MM"
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(n);
    }
    return [...groups.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, items]) => {
        // Innerhalb eines Monats rein chronologisch sortieren (desc). Der
        // globale pinned-first-Sort von NotificationService.allNotifications
        // würde sonst Pinned-Items an die Spitze des Monats schieben — wir
        // wollen sie aber an ihrer natürlichen Position im Monat haben (die
        // Pinned-Sektion ganz oben übernimmt die Sichtbarkeits-Rolle).
        items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
        const label = this.formatMonth(key);
        return {
          key,
          domId: `month-${key}`,
          label,
          shortLabel: label,
          items,
        };
      });
  });

  tocItems = computed<TocItem[]>(() => {
    const items: TocItem[] = this.groupedByMonth().map((g) => ({
      id: g.domId,
      label: g.shortLabel,
    }));
    if (this.pinnedNotifications().length > 0) {
      items.unshift({ id: 'pinned', label: this.t('news.pinnedSection') });
    }
    return items;
  });

  /**
   * Result-Count-Label fuer aria-live Region. "12 von 87 Eintraegen" wenn
   * Filter aktiv, sonst nur "87 Eintraege". Wird beim Filter-Klick und
   * Such-Tippen automatisch von Screenreadern angesagt (polite).
   */
  resultCountLabel = computed<string>(() => {
    const total = this.service.allNotifications().length;
    const filtered = this.filteredNotifications().length;
    if (filtered === total) {
      return this.t('news.results.allCount').replace('{n}', String(total));
    }
    return this.t('news.results.filteredCount').replace('{n}', String(filtered)).replace('{total}', String(total));
  });

  /** Pinned-Sektion (sofern Items vorhanden) + Monats-Gruppen, in einer Liste. */
  sections = computed<UpdateSection[]>(() => {
    const out: UpdateSection[] = [];
    const pinned = this.pinnedNotifications();
    if (pinned.length > 0) {
      out.push({
        id: 'pinned',
        label: this.t('news.pinnedSection'),
        isPinned: true,
        items: pinned,
      });
    }
    for (const g of this.groupedByMonth()) {
      out.push({ id: g.domId, label: g.label, isPinned: false, items: g.items });
    }
    return out;
  });

  selectFilter(filter: Filter): void {
    this.activeFilter.set(filter);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  hasActiveFilters(): boolean {
    return this.activeFilter() !== 'all' || this.searchQuery().trim().length > 0;
  }

  /** Mensch-lesbares Label fuer aktive Filter ("Filter: Tools · Suche: ki"). */
  activeFiltersLabel(): string {
    const parts: string[] = [];
    if (this.activeFilter() !== 'all') {
      parts.push(`${this.t('news.empty.activeFilter')}: ${this.t('news.filters.' + this.activeFilter())}`);
    }
    const q = this.searchQuery().trim();
    if (q) {
      parts.push(`${this.t('news.empty.activeSearch')}: "${q}"`);
    }
    return parts.join(' · ');
  }

  resetFilters(): void {
    this.activeFilter.set('all');
    this.searchQuery.set('');
  }

  /**
   * Distinct accessible name fuer den CTA-Button: kombiniert Label
   * + Eintrags-Titel. Sonst hoert der Screenreader z.B. drei mal "Ansehen"
   * auf einer Seite mit drei verlinkten Karten. Statt aria-labelledby
   * (waere bei p-button kompliziert), bauen wir den Text einmal hier.
   */
  ctaAriaLabel(n: NotificationEntry): string {
    const label = this.t(n.linkLabelKey || 'notifications.cta.open');
    const title = this.t(n.titleKey);
    return `${label}: ${title}`;
  }

  iconForType(type: NotificationType): string {
    return TYPE_ICONS[type] ?? FALLBACK_ICON;
  }

  glowColorForType(type: NotificationType): string {
    return TYPE_GLOW_COLOR[type] ?? FALLBACK_GLOW;
  }

  formatRelative(iso: string): string {
    const ms = Date.now() - new Date(iso).getTime();
    const sec = Math.round(ms / 1000);
    if (Math.abs(sec) < 60) return this.rtf().format(-sec, 'second');
    const min = Math.round(sec / 60);
    if (Math.abs(min) < 60) return this.rtf().format(-min, 'minute');
    const hour = Math.round(min / 60);
    if (Math.abs(hour) < 24) return this.rtf().format(-hour, 'hour');
    const day = Math.round(hour / 24);
    if (Math.abs(day) < 30) return this.rtf().format(-day, 'day');
    const month = Math.round(day / 30);
    if (Math.abs(month) < 12) return this.rtf().format(-month, 'month');
    return this.rtf().format(-Math.round(month / 12), 'year');
  }

  /**
   * Hybrid: <7 Tage relativ ("vor 5 Stunden"), danach absolut ("5. Apr 2026").
   * Vermeidet die Verdopplung mit der Monats-Gruppierung. Volle Form fuer
   * Hover-Title liefert formatDateLong().
   */
  formatDate(iso: string): string {
    const date = new Date(iso);
    const ageDays = (Date.now() - date.getTime()) / 86_400_000;
    if (ageDays < 7) return this.formatRelative(iso);
    const lang = dateLocaleFor(this.translationService.currentIntlLocale);
    try {
      return date.toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return iso.substring(0, 10);
    }
  }

  formatDateLong(iso: string): string {
    const date = new Date(iso);
    const lang = dateLocaleFor(this.translationService.currentIntlLocale);
    try {
      return date.toLocaleDateString(lang, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Returns the localized month label (e.g. "Mai 2026", "May 2026").
   * The raw YYYY-MM key remains on the section's DOM id (`month-YYYY-MM`),
   * which is what the ToC and tests rely on.
   */
  private formatMonth(yearMonth: string): string {
    const [year, month] = yearMonth.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    const lang = dateLocaleFor(this.translationService.currentIntlLocale);
    try {
      return date.toLocaleDateString(lang, { year: 'numeric', month: 'long' });
    } catch {
      return `${year}-${month}`;
    }
  }

  private rtf(): Intl.RelativeTimeFormat {
    const lang = this.translationService.currentIntlLocale || 'en';
    return new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  }

  /** Stable display order for filter tabs. */
  private typeOrder(t: NotificationType): number {
    const order: NotificationType[] = [
      'launch',
      'feature',
      'release',
      'bugfix',
      'article',
      'blog',
      'demo',
      'glossary',
      'timeline',
      'tool',
      'language',
      'quality',
      'maintenance',
    ];
    const idx = order.indexOf(t);
    return idx === -1 ? 999 : idx;
  }
}
