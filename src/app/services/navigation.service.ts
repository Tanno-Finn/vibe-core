/**
 * Navigation Service
 * This service manages navigation throughout the application.
 * It provides methods for navigating to routes, getting available pages,
 * and filtering pages based on search queries.
 */
import { DestroyRef, Injectable, inject, effect, PLATFORM_ID, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { extendedRoutes } from '../app.routes';
import { TranslationService } from './translation.service';
import { LanguageUrlService } from './language-url.service';
import { DevModeService } from './dev-mode.service';
import { LearningPathService } from './learning-path.service';
import { LearningPathDefinition } from '../models/learning-path.model';
import { ArticlesService } from './articles.service';
import { DemosService } from './demos.service';
import { GlossaryService } from './glossary.service';
import { TimeGateService } from './time-gate.service';
import { foldForSearch } from '../utils/search-fold';
import { translatedOr } from '../utils/translate-or';
import { SITE_CONFIG } from '../../config/site';

/**
 * Interface for navigation menu items
 */
export interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  group?: string;
  groupLabel?: string;
  matchTerms?: string[];
  searchText?: string[]; // Content-derived search corpus (description, tags, linked glossary terms, optional searchTerms booster) — all already localized. Built per language.
  pageId?: string; // 4-letter unique page identifier
  showByDefault?: boolean; // Whether to show this item when dropdown is open without filter
  isShowAllLink?: boolean; // True for "show all" overflow links
  totalCount?: number; // Total items in group (for overflow links)
}

/**
 * Interface for navigation groups
 */
export interface NavigationGroup {
  key: string;
  label: string;
  items: NavigationItem[];
}

/**
 * Interface for group overflow configuration
 */
export interface GroupOverflowConfig {
  maxItems: number; // Max items to show before overflow
  hubRoute: string; // Route to the hub page
  labelKey: string; // Translation key for "show all" label
  hubPageId: string; // Page ID tag for the "show all" link
}

/**
 * Interface for auto-complete events from Optimus UI
 */
export interface AutoCompleteEvent {
  originalEvent?: Event;
  value: NavigationItem;
}

/**
 * Configuration for groups with overflow behavior
 * Maps group key to overflow config
 *
 * Pattern: Groups show max 5 items + "Mehr..." link to hub page
 */
