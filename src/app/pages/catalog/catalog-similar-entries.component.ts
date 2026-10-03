/**
 * "Similar tools" / "Similar resources" card of the catalog details drawer.
 * One list for both entry types; only the two chips per row differ.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { TranslationService } from '../../services/translation.service';
import { CatalogEntry } from '../../models/catalog.model';
import { CatalogEntryPresenter } from './catalog-entry-presenter.service';

@Component({
  selector: 'app-catalog-similar-entries',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="info-card similar-tools-card">
      <div class="detail-card-header">
        <i class="pi pi-objects-column header-icon"></i>
        <h4>{{ translate(titleKey()) }}</h4>
      </div>
      @if (entries().length > 0) {
        <div class="similar-tools-list">
          @for (entry of entries(); track entry) {
            <div
              class="similar-tool-item"
              tabindex="0"
              role="button"
              (click)="opened.emit(entry)"
              (keydown.enter)="opened.emit(entry)"
              (keydown.space)="opened.emit(entry); $event.preventDefault()"
            >
              <div class="similar-tool-left">
                <span class="similar-tool-name">{{ p.getEntryDisplayName(entry) }}</span>
                <div
                  class="similar-tool-rating"
                  role="img"
                  [attr.aria-label]="translate('catalog.compare.rating') + ': ' + (entry.rating || 0) + '/5'"
                >
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <i
                      class="pi"
                      aria-hidden="true"
                      [class.pi-star-fill]="star <= (entry.rating || 0)"
                      [class.pi-star]="star > (entry.rating || 0)"
                      [style]="{
                        color: star <= (entry.rating || 0) ? 'var(--primary-color)' : 'var(--surface-300)',
                        'font-size': '0.75rem',
                      }"
                    ></i>
                  }
                  <span class="rating-value" aria-hidden="true">({{ entry.rating }})</span>
                </div>
              </div>
              <div class="similar-tool-center">
                @if (entry.entryType === 'tool') {
                  <div class="drawer-chip" [style.color]="p.getPricingColor(p.asToolEntry(entry).pricing)">
                    <i [class]="'pi ' + p.getPricingIcon(p.asToolEntry(entry).pricing)"></i>
                    {{ p.getPricingLabel(p.asToolEntry(entry).pricing) }}
                  </div>
                  <div class="drawer-chip" [style.color]="p.getDifficultyColorSimple(entry.difficulty)">
                    <i [class]="'pi ' + p.getDifficultyIcon(entry.difficulty)"></i>
                    {{ p.getDifficultyLabel(entry.difficulty) }}
                  </div>
                } @else {
                  <div class="drawer-chip" [style.color]="p.getMediaTypeColor(p.asResourceEntry(entry).mediaType)">
                    <i [class]="'pi ' + p.getMediaTypeIcon(p.asResourceEntry(entry).mediaType)"></i>
                    {{ translate('aiResources.mediaType.' + p.asResourceEntry(entry).mediaType) }}
                  </div>
                  <div class="drawer-chip" [style.color]="p.getResourceDifficultyColor(entry.difficulty)">
                    <i [class]="'pi ' + p.getDifficultyIcon(entry.difficulty)"></i>
                    {{ translate('aiResources.difficulty.' + entry.difficulty) }}
                  </div>
                }
              </div>
              <div class="similar-tool-right"><i class="pi pi-angle-right"></i></div>
            </div>
          }
        </div>
      } @else {
        <p class="no-similar-tools">{{ translate(emptyKey()) }}</p>
      }
    </div>
  `,
  styles: [
    `
      app-catalog-similar-entries {
        display: contents;
      }

      /* Similar Tools/Resources */
      .catalog-details-sidebar .similar-tools-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .catalog-details-sidebar .similar-tool-item {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: start;
        padding: 0.75rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--border-radius);
        background: var(--surface-card);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .catalog-details-sidebar .similar-tool-item:hover,
      .catalog-details-sidebar .similar-tool-item:focus-visible {
        border-color: var(--primary-color-fg);
        background: var(--primary-color-alpha);
        outline: 2px solid var(--primary-color-fg);
        outline-offset: -2px;
      }

      .catalog-details-sidebar .similar-tool-left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.2rem;
      }

      .catalog-details-sidebar .similar-tool-center {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 0.375rem;
        flex-wrap: wrap;
      }

      .catalog-details-sidebar .similar-tool-right {
        display: flex;
        justify-content: flex-end;
        color: var(--text-color-secondary);
      }

      .catalog-details-sidebar .similar-tool-name {
        font-weight: 600;
        color: var(--text-color);
        font-size: 1rem;
      }

      .catalog-details-sidebar .similar-tool-rating {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      .catalog-details-sidebar .no-similar-tools {
        text-align: center;
        color: var(--text-color-secondary);
        font-style: italic;
        padding: 2rem;
      }

      /* Reduced Motion Support */
      @media (prefers-reduced-motion: reduce) {
        .catalog-details-sidebar .similar-tool-item {
          transition: none;
        }

        .catalog-details-sidebar .similar-tool-item:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class CatalogSimilarEntriesComponent {
  private translationService = inject(TranslationService);
  protected readonly p = inject(CatalogEntryPresenter);

  readonly entries = input.required<CatalogEntry[]>();
  /** Card heading, e.g. 'catalog.details.similarTools'. */
  readonly titleKey = input.required<string>();
  /** Shown instead of the list when there is nothing similar. */
  readonly emptyKey = input.required<string>();

  readonly opened = output<CatalogEntry>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
