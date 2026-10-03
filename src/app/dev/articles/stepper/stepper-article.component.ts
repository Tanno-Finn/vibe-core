import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { StepperModule } from '@openng/optimus-ui/stepper';
import { StepsModule } from '@openng/optimus-ui/steps';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Stepper and Steps (Guides, category `library`).
 *
 * Read off the shipped sources of Optimus UI 2.0.2. `openng-optimus-ui-stepper.mjs`
 * (771 lines), `openng-optimus-ui-steps.mjs` (439 lines) and
 * `openng-optimus-ui-motion.mjs` are the fesm2022 bundles of those names;
 * `@openng/optimus-ui-styles/dist/stepper/index.mjs` (197 lines) and
 * `.../steps/index.mjs` (117 lines) are the stylesheets; the Aura presets under
 * `@openng/optimus-ui-themes/dist/aura/` are single-line dist bundles and are
 * therefore cited by export name, never by line.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - Selectors are kebab-case — openng-optimus-ui-stepper.mjs:273 (p-step-list),
 *     :359 (p-step-item), :607 (p-step-panel), :656 (p-step-panels); module export :770.
 *   - role="tablist" on p-stepper (:747); p-step-list has no role (:268);
 *     p-step host is role="presentation" + aria-current="step" when active
 *     (:509-510); the head is <button role="tab"> with aria-controls, a real
 *     [disabled] and tabindex -1 when disabled (:444-459); p-step-panel is
 *     role="tabpanel" carrying aria-controls, not aria-labelledby (:626-627).
 *     No aria-selected anywhere: grep over the bundle for `aria-` returns only
 *     aria-controls and aria-current.
 *   - No keydown handler in the stepper bundle at all (grep keydown/Arrow/Home).
 *     Steps has one: :143-181, with a roving tabindex at :232-240.
 *   - linear: isStepDisabled = !active && (linear || disabled) (:402) feeding the
 *     native disabled attribute (:451); the class it adds is `p-readonly` (:164)
 *     while the only readonly rule is `.p-stepper.p-stepper-readonly`
 *     (styles/stepper:51) — the two never meet.
 *   - Panel unmount: <p-motion [visible]="active()"> (:592); Motion's template is
 *     `@if (rendered()) { <ng-content /> }` (openng-optimus-ui-motion.mjs:404-406); mountOnEnter and
 *     unmountOnLeave both default to true (openng-optimus-ui-motion.mjs:110, :116) and StepPanel
 *     passes neither; rendered drops to false after leave (openng-optimus-ui-motion.mjs:367-370).
 *     Motion's [disabled] reaches only motionOptions.disabled (openng-optimus-ui-motion.mjs:286),
 *     i.e. the animation, not the mounting.
 *   - Numbering: p-step renders {{ value() }} (:455) and derives its ids from the
 *     same value (:404-407); p-steps renders {{ i + 1 }} (openng-optimus-ui-steps.mjs:284).
 *   - Dead: Stepper.transitionOptions (:703) — computedMotionOptions reads only
 *     ptm('motion') and motionOptions() (:711-715). Steps.exact (openng-optimus-ui-steps.mjs:111) —
 *     its only consumers are [attr.ariaCurrentWhenActive] (:282, :302), which is
 *     an attribute binding to a name that is neither an ARIA attribute nor a
 *     RouterLink input (input list at :317). [routerLinkActiveOptions] on the
 *     routerLink anchor (:268) has no directive to receive it. aria-expanded is emitted on
 *     every item, true or false, on role="link" (:274, :300) — a link that
 *     expands nothing.
 *   - Steps defaults: activeIndex 0 (:86), readonly true (:96) with the click
 *     guard at :127-130.
 *   - Tokens from aura/stepper/index.mjs: stepNumber.activeBackground equals
 *     stepNumber.background and activeBorderColor equals borderColor, so only the
 *     digit color changes between current and non-current.
 *   - Layout: .p-steplist is overflow-x: auto (styles/stepper:2-11) and
 *     .p-step-title ellipsizes (:55-60); .p-steps-list is a plain flex row with no
 *     overflow rule (styles/steps:6-11). Neither stylesheet contains @media.
 *   - docs/generated/CONTRAST.MD measures kit CSS variables; the raw
 *     accent the active step is painted with -- the raw style accent in light mode,
 *     a lightened step of it in dark -- appears in none of its
 *     foreground rows (theme.service.ts feeds it into semantic.primary.500, while
 *     the compilat measures the separately darkened --primary-color-fg), so no row
 *     applies and the Design tab names the criterion without a ratio.
 *   - Focus: `.p-step-header:focus-visible` and `.p-steps-item-link:focus-visible`
 *     are in the kit's one ring rule in styles.scss (2px --primary-color-fg, 2px
 *     offset, !important), measured in CONTRAST.MD "focus ring".
 */
