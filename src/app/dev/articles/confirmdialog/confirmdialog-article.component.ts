import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from '@openng/optimus-ui/api';
import { ButtonModule } from '@openng/optimus-ui/button';
import { ConfirmDialogModule } from '@openng/optimus-ui/confirmdialog';
import { ConfirmPopupModule } from '@openng/optimus-ui/confirmpopup';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, ButtonModule, ConfirmDialogModule, ConfirmPopupModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-confirmdialog-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-confirmdialog-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-confirmdialog-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }

      app-confirmdialog-article .outcome {
        margin: 0 0 0.75rem;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
        min-height: 1.4em;
      }

      app-confirmdialog-article .mock {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      app-confirmdialog-article .mock__title {
        margin: 0;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--surface-border);
        font-weight: 600;
      }

      app-confirmdialog-article .mock__title--empty {
        min-height: 1.4em;
      }

      app-confirmdialog-article .mock__note {
        font-weight: 400;
        font-size: 0.78rem;
        color: var(--text-color-secondary);
      }

      app-confirmdialog-article .mock__msg {
        margin: 0;
        font-size: 0.9rem;
      }

      app-confirmdialog-article .mock__row {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      app-confirmdialog-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-confirmdialog-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-confirmdialog-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-confirmdialog-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-confirmdialog-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-confirmdialog-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-confirmdialog-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-confirmdialog-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-confirmdialog-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-confirmdialog-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-confirmdialog-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Confirm Dialog and Confirm Popup (Guides, category `library`).
 *
 * Two components, one service. Everything the article claims was read off the
 * shipped sources of Optimus UI 2.0.2; `openng-optimus-ui-confirmdialog.mjs` and `openng-optimus-ui-confirmpopup.mjs`
 * below are the fesm2022 bundles of the same names.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - ConfirmationService is a plain Subject pair; confirm() pushes the
 *     Confirmation, close() pushes null (openng-optimus-ui-api.mjs:21-52). Not providedIn root,
 *     hence the component-level provider here.
 *   - ConfirmEventType ACCEPT=0, REJECT=1, CANCEL=2 (openng-optimus-ui-api.mjs:12-14).
 *   - Both instances filter by key (openng-optimus-ui-confirmdialog.mjs:343, openng-optimus-ui-confirmpopup.mjs:232);
 *     the null branch hides before the key test (openng-optimus-ui-confirmdialog.mjs:339-342,
 *     openng-optimus-ui-confirmpopup.mjs:222-225), so close() is global.
 *   - Dialog: role="alertdialog" hardcoded on the inner p-dialog (:523); message
 *     via [innerHTML] (:570); reject button rendered before accept (:580, :597);
 *     close() emits CANCEL on the reject callback (:448-453), onReject emits
 *     REJECT (:492-497), onAccept emits with no argument (:486-491).
 *   - Dialog dead inputs: defaultFocus (:233) is read only in getElementToFocus
 *     (:411-427), which is called nowhere and looks for .p-confirm-dialog-accept
 *     while the buttons carry cx('pcAcceptButton') = p-confirmdialog-accept-button
 *     (:17-23). focusTrap (:228), rtl (:191), transitionOptions (:223) are never
 *     forwarded to the inner p-dialog; closeAriaLabel (:131), acceptAriaLabel
 *     (:136), rejectAriaLabel (:156) are never read at all — the button names
 *     come from acceptButtonProps.ariaLabel (:586, :603).
 *   - Dialog focus: p-dialog focusOnShow (openng-optimus-ui-dialog.mjs:247) calls focus() from
 *     onAfterEnter (openng-optimus-ui-dialog.mjs:949-952); focus() takes the first focusable in
 *     #content and falls back to #footer (openng-optimus-ui-dialog.mjs:633-641, template
 *     openng-optimus-ui-dialog.mjs:1119, :1123). Confirm dialog content is icon + message, so the
 *     first footer button wins, and that is Reject.
 *   - aria-labelledby comes from the header id (openng-optimus-ui-dialog.mjs:513-516), rendered on
 *     the title span (openng-optimus-ui-dialog.mjs:1066). No aria-describedby anywhere: grep for
 *     activeElement/aria-describedby over openng-optimus-ui-dialog.mjs, openng-optimus-ui-confirmdialog.mjs, and
 *     openng-optimus-ui-confirmpopup.mjs returns nothing.
 *   - Popup: role="alertdialog" plus pFocusTrap (:502); message interpolated as
 *     text (:515); defaultFocus honored via handleFocus (:301, :304-309) with
 *     'none' landing in the reject branch; onAccept/onReject refocus
 *     confirmation.target (:373, :380); outside click (:410-415), resize
 *     (:425-429) and target scroll (:443-447) call hide() only; Escape maps to
 *     onReject (:285-289); alignOverlay needs confirmation.target (:323-328).
 *   - Popup dead inputs: baseZIndex (:131) — setZIndex uses config.zIndex.overlay
 *     (:329-333); showTransitionOptions (:115) and hideTransitionOptions (:121)
 *     are deprecated and unread.
 *   - Labels: acceptButtonLabel/rejectButtonLabel fall back to
 *     config.getTranslation (openng-optimus-ui-confirmdialog.mjs:504-509, openng-optimus-ui-confirmpopup.mjs:476-481)
 *     with TranslationKeys ACCEPT/REJECT (openng-optimus-ui-api.mjs:796-797) and the config
 *     defaults 'Yes'/'No' (openng-optimus-ui-config.mjs:130-131). The kit's setTranslation call
 *     replaces the aria block only, so those two stay English.
 *   - zIndex bases: modal 1100, overlay 1000 (openng-optimus-ui-config.mjs:235-240).
 *   - Tokens from @openng/optimus-ui-themes/dist/aura/confirmdialog/index.mjs and
 *     .../confirmpopup/index.mjs, single-line dist bundles; the rules that consume
 *     them from @openng/optimus-ui-styles/dist/confirmdialog/index.mjs (14 lines)
 *     and .../confirmpopup/index.mjs (91 lines). Neither carries a media query.
 *   - docs/generated/CONTRAST.MD gates the dialog panel ("dialog":
 *     dialog.color on dialog.background, 10.35-17.72:1; the close icon; "focus
 *     ring" on dialog.background), which the confirm dialog's message and icon
 *     ({overlay.modal.color}) inherit. The popup's text on
 *     {overlay.popover.background} has no row, so the Design tab names only the
 *     criterion for it. Accept/reject are p-buttons: the kit's one focus ring.
 */
@Component({
  selector: 'app-confirmdialog-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  providers: [ConfirmationService],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'confirmdialog'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two components share one service. You never bind their visibility: you call
          <code>ConfirmationService.confirm()</code> with an object that carries the message, the labels, and the
          callbacks, and whichever instance matches the key opens. The dialog takes over the screen; the popup hangs
          off the element you name as the target.
        </p>

        <h3>Both surfaces, one service</h3>
        <div class="stage stage--row">
          <p-button label="Delete via dialog" severity="danger" (onClick)="askDialog()" />
          <p-button label="Delete via popup" severity="danger" [outlined]="true" (onClick)="askPopup($event)" />
          <p-button label="Reset log" severity="secondary" [text]="true" (onClick)="outcome.set(emptyLog)" />
        </div>
        <p class="outcome" aria-live="polite">{{ outcome() }}</p>
        <p-confirmDialog key="guideDemo" header="Delete this draft?" />
        <p-confirmpopup key="guidePopup" />
        <p class="src-note">
          Both instances are live and both are keyed, so each call reaches exactly one of them
          (<code>openng-optimus-ui-confirmdialog.mjs:343</code>, <code>openng-optimus-ui-confirmpopup.mjs:232</code>). The line above reports which
          callback ran and what it received.
        </p>

        <h3>What the dialog emits</h3>
        <pre class="code-block"><code>{{ dialogMarkupSnippet }}</code></pre>
        <p class="src-note">
          The confirm dialog renders an inner <code>p-dialog</code> with <code>role="alertdialog"</code> written into
          the template (<code>openng-optimus-ui-confirmdialog.mjs:523</code>). The name comes from the header id computed by the dialog
          (<code>openng-optimus-ui-dialog.mjs:513-516</code>) and rendered on the title span (<code>openng-optimus-ui-dialog.mjs:1066</code>); the message
          span carries no id, so nothing describes the dialog. Focus is placed by the inner dialog once the overlay
          has entered (<code>openng-optimus-ui-dialog.mjs:949-952</code>) on the first focusable element it finds,
          content before footer (<code>openng-optimus-ui-dialog.mjs:633-641</code>) — and the content here is an icon
          and a message, so the reject button is the first candidate. The close button in the header takes its name
          from <code>closeAriaLabel</code> alone (<code>openng-optimus-ui-dialog.mjs:1099</code>), which the confirm
          dialog never binds, so it renders without one.
        </p>

        <h3>What the popup emits</h3>
        <pre class="code-block"><code>{{ popupMarkupSnippet }}</code></pre>
        <p class="src-note">
          The popup root carries <code>role="alertdialog"</code> and the focus-trap directive
          (<code>openng-optimus-ui-confirmpopup.mjs:498-502</code>) but no <code>aria-modal</code>, no <code>aria-labelledby</code> and no
          <code>aria-describedby</code>. Its buttons take their <code>aria-label</code> from the very label they
          already show (<code>:529</code>, <code>:548</code>).
        </p>

        <h3>Which close path reports what</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>How it closes</th><th>Dialog</th><th>Popup</th></tr>
            </thead>
            <tbody>
              <tr><td>Accept button</td><td>{{ m.pathAcceptD }}</td><td>{{ m.pathAcceptP }}</td></tr>
              <tr><td>Reject button</td><td>{{ m.pathRejectD }}</td><td>{{ m.pathRejectP }}</td></tr>
              <tr><td>Escape</td><td>{{ m.pathEscapeD }}</td><td>{{ m.pathEscapeP }}</td></tr>
              <tr><td>Close icon / outside click</td><td>{{ m.pathMaskD }}</td><td>{{ m.pathMaskP }}</td></tr>
              <tr><td>Scroll or resize</td><td>{{ m.pathScrollD }}</td><td>{{ m.pathScrollP }}</td></tr>
              <tr><td><code>ConfirmationService.close()</code></td><td>{{ m.pathCloseD }}</td><td>{{ m.pathCloseP }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Dialog paths from <code>openng-optimus-ui-confirmdialog.mjs:448-453</code> (<code>close()</code>),
          <code>:478-485</code> (<code>onVisibleChange</code>), <code>:486-491</code> and <code>:492-497</code>;
          popup paths from <code>openng-optimus-ui-confirmpopup.mjs:285-289</code>, <code>:368-374</code>, <code>:375-381</code>,
          <code>:410-415</code>, <code>:425-429</code> and <code>:443-447</code>. The dialog's scroll behavior is
          the inherited <code>p-dialog</code> one: it blocks page scroll rather than closing
          (<code>openng-optimus-ui-confirmdialog.mjs:186</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which surface, and whether to ask at all</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>The situation</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>The action can be undone</td>
                <td>do it, then offer undo</td>
                <td>{{ m.whenUndo }}</td>
              </tr>
              <tr>
                <td>Irreversible, and the reader is about to leave the context</td>
                <td><code>p-confirmDialog</code></td>
                <td>{{ m.whenDialog }}</td>
              </tr>
              <tr>
                <td>Irreversible, small, and it belongs to one control</td>
                <td><code>p-confirmpopup</code></td>
                <td>{{ m.whenPopup }}</td>
              </tr>
              <tr>
                <td>The reader has to supply something</td>
                <td><code>p-dialog</code></td>
                <td>{{ m.whenDialogPlain }}</td>
              </tr>
              <tr>
                <td>Nothing is at stake, you only want to report</td>
                <td>a message or a toast</td>
                <td>{{ m.whenMessage }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The popup's three dismissal paths — click outside
          (<code>openng-optimus-ui-confirmpopup.mjs:410-415</code>), window resize (<code>:425-429</code>) and scroll of the target
          (<code>:443-447</code>) — call <code>hide()</code> and nothing else, so a reader can make the question go
          away without either callback running. The dialog has no such path: every way out of it emits on
          <code>accept</code> or on <code>reject</code>.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a question answered with Yes and No</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__msg">Are you sure?</p>
                <div class="mock__row">
                  <p-button label="No" severity="secondary" size="small" [text]="true" />
                  <p-button label="Yes" size="small" />
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddVerbBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the verb of the action on the accept button</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__msg">Delete the draft “Week 3 notes”? This cannot be undone.</p>
                <div class="mock__row">
                  <p-button label="Keep draft" severity="secondary" size="small" [text]="true" />
                  <p-button label="Delete draft" severity="danger" size="small" />
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddVerbGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages are rendered buttons in the footer order the components use — reject first, accept second
          (<code>openng-optimus-ui-confirmdialog.mjs:580</code> and <code>:597</code>). The default labels are the reason the left one
          is so easy to ship: with no <code>acceptLabel</code> the components fall back to
          <code>config.getTranslation</code> (<code>openng-optimus-ui-confirmdialog.mjs:504-509</code>), whose defaults are
          <code>Yes</code> and <code>No</code> (<code>openng-optimus-ui-config.mjs:130-131</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a confirm dialog with no header</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__title mock__title--empty"><span class="mock__note">(empty title span)</span></p>
                <p class="mock__msg">The draft will be deleted. This cannot be undone.</p>
                <p-button label="Open unnamed dialog" severity="secondary" size="small" (onClick)="askUnnamed()" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddHeaderBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a header that names the decision</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__title">Delete this draft?</p>
                <p class="mock__msg">The draft will be deleted. This cannot be undone.</p>
                <p-button label="Open named dialog" severity="secondary" size="small" (onClick)="askDialog()" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddHeaderGood }}</p>
          </div>
        </div>
        <p class="src-note">
          The title rows are mock-ups of the header the inner dialog renders; the buttons below them open the same
          live instances as the stage at the top of the page. <code>p-dialog</code> computes its
          <code>aria-labelledby</code> from the header id (<code>openng-optimus-ui-dialog.mjs:513-516</code>) and renders that id on the
          title span whether or not there is a header to put in it (<code>openng-optimus-ui-dialog.mjs:1066</code>). The consequence
          follows from those two lines: with an empty header, the id the alertdialog is labeled by points at an
          element with no text in it.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          <code>option()</code> looks in the <code>Confirmation</code> first and only then at the component
          (<code>openng-optimus-ui-confirmdialog.mjs:397-405</code>), which is why almost everything worth setting belongs in the call
          rather than in the template.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura value</th><th>What it does</th></tr>
            </thead>
            <tbody>
              <tr><td><code>confirmdialog.icon.size</code></td><td><code>2rem</code></td><td>{{ m.tokCdIconSize }}</td></tr>
              <tr>
                <td><code>confirmdialog.icon.color</code></td>
                <td><code>&#123;overlay.modal.color&#125;</code></td>
                <td>{{ m.tokCdIconColor }}</td>
              </tr>
              <tr><td><code>confirmdialog.content.gap</code></td><td><code>1rem</code></td><td>{{ m.tokCdGap }}</td></tr>
              <tr>
                <td><code>confirmpopup.background</code></td>
                <td><code>&#123;overlay.popover.background&#125;</code></td>
                <td>{{ m.tokCpBg }}</td>
              </tr>
              <tr><td><code>confirmpopup.gutter</code></td><td><code>10px</code></td><td>{{ m.tokCpGutter }}</td></tr>
              <tr><td><code>confirmpopup.arrowOffset</code></td><td><code>1.25rem</code></td><td>{{ m.tokCpArrow }}</td></tr>
              <tr><td><code>confirmpopup.icon.size</code></td><td><code>1.5rem</code></td><td>{{ m.tokCpIconSize }}</td></tr>
              <tr><td><code>confirmpopup.footer.gap</code></td><td><code>0.5rem</code></td><td>{{ m.tokCpFooterGap }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from the exports of <code>&#64;openng/optimus-ui-themes/dist/aura/confirmdialog/index.mjs</code> and
          <code>&#64;openng/optimus-ui-themes/dist/aura/confirmpopup/index.mjs</code>, both single-line dist bundles.
          The rules that consume them are
          <code>&#64;openng/optimus-ui-styles/dist/confirmdialog/index.mjs:2-13</code> and
          <code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:2-34</code>. The arrow rule reads two
          values, not one: <code>calc(arrow.offset + arrow.left)</code>
          (<code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:52</code>), where the second is the custom
          property <code>--p-confirmpopup-arrow-left</code> that <code>alignArrow()</code> sets from the distance
          between the overlay and its target on every open (<code>openng-optimus-ui-confirmpopup.mjs:334-343</code>,
          called at <code>:299</code>). Open the popup from a wide trigger and read that property off the overlay to
          see it change.
        </p>

        <h3>What the visual style changes</h3>
        <p>{{ m.styleFrame }}</p>
        <p class="src-note">
          The frame rules are the <code>.p-dialog</code> selectors inside the <code>html.style-&lt;name&gt;</code> blocks of
          <code>src/styles.scss</code>; the radius scale is each style's <code>presetOverrides.primitive.borderRadius</code> in
          <code>src/app/services/ui-styles.ts</code>. No style block names <code>.p-confirmpopup</code> or
          <code>.p-confirmdialog</code>.
        </p>

        <h3>Contrast: which criterion applies</h3>
        <p>{{ m.contrastPara }}</p>
        <p class="src-note">
          The dialog surface is gated: <code>docs/generated/CONTRAST.MD</code>, group <code>dialog</code>, measures
          <code>dialog.color</code> on <code>dialog.background</code> at 10.35:1 light / 17.72:1 dark in every
          visual style, which is the confirm dialog's message and its icon (<code>&#123;overlay.modal.color&#125;</code>);
          the close icon and the kit's 2px focus ring on that panel are gated too (<code>dialog</code>,
          <code>focus ring</code>). The popup has no row — its text on <code>&#123;overlay.popover.background&#125;</code>
          is Aura's pair — so the token names above are the pairs to check if you re-tone it. Accept and reject are
          <code>p-button</code>s and carry the button guide's gated labels and ring.
        </p>

        <h3>Narrow viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          Neither component stylesheet contains a media query or a container query, and the popup's stylesheet sets
          no width at all — <code>position: absolute</code> at
          <code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:3</code>, the surface rules at
          <code>:7-11</code>, content and footer at <code>:15-34</code>. The dialog's per-breakpoint widths are
          generated into an injected style element from the <code>breakpoints</code> input
          (<code>openng-optimus-ui-confirmdialog.mjs:428-447</code>), and that element is built once, from
          <code>onInit</code> (<code>:358-360</code>). The popup closes on window resize unless the device reports
          touch (<code>openng-optimus-ui-confirmpopup.mjs:425-429</code>).
        </p>

        <h3>Where they sit in the stack</h3>
        <p>{{ m.zIndex }}</p>
        <p class="src-note">
          The dialog inherits the modal layer of its inner <code>p-dialog</code>; the popup registers itself under
          the overlay layer in <code>setZIndex()</code> (<code>openng-optimus-ui-confirmpopup.mjs:329-333</code>). The two bases are
          <code>modal: 1100</code> and <code>overlay: 1000</code>
          (<code>openng-optimus-ui-config.mjs:235-240</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs of p-confirmDialog</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Default</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>key</code></td><td>—</td><td>{{ m.apiKey }}</td></tr>
              <tr><td><code>header</code> · <code>message</code> · <code>icon</code></td><td>—</td><td>{{ m.apiContent }}</td></tr>
              <tr>
                <td><code>acceptLabel</code> · <code>rejectLabel</code></td>
                <td>—</td>
                <td>{{ m.apiLabels }}</td>
              </tr>
              <tr>
                <td><code>acceptVisible</code> · <code>rejectVisible</code></td>
                <td><code>true</code></td>
                <td>{{ m.apiVisible }}</td>
              </tr>
              <tr><td><code>closable</code></td><td><code>true</code></td><td>{{ m.apiClosable }}</td></tr>
              <tr><td><code>closeOnEscape</code></td><td><code>true</code></td><td>{{ m.apiEscape }}</td></tr>
              <tr><td><code>dismissableMask</code></td><td>unset</td><td>{{ m.apiMask }}</td></tr>
              <tr><td><code>modal</code> · <code>blockScroll</code></td><td><code>true</code></td><td>{{ m.apiModal }}</td></tr>
              <tr><td><code>breakpoints</code></td><td>—</td><td>{{ m.apiBreakpoints }}</td></tr>
              <tr><td><code>position</code> · <code>draggable</code></td><td><code>center</code> · <code>true</code></td><td>{{ m.apiPosition }}</td></tr>
              <tr><td><code>appendTo</code></td><td><code>body</code></td><td>{{ m.apiAppendTo }}</td></tr>
              <tr>
                <td><code>defaultFocus</code></td>
                <td><code>accept</code></td>
                <td>{{ m.apiDefaultFocus }}</td>
              </tr>
              <tr>
                <td><code>focusTrap</code> · <code>rtl</code> · <code>transitionOptions</code></td>
                <td><code>true</code> · <code>false</code> · <code>150ms …</code></td>
                <td>{{ m.apiUnforwarded }}</td>
              </tr>
              <tr>
                <td><code>closeAriaLabel</code> · <code>acceptAriaLabel</code> · <code>rejectAriaLabel</code></td>
                <td>—</td>
                <td>{{ m.apiAriaLabels }}</td>
              </tr>
              <tr>
                <td><code>dt</code> · <code>unstyled</code> · <code>pt</code> · <code>ptOptions</code></td>
                <td>—</td>
                <td>{{ m.apiInherited }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared inputs from the compiled component metadata at <code>openng-optimus-ui-confirmdialog.mjs:517</code> and the decorator
          block at <code>:731-838</code>. The last row is in neither: <code>dt</code>, <code>unstyled</code>,
          <code>pt</code> and <code>ptOptions</code> are signal inputs inherited from <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:42-63</code>) — walk the inheritance chain before calling an
          Optimus API table complete. The only output is <code>onHide</code>.
        </p>

        <h3>Seven dead inputs, three ways of failing</h3>
        <p>{{ m.deadInputs }}</p>
        <pre class="code-block"><code>{{ deadInputSnippet }}</code></pre>
        <p class="src-note">
          <code>getElementToFocus()</code> is defined at <code>openng-optimus-ui-confirmdialog.mjs:411-427</code> and its name occurs
          nowhere else in the file; the class names it queries do not match the ones
          <code>getButtonStyleClass()</code> puts on the buttons (<code>:17-23</code>, <code>:406-410</code>).
          <code>focusTrap</code>, <code>rtl</code> and <code>transitionOptions</code> are declared at
          <code>:228</code>, <code>:191</code> and <code>:223</code> and appear in no binding of the inner
          <code>p-dialog</code> (template at <code>:518-616</code>), which carries all three as inputs of its own.
          <code>closeAriaLabel</code>, <code>acceptAriaLabel</code> and <code>rejectAriaLabel</code>
          (<code>:131</code>, <code>:136</code>, <code>:156</code>) occur only there and in the decorator block; the
          footer buttons read <code>acceptButtonProps.ariaLabel</code> instead (<code>:586</code>,
          <code>:603</code>), and the inner dialog's own <code>closeAriaLabel</code> is left unbound as well.
        </p>

        <h3>Inputs of p-confirmpopup</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Default</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>key</code></td><td>—</td><td>{{ m.cpKey }}</td></tr>
              <tr><td><code>defaultFocus</code></td><td><code>accept</code></td><td>{{ m.cpDefaultFocus }}</td></tr>
              <tr><td><code>visible</code></td><td>unset</td><td>{{ m.cpVisible }}</td></tr>
              <tr><td><code>appendTo</code></td><td><code>body</code></td><td>{{ m.cpAppendTo }}</td></tr>
              <tr><td><code>autoZIndex</code></td><td><code>true</code></td><td>{{ m.cpAutoZ }}</td></tr>
              <tr><td><code>baseZIndex</code></td><td><code>0</code></td><td>{{ m.cpBaseZ }}</td></tr>
              <tr>
                <td><code>showTransitionOptions</code> · <code>hideTransitionOptions</code></td>
                <td>—</td>
                <td>{{ m.cpTransitions }}</td>
              </tr>
              <tr><td><code>motionOptions</code></td><td>—</td><td>{{ m.cpMotion }}</td></tr>
              <tr><td><code>style</code> · <code>styleClass</code></td><td>—</td><td>{{ m.cpStyle }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared inputs from <code>openng-optimus-ui-confirmpopup.mjs:489</code> and the decorator block at <code>:652-688</code>.
          The popup has no outputs. Everything else it renders — message, icon, labels, button props, the target it
          hangs off — arrives in the <code>Confirmation</code>, not as an input.
        </p>

        <h3>One service, two ways to lose a request</h3>
        <pre class="code-block"><code>{{ routingSnippet }}</code></pre>
        <p class="src-note">
          Key comparison at <code>openng-optimus-ui-confirmdialog.mjs:343</code> and <code>openng-optimus-ui-confirmpopup.mjs:232</code>; the
          <code>null</code> branch that <code>close()</code> triggers runs before it
          (<code>openng-optimus-ui-confirmdialog.mjs:339-342</code>, <code>openng-optimus-ui-confirmpopup.mjs:222-225</code>). A second
          <code>confirm()</code> while one is open replaces <code>confirmation</code> and both emitters without
          emitting or unsubscribing the pair before it (<code>openng-optimus-ui-confirmdialog.mjs:343-354</code>).
        </p>

        <h3>Reading the reject argument</h3>
        <pre class="code-block"><code>{{ rejectSnippet }}</code></pre>
        <p class="src-note">
          <code>ConfirmEventType</code> is <code>ACCEPT = 0</code>, <code>REJECT = 1</code>,
          <code>CANCEL = 2</code> (<code>openng-optimus-ui-api.mjs:12-14</code>). The dialog emits
          <code>CANCEL</code> from <code>close()</code> (<code>openng-optimus-ui-confirmdialog.mjs:448-453</code>) and
          <code>REJECT</code> from the button (<code>:492-497</code>); the popup emits with no argument at all
          (<code>openng-optimus-ui-confirmpopup.mjs:375-378</code>), so the same handler cannot be shared between the two without a
          default.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkHeader }}</li>
          <li>{{ m.checkVerb }}</li>
          <li>{{ m.checkFocus }}</li>
          <li>{{ m.checkReject }}</li>
          <li>{{ m.checkHtml }}</li>
          <li>{{ m.checkKey }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Where the buttons get their words</h3>
        <p>{{ m.i18nLibrary }}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>String</th><th>Comes from</th><th>Moves with a kit language switch?</th></tr>
            </thead>
            <tbody>
              <tr><td>Accept button label</td><td>{{ m.i18nAcceptSrc }}</td><td>{{ m.i18nAcceptSwitch }}</td></tr>
              <tr><td>Reject button label</td><td>{{ m.i18nRejectSrc }}</td><td>{{ m.i18nRejectSwitch }}</td></tr>
              <tr><td>Header and message</td><td>{{ m.i18nBodySrc }}</td><td>{{ m.i18nBodySwitch }}</td></tr>
              <tr><td>Close icon name (dialog)</td><td>{{ m.i18nCloseSrc }}</td><td>{{ m.i18nCloseSwitch }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The fallback chain is <code>acceptLabel</code>, then <code>acceptButtonProps.label</code>, then
          <code>config.getTranslation(TranslationKeys.ACCEPT)</code>
          (<code>openng-optimus-ui-confirmdialog.mjs:504-509</code>, <code>openng-optimus-ui-confirmpopup.mjs:476-481</code>); the keys are
          <code>accept</code> and <code>reject</code> (<code>openng-optimus-ui-api.mjs:796-797</code>) and the
          configuration defaults are <code>Yes</code> and <code>No</code>
          (<code>openng-optimus-ui-config.mjs:130-131</code>). The kit's own push into that configuration replaces the
          <code>aria</code> block and nothing else, so those two keep their English defaults — the reference
          implementation is <code>src/app/services/optimus-a11y.service.ts</code>. That <code>aria</code> block does not reach the
          close icon in any case: <code>p-dialog</code> reads <code>maximizeLabel</code> and
          <code>minimizeLabel</code> out of it (<code>openng-optimus-ui-dialog.mjs:548-553</code>) and names the
          close button from its own <code>closeAriaLabel</code> input
          (<code>openng-optimus-ui-dialog.mjs:1099</code>), which the confirm dialog's template binds neither
          directly nor through <code>closeButtonProps</code>
          (<code>openng-optimus-ui-confirmdialog.mjs:518-616</code>); its own <code>closeAriaLabel</code>
          (<code>:131</code>) is read nowhere. Open a confirm dialog that has a close icon and inspect that button
          for an <code>aria-label</code>. <code>closable</code> also gates the escape listener the inner dialog
          binds (<code>openng-optimus-ui-dialog.mjs:854</code>), so switching it off removes the icon and the
          Escape key together.
        </p>

        <h3>The labels are yours, so bind them reactively</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The kit pattern: <code>TranslationService.translate()</code> read inside a <code>computed</code>, so the
          computed depends on the service's translation-version signal and re-runs on a language switch. A
          <code>Confirmation</code> is a plain object read once when the dialog opens, so the values must be current
          at the moment of the call — which a computed guarantees and a field captured at construction does not.
        </p>

        <h3>Length and direction</h3>
        <p>{{ m.i18nLength }}</p>
        <p class="src-note">
          The popup stylesheet sets no width and no max-width
          (<code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:2-13</code>), and the arrow is placed
          with <code>left</code> (<code>:52</code>) from a value the component measures in page coordinates
          (<code>openng-optimus-ui-confirmpopup.mjs:334-343</code>). The dialog re-renders on a language change because it
          subscribes to the configuration's translation observer
          (<code>openng-optimus-ui-confirmdialog.mjs:361-365</code>); the popup does not subscribe to it at all.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the confirm dialog's
            message and icon are gated through the dialog panel (CONTRAST.MD <code>dialog</code>, 10.35 / 17.72:1),
            its buttons carry the kit ring; the popup still has no row.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016):
            all line refs hold (two corrected: the class map is <code>:17-23</code>, the popup focus trap
            <code>:498</code>); a design section on what the style changes — the per-style <code>.p-dialog</code> frame
            the confirm dialog inherits, the popup's style-dependent radius — and a matching doc pitfall.
          </li>
          <li><strong>1.0</strong> — 2026-09-05 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ConfirmdialogArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly emptyLog: string = 'No answer yet.';
  readonly outcome = signal(this.emptyLog);

  protected readonly confirmationService = inject(ConfirmationService);

  askDialog(): void {
    this.confirmationService.confirm({
      key: 'guideDemo',
      message: 'The draft “Week 3 notes” will be removed. This cannot be undone.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete draft',
      rejectLabel: 'Keep draft',
      acceptButtonProps: { severity: 'danger' },
      accept: () => this.outcome.set('accept() ran — the dialog was confirmed.'),
      reject: (type: ConfirmEventType) =>
        this.outcome.set(
          type === ConfirmEventType.CANCEL
            ? 'reject() ran with CANCEL — Escape, the close icon, or the mask.'
            : 'reject() ran with REJECT — the reject button.',
        ),
    });
  }

  askUnnamed(): void {
    this.confirmationService.confirm({
      key: 'guideDemo',
      header: '',
      message: 'The same dialog, opened without a header.',
      acceptLabel: 'Delete draft',
      rejectLabel: 'Keep draft',
      acceptButtonProps: { severity: 'danger' },
      accept: () => this.outcome.set('accept() ran — the unnamed dialog was confirmed.'),
      reject: () => this.outcome.set('reject() ran — the unnamed dialog was refused.'),
    });
  }

  askPopup(event: MouseEvent): void {
    this.confirmationService.confirm({
      key: 'guidePopup',
      target: event.currentTarget as EventTarget,
      message: 'Delete this draft?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Keep',
      acceptButtonProps: { severity: 'danger' },
      accept: () => this.outcome.set('accept() ran — the popup was confirmed, focus went back to the trigger.'),
      reject: () => this.outcome.set('reject() ran with no argument — the popup passes none.'),
    });
  }

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    // examples — close paths
    pathAcceptD: 'accept() runs, then hide(ACCEPT).',
    pathAcceptP: 'accept() runs, then focus returns to the target.',
    pathRejectD: 'reject(REJECT) runs.',
    pathRejectP: 'reject() runs with no argument, then focus returns to the target.',
    pathEscapeD: 'reject(CANCEL) runs — the same callback as the button, a different argument.',
    pathEscapeP: 'reject() runs, unless the Confirmation set closeOnEscape to false.',
    pathMaskD: 'reject(CANCEL) runs. The mask only dismisses when dismissableMask is set.',
    pathMaskP: 'Nothing runs. The popup hides and neither callback is called.',
    pathScrollD: 'Nothing: the dialog blocks page scroll instead of closing.',
    pathScrollP: 'Nothing runs. Scrolling the target or resizing the window hides it silently.',
    pathCloseD: 'Nothing runs. The dialog hides whatever its key is.',
    pathCloseP: 'Nothing runs. The popup hides whatever its key is.',

    // usage — which surface
    whenUndo:
      'A confirmation costs every reader a step in order to save the rare one from a mistake; undo costs only the reader who made it. Prefer undo wherever the operation can be reversed, and keep the question for what cannot.',
    whenDialog:
      'The dialog is modal, blocks page scroll, and every one of its exits reports back — there is no way for a reader to make the question disappear without an answer being recorded.',
    whenPopup:
      'The popup keeps the decision next to the thing it is about and returns focus to the trigger afterwards. The price is that a click elsewhere, a scroll, or a resize closes it without an answer.',
    whenDialogPlain:
      'These two components render one message and two buttons. As soon as the reader must type, choose, or explain, the surface is a plain dialog with a form in it.',
    whenMessage:
      'A confirmation is a question. If there is nothing to decide, an inline message or a toast says the same thing without taking the reader hostage.',

    // usage — do/don't
    ddVerbBad:
      'Yes and No answer a question the reader has to reconstruct from the message, and they read identically for a delete and for a publish. They are also what you get by default: leave acceptLabel unset and the components fall back to the configuration, whose values are exactly these two words in English.',
    ddVerbGood:
      'The accept button names the action, so it survives being read on its own — which is how a button is read under a screen reader moving between focusable elements. The reject button names the alternative rather than negating the question, and the destructive severity puts the weight on the irreversible side.',
    ddHeaderBad:
      'The dialog is an alertdialog whose accessible name resolves to an empty span. Nothing else in the component supplies one: there is no aria-label input that reaches the root, and the message is not connected as a description either.',
    ddHeaderGood:
      'The header becomes the id that aria-labelledby points at, so the alertdialog announces what it is about the moment it takes focus. It costs one property in the Confirmation or one input on the instance.',

    // design
    tokCdIconSize: 'The warning icon beside the message. It is set in rem, so it scales with the root font size.',
    tokCdIconColor:
      'The same color as the modal overlay text, which means the icon is not tinted by severity: an icon that carries meaning has to be given its own color.',
    tokCdGap: 'The gap between icon and message inside the dialog content, which is laid out as a flex row.',
    tokCpBg: 'The popup paints the popover background rather than inheriting the page, so it lifts off any surface.',
    tokCpGutter: 'The distance between the popup and the element it is anchored to, applied as a top margin.',
    tokCpArrow:
      'How far right of the popup edge the arrow starts. The rule adds a second value to it that the component computes when the popup opens and writes into a custom property, so the arrow follows the trigger — but it is aimed at the left edge of the trigger, not at its middle, so a wide trigger leaves the arrow sitting under its left end.',
    tokCpIconSize: 'The popup icon is smaller than the dialog one, which is the visual half of the surfaces differing in weight.',
    tokCpFooterGap: 'The gap between reject and accept in the popup footer, which is right-aligned.',

    styleFrame:
      'The two surfaces take the kit visual style differently. The confirm dialog renders a p-dialog, and every visual style restyles .p-dialog directly: border, radius, and shadow come from the style block, not from the Aura modal tokens — in werkbund a frame of --style-bw in --style-outline, radius 0, and an 8px offset color plane; blaupause a 1px frame without shadow; lernwerkstatt and skizzenbuch a rounded frame with an offset or paper shadow. The popup has no such rule: its radius is overlay.popover.border.radius, which resolves to the style radius scale border.radius.md (0 in werkbund, 12px lernwerkstatt, 10px skizzenbuch, 2px blaupause), and its border and shadow stay the Aura popover values.',

    contrastPara:
      'Both surfaces render text, so the criterion for the message is SC 1.4.3 Contrast (Minimum) at 4.5:1, not the large-scale 3:1 — neither preset sets a font size, so the message inherits body text. Where the icon carries meaning rather than decoration, it owes SC 1.4.11 Non-text Contrast at 3:1 against the surface behind it, and that surface is the overlay background the component paints itself, not the page. For the dialog the gate holds both, because its message and icon take the dialog panel\'s text color (see below); for the popup no measured pair exists, because its colors are Aura preset values the compilat does not list. The moment you override one of these colors with dt, the check becomes yours.',

    narrow:
      'No intrinsic responsive behavior in either component, and the two fail differently. The dialog takes its width from p-dialog and reflows only if you hand it a breakpoints map, which is compiled into an injected style element once at init; without that map the width is whatever the inner dialog resolves to at every viewport. The popup has no width rule at all, so it is as wide as its message wants to be and can exceed a narrow viewport with a long sentence; its position is computed from the trigger, and on a window resize it closes rather than re-placing, unless the device reports touch support. Layout guidance: pass a breakpoints map to the dialog for anything below roughly 48rem, and keep the popup message to one short line so its intrinsic width stays inside a phone.',

    zIndex:
      'The two surfaces sit on different layers of the shared overlay stack. The dialog goes up with the modal base and brings a mask with it; the popup goes up with the overlay base, the same one menus and other anchored overlays use. What follows for you: a popup opened while a dialog is up will paint under it, so an anchored confirmation belongs to the page, not to a modal surface already on screen.',

    // development — dialog API
    apiKey: 'Matched against the key of the Confirmation. Unset on both sides means unset matches unset, so one unkeyed call opens every unkeyed instance.',
    apiContent:
      'All three are usually better passed in the Confirmation, because the object is consulted before the component. The header is what names the dialog; the message is rendered as HTML.',
    apiLabels:
      'Falls back to the accept and reject entries of the Optimus configuration, which are English by default. Pass your own for anything a reader will see.',
    apiVisible: 'Hides the corresponding button. Hiding the reject button leaves a dialog whose only exits are accept, Escape, and the close icon.',
    apiClosable: 'Renders the close icon in the header. It routes through the same path as Escape, so it reports a cancel — and the inner dialog only binds its escape listener when this is on, so turning it off removes both exits.',
    apiEscape: 'Escape closes and reports a cancel on the reject callback. Turning it off removes a dismissal path a keyboard reader expects.',
    apiMask: 'Left unset, so a click on the mask does not dismiss by default. Switch it on only where a cancel is genuinely harmless.',
    apiModal: 'The dialog is modal and blocks page scroll while it is open.',
    apiBreakpoints:
      'A map of max-width to dialog width, compiled into a style element that is injected into the document head. It is built from onInit, so a later change to the map does not regenerate it.',
    apiPosition: 'Center by default, and draggable by its header — which is forwarded to the inner dialog, unlike several of its neighbors.',
    apiAppendTo: 'The overlay is appended to the body by default, which is what keeps it out of a clipped or transformed ancestor.',
    apiDefaultFocus:
      'Declared, documented, and read by a method that nothing calls. It has no effect on this component; the focus goes wherever the inner dialog puts it.',
    apiUnforwarded:
      'All three are declared on the confirm dialog and all three exist on the inner p-dialog, but the template binds none of them. The inner dialog therefore runs on its own defaults, which for the focus trap happens to be on.',
    apiAriaLabels:
      'Three naming inputs that are never read. The accept and reject buttons take their aria-label from the ariaLabel of the corresponding button-props object instead. The close icon takes nothing: the inner dialog names it from its own closeAriaLabel, which this template does not bind, so the icon ships with no accessible name at all.',
    apiInherited: 'Inherited signal inputs from BaseComponent: scoped design tokens, unstyled rendering, and pass-through attributes with their options.',

    deadInputs:
      'Seven inputs of the dialog never reach the code meant to read them, and they fail in three distinct ways. defaultFocus is read — but only inside a method that no other line of the file calls, and that method looks for element classes the component does not produce, so even if it were called it would find nothing. focusTrap, rtl, and transitionOptions are read nowhere in the wrapper either: they describe the inner dialog, which carries all three itself, and the template that instantiates it binds none of them. closeAriaLabel, acceptAriaLabel and rejectAriaLabel are declared and then never mentioned again, which is the third way — no reader, and no forwarding to a component that has one. The distinction matters when you debug: a dead call path, an unforwarded input, and a declaration with no reader anywhere.',

    // development — popup API
    cpKey: 'Same matching rule as the dialog. Give the popup its own key as soon as a confirm dialog exists in the same tree, or one call will open both.',
    cpDefaultFocus:
      'Honored here: the popup focuses the accept or the reject button as the overlay enters. The guard only tests that the value is set, then treats everything that is not accept as reject — so none focuses the reject button rather than nothing.',
    cpVisible: 'An optional signal input that overrides the internal visibility. Left unset, the service drives it.',
    cpAppendTo: 'Body by default. The popup is positioned absolutely against the target, so appending it elsewhere changes only its containing block.',
    cpAutoZ: 'Registers the overlay on the shared stack under the overlay base and clears it again when the container is destroyed.',
    cpBaseZ: 'Declared and never read. The layer comes from the configuration base, so this input cannot shift the popup up or down.',
    cpTransitions: 'Both are marked deprecated in favor of motionOptions, and neither is read anywhere in the component.',
    cpMotion: 'Merged over the pass-through motion options and handed to the motion directive that drives the enter and leave.',
    cpStyle: 'Applied to the overlay root. The message, the icon, and the button props all travel in the Confirmation instead.',

    checkHeader: 'Every confirm dialog gets a header. Without one the alertdialog has an empty accessible name.',
    checkVerb: 'The accept button names the action. Yes and No are the defaults, not a decision.',
    checkFocus:
      'After a confirm dialog closes, focus is put back on the trigger by your code. The popup does this for accept and reject, but not when it is dismissed silently by an outside click, a resize, or a scroll of the target.',
    checkReject: 'The reject callback runs for cancels too. Read its argument, and remember the popup passes none.',
    checkHtml: 'The dialog message is assigned to innerHTML. Never assemble it from anything a user can influence.',
    checkKey: 'Two instances in one tree means two keys. Remember that close() ignores keys and hides both.',

    // i18n
    i18nLibrary:
      'The two button labels are the only strings these components can supply themselves, and they come from the Optimus configuration rather than from the kit. Everything else — the header, the message, the icon class — is yours, passed in the Confirmation at the moment you ask the question.',
    i18nAcceptSrc: 'acceptLabel, then acceptButtonProps.label, then the accept key of the Optimus configuration.',
    i18nAcceptSwitch: 'Only if you pass it. The configuration default is the English Yes and the kit does not translate that key.',
    i18nRejectSrc: 'rejectLabel, then rejectButtonProps.label, then the reject key of the Optimus configuration.',
    i18nRejectSwitch: 'Only if you pass it. The configuration default is the English No.',
    i18nBodySrc: 'The Confirmation you build for each call.',
    i18nBodySwitch: 'Yes, as long as the values are read at call time from a computed rather than captured once.',
    i18nCloseSrc:
      'Nowhere. The inner dialog names its close button from its closeAriaLabel input, which the confirm dialog never binds, and the confirm dialog declares a closeAriaLabel of its own that nothing reads.',
    i18nCloseSwitch:
      'No, because there is no name to move. Pass closable: false rather than ship an icon button that no language names — but that switch also takes Escape with it, so accept and reject are then the only way out.',

    i18nLength:
      'Plan for the popup, not for the dialog. The dialog wraps inside whatever width it has and grows downwards, which is the well-behaved case. The popup has no width of its own, so a message that doubles in length in German or Finnish doubles the width of the overlay. Keep the popup to a short question and put the detail in the page. Direction is not part of the deal in either: the popup is placed from physical coordinates and its arrow is positioned with left, both in the rule and in the value the component computes, so a right-to-left page gets the same geometry as a left-to-right one.',
  };

  readonly dialogMarkupSnippet: string = '<!-- What p-confirmDialog renders while it is open (elided). -->\n' +
    '<div class="p-dialog p-component p-confirmdialog" role="alertdialog"\n' +
    '     aria-modal="true" aria-labelledby="pn_id_7_header">\n' +
    '  <div class="p-dialog-header">\n' +
    '    <span id="pn_id_7_header" class="p-dialog-title">Delete this draft?</span>\n' +
    '    <button class="p-dialog-header-close" type="button">…</button>\n' +
    '  </div>\n' +
    '  <div class="p-dialog-content">\n' +
    '    <i class="p-confirmdialog-icon pi pi-exclamation-triangle"></i>\n' +
    '    <span class="p-confirmdialog-message">The draft … cannot be undone.</span>\n' +
    '  </div>\n' +
    '  <div class="p-dialog-footer">\n' +
    '    <button class="p-confirmdialog-reject-button">Keep draft</button>\n' +
    '    <button class="p-confirmdialog-accept-button">Delete draft</button>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<!-- The message span has no id, and nothing describes the dialog. -->\n' +
    '<!-- The reject button is first in the footer, which is where focus lands. -->';

  readonly popupMarkupSnippet: string = '<!-- What p-confirmpopup renders while it is open (elided). -->\n' +
    '<div class="p-confirmpopup p-component" role="alertdialog"\n' +
    '     style="--p-confirmpopup-arrow-left: 24px">\n' +
    '  <div class="p-confirmpopup-content">\n' +
    '    <i class="p-confirmpopup-icon pi pi-exclamation-triangle"></i>\n' +
    '    <span class="p-confirmpopup-message">Delete this draft?</span>\n' +
    '  </div>\n' +
    '  <div class="p-confirmpopup-footer">\n' +
    '    <button class="p-confirmpopup-reject-button" aria-label="Keep">Keep</button>\n' +
    '    <button class="p-confirmpopup-accept-button" aria-label="Delete">Delete</button>\n' +
    '  </div>\n' +
    '</div>\n' +
    '<!-- No aria-modal and no aria-labelledby: an alertdialog with no name. -->';

  readonly usageSnippet: string = '// One instance per surface, each with its own key.\n' +
    '//   <p-confirmDialog key="destructive" [header]="title()" />\n' +
    '//   <p-confirmpopup key="rowAction" />\n' +
    '\n' +
    'this.confirmationService.confirm({\n' +
    '  key: "destructive",\n' +
    '  message: this.question(),        // rendered as HTML by the dialog\n' +
    '  icon: "pi pi-exclamation-triangle",\n' +
    '  acceptLabel: this.deleteVerb(),  // never leave this to the default "Yes"\n' +
    '  rejectLabel: this.keepVerb(),\n' +
    '  acceptButtonProps: { severity: "danger", ariaLabel: this.deleteVerb() },\n' +
    '  accept: () => this.remove(),\n' +
    '  reject: () => this.trigger()?.focus(),\n' +
    '});';

  readonly deadInputSnippet: string = '<!-- defaultFocus: read only by a method nothing calls. -->\n' +
    '<!-- focusTrap, rtl, transitionOptions: never bound to the inner p-dialog. -->\n' +
    '<p-confirmDialog\n' +
    '  defaultFocus="reject"\n' +
    '  [focusTrap]="false"\n' +
    '  [rtl]="true"\n' +
    '  transitionOptions="400ms ease"\n' +
    '/>\n' +
    '\n' +
    '<!-- The naming inputs are dead too: acceptAriaLabel, rejectAriaLabel, -->\n' +
    '<!-- closeAriaLabel. The footer buttons can still be named through     -->\n' +
    '<!-- acceptButtonProps.ariaLabel; the close icon cannot be named by    -->\n' +
    '<!-- any input, so pass closable: false rather than ship it unnamed —  -->\n' +
    '<!-- which also disables Escape, leaving the reject button as the exit. -->';

  readonly routingSnippet: string = '// Two instances, two keys — a keyed call reaches exactly one of them.\n' +
    '//   <p-confirmDialog key="destructive" />\n' +
    '//   <p-confirmpopup  key="rowAction" />\n' +
    '\n' +
    'this.confirmationService.confirm({ key: "rowAction", /* … */ });\n' +
    '\n' +
    '// Without keys, one call opens BOTH: undefined matches undefined.\n' +
    'this.confirmationService.confirm({ /* no key */ });\n' +
    '\n' +
    '// close() is not routed at all — it hides every instance in the tree.\n' +
    'this.confirmationService.close();\n' +
    '\n' +
    '// A second confirm() while one is open replaces the first silently:\n' +
    '// its accept and reject callbacks are dropped without being called.';

  readonly rejectSnippet: string = 'import { ConfirmEventType } from "@openng/optimus-ui/api";\n' +
    '\n' +
    '// Dialog: reject() also runs for Escape, the close icon, and the mask.\n' +
    'reject: (type: ConfirmEventType) => {\n' +
    '  if (type === ConfirmEventType.REJECT) {\n' +
    '    this.log("the reader said no");\n' +
    '  } else {\n' +
    '    this.log("the reader walked away");   // CANCEL\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '// Popup: the same callback is called with nothing at all.\n' +
    'reject: (type?: ConfirmEventType) => this.log(type === undefined ? "popup" : "dialog");';

  readonly i18nSnippet: string = '// translate() inside a computed, so the label re-runs on a language switch.\n' +
    'private readonly i18n = inject(TranslationService);\n' +
    'readonly deleteVerb = computed(() => this.i18n.translate("lesson.delete.accept"));\n' +
    'readonly keepVerb = computed(() => this.i18n.translate("lesson.delete.reject"));\n' +
    '\n' +
    '// Read at call time, so the Confirmation carries the current language:\n' +
    '//   acceptLabel: this.deleteVerb(), rejectLabel: this.keepVerb()\n' +
    '//\n' +
    '// A plain field would keep the string it was born with:\n' +
    '//   readonly deleteVerb = this.i18n.translate("lesson.delete.accept"); // stale';
}
