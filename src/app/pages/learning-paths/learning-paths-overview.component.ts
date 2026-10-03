/**
 * LearningPathsOverviewComponent
 * Displays all learning paths as flat sections with step tiles beneath each path heading.
 * Embedded child of LernbereichComponent (/learn) — the /learning-paths route now redirects to /learn.
 */
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  inject,
  signal,
  PLATFORM_ID,
  DOCUMENT,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dialog } from '@openng/optimus-ui/dialog';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { ButtonModule } from '@openng/optimus-ui/button';
import { LearningPathService } from '../../services/learning-path.service';
import { ArticlesService } from '../../services/articles.service';
import { TranslationService } from '../../services/translation.service';
import { CursorGlowDirective } from '../../directives/cursor-glow.directive';
import { IllustrationComponent } from '../../components/shared/illustration.component';
import { DevModeService } from '../../services/dev-mode.service';
import { TimeGateService } from '../../services/time-gate.service';
import { DemosService } from '../../services/demos.service';
import { extendedRoutes } from '../../app.routes';
import { FocusReturn } from '../../utils/focus-return';
import { dateLocaleFor } from '../../utils/date-locale';
import { scrollBehavior } from '../../utils/reduced-motion';
import { siteHost } from '../../utils/site-host';
import { SITE_CONFIG } from '../../../config/site';
import {
  LearningPathDefinition,
  LearningPathProgress,
  LearningPathStep,
  LearningPathSector,
} from '../../models/learning-path.model';

