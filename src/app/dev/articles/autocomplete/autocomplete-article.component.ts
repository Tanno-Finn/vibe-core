import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from '@openng/optimus-ui/autocomplete';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

interface City {
  name: string;
  region: string;
}

interface CityGroup {
  region: string;
  items: City[];
}

/**
 * Guide article: AutoComplete (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as an
 * `appGuideTab` template. Its subject is the BOUNDARY the audience keeps asking
 * about: when a typed suggestion field beats a dropdown, and what the typed
 * field costs — an empty control that advertises nothing, a model that holds raw
 * text by default, and a combobox whose accessible plumbing differs from
 * p-select in almost every detail.
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot). All line
 * numbers are @openng/optimus-ui/fesm2022/openng-optimus-ui-autocomplete.mjs, Optimus UI 2.0.2:
 *   - THE FOCUSABLE ELEMENT IS A REAL INPUT. Single mode renders
 *     `<input pInputText role="combobox" aria-autocomplete="list">` (:1590-1634).
 *     Unlike p-select, `<label for>` + `inputId` therefore names it — an input
 *     IS a labelable element. That is the single largest behavioral difference
 *     between the two guides and the reason this one recommends the native label.
 *   - THE MODEL HOLDS RAW TEXT BY DEFAULT. `onInput` calls `updateModel(query)`
 *     whenever `!multiple && !forceSelection` (:963-965), so every keystroke
 *     writes the typed string into the form control. `forceSelection` inverts
 *     this: typing writes nothing, and on the native `change` event
 *     the forceSelection check (:1373-1394) looks for an EXACT, case-folded
 *     label match (`isOptionMatched`, :918) among the CURRENTLY VISIBLE
 *     suggestions and, finding none, sets `input.value = ''` and calls `clear()`
 *     (:1385-1387). No message, no invalid state — the entry is simply gone.
 *   - THE OVERLAY IS A REACTION TO A NEW SUGGESTIONS REFERENCE.
 *     `search()` sets `loading = true` and emits `completeMethod` (:1340-1341);
 *     `handleSuggestionsChange` runs only `if (this.loading)` and is what opens
 *     the overlay and clears the flag (:839-848). Mutating the array in place
 *     never opens it, and a completeMethod that never assigns leaves the spinner
 *     running forever.
 *   - FOCUS RING, TWO AURA SOURCES, ONE KIT RING. Aura maps the root's focusRing
 *     to `form.field.focus.ring.*` — zeroed in the base preset — while the
 *     dropdown button maps to the GLOBAL `focus.ring.*` (1px solid primary,
 *     offset 2px). The kit draws its one 2px ring on all three parts: the
 *     input, the token-field box, and `.p-autocomplete-dropdown:focus-visible`.
 *   - TWO MODES, TWO SETS OF KIT RULES. The `pInputText` directive adds
 *     `p-inputtext p-component` (openng-optimus-ui-inputtext.mjs:26), so the
 *     single-mode input reads --p-inputtext-* tokens and gets the kit's dark
 *     element tokens, the :focus-visible ring, every html.style-* block's
 *     `input.p-inputtext` border rule, and the kit's `input.p-inputtext.p-invalid`
 *     red. The multiple-mode box is `ul.p-autocomplete-input-multiple` (its inner
 *     input carries no `pInputText`); it gets the `.p-autocomplete` rules instead:
 *     --control-border edge, --semantic-red-fg invalid token, the kit ring on
 *     `.p-autocomplete.p-focus .p-autocomplete-input-multiple` (styles.scss),
 *     and the dark fill --surface-section with --text-color /
 *     --control-placeholder (`.dark-theme .p-autocomplete`) and the kit ring
 *     inside the keyboard-focused chip
 *     (`.p-autocomplete-chip-item.p-focus .p-autocomplete-chip`, offset -2px:
 *     the box clips) — "focus ring", inset rows on autocomplete.chip.focus.background.
 *   - CHIPS ARE OPTIONS IN A HORIZONTAL LISTBOX. Multiple mode renders
 *     `ul[role=listbox][aria-orientation=horizontal]` (:1649-1650) whose chips
 *     are `li[role=option][aria-selected=true]` (:1662-1666) and whose LAST
 *     child is an `li[role=option]` holding the combobox input (:1688).
 *     The remove icon is a roleless span with a click handler (:1679) — no role,
 *     no tabindex, so neither focusable nor announced as an action; only its
 *     inner SVG is aria-hidden (:1680). The keyboard path is Backspace on the
 *     input (last chip; handlers :1295-1313) or ArrowLeft into the container followed by
 *     Backspace (dispatch :1103 and :1131, handlers :1187 and :1284).
 *   - GROUP HEADERS AND THE EMPTY ROW ARE OPTIONS (:1791, :1827) — the same
 *     upstream gap the Select guide documents.
 *   - FOUR LIBRARY STRINGS SIT OUTSIDE THE `aria` BLOCK.
 *     `searchMessage`, `emptySearchMessage`, `selectionMessage` and
 *     `emptySelectionMessage` are root-level translation keys
 *     (openng-optimus-ui-config.mjs:169-172), so the kit's `aria`-only setTranslation push
 *     does not reach them; only `aria.listLabel` (:227) is covered. Of the four,
 *     `searchMessage` can never render: its sole consumer is the empty-results
 *     <li> (:1827-1829), which exists only when the list is empty, and in that state
 *     `searchResultMessageText` (:737-739) takes the emptySearchMessage branch.
 *     So the result COUNT is never announced at all.
 *   - THE `pt` ROUTE IS SINGLE-MODE ONLY. `pcInputText` resolves onto the
 *     single-mode input, but the multiple-mode input is bound with
 *     `[pBind]="ptm('input')"` (:1689-1726) and `input` is not a key of
 *     AutoCompletePassThroughOptions — so a token field has no typed route for
 *     aria-describedby or aria-invalid.
 *   - `[invalid]` DOES REACH THE TOKEN FIELD, BY TWO ROUTES. The shipped rules for
 *     `.p-autocomplete-input-multiple` are keyed on `.p-autocomplete.p-invalid`
 *     (optimus-ui-styles/dist/autocomplete/index.mjs:183) and the root class map sets
 *     `p-invalid` from the `invalid` input (:64); Optimus additionally re-adds the v21
 *     `.ng-invalid.ng-dirty` rules on top (:26-56). The box still carries no
 *     `pInputText`, so nothing else reaches it.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-autocomplete-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, AutoCompleteModule, SelectModule, ToggleSwitchModule, FormsModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'autocomplete'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every control below is a real <code>p-autocomplete</code> over the same list of {{ allCities.length }} cities.
          Start in the playground: the switches change the three decisions that matter — is there a dropdown button, is
          the answer a set, and may the user invent a value — and the markup underneath updates with them. Each field is
          named with a plain <code>&lt;label for&gt;</code>, which works here and does not on a <code>p-select</code>.
        </p>

        <!-- Mini playground: live-configure an autocomplete and read back the markup. -->
        <section class="pg" aria-label="AutoComplete playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Size</span>
                <p-select
                  [ariaLabelledBy]="'pg-size-label'"
                  size="small"
                  [options]="sizeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSize()"
                  (ngModelChange)="pgSize.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-dropdown">Dropdown button</label>
                <p-toggleswitch
                  inputId="pg-dropdown"
                  [ngModel]="pgDropdown()"
                  (ngModelChange)="pgDropdown.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-multiple">Multiple (chips)</label>
                <p-toggleswitch inputId="pg-multiple" [ngModel]="pgMultiple()" (ngModelChange)="onPgMultiple($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-force">Force selection</label>
                <p-toggleswitch inputId="pg-force" [ngModel]="pgForce()" (ngModelChange)="pgForce.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-clear">Show clear</label>
                <p-toggleswitch inputId="pg-clear" [ngModel]="pgClear()" (ngModelChange)="pgClear.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <label class="pg__preview-label" for="pg-city">City</label>
              <div class="pg__stage">
                <p-autocomplete
                  inputId="pg-city"
                  [suggestions]="pgSuggestions()"
                  (completeMethod)="completePlayground($event)"
                  optionLabel="name"
                  [size]="pgSizeInput()"
                  [dropdown]="pgDropdown()"
                  [multiple]="pgMultiple()"
                  [forceSelection]="pgForce()"
                  [showClear]="pgClear()"
                  [disabled]="pgDisabled()"
                  placeholder="Start typing a city"
                  emptyMessage="No city matches that text"
                  dropdownAriaLabel="Show all cities"
                  [ngModel]="pgValue()"
                  (ngModelChange)="pgValue.set($event)"
                />
              </div>
              <p class="pg__hint">
                Type two letters. With <em>Force selection</em> on, leave the field on a half-typed word and watch what
                the control does to your text.
              </p>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Generated markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        <!-- Sizes; the Design tab carries the token table behind them. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">The three sizes, side by side</h3>
            <button type="button" class="copy-btn" (click)="copy('sizes', sizesCode)">
              {{ copiedId() === 'sizes' ? 'Copied' : 'Copy' }}
            </button>
          </div>
          <p class="ex__note">
            One suggestion source, three <code>size</code> values. The Design tab has the token table and the measured
            heights behind the difference.
          </p>
          <div class="ex__stage">
            <div class="sizes">
              <div class="sizes__row">
                <label class="pg__label" for="sz-small">Small</label>
                <p-autocomplete
                  inputId="sz-small"
                  size="small"
                  [dropdown]="true"
                  [suggestions]="szSuggestions()"
                  (completeMethod)="completeSizes($event)"
                  optionLabel="name"
                  dropdownAriaLabel="Show all cities"
                  [ngModel]="szSmall()"
                  (ngModelChange)="szSmall.set($event)"
                />
              </div>
              <div class="sizes__row">
                <label class="pg__label" for="sz-normal">Default</label>
                <p-autocomplete
                  inputId="sz-normal"
                  [dropdown]="true"
                  [suggestions]="szSuggestions()"
                  (completeMethod)="completeSizes($event)"
                  optionLabel="name"
                  dropdownAriaLabel="Show all cities"
                  [ngModel]="szNormal()"
                  (ngModelChange)="szNormal.set($event)"
                />
              </div>
              <div class="sizes__row">
                <label class="pg__label" for="sz-large">Large</label>
                <p-autocomplete
                  inputId="sz-large"
                  size="large"
                  [dropdown]="true"
                  [suggestions]="szSuggestions()"
                  (completeMethod)="completeSizes($event)"
                  optionLabel="name"
                  dropdownAriaLabel="Show all cities"
                  [ngModel]="szLarge()"
                  (ngModelChange)="szLarge.set($event)"
                />
              </div>
            </div>
          </div>
          <pre class="code-block"><code>{{ sizesCode }}</code></pre>
        </section>

        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('basic') {
                  <div class="field">
                    <label class="pg__label" for="ex-basic">City</label>
                    <p-autocomplete
                      inputId="ex-basic"
                      [suggestions]="exBasicSuggestions()"
                      (completeMethod)="completeBasic($event)"
                      optionLabel="name"
                      placeholder="Start typing"
                      emptyMessage="No city matches that text"
                      [ngModel]="exBasic()"
                      (ngModelChange)="exBasic.set($event)"
                    />
                  </div>
                }
                @case ('dropdown') {
                  <div class="field">
                    <label class="pg__label" for="ex-dd-blank">Dropdown, mode blank</label>
                    <p-autocomplete
                      inputId="ex-dd-blank"
                      [dropdown]="true"
                      dropdownMode="blank"
                      [suggestions]="exDdSuggestions()"
                      (completeMethod)="completeDropdown($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Show all cities"
                      emptyMessage="No city matches that text"
                      [ngModel]="exDdBlank()"
                      (ngModelChange)="exDdBlank.set($event)"
                    />
                  </div>
                  <div class="field">
                    <label class="pg__label" for="ex-dd-current">Dropdown, mode current</label>
                    <p-autocomplete
                      inputId="ex-dd-current"
                      [dropdown]="true"
                      dropdownMode="current"
                      [suggestions]="exDdSuggestions()"
                      (completeMethod)="completeDropdown($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Search for what is typed"
                      emptyMessage="No city matches that text"
                      [ngModel]="exDdCurrent()"
                      (ngModelChange)="exDdCurrent.set($event)"
                    />
                  </div>
                }
                @case ('grouped') {
                  <div class="field">
                    <label class="pg__label" for="ex-grouped">City, by region</label>
                    <p-autocomplete
                      inputId="ex-grouped"
                      [dropdown]="true"
                      [group]="true"
                      optionGroupLabel="region"
                      optionGroupChildren="items"
                      [suggestions]="exGroupSuggestions()"
                      (completeMethod)="completeGrouped($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Show all cities by region"
                      emptyMessage="No city matches that text"
                      [ngModel]="exGrouped()"
                      (ngModelChange)="exGrouped.set($event)"
                    />
                  </div>
                }
                @case ('multiple') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-multiple">Cities to compare</label>
                    <p-autocomplete
                      inputId="ex-multiple"
                      [multiple]="true"
                      [suggestions]="exMultiSuggestions()"
                      (completeMethod)="completeMulti($event)"
                      optionLabel="name"
                      placeholder="Add a city"
                      emptyMessage="No city matches that text"
                      [ngModel]="exMulti()"
                      (ngModelChange)="exMulti.set($event)"
                    />
                    <p class="field__hint">
                      With the text box empty, <kbd>Backspace</kbd> removes the last chip and <kbd>←</kbd> steps into
                      the chip row.
                    </p>
                  </div>
                }
                @case ('tags') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-tags">Tags you invent</label>
                    <p-autocomplete
                      inputId="ex-tags"
                      [multiple]="true"
                      [typeahead]="false"
                      [addOnBlur]="true"
                      separator=","
                      placeholder="Type a tag, then Enter"
                      [ngModel]="exTags()"
                      (ngModelChange)="exTags.set($event)"
                    />
                    <p class="field__hint">
                      No suggestions at all: <code>[typeahead]="false"</code> turns the control into a token field.
                      <kbd>Enter</kbd>, a comma, or leaving the field commits what you typed.
                    </p>
                  </div>
                }
                @case ('force') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-force">City (must be from the list)</label>
                    <p-autocomplete
                      inputId="ex-force"
                      [dropdown]="true"
                      [forceSelection]="true"
                      [suggestions]="exForceSuggestions()"
                      (completeMethod)="completeForce($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Show all cities"
                      emptyMessage="No city matches that text"
                      [pt]="ptForceHint"
                      [ngModel]="exForce()"
                      (ngModelChange)="exForce.set($event)"
                    />
                    <p class="field__hint" id="ex-force-hint">
                      Type <em>Lis</em> and click outside. The text is erased, because it is not an exact match for a
                      suggestion. That silence is the control's own behavior, so the hint has to carry the rule.
                    </p>
                  </div>
                }
                @case ('async') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-async">City (remote lookup)</label>
                    <p-autocomplete
                      inputId="ex-async"
                      [minQueryLength]="2"
                      [delay]="400"
                      [suggestions]="exAsyncSuggestions()"
                      (completeMethod)="completeAsync($event)"
                      optionLabel="name"
                      placeholder="At least two letters"
                      emptyMessage="No city matches that text"
                      [ngModel]="exAsync()"
                      (ngModelChange)="exAsync.set($event)"
                    />
                    <p class="field__hint">
                      A simulated 600 ms round trip behind a 400 ms keystroke debounce and a two-character floor. The
                      spinner stops when the suggestions array is re-assigned — not when the request returns.
                    </p>
                  </div>
                }
                @case ('template') {
                  <div class="field">
                    <label class="pg__label" for="ex-template">City with region</label>
                    <p-autocomplete
                      inputId="ex-template"
                      [dropdown]="true"
                      [suggestions]="exTplSuggestions()"
                      (completeMethod)="completeTemplate($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Show all cities"
                      emptyMessage="No city matches that text"
                      [ngModel]="exTemplate()"
                      (ngModelChange)="exTemplate.set($event)"
                    >
                      <ng-template #item let-city>
                        <span class="opt">
                          <strong>{{ city.name }}</strong>
                          <span class="opt__meta">{{ city.region }}</span>
                        </span>
                      </ng-template>
                    </p-autocomplete>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <label class="pg__label" for="ex-disabled">Disabled</label>
                    <p-autocomplete
                      inputId="ex-disabled"
                      [disabled]="true"
                      [dropdown]="true"
                      optionLabel="name"
                      dropdownAriaLabel="Show all cities"
                      [ngModel]="stateCity"
                    />
                  </div>
                  <div class="field">
                    <label class="pg__label" for="ex-invalid">Invalid</label>
                    <p-autocomplete
                      inputId="ex-invalid"
                      [invalid]="true"
                      [suggestions]="exStateSuggestions()"
                      (completeMethod)="completeStates($event)"
                      optionLabel="name"
                      placeholder="Start typing"
                      [pt]="ptInvalid"
                    />
                    <p class="field__hint field__hint--error" id="ex-invalid-msg">Pick a city from the suggestions.</p>
                  </div>
                  <div class="field">
                    <label class="pg__label" for="ex-readonly">Read-only</label>
                    <p-autocomplete
                      inputId="ex-readonly"
                      [readonly]="true"
                      [dropdown]="true"
                      optionLabel="name"
                      dropdownAriaLabel="Show all cities"
                      [ngModel]="stateCity"
                    />
                  </div>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>When does typing beat a list? The honest table</h3>
        <p>
          An autocomplete is the only control in this family that shows the user
          <strong>nothing</strong> at rest. That is its whole cost, and it buys one thing: an answer space too large,
          too remote, or too open to enumerate. Decide by
          <strong
            >how many candidates exist, whether the user can name the target, whether the answer may be a value nobody
            has listed, and whether the set of answers must be visible while deciding</strong
          >.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>Candidates</th>
                <th>Visible at rest</th>
                <th>How the user gets there</th>
                <th>Value outside the list?</th>
                <th>Multiple</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-select</code></td>
                <td>~5&#8211;25, known and loaded</td>
                <td>one &#8212; the current value</td>
                <td>Open, scan, pick. Nothing to type.</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>p-select [filter]</code></td>
                <td>~15&#8211;60, known and loaded</td>
                <td>one</td>
                <td>Open, then browse <em>or</em> narrow. The list is the fallback.</td>
                <td>No</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>p-listbox</code></td>
                <td>~3&#8211;15, when the page can spare the height</td>
                <td><strong>all rows</strong>, no overlay</td>
                <td>Scan and pick, nothing hidden.</td>
                <td>No</td>
                <td><code>[multiple]</code></td>
              </tr>
              <tr>
                <td><code>p-multiselect</code></td>
                <td>~5&#8211;60</td>
                <td>a summary of the chosen set</td>
                <td>Open, browse, tick. Filter optional.</td>
                <td>No</td>
                <td><strong>Yes</strong> &#8212; the reason to use it</td>
              </tr>
              <tr>
                <td><code>p-autocomplete</code></td>
                <td><strong>hundreds, remote, or unbounded</strong></td>
                <td><strong>nothing</strong> &#8212; an empty text field</td>
                <td>Type; suggestions arrive per query. Browsing is impossible.</td>
                <td><strong>Yes by default</strong> &#8212; see below</td>
                <td><code>[multiple]="true"</code></td>
              </tr>
              <tr>
                <td><code>p-autocomplete [dropdown]</code></td>
                <td>hundreds, remote, or unbounded</td>
                <td>nothing, but a button promises a list</td>
                <td>Type, <em>or</em> press the button to see everything. Buys the affordance back.</td>
                <td>Yes by default</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>p-autocomplete [multiple] [typeahead]="false"</code></td>
                <td>none &#8212; the user invents them</td>
                <td>the chips added so far</td>
                <td>Type, then <kbd>Enter</kbd> / a separator / blur. No suggestions at all.</td>
                <td>That is the point (tag entry)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>native <code>&lt;datalist&gt;</code></td>
                <td>a bounded list you can ship in the HTML</td>
                <td>nothing</td>
                <td>Type; the browser suggests. Zero JS, zero styling, no remote query.</td>
                <td>Yes</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code>&lt;input pInputText&gt;</code></td>
                <td>none</td>
                <td>nothing</td>
                <td>Type. The system has no opinion about the answer.</td>
                <td>Only values</td>
                <td>n/a</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> The behavior columns are read from the Optimus UI 2.0.2 sources
          in <code>node_modules</code>; the candidate-count bands are a <em>judgment</em> encoding "how far can a user
          scan before typing beats scrolling", and you should move them if your content says otherwise. Two rows are
          easy to skip and often right: <code>&lt;datalist&gt;</code> when the list is small, static, and local &#8212;
          it costs no bundle and no accessibility risk &#8212; and <code>p-select [filter]</code>, which gives searching
          to a user who can still browse. Kit convention: closed choices are <code>p-select</code>, free text is
          <code>&lt;input pInputText&gt;</code> with a <code>&lt;label for&gt;</code>, and a typed field is what you
          reach for only once neither of those fits.
        </p>

        <h3>The default is a free-text field that happens to suggest</h3>
        <p>
          This is the part that surprises people who arrive from <code>p-select</code>. In single mode, every keystroke
          is written straight into the form control: <code>onInput</code> calls <code>updateModel(query)</code> whenever
          <code>multiple</code> and <code>forceSelection</code> are both off
          (<code>openng-optimus-ui-autocomplete.mjs:963-965</code>). Type three letters and walk away, and your model holds the
          string <em>"Lis"</em> &#8212; not a city, not <code>null</code>. Three ways out, in order of preference:
        </p>
        <ul>
          <li>
            <strong>Accept free text on purpose.</strong> A search box, a free-form location, a tag: bind to a
            <code>string</code>, treat suggestions as a convenience, and say so in the type.
          </li>
          <li>
            <strong>Validate the shape you need.</strong> Keep the free typing, and let a validator reject anything that
            is not one of your objects. The user keeps their text and gets a message they can act on.
          </li>
          <li>
            <strong><code>[forceSelection]="true"</code>, with a visible rule.</strong> Typing no longer touches the
            model at all; on <code>change</code> the control matches the text against the visible suggestions and, if
            nothing matches <em>exactly</em>, erases the field (<code>:1298-1315</code>). Silent erasure is a usability
            defect on its own, so pair it with a hint that names the rule and with <code>[dropdown]="true"</code> so the
            valid answers are reachable at all.
          </li>
        </ul>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &#8212; a typed field for six known options</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-few-bad">Chart type</label>
                <p-autocomplete
                  inputId="dd-few-bad"
                  [suggestions]="ddFewSuggestions()"
                  (completeMethod)="completeFew($event)"
                  optionLabel="label"
                  placeholder="Start typing"
                  [ngModel]="ddFewText()"
                  (ngModelChange)="ddFewText.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              The user cannot know that six answers exist, let alone what they are called. An empty field asks them to
              guess the vocabulary of your data model.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &#8212; show the closed list</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-few-good-label">Chart type</span>
                <p-select
                  [ariaLabelledBy]="'dd-few-good-label'"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Pick a chart type"
                  [ngModel]="ddFewValue()"
                  (ngModelChange)="ddFewValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              One click reveals the entire answer space, and the model can only ever hold a value you defined. Reach for
              the autocomplete when the list stops fitting &#8212; not before.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &#8212; forceSelection on its own</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-force-bad">City</label>
                <p-autocomplete
                  inputId="dd-force-bad"
                  [forceSelection]="true"
                  [suggestions]="ddForceSuggestions()"
                  (completeMethod)="completeDdForce($event)"
                  optionLabel="name"
                  placeholder="Start typing"
                  [ngModel]="ddForceBad()"
                  (ngModelChange)="ddForceBad.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Type <em>Lis</em>, click away: the text vanishes with no message, no error state, and no hint that only
              listed cities count. There is nothing on screen from which the rule could be inferred.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &#8212; state the rule and open the list</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-force-good">City</label>
                <p-autocomplete
                  inputId="dd-force-good"
                  [forceSelection]="true"
                  [dropdown]="true"
                  [suggestions]="ddForceSuggestions()"
                  (completeMethod)="completeDdForce($event)"
                  optionLabel="name"
                  placeholder="Start typing"
                  dropdownAriaLabel="Show all cities"
                  [pt]="ptDdForceHint"
                  [ngModel]="ddForceGood()"
                  (ngModelChange)="ddForceGood.set($event)"
                />
                <p class="field__hint" id="dd-force-good-hint">Choose one of the listed cities.</p>
              </div>
            </div>
            <p class="dd__why">
              The hint reaches the input through the <code>pt</code> pass-through, so the constraint is announced before
              the erasure can surprise anyone, and the dropdown button makes the permitted answers reachable without
              guessing.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &#8212; let the placeholder be the label</span>
            <div class="dd__stage">
              <div class="field">
                <p-autocomplete
                  [suggestions]="ddLabelSuggestions()"
                  (completeMethod)="completeDdLabel($event)"
                  optionLabel="name"
                  placeholder="City"
                  [ngModel]="ddLabelBad()"
                  (ngModelChange)="ddLabelBad.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              The field on the left is not nameless &#8212; measured, its accessible name is the placeholder, because
              that is the last-resort fallback in the name computation. It is the wrong name anyway: the word "City"
              leaves the screen the moment anything is typed, exactly when the user most needs to know what they are
              answering.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &#8212; a native label, bound by inputId</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-label-good">City</label>
                <p-autocomplete
                  inputId="dd-label-good"
                  [suggestions]="ddLabelSuggestions()"
                  (completeMethod)="completeDdLabel($event)"
                  optionLabel="name"
                  placeholder="Start typing"
                  [ngModel]="ddLabelGood()"
                  (ngModelChange)="ddLabelGood.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              <code>inputId</code> lands on a real <code>&lt;input&gt;</code>, which <em>is</em> a labelable element, so
              <code>&lt;label for&gt;</code> binds. This is the one place where the Select guide's advice inverts: there
              the native label is useless, here it is the correct answer.
            </p>
          </div>
        </div>

        <h3>Write the suggestion list for a reader who is mid-word</h3>
        <ul>
          <li>
            <strong>Rank by likelihood, not by the alphabet.</strong> The user reads the first two rows and nothing
            else. Prefix matches before substring matches, popular before obscure.
          </li>
          <li>
            <strong>Show what disambiguates.</strong> Two cities called Springfield need their region in the row, or the
            list is a coin flip; use the item template, and keep the extra text secondary.
          </li>
          <li>
            <strong>Never reorder the list while it is open.</strong> Focus is tracked by
            <code>aria-activedescendant</code> against an index, so moving rows moves the target under the user's
            finger.
          </li>
          <li>
            <strong>Cap the result set.</strong> The overlay scrolls at <code>scrollHeight</code> (default
            <code>200px</code>); a query returning 500 rows is a scroll bar, not an answer. Return the best 10 and say
            so.
          </li>
          <li>
            <strong>Do not fold the whole catalog into one query.</strong> If the answer space is small enough to
            return in full, the control should have been a <code>p-select</code>.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer">
              W3C &#8212; APG, Combobox pattern</a
            >
            &#8212; the roles-and-states contract this guide checks the library against:
            <code>role="combobox"</code> on the text input, <code>aria-expanded</code> tracking the popup,
            <code>aria-controls</code> pointing at the listbox, and <code>aria-activedescendant</code> naming the
            visually focused option.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; APG, Editable Combobox with List Autocomplete</a
            >
            &#8212; the exact variant a <code>p-autocomplete</code> implements, and the source of the keyboard
            expectations in the Development tab (Down opens without selecting, Escape closes and keeps focus, Enter
            accepts the focused option).
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#listbox" target="_blank" rel="noopener noreferrer">
              W3C &#8212; WAI-ARIA 1.2, <code>listbox</code> role</a
            >
            &#8212; "the listbox role requires ownership of an element using the option or group role": the reference
            for why a group header rendered as
            <code>role="option"</code>, and a combobox nested inside one, are defects rather than style choices.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; WCAG 2.2 SC 3.3.2 Labels or Instructions</a
            >
            &#8212; the criterion behind both the persistent-label rule and the requirement that a
            <code>forceSelection</code> field states its constraint before it enforces it.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            &#8212; the criterion a zeroed focus ring fails unless something else draws one; the Design tab shows the
            kit's ring on both modes.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            &#8212; the yardstick for "N results available": the library ships one live region, and this tab's i18n
            counterpart shows which string reaches it.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN &#8212; The <code>&lt;datalist&gt;</code> element</a
            >
            &#8212; the zero-JavaScript neighbor in the table above, including its real limits: no styling, no remote
            query, and inconsistent presentation across browsers.
          </li>
          <li>
            <a href="https://optimus.openng.org/autocomplete/" target="_blank" rel="noopener noreferrer">
              Optimus UI &#8212; AutoComplete</a
            >
            &#8212; the vendor API surface this guide maps onto the kit's conventions and then verifies against the
            shipped source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy &#8212; two different controls behind one tag</h3>
        <p>
          The host <code>&lt;p-autocomplete&gt;</code> carries
          <code>p-autocomplete p-component p-inputwrapper</code> plus every state class (<code>p-focus</code>,
          <code>p-invalid</code>, <code>p-autocomplete-open</code>, <code>p-autocomplete-clearable</code>). What it
          wraps depends entirely on <code>multiple</code>:
        </p>
        <ul>
          <li>
            <strong>Single mode</strong> &#8212; one
            <code>&lt;input class="p-autocomplete-input p-inputtext p-component"&gt;</code>
            carrying <code>role="combobox"</code>, <code>aria-autocomplete="list"</code>, <code>aria-expanded</code>,
            <code>aria-controls</code> and <code>aria-activedescendant</code>. The visible box <em>is</em> the input.
          </li>
          <li>
            <strong>Multiple mode</strong> &#8212; a <code>&lt;ul class="p-autocomplete-input-multiple"&gt;</code> is
            the visible box. It holds one <code>li.p-autocomplete-chip-item</code> per value (each wrapping a
            <code>p-chip</code>) and, last, an <code>li.p-autocomplete-input-chip</code>
            containing the text input &#8212; which still carries
            <code>role="combobox"</code> but, measured, only the class <code>p-autocomplete-input</code>: no
            <code>pInputText</code> directive, so it is not a <code>.p-inputtext</code>. The single-mode input measures
            <code>p-autocomplete-input p-component p-inputtext</code>.
          </li>
          <li>
            <strong>Clear icon</strong> &#8212; <code>[showClear]</code> renders an <code>aria-hidden</code> SVG with a
            click handler; it is not a button and not reachable by keyboard.
          </li>
          <li>
            <strong>Dropdown button</strong> &#8212; <code>[dropdown]="true"</code> renders a real
            <code>&lt;button type="button"&gt;</code> whose accessible name comes from
            <code>dropdownAriaLabel</code> and is <em>empty</em> if you do not set it.
          </li>
          <li>
            <strong>Overlay</strong> &#8212; <code>div.p-autocomplete-overlay</code> holding
            <code>ul.p-autocomplete-list[role=listbox]</code> with <code>id="&lt;id&gt;_list"</code>; rows are
            <code>li.p-autocomplete-option[role=option]</code>, and so are group headers and the empty-message row.
          </li>
          <li>
            <strong>Live region</strong> &#8212; a single
            <code>span[role=status][aria-live=polite].p-hidden-accessible</code>, rendered <em>inside</em> the overlay,
            so it exists only while the overlay is open.
          </li>
        </ul>
        <p class="src-note">
          Anatomy read from <code>openng-optimus-ui-autocomplete.mjs</code> (Optimus UI 2.0.2): the single-mode input at
          1590-1634, the chip list at 1642-1728, the dropdown button at 1735, the option list at 1788-1833, and the
          status region at 1837; class names from the style map at 60-104. The <code>p-inputtext p-component</code> pair
          comes from the
          <code>pInputText</code> directive's own root class (<code>openng-optimus-ui-inputtext.mjs:26</code>) &#8212; which is
          why it is present in single mode and absent in multiple mode.
        </p>

        <h3>Size scale &#8212; tokens and measured heights</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>size="small"</code></th>
                <th>default</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
                <td>1.125rem (18px)</td>
              </tr>
              <tr>
                <td>padding-block (y)</td>
                <td>0.375rem (6px)</td>
                <td>0.5rem (8px)</td>
                <td>0.625rem (10px)</td>
              </tr>
              <tr>
                <td>padding-inline (x)</td>
                <td>0.625rem (10px)</td>
                <td>0.75rem (12px)</td>
                <td>0.875rem (14px)</td>
              </tr>
              <tr>
                <td><strong>measured input height</strong></td>
                <td><strong>33px</strong></td>
                <td><strong>39px</strong></td>
                <td><strong>46px</strong></td>
              </tr>
              <tr>
                <td>dropdown button width</td>
                <td>2rem</td>
                <td>2.5rem</td>
                <td>3rem</td>
              </tr>
              <tr>
                <td>border-radius / border</td>
                <td colspan="3">
                  <code>&#123;form.field.border.radius&#125;</code> (per visual style: 0 Werkbund, 12px Lernwerkstatt, 10px
                  Skizzenbuch, 2px Blaupause) / 1px solid &#8212; the trailing corners flatten to 0 where a dropdown
                  button is attached; on the single-mode input the style rule's own width (and, in Werkbund and
                  Blaupause, radius) for <code>input.p-inputtext</code> applies on top
                </td>
              </tr>
              <tr>
                <td>transition-duration</td>
                <td colspan="3">0.2s</td>
              </tr>
              <tr>
                <td>multiple-mode box, empty</td>
                <td colspan="3">
                  <strong>39px</strong> &#8212; the same as a single-mode field, and two chips (29px each) still measure
                  39px. Nothing pins the height: it grows only once the row <em>wraps</em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names from <code>&#64;openng/optimus-ui-themes/dist/aura/autocomplete/index.mjs</code>, which resolves every root
          value through <code>&#123;form.field.*&#125;</code> in <code>&#8230;/aura/base/index.mjs</code> &#8212; the
          same family the Select and Text Inputs guides measure, so a small autocomplete and a small select are the same
          height by construction. Heights are rendered box heights at Aura's 1px border; the style rule's heavier border on
          the single-mode input adds 2px in Werkbund and Lernwerkstatt and 1px in Skizzenbuch. The dropdown widths are
          the preset's own <code>dropdown.width</code> / <code>sm</code> / <code>lg</code> literals. All three sizes
          clear the WCAG 2.5.8 24px target floor for the field itself; an option row in the overlay is padded
          <code>8px 12px</code> and measures 37px.
        </p>

        <h3>Interaction states &#8212; and where the kit intervenes</h3>
        <p>
          Three layers style this control: the <em>Aura token layer</em> Optimus ships (form-field colors from Aura's
          stock slate/zinc palette, which the visual styles do not replace), this kit's <code>styles.scss</code>, and the
          <code>input.p-inputtext</code> rule in every <code>html.style-*</code> block. The single-mode input is a
          <code>pInputText</code>, so the <code>.p-inputtext</code> rules reach it; the multiple-mode
          <code>&lt;ul&gt;</code> is not, so the kit gives it <code>.p-autocomplete</code> rules of its own (edge,
          invalid token, focus ring, dark fill, chip ring). The two modes land on the same ring and the same red, but not the same edge.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Aura token layer</th>
                <th>Single mode, this kit</th>
                <th>Multiple mode, this kit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>rest</td>
                <td>
                  1px <code>&#123;form.field.border.color&#125;</code> on <code>&#123;form.field.background&#125;</code>
                </td>
                <td>
                  Border is the style outline (width and color from the style rule), both modes. Dark: fill
                  <code>--surface-section</code>, text <code>--text-color</code>, placeholder
                  <code>--control-placeholder</code> (element tokens from <code>.dark-theme .p-inputtext</code>). Edge
                  3.25&#8211;18.73:1 and placeholder 4.76:1 or more across the styles (<code>docs/generated/CONTRAST.MD</code>,
                  "form field edge" and "form field text", the <code>inputtext</code> rows).
                </td>
                <td>
                  1px <code>--control-border</code> (kit rule <code>.p-autocomplete</code>, also on the dropdown button),
                  both modes: 3.25&#8211;5.51:1 against the grounds, the card, and the box's own fill
                  (<code>CONTRAST.MD</code>, "form field edge", the <code>autocomplete.border.color</code> rows). Dark:
                  fill <code>--surface-section</code>, text <code>--text-color</code>, placeholder
                  <code>--control-placeholder</code> (<code>.dark-theme .p-autocomplete</code>), like the single-mode
                  input ("form field text", the <code>autocomplete</code> rows).
                </td>
              </tr>
              <tr>
                <td>hover</td>
                <td><code>&#123;form.field.hover.border.color&#125;</code></td>
                <td colspan="2">As Aura in both modes &#8212; the three-class hover rules outrank the style rule.</td>
              </tr>
              <tr>
                <td>focus &#8212; the field</td>
                <td>
                  <code>&#123;form.field.focus.border.color&#125;</code> (<code>&#123;primary.color&#125;</code>) plus a
                  focus ring Aura ships at <strong>width 0, style none</strong> (<code>formField.focusRing</code>).
                </td>
                <td>
                  Border tint <em>plus</em> the kit's 2px <code>--primary-color-fg</code> ring at 2px offset
                  (<code>.p-inputtext:focus-visible</code>, both modes).
                </td>
                <td>
                  The same kit ring and a <code>--primary-color-fg</code> border, on the box while its input has focus
                  (<code>.p-autocomplete.p-focus .p-autocomplete-input-multiple</code>, both modes).
                </td>
              </tr>
              <tr>
                <td>focus &#8212; the dropdown button</td>
                <td>
                  <code>dropdown.focusRing</code> maps to the <strong>global</strong>
                  <code>&#123;focus.ring.*&#125;</code>: 1px solid <code>&#123;primary.color&#125;</code> at 2px offset
                  &#8212; not the zeroed form-field ring.
                </td>
                <td colspan="2">
                  The kit ring instead, both modes: <code>.p-autocomplete-dropdown:focus-visible</code> is in the kit's
                  one ring rule, 2px <code>--primary-color-fg</code> at 2px offset, <code>!important</code> &#8212; the
                  same ring as the field, not Aura's 1px.
                </td>
              </tr>
              <tr>
                <td>invalid</td>
                <td>
                  <code>&#123;red.400&#125;</code> light / <code>&#123;red.300&#125;</code> dark on the border, a red
                  placeholder; no icon, no text.
                </td>
                <td>
                  Placeholder tint always. Border <code>--semantic-red-fg</code> from either trigger &#8212;
                  <code>[invalid]</code> alone included &#8212; because the kit's <code>input.p-inputtext.p-invalid</code>
                  rule (<code>!important</code>) outranks the style rule; the host's <code>ng-invalid ng-dirty</code> rule
                  (<code>openng-optimus-ui-autocomplete.mjs:28-35</code>) paints the same token.
                </td>
                <td>
                  Both triggers paint <code>--semantic-red-fg</code> (the kit re-points
                  <code>--p-autocomplete-invalid-border-color</code>):
                  <code>.p-autocomplete.p-invalid .p-autocomplete-input-multiple</code>
                  (<code>optimus-ui-styles/dist/autocomplete/index.mjs:183</code>, fed by the root class map at
                  <code>openng-optimus-ui-autocomplete.mjs:64</code>) and the same <code>ng-invalid ng-dirty</code> rule.
                </td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>
                  <code>&#123;form.field.disabled.background&#125;</code> and
                  <code>&#123;form.field.disabled.color&#125;</code>; <code>opacity</code> untouched.
                </td>
                <td colspan="2">
                  As Aura in both modes &#8212; the dark kit rule re-points the resting tokens only, so a disabled field
                  is distinguishable.
                </td>
              </tr>
              <tr>
                <td>read-only</td>
                <td>
                  No token, no rule &#8212; the native <code>readonly</code> attribute is set and nothing renders
                  differently.
                </td>
                <td colspan="2">Looks editable in both modes. If read-only matters, say it in text.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura column: <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (<code>formField</code>) and
          <code>&#8230;/aura/autocomplete/index.mjs</code>. Kit columns: the <code>.dark-theme .p-inputtext</code>,
          <code>.p-inputtext:focus-visible</code>, <code>input.p-inputtext.p-invalid</code>, <code>.p-autocomplete</code>
          and <code>.p-autocomplete.p-focus</code> rules and the <code>html.style-*</code> blocks in
          <code>styles.scss</code>; the winners follow from selector specificity &#8212;
          <code>html.style-* input.p-inputtext</code> outranks <code>.p-inputtext.p-invalid</code>, so the kit's invalid
          edge carries <code>!important</code>. Verify in your build: flag a pristine field with
          <code>[invalid]</code> and read the input's computed <code>border-color</code>.
        </p>
        <p class="src-note">
          <strong>Outside this kit's stylesheet</strong> the token field has Aura's zeroed ring again. Set
          <code>--p-autocomplete-focus-ring-width</code>, <code>-style</code>, <code>-color</code>, and
          <code>-offset</code> on a class <em>around</em> the form, not on <code>:root</code>: the theme re-declares its
          tokens on <code>:root, :host</code> from a <code>&lt;style&gt;</code> element injected at runtime, which lands
          after the stylesheet and wins on equal specificity.
        </p>

        <h3>The overlay and the option rows</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>overlay width</td>
                <td>
                  <code>min-width: 100%</code> of the host &#8212; measured equal to the field's own width at every
                  viewport tried; it grows with long rows, never shrinks below the control
                </td>
              </tr>
              <tr>
                <td>overlay radius / border / shadow</td>
                <td>
                  <code>&#123;border.radius.md&#125;</code> (per style); 1px <code>&#123;surface.200&#125;</code> light,
                  <code>&#123;surface.700&#125;</code> dark (Aura stock palette);
                  <code>0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)</code>
                </td>
              </tr>
              <tr>
                <td>scroll height</td>
                <td>
                  <code>scrollHeight</code>, default <code>200px</code> (<code>openng-optimus-ui-autocomplete.mjs:266</code>);
                  past a few hundred rows use <code>[virtualScroll]</code> with <code>virtualScrollItemSize</code>
                </td>
              </tr>
              <tr>
                <td>list padding / gap</td>
                <td>4px / 2px</td>
              </tr>
              <tr>
                <td>option padding / radius / height</td>
                <td>8px 12px / 4px / 37px</td>
              </tr>
              <tr>
                <td>option &#8212; focused</td>
                <td>
                  The kit ring drawn inside the row (<code>.p-autocomplete-option.p-focus</code>, 2px
                  <code>--primary-color-fg</code>, offset -2px; "option list focus" in <code>CONTRAST.MD</code>, 3.48:1 and
                  up) over Aura's fill, <code>&#123;surface.100&#125;</code> light; 24% of
                  <code>&#123;primary.400&#125;</code> dark
                </td>
              </tr>
              <tr>
                <td>option &#8212; selected</td>
                <td>
                  16% of <code>&#123;primary.400&#125;</code> dark; <code>&#123;primary.50&#125;</code> light &#8212; the
                  accent lightened 90%, a faint tint on the white overlay. If a selected row must be findable, render the
                  marker yourself in <code>#item</code>
                </td>
              </tr>
              <tr>
                <td>group header</td>
                <td>
                  font-weight 600, padding 8px 12px, transparent background &#8212; and <code>role="option"</code>, see
                  Development
                </td>
              </tr>
              <tr>
                <td>overlay tokens</td>
                <td>
                  The preset maps them to <code>&#123;overlay.select.*&#125;</code> &#8212; literally the same family as
                  <code>p-select</code>, so a themed dropdown and a themed autocomplete stay visually consistent for
                  free
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the resolved custom properties and the computed style of an opened overlay; token names from
          <code>&#64;openng/optimus-ui-themes/dist/aura/autocomplete/index.mjs</code>. The overlay is teleported into a
          <code>.p-overlay-content</code> wrapper, so a call site that clips its own container with
          <code>overflow: hidden</code> can still cut the list &#8212; <code>appendTo="body"</code> is the escape, at
          the cost of scoping any overlay styling through <code>panelStyleClass</code>.
        </p>

        <h3>Chips: geometry, and the one thing to check at 360px</h3>
        <p>
          A chip is a <code>p-chip</code> inside an <code>li</code>; Aura gives the autocomplete chip three tokens of
          its own &#8212; <code>chip.borderRadius</code> (<code>&#123;border.radius.sm&#125;</code>) plus a focus
          background and focus color per color scheme (<code>surface.200</code> on <code>surface.800</code> light,
          <code>surface.700</code> on <code>surface.0</code> dark) &#8212; everything else it inherits from the Chip
          component: 29px tall, padding 4px/12px, radius <code>&#123;border.radius.sm&#125;</code> (0 in Werkbund, 8px
          Lernwerkstatt, 6px Skizzenbuch, 2px Blaupause), fill <code>&#123;surface.100&#125;</code> light and
          <code>&#123;surface.800&#125;</code> dark (Aura stock palette). The keyboard-focused chip keeps Aura's focus
          tint and gets the kit ring drawn inside it (<code>.p-autocomplete-chip-item.p-focus .p-autocomplete-chip</code>,
          2px <code>--primary-color-fg</code>, offset -2px because the field box clips a few px out): "focus ring",
          inset rows on <code>autocomplete.chip.focus.background</code>, 3.78:1 and up.
        </p>
        <p>
          The chip row wraps rather than scrolls. Two short chips still fit inside the 39px a single-mode field
          occupies, so the growth is invisible until the row breaks &#8212; and then it steps a whole line at a time. On
          a narrow viewport a four-chip selection can become four stacked rows and push the rest of the form off screen.
          If that matters, cap the count, shorten the labels, or move the selection into a list below the field.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide can back &#8212; a criterion not listed is not claimed.
          <strong>Passing:</strong> SC 4.1.2 in single mode (one <code>role="combobox"</code> input, labelable through
          <code>&lt;label for&gt;</code> and <code>inputId</code>); SC 2.4.7 for the dropdown button, both field modes, and the focused chip (the
          kit's 2px <code>--primary-color-fg</code> ring on all four, both modes; "focus ring" in the contrast gate); and
          SC 2.5.8 for the
          field itself &#8212; 33px small, 39px default, 46px large, every size clear of the 24px floor; SC 1.4.3 and
          1.4.11 for the field's text, placeholder, and edge in both modes and every style, the token field's
          <code>--control-border</code> edge and the dropdown icon included (contrast gate, "form field edge" and
          "form field icon"). <strong>Conditional:</strong> SC 4.1.2 in
          multiple mode &#8212; the text box still carries <code>role="combobox"</code>, but it sits inside an option row
          and has no typed pass-through route for a name; the dropdown button's accessible name is empty unless
          <code>dropdownAriaLabel</code> is set; and SC 3.3.1 needs your own error text, because the kit's red
          invalid edge is color, not text.
          <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>AutoCompleteModule</code> exports the component under three selectors (<code>p-autoComplete</code>,
          <code>p-autocomplete</code>, <code>p-auto-complete</code>); prefer the all-lowercase one. It is a
          <code>ControlValueAccessor</code> extending <code>BaseInput</code>, so <code>[(ngModel)]</code>,
          <code>formControlName</code> and the shared <code>size</code> / <code>variant</code> / <code>fluid</code> /
          <code>invalid</code>
          inputs all work.
        </p>

        <h3>The completeMethod contract</h3>
        <p>This is the whole engine, and it has four rules that are easy to break:</p>
        <ol>
          <li>
            <strong>You own the filtering.</strong> The control never filters anything. It emits
            <code>completeMethod</code> with <code>&#123; originalEvent, query &#125;</code> and renders whatever you
            put in <code>[suggestions]</code>.
          </li>
          <li>
            <strong>Assign a new array.</strong> <code>search()</code> raises an internal <code>loading</code> flag
            before emitting, and only the suggestions-changed hook lowers it and opens the overlay (<code
              >openng-optimus-ui-autocomplete.mjs:1340</code
            >
            and <code>:839-848</code>). Pushing into the existing array changes nothing on screen; a code path that
            never assigns leaves the spinner turning for good. Make the failure branch assign an empty array.
          </li>
          <li>
            <strong>Two thresholds gate the call.</strong> <code>minQueryLength</code> (no default of its own; it falls
            back to the still-shipped deprecated <code>minLength</code>, default <code>1</code>) and
            <code>delay</code> (default <code>300</code> ms)
            &#8212; and the query is dropped entirely if it is blank (<code>:1337</code>). Raise both for a remote
            source; lower them only for a local array.
          </li>
          <li>
            <strong>Late answers are not reconciled.</strong> Nothing correlates a response with the query that caused
            it, so a slow request can overwrite a newer one. Discard stale responses yourself &#8212; compare against
            the current query, or use a switch-style operator.
          </li>
        </ol>
        <pre class="code-block"><code>{{ completeSnippet }}</code></pre>

        <h3>Core inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>suggestions</code></td>
                <td>any[]</td>
                <td>The rows to show <em>now</em>. Re-assign it, never mutate it.</td>
              </tr>
              <tr>
                <td><code>optionLabel</code></td>
                <td>string</td>
                <td>Property holding the visible text. Also what <code>forceSelection</code> matches against.</td>
              </tr>
              <tr>
                <td><code>optionValue</code></td>
                <td>string</td>
                <td>Property to write into the model instead of the whole object.</td>
              </tr>
              <tr>
                <td><code>optionDisabled</code></td>
                <td>string</td>
                <td>Property marking a row unselectable.</td>
              </tr>
              <tr>
                <td><code>minQueryLength</code></td>
                <td>number</td>
                <td>
                  Characters before the first query. No default of its own; unset it falls back to the deprecated
                  <code>minLength</code> (default <code>1</code>), which Optimus still ships.
                </td>
              </tr>
              <tr>
                <td><code>delay</code></td>
                <td>number</td>
                <td>Keystroke debounce in ms, default <code>300</code>.</td>
              </tr>
              <tr>
                <td><code>forceSelection</code></td>
                <td>boolean</td>
                <td>Typing stops writing to the model; a non-matching entry is erased on commit. See the pitfalls.</td>
              </tr>
              <tr>
                <td><code>dropdown</code></td>
                <td>boolean</td>
                <td>
                  Adds the trigger button. <code>dropdownMode</code> is <code>'blank'</code> (query the empty string,
                  i.e. show everything) or <code>'current'</code> (re-query what is typed).
                </td>
              </tr>
              <tr>
                <td><code>multiple</code></td>
                <td>boolean</td>
                <td>
                  Model becomes an array; values render as chips. Changes the DOM, the ARIA, and the keyboard model.
                </td>
              </tr>
              <tr>
                <td><code>unique</code></td>
                <td>boolean</td>
                <td>Default <strong>true</strong>: an already-chosen value cannot be added twice.</td>
              </tr>
              <tr>
                <td><code>typeahead</code></td>
                <td>boolean</td>
                <td>
                  Default <code>true</code>. Set <code>false</code> for a pure token field &#8212; then
                  <em>nothing</em> queries and only Enter / <code>separator</code> / <code>addOnBlur</code> /
                  <code>addOnTab</code> add values.
                </td>
              </tr>
              <tr>
                <td><code>separator</code></td>
                <td>string | RegExp</td>
                <td>
                  Commits a chip on that character. Multiple mode with <code>typeahead: false</code> only; also splits
                  pasted text.
                </td>
              </tr>
              <tr>
                <td><code>addOnBlur</code> / <code>addOnTab</code></td>
                <td>boolean</td>
                <td>
                  Commit the pending text when leaving the field / on <kbd>Tab</kbd>. Both default <code>false</code>,
                  so typed-but-uncommitted text is silently lost.
                </td>
              </tr>
              <tr>
                <td><code>completeOnFocus</code></td>
                <td>boolean</td>
                <td>Query once on first focus, before any typing.</td>
              </tr>
              <tr>
                <td><code>autoOptionFocus</code></td>
                <td>boolean</td>
                <td>
                  Default <strong>false</strong>: on open, no row is focused and <code>aria-activedescendant</code> is
                  absent until an arrow key.
                </td>
              </tr>
              <tr>
                <td><code>selectOnFocus</code> / <code>autoHighlight</code></td>
                <td>boolean</td>
                <td>Write the focused row into the model as focus moves. Convenient by mouse, hostile by keyboard.</td>
              </tr>
              <tr>
                <td><code>focusOnHover</code></td>
                <td>boolean</td>
                <td>Default <strong>true</strong>: the mouse moves the keyboard focus index.</td>
              </tr>
              <tr>
                <td><code>group</code></td>
                <td>boolean</td>
                <td>
                  With <code>optionGroupLabel</code> + <code>optionGroupChildren</code> (default <code>'items'</code>).
                  Read the ARIA caveat below.
                </td>
              </tr>
              <tr>
                <td><code>emptyMessage</code></td>
                <td>string</td>
                <td>
                  The "nothing found" row. Note the name: it overrides the library's <code>emptySearchMessage</code>,
                  not its <code>emptyMessage</code>.
                </td>
              </tr>
              <tr>
                <td><code>selectionMessage</code> / <code>emptySelectionMessage</code></td>
                <td>string</td>
                <td>
                  The live region's text, <code>&#123;0&#125;</code> substituted with the number of selected values.
                  These do reach the user. See the i18n tab.
                </td>
              </tr>
              <tr>
                <td><code>searchMessage</code></td>
                <td>string</td>
                <td>
                  <strong>Never rendered in Optimus 2.0.2.</strong> Its only consumer is the empty-results row, which exists
                  only when there are no results &#8212; and in that state the getter takes the
                  <code>emptySearchMessage</code> branch. The result count is therefore never announced.
                </td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  Sets the <code>id</code> of the real input &#8212; and therefore makes
                  <code>&lt;label for&gt;</code> work.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>Land on the same input. Use only where no visible caption exists.</td>
              </tr>
              <tr>
                <td><code>dropdownAriaLabel</code></td>
                <td>string</td>
                <td>
                  The trigger button's accessible name. <strong>No default</strong> &#8212; unset means an unnamed
                  button.
                </td>
              </tr>
              <tr>
                <td><code>showClear</code></td>
                <td>boolean</td>
                <td>Adds a mouse-only clear icon once a value exists.</td>
              </tr>
              <tr>
                <td><code>scrollHeight</code></td>
                <td>string</td>
                <td>Overlay list height, default <code>'200px'</code>.</td>
              </tr>
              <tr>
                <td><code>virtualScroll</code> + <code>virtualScrollItemSize</code></td>
                <td>boolean + number</td>
                <td>For very long result sets; the row size is fixed and required.</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td>signal input</td>
                <td>
                  <code>'body'</code> escapes a clipping ancestor; style the overlay through
                  <code>panelStyleClass</code> afterwards.
                </td>
              </tr>
              <tr>
                <td><code>searchLocale</code></td>
                <td>(see pitfalls)</td>
                <td>
                  Intended as the locale for case-folding in <code>forceSelection</code> matching &#8212; but declared
                  with a boolean transform.
                </td>
              </tr>
              <tr>
                <td>
                  <code>size</code> / <code>variant</code> / <code>fluid</code> / <code>invalid</code> /
                  <code>disabled</code> / <code>required</code> / <code>name</code>
                </td>
                <td>&#8212;</td>
                <td>
                  Inherited from <code>BaseInput</code> and <code>BaseEditableHolder</code>, exactly as on a text input.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs and defaults read from the <code>AutoComplete</code> class in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-autocomplete.mjs</code> (Optimus UI 2.0.2, version from
          <code>node_modules/&#64;openng/optimus-ui/package.json</code>): <code>minLength</code> 210, <code>delay</code> 220,
          <code>scrollHeight</code> 266, <code>unique</code> 336, <code>completeOnFocus</code> 346,
          <code>showEmptyMessage</code> 361, <code>dropdownMode</code> 366, <code>addOnTab</code> 376,
          <code>optionGroupChildren</code> 418, <code>autoOptionFocus</code> 477, <code>focusOnHover</code> 497,
          <code>typeahead</code> 503, <code>addOnBlur</code> 509.
        </p>

        <h3>Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>Payload</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>completeMethod</code></td>
                <td><code>&#123; originalEvent, query &#125;</code></td>
                <td>A query is due. Your only cue to fetch.</td>
              </tr>
              <tr>
                <td><code>onSelect</code> / <code>onUnselect</code></td>
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>A suggestion was chosen / a chip was removed.</td>
              </tr>
              <tr>
                <td><code>onAdd</code></td>
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>A value the user <em>typed</em> was committed (separator, Enter, blur, Tab, paste).</td>
              </tr>
              <tr>
                <td><code>onClear</code></td>
                <td>&#8212;</td>
                <td>The clear icon was used, or single-mode text was emptied.</td>
              </tr>
              <tr>
                <td><code>onDropdownClick</code></td>
                <td><code>&#123; originalEvent, query &#125;</code></td>
                <td>The trigger button was pressed.</td>
              </tr>
              <tr>
                <td><code>onShow</code> / <code>onHide</code></td>
                <td>&#8212;</td>
                <td>Overlay opened / closed.</td>
              </tr>
              <tr>
                <td><code>onFocus</code> / <code>onBlur</code></td>
                <td>Event</td>
                <td>The input gained / lost focus.</td>
              </tr>
              <tr>
                <td><code>onInputKeydown</code> / <code>onKeyUp</code></td>
                <td>KeyboardEvent</td>
                <td>Raw key events, emitted before the component's own handling.</td>
              </tr>
              <tr>
                <td><code>onLazyLoad</code></td>
                <td>Scroller event</td>
                <td>Virtual scroll needs another slice.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Templates</h3>
        <p>
          Optimus queries these by <strong>template reference name</strong> &#8212;
          <code>&lt;ng-template #item let-option&gt;</code> &#8212; and, because the v21 <code>PrimeTemplate</code>
          content query survives in this fork, still accepts the legacy
          <code>pTemplate="item"</code> form. Pick one style per project.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Replaces</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#item</code></td>
                <td>One suggestion row. Context: the option, plus <code>index</code>.</td>
              </tr>
              <tr>
                <td><code>#selecteditem</code></td>
                <td>
                  The content of a chip in multiple mode. It has no effect in single mode &#8212; there the input shows
                  plain text.
                </td>
              </tr>
              <tr>
                <td><code>#group</code></td>
                <td>A group header row.</td>
              </tr>
              <tr>
                <td><code>#header</code> / <code>#footer</code></td>
                <td>Chrome above / below the list.</td>
              </tr>
              <tr>
                <td><code>#empty</code></td>
                <td>The "nothing found" row, replacing <code>emptyMessage</code>.</td>
              </tr>
              <tr>
                <td><code>#loader</code></td>
                <td>Virtual-scroll skeleton rows.</td>
              </tr>
              <tr>
                <td>
                  <code>#removeicon</code>, <code>#clearicon</code>, <code>#dropdownicon</code>,
                  <code>#loadingicon</code>
                </td>
                <td>The four icons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ templateSnippet }}</code></pre>
        <p class="src-note">
          Slot names from the component's content queries (<code>itemTemplate</code>, <code>selectedItemTemplate</code>,
          <code>groupTemplate</code>, <code>headerTemplate</code>, <code>footerTemplate</code>,
          <code>emptyTemplate</code>, <code>loaderTemplate</code>, <code>removeIconTemplate</code>,
          <code>clearIconTemplate</code>, <code>dropdownIconTemplate</code>, <code>loadingIconTemplate</code>) in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-autocomplete.mjs</code>.
        </p>

        <h3>Theming with CSS custom properties</h3>
        <p>
          Every token is exposed as <code>--p-autocomplete-*</code>, but the root tokens (border, background, padding,
          radius, placeholder, focus ring) paint only the <strong>multiple-mode</strong> box. The single-mode input is a
          <code>pInputText</code> and reads <code>--p-inputtext-*</code> instead &#8212; theme it as the Text Inputs
          guide describes, including the style rule that fixes its border color.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom property</th>
                <th>Controls</th>
                <th>Wins in this kit?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>--p-autocomplete-border-radius</code>, <code>-padding-x</code> / <code>-y</code>,
                  <code>-border-color</code>, <code>-placeholder-color</code>
                </td>
                <td>The multiple-mode box.</td>
                <td>
                  Border color: no, the kit declares it on the element (<code>--control-border</code>); placeholder
                  color: in light only, dark declares it on the element too (<code>--control-placeholder</code>); the
                  others yes there. No effect on the single-mode input.
                </td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-dropdown-width</code></td>
                <td>Trigger button column (and the loader inset).</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>
                  <code>--p-autocomplete-option-padding</code> / <code>--p-autocomplete-option-border-radius</code>
                </td>
                <td>Suggestion rows.</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-chip-border-radius</code></td>
                <td>Chip corners in multiple mode.</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-invalid-border-color</code></td>
                <td>Invalid border.</td>
                <td>
                  No: the kit declares it on the element (<code>--semantic-red-fg</code>). It paints the multiple-mode
                  box only; the single-mode input takes the kit's <code>input.p-inputtext.p-invalid</code> red.
                </td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-focus-ring-width</code> and friends</td>
                <td>Focus outline of the multiple-mode box.</td>
                <td>
                  No need here: the kit's <code>.p-autocomplete.p-focus</code> rule draws the ring with
                  <code>!important</code>. Outside the kit, yes from an ancestor (Aura ships width <code>0</code>).
                </td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-dropdown-focus-ring-width</code></td>
                <td>Trigger button outline.</td>
                <td>
                  No: the kit's ring rule (<code>.p-autocomplete-dropdown:focus-visible</code>, <code>!important</code>)
                  wins. Outside the kit it is Aura's non-zero 1px global ring.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix is configured in <code>app.config.ts</code> (<code>provideOptimus</code> theme
          options). Setting these on <code>:root</code> does not work &#8212; see the Design tab for the runtime
          <code>&lt;style&gt;</code> element that outranks it.
        </p>

        <h3>Forms</h3>
        <p>
          A real <code>&lt;input&gt;</code> is rendered, so unlike <code>p-select</code> this control does participate
          in a native form &#8212; it carries <code>name</code>, <code>required</code>, <code>readonly</code>,
          <code>minlength</code>, <code>maxlength</code> and <code>pattern</code> straight through from
          <code>BaseInput</code>. What it does <em>not</em> do is guarantee the Angular model matches the visible text:
          in the default configuration the model is whatever was typed, and with <code>forceSelection</code> the model
          is only ever a chosen object while the input may briefly hold text that is about to be erased. Validate the
          model, never the input.
        </p>

        <h3>Pitfalls</h3>
        <ul>
          <li>
            <strong>The mutated suggestions array.</strong> The overlay opens as a reaction to a new reference; an
            in-place <code>push</code> shows nothing and leaves the spinner running.
          </li>
          <li>
            <strong><code>forceSelection</code> matches exactly, not loosely.</strong>
            <code>isOptionMatched</code> compares the full lower-cased <code>optionLabel</code> with the full
            lower-cased input (<code>openng-optimus-ui-autocomplete.mjs:918</code>), against the
            <em>currently visible</em> suggestions. A user who types a real city faster than the request returns gets
            their text erased anyway.
          </li>
          <li>
            <strong><code>minQueryLength</code> of <code>0</code> is read inconsistently.</strong> The typing path uses
            <code>minQueryLength || minLength</code> (<code>:955</code>) so <code>0</code> falls through to
            <code>1</code>, while the <code>forceSelection</code> path uses <code>??</code> (<code>:1379</code>) and
            honors it. PrimeNG 22 removed <code>minLength</code>; Optimus keeps the v21 pair, so the asymmetry is back
            in its original form.
          </li>
          <li>
            <strong><code>searchLocale</code> cannot receive a locale.</strong> It is declared with a boolean transform,
            so <code>searchLocale="de-DE"</code> arrives as <code>true</code>; the <code>toLocaleLowerCase</code> call
            then silently falls back to the runtime default locale. Do not rely on it for Turkish dotted/dotless
            <em>i</em> or similar &#8212; normalize your labels instead.
          </li>
          <li>
            <strong><code>#selecteditem</code> does nothing in single mode.</strong> The trigger is an input; it can
            only hold text.
          </li>
          <li>
            <strong>Uncommitted text disappears.</strong> In a token field, text still in the box when the user leaves
            is discarded unless <code>addOnBlur</code> (or <code>addOnTab</code>) is set.
          </li>
          <li>
            <strong><code>focusOnHover</code> is on by default</strong>, so a stray mouse can move the row that
            <kbd>Enter</kbd> will accept.
          </li>
          <li>
            <strong>Overlay clipped by an <code>overflow: hidden</code> ancestor</strong> &#8594;
            <code>appendTo="body"</code>.
          </li>
        </ul>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>Naming: the opposite of the Select guide</h4>
        <p>
          The focusable element here is a real <code>&lt;input&gt;</code>, and an input is a labelable element &#8212;
          so the pattern that silently fails on a <code>p-select</code> is the correct one here:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Accessible name</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>The caption &#8212; measured "City"</td>
                <td>
                  <strong>Works &#8212; prefer it.</strong> A visible caption that is also the programmatic name, and
                  clicking it focuses the field.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>The string you pass</td>
                <td>
                  <strong>Works.</strong> Both are bound onto the same input. Use only when there genuinely is no
                  visible caption.
                </td>
              </tr>
              <tr>
                <td><code>[attr.aria-label]</code> on <code>&lt;p-autocomplete&gt;</code></td>
                <td>Unchanged &#8212; the host attribute does not enter the name (accessibility tree)</td>
                <td><strong>Fails.</strong> The attribute lands on the roleless host wrapper, not on the combobox.</td>
              </tr>
              <tr>
                <td><code>placeholder</code> only</td>
                <td><strong>The placeholder text</strong> &#8212; whatever the hint says</td>
                <td>
                  <strong>Fails in practice.</strong> Not because the name is empty &#8212; <code>placeholder</code> is
                  the last-resort fallback in the accessible-name computation, so it <em>is</em> announced &#8212; but
                  because that name leaves the screen on the first keystroke, and a hint is not a label.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>ariaLabel</code> / <code>ariaLabelledBy</code> / <code>inputId</code> are all bound onto the
          <code>#focusInput</code> element (<code>openng-optimus-ui-autocomplete.mjs:1590-1634</code>, Optimus UI 2.0.2); the host
          receives only the root class and style bindings. Verify in your own build: the combobox node's accessible name
          must be the caption, and the dropdown button must have a name of its own.
        </p>
        <p>
          The same asymmetry decides how a hint or an error message is linked. There is no
          <code>ariaDescribedBy</code> input, and an <code>aria-describedby</code> attribute on the host is as invisible
          as an <code>aria-label</code> there. The supported route is the pass-through:
          <code
            >[pt]="&#123; pcInputText: &#123; root: &#123; 'aria-describedby': 'city-rule' &#125; &#125; &#125;"</code
          >. Note the nested <code>root</code>: <code>pcInputText</code> forwards to the
          <code>pInputText</code> directive, whose own pass-through shape is <code>&#123; root &#125;</code>
          (<code>InputTextPassThroughOptions</code>), so a flat attribute bag there does not type-check. The same
          applies to
          <code>aria-invalid</code>, which <code>[invalid]</code> does not set &#8212; it only adds the state class.
        </p>
        <p>
          <strong>That route covers single mode only.</strong> The multiple-mode input is bound with
          <code>[pBind]="ptm('input')"</code> (<code>openng-optimus-ui-autocomplete.mjs:1693</code>), and <code>input</code> is
          not a key of <code>AutoCompletePassThroughOptions</code> &#8212; which offers <code>root</code>,
          <code>pcInputText</code>, <code>inputMultiple</code>, <code>chipItem</code>, <code>pcChip</code>,
          <code>chipIcon</code>, <code>inputChip</code> and the overlay parts, but nothing that resolves onto the token
          field's own <code>&lt;input&gt;</code>. So <code>pcInputText</code> silently reaches nothing there, and there
          is <em>no</em> typed pass-through for <code>aria-describedby</code> or <code>aria-invalid</code> on a chips
          control. Put the constraint in the label text instead, and express invalidity as a message the sighted and the
          screen-reader user both get.
        </p>

        <h4>The combobox pattern, measured against APG</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>APG expects</th>
                <th>Optimus UI 2.0.2 renders</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>role="combobox"</code> on the text input</td>
                <td><code>role="combobox"</code> on the <code>&lt;input&gt;</code> itself</td>
                <td>Met</td>
              </tr>
              <tr>
                <td><code>aria-autocomplete="list"</code></td>
                <td>Static attribute on the input</td>
                <td>Met</td>
              </tr>
              <tr>
                <td><code>aria-expanded</code> tracks the popup</td>
                <td><code>"false"</code> closed, <code>"true"</code> open</td>
                <td>Met</td>
              </tr>
              <tr>
                <td><code>aria-controls</code> names the listbox while open</td>
                <td><code>&lt;id&gt;_list</code> while open; the attribute is removed when closed</td>
                <td>Met</td>
              </tr>
              <tr>
                <td><code>aria-activedescendant</code> names the visually focused option</td>
                <td>Absent on open; after <kbd>↓</kbd> it holds the focused row's id</td>
                <td>
                  Met, with a caveat: <code>autoOptionFocus</code> is <code>false</code> by default, so no row is
                  focused until an arrow key.
                </td>
              </tr>
              <tr>
                <td>the popup's children are <code>option</code> or <code>group</code></td>
                <td>
                  Rows are <code>li[role=option]</code> with <code>aria-setsize</code> / <code>aria-posinset</code> /
                  <code>aria-selected</code> &#8212; but so are group headers and the empty row
                </td>
                <td><strong>Not met</strong> when <code>[group]</code> is on, and not met by the empty-message row.</td>
              </tr>
              <tr>
                <td>a combobox is not a descendant of an <code>option</code></td>
                <td>
                  In multiple mode the input sits in <code>li[role=option]</code> inside the chip
                  <code>ul[role=listbox]</code>
                </td>
                <td><strong>Not met</strong> &#8212; a nested-role defect you cannot fix from a call site.</td>
              </tr>
              <tr>
                <td>result counts announced politely</td>
                <td>One <code>span[role=status][aria-live=polite]</code>, inside the overlay</td>
                <td>
                  Partly: the region only exists while the overlay is open, and it carries the
                  <em>selection</em> message, not the result count.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Keyboard &#8212; single mode</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Closed</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>Focus in / out; the field is a normal tab stop.</td>
                <td>Accepts the focused row if there is one, then moves on.</td>
              </tr>
              <tr>
                <td><kbd>↓</kbd> / <kbd>↑</kbd></td>
                <td>Opens the list if suggestions exist; does not change the value.</td>
                <td>Next / previous row.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>Caret to start / end of the text (with <kbd>Shift</kbd>, selects).</td>
                <td>Same &#8212; they operate on the text, not the list.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>&#8212;</td>
                <td>Scrolls the list to first / last row.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Nothing (the form may submit).</td>
                <td>Accepts the focused row and closes.</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>&#8212;</td>
                <td>Closes and returns focus to the input.</td>
              </tr>
              <tr>
                <td><kbd>←</kbd> / <kbd>→</kbd></td>
                <td>Move the caret.</td>
                <td>Move the caret and drop the row focus.</td>
              </tr>
              <tr>
                <td><kbd>Backspace</kbd></td>
                <td>Edits the text like any input.</td>
                <td>Same.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Keyboard &#8212; multiple mode, and how a chip is removed</h4>
        <ul>
          <li>
            <strong><kbd>Backspace</kbd> in an empty text box removes the last chip</strong> and emits
            <code>onUnselect</code> (<code>openng-optimus-ui-autocomplete.mjs:1284-1290</code>).
          </li>
          <li>
            <strong><kbd>←</kbd> in an empty text box steps into the chip row</strong> (<code>:1159</code>), which is a
            <code>ul</code> with <code>tabindex="-1"</code> &#8212; reachable this way only, never by <kbd>Tab</kbd>.
            From there <kbd>←</kbd> / <kbd>→</kbd> walk the chips (the focused one shows the kit ring inside it) and
            <kbd>Backspace</kbd> removes the focused one
            (<code>:986</code>, <code>:1280</code>); <kbd>Delete</kbd> is not handled. Focus returns to the text box
            afterwards (<code>:1315</code>).
          </li>
          <li>
            <strong>The chip's own remove icon is mouse-only</strong> &#8212; a bare <code>&lt;span&gt;</code> with a
            click handler: no <code>role</code>, no <code>tabindex</code>, so it is neither focusable nor announced as
            an action (its inner SVG is <code>aria-hidden</code>). There is no call-site fix; the keyboard paths above
            are the whole story, so do not describe the little cross as the way to remove a value.
          </li>
          <li>
            <strong>Each chip is an <code>option</code> with <code>aria-selected="true"</code></strong> in a horizontal
            listbox, named by <code>aria-label</code> from <code>optionLabel</code>. Give every chip a label that makes
            sense out of context, because that is the only text a screen reader gets.
          </li>
        </ul>

        <h4>Known upstream gaps &#8212; do not paper over them silently</h4>
        <ul>
          <li>
            <strong>Group headers and the empty row are options</strong> (<code>openng-optimus-ui-autocomplete.mjs:1791</code>,
            <code>:1827</code>), so they are counted and announced as choosable. Prefer flat result lists; if grouping
            is essential, keep the number of groups small.
          </li>
          <li>
            <strong>The dropdown button can be nameless.</strong> <code>dropdownAriaLabel</code> has no default and no
            translation-service fallback &#8212; an unset one ships a button with no accessible name.
          </li>
          <li>
            <strong>The clear icon is unreachable by keyboard</strong>, so <code>showClear</code> is a mouse affordance
            only. Keyboard users clear by selecting the text and deleting it.
          </li>
          <li>
            <strong>A combobox inside an option</strong> in multiple mode (see the APG table), and a chip-container
            <code>listbox</code> whose last child is an unnamed <code>option</code> wrapping that input.
          </li>
          <li>
            <strong>Outside this kit, no ring on either field mode</strong> &#8212; Aura zeroes the field ring; the
            kit already draws one on both modes, and the Design tab has the tokens to restore it elsewhere.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            ☐ A visible caption exists and is bound with <code>&lt;label for&gt;</code> + <code>inputId</code> (or, only
            if there is no caption, <code>ariaLabel</code>).
          </li>
          <li>☐ <code>placeholder</code> is a hint, not the label.</li>
          <li>
            ☐ <code>[dropdown]="true"</code> unless the user provably knows the vocabulary &#8212; and then
            <code>dropdownAriaLabel</code> is set and translated.
          </li>
          <li>
            ☐ The model type is honest: <code>string</code> if free text is allowed, your object if not &#8212; and if
            not, <code>forceSelection</code> or a validator enforces it.
          </li>
          <li>
            ☐ With <code>forceSelection</code>: a visible rule, linked to the input with
            <code>[pt]="&#123; pcInputText: &#123; root: &#123; 'aria-describedby': … &#125; &#125; &#125;"</code>
            &#8212; single mode only; a token field has no typed pass-through to its input, so the rule has to live in
            the label. Either way, a rejected entry is erased without a message.
          </li>
          <li>☐ <code>completeMethod</code> assigns a <em>new</em> array on every path, including the error path.</li>
          <li>☐ Focus is visible on the field in <strong>both</strong> themes &#8212; check it, do not assume it.</li>
          <li>
            ☐ Keyboard: reachable by <kbd>Tab</kbd>; <kbd>↓</kbd> opens, <kbd>Enter</kbd> accepts, <kbd>Esc</kbd> closes
            and keeps focus.
          </li>
          <li>
            ☐ Multiple mode: every chip's label reads sensibly alone, and removal is documented as
            <kbd>Backspace</kbd> (the icon is mouse-only).
          </li>
          <li>
            ☐ <code>emptyMessage</code> and the two selection messages are translated; a language switch rebuilds them.
          </li>
          <li>☐ The suggestion row shows whatever disambiguates two similar labels.</li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) pinning the two rules most likely to regress &#8212; the label
          really names the combobox, and the trigger button really has a name:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Your strings</h3>
        <ul>
          <li>
            <strong>The label and the placeholder</strong> &#8212; the label carries the meaning, the placeholder at
            most an example of the input shape ("Start typing a city"), never the field's name.
          </li>
          <li>
            <strong><code>emptyMessage</code></strong> &#8212; the "nothing found" row. Word it as a next step, not a
            dead end: name what was searched and what to try.
          </li>
          <li>
            <strong><code>dropdownAriaLabel</code></strong> &#8212; the trigger button's only accessible name. There is
            no default, so an untranslated call site ships a nameless button.
          </li>
          <li>
            <strong>Suggestion labels are content.</strong> If your rows are translated, build them through the kit's
            <code>TranslationService</code> inside the <code>completeMethod</code> handler (or a
            <code>computed()</code> source) so a language switch rebuilds them; a list captured once goes stale.
          </li>
          <li>
            <strong><code>selectionMessage</code> and <code>emptySelectionMessage</code></strong> &#8212;
            screen-reader-only status strings with a <code>&#123;0&#125;</code> count placeholder, announced through the
            overlay's live region. They are yours to translate too; see the next section for why the kit's library
            bridge does not do it for you. (<code>searchMessage</code> looks like a third one, but nothing renders it
            &#8212; see the table.)
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>One library string is localized for you; four are not</h3>
        <p>
          Optimus keeps its own translation bundle, and this component reads
          <strong>five</strong> strings from it &#8212; but they live in two different places, and only one of them is
          on the path this kit already maintains.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Library key</th>
                <th>English default</th>
                <th>Localized by this kit?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name of the suggestion listbox</td>
                <td><code>aria.listLabel</code></td>
                <td><code>'Option List'</code></td>
                <td>
                  <strong>Yes</strong> &#8212; the kit pushes its own
                  <code>assets/i18n/modules/&lt;lang&gt;/optimus.json</code> into the <code>aria</code> block on every
                  language change.
                </td>
              </tr>
              <tr>
                <td>"N results are available"</td>
                <td><code>searchMessage</code></td>
                <td><code>'Search results are available'</code></td>
                <td>
                  <strong>Moot &#8212; not rendered by this component in Optimus 2.0.2.</strong> The only markup that reads it
                  is the empty-results row, and that row renders only when the result count is zero, where the getter
                  falls to <code>emptySearchMessage</code>. Translating it changes nothing; the result count is never
                  announced at all, which is the SC 4.1.3 gap named in Usage &#8594; Sources.
                </td>
              </tr>
              <tr>
                <td>Nothing found</td>
                <td><code>emptySearchMessage</code></td>
                <td><code>'No results found'</code></td>
                <td>No. Note the input that overrides it is called <code>emptyMessage</code>.</td>
              </tr>
              <tr>
                <td>"N items selected"</td>
                <td><code>selectionMessage</code></td>
                <td><code>'&#123;0&#125; items selected'</code></td>
                <td>No. Also unpluralized in English.</td>
              </tr>
              <tr>
                <td>Nothing selected</td>
                <td><code>emptySelectionMessage</code></td>
                <td><code>'No selected item'</code></td>
                <td>No.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The split is visible in one screenshot's worth of DOM. With the kit running in German, the suggestion list
          carries <code>aria-label="Optionsliste"</code> &#8212; the kit's own string, pushed through the
          <code>aria</code> block &#8212; while the live region in the same overlay reads
          <em>"No selected item"</em> and, after one pick, <em>"1 items selected"</em>. Two announcements from one
          component, one translated and one not, plus an unpluralized English count. Everything a screen-reader user
          hears here that you did not write yourself is in the wrong language.
        </p>
        <p class="src-note">
          Defaults from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-config.mjs</code> (<code>:169-172</code> for the four root-level
          messages, <code>:227</code> for <code>aria.listLabel</code>); the component's own resolution order is "your
          input, then the library translation, then an empty string"
          (<code>openng-optimus-ui-autocomplete.mjs:737-753</code>).
          The consequence for a multilingual app: the four root-level strings are reachable through
          <code>Optimus.setTranslation</code> as well, but they are <em>not</em> in the <code>aria</code> block the kit
          already re-pushes, so either extend that push or pass the four inputs per call site. Passing the inputs is the
          smaller change and the one the snippet above shows.
        </p>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>

        <h3>Matching across languages</h3>
        <ul>
          <li>
            <strong>You own the matching, so you own the folding.</strong> There is no
            <code>filterMatchMode</code> here: your <code>completeMethod</code> decides whether "osterreich" finds
            "Österreich". Normalize both sides (<code>String.prototype.normalize</code> plus a diacritic strip) rather
            than relying on <code>includes</code>.
          </li>
          <li>
            <strong><code>forceSelection</code> folds case with a locale you cannot set</strong> &#8212; the
            <code>searchLocale</code> input is declared with a boolean transform, so the comparison silently uses the
            runtime default locale. In languages where case folding is locale-dependent, compare normalized keys of your
            own instead of trusting the label match.
          </li>
          <li>
            <strong>Rank per language.</strong> A prefix-match-first ranking that works in English can be wrong in a
            language where the meaningful word comes last; sort with <code>localeCompare</code> in the active language
            when you fall back to alphabetical.
          </li>
        </ul>

        <h3>Length and layout</h3>
        <p>
          German suggestion labels run 20&#8211;40% longer than English, and the two modes fail differently: the
          single-mode input shows one line of text that scrolls horizontally under the caret, while the multiple-mode
          chip row <em>wraps</em> and grows the control downward. Give the field an explicit width, test the longest
          language you ship, and check a three-chip selection at 360px before calling it done.
        </p>

        <h3>RTL</h3>
        <p>
          The overlay, the clear icon, and the dropdown button are positioned with logical properties, so they mirror
          under <code>direction: rtl</code> without per-call-site work. Nothing here is wired today &#8212; the kit
          ships LTR languages only &#8212; and the chip row's wrapping order has not been verified against a rendered
          RTL locale.
        </p>
        <p class="src-note">
          Read from the shipped stylesheet rules for the autocomplete's dropdown and clear-icon parts. Not verified
          against a rendered RTL locale.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the keyboard-focused
            chip takes the kit ring inside it (gated, "focus ring" inset rows), the dark multiple-mode box fills
            <code>--surface-section</code> with the fields' text and placeholder, and the token field's edge range is
            re-cited (3.25&#8211;5.51:1).
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the token field and the
            dropdown button now have the kit's 2px ring (the active suggestion row too, drawn inside it), the token
            field the <code>--control-border</code> edge, and
            both modes draw the
            <code>--semantic-red-fg</code> invalid edge, <code>[invalid]</code> alone included. The state table, theming
            table, pitfalls, and WCAG roll-up say so (the SC 1.4.11 failure is gone), cited from "form field edge".
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016). The state matrix,
            overlay and chip values, theming table, and WCAG roll-up describe today's kit: the dark
            <code>.p-inputtext</code> rule re-points tokens (single-mode hover, focus, invalid, and disabled render again),
            the kit ring covers the single-mode input in both modes, and every style's
            <code>input.p-inputtext</code> rule suppresses the <code>[invalid]</code> border tint in single mode. The
            theming table now says which tokens reach which mode (the single-mode input reads
            <code>--p-inputtext-*</code>). Single-mode edge and placeholder ratios cited from the contrast gate; the token field's stock edge
            stated as under 3:1. Four library line references corrected; radii per style; the agent doc
            trimmed under the size aim.
          </li>
          <li>
            <strong>v0.4</strong> &#8212; 2026-09-02 &#8212; Re-based on Optimus UI 2.0.2 (ADR-0014): two of the three
            v22 fixes recorded in v0.3 are gone again &#8212; the deprecated <code>minLength</code> is back (and
            <code>minQueryLength</code> now has no default of its own) and <code>searchLocale</code> is back on its
            boolean transform; <code>[invalid]</code> still reaches the token field, but through
            <em>both</em> the <code>.p-autocomplete.p-invalid</code> style and a re-added
            <code>.ng-invalid.ng-dirty</code> block. <code>loading</code> is a plain property again, and every line
            reference was re-derived against the Optimus bundles; Aura tokens re-read on the 2.x preset
            (<code>&#123;red.400&#125;</code>/<code>&#123;red.300&#125;</code>, zeroed
            <code>form.field.focus.ring.*</code>).
          </li>
          <li>
            <strong>v0.3</strong> &#8212; 2026-08-23 &#8212; Re-verified against PrimeNG 22.1. Two upstream fixes
            recorded: <code>[invalid]</code> now reaches the token field (<code>.p-invalid</code> class keying replaced
            the <code>.ng-invalid.ng-dirty</code> detour) and <code>searchLocale</code> lost its boolean transform. The
            deprecated <code>minLength</code> was removed (the <code>minQueryLength: 0</code> asymmetry survives). The
            kit focus story updated: the single-mode input is covered by the kit's focus-ring family rule
            (browser-verified), the token field still is not. <code>searchMessage</code> still never renders. Line refs
            re-derived against 22.1.2.
          </li>
          <li>
            <strong>v0.2</strong> &#8212; 2026-08-20 &#8212; WCAG 2.2 status roll-up added to the design tab: measured
            criteria summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> &#8212; 2026-07-30 &#8212; Initial guide: the select-versus-autocomplete decision
            table, a live playground, three rendered Do/Don't pairs, the per-mode design and ARIA measurements, and the
            canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .lead {
        max-width: 46rem;
        line-height: 1.6;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-5);
      }
      h3 {
        margin: 1.5rem 0 0.6rem;
        font-size: 1.05rem;
        color: var(--text-color);
      }
      h4 {
        margin: 1.2rem 0 0.5rem;
        font-size: 0.95rem;
        color: var(--text-color);
      }
      p,
      li {
        line-height: 1.6;
        color: var(--text-color);
      }
      ul,
      ol {
        padding-left: 1.4rem;
        margin: 0 0 1rem;
      }
      li {
        margin: 0.35rem 0;
      }
      kbd {
        font-family: var(--font-mono);
        font-size: 0.8em;
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-bottom-width: 2px;
        border-radius: var(--radius-sm);
        padding: 0.05em 0.4em;
      }
      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        background: var(--surface-section);
        border-radius: var(--radius-sm);
        padding: 0.1em 0.35em;
      }
      .src-note {
        max-width: 46rem;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0.4rem 0 1.2rem;
      }

      /* --- Playground --- */
      .pg {
        margin: 0 0 var(--space-6);
        padding: var(--space-5);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .pg__grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--space-5);
        margin-bottom: var(--space-4);
      }
      .pg__controls {
        border: 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .pg__controls legend {
        padding: 0;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        margin-bottom: var(--space-1);
      }
      .pg__field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .pg__label,
      .pg__field label {
        font-size: 0.85rem;
        color: var(--text-color);
        font-weight: var(--font-weight-medium);
      }
      .pg__field--switch {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .pg__field--switch label {
        flex: 1;
      }
      .pg__field p-select {
        width: 100%;
      }
      .pg__preview {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .pg__preview-label,
      .pg__code-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .pg__hint {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .pg__stage {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        min-height: 8rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .pg__stage p-autocomplete {
        width: 100%;
        max-width: 22rem;
      }
      @media (max-width: 640px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Examples --- */
      .ex {
        margin: 0 0 var(--space-6);
      }
      .ex__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-1);
      }
      .ex__title {
        margin: 0;
        font-size: 1rem;
      }
      .ex__note {
        margin: 0 0 var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .ex__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--space-4);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-section);
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        min-width: 14rem;
      }
      .field--wide {
        flex: 1 1 20rem;
      }
      .field p-autocomplete {
        width: 100%;
      }
      .field__hint {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .field__hint--error {
        color: var(--semantic-red-fg);
      }
      .sizes {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        width: 100%;
        max-width: 22rem;
      }
      .sizes__row {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .sizes__row p-autocomplete {
        width: 100%;
      }
      .opt {
        display: inline-flex;
        align-items: baseline;
        gap: 0.5rem;
      }
      .opt__meta {
        font-size: 0.8em;
        color: var(--text-color-secondary);
      }

      /* --- Do / Don't --- */
      .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .dd__cell {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        padding: var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }
      .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg, #15803d);
      }
      .dd__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
      }
      .dd__stage .field {
        min-width: 0;
        width: 100%;
      }
      .dd__why {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: var(--font-weight-medium);
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }
      .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }
      .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg, #15803d) 16%, transparent);
        color: var(--semantic-green-fg, #15803d);
      }
      @media (max-width: 640px) {
        .dd {
          grid-template-columns: 1fr;
        }
      }

      .checklist {
        list-style: none;
        padding-left: 0;
      }
      .checklist li {
        margin: 0.3rem 0;
      }

      .copy-btn {
        appearance: none;
        flex: 0 0 auto;
        padding: 0.35rem 0.8rem;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: var(--font-weight-medium);
        color: var(--primary-color-fg);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: border-color 0.15s ease;
      }
      .copy-btn:hover {
        border-color: var(--primary-color-fg);
      }
      .copy-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }
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
      .table-wrap {
        overflow-x: auto;
        margin: 0 0 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      th,
      td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
        vertical-align: top;
      }
      th {
        color: var(--text-color-secondary);
        font-weight: var(--font-weight-medium);
      }
      .sources a,
      .history strong {
        color: var(--primary-color-fg);
      }
      @media (prefers-reduced-motion: reduce) {
        .copy-btn {
          transition: none;
        }
      }
    `,
  ],
})
export class AutoCompleteArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;
  private asyncTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
      if (this.asyncTimer !== null) clearTimeout(this.asyncTimer);
    });
  }

  /**
   * `aria-describedby` and `aria-invalid` must reach the INPUT, not the host:
   * the `<p-autocomplete>` element is roleless, so an attribute on it is never
   * read. `ptm('pcInputText')` resolves the `pcInputText` section of the `pt`
   * input onto that element (openng-optimus-ui-basecomponent.mjs:353), which is the only
   * supported route from a call site. Held as fields so the reference stays
   * stable under OnPush.
   */
  readonly ptForceHint = { pcInputText: { root: { 'aria-describedby': 'ex-force-hint' } } };
  readonly ptDdForceHint = { pcInputText: { root: { 'aria-describedby': 'dd-force-good-hint' } } };
  readonly ptInvalid = {
    pcInputText: { root: { 'aria-describedby': 'ex-invalid-msg', 'aria-invalid': 'true' } },
  };

  // --- Suggestion source -----------------------------------------------------
  /**
   * A list long enough that a dropdown would be the wrong control, and shaped so
   * an option row has something to disambiguate with.
   */
  readonly allCities: City[] = [
    { name: 'Amsterdam', region: 'Netherlands' },
    { name: 'Antwerp', region: 'Belgium' },
    { name: 'Athens', region: 'Greece' },
    { name: 'Barcelona', region: 'Spain' },
    { name: 'Basel', region: 'Switzerland' },
    { name: 'Belgrade', region: 'Serbia' },
    { name: 'Bergen', region: 'Norway' },
    { name: 'Berlin', region: 'Germany' },
    { name: 'Bilbao', region: 'Spain' },
    { name: 'Bologna', region: 'Italy' },
    { name: 'Bordeaux', region: 'France' },
    { name: 'Bratislava', region: 'Slovakia' },
    { name: 'Bremen', region: 'Germany' },
    { name: 'Brno', region: 'Czechia' },
    { name: 'Bruges', region: 'Belgium' },
    { name: 'Brussels', region: 'Belgium' },
    { name: 'Bucharest', region: 'Romania' },
    { name: 'Budapest', region: 'Hungary' },
    { name: 'Cologne', region: 'Germany' },
    { name: 'Copenhagen', region: 'Denmark' },
    { name: 'Dresden', region: 'Germany' },
    { name: 'Dublin', region: 'Ireland' },
    { name: 'Edinburgh', region: 'United Kingdom' },
    { name: 'Florence', region: 'Italy' },
    { name: 'Frankfurt', region: 'Germany' },
    { name: 'Geneva', region: 'Switzerland' },
    { name: 'Gothenburg', region: 'Sweden' },
    { name: 'Graz', region: 'Austria' },
    { name: 'Hamburg', region: 'Germany' },
    { name: 'Helsinki', region: 'Finland' },
    { name: 'Innsbruck', region: 'Austria' },
    { name: 'Krakow', region: 'Poland' },
    { name: 'Leipzig', region: 'Germany' },
    { name: 'Lisbon', region: 'Portugal' },
    { name: 'Ljubljana', region: 'Slovenia' },
    { name: 'London', region: 'United Kingdom' },
    { name: 'Lyon', region: 'France' },
    { name: 'Madrid', region: 'Spain' },
    { name: 'Malmo', region: 'Sweden' },
    { name: 'Marseille', region: 'France' },
    { name: 'Milan', region: 'Italy' },
    { name: 'Munich', region: 'Germany' },
    { name: 'Naples', region: 'Italy' },
    { name: 'Nice', region: 'France' },
    { name: 'Oslo', region: 'Norway' },
    { name: 'Paris', region: 'France' },
    { name: 'Porto', region: 'Portugal' },
    { name: 'Prague', region: 'Czechia' },
    { name: 'Reykjavik', region: 'Iceland' },
    { name: 'Riga', region: 'Latvia' },
    { name: 'Rome', region: 'Italy' },
    { name: 'Rotterdam', region: 'Netherlands' },
    { name: 'Salzburg', region: 'Austria' },
    { name: 'Seville', region: 'Spain' },
    { name: 'Sofia', region: 'Bulgaria' },
    { name: 'Stockholm', region: 'Sweden' },
    { name: 'Stuttgart', region: 'Germany' },
    { name: 'Tallinn', region: 'Estonia' },
    { name: 'Thessaloniki', region: 'Greece' },
    { name: 'Turin', region: 'Italy' },
    { name: 'Valencia', region: 'Spain' },
    { name: 'Vienna', region: 'Austria' },
    { name: 'Vilnius', region: 'Lithuania' },
    { name: 'Warsaw', region: 'Poland' },
    { name: 'Zagreb', region: 'Croatia' },
    { name: 'Zurich', region: 'Switzerland' },
  ];

  /**
   * Prefix matches first, then substring matches — the ranking the Usage tab
   * asks for, kept in one place so every example demonstrates it.
   */
  private rank(query: string, limit = 10): City[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.allCities.slice(0, limit);
    const starts: City[] = [];
    const contains: City[] = [];
    for (const city of this.allCities) {
      const name = city.name.toLowerCase();
      if (name.startsWith(q)) starts.push(city);
      else if (name.includes(q)) contains.push(city);
    }
    return [...starts, ...contains].slice(0, limit);
  }

  private groupByRegion(cities: City[]): CityGroup[] {
    const byRegion = new Map<string, City[]>();
    for (const city of cities) {
      const bucket = byRegion.get(city.region);
      if (bucket) bucket.push(city);
      else byRegion.set(city.region, [city]);
    }
    return [...byRegion.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([region, items]) => ({ region, items }));
  }

  // --- Playground state ------------------------------------------------------
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];

  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgDropdown = signal(true);
  readonly pgMultiple = signal(false);
  readonly pgForce = signal(false);
  readonly pgClear = signal(false);
  readonly pgDisabled = signal(false);
  readonly pgValue = signal<City | City[] | null>(null);
  readonly pgSuggestions = signal<City[]>([]);

  /** 'normal' maps to the default (no size input). */
  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  /** Switching between single and multiple changes the model's SHAPE, not just its value. */
  onPgMultiple(multiple: boolean): void {
    this.pgMultiple.set(multiple);
    this.pgValue.set(multiple ? [] : null);
  }

  completePlayground(event: { query: string }): void {
    this.pgSuggestions.set(this.rank(event.query));
  }

  /** Live-generated markup mirroring the playground configuration. */
  readonly pgCode = computed(() => {
    const attrs: string[] = [
      'inputId="city"',
      '[suggestions]="cities()"',
      '(completeMethod)="searchCities($event)"',
      'optionLabel="name"',
      'placeholder="Start typing a city"',
      '[emptyMessage]="t(\'city.noMatch\')"',
    ];
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"`);
    if (this.pgDropdown()) {
      attrs.push('[dropdown]="true"', '[dropdownAriaLabel]="t(\'city.showAll\')"');
    }
    if (this.pgMultiple()) attrs.push('[multiple]="true"');
    if (this.pgForce()) {
      attrs.push('[forceSelection]="true"', "[pt]=\"{ pcInputText: { root: { 'aria-describedby': 'city-rule' } } }\"");
    }
    if (this.pgClear()) attrs.push('[showClear]="true"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    attrs.push('[(ngModel)]="city"');
    const rule = this.pgForce() ? '\n<small id="city-rule">Choose one of the listed cities.</small>' : '';
    return `<label for="city">City</label>\n<p-autocomplete\n  ${attrs.join('\n  ')} />${rule}`;
  });

  // --- Example state ---------------------------------------------------------
  readonly szSuggestions = signal<City[]>([]);
  readonly szSmall = signal<City | null>(null);
  readonly szNormal = signal<City | null>(null);
  readonly szLarge = signal<City | null>(null);
  completeSizes(event: { query: string }): void {
    this.szSuggestions.set(this.rank(event.query));
  }

  readonly exBasicSuggestions = signal<City[]>([]);
  readonly exBasic = signal<City | string | null>(null);
  completeBasic(event: { query: string }): void {
    this.exBasicSuggestions.set(this.rank(event.query));
  }

  readonly exDdSuggestions = signal<City[]>([]);
  readonly exDdBlank = signal<City | string | null>(null);
  readonly exDdCurrent = signal<City | string | null>(null);
  completeDropdown(event: { query: string }): void {
    this.exDdSuggestions.set(this.rank(event.query, 12));
  }

  readonly exGroupSuggestions = signal<CityGroup[]>([]);
  readonly exGrouped = signal<City | string | null>(null);
  completeGrouped(event: { query: string }): void {
    this.exGroupSuggestions.set(this.groupByRegion(this.rank(event.query, 12)));
  }

  readonly exMultiSuggestions = signal<City[]>([]);
  readonly exMulti = signal<City[]>([]);
  completeMulti(event: { query: string }): void {
    this.exMultiSuggestions.set(this.rank(event.query));
  }

  readonly exTags = signal<string[]>(['transport', 'climate']);

  readonly exForceSuggestions = signal<City[]>([]);
  readonly exForce = signal<City | null>(null);
  completeForce(event: { query: string }): void {
    this.exForceSuggestions.set(this.rank(event.query));
  }

  readonly exAsyncSuggestions = signal<City[]>([]);
  readonly exAsync = signal<City | string | null>(null);
  /**
   * A simulated round trip. Note the two things the Development tab insists on:
   * every path assigns a NEW array (so the overlay opens and the spinner stops),
   * and a superseded response is dropped instead of overwriting a newer one.
   */
  private asyncQuery = '';
  completeAsync(event: { query: string }): void {
    this.asyncQuery = event.query;
    if (this.asyncTimer !== null) clearTimeout(this.asyncTimer);
    this.asyncTimer = setTimeout(() => {
      this.asyncTimer = null;
      if (event.query !== this.asyncQuery) return;
      this.exAsyncSuggestions.set(this.rank(event.query));
    }, 600);
  }

  readonly exTplSuggestions = signal<City[]>([]);
  readonly exTemplate = signal<City | string | null>(null);
  completeTemplate(event: { query: string }): void {
    this.exTplSuggestions.set(this.rank(event.query, 12));
  }

  readonly exStateSuggestions = signal<City[]>([]);
  readonly stateCity: City = { name: 'Vienna', region: 'Austria' };
  completeStates(event: { query: string }): void {
    this.exStateSuggestions.set(this.rank(event.query));
  }

  // --- Do / Don't state ------------------------------------------------------
  readonly chartOptions = [
    { label: 'Bar chart', value: 'bar' },
    { label: 'Line chart', value: 'line' },
    { label: 'Scatter plot', value: 'scatter' },
    { label: 'Pie chart', value: 'pie' },
    { label: 'Heatmap', value: 'heatmap' },
    { label: 'Area chart', value: 'area' },
  ];
  readonly ddFewSuggestions = signal<{ label: string; value: string }[]>([]);
  readonly ddFewText = signal<string | null>(null);
  readonly ddFewValue = signal<string | null>(null);
  completeFew(event: { query: string }): void {
    const q = event.query.trim().toLowerCase();
    this.ddFewSuggestions.set(this.chartOptions.filter((o) => o.label.toLowerCase().includes(q)));
  }

  readonly ddForceSuggestions = signal<City[]>([]);
  readonly ddForceBad = signal<City | null>(null);
  readonly ddForceGood = signal<City | null>(null);
  completeDdForce(event: { query: string }): void {
    this.ddForceSuggestions.set(this.rank(event.query));
  }

  readonly ddLabelSuggestions = signal<City[]>([]);
  readonly ddLabelBad = signal<City | string | null>(null);
  readonly ddLabelGood = signal<City | string | null>(null);
  completeDdLabel(event: { query: string }): void {
    this.ddLabelSuggestions.set(this.rank(event.query));
  }

  // --- Rendered snippets -----------------------------------------------------
  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'The baseline: type, then pick',
      note: 'A label, a suggestions array, a completeMethod. Nothing constrains the model — what you type is what the form control holds.',
      code: `<label for="city">City</label>
<p-autocomplete
  inputId="city"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [placeholder]="t('city.placeholder')"
  [emptyMessage]="t('city.noMatch')"
  [(ngModel)]="city" />

// in the component
readonly cities = signal<City[]>([]);
searchCities(event: AutoCompleteCompleteEvent): void {
  // ALWAYS assign a new array: the overlay opens as a reaction to the change.
  this.cities.set(this.rank(event.query));
}`,
    },
    {
      id: 'dropdown',
      title: 'The dropdown button, and its two modes',
      note: 'dropdownMode="blank" queries the empty string, so the button means "show me everything". "current" re-runs whatever is typed. Blank is the affordance; current is a retry.',
      code: `<p-autocomplete inputId="city" [dropdown]="true" dropdownMode="blank"
  [dropdownAriaLabel]="t('city.showAll')"
  [suggestions]="cities()" (completeMethod)="searchCities($event)"
  optionLabel="name" [(ngModel)]="city" />`,
    },
    {
      id: 'grouped',
      title: 'Grouped suggestions',
      note: 'Three inputs, and one ARIA caveat: the library marks group headers as options. Read Development before shipping groups.',
      code: `<p-autocomplete inputId="city" [dropdown]="true"
  [group]="true" optionGroupLabel="region" optionGroupChildren="items"
  [suggestions]="cityGroups()" (completeMethod)="searchGrouped($event)"
  optionLabel="name" [(ngModel)]="city" />

searchGrouped(event: AutoCompleteCompleteEvent): void {
  this.cityGroups.set(groupByRegion(this.rank(event.query)));
}`,
    },
    {
      id: 'multiple',
      title: 'Multiple: the answer is a set',
      note: 'The model becomes an array and the values render as chips. The remove icon is mouse-only — Backspace on the empty text box is the keyboard path.',
      code: `<label for="cities">Cities to compare</label>
<p-autocomplete
  inputId="cities"
  [multiple]="true"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [placeholder]="t('city.add')"
  [(ngModel)]="selectedCities" />`,
    },
    {
      id: 'tags',
      title: 'A token field: no suggestions at all',
      note: 'With [typeahead]="false" nothing is queried and the user invents the values. Set addOnBlur, or text left in the box is discarded.',
      code: `<label for="tags">Tags</label>
<p-autocomplete
  inputId="tags"
  [multiple]="true"
  [typeahead]="false"
  [addOnBlur]="true"
  separator=","
  [placeholder]="t('tags.placeholder')"
  [(ngModel)]="tags" />`,
    },
    {
      id: 'force',
      title: 'forceSelection, done responsibly',
      note: 'Typing no longer writes to the model, and a non-matching entry is erased without a message. The hint and the dropdown are what make that acceptable.',
      code: `<label for="city">City</label>
<p-autocomplete
  inputId="city"
  [forceSelection]="true"
  [dropdown]="true"
  [dropdownAriaLabel]="t('city.showAll')"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [pt]="{ pcInputText: { root: { 'aria-describedby': 'city-rule' } } }"
  [(ngModel)]="city" />
<small id="city-rule">{{ t('city.rule') }}</small>`,
    },
    {
      id: 'async',
      title: 'A remote source: thresholds and stale answers',
      note: 'minQueryLength and delay keep the request count down; the response check keeps a slow answer from overwriting a newer one.',
      code: `<p-autocomplete inputId="city" [minQueryLength]="2" [delay]="400"
  [suggestions]="cities()" (completeMethod)="searchCities($event)"
  optionLabel="name" [(ngModel)]="city" />

private pending = '';
searchCities(event: AutoCompleteCompleteEvent): void {
  this.pending = event.query;
  this.api.cities(event.query).subscribe({
    next: (rows) => {
      if (event.query !== this.pending) return;   // a newer query won
      this.cities.set(rows);                      // new reference: overlay opens
    },
    error: () => this.cities.set([]),             // ALSO assign, or the spinner never stops
  });
}`,
    },
    {
      id: 'template',
      title: 'Custom suggestion rows',
      note: 'Show what disambiguates. #selecteditem exists too, but only affects chips — in single mode the input can hold text only.',
      code: `<p-autocomplete inputId="city" [dropdown]="true"
  [suggestions]="cities()" (completeMethod)="searchCities($event)"
  optionLabel="name" [(ngModel)]="city">
  <ng-template #item let-city>
    <span class="opt">
      <strong>{{ city.name }}</strong>
      <span class="opt__meta">{{ city.region }}</span>
    </span>
  </ng-template>
</p-autocomplete>`,
    },
    {
      id: 'states',
      title: 'Disabled, invalid, read-only',
      note: 'Invalid is a border color and nothing else, so the message next to it is not optional — and on a token field there is no border change and no way to attach the message to the input. Read-only renders identically to editable.',
      code: `<p-autocomplete inputId="city" [disabled]="true" … />

<p-autocomplete inputId="city"
  [invalid]="form.controls.city.invalid && form.controls.city.touched"
  [pt]="{ pcInputText: { root: { 'aria-invalid': 'true', 'aria-describedby': 'city-msg' } } }" … />
<small id="city-msg">{{ t('city.error') }}</small>

<p-autocomplete inputId="city" [readonly]="true" … />`,
    },
  ];

  readonly sizesCode = `<p-autocomplete inputId="sz-small"  size="small" [dropdown]="true" … />
<p-autocomplete inputId="sz-normal"            [dropdown]="true" … />
<p-autocomplete inputId="sz-large"  size="large" [dropdown]="true" … />`;

  readonly devImport = `import { AutoCompleteModule } from '@openng/optimus-ui/autocomplete';
import type { AutoCompleteCompleteEvent } from '@openng/optimus-ui/autocomplete';

@Component({
  standalone: true,
  imports: [AutoCompleteModule, FormsModule],
  // ...
})`;

  readonly completeSnippet = `readonly cities = signal<City[]>([]);
private pending = '';

searchCities(event: AutoCompleteCompleteEvent): void {
  this.pending = event.query;
  this.api.cities(event.query).subscribe({
    // A NEW array reference is what opens the overlay and clears the spinner.
    next: (rows) => {
      if (event.query !== this.pending) return;  // drop a superseded response
      this.cities.set(rows.slice(0, 10));        // cap it: 500 rows is a scrollbar
    },
    // Assign here too. Without it, loading stays true and the spinner never stops.
    error: () => this.cities.set([]),
  });
}`;

  readonly templateSnippet = `<p-autocomplete inputId="city" [multiple]="true"
  [suggestions]="cities()" (completeMethod)="searchCities($event)"
  optionLabel="name" [(ngModel)]="selected">

  <!-- one suggestion row -->
  <ng-template #item let-city>
    <span class="opt"><strong>{{ city.name }}</strong> <em>{{ city.region }}</em></span>
  </ng-template>

  <!-- the contents of a chip; single mode ignores this -->
  <ng-template #selecteditem let-city>
    {{ city.name }}
  </ng-template>

  <!-- replaces emptyMessage -->
  <ng-template #empty>
    <span>{{ t('city.noMatch') }}</span>
  </ng-template>
</p-autocomplete>`;

  readonly themingSnippet = `/* Scoped to one form: suggestion rows, plus — for an app WITHOUT this
   kit's styles.scss, which already rings both modes — the focus ring Aura
   ships at zero on the multiple-mode box. Do NOT put these on :root:
   Optimus re-declares its tokens from a runtime <style> element that lands
   after this stylesheet. */
.city-form {
  --p-autocomplete-option-padding: 0.35rem 0.75rem;

  --p-autocomplete-focus-ring-width: 2px;
  --p-autocomplete-focus-ring-style: solid;
  --p-autocomplete-focus-ring-color: var(--primary-color-fg);
  --p-autocomplete-focus-ring-offset: 2px;
}`;

  readonly i18nSnippet = `// Every visible string is yours. The two selection messages are
// announced but never seen, which is exactly why they get forgotten.
readonly labels = computed(() => ({
  city: this.i18n.translate('form.city.label'),
  placeholder: this.i18n.translate('form.city.placeholder'),
  noMatch: this.i18n.translate('form.city.noMatch'),
  showAll: this.i18n.translate('form.city.showAll'),
  selected: this.i18n.translate('form.city.selected'),          // '{0}' = count
  nothingSelected: this.i18n.translate('form.city.nothingSelected'),
}));`;

  readonly primengTranslationSnippet = `<!-- These root-level library messages are not in the kit's aria push, so pass
     them here — or extend the push to cover them app-wide. searchMessage is
     omitted on purpose: in Optimus 2.0.2 nothing renders it. -->
<p-autocomplete
  inputId="city"
  [emptyMessage]="labels().noMatch"
  [selectionMessage]="labels().selected"
  [emptySelectionMessage]="labels().nothingSelected"
  [dropdownAriaLabel]="labels().showAll"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [(ngModel)]="city" />`;

  readonly testSnippet = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AutoCompleteModule } from '@openng/optimus-ui/autocomplete';

@Component({
  standalone: true,
  imports: [AutoCompleteModule],
  template: \`
    <label for="city">City</label>
    <p-autocomplete inputId="city" [dropdown]="true"
      dropdownAriaLabel="Show all cities" [suggestions]="[]" />\`,
})
class HostComponent {}

describe('autocomplete accessible names', () => {
  it('binds the native label to the combobox and names the trigger', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    // The combobox IS the input, so <label for> works — unlike on a p-select.
    const combobox = host.querySelector('input[role="combobox"]')!;
    expect(combobox.id).toBe('city');
    expect(host.querySelector('label')!.htmlFor).toBe('city');

    // Guard the gap this guide exists to prevent: a nameless trigger button.
    const trigger = host.querySelector('button')!;
    expect(trigger.getAttribute('aria-label')).toBeTruthy();
  });
});`;

  copy(id: string, text: string): void {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        this.copiedId.set(id);
        if (this.copyTimer !== null) clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => {
          this.copiedId.set(null);
          this.copyTimer = null;
        }, 1500);
      },
      () => {
        /* clipboard denied — leave the label unchanged */
      },
    );
  }
}
