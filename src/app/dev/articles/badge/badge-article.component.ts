import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BadgeModule } from '@openng/optimus-ui/badge';
import type { BadgeSeverity } from '@openng/optimus-ui/types/badge';
import { ButtonModule } from '@openng/optimus-ui/button';
import { OverlayBadgeModule } from '@openng/optimus-ui/overlaybadge';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Badge, pBadge, and Overlay Badge (Guides, category `library`).
 *
 * Three deliveries of one span. Everything the article claims was read off the
 * shipped sources of Optimus UI 2.0.2; `openng-optimus-ui-badge.mjs` (424 lines)
 * and `openng-optimus-ui-overlaybadge.mjs` (160 lines) below are the fesm2022
 * bundles of the same names.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - Badge template is `{{ value() }}` (openng-optimus-ui-badge.mjs:392); host element is the
 *     badge, class from cn(cx('root'), styleClass()) (:399), badgeDisabled maps
 *     to [style.display] (:400).
 *   - classes.root (:28-51): p-badge-circle at length 1 (:37), p-badge-dot when
 *     the value is empty (:38), -sm/-lg/-xl from size OR badgeSize (:39-41),
 *     one class per severity (:42-47).
 *   - The directive appends the span as the host's LAST CHILD (:262) and adds
 *     p-overlay-badge to the host (:261); activeElement redirects into the first
 *     child when the host is a custom element (:155-157). Its own inputs and the
 *     badgeDisabled alias are in the compiled declaration (:303); pBadge is the
 *     selector only (:308).
 *   - OverlayBadge renders div > ng-content + sibling p-badge (:103-106), which
 *     is why its badge never joins a name from content.
 *   - Dead input: OverlayBadge `size` is declared (:139, compiled list :102) and
 *     the template forwards only badgeSize (:105); its setter logs (:88). The
 *     directive's size setter logs unconditionally (openng-optimus-ui-badge.mjs:126).
 *   - Directive change path: onChanges destructures value, size, severity, disabled,
 *     badgeStyle, badgeStyleClass (:172) and calls setSizeClasses() only under
 *     `if (size)` (:182-184), so badgeSize is applied only while the span is built
 *     (:257 class from cx('root'), :259 setSizeClasses). setSizeClasses (:222-250)
 *     reads size only in the `else if (this.size && !this.badgeSize)` branch and
 *     touches p-badge-lg / p-badge-xl only, never p-badge-sm.
 *   - applyStyles ignores a badgeStyle that is not an object (:267).
 *   - applyStyles only adds (:266-275). dataP reflects size(), not badgeSize()
 *     (:376-384). setValue stringifies with String(value) (:219-220).
 *   - No aria attribute, no role, no Intl/toLocaleString, and no numeric cap in
 *     either bundle: grep over both files for aria|role|Intl|toLocale|99 returns
 *     nothing.
 *   - Inherited signal inputs dt/unstyled/pt/ptOptions come from BaseComponent
 *     (openng-optimus-ui-basecomponent.mjs:428, usesInheritance: true on all three) and appear
 *     in none of the three own input lists.
 *   - Geometry and colors from @openng/optimus-ui-themes/dist/aura/badge/index.mjs
 *     (single-line dist bundle, cited by export) and .../aura/overlaybadge/index.mjs;
 *     the rules that consume them from @openng/optimus-ui-styles/dist/badge/index.mjs
 *     (76 lines), which carries no media query and no max-width.
 *   - Severity fills: the `.p-badge` rule in src/styles.scss re-points
 *     success/info/warn/danger to the kit's semantic inks (--semantic-<hue>-fg:
 *     700 steps under white in light, 300 steps under the hue's 950 in dark);
 *     default, secondary and contrast keep Aura's pairs. Every text pair is gated
 *     in docs/generated/CONTRAST.MD, "badge" (5.02-20.17:1). A dot's edge against
 *     the page has no row.
 *   - Large-scale text under SC 1.4.3 starts at 18.66px bold; the largest badge
 *     step is xl at 1rem/700, so no size qualifies.
 */
