/**
 * User Settings Component
 * This component provides the user interface for all user-specific settings,
 * including theme configuration, language preferences, and other user options.
 */
import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  computed,
  ViewEncapsulation,
  OnDestroy,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormsModule } from '@angular/forms';

// Optimus UI imports
import { CardModule } from '@openng/optimus-ui/card';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { SelectModule } from '@openng/optimus-ui/select';

// Flag sprite CSS is imported globally in styles.scss

// Services
import { ThemeService, ThemeMode } from '../../services/theme.service';
import { FontService } from '../../services/font.service';
import { TranslationService } from '../../services/translation.service';
import { UserProgressService } from '../../services/user-progress.service';
import { ToastService } from '../../services/toast.service';
import { HighlightingService } from '../../services/highlighting.service';
import { UserDataService } from '../../services/user-data.service';
import { PrivacyConsentService } from '../../services/privacy-consent.service';
import { CookieSettingsService } from '../../services/cookie-settings.service';
import { LanguagePickerComponent } from '../../components/shared/language-picker.component';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { ThemePickerComponent } from '../../components/shared/theme-picker.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';
import { PlaygroundSettingsService } from '../../services/playground-settings.service';
import { LocalDataResetService } from '../../services/local-data-reset.service';
import { GlossaryPopoverComponent } from '../../components/shared/glossary-popover.component';
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    ToggleSwitchModule,
    SelectModule,
    LanguagePickerComponent,
    PageHeaderComponent,
    ThemePickerComponent,
    HighlightDirective,
    CursorGlowDirective,
    GlossaryPopoverComponent,
    SimpleEasyLanguageFabComponent,
    TableOfContentsFabComponent,
    FabStackComponent,
  ],
  template: `
    <div class="settings-container">
      <app-page-header titleKey="app.nav.userSettings">
        <p class="ph-sub" [appHighlight]="translate('settings.subtitle')">{{ translate('settings.subtitle') }}</p>
      </app-page-header>

      <div class="settings-content">
        <!-- Appearance Section -->
        <section id="appearance" class="settings-section">
          <div class="section-header">
            <div class="section-title">
              <i class="pi pi-palette" aria-hidden="true"></i>
              <h2 [appHighlight]="translate('settings.appearance.title')">
                {{ translate('settings.appearance.title') }}
              </h2>
            </div>
            <p class="section-description" [appHighlight]="translate('settings.appearance.description')">
              {{ translate('settings.appearance.description') }}
            </p>
          </div>

          <div class="section-body">
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.theme.mode')">{{
                  translate('settings.theme.mode')
                }}</span>
                <span class="setting-description" [appHighlight]="translate('settings.theme.modeDescription')">{{
                  translate('settings.theme.modeDescription')
                }}</span>
              </div>
              <div class="setting-control">
                <fieldset class="mode-selector" role="group" [attr.aria-labelledby]="'theme-mode-label-' + componentId">
                  <legend [id]="'theme-mode-label-' + componentId" class="sr-only">
                    {{ translate('settings.theme.mode') }}
                  </legend>
                  @for (option of modeOptions; track option) {
                    <button
                      [class]="'mode-button ' + (themeService.mode() === option.value ? 'active' : '')"
                      (click)="setThemeMode(option.value)"
                      [attr.aria-pressed]="themeService.mode() === option.value"
                      [attr.aria-label]="translate(option.labelKey)"
                      type="button"
                    >
                      <i [class]="'pi ' + option.icon" aria-hidden="true"></i>
                      <span [appHighlight]="translate('settings.theme.' + option.value)">{{
                        translate('settings.theme.' + option.value)
                      }}</span>
                    </button>
                  }
                </fieldset>
              </div>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.theme.color')">{{
                  translate('settings.theme.color')
                }}</span>
                <span class="setting-description" [appHighlight]="translate('settings.theme.colorDescription')">{{
                  translate('settings.theme.colorDescription')
                }}</span>
              </div>
              <div class="setting-control">
                <app-theme-picker [label]="translate('settings.theme.color')"></app-theme-picker>
              </div>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.appearance.glossaryHighlighting')">{{
                  translate('settings.appearance.glossaryHighlighting')
                }}</span>
                <span
                  class="setting-description"
                  [appHighlight]="translate('settings.appearance.glossaryHighlightingDescription')"
                  >{{ translate('settings.appearance.glossaryHighlightingDescription') }}</span
                >
              </div>
              <div class="setting-control">
                <p-toggleswitch
                  [(ngModel)]="glossaryHighlightingEnabled"
                  [inputId]="'glossary-highlighting-toggle'"
                  [ariaLabel]="translate('settings.appearance.glossaryHighlighting')"
                >
                </p-toggleswitch>
              </div>
            </div>

            <!-- Font Picker — native dropdown via p-select. Each option renders in
                 its own font so the user sees a live preview while browsing the menu.
                 - .setting-description: static section explanation (incl. multi-script note)
                 - .setting-aside-active: per-font character note, updates with selection -->
            <div class="setting-row">
              <div class="setting-info">
                <span
                  [id]="'font-label-' + componentId"
                  class="setting-label"
                  [appHighlight]="translate('settings.font.title')"
                  >{{ translate('settings.font.title') }}</span
                >
                <span class="setting-description" [appHighlight]="translate('settings.font.description')">{{
                  translate('settings.font.description')
                }}</span>
                <span
                  [id]="'font-note-' + componentId"
                  class="setting-aside-active"
                  aria-live="polite"
                  [appHighlight]="activeFontNote()"
                >
                  {{ activeFontNote() }}
                </span>
              </div>
              <div class="setting-control">
                <p-select
                  [options]="fontService.options"
                  [ngModel]="fontService.current()"
                  (ngModelChange)="fontService.setFont($event)"
                  optionValue="id"
                  optionLabel="name"
                  styleClass="font-select"
                  appendTo="body"
                  [ariaLabelledBy]="'font-label-' + componentId"
                  [inputId]="'font-select-' + componentId"
                  [style]="{ 'min-width': '14rem' }"
                >
                  <ng-template let-option #selectedItem>
                    <span [style.fontFamily]="option.stack">{{ option.name }}</span>
                  </ng-template>
                  <ng-template let-option #item>
                    <span [style.fontFamily]="option.stack">{{ option.name }}</span>
                  </ng-template>
                </p-select>
              </div>
            </div>
          </div>
        </section>

        <!-- Language Section -->
        <section id="language" class="settings-section">
          <div class="section-header">
            <div class="section-title">
              <i class="pi pi-globe" aria-hidden="true"></i>
              <h2 [appHighlight]="translate('settings.language.title')">{{ translate('settings.language.title') }}</h2>
            </div>
            <p class="section-description" [appHighlight]="translate('settings.language.description')">
              {{ translate('settings.language.description') }}
            </p>
          </div>

          <div class="section-body">
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.language.interface')">{{
                  translate('settings.language.interface')
                }}</span>
                <span
                  class="setting-description"
                  [appHighlight]="translate('settings.language.interfaceDescription')"
                  >{{ translate('settings.language.interfaceDescription') }}</span
                >
              </div>
              <div class="setting-control">
                <app-language-picker [label]="translate('settings.language.interface')"></app-language-picker>
              </div>
            </div>
          </div>
        </section>

        <!-- Data Management Section -->
        <section id="data" class="settings-section">
          <div class="section-header">
            <div class="section-title">
              <i class="pi pi-database" aria-hidden="true"></i>
              <h2 [appHighlight]="translate('settings.data.title')">{{ translate('settings.data.title') }}</h2>
            </div>
            <p class="section-description" [appHighlight]="translate('settings.data.description')">
              {{ translate('settings.data.description') }}
            </p>
          </div>

          <div class="section-body">
            <!-- Data Actions -->
            <div class="data-actions">
              <div class="action-group">
                <div class="action-item">
                  <div class="action-info">
                    <span class="action-label" [appHighlight]="translate('settings.data.exportLabel')">{{
                      translate('settings.data.exportLabel')
                    }}</span>
                    <span class="action-description" [appHighlight]="translate('settings.data.exportDescription')">{{
                      translate('settings.data.exportDescription')
                    }}</span>
                  </div>
                  <p-button
                    severity="secondary"
                    [label]="translate('settings.data.export')"
                    icon="pi pi-download"
                    (click)="exportData()"
                    size="small"
                    [outlined]="true"
                  ></p-button>
                </div>

                <div class="action-item">
                  <div class="action-info">
                    <span class="action-label" [appHighlight]="translate('settings.data.importLabel')">{{
                      translate('settings.data.importLabel')
                    }}</span>
                    <span class="action-description" [appHighlight]="translate('settings.data.importDescription')">{{
                      translate('settings.data.importDescription')
                    }}</span>
                  </div>
                  <div class="import-wrapper">
                    <label [for]="'file-import-' + componentId" class="sr-only">
                      {{ translate('settings.data.importLabel') }}
                    </label>
                    <input
                      #fileInput
                      [id]="'file-import-' + componentId"
                      type="file"
                      accept="application/json"
                      (change)="importData($event)"
                      [attr.aria-describedby]="'import-desc-' + componentId"
                      class="visually-hidden"
                    />
                    <p-button
                      severity="secondary"
                      [outlined]="true"
                      [label]="translate('settings.data.import')"
                      icon="pi pi-upload"
                      (click)="triggerFileInput()"
                      size="small"
                      [attr.aria-describedby]="'import-desc-' + componentId"
                      type="button"
                    ></p-button>
                    <div [id]="'import-desc-' + componentId" class="sr-only">
                      {{ translate('settings.data.importDescription') }}
                    </div>
                  </div>
                </div>

                <div class="action-item danger">
                  <div class="action-info">
                    <span class="action-label" [appHighlight]="translate('settings.data.resetLabel')">{{
                      translate('settings.data.resetLabel')
                    }}</span>
                    <span class="action-description" [appHighlight]="translate('settings.data.resetDescription')">{{
                      translate('settings.data.resetDescription')
                    }}</span>
                  </div>
                  <p-button
                    severity="danger"
                    [label]="translate('settings.data.reset')"
                    icon="pi pi-trash"
                    (click)="resetData()"
                    size="small"
                  ></p-button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Privacy & Progress Section -->
        <section id="privacy" class="settings-section">
          <div class="section-header">
            <div class="section-title">
              <i class="pi pi-shield" aria-hidden="true"></i>
              <h2 [appHighlight]="translate('settings.privacy.title')">{{ translate('settings.privacy.title') }}</h2>
            </div>
            <p class="section-description" [appHighlight]="translate('settings.privacy.description')">
              {{ translate('settings.privacy.description') }}
            </p>
          </div>

          <div class="section-body">
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.privacy.progressTracking')">{{
                  translate('settings.privacy.progressTracking')
                }}</span>
                <span class="setting-description" [appHighlight]="translate('settings.privacy.progressDescription')">{{
                  translate('settings.privacy.progressDescription')
                }}</span>
              </div>
              <div class="setting-control">
                <div class="toggle-wrapper">
                  <label class="sr-only" [for]="'progress-tracking-' + componentId">
                    {{ translate('settings.privacy.progressTracking') }}
                  </label>
                  <input
                    type="checkbox"
                    [id]="'progress-tracking-' + componentId"
                    [checked]="isProgressTrackingEnabled"
                    (change)="toggleProgressTracking()"
                    [attr.aria-describedby]="'progress-desc-' + componentId"
                    [attr.aria-labelledby]="'progress-label-' + componentId"
                    class="toggle-input"
                  />
                  <label [for]="'progress-tracking-' + componentId" class="cookie-switch">
                    <span class="cookie-slider" aria-hidden="true"></span>
                    <span class="sr-only">{{ translate('settings.privacy.progressTracking') }}</span>
                  </label>
                </div>
                <div [id]="'progress-desc-' + componentId" class="sr-only">
                  {{ translate('settings.privacy.progressDescription') }}
                </div>
                <div [id]="'progress-label-' + componentId" class="sr-only">
                  {{ translate('settings.privacy.progressTracking') }}
                </div>
              </div>
            </div>

            <!-- The cookie settings dialog, reachable here and from the footer on
                 every page: every consent (progress, and statistics where offered)
                 can be changed or withdrawn as easily as it was given. -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.privacy.cookieSettings')">{{
                  translate('settings.privacy.cookieSettings')
                }}</span>
                <span
                  class="setting-description"
                  [appHighlight]="translate('settings.privacy.cookieSettingsDescription')"
                  >{{ translate('settings.privacy.cookieSettingsDescription') }}</span
                >
              </div>
              <div class="setting-control">
                <button type="button" class="info-button" aria-haspopup="dialog" (click)="openCookieSettings()">
                  <i class="pi pi-cog" aria-hidden="true"></i>
                  <span>{{ translate('settings.privacy.openCookieSettings') }}</span>
                </button>
              </div>
            </div>

            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.privacy.dataInfo')">{{
                  translate('settings.privacy.dataInfo')
                }}</span>
                <span class="setting-description" [appHighlight]="translate('settings.privacy.dataInfoDescription')">{{
                  translate('settings.privacy.dataInfoDescription')
                }}</span>
              </div>
              <div class="setting-control">
                <button
                  class="info-button"
                  (click)="toggleDataInfoExpanded()"
                  [attr.aria-expanded]="showDataInfo"
                  [attr.aria-controls]="'data-info-' + componentId"
                  [id]="'data-info-button-' + componentId"
                  type="button"
                >
                  <i [class]="showDataInfo ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" aria-hidden="true"></i>
                  <span
                    [appHighlight]="
                      translate(showDataInfo ? 'settings.privacy.hideDetails' : 'settings.privacy.showDetails')
                    "
                    >{{
                      translate(showDataInfo ? 'settings.privacy.hideDetails' : 'settings.privacy.showDetails')
                    }}</span
                  >
                </button>
              </div>
            </div>

            <!-- Simple expandable info section -->
            @if (showDataInfo) {
              <div
                [id]="'data-info-' + componentId"
                class="data-info-section"
                role="region"
                [attr.aria-labelledby]="'data-info-button-' + componentId"
              >
                <div class="data-info-content">
                  <h3 [appHighlight]="translate('settings.privacy.dataStorageTitle')">
                    {{ translate('settings.privacy.dataStorageTitle') }}
                  </h3>
                  <div class="info-item">
                    <strong [appHighlight]="translate('settings.privacy.storageLocation')">{{
                      translate('settings.privacy.storageLocation')
                    }}</strong>
                    <p [appHighlight]="translate('settings.privacy.storageLocationDetail')">
                      {{ translate('settings.privacy.storageLocationDetail') }}
                    </p>
                  </div>
                  <div class="info-item">
                    <strong [appHighlight]="translate('settings.privacy.dataTypes')">{{
                      translate('settings.privacy.dataTypes')
                    }}</strong>
                    <ul>
                      <li [appHighlight]="translate('settings.privacy.dataType.quizProgress')">
                        {{ translate('settings.privacy.dataType.quizProgress') }}
                      </li>
                      <li [appHighlight]="translate('settings.privacy.dataType.preferences')">
                        {{ translate('settings.privacy.dataType.preferences') }}
                      </li>
                    </ul>
                  </div>
                  <div class="info-item">
                    <strong [appHighlight]="translate('settings.privacy.dataTransmission')">{{
                      translate('settings.privacy.dataTransmission')
                    }}</strong>
                    <p [appHighlight]="translate('settings.privacy.dataTransmissionDetail')">
                      {{ translate('settings.privacy.dataTransmissionDetail') }}
                    </p>
                  </div>
                  <div class="info-item">
                    <strong [appHighlight]="translate('settings.privacy.dataControl')">{{
                      translate('settings.privacy.dataControl')
                    }}</strong>
                    <p [appHighlight]="translate('settings.privacy.dataControlDetail')">
                      {{ translate('settings.privacy.dataControlDetail') }}
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Playground Section -->
        <section id="playground" class="settings-section">
          <div class="section-header">
            <div class="section-title">
              <i class="pi pi-bolt" aria-hidden="true"></i>
              <h2 [appHighlight]="translate('settings.playground.title')">
                {{ translate('settings.playground.title') }}
              </h2>
            </div>
            <p class="section-description" [appHighlight]="translate('settings.playground.description')">
              {{ translate('settings.playground.description') }}
            </p>
          </div>

          <div class="section-body">
            <!-- Cursor Trail -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label" [appHighlight]="translate('settings.playground.cursorTrail')">{{
                  translate('settings.playground.cursorTrail')
                }}</span>
                <span
                  class="setting-description"
                  [appHighlight]="translate('settings.playground.cursorTrailDescription')"
                  >{{ translate('settings.playground.cursorTrailDescription') }}</span
                >
              </div>
              <div class="setting-control">
                <p-toggleswitch
                  [(ngModel)]="cursorTrailEnabled"
                  [inputId]="'cursor-trail-toggle'"
                  [ariaLabel]="translate('settings.playground.cursorTrail')"
                >
                </p-toggleswitch>
              </div>
            </div>

            @if (cursorTrailEnabled) {
              <div class="trail-preview" appCursorGlow>
                <i class="pi pi-sparkles" aria-hidden="true"></i>
                <span [appHighlight]="translate('settings.playground.cursorTrailPreview')">{{
                  translate('settings.playground.cursorTrailPreview')
                }}</span>
              </div>
            }
          </div>
        </section>
      </div>

      <!-- ARIA Live Region for status announcements -->
      <div #liveRegion aria-live="polite" aria-atomic="true" class="sr-only"></div>

      <!-- ARIA Live Region for error announcements (assertive) -->
      <div #errorLiveRegion aria-live="assertive" aria-atomic="true" class="sr-only"></div>

      <!-- Global Highlighting Popover -->
      <app-glossary-popover></app-glossary-popover>

      <!-- FAB Stack -->
      <app-fab-stack>
        <app-table-of-contents-fab [items]="tocItems()" [title]="translate('settings.tableOfContents')">
        </app-table-of-contents-fab>

        <app-simple-easy-language-fab contentId="user-settings" contentType="page"> </app-simple-easy-language-fab>
      </app-fab-stack>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Container */
      app-user-settings .settings-container {
        max-width: 800px;
        margin: 0 auto;
        background: var(--surface-ground);
        min-height: 100vh;
      }

      /* Settings Content */
      app-user-settings .settings-content {
        padding: 0;
      }

      /* Settings Section */
      app-user-settings .settings-section {
        background: var(--surface-card);
        border-bottom: 1px solid var(--surface-border);
      }

      app-user-settings .section-header {
        padding: 1.5rem 1.5rem 1rem;
        border-bottom: 1px solid var(--surface-100);
      }

      app-user-settings .section-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }

      app-user-settings .section-title i {
        color: var(--primary-color-fg);
        font-size: 1.25rem;
        opacity: 1;
      }

      app-user-settings .section-title h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-color);
      }

      app-user-settings .section-description {
        margin: 0;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        line-height: 1.4;
      }

      app-user-settings .section-body {
        padding: 1.5rem;
      }

      /* Setting Row */
      app-user-settings .setting-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
      }

      app-user-settings .setting-row:last-child {
        margin-bottom: 0;
      }

      app-user-settings .setting-info {
        flex: 1;
        min-width: 0;
      }

      app-user-settings .setting-label {
        display: block;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
      }

      app-user-settings .setting-description {
        color: var(--text-color-secondary);
        font-size: 0.8rem;
        line-height: 1.3;
      }

      app-user-settings .setting-control {
        flex-shrink: 0;
        min-width: 200px;
        display: flex;
        justify-content: flex-end;
      }

      /* Font Picker — p-select with per-option font preview. */
      app-user-settings .font-select {
        font-size: 0.92rem;
      }
      /* Per-font reactive note (italic accent below the static section description). */
      app-user-settings .setting-aside-active {
        display: block;
        margin-top: 0.4rem;
        padding-top: 0.4rem;
        border-top: 1px dashed var(--surface-border);
        color: var(--text-color-secondary);
        font-size: 0.78rem;
        font-style: italic;
        line-height: 1.4;
        min-height: 2.6em;
      }

      /* Mode Selector */
      app-user-settings .mode-selector {
        display: flex;
        gap: 0.25rem;
        background: var(--surface-100);
        padding: 0.25rem;
        border-radius: 8px;
      }

      app-user-settings .mode-button {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.8rem;
        font-weight: 500;
      }

      app-user-settings .mode-button:hover {
        color: var(--text-color);
        background: var(--surface-hover);
      }

      app-user-settings .mode-button.active {
        background: var(--primary-color);
        color: var(--primary-color-text);
        box-shadow: var(--shadow-2);
      }

      app-user-settings .mode-button i {
        font-size: 0.875rem;
        color: inherit; /* Use same color as parent text */
      }

      /* Statistics Overview */
      app-user-settings .stats-overview {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }

      app-user-settings .stat-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--surface-100);
        border-radius: 8px;
        border: 1px solid var(--surface-border);
      }

      app-user-settings .stat-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--primary-color) 15%, var(--surface-100));
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-color-fg);
        flex-shrink: 0;
      }

      app-user-settings .stat-icon i {
        font-size: 1rem;
      }

      app-user-settings .stat-content {
        min-width: 0;
      }

      app-user-settings .stat-value {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-color);
        line-height: 1.2;
      }

      app-user-settings .stat-label {
        display: block;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        font-weight: 500;
      }

      /* Data Actions */
      app-user-settings .action-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      app-user-settings .action-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
        padding: 1rem;
        background: var(--surface-100);
        border-radius: 8px;
        border: 1px solid var(--surface-border);
      }

      app-user-settings .action-item.danger {
        border-color: color-mix(in srgb, var(--red-500) 30%, var(--surface-border));
        background: color-mix(in srgb, var(--red-500) 10%, var(--surface-100));
      }

      /* The tinted background eats the secondary grey's contrast (A11Y-004). */
      app-user-settings .action-item.danger .action-description {
        color: var(--text-color);
      }

      app-user-settings .action-info {
        flex: 1;
        min-width: 0;
      }

      app-user-settings .action-label {
        display: block;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 0.25rem;
        font-size: 0.875rem;
      }

      app-user-settings .action-description {
        color: var(--text-color-secondary);
        font-size: 0.8rem;
        line-height: 1.3;
      }

      /* Privacy Info Button */
      app-user-settings .info-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid var(--surface-border);
        border-radius: 6px;
        background: var(--surface-card);
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.875rem;
      }

      app-user-settings .info-button:hover {
        background: var(--surface-hover);
        box-shadow: var(--shadow-2);
      }

      app-user-settings .data-info-section {
        margin-top: 1rem;
        padding: 0 1.5rem;
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          max-height: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          max-height: 500px;
          transform: translateY(0);
        }
      }

      app-user-settings .data-info-content {
        background: var(--surface-50);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 1.5rem;
      }

      app-user-settings .data-info-content h3 {
        color: var(--text-color);
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      app-user-settings .info-item {
        margin-bottom: 1.5rem;
      }

      app-user-settings .info-item:last-child {
        margin-bottom: 0;
      }

      app-user-settings .info-item strong {
        display: block;
        color: var(--text-color);
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      app-user-settings .info-item p {
        color: var(--text-color-secondary);
        margin: 0;
        line-height: 1.5;
      }

      app-user-settings .info-item ul {
        color: var(--text-color-secondary);
        margin: 0;
        padding-left: 1.5rem;
        line-height: 1.5;
      }

      app-user-settings .info-item li {
        margin-bottom: 0.25rem;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        app-user-settings .settings-container {
          margin: 0;
        }

        app-user-settings .section-header,
        app-user-settings .section-body {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        app-user-settings .setting-row {
          flex-direction: column;
          gap: 1rem;
        }

        app-user-settings .setting-control {
          min-width: 0;
          width: 100%;
        }

        app-user-settings .stats-overview {
          grid-template-columns: repeat(2, 1fr);
        }

        app-user-settings .action-item {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        app-user-settings .action-item p-button {
          width: 100%;
        }

        /* Data info responsive */
        app-user-settings .data-info-content {
          padding: 1rem;
        }
      }

      @media (max-width: 480px) {
        app-user-settings .stats-overview {
          grid-template-columns: 1fr;
        }

        app-user-settings .mode-button span {
          display: none;
        }

        app-user-settings .mode-button {
          padding: 0.5rem;
        }
      }

      /* Accessibility Styles */
      app-user-settings .sr-only,
      app-user-settings .visually-hidden {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      /* Focus styles for better visibility */
      app-user-settings .mode-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.2);
      }

      app-user-settings .info-button:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.2);
      }

      app-user-settings .toggle-input:focus-visible + .cookie-switch {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(var(--primary-color-rgb), 0.2);
      }

      app-user-settings .mode-selector fieldset {
        border: none;
        padding: 0;
        margin: 0;
      }

      app-user-settings .mode-selector legend {
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

      /* Toggle Switch Styles */
      app-user-settings .toggle-input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      app-user-settings .cookie-switch {
        position: relative;
        display: inline-block;
        width: 52px;
        height: 28px;
        cursor: pointer;
      }

      /* CTM-8: Expanded touch target for toggle */
      app-user-settings .cookie-switch::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 48px;
        min-height: 44px;
      }

      app-user-settings .cookie-slider {
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

      app-user-settings .cookie-slider:before {
        position: absolute;
        content: '';
        height: 22px;
        width: 22px;
        left: 2px;
        bottom: 2px;
        background-color: var(--surface-0);
        border-radius: 50%;
        transition: all 0.2s ease;
        box-shadow: var(--shadow-1);
      }

      app-user-settings .toggle-input:checked + .cookie-switch .cookie-slider {
        background-color: var(--primary-color-fg);
        border-color: var(--primary-color-fg);
      }

      app-user-settings .toggle-input:checked + .cookie-switch .cookie-slider:before {
        transform: translateX(24px);
        background-color: var(--primary-color-text);
      }

      app-user-settings .toggle-input:disabled + .cookie-switch {
        opacity: 0.7;
        cursor: not-allowed;
      }

      app-user-settings .toggle-input:disabled + .cookie-switch .cookie-slider {
        cursor: not-allowed;
      }

      /* Trail Preview */
      app-user-settings .trail-preview {
        --cursor-glow-color: var(--primary-color-fg);
        position: relative;
        margin-top: 1rem;
        margin-bottom: 1.5rem;
        padding: 2rem;
        border-radius: 12px;
        background: var(--surface-100);
        border: 1px dashed var(--surface-border);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        color: var(--text-color-secondary);
        font-size: 0.875rem;
        min-height: 100px;
        overflow: hidden;
      }

      app-user-settings .trail-preview i {
        font-size: 1.25rem;
        color: var(--primary-color-fg);
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        app-user-settings .mode-button,
        app-user-settings .info-button {
          border: 2px solid;
        }

        app-user-settings .mode-button:focus-visible,
        app-user-settings .info-button:focus-visible {
          outline: 3px solid;
          outline-offset: 3px;
        }

        app-user-settings .cookie-slider {
          border: 2px solid;
        }

        app-user-settings .toggle-input:checked + .cookie-switch .cookie-slider {
          border: 2px solid var(--primary-color);
        }
      }

      /* Reduced motion preferences */
      @media (prefers-reduced-motion: reduce) {
        app-user-settings .info-button,
        app-user-settings .mode-button,
        app-user-settings .data-info-section {
          transition: none;
          animation: none;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      }
    `,
  ],
})
export class UserSettingsComponent implements OnDestroy {
  @ViewChild('liveRegion') liveRegion?: ElementRef<HTMLDivElement>;
  @ViewChild('errorLiveRegion') errorLiveRegion?: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  // Timeout IDs for cleanup
  private timeoutIds: ReturnType<typeof setTimeout>[] = [];

