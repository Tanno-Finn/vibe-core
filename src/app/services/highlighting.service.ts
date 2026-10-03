/**
 * Highlighting Service
 *
 * Component-safe highlighting service that processes content for glossary term highlighting.
 *
 * Key Features:
 * - Pre-processes highlighting as structured data
 * - Provides component-safe highlighted content
 * - Integrates cleanly with Angular templates
 * - Updates reactively with language changes
 * - Safe content processing without DOM manipulation risks
 *
 * Architecture: Service-level processing → Component rendering
 */
import { Injectable, effect, inject, signal, untracked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TranslationService } from './translation.service';
import { UserDataProvider } from '../models/user-data-provider';
import { HighlightingSlice } from '../models/user-data-envelope';
import { safeStorage } from '../utils/safe-storage';
import { DEFAULT_LANGUAGE, LANGUAGE_RULES } from '../../config/languages';

export interface HighlightedGlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category: string;
  popularity: string;
  alternatives: string[];
}

export interface HighlightMatch {
  term: string;
  startIndex: number;
  endIndex: number;
  entry: HighlightedGlossaryEntry;
  originalText: string;
}

export interface ProcessedContent {
  originalText: string;
  matches: HighlightMatch[];
  textSegments: TextSegment[];
}

export interface TextSegment {
  text: string;
  isHighlight: boolean;
  highlightData?: {
    term: string;
    definition: string;
    category: string;
    termId: string;
  };
}

export interface PopoverData {
  term: string;
  definition: string;
  category: string;
  termId: string;
  position: { x: number; y: number; termTop: number };
}

