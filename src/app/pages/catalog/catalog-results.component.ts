/**
 * Result list of the catalog — the count, the sort switch and the card grid.
 *
 * The page hands in the entries to show (already filtered, sorted and
 * paginated) and owns the sort order through a two-way `sortOrder` model.
 * The per-card chips, meta line and actions are built here from the entry
 * and the favorite/compare state in CatalogStateService, once per change,
 * not per change-detection pass.
 */
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { TranslationService } from '../../services/translation.service';
import { GenericCardComponent, CardAction, CardChip } from '../../components/ui/generic-card.component';
import { HighlightDirective } from '../../directives/highlight.directive';
import { CatalogEntry } from '../../models/catalog.model';
import { CatalogCardMeta, CatalogEntryPresenter } from './catalog-entry-presenter.service';
import { CatalogStateService } from './catalog-state.service';
import { CatalogSortOrder } from './catalog-filtering';

interface CardData {
  chips: CardChip[];
  meta: CatalogCardMeta[];
  headerActions: CardAction[];
  primaryActions: CardAction[];
  secondaryActions: CardAction[];
}

@Component({
  selector: 'app-catalog-results',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, SelectButtonModule, GenericCardComponent, HighlightDirective],
  template: `
    <div id="catalog-results" class="catalog-content">
      <!-- Results Header -->
      <div class="results-header">
        <div class="results-count" role="status" aria-live="polite">
          <span appHighlight>
            {{ translate('catalog.results.showing') }}
            {{ entries().length }}
            {{ translate('catalog.results.of') }}
            {{ total() }}
            {{ translate('catalog.results.entries') }}
          </span>
        </div>
        <div class="sort-section">
          <span class="sort-label">{{ translate('catalog.sort.label') }}</span>
          <p-selectbutton
            [options]="[
              { label: translate('catalog.sort.rating'), value: 'rating', icon: 'pi pi-star' },
              {
                label: translate('catalog.sort.alphabetical'),
                value: 'alphabetical',
                icon: 'pi pi-sort-alpha-down',
              },
              { label: translate('catalog.sort.newest'), value: 'newest', icon: 'pi pi-clock' },
            ]"
            [ngModel]="sortOrder()"
            (ngModelChange)="sortOrder.set($event)"
            optionLabel="label"
            optionValue="value"
            [attr.aria-label]="translate('catalog.sort.label')"
            class="sort-buttons"
          >
          </p-selectbutton>
        </div>
      </div>

      <!-- Card Grid -->
      <div class="catalog-grid">
        @for (entry of entries(); track p.trackByEntry($index, entry)) {
          <app-generic-card
            [title]="p.getEntryDisplayName(entry)"
            [headingLevel]="2"
            [description]="entry.shortDescription"
            [icon]="p.getEntryIcon(entry)"
            [iconColor]="p.getEntryIconColor(entry)"
            [rating]="entry.rating"
            [chips]="cardDataMap().get(entry.id)?.chips || []"
            [metaInfo]="cardDataMap().get(entry.id)?.meta || []"
            [headerActions]="cardDataMap().get(entry.id)?.headerActions || []"
            [primaryActions]="cardDataMap().get(entry.id)?.primaryActions || []"
            [secondaryActions]="cardDataMap().get(entry.id)?.secondaryActions || []"
            [hoverable]="true"
            [attr.aria-label]="p.getEntryDisplayName(entry)"
            tabindex="0"
            (click)="opened.emit(entry)"
            (keydown.enter)="opened.emit(entry)"
            (keydown.space)="opened.emit(entry); $event.preventDefault()"
            [style]="{ cursor: 'pointer' }"
          ></app-generic-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      app-catalog-results {
        display: contents;
      }

      /* Results Header */
      app-catalog .results-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--surface-border);
      }

      app-catalog .results-count {
        font-size: 1rem;
        color: var(--text-color-secondary);
        font-weight: 500;
      }

      app-catalog .sort-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      app-catalog .sort-label {
        font-weight: 600;
        color: var(--text-color);
        white-space: nowrap;
        font-size: 0.9rem;
      }

      /* .sort-buttons is the host class of the group itself, so it is not an
         ancestor of .p-selectbutton; the segments are .p-togglebutton. */
      app-catalog .sort-buttons .p-togglebutton {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
      }

      /* Favorite and Compare button styling */
      app-catalog .catalog-grid .favorite-active .p-button-icon {
        color: var(--text-color);
      }

      app-catalog .catalog-grid .favorite-active:hover .p-button-icon {
        color: var(--text-color);
      }

      app-catalog .catalog-grid .compare-active .p-button-icon {
        color: var(--green-500);
      }

      app-catalog .catalog-grid .compare-active:hover .p-button-icon {
        color: var(--green-600);
      }

      /* Sort Button Focus Indicator */
      app-catalog .sort-buttons .p-togglebutton:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        app-catalog .results-header {
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }

        app-catalog .sort-label {
          display: none;
        }

        app-catalog .sort-section {
          gap: 0.5rem;
          justify-content: center;
          max-width: 100%;
          overflow: hidden;
        }

        app-catalog .sort-section p-selectbutton {
          display: flex !important;
          flex-wrap: wrap !important;
          max-width: 100%;
          gap: 4px;
        }

        app-catalog .sort-section p-togglebutton {
          flex: 1 1 auto;
          min-width: 0;
        }
      }
    `,
  ],
})
export class CatalogResultsComponent {
  private translationService = inject(TranslationService);
  private state = inject(CatalogStateService);
  protected readonly p = inject(CatalogEntryPresenter);

