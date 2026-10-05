import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FieldsetModule } from '@openng/optimus-ui/fieldset';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { PanelModule } from '@openng/optimus-ui/panel';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, FieldsetModule, PanelModule, InputTextModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-fieldset-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-fieldset-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-fieldset-article .stage--row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        align-items: start;
      }

      app-fieldset-article .field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        margin-block-end: 0.6rem;
        font-size: 0.85rem;
      }

      app-fieldset-article .tight {
        margin: 0;
        font-size: 0.9rem;
      }

      app-fieldset-article .fake-group {
        border: 1px solid var(--surface-border);
        padding: 0.75rem 1rem 1rem;
        background: var(--surface-card);
      }

      app-fieldset-article .fake-legend {
        display: block;
        font-weight: 600;
        margin-block-end: 0.6rem;
      }

      app-fieldset-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-fieldset-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-fieldset-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-fieldset-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-fieldset-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        min-height: 6rem;
      }

      app-fieldset-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-fieldset-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-fieldset-article .sources a {
        color: var(--primary-color-fg);
      }

      app-fieldset-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-fieldset-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-fieldset-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-fieldset-article .dd,
        app-fieldset-article .stage--row {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Fieldset and Panel (Guides, category `library`).
 *
 * One guide for two grouping boxes. Every claim was read off the shipped sources
 * of Optimus UI 2.0.2 (lockfile `package-lock.json` → `@openng/optimus-ui` 2.0.2);
 * `openng-optimus-ui-fieldset.mjs` (482 lines), `openng-optimus-ui-panel.mjs`
 * (580), `openng-optimus-ui-button.mjs` (1043), `openng-optimus-ui-motion.mjs`
 * (722) and `openng-optimus-ui-basecomponent.mjs` (443) are the fesm2022 bundles
 * of those names.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - p-fieldset renders a real <fieldset> (fieldset:270) whose first child is a
 *     real <legend> (:271); the legend label is a span (:308 / :313).
 *   - Its toggle is a real <button> inside the legend (:273-284) carrying
 *     aria-expanded (:278), aria-controls (:277) and aria-label = legend
 *     (:279, buttonAriaLabel :165-167).
 *   - p-panel's header is a div (:346), its title a span (:348); no h1-h6 and no
 *     aria-level anywhere in the bundle.
 *   - p-panel binds role/aria-label/aria-controls/aria-expanded with attr.
 *     bindings on the <p-button> CUSTOM ELEMENT (:361-365). Button renders its
 *     own inner <button> (button:833-849) which receives none of them; the inner
 *     button's name comes from ariaLabel || buttonProps?.ariaLabel (button:835)
 *     and its attributes from pBind ptm('root') (button:845), fed by the panel's
 *     [pt]="ptm('pcToggleButton')" (:369).
 *   - Duplicate id: title span :348 and toggle button :356 both take id+'_header'.
 *   - Collapse hides, never unmounts: [pMotion] on the container (fieldset :320,
 *     panel :390); MotionDirective.hideStrategy defaults to 'display'
 *     (motion:493), applyHiddenStyles sets inline display:none (motion:23-24),
 *     and the DIRECTIVE has no mountOnEnter/unmountOnLeave (input list motion:693;
 *     those exist only on the p-motion COMPONENT, motion:110/:116).
 *   - updateTabIndex() removes the tabindex attribute on expand (fieldset :237,
 *     panel :299) and is called only from expand()/collapse() (fieldset :216-225,
 *     panel :278-287), never from the collapsed setter (fieldset :179-181).
 *   - Dead inputs: transitionOptions declared (fieldset :128, panel :170) and read
 *     nowhere in either bundle; iconPos (:154) feeds only p-panel-icons-start/-end/
 *     -center (:33-35), class names absent from every stylesheet under
 *     @openng/optimus-ui-styles/dist and from src/styles.scss.
 *   - Inherited dt/unstyled/pt/ptOptions from BaseComponent (basecomponent:428);
 *     both components declare usesInheritance and neither own list repeats them.
 *   - Tokens from @openng/optimus-ui-themes/dist/aura/fieldset/index.mjs and
 *     .../aura/panel/index.mjs
 *     (single-line dist bundles, cited by export); the rules consuming them from
 *     @openng/optimus-ui-styles/dist/fieldset/index.mjs (88 lines) and
 *     .../panel/index.mjs (48 lines) — neither contains a media query.
 *   - Contrast ratios quoted from docs/generated/CONTRAST.MD only. It has no
 *     fieldset/panel group; the stock frame color (content.border.color) is
 *     measured there as the informational progressbar.background rows (the
 *     slider track takes --control-border), and the Design tab quotes
 *     the kit --control-border rows an author would re-point the frame to.
 */
@Component({
  selector: 'app-fieldset-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'fieldset'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two boxes with the same silhouette: a frame, a bold line at the top, optionally a toggle. One of them is a
          native grouping element and names what is inside it; the other is a div with a span in it. Which one you
          reach for is not a styling decision.
        </p>

        <h3>Both, at rest</h3>
        <div class="stage stage--row">
          <p-fieldset legend="Contact details">
            <div class="field">
              <label for="ex-street">Street</label>
              <input pInputText id="ex-street" />
            </div>
            <div class="field">
              <label for="ex-city">City</label>
              <input pInputText id="ex-city" />
            </div>
          </p-fieldset>
          <p-panel header="Release notes">
            <p class="tight">Three fixes and one new grouping guide.</p>
          </p-panel>
        </div>
        <p class="src-note">
          The left box is a real <code>&lt;fieldset&gt;</code> whose first child is a real <code>&lt;legend&gt;</code>
          (<code>openng-optimus-ui-fieldset.mjs:270-271</code>). The right box is a host element with a header
          <code>&lt;div&gt;</code> (<code>openng-optimus-ui-panel.mjs:346</code>) holding a title
          <code>&lt;span&gt;</code> (<code>:348</code>).
        </p>

        <h3>Both, toggleable</h3>
        <div class="stage stage--row">
          <p-fieldset
            legend="Delivery options"
            [toggleable]="true"
            [collapsed]="fieldsetCollapsed()"
            (collapsedChange)="fieldsetCollapsed.set($event)"
          >
            <p class="tight">Collapsed: {{ fieldsetCollapsed() ? 'yes' : 'no' }}</p>
          </p-fieldset>
          <p-panel
            header="Delivery options"
            [toggleable]="true"
            [collapsed]="panelCollapsed()"
            (collapsedChange)="panelCollapsed.set($event ?? false)"
          >
            <p class="tight">Collapsed: {{ panelCollapsed() ? 'yes' : 'no' }}</p>
          </p-panel>
        </div>
        <p class="src-note">
          Both toggles sit in the header area and both emit <code>collapsedChange</code>. What differs is the element
          under the pointer: a <code>&lt;button&gt;</code> in the legend
          (<code>openng-optimus-ui-fieldset.mjs:273-284</code>) against a <code>&lt;p-button&gt;</code> in a header div
          (<code>openng-optimus-ui-panel.mjs:355-371</code>).
        </p>

        <h3>What each one emits</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>

        <h3>The two toggle anatomies</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Aspect</th><th><code>p-fieldset</code></th><th><code>p-panel</code></th></tr>
            </thead>
            <tbody>
              <tr><td>Element under the pointer</td><td>native <code>&lt;button&gt;</code> in the <code>&lt;legend&gt;</code></td><td><code>&lt;p-button&gt;</code> element in a header <code>&lt;div&gt;</code></td></tr>
              <tr><td>Element that takes focus</td><td>that same <code>&lt;button&gt;</code></td><td>the inner <code>&lt;button&gt;</code> Button renders</td></tr>
              <tr><td>Carries <code>aria-expanded</code></td><td>the focused button</td><td>the wrapper element, not the focused one</td></tr>
              <tr><td>Accessible name of the toggle</td><td><code>aria-label</code> from <code>legend</code></td><td>none on the focused button by default</td></tr>
              <tr><td>Keyboard</td><td>Enter and Space</td><td>Enter and Space</td></tr>
              <tr><td>Group name for AT</td><td>the <code>&lt;legend&gt;</code>, natively</td><td>none — the title span names nothing</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Fieldset rows from <code>openng-optimus-ui-fieldset.mjs:270-284</code>; panel rows from
          <code>openng-optimus-ui-panel.mjs:346-371</code> together with the button template at
          <code>openng-optimus-ui-button.mjs:833-849</code>, which is where the element that actually takes focus is
          declared.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The question this guide answers is not which box looks right. It is whether the group needs a name, whether
          it needs a heading, and whether it may disappear.
        </p>

        <h3>Which box</h3>
        <div class="table-wrap">
          <table>
            <caption>Grouping containers against the job they do</caption>
            <thead>
              <tr><th>Component</th><th>Names the group</th><th>Collapses</th><th>Reach for it when</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-fieldset</code></td><td>yes, natively</td><td>optional</td><td>form controls belong under one name</td></tr>
              <tr><td><code>p-panel</code></td><td>no</td><td>optional</td><td>a titled block of content may collapse</td></tr>
              <tr><td><code>p-card</code></td><td>no</td><td>no</td><td>a surface with no role at all is wanted</td></tr>
              <tr><td><code>p-accordion</code></td><td>per panel</td><td>yes</td><td>several sections are opened independently</td></tr>
              <tr><td><code>app-standard-container</code></td><td>via a real heading</td><td>yes</td><td>a titled section of a portal page</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The naming column is markup, not opinion: <code>&lt;fieldset&gt;</code> plus <code>&lt;legend&gt;</code>
          (<code>openng-optimus-ui-fieldset.mjs:270-271</code>) against a title <code>&lt;span&gt;</code>
          (<code>openng-optimus-ui-panel.mjs:348</code>); the accordion's per-panel region comes from
          <code>openng-optimus-ui-accordion.mjs:408</code>.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the group's name is only a bold line</span>
            <div class="dd__stage">
              <div class="fake-group">
                <span class="fake-legend">Contact details</span>
                <div class="field">
                  <label for="bad-street">Street</label>
                  <input pInputText id="bad-street" />
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a fieldset, whose legend is the name</span>
            <div class="dd__stage">
              <p-fieldset legend="Contact details">
                <div class="field">
                  <label for="good-street">Street</label>
                  <input pInputText id="good-street" />
                </div>
              </p-fieldset>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages hold the same control and the same words. Only the right one puts them in the element pair the
          HTML specification defines for grouping form controls
          (<code>openng-optimus-ui-fieldset.mjs:270-271</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a required field inside a collapsed group</span>
            <div class="dd__stage">
              <form (submit)="$event.preventDefault()">
                <p-fieldset legend="Billing address" [toggleable]="true" [collapsed]="true">
                  <div class="field">
                    <label for="bad-zip">Postcode (required)</label>
                    <input pInputText id="bad-zip" required />
                  </div>
                </p-fieldset>
                <button type="submit">Submit</button>
              </form>
            </div>
            <p class="dd__why">{{ m.ddRequiredBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — required fields in a group that stays open</span>
            <div class="dd__stage">
              <form (submit)="$event.preventDefault()">
                <p-fieldset legend="Billing address">
                  <div class="field">
                    <label for="good-zip">Postcode (required)</label>
                    <input pInputText id="good-zip" required />
                  </div>
                </p-fieldset>
                <button type="submit">Submit</button>
              </form>
            </div>
            <p class="dd__why">{{ m.ddRequiredGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The left group is collapsed, so its content container carries an inline <code>display: none</code>
          (<code>openng-optimus-ui-motion.mjs:493</code>, applied <code>:23-24</code>) while the control itself stays
          in the DOM and in the form. Press both Submit buttons: the right one puts the browser's own message on a
          field you can see, the left one refuses the submission with nothing to show for it.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          The two repairs the panel needs are the inner button's own name input
          (<code>openng-optimus-ui-button.mjs:835</code>) and the pass-through that reaches its root element
          (<code>openng-optimus-ui-panel.mjs:369</code> into <code>openng-optimus-ui-button.mjs:845</code>).
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, the fieldset element</a
            >
            — the native group naming through <code>legend</code> that a bold span cannot give.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#interactively-validate-the-constraints"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, interactively validate the constraints</a
            >
            — the step that stalls on a required control hidden by a collapse.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 4.1.2 Name, Role, Value</a
            >
            — why name and state on the non-focusable panel wrapper do not count.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — the 3:1 a frame owes once it alone carries the grouping.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Both components draw a 1px frame and a bold label, and both take their colors from the same
          <code>content.*</code> family. The differences that matter are where the padding sits and which element the
          focus ring lands on.
        </p>

        <h3>Aura token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Slot</th><th><code>p-fieldset</code></th><th><code>p-panel</code></th></tr>
            </thead>
            <tbody>
              <tr><td>frame</td><td><code>1px solid &#123;content.border.color&#125;</code></td><td><code>1px solid &#123;content.border.color&#125;</code></td></tr>
              <tr><td>box padding</td><td><code>0 1.125rem 1.125rem 1.125rem</code></td><td>none on the root</td></tr>
              <tr><td>header padding</td><td><code>0.5rem 0.75rem</code> (legend)</td><td><code>1.125rem</code>, toggleable <code>0.375rem 1.125rem</code></td></tr>
              <tr><td>header weight</td><td><code>600</code></td><td><code>600</code></td></tr>
              <tr><td>content padding</td><td><code>0</code></td><td><code>0 1.125rem 1.125rem 1.125rem</code></td></tr>
              <tr><td>toggle icon color</td><td><code>&#123;text.muted.color&#125;</code></td><td>the Button preset</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/fieldset/index.mjs</code> and
          <code>.../aura/panel/index.mjs</code> (single-line dist bundles, cited by export); the rules that consume
          them from <code>&#64;openng/optimus-ui-styles/dist/fieldset/index.mjs</code> and
          <code>.../panel/index.mjs</code>.
        </p>

        <h3>The frame is what carries the group</h3>
        <p>{{ m.frameCriterion }}</p>
        <div class="table-wrap">
          <table>
            <caption>Kit border token against the card surface, per visual style and mode</caption>
            <thead>
              <tr><th>Style</th><th>light</th><th>dark</th><th>SC</th><th>needs</th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>5.23:1</td><td>4.91:1</td><td>1.4.11</td><td>3:1</td></tr>
              <tr><td>lernwerkstatt</td><td>4.15:1</td><td>4.89:1</td><td>1.4.11</td><td>3:1</td></tr>
              <tr><td>skizzenbuch</td><td>4.22:1</td><td>4.25:1</td><td>1.4.11</td><td>3:1</td></tr>
              <tr><td>blaupause</td><td>4.09:1</td><td>3.97:1</td><td>1.4.11</td><td>3:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Rows are <code>--control-border</code> on <code>--surface-card</code> (group "control boundary"), quoted from
          <code>docs/generated/CONTRAST.MD</code>. The stock-frame figures are that file's informational
          <code>progressbar.background</code> rows on <code>--surface-ground</code> and <code>--surface-card</code>
          (group "progressbar &amp; slider"): the Aura progress track resolves the same
          <code>content.border.color</code>. (The slider track no longer does — the kit re-points it to
          <code>--control-border</code>.)
        </p>

        <h3>Focus ring</h3>
        <p>{{ m.focusRing }}</p>
        <p class="src-note">
          <code>.p-fieldset-toggle-button:focus-visible</code> in
          <code>&#64;openng/optimus-ui-styles/dist/fieldset/index.mjs</code> resolves
          <code>fieldset.legend.focusRing.*</code>, which Aura maps to the global <code>focus.ring.*</code> family; the
          kit's one ring list in <code>src/styles.scss</code> overrides it, measured in
          <code>docs/generated/CONTRAST.MD</code> "focus ring".
        </p>

        <h3>Narrow viewport</h3>
        <p>{{ m.viewport }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Fifteen live inputs across the two components, four more that are inherited and appear in neither
          compiled list, and three that reach no reader at all.
        </p>

        <h3><code>p-fieldset</code> inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Reaches</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td><code>legend</code></td><td>the legend label span, and the toggle's <code>aria-label</code></td><td>live</td></tr>
              <tr><td><code>toggleable</code></td><td>the legend branch and the root class</td><td>live</td></tr>
              <tr><td><code>collapsed</code></td><td><code>aria-expanded</code>, <code>aria-hidden</code>, the motion binding</td><td>live</td></tr>
              <tr><td><code>style</code></td><td><code>ngStyle</code> on the inner <code>&lt;fieldset&gt;</code></td><td>live</td></tr>
              <tr><td><code>styleClass</code></td><td>the inner <code>&lt;fieldset&gt;</code>'s class list</td><td>live</td></tr>
              <tr><td><code>motionOptions</code></td><td>the motion directive's options</td><td>live</td></tr>
              <tr><td><code>transitionOptions</code></td><td>nothing</td><td>dead</td></tr>
              <tr><td><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code></td><td>the styling layer</td><td>inherited, undeclared</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Own inputs from the compiled declaration <code>openng-optimus-ui-fieldset.mjs:269</code>; the inherited four
          from <code>openng-optimus-ui-basecomponent.mjs:428</code>, which both components extend
          (<code>usesInheritance: true</code>) without repeating them.
        </p>

        <h3><code>p-panel</code> inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Reaches</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td><code>id</code></td><td>the host id and every generated id below it</td><td>live</td></tr>
              <tr><td><code>header</code></td><td>the title span, and the toggle's host <code>aria-label</code></td><td>live</td></tr>
              <tr><td><code>toggleable</code></td><td>the toggle button and the root classes</td><td>live</td></tr>
              <tr><td><code>collapsed</code></td><td>the motion binding and the wrapper's ARIA</td><td>live</td></tr>
              <tr><td><code>showHeader</code></td><td>the whole header block</td><td>live</td></tr>
              <tr><td><code>toggler</code></td><td>which click handler toggles</td><td>live</td></tr>
              <tr><td><code>toggleButtonProps</code></td><td>the inner button, including its name</td><td>live</td></tr>
              <tr><td><code>styleClass</code></td><td>the host class list</td><td>live, deprecated</td></tr>
              <tr><td><code>motionOptions</code></td><td>the motion directive's options</td><td>live</td></tr>
              <tr><td><code>iconPos</code></td><td>three class names no stylesheet defines</td><td>dead</td></tr>
              <tr><td><code>transitionOptions</code></td><td>nothing</td><td>dead</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Own inputs from <code>openng-optimus-ui-panel.mjs:344</code>. The icon-position classes are built at
          <code>:33-35</code>; the strings <code>p-panel-icons-start</code>, <code>-end</code> and
          <code>-center</code> appear in no stylesheet under <code>&#64;openng/optimus-ui-styles/dist</code> and in no
          kit stylesheet, and the header is a <code>space-between</code> flex row regardless.
        </p>

        <h3>Templates</h3>
        <p>{{ m.templates }}</p>

        <h3>What a collapse actually does</h3>
        <pre class="code-block"><code>{{ collapseSnippet }}</code></pre>
        <p class="src-note">
          Hide strategy and its effect from <code>openng-optimus-ui-motion.mjs:493</code> and <code>:23-24</code>; the
          absence of an unmount option from the directive's input list at <code>:693</code>, against the
          <code>p-motion</code> component's own <code>mountOnEnter</code>/<code>unmountOnLeave</code> at
          <code>:110</code> and <code>:116</code>.
        </p>

        <h3>The tabindex sweep</h3>
        <p>{{ m.tabIndexSweep }}</p>

        <h3>The region that has no name</h3>
        <p>{{ m.unnamedRegion }}</p>
        <p class="src-note">
          Container ARIA at <code>openng-optimus-ui-fieldset.mjs:325-326</code> and
          <code>openng-optimus-ui-panel.mjs:395-396</code>; the only element that ever carries the referenced id in
          the fieldset is the toggle button at <code>openng-optimus-ui-fieldset.mjs:274</code>.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>Group of form controls uses <code>p-fieldset</code>, not a styled box.</li>
          <li>A heading exists wherever the group belongs in the document outline.</li>
          <li>The panel toggle has a name and an expanded state on the element that takes focus.</li>
          <li>No <code>required</code> control and no error message lives inside a collapsible group.</li>
          <li>No author-set <code>tabindex</code> inside a collapsible group.</li>
          <li>The frame reaches 3:1 wherever it is the only carrier of the grouping.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          A legend and a panel header are UI strings like any other, with one twist: the legend is also the toggle's
          accessible name, so translating it translates two things at once.
        </p>

        <h3>Getting the strings in</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The kit's translation service exposes <code>translate(key)</code> — one key, no interpolation argument — so
          a header that varies is composed in the <code>computed()</code> before it is bound.
        </p>

        <h3>What is translated and what is not</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Value</th><th>Translated</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td><code>legend</code> / <code>header</code></td><td>yes</td><td>visible text, and the toggle's name</td></tr>
              <tr><td><code>toggleButtonProps.ariaLabel</code></td><td>yes</td><td>the only name the focused button gets</td></tr>
              <tr><td><code>id</code> on <code>p-panel</code></td><td>no</td><td>it becomes DOM ids</td></tr>
              <tr><td><code>toggler</code>, <code>iconPos</code></td><td>no</td><td>enumerations read by the component</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Length</h3>
        <p>{{ m.lengthNote }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the stock-frame figures now
            come from the <code>progressbar.background</code> rows (the slider track is <code>--control-border</code>
            now); the toggle wears the kit's one 2px ring.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Design cites the compilat rows that measure the stock frame color
            (1.13–1.76:1, under the 3:1 a load-bearing frame owes) instead of claiming no ratio; annotated Sources close
            the Usage tab; history in the corpus markup.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class FieldsetArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly fieldsetCollapsed = signal(false);
  readonly panelCollapsed = signal(true);

  readonly m = {
    ddNameBad:
      'The bold line is a span. Nothing connects it to the control below it, so a screen-reader user who lands on ' +
      'the field hears the field label alone and never learns which group it belongs to.',
    ddNameGood:
      'The same words sit in a legend inside a fieldset, which is the element pair HTML defines for grouping form ' +
      'controls — the group name travels with every control inside it, at no extra markup cost.',
    ddRequiredBad:
      'The postcode is required and its container is display: none. It is still in the form and still invalid, but ' +
      'it cannot be focused, so the browser blocks the submit without showing anyone a message.',
    ddRequiredGood:
      'The same field in a group that never collapses stays focusable, so validation can point at it and the reader ' +
      'sees why the form will not submit.',
    frameCriterion:
      'A frame that is what makes the group a group is meaningful non-text content and owes SC 1.4.11, 3:1 against ' +
      'the surface behind it. The shipped frame does not reach that: it takes the Optimus content.border.color ' +
      'token, which no visual style re-points and which the kit contrast compilat measures at 1.13:1 to 1.23:1 on ' +
      'the light grounds and 1.26:1 to 1.76:1 on the dark ones. A legend or header that names the group carries ' +
      'it without the frame; where the frame alone has to carry the grouping, override it with --control-border, ' +
      'whose ratios follow.',
    focusRing:
      'The fieldset toggle wears the kit’s one focus ring — 2px --primary-color-fg at a 2px offset, replacing ' +
      'Aura’s 1px global focus.ring — and the rule is keyed on the button class rather than on a direct-child ' +
      'selector, so wrapping the legend content does not break it. On the page surfaces it measures 3.88–17.85:1 ' +
      'across every style, mode and accent. The panel toggle is a Button and wears the same ring as every button.',
    viewport:
      'No intrinsic responsive behavior and no media query in either stylesheet. The p-panel host is display: ' +
      'block; the p-fieldset host is an unstyled inline element around a block-level fieldset, so both boxes ' +
      'fill their container width at every viewport, but a width or a vertical margin set on a p-fieldset host ' +
      'does not apply — size that one with a wrapper or pt.root. A long legend or header wraps onto a second ' +
      'line instead of truncating, and no content wrapper in either stylesheet sets overflow, so wide content ' +
      'is never clipped or scrolled for you at rest — only the 0.2s collapse animation sets overflow. ' +
      'Layout guidance: give a wide table or code block inside the group ' +
      'its own scroll container.',
    templates:
      'p-fieldset projects header, content, expandicon, and collapseicon; p-panel projects header, content, footer, ' +
      'icons and headericons. One asymmetry decides a design: when p-fieldset is toggleable, the header template is ' +
      'rendered inside the toggle button, so it may hold neither a link, a button nor a heading. A panel header ' +
      'template renders beside the toggle and has no such restriction.',
    tabIndexSweep:
      'Every expand and collapse walks the content for input, button, select, a, textarea, and [tabindex], setting ' +
      'tabindex to -1 on collapse and REMOVING the attribute on expand. Removing is the destructive half: a roving ' +
      'tabindex widget, a toolbar, or a grid that manages its own tab stops loses them on the first expand. The walk ' +
      'also runs only from the toggle path, never from a write to collapsed, so a programmatic collapse skips it.',
    unnamedRegion:
      'Both content containers are role="region" labeled by an id ending in _header. In p-panel that id belongs to ' +
      'the title span, and also to the toggle button, which is one id too many for one document. In p-fieldset the ' +
      'id exists only when the component is toggleable, so a plain fieldset ships a region with no accessible name ' +
      'at all — harmless, but it is not the landmark the role suggests.',
    lengthNote:
      'A legend grows the frame notch it sits in and a panel title grows the header row; neither truncates, so a ' +
      'German or Finnish string three times the English length reflows the box rather than clipping. Check the ' +
      'longest locale at the narrowest layout, because a two-line legend changes the height of everything beside it.',
  };

  readonly emittedMarkupSnippet: string = '<!-- p-fieldset legend="Contact details" -->\n' +
    '<p-fieldset>            <!-- host: no class, no shipped rule -->\n' +
    '  <fieldset class="p-fieldset p-component">\n' +
    '    <legend class="p-fieldset-legend">\n' +
    '      <span class="p-fieldset-legend-label">Contact details</span>\n' +
    '    </legend>\n' +
    '    <div class="p-fieldset-content-container" role="region" aria-labelledby="pn_id_1_header">…</div>\n' +
    '  </fieldset>\n' +
    '</p-fieldset>\n\n' +
    '<!-- p-panel header="Release notes" toggleable -->\n' +
    '<p-panel class="p-panel p-component p-panel-toggleable p-panel-expanded" id="pn_id_2">\n' +
    '  <div class="p-panel-header" id="pn_id_2-titlebar">\n' +
    '    <span class="p-panel-title" id="pn_id_2_header">Release notes</span>\n' +
    '    <div class="p-panel-header-actions">\n' +
    '      <p-button role="button" aria-label="Release notes" aria-expanded="true"\n' +
    '                aria-controls="pn_id_2_content" id="pn_id_2_header">   <!-- same id again -->\n' +
    '        <button class="p-button …">…</button>  <!-- this one takes focus -->\n' +
    '      </p-button>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="p-panel-content-container" role="region" aria-labelledby="pn_id_2_header">…</div>\n' +
    '</p-panel>';

  readonly usageSnippet: string = '// A group of controls: fieldset, legend translated, never collapsible.\n' +
    "readonly legendText = computed(() => this.i18n.translate('checkout.address.legend'));\n\n" +
    '<p-fieldset [legend]="legendText()">\n' +
    '  <label for="street">{{ streetLabel() }}</label>\n' +
    '  <input pInputText id="street" required />\n' +
    '</p-fieldset>\n\n' +
    '// A collapsible titled block: the toggle needs a name AND a state, and\n' +
    '// neither reaches the focused button on its own.\n' +
    'readonly toggleProps = computed(() => ({\n' +
    "  ariaLabel: this.i18n.translate('notes.toggle'),   // -> the inner <button>\n" +
    '}));\n' +
    'readonly togglePt = computed(() => ({\n' +
    "  pcToggleButton: { root: { 'aria-expanded': String(!this.collapsed()) } },\n" +
    '}));\n\n' +
    '<p-panel [header]="notesTitle()" [toggleable]="true"\n' +
    '         [collapsed]="collapsed()" (collapsedChange)="collapsed.set($event)"\n' +
    '         [toggleButtonProps]="toggleProps()" [pt]="togglePt()">\n' +
    '  <p>{{ notesBody() }}</p>\n' +
    '</p-panel>';

  readonly collapseSnippet: string = '// collapsed = true  ->  the CONTENT CONTAINER, not the content, is hidden:\n' +
    '<div class="p-fieldset-content-container" style="display: none"\n' +
    '     role="region" aria-hidden="true" tabindex="-1">\n' +
    '  <div class="p-fieldset-content-wrapper">\n' +
    '    <div class="p-fieldset-content">\n' +
    '      <input id="zip" required />                  <!-- still here, still required -->\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n\n' +
    '// Consequences, in order of how often they bite:\n' +
    '//   1. a required control here blocks submit and shows no message\n' +
    '//   2. an error message here exists but cannot be seen or reached\n' +
    '//   3. find-in-page does not reach it (no hidden="until-found")\n' +
    '//   4. its value is still submitted with the form\n' +
    '//   5. a collapse through the toggle also sets tabindex="-1" on the controls\n' +
    '//      here; [collapsed]="true" on first render does not, because the sweep\n' +
    '//      runs only from expand()/collapse()\n' +
    '// If the content must really be gone, use your own @if — there is no lazy input.';

  readonly i18nSnippet: string = '// translate() takes a key and nothing else, so composition happens first.\n' +
    "readonly legendText = computed(() => this.i18n.translate('address.legend'));\n" +
    'readonly toggleProps = computed(() => ({\n' +
    "  ariaLabel: this.i18n.translate('notes.toggle'),\n" +
    '}));\n\n' +
    '// Wrong: translate() is not an interpolator.\n' +
    "// this.i18n.translate('notes.toggle', { title })   // does not compile: one key, no second argument\n\n" +
    '<p-fieldset [legend]="legendText()">…</p-fieldset>';
}
