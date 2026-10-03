import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
  isDevMode,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectModule } from '@openng/optimus-ui/select';
import { DialogModule } from '@openng/optimus-ui/dialog';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';

import { TranslationService } from '../../services/translation.service';
import { CITATION_FORMAT_OPTIONS, FILE_FORMAT_OPTIONS } from './citation-formats';

/** What the dialog asks the page to export. */
export interface SourcesExportChoice {
  citationFormat: string;
  fileFormat: string;
  /** true: every source; false: the filtered subset. */
  exportAll: boolean;
  /** Dev-only: restrict to sources flagged bookCitation. */
  bookCitationOnly: boolean;
}

/**
 * The bibliography export dialog of the sources page: citation style, file
 * format, filtered-vs-all and (dev only) the bookCitation switch. It owns
 * those choices — they survive closing and reopening, as before — and emits
 * one `download` event; the page picks the sources and does the export.
 *
 * Styles stay ViewEncapsulation.None and scoped under app-sources, exactly as
 * they were when this markup lived in the page.
 */
@Component({
  selector: 'app-sources-export-dialog',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, SelectModule, DialogModule, ToggleSwitchModule],
  template: `
    <!-- #dlg: [showHeader]="false" leaves Optimus UI's generated 'ariaLabelledBy'
         id pointing at nothing (the <span> carrying it lives inside the
         header's *ngIf), so the dialog has no accessible name. Putting that
         same id on the visible heading below repairs the reference.
         NOTE: no backticks in this comment - it sits inside a template literal. -->
    <p-dialog
      #dlg
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      (onHide)="closed.emit()"
      [modal]="true"
      [closable]="true"
      [dismissableMask]="true"
      [closeOnEscape]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="export-dialog"
      [style]="{ width: '90vw', maxWidth: '600px', height: 'auto', maxHeight: '90vh' }"
      [header]="''"
      [showHeader]="false"
    >
      <div class="dialog-content">
        <!-- Header -->
        <div class="dialog-header">
          <div class="header-icon">
            <i class="pi pi-download"></i>
          </div>
          <div class="header-text">
            <h2 class="dialog-title" [attr.id]="dlg.computedAriaLabelledBy()">
              {{ translate('sources.export.dialogTitle') }}
            </h2>
            <p class="dialog-subtitle">{{ translate('sources.export.dialogSubtitle') }}</p>
          </div>
          <button
            class="close-btn"
            (click)="closed.emit()"
            [attr.aria-label]="translate('ui.close')"
            [title]="translate('ui.close')"
            type="button"
          >
            <i class="pi pi-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="dialog-body">
          <!-- Citation Format -->
          <div class="export-option">
            <!-- <label for> never binds to p-select: its focusable element is a
                 <span role="combobox">, not a labelable control. Caption + [ariaLabelledBy]. -->
            <span class="option-label" id="export-citation-format-label">{{
              translate('sources.export.citationFormat')
            }}</span>
            <p-select
              inputId="export-citation-format"
              [ariaLabelledBy]="'export-citation-format-label'"
              [options]="citationFormatOptions"
              [(ngModel)]="selectedCitationFormat"
              optionLabel="label"
              optionValue="value"
              [placeholder]="translate('sources.export.selectCitationFormat')"
              styleClass="full-width-dropdown"
              appendTo="body"
            ></p-select>
          </div>

          <!-- File Format -->
          <div class="export-option">
            <span class="option-label" id="export-file-format-label">{{ translate('sources.export.fileFormat') }}</span>
            <p-select
              inputId="export-file-format"
              [ariaLabelledBy]="'export-file-format-label'"
              [options]="fileFormatOptions"
              [(ngModel)]="selectedFileFormat"
              optionLabel="label"
              optionValue="value"
              [placeholder]="translate('sources.export.selectFileFormat')"
              styleClass="full-width-dropdown"
              appendTo="body"
            ></p-select>
          </div>

          <!-- Source Selection Switch - only when filters active -->
          @if (hasActiveFilters()) {
            <div class="export-option">
              <label class="option-label" for="export-source-selection">{{
                translate('sources.export.sourceSelection')
              }}</label>
              <div class="switch-container">
                <span [class.active]="!exportAllSources()">
                  {{ translate('sources.export.filteredSources') }} ({{ filteredCount() }})
                </span>
                <p-toggleswitch inputId="export-source-selection" [(ngModel)]="exportAllSources"></p-toggleswitch>
                <span [class.active]="exportAllSources()">
                  {{ translate('sources.export.allSources') }} ({{ totalCount() }})
                </span>
              </div>
            </div>
          }

          <!-- Book Citation Filter - DEV MODE ONLY -->
          @if (isDevMode) {
            <div class="export-option">
              <label class="option-label" for="export-book-citation">{{
                translate('sources.export.bookCitationFilter')
              }}</label>
              <div class="switch-container">
                <span [class.active]="!exportBookCitationOnly()">
                  {{ translate('sources.export.allSourcesLabel') }}
                </span>
                <p-toggleswitch inputId="export-book-citation" [(ngModel)]="exportBookCitationOnly"></p-toggleswitch>
                <span [class.active]="exportBookCitationOnly()">
                  {{ translate('sources.export.bookCitationOnly') }}
                </span>
              </div>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="dialog-footer">
          <p-button [label]="translate('ui.close')" severity="secondary" [text]="true" (onClick)="closed.emit()" />
          <button
            pButton
            class="p-button-success download-btn"
            (click)="requestDownload()"
            [disabled]="!selectedCitationFormat() || !selectedFileFormat()"
          >
            <i class="pi pi-download" pButtonIcon aria-hidden="true"></i
            ><span pButtonLabel>{{ translate('sources.export.downloadButton') }}</span>
          </button>
        </div>
      </div>
    </p-dialog>
  `,
  styles: [
    `
      /* Export Dialog Styles - matches Easy Language Dialog */
      .export-dialog .p-dialog-mask {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        cursor: pointer; /* Enable click-to-close visual feedback */
      }

      .export-dialog .p-dialog {
        border-radius: 16px;
        overflow: visible;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        cursor: default; /* Prevent click-to-close on dialog itself */
      }

      .export-dialog .p-dialog-content {
        padding: 0;
        border-radius: 16px;
        background: var(--surface-ground);
        overflow: visible;
      }

      app-sources .dialog-content {
        background: var(--surface-ground);
      }

      app-sources .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-5) var(--space-6);
        background: var(--green-50);
        border-bottom: 3px solid var(--green-500);
      }

      app-sources .header-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--surface-ground);
        border-radius: 12px;
        color: var(--green-500);
        font-size: 1.4rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      app-sources .header-text {
        flex: 1;
        margin: 0 var(--space-4);
      }

      app-sources .dialog-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--green-700);
        margin: 0;
      }

      app-sources .dialog-subtitle {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        margin: var(--space-1) 0 0 0;
      }

      app-sources .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: var(--surface-ground);
        border: 1px solid var(--surface-border);
        border-radius: 50%;
        color: var(--text-color-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1.1rem;
      }

      app-sources .close-btn:hover {
        background: var(--red-50);
        border-color: var(--red-400);
        color: var(--red-600);
      }

      app-sources .close-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-sources .dialog-body {
        padding: var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-5);
      }

      app-sources .export-option {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      app-sources .option-label {
        font-weight: 600;
        color: var(--text-color);
        font-size: 1rem;
      }

      app-sources .full-width-dropdown {
        width: 100%;
      }

      app-sources .full-width-dropdown .p-select-overlay {
        min-width: 100% !important;
      }

      app-sources .switch-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: var(--space-3);
        background: var(--surface-100);
        border-radius: 8px;
        border: 1px solid var(--surface-border);
      }

      app-sources .switch-container span {
        color: var(--text-color-secondary);
        font-size: 0.95rem;
        transition: color 0.2s ease;
      }

      app-sources .switch-container span.active {
        color: var(--text-color);
        font-weight: 600;
      }

      app-sources .dialog-footer {
        padding: var(--space-4) var(--space-6);
        border-top: 1px solid var(--surface-border);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: var(--space-3);
      }

      app-sources .download-btn {
        font-weight: 600;
      }

      /* Mobile: Stack footer buttons full-width with centered labels */
      @media (max-width: 600px) {
        app-sources .dialog-footer {
          flex-direction: column-reverse;
          align-items: stretch;
          gap: var(--space-2);
        }

        app-sources .dialog-footer .p-button,
        app-sources .dialog-footer .download-btn {
          width: 100%;
          justify-content: center;
        }
      }

      /* Dark theme for dialog */
      .dark-theme app-sources .dialog-header {
        background: var(--green-900);
      }

      .dark-theme app-sources .dialog-title {
        color: var(--green-300);
      }

      /* In .dark-theme the surface scale is inverted (styles.scss ~L534):
       --surface-800/--surface-700 resolve to near-white. Use --surface-50
       for tinted dark panels, --surface-200 for borders. */
      .dark-theme app-sources .header-icon {
        background: var(--surface-50);
        color: var(--green-400);
      }

      .dark-theme app-sources .switch-container {
        background: var(--surface-50);
        border-color: var(--surface-200);
      }
    `,
  ],
})
export class SourcesExportDialogComponent {
  private translationService = inject(TranslationService);

