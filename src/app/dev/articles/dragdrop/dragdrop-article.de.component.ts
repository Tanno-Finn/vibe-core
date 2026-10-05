import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  DragdropArticleComponent,
  ARTICLE_IMPORTS,
  ARTICLE_STYLES,
  SortItem,
  SortZone,
  ZoneId,
} from './dragdrop-article.component';

/**
 * German twin of the Drag and Drop guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the demo content, the status texts
 * and the visible strings in `m` are German. Keep it in step with the English file:
 * same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs dragdrop`).
 */
@Component({
  selector: 'app-dragdrop-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'dragdrop'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Direktiven, eine Aufgabe: Sie machen aus den nativen Drag-Events des Browsers Angular-Outputs. Sie
          ergänzen keine Rolle, keinen Fokus und keine Taste, also ist jeder Drag, den du darauf baust, eine reine
          Maus-Interaktion, bis du den zweiten Weg selbst mitlieferst. Das Beispiel unten liefert ihn mit.
        </p>

        <h3>Sortiere die Beispiele — per Ziehen oder per Button</h3>
        <p>
          Zieh ein Beispiel in eine Spalte oder nutze seine Buttons. Beide Wege rufen dieselbe Methode auf, und beide
          enden in derselben Statuszeile, die ein Screenreader ansagt.
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
                      <span class="sort-item__moves-label" aria-hidden="true">Verschieben nach:</span>
                      @for (target of zones; track target.id) {
                        @if (target.id !== zone.id) {
                          <button type="button" class="move-btn" (click)="move(item.id, target.id)">
                            <span class="sr-only">Verschiebe {{ item.label }} nach </span>{{ target.short }}
                          </button>
                        }
                      }
                    </span>
                  </li>
                } @empty {
                  <li class="sort-empty">Hier liegen noch keine Beispiele.</li>
                }
              </ul>
            </div>
          }
        </div>
        <p class="sort-status" role="status">{{ status() }}</p>
        <p class="src-note">
          Ein echtes Paar aus <code>pDraggable</code> und <code>pDroppable</code> aus
          <code>&#64;openng/optimus-ui/dragdrop</code>. Die Direktiven liefern nur die Drag-Events; die
          Verschiebe-Buttons, die Rückgabe des Fokus nach einem Button-Verschieben, die Statuszeile
          (<code>role="status"</code>, eine höfliche Live-Region) und die Hervorhebung des Ablageziels über
          <code>.p-draggable-enter</code> sind eigener Code dieser Seite.
        </p>

        <h3>Was die Direktiven ins DOM schreiben</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          <code>draggable = true</code> aus <code>openng-optimus-ui-dragdrop.mjs:62</code> und <code>:68</code>; die Klasse
          aus <code>addClass</code> in <code>dragEnter</code> (<code>:259</code>). Keine der beiden Direktiven deklariert
          darüber hinaus ein Host-Attribut oder Binding (<code>:142</code>, <code>:287</code>) — kein <code>role</code>,
          kein <code>tabindex</code>, kein <code>aria-*</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Ob du überhaupt einen Drag bauen solltest</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Die Aufgabe</th><th>Greif zu</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Eine Liste umsortieren</td>
                <td><code>p-orderlist</code> (Guide DataView, OrderList und PickList)</td>
                <td>{{ m.whenOrder }}</td>
              </tr>
              <tr>
                <td>Elemente zwischen zwei Listen verschieben</td>
                <td><code>p-picklist</code> (Guide DataView, OrderList und PickList)</td>
                <td>{{ m.whenPick }}</td>
              </tr>
              <tr>
                <td>Elemente in benannte Gruppen sortieren (ein Quiz, ein Card Sorting)</td>
                <td><code>pDraggable</code> + <code>pDroppable</code> + Verschiebe-Buttons</td>
                <td>{{ m.whenSort }}</td>
              </tr>
              <tr>
                <td>Eine Antwort pro Element wählen</td>
                <td>Radio-Gruppe oder <code>p-select</code> pro Element</td>
                <td>{{ m.whenChoose }}</td>
              </tr>
              <tr>
                <td>Dateien vom Desktop ablegen</td>
                <td><code>p-fileupload</code></td>
                <td>{{ m.whenFiles }}</td>
              </tr>
              <tr>
                <td>Freies Positionieren auf einer Zeichenfläche</td>
                <td>auf einem Leseportal vermeiden</td>
                <td>{{ m.whenCanvas }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Pflicht zur Alternative ist WCAG 2.2 SC 2.5.7 (Dragging Movements, AA): ein Weg mit einem einzelnen Zeiger
          ohne Ziehen; die Tastatur-Pflicht ist SC 2.1.1. Die beiden Listen-Komponenten liefern ihre Verschiebe-Buttons
          als native Buttons (<code>openng-optimus-ui-orderlist.mjs:736</code>, <code>openng-optimus-ui-picklist.mjs:1292</code>).
        </p>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Ziehen als einziger Weg zum Verschieben</span>
            <div class="dd__stage">
              <ul class="mini-list">
                <li class="mini-item" pDraggable="dd-demo">
                  <span class="pi pi-bars" aria-hidden="true"></span> Spamfilter aus gelabelten E-Mails
                </li>
              </ul>
            </div>
            <p class="dd__why">{{ m.dragOnlyWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Button neben dem Ziehen und ein angesagtes Ergebnis</span>
            <div class="dd__stage">
              <ul class="mini-list">
                <li class="mini-item" pDraggable="dd-demo">
                  <span class="pi pi-bars" aria-hidden="true"></span> Spamfilter aus gelabelten E-Mails —
                  {{ miniWhere() }}
                  <button type="button" class="move-btn" (click)="miniToggle()">
                    <span class="sr-only">Verschiebe Spamfilter aus gelabelten E-Mails nach </span>{{ miniTarget() }}
                  </button>
                </li>
              </ul>
              <p class="mini-status" role="status">{{ miniStatus() }}</p>
            </div>
            <p class="dd__why">{{ m.buttonWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Beispiele sind echt: Jedes Element trägt <code>pDraggable</code>. Das linke lässt sich ziehen und sonst
          nichts; das rechte lässt sich auch per Button verschieben und meldet das Ergebnis über
          <code>role="status"</code>.
        </p>

        <h3>Quellen</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-dragdrop.mjs</code> — beide Direktiven in 336 Zeilen; jedes Verhalten auf dieser Seite
            ist daraus zitiert.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 2.5.7 Dragging Movements</a
            >
            — warum eine Alternative mit einem einzelnen Zeiger Pflicht ist, mit Beispielen für zulässige.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 2.1.1 Keyboard</a
            >
            — die Pflicht, die die Verschiebe-Buttons für Tastatur-Nutzer erfüllen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 4.1.3 Status Messages</a
            >
            — warum das Ergebnis eines Verschiebens angesagt wird, ohne den Fokus dorthin zu bewegen.
          </li>
          <li>
            <a href="https://html.spec.whatwg.org/multipage/dnd.html" rel="noopener noreferrer" target="_blank"
              >HTML Standard — Drag and drop</a
            >
            — das Event-Modell, das die Direktiven umhüllen, einschließlich des geschützten Drag-Datenspeichers.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Was die Bibliothek gestaltet: nichts</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Zustand</th><th>Haken</th><th>Was du gestaltest</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Griff in Ruhe</td>
                <td>dein Markup</td>
                <td>{{ m.designGrip }}</td>
              </tr>
              <tr>
                <td>Element, das gerade gezogen wird</td>
                <td>deine Klasse, gesetzt aus <code>onDragStart</code> / <code>onDragEnd</code></td>
                <td>{{ m.designDragging }}</td>
              </tr>
              <tr>
                <td>Ablageziel unter dem Zeiger</td>
                <td><code>.p-draggable-enter</code></td>
                <td>{{ m.designEnter }}</td>
              </tr>
              <tr>
                <td>Element nach einem Button-Verschieben</td>
                <td><code>:focus-visible</code></td>
                <td>{{ m.designFocus }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist</code> und <code>&#64;openng/optimus-ui-themes/dist/aura</code> haben
          keinen Eintrag für dragdrop, und weder sie noch <code>src/styles.scss</code> enthalten eine Regel für
          <code>.p-draggable-enter</code>. Die Klasse ist ein Haken, kein Style.
        </p>

        <h3>Kontrast</h3>
        <p>{{ m.contrast }}</p>
        <p class="src-note">
          Verhältnisse aus <code>docs/generated/CONTRAST.MD</code>, Gruppe „control boundary“, Stil werkbund:
          <code>--control-border</code> auf <code>--surface-card</code> hat im hellen Modus 5,23:1 und im dunklen 4,91:1
          (SC 1.4.11 verlangt 3:1). Die Tönung des Ablageziels auf dieser Seite steht nicht im Kontrast-Gate.
        </p>

        <h3>Schmaler Viewport und Touch</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          Listener aus <code>openng-optimus-ui-dragdrop.mjs:87-94</code> (mousedown, mouseup) und die Listen der
          Host-Listener in <code>:142</code> und <code>:287</code> (dragstart, dragend, drop, dragenter, dragleave). Das
          dreispaltige Board im Tab Beispiele ist das eigene Grid dieser Seite.
        </p>

        <h3>Bewegung</h3>
        <p>{{ m.motion }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>pDraggable</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Art</th><th>Verhalten</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pDraggable</code></td><td>Input (Scope)</td><td>{{ m.apiScope }}</td></tr>
              <tr><td><code>dragEffect</code></td><td>Input</td><td>{{ m.apiDragEffect }}</td></tr>
              <tr><td><code>dragHandle</code></td><td>Input (CSS-Selektor)</td><td>{{ m.apiHandle }}</td></tr>
              <tr><td><code>pDraggableDisabled</code></td><td>Input</td><td>{{ m.apiDragDisabled }}</td></tr>
              <tr>
                <td><code>onDragStart</code> · <code>onDrag</code> · <code>onDragEnd</code></td>
                <td>Outputs (<code>DragEvent</code>)</td>
                <td>{{ m.apiDragOutputs }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklariert in <code>openng-optimus-ui-dragdrop.mjs:142</code>; Setter und Handler in <code>:53-136</code>.
        </p>

        <h3>pDroppable</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Art</th><th>Verhalten</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pDroppable</code></td><td>Input (Scope, String oder Array)</td><td>{{ m.apiDropScope }}</td></tr>
              <tr><td><code>dropEffect</code></td><td>Input</td><td>{{ m.apiDropEffect }}</td></tr>
              <tr><td><code>pDroppableDisabled</code></td><td>Input</td><td>{{ m.apiDropDisabled }}</td></tr>
              <tr>
                <td><code>onDragEnter</code> · <code>onDragLeave</code> · <code>onDrop</code></td>
                <td>Outputs (<code>DragEvent</code>)</td>
                <td>{{ m.apiDropOutputs }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklariert in <code>openng-optimus-ui-dragdrop.mjs:287</code>; Handler in <code>:244-282</code>. Beide
          Direktiven sind standalone; <code>DragDropModule</code> (<code>:318-322</code>) exportiert sie nur erneut.
        </p>

        <h3>Der Scope sind echte Drag-Daten</h3>
        <p>
          Zieh den Chip in das Textfeld. Was dort landet, ist der Scope-String — die Direktive schreibt ihn als
          Klartext-Payload des Drags, und jedes Textziel in jeder Anwendung nimmt ihn an.
        </p>
        <div class="stage">
          <span class="scope-chip" pDraggable="ml-task"><span class="pi pi-bars" aria-hidden="true"></span> Spamfilter</span>
          <label class="scope-label" for="dd-scope-probe">Ablageziel</label>
          <textarea id="dd-scope-probe" class="scope-probe" rows="2"></textarea>
        </div>
        <p class="src-note">
          <code>event.dataTransfer.setData('text', this.scope)</code> in <code>openng-optimus-ui-dragdrop.mjs:113</code>.
          Der HTML Standard bildet das Format <code>text</code> auf <code>text/plain</code> ab.
        </p>

        <h3>Rezept für die Verdrahtung</h3>
        <pre class="code-block"><code>{{ recipeSnippet }}</code></pre>
        <p class="src-note">
          Das Muster, das das Board im Tab Beispiele nutzt. Die Identität reist im Zustand der Komponente, nicht in den
          Drag-Daten: Der Scope ist der einzige Payload, den die Direktive schreibt, und ein Drop-Handler, der die
          Drag-Daten liest, bekäme den Scope zurück.
        </p>

        <h3>Checkliste</h3>
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
        <h3>Was die Bibliothek beiträgt</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          <code>openng-optimus-ui-dragdrop.mjs</code> importiert nichts aus <code>&#64;openng/optimus-ui/config</code> und
          liest keinen Übersetzungsschlüssel.
        </p>

        <h3>Die Texte, die dir gehören</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Das Muster des Kits: <code>TranslationService.translate()</code> in einem <code>computed</code>, damit die
          Labels bei einem Sprachwechsel neu aufgelöst werden. Bau die Ansage aus einem Schlüssel für den ganzen Satz mit
          Platzhaltern, nie durch Aneinanderhängen von Bruchstücken — die Wortstellung unterscheidet sich zwischen
          Sprachen.
        </p>

        <h3>Schreibrichtung</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.1</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Ringe dieser Seite
            und die Kontur des Ablageziels nutzen <code>--primary-color-fg</code> des Kit-Rings (vorher
            <code>--primary-color</code>), und der Tab Design sagt, warum.
          </li>
          <li><strong>v1.0</strong> — 23.09.2026 — Erste Version, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DragdropArticleDeComponent extends DragdropArticleComponent {
  // --- the live sorting board (synthetic content), in German ---
  override readonly zones: SortZone[] = [
    { id: 'pool', title: 'Nicht sortiert', short: 'Nicht sortiert' },
    { id: 'supervised', title: 'Überwachtes Lernen', short: 'Überwacht' },
    { id: 'unsupervised', title: 'Unüberwachtes Lernen', short: 'Unüberwacht' },
  ];

  override readonly items: SortItem[] = [
    { id: 'spam', label: 'Spamfilter aus gelabelten E-Mails' },
    { id: 'segments', label: 'Kundengruppen aus Käufen' },
    { id: 'prices', label: 'Hauspreise aus früheren Verkäufen' },
    { id: 'topics', label: 'Themen in ungelabelten Artikeln' },
    { id: 'digits', label: 'Erkennung handgeschriebener Ziffern' },
  ];

  override readonly status = signal('Noch nichts verschoben. Zieh ein Beispiel oder nutze seine Buttons.');

  /** The one move path, with German status sentences. */
  override move(itemId: string, to: ZoneId, returnFocus = true): void {
    const item = this.items.find((i) => i.id === itemId);
    const zone = this.zones.find((z) => z.id === to);
    if (!item || !zone) return;
    if (this.placement()[itemId] === to) {
      this.status.set(item.label + ' liegt schon in „' + zone.title + '“.');
      return;
    }
    this.placement.update((p) => ({ ...p, [itemId]: to }));
    const sorted = Object.values(this.placement()).filter((z) => z !== 'pool').length;
    this.status.set(
      item.label + ' nach „' + zone.title + '“ verschoben. ' + sorted + ' von ' + this.items.length + ' sortiert.',
    );
    if (returnFocus) this.focusItem(itemId);
  }

  // --- the do/don't mini example, in German ---
  override readonly miniWhere = computed<string>(() => (this.miniIn() === 'pool' ? 'nicht sortiert' : 'in „Überwacht“'));
  override readonly miniTarget = computed<string>(() => (this.miniIn() === 'pool' ? 'Überwacht' : 'Nicht sortiert'));

  override miniToggle(): void {
    this.miniIn.update((z) => (z === 'pool' ? 'supervised' : 'pool'));
    this.miniStatus.set(
      'Spamfilter aus gelabelten E-Mails nach „' + (this.miniIn() === 'pool' ? 'Nicht sortiert' : 'Überwacht') + '“ verschoben.',
    );
  }

  override readonly m = {
    // usage — whether to drag
    whenOrder:
      'Umsortieren ist ein gelöstes Problem, mit eingebauten Buttons für nach oben und nach unten; das Ziehen ist dort ein Extra auf einem Tastaturweg, der schon funktioniert.',
    whenPick:
      'Die Transfer-Buttons sind der Hauptweg, das Ziehen ist optional; du bekommst beides, benannt und fokussierbar, ohne eins davon selbst zu schreiben.',
    whenSort:
      'Keine Bibliothekskomponente sortiert in benannte Gruppen. Bau es aus den Direktiven und gib jedem Element neben dem Ziehen einen Button pro Ziel.',
    whenChoose:
      'Wenn jedes Element genau eine Kategorie bekommt, ist die Aufgabe eine Auswahl, keine Bewegung. Eine Radio-Gruppe oder ein Select pro Element ist schneller gebaut und braucht gar kein Ziehen.',
    whenFiles:
      'Sein Ablagebereich verarbeitet Dateien aus dem Betriebssystem, die die Scope-Prüfung von pDroppable ablehnen würde: Ein Datei-Drag trägt keinen Scope-String.',
    whenCanvas:
      'Stufenloses Positionieren hat kein natürliches Tastatur-Äquivalent, außer Eingabefeldern für Koordinaten. Wenn das Portal es braucht, ist es eine eigene Demo mit eigenem Accessibility-Design.',

    dragOnlyWhy:
      'Keine Rolle, kein Tab-Stopp, keine Taste: Das Element ist per Tastatur weder erreichbar noch verschiebbar, verfehlt SC 2.1.1 und verfehlt SC 2.5.7 für alle, die klicken, aber nicht gedrückt halten und ziehen können.',
    buttonWhy:
      'Der Button ist ein Weg mit einem einzelnen Zeiger und per Tastatur zum selben Ergebnis, und die Statuszeile sagt einem Screenreader, was passiert ist, ohne den Fokus zu bewegen.',

    // design
    designGrip:
      'Ein Griff-Icon (aria-hidden) und cursor: grab zeigen Zeiger-Nutzern, dass sich die Zeile bewegen lässt. Nichts in der Direktive setzt einen Cursor.',
    designDragging:
      'Eine Quellzeile mit verringerter Deckkraft, damit der Nutzer sieht, was er aufgenommen hat. Das Drag-Bild zeichnet der Browser selbst.',
    designEnter:
      'Eine Tönung und eine gestrichelte Kontur an der Zone. Die Klasse kommt bei dragenter für jeden Drag, auch für fremde, und wird von dragleave oder einem angenommenen Drop entfernt.',
    designFocus:
      'Ein sichtbarer Fokus-Ring an der verschobenen Zeile, die nach einem Button-Verschieben den Fokus bekommt, damit der Tastatur-Nutzer beim selben Element weitermacht. Deine Zeilen sind dein Markup, außerhalb der Ring-Liste des Kits, also gib ihnen die Werte des Kit-Rings — 2px solid --primary-color-fg, 3,88:1 und mehr auf jeder Seitenfläche (CONTRAST.MD „focus ring“); --primary-color ist die dunklere Hintergrund-Rolle und im dunklen Modus zu dunkel für einen Ring.',
    contrast:
      'Zeichne die Grenzen von Ablagezonen mit --control-border, nicht mit --surface-border: Wenn die Grenze einem Nutzer sagt, wo ein Drop landet, kennzeichnet sie ein Bedienelement und schuldet nach SC 1.4.11 3:1. Die Hervorhebung an .p-draggable-enter ist ein flüchtiger Zustand während einer Zeigergeste; halte sie durch mehr als Farbe unterscheidbar (die Kontur), weil der Zustand sonst nicht angesagt wird.',
    narrow:
      'Kein eigenes responsives Verhalten: Die Direktiven rendern kein Layout, also ist das Board das Grid, das du ihm gibst — diese Seite stapelt ihre drei Spalten unter 40rem. Touch ist die größere Lücke: Die Direktiven binden nur Maus- und native Drag-Events, keine Touch- oder Pointer-Events, also hängt es von der nativen Drag-and-Drop-Unterstützung des Browsers ab, ob ein Finger überhaupt einen Drag starten kann. Behandle auf dem Smartphone die Buttons als Hauptweg und mach sie mindestens 24 × 24 CSS-Pixel groß (SC 2.5.8).',
    motion:
      'Die Direktiven animieren nichts. Das Drag-Bild zeichnet der Browser; jede Transition, die du der Hervorhebung des Ablageziels gibst, verkürzt die globale prefers-reduced-motion-Regel in src/styles.scss.',

    // development
    apiScope:
      'Als Drag-Daten geschrieben: setData mit dem Format text und dem Scope als Wert. Ein passendes pDroppable nimmt den Drop an.',
    apiDragEffect: 'Wird bei dragstart nach dataTransfer.effectAllowed kopiert, wenn gesetzt.',
    apiHandle:
      'Wird mit dem Ziel des letzten mousedown auf dem Host verglichen. Ein Drag, der ohne aufgezeichnetes mousedown startet, ist von überall erlaubt.',
    apiDragDisabled:
      'Löst die Maus-Listener, lässt aber draggable = true stehen; dragstart bricht den Drag dann mit preventDefault ab.',
    apiDragOutputs:
      'onDragStart feuert, nachdem der Scope geschrieben ist; onDrag feuert bei jedem drag-Event und läuft außerhalb der Angular-Zone — aktualisiere ein Signal, verlass dich nicht auf die Change Detection der Zone.',
    apiDropScope:
      'Angenommen, wenn die Drag-Daten dem String gleichen oder einem Eintrag des Arrays. Alles andere wird beim Drop ignoriert.',
    apiDropEffect: 'Wird bei dragenter nach dataTransfer.dropEffect kopiert, wenn gesetzt.',
    apiDropDisabled:
      'Löst nur dragover, also hören Drops auf zu feuern; dragenter fügt weiter p-draggable-enter hinzu, solange der Zeiger über dem Element ist.',
    apiDropOutputs:
      'onDragEnter feuert für jeden Drag, egal welcher Scope; onDragLeave nur, wenn der Zeiger das Element selbst verlässt, nicht ein Kind; onDrop nur für einen angenommenen Scope.',

    checkAlt:
      'Liefere neben jedem Drag einen Weg mit einem einzelnen Zeiger, der per Tastatur bedienbar ist — Verschiebe-Buttons oder ein Select pro Element —, bevor du den Drag auslieferst.',
    checkOneMethod:
      'Leite den Drop-Handler und die Buttons durch eine Methode, damit die beiden Wege nicht auseinanderlaufen können.',
    checkAnnounce:
      'Sag das Ergebnis jedes Verschiebens in einer role="status"-Region an, die schon vor dem ersten Verschieben existiert.',
    checkFocus:
      'Fokussiere nach einem Button-Verschieben das verschobene Element an seinem neuen Platz; der gedrückte Button hat das DOM mit seiner Zeile verlassen.',
    checkHighlight:
      'Gestalte .p-draggable-enter selbst und entferne die Klasse in eigenen onDrop- und onDragLeave-Handlern, wenn Scopes nicht zusammenpassen können: Ein abgelehnter Drop lässt die Klasse am Element.',
    checkScope:
      'Behandle den Scope als öffentlichen Text. Er ist der Drag-Payload und landet wörtlich in jedem Textfeld, jedem anderen Tab und jeder Anwendung, wo man ihn ablegt.',

    // i18n
    i18nLibrary:
      'Nichts. Die Direktiven rendern keinen Text, kein Label und keine Ansage und lesen keinen Übersetzungsschlüssel. Jedes Wort, das ein Nutzer rund um einen Drag sieht oder hört — Zonen-Überschriften, Button-Labels, der Statussatz —, ist Template-Inhalt, den du schreibst und lokalisierst wie jeden anderen.',
    i18nRtl:
      'Die Direktiven haben keine eigene Richtung. Die Verschiebe-Buttons tragen Zielnamen, keine Pfeile, also müssen sie nicht gespiegelt werden; wenn du Pfeil-Icons für nach oben und nach unten verwendest, sind die vertikal und richtungsneutral, während Pfeile nach links und rechts unter dir="rtl" getauscht werden müssten.',
  };
}
