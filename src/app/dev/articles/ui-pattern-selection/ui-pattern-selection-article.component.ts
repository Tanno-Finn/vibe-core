import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';
import { TooltipModule } from '@openng/optimus-ui/tooltip';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { StandardContainerComponent } from '../../../components/shared/standard-container.component';
import { InfoTooltipComponent } from '../../../components/shared/info-tooltip.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    CardModule,
    TooltipModule,
    StandardContainerComponent,
    InfoTooltipComponent,
  ];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      :host {
        display: block;
      }
      .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
        margin: 0 0 var(--space-5);
      }
      .m0 {
        margin: 0;
      }

      /* --- Rendered stages --- */
      .stage {
        margin: 0 0 var(--space-4);
        padding: var(--space-4);
        background: var(--surface-section);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
      }
      .stage--row {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-5);
        align-items: flex-start;
      }
      .stage--stack {
        display: grid;
        gap: var(--space-4);
      }
      .stage__item {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .stage__cap {
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .faux-help {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
      }
      .icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        font-size: 1.1rem;
        color: var(--text-color);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        cursor: pointer;
      }
      .card-h {
        margin: 0;
        padding: var(--space-4) var(--space-4) 0;
      }

      /* --- Ordered decision steps --- */
      .steps {
        margin: 0 0 var(--space-4);
        padding-left: 1.25rem;
      }
      .steps li {
        margin: 0 0 var(--space-3);
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
        overflow-wrap: anywhere;
        min-width: 0;
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
    `;

/**
 * Guide article: UI Pattern Selection (foundations).
 *
 * WHAT THE CLAIMS REST ON — the durable artifacts behind every rule in the
 * tabs. The per-call-site census that produced these conventions is commit-body
 * material and deliberately absent from the rendered text (guide-authoring:
 * "Provenance, not process", durability test 1):
 *   - Three layers: src/app/dev/design-registry.ts (18 kit primitives, each
 *     with a six-section doc under src/assets/design-system/) +
 *     src/app/dev/articles/article-registry.ts (55 guides: 45 library,
 *     7 foundations, 3 layouts) + plain HTML.
 *   - The registry-or-exclusion fork is a gate, not a habit:
 *     scripts/check-design-system.mjs fails when a component file under
 *     src/app/components/ is in neither design-registry.ts nor
 *     design-registry.exclusions.json, and also when it is in both.
 *   - The kit's own channels, all wired in the app shell rather than the
 *     library's: ToastService (src/app/services/toast.service.ts) rendered by
 *     app-toast-container, and app-loading-overlay for the shell-level wait.
 *   - The explanation ladder rests on the criteria, not on how the tree happens
 *     to use them: info-tooltip.md states click-or-focus and SC 1.4.13 for a
 *     1-2 sentence bubble; the ceiling on a pointer-only pTooltip string is
 *     SC 1.4.13 plus the accessible-name rule a11y-guidelines owns; the
 *     library tooltip's own contract is the tooltip guide. The native title
 *     rung is the HTML standard's own: exposure is required of user agents,
 *     is not delivered, and reliance on the attribute is discouraged there.
 *   - Every pairwise boundary between library components is already stated in
 *     the owning guide's "## When to use" / "## When not to use", harvestable
 *     in one call via scripts/design-guides.mjs — which is why this guide
 *     routes to them and quotes attribution rather than re-deriving numbers.
 *   - The declared gaps: grid rhythm / spacing composition (no layouts guide),
 *     and the library components `design-guides.mjs coverage` lists as
 *     uncovered.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-ui-pattern-selection-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'ui-pattern-selection'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two decisions rendered rather than described. Both are decisions this kit has already made, and both are
          invisible in a screenshot — what separates the options is who can reach the content and who owns the heading.
        </p>

        <h3>Three ways to attach an explanation, only two of which are patterns</h3>
        <p>The same sentence, offered three ways. Try each with the pointer, then with the keyboard alone.</p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap">native title</span>
            <span class="faux-help" title="A threshold above which a sample counts as an outlier.">
              Threshold <span aria-hidden="true">(?)</span>
            </span>
          </div>
          <div class="stage__item">
            <span class="stage__cap">pTooltip</span>
            <button
              type="button"
              class="icon-btn"
              aria-label="Reset threshold"
              pTooltip="Reset threshold"
              tooltipPosition="top"
            >
              <span aria-hidden="true">&#8635;</span>
            </button>
          </div>
          <div class="stage__item">
            <span class="stage__cap">app-info-tooltip</span>
            <span class="faux-help">
              Threshold
              <app-info-tooltip text="A threshold above which a sample counts as an outlier." forLabel="Threshold">
              </app-info-tooltip>
            </span>
          </div>
        </div>
        <p class="src-note">
          Behavior and the criterion it is built against from the kit doc
          <code>src/assets/design-system/info-tooltip.md</code> and the component it documents,
          <code>src/app/components/shared/info-tooltip.component.ts</code>. The rung above it — a pointer-only bubble
          that may carry no more than a control's own name — is bounded by SC 1.4.13 and by the accessible-name rule
          <strong>Accessibility Guidelines</strong> owns; the library component's own contract is the
          <strong>Tooltip</strong> guide. The first item is the native attribute, whose accessible exposure the HTML
          standard requires and user agents do not deliver.
        </p>

        <h3>A titled block: the kit's primitive against the library's box</h3>
        <p>
          Same content, same width. The kit primitive arrives with a semantic variant, a real heading at the level you
          name, and an optional collapse; the library card arrives as a surface, and the heading stays your job.
        </p>
        <div class="stage stage--stack">
          <app-standard-container [config]="{ type: 'info', title: 'Sampling threshold', headingLevel: 4 }">
            <p class="m0">
              Raise the threshold to keep more samples. The container supplies the accent, the icon, and the heading tag.
            </p>
          </app-standard-container>

          <p-card>
            <ng-template #header>
              <h4 class="card-h">Sampling threshold</h4>
            </ng-template>
            <p class="m0">
              Raise the threshold to keep more samples. The heading above is markup written by hand, because the card
              contributes none.
            </p>
          </p-card>
        </div>
        <p class="src-note">
          Variant set, heading control, and collapse behavior from
          <code>src/assets/design-system/standard-container.md</code>; the card's own account of what it does not
          contribute is the <strong>Card</strong> guide, whose Usage tab already holds the container comparison table
          this guide does not repeat.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The first question is never which control. It is which of three layers already owns the need — because two of
          them answer without a decision, and only the third is a judgment.
        </p>

        <h3>Ask the three layers in order</h3>
        <ol class="steps">
          <li>
            <strong>Does the kit already ship it?</strong> The gallery is the kit's own primitives, each with a
            six-section doc. Cover roughly 80&nbsp;% of the need and the answer is to use or extend it — a
            near-duplicate primitive is a permanent second thing to maintain.
          </li>
          <li>
            <strong>Does a guide own the boundary?</strong> Every library component this kit documents states its own
            limits in <code>When to use</code> and <code>When not to use</code>. Read the owning guide's rule; do not
            reconstruct a threshold you half-remember.
          </li>
          <li>
            <strong>Otherwise it is plain HTML.</strong> A library component that adds only state machinery you never
            switch on is a dependency without a reason.
          </li>
        </ol>
        <p class="src-note">
          The reuse rule and the read ladder underneath it are the kit's own directive
          <code>directives/design-system.md</code>; the layer inventory is
          <code>src/app/dev/design-registry.ts</code> and <code>src/app/dev/articles/article-registry.ts</code>.
        </p>

        <h3>Where the kit answers before the library is reached</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Need</th>
                <th>The kit's answer</th>
                <th>Why it is not the library's</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A titled, optionally collapsible content block</td>
                <td><code>app-standard-container</code></td>
                <td>
                  Nine semantic variants, a heading at the level you name, and a fragment-aware collapse; the reading
                  wrapper, the definition block, and the quiz shell are built on it rather than beside it
                </td>
              </tr>
              <tr>
                <td>Long-form prose with reading chrome</td>
                <td><code>app-text-container</code></td>
                <td>Adds reading time, word count, and a progress bar over the same container</td>
              </tr>
              <tr>
                <td>One or two sentences of help beside a control</td>
                <td><code>app-info-tooltip</code></td>
                <td>Opens on click or focus, dismissible with ESC, sized for a short bubble</td>
              </tr>
              <tr>
                <td>A transient &quot;it worked&quot; notice</td>
                <td><code>ToastService</code>, rendered by <code>app-toast-container</code></td>
                <td>The shell already renders one queue with its own positions and types</td>
              </tr>
              <tr>
                <td>The shell-level wait before the first view</td>
                <td><code>app-loading-overlay</code></td>
                <td>One overlay for the whole shell, not a spinner per page</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit primitives and their inputs from their canonical docs under
          <code>src/assets/design-system/</code>; the two service-backed rows from
          <code>src/app/services/toast.service.ts</code> and
          <code>src/app/components/shared/app-loading-overlay.component.ts</code>, both mounted by the app shell. The
          library's own equivalents are documented in <strong>Feedback Messages</strong> and
          <strong>Progress</strong> and remain the right reading when you need their mechanics.
        </p>

        <h3>Which guide owns which boundary</h3>
        <p>
          A routing table, not a second rulebook. Each row names the guide whose
          <code>When to use</code> is authoritative; where this table and that section disagree, the guide wins and this
          row is stale.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>The question in front of you</th>
                <th>Owned by</th>
                <th>The rule it states</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>One value from a list, and the list is long</td>
                <td>Select</td>
                <td>Roughly 5&ndash;25 known options, tight space, labels that need no explanation</td>
              </tr>
              <tr>
                <td>One value, whole set visible, applied on click</td>
                <td>Select Button</td>
                <td>2&ndash;4 short exclusive values that fit one line at your narrowest width</td>
              </tr>
              <tr>
                <td>One value, whole set visible, applied on submit</td>
                <td>Radio Button</td>
                <td>Exactly one of 2&ndash;5 named options, as a form field that can never be empty</td>
              </tr>
              <tr>
                <td>Zero to many independent answers</td>
                <td>Checkbox</td>
                <td>&quot;Which of these apply?&quot;, applied on submit, where nothing ticked is legal</td>
              </tr>
              <tr>
                <td>A setting that takes effect immediately</td>
                <td>Toggle Switch</td>
                <td>An on/off state that acts the instant it moves</td>
              </tr>
              <tr>
                <td>Too many candidates to list, or unbounded</td>
                <td>AutoComplete</td>
                <td>Hundreds, remote, or open-ended, and the user can name the target</td>
              </tr>
              <tr>
                <td>Records side by side</td>
                <td>Table</td>
                <td>
                  Compared across columns, with real sorting, selection, or paging &mdash; otherwise a plain table
                  element
                </td>
              </tr>
              <tr>
                <td>Parallel views of one subject</td>
                <td>Tabs</td>
                <td>
                  Two to about four labels; anything linkable or reloadable becomes a route, or mirrors its value into a
                  query param
                </td>
              </tr>
              <tr>
                <td>A modal interruption</td>
                <td>Dialog</td>
                <td>A self-contained sub-task the user just asked for &mdash; never the default container</td>
              </tr>
              <tr>
                <td>A panel with the page still usable behind it</td>
                <td>Popover, Drawer</td>
                <td>Anchored to one trigger, or pinned to an edge and sized by you</td>
              </tr>
              <tr>
                <td>Something happened, or is happening</td>
                <td>Feedback Messages, Progress, Skeleton</td>
                <td>A condition that stays true, a countable wait, or a wait whose layout you can draw</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Every cell is the owning guide's own <code>When to use</code>, condensed;
          <code>node scripts/design-guides.mjs sections &quot;When to use&quot;</code> returns all of them unabridged in
          one call, which is the form to read before writing markup.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; hide help in a native title</span>
            <div class="dd__stage">
              <code class="dd__code"
                >&lt;span title="Above this, a sample counts as an outlier."&gt;Threshold&lt;/span&gt;</code
              >
            </div>
            <p class="dd__why">
              The HTML standard requires user agents to expose the attribute accessibly, and they do not: it shows on
              pointer hover, and in some readers as a fallback description. That gap is the standard's own reason for
              discouraging reliance on it — everyone without a pointer is looking at an explanation they cannot open,
              and its presentation belongs to the user agent rather than to you.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; give the explanation a trigger</span>
            <div class="dd__stage">
              <code class="dd__code"
                >Threshold &lt;app-info-tooltip [text]="help()" forLabel="Threshold"&gt;&lt;/app-info-tooltip&gt;</code
              >
            </div>
            <p class="dd__why">
              A real button in the tab order, opening on click or focus and dismissible with ESC. If the string is the
              control's own name rather than an explanation, it belongs in
              <code>pTooltip</code> beside the accessible name instead.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; open a dialog for content that has an address</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;p-dialog [(visible)]="detailOpen"&gt; … the record … &lt;/p-dialog&gt;</code>
            </div>
            <p class="dd__why">
              A dialog has no address of its own. Unless you mirror its open state into the URL yourself — a query
              param, or an auxiliary outlet that gives the layer a segment — the reader cannot link it, reload it, or
              return to it, and the browser's back button leaves the page instead of the layer. The Dialog guide states
              the same limit from the other side: tabs or steps inside one mean it is a page.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; give the view a route</span>
            <div class="dd__stage">
              <!-- Entities decode before interpolation is scanned, so a doubled brace
                   entity comes back as a real binding and Angular goes looking for a
                   "record" property. Single entity braces are safe (every other guide
                   uses them); a doubled pair needs the interpolated-string escape. -->
              <code class="dd__code"
                >&lt;a [routerLink]="['/records', record.id]"&gt;{{ '{{' }} record.name {{ '}}' }}&lt;/a&gt;</code
              >
            </div>
            <p class="dd__why">
              Routes are the kit's default for a view of its own, declared in
              <code>src/app/app.routes.ts</code>. Reserve the modal layer for a sub-task the reader just asked for and
              will finish in seconds.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't &mdash; build a bordered panel by hand</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;div class="my-panel"&gt;&lt;h3&gt;Sources&lt;/h3&gt; … &lt;/div&gt;</code>
            </div>
            <p class="dd__why">
              A new panel is a new set of spacing, border, and accent decisions that will drift from the ones the gallery
              already made, and it inherits none of the collapse, heading-level, or deep-link behavior the kit's
              container ships with.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; take the variant that exists</span>
            <div class="dd__stage">
              <!-- Braces in template TEXT are not text: the opening one starts an ICU
                   expression and the closing one reads as a control-flow block close,
                   which together swallowed the rest of this template (NG5002). Both are
                   written as HTML entities here and render as the characters they name. -->
              <code class="dd__code"
                >&lt;app-standard-container [config]="&#123; type: 'info', title: t(), headingLevel: 3 &#125;"&gt;</code
              >
            </div>
            <p class="dd__why">
              One call answers whether it exists:
              <code>design-guides.mjs list --layer kit</code>. Extending the primitive keeps one thing to fix; a
              near-duplicate keeps two.
            </p>
          </div>
        </div>

        <h3>Sources for this tab</h3>
        <p class="src-note">
          Layer inventory from <code>src/app/dev/design-registry.ts</code> and
          <code>src/app/dev/articles/article-registry.ts</code>; the reuse threshold from
          <code>directives/design-system.md</code>; each routing row from the named guide's own
          <code>When to use</code> section; the native attribute's required exposure and discouraged status from the
          HTML standard section cited in the agent doc.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Two orderings decide most surfaces: how far a pattern takes the reader from what they were doing, and how much
          of the surface it owns. Both have a cheapest rung that works, and the cheapest rung that works is the answer.
        </p>

        <h3>The interruption ladder</h3>
        <p>
          Climb only when the rung below genuinely fails. Each rung costs the reader something the rung below does not.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rung</th>
                <th>What it takes from the reader</th>
                <th>Mechanics owned by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>In place &mdash; expand, reveal, or another route</td>
                <td>Nothing; the address still describes what is on screen</td>
                <td>the kit's container primitives</td>
              </tr>
              <tr>
                <td>Anchored panel</td>
                <td>The page stays live, but the panel dies on the next outside click</td>
                <td>Popover</td>
              </tr>
              <tr>
                <td>Edge panel</td>
                <td>
                  A slice of the viewport; the mask stops the pointer, but focus is not trapped and Tab still walks the
                  page behind it
                </td>
                <td>Drawer</td>
              </tr>
              <tr>
                <td>Modal window</td>
                <td>Everything: focus, the background, the back button, the URL</td>
                <td>Dialog</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The rungs are the three overlay guides' own scopes; the edge-panel row is
          <strong>Drawer</strong>'s own Accessibility section, which records that nothing outside the panel is made
          inert and that focus neither enters nor returns on its own. The closing rule is Dialog's own, which states
          that a dialog is never a default container and that the first answer is to put it on the page.
        </p>

        <h3>The surface hierarchy</h3>
        <p>
          Containers in this kit nest by intent rather than by depth: a page owns one heading, a section owns a titled
          block, a block owns its content. Three of the kit's surfaces are built on one container rather than beside it
          &mdash; the reading wrapper, the definition block, and the quiz shell all sit on
          <code>app-standard-container</code> &mdash; so extending that chain is cheaper than starting a parallel one.
          The rest are siblings, not layers: the container's own <code>When not to use</code> routes the card grid, the
          one-line callout, the sidebar list, and the metric tile away to primitives of their own. Which of them fits
          which content is stated in each primitive's own <code>When not to use</code>, and they name each other
          explicitly.
        </p>
        <p class="src-note">
          Composition read from <code>src/assets/design-system/standard-container.md</code> and the
          <code>When not to use</code> sections of the sibling kit docs in the same directory;
          <code>node scripts/design-guides.mjs sections &quot;when not to use&quot; --layer kit</code>
          returns them together.
        </p>

        <h3>What this corpus does not decide</h3>
        <p>
          Named narrowly, so the gap is not mistaken for a rule. The <code>layouts</code> shelf answers the anatomy of
          three page types &mdash; <strong>Article Layout</strong>, <strong>Demo Layout</strong>, and
          <strong>Hub Layout</strong> &mdash; and grid rhythm and spacing composition beyond them have no documented
          answer here, so a surface that needs one is making the decision itself. On the library side, some components
          the package exports are explained by no guide yet; their boundaries exist only where a sibling guide happens
          to mention them, so choosing one of them is a decision without an owning <code>When to use</code>.
          Everything outside those two gaps is either a kit primitive with a doc or a guide with a
          <code>When to use</code>.
        </p>
        <p class="src-note">
          Category set read from <code>src/app/dev/articles/article-registry.ts</code>, which is also what
          <code>node scripts/design-guides.mjs list --json</code> serves; the uncovered library components are what
          <code>node scripts/design-guides.mjs coverage</code> prints, counted from each guide's <code>covers:</code>
          list against the package's own exports.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          Pattern selection has <strong>no runtime behavior at all</strong> &mdash; it measures nothing and reflows
          nothing, because it happens before any markup exists. What the viewport changes is which patterns remain
          available, and three of them fail early enough to decide the choice rather than the styling: a segmented
          control has to fit its whole set on one line at the narrowest width you support, a tab strip scrolls sideways
          past roughly four labels and the off-screen choices stop existing, and a column set neither shrinks nor wraps.
          Design guidance: choose the pattern at 360&nbsp;px first and let the wide viewport inherit it &mdash; a
          segmented control that does not fit becomes a select, a tab strip that does not fit becomes routes or stacked
          sections, and a table that does not fit drops columns or scrolls inside its wrapper. The per-pattern
          breakpoints and the measured widths behind them belong to the owning guides, and the string lengths that push
          a control past its width belong to <strong>I18n &amp; Localization</strong>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          The decision is three questions, and none of them needs the app running. Reading the owning guide costs less
          than the review that follows the wrong pattern.
        </p>

        <h3>The three questions, as calls</h3>
        <pre class="code-block"><code>{{ decideSnippet }}</code></pre>
        <p class="src-note">
          Commands and their layers from <code>scripts/design-guides.mjs</code>, whose reading ladder is set out in
          <code>directives/design-system.md</code>; both layers are served by the same script, so
          <code>--layer</code> and <code>--scope</code> are the only difference between asking the gallery and asking
          the guides.
        </p>

        <h3>Adding a pattern the kit does not have</h3>
        <pre class="code-block"><code>{{ addPatternSnippet }}</code></pre>
        <p class="src-note">
          The registry-or-exclusion fork and its failure modes from
          <code>scripts/check-design-system.mjs</code>, which fails a component that is in neither
          <code>src/app/dev/design-registry.ts</code> nor <code>src/app/dev/design-registry.exclusions.json</code>, and
          equally one that is in both.
        </p>

        <h3>What a gate can settle about a pattern, and what it cannot</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Check</th>
                <th>Settles</th>
                <th>Cannot settle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>scripts/check-design-system.mjs</code></td>
                <td>
                  that every component under the components tree was consciously classed as a reusable primitive or a
                  one-off, and that a registered one has a doc and a live demo
                </td>
                <td>whether the primitive you registered duplicates one that was already there</td>
              </tr>
              <tr>
                <td><code>scripts/check-design-guides.mjs</code></td>
                <td>
                  that a guide's registry entry, agent doc, tabs, and route agree, and that its citations still exist
                </td>
                <td>whether the pattern that guide documents was the right one for your surface</td>
              </tr>
              <tr>
                <td><code>scripts/check-i18n-keys.mjs</code></td>
                <td>that a literal key in your markup resolves, in all four language variants</td>
                <td>whether the resolved string still fits the control you chose</td>
              </tr>
              <tr>
                <td><code>scripts/check-contrast.mjs</code></td>
                <td>
                  that a kit token pair, and each Optimus UI widget pair the gate resolves from the Aura preset as the
                  kit configures it, meets the criterion that governs it, per visual style and mode
                </td>
                <td>
                  a pair no row lists &mdash; a widget the gate does not measure, or a color a component composes at
                  runtime with opacity or a gradient
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off the four scripts named in the first column; the contrast row's scope is the header of
          <code>docs/generated/CONTRAST.MD</code>, and <strong>Color System</strong> owns the compilat those numbers are
          quoted from.
        </p>

        <h3>Before you call the pattern chosen</h3>
        <ul class="checklist">
          <li>
            The gallery was asked first, and the answer was recorded &mdash; reuse, extend, or a reason neither fits.
          </li>
          <li>The owning guide's <code>When to use</code> was read, not remembered.</li>
          <li>The pattern is the cheapest rung of the interruption ladder that still works.</li>
          <li>Anything that must be linkable, reloadable, or shareable has a route.</li>
          <li>Every explanation has a trigger a keyboard reaches; no help text sits in a native <code>title</code>.</li>
          <li>The choice was made at the narrowest width you support, not at the desktop one.</li>
          <li>The longest translation of every label still fits the pattern, or the pattern wraps.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Translation does not change a pattern's behavior; it changes whether the pattern was ever the right one.
          Three choices are decided by string length before they are decided by anything else.
        </p>

        <h3>The choices a longer string overturns</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>What the longer string does to it</th>
                <th>The choice that survives</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Segmented control</td>
                <td>
                  The set no longer fits one line, and the control either wraps into an ambiguous block or pushes the
                  row sideways
                </td>
                <td>A select, whose width is independent of the option labels</td>
              </tr>
              <tr>
                <td>Tab strip</td>
                <td>
                  Labels grow, the strip scrolls, and the choices past the edge stop existing for anyone not looking for
                  them
                </td>
                <td>Routes, or stacked sections with headings</td>
              </tr>
              <tr>
                <td>Icon-only control with a tooltip</td>
                <td>
                  Nothing visible changes &mdash; which is the risk: the whole meaning now rides on one translated
                  string in an overlay
                </td>
                <td>A labeled control, wherever the row has the width for one</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The failure modes are the owning guides' own narrow-width statements &mdash; Select Button on fitting one
          line, Tabs on the scrolling strip; the length budget that triggers them is measured in
          <strong>I18n &amp; Localization</strong>, which this guide quotes rather than re-measures.
        </p>

        <h3>A simplified reading level is a language, not a mode</h3>
        <p>
          A variant written for easier reading is a separate language with its own strings, so it reaches the same
          pattern with different wording &mdash; sometimes shorter, sometimes not. Two consequences for selection: a
          pattern whose meaning is carried by an icon shifts the entire burden onto the overlay string, which is exactly
          the string a reader of a simplified variant is least able to spare; and a pattern that hides options behind a
          disclosure asks that reader to remember what was hidden. Prefer the pattern that leaves the words on screen
          when the row can afford them.
        </p>
        <p class="src-note">
          The variant model, the fallback chain, and the measured expansion budget are
          <strong>I18n &amp; Localization</strong>'s; this guide states only which pattern that budget rules out.
        </p>

        <h3>What selection does not decide</h3>
        <p>
          Where a string lives, how a key is named, which language answers on a miss and what an unresolved key renders
          are all <strong>I18n &amp; Localization</strong>'s. The document language, the writing direction, and the
          accessible name a chosen control must carry are <strong>Accessibility Guidelines</strong>'. This guide owns
          only the step before both: whether the pattern can hold the string at all.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> &mdash; 2026-09-23 &mdash; The declared gaps are restated: the library tooltip, menu,
            accordion, and stepper have guides now, so the <code>planned:</code> list is no longer the gap; the uncovered
            library components are what <code>design-guides.mjs coverage</code> prints, and the layouts shelf answers
            three page types. The contrast gate's row covers the Optimus UI widget pairs it now measures, and the
            key gate's row its four-variant parity.
          </li>
          <li>
            <strong>v0.5</strong> &mdash; 2026-08-24 &mdash; Re-verified against PrimeNG 22.1.2: this guide carries no
            library DOM claims of its own, so only the provenance pin moved. The rendered <code>p-card</code> comparison
            uses the <code>#header</code> template as a direct child, which is exactly the surviving v22 route. The
            declared gaps (eight <code>planned:</code> ids, grid rhythm) re-checked against the registry; the
            <code>/feedback</code> reference page added no usage that contradicts any documented boundary (its PrimeNG
            surface is <code>p-checkbox</code> and <code>p-message</code>, both used per their owning guides).
          </li>
          <li>
            <strong>v0.4</strong> &mdash; 2026-08-18 &mdash; The provenance note under the declared gaps no longer
            points at the coverage map for what nothing covers: that line prints only for a category holding no guide,
            and the corpus now has none. It points at the registry and <code>list --json</code> instead. The uncovered
            ground is named the same way the entry below already reported it &mdash; grid rhythm and spacing
            composition.
          </li>
          <li>
            <strong>v0.3</strong> &mdash; 2026-08-18 &mdash; The <code>layouts</code> shelf is no longer empty: the
            declared-gaps section and the boundary list now route the anatomy of an article page to
            <strong>Article Layout</strong>, and name only grid rhythm and spacing composition as still uncovered.
          </li>
          <li>
            <strong>v0.2</strong> &mdash; 2026-08-18 &mdash; Corrections pass. The native <code>title</code> rule is
            restated the way the HTML standard states it: the accessible exposure is <em>required</em> of user agents,
            is not delivered, and reliance on the attribute is discouraged for exactly that reason. The source citation
            moves to &sect;&nbsp;3.2.6.1 of the standard, and SC 1.4.13 is requalified as the contract an author-built
            hover bubble owes &mdash; its user-agent exception is why it does not govern the native attribute. The
            ceiling on a <code>pTooltip</code> string is grounded in that criterion and in the accessible-name rule, not
            in prevailing usage. The surface hierarchy names the three primitives actually built on the container and
            marks the rest as siblings its <code>When not to use</code> routes elsewhere. The drawer rung is corrected
            to the mechanics that guide records: the mask stops the pointer, nothing is made inert, and Tab still
            reaches the page behind. Overlay addressability widens from a query param to the URL, and the Tabs routing
            row regains the query-param branch its own guide states.
          </li>
          <li>
            <strong>v0.1</strong> &mdash; 2026-08-18 &mdash; Initial guide: the three-layer question, the five needs the
            kit answers before the library is reached, the routing table into the owning guides, the interruption
            ladder, the two declared gaps in the corpus, the narrow-screen and translation constraints that overturn a
            choice, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class UiPatternSelectionArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly decideSnippet: string = '# 1. Has the kit already built it? (the gallery layer)\n' +
    'node scripts/design-guides.mjs list --layer kit\n' +
    'node scripts/design-guides.mjs search "tooltip" --scope all\n' +
    '#    A miss names the scopes it read, so "not documented" and "wrong word"\n' +
    '#    stay distinguishable. Roughly 80% coverage means use or extend it.\n' +
    '\n' +
    '# 2. If not, which guide owns the boundary? (the guides layer)\n' +
    'node scripts/design-guides.mjs sections "When to use"     # all of them, one call\n' +
    'node scripts/design-guides.mjs section selectbutton "when to use"\n' +
    'node scripts/design-guides.mjs bundle dialog              # a guide + its neighbors\n' +
    '#    Read the rule. A threshold you remember is a threshold that has moved.\n' +
    '\n' +
    '# 3. Neither layer owns it -> plain HTML, and no dependency is added.';

  readonly addPatternSnippet: string = '// A component under src/app/components/ must land on one side of a fork,\n' +
    '// or the design-system gate fails the build:\n' +
    '//\n' +
    '//   reusable primitive -> an entry in src/app/dev/design-registry.ts,\n' +
    '//                         a doc at src/assets/design-system/<slug>.md in its\n' +
    '//                         six sections, and a live demo case in the demo host\n' +
    '//\n' +
    '//   one-off / page-specific -> a line in\n' +
    '//                         src/app/dev/design-registry.exclusions.json,\n' +
    '//                         keyed by path, with a one-sentence reason\n' +
    '//\n' +
    '// Being in BOTH is ambiguous and fails as well. The fork is the point: it\n' +
    '// forces the reuse question at the moment the component is created, which is\n' +
    '// the only moment it is cheap to answer.\n' +
    '\n' +
    'node scripts/check-design-system.mjs   // the fork, the docs, the demos\n' +
    'node scripts/check-design-guides.mjs   // registry <-> doc <-> tabs <-> routes';
}
