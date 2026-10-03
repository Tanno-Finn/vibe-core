import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Color System (foundations).
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot):
 *   - Look = visual style x accent x mode (ADR-0016). Token layers, from the
 *     library up: Aura primitives (--p-green-500), Aura semantic
 *     (--p-primary-color; semantic.primary replaced by theme.service.ts
 *     widgetPrimarySemantic — light ramp from primaryColor, dark ramp from
 *     primaryFgDark with primary.color -> {primary.500}), Aura component tokens
 *     (re-pointed at kit tokens on component selectors in styles.scss), the
 *     kit role tokens (surfaces/text/--control-border per style and mode, from
 *     ui-styles.ts via buildTokenMaps, inline on <html>), the accent roles
 *     (THEME_COLORS), the kit-wide inks (--semantic-<hue>-fg, styles.scss
 *     :root/.dark-theme), and the static palette ($colors, 122 entries emitted
 *     as --color-<name> and --<name>; --primary-<step> is overwritten at
 *     runtime by the active style's brandScale).
 *   - Every ratio is quoted from docs/generated/CONTRAST.MD (contrast.json):
 *     werkbund figures, plus the lowest row over the four
 *     styles (x ten accents where the pair depends on the accent). Zero
 *     declared exceptions (KNOWN_EXCEPTIONS and KNOWN_EXCEPTION_RULES empty),
 *     widget pairs included.
 *   - The widget re-points named in the Design tab are the styles.scss rules
 *     on .p-checkbox/.p-radiobutton, the field components, .p-toggleswitch,
 *     .p-slider, .p-button/.p-badge/.p-message/.p-toast, .p-datatable,
 *     .p-popover, the menu family, and the kit focus-ring rule.
 *   - getOptimalTextColor (theme.service.ts) picks the filled-button label from
 *     the AVERAGE luminance of the two stops at a 3:1 bar; the gate measures
 *     the chosen label at EACH stop at 4.5:1, at rest and hovered.
 *   - Media blocks in src/styles.scss: only @media print declares custom
 *     properties; the viewport blocks (768/640/600 px), the one
 *     prefers-contrast block, and the one forced-colors block (selected-row
 *     bar -> Highlight) declare none.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-color-system-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, ButtonModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'color-system'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A color system is not a mood board. It is a set of grounds, a set of foregrounds, and a list of which pairs
          have been measured. Everything below renders in the visual style, accent, and mode you are looking at; every
          ratio beside it is quoted from the contrast compilat, which the build regenerates from the same token values.
        </p>

        <h3>Every ground, with the text that is measured on it</h3>
        <p>
          Four surfaces can sit behind a text run, and each visual style brings its own four, per mode. Two text roles
          are measured against all four in every style. The figures on the panels are werkbund's; the
          table after them gives each style's tightest pair.
        </p>
        <div class="grounds">
          <div class="gr gr--ground">
            <strong>--surface-ground</strong>
            <p class="gr__body">Body text, --text-color</p>
            <p class="gr__sec">Supporting text, --text-color-secondary</p>
            <span class="gr__num">werkbund: 17.17:1 &middot; 7.14:1 light &nbsp;|&nbsp; 16.28:1 &middot; 7.22:1 dark</span>
          </div>
          <div class="gr gr--card">
            <strong>--surface-card</strong>
            <p class="gr__body">Body text, --text-color</p>
            <p class="gr__sec">Supporting text, --text-color-secondary</p>
            <span class="gr__num">werkbund: 18.73:1 &middot; 7.78:1 light &nbsp;|&nbsp; 14.86:1 &middot; 6.59:1 dark</span>
          </div>
          <div class="gr gr--section">
            <strong>--surface-section</strong>
            <p class="gr__body">Body text, --text-color</p>
            <p class="gr__sec">Supporting text, --text-color-secondary</p>
            <span class="gr__num">werkbund: 16.00:1 &middot; 6.65:1 light &nbsp;|&nbsp; 13.32:1 &middot; 5.91:1 dark</span>
          </div>
          <div class="gr gr--hover">
            <strong>--surface-hover</strong>
            <p class="gr__body">Body text, --text-color</p>
            <p class="gr__sec">Supporting text, --text-color-secondary</p>
            <span class="gr__num">werkbund: 15.56:1 &middot; 6.47:1 light &nbsp;|&nbsp; 13.32:1 &middot; 5.91:1 dark</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <caption>
              Tightest body-text pair per visual style — always
              <code>--text-color-secondary</code>, on the ground named
            </caption>
            <thead>
              <tr>
                <th>Style</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>6.47:1 on <code>--surface-hover</code></td>
                <td>5.91:1 on <code>--surface-section</code> / <code>--surface-hover</code></td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>5.06:1 on <code>--surface-hover</code></td>
                <td>5.46:1 on <code>--surface-hover</code></td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>4.57:1 on <code>--surface-hover</code></td>
                <td>4.57:1 on <code>--surface-hover</code></td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>4.55:1 on <code>--surface-hover</code></td>
                <td>4.84:1 on <code>--surface-hover</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Ratios from <code>docs/generated/CONTRAST.MD</code>, group "body text", one table per style and mode; SC 1.4.3
          needs 4.5:1. The surface and text values are the <code>surfaces</code> of each style in
          <code>src/app/services/ui-styles.ts</code>.
        </p>

        <h3>The six semantic hues, in prose</h3>
        <p>
          These are the kit's own inks: one value per mode, the same in every style, and measured on the ground and the
          card of all four. They are foregrounds:
          <span class="sem sem--blue">blue</span>, <span class="sem sem--orange">orange</span>,
          <span class="sem sem--green">green</span>, <span class="sem sem--red">red</span>,
          <span class="sem sem--purple">purple</span> and <span class="sem sem--pink">pink</span> — inline highlights
          inside running text, and the severity text of buttons, badges, and messages.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Light</th>
                <th>werkbund ground / card</th>
                <th>Dark</th>
                <th>werkbund ground / card</th>
                <th>Dark, lowest over four styles</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--semantic-blue-fg</code></td>
                <td><code>#1d4ed8</code></td>
                <td>6.14:1 / 6.70:1</td>
                <td><code>#93c5fd</code></td>
                <td>10.20:1 / 9.32:1</td>
                <td>7.28:1</td>
              </tr>
              <tr>
                <td><code>--semantic-orange-fg</code></td>
                <td><code>#c2410c</code></td>
                <td>4.75:1 / 5.18:1</td>
                <td><code>#fdba74</code></td>
                <td>10.91:1 / 9.96:1</td>
                <td>7.79:1</td>
              </tr>
              <tr>
                <td><code>--semantic-green-fg</code></td>
                <td><code>#15803d</code></td>
                <td>4.60:1 / 5.02:1</td>
                <td><code>#86efac</code></td>
                <td>13.10:1 / 11.97:1</td>
                <td>9.35:1</td>
              </tr>
              <tr>
                <td><code>--semantic-red-fg</code></td>
                <td><code>#b91c1c</code></td>
                <td>5.93:1 / 6.47:1</td>
                <td><code>#fca5a5</code></td>
                <td>9.69:1 / 8.85:1</td>
                <td>6.92:1</td>
              </tr>
              <tr>
                <td><code>--semantic-purple-fg</code></td>
                <td><code>#7e22ce</code></td>
                <td>6.40:1 / 6.98:1</td>
                <td><code>#d8b4fe</code></td>
                <td>10.41:1 / 9.50:1</td>
                <td>7.43:1</td>
              </tr>
              <tr>
                <td><code>--semantic-pink-fg</code></td>
                <td><code>#be185d</code></td>
                <td>5.53:1 / 6.04:1</td>
                <td><code>#f9a8d4</code></td>
                <td>10.15:1 / 9.26:1</td>
                <td>7.24:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from the <code>:root</code> and <code>.dark-theme</code> blocks in <code>styles.scss</code>; ratios
          from <code>docs/generated/CONTRAST.MD</code>, group "semantic text". werkbund's light ground is the darkest
          light ground of the four styles, so its light column is also the four-style minimum; the dark minimum is
          blaupause, on its card.
        </p>

        <h3>Two scales called primary: the style's and the accent's</h3>
        <p>
          Both swatches below are painted by one declaration each. The left one reads a step of
          <code>--primary-&lt;step&gt;</code>, which the theme service fills from the active visual style's brand scale;
          the right one reads the accent's background role. Switch the accent and only the right one moves; switch the
          visual style and only the left one does.
        </p>
        <div class="demo2">
          <figure class="swatch-fig">
            <div class="swatch swatch--palette"></div>
            <figcaption><code>var(--primary-500)</code> — the style's brand</figcaption>
          </figure>
          <figure class="swatch-fig">
            <div class="swatch swatch--brand"></div>
            <figcaption><code>var(--primary-bg)</code> — the accent</figcaption>
          </figure>
        </div>
        <pre class="code-block"><code>{{ amberSnippet }}</code></pre>
        <p class="src-note">
          <code>--primary-50</code>…<code>--primary-900</code> are written from <code>brandScale</code> of the active
          style in <code>theme.service.ts</code> (<code>buildTokenMaps</code>); the static palette's amber
          <code>#f59e0b</code> shows only before the service first runs. <code>--primary-bg</code> is written per accent
          and mode from <code>THEME_COLORS</code>; <code>--primary-color</code> is its alias and the name the contrast
          compilat uses.
        </p>

        <h3>Hue alone, and hue with a second carrier</h3>
        <p>
          The row below renders two states. Press the button to drop the labels and keep only the color — the
          difference is what a reader in a forced-colors mode, a grayscale print, or a red-green color deficiency is
          left with.
        </p>
        <div class="insp">
          <button pButton type="button" (click)="toggleLabels()">
            <span pButtonLabel>{{ labelsOn() ? 'Hide the labels' : 'Show the labels' }}</span>
          </button>
          <p class="insp__state" role="status">{{ carrierState() }}</p>
        </div>
        <div class="states">
          <span class="st st--ok"
            ><span class="st__dot"></span>
            @if (labelsOn()) {
              Passed
            }
          </span>
          <span class="st st--warn"
            ><span class="st__dot"></span>
            @if (labelsOn()) {
              Review
            }
          </span>
          <span class="st st--bad"
            ><span class="st__dot"></span>
            @if (labelsOn()) {
              Failed
            }
          </span>
        </div>
        <p class="src-note">
          The dots are painted with <code>--semantic-green-fg</code>, <code>--semantic-orange-fg</code> and
          <code>--semantic-red-fg</code>; this block is live output rather than a reference table.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Picking a color here is two decisions: which role the thing plays, and which ground it will sit on. Get both
          right and the pair is already measured — in every style, mode, and accent; get the second one wrong and there
          is no number to stand on, whatever the first one was.
        </p>

        <h3>Three questions, in order</h3>
        <ul>
          <li>
            <strong>Is it text, a fill, an edge, or focus?</strong> Text takes a <code>*-fg</code> or
            <code>--text-color*</code> role, a fill takes <code>--primary-bg</code> / <code>--accent-surface</code> / a
            <code>--surface-*</code>, the edge of a control takes <code>--control-border</code>, keyboard focus takes the
            kit's one ring in <code>--primary-color-fg</code>.
          </li>
          <li>
            <strong>Which ground is behind it?</strong> That decides the row of the table below, and therefore whether a
            number exists at all.
          </li>
          <li>
            <strong>Does the color carry meaning?</strong> Then it needs a second carrier beside the hue — a word, an
            icon, a shape.
          </li>
        </ul>

        <h3>Which token for which job</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Token, on its ground</th>
                <th>CONTRAST.MD group</th>
                <th>Tightest row, light / dark</th>
                <th>SC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Body text</td>
                <td><code>--text-color</code> on any of the four surfaces</td>
                <td>body text</td>
                <td>9.96:1 / 8.81:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Supporting text, field icons</td>
                <td><code>--text-color-secondary</code> on any of the four surfaces</td>
                <td>body text, form field icon</td>
                <td>4.55:1 / 4.57:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Inline highlight, severity text</td>
                <td><code>--semantic-&lt;hue&gt;-fg</code> on <code>--surface-ground</code> / <code>--surface-card</code></td>
                <td>semantic text, text &amp; link button, message &amp; toast</td>
                <td>4.60:1 / 5.92:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Link, title, icon, outlined edge</td>
                <td>
                  <code>--primary-color-fg</code>, <code>--gradient-accent-color-fg</code> on
                  <code>--surface-ground</code> / <code>--surface-card</code>
                </td>
                <td>brand foreground</td>
                <td>4.51:1 / 4.75:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Label on the filled button</td>
                <td>
                  <code>--primary-color-text</code> on both stops of <code>--primary-color</code> →
                  <code>--gradient-accent-color</code>
                </td>
                <td>filled button (hover)</td>
                <td>4.73:1 / 6.33:1 hovered</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Tinted panel and its text</td>
                <td><code>--accent-on-surface</code> on <code>--accent-surface</code></td>
                <td>accent surface</td>
                <td>7.62:1 / 9.53:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Edge of a field, checkbox, radio, switch, slider</td>
                <td><code>--control-border</code> on ground, card, section</td>
                <td>control boundary, checkbox &amp; radiobutton, toggleswitch</td>
                <td>3.64:1 / 3.25:1</td>
                <td>1.4.11</td>
              </tr>
              <tr>
                <td>Keyboard focus</td>
                <td>2px <code>--primary-color-fg</code> ring on any surface, inset on a selected row</td>
                <td>focus ring, menu focus</td>
                <td>4.42:1 / 3.48:1</td>
                <td>1.4.11</td>
              </tr>
              <tr>
                <td>Invalid field edge</td>
                <td><code>--semantic-red-fg</code> on the field's ground</td>
                <td>form field edge</td>
                <td>5.93:1 / 5.66:1</td>
                <td>1.4.11</td>
              </tr>
              <tr>
                <td>Selected table row</td>
                <td>4px <code>--primary-color-fg</code> bar on the row tint</td>
                <td>table &amp; paginator</td>
                <td>5.14:1 / 3.48:1</td>
                <td>1.4.11</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Every figure quoted from <code>docs/generated/CONTRAST.MD</code>: the lowest row of that job over the four
          visual styles, both modes as named, and the ten accents where the token depends on the accent. Look up a
          single style and accent in the compilat's own tables.
        </p>
        <p>
          <strong>A pairing outside this table is unmeasured, not approved.</strong> The semantic hues and the brand
          foregrounds are measured on <code>--surface-ground</code> and <code>--surface-card</code> only — put either on
          <code>--surface-section</code> and the compilat has nothing to say about it.
        </p>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — let the hue be the whole message</span>
            <div class="dd__stage">
              <span class="st st--ok"><span class="st__dot"></span></span>
              <span class="st st--bad"><span class="st__dot"></span></span>
            </div>
            <p class="dd__why">
              In a forced-colors mode the operating system replaces both values, and in grayscale or with a red-green
              deficiency the two dots are one dot twice — the state has no other carrier to fall back on (SC 1.4.1).
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — hue plus a word</span>
            <div class="dd__stage">
              <span class="st st--ok"><span class="st__dot"></span>Passed</span>
              <span class="st st--bad"><span class="st__dot"></span>Failed</span>
            </div>
            <p class="dd__why">
              The color stays the fast channel for everyone who can use it, and the label is what survives a
              substituted palette, a monochrome print, and a screen reader.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — use a foreground ink as a fill under white</span>
            <div class="dd__stage">
              <code class="dd__code">background: var(--semantic-red-fg); color: #fff;</code>
            </div>
            <p class="dd__why">
              In the dark mode that ink is the pale <code>#fca5a5</code>, and white on it was never measured. The kit's
              badge fills with the same ink only because it flips the label to the hue's 950 step in dark — a pair the
              gate lists under "badge".
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — keep it a foreground</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--semantic-red-fg);</code>
            </div>
            <p class="dd__why">
              On a card that is 6.47:1 in light and 8.85:1 in dark under werkbund, and never below 6.47:1 in any style
              or mode, against the 4.5:1 of SC 1.4.3 — a row of the compilat rather than an assumption.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — read the style's brand step for the accent</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-500);</code>
            </div>
            <p class="dd__why">
              That step belongs to the visual style's brand scale: it stays put when the reader changes the accent, does
              not flip with the mode, and no pair measures it as text.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — read the accent's foreground role</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-fg);</code>
            </div>
            <p class="dd__why">
              Written per accent and mode, and measured against both grounds for all ten palettes in every style —
              under its value-equal alias <code>--primary-color-fg</code> in the compilat, whose tightest row is 4.75:1
              in both modes.
            </p>
          </div>
        </div>

        <h3>Sources</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            — the 4.5:1 bar for every text row above.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — the 3:1 bar for control edges, the focus ring, and the selected-row bar.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — why a state needs a carrier besides its hue.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Every color on screen comes from one of a few token families, and they differ in the two properties that
          matter for a decision: which axis moves the value — visual style, accent, or mode — and whether the gate has
          measured what may sit on it.
        </p>

        <h3>From Aura to the screen: the token layers</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Examples</th>
                <th>Moves with</th>
                <th>Written in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aura primitives</td>
                <td><code>--p-green-500</code>, <code>--p-slate-300</code></td>
                <td>nothing — fixed hue ramps</td>
                <td>the Aura preset</td>
              </tr>
              <tr>
                <td>Aura semantic</td>
                <td><code>--p-primary-color</code>, <code>--p-surface-200</code>, <code>--p-content-background</code></td>
                <td>mode; <code>primary</code> also the accent</td>
                <td>Aura, with <code>semantic.primary</code> replaced by <code>widgetPrimarySemantic</code></td>
              </tr>
              <tr>
                <td>Aura component</td>
                <td><code>--p-checkbox-border-color</code>, <code>--p-message-warn-color</code></td>
                <td>mode, and whatever the kit re-points it at</td>
                <td>Aura, plus the style's button delta; re-pointed in <code>styles.scss</code></td>
              </tr>
              <tr>
                <td>Kit role tokens</td>
                <td><code>--surface-*</code>, <code>--text-color*</code>, <code>--control-border</code></td>
                <td>visual style × mode</td>
                <td><code>surfaces</code> in <code>ui-styles.ts</code>, inline on <code>&lt;html&gt;</code></td>
              </tr>
              <tr>
                <td>Kit accent roles</td>
                <td><code>--primary-bg</code>, <code>--primary-fg</code>, <code>--accent-surface</code></td>
                <td>accent × mode</td>
                <td><code>THEME_COLORS</code> in <code>theme.service.ts</code>, inline on <code>&lt;html&gt;</code></td>
              </tr>
              <tr>
                <td>Kit inks</td>
                <td><code>--semantic-&lt;hue&gt;-fg</code></td>
                <td>mode only</td>
                <td><code>styles.scss</code>, <code>:root</code> and <code>.dark-theme</code></td>
              </tr>
              <tr>
                <td>Static palette</td>
                <td><code>--blue-500</code>, <code>--color-blue-500</code></td>
                <td>nothing — except <code>--primary-&lt;step&gt;</code>, overwritten by the style's brand scale</td>
                <td><code>design-tokens.scss</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The preset is <code>definePreset(Aura, style.presetOverrides)</code> merged with the accent ramp in
          <code>applyTheme</code>, <code>theme.service.ts</code>; the kit role and accent tokens are
          <code>buildTokenMaps</code> in the same file. The static palette is the <code>$colors</code> map: 122 entries,
          each emitted as <code>--color-&lt;name&gt;</code> and <code>--&lt;name&gt;</code>, with no dark counterpart.
          Where each layer sits in the cascade is the design-tokens guide.
        </p>

        <h3>The kit tokens the widgets are re-pointed at</h3>
        <p>
          Aura's stock widget colors were chosen for Aura's own slate and zinc surfaces. <code>styles.scss</code>
          re-points each widget role that carries meaning at a kit token instead, on the component's own selector, and
          the gate measures the widget with the re-point applied. Six kit tokens do almost all of that work:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kit token</th>
                <th>Widget roles it carries</th>
                <th>CONTRAST.MD groups</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--control-border</code></td>
                <td>
                  field edges (text inputs, select, multiselect, autocomplete, input number, cascade select, listbox),
                  checkbox and radio edge, switch off-track, slider track and handle ring
                </td>
                <td>form field edge, checkbox &amp; radiobutton, toggleswitch, progressbar &amp; slider</td>
              </tr>
              <tr>
                <td><code>--primary-color-fg</code></td>
                <td>
                  the one 2px focus ring on every focusable Optimus part (drawn inside the part where its container
                  clips), the selected-row bar, the pressed toggle pill, the progress spinner
                </td>
                <td>focus ring, menu focus, table &amp; paginator, togglebutton &amp; selectbutton, progress spinner</td>
              </tr>
              <tr>
                <td><code>--semantic-&lt;hue&gt;-fg</code></td>
                <td>every invalid edge (red), severity text buttons, badge fills, message and toast text</td>
                <td>form field edge, text &amp; link button, badge, message &amp; toast</td>
              </tr>
              <tr>
                <td><code>--text-color-secondary</code></td>
                <td>field chevrons and clear icons, submenu chevrons, the secondary text button, switch and slider hover</td>
                <td>form field icon, menu focus, text &amp; link button</td>
              </tr>
              <tr>
                <td><code>--surface-card</code></td>
                <td>switch and slider handles, table and paginator fills</td>
                <td>toggleswitch, progressbar &amp; slider, table &amp; paginator</td>
              </tr>
              <tr>
                <td><code>--style-outline</code></td>
                <td>popover border, drawer outline, and the signature edge of text inputs — the style's own ink</td>
                <td>panel outline, form field edge</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The re-points are the component-selector rules in <code>styles.scss</code> (<code>.p-checkbox</code>,
          <code>.p-toggleswitch</code>, <code>.p-slider</code>, <code>.p-message</code>, the kit focus-ring rule and its
          selector list); <code>scripts/check-contrast.mjs</code> reads the same rules and resolves Aura's token modules
          from <code>&#64;openng/optimus-ui-themes/dist/aura</code> with them applied.
        </p>

        <h3>The accent palettes carry two roles, not one color</h3>
        <p>
          Each of the ten palettes holds eight values: a background role for fills and gradient stops, a foreground role
          for links, titles, icons, outlined edges, and the focus ring, each in a light and a dark variant. The
          foreground values are <strong>curated per palette, not derived</strong> from the background ones — which is
          visible in the table: in light mode the two roles coincide in all ten palettes, while in dark they diverge in
          nine. <code>contrast</code> is the one that coincides in both, because its whole design is a single luminance
          pole per mode.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Palette</th>
                <th>Background, light</th>
                <th>Background, dark</th>
                <th>Foreground, light</th>
                <th>Foreground, dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sunset</td>
                <td><code>#c2410c</code></td>
                <td><code>#9a3412</code></td>
                <td><code>#c2410c</code></td>
                <td><code>#fb923c</code></td>
              </tr>
              <tr>
                <td>fire</td>
                <td><code>#cd1d1d</code></td>
                <td><code>#a71818</code></td>
                <td><code>#cd1d1d</code></td>
                <td><code>#f87171</code></td>
              </tr>
              <tr>
                <td>coral</td>
                <td><code>#a8124e</code></td>
                <td><code>#880f3f</code></td>
                <td><code>#a8124e</code></td>
                <td><code>#f472b6</code></td>
              </tr>
              <tr>
                <td>forest</td>
                <td><code>#157836</code></td>
                <td><code>#11612c</code></td>
                <td><code>#157836</code></td>
                <td><code>#4ade80</code></td>
              </tr>
              <tr>
                <td>ocean</td>
                <td><code>#0a756d</code></td>
                <td><code>#086058</code></td>
                <td><code>#0a756d</code></td>
                <td><code>#2dd4bf</code></td>
              </tr>
              <tr>
                <td>aurora</td>
                <td><code>#077288</code></td>
                <td><code>#065d6e</code></td>
                <td><code>#077288</code></td>
                <td><code>#22d3ee</code></td>
              </tr>
              <tr>
                <td>twilight</td>
                <td><code>#3346d3</code></td>
                <td><code>#2638b0</code></td>
                <td><code>#3346d3</code></td>
                <td><code>#85a7ff</code></td>
              </tr>
              <tr>
                <td>mystic</td>
                <td><code>#972ee1</code></td>
                <td><code>#7c1cc2</code></td>
                <td><code>#972ee1</code></td>
                <td><code>#c084fc</code></td>
              </tr>
              <tr>
                <td>stone</td>
                <td><code>#776558</code></td>
                <td><code>#605247</code></td>
                <td><code>#776558</code></td>
                <td><code>#d6d3d1</code></td>
              </tr>
              <tr>
                <td>contrast</td>
                <td><code>#0f172a</code></td>
                <td><code>#f8fafc</code></td>
                <td><code>#0f172a</code></td>
                <td><code>#f8fafc</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The primary pair of <code>THEME_COLORS</code> in <code>theme.service.ts</code>; the accent pair has the same
          shape and the same light/dark split. The widget ramp handed to Aura (<code>--p-primary-50</code>…<code
            >950</code
          >) is derived from the light <strong>background</strong> value in light mode and from the dark
          <strong>foreground</strong> value in dark, where Aura's <code>primary.color</code> points at that 500 step —
          so a checked checkbox, a badge, or a primary text button in dark wears the same color as
          <code>--primary-color-fg</code> (<code>widgetPrimarySemantic</code>).
        </p>

        <h3>What the gate measures</h3>
        <p>
          <code>scripts/check-contrast.mjs</code> builds every pair for every visual style × mode, and per accent where
          the pair depends on it, and fails the build when one misses its criterion or when the compilat is stale. The
          groups fall into two families:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Family</th>
                <th>Groups</th>
                <th>Read from</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kit tokens</td>
                <td>
                  body text, semantic text, control boundary, brand foreground, filled button and its hover, accent
                  surface, severity button and its hover, outlined severity, brand chip, floating action button, field
                  placeholder, dev toggle
                </td>
                <td><code>ui-styles.ts</code>, <code>styles.scss</code>, <code>THEME_COLORS</code></td>
              </tr>
              <tr>
                <td>Optimus widgets</td>
                <td>
                  checkbox &amp; radiobutton, toggleswitch, form field edge / text / icon, float label, tag, chip, dialog,
                  skeleton, progressbar &amp; slider, togglebutton &amp; selectbutton, menu focus, panel outline, content
                  panel, table &amp; paginator, badge, message &amp; toast, text &amp; link button, filled button
                  (contrast), avatar, image preview, focus ring, progress spinner
                </td>
                <td>Aura's token modules, with the accent ramp and every <code>styles.scss</code> re-point applied</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The group names are the <code>####</code> headings of <code>docs/generated/CONTRAST.MD</code>, whose header
          states the measured total and the count of declared exceptions — zero. Which criterion applies to a group is
          decided from the role it plays and recorded beside it in the script. Decoration is listed as informational
          (SC "none"): the skeleton, the progress track, the row and panel fills.
        </p>

        <h3>The filled-button label is picked more loosely than it is judged</h3>
        <p>
          A filled button paints a gradient between two accent stops, and the runtime chooses between a white and a dark
          label by comparing white against the
          <strong>average</strong> luminance of the two stops at a <strong>3:1</strong> bar. The gate does not accept
          that reasoning: the label is normal-size text, so it measures the chosen color against
          <strong>each</strong> stop at <strong>4.5:1</strong>, at rest and under the hover filter — an average cannot
          rescue the end of a gradient the text actually crosses. Every accent clears it today: 4.92:1 the tightest at
          rest in light and 6.75:1 in dark, 4.73:1 and 6.33:1 hovered. The heuristic did not establish that; the
          measurements did.
        </p>
        <p class="src-note">
          The picker is <code>getOptimalTextColor</code> in <code>theme.service.ts</code>, the hover direction
          <code>hoverBrightnessFor</code> in <code>ui-styles.ts</code>; the two-stop measurement is the "filled button" and "filled button (hover)" groups
          of <code>docs/generated/CONTRAST.MD</code>.
        </p>

        <h3>Where the colors miss their criterion</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Ratio</th>
                <th>Needs</th>
                <th>SC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4">None. Every measured pair meets its criterion, kit tokens and widgets alike.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The register is empty by decision, not by omission: a pair that misses is fixed with a kit token — the way the
          switch track, the slider, and the dark widget ramp were — or declared with a reason, never re-thresholded. A
          control edge drawn with the decorative <code>--surface-border</code> is a defect, not an exception.
        </p>
        <p class="src-note">
          The exceptions table of <code>docs/generated/CONTRAST.MD</code>; the two registers are
          <code>KNOWN_EXCEPTIONS</code> and <code>KNOWN_EXCEPTION_RULES</code> in <code>scripts/check-contrast.mjs</code>,
          both empty.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          <strong>No color in this kit responds to viewport width.</strong> The compiled global stylesheet carries
          viewport breakpoints at 768, 640, and 600 px, and not one of them declares a custom property — they move
          layout, never a color value. The only media block that redefines tokens at all is the print branch, whose
          mechanics belong to the design-tokens guide; printing from dark mode, <code>ThemeService</code> itself
          applies the light variant of the reader's style and accent, so a page always prints on light paper. What
          follows for you: a pair you verified at 1440 px is the same
          pair at 360 px, so there is nothing to re-check on a phone, and equally nothing to rescue you — there is no
          lighter "mobile palette" to fall back on. Two further environments are worth knowing: the one
          <code>prefers-contrast: high</code> block adjusts a rule rather than a token, and the one
          <code>forced-colors: active</code> block paints the selected-row bar in the system <code>Highlight</code>
          color; everywhere else the operating system substitutes its own palette outright.
        </p>
        <p class="src-note">
          The media blocks of <code>src/styles.scss</code>: only the print branch declares custom properties — the 768 /
          640 / 600 px breakpoints, the <code>prefers-contrast</code> block, and the <code>forced-colors</code> block
          declare none.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          A color change is never only a color change: the value, the pair it creates, and the compilat that records it
          move together, in one commit.
        </p>

        <h3>Where a new color goes</h3>
        <ul>
          <li>
            <strong>It differs per visual style</strong> — a field of the style in <code>ui-styles.ts</code>, for both
            modes of all four styles. The gate reads that file as text under the parser contract in its header.
          </li>
          <li>
            <strong>It differs per accent</strong> — <code>THEME_COLORS</code> in <code>theme.service.ts</code>, both
            roles, both modes.
          </li>
          <li>
            <strong>It is one kit-wide ink</strong> — <code>styles.scss</code>, in the <code>:root</code> and the
            <code>.dark-theme</code> block, the way <code>--semantic-&lt;hue&gt;-fg</code> is declared.
          </li>
          <li>
            <strong>It recolors an Optimus widget</strong> — re-point the component token at one of the kit tokens above,
            on the component's own selector, and make sure the gate reads that rule.
          </li>
        </ul>

        <h3>Add a color the gate will measure</h3>
        <pre class="code-block"><code>{{ addColorSnippet }}</code></pre>
        <p>
          Step 2 is the one that is easy to skip and expensive to skip. A token added without a pair is a color nobody
          measures; it will look fine in the style and mode you were working in and go unnoticed in the others until a
          reader reports it.
        </p>

        <h3>Cite a ratio</h3>
        <pre class="code-block"><code>{{ citeSnippet }}</code></pre>
        <p>
          A cited number goes stale loudly, because the compilat is regenerated on every build and the drift check
          fires. A number typed in from a color picker goes stale in silence, and there is no way to tell from the page
          which of the two you are reading — which is why the citation names the pair, the style, and the criterion, not
          the tool.
        </p>

        <h3>When a pair cannot pass yet</h3>
        <pre class="code-block"><code>{{ exceptionSnippet }}</code></pre>
        <p>
          The mechanism has two edges, and both are load-bearing. A failing pair that is not declared fails the build. A
          declared pair that has started to pass fails the build too, and so does an entry whose id matches no measured
          pair any more — because an exception nobody removes is a false statement about where the kit stands. Lowering
          the threshold instead would blind the gate for every other pair with the same role.
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>Every color comes from a role token, not from a palette step or a literal.</li>
          <li>Each foreground/ground combination appears in the job table or in a compilat row.</li>
          <li>A style-dependent value exists in all four styles, both modes; a kit-wide one in both blocks.</li>
          <li>The contrast gate was re-run with its write flag in the same commit.</li>
          <li>A new color role has a pair in the gate, not only a value in the stylesheet.</li>
          <li>Every state has a carrier besides its hue.</li>
          <li>Every control edge draws <code>--control-border</code>, never <code>--surface-border</code> alone.</li>
          <li>Every ratio in the change is quoted from the compilat.</li>
          <li>Checked under a second visual style and a second accent, not only the defaults.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Nothing in this system is translated — a color token holds a value, and a value has no language. What does
          change across locales is what a color is taken to mean, and that is a design decision the token layer
          deliberately does not make for you.
        </p>

        <h3>The hue tokens are named after hues, not meanings</h3>
        <p>
          The six inks are <code>--semantic-blue-fg</code> and its siblings, not <code>--error-fg</code> or
          <code>--success-fg</code>. That naming is the honest one: the association between a hue and a meaning is a
          convention, and conventions differ between audiences and cultures — red as danger, red as celebration, green
          as safe, green as inexperienced. The token guarantees a hue that is readable on its measured grounds; the
          meaning is assigned where it is used — the kit's severity rules map warn to orange and danger to red — and the
          interface should still work when a reader does not share the convention.
        </p>
        <p class="src-note">
          The six tokens are declared under their hue names in both blocks of <code>styles.scss</code>; the severity
          mapping is the <code>.p-button</code>, <code>.p-badge</code>, and <code>.p-message</code> rules in the same
          file.
        </p>

        <h3>The second carrier is what survives translation</h3>
        <p>
          A state expressed as hue plus a word survives everything the token layer cannot control: a translated label, a
          monochrome print, an operating system in a forced palette, a reader with a color deficiency. It also gives
          translators something to work with — a color cannot be translated, but "Failed" can, and a legend keyed to
          words rather than to swatches is the one that stays correct in the target language.
        </p>

        <h3>Writing direction does not touch color</h3>
        <p>
          No color token is direction-aware, and none should be: a color is a value, not a side. The same pair holds
          under a right-to-left script, and a layout that mirrors changes which element sits where without changing
          which ground is behind it. The one thing to re-check after mirroring is therefore layout, not contrast.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the narrow-screen note
            says a page prints on light paper from dark mode too (<code>ThemeService</code> switches to the light
            variant); the curated-foreground and filled-label statements re-checked against the service, which no
            longer carries runtime contrast helpers.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Rewritten for the visual styles and the gated widget layer: every ratio
            re-quoted per style (werkbund figures plus the four-style minimum), the token layers from Aura primitives to
            the kit's style, accent, and ink tokens, a job table (control edge, focus ring, invalid edge, selected-row
            bar, severity text), the six kit tokens the widgets are re-pointed at, the dark widget ramp built from
            <code>primaryFgDark</code>, <code>--primary-&lt;step&gt;</code> as the style's brand scale, and a gate with
            zero exceptions including widget pairs.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-23 — Re-verified against &#64;openng/optimus-ui-themes&#64;3.0.0 (PrimeNG 22): the
            contrast gate re-ran with a zero diff over all 194 pairs — Aura 3.0 kept the color values, so every quoted
            ratio stands. The preset now emits its colors as <code>light-dark()</code> values (mechanics in the
            design-tokens guide); the kit's three color families are unaffected.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-19 — The two scheduled token decisions landed:
            <code>--text-color-secondary</code> re-shaded to <code>#6b7280</code> (4.59:1 on the panel tones, closing
            both secondary-text exceptions) and <code>--control-border</code> split out for control edges at 3:1 (<code
              >#868d95</code
            >
            light, <code>#94a3b8</code> dark), leaving <code>--surface-border</code> to decoration. All figures updated
            from the regenerated compilat; the register now carries one exception.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-18 — Two corrections from the a11y-guidelines review. The brand-foreground
            Do/Don't cell credited <code>--primary-color-fg</code> with 4.92:1, which is its neighbor
            <code>--gradient-accent-color-fg</code>'s row; the token's own tightest light pair is 5.18:1. And the
            second-carrier rule moves from SHOULD to MUST, because SC 1.4.1 is level A and the accessibility guide
            already stated it as a MUST.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-08-18 — Initial guide: the three color families and what each guarantees, the
            ten brand palettes in both roles, the ground-by-ground pairing table, the seven measured groups and the nine
            declared exceptions, the filled-button label rule, and the canonical agent doc.
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

      /* --- Ground panels --- */
      .grounds {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .gr {
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        color: var(--text-color);
      }
      .gr--ground {
        background: var(--surface-ground);
      }
      .gr--card {
        background: var(--surface-card);
      }
      .gr--section {
        background: var(--surface-section);
      }
      .gr--hover {
        background: var(--surface-hover);
      }
      .gr strong {
        font-family: var(--font-mono);
        font-size: 0.85rem;
      }
      .gr__body {
        margin: 0.5rem 0 0.2rem;
      }
      .gr__sec {
        margin: 0 0 0.5rem;
        color: var(--text-color-secondary);
        font-size: var(--font-size-sm);
      }
      .gr__num {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }
      @media (max-width: 640px) {
        .grounds {
          grid-template-columns: 1fr;
        }
      }

      /* --- Semantic hue spans --- */
      .sem {
        font-weight: var(--font-weight-medium);
      }
      .sem--blue {
        color: var(--semantic-blue-fg);
      }
      .sem--orange {
        color: var(--semantic-orange-fg);
      }
      .sem--green {
        color: var(--semantic-green-fg);
      }
      .sem--red {
        color: var(--semantic-red-fg);
      }
      .sem--purple {
        color: var(--semantic-purple-fg);
      }
      .sem--pink {
        color: var(--semantic-pink-fg);
      }

      /* --- Style-brand-versus-accent swatches --- */
      .demo2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .swatch-fig {
        margin: 0;
      }
      .swatch {
        min-height: 4.5rem;
        border-radius: var(--radius-lg);
        border: 1px solid var(--surface-border);
      }
      .swatch-fig figcaption {
        margin-top: var(--space-2);
        font-size: var(--font-size-sm);
        color: var(--text-color);
      }
      .swatch--palette {
        background: var(--primary-500);
      }
      .swatch--brand {
        background: var(--primary-bg);
      }
      @media (max-width: 640px) {
        .demo2 {
          grid-template-columns: 1fr;
        }
      }

      /* --- Status row (color-alone demo) --- */
      .insp {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-3);
        margin: 0 0 var(--space-3);
      }
      .insp__state {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
      }
      .states {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-4);
        margin: 0 0 var(--space-3);
      }
      .st {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--font-size-sm);
      }
      .st__dot {
        display: inline-block;
        width: 0.85rem;
        height: 0.85rem;
        border-radius: 999px;
        background: currentColor;
      }
      .st--ok {
        color: var(--semantic-green-fg);
      }
      .st--warn {
        color: var(--semantic-orange-fg);
      }
      .st--bad {
        color: var(--semantic-red-fg);
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
      .dd__code {
        font-family: var(--font-mono);
        font-size: 0.8rem;
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
      .history strong {
        color: var(--primary-color-fg);
      }
    `,
  ],
})
export class ColorSystemArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Live output of the color-alone demo: labels on or off. */
  readonly labelsOn = signal(true);

  readonly carrierState = signal('Labels shown — the state has two carriers.');

  toggleLabels(): void {
    const next = !this.labelsOn();
    this.labelsOn.set(next);
    this.carrierState.set(
      next ? 'Labels shown — the state has two carriers.' : 'Labels hidden — the hue is now the only carrier.',
    );
  }

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly amberSnippet = `/* The name says primary; the value is the VISUAL STYLE's brand
   step, written at runtime from ui-styles.ts brandScale. It does not
   follow the accent, and no pair measures it as text. */
.badge { background: var(--primary-500); }

/* The accent roles: written per palette and per mode, and measured
   against both grounds for all ten palettes in every style. */
.badge { background: var(--primary-bg); color: var(--primary-color-text); }
.link  { color: var(--primary-fg); }`;

  readonly addColorSnippet = `/* 1. The value, where its axis lives. A kit-wide ink goes into
   styles.scss, in BOTH blocks; a per-style value into every style
   of ui-styles.ts instead. */
:root       { --control-accent: #0a756d; }
.dark-theme { --control-accent: #2dd4bf; }

/* 2. scripts/check-contrast.mjs, inside buildPairs() — the PAIR.
   Without this the token exists and nothing measures it. The
   function runs once per style and mode, so one line covers all. */
add(mode, 'control accent', '1.4.3', AA_NORMAL,
    '--control-accent', t['--control-accent'],
    '--surface-card', card);

/* 3. Regenerate the compilat in the SAME commit, or the gate fails
   the next build on a stale file. */
node scripts/check-contrast.mjs --write`;

  readonly citeSnippet = `/* Cite the pair, the style, and the criterion. */
.term { color: var(--semantic-green-fg); }
/* --semantic-green-fg on --surface-card: 5.02:1 light, 11.97:1 dark
   (werkbund); SC 1.4.3 needs 4.5:1. Source: docs/generated/CONTRAST.MD */

/* Not this: no pair, no criterion, no source — and no way to notice
   when the token moves.
   .term { color: var(--semantic-green-fg); }  // contrast is fine */`;

  readonly exceptionSnippet = `/* scripts/check-contrast.mjs — a pair that cannot pass yet is
   DECLARED. It is not re-thresholded, and it is not dropped from
   the measured set. Both registers are empty today; this is the
   shape of an entry, keyed by the pair id of the report line. */
const KNOWN_EXCEPTIONS = {
  'werkbund light: --dev-toggle-border on --surface-card': {
    reason: 'p-green-500 on white is 2.28:1 while its active/dark '
          + 'twins pass — TODO: move to p-green-600',
  },
};

/* Three ways this fails the build, all deliberate:
   - a pair below its criterion that is not declared here;
   - a declared pair that now PASSES (stale exception);
   - an id here that matches no measured pair any more. */`;
}
