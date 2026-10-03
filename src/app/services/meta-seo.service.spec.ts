/**
 * MetaSeoService spec — the tags search engines read: the canonical, the
 * hreflang alternates with their x-default, `<html lang>`, and the article
 * properties, which carry real data or nothing.
 *
 * Two platforms matter. In the browser the origin is window.location; on the
 * server (the prerender pass that writes the HTML Google actually fetches)
 * it comes from `environment.siteUrl`, which ships empty — and then every
 * absolute URL must be left out rather than invented.
 *
 * TranslationService is a stub: the language is the input here, and this
 * spec must not depend on bundles loading over HTTP. The site's name and its
 * operator come from SITE_CONFIG, the kit default unless a test provides its
 * own site — never from the real site.json, so a user who fills in their
 * operator data keeps a green suite.
 */
import { Component, PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { MetaSeoService } from './meta-seo.service';
import { TranslationService } from './translation.service';
import { ArticleMeta, ArticlesService } from './articles.service';
import { environment } from '../../environments/environment';
import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, SiteRules } from '../../config/site';
import { createSiteRules } from '../../config/site-rules.mjs';

@Component({ template: '' })
class BlankPage {}

const STRINGS: Record<string, string> = {
  'seo.pages.glossary.title': 'Glossary',
  'seo.pages.glossary.description': 'Every term, explained.',
  'seo.pages.glossary.keywords': 'glossary, {siteName}',
  'seo.pages.home.title': 'Home',
  'seo.pages.home.description': 'The portal.',
  'seo.pages.default.title': '{siteName} - Your Gateway to Learning',
  'seo.pages.default.description': '{siteName} — a learning portal.',
  'art.title': 'Git in ten minutes',
  'art.description': 'Commits, branches, merges.',
  'categories.fundamentals': 'Fundamentals',
};

/** Articles the ArticlesService stub knows, by id. */
const ARTICLES: Record<string, Partial<ArticleMeta>> = {
  dated: {
    titleKey: 'art.title',
    descriptionKey: 'art.description',
    category: 'fundamentals',
    publishDate: '2026-07-15',
  },
  plain: { titleKey: 'art.title', descriptionKey: 'art.description', category: 'no-such-category' },
};

class TranslationStub {
  readonly currentLanguage$ = signal('en');
  get currentLanguage(): string {
    return this.currentLanguage$();
  }
  set currentLanguage(lang: string) {
    this.currentLanguage$.set(lang);
  }

  translate(key: string): string {
    return STRINGS[key] ?? key;
  }

  /** Switch the language signal and flush the effects that follow it. */
  switchTo(lang: string): void {
    this.currentLanguage$.set(lang);
    TestBed.tick();
  }
}

function clearHead(): void {
  document.head
    .querySelectorAll('link[rel="canonical"], link[rel="alternate"], meta[property], meta[name]')
    .forEach((el) => el.remove());
}

const metaContent = (attr: 'name' | 'property', value: string) =>
  document.head.querySelector(`meta[${attr}="${value}"]`)?.getAttribute('content') ?? null;
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
const ogUrl = () => document.head.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? null;
const hreflangs = () =>
  Array.from(document.head.querySelectorAll('link[rel="alternate"][hreflang]')).map((el) => [
    el.getAttribute('hreflang'),
    el.getAttribute('href'),
  ]);

