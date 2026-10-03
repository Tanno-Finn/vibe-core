import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: DatePicker (Guides, category `library`).
 *
 * A text field welded to a calendar dialog. Every claim below was read off the
 * shipped source of Optimus UI 2.0.2; `openng-optimus-ui-datepicker.mjs` (4459
 * lines) is the fesm2022 flat bundle of that name.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - Trigger is a real `<input type="text" role="combobox">` carrying `pInputText`,
 *     `[attr.id]="inputId"`, `aria-haspopup="dialog"`, `aria-autocomplete="none"`,
 *     `[attr.aria-expanded]`, `[attr.aria-controls]`, `[attr.aria-labelledby]`,
 *     `[attr.aria-label]` (openng-optimus-ui-datepicker.mjs:3287-3325). Because it is a real
 *     input with an id, `<label for>` binds — unlike the select's span combobox.
 *   - Panel: `role="dialog"`/`aria-modal="true"` only when NOT inline, named by
 *     `getTranslation('chooseDate')` (:3369-3375).
 *   - Grid: `<table role="grid">` (:3459); the focusable element is a `<span>`
 *     inside the `<td>` (:3479-3486) with no role of its own; the `<td>` carries
 *     `[attr.aria-label]="date.day"` — the bare day number (:3477). No
 *     `aria-current`, `aria-selected` or `aria-disabled` anywhere in the bundle
 *     (grep over the file returns nothing for all three).
 *   - Selected cell announces through a `p-hidden-accessible` `aria-live="polite"`
 *     div whose content is `{{ date.day }}` (:3496-3498); month and year views do
 *     the same with `{{ m }}` / `{{ y }}` (:3509, :3517).
 *   - Clear affordance under `showClear` is an `<svg>` with `(click)="clear()"`
 *     and no tabindex, role, or label (:3326-3331). The button-bar Clear is a real
 *     `p-button` labeled `getTranslation('clear')` (:3732).
 *   - Trigger icon: `iconDisplay === 'button'` renders a `<button type="button">`
 *     labeled `iconButtonAriaLabel` (:3332-3350); `iconDisplay === 'input'`
 *     renders an `<svg>` with `(click)` and no button (:3351-3356). Default
 *     `iconDisplay = 'button'` (:325), but `showIcon` is undefined by default (:409).
 *   - Opening by keyboard: `onInputFocus` opens only when `showOnFocus` (:default
 *     true, :467); `onInputKeydown` handles ArrowDown by `trapFocus` and only
 *     `if (this.contentViewChild)` (:1806-1810), which exists once the overlay is
 *     rendered. There is no Alt+ArrowDown handler.
 *   - Day-cell keyboard map in `onDateCellKeydown` (:1831-1990): arrows 37-40,
 *     Enter 13 / Space 32 select, Esc 27 closes and refocuses the input,
 *     PageUp 33 / PageDown 34 move one month, Home 36 / End 35 jump to the first
 *     and last day of the month, Tab 9 calls `trapFocus` when not inline.
 *   - `focusTrap` defaults true (:562). In `trapFocus` (:2274-2324) the two
 *     `if (!this.focusTrap …)` arms are the only ones that call `hideOverlay()`.
 *   - `onUserInput` returns immediately unless `isKeydown` is true, and `isKeydown`
 *     is set only in `onInputKeydown` (:1807). A value that arrives without a
 *     keydown never reaches the model.
 *   - `getDateFormat()` is `this.dateFormat || this.getTranslation('dateFormat')`
 *     (:2824-2825); `getFirstDateOfWeek()` is
 *     `this._firstDayOfWeek || this.getTranslation(FIRST_DAY_OF_WEEK)` (:2827-2828).
 *     Both are `||`, so a falsy author value falls through to the config value —
 *     which is what makes `[firstDayOfWeek]="0"` unable to force Sunday.
 *   - `locale` is a getter over `_locale` with no `@Input` and no assignment
 *     anywhere in the bundle (:947, :959-961) — a dead read-only member.
 *   - Translation reactivity: `onInit` subscribes to `config.translationObserver`
 *     and calls `createWeekDays()` + `markForCheck()` (:992-995).
 *   - Optimus config defaults for the date vocabulary sit at the TOP level of the
 *     translation object, not inside `aria`: `dayNamesMin`, `monthNames`,
 *     `chooseDate`, `prevMonth`, `today`, `weekHeader`, `dateFormat: 'mm/dd/yy'`,
 *     `firstDayOfWeek: 0` (openng-optimus-ui-config.mjs:138-163). `setTranslation`
 *     merges one level deep (:246-249).
 *   - `createResponsiveStyle()` does nothing unless `numberOfMonths > 1 && responsiveOptions`
 *     (:3136); it injects a `<style>` into `document.body` carrying the CSP nonce
 *     from config (:3138-3142).
 *   - Tokens from `@openng/optimus-ui-themes/dist/aura/datepicker/index.mjs`
 *     (single-line dist bundle, cited by export name): `date` width/height 2rem,
 *     borderRadius 50%, padding 0.25rem, focusRing from the GLOBAL `{focus.ring.*}`
 *     group; `dropdown` width 2.5rem / sm 2rem / lg 3rem; `today` background
 *     `{surface.200}` light and `{surface.700}` dark.
 *   - Global `{focus.ring.*}` is 1px solid `{primary.color}` at 2px offset
 *     (@openng/optimus-ui-themes/dist/aura/base/index.mjs), while the shared
 *     `form.field.focusRing` group is zeroed. The kit's one ring rule in
 *     `src/styles.scss` (2px --primary-color-fg, 2px offset, !important) covers
 *     every focusable part: the input (`.p-inputtext`), the trigger
 *     (`.p-datepicker-dropdown`), day / month / year cells, the month and year
 *     selectors, and the panel's `p-button`s — so Aura's 1px ring never shows.
 *   - Aura's own day-ring rule: `.p-datepicker-day:focus-visible` in
 *     `@openng/optimus-ui-styles/dist/datepicker/index.mjs:242-246`; the today fill
 *     is `.p-datepicker-today > .p-datepicker-day` (:258-261), background and
 *     color only.
 *   - `docs/generated/CONTRAST.MD` has no calendar-panel row in any style block;
 *     the field is a `pInputText`, so its `form field text` / `form field edge`
 *     rows (`inputtext.*`, `input.p-inputtext`) apply to it, both modes, and so
 *     does the kit's `input.p-inputtext.p-invalid` red. The `.p-datepicker`
 *     token rule re-points the in-field icon (`iconDisplay="input"`) to
 *     --text-color-secondary and the trigger button's edge (rest,
 *     hover, active) to --control-border — rows `datepicker.dropdown.border.color`
 *     ("form field edge") and `datepicker.dropdown.color` ("form field icon").
 *   - Panel motion is `p-motion` (:3359); `@openng/optimus-ui-motion` 2.0.2 reads
 *     the computed transition/animation duration and has no reduced-motion branch
 *     of its own, so the kit's global `prefers-reduced-motion` block in
 *     `src/styles.scss` is what shortens it.
 *   - `formatDate` treats `yy` as the four-digit year (:2882-2883), so
 *     `mm/dd/yy` renders 07/15/2026 and `dd.mm.yy` 15.07.2026 — the kit's en-US
 *     and de-DE numeric house style (`src/app/utils/date-locale.ts`).
 */
