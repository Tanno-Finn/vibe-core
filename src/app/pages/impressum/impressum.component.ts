import { Component, inject, computed, ChangeDetectorRef, ChangeDetectionStrategy, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ANGULAR_VERSION } from '../../../build-version';
import { TranslationService } from '../../services/translation.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { StandardContainerComponent } from '../../components/shared/standard-container.component';
import { ArticleComponent } from '../../components/shared/article.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { GlossaryPopoverComponent } from '../../components/shared/glossary-popover.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { SITE_OPERATOR } from '../../../config/site-operator';
import { LANGUAGE_RULES } from '../../../config/languages';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-impressum',
  imports: [
    PageHeaderComponent,
    StandardContainerComponent,
    ArticleComponent,
    HighlightDirective,
    GlossaryPopoverComponent,
    TableOfContentsFabComponent,
    FabStackComponent,
    SimpleEasyLanguageFabComponent,
  ],
  template: `
    <app-article width="page" [transparentBackground]="true">
      <app-page-header titleKey="impressum.title" subtitleKey="impressum.subtitle"></app-page-header>

      <!-- Contact Information -->
      <app-standard-container
        id="contact-info"
        [config]="{
          titleKey: 'impressum.contactInfo',
          type: 'primary',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-user',
          headingLevel: 2,
        }"
      >
        <div class="contact-details">
          <div class="contact-item">
            <div class="contact-info">
              <strong [appHighlight]="translate('impressum.responsiblePerson')">{{
                translate('impressum.responsiblePerson')
              }}</strong>
              <span>{{ operator.name }}</span>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-info">
              <strong [appHighlight]="translate('impressum.purpose')">{{ translate('impressum.purpose') }}</strong>
              <span [appHighlight]="translate('impressum.purposeText')">{{ translate('impressum.purposeText') }}</span>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-info">
              <strong [appHighlight]="contact()">{{ contact() }}</strong>
              <span>{{ operator.address }}</span>
              <a [href]="'mailto:' + operator.email" class="contact-email">{{ operator.email }}</a>
            </div>
          </div>
        </div>
      </app-standard-container>

      <!-- Website Information -->
      <app-standard-container
        id="website-info"
        [config]="{
          titleKey: 'impressum.websiteInfo',
          type: 'secondary',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-globe',
          headingLevel: 2,
        }"
      >
        <div class="website-info">
          <div class="info-section">
            <div class="info-header">
              <div class="info-icon">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
              </div>
              <h3 [appHighlight]="aboutSite()">{{ aboutSite() }}</h3>
            </div>
            <p class="info-description" [appHighlight]="aboutSiteText()">{{ aboutSiteText() }}</p>
          </div>

          <div class="info-section">
            <div class="info-header">
              <div class="info-icon">
                <i class="pi pi-code" aria-hidden="true"></i>
              </div>
              <h3 [appHighlight]="technicalImplementation()">{{ technicalImplementation() }}</h3>
            </div>
            <p class="info-description" [appHighlight]="technicalImplementationText()">
              {{ technicalImplementationText() }}
            </p>
          </div>

          <div class="info-section">
            <div class="info-header">
              <div class="info-icon">
                <i class="pi pi-users" aria-hidden="true"></i>
              </div>
              <h3 [appHighlight]="targetAudience()">{{ targetAudience() }}</h3>
            </div>
            <p class="info-description" [appHighlight]="targetAudienceText()">{{ targetAudienceText() }}</p>
          </div>
        </div>
      </app-standard-container>

      <!-- Data Protection -->
      <app-standard-container
        id="data-protection"
        [config]="{
          titleKey: 'impressum.dataProtection',
          type: 'success',
          collapsible: true,
          initiallyExpanded: false,
          elevation: 'md',
          icon: 'pi pi-shield',
          headingLevel: 2,
        }"
      >
        <div class="privacy-features">
          <div class="feature-item">
            <div class="feature-icon-wrapper">
              <i class="pi pi-check-circle" aria-hidden="true"></i>
            </div>
            <span [appHighlight]="dataProtectionText1()">{{ dataProtectionText1() }}</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper">
              <i class="pi pi-check-circle" aria-hidden="true"></i>
            </div>
            <span [appHighlight]="dataProtectionText2()">{{ dataProtectionText2() }}</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper">
              <i class="pi pi-check-circle" aria-hidden="true"></i>
            </div>
            <span [appHighlight]="dataProtectionText3()">{{ dataProtectionText3() }}</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon-wrapper">
              <i class="pi pi-check-circle" aria-hidden="true"></i>
            </div>
            <span [appHighlight]="dataProtectionText4()">{{ dataProtectionText4() }}</span>
          </div>
        </div>

        <!-- DSGVO Art. 13 Pflichtangaben -->
        <div class="dsgvo-sections">
          <div class="dsgvo-intro">
            <h3 [appHighlight]="translate('impressum.dsgvoSectionTitle')">
              {{ translate('impressum.dsgvoSectionTitle') }}
            </h3>
            <p [appHighlight]="translate('impressum.dsgvoSectionIntro')">
              {{ translate('impressum.dsgvoSectionIntro') }}
            </p>
          </div>

          <div class="dsgvo-section">
            <h4 [appHighlight]="translate('impressum.dsgvoLegalBasis')">
              {{ translate('impressum.dsgvoLegalBasis') }}
            </h4>
            <p [appHighlight]="translate('impressum.dsgvoLegalBasisText')">
              {{ translate('impressum.dsgvoLegalBasisText') }}
            </p>
          </div>

          <div class="dsgvo-section">
            <h4 [appHighlight]="translate('impressum.dsgvoRetention')">{{ translate('impressum.dsgvoRetention') }}</h4>
            <p [appHighlight]="translate('impressum.dsgvoRetentionText')">
              {{ translate('impressum.dsgvoRetentionText') }}
            </p>
          </div>

          <div class="dsgvo-section">
            <h4 [appHighlight]="translate('impressum.dsgvoRights')">{{ translate('impressum.dsgvoRights') }}</h4>
            <p [appHighlight]="translate('impressum.dsgvoRightsText')">{{ translate('impressum.dsgvoRightsText') }}</p>
            <ul class="dsgvo-rights-list">
              <li [appHighlight]="translate('impressum.dsgvoRightAccess')">
                {{ translate('impressum.dsgvoRightAccess') }}
              </li>
              <li [appHighlight]="translate('impressum.dsgvoRightRectification')">
                {{ translate('impressum.dsgvoRightRectification') }}
              </li>
              <li [appHighlight]="translate('impressum.dsgvoRightErasure')">
                {{ translate('impressum.dsgvoRightErasure') }}
              </li>
              <li [appHighlight]="translate('impressum.dsgvoRightRestriction')">
                {{ translate('impressum.dsgvoRightRestriction') }}
              </li>
              <li [appHighlight]="translate('impressum.dsgvoRightPortability')">
                {{ translate('impressum.dsgvoRightPortability') }}
              </li>
              <li [appHighlight]="translate('impressum.dsgvoRightObjection')">
                {{ translate('impressum.dsgvoRightObjection') }}
              </li>
              <li [appHighlight]="translate('impressum.dsgvoRightWithdrawal')">
                {{ translate('impressum.dsgvoRightWithdrawal') }}
              </li>
            </ul>
            <p class="dsgvo-contact-line">
              <span [appHighlight]="translate('impressum.dsgvoRightsContact')">{{
                translate('impressum.dsgvoRightsContact')
              }}</span>
              <a [href]="'mailto:' + operator.email">{{ operator.email }}</a>
            </p>
          </div>

          <div class="dsgvo-section">
            <h4 [appHighlight]="translate('impressum.dsgvoComplaint')">{{ translate('impressum.dsgvoComplaint') }}</h4>
            <p [appHighlight]="translate('impressum.dsgvoComplaintText')">
              {{ translate('impressum.dsgvoComplaintText') }}
            </p>
            <address class="dsgvo-authority">
              <strong>{{ operator.supervisoryAuthority.name }}</strong
              ><br />
              {{ operator.supervisoryAuthority.address }}<br />
              <a [href]="operator.supervisoryAuthority.website" target="_blank" rel="noopener noreferrer">
                <i class="pi pi-external-link" aria-hidden="true"></i>
                {{ operator.supervisoryAuthority.website }}
              </a>
            </address>
          </div>

          <div class="dsgvo-section">
            <h4 [appHighlight]="translate('impressum.dsgvoContact')">{{ translate('impressum.dsgvoContact') }}</h4>
            <p [appHighlight]="translate('impressum.dsgvoContactText')">
              {{ translate('impressum.dsgvoContactText') }}
            </p>
          </div>

          <div class="dsgvo-section">
            <h4 [appHighlight]="translate('impressum.dsgvoLocalStorage')">
              {{ translate('impressum.dsgvoLocalStorage') }}
            </h4>
            <p [appHighlight]="translate('impressum.dsgvoLocalStorageText')">
              {{ translate('impressum.dsgvoLocalStorageText') }}
            </p>
            <!-- The keys current code writes, from utils/storage-keys.ts. Entries
                 marked legacy there (retired keys that are only ever migrated or
                 deleted, such as disableProgressTracking) are not listed. -->
            <ul class="dsgvo-storage-list">
              <li>
                <code>cookiePreferences</code>, <code>analyticsConsent</code> &mdash;
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageCookiePrefs')">{{
                  translate('impressum.dsgvoLocalStorageCookiePrefs')
                }}</span>
              </li>
              <li>
                <code>user_progress</code> &mdash;
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageProgress')">{{
                  translate('impressum.dsgvoLocalStorageProgress')
                }}</span>
              </li>
              <li>
                <code>theme</code>, <code>mode</code>, <code>themeColor</code> &mdash;
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageTheme')">{{
                  translate('impressum.dsgvoLocalStorageTheme')
                }}</span>
              </li>
              <li>
                <code>preferred-language-v2</code>, <code>easy-language-mode</code> &mdash;
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageLang')">{{
                  translate('impressum.dsgvoLocalStorageLang')
                }}</span>
              </li>
              <li>
                <code>preferred-font-v1</code> &mdash;
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageFont')">{{
                  translate('impressum.dsgvoLocalStorageFont')
                }}</span>
              </li>
              <li>
                <code>vibecore.feedback.inbox.v1</code> &mdash;
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageFeedback')">{{
                  translate('impressum.dsgvoLocalStorageFeedback')
                }}</span>
              </li>
              <li>
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageMore')">{{
                  translate('impressum.dsgvoLocalStorageMore')
                }}</span>
              </li>
              <li>
                <code>app_version</code>, <code>boot-tokens</code> &mdash;
                <span [appHighlight]="translate('impressum.dsgvoLocalStorageTechnical')">{{
                  translate('impressum.dsgvoLocalStorageTechnical')
                }}</span>
              </li>
            </ul>
            <p [appHighlight]="translate('impressum.dsgvoLocalStorageNote')">
              {{ translate('impressum.dsgvoLocalStorageNote') }}
            </p>
          </div>
        </div>
      </app-standard-container>

      <!-- License Information -->
      <app-standard-container
        id="license-info"
        [config]="{
          titleKey: 'impressum.license',
          type: 'info',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-file-check',
          headingLevel: 2,
        }"
      >
        <div class="license-grid">
          <!-- Portal Content License -->
          <div class="license-card license-portal">
            <div class="license-icon-wrapper portal-icon">
              <i class="pi pi-globe" aria-hidden="true"></i>
            </div>
            <div class="license-card-content">
              <div class="license-title-row">
                <h3 [appHighlight]="licensePortalTitle()">{{ licensePortalTitle() }}</h3>
                <span class="license-tag tag-open">CC BY 4.0</span>
              </div>
              <p class="license-description" [appHighlight]="licensePortalText()">{{ licensePortalText() }}</p>
              <a [href]="ccLicenseUrl()" target="_blank" rel="noopener noreferrer" class="license-action">
                <i class="pi pi-external-link" aria-hidden="true"></i>
                {{ licensePortalLink() }}
                <span class="sr-only">({{ translate('impressum.opensNewWindow') }})</span>
              </a>
            </div>
          </div>

          <!-- Book Content Rights -->
          <div class="license-card license-book">
            <div class="license-icon-wrapper book-icon">
              <i class="pi pi-book" aria-hidden="true"></i>
            </div>
            <div class="license-card-content">
              <div class="license-title-row">
                <h3 [appHighlight]="licenseThirdPartyTitle()">{{ licenseThirdPartyTitle() }}</h3>
                <span class="license-tag tag-restricted">{{ licenseThirdPartyRights() }}</span>
              </div>
              <p class="license-description" [appHighlight]="licenseThirdPartyText()">{{ licenseThirdPartyText() }}</p>
            </div>
          </div>
        </div>

        <!-- AI Content Notice (Option B: generic tool disclosure) -->
        <div class="ai-notice">
          <div class="ai-notice-header">
            <i class="pi pi-info-circle" aria-hidden="true"></i>
            <h3 [appHighlight]="aiNoticeTitle()">{{ aiNoticeTitle() }}</h3>
          </div>
          <p [appHighlight]="aiNoticeText()">{{ aiNoticeText() }}</p>
        </div>

        <!-- Attribution Guide -->
        <div class="attribution-guide">
          <div class="attribution-header">
            <i class="pi pi-info-circle" aria-hidden="true"></i>
            <h3 [appHighlight]="licenseAttribution()">{{ licenseAttribution() }}</h3>
          </div>
          <p [appHighlight]="licenseAttributionText()">{{ licenseAttributionText() }}</p>
          <div class="attribution-example-row">
            <code class="attribution-example">{{ licenseAttributionExample() }}</code>
            <button
              type="button"
              class="attribution-copy-btn"
              (click)="copyAttribution()"
              [attr.aria-label]="licenseAttributionCopy()"
              [title]="licenseAttributionCopy()"
            >
              <i class="pi pi-copy" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </app-standard-container>

      <!-- Legal Information -->
      <app-standard-container
        id="legal-info"
        [config]="{
          titleKey: 'impressum.legalInfo',
          type: 'warning',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-info-circle',
          headingLevel: 2,
        }"
      >
        <div slot="header-content">
          <p [appHighlight]="legalDescription()">{{ legalDescription() }}</p>
        </div>

        <div class="legal-content">
          <div class="legal-section">
            <h3 [appHighlight]="liabilityContent()">{{ liabilityContent() }}</h3>
            <p [appHighlight]="liabilityContentText()">{{ liabilityContentText() }}</p>
          </div>

          <div class="legal-section">
            <h3 [appHighlight]="liabilityLinks()">{{ liabilityLinks() }}</h3>
            <p [appHighlight]="liabilityLinksText()">{{ liabilityLinksText() }}</p>
          </div>

          <div class="legal-section">
            <h3 [appHighlight]="copyright()">{{ copyright() }}</h3>
            <p [appHighlight]="copyrightText()">{{ copyrightText() }}</p>
          </div>

          <div class="legal-section">
            <h3 [appHighlight]="disclaimer()">{{ disclaimer() }}</h3>
            <p [appHighlight]="disclaimerText()">{{ disclaimerText() }}</p>
          </div>
        </div>
      </app-standard-container>

      <!-- Open Source Libraries -->
      <app-standard-container
        id="open-source"
        [config]="{
          titleKey: 'impressum.usedLibraries',
          type: 'info',
          collapsible: true,
          initiallyExpanded: true,
          elevation: 'md',
          icon: 'pi pi-code',
          headingLevel: 2,
        }"
      >
        <div slot="header-content">
          <p [appHighlight]="usedLibrariesText()">{{ usedLibrariesText() }}</p>
        </div>

        <div class="libraries-content">
          <!-- Angular -->
          <div class="library-item">
            <div class="library-header">
              <h3>Angular</h3>
              <span class="library-version">{{ angularVersion }}</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="angularDescription()">{{ angularDescription() }}</p>
              <p class="library-license" [appHighlight]="angularLicense()">{{ angularLicense() }}</p>
              <div class="license-info">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span [appHighlight]="mitLicenseNote()">{{ mitLicenseNote() }}</span>
              </div>
            </div>
          </div>

          <!-- Optimus UI -->
          <div class="library-item">
            <div class="library-header">
              <h3>Optimus UI</h3>
              <span class="library-version">v2.0.2</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="optimusDescription()">{{ optimusDescription() }}</p>
              <p class="library-license" [appHighlight]="optimusLicense()">{{ optimusLicense() }}</p>
              <div class="license-info">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span [appHighlight]="mitLicenseNote()">{{ mitLicenseNote() }}</span>
              </div>
            </div>
          </div>

          <!-- RxJS -->
          <div class="library-item">
            <div class="library-header">
              <h3>RxJS</h3>
              <span class="library-version">v7.8.0</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="rxjsDescription()">{{ rxjsDescription() }}</p>
              <p class="library-license" [appHighlight]="rxjsLicense()">{{ rxjsLicense() }}</p>
              <div class="license-info">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span [appHighlight]="apacheLicenseNote()">{{ apacheLicenseNote() }}</span>
              </div>
            </div>
          </div>

          <!-- Additional Libraries -->
          <div class="library-item">
            <div class="library-header">
              <h3>Zone.js</h3>
              <span class="library-version">v0.15.0</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="zoneDescription()">{{ zoneDescription() }}</p>
              <p class="library-license" [appHighlight]="zoneLicense()">{{ zoneLicense() }}</p>
            </div>
          </div>

          <div class="library-item">
            <div class="library-header">
              <h3>tslib</h3>
              <span class="library-version">v2.8.1</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="tslibDescription()">{{ tslibDescription() }}</p>
              <p class="library-license" [appHighlight]="tslibLicense()">{{ tslibLicense() }}</p>
            </div>
          </div>

          <div class="library-item">
            <div class="library-header">
              <h3>&#64;openng/icons</h3>
              <span class="library-version">v1.0.0</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="openngIconsDescription()">{{ openngIconsDescription() }}</p>
              <p class="library-license" [appHighlight]="openngIconsLicense()">{{ openngIconsLicense() }}</p>
            </div>
          </div>

          <!-- Optimus UI Themes -->
          <div class="library-item">
            <div class="library-header">
              <h3>&#64;openng/optimus-ui-themes</h3>
              <span class="library-version">v2.0.2</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="optimusThemesDescription()">
                {{ optimusThemesDescription() }}
              </p>
              <p class="library-license" [appHighlight]="optimusThemesLicense()">{{ optimusThemesLicense() }}</p>
              <div class="license-info">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span [appHighlight]="mitLicenseNote()">{{ mitLicenseNote() }}</span>
              </div>
            </div>
          </div>

          <!-- Chart.js -->
          <div class="library-item">
            <div class="library-header">
              <h3>Chart.js</h3>
              <span class="library-version">v4.5.0</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="chartjsDescription()">{{ chartjsDescription() }}</p>
              <p class="library-license" [appHighlight]="chartjsLicense()">{{ chartjsLicense() }}</p>
              <div class="license-info">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span [appHighlight]="mitLicenseNote()">{{ mitLicenseNote() }}</span>
              </div>
            </div>
          </div>

          <!-- Cytoscape.js (incl. fcose layout extension) -->
          <div class="library-item">
            <div class="library-header">
              <h3>Cytoscape.js</h3>
              <span class="library-version">v3.33.3</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="cytoscapeDescription()">{{ cytoscapeDescription() }}</p>
              <p class="library-license" [appHighlight]="cytoscapeLicense()">{{ cytoscapeLicense() }}</p>
              <div class="license-info">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span [appHighlight]="mitLicenseNote()">{{ mitLicenseNote() }}</span>
              </div>
            </div>
          </div>

          <!-- OpenDyslexic (self-hosted font) -->
          <div class="library-item">
            <div class="library-header">
              <h3>OpenDyslexic</h3>
              <span class="library-version">v5.2.5</span>
            </div>
            <div class="library-details">
              <p class="library-purpose" [appHighlight]="opendyslexicDescription()">{{ opendyslexicDescription() }}</p>
              <p class="library-license" [appHighlight]="opendyslexicLicense()">{{ opendyslexicLicense() }}</p>
              <div class="license-info">
                <i class="pi pi-info-circle" aria-hidden="true"></i>
                <span [appHighlight]="oflLicenseNote()">{{ oflLicenseNote() }}</span>
              </div>
            </div>
          </div>
        </div>
      </app-standard-container>
    </app-article>

    <!-- FAB Stack - Right Bottom Corner -->
    <app-fab-stack>
      <!-- Table of Contents FAB -->
      <app-table-of-contents-fab
        [items]="tocItems()"
        [title]="translate('impressum.tableOfContents')"
        [showAfterScroll]="0"
      >
      </app-table-of-contents-fab>

      <!-- Easy Language FAB -->
      <app-simple-easy-language-fab contentId="impressum" contentType="article"> </app-simple-easy-language-fab>
    </app-fab-stack>

    <!-- Global Glossary Popover -->
    <app-glossary-popover></app-glossary-popover>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Contact Details */
      .contact-details {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .contact-item {
        padding: var(--space-5);
        background: var(--surface-card);
        border-radius: var(--border-radius-lg, 12px);
        border: 1px solid var(--surface-border);
        transition: all 0.2s ease;
      }

      .contact-item:hover {
        box-shadow: var(--shadow-md);
      }

      .contact-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .contact-info strong {
        color: var(--text-color);
        font-weight: 600;
        font-size: 1.1rem;
      }

      .contact-info span {
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .contact-email {
        color: var(--primary-color-fg);
        text-decoration: none;
        transition: color 0.2s;
      }

      .contact-email:hover {
        color: var(--primary-color-dark, var(--primary-600));
        text-decoration: underline;
      }

      /* Website Information */
      .website-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .info-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-5);
        background: var(--surface-card);
        border-radius: var(--border-radius-lg, 12px);
        border: 1px solid var(--surface-border);
        transition: all 0.2s ease;
      }

      .info-section:hover {
        box-shadow: var(--shadow-md);
      }

      .info-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .info-header h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .info-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary-100);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-600);
        flex-shrink: 0;
      }

      .info-icon i {
        font-size: 1.25rem;
      }

      .info-description {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* Privacy Features */
      .privacy-features {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        padding: var(--space-5);
        background: var(--surface-card);
        border-radius: var(--border-radius-lg, 12px);
        border: 1px solid var(--surface-border);
        transition: all 0.2s ease;
      }

      .feature-item:hover {
        box-shadow: var(--shadow-md);
      }

      .feature-icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: var(--green-100);
        color: var(--green-600);
      }

      .feature-icon-wrapper i {
        font-size: 1.25rem;
      }

      .feature-item span {
        color: var(--text-color);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* DSGVO Art. 13 Sections */
      .dsgvo-sections {
        margin-top: var(--space-6);
        padding-top: var(--space-5);
        border-top: 1px solid var(--surface-border);
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }

      .dsgvo-intro h3 {
        margin: 0 0 var(--space-3) 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--text-color);
      }

      .dsgvo-intro p {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .dsgvo-section {
        padding: var(--space-4);
        background: var(--surface-card);
        border-radius: var(--border-radius-lg, 12px);
        border: 1px solid var(--surface-border);
      }

      .dsgvo-section h4 {
        margin: 0 0 var(--space-3) 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .dsgvo-section p {
        margin: 0 0 var(--space-3) 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .dsgvo-section p:last-child {
        margin-bottom: 0;
      }

      .dsgvo-rights-list,
      .dsgvo-storage-list {
        margin: 0 0 var(--space-3) 0;
        padding-left: var(--space-5);
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.7;
      }

      .dsgvo-rights-list li,
      .dsgvo-storage-list li {
        margin-bottom: var(--space-2);
      }

      .dsgvo-storage-list code {
        background: var(--surface-hover);
        padding: 0.1rem 0.4rem;
        border-radius: var(--border-radius-sm);
        font-size: 0.85em;
        font-family: var(--font-mono);
        color: var(--text-color);
      }

      .dsgvo-contact-line {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-2);
      }

      .dsgvo-contact-line a {
        color: var(--primary-color-fg);
        text-decoration: none;
        font-weight: 500;
      }

      .dsgvo-contact-line a:hover {
        text-decoration: underline;
      }

      .dsgvo-authority {
        margin: var(--space-3) 0 0 0;
        padding: var(--space-3) var(--space-4);
        background: var(--surface-hover);
        border-left: 3px solid var(--primary-color);
        border-radius: var(--border-radius-sm);
        font-style: normal;
        font-size: 0.9rem;
        line-height: 1.7;
        color: var(--text-color);
      }

      .dsgvo-authority a {
        display: inline-flex;
        align-items: center;
        gap: var(--space-1);
        color: var(--primary-color-fg);
        text-decoration: none;
        font-weight: 500;
      }

      .dsgvo-authority a:hover {
        text-decoration: underline;
      }

      /* Legal Content */
      .legal-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
      }

      .legal-section {
        padding-bottom: var(--space-4);
        border-bottom: 1px solid var(--surface-border);
      }

      .legal-section:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .legal-section h3 {
        margin: 0 0 var(--space-3) 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .legal-section p {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      /* Libraries Content */
      .libraries-content {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .library-item {
        padding: var(--space-5);
        background: var(--surface-card);
        border-radius: var(--border-radius-lg, 12px);
        border: 1px solid var(--surface-border);
        transition: all 0.2s ease;
      }

      .library-item:hover {
        box-shadow: var(--shadow-md);
      }

      .library-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-3);
      }

      .library-header h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .library-version {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        background: var(--surface-100);
        padding: 0.25rem 0.75rem;
        border-radius: var(--border-radius-sm);
        font-family: monospace;
      }

      .library-details {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .library-purpose {
        margin: 0;
        color: var(--text-color);
        font-size: 0.9rem;
      }

      .library-license {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.85rem;
        font-style: italic;
      }

      .license-info {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        margin-top: var(--space-2);
        padding: var(--space-3);
        background: var(--surface-50);
        border-radius: var(--border-radius-sm);
        border-left: 3px solid var(--primary-color);
      }

      .license-info i {
        color: var(--primary-color-fg);
        margin-top: 0.125rem;
        flex-shrink: 0;
      }

      .license-info span {
        color: var(--text-color-secondary);
        font-size: 0.85rem;
        line-height: 1.5;
      }

      /* License Grid - Side by Side Comparison */
      .license-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-4);
        margin-bottom: var(--space-5);
      }

      @media (max-width: 900px) {
        .license-grid {
          grid-template-columns: 1fr;
        }
      }

      .license-card {
        display: flex;
        gap: var(--space-4);
        padding: var(--space-5);
        background: var(--surface-card);
        border-radius: var(--border-radius-lg, 12px);
        border: 1px solid var(--surface-border);
        transition: all 0.2s ease;
      }

      .license-card:hover {
        box-shadow: var(--shadow-md);
      }

      .license-card.license-portal {
        background: linear-gradient(135deg, var(--surface-card) 0%, rgba(34, 197, 94, 0.05) 100%);
        border-color: var(--green-200);
      }

      .license-card.license-book {
        background: linear-gradient(135deg, var(--surface-card) 0%, rgba(249, 115, 22, 0.05) 100%);
        border-color: var(--orange-200);
      }

      .license-icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .license-icon-wrapper i {
        font-size: 1.5rem;
      }

      .license-icon-wrapper.portal-icon {
        background: var(--green-100);
        color: var(--green-600);
      }

      .license-icon-wrapper.book-icon {
        background: var(--orange-100);
        color: var(--orange-600);
      }

      .license-card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .license-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        flex-wrap: wrap;
      }

      .license-title-row h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .license-tag {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.025em;
        white-space: nowrap;
      }

      /* 800, not 500: white on the 500 shades measured 2.5:1 and 2.8:1 (A11Y-004).
         Not 700 either — the dark theme flips -600/-700 to light tints. */
      .license-tag.tag-open {
        background: var(--green-800);
        color: white;
      }

      .license-tag.tag-restricted {
        background: var(--orange-800);
        color: white;
      }

      .license-description {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .license-action {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--green-600);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        margin-top: auto;
        transition: all 0.2s;
      }

      .license-action:hover {
        color: var(--green-700);
        gap: var(--space-3);
      }

      /* AI Notice */
      .ai-notice {
        padding: var(--space-4);
        margin-bottom: var(--space-4);
        background: var(--surface-50);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--accent-on-surface, var(--primary-color));
      }

      .ai-notice-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
      }

      .ai-notice-header i {
        color: var(--accent-on-surface, var(--primary-color));
        font-size: 1rem;
      }

      .ai-notice-header h3 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .ai-notice p {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        line-height: 1.5;
      }

      /* Attribution Guide */
      .attribution-guide {
        padding: var(--space-4);
        background: var(--surface-50);
        border-radius: var(--border-radius);
        border: 1px solid var(--surface-border);
        border-left: 4px solid var(--primary-color);
      }

      .attribution-header {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
      }

      .attribution-header i {
        color: var(--primary-color-fg);
        font-size: 1rem;
      }

      .attribution-header h4 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .attribution-guide p {
        margin: 0 0 var(--space-3) 0;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .attribution-example-row {
        display: flex;
        align-items: stretch;
        gap: var(--space-2);
      }

      .attribution-example {
        display: block;
        flex: 1;
        padding: var(--space-3);
        background: var(--surface-card);
        border-radius: var(--border-radius-sm);
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
        font-size: 0.8rem;
        color: var(--primary-color-fg);
        border: 1px solid var(--surface-border);
        word-break: break-all;
      }

      .attribution-copy-btn {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        padding: 0 var(--space-3);
        background: var(--surface-card);
        color: var(--text-color-secondary);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        transition:
          background 0.2s ease,
          color 0.2s ease,
          border-color 0.2s ease;
      }

      .attribution-copy-btn:hover {
        background: var(--surface-hover);
        color: var(--primary-color-fg);
        border-color: var(--primary-color-fg);
      }

      .attribution-copy-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      .attribution-copy-btn i {
        font-size: 1rem;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .library-header {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-2);
        }
      }

      /* HUB-19: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .contact-item,
        .info-section,
        .feature-item,
        .library-item,
        .license-card,
        .contact-email,
        .license-action {
          transition: none;
        }
      }
    `,
  ],
})
export class ImpressumComponent {
  translationService = inject(TranslationService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Reactive current language signal
  currentLanguage = computed(() => this.translationService.currentLanguage);

  // The Angular version this build was compiled against, emitted by
  // scripts/generate-build-version.ts from the *installed* package. Reading it out of
  // package.json here instead would pull the whole dependency map into the client
  // bundle for the sake of one string.
  readonly angularVersion = 'v' + ANGULAR_VERSION;

  constructor() {
    // CRITICAL: Subscribe to language changes to trigger Angular change detection
    this.translationService.languageChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  // Who runs the site — name, address, e-mail, supervisory authority. One typed source
  // (src/config/site-operator.ts), not per-language i18n strings: the facts are the same
  // in every language, and scripts/check-imprint.mjs gates their placeholders at build.
  readonly operator = SITE_OPERATOR;

  private readonly siteOrigin: string = isPlatformBrowser(inject(PLATFORM_ID))
    ? inject(DOCUMENT).location.origin
    : (environment.siteUrl || '').trim().replace(/\/+$/, '') || '[URL]';

  // Reactive translation signals for all text content
  responsiblePerson = computed(() => {
    // Reactive dependency on the active language (see contact* computeds note).
    void this.translationService.currentLanguage;
    return this.translationService.translate('impressum.responsiblePerson');
  });
  purpose = computed(() => {
    void this.translationService.currentLanguage;
    return this.translationService.translate('impressum.purpose');
  });
  purposeText = computed(() => {
    void this.translationService.currentLanguage;
    return this.translationService.translate('impressum.purposeText');
  });
  contact = computed(() => this.translationService.translate('impressum.contact'));
  aboutSite = computed(() => this.translationService.translate('impressum.aboutSite'));
  aboutSiteText = computed(() => this.translationService.translate('impressum.aboutSiteText'));
  technicalImplementation = computed(() => this.translationService.translate('impressum.technicalImplementation'));
  technicalImplementationText = computed(() =>
    this.translationService.translate('impressum.technicalImplementationText'),
  );
  targetAudience = computed(() => this.translationService.translate('impressum.targetAudience'));
  targetAudienceText = computed(() => this.translationService.translate('impressum.targetAudienceText'));
  dataProtectionText1 = computed(() => this.translationService.translate('impressum.dataProtectionText1'));
  dataProtectionText2 = computed(() => this.translationService.translate('impressum.dataProtectionText2'));
  dataProtectionText3 = computed(() => this.translationService.translate('impressum.dataProtectionText3'));
  dataProtectionText4 = computed(() => this.translationService.translate('impressum.dataProtectionText4'));
  legalDescription = computed(() => this.translationService.translate('impressum.legalDescription'));
  liabilityContent = computed(() => this.translationService.translate('impressum.liabilityContent'));
  liabilityContentText = computed(() => this.translationService.translate('impressum.liabilityContentText'));
  liabilityLinks = computed(() => this.translationService.translate('impressum.liabilityLinks'));
  liabilityLinksText = computed(() => this.translationService.translate('impressum.liabilityLinksText'));
  copyright = computed(() => this.translationService.translate('impressum.copyright'));
  copyrightText = computed(() => this.translationService.translate('impressum.copyrightText'));
  disclaimer = computed(() => this.translationService.translate('impressum.disclaimer'));
  disclaimerText = computed(() => this.translationService.translate('impressum.disclaimerText'));
  usedLibrariesText = computed(() => this.translationService.translate('impressum.usedLibrariesText'));
  angularDescription = computed(() => this.translationService.translate('impressum.angularDescription'));
  angularLicense = computed(() => this.translationService.translate('impressum.angularLicense'));
  mitLicenseNote = computed(() => this.translationService.translate('impressum.mitLicenseNote'));
  optimusDescription = computed(() => this.translationService.translate('impressum.optimusDescription'));
  optimusLicense = computed(() => this.translationService.translate('impressum.optimusLicense'));
  rxjsDescription = computed(() => this.translationService.translate('impressum.rxjsDescription'));
  rxjsLicense = computed(() => this.translationService.translate('impressum.rxjsLicense'));
  apacheLicenseNote = computed(() => this.translationService.translate('impressum.apacheLicenseNote'));
  zoneDescription = computed(() => this.translationService.translate('impressum.zoneDescription'));
  zoneLicense = computed(() => this.translationService.translate('impressum.zoneLicense'));
  tslibDescription = computed(() => this.translationService.translate('impressum.tslibDescription'));
  tslibLicense = computed(() => this.translationService.translate('impressum.tslibLicense'));
  openngIconsDescription = computed(() => this.translationService.translate('impressum.openngIconsDescription'));
  openngIconsLicense = computed(() => this.translationService.translate('impressum.openngIconsLicense'));
  optimusThemesDescription = computed(() => this.translationService.translate('impressum.optimusThemesDescription'));
  optimusThemesLicense = computed(() => this.translationService.translate('impressum.optimusThemesLicense'));
  chartjsDescription = computed(() => this.translationService.translate('impressum.chartjsDescription'));
  chartjsLicense = computed(() => this.translationService.translate('impressum.chartjsLicense'));
  cytoscapeDescription = computed(() => this.translationService.translate('impressum.cytoscapeDescription'));
  cytoscapeLicense = computed(() => this.translationService.translate('impressum.cytoscapeLicense'));
  opendyslexicDescription = computed(() => this.translationService.translate('impressum.opendyslexicDescription'));
  opendyslexicLicense = computed(() => this.translationService.translate('impressum.opendyslexicLicense'));
  oflLicenseNote = computed(() => this.translationService.translate('impressum.oflLicenseNote'));

  // License section signals
  licensePortalTitle = computed(() => this.translationService.translate('impressum.licensePortalTitle'));
  licensePortalText = computed(() => this.translationService.translate('impressum.licensePortalText'));
  licensePortalLink = computed(() => this.translationService.translate('impressum.licensePortalLink'));
  licenseThirdPartyTitle = computed(() => this.translationService.translate('impressum.licenseThirdPartyTitle'));
  licenseThirdPartyText = computed(() => this.translationService.translate('impressum.licenseThirdPartyText'));
  licenseThirdPartyRights = computed(() => this.translationService.translate('impressum.licenseThirdPartyRights'));
  licenseAttribution = computed(() => this.translationService.translate('impressum.licenseAttribution'));
  licenseAttributionText = computed(() => this.translationService.translate('impressum.licenseAttributionText'));
  // The attribution sample names the operator and the site from their single sources
  // (site-operator.ts, environment.siteUrl or, in the browser, the page's own origin)
  // instead of a hard-coded brand and example.com. With neither known during a
  // prerender, a visible [URL] stays for the reader to fill in.
  licenseAttributionExample = computed(() =>
    this.translationService
      .translate('impressum.licenseAttributionExample')
      .replace('{operator}', this.operator.name)
      .replace('{siteUrl}', this.siteOrigin),
  );
  licenseAttributionCopy = computed(() => this.translationService.translate('impressum.licenseAttributionCopy'));
  licenseAttributionCopied = computed(() => this.translationService.translate('impressum.licenseAttributionCopied'));
  aiNoticeTitle = computed(() => this.translationService.translate('impressum.aiNoticeTitle'));
  aiNoticeText = computed(() => this.translationService.translate('impressum.aiNoticeText'));

  // Localized CC BY 4.0 license URL based on current language
  ccLicenseUrl = computed(() => {
    const lang = this.translationService.currentLanguage;
    // CC BY 4.0 deeds exist per base language; an Easy-Language variant
    // reads the deed of its base language.
    const deedLang = LANGUAGE_RULES.baseLanguageOf(lang);
    return `https://creativecommons.org/licenses/by/4.0/deed.${deedLang}`;
  });

  // Table of Contents items (reactive)
  tocItems = computed<TocItem[]>(() => [
    {
      id: 'contact-info',
      label: this.translationService.translate('impressum.contactInfo'),
      icon: 'pi pi-user',
    },
    {
      id: 'website-info',
      label: this.translationService.translate('impressum.websiteInfo'),
      icon: 'pi pi-globe',
    },
    {
      id: 'data-protection',
      label: this.translationService.translate('impressum.dataProtection'),
      icon: 'pi pi-shield',
    },
    {
      id: 'license-info',
      label: this.translationService.translate('impressum.license'),
      icon: 'pi pi-file-check',
    },
    {
      id: 'legal-info',
      label: this.translationService.translate('impressum.legalInfo'),
      icon: 'pi pi-info-circle',
    },
    {
      id: 'open-source',
      label: this.translationService.translate('impressum.usedLibraries'),
      icon: 'pi pi-code',
    },
  ]);

  translate(key: string): string {
    const result = this.translationService.translate(key);
    return result;
  }

  // browser-only: click handler.
  copyAttribution(): void {
    const text = this.licenseAttributionExample();
    navigator.clipboard
      .writeText(text)
      .then(() => this.toastService.showSuccess(this.licenseAttributionCopied()))
      .catch(() => {});
  }
}
