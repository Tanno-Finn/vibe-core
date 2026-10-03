/**
 * Compare view of the catalog — the header with its two actions, the
 * desktop table and the mobile feature-grouped list. Shown by CatalogComponent
 * in compare mode; the three actions go back up as outputs.
 *
 * The table and the list are child components; all compare styles stay
 * here, global (ViewEncapsulation.None) under the same `app-catalog`
 * selectors they had in the page, in their original order. Every host is
 * `display: contents`, so the page's layout sees the same boxes as before
 * the split.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TranslationService } from '../../services/translation.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { CatalogToolEntry } from '../../models/catalog.model';
import { CatalogCompareTableComponent } from './catalog-compare-table.component';
import { CatalogCompareListComponent } from './catalog-compare-list.component';

@Component({
  selector: 'app-catalog-compare-view',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, HighlightDirective, CatalogCompareTableComponent, CatalogCompareListComponent],
  template: `
    <div class="compare-table-view">
      <div class="compare-table-header">
        <h2 appHighlight>{{ translate('catalog.compare.title') }} ({{ count() }})</h2>
        <div class="compare-table-actions">
          <p-button
            [label]="translate('catalog.buttons.clearAll')"
            icon="pi pi-trash"
            severity="danger"
            size="small"
            [outlined]="true"
            (click)="cleared.emit()"
          ></p-button>
          <p-button
            [label]="translate('catalog.buttons.close')"
            icon="pi pi-times"
            severity="secondary"
            size="small"
            [outlined]="true"
            (click)="closed.emit()"
          ></p-button>
        </div>
      </div>
      <app-catalog-compare-table [tools]="tools()" (removed)="removed.emit($event)" />
      <app-catalog-compare-list [tools]="tools()" (removed)="removed.emit($event)" />
    </div>
  `,
  styles: [
    `
      app-catalog-compare-view,
      app-catalog-compare-table,
      app-catalog-compare-list {
        display: contents;
      }

      /* Compare Table Styles */
      app-catalog .compare-table-view {
        margin-top: 2rem;
        background: var(--surface-card);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-3);
        overflow: hidden;
      }

      app-catalog .compare-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        background: var(--surface-100);
        border-bottom: 1px solid var(--surface-border);
      }

      app-catalog .compare-table-header h2 {
        color: var(--primary-color-fg);
        margin: 0;
        font-size: 1.5rem;
      }

      app-catalog .compare-table-actions {
        display: flex;
        gap: 0.5rem;
      }

      app-catalog .compare-table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      app-catalog .mobile-compare-list {
        display: none;
      }

      app-catalog .compare-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 600px;
      }

      app-catalog .compare-table th,
      app-catalog .compare-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--surface-border);
        vertical-align: top;
      }

      app-catalog .compare-table th {
        background: var(--surface-50);
        font-weight: 600;
        color: var(--text-color);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      app-catalog .compare-table .feature-column {
        width: 180px;
        min-width: 180px;
        background: var(--surface-100);
        font-weight: 700;
      }

      app-catalog .tool-column {
        min-width: 200px;
        text-align: center;
      }

      app-catalog .tool-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
      }

      app-catalog .tool-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--text-color);
      }

      app-catalog .feature-label {
        font-weight: 600;
        color: var(--primary-color-fg);
        background: var(--surface-100);
      }

      app-catalog .tool-data {
        text-align: center;
      }

      app-catalog .rating-display {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        flex-wrap: wrap;
      }

      app-catalog .rating-display .pi {
        display: inline-block;
      }

      app-catalog .rating-number {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        margin-left: 0.5rem;
      }

      app-catalog .feature-list {
        margin: 0;
        padding: 0;
        list-style: none;
        text-align: left;
      }

      app-catalog .feature-list li {
        padding: 0.25rem 0;
        border-bottom: 1px solid var(--surface-100);
      }

      app-catalog .feature-list li:last-child {
        border-bottom: none;
      }

      app-catalog .usecases-display {
        text-align: left;
        line-height: 1.4;
      }

      app-catalog .more-features,
      app-catalog .more-usecases {
        font-style: italic;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        app-catalog .compare-table-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        app-catalog .compare-table-actions {
          width: 100%;
          justify-content: space-between;
        }

        app-catalog .compare-table {
          min-width: unset;
          width: 100%;
          font-size: 0.85rem;
        }

        app-catalog .compare-table th,
        app-catalog .compare-table td {
          padding: 0.5rem 0.25rem;
          word-break: break-word;
          hyphens: auto;
        }

        app-catalog .feature-column {
          width: 25%;
          min-width: 80px;
        }

        app-catalog .tool-column {
          min-width: 120px;
        }

        app-catalog .tool-header {
          flex-direction: column;
          text-align: center;
          gap: 0.25rem;
        }
      }

      /* Extra small mobile - switch to mobile compare layout */
      @media (max-width: 480px) {
        app-catalog .desktop-table {
          display: none;
        }

        app-catalog .mobile-compare-list {
          display: block;
          padding: 1rem;
        }

        app-catalog .mobile-tools-header {
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--border-radius);
          margin-bottom: 1rem;
          padding: 1rem;
          box-shadow: var(--shadow-1);
        }

        app-catalog .mobile-tools-header h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1.1rem;
          color: var(--primary-color-fg);
        }

        app-catalog .mobile-tool-names {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        app-catalog .mobile-tool-name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: var(--surface-100);
          border-radius: var(--border-radius-sm);
          font-weight: 600;
        }

        app-catalog .mobile-feature-group {
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: var(--border-radius);
          margin-bottom: 1rem;
          box-shadow: var(--shadow-1);
        }

        app-catalog .mobile-feature-header {
          padding: 1rem;
          background: var(--surface-100);
          border-bottom: 1px solid var(--surface-border);
          border-radius: var(--border-radius) var(--border-radius) 0 0;
        }

        app-catalog .mobile-feature-header h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--primary-color-fg);
        }

        app-catalog .mobile-feature-values {
          padding: 1rem;
        }

        app-catalog .mobile-tool-value {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--surface-100);
        }

        app-catalog .mobile-tool-value:last-child {
          border-bottom: none;
        }

        app-catalog .mobile-tool-value .tool-name {
          font-weight: 500;
          color: var(--text-color);
          font-size: 0.9rem;
          min-width: 35%;
        }

        app-catalog .mobile-features-row {
          flex-direction: column;
          align-items: stretch;
          padding: 0.75rem 0;
        }

        app-catalog .mobile-tool-name-section {
          margin-bottom: 0.5rem;
        }

        app-catalog .mobile-features-section {
          width: 100%;
        }

        app-catalog .mobile-features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          justify-content: flex-start;
          width: 100%;
        }

        app-catalog .mobile-usecases {
          font-size: 0.85rem;
          text-align: right;
          max-width: 60%;
        }

        app-catalog .rating-display {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        app-catalog .rating-number {
          font-size: 0.8rem;
          color: var(--text-color-secondary);
        }

        app-catalog .compare-table-header h2 {
          font-size: 1.2rem;
        }
      }
    `,
  ],
})
export class CatalogCompareViewComponent {
  private translationService = inject(TranslationService);

  /** The tools on the comparison list, in catalog order. */
  readonly tools = input.required<CatalogToolEntry[]>();
  /** Size of the stored comparison list, shown in the heading. */
  readonly count = input.required<number>();

  readonly removed = output<string>();
  readonly cleared = output<void>();
  readonly closed = output<void>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
