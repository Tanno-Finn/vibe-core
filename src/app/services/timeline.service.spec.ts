import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { TimelineEvent, TimelineService } from './timeline.service';
import { UnifiedContentService } from './unified-content.service';

/**
 * Easy German writes compounds with a Mediopunkt ("Sprach·modell"); a visitor
 * types "Sprachmodell" or "Sprach-Modell". The timeline filter search folds both
 * sides (foldForSearch), so the joiner does not decide whether an event is found.
 */
describe('TimelineService search across compound joiners', () => {
  const event = (id: string, title: string, extra: Partial<TimelineEvent> = {}): TimelineEvent => ({
    id,
    year: '2020',
    date: '2020-01-01',
    category: 'research',
    importance: 'major',
    icon: '',
    color: '',
    title,
    description: '',
    ...extra,
  });

  let service: TimelineService;

  beforeEach(() => {
    const bundle = {
      timeline: {
        gpt: event('gpt', 'Großes Sprach·modell'),
        review: event('review', 'Code-Review wird Alltag', { organizations: ['Open·Source Stiftung'] }),
        other: event('other', 'Etwas anderes'),
      },
    };
    TestBed.configureTestingModule({
      providers: [{ provide: UnifiedContentService, useValue: { bundle$: new BehaviorSubject(bundle) } }],
    });
    service = TestBed.inject(TimelineService);
  });

  const ids = (events: TimelineEvent[]) => events.map((e) => e.id);

  it.each([
    ['sprachmodell', ['gpt']],
    ['Sprach-Modell', ['gpt']],
    ['sprach·modell', ['gpt']],
    ['codereview', ['review']],
    ['code·review', ['review']],
    ['opensource', ['review']],
    ['großes sprachmodell', ['gpt']],
  ])('the filter search finds %s', (search, expected) => {
    service.updateFilters({ search });
    expect(ids(service.filteredEvents())).toEqual(expected);
  });

  it('keeps the exact-id deep link', () => {
    service.updateFilters({ search: 'exact:review' });
    expect(ids(service.filteredEvents())).toEqual(['review']);
  });
});
