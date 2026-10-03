/**
 * Loading placeholder of the catalog grid, shown until the catalog bundle
 * has arrived. Pure markup; the page decides when it is visible.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { SkeletonModule } from '@openng/optimus-ui/skeleton';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-catalog-skeleton',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule],
  template: `
    <!-- aria-busy alone was a state on a roleless <div>: no live region, no text.
           role="status" makes it a polite region and the sr-only line gives it
           something to say - every p-skeleton is hard-coded aria-hidden="true". -->
    <div class="loading-skeleton" role="status" aria-busy="true">
      <span class="sr-only">{{ translate('common.loading') }}</span>
      <div class="catalog-grid">
        @for (item of [1, 2, 3, 4, 5, 6]; track item) {
          <div class="skeleton-card">
            <div class="skeleton-header">
              <p-skeleton shape="circle" size="3rem"></p-skeleton>
              <div class="skeleton-title-section">
                <p-skeleton width="70%" height="1.5rem"></p-skeleton>
                <p-skeleton width="50%" height="1rem"></p-skeleton>
              </div>
            </div>
            <div class="skeleton-content">
              <p-skeleton width="100%" height="4rem"></p-skeleton>
              <div class="skeleton-chips">
                <p-skeleton width="80px" height="1.5rem" borderRadius="16px"></p-skeleton>
                <p-skeleton width="100px" height="1.5rem" borderRadius="16px"></p-skeleton>
                <p-skeleton width="90px" height="1.5rem" borderRadius="16px"></p-skeleton>
              </div>
            </div>
            <div class="skeleton-footer">
              <p-skeleton width="100%" height="2.5rem" borderRadius="4px"></p-skeleton>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      app-catalog-skeleton {
        display: contents;
      }

      /* Loading Skeleton */
      app-catalog .loading-skeleton {
        padding: 2rem 0;
      }

      app-catalog .skeleton-card {
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        min-height: 300px;
      }

      app-catalog .skeleton-header {
        display: flex;
        gap: var(--space-3);
        align-items: flex-start;
      }

      app-catalog .skeleton-title-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      app-catalog .skeleton-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      app-catalog .skeleton-chips {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }

      app-catalog .skeleton-footer {
        margin-top: auto;
      }
    `,
  ],
})
export class CatalogSkeletonComponent {
  private translationService = inject(TranslationService);

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
