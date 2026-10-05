/**
 * InfoBoxComponent — single shared sidebar info-box renderer for any content
 * page that grows a sidebar.
 *
 * The visual chrome (rounded card, colored title-bar, items list) lives in
 * one place, so pages cannot drift apart (border-radius, per-type colors,
 * list rendering): a single tweak reaches every page that uses it.
 *
 * Box types supported:
 *   - books        → grid of book items (cover image + title + author + buy-link)
 *   - links        → external link list with ↗ glyph + optional description
 *   - sources      → numbered source list (academic-style references)
 *   - references   → alias of sources, accepted from older content
 *   - definitions  → term-definition pairs (alias `definition` accepted)
 *   - info         → free-form items (title + description)
 */
import { Component, Input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Common item shape across all box types — renderer shows what's present. */
export interface InfoBoxItem {
  title?: string;
  description?: string;
  url?: string;
  /** Author name (books, sources). */
  author?: string;
  /** Year (books, sources). */
  year?: string | number;
  /** Cover image / logo path (books, optional links). */
  image?: string;
}

export interface InfoBoxData {
  /** Box type — drives icon, accent color, list-rendering variant. */
  type: 'books' | 'links' | 'sources' | 'references' | 'definitions' | 'definition' | 'info' | string;
  title: string;
  /** Optional intro paragraph rendered above the items. */
  content?: string;
  items?: InfoBoxItem[];
}

@Component({
  selector: 'app-info-box',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  template: `
    @if (box) {
      <div class="info-box" [ngClass]="boxClass()">
        <h3 class="info-box-title">
          <i class="info-box-icon" [ngClass]="iconClass()" aria-hidden="true"></i>
          <span>{{ box.title }}</span>
        </h3>
        <div class="info-box-content">
          @if (box.content) {
            <p class="info-box-intro" [innerHTML]="box.content"></p>
          }

          @if (effectiveType() === 'books' && box.items?.length) {
            <!-- Books are the only type with a structurally-different
                 rendering (cover image left, metadata right). Everything
                 else (links, sources, definitions, info) shares the
                 unified .info-list rendering below. -->
            <div class="books-grid">
              @for (book of box.items; track $index) {
                <div class="book-item">
                  @if (book.image) {
                    <img [src]="book.image" [alt]="(book.title || '') + ' Cover'" class="book-cover" loading="lazy" />
                  }
                  <div class="book-info">
                    @if (book.title) {
                      <h4 class="book-title">{{ book.title }}</h4>
                    }
                    @if (book.author) {
                      <p class="book-author">
                        {{ book.author }}
                        @if (book.year) {
                          , {{ book.year }}
                        }
                      </p>
                    }
                    @if (book.url) {
                      <a
                        [href]="book.url"
                        [target]="isExternal(book.url) ? '_blank' : null"
                        rel="noopener noreferrer"
                        class="book-link"
                      >
                        {{ viewLabel }}
                      </a>
                    }
                  </div>
                </div>
              }
            </div>
          } @else if (box.items?.length) {
            <!-- Unified item rendering for links / sources / references /
                 definitions / info. One markup, one stylesheet, one set
                 of hover/focus states. The whole item is a hover-link
                 when item.url is present so the affordance is obvious;
                 internal URLs (starting with /) keep the default tab,
                 external URLs (http…) open in a new one. Sources type
                 wraps in <ol> for numbering — the ::marker carries the
                 reference number. -->
            <ol class="info-list" [class.numbered]="isNumbered()">
              @for (item of box.items; track $index) {
                <li class="info-item">
                  @if (item.url) {
                    <a
                      [href]="item.url"
                      [target]="isExternal(item.url) ? '_blank' : null"
                      rel="noopener noreferrer"
                      class="info-item-link"
                    >
                      <span class="info-item-title">
                        {{ item.title }}
                        @if (isExternal(item.url)) {
                          <span class="external-arrow" aria-hidden="true">↗</span>
                        }
                      </span>
                      @if (item.author || item.year) {
                        <span class="info-item-meta">
                          @if (item.author) {
                            {{ item.author }}
                          }
                          @if (item.year) {
                            ({{ item.year }})
                          }
                        </span>
                      }
                      @if (item.description) {
                        <span class="info-item-desc">{{ item.description }}</span>
                      }
                    </a>
                  } @else {
                    <span class="info-item-title">{{ item.title }}</span>
                    @if (item.author || item.year) {
                      <span class="info-item-meta">
                        @if (item.author) {
                          {{ item.author }}
                        }
                        @if (item.year) {
                          ({{ item.year }})
                        }
                      </span>
                    }
                    @if (item.description) {
                      <span class="info-item-desc">{{ item.description }}</span>
                    }
                  }
                </li>
              }
            </ol>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* ─── Card ─────────────────────────────────────────────────────────── */
      app-info-box .info-box {
        background: var(--surface-card);
        color: var(--text-color);
        border: 1px solid var(--surface-border);
        border-radius: 16px;
        padding: var(--space-5);
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      }

      app-info-box .info-box-title {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: 1.05rem;
        font-weight: 700;
        margin: 0 0 var(--space-4);
        color: var(--text-color);
        letter-spacing: -0.01em;
      }
      app-info-box .info-box-icon {
        font-size: 1.2rem;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 8px;
        flex-shrink: 0;
      }

      /* Per-type icon color + tinted icon-square, one palette for every
       sidebar. */
      app-info-box .info-box-books .info-box-icon {
        color: var(--p-amber-600, #d97706);
        background: var(--p-amber-50, #fffbeb);
      }
      app-info-box .info-box-links .info-box-icon {
        color: var(--p-blue-600, #2563eb);
        background: var(--p-blue-50, #eff6ff);
      }
      app-info-box .info-box-sources .info-box-icon,
      app-info-box .info-box-references .info-box-icon {
        color: var(--p-rose-600, #e11d48);
        background: var(--p-rose-50, #fff1f2);
      }
      app-info-box .info-box-definitions .info-box-icon,
      app-info-box .info-box-definition .info-box-icon {
        color: var(--p-green-600, #16a34a);
        background: var(--p-green-50, #f0fdf4);
      }
      app-info-box .info-box-info .info-box-icon {
        color: var(--p-cyan-600, #0891b2);
        background: var(--p-cyan-50, #ecfeff);
      }

      app-info-box .info-box-content {
        color: var(--text-color);
        font-size: 0.92rem;
        line-height: 1.55;
      }
      app-info-box .info-box-intro {
        margin: 0 0 var(--space-3);
        color: var(--text-color-secondary);
      }

      /* ─── Books grid ────────────────────────────────────────────────────── */
      app-info-box .books-grid {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }
      app-info-box .book-item {
        display: flex;
        gap: var(--space-3);
        align-items: flex-start;
      }
      app-info-box .book-cover {
        width: 60px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
      }
      app-info-box .book-info {
        flex: 1;
        min-width: 0;
      }
      app-info-box .book-title {
        font-size: 0.92rem;
        font-weight: 600;
        margin: 0 0 var(--space-1);
        color: var(--text-color);
        line-height: 1.3;
      }
      app-info-box .book-author {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-2);
      }
      app-info-box .book-link {
        font-size: 0.85rem;
        color: var(--primary-color-fg, var(--primary-color));
        text-decoration: none;
        font-weight: 500;
      }
      app-info-box .book-link:hover {
        text-decoration: underline;
      }

      /* ─── Unified item list (links / sources / definitions / info) ──────
       One renderer, one stylesheet. Each item is a vertically-stacked
       block: title + optional meta (author/year) + optional description.
       When the item has a URL, the whole block is a hover-link with a
       clear colored title to signal clickability up front (not just on
       hover — that was the user's complaint about info-list reading as
       static text). External links get an inline ↗ arrow. */
      app-info-box .info-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      /* Numbered variant for sources/references. ::marker uses the same
       muted secondary color as the meta text so the number doesn't
       compete with the title. */
      app-info-box .info-list.numbered {
        list-style: decimal inside;
        padding-left: 0;
      }
      app-info-box .info-list.numbered .info-item::marker {
        color: var(--text-color-secondary);
        font-weight: 600;
      }
      app-info-box .info-item {
        margin-bottom: var(--space-3);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid var(--surface-border);
      }
      app-info-box .info-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      app-info-box .info-item-link {
        text-decoration: none;
        color: inherit;
        display: block;
        cursor: pointer;
      }
      /* Title — ALWAYS colored + underlined when item has a URL, so it
       reads as a link even before hover. Pure-text items (no URL) stay
       in the regular text color. */
      app-info-box .info-item-title {
        display: block;
        font-weight: 600;
        font-size: 0.92rem;
        color: var(--text-color);
        line-height: 1.35;
      }
      app-info-box .info-item-link .info-item-title {
        color: var(--primary-color-fg, var(--primary-color));
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 1px;
      }
      app-info-box .info-item-link:hover .info-item-title {
        text-decoration-thickness: 2px;
      }
      app-info-box .external-arrow {
        display: inline-block;
        margin-left: 3px;
        font-size: 0.75rem;
        opacity: 0.85;
      }
      app-info-box .info-item-meta {
        display: block;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        font-style: italic;
        margin-top: 2px;
      }
      app-info-box .info-item-desc {
        display: block;
        margin-top: 4px;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
      }

      /* ─── Dark theme tweaks ─────────────────────────────────────────────── */
      .dark-theme app-info-box .info-box {
        background: var(--surface-100);
      }
    `,
  ],
})
export class InfoBoxComponent {
  /** Pre-resolved box: type + title + content + items.
   *  Caller does the i18n / data merge upstream so this component stays
   *  content-type-agnostic. */
  @Input({ required: true }) box!: InfoBoxData;

