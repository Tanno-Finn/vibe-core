/**
 * Language URL Service
 *
 * Central helper for all language-aware URL operations.
 * Used by MetaSeoService, StructuredDataService, and components
 * that construct URLs (glossary popover, navigation fallback).
 */
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslationService } from './translation.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LanguageUrlService {
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);

  /** Current base language from URL (without -easy suffix) */
  get currentUrlLang(): string {
    return this.translationService.currentLanguage.replace(/-easy$/, '');
  }

  /**
   * Extract clean path from router.url (strips query params and fragment).
   * router.url can be "/glossary?search=test#section" → returns "/glossary"
   */
  get cleanRouterPath(): string {
    return this.router.url.split('?')[0].split('#')[0];
  }

  /**
   * Absolute URL with language prefix for SEO (canonical, OG, structured data).
   * Uses clean path without query params — canonical URLs should be stable.
   *
   * Trailing slash is mandatory: prerendered files live on disk as
   * `<lang>/<route>/index.html`, most static hosts 301-redirect /de/home →
   * /de/home/, and the sitemap lists URLs with trailing slash. The canonical
   * tag must match the URL the host serves, otherwise Google sees a mismatch
   * (canonical points at a 301-source URL) and demotes indexing.
   */
  buildCanonicalUrl(routerPath?: string): string {
    const raw = routerPath ?? this.router.url;
    const clean = raw.split('?')[0].split('#')[0];
    const trimmed = clean.replace(/^\/+|\/+$/g, '');
    // On the server the configured siteUrl wins; the reserved example.com is a
    // last-resort placeholder that MetaSeoService strips before anything ships.
    const origin = isPlatformBrowser(this.platformId)
      ? this.doc.location.origin
      : (environment.siteUrl || '').trim().replace(/\/+$/, '') || 'https://example.com';
    return trimmed ? `${origin}/${this.currentUrlLang}/${trimmed}/` : `${origin}/${this.currentUrlLang}/`;
  }
}
