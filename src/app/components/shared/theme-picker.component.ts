/**
 * Theme Picker Component
 * A reusable theme selection component with optional label display.
 * Extracted from the header navigation for use in both header and settings.
 * Enhanced with reactive translations for proper localization.
 */
import {
  Component,
  Input,
  inject,
  ChangeDetectorRef,
  ViewEncapsulation,
  HostListener,
  ViewChild,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Optimus UI imports
import { ButtonModule } from '@openng/optimus-ui/button';
import { PopoverModule, Popover } from '@openng/optimus-ui/popover';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';

// Services
import { ThemeService, ThemeMode } from '../../services/theme.service';
import type { UiStyle } from '../../services/ui-styles';
import { FontService } from '../../services/font.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-theme-picker',
  standalone: true,
  encapsulation: ViewEncapsulation.None, // Ansatz 4: Keine Style-Kapselung
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    PopoverModule,
    TooltipModule,
    SelectButtonModule,
    ToggleSwitchModule,
  ],
  template: `
    <p-button
      class="theme-selector-button"
      (onClick)="saveTriggerRef(); themePanel.toggle($event)"
      (mouseenter)="isHovered = true"
      (mouseleave)="isHovered = false"
      [pTooltip]="themeMode"
      [attr.aria-label]="themeMode"
      [outlined]="true"
    >
      <i class="pi pi-palette theme-icon" [class.gradient-icon]="isHovered"></i>
      @if (label) {
        <span class="picker-label">{{ label }}</span>
      }
      <span class="sr-only">{{ themeMode }}</span>
      <span class="pi pi-chevron-down theme-dropdown-icon" [class.gradient-icon]="isHovered"></span>
    </p-button>
    <p-popover #themePanel>
      <div class="theme-panel py-2 px-3">
        <!-- Theme Mode Label -->
        <div id="theme-mode-label" class="theme-section-label mb-2">{{ themeMode }}</div>

        <!-- Compact Mode Selection - SelectButton -->
        <p-selectbutton
          [options]="themeModeOptions"
          [(ngModel)]="selectedThemeMode"
          optionValue="value"
          (onChange)="onThemeModeChange($event)"
          class="mb-4"
          [fluid]="true"
          [ariaLabelledBy]="'theme-mode-label'"
        >
          <ng-template let-item #item>
            <div class="theme-mode-option">
              <i class="{{ item.icon }}"></i>
              <span class="theme-mode-label">{{ item.label }}</span>
            </div>
          </ng-template>
        </p-selectbutton>

        <!-- Color Variants -->
        <div class="theme-colors-container mb-4">
          <div class="theme-section-label mb-2">{{ colorVariant }}</div>

          <div class="theme-colors-grid">
            @for (color of themeService.visibleColors(); track color) {
              <button
                type="button"
                class="theme-color-variant"
                [class.active]="themeService.color() === color.name"
                [style.--color-primary]="color.primaryColor"
                [style.--color-accent]="color.gradientAccent"
                [attr.aria-label]="color.name | titlecase"
                [attr.aria-pressed]="themeService.color() === color.name"
                [pTooltip]="color.name | titlecase"
                (click)="themeService.setColor(color.name)"
              ></button>
            }
          </div>
        </div>

        <!-- Compact Theme Families -->
        <div class="theme-families-container mb-4">
          <!-- Theme Family Label -->
          <div class="theme-section-label mb-2">{{ themeFamily }}</div>

          <div class="theme-style-chips">
            @for (style of getAvailableStyles(); track style.name) {
              <button
                type="button"
                class="theme-style-chip"
                [class.active]="themeService.style() === style.name"
                [attr.aria-pressed]="themeService.style() === style.name"
                [attr.aria-describedby]="componentId + '-style-' + style.name"
                [pTooltip]="styleDescription(style)"
                tooltipPosition="bottom"
                (click)="themeService.setStyle(style.name)"
              >
                {{ styleName(style) }}
                <span class="sr-only" [id]="componentId + '-style-' + style.name">{{ styleDescription(style) }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Barrierefreiheit (Accessibility) — high-contrast + readable-font
             toggles. Lives in the theme picker (not a dedicated a11y picker)
             to mirror the easy-language pattern: accessibility features sit in
             the picker that already controls the same axis. -->
        <div class="theme-a11y-container">
          <div class="theme-section-label mb-2">{{ a11yLabel }}</div>

          <div class="a11y-toggle-row">
            <label [for]="'high-contrast-toggle-' + componentId" class="a11y-toggle-info">
              <span class="a11y-toggle-label">{{ highContrastLabel }}</span>
              <span class="a11y-toggle-description">{{ highContrastDescription }}</span>
            </label>
            <p-toggleswitch
              [inputId]="'high-contrast-toggle-' + componentId"
              [ngModel]="themeService.isHighContrast()"
              (ngModelChange)="themeService.setHighContrast($event)"
              [ariaLabel]="highContrastLabel"
            >
            </p-toggleswitch>
          </div>

          <div class="a11y-toggle-row" [class.disabled]="!readableFontSupported()">
            <label [for]="'readable-font-toggle-' + componentId" class="a11y-toggle-info">
              <span class="a11y-toggle-label">{{ readableFontLabel }}</span>
              <span class="a11y-toggle-description">
                {{ readableFontSupported() ? readableFontDescription : readableFontUnsupported }}
              </span>
            </label>
            <p-toggleswitch
              [inputId]="'readable-font-toggle-' + componentId"
              [ngModel]="fontService.isReadableFontActive()"
              (ngModelChange)="fontService.setReadableFont($event)"
              [disabled]="!readableFontSupported()"
              [ariaLabel]="readableFontLabel"
            >
            </p-toggleswitch>
          </div>

          <a routerLink="/user-settings" fragment="appearance" class="a11y-more-link" (click)="themePanel.hide()">
            <i class="pi pi-cog" aria-hidden="true"></i>
            <span>{{ moreOptionsLabel }}</span>
          </a>
        </div>
      </div>
    </p-popover>

    <!-- Global Highlighting Popover -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Theme Panel Styles */
      .theme-panel {
        min-width: 280px;
        max-width: 320px;
      }

      /* The mode toggle takes no padding override: the group is sized by the
         component's own fluid input, and the preset's even padding on each
         .p-togglebutton segment is the inset that keeps the checked pill
         (.p-togglebutton-content) inside the frame. A zero inline padding
         here pushed the pill flush onto the border in every style. */

      .theme-section-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-color);
        margin-top: 0.5rem;
      }

      .theme-mode-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }

      .theme-mode-label {
        font-size: 0.75rem;
      }

      app-theme-picker .theme-selector-button .p-button {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: fit-content;
        min-width: 3.5rem;
        height: 2.5rem;
        padding: 0.5rem 0.75rem;
        margin: 0 !important;
      }

      app-theme-picker .theme-icon {
        font-size: 1.2rem;
        color: var(--text-color-secondary);
        transition: all 0.2s ease;
      }

      app-theme-picker .picker-label {
        font-weight: 500;
        margin-left: 0.5rem;
        color: var(--text-color);
      }

      app-theme-picker .theme-dropdown-icon {
        font-size: 0.75rem;
        margin-left: 0.25rem;
        color: var(--text-color-secondary);
        transition: all 0.2s ease;
      }

      /* Ansatz 2: Angular Event-Binding - .gradient-icon Klasse */
      /* Fix für Font-Icons: ::before enthält das Zeichen */
      app-theme-picker .gradient-icon {
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
      app-theme-picker .gradient-icon::before {
        background: inherit !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }

      /* Theme Color Grid — 5 per row gives 5+4 for the 9 brand colors after
       contrast was moved to the a11y toggle. (Was 6 cols when contrast lived
       in the grid: 6+4.) */
      .theme-colors-grid {
        display: grid;
        grid-template-columns: repeat(5, auto);
        justify-content: start;
        gap: 0.5rem;
      }

      /* Theme Color Variants - Linear Gradient larger than circle, clipped */
      .theme-color-variant {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        padding: 0;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
        background-size: 150% 150%;
        background-position: center;
        overflow: hidden;
        position: relative;
      }

      /* Expanded touch target for WCAG 2.5.5 */
      .theme-color-variant::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 44px;
        min-height: 44px;
      }

      .theme-color-variant:hover {
        transform: scale(1.15);
        border-color: var(--surface-border);
      }

      .theme-color-variant:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        transform: scale(1.15);
      }

      .theme-color-variant.active {
        border-color: var(--text-color);
        box-shadow: 0 0 0 2px var(--surface-card);
      }

      /* Style chips (ADR-0016 D6, amended 2026-09-24)
         One compact chip per visual style with its full translated name, laid
         out in a row. The one-sentence description is the
         tooltip and, via aria-describedby, the accessible description. No
         hover preview - a click is instant and reversible, which is the
         preview. */
      .theme-style-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .theme-style-chip {
        min-height: 44px;
        padding: 0.375rem 0.75rem;
        font: inherit;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        color: var(--text-color);
        border: 2px solid var(--surface-border);
        border-radius: var(--border-radius-md, 8px);
        background: var(--surface-card);
        transition: all 0.2s ease;
      }

      .theme-style-chip:hover {
        border-color: var(--primary-color-fg);
      }

      .theme-style-chip:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .theme-style-chip.active {
        color: var(--primary-color-text);
        border-color: var(--primary-color);
        background: var(--primary-color);
      }

      .gap-2 {
        gap: 0.5rem;
      }

      .gap-3 {
        gap: 1rem;
      }

      .flex {
        display: flex;
      }

      .flex-wrap {
        flex-wrap: wrap;
      }

      .mb-2 {
        margin-bottom: 0.5rem;
      }

      .mb-4 {
        margin-bottom: 1rem;
      }

      /* Reduced motion for WCAG 2.3.3 */
      @media (prefers-reduced-motion: reduce) {
        .theme-color-variant,
        .theme-style-chip,
        app-theme-picker .theme-icon,
        app-theme-picker .theme-dropdown-icon {
          transition: none !important;
        }
      }

      /* === Barrierefreiheit Section ===
       Sits below the three style sections (mode/color/family). Visually
       separated by a top divider so users perceive it as a distinct group
       (a11y vs. style), not a fourth tier of stylistic options. */
      .theme-a11y-container {
        padding-top: 0.75rem;
        border-top: 1px solid var(--surface-border);
      }

      .a11y-toggle-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 0.4rem 0;
      }

      .a11y-toggle-row.disabled .a11y-toggle-label,
      .a11y-toggle-row.disabled .a11y-toggle-description {
        opacity: 0.6;
      }

      .a11y-toggle-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        cursor: pointer;
        user-select: none;
      }

      .a11y-toggle-row.disabled .a11y-toggle-info {
        cursor: not-allowed;
      }

      .a11y-toggle-label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-color);
        line-height: 1.2;
      }

      .a11y-toggle-description {
        font-size: 0.72rem;
        color: var(--text-color-secondary);
        line-height: 1.3;
      }

      .a11y-more-link {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        margin-top: 0.5rem;
        padding: 0.3rem 0;
        font-size: 0.78rem;
        color: var(--text-color-secondary);
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .a11y-more-link:hover,
      .a11y-more-link:focus-visible {
        color: var(--primary-fg, var(--primary-color));
      }

      .a11y-more-link i {
        font-size: 0.75rem;
      }

      @media (prefers-reduced-motion: reduce) {
        .a11y-more-link {
          transition: none;
        }
      }
    `,
  ],
})
export class ThemePickerComponent {
  @Input() label?: string; // Optional label to display after the icon
  @ViewChild('themePanel') themePanel?: Popover;