  readonly visible = model(false);
  /** Shows the filtered-vs-all switch (only meaningful while a filter is active). */
  readonly hasActiveFilters = input(false);
  readonly filteredCount = input(0);
  readonly totalCount = input(0);

  /** Close button, footer button, Escape or mask click. */
  readonly closed = output<void>();
  readonly download = output<SourcesExportChoice>();

  readonly citationFormatOptions = [...CITATION_FORMAT_OPTIONS];
  readonly fileFormatOptions = [...FILE_FORMAT_OPTIONS];

  readonly selectedCitationFormat = signal<string | null>('din-iso-690');
  readonly selectedFileFormat = signal<string | null>('md');
  readonly exportAllSources = signal(false); // Default: export filtered sources
  readonly exportBookCitationOnly = signal(false); // Dev-only: export only bookCitation: true sources

  // Dev mode flag (checked once at initialization)
  readonly isDevMode = isDevMode();

  requestDownload(): void {
    const citationFormat = this.selectedCitationFormat();
    const fileFormat = this.selectedFileFormat();
    if (!citationFormat || !fileFormat) return;
    this.download.emit({
      citationFormat,
      fileFormat,
      exportAll: this.exportAllSources(),
      bookCitationOnly: this.isDevMode && this.exportBookCitationOnly(),
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