  // Component ID for unique accessibility labeling
  componentId = 'user-settings-' + Math.random().toString(36).substr(2, 9);

  // Privacy settings. Mirrors cookiePreferences.progress (the one source of
  // truth); off until the visitor has agreed to progress storage.
  isProgressTrackingEnabled: boolean = false;
  showDataInfo: boolean = false;

  // Glossary highlighting setting
  get glossaryHighlightingEnabled(): boolean {
    return this.highlightingService.highlightingEnabled$();
  }

  set glossaryHighlightingEnabled(value: boolean) {
    this.highlightingService.setHighlightingEnabled(value);
  }

  // Cursor trail (afterburn) setting - backed by PlaygroundSettingsService
  get cursorTrailEnabled(): boolean {
    return this.playgroundSettings.cursorGlowAfterburn();
  }

  set cursorTrailEnabled(value: boolean) {
    this.playgroundSettings.setCursorGlowAfterburn(value);
  }

  // Theme options for mode selector. `labelKey` is a whole sentence per mode:
  // appending an English ' mode' to the translated name produced "Hell mode".
  modeOptions = [
    { icon: 'pi pi-sun', value: 'light' as ThemeMode, labelKey: 'settings.theme.modeLightLabel' },
    { icon: 'pi pi-moon', value: 'dark' as ThemeMode, labelKey: 'settings.theme.modeDarkLabel' },
    { icon: 'pi pi-desktop', value: 'system' as ThemeMode, labelKey: 'settings.theme.modeSystemLabel' },
  ];

