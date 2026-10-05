/**
 * FAB Container Component
 *
 * Global container that renders all registered FABs from FabRegistryService.
 * Handles positioning, styling, animations, and responsive behavior.
 *
 * Mobile Speed Dial (≤768px, ≥3 visible FABs):
 *   Renders only a single trigger FAB at the bottom right; tapping it
 *   fans out the registered FABs upward with a 50ms stagger. Outside-click
 *   or ESC collapses the menu. Below the threshold (1-2 FABs) or on
 *   desktop, the legacy vertical stack is used.
 *
 * Place this component once in app.component.ts for global FAB management.
 */

import {
  Component,
  HostBinding,
  HostListener,
  OnInit,
  OnDestroy,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { FabRegistryService, FabRegistration } from '../../services/fab-registry.service';
import { TranslationService } from '../../services/translation.service';

const MOBILE_BREAKPOINT_PX = 768;
const SPEED_DIAL_THRESHOLD = 3;

@Component({
  selector: 'app-fab-container',
  standalone: true,
  imports: [],
  // FABs register at runtime via FabRegistryService, so the prerendered
  // @for output is built from a registration order that the client cannot
  // reproduce identically (different ngAfterViewInit timing). Hydration then
  // mis-maps tracked items, which leaves stale `pi-*` classes accumulated
  // on the icon `<i>` elements (e.g. `pi pi-list pi-megaphone`). Skip
  // hydration so the client renders this subtree fresh.
  host: { ngSkipHydration: 'true' },
  // No role="toolbar" on the stack. A toolbar promises one Tab stop and arrow
  // keys between its controls (APG Toolbar; toolbar guide), and these are
  // independent page actions — back to top, contents, feedback — each its own
  // Tab stop. The host's complementary landmark ("Actions") already names the set.
  template: `
    <div class="fab-container" [class.speed-dial-active]="speedDialActive()" [class.speed-dial-expanded]="expanded()">
      @for (fab of fabRegistry.sortedFabs(); track fab.id; let i = $index, count = $count) {
        <button
          [class]="
            'fab-button fab-' +
            fab.color +
            (fab.badge && fab.badge > 0 ? ' has-badge' : '') +
            (fab.visible === false ? ' fab-hidden' : '')
          "
          [style.--stagger-index]="count - 1 - i"
          (click)="onFabClick(fab)"
          [attr.aria-label]="t(fab.labelKey) + (fab.badge && fab.badge > 0 ? ' (' + fab.badge + ')' : '')"
          [attr.aria-haspopup]="fab.ariaHaspopup || null"
          [attr.aria-expanded]="fab.ariaExpanded ?? null"
          [attr.tabindex]="isFabFocusable(fab) ? null : -1"
          [attr.inert]="isFabFocusable(fab) ? null : ''"
          type="button"
        >
          <i [class]="'pi ' + fab.icon" aria-hidden="true"></i>
          <span class="fab-label">{{ t(fab.labelKey) }}</span>
          @if (fab.badge && fab.badge > 0) {
            <span class="fab-badge" aria-hidden="true">
              {{ fab.badge }}
            </span>
          }
        </button>
      }

      <!-- The speed-dial trigger is a disclosure: it shows and hides plain
           buttons, not a role="menu", so it carries aria-expanded and no
           aria-haspopup="menu" (that would promise menu keys that are not there). -->
      @if (speedDialActive()) {
        <button
          class="fab-button fab-default fab-trigger"
          [class.is-open]="expanded()"
          (click)="toggleExpanded($event)"
          [attr.aria-label]="t(expanded() ? 'fab.menu.closeLabel' : 'fab.menu.openLabel')"
          [attr.aria-expanded]="expanded()"
          type="button"
        >
          <span class="trigger-icon" aria-hidden="true">
            <i class="pi pi-plus"></i>
          </span>
          @if (aggregatedBadge() > 0) {
            <span class="fab-badge" aria-hidden="true">{{ aggregatedBadge() }}</span>
          }
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /* Container - Fixed bottom-right.
       z-index: 900 keeps FABs above normal page content (headers ~100)
       but BELOW Optimus UI dialog backdrops (autoZIndex starts at 1000+),
       so modal dialogs block FAB clicks and prevent double-dialog stacking. */
      .fab-container {
        position: fixed;
        /* --fab-bottom-offset is updated at runtime when the cookie consent
         banner is visible, so the FAB stack lifts above it instead of being
         covered. Defaults to 0 — base bottom stays at --space-6. */
        bottom: calc(var(--space-6, 24px) + var(--fab-bottom-offset, 0px));
        right: var(--space-6, 24px);
        z-index: 900;
        display: flex;
        flex-direction: column;
        gap: var(--space-3, 12px);
        pointer-events: none;
        transition: bottom 0.3s ease;
      }

      /* Base FAB Button — visible state.
       transform/opacity are explicit so toggling .fab-hidden reliably triggers
       the transitions (no animation/keyframe to interfere). Background and
       border-color get their own short transition for hover.

       Contrast (A11Y-004): the FAB floats over whatever content scrolls behind
       it, so it paints its OWN opaque surface. The former translucent "glass"
       (surface tokens reset to initial in styles.scss → transparent) put the
       label on the page behind it — 3.6:1 on the Easy-Language home's orange.
       Now: fill --surface-card, label --text-color (SC 1.4.3), edge --fab-edge
       (SC 1.4.11, 3:1 on ground/card/section). All three are measured per
       style × mode by scripts/check-contrast.mjs ("floating action button").
       --surface-0…900 are deliberately NOT read here: they are reset to
       initial in the FAB scope (styles.scss) and would resolve to nothing. */
      .fab-button {
        display: flex;
        align-items: center;
        gap: var(--space-2, 8px);
        padding: var(--space-3, 12px) var(--space-4, 16px);
        background: var(--surface-card);
        border: 2px solid var(--fab-edge);
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        font-size: 0.9rem;
        font-weight: 600;
        min-width: 50px;
        pointer-events: auto;
        position: relative;
        transform: translateX(0);
        opacity: 1;
        transition:
          transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1),
          opacity 0.3s ease,
          background-color 0.3s ease,
          border-color 0.3s ease,
          box-shadow 0.3s ease;
      }

      /* Hidden state — slides off to the right.
       Toggling this class drives both directions via the transition above. */
      .fab-button.fab-hidden {
        transform: translateX(calc(100% + var(--space-6, 24px)));
        opacity: 0;
        pointer-events: none;
      }

      .fab-button:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        background: var(--surface-hover);
      }

      .fab-button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
      }

      .fab-button i {
        font-size: 1.1rem;
      }

      /* The label is always body ink on the FAB's own surface — the color
       variants below tint only the icon (and the focus ring via currentColor). */
      .fab-label {
        white-space: nowrap;
        color: var(--text-color);
      }

      /* Badge */
      .fab-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        background: var(--red-500);
        color: white;
        border-radius: 10px;
        font-size: 0.75rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* Color Themes — the hue lives on the icon only (non-text, SC 1.4.11). */

      /* Default (neutral) */
      .fab-default {
        color: var(--text-color);
      }

      /* Primary (ToC) */
      .fab-primary {
        color: var(--primary-color-fg);
      }

      /* Teal (Feedback) */
      .fab-teal {
        color: var(--teal-600);
      }

      /* Orange (Easy Language) */
      .fab-orange {
        color: var(--orange-600);
      }

      /* Blue (Compare) */
      .fab-blue {
        color: var(--blue-600);
      }

      /* Green */
      .fab-green {
        color: var(--green-600);
      }

      /* Red */
      .fab-red {
        color: var(--red-600);
      }

      /* Dark mode: brighter -300 shades for the icon on the dark card surface. */
      :host-context(.dark-theme) .fab-teal {
        color: var(--teal-300);
      }
      :host-context(.dark-theme) .fab-orange {
        color: var(--orange-300);
      }
      :host-context(.dark-theme) .fab-blue {
        color: var(--blue-300);
      }
      :host-context(.dark-theme) .fab-green {
        color: var(--green-300);
      }
      :host-context(.dark-theme) .fab-red {
        color: var(--red-300);
      }

      /* ─── Mobile Speed Dial ─────────────────────────────────────────
       Active when ≥3 visible FABs on viewport ≤768px. The trigger
       FAB anchors the bottom-right corner; child FABs fan upward
       with a 50ms-per-step stagger derived from --stagger-index
       (0 = closest to trigger, increases upward). */

      .speed-dial-active .fab-trigger {
        order: 999;
      }

      /* Trigger icon: a wrapper span gets the rotation. Rotating .pi directly
       is overridden by a global .pi { transform: translateZ(0) !important }
       (OpenNG Icons font-load-shift fix in styles.scss), so we rotate the
       parent span instead — the icon visually rotates with it. 135° is
       enough to land at a visual "×" with a satisfying ¾-turn spin. */
      .speed-dial-active .fab-trigger .trigger-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
      }

      .speed-dial-active .fab-trigger.is-open .trigger-icon {
        transform: rotate(135deg);
      }

      /* Collapsed children: tucked behind the trigger, faded and
       non-interactive. Stagger-delay reverses on collapse so the
       topmost FAB hides first (visual "fold-down"). */
      .speed-dial-active:not(.speed-dial-expanded) .fab-button:not(.fab-trigger) {
        transform: translateY(calc(var(--stagger-index, 0) * 8px + 12px)) scale(0.4);
        opacity: 0;
        pointer-events: none;
        transition-delay: calc((3 - var(--stagger-index, 0)) * 30ms);
      }

      /* Expanded children: lift into place with bottom-up stagger. */
      .speed-dial-active.speed-dial-expanded .fab-button:not(.fab-trigger) {
        transition-delay: calc(var(--stagger-index, 0) * 50ms);
      }

      /* Mobile - Icon only */
      @media (max-width: 768px) {
        .fab-container {
          bottom: 15px;
          right: 15px;
          gap: var(--space-2, 8px);
        }

        .fab-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          justify-content: center;
          padding: 0;
        }

        .fab-label {
          display: none;
        }

        .fab-badge {
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          font-size: 0.7rem;
        }
      }

      /* Extra small screens */
      @media (max-width: 480px) {
        .fab-container {
          bottom: 20px;
          right: 12px;
        }

        .fab-button {
          width: 48px;
          height: 48px;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .fab-button {
          transition: none;
          animation: none;
        }
        .fab-button:hover {
          transform: none;
        }
        .speed-dial-active:not(.speed-dial-expanded) .fab-button:not(.fab-trigger),
        .speed-dial-active.speed-dial-expanded .fab-button:not(.fab-trigger) {
          transition-delay: 0s;
        }
        .speed-dial-active .fab-trigger .trigger-icon {
          transition: none;
        }
      }
    `,
  ],
})
export class FabContainerComponent implements OnInit, OnDestroy {
  fabRegistry = inject(FabRegistryService);
  private translationService = inject(TranslationService);
  private hostEl: ElementRef<HTMLElement> = inject(ElementRef);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  private observedBanner: Element | null = null;

