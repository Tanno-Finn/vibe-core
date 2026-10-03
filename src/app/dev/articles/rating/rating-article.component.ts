import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from '@openng/optimus-ui/rating';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Rating (Guides, category `library`).
 *
 * Subject: `p-rating` — a star strip that is not a widget with a rating role but
 * a set of native radio inputs, visually hidden and painted over. Everything the
 * article claims comes from the shipped source of Optimus UI 2.0.2 unless a line
 * says otherwise.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-rating.mjs unless noted):
 *   - Host carries only [class]="cx('root')" and [attr.data-p] (:370-373). No
 *     role, no aria-* — the strip has no group semantics of its own.
 *   - Each star is a div.p-rating-option wrapping span.p-hidden-accessible with a
 *     real input[type=radio] (:266-312); name = name() || nameattr + '_name'
 *     (:273), nameattr an auto uuid('pn_id_') from onInit (:178).
 *   - p-hidden-accessible is clip-based, inner input transform: scale(0)
 *     (openng-optimus-ui-base.mjs:28-42) — in the a11y tree and focusable.
 *   - No keydown/keyup handler exists; only click/focus/blur/change are wired.
 *   - p-focus-visible needs isFocusVisibleItem (:38), set from
 *     event.sourceCapabilities?.firesTouchEvents === false (:227) and to true
 *     after a change (:218).
 *   - onOptionSelect clears the model to null when
 *     focusedOptionIndex() === value || value === this.value (:206); onInputFocus
 *     sets focusedOptionIndex to the focused star (:226), onChange routes into
 *     the same method (:216-217).
 *   - required/invalid/disabled/name are inherited signal inputs declared in
 *     openng-optimus-ui-baseeditableholder.mjs:58, absent from the ɵcmp input
 *     list at :266; consumed at :273, :275, :277.
 *   - invalid() only adds p-invalid to both icons (:41-42); its only rule sets
 *     stroke from rating.invalid.icon.color, which the Aura rating preset does
 *     not declare, and the star paths paint with fill
 *     (optimus-ui-styles/dist/rating/index.mjs:50-52).
 *   - onFocus.emit (:228) sits inside the !readonly && !$disabled guard (:225);
 *     onBlur does not.
 *   - readonly emits [attr.readonly] on a radio (:276) plus the p-readonly root
 *     class (:30); no aria-readonly. disabled emits [attr.disabled] (:277).
 *   - starsArray is built in onInit only (:177-183) — [stars] is init-only.
 *   - On icon is star-fill, off icon is star (:295, :306); iconOnClass /
 *     iconOffClass swap the svg for a span[ngClass] (:292, :303).
 *   - starAriaLabel reads config.translation.aria.star / .stars (:240-242);
 *     the English defaults are declared in
 *     openng-optimus-ui-config.mjs:180-181; setTranslation is a shallow spread
 *     (openng-optimus-ui-config.mjs:246-249); translationObserver is the
 *     asObservable() side of translationSource (same file, :241-242).
 *   - Tokens from @openng/optimus-ui-themes/dist/aura/rating/index.mjs, CSS from
 *     @openng/optimus-ui-styles/dist/rating/index.mjs.
 *   - Contrast ratios quoted verbatim from docs/generated/CONTRAST.MD with the
 *     visual style and mode named on every row; all four style blocks read.
 */
