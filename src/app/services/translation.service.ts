/**
 * Translation Service
 *
 * Signal-based UI-string lookup over split i18n bundles.
 *
 * - STATE IS SIGNALS. `currentLanguage$` is the language, `translationsReady`
 *   says the first bundle has been tried, and `translate()` reads a version
 *   signal so a `computed()` re-resolves when a bundle lands. The Observables
 *   `languageChanged` / `isTranslationsLoaded` are compatibility views derived
 *   from those signals (toObservable) for code that still subscribes.
 * - BUNDLES ARE SPLIT (scripts/build-i18n-bundles.ts). One small CORE bundle
 *   per language (`i18n.<lang>.json`: the shell namespaces plus the list of
 *   chunks) loads up front; page-sized namespaces are CHUNKS
 *   (`i18n/chunks/<lang>/<id>.json`) loaded when a route needs them
 *   (translationReadyGuard) or, as a safety net, the first time a key from one
 *   is looked up.
 * - FALLBACK IS CONFIG. A missing key walks `i18nFallbackChain` from
 *   src/config/language-rules.mts (de -> en, de-easy -> de -> en,
 *   en-easy -> en). A fallback language is fetched only when a key actually
 *   needs it — every shipped locale is complete (check-i18n-keys.mjs), so
 *   normally nothing beyond the current language is downloaded.
 * - PRERENDER == HYDRATION. On the server every chunk a page loaded is recorded
 *   in TransferState; the browser replays exactly that list before the first
 *   route activates, from the HTTP transfer cache, so hydration renders the
 *   same strings without a second download.
 */
import {
  Injectable,
  PendingTasks,
  PLATFORM_ID,
  TransferState,
  inject,
  isDevMode,
  makeStateKey,
  signal,
  Signal,
} from '@angular/core';
import { APP_BASE_HREF, isPlatformServer } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, map, pairwise } from 'rxjs';
import { safeStorage } from '../utils/safe-storage';
import { I18nCoreBundle, TranslationLoaderService, TranslationModule } from './translation-loader.service';
import {
  ALL_LANGUAGES,
  BASE_LANGUAGES,
  DEFAULT_LANGUAGE,
  KEY_SOURCE_LANGUAGE,
  LANGUAGE_INFO,
  LANGUAGE_RULES,
} from '../../config/languages';

export interface DisplayElement {
  type: 'flag' | 'icon';
  key: string;
}

export interface Language {
  name: string;
  code: string;
  nativeName: string;
  primary: DisplayElement;
  secondary?: DisplayElement;
}

export interface LanguageChangeEvent {
  oldLang: string;
  newLang: string;
}

/** Chunks a prerendered page loaded, replayed by the browser before hydration. */
const I18N_CHUNKS_STATE = makeStateKey<{ lang: string; chunks: string[] }>('i18n-chunks');

/**
 * The picker's list, derived from src/config/languages.json: sorted by English
 * name, each base language followed by its Easy-Language variant.
 */
function buildLanguageList(): Language[] {
  return [...LANGUAGE_INFO]
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .flatMap((l): Language[] => [
      { name: l.name, code: l.code, nativeName: l.nativeName, primary: { type: 'flag', key: l.flag } },
      {
        name: l.easyName,
        code: l.easyCode,
        nativeName: l.easyNativeName,
        primary: { type: 'flag', key: l.flag },
        secondary: { type: 'icon', key: 'easy-language' },
      },
    ]);
}

/** What a core bundle says about the chunks of its language. */
interface ChunkIndex {
  chunks: Set<string>;
  splitParents: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly translationLoader = inject(TranslationLoaderService);
  private readonly baseHref = inject(APP_BASE_HREF, { optional: true }) ?? '/';
  private readonly pendingTasks = inject(PendingTasks);
  private readonly transferState = inject(TransferState);
  private readonly isServer = isPlatformServer(inject(PLATFORM_ID));

  // Every locale in src/config/languages.json, as the language picker shows
  // them: sorted by English name, each base language followed by its
  // Easy-Language variant. Add a language there, not here.
  private readonly availableLanguages: Language[] = buildLanguageList();

  // Starts on the SITE default (languages.json `defaultLanguage`) — the same
  // language the bare-URL redirect in index.html and hreflang x-default use.
  // Detection in the constructor replaces it synchronously when the URL, a
  // stored choice or the browser says otherwise, so nothing ever observes the
  // default where detection found another language.
  private readonly currentLanguageSignal = signal<string>(DEFAULT_LANGUAGE);
  /** The current portal language (may carry the `-easy` suffix). */
  readonly currentLanguage$ = this.currentLanguageSignal.asReadonly();