describe('MetaSeoService', () => {
  let translation: TranslationStub;
  const originalSiteUrl = environment.siteUrl;

  const SITE_NAME = KIT_DEFAULT_SITE.name;

  function setup(
    platform: 'browser' | 'server',
    lang = 'en',
    site: SiteRules = KIT_DEFAULT_SITE_RULES,
  ): MetaSeoService {
    translation = new TranslationStub();
    translation.currentLanguage = lang;
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'glossary', component: BlankPage },
          { path: '**', component: BlankPage },
        ]),
        { provide: PLATFORM_ID, useValue: platform },
        { provide: SITE_CONFIG, useValue: site },
        { provide: TranslationService, useValue: translation },
        { provide: ArticlesService, useValue: { getById: (id: string) => of(ARTICLES[id]) } },
      ],
    });
    return TestBed.inject(MetaSeoService);
  }

  const visit = (url: string) => TestBed.inject(Router).navigateByUrl(url);

  beforeEach(() => clearHead());

  afterEach(() => {
    environment.siteUrl = originalSiteUrl;
    document.documentElement.lang = '';
    clearHead();
  });

  describe('in the browser', () => {
    const origin = window.location.origin;

    it('points the canonical at the language-prefixed URL with a trailing slash', async () => {
      setup('browser', 'de');
      await visit('/glossary?search=x#top');

      expect(canonical()).toBe(`${origin}/de/glossary/`);
      expect(ogUrl()).toBe(`${origin}/de/glossary/`);
    });

    it('collapses an Easy-Language variant to its base language in the canonical', async () => {
      setup('browser', 'en-easy');
      await visit('/glossary');

      expect(canonical()).toBe(`${origin}/en/glossary/`);
    });

    it('writes one hreflang per SEO language plus x-default on German, in the canonical URL shape', async () => {
      setup('browser', 'en');
      await visit('/glossary');

      expect(hreflangs()).toEqual([
        ['de', `${origin}/de/glossary/`],
        ['en', `${origin}/en/glossary/`],
        ['x-default', `${origin}/de/glossary/`],
      ]);
    });

    it('writes the same alternates whichever language is being read, easy variants included', async () => {
      setup('browser', 'de-easy');
      await visit('/glossary');

      expect(hreflangs().map(([lang]) => lang)).toEqual(['de', 'en', 'x-default']);
    });

    it('keeps the home page alternates at the language root', async () => {
      setup('browser', 'de');
      await visit('/');

      expect(hreflangs()).toEqual([
        ['de', `${origin}/de/`],
        ['en', `${origin}/en/`],
        ['x-default', `${origin}/de/`],
      ]);
    });

    it('replaces the alternates on each navigation instead of piling them up', async () => {
      setup('browser', 'de');
      await visit('/glossary');
      await visit('/');

      expect(hreflangs()).toHaveLength(3);
    });

    it('sets the page title from the route’s seo entry and appends the site name', async () => {
      setup('browser', 'en');
      await visit('/glossary');

      expect(document.title).toBe(`Glossary - ${SITE_NAME}`);
      expect(metaContent('name', 'keywords')).toBe(`glossary, ${SITE_NAME}`);
    });

    it('fills a default title that names the site itself instead of suffixing it', async () => {
      setup('browser', 'en');
      await visit('/no-seo-entry');

      expect(document.title).toBe(`${SITE_NAME} - Your Gateway to Learning`);
      expect(metaContent('name', 'description')).toBe(`${SITE_NAME} — a learning portal.`);
    });

    it('takes the site name from site.json, not from the translations', async () => {
      setup('browser', 'en', createSiteRules({ ...KIT_DEFAULT_SITE, name: 'Mathe mit Frau Schulz' }));
      await visit('/glossary');

      expect(document.title).toBe('Glossary - Mathe mit Frau Schulz');
      expect(metaContent('property', 'og:title')).toBe('Glossary - Mathe mit Frau Schulz');
      expect(metaContent('name', 'keywords')).toBe('glossary, Mathe mit Frau Schulz');
    });
  });

  // Only real data: no visit time passed off as a modification date, no
  // invented author or section (the same rule as the JSON-LD).
  describe('article metadata', () => {
    const operatedBy = (name: string): SiteRules =>
      createSiteRules({ ...KIT_DEFAULT_SITE, operator: { ...KIT_DEFAULT_SITE.operator, name } });

    it('takes the section from the category and the publication date from publishDate', async () => {
      setup('browser', 'en');
      await visit('/articles/dated');

      expect(document.title).toBe('Git in ten minutes');
      expect(metaContent('property', 'og:type')).toBe('article');
      expect(metaContent('property', 'article:section')).toBe('Fundamentals');
      expect(metaContent('property', 'article:published_time')).toBe('2026-07-15');
    });

    it('writes no modification time, because nothing records one', async () => {
      const stale = document.createElement('meta');
      stale.setAttribute('property', 'article:modified_time');
      stale.setAttribute('content', '2026-09-23T10:00:00.000Z');
      document.head.appendChild(stale);
      setup('browser', 'en');
      await visit('/articles/dated');

      expect(metaContent('property', 'article:modified_time')).toBeNull();
    });

    it('leaves out a section without a translation and a date the article does not have', async () => {
      setup('browser', 'en');
      await visit('/articles/plain');

      expect(metaContent('property', 'og:type')).toBe('article');
      expect(metaContent('property', 'article:section')).toBeNull();
      expect(metaContent('property', 'article:published_time')).toBeNull();
    });

    it('names no author while site.json holds the placeholder', async () => {
      setup('browser', 'en', operatedBy('[NAME]'));
      await visit('/articles/dated');
      await visit('/glossary');

      expect(metaContent('name', 'author')).toBeNull();
      expect(metaContent('property', 'article:author')).toBeNull();
    });

    it('names the site operator once site.json is filled in', async () => {
      setup('browser', 'en', operatedBy('Ada Lovelace'));
      await visit('/articles/dated');

      expect(metaContent('name', 'author')).toBe('Ada Lovelace');
      expect(metaContent('property', 'article:author')).toBe('Ada Lovelace');
    });

    it('drops the article properties again on the next page', async () => {
      setup('browser', 'en', operatedBy('Ada Lovelace'));
      await visit('/articles/dated');
      await visit('/glossary');

      expect(metaContent('property', 'og:type')).toBe('website');
      expect(metaContent('name', 'author')).toBe('Ada Lovelace');
      expect(metaContent('property', 'article:author')).toBeNull();
      expect(metaContent('property', 'article:section')).toBeNull();
      expect(metaContent('property', 'article:published_time')).toBeNull();
    });
  });

  describe('<html lang>', () => {
    it.each([
      ['de', 'de'],
      ['de-easy', 'de'],
      ['en', 'en'],
      ['en-easy', 'en'],
    ])('reads %s as lang="%s" from the start', (portalLang, htmlLang) => {
      setup('browser', portalLang);

      expect(document.documentElement.lang).toBe(htmlLang);
    });

    it('follows a language switch', () => {
      setup('browser', 'en');

      translation.switchTo('de-easy');

      expect(document.documentElement.lang).toBe('de');
    });
  });

  describe('on the server', () => {
    it('omits canonical, og:url and every hreflang while siteUrl is empty', async () => {
      environment.siteUrl = '';
      setup('server', 'de');
      await visit('/glossary');

      expect(document.title).toBe(`Glossary - ${SITE_NAME}`);
      expect(canonical()).toBeNull();
      expect(ogUrl()).toBeNull();
      expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
      expect(metaContent('property', 'og:image:alt')).toBeNull();
      expect(metaContent('name', 'twitter:image:alt')).toBeNull();
      expect(hreflangs()).toEqual([]);
    });

    it('sets the image together with its alt text once siteUrl is set', async () => {
      environment.siteUrl = 'https://portal.test';
      setup('server', 'en');
      await visit('/glossary');

      expect(metaContent('property', 'og:image')).toBe('https://portal.test/assets/images/og-image-default.png');
      expect(metaContent('property', 'og:image:alt')).toBe(SITE_NAME);
      expect(metaContent('name', 'twitter:image:alt')).toBe(SITE_NAME);
    });

    it('never falls back to a placeholder domain', async () => {
      environment.siteUrl = '   ';
      setup('server', 'en');
      await visit('/glossary');

      expect(document.head.innerHTML).not.toContain('example.com');
    });

    it('builds every absolute URL from siteUrl once it is set, without a doubled slash', async () => {
      environment.siteUrl = 'https://portal.test/';
      setup('server', 'en');
      await visit('/glossary');

      expect(canonical()).toBe('https://portal.test/en/glossary/');
      expect(hreflangs()).toEqual([
        ['de', 'https://portal.test/de/glossary/'],
        ['en', 'https://portal.test/en/glossary/'],
        ['x-default', 'https://portal.test/de/glossary/'],
      ]);
    });
  });
});
