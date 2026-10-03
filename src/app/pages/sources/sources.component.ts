import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
  OnDestroy,
  isDevMode,
  ViewEncapsulation,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';

// Services
import { TranslationService } from '../../services/translation.service';
import { SourcesService, Source } from '../../services/book-sources.service';
import { DemosService } from '../../services/demos.service';
import { ToastService } from '../../services/toast.service';
import { FabRegistryService, FAB_PRIORITIES } from '../../services/fab-registry.service';
import { BibliographyExportService } from './bibliography-export.service';

// Components
import { SimpleEasyLanguageFabComponent } from '../../components/shared/simple-easy-language-fab.component';
import { TableOfContentsFabComponent, TocItem } from '../../components/shared/table-of-contents-fab.component';
import { FabStackComponent } from '../../components/shared/fab-stack.component';
import { FocusReturn } from '../../utils/focus-return';
import { PageHeaderComponent } from '../../components/shared/page-header.component';
import { SourcesFilterBarComponent } from './sources-filter-bar.component';
import { SourcesListComponent } from './sources-list.component';
import { SourcesExportDialogComponent, SourcesExportChoice } from './sources-export-dialog.component';
import { translatedOr } from '../../utils/translate-or';
import {
  SourceGroup,
  SourceScope,
  chapterAnchorId,
  chapterOptionsFor,
  filterSources,
  groupSourcesByChapter,
  typeOptionsFor,
} from './sources-filter';

/**
 * The sources page (/sources, legacy /book-sources): every cited source,
 * scoped to book / portal / all, searchable and filterable, grouped by
 * chapter or by the portal content that cites it, and exportable as a
 * bibliography.
 *
 * This is the container. It owns the state (scope, filter criteria, the
 * loaded sources) and derives everything from it with computed signals; the
 * markup lives in three children — the filter bar, the result list and the
 * export dialog — and the pure logic in sources-filter.ts, citation-formats.ts
 * and bibliography.ts, with the browser I/O of the export in
 * BibliographyExportService.
 */
