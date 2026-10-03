import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ButtonGroupModule } from '@openng/optimus-ui/buttongroup';
import { ToggleButtonModule } from '@openng/optimus-ui/togglebutton';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Toggle Button and Button Group (Guides, category `library`).
 *
 * Everything claimed here was read off the shipped sources of Optimus UI 2.0.2.
 * `openng-optimus-ui-togglebutton.mjs` (393 lines) and
 * `openng-optimus-ui-buttongroup.mjs` (109 lines) are the fesm2022 bundles of the
 * same names; the style and theme bundles under `dist/` are single-line files and
 * are therefore cited by export, not by line.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - The host is the custom element, not a button: selector
 *     `p-toggleButton, p-togglebutton, p-toggle-button` (:280, :297) with host
 *     attributes `role="button"`, `aria-pressed` = `checked ? "true" : "false"`,
 *     `tabindex`, `data-p-checked`, `data-p-disabled`, `data-p` (:280, :301-312).
 *   - Label span `{{ checked ? (hasOnLabel ? onLabel : ' ') : hasOffLabel ? offLabel : ' ' }}`
 *     (:290) — so the accessible name from content moves with the state.
 *   - `onLabel = 'Yes'` (:136) and `offLabel = 'No'` (:141) are the only vendor
 *     strings in either bundle.
 *   - Keyboard: Enter and Space, both preventDefault()ed (:107-118). Click calls
 *     the same `toggle` (:280 listeners). Toggle guard (:120) is
 *     `!$disabled() && !(allowEmpty === false && checked)`.
 *   - Dead inputs: `inputId` (:172) and `autofocus` (:187) are declared and in the
 *     compiled input list (:280) but read nowhere — no `id` binding, no inner
 *     input, no AutoFocus host directive (hostDirectives are Ripple and Bind,
 *     :280/:300). Inherited `name` and `required` (baseeditableholder :11, :29,
 *     compiled :58) reach no attribute either.
 *   - The `-1` branch of `tabindex !== undefined ? tabindex : (!$disabled() ? 0 : -1)`
 *     (:280) is unreachable because `tabindex = 0` is the default (:177), and no
 *     `aria-disabled` is bound.
 *   - Template slots: `iconTemplate` is `ContentChild('icon')` and
 *     `contentTemplate` is `ContentChild('content')`, both `{ descendants: false }`
 *     (:365-370); `templates` is the `PrimeTemplate` query (:371-373) feeding
 *     `_iconTemplate` / `_contentTemplate` (:246-259). The template guards on the
 *     ContentChild only (`@if (!iconTemplate)`, :283), so a `pTemplate="icon"`
 *     never renders, and a `pTemplate="content"` renders through the outlet (:281)
 *     while the default label still renders under `@if (!contentTemplate)` (:282).
 *   - Inherited signal inputs: required/invalid/disabled/name from
 *     `openng-optimus-ui-baseeditableholder.mjs:58`, dt/unstyled/pt/ptOptions from
 *     `openng-optimus-ui-basecomponent.mjs:428`; `usesInheritance: true` on the
 *     component (:280).
 *   - ButtonGroup renders `<span class="p-buttongroup p-component" role="group">`
 *     with a single ng-content (openng-optimus-ui-buttongroup.mjs:70, :82); it has
 *     no own inputs, no outputs, and no keyboard code in 109 lines. Its grouping
 *     rules all select `.p-button` / `p-button`
 *     (@openng/optimus-ui-styles/dist/buttongroup/index.mjs and the Optimus
 *     additions, openng-optimus-ui-buttongroup.mjs:11-33), while a toggle button's
 *     root class is `p-togglebutton` (:31).
 *   - Aura values from @openng/optimus-ui-themes/dist/aura/togglebutton/index.mjs
 *     (exports root, icon, content, colorScheme): root background, hover
 *     background, checked background, and border color are all one token per mode;
 *     only content.checkedBackground, content.checkedShadow, and the label color
 *     change. The `.p-togglebutton:disabled` rule in
 *     @openng/optimus-ui-styles/dist/togglebutton/index.mjs cannot match a custom
 *     element, so the disabled tokens are inert and the fade comes from
 *     `.p-disabled` in @openng/optimus-ui-styles/dist/base/index.mjs.
 *   - Kit repaint (the `.p-togglebutton` rule in styles.scss): segment and
 *     border --surface-section, hover --surface-hover with --text-color, unpressed
 *     label and icon --text-color-secondary, pressed pill
 *     (content.checkedBackground) --primary-color-fg with the label and icon on
 *     --surface-card. Gated in docs/generated/CONTRAST.MD, "togglebutton &
 *     selectbutton": pill on segment >= 3.88:1, pressed label >= 4.75:1,
 *     unpressed label >= 4.64:1. Focus: `.p-togglebutton:focus-visible` is in the
 *     kit's one ring rule ("focus ring"). The style blocks' press-in keys on
 *     `[data-p-disabled='false']:active` (werkbund, lernwerkstatt, skizzenbuch).
 */
