import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { SourcesComponent } from './sources.component';
import { Source, SourcesService } from '../../services/book-sources.service';
import { TranslationService } from '../../services/translation.service';
import { DemosService } from '../../services/demos.service';
import { ToastService } from '../../services/toast.service';
import { FabRegistryService } from '../../services/fab-registry.service';
import { ALL_SOURCES, BOOK, PAPER, WEB } from './sources.fixtures';
import { SourcesExportDialogComponent } from './sources-export-dialog.component';
import { SourcesFilterBarComponent } from './sources-filter-bar.component';
import { SourcesListComponent } from './sources-list.component';
import { chapterAnchorId } from './sources-filter';

/**
 * Characterization tests for the sources page: scope, search and filter
 * behavior, chapter/portal grouping, the ToC it derives, and the two export
 * paths (file download and the document.write print window). They drive the
 * container with its view stubbed out, so they pin the page's state logic and
 * survive the split into child components unchanged.
 */

const DICT: Record<string, string> = {
  'sources.chapters.ch1': 'Kapitel Eins',
  'sources.filter.title': 'Filter',
  'sources.types.book': 'Buch',
  'sources.types.paper': 'Paper',
  'sources.types.website': 'Webseite',
  'sources.portalGroups.articles': 'Artikel',
  'sources.portalGroups.demos': 'Demos',
  'articleGitIntro.hero.title': 'Git-Einstieg',
  'demo.embeddings.title': 'Word Embeddings',
  'sources.export.success': '{count} Quellen exportiert',
  'sources.export.pdfPrintHint': 'Druckdialog geöffnet',
};

