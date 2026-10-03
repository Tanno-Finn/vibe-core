import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from '@openng/optimus-ui/card';
import { SelectModule } from '@openng/optimus-ui/select';
import { TimelineModule } from '@openng/optimus-ui/timeline';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Timeline (`p-timeline`) — Guides layer, library category.
 *
 * Timeline is geometry and nothing else: an `@for` over `value`, three divs per
 * event, one preset stylesheet. The guide is therefore about what the component
 * does NOT do — no role, no name, no keyboard, no responsive branch — and about
 * the two places where the shipped surface and its own documentation disagree.
 *
 * VERIFIED CLAIMS (source read at @openng/optimus-ui 2.0.2):
 *   - Zero `role`, `aria`, `tabindex`, `Output` and `EventEmitter` occurrences in
 *     the whole 256-line bundle (openng-optimus-ui-timeline.mjs). Six generic divs
 *     per event, two of them conditional (marker only without a template,
 *     connector on every event but the last); everything semantic is the caller's.
 *   - Four plain @Input()s only — value, styleClass, align, layout (:157). No
 *     `style` input (p-card has one). pt/dt/unstyled/ptOptions arrive by
 *     inheritance from BaseComponent (openng-optimus-ui-basecomponent.mjs:428).
 *   - `align` is typed `string` in the shipped type declarations (:97) and its JSDoc lists only
 *     left|right|top|bottom (:94) — 'alternate' is missing from the doc yet fully
 *     styled by the preset (@openng/optimus-ui-styles/dist/timeline:32-50, :150-152).
 *     The value is concatenated into the root class verbatim (:14), so an
 *     unknown value styles nothing and raises nothing.
 *   - `align="top"` has no rule anywhere in the preset; only p-timeline-bottom
 *     ships one (:154). "top" is horizontal's resting state.
 *   - The eventOpposite div renders unconditionally (:160-162) and is flex:1
 *     beside a flex:1 content box (:71-77) — the empty half is what makes
 *     alternate symmetric and what halves a plain left-aligned timeline.
 *   - Per-event alignment classes do NOT exist: the classes map (:13-21) gives
 *     every event `p-timeline-event` alone and puts p-timeline-<align> on the
 *     root (:14). A `.p-timeline-event-left` rule matches nothing.
 *   - `@for (… track event)` (:158) tracks object identity; `value` is a plain
 *     @Input (:217) on an OnPush component (:208).
 *   - ViewEncapsulation.None (:209): the preset and every override are global.
 *   - The preset resets the root as if it were a list (list-style/margin/padding,
 *     :7-9) and hard-codes `direction: ltr` on it (:6) — the only component-level
 *     direction lock in the parts of the library this guide touches.
 *   - Aura tokens read from @openng/optimus-ui-themes/dist/aura/timeline/index.mjs.
 *   - Variable names and emission: prefix `p`, selector `:root,:host`, written
 *     from a runtime-injected <style> element (@openng/optimus-ui-styled) — which
 *     lands after src/styles.scss and therefore wins at equal specificity.
 */