  /** Optional override label for the books "view" link.
   *  Default kept generic in English; callers pass a localized string
   *  via [viewLabel]. */
  @Input() viewLabel: string = 'View';

  /** Effective type: normalizes the few legacy aliases. */
  effectiveType(): string {
    const t = (this.box?.type || 'info').toLowerCase();
    if (t === 'definition') return 'definitions';
    if (t === 'references') return 'sources';
    return t;
  }

  /** CSS class for the outer card (drives per-type color). */
  boxClass(): string {
    return 'info-box-' + (this.box?.type || 'info');
  }

  /** PrimeIcon class for the title-bar icon. */
  iconClass(): string {
    const map: Record<string, string> = {
      books: 'pi pi-book',
      links: 'pi pi-link',
      sources: 'pi pi-list',
      references: 'pi pi-list',
      definitions: 'pi pi-bookmark',
      definition: 'pi pi-bookmark',
      info: 'pi pi-info-circle',
    };
    return map[(this.box?.type || 'info').toLowerCase()] || 'pi pi-info-circle';
  }

  /** Numbered list (ol with markers) for sources/references — academic
   *  citation style. Other types stay un-numbered. */
  isNumbered(): boolean {
    const t = this.effectiveType();
    return t === 'sources';
  }

  /** External-link detection: true for absolute http(s) URLs, false for
   *  internal navigation paths (`/de/...`) — controls whether to add
   *  target="_blank" + the ↗ glyph. Internal links get neither so the
   *  user stays in the same tab and the link doesn't pretend to leave
   *  the site. */
  isExternal(url: string | undefined): boolean {
    if (!url) return false;
    return /^https?:\/\//i.test(url);
  }
}