@Component({
  selector: 'app-sources',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    SimpleEasyLanguageFabComponent,
    TableOfContentsFabComponent,
    FabStackComponent,
    PageHeaderComponent,
    SourcesFilterBarComponent,
    SourcesListComponent,
    SourcesExportDialogComponent,
  ],
  template: `
    <div class="book-sources-page">
      <app-page-header titleKey="sources.title" subtitleKey="sources.intro"></app-page-header>

      <!-- Source Scope Toggle -->
      <div class="scope-toggle-container">
        <div class="scope-toggle" role="group" [attr.aria-label]="translate('sources.scope.label')">
          <button
            class="scope-btn"
            [class.active]="sourceScope() === 'all'"
            (click)="setSourceScope('all')"
            [attr.aria-pressed]="sourceScope() === 'all'"
          >
            <i class="pi pi-list"></i>
            <span>{{ translate('sources.scope.all') }}</span>
            <span class="count">({{ allSources().length }})</span>
          </button>
          <button
            class="scope-btn"
            [class.active]="sourceScope() === 'portal'"
            (click)="setSourceScope('portal')"
            [attr.aria-pressed]="sourceScope() === 'portal'"
          >
            <i class="pi pi-globe"></i>
            <span>{{ translate('sources.scope.portal') }}</span>
            <span class="count">({{ portalSources().length }})</span>
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <app-sources-filter-bar
        [(searchTerm)]="searchTerm"
        [(selectedChapter)]="selectedChapter"
        [(selectedType)]="selectedType"
        [showChapterFilter]="sourceScope() !== 'portal'"
        [chapterOptions]="chapterOptions()"
        [typeOptions]="typeOptions()"
        [filteredCount]="filteredSources().length"
        [totalCount]="allSources().length"
      ></app-sources-filter-bar>

      <!-- Skeletons, the grouped cards, or the empty state -->
      <app-sources-list
        [groups]="sourcesByChapter()"
        [loaded]="allSources().length > 0"
        (clearFilters)="clearAllFilters()"
      ></app-sources-list>

      <!-- FAB Stack with ToC, Easy Language, and Export -->
      <app-fab-stack>
        <app-table-of-contents-fab [items]="tocItems()" [title]="translate('sources.tableOfContents')">
        </app-table-of-contents-fab>

        <app-simple-easy-language-fab contentId="book-sources" contentType="article"> </app-simple-easy-language-fab>
      </app-fab-stack>

      <app-sources-export-dialog
        [(visible)]="exportDialogVisible"
        [hasActiveFilters]="hasActiveFilters()"
        [filteredCount]="filteredSources().length"
        [totalCount]="allSources().length"
        (closed)="closeExportDialog()"
        (download)="downloadBibliography($event)"
      ></app-sources-export-dialog>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      app-sources .book-sources-page {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem 2rem;
        font-family: var(--font-primary);
      }

      /* Scope Toggle */
      app-sources .scope-toggle-container {
        display: flex;
        justify-content: center;
        margin-bottom: 1.5rem;
      }

      app-sources .scope-toggle {
        display: inline-flex;
        background: var(--surface-card);
        border-radius: 12px;
        padding: 0.25rem;
        gap: 0.25rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      app-sources .scope-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border: none;
        border-radius: 10px;
        background: transparent;
        color: var(--text-color-secondary);
        font-family: var(--font-primary);
        font-size: 0.95rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      app-sources .scope-btn:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      app-sources .scope-btn.active {
        background: var(--primary-color);
        color: var(--primary-color-text, #fff);
        box-shadow: 0 2px 8px rgba(var(--primary-color-rgb, 245, 158, 11), 0.3);
      }

      app-sources .scope-btn .count {
        font-size: 0.85rem;
      }

      app-sources .scope-btn i {
        font-size: 1rem;
      }

      @media (max-width: 768px) {
        app-sources .scope-toggle {
          flex-direction: column;
          width: 100%;
          max-width: 100%;
        }

        app-sources .scope-btn {
          justify-content: center;
          padding: 0.75rem 1rem;
        }
      }

      @media (max-width: 768px) {
        app-sources .book-sources-page {
          padding: 1rem;
        }
      }

      /* CP-21: Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        app-sources .scope-btn {
          transition: none;
        }
      }
    `,
  ],
})
export class SourcesComponent implements OnInit, OnDestroy {
  private translationService = inject(TranslationService);
  private destroyRef = inject(DestroyRef);
  private sourcesService = inject(SourcesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private fabRegistry = inject(FabRegistryService);
  private demos = inject(DemosService);
  private bibliographyExport = inject(BibliographyExportService);

  private readonly EXPORT_FAB_ID = 'book-sources-export';

  /** demo id -> titleKey, for portal-scope group headers ("Demos: <Demo-Titel>"). */
  private demoTitleKeys = signal<Map<string, string>>(new Map());

  // Signals
  searchTerm = signal('');
  selectedChapter = signal<string | null>(null);
  selectedType = signal<string | null>(null);
  exportDialogVisible = signal(false);
  allSources = signal<Source[]>([]);

  // Reactive signals for book/portal sources (derived from allSources + references)
  bookSources = signal<Source[]>([]);
  portalSources = signal<Source[]>([]);

  // Source scope filter: all | book | portal
  sourceScope = signal<SourceScope>('all');

  filteredSources = computed(() => {
    // Start with sources based on scope filter
    const scope = this.sourceScope();
    const sources =
      scope === 'book' ? this.bookSources() : scope === 'portal' ? this.portalSources() : this.allSources();
    return filterSources(sources, {
      term: this.searchTerm(),
      chapter: this.selectedChapter(),
      type: this.selectedType(),
    });
  });

  // Group sources by chapter (book scope) or by portal content (portal scope)
  sourcesByChapter = computed<SourceGroup[]>(() => {
    const sources = this.filteredSources();
    // Portal scope: group by portal reference (article, guide, demo) instead of book chapters
    if (this.sourceScope() === 'portal') {
      return this.groupByPortalContent(sources);
    }
    return groupSourcesByChapter(sources, (key) => this.translate(key));
  });

  // Table of Contents - dynamically generate chapters from filtered sources
  tocItems = computed<TocItem[]>(() => {
    const items: TocItem[] = [
      {
        id: 'filters',
        label: this.translate('sources.filter.title'),
        icon: 'pi pi-filter',
      },
    ];

    // Get groups from grouped sources (already translated via sourcesByChapter)
    const chapterGroups = this.sourcesByChapter();
    const isPortalScope = this.sourceScope() === 'portal';
    chapterGroups.forEach(({ chapterId, chapterName }) => {
      items.push({
        id: chapterAnchorId(chapterId),
        label: chapterName,
        icon: isPortalScope ? 'pi pi-globe' : 'pi pi-book',
      });
    });

    return items;
  });

  chapterOptions = computed(() => chapterOptionsFor(this.allSources(), (key) => this.translate(key)));

  typeOptions = computed(() => typeOptionsFor(this.allSources(), (key) => this.translate(key)));

  hasActiveFilters = computed(() => !!(this.searchTerm() || this.selectedChapter() || this.selectedType()));

  ngOnInit() {
    // Register Export FAB first (initially hidden, shown when sources are loaded)
    this.fabRegistry.register({
      id: this.EXPORT_FAB_ID,
      priority: FAB_PRIORITIES.EXPORT,
      icon: 'pi-download',
      labelKey: 'sources.export.fabLabel',
      color: 'default',
      onClick: () => this.openExportDialog(),
      visible: false,
    });

    // Read initial filter from route data (for /book-sources legacy route)
    const routeData = this.route.snapshot.data;
    if (routeData['defaultFilter'] === 'book' || routeData['defaultFilter'] === 'portal') {
      this.sourceScope.set(routeData['defaultFilter']);
    }

    // Also check query params (takes precedence over route data)
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const filter = params['filter'];
      if (filter === 'book' || filter === 'portal' || filter === 'all') {
        this.sourceScope.set(filter);
      }
    });

