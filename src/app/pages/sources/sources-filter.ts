import { Source } from '../../services/book-sources.service';
import { translatedOr } from '../../utils/translate-or';

/**
 * Pure search, filter and grouping logic behind the sources page. The page
 * wraps these in computed() signals; keeping them free of Angular makes the
 * rules readable in one place. Moved verbatim out of SourcesComponent.
 */

export type SourceScope = 'all' | 'book' | 'portal';

export interface SourceFilterCriteria {
  term: string;
  chapter: string | null;
  type: string | null;
}

/** One rendered group: a book chapter, or (portal scope) one piece of portal content. */
export interface SourceGroup {
  chapterId: string;
  chapterName: string;
  chapterNumber: number;
  sources: Source[];
}

/**
 * The DOM id of a group's heading, which the table of contents links to. Keyed on
 * chapterId (unique in both scopes), not chapterNumber: in portal scope the number
 * is the content-type order, so two article groups would share one id.
 */
export function chapterAnchorId(chapterId: string): string {
  return 'chapter-' + chapterId.replace(':', '-');
}

export interface FilterOption {
  label: string;
  value: string;
}

type Translate = (key: string) => string;

/** Display order of source types in the type filter. */
const TYPE_ORDER: Record<string, number> = {
  paper: 1,
  book: 2,
  website: 3,
  wikipedia: 4,
  blog: 5,
  video: 6,
  interview: 7,
  article: 8,
  other: 9,
};

/**
 * Case-insensitive text search over title, authors, publication, chapter and
 * sub-chapter, then the chapter filter (matched on parentChapterId) and the
 * type filter. Empty criteria pass everything through.
 */
export function filterSources(sources: Source[], { term, chapter, type }: SourceFilterCriteria): Source[] {
  const needle = term.toLowerCase();

  // Text search
  if (needle) {
    sources = sources.filter(
      (s) =>
        s.title.toLowerCase().includes(needle) ||
        (s.authors && s.authors.toLowerCase().includes(needle)) ||
        (s.publication && s.publication.toLowerCase().includes(needle)) ||
        (s.chapter && s.chapter.toLowerCase().includes(needle)) ||
        (s.subChapter && s.subChapter.toLowerCase().includes(needle)),
    );
  }

  // Chapter filter (uses parentChapterId for matching)
  if (chapter) {
    sources = sources.filter((s) => s.parentChapterId === chapter);
  }

  // Type filter
  if (type) {
    sources = sources.filter((s) => s.type === type);
  }

  return sources;
}

/** Group by book chapter, translated chapter name first, sorted by chapter number. */
export function groupSourcesByChapter(sources: Source[], translate: Translate): SourceGroup[] {
  const groups = new Map<string, Source[]>();

  sources.forEach((source) => {
    const chapterId = source.parentChapterId || 'unknown';
    if (!groups.has(chapterId)) {
      groups.set(chapterId, []);
    }
    groups.get(chapterId)!.push(source);
  });

  return Array.from(groups.entries())
    .map(([chapterId, chapterSources]) => ({
      chapterId,
      chapterName: translatedOr(translate, `sources.chapters.${chapterId}`, chapterSources[0]?.chapter || chapterId),
      chapterNumber: chapterSources[0]?.chapterNumber ?? 999,
      sources: chapterSources,
    }))
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

/** Chapter filter options: every parent chapter present, in chapter order. */
export function chapterOptionsFor(sources: Source[], translate: Translate): FilterOption[] {
  // Get unique parent chapter IDs with their numbers for sorting
  const chapterMap = new Map<string, Source>();
  sources.forEach((s) => {
    if (s.parentChapterId && !chapterMap.has(s.parentChapterId)) {
      chapterMap.set(s.parentChapterId, s);
    }
  });

  // Sort by chapter number and create options with translated labels; a chapter
  // without a translation shows its name from the data, like its group heading
  return Array.from(chapterMap.entries())
    .sort((a, b) => (a[1].chapterNumber ?? 999) - (b[1].chapterNumber ?? 999))
    .map(([chapterId, first]) => ({
      label: translatedOr(translate, `sources.chapters.${chapterId}`, first.chapter || chapterId),
      value: chapterId,
    }));
}

/** Type filter options: only the types that actually occur, in a fixed order. */
export function typeOptionsFor(sources: Source[], translate: Translate): FilterOption[] {
  const existingTypes = [...new Set(sources.map((s) => s.type))];

  return existingTypes
    .sort((a, b) => (TYPE_ORDER[a] || 99) - (TYPE_ORDER[b] || 99))
    .map((type) => ({
      value: type,
      label: translate(`sources.types.${type}`),
    }));
}