  /** The entries to render, in display order. */
  readonly entries = input.required<CatalogEntry[]>();
  /** How many entries match the filters in total (the "of N" count). */
  readonly total = input.required<number>();
  readonly sortOrder = model.required<CatalogSortOrder>();

  /** A card was activated (click, Enter or Space). */
  readonly opened = output<CatalogEntry>();

  // Pre-computed card data for all displayed entries (avoids method calls per CD cycle)
  cardDataMap = computed(() => {
    const displayed = this.entries();
    // Access reactive dependencies so the computed re-evaluates when favorites/compare change
    void this.state.favoriteEntries();
    void this.state.compareTools();
    const map = new Map<string, CardData>();
    for (const entry of displayed) {
      map.set(entry.id, {
        chips: this.p.getEntryChips(entry),
        meta: this.p.getEntryMeta(entry),
        headerActions: this.getEntryHeaderActions(entry),
        primaryActions: this.getEntryPrimaryActions(entry),
        secondaryActions: this.getEntrySecondaryActions(entry),
      });
    }
    return map;
  });

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // --- Card Actions ---

  getEntryHeaderActions(entry: CatalogEntry): CardAction[] {
    const isFavorite = this.state.favoriteEntries().has(entry.id);
    const actions: CardAction[] = [
      {
        icon: isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart',
        severity: 'secondary' as const,
        text: true,
        outlined: !isFavorite,
        styleClass: isFavorite ? 'favorite-active' : '',
        tooltip: isFavorite
          ? this.translate('catalog.actions.removeFavorite')
          : this.translate('catalog.actions.favorite'),
        action: () => this.state.toggleFavorite(entry.id),
      },
    ];

    // Compare toggle only for tools
    if (entry.entryType === 'tool') {
      const isInCompare = this.state.compareTools().has(entry.id);
      actions.push({
        icon: isInCompare ? 'pi pi-check-circle' : 'pi pi-plus-circle',
        severity: 'secondary' as const,
        text: true,
        outlined: !isInCompare,
        styleClass: isInCompare ? 'compare-active' : '',
        disabled: !isInCompare && this.state.compareTools().size >= 3,
        tooltip: isInCompare
          ? this.translate('catalog.actions.removeCompare')
          : this.translate('catalog.actions.compare'),
        action: () => this.state.toggleCompare(entry.id),
      });
    }

    return actions;
  }

  getEntryPrimaryActions(entry: CatalogEntry): CardAction[] {
    return [
      {
        icon: 'pi pi-external-link',
        label: this.translate('catalog.buttons.visitSource'),
        severity: 'primary' as const,
        action: () => this.p.openEntry(entry.url),
      },
    ];
  }

  getEntrySecondaryActions(entry: CatalogEntry): CardAction[] {
    return [
      {
        icon: 'pi pi-share-alt',
        label: this.translate('common.share'),
        severity: 'secondary' as const,
        outlined: true,
        action: () => this.p.shareEntry(entry),
      },
    ];
  }
}
