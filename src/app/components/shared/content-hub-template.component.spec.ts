/**
 * ContentHubTemplateComponent spec — the three hub-layout rules the template
 * used to break: a card CTA is a real link with an href, the state that
 * replaces the cards keeps the cards' heading level, and the one polite live
 * region reports the filtered result count, debounced, and stays silent about
 * the count while data is in flight or failed.
 *
 * TranslationService is stubbed to return the key (the count template aside).
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';

import { ContentHubTemplateComponent, ContentItem, RESULT_ANNOUNCE_DELAY_MS } from './content-hub-template.component';
import { TranslationService } from '../../services/translation.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentIntlLocale = 'en-US';
  translate(key: string): string {
    return key === 'common.resultCount' ? '{{count}} of {{total}} shown' : key;
  }
}

const ITEMS: ContentItem[] = [
  { id: 'alpha', path: 'demos/alpha', titleKey: 'alpha.title', descriptionKey: 'alpha.desc', category: 'basics' },
  { id: 'beta', path: 'demos/beta', titleKey: 'beta.title', descriptionKey: 'beta.desc', category: 'advanced' },
  { id: 'gamma', path: 'demos/gamma', titleKey: 'gamma.title', descriptionKey: 'gamma.desc', category: 'basics' },
];

describe('ContentHubTemplateComponent', () => {
  let fixture: ComponentFixture<ContentHubTemplateComponent>;
  let component: ContentHubTemplateComponent;
  let host: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ContentHubTemplateComponent],
      providers: [provideRouter([]), { provide: TranslationService, useClass: TranslationServiceStub }],
    });
    fixture = TestBed.createComponent(ContentHubTemplateComponent);
    component = fixture.componentInstance;
    component.config = { titleKey: 'hub.title', subtitleKey: 'hub.subtitle', ctaLabelKey: 'hub.cta', fromParam: 'hub' };
    component.loading = signal(false);
    component.loadFailed = signal(false);
    fixture.componentRef.setInput('items', ITEMS);
    host = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => vi.useRealTimers());

  function render(): void {
    fixture.detectChanges();
  }

  function settle(): void {
    vi.advanceTimersByTime(RESULT_ANNOUNCE_DELAY_MS);
    fixture.detectChanges();
  }

  function liveRegion(): HTMLElement {
    return host.querySelector('[role="status"]') as HTMLElement;
  }

  describe('card action', () => {
    it('is a link with an href to the item, carrying the from param', () => {
      render();
      const links = host.querySelectorAll<HTMLAnchorElement>('.card-actions a.cta-button');
      expect(links.length).toBe(3);
      expect(links[0].getAttribute('href')).toBe('/demos/alpha?from=hub');
      expect(host.querySelector('.card-actions button')).toBeNull();
    });

    it('is described by its own card title, whose id is unique per card', () => {
      render();
      const link = host.querySelector<HTMLAnchorElement>('.card-actions a')!;
      const titleId = link.getAttribute('aria-describedby')!;
      expect(host.querySelector('#' + titleId)?.textContent?.trim()).toBe('alpha.title');
      const ids = [...host.querySelectorAll('.card-title')].map((h) => h.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('heading outline', () => {
    it('gives the no-match state the h2 level the card titles have', () => {
      render();
      expect(host.querySelector('.card-title')?.tagName).toBe('H2');
      component.searchTerm.set('no such item');
      render();
      expect(host.querySelector('.empty-state h2')?.textContent).toContain('common.noResults');
      expect(host.querySelector('h3')).toBeNull();
    });

    it('gives the load-failed state the h2 level too', () => {
      component.loadFailed.set(true);
      render();
      expect(host.querySelector('.empty-state h2')?.textContent).toContain('common.loadError');
      expect(host.querySelector('h3')).toBeNull();
    });
  });

  describe('result-count live region', () => {
    it('announces the loading state while data is in flight, not a count', () => {
      component.loading.set(true);
      render();
      settle();
      expect(liveRegion().getAttribute('aria-busy')).toBe('true');
      expect(liveRegion().textContent?.trim()).toBe('common.loading');
    });

    it('announces the count once the data has landed', () => {
      render();
      expect(liveRegion().textContent?.trim()).toBe('');
      settle();
      expect(liveRegion().getAttribute('aria-live')).toBe('polite');
      expect(liveRegion().textContent?.trim()).toBe('3 of 3 shown');
    });

    it('follows a filter change only after the debounce, with one announcement for a burst', () => {
      render();
      settle();
      component.selectedCategory.set('basics');
      render();
      vi.advanceTimersByTime(RESULT_ANNOUNCE_DELAY_MS / 2);
      component.searchTerm.set('gamma');
      render();
      vi.advanceTimersByTime(RESULT_ANNOUNCE_DELAY_MS / 2);
      fixture.detectChanges();
      expect(liveRegion().textContent?.trim()).toBe('3 of 3 shown');
      settle();
      expect(liveRegion().textContent?.trim()).toBe('1 of 3 shown');
    });

    it('announces zero matches as a count too', () => {
      render();
      component.searchTerm.set('no such item');
      render();
      settle();
      expect(liveRegion().textContent?.trim()).toBe('0 of 3 shown');
    });

    it('drops the count when a reload fails, so a stale number never follows', () => {
      render();
      settle();
      component.loadFailed.set(true);
      render();
      settle();
      expect(liveRegion().textContent?.trim()).toBe('common.loadError');
      component.loadFailed.set(false);
      component.loading.set(true);
      render();
      component.loading.set(false);
      render();
      expect(liveRegion().textContent?.trim()).toBe('');
    });
  });
});
