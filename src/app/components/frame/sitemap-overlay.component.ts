/**
 * Sitemap overlay — every page, grouped, as a dialog below the header. It is
 * both the "all pages" view (sitemap button, mobile) and the live result list
 * of the omnibar (desktop).
 *
 * Presentational: AppComponent owns whether it is open, whether it is modal,
 * the query and the groups, and handles every request that comes back up.
 * `modal` decides the dialog semantics — aria-modal plus an armed cdkTrapFocus
 * when opened from the sitemap button, neither when it is the omnibar's result
 * list (trapping focus there would lock the input out).
 *
 * The highlight helpers render plain interpolation around a single <mark>;
 * going through [innerHTML] + bypassSecurityTrustHtml froze the page on every
 * keystroke (new SafeHtml per call x 64 labels).
 */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { TranslationService } from '../../services/translation.service';
import { NavigationGroup, NavigationItem } from '../../services/navigation.service';
import { SitemapEmptyStateComponent } from './sitemap-empty-state.component';
import { foldForSearch } from '../../utils/search-fold';

@Component({
  selector: 'app-sitemap-overlay',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CdkTrapFocus, SitemapEmptyStateComponent],
  template: `
    <!-- Sitemap Backdrop -->
    @if (visible()) {
      <div
        class="sitemap-backdrop"
        animate.enter="sitemap-fade-enter"
        animate.leave="sitemap-fade-leave"
        aria-hidden="true"
        (click)="closeRequested.emit()"
      ></div>
    }

    <!-- Sitemap Overlay -->
    @if (visible()) {
      <div
        class="sitemap-overlay"
        animate.enter="sitemap-slide-enter"
        animate.leave="sitemap-slide-leave"
        role="dialog"
        [attr.aria-modal]="modal() ? 'true' : null"
        [cdkTrapFocus]="modal()"
        [attr.aria-labelledby]="'sitemap-heading'"
      >
        <h2 id="sitemap-heading" class="sr-only">{{ translate('app.nav.sitemap') }}</h2>
        <div class="sitemap-content">
          <button
            type="button"
            class="sitemap-close-btn"
            #sitemapCloseBtn
            (click)="closeRequested.emit()"
            [attr.aria-label]="translate('common.close')"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </button>
          <!-- Mobile-only search input: when the header omnibar is hidden
               (≤750 px), the user still needs a way to filter the sitemap.
               This input drives the same searchQuery signal — typing here
               narrows the @for output below in real time. -->
          <div class="sitemap-search-mobile">
            <i class="pi pi-search sitemap-search-icon" aria-hidden="true"></i>
            <input
              type="search"
              class="sitemap-search-input"
              [ngModel]="query()"
              (ngModelChange)="queryChange.emit($event)"
              [placeholder]="translate('app.nav.search')"
              [attr.aria-label]="translate('app.nav.searchPages')"
            />
          </div>
          <div class="sitemap-groups" [class.sitemap-groups--empty]="groups().length === 0">
            @for (group of groups(); track trackByGroupLabel($index, group)) {
              <div class="sitemap-group">
                <div class="sitemap-group-inner">
                  <h3 class="sitemap-group-title">{{ group.label }}</h3>
                  <ul class="sitemap-group-items">
                    @for (item of group.items; track trackByItemRoute($index, item)) {
                      <li class="sitemap-item-wrapper">
                        <button
                          type="button"
                          class="sitemap-item"
                          [class.sitemap-show-more]="item.isShowAllLink"
                          (click)="navigate.emit(item)"
                        >
                          <i [class]="item.icon + ' sitemap-item-icon'" aria-hidden="true"></i>
                          <span class="sitemap-item-text">
                            <span class="sitemap-item-label">
                              @if (hasMatch(item.label)) {
                                <span>{{ labelPre(item.label) }}</span
                                ><mark class="omnibar-hit">{{ labelHit(item.label) }}</mark
                                ><span>{{ labelPost(item.label) }}</span>
                              } @else {
                                <span>{{ item.label }}</span>
                              }
                            </span>
                            @let matched = matchedTerm(item);
                            @if (matched) {
                              <span class="sitemap-item-via"
                                >{{ labelPre(matched) }}<mark class="omnibar-hit">{{ labelHit(matched) }}</mark
                                >{{ labelPost(matched) }}</span
                              >
                            }
                          </span>
                          @if (item.pageId) {
                            <span class="sitemap-item-id">
                              @if (hasMatch(item.pageId)) {
                                <span>{{ labelPre(item.pageId) }}</span
                                ><mark class="omnibar-hit">{{ labelHit(item.pageId) }}</mark
                                ><span>{{ labelPost(item.pageId) }}</span>
                              } @else {
                                <span>{{ item.pageId }}</span>
                              }
                            </span>
                          }
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            } @empty {
              <app-sitemap-empty-state [query]="query()" (clearRequested)="clearRequested.emit()" />
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      app-sitemap-overlay {
        display: contents;
      }

      /* Enter/leave animations (Angular animate.enter / animate.leave, plain
       CSS). Under prefers-reduced-motion the global rule in styles.scss cuts
       them to 0.01ms, so the overlay still opens and closes at once. */
      .sitemap-fade-enter {
        animation: sitemap-fade-in 200ms ease-out;
      }
      .sitemap-fade-leave {
        animation: sitemap-fade-in 200ms ease-in reverse forwards;
      }
      .sitemap-slide-enter {
        animation: sitemap-slide-in 250ms cubic-bezier(0.4, 0, 0.2, 1);
      }
      .sitemap-slide-leave {
        animation: sitemap-slide-out 200ms cubic-bezier(0.4, 0, 1, 1) forwards;
      }
      @keyframes sitemap-fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes sitemap-slide-in {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
      @keyframes sitemap-slide-out {
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }

      /* Sitemap Overlay Styles */
      app-root .sitemap-backdrop {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 999;
        cursor: pointer;
      }

      app-root .sitemap-overlay {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        z-index: 1000;
      }

      app-root .sitemap-content {
        background: var(--surface-card);
        width: 100%;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        /* Prevent any descendant from triggering a horizontal scrollbar —
         empty-state with a pasted long token, multi-column row crossing,
         etc. The vertical scroll handles all legitimate overflow. */
        overflow-x: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-bottom: 1px solid var(--surface-border);
        padding: 1.5rem 2rem;
        position: relative;
      }

      app-root .sitemap-close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 44px;
        height: 44px;
        border: none;
        background: var(--surface-hover);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color-secondary);
        transition: all 0.2s ease;
        z-index: 2;
      }

      app-root .sitemap-close-btn:hover {
        background: var(--surface-border);
        color: var(--text-color);
      }

      /* Mobile-only search inside the sitemap drawer. Hidden on desktop
       since the header omnibar already carries the input. */
      app-root .sitemap-search-mobile {
        display: none;
        position: relative;
        margin: 0 0 1rem 0;
      }

      @media (max-width: 750px) {
        app-root .sitemap-search-mobile {
          display: flex;
          align-items: center;
          height: 44px;
          margin-right: 56px;
        }
      }

      app-root .sitemap-search-icon {
        position: absolute;
        left: 12px;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        color: var(--text-color-secondary);
        pointer-events: none;
        font-size: 0.9rem;
        line-height: 1;
      }

      app-root .sitemap-search-input {
        width: 100%;
        height: 44px;
        padding: 0 14px 0 36px;
        font-size: 0.95rem;
        color: var(--text-color);
        border: 2px solid transparent;
        border-radius: var(--border-radius);
        background: var(--surface-card);
        background-image:
          linear-gradient(var(--surface-card), var(--surface-card)),
          linear-gradient(135deg, var(--primary-fg) 0%, var(--accent-fg) 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        box-sizing: border-box;
        -webkit-appearance: none;
        appearance: none;
      }

      app-root .sitemap-search-input::placeholder {
        color: var(--text-color-secondary);
      }

      app-root .sitemap-search-input:focus {
        outline: none;
        filter: brightness(1.05);
      }

      /* The rule above suppresses the ring for every focus, mouse focus included.
       Keyboard focus gets it back here, in the kit shape (2px solid at 2px
       offset, brand foreground token) -- see a11y-guidelines. Declared after the
       :focus rule because both weigh the same and the later one wins. */
      app-root .sitemap-search-input:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-root .sitemap-search-input::-webkit-search-cancel-button {
        -webkit-appearance: none;
        appearance: none;
      }

      app-root .sitemap-groups {
        /* CSS columns replace masonry-layout for stable, reflow-free layout.
         Items flow top-to-bottom then left-to-right, wrapping into columns.
         This keeps the height compact without requiring a JS positioning
         library, which used to cause a visible reflow flash on close. */
        column-width: 300px;
        column-gap: 20px;
        margin: 0 auto;
        max-width: calc(300px * 5 + 20px * 4);
      }

      app-root .sitemap-group {
        /* Prevent groups from breaking across column boundaries. */
        break-inside: avoid;
        -webkit-column-break-inside: avoid;
        page-break-inside: avoid;
        margin-bottom: 20px;
      }

      /* The first item in a column gets top margin reset so columns align. */
      app-root .sitemap-group:first-child {
        margin-top: 0;
      }

      app-root .sitemap-group-inner {
        background: var(--surface-card);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        width: 100%;
      }

      app-root .sitemap-group-title {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--primary-color-fg);
        margin: 0 0 0.75rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--primary-color);
      }

      app-root .sitemap-group-items {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      app-root .sitemap-item-wrapper {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      app-root .sitemap-item {
        /* Reset button defaults */
        appearance: none;
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        text-align: left;
        width: 100%;
        /* Layout */
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        margin: 0.25rem 0;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: all 0.15s ease;
      }

      app-root .sitemap-item:hover {
        background: var(--surface-hover);
      }

      app-root .sitemap-item:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: var(--border-radius);
      }

      app-root .sitemap-item-icon {
        font-size: 1rem;
        color: var(--primary-color-fg);
        width: 20px;
        flex-shrink: 0;
      }

      /* Wrap label + matchTerm-hint in a column so the hint sits below the
       label without breaking the row layout (icon | text-block | id-pill). */
      app-root .sitemap-item-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      app-root .sitemap-item-label {
        font-size: 0.875rem;
        color: var(--text-color);
      }

      /* matchTerm-only-Treffer: kleine kursive Zeile unter dem Label, zeigt
       nur das matchTerm-Wort mit Highlight — kein Tag-Icon, keine "via"-
       Präposition; das Wort allein erklärt die Verbindung. */
      app-root .sitemap-item-via {
        font-size: 0.7rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      /* Live-search hit highlight inside the sitemap labels, page-id pills
       and the matchTerm hint. Uses a translucent primary tint so it reads
       as "what you typed" without competing with the surface colors. */
      app-root .sitemap-item mark.omnibar-hit,
      app-root .sitemap-item-id mark.omnibar-hit,
      app-root .sitemap-item-via mark.omnibar-hit {
        background: color-mix(in srgb, var(--primary-fg) 28%, transparent);
        color: inherit;
        padding: 0 1px;
        border-radius: 2px;
      }

      app-root .sitemap-item-id {
        font-size: 0.7rem;
        font-family: 'SF Mono', 'Monaco', 'Roboto Mono', monospace;
        background: var(--surface-section);
        color: var(--text-color-secondary);
        padding: 2px 6px;
        border-radius: 3px;
        border: 1px solid var(--surface-border);
        flex-shrink: 0;
      }

      /* "Mehr..." overflow link styling */
      app-root .sitemap-show-more {
        margin-top: 0.25rem;
        border-top: 1px dashed var(--surface-border);
        padding-top: 0.5rem;
        border-radius: 0;
      }

      app-root .sitemap-show-more .sitemap-item-label {
        color: var(--primary-color-fg);
        font-style: italic;
      }

      app-root .sitemap-show-more .sitemap-item-icon {
        color: var(--primary-color-fg);
      }

      /* Empty state — shown when the live filter produces zero matches.
       The wrapper switches to a single-column flex layout so the centered
       message doesn't fight the surrounding multi-column grid. */
      app-root .sitemap-groups--empty {
        column-width: auto;
        column-count: 1;
        max-width: none;
      }

      /* Mobile: Single column layout */
      @media (max-width: 640px) {
        app-root .sitemap-group {
          width: 100%;
        }
      }

      app-root .sitemap-close-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
    `,
  ],
})
export class SitemapOverlayComponent {
  private translationService = inject(TranslationService);

