import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerModule } from '@openng/optimus-ui/divider';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, DividerModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-divider-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-divider-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-divider-article .stage--row {
        display: flex;
        align-items: stretch;
        gap: 0.25rem;
      }

      app-divider-article .stage p {
        margin: 0;
      }

      app-divider-article .chip {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      app-divider-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-divider-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-divider-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-divider-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-divider-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-divider-article .dd__h {
        margin: 0;
        font-size: 0.95rem;
      }

      app-divider-article .dd__body {
        margin: 0;
        font-size: 0.9rem;
      }

      app-divider-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-divider-article .probe--block span {
        display: block;
      }

      app-divider-article .probe--row {
        display: flex;
        align-items: stretch;
        gap: 0.25rem;
      }

      app-divider-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-divider-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-divider-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-divider-article .sources a {
        color: var(--primary-color-fg);
      }

      app-divider-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-divider-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Divider (Guides, category `library`).
 *
 * Subject: `p-divider` — a one-pixel rule drawn by a pseudo-element on a host
 * that always carries `role="separator"`. Everything the article claims comes
 * from the shipped source of Optimus UI 2.0.2 unless a line says otherwise.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-divider.mjs unless noted):
 *   - Host: static `role="separator"` (decorator :126), `[attr.aria-orientation]`
 *     (:125), `[class]` (:127), `[style]="sx('root')"` (:128), `[attr.data-p]`
 *     (:129). The compiled ngcmp at :105 makes the split explicit: role sits in
 *     `host.attributes`, the four bindings in `host.properties` — that is the
 *     citation the shipped text uses for "static attribute, never a binding".
 *   - Template is a single `div.p-divider-content` around `<ng-content>`
 *     (:117-121) — the projected content sits INSIDE the separator element.
 *   - Own inputs (:134-142): styleClass (deprecated since v20.0.0, :77),
 *     layout (default 'horizontal', :85), type (default 'solid', :90),
 *     align (no default, :95).
 *   - dt / unstyled / pt / ptOptions arrive by inheritance from BaseComponent
 *     (openng-optimus-ui-basecomponent.mjs:42-63) and are absent from the ngcmp
 *     input list at :105.
 *   - The root class list is string concatenation (:17-30): 'p-divider-' +
 *     layout and 'p-divider-' + type, so an undefined binding emits a class no
 *     rule matches.
 *   - Align is applied as inline flex alignment (:11-16) and is layout-specific.
 *   - CSS from @openng/optimus-ui-styles/dist/divider/index.mjs — one template
 *     literal in a dist bundle, cited by selector rather than by line. No media
 *     rule exists in it.
 *   - Tokens from @openng/optimus-ui-themes/dist/aura/divider/index.mjs;
 *     {content.border.color} resolves to {surface.200} light / {surface.700}
 *     dark in @openng/optimus-ui-themes/dist/aura/base/index.mjs.
 *   - ThemeService merges each visual style's presetOverrides (radii, button)
 *     and the accent ramp onto Aura; none touches a divider or content token,
 *     so the line stays stock {content.border.color}. CONTRAST.MD has no
 *     divider group; its informational progressbar.background rows measure the
 *     same color (the slider track takes --control-border).
 *   - Presentational children of role=separator: WAI-ARIA 1.2, role separator.
 *   - Percentage min-height against an auto-height containing block: CSS 2.1 10.7.
 */
