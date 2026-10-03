import {
  Injectable,
  inject,
  Renderer2,
  RendererFactory2,
  DOCUMENT,
  PLATFORM_ID,
  afterNextRender,
  effect,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TranslationService } from './translation.service';
import { LanguageUrlService } from './language-url.service';
import { ArticlesService } from './articles.service';
import { DemosService } from './demos.service';
import { GlossaryEntry, GlossaryService } from './glossary.service';
import { LANGUAGE_INFO } from '../../config/languages';
import { SITE_OPERATOR } from '../../config/site-operator';
import { SITE_CONFIG } from '../../config/site';
import type { ExtendedRoute } from '../app.routes';
import { routedPagesByPath } from '../utils/routed-pages';

interface BreadcrumbItem {
  '@type': string;
  position: number;
  name: string;
  item?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string | string[];
  [key: string]: unknown;
}

/**
 * Characters that must not appear literally in a JSON-LD script body: `<` and
 * `>` (a `</script>` or `<!--` in a content title would end the element early
 * and let the rest parse as markup — the prerenderer writes script text into
 * the HTML unescaped), `&`, and the line/paragraph separators U+2028/U+2029
 * (line terminators to older JavaScript parsers).
 */
const JSON_LD_UNSAFE = new RegExp(`[<>&${String.fromCharCode(0x2028, 0x2029)}]`, 'g');

/**
 * Serialize a JSON-LD object for a `<script type="application/ld+json">` body.
 * JSON allows any character to be written as a backslash-u escape, so each
 * unsafe character becomes one (`<` → backslash-u003c, …): the parsed JSON is
 * identical, but the text can no longer close the tag.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data, null, 2).replace(
    JSON_LD_UNSAFE,
    (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'),
  );
}

/**
 * The route paths (exactly as in app.routes.ts) this service names itself.
 * Everything else is derived — breadcrumb labels from the router config,
 * article and demo schemas from their content data — so it cannot drift from
 * the routes. app.routes.maps.spec.ts fails when one of these stops being a
 * routed page.
 */
export const STRUCTURED_DATA_ROUTES = {
  /** The first breadcrumb; never repeated as a second one. */
  home: 'home',
  /** Carries the DefinedTermSet schema and is the SearchAction target. */
  glossary: 'glossary',
} as const;

type SchemaPerson = { '@type': 'Person'; name: string };

/**
 * The site operator (src/config/site.json, via site-operator.ts) as a schema.org
 * Person — or null while it still holds the kit's bracketed placeholder. A schema
 * that names "[NAME]" (or, as it used to, "Your Name") as author is worse than
 * one that names nobody, so callers leave the property out on null.
 */
export function operatorAsPerson(name: string = SITE_OPERATOR.name): SchemaPerson | null {
  const trimmed = name.trim();
  if (!trimmed || /^\[[^\]]*\]$/.test(trimmed)) return null;
  return { '@type': 'Person', name: trimmed };
}

/**
 * Upper bound for the glossary's DefinedTermSet. The whole set lands in one
 * inline script in the prerendered <head> of the glossary page; 100 terms keep
 * that to a few dozen KB even with long definitions (the kit ships 49). A
 * larger glossary lists its first 100 terms alphabetically — the page itself
 * still shows every one.
 */
export const MAX_DEFINED_TERMS = 100;

/**
 * The glossary as a schema.org DefinedTermSet, built from the real entries of
 * one language: sorted by term, capped at `max`, each term with its definition
 * and alternative names where it has them.
 */
export function buildDefinedTermSet(
  set: { name: string; description: string; inLanguage: string; url: string },
  entries: readonly GlossaryEntry[],
  max: number = MAX_DEFINED_TERMS,
): StructuredData {
  const terms = entries
    .filter((entry) => entry.term?.trim())
    .slice()
    .sort((a, b) => a.term.localeCompare(b.term, set.inLanguage))
    .slice(0, max)
    .map((entry) => {
      const term: Record<string, unknown> = { '@type': 'DefinedTerm', name: entry.term.trim() };
      const description = (entry.definition || entry.description || '').trim();
      if (description) term['description'] = description;
      const alternates = (entry.alternativeNames ?? []).map((n) => n.trim()).filter(Boolean);
      if (alternates.length > 0) term['alternateName'] = alternates;
      return term;
    });
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: set.name,
    description: set.description,
    inLanguage: set.inLanguage,
    url: set.url,
    hasDefinedTerm: terms,
  };
}