  /** Escape key closes popover and returns focus to trigger */
  private triggerRef: HTMLElement | null = null;

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.themePanel) {
      this.triggerRef?.focus();
      this.themePanel.hide();
    }
  }

  // Ansatz 2: Angular Event-Binding für Hover
  isHovered = false;

  // Theme configuration - Reactive labels via getter
  get themeModeOptions() {
    return [
      {
        icon: 'pi pi-sun',
        value: 'light' as ThemeMode,
        label: this.lightLabel,
      },
      {
        icon: 'pi pi-moon',
        value: 'dark' as ThemeMode,
        label: this.darkLabel,
      },
      {
        icon: 'pi pi-desktop',
        value: 'system' as ThemeMode,
        label: this.systemLabel,
      },
    ];
  }

  selectedThemeMode: ThemeMode = 'light';

  // Inject services
  themeService = inject(ThemeService);
  fontService = inject(FontService);
  translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);

  // Component-scoped ID for label/input pairing inside the popover.
  componentId = 'theme-picker-' + Math.random().toString(36).slice(2, 9);

  // Reactive: is the dyslexia font supported for the current language?
  // Re-evaluates on language change because activeLanguage$ is read.
  readonly readableFontSupported = computed(() =>
    this.fontService.supportsReadableFont(this.translationService.currentLanguage$()),
  );

  // Translation strings - updated manually via subscriptions
  themeMode: string = '';
  colorVariant: string = '';
  themeFamily: string = '';
  lightLabel: string = '';
  darkLabel: string = '';
  systemLabel: string = '';
  // Barrierefreiheit section
  a11yLabel: string = '';
  highContrastLabel: string = '';
  highContrastDescription: string = '';
  readableFontLabel: string = '';
  readableFontDescription: string = '';
  readableFontUnsupported: string = '';
  moreOptionsLabel: string = '';

  constructor() {
    // Initialize theme mode
    this.selectedThemeMode = this.themeService.mode();

    // Initial translation update
    this.updateTranslations();

    // Wait for translations to load, then update
    this.translationService.isTranslationsLoaded.pipe(takeUntilDestroyed()).subscribe((loaded) => {
      if (loaded) {
        this.updateTranslations();
        this.cdr.markForCheck();
      }
    });

    // Subscribe to language changes to update translations
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateTranslations();
      this.cdr.markForCheck();
    });
  }

  /**
   * Update all translation strings
   */
  private updateTranslations(): void {
    this.themeMode = this.translationService.translate('settings.theme.mode');
    this.colorVariant = this.translationService.translate('settings.theme.colorVariant');
    this.themeFamily = this.translationService.translate('settings.theme.family');
    this.lightLabel = this.translationService.translate('settings.theme.light');
    this.darkLabel = this.translationService.translate('settings.theme.dark');
    this.systemLabel = this.translationService.translate('settings.theme.system');
    this.a11yLabel = this.translationService.translate('settings.theme.accessibility');
    this.highContrastLabel = this.translationService.translate('settings.theme.highContrast');
    this.highContrastDescription = this.translationService.translate('settings.theme.highContrastDescription');
    this.readableFontLabel = this.translationService.translate('settings.theme.readableFont');
    this.readableFontDescription = this.translationService.translate('settings.theme.readableFontDescription');
    this.readableFontUnsupported = this.translationService.translate('settings.theme.readableFontUnsupported');
    this.moreOptionsLabel = this.translationService.translate('settings.theme.moreOptions');
  }

  /**
   * Save trigger reference for focus return
   * browser-only: called when the picker opens on a click.
   */
  saveTriggerRef(): void {
    this.triggerRef = document.activeElement as HTMLElement;
  }

  /**
   * Get translation for a key
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Theme mode change handler
   */
  onThemeModeChange(event: { value?: ThemeMode }): void {
    if (event?.value) {
      this.themeService.setMode(event.value);
    }
  }

  /**
   * The visual styles offered in the "Style" section (ADR-0016 D6), rendered
   * as name chips.
   */
  getAvailableStyles() {
    return this.themeService.styles;
  }

  /** Translated display name of a style, from `settings.theme.styles.<name>.name`. */
  styleName(style: UiStyle): string {
    return this.translationService.translate(style.labelKey);
  }

  /** Translated one-sentence description, from `…styles.<name>.description`. */
  styleDescription(style: UiStyle): string {
    return this.translationService.translate(style.descriptionKey);
  }
}
