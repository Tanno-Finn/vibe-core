/**
 * i18n-orphans.mjs — which i18n keys nothing references, decided one way for everyone.
 *
 * `scripts/check-i18n-keys.mjs` (the gate: zero orphans) and `tools/make-it-yours.mjs`
 * (the sample removal drops the keys that only the removed samples read) must agree on
 * what an orphan is. If the tool used its own rule, it would either leave keys the gate
 * then rejects or delete keys the app still shows. So the rule lives here, pure: callers
 * read the files and pass `{ path, text }` sources and the leaf keys in.
 *
 * What counts as a reference, and which keys are built at runtime, is spelled out at
 * `findOrphans` below; the gate's --selftest proves it on fixtures.
 */

/**
 * Key prefixes the app completes at runtime (`translate('toast.type.' + type)`,
 * `` translate(`pathResolver.kind.${kind}`) ``), so no literal names the full key.
 * Every key under a listed prefix counts as referenced — but only while the
 * prefix itself still appears as a string literal in the source: a prefix whose
 * builder is gone while keys still start with it is reported as stale, so this
 * list cannot keep dead keys alive. A prefix that matches no key at all (its
 * content was removed, keys and builder together) is only listed as idle.
 * A RegExp entry stands for a family; its matched text is the prefix that must
 * appear. One more family needs no entry: a literal handed to a
 * `translationPrefix` / `translationKeyPrefix` input (flashcard deck, scaling
 * slider, interactive timeline) — those components append their own suffixes.
 */
export const DYNAMIC_PREFIXES = [
  { prefix: 'aiResources.difficulty.', reason: 'catalog cards and header label a resource by its difficulty value' },
  { prefix: 'aiResources.language.', reason: 'catalog resource details label the language value' },
  { prefix: 'aiResources.mediaType.', reason: 'catalog cards and header label a resource by its media type' },
  { prefix: 'aiResources.topic.', reason: 'catalog cards and header label a resource by its topic' },
  { prefix: 'aiTools.categories.', reason: 'catalog presenter labels a tool by its category value' },
  { prefix: /^article[A-Z]\w*\.quiz\./, reason: "each article's quiz builder reads `<ns>.quiz.` + question/option id" },
  { prefix: 'articleSecondBrain.origin.', reason: 'the origin timeline builds `event<n>.<field>` keys in a loop' },
  { prefix: 'categories.', reason: 'content hub cards label an item by its category id' },
  { prefix: 'common.contentType.', reason: 'related-refs labels a reference by its content type' },
  { prefix: 'common.difficulty.', reason: 'related-refs labels a reference by its difficulty' },
  { prefix: 'conceptMap.map.type.', reason: 'the ontology map labels a node by its type' },
  { prefix: 'devWorkshop.guideTabs.', reason: 'the design-guide shell labels a tab by its id' },
  { prefix: 'devWorkshop.guides.category.', reason: 'the dev workshop groups guides by category id' },
  { prefix: 'difficulty.', reason: 'content hub cards label an item by its difficulty' },
  { prefix: 'easyLanguage.content.', reason: 'the Easy-Language FAB reads the preview of the current page id' },
  { prefix: 'exampleDemo.controls.patterns.', reason: 'the example demo labels a pattern by its id' },
  { prefix: 'feedback.category.', reason: 'the feedback page labels a category by its id' },
  { prefix: 'feedback.placeholder.', reason: 'the feedback dialog picks the placeholder of the chosen category' },
  { prefix: 'glossary.categories.', reason: 'the glossary labels an entry by its category value' },
  { prefix: 'learningPaths.difficulty.', reason: 'path cards label a path by its difficulty' },
  { prefix: 'learningPaths.sectors.', reason: 'path overviews title a sector by its id' },
  { prefix: 'learningPaths.stepType.', reason: 'path steps are labelled by their type' },
  { prefix: 'news.filters.', reason: 'the news page labels a filter chip by its type' },
  { prefix: 'optimus.', reason: 'OptimusA11yService hands every key of the namespace to the UI library' },
  { prefix: 'pathResolver.hint.', reason: 'the path resolver explains the resolved kind' },
  { prefix: 'pathResolver.kind.', reason: 'the path resolver names the resolved kind' },
  { prefix: 'pathResolver.target.', reason: 'the path resolver names the target kind' },
  { prefix: 'pathResolver.trace.', reason: 'the path resolver narrates each trace step' },
  { prefix: 'progress.status.', reason: 'the progress page labels an item by its status' },
  { prefix: 'roadmap.languages.languageNames.', reason: 'the roadmap names each language by its code' },
  { prefix: 'roadmap.languages.scripts.', reason: 'the roadmap names each writing system by its id' },
  { prefix: 'roadmap.timeline.difficulty.', reason: 'roadmap drops are labelled by difficulty' },
  { prefix: 'searchTerms.', reason: 'NavigationService reads the search synonyms of each page id' },
  { prefix: 'seo.pages.', reason: 'MetaSeoService reads the meta block of the current page id' },
  { prefix: 'settings.theme.', reason: 'the settings page labels theme options by their id' },
  { prefix: 'sources.chapters.', reason: 'the sources page titles a chapter by its id' },
  { prefix: 'sources.types.', reason: 'sources and the lesson template label a source by its type' },
  { prefix: 'timeline.aiTimeline.categories.', reason: 'the AI timeline labels an event by its category' },
  { prefix: 'toast.type.', reason: 'the toast container labels a toast by its severity' },
];