describe('SourcesComponent', () => {
  let sources$: BehaviorSubject<Source[]>;
  let references$: BehaviorSubject<Record<string, unknown>>;
  let queryParams$: BehaviorSubject<Record<string, string>>;
  let languageChanged: Subject<string>;
  const toast = { showSuccess: vi.fn() };
  const fab = { register: vi.fn(), unregister: vi.fn(), updateVisibility: vi.fn() };
  const router = { navigate: vi.fn() };
  const portalRefs: Record<string, { type: string; id: string }[]> = {
    b1: [{ type: 'article', id: 'art-git-intro' }],
    p1: [{ type: 'demo', id: 'embeddings' }],
  };

  async function create(routeData: Record<string, string> = {}): Promise<SourcesComponent> {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TranslationService,
          // A missing key echoes itself, as TranslationService.translate() does
          useValue: { translate: (k: string) => DICT[k] ?? k, languageChanged, currentLanguage: 'de' },
        },
        {
          provide: SourcesService,
          useValue: {
            sources$,
            references$,
            getBookSources: () => [BOOK, PAPER],
            getPortalSources: () => [BOOK, PAPER, WEB],
            getPortalRefsForSource: (id: string) => portalRefs[id] ?? [],
          },
        },
        {
          provide: DemosService,
          useValue: { getAllDemos: () => of([{ id: 'embeddings', titleKey: 'demo.embeddings.title' }]) },
        },
        { provide: ToastService, useValue: toast },
        { provide: FabRegistryService, useValue: fab },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { data: routeData }, queryParams: queryParams$ } },
      ],
    });
    TestBed.overrideComponent(SourcesComponent, { set: { template: '', imports: [] } });
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(SourcesComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(() => {
    // The cursor-glow directive and the theme service read window.matchMedia.
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
    sources$ = new BehaviorSubject<Source[]>(ALL_SOURCES);
    references$ = new BehaviorSubject<Record<string, unknown>>({});
    queryParams$ = new BehaviorSubject<Record<string, string>>({});
    languageChanged = new Subject<string>();
    vi.clearAllMocks();
  });

  describe('loading', () => {
    it('shows the export FAB once sources arrive', async () => {
      await create();
      expect(fab.register).toHaveBeenCalledWith(expect.objectContaining({ id: 'book-sources-export', visible: false }));
      expect(fab.updateVisibility).toHaveBeenCalledWith('book-sources-export', true);
    });

    it('takes the scope from route data, then from ?filter=', async () => {
      queryParams$.next({});
      expect((await create({ defaultFilter: 'book' })).sourceScope()).toBe('book');
      TestBed.resetTestingModule();
      queryParams$.next({ filter: 'portal' });
      expect((await create({ defaultFilter: 'book' })).sourceScope()).toBe('portal');
    });
  });

  describe('filtering', () => {
    it('returns every source when nothing is filtered', async () => {
      expect((await create()).filteredSources()).toEqual(ALL_SOURCES);
    });

    it.each([
      ['title', 'attention', [PAPER]],
      ['authors', 'NORVIG', [BOOK]],
      ['publication', 'pearson', [BOOK]],
      ['chapter', 'kapitel 1', [BOOK, WEB]],
      ['subChapter', 'grundlagen', [BOOK]],
    ])('searches %s case-insensitively', async (_field, term, expected) => {
      const c = await create();
      c.searchTerm.set(term as string);
      expect(c.filteredSources()).toEqual(expected);
    });

    it('filters by parent chapter and by type, combined with search', async () => {
      const c = await create();
      c.selectedChapter.set('ch1');
      expect(c.filteredSources()).toEqual([BOOK, WEB]);
      c.selectedType.set('website');
      expect(c.filteredSources()).toEqual([WEB]);
      c.searchTerm.set('nothing matches');
      expect(c.filteredSources()).toEqual([]);
      expect(c.hasActiveFilters()).toBe(true);
      c.clearAllFilters();
      expect(c.filteredSources()).toEqual(ALL_SOURCES);
      expect(c.hasActiveFilters()).toBe(false);
    });

    it('narrows to the book or portal subset by scope', async () => {
      const c = await create();
      c.setSourceScope('book');
      expect(c.filteredSources()).toEqual([BOOK, PAPER]);
      expect(router.navigate).toHaveBeenLastCalledWith(
        [],
        expect.objectContaining({ queryParams: { filter: 'book' } }),
      );
      c.selectedChapter.set('ch1');
      c.setSourceScope('portal');
      expect(c.selectedChapter()).toBeNull();
      expect(c.filteredSources()).toEqual([BOOK, PAPER, WEB]);
      c.setSourceScope('all');
      expect(router.navigate).toHaveBeenLastCalledWith([], expect.objectContaining({ queryParams: {} }));
    });

    it('offers chapter and type options derived from the loaded sources', async () => {
      const c = await create();
      expect(c.chapterOptions()).toEqual([
        { label: 'Kapitel Eins', value: 'ch1' },
        { label: 'Kapitel 2', value: 'ch2' },
      ]);
      expect(c.typeOptions()).toEqual([
        { value: 'paper', label: 'Paper' },
        { value: 'book', label: 'Buch' },
        { value: 'website', label: 'Webseite' },
      ]);
    });
  });

  describe('grouping', () => {
    it('groups by book chapter, translated name first, sorted by number', async () => {
      const c = await create();
      expect(c.sourcesByChapter()).toEqual([
        { chapterId: 'ch1', chapterName: 'Kapitel Eins', chapterNumber: 1, sources: [BOOK, WEB] },
        { chapterId: 'ch2', chapterName: 'Kapitel 2', chapterNumber: 2, sources: [PAPER] },
      ]);
    });

    it('groups by portal content in portal scope, resolving titles', async () => {
      const c = await create();
      c.sourceScope.set('portal');
      expect(c.sourcesByChapter().map((g) => [g.chapterId, g.chapterName, g.chapterNumber, g.sources])).toEqual([
        ['article:art-git-intro', 'Artikel: Git-Einstieg', 1, [BOOK]],
        ['demo:embeddings', 'Demos: Word Embeddings', 4, [PAPER]],
        ['other:uncategorized', 'other: uncategorized', 99, [WEB]],
      ]);
    });

    // The ToC used to link to chapter-<number> while the headings carry
    // chapter-<chapterId>, so no entry landed. Both now come from chapterAnchorId().
    it('derives the ToC from the groups, linking to the ids the headings carry', async () => {
      const c = await create();
      expect(c.tocItems()).toEqual([
        { id: 'filters', label: 'Filter', icon: 'pi pi-filter' },
        { id: 'chapter-ch1', label: 'Kapitel Eins', icon: 'pi pi-book' },
        { id: 'chapter-ch2', label: 'Kapitel 2', icon: 'pi pi-book' },
      ]);
    });

    it('keeps ToC ids unique in portal scope, where chapter numbers repeat', async () => {
      const c = await create();
      c.sourceScope.set('portal');
      const ids = c.tocItems().map((t) => t.id);
      expect(ids).toEqual([
        'filters',
        'chapter-article-art-git-intro',
        'chapter-demo-embeddings',
        'chapter-other-uncategorized',
      ]);
      expect(ids.slice(1)).toEqual(c.sourcesByChapter().map((g) => chapterAnchorId(g.chapterId)));
    });

    it('links every ToC entry to a heading the list actually renders', async () => {
      const c = await create();
      // The cards sit in @defer (on viewport); jsdom has no IntersectionObserver.
      vi.stubGlobal(
        'IntersectionObserver',
        class {
          observe(): void {}
          unobserve(): void {}
          disconnect(): void {}
        },
      );
      onTestFinished(() => {
        vi.unstubAllGlobals();
      });
      const list = TestBed.createComponent(SourcesListComponent);
      list.componentRef.setInput('groups', c.sourcesByChapter());
      list.componentRef.setInput('loaded', true);
      list.detectChanges();
      const headingIds = [...(list.nativeElement as HTMLElement).querySelectorAll('h2.chapter-header')].map(
        (h) => h.id,
      );
      expect(headingIds.length).toBe(2);
      expect(
        c
          .tocItems()
          .slice(1)
          .map((t) => t.id),
      ).toEqual(headingIds);
    });
  });

  describe('export', () => {
    let blobs: Blob[];
    let downloads: string[];

    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2026, 2, 5, 12, 0, 0));
      blobs = [];
      downloads = [];
      vi.spyOn(window.URL, 'createObjectURL').mockImplementation((b) => {
        blobs.push(b as Blob);
        return 'blob:x';
      });
      vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => undefined);
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
        downloads.push(this.download);
      });
    });
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    function runExport(
      c: SourcesComponent,
      opts: { citationFormat: string; fileFormat: string; exportAll?: boolean; bookCitationOnly?: boolean },
    ): void {
      c.exportDialogVisible.set(true);
      c.downloadBibliography({
        citationFormat: opts.citationFormat,
        fileFormat: opts.fileFormat,
        exportAll: !!opts.exportAll,
        bookCitationOnly: !!opts.bookCitationOnly,
      });
    }

    it('downloads the filtered sources as Markdown grouped by chapter', async () => {
      const c = await create();
      c.selectedType.set('paper');
      runExport(c, { citationFormat: 'apa7', fileFormat: 'md' });
      expect(downloads).toEqual(['bibliography-apa7-filtered-2026-03-05.md']);
      expect(blobs[0].type).toBe('text/markdown;charset=utf-8');
      const body = await blobs[0].text();
      expect(body).toContain('**Zitierstil:** APA 7th Edition');
      expect(body).toContain('**Quellen:** 1');
      expect(body).toContain('## Kapitel 2\n\nVaswani, A. (2017).');
      expect(c.exportDialogVisible()).toBe(false);
      expect(toast.showSuccess).toHaveBeenCalledWith('1 Quellen exportiert', 'APA 7th Edition');
    });

    it('exports every source when the all-switch is on, ordered by chapter', async () => {
      const c = await create();
      c.selectedType.set('paper');
      runExport(c, { citationFormat: 'basic', fileFormat: 'txt', exportAll: true });
      expect(downloads).toEqual(['bibliography-basic-all-2026-03-05.txt']);
      const body = await blobs[0].text();
      expect(body.indexOf('KAPITEL 1')).toBeGreaterThan(-1);
      expect(body.indexOf('KAPITEL 1')).toBeLessThan(body.indexOf('KAPITEL 2'));
      expect(body).toContain('Quellen: 3');
    });

    it('writes BibTeX with its own MIME type', async () => {
      const c = await create();
      runExport(c, { citationFormat: 'ieee', fileFormat: 'bib' });
      expect(downloads).toEqual(['bibliography-ieee-filtered-2026-03-05.bib']);
      expect(blobs[0].type).toBe('application/x-bibtex;charset=utf-8');
      expect(await blobs[0].text()).toContain('@book{russell2021artificial,');
    });

    it('applies the dev-only bookCitation filter', async () => {
      const c = await create();
      runExport(c, { citationFormat: 'apa7', fileFormat: 'md', bookCitationOnly: true });
      expect(await blobs[0].text()).toContain('**Quellen:** 1');
    });

    it('prints PDF via an escaped document written into a new window', async () => {
      const write = vi.fn();
      const fake = { document: { write, close: vi.fn() }, print: vi.fn(), onload: null as null | (() => void) };
      const open = vi.spyOn(window, 'open').mockReturnValue(fake as unknown as Window);
      const c = await create();
      runExport(c, { citationFormat: 'apa7', fileFormat: 'pdf' });
      expect(open).toHaveBeenCalledWith('', '_blank');
      const doc = write.mock.calls[0][0] as string;
      expect(doc).toContain('&lt;b&gt;Tags&lt;/b&gt; &amp; &quot;quotes&quot;');
      expect(doc).not.toContain('<b>Tags</b>');
      expect(fake.document.close).toHaveBeenCalled();
      fake.onload?.();
      expect(fake.print).toHaveBeenCalled();
      expect(downloads).toEqual([]);
      expect(c.exportDialogVisible()).toBe(false);
      expect(toast.showSuccess).toHaveBeenCalledWith('Druckdialog geöffnet', 'APA 7th Edition');
    });

    it('stays open and silent when the print window is blocked', async () => {
      vi.spyOn(window, 'open').mockReturnValue(null);
      const c = await create();
      runExport(c, { citationFormat: 'apa7', fileFormat: 'pdf' });
      expect(c.exportDialogVisible()).toBe(true);
      expect(toast.showSuccess).not.toHaveBeenCalled();
    });
  });
});

