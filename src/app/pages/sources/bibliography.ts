import { Source } from '../../services/book-sources.service';
import { CITATION_LABELS, CitationLanguage, escapeHtml, formatCitation, formatCitationDate } from './citation-formats';

/**
 * Bibliography file generators for the sources page's export: Markdown, plain
 * text, BibTeX, and the HTML document the PDF path prints. Pure string
 * builders; the browser I/O lives in BibliographyExportService. Headings,
 * header labels and dates follow the citation language (CITATION_LABELS);
 * citation-formats.spec.ts pins their output.
 */

export interface BibliographyGroup {
  chapterName: string;
  sources: Source[];
}

/** Group sources by chapter name for export, ordered by chapter number (unnumbered last). */
export function groupSourcesForExport(sources: Source[], lang: CitationLanguage = 'de'): BibliographyGroup[] {
  const groups = new Map<string, Source[]>();
  sources.forEach((source) => {
    const chapterName = source.chapter || CITATION_LABELS[lang].unknownChapter;
    if (!groups.has(chapterName)) {
      groups.set(chapterName, []);
    }
    groups.get(chapterName)!.push(source);
  });

  return Array.from(groups.entries())
    .map(([chapterName, chapterSources]) => ({
      chapterName,
      chapterNumber: chapterSources[0]?.chapterNumber ?? 999,
      sources: chapterSources,
    }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export function generateMarkdownBibliography(
  groups: BibliographyGroup[],
  citationFormat: string,
  formatLabel: string,
  totalSources: number,
  lang: CitationLanguage = 'de',
): string {
  const l = CITATION_LABELS[lang];
  let content = `# ${l.heading}\n\n`;
  content += `**${l.citationFormat}:** ${formatLabel}\n`;
  content += `**${l.date}:** ${formatCitationDate(new Date(), lang)}\n`;
  content += `**${l.sources}:** ${totalSources}\n\n`;
  content += '---\n\n';

  groups.forEach((group) => {
    content += `## ${group.chapterName}\n\n`;
    group.sources.forEach((source) => {
      content += formatCitation(source, citationFormat, lang) + '\n\n';
    });
  });

  return content;
}

export function generateTextBibliography(
  groups: BibliographyGroup[],
  citationFormat: string,
  formatLabel: string,
  totalSources: number,
  lang: CitationLanguage = 'de',
): string {
  const l = CITATION_LABELS[lang];
  let content = `${l.heading.toUpperCase()}\n`;
  content += `${'='.repeat(40)}\n\n`;
  content += `${l.citationFormat}: ${formatLabel}\n`;
  content += `${l.date}: ${formatCitationDate(new Date(), lang)}\n`;
  content += `${l.sources}: ${totalSources}\n\n`;
  content += `${'-'.repeat(40)}\n\n`;

  groups.forEach((group) => {
    content += `${group.chapterName.toUpperCase()}\n`;
    content += `${'-'.repeat(group.chapterName.length)}\n\n`;
    group.sources.forEach((source) => {
      // Remove markdown formatting for plain text
      const citation = formatCitation(source, citationFormat, lang)
        .replace(/\*([^*]+)\*/g, '$1') // Remove italics
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links
      content += citation + '\n\n';
    });
  });

  return content;
}

export function generateHTMLBibliography(
  groups: BibliographyGroup[],
  citationFormat: string,
  formatLabel: string,
  totalSources: number,
  lang: CitationLanguage = 'de',
): string {
  const l = CITATION_LABELS[lang];
  let html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${l.heading}</title>
  <style>
    body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
    h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { font-size: 18px; margin-top: 30px; color: #444; }
    .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
    .citation { margin-bottom: 16px; text-indent: -40px; padding-left: 40px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>${l.heading}</h1>
  <div class="meta">
    <p><strong>${l.citationFormat}:</strong> ${escapeHtml(formatLabel)}</p>
    <p><strong>${l.date}:</strong> ${formatCitationDate(new Date(), lang)}</p>
    <p><strong>${l.sources}:</strong> ${totalSources}</p>
  </div>
`;

  groups.forEach((group) => {
    html += `  <h2>${escapeHtml(group.chapterName)}</h2>\n`;
    group.sources.forEach((source) => {
      // Escape FIRST, then convert markdown italics — source strings come
      // from translation-pipeline-touched JSON and must not reach
      // document.write() unescaped
      const citation = escapeHtml(formatCitation(source, citationFormat, lang)).replace(/\*([^*]+)\*/g, '<em>$1</em>');
      html += `  <p class="citation">${citation}</p>\n`;
    });
  });

  html += `</body></html>`;
  return html;
}

export function generateBibTeXBibliography(sources: Source[], lang: CitationLanguage = 'de'): string {
  const l = CITATION_LABELS[lang];
  let content = `% BibTeX - ${l.heading}\n`;
  content += `% ${l.generated}: ${formatCitationDate(new Date(), lang)}\n`;
  content += `% ${l.sources}: ${sources.length}\n\n`;

  sources.forEach((source) => {
    const key = bibTeXKey(source);
    const entryType = bibTeXEntryType(source.type);

    content += `@${entryType}{${key},\n`;

    if (source.authors) {
      content += `  author = {${source.authors}},\n`;
    }
    content += `  title = {${source.title}},\n`;

    if (source.year) {
      content += `  year = {${source.year}},\n`;
    }
    if (source.publication) {
      if (entryType === 'article') {
        content += `  journal = {${source.publication}},\n`;
      } else {
        content += `  publisher = {${source.publication}},\n`;
      }
    }
    if (source.volume) {
      content += `  volume = {${source.volume}},\n`;
    }
    if (source.pages) {
      content += `  pages = {${source.pages}},\n`;
    }
    if (source.doi) {
      content += `  doi = {${source.doi}},\n`;
    }
    if (source.url) {
      content += `  url = {${source.url}},\n`;
    }
    if (source.isbn) {
      content += `  isbn = {${source.isbn}},\n`;
    }

    content += `}\n\n`;
  });

  return content;
}

function bibTeXKey(source: Source): string {
  const authorPart = source.authors
    ? source.authors.split(/[,&]/)[0].trim().split(' ').pop()?.toLowerCase() || 'unknown'
    : 'unknown';
  const yearPart = source.year || 'nd';
  const titleWord = source.title
    .split(' ')[0]
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  return `${authorPart}${yearPart}${titleWord}`;
}

function bibTeXEntryType(sourceType: string): string {
  const typeMap: Record<string, string> = {
    paper: 'article',
    book: 'book',
    website: 'misc',
    wikipedia: 'misc',
    blog: 'misc',
    video: 'misc',
    interview: 'misc',
    article: 'article',
    other: 'misc',
  };
  return typeMap[sourceType] || 'misc';
}
