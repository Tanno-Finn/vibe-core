/**
 * RelatedRefsService spec — a reference into a switched-off feature is not shown.
 *
 * An article's "related" chips and cards, and the knowledge map's node links, come
 * from this service. With a feature switched off in site.json (glossary, timeline,
 * sources, catalog, demos) its page redirects to the start page, so a chip for one
 * of its entries would be a link that silently lands somewhere else: the service
 * drops those references. Articles are content, not a feature, and always stay.
 *
 * Every content service is stubbed with one entry per type; the fixture ids are
 * neutral and no test depends on the kit's content.
 */
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RelatedRefsService } from './related-refs.service';
import { ArticlesService } from './articles.service';
import { GlossaryService } from './glossary.service';
import { TimelineService } from './timeline.service';
import { DemosService } from './demos.service';
import { SourcesService } from './book-sources.service';
import { AiToolsService } from './ai-tools.service';
import { AiResourcesService } from './ai-resources.service';
import { TranslationService } from './translation.service';
import { OntologyService } from './ontology.service';
import { DevModeService } from './dev-mode.service';
import { NodeDisplayInfo, RelatedRefs, ResolvedRefGroup } from './related-refs.types';
import { OntologyNodeRef } from './ontology.types';
import { KIT_DEFAULT_SITE, KIT_DEFAULT_SITE_RULES, SITE_CONFIG, SiteRules, siteRulesFor } from '../../config/site';

/** One reference of every type. */
const REFS: RelatedRefs = {
  articles: ['a-1'],
  demos: ['d-1'],
  tools: ['tool-1'],
  resources: ['res-1'],
  glossary: ['g-1'],
  timeline: ['e-1'],
  sources: ['s-1'],
};

function create(site: SiteRules): RelatedRefsService {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      { provide: SITE_CONFIG, useValue: site },
      {
        provide: ArticlesService,
        useValue: {
          getAll: () => of([{ id: 'a-1', path: 'articles/a-1', titleKey: 't.a1' }]),
          isVisibleInProd: () => true,
        },
      },
      { provide: GlossaryService, useValue: { getAllEntries: () => of([{ id: 'g-1', term: 'Term' }]) } },
      { provide: TimelineService, useValue: { entries$: of([{ id: 'e-1', title: 'Event' }]) } },
      {
        provide: DemosService,
        useValue: {
          getAllDemos: () => of([{ id: 'd-1', path: 'example-demo', titleKey: 't.d1' }]),
          isPublished: () => true,
        },
      },
      { provide: SourcesService, useValue: { entries$: of([{ id: 's-1', title: 'Source' }]) } },
      { provide: AiToolsService, useValue: { entries$: of([{ id: 'tool-1', name: 'Tool' }]) } },
      { provide: AiResourcesService, useValue: { entries$: of([{ id: 'res-1', title: 'Resource' }]) } },
      { provide: OntologyService, useValue: { getNeighborsByType: () => of({}) } },
      { provide: TranslationService, useValue: { translate: (key: string) => key } },
      { provide: DevModeService, useValue: { isEffectivelyProd: signal(false) } },
    ],
  });
  return TestBed.inject(RelatedRefsService);
}

/** The groups resolveGroups emits for REFS, as `type: ids`. */
function groups(service: RelatedRefsService): Record<string, string[]> {
  let out: ResolvedRefGroup[] | undefined;
  service.resolveGroups(REFS).subscribe((g) => (out = g));
  TestBed.tick(); // lets the "simulate prod" signal emit
  expect(out, 'resolveGroups emitted').toBeDefined();
  return Object.fromEntries(out!.map((g) => [g.type, g.items.map((i) => i.id)]));
}

const NODES: OntologyNodeRef[] = [
  { type: 'article', id: 'a-1' },
  { type: 'demo', id: 'd-1' },
  { type: 'glossary', id: 'g-1' },
  { type: 'timeline', id: 'e-1' },
  { type: 'source', id: 's-1' },
];

function display(service: RelatedRefsService): Map<string, NodeDisplayInfo> {
  let out: Map<string, NodeDisplayInfo> | undefined;
  service.resolveDisplay(NODES).subscribe((m) => (out = m));
  TestBed.tick();
  expect(out, 'resolveDisplay emitted').toBeDefined();
  return out!;
}

describe('RelatedRefsService with feature switches (site.json)', () => {
  it('resolves every type with the kit defaults (every feature on)', () => {
    expect(groups(create(KIT_DEFAULT_SITE_RULES))).toEqual({
      articles: ['a-1'],
      demos: ['d-1'],
      catalogue: ['tool-1', 'res-1'],
      glossary: ['g-1'],
      timeline: ['e-1'],
      sources: ['s-1'],
    });
  });

  it('drops the glossary chips while the glossary is off, and keeps the rest', () => {
    const service = create(siteRulesFor({ ...KIT_DEFAULT_SITE, features: { glossary: false } }));
    const g = groups(service);
    expect(g['glossary']).toBeUndefined();
    expect(Object.keys(g)).toEqual(['articles', 'demos', 'catalogue', 'timeline', 'sources']);
    expect(service.isTypeOn('glossary')).toBe(false);
    expect(service.isTypeOn('articles')).toBe(true);
  });

  it('keeps only the articles while timeline, sources, catalog, demos and glossary are off', () => {
    const off = { glossary: false, timeline: false, sources: false, catalog: false, demos: false };
    expect(groups(create(siteRulesFor({ ...KIT_DEFAULT_SITE, features: off })))).toEqual({ articles: ['a-1'] });
  });

  it('gives the knowledge map no node of a switched-off feature, so no node links into it', () => {
    const all = display(create(KIT_DEFAULT_SITE_RULES));
    expect([...all.keys()]).toEqual(['article:a-1', 'demo:d-1', 'glossary:g-1', 'timeline:e-1', 'source:s-1']);

    const off = display(create(siteRulesFor({ ...KIT_DEFAULT_SITE, features: { glossary: false, sources: false } })));
    expect([...off.keys()]).toEqual(['article:a-1', 'demo:d-1', 'timeline:e-1']);
    expect(off.get('article:a-1')?.route).toEqual(['/articles/a-1']);
  });
});
