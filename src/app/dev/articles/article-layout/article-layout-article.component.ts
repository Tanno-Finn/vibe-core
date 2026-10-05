import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollTop } from '@openng/optimus-ui/scrolltop';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { StandardContainerComponent } from '../../../components/shared/standard-container.component';
import { scrollBehavior } from '../../../utils/reduced-motion';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, StandardContainerComponent, ScrollTop];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
    :host { display: block; }
    .lead { font-size: 1.05rem; color: var(--text-color-secondary); margin: 0 0 var(--space-5); }
    .m0 { margin: 0; }

    /* --- Page skeleton --- */
    .skel { margin: 0 0 var(--space-4); }
    .skel__band {
      position: relative;
      padding: var(--space-5) var(--space-4) var(--space-4);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      background: var(--surface-section);
    }
    .skel__band--body {
      margin: var(--space-3) 0;
      background: var(--surface-card);
      border-style: dashed;
    }
    .skel__cap {
      position: absolute; top: var(--space-2); left: var(--space-4);
      font-size: var(--font-size-sm); color: var(--text-color-secondary);
      text-transform: uppercase; letter-spacing: 0.04em;
    }
    .skel__row {
      margin: var(--space-2) 0; padding: var(--space-3) var(--space-4);
      border: 1px solid var(--surface-border); border-radius: var(--radius-md);
      background: var(--surface-card); font-size: 0.9rem; overflow-wrap: anywhere;
    }
    .skel__band--body .skel__row { background: var(--surface-section); }
    .skel__row--muted { color: var(--text-color-secondary); }

    /* --- Rendered stages --- */
    .stage {
      margin: 0 0 var(--space-4); padding: var(--space-4);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
    }
    .stage--stack { display: grid; gap: var(--space-4); }

    /* p-scrolltop demo: the panel owns its scroll, so target="parent" has something to watch. */
    .st-panel {
      max-height: 16rem; overflow-y: auto;
      padding: var(--space-4);
      background: var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-md);
      margin: 0 0 var(--space-3);
    }
    .st-panel:focus-visible { outline: 2px solid var(--primary-color-fg); outline-offset: 2px; }
    .st-panel__title { margin: 0 0 var(--space-3); }
    .st-panel__title:focus-visible { outline: 2px solid var(--primary-color-fg); outline-offset: 2px; }
    .st-panel__row { margin: 0 0 var(--space-3); }

    /* --- Do / Don't --- */
    .dd { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin: 0 0 var(--space-4); }
    .dd__cell { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: var(--surface-card); }
    .dd__cell--bad { border-left: 3px solid var(--semantic-red-fg, #b91c1c); }
    .dd__cell--good { border-left: 3px solid var(--semantic-green-fg, #15803d); }
    .dd__stage { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-4); border-radius: var(--radius-md); background: var(--surface-section); min-height: 3.5rem; }
    .dd__why { margin: 0; font-size: var(--font-size-sm); color: var(--text-color-secondary); }
    .dd__code { font-family: var(--font-mono); font-size: 0.8rem; overflow-wrap: anywhere; min-width: 0; }
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
    .td-you { color: var(--primary-color-fg); font-weight: var(--font-weight-medium); }
    .history strong { color: var(--primary-color-fg); }
  `;

/**
 * Guide article: Article Layout (layouts).
 *
 * WHAT THE CLAIMS REST ON — the durable artifacts behind every rule in the
 * tabs. The per-page census that produced these conventions is commit-body
 * material and deliberately absent from the rendered text (guide-authoring:
 * "Provenance, not process", durability test 1):
 *   - The frame: src/app/components/shared/lesson-template.component.ts —
 *     the <article> region, the single <h1> via app-page-header, the control
 *     toolbar, the viewport-fixed progress bar, the two FAB registrations in
 *     ngAfterViewInit, the <ng-content> slot, and the four appended footers
 *     (tools, resources, cited sources, app-related-refs).
 *   - The blueprint the kit ships for a new page:
 *     src/app/pages/articles/seed-article-1/ plus its route in
 *     src/app/app.routes.ts and its meta in
 *     src/assets/data/core/articles/seed-article-1.json.
 *   - Heading ownership is an input, not a habit: standard-container,
 *     definition, and checkpoint each declare a headingLevel input defaulting
 *     to 3; text-container hands its wrapped container headingLevel 2;
 *     quiz-container passes no level and therefore inherits the default;
 *     example-box renders its title in a div and contributes no heading.
 *   - The column: max-width comes from --container-section, emitted from the
 *     $containers map in src/styles/design-tokens.scss, and the same rule sets
 *     overflow-x: hidden, which is what makes an unwrapped wide block clip.
 *   - The breakpoint ladder (1024 / 768 / 480 / 380 / 360) lives entirely in
 *     the template stylesheet; the body contributes none of it.
 *   - The chip budget: .meta-item declares no white-space, so its text wraps;
 *     at the 360px step the text child (.meta-text, added 2026-08-20) stops
 *     wrapping and is ellipsized. The ellipsis sits on a blockified flex ITEM
 *     because text-overflow applies to block containers and .meta-item is
 *     display: flex (CSS Overflow 3) — same pattern as .item-text in
 *     table-of-contents-fab.component.ts.
 *   - Back to top (covers: scrolltop): the shell mounts
 *     scroll-to-top-fab.component.ts once in app.component.ts (window only,
 *     showAfterScroll 1000, label key textContainer.backToTop, behavior from
 *     scrollBehavior()). Optimus UI 2.0.2 openng-optimus-ui-scrolltop.mjs:
 *     target/threshold/icon/behavior/motionOptions/buttonAriaLabel/buttonProps
 *     :79-131, onClick scroll :168-174, sticky vs fixed :177, render removed
 *     after the leave motion :184-186, visibility :187-197, parent listener
 *     :198-203, aria-label from buttonAriaLabel only :245. Positioning from
 *     @openng/optimus-ui-styles/dist/scrolltop/index.mjs.
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-article-layout-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'article-layout'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          An article page in this kit is one component wrapped around your body text. What that
          wrapper already renders is the part most new pages rebuild by accident, so it is worth
          seeing before writing a line of markup.
        </p>

        <h3>The page, in the order it renders</h3>
        <p>
          Everything in the outer band arrives from
          <code>&lt;app-lesson-template&gt;</code> whether you ask for it or not, in the order the
          template writes it into the document. The inner band is the projection slot &mdash; the
          only part a page author writes.
        </p>
        <div class="skel">
          <div class="skel__band skel__band--frame">
            <span class="skel__cap">template</span>
            <div class="skel__row">page header &mdash; the one h1, subtitle, badges</div>
            <div class="skel__row">toolbar &mdash; back &middot; category, reading time, difficulty &middot; share</div>
            <div class="skel__row">progress bar &mdash; role=&quot;progressbar&quot;, painted at the top of the viewport</div>
            <div class="skel__row skel__row--muted">FAB registrations &mdash; table of contents, Easy Language</div>

            <div class="skel__band skel__band--body">
              <span class="skel__cap">your body</span>
              <div class="skel__row">lead &mdash; opening paragraphs, no heading of their own</div>
              <div class="skel__row">topic sections &mdash; an id, an h2, the blocks</div>
              <div class="skel__row">the interactive section</div>
              <div class="skel__row">takeaways &rarr; quiz &rarr; checkpoint</div>
            </div>

            <div class="skel__row skel__row--muted">related tools &middot; resources &middot; cited sources</div>
            <div class="skel__row skel__row--muted">related content &mdash; resolved from the article JSON</div>
          </div>
        </div>
        <p>
          One row is not where it looks. The progress bar is
          <code>position: fixed; top: 0</code>, so it is painted above the header while it renders
          after the toolbar. The order above is the document order &mdash; what reading order
          follows, and what a page that rebuilt the frame would have to reproduce.
        </p>
        <p class="src-note">
          Document order, the fixed placement of the progress bar, the projection slot, and the four
          appended footers read from
          <code>src/app/components/shared/lesson-template.component.ts</code>; the footers are
          fed by <code>src/assets/data/core/articles/</code> and appear only when that file
          names something.
        </p>

        <h3>A block brings its own heading</h3>
        <p>
          The same container twice, differing only in the level it was asked for. Nothing here is
          a hand-written tag: the number is an input, and the block emits it. Both are shown at
          4 and 5 so this page keeps its own outline intact.
        </p>
        <div class="stage stage--stack">
          <app-standard-container
            [config]="{ type: 'info', title: 'Staging area', headingLevel: 4 }">
            <p class="m0">
              Asked for level 4, this title renders as an h4. The accent, the icon, and the
              optional collapse arrive with it.
            </p>
          </app-standard-container>

          <app-standard-container
            [config]="{ type: 'warning', title: 'Staging area', headingLevel: 5 }">
            <p class="m0">
              Asked for level 5, the same block renders an h5. Placing it is therefore a
              structural decision, not a styling one.
            </p>
          </app-standard-container>
        </div>
        <p class="src-note">
          Variant set, heading control, and collapse behavior from
          <code>src/assets/design-system/standard-container.md</code> and the component it
          documents, <code>src/app/components/shared/standard-container.component.ts</code>.
        </p>

        <h3>Back to the top of a panel, not the page</h3>
        <p>
          The page already has its back-to-top control: the shell's floating button, bottom right, once you have
          scrolled far enough. <code>&lt;p-scrolltop target="parent"&gt;</code> is for a box with its own scroll.
          Scroll inside the panel below: past {{ stThreshold }}px the button appears, pinned to the panel's lower
          edge; press it and the panel returns to its top while focus moves to the panel's heading.
        </p>
        <div class="st-panel" role="region" aria-labelledby="st-panel-title" tabindex="0">
          <h4 id="st-panel-title" class="st-panel__title" tabindex="-1" #stTitle>Release notes (excerpt)</h4>
          @for (row of stRows; track row) {
            <p class="st-panel__row">{{ row }}</p>
          }
          <p-scrolltop
            target="parent"
            [threshold]="stThreshold"
            [behavior]="stBehavior()"
            icon="pi pi-arrow-up"
            buttonAriaLabel="Back to the top of the release notes"
            (click)="stTitle.focus({ preventScroll: true })"
          />
        </div>
        <p class="src-note">
          Inputs and behavior from <code>openng-optimus-ui-scrolltop.mjs</code> (<code>:79-131</code>, the click at
          <code>:168-174</code>); the scroll behavior comes from <code>src/app/utils/reduced-motion.ts</code>, so the
          jump is instant under reduced motion. The panel is focusable so a keyboard can scroll it.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Two contracts decide whether a new page works: what the template needs from you, and
          what your body owes the table of contents. Both fail quietly when broken.
        </p>

        <h3>The regions, in document order</h3>
        <p>
          Document order, not the order on screen: the progress bar is viewport-fixed and paints
          above the header although the template writes it after the toolbar.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Region</th><th>What it is</th><th>Who writes it</th></tr>
            </thead>
            <tbody>
              <tr><td>Page header</td><td>The page-level <code>h1</code>, the subtitle, the draft and scheduled badges</td><td>Template, from <code>meta</code></td></tr>
              <tr><td>Toolbar</td><td>Back link, the meta chips, copy/share/print</td><td>Template, from <code>meta</code></td></tr>
              <tr><td>Reading progress</td><td>A 4px bar with <code>role=&quot;progressbar&quot;</code>, driven by scroll position and fixed to the top of the viewport</td><td>Template</td></tr>
              <tr><td>Floating buttons</td><td>Table of contents and Easy Language, registered into the shared FAB stack</td><td>Template &mdash; one from <code>tocItems</code>, the other from whether a simplified version exists for this id</td></tr>
              <tr><td>Body</td><td>Everything between the frame and the footers</td><td class="td-you">You</td></tr>
              <tr><td>Reference footers</td><td>Related tools, related resources, cited sources</td><td>Template, from the article JSON</td></tr>
              <tr><td>Related content</td><td>Editorial and graph-resolved links for this article id</td><td>Template, from the article JSON</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Order and ownership read from
          <code>src/app/components/shared/lesson-template.component.ts</code>; the footer sources
          from the per-article files under <code>src/assets/data/core/articles/</code>.
        </p>

        <h3>What the template needs from you</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Required</th><th>What it drives</th></tr>
            </thead>
            <tbody>
              <tr><td><code>meta</code></td><td>Yes</td><td>Absent, the template renders its loading state and nothing else</td></tr>
              <tr><td><code>meta.id</code></td><td>Yes</td><td>Must equal the article id in the core JSON &mdash; the footers, the Easy Language button, and the FAB keys all resolve through it</td></tr>
              <tr><td><code>meta.titleKey</code></td><td>Yes</td><td>The <code>h1</code>, and the text used when the page is shared. <code>title</code> is a separate optional field, the static fallback for a key that does not resolve</td></tr>
              <tr><td><code>meta.readingTime</code></td><td>Yes</td><td>A meta chip, printed verbatim</td></tr>
              <tr><td><code>meta.difficultyKey</code></td><td>Yes</td><td>A meta chip, translated</td></tr>
              <tr><td><code>meta.difficulty</code></td><td>Yes</td><td><strong>Nothing.</strong> The one field that is required and never read &mdash; the chip beside it comes from <code>difficultyKey</code>. Give it a value the type accepts and move on</td></tr>
              <tr><td><code>meta.focus</code></td><td>Yes</td><td>Which Easy Language content type is looked up: <code>theory</code> asks for an article, <code>practice</code> for a page</td></tr>
              <tr><td><code>meta.categoryKey</code></td><td>No</td><td>The accented category chip. The separate <code>category</code> field is optional and equally unread</td></tr>
              <tr><td><code>meta.subtitleKey</code>, <code>chapters</code>, <code>publishDate</code>, <code>draft</code>, <code>scheduledFor</code></td><td>No</td><td>Each adds one element to the header or the toolbar and is otherwise absent</td></tr>
              <tr><td><code>tocItems</code></td><td>No, but once</td><td>A non-empty array by your own <code>ngOnInit</code> registers the button; the check is not repeated</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Field names and their effects from the <code>LessonMeta</code> interface and the
          template that consumes it,
          <code>src/app/components/shared/lesson-template.component.ts</code>; the required set is
          the one the interface declares without <code>?</code>.
        </p>

        <h3>Do and don&#39;t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; open a second document</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;article&gt;&lt;h1&gt;Version control&lt;/h1&gt; … &lt;/article&gt;</code>
            </div>
            <p class="dd__why">
              The template has already opened the region and rendered the page heading from
              <code>meta</code>. A second one leaves the page with two top-level headings and one
              article region nested inside another, so heading navigation and region navigation
              both offer a choice that means nothing.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; start at the second level</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;section id="repository" class="article-section"&gt;&lt;h2&gt;…&lt;/h2&gt;</code>
            </div>
            <p class="dd__why">
              Your body opens under an existing <code>h1</code>, so its own sections are level 2
              and the blocks inside them sit at 3. The id is what the table of contents jumps to.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; name an id nothing carries</span>
            <div class="dd__stage">
              <code class="dd__code">&#123; id: 'deep-dive', label: t('article.toc.deepDive') &#125;</code>
            </div>
            <p class="dd__why">
              Navigation is a lookup by id followed by a scroll. When the lookup misses there is
              no error, no fallback, and no visible change: the entry stays in the list and does
              nothing when pressed, which is worse than not offering it.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; derive the list from the ids you rendered</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;section id="deep-dive"&gt; … &#123; id: 'deep-dive', label: … &#125;</code>
            </div>
            <p class="dd__why">
              One id, written twice, in step. A section you deliberately leave out of the list is
              fine &mdash; an aside the reader may skip does not need a jump target. An entry
              without a section never is.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; let a wide block find its own way out</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;pre&gt;git commit --amend --no-edit --author="…"&lt;/pre&gt;</code>
            </div>
            <p class="dd__why">
              The article column clips horizontal overflow rather than scrolling it, and the
              clipping is silent: on a phone the end of the line is simply not there, and no
              scrollbar or drag gesture will bring it back.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; give it its own scroller</span>
            <div class="dd__stage">
              <code class="dd__code">pre &#123; overflow-x: auto; white-space: pre; &#125;</code>
            </div>
            <p class="dd__why">
              One rule per wide block &mdash; code, a table, a fixed-width diagram &mdash; keeps
              the overflow inside the block, where the reader can reach it. A table can also take
              a wrapper that scrolls instead.
            </p>
          </div>
        </div>

        <h3>Sources for this tab</h3>
        <p class="src-note">
          Region order, the required inputs, and the one-shot FAB registration from
          <code>src/app/components/shared/lesson-template.component.ts</code>; the jump mechanism
          from <code>src/app/components/shared/table-of-contents-fab.component.ts</code>; the
          clipping behavior is the <code>hidden</code> value of the CSS overflow property, cited
          in the agent doc.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The layout has two bands and one column. Almost every measurement a page author is
          tempted to make has already been made in the template stylesheet.
        </p>

        <h3>The column</h3>
        <p>
          The article container is centered, capped at the
          <code>--container-section</code> width token, and padded on both sides. It also sets
          <code>overflow-x: hidden</code>, which is the single most consequential line in the
          layout: a child wider than the column is clipped to the padding box, and the user agent
          is required to offer no scrolling interface for it. That is why every wide block ships
          its own scroller. Which widths the token scale offers, and what a token may hold at all,
          belongs to <strong>Design Tokens</strong>.
        </p>
        <p class="src-note">
          Width, padding, and the overflow rule from the
          <code>.lesson-container</code> block in
          <code>src/app/components/shared/lesson-template.component.ts</code>; the token value
          is emitted from the container map in <code>src/styles/design-tokens.scss</code>.
        </p>

        <h3>Which block emits which heading</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Block</th><th>Heading it emits</th><th>Chosen by</th></tr>
            </thead>
            <tbody>
              <tr><td><code>app-page-header</code></td><td><code>h1</code></td><td>Fixed &mdash; the template renders it once</td></tr>
              <tr><td><code>app-standard-container</code></td><td><code>h1</code>&ndash;<code>h6</code></td><td><code>config.headingLevel</code>, default 3</td></tr>
              <tr><td><code>app-definition</code></td><td><code>h2</code>&ndash;<code>h6</code> for its title, plus a fixed <code>h3</code> above each example and each print-only option</td><td><code>headingLevel</code> input, default 3 &mdash; it moves the title only, so a definition asked for 4 or 5 puts an <code>h3</code> underneath it</td></tr>
              <tr><td><code>app-checkpoint</code></td><td><code>h2</code>&ndash;<code>h6</code></td><td><code>headingLevel</code> input, default 3</td></tr>
              <tr><td><code>app-text-container</code></td><td><code>h2</code></td><td>Fixed &mdash; it hands its wrapped container level 2</td></tr>
              <tr><td><code>app-quiz-container</code></td><td><code>h3</code>, plus an <code>h2</code> once it shows a result</td><td>Fixed &mdash; it passes no level, so the container default applies</td></tr>
              <tr><td><code>app-example-box</code></td><td>none</td><td>Its title is a styled <code>div</code> and joins no outline</td></tr>
              <tr><td><code>app-comparison</code>, <code>app-step-indicator</code>, <code>app-stat-card</code>, <code>app-takeaways-list</code></td><td>none</td><td>They carry labels, not headings</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read from each component under <code>src/app/components/shared/</code> and
          <code>src/app/components/didactic/</code>: the heading branch in the template, the
          declared default of the level input, and any heading tag the template writes outside
          that branch.
        </p>

        <h3>Two ways to build the outline, one rule</h3>
        <p>
          Either the section owns the heading and the blocks stay at their default &mdash;
          <code>&lt;section&gt;</code> plus your own <code>h2</code>, containers at 3 &mdash; or
          the block owns it and there is no section element at all: put the id on the block, ask
          it for level 2, and its title becomes the section heading. Both give a page one
          <code>h1</code> and no gap in the levels below it. The gap appears when a block is left
          at its default 3 with no level-2 heading anywhere above it &mdash; which is what happens
          when a page built the second way gains one block whose level nobody set. The type scale
          that renders those levels is
          <strong>Typography</strong>; the programmatic structure they stand for is the ground
          <strong>Accessibility Guidelines</strong> owns.
        </p>
        <p class="src-note">
          Both idioms are shipped: the sectioned one across the worked article pages under
          <code>src/app/pages/articles/</code>, the block-titled one in the blueprint page
          <code>src/app/pages/articles/seed-article-1/seed-article-1.component.ts</code>.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          The layout hands the body <strong>no breakpoint at all</strong>: it is one column at
          every width, narrowing only as its container padding does. Every step that arrives for
          free is in the frame, and it is a four-step ladder.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Below</th><th>What changes</th></tr>
            </thead>
            <tbody>
              <tr><td>1024px</td><td>The meta chips leave the toolbar row and center on a row of their own</td></tr>
              <tr><td>768px</td><td>The toolbar stacks into back, meta, share; the back button goes full width, and the column&#39;s padding is rewritten rather than reduced &mdash; the sides get narrower, the top grows</td></tr>
              <tr><td>480px</td><td>The share buttons shrink from 44 to 40px, the meta chips give up a step of padding and a little type size, the footer grids drop to one column with their link pairs stacked, and the table-of-contents panel is capped to the viewport</td></tr>
              <tr><td>380px / 360px</td><td>The chips lose padding again; at 360px their text stops wrapping and is ellipsized at the chip&#39;s edge</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Every breakpoint above is a media query in
          <code>src/app/components/shared/lesson-template.component.ts</code>, except the panel
          cap, which is one in
          <code>src/app/components/shared/table-of-contents-fab.component.ts</code>.
        </p>
        <p>
          Layout guidance for the body: assume the column and nothing else. A grid you introduce
          collapses only if you write that rule yourself, and a fixed-width child does not shrink,
          wrap, or scroll &mdash; it is cut off at the column edge. So give a multi-column grid a
          single-column rule at the width its cards stop fitting, give every wide block
          <code>overflow-x: auto</code>, and check the page at 360px before styling anything,
          because that is where a block that cannot fit stops being a styling question. The
          minimum size of the controls the frame renders is
          <strong>Accessibility Guidelines</strong> ground, not this guide&#39;s.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          A new article page is three files that have to agree on one id. Nothing enforces that
          agreement at build time, which is why it is the first thing to check.
        </p>

        <h3>The three files, and the id that joins them</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>File</th><th>Carries</th><th>Breaks silently if wrong</th></tr>
            </thead>
            <tbody>
              <tr><td>The component under <code>src/app/pages/articles/</code></td><td>The body, <code>meta</code>, <code>tocItems</code></td><td>No &mdash; a missing <code>meta</code> is visible as the loading state</td></tr>
              <tr><td>The route in <code>src/app/app.routes.ts</code></td><td>The path, the nav title key, the short page id used for print and QR links</td><td>No &mdash; the page is simply unreachable</td></tr>
              <tr><td>The entry under <code>src/assets/data/core/articles/</code></td><td>Related links, cited sources, tool and resource references</td><td>Yes &mdash; a mismatched id drops all four footers without a message</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The blueprint pairs all three under one id and says so in its own header comment:
          <code>src/app/pages/articles/seed-article-1/seed-article-1.component.ts</code> with its
          route and its entry in <code>src/assets/data/core/articles/</code>.
        </p>

        <h3>The smallest page that is complete</h3>
        <pre class="code-block"><code>{{ pageSnippet }}</code></pre>
        <p>
          Two things in it are timing, not taste. <code>tocItems</code> must be populated by the
          time the template reaches <code>ngAfterViewInit</code>, because that is where the
          floating button is registered and the array is never looked at again &mdash; filling it
          from a resolved request afterwards leaves the page with no table of contents at all. And
          the labels are strings rather than keys, so they need rebuilding when the language
          changes; the <code>i18n</code> tab has both shipped ways of doing that.
        </p>
        <p class="src-note">
          Registration point and its one-shot guard from the
          <code>ngAfterViewInit</code> of
          <code>src/app/components/shared/lesson-template.component.ts</code>.
        </p>

        <h3>Back to top: the kit's button or <code>p-scrolltop</code></h3>
        <p>
          An article needs no back-to-top control of its own. The app shell mounts
          <code>app-scroll-to-top-fab</code> once, above every route, and it registers itself with the floating-button
          stack. <code>p-scrolltop</code> answers a different question — a panel inside the page that scrolls on its
          own — and is only safe in that role once three of its defaults are overridden.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th></th><th><code>app-scroll-to-top-fab</code> (kit)</th><th><code>&lt;p-scrolltop&gt;</code> (Optimus UI)</th></tr>
            </thead>
            <tbody>
              <tr><td>Scrolls</td><td>The window</td><td>The window (<code>target="window"</code>, default) or its parent element (<code>target="parent"</code>)</td></tr>
              <tr><td>Where it sits</td><td>In the floating-button stack, bottom right, above the cookie banner</td><td>Fixed bottom right for the window, over the kit stack; sticky at the parent's lower edge for a panel</td></tr>
              <tr><td>Appears after</td><td>1,000 px (<code>showAfterScroll</code>)</td><td>400 px (<code>threshold</code>)</td></tr>
              <tr><td>Accessible name</td><td>The <code>textContainer.backToTop</code> key, in all four languages</td><td><code>buttonAriaLabel</code> &mdash; no default, so an unset one leaves a nameless icon button</td></tr>
              <tr><td>Reduced motion</td><td>Instant jump: behavior from <code>scrollBehavior()</code></td><td><code>behavior="smooth"</code> by default; an explicit option the CSS catch-all cannot override</td></tr>
              <tr><td>Who places it</td><td>The shell &mdash; a page adds nothing</td><td>You, as the last child of the scrolling panel</td></tr>
              <tr><td>Focus after the jump</td><td>Moves to the main landmark (<code>preventScroll</code>) before scrolling, when the button had focus</td><td>Falls to the document body when the button unrenders &mdash; yours to hand on</td></tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ scrollTopSnippet }}</code></pre>
        <p>
          One gap the library leaves open: focus. <code>p-scrolltop</code> removes its button once the panel is back
          at the top, and the browser drops focus to the document body with it. The component has no output for the
          moment, but its click bubbles to the host, which is where the snippet hands focus to the panel's heading
          &mdash; the same move the kit FAB makes for the page, where focus goes to the main landmark.
        </p>
        <p class="src-note">
          Kit column from <code>src/app/components/shared/scroll-to-top-fab.component.ts</code> and its mount in
          <code>src/app/app.component.ts</code>; library column from <code>openng-optimus-ui-scrolltop.mjs</code>
          &mdash; inputs <code>:79-131</code>, the scroll call <code>:168-174</code>, sticky versus fixed
          <code>:177</code>, parent listener <code>:198-203</code>, the removal after the leave motion
          <code>:184-197</code>, the unnamed button <code>:245</code> &mdash; and the fixed and sticky rules in
          <code>&#64;openng/optimus-ui-styles/dist/scrolltop/index.mjs</code>.
        </p>

        <h3>Checking it without a browser</h3>
        <pre class="code-block"><code>{{ checkSnippet }}</code></pre>
        <p>
          The first two answer the questions that have no runtime error attached: whether every
          entry in the list has a target, and whether the id in the component is the id in the
          data. The third is the reuse question &mdash; a block you are about to hand-build may
          already exist, and <strong>UI Pattern Selection</strong> is where that decision is made.
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>&#9744; One <code>&lt;app-lesson-template&gt;</code>, one <code>h1</code>, one progress bar &mdash; all of them the template&#39;s.</li>
          <li>&#9744; <code>meta.id</code> is byte-identical to the article id in the core data.</li>
          <li>&#9744; Every <code>tocItems</code> entry has an element with that id.</li>
          <li>&#9744; The list is non-empty by the time the template reaches <code>ngAfterViewInit</code>.</li>
          <li>&#9744; The labels survive a language switch.</li>
          <li>&#9744; No heading level is skipped between the <code>h1</code> and the deepest block.</li>
          <li>&#9744; Every code block, table, and fixed-width figure scrolls inside itself.</li>
          <li>&#9744; At 360px nothing is cut off at the column edge.</li>
          <li>&#9744; No page-level back-to-top button; a <code>p-scrolltop</code> only inside a scrolling panel, with <code>target="parent"</code>, a translated name, <code>scrollBehavior()</code>, and a focus handoff.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          The frame translates itself. The one part of the layout that does not is the table of
          contents, because it is handed over as finished text rather than as keys.
        </p>

        <h3>Who translates what</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Comes from</th><th>Reacts to a language switch</th></tr>
            </thead>
            <tbody>
              <tr><td>Title, subtitle, category chip, difficulty chip</td><td>Keys in <code>meta</code>, translated by the template</td><td>Yes</td></tr>
              <tr><td>Back link, share labels, progress label, the words around the footers</td><td>The template&#39;s own keys</td><td>Yes</td></tr>
              <tr><td>Reading time</td><td><code>meta.readingTime</code>, printed as given</td><td>No &mdash; it is a literal, unit included</td></tr>
              <tr><td>Publish and scheduled dates</td><td>Formatted against the reader locale</td><td>Yes</td></tr>
              <tr><td>Table-of-contents labels</td><td>Your array, as plain strings</td><td>Only if you rebuild it</td></tr>
              <tr><td>Block titles and body copy</td><td>Your keys, resolved where you call the translation</td><td>Depends on how you bound them</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Which strings the frame owns, and the locale-aware date formatting, from
          <code>src/app/components/shared/lesson-template.component.ts</code>.
        </p>

        <h3>Two shipped ways to keep the list current</h3>
        <p>
          A getter returns freshly translated labels on every check &mdash; shortest to write,
          and it allocates a new array each time the page is checked. A field rebuilt from a
          language-change subscription keeps a stable reference and costs one subscription and one
          teardown. Both are in the tree, both are correct, and the choice is a change-detection
          one rather than a translation one. What is not optional is doing one of them: a list
          built once in a constructor is frozen in the language the reader arrived in.
        </p>
        <pre class="code-block"><code>{{ tocSnippet }}</code></pre>
        <p class="src-note">
          The getter form is the blueprint page under
          <code>src/app/pages/articles/seed-article-1/</code>; the subscription form is used by
          the worked pages beside it under <code>src/app/pages/articles/</code>.
        </p>

        <h3>What longer text does to this layout</h3>
        <p>
          The body column is not the pressure point &mdash; prose reflows. The toolbar is. Its
          meta chips wrap onto further rows as a group, and the text inside a chip wraps too, so a
          long category or difficulty label first makes its own chip taller. At the narrowest step
          of the ladder that stops: the text stops wrapping and is ellipsized at the chip&#39;s
          edge, so a truncated label at least announces itself. The table-of-contents panel
          behaves the same way at a fixed cap rather than at a breakpoint, on every viewport
          &mdash; which is where a section name that only differs at its end stops being
          readable. An ellipsis marks the loss but does not undo it: keep both short in every
          language, and treat that as a budget rather than a preference. Where those budgets are written
          down, how a key is named, and what a reader sees when it is missing are
          <strong>I18n &amp; Localization</strong>; which scripts the font stack can actually
          render is <strong>Typography</strong>.
        </p>
        <p class="src-note">
          Chip wrapping and the 360px ellipsis from the <code>.meta-item</code> and
          <code>.meta-text</code> rules in
          <code>src/app/components/shared/lesson-template.component.ts</code>; the panel&#39;s
          ellipsis from the <code>.item-text</code> rule in
          <code>src/app/components/shared/table-of-contents-fab.component.ts</code> &mdash; the
          pattern the chips adopted.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.7</strong> &mdash; 2026-09-23 &mdash; Synced with the same day's fixes: the kit FAB now hands
            focus to the main landmark (new comparison row), and <code>scrollBehavior()</code> returns
            <code>'auto' | 'smooth'</code>, so the example and the snippet pass it without narrowing.</li>
          <li><strong>v0.6</strong> &mdash; 2026-09-23 &mdash; The guide now covers <code>p-scrolltop</code>: its
            contract in the agent doc, a live panel example, and a Development comparison with the kit's own
            <code>app-scroll-to-top-fab</code> &mdash; the page's back-to-top is the shell's, the library component is
            for a panel with its own scroll, with a translated name, reduced-motion behavior, and a focus
            handoff.</li>
          <li><strong>v0.5</strong> &mdash; 2026-09-02 &mdash; Re-verified on Angular 22.1.4 / Optimus UI 2.0.2 (ADR-0014): the table-of-contents registration, the column clip, and the projection rules cite no library or framework source line; pin moved to 22.1.4, nothing this guide measures changed.</li>
          <li><strong>v0.4</strong> &mdash; 2026-08-24 &mdash; Re-verified after the upgrade to
            Angular 22.1.3 / PrimeNG 22.1: the table-of-contents registration still runs once in
            <code>ngAfterViewInit</code> behind the length guard, the column still clips at
            <code>overflow-x: hidden</code>, and the progress bar is unchanged. Nothing in this
            layout moved; provenance pin raised.</li>
          <li><strong>v0.3</strong> &mdash; 2026-08-20 &mdash; The template caught up with two
            findings: the 360px chip clip now draws an ellipsis &mdash; the text moved into a
            <code>.meta-text</code> flex item, the pattern <code>.item-text</code> already used
            &mdash; and the Easy-Language dialog receives the same content type the registry
            check computes from <code>focus</code>, instead of a hard-coded <code>page</code>.</li>
          <li><strong>v0.2</strong> &mdash; 2026-08-18 &mdash; Corrections pass. The page skeleton
            and the region table are restated in document order, with the progress bar where the
            template writes it &mdash; after the toolbar &mdash; and its viewport-fixed painting
            named as the reason the two orders differ. <code>titleKey</code> is unconditionally
            required and <code>title</code> is described as what it is, the optional static
            fallback. <code>meta.difficulty</code> joins the input table as the one field that is
            required and never read. The chip behavior under 360px is corrected: the text wraps,
            and the clip that ends it draws no ellipsis, which makes the chips a stricter
            translation budget than an ellipsis would. The breakpoint ladder gains the chip step
            it lost at 480px, and the 768px row no longer says the column padding drops when only
            its sides do. <code>app-definition</code> is recorded as emitting fixed
            <code>h3</code>s beside the title it levels. The copied-stylesheet pitfall is restated
            as a rule about scope rather than a claim about unused rules, and
            <strong>Design Tokens</strong> and <strong>I18n &amp; Localization</strong>, already
            routed to in the text, become reciprocal <code>related</code> entries.</li>
          <li><strong>v0.1</strong> &mdash; 2026-08-18 &mdash; Initial guide: the two ownership
            bands of an article page, the render order of the frame, the inputs the template
            needs and what each drives, the heading level every shipped block emits, the two
            outline idioms, the column and its clipping, the frame&#39;s breakpoint ladder, the
            three files a page is joined from, and the table of contents as the one part of the
            layout that does not translate itself.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ArticleLayoutArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Live example: p-scrolltop inside a scrolling panel -------------------
  readonly stThreshold = 120;
  readonly stRows = Array.from(
    { length: 14 },
    (_, i) => `Entry ${14 - i}: a short note, repeated so the panel has something to scroll.`,
  );

  /** Read on every check, so a reduced-motion preference changed at runtime applies to the next click. */
  stBehavior(): 'auto' | 'smooth' {
    // The helper returns exactly p-scrolltop's `behavior` type; no narrowing needed.
    return scrollBehavior();
  }

  readonly scrollTopSnippet: string = "import { ScrollTop } from '@openng/optimus-ui/scrolltop';\n" +
    "import { scrollBehavior } from '../../utils/reduced-motion';\n" +
    '\n' +
    '<!-- A panel with its own scroll. The page itself needs nothing: the shell\n' +
    '     already renders app-scroll-to-top-fab for the window. -->\n' +
    '<div class="log" role="region" aria-labelledby="log-title" tabindex="0">\n' +
    '  <h3 id="log-title" tabindex="-1" #logTitle>{{ t(\'log.title\') }}</h3>\n' +
    '  <!-- … long content … -->\n' +
    '  <p-scrolltop\n' +
    '    target="parent"\n' +
    '    [buttonAriaLabel]="t(\'log.backToTop\')"\n' +
    '    [behavior]="behavior()"\n' +
    '    (click)="logTitle.focus({ preventScroll: true })"\n' +
    '  />\n' +
    '</div>\n' +
    '\n' +
    '/* The panel needs a height and its own scroll. */\n' +
    '.log { max-height: 20rem; overflow-y: auto; }\n' +
    '\n' +
    "// The helper returns 'auto' | 'smooth', exactly p-scrolltop's behavior type:\n" +
    '// readonly behavior = scrollBehavior;';

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly pageSnippet: string = '<!-- The template: one wrapper, and your body inside it. -->\n' +
    '<app-lesson-template [meta]="meta" [tocItems]="tocItems">\n' +
    '\n' +
    '  <!-- Opening paragraphs carry no heading of their own. -->\n' +
    '  <section id="lead" class="article-section">\n' +
    '    <p class="lead-text">{{ t("articleExample.lead") }}</p>\n' +
    '  </section>\n' +
    '\n' +
    '  <!-- A topic section: your h2, blocks at their default level 3. -->\n' +
    '  <section id="repository" class="article-section">\n' +
    '    <h2>{{ t("articleExample.repository.title") }}</h2>\n' +
    '    <app-standard-container [config]="boxConfig">\n' +
    '      <p>{{ t("articleExample.repository.text") }}</p>\n' +
    '    </app-standard-container>\n' +
    '  </section>\n' +
    '\n' +
    '  <!-- The closing block. Its title comes from the component. -->\n' +
    '  <section id="quiz" class="article-section">\n' +
    '    <app-quiz-container quizId="art-example-quiz"\n' +
    '                        [titleKey]="\'articleExample.quiz.title\'"\n' +
    '                        [questions]="questions" />\n' +
    '  </section>\n' +
    '\n' +
    '</app-lesson-template>\n' +
    '\n' +
    '// The class behind it.\n' +
    'export class ArtExampleComponent implements OnInit {\n' +
    '  // id MUST equal the article id in the core data, or the footers vanish.\n' +
    '  meta: LessonMeta = {\n' +
    '    id: "art-example", titleKey: "articleExample.hero.title",\n' +
    '    readingTime: "8 min", difficulty: "beginner",\n' +
    '    difficultyKey: "articles.difficulty.beginner", focus: "theory",\n' +
    '  };\n' +
    '\n' +
    '  // Every id below must exist in the template above.\n' +
    '  tocItems: TocItem[] = [];\n' +
    '\n' +
    '  ngOnInit(): void {\n' +
    '    // Populated here, before the template registers the floating button.\n' +
    '    this.buildToc();\n' +
    '  }\n' +
    '}';

  readonly checkSnippet: string = '# Does every table-of-contents id have a target in the same file?\n' +
    'grep -o "id: .[a-z-]*." src/app/pages/articles/art-example/*.ts\n' +
    'grep -o "section id=\\"[a-z-]*\\"" src/app/pages/articles/art-example/*.ts\n' +
    '\n' +
    '# Does the component id match the data the footers are read from?\n' +
    'grep -n "id:" src/app/pages/articles/art-example/*.ts\n' +
    'ls src/assets/data/core/articles/\n' +
    '\n' +
    '# Does the block you are about to build already exist?\n' +
    'node scripts/design-guides.mjs list --layer kit';

  readonly tocSnippet: string = '// A: a getter. Always current, allocates on every check.\n' +
    'get tocItems(): TocItem[] {\n' +
    '  return [{ id: "lead", label: this.t("articleExample.toc.lead") }];\n' +
    '}\n' +
    '\n' +
    '// B: a field, rebuilt when the language changes. Stable reference.\n' +
    'tocItems: TocItem[] = [];\n' +
    '\n' +
    'ngOnInit(): void {\n' +
    '  this.buildToc();\n' +
    '  this.translation.languageChanged\n' +
    '    .pipe(takeUntilDestroyed(this.destroyRef))\n' +
    '    .subscribe(() => this.buildToc());\n' +
    '}';
}
