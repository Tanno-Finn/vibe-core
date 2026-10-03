import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/**
 * Strips ARIA attributes that Optimus UI components emit but are invalid for the element's role.
 * PrimeNG 21.x p-progressbar emits aria-level="<value><unit>" on role="progressbar",
 * which is invalid (aria-level is only allowed on role="heading"). axe-core flags this
 * as a CRITICAL violation. This directive removes the offending attribute on init and
 * whenever Optimus UI re-applies it via change detection.
 *
 * WIRING - read this before assuming it is active. A standalone directive does NOT
 * attach globally; Angular applies it only inside components that list it in their
 * own `imports`. The element selector then does the rest, so no attribute is needed
 * at the call site - but the import is not optional.
 *
 *   Any component that renders <p-progressbar> must add StripInvalidAriaDirective
 *   to its `imports` array, next to ProgressBarModule.
 *
 * Current call sites (keep in sync):
 *   - components/shared/text-container.component.ts  (reading progress)
 *   - dev/articles/skeleton/skeleton-article.component.ts  (guide demo)
 *   - dev/articles/progress/progress-article.component.ts  (guide demo)
 *
 * Measured on the guide demo across four change-detection ticks while
 * aria-valuenow climbed 36 -> 84: without the import the host carried
 * aria-level="84%"; with it the attribute is absent on every tick.
 */
@Directive({
  selector: 'p-progressbar, p-progressbar, [appStripInvalidAria]',
  standalone: true,
})
export class StripInvalidAriaDirective implements AfterViewInit, OnDestroy {
  private host = inject(ElementRef<HTMLElement>);
  private observer?: MutationObserver;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    el.removeAttribute('aria-level');
    if (typeof MutationObserver !== 'undefined') {
      this.observer = new MutationObserver(() => {
        if (el.hasAttribute('aria-level')) el.removeAttribute('aria-level');
      });
      this.observer.observe(el, { attributes: true, attributeFilter: ['aria-level'] });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
