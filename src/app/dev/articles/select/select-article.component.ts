import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectModule } from '@openng/optimus-ui/select';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Select (SPEC N5, Guides extension).
 *
 * Renders through `<app-guide-shell>` and projects each tab body as a
 * `*guideTab` template. Its subject is the DECISION SPACE around a single
 * choice — p-select vs p-autocomplete vs p-multiselect vs p-radiobutton vs
 * p-selectbutton — plus what Optimus UI really does for accessibility, and what
 * this kit's own stylesheet does on top of it.
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot):
 *   - p-select does NOT render a native <select>. The focusable element is a
 *     `<span class="p-select-label" role="combobox" tabindex="0">`
 *     (@openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs:1700, Optimus UI 2.0.2). Consequences:
 *     no native form participation, no OS picker on phones, and `<label for>`
 *     does not name it (a span is not a labelable element).
 *   - ACCESSIBLE NAME: only the `ariaLabel` / `ariaLabelledBy` inputs reach the
 *     combobox span (`:1701-1702`). A host `[attr.aria-label]` lands on the
 *     roleless host; `<label for>` + `inputId` binds to nothing. Both failure
 *     modes announce the CURRENT VALUE as the name, because `ariaLabel` falls
 *     back to `label()` — the selected option's text. Optimus keeps the v21
 *     plain inputs and inlines the fallback in the template; the v22
 *     `$ariaLabel` computed is gone.
 *   - FOCUS INDICATOR: Aura sets `form.field.focusRing` to width 0 / style none
 *     / shadow none (`@openng/optimus-ui-themes/dist/aura/base/index.mjs`), which
 *     leaves the border-color swap in `.p-select:not(.p-disabled).p-focus` as the
 *     whole of its focus indication — a 1px tint. `styles.scss` therefore names
 *     the state explicitly: `.p-select.p-focus` — 2px outline at 2px offset in
 *     `--primary-color-fg`, `!important` on all three properties. Re-declaring
 *     the `--p-select-focus-ring-*` tokens does NOT work: Optimus writes them
 *     onto `:root` from a runtime <style> tag that lands after styles.scss.
 *   - LABEL STATE COLORS: Optimus puts the resting, disabled, and placeholder
 *     colors on one element, `span.p-select-label`, at rising specificity
 *     (`optimus-ui-styles/dist/select/index.mjs:79/86/94`). The kit therefore
 *     raises the resting color through the element token
 *     `.p-select { --p-select-color: var(--text-color) }`, which the state rules
 *     sit above, and re-points the dark placeholder to --control-placeholder
 *     (the "field placeholder" rows in docs/generated/CONTRAST.MD, per style).
 *     Hex values depend on the active visual style (ui-styles.ts), so the tabs
 *     name tokens, not colors.
 *   - EDGE, ICONS, INVALID: `.p-select` re-points --p-select-border-color to
 *     --control-border (both themes), the dropdown and clear icon to
 *     --text-color-secondary, and the invalid border to --semantic-red-fg;
 *     CONTRAST.MD "form field edge" / "form field icon".
 *   - Option GROUP headers carry `role="option"` (openng-optimus-ui-select.mjs:1874),
 *     as does the empty-message row (:1899). ARIA 1.2 expects `role="group"`.
 *   - The trigger's `aria-label="dropdown trigger"` is a hard-coded English
 *     literal (openng-optimus-ui-select.mjs:1758) and is not reachable through the
 *     translation config. The listbox's `aria-label` defaults to the literal
 *     'Option List' (openng-optimus-ui-config.mjs:227) but IS reachable: the kit feeds
 *     `aria.listLabel` per language from its own `optimus.json` i18n module via
 *     `Optimus.setTranslation` on every language change.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-select-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    SelectModule,
    SelectButtonModule,
    ButtonModule,
    ToggleSwitchModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'select'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Every control below is a real <code>p-select</code>. Start in the playground to dial in a configuration and
          copy its markup; the blocks underneath pair each rendered control with the exact code. Note that
          <strong>every</strong> example names itself with <code>[ariaLabelledBy]</code> — the Usage and Development
          tabs show, with measurements, why the obvious alternatives do not work.
        </p>

        <!-- Mini playground: live-configure a select and read back the markup. -->
        <section class="pg" aria-label="Select playground">
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
                <label for="pg-grouped">Grouped options</label>
                <p-toggleswitch inputId="pg-grouped" [ngModel]="pgGrouped()" (ngModelChange)="pgGrouped.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-filter">Filter</label>
                <p-toggleswitch inputId="pg-filter" [ngModel]="pgFilter()" (ngModelChange)="pgFilter.set($event)" />
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
              <span class="pg__preview-label" id="pg-preview-label">Preview — chart type</span>
              <div class="pg__stage">
                <p-select
                  [ariaLabelledBy]="'pg-preview-label'"
                  [options]="pgGrouped() ? groupedChartOptions : chartOptions"
                  [group]="pgGrouped()"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  optionLabel="label"
                  optionValue="value"
                  [size]="pgSizeInput()"
                  [filter]="pgFilter()"
                  filterBy="label"
                  [showClear]="pgClear()"
                  [disabled]="pgDisabled()"
                  placeholder="Pick a chart type"
                  [ngModel]="pgValue()"
                  (ngModelChange)="pgValue.set($event)"
                  [style]="{ width: '100%' }"
                />
              </div>
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
            One model, three <code>size</code> values. The Design tab has the token table behind the height difference.
          </p>
          <div class="ex__stage">
            <div class="sizes">
              <div class="sizes__row">
                <span class="pg__label" id="sz-small-label">Small</span>
                <p-select
                  id="sz-small"
                  [ariaLabelledBy]="'sz-small-label'"
                  size="small"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="szSmall()"
                  (ngModelChange)="szSmall.set($event)"
                />
              </div>
              <div class="sizes__row">
                <span class="pg__label" id="sz-normal-label">Default</span>
                <p-select
                  id="sz-normal"
                  [ariaLabelledBy]="'sz-normal-label'"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="szNormal()"
                  (ngModelChange)="szNormal.set($event)"
                />
              </div>
              <div class="sizes__row">
                <span class="pg__label" id="sz-large-label">Large</span>
                <p-select
                  id="sz-large"
                  [ariaLabelledBy]="'sz-large-label'"
                  size="large"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
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
                    <span class="pg__label" id="ex-basic-label">Chart type</span>
                    <p-select
                      [ariaLabelledBy]="'ex-basic-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="exBasic()"
                      (ngModelChange)="exBasic.set($event)"
                    />
                  </div>
                }
                @case ('grouped') {
                  <div class="field">
                    <span class="pg__label" id="ex-grouped-label">Chart type, by family</span>
                    <p-select
                      [ariaLabelledBy]="'ex-grouped-label'"
                      [options]="groupedChartOptions"
                      [group]="true"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="exGrouped()"
                      (ngModelChange)="exGrouped.set($event)"
                    />
                  </div>
                }
                @case ('filter') {
                  <div class="field">
                    <span class="pg__label" id="ex-filter-label">Country</span>
                    <p-select
                      [ariaLabelledBy]="'ex-filter-label'"
                      [options]="countryOptions"
                      optionLabel="label"
                      optionValue="value"
                      [filter]="true"
                      filterBy="label"
                      filterPlaceholder="Type to narrow the list"
                      ariaFilterLabel="Type to narrow the list"
                      emptyFilterMessage="No country matches that text"
                      placeholder="Pick a country"
                      [ngModel]="exFilter()"
                      (ngModelChange)="exFilter.set($event)"
                    />
                  </div>
                }
                @case ('clear') {
                  <div class="field">
                    <span class="pg__label" id="ex-clear-label">Optional filter</span>
                    <p-select
                      [ariaLabelledBy]="'ex-clear-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="All chart types"
                      [showClear]="true"
                      [ngModel]="exClear()"
                      (ngModelChange)="exClear.set($event)"
                    />
                  </div>
                }
                @case ('template') {
                  <div class="field">
                    <span class="pg__label" id="ex-template-label">Chart type with icons</span>
                    <p-select
                      [ariaLabelledBy]="'ex-template-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="exTemplate()"
                      (ngModelChange)="exTemplate.set($event)"
                    >
                      <ng-template let-option #selectedItem>
                        <span class="opt"><i [class]="option.icon" aria-hidden="true"></i>{{ option.label }}</span>
                      </ng-template>
                      <ng-template let-option #item>
                        <span class="opt"><i [class]="option.icon" aria-hidden="true"></i>{{ option.label }}</span>
                      </ng-template>
                    </p-select>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <span class="pg__label" id="ex-disabled-label">Disabled</span>
                    <p-select
                      [ariaLabelledBy]="'ex-disabled-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [disabled]="true"
                      [ngModel]="'bar'"
                    />
                  </div>
                  <div class="field">
                    <span class="pg__label" id="ex-loading-label">Loading</span>
                    <p-select
                      [ariaLabelledBy]="'ex-loading-label'"
                      [options]="noOptions"
                      optionLabel="label"
                      optionValue="value"
                      [loading]="true"
                      placeholder="Fetching options"
                    />
                  </div>
                  <div class="field">
                    <span class="pg__label" id="ex-invalid-label">Invalid</span>
                    <p-select
                      [ariaLabelledBy]="'ex-invalid-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [invalid]="true"
                      placeholder="Pick one"
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
        <h3>Which control? The honest table</h3>
        <p>
          A <code>p-select</code> is the default only because it is compact — it costs the user a click to see the
          choices at all, and it hides the answer space behind a trigger. Pick by
          <strong
            >how many options there are, whether the user can name them, whether the answer is a set, and whether the
            options need to be visible while deciding</strong
          >.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reach for</th>
                <th>Options</th>
                <th>Visible at rest</th>
                <th>Search</th>
                <th>Multiple</th>
                <th>Touch / phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-selectbutton</code></td>
                <td>2–4, short labels</td>
                <td><strong>all</strong>, inline segmented</td>
                <td>no</td>
                <td><code>[multiple]="true"</code></td>
                <td>
                  Each option is its own target; past ~3 items the row wraps badly — give it
                  <code>styleClass="w-full"</code> and check it at 360px.
                </td>
              </tr>
              <tr>
                <td><code>p-radiobutton</code></td>
                <td>2–6</td>
                <td><strong>all</strong>, stacked with labels</td>
                <td>no</td>
                <td>no (that is a checkbox)</td>
                <td>Best: one large row per option, no overlay, nothing to mis-tap.</td>
              </tr>
              <tr>
                <td><code>p-select</code></td>
                <td>~5–25</td>
                <td>one — the current value</td>
                <td>no</td>
                <td>no</td>
                <td>
                  One target, then an overlay list. No OS wheel picker (it is not a native <code>&lt;select&gt;</code>).
                </td>
              </tr>
              <tr>
                <td><code>p-select [filter]</code></td>
                <td>~15–60</td>
                <td>one</td>
                <td>yes — client-side, over the options already loaded</td>
                <td>no</td>
                <td>
                  Opening focuses the filter input, so the on-screen keyboard appears immediately. Good when the user
                  knows the word, hostile when they are browsing.
                </td>
              </tr>
              <tr>
                <td><code>p-multiselect</code></td>
                <td>~5–60</td>
                <td>a summary of the chosen set</td>
                <td>yes, with <code>[filter]="true"</code></td>
                <td><strong>yes</strong> — this is the reason to use it</td>
                <td>As above, plus the selected set must stay readable when it grows.</td>
              </tr>
              <tr>
                <td><code>p-autocomplete</code></td>
                <td>60+, remote, or open-ended</td>
                <td>none — an empty text field</td>
                <td>yes, as you type; supports lazy/remote suggestions</td>
                <td><code>[multiple]="true"</code></td>
                <td>
                  Typing first. Only correct when the user can name the target; a browsing user gets a blank field and
                  no affordance.
                </td>
              </tr>
              <tr>
                <td>native <code>&lt;select&gt;</code></td>
                <td>any</td>
                <td>one</td>
                <td>OS type-ahead</td>
                <td><code>multiple</code></td>
                <td>
                  The only option that gets the OS picker, native form submission, and zero JS — at the price of
                  unstyleable options.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>What this table is and is not.</strong> The columns are behavior read from the Optimus UI sources in
          <code>node_modules</code>. The option-count bands are a <em>judgment</em>, not a measurement — they encode
          "how far can a user scan a collapsed list before searching beats scrolling", and you should move them if your
          content says otherwise. Kit convention: single choice is <code>p-select</code> or
          <code>p-selectbutton</code> throughout, and every one of them is named with <code>[ariaLabelledBy]</code>; the
          multiselect and autocomplete rows are documented from the library, not from a call site you can read here.
        </p>

        <h3>Do / Don't</h3>
        <p class="ex__note">
          Rendered pairs, both sides live. The <span class="tag tag--bad">Don't</span> is on the left, the
          <span class="tag tag--good">Do</span> on the right.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a dropdown for a binary</span>
            <div class="dd__stage">
              <p-select
                [ariaLabelledBy]="'dd-binary-bad-label'"
                [options]="binaryOptions"
                optionLabel="label"
                optionValue="value"
                [ngModel]="ddBinary()"
                (ngModelChange)="ddBinary.set($event)"
              />
              <span class="sr-only" id="dd-binary-bad-label">Sort order, as a dropdown</span>
            </div>
            <p class="dd__why">
              Two options, one click to open, one to choose, and the alternative stays invisible until you look for it.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — show both choices</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-binary-good-label">Sort order</span>
              <p-selectbutton
                [ariaLabelledBy]="'dd-binary-good-label'"
                [options]="binaryOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddBinary()"
                (ngModelChange)="ddBinary.set($event)"
              />
            </div>
            <p class="dd__why">
              Both states are readable at rest and each is one tap away. Same model, half the interaction.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — name it with a &lt;label for&gt;</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-name-bad">Chart type</label>
                <p-select
                  inputId="dd-name-bad"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Accessible name of the control on the left: <strong>"{{ ddNameLabel() }}"</strong> — the current value,
              not "Chart type". Change the selection and the name changes with it. The focusable element is a
              <code>&lt;span&gt;</code>, and <code>&lt;label for&gt;</code> only binds to labelable elements.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — name it with [ariaLabelledBy]</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-name-good-label">Chart type</span>
                <p-select
                  [ariaLabelledBy]="'dd-name-good-label'"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              The input lands on the element that actually carries
              <code>role="combobox"</code>, so the control announces "Chart type" and the value separately.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a long list with no way in</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-long-bad-label">Country, unfiltered</span>
              <p-select
                [ariaLabelledBy]="'dd-long-bad-label'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Pick a country"
                [ngModel]="ddLong()"
                (ngModelChange)="ddLong.set($event)"
              />
            </div>
            <p class="dd__why">
              {{ countryOptions.length }} options behind a scroll bar. Type-ahead exists, but it matches the first
              character only and is invisible to the user.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — add the filter</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-long-good-label">Country, filtered</span>
              <p-select
                [ariaLabelledBy]="'dd-long-good-label'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Pick a country"
                [filter]="true"
                filterBy="label"
                filterPlaceholder="Type to narrow the list"
                ariaFilterLabel="Type to narrow the list"
                emptyFilterMessage="No country matches that text"
                [ngModel]="ddLong()"
                (ngModelChange)="ddLong.set($event)"
              />
            </div>
            <p class="dd__why">
              A visible text field, matched with <code>filterBy</code>. Localize <code>filterPlaceholder</code>,
              <code>ariaFilterLabel</code> and <code>emptyFilterMessage</code> — they are your strings, not the library's.
            </p>
          </div>
        </div>

        <h3>A placeholder is not a label</h3>
        <p>
          <code>placeholder</code> disappears the moment a value is chosen, so it cannot be the control's name. It is
          at least visually distinct here: <code>.p-select-label.p-placeholder</code> reads
          <code>--p-select-placeholder-color</code>, a muted gray in light mode and the kit's
          <code>--control-placeholder</code> in dark mode (its ratio per visual style is the "field placeholder" row
          of <code>docs/generated/CONTRAST.MD</code>), while a chosen value reads <code>--text-color</code>. Any
          <code>color … !important</code> on <code>.p-select-label</code> would erase that difference, because all
          three states sit on that one element. Distinct or not, always ship a visible caption next to the control
          and point <code>[ariaLabelledBy]</code> at it.
        </p>

        <h3>Order the options for the reader, not the database</h3>
        <ul>
          <li>
            <strong>Natural order first</strong> — sizes go S, M, L; months go January to December. Alphabetical is a
            fallback, not a default.
          </li>
          <li>
            <strong>Sort translated labels with <code>localeCompare</code></strong
            >, using the active language — a byte-order sort puts "Österreich" after "Zypern".
          </li>
          <li>
            <strong>Never reorder while the overlay is open.</strong> The list is
            <code>aria-activedescendant</code>-driven; moving items under the cursor moves the selection the user is
            aiming at.
          </li>
          <li>
            <strong>Group with <code>[group]="true"</code></strong> only when the groups mean something to the reader —
            and read the caveat in the Development tab first, because Optimus marks group headers as options.
          </li>
        </ul>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — APG, Select-Only Combobox example</a
            >
            — the exact keyboard contract this guide checks the component against, including "Down Arrow opens the listbox
            without moving focus or changing selection" and "Escape closes the listbox and sets visual focus on the
            combobox".
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Combobox pattern</a
            >
            — the roles/states contract (<code>aria-expanded</code>,
            <code>aria-controls</code>, <code>aria-activedescendant</code>) and the rule that the accessible name comes
            from a real label, <code>aria-labelledby</code> or <code>aria-label</code> — the basis of the naming table.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#listbox" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>listbox</code> role</a
            >
            — "the listbox role requires ownership of an element using the option or group role"; the reference for why
            a group header must not be an
            <code>option</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.3.1 Info and Relationships</a
            >
            — the label/control relationship must be programmatic, not merely visual; this is what the
            <code>&lt;label for&gt;</code> pattern silently fails here.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — the criterion that fails when a control's only focus indication is a border color a stylesheet override
            has already pinned. The kit meets it in both themes with an explicit <code>.p-select.p-focus</code> outline
            in <code>styles.scss</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 for focus indicators and control boundaries; the yardstick for a focus state that is only a 1px
            border-color swap.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — the list of <em>labelable</em> elements. A <code>&lt;span&gt;</code> is not one of them, which is the
            mechanism behind the failing name.
          </li>
          <li>
            <a href="https://primeng.org/select" target="_blank" rel="noopener noreferrer">
              PrimeNG — Select component</a
            >
            — the upstream v21 API surface (inputs, outputs, templates) Optimus forked, mapped onto the kit's
            conventions and then verified against the shipped Optimus source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          <code>p-select</code> renders <strong>no native <code>&lt;select&gt;</code></strong
          >. The host element itself is the visual control (<code>display: inline-flex</code>,
          <code>class="p-select"</code>), and the focusable element inside it is a span:
        </p>
        <ul>
          <li>
            <strong>Root</strong> — the <code>&lt;p-select&gt;</code> host: background, 1px border, radius, and every
            state class (<code>p-focus</code>, <code>p-disabled</code>, <code>p-invalid</code>,
            <code>p-variant-filled</code>).
          </li>
          <li>
            <strong>Label</strong> — <code>span.p-select-label</code> with <code>role="combobox"</code>,
            <code>tabindex="0"</code>, <code>aria-haspopup="listbox"</code>, <code>aria-expanded</code>, and
            <code>id</code> = your <code>inputId</code>. <em>This</em> is what receives focus and what carries the
            accessible name.
          </li>
          <li>
            <strong>Clear icon</strong> — shown by <code>[showClear]="true"</code> once a value exists; positioned with
            <code>inset-inline-end</code>, i.e. logical, RTL-safe.
          </li>
          <li>
            <strong>Dropdown trigger</strong> — <code>div.p-select-dropdown</code>, 2.5rem wide,
            <code>role="button"</code> with a hard-coded English <code>aria-label="dropdown trigger"</code> (see the
            i18n tab).
          </li>
          <li>
            <strong>Overlay</strong> — <code>div.p-select-overlay</code>, teleported into an
            <code>.p-overlay-content</code> wrapper, <code>min-width: 100%</code> of the trigger.
          </li>
          <li>
            <strong>List</strong> — <code>ul[role="listbox"]</code> with <code>id="&lt;selectId&gt;_list"</code>;
            options are <code>li[role="option"]</code> — and so are group headers and the empty message.
          </li>
        </ul>
        <p class="src-note">
          Anatomy read from <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs</code> (the <code>#focusInput</code> span at
          1688 with its ARIA at 1699-1708, the trigger div at 1758, the list at 1871, the group
          <code>&lt;li&gt;</code> at 1874); roles confirmed in the accessibility tree.
        </p>

        <h3>Size scale — tokens and measured heights</h3>
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
                <td><strong>measured control height</strong></td>
                <td><strong>33px</strong></td>
                <td><strong>39px</strong></td>
                <td><strong>46px</strong></td>
              </tr>
              <tr>
                <td>dropdown trigger width</td>
                <td colspan="3">2.5rem (40px), all sizes</td>
              </tr>
              <tr>
                <td>border-radius / border</td>
                <td colspan="3">
                  <code>&#123;form.field.border.radius&#125;</code> (Aura 6px; 0 in the default visual style) / 1px
                  solid
                </td>
              </tr>
              <tr>
                <td>transition-duration</td>
                <td colspan="3">0.2s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token values from <code>&#64;openng/optimus-ui-themes/dist/aura/select/index.mjs</code>, resolving
          <code>&#123;form.field.*&#125;</code> against <code>&#8230;/aura/base/index.mjs</code>. The radius is the one
          row the kit's visual styles change: each style's <code>presetOverrides</code> in
          <code>src/app/services/ui-styles.ts</code> rewrites the radius scale (<code>werkbund</code>
          flattens it to 0). The three heights are computed style: a select has no fixed height token — it is content +
          padding + 2px border. <strong>All three clear the WCAG 2.5.8 24px target floor</strong>, but only the trigger
          does: an individual option in the overlay is padded 0.5rem/0.75rem.
        </p>

        <h3>Interaction states — two layers</h3>
        <p>
          As with the button, two sources style a select: the <em>Aura token layer</em> that Optimus ships, and this
          kit's <code>styles.scss</code>. The kit re-points <em>element tokens</em> for the resting field, its icons,
          and the invalid edge (so every state rule keeps reading its own token) and adds one
          <code>!important</code> rule, for focus. Every pair is gated in <code>docs/generated/CONTRAST.MD</code>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>State</th>
                <th>Aura token layer</th>
                <th>What this kit actually renders</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>rest</td>
                <td>
                  1px <code>&#123;form.field.border.color&#125;</code> on <code>&#123;form.field.background&#125;</code>
                </td>
                <td>
                  Label in <code>--text-color</code> (both themes, via <code>--p-select-color</code>). Border
                  <code>--control-border</code> in both themes (<code>--p-select-border-color</code>), 3.25&#8211;5.51:1
                  ("form field edge"); chevron and clear icon <code>--text-color-secondary</code>, 4.79&#8211;7.78:1
                  ("form field icon", Aura's surface.400 was 2.56:1 on white). Dark: background
                  <code>--surface-section</code> (<code>--p-select-background</code>). All element tokens, no
                  <code>!important</code> — the disabled and invalid rules have to keep reading their own tokens.
                </td>
              </tr>
              <tr>
                <td>hover</td>
                <td>
                  <code>.p-select:not(.p-disabled):hover</code> → border
                  <code>&#123;form.field.hover.border.color&#125;</code>
                </td>
                <td>
                  As Aura, both themes — the hover rule reads <code>--p-select-hover-border-color</code>, which the kit
                  leaves alone.
                </td>
              </tr>
              <tr>
                <td>focus-visible</td>
                <td>
                  <code>.p-focus</code> → border <code>&#123;form.field.focus.border.color&#125;</code>. Aura itself
                  paints <strong>no ring</strong>: it sets focusRing width <code>0</code>, style <code>none</code>,
                  shadow <code>none</code>.
                </td>
                <td>
                  <strong>Kit override, both themes:</strong> <code>2px solid var(--primary-color-fg)</code> outline at
                  <code>2px</code> offset. Without it, focus is a bare 1px border-color swap to the primary color,
                  <code>outline: 0px none</code>.
                </td>
              </tr>
              <tr>
                <td>disabled</td>
                <td>
                  <code>opacity: 1</code> plus <code>&#123;form.field.disabled.background&#125;</code> and a muted label
                  color — note this is <em>not</em> the global 0.6 disabled opacity that buttons use.
                </td>
                <td>
                  Same. The kit sets <code>--p-select-color</code> on the element rather than painting the label, so
                  Aura's <code>&#123;form.field.disabled.color&#125;</code> still reaches the screen, visibly muted
                  against the resting <code>--text-color</code>.
                </td>
              </tr>
              <tr>
                <td>invalid</td>
                <td>
                  <code>.p-invalid</code> → border <code>&#123;form.field.invalid.border.color&#125;</code>, placeholder
                  in the invalid color
                </td>
                <td>
                  Border <code>--semantic-red-fg</code> in both themes: the invalid rule reads
                  <code>--p-select-invalid-border-color</code>, which the kit re-points to the red every field uses
                  (Aura's red.400 was 2.77:1 on white). The invalid placeholder color comes from its own rule
                  (<code>.p-select.p-invalid .p-select-label.p-placeholder</code>), which is more specific than the
                  resting placeholder rule.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Why the focus state needs a rule of its own.</strong> Aura zeroes the focus ring
          (<code>formField.focusRing</code>, width 0 / style none / shadow none, in
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>), which leaves the
          <code>.p-focus</code> border-color swap as the entire focus indication — a thin 1px tint in both themes, too
          little to carry SC 2.4.7 on its own. The
          kit's dark resting rule does not touch that swap: it re-points <code>--p-select-border-color</code>, while
          Aura's focus rule reads <code>--p-select-focus-border-color</code>, one token over. Verify it in your own
          theme: focus the control and diff <code>getComputedStyle</code> against its resting state.
        </p>
        <p class="src-note">
          <strong>One rule, both themes.</strong> <code>styles.scss</code> carries
          <code
            >.p-select.p-focus &#123; outline: 2px solid var(--primary-color-fg) !important; outline-offset: 2px
            !important; border-color: … !important &#125;</code
          >. Two things are worth knowing before you copy the approach. Feeding the design tokens instead (<code
            >--p-select-focus-ring-width</code
          >
          and friends) looks cleaner but does <em>not</em> work: Optimus writes those onto <code>:root</code> from a
          <code>&lt;style&gt;</code> tag injected at runtime, which lands after this stylesheet and wins on equal
          specificity — the token still computes to <code>0</code>. And the <code>!important</code> is not decoration:
          Aura's own <code>.p-select:not(.p-disabled).p-focus</code> is one class more specific than the kit rule.
          Because it belongs in the stylesheet, no call site changes.
        </p>

        <h3>The overlay</h3>
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
                  <code>min-width: 100%</code> of the trigger — it grows with long options, never shrinks below the
                  control
                </td>
              </tr>
              <tr>
                <td>overlay radius / shadow</td>
                <td>
                  <code>&#123;border.radius.md&#125;</code> (follows the visual style);
                  <code>0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)</code>
                </td>
              </tr>
              <tr>
                <td>list padding / gap</td>
                <td>0.25rem / 2px</td>
              </tr>
              <tr>
                <td>option padding / radius</td>
                <td>0.5rem 0.75rem / <code>&#123;border.radius.sm&#125;</code></td>
              </tr>
              <tr>
                <td>option — focused</td>
                <td>
                  The kit ring, drawn inside the option (<code>.p-select-option.p-focus</code>: 2px
                  <code>--primary-color-fg</code>, offset -2px), over Aura's <code>--p-select-option-focus-background</code>
                  tint (<code>&#123;surface.100&#125;</code> / dark <code>&#123;surface.800&#125;</code>, 1.10&#8211;1.19:1
                  on the panel, too faint alone). The option carrying <code>.p-focus</code> is the keyboard's active
                  one, and it follows the pointer too. A focused <em>selected</em> option keeps the plain selection fill in
                  dark mode. Ring 3.48:1 and up on every fill it meets (<code>CONTRAST.MD</code>, "option list focus").
                </td>
              </tr>
              <tr>
                <td>option — selected</td>
                <td>
                  <code>&#123;highlight.background&#125;</code> — <code>primary.50</code> in light mode,
                  <code>color-mix(in srgb, primary.400, transparent 84%)</code> in dark mode: either way a
                  <em>faint</em> wash; pair it with <code>[checkmark]="true"</code> if selection must be unmissable
                </td>
              </tr>
              <tr>
                <td>group header</td>
                <td>font-weight 600, padding 0.5rem 0.75rem</td>
              </tr>
              <tr>
                <td>scroll height</td>
                <td>
                  <code>scrollHeight</code>, default <code>200px</code> — beyond that the list scrolls; past a few
                  hundred options use <code>[virtualScroll]</code> with <code>virtualScrollItemSize</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names from <code>&#64;openng/optimus-ui-themes/dist/aura/select/index.mjs</code> and
          <code>&#8230;/aura/base/index.mjs</code>. In dark mode <code>styles.scss</code> additionally forces the
          overlay onto <code>--surface-card</code>, option text onto <code>--text-color</code>, and option hover onto
          <code>--surface-hover</code> (all <code>!important</code>). The overlay is appended into a
          <code>.p-overlay-content</code> wrapper, so a call site that clips its own container (<code
            >overflow: hidden</code
          >) can still cut the list — that is what the kit's <code>appendTo="body"</code> usages are working around.
        </p>

        <h3>The label truncates — it never wraps</h3>
        <p>
          <code>.p-select-label</code> computes to
          <code>white-space: nowrap; overflow: hidden; text-overflow: ellipsis</code> (measured). A long option label is
          cut with an ellipsis at whatever width the control has, and the <em>overlay</em> may be wider than the trigger
          while the trigger is not. Give a select that carries translated labels real width (<code
            >[style]="&#123; width: '100%' &#125;"</code
          >
          or <code>styleClass="w-full"</code>, the kit utility in <code>styles.scss</code>), and test with the longest
          language you ship.
        </p>
        <p>
          <strong>Narrow screens:</strong> no intrinsic responsive behavior and no breakpoint. The host is
          <code>display: inline-flex</code>, and the label (<code>flex: 1 1 auto; width: 1%</code>) truncates
          instead of wrapping at every viewport; the overlay is at least as wide as the trigger. Layout guidance: on
          phones give the select <code>fluid</code> or a 100% width inside a <code>min-width: 0</code> parent.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 2.1.1 with the documented key model — down and up open, Enter and Space open,
          Home, End, PageUp, and PageDown move, Escape closes and refocuses, printable characters type-ahead — SC 2.4.7
          with the kit's own 2px outline at 2px offset, the state named explicitly because Aura zeroes the focus ring
          and leaves only a 1px border tint, and SC 2.5.8 for the trigger,
          measured at 33px, 39px, and 46px across the three sizes. <strong>Failing:</strong> SC 4.1.2 — group headers and
          the empty message are exposed as <code>role="option"</code> inside the listbox, and the dropdown trigger
          carries a hard-coded English name; both are upstream and reachable through neither an input nor the
          translation service. <strong>Conditional:</strong> SC 4.1.2 for the accessible name, which lands only through
          <code>ariaLabelledBy</code> or <code>ariaLabel</code> — a native label association or an attribute on the host
          both fall back to announcing the current value as the name; and SC 2.5.8, cleared by the trigger but not by an
          option in the overlay, which is padded 0.5rem 0.75rem. <strong>AAA</strong> is not assessed for this
          component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>SelectModule</code> exports the <code>&lt;p-select&gt;</code> component. There is no directive form. It
          is a <code>ControlValueAccessor</code>, so it works with <code>[(ngModel)]</code> and with reactive forms —
          but see "Forms" below for what it does <em>not</em> do.
        </p>

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
                <td><code>options</code></td>
                <td>any[]</td>
                <td>The list. Bind a <code>computed()</code> so translated labels re-render on a language switch.</td>
              </tr>
              <tr>
                <td><code>optionLabel</code></td>
                <td>string</td>
                <td>Property holding the visible text.</td>
              </tr>
              <tr>
                <td><code>optionValue</code></td>
                <td>string</td>
                <td>Property holding the model value. Omit it and the whole object becomes the value.</td>
              </tr>
              <tr>
                <td><code>optionDisabled</code></td>
                <td>string</td>
                <td>Property marking an option unselectable.</td>
              </tr>
              <tr>
                <td><code>group</code></td>
                <td>boolean</td>
                <td>
                  Options are group objects — pair with <code>optionGroupLabel</code> and
                  <code>optionGroupChildren</code> (default <code>'items'</code>).
                </td>
              </tr>
              <tr>
                <td><code>placeholder</code></td>
                <td>string</td>
                <td>Shown while the value is empty. Not a label (see Usage).</td>
              </tr>
              <tr>
                <td><code>showClear</code></td>
                <td>boolean</td>
                <td>Adds a clear icon once a value exists; emits <code>onClear</code>.</td>
              </tr>
              <tr>
                <td><code>filter</code></td>
                <td>boolean</td>
                <td>
                  Search field in the overlay header. <code>filterBy</code> = comma-separated fields,
                  <code>filterMatchMode</code> = <code>'contains'</code> by default, <code>filterLocale</code> for
                  locale-aware casing.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  <strong>The only working accessible name.</strong> They land on the
                  <code>role="combobox"</code> element.
                </td>
              </tr>
              <tr>
                <td><code>ariaFilterLabel</code></td>
                <td>string</td>
                <td>Accessible name of the filter input.</td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  Sets the <code>id</code> of the combobox span. Useful for tests and for
                  <code>aria-describedby</code> targets — it does <strong>not</strong> make
                  <code>&lt;label for&gt;</code> work.
                </td>
              </tr>
              <tr>
                <td><code>emptyMessage</code> / <code>emptyFilterMessage</code></td>
                <td>string</td>
                <td>Your strings for "no options" and "nothing matched". Localize both.</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Omit for the default (inherited from <code>BaseInput</code>).</td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'filled' | 'outlined'</td>
                <td>
                  Default <code>'outlined'</code> — the kit sets <code>inputStyle: 'outlined'</code> globally in
                  <code>app.config.ts</code>.
                </td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>Spans 100% of the container (or inherits from a <code>p-fluid</code> ancestor).</td>
              </tr>
              <tr>
                <td><code>disabled</code> / <code>invalid</code> / <code>required</code> / <code>name</code></td>
                <td>boolean / string</td>
                <td>
                  From <code>BaseEditableHolder</code>; <code>required</code> also sets <code>aria-required</code>.
                </td>
              </tr>
              <tr>
                <td><code>loading</code></td>
                <td>boolean</td>
                <td>Spinner in the trigger; keys are ignored while true.</td>
              </tr>
              <tr>
                <td><code>checkmark</code></td>
                <td>boolean</td>
                <td>Adds a check icon to the selected option — worth it, given how faint the selected tint is.</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td>signal input</td>
                <td>
                  <code>'body'</code> escapes a clipping ancestor. Costs you the CSS containment, so scope any overlay
                  styling by <code>panelStyleClass</code>.
                </td>
              </tr>
              <tr>
                <td><code>virtualScroll</code> + <code>virtualScrollItemSize</code></td>
                <td>boolean + number</td>
                <td>For very long lists; the item size is required and fixed.</td>
              </tr>
              <tr>
                <td><code>editable</code></td>
                <td>boolean</td>
                <td>
                  Swaps the span for a real <code>&lt;input&gt;</code> and lets the user type a free value. If you need
                  this, you probably want <code>p-autocomplete</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs verified against <code>&#64;openng/optimus-ui/types/openng-optimus-ui-select.d.ts</code> (Optimus UI 2.0.2,
          <code>node_modules/&#64;openng/optimus-ui/package.json</code>); <code>size</code>, <code>variant</code>,
          <code>fluid</code> from <code>openng-optimus-ui-baseinput.d.ts</code>, and <code>disabled</code> /
          <code>invalid</code> / <code>required</code> / <code>name</code> from
          <code>openng-optimus-ui-baseeditableholder.d.ts</code>.
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
                <td><code>onChange</code></td>
                <td><code>SelectChangeEvent</code></td>
                <td>A value was chosen — <code>$event.value</code> is the new model value.</td>
              </tr>
              <tr>
                <td><code>onFilter</code></td>
                <td><code>SelectFilterEvent</code></td>
                <td>The filter text changed (use it to trigger a remote query with <code>[lazy]</code>).</td>
              </tr>
              <tr>
                <td><code>onClear</code></td>
                <td><code>EventEmitter&lt;Event&gt;</code></td>
                <td>The clear icon was used.</td>
              </tr>
              <tr>
                <td><code>onShow</code> / <code>onHide</code></td>
                <td><code>EventEmitter&lt;AnimationEvent&gt;</code></td>
                <td>Overlay opened / closed.</td>
              </tr>
              <tr>
                <td><code>onFocus</code> / <code>onBlur</code></td>
                <td><code>EventEmitter&lt;Event&gt;</code></td>
                <td>The combobox gained / lost focus.</td>
              </tr>
              <tr>
                <td><code>onLazyLoad</code></td>
                <td><code>SelectLazyLoadEvent</code></td>
                <td>Virtual scroll needs another slice.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Exact emitter types from the <code>Select</code> class in <code>&#64;openng/optimus-ui/types/openng-optimus-ui-select.d.ts</code>.
        </p>

        <h3>Templates</h3>
        <p>
          Project a template by reference name (<code>#item</code>, <code>#selectedItem</code>, &#8230;) when the inputs
          cannot express the content. (Optimus restored the v21 <code>PrimeTemplate</code> content query, so the older
          <code>pTemplate="item"</code> form binds again — <code>openng-optimus-ui-select.mjs:941-996</code> — but
          reference names stay the kit's convention.) The kit's font picker is the
          reference pattern: it renders each option in its own typeface via <code>item</code> +
          <code>selectedItem</code>.
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
                <td>One option row in the overlay.</td>
              </tr>
              <tr>
                <td><code>#selectedItem</code></td>
                <td>
                  The value shown in the trigger. Define it whenever you define <code>item</code>, or the trigger and
                  the list disagree.
                </td>
              </tr>
              <tr>
                <td><code>#group</code></td>
                <td>A group header row.</td>
              </tr>
              <tr>
                <td><code>#header</code> / <code>"footer"</code></td>
                <td>Chrome above / below the list.</td>
              </tr>
              <tr>
                <td><code>#filter</code></td>
                <td>The whole filter row (you then own its accessible name).</td>
              </tr>
              <tr>
                <td><code>#empty</code> / <code>"emptyfilter"</code></td>
                <td>The "nothing here" / "nothing matched" rows.</td>
              </tr>
              <tr>
                <td>
                  <code>#dropdownicon</code>, <code>"clearicon"</code>, <code>"filtericon"</code>,
                  <code>"loadingicon"</code>
                </td>
                <td>The four icons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ templateSnippet }}</code></pre>
        <p class="src-note">
          Slot names from the content queries in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs</code> (<code>itemTemplate</code>, <code>groupTemplate</code>,
          <code>selectedItemTemplate</code>, <code>headerTemplate</code>, <code>filterTemplate</code>,
          <code>footerTemplate</code>, <code>emptyFilterTemplate</code>, <code>emptyTemplate</code>,
          <code>dropdownIconTemplate</code>, <code>loadingIconTemplate</code>, <code>clearIconTemplate</code>,
          <code>filterIconTemplate</code>).
        </p>

        <h3>Theming with CSS custom properties</h3>
        <p>
          Every select token is exposed as <code>--p-select-*</code>. Geometry passes through (the radius follows the
          active visual style); <strong>color is mixed</strong> — the kit re-points several of these tokens itself in
          <code>styles.scss</code>, and its focus rule is <code>!important</code>:
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
                <td><code>--p-select-border-radius</code></td>
                <td>Corner radius (Aura 6px; the visual style's radius scale).</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-select-padding-x</code> / <code>-y</code></td>
                <td>Trigger padding.</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-select-dropdown-width</code></td>
                <td>Trigger-icon column (2.5rem).</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-select-option-padding</code> / <code>--p-select-option-border-radius</code></td>
                <td>Option rows.</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code>--p-select-border-color</code></td>
                <td>Resting border.</td>
                <td>
                  No — <code>.p-select</code> in <code>styles.scss</code> declares it on the element
                  (<code>--control-border</code>, both themes), which beats an inherited value. Same for
                  <code>--p-select-dropdown-color</code>, <code>-clear-icon-color</code>, and
                  <code>-invalid-border-color</code>.
                </td>
              </tr>
              <tr>
                <td><code>--p-select-focus-border-color</code></td>
                <td>Focus border.</td>
                <td>
                  No — <code>.p-select.p-focus</code> in <code>styles.scss</code> sets <code>border-color</code> itself
                  with <code>!important</code> in both themes, so the token never reaches the edge.
                </td>
              </tr>
              <tr>
                <td><code>--p-select-placeholder-color</code></td>
                <td>Placeholder text.</td>
                <td>
                  Light only — the dark theme re-points it to <code>--control-placeholder</code> (ratio per style in
                  <code>docs/generated/CONTRAST.MD</code>, "field placeholder").
                </td>
              </tr>
              <tr>
                <td><code>--p-select-focus-ring-width</code></td>
                <td>Focus outline.</td>
                <td>
                  No — Optimus rewrites the focus-ring tokens on <code>:root</code> from a runtime
                  <code>&lt;style&gt;</code> tag that lands last. The kit's <code>.p-select.p-focus</code> outline is
                  the ring.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          The <code>p</code> prefix is set in <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). The two override rules are quoted verbatim in the Design tab.
        </p>

        <h3>Forms</h3>
        <p>
          <code>p-select</code> is a <code>ControlValueAccessor</code>, so <code>[(ngModel)]</code>,
          <code>formControlName</code> and validation all work. What it is <strong>not</strong>: a form control in the
          HTML sense. In its default (non-<code>editable</code>) mode it renders no <code>&lt;input&gt;</code>,
          <code>&lt;select&gt;</code> or hidden field at all, so a native form submission carries nothing from it — the
          value lives only in the Angular model. If a page must degrade without JavaScript, use a native
          <code>&lt;select&gt;</code>.
        </p>
        <p class="src-note">
          Verified against <code>openng-optimus-ui-select.mjs</code> (Optimus UI 2.0.2): the string <code>type="hidden"</code> does
          not occur in the file, and the non-editable branch renders only the <code>&lt;span&gt;</code>.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Accessibility</h3>

        <h4>Naming: three patterns, one that works</h4>
        <p>
          The "name" column is what a screen reader announces for a select showing the option
          <em>Bar chart</em> under a caption reading <em>Chart type</em>:
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
                <td><code>[attr.aria-label]="…"</code> on <code>&lt;p-select&gt;</code></td>
                <td>"Bar chart" — the current value</td>
                <td>
                  <strong>Fails.</strong> The attribute lands on the host, which has no role; the AT never sees it.
                </td>
              </tr>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>"Bar chart" — the current value</td>
                <td>
                  <strong>Fails.</strong> <code>&lt;label for&gt;</code> binds only to labelable elements; the combobox
                  is a <code>&lt;span&gt;</code>.
                </td>
              </tr>
              <tr>
                <td><code>[ariaLabelledBy]="'x-label'"</code> (or <code>ariaLabel</code>)</td>
                <td>name "Chart type", value "Bar chart"</td>
                <td><strong>Works.</strong> The input is bound onto the <code>role="combobox"</code> element.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Measured in the accessibility tree; the mechanism is in the Optimus source.
          <code>ariaLabel</code> / <code>ariaLabelledBy</code> are bound as <code>[attr.aria-label]</code> /
          <code>[attr.aria-labelledby]</code> on the <code>#focusInput</code> span
          (<code>openng-optimus-ui-select.mjs:1701-1702</code>), and when <code>ariaLabel</code> is empty the fallback is
          <code>label()</code> — the selected option's text. That is why an unnamed select announces its
          <em>value</em> as its <em>name</em>, and why both failing patterns fail the same way. Verify it in your own
          build: inspect the combobox node in the browser's accessibility tree — the name must be the caption, not the
          current value.
        </p>

        <h4>Keyboard</h4>
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
                <td>Focus in / out (the span is <code>tabindex="0"</code>).</td>
                <td>Closes the overlay and moves on.</td>
              </tr>
              <tr>
                <td><kbd>↓</kbd></td>
                <td>Opens the list without changing the value.</td>
                <td>Focus the next option.</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd></td>
                <td>Opens the list.</td>
                <td>Focus the previous option.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>—</td>
                <td>First / last option.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>—</td>
                <td>Jump a page through the list.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> / <kbd>Space</kbd></td>
                <td>Opens the list.</td>
                <td>Select the focused option and close.</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>—</td>
                <td>Close and return focus to the combobox (measured: focus really does come back).</td>
              </tr>
              <tr>
                <td>printable character</td>
                <td>Opens the list and jumps to the first match.</td>
                <td>Type-ahead within the list.</td>
              </tr>
              <tr>
                <td><kbd>Delete</kbd></td>
                <td>
                  Clears the value — only when <code>[showClear]</code> is set (onDeleteKey, openng-optimus-ui-select.mjs:1469).
                  <kbd>Backspace</kbd> is a no-op on a non-editable select (onBackspaceKey, :1569).
                </td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from <code>onKeyDown</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs:1265-1328</code> and
          spot-checked live (<kbd>↓</kbd> set <code>aria-expanded="true"</code>; <kbd>Esc</kbd> set it back to
          <code>false</code> with focus on the combobox). It matches the APG select-only combobox contract linked in
          Sources. <strong>With <code>[filter]="true"</code> the picture changes:</strong> opening moves DOM focus into
          the filter <code>&lt;input&gt;</code>, so <code>aria-activedescendant</code> is carried by the filter, not by
          the combobox (measured: combobox <code>aria-activedescendant</code> was <code>null</code> while the list was
          open).
        </p>

        <h4>Known upstream gaps — do not paper over them silently</h4>
        <ul>
          <li>
            <strong>Group headers are options.</strong> With <code>[group]="true"</code>, Optimus renders the header as
            <code>&lt;li class="p-select-option-group" role="option"&gt;</code>
            (<code>openng-optimus-ui-select.mjs:1874</code>). ARIA 1.2 asks for
            <code>role="group"</code>, so a screen reader counts and announces the headers as selectable choices. Keep
            group counts small, and prefer flat lists when the grouping is decorative.
          </li>
          <li>
            <strong>The empty message is an option too</strong> — the "no results" row is also
            <code>role="option"</code> (<code>openng-optimus-ui-select.mjs:1899</code>), so "1 option" is announced
            when there are none.
          </li>
          <li>
            <strong>The trigger has a fixed English name</strong> — <code>aria-label="dropdown trigger"</code> is a
            literal (<code>openng-optimus-ui-select.mjs:1758</code>), reachable neither per call site nor through the translation
            config; see the i18n tab.
          </li>
          <li>
            <strong>A zeroed focus ring</strong> — Aura ships one, so a stylesheet that also pins
            <code>border-color</code> can leave the control with no visible focus state at all. The Design tab has the
            cascade and the kit's central fix.
          </li>
        </ul>

        <h4>Acceptance checklist</h4>
        <ul class="checklist">
          <li>
            ☐ The control has a visible caption AND <code>[ariaLabelledBy]</code> pointing at it (or
            <code>ariaLabel</code> when the caption is genuinely absent).
          </li>
          <li>
            ☐ No <code>&lt;label for&gt;</code> and no <code>[attr.aria-label]</code> on the host is doing the naming.
          </li>
          <li>☐ <code>placeholder</code> is not carrying the label's job.</li>
          <li>
            ☐ Reachable with <kbd>Tab</kbd>, operable with <kbd>↓</kbd> / <kbd>Enter</kbd> / <kbd>Esc</kbd>;
            <kbd>Esc</kbd> returns focus to the trigger.
          </li>
          <li>☐ Focus is visible in <strong>both</strong> light and dark themes — check it, do not assume it.</li>
          <li>
            ☐ With <code>[filter]</code>: <code>ariaFilterLabel</code>, <code>filterPlaceholder</code> and
            <code>emptyFilterMessage</code> are all translated.
          </li>
          <li>
            ☐ Option labels come from the translation service, and the array is a <code>computed()</code> so a language
            switch re-renders them.
          </li>
          <li>☐ The control is wide enough for the longest translated label, or you have accepted the ellipsis.</li>
          <li>
            ☐ More than ~25 options → a filter; fewer than ~5 → check whether <code>p-radiobutton</code> or
            <code>p-selectbutton</code> is the better control.
          </li>
        </ul>

        <h4>Test it</h4>
        <p>
          A spec in the kit's real setup (TestBed + Vitest via
          <code>&#64;angular/build:unit-test</code>) that pins the naming rule — it asserts the
          <em>combobox</em> element, not the host, carries the name:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Your strings</h3>
        <ul>
          <li>
            <strong>Option labels are content, not code.</strong> Build the array in a <code>computed()</code> that
            calls the kit's <code>TranslationService</code>, so a language switch rebuilds the labels; a plain field is
            captured once and goes stale.
          </li>
          <li>
            <strong>Five inputs need translating, not one</strong> — <code>placeholder</code>,
            <code>filterPlaceholder</code>, <code>ariaFilterLabel</code>, <code>emptyMessage</code> and
            <code>emptyFilterMessage</code>. The raw-key gate (<code>check-i18n-keys.mjs</code>) only helps for keys you
            actually reference.
          </li>
          <li>
            <strong>Sort after translating.</strong> Sort the built array with <code>localeCompare</code> in the active
            language, never the source list by its English labels.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Two strings come from Optimus, not from your template</h3>
        <p>
          The listbox's <code>aria-label</code> and the trigger's <code>aria-label="dropdown trigger"</code> are
          announced to every screen-reader user and appear nowhere in your markup. They are <em>not</em> the same
          problem:
        </p>
        <ul>
          <li>
            <strong>The listbox label is fixable.</strong> Its default is the English literal
            <code>'Option List'</code> (<code>openng-optimus-ui-config.mjs:227</code>), overridable through the
            <code>aria.listLabel</code> key of the Optimus translation service. Because it is a <em>service</em>, not a
            static provider value, a multilingual app must re-set it on every language change — a
            <code>translation</code> block passed once to <code>provideOptimus</code> would freeze the app in one
            language. The kit therefore keeps the strings in its own i18n layer
            (<code>assets/i18n/modules/&lt;lang&gt;/optimus.json</code>) and pushes them through
            <code>Optimus.setTranslation</code> from an effect on the active language; a German reader hears
            "Optionsliste". Note that <code>setTranslation</code> merges only one level deep, so the
            <code>aria</code> block is replaced wholesale — spread the current one or the keys you did not list are
            lost.
          </li>
          <li>
            <strong>The trigger label is not.</strong> <code>aria-label="dropdown trigger"</code> is a hard-coded
            literal in the component template (<code>openng-optimus-ui-select.mjs:1758</code>), reachable through neither the
            translation service nor a call-site input. The remaining routes are an upstream fix or a
            <code>pt</code> (pass-through) override; this guide claims no working workaround.
          </li>
        </ul>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>
        <p class="src-note">
          The key is <code>aria</code> (<code>Translation.aria</code>), not <code>ariaLabel</code>; the same block also
          carries <code>removeLabel</code>, <code>previous</code>/<code>next</code> and the maximize labels the Tag,
          Tabs, and Dialog guides refer to. Downstream kits that skip this step ship the English defaults in every
          language.
        </p>

        <h3>Length: the trigger truncates, the overlay does not</h3>
        <p>
          German option labels run 20–40% longer than English ("Streudiagramm" vs "Scatter"), and the trigger clips with
          an ellipsis rather than wrapping (measured in the Design tab). Two consequences: give selects that carry
          translated labels an explicit width, and never let the label be the only place a value is readable — if the
          choice matters after the dropdown closes, echo it in the surrounding text.
        </p>

        <h3>Filtering across languages</h3>
        <ul>
          <li>
            <code>filterMatchMode</code> defaults to <code>'contains'</code>, and matching is case-folded with
            <code>filterLocale</code>. Set it to the active language, or Turkish dotted/dotless i (and similar) will not
            match.
          </li>
          <li>
            Filtering does <strong>not</strong> fold diacritics: typing "osterreich" will not find "Österreich". If your
            options carry accents, add a normalized search field and point <code>filterBy</code> at both — this is
            exactly what the guide shell's own quick-switch does with <code>filterBy="label,search"</code>.
          </li>
        </ul>

        <h3>RTL: this one is fine</h3>
        <p>
          Unlike the button's <code>iconPos</code>, the select is built on logical properties: the trigger uses
          <code>border-start-end-radius</code> and the clear icon <code>inset-inline-end</code>, so both flip correctly
          under <code>direction: rtl</code>. Nothing here is wired today — the kit ships LTR languages only — but a
          downstream RTL extension needs no per-call-site work for this component.
        </p>
        <p class="src-note">
          Read from the shipped stylesheet rules for <code>.p-select-dropdown</code> and
          <code>.p-select-clear-icon</code>. Not verified against a rendered RTL locale.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the resting edge is
            <code>--control-border</code> in both themes, the chevron and clear icon <code>--text-color-secondary</code>,
            the invalid edge <code>--semantic-red-fg</code>, and the keyboard-active option carries the kit ring
            inside it, each cited from its CONTRAST.MD row; the state, overlay, and theming tables say so.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — State and theming tables restated for the element-token approach and
            the visual styles: hover and invalid borders land in both themes, the focus-ring tokens are not a working
            override, colors are named as tokens (ratios in <code>docs/generated/CONTRAST.MD</code>), radii follow the
            style. Keyboard line refs corrected (:1469, :1569); narrow-screen behavior stated.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Two v22 claims flipped:
            <code>pTemplate</code> binds again (the v21 <code>PrimeTemplate</code> content query is back, mapped in
            <code>onAfterContentInit</code>, :941-996), and <code>ariaLabel</code>/<code>ariaLabelledBy</code> are
            plain inputs again with the empty-name fallback inlined in the template (:1701-1702), not a
            <code>$ariaLabel</code> computed. Line refs re-derived against the Optimus bundles (combobox span :1700,
            group header :1874, empty row :1899, "dropdown trigger" :1758, <code>onKeyDown</code> :1265-1328,
            <code>'Option List'</code> config :227); the translation entry point is <code>Optimus.setTranslation</code>.
            Aura is back on 2.x: the dropdown trigger measures 2.5rem again, matching what the size table already showed.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-23 — Re-verified against PrimeNG 22.1: all naming and role findings carry
            over unchanged (combobox span, group headers as <code>role="option"</code>, the hard-coded &quot;dropdown
            trigger&quot; literal — now at :1802), templates bind via reference names (<code>#item</code>,
            <code>#selectedItem</code>; <code>pTemplate</code> is dead in v22), and the demo markup migrated. Aura 3.0:
            dropdown width 2.5→2.25rem, checkmark gutters adjusted; colors unchanged. Line refs re-derived against
            22.1.2.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-07-30 — Editorial pass: evidence trimmed to citations; the naming table
            restated as patterns rather than call sites; the i18n section rewritten around the translation service and
            the language-change effect.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-29 — Initial guide: the control-choice table, a live playground, three
            rendered Do/Don't pairs, the Aura design tab, and the canonical agent doc.
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
      ul {
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
      .src-inline {
        display: block;
        font-size: 0.78rem;
        color: var(--text-color-secondary);
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
      .pg__stage {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 8rem;
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .pg__stage p-select {
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
      .opt {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
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
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
        min-height: 3.5rem;
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
export class SelectArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  // --- Option data -----------------------------------------------------------
  readonly chartOptions = [
    { label: 'Bar chart', value: 'bar', icon: 'pi pi-chart-bar' },
    { label: 'Line chart', value: 'line', icon: 'pi pi-chart-line' },
    { label: 'Scatter plot', value: 'scatter', icon: 'pi pi-chart-scatter' },
    { label: 'Pie chart', value: 'pie', icon: 'pi pi-chart-pie' },
    { label: 'Heatmap', value: 'heatmap', icon: 'pi pi-th-large' },
  ];

  readonly groupedChartOptions = [
    {
      label: 'Comparison',
      items: [
        { label: 'Bar chart', value: 'bar' },
        { label: 'Grouped bars', value: 'grouped-bar' },
      ],
    },
    {
      label: 'Change over time',
      items: [
        { label: 'Line chart', value: 'line' },
        { label: 'Area chart', value: 'area' },
      ],
    },
    {
      label: 'Distribution',
      items: [
        { label: 'Scatter plot', value: 'scatter' },
        { label: 'Heatmap', value: 'heatmap' },
      ],
    },
  ];

  /** Stable empty array for the loading example (a literal would churn on every CD pass). */
  readonly noOptions: { label: string; value: string }[] = [];

  readonly binaryOptions = [
    { label: 'Newest first', value: 'desc' },
    { label: 'Oldest first', value: 'asc' },
  ];

  /** A deliberately long list — the "needs a filter" example. */
  readonly countryOptions = [
    'Albania',
    'Andorra',
    'Austria',
    'Belarus',
    'Belgium',
    'Bosnia and Herzegovina',
    'Bulgaria',
    'Croatia',
    'Cyprus',
    'Czechia',
    'Denmark',
    'Estonia',
    'Finland',
    'France',
    'Germany',
    'Greece',
    'Hungary',
    'Iceland',
    'Ireland',
    'Italy',
    'Kosovo',
    'Latvia',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Malta',
    'Moldova',
    'Monaco',
    'Montenegro',
    'Netherlands',
    'North Macedonia',
    'Norway',
    'Poland',
    'Portugal',
    'Romania',
    'San Marino',
    'Serbia',
    'Slovakia',
    'Slovenia',
    'Spain',
    'Sweden',
    'Switzerland',
    'Ukraine',
    'United Kingdom',
  ].map((label) => ({ label, value: label.toLowerCase().replace(/\s+/g, '-') }));

  // --- Playground state ------------------------------------------------------
  readonly sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Large', value: 'large' },
  ];

  readonly pgSize = signal<'small' | 'normal' | 'large'>('normal');
  readonly pgGrouped = signal(false);
  readonly pgFilter = signal(false);
  readonly pgClear = signal(false);
  readonly pgDisabled = signal(false);
  readonly pgValue = signal<string | null>(null);

  /** 'normal' maps to the default (no size input). */
  readonly pgSizeInput = computed<'small' | 'large' | undefined>(() =>
    this.pgSize() === 'normal' ? undefined : (this.pgSize() as 'small' | 'large'),
  );

  /** Live-generated markup mirroring the playground selection. */
  readonly pgCode = computed(() => {
    const attrs: string[] = [
      '[ariaLabelledBy]="\'chart-type-label\'"',
      '[options]="chartOptions"',
      'optionLabel="label"',
      'optionValue="value"',
      'placeholder="Pick a chart type"',
    ];
    if (this.pgGrouped()) {
      attrs.splice(1, 1, '[options]="groupedChartOptions"');
      attrs.push('[group]="true"', 'optionGroupLabel="label"', 'optionGroupChildren="items"');
    }
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"`);
    if (this.pgFilter()) attrs.push('[filter]="true"', 'filterBy="label"');
    if (this.pgClear()) attrs.push('[showClear]="true"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    attrs.push('[(ngModel)]="chartType"');
    return `<span class="field-label" id="chart-type-label">Chart type</span>\n<p-select\n  ${attrs.join('\n  ')} />`;
  });

  // --- Example state ---------------------------------------------------------
  readonly szSmall = signal('bar');
  readonly szNormal = signal('bar');
  readonly szLarge = signal('bar');
  readonly exBasic = signal('line');
  readonly exGrouped = signal('scatter');
  readonly exFilter = signal<string | null>(null);
  readonly exClear = signal<string | null>('pie');
  readonly exTemplate = signal('heatmap');
  readonly ddBinary = signal('desc');
  readonly ddName = signal('bar');
  readonly ddLong = signal<string | null>(null);

  /**
   * The accessible name of the "Don't" example next to it: Optimus falls back
   * to the selected option's own text, so the name is literally the
   * current value. Computed from the same source the component reads, which is
   * why the sentence stays true when the reader changes the selection.
   */
  readonly ddNameLabel = computed(
    () => this.chartOptions.find((o) => o.value === this.ddName())?.label ?? 'Chart type',
  );

  readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'A single choice',
      note: 'The baseline: a visible caption, and [ariaLabelledBy] pointing at its id.',
      code: `<span class="field-label" id="chart-type-label">Chart type</span>
<p-select
  [ariaLabelledBy]="'chart-type-label'"
  [options]="chartOptions"
  optionLabel="label"
  optionValue="value"
  [(ngModel)]="chartType" />`,
    },
    {
      id: 'grouped',
      title: 'Grouped options',
      note: 'Groups need three inputs. Read the group-header caveat in Development before using them.',
      code: `<p-select
  [ariaLabelledBy]="'chart-family-label'"
  [options]="groupedChartOptions"
  [group]="true"
  optionGroupLabel="label"
  optionGroupChildren="items"
  optionLabel="label"
  optionValue="value"
  [(ngModel)]="chartType" />`,
    },
    {
      id: 'filter',
      title: 'Filter for a long list',
      note: 'Open it and type. All three filter strings are yours to translate.',
      code: `<p-select
  [ariaLabelledBy]="'country-label'"
  [options]="countryOptions"
  optionLabel="label"
  optionValue="value"
  [filter]="true"
  filterBy="label"
  [filterPlaceholder]="t('form.country.filter')"
  [ariaFilterLabel]="t('form.country.filter')"
  [emptyFilterMessage]="t('form.country.noMatch')"
  [placeholder]="t('form.country.placeholder')"
  [(ngModel)]="country" />`,
    },
    {
      id: 'clear',
      title: 'Optional value: placeholder plus clear',
      note: 'showClear is how a user un-picks. Without it, an optional filter is a one-way door.',
      code: `<p-select
  [ariaLabelledBy]="'chart-filter-label'"
  [options]="chartOptions"
  optionLabel="label"
  optionValue="value"
  [placeholder]="t('filter.allChartTypes')"
  [showClear]="true"
  [(ngModel)]="chartFilter" />`,
    },
    {
      id: 'template',
      title: 'Custom option rendering',
      note: 'Define selectedItem whenever you define item, or the trigger and the list disagree.',
      code: `<p-select [ariaLabelledBy]="'chart-type-label'" [options]="chartOptions"
  optionLabel="label" optionValue="value" [(ngModel)]="chartType">
  <ng-template let-option #selectedItem>
    <span class="opt"><i [class]="option.icon" aria-hidden="true"></i>{{ option.label }}</span>
  </ng-template>
  <ng-template let-option #item>
    <span class="opt"><i [class]="option.icon" aria-hidden="true"></i>{{ option.label }}</span>
  </ng-template>
</p-select>`,
    },
    {
      id: 'states',
      title: 'Disabled, loading, invalid',
      note: 'Disabled mutes the label (the kit re-points the token, it does not paint the label); loading swallows keys.',
      code: `<p-select … [disabled]="true" />
<p-select … [loading]="true" [placeholder]="t('form.loading')" />
<p-select … [invalid]="form.controls.chartType.invalid" />`,
    },
  ];

  readonly sizesCode = `<p-select [ariaLabelledBy]="'sz-small-label'"  size="small" … />
<p-select [ariaLabelledBy]="'sz-normal-label'"            … />
<p-select [ariaLabelledBy]="'sz-large-label'"  size="large" … />`;

  readonly devImport = `import { SelectModule } from '@openng/optimus-ui/select';

@Component({
  standalone: true,
  imports: [SelectModule, FormsModule],
  // ...
})`;

  readonly templateSnippet = `<p-select [ariaLabelledBy]="'font-label'" [options]="fonts"
  optionLabel="name" optionValue="id" [(ngModel)]="font">
  <ng-template let-option #selectedItem>
    <span [style.fontFamily]="option.stack">{{ option.name }}</span>
  </ng-template>
  <ng-template let-option #item>
    <span [style.fontFamily]="option.stack">{{ option.name }}</span>
  </ng-template>
</p-select>`;

  readonly themingSnippet = `/* Scoped to one field — geometry only. Color on a select is owned by the
   element tokens and the focus rule in styles.scss, so keep colors out of here.
   Do not re-declare --p-select-focus-ring-*: Optimus rewrites them at runtime. */
.compact-picker {
  --p-select-border-radius: 2rem;
  --p-select-padding-y: 0.25rem;
  --p-select-option-padding: 0.35rem 0.75rem;
}

/* template */
<p-select styleClass="compact-picker" … />`;

  readonly i18nSnippet = `// Labels rebuild on a language switch because the array is a computed().
readonly chartOptions = computed(() => [
  { label: this.i18n.translate('chart.type.bar'), value: 'bar' },
  { label: this.i18n.translate('chart.type.line'), value: 'line' },
  { label: this.i18n.translate('chart.type.scatter'), value: 'scatter' },
].sort((a, b) => a.label.localeCompare(b.label, this.i18n.currentLanguage())));`;

  readonly primengTranslationSnippet = `// A translation block passed once to provideOptimus would freeze the app in one
// language. Push the strings instead, from an effect on the active language.
private readonly optimus = inject(Optimus); // from '@openng/optimus-ui/config'

constructor() {
  effect(() => {
    // 'Option List' is the default aria-label of every select/multiselect listbox.
    // The key is \`aria\` (Translation.aria) — not \`ariaLabel\`.
    this.optimus.setTranslation({
      aria: {
        // setTranslation merges one level deep only: spread the current block or
        // every aria key you do not list here reverts to its English default.
        ...(this.optimus.translation.aria ?? {}),
        listLabel: this.i18n.translate('optimus.listLabel'),
      },
    });
  });
}`;

  readonly testSnippet = `import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SelectModule } from '@openng/optimus-ui/select';

@Component({
  standalone: true,
  imports: [SelectModule],
  template: \`
    <span id="chart-type-label">Chart type</span>
    <p-select [ariaLabelledBy]="'chart-type-label'" [options]="opts"
      optionLabel="label" optionValue="value" />\`,
})
class HostComponent {
  opts = [{ label: 'Bar chart', value: 'bar' }];
}

describe('select accessible name', () => {
  it('names the combobox element, not the host', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    // The focusable element is a span[role=combobox] INSIDE <p-select>.
    const combobox = host.querySelector('[role="combobox"]')!;
    expect(combobox.getAttribute('aria-labelledby')).toBe('chart-type-label');
    // Guard against the regression this guide exists to prevent:
    expect(host.querySelector('p-select')!.hasAttribute('aria-label')).toBe(false);
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
