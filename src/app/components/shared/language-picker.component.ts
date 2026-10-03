/**
 * Language Picker Component
 *
 * Header-mounted language selector for the base languages in
 * src/config/languages.json (each with its Easy variant). The button renders
 * globe + spelled-out native language name + flag + chevron (e.g.
 * `🌐 Deutsch 🇩🇪 ▾`) so visitors can locate their language without first
 * having to read the current UI language. Flags are the kit's own SVGs
 * (services/flags.ts); a language without one shows a code badge instead. Below ≤950 px the name+flag collapse via
 * `hide-lang-text-on-compact`; only the globe remains.
 *
 * Dropdown lists each language by its autonym only, marked with its own
 * `lang`. (An English secondary name in parens, "Deutsch (German)", read
 * the same on every UI language and was dropped; there is no localized
 * language-name key to replace it.) The filter input still matches on the
 * English name, nativeName, and code so users can type either script.
 *
 * Accessibility:
 *   - Button `aria-label` includes the resolved native name (e.g. "Sprache: Deutsch")
 *   - Flags are decorative (`aria-hidden="true"` / `alt=""`) — the native
 *     name carries the accessible label, so screen readers do not double-announce
 *   - `aria-expanded` / `aria-haspopup="dialog"` on the trigger: the popover
 *     holds a filter input, buttons and a switch, not a listbox
 *   - Escape closes the popover and returns focus to the trigger
 */