/**
 * An article as schema.org Article. `datePublished` is the article's own
 * publishDate from articles/index.json and is left out when the article has
 * none — the build date is not a publication date. There is no dateModified:
 * nothing records when an article last changed.
 */
export function buildArticleSchema(
  article: { title: string; description: string; url: string; publishDate?: string },
  publisher: { name: string; url: string },
  author: SchemaPerson | null = operatorAsPerson(),
): StructuredData {
  const data: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    publisher: { '@type': 'Organization', name: publisher.name, url: publisher.url },
  };
  if (author) data['author'] = author;
  if (article.publishDate && /^\d{4}-\d{2}-\d{2}$/.test(article.publishDate)) {
    data['datePublished'] = article.publishDate;
  }
  return data;
}

@Injectable({
  providedIn: 'root',
})
export class StructuredDataService {
  private renderer: Renderer2 = inject(RendererFactory2).createRenderer(null, null);
  private document = inject<Document>(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  /** The site's name (src/config/site.json). */
  private readonly site = inject(SITE_CONFIG);

  /**
   * Absolute origin all JSON-LD URLs are built from. In the browser this is
   * the real location origin; on the server it is `environment.siteUrl`.
   * When neither exists the schemas are skipped entirely — JSON-LD pointing
   * at a placeholder domain is worse than none (see MetaSeoService).
   */
  private baseOrigin: string | null = null;

  private ensureOrigin(): boolean {
    this.baseOrigin = isPlatformBrowser(this.platformId)
      ? this.document.location.origin
      : (environment.siteUrl || '').trim().replace(/\/+$/, '') || null;
    return this.baseOrigin !== null;
  }
  private translationService = inject(TranslationService);
  private languageUrlService = inject(LanguageUrlService);
  private articlesService = inject(ArticlesService);
  private demosService = inject(DemosService);
  private glossaryService = inject(GlossaryService);

  /**
   * The asynchronous page schema (article, demo, glossary) still waiting for its
   * data. A new route or language cancels it, so a slow answer for the page just
   * left can never land in the head of the next one.
   */
  private pendingPageSchema?: Subscription;

  constructor() {
    // Initialize after first render — afterNextRender runs post-hydration,
    // so translations are loaded and zone stability is not blocked.
    afterNextRender(() => {
      this.updateStructuredData(this.router.url);
    });

    // Update structured data on route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event: NavigationEnd) => {
        this.updateStructuredData(event.url);
      });

