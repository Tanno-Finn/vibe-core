import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from '@openng/optimus-ui/multiselect';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [FormsModule, MultiSelectModule, GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      .lead {
        margin: 0 0 var(--space-5);
        font-size: 1.05rem;
        line-height: 1.7;
        color: var(--text-color-secondary);
      }
      h3 {
        margin: var(--space-6) 0 var(--space-3);
        font-size: 1.05rem;
      }
      p {
        line-height: 1.65;
      }

      .stage {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-5);
        padding: var(--space-4);
        background: var(--surface-section);
        border-radius: var(--radius-md);
        margin: 0 0 var(--space-3);
      }
      .stage__item {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
        flex: 1 1 16rem;
        max-width: 26rem;
      }
      .stage__cap {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .stage__note {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .stage__item p-multiselect {
        width: 100%;
      }

      .field-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--text-color);
      }
      .field-error {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--red-600);
      }
      .field-error i {
        margin-top: 0.15em;
        font-size: 0.85rem;
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
        border-left: 3px solid var(--semantic-red-fg, #b91c1c);
      }
      .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg, #15803d);
      }
      .dd__stage {
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-section);
      }
      .dd__stage--stack {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }
      .dd__stage p-multiselect {
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
        background: color-mix(in srgb, var(--semantic-red-fg, #b91c1c) 14%, transparent);
        color: var(--semantic-red-fg, #b91c1c);
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

      .sources {
        padding-left: 1.1rem;
      }
      .sources li {
        margin: 0 0 var(--space-3);
        line-height: 1.6;
      }

      .checklist {
        list-style: none;
        padding-left: 0;
      }
      .checklist li {
        margin: 0.3rem 0;
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
      .src-note {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-4);
      }
      .history strong {
        color: var(--primary-color-fg);
      }
    `;

/**
 * Guide article: MultiSelect (Optimus UI).
 *
 * WHAT THE CLAIMS REST ON — the durable artifacts behind every rule in the
 * tabs (guide-authoring: "Provenance, not process"):
 *   - @openng/optimus-ui@2.0.2 shipped source (openng-optimus-ui-multiselect.mjs):
 *     MultiSelect extends BaseEditableHolder :338; selector aliases and the
 *     PrimeTemplate content query :1846; input defaults (plain properties in
 *     this v21-derived code base, not signals) display 'comma' :595,
 *     maxSelectedLabels 3 :977, filter true :388, resetFilterOnHide false :470,
 *     showToggleAll true :455, dataKey :413; the hidden combobox input :1857,
 *     the aria-multiselectable listbox :2069, option host bindings :245,
 *     onKeyDown :1289-1344 with Ctrl/Cmd+A :1329, the summary-label fallback to
 *     the selectionMessage translation :1269-1276 (default string
 *     openng-optimus-ui-config.mjs:170), toggleAllAriaLabel :999, listLabel
 *     :1002. No overlayVisibleChange output exists — overlayVisible is one-way.
 *   - Aura 2.x token files: @openng/optimus-ui-themes/dist/aura/multiselect/index.mjs
 *     (root aliases the form.field.* block; option.selectedBackground aliases
 *     {list.option.selected.background}) and .../aura/base/index.mjs for the
 *     resolved values.
 *   - The kit ships no production p-multiselect; the boundary rows in the
 *     select and autocomplete guides are the measured demand this guide
 *     answers, and the live examples on this page are its rendered corpus.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-multiselect-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'multiselect'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          One control, two display modes, one overflow rule. Everything below is live — open the panels with the
          keyboard too: Space toggles, Shift extends, Ctrl or Cmd + A takes the lot.
        </p>

        <h3>Comma display, and where it collapses</h3>
        <p>
          The default field lists selections separated by commas until
          <code>maxSelectedLabels</code> (3) is crossed — then it collapses to a summary. Select four topics to see the
          switch.
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap" id="ms-comma-label">comma (default)</span>
            <p-multiselect
              inputId="ms-comma"
              [ariaLabelledBy]="'ms-comma-label'"
              [options]="topicOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pick topics"
              appendTo="body"
              [ngModel]="commaPick()"
              (ngModelChange)="commaPick.set($event)"
              name="ms-comma"
            />
            <span class="stage__note">{{ commaPick().length }} selected</span>
          </div>
          <div class="stage__item">
            <span class="stage__cap" id="ms-chip-label">chip display</span>
            <p-multiselect
              inputId="ms-chip"
              [ariaLabelledBy]="'ms-chip-label'"
              display="chip"
              [options]="topicOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pick topics"
              appendTo="body"
              [ngModel]="chipPick()"
              (ngModelChange)="chipPick.set($event)"
              name="ms-chip"
            />
            <span class="stage__note">chips remove on click; the list is the keyboard path</span>
          </div>
        </div>
        <p class="src-note">
          Defaults measured in the shipped source: <code>display</code> 'comma'
          (<code>openng-optimus-ui-multiselect.mjs:595</code>), <code>maxSelectedLabels</code> 3 (<code>:977</code>); past it the
          field renders the <code>selectionMessage</code>
          translation with the count substituted (<code>:1269-1276</code>).
        </p>

        <h3>Filter and the header checkbox</h3>
        <p>
          Both ship enabled: the search box filters as you type, the header checkbox takes or clears everything the
          filter currently shows.
        </p>
        <div class="stage">
          <div class="stage__item">
            <span class="stage__cap" id="ms-filter-label">filter + toggle-all (the defaults)</span>
            <p-multiselect
              inputId="ms-filter"
              [ariaLabelledBy]="'ms-filter-label'"
              [options]="countryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pick countries"
              appendTo="body"
              [ngModel]="filterPick()"
              (ngModelChange)="filterPick.set($event)"
              name="ms-filter"
            />
          </div>
        </div>
        <p class="src-note">
          <code>filter</code> and <code>showToggleAll</code> default to true
          (<code>openng-optimus-ui-multiselect.mjs:388,:455</code>); the filter text survives closing the panel unless
          <code>resetFilterOnHide</code> is set (<code>:470</code>).
        </p>

        <h3>The invalid state, wired as far as the control allows</h3>
        <div class="stage">
          <div class="stage__item">
            <span class="stage__cap" id="ms-invalid-label">at least one topic required</span>
            <p-multiselect
              inputId="ms-invalid"
              [ariaLabelledBy]="requiredPick().length === 0 ? 'ms-invalid-label ms-invalid-error' : 'ms-invalid-label'"
              [options]="topicOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Pick at least one"
              appendTo="body"
              [invalid]="requiredPick().length === 0"
              [ngModel]="requiredPick()"
              (ngModelChange)="requiredPick.set($event)"
              name="ms-invalid"
            />
            @if (requiredPick().length === 0) {
              <small class="field-error" id="ms-invalid-error">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                Choose at least one topic.
              </small>
            }
          </div>
        </div>
        <p class="src-note">
          <code>invalid</code> is inherited from the editable base and stays a manual boolean
          (<code>openng-optimus-ui-baseeditableholder.mjs:17</code>). The combobox binds no <code>aria-invalid</code> and the
          component has no <code>ariaDescribedBy</code> input; its only attribute route is <code>ptm('hiddenInput')</code>
          (<code>openng-optimus-ui-multiselect.mjs:1873</code>), which is not a key of the typed pass-through options. This
          demo therefore appends the error's id to <code>ariaLabelledBy</code> while the error shows, so the message is
          part of the name. The timing gate a real form puts around it is the <strong>Forms</strong> guide's ground.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The model is an array; everything else follows from three decisions — how a picked value is identified, how
          the field summarizes, and whether the panel needs its built-in search.
        </p>

        <h3>Wiring the options</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>
        <p>
          Without <code>optionValue</code> the model holds whole option objects, compared by reference: a preselected
          model built from a second fetch matches nothing and the field renders empty. Either keep primitive values in
          the model (<code>optionValue</code>) or name an identity field (<code>dataKey</code>).
        </p>

        <h3>The boundary, against its four neighbors</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The need</th>
                <th>Reach for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>One value from the list</td>
                <td><code>p-select</code></td>
              </tr>
              <tr>
                <td>A set from ~8–60 known options, summarized into one field</td>
                <td><code>p-multiselect</code></td>
              </tr>
              <tr>
                <td>60+, remote, or free-text entries</td>
                <td><code>p-autocomplete</code> (with <code>multiple</code> for sets)</td>
              </tr>
              <tr>
                <td>Few options that should stay visible as fields</td>
                <td>a <code>p-checkbox</code> group</td>
              </tr>
              <tr>
                <td>The set edited as visible tokens, no overlay</td>
                <td>the <strong>Tags &amp; Chips</strong> patterns</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The single-choice and remote boundaries quote the owning guides' own "When to use" rows
          (<code>select.agent.md</code>, <code>autocomplete.agent.md</code>) — read them there, not from memory.
        </p>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a placeholder standing in for the label</span>
            <div class="dd__stage">
              <p-multiselect
                [options]="topicOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Topics"
                appendTo="body"
                ariaLabel="Bad example: placeholder as label"
                [ngModel]="ddBadPick()"
                (ngModelChange)="ddBadPick.set($event)"
                name="ms-dd-bad"
              />
            </div>
            <p class="dd__why">
              The field's name vanishes behind the first selection, and the focusable element is a hidden combobox no
              <code>label[for]</code> can reach — there is nothing left that names the control.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a caption wired via ariaLabelledBy</span>
            <div class="dd__stage dd__stage--stack">
              <span class="field-label" id="ms-dd-good-label">Topics</span>
              <p-multiselect
                inputId="ms-dd-good"
                [ariaLabelledBy]="'ms-dd-good-label'"
                [options]="topicOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Pick topics"
                appendTo="body"
                [ngModel]="ddGoodPick()"
                (ngModelChange)="ddGoodPick.set($event)"
                name="ms-dd-good"
              />
            </div>
            <p class="dd__why">
              The visible caption survives every selection and is announced as the combobox's name; the placeholder goes
              back to demonstrating, not naming.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a search box over five options</span>
            <div class="dd__stage dd__stage--stack">
              <span class="field-label" id="ms-dd-f-bad-label">Severity</span>
              <p-multiselect
                inputId="ms-dd-f-bad"
                [ariaLabelledBy]="'ms-dd-f-bad-label'"
                [options]="severityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Pick severities"
                appendTo="body"
                [ngModel]="ddFilterBad()"
                (ngModelChange)="ddFilterBad.set($event)"
                name="ms-dd-f-bad"
              />
            </div>
            <p class="dd__why">
              The default filter adds a search box, a focus stop, and an empty-result state to a list the eye scans
              faster than the hand types.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — switch the filter off below ~8 options</span>
            <div class="dd__stage dd__stage--stack">
              <span class="field-label" id="ms-dd-f-good-label">Severity</span>
              <p-multiselect
                inputId="ms-dd-f-good"
                [ariaLabelledBy]="'ms-dd-f-good-label'"
                [options]="severityOptions"
                optionLabel="label"
                optionValue="value"
                [filter]="false"
                placeholder="Pick severities"
                appendTo="body"
                [ngModel]="ddFilterGood()"
                (ngModelChange)="ddFilterGood.set($event)"
                name="ms-dd-f-good"
              />
            </div>
            <p class="dd__why">
              <code>[filter]="false"</code> — the panel opens straight onto the options, and the header keeps only the
              toggle-all checkbox.
            </p>
          </div>
        </div>

        <h3>Sources, annotated</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA APG — Listbox pattern</a
            >
            — the multi-select keyboard contract this component implements: Space toggles, Shift extends, Ctrl/Cmd+A
            selects all.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-multiselectable" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — aria-multiselectable</a
            >
            — the attribute that tells a screen-reader user the list takes more than one answer, before any option is
            reached.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA APG — Combobox pattern</a
            >
            — the trigger half: a collapsed combobox opening a listbox popup.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 4.1.2 Name, Role, Value</a
            >
            — why the visible caption must reach the hidden combobox via
            <code>ariaLabelledBy</code>.
          </li>
          <li>
            <a href="https://primeng.org/multiselect" target="_blank" rel="noopener noreferrer"
              >PrimeNG — MultiSelect</a
            >
            — upstream API reference for the code base Optimus forks; every claim here re-verified against the
            shipped Optimus UI 2.0.2 source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Visually the closed control is a form field: every root token aliases the
          <code>form.field.*</code> block, so it shares the paddings and the per-style radius of the fields beside it —
          and the kit's edge, icon, invalid, focus, and dark fill rules (below). The panel brings
          its own metrics — and
          its own answer for what a selected row looks like.
        </p>

        <h3>Field and panel metrics</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Value (resolved)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>root font-size / paddings</td>
                <td>{{ m.rootFont }} · {{ m.rootPad }} (the formField block)</td>
              </tr>
              <tr>
                <td>root border-radius</td>
                <td>{{ m.rootRadius }}</td>
              </tr>
              <tr>
                <td>dropdown trigger width</td>
                <td>{{ m.dropdownWidth }}</td>
              </tr>
              <tr>
                <td>list padding / gap</td>
                <td>{{ m.listPad }} / {{ m.listGap }}</td>
              </tr>
              <tr>
                <td>option padding / radius / gap</td>
                <td>{{ m.optionPad }} / {{ m.optionRadius }} / {{ m.optionGap }}</td>
              </tr>
              <tr>
                <td>panel header padding</td>
                <td>{{ m.headerPad }}</td>
              </tr>
              <tr>
                <td>chip border-radius</td>
                <td>{{ m.chipRadius }}</td>
              </tr>
              <tr>
                <td>invalid border</td>
                <td>{{ m.invalidBorder }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aliases from <code>&#64;openng/optimus-ui-themes/dist/aura/multiselect/index.mjs</code>, resolved through the semantic
          base of the same package (Aura 2.x — Optimus' themes fork keeps the 2.x values); the radius steps are each visual
          style's <code>presetOverrides.primitive.borderRadius</code> in <code>ui-styles.ts</code>.
        </p>

        <h3>What the kit restyles, and what it leaves</h3>
        <p>
          The kit's <code>.p-multiselect</code> rules in <code>styles.scss</code> re-point the element's own tokens and
          draw the one kit focus ring; every pair below is gated in <code>docs/generated/CONTRAST.MD</code>.
        </p>
        <ul>
          <li>
            <strong>Focus is the kit ring.</strong> The root's focus ring aliases the zeroed
            <code>&#123;form.field.focus.ring.*&#125;</code> (<code>&#64;openng/optimus-ui-themes/dist/aura/multiselect/index.mjs</code>),
            so the kit's <code>.p-multiselect:not(.p-disabled).p-focus</code> rule draws 2px solid
            <code>--primary-color-fg</code> at 2px offset, plus a border in the same color (<code>!important</code>,
            both modes) &#8212; the same ring as select and the text fields ("focus ring", 3.88:1 and up). In the
            panel, the keyboard-active option (<code>.p-multiselect-option.p-focus</code>) carries the same ring drawn
            inside it, over Aura's faint focus tint ("option list focus", 3.48:1 and up).
          </li>
          <li>
            <strong>The edge, chevron, and invalid edge are kit tokens.</strong> Resting edge
            <code>--control-border</code>, 3.25&#8211;5.51:1 against ground, card, and the field's own fill ("form field
            edge", <code>multiselect.border.color</code>); dropdown chevron and clear icon
            <code>--text-color-secondary</code>, 4.79&#8211;7.78:1 ("form field icon"); invalid edge
            <code>--semantic-red-fg</code>, the red the text fields use.
          </li>
          <li>
            <strong>Dark mode takes the fields' fill.</strong> Like a dark <code>p-select</code> and
            <code>pInputText</code>, a dark multiselect fills <code>--surface-section</code> with
            <code>--text-color</code> and <code>--control-placeholder</code> (<code>.dark-theme .p-multiselect</code>;
            Aura's <code>&#123;surface.950&#125;</code> read as a black slab beside them): value 9.35:1 and up,
            placeholder 4.76:1 and up ("form field text"). Its panel filter is a <code>pInputText</code> and takes the text
            field's style border and ring.
          </li>
        </ul>

        <h3>The highlighted selected row</h3>
        <p>
          Optimus' Aura 2.x aliases <code>option.selectedBackground</code> and
          <code>option.selectedFocusBackground</code> to <code>&#123;list.option.selected.background&#125;</code> and
          <code>&#123;list.option.selected.focus.background&#125;</code>, which the semantic base resolves to
          <code>&#123;highlight.background&#125;</code> — <code>&#123;primary.50&#125;</code> in light,
          a <code>color-mix</code> of <code>&#123;primary.400&#125;</code> in dark. The tint applies while
          <code>highlightOnSelect</code> is true, its default (<code>openng-optimus-ui-multiselect.mjs:677</code>), so a
          selected option is carried by the tint <em>and</em> the checkbox. PrimeNG 22's Aura 3.0 pinned both tokens to the literal
          <code>transparent</code> and left the checkbox as the only carrier; that assumption does not survive the
          switch. What is worth checking instead is the tint's contrast against your own primary ramp.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          The closed field behaves like every form field: full width in its column, the summary label truncates with an
          ellipsis rather than wrapping. The overlay panel keeps its own width tied to the trigger and scrolls
          internally past
          <code>scrollHeight</code> (default 200px) — on very narrow screens chips wrap inside the field, which grows in
          height; prefer comma display where vertical space is tight.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Under the surface this is the editable base plus a listbox: the form contract is inherited, the templates are
          reference names, and the keyboard map is the APG's.
        </p>

        <h3>The inherited form contract</h3>
        <p>
          <code>MultiSelect extends BaseEditableHolder</code>
          (<code>openng-optimus-ui-multiselect.mjs:338</code>): <code>required</code>, <code>invalid</code>,
          <code>disabled</code>, <code>name</code> and the ControlValueAccessor arrive from the base — the model is an
          array, and <code>invalid</code> stays a manual boolean. The wiring pattern, timing gate included, is the
          <strong>Forms</strong> guide's ground.
        </p>

        <h3>Template reference names</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Reference</th>
                <th>Renders</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>option row</td>
                <td><code>#item</code></td>
                <td>one option's content</td>
              </tr>
              <tr>
                <td>field content</td>
                <td><code>#selecteditems</code></td>
                <td>the closed field's summary</td>
              </tr>
              <tr>
                <td>group header</td>
                <td><code>#group</code></td>
                <td>an option-group row</td>
              </tr>
              <tr>
                <td>panel chrome</td>
                <td><code>#header</code> · <code>#filter</code> · <code>#footer</code></td>
                <td>above / instead of the filter / below the list</td>
              </tr>
              <tr>
                <td>empty states</td>
                <td><code>#empty</code> · <code>#emptyfilter</code></td>
                <td>no options / no filter match</td>
              </tr>
              <tr>
                <td>icons</td>
                <td><code>#dropdownicon</code> · <code>#chipicon</code> · <code>#itemcheckboxicon</code></td>
                <td>trigger, chip remove, option checkbox</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Content-child reference names from the shipped component queries
          (<code>openng-optimus-ui-multiselect.mjs:1846</code>). The same query block still carries the v21
          <code>PrimeTemplate</code> predicate, so the older <code>pTemplate="item"</code> form binds again in Optimus —
          PrimeNG 22 had dropped it. Use the reference names; they are the form the whole kit is written in.
        </p>

        <h3>Keyboard map</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ArrowDown / ArrowUp</td>
                <td>open the panel, then move the active option</td>
              </tr>
              <tr>
                <td>Home / End · PageUp / PageDown</td>
                <td>jump within the list</td>
              </tr>
              <tr>
                <td>Space / Enter</td>
                <td>toggle the active option</td>
              </tr>
              <tr>
                <td>Shift + arrows</td>
                <td>extend the selection as a range</td>
              </tr>
              <tr>
                <td>Ctrl/Cmd + A</td>
                <td>select every visible option — selects, never toggles</td>
              </tr>
              <tr>
                <td>printable characters</td>
                <td>open and search (the filter input, when shown, takes them)</td>
              </tr>
              <tr>
                <td>Escape</td>
                <td>close the panel, focus back on the field</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The keydown switch in the shipped source (<code>openng-optimus-ui-multiselect.mjs:1289-1344</code>, Ctrl/Cmd+A at
          <code>:1329</code>).
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>☐ Visible caption wired to the combobox via <code>ariaLabelledBy</code>.</li>
          <li>☐ <code>optionValue</code> or <code>dataKey</code> set whenever the model outlives the options array.</li>
          <li>
            ☐ Overflow label translated — <code>selectedItemsLabel</code> or a bridged <code>selectionMessage</code>.
          </li>
          <li>
            ☐ <code>filter</code> switched off under ~8 options; <code>resetFilterOnHide</code> considered where it
            stays on.
          </li>
          <li>☐ <code>appendTo="body"</code> inside any clipping container.</li>
          <li>
            ☐ Invalid state bound through the form's timing gate, the error text visible and its id appended to
            <code>ariaLabelledBy</code>.
          </li>
          <li>
            ☐ Keyboard focus on the closed field shows the kit ring (<code>.p-multiselect.p-focus</code>) — or your own,
            outside this kit.
          </li>
          <li>
            ☐ Verified in the accessibility tree: the combobox's name is the caption, the list reports multiselectable,
            options report checked state.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Three of this component's strings come from the library's own translation config — and the kit's bridge
          already pushes the ARIA ones. The fourth is the trap.
        </p>

        <h3>Who translates what</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Source</th>
                <th>In the kit's bridge?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>list name</td>
                <td><code>aria.listLabel</code></td>
                <td>yes — among the pushed keys</td>
              </tr>
              <tr>
                <td>header checkbox name</td>
                <td><code>aria.selectAll</code> / <code>aria.unselectAll</code></td>
                <td>yes — both pushed</td>
              </tr>
              <tr>
                <td>overflow summary ("{{ '{' }}0{{ '}' }} items selected")</td>
                <td>top-level <code>selectionMessage</code></td>
                <td><strong>no</strong> — the bridge forwards <code>aria.*</code> only</td>
              </tr>
              <tr>
                <td>placeholder, option labels, caption, errors</td>
                <td>your keys via the kit's translation service</td>
                <td>n/a</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Label sources in the shipped source (<code>openng-optimus-ui-multiselect.mjs:999,:1002,:1269-1276</code>; default string
          <code>openng-optimus-ui-config.mjs:170</code>); the bridge mechanics and its key list are
          <strong>I18n &amp; Localization</strong>'s ground.
        </p>
        <p>
          So: a kit form that can exceed <code>maxSelectedLabels</code> shows an English summary in every language until
          you pass <code>[selectedItemsLabel]</code> a translated string (keep the
          <code>{{ '{' }}0{{ '}' }}</code> placeholder — the count is substituted into it) or extend the bridge beyond
          <code>aria.*</code>.
        </p>

        <h3>Where longer text pushes</h3>
        <ul>
          <li>
            <strong>Comma display</strong> truncates with an ellipsis — expansion costs visibility, not layout. The
            panel keeps every full label.
          </li>
          <li>
            <strong>Chips</strong> wrap and grow the field vertically; long option labels make tall fields in expanding
            languages — another reason comma display is the dense-form default.
          </li>
          <li>
            <strong>The filter placeholder</strong> (<code>filterPlaceHolder</code>) and the searchbox name
            (<code>ariaFilterLabel</code>) are your keys, budgeted like any label (~1.4×).
          </li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Synced with the contrast and focus rounds: a dark multiselect
            fills <code>--surface-section</code> with the fields' text and placeholder, so the "keeps Aura's fill" note
            is gone; edge and icon ranges re-cited from "form field edge" and "form field icon".
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the kit now rings
            <code>.p-multiselect.p-focus</code> and the active option, and re-points its edge (<code>--control-border</code>), chevron and clear
            icon (<code>--text-color-secondary</code>), and invalid edge (<code>--semantic-red-fg</code>), all gated; the
            Design section, the invalid-border row, the checklist, and the agent doc say so.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016). Radii are now per style;
            a new Design section states what the kit does not restyle — no focus ring reaches
            <code>.p-multiselect</code> (border tint only), dark mode keeps Aura's field fill, and the stock edge stays under
            3:1 where the gated select, textarea, and input edges pass — with a matching checklist line. <code>highlightOnSelect</code> named as the
            switch behind the selected-row tint. The agent doc folds the stray geometry note into Pitfalls and
            sits under the size aim. The invalid example no longer claims a full triple: the combobox has no
            <code>aria-invalid</code> or <code>ariaDescribedBy</code> route, so the error's id joins
            <code>ariaLabelledBy</code>.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Two claims flipped: the
            selected row is no longer transparent — Aura 2.x aliases <code>option.selectedBackground</code> to
            <code>&#123;highlight.background&#125;</code> — and <code>overlayVisible</code> lost its
            <code>overlayVisibleChange</code> output, so it is a one-way input again; the v21
            <code>PrimeTemplate</code> query survives, so <code>pTemplate</code> binds once more. All line refs
            re-derived against the Optimus bundles (inputs are plain properties, not signals), and the panel metrics
            re-read off the Aura 2.x base (dropdown 2.5rem, option padding 0.5rem 0.75rem, header padding
            0.5rem 1rem 0.25rem 1rem).
          </li>
          <li>
            <strong>v0.1</strong> — 2026-08-24 — Initial guide, measured off primeng&#64;22.1.2 and the Aura 3.0 token
            files: the checkbox listbox behind a combobox trigger, the three-label overflow and its untranslated
            default, the filter that ships enabled, the transparent selected row, and the inherited editable-base
            contract. Resolves the <code>planned:multiselect</code> references from the select and autocomplete guides.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class MultiselectArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Demo data -----------------------------------------------------------
  readonly topicOptions = [
    { label: 'Neural networks', value: 'nn' },
    { label: 'Prompting', value: 'prompting' },
    { label: 'Embeddings', value: 'embeddings' },
    { label: 'Fine-tuning', value: 'finetuning' },
    { label: 'Evaluation', value: 'evaluation' },
  ];
  readonly countryOptions = [
    { label: 'Argentina', value: 'ar' },
    { label: 'Australia', value: 'au' },
    { label: 'Austria', value: 'at' },
    { label: 'Belgium', value: 'be' },
    { label: 'Brazil', value: 'br' },
    { label: 'Canada', value: 'ca' },
    { label: 'Denmark', value: 'dk' },
    { label: 'Finland', value: 'fi' },
    { label: 'France', value: 'fr' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp' },
    { label: 'Netherlands', value: 'nl' },
    { label: 'Norway', value: 'no' },
    { label: 'Portugal', value: 'pt' },
    { label: 'Spain', value: 'es' },
    { label: 'Sweden', value: 'se' },
  ];
  readonly severityOptions = [
    { label: 'Info', value: 'info' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  // --- Demo state ----------------------------------------------------------
  readonly commaPick = signal<string[]>(['nn', 'prompting']);
  readonly chipPick = signal<string[]>(['embeddings', 'evaluation']);
  readonly filterPick = signal<string[]>([]);
  readonly requiredPick = signal<string[]>([]);
  readonly ddBadPick = signal<string[]>([]);
  readonly ddGoodPick = signal<string[]>([]);
  readonly ddFilterBad = signal<string[]>([]);
  readonly ddFilterGood = signal<string[]>([]);

  // --- Measured values (flat, so the tab extractor resolves them) ---------
  readonly m = {
    rootFont: 'no base token (sm 0.875rem · lg 1.125rem)',
    rootPad: '0.75rem / 0.5rem',
    rootRadius: '{form.field.border.radius} = border.radius.md: 0 Werkbund, 12px Lernwerkstatt, 10px Skizzenbuch, 2px Blaupause',
    dropdownWidth: '2.5rem',
    listPad: '0.25rem 0.25rem',
    listGap: '2px',
    optionPad: '0.5rem 0.75rem',
    optionRadius: 'border.radius.sm (0 / 8px / 6px / 2px per style)',
    optionGap: '0.5rem',
    headerPad: '0.5rem 1rem 0.25rem 1rem',
    chipRadius: 'border.radius.sm (0 / 8px / 6px / 2px per style)',
    invalidBorder: '--semantic-red-fg (kit token; Aura red.400 / red.300)',
  };

  // --- Flat string constants: these resolve wherever the tab is read ------
  readonly wiringSnippet: string = '<span class="field-label" id="fx-topics-label">{{ t(\'form.topicsLabel\') }}</span>\n' +
    '<p-multiselect\n' +
    '  inputId="fx-topics"\n' +
    '  [ariaLabelledBy]="shows(\'topics\') ? \'fx-topics-label fx-topics-err\' : \'fx-topics-label\'"\n' +
    '  [options]="topicOptions()"\n' +
    '  optionLabel="label"\n' +
    '  optionValue="value"      <!-- primitive model values; or dataKey="id" -->\n' +
    '  [filter]="false"          <!-- it defaults to ON -->\n' +
    '  [selectedItemsLabel]="t(\'form.topicsSelected\')"  <!-- keeps {0} -->\n' +
    '  appendTo="body"\n' +
    '  [invalid]="shows(\'topics\')"\n' +
    '  [ngModel]="topics()" (ngModelChange)="topics.set($event)"\n' +
    '  name="topics"\n' +
    '/>\n' +
    '@if (shows(\'topics\')) {\n' +
    '  <small id="fx-topics-err">{{ t(\'form.topicsError\') }}</small>\n' +
    '}';
}
