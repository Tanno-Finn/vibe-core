import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { CardModule } from '@openng/optimus-ui/card';
import { SelectModule } from '@openng/optimus-ui/select';
import { ToggleSwitchModule } from '@openng/optimus-ui/toggleswitch';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [
    GuideShellComponent,
    GuideTabDirective,
    CardModule,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule,
    FormsModule,
  ];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
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
      /* --- Playground --- */
      .pg {
        margin: 0 0 var(--space-6);
        padding: var(--space-5);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-card);
      }
      .pg__grid {
        display: grid;
        grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
        gap: var(--space-5);
        margin-bottom: var(--space-4);
      }
      .pg__controls {
        border: 0;
        margin: 0;
        padding: 0;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }
      .pg__controls legend {
        padding: 0;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        margin-bottom: var(--space-1);
      }
      .pg__field {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      .pg__label,
      .pg__field label {
        font-size: 0.85rem;
        color: var(--text-color);
        font-weight: var(--font-weight-medium);
      }
      .pg__field--switch {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
      }
      .pg__field--switch label {
        flex: 1;
      }
      .pg__field p-select {
        width: 100%;
      }
      .pg__preview {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        min-width: 0;
      }
      .pg__preview-label,
      .pg__code-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
      }
      .pg__stage {
        padding: var(--space-5);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-md);
        background: var(--surface-ground);
      }
      .pg__code {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }
      @media (max-width: 720px) {
        .pg__grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Demo card decorations (opt-in, so the default stays honest) --- */
      .demo-edge {
        border: 1px solid var(--surface-border);
      }
      .demo-clip {
        overflow: hidden;
      }
      .demo-h {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.3;
        color: inherit;
      } /* 18px — deliberately under card.title, which is 1.25rem in Aura 2.x */
      .demo-p {
        margin: 0;
        font-size: 0.92rem;
        line-height: 1.55;
      }
      .demo-band {
        display: flex;
        justify-content: space-between;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-4);
        font-size: 0.82rem;
        font-weight: var(--font-weight-medium);
        color: var(--text-color-secondary);
        border-bottom: 1px solid var(--surface-border);
      }
      .demo-band--solid {
        background: var(--surface-section);
        border-bottom: 0;
      }
      .demo-actions {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }
      .demo-anat {
        max-width: 24rem;
      }
      .demo-nest {
        flex: 1 1 15rem;
        min-width: 0;
      }

      /* --- Equal-height grid demo --- */
      .demo-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
        width: 100%;
      }
      .demo-col {
        display: flex;
        flex-direction: column;
      }
      @media (max-width: 700px) {
        .demo-grid {
          grid-template-columns: 1fr;
        }
      }

      /* --- Stretched-link card --- */
      .demo-linkcard {
        position: relative;
        max-width: 26rem;
      }
      .demo-link {
        color: var(--primary-color-fg);
        text-decoration: none;
      }
      .demo-link::after {
        content: '';
        position: absolute;
        inset: 0;
      }
      .demo-link:hover {
        text-decoration: underline;
      }
      .demo-link:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 3px;
      }

      /* --- Examples --- */
      .ex__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-1);
      }
      .ex__note {
        margin: 0 0 var(--space-3);
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
        max-width: 46rem;
      }
      .ex__stage {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: var(--space-4);
        padding: var(--space-5);
        margin-bottom: var(--space-3);
        border: 1px dashed var(--surface-border);
        border-radius: var(--radius-lg);
        background: var(--surface-ground);
      }
      .ex__stage--anatomy {
        display: block;
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
        padding: var(--space-4);
        border-radius: var(--radius-md);
        background: var(--surface-ground);
      }
      .dd__why {
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-color-secondary);
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
      @media (max-width: 720px) {
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

      .copy-btn {
        appearance: none;
        flex: 0 0 auto;
        padding: 0.35rem 0.8rem;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: var(--font-weight-medium);
        color: var(--primary-color-fg);
        background: var(--surface-card);
        border: 1px solid var(--surface-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: border-color 0.15s ease;
      }
      .copy-btn:hover {
        border-color: var(--primary-color-fg);
      }
      .copy-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
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
      .code-block--inline {
        margin: 0;
        font-size: 0.75rem;
        background: var(--surface-card);
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
      .sources a,
      .history strong {
        color: var(--primary-color-fg);
      }
      @media (prefers-reduced-motion: reduce) {
        .copy-btn {
          transition: none;
        }
      }
    `;

/**
 * Guide article: Card (`p-card`) — SPEC N5, Guides.
 *
 * Card is the smallest component in the library: six divs, five preset style
 * rules, no state, no service, no keyboard. Its guide is therefore about BOUNDARIES —
 * where p-card stops and p-panel, p-fieldset, a plain <section> or the kit's own
 * app-standard-container start — and about the parts of it that quietly do
 * nothing.
 *
 * VERIFIED CLAIMS (source read at @openng/optimus-ui 2.0.2; browser measurements
 * from the 21-era pass are marked as such — the template structure is
 * unchanged in Optimus; contrast figures are composited from today's tokens;
 * provenance is in the tabs):
 *   - The rendered root is the <p-card> element itself (host binding
 *     '[class]': "cx('root')", the ɵcmp at openng-optimus-ui-card.mjs:198), not a
 *     wrapper div. Accessibility tree: the host and all inner divs come back
 *     ignored/generic, no role and no name — measured on a rendered card in
 *     both themes (on 21; the template structure is unchanged in Optimus).
 *   - The preset's FIVE rules (@openng/optimus-ui-styles/dist/card, 2.0.2) cover root,
 *     caption, body, title, subtitle — no header, no footer. The kit's
 *     styles.scss adds dark-theme !important overrides for .p-card and
 *     .p-card-header (header fill var(--surface-section) dark, transparent
 *     light), and every html.style-<name> block (ADR-0016) outlines .p-card
 *     with --style-outline and sets its own radius and shadow.
 *   - The 21-era `display: block` trap is BACK. PrimeNG 22 had fixed it; the
 *     Optimus bundle appends its own ".p-card { display: block }" AFTER the
 *     preset's flex rule (openng-optimus-ui-card.mjs:14-20) — same specificity,
 *     later, so block wins and the host is NOT a flex column.
 *   - .p-card-caption is STILL DEAD: the class is in the classes map
 *     (openng-optimus-ui-card.mjs:25) and Aura 2.x ships card.caption.gap, but the
 *     template (openng-optimus-ui-card.mjs:198-233) renders no caption element. So
 *     pt.caption never applies and --p-card-caption-gap has no reader.
 *   - The `header` INPUT lands in .p-card-title (openng-optimus-ui-card.mjs:207);
 *     the `#header` TEMPLATE lands in .p-card-header (:199-204). Same word, two
 *     different boxes. FOUR plain inputs, no signal inputs: header, subheader,
 *     style, and styleClass — the last two are back (PrimeNG 22 had removed
 *     them; styleClass is marked deprecated since v20 but is live, :113-134).
 *   - The query asymmetry is BACK. The #name template queries are decorator
 *     ContentChild with { descendants: false }
 *     (openng-optimus-ui-card.mjs:300-315), but headerFacet/footerFacet are bare
 *     ContentChild(Header|Footer) — descendants: true (:294-299) — so a nested
 *     <p-header> IS found and renders an EMPTY .p-card-header. PrimeNG 22 had
 *     made both direct-children-only. The pTemplate route is back too
 *     (ContentChildren(PrimeTemplate) :315-318 → onAfterContentInit :173-196).
 *     Measured on 21 (same query semantics): a
 *     #footer as a direct child renders, one inside an @if block that is true
 *     at content-init also renders, one inside a wrapper <div> does NOT —
 *     silently, no error. Flipping such an @if after init does not bring the
 *     slot back (OnPush).
 *   - <p-header>/<p-footer> come from SharedModule (openng-optimus-ui-api.mjs:709/:722);
 *     importing the standalone Card alone leaves them silently inert.
 *   - Contrast, composited from the tokens (Aura stock palette + the per-style
 *     surfaces in ui-styles.ts): card surface vs page ground 1.02-1.13:1 in
 *     every style (no boundary; the style outline is the edge); body text
 *     10.35:1 light, dark = the CONTRAST.MD body-text row on --surface-card;
 *     subtitle 4.76:1 light / 5.12-6.56:1 dark.
 *   - In dark mode this kit overrides background, color, and shadow with
 *     !important (styles.scss), so the Aura dark card tokens do not reach the
 *     page: the background is the style's --surface-card.
 *   - Aura 2.x geometry: body padding 1.25rem, title 1.25rem/500, and the
 *     subtitle has a color token only; the radius token {border.radius.xl} is
 *     replaced by each style block (werkbund 0).
 *   - The equal-height fix needs THREE rules again (the host is display:block):
 *     display:flex;flex-direction:column on the host, then flex:1 on
 *     .p-card-body, which only grows the body; a taller flex container does not
 *     move its last child, so margin-top:auto on .p-card-footer (or flex:1 on
 *     .p-card-content) is what actually aligns the footers. Measured on the
 *     rendered three-card demo on 21 with the host-flex rule applied.
 *   - RTL (measured on 21; the preset still has no [dir] or logical-property
 *     rule for .p-card): under dir="rtl" vs dir="ltr", width, height, padding,
 *     margins, radii, and box-shadow of all parts are identical and only
 *     computed `direction` flips. Position is NOT invariant: a card narrower
 *     than its container moves to the other edge — the container obeying
 *     direction, not the card mirroring.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-card-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'card'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A card is a box with a shadow. That is the whole component: six
          <code>&lt;div&gt;</code>s, five preset style rules, no state, no keyboard, no role. Everything that makes a
          card <em>useful</em> — a heading, a boundary, a grouping a screen reader can hear — you supply. The playground
          below is a real <code>p-card</code>; the controls change which of its slots exist.
        </p>

        <section class="pg" aria-label="Card playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Configure</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-variant-label">Slots</span>
                <p-select
                  [ariaLabelledBy]="'pg-variant-label'"
                  size="small"
                  [options]="variantOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgVariant()"
                  (ngModelChange)="pgVariant.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-sub">Subheader</label>
                <p-toggleswitch inputId="pg-sub" [ngModel]="pgSubtitle()" (ngModelChange)="pgSubtitle.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-clip">Clip to the radius</label>
                <p-toggleswitch inputId="pg-clip" [ngModel]="pgClip()" (ngModelChange)="pgClip.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-border">Give it an edge</label>
                <p-toggleswitch inputId="pg-border" [ngModel]="pgBorder()" (ngModelChange)="pgBorder.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Preview — on the page ground, not on a panel</span>
              <div class="pg__stage">
                @switch (pgVariant()) {
                  @case ('plain') {
                    <p-card
                      [header]="pgTopic"
                      [subheader]="pgSub()"
                      [class.demo-clip]="pgClip()"
                      [class.demo-edge]="pgBorder()"
                    >
                      <p class="demo-p">{{ pgBody }}</p>
                    </p-card>
                  }
                  @case ('heading') {
                    <p-card [subheader]="pgSub()" [class.demo-clip]="pgClip()" [class.demo-edge]="pgBorder()">
                      <ng-template #title
                        ><h4 class="demo-h">{{ pgTopic }}</h4></ng-template
                      >
                      <p class="demo-p">{{ pgBody }}</p>
                    </p-card>
                  }
                  @case ('band') {
                    <p-card
                      [header]="pgTopic"
                      [subheader]="pgSub()"
                      [class.demo-clip]="pgClip()"
                      [class.demo-edge]="pgBorder()"
                    >
                      <ng-template #header>
                        <div class="demo-band"><span>2026</span><span>Method</span></div>
                      </ng-template>
                      <p class="demo-p">{{ pgBody }}</p>
                    </p-card>
                  }
                  @default {
                    <p-card [subheader]="pgSub()" [class.demo-clip]="pgClip()" [class.demo-edge]="pgBorder()">
                      <ng-template #header>
                        <div class="demo-band"><span>2026</span><span>Method</span></div>
                      </ng-template>
                      <ng-template #title
                        ><h4 class="demo-h">{{ pgTopic }}</h4></ng-template
                      >
                      <p class="demo-p">{{ pgBody }}</p>
                      <ng-template #footer>
                        <div class="demo-actions">
                          <p-button label="Read" size="small" />
                          <p-button label="Later" size="small" severity="secondary" [outlined]="true" />
                        </div>
                      </ng-template>
                    </p-card>
                  }
                }
              </div>
              <p class="ex__note">
                With both style switches off this is the card as this kit ships it: the active visual style draws its
                outline. In stock Aura, with no style block, it is white on a near-white ground held together by a 1px
                shadow. Each variant is a separate
                <code>&lt;p-card&gt;</code> — see the nesting demo below for why the slots are not switched inside one.
              </p>
            </div>
          </div>

          <div class="pg__code">
            <div class="ex__head">
              <span class="pg__code-label">Markup</span>
              <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
                {{ copiedId() === 'playground' ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <pre class="code-block code-block--inline"><code>{{ pgCode() }}</code></pre>
          </div>
        </section>

        <h3>The anatomy, rendered</h3>
        <p class="ex__note">
          Six boxes, in this nesting order. The three the theme actually styles are marked; the other three are bare
          containers you are expected to style yourself.
        </p>
        <div class="ex__stage ex__stage--anatomy">
          <p-card
            class="demo-anat demo-edge"
            [header]="'title (input or #title)'"
            [subheader]="'subtitle (subheader or #subtitle)'"
          >
            <ng-template #header><div class="demo-band">header (#header) — unstyled</div></ng-template>
            <p class="demo-p">content (default projection or #content) — unstyled</p>
            <ng-template #footer><div class="demo-band">footer (#footer) — unstyled</div></ng-template>
          </p-card>
        </div>
        <div class="table-wrap">
          <table>
            <caption class="sr-only">
              Card parts and what the preset stylesheet gives them
            </caption>
            <thead>
              <tr>
                <th>Class</th>
                <th>Where</th>
                <th>Shipped styling</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-card</code></td>
                <td>the <code>&lt;p-card&gt;</code> host itself</td>
                <td>
                  background, color, shadow, radius — and <code>display: block</code>, because the bundle's own
                  appended rule overrides the preset's <code>flex column</code>
                </td>
              </tr>
              <tr>
                <td><code>p-card-header</code></td>
                <td>first child of the host</td>
                <td><strong>none from the preset</strong> — but this kit fills it in dark mode</td>
              </tr>
              <tr>
                <td><code>p-card-body</code></td>
                <td>second child of the host</td>
                <td>padding, <code>flex column</code>, gap</td>
              </tr>
              <tr>
                <td><code>p-card-title</code></td>
                <td>in the body</td>
                <td>font-size, font-weight</td>
              </tr>
              <tr>
                <td><code>p-card-subtitle</code></td>
                <td>in the body</td>
                <td>color only (Aura 3.0's font-size/font-weight tokens are gone again)</td>
              </tr>
              <tr>
                <td><code>p-card-content</code></td>
                <td>in the body</td>
                <td><strong>none</strong></td>
              </tr>
              <tr>
                <td><code>p-card-footer</code></td>
                <td>in the body</td>
                <td><strong>none</strong></td>
              </tr>
              <tr>
                <td><code>p-card-caption</code></td>
                <td>—</td>
                <td>styled, but <strong>never rendered</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Where a slot template may sit</h3>
        <p class="ex__note">
          Three cards, identical except for where the <code>#footer</code> template is declared. The queries are
          direct-children-only, so only the first two find it — and the third reports nothing at all.
        </p>
        <div class="ex__stage">
          <p-card class="demo-edge demo-nest" [header]="'Direct child'">
            <p class="demo-p">Template declared straight inside the card.</p>
            <ng-template #footer><div class="demo-band">footer rendered</div></ng-template>
          </p-card>

          <p-card class="demo-edge demo-nest" [header]="'Inside a control-flow block'">
            <p class="demo-p">Template declared inside a block that is true at content-init.</p>
            @if (alwaysTrue) {
              <ng-template #footer><div class="demo-band">footer rendered</div></ng-template>
            }
          </p-card>

          <p-card class="demo-edge demo-nest" [header]="'Inside a wrapper element'">
            <p class="demo-p">Template declared one element deeper.</p>
            <div>
              <ng-template #footer><div class="demo-band">footer rendered</div></ng-template>
            </div>
          </p-card>
        </div>
        <p class="src-note">
          The third card has no footer, and there is no error, no warning, and no empty box to notice — the slot is
          simply not part of the DOM. A control-flow block whose condition is true when the content is initialized still
          resolves; what it does not do is bring the slot back if the condition flips later, because the card is
          <code>OnPush</code> and a query change alone does not mark its view dirty. Declare slot templates
          unconditionally and put the condition inside them.
        </p>

        <h3>Equal heights: what a row of cards does out of the box</h3>
        <p class="ex__note">
          Three cards in one grid row. The grid stretches the cards; nothing stretches their bodies — the host is
          <code>display: block</code> and <code>.p-card-body</code> has no <code>flex: 1</code>. Flip the switch for the fix
          — and watch the three "Open" buttons, not the card outlines: stretching the body alone moves nothing, because
          a taller flex container does not move its last child.
        </p>
        <div class="ex__head">
          <span class="pg__code-label">{{ stretchFix() ? 'With the fix' : 'Shipped behavior' }}</span>
          <button type="button" class="copy-btn" (click)="toggleStretch()">
            {{ stretchFix() ? 'Show shipped behavior' : 'Apply the fix' }}
          </button>
        </div>
        <div class="ex__stage">
          <div class="demo-grid" [class.demo-grid--fixed]="stretchFix()">
            @for (c of stretchCards; track c.id) {
              <p-card
                class="demo-edge"
                [class.demo-col]="stretchFix()"
                [pt]="stretchFix() ? stretchPt : undefined"
                [header]="c.title"
              >
                <p class="demo-p">{{ c.body }}</p>
                <ng-template #footer>
                  <div class="demo-actions"><p-button label="Open" size="small" /></div>
                </ng-template>
              </p-card>
            }
          </div>
        </div>
        <pre class="code-block"><code>{{ stretchSnippet }}</code></pre>

        <h3>A card that is a link</h3>
        <p class="ex__note">
          A card is not focusable and has no role, so a click handler on the host is invisible to the keyboard. Put the
          real link on the heading and let a pseudo-element grow it over the card: one tab stop, one announced name, the
          whole box clickable.
        </p>
        <div class="ex__stage">
          <p-card class="demo-edge demo-linkcard">
            <ng-template #title>
              <h4 class="demo-h">
                <a class="demo-link" href="https://www.w3.org/WAI/ARIA/apg/" rel="noopener noreferrer"
                  >ARIA Authoring Practices</a
                >
              </h4>
            </ng-template>
            <p class="demo-p">
              The patterns this kit checks itself against. The whole card is the hit area; the tab stop and the
              accessible name are the link's.
            </p>
          </p-card>
        </div>
        <pre class="code-block"><code>{{ linkCardSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which container</h3>
        <p>
          "Card" is a visual word, not a semantic one. Before reaching for
          <code>p-card</code>, decide what the box <em>is</em>: a titled region, a group of form fields, a document
          section, or just a surface with a shadow. Only the last one is a card.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>You want</th>
                <th>Reach for</th>
                <th>Because</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A surface with a shadow around otherwise self-contained content</td>
                <td><code>p-card</code></td>
                <td>It is exactly that and nothing more — no role, no header semantics, no state.</td>
              </tr>
              <tr>
                <td>A titled region, optionally collapsible</td>
                <td><code>p-panel</code></td>
                <td>
                  Its content wrapper carries <code>role="region"</code> and <code>aria-labelledby</code> pointing at
                  the header, and the toggle is a real button with <code>aria-expanded</code>/<code>aria-controls</code>
                  (<code>openng-optimus-ui-panel.mjs:395-396</code>, <code>:364-365</code>).
                </td>
              </tr>
              <tr>
                <td>A group of form controls under one label</td>
                <td><code>p-fieldset</code></td>
                <td>
                  It renders a native <code>&lt;fieldset&gt;</code> with a
                  <code>&lt;legend&gt;</code> (<code>openng-optimus-ui-fieldset.mjs:270-271</code>) — the grouping browsers and AT
                  already understand.
                </td>
              </tr>
              <tr>
                <td>A section of the page's own document outline</td>
                <td><code>&lt;section&gt;</code>/<code>&lt;article&gt;</code> + a heading</td>
                <td>
                  Headings are how readers navigate. A card wrapped around a heading adds a box; a card
                  <em>instead of</em> a heading removes the outline.
                </td>
              </tr>
              <tr>
                <td>A titled content block inside a portal page</td>
                <td><code>app-standard-container</code></td>
                <td>
                  The kit's own container: a typed variant (primary, warning, definition, …), an icon, an i18n title
                  key, an explicit <code>headingLevel</code> that emits a real
                  <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code>, and a collapsible mode with
                  <code>aria-expanded</code>.
                </td>
              </tr>
              <tr>
                <td>Long-form prose with reading metadata</td>
                <td><code>app-text-container</code></td>
                <td>Built on the same container, adds reading time, word count, and a progress indicator.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit convention: page-level content blocks go through the kit container, which owns the heading level and the
          translated title. <code>p-card</code> is for repeated, small, self-contained items — a row in a list of
          events, an error box, a tile in a grid — where the surrounding page already supplies the outline.
        </p>

        <h3>When p-card is the wrong choice</h3>
        <ul>
          <li>
            <strong>The box needs a name in the accessibility tree.</strong> Nothing in <code>p-card</code> produces
            one. If the answer is "add <code>role</code> and <code>aria-label</code> through <code>pt</code>", you have
            rebuilt <code>p-panel</code> by hand — use it.
          </li>
          <li>
            <strong>The box collapses.</strong> No <code>collapsed</code>, no toggle, no animation.
            <code>p-panel</code> and <code>p-fieldset</code> both ship one.
          </li>
          <li>
            <strong>The whole box is the control.</strong> A card is not focusable and emits no events. Either put a
            real link or button inside it, or use <code>p-button</code>.
          </li>
          <li>
            <strong>You only wanted padding and a border.</strong> A <code>&lt;section&gt;</code> with two kit tokens is
            cheaper than a component, and it can carry a heading.
          </li>
          <li>
            <strong>The card is the page's main content.</strong> One card wrapped around a whole route adds a shadow
            and hides nothing; the semantics belong on <code>&lt;main&gt;</code>.
          </li>
        </ul>

        <h3>Do / Don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <div class="dd__stage">
              <p-card class="demo-edge" [header]="'Vector databases'">
                <p class="demo-p">Eighteen-pixel type at weight 500, and not a heading.</p>
              </p-card>
            </div>
            <p class="dd__why">
              <code>[header]</code> renders a <code>&lt;div class="p-card-title"&gt;</code>. It looks like a heading at
              18px/500 and is invisible to a heading list, so a card grid becomes a wall of unnavigable text.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p-card class="demo-edge">
                <ng-template #title><h4 class="demo-h">Vector databases</h4></ng-template>
                <p class="demo-p">Same pixels, and it is in the outline.</p>
              </p-card>
            </div>
            <p class="dd__why">
              <code>#title</code> projects into the same styled box, so you keep the look and choose the level. One
              heading per card, at the level the surrounding page implies.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <div class="dd__stage">
              <p-card class="demo-edge demo-band-fill">
                <ng-template #header><div class="demo-band demo-band--solid">Filled header</div></ng-template>
                <p class="demo-p">The corners give it away.</p>
              </p-card>
            </div>
            <p class="dd__why">
              The host keeps <code>overflow: visible</code> and the header has no radius of its own, so a filled header
              paints square corners over the card's rounded ones (visible in a style with a radius; werkbund's is 0).
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p-card class="demo-edge demo-clip demo-band-fill">
                <ng-template #header><div class="demo-band demo-band--solid">Filled header</div></ng-template>
                <p class="demo-p">Clipped by the host.</p>
              </p-card>
            </div>
            <p class="dd__why">
              <code>overflow: hidden</code> on the host clips every slot to the radius. It is the one line every
              filled-header card in this kit carries.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't</span>
            <div class="dd__stage">
              <p class="dd__why">
                <code>&lt;p-card (click)="open(item)"&gt;</code> — no tab stop, no role, no key handler. A mouse-only
                card.
              </p>
            </div>
            <p class="dd__why">
              Adding <code>tabindex</code> and <code>role="button"</code> through <code>pt</code> then owes you Enter
              <em>and</em> Space handling, and swallows any link inside.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p class="dd__why">
                A real <code>&lt;a&gt;</code> in the title, stretched over the card by a pseudo-element. One tab stop,
                the link text as the name.
              </p>
            </div>
            <p class="dd__why">
              See the rendered version in Examples. Keep other interactive elements out of a stretched-link card, or
              raise them above the overlay.
            </p>
          </div>
        </div>

        <h3>Annotated source</h3>
        <p class="ex__note">The playground card, with every decision in it named.</p>
        <pre class="code-block"><code>{{ annotatedSource }}</code></pre>

        <h3>Sources</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#region" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — <code>region</code></a
            >
            — what <code>p-panel</code> exposes and <code>p-card</code> does not: a named landmark.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element"
              target="_blank"
              rel="noopener noreferrer"
              >HTML — the <code>fieldset</code> element</a
            >
            — the native grouping <code>p-fieldset</code> renders, and the reason a card is the wrong box for controls.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 1.4.11 Non-text Contrast</a
            >
            — why a card edge is not a UI component, and so why a faint edge is legal but not a boundary.
          </li>
          <li>
            <a href="https://optimus.openng.org/card/" target="_blank" rel="noopener noreferrer">Optimus UI — Card</a>
            — the vendor API; every claim here is checked against the shipped 2.0.2 source.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Everything that styles a card</h3>
        <p>
          Nine rules carry <code>p-card</code> in their selector in a running app, from three sources:
          <strong>five</strong> from the preset stylesheet, <strong>one</strong> appended by the Angular package on top
          of it, and <strong>three</strong> from this kit's own <code>styles.scss</code> — two for the dark theme, and
          the outline rule of the active visual style (<code>html.style-&lt;name&gt; .p-card</code>). PrimeNG 22 had
          dropped the appended rule; Optimus ships it again.
        </p>
        <pre class="code-block"><code>{{ shippedCss }}</code></pre>
        <ul>
          <li>
            <strong>The host is <code>display: block</code>.</strong> The preset's <code>.p-card</code> rule ends with
            <code>display: flex; flex-direction: column</code>, but the component bundle concatenates its own
            <code>.p-card &#123; display: block &#125;</code> after it — same specificity, later, so block wins.
            Equal-height rows therefore need three rules, the host one included (see Examples).
          </li>
          <li>
            <strong>The preset styles no header and no footer.</strong> Its five rules cover root, caption, body, title,
            and subtitle only: <code>.p-card-header</code> and <code>.p-card-footer</code> get no padding, no separator,
            and no background from the theme. The footer at least inherits the body's 0.5rem gap because it is a flex
            child of it; the header sits outside the body and gets nothing.
            <em>In this kit's dark theme the header is the exception</em> — see the next section.
          </li>
          <li>
            <strong><code>.p-card-caption</code> is styled but never rendered</strong> — see Development. The
            <code>card.caption.gap</code> token has no reader.
          </li>
        </ul>

        <h3>Token chain</h3>
        <p>
          Aura maps the card's color tokens onto its own semantic layer; nothing here is a raw color except the
          shadow. The values are the Aura stock palette (slate light, zinc dark), which no visual style overrides — but
          in this kit the dark colors, the radius, the border, and the shadow are replaced by the kit rules below.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura source</th>
                <th>Light</th>
                <th>Dark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>card.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td><code>#ffffff</code></td>
                <td><code>#18181b</code></td>
              </tr>
              <tr>
                <td><code>card.color</code></td>
                <td><code>&#123;content.color&#125;</code></td>
                <td><code>#334155</code></td>
                <td><code>#ffffff</code></td>
              </tr>
              <tr>
                <td><code>card.borderRadius</code></td>
                <td><code>&#123;border.radius.xl&#125;</code></td>
                <td colspan="2"><code>12px</code> in stock Aura; each visual style replaces it (see Geometry)</td>
              </tr>
              <tr>
                <td><code>card.shadow</code></td>
                <td>literal</td>
                <td colspan="2"><code>0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)</code></td>
              </tr>
              <tr>
                <td><code>card.body.padding</code></td>
                <td>literal</td>
                <td colspan="2"><code>1.25rem</code> → 20px (Aura 3.0 had 1.125rem)</td>
              </tr>
              <tr>
                <td><code>card.body.gap</code></td>
                <td>literal</td>
                <td colspan="2"><code>0.5rem</code> → 8px</td>
              </tr>
              <tr>
                <td><code>card.title.fontSize</code> / <code>fontWeight</code></td>
                <td>literal</td>
                <td colspan="2"><code>1.25rem</code> → 20px / <code>500</code> (Aura 3.0 had 1.125rem)</td>
              </tr>
              <tr>
                <td><code>card.subtitle.color</code></td>
                <td><code>&#123;text.muted.color&#125;</code></td>
                <td><code>#64748b</code></td>
                <td><code>#a1a1aa</code></td>
              </tr>
              <tr>
                <td><code>card.subtitle.fontSize</code> / <code>fontWeight</code></td>
                <td>—</td>
                <td colspan="2"><strong>not shipped</strong> in Aura 2.x — the subtitle inherits 16px / normal</td>
              </tr>
              <tr>
                <td><code>card.caption.gap</code></td>
                <td>literal</td>
                <td colspan="2"><code>0.5rem</code> — <strong>unreachable</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token definitions: <code>&#64;openng/optimus-ui-themes/dist/aura/card/index.mjs</code>; values resolved through
          the Aura base palette in both color schemes.
        </p>

        <h3>The dark theme is not Aura's</h3>
        <p>
          This kit overrides the card's colors in dark mode with <code>!important</code>
          (<code>styles.scss</code>), so the Aura dark card colors never reach the page: the background is the active
          visual style's <code>--surface-card</code> (werkbund <code>#1d1d21</code>), not the token's
          <code>#18181b</code>; the color is the style's <code>--text-color</code>, not <code>#ffffff</code>. The dark
          shadow <code>0 2px 8px rgba(0, 0, 0, 0.3)</code> is only a default, without <code>!important</code>: it beats
          Aura's two-layer token shadow but yields to each visual style's own shadow signature (next section). The
          subtitle is <em>not</em> overridden, so it keeps the Aura token and lands on a different background than Aura
          assumed.
        </p>
        <p>
          The second kit rule is the one that breaks the "the theme styles no header" rule of thumb: in dark mode
          <code>.p-card-header</code> is filled with the style's <code>--surface-section</code>, against a transparent
          header in light mode. It also sets
          <code>border-bottom-color</code>, which does nothing until you supply a border width yourself. So a header you
          designed as a transparent band in light mode arrives as a filled band in dark mode, whether or not you asked
          for one.
        </p>
        <p class="src-note">
          Consequence for anyone restyling: changing <code>card.background</code> in the preset moves the light theme
          only. The dark theme moves when the kit's surface tokens move (<code>ui-styles.ts</code>, per style).
        </p>

        <h3>The visual style outlines every card</h3>
        <p>
          Each <code>html.style-&lt;name&gt;</code> block in <code>styles.scss</code> gives <code>.p-card</code> a
          <code>--style-outline</code> border and its own radius and shadow: werkbund 3px light / 2px dark, radius 0, no
          shadow; lernwerkstatt 2px with a 3px offset shadow, radius 16px; skizzenbuch 1.5px, a paper shadow and a
          hand-drawn radius; blaupause 1px, radius 2px, no shadow. The signature holds in dark mode too — the kit's dark
          shadow above is only the fallback a style without one would get. So in this kit a card always has a drawn
          edge — outside it (stock Aura) it has only the shadow.
        </p>

        <h3>Contrast against the surface behind</h3>
        <p>
          A card sits on the page ground, which in every visual style is only a shade off the card surface — the
          surfaces alone are no boundary. What separates the card is the style's outline, whose contrast ranges widely.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Light</th>
                <th>Dark</th>
                <th>Reading</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>card surface vs the page ground</td>
                <td><strong>1.02:1 to 1.09:1</strong></td>
                <td><strong>1.09:1 to 1.13:1</strong></td>
                <td>No boundary from the surfaces in any style. Not an SC failure — a card edge is not a UI component.</td>
              </tr>
              <tr>
                <td>the style's outline (<code>--style-outline</code>) vs the page ground (gated)</td>
                <td>3.85:1 to 17.17:1</td>
                <td>4.32:1 to 16.28:1</td>
                <td>
                  The drawn edge, at least 3:1 in every style and mode. Lowest light and dark: blaupause (3.85:1,
                  4.32:1); lernwerkstatt's dark outline is <code>#969491</code>, 5.5:1 on its ground.
                </td>
              </tr>
              <tr>
                <td>the card color on the card background — what title and body text inherit</td>
                <td>10.35:1</td>
                <td>14.86:1 (werkbund)</td>
                <td>
                  Light is Aura's <code>card.color</code> on white, the same in every style. Dark is the kit's
                  <code>--text-color</code> on <code>--surface-card</code> — the <em>body text</em> row of
                  <code>docs/generated/CONTRAST.MD</code>, per style. Text you recolor yourself lands elsewhere.
                </td>
              </tr>
              <tr>
                <td>subtitle on the card</td>
                <td>4.76:1</td>
                <td>5.12:1 to 6.56:1</td>
                <td>
                  Aura's <code>&#123;text.muted.color&#125;</code> on the card: passes AA for normal text with 0.26 to spare in light
                  mode. Do not shrink it: at 16px there is no headroom. Dark lowest on the blaupause card.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gated in <code>docs/generated/CONTRAST.MD</code>: the outline ("panel outline", <code>--style-outline</code>
          on <code>--surface-ground</code> and <code>--surface-card</code>) and the dark body text ("body text"). The
          subtitle values equal the gated <code>paginator.nav.button.color</code> rows (the same
          <code>&#123;text.muted.color&#125;</code> on the card). The surface-vs-ground and light body-text figures are
          composited from the Aura card and text tokens and the per-style surfaces in <code>ui-styles.ts</code>.
        </p>
        <p>
          <strong>Design consequence.</strong> In this kit the style draws the edge; outside it, a card that must read as
          a discrete object — a tile in a grid, a row in a list — needs an edge of its own (<code>1px solid</code> a
          border token), or a section surface instead of the ground. The shipped shadow alone disappears on a pale
          ground, in print, and under forced colors.
        </p>

        <h3>Geometry</h3>
        <ul>
          <li>
            Radius from the active visual style — werkbund 0, lernwerkstatt 16px, skizzenbuch hand-drawn, blaupause
            2px (stock Aura: 12px, <code>&#123;border.radius.xl&#125;</code>). No slot has a radius of its own, and the
            host does not clip: a filled header or footer needs <code>overflow: hidden</code> on the host.
          </li>
          <li>
            Body padding <strong>20px</strong> on all four sides (Aura 2.x again; Aura 3.0 had 18px); gap between title,
            subtitle, content, and footer <strong>8px</strong>. The header is outside the body and gets neither.
          </li>
          <li>
            Title <strong>20px / 500</strong> (Aura 3.0 had shrunk it to 18px). That is the size of an <code>&lt;h2&gt;</code> and
            heavier than body text — a deliberate "looks like a heading" size, which is exactly why it needs to
            <em>be</em> one.
          </li>
          <li>
            No border from the preset (the kit's border comes from the style block), no min-height, no max-width.
            <strong>On a narrow screen</strong> the card does nothing of its own: its width comes entirely from the
            parent, so a card in normal flow is as wide as the page and its content wraps. A row of cards reflows only
            if the grid around it does — give the grid an <code>auto-fill</code>/<code>minmax()</code> track or a
            breakpoint.
          </li>
        </ul>

        <h3>Motion and forced colors</h3>
        <p>
          The card ships no transition and no animation, so
          <code>prefers-reduced-motion</code> has nothing to suppress. Hover elevation, if you add it, is yours to
          guard. Under forced colors the shadow is dropped by the platform and a card with no border becomes invisible;
          the kit's style outline survives as a system-color border.
        </p>

        <h3>WCAG 2.2 status</h3>
        <p>
          The roll-up of what this guide measures — a criterion not measured here is not claimed.
          <strong>Passing:</strong> SC 1.4.3 for the text the card supplies — title and body text measure 10.35:1 light
          and, in dark mode, the style's body-text ratio on <code>--surface-card</code> (14.86:1 in werkbund), and the
          subtitle 4.76:1 light / 5.12:1 or more dark — AA at 16px with 0.26 to spare in light mode. <strong>Failing:</strong> none of the measured criteria fails —
          the card surface against the ground behind it is 1.02:1 to 1.13:1, which is no boundary at all but not an
          SC 1.4.11 case, because a card edge is not a UI component; the style outline supplies the edge. <strong>Conditional:</strong> SC 1.3.1 — the
          <code>header</code> input renders a 20px / 500 <code>&lt;div&gt;</code>, which looks like a heading and is
          invisible to a heading list; a real heading has to come from the <code>#title</code> template. Beyond that the
          card contributes no role, name, focus, or keyboard of its own, so no further criterion has anything here to
          measure. <strong>AAA</strong> is not assessed for this component.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs — all four</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Default</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>header</code></td>
                <td><em>undefined</em></td>
                <td>
                  String, a plain <code>&#64;Input()</code>. Renders into <code>.p-card-title</code>, <strong>not</strong>
                  into <code>.p-card-header</code> (<code>openng-optimus-ui-card.mjs:207</code>). Ignored when a
                  <code>#title</code> template is present.
                </td>
              </tr>
              <tr>
                <td><code>subheader</code></td>
                <td><em>undefined</em></td>
                <td>
                  String, plain <code>&#64;Input()</code>, into <code>.p-card-subtitle</code>; same override rule (<code>:215</code>).
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Back in Optimus:</strong> <code>style</code> (a setter that writes each key onto the host
                  element, <code>:113-128</code>) and <code>styleClass</code> (<code>&#64;deprecated since v20.0.0</code>,
                  merged by the host binding <code>cn(cx('root'), styleClass)</code>, <code>:198</code>). PrimeNG 22 had
                  removed both. Still style the host with plain <code>class</code>/<code>[class]</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          There are no outputs, no service, and no exported methods beyond
          <code>getBlockableElement()</code> (<code>openng-optimus-ui-card.mjs:169</code>), which exists for
          <code>p-blockUI</code>.
        </p>

        <h3>The ways to fill a slot, and how each goes silently dead</h3>
        <p>
          The five slots — <code>header</code>, <code>title</code>, <code>subtitle</code>, <code>content</code>,
          <code>footer</code> — accept a template through two mechanisms. (The third, <code>pTemplate</code>, is
          <strong>back</strong>: a <code>ContentChildren(PrimeTemplate)</code> query (<code>:315-318</code>) feeds an
          <code>onAfterContentInit</code> switch (<code>:173-196</code>), so 21-era
          <code>pTemplate="footer"</code> code works again. PrimeNG 22 had removed it.)
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Route</th>
                <th>Needs</th>
                <th>Fails by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;ng-template #footer&gt;</code></td>
                <td>Nothing beyond the component import — it is a plain template reference.</td>
                <td>
                  Being wrapped. The query is <code>&#123; descendants: false &#125;</code>
                  (<code>openng-optimus-ui-card.mjs:300-315</code>), so the template must be a
                  <em>direct</em> child of <code>&lt;p-card&gt;</code>: one <code>&lt;div&gt;</code> deeper and the slot
                  silently does not render. A control-flow block is not a wrapper element — it resolves when it is true
                  at content-init — but flipping it later does not bring the slot back.
                </td>
              </tr>
              <tr>
                <td><code>&lt;p-footer&gt;</code> / <code>&lt;p-header&gt;</code></td>
                <td>
                  <code>SharedModule</code> (or <code>CardModule</code>, which exports it); these are non-standalone
                  components (<code>openng-optimus-ui-api.mjs:709</code>/<code>:722</code>).
                </td>
                <td>
                  Not being imported — but <em>not</em> being wrapped. The facet queries are bare
                  <code>ContentChild(Header|Footer)</code>, i.e. <code>descendants: true</code>
                  (<code>openng-optimus-ui-card.mjs:294-299</code>), so a nested <code>&lt;p-header&gt;</code>
                  <em>is</em> found — and renders an <em>empty</em> <code>.p-card-header</code> box, because the
                  <code>ng-content select="p-header"</code> next to it only projects direct children. PrimeNG 22 had
                  removed this half-failure; Optimus has it back. Without the import the element is inert and Angular
                  reports nothing.
                  Legacy route; prefer the template refs.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          If a footer does not appear, check for a wrapper element around the
          <code>ng-template</code> first, then the <code>imports</code> array.
        </p>

        <h3>Pass-through targets</h3>
        <p>
          <code>pt</code> reaches six of the eight class names. The host takes both <code>host</code> and
          <code>root</code>, merged and written from
          <code>onAfterViewChecked</code> (<code>openng-optimus-ui-card.mjs:96</code>), which is how you add a role or a label:
        </p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <ul>
          <li>
            Reachable: <code>root</code>/<code>host</code> (both on <code>&lt;p-card&gt;</code>), <code>header</code>,
            <code>body</code>, <code>title</code>, <code>subtitle</code>, <code>content</code>, <code>footer</code>.
          </li>
          <li>
            <strong>Unreachable: <code>caption</code>.</strong> The class is in the map
            (<code>openng-optimus-ui-card.mjs:25</code>) and the preset styles it, but the template
            (<code>:198-233</code>) never renders the element — title and subtitle are direct children
            of the body. A <code>pt.caption</code> entry is a no-op, still.
          </li>
          <li>
            Because <code>setAttrs</code> runs after view checks, attributes written through <code>pt.root</code> land
            after any creation-time attribute on the host. The card's own template sets none, so there is nothing to
            collide with.
          </li>
        </ul>

        <h3>Layout: the card does not stretch its own body</h3>
        <p>
          In a grid or flex row the host stretches, but <code>.p-card-body</code> keeps its content height, so footers
          in a row of cards do not line up. Three rules fix it (the host is <code>display: block</code>), and they
          belong in the page, not in a wrapper component — the last is the one people leave out, because growing a
          flex container does not move its last child:
        </p>
        <pre class="code-block"><code>{{ stretchSnippet }}</code></pre>
        <p class="src-note">
          Measured on the three-card row in Examples: with the
          shipped rules the two shorter cards' footers sat
          <strong>91.2px</strong> above the tall card's, in both themes. Stretching the body alone changed that by
          nothing — the body's last child stays where it was. With the footer rule, the three footers share one
          baseline. The number is a property of that content; the mismatch is a property of the component — neither the
          preset nor the bundle gives <code>.p-card-body</code> a <code>flex: 1</code>.
        </p>

        <h3>SSR</h3>
        <p>
          The card touches no browser API: no <code>window</code>, no <code>document</code>, no timers, no
          <code>ViewChild</code> measurement. It prerenders and hydrates without a platform guard. Anything you project
          into it is subject to the usual kit rule.
        </p>

        <h3>Accessibility and quality checklist</h3>
        <ul class="checklist">
          <li>
            ☐ Exactly one real heading per card, at the level the surrounding page implies — through
            <code>#title</code>, not <code>[header]</code>.
          </li>
          <li>
            ☐ The card is not the only thing that groups its content: a list of cards is a
            <code>&lt;ul&gt;</code>/<code>&lt;li&gt;</code>, or each card carries <code>role="group"</code> and a name
            through <code>pt.root</code>. Not a landmark — a page full of landmarks is a page with none.
          </li>
          <li>
            ☐ No click handler, <code>tabindex</code> or <code>role="button"</code> on the host; interaction lives in a
            real link or button inside.
          </li>
          <li>
            ☐ The card has a visible edge — a border or a distinct surface — wherever its boundary carries meaning.
          </li>
          <li>☐ <code>overflow: hidden</code> on the host if any slot has a background.</li>
          <li>☐ Footer actions in <code>#footer</code>, not appended to the content, so the body gap applies.</li>
          <li>☐ Cards in a stretched row carry both body-stretch rules, or none of them have footers.</li>
          <li>☐ <code>class</code>, never <code>styleClass</code> (back in Optimus, but deprecated).</li>
          <li>
            ☐ Verify in the browser's accessibility tree: the card contributes no role and no name — whatever names the
            region must come from your own markup.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Every string in a card is yours</h3>
        <p>
          <code>p-card</code> reads nothing from the Optimus translation config — there is no <code>aria</code> key, no
          default label, nothing the library would fill in. Two inputs take text, <code>header</code> and
          <code>subheader</code>, and both come from your catalog. Bind them through a <code>computed()</code> over
          the kit's <code>TranslationService</code> so a language switch re-renders them; a plain field is captured once
          and goes stale.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Length is the whole i18n risk</h3>
        <p>
          A card has no truncation, no <code>text-overflow</code> and no minimum height. It grows with its text, which
          is the right default — and the reason a card grid tuned in one language breaks in another. German runs 20–40 %
          longer than English; a two-word title becomes a three-line one, and a grid of fixed-height cards clips or
          overflows.
        </p>
        <ul>
          <li>
            <strong>Never set a fixed height on a card.</strong> Set a minimum if the row needs rhythm, and let the
            tallest card decide.
          </li>
          <li>
            <strong>Use the body-stretch rules instead of matching heights by hand</strong> (Development tab) — they
            align footers whatever the text length does.
          </li>
          <li>
            <strong>Test the subtitle at two lines.</strong> It is the muted-color line, and two lines of muted text at
            4.76:1 is where a card starts to read as noise.
          </li>
          <li>
            <strong>Do not translate into the class list.</strong> Language-specific spacing classes are a sign that the
            layout is fighting the text; fix the layout.
          </li>
        </ul>

        <h3>RTL: the card is direction-neutral</h3>
        <p>
          No <code>[dir]</code> selector and no logical property appears in any rule that touches <code>.p-card</code> —
          the padding is a symmetric shorthand, the radius is uniform, and the shadow is purely vertical. Measured under
          <code>dir="rtl"</code> against <code>dir="ltr"</code> on the same nodes: the host, header, body, title,
          subtitle, content, and footer keep identical width, height, padding-left/right, margins, all four corner radii,
          and the same <code>box-shadow</code>; only computed <code>direction</code> flips, and
          <code>text-align</code> stays <code>start</code>, so text realigns on its own. Position is <em>not</em> on
          that list: a card narrower than its container moves to the other edge, because that is its container obeying
          <code>direction</code>, not the card mirroring itself. Two of the kit's visual styles add physical
          asymmetry that does not mirror either: lernwerkstatt's <code>3px 3px</code> offset shadow and skizzenbuch's
          hand-drawn radius — decorative, and harmless in RTL.
        </p>
        <p>
          What <em>does</em> mirror is the content you author. In the same measurement, a header row of two spans under
          <code>justify-content: space-between</code> swapped ends exactly as intended. So: nothing to do for the card,
          everything to do for the row inside it — logical properties for your own padding and margins, and no
          assumption that "the year is on the left".
        </p>
        <p class="src-note">
          To reproduce: set <code>dir="rtl"</code> on the document element and compare
          <code>getBoundingClientRect()</code> and computed styles for the same nodes against the LTR run.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 2026-10-01 — lernwerkstatt's dark surfaces turned neutral, and its dark outline with
            them: <code>#969491</code>, the style's control-edge grey, 5.5:1 on its ground, replacing <code>#9c8fac</code>.
          </li>
          <li>
            <strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the style outline is gated
            ("panel outline", 3.85:1 and up — lernwerkstatt's dark outline is <code>#9c8fac</code> now, no 1.17:1); the
            dark card shadow is a default that yields to each style's signature; the i18n sample names an existing key.
          </li>
          <li>
            <strong>v0.5</strong> — 2026-09-23 — Re-checked against Optimus UI 2.0.2 and the visual styles (ADR-0016): every style block outlines
            <code>.p-card</code> and sets its radius and shadow, so the "1.00:1, shadow-only edge" reading,
            the 12px radius, and the dark rgb() readings are replaced by the per-style rules, token names, and
            contrast composited from today's tokens (dark body text cited from CONTRAST.MD); the 20px header
            size corrected in the WCAG roll-up; narrow-screen statement in Design; annotated Sources close
            Usage; agent doc trimmed.
          </li>
          <li>
            <strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). Four of v0.3's claims flipped
            back to their v21 form: <code>style</code>/<code>styleClass</code> and the <code>pTemplate</code> route
            exist again, the facet queries are <code>descendants: true</code> (the empty-header half-failure is back),
            and the appended <code>.p-card &#123; display: block &#125;</code> rule beats the preset's flex column, so
            the equal-height fix is three rules again. Aura tokens are back on the 2.x values (body padding and title
            1.25rem; the subtitle has a color token only), so the 21-era color and RTL measurements carry unchanged.
            All line refs re-derived against the Optimus bundles.
          </li>
          <li>
            <strong>v0.3</strong> — 2026-08-24 — Re-verified against PrimeNG 22.1.2 / Aura 3.0: <code>style</code>/<code
              >styleClass</code
            >
            inputs and the <code>pTemplate</code> route removed; the <code>display: block</code> trap fixed upstream
            (host is a flex column — the equal-height fix drops to two rules); facet queries now direct-children-only
            like the template refs (the empty-header half-failure is gone); Aura 3.0 geometry re-measured (body padding
            and title 18px, subtitle gained explicit type tokens); <code>.p-card-caption</code> confirmed still dead;
            all line refs re-derived. Color measurements from 21 carry — the card color tokens are unchanged.
          </li>
          <li>
            <strong>v0.2</strong> — 2026-08-20 — WCAG 2.2 status roll-up added to the design tab: measured criteria
            summarized as passing / failing / conditional, unmeasured criteria explicitly unclaimed.
          </li>
          <li>
            <strong>v0.1</strong> — 2026-07-30 — Initial guide: the container decision table (card / panel / fieldset /
            section / kit container), the complete shipped-CSS surface, the Aura token chain with contrast measured
            against the real surface in both themes, the dead <code>caption</code> path, the three template routes and
            how each goes silent, the body-stretch fix, a measured RTL result, and the canonical agent doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class CardArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  protected readonly destroyRef = inject(DestroyRef);

  readonly copiedId = signal<string | null>(null);
  protected copyTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer !== null) clearTimeout(this.copyTimer);
    });
  }

  // --- Playground state ------------------------------------------------------
  readonly variantOptions = [
    { label: 'title via [header] — a styled div', value: 'plain' },
    { label: 'title via #title — a real heading', value: 'heading' },
    { label: 'header band + [header] title', value: 'band' },
    { label: 'band + heading + footer actions', value: 'full' },
  ];

  readonly pgTopic: string = 'Retrieval-augmented generation';
  readonly pgBody: string = 'The model looks the answer up before it writes it. Everything hard about the method is ' + 'in the looking up.';

  readonly pgVariant = signal<'plain' | 'heading' | 'band' | 'full'>('plain');
  readonly pgSubtitle = signal(true);
  readonly pgClip = signal(false);
  readonly pgBorder = signal(false);

  readonly pgSub = computed<string | undefined>(() => (this.pgSubtitle() ? 'Six minutes, intermediate' : undefined));

  /** Live-generated markup mirroring the playground configuration. */
  readonly pgCode = computed(() => {
    const v = this.pgVariant();
    const cls: string[] = [];
    if (this.pgClip()) cls.push('card--clip');
    if (this.pgBorder()) cls.push('card--edge');
    const classAttr = cls.length ? ` class="${cls.join(' ')}"` : '';
    const header = v === 'plain' || v === 'band' ? ` [header]="labels().title"` : '';
    const sub = this.pgSubtitle() ? ` [subheader]="labels().meta"` : '';
    const lines = [`<p-card${classAttr}${header}${sub}>`];
    if (v === 'band' || v === 'full') {
      lines.push('  <ng-template #header>');
      lines.push('    <div class="card-band">…</div>');
      lines.push('  </ng-template>');
    }
    if (v === 'heading' || v === 'full') {
      lines.push('  <ng-template #title>');
      lines.push('    <h3 class="card-title">{{ labels().title }}</h3>');
      lines.push('  </ng-template>');
    }
    lines.push('  <p>…</p>');
    if (v === 'full') {
      lines.push('  <ng-template #footer>');
      lines.push('    <p-button [label]="labels().read" size="small" />');
      lines.push('  </ng-template>');
    }
    lines.push('</p-card>');
    return lines.join('\n');
  });

  /** Literal `true`, so the nesting demo's @if block is present but still a block. */
  readonly alwaysTrue = true;

  // --- Equal-height demo -----------------------------------------------------
  readonly stretchFix = signal(false);

  toggleStretch(): void {
    this.stretchFix.update((v) => !v);
  }

  readonly stretchCards = [
    { id: 'a', title: 'Short', body: 'One line.' },
    {
      id: 'b',
      title: 'Long',
      body:
        'Four or five lines of description, the kind an editor writes when the topic is new ' +
        'and the reader has no prior handle on it, which is exactly when a card grid stops ' +
        'looking tidy.',
    },
    { id: 'c', title: 'Medium', body: 'Two lines, give or take a clause.' },
  ];

  /** The two inner thirds of the fix, expressed as pass-through instead of CSS. */
  readonly stretchPt = {
    body: { style: 'flex: 1' },
    footer: { style: 'margin-top: auto' },
  };

  readonly stretchSnippet: string = `/* The body never grows on its own, so footers in a stretched row
   do not share a baseline. Three rules: the host is display:block in
   Optimus, so it has to be made a flex column first; the last is the
   one that actually moves the footer, because growing the body does
   not move its last flex child. */
.card-grid > p-card       { display: flex; flex-direction: column; }
.card-grid .p-card-body   { flex: 1; }
.card-grid .p-card-footer { margin-top: auto; }

<!-- Same fix without a global selector, when the card lives in a
     style-encapsulated component: the inner two rules go through pt. -->
<p-card class="card-grid__item"
  [pt]="{ body: { style: 'flex: 1' }, footer: { style: 'margin-top: auto' } }">`;

  readonly linkCardSnippet: string = `<p-card class="link-card">
  <ng-template #title>
    <h3><a class="link-card__link" [routerLink]="item.route">{{ item.title }}</a></h3>
  </ng-template>
  <p>{{ item.teaser }}</p>
</p-card>

/* .link-card { position: relative; }
   .link-card__link::after { content: ''; position: absolute; inset: 0; } */`;

  readonly annotatedSource: string = `<p-card
  class="event-card"                       <!-- 'class' — styleClass is back but deprecated -->
  [header]="labels().title"                <!-- lands in .p-card-title: a DIV, not a heading -->
  [subheader]="labels().meta">             <!-- .p-card-subtitle, muted color -->

  <!-- Direct child of p-card. One wrapper element deeper it is never found:
       the #name queries are { descendants: false }. -->
  <ng-template #header>
    <div class="event-card__band">…</div>  <!-- .p-card-header ships NO styling -->
  </ng-template>

  <p>…</p>                                 <!-- default projection -> .p-card-content -->

  <ng-template #footer>                    <!-- inside .p-card-body, so the 0.5rem gap applies -->
    <p-button [label]="labels().read" size="small" />
  </ng-template>
</p-card>

/* .event-card {
     border: 1px solid var(--surface-border);   // outside the kit's style blocks, the shadow is the only edge
     overflow: hidden;                          // clip the filled band to the card's radius
   } */`;

  readonly shippedCss: string = `/* 1-5: @openng/optimus-ui-styles/dist/card/index.mjs — the whole preset file */
.p-card         { background: dt('card.background'); color: dt('card.color');
                  box-shadow: dt('card.shadow'); border-radius: dt('card.border.radius');
                  display: flex; flex-direction: column; }
.p-card-caption { display: flex; flex-direction: column; gap: dt('card.caption.gap'); }
.p-card-body    { padding: dt('card.body.padding'); display: flex;
                  flex-direction: column; gap: dt('card.body.gap'); }
.p-card-title   { font-size: dt('card.title.font.size'); font-weight: dt('card.title.font.weight'); }
.p-card-subtitle{ color: dt('card.subtitle.color'); }

/* 6: the Angular package concatenates this AFTER the preset file
   (openng-optimus-ui-card.mjs:14-20). Same specificity, later, so the
   host is display: block and the preset's flex column never applies.
   PrimeNG 22 had dropped this rule; Optimus brings it back. */
.p-card         { display: block; }

/* 7-8: this kit, styles.scss — dark theme only; the colors are !important,
   so the Aura dark card colors never reach the page; the shadow is a
   default that yields to the style blocks below */
.dark-theme .p-card                  { background-color: var(--surface-card) !important;
                                       color: var(--text-color) !important;
                                       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); }
.dark-theme .p-card .p-card-header   { background-color: var(--surface-section) !important;
                                       color: var(--text-color) !important;
                                       border-bottom-color: var(--surface-border) !important; }

/* 9: this kit, styles.scss — one block per visual style (ADR-0016). Every
   style outlines the card; width, radius and shadow differ per style:
   werkbund 3px light / 2px dark (--style-bw), radius 0, no shadow;
   lernwerkstatt 2px + a 3px offset shadow, radius 16px; skizzenbuch 1.5px,
   paper shadow, hand-drawn radius; blaupause 1px, radius 2px, no shadow.
   (0,2,1) beats the dark default above (0,2,0), so the signature holds in
   dark mode too. */
html.style-werkbund .p-card          { border: var(--style-bw) solid var(--style-outline);
                                       border-radius: 0; box-shadow: none; }`;

  readonly ptSnippet: string = `<!-- pt.root and pt.host are merged onto the <p-card> element itself
     and written from onAfterViewChecked. -->
<p-card [pt]="{ root: { role: 'group', 'aria-labelledby': titleId } }">
  <ng-template #title><h3 [id]="titleId">{{ labels().title }}</h3></ng-template>
  …
</p-card>`;

  readonly i18nSnippet: string = `// labels(): one computed() map, re-evaluated on a language switch.
readonly labels = computed(() => ({
  title: this.t.translate('events.rag.title'),
  meta: this.t.translate('events.rag.meta'),
  open: this.t.translate('common.openLink'),
}));

// <p-card [header]="labels().title" [subheader]="labels().meta">`;

  copy(id: string, text: string): void {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(
      () => {
        this.copiedId.set(id);
        if (this.copyTimer !== null) clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => {
          this.copiedId.set(null);
          this.copyTimer = null;
        }, 1500);
      },
      () => {
        /* clipboard denied — leave the label unchanged */
      },
    );
  }
}
