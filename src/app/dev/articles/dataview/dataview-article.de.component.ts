import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, DataviewArticleComponent, Row, ARTICLE_IMPORTS, ARTICLE_STYLES } from './dataview-article.component';

/**
 * German twin of the DataView, OrderList, and PickList guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the demo rows, the announcement
 * text and the visible strings in `m` are German. Keep it in step with the
 * English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs dataview`).
 */
@Component({
  selector: 'app-dataview-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'dataview'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Drei Komponenten, die wie eine Familie aussehen und keine sind. DataView ist ein Rahmen um Cards, die du
          selbst schreibst; die anderen beiden besitzen ihre Zeilen und geben dir Buttons, die sie verschieben. Gemeinsam
          ist ihnen der Teil, den niemand sieht: Eine Verschiebung passiert, und niemand sagt etwas dazu.
        </p>

        <h3>DataView — der Rahmen und der Umschalter, den er nicht mitliefert</h3>
        <div class="stage">
          <div class="stage__bar">
            <button type="button" class="plain" (click)="layout.set('list')" [attr.aria-pressed]="layout() === 'list'">
              Liste
            </button>
            <button type="button" class="plain" (click)="layout.set('grid')" [attr.aria-pressed]="layout() === 'grid'">
              Raster
            </button>
          </div>
          <p-dataView [value]="cards" [layout]="layout()" [paginator]="true" [rows]="2">
            <ng-template #list let-items>
              <ul class="dv-list">
                @for (c of items; track c.id) {
                  <li><strong>{{ c.title }}</strong> — {{ c.note }}</li>
                }
              </ul>
            </ng-template>
            <ng-template #grid let-items>
              <div class="dv-grid">
                @for (c of items; track c.id) {
                  <div class="dv-tile"><strong>{{ c.title }}</strong><span>{{ c.note }}</span></div>
                }
              </div>
            </ng-template>
          </p-dataView>
        </div>
        <p class="src-note">
          Beide Templates und beide Umschalt-Buttons oben sind hier geschrieben, nicht mitgeliefert: Das Bundle
          <code>openng-optimus-ui-dataview.mjs</code> exportiert vier Symbole, und keines davon ist ein Control
          (<code>:835</code>), und die Content-Children <code>#listicon</code> / <code>#gridicon</code>, die es abfragt
          (<code>:334</code>, <code>:339</code>), kommen in keinem Template vor. Der Paginator gehört der Komponente
          selbst.
        </p>

        <h3>OrderList und PickList — Zeilen, die der Komponente gehören</h3>
        <div class="stage stage--split">
          <p-orderlist
            [value]="order"
            [(selection)]="picked"
            [dragdrop]="true"
            scrollHeight="9rem"
            ariaLabel="Lesereihenfolge"
          >
            <ng-template #item let-row>{{ row.label }}</ng-template>
          </p-orderlist>
          <p-picklist
            [source]="pool"
            [target]="chosen"
            [dragdrop]="true"
            scrollHeight="9rem"
            sourceHeader="Verfügbar"
            targetHeader="Ausgewählt"
            sourceAriaLabel="Verfügbare Themen"
            targetAriaLabel="Ausgewählte Themen"
            bottomButtonAriaLabel="Ganz nach unten verschieben"
          >
            <ng-template #item let-row>{{ row.label }}</ng-template>
          </p-picklist>
        </div>
        <p class="src-note">
          Beide delegieren Zeilen, Tasten und Drag an <code>p-listbox</code>; die Buttons sind die eigenen der
          Komponenten — die vier der OrderList in einer Gruppe (<code>openng-optimus-ui-orderlist.mjs:735-782</code>),
          die zwölf der PickList in dreien: Source-Controls (<code>openng-optimus-ui-picklist.mjs:1291-1354</code>),
          Transfer-Controls und die Target-Controls, die auf die zweite Liste folgen.
        </p>

        <h3>Was jede Verschiebung ausgibt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Aktion</th><th><code>p-orderlist</code></th><th><code>p-picklist</code></th></tr>
            </thead>
            <tbody>
              <tr><td>innerhalb einer Liste umsortieren</td><td><code>onReorder</code> (die verschobenen Einträge)</td><td><code>onSourceReorder</code> / <code>onTargetReorder</code></td></tr>
              <tr><td>einen hinüberschieben</td><td>—</td><td><code>onMoveToTarget</code> / <code>onMoveToSource</code></td></tr>
              <tr><td>alle hinüberschieben</td><td>—</td><td><code>onMoveAllToTarget</code> / <code>onMoveAllToSource</code></td></tr>
              <tr><td>das gebundene Array hat sich geändert</td><td><code>value</code> wird an Ort und Stelle umsortiert</td><td>die gehaltenen Arrays werden per splice geändert; <code>sourceChange</code> bleibt stumm</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Output-Namen aus den kompilierten Deklarationen in <code>openng-optimus-ui-orderlist.mjs:734</code> und
          <code>openng-optimus-ui-picklist.mjs:1289</code>; die letzte Zeile daraus, dass im PickList-Bundle jeder
          Aufruf von <code>source.set</code>, <code>target.set</code> oder <code>.update</code> fehlt, dessen
          Verschiebungen die Arrays per splice ändern, die die Signals schon halten (<code>:926</code>,
          <code>:951</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">{{ m.usageLead }}</p>

        <h3>Welche der drei</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Die Frage, die der Nutzer beantwortet</th><th>Komponente</th></tr></thead>
            <tbody>
              <tr><td>„Welchen dieser Datensätze will ich mir ansehen?“</td><td><code>p-dataview</code></td></tr>
              <tr><td>„In welcher Reihenfolge sollen diese laufen?“</td><td><code>p-orderlist</code></td></tr>
              <tr><td>„Welche davon sind dabei, und in welcher Reihenfolge?“</td><td><code>p-picklist</code></td></tr>
              <tr><td>„Welche davon sind dabei?“ — Reihenfolge egal</td><td><code>p-multiselect</code> oder eine Checkbox-Gruppe</td></tr>
              <tr><td>„Wie schneiden diese im Vergleich ab, Feld für Feld?“</td><td><code>p-table</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ m.chooseNote }}</p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Zeile verschieben und nichts sagen</span>
            <div class="dd__stage">
              <p-orderlist [value]="ddBad" [dragdrop]="true" scrollHeight="7rem" ariaLabel="Schritte">
                <ng-template #item let-row>{{ row.label }}</ng-template>
              </p-orderlist>
            </div>
            <p class="dd__why">{{ m.ddSilentBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Eintrag und seine neue Position nennen</span>
            <div class="dd__stage">
              <p-orderlist
                [value]="ddGood"
                [dragdrop]="true"
                scrollHeight="7rem"
                ariaLabel="Schritte"
                (onReorder)="announce($event)"
              >
                <ng-template #item let-row>{{ row.label }}</ng-template>
              </p-orderlist>
              <p class="dd__caption" role="status" aria-live="polite" aria-atomic="true">{{ moveMessage() }}</p>
            </div>
            <p class="dd__why">{{ m.ddSilentGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Die eingebettete Listbox trägt drei höfliche Regionen — Filterergebnis, Leer-Meldung und Anzahl der Auswahl
          (<code>openng-optimus-ui-listbox.mjs:1435</code>, <code>:1609</code>, <code>:1612-1613</code>, Standard-Strings
          <code>openng-optimus-ui-config.mjs:170-171</code>). Keine davon nennt eine verschobene Zeile. Beide Bühnen
          oben sind OrderLists, die die Auswahl bei einer Verschiebung unangetastet lassen, also erzeugt die linke
          überhaupt keine Ansage; die Region der rechten Bühne ist hier geschrieben. Bei einer PickList sieht das Bild
          anders aus, ohne besser zu werden: Ein Transfer leert die Auswahl-Arrays, die das Modell der Listbox sind
          (<code>openng-optimus-ui-picklist.mjs:939</code>, <code>:990</code>), also fällt die Region auf „No selected
          item“ zurück — eine Ansage, aber keine über die Verschiebung.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Zeilen-Label dem Standard überlassen</span>
            <div class="dd__stage">
              <p-orderlist [value]="ddBad" scrollHeight="7rem" ariaLabel="Schritte, ohne Beschriftung"></p-orderlist>
            </div>
            <p class="dd__why">{{ m.ddLabelBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Item-Template mitgeben</span>
            <div class="dd__stage">
              <p-orderlist [value]="ddGood" scrollHeight="7rem" ariaLabel="Schritte">
                <ng-template #item let-row>{{ row.label }}</ng-template>
              </p-orderlist>
            </div>
            <p class="dd__why">{{ m.ddLabelGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Listenkomponenten binden <code>[optionLabel]="dataKey ?? 'name'"</code> an die Listbox
          (<code>openng-optimus-ui-orderlist.mjs:790</code>, <code>openng-optimus-ui-picklist.mjs:1363</code>), also
          rendern Zeilen aus Objekten ohne <code>name</code>-Feld als leere Zeilen — so wie auf der linken Bühne.
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          Der Ansage-Helfer ist Kit-Code, keine Bibliotheks-API. Prüf ihn im Accessibility Tree des Browsers: Nach einer
          Verschiebung muss der Status-Knoten den Namen des Eintrags und seinen neuen Index tragen.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">{{ m.designLead }}</p>

        <h3>Was das Theme tatsächlich setzt</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Komponente</th><th>Aura-Tokens</th><th>Was sie verbraucht</th></tr></thead>
            <tbody>
              <tr><td><code>p-orderlist</code></td><td><code>root.gap</code> 1.125rem, <code>controls.gap</code> 0.5rem</td><td>eine Flex-Zeile und eine Flex-Spalte aus Buttons</td></tr>
              <tr><td><code>p-picklist</code></td><td><code>root.gap</code> 1.125rem, <code>controls.gap</code> 0.5rem</td><td>dasselbe, plus <code>flex: 1 1 50%</code> je Listen-Container</td></tr>
              <tr><td><code>p-dataview</code></td><td><code>root</code>, <code>header</code>, <code>content</code>, <code>footer</code>, <code>paginatorTop</code>, <code>paginatorBottom</code></td><td>Rahmenlinien und Padding nur am Rahmen</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/orderlist/index.mjs</code>,
          <code>&#64;openng/optimus-ui-themes/dist/aura/picklist/index.mjs</code> und
          <code>&#64;openng/optimus-ui-themes/dist/aura/dataview/index.mjs</code>; die Regeln, die sie lesen, aus den drei
          passenden Dateien unter <code>&#64;openng/optimus-ui-styles/dist/</code>. Keines der beiden
          Listen-Stylesheets definiert etwas außer diesen zwei Flex-Containern, und das DataView-Stylesheet hat keine
          Regel für <code>.p-dataview-list</code> oder <code>.p-dataview-grid</code>, obwohl seine Root-Klasse beide
          umschaltet.
        </p>

        <h3>Kontrast: Der Listenrand ist der Control-Rahmen des Kits</h3>
        <p>{{ m.contrastEdge }}</p>
        <div class="table-wrap">
          <table>
            <caption>Der Listenrand, also der Control-Rahmen des Kits, auf der Card</caption>
            <thead>
              <tr><th>Stil</th><th>Modus</th><th><code>--control-border</code> auf <code>--surface-card</code></th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>hell</td><td>5,23:1</td></tr>
              <tr><td>werkbund</td><td>dunkel</td><td>4,91:1</td></tr>
              <tr><td>lernwerkstatt</td><td>hell</td><td>4,15:1</td></tr>
              <tr><td>lernwerkstatt</td><td>dunkel</td><td>4,89:1</td></tr>
              <tr><td>skizzenbuch</td><td>hell</td><td>4,22:1</td></tr>
              <tr><td>skizzenbuch</td><td>dunkel</td><td>4,25:1</td></tr>
              <tr><td>blaupause</td><td>hell</td><td>4,09:1</td></tr>
              <tr><td>blaupause</td><td>dunkel</td><td>3,97:1</td></tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ edgeSnippet }}</code></pre>
        <p class="src-note">
          Die eingebettete Listbox liest <code>&#123;form.field.border.color&#125;</code>
          (<code>&#64;openng/optimus-ui-themes/dist/aura/listbox/index.mjs</code>), bei Aura
          <code>&#123;surface.300&#125;</code> hell / <code>&#123;surface.600&#125;</code> dunkel. Das Kit lenkt diesen
          Rand je Komponente in <code>src/styles.scss</code> um, <code>.p-listbox</code> eingeschlossen, und die Regel
          erreicht die Listen in <code>p-orderlist</code> und <code>p-picklist</code>. Die Tabelle zitiert die Zeilen
          <code>--control-border</code> auf <code>--surface-card</code> des Kompilats („control boundary“, SC 1.4.11
          verlangt 3:1); derselbe Rand ist die Zeile „form field edge“ <code>listbox.border.color</code>, ab 3,85:1 auf
          jeder Seitenfläche. {{ m.contrastNote }}
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          Das Style-Element entsteht nur, wenn <code>responsive</code> gesetzt ist, und nur im Browser
          (<code>openng-optimus-ui-orderlist.mjs:687-720</code>,
          <code>openng-optimus-ui-picklist.mjs:1232-1254</code>); <code>breakpoint</code> steht standardmäßig auf
          <code>960px</code> (<code>openng-optimus-ui-orderlist.mjs:157</code>,
          <code>openng-optimus-ui-picklist.mjs:508</code>). PickList beobachtet zusätzlich
          <code>matchMedia</code> und dreht seine Transfer-Pfeile von waagerecht auf senkrecht
          (<code>:1208-1225</code>, <code>:1437-1438</code>); OrderList hat keinen solchen Beobachter.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">{{ m.devLead }}</p>

        <h3>Inputs, die deklariert sind und nichts erreichen</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Input</th><th>An</th><th>Warum es nichts tut</th></tr></thead>
            <tbody>
              <tr><td><code>trackBy</code></td><td>allen dreien</td><td>Listbox deklariert kein <code>trackBy</code>-Input (<code>openng-optimus-ui-listbox.mjs:1353</code>); DataView rendert keine Zeile</td></tr>
              <tr><td><code>sourceTrackBy</code>, <code>targetTrackBy</code></td><td><code>p-picklist</code></td><td>dasselbe, je Liste (<code>openng-optimus-ui-picklist.mjs:197</code>, <code>:202</code>)</td></tr>
              <tr><td><code>ariaLabelledBy</code></td><td><code>p-orderlist</code></td><td>deklariert in <code>:102</code>, in keinem Template gebunden</td></tr>
              <tr><td><code>ariaFilterLabel</code></td><td><code>p-orderlist</code></td><td>deklariert in <code>:147</code>, in keinem Template gebunden</td></tr>
              <tr><td><code>ariaSourceFilterLabel</code>, <code>ariaTargetFilterLabel</code></td><td><code>p-picklist</code></td><td>deklariert in <code>:282</code> / <code>:287</code>, in keinem Template gebunden</td></tr>
              <tr><td><code>header</code></td><td><code>p-orderlist</code></td><td>deklariert in <code>:81</code>; nur das <code>#header</code>-Template rendert</td></tr>
              <tr><td><code>#listicon</code>, <code>#gridicon</code></td><td><code>p-dataview</code></td><td>abgefragt in <code>:334</code> / <code>:339</code>, nirgends projiziert</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Jede Zeile ist das Paar „Deklaration vorhanden, Template-Verweis fehlt“. Die Zeilennummer in einer Zeile gehört
          zum flachen Bundle des Selektors in ihrer Spalte „An“, Version 2.0.2:
          <code>p-dataview</code> → <code>openng-optimus-ui-dataview.mjs</code>, <code>p-orderlist</code> →
          <code>openng-optimus-ui-orderlist.mjs</code>, <code>p-picklist</code> →
          <code>openng-optimus-ui-picklist.mjs</code>.
        </p>

        <h3>Was die acht Umsortier-Methoden am Ende der Liste tun</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Methode</th><th>Eintrag schon am Ende</th><th>Folge für eine Mehrfachauswahl</th></tr></thead>
            <tbody>
              <tr><td>OrderList <code>moveUp</code>, <code>moveDown</code></td><td>übersprungen, die Schleife läuft weiter</td><td>die anderen bewegen sich trotzdem</td></tr>
              <tr><td>OrderList <code>moveTop</code>, <code>moveBottom</code></td><td><code>break</code></td><td>der Rest der Auswahl bleibt, wo er ist</td></tr>
              <tr><td>PickList, alle vier</td><td><code>break</code></td><td>eine Auswahl, die die erste (oder letzte) Zeile enthält, bewegt nichts</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-orderlist.mjs:485-495</code> und <code>:539-550</code> gegenüber <code>:515-521</code>
          und <code>:569-575</code>; die vier <code>break</code>s der PickList sind
          <code>openng-optimus-ui-picklist.mjs:843</code>, <code>:865</code>, <code>:888</code> und <code>:910</code>.
          Der OrderList-Quelltext hält die Absicht als Kommentar in <code>:494</code> fest.
        </p>

        <h3>Die Transfer-Buttons der PickList und der Filter</h3>
        <p>
          Die beiden „Alle verschieben“-Buttons übertragen nur die Zeilen, die der Filter sichtbar gelassen hat: Beide
          Schleifen prüfen jeden Eintrag gegen den aktiven Filter, bevor sie ihn nehmen. Mit eingetipptem Filter
          verschiebt „Alle verschieben“ also eine Teilmenge: Die Zeilen, die der Filter versteckt, bleiben in der
          Quellliste, und die Liste wirkt nur leer, weil der Filter noch aktiv ist. Lösch den Filter, und sie sind wieder da.
        </p>
        <p class="src-note">
          Die Schutzbedingung ist <code>isItemVisible</code> in beiden Richtungen —
          <code>openng-optimus-ui-picklist.mjs:950</code> für die Quellliste und <code>:1001</code> für die Zielliste.
        </p>

        <h3>Die zwei Zweige von DataView je Operation</h3>
        <pre class="code-block"><code>{{ branchSnippet }}</code></pre>
        <p class="src-note">
          Zitiert aus <code>openng-optimus-ui-dataview.mjs:395-425</code>, <code>:441-454</code> und
          <code>:511-530</code>. Der Zweig entscheidet nur, was mit den Daten passiert — der Lazy-Zweig bittet dich, neu
          zu laden, der andere sortiert das übergebene Array an Ort und Stelle. <code>onSort</code> feuert danach in
          jedem Fall, außerhalb des Zweigs (<code>:421-424</code>), ein Lazy-Aufrufer bekommt für einen Klick also beide
          Outputs.
        </p>

        <h3>Checkliste</h3>
        <ul>
          <li>Eine eigene höfliche Region aktualisiert sich bei jedem Umsortier- und Transfer-Output.</li>
          <li>Verschiebe-Buttons sind überall sichtbar, wo <code>dragdrop</code> eingeschaltet ist.</li>
          <li>Beide PickList-Listen sind benannt, und <code>bottomButtonAriaLabel</code> ist gesetzt.</li>
          <li>Jede Listenkomponente hat ein <code>#item</code>-Template oder einen <code>dataKey</code>, der ein druckbares Feld nennt.</li>
          <li><code>layout</code> ist immer nur <code>'list'</code> oder <code>'grid'</code>.</li>
          <li>PickList-Ergebnisse werden aus den Arrays oder den Outputs gelesen, nie aus <code>(sourceChange)</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">{{ m.i18nLead }}</p>

        <h3>Woher jeder sichtbare String kommt</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>String</th><th>Gehalten von</th><th>Erreicht die Sprachen des Kits?</th></tr></thead>
            <tbody>
              <tr><td>Zeilentext</td><td>deinem <code>#item</code>-Template</td><td>ja — es ist dein Template</td></tr>
              <tr><td>Listen- und Header-Beschriftungen</td><td><code>sourceHeader</code> / <code>targetHeader</code> oder einem Template</td><td>ja — du bindest sie</td></tr>
              <tr><td>Die acht Namen der Verschiebe-Buttons</td><td><code>config.translation.aria.move*</code></td><td>nein — englische Standardwerte</td></tr>
              <tr><td>„&#123;0&#125; items selected“, „No selected item“</td><td><code>config.translation</code>, eine Ebene über <code>aria</code></td><td>nein — englische Standardwerte</td></tr>
              <tr><td>Leer-Meldungen und Meldungen für leere Filterergebnisse</td><td><code>config.translation</code> oder das passende Template</td><td>nur über das Template</td></tr>
              <tr><td>Filter-Platzhalter</td><td><code>filterPlaceholder</code>, <code>sourceFilterPlaceholder</code>, <code>targetFilterPlaceholder</code></td><td>ja — du bindest sie</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Standardwerte aus <code>openng-optimus-ui-config.mjs:168-198</code>. Der Optimus-Abgleich des Kits übergibt
          einen <code>aria</code>-Block, gebaut aus <code>OPTIMUS_ARIA_KEYS</code> in
          <code>src/app/services/optimus-a11y.service.ts</code> — die Keys für select, chip, tab, multiselect, rating,
          dialog und notice plus die für image-preview, carousel und paginator —, keines der acht Verschiebe-Labels und
          nichts außerhalb von <code>aria</code>; deshalb steht in den beiden Zeilen oben „nein“.
        </p>

        <h3>Die Verschiebe-Labels hinzufügen</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> führt nur eine Ebene tief zusammen, also wird der <code>aria</code>-Block komplett
          ersetzt — erst den aktuellen Block auszubreiten ist das, was die Keys erhält, die du nicht aufgeführt hast.
        </p>

        <h3>Länge, und die zwei Stellen, an denen sie zubeißt</h3>
        <p>{{ m.i18nLength }}</p>
        <p class="src-note">
          Die Buttons zeigen in beiden Listenkomponenten nur ein Icon, also ändert ein übersetztes Label den
          zugänglichen Namen und nicht das Layout; Zeilentext und Header sind die Strings, die breiter werden.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Der Listenrand ist jetzt
            das <code>--control-border</code> des Kits (die Listbox-Regel erreicht beide Listen), zitiert aus CONTRAST.MD;
            Zeilentext aus der Zeile „content panel“; die aktive Option trägt den Ring des Kits; die übergebene
            aria-Key-Liste neu gelesen.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Kontrast korrigiert: Der Listenrand ist Auras Standard-Formularfeldrand,
            den das Kit für die Listbox nicht umlenkt; die Zeilen mit Kit-Tokens sind jetzt das Ziel nach dem Umlenken,
            samt der Regel dafür.
          </li>
          <li><strong>1.0</strong> — 06.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DataviewArticleDeComponent extends DataviewArticleComponent {
  override readonly cards: Card[] = [
    { id: 1, title: 'Retrieval', note: 'erst die Passagen finden' },
    { id: 2, title: 'Grounding', note: 'nur aus ihnen antworten' },
    { id: 3, title: 'Quellenangabe', note: 'nennen, woher es stammt' },
    { id: 4, title: 'Prüfung', note: 'zuletzt liest ein Mensch' },
  ];

  override readonly order: Row[] = [
    { id: 1, label: 'Quellen sammeln' },
    { id: 2, label: 'Antwort entwerfen' },
    { id: 3, label: 'Quellenangaben prüfen' },
    { id: 4, label: 'Veröffentlichen' },
  ];

  override readonly pool: Row[] = [
    { id: 1, label: 'Prompting' },
    { id: 2, label: 'Embeddings' },
    { id: 3, label: 'Evaluation' },
  ];

  override readonly chosen: Row[] = [{ id: 4, label: 'Tokenisierung' }];

  override readonly ddBad: Row[] = [
    { id: 1, label: 'Sammeln' },
    { id: 2, label: 'Entwerfen' },
    { id: 3, label: 'Veröffentlichen' },
  ];

  override readonly ddGood: Row[] = [
    { id: 1, label: 'Sammeln' },
    { id: 2, label: 'Entwerfen' },
    { id: 3, label: 'Veröffentlichen' },
  ];

  override announce(moved: Row[]): void {
    const first = moved[0];
    if (!first) {
      return;
    }
    const at = this.ddGood.indexOf(first) + 1;
    this.moveMessage.set(first.label + ', ' + at + ' von ' + this.ddGood.length);
  }

  override readonly m = {
    usageLead:
      'Die drei beantworten verschiedene Fragen, und die falsche Wahl zeigt sich als Control, das niemand bedienen kann, nicht als Beschwerde über das Layout. Wähl nach der Frage, die der Nutzer beantwortet, und begleiche dann die Accessibility-Rechnung, die die Komponente offen lässt.',
    chooseNote:
      'Die Aufteilung folgt dem, was jede Komponente besitzt: DataView besitzt das Paging und ein Layout-Flag, OrderList ein Array, PickList zwei. Keine von ihnen besitzt eine Zeile.',
    ddSilentBad:
      'Die Verschiebung passiert, das DOM ändert sich, und die eine Status-Region, die diese Anordnung rendert, meldet weiter die Anzahl der Auswahl — die sich durch die Verschiebung nicht geändert hat. Ein Screenreader-Nutzer kann auf keine Weise hören, wohin die Zeile gewandert ist.',
    ddSilentGood:
      'Eine eigene höfliche Region, aktualisiert aus dem Umsortier-Output, nennt den Eintrag und seine neue Position. Dieselbe Region bedient den Drag-Weg und den Button-Weg, weil beide im selben Output enden.',
    ddLabelBad:
      'Ohne Item-Template druckt die Zeile den Wert eines Feldes namens name, und diese Zeilen haben kein solches Feld — also rendert die Liste leere Zeilen, die trotzdem auswählbar und verschiebbar sind.',
    ddLabelGood:
      'Eine Template-Zeile entscheidet, was eine Zeile sagt. Sie ist auch der einzige Weg, einer Zeile mehr als ein einzelnes Feld zu geben, denn das Label-Input nimmt nur einen Feldpfad.',
    designLead:
      'Ein Theme gibt es hier fast nicht. Zwei der drei sind ein Flex-Container und ein Token für den Abstand; die dritte gestaltet einen Rahmen und überlässt die Zeilen ganz dir. Damit ist der Aufrufer für fast alles verantwortlich, was ein Leser das Design nennen würde.',
    contrastEdge:
      'OrderList und PickList zeichnen ihren Listenrahmen mit der Listbox, die sie einbetten, und dieser Rahmen liest das Rahmen-Token der Listbox. Auras Standardrand verfehlt die 3:1, die eine Control-Grenze schuldet, also lenkt das Kit ihn für jede Feldhülle auf --control-border um, die Listbox eingeschlossen — und genau die rendern diese beiden Listen. Auf deiner Seite ist nichts hinzuzufügen; die Werte unten sind das, was der Rahmen misst.',
    contrastNote:
      'Zeilentext ist {text.color} auf {content.background} — die Zeile „content panel“, 10,35:1 hell und 17,72:1 dunkel. Die aktive Option der Tastatur (.p-listbox-option.p-focus) trägt den einen 2px-Ring des Kits, nach innen gezeichnet, gemessen auf der Liste, dem Fokus-Farbton und den Auswahl-Füllungen in den Zeilen „option list focus“ (ab 3,48:1). Die Hover-Füllung ({surface.100} / {surface.800}) und der Text der ausgewählten Option stehen in keiner Zeile; miss sie im Computed Style, statt dir einen Nachbarwert zu borgen.',
    responsive:
      'Keine der drei hat eingebautes responsives Verhalten. OrderList und PickList sind Flex-Zeilen, die ihre Anordnung nebeneinander bei jedem Viewport behalten und über ihren Container hinauslaufen, sobald die Listen und die Button-Spalte nicht mehr hineinpassen; DataView ist ein Block, dessen Raster-Layout das CSS ist, das du geschrieben hast. Setz responsive an einer der beiden Listenkomponenten, um unterhalb von breakpoint (standardmäßig 960px) eine gestapelte Anordnung zu bekommen, und gib einem DataView-Raster eine eigene Container Query oder Media Query — nichts in der Bibliothek liefert eine.',
    devLead:
      'Die drei tragen eine auffällige Menge deklarierter Oberfläche, die kein Template liest. Das meiste davon ist harmlos; zwei Einträge sind es nicht, weil sie genau wie die Lösung für ein echtes Accessibility-Problem aussehen.',
    i18nLead:
      'Fast jeder sichtbare String in diesen dreien ist entweder deiner oder ein englischer Standardwert. Die Teile, die dir gehören, sind die, die Bedeutung tragen; die englischen Standardwerte sind die Button-Namen, die ein Screenreader-Nutzer hört.',
    i18nLength:
      'Ein übersetztes Zeilen-Label kann ein Mehrfaches der englischen Länge haben, und keine der beiden Listenkomponenten bricht für dich um oder kürzt: Die Zeile scrollt innerhalb der Liste waagerecht, und ein langer Header drückt den Listen-Container breiter, bevor die Flex-Zeile nachgibt.',
  };
}
