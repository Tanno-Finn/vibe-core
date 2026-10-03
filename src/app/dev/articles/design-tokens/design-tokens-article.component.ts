import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ButtonModule } from '@openng/optimus-ui/button';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Design Tokens (foundations).
 *
 * CLAIMS THE REFERENCE TABLES REST ON (so they cannot silently rot):
 *   - Four layers write CSS custom properties to the same names. Weakest first:
 *     (1) design-tokens.scss compiles Sass maps into :root/.dark-theme;
 *     (2) styles.scss @use-s it at the top, so its own :root/.dark-theme blocks
 *         come LATER in the sheet and win at equal specificity;
 *     (3) Optimus UI's Aura 2.x preset owns the --p-* namespace (primitive,
 *         semantic and component tiers), built at runtime as
 *         definePreset(Aura, style.presetOverrides) + the accent ramp
 *         (widgetPrimarySemantic); styles.scss re-points 139 distinct --p-*
 *         names, all on component selectors;
 *     (4) theme.service.ts writes the style x accent x mode token map as
 *         INLINE STYLE on <html> (buildTokenMaps).
 *   - Measured over a compile of src/styles.scss plus the icon sheet: 985
 *     custom-property declarations, 726 distinct names — 259 redeclarations,
 *     which is what the cascade table is about.
 *   - --text-color diverges between layer 1 (#1e293b) and layer 2 (#121212,
 *     the default style's value); at runtime the active style's value wins.
 *   - Layer 3 does NOT merely win "inside Optimus UI components": Optimus
 *     injects its --p-* block onto :root,:host from a runtime <style> tag that
 *     lands after the kit stylesheet, so it wins at equal specificity
 *     everywhere. Hence the rule that a --p-* override belongs on the
 *     component selector; see the notes at .p-select / .p-slider in styles.scss.
 *   - Layer 3's dark mechanic is Aura 2.x: the base preset carries
 *     colorScheme.light / colorScheme.dark blocks and NO light-dark() token
 *     (@openng/optimus-ui-themes/dist/aura/base/index.mjs), and the styled
 *     engine emits a second token block under the configured darkModeSelector
 *     (@openng/optimus-ui-styled/dist/index.mjs, getColorSchemeOption).
 *   - The ONLY media-scoped token redefinition in the bundle is @media print
 *     (19 tokens: 17 surfaces + 2 text). No token is viewport-scoped — hence
 *     the responsive statement. The real print switch is ThemeService
 *     (setupPrintListener: light variant on beforeprint, dark restored on
 *     afterprint); the @media block is its fallback.
 *   - The two tokens that did not work as written are fixed: design-tokens.scss
 *     now has the *-400 severity keys the dark map reads (the four dark
 *     --<severity>-color tokens resolve), and --input-focus-ring (it read an
 *     undefined --primary-500-rgb, no consumer) was removed.
 *   - The first-paint copies (styles.scss :root/.dark-theme, the two index.html
 *     boot rules) are held equal to the default style by check 1 of
 *     scripts/check-contrast.mjs.
 *   - Contrast figures are quoted from docs/generated/CONTRAST.MD, never
 *     hand-measured (guide-authoring.md).
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-design-tokens-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, ButtonModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'design-tokens'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Tokens are not a document — they are the values your browser is holding right now. The inspector below reads
          them out of the live page, so it answers in the theme you are actually looking at. Switch the theme or the
          brand color and re-read: the names stay, the values move.
        </p>

        <h3>Live token inspector</h3>
        <p>
          Resolved values of the core role tokens, read from the document element. This block is live output, not a
          reference table — the numbers change with your theme.
        </p>
        <div class="insp">
          <button pButton type="button" (click)="readTokens()"><span pButtonLabel>Re-read tokens</span></button>
          <p class="insp__state" role="status">{{ inspectorState() }}</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Swatch</th>
                <th>Resolved value</th>
              </tr>
            </thead>
            <tbody>
              @for (t of liveTokens(); track t.name) {
                <tr>
                  <td>
                    <code>{{ t.name }}</code>
                  </td>
                  <td><span class="sw" [style.background]="t.value"></span></td>
                  <td>
                    <code>{{ t.value }}</code>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="3">Press "Re-read tokens" — the inspector only runs in the browser.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read with getComputedStyle on the document element; the token names are the role tokens listed in the agent
          doc's semantic mapping.
        </p>

        <h3>A scoped override, side by side</h3>
        <p>
          A custom property set on an element applies to that element and everything inside it. Both panels below use
          the same rule — <code>background: var(--surface-card)</code> — and only the right one carries an override.
        </p>
        <div class="demo2">
          <div class="panel">
            <strong>Inherited</strong>
            <p>Reads the theme's <code>--surface-card</code> and <code>--text-color</code>.</p>
          </div>
          <div class="panel panel--tinted">
            <strong>Overridden</strong>
            <p>The same rule, with two tokens redefined on this element only.</p>
          </div>
        </div>
        <pre class="code-block"><code>{{ scopeSnippet }}</code></pre>
        <p class="src-note">
          The override mechanism is CSS Custom Properties L1 — a property set on an element is inherited by its subtree;
          nothing in this kit is required for it to work.
        </p>

        <h3>What paints before your CSS does</h3>
        <p>
          The first paint does not use tokens at all. A block in the page head sets the theme class on the root element
          and hard-codes a background and text color, so the very first frame already matches the stored theme instead
          of flashing white; for a returning reader it also replays the token map the theme service saved on the last
          visit. The two literals duplicate the default style's <code>--surface-ground</code> and
          <code>--text-color</code> by hand — when you re-shade the default style, that block is one more place the
          value lives, and the contrast gate fails the build until it matches.
        </p>
        <p class="src-note">
          The bootstrap block sits in the application's index HTML, ahead of the stylesheet link; the class it sets is
          the same one the dark theme keys on. Check 1 of <code>scripts/check-contrast.mjs</code> compares its two rules,
          and the <code>styles.scss</code> first-paint blocks, against the default style in
          <code>src/app/services/ui-styles.ts</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Consuming a token is one function call. Everything hard about tokens is deciding
          <em>which</em> name to read and <em>where</em> to write a new value.
        </p>

        <h3>Which layer do I touch?</h3>
        <ul>
          <li>
            <strong>Reading a value</strong> — always <code>var(--token)</code>, never the hex. You do not need to know
            which layer produced it.
          </li>
          <li>
            <strong>Changing one component</strong> — set the token on that component's host or wrapper. Scoped,
            reversible, invisible to everything else.
          </li>
          <li>
            <strong>Changing a surface or text color</strong> — it belongs to a visual style: edit that style in
            <code>ui-styles.ts</code>, per mode. For the default style, also update its first-paint copy in
            <code>styles.scss</code> and the index HTML; the contrast gate fails until the three agree.
          </li>
          <li>
            <strong>Adding a kit-wide token that no style varies</strong> — <code>styles.scss</code>, in both the light
            and the dark block, the way <code>--semantic-&lt;hue&gt;-fg</code> is declared.
          </li>
          <li>
            <strong>Changing a brand color</strong> — it is not in a stylesheet at all; the ten accent palettes live in
            <code>THEME_COLORS</code> in <code>theme.service.ts</code>.
          </li>
          <li>
            <strong>Changing an Optimus UI component's look</strong> — that is the <code>--p-*</code> namespace, and it
            belongs to that component's guide.
          </li>
        </ul>

        <h3>The fallback contract</h3>
        <p>
          <code>var(--token, fallback)</code> uses the fallback when the token is <em>undefined</em>. It does not use it
          when the token is defined but <em>empty</em> — an empty custom property is a valid, defined value, and
          substituting it makes the declaration invalid at computed-value time, so the property computes to its
          inherited value (or its initial value, if it does not inherit). It does <em>not</em> fall back to the previous
          declaration. This is not hypothetical: four semantic color tokens of this kit were once emitted empty in
          the dark theme (see Development).
        </p>
        <pre class="code-block"><code>{{ fallbackSnippet }}</code></pre>
        <p class="src-note">Behavior defined by CSS Custom Properties L1, "guaranteed-invalid value".</p>

        <h3>The naming spaces</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Prefix</th>
                <th>What it holds</th>
                <th>Safe to override?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--surface-*</code> / <code>--text-color*</code> / <code>--control-border</code></td>
                <td>Grounds, text, and control edges of the active visual style. Written at runtime.</td>
                <td>Only scoped — a global rule loses to the inline layer; a new value belongs in the style.</td>
              </tr>
              <tr>
                <td><code>--semantic-&lt;hue&gt;-fg</code></td>
                <td>Kit-wide inks for inline highlights and severity text. Light and dark, same in every style.</td>
                <td>Scoped, or in both <code>styles.scss</code> blocks.</td>
              </tr>
              <tr>
                <td><code>--primary-bg</code> / <code>--primary-fg</code> / <code>--accent-*</code></td>
                <td>Accent roles. Written at runtime per accent and mode.</td>
                <td>Only scoped — a global rule loses to the inline layer.</td>
              </tr>
              <tr>
                <td><code>--primary-&lt;step&gt;</code></td>
                <td>The active style's brand scale, not the accent. Written at runtime.</td>
                <td>Read only for style chrome; the accent is <code>--primary-fg</code>.</td>
              </tr>
              <tr>
                <td>
                  <code>--space-*</code>, <code>--radius-*</code>, <code>--shadow-*</code>, <code>--z-*</code>,
                  <code>--container-*</code>
                </td>
                <td>Ordinal scales. Not theme-aware.</td>
                <td>Yes, but prefer picking a different step.</td>
              </tr>
              <tr>
                <td><code>--blue-500</code> and <code>--color-blue-500</code></td>
                <td>The raw palette, emitted twice under two names.</td>
                <td>Avoid reading either — they carry no role.</td>
              </tr>
              <tr>
                <td><code>--p-*</code></td>
                <td>Optimus UI's Aura namespace: primitive, semantic, and component tiers.</td>
                <td>Only per component, on its own selector, and only where its guide says so.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Prefixes read off the emitted custom properties in the compiled global stylesheet; the dual palette naming is
          generated once per palette entry in
          <code>design-tokens.scss</code>.
        </p>

        <h3>Do / Don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a literal that duplicates a token</span>
            <div class="dd__stage">
              <div class="mini mini--hard"><span>Fixed #ffffff panel</span></div>
            </div>
            <p class="dd__why">
              It looks right in light mode and turns into white-on-white in dark mode, and the contrast gate cannot see
              it because it measures tokens, not literals.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — read the role token</span>
            <div class="dd__stage">
              <div class="mini"><span>var(--surface-card) panel</span></div>
            </div>
            <p class="dd__why">
              One rule, both themes, and the pair shows up in the contrast compilat where a regression is caught by the
              build rather than by a reader.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — retheme from a component's stylesheet</span>
            <div class="dd__stage">
              <code class="dd__code">:root &#123; --surface-card: #eef; &#125;</code>
            </div>
            <p class="dd__why">
              A component that writes to the root repaints the whole application from wherever it happens to be mounted,
              and the next component to do it wins.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — scope the override to your subtree</span>
            <div class="dd__stage">
              <code class="dd__code">.my-panel &#123; --surface-card: #eef; &#125;</code>
            </div>
            <p class="dd__why">
              The override reaches exactly the subtree that asked for it, and every nested component keeps working
              because it still reads the same token name.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — paint text in the background role</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-bg);</code>
            </div>
            <p class="dd__why">
              The background role is tuned to sit <em>behind</em> light text. Used as a text color on a light ground it
              is the wrong end of the ratio it was measured for.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — paint text in the foreground role</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-fg);</code>
            </div>
            <p class="dd__why">
              The foreground role is the curated per-theme variant tuned against the page ground in the matching mode —
              that is the pair the compilat measures.
            </p>
          </div>
        </div>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Four layers write to one set of names. Nothing in CSS marks a custom property as belonging to a layer, so
          "which value paints" is decided entirely by the cascade — which is why the order below is the single most
          useful thing to know about this kit.
        </p>

        <h3>The four layers, weakest to strongest</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Layer</th>
                <th>Written where</th>
                <th>Beaten by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Generated scales and palette</td>
                <td><code>design-tokens.scss</code>, compiled to <code>:root</code> and <code>.dark-theme</code></td>
                <td>Layers 2–4</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Kit role tokens (first-paint copy of the default style) and component re-points</td>
                <td>
                  <code>styles.scss</code>, hand-written <code>:root</code> and <code>.dark-theme</code>, plus
                  <code>--p-*</code> re-points on component selectors
                </td>
                <td>Layer 4 for every name the runtime writes; layer 3 for any <code>--p-*</code> name set on <code>:root</code></td>
              </tr>
              <tr>
                <td>3</td>
                <td>Library namespace <code>--p-*</code></td>
                <td>
                  Aura 2.x preset with the style's delta and the accent ramp merged in, injected at runtime as a
                  <code>:root,:host</code> block <em>after</em> the kit stylesheet, plus a second token block under
                  <code>.dark-theme</code></td>
                <td>
                  A selector narrower than <code>:root</code>, <code>!important</code>, or layer 4 — not by another
                  <code>:root</code> rule
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Runtime style, accent, and mode</td>
                <td>
                  <code>theme.service.ts</code> — the token map of the active style × accent × mode, as inline style on
                  the root element
                </td>
                <td>Nothing short of <code>!important</code> or a narrower element</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Layer order verified against the compiled global stylesheet: layer 1's blocks appear before layer 2's because
          <code>styles.scss</code> pulls in <code>design-tokens.scss</code> at its top, and both write plain
          <code>:root</code> / <code>.dark-theme</code> — equal specificity, so source order decides. Layer 4 is
          <code>buildTokenMaps</code> in <code>theme.service.ts</code>, applied as inline style. Layer 3's position is
          recorded in <code>styles.scss</code> beside the select focus-ring rule: a <code>--p-select-focus-ring-*</code>
          token re-declared on <code>:root</code> still computes to the preset's value, because the preset's own
          <code>:root</code> block is injected later.
        </p>

        <h3>Three tiers inside <code>--p-*</code>, and where the kit re-points them</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tier</th>
                <th>Example</th>
                <th>Written by</th>
                <th>Kit re-point</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Primitive</td>
                <td><code>--p-green-500</code>, <code>--p-border-radius-md</code></td>
                <td>Aura, plus the style's <code>borderRadius</code> primitives</td>
                <td>None — read directly only for a fixed hue step</td>
              </tr>
              <tr>
                <td>Semantic</td>
                <td><code>--p-primary-color</code>, <code>--p-surface-300</code>, <code>--p-content-background</code></td>
                <td>Aura, with <code>semantic.primary</code> replaced by the accent ramp</td>
                <td>None — the ramp is the kit's input</td>
              </tr>
              <tr>
                <td>Component</td>
                <td><code>--p-checkbox-border-color</code>, <code>--p-message-warn-color</code></td>
                <td>Aura, plus the style's button delta</td>
                <td>
                  <code>styles.scss</code>, on the component selector, pointed at a kit token
                  (<code>--control-border</code>, <code>--semantic-&lt;hue&gt;-fg</code>, <code>--primary-color-fg</code>)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Tiers as the styled engine emits them (<code>&#64;openng/optimus-ui-styled/dist/index.mjs</code>,
          <code>getCommon</code> for primitive and semantic, one block per component); the merge order is
          <code>definePreset(Aura, style.presetOverrides)</code>, then <code>widgetPrimarySemantic</code>, in
          <code>theme.service.ts</code>. The accent ramp takes the palette's <code>primaryColor</code> in light and its
          <code>primaryFgDark</code> in dark, where <code>primary.color</code> points at step 500 — so a widget's accent
          in dark mode is the same color as <code>--primary-color-fg</code>. Every re-pointed pair is a row in
          <code>docs/generated/CONTRAST.MD</code>.
        </p>

        <h3>Where a <code>--p-*</code> override has to go</h3>
        <p>
          The preset is not a stylesheet you can out-order. Optimus UI writes its
          <code>--p-*</code> block onto <code>:root</code> from a style element injected at runtime, which lands after
          the kit's own stylesheet, and at equal specificity the later block wins — so a <code>:root</code> rule of
          yours for one of those names is dead everywhere, not merely inside the component.
          <strong>Put a <code>--p-*</code> override on the component's own selector</strong>
          — <code>.p-slider</code>, <code>.p-select</code> — where a class beats the preset's bare <code>:root</code> on
          specificity, and where the override reaches only the component that asked for it. The slider's target-size fix
          in <code>styles.scss</code> is the reference pattern: the two handle tokens are declared on
          <code>.p-slider</code> rather than on <code>:root</code> for exactly this reason.
        </p>
        <p class="src-note">
          The precedence is recorded in <code>styles.scss</code> at the two rules it forced, the
          <code>.p-select</code> focus ring and the <code>.p-slider</code> handle tokens; verify it in your own build by
          re-declaring a <code>--p-*</code> name on <code>:root</code> and reading the computed value back off the
          component.
        </p>

        <h3>What the redeclarations cost</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Measure</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Custom-property declarations in the compiled global stylesheet</td>
                <td>985</td>
              </tr>
              <tr>
                <td>Distinct custom-property names</td>
                <td>726</td>
              </tr>
              <tr>
                <td>Redeclarations (declarations minus distinct names)</td>
                <td>259</td>
              </tr>
              <tr>
                <td>Distinct <code>--p-*</code> names the kit sets itself</td>
                <td>139</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Counted over the compiled global stylesheet (<code>src/styles.scss</code> with the icon sheet it imports). A
          redeclaration is not waste by itself — the light and dark blocks are one each — but it is why reading the
          first definition of a token tells you nothing. The runtime layer adds its own map on top, and its size depends
          on the active style.
        </p>

        <h3>One token, four values</h3>
        <p><code>--text-color</code> is the clearest case, because the layers disagree:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Layer</th>
                <th>Light value</th>
                <th>Reaches the screen?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 — generated</td>
                <td><code>#1e293b</code></td>
                <td>No — shadowed by layer 2</td>
              </tr>
              <tr>
                <td>2 — stylesheet</td>
                <td><code>#121212</code> (the default style's)</td>
                <td>Yes, until the runtime layer writes</td>
              </tr>
              <tr>
                <td>4 — runtime</td>
                <td>the active style's: <code>#121212</code> werkbund, <code>#2b2622</code> lernwerkstatt</td>
                <td>Yes — inline style, final</td>
              </tr>
              <tr>
                <td>
                  boot block — declares no token; it paints the <code>color</code> property on the root element directly
                </td>
                <td><code>#121212</code></td>
                <td>Yes, for the first frame of a first visit only</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values read from <code>design-tokens.scss</code>, <code>styles.scss</code>, the <code>surfaces</code> of each
          style in <code>src/app/services/ui-styles.ts</code>, and the head bootstrap block. The contrast compilat
          measures the runtime values, per style ("body text" rows).
        </p>

        <h3>How dark mode actually switches</h3>
        <p>
          There is no media query behind the dark theme. A class — <code>dark-theme</code> — carries it. The head
          bootstrap block puts that class on the <em>root element only</em>, from stored preference or the system
          setting; the theme service then sets it authoritatively on the root element <em>and</em> the body. Every dark
          value in layers 1 and 2 hangs off that one class selector. Because a class beats a bare <code>:root</code> on
          specificity, the dark block does not need to be later in the file — only the light blocks compete on source
          order.
        </p>
        <p>
          Layer 3 switches by selector too. Optimus UI's Aura 2.x preset carries two separate token blocks,
          <code>colorScheme.light</code> and <code>colorScheme.dark</code>; there is no <code>light-dark()</code>
          anywhere in the base preset (<code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>). The styled
          engine resolves the configured <code>darkModeSelector</code> and emits the dark block under it
          (<code>&#64;openng/optimus-ui-styled/dist/index.mjs</code>, <code>getColorSchemeOption</code>). So
          <code>--p-content-background</code> is written twice — from
          <code>colorScheme.light.content.background</code> on <code>:root,:host</code>, and from
          <code>colorScheme.dark.content.background</code> under <code>.dark-theme</code>. The consequence for you: a
          <code>--p-*</code> color override declared once applies in <em>both</em> modes, so pair it with a
          <code>.dark-theme</code> rule whenever it has to follow the theme.
        </p>
        <p class="src-note">
          The dark-mode selector is configured where Optimus UI is provided — <code>provideOptimus</code> in
          <code>app.config.ts</code>, <code>darkModeSelector: '.dark-theme'</code> — and re-applied on every theme
          change in <code>theme.service.ts</code>. Read off the preset and the styled engine.
        </p>

        <h3>The runtime layer derives colors arithmetically</h3>
        <p>
          The accent ramp handed to the Aura preset — built from the palette's light <code>primaryColor</code> in light
          mode and from its <code>primaryFgDark</code> in dark — and the tinted <code>--accent-surface</code> family are
          computed from one color by adding or subtracting a flat amount from each sRGB channel and clamping. That is not a perceptual lighten or darken, and the clamp is
          visible in the output: in dark mode <code>--accent-surface</code> lands on pure <code>#000000</code> for four
          of the ten brand themes, and within nine of black for a fifth, even though the code describes it as roughly a
          950 step. The paired text token is derived the same way, so the pairs still measure well —
          <code>--accent-on-surface</code> on <code>--accent-surface</code> ranges from 9.53:1 to 20.70:1 in dark mode
          against the 4.5:1 bar of SC 1.4.3 — but the surfaces are far less distinguishable from each other than their
          names suggest.
        </p>
        <p class="src-note">
          Derivation read from <code>lightenHex</code>, <code>darkenHex</code> and <code>widgetPrimarySemantic</code> in
          <code>theme.service.ts</code>; the resolved values and every ratio quoted here are from the "accent surface"
          rows of <code>docs/generated/CONTRAST.MD</code>, which recomputes them from the real tokens on each build.
        </p>

        <h3>How the gate proves the layers</h3>
        <p>
          Contrast is governed by a gate, not by review: <code>check-contrast.mjs</code> resolves all four layers the
          way the browser does — the style values, the <code>styles.scss</code> tokens, the accent palettes, and Aura's
          own token modules with every <code>styles.scss</code> re-point applied — and measures each pair for every
          visual style × mode, and per accent where the pair depends on it. Kit tokens and Optimus widget tokens alike;
          no declared exception remains. The split that matters most to a token consumer:
          <code>--surface-border</code> is decoration only — hairlines between rows and cards — and is not held to SC
          1.4.11; the edge of anything interactive draws <code>--control-border</code>, whose tightest row is 3.25:1
          (blaupause, dark, on <code>--surface-section</code>; SC 1.4.11 needs 3:1). A control whose only identifier is
          the decorative token is a defect the gate cannot see, so the token choice is the review point.
        </p>
        <p class="src-note">
          Groups "control boundary" and "form field edge" of <code>docs/generated/CONTRAST.MD</code>; its header states
          the measured total and the declared-exception count, zero.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          <strong>No token in this kit is viewport-scoped.</strong> The only media-scoped token redefinition in the
          entire compiled stylesheet is a print branch, which re-lights 19 dark-theme tokens — 17 surfaces and 2 text
          colors. It is the fallback: printing in dark mode, <code>ThemeService</code> applies the light variant of the
          reader's style and accent on <code>beforeprint</code> and restores dark on <code>afterprint</code>, so a
          dark page prints on light paper. There is no breakpoint at which <code>--space-4</code> shrinks
          or <code>--font-size-base</code> steps down, and no token changes at 360 px. What that means for you:
          responsive behavior is yours to write. Pick a smaller step from the scale inside your own media query, cap
          width with the <code>--container-*</code> tokens, and do not expect the token layer to reflow anything on its
          own.
        </p>
        <p class="src-note">
          Established by scanning every media block in the compiled global stylesheet for custom-property declarations:
          print is the only one that carries any.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Three recipes cover almost every token change: override one for a subtree, add a new one to the theme, and
          reach a value the runtime layer owns.
        </p>

        <h3>Override for one subtree</h3>
        <pre class="code-block"><code>{{ scopeSnippet }}</code></pre>
        <p>
          Prefer this over everything else. It cannot break another component, it survives a theme switch because the
          tokens it does not touch still resolve normally, and it is deleted by deleting one rule.
        </p>

        <h3>Add a token to the theme</h3>
        <pre class="code-block"><code>{{ addTokenSnippet }}</code></pre>
        <p>
          Add it in both blocks even when the two values are identical today — a token that exists only in the light
          block silently keeps its light value in dark mode, which is the failure that is hardest to notice in review.
          If the new token is a color used for text or a control edge, run the contrast gate with its write flag in the
          same commit so the compilat learns about the pair.
        </p>

        <h3>Reach a value the runtime layer owns</h3>
        <pre class="code-block"><code>{{ runtimeSnippet }}</code></pre>
        <p>
          The runtime properties are inline style on the root element. Inline style wins against any stylesheet
          selector regardless of specificity, so a
          <code>:root</code> rule for one of those names is dead on arrival. Either scope your override to an element
          further down — where you are no longer competing with the root's inline style at all — or change the value at
          its source: the style in <code>ui-styles.ts</code>, or the accent palette in <code>theme.service.ts</code>.
        </p>

        <h3>Two tokens that did not work as written</h3>
        <p>
          Both are fixed now, and both show what to check when you add a token. The dark
          <code>--success-color</code>, <code>--warning-color</code>, <code>--danger-color</code> and
          <code>--info-color</code> were emitted <em>empty</em>: the dark map read <code>*-400</code> palette keys the
          color map did not define, so <code>var(--danger-color, red)</code> yielded nothing and no fallback. The map
          now has the four keys and the tokens resolve. <code>--input-focus-ring</code> was a shadow that read the
          undefined <code>--primary-500-rgb</code> and had no consumer; it was removed. There is no focus token: a
          field's focus indicator is the one kit ring in <code>styles.scss</code> (2px
          <code>--primary-color-fg</code>), measured in the "focus ring" group of <code>CONTRAST.MD</code>.
        </p>
        <p class="src-note">
          <code>design-tokens.scss</code>: the <code>*-400</code> severity keys and the comment where
          <code>input-focus-ring</code> stood.
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>No hard-coded color that a role token already names.</li>
          <li>Every new color token exists in both the light and the dark block.</li>
          <li>The contrast gate was re-run with its write flag if a color value moved.</li>
          <li>Overrides are scoped to the narrowest element that needs them.</li>
          <li>No override targets a runtime-owned property from a root-level rule.</li>
          <li>Text uses the foreground role and fills use the background role.</li>
          <li>Nothing relies on the border token alone to mark a control.</li>
          <li>Checked in both modes and under a second visual style and accent, not just the one you were working in.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Tokens hold values, never text, so nothing here is translated. Two things still change with the language, and
          both are worth knowing before you touch the type or the layout tokens.
        </p>

        <h3>The font token carries a multi-script fallback</h3>
        <p>
          The default UI font is a system stack, chosen so the first paint costs no font fetch. It is not a plain system
          stack, though: it names four Noto Sans variants — Korean, Devanagari, Bengali, and Gurmukhi — ahead of the
          generic
          <code>sans-serif</code> terminator. Read those four as an <em>ask</em> rather than a promise. The kit declares
          no <code>&#64;font-face</code> for any Noto family and points at no external font host, so they paint where
          the reader's operating system already carries them and drop through to <code>sans-serif</code> where it does
          not. Guaranteeing a script means shipping its files the way the picker fonts are shipped;
          <strong>Typography</strong> walks the stack entry by entry. If you extend the stack for a new script, extend
          it in the token — not in a per-component <code>font-family</code>, which the runtime font picker will then
          fail to override.
        </p>
        <p class="src-note">
          The font token is declared in <code>styles.scss</code> and rewritten at runtime by
          <code>font.service.ts</code>, which sets it as inline style on the root element — the same layer-4 mechanism
          the theme uses. That no Noto family is loaded was established over <code>src/</code> and
          <code>angular.json</code>: no <code>&#64;font-face</code> names one, and <code>src/index.html</code> links no
          font host at all.
        </p>

        <h3>Layout tokens are scalars, not directions</h3>
        <p>
          No token in the kit is direction-aware: <code>--space-4</code> is a length, not a left or a right. That is the
          correct shape — direction belongs in the property, not in the value. Apply spacing through logical properties
          (<code>padding-inline</code>, <code>margin-inline-start</code>) and the token layer stops being the obstacle
          to a right-to-left script — it does not make the kit right-to-left, which is a separate and much larger job:
          nothing here writes <code>dir</code> and no <code>rtl</code> rule ships, so the direction never flips in the
          first place. That boundary is <code>a11y-guidelines</code>. A token pair named for physical sides would have
          to be duplicated per direction and would drift.
        </p>
        <p class="src-note">
          Verified by inspecting the emitted custom-property names: the spacing, radius, and container scales are all
          plain lengths, with no start/end or left/right variants.
        </p>

        <h3>Length tolerance is a layout question, not a token one</h3>
        <p>
          German runs longer than English and Finnish longer again, but no token absorbs that. The
          <code>--container-*</code> scale caps a reading measure; it does not stop a label from wrapping to a second
          line. Size controls from their content and let the token set the rhythm around them.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the four dark severity
            tokens resolve and <code>--input-focus-ring</code> is gone (the "do not work" table became a note), the
            fallback example no longer names a real token, and print in dark mode is the <code>ThemeService</code>
            light switch with the media block as fallback.
          </li>
          <li>
            <strong>v0.7</strong> — 2026-09-23 — Brought to the visual styles and the gated widget layer: layer 2 is the
            default style's first-paint copy (held equal by the contrast gate), layer 3 is built from the style delta and
            the accent ramp (dark from <code>primaryFgDark</code>) with a new tiers table, layer 4 is the style × accent ×
            mode map; <code>--text-color</code> values, the redeclaration counts, and the gate paragraph (zero exceptions,
            widget pairs included) updated; the false note that the runtime rewrites <code>--success-color</code> removed.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). The v0.5 layer-3 mechanic is
            false again: Optimus ships Aura <em>2.x</em>, whose base preset has
            <code>colorScheme.light</code> / <code>colorScheme.dark</code> blocks and not a single
            <code>light-dark()</code> token, so the engine emits a second dark token block under
            <code>darkModeSelector</code> — the design tab and the layer table now say that, and the override advice
            flips from &#8220;supply your own <code>light-dark()</code> pair&#8221; to &#8220;pair it with a
            <code>.dark-theme</code> rule&#8221;. Kit layers 1, 2, and 4 are untouched; the 32 <code>--p-*</code> names
            re-declared in <code>styles.scss</code> re-counted unchanged.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-08-23 — Re-verified against &#64;openng/optimus-ui-themes&#64;3.0.0 (PrimeNG 22). Layer
            3 changed mechanism: color tokens are now single <code>light-dark(light, dark)</code> values on
            <code>:root, :host</code>, flipped by an injected <code>color-scheme</code> declaration rather than a second
            dark token block — measured in the running app and documented in the design tab, with the two consequences
            for overrides and <code>getComputedStyle</code>. Kit layers 1, 2, and 4 are untouched; the 194 measured pairs
            re-ran with a zero diff.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-08-19 — The foundations token decisions landed:
            <code>--control-border</code> exists for control edges (3:1 on every ground, both themes) and
            <code>--surface-border</code> is decoration only; <code>--text-color-secondary</code> re-shaded to
            <code>#6b7280</code>. The exception count in the gate paragraph moved from nine to one.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-18 — From the a11y-guidelines review: the logical-properties paragraph
            promised that the same token &ldquo;works unchanged under a right-to-left script&rdquo;, which reads as a
            capability the kit does not have. Direction-neutral tokens remove one obstacle; nothing writes
            <code>dir</code> and no <code>rtl</code> rule ships, and the sentence now says so.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-18 — Corpus-consistency pass. The i18n tab claimed the page loads the Noto
            Sans variants and that the named scripts therefore render deterministically; it loads none, so the paragraph
            now reads them as a fallback request with its provenance beside it.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-08-18 — Initial guide: the four token layers and their cascade, the fallback
            contract and the empty-token trap, override recipes, the runtime derivation and its clamp, contrast
            governance, and the canonical agent doc.
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

      /* --- Live inspector --- */
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
      .sw {
        display: inline-block;
        width: 2.5rem;
        height: 1.1rem;
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-sm);
        vertical-align: middle;
      }

      /* --- Scoped-override demo --- */
      .demo2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
        margin: 0 0 var(--space-4);
      }
      .panel {
        background: var(--surface-card);
        color: var(--text-color);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
      }
      .panel p {
        margin: 0.4rem 0 0;
        font-size: var(--font-size-sm);
      }
      .panel--tinted {
        --surface-card: #2d1b4e;
        --text-color: #ede9fe;
      }
      @media (max-width: 640px) {
        .demo2 {
          grid-template-columns: 1fr;
        }
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
      .dd__code {
        font-family: var(--font-mono);
        font-size: 0.8rem;
      }
      .mini {
        display: inline-flex;
        align-items: center;
        padding: var(--space-3) var(--space-4);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        font-size: var(--font-size-sm);
        background: var(--surface-card);
        color: var(--text-color);
      }
      .mini--hard {
        background: #ffffff;
        color: #1e293b;
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
export class DesignTokensArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  /** The role tokens the live inspector resolves, in the order it lists them. */
  private readonly inspected = [
    '--surface-ground',
    '--surface-card',
    '--surface-section',
    '--surface-border',
    '--text-color',
    '--text-color-secondary',
    '--primary-bg',
    '--primary-fg',
    '--accent-surface',
    '--accent-on-surface',
  ];

  readonly liveTokens = signal<{ name: string; value: string }[]>([]);
  readonly inspectorState = signal('Not read yet.');

  constructor() {
    afterNextRender(() => this.readTokens());
  }

  /** Resolve each inspected token off the document element, in the current theme. */
  readTokens(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.document.documentElement;
    const view = this.document.defaultView;
    if (!view) return;
    const styles = view.getComputedStyle(root);
    this.liveTokens.set(
      this.inspected.map((name) => ({
        name,
        value: styles.getPropertyValue(name).trim() || '(empty)',
      })),
    );
    const theme = root.classList.contains('dark-theme') ? 'dark' : 'light';
    this.inspectorState.set('Read ' + this.inspected.length + ' tokens in the ' + theme + ' theme.');
  }

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly scopeSnippet = `/* Override two tokens for one subtree. Everything inside the
   element keeps reading the same names and picks up the new values. */
.panel--tinted {
  --surface-card: #2d1b4e;
  --text-color: #ede9fe;
}

/* The panel rule itself never changes — it only ever reads roles. */
.panel {
  background: var(--surface-card);
  color: var(--text-color);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}`;

  readonly fallbackSnippet = `/* Undefined token -> the fallback is used. */
color: var(--not-defined-anywhere, #495057);   /* renders #495057 */

/* Token defined as EMPTY -> the fallback is NOT used. The substitution
   produces nothing, the declaration is invalid at computed-value time,
   and the property is left unset. */
color: var(--defined-but-empty, red);          /* no color */

/* The cascade is not a defense. At equal specificity the LAST declaration
   wins, so a literal written after the var() does not "rescue" it — it
   replaces it, and duplicates the value the token exists to own. Nor does
   an invalid substitution fall back to the PREVIOUS declaration: the
   property computes to its inherited value, or to its initial value if it
   does not inherit.

   var(--token, fallback) covers a MISSING token. Against an EMPTY one
   there is no defense in the consuming rule — fix the declaration at its
   source, in styles.scss or design-tokens.scss. */`;

  readonly addTokenSnippet = `/* styles.scss — add the token to BOTH blocks, even when the
   two values are the same today. */
:root {
  --callout-surface: #fff7ed;
  --callout-border: #c2410c;
}

.dark-theme {
  --callout-surface: #3b220e;
  --callout-border: #fdba74;
}

/* Then run the contrast gate in the same commit if the token is used
   for text or for a control edge:
   node scripts/check-contrast.mjs --write */`;

  readonly runtimeSnippet = `/* Does NOT work: the runtime layer writes this token as inline
   style on the root element, and inline style beats any selector. */
:root {
  --primary-fg: #7c3aed;
}

/* Works: you are no longer competing with the root's inline style,
   because this element is further down the tree. */
.brand-scope {
  --primary-fg: #7c3aed;
}`;
}