@Component({
  selector: 'app-timeline-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, TimelineModule, CardModule, SelectModule, ToggleSwitchModule, FormsModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'timeline'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A timeline is a rail: a marker per entry, a connector between them, and your content beside them. That is the
          whole component — an <code>&#64;for</code> over <code>value</code>, three boxes per event, one stylesheet. It
          has no role, no name, no keyboard model, and no breakpoint. The playground below is a real
          <code>p-timeline</code>; the controls change the two inputs that decide its geometry.
        </p>

        <section class="pg" aria-label="Timeline layout playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-layout-label">layout</span>
                <p-select
                  [ariaLabelledBy]="'pg-layout-label'"
                  size="small"
                  [options]="layoutOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgLayout()"
                  (ngModelChange)="pgLayout.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-align-label">align</span>
                <p-select
                  [ariaLabelledBy]="'pg-align-label'"
                  size="small"
                  [options]="alignOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAlign()"
                  (ngModelChange)="pgAlign.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-opp">Fill the opposite slot</label>
                <p-toggleswitch inputId="pg-opp" [ngModel]="pgOpposite()" (ngModelChange)="pgOpposite.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-marker">Custom marker</label>
                <p-toggleswitch inputId="pg-marker" [ngModel]="pgMarker()" (ngModelChange)="pgMarker.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-list">List semantics via pt</label>
                <p-toggleswitch inputId="pg-list" [ngModel]="pgList()" (ngModelChange)="pgList.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview — the root class is what the controls really change</span>
              <div class="pg__stage">
                <!-- The component is OnPush and its slots are content queries: a slot template switched
                     on after content-init is not guaranteed to render. Re-creating the timeline per slot
                     combination keeps the demo reliable; in your own code keep slot templates unconditional. -->
                @for (key of [pgSlotKey()]; track key) {
                  <p-timeline
                    class="demo-tl"
                    [value]="events"
                    [layout]="pgLayout()"
                    [align]="pgAlign()"
                    [pt]="pgList() ? listPt : emptyPt"
                  >
                    @if (pgOpposite()) {
                      <ng-template #opposite let-event>
                        <time class="demo-time" [attr.datetime]="event.iso">{{ event.year }}</time>
                      </ng-template>
                    }
                    @if (pgMarker()) {
                      <ng-template #marker let-event>
                        <span class="demo-marker"><span aria-hidden="true">{{ event.glyph }}</span></span>
                      </ng-template>
                    }
                    <ng-template #content let-event>
                      <h4 class="demo-h">{{ event.title }}</h4>
                      <p class="demo-p">{{ event.summary }}</p>
                    </ng-template>
                  </p-timeline>
                }
              </div>
              <p class="pg__read">
                Root class: <code>{{ pgRootClass() }}</code>
              </p>
            </div>
          </div>
        </section>
        <p class="src-note">
          The read-out is composed the way the component composes it: <code>'p-timeline p-component'</code>, then
          <code>'p-timeline-' + align</code>, then <code>'p-timeline-' + layout</code>, from the classes map in
          <code>openng-optimus-ui-timeline.mjs</code> (2.0.2).
        </p>

        <h3>What one event renders</h3>
        <div class="table-wrap">
          <table>
            <caption>
              The DOM of a single event, outermost first
            </caption>
            <thead>
              <tr>
                <th>Element</th>
                <th>Class</th>
                <th>Rendered</th>
                <th>Carries</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>host</td>
                <td><code>p-timeline p-component p-timeline-&lt;align&gt; p-timeline-&lt;layout&gt;</code></td>
                <td>once</td>
                <td>flex column, plus <code>data-p</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event</code></td>
                <td>per entry</td>
                <td>flex row, <code>min-height</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-opposite</code></td>
                <td><strong>always</strong>, even empty</td>
                <td><code>flex: 1</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-separator</code></td>
                <td>per entry</td>
                <td><code>flex: 0</code>, column</td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-marker</code></td>
                <td>only without a <code>#marker</code> template</td>
                <td>empty; drawn by two pseudo-elements</td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-connector</code></td>
                <td>every entry but the last</td>
                <td><code>flex-grow: 1</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-content</code></td>
                <td>per entry</td>
                <td><code>flex: 1</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Structure from the inline template of <code>openng-optimus-ui-timeline.mjs</code> (2.0.2), class names from its
          classes map; the flex values from <code>&#64;openng/optimus-ui-styles/dist/timeline/index.mjs</code>.
        </p>

        <h3>The half nobody asked for</h3>
        <p>
          Switch <em>Fill the opposite slot</em> off above and the layout does not change: the opposite box is still
          there, still <code>flex: 1</code>, just empty. On <code>align="alternate"</code> that is the feature — it is
          what makes the two sides mirror. On <code>align="left"</code> it is half your width spent on nothing, and the
          fix is a pass-through, not a missing template:
        </p>
        <pre class="code-block"><code>{{ oppositeFixSnippet }}</code></pre>

        <h3>Below the breakpoint</h3>
        <p>
          There is no narrow-screen variant to demonstrate, because there is none to have: the preset contains no media
          query and the component takes no breakpoint input. What a caller can do is switch <code>align</code> from
          their own query, which keeps one component and one DOM:
        </p>
        <pre class="code-block"><code>{{ responsiveSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Most chronologies in this kit should not be a <code>p-timeline</code>. Two kit components already cover the
          shapes that recur in portal content, and each of them ships the semantics this one does not. Reach for the
          library component when you are building the chronology page itself.
        </p>

        <h3>Which rail for which job</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shape</th>
                <th>Reach for</th>
                <th>Why not <code>p-timeline</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A static list of dated events inside an article</td>
                <td><code>app-timeline</code></td>
                <td>It ships <code>role="list"</code> / <code>role="listitem"</code> and a <code>headingLevel</code> input; you would rebuild both by hand.</td>
              </tr>
              <tr>
                <td>A year rail the reader picks entries from</td>
                <td><code>app-interactive-timeline</code></td>
                <td>Entries are buttons with <code>aria-pressed</code>; <code>p-timeline</code> has no interaction model at all.</td>
              </tr>
              <tr>
                <td>Steps through the app's own flow</td>
                <td><code>p-steps</code> / <code>p-stepper</code></td>
                <td>Those carry current-step state; a timeline has no notion of "where you are".</td>
              </tr>
              <tr>
                <td>Records compared field by field</td>
                <td><code>p-table</code></td>
                <td>Comparison wants columns and sorting, not a rail.</td>
              </tr>
              <tr>
                <td>A full-page chronology you skin yourself</td>
                <td><code>p-timeline</code></td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit component surfaces read from their component sources; library alternatives from their shipped Optimus UI
          2.0.2 bundles.
        </p>

        <h3>The slot contract</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Query</th>
                <th>Context</th>
                <th>When absent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#content</code></td>
                <td><code>ContentChild('content', &#123; descendants: false &#125;)</code></td>
                <td><code>$implicit</code> = the entry</td>
                <td>an empty content box, still <code>flex: 1</code></td>
              </tr>
              <tr>
                <td><code>#opposite</code></td>
                <td><code>ContentChild('opposite', &#123; descendants: false &#125;)</code></td>
                <td><code>$implicit</code> = the entry</td>
                <td>an empty box that still takes half the row</td>
              </tr>
              <tr>
                <td><code>#marker</code></td>
                <td><code>ContentChild('marker', &#123; descendants: false &#125;)</code></td>
                <td><code>$implicit</code> = the entry</td>
                <td>the preset's dot, drawn with two pseudo-elements</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Query options and the template outlets from <code>openng-optimus-ui-timeline.mjs</code> (2.0.2); the
          <code>pTemplate="content|opposite|marker"</code> route resolves through the same fields via a
          <code>PrimeTemplate</code> content query.
        </p>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a slot template inside a wrapper</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ slotBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              The slot queries are <code>descendants: false</code>. One element deeper and the template is never found:
              no error, no warning, just the default dot and an empty content box.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a direct child, condition inside</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ slotGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              The template stays a direct child of <code>&lt;p-timeline&gt;</code>; anything conditional lives inside
              it, where it re-evaluates normally.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the category as a marker color</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ colorBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              The marker is an empty box with no text. A reader who cannot tell the hues apart gets no category at all —
              SC 1.4.1.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — color plus a text carrier</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ colorGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              The hue stays as a fast visual index; the category itself is read from the content, where assistive tech
              can reach it.
            </p>
          </div>
        </div>

        <h3>A reference implementation</h3>
        <p>
          The kit's own chronology page is the pattern to copy: a single <code>p-timeline</code> with
          <code>align="alternate"</code> for wide viewports, a hand-built single-column list for narrow ones, and a
          media query that shows exactly one of them. Two DOM trees is the price of a component with no responsive
          behavior of its own.
        </p>

        <h3>Sources</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#list" rel="noopener noreferrer" target="_blank">
              WAI-ARIA 1.2 — <code>list</code> / <code>listitem</code></a
            >
            — the structure the component omits, and the one <code>pt</code> can put back.
          </li>
          <li>
            <a href="https://www.w3.org/TR/css-flexbox-1/#order-accessibility" rel="noopener noreferrer" target="_blank">
              CSS Flexbox 1 — Reordering and Accessibility</a
            >
            — the spec's own rule about visual reordering, which is all <code>align="alternate"</code> does.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html" rel="noopener noreferrer" target="_blank">
              WCAG 2.2 — SC 1.3.2 Meaningful Sequence</a
            >
            — the criterion an alternating layout has to clear.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" rel="noopener noreferrer" target="_blank">
              WCAG 2.2 — SC 1.4.1 Use of Color</a
            >
            — why a color-coded marker needs a second carrier.
          </li>
          <li>
            <a href="https://optimus.openng.org/timeline" rel="noopener noreferrer" target="_blank">Optimus UI — Timeline</a>
            — the vendor API page; every claim on this page was re-checked against the shipped 2.0.2 source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Everything visual about a timeline comes from one stylesheet and one token file (fourteen values). Nothing is computed, nothing is
          measured at runtime, and nothing reacts to the viewport.
        </p>

        <h3>The token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>CSS variable</th>
                <th>Aura value</th>
                <th>Where it lands</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>timeline.event.min.height</code></td>
                <td><code>--p-timeline-event-min-height</code></td>
                <td>{{ m.minHeight }}</td>
                <td>every event but the last (last is <code>0</code>)</td>
              </tr>
              <tr>
                <td><code>timeline.vertical.event.content.padding</code></td>
                <td><code>--p-timeline-vertical-event-content-padding</code></td>
                <td>{{ m.vPadding }}</td>
                <td>content and opposite, vertical layout</td>
              </tr>
              <tr>
                <td><code>timeline.horizontal.event.content.padding</code></td>
                <td><code>--p-timeline-horizontal-event-content-padding</code></td>
                <td>{{ m.hPadding }}</td>
                <td>content and opposite, horizontal layout</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.size</code></td>
                <td><code>--p-timeline-event-marker-size</code></td>
                <td>{{ m.markerSize }}</td>
                <td>marker width and height</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.border.radius</code></td>
                <td><code>--p-timeline-event-marker-border-radius</code></td>
                <td>{{ m.radius }}</td>
                <td>marker outline and the <code>::after</code> overlay</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.border.width</code> / <code>.color</code></td>
                <td><code>--p-timeline-event-marker-border-width</code> / <code>-color</code></td>
                <td>{{ m.markerBorder }}</td>
                <td>the ring around the dot</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.background</code></td>
                <td><code>--p-timeline-event-marker-background</code></td>
                <td>{{ m.markerBackground }}</td>
                <td>marker fill</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.content.size</code> / <code>.background</code></td>
                <td><code>--p-timeline-event-marker-content-size</code> / <code>-background</code></td>
                <td>{{ m.markerDot }}</td>
                <td>the <code>::before</code> dot</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.content.border.radius</code></td>
                <td><code>--p-timeline-event-marker-content-border-radius</code></td>
                <td>{{ m.radius }}</td>
                <td>the <code>::before</code> dot's own outline</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.content.inset.shadow</code></td>
                <td><code>--p-timeline-event-marker-content-inset-shadow</code></td>
                <td>two stacked shadows</td>
                <td>the <code>::after</code> overlay</td>
              </tr>
              <tr>
                <td><code>timeline.event.connector.size</code> / <code>.color</code></td>
                <td><code>--p-timeline-event-connector-size</code> / <code>-color</code></td>
                <td>{{ m.connector }}</td>
                <td>connector thickness (width when vertical, height when horizontal)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/timeline/index.mjs</code> (2.0.2); the variable names
          follow the <code>p</code> prefix and kebab path documented in <code>&#64;openng/optimus-ui-styled</code>. Braced
          values are Aura semantic references, not literals.
        </p>

        <h3>Overriding a token is not where you think</h3>
        <p>
          The <code>--p-timeline-*</code> declarations are written to <code>:root,:host</code> by a
          <code>&lt;style&gt;</code> element the library injects at runtime, which lands after the application
          stylesheet. A <code>:root</code> re-declaration in <code>src/styles.scss</code> therefore ties on specificity
          and loses on order — the same shape the kit already documents for its select overrides. Two things do work:
        </p>
        <pre class="code-block"><code>{{ tokenOverrideSnippet }}</code></pre>
        <p class="src-note">
          Prefix and default selector from <code>&#64;openng/optimus-ui-styled</code>; the injection-order consequence is
          the finding already recorded in <code>src/styles.scss</code> for the select focus ring.
        </p>

        <h3>What each layout mode actually is</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Root class</th>
                <th>Rule it triggers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-timeline-left</code></td>
                <td>opposite <code>text-align: right</code>, content <code>text-align: left</code></td>
              </tr>
              <tr>
                <td><code>p-timeline-right</code></td>
                <td>event <code>flex-direction: row-reverse</code>, plus the mirrored text alignment</td>
              </tr>
              <tr>
                <td><code>p-timeline-alternate</code></td>
                <td>vertical: <code>row-reverse</code> on even events; horizontal: <code>column-reverse</code> on even events</td>
              </tr>
              <tr>
                <td><code>p-timeline-bottom</code></td>
                <td>event <code>flex-direction: column-reverse</code></td>
              </tr>
              <tr>
                <td><code>p-timeline-top</code></td>
                <td><strong>no rule at all</strong> — it is the horizontal resting state</td>
              </tr>
              <tr>
                <td><code>p-timeline-horizontal</code></td>
                <td>root becomes a row; events become columns with <code>flex: 1</code> (last one <code>0</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rule inventory read straight from <code>&#64;openng/optimus-ui-styles/dist/timeline/index.mjs</code> (2.0.2) —
          the whole preset, not a sample.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          <strong>No intrinsic responsive behavior whatsoever.</strong> The preset contains no media query and the
          component takes no breakpoint input, so an <code>align="alternate"</code> rail still renders two
          <code>flex: 1</code> columns plus a marker at 360 px — about 170 px per half, the 18 px marker
          halved out, of which 2 &times; 16 px is content padding, leaving roughly 139 px of text, which is
          two or three words per line. Layout guidance: switch <code>align</code> to <code>"left"</code> below roughly
          <code>48rem</code> and reclaim the opposite half with <code>pt.eventOpposite</code>, or hide the timeline
          under that breakpoint and render a single-column list instead.
        </p>

        <h3>Contrast</h3>
        <p>
          The marker ring and the connector both read Aura's <code>content.border.color</code>. The kit's contrast
          compilat does not gate the timeline, but it lists that same color as the informational
          <code>progressbar.background</code> rows: 1.13–1.76:1 on the page ground, 1.23–1.61:1 on the card — a
          decoration, not a boundary. If a marker or a connector carries
          meaning rather than decoration, repaint it from a measured kit token: <code>--control-border</code> on
          <code>--surface-card</code> is 5.23:1 light and 4.91:1 dark in the werkbund style, and no lower than
          3.97:1 (blaupause, dark) in any of the four visual styles, against the 3:1 that SC 1.4.11 asks of a
          meaningful boundary.
        </p>
        <p class="src-note">
          Ratios quoted from <code>docs/generated/CONTRAST.MD</code>, sections "control boundary" and "progressbar
          &amp; slider" (the Aura track rows, same token), every style and mode. No visual style block in
          <code>styles.scss</code> touches the timeline, so its geometry and ring colors are the same in every style;
          only the marker dot follows the accent, through <code>&#123;primary.color&#125;</code>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Four inputs, three slots, eight pass-through sections, no outputs, and no methods. The behavior worth knowing
          is not in the API surface but in two Angular details: how <code>value</code> is declared, and how the
          <code>&#64;for</code> tracks.
        </p>

        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Default</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>any[]</td>
                <td><code>undefined</code></td>
                <td>plain <code>&#64;Input()</code>, not a signal</td>
              </tr>
              <tr>
                <td><code>layout</code></td>
                <td><code>'vertical' | 'horizontal'</code></td>
                <td><code>'vertical'</code></td>
                <td>the one input that is really typed</td>
              </tr>
              <tr>
                <td><code>align</code></td>
                <td><code>string</code></td>
                <td><code>'left'</code></td>
                <td>untyped; the JSDoc omits <code>'alternate'</code>, which works anyway</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td><code>string</code></td>
                <td><code>undefined</code></td>
                <td>deprecated since v20.0.0, still merged into the host class — use <code>class</code></td>
              </tr>
              <tr>
                <td><code>pt</code>, <code>dt</code>, <code>unstyled</code>, <code>ptOptions</code></td>
                <td>signal inputs</td>
                <td>—</td>
                <td>inherited from the library's base component, not declared here</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declarations and defaults from <code>openng-optimus-ui-timeline.mjs</code> and the matching type
          declarations under <code>&#64;openng/optimus-ui/types</code> (2.0.2); the inherited four from
          <code>openng-optimus-ui-basecomponent.mjs</code>.
        </p>

        <h3>Change detection</h3>
        <p>
          The component is <code>OnPush</code> and <code>value</code> is a classic <code>&#64;Input()</code>. Pushing
          into the array you already passed changes nothing on screen, because no input reference changed and nothing
          marked the view. The reliable shape is a new array — which a signal read in the parent template gives you for
          free:
        </p>
        <pre class="code-block"><code>{{ valueSnippet }}</code></pre>
        <p>
          The loop tracks the entry object itself. Rebuilding your entries — a refetch that maps fresh objects — is
          therefore a full teardown: every event node is destroyed and recreated, and anything stateful inside your
          <code>#content</code> (an open disclosure, a focused link, a scroll offset) goes with it. Keep object identity
          stable across refreshes when the content holds state.
        </p>

        <h3>Pass-through sections</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Section</th>
                <th>Reaches</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>host</code>, <code>root</code></td>
                <td>the <code>&lt;p-timeline&gt;</code> element — merged onto it after every view check</td>
              </tr>
              <tr>
                <td><code>event</code></td>
                <td>the per-entry row</td>
              </tr>
              <tr>
                <td><code>eventOpposite</code>, <code>eventContent</code></td>
                <td>the two <code>flex: 1</code> halves</td>
              </tr>
              <tr>
                <td><code>eventSeparator</code></td>
                <td>the column holding marker and connector</td>
              </tr>
              <tr>
                <td><code>eventMarker</code></td>
                <td>the default dot only — a <code>#marker</code> template replaces the element</td>
              </tr>
              <tr>
                <td><code>eventConnector</code></td>
                <td>the connector, absent on the last entry</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Section names from the classes map in <code>openng-optimus-ui-timeline.mjs</code> (2.0.2); the host merge runs
          from <code>onAfterViewChecked</code> through the library's bind host directive.
        </p>

        <h3>Styling reaches further than you meant</h3>
        <p>
          The component renders with <code>ViewEncapsulation.None</code>, so the preset is global and so is every rule
          you write against its class names. A bare <code>.p-timeline-event &#123; … &#125;</code> in a component
          stylesheet retunes every timeline in the application. Scope by an ancestor, or use
          <code>pt</code> so the rule cannot escape the instance.
        </p>

        <h3>Server-side rendering</h3>
        <p>
          Nothing to guard: the component reads no <code>window</code>, registers no listener, starts no timer, and runs
          no measurement. It renders from <code>value</code> alone, so the prerendered markup and the hydrated markup
          agree as long as your entries do.
        </p>

        <h3>Before you call it done</h3>
        <ul class="checklist">
          <li>☐ The root has a role and an accessible name via <code>pt.root</code>.</li>
          <li>☐ Every slot template is a direct child of <code>&lt;p-timeline&gt;</code>.</li>
          <li>☐ <code>value</code> is replaced, never mutated.</li>
          <li>☐ Any icon inside a <code>#marker</code> template is <code>aria-hidden</code>.</li>
          <li>☐ No meaning rests on marker color alone.</li>
          <li>☐ Focusable content inside <code>#content</code> shows a visible focus ring — the timeline provides none.</li>
          <li>☐ The narrow-screen answer is written down and implemented, not assumed.</li>
          <li>☐ No rule anywhere targets <code>.p-timeline-event-left</code> or <code>-right</code>.</li>
          <li>☐ Empty <code>value</code> renders an empty rail — your empty state is your own.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          The component ships no strings at all — no ARIA defaults, no labels, no injected configuration. Every word in
          a timeline is one you passed in, which makes translation simple and length the only real risk.
        </p>

        <h3>Where the strings come from</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Owner</th>
                <th>How</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>The list's accessible name</td>
                <td>you</td>
                <td><code>pt.root</code>'s <code>aria-label</code>, from a <code>computed()</code> over the translation service</td>
              </tr>
              <tr>
                <td>Entry title, summary, links</td>
                <td>you</td>
                <td>bindings inside <code>#content</code></td>
              </tr>
              <tr>
                <td>The date beside the entry</td>
                <td>you</td>
                <td><code>#opposite</code>, formatted with <code>Intl</code> against the current locale</td>
              </tr>
              <tr>
                <td>Marker text</td>
                <td>you, or nobody</td>
                <td>the default marker is empty; a custom one should stay decorative</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The library side of this table is the absence itself: no ARIA config keys and no injected translation exist
          anywhere in <code>openng-optimus-ui-timeline.mjs</code> (2.0.2).
        </p>

        <h3>Dates belong in the opposite slot, and in Intl</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Locale source and the <code>computed()</code> requirement follow the kit's i18n contract; see the
          <code>i18n-localization</code> guide for the key and locale rules this snippet obeys.
        </p>

        <h3>Length in a fixed half</h3>
        <p>
          A vertical timeline hands each entry exactly half the container minus the marker column, and that half does
          not grow when a translation does. Budget roughly 1.4× the English width for a title that must not wrap onto a
          third line, and remember that the opposite half is bound by the same constraint even though it usually holds
          four characters.
        </p>

        <h3>Right-to-left</h3>
        <p>
          The preset hard-codes <code>direction: ltr</code> on the timeline root, and every layout rule is written in
          physical terms — <code>row-reverse</code>, <code>text-align: left</code>, <code>text-align: right</code> —
          with no logical properties and no <code>:dir()</code> rule anywhere. Inside a <code>dir="rtl"</code> subtree
          the rail therefore does not mirror: <code>align="left"</code> stays visually left, and text inside your slots
          renders LTR unless you set <code>direction</code> back on your own content. This kit ships four
          left-to-right language variants, so nothing here is currently exercised — but a right-to-left variant would
          need an explicit override on the root, not a document-level <code>dir</code>.
        </p>
        <p class="src-note">
          The <code>direction</code> declaration and the absence of logical properties read from
          <code>&#64;openng/optimus-ui-styles/dist/timeline/index.mjs</code> (2.0.2); the shipped language set from the
          kit's language configuration.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the stock marker and connector
            color is cited from the informational <code>progressbar.background</code> rows instead of "not in the
            compilat".
          </li>
          <li>
            <strong>v1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            all line citations hold; the control-boundary ratios re-quoted from CONTRAST.MD per style (the old pair
            predated the styles); stated that no style block touches the timeline; the delineation counts two kit
            timelines, not three; history format aligned; agent doc trimmed.
          </li>
          <li>
            <strong>v1.0</strong> — 2026-09-04 — First edition. Measured against Optimus UI 2.0.2: component bundle,
            style preset, and Aura token file.
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
        grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
        gap: var(--space-5);
      }
      .pg__controls {
        border: 0;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .pg__controls legend {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        padding: 0;
        margin-bottom: var(--space-2);
      }
      .pg__field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .pg__field--switch {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .pg__label,
      .pg__field label {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .pg__preview {
        min-width: 0;
      }
      .pg__preview-label {
        display: block;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin-bottom: var(--space-2);
      }
      .pg__stage {
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-ground);
        overflow-x: auto;
      }
      .pg__read {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        margin: var(--space-3) 0 0;
      }
      .demo-tl .demo-h {
        margin: 0 0 0.2rem;
        font-size: 0.95rem;
      }
      .demo-tl .demo-p {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .demo-time {
        font-family: var(--font-mono);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .demo-marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        border: 2px solid var(--control-border);
        background: var(--surface-card);
        font-size: 0.9rem;
      }
      /* --- Do/Don't --- */
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
        padding: var(--space-3);
        border-radius: var(--radius-md);
        background: var(--surface-ground);
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
      /* --- Blocks --- */
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
      .code-block--inline {
        margin: 0;
        font-size: 0.75rem;
        background: var(--surface-card);
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
      caption {
        text-align: left;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        padding-bottom: 0.4rem;
      }
      th,
      td {
        border: 1px solid var(--surface-border);
        padding: 0.4rem 0.6rem;
        text-align: left;
        vertical-align: top;
      }
      th {
        background: var(--surface-section);
        font-weight: var(--font-weight-medium);
      }
      .checklist {
        list-style: none;
        padding-left: 0;
      }
      .checklist li {
        margin: 0.3rem 0;
      }
      @media (max-width: 900px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 720px) {
        .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TimelineArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Aura token values, read from the shipped theme file — flat strings so the tab extractor resolves them. */
  readonly m = {
    minHeight: '5rem',
    vPadding: '0 1rem',
    hPadding: '1rem 0',
    markerSize: '1.125rem',
    markerBorder: '2px, {content.border.color}',
    markerBackground: '{content.background}',
    markerDot: '0.375rem, {primary.color}',
    radius: '50%',
    connector: '2px, {content.border.color}',
  };

  readonly layoutOptions = [
    { label: 'vertical (default)', value: 'vertical' },
    { label: 'horizontal', value: 'horizontal' },
  ];

  readonly alignOptions = [
    { label: 'left (default)', value: 'left' },
    { label: 'right', value: 'right' },
    { label: 'alternate (undocumented)', value: 'alternate' },
    { label: 'top (no rule)', value: 'top' },
    { label: 'bottom', value: 'bottom' },
  ];

  readonly pgLayout = signal<'vertical' | 'horizontal'>('vertical');
  readonly pgAlign = signal('alternate');
  readonly pgOpposite = signal(true);
  readonly pgMarker = signal(false);
  readonly pgList = signal(true);
  /** One key per slot combination — the playground re-creates the timeline when it changes. */
  readonly pgSlotKey = computed(() => `${this.pgOpposite()}-${this.pgMarker()}`);

  readonly pgRootClass = computed(
    () => 'p-timeline p-component p-timeline-' + this.pgAlign() + ' p-timeline-' + this.pgLayout(),
  );

  readonly emptyPt = {};
  readonly listPt = {
    root: { role: 'list', 'aria-label': 'Release history' },
    event: { role: 'listitem' },
  };

  readonly events = [
    { year: '2021', iso: '2021-03-01', glyph: '◆', title: 'Kit begins', summary: 'One page, one stylesheet, no design system.' },
    { year: '2023', iso: '2023-07-01', glyph: '◆', title: 'Tokens land', summary: 'Color and spacing move out of the components.' },
    { year: '2025', iso: '2025-02-01', glyph: '◆', title: 'Gallery ships', summary: 'The registry becomes the source of truth.' },
    { year: '2026', iso: '2026-09-01', glyph: '◆', title: 'Guides layer', summary: 'Agent docs and article tabs from one file.' },
  ];

  readonly oppositeFixSnippet =
    '<!-- The empty opposite box is always rendered and always flex: 1.\n' +
    '     Give it back to the content instead of leaving half the row blank. -->\n' +
    '<p-timeline [value]="events()" align="left" [pt]="tlPt">\n' +
    '  <ng-template #content let-event>…</ng-template>\n' +
    '</p-timeline>\n\n' +
    "readonly tlPt = { eventOpposite: { style: 'flex: 0' } };";

  readonly responsiveSnippet =
    '<!-- One component, one DOM, the breakpoint in your own stylesheet. -->\n' +
    '<p-timeline [value]="events()" [align]="narrow() ? \'left\' : \'alternate\'">\n' +
    '  …\n' +
    '</p-timeline>\n\n' +
    "// narrow() is a signal over matchMedia('(max-width: 48rem)'),\n" +
    '// guarded for the server the way any media query has to be.';

  readonly slotBadSnippet =
    '<p-timeline [value]="events()">\n' +
    '  <div class="wrap">\n' +
    '    <ng-template #content let-event>…</ng-template>\n' +
    '  </div>\n' +
    '</p-timeline>';

  readonly slotGoodSnippet =
    '<p-timeline [value]="events()">\n' +
    '  <ng-template #content let-event>\n' +
    '    @if (event.detailed) { … } @else { … }\n' +
    '  </ng-template>\n' +
    '</p-timeline>';

  readonly colorBadSnippet =
    '<ng-template #marker let-event>\n' +
    '  <span class="dot" [style.background]="event.categoryColour"></span>\n' +
    '</ng-template>';

  readonly colorGoodSnippet =
    '<ng-template #marker let-event>\n' +
    '  <span class="dot" [style.background]="event.categoryColour" aria-hidden="true"></span>\n' +
    '</ng-template>\n' +
    '<ng-template #content let-event>\n' +
    '  <p class="cat">{{ labels()[event.category] }}</p>\n' +
    '  …\n' +
    '</ng-template>';

  readonly tokenOverrideSnippet =
    '/* Inert: the library re-declares this on :root after your stylesheet loads. */\n' +
    ':root { --p-timeline-event-connector-color: var(--control-border); }\n\n' +
    '/* Works: an element scope beats the :root declaration on specificity. */\n' +
    '.release-rail { --p-timeline-event-connector-color: var(--control-border); }\n\n' +
    '/* Works, and cannot escape the instance: */\n' +
    "readonly tlPt = { eventConnector: { style: 'background: var(--control-border)' } };";

  readonly valueSnippet =
    '// Renders nothing new — same reference, OnPush, no signal input.\n' +
    'this.events.push(next);\n\n' +
    '// Renders: a new array reference.\n' +
    'this.events = [...this.events, next];\n\n' +
    '// Better: a signal read in the template, which marks the view for you.\n' +
    'readonly events = signal<Event[]>([]);\n' +
    '// <p-timeline [value]="events()">';

  readonly i18nSnippet =
    '<p-timeline [value]="events()" [pt]="tlPt()">\n' +
    '  <ng-template #opposite let-event>\n' +
    '    <time [attr.datetime]="event.iso">{{ dateLabel(event.iso) }}</time>\n' +
    '  </ng-template>\n' +
    '</p-timeline>\n\n' +
    '// labels() is a computed() over the translation service, so the name\n' +
    '// re-resolves on a language switch instead of freezing at first read.\n' +
    'readonly tlPt = computed(() => ({\n' +
    "  root: { role: 'list', 'aria-label': this.labels().chronologyName },\n" +
    "  event: { role: 'listitem' },\n" +
    '}));\n\n' +
    'dateLabel(iso: string): string {\n' +
    '  return new Intl.DateTimeFormat(this.i18n.currentIntlLocale, {\n' +
    "    year: 'numeric', month: 'short',\n" +
    '  }).format(new Date(iso));\n' +
    '}';
}
