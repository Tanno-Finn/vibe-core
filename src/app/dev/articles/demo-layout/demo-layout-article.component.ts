import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Demo Layout (layouts).
 *
 * WHAT THE CLAIMS REST ON — the durable artifacts behind every rule in the
 * tabs. The per-widget census that produced these conventions is commit-body
 * material and deliberately absent from the rendered text (guide-authoring:
 * "Provenance, not process", durability test 1):
 *   - The blueprint: src/app/pages/example-demo/example-demo.component.ts —
 *     page order (app-article, app-page-header, app-example-box, the core in
 *     an app-standard-container with headingLevel 2, explainer, checkpoint,
 *     takeaways, app-demo-related), the core grid with the stage first and
 *     the controls panel second, the sr-only live region in the panel, and
 *     :host { container-type: inline-size } with @container (min-width:
 *     700px) switching the grid to minmax(0, 1.3fr) minmax(15rem, 1fr). The
 *     panel's --surface-section ground, border, and padding are unconditional.
 *   - The article-embedded widgets under src/app/components/didactic/ take
 *     config = input.required<XConfig>() and draw no page frame.
 *   - The blueprint's route in src/app/app.routes.ts and its entry in
 *     src/assets/data/core/demos/index.json.
 *   - The gate on a routed demo: src/app/guards/demo-release.guard.ts reads
 *     publishDate through DemosService.isVisible and returns true in dev mode.
 *   - The layout API that shipped unused (demo-layout() mixin, $layout-ratios
 *     map, --layout-demo-* tokens) was deleted from
 *     src/styles/design-tokens.scss on 2026-08-20; the design tab keeps the
 *     lesson as history.
 *   - The global .sr-only rule in src/styles.scss, whose every declaration
 *     carries !important.
 *   - Contrast figures are quoted from docs/generated/CONTRAST.MD, never
 *     eyedropped.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-demo-layout-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'demo-layout'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A demo in this kit is not a page with a template around it. It is a page component that
          follows one blueprint, and the blueprint is the layout. Seeing what that page contains,
          and at which width its interactive core rearranges itself, is most of the job.
        </p>

        <h3>The blueprint, in the order it renders</h3>
        <p>
          Every row below is markup the page itself writes &mdash; nothing arrives unasked, which
          is what makes this a pattern rather than a template.
        </p>
        <div class="skel">
          <div class="skel__band">
            <span class="skel__cap">the page component &mdash; its host is the size container</span>
            <div class="skel__row">app-page-header &mdash; the one h1, then a subtitle</div>
            <div class="skel__row">app-example-box &mdash; what this page is</div>
            <div class="skel__band skel__band--body">
              <span class="skel__cap">app-standard-container, type demo &mdash; an h2</span>
              <div class="skel__row">stage &mdash; a canvas with role=&quot;img&quot; and a name</div>
              <div class="skel__row">panel &mdash; labeled controls, buttons, then the live region</div>
            </div>
            <div class="skel__row skel__row--muted">explainer, checkpoint, takeaways, related content</div>
          </div>
        </div>
        <p>
          The stage comes first in the document and the panel second. At one column that puts the
          thing being manipulated above the controls that manipulate it; at two, it puts it on the
          left. No <code>order</code> property is involved, in either direction.
        </p>
        <p class="src-note">
          Page order, the heading levels, and the part order from the blueprint,
          <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>The same core at two widths</h3>
        <p>
          Both boxes below carry identical markup and one shared rule. The only difference is how
          much room their wrapper gives them &mdash; the viewport is the same for both, which is
          precisely the point. The threshold here is smaller than the blueprint&#39;s, so that
          both states fit side by side on this page.
        </p>
        <div class="cq-row">
          <div class="cq-box cq-box--narrow">
            <div class="cq-card">
              <div class="cq-head">Narrow wrapper</div>
              <div class="cq-body">
                <div class="cq-stage">stage</div>
                <div class="cq-panel">panel</div>
              </div>
            </div>
          </div>
          <div class="cq-box cq-box--wide">
            <div class="cq-card">
              <div class="cq-head">Wide wrapper</div>
              <div class="cq-body">
                <div class="cq-stage">stage</div>
                <div class="cq-panel">panel</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Only the position changes: the panel keeps its border, its padding, and its own ground
          in both states, so it reads as one box of controls whether it sits beside the stage or
          under it.
        </p>
        <p class="src-note">
          The behavior demonstrated is the <code>&#64;container</code> rule of the blueprint
          (<code>src/app/pages/example-demo/example-demo.component.ts</code>), whose component
          host is the size container and whose panel ground is declared outside that rule.
        </p>

        <h3>The two shapes a demo ships as</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Shape</th><th>Frame</th><th>Headings</th><th>Takes</th></tr>
            </thead>
            <tbody>
              <tr><td>Routed demo page</td><td>The blueprint &mdash; page header, standard containers</td><td>One <code>h1</code>, an <code>h2</code> per container</td><td>No config input</td></tr>
              <tr><td>Article-embedded widget</td><td>None &mdash; the article section supplies it</td><td>Content <code>h3</code>/<code>h4</code> under the article&#39;s own</td><td><code>config = input.required&lt;XConfig&gt;()</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The routed shape is <code>src/app/pages/example-demo/</code>; the embedded widgets are
          under <code>src/app/components/didactic/</code>, mounted from the article pages under
          <code>src/app/pages/articles/</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          What to write, in which order, and what has to be registered before a demo is reachable
          at a URL.
        </p>

        <h3>The parts, in document order</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Part</th><th>Element</th><th>Holds</th><th>Optional</th></tr>
            </thead>
            <tbody>
              <tr><td>Page header</td><td><code>app-page-header</code></td><td>The one <code>h1</code> and a subtitle</td><td>No</td></tr>
              <tr><td>Demo section</td><td><code>app-standard-container</code>, <code>type: &#39;demo&#39;</code></td><td>An <code>h2</code>, a lead sentence, and the grid</td><td>No</td></tr>
              <tr><td>Stage</td><td><code>canvas</code> with <code>role=&quot;img&quot;</code>, <code>svg</code>, or plain DOM</td><td>What the reader manipulates, plus its forced-colors text summary</td><td>No</td></tr>
              <tr><td>Panel</td><td><code>div</code></td><td>Labeled controls, buttons, the live region</td><td>No</td></tr>
              <tr><td>Explainer, checkpoint, takeaways</td><td><code>app-standard-container</code>, <code>app-checkpoint</code>, <code>app-takeaways-list</code></td><td>What to observe and what it means</td><td>Yes</td></tr>
              <tr><td>Related content</td><td><code>app-demo-related</code></td><td>The registry entry&#39;s <code>related</code> block</td><td>Yes</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from the blueprint, <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>Where a demo is registered</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Artifact</th><th>File</th><th>Drives</th></tr>
            </thead>
            <tbody>
              <tr><td>The component</td><td><code>src/app/pages/&lt;id&gt;/</code></td><td>The demo page, copied from the blueprint</td></tr>
              <tr><td>The route</td><td><code>src/app/app.routes.ts</code></td><td>The URL, the nav entry, the page-id redirect</td></tr>
              <tr><td>The registry entry</td><td><code>src/assets/data/core/demos/index.json</code></td><td>The hub grid, the release gate, the cross-refs</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The split is not cosmetic. A demo omitted from the JSON still resolves at its URL, but
          never appears in the hub and is never gated by its publish date &mdash; the guard treats
          an unregistered path as not-a-demo and lets it through, logging a console warning in
          dev mode so the missing entry is seen before it ships. The reverse omission is louder:
          an entry whose <code>path</code> matches no route is a hub tile that falls through to
          the wildcard route.
        </p>
        <p class="src-note">
          Field meanings from the <code>DemoMeta</code> interface in
          <code>src/app/services/demos.service.ts</code>; the fall-through for an unregistered
          path from <code>src/app/guards/demo-release.guard.ts</code>.
        </p>

        <h3>Do / Don&#39;t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; switch on the viewport</span>
            <div class="dd__stage"><code class="dd__code">{{ badQuery }}</code></div>
            <p class="dd__why">
              A demo is mounted at several widths. A viewport query gives it two columns inside a
              narrow column or a side panel, or leaves it stacked inside a wide one.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; switch on the container</span>
            <div class="dd__stage"><code class="dd__code">{{ goodQuery }}</code></div>
            <p class="dd__why">
              The host declares itself a query container, so the rule answers the one question
              that matters: how wide is this demo, wherever it has been put.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; controls before the stage</span>
            <div class="dd__stage"><code class="dd__code">{{ badOrder }}</code></div>
            <p class="dd__why">
              At one column this reads as a form with a picture under it, and a reader arriving
              by keyboard meets every control before knowing what they act on.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; stage, then panel</span>
            <div class="dd__stage"><code class="dd__code">{{ goodOrder }}</code></div>
            <p class="dd__why">
              One document order serves both layouts: above at one column, to the left at two.
              No <code>order</code> property is needed anywhere.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; restyle the live region locally</span>
            <div class="dd__stage"><code class="dd__code">{{ badSrOnly }}</code></div>
            <p class="dd__why">
              Every declaration of the global class is <code>!important</code>, so a
              normal-weight copy loses to all nine of them &mdash; dead weight that reads as
              control. Adding <code>!important</code> to the copy would win, and is the wrong
              fix.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; use the global class as it is</span>
            <div class="dd__stage"><code class="dd__code">{{ goodSrOnly }}</code></div>
            <p class="dd__why">
              One class, one definition. If the region needs to be visible, it is not a live
              region &mdash; it is a readout, and it belongs in the panel as one.
            </p>
          </div>
        </div>
        <p class="src-note">
          The global class and its <code>!important</code> declarations from
          <code>src/styles.scss</code>; the column rule and part order from the blueprint,
          <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/css-contain-3/" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; CSS Containment Level 3</a
            >
            &mdash; <code>container-type: inline-size</code> and how <code>&#64;container</code> finds its container.
          </li>
          <li>
            <a href="https://www.w3.org/TR/css-cascade-4/" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; CSS Cascading and Inheritance Level 4</a
            >
            &mdash; why an important declaration beats a local copy of <code>.sr-only</code>.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            &mdash; the live region that reports a change without moving focus.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The layout is four declarations and one threshold. What may vary between demos is the
          ratio; what does not vary is which element asks the question.
        </p>

        <h3>The column switch, declaration by declaration</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Declaration</th><th>Sits on</th><th>Value in the blueprint</th></tr>
            </thead>
            <tbody>
              <tr><td><code>container-type</code></td><td>the component host</td><td><code>inline-size</code></td></tr>
              <tr><td>threshold</td><td>the <code>&#64;container</code> rule</td><td><code>min-width: 700px</code></td></tr>
              <tr><td><code>grid-template-columns</code></td><td>the grid, inside the rule</td><td><code>minmax(0, 1.3fr) minmax(15rem, 1fr)</code>; <code>1fr</code> outside it</td></tr>
              <tr><td><code>gap</code></td><td>the grid</td><td><code>var(--space-4, 1.25rem)</code></td></tr>
              <tr><td><code>align-items</code></td><td>the grid</td><td><code>start</code></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The stage takes the larger fraction and the panel has a <code>15rem</code> floor, so the
          controls do not crush; there is no ceiling, so on a wide page the panel grows with the
          stage in the same ratio. Outside the query the grid is a single column and only the gap
          applies.
        </p>
        <p class="src-note">
          Values from the <code>:host</code>, <code>.demo-layout</code>, and <code>&#64;container</code>
          rules of <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>The two grounds, and what may sit on them</h3>
        <p>
          A demo has two backgrounds: the standard container around it, on
          <code>--surface-card</code>, and the panel and the canvas, on
          <code>--surface-section</code>. Text that is legible on one is not automatically legible
          on the other, and the visual style decides both.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Pair</th><th>werkbund, light / dark</th><th>All four styles, lowest</th><th>SC 1.4.3 needs</th></tr>
            </thead>
            <tbody>
              <tr><td><code>--text-color</code> on <code>--surface-card</code></td><td>18.73:1 / 14.86:1</td><td>11.32:1 (skizzenbuch, dark)</td><td>4.5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> on <code>--surface-card</code></td><td>7.78:1 / 6.59:1</td><td>5.21:1 (blaupause, light)</td><td>4.5:1</td></tr>
              <tr><td><code>--text-color</code> on <code>--surface-section</code></td><td>16.00:1 / 13.32:1</td><td>9.35:1 (blaupause, dark)</td><td>4.5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> on <code>--surface-section</code></td><td>6.65:1 / 5.91:1</td><td>4.64:1 (blaupause, light)</td><td>4.5:1</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Secondary text on the panel ground has the thinnest margin of the four rows &mdash; a
          caption or hint that must carry meaning is safer in full <code>--text-color</code>. The
          stage frame is a separate matter: <code>--surface-border</code> is decorative by role and
          not held to SC 1.4.11, so the border around a stage is decoration, and anything the
          reader must distinguish needs its own contrast.
        </p>
        <p class="src-note">
          Figures quoted from the "body text" rows of <code>docs/generated/CONTRAST.MD</code>, per
          visual style and mode; the grounds from <code>.standard-container</code> in
          <code>src/app/components/shared/standard-container.component.ts</code> and from
          <code>.controls-panel</code> and <code>.demo-canvas</code> in the blueprint.
        </p>

        <h3>What happens on a narrow screen</h3>
        <p>
          Below 700px of the demo&#39;s own width &mdash; not of the viewport &mdash; the grid is a
          single column: stage, then panel, each at full width, the panel keeping its ground and
          border. The canvas scales with its <code>aspect-ratio</code>; the button row wraps, each
          button taking at least <code>8rem</code>, and buttons carrying
          <code>btn-mobile-full</code> go full width at 640px of <em>viewport</em> and below,
          which is the one breakpoint in this layout still keyed to the window. The standard
          container clips its content box (<code>overflow: hidden</code> on its collapse wrapper),
          so anything wider than the container is cut off with no scrolling interface: give the
          stage a percentage width and an aspect ratio, and give any table or wide figure in the
          panel its own <code>overflow-x: auto</code>. What the caller must do: nothing more, if
          the demo follows the blueprint &mdash; the host measures itself.
        </p>
        <p class="src-note">
          The reflow from the blueprint&#39;s grid rules, the button row from its
          <code>.control-buttons</code> rules; the 640px rule from the <code>btn-mobile-full</code>
          utility in <code>src/styles.scss</code>; the clipping from <code>.content-clip</code> in
          <code>src/app/components/shared/standard-container.component.ts</code>.
        </p>

        <h3>The layout API that shipped unused &mdash; now deleted</h3>
        <p>
          One trap was worth naming, because its name matched this pattern exactly: the kit
          declared a <code>demo-layout()</code> helper and three ratio tokens, and nothing under
          <code>src/</code> ever called either. They described a viewport-driven flex split that
          no shipped demo uses, so they were deleted on 2026-08-20. If you meet them in older
          material: the shipped pattern is the container query on the demo host, never that mixin.
        </p>
        <pre class="code-block"><code>{{ deadApiSnippet }}</code></pre>
        <p class="src-note">
          Former declaration site: <code>src/styles/design-tokens.scss</code>, which now carries
          the deletion note. Call sites: none under <code>src/</code>, before or since.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          A demo is one page component, plus two registrations for its URL. The component is the
          interesting half; the registrations are a checklist.
        </p>

        <h3>The interactive core, as a recipe</h3>
        <p class="src-note">
          Shape and declarations follow the blueprint,
          <code>src/app/pages/example-demo/example-demo.component.ts</code>; the buttons follow the
          <code>btn-mobile-full</code> utility in <code>src/styles.scss</code>.
        </p>
        <pre class="code-block"><code>{{ widgetSnippet }}</code></pre>
        <p>
          Two things in it are structure rather than taste. The host is the query container, and
          the grid is its descendant &mdash; a container query never matches the element that
          declares <code>container-type</code>, so moving it onto the grid leaves the rule nothing
          to measure. And the live region is a single, always-rendered node in the panel whose
          text changes; a region inserted together with its message is often not announced.
        </p>

        <h3>Checking it without a browser</h3>
        <pre class="code-block"><code>{{ checkSnippet }}</code></pre>
        <p>
          The first two answer the questions that raise no error at runtime: whether the switch is
          asked of the container or of the window, and whether the demo the route serves is the demo
          the hub knows about. The third is the reuse question &mdash; a control you are about to
          hand-build may already be documented, and <strong>UI Pattern Selection</strong> is where
          that decision belongs.
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>&#9744; The component host declares <code>container-type: inline-size</code>.</li>
          <li>&#9744; The stage precedes the panel in the document; no <code>order</code> property
            anywhere.</li>
          <li>&#9744; The column switch is a <code>&#64;container</code> rule, not a media query.</li>
          <li>&#9744; The canvas is <code>role=&quot;img&quot;</code> with a translated name and a
            forced-colors text summary.</li>
          <li>&#9744; The panel holds one <code>sr-only</code> live region, written on discrete
            changes only.</li>
          <li>&#9744; One reset control, labeled by what it restores.</li>
          <li>&#9744; No component-local <code>.sr-only</code> rule.</li>
          <li>&#9744; Nothing is clipped at the container edge at 320px.</li>
          <li>&#9744; A routed demo appears in both the route file and the demo registry, with the
            same path.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          A demo translates nothing for you. Every string in it &mdash; title, lead, control
          labels, the canvas name, the announcements nobody sees &mdash; is one the page resolves
          itself.
        </p>

        <h3>One namespace, one method</h3>
        <p>
          The blueprint declares one <code>translate(key)</code> method that forwards to the
          translation service, and every key it reads sits under the demo&#39;s own namespace.
          Announcements and the forced-colors summary are built the same way, with placeholders
          replaced after translation, so a translator sees the whole sentence.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The method, the namespace, and the placeholder replacement from
          <code>src/app/pages/example-demo/example-demo.component.ts</code>; the article-embedded
          widgets under <code>src/app/components/didactic/</code> read their own namespace the
          same way.
        </p>

        <h3>Which strings the layout does not own</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Comes from</th><th>Reacts to a language switch</th></tr>
            </thead>
            <tbody>
              <tr><td>Title, lead, control labels</td><td>Your keys, through the method</td><td>On the next check, if resolved in the template rather than cached in a field</td></tr>
              <tr><td>The canvas name and the forced-colors summary</td><td>Your keys, bound as attributes</td><td>Same &mdash; they are template bindings like any other</td></tr>
              <tr><td>Live-region announcements</td><td>Your keys, resolved when the action ran</td><td>No &mdash; not until the action runs again</td></tr>
              <tr><td>Hub tile title and description</td><td>Keys in the demo registry entry</td><td>Yes</td></tr>
              <tr><td>Estimated time</td><td>The registry entry, printed as given</td><td>No &mdash; it is a literal, unit included</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Key fields and their literal <code>estimatedTime</code> from the
          <code>DemoMeta</code> interface in <code>src/app/services/demos.service.ts</code>;
          announcement timing from the action handlers of the blueprint.
        </p>

        <h3>Where longer text pushes</h3>
        <p>
          The stage is safe &mdash; it holds geometry, not sentences. The pressure is entirely in
          the panel, and the floor is what sets the budget: at two columns a control label that
          outgrows the panel floor of 15rem wraps onto a second line and pushes every control
          below it down. The panel has no ceiling, so on a wide page the budget only grows; a
          button label has the least room, since the button row wraps at 8rem per button.
          A live-region sentence has no visual budget at all and can be as long as it
          needs to be. Treat the button and slider labels as the strict budget, and keep the lead
          sentence to one line of thought rather than one line of text. Key naming, namespaces,
          and the simplified-language variants are <strong>I18n &amp; Localization</strong>.
        </p>
        <p class="src-note">
          Panel floor from the <code>grid-template-columns</code> value in the blueprint&#39;s
          <code>&#64;container</code> rule; the button basis from its
          <code>.control-buttons</code> rules.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.6</strong> &mdash; 2026-09-23 &mdash; Re-based on what ships: the
            self-framed widget cards this guide described were removed from the kit, so the
            contract now follows the blueprint page (<code>example-demo</code>) &mdash; the
            component host as size container, a 700px threshold, a panel whose ground does not
            depend on the query, an <code>h2</code> section instead of a fixed <code>h3</code>
            header, and the live region no longer required to open the panel. Contrast table re-quoted from the
            compilat per visual style (ADR-0016); narrow-screen statement, recipe, i18n method,
            and summary rewritten to match; annotated Sources close the Usage tab.</li>
          <li><strong>v0.5</strong> &mdash; 2026-09-02 &mdash; Re-verified on Angular 22.1.4 / Optimus UI 2.0.2 (ADR-0014): the snippet's <code>styleClass</code> on <code>p-button</code> still lands - Optimus keeps it as a deprecated input that reaches the host; pin moved to 22.1.4, nothing this guide measures changed.</li>
          <li><strong>v0.4</strong> &mdash; 2026-08-24 &mdash; Re-verified after the upgrade to
            Angular 22.1.3 / PrimeNG 22.1. One check mattered: the snippet&#39;s
            <code>styleClass</code> on <code>p-button</code> survives v22 &mdash; the button
            component kept that input while most of the library lost it. The frame itself is
            kit-owned and unchanged; provenance pin raised.</li>
          <li><strong>v0.3</strong> &mdash; 2026-08-20 &mdash; The kit caught up with two of this
            guide&#39;s own rules: the inert component-local <code>.sr-only</code> copies were
            deleted across the app, and the blueprint page&#39;s column switch became a container query
            (it predated the rule and switched on the viewport). The unused
            <code>demo-layout()</code>/<code>--layout-demo-*</code> API was deleted from the
            token file; the design-tab section now records it as history. The release guard
            warns in dev when a demo route has no registry entry. The blueprint page now mounts
            <code>app-demo-related</code>, so the related-content footer has a live example.</li>
          <li><strong>v0.2</strong> &mdash; 2026-08-19 &mdash; Contrast figures refreshed from the
            regenerated compilat after the foundations token decisions: secondary text now
            4.83/4.59:1 in light (re-shade to <code>#6b7280</code>), and the stage frame&#39;s
            <code>--surface-border</code> is decorative by role since the
            <code>--control-border</code> split rather than a declared exception.</li>
          <li><strong>v0.1</strong> &mdash; 2026-08-18 &mdash; Initial guide: the demo card and its
            three parts in document order, the two shapes a demo ships as, the column switch as a
            query on the card rather than the viewport, the panel that gains its ground only at
            two columns, the two backgrounds with their measured text pairs, the layout helper
            that ships with no call site, the two registrations a routed demo needs, and the
            control labels as the layout&#39;s strict translation budget.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [`
    :host { display: block; }
    .lead { font-size: 1.05rem; color: var(--text-color-secondary); margin: 0 0 var(--space-5); }

    /* --- Card skeleton --- */
    .skel { margin: 0 0 var(--space-4); }
    .skel__band {
      position: relative;
      padding: var(--space-5) var(--space-4) var(--space-4);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      background: var(--surface-section);
    }
    .skel__band--body {
      margin: var(--space-3) 0;
      background: var(--surface-card);
      border-style: dashed;
    }
    .skel__cap {
      position: absolute; top: var(--space-2); left: var(--space-4);
      font-size: var(--font-size-sm); color: var(--text-color-secondary);
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .skel__row {
      margin: var(--space-2) 0; padding: var(--space-3) var(--space-4);
      border: 1px solid var(--surface-border); border-radius: var(--radius-md);
      background: var(--surface-card); font-size: 0.9rem; overflow-wrap: anywhere;
    }
    .skel__band--body .skel__row { background: var(--surface-section); }
    .skel__row--muted { color: var(--text-color-secondary); }

    /* --- Two wrappers, one shared container rule --- */
    .cq-row { display: flex; flex-wrap: wrap; gap: var(--space-4); margin: 0 0 var(--space-4); }
    .cq-box { flex: 0 1 auto; min-width: 0; }
    .cq-box--narrow { width: 17rem; }
    .cq-box--wide { width: 30rem; max-width: 100%; }
    .cq-card {
      container-type: inline-size;
      overflow: hidden;
      padding: var(--space-4);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      background: var(--surface-card);
    }
    .cq-head {
      margin: 0 0 var(--space-3);
      font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
      color: var(--text-color-secondary);
    }
    .cq-body { display: flex; flex-direction: column; gap: var(--space-3); }
    .cq-stage, .cq-panel {
      padding: var(--space-4); border-radius: var(--radius-md);
      font-size: 0.85rem; color: var(--text-color);
    }
    .cq-stage {
      background: var(--surface-section);
      border: 1px dashed var(--surface-border);
      min-height: 4rem;
    }
    .cq-panel { background: var(--surface-section); border: 1px solid var(--surface-border); }
    @container (min-width: 24rem) {
      .cq-body {
        display: grid; align-items: start;
        grid-template-columns: minmax(0, 1.3fr) minmax(7rem, 1fr);
        gap: var(--space-3);
      }
    }

    /* --- Do / Don't --- */
    .dd { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin: 0 0 var(--space-4); }
    .dd__cell { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: var(--surface-card); }
    .dd__cell--bad { border-left: 3px solid var(--semantic-red-fg, #b91c1c); }
    .dd__cell--good { border-left: 3px solid var(--semantic-green-fg, #15803d); }
    .dd__stage { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-4); border-radius: var(--radius-md); background: var(--surface-section); min-height: 3.5rem; }
    .dd__why { margin: 0; font-size: var(--font-size-sm); color: var(--text-color-secondary); }
    .dd__code { font-family: var(--font-mono); font-size: 0.8rem; overflow-wrap: anywhere; min-width: 0; white-space: pre-wrap; }
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
    .sources a { color: var(--primary-color-fg); }
  `],
})
export class DemoLayoutArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly badQuery = '@media (min-width: 700px) {\n' +
    '  .demo-layout { grid-template-columns: minmax(0, 1.3fr) minmax(15rem, 1fr); }\n' +
    '}';

  readonly goodQuery = ':host { display: block; container-type: inline-size; }\n' +
    '@container (min-width: 700px) {\n' +
    '  .demo-layout { grid-template-columns: minmax(0, 1.3fr) minmax(15rem, 1fr); }\n' +
    '}';

  readonly badOrder = '<div class="demo-layout">\n' +
    '  <div class="controls-panel">...</div>\n' +
    '  <div class="stage">...</div>\n' +
    '</div>';

  readonly goodOrder = '<div class="demo-layout">\n' +
    '  <div class="stage">...</div>\n' +
    '  <div class="controls-panel">...</div>\n' +
    '</div>';

  readonly badSrOnly = '/* in the component styles */\n' +
    '.sr-only { position: absolute; }';

  readonly goodSrOnly = '<p class="sr-only" aria-live="polite" aria-atomic="true">\n' +
    '  {{ statusMessage() }}\n' +
    '</p>';

  readonly deadApiSnippet = '// src/styles/design-tokens.scss — declared, never called; deleted 2026-08-20.\n' +
    '@mixin demo-layout($left-ratio: \'demo-left\', $right-ratio: \'demo-right\', $gap: \'demo-gap\') { ... }\n' +
    '\n' +
    '// The tokens it reads, emitted on :root and read by nothing:\n' +
    '//   --layout-demo-left   55%\n' +
    '//   --layout-demo-right  43%\n' +
    '//   --layout-demo-gap     2%\n' +
    '\n' +
    '// Use the grid recipe from the Development tab instead.';

  readonly widgetSnippet = '<!-- The interactive core of the blueprint, trimmed to its structure. -->\n' +
    '<app-standard-container id="demo"\n' +
    '  [config]="{ titleKey: \'myDemo.demo.title\', type: \'demo\', headingLevel: 2 }">\n' +
    '  <p class="demo-lead">{{ translate(\'myDemo.demo.lead\') }}</p>\n' +
    '\n' +
    '  <div class="demo-layout">\n' +
    '    <div class="stage">\n' +
    '      <canvas #canvas class="demo-canvas" role="img"\n' +
    '              [attr.aria-label]="translate(\'myDemo.demo.canvasAria\')"></canvas>\n' +
    '      <!-- Visible only under forced colors; silent while animating. -->\n' +
    '      <p class="canvas-forced-colors-note"\n' +
    '         [attr.aria-live]="running() ? \'off\' : \'polite\'">{{ canvasSummary() }}</p>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="controls-panel">\n' +
    '      <label class="control-field" for="my-n">\n' +
    '        <span class="control-label">{{ translate(\'myDemo.controls.n\') }}</span>\n' +
    '        <p-slider id="my-n" [ngModel]="n()" (ngModelChange)="setN($event)"\n' +
    '                  [ariaLabel]="nAria()" />\n' +
    '      </label>\n' +
    '      <div class="control-buttons">\n' +
    '        <p-button [label]="translate(\'myDemo.controls.reset\')" icon="pi pi-refresh"\n' +
    '                  styleClass="btn-mobile-full" (onClick)="reset()" />\n' +
    '      </div>\n' +
    '      <p class="sr-only" aria-live="polite" aria-atomic="true">{{ statusMessage() }}</p>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</app-standard-container>\n' +
    '\n' +
    '/* The declarations that make it a demo layout. */\n' +
    ':host { display: block; container-type: inline-size; }\n' +
    '.demo-layout { display: grid; grid-template-columns: 1fr;\n' +
    '  gap: var(--space-4, 1.25rem); align-items: start; }\n' +
    '@container (min-width: 700px) {\n' +
    '  .demo-layout { grid-template-columns: minmax(0, 1.3fr) minmax(15rem, 1fr); }\n' +
    '}\n' +
    '.demo-canvas { width: 100%; aspect-ratio: 1 / 1; display: block; }\n' +
    '.controls-panel {\n' +
    '  display: flex; flex-direction: column; gap: var(--space-3, 1rem);\n' +
    '  padding: var(--space-3, 1rem);\n' +
    '  background: var(--surface-section, var(--surface-ground));\n' +
    '  border: 1px solid var(--surface-border);\n' +
    '}';

  readonly checkSnippet = '# Is the switch asked of the container, or of the window?\n' +
    'grep -n "container-type\\|@container\\|@media" \\\n' +
    '  src/app/pages/my-demo/*.ts\n' +
    '\n' +
    '# Does the route the demo serves match the entry the hub reads?\n' +
    'grep -n "path:" src/app/app.routes.ts\n' +
    'grep -n "\\"path\\"" src/assets/data/core/demos/index.json\n' +
    '\n' +
    '# Does the control you are about to build already exist?\n' +
    'node scripts/design-guides.mjs list --layer kit';

  readonly i18nSnippet = '// One method, one namespace; placeholders replaced after translation.\n' +
    'translate(key: string): string {\n' +
    '  return this.translationService.translate(key);\n' +
    '}\n' +
    '\n' +
    '// Template: {{ translate(\'myDemo.demo.title\') }}\n' +
    '// Announcements are built the same way, on the action:\n' +
    'protected reset(): void {\n' +
    '  this.n.set(DEFAULT_N);\n' +
    '  this.statusMessage.set(this.translate("myDemo.status.reset"));\n' +
    '}';
}
