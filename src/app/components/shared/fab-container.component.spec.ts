/**
 * FabContainerComponent + ScrollToTopFabComponent spec — three promises:
 *  - the FAB stack claims no widget it does not implement: no role="toolbar"
 *    (it has no arrow keys, every FAB is its own Tab stop) and a speed-dial
 *    trigger that is a disclosure, not a menu button;
 *  - a hidden FAB is inert and out of the Tab order;
 *  - "back to top" does not drop focus to <body> when it hides itself at the
 *    top: focus moves to the main landmark first.
 *
 * TranslationService is stubbed to return the key; window.scrollTo is a spy
 * (jsdom does not implement it) and the scroll position is set by hand.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { FabContainerComponent } from './fab-container.component';
import { ScrollToTopFabComponent } from './scroll-to-top-fab.component';
import { FabRegistryService } from '../../services/fab-registry.service';
import { TranslationService } from '../../services/translation.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  translate(key: string): string {
    return key;
  }
}

@Component({
  standalone: true,
  imports: [FabContainerComponent, ScrollToTopFabComponent],
  template: `
    <main id="main-content" tabindex="-1"><p>Page</p></main>
    <app-scroll-to-top-fab [showAfterScroll]="100" fabIdSuffix="spec" />
    <app-fab-container />
  `,
})
class HostComponent {}

describe('FabContainerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HTMLElement;
  let scrollTo: ReturnType<typeof vi.fn>;
  const originalScrollTo = window.scrollTo;
  const originalWidth = window.innerWidth;

  function setScrollY(y: number): void {
    Object.defineProperty(window, 'pageYOffset', { value: y, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
  }

  function backToTop(): HTMLButtonElement {
    return host.querySelector<HTMLButtonElement>('button[aria-label="textContainer.backToTop"]')!;
  }

  beforeEach(() => {
    vi.useFakeTimers();
    scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true });
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: TranslationService, useClass: TranslationServiceStub }],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.nativeElement as HTMLElement;
    document.body.appendChild(host);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    host.remove();
    window.scrollTo = originalScrollTo;
    Object.defineProperty(window, 'innerWidth', { value: originalWidth, configurable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true });
    vi.useRealTimers();
  });

  it('claims no toolbar role — the stack has no arrow keys, each FAB is its own Tab stop', () => {
    expect(host.querySelector('[role="toolbar"]')).toBeNull();
    const landmark = host.querySelector('app-fab-container')!;
    expect(landmark.getAttribute('role')).toBe('complementary');
    expect(landmark.getAttribute('aria-label')).toBe('ui.actions');
  });

  it('keeps a hidden FAB inert and out of the Tab order', () => {
    const button = backToTop();
    expect(button.hasAttribute('inert')).toBe(true);
    expect(button.getAttribute('tabindex')).toBe('-1');

    setScrollY(500);

    expect(button.hasAttribute('inert')).toBe(false);
    expect(button.hasAttribute('tabindex')).toBe(false);
  });

  it('moves focus to the main landmark before "back to top" hides itself', () => {
    setScrollY(500);
    const button = backToTop();
    button.focus();
    expect(document.activeElement).toBe(button);

    button.click();

    expect(document.activeElement).toBe(document.getElementById('main-content'));
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));

    // The page arrives at the top; the button goes inert, focus stays put.
    vi.advanceTimersByTime(200);
    setScrollY(0);
    expect(button.hasAttribute('inert')).toBe(true);
    expect(document.activeElement).toBe(document.getElementById('main-content'));
  });

  it('leaves focus alone when "back to top" runs without having focus', () => {
    setScrollY(500);
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();

    TestBed.inject(FabRegistryService)
      .sortedFabs()
      .find((f) => f.id === 'scroll-to-top-spec')!
      .onClick();

    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it('makes the speed-dial trigger a disclosure, not a menu button', () => {
    Object.defineProperty(window, 'innerWidth', { value: 400, configurable: true });
    window.dispatchEvent(new Event('resize'));
    const registry = TestBed.inject(FabRegistryService);
    for (const id of ['a', 'b', 'c']) {
      registry.register({
        id,
        priority: 50,
        icon: 'pi-star',
        labelKey: id,
        color: 'default',
        onClick: () => undefined,
      });
    }
    fixture.detectChanges();

    const trigger = host.querySelector<HTMLButtonElement>('.fab-trigger')!;
    expect(trigger).not.toBeNull();
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});
