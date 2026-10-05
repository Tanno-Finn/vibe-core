import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
    :host { display: block; }
    .lead { font-size: 1.05rem; color: var(--text-color-secondary); margin: 0 0 var(--space-5); }

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
      margin: var(--space-3) 0 0;
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

    /* --- Three wrappers, one shared grid rule --- */
    .gd-row {
      display: flex; flex-wrap: wrap; align-items: flex-start;
      gap: var(--space-4); margin: 0 0 var(--space-4);
    }
    .gd-box {
      flex: 0 1 auto; min-width: 0;
      box-sizing: border-box;
      padding: var(--space-3);
      border: 1px solid var(--surface-border);
      border-radius: var(--radius-lg);
      background: var(--surface-card);
    }
    .gd-box--s { width: 9rem; }
    .gd-box--m { width: 19rem; }
    .gd-box--l { width: 26rem; max-width: 100%; }
    .gd-cap {
      margin: 0 0 var(--space-2);
      font-size: var(--font-size-sm); font-weight: var(--font-weight-medium);
      color: var(--text-color-secondary);
    }
    .gd-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(7rem, 100%), 1fr));
      gap: var(--space-3);
    }
    .gd-cell {
      padding: var(--space-3);
      border: 1px dashed var(--surface-border);
      border-radius: var(--radius-md);
      background: var(--surface-section);
      font-size: 0.8rem; color: var(--text-color); text-align: center;
    }

    /* --- Do / Don't --- */
    .dd { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin: 0 0 var(--space-4); }
    .dd__cell { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-4); border: 1px solid var(--surface-border); border-radius: var(--radius-lg); background: var(--surface-card); }
    .dd__cell--bad { border-left: 3px solid var(--semantic-red-fg, #b91c1c); }
    .dd__cell--good { border-left: 3px solid var(--semantic-green-fg, #15803d); }
    .dd__stage { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); padding: var(--space-4); border-radius: var(--radius-md); background: var(--surface-section); min-height: 3.5rem; }
    .dd__why { margin: 0; font-size: var(--font-size-sm); color: var(--text-color-secondary); }
    .dd__code { font-family: var(--font-mono); font-size: 0.8rem; overflow-wrap: anywhere; min-width: 0; white-space: pre-wrap; }
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
    .sources a { color: var(--primary-color-fg); }
  `;

/**
 * Guide article: Hub Layout (layouts).
 *
 * WHAT THE CLAIMS REST ON — the durable artifacts behind every rule in the
 * tabs. The per-page census that produced these conventions is commit-body
 * material and deliberately absent from the rendered text (guide-authoring:
 * "Provenance, not process", durability test 1):
 *   - The one hub template the kit ships:
 *     src/app/components/shared/content-hub-template.component.ts — its
 *     ContentHubConfig and ContentItem interfaces, the closed box (no
 *     ng-content), the hard-coded h2 card title, the three state branches
 *     (loading / load-failed with retry / no-match, their headings h2 like the
 *     cards), the card CTA as an <a pButton routerLink> described by
 *     its card title, the sr-only role="status" that reports the load and then
 *     the filtered count (common.resultCount, RESULT_ANNOUNCE_DELAY_MS 500 ms
 *     after the last change), and the .content-grid rule with its one @media
 *     collapse.
 *   - Its blueprint consumer: src/app/pages/demos-overview/, plus the route in
 *     src/app/app.routes.ts and the registry entry in
 *     src/assets/data/core/demos/index.json.
 *   - The page frame every hub shares: the single h1 in
 *     src/app/components/shared/page-header.component.ts.
 *   - The item contract: BaseIndexContentMeta in
 *     src/app/services/base-index-content.service.ts and DemoMeta in
 *     src/app/services/demos.service.ts — the same eight required fields, and
 *     the shareReplay(1) caches in both getAll implementations (self-resetting
 *     on error, so a retry re-fetches instead of replaying the failure).
 *   - The listing card the kit documents: app-generic-card, whose headingLevel
 *     input decides the tag and whose title is optional.
 *   - The container-width and spacing tokens in src/styles/design-tokens.scss.
 *     The $breakpoints map and respond-to() mixin documented by the design tab
 *     were deleted from that file on 2026-08-20 (never reachable); the section
 *     keeps the lesson as history.
 *   - Contrast figures are quoted from docs/generated/CONTRAST.MD, never
 *     eyedropped; re-quoted 2026-09-23 per visual style (ADR-0016).
 *
 * The `sentinel` binding keeps VIBE_DEV_SENTINEL referenced so the strip-proof
 * literal survives tree-shaking (dev-sentinel.ts).
 */
@Component({
  selector: 'app-hub-layout-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'hub-layout'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          A hub is the page that stands between a reader and a collection: a title, a way to
          narrow it down, and a grid of cards. The kit ships one template that is the whole page,
          and the parts that template is made of are the same parts a hand-composed hub has to
          assemble itself.
        </p>

        <h3>The four parts, in the order they render</h3>
        <p>
          Nothing here is optional in the sense of being skippable &mdash; a hub without a filter
          region is a hub with an empty filter region, and a hub without the third band still has
          to decide what appears when the grid is empty.
        </p>
        <div class="skel">
          <div class="skel__band">
            <span class="skel__cap">the page</span>
            <div class="skel__row">header &mdash; the one h1, a standfirst, nothing else</div>
            <div class="skel__row">filters &mdash; search, chips, sort; then one polite status region</div>
            <div class="skel__band skel__band--body">
              <span class="skel__cap">the collection band &mdash; exactly one of these renders</span>
              <div class="skel__row">skeletons, while the index is in flight</div>
              <div class="skel__row">the card grid</div>
              <div class="skel__row">nothing matched &mdash; or nothing loaded</div>
            </div>
          </div>
        </div>
        <p class="src-note">
          Part order, the status region outside the branches, and the mutual exclusion of the
          collection band read from
          <code>src/app/components/shared/content-hub-template.component.ts</code>; the single
          <code>h1</code> from <code>src/app/components/shared/page-header.component.ts</code>.
        </p>

        <h3>One recipe, three widths</h3>
        <p>
          All three grids below carry identical markup and one shared rule. Only the width of
          their wrapper differs, and the track count follows from the arithmetic rather than from
          any breakpoint &mdash; there is no media query in this example at all. The floor here is
          smaller than a real hub would use so that all three fit side by side.
        </p>
        <div class="gd-row">
          <div class="gd-box gd-box--s">
            <div class="gd-cap">narrow</div>
            <div class="gd-grid">
              <div class="gd-cell">card</div><div class="gd-cell">card</div>
              <div class="gd-cell">card</div><div class="gd-cell">card</div>
            </div>
          </div>
          <div class="gd-box gd-box--m">
            <div class="gd-cap">medium</div>
            <div class="gd-grid">
              <div class="gd-cell">card</div><div class="gd-cell">card</div>
              <div class="gd-cell">card</div><div class="gd-cell">card</div>
            </div>
          </div>
          <div class="gd-box gd-box--l">
            <div class="gd-cap">wide</div>
            <div class="gd-grid">
              <div class="gd-cell">card</div><div class="gd-cell">card</div>
              <div class="gd-cell">card</div><div class="gd-cell">card</div>
            </div>
          </div>
        </div>
        <p>
          In the wide grid the last row is short, and the empty tracks stay &mdash; that is
          <code>auto-fill</code> &mdash; so the card keeps its track width rather than growing
          across the row. <code>1fr</code> as the track maximum makes every track equal and
          absorbs the leftover space, which is why the recipe needs no rule for a ragged last
          row. <code>auto-fit</code> is the option that collapses those empty tracks.
        </p>
        <p class="src-note">
          The rule demonstrated is the <code>.content-grid</code> declaration in
          <code>src/app/components/shared/content-hub-template.component.ts</code>, with a smaller
          track floor.
        </p>

        <h3>The three states a collection has</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>State</th><th>The condition that identifies it</th><th>What the reader gets</th></tr>
            </thead>
            <tbody>
              <tr><td>Loading</td><td>an explicit flag, set before the request</td><td>Skeletons, plus one status region saying so</td></tr>
              <tr><td>Nothing loaded</td><td>the load failed, whatever the count is</td><td>An error and a retry &mdash; never a filter hint</td></tr>
              <tr><td>Nothing matched</td><td>data arrived AND the filtered list is empty</td><td>An empty state and a control that clears the filters</td></tr>
              <tr><td>Populated</td><td>the filtered list is non-empty</td><td>The grid, and the count announced</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Two of these are routinely collapsed into one. Deriving &ldquo;loading&rdquo; from an
          empty collection is the version that cannot be recovered from: a load that fails leaves
          the collection empty forever, so the page shimmers for as long as it is open.
        </p>
        <p>
          The template covers all four rows: its status region says the load is in flight or has
          failed, and once the data has landed it announces how many cards the filters left,
          trailing the last filter change by half a second so typing in the search field yields
          one announcement rather than one per keystroke.
        </p>
        <p class="src-note">
          The state set reads from
          <code>src/app/components/shared/content-hub-template.component.ts</code>, which ships
          all three branches: a <code>loadFailed</code> flag renders the error-and-retry band,
          separate from the no-match state and its clear-filters control; its
          <code>role=&quot;status&quot;</code> region shows the loading and load-failed messages,
          then the <code>common.resultCount</code> sentence, delayed by
          <code>RESULT_ANNOUNCE_DELAY_MS</code> (500&nbsp;ms).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Delegating to the template means writing one config object and one mapping. Neither is
          long; both are where hubs go wrong, because the type accepts more than the component
          reads and drops more than it warns about.
        </p>

        <h3>What the template takes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Field</th><th>Required by the type</th><th>What it drives</th></tr>
            </thead>
            <tbody>
              <tr><td><code>titleKey</code></td><td>Yes</td><td>The <code>h1</code>, and the header region label</td></tr>
              <tr><td><code>subtitleKey</code></td><td>Yes</td><td>The standfirst under the title</td></tr>
              <tr><td><code>ctaLabelKey</code></td><td>Yes</td><td>The label on every card&#39;s one button</td></tr>
              <tr><td><code>fromParam</code></td><td>No</td><td>A query parameter appended to every card link</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off the <code>ContentHubConfig</code> interface and every use of it in
          <code>src/app/components/shared/content-hub-template.component.ts</code>. Every field
          the type demands is consulted &mdash; two it once demanded and never read
          (<code>contentType</code>, <code>icon</code>) were dropped from the interface.
        </p>

        <h3>What one item carries</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Field</th><th>Required</th><th>What appears if you carry it</th></tr>
            </thead>
            <tbody>
              <tr><td><code>id</code>, <code>path</code></td><td>Yes</td><td>The track key and the card&#39;s destination</td></tr>
              <tr><td><code>titleKey</code>, <code>descriptionKey</code></td><td>Yes</td><td>The card heading and its clamped body</td></tr>
              <tr><td><code>category</code></td><td>Yes</td><td>A meta chip, and one axis of the chip filter</td></tr>
              <tr><td><code>difficulty</code></td><td>No</td><td>A severity tag, and the second filter axis</td></tr>
              <tr><td><code>estimatedTime</code></td><td>No</td><td>A meta chip, and the third sort order</td></tr>
              <tr><td><code>featured</code></td><td>No</td><td>A tag, a border, and the default sort order</td></tr>
              <tr><td><code>draft</code>, <code>publishDate</code></td><td>No</td><td>The draft and scheduled tags</td></tr>
              <tr><td><code>icon</code>, <code>tags</code></td><td>No</td><td>The card icon; nothing yet for tags</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The mapping is the whole risk surface. Every one of these is a field your own record
          type probably already has under the same name, and a field left out of the mapping is
          not an error anywhere &mdash; it is a badge that silently never renders and a filter axis
          that silently never appears.
        </p>
        <p class="src-note">
          Field meanings from the <code>ContentItem</code> interface and the card markup in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; the index
          record types require more &mdash; <code>BaseIndexContentMeta</code> in
          <code>src/app/services/base-index-content.service.ts</code> also requires
          <code>estimatedTime</code>, <code>difficulty</code> and <code>featured</code>, which
          <code>ContentItem</code> leaves optional.
        </p>

        <h3>Do / Don&#39;t</h3>
        <p class="src-note">
          The derivation rule from Angular&#39;s signal-tracking contract; the state set and the
          card element from <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; derive from a plain input</span>
            <div class="dd__stage"><code class="dd__code">{{ badDerive }}</code></div>
            <p class="dd__why">
              A computed tracks the signals it reads while computing. An input array is not one,
              so this caches its first result &mdash; taken while the collection was still empty
              &mdash; and never recomputes.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; derive from a signal</span>
            <div class="dd__stage"><code class="dd__code">{{ goodDerive }}</code></div>
            <p class="dd__why">
              One signal read inside the derivation is enough to make it live. The filter options
              then appear when the data does, instead of staying at whatever the skeleton pass saw.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; one state for everything</span>
            <div class="dd__stage"><code class="dd__code">{{ badStates }}</code></div>
            <p class="dd__why">
              Emptiness is the symptom of three different causes. Told to try a different filter,
              a reader whose request failed changes filters that were never the problem.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; one condition per cause</span>
            <div class="dd__stage"><code class="dd__code">{{ goodStates }}</code></div>
            <p class="dd__why">
              The failure flag comes from the loader, not from the count, so a failed load is
              never mistaken for a load in progress or for a filter that matched nothing.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don&#39;t &mdash; a card that acts like a link</span>
            <div class="dd__stage"><code class="dd__code">{{ badCard }}</code></div>
            <p class="dd__why">
              Keyboard activation is the easy half. The half no handler restores is the URL:
              middle-click, open in a new tab, copy link, and the address preview on hover.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; a card that is a link</span>
            <div class="dd__stage"><code class="dd__code">{{ goodCard }}</code></div>
            <p class="dd__why">
              One element carries the destination, the focus, and the name. Nothing inside it needs
              a tabindex, and the heading stays a heading rather than becoming the label.
            </p>
          </div>
        </div>
        <p class="src-note">
          The template meets these rules itself, so a hub that delegates inherits them: the
          card&#39;s one CTA is an <code>&lt;a pButton&gt;</code> with <code>routerLink</code> —
          a real link with an <code>href</code> in the prerendered HTML — described by its card
          title through <code>aria-describedby</code>, and the load-failed and no-match headings
          are <code>h2</code>, the level of the card titles they replace. Read from the card and
          state markup in <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>

        <h3>Sources</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/css-grid-2/" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; CSS Grid Layout Module Level 2</a
            >
            &mdash; repeat-to-fill: with <code>auto-fill</code>, one repetition when any number would overflow.
          </li>
          <li>
            <a href="https://angular.dev/guide/signals" target="_blank" rel="noopener noreferrer"
              >Angular &mdash; Signals guide</a
            >
            &mdash; only signals read during a derivation are tracked, and the value is cached.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            &mdash; a result count is a status message and must arrive without moving focus.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; WAI-ARIA APG, Button pattern</a
            >
            &mdash; a toggle button carries <code>aria-pressed</code>; a control that navigates is a link.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The grid is four declarations, and the number of columns is not one of them. Everything
          else on this page &mdash; the ground the cards sit on, the width the page stops at
          &mdash; is a token decision that has already been made.
        </p>

        <h3>The track recipe, declaration by declaration</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Declaration</th><th>Value in the shipped grid</th><th>What it decides</th></tr>
            </thead>
            <tbody>
              <tr><td><code>display</code></td><td><code>grid</code></td><td>That the row is filled by placement, not by wrapping</td></tr>
              <tr><td>repetition</td><td><code>auto-fill</code></td><td>As many tracks as fit; empty ones stay</td></tr>
              <tr><td>track floor</td><td><code>min(320px, 100%)</code></td><td>The card&#39;s narrowest useful width, capped by the container</td></tr>
              <tr><td>track ceiling</td><td><code>1fr</code></td><td>That every track is equal and no leftover space remains</td></tr>
              <tr><td><code>gap</code></td><td><code>var(--space-6)</code></td><td>The rhythm, from the spacing scale rather than a literal</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>auto-fill</code> and <code>auto-fit</code> differ only once the items run out:
          <code>auto-fit</code> collapses the empty tracks, so four cards in a five-track row grow
          to share the whole width. Neither is wrong; a hub whose card count varies wildly reads
          more calmly with <code>auto-fill</code>, because the card width stops depending on how
          many results the filter left.
        </p>
        <p class="src-note">
          Values from the <code>.content-grid</code> rule in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; the spacing
          token from <code>src/styles/design-tokens.scss</code>.
        </p>

        <h3>The column ladder those numbers produce</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Width of the grid&#39;s content box</th><th>Tracks</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr><td>under 664px</td><td>1</td><td>Two tracks plus one gap need 664px</td></tr>
              <tr><td>664px to 1007px</td><td>2</td><td>Three tracks plus two gaps need 1008px</td></tr>
              <tr><td>1008px and up</td><td>3</td><td>Four would need 1352px, past the container cap</td></tr>
              <tr><td>viewport at or below 768px</td><td>1</td><td>The one media query overrides the arithmetic</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The ceiling is the interesting row. The page stops at the section container width, and
          after its horizontal padding the grid never gets enough room for a fourth track &mdash;
          so this recipe is a three-column layout that behaves intrinsically, not a layout with
          three breakpoints. The media query is not redundant either: between roughly 728px and
          768px of viewport the arithmetic alone would give two narrow columns, and the query
          chooses one wide one instead.
        </p>
        <p>
          That query is a viewport query, and deliberately so &mdash; which is the opposite of the
          rule <strong>Demo Layout</strong> gives for a demo. The two are not in conflict:
          a demo is mounted at several widths, so it must ask about itself,
          while a hub <em>is</em> the page and its grid is as wide as the window allows. A hub
          embedded inside a narrower column is the case where that stops being true, and there the
          question to ask is the container&#39;s.
        </p>
        <p class="src-note">
          Computed from the track floor, the <code>gap</code> and the container cap declared in
          <code>src/app/components/shared/content-hub-template.component.ts</code> together with
          the container tokens in <code>src/styles/design-tokens.scss</code>, at a 16px root. The
          viewport figures include the app shell&#39;s own horizontal padding
          (<code>.content-container</code> in <code>src/app/app.component.ts</code>) on top of the
          hub&#39;s.
        </p>

        <h3>Text on a card, and on a card under the pointer</h3>
        <p>
          A hub has more surface than any other page shape, and its grounds are not equally
          safe. Card text passes comfortably; the same muted color on the hover tone keeps the
          thinnest margin. The template&#39;s own card stays on <code>--surface-card</code> and
          only lifts its shadow on hover; a hand-composed card that paints
          <code>--surface-hover</code> is held to the third row.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Pair</th><th>werkbund, light / dark</th><th>All four styles, lowest</th><th>Criterion</th></tr>
            </thead>
            <tbody>
              <tr><td><code>--text-color</code> on <code>--surface-card</code></td><td>18.73:1 / 14.86:1</td><td>11.32:1 (skizzenbuch, dark)</td><td>SC 1.4.3, 4.5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> on <code>--surface-card</code></td><td>7.78:1 / 6.59:1</td><td>5.21:1 (blaupause, light)</td><td>SC 1.4.3, 4.5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> on <code>--surface-hover</code></td><td>6.47:1 / 5.91:1</td><td>4.55:1 (blaupause, light)</td><td>SC 1.4.3, 4.5:1</td></tr>
              <tr><td><code>--control-border</code> on <code>--surface-card</code></td><td>5.23:1 / 4.91:1</td><td>3.97:1 (blaupause, dark)</td><td>SC 1.4.11, 3:1</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Two consequences for a card grid. A meta line in <code>--text-color-secondary</code>
          clears the criterion on every ground in every visual style, but on the hover tone with a
          margin of hundredths &mdash; so the meta line must not carry information a reader could
          miss without noticing. And the card&#39;s own border, drawn with the decorative
          <code>--surface-border</code>, may separate cards visually, but nothing a reader must
          perceive &mdash; a selected state, a focus ring, a draft marker &mdash; can rest on it
          alone; an edge that identifies something interactive draws
          <code>--control-border</code>.
        </p>
        <p class="src-note">
          Figures quoted from the "body text" and "control boundary" rows of
          <code>docs/generated/CONTRAST.MD</code>, per visual style and mode; the card grounds
          from the <code>.content-card</code> rules in
          <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>

        <h3>What happens on a narrow screen</h3>
        <p>
          The grid becomes one column, in two independent ways: below 664px of content box the
          track arithmetic can only fit one, and at or below 768px of viewport the single media
          query forces one regardless. The <code>min(320px, 100%)</code> floor is what keeps the
          320px minimum from becoming an overflow &mdash; without it, one track wider than its
          container pushes the page sideways, because a grid with no room for even one repetition
          still lays out that one. The filter row stacks from a centered wrapping row into a column
          and the search field goes full width; the cards themselves do not truncate &mdash; the
          description is clamped to three lines at every width, and the title wraps.
          What the caller must do: nothing, if the hub is the page. A hub nested inside a narrower
          column needs its track floor lowered, because the floor is a fixed length and does not
          scale with its container.
        </p>
        <p class="src-note">
          Collapse behavior and the line clamp from the <code>.content-grid</code>,
          <code>.filters-section</code> and <code>.card-description</code> rules in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; the overflow
          fallback from CSS Grid Level 2.
        </p>

        <h3>The named breakpoint scale &mdash; deleted, and why the numbers are literals</h3>
        <p>
          The kit used to declare a breakpoint map and a mixin to use it, and no component could
          ever call either: component CSS lives in inline <code>styles</code> arrays, and there
          is no component stylesheet anywhere to import the token file from. Both were deleted on
          2026-08-20. Write the number as a literal &mdash; <code>768px</code> is the kit&#39;s
          one collapse step, and matching it is how a hub agrees with the rest of the kit rather
          than inventing a step of its own.
        </p>
        <p class="src-note">
          Former declaration site: <code>src/styles/design-tokens.scss</code>, which now carries
          the deletion note. Call sites under <code>src/app/</code>: none, before or since.
        </p>
        <pre class="code-block"><code>{{ deadApiSnippet }}</code></pre>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          A hub is one component, one data source, and one route. The component is short either
          way &mdash; delegated it is a config object and a mapping, hand-composed it is the four
          parts and their three states.
        </p>

        <h3>The files a hub is joined from</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Artifact</th><th>Where</th><th>Drives</th></tr>
            </thead>
            <tbody>
              <tr><td>The page component</td><td><code>src/app/pages/&lt;id&gt;/</code></td><td>The mapping, the load, the three states</td></tr>
              <tr><td>The route</td><td><code>src/app/app.routes.ts</code></td><td>The URL and the navigation entry</td></tr>
              <tr><td>The index</td><td><code>src/assets/data/core/&lt;kind&gt;/index.json</code></td><td>Every card on the page</td></tr>
              <tr><td>The service</td><td><code>src/app/services/</code></td><td>Fetching, caching, and the visibility gate</td></tr>
              <tr><td>The labels</td><td><code>src/assets/i18n/modules/&lt;lang&gt;/</code></td><td>Every string, including the chip labels</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The index and the routes have to agree in both directions. An index entry whose
          <code>path</code> matches no route is a card that leads to the not-found page; a route
          with no index entry is a page that exists but appears in no hub.
        </p>
        <p class="src-note">
          The split read from <code>src/app/pages/demos-overview/</code> together with the service
          and interface in <code>src/app/services/demos.service.ts</code>.
        </p>

        <h3>A hand-composed hub, minimal</h3>
        <p class="src-note">
          Shape follows the template in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; the page header
          is <code>src/app/components/shared/page-header.component.ts</code>.
        </p>
        <pre class="code-block"><code>{{ hubSnippet }}</code></pre>
        <p>
          Three things in it are structure rather than taste. The status region is outside the
          three branches, so it is present before the first of them renders and can therefore be
          updated rather than announced into existence. The failure flag comes from the loader and
          not from the count. And the grid rule names no column count anywhere.
        </p>

        <h3>Checking it without a browser</h3>
        <pre class="code-block"><code>{{ checkSnippet }}</code></pre>
        <p>
          The first two answer the questions that raise no error at runtime: whether the grid can
          overflow a narrow container, and whether every card leads somewhere the router knows.
          The third is the reuse question &mdash; the card you are about to hand-build may already
          be documented, and <strong>UI Pattern Selection</strong> is where that decision belongs.
        </p>

        <h3>Acceptance checklist</h3>
        <ul class="checklist">
          <li>&#9744; Exactly one <code>h1</code>, and it comes from the page header component.</li>
          <li>&#9744; Every card renders a real heading, one level below its grouping.</li>
          <li>&#9744; The empty state&#39;s heading is at the level the cards were.</li>
          <li>&#9744; Loading, load failure, and no-match are three separate conditions.</li>
          <li>&#9744; The result count is announced from one polite region, silent while loading.</li>
          <li>&#9744; Filter options and filtered items are derived from signals.</li>
          <li>&#9744; The track floor is wrapped in <code>min(&hellip;, 100%)</code>.</li>
          <li>&#9744; Nothing inside a card carries a hard-coded <code>id</code>.</li>
          <li>&#9744; Nothing is clipped at 320px, and no row scrolls sideways.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          A hub translates almost nothing itself. Its own chrome is already translated, its cards
          carry keys rather than text, and the one string it resolves by building the key at
          runtime is the one that can break in silence.
        </p>

        <h3>Who translates what</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Comes from</th><th>You supply</th></tr>
            </thead>
            <tbody>
              <tr><td>Search placeholder, sort labels, &quot;All&quot;</td><td>The shared chrome namespace</td><td>Nothing</td></tr>
              <tr><td>Empty state and its button</td><td>The shared chrome namespace</td><td>Nothing</td></tr>
              <tr><td>Difficulty tags and chips</td><td>A namespace keyed by the value</td><td>Nothing, for the three known values</td></tr>
              <tr><td>Page title and standfirst</td><td>Your keys, named in the config</td><td>Two keys</td></tr>
              <tr><td>Card title and description</td><td>Your keys, carried on each record</td><td>Two keys per item</td></tr>
              <tr><td>Category chips and meta</td><td>A namespace keyed by the value</td><td>One entry per category you invent</td></tr>
              <tr><td>Estimated time</td><td>The record, printed as given</td><td>The unit, inside the literal</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Which strings the frame owns read from the translate calls in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; the per-item
          keys from the <code>ContentItem</code> interface in the same file.
        </p>

        <h3>A category is a key fragment, not a label</h3>
        <p>
          The chip and the card meta do not print the category. They print the result of looking
          up a key built by concatenating a fixed prefix with the category value. Two things
          follow. A category nobody has translated renders as its own dotted path, in the chip and
          on every card carrying it. And the key gate cannot help: it resolves literal keys, and a
          key assembled at runtime is not one &mdash; it is skipped by design, because the prefix
          alone is not a resolvable path.
        </p>
        <p class="src-note">
          The concatenation from the category chip and meta markup in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; the
          literal-key requirement from <code>scripts/check-i18n-keys.mjs</code>.
        </p>
        <pre class="code-block"><code>{{ categorySnippet }}</code></pre>

        <h3>Where longer text pushes</h3>
        <p>
          The card is the tightest box on the page, and its narrowest width is the track floor, so
          that number is the translation budget: a title that does not fit wraps, and a card that
          grows taller stretches its whole row, so the slack lands inside the shorter cards
          rather than pushing anything sideways.
          The description is the forgiving part &mdash; it is clamped to three lines, so a
          translation twice the length of the original costs nothing visually and costs a reader
          the end of the sentence. The strict parts are the ones that cannot wrap gracefully: the
          filter chips, which wrap onto more rows and push the grid down, and the CTA label, which
          sits on a full-width button and is the same string on every card. Key naming, namespaces,
          and the simplified-language variants are <strong>I18n &amp; Localization</strong>.
        </p>
        <p class="src-note">
          The track floor and the three-line clamp from the <code>.content-grid</code> and
          <code>.card-description</code> rules in
          <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.9</strong> &mdash; 2026-09-23 &mdash; Synced with the template fixes of the same
            day: the card CTA is a real link, the state headings are <code>h2</code>, and the status region
            announces the filtered count, so the template now meets the rules it used to break.</li>
          <li><strong>v0.8</strong> &mdash; 2026-09-23 &mdash; Contrast table re-quoted from the
            compilat per visual style (the figures predated ADR-0016); the four-part skeleton no
            longer credits the template with a counting live region &mdash; its status region
            reports the load only &mdash; and the two template rules it does not meet itself (a
            <code>button</code> CTA with <code>routerLink</code>, <code>h3</code> state headings
            under <code>h2</code> cards) are named; the Demo Layout cross-reference follows that
            guide&#39;s re-base; annotated Sources close the Usage tab.</li>
          <li><strong>v0.7</strong> &mdash; 2026-09-02 &mdash; Re-verified on Angular 22.1.4 / Optimus UI 2.0.2 (ADR-0014): the card CTA's <code>pButtonLabel</code> / <code>pButtonIcon</code> directives exist in Optimus unchanged; pin moved to 22.1.4, nothing this guide measures changed.</li>
          <li><strong>v0.6</strong> &mdash; 2026-08-24 &mdash; Re-verified after the upgrade to
            Angular 22.1.3 / PrimeNG 22.1: the template stays a closed box with the same config
            and item fields, and its card CTA now uses the v22 <code>pButtonLabel</code> /
            <code>pButtonIcon</code> children. Nothing this guide states moved; provenance pin
            raised.</li>
          <li><strong>v0.5</strong> &mdash; 2026-08-20 &mdash; The unreachable breakpoint API
            (<code>$breakpoints</code>, <code>respond-to()</code>, <code>container()</code>) was
            deleted from the token file; the design-tab section records it as history and the
            rule stays: write the literal, on the kit&#39;s steps.</li>
          <li><strong>v0.4</strong> &mdash; 2026-08-20 &mdash; The shipped template caught up with
            the guide&#39;s own rules: <code>items</code> is a signal input, so the filter chips
            derive live instead of freezing at the skeleton pass; a <code>loadFailed</code> input
            and <code>retry</code> output separate the failed load from the no-match state; the
            skeleton grid collapses at the same 768px step as the card grid; the time sort
            normalizes to minutes instead of <code>parseInt</code>; and the never-read
            <code>contentType</code>/<code>icon</code> config fields were dropped.</li>
          <li><strong>v0.3</strong> &mdash; 2026-08-19 &mdash; Contrast figures refreshed from the
            regenerated compilat after the foundations token decisions: the secondary-text rows
            now pass (re-shade to <code>#6b7280</code>), and the border row shows
            <code>--control-border</code>, the token a control edge draws since the split.</li>
          <li><strong>v0.2</strong> &mdash; 2026-08-19 &mdash; Review pass: the Examples demo
            described as the <code>auto-fill</code> it declares, the column thresholds computed
            with the app shell&#39;s padding, the template&#39;s chip promise scoped to axes with
            more than one value, and the hand-composed recipe split at a marked
            template/styles boundary.</li>
          <li><strong>v0.1</strong> &mdash; 2026-08-18 &mdash; Initial guide: the four parts a hub
            page is made of, the one template that ships for it and the two config fields it never
            reads, the mapping as the place badges go missing, the intrinsic track recipe and the
            three-column ladder it produces, the three data states that are routinely collapsed
            into one, the derivation that freezes when it reads a plain input, the card that is a
            link rather than a button, the muted-text pair that fails on the hover ground, and the
            category value that is a key fragment the gate cannot check.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class HubLayoutArticleComponent {
  /** Strip-proof sentinel; rendered so the optimizer cannot drop it (D2). */
  readonly sentinel = VIBE_DEV_SENTINEL;

  // --- Flat string constants: these resolve wherever the tab is read ---------

  readonly badDerive: string = '@Input() items: Item[] = [];\n' +
    '\n' +
    '// Reads no signal, so it never becomes dirty.\n' +
    'categories = computed(() =>\n' +
    '  [...new Set(this.items.map(i => i.category))]);';

  readonly goodDerive: string = 'items = input.required<Item[]>();\n' +
    '\n' +
    '// Reads a signal, so it tracks it.\n' +
    'categories = computed(() =>\n' +
    '  [...new Set(this.items().map(i => i.category))]);';

  readonly badStates: string = 'loading = computed(() => this.items().length === 0);\n' +
    '\n' +
    '// A failed load leaves items empty, so this never ends.\n' +
    '// And the one empty branch tells every reader to\n' +
    '// change a filter, whatever actually went wrong.';

  readonly goodStates: string = 'loadFailed = signal(false);\n' +
    'loading = computed(() =>\n' +
    '  this.items().length === 0 && !this.loadFailed());\n' +
    '\n' +
    '// no match  = !loading() && !loadFailed()\n' +
    '//             && filtered().length === 0';

  readonly badCard: string = '<div class="card" role="button" tabindex="0"\n' +
    '     (click)="go(item)" (keydown.enter)="go(item)">\n' +
    '  <span class="card-title">{{ t(item.titleKey) }}</span>\n' +
    '</div>';

  readonly goodCard: string = '<a class="card" [routerLink]="[\'/\' + item.path]">\n' +
    '  <h3 class="card-title">{{ t(item.titleKey) }}</h3>\n' +
    '  <p class="card-desc">{{ t(item.descriptionKey) }}</p>\n' +
    '</a>';

  readonly deadApiSnippet: string = '// src/styles/design-tokens.scss - never callable, deleted 2026-08-20.\n' +
    '$breakpoints: (\n' +
    '  \'xs\': 0, \'sm\': 576px, \'md\': 768px,\n' +
    '  \'lg\': 992px, \'xl\': 1200px, \'2xl\': 1400px\n' +
    ');\n' +
    '@mixin respond-to($breakpoint) { ... }\n' +
    '\n' +
    '// It never had a caller: component CSS is an inline styles: []\n' +
    '// array, and there is no component stylesheet to import from.\n' +
    '// Write the number, and keep it on the kit steps:\n' +
    '//   768px for the one-column collapse, 480px below it.';

  readonly hubSnippet: string = '<!-- One h1, one filter region, one collection band. -->\n' +
    '<app-page-header [titleKey]="\'myHub.title\'"\n' +
    '                 [subtitleKey]="\'myHub.subtitle\'" />\n' +
    '\n' +
    '<div class="hub-filters" role="search"\n' +
    '     [attr.aria-label]="t(\'common.searchAndFilter\')">\n' +
    '  <input type="text" pInputText [ngModel]="query()"\n' +
    '         (ngModelChange)="query.set($event)"\n' +
    '         [attr.aria-label]="t(\'common.search\')" />\n' +
    '</div>\n' +
    '\n' +
    '<!-- Outside the branches: present before the first one is. -->\n' +
    '<p class="sr-only" role="status" aria-live="polite"\n' +
    '   [attr.aria-busy]="loading() ? \'true\' : null">\n' +
    '  {{ statusLine() }}\n' +
    '</p>\n' +
    '\n' +
    '@if (loading()) {\n' +
    '  <div class="hub-grid">... skeletons, aria-hidden ...</div>\n' +
    '} @else if (loadFailed()) {\n' +
    '  <div class="hub-state" role="alert">\n' +
    '    <h2>{{ t(\'myHub.loadFailed\') }}</h2>\n' +
    '    <p-button [label]="t(\'myHub.retry\')" (onClick)="retry()" />\n' +
    '  </div>\n' +
    '} @else if (filtered().length === 0) {\n' +
    '  <div class="hub-state">\n' +
    '    <h2>{{ t(\'common.noResults\') }}</h2>\n' +
    '    <p-button [label]="t(\'common.clearFilters\')"\n' +
    '              (onClick)="clearFilters()" />\n' +
    '  </div>\n' +
    '} @else {\n' +
    '  <div class="hub-grid">\n' +
    '    @for (item of filtered(); track item.id) {\n' +
    '      <a class="hub-card" [routerLink]="[\'/\' + item.path]">\n' +
    '        <h2 class="hub-card-title">{{ t(item.titleKey) }}</h2>\n' +
    '        <p>{{ t(item.descriptionKey) }}</p>\n' +
    '      </a>\n' +
    '    }\n' +
    '  </div>\n' +
    '}\n' +
    '\n' +
    '/* --- below: the component\'s styles: [ ] array, not template --- */\n' +
    '/* The grid names no column count. */\n' +
    '.hub-grid {\n' +
    '  display: grid;\n' +
    '  grid-template-columns:\n' +
    '    repeat(auto-fill, minmax(min(320px, 100%), 1fr));\n' +
    '  gap: var(--space-6);\n' +
    '}\n' +
    '@media (max-width: 768px) {\n' +
    '  .hub-grid { grid-template-columns: 1fr; }\n' +
    '}';

  readonly checkSnippet: string = '# Can any track floor overflow a narrow container?\n' +
    'grep -n "minmax(" src/app/pages/my-hub/*.ts\n' +
    '\n' +
    '# Does every card path resolve to a route?\n' +
    'grep -n "\\"path\\"" src/assets/data/core/*/index.json\n' +
    'grep -n "path:" src/app/app.routes.ts\n' +
    '\n' +
    '# Does the card you are about to build already exist?\n' +
    'node scripts/design-guides.mjs list --layer kit';

  readonly categorySnippet: string = '<!-- The value is half a key, so an untranslated\n' +
    '     category renders as "categories.my-new-topic". -->\n' +
    '<span class="meta">{{ t("categories." + item.category) }}</span>\n' +
    '\n' +
    '# The gate resolves literal keys only, and skips this one:\n' +
    'node scripts/check-i18n-keys.mjs\n' +
    '\n' +
    '# So check the values yourself, against the module:\n' +
    'grep -n "\\"category\\"" src/assets/data/core/*/index.json';
}
