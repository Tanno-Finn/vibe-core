/**
 * CatalogComponent spec — characterization of the catalog page's behavior,
 * written before the page was split into a container, child components and a
 * favorites/compare service, so the split can prove it changed nothing:
 *
 *  - sorting (rating by default, alphabetical, newest) and pagination,
 *  - filtering: the filter bar's search term goes to CatalogService, the
 *    quick filters (top rated, free & German, only favorites) narrow on top,
 *  - URL state: `?search=` is applied after the first render, and a later
 *    query-param change applies at once,
 *  - favorites and the comparison list survive a reload through
 *    localStorage, legacy keys are merged, and the compare view opens,
 *  - the details drawer opens on a card and shows similar entries.
 *
 * Everything is driven through the DOM or the services a user reaches, not
 * through the component's own fields, so the tests hold across the split.
 * TranslationService is stubbed to return the key; CatalogService is stubbed
 * with four entries and a search-only filter.
 */
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Params } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, Subject, of } from 'rxjs';

import { TranslationService } from '../../services/translation.service';
import { CatalogComponent } from './catalog.component';
import { CatalogService } from '../../services/catalog.service';
import { ArticleMetaService } from '../../services/article-meta.service';
import { ArticlesService } from '../../services/articles.service';
import { ShareService } from '../../services/share.service';
import { FabRegistryService } from '../../services/fab-registry.service';
import { CatalogEntry, CatalogFilters, getDisplayName } from '../../models/catalog.model';

class TranslationStub {
  currentLanguage = 'en';
  // The signal surface TranslationService grew in the i18n split; services the
  // page pulls in (HighlightingService) read these in an effect.
  readonly currentLanguage$ = signal('en').asReadonly();
  readonly translationsVersion = signal(0).asReadonly();
  readonly lastLanguageChange = signal(null).asReadonly();
  readonly languageChanged = new Subject<unknown>();
  readonly isTranslationsLoaded = new BehaviorSubject(true);
  translate = (key: string) => key;
  translateValue = () => null;
  isLanguageFullyLoaded = () => true;
  getCurrentLanguageInfo = () => undefined;
}

const ENTRIES: CatalogEntry[] = [
  {
    id: 'tool-alpha',
    entryType: 'tool',
    name: 'Alpha',
    category: 'coding',
    pricing: 'free',
    deployment: 'cloud',
    difficulty: 'Beginner',
    rating: 4.8,
    url: 'https://alpha.example',
    tags: ['a'],
    description: 'Alpha description',
    shortDescription: 'Alpha short',
    features: ['f1', 'f2'],
    useCases: ['u1'],
    updatedAt: '2024-01-01',
  },
  {
    id: 'tool-bravo',
    entryType: 'tool',
    name: 'Bravo',
    category: 'coding',
    pricing: 'premium',
    deployment: 'on-premise',
    difficulty: 'Expert',
    rating: 3,
    url: 'https://bravo.example',
    tags: [],
    description: 'Bravo description',
    shortDescription: 'Bravo short',
    updatedAt: '2025-06-01',
  },
  {
    id: 'rsrc-charlie',
    entryType: 'resource',
    title: 'Charlie',
    mediaType: 'video',
    topic: 'ethics',
    language: 'de',
    source: 'Charlie Source',
    difficulty: 'beginner',
    rating: 4.6,
    url: 'https://charlie.example',
    tags: [],
    description: 'Charlie description',
    shortDescription: 'Charlie short',
    createdAt: '2023-01-01',
  },
  {
    id: 'rsrc-delta',
    entryType: 'resource',
    title: 'Delta',
    mediaType: 'video',
    topic: 'business',
    language: 'en',
    source: 'Delta Source',
    difficulty: 'expert',
    rating: 4,
    url: 'https://delta.example',
    tags: [],
    description: 'Delta description',
    shortDescription: 'Delta short',
    createdAt: '2025-12-01',
  },
] as CatalogEntry[];

