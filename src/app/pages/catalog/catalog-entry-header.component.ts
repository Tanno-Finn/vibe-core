/**
 * Header of the catalog details drawer: title, entry type, close button,
 * rating, the three type-specific chips, and the visit / share actions.
 *
 * Markup only: its rules stay in CatalogDetailsDrawerComponent under the
 * `catalog-details-sidebar` style class, in their original order.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject, input, output } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TranslationService } from '../../services/translation.service';
import { CatalogEntry } from '../../models/catalog.model';
import { CatalogEntryPresenter } from './catalog-entry-presenter.service';

@Component({
  selector: 'app-catalog-entry-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
  template: `
    <div class="sidebar-header">
      <div class="sidebar-header-top">
        <div class="sidebar-header-left">
          <div class="sidebar-title-row">
            <h2 class="entry-sidebar-title">{{ p.getEntryDisplayName(selectedEntry()!) }}</h2>
            <div
              class="entry-type-indicator"
              [class.indicator-tool]="selectedEntry()!.entryType === 'tool'"
              [class.indicator-resource]="selectedEntry()!.entryType === 'resource'"
            >
              <i [class]="selectedEntry()!.entryType === 'tool' ? 'pi pi-wrench' : 'pi pi-book'"></i>
              {{
                selectedEntry()!.entryType === 'tool'
                  ? translate('catalog.entryType.tool')
                  : translate('catalog.entryType.resource')
              }}
            </div>
          </div>
        </div>
        <button
          class="sidebar-close-btn"
          [attr.aria-label]="translate('catalog.buttons.close')"
          (click)="closed.emit(); $event.stopPropagation()"
        >
          <i class="pi pi-times" aria-hidden="true"></i>
        </button>
      </div>
      <div class="sidebar-header-meta">
        <div
          class="entry-sidebar-rating"
          role="img"
          [attr.aria-label]="translate('catalog.compare.rating') + ': ' + (selectedEntry()?.rating || 0) + '/5'"
        >
          @for (star of [1, 2, 3, 4, 5]; track star) {
            <i
              class="pi"
              aria-hidden="true"
              [class.pi-star-fill]="star <= (selectedEntry()?.rating || 0)"
              [class.pi-star]="star > (selectedEntry()?.rating || 0)"
              [style]="{
                color: star <= (selectedEntry()?.rating || 0) ? 'var(--primary-color)' : 'var(--surface-300)',
                'font-size': '0.85rem',
              }"
            ></i>
          }
          <span class="rating-value" aria-hidden="true">({{ selectedEntry()?.rating }}/5)</span>
        </div>
        @if (selectedEntry()!.entryType === 'tool') {
          <div class="entry-sidebar-chips">
            <div class="drawer-chip" [style.color]="p.getPricingColor(p.asToolEntry(selectedEntry()!).pricing)">
              <i [class]="'pi ' + p.getPricingIcon(p.asToolEntry(selectedEntry()!).pricing)"></i>
              {{ p.getPricingLabel(p.asToolEntry(selectedEntry()!).pricing) }}
            </div>
            <div class="drawer-chip" [style.color]="p.getDeploymentColor(p.asToolEntry(selectedEntry()!).deployment)">
              <i [class]="'pi ' + p.getDeploymentIcon(p.asToolEntry(selectedEntry()!).deployment)"></i>
              {{ p.getDeploymentLabel(p.asToolEntry(selectedEntry()!).deployment) }}
            </div>
            <div class="drawer-chip" [style.color]="p.getDifficultyColorSimple(selectedEntry()!.difficulty)">
              <i [class]="'pi ' + p.getDifficultyIcon(selectedEntry()!.difficulty)"></i>
              {{ p.getDifficultyLabel(selectedEntry()!.difficulty) }}
            </div>
          </div>
        }
        @if (selectedEntry()!.entryType === 'resource') {
          <div class="entry-sidebar-chips">
            <div class="drawer-chip" [style.color]="p.getMediaTypeColor(p.asResourceEntry(selectedEntry()!).mediaType)">
              <i [class]="'pi ' + p.getMediaTypeIcon(p.asResourceEntry(selectedEntry()!).mediaType)"></i>
              {{ translate('aiResources.mediaType.' + p.asResourceEntry(selectedEntry()!).mediaType) }}
            </div>
            <div class="drawer-chip" [style.color]="p.getTopicColor(p.asResourceEntry(selectedEntry()!).topic)">
              <i [class]="'pi ' + p.getTopicIcon(p.asResourceEntry(selectedEntry()!).topic)"></i>
              {{ translate('aiResources.topic.' + p.asResourceEntry(selectedEntry()!).topic) }}
            </div>
            <div
              class="drawer-chip"
              [style.color]="p.getResourceDifficultyColor(p.asResourceEntry(selectedEntry()!).difficulty)"
            >
              <i [class]="'pi ' + p.getDifficultyIcon(p.asResourceEntry(selectedEntry()!).difficulty)"></i>
              {{ translate('aiResources.difficulty.' + p.asResourceEntry(selectedEntry()!).difficulty) }}
            </div>
          </div>
        }
        <div class="sidebar-header-actions">
          <p-button
            [label]="translate('catalog.buttons.visitSource')"
            icon="pi pi-external-link"
            severity="primary"
            size="small"
            (click)="p.openEntry(selectedEntry()?.url || ''); $event.stopPropagation()"
          ></p-button>
          <p-button
            [label]="translate('catalog.buttons.share')"
            icon="pi pi-share-alt"
            severity="secondary"
            size="small"
            (onClick)="p.shareEntry(selectedEntry()!)"
          ></p-button>
        </div>
      </div>
    </div>
  `,
})
export class CatalogEntryHeaderComponent {
  private translationService = inject(TranslationService);
  protected readonly p = inject(CatalogEntryPresenter);

  /** Never null while rendered; typed like the drawer's input so the markup moved unchanged. */
  readonly selectedEntry = input.required<CatalogEntry | null>();
  /** The close button was pressed. */
  readonly closed = output<void>();

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
