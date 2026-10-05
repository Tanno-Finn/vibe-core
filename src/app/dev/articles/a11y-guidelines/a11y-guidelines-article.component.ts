import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
    :host { display: block; }
    .lead { font-size: 1.05rem; color: var(--text-color-secondary); margin: 0 0 var(--space-5); }

    /* --- Stages --- */
    .stage {
      display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3);
      padding: var(--space-4);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      margin: 0 0 var(--space-3);
    }
    .stage--column { flex-direction: column; align-items: flex-start; }

    .ring-demo {
      display: inline-flex; align-items: center; justify-content: center;
      min-height: 2.75rem;
      padding: var(--space-2) var(--space-4);
      background: var(--surface-card);
      color: var(--text-color);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      font: inherit;
      text-decoration: none;
      cursor: pointer;
    }
    .ring-demo:focus-visible {
      outline: 2px solid var(--primary-color-fg);
      outline-offset: 2px;
    }

    /* The Don't cell, rendered rather than quoted: the outline is removed and the
       replacement is invalid at computed-value time, so nothing is drawn at all. */
    .ring-demo--broken:focus,
    .ring-demo--broken:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(var(--primary-color), 0.1);
    }

    .ring-demo--icon { min-width: 2.75rem; padding: var(--space-2); }

    .mirror {
      margin: 0; font-size: var(--font-size-sm); color: var(--text-color-secondary);
      display: flex; align-items: baseline; gap: var(--space-2);
    }
    .mirror__tag {
      font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.04em;
      padding: 0.1em 0.5em; border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color-fg) 14%, transparent);
      color: var(--primary-color-fg);
    }

    /* --- Preference probe: the block IS the live output --- */
    .probe {
      display: flex; flex-direction: column; gap: var(--space-2);
      padding: var(--space-4);
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      margin: 0 0 var(--space-3);
    }
    .probe__row { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-3); }
    .probe__row code { font-family: var(--font-mono); font-size: 0.82rem; }
    .probe__val { font-weight: var(--font-weight-bold); color: var(--primary-color-fg); }
    .pm-yes, .pc-yes, .fc-yes { display: none; }
    @media (prefers-reduced-motion: reduce) {
      .pm-no { display: none; }
      .pm-yes { display: inline; }
    }
    @media (prefers-contrast: high) {
      .pc-no { display: none; }
      .pc-yes { display: inline; }
    }
    @media (forced-colors: active) {
      .fc-no { display: none; }
      .fc-yes { display: inline; }
    }

    /* --- Skip-link stage --- */
    .skip { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin: 0 0 var(--space-3); }
    .skip__frame {
      position: relative; overflow: hidden;
      min-height: 5.5rem;
      display: flex; flex-direction: column; justify-content: flex-end; align-items: center;
      gap: var(--space-2);
      padding: var(--space-3);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
    }
    .skip__pill {
      position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      padding: 12px 24px;
      background: var(--primary-color);
      color: #ffffff;
      border-radius: 0 0 8px 8px;
      font-weight: var(--font-weight-bold);
    }
    .skip__pill--hidden { top: -100%; }
    .skip__label { font-size: var(--font-size-sm); color: var(--text-color-secondary); }
    @media (max-width: 640px) { .skip { grid-template-columns: 1fr; } }

    /* --- Do / Don't --- */
    .dd { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin: 0 0 var(--space-4); }
    .dd__cell { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: var(--surface-card); }
    .dd__cell--bad { border-left: 3px solid var(--semantic-red-fg, #b91c1c); }
    .dd__cell--good { border-left: 3px solid var(--semantic-green-fg, #15803d); }
    .dd__stage { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-4); border-radius: var(--radius-md); background: var(--surface-section); min-height: 3.5rem; }
    .dd__why { margin: 0; font-size: var(--font-size-sm); color: var(--text-color-secondary); }
    .dd__code { font-family: var(--font-mono); font-size: 0.78rem; word-break: break-word; }
    .dd__badge { display: inline-flex; align-items: center; gap: 0.35em; padding: 0.2em 0.7em; border-radius: 999px; font-size: var(--font-size-sm); font-weight: var(--font-weight-bold); }
    .dd__badge--red { background: color-mix(in srgb, var(--semantic-red-fg, #b91c1c) 14%, transparent); color: var(--semantic-red-fg, #b91c1c); }
    .tag { align-self: flex-start; font-size: 0.72rem; font-weight: var(--font-weight-medium); letter-spacing: 0.02em; text-transform: uppercase; padding: 0.15em 0.55em; border-radius: 999px; }
    .tag--bad { background: color-mix(in srgb, var(--semantic-red-fg, #b91c1c) 14%, transparent); color: var(--semantic-red-fg, #b91c1c); }
    .tag--good { background: color-mix(in srgb, var(--semantic-green-fg, #15803d) 16%, transparent); color: var(--semantic-green-fg, #15803d); }
    @media (max-width: 640px) { .dd { grid-template-columns: 1fr; } }

    .checklist { list-style: none; padding-left: 0; }
    .checklist li { margin: 0.3rem 0; }

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
    .table-wrap { overflow-x: auto; margin: 0 0 1rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { border: 1px solid var(--surface-border); padding: 0.4rem 0.6rem; text-align: left; vertical-align: top; }
    th { color: var(--text-color-secondary); font-weight: var(--font-weight-medium); }
    .history strong { color: var(--primary-color-fg); }
  `;

/**
 * Guide article: Accessibility Guidelines (foundations).
 *
 * Measured for this guide, over the tracked files under src/ and against the
 * compiled global sheet in dist/vibecore/browser/:
 *   - :focus-visible — 166 rule blocks in 83 files, ZERO of them element-level
 *     or universal. 138 of the 143 blocks that declare an outline use 2px,
 *     120 use a 2px offset; 91 paint it in --primary-color, 39 in
 *     --primary-color-fg (counted before the one-ring rule, which changed
 *     the global sheet as below). Four blocks declare
 *     outline:none and all four replace the ring (two suppress the mouse-focus
 *     ring via :focus:not(:focus-visible), one swaps to a box-shadow ring, one
 *     moves the ring onto a child).
 *   - Review correction: :focus-visible is the CONVENTION, not a universal fact.
 *     16 bare :focus rules survive in 13 files, 4 of them in the global sheet —
 *     .glossary-highlight:focus carries exactly the kit ring shape.
 *   - The global sheet's rings: ONE kit ring rule in
 *     styles.scss — 2px solid --primary-color-fg at 2px offset, !important — lists
 *     every keyboard-focusable Optimus UI part the kit ships (fields, checkbox /
 *     radio / switch boxes, buttons, toggle and select-button segments, stepper
 *     heads, tabs, accordion headers, menu items, table rows and sort headers,
 *     paginator, slider handle, rating, tree, datepicker, breadcrumb, ...) and
 *     the cookie buttons; an inset rule moves the offset to -2px for parts in
 *     clipping containers; message / toast close buttons and the image preview
 *     actions ring in currentColor. Beside it: .p-select.p-focus (same ring on
 *     the host) and .glossary-highlight:focus (--primary-color-fg, bare :focus).
 *     scripts/check-contrast.mjs asserts the lists (KIT_RING_SELECTORS,
 *     KIT_RING_INSET) and measures the ring in CONTRAST.MD "focus ring".
 *   - The contrast compilat measures --primary-color-fg on the two grounds for
 *     all ten palettes in all four visual styles (lowest 4.75:1 in light and in
 *     dark) and never measures --primary-color as a foreground; --primary-color
 *     appears only as a background, under "filled button". Since the widget
 *     rows landed it also gates Optimus UI widget pairs resolved from the Aura
 *     preset as the kit configures it.
 *   - prefers-reduced-motion — the universal catch-all sits at the top of
 *     styles.scss, plus per-component blocks. Its JavaScript half is
 *     src/app/utils/reduced-motion.ts (scrollBehavior(), prefersReducedMotion()).
 *   - The main landmark is a native <main id="main-content" tabindex="-1"> in
 *     app.component.ts. The cookie settings dialog (cookie-consent.component.ts)
 *     is role="dialog" aria-modal="true" with cdkTrapFocus + auto-capture and
 *     returns focus to its trigger, or to #main-content when it is gone.
 *   - prefers-contrast: high — 6 real blocks, 2 of them global, both scoped to
 *     the glossary feature. forced-colors: active — 8 blocks, all
 *     component-scoped, none global. prefers-reduced-transparency — 0.
 *   - The Sass mixin focus-ring() in design-tokens.scss expanded to
 *     outline:none plus rgba(var(--primary-color), 0.1), which is invalid at
 *     computed-value time. Its two call sites sat inside button-base() and
 *     input-base(), which were never included, so nothing reached the sheet;
 *     all three were deleted on 2026-09-24.
 *     The one rgba(var(...)) the compiled sheet used to hold, the
 *     --input-focus-ring token, was removed (no consumer); a field's
 *     focus indicator is the one kit ring in styles.scss.
 *   - 0 styleUrls in the kit and exactly two .scss files, both global, so a
 *     component style is inline plain CSS and can include no mixin at all.
 *   - .touch-target-44 and .touch-target-expanded are declared in styles.scss
 *     and named nowhere else in src/. The visually-hidden() mixin, a second,
 *     unused name for what .sr-only does, was deleted 2026-09-24; two
 *     components declare their own local .visually-hidden class.
 *   - Review correction: "no kit mechanism for SC 2.5.8" was wrong — only the
 *     two UTILITIES are unused. styles.scss raises the Aura slider handle to
 *     24x24 via --p-slider-handle-width/-height on .p-slider, citing SC 2.5.8
 *     in its own comment, and .cookie-close-btn is 44x44. The 24px floor is
 *     SC 2.5.8 (AA); 44px is the SC 2.5.5 (AAA) figure.
 *   - lang has ONE writer: meta-seo.service.ts, which strips the -easy suffix.
 *     app.component.ts wrote the raw portal language from a second subscription
 *     to the same event and, subscribing later, won — every Easy variant read
 *     lang="<x>-easy" after hydration although the prerendered HTML was right.
 *     That writer was removed on 2026-08-18. No dir writer and no rtl rule
 *     exists in the kit outside guide demos.
 *   - The DOM-level pass is scripts/check-a11y.mjs (axe-core + Puppeteer), run
 *     by CI after the production build since 2026-09-22; @axe-core/cli, pa11y
 *     and lighthouse, installed but never invoked, were removed the same day.
 *   - Contrast figures quoted from docs/generated/CONTRAST.MD only.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-a11y-guidelines-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'a11y-guidelines'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          The kit's accessibility layer is small and specific: one motion switch, one focus
          shape, one hidden-text class, and one app shell. Everything below is the real thing
          rather than a picture of it — the ring appears when you tab into it, the probe reads
          your own operating-system settings, and the announcer is a live region you can point
          a screen reader at.
        </p>

        <h3>The focus ring, rendered</h3>
        <p>
          Tab into these three. All three take the same ring, because the shape is a kit
          convention rather than a global rule: a 2px outline at a 2px offset, drawn only for
          keyboard focus. Click them with a mouse instead and no ring appears — these rules are
          written on <code>:focus-visible</code>, which is the kit standard. It is a convention,
          not a guarantee: older rules in the tree still hang the same shape on bare
          <code>:focus</code>, where a mouse click draws it too.
        </p>
        <div class="stage">
          <button type="button" class="ring-demo">Native button</button>
          <a class="ring-demo" href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
             target="_blank" rel="noopener noreferrer">Native link (SC 2.4.7)</a>
          <span class="ring-demo" role="button" tabindex="0">Element with a role</span>
        </div>
        <p class="src-note">
          Ring shape from the one kit ring rule in <code>src/styles.scss</code> (beside the
          form-field rules), whose selector list covers every keyboard-focusable Optimus UI part
          and the cookie buttons; the global sheet's <code>:focus-visible</code> rules are all
          class-scoped, and none is element-level or universal.
        </p>

        <h3>What your machine is asking for</h3>
        <p>
          Every preference query the kit answers anywhere is readable right here, because each one
          is a media query and nothing else. The fourth query in the Design table,
          <code>prefers-reduced-transparency</code>, is answered nowhere and so has nothing to
          probe. Change the setting in your operating system and this box changes with it — no
          reload, no signal, no service.
        </p>
        <div class="probe">
          <div class="probe__row">
            <code>prefers-reduced-motion</code>
            <span class="probe__val"><span class="pm-no">no-preference</span><span class="pm-yes">reduce</span></span>
          </div>
          <div class="probe__row">
            <code>prefers-contrast</code>
            <span class="probe__val"><span class="pc-no">no-preference</span><span class="pc-yes">high</span></span>
          </div>
          <div class="probe__row">
            <code>forced-colors</code>
            <span class="probe__val"><span class="fc-no">none</span><span class="fc-yes">active</span></span>
          </div>
        </div>
        <p class="src-note">
          Rendered from three media queries in this article's own stylesheet. Which of them the
          kit itself acts on, and where, is the first table in Design.
        </p>

        <h3>A live region you can hear</h3>
        <p>
          The counter below writes into a visually hidden <code>.sr-only</code> element marked
          <code>aria-live="polite"</code>. Sighted readers get the number in the button; a
          screen reader gets the sentence. The mirror underneath shows the hidden text so you
          can see what is being announced without turning anything on.
        </p>
        <div class="stage stage--column">
          <button type="button" class="ring-demo" (click)="bump()">
            Add a point — total {{ score() }}
          </button>
          <span class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement() }}</span>
          <p class="mirror"><span class="mirror__tag">announced</span> {{ announcement() }}</p>
        </div>
        <p class="src-note">
          <code>.sr-only</code> is declared once, globally, in <code>src/styles.scss</code>;
          the live-region attributes are written at this call site, because the kit ships no
          announcer component.
        </p>

        <h3>The skip link, both states</h3>
        <p>
          The real one is the first focusable node of the page — press Tab from the address bar
          on any route and it drops down. It is not built from <code>.sr-only</code>: it is
          positioned off the top edge and slides back, so it keeps its size and can be seen
          arriving. The two states are staged here side by side.
        </p>
        <div class="skip">
          <div class="skip__frame"><span class="skip__pill skip__pill--hidden">Skip to content</span><span class="skip__label">at rest — above the viewport edge</span></div>
          <div class="skip__frame"><span class="skip__pill">Skip to content</span><span class="skip__label">focused — flush with the top</span></div>
        </div>
        <p class="src-note">
          Staged from the <code>.skip-link</code> rules in
          <code>src/app/app.component.ts</code>; the live link's target and focus behavior are
          in Development.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          A control is accessible here because its author wired four things, not because the kit
          did. The kit owns motion and the hidden-text class outright; it hands you a shape for
          the ring and nothing at all for the name or the announcement.
        </p>

        <h3>The four jobs, and who does them</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Job</th><th>What the kit gives you</th><th>What you still write</th></tr></thead>
            <tbody>
              <tr>
                <td>Accessible name</td>
                <td>Nothing global. The translation service and the bound-attribute habit.</td>
                <td><code>[attr.aria-label]</code> or a real label, from a translation key.</td>
              </tr>
              <tr>
                <td>Visible focus</td>
                <td>A convention — 2px outline, 2px offset, brand color — and one class-scoped rule.</td>
                <td>The <code>:focus-visible</code> rule itself, on your own selector.</td>
              </tr>
              <tr>
                <td>State announcement</td>
                <td><code>.sr-only</code>, global, and nothing else.</td>
                <td>The live region, its politeness, and the text that lands in it.</td>
              </tr>
              <tr>
                <td>Motion</td>
                <td>A universal <code>prefers-reduced-motion</code> catch-all over all CSS transitions and animations.</td>
                <td>The JavaScript half — anything the catch-all cannot reach — through the reduced-motion helper.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit column read off <code>src/styles.scss</code> and the app shell
          (<code>src/app/app.component.ts</code> and its children in
          <code>src/app/components/frame/</code>); the motion row's reach is the subject of the
          second table in Design.
        </p>

        <h3>Do / Don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — remove the outline and promise a replacement</span>
            <div class="dd__stage">
              <button type="button" class="ring-demo ring-demo--broken">Tab into me — nothing</button>
            </div>
            <p class="dd__why">
              This button really carries <code>outline: none</code> plus
              <code>box-shadow: 0 0 0 3px rgba(var(--primary-color), .1)</code>. A
              <code>var()</code> holding a color cannot be a channel list, so the shadow is
              invalid at computed-value time and drops. The outline is already gone, and the
              control has no keyboard indicator left at all.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — draw the ring the kit's shape</span>
            <div class="dd__stage">
              <button type="button" class="ring-demo">Tab into me — 2px ring</button>
            </div>
            <p class="dd__why">
              Two properties on <code>:focus-visible</code>, both valid, both themed. Removing an
              outline is only safe when the replacement renders — and the safest replacement is
              the outline.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — name a control in English</span>
            <div class="dd__stage stage--column">
              <button type="button" class="ring-demo ring-demo--icon" aria-label="Close"
                      (click)="cycleLang()">
                <i class="pi pi-times" aria-hidden="true"></i>
              </button>
              <p class="mirror"><span class="mirror__tag">announced</span> Close</p>
            </div>
            <p class="dd__why">
              Press the button: the page language cycles, the visible surroundings would follow it
              — and the name stays <em>Close</em>, because it is a literal. The name is the only
              thing a screen-reader user gets from an icon-only control.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — bind the name to a key</span>
            <div class="dd__stage stage--column">
              <button type="button" class="ring-demo ring-demo--icon" [attr.aria-label]="boundName()"
                      (click)="cycleLang()">
                <i class="pi pi-times" aria-hidden="true"></i>
              </button>
              <p class="mirror"><span class="mirror__tag">announced</span> {{ boundName() }}</p>
            </div>
            <p class="dd__why">
              Same button, name bound to a key: it follows the page language
              (<strong>{{ demoLangLabel() }}</strong>), and the visible label — where there is one
              — stays inside the accessible name, which is what voice control matches on.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — let the result exist only on screen</span>
            <div class="dd__stage"><span class="dd__badge dd__badge--red">3 errors</span></div>
            <p class="dd__why">
              Color carries the severity and nothing announces the change, so a screen-reader
              user who triggered the check hears silence and a color-blind user reads a neutral
              number.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — say it in text and announce it</span>
            <div class="dd__stage"><span class="dd__badge dd__badge--red">&#9888; 3 errors</span><span class="dd__code">+ .sr-only[aria-live]</span></div>
            <p class="dd__why">
              An icon or word beside the hue satisfies the color rule; a polite live region makes
              the same change audible without stealing focus.
            </p>
          </div>
        </div>

        <h3>Which criterion each habit answers</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Habit</th><th>Success criterion</th><th>Level</th></tr></thead>
            <tbody>
              <tr><td>Skip link past the header</td><td>SC 2.4.1 Bypass Blocks</td><td>A</td></tr>
              <tr><td>Every control reachable and operable by keyboard</td><td>SC 2.1.1 Keyboard</td><td>A</td></tr>
              <tr><td>The ring is visible and not removed</td><td>SC 2.4.7 Focus Visible</td><td>AA</td></tr>
              <tr><td>The ring is legible against its ground</td><td>SC 1.4.11 Non-text Contrast</td><td>AA</td></tr>
              <tr><td>Text and its ground are a measured pair</td><td>SC 1.4.3 Contrast (Minimum)</td><td>AA</td></tr>
              <tr><td>A second carrier beside the hue</td><td>SC 1.4.1 Use of Color</td><td>A</td></tr>
              <tr><td>Motion answers the reduced-motion preference</td><td>SC 2.3.3 Animation from Interactions</td><td>AAA</td></tr>
              <tr><td>A target big enough to hit</td><td>SC 2.5.8 Target Size (Minimum)</td><td>AA</td></tr>
              <tr><td><code>lang</code> matches the rendered language</td><td>SC 3.1.1 Language of Page</td><td>A</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Criteria and levels from WCAG 2.2, linked in the agent doc's Sources. The kit answers
          the first three and the last one in its shell; the rest are the call site's. SC 2.5.8 is
          answered per control rather than globally — the slider-handle override in
          <code>src/styles.scss</code> is the reference pattern, and Design says what that leaves
          to you.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Two Sass files, both global, and no component stylesheet anywhere — every component
          style in the kit is an inline plain-CSS literal. That one structural fact decides most
          of what follows: a global rule is the only rule that can reach everything, and a Sass
          mixin can reach nothing.
        </p>

        <h3>The preference queries the kit answers</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Query</th><th>Where</th><th>What it declares</th></tr></thead>
            <tbody>
              <tr>
                <td><code>prefers-reduced-motion: reduce</code></td>
                <td>Global catch-all, plus per-component blocks</td>
                <td><code>animation-duration</code> and <code>transition-duration</code> at <code>0.01ms !important</code>, <code>animation-iteration-count: 1</code>, <code>scroll-behavior: auto</code>, on <code>*</code>, <code>*::before</code>, <code>*::after</code></td>
              </tr>
              <tr>
                <td><code>prefers-contrast: high</code></td>
                <td>Feature-scoped only</td>
                <td>A thicker underline and a heavier weight on the glossary highlight, a 3px focus outline on it, a 2px border on the glossary popover — plus a few component-scoped blocks outside the global sheet</td>
              </tr>
              <tr>
                <td><code>forced-colors: active</code></td>
                <td>Component-scoped only; the global sheet declares none</td>
                <td>Mostly <code>border</code>, <code>background</code> and <code>forced-color-adjust</code>, in the didactic components and the tooltip</td>
              </tr>
              <tr>
                <td><code>prefers-reduced-transparency</code></td>
                <td>Nowhere</td>
                <td>Not answered</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Counted over every <code>&#64;media</code> at-rule in the tracked files under
          <code>src/</code>; the catch-all itself is the block at the top of
          <code>src/styles.scss</code>. To re-check what actually ships, read the emitted global
          stylesheet the <code>build:verify</code> chain produces.
        </p>

        <h3>Why 0.01ms and not none</h3>
        <p>
          The catch-all's own comment gives the reason: a duration of zero milliseconds is still a
          transition, so <code>transitionend</code> keeps firing and library internals that wait
          for it keep working, while nothing perceptible moves. It also says what the block is
          for — the specific blocks further down the sheet stay, act in addition, and the
          catch-all takes the rest. That is the kit's motion policy in one sentence: opt-out is
          global and automatic; opting a motion back <em>in</em> is the exception a component
          argues for.
        </p>
        <p>
          What it cannot reach is the other half of the animation surface. The block is CSS, so a
          Web Animations API call, a <code>requestAnimationFrame</code> loop, a canvas render, and
          an explicit <code>scrollIntoView(&#123; behavior: 'smooth' &#125;)</code> all run
          exactly as written — the last one because an explicit behavior option overrides the
          <code>scroll-behavior</code> property rather than reading it. Those are gated in
          TypeScript or not at all: every scroll call takes its behavior from
          <code>scrollBehavior()</code> and timer-driven motion asks
          <code>prefersReducedMotion()</code>, both in <code>src/app/utils/reduced-motion.ts</code>.
        </p>
        <p class="src-note">
          Reason quoted from the catch-all's comment in <code>src/styles.scss</code>; the option
          precedence is CSSOM View, linked in the agent doc's Sources.
        </p>

        <h3>The ring, and the color question inside it</h3>
        <p>
          There is no universal focus rule, but there is one ring for everything the kit ships
          from the library. The global sheet draws the kit shape — 2px, solid,
          <code>--primary-color-fg</code>, at a 2px offset, <code>!important</code> — on every
          keyboard-focusable Optimus UI part in one selector list: fields, the checkbox, radio
          and switch boxes, buttons, toggle and select-button segments, stepper heads, tabs,
          accordion headers, menu items, table rows and sort headers, paginator, slider handle,
          rating, tree, datepicker, breadcrumb — and the cookie buttons. Aura's own 1px
          <code>focusRing</code> (zeroed outright for the text controls and the select) never
          shows. Parts in a clipping container ring inside themselves (offset −2px, same ring);
          the close buttons of messages and toasts and the image preview's actions ring in their
          own ink (<code>currentColor</code>), because they sit on tints and plates where no
          accent holds 3:1. Two class-scoped rules sit beside the list with the same shape and
          token: the select's host state (<code>.p-select.p-focus</code>) and the glossary
          highlight — the kit's own convention showing its age, written on bare
          <code>:focus</code> rather than <code>:focus-visible</code>. Everything else in the app
          still has an author who wrote its ring.
        </p>
        <p class="src-note">
          The ring rule, its inset companion and the <code>currentColor</code> rule sit beside the
          select rule in <code>src/styles.scss</code>, whose comments name the shape, each part's
          focus model, and why the rule needs <code>!important</code>;
          <code>scripts/check-contrast.mjs</code> asserts the selector lists
          (<code>KIT_RING_SELECTORS</code>, <code>KIT_RING_INSET</code>) and measures the ring in
          <code>docs/generated/CONTRAST.MD</code>, group <code>focus ring</code> — lowest 3.88:1
          on the page surfaces, 3.52:1 inset on a selected table row. Verify in your build: focus a
          field by keyboard and read the computed outline once its color transition has run.
        </p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Token</th><th>Role</th><th>Measured as a foreground?</th><th>Lowest ratio on a ground</th></tr></thead>
            <tbody>
              <tr>
                <td><code>--primary-color</code></td>
                <td>The brand <em>fill</em>; the alias of <code>--primary-bg</code></td>
                <td>No — it appears in the compilat only as a background</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>--primary-color-fg</code></td>
                <td>The contrast-adjusted brand <em>foreground</em></td>
                <td>Yes — on both grounds, for all ten palettes, in all four visual styles and both modes</td>
                <td>{{ ringLightMin }} light, {{ ringDarkMin }} dark</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Ratios quoted from the brand-foreground group of
          <code>docs/generated/CONTRAST.MD</code>, judged there against SC 1.4.3 at 4.5:1; a
          focus indicator is judged against SC 1.4.11 at 3:1, which both figures clear.
          <code>--primary-color</code> has no foreground row to quote.
        </p>
        <p>
          The consequence is one sentence long. A ring in <code>--primary-color-fg</code> has a
          measured number behind it in every theme and every brand palette; a ring in
          <code>--primary-color</code> is the fill role used as a line, and its legibility against
          the page is unmeasured rather than approved. The kit's one ring rule uses the foreground
          token, and its comment says why: it is the contrast-adjusted brand color the theme
          service maintains per theme.
        </p>

        <h3>What the shell contributes</h3>
        <p>
          Four things, all from the app shell (<code>src/app/app.component.ts</code>, its header
          in <code>src/app/components/frame/app-header.component.ts</code> and
          <code>src/app/services/optimus-a11y.service.ts</code>), all above every route: a skip
          link as the first focusable node; the landmark set
          (<code>header[role=banner]</code>, <code>nav[role=navigation]</code> with a translated
          label, the main container as a native <code>main[tabindex=-1]</code> (the only
          <code>main</code> on the page, so routed pages never render their own), and
          <code>footer[role=contentinfo]</code> from the footer component); focus moved to that
          main container after every completed navigation, with <code>preventScroll: true</code>
          so the router keeps owning the scroll position; and a small runtime patch layer over
          library markup, described in Development.
        </p>
        <p>
          One more piece of shell chrome is modal, and it is the reference for a hand-built
          dialog: the cookie settings dialog is <code>role="dialog"</code> with
          <code>aria-modal="true"</code>, labeled and described by its own title and text. The CDK's
          <code>cdkTrapFocus</code> keeps Tab inside it and, with auto-capture, moves focus to its
          first control on open; Escape and the close button hand focus back to the element that
          opened it — or, when that trigger sat in the banner that has just disappeared, to the
          main landmark instead of letting it fall to the document body.
        </p>
        <p class="src-note">
          Landmarks read off the shell and header templates and the footer component; the focus
          move is the <code>NavigationEnd</code> subscription in <code>app.component.ts</code>, guarded by
          <code>isPlatformBrowser</code> because it touches the document. The dialog's trap, the
          Escape listener, and both focus returns are in
          <code>src/app/components/frame/cookie-consent.component.ts</code>.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          Nothing in this guide is breakpoint-dependent. The catch-all, the focus convention,
          <code>.sr-only</code>, the skip link and the landmark set carry no viewport media query
          at all — only the preference queries above — so they behave identically at 360px and at
          2560px. What genuinely changes at that width is target size, and the kit answers SC
          2.5.8 one control at a time rather than with a rule that reaches everything. Two
          mechanisms are in the global sheet and both are worth copying: the slider raises Aura's
          20&#215;20 handle to 24&#215;24 by overriding
          <code>--p-slider-handle-width</code>/<code>-height</code> on <code>.p-slider</code>, and
          the cookie dialog's close button is sized 44&#215;44 outright. What has <em>no</em>
          mechanism is the shortcut: <code>.touch-target-44</code> and
          <code>.touch-target-expanded</code> are declared in the global sheet and applied by
          nothing, so a class name is not a way to reach the floor here. Layout guidance: SC 2.5.8
          asks for 24&#215;24 CSS px (AA) — give a touch control that much itself, prefer
          <code>2.75rem</code> where the layout allows, since 44px is the AAA figure from SC 2.5.5,
          and keep adjacent hit areas from overlapping.
        </p>
        <p class="src-note">
          Handle-token override, close-button size, and both utility declarations from
          <code>src/styles.scss</code> — the slider block carries SC 2.5.8 in its own comment; the
          absence of a call site for the utilities was counted over the tracked files under
          <code>src/</code>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Building an accessible control here is four decisions and one recipe. Fixing a library
          control that is inaccessible is a different job, and the kit already has a place to put
          it.
        </p>

        <h3>A custom widget, wired</h3>
        <pre class="code-block"><code>{{ widgetSnippet }}</code></pre>
        <p class="src-note">
          Pattern assembled from the conventions this guide measures; the ring shape and the
          hidden-text class are the kit's, the role, the keys, and the announcement are the call
          site's.
        </p>

        <h3>The runtime patch layer</h3>
        <p>
          Some library markup cannot be fixed from a template because the component writes it
          itself. The shell answers that with a <code>MutationObserver</code> that runs a small
          patch function over the document and over every added node. One patch is left: it
          removes a presentational role from the tab-panel container where it conflicts with the
          semantic children below it.
        </p>
        <p>
          The interesting part of that function is what it declines to do. It documents four
          patches it deliberately omits — a role for the toggle-button host, naming sliders,
          recomputing a slider's current value, and naming the tablist scroll buttons — each with
          the finding that ruled it out: a role the component already binds on its own host, a
          rule that never fired because the node was reported before its own bindings applied, a
          recomputation that replaced a correct value with a rounded one, and an English literal
          stamped over a name the library already produces in the page language. Take the lesson
          before reaching for the observer: <strong>a patch that runs after the component has
          rendered is a race, and a name is only reliable when it is given at the call
          site.</strong>
        </p>
        <p class="src-note">
          The patch and all four omissions are in the patch function in
          <code>src/app/services/optimus-a11y.service.ts</code>, each carrying its own measurement.
        </p>

        <h3>What actually gets checked</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Check</th><th>Runs where</th><th>Covers</th></tr></thead>
            <tbody>
              <tr>
                <td><code>scripts/check-contrast.mjs</code></td>
                <td><code>build:verify</code> and the harness</td>
                <td>
                  Kit token pairs, and the Optimus UI widget pairs resolved from the Aura preset as the kit
                  configures it (checkbox, select and field edges, tag, dialog, progress bar, and more), in
                  every visual style and mode, against SC 1.4.3 and SC 1.4.11; open exceptions are declared
                  at the top of <code>docs/generated/CONTRAST.MD</code>
                </td>
              </tr>
              <tr>
                <td>The manual checklist</td>
                <td>By hand, per surface</td>
                <td>Keyboard path, focus order, names and roles, landmarks, motion</td>
              </tr>
              <tr>
                <td><code>scripts/check-a11y.mjs</code> (<code>npm run check:a11y</code>)</td>
                <td>CI, after the production build; the <code>a11y-built-pages</code> health check</td>
                <td>
                  axe-core in headless Chrome on a fixed sample of prerendered routes, both languages, both themes;
                  violations of <code>[hard]</code> A11Y rules block
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gate list read off the <code>build:verify</code> chain in
          <code>package.json</code> and <code>scripts/verify-harness.mjs</code>; the checklist is
          <code>directives/accessibility-workflow.md</code>, the rules it serves are
          <code>base/standards/A11Y.md</code>.
        </p>

        <h3>An API that looks like the answer and is not</h3>
        <p>
          Until 2026-09-24 <code>src/styles/design-tokens.scss</code> declared a
          <code>visually-hidden()</code> and a <code>focus-ring()</code> mixin. Neither was usable
          nor used: the kit has no component stylesheet, so no component can include a mixin, and
          <code>visually-hidden()</code> only duplicated <code>.sr-only</code> under another name.
          <code>focus-ring()</code> was worse: it expanded to <code>outline: none</code> plus a
          shadow invalid at computed-value time, so it removed the ring it claimed to draw. Both
          are deleted. Hide text with <code>.sr-only</code>; the ring is the kit ring rule in
          <code>src/styles.scss</code> — extend its selector list for a new widget.
        </p>
        <p class="src-note">
          Deleted mixin bodies: <code>git log -- src/styles/design-tokens.scss</code>; the absence of any
          <code>&#64;include</code> outside that file, and of any <code>styleUrls</code> in the
          kit, was counted over the tracked files under <code>src/</code>.
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>Tab reaches the control, Enter or Space operates it, Escape leaves anything that traps.</li>
          <li>The ring appears on keyboard focus and not on click, at 2px with a 2px offset.</li>
          <li>The accessible name comes from a translation key and contains the visible label.</li>
          <li>Every state change a sighted user sees has a text equivalent, announced politely.</li>
          <li>No meaning rests on hue alone.</li>
          <li>Any JavaScript-driven motion asks <code>prefersReducedMotion()</code>, and every scroll call takes <code>scrollBehavior()</code>.</li>
          <li>A modal traps focus, closes on Escape, and returns focus to its trigger.</li>
          <li>Color pairs are quoted from the compilat, never eyedropped.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          An accessible name is a string, so every translation rule applies to it — and two of the
          strings a screen reader reads are not yours at all: the library ships its own, and the
          document language is written by the app.
        </p>

        <h3>Names are bound, not written</h3>
        <p>
          The convention is a bound attribute over a literal:
          <code>[attr.aria-label]="translate('…')"</code>. A static <code>aria-label</code> is
          reserved for the developer workshop, whose guides ship one file per language (the English
          article and its German twin, ADR-0018), so each file carries its own literal; on any
          reader-facing surface a literal is a name that never translates. The same holds for
          <code>aria-labelledby</code> and <code>aria-describedby</code> — they point at nodes
          whose text is already translated, which is why they are usually the cheaper option.
          Decorative icons carry <code>aria-hidden="true"</code> so the name comes from the
          control, not from the glyph.
        </p>

        <h3>The library's own screen-reader vocabulary</h3>
        <p>
          Optimus UI ships its own ARIA strings and defaults them to English. They are invisible, so
          nothing on screen betrays that a German page hands a screen reader an English list
          label. The shell overrides that vocabulary in the page language, and deliberately only
          the keys the components in this kit actually read — the list label, the remove label,
          the previous and next of the tablist scroll buttons, the select-all pair, the rating
          words, the maximize pair, and the close button of message and toast, which has no naming
          input of its own. The date, filter, and upload vocabulary stays English: nothing here
          renders it, and translating it would be dead weight in every language.
        </p>
        <p class="src-note">
          Key list and its reasoning from the ARIA-sync method in
          <code>src/app/services/optimus-a11y.service.ts</code>; the merge is one level deep, which is why the
          block is spread before it is written.
        </p>

        <h3>The document language</h3>
        <p>
          <code>document.documentElement.lang</code> has exactly one writer, and that is the rule
          rather than an accident of the code: a second writer subscribing to the same
          language-change event would decide the outcome by subscription order, which is not a
          thing a document attribute should depend on. The one writer is the SEO service, and it
          writes the <em>resolvable base</em> language — the simplified-language suffix is stripped
          first, because no ISO code exists for &ldquo;Easy&nbsp;&lt;x&gt;&rdquo; and a screen
          reader that cannot resolve the tag falls back to the wrong voice for the whole page. The
          portal's own language identifier is a different thing from the language tag, and only
          one of them belongs in <code>lang</code>.
        </p>
        <p class="src-note">
          Writer and stripping rule in <code>src/app/services/meta-seo.service.ts</code>, whose own
          comment gives the reason; the service is instantiated by the app shell, so it runs on
          every route.
        </p>

        <h3>Writing direction</h3>
        <p>
          The kit sets no <code>dir</code> attribute, ships no <code>rtl</code> rule and exposes
          no direction switch: every layout is left-to-right and stays that way whatever the
          content language is. That is a boundary, not a feature. Adding a right-to-left language
          means writing the <code>dir</code> writer first, then auditing every physical
          <code>left</code> / <code>right</code> in the component styles. That audit has a partial
          head start and no more: about half of the library-component guides note whether their
          component's own styles use logical properties, the rest are silent, and no agent doc
          carries the finding at all — so treat those notes as a starting point, not as coverage.
        </p>
        <p class="src-note">
          Absence of a <code>dir</code> writer and of any <code>rtl</code> rule counted over the
          tracked files under <code>src/</code>; the logical-property notes that do exist are in
          the Design tabs of the component guides.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.8</strong> — 2026-09-24 — The dead <code>focus-ring()</code> mixin and the two
            never-included mixins that called it (<code>button-base()</code>, <code>input-base()</code>)
            are deleted from <code>design-tokens.scss</code>, and with them the unused
            <code>visually-hidden()</code>, <code>card-base()</code> and <code>truncate()</code> and
            the unread <code>--focus-ring</code> tokens; the Development tab points at
            <code>.sr-only</code> and the kit ring rule.
          </li>
          <li><strong>v0.7</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the
            megamenu item and the autocomplete chip take the kit ring too, and the dead
            <code>--input-focus-ring</code> token the source notes cited is gone.
          </li>
          <li><strong>v0.6</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the one kit ring
            rule now covers every focusable Optimus UI part and the cookie buttons (the family and cookie
            rules are gone), measured in the gate's <code>focus ring</code> group; the toggle-button role
            patch is removed, so one runtime patch and four documented omissions remain.
          </li>
          <li><strong>v0.5</strong> — 2026-09-23 — Brought to the current kit: the JavaScript half of
            reduced motion is the <code>src/app/utils/reduced-motion.ts</code> helper, the main landmark
            is a native <code>&lt;main&gt;</code>, and the cookie settings dialog is named as the
            shell's modal reference (focus trap, Escape, focus return). The contrast gate now also
            measures Optimus UI widget pairs; the ring token's lowest ratio is quoted across all four
            visual styles (4.75:1). The agent doc is trimmed to the aim.</li>
          <li><strong>v0.4</strong> — 2026-09-02 — Re-based on Optimus UI 2.0.2 (ADR-0014). The
            preset facts are back on Aura 2.x and re-read there: the global
            <code>focusRing</code> is still 1px solid primary at a 2px offset and
            <code>form.field.focusRing</code> is still zeroed, but the slider handle is
            20&#215;20 and the checkbox is <em>not</em> ringless — it inherits the 1px global
            ring, which the kit rule replaces rather than adds. Two stale in-repo line refs in
            the header block were re-derived (<code>styles.scss:1164</code>,
            <code>design-tokens.scss:660</code>).</li>
          <li><strong>v0.3</strong> — 2026-08-23 — Re-measured against PrimeNG 22.1.0 /
            Themes 3.0.0. The ring story gains a second level: since this version,
            family rules in <code>styles.scss</code> draw the 2px kit ring on PrimeNG's
            ringless form controls (<code>.p-inputtext</code>, <code>.p-textarea</code>, the
            checkbox box, <code>.p-select</code>) — browser-verified in both themes — while
            every other element still draws its own. Preset facts re-checked in Themes 3.0:
            the global 1px ring and the zeroed <code>form.field.focusRing</code> both
            carry over.</li>
          <li><strong>v0.2</strong> — 2026-08-18 — Review pass. SC 2.5.8 is answered per control,
            not nowhere: the slider-handle override and the 44&#215;44 close button are named as
            the mechanisms, the unused utilities as the part that is missing, and the 24px floor
            is separated from the 44px AAA figure. <code>:focus-visible</code> is stated as the
            kit standard rather than as a universal fact, the global sheet's ring rules are
            counted as three, the Do/Don't pairs on the ring and on naming render live controls,
            and the RTL pointer is narrowed to what the component guides actually record. Two
            defect dispositions leave the text: <code>lang</code> is documented as the
            single-writer rule it is, and the reduced-motion note keeps the mechanism without the
            bug report.</li>
          <li><strong>v0.1</strong> — 2026-08-18 — Initial guide: the four global mechanisms
            measured at their source, the reduced-motion catch-all and what it cannot reach, the
            focus-ring shape and the unmeasured color token most rules paint it in, the two dead
            Sass mixins, the unused touch-target utilities, the runtime patch layer with its three
            documented removals, the two writers of <code>lang</code>, and the canonical agent
            doc.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class A11yGuidelinesArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Live example state: the block IS the output ---------------------------

  readonly score = signal(0);

  bump(): void {
    this.score.update((n) => n + 1);
  }

  /** Empty until something happens: a live region must exist before it speaks. */
  readonly announcement = computed(() =>
    this.score() === 0 ? '' : 'Point added. Total is now ' + this.score() + '.'
  );

  /**
   * The naming Do/Don't renders two real icon-only buttons. Pressing either one
   * cycles a pretend page language, so the bound name moves and the literal does
   * not — the failure is visible rather than described.
   */
  protected readonly demoLangs = [
    { label: 'English', close: 'Close' },
    { label: 'Deutsch', close: 'Schließen' },
    { label: 'Français', close: 'Fermer' },
  ];
  protected readonly demoLangIndex = signal(0);

  cycleLang(): void {
    this.demoLangIndex.update((i) => (i + 1) % this.demoLangs.length);
  }

  readonly demoLangLabel = computed(() => this.demoLangs[this.demoLangIndex()].label);
  readonly boundName = computed(() => this.demoLangs[this.demoLangIndex()].close);

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly ringLightMin: string = '4.75:1';
  readonly ringDarkMin: string = '4.75:1';

  readonly widgetSnippet: string = `<!-- A custom widget owes four things. The kit supplies one of them. -->
<div
  class="rating"
  role="slider"
  tabindex="0"
  [attr.aria-label]="translate('rating.label')"
  [attr.aria-valuenow]="value()"
  [attr.aria-valuemin]="0"
  [attr.aria-valuemax]="5"
  (keydown.arrowRight)="step(1)"
  (keydown.arrowLeft)="step(-1)">
  <!-- visual stars; each one aria-hidden, the value is on the host -->
</div>
<span class="sr-only" aria-live="polite" [textContent]="spoken()"></span>

/* The ring is yours to draw — the kit's one ring rule lists
   Optimus UI's focusable parts, never your own widget.
   Shape: the kit standard. Color: the measured foreground role, not
   the fill role, because a ring is a line seen AGAINST the page. */
.rating:focus-visible {
  outline: 2px solid var(--primary-color-fg);
  outline-offset: 2px;
}

/* Motion the catch-all cannot reach, because it is not CSS.
   import { prefersReducedMotion, scrollBehavior } from '../../utils/reduced-motion'; */
if (!prefersReducedMotion()) {
  el.animate(keyframes, 240);
}
el.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });`;
}
