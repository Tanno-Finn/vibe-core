import {
  CITATION_FORMAT_OPTIONS,
  NO_DATE_LABEL,
  citationLanguage,
  escapeHtml,
  formatCitation,
  formatCitationDate,
} from './citation-formats';
import {
  generateBibTeXBibliography as bibtex,
  generateHTMLBibliography as html,
  generateMarkdownBibliography as markdown,
  generateTextBibliography as text,
  groupSourcesForExport,
} from './bibliography';
import { Source } from '../../services/book-sources.service';
import { BOOK, PAPER, WEB } from './sources.fixtures';

/**
 * Characterization tests for the bibliography export: every citation style,
 * the four file generators, and the HTML escaping that guards the PDF path's
 * document.write(). The expected strings were pinned from the implementation
 * as it stood before the sources page was split up, quirks included (the
 * doubled period after an author list that already ends in one is how the
 * formatters have always behaved). The fixed wording and the dates are German
 * by default and English for `en` (see "English export" below).
 */

const WEB_TITLE = `<b>Tags</b> & "quotes" 'single'`;

describe('citation formats', () => {
  const cases: Array<[string, Source, string]> = [
    [
      'basic',
      BOOK,
      'Russell, S. & Norvig, P. (2021). Artificial Intelligence: A Modern Approach. https://example.org/aima',
    ],
    ['basic', PAPER, 'Vaswani, A. (2017). Attention Is All You Need. https://doi.org/10.5555/3295222'],
    ['basic', WEB, `${WEB_TITLE} . https://example.org/?a=1&b=2`],
    [
      'apa7',
      BOOK,
      'Russell, S. & Norvig, P. (2021). *Artificial Intelligence: A Modern Approach*. Pearson. https://example.org/aima ISBN: 978-0134610993',
    ],
    [
      'apa7',
      PAPER,
      'Vaswani, A. (2017). Attention Is All You Need. *NeurIPS*, 30, 5998-6008. https://doi.org/10.5555/3295222',
    ],
    ['apa7', WEB, `(o. J.). ${WEB_TITLE}. https://example.org/?a=1&b=2 (Zugriff: 01.01.2026)`],
    [
      'chicago',
      BOOK,
      'Russell, S. & Norvig, P.. *Artificial Intelligence: A Modern Approach*. Pearson, 2021. https://example.org/aima',
    ],
    ['chicago', PAPER, 'Vaswani, A.. "Attention Is All You Need." NeurIPS, 2017. https://arxiv.org/abs/1706.03762'],
    [
      'harvard',
      BOOK,
      'Russell, S. & Norvig, P. (2021) *Artificial Intelligence: A Modern Approach*. *Pearson* Verfügbar unter: https://example.org/aima',
    ],
    [
      'harvard',
      PAPER,
      "Vaswani, A. (2017) 'Attention Is All You Need', *NeurIPS* 30 S. 5998-6008. Verfügbar unter: https://arxiv.org/abs/1706.03762",
    ],
    [
      'mla9',
      BOOK,
      'Russell, S. & Norvig, P.. *Artificial Intelligence: A Modern Approach*. *Pearson*, 2021. https://example.org/aima',
    ],
    ['mla9', PAPER, 'Vaswani, A.. "Attention Is All You Need." *NeurIPS*, 2017. https://arxiv.org/abs/1706.03762'],
    [
      'ieee',
      PAPER,
      'Vaswani, A., "Attention Is All You Need", *NeurIPS*, Bd. 30, S. 5998-6008, 2017. doi: 10.5555/3295222',
    ],
    ['ieee', WEB, `"${WEB_TITLE}", [Online]. Verfügbar: https://example.org/?a=1&b=2`],
    [
      'din-iso-690',
      BOOK,
      'RUSSELL, S. & NORVIG, P.: Artificial Intelligence: A Modern Approach. In: Pearson. 2021. ISBN 978-0134610993. Verfügbar unter: https://example.org/aima',
    ],
    ['din-iso-690', WEB, `${WEB_TITLE}. Verfügbar unter: https://example.org/?a=1&b=2 [Zugriff am: 01.01.2026]`],
    ['vancouver', PAPER, 'Vaswani, A.. Attention Is All You Need. NeurIPS. 2017; 30 :5998-6008. doi:10.5555/3295222'],
    [
      'vancouver',
      BOOK,
      'Russell, S. & Norvig, P.. Artificial Intelligence: A Modern Approach. Pearson. 2021; Verfügbar unter: https://example.org/aima',
    ],
  ];

  it.each(cases)('%s formats %# as pinned', (format, source, expected) => {
    expect(formatCitation(source, format)).toBe(expected);
  });

  it('falls back to APA 7 for an unknown format', () => {
    expect(formatCitation(PAPER, 'no-such-style')).toBe(formatCitation(PAPER, 'apa7'));
  });
});