  // Inject services
  private platformId = inject(PLATFORM_ID);
  themeService = inject(ThemeService);
  fontService = inject(FontService);
  translationService = inject(TranslationService);
  private userProgressService = inject(UserProgressService);
  toastService = inject(ToastService);
  highlightingService = inject(HighlightingService);
  private playgroundSettings = inject(PlaygroundSettingsService);
  private userDataService = inject(UserDataService);
  private privacyConsent = inject(PrivacyConsentService);
  private cookieSettings = inject(CookieSettingsService);
  private localDataReset = inject(LocalDataResetService);
  private cdr = inject(ChangeDetectorRef);

  // Computed signals for template (Fix 14: avoid method calls in template)
  readonly activeFontNote = computed(() => {
    // Read translation language signal so the note re-renders on language switch.
    this.translationService.currentLanguage$();
    const id = this.fontService.current();
    const opt = this.fontService.options.find((o) => o.id === id);
    return opt ? this.translate(opt.noteKey) : '';
  });

  // Table of Contents items
  tocItems = computed<TocItem[]>(() => {
    // Read the signal explicitly to establish reactive dependency
    this.translationService.currentLanguage$();
    return [
      {
        id: 'appearance',
        label: this.translate('settings.appearance.title'),
        icon: 'pi pi-palette',
      },
      {
        id: 'language',
        label: this.translate('settings.language.title'),
        icon: 'pi pi-globe',
      },
      {
        id: 'data',
        label: this.translate('settings.data.title'),
        icon: 'pi pi-database',
      },
      {
        id: 'privacy',
        label: this.translate('settings.privacy.title'),
        icon: 'pi pi-shield',
      },
      {
        id: 'playground',
        label: this.translate('settings.playground.title'),
        icon: 'pi pi-bolt',
      },
    ];
  });