    // Load sources (will update FAB visibility)
    this.loadSources();

    // Cache demo id -> titleKey so portal-scope group headers show the demo title
    // instead of the raw id ("Demos: Word Embeddings").
    this.demos
      .getAllDemos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        this.demoTitleKeys.set(new Map(list.map((d) => [d.id, d.titleKey])));
      });

    // Subscribe to language changes and re-read the freshly loaded sources.
    // Re-subscribing here would stack another pair of subscriptions per switch —
    // the ones from loadSources() stay live and pick the new bundle up on their own.
    this.translationService.languageChanged.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.refreshSourceState();
    });
  }

  ngOnDestroy() {
    this.fabRegistry.unregister(this.EXPORT_FAB_ID);
  }

  /**
   * Wire the reactive signals to the service. Called exactly once, from ngOnInit:
   * both streams are long-lived BehaviorSubjects that never complete, so they need
   * takeUntilDestroyed — and a second call would stack a second subscription.
   */
  private loadSources() {
    this.sourcesService.sources$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((sources) => {
      this.allSources.set(sources);
      // Show Export FAB when sources are loaded
      this.fabRegistry.updateVisibility(this.EXPORT_FAB_ID, sources.length > 0);
      // Update book/portal sources when sources change
      this.updateFilteredSourceSignals();
    });

    // Also subscribe to references changes
    this.sourcesService.references$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      // Update book/portal sources when references change
      this.updateFilteredSourceSignals();
    });
  }

  /**
   * Re-derive everything loadSources' handlers derive, from the values the
   * service already holds — what a re-subscription used to achieve via the
   * BehaviorSubjects' replay, minus the extra subscription.
   */
  private refreshSourceState(): void {
    this.fabRegistry.updateVisibility(this.EXPORT_FAB_ID, this.allSources().length > 0);
    this.updateFilteredSourceSignals();
  }

  /**
   * Update the bookSources and portalSources signals based on current service data
   */
  private updateFilteredSourceSignals(): void {
    this.bookSources.set(this.sourcesService.getBookSources());
    this.portalSources.set(this.sourcesService.getPortalSources());
  }

  /**
   * Group sources by their portal content references (article, guide, demo)
   * instead of by book chapters.
   */
  private groupByPortalContent(sources: Source[]): SourceGroup[] {
    const portalTypeLabels: Record<string, { label: string; order: number; icon: string }> = {
      article: {
        label: this.translate('sources.portalGroups.articles'),
        order: 1,
        icon: 'pi pi-align-left',
      },
      guide: { label: this.translate('sources.portalGroups.guides'), order: 3, icon: 'pi pi-book' },
      demo: { label: this.translate('sources.portalGroups.demos'), order: 4, icon: 'pi pi-play' },
      glossary: {
        label: this.translate('sources.portalGroups.glossary'),
        order: 5,
        icon: 'pi pi-bookmark',
      },
      timeline: { label: this.translate('sources.portalGroups.timeline'), order: 6, icon: 'pi pi-clock' },
    };

    // Group by portal content ID (e.g., "article:art-probability-stats")
    const groups = new Map<string, Source[]>();

    sources.forEach((source) => {
      const portalRefs = this.sourcesService.getPortalRefsForSource(source.id);
      if (portalRefs.length > 0) {
        // Place source in each portal content group it references
        portalRefs.forEach((ref) => {
          const key = `${ref.type}:${ref.id}`;
          if (!groups.has(key)) {
            groups.set(key, []);
          }
          groups.get(key)!.push(source);
        });
      } else {
        // Fallback group for sources without portal refs
        const key = 'other:uncategorized';
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key)!.push(source);
      }
    });

    return Array.from(groups.entries())
      .map(([key, groupSources]) => {
        const [type, id] = key.split(':');
        const typeConfig = portalTypeLabels[type] || { label: type, order: 99, icon: 'pi pi-question' };
        // Resolve the content title from its i18n key; the raw id when unknown.
        const contentTitleKey = this.getPortalContentTitleKey(type, id);
        const contentTitle = contentTitleKey ? translatedOr((k) => this.translate(k), contentTitleKey, id) : id;
        return {
          chapterId: key,
          chapterName: `${typeConfig.label}: ${contentTitle}`,
          chapterNumber: typeConfig.order,
          sources: groupSources,
        };
      })
      .sort((a, b) => a.chapterNumber - b.chapterNumber);
  }

  /**
   * Map portal content type + id to an i18n title key
   */
  private getPortalContentTitleKey(type: string, id: string): string | null {
    // Articles use their hero title key from the module name
    // art-git-intro → articleGitIntro.hero.title
    if (type === 'article') {
      const moduleName =
        'article' +
        id
          .replace('art-', '')
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join('');
      return `${moduleName}.hero.title`;
    }
    if (type === 'guide') {
      const moduleName =
        'guide' +
        id
          .replace('guide-', '')
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join('');
      return `${moduleName}.hero.title`;
    }
    // Demos: resolve via the cached demo index (id -> titleKey); reactive on demoTitleKeys().
    if (type === 'demo') {
      return this.demoTitleKeys().get(id) || null;
    }
    return null;
  }

  clearAllFilters() {
    this.searchTerm.set('');
    this.selectedChapter.set(null);
    this.selectedType.set(null);
  }

  /**
   * Change source scope filter and update URL
   */
  setSourceScope(scope: SourceScope): void {
    this.sourceScope.set(scope);
    // Clear chapter filter when switching to portal (not applicable)
    if (scope === 'portal') {
      this.selectedChapter.set(null);
    }
    // Update URL without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: scope === 'all' ? {} : { filter: scope },
      queryParamsHandling: scope === 'all' ? '' : 'merge',
    });
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // Export Dialog methods
  /** Hands focus back to the FAB that opened the dialog — Optimus UI does not. */
  private readonly exportFocusReturn = new FocusReturn();

  openExportDialog(): void {
    this.exportFocusReturn.capture();
    this.exportDialogVisible.set(true);
  }

  closeExportDialog(): void {
    this.exportDialogVisible.set(false);
    this.exportFocusReturn.restore();
  }

  /**
   * Download the bibliography the export dialog asked for: the filtered or the
   * full list, optionally (dev only) narrowed to bookCitation sources.
   */
  downloadBibliography(choice: SourcesExportChoice): void {
    // Use filtered or all sources based on switch
    let sources = choice.exportAll ? this.allSources() : this.filteredSources();

    // DEV MODE: Filter by bookCitation if switch is enabled
    if (isDevMode() && choice.bookCitationOnly) {
      sources = sources.filter((s) => s.bookCitation === true);
    }

    const result = this.bibliographyExport.export(sources, {
      ...choice,
      language: this.translationService.currentLanguage,
    });
    if (!result) return;

    this.closeExportDialog();
    if (result.kind === 'print') {
      this.toastService.showSuccess(this.translate('sources.export.pdfPrintHint'), result.formatLabel);
    } else {
      this.toastService.showSuccess(
        this.translate('sources.export.success').replace('{count}', result.count.toString()),
        result.formatLabel,
      );
    }
  }
}
