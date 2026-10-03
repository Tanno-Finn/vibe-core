/**
 * AppComponent spec — characterization of the application shell, written
 * before the shell was split into a thin container and focused children, so
 * the split can prove it changed nothing a visitor or a screen reader meets:
 *
 *  - the skip link targets #main-content and moves focus there;
 *  - the sitemap opened from the sitemap button is a MODAL dialog: focus goes
 *    to its close button, the focus trap is armed, Escape closes it and hands
 *    focus back to the button;
 *  - the sitemap opened from the omnibar is a NON-modal dialog: no
 *    aria-modal, no armed trap, focus stays in the search input, typing
 *    filters it live, and closing never refocuses the input;
 *  - the empty state, the backdrop, a sitemap link, a finished navigation and
 *    a window scroll all behave as before;
 *  - a language switch re-labels the open sitemap;
 *  - the header logo, the footer and the print header/footer name the site
 *    from SITE_CONFIG (src/config/site.json), the kit default unless a test
 *    renames it.
 *
 * Services with side effects (SEO, analytics, favicon, notifications, …) are
 * stubbed; the navigation service serves two small groups whose labels follow
 * a fake current language.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { BehaviorSubject, Subject, of } from 'rxjs';

import { AppComponent } from './app.component';
import { TranslationService } from './services/translation.service';
import { NavigationGroup, NavigationItem, NavigationService } from './services/navigation.service';
import { MetaSeoService } from './services/meta-seo.service';
import { StructuredDataService } from './services/structured-data.service';
import { FaviconService } from './services/favicon.service';
import { AnalyticsService } from './services/analytics.service';
import { TimeGateService } from './services/time-gate.service';
import { UpdateDetectionService } from './services/update-detection.service';
import { NotificationService } from './services/notification.service';
import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, SiteRules } from '../config/site';
import { createSiteRules } from '../config/site-rules.mjs';

let lang = 'en';

class TranslationStub {
  get currentLanguage(): string {
    return lang;
  }
  readonly languageChanged = new Subject<unknown>();
  readonly isTranslationsLoaded = new BehaviorSubject(true);
  readonly currentLanguage$ = () => lang;
  readonly languages = [];
  translate = (key: string) => key;
  translateValue = () => null;
  isLanguageFullyLoaded = () => true;
  getCurrentLanguageInfo = () => undefined;
  setLanguage = () => Promise.resolve();
}

function item(label: string, route: string, extra: Partial<NavigationItem> = {}): NavigationItem {
  return { label, route, icon: 'pi pi-file', ...extra };
}

function groups(): NavigationGroup[] {
  const de = lang === 'de';
  return [
    {
      key: 'learn',
      label: de ? 'Lernen' : 'Learn',
      items: [
        item(de ? 'Glossar' : 'Glossary', '/glossary', { pageId: 'GLOS', group: 'learn' }),
        item(de ? 'Zeitleiste' : 'Timeline', '/timeline', { pageId: 'TIME', group: 'learn', matchTerms: ['history'] }),
      ],
    },
    {
      key: 'tools',
      label: de ? 'Werkzeuge' : 'Tools',
      items: [item(de ? 'Katalog' : 'Catalog', '/catalog', { pageId: 'CATA', group: 'tools' })],
    },
  ];
}

class NavigationStub {
  navigated: NavigationItem[] = [];
  refreshNavigation = () => undefined;
  getNavigationGroupsWithOverflow = () => groups();
  getNavigationGroups = () => groups();
  getAvailablePages = () => groups().flatMap((g) => g.items);
  getGroupConfig = () => undefined;
  getPageById = () => undefined;
  filterPages = (query: string) =>
    groups()
      .flatMap((g) => g.items.map((i) => ({ ...i, groupLabel: g.label })))
      .filter((i) =>
        [i.label, i.pageId ?? '', ...(i.matchTerms ?? [])].some((t) => t.toLowerCase().includes(query.toLowerCase())),
      );
  navigateToPage = (page: NavigationItem) => {
    this.navigated.push(page);
    return Promise.resolve(true);
  };
}

/** ThemeService (reached through the card and picker components) reads `window.matchMedia`; jsdom has none. */
function stubMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
  // The FAB container watches banner sizes; jsdom has no ResizeObserver either.
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}

@Component({ template: '<p>page</p>' })
class BlankPage {}

