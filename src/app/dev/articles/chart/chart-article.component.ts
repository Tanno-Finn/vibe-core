import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-chart-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-chart-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-chart-article .demo-fig {
        margin: 0;
      }

      app-chart-article .sources a {
        color: var(--primary-color-fg);
      }

      app-chart-article .demo-fig figcaption {
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      app-chart-article .demo-canvas {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        aspect-ratio: 3 / 2;
        max-height: 12rem;
        border: 1px dashed var(--control-border);
        background: var(--surface-section);
        color: var(--text-color-secondary);
        font-size: 0.85rem;
      }

      app-chart-article .demo-details {
        margin-top: 0.75rem;
      }

      app-chart-article .demo-details summary {
        cursor: pointer;
      }

      app-chart-article .checklist {
        line-height: 1.7;
      }

      app-chart-article .history {
        line-height: 1.7;
      }
    `;

/**
 * Guide article: Chart (Guides, category `library`).
 *
 * Subject: `p-chart`, the Optimus UI wrapper around chart.js — a component this
 * kit installs the dependency for and never renders. The article is about the
 * three decisions that come before the first dataset: whether a chart is the
 * right shape at all, what the dependency costs, and what a canvas owes a
 * reader who cannot see it.
 *
 * Deliberately NO live `<p-chart>` and no `ChartModule` import. Rendering one
 * here would create this kit's first call site for a module it does not use,
 * and pull `@openng/optimus-ui/chart` into the guide bundle — the very thing the
 * bundle section tells the caller to avoid. Every example is the emitted
 * markup, a recipe, or the DOM composition around a chart.
 *
 * Claims made here, with their provenance (Optimus UI 2.0.2,
 * openng-optimus-ui-chart.mjs unless noted):
 *   - The complete input map is nine — type, plugins, width, height, responsive,
 *     ariaLabel, ariaLabelledBy, data, options (:192); pt, ptOptions, dt,
 *     unstyled are the signal inputs inherited from BaseComponent
 *     (openng-optimus-ui-basecomponent.mjs:428). One output, onDataSelect (:192).
 *   - The whole template is one <canvas role="img"> with aria-label and
 *     aria-labelledby bindings and no content between the tags (:193-201).
 *   - data and options are getter/setter pairs (:97-114), each setter calling
 *     reinit() (:178-183) = destroy + initChart, guarded by `if (this.chart)`
 *     (:179). First draw is onAfterViewInit (:131-134).
 *   - initChart is browser-only (isPlatformBrowser, :145), runs inside
 *     runOutsideAngular (:152), writes opts.responsive into the caller's object
 *     (:147) and maintainAspectRatio: false when width/height is set (:149-151),
 *     then hands type/data/options/plugins to new Chart(...) unchanged (:153-158).
 *   - onCanvasClick (:135-143) is bound to (click) only; no key handler, no
 *     tabindex — so onDataSelect has no keyboard path.
 *   - generateLegend() (:168-172) forwards to chart.generateLegend(), which
 *     chart.js 4.5.1 does not define — no occurrence in its distribution or its
 *     type declarations.
 *   - The dependency: chart.js is declared in package.json, installed at 4.5.1
 *     (node_modules/chart.js/package.json), and reached through
 *     `chart.js/auto` (:4), whose auto/auto.js runs Chart.register(...registerables)
 *     at module scope; chart.js lists that entry in its own `sideEffects`.
 *   - chart.js defaults quoted from node_modules/chart.js/dist/chunks/
 *     helpers.dataset.js:1021-1064; the responsive resize path from
 *     dist/chart.js:3389, :3402, :5728, :6266.
 *   - Bundle numbers measured in THIS repo by `npm run build:prod`
 *     (manifest verification: PASS), not inherited from the figure
 *     carried in src/app/shared/optimus-prebundle.ts.
 *   - Contrast ratios quoted verbatim from docs/generated/CONTRAST.MD, with the
 *     visual style and mode named on every one; all four style blocks read.
 */
@Component({
  selector: 'app-chart-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'chart'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          There is no live chart on this page, and that is the first fact about the component. This kit installs
          <code>chart.js</code> and never renders a <code>p-chart</code>; the module may only be reached from behind a lazy
          boundary, and this kit keeps no call site for it. What follows is the markup the component emits and the composition
          that has to stand around it.
        </p>
        <p class="src-note">
          <code>src/app/shared/optimus-prebundle.ts</code> reaches the module through a dynamic <code>import()</code>
          behind an <code>isDevMode()</code> gate — a dev-server hint, not a rendered component.
        </p>

        <h3>What the component emits</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          The whole template, verbatim in structure, from
          <code>openng-optimus-ui-chart.mjs:193-201</code>; the root class from the <code>classes</code> map
          (<code>:14-16</code>) and the inline root style from <code>:11-13</code>. Note what is
          <em>not</em> there: no content between the canvas tags, which is where HTML puts a canvas's fallback.
        </p>

        <h3>The composition that makes it readable</h3>
        <div class="stage">
          <figure class="demo-fig">
            <figcaption id="demo-cap">Reported incidents per quarter, 2025 (synthetic)</figcaption>
            <div class="demo-canvas" aria-hidden="true">
              <span>canvas — the chart would paint here</span>
            </div>
            <details class="demo-details">
              <summary>Data table</summary>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Quarter</th>
                      <th scope="col">Region A</th>
                      <th scope="col">Region B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><th scope="row">Q1</th><td>18</td><td>31</td></tr>
                    <tr><th scope="row">Q2</th><td>24</td><td>27</td></tr>
                    <tr><th scope="row">Q3</th><td>41</td><td>22</td></tr>
                    <tr><th scope="row">Q4</th><td>37</td><td>19</td></tr>
                  </tbody>
                </table>
              </div>
            </details>
          </figure>
        </div>
        <p class="src-note">
          The gray box stands where the <code>p-chart</code> would go; everything around it is the part the component
          does not supply. The <code>figcaption</code> is what <code>[ariaLabelledBy]</code> would point at, and the
          table is the text alternative SC 1.1.1 asks for — the component has no input that could produce either.
        </p>

        <h3>The same composition as a recipe</h3>
        <pre class="code-block"><code>{{ compositionSnippet }}</code></pre>
        <p class="src-note">
          <code>[ariaLabelledBy]</code> lands on the canvas as <code>aria-labelledby</code>
          (<code>openng-optimus-ui-chart.mjs:196</code>), so the caption names the graphic once and the reader is not
          told the same sentence twice.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          A chart library is a large answer, and this kit contains canvases that were built without one.
          Deciding between them is worth more than any option you will set afterwards.
        </p>

        <h3>Which shape</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What the reader needs</th>
                <th>Shape</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>the trend or the distribution, not the figures</td>
                <td><code>p-chart</code></td>
                <td>{{ m.whenChart }}</td>
              </tr>
              <tr>
                <td>the exact numbers, or fewer than about six of them</td>
                <td>a table — <code>table</code></td>
                <td>{{ m.whenTable }}</td>
              </tr>
              <tr>
                <td>to manipulate the picture and watch it respond</td>
                <td>your own 2D context — <code>demo-layout</code></td>
                <td>{{ m.whenOwnCanvas }}</td>
              </tr>
              <tr>
                <td>one ratio, one completion state</td>
                <td><code>progress</code></td>
                <td>{{ m.whenProgress }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The middle row is measured, not preferred: <code>example-demo.component.ts</code> under
          <code>src/app/pages/example-demo/</code> calls <code>getContext</code> and imports no chart library at all.
          The convention it stands for is the general one — a demo whose reader controls the frame draws its own
          canvas, because a chart library owns the animation loop that control needs.
        </p>

        <h3>What actually passes through</h3>
        <p>
          The wrapper is thin on purpose. <code>type</code>, <code>data</code>, <code>options</code> and
          <code>plugins</code> are handed to <code>new Chart(...)</code> as they arrive, so the Chart.js option surface
          is the API you are really writing against. The wrapper contributes exactly two values of its own, and it
          writes both into the object <em>you</em> passed rather than into a copy.
        </p>
        <pre class="code-block"><code>{{ passthroughSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-chart.mjs:144-161</code>. The consequence is worth stating plainly: an
          <code>options</code> object shared between two charts, or read back after rendering, is no longer the object
          you wrote.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a name where an equivalent is owed</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddNameOnlySnippet }}</code></pre>
            </div>
            <p class="dd__why">
              A screen reader announces four words and the four quarters, two regions, and eight values are gone. SC 1.1.1
              asks for an alternative serving the equivalent purpose, and a canvas has no structure to fall back on.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — caption it, then write the table</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddFigureSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              The caption names the graphic once through <code>ariaLabelledBy</code>, and the table carries the numbers
              for everyone — including the reader who simply wants to read a value off it.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — mutate the data you already handed over</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddMutateSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              {{ m.mutationWhy }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — assign a new object</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddAssignSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              A new reference reaches the setter, the setter calls <code>reinit()</code>, and the chart is destroyed and
              rebuilt with the new numbers.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — import the module from a file the shell loads</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddEagerSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              {{ m.eagerWhy }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — keep it behind a lazy boundary</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddLazySnippet }}</code></pre>
            </div>
            <p class="dd__why">
              The import lives inside a lazily loaded component, so the module and its dependency stay in that route's
              chunk — measured below at {{ m.chunkRaw }} raw.
            </p>
          </div>
        </div>
        <p class="src-note">
          The mutation pair follows from the setters at <code>openng-optimus-ui-chart.mjs:97-114</code>; the import pair
          from <code>chart.js/auto</code> at <code>:4</code> and the <code>sideEffects</code> entry in
          <code>chart.js</code>'s own manifest.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.1.1 Non-text Content</a
            >
            — a text alternative that serves the equivalent purpose; a short name on the canvas is not one.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — why every series needs a carrier besides its hue.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, the canvas element</a
            >
            — the fallback content the component template leaves empty.
          </li>
          <li>
            <a href="https://www.chartjs.org/docs/4.5.1/" target="_blank" rel="noopener noreferrer"
              >Chart.js 4.5.1 documentation</a
            >
            — the option surface that <code>type</code>, <code>plugins</code>, and <code>options</code> reach unchanged.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          A canvas is outside CSS. Chart.js is handed color <em>values</em> and paints them into a bitmap; a custom
          property, a theme class, and a visual-style swap all pass it by. Everything below is about getting the kit's
          palette across that boundary, and about what happens on the switch that follows.
        </p>

        <h3>What Chart.js paints with by default</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Default</th>
                <th>Value</th>
                <th>What it colors</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Chart.defaults.color</code></td>
                <td>{{ m.cjsColor }}</td>
                <td>All text: ticks, legend labels, titles.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.borderColor</code></td>
                <td>{{ m.cjsBorder }}</td>
                <td>Grid lines and element borders.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.backgroundColor</code></td>
                <td>{{ m.cjsBackground }}</td>
                <td>Bar and area fills with no explicit color.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.font.family</code></td>
                <td>{{ m.cjsFont }}</td>
                <td>Every string on the canvas — not the kit's font stack.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.responsive</code></td>
                <td>{{ m.cjsResponsive }}</td>
                <td>Whether a resize observer is bound at all.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.maintainAspectRatio</code></td>
                <td>{{ m.cjsAspect }}</td>
                <td>Whether height follows width or the parent.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The <code>Defaults</code> constructor,
          <code>node_modules/chart.js/dist/chunks/helpers.dataset.js:1021-1064</code> — <code>color</code> at
          <code>:1026</code>, <code>borderColor</code> <code>:1025</code>, <code>backgroundColor</code>
          <code>:1024</code>, <code>font</code> <code>:1037-1043</code>, <code>maintainAspectRatio</code>
          <code>:1054</code>, <code>responsive</code> <code>:1059</code>. Not one of them is a token. The wrapper leaves the
          four color and font rows alone; the last two it writes itself, into the options object you passed
          (<code>openng-optimus-ui-chart.mjs:147</code>, <code>:149-151</code>).
        </p>

        <h3>Getting kit tokens across the boundary</h3>
        <pre class="code-block"><code>{{ tokenReadSnippet }}</code></pre>
        <p class="src-note">
          There is no supported route that is not this one: the values have to be resolved to strings before they are
          handed over, because <code>new Chart(...)</code> receives plain objects
          (<code>openng-optimus-ui-chart.mjs:153-158</code>) and never touches the DOM's computed style itself.
        </p>

        <h3>Series colors, and what the compilat does and does not settle</h3>
        <p>
          The six <code>--semantic-*-fg</code> tokens are the kit's ready-made categorical set — six distinguishable
          hues that are already measured against the surfaces they sit on, in every visual style and both modes.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Light value</th>
                <th>Light ratio on <code>--surface-card</code></th>
                <th>Dark range across the four styles</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>--semantic-blue-fg</code></td><td><code>#1d4ed8</code></td><td>6.70:1</td><td>7.28:1 – 9.32:1</td></tr>
              <tr><td><code>--semantic-orange-fg</code></td><td><code>#c2410c</code></td><td>5.18:1</td><td>7.79:1 – 9.96:1</td></tr>
              <tr><td><code>--semantic-green-fg</code></td><td><code>#15803d</code></td><td>5.02:1</td><td>9.35:1 – 11.97:1</td></tr>
              <tr><td><code>--semantic-red-fg</code></td><td><code>#b91c1c</code></td><td>6.47:1</td><td>6.92:1 – 8.85:1</td></tr>
              <tr><td><code>--semantic-cyan-fg</code></td><td><code>#0e7490</code></td><td>5.36:1</td><td>9.06:1 – 11.59:1</td></tr>
              <tr><td><code>--semantic-pink-fg</code></td><td><code>#be185d</code></td><td>6.04:1</td><td>7.24:1 – 9.26:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ m.contrastProvenance }}
        </p>
        <p>
          {{ m.contrastLimit }}
        </p>

        <h3>Color cannot be the carrier</h3>
        <p>
          SC 1.4.1 is the criterion the palette above does not answer. Two of those six hues are a red and a green, and
          the ratio each of them keeps against the card says nothing about whether a reader can tell them apart from
          each other. Give every series a second, non-chromatic signal — <code>pointStyle</code> for a line or scatter,
          <code>borderDash</code> for a line, a hatched <code>backgroundColor</code> or a direct label for a bar — and
          make sure the series name appears in the legend and in the data table, where color plays no part at all.
        </p>

        <h3>The theme switch: nothing happens</h3>
        <p>
          {{ m.themeSwitch }}
        </p>
        <p class="src-note">
          The setters at <code>openng-optimus-ui-chart.mjs:97-114</code> are the only redraw trigger the component
          exposes, and <code>reinit()</code> (<code>:178-183</code>) is what they call. The kit's visual style
          and its light/dark mode are computed signals on <code>ThemeService</code> — <code>style()</code> and
          <code>isDarkMode()</code> in <code>src/app/services/theme.service.ts</code> — which is what the rebuilding
          <code>computed()</code> should depend on. Chart.js itself resolves options lazily, through a proxy
          (<code>node_modules/chart.js/dist/chunks/helpers.dataset.js:1666</code>); what a switch fails to produce is
          the update that would consult it.
        </p>

        <h3>At a narrow viewport</h3>
        <p>
          {{ m.narrowStatement }}
        </p>
        <p class="src-note">
          <code>responsive</code> defaults to <code>true</code> (<code>openng-optimus-ui-chart.mjs:82</code>); the
          resize path is <code>dist/chart.js:5728</code> (<code>_initialize</code> calls <code>resize()</code> when
          responsive), <code>:6266</code> (<code>bindEvents</code> branches into
          <code>bindResponsiveEvents</code>) and the observer itself at <code>:3389</code>, <code>:3402</code>.
          <code>maintainAspectRatio</code> is <code>true</code> by default
          (<code>chunks/helpers.dataset.js:1054</code>) and is set to <code>false</code> by the wrapper whenever
          <code>width</code> or <code>height</code> is given (<code>openng-optimus-ui-chart.mjs:149-151</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Nine inputs, one output, four methods. The two things worth knowing before any of them are what triggers a
          redraw and what the dependency weighs.
        </p>

        <h3>The complete input list</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>type</code></td><td><code>string</code></td><td>{{ m.inType }}</td></tr>
              <tr><td><code>data</code></td><td><code>object</code></td><td>{{ m.inData }}</td></tr>
              <tr><td><code>options</code></td><td><code>object</code></td><td>{{ m.inOptions }}</td></tr>
              <tr><td><code>plugins</code></td><td><code>array</code></td><td>{{ m.inPlugins }}</td></tr>
              <tr><td><code>width</code> / <code>height</code></td><td><code>string</code></td><td>{{ m.inSize }}</td></tr>
              <tr><td><code>responsive</code></td><td><code>booleanAttribute</code></td><td>{{ m.inResponsive }}</td></tr>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td><code>string</code></td><td>{{ m.inAria }}</td></tr>
              <tr><td><code>pt</code> / <code>ptOptions</code> / <code>dt</code> / <code>unstyled</code></td><td>signal inputs</td><td>{{ m.inInherited }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The nine own inputs are the component's <code>inputs</code> map,
          <code>openng-optimus-ui-chart.mjs:192</code>, with their declarations at <code>:62-114</code>; the inherited
          four are <code>openng-optimus-ui-basecomponent.mjs:428</code>. The single output,
          <code>onDataSelect</code>, is declared at <code>:119</code>.
        </p>

        <h3>What makes it redraw</h3>
        <pre class="code-block"><code>{{ lifecycleSnippet }}</code></pre>
        <p>
          Two consequences follow. The first draw cannot come from a setter: <code>reinit()</code> returns immediately
          while <code>this.chart</code> is still undefined, so the chart appears in
          <code>onAfterViewInit</code> with whatever <code>data</code> was set by then. And every later change is a
          <em>destroy and rebuild</em>, not an update — entry animations replay, and anything Chart.js was holding
          (hover state, a zoom position from a plugin) is gone. Where that matters, keep a
          <code>&#64;ViewChild(UIChart)</code>, mutate through <code>getCanvas()</code> or the instance, and call
          <code>refresh()</code>, which forwards to <code>chart.update()</code>.
        </p>
        <p class="src-note">
          <code>openng-optimus-ui-chart.mjs:97-114</code> (the setters), <code>:178-183</code>
          (<code>reinit</code>), <code>:131-134</code> (<code>onAfterViewInit</code>), <code>:173-177</code>
          (<code>refresh</code>), <code>:184-190</code> (<code>onDestroy</code>, which destroys the instance).
        </p>

        <h3>What the dependency costs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Chunk</th>
                <th>Build</th>
                <th>Raw</th>
                <th>Estimated transfer</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>openng-optimus-ui-chart</code></td><td>browser</td><td>{{ m.chunkRaw }}</td><td>{{ m.chunkTransfer }}</td></tr>
              <tr><td><code>openng-optimus-ui-chart</code></td><td>server</td><td>{{ m.chunkServer }}</td><td>—</td></tr>
              <tr><td>initial bundle, for scale</td><td>browser</td><td>{{ m.initialRaw }}</td><td>{{ m.initialTransfer }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ m.bundleProvenance }}
        </p>

        <h3>Keeping it out of the initial bundle</h3>
        <pre class="code-block"><code>{{ lazySnippet }}</code></pre>
        <p class="src-note">
          The mechanism is <code>chart.js/auto</code> (<code>openng-optimus-ui-chart.mjs:4</code>), whose entry file
          calls <code>Chart.register(...registerables)</code> at module scope; because <code>chart.js</code> names that
          entry in its own <code>sideEffects</code> list, a bundler may not drop it. Hence the rule: reach the module
          only from behind a lazy boundary. <code>src/app/shared/optimus-prebundle.ts</code> is the worked example,
          gating its dynamic <code>import()</code> behind <code>isDevMode()</code>.
        </p>

        <h3>The keyboard gap</h3>
        <p>
          {{ m.keyboardGap }} Closing it means owning the canvas: a cursor you move with the arrow keys over the same
          points a pointer can hit, announced as you go. A <code>p-chart</code> has no equivalent and no input that
          would add one.
        </p>
        <p class="src-note">
          <code>onCanvasClick</code> and its <code>(click)</code> binding,
          <code>openng-optimus-ui-chart.mjs:135-143</code> and <code>:199</code>; the emitted payload is built from
          <code>getElementsAtEventForMode</code>, which takes a mouse event and has no keyboard analog.
        </p>

        <h3>One method that throws</h3>
        <p>
          {{ m.generateLegend }}
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>Nothing imports <code>&#64;openng/optimus-ui/chart</code> outside a lazy boundary.</li>
          <li>The chart sits in a <code>figure</code> with a caption, and <code>ariaLabelledBy</code> points at it.</li>
          <li>A real table carries the same numbers, visible or in a <code>details</code>.</li>
          <li>Every series has a carrier besides color, and a name in the legend and the table.</li>
          <li><code>data</code> and <code>options</code> are rebuilt as new objects — no pushes, no in-place edits.</li>
          <li>The <code>options</code> object is not shared between charts and not read back after rendering.</li>
          <li>Colors are read from tokens inside the rebuilding <code>computed()</code>, which depends on the theme.</li>
          <li>Nothing calls <code>generateLegend()</code>.</li>
          <li>Anything <code>onDataSelect</code> triggers is reachable from a DOM control too.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Every word on a chart is painted, not written. That has one pleasant consequence — there is no library string
          to translate — and one sharp one: nothing on the canvas re-renders when the language changes unless you hand
          the component a new object.
        </p>

        <h3>Where the strings come from</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>What the reader sees</th>
                <th>Where you put it</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Category names on the axis</td><td><code>data.labels</code></td></tr>
              <tr><td>Series names in the legend and tooltip</td><td><code>data.datasets[n].label</code></td></tr>
              <tr><td>Title and subtitle</td><td><code>options.plugins.title</code>, <code>.subtitle</code></td></tr>
              <tr><td>Tooltip text</td><td><code>options.plugins.tooltip.callbacks</code></td></tr>
              <tr><td>Formatted tick values</td><td><code>options.scales[id].ticks.callback</code></td></tr>
              <tr><td>The accessible name</td><td><code>[ariaLabel]</code>, or the <code>figcaption</code></td></tr>
              <tr><td>The data table beside it</td><td>your own template — the honest half of the localization</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The plugin ids are <code>legend</code>, <code>title</code>, <code>subtitle</code> and <code>tooltip</code>
          (<code>node_modules/chart.js/dist/chart.js:8742</code>, <code>:8943</code>, <code>:8981</code>,
          <code>:9878</code>). The component contributes no string of its own: its template is a bare canvas
          (<code>openng-optimus-ui-chart.mjs:193-201</code>), so there is nothing here for a library locale to
          translate.
        </p>

        <h3>A language switch is a rebuild</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate(key)</code> reads the service's <code>translationsVersion</code> signal
          (<code>src/app/services/translation.service.ts</code>), so a <code>computed()</code> over it re-runs on a
          language switch and produces a new object — which is exactly what the <code>data</code> setter at
          <code>openng-optimus-ui-chart.mjs:100-103</code> needs in order to notice. There is no
          <code>instant()</code> on this service.
        </p>

        <h3>Length, numbers, and direction</h3>
        <p>
          {{ m.i18nLength }}
        </p>
        <p>
          {{ m.i18nRtl }}
        </p>
        <p class="src-note">
          The legend reads <code>options.plugins.legend.rtl</code> and <code>textDirection</code>
          (<code>node_modules/chart.js/dist/chart.js:8462-8463</code>, <code>:8506</code>, <code>:8585</code>), and the
          tooltip its own <code>rtl</code> (<code>:9574</code>, <code>:9661</code>). Both are options you set; neither
          is derived from the document's direction, and the wrapper passes neither.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>1.1</strong> — 2026-09-23 — Series-color table re-checked against the compilat (all 48 rows
            hold); bundle figures re-read from the current production build (chunk transfer 62.38 kB, initial total
            1.62 MB / 327.40 kB); annotated Sources close the Usage tab; doc trimmed under the size aim.</li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2 and
            chart.js 4.5.1.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ChartArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- measurements, as flat constants so the tab extractor resolves them -----
  readonly m = {
    // usage — which shape
    whenChart:
      'The eye reads slope, spread, and proportion faster than a column of numbers — and only when there are enough numbers for a shape to exist.',
    whenTable:
      'Under about six values a chart adds a decoding step and removes precision. A table is also what a screen reader receives from a chart, so it has to be written either way.',
    whenOwnCanvas:
      'A chart library owns the animation loop and redraws from a data model; a demo needs per-frame control and usually a keyboard cursor over the stage, neither of which p-chart offers.',
    whenProgress:
      'One value against one maximum is a bar the kit already ships, with a role and a name, for none of the 208 kB.',

    // usage — do/don't rationales
    mutationWhy:
      'The array is the same object, so the data setter never runs, reinit() is never called and the canvas keeps painting the old numbers. Nothing errors — the chart is simply stale.',
    eagerWhy:
      'chart.js/auto executes Chart.register(...registerables) at module scope and chart.js declares that entry in sideEffects, so the import survives tree-shaking and the whole library lands in the initial bundle for every visitor, chart or no chart.',

    // design — chart.js defaults
    cjsColor: "'#666' — a fixed gray, not --text-color",
    cjsBorder: "'rgba(0,0,0,0.1)' — invisible on a dark surface",
    cjsBackground: "'rgba(0,0,0,0.1)'",
    cjsFont: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif at 12px",
    cjsResponsive: 'true — a resize observer is bound',
    cjsAspect: 'true, until the wrapper turns it off for you',

    // design — contrast
    contrastProvenance:
      'Every ratio quoted verbatim from docs/generated/CONTRAST.MD, semantic text block, foreground on --surface-card. The light column is identical in all four visual styles because --surface-card resolves to #ffffff in each of them; the dark ranges span the four style blocks, whose cards differ: werkbund #1d1d21, lernwerkstatt #292725, skizzenbuch #2f2b26, blaupause #10305c. All rows are SC 1.4.3 and need 4.5:1. The lowest of the 48 is 5.02:1 — --semantic-green-fg #15803d on #ffffff, light mode, in all four styles; the tightest dark block is blaupause, whose lowest is 6.92:1 for --semantic-red-fg #fca5a5.',
    contrastLimit:
      'What those numbers do not settle: the compilat measures a token against a surface, never one series against the series next to it. A line on the card is a graphical object under SC 1.4.11 and owes 3:1 to what it sits against — and where two series overlap, that is each other, which nothing here has measured. Treat the table as evidence that each hue is legible on the ground, and the section below as the reason that is not enough.',

    // design — theme switch and narrow viewport
    themeSwitch:
      'Chart.js does not freeze colors at construction — options are read through a lazy resolver and re-evaluated on every update. The reason nothing repaints is plainer than a snapshot: a class swap on the document element triggers no update, and a color handed over as a string never consults CSS in the first place. Switching theme or visual style leaves a chart painted in the previous palette, indefinitely. The fix is not a redraw call but a new object: build data and options inside a computed() that depends on the style and mode signals, so the switch produces new references, the setters fire, and reinit() rebuilds the chart with freshly read tokens.',
    narrowStatement:
      'With responsive left at its default the chart follows its parent: Chart.js binds a resize observer to the canvas container and redraws on every size change, so the component needs a sized parent and nothing else. maintainAspectRatio is true by default, which means the height is derived from the width — a chart in a 320px column becomes short rather than squeezed. Setting [width] or [height] silently turns that off, and the box then keeps the size you gave it at every viewport, so a fixed width is the one thing not to do on a narrow screen. What the caller owes at small sizes is the content, not the box: axis tick labels, a legend, and dense point markers do not shrink with the canvas, so drop the legend below roughly 30rem of container width and let the data table carry the series names instead.',

    // development — inputs
    inType: "Chart.js chart type, passed straight to new Chart(...). Every type chart.js/auto registers is available.",
    inData: 'A setter: a new object redraws, a mutated one does not.',
    inOptions: 'A setter as well — and the object the component writes two of its own values into.',
    inPlugins: 'Per-chart plugins, defaulting to an empty array; forwarded unchanged.',
    inSize: 'CSS lengths on the root element, and the trigger that sets maintainAspectRatio: false.',
    inResponsive: 'Default true. Written into your options object rather than kept internally.',
    inAria: 'Bound to aria-label and aria-labelledby on the canvas. A name only — never the alternative.',
    inInherited: 'The four from BaseComponent; pt reaches the canvas as well as the root, via ptm and the pBind host directive.',

    // development — bundle
    chunkRaw: '207.97 kB',
    chunkTransfer: '62.38 kB',
    chunkServer: '207.91 kB',
    initialRaw: '1.62 MB',
    initialTransfer: '327.40 kB',
    bundleProvenance:
      'Production build, Angular CLI size table, @openng/optimus-ui@2.0.2: the lazy chunk named openng-optimus-ui-chart in the browser build and again in the server build, beside the initial total from the same build. The chunk is lazy in both, which is the gate behind isDevMode() in src/app/shared/optimus-prebundle.ts doing its job — chart.js is absent from the initial bundle.',

    // development — behavior
    keyboardGap:
      'onDataSelect is emitted from a click handler on the canvas, and that is the only interaction the component wires. The canvas receives no tabindex, no role beyond img, and no key handler, so a keyboard or switch user cannot select a data point at all — and a role of img would in any case tell them there is nothing to operate.',
    generateLegend:
      'generateLegend() forwards to chart.generateLegend(), a method Chart.js removed in version 3. It appears nowhere in the 4.5.1 distribution or its type declarations, so the call throws a TypeError rather than returning markup. The replacement is configuration, not a call: options.plugins.legend, with the legend plugin generating its own labels.',

    // i18n
    i18nLength:
      'Nothing on a canvas wraps for you. A legend entry or an axis label that grows 40 percent in translation is clipped or overlaps its neighbor rather than reflowing, and no CSS rule can reach it. Budget for the longest language: shorten category labels, move the full names into the data table, and prefer a legend below the plot over one beside it.',
    i18nRtl:
      'Direction is not inherited either. Chart.js reverses the legend and tooltip only when told to, through their own rtl and textDirection options; the wrapper passes neither, so an RTL page renders a left-to-right chart unless the caller sets them in options. Numbers are the same story — format them with Intl.NumberFormat in a tick or tooltip callback, because the canvas has no locale of its own.',
  };

  readonly anatomySnippet: string = `<!-- p-chart, in full. The host carries class and inline style; the view is one canvas. -->
<p-chart class="p-chart" style="display: block; position: relative">
  <canvas
    role="img"
    aria-label="…"          <!-- [ariaLabel] -->
    aria-labelledby="…"     <!-- [ariaLabelledBy] -->
    width="…" height="…"    <!-- present exactly when [width] / [height] is set -->
    (click)="onCanvasClick($event)"
    [pBind]="ptm('canvas')">
    <!-- NOTHING HERE. This is where a canvas's fallback content belongs,
         and the component projects none. -->
  </canvas>
</p-chart>`;

  readonly compositionSnippet: string = `<figure class="revenue">
  <figcaption id="revenue-cap">Reported incidents per quarter, 2025</figcaption>

  <p-chart type="bar"
           [data]="chartData()"
           [options]="chartOptions()"
           ariaLabelledBy="revenue-cap"></p-chart>

  <details>
    <summary>Data table</summary>
    <table>
      <thead><tr><th scope="col">Quarter</th><th scope="col">Region A</th></tr></thead>
      <tbody><tr><th scope="row">Q1</th><td>18</td></tr></tbody>
    </table>
  </details>
</figure>`;

  readonly passthroughSnippet: string = `// openng-optimus-ui-chart.mjs:144-161 — the whole of initChart().
initChart() {
    if (isPlatformBrowser(this.platformId)) {
        let opts = this.options || {};
        opts.responsive = this.responsive;                 // :147  writes into YOUR object
        if (opts.responsive && (this.height || this.width)) {
            opts.maintainAspectRatio = false;              // :150  and again
        }
        this.zone.runOutsideAngular(() => {
            this.chart = new Chart(this.el.nativeElement.children[0], {
                type: this.type, data: this.data,
                options: this.options, plugins: this.plugins   // :153-158  unchanged
            });
        });
    }
}`;

  readonly ddNameOnlySnippet: string = `<p-chart type="bar" [data]="data"
         ariaLabel="Incidents per quarter"></p-chart>

<!-- Announced: "Incidents per quarter, image". Eight values, four
     quarters and two regions never reach the reader. -->`;

  readonly ddFigureSnippet: string = `<figure>
  <figcaption id="cap">Incidents per quarter, 2025</figcaption>
  <p-chart type="bar" [data]="data" ariaLabelledBy="cap"></p-chart>
  <details><summary>Data table</summary>
    <table><!-- the same eight values --></table>
  </details>
</figure>`;

  readonly ddMutateSnippet: string = `// The chart keeps painting last quarter.
addQuarter(v: number) {
  this.data.labels.push('Q4');
  this.data.datasets[0].data.push(v);
}`;

  readonly ddAssignSnippet: string = `// A new reference reaches the setter at :100-103.
readonly chartData = computed(() => ({
  labels: [...this.labels()],
  datasets: [{ label: this.t('series.a'), data: [...this.values()] }],
}));`;

  readonly ddEagerSnippet: string = `// app.config.ts, main.ts, the shell component, a shared barrel —
// anything the initial bundle reaches.
import { ChartModule } from '@openng/optimus-ui/chart';`;

  readonly ddLazySnippet: string = `// The route defers the component, so the component's imports defer with it.
// in app.routes.ts
{ path: 'report',
  loadComponent: () => import('./report/report-page')
                        .then(m => m.ReportPage) }

// and inside that lazily loaded component, the import is safe:
import { ChartModule } from '@openng/optimus-ui/chart';`;

  readonly tokenReadSnippet: string = `// Resolve tokens to strings inside the rebuilding computed, so a theme,
// visual-style, or language switch produces a NEW options object.
private readonly platformId = inject(PLATFORM_ID);
private readonly theme = inject(ThemeService);

private token(name: string): string {
  if (!isPlatformBrowser(this.platformId)) return '#000';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

readonly chartOptions = computed(() => {
  this.theme.style();                   // dependency: rebuild on a visual-style swap
  this.theme.isDarkMode();              // dependency: rebuild on a light/dark swap
  const ink = this.token('--text-color');
  const grid = this.token('--surface-border');
  return {
    animation: this.reducedMotion() ? false : undefined,
    color: ink,                                    // beats Chart.defaults.color
    scales: { x: { ticks: { color: ink }, grid: { color: grid } },
              y: { ticks: { color: ink }, grid: { color: grid } } },
    plugins: { legend: { labels: { color: ink, usePointStyle: true } } },
  };
});`;

  readonly lifecycleSnippet: string = `// openng-optimus-ui-chart.mjs — the redraw path, in the order it runs.

set data(val)    { this._data = val;    this.reinit(); }   // :100-103
set options(val) { this._options = val; this.reinit(); }   // :111-114

reinit() {                                                  // :178-183
    if (this.chart) {          // <- no-op until the first draw has happened
        this.chart.destroy();
        this.initChart();      // a rebuild, never an update
    }
}

onAfterViewInit() { this.initChart(); this.initialized = true; }  // :131-134
refresh()  { if (this.chart) { this.chart.update(); } }           // :173-177
onDestroy(){ if (this.chart) { this.chart.destroy(); … } }        // :184-190`;

  readonly lazySnippet: string = `// The rule in one line: @openng/optimus-ui/chart may only be reached from
// code that is itself lazily loaded.

// GOOD — inside a lazily loaded route component (rides in that chunk):
import { ChartModule } from '@openng/optimus-ui/chart';

// GOOD — a dynamic import from eager code, which is what the kit does:
//   src/app/shared/optimus-prebundle.ts
if (isDevMode()) {
  void import('@openng/optimus-ui/chart');
}

// BAD — a static import anywhere the initial bundle reaches. chart.js/auto
// runs Chart.register(...registerables) at module scope and chart.js lists
// that entry in sideEffects, so nothing tree-shakes it away.`;

  readonly i18nSnippet: string = `// Both computeds read translate(), so both re-run on a language switch and
// hand the setters a new object. A cached string would freeze the canvas.
readonly chartData = computed(() => ({
  labels: [this.t('quarter.q1'), this.t('quarter.q2')],
  datasets: [
    { label: this.t('series.regionA'), data: this.regionA(),
      borderColor: this.token('--semantic-blue-fg'), pointStyle: 'circle' },
    { label: this.t('series.regionB'), data: this.regionB(),
      borderColor: this.token('--semantic-orange-fg'), pointStyle: 'triangle' },
  ],
}));

private t(key: string): string { return this.i18n.translate(key); }
// There is no instant() on TranslationService; translate() is the only reader.`;
}
