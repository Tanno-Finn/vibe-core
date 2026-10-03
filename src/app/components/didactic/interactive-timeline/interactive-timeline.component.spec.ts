/**
 * InteractiveTimelineComponent spec — auto-play is motion the reader did not
 * ask for, so it starts switched off under prefers-reduced-motion (A11Y-007)
 * and on otherwise; the toggle still turns it on.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveTimelineComponent, InteractiveTimelineConfig } from './interactive-timeline.component';
import { TranslationService } from '../../../services/translation.service';

const config: InteractiveTimelineConfig = {
  events: [
    { id: 'a', year: '1', color: 'var(--primary-color)', translationKeyPrefix: 't.a' },
    { id: 'b', year: '2', color: 'var(--primary-color)', translationKeyPrefix: 't.b' },
  ],
  autoPlayDelay: 60_000,
  resumeDelay: 60_000,
};

function stubReducedMotion(reduce: boolean): void {
  window.matchMedia = ((query: string) =>
    ({
      matches: reduce && query === '(prefers-reduced-motion: reduce)',
      media: query,
    }) as MediaQueryList) as typeof window.matchMedia;
}

function render(): ComponentFixture<InteractiveTimelineComponent> {
  TestBed.configureTestingModule({
    imports: [InteractiveTimelineComponent],
    providers: [{ provide: TranslationService, useValue: { translate: (k: string) => k } }],
  });
  const fixture = TestBed.createComponent(InteractiveTimelineComponent);
  fixture.componentRef.setInput('config', config);
  fixture.detectChanges();
  return fixture;
}

const toggle = (f: ComponentFixture<InteractiveTimelineComponent>) =>
  (f.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.autoplay-toggle')!;

describe('InteractiveTimelineComponent auto-play', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
    TestBed.resetTestingModule();
  });

  it('starts switched off under prefers-reduced-motion, with nothing selected', () => {
    stubReducedMotion(true);
    const f = render();
    expect(f.componentInstance.autoPlay()).toBe(false);
    expect(toggle(f).getAttribute('aria-pressed')).toBe('false');
    expect(f.componentInstance.selectedEvent()).toBeNull();
    f.destroy();
  });

  it('starts switched on without that preference', () => {
    stubReducedMotion(false);
    const f = render();
    expect(f.componentInstance.autoPlay()).toBe(true);
    expect(toggle(f).getAttribute('aria-pressed')).toBe('true');
    expect(f.componentInstance.selectedEvent()).toBe('a');
    f.destroy();
  });

  it('can still be switched on by the reader under reduced motion', () => {
    stubReducedMotion(true);
    const f = render();
    toggle(f).click();
    f.detectChanges();
    expect(f.componentInstance.autoPlay()).toBe(true);
    expect(toggle(f).getAttribute('aria-pressed')).toBe('true');
    f.destroy();
  });
});
