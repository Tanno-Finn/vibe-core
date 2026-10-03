import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/**
 * One removable chip representing a single active filter.
 *
 * Pages build their own chip list (one entry per active filter — search words are
 * split into one chip each) and handle removal by `key`.
 */
export interface ActiveFilterChip {
  /** Stable id used to identify the chip when its × is clicked. */
  key: string;
  /** Visible value text (a search word, category name, letter, date range, …). */
  label: string;
  /** OpenNG Icons class for the leading type icon, e.g. `pi pi-tag`. */
  icon: string;
  /** Full, descriptive screen-reader label for the remove (×) button. */
  removeAriaLabel: string;
}

/**
 * Presentational row of active-filter chips with a one-click × on each.
 *
 * Shared by the glossary and the AI-timeline filter sidebars so both look and
 * behave identically. Renders nothing when there are no active filters.
 */
@Component({
  selector: 'app-active-filter-chips',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (chips().length > 0) {
      <div class="active-filter-chips" role="group" [attr.aria-label]="groupLabel()">
        @for (chip of chips(); track chip.key) {
          <span class="afc-chip">
            <i [class]="'afc-chip__icon ' + chip.icon" aria-hidden="true"></i>
            <span class="afc-chip__label">{{ chip.label }}</span>
            <button
              type="button"
              class="afc-chip__remove"
              (click)="remove.emit(chip.key)"
              [attr.aria-label]="chip.removeAriaLabel"
            >
              <i class="pi pi-times" aria-hidden="true"></i>
            </button>
          </span>
        }
      </div>
    }
  `,
  styles: [
    `
      .active-filter-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }

      .afc-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        max-width: 100%;
        padding: 0.25rem 0.25rem 0.25rem 0.625rem;
        border-radius: 999px;
        background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-card));
        border: 1px solid color-mix(in srgb, var(--primary-color) 30%, var(--surface-border));
        color: var(--text-color);
        font-size: 0.8125rem;
        line-height: 1.2;
      }

      .afc-chip__icon {
        flex: 0 0 auto;
        font-size: 0.75rem;
        color: var(--primary-color);
      }

      .afc-chip__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 14rem;
      }

      .afc-chip__remove {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--text-color-secondary);
        cursor: pointer;
        transition:
          background-color 0.15s ease,
          color 0.15s ease;
      }

      .afc-chip__remove:hover {
        background: color-mix(in srgb, var(--primary-color) 20%, transparent);
        color: var(--text-color);
      }

      .afc-chip__remove:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 1px;
        color: var(--text-color);
      }

      .afc-chip__remove .pi {
        font-size: 0.6875rem;
      }
    `,
  ],
})
export class ActiveFilterChipsComponent {
  /** Active filters to render; the component hides itself when this is empty. */
  readonly chips = input.required<ActiveFilterChip[]>();
  /** Accessible group label for the chip row (e.g. "Active filters"). */
  readonly groupLabel = input<string>('');
  /** Emits the `key` of the chip whose × was clicked. */
  readonly remove = output<string>();
}
