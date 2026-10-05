import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { MenuItem } from '@openng/optimus-ui/api';
import { PanelmenuArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './panelmenu-article.component';

/**
 * German twin of the PanelMenu guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (m, labels,
 * the demo models, the readout) are German. Keep it in step with the English file:
 * same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs panelmenu`).
 */
@Component({
  selector: 'app-panelmenu-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'panelmenu'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Stapel aus Panels. Jeder Header ist ein Disclosure-Button; jedes offene Panel enthält einen Baum aus
          Menüeinträgen. Alles hier unten ist live — öffne ein Panel mit der Maus, geh denselben Weg dann mit der
          Tastatur, und achte darauf, wo die Markierung der Pfeiltasten im Vergleich zu der Zeile steht, die Tab fokussiert hat.
        </p>

        <h3>Gerenderte Panels</h3>
        <div class="stage">
          <nav [attr.aria-label]="labels.docsNav" class="pm-demo">
            <p-panelmenu [model]="docs" [multiple]="true" />
          </nav>
        </div>
        <p class="src-note">
          Gerendert aus einem <code>MenuItem[]</code>, dessen oberste Ebene <code>items</code> trägt. Der Chevron ist das
          eigene SVG der Bibliothek, getauscht über den aktiven Zustand (<code>openng-optimus-ui-panelmenu.mjs:1356-1364</code>).
        </p>

        <h3>Was jede Ebene ausgibt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Ebene</th><th>Element</th><th>Attribute</th></tr>
            </thead>
            <tbody>
              <tr><td>Panel-Header</td><td>{{ m.hdrEl }}</td><td>{{ m.hdrAttr }}</td></tr>
              <tr><td>Panel-Inhalt</td><td>{{ m.regionEl }}</td><td>{{ m.regionAttr }}</td></tr>
              <tr><td>Eintragsliste</td><td>{{ m.treeEl }}</td><td>{{ m.treeAttr }}</td></tr>
              <tr><td>Eintragszeile</td><td>{{ m.rowEl }}</td><td>{{ m.rowAttr }}</td></tr>
              <tr><td>Anker der Zeile</td><td>{{ m.linkEl }}</td><td>{{ m.linkAttr }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an den Templates: Header <code>openng-optimus-ui-panelmenu.mjs:1330-1336</code>, Region
          <code>:1435-1437</code>, Host des Baums <code>:607-610</code>, Zeile <code>:256-262</code>, Anker
          <code>:282</code> und <code>:344</code>. Prüf im Accessibility Tree des Browsers, dass das Element, das du mit
          Tab erreichst, nicht das Element ist, das <code>aria-activedescendant</code> trägt.
        </p>

        <h3>Das Markup, das ein Header und eine Zeile erzeugen</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Beide IDs werden generiert, wenn der Eintrag keine <code>id</code> hat: <code>getHeaderId</code> und
          <code>getContentId</code> (<code>openng-optimus-ui-panelmenu.mjs:1223-1228</code>) auf Basis eines
          <code>uuid('pn_id_')</code>-Fallbacks (<code>:1164</code>), daher unterscheiden sie sich je Rendering.
        </p>

        <h3>Playground</h3>
        <div class="stage">
          <div class="controls">
            <p-button
              size="small"
              severity="secondary"
              [label]="multiple() ? labels.multipleOn : labels.multipleOff"
              (onClick)="multiple.set(!multiple())"
            />
            <p-button size="small" severity="secondary" [label]="labels.collapseAll" (onClick)="pm.collapseAll()" />
          </div>
          <nav [attr.aria-label]="labels.playgroundNav" class="pm-demo">
            <p-panelmenu #pm [model]="playground" [multiple]="multiple()" />
          </nav>
          <p class="readout" role="status">{{ labels.openNow }} {{ openPanels() }}</p>
        </div>
        <p class="src-note">
          <code>collapseAll()</code> ist die einzige öffentliche Methode der Komponente
          (<code>openng-optimus-ui-panelmenu.mjs:1188-1195</code>); die Anzeige liest <code>expanded</code> von denselben
          <code>MenuItem</code>-Objekten zurück, in die die Komponente schreibt
          (<code>:1269</code>) — denn genau dort lebt der Zustand der Panels.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Greif zu ihm, wenn die Abschnitte Menüs sind und der Nutzer mehr als eines davon gleichzeitig braucht. Alles
          Weitere auf dieser Seite folgt aus zwei Entscheidungen der Komponente: Der Zustand der Panels wird in deinem
          Model gespeichert, und ein Widget trägt zwei ARIA-Patterns.
        </p>

        <h3>PanelMenu, Accordion oder einfache Navigation</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Du hast</th><th>Nimm</th><th>Weil</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.pickPmWhat }}</td><td><code>p-panelmenu</code></td><td>{{ m.pickPmWhy }}</td></tr>
              <tr><td>{{ m.pickAccWhat }}</td><td><code>p-accordion</code></td><td>{{ m.pickAccWhy }}</td></tr>
              <tr><td>{{ m.pickNavWhat }}</td><td>{{ m.pickNavHow }}</td><td>{{ m.pickNavWhy }}</td></tr>
              <tr><td>{{ m.pickMenuWhat }}</td><td><code>p-menu</code></td><td>{{ m.pickMenuWhy }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Zeilen zu <code>p-accordion</code> und <code>p-menu</code> sind Verweise, keine Zusammenfassungen: Beide
          haben eigene Guides, und nichts, was dort gemessen ist, wird hier wiederholt.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Model neu bauen und die Panels zuklappen lassen</span>
            <div class="dd__stage">
              <p-button size="small" severity="secondary" [label]="labels.switchLang" (onClick)="cycleLang()" />
              <nav [attr.aria-label]="labels.ddBadNav" class="pm-demo">
                <p-panelmenu [model]="volatile()" [multiple]="true" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddModelBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — <code>expanded</code> im eigenen Zustand führen</span>
            <div class="dd__stage">
              <p-button size="small" severity="secondary" [label]="labels.switchLang" (onClick)="cycleLang()" />
              <nav [attr.aria-label]="labels.ddGoodNav" class="pm-demo">
                <p-panelmenu [model]="stable()" [multiple]="true" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddModelGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Öffne in beiden ein Panel und drück dann den Button. Die Komponente speichert den Zustand der Panels nirgends
          außer im Model-Objekt: <code>onHeaderClick</code> schreibt <code>item.expanded</code>
          (<code>openng-optimus-ui-panelmenu.mjs:1269</code>), und <code>isItemActive</code> liest genau das und sonst
          nichts (<code>:1208-1209</code>); das Template trackt nach Identität (<code>:1321</code>). Das rechte Model
          setzt <code>expanded</code> neu aus einem Signal, das der <code>command</code> seiner Header aktualisiert
          (<code>:1259-1261</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Markup in einem Label</span>
            <div class="dd__stage">
              <nav [attr.aria-label]="labels.ddEscapeBad" class="pm-demo">
                <p-panelmenu [model]="escapedOff" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — einfache Labels, Dekoration über <code>icon</code></span>
            <div class="dd__stage">
              <nav [attr.aria-label]="labels.ddEscapeGood" class="pm-demo">
                <p-panelmenu [model]="escapedOn" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Mit <code>escape: false</code> läuft das sichtbare Label durch <code>[innerHTML]</code>
          (<code>openng-optimus-ui-panelmenu.mjs:1376</code> Header, <code>:321</code> Zeile), während
          <code>aria-label</code> den ungeparsten String behält (<code>:1334</code>, <code>:258</code>) — die beiden Namen
          laufen auseinander. Das Bundle enthält kein <code>bypassSecurityTrustHtml</code>, also läuft der Sanitizer von
          Angular auch in diesem Zweig.
        </p>

        <h3>Quellen</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-panelmenu.mjs</code> — drei Komponenten in einem Bundle; jede Rolle, jede Taste und jeder
            Schreibzugriff auf den Zustand, die diese Seite zitiert, stammen daraus.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs</code> — die Fokus-Regeln, die Einrückung und der
            Container mit Grid-Rows für das Zuklappen.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-themes/dist/aura/panelmenu/index.mjs</code> — die Token-Standardwerte, aufgelöst unter
            Design.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" rel="noopener noreferrer" target="_blank"
              >APG Disclosure</a
            >
            — das Pattern, das die Header umsetzen, und das, aus dem die Beziehung zur Region stammt.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" rel="noopener noreferrer" target="_blank"
              >APG Treeview</a
            >
            — das Pattern, das die Panel-Inhalte beanspruchen, samt dem einzigen Tab-Stopp, den es verlangt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 SC 2.4.7</a
            >
            und
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              rel="noopener noreferrer"
              target="_blank"
              >SC 1.4.11</a
            >
            — was ein Tab-Stopp ohne Indikator schuldet, und die 3:1, die der Ersatz braucht.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Preset gestaltet vier Dinge: den Rahmen der Panels, den Rhythmus der Zeilen, die Einrückung je Ebene und
          zwei Fokus-Zustände, die beide nur den Hintergrund tauschen. Sonst gibt es nichts vor — Breite, Umbruch und
          Platzierung sind Sache des Aufrufers.
        </p>

        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Was</th><th>Token</th><th>Aura-Standard</th></tr>
            </thead>
            <tbody>
              <tr><td>Abstand zwischen Panels</td><td><code>panelmenu.gap</code></td><td>{{ m.tokGap }}</td></tr>
              <tr><td>Rahmen der Panels</td><td><code>panelmenu.panel.*</code></td><td>{{ m.tokPanel }}</td></tr>
              <tr><td>Padding und Abstand der Zeilen</td><td><code>panelmenu.item.*</code></td><td>{{ m.tokItem }}</td></tr>
              <tr><td>Fokus-Zustand der Zeile</td><td><code>panelmenu.item.focus.*</code></td><td>{{ m.tokFocus }}</td></tr>
              <tr><td>Einrückung je Ebene</td><td><code>panelmenu.submenu.indent</code></td><td>{{ m.tokIndent }}</td></tr>
              <tr><td>Farbe des Chevrons</td><td><code>panelmenu.submenu.icon.color</code></td><td>{{ m.tokChevron }}</td></tr>
              <tr><td>Icon von Eintrag und Header</td><td><code>panelmenu.item.icon.color</code></td><td>{{ m.tokIcon }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/panelmenu/index.mjs</code>; die Aliase
          <code>navigation.*</code> und <code>content.*</code> lösen sich im Basis-Preset auf. Die visuellen Stile des Kits
          ändern über <code>definePreset</code> nur seine Radius-Skala
          (<code>src/app/services/ui-styles.ts</code>) — eckig in werkbund, runder in lernwerkstatt (dem Standard) und
          skizzenbuch —, der Radius, den du siehst, ist also der des aktiven Stils. Die Farben von Panel und Zeile bleiben in
          jedem Stil die Standardpalette von Aura; die gemeinsame Schicht von <code>src/styles.scss</code> ergänzt den
          einen Fokus-Ring des Kits (nächster Abschnitt) und setzt den Chevron des Untermenüs sowie die Icons von Eintrag
          und Header auf <code>--text-color-secondary</code>.
        </p>

        <h3>Drei Fokus-Zustände, und was das Kit zeichnet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Element</th><th>Was das Preset zeichnet</th><th>Was das Kit ergänzt</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.foHeaderEl }}</td><td>{{ m.foHeaderDraw }}</td><td>{{ m.foHeaderOwe }}</td></tr>
              <tr><td>{{ m.foRowEl }}</td><td>{{ m.foRowDraw }}</td><td>{{ m.foRowOwe }}</td></tr>
              <tr><td>{{ m.foLinkEl }}</td><td>{{ m.foLinkDraw }}</td><td>{{ m.foLinkOwe }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Regeln bei <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs:30</code> (Outline des Headers),
          <code>:70</code> (Fokus-Hintergrund des Headers), <code>:135</code> (Hintergrund der Zeile) und
          <code>openng-optimus-ui-panelmenu.mjs:26-29</code> (der Optimus-Override, der die Outline des Ankers
          entfernt). Ring, Chevron und Icon des Kits sind die Zeilen „menu focus“ in
          <code>docs/generated/CONTRAST.MD</code>, gemessen an den Tokens der Menubar; das Gate stellt sicher, dass Panel,
          Fokus-Tönung, Chevron und Icon des PanelMenu auf dieselben Werte auflösen, die Zeilen gelten also für diese
          Komponente: Ring 4,73–16,30:1 auf der Fokus-Tönung und 5,18–17,85:1 auf dem Panel, Chevron und Icon ab 4,76:1 —
          in jedem Stil, Modus und Akzent. Dir bleibt nichts zu tun (Snippet unten).
        </p>

        <pre class="code-block"><code>{{ focusRingSnippet }}</code></pre>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Nichts fließt um und nichts wird abgeschnitten. Die Wurzel ist eine Flex-Spalte ohne eigene Breite, sie füllt also
          bei jedem Viewport ihren Container; jede Ebene fügt <code>1rem</code> Inline-Padding hinzu, und ein Label, das nicht
          mehr passt, bricht innerhalb seiner Zeile um und macht die Zeile höher. Im Stylesheet gibt es keine Media Query und
          kein <code>text-overflow</code>. Bei 360 px mit drei offenen Ebenen gehen rund 3 rem der Breite an die Einrückung —
          begrenz die angebotene Tiefe oder gib der tiefsten Ebene ein eigenes <code>pt</code>-Padding, statt zu erwarten,
          dass die Komponente das ausgleicht. Ein Vorbehalt: <code>.p-panelmenu-item-link</code> ist
          <code>overflow: hidden</code>, ein einzelnes unumbrechbares Wort (eine lange URL als Label) wird also
          abgeschnitten statt umbrochen.
        </p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs:2-7</code> (Flex-Spalte),
          <code>:96-101</code> (Einrückung, gespiegelt unter <code>dir="rtl"</code> bei <code>:103-105</code>),
          <code>:107-118</code> (der Anker der Zeile). Die Datei deklariert keine <code>width</code>, kein
          <code>white-space</code>, kein <code>text-overflow</code> und keinen <code>&#64;media</code>-Block.
        </p>

        <h3>Bewegung</h3>
        <p>
          Der Panel-Inhalt ist ein Container mit <code>grid-template-rows</code>, dessen Zeile auf null zusammenfällt — die
          Technik, die auf Inhaltshöhe animiert, ohne sie zu messen. Gesteuert wird er von der Motion-Direktive unter dem
          Namen <code>p-collapsible</code>, konfiguriert über <code>motionOptions</code>. Das veraltete Input
          <code>transitionOptions</code> erreicht sie nicht.
        </p>
        <p class="src-note">
          Container bei <code>&#64;openng/optimus-ui-styles/dist/panelmenu/index.mjs:161-168</code>, Bindings der
          Direktive bei <code>openng-optimus-ui-panelmenu.mjs:1439-1441</code>;
          <code>transitionOptions</code> wird zwischen den internen Komponenten weitergereicht (<code>:1450</code>,
          <code>:996</code>, <code>:406</code>) und von keiner gelesen.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Zwei Handler, zwei Fokus-Modelle und ein Zustandsfeld, das in deinen Daten lebt. Verdrahte die Komponente mit
          diesem Wissen, und sie ist unauffällig; verdrahte sie wie ein Accordion, und die Panels klappen bei jedem
          Sprachwechsel zu.
        </p>

        <h3>Inputs, und was jedes erreicht</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Standard</th><th>Erreicht</th></tr>
            </thead>
            <tbody>
              <tr><td><code>model</code></td><td>—</td><td>{{ m.inModel }}</td></tr>
              <tr><td><code>multiple</code></td><td><code>false</code></td><td>{{ m.inMultiple }}</td></tr>
              <tr><td><code>motionOptions</code></td><td>—</td><td>{{ m.inMotion }}</td></tr>
              <tr><td><code>id</code></td><td>generiert</td><td>{{ m.inId }}</td></tr>
              <tr><td><code>styleClass</code></td><td>—</td><td>{{ m.inStyleClass }}</td></tr>
              <tr><td><code>tabindex</code></td><td><code>0</code></td><td>{{ m.inTabindex }}</td></tr>
              <tr><td><code>transitionOptions</code></td><td>{{ m.inTransitionDefault }}</td><td>{{ m.inTransition }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarationen bei <code>openng-optimus-ui-panelmenu.mjs:1083-1123</code>. Die beiden toten Einträge sind aus
          verschiedenen Gründen tot: <code>tabindex</code> wird (<code>:1453</code> nach <code>:992</code>) an eine Liste
          weitergereicht, deren Host das Literal <code>-1</code> bindet (<code>:608</code>), während der Tab-Stopp des
          Headers das Literal <code>0</code> ist (<code>:1330</code>); <code>transitionOptions</code> ist zugunsten von
          <code>motionOptions</code> veraltet und erreicht überhaupt keine Direktive. Die Komponente nimmt außerdem
          <code>dt</code>, <code>unstyled</code>, <code>pt</code> und <code>ptOptions</code> aus
          <code>BaseComponent</code> an, die ihre eigene Input-Liste nicht nennt.
        </p>

        <h3>Die Tastatur, je Ebene</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Taste</th><th>Auf einem Panel-Header</th><th>In einem offenen Panel</th></tr>
            </thead>
            <tbody>
              <tr><td>Pfeil nach unten</td><td>{{ m.kbDownH }}</td><td>{{ m.kbDownT }}</td></tr>
              <tr><td>Pfeil nach oben</td><td>{{ m.kbUpH }}</td><td>{{ m.kbUpT }}</td></tr>
              <tr><td>Pfeil nach rechts / links</td><td>{{ m.kbLatH }}</td><td>{{ m.kbLatT }}</td></tr>
              <tr><td>Pos1 / Ende</td><td>{{ m.kbHomeH }}</td><td>{{ m.kbHomeT }}</td></tr>
              <tr><td>Enter / Leertaste</td><td>{{ m.kbEnterH }}</td><td>{{ m.kbEnterT }}</td></tr>
              <tr><td>Esc</td><td>{{ m.kbEscH }}</td><td>{{ m.kbEscT }}</td></tr>
              <tr><td>Tab</td><td>{{ m.kbTabH }}</td><td>{{ m.kbTabT }}</td></tr>
              <tr><td>druckbare Zeichen</td><td>{{ m.kbTypeH }}</td><td>{{ m.kbTypeT }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Header-Handler <code>openng-optimus-ui-panelmenu.mjs:1273-1318</code>, Baum-Handler
          <code>:826-931</code> mit der Typeahead-Suche bei <code>:943-984</code> und dem expliziten No-op-Zweig bei
          <code>:853-861</code>; die Rückkehr zum Header ist der Else-Zweig von <code>changeFocusedItem</code>
          (<code>:775-784</code>).
        </p>

        <h3>Warum Tab und die Pfeiltasten sich widersprechen</h3>
        <p>
          Der Baum ist ein <code>aria-activedescendant</code>-Widget: Das Listenelement hält den Fokus, eine Klasse
          <code>p-focus</code> markiert die aktuelle Zeile, und die Pfeiltasten verschieben diese Markierung. Die Anker der
          Zeilen bekommen jedoch <code>tabindex="0"</code>, sobald ihr Panel offen ist — die Tab-Reihenfolge eines offenen
          Panels lautet also: Header, dann jeder sichtbare Link darin, dann der nächste Header. Tab zwischen diesen Links
          verschiebt die Markierung nicht, weil der Fokus-Handler der Liste nur beim ersten Betreten handelt und ihr
          Blur-Handler nur auslöst, wenn der Fokus die Liste ganz verlässt. Das Ergebnis: eine Markierung auf der einen Zeile,
          während der Fokus des Browsers auf einer anderen liegt. Das Kit setzt den Ring auf beide — die Zeile, deren Anker
          den Fokus hat, und die markierte Zeile, auf die Enter und Leertaste wirken —, nach einem Tab innerhalb eines Panels
          können also zwei Zeilen den Ring tragen; nach dem ersten Tab in ein Panel fallen sie zusammen.
        </p>
        <p class="src-note">
          Anker bei <code>openng-optimus-ui-panelmenu.mjs:282</code> und <code>:344</code>, die Handler bei
          <code>:791-806</code>, die Klasse der Markierung bei <code>:50-58</code>. Stell es in deinem Build nach: Öffne ein
          Panel, drück zweimal Tab und vergleiche <code>aria-activedescendant</code> auf der Liste mit
          <code>document.activeElement</code>.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>Die Komponente wird von außen benannt — ein <code>&lt;nav&gt;</code> oder <code>&lt;section&gt;</code> mit Label; weder die Wurzel noch ein Baum trägt einen eigenen Namen.</li>
          <li>Keine eigene Fokus-Regel: Das Kit setzt den Ring auf den Header, die Zeile der Pfeiltasten und die Zeile, deren Anker Tab erreicht hat.</li>
          <li>Jeder Eintrag der obersten Ebene hat <code>items</code> — ein Header ohne sie sagt trotzdem <code>aria-expanded</code> an und zeigt auf eine leere Region.</li>
          <li><code>expanded</code> gehört dem Aufrufer und wird jedes Mal neu gesetzt, wenn <code>model</code> neu gebaut wird, Sprachwechsel eingeschlossen.</li>
          <li>Der ganze Weg wird zweimal abgegangen: einmal mit den Pfeiltasten, einmal mit Tab, weil sie verschiedene Elemente besuchen.</li>
          <li>Kein <code>escape: false</code> bei einem Label, das du nicht selbst verfasst hast — der zugängliche Name behält das Markup, auch wo das sichtbare Label es rendert.</li>
          <li>Ziele, die erreichbar sein müssen, sind auch außerhalb des PanelMenu erreichbar; ein zugeklapptes Panel ist <code>aria-hidden</code>, und seine Links sind <code>tabindex="-1"</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Jeder Text gehört dir. Die Komponente liest überhaupt keine Übersetzungskonfiguration, was den Sprachwechsel zum
          interessanten Teil macht: Das neue Model darf die offenen Panels nicht mit sich reißen.
        </p>

        <h3>Was woher kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Quelle</th></tr>
            </thead>
            <tbody>
              <tr><td>Labels von Headern und Zeilen, Badges</td><td>dein <code>MenuItem[]</code></td></tr>
              <tr><td>der zugängliche Name des Menüs</td><td>das Element, in das du es packst</td></tr>
              <tr><td>das Bedienelement zum Auf- und Zuklappen</td><td>ein Chevron-SVG — kein Text und kein eigenes Label</td></tr>
              <tr><td>alles, was die Bibliothek mitbringt</td><td>nichts; sie liest keine Übersetzungskonfiguration</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das ganze Bundle durchsucht: kein Verweis auf <code>config.translation</code> und kein sichtbares Literal, anders
          als bei <code>p-menubar</code>, dessen Hamburger einen Namen aus
          <code>openng-optimus-ui-config.mjs:187</code> borgt.
        </p>

        <h3>Ein übersetztes Model, das seine Panels offen hält</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Die Keys oben sind Platzhalter in einem Namespace <code>your-module.</code>, keine Keys dieses Kits. Entscheidend
          ist die Form: Der offene Zustand lebt in einem Signal, das der <code>command</code> des Headers aktualisiert, und das
          berechnete Model setzt <code>expanded</code> daraus neu — sonst kommen die frischen Objekte, die ein Sprachwechsel
          erzeugt, mit nicht gesetztem <code>expanded</code> an, und jedes Panel klappt zu.
        </p>

        <h3>Was das nicht löst</h3>
        <ul class="checklist">
          <li>{{ m.i18nNameGap }}</li>
          <li>{{ m.i18nWidthGap }}</li>
          <li>{{ m.i18nTypeaheadGap }}</li>
        </ul>
        <p class="src-note">
          Das Erste folgt daraus, dass <code>aria-label</code> das rohe Label übernimmt
          (<code>openng-optimus-ui-panelmenu.mjs:1334</code>, <code>:258</code>); das Zweite aus der Einrückung, die unter
          Design zitiert ist; das Dritte daraus, dass die Typeahead-Suche mit einem einfachen
          <code>toLocaleLowerCase().startsWith()</code> vergleicht (<code>:709-711</code>).
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.3</strong> — 23.09.2026 — Mit der letzten Fokus-Runde abgeglichen: Die Zeile, deren Anker Tab
            fokussiert hat, trägt jetzt ebenfalls den Ring des Kits, und die Icons von Eintrag und Header sind
            <code>--text-color-secondary</code>; dem Aufrufer bleibt keine Lücke.
          </li>
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Header und die Zeile der
            Pfeiltasten tragen den einen 2px-Ring des Kits, und der Chevron ist <code>--text-color-secondary</code>, belegt
            aus CONTRAST.MD „menu focus“; der per Tab erreichte Anker der Zeile ist als einzige verbleibende Lücke genannt.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Erneut geprüft an Optimus UI 2.0.2 und den visuellen Stilen: Jede
            Zeilenangabe stimmt (ein Bereich der Einrückung auf <code>:103-105</code> eingegrenzt); Design hält fest, dass die
            Stile nur den Radius ändern, nie die Farben; die Anzeige im Playground ist eine Status-Region; die Doku auf das
            Byte-Ziel gekürzt.
          </li>
          <li><strong>1.0</strong> — 07.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class PanelmenuArticleDeComponent extends PanelmenuArticleComponent {
  /** Visible strings of the live stages; the API names on the playground buttons stay as they are. */
  override readonly labels = {
    docsNav: 'Abschnitte der Dokumentation',
    playgroundNav: 'Abschnitte des Playgrounds',
    ddBadNav: 'Abschnitte, Model ohne Zustand neu gebaut',
    ddGoodNav: 'Abschnitte, Zustand beim Aufrufer',
    ddEscapeBad: 'Abschnitte mit Markup in den Labels',
    ddEscapeGood: 'Abschnitte mit einfachen Labels',
    multipleOn: 'multiple: true',
    multipleOff: 'multiple: false',
    collapseAll: 'collapseAll()',
    switchLang: 'Sprache wechseln',
    openNow: 'Gerade offen:',
  };

  override readonly docs: MenuItem[] = [
    {
      label: 'Erste Schritte',
      icon: 'pi pi-play',
      expanded: true,
      items: [
        { label: 'Installation' },
        { label: 'Projektstruktur' },
        { label: 'Erste Komponente', items: [{ label: 'Template' }, { label: 'Styles' }] },
      ],
    },
    {
      label: 'Anleitungen',
      icon: 'pi pi-book',
      items: [{ label: 'Formulare' }, { label: 'Navigation' }, { separator: true }, { label: 'Testen', disabled: true }],
    },
    { label: 'Referenz', icon: 'pi pi-list', items: [{ label: 'Tokens' }, { label: 'Hilfsfunktionen' }] },
  ];

  override readonly playground: MenuItem[] = [
    { label: 'Bearbeiten', icon: 'pi pi-pencil', items: [{ label: 'Umbenennen' }, { label: 'Duplizieren' }] },
    { label: 'Lebenszyklus', icon: 'pi pi-clock', items: [{ label: 'Archivieren' }, { label: 'Löschen' }] },
    { label: 'Teilen', icon: 'pi pi-share-alt', items: [{ label: 'Einladen' }, { label: 'Öffentlicher Link' }] },
  ];

  override readonly escapedOff: MenuItem[] = [
    { label: '<b>Jetzt</b> veröffentlichen', escape: false, items: [{ label: 'Auf <i>Staging</i>', escape: false }] },
    { label: 'Als <i>Entwurf</i> speichern', escape: false, items: [{ label: 'Lokal behalten' }] },
  ];

  override readonly escapedOn: MenuItem[] = [
    { label: 'Jetzt veröffentlichen', icon: 'pi pi-send', items: [{ label: 'Auf Staging' }] },
    { label: 'Als Entwurf speichern', icon: 'pi pi-file', items: [{ label: 'Lokal behalten' }] },
  ];

  /** German first, so the twin starts in its own language; the switch flips to English. */
  protected override readonly sections = [
    { id: 'guides', labels: ['Anleitungen', 'Guides'], children: ['Formulare', 'Navigation'] },
    { id: 'reference', labels: ['Referenz', 'Reference'], children: ['Tokens', 'Hilfsfunktionen'] },
  ];

  override openPanels(): string {
    const open = this.playground.filter((item) => item.expanded).map((item) => item.label);
    return open.length ? open.join(', ') : 'keines';
  }

  /** The measured values of the English article, in German. */
  override readonly m = {
    hdrEl: 'div, eines je Model-Eintrag',
    hdrAttr: 'role="button", tabindex="0", aria-expanded, aria-controls, aria-label, aria-disabled',
    regionEl: 'div um den Panel-Inhalt',
    regionAttr: 'role="region", aria-labelledby mit Verweis zurück auf den Header',
    treeEl: 'ul, eine je offenem Panel',
    treeAttr: 'role="tree", tabindex="-1", aria-activedescendant, aria-hidden im zugeklappten Zustand',
    rowEl: 'li, eines je sichtbarem Eintrag',
    rowAttr: 'role="treeitem", aria-label, aria-level, aria-setsize, aria-posinset, aria-expanded nur bei Kindern',
    linkEl: 'a in der Zeile, mit href nur, wenn url oder routerLink gesetzt ist',
    linkAttr: 'tabindex="0", solange das Panel offen ist, "-1", solange es zugeklappt ist — ein zweiter Tab-Stopp je Zeile',

    pickPmWhat: 'Abschnitte aus Menüeinträgen, mehrere davon gleichzeitig offen',
    pickPmWhy: 'die einzige Komponente hier, die Menüeinträge unter aufklappbaren Headern verschachtelt',
    pickAccWhat: 'Abschnitte mit beliebigem Inhalt',
    pickAccWhy: 'Panel-Inhalte können hier nur ein MenuItem[] sein, nie projizierter Inhalt',
    pickNavWhat: 'eine Website-Navigation, deren Einträge Ziele sind',
    pickNavHow: 'nav mit a',
    pickNavWhy: 'die Konvention des Kits, und ein einziges Fokus-Modell statt eines Baum-Cursors neben den Tab-Stopps',
    pickMenuWhat: 'eine Liste von Befehlen, immer sichtbar',
    pickMenuWhy: 'kein Auf- und Zuklappen nötig, und ein einziges dokumentiertes Fokus-Modell statt zwei',

    ddModelBad:
      'Das Model wird bei jedem Wechsel aus einem computed neu gebaut, die Objekte, in die die Komponente expanded geschrieben hat, sind also weg, und jedes Panel klappt zu.',
    ddModelGood:
      'Derselbe Neubau, aber expanded wird aus einem Signal neu gesetzt, das der command des Headers aktualisiert — der Wechsel ändert die Sprache und sonst nichts.',
    ddEscapeBad:
      'Das sichtbare Label rendert das Markup, während der zugängliche Name die Tags behält, also wird die Zeile als „b Jetzt /b veröffentlichen“ angesagt.',
    ddEscapeGood: 'Ein String, ein Name, und die Dekoration kommt stattdessen aus icon.',

    tokGap: '0.5rem zwischen Panels',
    tokPanel: 'Hintergrund und Rahmenfarbe von content, 1px Rahmen, 0.25rem Padding, Radius von content',
    tokItem: 'navigation.item.padding, 0.5rem Abstand, Radius von content',
    tokFocus: 'navigation.item.focus.background und .color — eine Füllung, keine Outline',
    tokIndent: '1rem je Ebene, gespiegelt unter dir="rtl"',
    tokChevron:
      'navigation.submenu.icon.color, mit einer Fokus-Variante — das Kit setzt beide auf --text-color-secondary um',
    tokIcon:
      'navigation.item.icon.color (surface.400, 2,56:1 auf Weiß), mit einer Fokus-Variante — das Kit setzt beide auf --text-color-secondary um',

    foHeaderEl: '.p-panelmenu-header (der Tab-Stopp)',
    foHeaderDraw: 'ein Tausch von Hintergrund und Farbe unter :focus-visible; die Outline wird auf 0 none gesetzt',
    foHeaderOwe: 'der eine 2px-Ring in --primary-color-fg auf dem Inhalt des Headers, nach innen (Offset -2px)',
    foRowEl: '.p-panelmenu-item.p-focus (die Markierung der Pfeiltasten)',
    foRowDraw: 'derselbe Tausch des Hintergrunds, gebunden an eine Klasse, die der Tasten-Handler setzt',
    foRowOwe:
      'derselbe Ring auf dem Inhalt der Zeile — er markiert den virtuellen Cursor, der nach einem Tab auf einer anderen Zeile stehen kann als der fokussierte Anker',
    foLinkEl: '.p-panelmenu-item-link (der zweite Tab-Stopp)',
    foLinkDraw: 'gar nichts: outline: 0 none und keine Regel für :focus-visible',
    foLinkOwe:
      'derselbe Ring auf dem Inhalt seiner Zeile, gebunden an :focus-visible des Ankers — das Element, das ein Tab-Nutzer tatsächlich fokussiert',

    inModel: 'die Liste der Panels; ein einfaches Feld, getrackt nach Objektidentität, ein neues Array baut also jedes Panel neu',
    inMultiple: 'ob das Öffnen eines Headers die anderen schließt, indem es expanded: false in deren Model-Objekte schreibt',
    inMotion: 'die Zuklapp-Animation jedes Panel-Inhalts',
    inId: 'das Präfix der generierten IDs von Header und Inhalt; ein fehlender Wert wird mit einer UUID gefüllt, die IDs unterscheiden sich also je Rendering',
    inStyleClass: 'die Klasse des Hosts — veraltet, nimm class',
    inTabindex: 'nichts: Die Liste, an die es weitergereicht wird, bindet -1 an ihren Host, und der Tab-Stopp des Headers ist ein Literal 0',
    inTransitionDefault: '400ms cubic-bezier(0.86, 0, 0.07, 1)',
    inTransition: 'nichts: zwei Ebenen nach unten weitergereicht und von keiner Direktive gelesen; zugunsten von motionOptions veraltet',

    kbDownH: 'nächster Header, oder in die Liste dieses Panels, wenn es offen ist',
    kbDownT: 'nächste sichtbare Zeile, deaktivierte Zeilen übersprungen; kein Umlauf',
    kbUpH: 'vorheriger Header, oder in die Liste des vorherigen Panels, wenn jenes offen ist',
    kbUpT: 'vorherige sichtbare Zeile; auf der ersten Zeile zurück zum Panel-Header',
    kbLatH: 'nichts — der Handler hat für keine der beiden einen Zweig',
    kbLatT: 'Pfeil nach rechts klappt eine Gruppe auf oder geht hinein; Pfeil nach links klappt sie zu oder geht zur Elternzeile',
    kbHomeH: 'erster / letzter Header, deaktivierte übersprungen',
    kbHomeT: 'erste / letzte Zeile dieses Panels; der Baum wird nie verlassen',
    kbEnterH: 'schaltet das Panel um (klickt den Link des Headers, wenn es einen gibt)',
    kbEnterT: 'klickt den Anker der Zeile',
    kbEscH: 'nichts — kein Zweig im Handler',
    kbEscT: 'nichts — ein expliziter No-op-Zweig; keine Taste schließt ein Panel von innen',
    kbTabH: 'Standard des Browsers: weiter zum ersten Link eines offenen Panels',
    kbTabT: 'Standard des Browsers: weiter zum nächsten Link, ohne die Markierung zu verschieben',
    kbTypeH: 'nichts',
    kbTypeT: 'springt zur nächsten Zeile, deren Label mit den getippten Zeichen beginnt; der Puffer leert sich nach 500 ms',

    i18nNameGap:
      'Ein Label mit escape: false wird samt Markup angesagt, weil der zugängliche Name der ungeparste String ist — Übersetzungen, die Tags zur Betonung tragen, werden als Tags vorgelesen.',
    i18nWidthGap:
      'Längere Sprachen werden nicht abgeschnitten, sie brechen um und machen die Zeile höher, und jede Ebene hat schon 1rem der verfügbaren Breite für die Einrückung verbraucht.',
    i18nTypeaheadGap:
      'Die Typeahead-Suche wandelt in Kleinbuchstaben um und vergleicht ab dem Anfang des Labels, sie findet also weder ein Wort in der Mitte noch eine Form ohne diakritische Zeichen.',
  };
}