  /** True when the viewport is within the mobile breakpoint. */
  private isMobile = signal(false);

  /** True when the Speed Dial menu is currently fanned out. */
  expanded = signal(false);

  /**
   * Speed Dial mode active: mobile viewport AND at least
   * SPEED_DIAL_THRESHOLD visible FABs. Below that we show the legacy
   * vertical stack (1-2 FABs don't intrude on the reading area).
   */
  speedDialActive = computed(() => this.isMobile() && this.fabRegistry.visibleCount() >= SPEED_DIAL_THRESHOLD);

  /** Sum of badges across visible child FABs — shown on the trigger. */
  aggregatedBadge = computed(() =>
    this.fabRegistry
      .sortedFabs()
      .filter((f) => f.visible !== false && typeof f.badge === 'number' && f.badge > 0)
      .reduce((sum, f) => sum + (f.badge ?? 0), 0),
  );

  @HostBinding('attr.role') readonly hostRole = 'complementary';
  @HostBinding('attr.aria-label') get hostAriaLabel(): string {
    return this.t('ui.actions');
  }

  constructor() {
    // Auto-collapse if speed dial deactivates while expanded (e.g. resize
    // to desktop or FABs unregistered below threshold).
    effect(() => {
      if (!this.speedDialActive() && this.expanded()) {
        this.expanded.set(false);
      }
    });
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  /** A child FAB is focusable when it's visible AND not currently collapsed by Speed Dial. */
  isFabFocusable(fab: FabRegistration): boolean {
    if (fab.visible === false) return false;
    if (this.speedDialActive() && !this.expanded()) return false;
    return true;
  }

  toggleExpanded(event: MouseEvent): void {
    event.stopPropagation();
    this.expanded.update((v) => !v);
  }

  onFabClick(fab: FabRegistration): void {
    fab.onClick();
    // After invoking an action in expanded mode, fold the menu back so the
    // user returns to the clean trigger state (matches Material Speed Dial).
    if (this.speedDialActive() && this.expanded()) {
      this.expanded.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.expanded()) return;
    const target = event.target as Node | null;
    if (target && !this.hostEl.nativeElement.contains(target)) {
      this.expanded.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.expanded()) this.expanded.set(false);
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.updateIsMobile();

    // Watch the cookie consent banner: it overlays the bottom-right corner
    // and would otherwise cover the FAB stack. We lift the container by the
    // banner's actual rendered height while it's present.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.handleResize, { passive: true });
      this.attachBannerObservers();
      this.mutationObserver = new MutationObserver(() => this.attachBannerObservers());
      this.mutationObserver.observe(document.body, { childList: true, subtree: true });
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.handleResize);
    }
    this.mutationObserver?.disconnect();
    this.resizeObserver?.disconnect();
  }

  private handleResize = (): void => {
    // Resize fires outside Angular zone (passive listener); jump back in so
    // signal updates trigger view sync.
    this.zone.run(() => this.updateIsMobile());
  };

  // browser-only: called from ngOnInit after its isPlatformBrowser return, and on resize.
  private updateIsMobile(): void {
    this.isMobile.set(window.innerWidth <= MOBILE_BREAKPOINT_PX);
  }

  // browser-only: called from ngOnInit after its isPlatformBrowser return.
  private attachBannerObservers(): void {
    const banner = document.querySelector('app-cookie-consent .cookie-consent');
    if (banner === this.observedBanner) return;

    this.resizeObserver?.disconnect();
    this.observedBanner = banner;

    if (!banner) {
      this.setBottomOffset(0);
      return;
    }

    this.setBottomOffset(banner.getBoundingClientRect().height);
    this.resizeObserver = new ResizeObserver(() => {
      // borderBoxSize would be more direct but isn't supported everywhere;
      // getBoundingClientRect always reflects the rendered border-box height.
      this.setBottomOffset(banner.getBoundingClientRect().height);
    });
    this.resizeObserver.observe(banner);
  }

  private setBottomOffset(px: number): void {
    const container = this.hostEl.nativeElement.querySelector<HTMLElement>('.fab-container');
    container?.style.setProperty('--fab-bottom-offset', `${Math.round(px)}px`);
  }
}