    // Update when language changes (the first run is the current language,
    // which the NavigationEnd handler above already covers).
    let first = true;
    effect(() => {
      this.translationService.currentLanguage$();
      if (first) {
        first = false;
        return;
      }
      untracked(() => this.updateStructuredData(this.router.url));
    });
  }

  /**
   * Update all structured data based on current route
   */
  private updateStructuredData(url: string): void {
    this.pendingPageSchema?.unsubscribe();
    this.pendingPageSchema = undefined;
    if (!this.ensureOrigin()) return;

    // Clean up existing structured data
    this.removeAllStructuredData();

    // Add WebSite schema (for Google Sitelinks Search Box)
    this.addWebSiteSchema();

    // Add Organization schema (always present)
    this.addOrganizationSchema();

    // Add breadcrumbs based on current route
    const breadcrumbs = this.generateBreadcrumbs(url);
    if (breadcrumbs.length > 0) {
      this.addBreadcrumbSchema(breadcrumbs);
    }

    // Add page-specific structured data
    this.addPageSpecificSchema(url);
  }

  /**
   * Remove all existing structured data scripts
   */
  private removeAllStructuredData(): void {
    const existingScripts = this.document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach((script) => {
      script.remove();
    });
  }

  /**
   * Add WebSite schema with SearchAction for Google Sitelinks Search Box
   * Also includes accessibility and educational features
   */
  private addWebSiteSchema(): void {
    const websiteData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.site.name,
      url: this.baseOrigin!,
      description: this.translationService.translate('meta.description'),
      inLanguage: LANGUAGE_INFO.map((l) => l.hreflang),
      isAccessibleForFree: true,
      // Accessibility features
      accessibilityFeature: [
        'alternativeText',
        'highContrastDisplay',
        'largePrint',
        'readingOrder',
        'structuralNavigation',
        'tableOfContents',
      ],
      accessibilityHazard: 'none',
      accessMode: ['textual', 'visual'],
      // Easy language variants
      accessModeSufficient: [
        { '@type': 'ItemList', itemListElement: ['textual'] },
        { '@type': 'ItemList', itemListElement: ['textual', 'visual'] },
      ],
      // Educational classification
      educationalUse: ['instruction', 'self-study'],
      audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
        audienceType: 'public',
      },
      // Search action for Google Sitelinks Search Box. Its target is the glossary
      // search, so it is only offered while site.json leaves the glossary on.
      ...(this.site.isRouteOn(STRUCTURED_DATA_ROUTES.glossary)
        ? {
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${this.baseOrigin}/${this.languageUrlService.currentUrlLang}/${STRUCTURED_DATA_ROUTES.glossary}?search={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }
        : {}),
    };
    // The short name (site.json `shortName`) is the site's other name; without one
    // there is none to give — the name itself repeated is not an alternate.
    if (this.site.logoText !== this.site.name) websiteData['alternateName'] = [this.site.logoText];
    const operator = operatorAsPerson();
    if (operator) websiteData['publisher'] = operator;

    this.injectStructuredData(websiteData);
  }

  /**
   * Add Organization schema
   */
  private addOrganizationSchema(): void {
    const orgData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.site.name,
      url: this.baseOrigin!,
      description: this.translationService.translate('meta.description'),
      // Add a sameAs array with your real social/profile URLs downstream. The
      // operator is named as the WebSite's publisher and the content's author;
      // `author` is not an Organization property, so it is not repeated here.
    };

    this.injectStructuredData(orgData);
  }

  /**
   * Generate breadcrumbs for current route
   */
  private generateBreadcrumbs(url: string): BreadcrumbItem[] {
    const segments = url
      .split(/[?#]/)[0]
      .split('/')
      .filter((s) => s);
    if (segments.length === 0) return [];

    const breadcrumbs: BreadcrumbItem[] = [];
    const lang = this.languageUrlService.currentUrlLang;
    const baseUrl = `${this.baseOrigin}/${lang}`;

    // Always add home as first breadcrumb
    breadcrumbs.push({
      '@type': 'ListItem',
      position: 1,
      name: this.translationService.translate('app.nav.home'),
      item: baseUrl,
    });

    // One crumb per URL prefix that is a routed page, labeled with that
    // route's titleKey (articles/<id> yields the article, not "articles").
    const pages = routedPagesByPath(this.router.config as ExtendedRoute[]);
    let currentPath = '';
    for (const segment of segments) {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const page = pages.get(currentPath);
      if (!page?.titleKey || currentPath === STRUCTURED_DATA_ROUTES.home) continue;
      breadcrumbs.push({
        '@type': 'ListItem',
        position: breadcrumbs.length + 1,
        name: this.translationService.translate(page.titleKey),
        item: `${baseUrl}/${currentPath}`,
      });
    }

    return breadcrumbs;
  }

  /**
   * Add breadcrumb schema
   */
  private addBreadcrumbSchema(items: BreadcrumbItem[]): void {
    const breadcrumbData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };

    this.injectStructuredData(breadcrumbData);
  }

  /**
   * Add page-specific structured data
   */
  private addPageSpecificSchema(url: string): void {
    // Remove query parameters and hash
    const cleanUrl = url.split('?')[0].split('#')[0];

    // Add specific schemas based on the page
    const path = cleanUrl.replace(/^\/+|\/+$/g, '');
    if (path.startsWith('articles/')) {
      this.addArticleSchemaForRoute(cleanUrl);
    } else if (path === STRUCTURED_DATA_ROUTES.glossary) {
      this.addGlossarySchema();
    } else if (/\/[a-z][a-z0-9-]*-demo(?:\/|$|\?|#)/.test(cleanUrl)) {
      this.addLearningResourceSchemaForDemo(cleanUrl);
    }
  }

  /**
   * Add Article JSON-LD schema for a specific article route.
   * Resolves article metadata from ArticlesService and uses translated
   * title/description for the current language.
   */
  private addArticleSchemaForRoute(url: string): void {
    const slug = url.split('/articles/')[1]?.split(/[?#]/)[0];
    if (!slug) return;

    this.pendingPageSchema = this.articlesService
      .getById(slug)
      .pipe(take(1))
      .subscribe((article) => {
        if (!article) return;

        const title = this.translationService.translate(article.titleKey);
        const description = this.translationService.translate(article.descriptionKey);

        // Skip if translations haven't loaded yet (raw keys returned)
        if (title === article.titleKey) return;

        const lang = this.languageUrlService.currentUrlLang;
        this.injectStructuredData(
          buildArticleSchema(
            {
              title,
              description,
              url: `${this.baseOrigin}/${lang}/${article.path}/`,
              publishDate: article.publishDate,
            },
            { name: this.site.name, url: this.baseOrigin! },
          ),
        );
      });
  }

  /**
   * Add the glossary's DefinedTermSet, built from the entries of the current
   * language (the same bundle the page renders). Asynchronous: on the server the
   * bundle request is part of the render, so the prerendered page carries it.
   */
  private addGlossarySchema(): void {
    const language = this.translationService.currentLanguage;
    const name = this.translationService.translate('glossary.title');
    if (name === 'glossary.title') return; // translations not loaded yet

    const set = {
      name,
      description: this.translationService.translate('glossary.description'),
      inLanguage: language.split('-')[0],
      url: `${this.baseOrigin}/${this.languageUrlService.currentUrlLang}/${STRUCTURED_DATA_ROUTES.glossary}/`,
    };
    this.pendingPageSchema = this.glossaryService
      .getEntriesForLanguage(language)
      .pipe(take(1))
      .subscribe((entries) => {
        if (entries.length === 0) return;
        this.injectStructuredData(buildDefinedTermSet(set, entries));
      });
  }

  /**
   * Add LearningResource JSON-LD for a specific demo route.
   * Resolves demo metadata from DemosService and uses translated
   * title/description for the current language. Demos are not
   * prerendered (tier T3) — this runs client-side after
   * hydration. Googlebot picks it up in the second-pass render.
   */
  private addLearningResourceSchemaForDemo(url: string): void {
    const match = url.match(/\/([a-z][a-z0-9-]*-demo)(?:\/|$|\?|#)/);
    if (!match) return;
    const slug = match[1];

    this.pendingPageSchema = this.demosService
      .getAllDemos()
      .pipe(take(1))
      .subscribe((demos) => {
        const demo = demos.find((d) => d.path === slug);
        if (!demo) return;

        const title = this.translationService.translate(demo.titleKey);
        const description = this.translationService.translate(demo.descriptionKey);
        if (title === demo.titleKey || description === demo.descriptionKey) return;

        const urlLang = this.languageUrlService.currentUrlLang;
        const baseLang = this.translationService.currentLanguage.split('-')[0];

        const demoData: StructuredData = {
          '@context': 'https://schema.org',
          '@type': 'LearningResource',
          name: title,
          description,
          url: `${this.baseOrigin}/${urlLang}/${slug}`,
          inLanguage: baseLang,
          isAccessibleForFree: true,
          learningResourceType: 'Interactive Demo',
          educationalLevel: demo.difficulty,
          timeRequired: this.formatIso8601Duration(demo.estimatedTime),
          teaches: demo.tags?.length ? demo.tags.join(', ') : title,
          audience: {
            '@type': 'EducationalAudience',
            educationalRole: 'student',
            audienceType: 'public',
          },
          isPartOf: {
            '@type': 'WebSite',
            name: this.site.name,
            url: this.baseOrigin!,
          },
        };
        const operator = operatorAsPerson();
        if (operator) demoData['author'] = operator;

        this.injectStructuredData(demoData);
      });
  }

  /**
   * Convert estimatedTime strings ("20min", "1h") to ISO-8601 duration.
   */
  private formatIso8601Duration(estimate: string): string {
    const m = estimate.match(/(\d+)\s*(min|h)/i);
    if (!m) return estimate;
    return m[2].toLowerCase() === 'h' ? `PT${m[1]}H` : `PT${m[1]}M`;
  }

  /**
   * Inject structured data script into document head
   */
  private injectStructuredData(data: StructuredData): void {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    const text = this.renderer.createText(serializeJsonLd(data));
    this.renderer.appendChild(script, text);
    this.renderer.appendChild(this.document.head, script);
  }
}
