/**
 * Resource part of the catalog details drawer: access information (source,
 * author, time, language, date, paywall, registration) and similar resources.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CatalogEntry, CatalogResourceEntry } from '../../models/catalog.model';
import { CatalogSimilarEntriesComponent } from './catalog-similar-entries.component';

@Component({
  selector: 'app-catalog-resource-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CatalogSimilarEntriesComponent],
  template: `
    <div class="info-card access-card">
      <div class="detail-card-header">
        <i class="pi pi-info-circle header-icon"></i>
        <h4>{{ translate('catalog.details.accessInfo') }}</h4>
      </div>
      <div class="access-info-grid">
        @if (resource().source) {
          <div class="access-item">
            <i class="pi pi-globe access-icon"></i>
            <div>
              <span class="access-label">{{ translate('catalog.details.source') }}</span
              ><span class="access-value">{{ resource().source }}</span>
            </div>
          </div>
        }
        @if (resource().author) {
          <div class="access-item">
            <i class="pi pi-user access-icon"></i>
            <div>
              <span class="access-label">{{ translate('catalog.details.author') }}</span
              ><span class="access-value">{{ resource().author }}</span>
            </div>
          </div>
        }
        @if (resource().estimatedTime) {
          <div class="access-item">
            <i class="pi pi-clock access-icon"></i>
            <div>
              <span class="access-label">{{ translate('catalog.details.estimatedTime') }}</span
              ><span class="access-value">{{ resource().estimatedTime }}</span>
            </div>
          </div>
        }
        @if (resource().language) {
          <div class="access-item">
            <i class="pi pi-flag access-icon"></i>
            <div>
              <span class="access-label">{{ translate('catalog.details.language') }}</span
              ><span class="access-value">{{ translate('aiResources.language.' + resource().language) }}</span>
            </div>
          </div>
        }
        @if (resource().publishedDate) {
          <div class="access-item">
            <i class="pi pi-calendar access-icon"></i>
            <div>
              <span class="access-label">{{ translate('catalog.details.published') }}</span
              ><span class="access-value">{{ resource().publishedDate }}</span>
            </div>
          </div>
        }
        @if (resource().isFreeBehindPaywall) {
          <div class="access-item">
            <i class="pi pi-lock access-icon"></i>
            <div>
              <span class="access-label">{{ translate('catalog.details.access') }}</span
              ><span class="access-value">{{ translate('catalog.details.paywall') }}</span>
            </div>
          </div>
        }
        @if (resource().requiresRegistration) {
          <div class="access-item">
            <i class="pi pi-user-plus access-icon"></i>
            <div>
              <span class="access-label">{{ translate('catalog.details.registration') }}</span
              ><span class="access-value">{{ translate('catalog.details.required') }}</span>
            </div>
          </div>
        }
      </div>
    </div>
    <app-catalog-similar-entries
      [entries]="similar()"
      titleKey="catalog.details.similarResources"
      emptyKey="catalog.details.noSimilarResources"
      (opened)="opened.emit($event)"
    />
  `,
  styles: [
    `
      app-catalog-resource-details {
        display: contents;
      }

      /* Resource Details - Access Info */
      .catalog-details-sidebar .resource-details-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .catalog-details-sidebar .access-info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .catalog-details-sidebar .access-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
      }

      .catalog-details-sidebar .access-icon {
        color: var(--primary-color-fg);
        font-size: 1.1rem;
        margin-top: 0.1rem;
      }

      .catalog-details-sidebar .access-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin-bottom: 0.25rem;
      }

      .catalog-details-sidebar .access-value {
        display: block;
        font-size: 0.95rem;
        color: var(--text-color);
        font-weight: 500;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .catalog-details-sidebar .access-info-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CatalogResourceDetailsComponent {
  private translationService = inject(TranslationService);

  readonly resource = input.required<CatalogResourceEntry>();
  readonly similar = input.required<CatalogEntry[]>();

  readonly opened = output<CatalogEntry>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