@Component({
  selector: 'app-learning-paths-overview',
  standalone: true,
  imports: [FormsModule, Dialog, InputTextModule, ButtonModule, CursorGlowDirective, IllustrationComponent],
  template: `
    <div class="learning-paths-page" [class.embedded]="embedded">
      @for (group of groupedPaths; track group.sector) {
        <section class="sector-section" [id]="'sector-' + group.sector">
          <div class="sector-header">
            <h2 class="sector-title">{{ t('learningPaths.sectors.' + group.sector) }}</h2>
            <p class="sector-description">{{ t('learningPaths.sectors.' + group.sector + 'Desc') }}</p>
          </div>

          @for (path of group.paths; track path) {
            <section
              class="path-section"
              [class.path-available]="hasAvailableSteps(path) && !isPathTimeLocked(path)"
              [class.path-unavailable]="!hasAvailableSteps(path) || isPathTimeLocked(path)"
              [class.path-time-locked]="isPathTimeLocked(path)"
              [id]="path.id"
              [style.--path-color]="path.color"
            >
              <!-- Path Header -->
              <div class="path-header">
                <div class="path-header-left">
                  <div class="path-icon">
                    <i [class]="path.icon"></i>
                  </div>
                  <div class="path-info">
                    <h2 class="path-title">{{ t(path.titleKey) }}</h2>
                    <p class="path-description">{{ t(path.descriptionKey) }}</p>
                  </div>
                </div>
                <div class="path-header-right">
                  <span class="difficulty-badge" [class]="path.difficulty">
                    {{ t('learningPaths.difficulty.' + path.difficulty) }}
                  </span>
                  @if (isPathTimeLocked(path)) {
                    <span class="release-date-badge">
                      <i class="pi pi-calendar"></i>
                      {{ t('learningPaths.availableFrom') }} {{ formatReleaseDate(path.publishDate!) }}
                    </span>
                  } @else if (getProgress(path.id)?.totalRequiredParts) {
                    <span class="progress-label">
                      {{ getProgress(path.id)?.completedParts || 0 }} {{ t('learningPaths.progressOf') }}
                      {{ getProgress(path.id)?.totalRequiredParts }}
                    </span>
                  }
                </div>
              </div>

              <!-- Learning Promise + Metadata -->
              <div class="path-meta">
                @if (path.learningPromiseKey) {
                  <div class="meta-item promise">
                    <i class="pi pi-star"></i>
                    <p>{{ t(path.learningPromiseKey) }}</p>
                  </div>
                }
                <div class="meta-chips">
                  @if (path.durationKey) {
                    <span class="meta-chip"> <i class="pi pi-clock"></i> {{ t(path.durationKey) }} </span>
                  }
                  @if (path.targetAudienceKey) {
                    <span class="meta-chip"> <i class="pi pi-users"></i> {{ t(path.targetAudienceKey) }} </span>
                  }
                  @if (path.prerequisitePathIds?.length) {
                    <span class="meta-chip prerequisite-label">
                      <i class="pi pi-check-square"></i> {{ t('learningPaths.prerequisiteLabel') }}:
                    </span>
                    @for (preId of path.prerequisitePathIds; track preId) {
                      @if (getPathById(preId); as prePath) {
                        <a
                          class="meta-chip prerequisite-link"
                          [href]="'#' + preId"
                          (click)="scrollToPath($event, preId)"
                          [title]="t(prePath.titleKey)"
                        >
                          <i class="pi pi-arrow-up-right"></i> {{ t(prePath.titleKey) }}
                        </a>
                      }
                    }
                  } @else if (path.prerequisitesKey) {
                    <span class="meta-chip"> <i class="pi pi-check-square"></i> {{ t(path.prerequisitesKey) }} </span>
                  }
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="path-progress-bar">
                <div class="path-progress-fill" [style.width.%]="getProgress(path.id)?.percentage || 0"></div>
              </div>
              <!-- Step Tiles Grid -->
              <div class="steps-grid">
                @for (step of visibleSteps(path); track step; let i = $index) {
                  <div
                    class="step-tile"
                    [class.completed]="isStepCompleted(path.id, step.id)"
                    [class.optional]="!step.required"
                    [class.locked]="isStepLocked(step)"
                    [class.step-available]="isStepAvailable(step)"
                    [class.step-unavailable]="!isStepAvailable(step)"
                    (click)="onStepClick(step)"
                    (keydown.enter)="onStepClick(step)"
                    (keydown.space)="onStepClick(step); $event.preventDefault()"
                    [tabindex]="isStepLocked(step) ? -1 : 0"
                    role="button"
                    appCursorGlow
                  >
                    <!-- Coming Soon Stamp (prod mode, draft content) -->
                    @if (isStepLocked(step)) {
                      <div class="coming-soon-stamp" aria-hidden="true">
                        <div class="stamp-inner">
                          <span class="stamp-text">{{ t('learningPaths.comingSoon') }}</span>
                        </div>
                      </div>
                    }
                    <!-- Completed Badge -->
                    @if (isStepCompleted(path.id, step.id) && !isStepLocked(step)) {
                      <div class="completed-badge" aria-hidden="true">
                        <i class="pi pi-check"></i>
                      </div>
                      <span class="sr-only">{{ t('learningPaths.completedBadge') }}</span>
                    }
                    <!-- Partial Progress Badge -->
                    @if (
                      getStepPartsLabel(path.id, step.id) && !isStepCompleted(path.id, step.id) && !isStepLocked(step)
                    ) {
                      <div class="partial-badge">
                        {{ getStepPartsLabel(path.id, step.id) }}
                      </div>
                    }
                    <!-- Step Number -->
                    <div class="step-number">{{ i + 1 }}</div>
                    <!-- Schaubild (picked variant per stepId) -->
                    <app-illustration [stepId]="step.id" size="cover" class="step-illustration" />
                    <!-- Type Badge (hidden when completed or partial progress shown).
                         Neutraler Glas-Badge — Typ über Icon-Form + aria-label, NICHT über
                         Farbe (Farbe = nur Pfad-Identität, sonst Kollision). -->
                    @if (!isStepCompleted(path.id, step.id) && !getStepPartsLabel(path.id, step.id)) {
                      <i
                        class="type-icon"
                        [class]="getStepTypeIcon(step.type) + ' ' + step.type"
                        role="img"
                        [attr.aria-label]="t('learningPaths.stepType.' + step.type)"
                      ></i>
                    }
                    <!-- Title -->
                    <h3 class="step-title">{{ t(step.titleKey) }}</h3>
                    <!-- Teaser Description -->
                    @if (step.descriptionKey && !isStepLocked(step)) {
                      <p class="step-description">
                        {{ t(step.descriptionKey) }}
                      </p>
                    }
                    @if (isStepLocked(step) && isPathTimeLocked(getStepParentPath(step))) {
                      <p class="step-description locked-hint">
                        {{ t('learningPaths.availableFrom') }}
                        {{ formatReleaseDate($safeNavigationMigration(getStepParentPath(step)?.publishDate)!) }}
                      </p>
                    } @else if (isStepLocked(step)) {
                      <p class="step-description locked-hint">
                        {{ t('learningPaths.comingSoon') }}
                      </p>
                    }
                    <!-- Optional label -->
                    @if (!step.required && !isStepLocked(step)) {
                      <span class="optional-label">
                        {{ t('learningPaths.optional') }}
                      </span>
                    }
                    <!-- Draft indicator (dev mode only) -->
                    @if (isStepDraft(step) && !devModeService.isEffectivelyProd()) {
                      <span class="draft-indicator">
                        <i class="pi pi-pencil" aria-hidden="true"></i>
                        <span class="sr-only">{{ t('learningPaths.draftSrOnly') }}</span>
                      </span>
                    }
                  </div>
                }
                <!-- Certificate Tile (last card in grid) -->
                @if (isCertificateEligible(path)) {
                  <div
                    class="step-tile certificate-tile unlocked"
                    (click)="openCertificateDialog(path)"
                    (keydown.enter)="openCertificateDialog(path)"
                    tabindex="0"
                    role="button"
                    [attr.aria-label]="t('learningPaths.downloadCertificate')"
                    appCursorGlow
                  >
                    <div class="completed-badge">
                      <i class="pi pi-check"></i>
                    </div>
                    <div class="certificate-icon">
                      <i class="pi pi-download"></i>
                    </div>
                    <h3 class="step-title">{{ t('learningPaths.downloadCertificate') }}</h3>
                  </div>
                } @else {
                  <div
                    class="step-tile certificate-tile locked"
                    (click)="openStatusDialog(path)"
                    (keydown.enter)="openStatusDialog(path)"
                    tabindex="0"
                    role="button"
                    appCursorGlow
                  >
                    <h3 class="step-title">{{ t('learningPaths.downloadCertificate') }}</h3>
                    <p class="step-description">{{ t('learningPaths.certificate.lockedHint') }}</p>
                    <div class="certificate-progress-badge">
                      <i class="pi pi-lock" aria-hidden="true"></i>
                      {{ getProgress(path.id)?.percentage || 0 }}%
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        </section>
      }

      <!-- Certificate Name Dialog -->
      <!-- #certDlg: [showHeader]="false" leaves Optimus UI's generated
           'ariaLabelledBy' id pointing at nothing (the <span> carrying it lives
           inside the header's *ngIf), so the dialog has no accessible name.
           Putting that same id on the visible heading below repairs it.
           NOTE: no backticks in this comment - it sits inside a template literal. -->
      <p-dialog
        #certDlg
        [visible]="certificateDialogVisible()"
        (visibleChange)="certificateDialogVisible.set($event)"
        (onHide)="onCertificateDialogHide()"
        [modal]="true"
        [closable]="true"
        [dismissableMask]="true"
        [closeOnEscape]="true"
        [draggable]="false"
        [header]="''"
        [showHeader]="false"
        [style]="{ width: '400px' }"
      >
        <div class="dialog-header cert-header">
          <div class="header-icon">
            <i class="pi pi-verified"></i>
          </div>
          <div class="header-text">
            <h2 class="dialog-title" [attr.id]="certDlg.computedAriaLabelledBy()">
              {{ t('learningPaths.certificate.dialogTitle') }}
            </h2>
          </div>
          <button
            class="close-btn"
            (click)="certificateDialogVisible.set(false)"
            type="button"
            [attr.aria-label]="t('ui.close')"
            [title]="t('ui.close')"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="certificate-dialog-content">
          <label for="cert-name">{{ t('learningPaths.certificate.nameLabel') }}</label>
          <input
            id="cert-name"
            type="text"
            pInputText
            [(ngModel)]="certificateName"
            [attr.maxlength]="MAX_CERT_NAME_LEN"
            [placeholder]="t('learningPaths.certificate.namePlaceholder')"
            class="certificate-name-input"
            [class.ng-invalid]="certificateNameTouched && !certificateName.trim()"
            (blur)="certificateNameTouched = true"
            (keydown.enter)="confirmCertificateDownload()"
          />
          <small class="char-counter" [class.near-limit]="certificateName.length >= MAX_CERT_NAME_LEN - 10">
            {{ certificateName.length }} / {{ MAX_CERT_NAME_LEN }}
          </small>
          @if (certificateNameTouched && !certificateName.trim()) {
            <small class="validation-hint">{{ t('learningPaths.certificate.nameRequired') }}</small>
          }
          <small class="privacy-hint">{{ t('learningPaths.certificate.privacyHint') }}</small>
          <div class="certificate-dialog-footer">
            <p-button
              [label]="t('learningPaths.certificate.cancel')"
              severity="secondary"
              [text]="true"
              (onClick)="certificateDialogVisible.set(false)"
            />
            <p-button
              [label]="t('learningPaths.certificate.download')"
              icon="pi pi-download"
              [disabled]="!certificateName.trim()"
              (onClick)="confirmCertificateDownload()"
            />
          </div>
        </div>
      </p-dialog>

      <!-- Certificate Status Dialog -->
      <!-- #statusDlg: same repair as the certificate dialog above — the
           generated 'ariaLabelledBy' id goes on the visible heading.
         NOTE: no backticks in this comment - it sits inside a template literal. -->
      <p-dialog
        #statusDlg
        [visible]="statusDialogVisible()"
        (visibleChange)="statusDialogVisible.set($event)"
        (onHide)="onStatusDialogHide()"
        [modal]="true"
        [closable]="true"
        [dismissableMask]="true"
        [closeOnEscape]="true"
        [draggable]="false"
        [header]="''"
        [showHeader]="false"
        [style]="{ width: '480px' }"
      >
        @if (pendingStatusPath) {
          <div class="dialog-header status-header">
            <div class="header-icon">
              <i class="pi pi-list-check"></i>
            </div>
            <div class="header-text">
              <h2 class="dialog-title" [attr.id]="statusDlg.computedAriaLabelledBy()">
                {{ t('learningPaths.certificate.statusTitle') }}
              </h2>
            </div>
            <button
              class="close-btn"
              (click)="statusDialogVisible.set(false)"
              type="button"
              [attr.aria-label]="t('ui.close')"
              [title]="t('ui.close')"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="status-dialog-content">
            <div class="status-step-list">
              @for (step of pendingStatusPath.steps; track step.id) {
                <div
                  class="status-step-item"
                  [class.clickable]="isStepAvailable(step)"
                  [class.optional-step]="!step.required"
                  role="button"
                  [attr.tabindex]="isStepAvailable(step) ? 0 : -1"
                  (click)="onStatusStepClick(step)"
                  (keydown.enter)="onStatusStepClick(step)"
                  (keydown.space)="$event.preventDefault(); onStatusStepClick(step)"
                >
                  @if (isStepCompleted(pendingStatusPath!.id, step.id)) {
                    <i class="pi pi-check-circle status-icon completed"></i>
                  } @else if (isStepAvailable(step)) {
                    <i class="pi pi-circle status-icon pending"></i>
                  } @else {
                    <i class="pi pi-lock status-icon unavailable"></i>
                  }
                  <div class="status-step-info">
                    <span class="status-step-title">{{ t(step.titleKey) }}</span>
                    <span class="status-step-label">
                      @if (isStepCompleted(pendingStatusPath!.id, step.id)) {
                        {{ t('learningPaths.certificate.stepCompleted') }}
                      } @else if (!step.required) {
                        {{ t('learningPaths.optional') }}
                      } @else if (isStepAvailable(step)) {
                        {{ t('learningPaths.certificate.stepPending') }}
                      } @else {
                        {{ t('learningPaths.certificate.stepUnavailable') }}
                      }
                    </span>
                  </div>
                </div>
              }
            </div>
            <div class="status-summary">
              {{ getStatusSummary(pendingStatusPath) }}
            </div>
            <div class="status-dialog-footer">
              <p-button
                [label]="t('ui.close')"
                severity="secondary"
                [text]="true"
                (onClick)="statusDialogVisible.set(false)"
              />
            </div>
          </div>
        }
      </p-dialog>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }

      .learning-paths-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem 2rem;
      }

      .learning-paths-page.embedded {
        padding: 0;
      }

      /* Path Section */
      .path-section {
        margin-bottom: 3rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: 16px;
        padding: 1.5rem;
        border-top: 4px solid var(--path-color, var(--primary-color));
        overflow: visible;
        transition:
          opacity 0.3s ease,
          filter 0.3s ease;
      }

      /* Paths with available content — subtle highlight */
      .path-section.path-available {
        box-shadow: 0 2px 12px color-mix(in srgb, var(--path-color, var(--primary-color)) 12%, transparent);
      }

      /* Path Header */
      .path-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .path-header-left {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        flex: 1;
      }

      .path-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--path-color, var(--primary-color)) 15%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .path-icon i {
        font-size: 1.4rem;
        color: var(--path-color, var(--primary-color));
      }

      .path-info {
        flex: 1;
      }

      .path-title {
        font-size: 1.4rem;
        color: var(--text-color);
        margin: 0 0 0.25rem;
      }

      .path-description {
        color: var(--text-color-secondary);
        font-size: 0.9rem;
        line-height: 1.5;
        margin: 0;
      }

      .path-header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .difficulty-badge {
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .difficulty-badge.beginner {
        background: color-mix(in srgb, var(--semantic-green-fg, #15803d) 15%, transparent);
        color: var(--p-green-700, #15803d);
      }

      .difficulty-badge.intermediate {
        background: color-mix(in srgb, var(--p-yellow-500, #eab308) 15%, transparent);
        color: var(--p-yellow-700, #a16207);
      }

      .difficulty-badge.advanced {
        background: color-mix(in srgb, var(--semantic-red-fg, #b91c1c) 15%, transparent);
        color: var(--p-red-700, #b91c1c);
      }

      :host-context(.dark-theme) .difficulty-badge.beginner {
        color: var(--p-green-400, #4ade80);
      }

      :host-context(.dark-theme) .difficulty-badge.intermediate {
        color: var(--p-yellow-400, #facc15);
      }

      :host-context(.dark-theme) .difficulty-badge.advanced {
        color: var(--p-red-400, #f87171);
      }

      .progress-label {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        font-weight: 500;
      }

      /* Sector Sections */
      .sector-section {
        margin-bottom: 3rem;
      }

      .sector-header {
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 2px solid var(--primary-color);
      }

      .sector-title {
        font-size: 1.6rem;
        color: var(--text-color);
        margin: 0 0 0.25rem;
      }

      .sector-description {
        color: var(--text-color-secondary);
        font-size: 0.95rem;
        margin: 0;
      }

      /* Path Metadata */
      .path-meta {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--surface-border);
        margin-bottom: 1rem;
      }

      .meta-item.promise {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
        margin-bottom: 0.75rem;
      }

      .meta-item.promise i {
        color: var(--primary-color-fg);
        margin-top: 0.2rem;
      }

      .meta-item.promise p {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
        margin: 0;
        font-style: italic;
      }

      .meta-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .meta-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.78rem;
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        background: var(--surface-100);
        color: var(--text-color-secondary);
      }

      .meta-chip i {
        font-size: 0.75rem;
      }

      .meta-chip.prerequisite-label {
        background: none;
        padding-left: 0;
        padding-right: 0.2rem;
        font-weight: 600;
        color: var(--text-color-secondary);
      }

      a.meta-chip.prerequisite-link {
        text-decoration: none;
        color: var(--primary-color-fg);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        cursor: pointer;
        transition:
          background 0.2s,
          color 0.2s;
      }

      a.meta-chip.prerequisite-link:hover {
        background: color-mix(in srgb, var(--primary-color) 20%, transparent);
        color: var(--primary-color-fg);
      }

      a.meta-chip.prerequisite-link:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Progress Bar */
      .path-progress-bar {
        width: 100%;
        height: 6px;
        background: var(--surface-200);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 1.5rem;
      }

      .path-progress-fill {
        height: 100%;
        background: var(--path-color, var(--primary-color));
        border-radius: 3px;
        transition: width 0.3s ease;
      }

      /* Steps Grid */
      .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 1rem;
        padding: 0.5rem;
        margin: -0.5rem;
        overflow: visible;
      }

      /* Step Tile */
      .step-tile {
        position: relative;
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 12px;
        padding: 1.25rem;
        cursor: pointer;
        transition: box-shadow 0.2s;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        --cursor-glow-color: var(--path-color, var(--primary-color));
      }

      .step-tile:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      .step-tile:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Unavailable step — visually muted, dashed border, no interaction */
      .step-tile.step-unavailable {
        border-style: dashed;
        opacity: 0.5;
        cursor: default;
        filter: saturate(0.3);
      }

      .step-tile.step-unavailable:hover {
        box-shadow: none;
      }

      .step-tile.step-unavailable .step-number {
        background: var(--surface-400, #9e9e9e);
      }

      /* Cursor glow disabled on unavailable steps via global styles.scss */

      .step-tile.completed {
        border-color: #22c55e;
      }

      .step-tile.optional:not(.locked) {
        opacity: 1;
      }

      /* Draft indicator (dev mode only) */
      .draft-indicator {
        position: absolute;
        bottom: 0.5rem;
        right: 0.5rem;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--semantic-orange-fg);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.55rem;
      }

      /* Locked State (draft content in prod mode) */
      .step-tile.locked {
        opacity: 1;
        cursor: default;
        pointer-events: none;
        color: var(--text-color-secondary);
      }

      .step-tile.locked .step-title {
        color: var(--text-color-secondary);
      }

      .step-tile.locked .step-description {
        color: var(--text-color-secondary);
      }

      .locked-hint {
        font-style: italic;
      }

      /* Release Date Badge */
      .release-date-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 0.3rem 0.75rem;
        border-radius: 20px;
        background: color-mix(in srgb, var(--semantic-blue-fg) 12%, transparent);
        color: var(--semantic-blue-fg);
      }

      .release-date-badge i {
        font-size: 0.75rem;
      }

      /* Time-Locked Path */
      .path-section.path-time-locked {
        opacity: 0.65;
        border-style: dashed;
        filter: saturate(0.4);
      }

      .path-section.path-time-locked:hover {
        opacity: 0.8;
      }

      /* Coming Soon Stamp — diagonal red stamp overlapping card edge */
      .coming-soon-stamp {
        position: absolute;
        top: 0.5rem;
        right: -0.6rem;
        transform: rotate(12deg);
        z-index: 10;
        pointer-events: none;
      }

      .coming-soon-stamp .stamp-inner {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.15rem 0.6rem;
        border: 2px solid #c41e3a;
        border-radius: 2px;
        background: transparent;
        box-shadow:
          inset 0 0 0 1px transparent,
          inset 0 0 0 2px #c41e3a;
        position: relative;
      }

      .coming-soon-stamp .stamp-inner::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
        pointer-events: none;
        mix-blend-mode: multiply;
      }

      .coming-soon-stamp .stamp-text {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.55rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #c41e3a;
        text-align: center;
        max-width: 4.5rem;
      }

      /* Completed Badge */
      .completed-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 28px;
        height: 28px;
        background: #22c55e;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
      }

      /* Partial Progress Badge */
      .partial-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        min-width: 28px;
        height: 28px;
        padding: 0 6px;
        background: #f59e0b;
        color: white;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
      }

      .step-tile:has(.partial-badge) {
        border-color: #f59e0b;
      }

      /* Schaubild thumbnail — Karten-Held pro Step, füllt Kachelbreite.
       2026-05-30: von size="sm" (120x80) auf "fluid" (~228x152) vergrößert, damit
       die Premium-Schaubilder lesbar sind + Konsistenz mit dem Stats-Karten-Muster. */
      .step-illustration {
        display: block;
        width: 100%;
        margin: 0 0 0.75rem 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--surface-border);
        flex-shrink: 0;
      }

      /* Type Badge — NEUTRALER Glas-Knubbel an der oberen rechten Kachel-Ecke
       (spiegelt die Step-Nummer). Bewusst KEINE Typ-Farbe: Farbe ist allein
       Pfad-Identität (sonst kollidiert lila Pfad+Artikel bzw. blau Pfad+Demo).
       Typ wird über Icon-Form (Datei/Play/Buch) + aria-label kommuniziert. Die
       Glas-Optik (vs. satter Nummer-Knubbel) trennt die beiden Rollen klar. */
      .type-icon {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 0.78rem;
        color: var(--text-color);
        background: color-mix(in srgb, var(--surface-card) 80%, transparent);
        border: 1px solid var(--surface-border);
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
      }

      /* Step Number — Pfad-farbiger Hero-Knubbel (oben links). Verlauf zu dunklerem
       Ton verbessert Weiß-Kontrast (auch auf orange Pfaden), Ring + Schatten heben
       ihn vom Thumbnail ab. Farbe = Pfad-Identität. */
      .step-number {
        position: absolute;
        top: -8px;
        left: -8px;
        width: 26px;
        height: 26px;
        background: linear-gradient(
          145deg,
          var(--path-color, var(--primary-color)),
          color-mix(in srgb, var(--path-color, var(--primary-color)) 68%, #000)
        );
        color: #fff;
        border: 2px solid var(--surface-card);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.78rem;
        font-weight: 800;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
      }

      .step-tile.completed .step-number {
        background: linear-gradient(145deg, #34d399, #16a34a);
      }

      /* Step Title */
      .step-title {
        font-size: 0.95rem;
        color: var(--text-color);
        margin: 0;
        line-height: 1.3;
      }

      /* Step Description / Teaser */
      .step-description {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        line-height: 1.4;
        margin: 0;
      }

      .optional-label {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        font-style: italic;
      }

      /* Certificate Tile */
      .certificate-tile {
        align-items: center;
        text-align: center;
        justify-content: center;
        border-style: dashed;
      }

      .certificate-tile.locked {
        opacity: 0.75;
        cursor: pointer;
        pointer-events: auto;
      }

      .certificate-tile.locked:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      }

      /* Disable cursor glow on locked certificate */
      /* Cursor glow disabled on locked certificate tiles via global styles.scss */

      .certificate-tile.unlocked {
        border-color: var(--path-color, var(--primary-color));
        background: color-mix(in srgb, var(--path-color, var(--primary-color)) 5%, var(--surface-ground));
      }

      .certificate-tile.unlocked:hover {
        border-style: solid;
      }

      .certificate-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
      }

      .certificate-tile.unlocked .certificate-icon {
        background: color-mix(in srgb, var(--path-color, var(--primary-color)) 15%, transparent);
        color: var(--path-color, var(--primary-color));
      }

      .certificate-progress-badge {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        background: var(--surface-200);
        color: var(--text-color-secondary);
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 700;
      }

      .certificate-progress-badge i {
        font-size: 0.75rem;
      }

      .certificate-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .certificate-dialog-content label {
        font-weight: 600;
        color: var(--text-color);
      }

      .certificate-name-input {
        width: 100%;
      }

      .privacy-hint {
        color: var(--text-color-secondary);
        font-size: 0.8rem;
      }

      .char-counter {
        display: block;
        text-align: right;
        font-size: 0.75rem;
        color: var(--text-color-secondary);
        font-variant-numeric: tabular-nums;
        margin-top: -0.25rem;
      }

      .char-counter.near-limit {
        color: var(--orange-600, #d97706);
        font-weight: 600;
      }

      .certificate-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .validation-hint {
        color: var(--red-500);
        font-size: 0.8rem;
      }

      .status-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .status-step-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .status-step-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
      }

      .status-step-item.clickable {
        cursor: pointer;
      }

      .status-step-item.clickable:hover {
        background: var(--surface-hover);
      }

      .status-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .status-icon.completed {
        color: var(--green-500);
      }

      .status-icon.pending {
        color: var(--yellow-500);
      }

      .status-icon.unavailable {
        color: var(--surface-400);
      }

      .status-step-info {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }

      .status-step-title {
        font-size: 0.9rem;
        color: var(--text-color);
        font-weight: 500;
      }

      .status-step-label {
        font-size: 0.78rem;
        color: var(--text-color-secondary);
      }

      .status-step-item.optional-step {
        opacity: 0.7;
        border-style: dashed;
      }

      .status-dialog-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
      }

      /* Mobile: Stack footer buttons full-width with centered labels */
      @media (max-width: 600px) {
        .certificate-dialog-footer,
        .status-dialog-footer {
          flex-direction: column-reverse;
          align-items: stretch;
          gap: 0.5rem;
        }

        .certificate-dialog-footer .p-button,
        .status-dialog-footer .p-button {
          width: 100%;
          justify-content: center;
        }
      }

      .status-summary {
        padding: 0.75rem;
        background: var(--surface-100);
        border-radius: 8px;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        line-height: 1.5;
      }

      /* Custom dialog headers */
      .dialog-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.25rem;
        border-bottom: 3px solid var(--primary-500);
        background: var(--primary-50);
        margin: 0 -1.25rem 1rem -1.25rem;
        border-radius: 12px 12px 0 0;
      }

      .dialog-header .header-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: var(--surface-ground);
        border-radius: 8px;
        color: var(--primary-500);
        font-size: 1.1rem;
        flex-shrink: 0;
      }

      .dialog-header .header-text {
        flex: 1;
      }

      .dialog-header .dialog-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary-700);
      }

      .dialog-header .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-color-secondary);
        transition: background 0.2s;
        flex-shrink: 0;
      }

      .dialog-header .close-btn:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      .cert-header {
        background: var(--green-50);
        border-bottom-color: var(--green-500);
      }

      .cert-header .header-icon {
        color: var(--green-500);
      }

      .cert-header .dialog-title {
        color: var(--green-700);
      }

      .status-header {
        background: var(--orange-50);
        border-bottom-color: var(--orange-500);
      }

      .status-header .header-icon {
        color: var(--orange-500);
      }

      .status-header .dialog-title {
        color: var(--orange-700);
      }

      .dark-theme .cert-header {
        background: var(--green-900);
      }

      .dark-theme .cert-header .dialog-title {
        color: var(--green-300);
      }

      .dark-theme .cert-header .header-icon {
        background: var(--surface-800);
        color: var(--green-400);
      }

      .dark-theme .status-header {
        background: var(--orange-900);
      }

      .dark-theme .status-header .dialog-title {
        color: var(--orange-300);
      }

      .dark-theme .status-header .header-icon {
        background: var(--surface-800);
        color: var(--orange-400);
      }

      @media (max-width: 768px) {
        .learning-paths-page {
          padding: 1rem 0.5rem;
        }

        .learning-paths-page.embedded {
          padding: 0;
        }

        .sector-title {
          font-size: 1.3rem;
        }

        .path-section {
          padding: 1rem;
        }

        .path-header {
          flex-direction: column;
        }

        .path-header-left {
          gap: 0.75rem;
        }

        .path-icon {
          width: 40px;
          height: 40px;
        }

        .path-title {
          font-size: 1.15rem;
        }

        .path-header-right {
          flex-direction: row;
          align-items: center;
        }

        .meta-chips {
          flex-wrap: wrap;
        }

        .steps-grid {
          grid-template-columns: 1fr;
        }

        .step-tile {
          padding: 1rem;
        }
      }
    `,
  ],
})
export class LearningPathsOverviewComponent implements OnInit, OnDestroy {
  private learningPathService = inject(LearningPathService);
  private articlesService = inject(ArticlesService);
  private translationService = inject(TranslationService);
  private router = inject(Router);
  readonly devModeService = inject(DevModeService);
  private timeGateService = inject(TimeGateService);
  private demosService = inject(DemosService);
  private readonly demosOn = inject(SITE_CONFIG).isFeatureOn('demos');
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions: Subscription[] = [];