  readonly visible = input(false);
  /** Modal dialog (sitemap button) or non-modal result list (omnibar). */
  readonly modal = input(false);
  /** The live filter text, shared with the omnibar and the mobile input. */
  readonly query = input('');
  readonly groups = input.required<NavigationGroup[]>();

  /** Close button or backdrop. */
  readonly closeRequested = output<void>();
  /** The mobile search input changed. */
  readonly queryChange = output<string>();
  readonly navigate = output<NavigationItem>();
  /** The empty state's "clear search" action. */
  readonly clearRequested = output<void>();

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('sitemapCloseBtn');

  /** Move focus to the close button (SHELL-4); the shell calls this after opening as a modal. */
  focusCloseButton(): void {
    this.closeButton()?.nativeElement?.focus();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  trackByGroupLabel(_index: number, group: NavigationGroup): string {
    return group.label;
  }

  trackByItemRoute(_index: number, item: NavigationItem): string {
    return item.route || item.label;
  }

  hasMatch(text: string | undefined | null): boolean {
    const value = text ?? '';
    const query = foldForSearch(this.query().trim());
    if (!query) return false;
    return foldForSearch(value).includes(query);
  }

  /**
   * When an item matched only via its hidden matchTerms list (the literal
   * query is neither in the label nor in the page-id), return the first
   * matchTerm that contains the query so the template can show a small
   * "via …" hint. Returns null when the visible label/pageId already
   * carries the match — no duplicate hint in that case.
   */
  matchedTerm(item: NavigationItem): string | null {
    // Folded like NavigationService.filterPages, so "code-review" finds "Code·review".
    const query = foldForSearch(this.query().trim());
    if (!query) return null;
    const labelHas = foldForSearch(item.label ?? '').includes(query);
    const idHas = foldForSearch(item.pageId ?? '').includes(query);
    if (labelHas || idHas) return null;
    // Candidates = the page's content-derived corpus (description, tags, linked
    // glossary terms, optional searchTerms booster — already localized) plus any
    // programmatic learning-path terms. Prefer the SHORTEST match so a tag or
    // glossary term wins over a full description sentence.
    const best = [...(item.searchText ?? []), ...(item.matchTerms ?? [])]
      .filter((t) => foldForSearch(t).includes(query))
      .sort((a, b) => a.length - b.length)[0];
    if (!best) return null;
    // A long match can only be the description sentence — the page is already
    // listed, so suppress the noisy chip rather than show a clipped sentence.
    return best.length > 40 ? null : best;
  }

  labelPre(text: string | undefined | null): string {
    const value = text ?? '';
    const query = this.query().trim();
    if (!query) return value;
    const i = value.toLowerCase().indexOf(query.toLowerCase());
    return i === -1 ? value : value.substring(0, i);
  }

  labelHit(text: string | undefined | null): string {
    const value = text ?? '';
    const query = this.query().trim();
    if (!query) return '';
    const i = value.toLowerCase().indexOf(query.toLowerCase());
    return i === -1 ? '' : value.substring(i, i + query.length);
  }

  labelPost(text: string | undefined | null): string {
    const value = text ?? '';
    const query = this.query().trim();
    if (!query) return '';
    const i = value.toLowerCase().indexOf(query.toLowerCase());
    return i === -1 ? '' : value.substring(i + query.length);
  }
}