import {
  Component,
  Input,
  inject,
  signal,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Optimus UI imports
import { ButtonModule } from '@openng/optimus-ui/button';
import { PopoverModule, Popover } from '@openng/optimus-ui/popover';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';

// Services - V2 MIGRATION
import { TranslationService, Language } from '../../services/translation.service';
import { getDisplayAsset, hasFlag } from '../../services/flags';
import { isLanguageBeta } from '../../../config/seo-languages.config';
import { HighlightDirective } from '../../directives/highlight.directive';
import { AppLoadingOverlayComponent } from './app-loading-overlay.component';

@Component({
  selector: 'app-language-picker',
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Ansatz 4: Keine Style-Kapselung
  imports: [
    FormsModule,
    ButtonModule,
    PopoverModule,
    TooltipModule,
    ToggleSwitchModule,
    HighlightDirective,
    AppLoadingOverlayComponent,
  ],
  template: `
    <p-button
      class="language-selector-button globe-button"
      (onClick)="globePanel.toggle($event)"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      [pTooltip]="translate('settings.language.interface')"
      [attr.aria-expanded]="isPopoverOpen"
      [attr.aria-haspopup]="'dialog'"
      [ariaLabel]="translate('settings.language.interface') + ': ' + displayLanguageName"
      [outlined]="true"
    >
      <i class="pi pi-globe globe-icon" [class.gradient-icon]="isHovered"></i>
      <span class="current-lang-name hide-lang-text-on-compact" [class.gradient-icon]="isHovered">{{
        displayLanguageName
      }}</span>
      @if (currentBaseLanguage; as lang) {
        @if (lang.primary.type === 'flag' && !hasFlag(lang.primary.key)) {
          <span class="lang-badge current-lang-flag hide-lang-text-on-compact" aria-hidden="true">{{
            lang.code.toUpperCase()
          }}</span>
        } @else {
          <img
            [src]="getDisplayAssetUrl(lang.primary.type, lang.primary.key)"
            width="24"
            height="16"
            class="current-lang-flag hide-lang-text-on-compact"
            [class.display-icon]="lang.primary.type === 'icon'"
            [class.display-flag]="lang.primary.type === 'flag'"
            alt=""
            aria-hidden="true"
          />
        }
      }
      @if (label) {
        <span class="picker-label hide-lang-text-on-compact" [appHighlight]="label">{{ label }}</span>
      }
      <span
        class="pi pi-chevron-down flag-dropdown-icon hide-lang-text-on-compact"
        [class.gradient-icon]="isHovered"
      ></span>
    </p-button>
    <p-popover #globePanel styleClass="language-picker-panel" (onShow)="onPopoverShow()" (onHide)="onPopoverHide()">
      <div class="language-panel py-1 px-2">
        <!-- Filter Input -->
        <div class="language-filter">
          <input
            #filterInput
            type="text"
            class="filter-input"
            [(ngModel)]="filterText"
            [placeholder]="translate('settings.language.filterPlaceholder')"
            [attr.aria-label]="translate('settings.language.filterPlaceholder')"
            autocomplete="off"
          />
          @if (filterText) {
            <button
              type="button"
              class="clear-icon"
              [attr.aria-label]="translate('settings.language.clearFilter')"
              (click)="clearFilter()"
            >
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          }
        </div>

        <!-- Base Languages List -->
        <div class="language-list">
          @for (lang of filteredBaseLanguages; track trackByLangCode($index, lang)) {
            <button
              type="button"
              class="language-option py-2 px-2 flex align-items-center gap-3"
              [class.active]="lang.code === currentBaseCode"
              [attr.aria-current]="lang.code === currentBaseCode ? 'true' : null"
              (click)="selectBaseLanguage(lang.code); globePanel.hide()"
            >
              <div class="display-elements-container flex align-items-center">
                <!-- Flag display (decorative — language name carries the accessible label) -->
                @if (lang.primary.type === 'flag' && !hasFlag(lang.primary.key)) {
                  <span class="lang-badge primary-element" aria-hidden="true">{{ lang.code.toUpperCase() }}</span>
                } @else {
                  <img
                    [src]="getDisplayAssetUrl(lang.primary.type, lang.primary.key)"
                    width="24"
                    height="16"
                    class="primary-element"
                    [class.display-icon]="lang.primary.type === 'icon'"
                    [class.display-flag]="lang.primary.type === 'flag'"
                    alt=""
                    aria-hidden="true"
                  />
                }
              </div>
              <!-- The autonym is in its own language: lang lets a screen
                   reader pronounce "Deutsch" as German on an English page. -->
              <span [attr.lang]="lang.code" [appHighlight]="lang.nativeName">{{ lang.nativeName }}</span>
              @if (isBeta(lang.code)) {
                <span class="lang-beta-tag">Beta</span>
              }
            </button>
          }
        </div>

        <!-- Easy Language Toggle -->
        <div class="easy-language-toggle">
          <img
            [src]="getDisplayAssetUrl('icon', 'easy-language')"
            width="24"
            height="16"
            class="easy-icon"
            [alt]="translate('settings.language.easyLanguageIcon')"
            aria-hidden="true"
          />
          <label for="easy-language-toggle" class="toggle-label">{{ easyLanguageLabel }}</label>
          <p-toggleswitch
            [(ngModel)]="isEasyMode"
            (onChange)="onEasyModeToggle()"
            inputId="easy-language-toggle"
            [ariaLabel]="easyLanguageLabel"
          >
          </p-toggleswitch>
        </div>
      </div>
    </p-popover>

    <!-- Loading Overlay -->
    <app-loading-overlay [isVisible]="isLoadingLanguage()" [loadingMessage]="translate('settings.language.loading')">
    </app-loading-overlay>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Language Panel Styles */
      .language-panel {
        min-width: 340px;
      }

      /* Filter Input Styles */
      .language-filter {
        position: relative;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--surface-border);
      }

      .filter-input {
        width: 100%;
        padding: 0.5rem 2rem 0.5rem 0.75rem;
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        background: var(--surface-ground);
        color: var(--text-color);
        font-size: 0.9rem;
        outline: none;
        transition:
          border-color 0.2s,
          box-shadow 0.2s;
      }

      .filter-input:focus {
        border-color: var(--primary-color-fg);
        box-shadow: 0 0 0 2px var(--primary-color-transparent, rgba(var(--primary-color-rgb), 0.2));
      }

      .filter-input::placeholder {
        color: var(--text-color-secondary);
      }

      .clear-icon {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: var(--text-color-secondary);
        background: none;
        border: none;
        border-radius: var(--border-radius-sm, 4px);
        font-size: 0.8rem;
        padding: 0.25rem;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
      }

      .clear-icon:hover {
        color: var(--text-color);
      }

      .clear-icon:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: -2px;
      }

      .language-option {
        /* Reset button styles */
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-bottom: 0.5rem;
        padding: 0.5rem 0.75rem !important;
      }

      .language-option:hover {
        background-color: var(--surface-hover);
      }

      .language-option:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        background-color: var(--surface-hover);
      }

      .language-panel .language-option.active {
        background-color: color-mix(in srgb, var(--primary-color) 20%, transparent);
        border: 2px solid var(--primary-color);
        font-weight: 600;
        border-radius: 6px;
      }

      .language-list {
        min-width: 340px;
        padding: 0;
        padding-right: 12px;
        /* Show max 8 items with scrollbar - each item ~44px (content + padding + margin) */
        max-height: calc(8 * 44px);
        overflow-y: auto;
      }

      /* Custom scrollbar styling for language list */
      .language-list::-webkit-scrollbar {
        width: 10px;
      }

      .language-list::-webkit-scrollbar-track {
        background: var(--surface-200);
        border-radius: 5px;
        margin: 4px 0;
      }

      .language-list::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 5px;
        border: 2px solid var(--surface-200);
      }

      .language-list::-webkit-scrollbar-thumb:hover {
        background: var(--primary-700, var(--primary-color));
      }

      app-language-picker .language-selector-button .p-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: fit-content;
        min-width: 4rem;
        height: 2.5rem;
        padding: 0.5rem 0.75rem;
      }

      /* Globe Icon Variant Styles */
      app-language-picker .globe-icon {
        font-size: 1.2rem;
        color: var(--text-color-secondary);
        margin-right: 0.25rem;
        transition: all 0.2s ease;
      }

      app-language-picker .current-lang-name {
        font-weight: 600;
        margin: 0 0.5rem 0 0.25rem;
        color: var(--text-color-secondary);
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      /* Flag right of the spelled-out language name. Decorative — the
       nativeName text provides the accessible label, so aria-hidden in template. */
      app-language-picker .current-lang-flag {
        width: 20px;
        height: 14px;
        margin-right: 0.25rem;
        border-radius: 2px;
        border: 1px solid var(--surface-border);
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        flex-shrink: 0;
      }

      /* Code badge for a language without a drawn flag (see flags.ts). */
      app-language-picker .lang-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 16px;
        font-size: 0.625rem;
        font-weight: 700;
        line-height: 1;
        color: var(--text-color);
        background: var(--surface-ground);
      }

      app-language-picker .picker-label {
        font-weight: 500;
        margin-left: 0.5rem;
        color: var(--text-color);
      }

      app-language-picker .globe-button.p-button {
        min-width: 4.5rem;
      }

      app-language-picker .flag-dropdown-icon {
        font-size: 0.75rem;
        margin-left: 0.25rem;
        color: var(--text-color-secondary);
        transition: all 0.2s ease;
      }

      /* Ansatz 2: Angular Event-Binding - .gradient-icon Klasse */
      /* Fix für Font-Icons: ::before enthält das Zeichen */
      app-language-picker .gradient-icon {
        background: linear-gradient(
          135deg,
          var(--primary-color) 0%,
          var(--gradient-accent-color, var(--primary-color)) 100%
        ) !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        color: transparent !important;
      }

      /* Für Font-Icons (pi-*) das ::before auch stylen */
      app-language-picker .gradient-icon::before {
        background: inherit !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }

      /* Display elements container and positioning */
      .display-elements-container {
        width: 32px;
        min-width: 32px;
        gap: 4px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }

      /* Primary display element (flag or icon) */
      .primary-element {
        flex-shrink: 0;
      }

      /* Flag-specific styling */
      .display-flag {
        width: 24px !important;
        height: 16px !important;
        transform: scale(1.25);
      }

      /* Icon-specific styling */
      .display-icon {
        width: 24px !important;
        height: 16px !important;
        transform: scale(1.25);
        object-fit: contain;
        border-radius: 2px;
      }

      /* Code badges in the language list */
      .language-list .lang-badge {
        border: 1px solid var(--surface-border);
        border-radius: 2px;
      }

      .lang-beta-tag {
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 0.1rem 0.4rem;
        border-radius: 999px;
        background: transparent;
        color: var(--text-color-secondary);
        border: 1px solid var(--surface-border);
        line-height: 1.4;
      }

      .gap-3 {
        gap: 1rem;
      }

      .flex {
        display: flex;
      }

      .align-items-center {
        align-items: center;
      }

      /* Easy Language Toggle Section */
      .easy-language-toggle {
        display: grid;
        grid-template-columns: 32px 1fr auto;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 0.75rem;
        margin-top: 0.5rem;
        border-top: 1px solid var(--surface-border);
        background: var(--surface-50);
        border-radius: 0 0 6px 6px;
      }

      .easy-icon {
        opacity: 0.9;
        justify-self: start;
        border-radius: 2px;
        border: 1px solid var(--surface-border);
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        transform: scale(1.25);
      }

      .toggle-label {
        font-size: 0.9rem;
        font-weight: normal;
        color: var(--text-color);
      }

      /* Dark mode easy language toggle */
      .dark-theme .easy-language-toggle {
        background: var(--surface-100);
      }

      /* This component is ViewEncapsulation.None, so its styles are GLOBAL. The
       popover carries styleClass="language-picker-panel" and the override is
       scoped to it via the padding token - an unscoped .p-popover-content rule
       here would zero the content padding of every popover in the app.
       The .language-panel wrapper inside supplies its own padding. */
      .language-picker-panel {
        --p-popover-content-padding: 0;
      }
    `,
  ],
})
export class LanguagePickerComponent {
  @Input() label?: string; // Optional label to display after the icon
  @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;
  @ViewChild('globePanel') globePanel?: Popover;

