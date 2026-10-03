/**
 * Quick filter toggles of the catalog (top rated, free & German, only
 * favorites), projected into the filter card. Each is a pressed/unpressed
 * toggle button; the page owns which ones are active.
 *
 * Markup only: the `.quick-filters*` rules stay in CatalogComponent.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-catalog-quick-filters',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
  template: `
    <div class="quick-filters-section">
      <div class="quick-filters">
        <p-button
          [label]="translate('catalog.quickFilters.topRated')"
          icon="pi pi-star"
          severity="secondary"
          size="small"
          [outlined]="!active().has('topRated')"
          [attr.aria-pressed]="active().has('topRated')"
          (click)="toggled.emit('topRated')"
        ></p-button>
        <p-button
          [label]="translate('catalog.quickFilters.freeAndGerman')"
          icon="pi pi-check-circle"
          severity="secondary"
          size="small"
          [outlined]="!active().has('freeAndGerman')"
          [attr.aria-pressed]="active().has('freeAndGerman')"
          (click)="toggled.emit('freeAndGerman')"
        ></p-button>
        <p-button
          [label]="translate('catalog.quickFilters.onlyFavorites') + ' (' + favoriteCount() + ')'"
          icon="pi pi-heart-fill"
          severity="secondary"
          size="small"
          [outlined]="!active().has('onlyFavorites')"
          [attr.aria-pressed]="active().has('onlyFavorites')"
          [disabled]="favoriteCount() === 0"
          (click)="toggled.emit('onlyFavorites')"
        ></p-button>
      </div>
    </div>
  `,
  styles: [
    `
      app-catalog-quick-filters {
        display: contents;
      }
    `,
  ],
})
export class CatalogQuickFiltersComponent {
  private translationService = inject(TranslationService);

  /** The quick filters currently on. */
  readonly active = input.required<ReadonlySet<string>>();
  readonly favoriteCount = input.required<number>();

  readonly toggled = output<string>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
