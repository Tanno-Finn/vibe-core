import { afterNextRender, ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import type { ButtonProps } from '@openng/optimus-ui/button';
import { Carousel } from '@openng/optimus-ui/carousel';
import { GalleriaModule } from '@openng/optimus-ui/galleria';
import { prefersReducedMotion } from '../../../utils/reduced-motion';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

interface Concept {
  term: string;
  text: string;
}

interface Figure {
  kind: 'bars' | 'clusters' | 'loss' | 'grid';
  title: string;
  alt: string;
}

/**
 * Guide article: Carousel and Galleria (Guides, category `library`).
 *
 * Subject: `p-carousel` and `p-galleria` from Optimus UI 2.0.2 — and, first,
 * whether content belongs in either. Claims come from the shipped sources:
 *
 * openng-optimus-ui-carousel.mjs
 *   - host role="region", no name (:871); content aria-live "polite" while
 *     autoplay is allowed, "off" otherwise (:877) — the reverse of the APG rule.
 *   - prev/next: aria-label bound on the p-button HOST (:881, :945); the inner
 *     button reads only ariaLabel / buttonProps.ariaLabel
 *     (openng-optimus-ui-button.mjs:835). The prev button sets no type (:878-897),
 *     the next one does (:941). Boundary state is a p-disabled class only.
 *   - items role="group" + aria-roledescription + aria-label from slideNumber(index)
 *     with a zero-based index (:917-920); hidden items aria-hidden, not inert
 *     (:918); finishing clones carry no aria-hidden (:928-937).
 *   - indicators: native buttons, pageLabel(i + 1), aria-current, roving tabindex
 *     (:963-979); keydown handles ArrowLeft/ArrowRight focus moves only (:656-665);
 *     Home/End/Tab handlers exist unwired (:675-691).
 *   - autoplay: setInterval (:746-759), stopped for good by any navigation
 *     (:626, :637, :646, :169); startAutoplay does not check for a running
 *     interval; public API in the d.ts (:357-359). Inline transition 500ms (:737).
 *   - touch: swipe threshold 20px (:336, :803-812); touchmove preventDefault (:789-793).
 *   - responsiveOptions: viewport media queries in a <style> (:512-545) and a
 *     window.innerWidth match through parseInt (:553-557).
 *
 * openng-optimus-ui-galleria.mjs
 *   - NgModule-based (isStandalone: false, :628) — import GalleriaModule.
 *   - item navigators: <button role="navigation">, no name (:1394, :1415).
 *   - indicators: <li tabindex="0"> with aria-selected (:1429-1438).
 *   - thumbnails: role="tablist" (:1974), items without role="tab"; thumbnail
 *     names from pageLabel (:1989); keys (:1769-1797).
 *   - fullscreen: mask role="dialog" aria-modal, no name (:642-643); focus trap
 *     (:664-665); close button focused after 25ms (:583-587); no Escape handler
 *     in the file; no focus return (:594-597).
 *   - autoplay: aria-live polite while autoPlay (:964); stop on click unless
 *     shouldStopAutoplayByClick is false (:315, :916-923); [autoPlay] is live
 *     (:1293-1300).
 *
 * Translation keys and defaults: openng-optimus-ui-config.mjs (:184, :198,
 * :201-202, :220-221). Tokens: @openng/optimus-ui-themes/dist/aura/carousel and
 * /galleria. Contrast rows quoted from docs/generated/CONTRAST.MD.
 */
@Component({
  selector: 'app-carousel-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, Carousel, GalleriaModule],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'carousel'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A carousel hides all but one item behind a control most readers never touch. Use one when the items are
          optional, equal in weight, and few — and then fix what the library leaves open: names, button types, and any
          rotation.
        </p>

        <h3>One concept per slide — named, typed, never rotating</h3>
        <p-carousel
          [value]="concepts"
          [numVisible]="1"
          [numScroll]="1"
          [prevButtonProps]="prevProps"
          [nextButtonProps]="nextProps"
          aria-label="AI concepts, one per slide"
        >
          <ng-template #item let-concept>
            <div class="slide">
              <h4 class="slide__term">{{ concept.term }}</h4>
              <p class="slide__text">{{ concept.text }}</p>
            </div>
          </ng-template>
        </p-carousel>
        <p class="src-note">
          A live <code>p-carousel</code>. The region is named by the <code>aria-label</code> on the host; the previous and
          next buttons get their names and <code>type="button"</code> through <code>prevButtonProps</code> /
          <code>nextButtonProps</code>, because the component's own label lands on the <code>p-button</code> host, not on
          the button inside it (<code>openng-optimus-ui-carousel.mjs:881</code>, <code>:945</code>;
          <code>openng-optimus-ui-button.mjs:835</code>).
        </p>

        <h3>Rotation, with the controls it owes</h3>
        <div class="rotator">
          <button type="button" class="rot-btn" (click)="toggleRotation()">
            <span class="pi" [class.pi-pause]="rotating()" [class.pi-play]="!rotating()" aria-hidden="true"></span>
            {{ rotating() ? 'Stop slide rotation' : 'Start slide rotation' }}
          </button>
          <div
            class="rotator__frame"
            (focusin)="onFrameFocus()"
            (mouseenter)="hoverPause(true)"
            (mouseleave)="hoverPause(false)"
            (touchend)="syncAfterInteraction()"
          >
            <p-carousel
              #rotator
              [value]="concepts"
              [numVisible]="1"
              [circular]="true"
              [autoplayInterval]="6000"
              [prevButtonProps]="prevProps"
              [nextButtonProps]="nextProps"
              aria-label="AI concepts, rotating"
            >
              <ng-template #item let-concept>
                <div class="slide">
                  <h4 class="slide__term">{{ concept.term }}</h4>
                  <p class="slide__text">{{ concept.text }}</p>
                </div>
              </ng-template>
            </p-carousel>
          </div>
          <p class="rot-note">{{ rotationNote() }}</p>
        </div>
        <p class="src-note">
          The stop/start button is this page's own; the component has none. It drives the public
          <code>startAutoplay()</code>, <code>stopAutoplay()</code> and <code>isPlaying()</code>
          (<code>openng-optimus-ui-carousel.d.ts:357-359</code>). Rotation does not start when
          <code>prefersReducedMotion()</code> from <code>src/app/utils/reduced-motion.ts</code> reports a preference, stops
          for good when focus enters the carousel, and pauses while the pointer rests on it — the behavior the APG
          carousel pattern specifies.
        </p>

        <h3>Galleria: a set of figures with thumbnails</h3>
        <p-galleria
          [value]="figures"
          [(activeIndex)]="figureIndex"
          [numVisible]="4"
          [showItemNavigators]="false"
          [containerStyle]="galleriaStyle"
        >
          <ng-template #item let-fig>
            <figure class="fig">
              <svg class="fig__svg" viewBox="0 0 160 90" role="img" [attr.aria-label]="fig.alt">
                @switch (fig.kind) {
                  @case ('bars') {
                    <rect class="ink" x="20" y="40" width="20" height="40" />
                    <rect class="ink" x="55" y="20" width="20" height="60" />
                    <rect class="ink" x="90" y="50" width="20" height="30" />
                    <rect class="ink" x="125" y="30" width="20" height="50" />
                  }
                  @case ('clusters') {
                    <circle class="ink" cx="40" cy="30" r="5" />
                    <circle class="ink" cx="50" cy="40" r="5" />
                    <circle class="ink" cx="35" cy="45" r="5" />
                    <circle class="ink2" cx="115" cy="55" r="5" />
                    <circle class="ink2" cx="125" cy="65" r="5" />
                    <circle class="ink2" cx="110" cy="70" r="5" />
                  }
                  @case ('loss') {
                    <polyline class="line" points="15,15 45,45 75,60 105,68 145,72" />
                  }
                  @case ('grid') {
                    <rect class="ink" x="40" y="10" width="20" height="20" />
                    <rect class="ink2" x="60" y="10" width="20" height="20" />
                    <rect class="ink2" x="40" y="30" width="20" height="20" />
                    <rect class="ink" x="60" y="30" width="20" height="20" />
                    <rect class="ink" x="80" y="50" width="20" height="20" />
                    <rect class="ink2" x="100" y="50" width="20" height="20" />
                  }
                }
              </svg>
            </figure>
          </ng-template>
          <ng-template #thumbnail let-fig>
            <span class="thumb" aria-hidden="true">{{ fig.title }}</span>
          </ng-template>
          <ng-template #caption let-fig>
            <p class="fig__caption">{{ fig.title }}</p>
          </ng-template>
        </p-galleria>
        <p class="src-note">
          A live <code>p-galleria</code> with thumbnails and no item navigators, whose buttons carry
          <code>role="navigation"</code> and no name (<code>openng-optimus-ui-galleria.mjs:1394</code>, <code>:1415</code>).
          The thumbnails take Arrow Left/Right, Home, End, Enter, and Space (<code>:1769-1797</code>); their accessible
          names are the bare page numbers of <code>pageLabel</code>, so each figure names itself with
          <code>role="img"</code> and an <code>aria-label</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Should this be a carousel at all?</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>The content</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>Three to eight teasers of equal weight</td><td>a grid of cards</td><td>{{ m.whenGrid }}</td></tr>
              <tr><td>Steps that build on each other</td><td>Stepper</td><td>{{ m.whenSteps }}</td></tr>
              <tr><td>The key message of the page</td><td>static content</td><td>{{ m.whenKey }}</td></tr>
              <tr><td>Optional extras, few, short</td><td><code>p-carousel</code>, manual</td><td>{{ m.whenCarousel }}</td></tr>
              <tr><td>A set of related images to compare</td><td><code>p-galleria</code> with thumbnails</td><td>{{ m.whenGalleria }}</td></tr>
              <tr><td>Anything that must rotate on its own</td><td>reconsider</td><td>{{ m.whenRotate }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Evidence: Nielsen, "Auto-Forwarding Carousels and Accordions Annoy Users and Reduce Visibility" (NN/g, 2013) —
          moving content is read as advertising and outruns slow readers; Runyon, "Carousel Interaction Stats" (2013) —
          about 1% of visitors to a university home page clicked a carousel feature, and 84% of those clicks went to the
          first position.
        </p>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the key message on slide 3 of 5</span>
            <div class="dd__stage">
              <div class="mock-slide">
                <strong>Temperature</strong>
                <span>A setting that makes output more varied or more predictable.</span>
                <span class="mock-dots" aria-hidden="true"
                  ><span></span><span></span><span class="on"></span><span></span><span></span
                ></span>
              </div>
            </div>
            <p class="dd__why">{{ m.hiddenWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — the same five, all visible</span>
            <div class="dd__stage">
              <ul class="concept-list">
                @for (c of concepts; track c.term) {
                  <li><strong>{{ c.term }}</strong> — {{ c.text }}</li>
                }
              </ul>
            </div>
            <p class="dd__why">{{ m.visibleWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          The left stage is a static picture of one slide and its indicator dots; the right one is the list the Examples
          carousel is built from. Same content, same space — one item visible against five.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — trust the default navigator names</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ defaultNavSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.defaultNavWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — name and type them through buttonProps</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ namedNavSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.namedNavWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Label binding at <code>openng-optimus-ui-carousel.mjs:881</code> and <code>:945</code>; the inner button's label
          and type at <code>openng-optimus-ui-button.mjs:834-835</code>; defaults of both props at
          <code>openng-optimus-ui-carousel.mjs:285-298</code>.
        </p>

        <h3>Sources</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-carousel.mjs</code> and <code>openng-optimus-ui-galleria.mjs</code> — every role,
            label, key, and timer cited on this page.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/" rel="noopener noreferrer" target="_blank"
              >APG — Carousel pattern</a
            >
            — the rotation control, stop on focus, pause on hover, and <code>aria-live</code> off while rotating.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/carousels/" rel="noopener noreferrer" target="_blank"
              >W3C WAI — Carousels tutorial</a
            >
            — structure, labeling, and animation guidance from the same working group.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 2.2.2 Pause, Stop, Hide</a
            >
            — why motion that starts on its own and lasts over five seconds needs a stop control.
          </li>
          <li>
            <a href="https://www.nngroup.com/articles/auto-forwarding/" rel="noopener noreferrer" target="_blank"
              >Nielsen Norman Group — Auto-Forwarding Carousels and Accordions Annoy Users (2013)</a
            >
            — usability evidence against rotation.
          </li>
          <li>
            <a
              href="https://erikrunyon.com/2013/01/carousel-interaction-stats/"
              rel="noopener noreferrer"
              target="_blank"
              >Erik Runyon — Carousel Interaction Stats (2013)</a
            >
            — measured click-through on production carousels.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Carousel tokens</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura value</th><th>Effect</th></tr>
            </thead>
            <tbody>
              <tr><td><code>carousel.indicator.width</code> / <code>height</code></td><td>2rem / 0.5rem</td><td>{{ m.tokIndicator }}</td></tr>
              <tr><td><code>carousel.indicator.background</code></td><td>surface.200 light · surface.700 dark</td><td>{{ m.tokIndicatorBg }}</td></tr>
              <tr><td><code>carousel.indicator.active.background</code></td><td>primary.color</td><td>{{ m.tokIndicatorActive }}</td></tr>
              <tr><td><code>carousel.indicator.list.gap</code> / <code>padding</code></td><td>0.5rem / 1rem</td><td>{{ m.tokIndicatorList }}</td></tr>
              <tr><td><code>carousel.content.gap</code></td><td>0.25rem</td><td>{{ m.tokContentGap }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/carousel/index.mjs</code>. The navigator buttons are
          <code>p-button</code>s (secondary, text, rounded by default) and paint from the Button tokens.
          <code>src/styles.scss</code> touches the two components once: the carousel indicator button is in the kit's
          one focus-ring list (2px <code>--primary-color-fg</code>, 2px offset), like the navigator buttons as
          <code>p-button</code>s. No visual style has a rule for either.
        </p>

        <h3>Galleria tokens</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura value</th><th>Effect</th></tr>
            </thead>
            <tbody>
              <tr><td><code>galleria.nav.button.size</code></td><td>3rem</td><td>{{ m.tokGNav }}</td></tr>
              <tr><td><code>galleria.thumbnail.nav.button.size</code></td><td>2rem</td><td>{{ m.tokGThumbNav }}</td></tr>
              <tr><td><code>galleria.caption.background</code> / <code>color</code></td><td>rgba(0, 0, 0, 0.5) / surface.100</td><td>{{ m.tokGCaption }}</td></tr>
              <tr><td><code>galleria.indicator.button.width</code> / <code>height</code></td><td>1rem / 1rem</td><td>{{ m.tokGIndicator }}</td></tr>
              <tr><td><code>galleria.close.button.size</code></td><td>3rem</td><td>{{ m.tokGClose }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">Values from <code>&#64;openng/optimus-ui-themes/dist/aura/galleria/index.mjs</code>.</p>

        <h3>Contrast</h3>
        <p>{{ m.contrast }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> has no carousel group, and the gate declares no exceptions. The
          inactive indicator paints <code>surface.200</code> (#e2e8f0) in light and <code>surface.700</code> (#3f3f46) in
          dark mode — Aura's <code>content.border.color</code>, which the file lists as the informational
          <code>progressbar.background</code> rows: 1.23:1 on <code>--surface-card</code> in light and 1.26–1.61:1 in dark,
          no criterion attached, because nothing in the kit relies on it as a boundary. The active indicator is
          <code>primary.color</code>, the checkbox fill ("checkbox &amp; radiobutton", 4.75:1 and up on the card); the
          indicator's focus ring is the "focus ring" row on the page surfaces, 3.88:1 and up. The Galleria caption and
          navigator colors sit on your image and are not in the contrast gate.
        </p>

        <h3>Narrow viewport and touch</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          Media queries written into a <code>&lt;style&gt;</code> in the document head
          (<code>openng-optimus-ui-carousel.mjs:512-545</code>); the JavaScript match at <code>:553-557</code>; swipe at
          <code>:782-812</code>. Neither component stylesheet in <code>&#64;openng/optimus-ui-styles/dist</code> contains a
          media query.
        </p>

        <h3>Motion</h3>
        <p>{{ m.motion }}</p>
        <p class="src-note">
          Inline <code>transition: transform 500ms ease 0s</code> at <code>openng-optimus-ui-carousel.mjs:737</code>; the
          kit rule is the <code>prefers-reduced-motion</code> block at the top of <code>src/styles.scss</code>
          (<code>transition-duration: 0.01ms !important</code>). The timers are <code>setInterval</code> calls
          (<code>openng-optimus-ui-carousel.mjs:747</code>, <code>openng-optimus-ui-galleria.mjs:908</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Carousel API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Default</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>value</code></td><td>—</td><td>{{ m.apiValue }}</td></tr>
              <tr><td><code>numVisible</code> / <code>numScroll</code></td><td>1 / 1</td><td>{{ m.apiNum }}</td></tr>
              <tr><td><code>responsiveOptions</code></td><td>—</td><td>{{ m.apiResponsive }}</td></tr>
              <tr><td><code>orientation</code> / <code>verticalViewPortHeight</code></td><td>horizontal / 300px</td><td>{{ m.apiOrientation }}</td></tr>
              <tr><td><code>circular</code></td><td>false</td><td>{{ m.apiCircular }}</td></tr>
              <tr><td><code>showNavigators</code> / <code>showIndicators</code></td><td>true / true</td><td>{{ m.apiShow }}</td></tr>
              <tr><td><code>autoplayInterval</code></td><td>0</td><td>{{ m.apiAutoplay }}</td></tr>
              <tr><td><code>prevButtonProps</code> / <code>nextButtonProps</code></td><td>secondary, text, rounded</td><td>{{ m.apiButtonProps }}</td></tr>
              <tr><td><code>page</code> · <code>onPage</code></td><td>0</td><td>{{ m.apiPage }}</td></tr>
              <tr><td><code>startAutoplay()</code> · <code>stopAutoplay()</code> · <code>isPlaying()</code></td><td>—</td><td>{{ m.apiMethods }}</td></tr>
              <tr><td>templates <code>#item</code> · <code>#header</code> · <code>#footer</code></td><td>—</td><td>{{ m.apiTemplates }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs and outputs from the compiled component at <code>openng-optimus-ui-carousel.mjs:871</code>; defaults at
          <code>:186-298</code>; methods declared at <code>openng-optimus-ui-carousel.d.ts:357-359</code>.
          <code>Carousel</code> is standalone.
        </p>

        <h3>What the carousel exposes to assistive technology</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Part</th><th>Renders</th><th>Consequence</th></tr>
            </thead>
            <tbody>
              <tr><td>Host</td><td><code>role="region"</code>, no name (<code>:871</code>)</td><td>{{ m.a11yHost }}</td></tr>
              <tr><td>Content</td><td><code>aria-live</code> polite while autoplay is allowed (<code>:877</code>)</td><td>{{ m.a11yLive }}</td></tr>
              <tr><td>Previous / next</td><td>label on the <code>p-button</code> host (<code>:881</code>, <code>:945</code>)</td><td>{{ m.a11yNav }}</td></tr>
              <tr><td>Slide</td><td><code>role="group"</code>, roledescription, label from a zero-based index (<code>:917-920</code>)</td><td>{{ m.a11ySlide }}</td></tr>
              <tr><td>Off-page slides</td><td><code>aria-hidden="true"</code>, not <code>inert</code> (<code>:918</code>)</td><td>{{ m.a11yHidden }}</td></tr>
              <tr><td>Circular clones</td><td>trailing clones without <code>aria-hidden</code> (<code>:928-937</code>)</td><td>{{ m.a11yClones }}</td></tr>
              <tr><td>Indicators</td><td>native buttons, <code>aria-current="page"</code>, roving tabindex (<code>:963-979</code>)</td><td>{{ m.a11yDots }}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>What the galleria exposes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Part</th><th>Renders</th><th>Consequence</th></tr>
            </thead>
            <tbody>
              <tr><td>Item navigators</td><td><code>&lt;button role="navigation"&gt;</code>, no name (<code>:1394</code>, <code>:1415</code>)</td><td>{{ m.gNav }}</td></tr>
              <tr><td>Indicators</td><td><code>&lt;li tabindex="0" aria-selected&gt;</code> (<code>:1429-1438</code>)</td><td>{{ m.gDots }}</td></tr>
              <tr><td>Thumbnails</td><td><code>role="tablist"</code> without tabs; names from <code>pageLabel</code> (<code>:1974</code>, <code>:1989</code>)</td><td>{{ m.gThumbs }}</td></tr>
              <tr><td>Full screen</td><td><code>role="dialog"</code> + <code>aria-modal</code>, focus trap (<code>:642-643</code>, <code>:664-665</code>)</td><td>{{ m.gFull }}</td></tr>
              <tr><td>Autoplay</td><td><code>aria-live</code> polite while <code>autoPlay</code> (<code>:964</code>)</td><td>{{ m.gAuto }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Line numbers in <code>openng-optimus-ui-galleria.mjs</code>. <code>p-galleria</code> is declared in an NgModule
          (<code>isStandalone: false</code>, <code>:628</code>): import <code>GalleriaModule</code>.
        </p>

        <h3>Recipe: rotation with a stop button</h3>
        <pre class="code-block"><code>{{ rotationSnippet }}</code></pre>
        <p class="src-note">
          <code>startAutoplay()</code> assigns a new interval without clearing a running one
          (<code>openng-optimus-ui-carousel.mjs:746-759</code>), so guard it with <code>isPlaying()</code>. Keep
          <code>autoplayInterval</code> above zero even when rotation starts stopped: the method reads it as the delay.
        </p>

        <h3>Recipe: full-screen galleria that closes on Escape</h3>
        <pre class="code-block"><code>{{ fullscreenSnippet }}</code></pre>
        <p class="src-note">
          The full-screen mask renders inside the <code>p-galleria</code> element (<code>:629-672</code>), so a key
          listener on the host sees keys from the trapped content. The component has no Escape handler and returns focus
          nowhere (<code>:594-597</code>); both are yours.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkWhether }}</li>
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkButtons }}</li>
          <li>{{ m.checkRotation }}</li>
          <li>{{ m.checkMotion }}</li>
          <li>{{ m.checkInteractive }}</li>
          <li>{{ m.checkGalleria }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>The strings the library reads</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Key (<code>translation.aria</code>)</th><th>Default</th><th>Read by</th><th>Kit translates?</th></tr>
            </thead>
            <tbody>
              <tr><td><code>prevPageLabel</code> / <code>nextPageLabel</code></td><td>Previous Page / Next Page</td><td>{{ m.i18nNav }}</td><td>yes</td></tr>
              <tr><td><code>slide</code></td><td>Slide</td><td>{{ m.i18nSlide }}</td><td>yes</td></tr>
              <tr><td><code>slideNumber</code></td><td>the bare number</td><td>{{ m.i18nSlideNumber }}</td><td>no, on purpose</td></tr>
              <tr><td><code>pageLabel</code></td><td>the bare number</td><td>{{ m.i18nPage }}</td><td>yes — "Page {{ '{' }}page{{ '}' }}"</td></tr>
              <tr><td><code>close</code></td><td>Close</td><td>{{ m.i18nClose }}</td><td>yes</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Defaults in <code>openng-optimus-ui-config.mjs</code> (<code>:184</code>, <code>:198</code>,
          <code>:201-202</code>, <code>:220-221</code>). The kit's <code>OptimusA11yService.syncAriaStrings()</code> in
          <code>src/app/services/optimus-a11y.service.ts</code> hands Optimus a fixed list of <code>aria</code> keys
          (<code>OPTIMUS_ARIA_KEYS</code>) in the page language: <code>slide</code>, <code>pageLabel</code>,
          <code>prevPageLabel</code>, <code>nextPageLabel</code> and <code>close</code> are on it.
          <code>slideNumber</code> stays the library's bare number on purpose — the carousel passes a zero-based index,
          so a phrase around it would announce "Slide 0".
        </p>

        <h3>Per-instance labels</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p>{{ m.i18nRoledescription }}</p>

        <h3>Writing direction</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.1</strong> — 2026-09-23 — Synced with the contrast and focus rounds: indicator figures re-cited
            from the informational <code>progressbar.background</code> rows (no declared exceptions any more), the
            indicator's kit ring and the active fill cited; <code>slide</code>, <code>pageLabel</code> and the
            navigator labels are now handed over in the page language.
          </li>
          <li><strong>v1.0</strong> — 2026-09-23 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-carousel-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-carousel-article .slide {
        padding: 1rem 1.25rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        min-height: 7rem;
      }

      app-carousel-article .slide__term {
        margin: 0 0 0.35rem;
        font-size: 1rem;
      }

      app-carousel-article .slide__text {
        margin: 0;
      }

      app-carousel-article .rotator {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-block: 0.75rem;
      }

      app-carousel-article .rot-btn {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        min-height: 2.5rem;
        padding: 0.4rem 0.9rem;
        border: 1px solid var(--control-border);
        background: var(--surface-card);
        color: var(--text-color);
        font: inherit;
        cursor: pointer;
      }

      app-carousel-article .rot-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-carousel-article .rot-note {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-carousel-article .fig {
        margin: 0;
        padding: 1rem;
        background: var(--surface-card);
      }

      app-carousel-article .fig__svg {
        display: block;
        width: 100%;
        height: auto;
        max-height: 14rem;
      }

      app-carousel-article .fig__svg .ink {
        fill: var(--primary-color);
      }

      app-carousel-article .fig__svg .ink2 {
        fill: var(--text-color-secondary);
      }

      app-carousel-article .fig__svg .line {
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 3;
      }

      app-carousel-article .fig__caption {
        margin: 0;
      }

      app-carousel-article .thumb {
        display: block;
        padding: 0.35rem;
        font-size: 0.75rem;
        text-align: center;
      }

      app-carousel-article .mock-slide {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-size: 0.9rem;
      }

      app-carousel-article .mock-dots {
        display: flex;
        gap: 0.35rem;
        margin-top: 0.35rem;
      }

      app-carousel-article .mock-dots span {
        width: 1.25rem;
        height: 0.35rem;
        background: var(--surface-border);
      }

      app-carousel-article .mock-dots span.on {
        background: var(--primary-color);
      }

      app-carousel-article .concept-list {
        margin: 0;
        padding-inline-start: 1.1rem;
        font-size: 0.85rem;
      }

      app-carousel-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-carousel-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 0;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-carousel-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-carousel-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-carousel-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
        overflow-x: auto;
      }

      app-carousel-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-carousel-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-carousel-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-carousel-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-carousel-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 40rem) {
        app-carousel-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class CarouselArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- live content (synthetic) ---
  readonly concepts: Concept[] = [
    { term: 'Token', text: 'Models read text in pieces called tokens — often parts of words.' },
    { term: 'Context window', text: 'The amount of text a model can take into account at once.' },
    { term: 'Temperature', text: 'A setting that makes output more varied or more predictable.' },
    { term: 'Embedding', text: 'A list of numbers that places a text in a space of meanings.' },
    { term: 'Hallucination', text: 'Fluent output that no source supports.' },
  ];

  /** Named and typed navigators; the object replaces the default props, so the look is restated. */
  readonly prevProps: ButtonProps = {
    severity: 'secondary',
    text: true,
    rounded: true,
    type: 'button',
    ariaLabel: 'Previous slide',
  };
  readonly nextProps: ButtonProps = {
    severity: 'secondary',
    text: true,
    rounded: true,
    type: 'button',
    ariaLabel: 'Next slide',
  };

  readonly figures: Figure[] = [
    { kind: 'bars', title: 'Tokens per sentence', alt: 'Bar chart: four sentences with 4, 6, 3 and 5 tokens.' },
    { kind: 'clusters', title: 'Two clusters', alt: 'Scatter plot: two separate groups of three points each.' },
    { kind: 'loss', title: 'Training loss', alt: 'Line chart: loss falls steeply, then levels off.' },
    { kind: 'grid', title: 'Attention weights', alt: 'Grid: strong weights on the diagonal, weaker ones beside it.' },
  ];
  figureIndex = 0;
  readonly galleriaStyle = { 'max-width': '40rem' };

  // --- the rotating carousel ---
  private readonly rotator = viewChild<Carousel>('rotator');
  readonly rotating = signal(true);
  readonly reducedMotion = signal(false);

  readonly rotationNote = computed(() => {
    if (this.rotating()) return 'Rotating every 6 seconds. Focus inside stops it; the pointer on it pauses it.';
    if (this.reducedMotion()) return 'Not rotating: your system asks for reduced motion. The button starts it anyway.';
    return 'Rotation stopped.';
  });

  constructor() {
    // Rotation starts inside the carousel on first render; stop it before its first tick.
    afterNextRender(() => {
      if (prefersReducedMotion()) {
        this.reducedMotion.set(true);
        this.stopRotation();
      }
    });
  }

  toggleRotation(): void {
    if (this.rotating()) {
      this.stopRotation();
      return;
    }
    const c = this.rotator();
    if (c && !c.isPlaying()) c.startAutoplay();
    this.rotating.set(true);
  }

  /** APG: rotation stops when focus enters the carousel and does not restart by itself. */
  onFrameFocus(): void {
    if (this.rotating()) this.stopRotation();
  }

  hoverPause(on: boolean): void {
    const c = this.rotator();
    if (!c || !this.rotating()) return;
    if (on) c.stopAutoplay(false);
    else if (!c.isPlaying()) c.startAutoplay();
  }

  /** A swipe takes no focus but stops the library's timer for good (navForward/navBackward); mirror it. */
  syncAfterInteraction(): void {
    if (this.rotating()) this.stopRotation();
  }

  private stopRotation(): void {
    this.rotator()?.stopAutoplay();
    this.rotating.set(false);
  }

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    // usage
    whenGrid:
      'Everything is visible at once and scannable; a carousel shows one item and makes the reader work for the rest.',
    whenSteps:
      'A sequence has an order and a position; a stepper names both, where a carousel only offers previous and next.',
    whenKey:
      'Whatever must be read cannot sit behind a control that most visitors never operate — put it on the page.',
    whenCarousel:
      'Acceptable when every item is optional, the set is small, and the page reads fine if only the first item is ever seen.',
    whenGalleria:
      'A viewer with thumbnails suits images meant to be compared; the thumbnails double as an overview and a keyboard path.',
    whenRotate:
      'Rotation owes a stop control (SC 2.2.2), a stop on focus, a pause on hover, and silence for screen readers. Most content gains nothing from it.',
    hiddenWhy:
      'Four of five items are one click away that few readers make, and a rotating version moves on before a slow reader finishes.',
    visibleWhy:
      'Five short items fit as a list in the same space; every reader sees all of them, in any order, at their own pace.',
    defaultNavWhy:
      'The component binds its label to the p-button host, where it names nothing; the inner button is icon-only and unnamed, and the previous button has no type, so inside a form it is a submit button.',
    namedNavWhy:
      'buttonProps reach the inner button: ariaLabel names it and type="button" keeps it out of form submission. Restate severity, text, and rounded — the object replaces the default.',

    // design
    tokIndicator:
      'Each indicator is 32 by 8 CSS pixels. It passes SC 2.5.8 (24 by 24) only through the spacing exception, not by its size.',
    tokIndicatorBg: 'The fill of every inactive indicator.',
    tokIndicatorActive: 'The current page. Color is the only difference between active and inactive, besides aria-current.',
    tokIndicatorList: 'Space between and around the indicators.',
    tokContentGap: 'Space between the navigators and the viewport.',
    tokGNav: 'Item navigators: large, round, translucent white over the image.',
    tokGThumbNav: 'The arrows beside the thumbnail strip.',
    tokGCaption: 'A half-transparent black band over the image; the text contrast depends on the image below.',
    tokGIndicator: 'Round indicator dots, 16 by 16 CSS pixels.',
    tokGClose: 'The close button of the full-screen view.',
    contrast:
      'Do not let the indicators carry the only way to know where you are or to move. The active one is the accent and clears 3:1 on the card, but the inactive fill sits barely off the card (about 1.2:1), so the row of indicators is hard to see as a set of controls. Keep the named previous and next buttons visible, and show position in text ("2 of 5") where it matters.',
    narrow:
      'The carousel resizes with its container; responsiveOptions changes numVisible at viewport breakpoints, not container widths. Write breakpoints in px: the CSS side uses the string in a media query, while the JavaScript side reads parseInt(breakpoint) against window.innerWidth, so "48rem" matches at 48 pixels. On touch, a horizontal swipe over 20 pixels pages, and every cancelable touchmove on the viewport is prevented — a vertical page scroll that starts on the carousel does not scroll the page. The Galleria has no breakpoint of its own beyond responsiveOptions for the thumbnail count; the examples on this page cap it at 40rem.',
    motion:
      'The slide transition is an inline 500ms transform transition; the kit global reduced-motion rule overrides it with an important declaration, so slides jump instead of sliding. The autoplay timers are JavaScript and are not reached by CSS: ask prefersReducedMotion() from src/app/utils/reduced-motion.ts before rotation starts, and stop it when the answer is yes.',

    // development
    apiValue: 'The items; each is handed to the #item template as the implicit context — no index.',
    apiNum: 'Items per page and items per step.',
    apiResponsive: 'Array of breakpoint, numVisible, numScroll. See Design for the px-only breakpoint rule.',
    apiOrientation: 'Vertical needs the fixed viewport height.',
    apiCircular: 'Wraps around by cloning items at both ends (see the clones row below).',
    apiShow: 'Hide neither: the navigators are the only named way to page, the indicators the only overview.',
    apiAutoplay:
      'Milliseconds; above zero, rotation starts on first render. Changing the input later neither starts nor stops it.',
    apiButtonProps:
      'Passed to the inner button. The only way to name it and set its type; a replacement object drops the defaults.',
    apiPage: 'Two-way by input and output; onPage fires for every page change, automatic ones included.',
    apiMethods:
      'Public. stopAutoplay(false) pauses without turning the live region off; stopAutoplay() stops. Guard startAutoplay() with isPlaying().',
    apiTemplates: 'Also #previousicon and #nexticon for custom navigator icons.',
    a11yHost: 'An unnamed region is not exposed as a landmark. Set aria-label on p-carousel.',
    a11yLive:
      'The APG rule is the reverse — off while rotating, polite when not — so a screen reader hears automatic changes and misses manual ones.',
    a11yNav:
      'aria-label on a custom element with no role names nothing; the icon-only inner button is unnamed. Use buttonProps.ariaLabel. The previous button also lacks type="button", and at the ends both stay enabled and focusable — only a p-disabled class marks them.',
    a11ySlide:
      'With the default slideNumber the first slide is announced as 0. Galleria counts from 1 for the same key.',
    a11yHidden:
      'Links and buttons on off-page slides stay in the tab order while hidden from screen readers. Keep slide content non-interactive, or make hidden slides inert yourself.',
    a11yClones:
      'With circular, the trailing copies are exposed to assistive technology as duplicate content.',
    a11yDots:
      'Named from pageLabel — "Page 2" in the kit, the bare number by library default. Arrow Left and Right move focus only; Enter or Space activates. Home and End do nothing.',
    gNav: 'Announced as unnamed navigation landmarks, not as buttons. Leave showItemNavigators off; use thumbnails.',
    gDots: 'One tab stop per dot, no role, aria-selected on a list item; Enter and Space activate. Prefer thumbnails.',
    gThumbs:
      'A tablist whose children are not tabs; each thumbnail is named from pageLabel ("Page 3" in the kit), which says nothing about the picture, so name the image inside the item.',
    gFull:
      'The dialog has no name and no Escape handler, and focus is not returned on close. Add all three (recipe below).',
    gAuto:
      'Same inversion as the carousel. Bind [autoPlay] to your own signal: the input is live, so a stop button can drive it.',

    checkWhether: 'Decide first whether the content belongs in a carousel at all (Usage).',
    checkName: 'Name the carousel region with aria-label on the host.',
    checkButtons:
      'Pass prevButtonProps and nextButtonProps with ariaLabel and type="button", restating severity, text, and rounded.',
    checkRotation:
      'If it rotates: a visible stop/start button before it, stop on focus, pause on hover, never started under reduced motion.',
    checkMotion: 'Keep autoplayInterval above zero if a button can start rotation later.',
    checkInteractive: 'Keep slide content free of links and buttons, or make off-page slides inert yourself.',
    checkGalleria:
      'For p-galleria: thumbnails on, item navigators off, a name on each image; full screen only with your own Escape and focus return.',

    // i18n
    i18nNav: 'Carousel navigators (on the host, see Development) and Galleria thumbnail arrows',
    i18nSlide: 'aria-roledescription of every slide, both components',
    i18nSlideNumber: 'Slide name; carousel passes a zero-based index, galleria one-based',
    i18nPage: 'Indicator and thumbnail names',
    i18nClose: 'Galleria full-screen close button',
    i18nRoledescription:
      'aria-roledescription ("Slide") has no per-instance input; the kit hands it over in the page language ("Folie" on a German page), because a roledescription that does not match the page language is worse than none — a screen reader speaks it in place of the role. Keep it that way when you add a language.',
    i18nRtl:
      'The carousel moves its track with translate3d on the x axis and never reads the writing direction, so under dir="rtl" the chevrons and the slide direction stay physically left-to-right. Test a right-to-left page before adopting it there.',
  };

  readonly defaultNavSnippet =
    '<p-carousel [value]="items">\n' + '  <!-- prev/next: unnamed, prev has no type -->\n' + '</p-carousel>';

  readonly namedNavSnippet =
    '<p-carousel [value]="items"\n' +
    '  aria-label="AI concepts"\n' +
    '  [prevButtonProps]="prevProps"\n' +
    '  [nextButtonProps]="nextProps" />\n' +
    '\n' +
    'prevProps: ButtonProps = {\n' +
    '  severity: "secondary", text: true, rounded: true,\n' +
    '  type: "button", ariaLabel: labels().previous,\n' +
    '};';

  readonly rotationSnippet =
    '<button type="button" (click)="toggle()">\n' +
    '  {{ rotating() ? "Stop slide rotation" : "Start slide rotation" }}\n' +
    '</button>\n' +
    '<div (focusin)="stop()" (mouseenter)="pause()" (mouseleave)="resume()">\n' +
    '  <p-carousel #rotator [value]="items" [circular]="true"\n' +
    '              [autoplayInterval]="6000" aria-label="..." />\n' +
    '</div>\n' +
    '\n' +
    'rotator = viewChild<Carousel>("rotator");\n' +
    'rotating = signal(true);\n' +
    'constructor() {\n' +
    '  afterNextRender(() => { if (prefersReducedMotion()) this.stop(); });\n' +
    '}\n' +
    'stop()   { this.rotator()?.stopAutoplay(); this.rotating.set(false); }\n' +
    'pause()  { if (this.rotating()) this.rotator()?.stopAutoplay(false); }\n' +
    'resume() { const c = this.rotator();\n' +
    '           if (this.rotating() && c && !c.isPlaying()) c.startAutoplay(); }';

  readonly fullscreenSnippet =
    '<button #opener type="button" (click)="open.set(true)">View figures full screen</button>\n' +
    '<p-galleria [value]="figures" [fullScreen]="true"\n' +
    '            [visible]="open()" (visibleChange)="close()"\n' +
    '            (keydown.escape)="close()" />\n' +
    '\n' +
    'close() {\n' +
    '  this.open.set(false);\n' +
    '  this.opener().nativeElement.focus(); // the component returns focus nowhere\n' +
    '}';

  readonly i18nSnippet =
    '// The navigator names are per instance, through buttonProps:\n' +
    'readonly prevProps = computed<ButtonProps>(() => ({\n' +
    '  severity: "secondary", text: true, rounded: true, type: "button",\n' +
    '  ariaLabel: this.i18n.translate("carousel.previous"),\n' +
    '}));\n' +
    '\n' +
    '// The region name too:  [attr.aria-label]="labels().region"';
}
