/**
 * App header — the banner with the main navigation bar: sitemap button
 * (mobile), brand link, notification bell, theme and language pickers and the
 * omnibar. Moved out of AppComponent unchanged; the omnibar's events and the
 * sitemap button go up as outputs, since the sitemap overlay they drive is the
 * shell's.
 *
 * The host is `display: contents`, so <header> stays a flex item of
 * .app-container. Styles are global (ViewEncapsulation.None) under the same
 * `app-root` selectors as before.
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from '@openng/optimus-ui/api';
import { MenubarModule } from '@openng/optimus-ui/menubar';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { TranslationService } from '../../services/translation.service';
import { NotificationBellComponent } from './notification-bell.component';
import { NavigationDropdownComponent } from './navigation-dropdown.component';
import { LanguagePickerComponent } from '../shared/language-picker.component';
import { ThemePickerComponent } from '../shared/theme-picker.component';
import { SITE_CONFIG } from '../../../config/site';

@Component({
  selector: 'app-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MenubarModule,
    TooltipModule,
    NotificationBellComponent,
    NavigationDropdownComponent,
    LanguagePickerComponent,
    ThemePickerComponent,
  ],
  template: `
    <!-- Main Application Header -->
    <header role="banner">
      <nav role="navigation" [attr.aria-label]="translate('app.nav.main')">
        <!-- The bar is header CHROME here, not a menu: menuItems is empty and
             everything visible lives in the start/end templates. Without the
             pass-through the component still renders a ul with role="menubar"
             and tabindex="0" — a zero-size tab stop that announces an empty
             menu bar between the logo and the notification bell.
             Only tabindex and aria-hidden are written reliably; the role is a
             host binding the component re-asserts, so it is left alone. Safe
             here ONLY because the model is empty: nothing can focus the list. -->
        <p-menubar [model]="menuItems" styleClass="main-menubar" [pt]="menubarChromePt">
          <ng-template #start>
            <!-- Mobile-only hamburger; CSS-hidden on desktop. Opens the
                 same sitemap overlay as the desktop omnibar. We embrace
                 the platform convention here (external consistency >
                 internal consistency) — most users have a primary
                 device, the slight desktop ↔ mobile mental-model shift
                 costs less than violating the "left-top hamburger"
                 reflex that mobile UIs share. -->
            <button
              type="button"
              class="hamburger-button"
              [attr.aria-label]="translate('app.nav.sitemap')"
              [pTooltip]="translate('app.nav.sitemap')"
              tooltipPosition="bottom"
              (click)="sitemapToggle.emit()"
            >
              <i class="pi pi-bars" aria-hidden="true"></i>
            </button>

            <!-- Site brand: a navigation/logo element, NOT a heading. The page's
                 single <h1> comes from <app-page-header>. Using <h1> here put a
                 second h1 on every page (a11y: multiple top-level headings). -->
            <!-- "/" redirects to the start page of site.json (app.routes.ts). -->
            <div class="app-title">
              <a
                routerLink="/"
                class="app-title-link"
                [attr.aria-label]="site.name + ' - ' + translate('app.nav.home')"
              >
                <i [class]="site.logoIcon + ' app-title-icon'" aria-hidden="true"></i>
                <span>{{ site.logoText }}</span>
              </a>
            </div>
          </ng-template>

          <ng-template #end>
            <div class="header-controls" [attr.aria-label]="translate('app.nav.controls')">
              <!-- Notification Bell — the portal-wide news feed; its "view all" leads to
                   /news, so it goes when site.json switches the news feature off. -->
              @if (site.isFeatureOn('news')) {
                <div class="header-bell" [attr.aria-label]="translate('notifications.bell.label')">
                  <app-notification-bell></app-notification-bell>
                </div>
              }

              <!-- Settings Pill: Theme + Language combined into one element -->
              <div class="header-settings" [attr.aria-label]="translate('app.nav.controls')">
                <div class="settings-pill">
                  <app-theme-picker></app-theme-picker>
                  <app-language-picker></app-language-picker>
                </div>
              </div>

              <!-- Omnibar: Search field doubles as the sitemap trigger.
                   Focusing the input opens the sitemap overlay below the
                   header; typing dismisses the overlay so the autocomplete
                   suggestions take over. -->
              <div class="header-omnibar" [attr.aria-label]="translate('app.nav.search')">
                <app-navigation-dropdown
                  #navDropdown
                  (halTriggered)="halTriggered.emit()"
                  (inputFocused)="searchFocused.emit()"
                  (inputChanged)="searchChanged.emit($event)"
                >
                </app-navigation-dropdown>
              </div>
            </div>
          </ng-template>
        </p-menubar>
      </nav>
    </header>
  `,
  styles: [
    `
      app-header {
        display: contents;
      }

      app-root .app-title {
        margin: 0;
        /* Was an <h1>; now a <div> (a11y: single page h1). Restore the h1's default
         2em desktop size explicitly — the responsive media queries below still
         override it at smaller breakpoints. */
        font-size: 2rem;
        font-weight: 500;
        white-space: nowrap;
      }

      app-root .app-title-link {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        text-decoration: none;
        color: var(--primary-color-fg);
      }

      .app-title-icon,
      app-root .app-title-link span {
        /* App title is large bold display text — use icon-fg (3:1 target)
         instead of fg (4.5:1) to keep the brand identity vibrant. */
        background: linear-gradient(
          135deg,
          var(--primary-color-icon-fg) 0%,
          var(--gradient-accent-color-icon-fg, var(--primary-color-icon-fg)) 50%,
          var(--primary-color-icon-fg) 100%
        );
        background-size: 400% 400%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        animation: brand-gradient-flow 60s ease-in-out infinite;
      }

      app-root .app-title-icon {
        font-size: 0.95em;
        line-height: 1;
      }

      app-root .app-title-link span {
        transform: translateY(-2px);
      }

      @keyframes brand-gradient-flow {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      /* The kit ring: --primary-color-fg is the accent's gated FOREGROUND
         (>= 4.5:1 on ground and card). --primary-color, the filled-button
         BACKGROUND, is darker in dark mode (coral #880f3f on the dark ground). */
      app-root .app-title-link:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* The header's OWN bar only: an unscoped app-root .p-menubar also
         squared and re-padded every p-menubar a page renders (the guide demos). */
      app-root .p-menubar.main-menubar {
        border-radius: 0;
        padding: 0.4rem 1rem;
        position: relative;
      }

      app-root .header-controls {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-template-areas: 'bell settings omnibar';
        align-items: center;
        gap: 1rem;
        justify-content: end;
        width: 100%;
        min-width: 0;
      }

      app-root .header-bell {
        grid-area: bell;
        display: flex;
        align-items: center;
      }

      app-root .header-settings {
        grid-area: settings;
        display: flex;
        align-items: center;
      }

      app-root .header-omnibar {
        grid-area: omnibar;
        display: flex;
        align-items: center;
      }

      /* ── Settings pill: Theme + Language fused into one rounded container.
       Inner pickers' p-buttons get their borders/backgrounds stripped so the
       outer pill takes over the visual treatment. */
      app-root .settings-pill {
        display: inline-flex;
        align-items: center;
        height: 44px;
        border: 2px solid transparent;
        background: var(--surface-card);
        background-image:
          linear-gradient(var(--surface-card), var(--surface-card)),
          linear-gradient(135deg, var(--primary-fg) 0%, var(--accent-fg) 100%);
        background-origin: border-box;
        background-clip: padding-box, border-box;
        border-radius: 22px;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      app-root .settings-pill:hover {
        filter: brightness(1.1);
      }

      app-root .settings-pill > app-theme-picker,
      app-root .settings-pill > app-language-picker {
        display: inline-flex;
        align-items: center;
        height: 100%;
      }

      app-root .settings-pill > app-language-picker {
        border-left: 1px solid var(--surface-border);
      }

      /* Strip the per-picker p-button gradient-border treatment when nested in
       the settings-pill so the outer pill is the only visible boundary.
       Specificity here matches theme.service's :not()-chain to win the cascade. */
      app-root
        .settings-pill
        .p-button.p-button-outlined:not([class*='p-button-success']):not([class*='p-button-info']):not(
          [class*='p-button-warn']
        ):not([class*='p-button-danger']):not([class*='p-button-help']):not([class*='p-button-contrast']) {
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        background-image: none !important;
        height: 100% !important;
      }

      app-root .settings-pill .p-button.p-button-outlined:hover {
        filter: none !important;
        background: var(--surface-hover) !important;
      }

      /* ── Mobile-only sitemap-trigger button (was: hamburger; the icon now
       matches pi pi-sitemap so the affordance reads as "alle Seiten").
       Round + 44 px to mirror the bell and the lone language picker on
       mobile, so the three icon buttons line up consistently. */
      app-root .hamburger-button {
        display: none;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        padding: 0;
        border: 1px solid var(--surface-border);
        border-radius: 50%;
        background: var(--surface-card);
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      app-root .hamburger-button:hover {
        background: var(--surface-hover);
        color: var(--primary-color-fg);
      }

      app-root .hamburger-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-root .hamburger-button i {
        font-size: 1.25rem;
      }

      /* ── Responsive tiers ───────────────────────────────────────────────
       Tier 2 ≤1110   hide theme inside the settings pill
       Tier 3 ≤950    language picker collapses to icon-only
       Mobile ≤750   3-zone app-style header (hamburger | logo | bell+lang)
       The omnibar disappears on mobile; the hamburger triggers the same
       sitemap overlay that the search-focus opens on desktop. */

      /* Tier 2 — hide theme picker AND collapse language picker to icon-only at
       the same breakpoint. Keeping both visible as long as there's room reads
       cleaner than dropping the theme picker first and leaving a lone language
       button mid-width. When the language text disappears, the theme picker
       goes with it. */
      @media (max-width: 950px) {
        app-root .settings-pill > app-theme-picker {
          display: none !important;
        }
        app-root .settings-pill > app-language-picker {
          border-left: none;
        }

        app-root .hide-lang-text-on-compact {
          display: none !important;
        }

        app-root .header-settings app-language-picker .language-selector-button .p-button,
        app-root .header-settings app-language-picker .globe-button.p-button {
          min-width: 44px;
          width: 44px;
          padding: 0.5rem;
          justify-content: center;
        }

        app-root .header-settings app-language-picker .globe-icon {
          margin-right: 0;
        }
      }

      /* Title sizing — keep these tweaks across the tier transitions */
      @media (max-width: 850px) {
        app-root .app-title {
          font-size: 1.25rem;
        }
      }

      /* Mobile — 3-zone app-style header. Override p-menubar's flex defaults
       so the start template (hamburger + logo) absorbs the slack and keeps
       the title visually centered between hamburger and end (bell + language). */
      @media (max-width: 750px) {
        app-root .main-menubar {
          padding: 0.4rem 0.5rem;
        }

        app-root .main-menubar .p-menubar-start {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }

        app-root .hamburger-button {
          display: flex;
        }

        /* Logo soaks up the remaining start space and centers */
        app-root .app-title {
          flex: 1;
          text-align: center;
          margin: 0;
        }

        app-root .app-title-link {
          justify-content: center;
        }

        /* Hide the omnibar entirely — the hamburger replaces it. Theme is also
         out of sight (Tier 2 already nuked it), so settings has only the
         language picker left. */
        app-root .header-omnibar {
          display: none !important;
        }

        /* Bell follows the omnibar: as soon as the hamburger appears (= the
         drawer pattern kicks in), the bell goes too. The hamburger
         sitemap is the new entry point for "what's new"; clutter
         goes away from the right zone. */
        app-root .header-bell {
          display: none !important;
        }

        app-root .header-controls {
          grid-template-columns: auto auto;
          grid-template-areas: 'bell settings';
          gap: 0.5rem;
        }

        /* With only the language icon left in settings, drop the pill chrome
         so the icon button can stand alone alongside the bell. */
        app-root .settings-pill {
          border: none;
          background: none;
          background-image: none;
          height: auto;
          overflow: visible;
        }

        /* Mobile-only: re-style the lone language picker as a round 44 px
         button with the same gradient outline as the bell. Overrides the
         desktop settings-pill rule (which strips chrome assuming the
         outer pill provides it). Matches the :not() chain so specificity
         stays parity with theme.service. */
        app-root
          .settings-pill
          app-language-picker
          .p-button.p-button-outlined:not([class*='p-button-success']):not([class*='p-button-info']):not(
            [class*='p-button-warn']
          ):not([class*='p-button-danger']):not([class*='p-button-help']):not([class*='p-button-contrast']) {
          border: 2px solid transparent !important;
          border-radius: 50% !important;
          background: var(--surface-card) !important;
          background-image:
            linear-gradient(var(--surface-card), var(--surface-card)),
            linear-gradient(135deg, var(--primary-fg) 0%, var(--accent-fg) 100%) !important;
          background-origin: border-box !important;
          background-clip: padding-box, border-box !important;
          width: 44px !important;
          height: 44px !important;
          min-width: 44px !important;
          padding: 0 !important;
        }
      }

      /* Title shortening — Stage 1 ("Kleine" hide) */
      @media (max-width: 600px) {
        app-root .hide-on-small {
          display: none !important;
        }
      }

      /* Very small screens — title sizing + tiny-screen hide hook */
      @media (max-width: 480px) {
        app-root .app-title {
          font-size: 1.1rem;
        }

        app-root .hide-on-tiny-screen {
          display: none !important;
        }
      }

      /* Reduced Motion: brand gradient (WCAG 2.3.3) */
      @media (prefers-reduced-motion: reduce) {
        app-root .app-title-gradient,
        app-root .app-title-link span,
        .app-title-icon {
          animation: none;
        }
      }
    `,
  ],
})
export class AppHeaderComponent {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  /** The site's name, logo and feature switches, from src/config/site.json. */
  readonly site = inject(SITE_CONFIG);

  /** The mobile sitemap button was pressed. */
  readonly sitemapToggle = output<void>();
  /** "HAL 9000" was entered in the omnibar. */
  readonly halTriggered = output<void>();
  /** The omnibar input got focus. */
  readonly searchFocused = output<void>();
  /** The omnibar text changed. */
  readonly searchChanged = output<string>();

  private readonly navDropdown = viewChild<NavigationDropdownComponent>('navDropdown');

  // Menu items for the top navigation bar
  menuItems: MenuItem[] = [
    // Keine Dropdown-Menüs, nur Zugriff über AutoComplete
  ];

  /** Silences the empty root list of the header menubar (see template comment). */
  readonly menubarChromePt = { rootList: { tabindex: '-1', 'aria-hidden': 'true' } };

  /**
   * Empty the omnibar. The dropdown keeps its text in a plain field, so this
   * view is marked for check: the call comes from the sitemap, not from an
   * event inside the header.
   */
  clearSearch(): void {
    this.navDropdown()?.clear();
    this.cdr.markForCheck();
  }

  /** Mutual exclusion with the sitemap: close the omnibar's own dropdown. */
  closeDropdown(): void {
    this.navDropdown()?.closeDropdown();
    this.cdr.markForCheck();
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
