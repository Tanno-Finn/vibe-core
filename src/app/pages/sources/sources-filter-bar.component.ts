import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from '@openng/optimus-ui/button';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { SelectModule } from '@openng/optimus-ui/select';
import { ChipModule } from '@openng/optimus-ui/chip';
import { TooltipModule } from '@openng/optimus-ui/tooltip';

import { TranslationService } from '../../services/translation.service';
import { FilterOption } from './sources-filter';

/**
 * Search box, chapter and type selects, and the active-filter summary of the
 * sources page. Stateless: the three criteria are two-way model() bindings
 * owned by the page, which does the filtering itself.
 *
 * Styles stay ViewEncapsulation.None and scoped under app-sources, exactly as
 * they were when this markup lived in the page.
 */
@Component({
  selector: 'app-sources-filter-bar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonModule, InputTextModule, SelectModule, ChipModule, TooltipModule],
  template: `
    <div id="filters" class="filter-container">
      <div class="filter-controls-row">
        <!-- Search Bar -->
        <span class="p-input-icon-left search-wrapper">
          <i class="pi pi-search"></i>
          <label for="sources-search" class="sr-only">{{ translate('sources.filter.searchPlaceholder') }}</label>
          <input
            id="sources-search"
            type="text"
            pInputText
            [(ngModel)]="searchTerm"
            [placeholder]="translate('sources.filter.searchPlaceholder')"
            [attr.aria-label]="translate('sources.filter.searchPlaceholder')"
            class="search-input"
          />
        </span>

        <!-- Chapter Filter (only for book/all scope) -->
        @if (showChapterFilter()) {
          <!-- The name MUST come from [ariaLabelledBy]: p-select's focusable element is a
               <span role="combobox">, so aria-label on the host lands on a roleless
               element and the current value is announced instead of the label. -->
          <span class="sr-only" id="sources-chapter-filter-label">{{ translate('sources.filter.chapterLabel') }}</span>
          <p-select
            [options]="chapterOptions()"
            [(ngModel)]="selectedChapter"
            optionLabel="label"
            optionValue="value"
            [placeholder]="translate('sources.filter.allChapters')"
            [showClear]="true"
            [ariaLabelledBy]="'sources-chapter-filter-label'"
            styleClass="filter-dropdown"
          ></p-select>
        }

        <!-- Type Filter -->
        <span class="sr-only" id="sources-type-filter-label">{{ translate('sources.filter.typeLabel') }}</span>
        <p-select
          [options]="typeOptions()"
          [(ngModel)]="selectedType"
          optionLabel="label"
          optionValue="value"
          [placeholder]="translate('sources.filter.allTypes')"
          [showClear]="true"
          [ariaLabelledBy]="'sources-type-filter-label'"
          styleClass="filter-dropdown"
        ></p-select>

        <!-- Clear All Button -->
        @if (hasActiveFilters()) {
          <button
            pButton
            [attr.aria-label]="translate('sources.filter.clearAll')"
            class="p-button-outlined p-button-secondary clear-button"
            (click)="clearAll()"
            [pTooltip]="translate('sources.filter.clearAllTooltip')"
          >
            <i class="pi pi-filter-slash" pButtonIcon aria-hidden="true"></i
            ><span pButtonLabel>{{ translate('sources.filter.clearAll') }}</span>
          </button>
        }
      </div>

      <!-- Active Filters Display -->
      @if (hasActiveFilters()) {
        <div class="active-filters">
          <div class="active-filters-left">
            <span class="filter-label">{{ translate('sources.filter.activeFilters') }}:</span>
            @if (searchTerm()) {
              <p-chip
                [label]="translate('sources.filter.searchChip') + ': ' + searchTerm()"
                [removable]="true"
                (onRemove)="searchTerm.set('')"
              ></p-chip>
            }
            @if (selectedChapter()) {
              <p-chip
                [label]="chapterLabel(selectedChapter())"
                [removable]="true"
                (onRemove)="selectedChapter.set(null)"
              ></p-chip>
            }
            @if (selectedType()) {
              <p-chip
                [label]="typeLabel(selectedType())"
                [removable]="true"
                (onRemove)="selectedType.set(null)"
              ></p-chip>
            }
          </div>
          <!-- Silent while the sources are still loading: bound to not-yet-arrived
               data this used to announce "showing 0 of 0 sources". The skeleton
               container announces the load, this announces the result. -->
          <span class="results-count" aria-live="polite" aria-atomic="true">
            @if (totalCount() > 0) {
              {{ translate('sources.results.showing') }}
              <strong>{{ filteredCount() }}</strong>
              {{ translate('sources.results.of') }}
              <strong>{{ totalCount() }}</strong>
              {{ translate('sources.results.sources') }}
            }
          </span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      /* Filter Container */
      app-sources .filter-container {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        padding: 1.5rem;
        margin-bottom: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      app-sources .filter-controls-row {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr auto;
        gap: 1rem;
        align-items: center;
      }

      app-sources .search-wrapper {
        width: 100%;
        position: relative;
        display: flex;
        align-items: center;
      }

      app-sources .p-input-icon-left > i {
        position: absolute;
        left: 12px;
        color: var(--text-color-secondary);
        z-index: 2;
        pointer-events: none;
      }

      app-sources .search-input {
        width: 100%;
        padding-left: 2.5rem !important;
        font-size: 1rem;
        box-sizing: border-box;
      }

      app-sources .filter-dropdown {
        min-width: 150px;
        width: 100%;
      }

      /* Increase select panel height by 50% */
      app-sources .p-select-overlay .p-select-list-container {
        max-height: 300px !important; /* Default is ~200px, increased by 50% */
      }

      app-sources .clear-button {
        white-space: nowrap;
      }

      app-sources .active-filters {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface-ground);
        border-radius: var(--border-radius);
        margin-top: 1rem;
      }

      app-sources .active-filters-left {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
      }

      app-sources .filter-label {
        font-weight: 500;
        color: var(--text-color-secondary);
        font-size: 0.9rem;
      }

      app-sources .results-count {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        white-space: nowrap;
      }

      app-sources .results-count strong {
        color: var(--text-color);
        font-weight: 600;
      }

      @media (max-width: 1024px) {
        app-sources .filter-controls-row {
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        app-sources .search-wrapper {
          grid-column: 1 / -1;
        }

        app-sources .clear-button {
          grid-column: 1 / -1;
          width: 100%;
        }
      }

      @media (max-width: 768px) {
        app-sources .filter-container {
          padding: 1rem;
        }

        app-sources .filter-controls-row {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        app-sources .filter-dropdown {
          width: 100%;
        }

        app-sources .active-filters {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class SourcesFilterBarComponent {
  private translationService = inject(TranslationService);

  readonly searchTerm = model('');
  readonly selectedChapter = model<string | null>(null);
  readonly selectedType = model<string | null>(null);

  readonly showChapterFilter = input(true);
  readonly chapterOptions = input<FilterOption[]>([]);
  readonly typeOptions = input<FilterOption[]>([]);
  readonly filteredCount = input(0);
  readonly totalCount = input(0);

  readonly hasActiveFilters = computed(() => !!(this.searchTerm() || this.selectedChapter() || this.selectedType()));

  clearAll(): void {
    this.searchTerm.set('');
    this.selectedChapter.set(null);
    this.selectedType.set(null);
  }

  chapterLabel(chapterId: string | null): string {
    if (!chapterId) return '';
    // The options carry the label already resolved (translation, else the chapter's name)
    return this.chapterOptions().find((option) => option.value === chapterId)?.label ?? chapterId;
  }

  typeLabel(type: string | null): string {
    if (!type) return '';
    return this.translate(`sources.types.${type}`);
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }
}