/**
 * Code samples are text, not calls. The design-guide articles show code to the
 * reader as strings — `'  label: this.i18n.translate(\'doc.menu.rename\'),\n' +`
 * chains, `code: \`<p-dialog [header]="t('title.edit')" …\`` template literals —
 * and quote it in `<code>` / `<pre>` elements of their templates. A key named
 * there is an example for a module the reader will write, so it neither has to
 * resolve here nor keeps a real key alive. `stripCodeSamples` blanks those spans
 * (spaces, newlines kept, so offsets and line numbers stay put) before any scan:
 *
 *   * `.ts`: every string literal ('…', "…", the text parts of `…`) whose text
 *     contains a `translate(` / `t(` call. A real key literal (`titleKey:
 *     'nav.home'`, `` `optimus.${key}` ``) never contains a call, so it stays.
 *     The one exception is a component's `template:` literal — that is the
 *     live template and is treated like an `.html` file.
 *   * `.html` and inline templates: the literal text of a `<code>` or `<pre>`
 *     element that quotes such a call. A binding — outside those elements, or
 *     a `{{ … }}` inside one — is the page rendering, and stays.
 *
 * Other extensions (`.md`, `.json`, …) pass through unchanged.
 */
const SAMPLE_CALL_RE = /(?:\btranslate|(?<![\w$.])t|\.t)\s*\(\s*\\?['"`]/;
const SAMPLE_ELEMENT_RE = /<(code|pre)\b[^>]*>([\s\S]*?)<\/\1>/gi;

function blank(s) {
  return s.replace(/[^\n]/g, ' ');
}

/**
 * Blank the literal text of every `<code>` / `<pre>` element that quotes a call.
 * `{{ … }}` interpolations inside the element are the page rendering (a code
 * example whose text is itself translated: `<pre><code>{{ t('ns.codeExample') }}`)
 * and are kept.
 */
function stripHtmlSamples(html) {
  return html.replace(SAMPLE_ELEMENT_RE, (whole, tag, inner) => {
    const quoted = inner.split(/(\{\{[\s\S]*?\}\})/);
    if (!quoted.some((part, k) => k % 2 === 0 && SAMPLE_CALL_RE.test(part))) return whole;
    const closeAt = whole.length - `</${tag}>`.length;
    const kept = quoted.map((part, k) => (k % 2 === 0 ? blank(part) : part)).join('');
    return whole.slice(0, closeAt - inner.length) + kept + whole.slice(closeAt);
  });
}

/**
 * Blank the code-sample string literals of a TypeScript source (see above).
 * A small lexer: comments, the three quote kinds with `${…}` nesting, and regex
 * literals (so a quote inside `/['"]/` does not open a string). Template-literal
 * text parts are judged together, so a call split around a `${…}` still counts.
 */
function stripTsSamples(src) {
  const out = src.split('');
  const n = src.length;
  let i = 0;
  let lastSig = ''; // last significant code character, for the regex-vs-division call
  const templateStack = []; // one entry per open template literal: { braceDepth }
  let braceDepth = 0;

  const blankRange = (from, to) => {
    for (let k = from; k < to; k++) if (out[k] !== '\n') out[k] = ' ';
  };

  // Scan one template literal starting after its backtick. Returns the index
  // after the closing backtick, or the index of a `${` (pushed on the stack).
  const scanTemplateChunk = (start, parts) => {
    let k = start;
    while (k < n) {
      const c = src[k];
      if (c === '\\') {
        k += 2;
        continue;
      }
      if (c === '`') {
        parts.push([start, k]);
        return { end: k + 1, closed: true };
      }
      if (c === '$' && src[k + 1] === '{') {
        parts.push([start, k]);
        return { end: k + 2, closed: false };
      }
      k++;
    }
    parts.push([start, n]);
    return { end: n, closed: true };
  };

  const finishTemplate = (entry) => {
    const text = entry.parts.map(([a, b]) => src.slice(a, b)).join('');
    if (entry.isComponentTemplate) {
      for (const [a, b] of entry.parts) {
        const stripped = stripHtmlSamples(src.slice(a, b));
        for (let k = 0; k < stripped.length; k++) out[a + k] = stripped[k];
      }
    } else if (SAMPLE_CALL_RE.test(text)) {
      for (const [a, b] of entry.parts) blankRange(a, b);
    }
  };

  const openTemplate = (backtickAt) => {
    const before = src.slice(Math.max(0, backtickAt - 40), backtickAt);
    const entry = { parts: [], isComponentTemplate: /\btemplate\s*:\s*$/.test(before), braceDepth };
    const r = scanTemplateChunk(backtickAt + 1, entry.parts);
    if (r.closed) finishTemplate(entry);
    else templateStack.push(entry);
    return r.end;
  };

  while (i < n) {
    const c = src[i];
    const next = src[i + 1];
    if (c === '/' && next === '/') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && next === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? n : end + 2;
      continue;
    }
    if (c === "'" || c === '"') {
      let k = i + 1;
      while (k < n && src[k] !== c && src[k] !== '\n') k += src[k] === '\\' ? 2 : 1;
      if (SAMPLE_CALL_RE.test(src.slice(i + 1, k))) blankRange(i + 1, k);
      i = k + 1;
      lastSig = c;
      continue;
    }
    if (c === '`') {
      i = openTemplate(i);
      lastSig = '`';
      continue;
    }
    if (c === '/' && (lastSig === '' || '(,=:[!&|?{};+-*%<>~^'.includes(lastSig))) {
      // regex literal
      let k = i + 1;
      let inClass = false;
      while (k < n && src[k] !== '\n') {
        if (src[k] === '\\') {
          k += 2;
          continue;
        }
        if (src[k] === '/' && !inClass) break;
        if (src[k] === '[') inClass = true;
        else if (src[k] === ']') inClass = false;
        k++;
      }
      i = k + 1;
      lastSig = '/';
      continue;
    }
    if (c === '{') braceDepth++;
    if (c === '}') {
      const top = templateStack[templateStack.length - 1];
      if (top && braceDepth === top.braceDepth) {
        // end of a `${…}` expression: continue the template literal
        const r = scanTemplateChunk(i + 1, top.parts);
        if (r.closed) finishTemplate(templateStack.pop());
        i = r.end;
        lastSig = '`';
        continue;
      }
      braceDepth--;
    }
    if (!/\s/.test(c)) lastSig = c;
    i++;
  }
  return out.join('');
}

/** The text a key scan may read: code samples blanked by file type. */
export function stripCodeSamples(path, text) {
  if (/\.ts$/.test(path)) return stripTsSamples(text);
  if (/\.html$/.test(path)) return stripHtmlSamples(text);
  return text;
}

/** `translationPrefix: 'ns.x'` / `translationKeyPrefix: 'ns.x'` — the component appends the rest. */
export const PREFIX_INPUT_RE = /\b\w*[Pp]refix\s*:\s*\\?['"`]([A-Za-z][\w-]*(?:\.[\w-]+)+)\\?['"`]/g;
/** Every dotted, key-shaped token in a text; a key is referenced when one of them equals it. */
export const KEY_TOKEN_RE = /[A-Za-z_][\w-]*(?:\.[\w-]+)+/g;

/** File extensions under src/ that may reference a key (the orphan scan's sources). */
export const ORPHAN_SOURCE_EXTS = ['.ts', '.html', '.md', '.json', '.mjs', '.js'];

/**
 * Is the file (path relative to the project, forward slashes) an orphan-scan source?
 * Not the i18n modules and bundles themselves, not the git-ignored build outputs
 * (content bundles, compiled glossary) — those only copy what their committed inputs
 * say, and whether they exist must not change the verdict — and not
 * `src/config/samples.json`: it lists sample keys so the make-it-yours tool can remove
 * them, which is no reader. Specs are dropped inside findOrphans.
 */
export function isOrphanSource(rel) {
  if (!rel.startsWith('src/')) return false;
  if (!ORPHAN_SOURCE_EXTS.some((e) => rel.endsWith(e))) return false;
  if (rel.startsWith('src/assets/i18n/')) return false;
  if (/^src\/assets\/data\/(content\.[^/]+|core\/glossary\/compiled-glossary\.[^/]+)\.json$/.test(rel)) return false;
  return rel !== 'src/config/samples.json';
}

/**
 * Every leaf key path of one locale's modules (`{ <namespace>: <parsed json> }`) — an
 * array value is one leaf, as in the gate's parity check.
 */
export function leafKeys(bundle, out = new Set()) {
  const walk = (node, prefix) => {
    for (const [k, v] of Object.entries(node)) {
      const full = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, full);
      else out.add(full);
    }
  };
  walk(bundle, '');
  return out;
}

/**
 * The orphan rule, pure so the selftest can run it on fixtures.
 *
 * `keys` is every leaf key; `sources` is `[{ path, text }]` of the files that may
 * reference one. A key is referenced when
 *   1. a source contains it as a whole dotted token — a literal in a component,
 *      a template, a route's titleKey, a data or config JSON, a guide doc; or
 *   2. it starts with a DYNAMIC_PREFIXES entry whose prefix text appears in a
 *      source right after a quote or backtick; or
 *   3. it starts with a literal handed to a `*Prefix:` input.
 * Test files are not sources: a key only a spec names is still dead in the app.
 * Returns the orphans (sorted), the stale dynamic prefixes — ones that still
 * match keys although no source builds a key from them any more — and the idle
 * ones, which match no key at all. An idle entry keeps nothing alive, so it is
 * reported but never an error: removing content (the sample articles, say)
 * takes the keys and the builder with it and must not turn the gate red.
 */
export function findOrphans(keys, sources, dynamicPrefixes = DYNAMIC_PREFIXES) {
  const live = sources.filter((s) => !/\.spec\.ts$/.test(s.path));
  const tokens = new Set();
  const inputPrefixes = new Set();
  for (const { text } of live) {
    for (const m of text.matchAll(KEY_TOKEN_RE)) tokens.add(m[0]);
    for (const m of text.matchAll(PREFIX_INPUT_RE)) inputPrefixes.add(`${m[1]}.`);
  }
  const corpus = live.map((s) => s.text).join('\n');
  const builtHere = new Map(); // concrete prefix -> does a source build it?
  const isBuilt = (prefix) => {
    if (!builtHere.has(prefix)) {
      const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      builtHere.set(prefix, new RegExp(`['"\`]${esc}`).test(corpus));
    }
    return builtHere.get(prefix);
  };
  const usedEntries = new Set();
  const orphans = [];
  for (const key of keys) {
    if (tokens.has(key)) continue;
    let covered = false;
    for (const entry of dynamicPrefixes) {
      const concrete =
        typeof entry.prefix === 'string' ? key.startsWith(entry.prefix) && entry.prefix : key.match(entry.prefix)?.[0];
      if (concrete && isBuilt(concrete)) {
        usedEntries.add(entry);
        covered = true;
        break;
      }
    }
    if (covered) continue;
    if ([...inputPrefixes].some((p) => key.startsWith(p))) continue;
    orphans.push(key);
  }
  const matchesAnyKey = (e) =>
    keys.some((k) => (typeof e.prefix === 'string' ? k.startsWith(e.prefix) : e.prefix.test(k)));
  const idleEntries = new Set(dynamicPrefixes.filter((e) => !matchesAnyKey(e)));
  const stale = dynamicPrefixes
    .filter((e) => !idleEntries.has(e))
    .filter((e) => (typeof e.prefix === 'string' ? !isBuilt(e.prefix) : !usedEntries.has(e)))
    .map((e) => String(e.prefix));
  const idle = [...idleEntries].map((e) => String(e.prefix));
  return { orphans: orphans.sort(), stale, idle };
}
