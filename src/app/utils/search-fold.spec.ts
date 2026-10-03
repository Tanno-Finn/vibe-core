import { foldForSearch } from './search-fold';

describe('foldForSearch', () => {
  it('makes the Mediopunkt, hyphenated and closed spellings of a compound equal', () => {
    const forms = ['Code·review', 'Code-Review', 'Codereview', 'CODE‐REVIEW'];
    expect(new Set(forms.map(foldForSearch)).size).toBe(1);
  });

  it('lets a typed fragment find the Mediopunkt compound', () => {
    expect(foldForSearch('Sprach·modell').includes(foldForSearch('Sprachmod'))).toBe(true);
    expect(foldForSearch('Sprach·modell').includes(foldForSearch('sprach-modell'))).toBe(true);
  });

  it('keeps spaces, so whitespace still separates search words', () => {
    expect(foldForSearch('Large Language Model')).toBe('large language model');
  });
});