@Component({
  selector: 'app-datepicker-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, DatePickerModule, FormsModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'datepicker'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          One control, two input methods that must agree: a text field a person can type into, and a calendar dialog
          they can walk with the arrow keys. Everything below is the same component with different props — what changes
          is which of the two halves is reachable, and what the calendar is willing to say about itself.
        </p>

        <h3>The everyday shape</h3>
        <div class="stage stage--col">
          <label class="field-label" for="dp-basic">Departure date</label>
          <p-datepicker inputId="dp-basic" [showIcon]="true" [(ngModel)]="single" />
          <span class="hint">{{ m.basicHint }}</span>
        </div>

        <h3>Selection modes</h3>
        <div class="stage stage--row stage--wrap">
          <div class="col">
            <label class="field-label" for="dp-range">Range</label>
            <p-datepicker inputId="dp-range" selectionMode="range" [showIcon]="true" [(ngModel)]="range" />
          </div>
          <div class="col">
            <label class="field-label" for="dp-multi">Multiple</label>
            <p-datepicker inputId="dp-multi" selectionMode="multiple" [showIcon]="true" [(ngModel)]="multi" />
          </div>
          <div class="col">
            <label class="field-label" for="dp-month">Month only</label>
            <p-datepicker inputId="dp-month" view="month" dateFormat="mm/yy" [showIcon]="true" [(ngModel)]="month" />
          </div>
        </div>
        <p class="src-note">
          <code>selectionMode</code> defaults to <code>'single'</code> and <code>view</code> to
          <code>'date'</code> (<code>openng-optimus-ui-datepicker.mjs:492</code>, <code>:954</code>); the month view
          swaps the grid for a list of month names (<code>:3506-3513</code>).
        </p>

        <h3>Inline, and the button bar</h3>
        <div class="stage stage--row stage--wrap">
          <p-datepicker [inline]="true" [showButtonBar]="true" [(ngModel)]="inlineValue" />
          <p class="note">{{ m.inlineNote }}</p>
        </div>
        <p class="src-note">
          Inline drops <code>role="dialog"</code> and <code>aria-modal</code>; both are bound behind
          <code>inline ? null : …</code> (<code>openng-optimus-ui-datepicker.mjs:3374-3375</code>).
        </p>

        <h3>With a time picker</h3>
        <div class="stage stage--col">
          <label class="field-label" for="dp-time">Appointment</label>
          <p-datepicker
            inputId="dp-time"
            [showTime]="true"
            [showSeconds]="false"
            hourFormat="24"
            [showIcon]="true"
            [(ngModel)]="withTime"
          />
        </div>
        <p class="src-note">
          <code>hourFormat</code> rests at <code>'24'</code> (<code>openng-optimus-ui-datepicker.mjs:846</code>); the
          am/pm toggle only renders under <code>hourFormat="12"</code> and names itself from the <code>am</code>/<code
            >pm</code
          >
          translation keys (<code>:3683</code>, <code>:3701</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The decision is rarely “calendar or no calendar”. It is whether the value is a point on a calendar a person
          reasons about spatially, or a number they already know — and the second case is faster in three plain fields
          than in any grid.
        </p>

        <h3>Which control for which date</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The value</th>
                <th>Control</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A day chosen relative to other days — “the Friday after next”</td>
                <td><code>p-datepicker</code></td>
                <td>The grid shows weekday alignment and neighboring days; a text field does not.</td>
              </tr>
              <tr>
                <td>A date the person knows by heart — a birth date</td>
                <td>Three plain fields, or a masked text input</td>
                <td>Typing eight digits beats paging a calendar back four hundred months.</td>
              </tr>
              <tr>
                <td>A month or a quarter</td>
                <td><code>p-datepicker</code> with <code>view="month"</code></td>
                <td>The day grid is never shown, so the extra step disappears.</td>
              </tr>
              <tr>
                <td>A start and an end</td>
                <td>One <code>p-datepicker</code> with <code>selectionMode="range"</code></td>
                <td>One overlay keeps the two ends comparable; two fields let them contradict.</td>
              </tr>
              <tr>
                <td>Only a time of day</td>
                <td><code>p-datepicker</code> with <code>[timeOnly]="true"</code></td>
                <td>The calendar container is skipped and only the spinner block renders.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Modes and views are inputs of the same component: <code>selectionMode</code>, <code>view</code>,
          <code>timeOnly</code> (<code>openng-optimus-ui-datepicker.mjs:492</code>, <code>:685-691</code>,
          <code>:442</code>).
        </p>

        <h3>Name the field, and give the calendar a keyboard door</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a placeholder as the name</span>
            <div class="dd__stage">
              <p-datepicker placeholder="mm/dd/yy" />
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a visible label bound by <code>inputId</code>, plus a real trigger</span>
            <div class="dd__stage">
              <label class="field-label" for="dp-dd-good">Invoice date</label>
              <p-datepicker inputId="dp-dd-good" [showIcon]="true" iconDisplay="button" />
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The trigger is a real <code>&lt;input type="text"&gt;</code> with
          <code>[attr.id]="inputId"</code> (<code>openng-optimus-ui-datepicker.mjs:3287-3295</code>), so
          <code>&lt;label for&gt;</code> binds to it; the button variant is the arm under
          <code>iconDisplay === 'button'</code> (<code>:3332-3350</code>).
        </p>

        <h3>Clearing the field</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — <code>showClear</code> as the only way back to empty</span>
            <div class="dd__stage">
              <p-datepicker [showClear]="true" [(ngModel)]="clearDemo" />
            </div>
            <p class="dd__why">{{ m.ddClearBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the button bar, whose Clear is a real button (shown inline)</span>
            <div class="dd__stage">
              <p-datepicker [showButtonBar]="true" [inline]="true" [(ngModel)]="clearDemo2" />
            </div>
            <p class="dd__why">{{ m.ddClearGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The clear affordance is an <code>&lt;svg&gt;</code> carrying <code>(click)="clear()"</code> with no tabindex,
          role, or label (<code>openng-optimus-ui-datepicker.mjs:3326-3331</code>); the button bar renders a
          <code>p-button</code> labeled from the <code>clear</code> key (<code>:3712-3743</code>).
        </p>

        <h3>Annotated source — the shape to copy</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Two visual systems meet inside one control. The text field is painted by the kit's own stylesheet, because
          Aura leaves form fields without a focus ring; the calendar panel is painted by Aura — the kit's one
          <code>.p-datepicker</code> token rule only recolors the in-field icon. Focus is the exception: the kit's one
          ring reaches every focusable part, field and panel alike.
        </p>

        <h3>Aura tokens the panel is built from</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Datepicker token defaults, Aura preset
            </caption>
            <thead>
              <tr>
                <th>Token</th>
                <th>Value</th>
                <th>What it sizes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>date.width</code> / <code>date.height</code></td>
                <td>{{ m.dateBox }}</td>
                <td>The day cell — the pointer target</td>
              </tr>
              <tr>
                <td><code>date.borderRadius</code></td>
                <td>{{ m.dateRadius }}</td>
                <td>The round day chip</td>
              </tr>
              <tr>
                <td><code>date.selectedBackground</code></td>
                <td>{{ m.dateSelectedBg }}</td>
                <td>The chosen day</td>
              </tr>
              <tr>
                <td><code>today.background</code></td>
                <td>{{ m.todayBg }}</td>
                <td>Today's fill, light / dark</td>
              </tr>
              <tr>
                <td><code>dropdown.width</code></td>
                <td>{{ m.dropdownWidth }}</td>
                <td>The trigger button, default / sm / lg</td>
              </tr>
              <tr>
                <td><code>panel.shadow</code> / <code>panel.padding</code></td>
                <td>{{ m.panelChain }}</td>
                <td>The overlay itself</td>
              </tr>
              <tr>
                <td><code>panel.borderRadius</code></td>
                <td>{{ m.panelRadius }}</td>
                <td>The overlay corners — follow the visual style; the day chip does not</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and values from
          <code>&#64;openng/optimus-ui-themes/dist/aura/datepicker/index.mjs</code>; the rules that consume them from
          <code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs</code>. Each visual style sets the radius
          primitives in its <code>presetOverrides</code> (<code>src/app/services/ui-styles.ts</code>), which
          <code>&#123;content.border.radius&#125;</code> resolves through.
        </p>

        <h3>One focus ring across the control</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Focused element</th>
                <th>Aura alone</th>
                <th>This kit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The text field</td>
                <td>{{ m.ringNone }}</td>
                <td>{{ m.ringInput }} — <code>.p-inputtext:focus-visible</code></td>
              </tr>
              <tr>
                <td>A day, month, or year cell</td>
                <td>{{ m.ringDay }} (<code>datepicker.date.focusRing</code> → global <code>focus.ring</code>)</td>
                <td>
                  {{ m.ringInput }} — <code>.p-datepicker-day</code>, <code>-month</code>, <code>-year:focus-visible</code>
                </td>
              </tr>
              <tr>
                <td>The trigger button (<code>iconDisplay="button"</code>), month and year selectors</td>
                <td>{{ m.ringDay }} (<code>datepicker.dropdown.focusRing</code>, the same global group)</td>
                <td>{{ m.ringInput }} — <code>.p-datepicker-dropdown</code>, <code>-select-month</code>, <code>-select-year</code></td>
              </tr>
              <tr>
                <td>Prev/next and button-bar buttons in the panel</td>
                <td>{{ m.ringDay }}</td>
                <td>{{ m.ringInput }} — they are <code>p-button</code>s (<code>.p-button:focus-visible</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura's day ring is applied by <code>.p-datepicker-day:focus-visible</code>
          (<code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs:242-246</code>); the global group is 1px solid
          <code>&#123;primary.color&#125;</code> at 2px offset
          (<code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>), while the shared
          <code>form.field.focusRing</code> group is zeroed. The kit's one ring rule in <code>src/styles.scss</code>
          lists every part above, so the whole control shows one ring, gated as "focus ring" in
          <code>docs/generated/CONTRAST.MD</code> (3.88:1 and up on the page surfaces).
        </p>
        <p>{{ m.ringVerify }}</p>

        <h3>Today is marked by fill alone</h3>
        <p>{{ m.todayProse }}</p>
        <p class="src-note">
          <code>.p-datepicker-today &gt; .p-datepicker-day</code> sets only <code>background</code> and
          <code>color</code> (<code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs:258-261</code>); no
          <code>aria-current</code> appears anywhere in <code>openng-optimus-ui-datepicker.mjs</code>.
        </p>

        <h3>Contrast</h3>
        <p>{{ m.contrastProse }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code>, <code>werkbund</code> rows under <code>form field text</code>:
          <code>inputtext.color</code> on <code>inputtext.background</code> is 10.35:1 light / 13.32:1 dark, and
          <code>inputtext.placeholder.color</code> on the same background 4.76:1 light / 5.91:1 dark (SC 1.4.3 needs
          4.5:1); under <code>form field edge</code>, the style outline on <code>inputtext.background</code> is 18.73:1 /
          13.32:1 (SC 1.4.11 needs 3:1). The other three styles carry the same rows. An invalid field takes the kit's
          <code>--semantic-red-fg</code> edge (<code>inputtext.invalid.border.color</code>, 6.47:1 light / 7.93:1 dark).
          The in-field icon (<code>iconDisplay="input"</code>) takes <code>--text-color-secondary</code> from the
          kit's <code>.p-datepicker</code> rule — the value the <code>password.icon.color</code> row measures on the same
          field, 7.78:1 / 5.91:1 ("form field icon"; Aura's surface.400 was 2.56:1 on white). The trigger button's edge
          is the kit's <code>--control-border</code> in every state (Aura's slate.300 was 1.48:1 on white):
          <code>datepicker.dropdown.border.color</code> 3.74&#8211;5.51:1 on ground, card, and its own fill ("form field
          edge"), and its icon <code>datepicker.dropdown.color</code> 6.92:1 light / 10.08:1 dark ("form field icon").
          No calendar-panel pair is in the gate.
        </p>

        <h3>On a narrow screen</h3>
        <p>{{ m.responsiveProse }}</p>
        <p class="src-note">
          <code>createResponsiveStyle()</code> returns without doing anything unless
          <code>numberOfMonths &gt; 1 &amp;&amp; responsiveOptions</code>
          (<code>openng-optimus-ui-datepicker.mjs:3136</code>); the media queries it writes only hide surplus month
          groups. <code>touchUI</code> is the separate opt-in that skips the positioning branch altogether and adds a
          full-screen modal mask (<code>:2743-2746</code>, <code>:2769-2775</code>); neither the mask rule
          (<code>&#64;openng/optimus-ui-styles/dist/base/index.mjs:57-65</code>) nor the datepicker styles hold a rule
          that centers the panel. The inline panel is the one shipped exception to the width claim:
          <code>.p-datepicker-panel-inline</code> sets <code>overflow-x: auto</code>
          (<code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs:99-103</code>), while the overlay panel has
          <code>width: auto</code> and no overflow rule (<code>:89-97</code>).
        </p>

        <h3>Motion</h3>
        <p>{{ m.motionProse }}</p>
        <p class="src-note">
          The panel is wrapped in <code>p-motion</code> (<code>openng-optimus-ui-datepicker.mjs:3359</code>);
          <code>&#64;openng/optimus-ui-motion</code> 2.0.2 reads the computed transition and animation durations and
          has no reduced-motion branch of its own. The kit's global <code>prefers-reduced-motion</code> block in
          <code>src/styles.scss</code> sets both to 0.01ms rather than none, so the <code>animationend</code> the
          <code>touchUI</code> mask waits for (<code>:2786-2787</code>) still fires.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          The component is a <code>ControlValueAccessor</code> over a <code>Date</code>, a <code>Date[]</code> or a
          string, depending on two independent props. Most of the surprises live where an author's value and a config
          value meet.
        </p>

        <h3>Keyboard, inside the grid</h3>
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
                <td><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd></td>
                <td>Move one day / one week; crossing an edge pages the month</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> <kbd>Space</kbd></td>
                <td>Select the focused day</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> <kbd>PageDown</kbd></td>
                <td>Same day, previous / next month</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> <kbd>End</kbd></td>
                <td>First / last day of the displayed month</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>Close the panel and return focus to the field</td>
              </tr>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>
                  Cycles inside the panel while <code>focusTrap</code> is on; with it off only the forward edge closes
                  it — Shift+Tab on the first element returns before <code>preventDefault()</code>, so focus
                  leaves a panel that stays open
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          All of it is one switch in <code>onDateCellKeydown</code>
          (<code>openng-optimus-ui-datepicker.mjs:1831-1990</code>); the Tab split is the
          <code>focusTrap</code> branch of <code>trapFocus</code> (<code>:2274-2324</code>), which calls
          <code>hideOverlay()</code> only in its forward-edge arm (<code>:2314</code>) and when the focus is not in the
          panel at all (<code>:2289</code>); the backward edge returns without closing (<code>:2291</code>).
          <code>focusTrap</code> defaults to <code>true</code> (<code>:562</code>).
        </p>

        <h3>Inputs that do less than their name suggests</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>What actually happens</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>locale</code></td>
                <td>{{ m.deadLocale }}</td>
              </tr>
              <tr>
                <td><code>[firstDayOfWeek]="0"</code></td>
                <td>{{ m.deadFirstDay }}</td>
              </tr>
              <tr>
                <td>Programmatic or non-keyboard input</td>
                <td>{{ m.deadUserInput }}</td>
              </tr>
              <tr>
                <td><code>iconAriaLabel</code> without <code>showIcon</code></td>
                <td>{{ m.deadIconLabel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>locale</code> is a getter over <code>_locale</code> with no <code>&#64;Input</code> and no assignment in
          the bundle (<code>openng-optimus-ui-datepicker.mjs:947</code>, <code>:959-961</code>);
          <code>getFirstDateOfWeek()</code> is a <code>||</code> fallback (<code>:2827-2828</code>);
          <code>onUserInput</code> returns early unless <code>isKeydown</code> is set, which happens only in
          <code>onInputKeydown</code> (<code>:1807</code>).
        </p>

        <h3>Opening the panel from the keyboard</h3>
        <p>{{ m.openProse }}</p>
        <pre class="code-block"><code>{{ openSnippet }}</code></pre>
        <p class="src-note">
          <code>onInputFocus</code> opens only under <code>showOnFocus</code>, which defaults to
          <code>true</code> (<code>openng-optimus-ui-datepicker.mjs:467</code>); the ArrowDown arm of
          <code>onInputKeydown</code> is guarded by <code>this.contentViewChild</code> (<code>:1808</code>), which
          exists once the overlay has been rendered.
        </p>

        <h3>Value shape</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Props</th>
                <th>Model value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>default</td>
                <td><code>Date</code></td>
              </tr>
              <tr>
                <td><code>selectionMode="multiple"</code></td>
                <td><code>Date[]</code>, capped by <code>maxDateCount</code></td>
              </tr>
              <tr>
                <td><code>selectionMode="range"</code></td>
                <td><code>[start, end]</code> — the second entry stays <code>null</code> until the range closes</td>
              </tr>
              <tr>
                <td><code>dataType="string"</code></td>
                <td>The formatted string, not a <code>Date</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>dataType</code> rests at <code>'date'</code> and <code>selectionMode</code> at
          <code>'single'</code> (<code>openng-optimus-ui-datepicker.mjs:487</code>, <code>:492</code>);
          <code>isValidSelection</code> accepts a range of length 1 and otherwise requires
          <code>value[1] &gt;= value[0]</code>.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>A visible label, bound with <code>&lt;label for&gt;</code> + <code>inputId</code> (it works here).</li>
          <li>A keyboard-reachable way to open: leave <code>showOnFocus</code> on, or ship the trigger button.</li>
          <li>
            Never rely on the <code>showClear</code> icon alone — add the button bar or a labeled button of your own.
          </li>
          <li>State the expected format next to the field; the placeholder is not a substitute for it.</li>
          <li>Push the date vocabulary through <code>Optimus.setTranslation</code> on every language change.</li>
          <li>Check the announced day: the cell's name is the bare number, so the month must come from elsewhere.</li>
          <li>Under <code>appendTo="body"</code>, confirm the panel is still inside the dialog's focus scope.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Almost nothing in this control is translated by your template. Month names, weekday abbreviations, the two bar
          buttons and every navigation label are read from the Optimus config object at render time — and the kit's
          existing language sync does not touch any of them.
        </p>

        <h3>Where each string comes from</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>placeholder</code>, <code>ariaLabel</code>, <code>iconAriaLabel</code></td>
                <td>Your template — bind them to translation keys</td>
              </tr>
              <tr>
                <td>Weekday heads, month names, month abbreviations</td>
                <td>Optimus config: <code>dayNamesMin</code>, <code>monthNames</code>, <code>monthNamesShort</code></td>
              </tr>
              <tr>
                <td>Panel name, navigation buttons, week column head</td>
                <td>
                  <code>chooseDate</code>, <code>prevMonth</code>/<code>nextMonth</code>,
                  <code>prevYear</code>/<code>nextYear</code>, <code>prevDecade</code>/<code>nextDecade</code>,
                  <code>weekHeader</code>
                </td>
              </tr>
              <tr>
                <td>Button bar</td>
                <td><code>today</code>, <code>clear</code></td>
              </tr>
              <tr>
                <td>Time spinner labels and am/pm</td>
                <td><code>prevHour</code>…<code>nextSecond</code>, <code>am</code>, <code>pm</code></td>
              </tr>
              <tr>
                <td>Date format and week start</td>
                <td><code>dateFormat</code>, <code>firstDayOfWeek</code> — config, unless you override the input</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Defaults for every key above sit at the top level of the config translation object
          (<code>openng-optimus-ui-config.mjs:138-163</code>): English names, <code>dateFormat: 'mm/dd/yy'</code>,
          <code>firstDayOfWeek: 0</code>. The component reads them through <code>getTranslation(…)</code> in its
          template (<code>openng-optimus-ui-datepicker.mjs:3463</code>, <code>:3719</code>, <code>:3732</code>) and in
          the <code>prevIconAriaLabel</code>/<code>nextIconAriaLabel</code> getters (<code>:965-970</code>).
        </p>

        <h3>The gap you have to close yourself</h3>
        <p>{{ m.i18nGapProse }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> merges one level deep and then pushes the whole object through
          <code>translationSource</code> (<code>openng-optimus-ui-config.mjs:246-249</code>); the component subscribes
          to that observable in <code>onInit</code> and rebuilds its weekday row
          (<code>openng-optimus-ui-datepicker.mjs:992-995</code>). The kit's own sync method in
          <code>optimus-a11y.service.ts</code> is the pattern to extend, not to replace; the locale comes from
          <code>dateLocaleFor()</code> in <code>src/app/utils/date-locale.ts</code>, the same mapping every other date
          in the kit is formatted with.
        </p>

        <h3>Two things a language switch will not fix on its own</h3>
        <ul class="checklist">
          <li>{{ m.i18nFormatNote }}</li>
          <li>{{ m.i18nWeekNote }}</li>
        </ul>
        <p class="src-note">
          Both are <code>||</code> fallbacks: <code>getDateFormat()</code> and <code>getFirstDateOfWeek()</code>
          (<code>openng-optimus-ui-datepicker.mjs:2824-2828</code>). In the format grammar <code>yy</code> is the
          four-digit year (<code>:2882-2883</code>); the week builder reads <code>dayNamesMin</code>
          (<code>:1074-1082</code>).
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            v1.3 — 2026-09-23 — Synced with the contrast and focus rounds: the trigger button's edge is the kit's
            <code>--control-border</code> and it and the trigger icon are gated ("form field edge", "form field icon").
          </li>
          <li>
            v1.2 — 2026-09-23 — Synced with the contrast and focus rounds: the in-field icon is the kit's
            <code>--text-color-secondary</code>, the invalid edge <code>--semantic-red-fg</code>, and the kit's one 2px
            ring now covers the field, trigger, cells, selectors, and panel buttons — the "two rings" table became
            "Aura alone vs. this kit". The trigger's stock edge is named as ungated.
          </li>
          <li>
            v1.1 — 2026-09-23 — Contrast cites the field's rows in the compilat; the date vocabulary follows the kit's
            date locales (en-US, de-DE); panel radius per visual style; motion under reduced motion.
          </li>
          <li>v1.0 — 2026-09-06 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-datepicker-article .stage {
        padding: 1rem;
        background: var(--surface-section);
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
      }

      app-datepicker-article .stage--col {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        align-items: flex-start;
      }

      app-datepicker-article .stage--row {
        display: flex;
        gap: 1.5rem;
        align-items: flex-start;
      }

      app-datepicker-article .stage--wrap {
        flex-wrap: wrap;
      }

      app-datepicker-article .col {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      app-datepicker-article .field-label {
        font-weight: 600;
        font-size: 0.85rem;
      }

      app-datepicker-article .hint,
      app-datepicker-article .note {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        max-width: 28rem;
      }

      app-datepicker-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      app-datepicker-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      app-datepicker-article .dd__stage {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        align-items: flex-start;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 4.5rem;
      }

      app-datepicker-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-datepicker-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-datepicker-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-datepicker-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-datepicker-article .checklist,
      app-datepicker-article .history {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-datepicker-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DatePickerArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly single = signal<Date | null>(null);
  readonly range = signal<Date[] | null>(null);
  readonly multi = signal<Date[] | null>(null);
  readonly month = signal<Date | null>(null);
  readonly inlineValue = signal<Date | null>(null);
  readonly withTime = signal<Date | null>(null);
  readonly clearDemo = signal<Date | null>(new Date(2026, 8, 6));
  readonly clearDemo2 = signal<Date | null>(new Date(2026, 8, 6));

  /** Flat measurement and prose constants — substituted by the tab extractor. */
  readonly m = {
    basicHint:
      'The field accepts typing and the calendar accepts clicking; both write the same model value, and the format they agree on comes from the config, not from the browser locale.',
    inlineNote:
      'Inline renders the same panel without an overlay, so it is neither a dialog nor modal — nothing traps focus and nothing closes on Escape from outside the grid.',

    dateBox: '2rem / 2rem (32px), padding 0.25rem',
    dateRadius: '50% — a circular chip',
    dateSelectedBg: '{primary.color}, text {primary.contrast.color}',
    todayBg: '{surface.200} light / {surface.700} dark',
    dropdownWidth: '2.5rem default, 2rem sm, 3rem lg',
    panelChain: '{overlay.popover.shadow} / {overlay.popover.padding}',
    panelRadius:
      '{content.border.radius} → {border.radius.md}: 0 in werkbund, 12px lernwerkstatt, 10px skizzenbuch, 2px blaupause; the day chip keeps its literal 50%',

    ringInput: '2px solid var(--primary-color-fg), 2px offset, !important',
    ringDay: '1px solid {primary.color}, 2px offset',
    ringNone: 'none — form.field.focusRing is width 0, style none',

    ringVerify:
      'To check it, focus the field, then press the trigger and arrow into the grid: the ring keeps its width and color token from part to part. Outside this kit, the same walk shows no ring on the field and a thinner 1px ring on everything else.',

    todayProse:
      "Today's cell differs from its neighbors by background and text color and by nothing else — no border, no glyph, no text suffix — and it carries no ARIA state, so a screen-reader user is not told which day is today. If that distinction matters in your form, put it in the field's description text rather than relying on the fill.",

    contrastProse:
      'The text field is a pInputText, so the compilat measures it: its text, placeholder, and edge pass in every style and both modes, and so do the edge and icon of the trigger button. The calendar panel has no row there — not the day chip, the selected day, or the today fill. What the criteria require is unchanged: day numbers are normal-size text and need 4.5:1 under SC 1.4.3, and the selected chip is what identifies the current state, so its edge against the panel needs 3:1 under SC 1.4.11. Measure those two pairs in your own build before shipping a custom primary color.',
    motionProse:
      'The panel fades and scales in and out through the library motion wrapper, which times itself from the computed CSS durations. Under prefers-reduced-motion the kit stylesheet cuts those durations to near zero, so the panel appears and disappears at once, with no extra work at the call site. Motion you script yourself around the picker — scrolling a field into view after a validation error, say — asks scrollBehavior() or prefersReducedMotion() from src/app/utils/reduced-motion.ts instead of hard-coding smooth.',

    responsiveProse:
      'A single-month overlay panel has no intrinsic responsive behavior: it keeps its intrinsic width at every viewport and stays anchored to the field, so on a 360px screen a two-month picker overflows sideways rather than reflowing. The inline panel is the exception — it scrolls horizontally on its own. Beyond that, two switches exist and both must be asked for: responsiveOptions, which only hides surplus month groups below the breakpoints you list and does nothing at all with a single month, and touchUI, which stops positioning the panel against the field and lays a full-screen mask behind it, leaving where the panel sits to your own CSS. There is no built-in breakpoint to lean on — on phone-sized viewports prefer touchUI or numberOfMonths of 1, and pick the threshold yourself.',

    deadLocale:
      'Nothing. It is a read-only getter over a private field that the component never assigns and never exposes as an input, so it always reads undefined; there is no locale prop on this component.',
    deadFirstDay:
      'Falls through to the config value. The lookup is a || fallback, and 0 is falsy — so binding 0 to force Sunday cannot override a config that says 1. Change the config value instead. Binding 7 is no workaround either: the week builder indexes a seven-entry label array with the value directly, so a 7 leaves every column head undefined.',
    deadUserInput:
      'Never reaches the model. The input handler returns unless a keydown was seen first, so a right-click paste, a drag-and-drop, or a browser autofill leaves the field showing text that the form value does not have.',
    deadIconLabel:
      'Nothing is rendered to carry it. The label only lands on the trigger button, and that button exists only when showIcon is set and iconDisplay is button.',

    openProse:
      'There is no Alt+ArrowDown handler, and plain ArrowDown only enters an overlay that is already open. So the whole keyboard path into the calendar is showOnFocus (on by default, which opens the panel the moment the field is focused) or the trigger button. Turning showOnFocus off without shipping the trigger leaves keyboard users with the text field and nothing else.',

    i18nGapProse:
      "The kit already pushes translated strings into Optimus on every language change, but only for the aria sub-object — and every string this component reads lives at the top level of the same translation object. So a kit that switches to German still shows an English calendar until you extend that push with the date keys. Month and weekday names need no translation keys at all: Intl.DateTimeFormat produces them for the locale dateLocaleFor() returns (en-US for English, de-DE for German, the easy variants like their base), which is the same mapping the rest of the kit formats dates with. Only the button and navigation labels need keys of their own. The component rebuilds its weekday row on the config's translation notification.",

    i18nFormatNote:
      "Date format: dateFormat falls back to the config's 'mm/dd/yy'. In this grammar yy is the four-digit year, so that renders 07/15/2026 — the kit's en-US numeric style. German needs 'dd.mm.yy' (15.07.2026, the de-DE style); push it with the rest of the vocabulary rather than per field.",
    i18nWeekNote:
      'Week start: firstDayOfWeek falls back to the config value of 0 (Sunday), which is right for en-US; de-DE starts on Monday, so push 1 for German and 0 again on the way back. Set it in the config: the input is a || test and cannot express Sunday once the config says otherwise.',

    ddNameBad:
      'A placeholder is not a name: it disappears the moment a date is chosen, it is announced as a value rather than a label, and here it is also the only hint about the expected format — so the one moment the reader needs it back is the moment it is gone.',
    ddNameGood:
      'The label is a real element bound to a real input id, so it survives selection and stays in the accessibility tree; the trigger button gives a keyboard user a second, explicit way into the calendar.',
    ddClearBad:
      'The clear glyph is a plain SVG with a click handler — no tab stop, no role, no accessible name — so it is reachable with a mouse and with nothing else, and a keyboard user cannot undo a wrong date except by editing the text.',
    ddClearGood:
      'The button bar renders Clear and Today as real buttons inside the panel, so both are reachable in the tab cycle and both announce a name from the translation config; the bar is the same in an overlay picker, it is shown inline here so it is on screen.',
  };

  readonly usageSnippet =
    '<!-- labels() is a computed() map resolved through the kit TranslationService -->\n' +
    '<label class="field-label" for="invoice-date">{{ labels().invoiceDate }}</label>\n' +
    '<p-datepicker\n' +
    '  inputId="invoice-date"\n' +
    '  [showIcon]="true"\n' +
    '  iconDisplay="button"\n' +
    '  [iconAriaLabel]="labels().openCalendar"\n' +
    '  [showButtonBar]="true"\n' +
    '  [minDate]="today"\n' +
    '  [(ngModel)]="invoiceDate" />\n' +
    '<p class="hint">{{ labels().dateFormatHint }}</p>';

  readonly openSnippet =
    '// showOnFocus is on by default; keep it, or ship the trigger button.\n' +
    '// This combination leaves no keyboard route into the calendar:\n' +
    '<p-datepicker [showOnFocus]="false" />\n\n' +
    '// Either of these does have one:\n' +
    '<p-datepicker />                                        <!-- focus opens it -->\n' +
    '<p-datepicker [showOnFocus]="false" [showIcon]="true" iconDisplay="button" />';

  readonly i18nSnippet =
    '// The kit pushes only the aria block; the date vocabulary is top-level.\n' +
    '// Extend the same sync method, do not add a second one.\n' +
    "import { dateLocaleFor } from '../utils/date-locale';\n\n" +
    'const lang = this.translationService.currentLanguage;\n' +
    'const locale = dateLocaleFor(lang); // en -> en-US, de -> de-DE, *-easy like the base\n' +
    'const german = locale === \'de-DE\';\n' +
    '// 2026-02-01 is a Sunday, so day i of February is weekday i (0 = Sunday).\n' +
    'const days = (weekday: \'short\' | \'long\') =>\n' +
    '  Array.from({ length: 7 }, (_, i) =>\n' +
    '    new Intl.DateTimeFormat(locale, { weekday }).format(new Date(2026, 1, i + 1)));\n' +
    "const months = (month: 'short' | 'long') =>\n" +
    '  Array.from({ length: 12 }, (_, i) =>\n' +
    '    new Intl.DateTimeFormat(locale, { month }).format(new Date(2026, i, 1)));\n' +
    '// The prefix is a placeholder: none of these label keys exist yet.\n' +
    "const t = (key: string) => this.translationService.translate('your-module.' + key);\n\n" +
    'this.optimus.setTranslation({\n' +
    "  dayNames: days('long'),\n" +
    "  dayNamesShort: days('short'),\n" +
    "  dayNamesMin: days('short'),\n" +
    "  monthNames: months('long'),\n" +
    "  monthNamesShort: months('short'),\n" +
    "  dateFormat: german ? 'dd.mm.yy' : 'mm/dd/yy', // 15.07.2026 / 07/15/2026\n" +
    '  firstDayOfWeek: german ? 1 : 0,\n' +
    "  chooseDate: t('chooseDate'),\n" +
    "  prevMonth: t('prevMonth'),\n" +
    "  nextMonth: t('nextMonth'),\n" +
    "  today: t('today'),\n" +
    "  clear: t('clear'),\n" +
    "  weekHeader: t('weekHeader'),\n" +
    '});';
}