  /** Demo step routes not yet released (future publishDate). Filled from DemosService. */
  private unreleasedDemoPaths = new Set<string>();

  @Input() embedded = false;

  private static readonly SECTOR_ORDER: LearningPathSector[] = ['foundation', 'workshop', 'academy', 'society', 'misc'];

  paths: LearningPathDefinition[] = [];
  groupedPaths: { sector: LearningPathSector; paths: LearningPathDefinition[] }[] = [];
  progressMap = new Map<string, LearningPathProgress>();
  /**
   * Dialog visibility is a signal, not a plain field, and that is load-bearing.
   * Optimus UI's Escape handler calls close(), which sets the dialog's own
   * _visible and emits visibleChange; the teardown itself is driven by the
   * [pMotion]="visible" binding inside the dialog's view, so it only runs once
   * Angular pushes the [visible] input back down. A plain field assignment did
   * not schedule that pass - Escape left the dialog on screen until the next
   * keypress. Measured: 0/6 closes on the first Escape with a field, 6/6 with
   * a signal. The feedback dialog binds a signal
   * for the same reason.
   */
  certificateDialogVisible = signal(false);
  certificateName = '';
  certificateNameTouched = false;
  /** Hard cap for the certificate name. The PDF additionally auto-shrinks the
   *  font so names up to this length always fit on one line. */
  readonly MAX_CERT_NAME_LEN = 120;
  /** Signal for the same reason as certificateDialogVisible above. */
  statusDialogVisible = signal(false);
  pendingStatusPath: LearningPathDefinition | null = null;
  private pendingCertificatePath: LearningPathDefinition | null = null;