@Component({
  selector: 'app-badge-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, BadgeModule, ButtonModule, OverlayBadgeModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'badge'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          One span, three ways to get it onto the page. The component stands where you put it, the directive posts it
          inside another element, and the wrapper hangs it over a block. They render the same badge — what differs is
          which element ends up owning the node, and that is what decides how the value is announced.
        </p>

        <h3>The three deliveries</h3>
        <div class="stage stage--row">
          <span class="lbl">component</span>
          <p-badge [value]="count()" severity="danger" />
          <span class="lbl">directive</span>
          <button type="button" class="plain" pBadge [value]="count()" severity="danger">Inbox</button>
          <span class="lbl">wrapper</span>
          <p-overlayBadge [value]="count()" severity="danger">
            <i class="pi pi-envelope" aria-hidden="true"></i>
          </p-overlayBadge>
          <p-button label="+1" size="small" severity="secondary" (onClick)="bump()" />
          <p-button label="Reset" size="small" severity="secondary" [text]="true" (onClick)="count.set('3')" />
        </div>
        <p class="src-note">
          All three render the same <code>.p-badge</code> element. The component is the badge
          (<code>openng-optimus-ui-badge.mjs:392</code>), the directive appends one as the host's last child
          (<code>:262</code>), and the wrapper renders one as a sibling of the content it projects
          (<code>openng-optimus-ui-overlaybadge.mjs:103-106</code>).
        </p>

        <h3>The elements each one emits</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          The directive also adds <code>p-overlay-badge</code> to the host it sits on
          (<code>openng-optimus-ui-badge.mjs:261</code>), which is the rule that positions the span over the corner;
          the wrapper's root <code>div</code> carries <code>p-overlaybadge</code> instead
          (<code>openng-optimus-ui-overlaybadge.mjs:29</code>). The two class names differ by a hyphen and belong to
          two different stylesheets.
        </p>

        <h3>Sizes and severities</h3>
        <div class="stage">
          <div class="matrix">
            @for (s of severities; track s) {
              <span class="matrix__cell"><span class="lbl">{{ s || 'default' }}</span><p-badge value="8" [severity]="s" /></span>
            }
          </div>
          <div class="matrix matrix--sizes">
            @for (z of sizes; track z) {
              <span class="matrix__cell"><span class="lbl">{{ z || 'default' }}</span><p-badge value="8" [badgeSize]="z" /></span>
            }
            <span class="matrix__cell"><span class="lbl">dot</span><p-badge severity="danger" /></span>
          </div>
        </div>
        <p class="src-note">
          Severity picks exactly one class (<code>openng-optimus-ui-badge.mjs:42-47</code>); an omitted severity is
          the primary palette. The dot on the right has no <code>value</code> at all, which is what selects
          <code>p-badge-dot</code> (<code>:38</code>).
        </p>

        <h3>Geometry per size</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>step</th><th>font-size</th><th>min-width / height</th><th>selected by</th></tr>
            </thead>
            <tbody>
              <tr><td>sm</td><td>{{ m.smFont }}</td><td>{{ m.smBox }}</td><td><code>badgeSize="small"</code></td></tr>
              <tr><td>root</td><td>{{ m.rootFont }}</td><td>{{ m.rootBox }}</td><td>nothing set</td></tr>
              <tr><td>lg</td><td>{{ m.lgFont }}</td><td>{{ m.lgBox }}</td><td><code>badgeSize="large"</code></td></tr>
              <tr><td>xl</td><td>{{ m.xlFont }}</td><td>{{ m.xlBox }}</td><td><code>badgeSize="xlarge"</code></td></tr>
              <tr><td>dot</td><td>—</td><td>{{ m.dotBox }}</td><td>empty <code>value</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/badge/index.mjs</code>, exports
          <code>root</code>, <code>sm</code>, <code>lg</code>, <code>xl</code> and <code>dot</code>; the font weight is
          <code>{{ m.rootWeight }}</code> at every step. The rules that read them are
          <code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:2-14</code> and <code>:16-22</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Pick the delivery by asking one question: does the number belong to the accessible name of the thing it sits
          on, or beside it? The directive answers "inside", the wrapper answers "beside", and the component leaves the
          answer to wherever you place it.
        </p>

        <h3>Which delivery, and what it costs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>form</th><th>where the node lands</th><th>effect on the host's name</th><th>reach for it when</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-badge</code></td>
                <td>where you write it</td>
                <td>none of its own — it inherits whatever the surrounding element does</td>
                <td>the badge sits in text flow next to the words that name it</td>
              </tr>
              <tr>
                <td><code>[pBadge]</code></td>
                <td>last child of the host</td>
                <td>joins a name computed from content</td>
                <td>the host is a control and you control its name explicitly</td>
              </tr>
              <tr>
                <td><code>p-overlayBadge</code></td>
                <td>sibling of the projected content, inside a wrapper <code>div</code></td>
                <td>none — it never enters the content's name</td>
                <td>the mark hangs over an avatar, icon, or image</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Placement read from <code>openng-optimus-ui-badge.mjs:262</code> and <code>:155-157</code> for the directive,
          <code>openng-optimus-ui-overlaybadge.mjs:103-106</code> for the wrapper. The name column follows from those
          placements plus HTML's name-from-content rule, not from a separate measurement.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a dot as the only carrier of the state</span>
            <div class="dd__stage">
              <p-overlayBadge severity="danger">
                <i class="pi pi-bell dd__icon" aria-hidden="true"></i>
              </p-overlayBadge>
            </div>
            <p class="dd__why">{{ m.ddDotBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the state in text, the badge as its picture</span>
            <div class="dd__stage">
              <p-overlayBadge value="3" severity="danger">
                <i class="pi pi-bell dd__icon" aria-hidden="true"></i>
              </p-overlayBadge>
              <span class="dd__caption">3 unread messages</span>
            </div>
            <p class="dd__why">{{ m.ddDotGood }}</p>
          </div>
        </div>
        <p class="src-note">
          An empty <code>value</code> selects <code>p-badge-dot</code> (<code>openng-optimus-ui-badge.mjs:38</code>),
          which is a sized, padding-free box (<code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:16-22</code>)
          holding no text node — the left stage therefore renders a mark with nothing behind it in the accessibility
          tree, while the right one has a text node in the badge and a sentence beside it.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — sizing an overlay badge with <code>size</code></span>
            <div class="dd__stage">
              <p-overlayBadge value="9" size="xlarge" severity="info">
                <span class="dd__box"></span>
              </p-overlayBadge>
            </div>
            <p class="dd__why">{{ m.ddSizeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — <code>badgeSize</code>, the input that is read</span>
            <div class="dd__stage">
              <p-overlayBadge value="9" badgeSize="xlarge" severity="info">
                <span class="dd__box"></span>
              </p-overlayBadge>
            </div>
            <p class="dd__why">{{ m.ddSizeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages bind the same value on the same component; only the input name differs. The wrapper's template
          forwards <code>badgeSize</code> and not <code>size</code> to the badge it renders
          (<code>openng-optimus-ui-overlaybadge.mjs:105</code>), although <code>size</code> is declared as an input
          (<code>:139</code>, compiled list <code>:102</code>) and its setter still prints the deprecation notice
          (<code>:88</code>).
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          The pattern the kit uses for a count on a control is the notification bell in
          <code>notification-bell.component.ts</code>: the number is put into the button's own
          <code>aria-label</code>, and the visible mark carries <code>aria-hidden="true"</code> so its text node is
          left out of the accessibility tree — the <code>aria-label</code> alone would not remove it.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          A badge is a colored box with a fixed height and a bold, small label. Everything about it — the two
          dimensions, the seven color pairs, the outline that separates the overlay variant from what it sits on —
          comes from the Aura preset, except four of the color pairs, which the kit repaints.
        </p>

        <h3>Severity color pairs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>severity</th><th>background (light / dark)</th><th>text (light / dark)</th></tr>
            </thead>
            <tbody>
              <tr><td>default</td><td>{{ m.svPrimaryBg }}</td><td>{{ m.svPrimaryFg }}</td></tr>
              <tr><td>secondary</td><td>{{ m.svSecondaryBg }}</td><td>{{ m.svSecondaryFg }}</td></tr>
              <tr><td>success</td><td>{{ m.svSuccessBg }}</td><td>{{ m.svSuccessFg }}</td></tr>
              <tr><td>info</td><td>{{ m.svInfoBg }}</td><td>{{ m.svInfoFg }}</td></tr>
              <tr><td>warn</td><td>{{ m.svWarnBg }}</td><td>{{ m.svWarnFg }}</td></tr>
              <tr><td>danger</td><td>{{ m.svDangerBg }}</td><td>{{ m.svDangerFg }}</td></tr>
              <tr><td>contrast</td><td>{{ m.svContrastBg }}</td><td>{{ m.svContrastFg }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura pairs from <code>&#64;openng/optimus-ui-themes/dist/aura/badge/index.mjs</code>, export
          <code>colorScheme</code>; the kit's from the <code>.p-badge</code> rule in <code>src/styles.scss</code>,
          which sets <code>--p-badge-&lt;severity&gt;-background</code> / <code>-color</code>. Aura's white on the
          <code>500</code> steps measured 2.28–3.76:1.
        </p>
        <p>
          Two of them move with the kit theme. The default badge is <code>&#123;primary.color&#125;</code>, which the
          kit replaces with the reader's accent ramp at runtime, so its color follows the accent picker. And the
          radius is <code>&#123;border.radius.md&#125;</code>, which each visual style sets — 0 in the default
          werkbund, 12px lernwerkstatt, 10px skizzenbuch, 2px blaupause — so a multi-character badge is a square-cornered
          box in werkbund; a one-character value (<code>p-badge-circle</code>) and the dot stay round at 50% in every
          style. No visual style block in the kit stylesheet touches <code>.p-badge</code>; the one kit rule that does
          is the severity repaint above, the same in every style.
        </p>
        <p class="src-note">
          Accent ramp: the <code>semantic.primary</code> preset merged in <code>src/app/services/theme.service.ts</code>;
          radius scale: <code>presetOverrides.primitive.borderRadius</code> in <code>src/app/services/ui-styles.ts</code>;
          the 50% rules from <code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:16-27</code>.
        </p>

        <h3>Which criterion applies, and what the gate measures</h3>
        <p>
          <code>docs/generated/CONTRAST.MD</code> gates every badge text pair, group <code>badge</code>, in all four
          visual styles and both modes: the four kit severities 5.02–6.70:1 in light and 8.15–10.62:1 in dark, the
          default badge 5.18–17.85:1 across the accents, secondary 6.92–10.08:1, contrast 19.90–20.17:1 — lowest
          5.02:1 (success, light). The gate has no row for a dot's edge against whatever it sits on, which depends
          on the page. Which criterion each case owes:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>case</th><th>criterion</th><th>threshold</th><th>why</th></tr>
            </thead>
            <tbody>
              <tr><td>badge with a value, any size</td><td>SC 1.4.3</td><td>4.5:1</td><td>{{ m.crText }}</td></tr>
              <tr><td>dot badge that carries meaning</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crDot }}</td></tr>
              <tr><td>dot badge that repeats visible text</td><td>—</td><td>—</td><td>{{ m.crDecor }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Large-scale text under SC 1.4.3 begins at 18.66px bold. The largest step is
          <code>xl</code> at <code>{{ m.xlFont }}</code>, weight <code>{{ m.rootWeight }}</code>
          (<code>&#64;openng/optimus-ui-themes/dist/aura/badge/index.mjs</code>, exports <code>xl</code> and
          <code>root</code>), so the 3:1 relaxation is unavailable at every step — the consequence follows from those
          two numbers, it was not measured separately.
        </p>

        <h3>Positioning, and where the two overlay rules disagree</h3>
        <pre class="code-block"><code>{{ positionCssSnippet }}</code></pre>
        <p class="src-note">
          The directive's rule is injected from <code>openng-optimus-ui-badge.mjs:19-26</code>, the wrapper's from
          <code>openng-optimus-ui-overlaybadge.mjs:16-26</code>. The first uses the logical
          <code>inset-inline-end</code>, the second the physical <code>right</code> — so under
          <code>dir="rtl"</code> the directive's badge moves to the leading corner and the wrapper's stays on the
          right. Only the wrapper draws the outline, from
          <code>&#64;openng/optimus-ui-themes/dist/aura/overlaybadge/index.mjs</code>, export <code>root</code>:
          <code>{{ m.outline }}</code>. The <code>solid</code> is not in that export — it comes from the stylesheet
          (<code>openng-optimus-ui-overlaybadge.mjs:24</code>).
        </p>

        <h3>On a narrow screen</h3>
        <p>
          No intrinsic responsive behavior: the badge keeps a fixed height and a minimum width at every viewport, has
          no maximum width and no wrapping, and the stylesheet that styles it contains no media query — so a long
          value grows horizontally until something clips it. In the two overlay forms half the badge already sits
          outside its wrapper's box, so any ancestor with <code>overflow: hidden</code> cuts it. Layout guidance: cap
          the value yourself (a three-character maximum keeps every step inside its own box) and keep the overlay's
          ancestors free of overflow clipping.
        </p>
        <p class="src-note">
          Fixed <code>height</code> and <code>min-width</code> with no <code>max-width</code> and no wrapping in
          <code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:2-14</code>, a file that contains no
          <code>&#64;media</code> rule. The overhang is the <code>transform</code> in the two overlay rules quoted
          above.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Three input surfaces, and they are not the same surface with three names. The component takes signal inputs,
          the directive takes classic ones and writes to the DOM itself, and the wrapper re-declares a subset and
          forwards most of it. Each also accepts four inputs it does not declare.
        </p>

        <h3><code>p-badge</code> — the whole own API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th>type</th><th>read by</th><th>note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>value</code></td><td>string | number</td><td>template and class logic</td><td>empty selects the dot; one character selects the circle</td></tr>
              <tr><td><code>severity</code></td><td>six literals</td><td>class logic</td><td>omitted is the primary palette</td></tr>
              <tr><td><code>badgeSize</code></td><td>small | large | xlarge</td><td>class logic</td><td>the input to use</td></tr>
              <tr><td><code>size</code></td><td>small | large | xlarge</td><td>class logic and <code>data-p</code></td><td>works here, but see the two other surfaces</td></tr>
              <tr><td><code>badgeDisabled</code></td><td>boolean attribute</td><td>host style binding</td><td>sets <code>display: none</code>; the element stays in the DOM</td></tr>
              <tr><td><code>styleClass</code></td><td>string</td><td>host class binding</td><td>deprecated since v20 in favor of <code>class</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs and their readers from <code>openng-optimus-ui-badge.mjs:344-374</code> (declarations),
          <code>:28-51</code> (the class logic), <code>:392</code> (the template) and <code>:399-401</code> (the host
          bindings). <code>small</code> is accepted by the class logic (<code>:39</code>) although the doc comment on
          both size inputs names only large and xlarge.
        </p>

        <h3><code>[pBadge]</code> — ten inputs, and one that is not one</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th>behavior</th></tr>
            </thead>
            <tbody>
              <tr><td><code>value</code>, <code>severity</code></td><td>written onto the generated span on change</td></tr>
              <tr>
                <td><code>badgeSize</code></td>
                <td>
                  applied while the span is built (<code>openng-optimus-ui-badge.mjs:257</code>, <code>:259</code>); a
                  later change is not observed, because <code>onChanges</code> destructures
                  <code>value, size, severity, disabled, badgeStyle, badgeStyleClass</code> (<code>:172</code>) and
                  calls <code>setSizeClasses()</code> only under <code>if (size)</code> (<code>:182-184</code>)
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>
                  after creation it is read only while <code>badgeSize</code> is unset, and then only for
                  <code>large</code> and <code>xlarge</code> — <code>setSizeClasses</code> adds and removes
                  <code>p-badge-lg</code> and <code>p-badge-xl</code> and never <code>p-badge-sm</code>
                  (<code>:222-250</code>); a <code>small</code> reaches the span only from the class built at creation
                  (<code>:257</code>, class logic <code>:39</code>). It also logs a deprecation notice on every
                  assignment (<code>:126</code>)
                </td>
              </tr>
              <tr><td><code>badgeDisabled</code></td><td>alias of the class member <code>disabled</code>; removes the span, and re-creates it when cleared</td></tr>
              <tr><td><code>badgeStyle</code>, <code>badgeStyleClass</code></td><td>applied additively; nothing removes what a previous value set, and a <code>badgeStyle</code> that is not an object is dropped without warning (<code>:267</code>)</td></tr>
              <tr><td><code>pBadgePT</code>, <code>pBadgeUnstyled</code></td><td>pass-through and unstyled flags, read in constructor effects</td></tr>
              <tr><td><code>ptBadgeDirective</code></td><td>deprecated alias of <code>pBadgePT</code></td></tr>
              <tr><td><code>pBadge</code></td><td>not an input at all — the selector, so an assignment to it is inert</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared inputs and the <code>badgeDisabled</code> alias from
          <code>openng-optimus-ui-badge.mjs:303</code>; the selector from <code>:308</code>. The console notice is at
          <code>:126</code>, the additive appliers at <code>:266-275</code>, the disable path at <code>:288-301</code>.
        </p>

        <h3>The dead input, and the one that only half arrives</h3>
        <pre class="code-block"><code>{{ deadInputSnippet }}</code></pre>
        <p class="src-note">
          <code>p-overlayBadge</code> declares <code>size</code> (<code>openng-optimus-ui-overlaybadge.mjs:139</code>,
          compiled list <code>:102</code>) and forwards only <code>badgeSize</code> to the badge it renders
          (<code>:105</code>): the value is stored and read by nothing. Separately, the component's
          <code>data-p</code> attribute is built from <code>size()</code> and not from <code>badgeSize()</code>
          (<code>openng-optimus-ui-badge.mjs:376-384</code>), so a selector keyed on that attribute does not see a
          size set through the recommended input.
        </p>

        <h3>Four inputs none of the three declares</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>input</th><th>what it does</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pt</code></td><td>pass-through attributes per internal section</td></tr>
              <tr><td><code>ptOptions</code></td><td>how a <code>pt</code> object merges with the preset's own</td></tr>
              <tr><td><code>unstyled</code></td><td>renders without the preset's classes</td></tr>
              <tr><td><code>dt</code></td><td>design-token overrides scoped to this instance</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared once on <code>BaseComponent</code> (<code>openng-optimus-ui-basecomponent.mjs:428</code>) and
          inherited by all three, which is why none of them lists these in its own compiled inputs. Read the base
          class before calling any Optimus input table complete.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>The count exists somewhere assistive technology reaches — an accessible name, or a status region you own.</li>
          <li>A badge that duplicates that text is hidden from the accessibility tree rather than left to be read twice.</li>
          <li>No dot badge is the sole carrier of a state.</li>
          <li>Sizes are set with <code>badgeSize</code>; on <code>[pBadge]</code> that value is fixed at creation and never rebound.</li>
          <li>The value is capped and formatted before it is bound.</li>
          <li>The overlay forms have no overflow-clipping ancestor.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          The badge contributes nothing to translation: it has no library-supplied strings, no locale awareness, and no
          formatting of its own. Every decision about the number is made before the value is bound — which in this kit
          runs into a translation API that takes a key and nothing else.
        </p>

        <h3>What comes from where</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>string</th><th>source</th></tr>
            </thead>
            <tbody>
              <tr><td>the badge's own text</td><td>your <code>value</code>, stringified verbatim</td></tr>
              <tr><td>the cap ("99+", "9+")</td><td>yours; the library has none</td></tr>
              <tr><td>thousands separators, decimal marks</td><td>yours; the library never calls a locale API</td></tr>
              <tr><td>the sentence that gives the number meaning</td><td>a translation key of yours, on the host control or a status region</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Neither <code>openng-optimus-ui-badge.mjs</code> nor <code>openng-optimus-ui-overlaybadge.mjs</code>
          contains <code>Intl</code>, <code>toLocaleString</code> or any maximum; the directive's writer stringifies
          with <code>String()</code> (<code>openng-optimus-ui-badge.mjs:219-220</code>) and the component's template
          interpolates the raw value (<code>:392</code>).
        </p>

        <h3>A number inside a translated sentence</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate()</code> takes a key and no parameters, so the number is substituted
          after lookup and the placeholder has to live in the translation itself. The call belongs inside a
          <code>computed()</code> so the string is recomputed when the language changes; the reference wiring is
          <code>notification-bell.component.ts</code> together with its
          <code>notifications.json</code> module.
        </p>

        <h3>What this pattern does not solve</h3>
        <ul class="checklist">
          <li>{{ m.i18nPluralGap }}</li>
          <li>{{ m.i18nDigitGap }}</li>
          <li>{{ m.i18nWidthGap }}</li>
        </ul>
        <p class="src-note">
          The first two are properties of a single-form string replacement rather than of the badge; the third follows
          from the fixed geometry quoted in Design. None of the three is something the library offers a setting for.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: success, info, warn, and
            danger badges on the kit semantic inks; every text pair now gated (CONTRAST.MD <code>badge</code>, lowest
            5.02:1), quoted in Design.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            all line refs hold; the design tab and the doc now say which values move with the kit theme (the default
            badge follows the accent, the radius follows the style's <code>border.radius.md</code>) and which pairs to
            check first; the doc's SC 4.1.3 link corrected; the directive demo button draws its edge with
            <code>--control-border</code>.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-badge-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-badge-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-badge-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.9rem;
      }

      app-badge-article .lbl {
        font-size: 0.72rem;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        color: var(--text-color-secondary);
      }

      app-badge-article button.plain {
        font: inherit;
        color: inherit;
        background: var(--surface-section);
        border: 1px solid var(--control-border);
        padding: 0.35rem 0.7rem;
        cursor: pointer;
      }

      app-badge-article .matrix {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      app-badge-article .matrix--sizes {
        margin-top: 1rem;
        align-items: center;
      }

      app-badge-article .matrix__cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.35rem;
      }

      app-badge-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-badge-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-badge-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-badge-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-badge-article .dd__stage {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-badge-article .dd__icon {
        font-size: 1.5rem;
      }

      app-badge-article .dd__box {
        display: inline-block;
        width: 2.5rem;
        height: 2.5rem;
        background: var(--surface-border);
      }

      app-badge-article .dd__caption {
        font-size: 0.85rem;
      }

      app-badge-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-badge-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-badge-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-badge-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-badge-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-badge-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BadgeArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly count = signal('3');
  readonly severities: (BadgeSeverity | null)[] = [null, 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'];
  readonly sizes: ('small' | 'large' | 'xlarge' | null)[] = ['small', null, 'large', 'xlarge'];

  bump(): void {
    const next = Number(this.count()) + 1;
    this.count.set(String(Number.isFinite(next) ? next : 1));
  }

  /** Flat measurement constants — substituted by the tab extractor. */
  readonly m = {
    rootFont: '0.75rem (12px)',
    rootBox: '1.5rem / 1.5rem',
    rootWeight: '700',
    smFont: '0.625rem (10px)',
    smBox: '1.25rem / 1.25rem',
    lgFont: '0.875rem (14px)',
    lgBox: '1.75rem / 1.75rem',
    xlFont: '1rem (16px)',
    xlBox: '2rem / 2rem',
    dotBox: '0.5rem / 0.5rem, padding 0',
    outline: 'width 2px, color {content.background}',

    svPrimaryBg: '{primary.color} / {primary.color}',
    svPrimaryFg: '{primary.contrast.color} / {primary.contrast.color}',
    svSecondaryBg: '{surface.100} / {surface.800}',
    svSecondaryFg: '{surface.600} / {surface.300}',
    svSuccessBg: 'kit --semantic-green-fg (green 700 / 300); Aura {green.500} / {green.400}',
    svSuccessFg: 'white / {green.950}',
    svInfoBg: 'kit --semantic-blue-fg (blue 700 / 300); Aura {sky.500} / {sky.400}',
    svInfoFg: 'white / {blue.950} (Aura {sky.950})',
    svWarnBg: 'kit --semantic-orange-fg (orange 700 / 300); Aura {orange.500} / {orange.400}',
    svWarnFg: 'white / {orange.950}',
    svDangerBg: 'kit --semantic-red-fg (red 700 / 300); Aura {red.500} / {red.400}',
    svDangerFg: 'white / {red.950}',
    svContrastBg: '{surface.950} / {surface.0}',
    svContrastFg: '{surface.0} / {surface.950}',

    crText:
      'The value is text. No size step reaches the large-scale threshold, so the 3:1 relaxation never applies.',
    crDot: 'A dot with no text is a graphic that conveys information, so its boundary against what it sits on counts.',
    crDecor:
      'A dot that only repeats a sentence next to it conveys nothing on its own and is decorative — hide it from the accessibility tree and the criterion falls away with it.',

    ddDotBad:
      'The dot renders no text node, so it is absent from the accessibility tree; a reader who does not see it is told nothing at all, and a reader who does see it is not told what it means.',
    ddDotGood:
      'The count is a text node in the badge and a sentence beside it, so the meaning survives without the picture and the picture is a shortcut rather than the message.',
    ddSizeBad:
      'The wrapper stores the value and forwards a different input to the badge, so the badge renders at its default step — the binding is silently inert.',
    ddSizeGood:
      'The same value on the input the template actually forwards, so the badge renders at the xlarge step.',

    i18nPluralGap:
      'Plural forms: a single stored string has one form, so a language that inflects around the number needs either one number-neutral phrasing or a key per form.',
    i18nDigitGap:
      'Digit shaping and grouping: the badge prints the characters it is given, so a locale that groups or uses different digits needs that done before binding.',
    i18nWidthGap:
      'Length: a translated sentence may grow, and the badge itself has a fixed height and no wrapping, so a long value widens rather than reflows.',
  };

  readonly emittedMarkupSnippet =
    '<!-- p-badge: the host element IS the badge -->\n' +
    '<p-badge class="p-badge p-component" data-p="...">3</p-badge>\n\n' +
    '<!-- [pBadge]: the span is appended as the host\'s last child -->\n' +
    '<button class="p-overlay-badge">Inbox<span id="pn_id_1_badge" class="p-badge p-component p-badge-circle">3</span></button>\n\n' +
    '<!-- p-overlayBadge: a wrapper div, the content, then the badge as a sibling -->\n' +
    '<p-overlaybadge><div class="p-overlaybadge"><i class="pi pi-envelope"></i><p-badge class="p-badge p-component p-badge-circle">3</p-badge></div></p-overlaybadge>';

  readonly usageSnippet =
    '// The badge never carries the meaning on its own.\n' +
    'readonly unread = signal(0);\n' +
    "readonly badgeText = computed(() => (this.unread() > 99 ? '99+' : String(this.unread())));\n\n" +
    '<!-- aria-label replaces the name; aria-hidden keeps the badge text out of the tree as well -->\n' +
    '<button type="button" [attr.aria-label]="bellLabel()">\n' +
    '  <i class="pi pi-bell" aria-hidden="true"></i>\n' +
    '  @if (unread() > 0) {\n' +
    '    <p-badge aria-hidden="true" [value]="badgeText()" severity="danger" badgeSize="small" />\n' +
    '  }\n' +
    '</button>\n\n' +
    '<!-- and, for a count that changes while the page is open -->\n' +
    '<span class="sr-only" aria-live="polite" aria-atomic="true">{{ liveAnnouncement() }}</span>';

  readonly deadInputSnippet =
    '// p-overlayBadge, own template: only badgeSize is forwarded\n' +
    '<p-badge [pt]="ptm(\'pcBadge\')" [styleClass]="styleClass" [style]="style"\n' +
    '         [badgeSize]="badgeSize" [severity]="severity" [value]="value"\n' +
    '         [badgeDisabled]="badgeDisabled" />\n\n' +
    '// so this renders at the default step, and logs a deprecation notice\n' +
    '<p-overlayBadge value="9" size="xlarge">...</p-overlayBadge>\n\n' +
    '// and this is the one that arrives\n' +
    '<p-overlayBadge value="9" badgeSize="xlarge">...</p-overlayBadge>';

  readonly positionCssSnippet =
    '/* injected by the directive, applied to the element pBadge sits on */\n' +
    '.p-overlay-badge > .p-badge { position: absolute; top: 0; inset-inline-end: 0;\n' +
    '                              transform: translate(50%, -50%); transform-origin: 100% 0;\n' +
    '                              margin: 0; }\n\n' +
    '/* the wrapper component, its own rule, its own class name */\n' +
    '.p-overlaybadge .p-badge { position: absolute; top: 0; right: 0;\n' +
    '                           transform: translate(50%, -50%); transform-origin: 100% 0;\n' +
    '                           margin: 0;\n' +
    "                           outline-width: dt('overlaybadge.outline.width');\n" +
    '                           outline-style: solid;\n' +
    "                           outline-color: dt('overlaybadge.outline.color'); }";

  readonly i18nSnippet =
    '// translate() takes a key and nothing else, so the placeholder lives in the string\n' +
    '// modules/en/notifications.json -> "labelWithCount": "Notifications, {count} unread"\n' +
    'readonly bellLabel = computed(() =>\n' +
    "  this.i18n.translate('notifications.bell.labelWithCount').replace('{count}', String(this.unread())),\n" +
    ');\n\n' +
    '// the badge shows the capped number; the label carries the sentence\n' +
    '<button [attr.aria-label]="bellLabel()"><p-badge [value]="badgeText()" /></button>';
}