  constructor() {
    // Initialize privacy settings
    this.initializePrivacySettings();
    // A decision saved in the cookie settings dialog moves the progress switch here too.
    this.cookieSettings.saved.pipe(takeUntilDestroyed()).subscribe(() => {
      this.initializePrivacySettings();
      this.cdr.markForCheck();
    });
    // Preload picker-candidate fonts so each tile previews its actual typeface.
    this.fontService.preloadAll();
  }

  ngOnDestroy(): void {
    // Clear all pending timeouts
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.timeoutIds = [];
  }

  /**
   * Get translation for a key
   */
  translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Delete everything the kit stores in this browser — progress, favorites,
   * feedback messages, read state, consent and every preference. The key list
   * is utils/storage-keys.ts; the work is LocalDataResetService.
   * browser-only: click handler.
   */
  resetData(): void {
    try {
      const confirmMessage = this.translate('settings.data.resetConfirm');

      if (confirm(confirmMessage)) {
        this.localDataReset.resetAll();

        // Consent is gone with everything else; the banner asks again after the reload.
        this.isProgressTrackingEnabled = false;

        // Show success message
        this.toastService.showWarning(
          this.translate('settings.data.resetSuccess'),
          this.translate('settings.data.resetSuccessDetail'),
        );

        // Refresh the page to show cookie consent again
        this.timeoutIds.push(
          setTimeout(() => {
            window.location.reload();
          }, 1500),
        );
      }
    } catch {
      // Fallback error handling
      this.toastService.showError(
        this.translate('settings.data.resetFailed'),
        this.translate('settings.data.resetFailedDetail'),
      );
    }
  }

