/**
 * Desktop/tablet comparison table of the catalog compare view.
 *
 * Markup only: the rules live in CatalogCompareViewComponent (created first,
 * so their order in the document is the one the single page component had).
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ChipModule } from '@openng/optimus-ui/chip';
import { TranslationService } from '../../services/translation.service';
import { HighlightDirective } from '../../directives/highlight.directive';
import { CatalogToolEntry } from '../../models/catalog.model';
import { CatalogEntryPresenter } from './catalog-entry-presenter.service';

@Component({
  selector: 'app-catalog-compare-table',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, ChipModule, HighlightDirective],
  template: `
    <!-- Desktop/Tablet Table View -->
    <div class="compare-table-container desktop-table">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="feature-column" scope="col">{{ translate('catalog.compare.feature') }}</th>
            @for (tool of tools(); track p.trackByEntry($index, tool)) {
              <th class="tool-column" scope="col">
                <div class="tool-header">
                  <h3 [appHighlight]="tool.name">{{ tool.name }}</h3>
                  <p-button
                    icon="pi pi-times"
                    severity="danger"
                    size="small"
                    [rounded]="true"
                    [text]="true"
                    [ariaLabel]="translate('catalog.actions.removeCompare') + ': ' + tool.name"
                    (click)="removed.emit(tool.id)"
                  ></p-button>
                </div>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          <tr class="rating-row">
            <th class="feature-label" scope="row">{{ translate('catalog.compare.rating') }}</th>
            @for (tool of tools(); track tool) {
              <td class="tool-data">
                <div
                  class="rating-display"
                  role="img"
                  [attr.aria-label]="translate('catalog.compare.rating') + ': ' + (tool.rating || 0) + '/5'"
                >
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <i
                      class="pi"
                      aria-hidden="true"
                      [class.pi-star-fill]="star <= (tool.rating || 0)"
                      [class.pi-star]="star > (tool.rating || 0)"
                      [style]="{
                        color: star <= (tool.rating || 0) ? 'var(--primary-color)' : 'var(--surface-300)',
                        'font-size': '1rem',
                      }"
                    ></i>
                  }
                  <span class="rating-number" aria-hidden="true">({{ tool.rating }})</span>
                </div>
              </td>
            }
          </tr>
          <tr class="pricing-row">
            <th class="feature-label" scope="row">{{ translate('catalog.compare.pricing') }}</th>
            @for (tool of tools(); track tool) {
              <td class="tool-data">
                <p-chip
                  [label]="p.getPricingLabel(tool.pricing)"
                  [style]="p.getPricingChipStyle(tool.pricing)"
                ></p-chip>
              </td>
            }
          </tr>
          <tr class="difficulty-row">
            <th class="feature-label" scope="row">{{ translate('catalog.compare.difficulty') }}</th>
            @for (tool of tools(); track tool) {
              <td class="tool-data">
                <p-chip
                  [label]="p.getDifficultyLabel(tool.difficulty)"
                  [style]="p.getDifficultyChipStyle(tool.difficulty)"
                ></p-chip>
              </td>
            }
          </tr>
          <tr class="deployment-row">
            <th class="feature-label" scope="row">{{ translate('catalog.compare.deployment') }}</th>
            @for (tool of tools(); track tool) {
              <td class="tool-data">
                <p-chip
                  [label]="p.getDeploymentLabel(tool.deployment)"
                  [style]="p.getDeploymentChipStyle(tool.deployment)"
                ></p-chip>
              </td>
            }
          </tr>
          <tr class="features-row">
            <th class="feature-label" scope="row">{{ translate('catalog.compare.features') }}</th>
            @for (tool of tools(); track tool) {
              @let feats = tool.features ?? [];
              <td class="tool-data">
                <ul class="feature-list">
                  @for (feature of feats.slice(0, 4); track feature) {
                    <li>{{ feature }}</li>
                  }
                  @if (feats.length > 4) {
                    <li class="more-features">+{{ feats.length - 4 }} {{ translate('catalog.tags.more') }}</li>
                  }
                </ul>
              </td>
            }
          </tr>
          <tr class="usecases-row">
            <th class="feature-label" scope="row">{{ translate('catalog.compare.useCases') }}</th>
            @for (tool of tools(); track tool) {
              @let cases = tool.useCases ?? [];
              <td class="tool-data">
                <div class="usecases-display">
                  @for (useCase of cases.slice(0, 3); track useCase; let last = $last) {
                    <span>
                      {{ useCase }}
                      @if (!last) {
                        <span>, </span>
                      }
                    </span>
                  }
                  @if (cases.length > 3) {
                    <span class="more-usecases">
                      ... +{{ cases.length - 3 }} {{ translate('catalog.tags.more') }}
                    </span>
                  }
                </div>
              </td>
            }
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class CatalogCompareTableComponent {
  private translationService = inject(TranslationService);
  protected readonly p = inject(CatalogEntryPresenter);

  readonly tools = input.required<CatalogToolEntry[]>();
  /** "Remove from comparison" on one tool. */
  readonly removed = output<string>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