@Component({
  selector: 'app-stepper-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, StepperModule, StepsModule, ButtonModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'stepper'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two families that share a look and nothing else. <code>p-stepper</code> keeps the active value and renders
          the bodies; <code>p-steps</code> draws a bar for a process that lives somewhere else and holds no content at
          all. Everything below is rendered by the library, not drawn by this page.
        </p>

        <h3>p-stepper — the bar and the bodies</h3>
        <div class="stage">
          <p-stepper [value]="wizard()" (valueChange)="wizard.set($event ?? 1)">
            <p-step-list>
              <p-step [value]="1">{{ m.labelAccount }}</p-step>
              <p-step [value]="2">{{ m.labelAddress }}</p-step>
              <p-step [value]="3">{{ m.labelReview }}</p-step>
            </p-step-list>
            <p-step-panels>
              <p-step-panel [value]="1"><ng-template #content><p class="pane">{{ m.paneAccount }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="2"><ng-template #content><p class="pane">{{ m.paneAddress }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="3"><ng-template #content><p class="pane">{{ m.paneReview }}</p></ng-template></p-step-panel>
            </p-step-panels>
          </p-stepper>
        </div>
        <p class="src-note">
          The heads come from <code>openng-optimus-ui-stepper.mjs:444-459</code>, the panel bodies from the
          <code>ng-template #content</code> each <code>p-step-panel</code> projects
          (<code>openng-optimus-ui-stepper.mjs:598</code>). A panel without that template renders nothing.
        </p>

        <h3>p-steps — a bar and nothing else</h3>
        <div class="stage">
          <p-steps [model]="barItems" [activeIndex]="wizard() - 1" [readonly]="false" (activeIndexChange)="wizard.set($event + 1)" />
        </div>
        <p class="src-note">
          Same page state, second rendering. <code>p-steps</code> emits
          <code>&lt;nav&gt;&nbsp;&gt;&nbsp;&lt;ul&gt;&nbsp;&gt;&nbsp;&lt;li&gt;&nbsp;&gt;&nbsp;&lt;a role="link"&gt;</code>
          (<code>openng-optimus-ui-steps.mjs:248-316</code>) and numbers its items from the loop index
          (<code>:284</code>), not from any value you pass.
        </p>

        <h3>A linear stepper you can drive</h3>
        <div class="stage">
          <p-stepper [value]="locked()" [linear]="true">
            <p-step-list>
              <p-step [value]="1">{{ m.labelOne }}</p-step>
              <p-step [value]="2">{{ m.labelTwo }}</p-step>
              <p-step [value]="3">{{ m.labelThree }}</p-step>
            </p-step-list>
            <p-step-panels>
              <p-step-panel [value]="1"><ng-template #content><p class="pane">{{ m.paneOne }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="2"><ng-template #content><p class="pane">{{ m.paneTwo }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="3"><ng-template #content><p class="pane">{{ m.paneThree }}</p></ng-template></p-step-panel>
            </p-step-panels>
          </p-stepper>
          <div class="row">
            <p-button label="Back" size="small" severity="secondary" [disabled]="locked() === 1" (onClick)="locked.set(locked() - 1)" />
            <p-button label="Next" size="small" severity="secondary" [disabled]="locked() === 3" (onClick)="locked.set(locked() + 1)" />
          </div>
        </div>
        <p class="src-note">
          Try clicking a head above: with <code>linear</code> every non-current head carries the native
          <code>disabled</code> attribute (<code>openng-optimus-ui-stepper.mjs:451</code>), including the ones already
          completed. The two buttons are this page's own, not the component's.
        </p>

        <h3>What p-stepper emits</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Host bindings read from <code>openng-optimus-ui-stepper.mjs:747-748</code> (stepper),
          <code>:268</code> (step list), <code>:509-512</code> (step) and <code>:626-630</code> (panel).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          One question decides the family: does the component have to hold the content of each stage? If yes it is
          <code>p-stepper</code>; if the stages are pages, routes, or server steps, the bar is decoration and
          <code>p-steps</code> is enough.
        </p>

        <h3>Which family, and what it costs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>question</th><th><code>p-stepper</code></th><th><code>p-steps</code></th></tr>
            </thead>
            <tbody>
              <tr><td>holds the stage bodies</td><td>yes, in <code>p-step-panel</code></td><td>no</td></tr>
              <tr><td>interactive out of the box</td><td>yes</td><td>no — <code>readonly</code> defaults to <code>true</code></td></tr>
              <tr><td>keyboard</td><td>one Tab stop per head, no arrow keys</td><td>one Tab stop, arrows plus Home/End</td></tr>
              <tr><td>knows about routes</td><td>no</td><td>yes, via <code>item.routerLink</code></td></tr>
              <tr><td>the visible number is</td><td>the <code>value</code> you set</td><td>the loop index plus one</td></tr>
              <tr><td>keeps a panel alive when you leave</td><td>no — it is destroyed</td><td>no panels at all</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows read from <code>openng-optimus-ui-stepper.mjs</code> <code>:444-459</code>, <code>:455</code> and
          <code>:592</code>, and from <code>openng-optimus-ui-steps.mjs</code> <code>:96</code>, <code>:143-181</code>,
          <code>:225-231</code> and <code>:284</code>.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — let the panel hold the only copy of the input</span>
            <div class="dd__stage">
              <p-stepper [value]="ddBad()" (valueChange)="ddBad.set($event ?? 1)">
                <p-step-list>
                  <p-step [value]="1">{{ m.ddStepOne }}</p-step>
                  <p-step [value]="2">{{ m.ddStepTwo }}</p-step>
                </p-step-list>
                <p-step-panels>
                  <p-step-panel [value]="1">
                    <ng-template #content>
                      <label class="fld"><span>{{ m.ddFieldLabel }}</span><input type="text" class="fld__in" /></label>
                    </ng-template>
                  </p-step-panel>
                  <p-step-panel [value]="2"><ng-template #content><p class="pane">{{ m.ddBadHint }}</p></ng-template></p-step-panel>
                </p-step-panels>
              </p-stepper>
            </div>
            <p class="dd__why">{{ m.ddBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — bind the field to a signal on the parent</span>
            <div class="dd__stage">
              <p-stepper [value]="ddGood()" (valueChange)="ddGood.set($event ?? 1)">
                <p-step-list>
                  <p-step [value]="1">{{ m.ddStepOne }}</p-step>
                  <p-step [value]="2">{{ m.ddStepTwo }}</p-step>
                </p-step-list>
                <p-step-panels>
                  <p-step-panel [value]="1">
                    <ng-template #content>
                      <label class="fld">
                        <span>{{ m.ddFieldLabel }}</span>
                        <input type="text" class="fld__in" [value]="draft()" (input)="onDraft($event)" />
                      </label>
                    </ng-template>
                  </p-step-panel>
                  <p-step-panel [value]="2">
                    <ng-template #content><p class="pane">{{ m.ddGoodEcho }} {{ draftShown() }}</p></ng-template>
                  </p-step-panel>
                </p-step-panels>
              </p-stepper>
            </div>
            <p class="dd__why">{{ m.ddGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Type into the left field, move to the second step and back: the input is gone. The panel body is projected
          through <code>&lt;p-motion [visible]="active()"&gt;</code>
          (<code>openng-optimus-ui-stepper.mjs:592</code>), whose template is
          <code>&#64;if (rendered())</code> around the content
          (<code>openng-optimus-ui-motion.mjs:404-406</code>), and whose <code>unmountOnLeave</code> defaults to
          <code>true</code> (<code>openng-optimus-ui-motion.mjs:116</code>) because the panel never sets it. On the
          right the value lives on the parent and survives the round trip.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — ship <code>linear</code> as the whole navigation</span>
            <div class="dd__stage">
              <p-stepper [value]="2" [linear]="true">
                <p-step-list>
                  <p-step [value]="1">{{ m.labelOne }}</p-step>
                  <p-step [value]="2">{{ m.labelTwo }}</p-step>
                  <p-step [value]="3">{{ m.labelThree }}</p-step>
                </p-step-list>
              </p-stepper>
            </div>
            <p class="dd__why">{{ m.ddLinearBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — add your own Back and Next</span>
            <div class="dd__stage">
              <p-stepper [value]="locked()" [linear]="true">
                <p-step-list>
                  <p-step [value]="1">{{ m.labelOne }}</p-step>
                  <p-step [value]="2">{{ m.labelTwo }}</p-step>
                  <p-step [value]="3">{{ m.labelThree }}</p-step>
                </p-step-list>
              </p-stepper>
              <div class="row">
                <p-button label="Back" size="small" severity="secondary" [disabled]="locked() === 1" (onClick)="locked.set(locked() - 1)" />
                <p-button label="Next" size="small" severity="secondary" [disabled]="locked() === 3" (onClick)="locked.set(locked() + 1)" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddLinearGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages set <code>linear</code>. On the left the only controls are the heads, and every head that is not
          current carries the native <code>disabled</code> attribute
          (<code>openng-optimus-ui-stepper.mjs:402</code>, <code>:451</code>); on the right the same stepper is driven
          by two buttons this page owns.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          The kit's own step display with a real completed state is
          <code>step-indicator.component.ts</code>: it carries
          <code>status: 'pending' | 'active' | 'completed' | 'error'</code> per step, renders a check glyph for a
          completed one and marks the current step with <code>aria-current="step"</code> on the focusable element
          itself.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The bar is drawn from three token groups — the number, the title, and the separator — and the whole
          difference between the current step and every other one is the color of a digit. That is the design decision this guide asks you to correct.
        </p>

        <h3>Aura token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>export / key</th><th>value</th><th>what it paints</th></tr>
            </thead>
            <tbody>
              <tr><td><code>stepNumber.size</code></td><td>{{ m.numberSize }}</td><td>the circle, square</td></tr>
              <tr><td><code>stepNumber.fontSize</code></td><td>{{ m.numberFont }}</td><td>the digit</td></tr>
              <tr><td><code>stepNumber.background</code></td><td>{{ m.numberBg }}</td><td>circle fill, any step</td></tr>
              <tr><td><code>stepNumber.activeBackground</code></td><td>{{ m.numberActiveBg }}</td><td>circle fill, current step</td></tr>
              <tr><td><code>stepNumber.borderColor</code></td><td>{{ m.numberBorder }}</td><td>circle edge, any step</td></tr>
              <tr><td><code>stepNumber.activeBorderColor</code></td><td>{{ m.numberActiveBorder }}</td><td>circle edge, current step</td></tr>
              <tr><td><code>stepNumber.color</code> / <code>activeColor</code></td><td>{{ m.numberColors }}</td><td>the digit, non-current then current</td></tr>
              <tr><td><code>stepTitle.color</code> / <code>activeColor</code></td><td>{{ m.titleColors }}</td><td>the label</td></tr>
              <tr><td><code>separator.background</code> / <code>activeBackground</code></td><td>{{ m.sepColors }}</td><td>the connecting line</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/stepper/index.mjs</code>, exports
          <code>stepNumber</code>, <code>stepTitle</code> and <code>separator</code>; the file is a single-line dist
          bundle and is cited by export. <code>.../aura/steps/index.mjs</code> repeats the same shape under
          <code>itemNumber</code> and <code>itemLabel</code>; its <code>separator</code> carries only
          <code>background</code> and no active variant, so a <code>p-steps</code> bar draws no completed connector at
          all.
        </p>

        <h3>The active state is a color swap</h3>
        <p>
          {{ m.colorOnly }}
        </p>
        <p class="src-note">
          Read off the two pairs in the table above: <code>activeBackground</code> equals <code>background</code> and
          <code>activeBorderColor</code> equals <code>borderColor</code> in
          <code>&#64;openng/optimus-ui-themes/dist/aura/stepper/index.mjs</code>. WCAG 2.2 SC 1.4.1
          <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" rel="noopener noreferrer" target="_blank">Use of Color</a>
          is the criterion that makes this a defect rather than a taste question.
        </p>

        <h3>Contrast</h3>
        <p>{{ m.contrastNote }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> measures the kit's CSS variables across the four visual styles in
          both modes, and the accent the active step is painted with — the raw style accent in light mode, a lightened
          step of it in dark — appears in none of
          its foreground rows. The chain is in <code>theme.service.ts</code>, which feeds the style accent into
          <code>semantic.primary.500</code> while the compilat measures the separately darkened
          <code>--primary-color-fg</code>. No ratio is quoted here; measure the rendered circle and label in your own
          build if you need the number.
        </p>

        <h3>Focus ring</h3>
        <p>{{ m.focusNote }}</p>
        <p class="src-note">
          Rules from <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:45-49</code> (the head),
          <code>:111-114</code> (the wrapper) and <code>&#64;openng/optimus-ui-styles/dist/steps/index.mjs:62-66</code>
          (the item link); the values behind the first and the third are the <code>focusRing</code> keys of the Aura
          presets, the second uses the global <code>focus.ring</code> tokens directly. The kit ring that draws over
          the first and the third: the one focus-ring rule in <code>src/styles.scss</code>, whose selector list
          <code>scripts/check-contrast.mjs</code> asserts and measures in <code>docs/generated/CONTRAST.MD</code>,
          <code>focus ring</code>.
        </p>

        <h3>Narrow viewport</h3>
        <p>{{ m.viewport }}</p>
        <p class="src-note">
          Read from <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:2-11</code> and <code>:55-60</code>,
          and <code>&#64;openng/optimus-ui-styles/dist/steps/index.mjs:6-18</code> and <code>:68-76</code>. Neither
          stylesheet contains a media query.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Seven components in one bundle, one in the other, and four inputs that every one of them accepts without
          declaring. Below: the full maps, the bindings that go nowhere, and the evidence for the unmount.
        </p>

        <h3>p-stepper family — own inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>selector</th><th>own inputs</th><th>outputs</th><th>note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-stepper</code></td><td><code>value</code>, <code>linear</code>, <code>motionOptions</code>, <code>transitionOptions</code></td><td><code>valueChange</code></td><td><code>value</code> is a <code>model&lt;number | undefined&gt;</code></td></tr>
              <tr><td><code>p-step</code></td><td><code>value</code>, <code>disabled</code></td><td><code>valueChange</code></td><td>renders the head, or your <code>#content</code> template</td></tr>
              <tr><td><code>p-step-panel</code></td><td><code>value</code></td><td><code>valueChange</code></td><td>needs a <code>#content</code> template to show anything</td></tr>
              <tr><td><code>p-step-item</code></td><td><code>value</code></td><td><code>valueChange</code></td><td>pushes its value into the step and panel it wraps</td></tr>
              <tr><td><code>p-step-list</code></td><td>—</td><td>—</td><td>a class carrier</td></tr>
              <tr><td><code>p-step-panels</code></td><td>—</td><td>—</td><td>a class carrier</td></tr>
              <tr><td><code>p-stepper-separator</code></td><td>—</td><td>—</td><td>rendered by the components, rarely by you</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Compiled input lists from <code>openng-optimus-ui-stepper.mjs:733</code>, <code>:442</code>,
          <code>:591</code>, <code>:354</code>, <code>:268</code>, <code>:651</code> and <code>:299</code>; the
          <code>p-step-item</code> effects are at <code>:346-351</code>.
        </p>

        <h3>p-steps — own inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th>transform</th><th>default</th><th>effect</th></tr>
            </thead>
            <tbody>
              <tr><td><code>model</code></td><td>—</td><td><code>undefined</code></td><td>the <code>MenuItem[]</code> the bar is built from</td></tr>
              <tr><td><code>activeIndex</code></td><td><code>numberAttribute</code></td><td><code>0</code></td><td>which item is current, and which one is the Tab stop unless a non-disabled item sets its own <code>tabindex</code></td></tr>
              <tr><td><code>readonly</code></td><td><code>booleanAttribute</code></td><td><code>true</code></td><td>swallows every click until you set it to <code>false</code></td></tr>
              <tr><td><code>style</code>, <code>styleClass</code></td><td>—</td><td><code>undefined</code></td><td>go to the <code>nav</code> element</td></tr>
              <tr><td><code>exact</code></td><td><code>booleanAttribute</code></td><td><code>true</code></td><td>nothing — see below</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declarations at <code>openng-optimus-ui-steps.mjs:86</code>, <code>:91</code>, <code>:96</code>,
          <code>:101-106</code> and <code>:111</code>; the compiled list with the transforms is at <code>:247</code>,
          and the click guard <code>readonly</code> feeds is at <code>:127-130</code>.
        </p>

        <h3>The four inherited inputs</h3>
        <p>{{ m.inherited }}</p>
        <p class="src-note">
          Declared once on <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:428</code>); every component in both bundles is compiled with
          <code>usesInheritance: true</code>, which is why none of the lists above repeats them. The
          <code>pt</code> merge is at <code>openng-optimus-ui-basecomponent.mjs:345</code>, which pulls the global
          object through <code>:91</code>.
        </p>

        <h3>Bindings that go nowhere</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>surface</th><th>what is declared</th><th>why it is inert</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-stepper</code></td><td><code>transitionOptions</code></td><td>{{ m.deadTransition }}</td></tr>
              <tr><td><code>p-steps</code></td><td><code>exact</code></td><td>{{ m.deadExact }}</td></tr>
              <tr><td><code>p-steps</code> item anchor</td><td><code>routerLinkActiveOptions</code></td><td>{{ m.deadRlao }}</td></tr>
              <tr><td><code>p-steps</code> item anchor</td><td><code>aria-expanded</code></td><td>{{ m.deadExpanded }}</td></tr>
              <tr><td><code>p-stepper</code></td><td>class <code>p-readonly</code></td><td>{{ m.deadReadonly }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows read from <code>openng-optimus-ui-stepper.mjs:703</code> against <code>:711-715</code>;
          <code>openng-optimus-ui-steps.mjs:111</code> against <code>:282</code> and <code>:302</code>;
          <code>openng-optimus-ui-steps.mjs:268</code> against the RouterLink input list at <code>:317</code>;
          <code>openng-optimus-ui-steps.mjs:274</code> and <code>:300</code>; and
          <code>openng-optimus-ui-stepper.mjs:164</code> against
          <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:51</code>.
        </p>

        <h3>Why the panel is destroyed, in three lines</h3>
        <pre class="code-block"><code>{{ unmountSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-stepper.mjs:592</code>, <code>openng-optimus-ui-motion.mjs:404-406</code> and
          <code>openng-optimus-ui-motion.mjs:110</code>, <code>:116</code>, <code>:367-370</code>. Motion's
          <code>[disabled]</code> reaches only <code>motionOptions.disabled</code>
          (<code>openng-optimus-ui-motion.mjs:286</code>), so switching the animation off does not keep the content
          mounted. Verify in your own build: type into a field in one panel, move away and back, and read the field.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>A heading or status region states which step is current and how many there are.</li>
          <li>Completed steps are marked by something other than color — a glyph, a word, or both.</li>
          <li>Every panel's data lives on the parent component, not in the panel's own template state.</li>
          <li>With <code>linear</code>, a Back control exists and works.</li>
          <li><code>p-steps</code> that is meant to be clickable carries <code>[readonly]="false"</code>.</li>
          <li>Step values are <code>1..n</code>, because they are printed.</li>
          <li>Titles are translated strings from your own component, not literals in the template.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Neither component ships a single string. Every word you see is yours — which is good news, except for the
          one sentence a step bar most needs and neither component will say for you.
        </p>

        <h3>Where each string comes from</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>what is rendered</th><th>source</th><th>your job</th></tr>
            </thead>
            <tbody>
              <tr><td>step title</td><td>the content you project into <code>p-step</code></td><td>a translated string from a <code>computed()</code></td></tr>
              <tr><td>step number</td><td>the <code>value</code> input, stringified by the template</td><td>nothing — and nothing is possible</td></tr>
              <tr><td><code>p-steps</code> label</td><td><code>item.label</code> on the <code>MenuItem</code></td><td>rebuild the array when the language changes</td></tr>
              <tr><td><code>p-steps</code> number</td><td>the loop index plus one</td><td>nothing</td></tr>
              <tr><td>"step 2 of 5"</td><td>nowhere</td><td>everything — see below</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Title projection at <code>openng-optimus-ui-stepper.mjs:456-458</code>, the number at <code>:455</code>;
          the <code>p-steps</code> label and number at <code>openng-optimus-ui-steps.mjs:284-289</code>. Neither
          bundle contains a translation key, an <code>aria-label</code> input or an <code>Intl</code> call.
        </p>

        <h3>The number is not a label</h3>
        <p>{{ m.i18nNumber }}</p>
        <p class="src-note">
          The template interpolates <code>value()</code> directly
          (<code>openng-optimus-ui-stepper.mjs:455</code>) and the same value builds the element ids
          (<code>:404-407</code>), so it cannot be a localized string even where the digits differ.
        </p>

        <h3>"Step 2 of 5" when translate() takes only a key</h3>
        <p>{{ m.i18nPattern }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate</code> takes a key and returns a string; it has no parameter overload, so
          the substitution happens after it returns and inside the <code>computed()</code> that reads it — which is
          also what makes the sentence re-evaluate on a language change.
        </p>

        <h3>Length and direction</h3>
        <ul>
          <li>{{ m.i18nLength }}</li>
          <li>{{ m.i18nRtl }}</li>
        </ul>
        <p class="src-note">
          Ellipsis rules at <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:55-60</code> and
          <code>&#64;openng/optimus-ui-styles/dist/steps/index.mjs:68-76</code>; the only direction-aware rule in
          either file is the vertical separator offset at
          <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:186-188</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: step heads and item links
            now take the kit's 2px <code>--primary-color-fg</code> ring, measured by the gate (<code>focus ring</code>);
            the active-step color pair is still unmeasured.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            all line refs hold; the focus-ring section no longer says the stepper inherits the kit's ring — it gets
            Aura's 1px <code>&#123;primary.color&#125;</code> outline, which no kit rule upgrades and the contrast gate
            does not measure — and the doc says so in Accessibility.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-stepper-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-stepper-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-stepper-article .row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      app-stepper-article .pane {
        margin: 0;
        font-size: 0.9rem;
      }

      app-stepper-article .fld {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        font-size: 0.85rem;
      }

      app-stepper-article .fld__in {
        font: inherit;
        padding: 0.35rem 0.5rem;
        border: 1px solid var(--control-border, var(--surface-border));
        background: var(--surface-card);
        color: var(--text-color);
      }

      app-stepper-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-stepper-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-stepper-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-stepper-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-stepper-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-stepper-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-stepper-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-stepper-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-stepper-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-stepper-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-stepper-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class StepperArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly wizard = signal(1);
  readonly locked = signal(1);
  readonly ddBad = signal(1);
  readonly ddGood = signal(1);
  readonly draft = signal('');
  readonly draftShown = computed(() => (this.draft() ? this.draft() : '(nothing typed yet)'));

  readonly barItems: MenuItem[] = [{ label: 'Account' }, { label: 'Address' }, { label: 'Review' }];

  onDraft(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  /** Flat measurement and prose constants — substituted by the tab extractor. */
  readonly m = {
    labelAccount: 'Account',
    labelAddress: 'Address',
    labelReview: 'Review',
    paneAccount: 'Step one. The body of a step is whatever you put in its #content template.',
    paneAddress: 'Step two. Switching away from step one destroyed its body.',
    paneReview: 'Step three. The bar above is a p-step-list; the bodies are p-step-panel elements.',

    labelOne: 'Collect',
    labelTwo: 'Check',
    labelThree: 'Send',
    paneOne: 'With linear set, the other two heads are disabled buttons.',
    paneTwo: 'Including the one you just came from.',
    paneThree: 'Back has to be your own control.',

    ddStepOne: 'Enter',
    ddStepTwo: 'Confirm',
    ddFieldLabel: 'Your name',
    ddBadHint: 'Now go back to step one.',
    ddGoodEcho: 'The parent still has:',
    ddBadWhy:
      'The field exists only inside the panel, and the panel body is removed from the DOM when the step is left, so the typed value is destroyed with it.',
    ddGoodWhy:
      'The same field is bound to a signal on the parent component, so the panel can be destroyed and rebuilt without the value ever leaving the parent.',
    ddLinearBad:
      'Every head other than the current one is a disabled button, so this stepper offers no way back and no way forward at all.',
    ddLinearGood:
      'The same linear stepper with two controls the page owns: order is still enforced, and moving in either direction is possible.',

    numberSize: '2rem',
    numberFont: '1.143rem, weight 500, border-radius 50%',
    numberBg: '{content.background}',
    numberActiveBg: '{content.background} — the same value',
    numberBorder: '{content.border.color}',
    numberActiveBorder: '{content.border.color} — the same value',
    numberColors: '{text.muted.color} → {primary.color}',
    titleColors: '{text.muted.color} → {primary.color}, weight 500',
    sepColors: '{content.border.color} → {primary.color}, 2px',

    colorOnly:
      'The current step is drawn with the same circle fill and the same circle edge as every other step; only the digit and the label change color, from the muted text token to the primary token. A reader who cannot distinguish those two hues sees no current step at all — and since neither bundle exposes a completed state, there is nothing else in the picture to fall back on. Add a glyph, a word, or a heading that names the stage.',

    contrastNote:
      'The digit and the label are text and owe SC 1.4.3, 4.5:1 at these sizes; a marker that carries state on its own owes SC 1.4.11, 3:1. The active pair is painted with the Optimus primary color, which resolves to the raw style accent in light mode and to a lightened step of it in dark mode — not to the separately darkened foreground variable the kit contrast compilat measures. The compilat therefore has no row that vouches for this pair, and borrowing a neighboring row would be borrowing a number that was never measured here.',

    focusNote:
      'The step head takes the kit focus ring: .p-step-header and .p-steps-item-link are in the one ring rule of the kit stylesheet, a 2px solid --primary-color-fg outline at 2px offset with !important — the same ring as buttons, fields, and radios. It draws over the library ring, which comes from the component-scoped stepper.step.header.focus.ring tokens that the Aura preset aliases onto the global focus.ring set (1px solid {primary.color}, no shadow). The contrast gate measures that ring on every page surface (CONTRAST.MD, focus ring, lowest 3.88:1), so SC 1.4.11 holds for the ring wherever the stepper sits on a kit surface. The library rule of the p-steps item link is gated on :not(.p-disabled); the kit rule is not, so a focused disabled item link shows the ring too. A second rule sits on the p-step wrapper itself, using the global focus.ring tokens and no box-shadow; in practice it never fires, because the wrapper carries role="presentation" and no tabindex and is therefore not focusable unless you make it so. The wrapper is also where the aria-current attribute sits.',

    viewport:
      'The p-stepper head bar scrolls sideways instead of wrapping: p-steplist is overflow-x: auto and each title is a single ellipsized line, so at 360px a five-step bar becomes a horizontal scroller with truncated labels. p-steps does not even do that — its list is a plain flex row with no overflow rule, so its items squeeze until only the numbers and a few characters remain. Neither stylesheet carries a media query. Layout guidance: keep step titles to one or two words, and below roughly 30rem prefer the vertical p-step-item arrangement over the horizontal bar.',

    inherited:
      'dt, unstyled, pt, and ptOptions are declared once on BaseComponent and inherited by all eight components in these two bundles. They accept them, they do not list them, and an editor that autocompletes from the compiled input list will not offer them. pt does not cascade from a parent component: each component resolves its own pt input, merged with the global pt object from the Optimus configuration, and with nothing from the component above it. Styling a step head through pt therefore means putting the object on the p-step, not on the p-stepper.',

    deadTransition:
      'Deprecated since v21 and read by nothing: the computed that builds the motion options reads only the pass-through section and the motionOptions input.',
    deadExact:
      'Its only consumers are attribute bindings named ariaCurrentWhenActive, which is neither an ARIA attribute nor, bound with the attr. prefix, a RouterLink input — and RouterLinkActive is not in the template at all, so the class its documentation promises is never applied either.',
    deadRlao:
      'Bound on the routerLink anchor, but routerLinkActiveOptions belongs to RouterLinkActive, which the template does not use; the RouterLink input list does not contain it.',
    deadExpanded:
      'aria-expanded is emitted on every item, true or false, on an element with role="link" — a link that expands nothing, so the state is noise in the accessibility tree.',
    deadReadonly:
      'linear adds the class p-readonly to the stepper root, while the only readonly rule in the stepper stylesheet selects p-stepper-readonly; the two names never meet, so the state has no visual expression.',

    i18nNumber:
      'The digit in the circle is the value you bound, interpolated straight into the template. It is not a label, it cannot be translated, and it is not formatted for the locale: there is no Intl call in either bundle. If a script needs its own digits, the number has to be a title you write and the value has to move out of sight.',

    i18nPattern:
      'Neither component says where you are. The sentence has to be yours, in a live region beside the bar, and the kit translation service takes a key and nothing else — so the numbers are substituted into the returned string, inside the computed that reads it.',

    i18nLength:
      'A translated title does not wrap: it is a single line with an ellipsis, so a label that is two words in English and five in German is truncated rather than reflowed.',
    i18nRtl:
      'Both bars follow the writing direction because they are flex rows; the only direction-aware rule in either stylesheet is the offset of the vertical separator in the p-step-item arrangement.',
  };

  readonly emittedMarkupSnippet =
    '<!-- role="tablist" is on the OUTER element, around bar and panels -->\n' +
    '<p-stepper class="p-stepper p-component" role="tablist" id="pn_id_1">\n' +
    '  <p-step-list class="p-steplist">        <!-- no role at all -->\n' +
    '    <p-step class="p-step p-step-active" role="presentation" aria-current="step">\n' +
    '      <button role="tab" id="pn_id_1_step_1" aria-controls="pn_id_1_steppanel_1">\n' +
    '        <span class="p-step-number">1</span><span class="p-step-title">Account</span>\n' +
    '      </button>                            <!-- no aria-selected -->\n' +
    '    </p-step>\n' +
    '  </p-step-list>\n' +
    '  <p-step-panels class="p-steppanels">\n' +
    '    <p-step-panel role="tabpanel" id="pn_id_1_steppanel_1"\n' +
    '                  aria-controls="pn_id_1_step_1">  <!-- not aria-labelledby -->\n' +
    '      …your #content template…\n' +
    '    </p-step-panel>\n' +
    '  </p-step-panels>\n' +
    '</p-stepper>';

  readonly usageSnippet =
    '// Every stage model lives here, not in the panels.\n' +
    'readonly step = signal(1);\n' +
    "readonly form = signal({ name: '', street: '' });\n\n" +
    '// translate() takes a key only, so the numbers go in afterwards.\n' +
    'readonly position = computed(() =>\n' +
    "  this.i18n.translate('wizard.position').replace('{n}', String(this.step())),\n" +
    ');\n\n' +
    '<p class="sr-only" role="status">{{ position() }}</p>\n' +
    '<p-stepper [value]="step()" (valueChange)="step.set($event ?? 1)" [linear]="true">\n' +
    '  <p-step-list>\n' +
    '    <p-step [value]="1">{{ accountLabel() }}</p-step>\n' +
    '  </p-step-list>\n' +
    '  <p-step-panels>\n' +
    '    <p-step-panel [value]="1">\n' +
    '      <ng-template #content>            <!-- without this the panel is empty -->\n' +
    '        <input [value]="form().name" (input)="setName($event)" />\n' +
    '      </ng-template>\n' +
    '    </p-step-panel>\n' +
    '  </p-step-panels>\n' +
    '</p-stepper>\n' +
    '<!-- linear disables every other head, so Back has to be yours -->\n' +
    '<p-button label="Back" [disabled]="step() === 1" (onClick)="step.set(step() - 1)" />';

  readonly unmountSnippet =
    '// StepPanel template — openng-optimus-ui-stepper.mjs:592\n' +
    '<p-motion [visible]="active()" name="p-collapsible" [disabled]="!isVertical()" [options]="computedMotionOptions()">\n\n' +
    '// Motion template — openng-optimus-ui-motion.mjs:404-406\n' +
    '@if (rendered()) { <ng-content /> }\n\n' +
    '// Motion defaults — openng-optimus-ui-motion.mjs:110, :116\n' +
    'mountOnEnter = input(true);\n' +
    'unmountOnLeave = input(true);\n' +
    '// StepPanel sets neither, so rendered() falls to false after the leave.';

  readonly i18nSnippet =
    "// One key, one pattern string: \"Schritt {n} von {of}\"\n" +
    'readonly position = computed(() =>\n' +
    "  this.i18n\n" +
    "    .translate('wizard.position')\n" +
    "    .replace('{n}', String(this.step()))\n" +
    "    .replace('{of}', String(this.stepCount())),\n" +
    ');\n\n' +
    '// Titles are computed too, so a language change rebuilds them.\n' +
    "readonly accountLabel = computed(() => this.i18n.translate('wizard.account'));\n\n" +
    '// p-steps needs the whole array rebuilt, because model is a plain input.\n' +
    'readonly barItems = computed<MenuItem[]>(() => [\n' +
    "  { label: this.i18n.translate('wizard.account') },\n" +
    "  { label: this.i18n.translate('wizard.address') },\n" +
    ']);';
}
