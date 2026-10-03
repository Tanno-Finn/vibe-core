import {
  Component,
  Output,
  EventEmitter,
  inject,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NavigationService } from '../../services/navigation.service';
import { TranslationService } from '../../services/translation.service';
import { ToastService } from '../../services/toast.service';

/**
 * Omnibar search input.
 *
 * Plain input — no autocomplete dropdown anymore. The host page (AppComponent)
 * uses (inputFocused) to open the sitemap overlay and (inputChanged) to filter
 * the sitemap's content as the user types. Pressing Enter still routes a
 * 4-character page-id to the corresponding page or triggers the HAL 9000
 * easter egg.
 */
@Component({
  selector: 'app-navigation-dropdown',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule],
  template: `
    <div class="navigation-dropdown-wrapper" role="search" [attr.aria-label]="translate('app.nav.search')">
      <i class="pi pi-search nav-search-icon" aria-hidden="true"></i>

      <input
        #searchInput
        type="search"
        class="omnibar-input"
        [placeholder]="translate('app.nav.search')"
        [(ngModel)]="searchQuery"
        (ngModelChange)="onModelChange($event)"
        (focus)="onFocus()"
        (keyup.enter)="handleEnterKey($event)"
        [attr.aria-label]="translate('app.nav.searchPages')"
        [attr.aria-describedby]="'search-help'"
      />

      @if ((searchQuery || '').length > 0) {
        <button type="button" class="omnibar-clear" [attr.aria-label]="translate('common.clear')" (click)="clear()">
          <i class="pi pi-times" aria-hidden="true"></i>
        </button>
      } @else {
        <button
          type="button"
          class="omnibar-chevron"
          [attr.aria-label]="translate('app.nav.sitemap')"
          (click)="onChevronClick()"
        >
          <i class="pi pi-chevron-down" aria-hidden="true"></i>
        </button>
      }

      <div id="search-help" class="sr-only">
        {{ translate('app.nav.searchHelp') }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-navigation-dropdown .navigation-dropdown-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: 300px;
      }

      app-navigation-dropdown .nav-search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-color-secondary);
        pointer-events: none;
        font-size: 0.9rem;
        z-index: 1;
      }

      /* Plain input dressed up with the same gradient outline as bell, sitemap-button
       and the settings pill. The double-background trick keeps the inner surface
       solid while the border layer carries the gradient. */
      app-navigation-dropdown .omnibar-input {
        width: 100%;
        height: 44px;
        padding: 0 36px 0 36px;
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
        transition: filter 0.15s ease;
        box-sizing: border-box;
        -webkit-appearance: none;
        appearance: none;
      }

      app-navigation-dropdown .omnibar-input::placeholder {
        color: var(--text-color-secondary);
      }

      app-navigation-dropdown .omnibar-input:focus {
        outline: none;
        filter: brightness(1.05);
      }

      /* The rule above suppresses the ring for every focus, mouse focus included.
       Keyboard focus gets it back here, in the kit shape (2px solid at 2px
       offset, brand foreground token) -- see a11y-guidelines. Declared after the
       :focus rule because both weigh the same and the later one wins. */
      app-navigation-dropdown .omnibar-input:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Suppress the native search-cancel button — we render our own pi-times. */
      app-navigation-dropdown .omnibar-input::-webkit-search-cancel-button {
        -webkit-appearance: none;
        appearance: none;
      }

      app-navigation-dropdown .omnibar-clear,
      app-navigation-dropdown .omnibar-chevron {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        color: var(--text-color-secondary);
        border-radius: 50%;
        cursor: pointer;
      }

      app-navigation-dropdown .omnibar-clear:hover,
      app-navigation-dropdown .omnibar-chevron:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      app-navigation-dropdown .omnibar-clear:focus-visible,
      app-navigation-dropdown .omnibar-chevron:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 1px;
      }
    `,
  ],
})
export class NavigationDropdownComponent {
  private navigationService = inject(NavigationService);
  private translationService = inject(TranslationService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  /** Two-way ngModel binding. */
  searchQuery: string = '';

  @Output() inputFocused = new EventEmitter<void>();
  @Output() inputChanged = new EventEmitter<string>();
  @Output() halTriggered = new EventEmitter<void>();

  onFocus(): void {
    this.inputFocused.emit();
  }

  /**
   * Chevron click — same effect as focusing the input. Keeps the
   * affordance for users who expect a dropdown trigger but routes them
   * to the sitemap overlay (we no longer have an autocomplete dropdown).
   */
  onChevronClick(): void {
    this.searchInputRef?.nativeElement.focus();
    this.inputFocused.emit();
  }

  onModelChange(value: string): void {
    this.searchQuery = value;
    this.inputChanged.emit(value ?? '');
  }

  /**
   * Programmatic clear — used by the host (e.g. when the sitemap overlay
   * closes) and by the in-input × button. We *don't* refocus the input
   * here on purpose: refocusing would re-fire (focus) → re-emit
   * inputFocused → the host would re-open the sitemap it just closed.
   */
  clear(): void {
    this.searchQuery = '';
    this.inputChanged.emit('');
    // The host calls this programmatically (sitemap close), outside our own events.
    this.cdr.markForCheck();
  }

  /** Backwards-compat alias retained for callers that previously closed an
   *  autocomplete dropdown. The dropdown is gone; clearing the query is the
   *  meaningful equivalent. */
  closeDropdown(): void {
    this.clear();
  }

  /**
   * Enter-key routing:
   *  - "HAL 9000" → easter egg
   *  - 4-character alphanumeric input → navigate to that page
   *  - otherwise → no-op (sitemap-overlay is the visual filter)
   */
  handleEnterKey(_event: Event): void {
    const input = this.searchQuery?.trim();
    if (!input) return;

    if (input.toUpperCase() === 'HAL 9000') {
      this.checkEasterEgg();
      return;
    }

    if (input.length === 4 && /^[A-Za-z0-9]{4}$/.test(input)) {
      this.navigateToPageId(input);
    }
  }

  private async navigateToPageId(pageId: string): Promise<void> {
    const page = this.navigationService.getPageById(pageId);
    if (page) {
      this.searchQuery = '';
      this.inputChanged.emit('');
      await this.navigationService.navigateToPage(page);
      return;
    }
    this.toastService.showError(this.translate('app.nav.pageNotFound'), this.translate('app.nav.invalidPageId'), {
      duration: 3000,
      closable: true,
    });
  }

  private checkEasterEgg(): void {
    this.searchQuery = '';
    this.inputChanged.emit('');
    this.showHalDialog();
    this.halTriggered.emit();
  }

  private showHalDialog(): void {
    this.toastService.showInfo(this.translate('easterEgg.hal.sorryDave'), this.translate('easterEgg.hal.cantDoThat'), {
      icon: '👁️',
      position: 'top-right',
      duration: 3000,
      closable: true,
    });
    setTimeout(() => {
      this.toastService.showSuccess(
        this.translate('easterEgg.hal.justKidding'),
        this.translate('easterEgg.hal.discovered'),
        { icon: 'pi pi-trophy', position: 'top-right', duration: 5000, closable: true },
      );
    }, 8500);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