  /**
   * Initialize privacy settings from localStorage
   */
  private initializePrivacySettings(): void {
    this.isProgressTrackingEnabled = this.privacyConsent.hasProgressConsent();
  }

  /** Open the cookie settings dialog; it hands focus back to the button on close. */
  openCookieSettings(): void {
    this.cookieSettings.open();
  }

  /**
   * Toggle the data information section
   */
  toggleDataInfoExpanded(): void {
    this.showDataInfo = !this.showDataInfo;

    // Announce state change for screen readers
    const message = this.showDataInfo
      ? this.translate('settings.privacy.detailsExpanded')
      : this.translate('settings.privacy.detailsCollapsed');

    this.announceChange(message);
  }

  /**
   * Set theme mode with accessibility announcement
   */
  setThemeMode(mode: ThemeMode): void {
    this.themeService.setMode(mode);

    // Announce change for screen readers
    const message = this.translate('settings.theme.modeChanged').replace(
      '{mode}',
      this.translate('settings.theme.' + mode),
    );

    this.announceChange(message);
  }

  /**
   * Trigger file input programmatically (accessible alternative)
   */
  triggerFileInput(): void {
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  /**
   * The progress switch is a consent decision: it writes cookiePreferences.progress
   * (the same record the cookie banner writes, analytics choice kept), then lets
   * UserProgressService act on it — save the session's progress on "on", reset
   * and remove the stored record on "off".
   */
  toggleProgressTracking(): void {
    this.isProgressTrackingEnabled = !this.isProgressTrackingEnabled;

    this.privacyConsent.setProgressConsent(this.isProgressTrackingEnabled);
    this.userProgressService.applyConsent();

    if (this.isProgressTrackingEnabled) {
      this.toastService.showSuccess(
        this.translate('settings.privacy.trackingEnabled'),
        this.translate('settings.privacy.trackingEnabledDetail'),
      );
      this.announceChange(this.translate('settings.privacy.trackingEnabled'));
    } else {
      this.toastService.showWarning(
        this.translate('settings.privacy.trackingDisabled'),
        this.translate('settings.privacy.trackingDisabledDetail'),
      );
      this.announceChange(this.translate('settings.privacy.trackingDisabled'));
    }
  }

  /**
   * Manual export — captures the current in-memory state from all registered
   * UserDataProviders, regardless of privacy settings. Triggers a JSON download.
   */
  exportData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const envelope = this.userDataService.buildEnvelope();
    const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibecore-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.toastService.showSuccess(
      this.translate('settings.data.exportSuccess'),
      this.translate('settings.data.exportSuccessDetail'),
    );
    this.announceChange(this.translate('settings.data.exportSuccess'));
  }