describe('SourcesExportDialogComponent', () => {
  it('asks for DIN ISO 690 as Markdown of the filtered list by default', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslationService, useValue: { translate: (k: string) => k } }],
    });
    const dialog = TestBed.runInInjectionContext(() => new SourcesExportDialogComponent());
    const emitted: unknown[] = [];
    dialog.download.subscribe((c) => emitted.push(c));
    dialog.requestDownload();
    dialog.exportAllSources.set(true);
    dialog.selectedFileFormat.set(null);
    dialog.requestDownload();
    expect(emitted).toEqual([
      { citationFormat: 'din-iso-690', fileFormat: 'md', exportAll: false, bookCitationOnly: false },
    ]);
  });
});

describe('SourcesFilterBarComponent', () => {
  it('clears all three criteria at once', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslationService, useValue: { translate: (k: string) => k } }],
    });
    const bar = TestBed.runInInjectionContext(() => new SourcesFilterBarComponent());
    bar.searchTerm.set('x');
    bar.selectedChapter.set('ch1');
    bar.selectedType.set('book');
    expect(bar.hasActiveFilters()).toBe(true);
    bar.clearAll();
    expect([bar.searchTerm(), bar.selectedChapter(), bar.selectedType()]).toEqual(['', null, null]);
    expect(bar.hasActiveFilters()).toBe(false);
  });
});
