/**
 * CursorGlowDirective
 *
 * Adds a radial glow effect that follows the mouse cursor on the host element.
 * Uses global CSS via [data-cursor-glow] attribute for ::before (border glow)
 * and ::after (background fill) pseudo-elements.
 *
 * Afterburn trail: Spawns fading glow points along the cursor path that
 * linger briefly before fading out, creating a comet-tail effect.
 * Uses a fixed pool of DOM elements (no creation/removal during movement).
 *
 * Proximity effect: The glow is visible as the cursor approaches from outside,
 * fading in proportionally to distance. No abrupt pop-in/pop-out.
 *
 * Performance: Single global document listener shared by all instances,
 * throttled via requestAnimationFrame, runs outside NgZone.
 * Accessibility: Skips setup entirely when prefers-reduced-motion is active.
 *
 * Usage:
 *   <div class="my-card" appCursorGlow>...</div>
 *   <div class="my-card" appCursorGlow [glowRadius]="500">...</div>
 */
import { Directive, ElementRef, Input, NgZone, OnInit, OnDestroy, effect, inject } from '@angular/core';
import { PlaygroundSettingsService } from '../services/playground-settings.service';

@Directive({
  selector: '[appCursorGlow]',
  standalone: true,
})
export class CursorGlowDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private zone = inject(NgZone);
  private settings = inject(PlaygroundSettingsService);
  private active = false;
  private enabled = false;

  @Input() glowRadius: number = 350;

  // Shared global state - one document listener for all instances
  private static instances = new Set<CursorGlowDirective>();
  private static globalListener: ((e: MouseEvent) => void) | null = null;
  private static rafId: number | null = null;
  private static lastEvent: MouseEvent | null = null;

  // Afterburn trail pool
  private static readonly TRAIL_POOL_SIZE = 10;
  private static readonly TRAIL_DISTANCE_SQ = 900; // 30px squared
  private static readonly TRAIL_REFRESH_MS = 600; // refresh interval when cursor is still
  private trailContainer: HTMLElement | null = null;
  private trailElements: HTMLElement[] = [];
  private trailIndex = 0;
  private lastTrailX = 0;
  private lastTrailY = 0;
  private lastTrailTime = 0;

  constructor() {
    // React to the "Kometenschweif" setting live — no page reload needed. The
    // single setting governs BOTH cursor effects: the proximity glow ring/fill
    // (::before/::after, gated via [data-glow-active]) and the afterburn trail.
    // Previously only the trail was toggled, so the glow kept following the
    // cursor on every card even with the setting off.
    effect(() => {
      const enabled = this.settings.cursorGlowAfterburn();
      this.applyEnabled(enabled);
    });
  }

  ngOnInit(): void {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const host = this.el.nativeElement as HTMLElement;
    host.setAttribute('data-cursor-glow', '');

    if (this.glowRadius !== 350) {
      host.style.setProperty('--glow-radius', `${this.glowRadius}px`);
    }

    this.active = true;
    this.zone.runOutsideAngular(() => CursorGlowDirective.register(this));
  }

  ngOnDestroy(): void {
    if (!this.active) return;
    CursorGlowDirective.unregister(this);
    const host = this.el.nativeElement as HTMLElement;
    host.removeAttribute('data-glow-active');
    host.style.removeProperty('--mouse-x');
    host.style.removeProperty('--mouse-y');
    host.style.removeProperty('--glow-opacity');

    if (this.trailContainer) {
      this.trailContainer.remove();
      this.trailContainer = null;
      this.trailElements = [];
    }
  }

  /** Turn ALL cursor effects on/off to match the setting: the proximity glow
   *  (via the [data-glow-active] attribute that gates ::before/::after) and the
   *  afterburn trail pool. Idempotent; no-ops on the server and under
   *  prefers-reduced-motion. */
  private applyEnabled(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = this.el.nativeElement as HTMLElement;
    this.enabled = enabled;
    if (enabled) {
      host.setAttribute('data-glow-active', '');
      if (!this.trailContainer) this.initTrail(host);
    } else {
      host.removeAttribute('data-glow-active');
      host.style.removeProperty('--mouse-x');
      host.style.removeProperty('--mouse-y');
      host.style.removeProperty('--glow-opacity');
      if (this.trailContainer) {
        this.trailContainer.remove();
        this.trailContainer = null;
        this.trailElements = [];
        this.trailIndex = 0;
      }
    }
  }

  // browser-only: called from applyEnabled() behind its typeof-window guard.
  private initTrail(host: HTMLElement): void {
    this.trailContainer = document.createElement('div');
    this.trailContainer.className = 'cursor-glow-trail-container';

    for (let i = 0; i < CursorGlowDirective.TRAIL_POOL_SIZE; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-glow-trail';
      this.trailContainer.appendChild(el);
      this.trailElements.push(el);
    }

    host.appendChild(this.trailContainer);
  }

  private spawnTrailPoint(x: number, y: number): void {
    const now = performance.now();
    const dx = x - this.lastTrailX;
    const dy = y - this.lastTrailY;
    const movedEnough = dx * dx + dy * dy >= CursorGlowDirective.TRAIL_DISTANCE_SQ;
    const timedOut = now - this.lastTrailTime >= CursorGlowDirective.TRAIL_REFRESH_MS;

    // Spawn when cursor moved enough OR enough time passed (keeps glow alive when still)
    if (!movedEnough && !timedOut) return;

    this.lastTrailX = x;
    this.lastTrailY = y;
    this.lastTrailTime = now;

    const el = this.trailElements[this.trailIndex % this.trailElements.length];
    this.trailIndex++;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // (Re)start the fade via the Web Animations API. This is more reliable
    // cross-browser (notably Firefox) than the CSS animation-name + forced-reflow
    // restart hack, which depends on synchronous style-flush timing. Falls back to
    // the CSS keyframes (still defined in styles.scss) where WAAPI is unavailable.
    if (typeof el.animate === 'function') {
      el.getAnimations?.().forEach((a) => a.cancel());
      el.animate(
        [
          { opacity: 0.25, transform: 'translate(-50%, -50%) scale(1)' },
          { opacity: 0.15, transform: 'translate(-50%, -50%) scale(1.03)', offset: 0.6 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(1.1)' },
        ],
        { duration: 3000, easing: 'ease-in-out', fill: 'forwards' },
      );
    } else {
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = 'cursor-trail-fade 3s ease-in-out forwards';
    }
  }

  // browser-only: called from ngOnInit after its typeof-window return.
  private static register(instance: CursorGlowDirective): void {
    this.instances.add(instance);
    if (this.instances.size === 1) {
      this.globalListener = (e: MouseEvent) => {
        this.lastEvent = e;
        if (this.rafId === null) {
          this.rafId = requestAnimationFrame(() => {
            this.rafId = null;
            if (this.lastEvent) this.updateAll(this.lastEvent);
          });
        }
      };
      document.addEventListener('mousemove', this.globalListener, { passive: true });
    }
  }

  // browser-only: runs only for a directive that register() activated.
  private static unregister(instance: CursorGlowDirective): void {
    this.instances.delete(instance);
    if (this.instances.size === 0 && this.globalListener) {
      document.removeEventListener('mousemove', this.globalListener);
      this.globalListener = null;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.lastEvent = null;
    }
  }

  private static updateAll(e: MouseEvent): void {
    for (const instance of this.instances) {
      instance.updateGlow(e);
    }
  }

  private updateGlow(e: MouseEvent): void {
    if (!this.enabled) return;
    const host = this.el.nativeElement as HTMLElement;
    const rect = host.getBoundingClientRect();

    // Distance from cursor to nearest edge of the element (0 when inside)
    const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
    const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.glowRadius) {
      if (host.style.getPropertyValue('--glow-opacity') !== '0') {
        host.style.setProperty('--glow-opacity', '0');
      }
      return;
    }

    // Position relative to element - works with negative/overflow values for proximity
    host.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    host.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);

    // Inside: full opacity. Outside: fade proportionally to distance
    const opacity = distance === 0 ? 1 : 1 - distance / this.glowRadius;
    host.style.setProperty('--glow-opacity', `${opacity}`);

    // Afterburn trail - only when cursor is inside the element
    if (distance === 0 && this.trailElements.length > 0) {
      this.spawnTrailPoint(e.clientX - rect.left, e.clientY - rect.top);
    }
  }
}
