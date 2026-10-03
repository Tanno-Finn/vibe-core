import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map, catchError, throwError } from 'rxjs';
import { Milestones } from './milestones.types';
import { RelatedRefs } from './related-refs.types';
import { TimeGateService } from './time-gate.service';

/**
 * Demo metadata interface
 * Defines the structure for demo information stored in JSON
 */
export interface DemoMeta {
  /** Unique identifier for the demo */
  id: string;
  /** Route path (without leading slash) */
  path: string;
  /** Translation key for title */
  titleKey: string;
  /** Translation key for description */
  descriptionKey: string;
  /** Category for filtering (ml, nlp, ai-fundamentals, optimization) */
  category: string;
  /** Estimated time to complete (e.g., "20min") */
  estimatedTime: string;
  /** Difficulty level */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Whether to feature this demo prominently */
  featured: boolean;
  /** Optimus UI icon class */
  icon: string;
  /** 4-character page ID for book integration */
  pageId: string;
  /** Optional tags for additional filtering */
  tags?: string[];
  /** Universal cross-content refs (articles/glossary/timeline/demos). */
  related?: RelatedRefs;
  /**
   * Scheduled release. Until reached, the demo is hidden everywhere in
   * production (nav, /demos grid, learning-path step) and the route is
   * blocked by demoReleaseGuard. Date-only or full ISO timestamp (for a
   * Sunday-evening drop). Omitted ⇒ always visible. Dev mode ignores it.
   */
  publishDate?: string;
  /**
   * Roadmap reveal control (Mystery-Box).
   * A future demo is collapsed into the roadmap's single Mystery-Box by default
   * (undefined ⇒ treated as `true`). Set `false` to force-reveal a flagship demo
   * by name while it's still upcoming. No effect anywhere except the /roadmap timeline.
   */
  mystery?: boolean;
  /** What finishing this demo means on the /progress page (see milestones.types.ts). */
  milestones?: Milestones;
}

/**
 * DemosService
 *
 * Provides access to demo metadata for hub pages and navigation.
 * Loads data from JSON file and caches for performance.
 */
@Injectable({
  providedIn: 'root',
})
export class DemosService {
  private http = inject(HttpClient);
  private timeGate = inject(TimeGateService);
  private demosCache$: Observable<DemoMeta[]> | null = null;

  private readonly DEMOS_URL = 'assets/data/core/demos/index.json';

  /**
   * Whether a demo is visible in the current environment. Mirrors
   * ArticlesService.isVisible: dev shows everything (preview), prod honors
   * the scheduled `publishDate`. Single source of truth for the staged
   * weekly demo drop — consumed by demoReleaseGuard, the nav, the /demos
   * grid and the learning-path overview.
   */
  isVisible(demo: DemoMeta): boolean {
    if (isDevMode()) return true;
    return this.isPublished(demo);
  }

  /**
   * Whether the demo's scheduled `publishDate` has been reached — the
   * production-visibility gate WITHOUT the dev-mode preview shortcut. Used by
   * toggle-aware discovery surfaces (concept-map, related-refs) that honor
   * `DevModeService.isEffectivelyProd` rather than `isDevMode`, so flipping
   * "simulate prod" hides not-yet-released demos.
   */
  isPublished(demo: DemoMeta): boolean {
    return this.timeGate.isPublished(demo.publishDate);
  }

  /**
   * Get all demos
   * Results are cached after first load. A failed load is NOT cached:
   * shareReplay(1) would replay the error to every future subscriber
   * forever, so the cache resets itself before the error propagates.
   */
  getAllDemos(): Observable<DemoMeta[]> {
    if (!this.demosCache$) {
      this.demosCache$ = this.http.get<DemoMeta[]>(this.DEMOS_URL).pipe(
        catchError((err) => {
          this.demosCache$ = null;
          return throwError(() => err);
        }),
        shareReplay(1),
      );
    }
    return this.demosCache$;
  }

  /**
   * Get a specific demo by ID
   */
  getDemoById(id: string): Observable<DemoMeta | undefined> {
    return this.getAllDemos().pipe(map((demos) => demos.find((d) => d.id === id)));
  }

  /**
   * Clear cache (useful for testing or language changes)
   */
  clearCache(): void {
    this.demosCache$ = null;
  }
}