  /** Escape key closes popover and returns focus to trigger */
  private triggerRef: HTMLElement | null = null;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isPopoverOpen && this.globePanel) {
      this.globePanel.hide();
      this.triggerRef?.focus();
    }
  }

  // Ansatz 2: Angular Event-Binding für Hover
  isHovered = false;

  // Popover state for accessibility
  isPopoverOpen = false;

  // Filter state for language search
  filterText = '';

  currentLanguage: Language | null = null;
  availableLanguages: Language[] = [];
  readonly hasFlag = hasFlag;

  // Loading state for language switching
  isLoadingLanguage = signal(false);

  // Easy language mode state
  isEasyMode = false;

  // V2 Service injection
  translationService = inject(TranslationService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // V2 Pattern: Initialize language
    this.currentLanguage = this.translationService.getCurrentLanguageInfo() || null;
    this.availableLanguages = this.translationService.languages;

    // Initialize easy mode from current language
    this.isEasyMode = this.currentLanguage?.code?.includes('-easy') ?? false;

    // V2 Pattern: Subscribe to language changes with takeUntilDestroyed
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.currentLanguage = this.translationService.getCurrentLanguageInfo() || null;
      this.isEasyMode = this.currentLanguage?.code?.includes('-easy') ?? false;
      this.cdr.markForCheck();
    });
  }

  /**
   * Get only base languages (without -easy variants)
   */
  get baseLanguages(): Language[] {
    return this.availableLanguages.filter((l) => !l.code.includes('-easy'));
  }

  /**
   * Get filtered base languages based on filter text
   * Filters by name, native name, and language code (case-insensitive)
   */
  get filteredBaseLanguages(): Language[] {
    const filter = this.filterText.trim().toLowerCase();
    if (!filter) {
      return this.baseLanguages;
    }
    return this.baseLanguages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(filter) ||
        lang.nativeName.toLowerCase().includes(filter) ||
        lang.code.toLowerCase().includes(filter),
    );
  }

  /**
   * Get the current base language code (without -easy suffix)
   */
  get currentBaseCode(): string {
    return this.currentLanguage?.code?.replace('-easy', '') ?? 'en';
  }

  /**
   * Display language code in the button (shows base code + easy indicator).
   * Retained for backwards-compatibility (callers / tests) — the rendered
   * button now uses `displayLanguageName` instead.
   */
  get displayLanguageCode(): string {
    let baseCode = this.currentBaseCode.toUpperCase();
    // Show PT-BR to clarify Brazilian Portuguese variant
    if (baseCode === 'PT') baseCode = 'PT-BR';
    return this.isEasyMode ? `${baseCode}*` : baseCode;
  }

  /**
   * Current base-language Language object (without -easy variant).
   * Drives the button's flag + name rendering. Falls back to the first
   * base language if the current code is unknown (defensive — should not
   * happen because currentBaseCode comes from a validated source).
   */
  get currentBaseLanguage(): Language | null {
    return this.baseLanguages.find((l) => l.code === this.currentBaseCode) ?? null;
  }

  /**
   * Spelled-out language name shown in the button (autonym of the base
   * language, e.g. "Deutsch", "हिन्दी", "Português (Brasil)"). When
   * easy-mode is active a trailing `*` mirrors the legacy "DE*" convention.
   * Falls back to upper-cased code when the language object is missing.
   */
  get displayLanguageName(): string {
    const base = this.currentBaseLanguage;
    const name = base?.nativeName ?? this.displayLanguageCode;
    return this.isEasyMode ? `${name}*` : name;
  }

  /**
   * Get translated label for easy language toggle
   */
  get easyLanguageLabel(): string {
    return this.translationService.translate('settings.language.easyLanguage');
  }

  /**
   * Get translation for a key
   */
  trackByLangCode(_index: number, lang: Language): string {
    return lang.code;
  }

  /** Whether a language is non-final (drives the Beta tag in the list). */
  isBeta(code: string): boolean {
    return isLanguageBeta(code);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Get display asset URL based on type and key
   */
  getDisplayAssetUrl(type: 'flag' | 'icon', key: string): string {
    return getDisplayAsset(type, key);
  }

  /**
   * Select a base language (applies easy mode if enabled)
   */
  async selectBaseLanguage(baseCode: string): Promise<void> {
    const finalCode = this.isEasyMode ? `${baseCode}-easy` : baseCode;
    await this.applyLanguage(finalCode);
  }

  /**
   * Toggle easy language mode
   */
  async onEasyModeToggle(): Promise<void> {
    const finalCode = this.isEasyMode ? `${this.currentBaseCode}-easy` : this.currentBaseCode;
    await this.applyLanguage(finalCode);
  }

  /**
   * Handle popover show event - focus filter input
   * browser-only: popover show event, fired by a click.
   */
  onPopoverShow(): void {
    this.triggerRef = document.activeElement as HTMLElement;
    this.isPopoverOpen = true;
    // Focus filter input after popover is rendered
    setTimeout(() => {
      this.filterInput?.nativeElement?.focus();
    }, 0);
  }

  /**
   * Handle popover hide event - clear filter
   */
  onPopoverHide(): void {
    this.isPopoverOpen = false;
    this.clearFilter();
  }

  /**
   * Clear the filter text
   */
  clearFilter(): void {
    this.filterText = '';
  }

  /**
   * Apply a language with loading indicator.
   * Navigates to the new language URL prefix instead of reloading.
   */
  private async applyLanguage(code: string): Promise<void> {
    this.isLoadingLanguage.set(true);

    const currentPath = this.router.url; // e.g. /glossary (without prefix)
    const baseCode = code.replace(/-easy$/, ''); // URL shows base language only

    // Persist preference + easy-mode flag via TranslationService (single owner).
    // Don't await — we hard-reload below, so loading translations here is wasted work.
    this.translationService.setLanguage(code);

    // Fade out + navigate to new language URL (a full-page load: browser only)
    if (!this.isBrowser) return;
    document.body.style.transition = 'opacity 0.2s ease-out';
    document.body.style.opacity = '0';

    setTimeout(() => {
      // router.url already contains query params and fragment (e.g. /glossary?search=test#section)
      // Do NOT append window.location.search/hash again — that causes double params.
      window.location.href = `/${baseCode}${currentPath}`;
    }, 100);
  }
}
