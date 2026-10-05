import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
  Bird,
  RowReadout,
  TableArticleComponent,
  TableReadout,
  ARTICLE_IMPORTS,
  ARTICLE_STYLES,
} from './table-article.component';

/**
 * German twin of the Table guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in the class
 * fields are German. Keep it in step with the English file: same tabs, same element
 * and binding skeleton (`node scripts/check-guide-translations.mjs table`).
 */
@Component({
  selector: 'app-table-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'table'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Eine Datentabelle ist ein Raster aus Datensätzen, die du miteinander vergleichst. Der
          <code>p-table</code> von Optimus UI ist kein Renderer für dieses Raster — er ist ein Gerüst um ein Raster, das du
          selbst schreibst: Ihm gehören das Tabellenelement, die drei Zeilengruppen, der Sortierzustand, der
          Auswahlzustand und der Paginator, und jede einzelne Zeile und Zelle kommt aus deinen Templates. Alles hier
          unten ist live.
        </p>
        <p class="scope-note">
          <strong>Umfang.</strong> Dieser Guide behandelt den Kern vollständig: Spalten und Templates, Sortieren,
          Auswahl, den Paginator, das responsive Verhalten, den leeren Zustand, die Token-Kette und wie das Ganze im
          Accessibility Tree aussieht. Die industriellen Erweiterungen — virtuelles Scrollen, Lazy Loading,
          Zeilenbearbeitung, fixierte Spalten, Spaltenbreite und -reihenfolge ändern, Zeilen aufklappen, CSV-Export —
          werden genannt, wo sie zählen, und sonst der Dokumentation des Herstellers überlassen; sie sind Fläche für
          einen zweiten Guide, und so zu tun, als wäre es anders, wäre schlimmer, als es offen zu sagen.
        </p>

        <!-- Playground -->
        <section class="pg" aria-label="Tabellen-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-sel-label"
                  >selectionMode <span class="pg__aside">(klick eine Zeile an)</span></span
                >
                <p-select
                  [ariaLabelledBy]="'pg-sel-label'"
                  size="small"
                  [options]="selectionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSelectionMode()"
                  (ngModelChange)="setSelectionMode($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-sort-label">sortMode</span>
                <p-select
                  [ariaLabelledBy]="'pg-sort-label'"
                  size="small"
                  [options]="sortModeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSortMode()"
                  (ngModelChange)="pgSortMode.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">size</span>
                <p-select
                  [ariaLabelledBy]="'pg-size-label'"
                  size="small"
                  [options]="sizeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSize()"
                  (ngModelChange)="pgSize.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-checkbox">Checkbox-Spalte</label>
                <p-toggleswitch
                  inputId="pg-checkbox"
                  [ngModel]="pgCheckbox()"
                  (ngModelChange)="pgCheckbox.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-striped">stripedRows</label>
                <p-toggleswitch inputId="pg-striped" [ngModel]="pgStriped()" (ngModelChange)="pgStriped.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-gridlines">showGridlines</label>
                <p-toggleswitch
                  inputId="pg-gridlines"
                  [ngModel]="pgGridlines()"
                  (ngModelChange)="pgGridlines.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-hover">rowHover</label>
                <p-toggleswitch inputId="pg-hover" [ngModel]="pgHover()" (ngModelChange)="pgHover.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-paginator">paginator <span class="pg__aside">(4 Zeilen je Seite)</span></label>
                <p-toggleswitch
                  inputId="pg-paginator"
                  [ngModel]="pgPaginator()"
                  (ngModelChange)="pgPaginator.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <p-table
                  [value]="birds"
                  dataKey="id"
                  styleClass="pg-table"
                  [tableStyle]="{ 'min-width': '26rem' }"
                  [pt]="pgPt()"
                  [stripedRows]="pgStriped()"
                  [showGridlines]="pgGridlines()"
                  [rowHover]="pgHover()"
                  [size]="pgSize()"
                  [sortMode]="pgSortMode()"
                  [selectionMode]="pgSelectionMode()"
                  [selection]="pgSelection()"
                  (selectionChange)="pgSelection.set($event)"
                  [paginator]="pgPaginator()"
                  [rows]="4"
                  [showCurrentPageReport]="pgPaginator()"
                  [currentPageReportTemplate]="pgReport"
                >
                  <ng-template #header>
                    <tr>
                      @if (pgCheckbox()) {
                        <th class="cell--pick"><p-tableHeaderCheckbox [ariaLabel]="'Alle Zeilen auswählen'" /></th>
                      }
                      <th pSortableColumn="name">Art <p-sortIcon field="name" /></th>
                      <th pSortableColumn="family">Familie <p-sortIcon field="family" /></th>
                      <th pSortableColumn="wingspan" class="cell--num">Spannweite <p-sortIcon field="wingspan" /></th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row" [attr.aria-selected]="isPgSelected(row) ? true : null">
                      @if (pgCheckbox()) {
                        <td class="cell--pick"><p-tableCheckbox [value]="row" [ariaLabel]="'Auswählen: ' + row.name" /></td>
                      }
                      <td>{{ row.name }}</td>
                      <td>{{ row.family }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <p class="pg__hint">{{ pgHint() }}</p>
              </div>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Erzeugtes Markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        <!-- Selection semantics instrument -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Was ein Screenreader von einer ausgewählten Zeile erfährt</h3>
          </div>
          <p class="ex__note">
            Klick in jeder Tabelle eine Zeile an und lies das Protokoll darunter. Alle drei heben die Zeile hervor;
            <strong>nur die dritte ist aus Sicht der assistiven Technik ausgewählt.</strong> Die Direktive der
            Bibliothek setzt eine Klasse, einen wandernden <code>tabindex</code> und ein Data-Attribut — nie
            <code>aria-selected</code>, und es gibt kein Input, das es setzt. Das Attribut von Hand zu ergänzen reicht
            auch nicht: Eine Zeile trägt nur dann einen Auswahlzustand, wenn die Tabelle, in der sie steht, ein
            <code>grid</code> ist.
          </p>
          <div class="ex__stage">
            <div class="three">
              <div class="two__col">
                <span class="row__tag">Standard der Bibliothek</span>
                <p-table
                  [value]="fewBirds"
                  dataKey="id"
                  styleClass="ax-bare"
                  selectionMode="single"
                  [selection]="bareSelection()"
                  (selectionChange)="onBareSelect($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th>Art</th>
                      <th class="cell--num">Spannweite</th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row">
                      <td>{{ row.name }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <ul class="journal">
                  <li><strong>Rolle der Tabelle</strong>: {{ bareReadout().role }}</li>
                  @for (r of bareReadout().rows; track r.row) {
                    <li>{{ r.row }} — {{ r.visual }}, <code>aria-selected</code>: {{ r.aria }}</li>
                  }
                  <li class="journal__verdict">Als ausgewählt angesagt: nein</li>
                </ul>
              </div>
              <div class="two__col">
                <span class="row__tag">aria-selected ergänzt</span>
                <p-table
                  [value]="fewBirds"
                  dataKey="id"
                  styleClass="ax-attr"
                  selectionMode="single"
                  [selection]="attrSelection()"
                  (selectionChange)="onAttrSelect($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th>Art</th>
                      <th class="cell--num">Spannweite</th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row" [attr.aria-selected]="attrSelection()?.id === row.id ? true : null">
                      <td>{{ row.name }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <ul class="journal">
                  <li><strong>Rolle der Tabelle</strong>: {{ attrReadout().role }}</li>
                  @for (r of attrReadout().rows; track r.row) {
                    <li>{{ r.row }} — {{ r.visual }}, <code>aria-selected</code>: {{ r.aria }}</li>
                  }
                  <li class="journal__verdict">Als ausgewählt angesagt: immer noch nein</li>
                </ul>
              </div>
              <div class="two__col">
                <span class="row__tag">grid-Rolle + aria-selected</span>
                <p-table
                  [value]="fewBirds"
                  dataKey="id"
                  styleClass="ax-grid"
                  selectionMode="single"
                  [selection]="gridSelection()"
                  [pt]="{ table: { role: 'grid', 'aria-label': 'Arten, auswählbar' } }"
                  (selectionChange)="onGridSelect($event)"
                >
                  <ng-template #header>
                    <tr>
                      <th>Art</th>
                      <th class="cell--num">Spannweite</th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr [pSelectableRow]="row" [attr.aria-selected]="gridSelection()?.id === row.id ? true : null">
                      <td>{{ row.name }}</td>
                      <td class="cell--num">{{ row.wingspan }} cm</td>
                    </tr>
                  </ng-template>
                </p-table>
                <ul class="journal">
                  <li><strong>Rolle der Tabelle</strong>: {{ gridReadout().role }}</li>
                  @for (r of gridReadout().rows; track r.row) {
                    <li>{{ r.row }} — {{ r.visual }}, <code>aria-selected</code>: {{ r.aria }}</li>
                  }
                  <li class="journal__verdict">Als ausgewählt angesagt: ja</li>
                </ul>
              </div>
            </div>
          </div>
          <p class="src-note">
            Die Urteile sind aus dem Accessibility Tree gelesen, nicht aus dem Markup — die mittlere Tabelle hat das
            Attribut in ihrem DOM und keinen Auswahlzustand im Baum, weil
            <code>aria-selected</code> auf einer Zeile nur innerhalb eines <code>grid</code> oder <code>treegrid</code>
            unterstützt wird. Prüf es in deinem eigenen Build genauso: Wähl eine Zeile aus und sieh dir den Zeilenknoten
            an, nicht das Element.
          </p>
          <pre class="code-block"><code>{{ selectionSnippet }}</code></pre>
        </section>

        <!-- Sorting instrument -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Sortierbare Header: Der Zustand wird angesagt, das Bedienelement nicht</h3>
          </div>
          <p class="ex__note">
            Spring mit Tab in die Header-Zeile und drück Enter oder Space. Jeder Header ist ein fokussierbares
            <code>&lt;th&gt;</code> mit einem lebendigen <code>aria-sort</code>, genau das, was das Grid-Pattern verlangt
            — aber es ist eine Zelle, kein Button, also sagt nichts einem Screenreader-Nutzer, dass ein Tastendruck hier
            überhaupt etwas bewirkt. Die Auslesung stammt aus den gerenderten Attributen.
          </p>
          <div class="ex__stage">
            <div class="two__col two__col--wide">
              <p-table [value]="fewBirds" dataKey="id" styleClass="sort-demo" [sortMode]="'multiple'">
                <ng-template #header>
                  <tr>
                    <th pSortableColumn="name">Art <p-sortIcon field="name" /></th>
                    <th pSortableColumn="family">Familie <p-sortIcon field="family" /></th>
                    <th pSortableColumn="wingspan" class="cell--num">Spannweite <p-sortIcon field="wingspan" /></th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.family }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                  </tr>
                </ng-template>
              </p-table>
              <ul class="journal">
                @for (h of sortReadout(); track h.row) {
                  <li>
                    <strong>{{ h.row }}</strong> — <code>aria-sort</code>: {{ h.aria }}, {{ h.visual }}
                  </li>
                }
              </ul>
              <p-button
                [label]="'Auslesung aktualisieren'"
                size="small"
                severity="secondary"
                (onClick)="refreshSortReadout()"
              />
            </div>
          </div>
          <p class="src-note">
            Hier gilt <code>sortMode="multiple"</code>, ein zweiter Header ergänzt die Sortierung also, statt sie zu
            ersetzen; mit dem Standard <code>"single"</code> fällt die vorige Spalte auf <code>none</code> zurück. So
            oder so trägt jeder sortierbare Header einen <code>aria-sort</code>-Wert, auch <code>none</code> auf denen,
            die nicht sortiert sind — das ist die korrekte Schreibweise, kein Versäumnis.
          </p>
        </section>

        <!-- Empty state -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Der leere Zustand und die Zelle, in der er stehen muss</h3>
            <button type="button" class="copy-btn" (click)="copy('empty', emptySnippet)">
              {{ copiedId() === 'empty' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Tipp etwas ein, das auf nichts passt. Ohne ein <code>emptymessage</code>-Template rendert der Body einfach
            null Zeilen, und die Tabelle wird zu einem Header, unter dem nichts steht — keine Meldung, keine Ansage. Das
            Template ist eine Zeile, und ihre einzige Zelle braucht ein <code>colspan</code>, sonst sitzt sie in der
            ersten Spalte.
          </p>
          <div class="ex__stage">
            <div class="two__col two__col--wide">
              <label class="filter-label" for="empty-filter">Nach Art filtern</label>
              <input
                id="empty-filter"
                pInputText
                class="filter-input"
                [ngModel]="emptyFilter()"
                (ngModelChange)="emptyFilter.set($event)"
                placeholder="probier: segler"
              />
              <p-table [value]="filteredBirds()" dataKey="id" styleClass="empty-demo">
                <ng-template #header>
                  <tr>
                    <th>Art</th>
                    <th>Familie</th>
                    <th class="cell--num">Spannweite</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.family }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                  </tr>
                </ng-template>
                <ng-template #emptymessage>
                  <tr>
                    <td colspan="3" class="empty-cell">
                      <span aria-live="polite">Keine Art passt auf diesen Filter.</span>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
          <pre class="code-block"><code>{{ emptySnippet }}</code></pre>
        </section>

        <!-- Paginator -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Der Paginator und der eine String, der nicht übersetzbar ist</h3>
            <button type="button" class="copy-btn" (click)="copy('pager', pagerSnippet)">
              {{ copiedId() === 'pager' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Die Buttons des Paginators beziehen ihre zugänglichen Namen aus der Übersetzungskonfiguration der Bibliothek
            und lesen sie bei jeder Change Detection neu, ein Sprachwechsel erreicht sie also. Der Seitenbericht nicht:
            Er ist ein Template-String, den du lieferst, und der ausgelieferte Standard enthält ein englisches Wort.
            Schalte den Bericht unten um, um den Unterschied zwischen dem Standard und einem gebundenen String zu sehen.
          </p>
          <div class="ex__stage">
            <div class="two__col two__col--wide">
              <div class="pg__field">
                <span class="pg__label" id="rep-label">currentPageReportTemplate</span>
                <p-select
                  [ariaLabelledBy]="'rep-label'"
                  size="small"
                  [options]="reportOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="reportTemplate()"
                  (ngModelChange)="reportTemplate.set($event)"
                />
              </div>
              <p-table
                [value]="birds"
                dataKey="id"
                styleClass="pager-demo"
                [paginator]="true"
                [rows]="3"
                [rowsPerPageOptions]="[3, 5, 8]"
                [showCurrentPageReport]="true"
                [currentPageReportTemplate]="reportTemplate()"
              >
                <ng-template #header>
                  <tr>
                    <th>Art</th>
                    <th class="cell--num">Spannweite</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
          <pre class="code-block"><code>{{ pagerSnippet }}</code></pre>
        </section>

        <!-- Responsive -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Schmaler Viewport: Die Tabelle scrollt, sie schrumpft nicht</h3>
            <button type="button" class="copy-btn" (click)="copy('resp', responsiveSnippet)">
              {{ copiedId() === 'resp' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Die Box unten ist absichtlich schmal. Die Tabelle darin trägt eine
            <code>min-width</code>, also scrollt der Container horizontal, und jede Zeile bleibt eine Zeile — die Spalten
            behalten ihre Bedeutung, und der Accessibility Tree ebenso. Es ist auch die einzige responsive Antwort, die
            sich lohnt: Die Stack-Alternative, die jede Zeile zu Paaren aus Label und Wert umbricht, wird in Optimus noch
            ausgeliefert, und der Tab Entwicklung hält fest, was sie die Semantik kostet.
          </p>
          <div class="ex__stage">
            <div class="narrow">
              <p-table
                [value]="fewBirds"
                dataKey="id"
                styleClass="resp-demo"
                [tableStyle]="{ 'min-width': '40rem' }"
                [pt]="{ table: { 'aria-label': 'Europäische Vögel nach Spannweite' } }"
              >
                <ng-template #header>
                  <tr>
                    <th>Art</th>
                    <th>Familie</th>
                    <th class="cell--num">Spannweite</th>
                    <th>Status</th>
                  </tr>
                </ng-template>
                <ng-template #body let-row>
                  <tr>
                    <td>{{ row.name }}</td>
                    <td>{{ row.family }}</td>
                    <td class="cell--num">{{ row.wingspan }} cm</td>
                    <td>{{ row.status }}</td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </div>
          <pre class="code-block"><code>{{ responsiveSnippet }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Ist eine Datentabelle überhaupt die richtige Form?</h3>
        <p>
          Eine Tabelle ist ihr Gewicht wert, wenn ein Leser <em>Datensätze Feld für Feld vergleichen</em> muss. Wenn er
          nur einen Eintrag finden muss oder die Datensätze drei Felder haben, liest sich etwas Leichteres besser. Die
          Tabelle ist danach geordnet, wie oft sich jede Alternative als die eigentliche Antwort herausstellt.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Form</th>
                <th>Sie ist die Antwort, wenn…</th>
                <th>Was sie für einen Screenreader ist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ein einfaches <code>&lt;table&gt;</code></td>
                <td>
                  die Daten statisch sind: eine Referenzmatrix, eine Spezifikation, eine Preisliste. Kein Sortieren, keine
                  Auswahl, kein Blättern.
                </td>
                <td>eine Tabelle, vollständig aus nativem HTML</td>
              </tr>
              <tr>
                <td>eine Definitionsliste oder eine Karte</td>
                <td>
                  du die Felder <em>eines</em> Datensatzes zeigst. Eine Tabelle mit einer Zeile ist eine Layout-Tabelle im
                  Kostüm.
                </td>
                <td>eine Liste, oder was immer du schreibst</td>
              </tr>
              <tr>
                <td>eine Liste aus Links</td>
                <td>Leute nach einem Eintrag suchen und dann gehen. Die Rangfolge zählt, Spalten nicht.</td>
                <td>eine Liste</td>
              </tr>
              <tr>
                <td><code>p-table</code></td>
                <td>
                  Datensätze über Spalten hinweg verglichen werden und mindestens eines von Sortieren, Auswahl oder
                  Blättern echt ist.
                </td>
                <td>eine Tabelle — mit den Zeilen und Zellen, die du geschrieben hast</td>
              </tr>
              <tr>
                <td><code>p-dataview</code></td>
                <td>dieselben Datensätze ein Karten-Layout ebenso wie eine Liste brauchen und es nie um die Spalten ging.</td>
                <td>was immer dein Item-Template ist</td>
              </tr>
              <tr>
                <td><code>p-treetable</code></td>
                <td>
                  Zeilen verschachtelt sind: ein Dateibaum, ein Kontenplan. Eine flache Tabelle mit einer Einrückungsspalte
                  ist nicht dasselbe.
                </td>
                <td>ein Treegrid</td>
              </tr>
              <tr>
                <td><code>p-orderlist</code> / <code>p-picklist</code></td>
                <td>die Interaktion das Umsortieren oder das Verschieben <em>ist</em>, nicht das Lesen.</td>
                <td>Listbox-Widgets</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Identitäten in der letzten Spalte zählen für die Wahl: Zwei Flächen, die auf dem Bildschirm gleich aussehen,
          können für einen Screenreader eine Tabelle und eine Listbox sein, und das Tastaturmodell, das mit ihnen kommt,
          ist ein anderes. Was <code>p-table</code> zu dieser Spalte beiträgt, ist nur der äußere Rahmen —
          <code>role="table"</code> und drei <code>role="rowgroup"</code>-Elemente sind statische Attribute in seinem
          eigenen Template (<code>openng-optimus-ui-table.mjs:3205-3252</code>); Zeilen und Zellen sind die nativen
          Elemente, die du schreibst.
        </p>

        <h3>Der Vertrag: was der Bibliothek gehört und was dir</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Der Bibliothek gehört</th>
                <th>Dir gehört</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Das <code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>,
                  <code>&lt;tfoot&gt;</code> und der Scroll-Container um sie herum
                </td>
                <td>
                  Jedes <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code> und <code>&lt;td&gt;</code> darin, samt ihrem
                  Scope, ihrer Ausrichtung und ihrer Formatierung
                </td>
              </tr>
              <tr>
                <td>Sortierzustand, Auswahlzustand, Seitenzustand und die Events, die sie ändern</td>
                <td>Wo dieser Zustand gespeichert wird und ob er ein Neuladen übersteht</td>
              </tr>
              <tr>
                <td>Der Paginator und die zugänglichen Namen seiner Buttons</td>
                <td>Der String des Seitenberichts und der eigene zugängliche Name der Tabelle</td>
              </tr>
              <tr>
                <td><code>aria-sort</code> auf sortierbaren Headern</td>
                <td>Alles, was sagt, dass eine Zeile <em>ausgewählt</em> ist — dafür gibt es kein Input</td>
              </tr>
              <tr>
                <td>Der Slot für den leeren Zustand</td>
                <td>Die Zeile für den leeren Zustand, ihr <code>colspan</code> und ihr Wortlaut</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Die praktische Folge: Eine schlechte Tabelle ist fast nie die Schuld der Bibliothek. Wenn die Header-Zellen
          kein <code>scope</code> haben, wenn Zahlen links stehen, wenn der leere Zustand ein leeres Rechteck ist — das
          ist alles Template-Code, und es lässt sich alles beheben, ohne ein einziges Input anzufassen.
        </p>

        <h3>Hausstil</h3>
        <ul>
          <li>
            <strong>Benenn die Tabelle.</strong> Eine Tabelle ohne zugänglichen Namen wird als „Tabelle“ samt Zeilen-
            und Spaltenzahl angesagt. Gib ihr eine <code>&lt;caption&gt;</code> über das <code>caption</code>-Template
            oder ein <code>aria-label</code> über die Pass-through-API — und nimm lieber die Caption, weil sie sichtbar
            ist.
          </li>
          <li>
            <strong>Setz <code>dataKey</code>, sobald es Auswahl, Aufklappen oder Blättern gibt.</strong> Ohne ihn
            vergleicht die Komponente Zeilenobjekte bei jeder Auswahlprüfung per tiefer Gleichheit, und die Auswahl
            bricht in dem Moment, in dem das Array durch einen frischen Abruf derselben Datensätze ersetzt wird.
          </li>
          <li>
            <strong
              >Gib der Tabelle eine <code>min-width</code> über <code>[tableStyle]</code>, keine feste Breite.</strong
            >
            Das sorgt dafür, dass der Container scrollt, statt dass die Spalten zu unlesbaren Streifen zusammenfallen.
          </li>
          <li>
            <strong>Zahlen rechtsbündig, Text linksbündig</strong> — in der Header-Zelle ebenso wie in der Body-Zelle,
            sonst liest sich die Spalte wie zwei Spalten.
          </li>
          <li>
            <strong>Templates binden über Referenznamen.</strong> <code>#header</code>, <code>#body</code> und der Rest
            sind der Hausstil. In Optimus funktioniert <code>pTemplate</code> wieder — die
            <code>PrimeTemplate</code>-Content-Query aus v21 hat den Fork überlebt
            (<code>openng-optimus-ui-table.mjs:3080</code>), und <code>onAfterContentInit</code> verzweigt weiterhin
            über <code>getType()</code> (<code>:1329-1331</code>) — aber Referenznamen sind die Form, die dieses Kit
            schreibt. Jeder <code>p-table</code> fragt seinen eigenen Content ab, also deklarieren mehrere Tabellen in
            einem Komponenten-Template jeweils ihren eigenen <code>#body</code>; diese Seite macht genau das.
          </li>
          <li>
            <strong>Liefer immer ein <code>emptymessage</code>-Template mit.</strong> Den Zustand ohne Zeilen erreicht
            jede Tabelle irgendwann, und der Standard dafür ist nichts.
          </li>
          <li>
            <strong>Setz keinen Link und keinen Button in eine auswählbare Zeile und erwarte, dass beides funktioniert.</strong>
            Der Klick-Handler der Zeile bricht bei <code>INPUT</code>-, <code>BUTTON</code>- und <code>A</code>-Zielen ab,
            was das richtige Verhalten ist und zugleich heißt, dass die Zeile dort, wo diese Bedienelemente sitzen, nicht
            auswählbar ist.
          </li>
        </ul>

        <h3>Wo dieser Guide aufhört</h3>
        <p>
          <code>p-table</code> liefert eine zweite Hälfte für Data-Grid-Lasten mit. Sie ist echt und sie funktioniert;
          sie ist auch so groß, dass sie richtig zu dokumentieren eine eigene Aufgabe ist. Was folgt, ist die Grenze,
          damit niemand Schweigen für Fehlen hält:
        </p>
        <ul>
          <li>
            <strong>Virtuelles Scrollen</strong> (<code>[virtualScroll]</code> + <code>virtualScrollItemSize</code>) —
            tauscht den Body gegen einen <code>p-scroller</code>. Alles im Tab Design gilt weiter; die Geschichte für
            Tastatur und Screenreader nicht, weil Zeilen das DOM verlassen.
          </li>
          <li>
            <strong>Lazy Loading</strong> (<code>[lazy]</code>, <code>(onLazyLoad)</code>, <code>[totalRecords]</code>)
            — du lieferst eine Seite nach der anderen und verantwortest Sortieren und Filtern auf dem Server. Beachte,
            dass <code>totalRecords</code> standardmäßig <code>0</code> ist, eine Lazy-Tabelle ohne gesetzte Gesamtzahl
            rendert also keinen Paginator.
          </li>
          <li>
            <strong>Zeilen- und Zellbearbeitung</strong> (<code>editMode</code>, <code>pEditableColumn</code>,
            <code>p-cellEditor</code>) — eine Bearbeitungsfläche mit eigenen Fokusregeln.
          </li>
          <li>
            <strong>Fixierte Spalten und Zeilen</strong> (<code>pFrozenColumn</code>, <code>[frozenValue]</code>) —
            Sticky-Positionierung, und nur in einer scrollbaren Tabelle.
          </li>
          <li>
            <strong>Spaltenbreite ändern und Spalten umsortieren</strong> (<code>[resizableColumns]</code>,
            <code>[reorderableColumns]</code>) — zeigergesteuert, ohne Tastatur-Entsprechung in der Bibliothek.
          </li>
          <li>
            <strong>Zeilen aufklappen</strong> (<code>pRowToggler</code>) — braucht <code>aria-expanded</code> am
            Umschalter und eine Beziehung zur aufgeklappten Zeile, die du lieferst.
          </li>
          <li>
            <strong>Export</strong> (<code>exportCSV()</code>, <code>csvSeparator</code>, <code>exportFilename</code>) —
            eine Methode an der Komponenteninstanz.
          </li>
          <li>
            <strong>Spaltenfilter</strong> (<code>p-columnFilter</code>) — ein Filtermenü je Spalte, mit eigenem Overlay
            und eigenen Übersetzungsschlüsseln.
          </li>
        </ul>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Eine Auswahl, verdrahtet mit <code>selectionMode</code> und sonst nichts, mit der Begründung, die
              hervorgehobene Zeile sei offensichtlich. Offensichtlich ist sie für Leute, die sie sehen; für alle anderen
              ist die Zeile unverändert, weil die Bibliothek kein <code>aria-selected</code> setzt — und das Attribut
              allein zu ergänzen hilft auch nicht.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Leg den Zustand in eine Checkbox-Spalte, oder — wenn der Klick auf die Zeile die Interaktion sein muss —
              setz <code>role="grid"</code> über <code>[pt].table</code> <em>und</em> binde
              <code>[attr.aria-selected]</code>. Das sind die beiden Kombinationen, die den Accessibility Tree erreichen.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Eine Tabelle mit zwölf Spalten, in ein Handy gequetscht, indem man die Spalten schrumpfen lässt. Jede Zelle
              bricht auf vier Zeilen um, und der Vergleich, für den es die Tabelle gab, ist weg.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Setz eine <code>min-width</code> und lass den Container scrollen, oder lass unterhalb eines Breakpoints
              Spalten weg und behalte die, die die Entscheidung tragen. Eine scrollbare Tabelle ist ehrlich; eine
              geschrumpfte nicht.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Eine Liste aus fünfzehn Datensätzen blättern, weil der Paginator schon da war. Jeder Seitenwechsel kostet
              einen Umweg durch die Aufmerksamkeit des Lesers und versteckt zwei Drittel einer Menge, die auf einen
              Bildschirm passt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Zeig alle, und greif zum Paginator, wenn die Menge so lang ist, dass Scrollen keine Navigation mehr ist.
              Wenn du blätterst, zeig den Seitenbericht, damit die Größe des Ganzen sichtbar ist.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Eine unbenannte Tabelle mit einer Überschrift, die über ihr schwebt. Die Überschrift ist ein Geschwister;
              der eigene Name der Tabelle ist weiterhin leer, und die Tabellenliste eines Screenreaders zeigt einen
              namenlosen Eintrag.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Schreib die Worte in ein <code>caption</code>-Template. Es ist sichtbar, es ist der zugängliche Name der
              Tabelle, und es übersteht, aus dem Zusammenhang gelesen zu werden.
            </p>
          </div>
        </div>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/table/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Table pattern</a
            >
            — die Grundlinie, der der äußere Rahmen dieser Komponente entspricht: ein statisches Datenraster ohne
            interaktive Widget-Semantik, und genau das ist eine sortierbare, aber nicht bearbeitbare Tabelle.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Grid pattern</a
            >
            — das Pattern, das Leute zu bekommen glauben, sobald Zeilen auswählbar sind, und der Tastaturvertrag, den
            diese Annahme mit sich bringt. Lesenswert gerade deshalb, weil
            <code>p-table</code> es nicht übernimmt.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/tables/" target="_blank" rel="noopener noreferrer">
              W3C — WAI Tables Tutorial</a
            >
            — die beinahe normative Quelle für die Teile, die die Bibliothek dir zurückgibt:
            <code>scope</code>, <code>caption</code>, die Zuordnung von Headern und wann eine Tabelle geteilt statt
            verschachtelt werden muss.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-sort" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-sort</code></a
            >
            — die erlaubten Werte und, wichtig, dass immer nur eine Spalte eine Richtung beanspruchen sollte. Relevant
            für <code>sortMode="multiple"</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — das Kriterium, an dem eine nur über den Hintergrund ausgewählte Zeile scheitert, und der Grund, warum der
            Tab Beispiele die Auswahl misst, statt sie zu beschreiben.
          </li>
          <li>
            <a href="https://primeng.org/table" target="_blank" rel="noopener noreferrer"> PrimeNG — Table</a>
            — die Upstream-API-Doku für die v21-Codebasis, die Optimus forkt, samt der Erweiterungen, um die dieser Guide
            eine Grenze zieht. Alles hier Gesagte wurde am ausgelieferten Quellcode von
            <code>&#64;openng/optimus-ui</code> 2.0.2 geprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <ul>
          <li>
            <strong>Root</strong> — <code>.p-datatable</code>, ein Wrapper mit
            <code>position: relative; display: block</code>. Modifier-Klassen landen hier:
            <code>p-datatable-striped</code>, <code>p-datatable-gridlines</code>, <code>p-datatable-hoverable</code>,
            <code>p-datatable-sm</code> / <code>-lg</code>, <code>p-datatable-scrollable</code>.
          </li>
          <li>
            <strong>Header- und Footer-Band</strong> — <code>.p-datatable-header</code> und
            <code>.p-datatable-footer</code>, nur gerendert, wenn du ein <code>caption</code>- oder
            <code>summary</code>-Template projizierst. Sie sitzen außerhalb des Tabellenelements.
          </li>
          <li>
            <strong>Tabellen-Container</strong> — <code>.p-datatable-table-container</code>, das Element, das scrollt.
            Seine <code>max-height</code> kommt aus <code>scrollHeight</code>.
          </li>
          <li>
            <strong>Tabelle</strong> — <code>.p-datatable-table</code> mit <code>border-collapse: separate</code>,
            <code>border-spacing: 0</code> und <code>width: 100%</code>. Sie trägt ein explizites
            <code>role="table"</code> und eine generierte <code>id</code>.
          </li>
          <li>
            <strong>Zeilengruppen</strong> — <code>.p-datatable-thead</code>, <code>-tbody</code>, <code>-tfoot</code>,
            jede mit einem expliziten <code>role="rowgroup"</code>.
          </li>
          <li>
            <strong>Header-Zelle</strong> — dein <code>&lt;th&gt;</code>. Mit <code>pSortableColumn</code> bekommt sie
            zusätzlich <code>.p-datatable-sortable-column</code>, <code>role="columnheader"</code>,
            <code>tabindex="0"</code> und ein lebendiges <code>aria-sort</code>; ist sie die sortierte,
            <code>.p-datatable-column-sorted</code>.
          </li>
          <li>
            <strong>Sortier-Icon</strong> — <code>p-sortIcon</code> rendert je nach Richtung eines von drei SVGs. Es ist
            eine eigene Komponente, die du in die Header-Zelle setzt; eine sortierbare Spalte ohne sie sortiert
            stillschweigend.
          </li>
          <li>
            <strong>Zeile</strong> — dein <code>&lt;tr&gt;</code>. Mit <code>pSelectableRow</code> bekommt sie
            <code>.p-datatable-selectable-row</code>, einen wandernden <code>tabindex</code>,
            <code>data-p-selectable-row</code> und — solange sie ausgewählt ist — <code>.p-datatable-row-selected</code>.
          </li>
          <li>
            <strong>Paginator</strong> — eine vollständige <code>p-paginator</code>-Instanz oberhalb, unterhalb oder an
            beiden Stellen, mit eigenen Rahmen-Tokens (<code>datatable.paginator.top|bottom.border.*</code>).
          </li>
        </ul>

        <h3>Token-Kette</h3>
        <p>
          Die Datatable-Gruppe ist ungewöhnlich alias-lastig: Fast jede Fläche ist ein Alias der gemeinsamen Gruppen
          <code>content.*</code>, <code>highlight.*</code> und <code>text.*</code>, deshalb sieht eine Tabelle ohne jede
          Arbeit aus wie der Rest der App. Zwei Folgen, die du vorab kennen solltest:
          <strong>Eine sortierte Header-Zelle und eine ausgewählte Zeile sind dasselbe Material</strong> (beide
          <code>&#123;highlight.*&#125;</code>), und
          <strong>eine gestreifte Zeile ändert ihren Hintergrund, aber nicht ihre Textfarbe</strong>. Preset-Werte aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/datatable/index.mjs</code>; die letzten beiden Spalten lösen die
          Aliase auf. Das Kit lenkt die Füllungen von Header, Zeile und Footer auf die <code>--surface-card</code> des
          Stils um und ergänzt zwei eigene Regeln — den 4px-Balken der ausgewählten Zeile und den einen Fokus-Ring;
          alles andere ist Aura.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CSS-Variable</th>
                <th>Aura-Alias</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              @for (row of tokenRows; track row.varName) {
                <tr>
                  <td>
                    <code>{{ row.varName }}</code>
                  </td>
                  <td>{{ row.alias }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ tokenNote }}</p>

        <h3>Kontrast, eine Zeilenvariante nach der anderen</h3>
        <p>
          Jeder Zeilenzustand malt seinen eigenen Hintergrund, also hat jeder Zeilenzustand seine eigene Kontrastfrage.
          Jedes Paar unten ist gegen die Fläche gemessen, die diese Zeile tatsächlich rendert — nicht gegen die Seite und
          nicht gegen den Standardhintergrund der Zeile.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Hell</th>
                <th>Dunkel</th>
                <th>Untergrenze</th>
              </tr>
            </thead>
            <tbody>
              @for (row of contrastRows; track row.pair) {
                <tr>
                  <td>{{ row.pair }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                  <td>{{ row.floor }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ contrastNote }}</p>

        <h3>Geometrie</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was</th>
                <th>Wert</th>
                <th>Woher er kommt</th>
              </tr>
            </thead>
            <tbody>
              @for (row of geometryRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                  <td>{{ row.origin }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ geometryNote }}</p>

        <h3>Die Fokus-Ringe und warum sie innen liegen</h3>
        <p>{{ focusRingNote }}</p>

        <h3>Umgestalten</h3>
        <ul>
          <li>
            Begrenz die Datatable-Tokens auf eine <code>styleClass</code>, die auf dem Root-Element landet:
            <code>.compact-table &#123; --p-datatable-body-cell-padding: 0.25rem 0.5rem; &#125;</code>. Greif zuerst zum
            Input <code>size</code> — <code>"small"</code> und <code>"large"</code> sind je fünf Padding-Tokens (das
            Header-Band, die Header-Zelle, die Body-Zelle, die Footer-Zelle und das Footer-Band), bereits abgestimmt.
          </li>
          <li>
            Das Stylesheet der Komponente ist nicht gekapselt, eine nackte <code>.p-datatable-tbody &#123; … &#125;</code>-Regel
            in irgendeinem globalen Stylesheet stimmt also jede Tabelle der Anwendung um. Stell ihr immer deine eigene
            Klasse voran.
          </li>
          <li>
            Spaltenbreiten gehören in ein <code>colgroup</code>-Template oder auf die Header-Zellen, nicht auf die
            Body-Zellen — <code>border-collapse: separate</code> heißt, die erste Zeile entscheidet und der Rest folgt.
          </li>
          <li>
            Gestalte den sortierten Header nicht mit einer handverlesenen Farbe um. Er ist
            <code>&#123;highlight.background&#125;</code>, dasselbe Paar, das die ausgewählte Zeile nutzt; eins zu ändern
            und das andere nicht ist der Weg, auf dem eine Tabelle zu zwei verschiedenen „das ist aktiv“-Farben kommt.
          </li>
          <li>
            Gestreifte Zeilen sind <code>:nth-child(odd)</code> auf den gerenderten Zeilen, der Streifen folgt also der
            Position auf der <em>Seite</em>, nicht dem Datensatz. Mit einem Paginator ist die erste Zeile jeder Seite
            gestreift. Das ist normal, und es ist auch der Grund, warum ein Streifen nie das einzige Mittel sein darf, zwei
            Arten von Datensätzen zu unterscheiden.
          </li>
          <li>
            Das Kit verbietet <code>::ng-deep</code>. Eine Tabelle, die in deiner Komponente gerendert wird, erreichst du
            aus einem Komponenten-Stylesheet nur über <code>:host</code> plus eine <code>styleClass</code>; alles andere
            gehört in eine globale Regel mit deinem eigenen Präfix.
          </li>
        </ul>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen ist, wird nicht
          beansprucht. <strong>Erfüllt:</strong> SC 1.4.3 für jede Zeilenvariante in beiden Themes (Standard-Akzent),
          am knappsten die ausgewählte Zeile und der sortierte Header mit 9,34:1 hell und 7,54:1 dunkel — geprüft über
          die Card jedes Stils und jeden Akzent (niedrigster Wert 6,59:1); SC 1.4.11 für das Sortier-Icon in Ruhe
          (4,76:1 hell, 5,12:1 dunkel), für den 4px-Balken des Kits an der ausgewählten Zeile und für den Fokus-Ring des
          Kits (beide mindestens 3,48:1 auf jeder Füllung, auf die sie treffen, geprüft); SC 1.4.1 für das, was das Auge
          sieht — der Balken markiert eine ausgewählte Zeile über die Form, nicht allein über die Tönung; SC 2.4.7, weil
          der Ring in beiden Themes gezeichnet wird; SC 2.1.1 für das Sortieren (Enter und Space auf der Header-Zelle) und
          für das Zeilenmodell (Pfeiltasten, Home und End, Space und Enter); und SC 4.1.2 für eine sortierte Spalte, die
          ein <code>columnheader</code> mit einem lebendigen <code>aria-sort</code> ist. <strong>Nicht erfüllt:</strong>
          SC 4.1.2 für die Zeilenauswahl — <code>pSelectableRow</code> liefert nur eine Klasse, und das
          <code>aria-selected</code> einer Zeile wird unter <code>role="table"</code> ignoriert, der Balken wird also
          gesehen und nicht gehört; und SC 4.1.2 an den Auswahl-Checkboxen, deren Name einmal innerhalb einer
          Subscription zugewiesen wird, er fehlt also, bis diese zum ersten Mal feuert, und ist danach eingefroren, wenn
          du ihn nicht hineingibst. <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Kein eingebautes responsives Verhalten: Spalten behalten ihre Inhaltsbreite, und der Tabellen-Container scrollt
          horizontal, sobald die Tabelle breiter als ihr Elternelement ist — der Container setzt
          <code>overflow: auto</code> auch ohne <code>[scrollable]</code>. Gib der Tabelle eine <code>min-width</code>
          über <code>[tableStyle]</code> und lass sie scrollen; lass vor einem Handy Spalten weg, schrumpf sie nie. Das
          Stack-Layout ist keine Option (siehe Entwicklung).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Die API, mit den Standardwerten, die zählen</h3>
        <p>
          <code>TableModule</code> aus <code>&#64;openng/optimus-ui/table</code>; das Modul exportiert auch die
          Direktiven (<code>pSortableColumn</code>, <code>pSelectableRow</code>, …) und <code>SharedModule</code>.
          Gelesen aus der ausgelieferten Komponente in Optimus UI 2.0.2 (<code>openng-optimus-ui-table.mjs</code>).
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Hinweis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>—</td>
                <td>
                  Das Array. Ein Getter/Setter-Paar, kein Signal-Input: Das Zuweisen eines neuen Arrays löst ein erneutes
                  Sortieren und Filtern aus.
                </td>
              </tr>
              <tr>
                <td><code>dataKey</code></td>
                <td>—</td>
                <td>
                  Das Feld, das eine Zeile identifiziert. Ohne es vergleicht die Auswahl ganze Objekte per tiefer
                  Gleichheit und übersteht nicht, dass das Array ersetzt wird.
                </td>
              </tr>
              <tr>
                <td><code>sortMode</code></td>
                <td><code>'single'</code></td>
                <td>
                  <code>'multiple'</code> lässt mehrere Spalten zugleich sortieren und hält ihre Reihenfolge in
                  <code>multiSortMeta</code>.
                </td>
              </tr>
              <tr>
                <td><code>defaultSortOrder</code></td>
                <td><code>1</code></td>
                <td>Die Richtung, die eine Spalte beim ersten Klick annimmt — aufsteigend.</td>
              </tr>
              <tr>
                <td><code>resetPageOnSort</code></td>
                <td><code>true</code></td>
                <td>Sortieren schickt den Leser zurück auf Seite eins, was fast immer richtig ist.</td>
              </tr>
              <tr>
                <td><code>selectionMode</code></td>
                <td>—</td>
                <td>
                  <code>'single' | 'multiple'</code>. Steuert nur die Auswahl per <em>Zeilenklick</em>; eine
                  Checkbox-Spalte funktioniert ohne.
                </td>
              </tr>
              <tr>
                <td><code>metaKeySelection</code></td>
                <td>
                  <strong><code>false</code></strong>
                </td>
                <td>
                  Einfache Klicks schalten die Auswahl um. Setz es auf true, und mehr als eine Zeile auszuwählen verlangt
                  Ctrl oder Cmd — ein Preis an Auffindbarkeit ohne jeden sichtbaren Hinweis.
                </td>
              </tr>
              <tr>
                <td><code>selectionPageOnly</code></td>
                <td>—</td>
                <td>Begrenzt die Header-Checkbox auf die aktuelle Seite statt auf die ganze Menge.</td>
              </tr>
              <tr>
                <td><code>rowSelectable</code></td>
                <td>—</td>
                <td>
                  Ein Prädikat, das die Auswahl je Zeile verweigert. Es schaltet den <code>tabindex</code> der Zeile nicht
                  ab, eine verweigerte Zeile ist also weiterhin fokussierbar.
                </td>
              </tr>
              <tr>
                <td><code>paginator</code></td>
                <td>—</td>
                <td>
                  Rendert einen <code>p-paginator</code>. <code>paginatorPosition</code> ist standardmäßig
                  <code>'bottom'</code>; <code>'both'</code> rendert zwei unabhängige Instanzen.
                </td>
              </tr>
              <tr>
                <td><code>rows</code>, <code>first</code></td>
                <td>—, <code>0</code></td>
                <td>Seitengröße und Versatz. Beide sind zweiseitig gebunden (<code>rowsChange</code>, <code>firstChange</code>).</td>
              </tr>
              <tr>
                <td><code>totalRecords</code></td>
                <td>
                  <strong><code>0</code></strong>
                </td>
                <td>
                  Wird nur im Lazy-Modus herangezogen — aber es ist das, was der Paginator zählt, eine Lazy-Tabelle, die es
                  vergisst, rendert also überhaupt keine Seitenlinks.
                </td>
              </tr>
              <tr>
                <td><code>alwaysShowPaginator</code></td>
                <td><code>true</code></td>
                <td>
                  Der Paginator bleibt auch bei einer einzigen Ergebnisseite sichtbar. Ihn abzuschalten ist meist der
                  freundlichere Standard.
                </td>
              </tr>
              <tr>
                <td><code>showCurrentPageReport</code></td>
                <td>—</td>
                <td>
                  Zeigt den Bericht-String. Standardmäßig aus, und deshalb verbergen so viele Tabellen, wie viele Daten sie
                  haben.
                </td>
              </tr>
              <tr>
                <td><code>currentPageReportTemplate</code></td>
                <td><code>'&#123;currentPage&#125; of &#123;totalPages&#125;'</code></td>
                <td>
                  Platzhalter: <code>currentPage</code>, <code>totalPages</code>, <code>first</code>,
                  <code>last</code>, <code>rows</code>, <code>totalRecords</code>. Siehe den Tab
                  Internationalisierung (i18n) — diesen String übersetzt du selbst.
                </td>
              </tr>
              <tr>
                <td><code>stripedRows</code>, <code>showGridlines</code>, <code>rowHover</code></td>
                <td>—</td>
                <td>
                  Darstellungs-Flags auf dem Root-Element. <code>rowHover</code> ergibt sich aus
                  <code>selectionMode</code>, eine Tabelle nur mit Checkboxen braucht es also explizit gesetzt, um einen
                  Hover-Hinweis zu bekommen.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>—</td>
                <td>
                  <code>'small' | 'large'</code>, je fünf Padding-Tokens: das Header- und das Footer-Band sowie die
                  Header-, Body- und Footer-Zellen.
                </td>
              </tr>
              <tr>
                <td><code>scrollable</code>, <code>scrollHeight</code></td>
                <td>—</td>
                <td>
                  Sticky Header in einem Container mit begrenzter Höhe. <code>'flex'</code> lässt den Container sein
                  Elternelement füllen, statt eine feste Höhe anzunehmen.
                </td>
              </tr>
              <tr>
                <td><code>tableStyle</code>, <code>tableStyleClass</code></td>
                <td>—</td>
                <td>
                  Landen auf dem <code>&lt;table&gt;</code>; <code>style</code> und <code>styleClass</code> landen auf dem
                  Root-Wrapper. Hier gehört <code>min-width</code> hin.
                </td>
              </tr>
              <tr>
                <td><code>responsiveLayout</code></td>
                <td><code>'scroll'</code></td>
                <td>
                  <strong>Zurück in Optimus</strong> (<code>:943</code>), <code>'stack'</code> eingeschlossen. Lass es auf
                  <code>'scroll'</code> — siehe „Die responsive Frage“ unten.
                </td>
              </tr>
              <tr>
                <td><code>breakpoint</code></td>
                <td><code>'960px'</code></td>
                <td>Wird nur vom veralteten Stack-Layout gelesen.</td>
              </tr>
              <tr>
                <td><code>paginatorLocale</code></td>
                <td>—</td>
                <td>
                  Wird an das <code>locale</code> des Paginators weitergereicht, das die Ziffern in den Seitenlinks und in
                  den Optionen für Zeilen je Seite lokalisiert. Nicht den Bericht-String.
                </td>
              </tr>
              <tr>
                <td><code>rowTrackBy</code></td>
                <td>—</td>
                <td>Das <code>ngForTrackBy</code> des Bodys. Setz es bei großen oder häufig ersetzten Arrays.</td>
              </tr>
              <tr>
                <td><code>customSort</code> + <code>(sortFunction)</code></td>
                <td>—</td>
                <td>
                  Übernehmen den Vergleich — der einzige Weg, nach etwas anderem als dem rohen Feldwert zu sortieren
                  (zum Beispiel locale-bewusste Strings).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Outputs, die sich zu verdrahten lohnen: <code>selectionChange</code>, <code>onRowSelect</code>,
          <code>onRowUnselect</code>, <code>onHeaderCheckboxToggle</code>, <code>onSort</code>, <code>onPage</code>,
          <code>onFilter</code>, <code>onLazyLoad</code>. Templates (als <code>#</code>-Referenznamen;
          <code>pTemplate</code> bindet in Optimus ebenfalls): <code>caption</code>, <code>header</code>,
          <code>body</code>, <code>footer</code>, <code>summary</code>, <code>emptymessage</code>, <code>colgroup</code>,
          <code>loadingbody</code>, <code>paginatorleft</code>, <code>paginatorright</code>, dazu Icon-Slots.
        </p>

        <h3>Sortieren: korrekter Zustand an einem Bedienelement, das es nicht gibt</h3>
        <p>
          <code>pSortableColumn</code> ist eine Direktive auf deiner Header-Zelle. Sie setzt <code>role="columnheader"</code>
          als statisches Host-Attribut, macht die Zelle, solange sie aktiviert ist, mit <code>tabindex="0"</code>
          fokussierbar, hört auf Klick, <code>keydown.enter</code> und <code>keydown.space</code> und bindet
          <code>aria-sort</code> an einen Wert, den sie aus dem Sortierzustand der Tabelle neu berechnet —
          <code>'ascending'</code>, <code>'descending'</code> oder <code>'none'</code>.
        </p>
        <p>
          Das ist die Zustandshälfte des Patterns für sortierbare Spalten, korrekt umgesetzt. Die fehlende Hälfte ist der
          Hinweis aufs Bedienen: Eine fokussierbare Tabellenzelle ist kein Bedienelement. Nichts sagt an, dass Enter etwas
          bewirken wird, und das Sortier-Icon ist Dekoration. Das Beispiel der APG für sortierbare Tabellen setzt genau aus
          diesem Grund einen echten <code>&lt;button&gt;</code> in das <code>&lt;th&gt;</code>. Du kannst hier dasselbe
          tun — den Button in die Zelle setzen und <code>pSortableColumn</code> auf der Zelle lassen —, aber dann sind
          zwei Dinge fokussierbar, also ist <code>[pSortableColumnDisabled]</code> auf der Zelle plus ein Klick-Handler
          am Button die sauberere Form. Sag den Leuten mindestens in Worten, dass die Spalte sortierbar ist, nicht nur mit
          einem Pfeil.
        </p>
        <p class="src-note">
          Host-Metadaten gelesen aus <code>openng-optimus-ui-table.mjs:4682</code>; der <code>aria-sort</code>-Wert wird
          direkt darüber in <code>updateSortState()</code> berechnet. Prüf es in deinem Build, indem du
          <code>aria-sort</code> am fokussierten Header liest: Es muss umspringen, wenn du Enter drückst.
        </p>

        <h3>Auswahl: drei Mechanismen, ein fehlendes Attribut</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mechanismus</th>
                <th>Markup</th>
                <th>Was er dir gibt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Zeilenklick</td>
                <td><code>selectionMode</code> + <code>[pSelectableRow]</code></td>
                <td>
                  Klick, und ein Tastaturmodell auf der Zeile: Pfeiltasten wechseln zwischen Zeilen, Home und End springen,
                  Space und Enter wählen aus, Ctrl/Cmd+A wählt im Mehrfachmodus die Seite aus.
                </td>
              </tr>
              <tr>
                <td>Checkbox-Spalte</td>
                <td><code>p-tableCheckbox</code> + <code>p-tableHeaderCheckbox</code></td>
                <td>
                  Ein explizites, auffindbares Bedienelement je Zeile und ein „Alle auswählen“ im Header. Unabhängig von
                  <code>selectionMode</code>.
                </td>
              </tr>
              <tr>
                <td>Radio-Spalte</td>
                <td><code>p-tableRadioButton</code></td>
                <td>Die Entsprechung für Einzelauswahl, wenn ein Zeilenklick mehrdeutig wäre.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Weder der Zeilenklick noch die Zeilen-Direktive setzt <code>aria-selected</code>.</strong>
          Die Host-Bindings von <code>pSelectableRow</code> sind die Klasse, der wandernde <code>tabindex</code> und ein
          <code>data-p-selectable-row</code>-Attribut
          — sonst nichts. Ab Werk unterscheidet sich eine ausgewählte Zeile von einer nicht ausgewählten allein durch die
          Tönung von Aura; das Kit ergänzt einen 4px-Balken in <code>--primary-color-fg</code> an ihrer Startkante
          (<code>src/styles.scss</code>, geprüft in CONTRAST.MD „table &amp; paginator“), sodass das Auge eine Form
          ebenso wie einen Farbton bekommt (WCAG 1.4.1). Für jeden, der sich mit den Pfeiltasten durch die Zeilen
          bewegt, ist es weiterhin schlicht Stille.
        </p>
        <p>
          Die naheliegende Lösung ist keine Lösung.
          <strong
            ><code>[attr.aria-selected]</code> an die Zeile zu binden ändert nichts, solange die Rolle der Tabelle
            <code>table</code> ist</strong
          >: Das Attribut wird nur auf einer Zeile unterstützt, die einem <code>grid</code> oder einem
          <code>treegrid</code> gehört, und der Accessibility Tree verwirft es überall sonst. Bleiben zwei ehrliche Wege,
          und der erste ist der bessere Standard:
        </p>
        <ul>
          <li>
            <strong>Eine Checkbox-Spalte.</strong> Der Zustand lebt in einem echten Bedienelement, das ihn nativ trägt, er
            übersteht das ausgelieferte <code>role="table"</code>, er ist sichtbar, und es ist die einzige Variante, die
            einem sehenden Mausnutzer sagt, was passieren wird, bevor er klickt. Gib jeder Checkbox ein
            <code>[ariaLabel]</code>, das die Zeile benennt.
          </li>
          <li>
            <strong><code>role="grid"</code> plus <code>[attr.aria-selected]</code>.</strong> Setz die Rolle über
            <code>[pt].table</code> und binde das Attribut an der Zeile; dann steht der Auswahlzustand im Baum. Die Rolle
            ist hier vertretbar, weil die Bibliothek das Tastaturmodell auf Zeilenebene, das ein Grid verspricht, schon
            mitliefert — aber sei dir bewusst, dass jeder sortierbare Header ein eigener Tab-Stopp ist, den ein strenges
            Grid nicht hätte.
          </li>
        </ul>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Markup</th>
                <th>Knoten im Accessibility Tree</th>
              </tr>
            </thead>
            <tbody>
              @for (row of axRows; track row.markup) {
                <tr>
                  <td>{{ row.markup }}</td>
                  <td>{{ row.node }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ axNote }}</p>
        <pre class="code-block"><code>{{ selectionSnippet }}</code></pre>
        <p>
          Zwei weitere Auswahldetails, die Zeit kosten, wenn man sie spät entdeckt. Der Klick-Handler der Zeile
          <strong>kehrt vorzeitig zurück</strong>, wenn der Klick auf einem <code>INPUT</code>-, <code>BUTTON</code>-
          oder <code>A</code>-Element gelandet ist oder auf irgendetwas, das die Bibliothek für klickbar hält — eine
          Aktionsspalte wählt die Zeile also absichtlich nicht aus. Und <code>metaKeySelection</code> ist in dieser
          Version standardmäßig <code>false</code>, was heißt, dass einfache Klicks umschalten; schaltest du es ein, wird
          die Mehrfachauswahl zu einem Geheimnis der Modifier-Tasten ohne sichtbaren Hinweis.
        </p>

        <h3>Was das Ganze im Accessibility Tree ist</h3>
        <p>
          Der äußere Rahmen ist eine einfache Tabelle: <code>role="table"</code> auf dem Tabellenelement und
          <code>role="rowgroup"</code> auf jeder der drei Gruppen, alles statische Attribute im Template der Komponente.
          Das ist der richtige Standard für eine Tabelle, in der niemand Zeilen auswählt, und es ist der Grund, warum die
          Geschichte der Auswahl oben eine Entscheidung braucht: Eine einfache Tabelle kennt keine ausgewählte Zeile, also
          muss der Zustand entweder in einem Bedienelement in der Zeile leben oder in einer Rolle, die ihn unterstützt.
          Greif aus keinem anderen Grund zu <code>role="grid"</code> — es ist ein Versprechen über die Tastatur, und der
          einzige Teil dieses Versprechens, den die Bibliothek hält, ist die Bewegung auf Zeilenebene bei auswählbaren
          Zeilen.
        </p>
        <p>
          Die Lücke, die du schließen musst, ist der Name: Das Tabellenelement bekommt eine generierte <code>id</code> und
          keinen Namen. Ein <code>caption</code>-Template rendert ein Band <em>außerhalb</em> des Tabellenelements, es ist
          also kein <code>&lt;caption&gt;</code> und benennt die Tabelle nicht. Nutz die Pass-through-API, um den Namen
          auf die Tabelle selbst zu setzen:
        </p>
        <pre class="code-block"><code>{{ nameSnippet }}</code></pre>

        <h3>Der leere Zustand</h3>
        <p>
          Ohne <code>emptymessage</code>-Template rendert der Body null Zeilen und sonst nichts — einen Header mit weißer
          Fläche darunter. Das Template wird in <code>&lt;tbody&gt;</code> projiziert, es muss also ein
          <code>&lt;tr&gt;</code> mit einem <code>&lt;td&gt;</code> sein, und diese Zelle braucht ein
          <code>colspan</code>, das jede Spalte abdeckt, sonst sitzt die Meldung in der ersten. Ist die Leere das Ergebnis
          eines Filters, den der Leser gerade getippt hat, pack die Meldung in eine höfliche Live-Region — dass die Zeilen
          verschwinden, ist für sich keine Ansage.
        </p>

        <h3>Die responsive Frage</h3>
        <p>Es gibt zwei Antworten in der Kiste, und nur eine davon ist ein Fundament.</p>
        <ul>
          <li>
            <strong>Scrollen (der Standard).</strong> Gib der Tabelle eine <code>min-width</code> über
            <code>[tableStyle]</code> und lass den Container horizontal scrollen. Zeilen bleiben Zeilen, Header bleiben
            zugeordnet, und der Accessibility Tree ist unverändert. Kombinier es mit <code>[scrollable]="true"</code> und
            einer <code>scrollHeight</code>, wenn die vertikale Achse das Problem ist — das macht den Header sticky.
          </li>
          <li>
            <strong>Stack — wieder ausgeliefert, immer noch falsch.</strong> <code>responsiveLayout="stack"</code> fügt
            eine Media Query ein, die die Header-Zellen versteckt und jede Zeile in Paare aus Label und Wert umbricht; die
            versteckten Header verlassen den Accessibility Tree, also verliert jede Spalte den Namen, der ihren Werten
            Bedeutung gab. PrimeNG 22 hatte das Input entfernt; Optimus stellt es wieder her, samt Deprecation. Greif nicht
            dazu.
          </li>
        </ul>
        <p class="src-note">
          Gelesen aus dem Quellcode von Optimus 2.0.2: <code>responsiveLayout</code> ist standardmäßig
          <code>'scroll'</code> (<code>openng-optimus-ui-table.mjs:943</code>), und <code>'stack'</code> ruft
          <code>createResponsiveStyle()</code> aus <code>onInit</code> auf (<code>:1324-1325</code>), dessen Media Query
          <code>display: none</code> auf <code>thead &gt; tr &gt; th</code> setzt (<code>:3007-3046</code>). Brauchst du
          auf kleinen Bildschirmen ein Karten-Layout, bau es als echte alternative Ansicht statt als Tabelle, die so tut,
          als wäre sie eine; dafür gibt es <code>p-dataview</code>.
        </p>

        <h3>SSR</h3>
        <p>
          Die Tabelle rendert auf dem Server: Zeilen, Zellen und der Paginator stehen alle im statischen HTML, das
          Gegenteil der Overlay-Komponenten und ein guter Grund, für Inhalte, die crawlbar sein müssen, eine Tabelle einem
          Drawer vorzuziehen. Es gibt zwei Pfade nur für den Browser — das responsive Stack-Layout erzeugt sein
          <code>&lt;style&gt;</code>-Element hinter einem <code>isPlatformBrowser</code>-Guard, und die Zustandsspeicherung
          (<code>stateKey</code> / <code>stateStorage</code>) liest den Storage —, also läuft keiner von beiden beim
          Prerendern, und eine Tabelle, die von wiederhergestelltem Zustand abhängt, rendert im statischen HTML ihre
          Standardform.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Eine Tabelle ist die richtige Form: Datensätze werden über Spalten hinweg verglichen, nicht nur aufgelistet.</li>
          <li>
            ☐ Die Tabelle hat einen zugänglichen Namen — eine <code>caption</code> in Worten und den Namen auf dem
            Tabellenelement selbst.
          </li>
          <li>☐ <code>dataKey</code> ist überall gesetzt, wo es Auswahl oder Blättern gibt.</li>
          <li>
            ☐ Wenn Zeilen auswählbar sind, erreicht der Zustand den Accessibility Tree — eine Checkbox-Spalte oder
            <code>role="grid"</code> zusammen mit <code>[attr.aria-selected]</code>. Der visuelle Balken des Kits allein
            und das Attribut allein scheitern beide.
          </li>
          <li>
            ☐ Zeilen-Checkboxen und die Header-Checkbox haben ein explizites <code>[ariaLabel]</code>, das die Zeile
            benennt, gebunden aus der Übersetzungsschicht.
          </li>
          <li>
            ☐ Sortierbare Spalten werden in Worten als sortierbar angesagt, nicht nur über ein Icon, und Enter auf einem
            fokussierten Header sortiert tatsächlich.
          </li>
          <li>
            ☐ Ein <code>emptymessage</code>-Template existiert, seine Zelle hat ein <code>colspan</code>, und eine Leere
            durch einen Filter wird angesagt.
          </li>
          <li>☐ Zahlen sind in Header und Body gleichermaßen rechtsbündig; Text nicht.</li>
          <li>
            ☐ Das Verhalten bei schmalem Viewport ist ein scrollender Container mit einer <code>min-width</code>, keine
            schrumpfenden Spalten.
          </li>
          <li>☐ <code>currentPageReportTemplate</code> ist aus der Übersetzungsschicht gebunden, wenn der Bericht angezeigt wird.</li>
          <li>
            ☐ Beide Themes wurden angesehen, auch eine gestreifte und eine ausgewählte Zeile — jede hat ihren eigenen
            Hintergrund.
          </li>
          <li>
            ☐ Nichts in der Tabelle hängt von einer Funktion ab, um die dieser Guide eine Grenze zieht, ohne dass diese
            Funktion gesondert geprüft wurde.
          </li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Ein Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), der die drei Dinge festnagelt, die zuerst verrotten — den Namen,
          den Sortierzustand und das Auswahl-Attribut, das die Bibliothek nicht für dich schreibt:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Drei Familien von Strings, und sie verhalten sich verschieden</h3>
        <p>
          Der Text einer Tabelle kommt aus drei Quellen, und jede hat ihre eigene Art zu scheitern. Zu wissen, welche
          welche ist, ist der größte Teil der Arbeit.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Kommt aus</th>
                <th>Folgt einem Sprachwechsel?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spaltenköpfe, Zellinhalt, die Caption, die Meldung für den leeren Zustand</td>
                <td>Deinem Template</td>
                <td>Ja, wenn du sie aus einem <code>computed()</code> bindest statt aus einem einmal gelesenen Feld</td>
              </tr>
              <tr>
                <td>Namen der Paginator-Buttons (erste / vorige / nächste / letzte), Seitenlinks, Zeilen je Seite</td>
                <td>Der Übersetzungskonfiguration der Bibliothek, gelesen über Methodenaufrufe im Template</td>
                <td>Ja — die Methoden laufen bei jeder Change Detection neu</td>
              </tr>
              <tr>
                <td>Namen der Zeilen-Checkboxen und der Header-Checkbox</td>
                <td>Der Übersetzungskonfiguration der Bibliothek, einmal innerhalb einer Subscription zugewiesen</td>
                <td><strong>Nein</strong> — siehe unten</td>
              </tr>
              <tr>
                <td>Der Seitenbericht</td>
                <td>Deinem <code>currentPageReportTemplate</code></td>
                <td>Ja, wenn du es bindest. Der Standard ist ein englisches Literal.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Die Checkbox-Labels: gleich doppelt kaputt</h3>
        <p>
          <code>p-tableCheckbox</code>, <code>p-tableHeaderCheckbox</code> und <code>p-tableRadioButton</code> greifen
          jeweils auf einen String aus der Übersetzungskonfiguration zurück — aber die Zuweisung lautet
          <code>this.ariaLabel = this.ariaLabel || …</code> und lebt in einer Subscription, nicht in einem
          Template-Binding. Drei Folgen, geordnet danach, wie sehr sie wehtun:
        </p>
        <ul>
          <li>
            Das Label <strong>fehlt, bis diese Subscription feuert</strong>. Die Checkboxen einer frisch gerenderten
            Tabelle haben überhaupt keinen Ersatznamen.
          </li>
          <li>
            Einmal zugewiesen ist es <strong>eingefroren</strong>: Der <code>||</code>-Guard sorgt dafür, dass es sich nie
            wieder aktualisiert, es beschreibt also weiter den Zustand, in dem die Zeile war, als die Subscription zum
            ersten Mal lief.
          </li>
          <li>
            Ein späteres <code>setTranslation</code> — ein Sprachwechsel — <strong>erreicht es nicht</strong>, weil nichts
            die Konfiguration neu liest.
          </li>
        </ul>
        <p>
          Und die Standardwerte wären auch dann falsch, wenn der Mechanismus funktionierte: Es sind Zustandssätze („Row
          Selected“ / „Row Unselected“), angehängt an eine Checkbox, die ihren Haken-Zustand schon selbst ansagt, und sie
          benennen die Zeile nicht. <strong>Gib <code>[ariaLabel]</code> immer explizit mit</strong>, aus deiner
          Übersetzungsschicht, und benenn darin den Datensatz: Das ist der einzige Weg, der beim ersten Rendern korrekt
          ist, nach einer Änderung der Auswahl korrekt ist und nach einem Sprachwechsel korrekt ist.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Das Vokabular des Paginators und was dieses Kit hineinschiebt</h3>
        <p>
          Die Namen der Paginator-Buttons kommen aus dem <code>aria</code>-Block der Übersetzungskonfiguration der
          Bibliothek — <code>firstPageLabel</code>, <code>prevPageLabel</code>, <code>nextPageLabel</code>,
          <code>lastPageLabel</code>, <code>pageLabel</code>, <code>rowsPerPageLabel</code>,
          <code>jumpToPageDropdownLabel</code>. Sie werden auf Englisch ausgeliefert und über Methodenaufrufe gelesen,
          neue Werte per <code>setTranslation</code> hineinzuschieben aktualisiert sie also live.
        </p>
        <p>
          Dieses Kit schiebt die <code>aria</code>-Schlüssel, die seine Komponenten tatsächlich lesen, in der Sprache der
          Seite hinein, statt das ganze Vokabular zu übersetzen — die Liste ist <code>OPTIMUS_ARIA_KEYS</code> in
          <code>optimus-a11y.service.ts</code>, und <strong>alle sieben Paginator-Schlüssel stehen darin</strong>, der
          Paginator einer Kit-Tabelle ist also bereits auf Deutsch, Englisch und in beiden Varianten in Einfacher Sprache
          benannt. Ein neuer Schlüssel, den du brauchst, kommt in diese Liste und in die
          <code>optimus</code>-Übersetzungsdateien. Zwei Mechaniken, die du beachten musst, wenn du selbst etwas
          hineinschiebst: <code>setTranslation</code> mischt nur eine Ebene tief, der <code>aria</code>-Block muss also
          gespreizt werden, bevor er erweitert wird, und die Header-Checkbox liest zufällig <code>selectAll</code> /
          <code>unselectAll</code> — Schlüssel, die das Kit ebenfalls hineinschiebt —, was ein Zufall ist und kein Ersatz
          für das explizite <code>[ariaLabel]</code> oben.
        </p>

        <h3>Der Seitenbericht steht überhaupt nicht in der Übersetzungskonfiguration</h3>
        <p>
          <code>currentPageReportTemplate</code> ist standardmäßig
          <code>'&#123;currentPage&#125; of &#123;totalPages&#125;'</code>. Dieses „of“ ist ein englisches Wort in einem
          Komponenten-Input, kein Übersetzungsschlüssel, und kein noch so häufiges <code>setTranslation</code> bewegt es.
          Binde das Template aus deiner Übersetzungsschicht und lass die Platzhalter unangetastet — sie werden per
          einfacher String-Ersetzung ausgetauscht, ein Übersetzer darf sie also umstellen, aber nicht umbenennen.
        </p>
        <p>
          Noch eine Asymmetrie im selben Bereich: <code>paginatorLocale</code> lokalisiert die <em>Ziffern</em> in den
          Seitenlinks und in den Optionen für Zeilen je Seite über <code>Intl.NumberFormat</code>, aber der Seitenbericht
          wird per einfacher String-Umwandlung gebaut, und das <code>aria-label</code> der Seitenlinks nutzt die rohe Zahl.
          In einem Locale mit nicht-lateinischen Ziffern sind die sichtbare Seitenzahl und die angesagte in verschiedenen
          Zahlensystemen geschrieben.
        </p>

        <h3>Spaltenbreite ist ein Sprachproblem</h3>
        <p>
          Header-Labels sind die Strings, die am stärksten wachsen: Ein englischer Spaltenkopf aus einem Wort ist anderswo
          regelmäßig zwei oder drei Wörter lang, und eine nach dem Englischen bemessene Tabelle bricht ihre Header in der
          nächsten Sprache um oder, schlimmer, drückt die ganze Tabelle über den Container hinaus. Setz die
          <code>min-width</code> der Tabelle nach der längsten Sprache, die du auslieferst, halte Spaltenköpfe bei
          Substantiven statt Sätzen und denk daran, dass die Header-Zelle <code>text-align: start</code> hat — sie erbt
          die Schreibrichtung, also muss nichts von Hand gespiegelt werden.
        </p>

        <h3>RTL</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aspekt</th>
                <th>Verhalten in einem Dokument von rechts nach links</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rtlRows; track row.aspect) {
                <tr>
                  <td>{{ row.aspect }}</td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ rtlNote }}</p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Zeilen und Header malen
            die <code>--surface-card</code> des Stils; die ausgewählte Zeile trägt den 4px-Akzentbalken des Kits; Zeilen
            und Sortier-Header tragen den einen 2px-Ring innerhalb ihrer Kante; die Paare für Zeile, Auswahl, Balken und
            Ring sind aus CONTRAST.MD zitiert; die Paginator-Schlüssel gehören zum aria-Satz, den das Kit hineinschiebt.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Erneut geprüft gegen Optimus UI 2.0.2 und die visuellen Stile
            (ADR-0016): Die Token- und Kontrasttabellen sagen jetzt, welche Werte die Standardpalette von Aura sind (in
            jedem Stil identisch) und welche dem Akzent folgen; das Verhältnis für die ausgewählte Zeile und den sortierten
            Header im Dunkelmodus wird je Host-Fläche angegeben statt als eine Messung; Aussage zum schmalen Bildschirm
            unter Design ergänzt; die Synchronisierung der aria-Strings ist in
            <code>optimus-a11y.service.ts</code> verortet; Verlauf mit dem Neuesten zuerst; Agenten-Doku gekürzt.
          </li>
          <li>
            <strong>v0.4</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): Drei Aussagen von v0.3
            kippen zurück. <code>responsiveLayout</code> existiert wieder (Standard <code>'scroll'</code>,
            <code>:943</code>), und ebenso der veraltete <code>'stack'</code>-Modus mit seinen Kosten für die Header;
            <code>pTemplate</code> bindet wieder, weil die <code>PrimeTemplate</code>-Content-Query aus v21 den Fork
            überlebt hat; und die Namen der Checkboxen und Radios werden erneut innerhalb der Auswahl-Subscription
            zugewiesen (<code>:5982</code>, <code>:6167</code>) statt in einem lebendigen Computed — beim ersten Rendern
            fehlend, dann eingefroren. Die Selektoren waren die ganze Zeit camelCase (<code>p-sortIcon</code>,
            <code>p-tableCheckbox</code>). Aura ist zurück auf 2.x-Tokens, die Geometrie ist also wieder unkomprimiert
            (Zell-Padding <code>0.75rem 1rem</code>) — die gemessene Geometrietabelle trug diese Werte bereits. Alle
            Zeilenverweise gegen die Optimus-Bundles neu abgeleitet.
          </li>
          <li>
            <strong>v0.3</strong> — 23.08.2026 — Erneut geprüft gegen PrimeNG 22.1. Zwei Entfernungen im Upstream
            festgehalten: <code>responsiveLayout</code> (der Stack-Modus und seine Kosten für die Header sind Geschichte)
            und das Binden über <code>pTemplate</code> (Templates über <code>#</code>-Referenznamen, Demo-Markup migriert —
            der alte Rat zu Kollisionen je View umgekehrt). Die Namen der Tabellen-Checkboxen und -Radios lösen sich jetzt
            live auf (<code
              >ariaLabel() || aria.selectRow</code
            >, :5504), statt in einer Subscription einzufrieren — gib trotzdem <code>[ariaLabel]</code> mit. Selektoren
            kleingeschrieben (<code>p-sortIcon</code>, <code>p-tableCheckbox</code>). Aura 3.0 hat die ganze Geometrie
            komprimiert (Zell-Paddings ~0.75/1rem → 0.5/0.875rem); Farben unverändert. Zeilenverweise gegen 22.1.2 neu
            abgeleitet.
          </li>
          <li>
            <strong>v0.2</strong> — 20.08.2026 — Zusammenfassung des WCAG-2.2-Status im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht
            beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erste Fassung des Guides, Kernumfang mit den Data-Grid-Erweiterungen
            als erklärte Grenze: der Gerüst-Vertrag zwischen Bibliothek und Template; Sortierzustand gegenüber dem
            fehlenden Hinweis aufs Bedienelement; die drei Auswahlmechanismen, das <code>aria-selected</code>, das niemand
            setzt, und die Tatsache, dass es zu setzen unter <code>role="table"</code> nichts ändert; die Checkbox-Labels,
            die einmal innerhalb einer Subscription zugewiesen werden; die übersetzbaren Namen des Paginators gegenüber
            seinem nicht übersetzbaren Seitenbericht; gemessene Aura-Token- und Kontrastketten je Zeilenvariante in beiden
            Themes; das veraltete Stack-Layout und was es kostet; und die kanonische Agenten-Doku.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TableArticleDeComponent extends TableArticleComponent {
  // ---------------------------------------------------------------- the data

  override readonly birds: Bird[] = [
    { id: 1, name: 'Haussperling', family: 'Passeridae', wingspan: 24, status: 'Nicht gefährdet' },
    { id: 2, name: 'Mauersegler', family: 'Apodidae', wingspan: 42, status: 'Nicht gefährdet' },
    { id: 3, name: 'Schleiereule', family: 'Tytonidae', wingspan: 90, status: 'Nicht gefährdet' },
    { id: 4, name: 'Zaunkönig', family: 'Troglodytidae', wingspan: 15, status: 'Nicht gefährdet' },
    { id: 5, name: 'Weißstorch', family: 'Ciconiidae', wingspan: 215, status: 'Nicht gefährdet' },
    { id: 6, name: 'Wachtelkönig', family: 'Rallidae', wingspan: 53, status: 'Nicht gefährdet' },
    { id: 7, name: 'Kiebitz', family: 'Charadriidae', wingspan: 70, status: 'Potenziell gefährdet' },
    { id: 8, name: 'Steinkauz', family: 'Strigidae', wingspan: 56, status: 'Nicht gefährdet' },
  ];

  /** The base initializer sliced the English rows before this class ran; slice the German ones. */
  override readonly fewBirds: Bird[] = this.birds.slice(0, 4);

  // ---------------------------------------------------------------- playground

  override readonly selectionOptions = [
    { label: 'none', value: null },
    { label: 'single', value: 'single' },
    { label: 'multiple', value: 'multiple' },
  ];

  override readonly sortModeOptions = [
    { label: 'single (Standard)', value: 'single' },
    { label: 'multiple', value: 'multiple' },
  ];

  override readonly sizeOptions = [
    { label: 'normal (Standard)', value: undefined },
    { label: 'small', value: 'small' },
    { label: 'large', value: 'large' },
  ];

  override readonly reportOptions = [
    { label: 'der ausgelieferte Standard', value: '{currentPage} of {totalPages}' },
    { label: 'ein gebundener, übersetzter', value: 'Zeile {first} bis {last} von {totalRecords}' },
  ];

  override readonly pgPt = computed(() => {
    const name = { 'aria-label': 'Europäische Vögel, Playground' };
    return this.pgSelectionMode() ? { table: { role: 'grid', ...name } } : { table: name };
  });

  override readonly pgHint = computed(() => {
    const parts: string[] = [];
    const mode = this.pgSelectionMode();
    parts.push(
      mode
        ? 'Zeilen sind anklickbar (' +
            mode +
            '); Pfeiltasten, Home, End, Space und Enter funktionieren, sobald eine Zeile den Fokus hat.'
        : 'Keine Auswahl per Zeilenklick.',
    );
    if (this.pgCheckbox()) parts.push('Die Checkbox-Spalte funktioniert unabhängig von selectionMode.');
    if (!this.pgHover() && !mode)
      parts.push('Kein Hover-Hinweis: rowHover ist aus, und selectionMode bringt es nicht mit.');
    if (this.pgPaginator())
      parts.push('Die Streifen gelten je gerenderter Seite, also ist die erste Zeile jeder Seite gestreift.');
    return parts.join(' ');
  });

  // ------------------------------------------------------ selection instrument

  /** Reads a rendered table back, as the English base does, with the readout words in German. */
  protected override describeTable(scope: string): TableReadout {
    if (!this.isBrowser) return this.empty;
    const table = document.querySelector<HTMLElement>('.' + scope + ' table');
    const rows = Array.from(document.querySelectorAll<HTMLElement>('.' + scope + ' tbody > tr'));
    return {
      role: table?.getAttribute('role') ?? '(keine)',
      rows: rows.map((tr, i) => {
        const attr = tr.getAttribute('aria-selected');
        return {
          row: 'Zeile ' + (i + 1),
          visual: tr.classList.contains('p-datatable-row-selected') ? 'hervorgehoben' : 'schlicht',
          aria: attr === null ? '(fehlt)' : attr,
        };
      }),
    };
  }

  // --------------------------------------------------------- sort instrument

  override refreshSortReadout(): void {
    if (!this.isBrowser) return;
    const cells = Array.from(document.querySelectorAll<HTMLElement>('.sort-demo thead th'));
    this.sortReadout.set(
      cells.map(
        (th): RowReadout => ({
          row: (th.textContent || '').trim() || 'Spalte',
          visual: th.classList.contains('p-datatable-column-sorted') ? 'als sortiert markiert' : 'nicht markiert',
          aria: th.getAttribute('aria-sort') ?? '(fehlt)',
        }),
      ),
    );
  }

  // ------------------------------------------------------------------ pager

  /** The playground's own report string, in German. */
  override readonly pgReport = '{first}-{last} von {totalRecords}';

  // ------------------------------------------------------- measured reference

  override readonly tokenRows = [
    {
      varName: '--p-datatable-row-background',
      alias: '{content.background} — das Kit lenkt es auf var(--surface-card) um',
      light: '#ffffff',
      dark: 'die Card des Stils (werkbund #1d1d21)',
    },
    { varName: '--p-datatable-row-color', alias: '{content.color}', light: '#334155', dark: '#ffffff' },
    {
      varName: '--p-datatable-row-hover-background',
      alias: '{content.hover.background}',
      light: '#f1f5f9',
      dark: '#27272a',
    },
    {
      varName: '--p-datatable-row-striped-background',
      alias: '{surface.50} / {surface.950}',
      light: '#f8fafc',
      dark: '#09090b',
    },
    {
      varName: '--p-datatable-row-selected-background',
      alias: '{highlight.background}',
      light: '#fffff2',
      dark: 'color-mix(in srgb, #f5743f, transparent 84%)',
    },
    {
      varName: '--p-datatable-row-selected-color',
      alias: '{highlight.color}',
      light: '#8f0e00',
      dark: 'rgba(255,255,255,.87)',
    },
    {
      varName: '--p-datatable-header-cell-background',
      alias: '{content.background} — das Kit lenkt es auf var(--surface-card) um',
      light: '#ffffff',
      dark: 'die Card des Stils (werkbund #1d1d21)',
    },
    {
      varName: '--p-datatable-header-cell-selected-background / -color',
      alias: '{highlight.*} — dasselbe Paar wie bei der Zeile',
      light: '#fffff2 / #8f0e00',
      dark: 'dasselbe color-mix / rgba(255,255,255,.87)',
    },
    {
      varName: '--p-datatable-border-color',
      alias: '{content.border.color} / {surface.800}',
      light: '#e2e8f0',
      dark: '#27272a',
    },
    {
      varName: '--p-datatable-body-cell-selected-border-color',
      alias: '{primary.100} / {primary.900}',
      light: '#ffffd8',
      dark: '#5c0000',
    },
    { varName: '--p-datatable-sort-icon-color', alias: '{text.muted.color}', light: '#64748b', dark: '#a1a1aa' },
    {
      varName: '--p-datatable-header-cell-focus-ring-*',
      alias: '{focus.ring.*}, Offset ein Literal von -1px — ersetzt durch den Ring des Kits',
      light: '2px solid --primary-color-fg, Offset -2px',
      dark: '2px solid --primary-color-fg, Offset -2px',
    },
    {
      varName: 'Balken der ausgewählten Zeile (eine Kit-Regel, kein Token)',
      alias: 'var(--primary-color-fg), 4px an der Startkante',
      light: 'der Akzent-Vordergrund',
      dark: 'der Akzent-Vordergrund',
    },
    {
      varName: '--p-datatable-body-cell-padding',
      alias: 'ein Literal im Preset',
      light: '0.75rem 1rem',
      dark: 'identisch',
    },
  ];

  override readonly tokenNote =
    'Aliase aus dem Aura-Preset in @openng/optimus-ui-themes (die Module datatable und base). Die Zeilen für Text, Streifen, Hover und Rahmen sind die Standardpalette von Aura (slate hell, zinc dunkel); die Füllungen von Header, Zeile und Footer nehmen die eigene --surface-card des Stils (styles.scss, der Block vor dem Balken der ausgewählten Zeile), weil das dunkle content.background von Aura (#18181b) die Card keines Stils ist und eine Tabelle auf einer Card als dunklere Platte erschien. Die Zeilen für Highlight, Rahmen der Auswahl und Fokus-Ring leiten sich aus {primary.*} ab, das theme.service.ts aus dem gewählten Akzent baut; die gezeigten Werte sind der Standard-Akzent sunset. Zwei Dinge folgen aus den Aliasen statt aus irgendeiner Regel: Die sortierte Header-Zelle und die ausgewählte Zeile lösen sich in dasselbe {highlight.*}-Paar auf, sie sind also ein Material und müssen gemeinsam umgestaltet werden; und es gibt kein Text-Token für gestreifte Zeilen, eine gestreifte Zeile behält also die gewöhnliche Zeilenfarbe auf einem anderen Hintergrund. Der dunkle Auswahlhintergrund ist keine flache Farbe, sondern eine 16-%-Tönung der Primärfarbe über der Card — siehe den Kontrasthinweis.';

  override readonly contrastRows = [
    {
      pair: 'Header-Zelle und Text einer schlichten Zeile auf der Card (geprüft)',
      light: '10,35:1',
      dark: '13,13:1 bis 16,80:1, je nach Stil',
      floor: '4,5:1',
    },
    { pair: 'Zelltext auf einer gestreiften Zeile', light: '9,9:1', dark: '19,9:1', floor: '4,5:1' },
    { pair: 'Zelltext auf einer Zeile unter Hover', light: '13,35:1', dark: '14,89:1', floor: '4,5:1' },
    {
      pair: 'Text der ausgewählten Zeile und der sortierte Header (geprüft)',
      light: '9,34:1',
      dark: '7,54:1 bis 9,13:1, je nach Stil',
      floor: '4,5:1',
    },
    {
      pair: 'der 4px-Balken der ausgewählten Zeile auf der Tönung / auf einer schlichten Zeile (geprüft)',
      light: '5,14:1 / 5,18:1',
      dark: '4,13:1 bis 5,07:1 / 5,80:1 bis 7,42:1',
      floor: '3:1',
    },
    { pair: 'Sortier-Icon in Ruhe auf dem Header', light: '4,76:1', dark: '5,12:1 bis 6,56:1, je nach Stil', floor: '3:1' },
    {
      pair: 'Fokus-Ring des Kits in einer schlichten / gehoverten / ausgewählten Zeile (geprüft)',
      light: '5,18:1 / 4,73:1 / 5,14:1',
      dark: '5,80:1 bis 7,42:1 / 6,58:1 / 4,13:1 bis 5,07:1',
      floor: '3:1',
    },
  ];

  override readonly contrastNote =
    'Standard-Akzent sunset, jedes Paar gegen die Fläche, die diese Zeilenvariante tatsächlich malt. Die als geprüft markierten Zeilen werden bei jedem Build in docs/generated/CONTRAST.MD gemessen: „table & paginator“ (datatable.row.color auf datatable.row.background; datatable.row.selected.color auf seinem Hintergrund, 6,59–20,38:1 über alle Akzente; der Balken der ausgewählten Zeile, 3,48–17,85:1) und „focus ring“ (Fokus-Ring des Kits, innen, auf den Füllungen in Ruhe, bei Hover und bei Auswahl, 3,48–17,85:1). Das Sortier-Icon ist {text.muted.color} auf der Card, dieselben Werte, die das Gate als paginator.nav.button.color misst. Gestreifte und gehoverte Zeilen behalten die deckenden Tönungen von Aura und werden nicht geprüft. Im Dunkelmodus sind die ausgewählte Zeile und der sortierte Header eine 16-%-Tönung der Primärfarbe; da das Kit die Zeile selbst mit --surface-card malt, liegt die Tönung immer über der Card des Stils, das Verhältnis folgt also dem Stil und dem Akzent — nicht mehr der Fläche hinter der Tabelle.';

  override readonly geometryRows = [
    {
      what: 'Padding der Header- und Body-Zellen',
      value: '12 x 16px (0.75rem 1rem)',
      origin: 'datatable.header.cell.padding / .body.cell.padding',
    },
    { what: 'dieselben Zellen bei size="small"', value: '6 x 8px (0.375rem 0.5rem)', origin: 'die sm-Padding-Tokens' },
    { what: 'dieselben Zellen bei size="large"', value: '16 x 20px (1rem 1.25rem)', origin: 'die lg-Padding-Tokens' },
    {
      what: 'Zellrahmen',
      value: '1px nur an der Unterkante, 0 an den anderen drei',
      origin: 'border-width: 0 0 1px 0 im Basis-Stylesheet',
    },
    {
      what: 'das Tabellenelement',
      value: 'border-collapse: separate, border-spacing: 0, width: 100%',
      origin: '.p-datatable-table',
    },
    {
      what: 'der Scroll-Container',
      value: 'overflow: auto, inline gesetzt; max-height aus scrollHeight',
      origin: 'die Komponente schreibt es als Inline-Style',
    },
    { what: 'Sortier-Icon', value: '14 x 14px (0.875rem)', origin: 'datatable.sort.icon.size' },
    { what: 'Schriftstärke des Spaltentitels', value: '600', origin: 'datatable.column.title.font.weight' },
    {
      what: 'Textausrichtung der Zellen',
      value: 'start — logisch, folgt also der Schreibrichtung',
      origin: 'text-align: start im Basis-Stylesheet',
    },
  ];

  override readonly geometryNote =
    'Berechneter Style bei einem Viewport von 1440 x 900. Der Scroll-Container verdient Beachtung: Der Overflow ist auch ohne [scrollable] da, deshalb braucht eine breite Tabelle nichts weiter als eine min-width auf der Tabelle.';

  override readonly focusRingNote =
    'In Ruhe nichts. Per Tastatur fokussiert zeichnen eine sortierbare Header-Zelle und eine auswählbare Zeile beide den einen Ring des Kits — 2px solid --primary-color-fg, der Ring, den jeder fokussierbare Teil von Optimus trägt — anstelle des 1px-Rings in {primary.color} von Aura. Er behält die Platzierung von Aura, knapp innerhalb des Teils (outline-offset: -2px, die Inset-Regel des Kits), und das ist der einzige Ort, an dem er sitzen kann: Die Zeilen und Header liegen in einem scrollenden Wrapper, der einen äußeren Ring abschneiden würde, und ein Ring außerhalb einer Zelle würde auf die Nachbarzeile überlaufen. Innen trifft er auf die eigene Füllung der Zeile — schlicht, gehovert oder ausgewählt —, und das Gate misst ihn auf allen dreien („focus ring“, Fokus-Ring des Kits, innen: 3,48–17,85:1 über jeden Stil, jeden Modus und jeden Akzent). Der Umschalt-Button zum Aufklappen von Zeilen trägt denselben Ring außerhalb von sich selbst.';

  override readonly axRows = [
    { markup: 'das Tabellenelement, wie ausgeliefert', node: 'table, Name "" — die generierte id benennt nichts' },
    { markup: '[pt]="{ table: { \'aria-label\': … } }"', node: 'table, Name "Europäische Vögel nach Spannweite"' },
    { markup: 'thead / tbody / tfoot', node: 'rowgroup' },
    { markup: 'dein <tr>, dein <td>', node: 'row / cell, die Zelle benannt durch ihren Text' },
    { markup: '<th pSortableColumn>', node: 'columnheader, benannt durch seinen Text, mit aria-sort' },
    { markup: 'das <p-sortIcon>-SVG', node: 'ein unbenannter Bildknoten — kein aria-hidden gesetzt' },
    { markup: 'eine ausgewählte Zeile, Standard der Bibliothek', node: 'row, fokussierbar — nichts über die Auswahl' },
    {
      markup: 'dieselbe Zeile + [attr.aria-selected]',
      node: 'row, fokussierbar — immer noch nichts: Das Attribut wird unter role="table" verworfen',
    },
    { markup: 'dasselbe noch einmal, mit role="grid" auf der Tabelle', node: 'row, selected=true' },
    {
      markup: 'Header-Zellen, vom Stack-Layout versteckt',
      node: 'Rolle "none" — die Spaltenköpfe verlassen den Baum; die Zellen bleiben Zellen',
    },
  ];

  override readonly axNote =
    'Aus dem Accessibility Tree des Browsers gelesen, einmal je Variante, mit einer ausgewählten Zeile. Die mittleren drei Zeilen sind das ganze Argument zur Auswahl an einem Ort: Das Attribut steht im DOM und nicht im Baum, weil aria-selected auf einer Zeile nur innerhalb eines grid oder treegrid unterstützt wird. Die letzte Zeile sind die gemessenen Kosten des veralteten Stack-Layouts — display:none auf den Header-Zellen entfernt sie vollständig aus dem Baum, die Zellen überleben also, verlieren aber die Header, die ihnen Bedeutung gaben.';

  override readonly rtlRows = [
    {
      aspect: 'Ausrichtung von Zellen und Headern',
      note: 'Korrekt ohne Eingriff. Das Basis-Stylesheet nutzt text-align: start, beide drehen sich also mit der Richtung des Dokuments; gemessen als start in einem dir="rtl"-Dokument, rechtsbündig gerendert.',
    },
    {
      aspect: 'Zellrahmen, wie ausgeliefert',
      note: 'Sicher. Die einzige Kante, die eine Zelle zeichnet, ist ihre untere, und eine Breite unten hat kein Links oder Rechts zum Spiegeln.',
    },
    {
      aspect: 'Zellrahmen mit showGridlines',
      note: 'Nicht sicher, und das ist die eine Stelle, an der die Komponente in RTL schlechter ist als die Overlay-Komponenten. Jede Gitterlinien-Regel setzt die physische Kurzschreibweise border-width, und sieben der achtzehn setzen links und rechts unterschiedlich, also dreht sich nichts: In einem RTL-Dokument gemessen verliert die Tabelle ihre rechte Außenkante vollständig, während die Grenze neben der letzten Spalte zwei 1px-Linien zeichnet, wo der Rest des Gitters eine zeichnet. Formulier die Breiten unter deiner eigenen Klasse logisch neu, bevor du Gitterlinien in einer Sprache von rechts nach links auslieferst.',
    },
    { aspect: 'Padding', note: 'Symmetrisch (16px auf beiden Seiten bei der Standardgröße), also nichts zu spiegeln.' },
    {
      aspect: 'Der Umschalter zum Aufklappen von Zeilen',
      note: 'Das Stylesheet liefert eine explizite :dir(rtl)-Regel mit, die sein Chevron um 180 Grad dreht — die eine Stelle, an der die Bibliothek etwas von Hand spiegelt.',
    },
    {
      aspect: 'Numerische Spalten',
      note: 'Deine Sache. Eine rechtsbündige Zahlenspalte in einem LTR-Layout ist class="num" in deinem Template; nichts in der Bibliothek weiß, welche Spalten numerisch sind.',
    },
  ];

  override readonly rtlNote =
    'Berechneter Style und gerenderte Box-Positionen an denselben Zellen mit dir="rtl" auf dem Dokumentelement, verglichen mit denselben Zellen in dir="ltr". Was die Spiegelung übersteht, ist das, was logisch oder symmetrisch geschrieben ist — text-align: start, der Rahmen an der Unterkante, das gleiche Padding auf beiden Seiten. Was nicht übersteht, ist die Gitterlinien-Variante: Das ausgelieferte Stylesheet trägt unter keinem .p-datatable-Selektor eine border-inline-Deklaration und in der ganzen Komponente genau eine :dir(rtl)-Regel, am Chevron des Zeilen-Umschalters. Die numerische Ausrichtung ist in beiden Richtungen deine Sache; nichts in der Bibliothek weiß, welche Spalten Zahlen sind.';
}
