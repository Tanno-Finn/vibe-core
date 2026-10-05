import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ImageModule } from '@openng/optimus-ui/image';
import { ImageCompareModule } from '@openng/optimus-ui/imagecompare';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, ImageModule, ImageCompareModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-image-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-image-article .fig {
        margin: 0.75rem 0;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        max-width: 40rem;
      }

      app-image-article .fig figcaption {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }

      app-image-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
        max-width: 40rem;
      }

      app-image-article .zoom-host,
      app-image-article .fig .p-image,
      app-image-article .stage .p-image,
      app-image-article .dd__stage .p-image {
        display: flex;
      }

      app-image-article .compare {
        display: block;
      }

      app-image-article .pair {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
      }

      app-image-article .pair figure {
        margin: 0;
      }

      app-image-article .pair img {
        display: block;
        width: 100%;
        height: auto;
      }

      app-image-article .pair figcaption {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      app-image-article .pair__note {
        margin: 0.5rem 0 0;
        font-size: 0.85rem;
      }

      app-image-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-image-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        min-width: 0;
      }

      app-image-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-image-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-image-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-image-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-image-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-image-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-image-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-image-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-image-article .dd,
        app-image-article .pair {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: Image and ImageCompare (Guides, category `library`).
 *
 * Subject: `p-image` — an <img> with an optional preview overlay (a modal
 * with rotate/zoom/close buttons) — and `p-imagecompare`, two stacked images
 * with a native range input that clips the upper one.
 * Everything claimed comes from the shipped source of Optimus UI 2.0.2.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-image.mjs unless noted):
 *   - Inputs :128-232, outputs onShow/onHide/onImageError :258-269, compiled
 *     input list and host listener document:keydown.escape at :510.
 *   - Thumbnail <img> binds [attr.alt]="alt" — absent when unset (:511-525).
 *   - Preview button: aria-label from config aria.zoomImage, ngStyle
 *     height/width = input + 'px' (:529-537); CSS opacity 0 until hover or
 *     focus-visible, outline 0 none (@openng/optimus-ui-styles/dist/image).
 *   - Mask: role="dialog", [attr.aria-modal], pFocusTrap, no name (:538-554).
 *   - Toolbar buttons: aria-labels from config aria.rotateRight/rotateLeft/
 *     zoomOut/zoomIn/close; zoom buttons [disabled] at the limits (:555-586).
 *   - Enlarged <img> has no alt (:590-598).
 *   - Focus to close button 25ms after enter (:438-440); Escape on the mask
 *     closes and refocuses the preview button (:399-411); the document-level
 *     Escape handler closes (:504-508); close button and backdrop close
 *     without refocusing (:483-485, :393-398).
 *   - previewClick flag: toolbar clicks set it and stop propagation, so the
 *     next backdrop click only resets it (:393-398, :415-430, :480-482).
 *   - zoomSettings hard-coded default 1, step 0.1, min 0.5, max 1.5
 *     (:333-338); the float sums stop zoom-in at 1.4000000000000004.
 *   - Body scroll blocked on open (:390), released after leave (:457).
 *   - Config strings: openng-optimus-ui-config.mjs:184, :222-226.
 *   - ImageCompare (openng-optimus-ui-imagecompare.mjs): inputs tabindex,
 *     ariaLabelledby, ariaLabel, all bound on the host (:136); template: left,
 *     right, then <input type="range" min=0 max=100 value=50> with no name
 *     (:137-140); onSlide clips previousElementSibling (:107-116); RTL via
 *     closest('[dir="rtl"]') and a MutationObserver guarded by
 *     isPlatformBrowser (:117-129).
 *   - ImageCompare CSS: @openng/optimus-ui-styles/dist/imagecompare —
 *     aspect-ratio 16/9, img 100% x 100% absolute, img + img clipped,
 *     slider outline: none; tokens in .../aura/imagecompare (handle 15px,
 *     rgba(255,255,255,0.3), focus ring color the same).
 *   - Kit (src/styles.scss): the preview button and the toolbar buttons are in
 *     the one focus-ring list (the toolbar rings in its icon ink), and the
 *     toolbar sits on a 60% black plate — docs/generated/CONTRAST.MD "image
 *     preview". The kit pushes the five preview strings in the page language
 *     (OPTIMUS_ARIA_KEYS). The eye icon on the veil and the compare handle
 *     are not gated: their ratios are computed from stock Aura values with the
 *     WCAG 2.2 formula.
 */