describe('English export', () => {
  const cases: Array<[string, Source, string]> = [
    ['apa7', WEB, `(n.d.). ${WEB_TITLE}. https://example.org/?a=1&b=2 (Accessed: January 1, 2026)`],
    [
      'harvard',
      PAPER,
      "Vaswani, A. (2017) 'Attention Is All You Need', *NeurIPS* 30 pp. 5998-6008. Available at: https://arxiv.org/abs/1706.03762",
    ],
    [
      'ieee',
      PAPER,
      'Vaswani, A., "Attention Is All You Need", *NeurIPS*, vol. 30, pp. 5998-6008, 2017. doi: 10.5555/3295222',
    ],
    ['ieee', WEB, `"${WEB_TITLE}", [Online]. Available: https://example.org/?a=1&b=2`],
    ['din-iso-690', WEB, `${WEB_TITLE}. Available at: https://example.org/?a=1&b=2 [Accessed: January 1, 2026]`],
    [
      'vancouver',
      BOOK,
      'Russell, S. & Norvig, P.. Artificial Intelligence: A Modern Approach. Pearson. 2021; Available from: https://example.org/aima',
    ],
  ];

  it.each(cases)('%s formats %# in English', (format, source, expected) => {
    expect(formatCitation(source, format, 'en')).toBe(expected);
  });

  it('writes dates the way each language does and leaves non-ISO text alone', () => {
    expect(formatCitationDate('2026-08-16', 'de')).toBe('16.08.2026');
    expect(formatCitationDate('2026-08-16', 'en')).toBe('August 16, 2026');
    expect(formatCitationDate(new Date(2026, 2, 5), 'de')).toBe('05.03.2026');
    expect(formatCitationDate('Sommer 2025', 'en')).toBe('Sommer 2025');
  });
});

describe('a source that states no date (year: null)', () => {
  const UNDATED: Source = { ...PAPER, year: null, doi: '', volume: undefined, pages: undefined };

  it('prints the German marker by default and the English one on request', () => {
    expect(formatCitation(UNDATED, 'apa7')).toBe(
      'Vaswani, A. (o. J.). Attention Is All You Need. *NeurIPS*. https://arxiv.org/abs/1706.03762',
    );
    expect(formatCitation(UNDATED, 'apa7', 'en')).toBe(
      'Vaswani, A. (n.d.). Attention Is All You Need. *NeurIPS*. https://arxiv.org/abs/1706.03762',
    );
    expect(formatCitation(UNDATED, 'harvard', 'en')).toBe(
      "Vaswani, A. (n.d.) 'Attention Is All You Need', *NeurIPS* Available at: https://arxiv.org/abs/1706.03762",
    );
    expect(formatCitation(UNDATED, 'harvard')).toBe(
      "Vaswani, A. (o. J.) 'Attention Is All You Need', *NeurIPS* Verfügbar unter: https://arxiv.org/abs/1706.03762",
    );
  });

  it('never prints "null" and leaves the year out of styles that have no date slot', () => {
    for (const style of CITATION_FORMAT_OPTIONS) {
      const out = formatCitation(UNDATED, style.value, 'en');
      expect(out).not.toContain('null');
    }
    expect(formatCitation(UNDATED, 'mla9')).toBe(
      'Vaswani, A.. "Attention Is All You Need." *NeurIPS*, https://arxiv.org/abs/1706.03762',
    );
  });

  it('maps UI languages onto the two marker languages', () => {
    expect(citationLanguage('de')).toBe('de');
    expect(citationLanguage('de-easy')).toBe('de');
    expect(citationLanguage('en-easy')).toBe('en');
    expect(citationLanguage('fr')).toBe('en');
    expect(citationLanguage(undefined)).toBe('en');
    expect(NO_DATE_LABEL).toEqual({ de: 'o. J.', en: 'n.d.' });
  });

  it('threads the language through the file generators', () => {
    const md = markdown([{ chapterName: 'Kapitel 2', sources: [UNDATED] }], 'apa7', 'APA 7th Edition', 1, 'en');
    expect(md).toContain('Vaswani, A. (n.d.).');
    expect(md.startsWith('# Bibliography\n\n**Citation format:** APA 7th Edition\n')).toBe(true);
    expect(bibtex([UNDATED])).not.toContain('year =');
    expect(bibtex([UNDATED], 'en').startsWith('% BibTeX - Bibliography\n% Generated: ')).toBe(true);
  });
});

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });

  it('leaves ordinary text alone', () => {
    expect(escapeHtml('Kapitel 1: Grundlagen')).toBe('Kapitel 1: Grundlagen');
  });
});

