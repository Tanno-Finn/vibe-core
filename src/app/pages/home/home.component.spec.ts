/**
 * HomeComponent spec — the landing page shows cards only for what the site has.
 *
 * `/home` stays the kit's landing page whatever site.json says, so its quick-start
 * cards, showcase rows and navigation examples must follow the feature switches:
 * a card for a switched-off feature would lead to a page that is not there (the
 * feature guard sends it to the start page). The article card always stays —
 * articles are content, not a feature.
 *
 * Only the component class is under test: the template is replaced by an empty one.
 */
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { HomeComponent } from './home.component';
import { TranslationService } from '../../services/translation.service';
import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, SiteRules, siteRulesFor } from '../../../config/site';

class TranslationServiceStub {
  readonly languageChanged = new Subject<string>().asObservable();
  readonly currentLanguage = 'en';
  translate(key: string): string {
    return `[${key}]`;
  }
}

function create(site: SiteRules): HomeComponent {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [HomeComponent],
    providers: [
      { provide: TranslationService, useClass: TranslationServiceStub },
      { provide: SITE_CONFIG, useValue: site },
    ],
  });
  TestBed.overrideComponent(HomeComponent, { set: { template: '', imports: [] } });
  return TestBed.createComponent(HomeComponent).componentInstance;
}

const ids = (items: { id: string }[]) => items.map((i) => i.id);

describe('HomeComponent', () => {
  it('shows every card with the kit defaults (every feature on)', () => {
    const home = create(KIT_DEFAULT_SITE_RULES);

    expect(ids(home.quickStartItems)).toEqual(['qs-evolution', 'qs-glossary', 'qs-timeline', 'qs-prompting']);
    expect(ids(home.filteredShowcaseItems())).toEqual([
      'learning-paths',
      'demos',
      'glossary',
      'timeline',
      'tools',
      'roadmap',
      'lessons',
      'sources',
    ]);
    expect(home.navigationExamples().map((e) => e.route)).toEqual(['/example-demo', '/catalog']);
    expect(home.tocItems().map((t) => t.id)).toContain('showcase');
  });

  it('drops the cards of switched-off features and keeps the article card', () => {
    const home = create(
      siteRulesFor({ ...KIT_DEFAULT_SITE, features: { demos: false, glossary: false, learn: false } }),
    );

    expect(ids(home.quickStartItems)).toEqual(['qs-timeline', 'qs-prompting']);
    // learn off takes the learning-path, demo and lesson rows (all open /learn); demos off takes the demo row too.
    expect(ids(home.filteredShowcaseItems())).toEqual(['timeline', 'tools', 'roadmap', 'sources']);
    expect(home.navigationExamples().map((e) => e.route)).toEqual(['/catalog']);
  });

  it('drops the demo row when only the demos are off, though /learn is on', () => {
    const home = create(siteRulesFor({ ...KIT_DEFAULT_SITE, features: { demos: false } }));

    expect(ids(home.filteredShowcaseItems())).not.toContain('demos');
    expect(ids(home.filteredShowcaseItems())).toContain('lessons');
  });

  it('leaves the showcase out of the table of contents when nothing is left to show', () => {
    const allOff = Object.fromEntries(
      ['glossary', 'timeline', 'catalog', 'sources', 'learn', 'roadmap', 'demos'].map((id) => [id, false]),
    );
    const home = create(siteRulesFor({ ...KIT_DEFAULT_SITE, features: allOff }));

    expect(home.filteredShowcaseItems()).toEqual([]);
    expect(home.tocItems().map((t) => t.id)).not.toContain('showcase');
    expect(ids(home.quickStartItems)).toEqual(['qs-prompting']);
  });
});
