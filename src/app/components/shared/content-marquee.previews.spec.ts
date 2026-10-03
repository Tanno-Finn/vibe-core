/**
 * Content marquee on /home — every tile shows a preview.
 *
 * Some tiles showed a preview image and the rest an empty grey box.
 * Cause: pathToThumbnail mapped every /articles/<slug> to an illustration without
 * asking whether that illustration was baked, and the kit bakes only seed-article-1,
 * so 15 of 17 tiles fell through to <app-illustration>'s grey placeholder. A grey
 * box is a valid DOM node, so nothing failed.
 *
 * This spec renders the real marquee over the real content indexes (every article
 * and demo, not a hand-picked sample) and walks the DOM: each tile must carry a
 * baked image or the designed fallback tile, and never a placeholder. It goes
 * through the DOM on purpose — asserting on pathToThumbnail alone would stay green
 * if the template stopped using it.
 *
 * The release gates are stubbed open: which items are published is the services'
 * business (and pinned elsewhere); here every item that COULD appear is checked.
 * TranslationService echoes the key, so nothing depends on translated copy.
 *
 * One article is added to the real index: an entry nobody baked a picture for, so
 * the designed fallback is exercised whatever the content is. Without it the spec
 * went red on a site that removed the kit's samples (tools/make-it-yours.mjs), where
 * only the baked seed article and the example demo are left.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject, of } from 'rxjs';

import ARTICLE_INDEX from '../../../assets/data/core/articles/index.json';
import DEMO_INDEX from '../../../assets/data/core/demos/index.json';
import { ArticlesService } from '../../services/articles.service';
import { DemosService } from '../../services/demos.service';
import { TranslationService } from '../../services/translation.service';
import { ContentMarqueeComponent } from './content-marquee.component';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage$ = () => 'en';
  get currentLanguage(): string {
    return 'en';
  }
  translate(key: string): string {
    return key;
  }
}

/** An article without a baked picture (see the header), copied from the first real entry. */
const UNBAKED_ARTICLE = {
  ...ARTICLE_INDEX[0],
  id: 'fixture-unbaked',
  path: 'articles/fixture-unbaked',
  pageId: 'fxub',
};
const ARTICLES = [...ARTICLE_INDEX, UNBAKED_ARTICLE];

class ArticlesServiceStub {
  getAll() {
    return of(ARTICLES);
  }
  isVisibleInProd(): boolean {
    return true;
  }
}

class DemosServiceStub {
  getAllDemos() {
    return of(DEMO_INDEX);
  }
  isPublished(): boolean {
    return true;
  }
}

/** Every path the marquee can show: each article and each demo of the indexes. */
const EXPECTED_PATHS = [...ARTICLES, ...DEMO_INDEX].map((item) => '/' + item.path).sort();

/** What one <app-thumbnail> actually rendered. */
function previewOf(thumb: Element): 'baked' | 'fallback' | 'placeholder' | 'none' {
  if (thumb.querySelector('.illustration-placeholder, .vs-placeholder, .thumb-skeleton')) return 'placeholder';
  if (thumb.querySelector('.illustration-baked, .vs-baked')) return 'baked';
  if (thumb.querySelector('.thumb-fallback .thumb-fallback-badge i[class*="pi-"]')) return 'fallback';
  return 'none';
}

/** Path → preview kind for every tile link matched by `selector`. */
function previews(host: HTMLElement, selector: string): Map<string, string> {
  const out = new Map<string, string>();
  host.querySelectorAll(selector).forEach((a) => {
    const thumb = a.querySelector('app-thumbnail');
    out.set(a.getAttribute('data-cmq-path') ?? '?', thumb ? previewOf(thumb) : 'none');
  });
  return out;
}

describe('ContentMarqueeComponent — every tile shows a preview', () => {
  let fixture: ComponentFixture<ContentMarqueeComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    // The drift loop is endless; a frame that never fires keeps it out of the way
    // (the index data arrives synchronously via of(), so no await is needed).
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
    await TestBed.configureTestingModule({
      imports: [ContentMarqueeComponent],
      providers: [
        provideRouter([]),
        { provide: TranslationService, useClass: TranslationServiceStub },
        { provide: ArticlesService, useClass: ArticlesServiceStub },
        { provide: DemosService, useClass: DemosServiceStub },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ContentMarqueeComponent);
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  });

  afterEach(() => vi.restoreAllMocks());

  it('drops no article or demo from the band (sanity: the indexes are not empty)', () => {
    expect(EXPECTED_PATHS.length).toBeGreaterThan(2);
    const shown = [...previews(host, '.cmq-group:not([aria-hidden="true"]) a.cmq-tile').keys()].sort();
    expect(shown).toEqual(EXPECTED_PATHS);
  });

  it('gives each band tile a baked image or the designed fallback, never an empty box', () => {
    const byPath = previews(host, '.cmq-group:not([aria-hidden="true"]) a.cmq-tile');
    const bad = [...byPath].filter(([, kind]) => kind !== 'baked' && kind !== 'fallback');
    expect(bad, 'band tiles without a preview').toEqual([]);
    // Non-vacuous: the seed content is baked, the unbaked fixture (and any sample article) is not.
    const kinds = new Set(byPath.values());
    expect(kinds.has('baked')).toBe(true);
    expect(kinds.has('fallback')).toBe(true);
  });

  it('keeps that promise in the expanded grid, section pages included', () => {
    const expand = host.querySelector('button[aria-controls="cmq-content"]') as HTMLButtonElement;
    expand.click();
    fixture.detectChanges();
    const byPath = previews(host, '.cmq-grid a.cmq-tile');
    expect(byPath.size).toBeGreaterThan(EXPECTED_PATHS.length);
    const bad = [...byPath].filter(([, kind]) => kind !== 'baked' && kind !== 'fallback');
    expect(bad, 'grid tiles without a preview').toEqual([]);
  });
});
