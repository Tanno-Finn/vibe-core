/**
 * Cookie Consent Component
 * DSGVO-compliant consent banner for local storage of user progress.
 * Learning progress is saved only after a "yes" here (or in the settings);
 * until then it lives in memory for the session.
 *
 * The settings dialog stays reachable after the first decision: the footer's
 * "Cookie settings" entry and the settings page open it through
 * `CookieSettingsService`, so withdrawing consent is as easy as giving it
 * (DSGVO Art. 7 Abs. 3).
 *
 * Note: The consent decision itself is stored in localStorage, which is legally
 * permissible as it's technically necessary to remember the user's choice.
 * This solves the "cookie paradox" where you need storage to remember that
 * the user doesn't want storage.
 */
import {
  Component,
  OnInit,
  inject,
  HostListener,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ElementRef,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormsModule } from '@angular/forms';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { UserProgressService } from '../../services/user-progress.service';
import { AnalyticsService } from '../../services/analytics.service';
import { CookiePrefs, PrivacyConsentService } from '../../services/privacy-consent.service';
import { TranslationService } from '../../services/translation.service';
import { CookieSettingsService } from '../../services/cookie-settings.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [FormsModule, CdkTrapFocus],
  template: `
    <!-- DSGVO-konformer Cookie-Hinweis -->
    @if (showCookieConsent()) {
      <!-- No heading element in here: the banner floats over every page, and an
           h2 in it would slot into whatever outline the page has. The region is
           named by aria-label; the title is a styled paragraph. -->
      <div
        class="cookie-consent"
        role="region"
        [attr.aria-label]="translate('cookie.bannerLabel')"
        aria-describedby="cookie-description"
        aria-live="polite"
      >
        <div class="cookie-content">
          <div class="cookie-text">
            <p class="cookie-title">{{ translate('cookie.title') }}</p>
            <p id="cookie-description">{{ translate('cookie.description') }}</p>
          </div>
          <div class="cookie-actions" role="group" [attr.aria-label]="translate('cookie.actionsLabel')">
            <button class="cookie-btn cookie-settings-btn" (click)="openCookieSettings()">
              {{ translate('cookie.settings') }}
            </button>
            <button class="cookie-btn cookie-secondary-btn" (click)="acceptEssentialCookies()">
              {{ translate('cookie.disableProgress') }}
            </button>
            <button class="cookie-btn cookie-secondary-btn" (click)="acceptAllCookies()">
              {{ translate('cookie.acceptProgress') }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Cookie settings dialog. Modal: cdkTrapFocus keeps Tab inside it and
         auto-capture moves focus to its first control (the close button) on
         open; Escape and the close button hand focus back to the trigger — the
         banner's button, the footer's "Cookie settings" entry or the settings
         page's button. -->
    @if (showCookieSettings()) {
      <div
        class="cookie-settings-modal"
        role="dialog"
        cdkTrapFocus
        [cdkTrapFocusAutoCapture]="true"
        [attr.aria-labelledby]="'cookie-settings-title'"
        [attr.aria-describedby]="'cookie-settings-description'"
        aria-modal="true"
      >
        <div class="cookie-settings-content">
          <div class="cookie-settings-header">
            <h2 id="cookie-settings-title" class="cookie-settings-title">{{ translate('cookie.settingsTitle') }}</h2>
            <button
              class="cookie-close-btn"
              (click)="closeCookieSettings()"
              [attr.aria-label]="translate('cookie.closeDialog')"
              type="button"
            >
              &times;
            </button>
          </div>
          <div class="cookie-settings-body">
            <p id="cookie-settings-description" class="sr-only">{{ translate('cookie.settingsDescription') }}</p>
            <fieldset class="cookie-category">
              <legend class="sr-only">{{ translate('cookie.essential.title') }}</legend>
              <div class="cookie-category-header">
                <div>
                  <p id="essential-cookies-title" class="cookie-category-title" aria-hidden="true">
                    {{ translate('cookie.essential.title') }}
                  </p>
                  <p id="essential-cookies-description">
                    {{ translate('cookie.essential.description') }}
                  </p>
                </div>
                <label class="cookie-switch" [attr.aria-label]="translate('cookie.essential.switchLabel')">
                  <input
                    type="checkbox"
                    role="switch"
                    checked
                    disabled
                    [attr.aria-describedby]="'essential-cookies-description'"
                    [attr.aria-label]="translate('cookie.essential.inputLabel')"
                  />
                  <span class="cookie-slider" aria-hidden="true"></span>
                </label>
              </div>
            </fieldset>
            <fieldset class="cookie-category">
              <legend class="sr-only">{{ translate('cookie.progress.title') }}</legend>
              <div class="cookie-category-header">
                <div>
                  <p id="progress-cookies-title" class="cookie-category-title" aria-hidden="true">
                    {{ translate('cookie.progress.title') }}
                  </p>
                  <p id="progress-cookies-description">
                    {{ translate('cookie.progress.description') }}
                  </p>
                </div>
                <label class="cookie-switch" [attr.aria-label]="translate('cookie.progress.switchLabel')">
                  <input
                    type="checkbox"
                    role="switch"
                    [(ngModel)]="cookiePreferences.progress"
                    [attr.aria-describedby]="'progress-cookies-description'"
                    [attr.aria-label]="translate('cookie.progress.inputLabel')"
                  />
                  <span class="cookie-slider" aria-hidden="true"></span>
                </label>
              </div>
            </fieldset>
            @if (analyticsAvailable) {
              <fieldset class="cookie-category">
                <legend class="sr-only">{{ translate('cookie.analytics.title') }}</legend>
                <div class="cookie-category-header">
                  <div>
                    <p id="analytics-cookies-title" class="cookie-category-title" aria-hidden="true">
                      {{ translate('cookie.analytics.title') }}
                    </p>
                    <p id="analytics-cookies-description">
                      {{ translate('cookie.analytics.description') }}
                    </p>
                  </div>
                  <label class="cookie-switch" [attr.aria-label]="translate('cookie.analytics.switchLabel')">
                    <input
                      type="checkbox"
                      role="switch"
                      [(ngModel)]="cookiePreferences.analytics"
                      [attr.aria-describedby]="'analytics-cookies-description'"
                      [attr.aria-label]="translate('cookie.analytics.inputLabel')"
                    />
                    <span class="cookie-slider" aria-hidden="true"></span>
                  </label>
                </div>
              </fieldset>
            }
          </div>
          <div class="cookie-settings-footer">
            <button
              class="cookie-btn cookie-save-btn"
              (click)="saveCookiePreferences()"
              [attr.aria-label]="translate('cookie.saveSettingsAriaLabel')"
            >
              {{ translate('cookie.save') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Cookie-actions layout is in global styles.scss for responsive overrides */

      /* Fieldset styling reset */
      fieldset.cookie-category {
        border: none;
        padding: 0;
        margin: 0;
        min-width: 0;
      }

      fieldset.cookie-category legend {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* Toggle Switch Styles.
       The control is a native <input type="checkbox"> carrying role="switch":
       it looks like a switch, so it has to announce as one, and a checkbox that
       is styled as a switch announces the wrong thing. Kept hand-rolled rather
       than swapped for p-toggleswitch because ::after below buys a 48 x 44 touch
       target, where p-toggleswitch measures 40 x 24. */
      .cookie-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 24px;
        cursor: pointer;
      }

      /* CTM-6: Expanded touch target for toggle */
      .cookie-switch::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 48px;
        min-height: 44px;
      }

      .cookie-switch input[type='checkbox'] {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      .cookie-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--surface-300);
        border-radius: 24px;
        transition: all 0.2s ease;
        border: 1px solid var(--surface-border);
      }

      .cookie-slider:before {
        position: absolute;
        content: '';
        height: 18px;
        width: 18px;
        left: 2px;
        bottom: 2px;
        background-color: var(--surface-0);
        border-radius: 50%;
        transition: all 0.2s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .cookie-switch input[type='checkbox']:checked + .cookie-slider {
        background-color: var(--primary-color-fg);
        border-color: var(--primary-color-fg);
      }

      .cookie-switch input[type='checkbox']:checked + .cookie-slider:before {
        transform: translateX(24px);
        background-color: var(--primary-color-text);
      }

      .cookie-switch input[type='checkbox']:disabled + .cookie-slider {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .cookie-switch input[type='checkbox']:focus-visible + .cookie-slider {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.2);
      }

      .cookie-close-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
    `,
  ],
})
export class CookieConsentComponent implements OnInit {
  // Default false so prerendered/SSR HTML does not contain the banner.
  // initializeCookieConsent() flips it to true only in the browser when no
  // saved preferences exist — prevents the banner flashing on reload for
  // users who have already consented.
  readonly showCookieConsent = signal(false);
  readonly showCookieSettings = signal(false);
  private platformId = inject(PLATFORM_ID);
  private triggerElement: HTMLElement | null = null;

