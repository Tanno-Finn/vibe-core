import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation.service';
import { CookieSettingsService } from '../../services/cookie-settings.service';
import { LANGUAGE_RULES } from '../../../config/languages';
import { SITE_CONFIG } from '../../../config/site';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="app-footer" role="contentinfo">
      <div class="footer-content">
        <!-- Copyright -->
        <div class="footer-copyright">
          <span>© {{ currentYear }} {{ site.name }}</span>
        </div>

        <!-- License Badge -->
        <a
          [href]="ccLicenseUrl()"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-license"
          [attr.aria-label]="licenseLinkLabel()"
        >
          <span class="license-badge">CC BY 4.0</span>
        </a>

        <!-- Impressum Link -->
        <a routerLink="/impressum" class="footer-link" [attr.aria-label]="impressumLabel()">
          {{ impressumLabel() }}
        </a>

        <!-- Accessibility Statement Link -->
        <a routerLink="/accessibility" class="footer-link" [attr.aria-label]="accessibilityLabel()">
          {{ accessibilityLabel() }}
        </a>

        <!-- Cookie settings: reopens the consent dialog on every page, so a
             decision can be changed or withdrawn as easily as it was given
             (DSGVO Art. 7 Abs. 3). A button, not a link: it opens a dialog and
             goes nowhere. -->
        <button type="button" class="footer-link footer-button" aria-haspopup="dialog" (click)="openCookieSettings()">
          {{ cookieSettingsLabel() }}
        </button>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .app-footer {
        margin-top: auto;
        padding: var(--space-4) var(--space-6);
        background: transparent;
        border-top: 1px solid var(--surface-border);
      }

      .footer-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-4);
        flex-wrap: wrap;
        max-width: 1200px;
        margin: 0 auto;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      .footer-copyright {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }

      .footer-license {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        transition: transform 0.2s;
      }

      .footer-license:hover {
        transform: scale(1.05);
      }

      .license-badge {
        padding: 0.2rem 0.5rem;
        background: var(--green-100);
        color: var(--green-700);
        border-radius: var(--border-radius-sm);
        font-size: 0.75rem;
        font-weight: 600;
      }

      .footer-link {
        color: var(--text-color-secondary);
        text-decoration: none;
        transition: color 0.2s;
      }

      /* The cookie-settings button reads as the links beside it. */
      .footer-button {
        padding: 0;
        border: none;
        background: none;
        font: inherit;
        cursor: pointer;
      }

      .footer-link:hover {
        color: var(--primary-color-fg);
        text-decoration: underline;
      }

      .footer-link:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: 2px;
      }

      /* SHELL-12: License link focus-visible */
      .footer-license:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        border-radius: 2px;
      }

      /* SHELL-11: Dark theme license badge contrast */
      :host-context(.dark-theme) .license-badge {
        background: rgba(16, 185, 129, 0.15);
        color: #6ee7b7;
      }

      @media (max-width: 480px) {
        .footer-content {
          flex-direction: column;
          gap: var(--space-2);
        }
      }
    `,
  ],
})
export class AppFooterComponent {
  private translationService = inject(TranslationService);
  private cookieSettings = inject(CookieSettingsService);
  /** The site's name, from src/config/site.json. */
  readonly site = inject(SITE_CONFIG);

  currentYear = new Date().getFullYear();

  impressumLabel = computed(() => this.translationService.translate('app.footer.impressum'));
  licenseLinkLabel = computed(() => this.translationService.translate('app.footer.licenseLink'));
  accessibilityLabel = computed(() => this.translationService.translate('app.footer.accessibility'));
  cookieSettingsLabel = computed(() => this.translationService.translate('app.footer.cookieSettings'));

  /** Opens the cookie settings dialog, which hands focus back to this button on close. */
  openCookieSettings(): void {
    this.cookieSettings.open();
  }

  // Localized CC BY 4.0 license URL based on current language
  ccLicenseUrl = computed(() => {
    const lang = this.translationService.currentLanguage;
    // CC BY 4.0 deeds exist per base language; an Easy-Language variant
    // reads the deed of its base language.
    const deedLang = LANGUAGE_RULES.baseLanguageOf(lang);
    return `https://creativecommons.org/licenses/by/4.0/deed.${deedLang}`;
  });
}
