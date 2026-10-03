import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { Draggable, Droppable } from '@openng/optimus-ui/dragdrop';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

type ZoneId = 'pool' | 'supervised' | 'unsupervised';

interface SortZone {
  id: ZoneId;
  title: string;
  short: string;
}

interface SortItem {
  id: string;
  label: string;
}

/**
 * Guide article: Drag and Drop (Guides, category `library`).
 *
 * Subject: the `pDraggable` / `pDroppable` directive pair from
 * `@openng/optimus-ui/dragdrop`. Both wrap the native HTML drag-and-drop events
 * and add nothing else — no role, no tabindex, no keyboard, no touch contract.
 * The guide's main message is the alternative a drag must ship beside it.
 *
 * CLAIMS AND THEIR PROVENANCE (openng-optimus-ui-dragdrop.mjs, Optimus UI 2.0.2):
 *   - Draggable sets `draggable = true` on the host (:62, :68) and binds
 *     mousedown/mouseup (:87-94) plus the dragstart/dragend host listeners (:142).
 *   - The scope is written as drag data: `dataTransfer.setData('text', scope)`
 *     (:113); Droppable compares it in `allowDrop` (:269-282), called from drop
 *     only (:247-253).
 *   - `dragHandle` is matched against the target of the last mousedown
 *     (:125-136); with no mousedown recorded, every drag is allowed (:132-135).
 *   - `dragover` is prevented unconditionally (:244-246); `dragenter` adds the
 *     `p-draggable-enter` class without a scope check (:254-261); only an
 *     accepted drop removes it (:248-249); `dragleave` removes it when the
 *     pointer leaves the element (:262-268).
 *   - `pDraggableDisabled` unbinds the mouse listeners but leaves the element
 *     draggable (:56-64); `dragStart` then cancels the drag (:109-119).
 *   - `pDroppableDisabled` unbinds dragover only (:189-196); dragenter still runs.
 *   - `drag` and `dragover` are bound outside the Angular zone (:74-76, :231-233).
 *   - Neither optimus-ui-styles nor the Aura preset ships a dragdrop entry, so
 *     `p-draggable-enter` has no rule anywhere; src/styles.scss has none either.
 */
