/**
 * App Component
 * Main application component: the shell around every route. It owns the
 * shell-level state and wiring and delegates the pieces to children:
 *
 *   - AppHeaderComponent      banner, brand, bell, pickers, omnibar
 *   - SitemapOverlayComponent the sitemap dialog (modal from the sitemap
 *                             button, non-modal as the omnibar's result list)
 *   - HalEyeComponent         the "HAL 9000" easter egg
 *   - DevProdToggleComponent  dev-only prod simulation switch
 *   - OptimusA11yService      Optimus UI ARIA strings and role patches
 *
 * Here stay the skip link, the main landmark and its focus handling after a
 * navigation, the print header and footer, the sitemap's open/close/focus
 * logic, and the global FAB registration.
 */
import {
  Component,
  inject,
  computed,
  signal,
  effect,
  HostListener,
  ViewChild,
  AfterViewInit,
  DestroyRef,
  ViewEncapsulation,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Custom components
import { AppHeaderComponent } from './components/frame/app-header.component';
import { SitemapOverlayComponent } from './components/frame/sitemap-overlay.component';
import { HalEyeComponent } from './components/frame/hal-eye.component';
import { DevProdToggleComponent } from './components/frame/dev-prod-toggle.component';
import { CookieConsentComponent } from './components/frame/cookie-consent.component';
import { ToastContainerComponent } from './components/frame/toast-container.component';
import { AppLoadingOverlayComponent } from './components/shared/app-loading-overlay.component';
import { FabContainerComponent } from './components/shared/fab-container.component';
import { ScrollToTopFabComponent } from './components/shared/scroll-to-top-fab.component';
import { FeedbackDialogComponent } from './components/shared/feedback-dialog.component';
import { AppFooterComponent } from './components/frame/app-footer.component';
import { FabRegistryService, FAB_PRIORITIES } from './services/fab-registry.service';
import { DevModeService } from './services/dev-mode.service';
import { PlaygroundSettingsService } from './services/playground-settings.service';
import { OptimusA11yService } from './services/optimus-a11y.service';

// Flag sprites CSS is imported globally in styles.scss

// Services - V2 MIGRATION CRITICAL
import { NavigationItem, NavigationGroup, NavigationService } from './services/navigation.service';
import { TranslationService } from './services/translation.service';
import { UpdateDetectionService } from './services/update-detection.service';
import { MetaSeoService } from './services/meta-seo.service';
import { StructuredDataService } from './services/structured-data.service';

import { FaviconService } from './services/favicon.service';
import { AnalyticsService } from './services/analytics.service';
import { TimeGateService } from './services/time-gate.service';
import { environment } from '../environments/environment';
import { sitemapGroupsFor } from './utils/sitemap-groups';
import { scrollBehavior } from './utils/reduced-motion';
import { hostOf, siteHost } from './utils/site-host';
import { SITE_CONFIG } from '../config/site';

@Component({
  selector: 'app-root',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    RouterOutlet,
    AppHeaderComponent,
    SitemapOverlayComponent,
    HalEyeComponent,
    DevProdToggleComponent,
    CookieConsentComponent,
    ToastContainerComponent,
    AppLoadingOverlayComponent,
    FabContainerComponent,
    ScrollToTopFabComponent,
    FeedbackDialogComponent,
    AppFooterComponent,
  ],
  template: `
    <!-- Translation Loading Overlay - Shows while translations are loading -->
    <app-loading-overlay [isVisible]="isLoading()" [loadingMessage]="loadingMessage()"> </app-loading-overlay>

    <div class="app-container">
      <!-- Skip-to-Content Link (WCAG 2.4.1 Bypass Blocks) -->
      <a class="skip-link" href="#main-content" (click)="skipToContent($event)">
        {{ translate('app.nav.skipToContent') }}
      </a>

      <!-- Main Application Header -->
      <app-header
        #appHeader
        (sitemapToggle)="toggleSitemapOverlay()"
        (halTriggered)="halEye.trigger()"
        (searchFocused)="onSearchFocused()"
        (searchChanged)="onSearchChanged($event)"
      />

      <!-- Sitemap Backdrop + Overlay -->
      <app-sitemap-overlay
        #sitemapOverlay
        [visible]="sitemapOverlayVisible()"
        [modal]="sitemapModal()"
        [query]="searchQuery()"
        [groups]="filteredNavigationGroups()"
        (closeRequested)="toggleSitemapOverlay()"
        (queryChange)="onSearchChanged($event)"
        (navigate)="navigateFromSitemap($event)"
        (clearRequested)="clearSearch()"
      />

      <!-- HAL 9000 Eye - decorative element, hidden from screen readers -->
      <app-hal-eye #halEye />

      <!-- Print-only header (screen: hidden, print: visible) -->
      <div class="print-header" aria-hidden="true">
        <span class="print-header-title">{{ site.name }}</span>
        <span class="print-header-meta">
          @if (currentPageId()) {
            <span class="print-header-id">{{ currentPageId() }}</span>
          }
          @if (printHost()) {
            <span class="print-header-url">{{ printHost() }}</span>
          }
        </span>
      </div>

      <!-- Main Content Area: a native <main>, so the page header rendered
           inside it is not mistaken for a nested banner (axe
           landmark-banner-is-top-level). Pages never render their own <main>. -->
      <main id="main-content" tabindex="-1" class="content-container">
        <router-outlet></router-outlet>
      </main>

      <!-- Print-only footer (screen: hidden, print: visible) -->
      <div class="print-footer" aria-hidden="true">
        <span>© {{ currentYear }} {{ site.name }}</span>
        <span class="print-footer-separator">|</span>
        <span>{{ translate('app.footer.printLicense') }}</span>
        <span class="print-footer-separator">|</span>
        <span>creativecommons.org/licenses/by/4.0</span>
        @if (printHost()) {
          <span class="print-footer-separator">|</span>
          <span class="print-footer-url">{{ printHost() }}</span>
        }
      </div>

      <!-- Footer with Copyright, License Badge, and Impressum Link -->
      <app-footer></app-footer>

      <!-- DSGVO-konformer Cookie-Hinweis als eigene Komponente -->
      <app-cookie-consent></app-cookie-consent>

      <!-- Toast-Nachrichten für Benachrichtigungen -->
      <app-toast-container></app-toast-container>

      <!-- Global FAB Container (renders all registered FABs) -->
      <app-fab-container></app-fab-container>

      <!-- Global Scroll-to-Top FAB (registers itself, visible after scrolling) -->
      <app-scroll-to-top-fab fabIdSuffix="global"></app-scroll-to-top-fab>

      <!-- Feedback Dialog (opened via FAB click) -->
      <app-feedback-dialog #feedbackDialog></app-feedback-dialog>

      <!-- Dev-only: Prod simulation toggle -->
      @if (devModeService.showDevTools) {
        <app-dev-prod-toggle />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-root .app-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      app-root .content-container {
        flex: 1;
        padding: 1rem;
      }

      app-root .mr-2 {
        margin-right: 0.5rem;
      }

      /* Skip-to-Content Link (WCAG 2.4.1) */
      app-root .skip-link {
        position: absolute;
        top: -100%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        padding: 12px 24px;
        background: var(--primary-color);
        /* The label token that reads on --primary-color in every palette;
           plain white measured 1.05:1 on the contrast palette in dark mode. */
        color: var(--primary-color-text);
        border-radius: 0 0 8px 8px;
        font-weight: bold;
        text-decoration: none;
        transition: top 0.2s;
      }
      app-root .skip-link:focus {
        top: 0;
      }

      /* Print-only header and footer */
      .print-header,
      .print-footer {
        display: none;
      }

      @media print {
        .print-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 0 0.4rem 0;
          margin-bottom: 0.75rem;
          border-bottom: 2px solid #333;
          font-size: 10pt;
        }

        .print-header-title {
          font-weight: 700;
          font-size: 12pt;
          color: #1e293b;
        }

        .print-header-meta {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .print-header-id {
          font-family: monospace;
          font-size: 8pt;
          font-weight: 600;
          padding: 1px 5px;
          border: 1px solid #999;
          border-radius: 3px;
          color: #333;
        }

        .print-header-url {
          font-family: monospace;
          font-size: 9pt;
          color: #555;
        }

        .print-footer {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding: 0.5rem 0 0 0;
          margin-top: 1.5rem;
          border-top: 1px solid #999;
          font-size: 8pt;
          color: #555;
        }

        .print-footer-separator {
          color: #bbb;
        }
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit {
  title = 'portal';
  currentYear = new Date().getFullYear();
  /** The site's name for the print header and footer, from src/config/site.json. */
  readonly site = inject(SITE_CONFIG);
  /**
   * Host named in the print header and footer: the real one, or none
   * (utils/site-host). Starts from the configured siteUrl, the same value
   * the server rendered, and takes the page's own host after the first
   * browser render and before every print — so hydration sees no mismatch.
   */
  readonly printHost = signal(hostOf(environment.siteUrl));

  // Reduced motion (WCAG 2.3.3): the app animates only with CSS (transitions,
  // keyframes, animate.enter/animate.leave), and the global
  // prefers-reduced-motion rule at the top of styles.scss cuts all of it to
  // 0.01ms. That replaces the old @.disabled host binding.

  // Dev mode service (gates dev-only UI in production)
  devModeService = inject(DevModeService);
  playgroundSettings = inject(PlaygroundSettingsService);

  // Inject services
  translationService = inject(TranslationService);
  navigationService = inject(NavigationService);
  updateDetectionService = inject(UpdateDetectionService);
  router = inject(Router);

  private fabRegistry = inject(FabRegistryService);
  private readonly optimusA11y = inject(OptimusA11yService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  // Feedback dialog reference
  @ViewChild('feedbackDialog') feedbackDialog!: FeedbackDialogComponent;

  // Header reference (the omnibar lives there; mutual exclusion with the sitemap)
  @ViewChild('appHeader') appHeader?: AppHeaderComponent;

  // Sitemap reference (focus management, SHELL-4)
  @ViewChild('sitemapOverlay') sitemapOverlay?: SitemapOverlayComponent;

  // Translation loading state for showing/hiding loading overlay
  translationsLoaded = toSignal(this.translationService.isTranslationsLoaded, {
    initialValue: false,
  });

  // Loading state computed property
  isLoading = computed(() => !this.translationsLoaded());

  // Loading message (static — shown briefly before translations are available)
  loadingMessage = computed(() => 'Loading...');

  // Sitemap overlay state
  sitemapOverlayVisible = signal(false);
  /**
   * Whether the open sitemap is a MODAL dialog. Opened from the sitemap button,
   * it is: focus moves to its close button, Tab is trapped inside it
   * (cdkTrapFocus) and aria-modal="true" tells AT the page behind is out of
   * reach. Opened from the omnibar, it is the live result list of the search
   * input the user keeps typing into — trapping focus there would lock the
   * input out, so it is a non-modal dialog (no aria-modal, no trap).
   */
  sitemapModal = signal(false);

  // Omnibar live-filter — the sitemap overlay reads filteredNavigationGroups()
  // and re-renders as the user types in the search input.
  searchQuery = signal('');
  /** Bumped on every languageChanged event so the filtered groups computed
   *  picks up newly-translated labels. */
  private languageVersion = signal(0);

  filteredNavigationGroups = computed<NavigationGroup[]>(() => {
    this.languageVersion();
    return sitemapGroupsFor(this.navigationService, this.searchQuery(), (key) => this.translate(key));
  });

  private sitemapTriggerElement: HTMLElement | null = null;

  /**
   * Current page's 4-char ID for the print header (e.g. "NAPI"). A signal, not
   * a getter, now that the shell is OnPush: refreshed after every navigation
   * and right before printing, when the page index may have filled in since.
   */
  currentPageId = signal('');

  constructor() {
    // Browser-only by construction: the page's own host for the printout.
    afterNextRender(() => this.printHost.set(siteHost()));

    // Force navigation refresh to ensure all routes are loaded
    this.navigationService.refreshNavigation();

    // Initialize SEO service for dynamic meta tags
    inject(MetaSeoService);

    // Initialize structured data service for JSON-LD schemas
    inject(StructuredDataService);

    // Initialize favicon service for dynamic favicon switching
    inject(FaviconService);

    // Initialize analytics service (GDPR-compliant, no cookies)
    inject(AnalyticsService).initialize();

    // Initialize time gate service for timed-release content
    inject(TimeGateService).initialize();

    // Hand Optimus UI its own ARIA strings in the current language. An effect, not a
    // one-shot call: translate() reads the service's version signal, so this re-runs
    // both on a language switch and when a bundle finishes loading. Without the
    // latter the first pass ran before the bundle arrived and Optimus UI was handed the
    // raw key — measured the raw key "optimus.listLabel" as the listbox name on /en/ai-timeline.
    effect(() => this.optimusA11y.syncAriaStrings());

    // `document.documentElement.lang` is NOT written here. MetaSeoService, injected
    // above, owns it and writes the resolvable base tag (it strips the "-easy"
    // suffix, for which no ISO code exists). This component used to write the raw
    // portal language from its own subscription to the same event, and because it
    // subscribed second it won: after hydration every Easy variant carried
    // lang="<x>-easy", undoing the strip the prerendered HTML had got right. One
    // writer, no subscription-order dependency.
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      // Trigger filteredNavigationGroups computed to re-evaluate with the new locale
      this.languageVersion.update((v) => v + 1);
    });

    // Focus-Management nach Route-Change (WCAG 2.4.3 Focus Order, X8)
    // Nach jeder Navigation Fokus auf #main-content setzen, damit Screen-Reader-
    // und Keyboard-User nicht jedes Mal neu durch Header/Navigation tabben muessen.
    // preventScroll: true verhindert Konflikt mit withInMemoryScrolling
    // (scrollPositionRestoration: 'top') - Scrolling wird weiterhin vom Router
    // uebernommen, der Fokus wird nur gesetzt.
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        // Safety-net: schliesse das Sitemap-Overlay nach JEDER abgeschlossenen
        // Navigation. Der Klick-Pfad (navigateFromSitemap) schliesst zwar selbst,
        // aber das Enter-Routing der Omnibar (4-Zeichen-pageId, z.B. eine
        // Demo-Kurz-ID) navigiert ueber die navigation-dropdown-Komponente, die das
        // Overlay des Hosts nicht kennt -> sonst bleibt es offen ueber der neuen
        // Seite. Hier zentral abgefangen, deckt auch kuenftige Navigationspfade ab.
        if (this.sitemapOverlayVisible()) {
          this.sitemapOverlayVisible.set(false);
        }
        this.refreshPageId();
        if (!isPlatformBrowser(this.platformId)) return;
        const main = document.getElementById('main-content');
        if (main) {
          main.focus({ preventScroll: true });
        }
      });

    this.destroyRef.onDestroy(() => this.optimusA11y.stop());
  }

  /**
   * Omnibar focus → open the sitemap overlay (closed-state default). The
   * sitemap doubles as the "all available pages" view; typing into the
   * input filters that view live (see filteredNavigationGroups below).
   */
  onSearchFocused(): void {
    if (!this.sitemapOverlayVisible()) {
      this.toggleSitemapOverlay({ focusCloseButton: false });
    }
  }

  /**
   * Live-filter the sitemap as the user types. The omnibar no longer has
   * its own dropdown UI — the sitemap is the dropdown, and it responds to
   * this signal via the filteredNavigationGroups computed.
   */
  onSearchChanged(value: string): void {
    this.searchQuery.set(value ?? '');
    if (value && value.length > 0 && !this.sitemapOverlayVisible()) {
      // Edge case: paste before an explicit focus event.
      this.toggleSitemapOverlay({ focusCloseButton: false });
    }
  }

  /**
   * Reset both the omnibar input and the host signal — invoked from the
   * sitemap empty-state's "clear search" action. The desktop omnibar owns
   * its own ngModel state, so we ask it to clear itself; the mobile inline
   * input binds directly to `searchQuery()` and updates via the signal reset.
   *
   * Focus management: the clear-button disappears the moment the query is
   * reset (the @empty branch closes), so we must hand focus to a still-living
   * element. Prefer the visible search input — mobile drawer input ≤750px,
   * otherwise the header omnibar.
   */
  clearSearch(): void {
    this.appHeader?.clearSearch();
    this.searchQuery.set('');
    if (!isPlatformBrowser(this.platformId)) return;
    // Defer one tick so Angular re-renders without the empty-state first;
    // focusing a node that's about to be removed would still drop us to body.
    queueMicrotask(() => {
      const mobile = document.querySelector<HTMLInputElement>('.sitemap-search-input');
      const desktop = document.querySelector<HTMLInputElement>('app-navigation-dropdown .omnibar-input');
      const target = mobile && mobile.offsetParent !== null ? mobile : desktop;
      target?.focus();
    });
  }

  /**
   * Toggle sitemap overlay visibility
   */
  toggleSitemapOverlay(opts: { focusCloseButton?: boolean } = {}): void {
    const willBeVisible = !this.sitemapOverlayVisible();
    // Default to stealing focus to the close button (SHELL-4 pattern). The
    // omnibar opens the same overlay but wants focus to stay on the search
    // input so the user can keep typing — that path passes
    // { focusCloseButton: false }.
    const focusCloseButton = opts.focusCloseButton ?? true;

    if (willBeVisible) {
      // Close navigation dropdown (mutual exclusion)
      this.appHeader?.closeDropdown();
      // Save trigger element for focus return (SHELL-4)
      this.sitemapTriggerElement = isPlatformBrowser(this.platformId) ? (document.activeElement as HTMLElement) : null;
      this.sitemapModal.set(focusCloseButton);
      this.sitemapOverlayVisible.set(true);

      if (focusCloseButton) {
        // Focus close button when dialog opens (SHELL-4)
        setTimeout(() => {
          this.sitemapOverlay?.focusCloseButton();
        }, 0);
      }
    } else {
      this.sitemapOverlayVisible.set(false);
      // Reset the live-filter so the next open shows all groups again.
      this.searchQuery.set('');
      this.appHeader?.clearSearch();
      // Return focus to the trigger element (SHELL-4) — except when the
      // trigger is the omnibar input, since its (focus) handler would
      // immediately reopen the sitemap we just dismissed.
      const trigger = this.sitemapTriggerElement;
      this.sitemapTriggerElement = null;
      if (trigger && trigger.tagName !== 'INPUT') {
        trigger.focus();
      }
    }
  }

  navigateFromSitemap(item: NavigationItem): void {
    this.sitemapOverlayVisible.set(false);
    this.navigationService.navigateToPage(item);
  }

  /**
   * Close sitemap on ESC key
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.sitemapOverlayVisible()) {
      // Through the toggle, so Escape also hands focus back to the trigger
      // (SHELL-4) — the focus trap must never be a dead end (A11Y-001).
      this.toggleSitemapOverlay();
    }
  }

  /**
   * Close sitemap on scroll
   */
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.sitemapOverlayVisible()) {
      this.sitemapOverlayVisible.set(false);
    }
  }

  /**
   * Skip to main content (WCAG 2.4.1 Bypass Blocks)
   */
  skipToContent(event: Event): void {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: scrollBehavior() });
    }
  }

  /**
   * Get translation for a key
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /** Print header page id; also refreshed right before printing (see currentPageId). */
  @HostListener('window:beforeprint')
  refreshPageId(): void {
    const path = this.router.url.split('?')[0].replace(/^\//, '');
    const page = this.navigationService.getAvailablePages().find((p) => p.route === '/' + path);
    this.currentPageId.set(page?.pageId || '');
  }

  /** Print header/footer host, re-read right before printing (see printHost). */
  @HostListener('window:beforeprint')
  refreshSiteHost(): void {
    this.printHost.set(siteHost());
  }

  /**
   * Register global FABs after view is initialized
   */
  ngAfterViewInit(): void {
    // Register Feedback FAB (global, highest priority = bottom) — but only when
    // a feedback endpoint is configured (environment.feedback.endpoint). No
    // backend ships with the kit, so without an endpoint there is nothing to
    // receive the submission; we hide the FAB entirely rather than show a dead
    // button. See docs/how-to/add-a-backend.md ("Feedback endpoint").
    if (environment.feedback?.endpoint) {
      this.fabRegistry.register({
        id: 'feedback',
        priority: FAB_PRIORITIES.FEEDBACK,
        icon: 'pi-megaphone',
        labelKey: 'feedback.button',
        color: 'default',
        onClick: () => this.feedbackDialog.open(),
      });
    }

    // Optimus UI a11y patch: p-togglebutton is a custom element with aria-pressed
    // but no role="button", causing axe-core ARIA attribute mismatch violations
    this.optimusA11y.patchRoles();
  }
}