@Component({
  selector: 'app-rating-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, RatingModule, FormsModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'rating'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A star strip looks like one control and is five. The component paints nothing you can focus: every star is a
          native <code>input[type=radio]</code>, clipped to a pixel, with a filled or an outlined star drawn beside it.
          Read the examples as radio groups and the rest of this guide follows.
        </p>

        <h3>Editable, read-only, disabled</h3>
        <div class="stage">
          <fieldset class="rating-field">
            <legend>How useful was this page?</legend>
            <p-rating [ngModel]="score()" (ngModelChange)="score.set($event)" />
            <p class="stage-note">Selected: {{ scoreLabel() }}</p>
          </fieldset>
        </div>
        <div class="stage">
          <p-rating [ngModel]="3" [readonly]="true" />
          <span class="stage-note">readonly — pointer blocked, still reachable by keyboard</span>
        </div>
        <div class="stage">
          <p-rating [ngModel]="3" [disabled]="true" />
          <span class="stage-note">disabled — the radios carry the disabled attribute and leave the tab order</span>
        </div>
        <p class="src-note">
          Three live instances of <code>p-rating</code> from <code>&#64;openng/optimus-ui/rating</code>. The component
          handles click, focus, blur, and change only — no <code>keydown</code> or <code>keyup</code> handler exists in
          <code>openng-optimus-ui-rating.mjs</code> — so an arrow key is the browser's own handling of same-name
          radios, and the <code>change</code> it produces lands in the selection method described under Development.
        </p>

        <h3>What the component emits per star</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Structure from the component template, <code>openng-optimus-ui-rating.mjs:266-312</code>; the hiding rule from
          <code>openng-optimus-ui-base.mjs:28-42</code>. Note what is absent: no role on the host, no
          <code>aria-labelledby</code>, and no element around the options that could carry a group name.
        </p>

        <h3>Ten stars, one row</h3>
        <div class="stage">
          <p-rating [ngModel]="7" [stars]="10" [readonly]="true" />
        </div>
        <p class="src-note">
          <code>[stars]</code> is read once in <code>onInit</code>
          (<code>openng-optimus-ui-rating.mjs:177-183</code>) and never rebuilt.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which control</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Situation</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>A reader scores something on a coarse ordinal scale</td><td><code>p-rating</code></td><td>{{ m.whenRating }}</td></tr>
              <tr><td>An average or an already-given score is displayed</td><td>Your own markup</td><td>{{ m.whenStatic }}</td></tr>
              <tr><td>The options have names, not ranks</td><td><code>radiobutton</code></td><td>{{ m.whenRadio }}</td></tr>
              <tr><td>A fine or continuous scale</td><td><code>slider</code></td><td>{{ m.whenSlider }}</td></tr>
              <tr><td>Two to four labeled choices, side by side</td><td><code>selectbutton</code></td><td>{{ m.whenSegments }}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — name the strip on the component itself</span>
            <div class="dd__stage">
              <p-rating
                aria-label="How useful was this page?"
                [ngModel]="ddNameBad()"
                (ngModelChange)="ddNameBad.set($event)" />
            </div>
            <p class="dd__why">{{ m.namelessWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — put the name on a real grouping element</span>
            <div class="dd__stage">
              <fieldset class="rating-field">
                <legend>How useful was this page?</legend>
                <p-rating [ngModel]="ddNameGood()" (ngModelChange)="ddNameGood.set($event)" />
              </fieldset>
            </div>
            <p class="dd__why">{{ m.fieldsetWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Both strips are live. The host bindings that decide the outcome are at
          <code>openng-optimus-ui-rating.mjs:370-373</code>: a class and a data attribute, no role.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — use readonly to display a score</span>
            <div class="dd__stage">
              <p-rating [ngModel]="4" [readonly]="true" />
            </div>
            <p class="dd__why">{{ m.readonlyWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — render an image with a name</span>
            <div class="dd__stage">
              <span role="img" aria-label="4 out of 5 stars" class="static-score">
                <span aria-hidden="true">
                  <i class="pi pi-star-fill"></i><i class="pi pi-star-fill"></i><i class="pi pi-star-fill"></i
                  ><i class="pi pi-star-fill"></i><i class="pi pi-star static-score__off"></i>
                </span>
              </span>
            </div>
            <p class="dd__why">{{ m.imgWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          The read-only strip is a live <code>p-rating</code>: tab into it and the five radios are still there, because
          <code>readonly</code> emits an attribute HTML does not define for that input type
          (<code>openng-optimus-ui-rating.mjs:276</code>) and no <code>aria-readonly</code>. The image beside it is
          plain markup — one node, one name, no tab stop.
        </p>
        <pre class="code-block"><code>{{ ddImgSnippet }}</code></pre>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — swap both icons for the same shape</span>
            <div class="dd__stage">
              <p-rating
                iconOnClass="pi pi-star-fill"
                iconOffClass="pi pi-star-fill"
                [iconOffStyle]="dimmedIcon"
                [ngModel]="ddIconBad()"
                (ngModelChange)="ddIconBad.set($event)" />
            </div>
            <p class="dd__why">{{ m.sameShapeWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — keep filled against outlined</span>
            <div class="dd__stage">
              <p-rating [ngModel]="ddIconGood()" (ngModelChange)="ddIconGood.set($event)" />
              <p-rating
                iconOnClass="pi pi-heart-fill"
                iconOffClass="pi pi-heart"
                [ngModel]="ddIconHeart()"
                (ngModelChange)="ddIconHeart.set($event)" />
            </div>
            <p class="dd__why">{{ m.twoShapeWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          The default icons are two components, <code>star-fill</code> and <code>star</code>
          (<code>openng-optimus-ui-rating.mjs:295</code>, <code>:306</code>); a class override replaces the svg with a
          span (<code>:292</code>, <code>:303</code>). The kit's icon font is <code>&#64;openng/icons</code>, loaded in
          <code>src/styles.scss</code> — a class it does not define renders an empty span.
        </p>

        <h3>Annotated source of the recommended shape</h3>
        <pre class="code-block"><code>{{ recommendedSnippet }}</code></pre>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, radio button state</a
            >
            — grouping by <code>name</code>, the browser's own arrow-key handling, and no <code>readonly</code> for this
            input type.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#generic" target="_blank" rel="noopener noreferrer"
              >W3C — WAI-ARIA 1.2, role generic</a
            >
            — naming prohibited: why a label on the host is dropped.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — why filled and empty stars must differ in shape.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — the 24 by 24 the preset star misses.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>The token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Value in the Aura preset</th><th>Where it lands</th></tr>
            </thead>
            <tbody>
              <tr><td><code>rating.gap</code></td><td>{{ m.tokGap }}</td><td>Column gap of the inline-flex row</td></tr>
              <tr><td><code>rating.icon.size</code></td><td>{{ m.tokSize }}</td><td><code>font-size</code>, <code>width</code> and <code>height</code> of every icon</td></tr>
              <tr><td><code>rating.icon.color</code></td><td>{{ m.tokColor }}</td><td>Unselected stars</td></tr>
              <tr><td><code>rating.icon.active.color</code></td><td>{{ m.tokActive }}</td><td>Selected stars</td></tr>
              <tr><td><code>rating.icon.hover.color</code></td><td>{{ m.tokHover }}</td><td>Hover, suppressed under <code>p-disabled</code> and <code>p-readonly</code></td></tr>
              <tr><td><code>rating.focus.ring.*</code></td><td>{{ m.tokRing }}</td><td><code>outline</code> and <code>box-shadow</code> of <code>.p-rating-option.p-focus-visible</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/rating/index.mjs</code>; the rules that consume them
          from <code>&#64;openng/optimus-ui-styles/dist/rating/index.mjs</code>. Where the table names a preset
          reference rather than a literal, the theme resolves it at build time.
        </p>

        <h3>Contrast of a star drawn in kit ink</h3>
        <p>{{ m.contrastIntro }}</p>
        <p>{{ m.contrastCriterion }}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Visual style</th><th>Light mode</th><th>Dark mode</th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>7.78:1</td><td>6.59:1</td></tr>
              <tr><td>lernwerkstatt</td><td>5.79:1</td><td>6.56:1</td></tr>
              <tr><td>skizzenbuch</td><td>5.56:1</td><td>5.38:1</td></tr>
              <tr><td>blaupause</td><td>5.21:1</td><td>6.29:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows quoted verbatim from <code>docs/generated/CONTRAST.MD</code>, body-text block,
          <code>--text-color-secondary</code> on <code>--surface-card</code>, all four visual styles and both modes. The
          selected-star figures above are the group "checkbox &amp; radiobutton" rows for
          <code>primary.color</code> on <code>--surface-card</code>; the icon tokens are from
          <code>&#64;openng/optimus-ui-themes/dist/aura/rating/index.mjs</code>.
        </p>

        <h3>Target size</h3>
        <p>{{ m.targetSize }}</p>
        <p class="src-note">
          Computed from two preset values, <code>rating.icon.size</code> and <code>rating.gap</code>
          (<code>&#64;openng/optimus-ui-themes/dist/aura/rating/index.mjs</code>), against the rule that sizes the icon
          in <code>&#64;openng/optimus-ui-styles/dist/rating/index.mjs</code>; the option box adds no padding of its
          own. Criterion: WCAG 2.2 SC 2.5.8.
        </p>

        <h3>On a narrow screen</h3>
        <p>{{ m.narrowStatement }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>The API surface</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Kind</th><th>What it does</th></tr>
            </thead>
            <tbody>
              <tr><td><code>stars</code></td><td>Input, <code>numberAttribute</code>, default 5</td><td>{{ m.inStars }}</td></tr>
              <tr><td><code>readonly</code></td><td>Input, <code>booleanAttribute</code></td><td>{{ m.inReadonly }}</td></tr>
              <tr><td><code>autofocus</code></td><td>Input, <code>booleanAttribute</code></td><td>{{ m.inAutofocus }}</td></tr>
              <tr><td><code>iconOnClass</code>, <code>iconOffClass</code></td><td>Input</td><td>{{ m.inIconClass }}</td></tr>
              <tr><td><code>iconOnStyle</code>, <code>iconOffStyle</code></td><td>Input</td><td>{{ m.inIconStyle }}</td></tr>
              <tr><td><code>disabled</code>, <code>name</code></td><td>Inherited input</td><td>{{ m.inInherited }}</td></tr>
              <tr><td><code>required</code>, <code>invalid</code></td><td>Inherited input</td><td>{{ m.inRequiredInvalid }}</td></tr>
              <tr><td><code>onRate</code></td><td>Output</td><td>{{ m.outRate }}</td></tr>
              <tr><td><code>onFocus</code>, <code>onBlur</code></td><td>Output</td><td>{{ m.outFocus }}</td></tr>
              <tr><td><code>#onicon</code>, <code>#officon</code></td><td>Content template</td><td>{{ m.inTemplates }}</td></tr>
              <tr><td>value</td><td><code>NG_VALUE_ACCESSOR</code></td><td>{{ m.inValue }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Input and output declarations from <code>openng-optimus-ui-rating.mjs:266</code> and the property decorators at
          <code>:376-408</code>; the value accessor from <code>:84-88</code>. The last two rows are not in that
          declaration at all — they are inherited from
          <code>openng-optimus-ui-baseeditableholder.mjs:58</code>, and the template consumes them at <code>:273</code>,
          <code>:275</code> and <code>:277</code>.
        </p>

        <h3>Four behaviors worth knowing before you wire it</h3>
        <h4>Two ways to land on null</h4>
        <p>{{ m.toggleOff }}</p>
        <p>{{ m.toggleOffKeyboard }}</p>
        <h4>Stars are counted once</h4>
        <p>{{ m.starsOnce }}</p>
        <h4>The focus ring depends on a non-standard event property</h4>
        <p>{{ m.focusRing }}</p>
        <h4>The invalid state renders nothing</h4>
        <p>{{ m.invalidState }}</p>
        <p class="src-note">
          Clearing branch from <code>onOptionSelect</code> (<code>openng-optimus-ui-rating.mjs:204-215</code>, the
          condition at <code>:206</code>), the focused index from <code>onInputFocus</code> (<code>:226</code>) and
          <code>onChange</code> (<code>:216-217</code>); the star array from <code>onInit</code>
          (<code>:177-183</code>); the ring flag from <code>:227</code>, <code>:218</code> and the class map at
          <code>:38</code>; the invalid classes at <code>:41-42</code> and their only rule in
          <code>&#64;openng/optimus-ui-styles/dist/rating/index.mjs:50-52</code>.
        </p>

        <h3>Checklist before this ships</h3>
        <ul class="checklist">
          <li>The strip sits inside a labeled group, and the label is not on <code>p-rating</code> itself.</li>
          <li>A display-only score does not use <code>p-rating</code>.</li>
          <li>Something visible states the current value in words, for the reader who cannot count filled stars.</li>
          <li>Clearing is reachable without aiming at the current star.</li>
          <li><code>[stars]</code> is a constant at the point the component is created.</li>
          <li>Keyboard focus is visible in the browsers you support, and the model still holds the star the reader
            arrowed to — verify both with the keyboard, not the mouse.</li>
          <li>The error state is carried by your own markup, not by <code>[invalid]</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Two sources, one strip</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>String</th><th>Comes from</th><th>How it is translated</th></tr>
            </thead>
            <tbody>
              <tr><td>The group name</td><td>Your template</td><td>{{ m.i18nGroup }}</td></tr>
              <tr><td>The per-star name</td><td>The Optimus configuration</td><td>{{ m.i18nStar }}</td></tr>
              <tr><td>The visible value text</td><td>Your template</td><td>{{ m.i18nValue }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>starAriaLabel</code> at <code>openng-optimus-ui-rating.mjs:240-242</code> reads
          <code>config.translation.aria.star</code> and <code>aria.stars</code>; the English defaults are declared in
          <code>openng-optimus-ui-config.mjs:180-181</code>. The component exposes no label input of its own.
        </p>

        <h3>Setting the star vocabulary</h3>
        <p>{{ m.i18nSwitch }}</p>
        <pre class="code-block"><code>{{ translationSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> (<code>openng-optimus-ui-config.mjs:246-249</code>) merges at the top level only,
          so the object passed for <code>aria</code> replaces the whole <code>aria</code> block. Changes are published
          on <code>translationObserver</code>, the observable side of a <code>Subject</code> (<code>:241-242</code>),
          which this <code>OnPush</code> component does not subscribe to.
        </p>

        <h3>What the placeholder cannot express</h3>
        <p>{{ m.i18nPlural }}</p>

        <h3>Translating the group name in this kit</h3>
        <pre class="code-block"><code>{{ i18nGroupSnippet }}</code></pre>
        <p class="src-note">
          The kit's ordinary pattern: <code>TranslationService.translate()</code> read inside a
          <code>computed</code>, which makes the computed depend on the service's translation version signal and re-run
          on a language switch. Nothing on this path touches the Optimus configuration.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the selected-star rows re-quoted
            (dark 4.75:1 and up, the contrast-accent exception gone); the ring, where the component shows it, is the
            kit's one 2px ring.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Design cites the compilat rows for the selected-star color
            (<code>primary.color</code> on the card, every style and mode, the contrast-accent exception named) instead
            of calling the rendered strip unmeasured; annotated Sources close the Usage tab; doc trimmed under the size
            aim.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-rating-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-rating-article .stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-rating-article .rating-field {
        border: 0;
        margin: 0;
        padding: 0;
      }

      app-rating-article .rating-field legend {
        padding: 0;
        font-weight: 600;
        margin-bottom: 0.35rem;
      }

      app-rating-article .stage-note {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-rating-article .checklist,
      app-rating-article .history {
        line-height: 1.7;
      }

      app-rating-article .static-score i {
        color: var(--primary-color);
        font-size: 1rem;
        margin-inline-end: 0.25rem;
      }

      app-rating-article .static-score .static-score__off {
        color: var(--text-color-secondary);
      }

      app-rating-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-rating-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-rating-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-rating-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-rating-article .dd__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-rating-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-rating-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-rating-article .sources a {
        color: var(--primary-color-fg);
      }

      app-rating-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-rating-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      @media (max-width: 640px) {
        app-rating-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class RatingArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Live example state. */
  readonly score = signal<number | null>(null);
  readonly ddNameBad = signal<number | null>(3);
  readonly ddNameGood = signal<number | null>(3);
  readonly ddIconBad = signal<number | null>(3);
  readonly ddIconGood = signal<number | null>(3);
  readonly ddIconHeart = signal<number | null>(3);

  /** Only the color separates the two states in the Don't example — which is the point. */
  readonly dimmedIcon: Record<string, string> = { color: 'var(--text-color-secondary)' };

  scoreLabel(): string {
    const v = this.score();
    return v === null ? 'nothing yet' : v + ' of 5';
  }

  // --- measurements, as flat constants so the tab extractor resolves them -----
  readonly m = {
    // usage — which control
    whenRating:
      'Five ranked steps, no labels to read, and the shape of the answer is common knowledge. The scale has to be ordinal and coarse, because nothing distinguishes the steps but their position.',
    whenStatic:
      'A score nobody can change is not an input. Read-only mode still renders focusable radio buttons, so it hands a keyboard reader a control that does nothing.',
    whenRadio:
      'Stars carry rank and nothing else. As soon as the choices have meanings a reader has to read, they need visible labels, which this component has no room for.',
    whenSlider:
      'Ten steps are already a long row, and the row never wraps; a continuous value belongs on a track with a printed number.',
    whenSegments:
      'Named alternatives that fit on one line read faster as segments than as a rank a reader has to decode.',

    // usage — do/don't rationales
    namelessWhy:
      'The host renders as a plain element: its only bindings are a class and a data attribute, with no role. A name written on an element with generic semantics is not exposed, so the radios inside are announced one by one with no idea what is being rated.',
    fieldsetWhy:
      'The legend names the group for every reader, the radios inherit that context, and the name survives translation because it is an ordinary string in your template.',
    readonlyWhy:
      'Read-only sets an attribute HTML does not define for radio buttons and adds no aria-readonly, so the radios stay in the tab order and are announced as choosable. What blocks the change is a JavaScript guard, which assistive technology never sees.',
    imgWhy:
      'One node, one name, one value, out of the tab order — which is what a printed score is. Those are the semantics app-generic-card uses for its card ratings; the ink is yours to choose, and a star that carries meaning needs the 3:1 of SC 1.4.11 against the surface behind it.',
    sameShapeWhy:
      'Both classes resolve to the same glyph and only the color separates a filled star from an empty one, which fails SC 1.4.1 for anyone who cannot make that distinction — and disappears entirely under a forced-colors mode.',
    twoShapeWhy:
      'The defaults are two different icons, a filled star and an outlined one, so the state survives grayscale, a color deficiency, and a forced palette. Override the pair only with two shapes that stay as distinct.',

    // design — tokens
    tokGap: '0.25rem',
    tokSize: '1rem',
    tokColor: 'a preset reference to the muted text color',
    tokActive: 'a preset reference to the primary color',
    tokHover: 'a preset reference to the primary color',
    tokRing:
      "five preset references — width, style, color, offset, and shadow; the kit's one ring (2px --primary-color-fg, 2px offset) replaces them on the same class",

    // design — contrast
    contrastIntro:
      'A rendered strip paints its selected stars in {primary.color}, the accent, and its empty ones in {text.muted.color}; no visual style re-points either. The compilat measures the selected color on the card as the checkbox fill (rows <accent>.primary.color on --surface-card, group "checkbox & radiobutton", SC 1.4.11): 5.18:1 to 17.85:1 in light mode and 4.75:1 to 16.06:1 in dark mode, every style and all ten accents — the dark accent ramp comes from the contrast-adjusted foreground, and the gate has no exceptions. The empty-star color is not in the gate. The table below settles the case a caller controls outright: a star painted in the kit secondary ink on a card, the ink the static score markup in the Usage tab gives its empty stars.',
    contrastCriterion:
      'A star is a graphic, not text: the criterion that applies to it is SC 1.4.11 at 3:1, while the compilat computes these rows against SC 1.4.3 at 4.5:1. All eight clear both thresholds, the lowest at 5.21:1, blaupause in light mode. The pair no table settles is the one that carries the meaning inside a rendered strip, filled star against empty star — which is why the two default icons differ in shape, not only in color.',
    targetSize:
      'Each option box is one icon wide, so at the preset values it is a 16 by 16 CSS-pixel target with 4 pixels between neighbors: 20 pixels center to center. SC 2.5.8 (AA) asks for 24 by 24, and its spacing exception does not rescue this either, because 24-pixel circles placed 20 pixels apart overlap. Raise rating.icon.size, or add padding to the option and widen rating.gap to match, wherever the criterion is in scope.',
    narrowStatement:
      'No intrinsic responsive behavior: the row is an inline-flex with no flex-wrap, so it keeps its intrinsic width at every viewport — five stars at the preset values are about 96 pixels wide and fit anywhere, while ten are about 196 pixels and simply overflow a narrower container instead of wrapping. Layout guidance: keep the count at five for a form a phone will see, and where you need more, put the strip in a container that scrolls rather than one that clips.',

    // development — API
    inStars:
      'How many options are rendered. Read once during initialization; a later change does not rebuild the row.',
    inReadonly:
      'Blocks click, selection, and focus handling in JavaScript and adds the p-readonly class. It changes no exposed semantics.',
    inAutofocus: 'Forwarded to the autofocus directive on every hidden radio.',
    inIconClass:
      'Replaces the default icon with a span carrying that class — the escape hatch to an icon font. A class the font does not define renders an empty span.',
    inIconStyle: 'An inline style object on the icon, applied to both the default svg and a class-based span.',
    inInherited:
      'Neither is declared on the component: both come from the editable-holder base it extends. Disabled reaches every radio as a real disabled attribute and takes the strip out of the tab order; name replaces the group name the component would otherwise generate, which is what lets two strips share one radio group — or collide.',
    inRequiredInvalid:
      'Also inherited, and the two behave very differently. Required reaches every radio as an attribute (`:275`). Invalid only adds a class to the icons, and that class has no working rule behind it: the error state has to come from your own markup.',
    outRate:
      'Emits the original event and the new value on every change, including the clearing one, where the value is null.',
    outFocus:
      'Blur always fires. Focus does not: the handler returns before emitting while the strip is read-only or disabled, so a read-only strip a reader can still tab into reports nothing.',
    inTemplates:
      'Content templates that replace the icon entirely; the context carries the star number and the class the component would have used.',
    inValue:
      'A number or null through ngModel or a form control — the component registers a value accessor, so it is an ordinary form field.',

    // development — behaviors
    toggleOff:
      'The selection handler writes null instead of the number under either of two conditions: the star being selected already carries the model value, or it is the star whose index the component currently records as focused. The first is the documented feature — re-selecting clears a rating, which is the only clearing path the component offers a pointer. The second is the same branch reached from a different direction, because the focus handler sets that index to the star whose hidden radio just received focus, and a change event routes straight into the same method.',
    toggleOffKeyboard:
      'Whichever way it is reached, a caller has to treat null as a legitimate model value and read what actually arrived rather than assuming the star that was pressed. Drive the strip from the keyboard in your build and read the model after every key: the clearing branch fires whenever the star being selected is the one that already holds focus.',
    invalidState:
      'Setting invalid adds a class to both icons and nothing else happens. The single rule written for that class sets a stroke from a token the Aura preset never declares, and the star paths are painted with fill rather than stroke — two independent reasons the strip looks exactly as it did. An error has to be carried by your own markup: a message beside the group, and the group itself marked on the element that has the name.',
    starsOnce:
      'The array of options is built during initialization and never again, so binding the count to something that changes leaves the row at its first length while the model happily accepts higher numbers. Treat the count as a constant, or recreate the component when it has to change.',
    focusRing:
      'The visible ring is a class the component adds only when it believes the focus came from a keyboard, and it decides that by asking the focus event for a non-standard property that only Chromium-based browsers provide. Where the property is absent the comparison is false and a plain tab-in draws no ring — the hidden radio cannot show the browser default either, because it is clipped to a pixel. After a value change the component sets the flag itself, so the ring appears once the reader has selected something. When it shows, it is the kit’s one ring — 2px --primary-color-fg, keyed on that same class (src/styles.scss), 3.88:1 and up on the page surfaces — so the kit makes the ring strong, not more frequent. Verify with the keyboard in every engine you support.',

    // i18n
    i18nGroup:
      'An ordinary string in your markup — translate it the way every other label in the kit is translated, through the translation service, read inside a computed.',
    i18nStar:
      'Not yours: the component builds it from the aria.star and aria.stars entries of the Optimus configuration, which default to English and are the same for the whole application.',
    i18nValue:
      'The sentence that states the score in words is yours as well, and it is what carries the value to a reader who does not hear the radio labels.',
    i18nPlural:
      'The vocabulary is two strings and one substitution: one string for exactly one star, one for every other number, with the count pasted into a literal placeholder. Languages that inflect on two, on the last digit, or on a paucal class cannot be expressed in that shape at all, and the placeholder must survive translation verbatim or the number disappears from the label.',
    i18nSwitch:
      'The star vocabulary is application state, not component state: one setting for every strip in the application, and no way to vary it per instance. Set it before the strip renders, and re-create or re-render the strip if the language changes while it is on screen.',
  };

  // --- code samples, flat constants for the same reason ----------------------

  readonly anatomySnippet = `<!-- One p-rating, once per star, five times over. -->
<p-rating class="p-rating" data-p="...">          <!-- no role, no aria-* -->
  <div class="p-rating-option">                   <!-- (click) lives here -->
    <span class="p-hidden-accessible">            <!-- clip: rect(0 0 0 0) -->
      <input type="radio" name="pn_id_7_name" value="1"
             aria-label="1 star" />               <!-- transform: scale(0) -->
    </span>
    <svg data-p-icon="star-fill" class="p-rating-icon p-rating-on-icon" />
  </div>
  ...
</p-rating>`;

  readonly ddImgSnippet = `<!-- One node, one name, no tab stop. -->
<span role="img" [attr.aria-label]="scoreLabel()">
  <span aria-hidden="true">
    <i class="pi pi-star-fill"></i><i class="pi pi-star-fill"></i>
    <i class="pi pi-star-fill"></i><i class="pi pi-star"></i>
    <i class="pi pi-star"></i>
  </span>
</span>`;

  readonly recommendedSnippet = `<fieldset class="score">
  <legend>{{ groupLabel() }}</legend>

  <p-rating [ngModel]="score()" (ngModelChange)="score.set($event)"
            (onRate)="submit($event.value)" />

  <!-- The value in words: the star row itself never states it. -->
  <p aria-live="polite">{{ scoreText() }}</p>

  <!-- Clearing exists only by re-selecting the current star, which needs
       a pointer to aim. Offer a real control for it. -->
  <button type="button" (click)="score.set(null)">{{ clearLabel() }}</button>
</fieldset>`;

  readonly translationSnippet = `// app.config.ts — the whole application shares one star vocabulary.
provideOptimus({
  theme: { preset: Aura, options: { prefix: 'p' } },
  translation: { aria: { star: 'Ein Stern', stars: '{star} Sterne' } },
})

// Later, from the config service. setTranslation merges only at the top
// level, so the aria object you pass REPLACES the whole aria block —
// spread the existing one or every other aria string is lost.
config.setTranslation({
  aria: { ...config.getTranslation('aria'), star: 'Ein Stern',
          stars: '{star} Sterne' },
});`;

  readonly i18nGroupSnippet = `// The group name is yours, so it follows the kit's ordinary pattern:
// translate() is read INSIDE a computed, which makes the computed depend on
// the translation version signal and re-run on a language switch.
private readonly i18n = inject(TranslationService);

readonly groupLabel = computed(() => this.i18n.translate('review.score.label'));
readonly scoreText = computed(() => {
  const score = this.score();
  // translate() takes a key and nothing else, so the number is substituted
  // here, into a placeholder the translation has to carry through verbatim.
  return score === null
    ? this.i18n.translate('review.score.empty')
    : this.i18n.translate('review.score.value').replace('{score}', String(score));
});`;
}