async function render(site: SiteRules = KIT_DEFAULT_SITE_RULES): Promise<ComponentFixture<AppComponent>> {
  stubMatchMedia();
  TestBed.configureTestingModule({
    imports: [AppComponent],
    providers: [
      provideRouter([{ path: '**', component: BlankPage }]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: TranslationService, useClass: TranslationStub },
      { provide: NavigationService, useClass: NavigationStub },
      { provide: MetaSeoService, useValue: {} },
      { provide: StructuredDataService, useValue: {} },
      { provide: FaviconService, useValue: {} },
      {
        provide: AnalyticsService,
        useValue: { initialize: () => undefined, isConfigured: false, trackConsentDecision: () => undefined },
      },
      { provide: TimeGateService, useValue: { initialize: () => undefined, isPublished: () => true } },
      { provide: UpdateDetectionService, useValue: {} },
      { provide: SITE_CONFIG, useValue: site },
      {
        provide: NotificationService,
        useValue: {
          unreadCount: () => 0,
          notifications: () => [],
          visibleNotifications: () => [],
          liveAnnouncement: () => '',
          hydrated: () => true,
          isFirstVisit: () => false,
          isRead: () => false,
          load: () => of([]),
          hydrate: () => undefined,
        },
      },
    ],
  });
  const fixture = TestBed.createComponent(AppComponent);
  document.body.appendChild(fixture.nativeElement);
  // No whenStable(): the shell keeps long timers (consent banner, update
  // check) pending, so "stable" is seconds away. A macrotask turn is enough.
  await settle(fixture);
  return fixture;
}

async function settle(fixture: ComponentFixture<AppComponent>): Promise<void> {
  fixture.detectChanges();
  await new Promise((r) => setTimeout(r, 0));
  fixture.detectChanges();
}

const el = (f: ComponentFixture<AppComponent>) => f.nativeElement as HTMLElement;
const overlay = (f: ComponentFixture<AppComponent>) => el(f).querySelector<HTMLElement>('.sitemap-overlay');
const hamburger = (f: ComponentFixture<AppComponent>) => el(f).querySelector<HTMLButtonElement>('.hamburger-button')!;
const omnibar = (f: ComponentFixture<AppComponent>) =>
  el(f).querySelector<HTMLInputElement>('app-navigation-dropdown .omnibar-input')!;
const itemLabels = (f: ComponentFixture<AppComponent>) =>
  [...el(f).querySelectorAll('.sitemap-item-label')].map((n) => n.textContent!.trim());
const trapAnchors = (f: ComponentFixture<AppComponent>) => [
  ...(overlay(f)?.parentElement?.querySelectorAll('.cdk-focus-trap-anchor') ?? []),
];