@Component({
  selector: 'app-image-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Unencapsulated so the layout rules below reach the library's subtree; every
  // selector is prefixed with the host tag instead.
  encapsulation: ViewEncapsulation.None,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'image'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          <code>p-image</code> is an <code>&lt;img&gt;</code> that can open a full-screen preview;
          <code>p-imagecompare</code> lays two images on top of each other and lets a slider reveal one. Both pass your
          alt text through, and both leave gaps you have to close: an unnamed dialog, an enlarged image without alt text,
          an unnamed slider, and a handle that disappears on light pictures.
        </p>

        <h3>An informative image, no preview</h3>
        <figure class="fig">
          <p-image [src]="chartUri" [alt]="m.chartAlt" [imageStyle]="fluid" />
          <figcaption>{{ m.chartCaption }}</figcaption>
        </figure>
        <p class="src-note">
          <code>alt</code> is bound as <code>[attr.alt]</code> on the rendered <code>&lt;img&gt;</code>
          (<code>openng-optimus-ui-image.mjs:516</code>). Left unset, the attribute is absent — not empty.
        </p>

        <h3>The preview, with its gaps closed</h3>
        <figure class="fig">
          <span #zoomHost class="zoom-host">
            <p-image
              [src]="chartUri"
              [alt]="m.chartAlt"
              [preview]="true"
              [imageStyle]="fluid"
              [pt]="previewPt"
              (onHide)="restoreFocus(zoomHost)" />
          </span>
          <figcaption id="img-guide-cap">{{ m.chartCaption }}</figcaption>
        </figure>
        <p>{{ m.previewTry }}</p>
        <p class="src-note">
          Three pass-through attributes: a name for the <code>role="dialog"</code> mask, an <code>alt</code> for the
          enlarged image, and a description for the preview button that points at the caption
          (<code>pt</code> sections <code>mask</code>, <code>original</code>, <code>previewMask</code>). The
          <code>onHide</code> handler returns focus to the preview button, which the library does only for Escape. The
          focus rings need nothing here: the kit's global stylesheet gives the preview button its one 2px ring and the
          toolbar buttons the same ring in their icon ink.
        </p>

        <h3>A decorative image</h3>
        <div class="stage">
          <p-image [src]="waveUri" alt="" [imageStyle]="fluid" />
        </div>
        <p class="src-note">
          <code>alt=""</code> renders an empty attribute and removes the picture from the accessibility tree. A
          decorative image never gets <code>preview</code>: that would put an unnamed-purpose button in the tab order.
        </p>

        <h3>ImageCompare, named and made visible</h3>
        <figure class="fig">
          <p-imagecompare [pt]="comparePt" [dt]="compareDt" class="compare">
            <ng-template #left>
              <img [src]="sceneGrayUri" [alt]="m.grayAlt" />
            </ng-template>
            <ng-template #right>
              <img [src]="sceneColorUri" [alt]="m.colorAlt" />
            </ng-template>
          </p-imagecompare>
          <figcaption>{{ m.compareCaption }}</figcaption>
        </figure>
        <p class="src-note">
          The range input gets its name through the <code>slider</code> pass-through section — the
          <code>ariaLabel</code> input would land on the host, not on the input
          (<code>openng-optimus-ui-imagecompare.mjs:136-140</code>). The handle is restyled through <code>dt</code>:
          white with a dark 2px ring and a 3px accent focus ring, instead of the stock 30% white. The caption carries the
          comparison in words.
        </p>

        <h3>What the preview renders when it opens</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Template at <code>openng-optimus-ui-image.mjs:529-613</code>. Names in quotes are the English defaults from
          <code>openng-optimus-ui-config.mjs:184</code> and <code>:222-226</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Which alt text</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>The image is…</th><th><code>alt</code></th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>Informative (a photo, an illustration that makes a point)</td><td>the point, in one sentence</td><td>{{ m.altInformative }}</td></tr>
              <tr><td>Decorative (mood, repetition of the caption)</td><td><code>""</code></td><td>{{ m.altDecorative }}</td></tr>
              <tr><td>Complex (chart, diagram)</td><td>short summary + the data as text</td><td>{{ m.altComplex }}</td></tr>
              <tr><td>The only content of a link or button</td><td>the destination or action</td><td>{{ m.altFunctional }}</td></tr>
              <tr><td>Text set as a picture</td><td>the same text</td><td>{{ m.altText }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The categories follow the W3C Images Tutorial; SC 1.1.1 requires one of them for every
          <code>&lt;img&gt;</code>. The library adds none of its own.
        </p>

        <h3>Preview: when it earns its place</h3>
        <p>{{ m.previewWhen }}</p>

        <h3>ImageCompare: when not to use it</h3>
        <p>{{ m.compareWhen }}</p>
        <ul class="checklist">
          <li>{{ m.compareNot1 }}</li>
          <li>{{ m.compareNot2 }}</li>
          <li>{{ m.compareNot3 }}</li>
          <li>{{ m.compareNot4 }}</li>
        </ul>
        <p>{{ m.compareInstead }}</p>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an alt that names the file type</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" alt="Chart" [imageStyle]="fluid" />
            </div>
            <p class="dd__why">{{ m.altBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the point of the chart</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" [alt]="m.chartAlt" [imageStyle]="fluid" />
            </div>
            <p class="dd__why">{{ m.altGoodWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the slider as the only carrier of the difference</span>
            <div class="dd__stage">
              <p-imagecompare [pt]="comparePt" [dt]="compareDt" class="compare">
                <ng-template #left><img [src]="sceneGrayUri" alt="Landscape" /></ng-template>
                <ng-template #right><img [src]="sceneColorUri" alt="Landscape" /></ng-template>
              </p-imagecompare>
            </div>
            <p class="dd__why">{{ m.compareBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — both images, and the difference in words</span>
            <div class="dd__stage">
              <div class="pair">
                <figure>
                  <img [src]="sceneGrayUri" [alt]="m.grayAlt" />
                  <figcaption>Before</figcaption>
                </figure>
                <figure>
                  <img [src]="sceneColorUri" [alt]="m.colorAlt" />
                  <figcaption>After</figcaption>
                </figure>
              </div>
              <p class="pair__note">{{ m.compareCaption }}</p>
            </div>
            <p class="dd__why">{{ m.compareGoodWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — a thumbnail that is only legible zoomed</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" [alt]="m.chartAlt" [preview]="true" [imageStyle]="thumb" />
            </div>
            <p class="dd__why">{{ m.thumbBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — legible in place, the data beside it</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" [alt]="m.chartAlt" [imageStyle]="fluid" />
              <p class="pair__note">{{ m.chartCaption }}</p>
            </div>
            <p class="dd__why">{{ m.thumbGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          All six cells are live. The zoom cap and the missing pan are in
          <code>openng-optimus-ui-image.mjs:333-338</code> and <code>:474-476</code>: the preview is a CSS transform,
          no scrolling, no dragging.
        </p>

        <h3>Sources</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-image.mjs</code> and <code>openng-optimus-ui-imagecompare.mjs</code> (Optimus UI
            2.0.2) — every binding, key handler, and focus move cited here.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-styles/dist/image/index.mjs</code>,
            <code>&#64;openng/optimus-ui-styles/dist/imagecompare/index.mjs</code> and the matching Aura token files — the
            focus styles, the handle, and the geometry.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/images/decision-tree/" rel="noopener noreferrer" target="_blank"
              >W3C alt decision tree</a
            >
            — the five cases in the table above.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html" rel="noopener noreferrer"
              target="_blank">WCAG 2.2 SC 1.1.1</a
            >
            — text alternatives, and what counts as decoration.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" rel="noopener noreferrer" target="_blank"
              >APG Dialog (Modal)</a
            >
            — a dialog needs a name, initial focus, a trap, and focus return on every way out.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" rel="noopener noreferrer"
              target="_blank">WCAG 2.2 SC 2.4.7</a
            >
            and
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" rel="noopener noreferrer"
              target="_blank">SC 1.4.11</a
            >
            — the preview button and the compare handle as shipped.
          </li>
          <li>
            <a href="https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range)" rel="noopener noreferrer"
              target="_blank">HTML, range state</a
            >
            — why the compare slider already works with the keyboard.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura value</th><th>What it paints</th></tr>
            </thead>
            <tbody>
              <tr><td><code>image.preview.mask.background</code></td><td><code>&#123;mask.background&#125;</code></td><td>{{ m.tokMaskBg }}</td></tr>
              <tr><td><code>image.preview.mask.color</code></td><td><code>&#123;mask.color&#125;</code></td><td>{{ m.tokMaskFg }}</td></tr>
              <tr><td><code>image.toolbar.*</code></td><td>see note</td><td>{{ m.tokToolbar }}</td></tr>
              <tr><td><code>image.action.color</code> / <code>.hover.color</code></td><td><code>&#123;surface.50&#125;</code> / <code>&#123;surface.0&#125;</code></td><td>{{ m.tokAction }}</td></tr>
              <tr><td><code>image.action.size</code> / <code>.icon.size</code></td><td>3rem / 1.5rem</td><td>{{ m.tokActionSize }}</td></tr>
              <tr><td><code>image.action.focus.ring.*</code></td><td><code>&#123;focus.ring.*&#125;</code></td><td>{{ m.tokActionRing }}</td></tr>
              <tr><td><code>imagecompare.handle.size</code> / <code>.hover.size</code></td><td>15px / 30px</td><td>{{ m.tokHandleSize }}</td></tr>
              <tr><td><code>imagecompare.handle.background</code></td><td><code>rgba(255,255,255,0.3)</code></td><td>{{ m.tokHandleBg }}</td></tr>
              <tr><td><code>imagecompare.handle.focus.ring.color</code></td><td><code>rgba(255,255,255,0.3)</code></td><td>{{ m.tokHandleRing }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/image/index.mjs</code> and
          <code>…/aura/imagecompare/index.mjs</code>; toolbar: 1rem from top and end, <code>rgba(255,255,255,0.1)</code>
          with an 8px backdrop blur, 30px radius — the kit repaints it <code>rgba(0,0,0,0.6)</code>
          (<code>.p-image-toolbar</code> in <code>src/styles.scss</code>). <code>&#123;mask.background&#125;</code> and
          the focus ring from <code>…/aura/base/index.mjs</code>; the kit's ring list replaces that ring on the preview
          button and the toolbar buttons. No <code>html.style-*</code> block touches either component, and none of
          these tokens reads the style's radius scale.
        </p>

        <h3>Focus visibility and contrast, in the kit</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Element</th><th>Focus indicator</th><th>Contrast</th></tr>
            </thead>
            <tbody>
              <tr><td>Preview button</td><td>{{ m.focPreview }}</td><td>{{ m.crPreview }}</td></tr>
              <tr><td>Toolbar buttons</td><td>{{ m.focAction }}</td><td>{{ m.crAction }}</td></tr>
              <tr><td>Compare handle</td><td>{{ m.focHandle }}</td><td>{{ m.crHandle }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gated: the toolbar rows of <code>docs/generated/CONTRAST.MD</code> ("image preview",
          <code>image.action.color</code> on the plate over the mask over each page surface) and the kit ring on the
          page surfaces ("focus ring"). Not gated: the eye icon on the veil and the compare handle sit on the picture
          itself, where no token pair exists — computed with the WCAG 2.2 formula from the stock token values over pure
          white and black.
        </p>

        <h3>What the kit already does, and the fix left to you</h3>
        <pre class="code-block"><code>{{ focusCssSnippet }}</code></pre>
        <pre class="code-block"><code>{{ compareDtSnippet }}</code></pre>
        <p class="src-note">
          The library's own rule is <code>.p-image-preview-mask:focus-visible</code> with <code>outline: 0 none</code>;
          the kit's ring rule in <code>src/styles.scss</code> overrides it with <code>!important</code>, globally,
          because the button carries no encapsulation attribute. Do not add a second ring rule or a
          <code>dt</code> ring for either part. The compare handle is still yours: the Firefox thumb rule reads a
          <code>handle.border.style</code> token that the Aura preset does not define, so set it with the border.
        </p>

        <h3>Narrow screens</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>.p-image-original</code> is capped at <code>100vw</code> by <code>100vh</code>; the preview button's
          inline size comes from <code>height + 'px'</code> and <code>width + 'px'</code>
          (<code>openng-optimus-ui-image.mjs:530</code>); <code>.p-imagecompare</code> is <code>width: 100%</code>
          with <code>aspect-ratio: 16 / 9</code>. Neither sheet has a media query.
        </p>

        <h3>Motion</h3>
        <p>{{ m.motion }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>p-image inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>src</code>, <code>srcSet</code>, <code>sizes</code>, <code>loading</code></td><td>{{ m.apiSrc }}</td></tr>
              <tr><td><code>alt</code></td><td>{{ m.apiAlt }}</td></tr>
              <tr><td><code>width</code>, <code>height</code></td><td>{{ m.apiSize }}</td></tr>
              <tr><td><code>imageClass</code>, <code>imageStyle</code></td><td>{{ m.apiImageStyle }}</td></tr>
              <tr><td><code>preview</code></td><td>{{ m.apiPreview }}</td></tr>
              <tr><td><code>previewImageSrc</code>, <code>previewImageSrcSet</code>, <code>previewImageSizes</code></td><td>{{ m.apiPreviewSrc }}</td></tr>
              <tr><td><code>appendTo</code></td><td>{{ m.apiAppendTo }}</td></tr>
              <tr><td>transition and motion inputs</td><td>{{ m.apiMotion }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared at <code>openng-optimus-ui-image.mjs:128-232</code>; outputs <code>onShow</code>,
          <code>onHide</code>, <code>onImageError</code> at <code>:258-269</code>. Templates <code>#image</code>
          (receives <code>errorCallback</code>), <code>#preview</code>, <code>#indicator</code>, and five icon templates.
          Pass-through sections: <code>image</code>, <code>previewMask</code>, <code>previewIcon</code>,
          <code>mask</code>, <code>toolbar</code>, the five button sections, <code>original</code>.
        </p>

        <h3>The preview, key by key</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Step</th><th>What happens</th><th>Source</th></tr>
            </thead>
            <tbody>
              <tr><td>Tab to the image</td><td>{{ m.kTab }}</td><td><code>:529-537</code></td></tr>
              <tr><td>Enter or Space</td><td>{{ m.kOpen }}</td><td><code>:384-392</code>, <code>:431-441</code></td></tr>
              <tr><td>Tab inside</td><td>{{ m.kTrap }}</td><td><code>:546</code>, <code>:568-579</code></td></tr>
              <tr><td>Zoom in / out</td><td>{{ m.kZoom }}</td><td><code>:327-338</code></td></tr>
              <tr><td>Escape</td><td>{{ m.kEsc }}</td><td><code>:399-411</code>, <code>:504-508</code></td></tr>
              <tr><td>Close button, backdrop</td><td>{{ m.kClose }}</td><td><code>:393-398</code>, <code>:483-485</code></td></tr>
            </tbody>
          </table>
        </div>

        <h3>Closing the gaps</h3>
        <pre class="code-block"><code>{{ previewFixSnippet }}</code></pre>
        <p class="src-note">
          The pass-through attributes are applied by the <code>pBind</code> directive with
          <code>setAttribute</code> (<code>openng-optimus-ui-bind.mjs:31-50</code>). They are safe on
          <code>mask</code>, <code>original</code>, and <code>slider</code> because the library binds no attribute of the
          same name there; the preview button's <code>aria-label</code> is library-bound, so it is described, not
          renamed.
        </p>

        <h3>p-imagecompare</h3>
        <p>{{ m.apiCompare }}</p>
        <pre class="code-block"><code>{{ compareSnippet }}</code></pre>

        <h3>Server rendering</h3>
        <p>{{ m.ssr }}</p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkAlt }}</li>
          <li>{{ m.checkPreviewName }}</li>
          <li>{{ m.checkFocus }}</li>
          <li>{{ m.checkRing }}</li>
          <li>{{ m.checkCompareName }}</li>
          <li>{{ m.checkCompareText }}</li>
          <li>{{ m.checkStrings }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Alt text is content</h3>
        <p>{{ m.i18nAlt }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>The library's own strings</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Key (<code>translation.aria</code>)</th><th>Default</th><th>Where</th><th>Kit</th></tr>
            </thead>
            <tbody>
              <tr><td><code>zoomImage</code></td><td>Zoom Image</td><td>preview button</td><td>page language</td></tr>
              <tr><td><code>rotateRight</code>, <code>rotateLeft</code></td><td>Rotate Right, Rotate Left</td><td>toolbar</td><td>page language</td></tr>
              <tr><td><code>zoomIn</code>, <code>zoomOut</code></td><td>Zoom In, Zoom Out</td><td>toolbar</td><td>page language</td></tr>
              <tr><td><code>close</code></td><td>Close</td><td>toolbar</td><td>page language</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Defaults at <code>openng-optimus-ui-config.mjs:184</code> and <code>:222-226</code>. The kit hands Optimus a
          fixed set of <code>aria</code> keys in the page language (<code>OPTIMUS_ARIA_KEYS</code> and
          <code>syncAriaStrings()</code> in <code>src/app/services/optimus-a11y.service.ts</code>); all six preview keys
          are in it. ImageCompare has no strings.
        </p>

        <h3>Text inside pictures</h3>
        <p>{{ m.i18nText }}</p>

        <h3>Writing direction</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.1</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the preview button and toolbar
            rings, the toolbar plate and the five preview strings are the kit's now, cited from CONTRAST.MD; this
            page's own ring rule and <code>dt</code> removed.
          </li>
          <li><strong>1.0</strong> — 2026-09-23 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ImageArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /**
   * Return focus to the preview button after any close. The library does this
   * for Escape only. onHide is emitted after the leave animation, in the browser.
   */
  restoreFocus(host: HTMLElement): void {
    host.querySelector<HTMLButtonElement>('.p-image-preview-mask')?.focus();
  }

  /** Width follows the container; the aspect ratio reserves the height before load. */
  readonly fluid = { width: '100%', height: 'auto', aspectRatio: '16 / 9' };
  readonly thumb = { width: '6rem', height: 'auto', aspectRatio: '16 / 9' };

  readonly previewPt = {
    mask: { 'aria-label': 'Enlarged chart: next-token probabilities' },
    original: {
      alt: 'Bar chart of five candidate next tokens. The first bar reaches about 60 percent; the other four stay under 15 percent each.',
    },
    previewMask: { 'aria-describedby': 'img-guide-cap' },
  };

  readonly comparePt ={ slider: { 'aria-label': 'Colorized share of the picture, in percent' } };

  readonly compareDt = {
    handle: {
      size: '24px',
      hoverSize: '30px',
      background: '#ffffff',
      hoverBackground: '#ffffff',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: '#121212',
      hoverBorderColor: '#121212',
      focusRing: { width: '3px', style: 'solid', color: 'var(--primary-color-fg)', offset: '2px' },
    },
  };

  /** Synthetic bar chart, no text in the picture (SC 1.4.5). */
  readonly chartUri: string = 'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">' +
        '<rect width="640" height="360" fill="#f8fafc"/>' +
        '<line x1="60" y1="320" x2="600" y2="320" stroke="#334155" stroke-width="2"/>' +
        '<rect x="90" y="104" width="70" height="216" fill="#1d4ed8"/>' +
        '<rect x="200" y="277" width="70" height="43" fill="#64748b"/>' +
        '<rect x="310" y="288" width="70" height="32" fill="#64748b"/>' +
        '<rect x="420" y="298" width="70" height="22" fill="#64748b"/>' +
        '<rect x="530" y="306" width="70" height="14" fill="#64748b"/>' +
        '</svg>',
    );

  /** Synthetic decorative wave. */
  readonly waveUri: string = 'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 120">' +
        '<rect width="640" height="120" fill="#e2e8f0"/>' +
        '<path d="M0 80 C 160 20, 320 140, 480 60 S 640 60, 640 60 V120 H0z" fill="#94a3b8"/>' +
        '</svg>',
    );

  protected scene(sky: string, sun: string, hill: string, wall: string, roof: string): string {
    return (
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">' +
          '<rect width="640" height="360" fill="' + sky + '"/>' +
          '<circle cx="520" cy="80" r="40" fill="' + sun + '"/>' +
          '<path d="M0 260 Q 200 170 400 240 T 640 220 V360 H0z" fill="' + hill + '"/>' +
          '<rect x="230" y="190" width="90" height="60" fill="' + wall + '"/>' +
          '<path d="M220 192 L275 150 L330 192z" fill="' + roof + '"/>' +
          '</svg>',
      )
    );
  }

  readonly sceneGrayUri = this.scene('#d4d4d4', '#f5f5f5', '#737373', '#e5e5e5', '#404040');
  readonly sceneColorUri = this.scene('#7dd3fc', '#facc15', '#16a34a', '#fef3c7', '#b91c1c');

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    chartAlt:
      'Bar chart of five candidate next tokens. The first reaches about 60 percent; the other four stay under 15 percent each.',
    chartCaption: 'Next-token probabilities: 60, 12, 9, 6, and 4 percent for the five most likely candidates.',
    previewTry:
      'Tab to the chart and press Enter: focus lands on Close, Tab cycles through the five toolbar buttons, and Escape, Close, or a click on the backdrop brings you back to the chart.',
    grayAlt: 'A landscape in grayscale: a small house on a hill under the sun.',
    colorAlt: 'The same landscape in color: blue sky, yellow sun, green hill, a house with a red roof.',
    compareCaption:
      'Colorization adds a blue sky, a yellow sun, a green hill, and a red roof. Shapes and composition are unchanged.',

    // usage — alt table
    altInformative:
      'Say what the image contributes to the text around it, not what it looks like in detail. No "image of" — the role already says so.',
    altDecorative:
      'An empty alt removes the image from the tree. A missing alt does the opposite: many screen readers fall back to the file name.',
    altComplex:
      'An alt holds a sentence, not a table. Put the numbers in the caption or a table next to the image, and keep the alt to the finding.',
    altFunctional:
      'The image is the link text. "Profile" or "Download the report" tells the user where they go; a description of the picture does not.',
    altText: 'A picture of text cannot be translated, resized, or restyled. Prefer real text; if not, the alt repeats it word for word.',

    previewWhen:
      'Turn preview on when a reader benefits from seeing the picture larger than the column: a photo with detail, a screenshot. Leave it off for decorative images and for images inside links. The preview is not a reading aid for small print — the zoom stops at 140% and cannot be panned.',
    compareWhen:
      'The comparison is operable: the slider is a native range input, so Tab reaches it and the arrow keys, Home, and End move it without any help from the library. What it cannot do is tell anyone what changed. The reveal is a clip on one of the two images; a screen reader hears two alt texts and a slider whose number changes nothing it can perceive.',
    compareNot1: 'Do not use it when the difference is the message and must reach every reader — say the difference in text.',
    compareNot2: 'Do not use it for images of different size or framing: both are stretched to a fixed 16:9 box.',
    compareNot3: 'Do not use it for fine detail that needs zoom — the component has none.',
    compareNot4: 'Do not ship it with the stock handle: 30% white on a light picture is invisible, focused or not.',
    compareInstead:
      'Instead: two figures side by side (stacked on narrow screens), each with its own alt and caption, and one sentence that names the change. Add ImageCompare on top of that as an enhancement, never in place of it.',

    altBadWhy: '"Chart" is what the role already announces. The reader learns that there is a chart, not what it shows.',
    altGoodWhy: 'The alt carries the finding; the caption carries the numbers for anyone who wants them.',
    compareBadWhy:
      'Both alts say "Landscape" and nothing else describes the change. A screen reader user hears the same word twice and a slider; a keyboard user can move the edge but gets no words for what appears.',
    compareGoodWhy:
      'Everyone gets both pictures, a caption per picture, and the difference in a sentence. It also works without the slider, on every screen width.',
    thumbBadWhy:
      'At 6rem the bars are not comparable, and the preview grows the picture to the viewport and at most 140% of that. The only way to the data is through a modal.',
    thumbGoodWhy: 'The chart is legible at column width, and the caption states the numbers, so neither sight nor zoom is required.',

    // design
    tokMaskBg: 'the preview-button veil on hover or focus and the full-screen backdrop: rgba(0,0,0,0.4) light, rgba(0,0,0,0.6) dark',
    tokMaskFg: 'the eye icon on the preview button: {surface.200}',
    tokToolbar:
      'the pill with the five buttons, fixed 1rem from top and end; Aura makes it 10% white glass, the kit a 60% black plate',
    tokAction: 'the toolbar icons: near-white in both schemes, because the plate is always dark',
    tokActionSize: 'every toolbar button is 48px square — above the 24px target minimum',
    tokActionRing:
      "Aura: 1px solid {primary.color} at 2px offset — the kit replaces it with its 2px ring in the icon's own ink (currentColor)",
    tokHandleSize: 'the thumb of the range input; the whole input spans the picture, so the pointer target is large',
    tokHandleBg: 'the thumb itself, with no border by default',
    tokHandleRing: 'the only focus indicator of the input, which has outline: none',

    focPreview:
      "the kit's one ring, 2px --primary-color-fg at 2px offset, over the library's outline: 0 none; the button also fades from opacity 0 to the mask color",
    crPreview:
      'the ring on the page surfaces 3.88–17.85:1 (CONTRAST.MD "focus ring"); the eye icon on the veil over a white picture 2.31:1 — depends on the picture, not gated',
    focAction: '2px ring in the icon ink (currentColor) at 2px offset; the toolbar padding keeps it on the plate',
    crAction:
      'icons on the 60% black plate 10.38–19.75:1, hovered 8.06–17.03:1, over every page surface (CONTRAST.MD "image preview"); the ring is the same ink',
    focHandle: '1px outline in 30% white around a 30% white thumb',
    crHandle: '1.00:1 over white, 2.46:1 over black — invisible on light pictures',

    narrow:
      'The thumbnail has no responsive behavior of its own: with width and height inputs it keeps those pixels and overflows, and the preview button takes the same pixels from its inline style. Leave width and height unset and size the image with imageStyle (width 100%, height auto, an aspect-ratio to reserve the space) on a block-level host. The preview fits any viewport — the image is capped at 100vw by 100vh and the toolbar needs about 306px from the end edge, so at 320px it covers the top of the picture — but a zoomed picture that grows past the viewport is clipped and cannot be scrolled or panned. ImageCompare is width 100% at a fixed 16:9 ratio and scales down with its container; on a phone the pictures become small and the thumb stays 15px (24px with the fix).',
    motion:
      'The preview fades and scales in and out over 300ms, the mask over 150ms, and rotate and zoom animate the transform over 300ms; the compare handle eases with the 0.2s transition token. None of the sheets asks for prefers-reduced-motion. The kit\'s global reduced-motion block in src/styles.scss cuts every animation and transition to 0.01ms, so under reduce all of it becomes an instant change.',

    // development
    apiSrc: 'Passed to the <img> as attributes. loading="lazy" is honored by the thumbnail only; the preview image loads on open.',
    apiAlt: 'Bound as an attribute; unset means no alt at all. The enlarged image never receives it.',
    apiSize:
      'Attributes on the thumbnail, and also the preview button\'s inline height and width in px. Strings like "100%" become "100%px" and are dropped.',
    apiImageStyle: 'Class and inline style for the thumbnail <img> — the way to make it fluid.',
    apiPreview: 'Adds the preview button and the overlay. Boolean attribute.',
    apiPreviewSrc: 'A larger file for the overlay; falls back to src.',
    apiAppendTo: 'Where the overlay goes; the default is "self", so article-scoped styles reach it.',
    apiMotion:
      'showTransitionOptions, hideTransitionOptions, modalEnterAnimation, modalLeaveAnimation, maskMotionOptions, motionOptions — timing only.',

    kTab: 'The only stop is an invisible <button> over the image, named from the global configuration ("Zoom Image" by default; the kit hands it over in the page language) — the same name for every image on the page.',
    kOpen: 'The mask renders as role="dialog" aria-modal="true" with no name; the page stops scrolling; after 25ms focus moves to Close.',
    kTrap: 'pFocusTrap cycles through Rotate Right, Rotate Left, Zoom Out, Zoom In, Close. A zoom button at its limit becomes disabled and drops out of the cycle.',
    kZoom: 'Buttons only — no +/- keys, no wheel, no pan. Steps of 0.1 from 1; zoom in stops at 1.4, zoom out at 0.5. The limits are not inputs. The button that reaches its limit is disabled under focus, and focus falls to the document body; the next Tab lands on Close.',
    kEsc: 'Closes, and focus returns to the preview button after 25ms. A second handler on the document closes too.',
    kClose: 'Closes without moving focus: the focused button is removed and focus falls to the document. After a toolbar click, the first backdrop click only resets a flag; the second closes.',

    apiCompare:
      'Inputs tabindex, ariaLabel, and ariaLabelledby are all bound on the host, which has no role — a name there does not reach the slider, and tabindex adds a second, useless tab stop. The templates #left and #right each render one element; the second one must be an <img> directly before the input, because the stylesheet clips img + img and the script clips previousElementSibling. #left is the base layer, visible to the end side of the handle; #right sits on top and is revealed from the start edge. The slider starts at 50, has step 1, and there is no input to set the start and no output to read the position; aria-valuetext is never set, so the value is announced as a bare number.',
    ssr: 'Both render complete on the server. The preview overlay exists only after a click. ImageCompare starts its MutationObserver only in the browser (isPlatformBrowser, openng-optimus-ui-imagecompare.mjs:121), and p-image listens for Escape on the document from every instance, open or not.',

    checkAlt: 'Every p-image has an alt — a sentence, or "" for decoration. Never leave it unset.',
    checkPreviewName: 'With preview on: pt names the mask, gives the enlarged image its alt, and describes the preview button by the caption.',
    checkFocus: 'onHide returns focus to the preview button, so Close and the backdrop behave like Escape.',
    checkRing:
      'No ring rule or dt of your own on .p-image-preview-mask or the toolbar buttons — the kit rings both; a second rule would drift.',
    checkCompareName: 'ImageCompare: name through pt.slider, restyle the handle through dt, never set tabindex.',
    checkCompareText: 'The difference between the two images is stated in text next to the comparison.',
    checkStrings:
      'The preview strings come from the kit in the page language; a new locale adds them to its optimus.json.',

    // i18n
    i18nAlt:
      'Every alt, caption, and pass-through name is text in your template, so it follows the kit pattern: a translation key read inside a computed. Easy Language variants need their own alt — shorter sentences, no jargon — not a copy of the standard one.',
    i18nText:
      'Anything written inside the picture stays in one language, cannot be resized with the page text, and must be repeated in the alt. The examples on this page carry no text in their images for that reason.',
    i18nRtl:
      'The preview toolbar is placed with inset-inline-end, so it moves to the left under dir="rtl". ImageCompare reads dir="rtl" from its closest ancestor and watches the document element for changes, and mirrors the clip: the top image is revealed from the right edge.',
  };

  readonly anatomySnippet: string = '<!-- p-image [preview]="true", after Enter on the preview button -->\n' +
    '<div class="p-image-mask p-overlay-mask" role="dialog" aria-modal="true">  <!-- no name -->\n' +
    '  <div class="p-image-toolbar">\n' +
    '    <button aria-label="Rotate Right">…</button>\n' +
    '    <button aria-label="Rotate Left">…</button>\n' +
    '    <button aria-label="Zoom Out">…</button>\n' +
    '    <button aria-label="Zoom In">…</button>\n' +
    '    <button aria-label="Close">…</button>   <!-- receives focus -->\n' +
    '  </div>\n' +
    '  <img class="p-image-original" src="…" style="transform: rotate(0deg) scale(1)" />  <!-- no alt -->\n' +
    '</div>';

  readonly focusCssSnippet: string = '/* Already in the kit (src/styles.scss) — do not repeat it. The preview button\n' +
    '   is one entry of the one ring list; the toolbar buttons sit on the dark plate\n' +
    '   and ring in their own ink, like the notice close buttons. */\n' +
    '.p-image-preview-mask:focus-visible {   /* one of the list */\n' +
    '  outline: 2px solid var(--primary-color-fg) !important;\n' +
    '  outline-offset: 2px !important;\n' +
    '}\n' +
    '.p-image-action:focus-visible {\n' +
    '  outline: 2px solid currentColor !important;\n' +
    '  outline-offset: 2px !important;\n' +
    '}\n' +
    '.p-image-toolbar { --p-image-toolbar-background: rgba(0, 0, 0, 0.6); }';

  readonly compareDtSnippet: string = 'readonly compareDt = {\n' +
    '  handle: {\n' +
    '    size: "24px", background: "#ffffff", hoverBackground: "#ffffff",\n' +
    '    borderWidth: "2px", borderStyle: "solid", borderColor: "#121212", hoverBorderColor: "#121212",\n' +
    '    focusRing: { width: "3px", style: "solid", color: "var(--primary-color-fg)", offset: "2px" },\n' +
    '  },\n' +
    '};';

  readonly previewFixSnippet: string = '<figure>\n' +
    '  <span #zoomHost>\n' +
    '    <p-image [src]="src" [alt]="alt()" [preview]="true"\n' +
    '             [imageStyle]="{ width: \'100%\', height: \'auto\', aspectRatio: \'16 / 9\' }"\n' +
    '             [pt]="{ mask: { \'aria-label\': enlargedName() },\n' +
    '                     original: { alt: alt() },\n' +
    '                     previewMask: { \'aria-describedby\': \'fig-cap\' } }"\n' +
    '             (onHide)="restoreFocus(zoomHost)" />\n' +
    '  </span>\n' +
    '  <figcaption id="fig-cap">{{ caption() }}</figcaption>\n' +
    '</figure>\n' +
    '\n' +
    'restoreFocus(host: HTMLElement): void {\n' +
    '  host.querySelector<HTMLButtonElement>(".p-image-preview-mask")?.focus();\n' +
    '}';

  readonly compareSnippet: string = '<figure>\n' +
    '  <p-imagecompare [pt]="{ slider: { \'aria-label\': sliderName() } }" [dt]="compareDt">\n' +
    '    <ng-template #left><img [src]="before" [alt]="beforeAlt()" /></ng-template>\n' +
    '    <ng-template #right><img [src]="after" [alt]="afterAlt()" /></ng-template>\n' +
    '  </p-imagecompare>\n' +
    '  <figcaption>{{ difference() }}</figcaption>\n' +
    '</figure>';

  readonly i18nSnippet: string = 'private readonly i18n = inject(TranslationService);\n' +
    'readonly alt = computed(() => this.i18n.translate(this.keys.chartAlt));\n' +
    'readonly caption = computed(() => this.i18n.translate(this.keys.chartCaption));';
}
