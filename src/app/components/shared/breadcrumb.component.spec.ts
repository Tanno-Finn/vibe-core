/**
 * BreadcrumbComponent spec — the trail's accessibility contract:
 *   - ONE navigation landmark (p-breadcrumb's own <nav>), labelled;
 *   - the last crumb is the current page: `aria-current="page"`, no link;
 *   - a crumb without a url (a route group) is no tab stop.
 * The component is rendered with the real p-breadcrumb, so the assertions
 * hold against the markup the library actually produces.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';

import { BreadcrumbComponent, BreadcrumbItem, toMenuItems } from './breadcrumb.component';
import { TranslationService } from '../../services/translation.service';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  translate(key: string): string {
    return key === 'app.nav.breadcrumb' ? 'Breadcrumb' : key;
  }
}

const TRAIL: BreadcrumbItem[] = [
  { label: 'Guides' },
  { label: 'Neural networks', url: '/guides/neural-networks' },
  { label: 'Backpropagation', url: '/guides/neural-networks/backprop' },
];

describe('toMenuItems', () => {
  const items = toMenuItems(TRAIL, (k) => k);

  it('never links the current (last) crumb', () => {
    expect(items[2].routerLink).toBeUndefined();
    expect(items[2].url).toBeUndefined();
  });

  it('keeps a crumb with a url as a router link', () => {
    expect(items[1].routerLink).toBe('/guides/neural-networks');
    expect(items[1].tabindex).toBeUndefined();
  });

  it('takes a crumb without a url out of the tab order', () => {
    expect(items[0].routerLink).toBeUndefined();
    expect(items[0].tabindex).toBe('-1');
  });

  it('sets no aria-current key of its own (p-breadcrumb owns it)', () => {
    for (const item of items) expect(Object.keys(item)).not.toContain('aria-current');
  });
});

describe('BreadcrumbComponent (rendered)', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [provideRouter([]), { provide: TranslationService, useClass: TranslationServiceStub }],
    }).compileComponents();
    fixture = TestBed.createComponent(BreadcrumbComponent);
    fixture.componentInstance.customBreadcrumbs = TRAIL;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  it('renders exactly one navigation landmark, and labels it', () => {
    const navs = host.querySelectorAll('nav, [role="navigation"]');
    expect(navs.length).toBe(1);
    expect(navs[0].getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('marks the last crumb as the current page and does not link it', () => {
    const current = host.querySelectorAll('[aria-current="page"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent?.trim()).toBe('Backpropagation');
    expect(current[0].hasAttribute('href')).toBe(false);
    expect(current[0].getAttribute('tabindex')).toBe('-1');
  });

  it('leaves no focusable crumb without a destination (no dead tab stop)', () => {
    const tabStops = Array.from(host.querySelectorAll<HTMLElement>('.p-breadcrumb-item-link')).filter(
      (a) => a.getAttribute('tabindex') !== '-1',
    );
    expect(tabStops.length).toBeGreaterThan(0);
    for (const a of tabStops) expect(a.hasAttribute('href')).toBe(true);
  });
});