@Component({
  selector: 'app-dragdrop-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective, Draggable, Droppable],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'dragdrop'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two directives, one job: they turn the browser's native drag events into Angular outputs. They add no role, no
          focus, and no key, so every drag you build on them is a mouse-only interaction until you ship the second path
          yourself. The example below ships it.
        </p>

        <h3>Sort the examples — by drag, or by button</h3>
        <p>
          Drag an example into a column, or use its buttons. Both paths call the same method, and both end in the same
          status line, which a screen reader announces.
        </p>
        <div class="sort-board">
          @for (zone of zones; track zone.id) {
            <div
              class="sort-zone"
              role="group"
              [attr.aria-labelledby]="'dd-zone-' + zone.id"
              pDroppable="ml-task"
              dropEffect="move"
              (onDrop)="dropInto(zone.id)"
            >
              <h4 class="sort-zone__title" [id]="'dd-zone-' + zone.id">{{ zone.title }}</h4>
              <ul class="sort-list">
                @for (item of byZone()[zone.id]; track item.id) {
                  <li
                    class="sort-item"
                    tabindex="-1"
                    [id]="'dd-item-' + item.id"
                    [class.is-dragging]="draggingId() === item.id"
                    pDraggable="ml-task"
                    dragEffect="move"
                    (onDragStart)="draggingId.set(item.id)"
                    (onDragEnd)="draggingId.set(null)"
                  >
                    <span class="sort-item__label">
                      <span class="pi pi-bars sort-item__grip" aria-hidden="true"></span>
                      {{ item.label }}
                    </span>
                    <span class="sort-item__moves">
                      <span class="sort-item__moves-label" aria-hidden="true">Move to:</span>
                      @for (target of zones; track target.id) {
                        @if (target.id !== zone.id) {
                          <button type="button" class="move-btn" (click)="move(item.id, target.id)">
                            <span class="sr-only">Move {{ item.label }} to </span>{{ target.short }}
                          </button>
                        }
                      }
                    </span>
                  </li>
                } @empty {
                  <li class="sort-empty">No examples here yet.</li>
                }
              </ul>
            </div>
          }
        </div>
        <p class="sort-status" role="status">{{ status() }}</p>
        <p class="src-note">
          A live <code>pDraggable</code> / <code>pDroppable</code> pair from <code>&#64;openng/optimus-ui/dragdrop</code>.
          The directives supply the drag events only; the move buttons, the focus return after a button move, the status
          line (<code>role="status"</code>, a polite live region) and the drop-target highlight on
          <code>.p-draggable-enter</code> are this page's own code.
        </p>

        <h3>What the directives put into the DOM</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          <code>draggable = true</code> from <code>openng-optimus-ui-dragdrop.mjs:62</code> and <code>:68</code>; the class
          from <code>addClass</code> in <code>dragEnter</code> (<code>:259</code>). Neither directive declares a host
          attribute or binding beyond these (<code>:142</code>, <code>:287</code>) — no <code>role</code>, no
          <code>tabindex</code>, no <code>aria-*</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Whether to build a drag at all</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>The task</th><th>Reach for</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Reorder one list</td>
                <td><code>p-orderlist</code> (DataView guide)</td>
                <td>{{ m.whenOrder }}</td>
              </tr>
              <tr>
                <td>Move items between two lists</td>
                <td><code>p-picklist</code> (DataView guide)</td>
                <td>{{ m.whenPick }}</td>
              </tr>
              <tr>
                <td>Sort items into named groups (a quiz, a card sort)</td>
                <td><code>pDraggable</code> + <code>pDroppable</code> + move buttons</td>
                <td>{{ m.whenSort }}</td>
              </tr>
              <tr>
                <td>Choose one answer per item</td>
                <td>radio group or <code>p-select</code> per item</td>
                <td>{{ m.whenChoose }}</td>
              </tr>
              <tr>
                <td>Drop files from the desktop</td>
                <td><code>p-fileupload</code></td>
                <td>{{ m.whenFiles }}</td>
              </tr>
              <tr>
                <td>Free positioning on a canvas</td>
                <td>avoid on a reading portal</td>
                <td>{{ m.whenCanvas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The alternative requirement is WCAG 2.2 SC 2.5.7 (Dragging Movements, AA): a single-pointer path without
          dragging; the keyboard requirement is SC 2.1.1. The two list components ship their move buttons as native
          buttons (<code>openng-optimus-ui-orderlist.mjs:736</code>, <code>openng-optimus-ui-picklist.mjs:1292</code>).
        </p>

        <h3>Do and don't</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — the drag as the only way to move</span>
            <div class="dd__stage">
              <ul class="mini-list">
                <li class="mini-item" pDraggable="dd-demo">
                  <span class="pi pi-bars" aria-hidden="true"></span> Spam filter from labeled emails
                </li>
              </ul>
            </div>
            <p class="dd__why">{{ m.dragOnlyWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a button beside the drag, and a spoken result</span>
            <div class="dd__stage">
              <ul class="mini-list">
                <li class="mini-item" pDraggable="dd-demo">
                  <span class="pi pi-bars" aria-hidden="true"></span> Spam filter from labeled emails —
                  {{ miniWhere() }}
                  <button type="button" class="move-btn" (click)="miniToggle()">
                    <span class="sr-only">Move Spam filter from labeled emails to </span>{{ miniTarget() }}
                  </button>
                </li>
              </ul>
              <p class="mini-status" role="status">{{ miniStatus() }}</p>
            </div>
            <p class="dd__why">{{ m.buttonWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Both examples are live: each item carries <code>pDraggable</code>. The left one can be dragged and nothing
          else; the right one also moves by button and reports the result through <code>role="status"</code>.
        </p>

        <h3>Sources</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-dragdrop.mjs</code> — both directives in 336 lines; every behavior on this page is
            cited from it.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 2.5.7 Dragging Movements</a
            >
            — why a single-pointer alternative is required, with examples of acceptable ones.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 2.1.1 Keyboard</a
            >
            — the requirement the move buttons satisfy for keyboard users.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 4.1.3 Status Messages</a
            >
            — why the result of a move is announced without moving focus to it.
          </li>
          <li>
            <a href="https://html.spec.whatwg.org/multipage/dnd.html" rel="noopener noreferrer" target="_blank"
              >HTML Standard — Drag and drop</a
            >
            — the event model the directives wrap, including the protected drag data store.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>What the library styles: nothing</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>State</th><th>Hook</th><th>What to paint</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Drag handle at rest</td>
                <td>your markup</td>
                <td>{{ m.designGrip }}</td>
              </tr>
              <tr>
                <td>Item being dragged</td>
                <td>your class, set from <code>onDragStart</code> / <code>onDragEnd</code></td>
                <td>{{ m.designDragging }}</td>
              </tr>
              <tr>
                <td>Drop target under the pointer</td>
                <td><code>.p-draggable-enter</code></td>
                <td>{{ m.designEnter }}</td>
              </tr>
              <tr>
                <td>Item after a button move</td>
                <td><code>:focus-visible</code></td>
                <td>{{ m.designFocus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist</code> and <code>&#64;openng/optimus-ui-themes/dist/aura</code> have no
          dragdrop entry, and neither they nor <code>src/styles.scss</code> carry a rule for
          <code>.p-draggable-enter</code>. The class is a hook, not a style.
        </p>

        <h3>Contrast</h3>
        <p>{{ m.contrast }}</p>
        <p class="src-note">
          Ratios from <code>docs/generated/CONTRAST.MD</code>, group "control boundary", werkbund style:
          <code>--control-border</code> on <code>--surface-card</code> is 5.23:1 in light and 4.91:1 in dark mode (SC 1.4.11
          needs 3:1). The drop-target tint used on this page is not in the contrast gate.
        </p>

        <h3>Narrow viewport and touch</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          Listeners from <code>openng-optimus-ui-dragdrop.mjs:87-94</code> (mousedown, mouseup) and the host listener lists
          at <code>:142</code> and <code>:287</code> (dragstart, dragend, drop, dragenter, dragleave). The three-column board
          on the Examples tab is this page's own grid.
        </p>

        <h3>Motion</h3>
        <p>{{ m.motion }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>pDraggable</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Kind</th><th>Behavior</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pDraggable</code></td><td>input (scope)</td><td>{{ m.apiScope }}</td></tr>
              <tr><td><code>dragEffect</code></td><td>input</td><td>{{ m.apiDragEffect }}</td></tr>
              <tr><td><code>dragHandle</code></td><td>input (CSS selector)</td><td>{{ m.apiHandle }}</td></tr>
              <tr><td><code>pDraggableDisabled</code></td><td>input</td><td>{{ m.apiDragDisabled }}</td></tr>
              <tr>
                <td><code>onDragStart</code> · <code>onDrag</code> · <code>onDragEnd</code></td>
                <td>outputs (<code>DragEvent</code>)</td>
                <td>{{ m.apiDragOutputs }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared at <code>openng-optimus-ui-dragdrop.mjs:142</code>; setters and handlers at <code>:53-136</code>.
        </p>

        <h3>pDroppable</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Kind</th><th>Behavior</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pDroppable</code></td><td>input (scope, string or array)</td><td>{{ m.apiDropScope }}</td></tr>
              <tr><td><code>dropEffect</code></td><td>input</td><td>{{ m.apiDropEffect }}</td></tr>
              <tr><td><code>pDroppableDisabled</code></td><td>input</td><td>{{ m.apiDropDisabled }}</td></tr>
              <tr>
                <td><code>onDragEnter</code> · <code>onDragLeave</code> · <code>onDrop</code></td>
                <td>outputs (<code>DragEvent</code>)</td>
                <td>{{ m.apiDropOutputs }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Declared at <code>openng-optimus-ui-dragdrop.mjs:287</code>; handlers at <code>:244-282</code>. Both directives are
          standalone; <code>DragDropModule</code> (<code>:318-322</code>) only re-exports them.
        </p>

        <h3>The scope is real drag data</h3>
        <p>
          Drag the chip into the text field. What lands there is the scope string — the directive writes it as the drag's
          plain-text payload, and any text target in any application accepts it.
        </p>
        <div class="stage">
          <span class="scope-chip" pDraggable="ml-task"><span class="pi pi-bars" aria-hidden="true"></span> Spam filter</span>
          <label class="scope-label" for="dd-scope-probe">Drop target</label>
          <textarea id="dd-scope-probe" class="scope-probe" rows="2"></textarea>
        </div>
        <p class="src-note">
          <code>event.dataTransfer.setData('text', this.scope)</code> at <code>openng-optimus-ui-dragdrop.mjs:113</code>. The
          HTML Standard maps the format <code>text</code> to <code>text/plain</code>.
        </p>

        <h3>Wiring recipe</h3>
        <pre class="code-block"><code>{{ recipeSnippet }}</code></pre>
        <p class="src-note">
          The pattern the Examples board uses. Identity travels in component state, not in the drag data: the scope is the
          only payload the directive writes, and a drop handler that reads the drag data would get the scope back.
        </p>

        <h3>Checklist</h3>
        <ul class="checklist">
          <li>{{ m.checkAlt }}</li>
          <li>{{ m.checkOneMethod }}</li>
          <li>{{ m.checkAnnounce }}</li>
          <li>{{ m.checkFocus }}</li>
          <li>{{ m.checkHighlight }}</li>
          <li>{{ m.checkScope }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>What the library contributes</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          <code>openng-optimus-ui-dragdrop.mjs</code> imports nothing from <code>&#64;openng/optimus-ui/config</code> and
          reads no translation key.
        </p>

        <h3>The strings you own</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          The kit's pattern: <code>TranslationService.translate()</code> inside a <code>computed</code>, so the labels
          re-resolve on a language switch. Build the announcement from a whole-sentence key with placeholders, never by
          concatenating fragments — word order differs between languages.
        </p>

        <h3>Writing direction</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.1</strong> — 2026-09-23 — Synced with the contrast and focus rounds: this page's rings and the
            drop outline use the kit ring's <code>--primary-color-fg</code> (was <code>--primary-color</code>), and the
            Design tab says why.
          </li>
          <li><strong>v1.0</strong> — 2026-09-23 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-dragdrop-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-dragdrop-article .stage {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-dragdrop-article .sort-board {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.75rem;
        margin-block: 0.75rem;
      }

      app-dragdrop-article .sort-zone {
        padding: 0.75rem;
        border: 1px solid var(--control-border);
        background: var(--surface-card);
        min-height: 8rem;
      }

      app-dragdrop-article .sort-zone.p-draggable-enter {
        background: color-mix(in srgb, var(--primary-color) 10%, var(--surface-card));
        outline: 2px dashed var(--primary-color-fg);
        outline-offset: -4px;
      }

      app-dragdrop-article .sort-zone__title {
        margin: 0 0 0.5rem;
        font-size: 0.95rem;
      }

      app-dragdrop-article .sort-list,
      app-dragdrop-article .mini-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      app-dragdrop-article .sort-item,
      app-dragdrop-article .mini-item {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        padding: 0.5rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-section);
        cursor: grab;
        font-size: 0.9rem;
      }

      app-dragdrop-article .mini-item {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
      }

      app-dragdrop-article .sort-item:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-dragdrop-article .sort-item.is-dragging {
        opacity: 0.5;
      }

      app-dragdrop-article .sort-item__grip {
        color: var(--text-color-secondary);
        margin-inline-end: 0.25rem;
      }

      app-dragdrop-article .sort-item__moves {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.35rem;
      }

      app-dragdrop-article .sort-item__moves-label {
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      app-dragdrop-article .move-btn {
        min-height: 2rem;
        padding: 0.2rem 0.6rem;
        border: 1px solid var(--control-border);
        background: var(--surface-card);
        color: var(--text-color);
        font: inherit;
        font-size: 0.8rem;
        cursor: pointer;
      }

      app-dragdrop-article .move-btn:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-dragdrop-article .sort-empty {
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-dragdrop-article .sort-status,
      app-dragdrop-article .mini-status {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        min-height: 1.4em;
      }

      app-dragdrop-article .scope-chip {
        padding: 0.35rem 0.6rem;
        border: 1px solid var(--control-border);
        background: var(--surface-section);
        cursor: grab;
      }

      app-dragdrop-article .scope-label {
        font-size: 0.85rem;
      }

      app-dragdrop-article .scope-probe {
        flex: 1 1 12rem;
        font: inherit;
        border: 1px solid var(--control-border);
        background: var(--surface-card);
        color: var(--text-color);
      }

      app-dragdrop-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-dragdrop-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-dragdrop-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-dragdrop-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-dragdrop-article .dd__stage {
        padding: 1rem;
        background: var(--surface-section);
      }

      app-dragdrop-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-dragdrop-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-dragdrop-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-dragdrop-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-dragdrop-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 40rem) {
        app-dragdrop-article .sort-board,
        app-dragdrop-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class DragdropArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  // --- the live sorting board (synthetic content) ---
  readonly zones: SortZone[] = [
    { id: 'pool', title: 'Not sorted', short: 'Not sorted' },
    { id: 'supervised', title: 'Supervised learning', short: 'Supervised' },
    { id: 'unsupervised', title: 'Unsupervised learning', short: 'Unsupervised' },
  ];

  readonly items: SortItem[] = [
    { id: 'spam', label: 'Spam filter from labeled emails' },
    { id: 'segments', label: 'Customer groups from purchases' },
    { id: 'prices', label: 'House prices from past sales' },
    { id: 'topics', label: 'Topics in unlabeled articles' },
    { id: 'digits', label: 'Handwritten digit recognition' },
  ];

  readonly placement = signal<Record<string, ZoneId>>({
    spam: 'pool',
    segments: 'pool',
    prices: 'pool',
    topics: 'pool',
    digits: 'pool',
  });

  readonly byZone = computed(() => {
    const p = this.placement();
    return {
      pool: this.items.filter((i) => p[i.id] === 'pool'),
      supervised: this.items.filter((i) => p[i.id] === 'supervised'),
      unsupervised: this.items.filter((i) => p[i.id] === 'unsupervised'),
    } as Record<ZoneId, SortItem[]>;
  });

  readonly draggingId = signal<string | null>(null);
  readonly status = signal('Nothing moved yet. Drag an example, or use its buttons.');

  /** The one move path — the drop handler and every button call it. */
  move(itemId: string, to: ZoneId, returnFocus = true): void {
    const item = this.items.find((i) => i.id === itemId);
    const zone = this.zones.find((z) => z.id === to);
    if (!item || !zone) return;
    if (this.placement()[itemId] === to) {
      this.status.set(item.label + ' is already in ' + zone.title + '.');
      return;
    }
    this.placement.update((p) => ({ ...p, [itemId]: to }));
    const sorted = Object.values(this.placement()).filter((z) => z !== 'pool').length;
    this.status.set(
      item.label + ' moved to ' + zone.title + '. ' + sorted + ' of ' + this.items.length + ' sorted.',
    );
    if (returnFocus) this.focusItem(itemId);
  }

  /** A drop keeps the pointer user's focus where it was; only a button move returns focus. */
  dropInto(zone: ZoneId): void {
    const id = this.draggingId();
    this.draggingId.set(null);
    if (id) this.move(id, zone, false);
  }

  /** The button that was pressed leaves the DOM with its row; focus the row in its new place. */
  private focusItem(itemId: string): void {
    afterNextRender(
      () => {
        this.host.nativeElement.querySelector<HTMLElement>('#dd-item-' + itemId)?.focus();
      },
      { injector: this.injector },
    );
  }

  // --- the do/don't mini example ---
  readonly miniIn = signal<'pool' | 'supervised'>('pool');
  readonly miniWhere = computed(() => (this.miniIn() === 'pool' ? 'not sorted' : 'in Supervised'));
  readonly miniTarget = computed(() => (this.miniIn() === 'pool' ? 'Supervised' : 'Not sorted'));
  readonly miniStatus = signal('');

  miniToggle(): void {
    this.miniIn.update((z) => (z === 'pool' ? 'supervised' : 'pool'));
    this.miniStatus.set(
      'Spam filter from labeled emails moved to ' + (this.miniIn() === 'pool' ? 'Not sorted' : 'Supervised') + '.',
    );
  }

  // --- rulings and readings, as flat constants so the tab extractor resolves them ---
  readonly m = {
    // usage — whether to drag
    whenOrder:
      'Reordering is a solved problem with move-up and move-down buttons built in; its drag is an extra on top of a keyboard path that already works.',
    whenPick:
      'The transfer buttons are the primary path and the drag is optional; you get both, named and focusable, without writing either.',
    whenSort:
      'No library component sorts into named buckets. Build it from the directives, and give every item one button per destination beside the drag.',
    whenChoose:
      'If every item gets exactly one category, the task is a choice, not a movement. A radio group or select per item is shorter to build and needs no drag at all.',
    whenFiles:
      'Its drop area handles files from the operating system, which the scope check of pDroppable would reject: a file drag carries no scope string.',
    whenCanvas:
      'Continuous positioning has no natural keyboard equivalent short of coordinate inputs. If the portal needs it, it is a demo of its own with its own accessibility design.',

    dragOnlyWhy:
      'No role, no tab stop, no key: the item cannot be reached or moved from a keyboard, fails SC 2.1.1, and fails SC 2.5.7 for anyone who can click but not hold and drag.',
    buttonWhy:
      'The button is a single-pointer and keyboard path to the same result, and the status line tells a screen reader what happened without moving focus.',

    // design
    designGrip:
      'A grip icon (aria-hidden) and cursor: grab tell pointer users the row moves. Nothing in the directive sets a cursor.',
    designDragging:
      'A reduced-opacity source row, so the user sees what they picked up. The browser draws the drag image itself.',
    designEnter:
      'A tint and a dashed outline on the zone. The class arrives on dragenter for any drag, including foreign ones, and is removed by dragleave or an accepted drop.',
    designFocus:
      'A visible focus ring on the moved row, which receives focus after a button move so the keyboard user continues from the same item. Your rows are your markup, outside the kit’s ring list, so give them the kit ring’s values — 2px solid --primary-color-fg, 3.88:1 and up on every page surface (CONTRAST.MD "focus ring"); --primary-color is the darker background role and too dark for a ring in dark mode.',
    contrast:
      'Draw drop-zone boundaries with --control-border, not --surface-border: when the boundary is what tells a user where a drop lands, it identifies a control and owes 3:1 under SC 1.4.11. The highlight on .p-draggable-enter is a transient state during a pointer gesture; keep it distinguishable by more than color (the outline), because the state is not otherwise announced.',
    narrow:
      'No intrinsic responsive behavior: the directives render no layout, so the board is whatever grid you give it — this page stacks its three columns under 40rem. Touch is the larger gap: the directives bind mouse and native drag events only, no touch or pointer events, so whether a finger can start a drag at all is up to the native drag-and-drop support of the browser. On a phone, treat the buttons as the primary path, and make them at least 24 by 24 CSS pixels (SC 2.5.8).',
    motion:
      'The directives animate nothing. The drag image is drawn by the browser; any transition you add to the drop-target highlight is shortened by the global prefers-reduced-motion rule in src/styles.scss.',

    // development
    apiScope:
      'Written as the drag data: setData with the format text and the scope as value. A matching pDroppable accepts the drop.',
    apiDragEffect: 'Copied to dataTransfer.effectAllowed on dragstart, when set.',
    apiHandle:
      'Compared with the target of the last mousedown on the host. A drag that starts without a recorded mousedown is allowed from anywhere.',
    apiDragDisabled:
      'Unbinds the mouse listeners but leaves draggable = true; dragstart then cancels the drag with preventDefault.',
    apiDragOutputs:
      'onDragStart fires after the scope is written; onDrag fires on every drag event and runs outside the Angular zone — update a signal, do not rely on zone change detection.',
    apiDropScope:
      'Accepted when the drag data equals the string, or equals one entry of the array. Anything else is ignored at drop time.',
    apiDropEffect: 'Copied to dataTransfer.dropEffect on dragenter, when set.',
    apiDropDisabled:
      'Unbinds dragover only, so drops stop firing; dragenter still adds p-draggable-enter while the pointer is over the element.',
    apiDropOutputs:
      'onDragEnter fires for every drag, whatever its scope; onDragLeave only when the pointer leaves the element itself, not a child; onDrop only for an accepted scope.',

    checkAlt:
      'Ship a single-pointer, keyboard-operable path beside every drag — move buttons, or a select per item — before shipping the drag.',
    checkOneMethod:
      'Route the drop handler and the buttons through one method, so the two paths cannot drift apart.',
    checkAnnounce:
      'Announce the result of every move in a role="status" region that exists before the first move.',
    checkFocus:
      'After a button move, focus the moved item in its new place; the pressed button left the DOM with its row.',
    checkHighlight:
      'Style .p-draggable-enter yourself, and clear it in onDrop and onDragLeave handlers of your own if scopes can mismatch: a rejected drop leaves the class on the element.',
    checkScope:
      'Treat the scope as public text. It is the drag payload and lands verbatim in any text field, other tab, or application it is dropped on.',

    // i18n
    i18nLibrary:
      'Nothing. The directives render no text, no label, and no announcement, and read no translation key. Every word a user sees or hears around a drag — zone headings, button labels, the status sentence — is template content you write and localize like any other.',
    i18nRtl:
      'The directives have no direction of their own. The move buttons carry destination names, not arrows, so they need no mirroring; if you use arrow icons for move-up and move-down, those are vertical and direction-neutral, while left and right arrows would need to swap under dir="rtl".',
  };

  readonly anatomySnippet =
    '<!-- <li pDraggable="ml-task"> after init -->\n' +
    '<li draggable="true">Spam filter from labeled emails</li>\n' +
    '\n' +
    '<!-- <div pDroppable="ml-task"> while a drag is over it -->\n' +
    '<div class="p-draggable-enter">...</div>\n' +
    '\n' +
    '<!-- Nothing else: no role, no tabindex, no aria-* on either. -->';

  readonly recipeSnippet =
    '<!-- Zone: accepts drags whose scope is "ml-task" -->\n' +
    '<div role="group" [attr.aria-labelledby]="zone.headingId"\n' +
    '     pDroppable="ml-task" (onDrop)="dropInto(zone.id)">\n' +
    '  <li pDraggable="ml-task"\n' +
    '      (onDragStart)="draggingId.set(item.id)"\n' +
    '      (onDragEnd)="draggingId.set(null)">\n' +
    '    {{ item.label }}\n' +
    '    <button type="button" (click)="move(item.id, other.id)">...</button>\n' +
    '  </li>\n' +
    '</div>\n' +
    '<p role="status">{{ status() }}</p>\n' +
    '\n' +
    '// Class: one move path for both inputs\n' +
    'dropInto(zone: ZoneId) {\n' +
    '  const id = this.draggingId();\n' +
    '  this.draggingId.set(null);\n' +
    '  if (id) this.move(id, zone, false); // pointer: focus stays\n' +
    '}\n' +
    'move(id: string, to: ZoneId, returnFocus = true) {\n' +
    '  // update the model, set status(), then after render\n' +
    '  // focus the moved row when returnFocus is true\n' +
    '}';

  readonly i18nSnippet =
    '// Labels and the announcement are yours; resolve them in a computed.\n' +
    'private readonly i18n = inject(TranslationService);\n' +
    'readonly labels = computed(() => ({\n' +
    '  moveTo: this.i18n.translate("sorting.moveTo"),\n' +
    '  supervised: this.i18n.translate("sorting.zone.supervised"),\n' +
    '}));\n' +
    '\n' +
    '// One key per sentence, placeholders for the parts:\n' +
    '// "sorting.moved": "{item} moved to {zone}. {done} of {total} sorted."';
}
