/**
 * Mobile (<= 480 px) feature-grouped comparison list of the catalog compare view.
 *
 * Markup only: the rules live in CatalogCompareViewComponent (created first,
 * so their order in the document is the one the single page component had).
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ChipModule } from '@openng/optimus-ui/chip';
import { TranslationService } from '../../services/translation.service';
import { CatalogToolEntry } from '../../models/catalog.model';
import { CatalogEntryPresenter } from './catalog-entry-presenter.service';

@Component({
  selector: 'app-catalog-compare-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, ChipModule],
  template: `
    <!-- Mobile Feature-Grouped Layout -->
    <div class="mobile-compare-list">
      <div class="mobile-tools-header">
        <h4>{{ translate('catalog.compare.title') }}</h4>
        <div class="mobile-tool-names">
          @for (tool of tools(); track p.trackByEntry($index, tool)) {
            <div class="mobile-tool-name">
              <span>{{ tool.name }}</span>
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
          }
        </div>
      </div>
      <!-- Rating Feature Group -->
      <div class="mobile-feature-group">
        <div class="mobile-feature-header">
          <h4>{{ translate('catalog.compare.rating') }}</h4>
        </div>
        <div class="mobile-feature-values">
          @for (tool of tools(); track tool) {
            <div class="mobile-tool-value">
              <span class="tool-name">{{ tool.name }}</span>
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
                      'font-size': '0.9rem',
                    }"
                  ></i>
                }
                <span class="rating-number" aria-hidden="true">({{ tool.rating }})</span>
              </div>
            </div>
          }
        </div>
      </div>
      <!-- Pricing Feature Group -->
      <div class="mobile-feature-group">
        <div class="mobile-feature-header">
          <h4>{{ translate('catalog.compare.pricing') }}</h4>
        </div>
        <div class="mobile-feature-values">
          @for (tool of tools(); track tool) {
            <div class="mobile-tool-value">
              <span class="tool-name">{{ tool.name }}</span>
              <p-chip [label]="p.getPricingLabel(tool.pricing)" [style]="p.getPricingChipStyle(tool.pricing)"></p-chip>
            </div>
          }
        </div>
      </div>
      <!-- Difficulty Feature Group -->
      <div class="mobile-feature-group">
        <div class="mobile-feature-header">
          <h4>{{ translate('catalog.compare.difficulty') }}</h4>
        </div>
        <div class="mobile-feature-values">
          @for (tool of tools(); track tool) {
            <div class="mobile-tool-value">
              <span class="tool-name">{{ tool.name }}</span>
              <p-chip
                [label]="p.getDifficultyLabel(tool.difficulty)"
                [style]="p.getDifficultyChipStyle(tool.difficulty)"
              ></p-chip>
            </div>
          }
        </div>
      </div>
      <!-- Deployment Feature Group -->
      <div class="mobile-feature-group">
        <div class="mobile-feature-header">
          <h4>{{ translate('catalog.compare.deployment') }}</h4>
        </div>
        <div class="mobile-feature-values">
          @for (tool of tools(); track tool) {
            <div class="mobile-tool-value">
              <span class="tool-name">{{ tool.name }}</span>
              <p-chip
                [label]="p.getDeploymentLabel(tool.deployment)"
                [style]="p.getDeploymentChipStyle(tool.deployment)"
              ></p-chip>
            </div>
          }
        </div>
      </div>
      <!-- Features Feature Group -->
      <div class="mobile-feature-group">
        <div class="mobile-feature-header">
          <h4>{{ translate('catalog.compare.features') }}</h4>
        </div>
        <div class="mobile-feature-values">
          @for (tool of tools(); track tool) {
            @let mfeats = tool.features ?? [];
            <div class="mobile-tool-value mobile-features-row">
              <div class="mobile-tool-name-section">
                <span class="tool-name">{{ tool.name }}</span>
              </div>
              <div class="mobile-features-section">
                <div class="mobile-features-list">
                  @for (feature of mfeats.slice(0, 3); track feature) {
                    <p-chip [label]="feature" [style]="{ 'font-size': '0.7rem', margin: '0.1rem' }"></p-chip>
                  }
                  @if (mfeats.length > 3) {
                    <span class="more-features"> +{{ mfeats.length - 3 }} {{ translate('catalog.tags.more') }} </span>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <!-- Use Cases Feature Group -->
      <div class="mobile-feature-group">
        <div class="mobile-feature-header">
          <h4>{{ translate('catalog.compare.useCases') }}</h4>
        </div>
        <div class="mobile-feature-values">
          @for (tool of tools(); track tool) {
            @let mcases = tool.useCases ?? [];
            <div class="mobile-tool-value">
              <span class="tool-name">{{ tool.name }}</span>
              <div class="mobile-usecases">
                @for (useCase of mcases.slice(0, 2); track useCase; let last = $last) {
                  <span>
                    {{ useCase }}
                    @if (!last) {
                      <span>, </span>
                    }
                  </span>
                }
                @if (mcases.length > 2) {
                  <span class="more-usecases"> ... +{{ mcases.length - 2 }} {{ translate('catalog.tags.more') }} </span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CatalogCompareListComponent {
  private translationService = inject(TranslationService);
  protected readonly p = inject(CatalogEntryPresenter);

  readonly tools = input.required<CatalogToolEntry[]>();
  /** "Remove from comparison" on one tool. */
  readonly removed = output<string>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