  /** SHELL-2: Escape key closes settings dialog */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showCookieSettings()) {
      this.closeCookieSettings();
    }
  }
  cookiePreferences: CookiePrefs = {
    essential: true, // Always required
    // Off until the visitor switches it on: a pre-ticked box is not consent
    // (DSGVO Art. 7, CJEU C-673/17 "Planet49"). Nothing progress-related is
    // written before a "yes" — see PrivacyConsentService.hasProgressConsent().
    progress: false,
    analytics: false, // TDDDG § 25: Must be opt-in, default off
  };

  private userProgressService = inject(UserProgressService);
  private analyticsService = inject(AnalyticsService);

  /**
   * Whether analytics can happen at all. Without a configured endpoint the
   * analytics toggle and its text are not rendered, "accept all" does not
   * record an analytics consent, and a stored `true` from an earlier setup is
   * not carried forward.
   */
  readonly analyticsAvailable = this.analyticsService.isConfigured;
  private privacyConsent = inject(PrivacyConsentService);
  private translationService = inject(TranslationService);
  private cookieSettings = inject(CookieSettingsService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // The footer entry and the settings page reopen the dialog at any time.
    this.cookieSettings.openRequested.pipe(takeUntilDestroyed()).subscribe(() => this.openCookieSettings());
    // A decision stored anywhere — the settings page's progress switch included —
    // answers the banner's question, so the banner goes as soon as one exists.
    // The writer has already applied it; this only mirrors it here, so a dialog
    // opened later starts from it.
    this.privacyConsent.preferencesChanged.pipe(takeUntilDestroyed()).subscribe((prefs) => {
      this.cookiePreferences = {
        essential: true,
        progress: prefs.progress,
        analytics: this.analyticsAvailable && prefs.analytics,
      };
      this.showCookieConsent.set(false);
    });
  }

  translate(key: string): string {
    const translation = this.translationService.translate(key);
    // Replace {{year}} placeholder with current year
    const currentYear = new Date().getFullYear();
    return translation.replace('{{year}}', currentYear.toString());
  }

  ngOnInit(): void {
    this.initializeCookieConsent();
  }

  /**
   * Initialize cookie consent by checking if preferences exist
   * Note: Storing the consent decision itself in localStorage is legally permissible
   * as it's technically necessary to remember the user's choice.
   */
  private initializeCookieConsent(): void {
    const savedPreferences = this.privacyConsent.getCookiePreferences();

    if (savedPreferences) {
      // Backward compat: existing users without analytics field default to false.
      // The service's parser already enforces schema, so missing fields would
      // make it return null and fall through to the banner. We accept whatever
      // it gives us as authoritative.
      this.cookiePreferences = {
        essential: true,
        progress: savedPreferences.progress,
        analytics: this.analyticsAvailable && savedPreferences.analytics,
      };
      this.applyCookiePreferences();
      return;
    }

    // No (valid) preferences yet: show banner only in browser, never during SSR/prerender
    if (isPlatformBrowser(this.platformId)) {
      this.showCookieConsent.set(true);
    }
  }

  /**
   * Open cookie settings modal — from the banner, the footer entry or the
   * settings page. The switches start from the decision stored now, not from
   * the one this component saw at startup: the settings page may have changed
   * the progress choice since.
   * browser-only: opened by a click, never during prerender.
   */
  openCookieSettings(): void {
    if (this.showCookieSettings()) return;
    this.triggerElement = document.activeElement as HTMLElement;
    const saved = this.privacyConsent.getCookiePreferences();
    if (saved) {
      this.cookiePreferences = {
        essential: true,
        progress: saved.progress,
        analytics: this.analyticsAvailable && saved.analytics,
      };
    }
    // Focus moves into the dialog through cdkTrapFocusAutoCapture (SHELL-2).
    this.showCookieSettings.set(true);
  }

  /**
   * Close cookie settings modal
   */
  closeCookieSettings(): void {
    this.showCookieSettings.set(false);
    this.triggerElement?.focus();
    this.triggerElement = null;
  }

  /**
   * Accept all cookies
   */
  acceptAllCookies(): void {
    this.cookiePreferences = {
      essential: true,
      progress: true,
      analytics: this.analyticsAvailable,
    };
    this.analyticsService.trackConsentDecision(this.analyticsAvailable); // Banner accepted
    this.saveCookiePreferences(false);
  }

  /**
   * Accept only essential cookies
   */
  acceptEssentialCookies(): void {
    this.cookiePreferences = {
      essential: true,
      progress: false,
      analytics: false,
    };
    this.analyticsService.trackConsentDecision(false); // Banner rejected
    this.saveCookiePreferences(false);
  }

  /**
   * Save cookie preferences
   * The consent decision itself is always stored (legally permissible as technically necessary)
   */
  saveCookiePreferences(trackDecision = true): void {
    // No endpoint, no analytics: never store a consent to something that cannot happen.
    if (!this.analyticsAvailable) {
      this.cookiePreferences = { ...this.cookiePreferences, analytics: false };
    }

    // Track consent decision from settings dialog (explicit analytics toggle).
    // Banner buttons (acceptAll/acceptEssential) track their own decision
    // before calling this method with trackDecision=false.
    if (trackDecision) {
      this.analyticsService.trackConsentDecision(this.cookiePreferences.analytics);
    }

    // Store preferences in localStorage (always allowed for consent decision)
    this.privacyConsent.setCookiePreferences(this.cookiePreferences);

    // Hide cookie consent banner
    const dialogWasOpen = this.showCookieSettings();
    this.showCookieConsent.set(false);
    this.showCookieSettings.set(false);
    // Saved from the dialog: a trigger that stays on the page (the footer
    // entry, the settings page's button) gets focus back. One that sat in the
    // banner is about to disappear with it, so focus goes to the main landmark
    // instead of falling to <body>.
    if (dialogWasOpen && isPlatformBrowser(this.platformId)) {
      const trigger = this.triggerElement;
      this.triggerElement = null;
      if (trigger?.isConnected && !this.host.nativeElement.contains(trigger)) {
        trigger.focus();
      } else {
        document.getElementById('main-content')?.focus();
      }
    }

    // Apply cookie preferences
    this.applyCookiePreferences();
    this.cookieSettings.notifySaved();
  }

  /**
   * Apply cookie preferences by enabling/disabling tracking scripts
   */
  private applyCookiePreferences(): void {
    // Progress: the decision is already stored in cookiePreferences (the one
    // source of truth). With a "yes" the session's progress is saved now; with
    // a "no" it is reset and whatever was stored is removed.
    this.userProgressService.applyConsent();

    // Apply analytics consent (read by AnalyticsService on every signal)
    this.privacyConsent.setAnalyticsConsent(this.cookiePreferences.analytics);
  }
}
