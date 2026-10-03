/**
 * Scroll-to-Top FAB Component
 *
 * Self-registering FAB that appears once the user has scrolled past a threshold
 * and smoothly scrolls back to the top of the page when clicked.
 *
 * Visual rendering happens in the global FabContainerComponent — this component
 * only manages registration, scroll tracking, and the click handler.
 */

import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { FabRegistryService, FAB_PRIORITIES } from '../../services/fab-registry.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { scrollBehavior } from '../../utils/reduced-motion';

@Component({
  selector: 'app-scroll-to-top-fab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class ScrollToTopFabComponent implements OnInit, OnDestroy {
  private static instanceCounter = 0;

  /** Pixels of vertical scroll before the FAB becomes visible. */
  @Input() showAfterScroll = 1000;

  /** Optional id suffix to disambiguate multiple instances. */
  @Input() fabIdSuffix = '';

  private fabRegistry = inject(FabRegistryService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private fabId = '';
  private currentlyVisible = false;

  ngOnInit(): void {
    const suffix = this.fabIdSuffix ? `-${this.fabIdSuffix}` : `-${++ScrollToTopFabComponent.instanceCounter}`;
    this.fabId = `scroll-to-top${suffix}`;

    this.fabRegistry.register({
      id: this.fabId,
      priority: FAB_PRIORITIES.SCROLL_TO_TOP,
      icon: 'pi-arrow-up',
      labelKey: 'textContainer.backToTop',
      color: 'default',
      visible: false,
      onClick: () => this.scrollToTop(),
    });

    if (!isPlatformBrowser(this.platformId)) return;

    this.updateVisibility();
    fromEvent(window, 'scroll', { passive: true } as AddEventListenerOptions)
      .pipe(throttleTime(100, undefined, { leading: true, trailing: true }), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateVisibility());
  }

  ngOnDestroy(): void {
    if (this.fabId) {
      this.fabRegistry.unregister(this.fabId);
    }
  }

  // browser-only: called from ngOnInit after its isPlatformBrowser return, and on scroll.
  private updateVisibility(): void {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const shouldBeVisible = scrollY > this.showAfterScroll;
    if (shouldBeVisible !== this.currentlyVisible) {
      this.currentlyVisible = shouldBeVisible;
      this.fabRegistry.updateVisibility(this.fabId, shouldBeVisible);
    }
  }

  private scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Back at the top this button hides itself, and FabContainerComponent makes
    // a hidden FAB inert — so if it had focus (it was just activated), focus
    // would drop to <body> and the next Tab would start from the top of the
    // document. Hand focus to the main landmark first, where the skip link sends
    // it; preventScroll keeps focus() from fighting the scroll below.
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest('app-fab-container')) {
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: scrollBehavior(),
    });
  }
}
