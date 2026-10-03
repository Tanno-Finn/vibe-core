import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Source } from '../../services/book-sources.service';
import { CITATION_FORMAT_OPTIONS, citationLanguage } from './citation-formats';
import {
  generateBibTeXBibliography,
  generateHTMLBibliography,
  generateMarkdownBibliography,
  generateTextBibliography,
  groupSourcesForExport,
} from './bibliography';

/** What the caller asked to export. */
export interface BibliographyExportRequest {
  citationFormat: string;
  fileFormat: string;
  /** true: the whole list; false: the currently filtered subset. Only names the file. */
  exportAll: boolean;
  /** UI language; picks the export's wording and date format (de/de-easy German, else English). Absent: German. */
  language?: string;
}

/** What happened, so the caller can close its dialog and toast. */
export interface BibliographyExportResult {
  /** 'file' = a download was started, 'print' = the print window was opened. */
  kind: 'file' | 'print';
  count: number;
  formatLabel: string;
}

/**
 * Browser side of the sources page's bibliography export: turns a set of
 * sources into a downloaded file (Blob + temporary <a>) or, for PDF, into an
 * escaped HTML document written into a new window and printed. Everything
 * here touches window/document, so each entry point is platform-guarded and
 * a no-op during prerender.
 */
@Injectable({ providedIn: 'root' })
export class BibliographyExportService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * Export `sources`. Returns null when nothing happened: not in a browser,
   * or the print window was blocked.
   */
  export(sources: Source[], request: BibliographyExportRequest): BibliographyExportResult | null {
    // Blob URLs, a temporary <a> and window.open are browser-only.
    if (!this.isBrowser) return null;
    const { citationFormat, fileFormat } = request;

    const lang = citationLanguage(request.language ?? 'de');
    const sortedGroups = groupSourcesForExport(sources, lang);
    const formatLabel = CITATION_FORMAT_OPTIONS.find((f) => f.value === citationFormat)?.label || citationFormat;
    const exportType = request.exportAll ? 'all' : 'filtered';

    // Generate content based on file format
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    if (fileFormat === 'pdf') {
      // For PDF, generate HTML and open print dialog
      content = generateHTMLBibliography(sortedGroups, citationFormat, formatLabel, sources.length, lang);
      return this.printHtml(content) ? { kind: 'print', count: sources.length, formatLabel } : null;
    } else if (fileFormat === 'txt') {
      content = generateTextBibliography(sortedGroups, citationFormat, formatLabel, sources.length, lang);
      mimeType = 'text/plain;charset=utf-8';
      fileExtension = 'txt';
    } else if (fileFormat === 'bib') {
      content = generateBibTeXBibliography(sources, lang);
      mimeType = 'application/x-bibtex;charset=utf-8';
      fileExtension = 'bib';
    } else {
      // Markdown (default)
      content = generateMarkdownBibliography(sortedGroups, citationFormat, formatLabel, sources.length, lang);
      mimeType = 'text/markdown;charset=utf-8';
      fileExtension = 'md';
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bibliography-${citationFormat}-${exportType}-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { kind: 'file', count: sources.length, formatLabel };
  }

  /**
   * Open `htmlContent` in a new window and trigger the print dialog. The
   * content MUST already be escaped (generateHTMLBibliography does that).
   * Returns false if the window could not be opened (popup blocker).
   */
  private printHtml(htmlContent: string): boolean {
    // No 'noopener' here: it makes window.open() return null per spec, and
    // we need the handle to write the (same-origin, about:blank) document.
    if (!this.isBrowser) return false;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return false;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
    return true;
  }
}
