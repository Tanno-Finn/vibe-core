import { Source } from '../../services/book-sources.service';

/**
 * Citation styles for the sources page's bibliography export. Pure functions:
 * a source plus a style id in, one Markdown-flavored citation line out
 * (titles in *italics* where the style wants them). The fixed words a style
 * adds ("Accessed", "Available at", "pp.", the no-date marker) and the date
 * format follow the reader's UI language: German for de and de-easy, English
 * for everything else (CITATION_LABELS). citation-formats.spec.ts pins every
 * style's output in both languages.
 */

export interface ExportOption {
  value: string;
  label: string;
}

export const CITATION_FORMAT_OPTIONS: readonly ExportOption[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'apa7', label: 'APA 7th Edition' },
  { value: 'chicago', label: 'Chicago / Turabian' },
  { value: 'harvard', label: 'Harvard' },
  { value: 'mla9', label: 'MLA 9th Edition' },
  { value: 'ieee', label: 'IEEE' },
  { value: 'din-iso-690', label: 'DIN ISO 690' },
  { value: 'vancouver', label: 'Vancouver' },
];

export const FILE_FORMAT_OPTIONS: readonly ExportOption[] = [
  { value: 'md', label: 'Markdown (.md)' },
  { value: 'txt', label: 'Text (.txt)' },
  { value: 'bib', label: 'BibTeX (.bib)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
];

/** Escape the five HTML-significant characters. Guards the PDF path's document.write(). */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Language of the export's fixed wording and date format. Easy-Language
 * variants use their base language's conventions; every language that is not
 * German gets English.
 */
export type CitationLanguage = 'de' | 'en';

/** The fixed words the citation styles and the export files add around the data. */
export interface CitationLabels {
  /** "ohne Jahr" / "no date": what an author-date style prints when `year` is null or absent. */
  noDate: string;
  /** APA: "(Accessed: <date>)" after a web source. */
  accessed: string;
  /** DIN ISO 690: "[Accessed: <date>]". */
  accessedOn: string;
  /** Harvard and DIN ISO 690: "Available at: <url>". */
  availableAt: string;
  /** IEEE: "[Online]. Available: <url>". */
  onlineAvailable: string;
  /** Vancouver: "Available from: <url>". */
  availableFrom: string;
  /** APA type marker for a blog post. */
  blogPost: string;
  /** Page-range and volume abbreviations (Harvard, IEEE). */
  pages: string;
  volume: string;
  /** File header and grouping. */
  heading: string;
  citationFormat: string;
  date: string;
  sources: string;
  generated: string;
  unknownChapter: string;
}

export const CITATION_LABELS: Readonly<Record<CitationLanguage, CitationLabels>> = {
  de: {
    noDate: 'o. J.',
    accessed: 'Zugriff',
    accessedOn: 'Zugriff am',
    availableAt: 'Verfügbar unter',
    onlineAvailable: '[Online]. Verfügbar',
    availableFrom: 'Verfügbar unter',
    blogPost: 'Blog-Beitrag',
    pages: 'S.',
    volume: 'Bd.',
    heading: 'Literaturverzeichnis',
    citationFormat: 'Zitierstil',
    date: 'Datum',
    sources: 'Quellen',
    generated: 'Erstellt',
    unknownChapter: 'Unbekannt',
  },
  en: {
    noDate: 'n.d.',
    accessed: 'Accessed',
    accessedOn: 'Accessed',
    availableAt: 'Available at',
    onlineAvailable: '[Online]. Available',
    availableFrom: 'Available from',
    blogPost: 'Blog post',
    pages: 'pp.',
    volume: 'vol.',
    heading: 'Bibliography',
    citationFormat: 'Citation format',
    date: 'Date',
    sources: 'Sources',
    generated: 'Generated',
    unknownChapter: 'Unknown',
  },
};

/** The no-date marker per language (kept as its own export for callers that need only it). */
export const NO_DATE_LABEL: Readonly<Record<CitationLanguage, string>> = {
  de: CITATION_LABELS.de.noDate,
  en: CITATION_LABELS.en.noDate,
};

/** Map a UI language code (`de`, `de-easy`, `en`, `fr`, …) to a citation language. */
export function citationLanguage(uiLanguage: string | null | undefined): CitationLanguage {
  return uiLanguage?.startsWith('de') ? 'de' : 'en';
}

const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Format a calendar date the way the language writes it: German `05.03.2026`,
 * English `March 5, 2026`. Accepts a Date or an ISO `YYYY-MM-DD` string (the
 * `accessed` field); any other string is returned unchanged. Built by hand
 * rather than through Intl so the output is identical in every browser and in
 * the tests.
 */
export function formatCitationDate(value: Date | string, lang: CitationLanguage): string {
  let year: number, month: number, day: number;
  if (value instanceof Date) {
    [year, month, day] = [value.getFullYear(), value.getMonth() + 1, value.getDate()];
  } else {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (!m) return value;
    [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  }
  if (lang === 'de') {
    return `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;
  }
  return `${EN_MONTHS[month - 1]} ${day}, ${year}`;
}

/** Format a source in the selected citation style (unknown ids fall back to APA 7). */
export function formatCitation(source: Source, format: string, lang: CitationLanguage = 'de'): string {
  const labels = CITATION_LABELS[lang];
  switch (format) {
    case 'basic':
      return formatSourceBasic(source);
    case 'apa7':
      return formatSourceAPA(source, labels, lang);
    case 'chicago':
      return formatSourceChicago(source);
    case 'harvard':
      return formatSourceHarvard(source, labels);
    case 'mla9':
      return formatSourceMLA(source);
    case 'ieee':
      return formatSourceIEEE(source, labels);
    case 'din-iso-690':
      return formatSourceDIN(source, labels, lang);
    case 'vancouver':
      return formatSourceVancouver(source, labels);
    default:
      return formatSourceAPA(source, labels, lang);
  }
}

/**
 * Format source in Basic style (simple, minimal format)
 * Format: Author (Year). Title. URL
 * Without author: Title (Year). URL
 */
function formatSourceBasic(source: Source): string {
  const parts: string[] = [];

  if (source.authors) {
    // With author: Author (Year). Title. URL
    parts.push(source.authors);
    if (source.year) {
      parts.push(`(${source.year}).`);
    } else {
      parts.push('.');
    }
    if (source.title) {
      parts.push(`${source.title}.`);
    }
  } else {
    // Without author: Title (Year). URL
    if (source.title) {
      parts.push(source.title);
    }
    if (source.year) {
      parts.push(`(${source.year}).`);
    } else {
      parts.push('.');
    }
  }

  // URL or DOI
  if (source.doi) {
    parts.push(`https://doi.org/${source.doi}`);
  } else if (source.url) {
    parts.push(source.url);
  }

  return parts.join(' ');
}

/**
 * Format a single source in APA 7th edition style
 */
function formatSourceAPA(source: Source, labels: CitationLabels, lang: CitationLanguage): string {
  const parts: string[] = [];

  // Authors
  if (source.authors) {
    parts.push(source.authors);
  }

  // Year, or the no-date marker (year null or absent)
  parts.push(`(${source.year || labels.noDate}).`);

  // Title (with type-specific formatting)
  if (source.title) {
    switch (source.type) {
      case 'book':
        parts.push(`*${source.title}*.`); // Italics for books
        break;
      case 'paper':
        parts.push(`${source.title}.`);
        break;
      case 'video':
        parts.push(`${source.title} [Video].`);
        break;
      case 'website':
      case 'wikipedia':
        parts.push(`${source.title}.`);
        break;
      case 'blog':
        parts.push(`${source.title} [${labels.blogPost}].`);
        break;
      case 'interview':
        parts.push(`${source.title} [Interview].`);
        break;
      case 'article':
        parts.push(`${source.title}.`);
        break;
      default:
        parts.push(`${source.title}.`);
    }
  }

  // Publication info (journal, publisher, etc.)
  if (source.publication) {
    if (source.type === 'paper' || source.type === 'article') {
      let pubInfo = `*${source.publication}*`;
      if (source.volume) {
        pubInfo += `, ${source.volume}`;
      }
      if (source.pages) {
        pubInfo += `, ${source.pages}`;
      }
      parts.push(pubInfo + '.');
    } else {
      parts.push(`${source.publication}.`);
    }
  }

  // DOI (preferred) or URL
  if (source.doi) {
    parts.push(`https://doi.org/${source.doi}`);
  } else if (source.url) {
    parts.push(source.url);
  }

  // ISBN for books
  if (source.isbn && source.type === 'book') {
    parts.push(`ISBN: ${source.isbn}`);
  }

  // Accessed date for web sources
  if (source.accessed && (source.type === 'website' || source.type === 'wikipedia' || source.type === 'blog')) {
    parts.push(`(${labels.accessed}: ${formatCitationDate(source.accessed, lang)})`);
  }

  return parts.join(' ');
}

/**
 * Format source in Chicago/Turabian style
 */
function formatSourceChicago(source: Source): string {
  const parts: string[] = [];

  if (source.authors) {
    parts.push(source.authors + '.');
  }

  if (source.title) {
    if (source.type === 'book') {
      parts.push(`*${source.title}*.`);
    } else {
      parts.push(`"${source.title}."`);
    }
  }

  if (source.publication) {
    parts.push(`${source.publication},`);
  }

  if (source.year) {
    parts.push(`${source.year}.`);
  }

  if (source.url) {
    parts.push(source.url);
  }

  return parts.join(' ');
}

/**
 * Format source in Harvard style
 */
function formatSourceHarvard(source: Source, labels: CitationLabels): string {
  const parts: string[] = [];

  if (source.authors) {
    parts.push(source.authors);
  }

  // Harvard is author-date like APA: the date slot is never left empty.
  parts.push(`(${source.year || labels.noDate})`);

  if (source.title) {
    if (source.type === 'book') {
      parts.push(`*${source.title}*.`);
    } else {
      parts.push(`'${source.title}',`);
    }
  }

  if (source.publication) {
    parts.push(`*${source.publication}*`);
  }

  if (source.volume) {
    parts.push(`${source.volume}`);
  }

  if (source.pages) {
    parts.push(`${labels.pages} ${source.pages}.`);
  }

  if (source.url) {
    parts.push(`${labels.availableAt}: ${source.url}`);
  }

  return parts.join(' ');
}

/**
 * Format source in MLA 9th edition style
 */
function formatSourceMLA(source: Source): string {
  const parts: string[] = [];

  if (source.authors) {
    parts.push(source.authors + '.');
  }

  if (source.title) {
    if (source.type === 'book') {
      parts.push(`*${source.title}*.`);
    } else {
      parts.push(`"${source.title}."`);
    }
  }

  if (source.publication) {
    parts.push(`*${source.publication}*,`);
  }

  if (source.year) {
    parts.push(`${source.year}.`);
  }

  if (source.url) {
    parts.push(source.url);
  }

  return parts.join(' ');
}

/**
 * Format source in IEEE style
 */
function formatSourceIEEE(source: Source, labels: CitationLabels): string {
  const parts: string[] = [];

  if (source.authors) {
    parts.push(source.authors + ',');
  }

  if (source.title) {
    parts.push(`"${source.title}",`);
  }

  if (source.publication) {
    parts.push(`*${source.publication}*,`);
  }

  if (source.volume) {
    parts.push(`${labels.volume} ${source.volume},`);
  }

  if (source.pages) {
    parts.push(`${labels.pages} ${source.pages},`);
  }

  if (source.year) {
    parts.push(`${source.year}.`);
  }

  if (source.doi) {
    parts.push(`doi: ${source.doi}`);
  } else if (source.url) {
    parts.push(`${labels.onlineAvailable}: ${source.url}`);
  }

  return parts.join(' ');
}

/**
 * Format source in DIN ISO 690 style (German standard)
 */
function formatSourceDIN(source: Source, labels: CitationLabels, lang: CitationLanguage): string {
  const parts: string[] = [];

  if (source.authors) {
    parts.push(source.authors.toUpperCase() + ':');
  }

  if (source.title) {
    parts.push(`${source.title}.`);
  }

  if (source.publication) {
    parts.push(`In: ${source.publication}.`);
  }

  if (source.year) {
    parts.push(`${source.year}.`);
  }

  if (source.isbn) {
    parts.push(`ISBN ${source.isbn}.`);
  }

  if (source.url) {
    parts.push(`${labels.availableAt}: ${source.url}`);
    if (source.accessed) {
      parts.push(`[${labels.accessedOn}: ${formatCitationDate(source.accessed, lang)}]`);
    }
  }

  return parts.join(' ');
}

/**
 * Format source in Vancouver style
 */
function formatSourceVancouver(source: Source, labels: CitationLabels): string {
  const parts: string[] = [];

  if (source.authors) {
    parts.push(source.authors + '.');
  }

  if (source.title) {
    parts.push(`${source.title}.`);
  }

  if (source.publication) {
    parts.push(`${source.publication}.`);
  }

  if (source.year) {
    parts.push(`${source.year};`);
  }

  if (source.volume) {
    parts.push(`${source.volume}`);
  }

  if (source.pages) {
    parts.push(`:${source.pages}.`);
  }

  if (source.doi) {
    parts.push(`doi:${source.doi}`);
  } else if (source.url) {
    parts.push(`${labels.availableFrom}: ${source.url}`);
  }

  return parts.join(' ');
}