export interface HighlightingOptions {
  maxHighlights?: number;
  difficultyFilter?: 'beginner' | 'intermediate' | 'advanced' | 'all';
  categoryFilter?: string[];
  personalizedMode?: boolean;
  // Suppress highlighting of a specific entry — used in the glossary so an entry's
  // own term doesn't render as a clickable popover inside its own definition.
  excludeEntryId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HighlightingService implements UserDataProvider<'highlighting'> {
  readonly sliceKey = 'highlighting' as const;
  readonly storageKeys = ['glossaryHighlightingEnabled'] as const;

  private http = inject(HttpClient);
  private translationService = inject(TranslationService);

  private glossaryData: { [lang: string]: { [term: string]: HighlightedGlossaryEntry } } = {};
  private termMaps: { [lang: string]: Map<string, HighlightedGlossaryEntry> } = {};
  // Per-language longest-first sorted key list. termMaps[lang] is immutable
  // after load, so this is computed once per language instead of on every
  // findMatches() call — that sort was a hot path (dozens of highlight calls
  // per content page, each re-sorting the full ~K-key array).
  private sortedTermsCache: { [lang: string]: string[] } = {};
  // Memoizes processContent() results per (lang, excludeId, maxHighlights, text).
  // The directive re-highlights on every dataVersion bump / language switch /
  // effect re-run, so identical text blocks are processed repeatedly. termMaps
  // are immutable after load → cached results stay valid for that language.
  // Bounded with FIFO eviction (Map preserves insertion order).
  private processCache = new Map<string, ProcessedContent>();
  private static readonly PROCESS_CACHE_MAX = 4000;
  private isLoaded = false;
  private loadedSignal = signal(false);
  readonly isLoadedSignal = this.loadedSignal.asReadonly();

  // Per-language loading cache and promises
  private loadedLanguages = new Set<string>();
  private languageLoadPromises = new Map<string, Promise<void>>();
  // Version counter — increments each time a new language finishes loading, triggers reactive effects
  private dataVersionSignal = signal(0);
  readonly dataVersion = this.dataVersionSignal.asReadonly();

  // Enable/disable highlighting
  private highlightingEnabledSignal = signal(true);
  readonly highlightingEnabled$ = this.highlightingEnabledSignal.asReadonly();

  // Popover state management
  private currentPopover = signal<PopoverData | null>(null);
  readonly currentPopover$ = this.currentPopover.asReadonly();

  constructor() {
    // Load enabled state from localStorage
    const savedEnabled = safeStorage.get('glossaryHighlightingEnabled');
    if (savedEnabled !== null) {
      this.highlightingEnabledSignal.set(savedEnabled === 'true');
    }

    // Follow the language signal — preload a newly chosen language for
    // highlighting. The first run is the starting language, which initialize()
    // loads when highlighting is actually used; skip it, as the old change
    // subscription did.
    let first = true;
    effect(() => {
      const lang = this.translationService.currentLanguage$();
      if (first) {
        first = false;
        return;
      }
      untracked(() => this.ensureLanguageLoaded(lang));
    });
  }

  /**
   * Enable/disable highlighting
   */
  setHighlightingEnabled(enabled: boolean): void {
    this.highlightingEnabledSignal.set(enabled);
    safeStorage.set('glossaryHighlightingEnabled', enabled.toString());
  }

  /**
   * Check if highlighting is enabled
   */
  isHighlightingEnabled(): boolean {
    return this.highlightingEnabledSignal();
  }

  /**
   * Initialize highlighting service — loads current language only
   */
  async initialize(): Promise<void> {
    const lang = this.translationService.currentLanguage || DEFAULT_LANGUAGE;
    return this.ensureLanguageLoaded(lang);
  }

  /**
   * Ensure a specific language is loaded (cached — no duplicate requests)
   */
  async ensureLanguageLoaded(lang: string): Promise<void> {
    if (this.loadedLanguages.has(lang)) return;

    const existing = this.languageLoadPromises.get(lang);
    if (existing) return existing;

    const promise = this.loadLanguage(lang);
    this.languageLoadPromises.set(lang, promise);
    return promise;
  }

  /**
   * Load highlighting data for a single language from per-language compiled glossary file
   */
  private async loadLanguage(lang: string): Promise<void> {
    try {
      const data = await this.fetchGlossaryAlongChain(lang);
      if (!data) return;

      this.glossaryData[lang] = data;
      this.termMaps[lang] = new Map();

      Object.keys(data).forEach((searchTerm) => {
        const entry = data[searchTerm];
        this.termMaps[lang].set(searchTerm.toLowerCase(), entry);

        if (entry.term) {
          this.termMaps[lang].set(entry.term.toLowerCase(), entry);
        }

        if (entry.alternatives && Array.isArray(entry.alternatives)) {
          entry.alternatives.forEach((alt: string) => {
            if (alt && alt.trim()) {
              this.termMaps[lang].set(alt.toLowerCase(), entry);
            }
          });
        }
      });

      // Precompute the longest-first sorted key list once (findMatches hot path).
      this.sortedTermsCache[lang] = Array.from(this.termMaps[lang].keys()).sort((a, b) => b.length - a.length);

      this.loadedLanguages.add(lang);
      this.isLoaded = true;
      this.loadedSignal.set(true);
      this.dataVersionSignal.update((v) => v + 1);
    } catch (error) {
      console.error('HighlightingService: Failed to load highlighting data:', error);
    } finally {
      this.languageLoadPromises.delete(lang);
    }
  }

  /**
   * Fetch the compiled glossary for `lang`, walking the configured content
   * fallback chain (src/config/languages.json via LANGUAGE_RULES) — but only
   * within the reader's own language: an Easy-Language page may borrow its base
   * language's glossary, a page never gets tooltips in another language (an
   * 'en' failure must not serve German definitions). Resolves null when every
   * candidate failed; the page then simply renders without highlighting.
   */
  private async fetchGlossaryAlongChain(lang: string): Promise<{ [term: string]: HighlightedGlossaryEntry } | null> {
    const ownLanguage = LANGUAGE_RULES.baseLanguageOf(lang);
    const chain = LANGUAGE_RULES.contentFallbackChain(lang).filter(
      (candidate) => LANGUAGE_RULES.baseLanguageOf(candidate) === ownLanguage,
    );
    for (const candidate of chain) {
      try {
        return await firstValueFrom(
          this.http.get<{ [term: string]: HighlightedGlossaryEntry }>(
            `/assets/data/core/glossary/compiled-glossary.${candidate}.json`,
          ),
        );
      } catch (error) {
        const reason = (error as { message?: string } | null)?.message ?? error;
        console.warn(`HighlightingService: No highlighting data for '${candidate}' (chain for '${lang}'):`, reason);
      }
    }
    return null;
  }

  /**
   * ENHANCED API: Process text and return data-based highlighting with advanced options
   * Returns object with original text, match data, and text segments for Angular templates
   */
  processContent(text: string, language: string, options?: HighlightingOptions): ProcessedContent {
    const maxHighlights = options?.maxHighlights || 10;

    // Check if highlighting is disabled by user
    if (!this.highlightingEnabledSignal() || !this.isLoaded || !this.termMaps[language]) {
      return {
        originalText: text,
        matches: [],
        textSegments: [{ text, isHighlight: false }],
      };
    }

    // Memoization — identical (text, lang, excludeId, maxHighlights) tuples are
    // re-processed on every re-highlight (dataVersion bump, language switch,
    // effect re-run). termMaps are immutable post-load, so a cache hit is valid.
    const cacheKey = `${language}\u0000${options?.excludeEntryId ?? ''}\u0000${maxHighlights}\u0000${text}`;
    const cachedResult = this.processCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const matches = this.findMatches(text, language);
    const selfFiltered = options?.excludeEntryId
      ? matches.filter((m) => m.entry.id !== options.excludeEntryId)
      : matches;
    const filteredMatches = this.filterOverlappingMatches(selfFiltered).slice(0, maxHighlights);

    const textSegments = this.createTextSegments(text, filteredMatches);

    const result: ProcessedContent = {
      originalText: text,
      matches: filteredMatches,
      textSegments,
    };
    this.cacheProcessed(cacheKey, result);
    return result;
  }

  /**
   * Store a processed result in the bounded cache (oldest entry evicted first).
   */
  private cacheProcessed(key: string, value: ProcessedContent): void {
    if (this.processCache.size >= HighlightingService.PROCESS_CACHE_MAX) {
      const oldest = this.processCache.keys().next().value;
      if (oldest !== undefined) {
        this.processCache.delete(oldest);
      }
    }
    this.processCache.set(key, value);
  }

  /**
   * Find all glossary term matches in text with longest-match-first preference
   * Ensures longer terms like "Claude Code" are matched before shorter ones like "Claude"
   */
  private findMatches(text: string, language: string): HighlightMatch[] {
    const matches: HighlightMatch[] = [];
    const termMap = this.termMaps[language];
    const lowerText = text.toLowerCase();

    // OPTIMIZATION: longest-first ordering is precomputed once per language
    // (see sortedTermsCache); build it lazily if a language was populated
    // without going through loadLanguage().
    const sortedTerms =
      this.sortedTermsCache[language] ??
      (this.sortedTermsCache[language] = Array.from(termMap.keys()).sort((a, b) => b.length - a.length));

    // Track already matched positions to avoid overlapping
    const matchedPositions = new Set<number>();

    sortedTerms.forEach((searchTerm) => {
      const entry = termMap.get(searchTerm)!;
      let startIndex = 0;

      while (true) {
        const index = lowerText.indexOf(searchTerm, startIndex);
        if (index === -1) break;

        // CHECK: Skip if this position range is already matched by a longer term
        const isPositionAvailable = !this.hasOverlapWithMatched(index, index + searchTerm.length, matchedPositions);

        if (isPositionAvailable && this.isValidWordBoundary(text, index, searchTerm.length)) {
          if (this.isContextuallyAppropriate(text, index, searchTerm, entry)) {
            matches.push({
              term: text.substring(index, index + searchTerm.length),
              startIndex: index,
              endIndex: index + searchTerm.length,
              entry,
              originalText: searchTerm,
            });

            // MARK: Reserve this position range to prevent overlapping shorter matches
            for (let pos = index; pos < index + searchTerm.length; pos++) {
              matchedPositions.add(pos);
            }
          }
        }

        startIndex = index + 1;
      }
    });

    return matches.sort((a, b) => a.startIndex - b.startIndex);
  }

  /**
   * Check if the given range overlaps with already matched positions
   */
  private hasOverlapWithMatched(startIndex: number, endIndex: number, matchedPositions: Set<number>): boolean {
    for (let pos = startIndex; pos < endIndex; pos++) {
      if (matchedPositions.has(pos)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check contextual appropriateness to avoid false positives
   */
  private isContextuallyAppropriate(
    text: string,
    index: number,
    searchTerm: string,
    _entry: HighlightedGlossaryEntry,
  ): boolean {
    if (searchTerm.includes(' ')) {
      return true;
    }

    const commonWords = ['lernen', 'sprache', 'netzwerk', 'system', 'intelligenz', 'algorithmus'];
    if (commonWords.includes(searchTerm.toLowerCase())) {
      const contextWindow = 50;
      const before = text.substring(Math.max(0, index - contextWindow), index).toLowerCase();
      const after = text
        .substring(index + searchTerm.length, Math.min(text.length, index + searchTerm.length + contextWindow))
        .toLowerCase();

      const aiContextClues = [
        'künstlich',
        'neural',
        'maschinell',
        'deep',
        'machine',
        'artificial',
        'ai',
        'ki',
        'algorithmus',
        'modell',
        'training',
        'computer',
        'automatisch',
        'daten',
        'natural language',
        'processing',
        'nlp',
        'chatbot',
        'gpt',
        'transformer',
      ];

      return aiContextClues.some((clue) => before.includes(clue) || after.includes(clue));
    }

    return true;
  }

  /**
   * Check for valid word boundaries
   */
  private isValidWordBoundary(text: string, index: number, length: number): boolean {
    const before = index > 0 ? text[index - 1] : ' ';
    const after = index + length < text.length ? text[index + length] : ' ';

    const isBoundaryChar = (char: string) => {
      const code = char.charCodeAt(0);
      return (
        code <= 32 ||
        code === 33 ||
        code === 44 ||
        code === 46 ||
        code === 58 ||
        code === 59 ||
        code === 63 ||
        code === 40 ||
        code === 41 ||
        code === 91 ||
        code === 93 ||
        code === 123 ||
        code === 125 ||
        code === 34 ||
        code === 39 ||
        code === 45
      );
    };

    const hasBoundaries = isBoundaryChar(before) && isBoundaryChar(after);

    if (hasBoundaries && text.substring(index, index + length).length >= 4) {
      const afterChar = after;
      const isStandalone =
        isBoundaryChar(afterChar) &&
        (afterChar === ' ' ||
          afterChar === '.' ||
          afterChar === ',' ||
          afterChar === '!' ||
          afterChar === '?' ||
          afterChar === ':' ||
          afterChar === ';' ||
          afterChar === '\n' ||
          afterChar === '\r' ||
          afterChar === ')' ||
          afterChar === ']' ||
          afterChar === '"' ||
          index + length === text.length);

      return isStandalone;
    }

    return hasBoundaries;
  }

  /**
   * Remove overlapping matches (SIMPLIFIED - overlap handling now in findMatches)
   * This method now mainly serves as a failsafe and applies maxHighlights limit
   */
  private filterOverlappingMatches(matches: HighlightMatch[]): HighlightMatch[] {
    // Since longest-match-first is now handled in findMatches(),
    // overlaps should already be prevented. This is now mainly a failsafe.
    return matches.sort((a, b) => a.startIndex - b.startIndex);
  }

  /**
   * Create text segments for Angular template rendering
   * This bypasses HTML sanitization by using Angular components instead of innerHTML
   */
  private createTextSegments(text: string, matches: HighlightMatch[]): TextSegment[] {
    if (matches.length === 0) {
      return [{ text, isHighlight: false }];
    }

    const segments: TextSegment[] = [];
    let lastIndex = 0;

    matches.forEach((match) => {
      // Add text before match
      if (match.startIndex > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, match.startIndex),
          isHighlight: false,
        });
      }

      // Add highlighted match
      segments.push({
        text: match.term,
        isHighlight: true,
        highlightData: {
          term: match.entry.term,
          definition: match.entry.definition,
          category: match.entry.category,
          termId: match.entry.id,
        },
      });

      lastIndex = match.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isHighlight: false,
      });
    }

    return segments;
  }

