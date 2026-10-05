/**
 * Meta SEO Service
 * Manages dynamic meta tags, Open Graph, and Twitter Cards for SEO optimization
 *
 * Only real data goes into a tag; a value the kit does not have is left out,
 * never invented (same rule as StructuredDataService):
 *  - `author` / `article:author` name the site operator (src/config/site.json),
 *    and are omitted while that file still holds the kit's placeholder;
 *  - `article:published_time` is the article's `publishDate` from
 *    articles/index.json, omitted when it has none;
 *  - `article:section` is the article's translated `category`, omitted when
 *    the category has no translation;
 *  - there is no `article:modified_time`: nothing records when a page changed,
 *    and the time of the visit is not it.
 * Tags a page does not set are removed, so an article's tags do not linger on
 * the next page.
 *
 * The site's name comes from src/config/site.json (SITE_CONFIG), not from the
 * translations: `seo.pages.<key>.title` holds only the page's own part
 * ("Glossary"), the name is appended here ("Glossary - vibecore"); a title,
 * description or keyword list that names the site says `{siteName}`.
 */
import { Injectable, effect, inject, PLATFORM_ID, untracked } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { TranslationService } from './translation.service';
import { ArticlesService } from './articles.service';
import { LanguageUrlService } from './language-url.service';
import { DEFAULT_SEO_LANG, SEO_ENABLED_LANGS } from '../../config/seo-languages.config';
import { getLanguageInfo, KEY_SOURCE_LANGUAGE, LANGUAGE_RULES } from '../../config/languages';
import { extendedRoutes, ExtendedRoute } from '../app.routes';
import { environment } from '../../environments/environment';
import { operatorAsPerson } from './structured-data.service';
import { SITE_CONFIG } from '../../config/site';
import { filter, take } from 'rxjs/operators';

export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  author?: string;
  /** ISO date, e.g. an article's `publishDate`. */
  publishedTime?: string;
  /** `article:section` — the article's category, translated. */
  section?: string;
}

/**
 * Route path (exactly as in app.routes.ts) → its hand-written `seo.pages.<key>`
 * entry. Only routed pages belong here: the lookup runs on `urlAfterRedirects`,
 * so a redirect path (the root, the legacy /ai-tools and /ai-resources) can
 * never match. Pages without an entry fall back to their route's titleKey.
 * app.routes.maps.spec.ts fails when a key stops being a routed page.
 */
export const SEO_ROUTE_KEYS: Readonly<Record<string, string>> = {
  home: 'home',
  'ai-timeline': 'aiTimeline',
  glossary: 'glossary',
  sources: 'sources',
  'user-settings': 'userSettings',
  'example-demo': 'exampleDemo',
  impressum: 'impressum',
};

@Injectable({
  providedIn: 'root',
})
export class MetaSeoService {
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  private readonly articlesService = inject(ArticlesService);
  private readonly languageUrlService = inject(LanguageUrlService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly docRef = inject<Document>(DOCUMENT);
  private readonly site = inject(SITE_CONFIG);

  constructor() {
    // Update meta tags on route changes
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.updateMetaForRoute(event.urlAfterRedirects);
    });