describe('bibliography generators', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 2, 5, 12, 0, 0));
  });
  afterEach(() => vi.useRealTimers());

  const apaPaper = formatCitation(PAPER, 'apa7');

  it('groups export sources by chapter name, unnumbered chapters last', () => {
    const loose: Source = { id: 'x', type: 'other', title: 'Loose' };
    expect(groupSourcesForExport([loose, PAPER, BOOK, WEB])).toEqual([
      { chapterName: 'Kapitel 1', chapterNumber: 1, sources: [BOOK, WEB] },
      { chapterName: 'Kapitel 2', chapterNumber: 2, sources: [PAPER] },
      { chapterName: 'Unbekannt', chapterNumber: 999, sources: [loose] },
    ]);
    expect(groupSourcesForExport([loose], 'en')[0].chapterName).toBe('Unknown');
  });

  it('writes Markdown with a header block and one section per group', () => {
    expect(markdown([{ chapterName: 'Kapitel 2', sources: [PAPER] }], 'apa7', 'APA 7th Edition', 1)).toBe(
      '# Literaturverzeichnis\n\n' +
        '**Zitierstil:** APA 7th Edition\n' +
        '**Datum:** 05.03.2026\n' +
        '**Quellen:** 1\n\n' +
        '---\n\n' +
        '## Kapitel 2\n\n' +
        apaPaper +
        '\n\n',
    );
  });

  it('writes plain text with Markdown italics and links stripped', () => {
    expect(text([{ chapterName: 'Kapitel 2', sources: [PAPER] }], 'apa7', 'APA 7th Edition', 1)).toBe(
      'LITERATURVERZEICHNIS\n' +
        '='.repeat(40) +
        '\n\n' +
        'Zitierstil: APA 7th Edition\n' +
        'Datum: 05.03.2026\n' +
        'Quellen: 1\n\n' +
        '-'.repeat(40) +
        '\n\n' +
        'KAPITEL 2\n' +
        '---------\n\n' +
        apaPaper.replace('*NeurIPS*', 'NeurIPS') +
        '\n\n',
    );
  });

  it('writes BibTeX entries with derived keys and type-dependent fields', () => {
    expect(bibtex([PAPER, BOOK, WEB])).toBe(
      '% BibTeX - Literaturverzeichnis\n' +
        '% Erstellt: 05.03.2026\n' +
        '% Quellen: 3\n\n' +
        '@article{vaswani2017attention,\n' +
        '  author = {Vaswani, A.},\n' +
        '  title = {Attention Is All You Need},\n' +
        '  year = {2017},\n' +
        '  journal = {NeurIPS},\n' +
        '  volume = {30},\n' +
        '  pages = {5998-6008},\n' +
        '  doi = {10.5555/3295222},\n' +
        '  url = {https://arxiv.org/abs/1706.03762},\n' +
        '}\n\n' +
        '@book{russell2021artificial,\n' +
        '  author = {Russell, S. & Norvig, P.},\n' +
        '  title = {Artificial Intelligence: A Modern Approach},\n' +
        '  year = {2021},\n' +
        '  publisher = {Pearson},\n' +
        '  url = {https://example.org/aima},\n' +
        '  isbn = {978-0134610993},\n' +
        '}\n\n' +
        '@misc{unknownndbtagsb,\n' +
        `  title = {${WEB_TITLE}},\n` +
        '  url = {https://example.org/?a=1&b=2},\n' +
        '}\n\n',
    );
  });

  describe('HTML (the document.write print path)', () => {
    const render = (): string =>
      html(
        [
          { chapterName: 'Kapitel <1>', sources: [BOOK, WEB] },
          { chapterName: 'Kapitel 2', sources: [PAPER] },
        ],
        'apa7',
        'APA <7>',
        3,
      );

    it('escapes group names, the format label and every citation', () => {
      const out = render();
      expect(out).toContain('<h2>Kapitel &lt;1&gt;</h2>');
      expect(out).toContain('<p><strong>Zitierstil:</strong> APA &lt;7&gt;</p>');
      expect(out).toContain(
        '<p class="citation">(o. J.). &lt;b&gt;Tags&lt;/b&gt; &amp; &quot;quotes&quot; &#39;single&#39;. https://example.org/?a=1&amp;b=2 (Zugriff: 01.01.2026)</p>',
      );
      expect(out).not.toContain('<b>Tags</b>');
    });

    it('turns Markdown italics into <em> only after escaping', () => {
      const out = render();
      expect(out).toContain(
        '<p class="citation">Russell, S. &amp; Norvig, P. (2021). <em>Artificial Intelligence: A Modern Approach</em>. Pearson. https://example.org/aima ISBN: 978-0134610993</p>',
      );
    });

    it('is a complete, dated document', () => {
      const out = render();
      expect(out.startsWith('<!DOCTYPE html>\n<html lang="de">\n<head>\n  <meta charset="UTF-8">\n')).toBe(true);
      expect(out).toContain(
        '<body>\n  <h1>Literaturverzeichnis</h1>\n  <div class="meta">\n' +
          '    <p><strong>Zitierstil:</strong> APA &lt;7&gt;</p>\n' +
          '    <p><strong>Datum:</strong> 05.03.2026</p>\n' +
          '    <p><strong>Quellen:</strong> 3</p>\n  </div>\n  <h2>',
      );
      expect(out.endsWith('</p>\n</body></html>')).toBe(true);
    });
  });
});