class CatalogStub {
  readonly catalog$ = new BehaviorSubject<CatalogEntry[]>(ENTRIES);
  lastFilters: CatalogFilters | null = null;
  filterEntries = (entries: CatalogEntry[], filters: CatalogFilters): CatalogEntry[] => {
    this.lastFilters = filters;
    const term = (filters.searchTerm ?? '').toLowerCase();
    return term ? entries.filter((e) => getDisplayName(e).toLowerCase().includes(term)) : entries;
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
}

let queryParams: BehaviorSubject<Params>;
let initialSearch: string | null;

async function render(): Promise<ComponentFixture<CatalogComponent>> {
  stubMatchMedia();
  TestBed.configureTestingModule({
    imports: [CatalogComponent],
    providers: [
      provideRouter([]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: TranslationService, useClass: TranslationStub },
      { provide: CatalogService, useClass: CatalogStub },
      {
        provide: ActivatedRoute,
        useFactory: () => ({
          snapshot: { queryParamMap: convertToParamMap(initialSearch ? { search: initialSearch } : {}) },
          queryParams: queryParams.asObservable(),
        }),
      },
      {
        provide: ArticleMetaService,
        useValue: {
          getArticlesReferencingTool: (id: string) => (id === 'alpha' ? ['art-one'] : []),
          getArticlesReferencingResource: () => [],
        },
      },
      {
        provide: ArticlesService,
        useValue: { getAll: () => of([{ id: 'art-one', titleKey: 'Fake Article Title', path: 'one' }]) },
      },
      {
        provide: ShareService,
        useValue: { createShareData: () => ({}), share: () => Promise.resolve() },
      },
    ],
  });
  const fixture = TestBed.createComponent(CatalogComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  // afterNextRender (the initial ?search) has run now; render what it changed.
  await settle(fixture);
  return fixture;
}

async function settle(fixture: ComponentFixture<CatalogComponent>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
}

const el = (f: ComponentFixture<CatalogComponent>) => f.nativeElement as HTMLElement;

function cardTitles(f: ComponentFixture<CatalogComponent>): string[] {
  return [...el(f).querySelectorAll('.catalog-grid app-generic-card .card-title')].map((h) => h.textContent!.trim());
}

function card(f: ComponentFixture<CatalogComponent>, title: string): HTMLElement {
  const found = [...el(f).querySelectorAll<HTMLElement>('.catalog-grid app-generic-card')].find(
    (c) => c.querySelector('.card-title')?.textContent?.trim() === title,
  );
  if (!found) throw new Error(`no card "${title}"`);
  return found;
}

/** Click the inner <button> of a p-button, or the element itself. */
function click(target: Element | null | undefined): void {
  if (!target) throw new Error('nothing to click');
  const button = target.tagName === 'BUTTON' ? target : target.querySelector('button');
  (button as HTMLElement).click();
}

function buttonByLabel(f: ComponentFixture<CatalogComponent>, labelStart: string): HTMLButtonElement {
  const found = [...el(f).querySelectorAll<HTMLButtonElement>('button')].find((b) =>
    (b.getAttribute('aria-label') ?? b.textContent ?? '').trim().startsWith(labelStart),
  );
  if (!found) throw new Error(`no button "${labelStart}"`);
  return found;
}

function quickFilter(f: ComponentFixture<CatalogComponent>, key: string): HTMLButtonElement {
  const found = [...el(f).querySelectorAll<HTMLButtonElement>('.quick-filters button')].find((b) =>
    b.textContent!.includes(`catalog.quickFilters.${key}`),
  );
  if (!found) throw new Error(`no quick filter ${key}`);
  return found;
}

function stored(key: string): string[] | null {
  const raw = localStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
}

describe('CatalogComponent (characterization)', () => {
  beforeEach(() => {
    localStorage.clear();
    queryParams = new BehaviorSubject<Params>({});
    initialSearch = null;
  });

  afterEach(() => localStorage.clear());

  describe('sorting', () => {
    it('lists every entry by rating, best first, and counts them', async () => {
      const f = await render();
      expect(cardTitles(f)).toEqual(['Alpha', 'Charlie', 'Delta', 'Bravo']);
      expect(el(f).querySelector('.results-count')!.textContent).toContain('4');
      expect(el(f).querySelector('.results-count')!.getAttribute('aria-live')).toBe('polite');
    });

    it('sorts alphabetically and by newest date from the sort buttons', async () => {
      const f = await render();
      const options = [...el(f).querySelectorAll<HTMLElement>('.sort-buttons .p-togglebutton')];
      expect(options.map((o) => o.textContent!.trim())).toEqual([
        'catalog.sort.rating',
        'catalog.sort.alphabetical',
        'catalog.sort.newest',
      ]);

      options[1].click();
      await settle(f);
      expect(cardTitles(f)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);

      options[2].click();
      await settle(f);
      expect(cardTitles(f)).toEqual(['Delta', 'Bravo', 'Alpha', 'Charlie']);
    });
  });

  describe('filtering', () => {
    it('keeps only top-rated entries (>= 4.5) and toggles back', async () => {
      const f = await render();
      const topRated = quickFilter(f, 'topRated');
      expect(topRated.closest('p-button')!.getAttribute('aria-pressed')).toBe('false');

      topRated.click();
      await settle(f);
      expect(cardTitles(f)).toEqual(['Alpha', 'Charlie']);
      expect(quickFilter(f, 'topRated').closest('p-button')!.getAttribute('aria-pressed')).toBe('true');

      quickFilter(f, 'topRated').click();
      await settle(f);
      expect(cardTitles(f)).toHaveLength(4);
    });

    it('keeps free tools and German resources for "free and German"', async () => {
      const f = await render();
      quickFilter(f, 'freeAndGerman').click();
      await settle(f);
      expect(cardTitles(f)).toEqual(['Alpha', 'Charlie']);
    });

    it('shows the empty state when nothing matches', async () => {
      initialSearch = 'zzz';
      const f = await render();
      expect(cardTitles(f)).toEqual([]);
      expect(el(f).querySelector('.no-results h3')!.textContent).toContain('catalog.noResults.title');
    });
  });

  describe('URL state', () => {
    it('applies ?search= after the first render and hands it to CatalogService', async () => {
      initialSearch = 'alp';
      const f = await render();
      const catalog = TestBed.inject(CatalogService) as unknown as CatalogStub;
      expect(catalog.lastFilters!.searchTerm).toBe('alp');
      expect(cardTitles(f)).toEqual(['Alpha']);
    });

    it('applies a later query-param change at once', async () => {
      const f = await render();
      queryParams.next({ search: 'del' });
      await settle(f);
      expect(cardTitles(f)).toEqual(['Delta']);
    });
  });

  describe('favorites', () => {
    it('stars an entry, persists it, and enables the favorites filter', async () => {
      const f = await render();
      const only = () => quickFilter(f, 'onlyFavorites');
      expect(only().textContent).toContain('(0)');
      expect(only().disabled).toBe(true);

      click(card(f, 'Delta').querySelector('[aria-label="catalog.actions.favorite"]'));
      await settle(f);

      expect(stored('catalog-favorites')).toEqual(['rsrc-delta']);
      expect(only().textContent).toContain('(1)');
      expect(card(f, 'Delta').querySelector('[aria-label="catalog.actions.removeFavorite"]')).not.toBeNull();

      only().click();
      await settle(f);
      expect(cardTitles(f)).toEqual(['Delta']);
    });

    it('restores favorites and the compare list from storage', async () => {
      localStorage.setItem('catalog-favorites', JSON.stringify(['tool-bravo']));
      localStorage.setItem('catalog-compare', JSON.stringify(['tool-alpha']));
      const f = await render();
      expect(card(f, 'Bravo').querySelector('[aria-label="catalog.actions.removeFavorite"]')).not.toBeNull();
      expect(card(f, 'Alpha').querySelector('[aria-label="catalog.actions.removeCompare"]')).not.toBeNull();
      expect(quickFilter(f, 'onlyFavorites').textContent).toContain('(1)');
    });

    it('merges the legacy favorite and compare keys and drops them', async () => {
      localStorage.setItem('catalog-favorites', JSON.stringify(['tool-bravo']));
      localStorage.setItem('ai-tools-favorites', JSON.stringify(['tool-alpha']));
      localStorage.setItem('ai-resources-favorites', JSON.stringify(['rsrc-delta']));
      localStorage.setItem('ai-tools-compare', JSON.stringify(['tool-bravo']));
      await render();
      expect(stored('catalog-favorites')).toEqual(['tool-bravo', 'tool-alpha', 'rsrc-delta']);
      expect(stored('catalog-compare')).toEqual(['tool-bravo']);
      expect(localStorage.getItem('ai-tools-favorites')).toBeNull();
      expect(localStorage.getItem('ai-resources-favorites')).toBeNull();
      expect(localStorage.getItem('ai-tools-compare')).toBeNull();
    });

    it('survives corrupt stored JSON with an empty list', async () => {
      localStorage.setItem('catalog-favorites', '{not json');
      const f = await render();
      expect(quickFilter(f, 'onlyFavorites').textContent).toContain('(0)');
    });
  });

  describe('comparison', () => {
    it('offers compare only on tools and persists the list', async () => {
      const f = await render();
      expect(card(f, 'Charlie').querySelector('[aria-label="catalog.actions.compare"]')).toBeNull();

      click(card(f, 'Alpha').querySelector('[aria-label="catalog.actions.compare"]'));
      await settle(f);
      expect(stored('catalog-compare')).toEqual(['tool-alpha']);

      click(card(f, 'Alpha').querySelector('[aria-label="catalog.actions.removeCompare"]'));
      await settle(f);
      expect(stored('catalog-compare')).toEqual([]);
    });

    it('opens the compare table from the compare FAB and clears it', async () => {
      localStorage.setItem('catalog-compare', JSON.stringify(['tool-alpha', 'tool-bravo']));
      const f = await render();
      const fab = TestBed.inject(FabRegistryService).getFab('compare');
      expect(fab?.badge).toBe(2);

      fab!.onClick!();
      await settle(f);

      const table = el(f).querySelector('.compare-table-view');
      expect(table).not.toBeNull();
      expect(table!.querySelector('h2')!.textContent).toContain('catalog.compare.title');
      expect([...table!.querySelectorAll('.compare-table thead h3')].map((h) => h.textContent!.trim())).toEqual([
        'Alpha',
        'Bravo',
      ]);
      expect(el(f).querySelector('.quick-filters')).toBeNull();
      expect(el(f).querySelector('#catalog-results')).toBeNull();
      expect(TestBed.inject(FabRegistryService).isRegistered('compare')).toBe(false);

      click(buttonByLabel(f, 'catalog.buttons.clearAll'));
      await settle(f);
      expect(el(f).querySelector('.compare-table-view')).toBeNull();
      expect(localStorage.getItem('catalog-compare')).toBeNull();
      expect(cardTitles(f)).toHaveLength(4);
    });

    it('leaves compare mode when fewer than two tools remain', async () => {
      localStorage.setItem('catalog-compare', JSON.stringify(['tool-alpha', 'tool-bravo']));
      const f = await render();
      TestBed.inject(FabRegistryService).getFab('compare')!.onClick!();
      await settle(f);

      click(el(f).querySelector('.compare-table [aria-label="catalog.actions.removeCompare: Bravo"]'));
      await settle(f);

      expect(el(f).querySelector('.compare-table-view')).toBeNull();
      expect(stored('catalog-compare')).toEqual(['tool-alpha']);
    });
  });

  describe('details drawer', () => {
    it('opens on a card with similar tools and referencing articles, and closes', async () => {
      const f = await render();
      card(f, 'Alpha').click();
      await settle(f);

      const drawer = document.querySelector('.catalog-details-sidebar');
      expect(drawer).not.toBeNull();
      expect(drawer!.querySelector('.entry-sidebar-title')!.textContent).toContain('Alpha');
      expect([...drawer!.querySelectorAll('.similar-tool-name')].map((n) => n.textContent!.trim())).toEqual(['Bravo']);
      expect(drawer!.querySelector('.referenced-article-item')!.textContent).toContain('Fake Article Title');

      (drawer!.querySelector('.sidebar-close-btn') as HTMLElement).click();
      await settle(f);
      expect(document.querySelector('.catalog-details-sidebar .sidebar-content')).toBeNull();
    });
  });

  describe('page frame', () => {
    it('keeps the landmarks the table of contents jumps to', async () => {
      const f = await render();
      for (const id of ['catalog-header', 'catalog-filters', 'catalog-results']) {
        expect(el(f).querySelector(`#${id}`), id).not.toBeNull();
      }
    });
  });
});
