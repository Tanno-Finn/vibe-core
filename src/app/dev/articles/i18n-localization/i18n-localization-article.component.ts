import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { TranslationService } from '../../../services/translation.service';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
    :host { display: block; }
    .lead { font-size: 1.05rem; color: var(--text-color-secondary); margin: 0 0 var(--space-5); }

    /* --- Live probe --- */
    .probe {
      display: flex; flex-direction: column; gap: var(--space-2);
      margin: 0 0 var(--space-4); padding: var(--space-4);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
    }
    .probe__head { display: flex; align-items: baseline; gap: var(--space-3); flex-wrap: wrap; margin-bottom: var(--space-2); }
    .probe__label { font-size: var(--font-size-sm); color: var(--text-color-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
    .probe__lang { font-family: var(--font-mono); font-size: var(--font-size-lg); color: var(--primary-color-fg); }
    .probe__row {
      display: flex; align-items: baseline; gap: var(--space-4); flex-wrap: wrap;
      padding: var(--space-2) var(--space-3);
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
    }
    .probe__row code { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-color-secondary); flex: 0 0 12rem; min-width: 0; }
    .probe__val { min-width: 0; overflow-wrap: anywhere; }

    /* --- Missing-key box --- */
    .miss {
      display: flex; align-items: baseline; gap: var(--space-4); flex-wrap: wrap;
      margin: 0 0 var(--space-4); padding: var(--space-4);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-left: 3px solid var(--semantic-red-fg, #b91c1c);
      border-radius: var(--radius-md);
    }
    .miss__what { font-size: var(--font-size-sm); color: var(--text-color-secondary); text-transform: uppercase; letter-spacing: 0.04em; }
    .miss__out { font-family: var(--font-mono); overflow-wrap: anywhere; }

    /* --- Do / Don't --- */
    .dd { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin: 0 0 var(--space-4); }
    .dd__cell { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: var(--surface-card); }
    .dd__cell--bad { border-left: 3px solid var(--semantic-red-fg, #b91c1c); }
    .dd__cell--good { border-left: 3px solid var(--semantic-green-fg, #15803d); }
    .dd__stage { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-4); border-radius: var(--radius-md); background: var(--surface-section); min-height: 3.5rem; }
    .dd__why { margin: 0; font-size: var(--font-size-sm); color: var(--text-color-secondary); }
    .dd__code { font-family: var(--font-mono); font-size: 0.8rem; overflow-wrap: anywhere; min-width: 0; }
    .tag { align-self: flex-start; font-size: 0.72rem; font-weight: var(--font-weight-medium); letter-spacing: 0.02em; text-transform: uppercase; padding: 0.15em 0.55em; border-radius: 999px; }
    .tag--bad { background: color-mix(in srgb, var(--semantic-red-fg, #b91c1c) 14%, transparent); color: var(--semantic-red-fg, #b91c1c); }
    .tag--good { background: color-mix(in srgb, var(--semantic-green-fg, #15803d) 16%, transparent); color: var(--semantic-green-fg, #15803d); }
    @media (max-width: 640px) { .dd { grid-template-columns: 1fr; } }

    .checklist { list-style: none; padding-left: 0; }
    .checklist li { margin: 0.3rem 0; }

    .code-block {
      margin: 0 0 var(--space-4);
      padding: var(--space-4);
      overflow-x: auto;
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      font-family: var(--font-mono);
      font-size: 0.82rem;
      line-height: 1.55;
      color: var(--text-color);
    }
    .table-wrap { overflow-x: auto; margin: 0 0 1rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { border: 1px solid var(--surface-border); padding: 0.4rem 0.6rem; text-align: left; vertical-align: top; }
    th { color: var(--text-color-secondary); font-weight: var(--font-weight-medium); }
    .history strong { color: var(--primary-color-fg); }
  `;

/**
 * Guide article: I18n & Localization (foundations).
 *
 * CLAIMS THE REFERENCE TABLES REST ON — every number counted for this guide
 * over the tracked module files and the tracked sources, none inherited:
 *   - Language set: src/config/languages.json declares two language objects
 *     (de, en), each with an easyCode — four variants total — and three named
 *     languages: defaultLanguage "de", keySourceLanguage "en",
 *     contentReferenceLanguage "de". translation.service.ts derives its picker
 *     list and its data slots from that file (src/config/languages.ts).
 *   - Modules: all four variants carry the same 69 namespaces and the same
 *     3854 leaf keys — 0 missing and 0 extra in any direction.
 *   - Namespace derivation: build-i18n-bundles.ts uses the filename stem
 *     verbatim (file.replace('.json','')), no case or kebab transformation —
 *     hence devWorkshop.* from devWorkshop.json and common.* from common.json
 *     in the same directory. A kebab-cased filename would keep its hyphen.
 *   - Loading: build-i18n-bundles.ts splits each language into a core bundle
 *     (i18n.<lang>.json) and lazy chunks (i18n/chunks/<lang>/<id>.json) as
 *     src/config/i18n-bundles.json decides. translation-loader.service.ts
 *     fetches the core (twice, then the key-source core, then {}), chunks on
 *     demand (twice, then the fallback chain takes over).
 *   - Fallback chain, i18nFallbackChain() in src/config/language-rules.mts:
 *     de-easy -> de, en; en-easy -> en; de -> en; en -> nothing, so a key
 *     missing from the English modules returns the key itself.
 *     translateValue() consults NO fallback — it returns null on a miss.
 *   - Interpolation: translate() returns the stored string unchanged; the only
 *     substitution in the kit is String.replace at the call site, and the
 *     corpus carries both shapes — 33 occurrences of {name} and 34 of
 *     {{name}} across the de modules. No Intl.PluralRules occurs anywhere
 *     under src/ (it appears only as advice in directives/languages/).
 *   - Gates: check-i18n-keys.mjs and the gap report in build-i18n-bundles.ts
 *     both read keySourceLanguage ('en') from languages.json. The gate fails on
 *     an unresolved literal key, a parity gap, an empty value, and more
 *     unreferenced keys than ORPHAN_BASELINE, now 0 (runtime-built keys are covered by
 *     the DYNAMIC_PREFIXES list, each entry with its reason). It skips any
 *     literal whose first segment is not a filename in modules/en, so a
 *     misspelled namespace is not checked at all. check-house-style.mjs holds
 *     the mechanical half of the German and English house style.
 *   - Formatting and search: src/app/utils/date-locale.ts (dateLocaleFor,
 *     numberLocaleFor, formatNumberFor) maps a portal language to en-US/de-DE;
 *     src/app/utils/search-fold.ts (foldForSearch) drops compound joiners.
 *   - Optimus UI: app.config.ts passes provideOptimus no `translation` block;
 *     optimus-a11y.service.ts pushes 11 aria keys from the optimus namespace
 *     via setTranslation, run by the app shell inside an effect.
 *     en/optimus.json holds exactly those 11 keys.
 *   - Text expansion: en and de share 3826 string keys, none empty —
 *     375,359 vs 406,899 characters (1.08x), de longer in 2661 of 3826 strings
 *     (69.6%). Per-string ratio over the 3279 strings of >= 10 characters:
 *     median 1.08, p75 1.16, p90 1.28, p95 1.40, max 2.31. The easy variants are
 *     SHORTER over shared keys: de-easy 0.72x of de, en-easy 0.71x of en.
 *   - Longest unbroken run, whitespace-split, HTML tags removed: the longest
 *     plain WORD is 25 characters in de (Behandlungsentscheidungen) against 20
 *     in en; the longest TOKEN is a parenthesized file-path citation of 61
 *     characters in both, and the longest URL 53 characters in de against 51
 *     in en. The layout budget in the Design tab is stated on the token, since
 *     a browser breaks neither without an explicit wrapping rule.
 *   - The picker's maturity marker is the literal text Beta inside the option
 *     button in language-picker.component.ts; language names (nativeName,
 *     easyNativeName) come from src/config/languages.json, mapped by
 *     translation.service.ts, not from a module.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-i18n-localization-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'i18n-localization'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Four language variants, one lookup, and a fallback chain that decides what a reader
          sees when a key is missing. Everything below resolves through the same service the
          rest of the app uses, so switching the language in the header changes it live.
        </p>

        <h3>What the current language resolves to</h3>
        <p>
          Four ordinary chrome keys, read right now. The code beside the heading is the
          active variant; switch it and every value below moves, because each one sits in a
          <code>computed()</code> that depends on the service's language and version signals.
        </p>
        <div class="probe">
          <div class="probe__head">
            <span class="probe__label">active variant</span>
            <code class="probe__lang">{{ currentLang() }}</code>
          </div>
          @for (row of probe(); track row.key) {
            <div class="probe__row">
              <code>{{ row.key }}</code>
              <span class="probe__val">{{ row.value }}</span>
            </div>
          }
        </div>
        <p class="src-note">
          Resolved through <code>src/app/services/translation.service.ts</code> at render time;
          the keys live in the <code>common.json</code> module of each language directory.
        </p>

        <h3>The same four keys in all four variants</h3>
        <p>
          The simplified variants are not a filter applied to the base language — they are
          separate files whose wording is decided per language. The last two rows show it: for
          <code>common.close</code> the German variant drops <em>Schließen</em> for the plainer
          <em>Zumachen</em> while the English one stays at <em>Close</em>, and
          <code>common.search</code> is unchanged in both variants. That is the point —
          simplifying is a judgment each language's translator makes on its own wording, so a
          key can move in one variant and stand still in the other.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Key</th><th><code>en</code></th><th><code>de</code></th><th><code>en-easy</code></th><th><code>de-easy</code></th></tr>
            </thead>
            <tbody>
              <tr><td><code>common.loading</code></td><td>Loading content</td><td>Inhalte werden geladen</td><td>The content is loading.</td><td>Die Inhalte werden geladen.</td></tr>
              <tr><td><code>common.cancel</code></td><td>Cancel</td><td>Abbrechen</td><td>Stop</td><td>Stoppen</td></tr>
              <tr><td><code>common.close</code></td><td>Close</td><td>Schließen</td><td>Close</td><td>Zumachen</td></tr>
              <tr><td><code>common.search</code></td><td>Search...</td><td>Suchen...</td><td>Search...</td><td>Suchen...</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values read from the four <code>common.json</code> files under
          <code>src/assets/i18n/modules/</code>.
        </p>

        <h3>A key that resolves nowhere renders as itself</h3>
        <p>
          There is no placeholder, no empty string, and no error. The lookup walks the current
          language, then its fallback chain, and when nothing matches it returns the key —
          which is what a reader sees, and what a screen reader announces. The box below asks
          for a key no module declares:
        </p>
        <div class="miss">
          <span class="miss__what">rendered output</span>
          <span class="miss__out">{{ missingProbe() }}</span>
        </div>
        <p class="src-note">
          Behavior read from the final <code>return key</code> of the fallback lookup in
          <code>src/app/services/translation.service.ts</code>; the probe asks for a key whose
          first segment is not a module name, so it is invisible to
          <code>scripts/check-i18n-keys.mjs</code> as well — which is the pitfall, not an
          accident of this demo.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Two decisions cover almost every string: what to call the key, and where to hold the
          resolved value. Get the second one wrong and the text is correct exactly once — at
          the moment the component was constructed.
        </p>

        <h3>The shape of a key</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Segment</th><th>Comes from</th><th>Example</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>namespace</td>
                <td>the module filename stem, used verbatim — no case change, no kebab conversion</td>
                <td><code>devWorkshop</code>, <code>common</code>, <code>aiTimeline</code></td>
              </tr>
              <tr>
                <td>path</td>
                <td>the nested object keys inside that file, any depth</td>
                <td><code>guides.relatedTitle</code></td>
              </tr>
              <tr>
                <td>leaf</td>
                <td>a string; an object at the end of the path counts as a miss</td>
                <td><code>devWorkshop.guides.relatedTitle</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Derivation read from the bundle build in <code>scripts/build-i18n-bundles.ts</code>,
          which keys each module by its filename with the extension stripped; the leaf rule from
          the lookup in <code>src/app/services/translation.service.ts</code>, which returns
          <code>null</code> unless the resolved value is a string.
        </p>

        <h3>The label pattern</h3>
        <p>
          The kit's convention is a single <code>computed()</code> holding every string a
          template needs, resolved through the service. It is not decoration: the lookup reads a
          version signal that increments when a bundle finishes loading, so a
          <code>computed()</code> re-resolves on a language switch <em>and</em> when the
          translations arrive — which are two different moments, and the second one is the
          one that bites. <code>src/app/dev/articles/article-shell.component.ts</code> is the
          reference implementation.
        </p>
        <pre class="code-block"><code>{{ labelPatternSnippet }}</code></pre>

        <h3>Placeholders are substituted by you</h3>
        <p>
          The lookup returns the stored string unchanged. Interpolation is a
          <code>String.replace</code> at the call site, and the corpus carries two shapes —
          single braces and double braces — so match whichever the neighboring keys in your
          namespace already use rather than introducing a third. There is no plural machinery:
          a count that changes the sentence needs a key per form and a branch you write.
        </p>
        <pre class="code-block"><code>{{ placeholderSnippet }}</code></pre>

        <h3>Searching translated text</h3>
        <p>
          The same compound is spelled three ways across the variants: closed or hyphenated in
          German and English (<em>Code-Review</em>), and with a Mediopunkt in simplified German
          (<em>Code·review</em>), which the house style reserves for the joints of long compound
          nouns. A reader types whichever form they know, so the kit's searches — glossary,
          catalog, navigation, sitemap, timeline, news — compare folded strings — lower-cased, the middle dot and the hyphen family dropped —
          on both sides of the comparison.
        </p>
        <pre class="code-block"><code>{{ searchSnippet }}</code></pre>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — resolve once into a field</span>
            <div class="dd__stage">
              <code class="dd__code">readonly title = this.i18n.translate('widget.title');</code>
            </div>
            <p class="dd__why">
              A field initializer runs when the component is constructed. If the bundle has not
              landed the value freezes as the raw key, and it never moves again when the reader
              switches language.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — hold it in a computed</span>
            <div class="dd__stage">
              <code class="dd__code">readonly title = computed(() =&gt; this.i18n.translate('widget.title'));</code>
            </div>
            <p class="dd__why">
              The lookup reads the service's language and version signals, so the computed
              re-resolves both when the bundle arrives and on every later switch.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — build a sentence from fragments</span>
            <div class="dd__stage">
              <code class="dd__code">t('a.deleted') + ' ' + n + ' ' + t('a.items')</code>
            </div>
            <p class="dd__why">
              The word order, the case of the noun, and the position of the number are all
              language-specific. A translator handed two halves cannot fix any of them, and the
              German half will need a different case than the English one implies.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — one key, one placeholder</span>
            <div class="dd__stage">
              <code class="dd__code">t('a.deleted').replace('&#123;n&#125;', String(n))</code>
            </div>
            <p class="dd__why">
              The whole sentence stays in the module file, so a translator can move the number
              anywhere the target language wants it.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — format with the portal language</span>
            <div class="dd__stage">
              <code class="dd__code">d.toLocaleDateString(this.i18n.currentLanguage)</code>
            </div>
            <p class="dd__why">
              A simplified variant is not a locale: no ISO registry has a tag for it. The suffix
              survives here only because <code>easy</code> happens to parse as a script subtag,
              and a regional code plus that suffix throws a <code>RangeError</code> outright. A
              bare <code>toLocaleDateString()</code> is worse still: it formats in the browser's
              locale, not the page's, and differs between prerender and browser.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ask the locale helper</span>
            <div class="dd__stage">
              <code class="dd__code">d.toLocaleDateString(dateLocaleFor(this.i18n.currentIntlLocale))</code>
            </div>
            <p class="dd__why">
              The helper strips the suffix and adds the house region — <code>en-US</code> gives
              <em>July 15, 2026</em>, <code>de-DE</code> <em>15. Juli 2026</em> — so the order never
              hangs on the engine's default for a bare <code>en</code>. Numbers take
              <code>numberLocaleFor()</code> or <code>formatNumberFor()</code> from the same file.
            </p>
          </div>
        </div>

        <h3>Sources for this tab</h3>
        <p class="src-note">
          The label pattern is the convention of
          <code>src/app/dev/articles/article-shell.component.ts</code>; the version-signal
          reason and the <code>currentIntlLocale</code> caveat are stated in
          <code>src/app/services/translation.service.ts</code>, whose own comment names the
          <code>RangeError</code>. The house regions are the table in
          <code>src/app/utils/date-locale.ts</code>, the fold is
          <code>src/app/utils/search-fold.ts</code>. The two placeholder shapes were counted over
          the German module directory.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          One directory per language, one file per namespace, a small core bundle plus lazy
          chunks per language at build time. The interesting part is not the pipeline — it is
          which language answers when the one you asked for cannot.
        </p>

        <h3>Where a string lives</h3>
        <p>
          Authoring happens in <code>src/assets/i18n/modules/</code>, one directory per language
          code and one JSON file per namespace inside it. The build folds the shell namespaces
          of a language into one core bundle and writes every page-sized namespace (listed in
          <code>src/config/i18n-bundles.json</code>) as a chunk of its own. The core loads before
          the first route; a route's own namespaces load in <code>translationReadyGuard</code>,
          and any other chunk the first time one of its keys is looked up. The built files are
          generated, not tracked.
        </p>
        <p class="src-note">
          Bundle assembly from <code>scripts/build-i18n-bundles.ts</code>; the core request and
          its retry-then-English-then-empty ladder from
          <code>src/app/services/translation-loader.service.ts</code>.
        </p>

        <h3>The fallback chain</h3>
        <p>
          Every miss walks the reader's chain in order and returns the first hit. English is the
          last link of all four, and English itself has no link after it — which is why the
          English bundle is the floor of the whole system rather than one language among four.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Reader's variant</th><th>Chain after a miss</th><th>Missing everywhere</th></tr>
            </thead>
            <tbody>
              <tr><td><code>en</code></td><td>— none —</td><td>renders the key</td></tr>
              <tr><td><code>de</code></td><td><code>en</code></td><td>renders the key</td></tr>
              <tr><td><code>en-easy</code></td><td><code>en</code></td><td>renders the key</td></tr>
              <tr><td><code>de-easy</code></td><td><code>de</code>, then <code>en</code></td><td>renders the key</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Chains read off the fallback lookup in
          <code>src/app/services/translation.service.ts</code>; the same file's
          <code>translateValue()</code> consults none of them and returns <code>null</code>
          instead.
        </p>

        <h3>The variants are languages, not overlays</h3>
        <p>
          A simplified variant has its own directory, its own namespace files, and its own key
          set, and its wording is decided on its own. What it may not do is drift in coverage:
          the raw-key gate fails the build on any key English has and a variant lacks, so the
          fallback chain is a safety net for a key in flight, not a license to skip
          translating. Keys only a simplified variant carries are counted rather than failed;
          none exist today.
        </p>
        <p class="src-note">
          Namespace and key sets counted over the four directories under
          <code>src/assets/i18n/modules/</code>: all four carry the same 69 namespaces and the
          same 3,854 leaf keys. The parity rule is in <code>scripts/check-i18n-keys.mjs</code>.
        </p>

        <h3>Text expansion, measured</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Measure</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>String keys English and German share</td><td>3,826</td></tr>
              <tr><td>Total characters, German ÷ English</td><td>1.08×</td></tr>
              <tr><td>Strings where German is the longer one</td><td>69.6 % (2,661 of 3,826)</td></tr>
              <tr><td>Per-string ratio, median / p90 / p95 / max</td><td>1.08× / 1.28× / 1.40× / 2.31×</td></tr>
              <tr><td>Longest unbroken word</td><td>25 characters German, 20 English</td></tr>
              <tr><td>Longest URL</td><td>53 characters German, 51 English</td></tr>
              <tr><td>Longest unbroken token — a file-path citation</td><td>61 characters in both</td></tr>
              <tr><td>Simplified variant ÷ its base</td><td>0.72× German, 0.71× English</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Counted over every key both directories declare as a string (none is empty). The
          per-string quantiles run over the 3,279 of those whose English value is at least ten
          characters. Words and tokens are whitespace-split with HTML tags removed; a word is a
          run of letters, so identifiers quoted in code spans do not count. The simplified row
          compares the same keys, so it measures wording rather than coverage.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          The translation layer has <strong>no intrinsic responsive behavior</strong>: it
          measures nothing, reflows nothing, and truncates nothing. A string is delivered at
          whatever length the translator wrote it, at every viewport — what changes with the
          viewport is only whether that length still fits. The numbers above are the budget:
          plan on roughly 1.4× the English width for a label that must not wrap. For the
          horizontal worst case the unit is the longest unbroken <em>token</em>, not the longest
          word — a 360 px column has to survive a 61-character file-path citation and a
          53-character license URL, well past the 25-character longest German word, and neither
          is broken at a slash unless the container says <code>overflow-wrap: anywhere</code>. Layout guidance: give
          every container that renders a translated string a wrapping rule and a
          <code>min-width: 0</code> flex parent, size controls from their content instead of
          pinning a width to the English text, and let a long word break rather than pushing the
          page sideways.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Adding a string, a namespace, or a language are three different sizes of change. Only
          the last one touches configuration, and only the first one is fully covered by a gate.
        </p>

        <h3>Adding a key or a namespace</h3>
        <pre class="code-block"><code>{{ addKeySnippet }}</code></pre>
        <p class="src-note">
          The failing gate (<code>scripts/check-i18n-keys.mjs</code>) and the bundle build's gap
          report both measure against <code>keySourceLanguage</code> in
          <code>src/config/languages.json</code> — English. The German
          <code>contentReferenceLanguage</code> is a different idea: the last resort of the
          content bundles, not of UI strings.
        </p>

        <h3>Adding a language</h3>
        <pre class="code-block"><code>{{ addLanguageSnippet }}</code></pre>
        <p class="src-note">
          Config shape from <code>src/config/languages.json</code>; the rules that derive the
          picker list, URL prefixes, SEO languages, and both fallback chains from it live in
          <code>src/config/language-rules.mts</code>, which the app and the build scripts share.
        </p>

        <h3>Handing Optimus UI its own strings</h3>
        <p>
          The library reads its screen-reader vocabulary from its own config, not from your
          modules. The shell bridges the two by running the accessibility service's sync method
          inside an <code>effect()</code> — an effect rather than a one-shot call, because the
          first pass would otherwise run before the bundle arrived and hand the library a raw
          key. The service spreads the current <code>aria</code> block before writing its
          overrides, and states why beside the call: it treats the merge as replacing that block
          wholesale, so a key left out of the spread does not survive.
          Which of the library's names are worth overriding at all is a naming question and
          belongs to <strong>Accessibility Guidelines</strong>; what stays here is the hand-off.
        </p>
        <pre class="code-block"><code>{{ primeNgSnippet }}</code></pre>
        <p class="src-note">
          The effect is in <code>src/app/app.component.ts</code>; the spread and the comment that
          gives the merge depth are in <code>src/app/services/optimus-a11y.service.ts</code> — the
          depth is this kit's own statement about
          the library, and the spread is how the kit acts on it, not a reading of the library's
          source. The keys themselves are the <code>optimus.json</code> module of each language;
          <code>src/app/app.config.ts</code> passes the library no <code>translation</code>
          block.
        </p>

        <h3>What the gates enforce, and what they cannot see</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Check</th><th>Fails the build when</th><th>Blind to</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>scripts/check-i18n-keys.mjs</code></td>
                <td>
                  a literal key whose first segment names an English module does not resolve in
                  that module; a variant lacks a key English has; a value is empty; or more keys
                  are unreferenced than <code>ORPHAN_BASELINE</code> allows &mdash; zero, so any key
                  nothing reads fails. A key built at
                  runtime counts as referenced only under a <code>DYNAMIC_PREFIXES</code> entry
                  (prefix plus reason), and an entry no source builds any more fails as stale
                </td>
                <td>a misspelled namespace segment (skipped, not failed), whether a runtime-built key resolves, and keys only a simplified variant carries (counted, not failed)</td>
              </tr>
              <tr>
                <td><code>scripts/check-house-style.mjs</code></td>
                <td>
                  German or simplified German uses <code>Sie</code>-address outside the imprint,
                  a gender star, colon, or pair form instead of the generic masculine,
                  <code>»…«</code> or a mismatched quote pair instead of „…“; standard German
                  uses a Mediopunkt, or simplified German puts one on a short compound, outside a
                  noun, or spells one compound two ways; English uses a British spelling from
                  its list or a day-month-year date
                </td>
                <td>the serial comma, straight quotes in German prose, a sentence-initial formal <code>Sie</code>, and a long compound that is never split anywhere</td>
              </tr>
              <tr>
                <td><code>scripts/check-genericity.mjs</code></td>
                <td>a translation <em>value</em> in any language matches the branding denylist (generic markers, plus a workspace list of the names a derived project must not carry)</td>
                <td>branding in key names, and any phrasing not on the list</td>
              </tr>
              <tr>
                <td><code>scripts/check-language-guide.mjs</code></td>
                <td>a per-language translation guide breaks one of its nine mechanical rules</td>
                <td>whether a quoted rule is faithful to the source it cites</td>
              </tr>
              <tr>
                <td><code>scripts/build-i18n-bundles.ts</code> with <code>--prod</code></td>
                <td>a language directory named in the config does not exist</td>
                <td>a namespace missing inside a directory — the gap report prints and the build continues</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off the scripts named in the first column (each one's header lists its rules and
          its blind spots) and the <code>build:verify</code> chain in <code>package.json</code>,
          which runs every check but the bundle build. The house style itself is written out in
          <code>directives/languages/de.md</code> and <code>directives/languages/en.md</code>.
        </p>

        <h3>Before you call it translated</h3>
        <ul class="checklist">
          <li>The key exists in the English module — the gate's reference and the end of every chain.</li>
          <li>The same key exists in the other three variants, or you accepted the fallback wording deliberately.</li>
          <li>Every visible string is read through the service; no literal survives in a reader-facing template.</li>
          <li>Labels sit in a <code>computed()</code>, not in a field resolved at construction.</li>
          <li>Dates and numbers go through <code>src/app/utils/date-locale.ts</code>, never a bare <code>toLocaleString()</code> or a hard-coded locale.</li>
          <li>A key built at runtime has its prefix in <code>DYNAMIC_PREFIXES</code>; a key nothing reads any more is deleted in all four variants.</li>
          <li>A search over translated text folds both sides with <code>foldForSearch()</code>.</li>
          <li>Ids, route segments, form <code>name</code> attributes and option values stayed untranslated.</li>
          <li>The longest translation still fits the control at 360 px, or the control wraps.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          The machinery that translates the app has strings of its own, and two of the labels it
          shows are deliberately not among them.
        </p>

        <h3>Who names a language</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Label</th><th>Where it comes from</th><th>Translated?</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>The language's own name in the list</td>
                <td><code>nativeName</code> / <code>easyNativeName</code> in <code>src/config/languages.json</code></td>
                <td>no — an endonym, written once in that language, and marked with its own <code>lang</code></td>
              </tr>
              <tr>
                <td>The simplified-language toggle beside the list</td>
                <td>the <code>settings.json</code> module of each language</td>
                <td>yes, in all four variants</td>
              </tr>
              <tr>
                <td>The maturity marker on a non-final language</td>
                <td>a literal in <code>src/app/components/shared/language-picker.component.ts</code></td>
                <td>no — hard-coded English text inside the option, so it joins the option's accessible name</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Sources as named in the middle column; maturity itself is derived, not authored — it
          is the <code>seoEnabled</code> flag of <code>src/config/seo-languages.config.ts</code>
          read through its beta helper, with an easy suffix stripped so a variant inherits its
          base language's status.
        </p>

        <h3>Endonyms are a rule, not an omission</h3>
        <p>
          A language list translated into the current language is unusable by the reader who
          needs it: someone stranded in a language they cannot read looks for the word they do
          know. Keeping the names in the list means they never move, and it is why they are
          config values rather than keys. Add a language and you write its endonym once, in its
          own script, and never again; the picker wraps it in its own <code>lang</code> so a
          screen reader pronounces it in that language.
        </p>

        <h3>The marker no shipped language triggers</h3>
        <p>
          Both shipped languages are final, so the maturity marker renders for neither of them.
          It becomes a visible untranslated word in any project that enables a language that is
          not — so a project that adds one gives that marker a key, which is the rule
          <strong>Accessibility Guidelines</strong> states for every name a reader hears.
        </p>

        <h3>What this layer does not decide</h3>
        <p>
          The document language attribute is authored once in <code>src/index.html</code>, and
          past that it has exactly one writer at runtime — which is not this service.
          <strong>Accessibility Guidelines</strong> owns that rule, including why the simplified
          suffix is stripped before the tag is written. Writing direction is the same guide's
          boundary: no direction is set anywhere, and adding a right-to-left language is a
          layout project, not a translation one. Which scripts the font stack can actually
          render is <strong>Typography</strong>'s subject, and it is worth reading before adding
          a language whose script is not Latin.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.5</strong> — 2026-09-23 — The gates as they now stand: the raw-key gate
            also fails on empty values and on unreferenced keys past its baseline, with runtime-built
            prefixes declared in <code>DYNAMIC_PREFIXES</code>; the house-style gate joins the table.
            Dates and numbers go through <code>src/app/utils/date-locale.ts</code>, searches fold
            compound joiners (<code>src/app/utils/search-fold.ts</code>). Key counts, parity, and
            text expansion recounted over the current modules; the ARIA hand-off points at
            <code>optimus-a11y.service.ts</code>; endonyms come from the language config.</li>
          <li><strong>v0.4</strong> — 2026-09-22 — The bundle is split: a core per language
            plus lazy chunks (<code>src/config/i18n-bundles.json</code>), loaded by the route guard
            or on first lookup. Languages, the three named languages, and both fallback chains come
            from <code>src/config/languages.json</code> through
            <code>src/config/language-rules.mts</code>; the gate and the gap report share the
            English key source and the gate checks parity. <code>languageChanged</code> is a
            signal-derived view now, not a Subject.</li>
          <li><strong>v0.3</strong> — 2026-08-24 — Re-verified on PrimeNG 22.1:
            <code>setTranslation</code> still merges one level deep
            (<code>openng-optimus-ui-config.mjs:246-249</code>), so the spread of the <code>aria</code>
            block stays required; the 11 pushed keys and the absence of a
            <code>translation</code> block in <code>provideOptimus</code> are unchanged.
            Provenance pin raised.</li>
          <li><strong>v0.2</strong> — 2026-08-18 — Review pass. The gap report's reference is
            hard-coded in the build script, not taken from the config field, and the Development
            tab now says so. The Examples prose describes the cells the table actually holds.
            The narrow-screen budget moves from the longest word to the longest unbroken token,
            a 54-character URL, with both figures in the table. The library's merge depth is
            attributed to the kit's own statement rather than to the library, and the choice of
            which ARIA names to override now points at Accessibility Guidelines instead of
            repeating it. Related lists made reciprocal with the four sibling foundations
            guides.</li>
          <li><strong>v0.1</strong> — 2026-08-18 — Initial guide: the four shipped variants and
            their module layout, the fallback chain and what a total miss renders, the two
            reference languages the tooling disagrees about, the absence of interpolation and
            plural machinery, the PrimeNG ARIA hand-off, text expansion measured over the shared
            keys, and the canonical agent doc.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class I18nLocalizationArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly i18n = inject(TranslationService);

  // --- Live example state: the block IS the output ---------------------------

  /** The active variant, read from the service's own language signal. */
  readonly currentLang = computed(() => this.i18n.currentLanguage$());

  /**
   * Four ordinary chrome keys resolved live. `translate` reads the service's
   * version signal, so this recomputes when the bundle lands as well as on a
   * switch — which is the behavior the Usage tab's first pair is about.
   */
  readonly probe = computed(() => [
    { key: 'common.loading', value: this.i18n.translate('common.loading') },
    { key: 'common.cancel', value: this.i18n.translate('common.cancel') },
    { key: 'common.close', value: this.i18n.translate('common.close') },
    { key: 'common.search', value: this.i18n.translate('common.search') },
  ]);

  /**
   * A key whose first segment names no module: it resolves in no language and
   * comes back as itself. The segment is deliberately not a namespace, so the
   * raw-key gate skips it exactly the way it skips a real typo.
   */
  readonly missingProbe = computed(() => this.i18n.translate('absentNamespace.absent.key'));

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly labelPatternSnippet: string = `// One computed for every string the template needs.
readonly labels = computed(() => ({
  title:  this.i18n.translate('widget.title'),
  empty:  this.i18n.translate('widget.empty'),
  remove: this.i18n.translate('widget.remove'),
}));

/* template */
<h2>{{ labels().title }}</h2>
<button type="button" [attr.aria-label]="labels().remove">…</button>

/* A component whose keys all share one prefix usually adds a tiny helper
   instead, so the namespace is written once:

     t(key: string): string {
       return this.i18n.translate('widget.' + key);
     }

   Same lookup, same signals — but hold the RESULT in a computed when a
   template reads it, so the value is recomputed rather than remembered. */`;

  readonly placeholderSnippet: string = `// The module file owns the whole sentence, placeholder included.
// src/assets/i18n/modules/en/<ns>.json
{ "selected": "{n} of {total} selected" }

// The call site substitutes. Nothing in the lookup does it for you.
readonly caption = computed(() =>
  this.i18n
    .translate('widget.selected')
    .replace('{n}', String(this.selected()))
    .replace('{total}', String(this.total())),
);

/* Two shapes exist in the corpus — {n} and the double-braced {{n}}. Both are
   plain text to the lookup; the only rule is to match the namespace you are
   writing in. There is no plural selector: a sentence that changes shape with
   the count needs one key per form and a branch you write, and which forms a
   language needs is stated in its own guide under directives/languages/. */`;

  readonly searchSnippet: string = `import { foldForSearch } from '../../utils/search-fold';

// Fold BOTH sides: the query as typed, and the translated text it is matched against.
readonly hits = computed(() => {
  const q = foldForSearch(this.query().trim());
  return this.items().filter((item) =>
    foldForSearch(this.i18n.translate(item.titleKey)).includes(q),
  );
});

// "Codereview", "Code-Review" and "Code·review" now find each other. Only the
// middle dot and the hyphen family are dropped; whitespace is kept, so
// "code review" with a space still matches none of them.`;

  readonly addKeySnippet: string = `# A key: add it to the SAME path in all four variant directories.
src/assets/i18n/modules/en/<ns>.json        <- the gate's reference
src/assets/i18n/modules/de/<ns>.json
src/assets/i18n/modules/en-easy/<ns>.json
src/assets/i18n/modules/de-easy/<ns>.json

# A namespace is just a new file: the stem becomes the first key segment,
# verbatim — devWorkshop.json gives devWorkshop.*, common.json gives common.*,
# and a hyphen survives unchanged. No registration step exists; the build reads
# the directory.

npm run i18n:build                      # rebuild the per-language bundles
node scripts/check-i18n-keys.mjs        # resolves, parity, no blanks, no new orphans
node scripts/check-house-style.mjs      # du, generic masculine, „…“, American English
node scripts/check-genericity.mjs       # no branding in the values

# A key you build at runtime ('toast.type.' + type) names no full key, so the
# first check counts its keys as unreferenced. Add the prefix, with a reason, to
# DYNAMIC_PREFIXES in that script. What it does NOT do: notice a misspelled
# namespace. 'widgt.title' has no module called widgt, so it is not treated as
# a key at all — it is skipped, and it renders raw in the UI.`;

  readonly addLanguageSnippet: string = `// 1. src/config/languages.json — the single source for languages. Every list,
//    URL prefix, SEO flag, and fallback chain in the app AND the build scripts is
//    derived from it (src/config/language-rules.mts).
{
  "defaultLanguage": "de",
  "keySourceLanguage": "en",
  "contentReferenceLanguage": "de",
  "languages": [
    { "code": "de", "easyCode": "de-easy", ... },
    { "code": "en", "easyCode": "en-easy", ... },
    { "code": "fr", "easyCode": "fr-easy", "name": "French", "nativeName": "Français",
      "easyName": "Français facile", "easyNativeName": "Français facile",
      "flag": "fr", "hreflang": "fr", "locale": "fr-FR", "seo": true, "prerenderTier": 1 }
  ]
}

// 2. Two module directories, base and easy. A production build refuses to run
//    when a directory named in the config is missing — an empty bundle would
//    ship raw keys to every reader of that language.

// 3. src/index.html: the bare-URL redirect is inline script and cannot import;
//    add the code to its list. check-i18n-keys.mjs fails until you do.`;

  readonly primeNgSnippet: string = `// The library reads its own config, not your modules. Bridge the two once,
// in an effect, so it re-runs when the bundle lands and on every switch.
// app.component.ts
effect(() => this.optimusA11y.syncAriaStrings());

// services/optimus-a11y.service.ts
syncAriaStrings(): void {
  const t = (key: string) => this.translationService.translate('optimus.' + key);
  this.optimus.setTranslation({
    aria: {
      ...(this.optimus.translation.aria ?? {}),   // the block is replaced, not
      listLabel: t('listLabel'),                  // deep-merged: without this
      removeLabel: t('removeLabel'),              // spread every key you do not
      close: t('close'),                          // name here is gone
      // …only the keys components in this kit actually read
    },
  });
}

/* Which of those names deserve an override is the accessibility guide's
   subject; this guide owns only the hand-off — where the strings come from,
   when the effect runs, and why the block is spread. */`;
}
