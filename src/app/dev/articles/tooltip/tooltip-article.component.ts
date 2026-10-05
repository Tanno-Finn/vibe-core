import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from '@openng/optimus-ui/button';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, TooltipModule, ButtonModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-tooltip-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-tooltip-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-tooltip-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }

      app-tooltip-article .icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 1px solid var(--control-border);
        border-radius: 6px;
        background: var(--surface-card);
        color: var(--text-color);
        cursor: pointer;
      }

      app-tooltip-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-tooltip-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-tooltip-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-tooltip-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-tooltip-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-tooltip-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-tooltip-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-tooltip-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-tooltip-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-tooltip-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-tooltip-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Tooltip (Guides, category `library`).
 *
 * Subject: `pTooltip` — an attribute directive, not a component wrapper. It
 * builds a detached node on show and deletes it on hide. Everything the article
 * claims comes from the shipped source of Optimus UI 2.0.2 unless a line says
 * otherwise.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-tooltip.mjs unless noted):
 *   - Directive, selector [pTooltip], extends BaseComponent (:57, :782, :787).
 *   - Input aliases: `content` is exposed as `pTooltip` (:831-833) and
 *     `disabled` as `tooltipDisabled` (:834-836) — the plain names do not bind.
 *   - tooltipEvent default 'hover' (:71, :171). Hover binds mouseenter, click,
 *     mouseleave, touchstart, touchend (:249-261); focus/blur are bound ONLY
 *     for 'focus' or 'both' (:262-271). Click on the trigger closes (:421-423).
 *     Both sets are bound once in onAfterViewInit (:245-274) and unbound only
 *     in onDestroy (:767-768), so tooltipEvent does not switch at runtime.
 *   - The container is built by createElement with a class and a
 *     data-pc-section marker and then gets role="tooltip" (:479); inline styles
 *     follow from create(), show(), alignTooltip() and the z-index
 *     registration. A grep for aria/describedby/title over the file returns
 *     nothing, and the id kept in _tooltipOptions (:186) is only ever set
 *     (:338) and never written to the DOM.
 *   - create() builds the node (:473-505), remove() deletes it (:734-750), so
 *     while hidden there is no node to reference.
 *   - escape default true (:91): text node (:558-561) vs innerHTML (:562-564).
 *   - autoHide default true (:121) sets pointer-events: none (:498-500); false
 *     unsets it and binds mouseleave on the container (:501-504, :378-381).
 *   - hideOnEscape default true (:131) binds document keydown.escape (:447-452),
 *     but onChanges writes no hideOnEscape key into _tooltipOptions (:276-341)
 *     while :447 reads getOption('hideOnEscape'), so the input is inert and
 *     only tooltipOptions (:341) can switch it off.
 *   - life auto-hides after its duration (:106, :441-446).
 *   - tooltipPosition default 'right' (:170); fallback order per position
 *     (:568-573), applied only while isOutOfBounds (:575-582, :673-681).
 *   - appendTo is a signal input (:164) whose $appendTo computed (:166) is read
 *     nowhere; create() reads getOption('appendTo'), default 'body' (:172, :488).
 *   - Window resize hides (:682-684), scroll hides (:697-706).
 *   - fitContent is read as this.fitContent in create() (:126, :495-497), not
 *     through the options bag.
 *   - Touch: touchstart activates (:386-393), touchend deactivates while
 *     autoHide is on (:394-398); with autoHide off a document touchstart
 *     outside closes it (:399-408).
 *   - dt/unstyled/pt/ptOptions are inherited signal inputs
 *     (openng-optimus-ui-basecomponent.mjs:42-63, declared at :428) and are
 *     absent from the directive's own compiled input list at :782.
 *   - tooltipZIndex default 'auto' (:175) registers on the shared overlay
 *     stack with base config.zIndex.tooltip = 1100
 *     (openng-optimus-ui-config.mjs:239); the value written is computed in
 *     openng-optimus-ui-utils.mjs:284-289, so 1100 is a base, not the result.
 *   - CSS from @openng/optimus-ui-styles/dist/tooltip/index.mjs (61 lines):
 *     max-width :5, gutter padding :10, white-space: pre-line :19,
 *     word-break: break-word :20. No media query, no container query.
 *   - Tokens from @openng/optimus-ui-themes/dist/aura/tooltip/index.mjs, a
 *     single-line dist bundle. Both its
 *     color schemes name {surface.700}/{surface.0}; surface.700 itself is
 *     slate.700 in light, zinc.700 in dark (aura/base/index.mjs).
 *   - docs/generated/CONTRAST.MD carries no tooltip row in any of its four
 *     visual-style blocks, so the Design tab names the criterion instead of
 *     quoting a neighboring ratio.
 *   - WCAG 2.2 SC 1.4.13 hoverable/dismissible/persistent, SC 1.4.3, and the
 *     WAI-ARIA 1.2 tooltip role are the standards side.
 */