  // Incremented whenever a bundle or chunk lands. translate() reads it so a
  // computed()/template re-resolves; exposed for caches that must rebuild.
  private readonly version = signal<number>(0);
  /** Bumps whenever translation data arrives — read it to invalidate a cache of translated strings. */
  readonly translationsVersion: Signal<number> = this.version.asReadonly();

  // The last language switch (null until the first one). Replays to late
  // readers, unlike the Subject it replaces.
  private readonly lastChangeSignal = signal<LanguageChangeEvent | null>(null);
  readonly lastLanguageChange: Signal<LanguageChangeEvent | null> = this.lastChangeSignal.asReadonly();

  // True once the current language's core bundle has been tried (loaded or
  // failed) — the app may start. The route guard waits on whenReady() instead.
  private readonly readySignal = signal<boolean>(false);
  readonly translationsReady: Signal<boolean> = this.readySignal.asReadonly();

  /**
   * @deprecated Compatibility view for subscribers. Read `currentLanguage$` in
   * a `computed()`/`effect()` instead. Emits `{ oldLang, newLang }` for every
   * change after subscription (derived from the signal; delivered when effects
   * flush, not synchronously inside `setLanguage`).
   */
  readonly languageChanged: Observable<LanguageChangeEvent> = toObservable(this.currentLanguageSignal).pipe(
    pairwise(),
    map(([oldLang, newLang]) => ({ oldLang, newLang })),
  );

  /** @deprecated Compatibility view of `translationsReady` (replays the current value). */
  readonly isTranslationsLoaded: Observable<boolean> = toObservable(this.readySignal);

  // Loaded data per language. A chunk is merged into its language's tree at
  // its path, so lookups never care where a namespace came from.
  private readonly translationData: Record<string, TranslationModule> = Object.fromEntries(
    ALL_LANGUAGES.map((lang) => [lang, {}]),
  );
  private readonly chunkIndex = new Map<string, ChunkIndex>();
  private readonly coreLoaded = new Set<string>();
  private readonly settled = new Set<string>(); // `${lang}|${chunk}` tried: loaded or failed
  private readonly inFlight = new Map<string, Promise<void>>();
  private readonly failed = new Set<string>(); // loads that ended in an error
  private readonly scheduled = new Set<string>(); // deferred loads already queued (see scheduleOnce)
  private initialLoad: Promise<void> = Promise.resolve();

  constructor() {
    this.detectLanguage();
    const lang = this.currentLanguageSignal();
    this.persistEasyModeFlag(lang);
    this.initialLoad = this.ensureCore(lang)
      .then(() => this.replayServerChunks(lang))
      .finally(() => this.readySignal.set(true));
  }

  /**
   * Whether a language's core bundle has been loaded. (Chunks load per page;
   * "fully" is kept for compatibility and means "the core is in".)
   */
  isLanguageFullyLoaded(lang: string): boolean {
    return this.coreLoaded.has(lang);
  }

  /**
   * Resolves once the current language's core bundle — and the chunks for the
   * given namespaces (e.g. a route's) — have been tried. Never rejects: a
   * failed load degrades to the fallback chain, it does not block navigation.
   */
  async whenReady(namespaces: readonly string[] = []): Promise<void> {
    await this.initialLoad;
    const lang = this.currentLanguageSignal();
    await this.ensureCore(lang);
    const index = this.chunkIndex.get(lang);
    if (!index) return;
    await Promise.all(namespaces.filter((ns) => index.chunks.has(ns)).map((ns) => this.ensureChunk(lang, ns)));
  }

  /**
   * Resolve the starting language. Priority: 1. URL prefix → 2. localStorage →
   * 3. Browser → 4. the site default (DEFAULT_LANGUAGE), which the signal
   * already holds. Synchronous on purpose: every consumer constructed after
   * this service reads the resolved language, so none needs an event for it.
   */
  private detectLanguage(): void {
    // 1. URL-based detection (highest priority — URL is source of truth)
    const urlLang = this.detectLanguageFromUrl();
    if (urlLang) {
      // Check easy-mode flag from localStorage
      const finalLang = this.isEasyModeStored() ? `${urlLang}-easy` : urlLang;
      const lang = this.isValidLanguage(finalLang) ? finalLang : urlLang;
      if (this.isValidLanguage(lang)) {
        this.currentLanguageSignal.set(lang);
        this.saveLanguage(lang);
      }
      return;
    }
    // 2-4. localStorage → Browser → site default (already in the signal)
    const savedLang = this.getSavedLanguage();
    if (savedLang && this.isValidLanguage(savedLang)) {
      this.currentLanguageSignal.set(savedLang);
      return;
    }
    const browserLang = this.detectBrowserLanguage();
    if (browserLang && this.isValidLanguage(browserLang)) {
      this.currentLanguageSignal.set(browserLang);
      this.saveLanguage(browserLang);
    }
  }