  /**
   * Manual import — parses the file via UserDataService, applies slices through
   * registered providers (privacy applied last; consent is never taken from a
   * file). An import is not a consent decision: without progress consent the
   * progress slice is withheld — the page reloads after an import, so progress
   * that could not be saved would vanish unnoticed — and a toast says why.
   * browser-only: file-input change handler.
   */
  importData(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      this.reportImportError(this.translate('settings.data.invalidFile'));
      input.value = '';
      return;
    }

    if (file.size > 1_000_000) {
      this.reportImportError(this.translate('settings.data.fileTooLarge'));
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = (e.target?.result ?? '') as string;
      const { envelope, error } = this.userDataService.parseEnvelope(raw);

      if (!envelope) {
        const messageKey =
          error === 'legacy_v1_format'
            ? 'settings.data.legacyV1File'
            : error === 'invalid_json'
              ? 'settings.data.importErrorDetail'
              : 'settings.data.corruptedFile';
        this.reportImportError(this.translate(messageKey));
        return;
      }

      const withholdProgress = envelope.slices.gamification !== undefined && !this.privacyConsent.hasProgressConsent();
      const result = this.userDataService.applyEnvelope(
        withholdProgress ? { ...envelope, slices: { ...envelope.slices, gamification: undefined } } : envelope,
      );
      if (!result.success) {
        this.reportImportError(this.translate('settings.data.errorApplyingData'));
        return;
      }

      if (withholdProgress) {
        this.toastService.showWarning(
          this.translate('settings.data.importSuccess'),
          this.translate('settings.data.importProgressWithheld'),
        );
      } else {
        this.toastService.showSuccess(
          this.translate('settings.data.importSuccess'),
          this.translate('settings.data.importSuccessDetail'),
        );
      }
      this.announceChange(this.translate('settings.data.importSuccess'));

      // Reload so all consumers (services, components) pick up the new state.
      this.timeoutIds.push(setTimeout(() => window.location.reload(), 1500));
    };

    reader.onerror = () => {
      this.reportImportError(this.translate('settings.data.errorReadingFile'));
    };

    reader.readAsText(file);

    // Reset so the same file can be re-imported
    input.value = '';
  }

  private reportImportError(detail: string): void {
    const title = this.translate('settings.data.importError');
    this.toastService.showError(title, detail);
    this.announceError(title, detail);
  }

  /**
   * Announce changes to screen readers via live region
   */
  private announceChange(message: string): void {
    const liveRegion = this.liveRegion?.nativeElement;
    if (liveRegion) {
      liveRegion.textContent = message;
      this.timeoutIds.push(setTimeout(() => (liveRegion.textContent = ''), 1000));
    }
  }

  /**
   * Announce errors to screen readers via dedicated assertive live region
   */
  private announceError(error: string, details?: string): void {
    const fullMessage = details ? `${error}. ${details}` : error;

    // Use the dedicated assertive live region for errors
    const errorRegion = this.errorLiveRegion?.nativeElement;
    if (errorRegion) {
      errorRegion.textContent = fullMessage;
      this.timeoutIds.push(
        setTimeout(() => {
          errorRegion.textContent = '';
        }, 3000),
      );
    }
  }
}
