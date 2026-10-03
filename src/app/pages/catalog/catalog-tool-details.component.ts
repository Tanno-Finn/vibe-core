/**
 * Tool part of the catalog details drawer: features, use cases, pros and
 * cons, alternatives and similar tools.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { ChipModule } from '@openng/optimus-ui/chip';
import { TranslationService } from '../../services/translation.service';
import { CatalogEntry, CatalogToolEntry } from '../../models/catalog.model';
import { CatalogEntryPresenter } from './catalog-entry-presenter.service';
import { CatalogSimilarEntriesComponent } from './catalog-similar-entries.component';

@Component({
  selector: 'app-catalog-tool-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipModule, CatalogSimilarEntriesComponent],
  template: `
    @if (tool().features?.length) {
      <div class="info-card features-card">
        <div class="detail-card-header">
          <i class="pi pi-star header-icon"></i>
          <h4>{{ translate('catalog.details.features') }}</h4>
        </div>
        <div class="use-cases-grid">
          @for (feature of tool().features; track feature) {
            <div class="use-case-item">
              <div class="use-case-number"><i class="pi pi-check"></i></div>
              <span class="use-case-text">{{ feature }}</span>
            </div>
          }
        </div>
      </div>
    }
    @if (tool().useCases?.length) {
      <div class="info-card use-cases-card">
        <div class="detail-card-header">
          <i class="pi pi-lightbulb header-icon"></i>
          <h4>{{ translate('catalog.details.useCases') }}</h4>
        </div>
        <div class="use-cases-grid">
          @for (useCase of tool().useCases; track useCase; let i = $index) {
            <div class="use-case-item">
              <div class="use-case-number">{{ i + 1 }}</div>
              <span class="use-case-text">{{ useCase }}</span>
            </div>
          }
        </div>
      </div>
    }
    @if (tool().pros?.length || tool().cons?.length) {
      <div class="pros-cons-container">
        @if (tool().pros?.length) {
          <div class="info-card pros-card">
            <div class="detail-card-header pros-header">
              <i class="pi pi-thumbs-up header-icon"></i>
              <h4>{{ translate('catalog.details.pros') }}</h4>
            </div>
            <div class="pros-list">
              @for (pro of tool().pros; track pro) {
                <div class="pro-item">
                  <i class="pi pi-plus-circle pro-icon"></i><span>{{ pro }}</span>
                </div>
              }
            </div>
          </div>
        }
        @if (tool().cons?.length) {
          <div class="info-card cons-card">
            <div class="detail-card-header cons-header">
              <i class="pi pi-thumbs-down header-icon"></i>
              <h4>{{ translate('catalog.details.cons') }}</h4>
            </div>
            <div class="cons-list">
              @for (con of tool().cons; track con) {
                <div class="con-item">
                  <i class="pi pi-minus-circle con-icon"></i><span>{{ con }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    }
    @if (tool().alternatives?.length) {
      <div class="info-card alternatives-card">
        <div class="detail-card-header">
          <i class="pi pi-refresh header-icon"></i>
          <h4>{{ translate('catalog.details.alternatives') }}</h4>
        </div>
        <div class="alternatives-container">
          @for (alternative of tool().alternatives; track alternative) {
            <p-chip
              [label]="alternative"
              [style]="p.getEnhancedAlternativeStyle()"
              class="enhanced-alternative"
            ></p-chip>
          }
        </div>
      </div>
    }
    <app-catalog-similar-entries
      [entries]="similar()"
      titleKey="catalog.details.similarTools"
      emptyKey="catalog.details.noSimilarTools"
      (opened)="opened.emit($event)"
    />
  `,
  styles: [
    `
      app-catalog-tool-details {
        display: contents;
      }

      /* Use Cases */
      .catalog-details-sidebar .use-cases-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 0.75rem;
      }

      .catalog-details-sidebar .use-case-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        transition: all 0.3s ease;
      }

      .catalog-details-sidebar .use-case-item:hover {
        background: var(--surface-hover);
        border-color: var(--primary-color-fg);
      }

      .catalog-details-sidebar .use-case-number {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-color);
        color: white;
        border-radius: 50%;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .catalog-details-sidebar .use-case-text {
        flex: 1;
        font-size: 0.9rem;
        line-height: 1.4;
        color: var(--text-color);
      }

      /* Pros & Cons */
      .catalog-details-sidebar .pros-cons-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .catalog-details-sidebar .pros-card,
      .catalog-details-sidebar .cons-card {
        margin: 0;
      }

      .catalog-details-sidebar .pros-header .header-icon {
        color: var(--green-500);
      }

      .catalog-details-sidebar .cons-header .header-icon {
        color: var(--red-500);
      }

      .catalog-details-sidebar .pros-list,
      .catalog-details-sidebar .cons-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .catalog-details-sidebar .pro-item,
      .catalog-details-sidebar .con-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-size: 0.9rem;
        line-height: 1.4;
        color: var(--text-color);
        font-weight: 400;
      }

      .catalog-details-sidebar .pro-icon {
        color: var(--green-500);
        font-size: 0.9rem;
        margin-top: 0.1rem;
        font-weight: bold;
      }

      .catalog-details-sidebar .con-icon {
        color: var(--red-500);
        font-size: 0.9rem;
        margin-top: 0.1rem;
        font-weight: bold;
      }

      .catalog-details-sidebar .alternatives-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .catalog-details-sidebar .pros-cons-container {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .catalog-details-sidebar .features-list {
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        .catalog-details-sidebar .use-case-item {
          transition: none;
        }

        .catalog-details-sidebar .use-case-item:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class CatalogToolDetailsComponent {
  private translationService = inject(TranslationService);
  protected readonly p = inject(CatalogEntryPresenter);

  readonly tool = input.required<CatalogToolEntry>();
  readonly similar = input.required<CatalogEntry[]>();

  readonly opened = output<CatalogEntry>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