@Component({
  selector: 'app-divider-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'divider'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A divider is one pixel of border on a pseudo-element. What makes it worth a guide is not the line but the
          element under it: the host always announces itself as a separator, and anything you project lands inside that
          separator.
        </p>

        <h3>The three border styles, horizontal</h3>
        <div class="stage stage--block">
          <p>Above the solid rule.</p>
          <p-divider />
          <p>Between solid and dashed.</p>
          <p-divider type="dashed" />
          <p>Between dashed and dotted.</p>
          <p-divider type="dotted" />
          <p>Below the dotted rule.</p>
        </div>
        <p class="src-note">
          Three live instances of <code>p-divider</code> from <code>&#64;openng/optimus-ui/divider</code>. The style is
          set by combined selectors — <code>.p-divider-dashed.p-divider-horizontal:before</code> and its siblings in
          <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code>.
        </p>

        <h3>Content in the line, and where it sits</h3>
        <div class="stage stage--block">
          <p-divider align="left"><span class="chip">left</span></p-divider>
          <p-divider align="center"><span class="chip">center</span></p-divider>
          <p-divider align="right"><span class="chip">right</span></p-divider>
        </div>
        <p class="src-note">
          <code>align</code> is not a class alone: it is written as inline <code>justify-content</code> for a horizontal
          divider and <code>align-items</code> for a vertical one
          (<code>openng-optimus-ui-divider.mjs:11-16</code>). The values are layout-specific —
          <code>left/center/right</code> horizontal, <code>top/center/bottom</code> vertical. Omitting
          <code>align</code> is not the same as <code>left</code>: the inline alignment falls to
          <code>center</code> (<code>:13</code>), while the class list still carries
          <code>p-divider-left</code> (<code>:22</code>).
        </p>

        <h3>Vertical, inside a flex row</h3>
        <div class="stage stage--row">
          <span>Draft</span>
          <p-divider layout="vertical" />
          <span>In review</span>
          <p-divider layout="vertical" type="dotted" />
          <span>Published</span>
        </div>
        <p class="src-note">
          The vertical rule has no intrinsic height: <code>.p-divider-vertical</code> sets
          <code>min-height: 100%</code> and its <code>:before</code> sets <code>height: 100%</code>. The stage above is
          a flex row with <code>align-items: stretch</code>, which sets the divider's used cross size — and the
          <code>:before</code>, positioned against the divider itself, takes its 100% from that box.
        </p>

        <h3>What the component renders</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Host bindings from <code>openng-optimus-ui-divider.mjs:124-130</code>, template from <code>:117-121</code>.
          The compiled component at <code>:105</code> keeps <code>role</code> in <code>host.attributes</code> and the
          four bindings in <code>host.properties</code> — a static attribute, not a binding — and the projected
          content is a child of the element carrying it.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which boundary</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>What you are separating</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Two runs of content inside one region, no new topic</td>
                <td><code>p-divider</code></td>
                <td>{{ m.whenDivider }}</td>
              </tr>
              <tr>
                <td>A new topic with a name</td>
                <td>heading + <code>section</code></td>
                <td>{{ m.whenSection }}</td>
              </tr>
              <tr>
                <td>A named group of form controls</td>
                <td><code>fieldset</code> / <code>legend</code></td>
                <td>{{ m.whenFieldset }}</td>
              </tr>
              <tr>
                <td>Items of one list</td>
                <td>list markup + CSS border</td>
                <td>{{ m.whenList }}</td>
              </tr>
              <tr>
                <td>Nothing — you want air</td>
                <td>margin token</td>
                <td>{{ m.whenSpacing }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The distinction is what the element says, not what it draws: the divider host carries
          <code>role="separator"</code> unconditionally (<code>openng-optimus-ui-divider.mjs:105</code>), so every one
          of them is a boundary announced to assistive technology whether or not you meant one.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — let the divider carry the section name</span>
            <div class="dd__stage">
              <p-divider align="left"><span class="chip">Billing</span></p-divider>
              <p class="dd__body">Card ending 4242</p>
            </div>
            <p class="dd__why">{{ m.contentNameWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a real heading, the rule decorative</span>
            <div class="dd__stage">
              <h4 class="dd__h">Billing</h4>
              <p-divider />
              <p class="dd__body">Card ending 4242</p>
            </div>
            <p class="dd__why">{{ m.headingWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Both examples are live. The projected span in the left cell is a child of the element with
          <code>role="separator"</code> (template at <code>openng-optimus-ui-divider.mjs:117-121</code>), and WAI-ARIA
          1.2 declares that role's children presentational.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a vertical divider in a block parent</span>
            <div class="dd__stage">
              <div class="probe probe--block">
                <span>Draft</span>
                <p-divider layout="vertical" />
                <span>Published</span>
              </div>
            </div>
            <p class="dd__why">{{ m.verticalBlockWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a stretching flex row</span>
            <div class="dd__stage">
              <div class="probe probe--row">
                <span>Draft</span>
                <p-divider layout="vertical" />
                <span>Published</span>
              </div>
            </div>
            <p class="dd__why">{{ m.verticalFlexWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Rules from <code>.p-divider-vertical</code> and <code>.p-divider-vertical:before</code> in
          <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code>; the resolution of a percentage
          <code>min-height</code> against an auto-height containing block is CSS 2.1, section 10.7.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#separator" target="_blank" rel="noopener noreferrer"
              >W3C — WAI-ARIA 1.2, role separator</a
            >
            — the definition behind "unnamed thematic break" and the presentational-children characteristic.
          </li>
          <li>
            <a href="https://www.w3.org/TR/CSS21/visudet.html#min-max-heights" target="_blank" rel="noopener noreferrer"
              >W3C — CSS 2.1, section 10.7</a
            >
            — why a percentage <code>min-height</code> leaves a vertical divider without height in a block parent.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — the 3:1 a rule owes once it alone carries a distinction.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Divider token</th><th>Aura value</th><th>Resolution, and what it does</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>divider.border.color</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td>{{ m.tokenBorder }}</td>
              </tr>
              <tr>
                <td><code>divider.content.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td>{{ m.tokenContentBg }}</td>
              </tr>
              <tr>
                <td><code>divider.content.color</code></td>
                <td><code>&#123;text.color&#125;</code></td>
                <td>{{ m.tokenContentFg }}</td>
              </tr>
              <tr>
                <td><code>divider.horizontal.margin</code></td>
                <td><code>1rem 0</code></td>
                <td>{{ m.tokenHMargin }}</td>
              </tr>
              <tr>
                <td><code>divider.horizontal.padding</code></td>
                <td><code>0 1rem</code></td>
                <td>{{ m.tokenHPadding }}</td>
              </tr>
              <tr>
                <td><code>divider.vertical.margin</code></td>
                <td><code>0 1rem</code></td>
                <td>{{ m.tokenVMargin }}</td>
              </tr>
              <tr>
                <td><code>divider.vertical.padding</code></td>
                <td><code>0.5rem 0</code></td>
                <td>{{ m.tokenVPadding }}</td>
              </tr>
              <tr>
                <td><code>divider.horizontal.content.padding</code></td>
                <td><code>0 0.5rem</code></td>
                <td>{{ m.tokenHContentPadding }}</td>
              </tr>
              <tr>
                <td><code>divider.vertical.content.padding</code></td>
                <td><code>0.5rem 0</code></td>
                <td>{{ m.tokenVContentPadding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/divider/index.mjs</code>; the semantic resolutions
          of <code>&#123;content.border.color&#125;</code>, <code>&#123;content.background&#125;</code> and
          <code>&#123;text.color&#125;</code> from
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>, light and dark. The rule is always
          <code>1px</code> — the width is written into the stylesheet, not exposed as a token.
        </p>

        <h3>Contrast: which criterion applies</h3>
        <p>{{ m.contrastPara }}</p>
        <p class="src-note">
          The line is stock <code>&#123;content.border.color&#125;</code>: the visual styles change only radii and the
          button (<code>presetOverrides</code> in <code>src/app/services/ui-styles.ts</code>).
          <code>docs/generated/CONTRAST.MD</code> has no divider group; its informational
          <code>progressbar.background</code> rows (group "progressbar &amp; slider", no criterion, every style and
          mode) measure the same color on
          <code>--surface-ground</code> and <code>--surface-card</code>. The quoted sentence is the comment above the
          <code>--control-border</code> declaration in <code>src/styles.scss</code>.
        </p>

        <h3>Narrow viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code> contains no media query and no container
          query; the margins and paddings above are fixed <code>rem</code> values from the Aura preset.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Values</th><th>Default</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>layout</code></td>
                <td><code>horizontal</code> · <code>vertical</code></td>
                <td><code>horizontal</code></td>
                <td>{{ m.apiLayout }}</td>
              </tr>
              <tr>
                <td><code>type</code></td>
                <td><code>solid</code> · <code>dashed</code> · <code>dotted</code></td>
                <td><code>solid</code></td>
                <td>{{ m.apiType }}</td>
              </tr>
              <tr>
                <td><code>align</code></td>
                <td><code>left/center/right</code> · <code>top/center/bottom</code></td>
                <td>—</td>
                <td>{{ m.apiAlign }}</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td>—</td>
                <td>{{ m.apiStyleClass }}</td>
              </tr>
              <tr>
                <td><code>dt</code></td>
                <td>token object</td>
                <td>—</td>
                <td>{{ m.apiDt }}</td>
              </tr>
              <tr>
                <td><code>unstyled</code></td>
                <td>boolean</td>
                <td>—</td>
                <td>{{ m.apiUnstyled }}</td>
              </tr>
              <tr>
                <td><code>pt</code> / <code>ptOptions</code></td>
                <td><code>host</code> · <code>root</code> · <code>content</code></td>
                <td>—</td>
                <td>{{ m.apiPt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The first four are declared on the component (<code>openng-optimus-ui-divider.mjs:134-142</code>). The last
          four are signal inputs inherited from <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:42-63</code>) and do not appear in the component's own compiled
          input list at <code>openng-optimus-ui-divider.mjs:105</code> — walk the inheritance chain before calling an
          Optimus API table complete. The three <code>pt</code> sections are the ones the component actually asks for:
          <code>ptms(['host', 'root'])</code> onto the host in <code>onAfterViewChecked</code> (<code>:73</code>) and
          <code>ptm('content')</code> on the inner div (<code>:106</code>). There are no outputs.
        </p>

        <h3>The undefined class trap</h3>
        <pre class="code-block"><code>{{ undefinedSnippet }}</code></pre>
        <p class="src-note">
          The root class list is built by string concatenation — <code>'p-divider-' + instance.layout</code> and
          <code>'p-divider-' + instance.type</code> at <code>openng-optimus-ui-divider.mjs:17-30</code>. Every rule
          that gives the host a box or draws the line is keyed on the layout class, and the border styles need the
          type class beside it; only <code>.p-divider-content</code>, which paints the chip, stands on
          its own class.
        </p>

        <h3>Scoping tokens to one divider</h3>
        <pre class="code-block"><code>{{ dtSnippet }}</code></pre>
        <p class="src-note">
          <code>dt</code> is the inherited scoped-token input
          (<code>openng-optimus-ui-basecomponent.mjs:42</code>). The global preset is Aura plus the visual style's
          delta and the accent ramp (<code>src/app/services/theme.service.ts</code>), none of which touches a divider
          token, so a per-instance override is the intended way to depart from it.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkRole }}</li>
          <li>{{ m.checkText }}</li>
          <li>{{ m.checkVertical }}</li>
          <li>{{ m.checkBinding }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>What the library contributes</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          The component template (<code>openng-optimus-ui-divider.mjs:117-121</code>) contains no text node, and the
          component reads nothing from the Optimus translation configuration.
        </p>

        <h3>Writing direction</h3>
        <p>{{ m.i18nRtl }}</p>
        <p class="src-note">
          Logical properties (<code>inset-inline-start</code>, <code>border-inline-start</code>,
          <code>border-block-start</code>) and the
          <code>.p-divider-left:dir(rtl), .p-divider-right:dir(rtl)</code> rule, both in
          <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code>. That
          <code>p-divider-left</code> is also the default class comes from the class builder, whose condition is
          <code>!instance.align || instance.align === 'left'</code>
          (<code>openng-optimus-ui-divider.mjs:22</code>).
        </p>

        <h3>Your own label, if you insist on one</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The kit's ordinary pattern: <code>TranslationService.translate()</code> read inside a
          <code>computed</code>, so the computed depends on the service's translation-version signal and re-runs on a
          language switch. Nothing on this path touches the Optimus configuration.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the line color is cited from
            the informational <code>progressbar.background</code> rows (the slider track is <code>--control-border</code>
            now and no longer measures it).
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Contrast section cites the compilat rows that measure the line color;
            the "Aura unmodified" note corrected (style delta and accent ramp are merged at runtime, none touches the
            divider); annotated Sources close the Usage tab.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DividerArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    // usage — which boundary
    whenDivider:
      'A thematic break inside one region, where the break has no name. That is exactly what role="separator" means, and it is all a divider can say.',
    whenSection:
      'A named topic needs a name in the accessibility tree. A heading gives readers a landmark to navigate by; a rule gives them a pixel.',
    whenFieldset:
      'A group of controls needs a programmatic association between its name and its members. A separator draws a boundary without grouping anything.',
    whenList:
      'List markup already announces the item count and the item boundaries. A separator between rows adds a second, redundant boundary announcement per row.',
    whenSpacing:
      'A divider that carries no meaning still ships role="separator". If all you want is the 1rem of air, take the margin and leave the semantics out.',

    // usage — do/don't
    contentNameWhy:
      'WAI-ARIA 1.2 makes the children of role="separator" presentational, so a name projected into the line is not exposed as the content of that node: the section is left without a name in the accessibility tree, and out of reach of heading navigation.',
    headingWhy:
      'The heading names the section for every reader and every navigation mode; the rule beside it stays what it is, a decoration with no name to lose.',
    verticalBlockWhy:
      'A vertical divider has no intrinsic height: its rule sets min-height: 100% and the line sets height: 100%. A percentage min-height against an auto-height containing block resolves to zero (CSS 2.1, 10.7), which leaves the preset block padding — 0.5rem above and 0.5rem below — and a line no taller than that.',
    verticalFlexWhy:
      'Stretch does not make the percentage min-height resolve; it sets the item\'s used cross size outright. That gives the divider box a height, and the line — an absolutely positioned :before whose containing block is the divider itself — takes its 100% from that box.',

    // design — token chain
    tokenBorder: '{surface.200} in light, {surface.700} in dark',
    tokenContentBg: '{surface.0} in light, {surface.900} in dark — an opaque chip, whatever the divider sits on',
    tokenContentFg: '{text.color}, which is {surface.700} in light and {surface.0} in dark',
    tokenHMargin: '1rem above and below the rule, none inline',
    tokenHPadding: '1rem of inline padding, so a content chip never reaches the edge',
    tokenVMargin: '1rem left and right of the rule, none block',
    tokenVPadding: '0.5rem above and below — together the whole height of a vertical divider whose parent does not stretch it',
    tokenHContentPadding: '0.5rem of inline padding inside the chip, which is what breaks the line around it',
    tokenVContentPadding: '0.5rem of block padding inside the chip, the vertical counterpart',

    contrastPara:
      'A divider that only separates is decoration: it identifies no control and carries no text, so SC 1.4.11 (Non-text Contrast, 3:1) does not apply to it, and no other criterion does either. The criterion applies the moment the line becomes load-bearing — where the boundary is the only thing telling a reader that two blocks are different things, the rule is a meaningful graphic and owes 3:1 against its background. The divider line does not reach that: it paints {content.border.color}, and the contrast compilat lists that color (as the Aura progress track, progressbar.background) at 1.13:1 to 1.23:1 on the light grounds and 1.26:1 to 1.76:1 on the dark ones, across all four visual styles. The kit states the same intent for its own hairline: src/styles.scss gives control edges a higher-contrast --control-border, with the comment that SC 1.4.11 needs 3:1, "which the decorative --surface-border deliberately does not meet". Read that as the rule for dividers too: never let a hairline be the only carrier of a distinction.',

    narrow:
      'No intrinsic responsive behavior. A horizontal divider is width: 100% and follows its container at every viewport; a vertical one keeps its 1rem inline margins and never becomes horizontal, because the component stylesheet contains no media query and no container query. When a flex row wraps to a column under your own breakpoint, the vertical divider goes with it and collapses to its padding — switch layout yourself at the same breakpoint, or drop the divider and let the row gap carry the separation.',

    // development
    apiLayout: 'Also the value of aria-orientation on the host, bound straight through.',
    apiType: 'Border style only. Takes effect through a combined selector, so it needs a layout class beside it.',
    apiAlign:
      'Layout-specific: left/center/right are read for horizontal, top/center/bottom for vertical. Written as an inline justify-content or align-items. Unset it is not neutral — the inline alignment falls to center, while a horizontal divider is classed p-divider-left and a vertical one p-divider-center.',
    apiStyleClass: 'Deprecated since v20.0.0 — use class. It is merged into the host class list.',
    apiDt: 'Inherited. Design tokens scoped to this instance.',
    apiUnstyled: 'Inherited. Renders without the preset styles — the line goes with them.',
    apiPt: 'Inherited. Three sections take effect: host and root are merged and written onto the host element after every view check, content onto the inner div.',

    checkRole:
      'Ask whether you meant a separator at all. Every p-divider announces one; a purely decorative rule is better drawn as a border on the neighbor.',
    checkText:
      'Keep meaning out of the line. Anything projected sits inside the separator element, whose children are presentational.',
    checkVertical:
      'Give a vertical divider a stretching parent or an explicit height. Without one it is a little padding and no visible line.',
    checkBinding:
      'Never bind layout or type to a possibly-undefined value. The class name is concatenated from it, so undefined yields p-divider-undefined and no rule matches.',

    // i18n
    i18nLibrary:
      'Nothing. The divider has no text of its own, no label input, and no entry in the Optimus translation configuration. The only string it emits is aria-orientation, whose value is the layout keyword and is not user-visible. Everything readable in a divider is content you projected, and it is localized the way any other content in your template is.',
    i18nRtl:
      'The stylesheet is written in logical properties throughout, so the rule follows the writing mode with no work on your side. One rule is direction-aware beyond that: p-divider-left and p-divider-right reverse the flex direction under :dir(rtl), so "left" keeps meaning the start of the line rather than the physical left edge. Note which dividers that covers — a horizontal divider carries p-divider-left whenever align is left or unset, so the rule applies to the default divider as well, not only to the ones you aligned by hand. Nothing else in the component reads the direction.',
  };

  readonly anatomySnippet: string = '<!-- What <p-divider type="dashed" align="left">Billing</p-divider> renders. -->\n' +
    '<p-divider role="separator"\n' +
    '           aria-orientation="horizontal"\n' +
    '           class="p-divider p-component p-divider-horizontal p-divider-dashed p-divider-left"\n' +
    '           style="justify-content: flex-start"\n' +
    '           data-p="left horizontal dashed">\n' +
    '  <div class="p-divider-content">Billing</div>\n' +
    '</p-divider>\n' +
    '<!-- The line itself is the :before pseudo-element of the host. -->';

  readonly undefinedSnippet: string = '// The class name is concatenated from the raw input value.\n' +
    'orientation: "horizontal" | "vertical" | undefined = undefined;\n' +
    '\n' +
    '// <p-divider [layout]="orientation" /> emits class="... p-divider-undefined",\n' +
    '// and no rule in the stylesheet matches: no width, no margin, no line.\n' +
    '\n' +
    '// Keep the value total, and let the component apply its own default.\n' +
    'orientation: "horizontal" | "vertical" = "horizontal";';

  readonly dtSnippet: string = '<!-- Per-instance tokens; the app-wide preset stays untouched. -->\n' +
    '<p-divider [dt]="quietRule" />\n' +
    '\n' +
    '// quietRule, in the calling component class:\n' +
    'readonly quietRule = {\n' +
    '  borderColor: "{surface.300}",\n' +
    '  horizontal: { margin: "2rem 0" },\n' +
    '};';

  readonly i18nSnippet: string = '// A divider label is your content, so it follows the kit pattern:\n' +
    '// translate() inside a computed, which re-runs on a language switch.\n' +
    'private readonly i18n = inject(TranslationService);\n' +
    'readonly billingLabel = computed(() => this.i18n.translate("account.billing.title"));\n' +
    '\n' +
    '// Prefer it as a heading beside the rule rather than inside it:\n' +
    '//   an <h2> bound to billingLabel(), with <p-divider /> underneath.';
}