  /** Set of route paths that are marked as draft (source: ArticlesService/index.json) */
  private draftArticlePaths = new Set<string>();

  /** Set of all valid (non-redirect) route paths */
  private validRoutePaths = new Set(extendedRoutes.filter((r) => !r.redirectTo && r.path).map((r) => '/' + r.path));

  t = (key: string) => this.translationService.translate(key);

  ngOnInit(): void {
    this.subscriptions.push(
      this.learningPathService.paths$.subscribe((paths) => {
        this.paths = paths;
        const sectors = LearningPathsOverviewComponent.SECTOR_ORDER;
        this.groupedPaths = sectors
          .map((sector) => ({
            sector,
            paths: paths.filter((p) => p.sector === sector),
          }))
          .filter((g) => g.paths.length > 0);
        this.cdr.markForCheck();
      }),
    );

    this.subscriptions.push(
      this.articlesService.getAll().subscribe((articles) => {
        for (const a of articles) {
          if (a.draft) this.draftArticlePaths.add('/' + a.path);
        }
        this.cdr.markForCheck();
      }),
    );

    this.subscriptions.push(
      this.demosService.getAllDemos().subscribe((demos) => {
        this.unreleasedDemoPaths = new Set(
          demos.filter((d) => !this.timeGateService.isPublished(d.publishDate)).map((d) => '/' + d.path),
        );
        this.cdr.markForCheck();
      }),
    );

    this.subscriptions.push(
      this.learningPathService.getAllPathsProgress$().subscribe((progressList) => {
        this.progressMap.clear();
        for (const p of progressList) {
          this.progressMap.set(p.pathId, p);
        }
        this.cdr.markForCheck();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getProgress(pathId: string): LearningPathProgress | undefined {
    return this.progressMap.get(pathId);
  }

  isStepCompleted(pathId: string, stepId: string): boolean {
    const progress = this.progressMap.get(pathId);
    return progress?.stepStatuses.find((s) => s.stepId === stepId)?.completed ?? false;
  }

  getStepPartsLabel(pathId: string, stepId: string): string | null {
    const progress = this.progressMap.get(pathId);
    const status = progress?.stepStatuses.find((s) => s.stepId === stepId);
    if (!status || status.completedParts === 0 || status.completed) return null;
    return `${status.completedParts}/${status.totalParts}`;
  }

  getStepTypeIcon(type: string): string {
    switch (type) {
      case 'demo':
        return 'pi pi-play';
      case 'guide':
        return 'pi pi-book';
      case 'article':
        return 'pi pi-file';
      default:
        return 'pi pi-file';
    }
  }

  /** Check if a path has at least one real (routed, non-draft) step — independent of dev mode */
  hasAvailableSteps(path: LearningPathDefinition): boolean {
    return path.steps.some((step) => this.isStepAvailable(step));
  }

  /** Check if a step has a real route and is not draft — for visual distinction */
  isStepAvailable(step: LearningPathStep): boolean {
    if (step.type === 'demo' && !this.demosOn) return false; // demos switched off (site.json)
    return this.validRoutePaths.has(step.route) && !this.draftArticlePaths.has(step.route);
  }

  /** Check if a step's content is marked as draft (dev-only indicator) */
  isStepDraft(step: LearningPathStep): boolean {
    return this.draftArticlePaths.has(step.route);
  }

  /**
   * Steps to render for a path. In prod, not-yet-released demo steps (future
   * publishDate) are hidden entirely (staged weekly drop) — not shown as a
   * locked card. Dev/simulate-prod-off shows everything for authoring preview.
   */
  visibleSteps(path: LearningPathDefinition): LearningPathStep[] {
    // With the demos feature switched off (site.json) no demo step is shown, in dev too.
    const steps = this.demosOn ? path.steps : path.steps.filter((s) => s.type !== 'demo');
    if (!this.devModeService.isEffectivelyProd()) return steps;
    return steps.filter((s) => !(s.type === 'demo' && this.unreleasedDemoPaths.has(s.route)));
  }

  /** Check if a step should be locked (draft, non-existent, or parent path time-locked in prod mode) */
  isStepLocked(step: LearningPathStep): boolean {
    if (!this.devModeService.isEffectivelyProd()) return false;
    if (this.draftArticlePaths.has(step.route) || !this.validRoutePaths.has(step.route)) return true;
    // Demos are always available — never time-locked by parent path
    if (step.type === 'demo') return false;
    // Check if parent path is time-locked
    const parentPath = this.getStepParentPath(step);
    if (parentPath && this.isPathTimeLocked(parentPath)) return true;
    return false;
  }

  /** Check if a path is time-locked (publish date not yet reached, prod only) */
  isPathTimeLocked(path: LearningPathDefinition | null | undefined): boolean {
    if (!path) return false;
    if (!this.devModeService.isEffectivelyProd()) return false;
    return !this.learningPathService.isPathPublished(path);
  }

  /** Find the parent path of a step */
  getStepParentPath(step: LearningPathStep): LearningPathDefinition | null {
    return this.paths.find((p) => p.steps.some((s) => s.id === step.id)) ?? null;
  }

  /** Format a release date for display (e.g. '2026-04-13' → '13.04.2026' or 'Apr 13, 2026') */
  formatReleaseDate(dateStr: string): string {
    // Date-only ('YYYY-MM-DD') or full ISO ('…T00:00:00Z') — appending
    // 'T00:00:00' to full ISO yields Invalid Date. Mirrors TimeGateService.
    const date = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    const locale = dateLocaleFor(this.translationService.currentIntlLocale);
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /** Look up a path definition by ID (for prerequisite rendering) */
  getPathById(pathId: string): LearningPathDefinition | undefined {
    return this.paths.find((p) => p.id === pathId);
  }

  /**
   * Scroll to a prerequisite path section
   * browser-only: click handler.
   */
  scrollToPath(event: Event, pathId: string): void {
    event.preventDefault();
    const el = document.getElementById(pathId);
    if (el) {
      el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    }
  }

  /** Click handler - only navigate if step is not locked */
  onStepClick(step: LearningPathStep): void {
    if (this.isStepLocked(step)) return;
    this.openStep(step);
  }

  openStep(step: LearningPathStep): void {
    this.router.navigate([step.route], { queryParams: { from: 'learn' } });
  }

  isCertificateEligible(path: LearningPathDefinition): boolean {
    const progress = this.progressMap.get(path.id);
    if (!progress?.isCompleted) return false;
    // ALL required steps must have real existing routes (not draft, not missing)
    return path.steps.filter((s) => s.required).every((s) => this.isStepAvailable(s));
  }

  /** Hand focus back to the tile that opened each dialog — Optimus UI does not. */
  private readonly statusFocusReturn = new FocusReturn();
  private readonly certificateFocusReturn = new FocusReturn();

  openStatusDialog(path: LearningPathDefinition): void {
    this.statusFocusReturn.capture();
    this.pendingStatusPath = path;
    this.statusDialogVisible.set(true);
  }

  /** Every close path ends here: close button, Escape, dismissable mask. */
  onStatusDialogHide(): void {
    this.statusFocusReturn.restore();
  }

  onCertificateDialogHide(): void {
    this.certificateFocusReturn.restore();
  }

  onStatusStepClick(step: LearningPathStep): void {
    if (this.isStepAvailable(step)) {
      // Navigating away: the destination owns focus, not the tile behind us.
      this.statusFocusReturn.release();
      this.statusDialogVisible.set(false);
      this.openStep(step);
    }
  }

  getStatusSummary(path: LearningPathDefinition): string {
    const requiredSteps = path.steps.filter((s) => s.required);
    const total = requiredSteps.length;
    const completed = requiredSteps.filter((s) => this.isStepCompleted(path.id, s.id)).length;
    const unavailable = requiredSteps.filter((s) => !this.isStepAvailable(s)).length;
    const remaining = total - completed;

    const parts: string[] = [];
    parts.push(
      `${completed} ${this.t('learningPaths.progressOf')} ${total} ${this.t('learningPaths.certificate.completedStepsLabel')}`,
    );
    if (remaining > 0) {
      parts.push(this.t('learningPaths.certificate.stepsRemaining').replace('{{count}}', String(remaining)));
    }
    if (unavailable > 0) {
      parts.push(this.t('learningPaths.certificate.stepsUnavailable').replace('{{count}}', String(unavailable)));
    }
    return parts.join(' ');
  }

  openCertificateDialog(path: LearningPathDefinition): void {
    this.certificateFocusReturn.capture();
    this.pendingCertificatePath = path;
    this.certificateName = '';
    this.certificateNameTouched = false;
    this.certificateDialogVisible.set(true);
  }

  confirmCertificateDownload(): void {
    if (!this.pendingCertificatePath) return;
    this.certificateNameTouched = true;
    const name = this.certificateName.trim().slice(0, this.MAX_CERT_NAME_LEN);
    if (!name) return;
    const path = this.pendingCertificatePath;
    this.certificateDialogVisible.set(false);
    this.pendingCertificatePath = null;
    this.printCertificate(path, name);
  }

  /**
   * Best-practice accessible export: render the certificate as semantic HTML and
   * let the browser produce a TAGGED PDF via its own print engine — real
   * extractable text, logical reading order, document language, subset-embedded
   * fonts and correct complex-script shaping (Bengali/Devanagari/Gurmukhi/Hangul/
   * Cyrillic/Greek). jsPDF can do none of these (no Unicode shaping, zero tagging),
   * and server-side generation would break the on-device privacy promise — so a
   * browser-printed HTML document is the only client-side route to a genuinely
   * barrier-free certificate. The visible frame/seal/separators are aria-hidden so
   * assistive tech reads only the meaningful content.
   */
  private printCertificate(path: LearningPathDefinition, name: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.progressMap.get(path.id)) return;

    const html = this.buildCertificateHtml(path, name);

    const iframe = this.document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    // Off-screen, but with a real A4-landscape viewport so layout/measurement and
    // the print snapshot are correct (a 0x0 iframe would collapse the layout).
    iframe.style.cssText = 'position:fixed;left:-10000px;top:0;width:1123px;height:794px;border:0;';
    this.document.body.appendChild(iframe);

    const cleanup = () => {
      try {
        iframe.remove();
      } catch {
        /* noop */
      }
    };

    iframe.onload = async () => {
      const win = iframe.contentWindow;
      const idoc = win?.document;
      if (!win || !idoc) {
        cleanup();
        return;
      }
      try {
        const fonts = (idoc as Document).fonts;
        if (fonts?.ready) {
          try {
            await fonts.ready;
          } catch {
            /* proceed with fallback */
          }
        }
        this.fitCertificateName(idoc);
        win.addEventListener('afterprint', cleanup, { once: true });
        setTimeout(cleanup, 60000); // safety net if afterprint never fires
        win.focus();
        win.print();
      } catch {
        cleanup();
      }
    };

    const idoc = iframe.contentWindow?.document ?? iframe.contentDocument;
    if (!idoc) {
      cleanup();
      return;
    }
    idoc.open();
    idoc.write(html);
    idoc.close();
  }

  /** Shrink the recipient name until it fits on one line within its container. */
  private fitCertificateName(idoc: Document): void {
    const view = idoc.defaultView;
    const el = idoc.querySelector('.cert-name') as HTMLElement | null;
    if (!el || !view || !el.parentElement) return;
    const maxW = el.parentElement.clientWidth;
    if (!maxW) return;
    let size = parseFloat(view.getComputedStyle(el).fontSize) || 40;
    const min = size * 0.4;
    let guard = 0;
    while (el.scrollWidth > maxW && size > min && guard++ < 60) {
      size -= 1;
      el.style.fontSize = `${size}px`;
    }
  }

  /** HTML-escape dynamic strings before injection (the name is user input). */
  private escapeHtml(s: string): string {
    return s.replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
    );
  }

  /**
   * Build a standalone, semantically-structured HTML document for the certificate.
   * The browser's print-to-PDF turns this into a tagged, accessible PDF. Dynamic
   * text comes from the translation service (real Unicode); the browser shapes
   * every script and subsets the embedded Noto fonts automatically.
   */
  private buildCertificateHtml(path: LearningPathDefinition, name: string): string {
    const esc = (s: string) => this.escapeHtml(s);
    const lang = this.translationService.currentLanguage.replace(/-easy$/, '');
    const pathColor = path.color || '#6366F1';

    const certTitle = this.t('learningPaths.certificate.title');
    const subtitle = this.t('learningPaths.certificate.subtitle');
    const hasCompleted = this.t('learningPaths.certificate.hasCompleted');
    const pathTitle = this.t(path.titleKey);
    const sealText = this.t('learningPaths.certificate.seal');
    // The issuing site: the page's own host (a certificate is printed in the
    // browser), or no issuer line at all — never a placeholder domain.
    const issuer = siteHost();

    const required = path.steps.filter((s) => s.required);
    const optional = path.steps.filter((s) => !s.required);
    const steps = [...required, ...optional];
    const stepsHtml = steps
      .map((s) => `<li class="${s.required ? 'req' : 'opt'}">${esc(this.t(s.titleKey))}</li>`)
      .join('');
    const twoCol = steps.length > 6 ? ' two-col' : '';

    const locale = dateLocaleFor(lang);
    let dateStr: string;
    try {
      dateStr = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const fontStack = `'Noto Sans KR','Noto Sans Devanagari','Noto Sans Bengali','Noto Sans Gurmukhi','Segoe UI',Arial,sans-serif`;
    // Letter-spacing is an elegant flourish for Latin/Cyrillic/Greek titles, but it
    // splits Indic grapheme clusters apart (visually and in text extraction), so
    // disable it when the title is Devanagari/Bengali/Gurmukhi.
    const titleSpacing = /[ऀ-੿]/.test(certTitle) ? 'normal' : '0.16em';

    return `<!doctype html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<title>${esc(certTitle)} - ${esc(pathTitle)}</title>
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { font-family: ${fontStack}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .cert { position: relative; width: 297mm; height: 210mm; background: #FFFDF5; color: #1f2937;
    display: flex; align-items: center; justify-content: center; --path-color: ${pathColor}; }
  .cert::before { content: ''; position: absolute; inset: 7mm; border: 0.5mm solid #B8860B; }
  .cert::after { content: ''; position: absolute; inset: 10mm; border: 0.2mm solid #E8D5A0; }
  .content { position: relative; width: 250mm; text-align: center; }
  .cert-title { margin: 0; color: #B8860B; font-size: 40pt; font-weight: 700; letter-spacing: ${titleSpacing}; }
  .cert-subtitle { margin: 2mm 0 0; color: #7f8694; font-size: 12pt; }
  .cert-name { margin: 5mm 0 1mm; color: var(--path-color); font-size: 30pt; font-weight: 700;
    white-space: nowrap; line-height: 1.1; }
  .cert-completed { margin: 0; color: #5b6270; font-style: italic; font-size: 12pt; }
  .cert-path { margin: 2mm 0 0; color: #1f2937; font-size: 22pt; font-weight: 700; }
  .cert-steps { list-style: none; margin: 4mm auto 0; padding: 0; max-width: 220mm; font-size: 11pt; color: #4b5563; }
  .cert-steps.two-col { column-count: 2; column-gap: 16mm; text-align: left; }
  .cert-steps li { margin: 0 0 1.6mm; break-inside: avoid; }
  .cert-steps li::before { content: '\\2022'; color: var(--path-color); margin-right: 6px; }
  .cert-steps li.opt::before { content: '\\2606'; }
  .orn { display: flex; align-items: center; justify-content: center; gap: 6px; width: 55%; margin: 5mm auto; }
  .orn::before, .orn::after { content: ''; height: 0.3mm; background: #D4A843; flex: 1; }
  .orn i { width: 2.4mm; height: 2.4mm; background: #B8860B; transform: rotate(45deg); display: block; }
  .seal { width: 30mm; height: 30mm; margin: 5mm auto 0; border: 0.6mm solid #B8860B; border-radius: 50%;
    display: flex; flex-direction: column; align-items: center; justify-content: center; color: #B8860B; position: relative; }
  .seal::before { content: ''; position: absolute; inset: 1.6mm; border: 0.2mm solid #B8860B; border-radius: 50%; }
  .seal .t, .seal .b { font-size: 7pt; font-weight: 700; letter-spacing: 0.05em; }
  .seal .d { width: 2.6mm; height: 2.6mm; background: #B8860B; transform: rotate(45deg); margin: 1mm 0; }
  .cert-date { margin: 4mm 0 0; color: #7f8694; font-size: 10pt; }
  .cert-issuer { margin: 1.5mm 0 0; color: #C99A2E; font-size: 9pt; }
</style>
</head>
<body>
  <main class="cert">
    <div class="content">
      <h1 class="cert-title">${esc(certTitle)}</h1>
      <p class="cert-subtitle">${esc(subtitle)}</p>
      <div class="orn" aria-hidden="true"><i></i></div>
      <p class="cert-name">${esc(name)}</p>
      <p class="cert-completed">${esc(hasCompleted)}</p>
      <h2 class="cert-path">${esc(pathTitle)}</h2>
      <div class="orn" aria-hidden="true"><i></i></div>
      <ul class="cert-steps${twoCol}">${stepsHtml}</ul>
      <div class="seal" aria-hidden="true"><span class="t">${esc(sealText)}</span><span class="d"></span><span class="b">K &middot; I &middot; T</span></div>
      <p class="cert-date">${esc(dateStr)}</p>
      ${issuer ? `<p class="cert-issuer">${esc(issuer)}</p>` : ''}
    </div>
  </main>
</body>
</html>`;
  }
}
