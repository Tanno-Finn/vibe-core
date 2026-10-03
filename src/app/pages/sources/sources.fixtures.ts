import { Source } from '../../services/book-sources.service';

/**
 * Shared fixtures for the sources-page specs. Three sources that between them
 * exercise every branch the citation formatters take: a book with ISBN, a
 * paper with DOI/volume/pages, and an author-less, year-less web page whose
 * title carries every character escapeHtml() has to neutralize.
 */
export const BOOK: Source = {
  id: 'b1',
  type: 'book',
  authors: 'Russell, S. & Norvig, P.',
  year: '2021',
  title: 'Artificial Intelligence: A Modern Approach',
  publication: 'Pearson',
  isbn: '978-0134610993',
  url: 'https://example.org/aima',
  chapter: 'Kapitel 1',
  parentChapterId: 'ch1',
  chapterNumber: 1,
  subChapter: 'Grundlagen',
  bookCitation: true,
};

export const PAPER: Source = {
  id: 'p1',
  type: 'paper',
  authors: 'Vaswani, A.',
  year: '2017',
  title: 'Attention Is All You Need',
  publication: 'NeurIPS',
  volume: '30',
  pages: '5998-6008',
  doi: '10.5555/3295222',
  url: 'https://arxiv.org/abs/1706.03762',
  chapter: 'Kapitel 2',
  parentChapterId: 'ch2',
  chapterNumber: 2,
};

export const WEB: Source = {
  id: 'w1',
  type: 'website',
  title: `<b>Tags</b> & "quotes" 'single'`,
  url: 'https://example.org/?a=1&b=2',
  accessed: '2026-01-01',
  chapter: 'Kapitel 1',
  parentChapterId: 'ch1',
  chapterNumber: 1,
};

export const ALL_SOURCES: Source[] = [BOOK, PAPER, WEB];
