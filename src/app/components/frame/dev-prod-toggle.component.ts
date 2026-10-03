/**
 * Dev-only toggle between the dev view and a simulated production view
 * (DevModeService). Rendered only when dev tools are shown.
 */
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { DevModeService } from '../../services/dev-mode.service';

@Component({
  selector: 'app-dev-prod-toggle',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="dev-prod-toggle"
      [class.active]="devModeService.simulateProd()"
      (click)="devModeService.toggle()"
      [attr.aria-label]="devModeService.simulateProd() ? 'Prod-Simulation aktiv' : 'Dev-Modus'"
      [attr.title]="
        devModeService.simulateProd()
          ? 'Prod-Simulation aktiv — klicken für Dev'
          : 'Dev-Modus — klicken für Prod-Simulation'
      "
    >
      <i [class]="devModeService.simulateProd() ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
      <span class="dev-toggle-label">{{ devModeService.simulateProd() ? 'PROD' : 'DEV' }}</span>
    </button>
  `,
  styles: [
    `
      app-dev-prod-toggle {
        display: contents;
      }

      /* Dev-only: Prod simulation toggle */
      /* WCAG 1.4.3: colors via theme-aware CSS variables defined in styles.scss
       (direct :host-context rules fail due to Angular ViewEncapsulation specificity) */
      app-root .dev-prod-toggle {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.4rem 0.75rem;
        border-radius: 20px;
        border: 2px solid var(--dev-toggle-border);
        background: color-mix(in srgb, var(--dev-toggle-border) 15%, var(--surface-card));
        color: var(--dev-toggle-fg);
        font-size: 0.75rem;
        font-weight: 700;
        cursor: pointer;
        /* Was 0.85 — opacity on the parent collapses the label color with
         the tinted bg, which axe reads as foreground #38935a → 3.4:1 contrast
         (under AA 4.5:1). Toggle is dev-only anyway, full opacity is fine. */
        opacity: 1;
        transition: all 0.2s ease;
        font-family: monospace;
      }

      /* Explicitly set color on the label span so axe reads the computed value on the element */
      app-root .dev-prod-toggle .dev-toggle-label {
        color: var(--dev-toggle-fg);
      }

      app-root .dev-prod-toggle.active {
        border-color: var(--dev-toggle-border-active);
        background: color-mix(in srgb, var(--dev-toggle-border-active) 15%, var(--surface-card));
        color: var(--dev-toggle-fg-active);
      }

      app-root .dev-prod-toggle.active .dev-toggle-label {
        color: var(--dev-toggle-fg-active);
      }

      app-root .dev-prod-toggle i {
        font-size: 0.85rem;
      }
    `,
  ],
})
export class DevProdToggleComponent {
  protected readonly devModeService = inject(DevModeService);
}
