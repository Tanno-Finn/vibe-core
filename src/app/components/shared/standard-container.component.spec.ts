import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerConfig, StandardContainerComponent } from './standard-container.component';
import { provideOfflineHttp } from '../../testing/offline-http';

/**
 * A collapsible container used to make its whole header `role="button"`. A
 * screen reader flattens a button's children, so the info-tooltip buttons that
 * app-text-container puts into that header were unreachable (axe
 * `nested-interactive`, A11Y-001). These tests pin the disclosure pattern that
 * replaced it: one real toggle button, a header with no role, and interactive
 * header content left as a sibling of the toggle, not a descendant.
 */

/** The container mounts the cursor-glow directive, which reads window.matchMedia. */
function stubMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

@Component({
  standalone: true,
  imports: [StandardContainerComponent],
  template: `
    <app-standard-container [config]="config">
      <div slot="header">
        <h2>Custom title</h2>
        <button type="button" class="inner-info">i</button>
      </div>
      <p>Body</p>
    </app-standard-container>
  `,
})
class CustomHeaderHostComponent {
  config: ContainerConfig = { type: 'info', title: 'Custom title', collapsible: true, customHeaderSlot: true };
}

describe('StandardContainerComponent disclosure', () => {
  beforeEach(() => {
    stubMatchMedia();
    TestBed.configureTestingModule({ providers: provideOfflineHttp() });
  });

  function renderStandard(config: ContainerConfig): {
    fixture: ComponentFixture<StandardContainerComponent>;
    host: HTMLElement;
  } {
    const fixture = TestBed.createComponent(StandardContainerComponent);
    fixture.componentInstance.config = config;
    fixture.detectChanges();
    return { fixture, host: fixture.nativeElement as HTMLElement };
  }

  it('gives a collapsible header no role and no tab stop of its own', () => {
    const { host } = renderStandard({ type: 'info', title: 'Section', collapsible: true });
    const header = host.querySelector('.container-header')!;
    expect(header.hasAttribute('role')).toBe(false);
    expect(header.hasAttribute('tabindex')).toBe(false);
    expect(header.hasAttribute('aria-expanded')).toBe(false);
  });

  it('toggles through one real button that reports its state and its region', () => {
    const { fixture, host } = renderStandard({ type: 'info', title: 'Section', collapsible: true });
    const button = host.querySelector<HTMLButtonElement>('button.collapse-button')!;
    expect(button).not.toBeNull();
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-expanded')).toBe('true');

    const region = host.querySelector('.container-content')!;
    expect(region.id).not.toBe('');
    expect(button.getAttribute('aria-controls')).toBe(region.id);
    expect(button.getAttribute('aria-label')).toContain('Section');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(region.hasAttribute('inert')).toBe(true);
    expect(host.querySelector('.container-header')!.classList.contains('is-collapsed')).toBe(true);
  });

  it('renders no toggle when the container is not collapsible', () => {
    const { host } = renderStandard({ type: 'info', title: 'Section' });
    expect(host.querySelector('button.collapse-button')).toBeNull();
  });

  it('keeps interactive custom-header content outside the toggle button', () => {
    const fixture = TestBed.createComponent(CustomHeaderHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const toggle = host.querySelector('button.collapse-button');
    const inner = host.querySelector('button.inner-info');
    expect(toggle).not.toBeNull();
    expect(inner).not.toBeNull();
    expect(toggle!.contains(inner)).toBe(false);
    expect(inner!.closest('[role="button"]')).toBeNull();
  });
});
