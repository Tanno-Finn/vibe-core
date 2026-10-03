/**
 * CatalogStateService spec — the catalog favorites and comparison list as a
 * user-data slice. The page-level behavior (toggling, legacy migration) is
 * pinned by catalog.component.spec.ts; this file covers what is new: the
 * lists now travel with the export/import.
 */
import { TestBed } from '@angular/core/testing';
import { CatalogStateService } from './catalog-state.service';
import { UserDataService } from '../../services/user-data.service';
import { USER_DATA_PROVIDERS } from '../../models/user-data-provider';

describe('CatalogStateService', () => {
  let service: CatalogStateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: USER_DATA_PROVIDERS, useExisting: CatalogStateService, multi: true }],
    });
    service = TestBed.inject(CatalogStateService);
  });

  afterEach(() => localStorage.clear());

  it('exports nothing while both lists are empty', () => {
    expect(service.exportSlice()).toBeNull();
  });

  it('exports the stored lists even before the catalog page was opened', () => {
    localStorage.setItem('catalog-favorites', JSON.stringify(['tool-a', 'rsrc-b']));
    localStorage.setItem('catalog-compare', JSON.stringify(['tool-a']));
    expect(service.exportSlice()).toEqual({ favorites: ['tool-a', 'rsrc-b'], compare: ['tool-a'] });
  });

  it('exports what a toggle stored', () => {
    service.toggleFavorite('tool-x');
    service.toggleCompare('tool-y');
    expect(service.exportSlice()).toEqual({ favorites: ['tool-x'], compare: ['tool-y'] });
  });

  it('skips a corrupt stored list instead of throwing', () => {
    localStorage.setItem('catalog-favorites', '{nope');
    localStorage.setItem('catalog-compare', JSON.stringify(['tool-a', 3]));
    expect(service.exportSlice()).toEqual({ compare: ['tool-a'] });
  });

  it('validates the slice shape', () => {
    expect(service.validateSlice({})).toBe(true);
    expect(service.validateSlice({ favorites: ['a'], compare: [] })).toBe(true);
    expect(service.validateSlice(null)).toBe(false);
    expect(service.validateSlice([])).toBe(false);
    expect(service.validateSlice({ favorites: 'a' })).toBe(false);
    expect(service.validateSlice({ compare: [1] })).toBe(false);
  });

  it('imports into memory and storage', () => {
    service.importSlice({ favorites: ['tool-a'], compare: ['tool-a', 'tool-b'] });
    expect([...service.favoriteEntries()]).toEqual(['tool-a']);
    expect([...service.compareTools()]).toEqual(['tool-a', 'tool-b']);
    expect(JSON.parse(localStorage.getItem('catalog-favorites')!)).toEqual(['tool-a']);
    expect(JSON.parse(localStorage.getItem('catalog-compare')!)).toEqual(['tool-a', 'tool-b']);
  });

  it('round-trips through the user-data export and import', () => {
    const userData = TestBed.inject(UserDataService);
    service.toggleFavorite('rsrc-1');
    service.toggleCompare('tool-1');
    const envelope = userData.buildEnvelope();
    expect(envelope.slices.catalog).toEqual({ favorites: ['rsrc-1'], compare: ['tool-1'] });

    localStorage.clear();
    service.load();
    expect(service.favoriteEntries().size).toBe(0);

    const result = userData.applyEnvelope(envelope);
    expect(result.appliedSlices).toContain('catalog');
    service.load();
    expect([...service.favoriteEntries()]).toEqual(['rsrc-1']);
    expect([...service.compareTools()]).toEqual(['tool-1']);
  });
});