@Component({
  selector: 'app-tooltip-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tooltip'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Tooltip is a directive, not a component: you put <code>pTooltip</code> on an element you already have, and
          the directive builds a detached node the moment the tooltip shows and deletes it again when it hides. That
          one design decision explains most of what follows — the node is never in your template, and nothing in the
          markup you wrote points at it.
        </p>

        <h3>The default: hover, to the right</h3>
        <div class="stage stage--row">
          <p-button label="Save" severity="secondary" pTooltip="Writes the draft to the server" />
          <p-button label="Right by default" severity="secondary" pTooltip="No tooltipPosition set" />
        </div>
        <p class="src-note">
          Two live instances. <code>tooltipPosition</code> defaults to <code>right</code>
          (<code>openng-optimus-ui-tooltip.mjs:170</code>) and <code>tooltipEvent</code> to <code>hover</code>
          (<code>:71</code>, <code>:171</code>).
        </p>

        <h3>Hover only, versus hover and focus</h3>
        <div class="stage stage--row">
          <p-button label="Hover only (default)" severity="secondary" pTooltip="Bound to the pointer, not to focus" />
          <p-button
            label="Hover and focus"
            severity="secondary"
            tooltipEvent="both"
            tooltipPosition="bottom"
            pTooltip="Bound to focus as well"
          />
        </div>
        <p class="src-note">
          The hover branch binds <code>mouseenter</code>, <code>click</code>, <code>mouseleave</code>,
          <code>touchstart</code> and <code>touchend</code> (<code>openng-optimus-ui-tooltip.mjs:249-261</code>);
          <code>focus</code> and <code>blur</code> are bound only when <code>tooltipEvent</code> is
          <code>focus</code> or <code>both</code> (<code>:262-271</code>). Verify with the keyboard alone: tab onto
          each of the two buttons and watch which one shows a bubble.
        </p>

        <h3>Position, and what happens at the edge</h3>
        <div class="stage stage--row">
          <p-button label="top" severity="secondary" tooltipPosition="top" pTooltip="Above the trigger" />
          <p-button label="bottom" severity="secondary" tooltipPosition="bottom" pTooltip="Below the trigger" />
          <p-button label="left" severity="secondary" tooltipPosition="left" pTooltip="Left of the trigger" />
          <p-button label="right" severity="secondary" tooltipPosition="right" pTooltip="Right of the trigger" />
        </div>
        <p class="src-note">
          Each position has a fallback chain — <code>top</code> tries top, bottom, right, left
          (<code>openng-optimus-ui-tooltip.mjs:568-573</code>). The next candidate is used only while the placed node
          is still outside the viewport (<code>:575-582</code>, bounds test at <code>:673-681</code>), and placement
          stops at the first candidate that fits.
        </p>

        <h3>Long text, and what the node looks like</h3>
        <div class="stage stage--row">
          <p-button
            label="A long hint"
            severity="secondary"
            tooltipPosition="bottom"
            pTooltip="Tooltips are capped at 12.5rem and wrap; they do not grow to fit a sentence this long."
          />
        </div>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Structure from <code>openng-optimus-ui-tooltip.mjs:473-505</code>: a root div classed by
          <code>preAlign</code> (<code>:668-672</code>), an arrow div, a text div. Beside the class and the
          <code>data-pc-section</code> markers the directive writes one attribute, <code>role="tooltip"</code>
          (<code>:479</code>). Every declaration in the <code>style</code> is written from JavaScript:
          <code>width</code> and <code>pointer-events</code> in <code>create()</code> (<code>:495-504</code>),
          <code>display</code> in <code>show()</code> (<code>:534</code>), <code>left</code> and <code>top</code>
          in <code>alignTooltip()</code> (<code>:652-657</code>), <code>opacity</code> raised from zero by the fade
          (<code>:537</code>) and <code>z-index</code> by the stack registration (<code>:538-539</code>) — the
          1102 above is what an empty stack yields, base plus two
          (<code>openng-optimus-ui-utils.mjs:284-289</code>). The text node holds the trigger's tooltip string,
          elided above, not its label. Width and wrapping from
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs:5</code> and <code>:19-20</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which explanation surface</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>What you have to say</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>The name of an icon-only control</td>
                <td><code>aria-label</code> plus <code>pTooltip</code></td>
                <td>{{ m.whenIconName }}</td>
              </tr>
              <tr>
                <td>A short restatement, nice to have, safe to miss</td>
                <td><code>pTooltip</code></td>
                <td>{{ m.whenHint }}</td>
              </tr>
              <tr>
                <td>Information the task cannot be completed without</td>
                <td>visible text</td>
                <td>{{ m.whenEssential }}</td>
              </tr>
              <tr>
                <td>One or two sentences of help beside a control</td>
                <td>a surface that opens on click or focus</td>
                <td>{{ m.whenHelp }}</td>
              </tr>
              <tr>
                <td>Anything with a link, a button, or a field inside</td>
                <td><code>p-popover</code></td>
                <td>{{ m.whenInteractive }}</td>
              </tr>
              <tr>
                <td>A validation message for a field</td>
                <td>inline message tied by <code>aria-describedby</code></td>
                <td>{{ m.whenError }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The dividing line is what reaches the accessibility tree: the tooltip node carries
          <code>role="tooltip"</code> and no association at all (<code>openng-optimus-ui-tooltip.mjs:479</code>), and
          it exists in the DOM only while shown (<code>:473-505</code> creates it, <code>:734-750</code> removes it).
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the tooltip as the button's only name</span>
            <div class="dd__stage">
              <button type="button" class="icon-btn" pTooltip="Delete" tooltipPosition="bottom">
                <i class="pi pi-trash" aria-hidden="true"></i>
              </button>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — an aria-label, with the tooltip beside it</span>
            <div class="dd__stage">
              <button
                type="button"
                class="icon-btn"
                aria-label="Delete"
                pTooltip="Delete"
                tooltipEvent="both"
                tooltipPosition="bottom"
              >
                <i class="pi pi-trash" aria-hidden="true"></i>
              </button>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both buttons are live and carry the same tooltip text; only the right one carries an
          <code>aria-label</code>. Nothing ties a tooltip node to its trigger: the directive writes
          <code>role="tooltip"</code> (<code>openng-optimus-ui-tooltip.mjs:479</code>) and no
          <code>aria-describedby</code>, no <code>id</code> and no <code>title</code> — none of the three occurs
          anywhere in the file. Verify in the browser's accessibility tree: the left button's name must come out
          empty.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a hint that cannot be read at leisure</span>
            <div class="dd__stage">
              <p-button
                label="Export"
                severity="secondary"
                pTooltip="CSV, semicolon separated, one row per learner, UTF-8 with BOM for spreadsheet imports."
              />
            </div>
            <p class="dd__why">{{ m.ddHoverBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — reachable, and it survives the trip</span>
            <div class="dd__stage">
              <p-button
                label="Export"
                severity="secondary"
                tooltipEvent="both"
                [autoHide]="false"
                tooltipPosition="bottom"
                pTooltip="Exports CSV. The format is described under the table."
              />
            </div>
            <p class="dd__why">{{ m.ddHoverGood }}</p>
          </div>
        </div>
        <p class="src-note">
          <code>autoHide</code> defaults to <code>true</code> and then sets
          <code>pointer-events: none</code> on the node (<code>openng-optimus-ui-tooltip.mjs:121</code>,
          <code>:498-500</code>); <code>false</code> unsets it and binds a <code>mouseleave</code> listener on the
          node itself (<code>:501-504</code>), while the trigger's leave handler treats a move onto the bubble as
          still inside (<code>:378-381</code>).
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          The two aliases are the ones that catch people out: <code>content</code> is exposed as
          <code>pTooltip</code> (<code>openng-optimus-ui-tooltip.mjs:831-833</code>) and <code>disabled</code> as
          <code>tooltipDisabled</code> (<code>:834-836</code>).
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Tooltip token</th><th>Aura value</th><th>What it does</th></tr>
            </thead>
            <tbody>
              <tr><td><code>tooltip.max.width</code></td><td><code>12.5rem</code></td><td>{{ m.tokMaxWidth }}</td></tr>
              <tr><td><code>tooltip.gutter</code></td><td><code>0.25rem</code></td><td>{{ m.tokGutter }}</td></tr>
              <tr>
                <td><code>tooltip.padding</code></td>
                <td><code>0.5rem 0.75rem</code></td>
                <td>{{ m.tokPadding }}</td>
              </tr>
              <tr>
                <td><code>tooltip.background</code></td>
                <td><code>&#123;surface.700&#125;</code></td>
                <td>{{ m.tokBackground }}</td>
              </tr>
              <tr>
                <td><code>tooltip.color</code></td>
                <td><code>&#123;surface.0&#125;</code></td>
                <td>{{ m.tokColor }}</td>
              </tr>
              <tr>
                <td><code>tooltip.shadow</code></td>
                <td><code>&#123;overlay.popover.shadow&#125;</code></td>
                <td>{{ m.tokShadow }}</td>
              </tr>
              <tr>
                <td><code>tooltip.border.radius</code></td>
                <td><code>&#123;overlay.popover.border.radius&#125;</code></td>
                <td>{{ m.tokRadius }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from the <code>root</code> and <code>colorScheme</code> exports of
          <code>&#64;openng/optimus-ui-themes/dist/aura/tooltip/index.mjs</code>, a single-line dist bundle. The
          rules that consume them are
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs:5</code>, <code>:10-16</code>,
          <code>:18-26</code> and the four arrow rules at <code>:36-60</code>, which draw the arrow out of the same
          gutter and background values. The per-style radius scale is
          <code>presetOverrides.primitive.borderRadius</code> in <code>src/app/services/ui-styles.ts</code>.
        </p>

        <h3>Contrast: which criterion applies</h3>
        <p>{{ m.contrastPara }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> carries no tooltip row in any of its four visual-style blocks
          (werkbund, lernwerkstatt, skizzenbuch, blaupause), in either mode: the compilat measures the kit's own
          tokens, and the bubble paints from the Aura preset. The hex values are the resolutions of
          <code>&#123;surface.700&#125;</code> and <code>&#123;surface.0&#125;</code> in the light and dark
          <code>colorScheme</code> blocks of <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>.
        </p>

        <h3>Narrow viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs</code> contains no media query and no container
          query; the cap is <code>max-width</code> at <code>:5</code> and the wrapping is
          <code>white-space: pre-line</code> and <code>word-break: break-word</code> at <code>:19-20</code>. The
          resize handler hides rather than re-places (<code>openng-optimus-ui-tooltip.mjs:682-684</code>), and the
          scroll handler does the same (<code>:697-706</code>).
        </p>

        <h3>Where it sits in the stack</h3>
        <p>{{ m.zIndex }}</p>
        <p class="src-note">
          <code>tooltipZIndex</code> defaults to <code>auto</code>
          (<code>openng-optimus-ui-tooltip.mjs:175</code>), which routes through
          <code>ZIndexUtils.set('tooltip', …, config.zIndex.tooltip)</code> (<code>:538-539</code>). The base value
          is <code>1100</code> in <code>openng-optimus-ui-config.mjs:239</code> — the same base as
          <code>modal</code> at <code>:236</code> — and the number actually written is derived from the last entry
          on the shared stack in <code>openng-optimus-ui-utils.mjs:284-289</code>. The directive also carries a
          special case for a trigger inside <code>p-dialog</code>, deferring display and placement
          (<code>:526-532</code>).
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
                <td><code>pTooltip</code></td>
                <td>string · TemplateRef</td>
                <td>—</td>
                <td>{{ m.apiContent }}</td>
              </tr>
              <tr>
                <td><code>tooltipPosition</code></td>
                <td><code>right</code> · <code>left</code> · <code>top</code> · <code>bottom</code></td>
                <td><code>right</code></td>
                <td>{{ m.apiPosition }}</td>
              </tr>
              <tr>
                <td><code>tooltipEvent</code></td>
                <td><code>hover</code> · <code>focus</code> · <code>both</code></td>
                <td><code>hover</code></td>
                <td>{{ m.apiEvent }}</td>
              </tr>
              <tr>
                <td><code>tooltipDisabled</code></td>
                <td>boolean</td>
                <td>—</td>
                <td>{{ m.apiDisabled }}</td>
              </tr>
              <tr>
                <td><code>autoHide</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiAutoHide }}</td>
              </tr>
              <tr>
                <td><code>hideOnEscape</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiEscapeKey }}</td>
              </tr>
              <tr>
                <td><code>escape</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiEscape }}</td>
              </tr>
              <tr>
                <td><code>showDelay</code> · <code>hideDelay</code> · <code>life</code></td>
                <td>number (ms)</td>
                <td>—</td>
                <td>{{ m.apiDelays }}</td>
              </tr>
              <tr>
                <td><code>showOnEllipsis</code></td>
                <td>boolean</td>
                <td><code>false</code></td>
                <td>{{ m.apiEllipsis }}</td>
              </tr>
              <tr>
                <td><code>fitContent</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiFitContent }}</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td><code>body</code> · <code>target</code> · element</td>
                <td><code>body</code></td>
                <td>{{ m.apiAppendTo }}</td>
              </tr>
              <tr>
                <td><code>positionTop</code> · <code>positionLeft</code></td>
                <td>number (px)</td>
                <td>—</td>
                <td>{{ m.apiOffsets }}</td>
              </tr>
              <tr>
                <td><code>tooltipStyleClass</code> · <code>tooltipZIndex</code> · <code>positionStyle</code></td>
                <td>string</td>
                <td><code>auto</code> for the z-index</td>
                <td>{{ m.apiStyling }}</td>
              </tr>
              <tr>
                <td><code>tooltipOptions</code></td>
                <td>options object</td>
                <td>—</td>
                <td>{{ m.apiOptions }}</td>
              </tr>
              <tr>
                <td><code>dt</code> · <code>unstyled</code> · <code>pt</code> · <code>ptOptions</code></td>
                <td>inherited signal inputs</td>
                <td>—</td>
                <td>{{ m.apiInherited }}</td>
              </tr>
              <tr>
                <td><code>pTooltipPT</code> · <code>pTooltipUnstyled</code> · <code>ptTooltip</code></td>
                <td>signal inputs</td>
                <td>—</td>
                <td>{{ m.apiDirectivePt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared inputs and their aliases from the compiled directive at
          <code>openng-optimus-ui-tooltip.mjs:782</code> and the decorator metadata at <code>:791-839</code>. The
          second-to-last row is in neither: <code>dt</code>, <code>unstyled</code>, <code>pt</code> and
          <code>ptOptions</code> are signal inputs inherited from <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:42-63</code>, declared at <code>:428</code>) — walk the
          inheritance chain before calling an Optimus API table complete. There are no outputs.
        </p>

        <h3>A disabled control is the classic disappearance</h3>
        <pre class="code-block"><code>{{ disabledSnippet }}</code></pre>
        <p class="src-note">
          Pointer listeners go on the directive's own host element,
          <code>this.el.nativeElement</code> (<code>openng-optimus-ui-tooltip.mjs:253-255</code>), while the focus
          listener goes on <code>querySelector('.p-component')</code> or, failing that, the host
          (<code>:265-268</code>, with the input-wrapper special case at <code>:665-667</code>). A disabled form
          control is not focusable, which settles the focus path in the first two variants. The pointer path is not
          settled by the library: whether a disabled control or its enabled wrapper still receives
          <code>mouseenter</code> is a browser question, which is why the third variant — an enabled, focusable host
          that is not the disabled control — is the one that does not depend on the answer.
        </p>

        <h3>The node you cannot reference</h3>
        <p>{{ m.nodeLifecycle }}</p>
        <p class="src-note">
          <code>create()</code> builds the node on every show (<code>openng-optimus-ui-tooltip.mjs:473-505</code>,
          called from <code>:524</code>) and <code>remove()</code> deletes it on hide (<code>:734-750</code>). The id
          held in the options bag (<code>:186</code>) is only ever written back into that bag
          (<code>:338-340</code>); a search for <code>aria</code>, <code>describedby</code> and <code>title</code>
          over the file returns nothing but the <code>role</code> at <code>:479</code>.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkKeyboard }}</li>
          <li>{{ m.checkTouch }}</li>
          <li>{{ m.checkEssential }}</li>
          <li>{{ m.checkEscapeHtml }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>What the library contributes</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          The directive renders whatever <code>pTooltip</code> resolves to
          (<code>openng-optimus-ui-tooltip.mjs:551-565</code>) and reads no translation key; the Optimus
          configuration object has no tooltip entry — the only <code>tooltip</code> member of
          <code>openng-optimus-ui-config.mjs</code> is <code>zIndex.tooltip</code> at <code>:239</code>.
        </p>

        <h3>The label is yours, so bind it reactively</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The kit pattern: <code>TranslationService.translate()</code> read inside a <code>computed</code>, so the
          computed depends on the service's translation-version signal and re-runs on a language switch. A tooltip
          bound to a plain field keeps the string it was born with. The reference implementation for the whole
          icon-button shape — accessible name and tooltip from the same key — is
          <code>src/app/components/frame/notification-bell.component.ts</code>.
        </p>

        <h3>Length, line breaks, and direction</h3>
        <p>{{ m.i18nLength }}</p>
        <p class="src-note">
          <code>white-space: pre-line</code> and <code>word-break: break-word</code> under the
          <code>12.5rem</code> cap, all three in
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs:5</code> and <code>:19-20</code>. Placement is
          computed from physical coordinates (<code>openng-optimus-ui-tooltip.mjs:598-658</code>) and the four
          position keywords are physical, not logical.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            all line refs hold; the token chain says the bubble grays are Aura's in every style and the radius is the
            style's <code>border.radius.md</code>; the agent doc trimmed under the size aim.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TooltipArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    // usage — which surface
    whenIconName:
      'The tooltip is a sighted pointer user\'s copy of a name the control must already have. It cannot be the name: nothing associates the tooltip node with its trigger, so an unlabeled icon button stays unlabeled.',
    whenHint:
      'A restatement or a keyboard shortcut is what the role is for. Losing it costs the reader nothing, which is the test for putting anything in a tooltip at all.',
    whenEssential:
      'A tooltip is not reachable by every reader and does not stay put on the reader\'s terms. Anything the task depends on belongs where it can be read, selected, and read again.',
    whenHelp:
      'One or two sentences need a surface that opens deliberately and stays open. A hover bubble that vanishes on the way to it is a worse version of the same idea.',
    whenInteractive:
      'The node is built outside your template, is not in the tab order, and by default has pointer-events: none. A control inside it is out of reach of both pointer and keyboard.',
    whenError:
      'A validation message must be announced with the field and survive a second reading. That is aria-describedby on a node that stays in the DOM — which the tooltip node is not.',

    // usage — do/don't
    ddNameBad:
      'The button has no text and no aria-label, so its accessible name is empty. The tooltip does not fill the gap: the node carries role="tooltip" and no id, and nothing on the button points at it. With the default hover-only binding a keyboard user never sees the bubble either, so the control is nameless in the tree and silent under the caret.',
    ddNameGood:
      'The name lives on the control, where every reader and every mode of navigation finds it; the tooltip repeats it for a sighted pointer user and, with tooltipEvent="both", for a sighted keyboard user. The icon is aria-hidden so the name is not announced twice.',
    ddHoverBad:
      'Three facts to hold in your head while the bubble is up. It is bound to hover only, it cannot be hovered itself because autoHide leaves pointer-events at none, and it goes the moment the pointer leaves the trigger.',
    ddHoverGood:
      'The hint is short and the detail lives in the page. tooltipEvent="both" gives keyboard focus the same bubble, and autoHide="false" makes the node hoverable — the hoverable half of WCAG 2.2 SC 1.4.13, which the defaults leave switched off.',

    // design
    tokMaxWidth: 'The hard cap on the bubble at every viewport. Text wraps inside it; the node never grows to fit a sentence.',
    tokGutter:
      'Two jobs at once: the gap between trigger and bubble, written as padding on the root, and the border width that draws the arrow.',
    tokPadding: 'Inner padding of the text node — 0.5rem block, 0.75rem inline.',
    tokBackground:
      'The tooltip preset names the same token in both color schemes, but the token itself differs: surface.700 is slate.700 (#334155) in light and zinc.700 (#3f3f46) in dark. Either way it is a dark gray the bubble paints itself, never the surface it sits on. The kit replaces only the primary ramp of the preset, so these grays are the same in every visual style.',
    tokColor: 'surface.0 is #ffffff in both color schemes, so the text is white on the dark bubble either way.',
    tokShadow: 'Shared with the popover overlay, so the two anchored surfaces lift off the page by the same amount.',
    tokRadius:
      'Also shared with the popover overlay, and the one value here that moves with the kit theme: it resolves to border.radius.md, which each visual style sets — 0 in werkbund, 12px in the default lernwerkstatt, 10px skizzenbuch, 2px blaupause (Aura stock 6px). No style block in the kit stylesheet touches .p-tooltip.',

    contrastPara:
      'The bubble renders text, so the criterion is SC 1.4.3 Contrast (Minimum), and at 4.5:1 rather than the large-scale 3:1, because the preset sets no font-size at all — the bubble inherits whatever size it lands in, and that is body text. The pair to hold to that is tooltip.color over tooltip.background — the node paints its own background and never inherits the surface behind it, so the pair to check is the same one in light and in dark mode even though surface.700 resolves to a different gray in each. No ratio is quoted here: the kit contrast compilat measures kit tokens, and both of these are Aura preset values, so naming the criterion is the honest half of the answer and citing a neighboring pair would be the dishonest one. The moment you re-tone the bubble with dt, that check becomes yours: overriding one of the two colors breaks a pairing the preset had settled.',

    narrow:
      'No intrinsic responsive behavior, and one hard cap. The bubble is max-width: 12.5rem at every viewport — it never widens on a desktop and never narrows on a phone. It wraps instead, honoring newlines in your string because the text node is white-space: pre-line, and breaking inside a long word rather than overflowing. There is no media query and no container query in the component stylesheet. Where a trigger sits close to a screen edge the placement chain tries the opposite side first and then the other axis: a top or bottom tooltip falls back to right and then left, a left or right one to top and then bottom. If none of the four candidates fits, the bubble is left where the last attempt put it rather than clamped into view. Layout guidance: prefer tooltipPosition="bottom" for triggers in a narrow column, where the cap and the fallback chain fight for the least room.',

    zIndex:
      'The bubble does not get a fixed z-index. Left at its default the directive registers the node on the library-wide overlay stack under the tooltip base of 1100 — the same base a modal dialog is given — and the number actually written is derived from the last entry on that stack rather than from the base alone. What follows for you: tooltip and dialog are peers in that stack, so which one paints on top is decided by the order they were opened in, not by their kind. The directive closes the bubble on scroll and on window resize, which covers most transitions between the two.',

    // development
    apiContent:
      'The alias of the content input, which is why you write pTooltip and not content. A TemplateRef is accepted and rendered as an embedded view — that is a formatting affordance, not a license to put controls in it.',
    apiPosition:
      'Physical keywords. Each has its own fallback chain, tried only while the placed node is outside the viewport.',
    apiEvent:
      'The default binds pointer and touch only. focus or both is what puts the tooltip within reach of a keyboard; the focus listener attaches to the inner .p-component when the host has one. Set it once: the listeners are bound after the view initializes and unbound only on destroy, so a later change to this input re-writes the options bag and rebinds nothing.',
    apiDisabled:
      'Aliased: the attribute is tooltipDisabled, not disabled. Its setter also deactivates a tooltip that is showing at the time.',
    apiAutoHide:
      'True leaves the node pointer-events: none, so it cannot be hovered and the reader loses it on the way there. False makes it hoverable and binds mouseleave on the node itself.',
    apiEscapeKey:
      'A document-level keydown.escape listener, bound while the tooltip is active — it is what makes the bubble dismissible without moving the pointer. The input itself is inert: onChanges writes no hideOnEscape key into the options bag, and the listener is bound from getOption(\'hideOnEscape\'), so [hideOnEscape]="false" changes nothing. The only switch that reaches it is [tooltipOptions]="{ hideOnEscape: false }".',
    apiEscape:
      'Nothing to do with the Escape key: true inserts the content as a text node, false assigns it to innerHTML. Never bind false to a string a user can influence.',
    apiDelays:
      'showDelay and hideDelay defer show and hide; life hides the bubble after its duration whether or not the pointer is still on the trigger. life is the one that puts you on the wrong side of the persistence requirement in SC 1.4.13.',
    apiEllipsis:
      'Shows the tooltip only when the trigger is actually truncated, measured as offsetWidth below scrollWidth or offsetHeight below scrollHeight, so a clamped multi-line cell counts too. Made for a table cell, quiet everywhere else.',
    apiFitContent:
      'Sets width: fit-content on the node. It is read straight off the directive instance rather than out of the options bag, so tooltipOptions cannot change it.',
    apiAppendTo:
      'Effectively body. The signal input exists and a computed folds in the app-wide overlay setting, but the value the node is appended by comes from the options bag, whose default is body, and that computed is read nowhere on this path.',
    apiOffsets: 'Added to the computed left and top in pixels, after placement.',
    apiStyling:
      'tooltipStyleClass lands on the root node beside the position class. tooltipZIndex takes a fixed value instead of the managed layer. positionStyle overrides the absolute positioning.',
    apiOptions:
      'One bag, merged over the defaults, that sets most of the above at once. Reach for the individual inputs first — but check where each one lands: hideOnEscape and fitContent are never written into this bag, which makes the bag the only route to hideOnEscape and no route at all to fitContent.',
    apiInherited:
      'Inherited from BaseComponent: scoped design tokens, unstyled rendering, and pass-through attributes with their options.',
    apiDirectivePt:
      'The directive-scoped pass-through pair plus its own unstyled flag. ptTooltip is deprecated in favor of pTooltipPT.',

    nodeLifecycle:
      'There is no tooltip node to point at. It is built when the tooltip shows and deleted when it hides, it never carries an id, and no attribute ties it to the trigger — so an aria-describedby you write yourself would be a dangling reference for all the time the tooltip is not showing. Treat the bubble as decoration over an element that is already named, never as the way of naming or describing one.',

    checkName:
      'Every trigger has its own accessible name — visible text or aria-label — before a tooltip is added. The tooltip repeats the name; it cannot be it.',
    checkKeyboard:
      'Set tooltipEvent="both" wherever the trigger is focusable. With the default, focus binds nothing and a keyboard user never sees the tooltip.',
    checkTouch:
      'On touch the bubble opens on touchstart and, with autoHide at its default, closes again on touchend. Assume a touch reader gets it for the length of a press, or not at all.',
    checkEssential:
      'Nothing the task needs lives only in a tooltip. Say it in the page and let the tooltip restate it.',
    checkEscapeHtml:
      'Leave escape at true. False assigns the string to innerHTML, which turns any user-influenced text into markup.',

    // i18n
    i18nLibrary:
      'Nothing. The tooltip has no library-supplied string, no label of its own, and no entry in the Optimus translation configuration. Every character a reader sees came from your binding, which makes the localization of a tooltip the localization of one plain UI string — and it is the same string as the control\'s accessible name often enough that one key should serve both.',
    i18nLength:
      'Plan for the cap, not for your language. The bubble is 12.5rem wide at most and wraps; a German compound or a Finnish case form does not widen it, it makes it taller, and a word longer than the cap is broken mid-word rather than allowed to overflow. Newlines in your string survive, because the text node is pre-line — that is the one formatting lever you have, and it is worth using instead of hoping the wrap falls well. Direction is not part of the deal: the four position keywords are physical and placement is computed from physical coordinates, so a right-placed tooltip stays on the physical right in an RTL page. Choose top or bottom wherever the reading direction may flip.',
  };

  readonly anatomySnippet: string = '<!-- What pTooltip appends to <body> while the tooltip is shown. -->\n' +
    '<div class="p-tooltip p-component p-tooltip-bottom" role="tooltip"\n' +
    '     data-pc-section="root"\n' +
    '     style="width: fit-content; pointer-events: none; display: inline-block;\n' +
    '            left: 412px; top: 268px; opacity: 1; z-index: 1102">\n' +
    '  <div class="p-tooltip-arrow" data-pc-section="arrow"></div>\n' +
    '  <div class="p-tooltip-text" data-pc-section="text">Tooltips are capped at 12.5rem …</div>\n' +
    '</div>\n' +
    '<!-- No id, no aria-*, and nothing on the trigger points here. -->\n' +
    '<!-- The whole node is removed again when the tooltip hides. -->';

  readonly usageSnippet: string = '<!-- The name is on the control; the tooltip restates it. -->\n' +
    '<button type="button" [attr.aria-label]="deleteLabel()"\n' +
    '        [pTooltip]="deleteLabel()" tooltipEvent="both" tooltipPosition="bottom">\n' +
    '  <i class="pi pi-trash" aria-hidden="true"></i>\n' +
    '</button>\n' +
    '\n' +
    '<!-- pTooltip IS the content input; tooltipDisabled IS the disabled input. -->\n' +
    '<!-- Neither "content" nor "disabled" binds this directive. -->\n' +
    '<p-button label="Export" [pTooltip]="exportHint()" [tooltipDisabled]="busy()" />';

  readonly disabledSnippet: string = '<!-- The directive listens on its own host element. Here that host IS the -->\n' +
    '<!-- disabled control, which is neither focusable nor a pointer-event target. -->\n' +
    '<button type="button" disabled pTooltip="Pick a row first">Delete</button>\n' +
    '\n' +
    '<!-- Here the host is the <p-button> wrapper and only the inner <button> is -->\n' +
    '<!-- disabled. The focus listener attaches to that inner button, which cannot -->\n' +
    '<!-- take focus. Whether the wrapper still sees mouseenter is up to the browser. -->\n' +
    '<p-button label="Delete" [disabled]="true" pTooltip="Pick a row first" />\n' +
    '\n' +
    '<!-- Reachable by keyboard too: an enabled, focusable wrapper carries it. -->\n' +
    '<span tabindex="0" pTooltip="Pick a row first" tooltipEvent="both">\n' +
    '  <button type="button" disabled>Delete</button>\n' +
    '</span>';

  readonly i18nSnippet: string = '// translate() inside a computed, so the label re-runs on a language switch.\n' +
    'private readonly i18n = inject(TranslationService);\n' +
    'readonly deleteLabel = computed(() => this.i18n.translate("table.row.delete"));\n' +
    '\n' +
    '// One key, both jobs: the accessible name and the tooltip say the same thing.\n' +
    '//   [attr.aria-label]="deleteLabel()" [pTooltip]="deleteLabel()"\n' +
    '//\n' +
    '// A plain field would keep the string it was born with:\n' +
    '//   readonly deleteLabel = this.i18n.translate("table.row.delete"); // stale';
}