function escape(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

function type(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('AppComponent shell (characterization)', () => {
  beforeEach(() => {
    lang = 'en';
    localStorage.clear();
  });

  afterEach(() => {
    document.querySelectorAll('app-root').forEach((n) => n.remove());
    localStorage.clear();
  });

  describe('skip link', () => {
    it('is the first link and targets the focusable main landmark', async () => {
      const f = await render();
      const skip = el(f).querySelector<HTMLAnchorElement>('.app-container > a.skip-link')!;
      expect(skip.getAttribute('href')).toBe('#main-content');
      expect(skip.textContent!.trim()).toBe('app.nav.skipToContent');

      const main = el(f).querySelector<HTMLElement>('#main-content')!;
      // A native <main>, not a div with role="main": a page header inside it
      // must not count as a nested banner landmark.
      expect(main.tagName).toBe('MAIN');
      expect(main.hasAttribute('role')).toBe(false);
      expect(el(f).querySelectorAll('main').length).toBe(1);
      expect(main.getAttribute('tabindex')).toBe('-1');
      expect(main.querySelector('router-outlet')).not.toBeNull();
    });

    it('moves focus to #main-content and cancels the jump', async () => {
      const f = await render();
      const main = el(f).querySelector<HTMLElement>('#main-content')!;
      main.scrollIntoView = () => undefined;
      const click = new MouseEvent('click', { bubbles: true, cancelable: true });
      el(f).querySelector<HTMLAnchorElement>('a.skip-link')!.dispatchEvent(click);
      expect(click.defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(main);
    });
  });

  describe('sitemap opened from the sitemap button (modal)', () => {
    it('is a labeled modal dialog with focus on its close button and an armed trap', async () => {
      const f = await render();
      expect(overlay(f)).toBeNull();
      hamburger(f).focus();
      hamburger(f).click();
      await settle(f);

      const dialog = overlay(f)!;
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(dialog.getAttribute('aria-labelledby')).toBe('sitemap-heading');
      expect(dialog.querySelector('#sitemap-heading')!.textContent!.trim()).toBe('app.nav.sitemap');
      expect(document.activeElement).toBe(dialog.querySelector('.sitemap-close-btn'));
      expect(el(f).querySelector('.sitemap-backdrop')!.getAttribute('aria-hidden')).toBe('true');
      const anchors = trapAnchors(f);
      expect(anchors.length).toBe(2);
      expect(anchors.every((a) => a.getAttribute('tabindex') === '0')).toBe(true);
      expect(itemLabels(f)).toEqual(['Glossary', 'Timeline', 'Catalog']);
      expect([...dialog.querySelectorAll('.sitemap-group-title')].map((h) => h.textContent)).toEqual([
        'Learn',
        'Tools',
      ]);
    });

    it('closes on Escape and returns focus to the button', async () => {
      const f = await render();
      hamburger(f).focus();
      hamburger(f).click();
      await settle(f);

      escape();
      await settle(f);
      expect(overlay(f)).toBeNull();
      expect(document.activeElement).toBe(hamburger(f));
    });

    it('closes from the close button and from the backdrop', async () => {
      const f = await render();
      hamburger(f).click();
      await settle(f);
      overlay(f)!.querySelector<HTMLButtonElement>('.sitemap-close-btn')!.click();
      await settle(f);
      expect(overlay(f)).toBeNull();

      hamburger(f).click();
      await settle(f);
      el(f).querySelector<HTMLElement>('.sitemap-backdrop')!.click();
      await settle(f);
      expect(overlay(f)).toBeNull();
      expect(el(f).querySelector('.sitemap-backdrop')).toBeNull();
    });

    it('navigates from an item and closes', async () => {
      const f = await render();
      hamburger(f).click();
      await settle(f);
      const nav = TestBed.inject(NavigationService) as unknown as NavigationStub;
      overlay(f)!.querySelectorAll<HTMLButtonElement>('button.sitemap-item')[2].click();
      await settle(f);
      expect(nav.navigated.map((p) => p.route)).toEqual(['/catalog']);
      expect(overlay(f)).toBeNull();
    });
  });

  describe('sitemap opened from the omnibar (non-modal)', () => {
    it('opens on focus without aria-modal and without an armed trap, focus stays in the input', async () => {
      const f = await render();
      omnibar(f).focus();
      await settle(f);

      const dialog = overlay(f)!;
      expect(dialog.getAttribute('role')).toBe('dialog');
      expect(dialog.hasAttribute('aria-modal')).toBe(false);
      expect(trapAnchors(f).every((a) => !a.hasAttribute('tabindex') || a.getAttribute('tabindex') === '-1')).toBe(
        true,
      );
      expect(document.activeElement).toBe(omnibar(f));
    });

    it('filters live, highlights the hit, shows a matchTerm hint, and clears on close', async () => {
      const f = await render();
      omnibar(f).focus();
      type(omnibar(f), 'glo');
      await settle(f);
      expect(itemLabels(f)).toEqual(['Glossary']);
      expect(overlay(f)!.querySelector('.sitemap-item-label mark.omnibar-hit')!.textContent).toBe('Glo');

      type(omnibar(f), 'hist');
      await settle(f);
      expect(itemLabels(f)).toEqual(['Timeline']);
      expect(overlay(f)!.querySelector('.sitemap-item-via')!.textContent).toBe('history');

      escape();
      await settle(f);
      expect(overlay(f)).toBeNull();
      expect(omnibar(f).value).toBe('');
      // Escape never refocuses the omnibar (its focus handler would reopen the sitemap).
      expect(overlay(f)).toBeNull();
    });

    it('shows the empty state for no match and its clear action restores every group', async () => {
      const f = await render();
      omnibar(f).focus();
      type(omnibar(f), 'zzzz');
      await settle(f);

      const empty = overlay(f)!.querySelector('.sitemap-empty')!;
      expect(empty.getAttribute('role')).toBe('status');
      expect(empty.querySelector('.sitemap-empty-query-value')!.textContent).toBe('zzzz');
      expect(overlay(f)!.querySelector('.sitemap-groups')!.classList).toContain('sitemap-groups--empty');

      empty.querySelector<HTMLButtonElement>('.sitemap-empty-clear')!.click();
      await settle(f);
      expect(itemLabels(f)).toEqual(['Glossary', 'Timeline', 'Catalog']);
      expect(omnibar(f).value).toBe('');
    });

    it('drives the same filter from the mobile search input', async () => {
      const f = await render();
      hamburger(f).click();
      await settle(f);
      type(overlay(f)!.querySelector<HTMLInputElement>('.sitemap-search-input')!, 'cat');
      await settle(f);
      expect(itemLabels(f)).toEqual(['Catalog']);
    });
  });

  describe('sitemap safety nets', () => {
    it('closes after any finished navigation and focuses the main landmark', async () => {
      const f = await render();
      hamburger(f).click();
      await settle(f);
      await TestBed.inject(Router).navigateByUrl('/somewhere');
      await settle(f);
      expect(overlay(f)).toBeNull();
      expect(document.activeElement).toBe(el(f).querySelector('#main-content'));
    });

    it('closes on window scroll', async () => {
      const f = await render();
      hamburger(f).click();
      await settle(f);
      window.dispatchEvent(new Event('scroll'));
      await settle(f);
      expect(overlay(f)).toBeNull();
    });
  });

  describe('language switch', () => {
    it('re-labels the open sitemap when the language changes', async () => {
      const f = await render();
      hamburger(f).click();
      await settle(f);
      expect(itemLabels(f)).toEqual(['Glossary', 'Timeline', 'Catalog']);

      lang = 'de';
      (TestBed.inject(TranslationService) as unknown as TranslationStub).languageChanged.next({});
      await settle(f);
      expect(itemLabels(f)).toEqual(['Glossar', 'Zeitleiste', 'Katalog']);
      expect([...overlay(f)!.querySelectorAll('.sitemap-group-title')].map((h) => h.textContent)).toEqual([
        'Lernen',
        'Werkzeuge',
      ]);
    });
  });

  describe('frame', () => {
    it('shows the kit name and logo icon with the kit defaults', async () => {
      const f = await render();
      expect(el(f).querySelector('.app-title-link span')!.textContent).toBe('vibecore');
      expect([...el(f).querySelector('.app-title-icon')!.classList].sort()).toEqual(['app-title-icon', 'pi', 'pi-box']);
      expect(el(f).querySelector('.footer-copyright')!.textContent).toContain('vibecore');
    });

    it('names the site from site.json in the header, the footer and the printout', async () => {
      const f = await render(
        createSiteRules({
          ...KIT_DEFAULT_SITE,
          name: 'Mathe mit Frau Schulz',
          shortName: 'Mathe',
          logoIcon: 'pi pi-book',
        }),
      );
      const link = el(f).querySelector('.app-title-link')!;
      expect(link.querySelector('span')!.textContent).toBe('Mathe');
      expect(link.getAttribute('aria-label')).toBe('Mathe mit Frau Schulz - app.nav.home');
      expect([...link.querySelector('i')!.classList].sort()).toEqual(['app-title-icon', 'pi', 'pi-book']);
      expect(el(f).querySelector('.footer-copyright')!.textContent).toContain('Mathe mit Frau Schulz');
      expect(el(f).querySelector('.print-header-title')!.textContent).toBe('Mathe mit Frau Schulz');
      expect(el(f).querySelector('.print-footer')!.textContent).toContain('Mathe mit Frau Schulz');
      expect(el(f).textContent).not.toContain('vibecore');
    });

    it('keeps one banner, the navigation landmark and no second h1', async () => {
      const f = await render();
      expect(el(f).querySelectorAll('header[role="banner"]').length).toBe(1);
      expect(el(f).querySelector('nav[role="navigation"]')!.getAttribute('aria-label')).toBe('app.nav.main');
      expect(el(f).querySelector('.app-title-link')!.getAttribute('aria-label')).toBe(
        `${KIT_DEFAULT_SITE.name} - app.nav.home`,
      );
      expect(el(f).querySelectorAll('h1').length).toBe(0);
      expect(el(f).querySelector('.print-header .print-header-title')!.textContent).toBe(KIT_DEFAULT_SITE.name);
      expect(el(f).querySelector('.print-footer')!.textContent).toContain('app.footer.printLicense');
      // The printout names the host it was printed from, never a placeholder domain.
      expect(el(f).querySelector('.print-header')!.textContent).not.toContain('example.com');
      expect(el(f).querySelector('.print-footer')!.textContent).not.toContain('example.com');
      if (window.location.host) {
        expect(el(f).querySelector('.print-header-url')!.textContent).toBe(window.location.host);
        expect(el(f).querySelector('.print-footer-url')!.textContent).toBe(window.location.host);
      }
    });
  });
});