  /**
   * Show the popover for one highlighted term
   */
  showPopover(
    termId: string,
    term: string,
    definition: string,
    category: string,
    position: { x: number; y: number; termTop: number },
  ): void {
    this.currentPopover.set({
      term,
      definition,
      category,
      termId,
      position,
    });
  }

  /**
   * Hide current popover
   */
  hidePopover(): void {
    this.currentPopover.set(null);
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isLoaded;
  }

  /**
   * Get entry by ID for popover display
   */
  getEntryById(id: string, language: string): HighlightedGlossaryEntry | null {
    if (!this.isLoaded || !this.glossaryData[language]) {
      return null;
    }

    const langData = this.glossaryData[language];
    for (const entry of Object.values(langData)) {
      if ((entry as HighlightedGlossaryEntry).id === id) {
        return entry as HighlightedGlossaryEntry;
      }
    }

    return null;
  }

  // === UserDataProvider implementation ===

  exportSlice(): HighlightingSlice {
    return { enabled: this.isHighlightingEnabled() };
  }

  validateSlice(data: unknown): data is HighlightingSlice {
    if (!data || typeof data !== 'object') return false;
    const obj = data as Record<string, unknown>;
    return typeof obj['enabled'] === 'boolean';
  }

  importSlice(data: HighlightingSlice): void {
    this.setHighlightingEnabled(data.enabled);
  }
}