  /**
   * Detect base language from URL prefix (e.g. /de/glossary → 'de')
   */
  private detectLanguageFromUrl(): string | null {
    // In SSR/prerender context, use APP_BASE_HREF (set per-route in app.config.server.ts)
    const path = typeof window !== 'undefined' ? window.location.pathname : this.baseHref;
    for (const code of BASE_LANGUAGES) {
      if (path === `/${code}` || path === `/${code}/` || path.startsWith(`/${code}/`)) {
        return code;
      }
    }
    return null;
  }

  /**
   * Check if easy language mode is stored in localStorage
   */
  private isEasyModeStored(): boolean {
    return safeStorage.get('easy-language-mode') === 'true';
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  /** Load a language's core bundle once; later calls share the first attempt. */
  private ensureCore(lang: string): Promise<void> {
    return this.once(`${lang}|`, async () => {
      const core: I18nCoreBundle = await this.translationLoader.loadCore(lang);
      if (Object.keys(core.namespaces).length === 0) return; // total failure: fallback chain / raw keys
      Object.assign(this.translationData[lang] ?? (this.translationData[lang] = {}), core.namespaces);
      this.chunkIndex.set(lang, { chunks: new Set(core.chunks), splitParents: core.splitParents });
      this.coreLoaded.add(lang);
      this.version.update((v) => v + 1);
    });
  }

  /** Load one chunk of a language once and merge it at its path. */
  private ensureChunk(lang: string, chunkId: string): Promise<void> {
    return this.once(`${lang}|${chunkId}`, async () => {
      await this.ensureCore(lang);
      if (!this.chunkIndex.get(lang)?.chunks.has(chunkId)) return;
      const data = await this.translationLoader.loadChunk(lang, chunkId);
      // A chunk is a superset of any part of it the core already carries
      // (`coreKeys` in i18n-bundles.json), so replacing is safe.
      setPath(this.translationData[lang], chunkId.split('.'), data);
      this.version.update((v) => v + 1);
      if (this.isServer && lang === this.currentLanguageSignal()) this.recordServerChunk(lang, chunkId);
    });
  }

  /**
   * Run a load at most once per key. The work is registered with PendingTasks
   * so the prerenderer waits for it (and re-renders the strings it brings), and
   * a failure is swallowed after logging: a missing chunk degrades to the
   * fallback chain and, at worst, to the raw key — never a crash.
   */
  private once(key: string, work: () => Promise<void>): Promise<void> {
    const existing = this.inFlight.get(key);
    if (existing) return existing;
    const done = this.pendingTasks.add();
    const run = work()
      .catch((error: unknown) => {
        this.failed.add(key);
        console.warn(`[i18n] Could not load "${key}":`, error);
      })
      .finally(() => {
        this.settled.add(key);
        done();
      });
    this.inFlight.set(key, run);
    return run;
  }

  /** Server: remember which chunks this page used, for the browser to replay. */
  private recordServerChunk(lang: string, chunkId: string): void {
    const state = this.transferState.get(I18N_CHUNKS_STATE, { lang, chunks: [] });
    if (!state.chunks.includes(chunkId)) {
      this.transferState.set(I18N_CHUNKS_STATE, { lang, chunks: [...state.chunks, chunkId] });
    }
  }

  /** Browser: load the chunks the prerendered HTML was rendered with. */
  private async replayServerChunks(lang: string): Promise<void> {
    if (this.isServer) return;
    const state = this.transferState.get(I18N_CHUNKS_STATE, null);
    if (!state || state.lang !== lang) return;
    await Promise.all(state.chunks.map((id) => this.ensureChunk(lang, id)));
  }

  /**
   * Which chunk holds `key` in `lang`: a chunk id, null for the core bundle,
   * or undefined while the core (and with it the chunk list) is not loaded.
   */
  private chunkFor(lang: string, key: string): string | null | undefined {
    const index = this.chunkIndex.get(lang);
    if (!index) return undefined;
    for (const parent of index.splitParents) {
      if (key.startsWith(parent + '.')) {
        const child = key.slice(parent.length + 1).split('.', 1)[0];
        const id = `${parent}.${child}`;
        return index.chunks.has(id) ? id : null;
      }
    }
    const ns = key.split('.', 1)[0];
    return index.chunks.has(ns) ? ns : null;
  }

  /**
   * Is the data that would hold `key` in `lang` settled (loaded or failed)?
   * If not, start loading it — deferred to a microtask, because translate()
   * runs inside computed()s and templates, where starting a request (which
   * writes signals) is not allowed.
   *
   * Each load is scheduled ONCE. Scheduling a microtask on every lookup made
   * each change-detection pass queue another microtask, whose completion
   * triggered the next pass — a loop that starved the pending HTTP response and
   * hung the prerenderer.
   */
  private isSettledOrRequest(lang: string, key: string): boolean {
    const chunk = this.chunkFor(lang, key);
    const coreKey = `${lang}|`;
    if (chunk === undefined) {
      if (this.settled.has(coreKey)) return true; // core failed: nothing more to wait for
      // Core first (it carries the chunk list), then the chunk this key lives in.
      // Other keys waiting on the same core request their chunk when the version
      // bump re-runs them.
      this.scheduleOnce(coreKey, () =>
        this.ensureCore(lang).then(() => {
          const next = this.chunkFor(lang, key);
          return next ? this.ensureChunk(lang, next) : undefined;
        }),
      );
      return false;
    }
    if (chunk === null) return true;
    const chunkKey = `${lang}|${chunk}`;
    if (this.settled.has(chunkKey)) return true;
    this.scheduleOnce(chunkKey, () => this.ensureChunk(lang, chunk));
    return false;
  }

  /** Start `work` in a microtask, unless that load is already scheduled or running. */
  private scheduleOnce(key: string, work: () => Promise<unknown>): void {
    if (this.scheduled.has(key) || this.inFlight.has(key)) return;
    this.scheduled.add(key);
    void Promise.resolve().then(work);
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * PUBLIC API: Get current language
   */
  get currentLanguage(): string {
    return this.currentLanguageSignal();
  }

  /**
   * PUBLIC API: Current language without '-easy' suffix, safe for Intl APIs.
   * An '-easy' code only survives Intl because 'easy' happens to parse as a
   * script subtag; a regional code plus the suffix throws RangeError.
   */
  get currentIntlLocale(): string {
    return LANGUAGE_RULES.baseLanguageOf(this.currentLanguageSignal());
  }

  /**
   * PUBLIC API: Get all available languages
   */
  get languages(): Language[] {
    return this.availableLanguages;
  }

  /**
   * PUBLIC API: Change language. Loads the new language's core and the chunks
   * the current page already uses BEFORE switching, so the page does not flash
   * raw keys; persistence is enforced even when the language is unchanged.
   */
  async setLanguage(lang: string): Promise<void> {
    if (!this.isValidLanguage(lang)) {
      console.warn(`TranslationService: Invalid language code: ${lang}`);
      return;
    }

    const oldLang = this.currentLanguageSignal();

    // Persistence invariants are enforced unconditionally: even if the language
    // didn't actually change, the caller's intent is "make X the current
    // language" and the persisted state must reflect X. Otherwise an init that
    // resolved the language inconsistently (e.g. URL gave base lang but flag
    // was missing) wouldn't get repaired by an explicit setLanguage(X) call.
    this.saveLanguage(lang);
    this.persistEasyModeFlag(lang);

    if (oldLang === lang) return;

    await this.ensureCore(lang);
    const pageChunks = [...(this.chunkIndex.get(oldLang)?.chunks ?? [])].filter((id) =>
      this.settled.has(`${oldLang}|${id}`),
    );
    await Promise.all(pageChunks.map((id) => this.ensureChunk(lang, id)));

    this.currentLanguageSignal.set(lang);
    this.lastChangeSignal.set({ oldLang, newLang: lang });
  }

  /**
   * PUBLIC API: Look up a UI string. Walks the fallback chain of the current
   * language; a language whose data for this key has not arrived yet is
   * requested and the key itself is returned until it lands (the version
   * signal then re-runs the caller). A key found nowhere renders as itself.
   */
  translate(key: string): string {
    // Read version signal to create dependency for computed signals
    this.version();

    let mayFetch = true;
    for (const lang of LANGUAGE_RULES.i18nFallbackChain(this.currentLanguageSignal())) {
      const value = lookup(this.translationData[lang], key);
      if (typeof value === 'string') return value;
      if (!mayFetch) continue; // later languages: only what is already loaded
      if (!this.isSettledOrRequest(lang, key)) return key;
      // In production every shipped locale carries every key-source key
      // (check-i18n-keys.mjs fails the build otherwise), so a key missing from
      // data that DID load is missing everywhere: fetching a fallback language
      // for it would only download (and, on the server, embed) a whole bundle
      // to render the same key. Fetch further only when this language's data
      // failed to load — or in dev mode, where a locale may be half-written.
      mayFetch = isDevMode() || this.loadFailedFor(lang, key);
    }
    return key;
  }

  /** Did the data that would hold `key` in `lang` fail to load? */
  private loadFailedFor(lang: string, key: string): boolean {
    if (!this.coreLoaded.has(lang)) return true;
    const chunk = this.chunkFor(lang, key);
    return !!chunk && this.failed.has(`${lang}|${chunk}`);
  }

  /**
   * PUBLIC API: Get any value from translations (including arrays and objects)
   * Use this when you need to retrieve non-string values like word libraries.
   * Current language only — no fallback; null on a miss (or before the chunk
   * holding it has arrived; the version signal re-runs a computed caller).
   */
  translateValue<T = unknown>(key: string): T | null {
    this.version();
    const lang = this.currentLanguageSignal();
    const value = lookup(this.translationData[lang], key);
    if (value === undefined) {
      this.isSettledOrRequest(lang, key);
      return null;
    }
    return value as T;
  }

  /**
   * PUBLIC API: Get translations for namespace, flattened. Falls back to the
   * key-source language when the current language lacks the namespace.
   */
  getTranslations(namespace: string): Record<string, string> {
    this.version();
    const lang = this.currentLanguageSignal();
    for (const candidate of lang === KEY_SOURCE_LANGUAGE ? [lang] : [lang, KEY_SOURCE_LANGUAGE]) {
      // Settle first: the core may hold only part of a chunked namespace.
      if (!this.isSettledOrRequest(candidate, namespace + '.')) return {};
      const value = lookup(this.translationData[candidate], namespace);
      if (value !== undefined && value !== null && typeof value === 'object') {
        const result: Record<string, string> = {};
        flatten(value, '', result);
        return result;
      }
    }
    return {};
  }

  /**
   * Validate language code
   */
  private isValidLanguage(lang: string): boolean {
    return this.availableLanguages.some((l) => l.code === lang);
  }

  /**
   * Detect browser language from navigator.languages array
   * Checks full codes first, then base codes (e.g. de from de-DE)
   */
  private detectBrowserLanguage(): string | null {
    if (typeof window === 'undefined' || !window.navigator) {
      return null;
    }

    const languages = window.navigator.languages?.length
      ? window.navigator.languages
      : window.navigator.language
        ? [window.navigator.language]
        : [];

    for (const lang of languages) {
      const fullCode = lang.toLowerCase();
      if (this.isValidLanguage(fullCode)) {
        return fullCode;
      }
      const baseCode = fullCode.split('-')[0];
      if (this.isValidLanguage(baseCode)) {
        return baseCode;
      }
    }

    return null;
  }

  /**
   * Save language preference
   */
  private saveLanguage(lang: string): void {
    safeStorage.set('preferred-language-v2', lang);
  }

  /**
   * Single owner of the `easy-language-mode` flag — kept in sync with the
   * current language whenever it changes. The flag is what language detection
   * uses on next reload to recover the easy-mode preference (URL strips the
   * suffix for SEO). Centralizing it here means callers like
   * the FAB and language-picker don't have to remember to set it themselves.
   */
  private persistEasyModeFlag(lang: string): void {
    if (LANGUAGE_RULES.isEasyLocale(lang)) {
      safeStorage.set('easy-language-mode', 'true');
    } else {
      safeStorage.remove('easy-language-mode');
    }
  }

  /**
   * Get saved language
   */
  private getSavedLanguage(): string | null {
    return safeStorage.get('preferred-language-v2');
  }

  /**
   * PUBLIC API: Get current language info
   */
  getCurrentLanguageInfo(): Language | undefined {
    return this.availableLanguages.find((l) => l.code === this.currentLanguageSignal());
  }
}

/** Walk a dotted path; undefined when any segment is missing. */
function lookup(tree: unknown, path: string): unknown {
  let node: unknown = tree;
  for (const segment of path.split('.')) {
    if (node && typeof node === 'object' && segment in node) {
      node = (node as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return node;
}

/** Put `value` at `path` inside `tree`, creating the objects on the way. */
function setPath(tree: TranslationModule, path: string[], value: unknown): void {
  let node = tree as Record<string, unknown>;
  for (const segment of path.slice(0, -1)) {
    const next = node[segment];
    node = (next && typeof next === 'object' ? next : (node[segment] = {})) as Record<string, unknown>;
  }
  node[path[path.length - 1]] = value;
}

function flatten(obj: unknown, prefix: string, result: Record<string, string>): void {
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      flatten(value, newKey, result);
    } else {
      result[newKey] = String(value);
    }
  }
}
