import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../services/translation.service';
import { PageHeaderComponent } from '../components/shared/page-header.component';
import { VIBE_DEV_SENTINEL } from './dev-sentinel';

/**
 * /dev — the Workshop hub (SPEC N5, decision D1).
 *
 * Landing page for the dev-only workshop area. Links out to the design-system
 * gallery (/dev/design) and the agent entry page (/dev/agents).
 *
 * UI CONVENTIONS: this page deliberately mirrors the app's page anatomy —
 * `app-page-header` for the single <h1>, `--container-*` width tokens, card
 * surfaces on `--surface-card` with `--surface-border`, text-tier brand color
 * via `--primary-color-fg` (contrast-adjusted by ThemeService) and icon-tier
 * via `--primary-color-icon-fg`. The workshop is the design system's shop
 * window, so it follows the same conventions it documents. No ad-hoc
 * breadcrumbs — navigation runs through the app nav like everywhere else.
 *
 * i18n: workshop chrome resolves through TranslationService (namespace
 * `devWorkshop`, de/en/de-easy/en-easy). Only the canonical component docs
 * under src/assets/design-system/ stay English (agent-canonical source).
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking in dev builds (see dev-sentinel.ts).
 */
@Component({
  selector: 'app-dev-hub',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <div class="dev-hub" [attr.data-dev-sentinel]="sentinel">
      <app-page-header titleKey="devWorkshop.hub.title" subtitleKey="devWorkshop.hub.subtitle">
        <p class="dev-hub__badge-row">
          <span class="dev-badge">
            <i class="pi pi-wrench" aria-hidden="true"></i>
            {{ labels().devOnly }}
          </span>
        </p>
      </app-page-header>

      <ul class="dev-hub__grid">
        <li>
          <a class="dev-card" routerLink="/dev/design">
            <i class="dev-card__icon pi pi-palette" aria-hidden="true"></i>
            <span class="dev-card__body">
              <span class="dev-card__title">{{ labels().designTitle }}</span>
              <span class="dev-card__desc">{{ labels().designDesc }}</span>
            </span>
            <i class="dev-card__go pi pi-arrow-right" aria-hidden="true"></i>
          </a>
        </li>
        <li>
          <a class="dev-card" routerLink="/dev/agents">
            <i class="dev-card__icon pi pi-map" aria-hidden="true"></i>
            <span class="dev-card__body">
              <span class="dev-card__title">{{ labels().agentsTitle }}</span>
              <span class="dev-card__desc">{{ labels().agentsDesc }}</span>
            </span>
            <i class="dev-card__go pi pi-arrow-right" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .dev-hub {
      max-width: var(--container-component);
      margin: 0 auto;
      padding: 0 1.5rem 1.5rem;
    }
    .dev-hub__badge-row { margin: 0.75rem 0 0; }
    .dev-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-card));
      border: 1px solid color-mix(in srgb, var(--primary-color) 30%, var(--surface-border));
      color: var(--text-color);
      font-size: 0.8125rem;
      line-height: 1.2;
    }
    .dev-badge .pi {
      font-size: 0.75rem;
      color: var(--primary-color-icon-fg);
    }
    .dev-hub__grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--space-4);
      grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
    }
    .dev-card {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      height: 100%;
      padding: var(--space-5);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      background: var(--surface-card);
      color: inherit;
      text-decoration: none;
      box-shadow: var(--shadow-sm);
      transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
    }
    .dev-card:hover {
      border-color: var(--primary-color-fg);
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }
    .dev-card:focus-visible {
      outline: 2px solid var(--primary-color-fg);
      outline-offset: 2px;
    }
    .dev-card__icon {
      font-size: 1.375rem;
      line-height: 1.4;
      color: var(--primary-color-icon-fg);
      flex: 0 0 auto;
    }
    .dev-card__body { display: flex; flex-direction: column; gap: var(--space-2); }
    .dev-card__title {
      font-weight: var(--font-weight-medium);
      font-size: 1.125rem;
      color: var(--text-color);
    }
    .dev-card__desc {
      color: var(--text-color-secondary);
      font-size: var(--font-size-sm);
      line-height: 1.5;
    }
    .dev-card__go {
      margin-left: auto;
      align-self: center;
      color: var(--primary-color-icon-fg);
      font-size: 1rem;
    }
    @media (prefers-reduced-motion: reduce) {
      .dev-card { transition: none; }
      .dev-card:hover { transform: none; }
    }
  `],
})
export class DevHubComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly i18n = inject(TranslationService);

  /** Reactive workshop-chrome labels (recompute on language switch). */
  readonly labels = computed(() => ({
    devOnly: this.i18n.translate('devWorkshop.common.devOnlyBadge'),
    designTitle: this.i18n.translate('devWorkshop.hub.designTitle'),
    designDesc: this.i18n.translate('devWorkshop.hub.designDesc'),
    agentsTitle: this.i18n.translate('devWorkshop.hub.agentsTitle'),
    agentsDesc: this.i18n.translate('devWorkshop.hub.agentsDesc'),
  }));
}