const GROUP_OVERFLOW_CONFIGS: Record<string, GroupOverflowConfig> = {
  interaktiveDemos: {
    maxItems: 5,
    hubRoute: '/learn?view=content&type=demo',
    labelKey: 'app.nav.showMore',
    hubPageId: 'lern',
  },
  lessons: {
    maxItems: 5,
    hubRoute: '/learn?view=content&type=lesson',
    labelKey: 'app.nav.showMore',
    hubPageId: 'lern',
  },
  learningPaths: {
    maxItems: 4,
    hubRoute: '/learn',
    labelKey: 'app.nav.showMore',
    hubPageId: 'lern',
  },
};

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private translationService = inject(TranslationService);
  private languageUrlService = inject(LanguageUrlService);
  private devModeService = inject(DevModeService);
  private learningPathService = inject(LearningPathService);
  private articlesService = inject(ArticlesService);
  private demosService = inject(DemosService);
  private glossaryService = inject(GlossaryService);
  private timeGate = inject(TimeGateService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  /** Feature switches (site.json): a switched-off feature has no menu entry, group or search hit. */
  private site = inject(SITE_CONFIG);

  // Navigation items are dynamically generated from routes
  private _navigationItems: NavigationItem[] = [];

  // Navigation groups
  private _navigationGroups: NavigationGroup[] = [];

  // Draft (= not-yet-written) article paths from ArticlesService (single source
  // of truth: index.json). Semantics: content readiness only. Used by the
  // learning-path nav to decide whether a path has all required steps written.
  private draftArticlePaths = new Set<string>();

  // Article paths that are not visible in production — the union of all three
  // gates in ArticlesService.isVisibleInProd (draft OR future publishDate OR
  // containing learning path not yet released — the path cascade). Superset of
  // draftArticlePaths. Used to keep prod search/nav in sync with the route
  // guard, so time-gated articles don't surface as dead search hits.
  private hiddenArticlePaths = new Set<string>();

  // Demo paths not yet released (scheduled publishDate in the future).
  // Single source of truth: demos/index.json. Mirrors draftArticlePaths.
  private unreleasedDemoPaths = new Set<string>();

  // Content-derived search metadata, keyed by pageId. The search corpus for a
  // page is its OWN already-localized content (description, tags, linked
  // glossary concepts) rather than a hand-maintained per-page keyword list.
  // Single source of truth: articles/demos index.json (descriptionKey, tags,
  // related.glossary). This replaced the static, un-localized `matchTerms`
  // route field with this. The legacy `searchTerms` i18n bundle survives only
  // as an OPTIONAL synonym booster (folded in at build time).
  private contentSearchMeta = new Map<string, { descriptionKey?: string; tags?: string[]; glossary?: string[] }>();

  // glossaryId -> localized term + alternative names + abbreviations. Lets a
  // page inherit the glossary's maintained, multilingual synonyms for every
  // concept it links via related.glossary — no parallel keyword corpus.
  private glossaryTermsById = new Map<string, string[]>();

  constructor() {
    // Rebuild when the language changes or translation data arrives (a core
    // bundle or a lazy i18n chunk): the cached labels were resolved from the
    // data present at build time. Clearing is enough — getAvailablePages()
    // rebuilds on demand.
    effect(() => {
      this.translationService.currentLanguage$();
      this.translationService.translationsVersion();
      this.translationService.translationsReady();
      untracked(() => {
        this._navigationItems = [];
        this._navigationGroups = [];
      });
    });

    // Load article visibility sets from ArticlesService (single source of truth).
    // draftArticlePaths = content-readiness (draft only); hiddenArticlePaths =
    // full prod-visibility gate (draft + publishDate + path cascade) so the
    // search/nav filter matches the route guard exactly (no dead search hits).
    this.articlesService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((articles) => {
        this.draftArticlePaths = new Set(articles.filter((a) => a.draft).map((a) => a.path));
        this.hiddenArticlePaths = new Set(
          articles.filter((a) => !this.articlesService.isVisibleInProd(a)).map((a) => a.path),
        );
        // Capture content-derived search metadata.
        for (const a of articles) {
          if (!a.pageId) continue;
          this.contentSearchMeta.set(a.pageId, {
            descriptionKey: a.descriptionKey,
            tags: a.tags,
            glossary: a.related?.glossary,
          });
        }
        this.refreshNavigation();
      });

    // Load not-yet-released demo paths from DemosService (single source of truth).
    // Skipped while site.json switches the demos off: their routes are left out anyway.
    if (this.site.isFeatureOn('demos')) this.subscribeToDemos();

    // Build the glossaryId -> localized synonyms map. Re-emits on language
    // change (BaseContentService reloads the bundle), so refreshNavigation
    // rebuilds the per-page search corpus in the new language. Skipped while the
    // glossary is switched off: its terms are no search source then.
    if (this.site.isFeatureOn('glossary')) this.subscribeToGlossary();

    // Rebuild navigation when dev/prod toggle changes
    effect(() => {
      this.devModeService.simulateProd();
      this.refreshNavigation();
    });
  }

  private subscribeToDemos(): void {
    this.demosService
      .getAllDemos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((demos) => {
        this.unreleasedDemoPaths = new Set(
          demos.filter((d) => !this.timeGate.isPublished(d.publishDate)).map((d) => d.path),
        );
        // Capture content-derived search metadata.
        for (const d of demos) {
          if (!d.pageId) continue;
          this.contentSearchMeta.set(d.pageId, {
            descriptionKey: d.descriptionKey,
            tags: d.tags,
            glossary: d.related?.glossary,
          });
        }
        this.refreshNavigation();
      });
  }

  private subscribeToGlossary(): void {
    this.glossaryService
      .getAllEntries()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((entries) => {
        this.glossaryTermsById = new Map(
          entries.map((e) => [
            e.id,
            [e.term, ...(e.alternativeNames ?? []), ...(e.abbreviations ?? [])].filter(Boolean),
          ]),
        );
        this.refreshNavigation();
      });
  }

  /**
   * Navigate to a specific route
   * @param route The route path to navigate to
   * @returns Promise that resolves to true if navigation succeeds
   */
  async navigateTo(route: string): Promise<boolean> {
    // Split route into path, query params, and fragment
    // e.g. "/learn?view=content&type=demo" or "/learn#foundation-ops"
    let fragment: string | undefined;
    let routeWithoutFragment = route;

    // Extract fragment (#...) before query parsing
    const hashIdx = route.indexOf('#');
    if (hashIdx !== -1) {
      fragment = route.substring(hashIdx + 1).split('?')[0]; // fragment before any query
      routeWithoutFragment = route.substring(0, hashIdx);
    }

    const [path, queryString] = routeWithoutFragment.split('?');
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;

    // Parse query params if present
    let queryParams: Record<string, string> | undefined;
    if (queryString) {
      queryParams = {};
      for (const param of queryString.split('&')) {
        const [key, value] = param.split('=');
        if (key) queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }

    try {
      const result = await this.router.navigate([normalizedPath], {
        queryParams,
        fragment,
      });

      // Fragment-Scroll wird seit der Umstellung auf anchorScrolling vom
      // Angular-Router selbst über `withInMemoryScrolling({ anchorScrolling:
      // 'enabled' })` ausgelöst. Vorher hatten wir hier ein setTimeout(300)
      // + scrollIntoView, was nach Aktivierung des Router-Auto-Scrolls einen
      // Double-Scroll-Race auslöste (instant snap durch Router, dann 300ms
      // später smooth-scroll an dieselbe Stelle durch diesen Code).

      return result;
    } catch (_error) {
      try {
        const fallbackResult = await this.router.navigateByUrl(route);
        return fallbackResult;
      } catch (_fallbackError) {
        // Prepend language prefix for full-page navigation fallback.
        // A full-page load only exists in the browser; on the server, report failure.
        if (!isPlatformBrowser(this.platformId)) return false;
        const lang = this.languageUrlService.currentUrlLang;
        window.location.href = `/${lang}${route.startsWith('/') ? '' : '/'}${route}`;
        return true;
      }
    }
  }

  /**
   * Navigate using a navigation item or AutoComplete event
   * @param pageOrEvent A NavigationItem or AutoComplete event containing a NavigationItem
   * @returns Promise that resolves to true if navigation succeeds
   */
  async navigateToPage(pageOrEvent: NavigationItem | AutoCompleteEvent): Promise<boolean> {
    let routePath = '';

    // Extract the route path from different possible input types
    if (pageOrEvent) {
      if ('route' in pageOrEvent) {
        // It's a direct NavigationItem
        routePath = pageOrEvent.route;
      } else if ('value' in pageOrEvent && pageOrEvent.value && 'route' in pageOrEvent.value) {
        // It's an AutoComplete event
        routePath = pageOrEvent.value.route;
      }
    }

    if (routePath) {
      return await this.navigateTo(routePath);
    }

    return false;
  }

  /**
   * Build navigation items from extended routes
   * This method is called on first access and whenever the language changes
   */
  private buildNavigationItems(): void {
    this._navigationItems = [];
    this._navigationGroups = [];
    const groupMap = new Map<string, NavigationGroup>();

    // Process each route
    for (const route of extendedRoutes) {
      // Skip hidden routes and redirect routes
      if (route.hidden || route.redirectTo) {
        continue;
      }

      // Skip pages of a feature that site.json switches off (featureGuard blocks them)
      if (route.path !== undefined && !this.site.isRouteOn(route.path, route.group)) {
        continue;
      }

      // Skip showcase routes in production (or simulated prod)
      if (this.devModeService.isEffectivelyProd() && route.path && route.path.startsWith('showcase/')) {
        continue;
      }

      // Skip development group routes in production (or simulated prod)
      if (this.devModeService.isEffectivelyProd() && route.group === 'development') {
        continue;
      }

      // Skip routes flagged devOnly in production (page itself stays reachable directly)
      if (this.devModeService.isEffectivelyProd() && route.devOnly) {
        continue;
      }

      // Skip articles not visible in production: draft, future publishDate, or
      // sitting in a not-yet-released learning path (the path cascade). Mirrors
      // ArticlesService.isVisibleInProd / the draftRouteGuard so search results
      // never point at articles that redirect to /learn on click.
      if (this.devModeService.isEffectivelyProd() && route.path && this.hiddenArticlePaths.has(route.path)) {
        continue;
      }

      // Skip not-yet-released demos in production (publishDate from DemosService/index.json)
      if (this.devModeService.isEffectivelyProd() && route.path && this.unreleasedDemoPaths.has(route.path)) {
        continue;
      }

      // Create navigation item
      if (route.titleKey) {
        const navItem: NavigationItem = {
          label: this.translate(route.titleKey),
          route: `/${route.path}`,
          icon: route.icon || 'pi pi-circle',
          group: route.group,
          searchText: this.buildSearchText(route.pageId, route.descriptionKey),
          pageId: route.pageId,
          showByDefault: route.showByDefault,
        };

        // Add to items list
        this._navigationItems.push(navItem);

        // Add to group if applicable
        if (route.group && route.groupTitleKey) {
          if (!groupMap.has(route.group)) {
            groupMap.set(route.group, {
              key: route.group,
              label: this.translate(route.groupTitleKey),
              items: [],
            });
          }

          const group = groupMap.get(route.group)!;
          navItem.groupLabel = group.label;
          group.items.push(navItem);
        }
      }
    }

    // Add learning paths as navigation items
    this.addLearningPathsToNavigation(groupMap);

    // Convert groups map to array, with controlled order
    const groupOrder = ['knowledge', 'portal', 'learningPaths', 'lessons', 'interaktiveDemos', 'development'];
    this._navigationGroups = Array.from(groupMap.values()).sort((a, b) => {
      const aIdx = groupOrder.indexOf(a.key);
      const bIdx = groupOrder.indexOf(b.key);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });
  }

  /**
   * Add learning paths to navigation groups.
   * Only includes paths that have at least one accessible (non-draft) step.
   */
  private addLearningPathsToNavigation(groupMap: Map<string, NavigationGroup>): void {
    const groupKey = 'learningPaths';
    // Every item links into /learn: no group while site.json switches that feature off.
    if (!this.site.isRouteOn('learn', groupKey)) return;
    const groupLabel = this.translate('app.nav.group.learningPaths');
    // Draft paths from ArticlesService (prefix with / for step.route matching)
    const draftPaths = new Set([...this.draftArticlePaths].map((p) => '/' + p));

    // Get all paths synchronously from the BehaviorSubject
    let paths: LearningPathDefinition[] = [];
    this.learningPathService.paths$.subscribe((p) => (paths = p)).unsubscribe();

    for (const path of paths) {
      // Only show fully-ready paths: ALL required steps must be non-draft
      const requiredSteps = path.steps.filter((s) => s.required);
      const allRequiredAccessible =
        requiredSteps.length > 0 && requiredSteps.every((step) => !draftPaths.has(step.route));
      if (!allRequiredAccessible) continue;

      // Skip time-locked paths in production
      if (this.devModeService.isEffectivelyProd() && !this.learningPathService.isPathPublished(path)) continue;

      const navItem: NavigationItem = {
        label: translatedOr((key) => this.translate(key), path.titleKey, path.id),
        route: `/learn#${path.id}`,
        icon: path.icon || 'pi pi-map',
        group: groupKey,
        matchTerms: [
          'lernpfad',
          'learning path',
          translatedOr((key) => this.translate(key), path.titleKey, path.id).toLowerCase(),
          path.difficulty,
          path.sector,
        ].filter(Boolean),
        showByDefault: true,
      };

      this._navigationItems.push(navItem);

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          key: groupKey,
          label: groupLabel,
          items: [],
        });
      }
      navItem.groupLabel = groupLabel;
      groupMap.get(groupKey)!.items.push(navItem);
    }
  }

  /**
   * Get all available navigation items
   * @returns Array of NavigationItem objects
   */
  getAvailablePages(): NavigationItem[] {
    // Only build if translations are loaded AND items not built yet
    if (this._navigationItems.length === 0) {
      // Check if current language translations are fully loaded before building
      const currentLang = this.translationService.currentLanguage;
      const currentLoaded = this.translationService.isLanguageFullyLoaded(currentLang);

      if (currentLoaded) {
        this.buildNavigationItems();
      } else {
        return [];
      }
    }
    return [...this._navigationItems];
  }

  /**
   * Get navigation items grouped by their groups
   * @returns Array of NavigationGroup objects
   */
  getNavigationGroups(): NavigationGroup[] {
    // Only build if translations are loaded AND groups not built yet
    if (this._navigationGroups.length === 0) {
      // Check if current language translations are fully loaded before building
      const currentLang = this.translationService.currentLanguage;
      const currentLoaded = this.translationService.isLanguageFullyLoaded(currentLang);

      if (currentLoaded) {
        this.buildNavigationItems();
      } else {
        return []; // Return empty array if translations not loaded
      }
    }
    return [...this._navigationGroups];
  }

  /**
   * Refresh navigation items (e.g., after language change)
   */
  refreshNavigation(): void {
    this.buildNavigationItems();
  }

  /**
   * Get page by 4-character page ID
   * @param pageId The 4-character page identifier
   * @returns NavigationItem or undefined if not found
   */
  getPageById(pageId: string): NavigationItem | undefined {
    return this.getAvailablePages().find((page) => page.pageId?.toLowerCase() === pageId.toLowerCase());
  }

  /**
   * Get a translation through TranslationService
   * @param key Translation key
   * @returns Translated string
   */
  private translate(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Filter pages based on a search query
   * @param query The search term to filter by
   * @returns Filtered array of NavigationItem objects
   */
  filterPages(query: string): NavigationItem[] {
    // Folded on both sides (lower-case, compound joiners dropped), so an
    // Easy-German label like "Code·review" is found by "code-review" or
    // "codereview" and the other way round.
    const foldedQuery = foldForSearch(query);
    if (foldedQuery.length === 0) {
      return this.getAvailablePages();
    }
    const matches = (text: string | undefined): boolean => !!text && foldForSearch(text).includes(foldedQuery);

    return this.getAvailablePages().filter((page) => {
      // Label, group label and pageId are the page's own identifiers; the
      // content-derived corpus (page.searchText) and the programmatic
      // learning-path terms (page.matchTerms) cover everything else.
      if (matches(page.label)) return true;
      if (matches(page.groupLabel)) return true;
      if (matches(page.pageId)) return true;
      if (page.searchText?.some(matches)) return true;
      // matchTerms now exists ONLY on programmatically-built learning-path
      // items (see addLearningPathsToNavigation). Static route matchTerms were
      // removed in favor of the content-derived corpus.
      if (page.matchTerms?.some(matches)) return true;
      return false;
    });
  }

  /**
   * Build the content-derived search corpus for a page, all in the current
   * language and lowercased. Sources, in priority order:
   *   1. the page's own description (descriptionKey, already localized),
   *   2. its tags (technical slugs, de-hyphenated),
   *   3. the localized term + synonyms of every glossary concept it links,
   *   4. an OPTIONAL legacy `searchTerms.<pageId>` booster, if one exists.
   * Returns an empty array for pages with no content metadata and no booster.
   */
  private buildSearchText(pageId: string | undefined, routeDescriptionKey?: string): string[] {
    const out: string[] = [];

    // Content pages (articles/demos) carry the richest metadata (tags + linked
    // glossary). Standalone pages (news, roadmap, …) have only a route-level
    // descriptionKey — use that as the fallback so they stay searchable too.
    const meta = pageId ? this.contentSearchMeta.get(pageId) : undefined;
    const descriptionKey = meta?.descriptionKey ?? routeDescriptionKey;
    if (descriptionKey) {
      const desc = this.translate(descriptionKey);
      // translate() echoes the key back when no translation exists — skip that.
      if (desc && desc !== descriptionKey) out.push(desc);
    }
    if (meta?.tags) {
      for (const tag of meta.tags) out.push(tag.replace(/-/g, ' '));
    }
    if (meta?.glossary) {
      for (const gid of meta.glossary) {
        const names = this.glossaryTermsById.get(gid);
        if (names) out.push(...names);
      }
    }

    // Optional synonym booster: the surviving localized searchTerms bundle.
    out.push(...this.getLocalizedMatchTerms(pageId));

    return out.map((s) => s.toLowerCase());
  }

  /**
   * Returns the OPTIONAL localized synonym booster for a page, sourced from the
   * `searchTerms.<pageId>` i18n key (lowercased lookup so uppercase pageIds like
   * PCPT/MNMX resolve too — a later fix closed that case mismatch). Empty array when
   * the page has no booster list. Folded into the corpus by buildSearchText.
   */
  getLocalizedMatchTerms(pageId: string | undefined): string[] {
    if (!pageId) return [];
    const value = this.translationService.translateValue<string[]>(`searchTerms.${pageId.toLowerCase()}`);
    return Array.isArray(value) ? value : [];
  }

  /**
   * Get overflow configuration for a navigation group
   * @param groupKey The group key to look up
   * @returns GroupOverflowConfig or undefined if not configured — also while the
   *   hub its "show all" link leads to is switched off in site.json: the group then
   *   lists all its items instead of hiding some behind a link that goes nowhere.
   */
  getGroupConfig(groupKey: string): GroupOverflowConfig | undefined {
    const config = GROUP_OVERFLOW_CONFIGS[groupKey];
    return config && this.site.isRouteOn(config.hubRoute) ? config : undefined;
  }

  /**
   * Get navigation groups with overflow pattern applied
   * Groups with overflow config will have limited items + "show all" link
   * @returns Array of NavigationGroup objects with overflow applied
   */
  getNavigationGroupsWithOverflow(): NavigationGroup[] {
    const baseGroups = this.getNavigationGroups();

    return baseGroups.map((group) => {
      const config = this.getGroupConfig(group.key);

      // No overflow config - return group as-is
      if (!config) {
        return group;
      }

      const totalCount = group.items.length;

      // Items fit within maxItems - no overflow needed
      if (totalCount <= config.maxItems) {
        return group;
      }

      // Apply overflow: take first N items and add "show all" link
      const limitedItems = group.items.slice(0, config.maxItems);

      const showAllLink: NavigationItem = {
        label: this.translate(config.labelKey) || `... alle ${totalCount} →`,
        route: config.hubRoute,
        icon: 'pi pi-arrow-right',
        group: group.key,
        isShowAllLink: true,
        totalCount: totalCount,
        pageId: config.hubPageId,
      };

      return {
        ...group,
        items: [...limitedItems, showAllLink],
      };
    });
  }
}