@Component({
  selector: 'app-togglebutton-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GuideShellComponent,
    GuideTabDirective,
    ToggleButtonModule,
    ButtonGroupModule,
    ButtonModule,
    FormsModule,
  ],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'togglebutton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A toggle button is a button that stays down. It is not a checkbox with a border and not a switch drawn
          square: the element is a custom element carrying <code>role="button"</code> and
          <code>aria-pressed</code>, and that second attribute is the entire difference between a control whose
          state is known and one whose state is only visible.
        </p>

        <h3>The control, and what it reports</h3>
        <div class="stage stage--row">
          <p-togglebutton
            [ariaLabel]="'Bold'"
            onLabel="Bold"
            offLabel="Bold"
            onIcon="pi pi-check"
            offIcon="pi pi-minus"
            [(ngModel)]="bold" />
          <span class="readout">aria-pressed = <strong>{{ boldPressed() }}</strong></span>
          <p-button label="Reset" size="small" severity="secondary" [text]="true" (onClick)="bold = false" />
        </div>
        <p class="src-note">
          The attribute is bound unconditionally as <code>checked ? "true" : "false"</code> in the host map of
          <code>openng-optimus-ui-togglebutton.mjs:280</code>, so it is present in both states rather than added
          when pressed.
        </p>

        <h3>Sizes, fluid, and the icon side</h3>
        <div class="stage">
          <div class="matrix">
            @for (s of sizes; track s.id) {
              <span class="matrix__cell">
                <span class="lbl">{{ s.id }}</span>
                <p-togglebutton
                  [ariaLabel]="s.id"
                  [onLabel]="s.label"
                  [offLabel]="s.label"
                  [size]="s.value"
                  [(ngModel)]="sizeDemo" />
              </span>
            }
            <span class="matrix__cell">
              <span class="lbl">default</span>
              <p-togglebutton
                [ariaLabel]="'Default'"
                onLabel="Default"
                offLabel="Default"
                [(ngModel)]="sizeDemo" />
            </span>
            <span class="matrix__cell">
              <span class="lbl">iconPos right</span>
              <p-togglebutton
                [ariaLabel]="'Pin'"
                onLabel="Pin"
                offLabel="Pin"
                onIcon="pi pi-check"
                offIcon="pi pi-minus"
                iconPos="right"
                [(ngModel)]="pinned" />
            </span>
          </div>
          <div class="stage__fluid">
            <p-togglebutton
              [ariaLabel]="'Full width'"
              onLabel="Full width"
              offLabel="Full width"
              [fluid]="true"
              [(ngModel)]="wide" />
          </div>
        </div>
        <p class="src-note">
          <code>size</code> adds <code>p-togglebutton-sm</code> / <code>-lg</code> and the matching
          <code>p-inputfield-*</code> class (<code>openng-optimus-ui-togglebutton.mjs:36-37</code>);
          <code>iconPos="right"</code> works through <code>order: 1</code> on
          <code>p-togglebutton-icon-right</code>, a rule the library adds on top of the shared stylesheet
          (<code>:21-23</code>). <code>fluid</code> sets <code>width: 100%</code>
          (<code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>).
        </p>

        <h3>Button group, and what it does not do</h3>
        <div class="stage">
          <p class="lbl">p-buttonGroup around p-button — one joint</p>
          <p-buttonGroup>
            <p-button label="Cut" severity="secondary" />
            <p-button label="Copy" severity="secondary" />
            <p-button label="Paste" severity="secondary" />
          </p-buttonGroup>
          <p class="lbl lbl--spaced">p-buttonGroup around p-togglebutton — nothing collapses</p>
          <p-buttonGroup>
            <p-togglebutton [ariaLabel]="'Left'" onLabel="Left" offLabel="Left" [(ngModel)]="g1" />
            <p-togglebutton [ariaLabel]="'Center'" onLabel="Center" offLabel="Center" [(ngModel)]="g2" />
            <p-togglebutton [ariaLabel]="'Right'" onLabel="Right" offLabel="Right" [(ngModel)]="g3" />
          </p-buttonGroup>
        </div>
        <p class="src-note">
          Every grouping rule is written against <code>.p-button</code> or the <code>p-button</code> element
          (<code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code>, plus the Optimus additions in
          <code>openng-optimus-ui-buttongroup.mjs:11-33</code>). A toggle button's root class is
          <code>p-togglebutton</code> (<code>openng-optimus-ui-togglebutton.mjs:31</code>), so no selector reaches it
          — nor does the kit's one-joint rule in <code>styles.scss</code>, which keys on <code>.p-button</code> too.
          The group itself (naming, joints per visual style) is documented in the Toolbar guide.
        </p>

        <h3>What each one emits</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Host attributes from the compiled host map (<code>openng-optimus-ui-togglebutton.mjs:280</code>) and the
          decorator metadata (<code>:301-312</code>); the group's markup from
          <code>openng-optimus-ui-buttongroup.mjs:70</code>. <code>data-pc-name</code> and <code>data-p</code>
          are bound unconditionally too and are elided here for readability.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which control, and why</h3>
        <div class="table-wrap">
          <table>
            <caption>
              One boolean, five plausible controls
            </caption>
            <thead>
              <tr>
                <th>If the answer is…</th>
                <th>Reach for</th>
                <th>Because</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ m.qButton }}</td>
                <td><code>p-togglebutton</code></td>
                <td>{{ m.aButton }}</td>
              </tr>
              <tr>
                <td>{{ m.qSwitch }}</td>
                <td><code>p-toggleswitch</code></td>
                <td>{{ m.aSwitch }}</td>
              </tr>
              <tr>
                <td>{{ m.qCheckbox }}</td>
                <td><code>p-checkbox</code></td>
                <td>{{ m.aCheckbox }}</td>
              </tr>
              <tr>
                <td>{{ m.qSelect }}</td>
                <td><code>p-selectbutton</code></td>
                <td>{{ m.aSelect }}</td>
              </tr>
              <tr>
                <td>{{ m.qAction }}</td>
                <td><code>p-button</code></td>
                <td>{{ m.aAction }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          SelectButton wraps this component and overrides its <code>onLabel</code> /
          <code>offLabel</code> with the option label
          (<code>openng-optimus-ui-selectbutton.mjs:319-320</code>), which is why a one-option group is never the
          cheaper route to a single toggle.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a name that changes when you press it</span>
            <div class="dd__stage">
              <p-togglebutton onLabel="Hide details" offLabel="Show details" [(ngModel)]="ddName" />
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — one name, the state in aria-pressed</span>
            <div class="dd__stage">
              <p-togglebutton
                [ariaLabel]="'Details'"
                onLabel="Details"
                offLabel="Details"
                onIcon="pi pi-eye"
                offIcon="pi pi-eye-slash"
                [(ngModel)]="ddName2" />
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          With no <code>ariaLabel</code> the name comes from the label span, which prints
          <code>onLabel</code> or <code>offLabel</code> depending on the state
          (<code>openng-optimus-ui-togglebutton.mjs:290</code>); <code>ariaLabel</code> is a host attribute
          (<code>:280</code>) and overrides name-from-content.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — state carried by color alone</span>
            <div class="dd__stage">
              <p-togglebutton [ariaLabel]="'Grid'" onLabel="Grid" offLabel="Grid" [(ngModel)]="ddColour" />
              <p-togglebutton [ariaLabel]="'List'" onLabel="List" offLabel="List" [(ngModel)]="ddColour2" />
            </div>
            <p class="dd__why">{{ m.ddColourBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — an icon pair beside the color</span>
            <div class="dd__stage">
              <p-togglebutton
                [ariaLabel]="'Grid'"
                onLabel="Grid"
                offLabel="Grid"
                onIcon="pi pi-check"
                offIcon="pi pi-minus"
                [(ngModel)]="ddColour3" />
              <p-togglebutton
                [ariaLabel]="'List'"
                onLabel="List"
                offLabel="List"
                onIcon="pi pi-check"
                offIcon="pi pi-minus"
                [(ngModel)]="ddColour4" />
            </div>
            <p class="dd__why">{{ m.ddColourGood }}</p>
          </div>
        </div>
        <p class="src-note">
          In the Aura preset the root background, the hover background, and the checked background are the same
          token, and only <code>content.checkedBackground</code>, <code>content.checkedShadow</code> and the label
          color differ (<code>&#64;openng/optimus-ui-themes/dist/aura/togglebutton/index.mjs</code>). The kit fills
          the pressed pill with the accent (Design tab), which the gate holds ≥&nbsp;3:1 off the segment — still a
          fill, so the icon pair remains the shape cue.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — naming the group on p-buttonGroup</span>
            <div class="dd__stage">
              <p-buttonGroup aria-label="Text alignment">
                <p-button label="Left" severity="secondary" />
                <p-button label="Center" severity="secondary" />
              </p-buttonGroup>
            </div>
            <p class="dd__why">{{ m.ddGroupBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a group element you own, named by you</span>
            <div class="dd__stage">
              <div role="group" aria-label="Text alignment">
                <p-buttonGroup>
                  <p-button label="Left" severity="secondary" />
                  <p-button label="Center" severity="secondary" />
                </p-buttonGroup>
              </div>
            </div>
            <p class="dd__why">{{ m.ddGroupGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The component's <code>role="group"</code> sits on its inner span
          (<code>openng-optimus-ui-buttongroup.mjs:70</code>), and the host element binds no aria attribute at all
          — the class declares no host block in its 109 lines.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          The kit's convention for any user-visible string is
          <code>TranslationService.translate(key)</code> inside a <code>computed()</code>; the service takes a key
          and nothing else. The catalog's sort control is one reference implementation of a
          <code>p-togglebutton</code>-family control wired this way.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-pressed" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 &mdash; aria-pressed</a
            >
            &mdash; the attribute this component exists to set, and what its three values mean.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer"
              >W3C APG &mdash; Button pattern, toggle buttons</a
            >
            &mdash; the rule that a toggle button's name must not change with its state.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            &mdash; what a pressed state carried by color alone fails.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            &mdash; the 3:1 the pressed pill owes once it identifies the state.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomy</h3>
        <p>
          Two elements do all the work. The host <code>p-togglebutton</code> is the button: border, padding,
          radius, focus ring. Inside it a single <code>span.p-togglebutton-content</code> is the pill that
          actually changes when the state changes, and inside that sit the optional icon span and the label span.
        </p>

        <h3>What moves between the two states — Aura, and what the kit paints</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Unpressed</th>
                <th>Pressed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>host background</td>
                <td>{{ m.tokRootBg }}</td>
                <td>{{ m.tokRootBgChecked }}</td>
              </tr>
              <tr>
                <td>host border color</td>
                <td>{{ m.tokRootBorder }}</td>
                <td>{{ m.tokRootBorderChecked }}</td>
              </tr>
              <tr>
                <td>content background</td>
                <td>{{ m.tokContentBg }}</td>
                <td>{{ m.tokContentBgChecked }}</td>
              </tr>
              <tr>
                <td>content shadow</td>
                <td>{{ m.tokContentShadow }}</td>
                <td>{{ m.tokContentShadowChecked }}</td>
              </tr>
              <tr>
                <td>label color</td>
                <td>{{ m.tokLabel }}</td>
                <td>{{ m.tokLabelChecked }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token names and values from
          <code>&#64;openng/optimus-ui-themes/dist/aura/togglebutton/index.mjs</code> (exports
          <code>root</code>, <code>icon</code>, <code>content</code>, <code>colorScheme</code>), written as
          light / dark. The rules that consume them are in
          <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>. The kit values come from the
          <code>.p-togglebutton</code> rule in <code>src/styles.scss</code>, which re-points the
          <code>--p-togglebutton-*</code> variables in every style and mode.
        </p>

        <h3>Geometry, and what <code>size</code> actually changes</h3>
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
                <td>host padding</td>
                <td>{{ m.padSm }}</td>
                <td>{{ m.padMd }}</td>
                <td>{{ m.padLg }}</td>
              </tr>
              <tr>
                <td>content padding</td>
                <td>{{ m.cpadSm }}</td>
                <td>{{ m.cpadMd }}</td>
                <td>{{ m.cpadLg }}</td>
              </tr>
              <tr>
                <td>font size</td>
                <td>{{ m.fsSm }}</td>
                <td>{{ m.fsMd }}</td>
                <td>{{ m.fsLg }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Same source as above (<code>root.sm</code>, <code>root.lg</code>, <code>content.sm</code>,
          <code>content.lg</code>). Both padding steps are identical across all three sizes, so only the font size
          and the inherited line box move.
        </p>

        <h3>Which criterion the pressed state owes</h3>
        <p>
          Two different rules apply, and which one applies depends on what carries the meaning. The label is text
          and owes <strong>SC 1.4.3</strong>, 4.5:1 against whatever sits behind it. The pill is a surface, and as
          soon as it is the thing that says "pressed" it is a non-text indicator and owes
          <strong>SC 1.4.11</strong>, 3:1 against the unpressed surface beside it. And when a single label is used
          for both states with no icon pair, the state is expressed by color and nothing else, which is
          <strong>SC 1.4.1</strong> — a criterion no contrast ratio can satisfy, because the fix is a second
          channel, not a darker color.
        </p>
        <p class="src-note">
          All three pairs are gated in <code>docs/generated/CONTRAST.MD</code>, <code>togglebutton &amp;
          selectbutton</code>, per style × accent × mode. The pressed pill (<code>--primary-color-fg</code>) on the
          <code>--surface-section</code> segment: 3.88–16.84:1 (SC 1.4.11; lowest blaupause dark, fire). The pressed
          label (<code>--surface-card</code> on the pill): 4.75–17.85:1. The unpressed label
          (<code>--text-color-secondary</code>) on the segment: 6.65:1 light / 5.91:1 dark in werkbund, lowest
          4.64:1 (blaupause, light). Aura's own pill was white on <code>surface.100</code>, 1.10:1 light and 1.34:1
          dark. The fill is a luminance step, not a hue alone; an icon pair still adds the shape cue for
          SC 1.4.1.
        </p>

        <h3>Focus and disabled</h3>
        <p>
          The focus ring is the kit's one ring: <code>.p-togglebutton:focus-visible</code> is in the
          <code>styles.scss</code> rule that draws 2px <code>--primary-color-fg</code> at a 2px offset
          (<code>!important</code>, over the preset's 1px <code>focus.ring</code>), measured in CONTRAST.MD,
          <code>focus ring</code>. The host takes focus (<code>tabindex="0"</code>), so the ring sits around the
          whole segment. The disabled appearance is a different story — the preset ships
          <code>togglebutton.disabled.*</code> colors, but their only rule is
          <code>.p-togglebutton:disabled</code>, and <code>:disabled</code> never matches a custom element. What
          you actually see is the global <code>.p-disabled</code> opacity. The same trap catches kit-side rules:
          a selector written with <code>:enabled</code> or <code>:disabled</code> against
          <code>.p-togglebutton</code> is dead on arrival. Select <code>.p-disabled</code>, or
          the attribute <em>with its value</em>, <code>[data-p-disabled="true"]</code>. Bare, the attribute
          selector matches every toggle button: <code>data-p-disabled</code> is bound unconditionally to
          <code>$disabled()</code>, which resolves to <code>false</code> rather than <code>undefined</code>, so
          an enabled button carries <code>data-p-disabled="false"</code>. The same reading makes
          <code>:not(:disabled)</code> match always, which is why the hover rule keeps applying to a disabled
          button.
        </p>
        <p class="src-note">
          Focus and disabled rules from
          <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>; the opacity that does apply from
          <code>&#64;openng/optimus-ui-styles/dist/base/index.mjs</code>. The unconditional attribute binding and
          the computed it reads are in <code>openng-optimus-ui-togglebutton.mjs:280</code> and <code>:310</code>.
        </p>

        <h3>What the kit layers on top: visual styles and ripple</h3>
        <p>
          The colors are the kit's <code>.p-togglebutton</code> rule (see the state table) &mdash; the kit's
          <code>ThemeService</code> button block is keyed on <code>.p-button</code>, which a toggle button does not
          carry. The shape is not Aura's either: every
          <code>html.style-&lt;name&gt;</code> block in <code>styles.scss</code> (ADR-0016) targets
          <code>.p-togglebutton</code>, and the host radius (<code>&#123;content.border.radius&#125;</code>, i.e.
          <code>&#123;border.radius.md&#125;</code>) follows each style's <code>presetOverrides.primitive.borderRadius</code>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Style</th>
                <th>What the host gets</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>
                  <code>var(--style-bw) solid var(--style-outline)</code> border (3px light, 2px dark), radius 0, no
                  shadow, the display font
                </td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>2px outline plus a 2px offset shadow, the display font at 700, large radii</td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>1.5px outline, paper shadow, a hand-drawn radius</td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>the display font at 600, letter-spaced uppercase label; border unchanged</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Two consequences. The outline gives the host a visible boundary in three styles, while the pressed state
          is the filled pill in all four. And the styles' press-in transform avoids the <code>:enabled</code> trap:
          it is written as <code>.p-togglebutton[data-p-disabled='false']:active</code>, the attribute with its
          value, so werkbund, lernwerkstatt, and skizzenbuch press a toggle button in the way they press a
          <code>p-button</code>; blaupause presses neither.
        </p>
        <p>
          <strong>Ripple.</strong> The component carries <code>Ripple</code> as a host directive
          (<code>openng-optimus-ui-togglebutton.mjs:300</code>), and the kit turns the global <code>ripple</code>
          config on, so the host gets <code>.p-ripple</code> (<code>position: relative; overflow: hidden</code>) and a
          <code>mousedown</code> ink; the contract is in the Button guide, which covers <code>pRipple</code>.
        </p>
        <p class="src-note">
          The <code>.p-togglebutton</code> selectors in the four <code>html.style-&lt;name&gt;</code> blocks of
          <code>styles.scss</code>; radii from <code>src/app/services/ui-styles.ts</code>; the host directive list in
          the component metadata at <code>openng-optimus-ui-togglebutton.mjs:300</code>.
        </p>

        <h3>Narrow screens</h3>
        <p>
          No intrinsic responsive behavior in either component: the toggle button keeps its intrinsic width at
          every viewport, never truncates, and never wraps its label, and <code>p-buttonGroup</code> is an
          <code>inline-flex</code> row with no wrapping rule, so a group wider than its column overflows sideways
          rather than reflowing. Layout guidance: set <code>[fluid]="true"</code> inside a bounded parent for a
          single button, and give a group a <code>flex-wrap: wrap</code> parent of your own — or drop to fewer
          buttons below roughly <code>30rem</code>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>ToggleButton inputs, and which of them arrive</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Effect</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>onLabel</code> / <code>offLabel</code></td><td>{{ m.inLabels }}</td><td>live</td></tr>
              <tr><td><code>onIcon</code> / <code>offIcon</code></td><td>{{ m.inIcons }}</td><td>live</td></tr>
              <tr><td><code>iconPos</code></td><td>{{ m.inIconPos }}</td><td>live</td></tr>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td>{{ m.inAria }}</td><td>live</td></tr>
              <tr><td><code>size</code></td><td>{{ m.inSize }}</td><td>live</td></tr>
              <tr><td><code>fluid</code></td><td>{{ m.inFluid }}</td><td>live</td></tr>
              <tr><td><code>allowEmpty</code></td><td>{{ m.inAllowEmpty }}</td><td>live</td></tr>
              <tr><td><code>tabindex</code></td><td>{{ m.inTabindex }}</td><td>live, with a dead branch</td></tr>
              <tr><td><code>styleClass</code></td><td>{{ m.inStyleClass }}</td><td>live, deprecated</td></tr>
              <tr><td><code>inputId</code></td><td>{{ m.inInputId }}</td><td><strong>dead</strong></td></tr>
              <tr><td><code>autofocus</code></td><td>{{ m.inAutofocus }}</td><td><strong>dead</strong></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declarations and the compiled input list in
          <code>openng-optimus-ui-togglebutton.mjs:280</code>; <code>inputId</code> at <code>:172</code> and
          <code>autofocus</code> at <code>:187</code> appear in that list and in no other position in the file —
          no host binding reads them, the template contains no <code>id</code>, and the host directives are
          <code>Ripple</code> and <code>Bind</code>.
        </p>

        <h3>The four plus four it inherits</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>From</th>
                <th>What reaches the DOM</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>disabled</code></td><td>BaseEditableHolder</td><td>{{ m.ihDisabled }}</td></tr>
              <tr><td><code>invalid</code></td><td>BaseEditableHolder</td><td>{{ m.ihInvalid }}</td></tr>
              <tr><td><code>required</code></td><td>BaseEditableHolder</td><td>{{ m.ihRequired }}</td></tr>
              <tr><td><code>name</code></td><td>BaseEditableHolder</td><td>{{ m.ihName }}</td></tr>
              <tr><td><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code></td><td>BaseComponent</td><td>{{ m.ihBase }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared in <code>openng-optimus-ui-baseeditableholder.mjs:58</code> and
          <code>openng-optimus-ui-basecomponent.mjs:428</code>; the component sets
          <code>usesInheritance: true</code> (<code>openng-optimus-ui-togglebutton.mjs:280</code>) and lists none
          of the eight itself, which is why they are invisible in a generated API table.
        </p>

        <h3>The two template slots, and the pTemplate copies the guards never consult</h3>
        <pre class="code-block"><code>{{ slotSnippet }}</code></pre>
        <p class="src-note">
          The queries are <code>ContentChild('icon')</code> and <code>ContentChild('content')</code>, both
          <code>&#123; descendants: false &#125;</code>
          (<code>openng-optimus-ui-togglebutton.mjs:365-370</code>); the <code>PrimeTemplate</code> query at
          <code>:371-373</code> fills separate fields (<code>:246-259</code>) that the template's guards at
          <code>:283</code> and <code>:282</code> never consult.
        </p>

        <h3>Forms, and what a submit carries</h3>
        <pre class="code-block"><code>{{ formsSnippet }}</code></pre>
        <p class="src-note">
          The value accessor is registered at <code>openng-optimus-ui-togglebutton.mjs:91-95</code> and
          <code>writeControlValue</code> assigns <code>checked</code> directly (<code>:267-271</code>). Since the
          host is not a form control, a native form submit carries nothing for it, and
          <code>[allowEmpty]="false"</code> blocks the un-press inside <code>toggle</code> (<code>:120</code>)
          rather than at the model.
        </p>

        <h3>Accessibility checklist</h3>
        <ul class="checklist">
          <li>{{ m.ckName }}</li>
          <li>{{ m.ckPressed }}</li>
          <li>{{ m.ckDisabled }}</li>
          <li>{{ m.ckGroup }}</li>
          <li>{{ m.ckColour }}</li>
          <li>{{ m.ckKeyboard }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>The library's only two strings</h3>
        <p>
          Almost every Optimus control leaves the text to you. This one does not quite: <code>onLabel</code>
          defaults to <code>'Yes'</code> and <code>offLabel</code> to <code>'No'</code>, and a button rendered
          without either input shows those English words in every language you ship. They are the only vendor
          strings in the bundle, and they are not routed through the library's translation configuration, so
          there is nothing to override centrally — set both inputs, always.
        </p>
        <p class="src-note">
          Defaults at <code>openng-optimus-ui-togglebutton.mjs:136</code> and <code>:141</code>; the label span
          prints them directly (<code>:290</code>). <code>openng-optimus-ui-buttongroup.mjs</code> renders no text of
          its own — its template is a single <code>&lt;span&gt;</code> with an <code>&lt;ng-content&gt;</code>
          (<code>:70</code>).
        </p>

        <h3>Translating a label that must not change</h3>
        <p>
          The accessible name has to stay identical across the two states, which means the same translated string
          feeds <code>ariaLabel</code>, <code>onLabel</code> and <code>offLabel</code>. That is one key, resolved
          once in a <code>computed()</code> so it re-resolves on a language change.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate(key)</code> takes a key and returns a string; it accepts no
          interpolation parameters, so anything variable is composed after the call.
        </p>

        <h3>Length is a layout risk, not a truncation risk</h3>
        <p>
          Nothing in either component ellipsizes or wraps deliberately: the label is a plain span inside an
          <code>inline-flex</code> content box, so a translation that runs 40% longer makes the button wider. In a
          <code>p-buttonGroup</code> that widening is multiplied by the number of buttons in the row. Budget the
          longest language you ship when you decide how many buttons a row can hold, and prefer icon-plus-name
          over a sentence.
        </p>

        <h3>Right-to-left</h3>
        <p>
          The group's corner rules are written with logical properties
          (<code>border-start-end-radius</code> and friends) and its border collapse uses
          <code>border-inline-end</code>, so a mirrored layout collapses the correct edges without help. The
          toggle button's own icon side is the exception: <code>iconPos="right"</code> is implemented as
          <code>order: 1</code> inside a flex row, which follows the writing direction — so "right" means
          "trailing", which is usually what you want, and never means a fixed physical side.
        </p>
        <p class="src-note">
          Logical properties in <code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code>; the
          <code>order: 1</code> rule in <code>openng-optimus-ui-togglebutton.mjs:21-23</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the kit's pressed pill
            (<code>--primary-color-fg</code>, gated ≥&nbsp;3.88:1), the one focus ring, the press-in that now fires,
            unpressed label lowest 4.64:1; the button group points to the Toolbar guide.
          </li>
          <li>
            <strong>v1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): new Design section on what each style's
            <code>.p-togglebutton</code> rule adds and why its <code>:enabled:active</code> press-in never matches; the
            <code>Ripple</code> host directive documented; label contrast cited from the contrast gate (the kit's
            <code>--text-color-secondary</code> label, lowest 4.76:1); the dead-attribute citation moved to <code>:310</code>; annotated
            Sources added to Usage; history moved to the shared footer format; agent doc trimmed under the size aim.
          </li>
          <li>
            <strong>v1.0</strong> &mdash; 2026-09-05 &mdash; First published; measured against Optimus UI 2.0.2.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-togglebutton-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-togglebutton-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-togglebutton-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.9rem;
      }

      app-togglebutton-article .stage__fluid {
        margin-top: 1rem;
        max-width: 22rem;
      }

      app-togglebutton-article .readout {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-togglebutton-article .lbl {
        display: block;
        font-size: 0.72rem;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
        margin-bottom: 0.35rem;
      }

      app-togglebutton-article .lbl--spaced {
        margin-top: 1.25rem;
      }

      app-togglebutton-article .matrix {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 1rem;
      }

      app-togglebutton-article .matrix__cell {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      app-togglebutton-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 1rem;
      }

      app-togglebutton-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        padding: 0.9rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-togglebutton-article .dd__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.6rem;
        min-height: 3rem;
      }

      app-togglebutton-article .dd__why {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }

      app-togglebutton-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-togglebutton-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-togglebutton-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-togglebutton-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-togglebutton-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ToggleButtonArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Playground state. `bold` is read back through a signal so the readout tracks it. */
  private readonly boldState = signal(false);
  get bold(): boolean {
    return this.boldState();
  }
  set bold(value: boolean) {
    this.boldState.set(value);
  }
  readonly boldPressed = computed(() => (this.boldState() ? 'true' : 'false'));

  sizeDemo = true;
  pinned = false;
  wide = false;
  g1 = true;
  g2 = false;
  g3 = false;
  ddName = false;
  ddName2 = false;
  ddColour = true;
  ddColour2 = false;
  ddColour3 = true;
  ddColour4 = false;

  readonly sizes: { id: string; label: string; value: 'small' | 'large' }[] = [
    { id: 'small', label: 'Small', value: 'small' },
    { id: 'large', label: 'Large', value: 'large' },
  ];

  /** Flat fact constants — substituted by the tab extractor. */
  readonly m = {
    qButton: 'It belongs in a toolbar and pressing it is the action',
    aButton: 'A pressed button is a button; aria-pressed carries the state without adding a second control shape — at the price that nothing of it reaches a native form submit.',
    qSwitch: 'It is a setting that takes effect the instant it moves',
    aSwitch: 'A switch reads as a setting, not as an action, and its state is legible at a glance.',
    qCheckbox: 'It is answered now and applied on submit',
    aCheckbox: 'A checkbox renders a native input, so it carries name, required, and a submit value — the classic "answer now, apply on submit" control.',
    qSelect: 'There are two or more named alternatives',
    aSelect: 'A segmented group shows the whole set at once, and it takes a multiple input, so one or several of them can be pressed.',
    qAction: 'It happens once and does not stay on',
    aAction: 'A command has no state to report, so aria-pressed would be a lie.',

    ddNameBad:
      'The accessible name is the visible label, and the label swaps with the state — a screen-reader user who navigated to "Show details" finds "Hide details" under the same position, which reads as a different control rather than a changed one.',
    ddNameGood:
      'One name in both states, an icon pair that changes shape, and the state itself delivered by aria-pressed — the name identifies the control, the attribute reports its condition.',
    ddColourBad:
      'The two buttons differ only in the fill of the inner pill; the kit keeps that fill 3:1 off the segment, but a user who cannot tell a filled pill from a plain one still gets no second cue for "which one is on".',
    ddColourGood:
      'The icon differs in shape as well as color, so the pressed one is identifiable without relying on the surface at all.',
    ddGroupBad:
      'The attribute lands on the outer custom element, which carries no role; the element that actually has role="group" is the span inside it, and it stays unnamed.',
    ddGroupGood:
      'The role and the name are on the same element, so the group is announced with its purpose — and the library keeps doing the only job it has, which is the corners.',

    tokRootBg: '{surface.100} / {surface.950} in Aura; the kit paints --surface-section',
    tokRootBgChecked: 'unchanged in both layers',
    tokRootBorder: '{surface.100} / {surface.950} in Aura; the kit paints --surface-section',
    tokRootBorderChecked: 'unchanged in both layers',
    tokContentBg: 'transparent',
    tokContentBgChecked: '{surface.0} / {surface.800} in Aura; the kit fills --primary-color-fg',
    tokContentShadow: 'none',
    tokContentShadowChecked: '0px 1px 2px 0px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)',
    tokLabel: '{surface.500} / {surface.400} in Aura; the kit renders --text-color-secondary',
    tokLabelChecked: '{surface.900} / {surface.0} in Aura; the kit renders --surface-card',

    padSm: '0.25rem',
    padMd: '0.25rem',
    padLg: '0.25rem',
    cpadSm: '0.25rem 0.75rem',
    cpadMd: '0.25rem 0.75rem',
    cpadLg: '0.25rem 0.75rem',
    fsSm: '{form.field.sm.font.size}',
    fsMd: '1rem (from the host rule, not a token)',
    fsLg: '{form.field.lg.font.size}',

    inLabels: 'Text of the label span, chosen by the current state.',
    inIcons: 'Class string on the icon span; omit both and no icon span renders.',
    inIconPos: 'Picks the left or right icon class; only the right one carries an order rule, which moves the icon behind the label.',
    inAria: 'Host aria-label / aria-labelledby; overrides name-from-content.',
    inSize: 'Adds the sm / lg class pair; changes font size only.',
    inFluid: 'Adds the fluid class, width 100%.',
    inAllowEmpty: 'false blocks the un-press inside the toggle handler.',
    inTabindex: 'Written to the host tabindex; its default of 0 makes the disabled fallback unreachable.',
    inStyleClass: 'Concatenated onto the host class; prefer the plain class binding.',
    inInputId: 'Nothing. No id is written and there is no labelable element to point a label at.',
    inAutofocus: 'Nothing. No autofocus directive is applied and no base class reads the property.',

    ihDisabled: 'The p-disabled class and the guard inside toggle; no disabled attribute, no aria-disabled.',
    ihInvalid: 'The p-invalid class and a border color; no aria-invalid.',
    ihRequired: 'Nothing.',
    ihName: 'Nothing — the host is not a form control.',
    ihBase: 'Theme overrides, unstyled mode, and pass-through attributes; none of them are declared on the component.',

    ckName: 'Exactly one accessible name, identical in both states, set with ariaLabel or ariaLabelledBy.',
    ckPressed: 'aria-pressed present and flipping — check it in the accessibility tree, not in the markup.',
    ckDisabled: 'A disabled button either removed from the tab order by you, or not rendered at all.',
    ckGroup: 'Any group of these named on an element you own, never on p-buttonGroup.',
    ckColour: 'A second, non-color signal for the pressed state.',
    ckKeyboard: 'Enter and Space both toggle; no arrow-key expectation is set anywhere in the UI.',

  };

  readonly emittedMarkupSnippet =
    '<!-- p-togglebutton, unpressed: the host element IS the button -->\n' +
    '<p-togglebutton class="p-togglebutton p-component" role="button" aria-pressed="false"\n' +
    '                aria-label="Bold" tabindex="0" data-p-checked="false" data-p-disabled="false">\n' +
    '  <span class="p-togglebutton-content">\n' +
    '    <span class="p-togglebutton-icon p-togglebutton-icon-left pi pi-minus"></span>\n' +
    '    <span class="p-togglebutton-label">Bold</span>\n' +
    '  </span>\n' +
    '</p-togglebutton>\n\n' +
    '<!-- pressed: same node, two attributes and one class differ -->\n' +
    '<p-togglebutton class="p-togglebutton p-component p-togglebutton-checked" role="button"\n' +
    '                aria-pressed="true" aria-label="Bold" data-p-checked="true"> ... </p-togglebutton>\n\n' +
    '<!-- p-buttonGroup: a wrapper span carries the role, the host carries nothing -->\n' +
    '<p-buttongroup><span class="p-buttongroup p-component" role="group">...</span></p-buttongroup>';

  readonly usageSnippet =
    "// One key, one name, both states. translate() takes a key and nothing else.\n" +
    "readonly boldLabel = computed(() => this.i18n.translate('editor.toolbar.bold'));\n\n" +
    '<!-- the name never moves; the state is the attribute -->\n' +
    '<p-togglebutton\n' +
    '  [ariaLabel]="boldLabel()"\n' +
    '  [onLabel]="boldLabel()"\n' +
    '  [offLabel]="boldLabel()"\n' +
    '  onIcon="pi pi-check"\n' +
    '  offIcon="pi pi-minus"\n' +
    '  [(ngModel)]="bold"\n' +
    '  (onChange)="persist($event.checked)" />\n\n' +
    '<!-- a named row of actions: the role and the name live on an element you own -->\n' +
    '<div role="group" [attr.aria-label]="alignLabel()">\n' +
    '  <p-buttonGroup>\n' +
    '    <p-button [label]="leftLabel()" severity="secondary" />\n' +
    '    <p-button [label]="centreLabel()" severity="secondary" />\n' +
    '  </p-buttonGroup>\n' +
    '</div>';

  readonly slotSnippet =
    '<!-- These two arrive: the template refs the ContentChild queries look for -->\n' +
    '<p-togglebutton [ariaLabel]="label()" [(ngModel)]="on">\n' +
    '  <ng-template #icon let-checked>\n' +
    '    <span class="pi" [class.pi-check]="checked" [class.pi-minus]="!checked"></span>\n' +
    '  </ng-template>\n' +
    '</p-togglebutton>\n\n' +
    '<!-- This one is collected and never rendered: the guard tests the ContentChild -->\n' +
    '<p-togglebutton [ariaLabel]="label()" [(ngModel)]="on">\n' +
    '  <ng-template pTemplate="icon">...</ng-template>\n' +
    '</p-togglebutton>\n\n' +
    '<!-- And this one renders alongside the default label: the outlet prints it, and the guard\n' +
    '     that would suppress the default tests the ContentChild, not this copy -->\n' +
    '<p-togglebutton [ariaLabel]="label()" [(ngModel)]="on">\n' +
    '  <ng-template pTemplate="content">...</ng-template>\n' +
    '</p-togglebutton>';

  readonly formsSnippet =
    '// Reactive: the control holds the boolean, nothing else does.\n' +
    'readonly form = new FormGroup({ notify: new FormControl(false, { nonNullable: true }) });\n\n' +
    '<form [formGroup]="form">\n' +
    '  <p-togglebutton\n' +
    '    formControlName="notify"\n' +
    '    [ariaLabel]="notifyLabel()"\n' +
    '    [onLabel]="notifyLabel()"\n' +
    '    [offLabel]="notifyLabel()" />\n' +
    '</form>\n\n' +
    '// [required] is accepted and reaches no attribute: validate in the form, and\n' +
    '// render the message yourself. [invalid] only adds a border color.';

  readonly i18nSnippet =
    "// One key feeds all three inputs, inside a computed() so a language switch re-resolves it.\n" +
    "readonly muteLabel = computed(() => this.i18n.translate('player.controls.mute'));\n\n" +
    '<p-togglebutton\n' +
    '  [ariaLabel]="muteLabel()"\n' +
    '  [onLabel]="muteLabel()"\n' +
    '  [offLabel]="muteLabel()"\n' +
    '  onIcon="pi pi-volume-off"\n' +
    '  offIcon="pi pi-volume-up"\n' +
    '  [(ngModel)]="muted" />\n\n' +
    '// Without onLabel/offLabel the button renders the library defaults "Yes" and "No",\n' +
    '// in English, in every language bundle.';
}