    // X6 fix: keep <html lang="..."> in sync with the active portal language
    // so screen readers announce content in the correct language.
    this.syncDocumentLang(this.translationService.currentLanguage);
    let first = true;
    effect(() => {
      const lang = this.translationService.currentLanguage$();
      untracked(() => {
        this.syncDocumentLang(lang);
        // hreflang depends on the route, written on NavigationEnd; only a
        // later switch needs a rewrite here.
        if (!first) this.updateHreflangTags();
        first = false;
      });
    });
  }

  /**
   * Set `document.documentElement.lang` to a BCP-47 compatible value for the
   * given portal language. Easy-Language variants collapse to their base
   * language because no ISO code exists for "Easy <x>" and screen readers
   * should still announce the base language correctly.
   */
  private syncDocumentLang(portalLang: string): void {
    // Strip "-easy" suffix: "de-easy" -> "de", "pt-br-easy" -> "pt-br"
    const baseLang = portalLang.replace(/-easy$/, '');
    this.docRef.documentElement.lang = baseLang;
  }

  /**
   * Update meta tags for a specific route
   */
  private updateMetaForRoute(url: string): void {
    const cleanUrl = url.replace('/', '').split('?')[0];

    // hreflang tags apply to ALL routes (articles, demos, hub pages)
    this.updateHreflangTags();

    // Article routes: /articles/<id> — resolve meta dynamically from
    // ArticlesService so every article has its own title/description
    // for search engines instead of the generic "default" fallback.
    if (cleanUrl.startsWith('articles/')) {
      const articleId = cleanUrl.substring('articles/'.length);
      this.updateMetaForArticle(articleId);
      return;
    }

    // Resolution order: dedicated seo.pages entry -> route titleKey fallback
    // -> generic default. The fallback keeps every route (hubs like /learn,
    // /catalog, /news, and the dev workshop pages) with a speaking <title>
    // even when no hand-written seo.pages entry exists for it.
    const routeKey = this.getRouteKey(url);
    const pageMeta =
      (routeKey !== 'default' ? this.getPageMeta(routeKey) : null) ??
      this.buildRouteTitleMeta(cleanUrl) ??
      this.getPageMeta('default');

    if (pageMeta) {
      this.updateAllMetaTags(pageMeta);
    }
  }

  /**
   * Find the route definition matching a clean URL path (no leading slash,
   * no query params). Static segments must match exactly; `:param` segments
   * match anything. Redirects and the wildcard route are skipped.
   */
  private findRouteDefinition(cleanUrl: string): ExtendedRoute | null {
    const urlSegments = cleanUrl.split('/').filter(Boolean);
    if (!urlSegments.length) return null;
    for (const route of extendedRoutes) {
      if (!route.path || route.path === '**' || route.redirectTo) continue;
      const routeSegments = route.path.split('/');
      if (routeSegments.length !== urlSegments.length) continue;
      const matches = routeSegments.every((seg, i) => seg.startsWith(':') || seg === urlSegments[i]);
      if (matches) return route;
    }
    return null;
  }

  /**
   * Fallback meta built from the matched route's own title: either a literal
   * `data.staticTitle` / `data.staticTitleDe` (dev guide pages) or the translated `titleKey` (the
   * same key the navigation shows). Produces "<Page> - <site>" so no route is
   * left with the generic default title. Returns null when the route carries
   * no usable title or translations are not loaded yet.
   */
  private buildRouteTitleMeta(cleanUrl: string): PageMeta | null {
    const route = this.findRouteDefinition(cleanUrl);
    if (!route) return null;

    let pageTitle: string | null = null;
    // A dev guide carries a German title beside the English one (staticTitleDe).
    const german = LANGUAGE_RULES.baseLanguageOf(this.translationService.currentLanguage) === 'de';
    const staticTitle = (german && route.data?.['staticTitleDe']) || route.data?.['staticTitle'];
    if (typeof staticTitle === 'string' && staticTitle) {
      pageTitle = staticTitle;
    } else if (route.titleKey) {
      const translated = this.translationService.translate(route.titleKey);
      if (translated !== route.titleKey) pageTitle = translated;
    }
    if (!pageTitle) return null;

    const descKey = 'seo.pages.default.description';
    const descriptionRaw = this.translationService.translate(descKey);
    if (descriptionRaw === descKey) return null;
    const description = this.site.fill(descriptionRaw);

    const title = this.site.pageTitle(pageTitle);

    return {
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      ogImage: this.absoluteUrl('/assets/images/og-image-default.png'),
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonicalUrl: this.canonicalUrl(),
      author: this.operatorName(),
    };
  }

  /**
   * Resolve article metadata from ArticlesService and update meta tags.
   * Each article has titleKey/descriptionKey pointing at translation keys
   * (e.g. "articleGitIntro.hero.title") so every article gets a
   * language-specific SEO title and description.
   */
  private updateMetaForArticle(articleId: string): void {
    this.articlesService
      .getById(articleId)
      .pipe(take(1))
      .subscribe((article) => {
        if (!article) {
          // Unknown article id — fall back to generic default meta
          const fallback = this.getPageMeta('default');
          if (fallback) {
            this.updateAllMetaTags(fallback);
          }
          return;
        }

        const title = this.translationService.translate(article.titleKey);
        const description = this.translationService.translate(article.descriptionKey);

        // Skip update if translations haven't loaded yet (raw keys returned).
        // TranslationReadyGuard normally prevents this, but belt-and-braces.
        if (title === article.titleKey || description === article.descriptionKey) {
          return;
        }

        const sectionKey = `categories.${article.category}`;
        const section = article.category ? this.translationService.translate(sectionKey) : sectionKey;

        this.updateAllMetaTags({
          title,
          description,
          ogTitle: title,
          ogDescription: description,
          ogImage: this.absoluteUrl('/assets/images/og-image-default.png'),
          ogType: 'article',
          twitterCard: 'summary_large_image',
          canonicalUrl: this.canonicalUrl(),
          author: this.operatorName(),
          publishedTime:
            article.publishDate && /^\d{4}-\d{2}-\d{2}$/.test(article.publishDate) ? article.publishDate : undefined,
          section: section !== sectionKey ? section : undefined,
        });
      });
  }

  /** The site's name (src/config/site.json). */
  private siteName(): string {
    return this.site.name;
  }

  /** The site operator's name (site.json `operator`), or undefined while it holds the placeholder. */
  private operatorName(): string | undefined {
    return operatorAsPerson(this.site.operator.name)?.name;
  }

  /**
   * Get route key from URL for translation lookup
   */
  private getRouteKey(url: string): string {
    // Remove leading slash and query parameters
    const cleanUrl = url.replace('/', '').split('?')[0];

    return Object.hasOwn(SEO_ROUTE_KEYS, cleanUrl) ? SEO_ROUTE_KEYS[cleanUrl] : 'default';
  }

  /**
   * Get page meta data based on route key
   */
  private getPageMeta(routeKey: string): PageMeta | null {
    // Get translations for this route
    const titleKey = `seo.pages.${routeKey}.title`;
    const descKey = `seo.pages.${routeKey}.description`;
    const keywordsKey = `seo.pages.${routeKey}.keywords`;

    const titleRaw = this.translationService.translate(titleKey);
    const descriptionRaw = this.translationService.translate(descKey);
    const keywordsRaw = this.translationService.translate(keywordsKey);

    // Don't update if translations are missing (would show raw keys)
    if (titleRaw === titleKey || descriptionRaw === descKey) {
      return null;
    }
    const title = this.site.pageTitle(titleRaw);
    const description = this.site.fill(descriptionRaw);
    const keywords = keywordsRaw !== keywordsKey ? this.site.fill(keywordsRaw) : undefined;

    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage: this.absoluteUrl('/assets/images/og-image-default.png'),
      ogType: 'website',
      twitterCard: 'summary_large_image',
      canonicalUrl: this.canonicalUrl(),
      author: this.operatorName(),
    };
  }

  /**
   * The absolute origin to build canonical/og/hreflang URLs from, or null
   * when there is none to be had.
   *
   * In the browser that is simply window.location.origin. On the server —
   * SSR and, more importantly, the prerender pass that writes the HTML
   * Google actually reads — there is no window, so it comes from
   * `environment.siteUrl`, which ships empty.
   *
   * Returning null rather than a placeholder is deliberate. This used to
   * fall back to 'https://example.com', which meant every prerendered page
   * shipped a canonical, an og:url and 28 hreflang links all pointing at a
   * domain the operator does not own. A canonical pointing elsewhere asks
   * search engines to index that other URL instead; no canonical at all
   * just lets them index the page they fetched. Missing beats wrong.
   */
  private resolveOrigin(): string | null {
    if (isPlatformBrowser(this.platformId)) return window.location.origin;
    const configured = (environment.siteUrl || '').trim();
    return configured ? configured.replace(/\/+$/, '') : null;
  }

  /**
   * Canonical URL for the current route, or undefined when no origin is
   * known. LanguageUrlService builds the path and language prefix; only the
   * origin is substituted here, so the repo-wide trailing-slash contract
   * stays in one place.
   */
  private canonicalUrl(): string | undefined {
    const origin = this.resolveOrigin();
    if (!origin) return undefined;
    return this.languageUrlService.buildCanonicalUrl().replace(/^https?:\/\/[^/]+/, origin);
  }

  /** Absolute URL for an asset path, or undefined without a known origin. */
  private absoluteUrl(path: string): string | undefined {
    const origin = this.resolveOrigin();
    return origin ? `${origin}${path}` : undefined;
  }

  /**
   * Update all meta tags with provided data
   */
  private updateAllMetaTags(pageMeta: PageMeta): void {
    // Update title
    this.title.setTitle(pageMeta.title);

    // Basic meta tags
    this.updateOrCreateTag('name', 'description', pageMeta.description);
    if (pageMeta.keywords) {
      this.updateOrCreateTag('name', 'keywords', pageMeta.keywords);
    }
    this.setOrRemoveTag('name', 'author', pageMeta.author);

    // Canonical URL
    if (pageMeta.canonicalUrl) {
      this.updateOrCreateLinkTag('canonical', pageMeta.canonicalUrl);
    }

    // Open Graph tags
    this.updateOrCreateTag('property', 'og:title', pageMeta.ogTitle || pageMeta.title);
    this.updateOrCreateTag('property', 'og:description', pageMeta.ogDescription || pageMeta.description);
    this.updateOrCreateTag('property', 'og:type', pageMeta.ogType || 'website');
    if (pageMeta.ogImage) {
      this.updateOrCreateTag('property', 'og:image', pageMeta.ogImage);
    }
    // The image's alt text travels with the image. index.html ships neither: both
    // need an absolute URL, which only a known origin gives, and an alt describing
    // an image that is not there is noise. The default image shows the site's
    // logo and name.
    const imageAlt = pageMeta.ogImage ? this.siteName() : undefined;
    this.setOrRemoveTag('property', 'og:image:alt', imageAlt);
    this.setOrRemoveTag('name', 'twitter:image:alt', imageAlt);
    if (pageMeta.canonicalUrl) {
      this.updateOrCreateTag('property', 'og:url', pageMeta.canonicalUrl);
    }

    // Language and locale
    const lang = this.translationService.currentLanguage;
    // og:locale from languages.json (`locale`, e.g. de-DE -> de_DE); an
    // Easy-Language variant uses its base language's locale. The alternate is
    // the first other SEO language.
    const ogLocaleOf = (code: string) =>
      (getLanguageInfo(code)?.locale ?? getLanguageInfo(KEY_SOURCE_LANGUAGE)!.locale).replace('-', '_');
    const currentLocale = ogLocaleOf(lang);
    const baseLang = LANGUAGE_RULES.baseLanguageOf(lang);
    const alternateLang = SEO_ENABLED_LANGS.find((l) => l.code !== baseLang)?.code ?? DEFAULT_SEO_LANG;
    const alternateLocale = ogLocaleOf(alternateLang);
    this.updateOrCreateTag('property', 'og:locale', currentLocale);
    this.updateOrCreateTag('property', 'og:locale:alternate', alternateLocale);

    // Twitter Cards
    this.updateOrCreateTag('name', 'twitter:card', pageMeta.twitterCard || 'summary_large_image');
    this.updateOrCreateTag('name', 'twitter:title', pageMeta.ogTitle || pageMeta.title);
    this.updateOrCreateTag('name', 'twitter:description', pageMeta.ogDescription || pageMeta.description);
    if (pageMeta.ogImage) {
      this.updateOrCreateTag('name', 'twitter:image', pageMeta.ogImage);
    }

    // Article properties: only on an article, only with real values. Removed
    // otherwise, so the previous article's values do not stay behind.
    const isArticle = pageMeta.ogType === 'article';
    this.setOrRemoveTag('property', 'article:author', isArticle ? pageMeta.author : undefined);
    this.setOrRemoveTag('property', 'article:section', isArticle ? pageMeta.section : undefined);
    this.setOrRemoveTag('property', 'article:published_time', isArticle ? pageMeta.publishedTime : undefined);
    // Written by an earlier version with the time of the visit; never set now.
    this.setOrRemoveTag('property', 'article:modified_time', undefined);

    // hreflang tags are injected via updateHreflangTags() which is called
    // from updateMetaForRoute() and on language change events.
  }

  /**
   * Inject hreflang <link> tags for all SEO-enabled languages.
   * Each language gets its own URL prefix, making hreflang meaningful.
   */
  private updateHreflangTags(): void {
    // Remove old hreflang tags
    this.docRef.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

    // Use clean path (no query params/fragment) — hreflang URLs must be stable
    const path = this.languageUrlService.cleanRouterPath.replace(/^\/+|\/+$/g, '');
    const origin = this.resolveOrigin();

    // hreflang links are absolute by definition. Without a known origin the
    // old tags stay removed and none are written — pointing every language
    // at a placeholder domain would be worse than shipping no hreflang.
    if (!origin) return;

    // Same URL shape as the canonical and the sitemap alternates: trailing
    // slash always. Without it every alternate named a URL the server answers
    // with a 301, and the page's hreflang disagreed with its own sitemap.
    const hrefFor = (code: string) => (path ? `${origin}/${code}/${path}/` : `${origin}/${code}/`);

    // Only SEO-enabled languages
    for (const lang of SEO_ENABLED_LANGS) {
      const link = this.docRef.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang.hreflang;
      link.href = hrefFor(lang.code);
      this.docRef.head.appendChild(link);
    }

    // x-default points to the site default language (languages.json
    // `defaultLanguage`) — the same target as the bare-URL redirect.
    const xDefault = this.docRef.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = hrefFor(DEFAULT_SEO_LANG);
    this.docRef.head.appendChild(xDefault);
  }

  /**
   * Update or create a meta tag
   */
  private updateOrCreateTag(attribute: string, value: string, content: string): void {
    const selector = `${attribute}="${value}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attribute]: value, content });
    } else {
      this.meta.addTag({ [attribute]: value, content });
    }
  }

  /** Write the tag when there is a value, remove it when there is none. */
  private setOrRemoveTag(attribute: string, value: string, content: string | undefined): void {
    if (content) {
      this.updateOrCreateTag(attribute, value, content);
    } else {
      this.meta.removeTag(`${attribute}="${value}"`);
    }
  }

  /**
   * Update or create a link tag
   */
  private updateOrCreateLinkTag(rel: string, href: string): void {
    const existing = this.docRef.querySelector(`link[rel="${rel}"]`);
    if (existing) {
      existing.setAttribute('href', href);
    } else {
      const link = this.docRef.createElement('link');
      link.rel = rel;
      link.href = href;
      this.docRef.head.appendChild(link);
    }
  }
}
