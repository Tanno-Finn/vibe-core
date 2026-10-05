import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { MegaMenuItem } from '@openng/optimus-ui/api';
import { ListboxArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './listbox-article.component';

/**
 * German twin of the Listbox, MegaMenu, and CascadeSelect guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers and code snippets
 * are shared; only the template, the menu models and the visible strings in `m`
 * are German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs listbox`).
 */
@Component({
  selector: 'app-listbox-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'listbox'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Drei Wege, etwas auszuwählen, und drei verschiedene Antworten auf die Frage „Was ist das im
          Accessibility Tree?“. Das eine ist eine Liste, aus der du wählst, das andere eine Leiste aus Menüs, und das dritte nennt sich Combobox
          und öffnet einen Baum. Die Namen legen eine Familie nahe; das Markup nicht.
        </p>

        <h3>Alle drei, gerendert</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="lbl">p-listbox</span>
            <p-listbox
              [options]="cities"
              optionLabel="name"
              ariaLabel="Lieferort"
              [ngModel]="city()"
              (ngModelChange)="city.set($event)"
            />
          </div>
          <div class="col">
            <span class="lbl">p-cascadeSelect</span>
            <app-cascade-select-demo
              [options]="regions"
              [optionGroupChildren]="groupChildren"
              placeholder="Ort auswählen"
              ariaLabel="Lieferort"
              [(value)]="cascadeCity"
            />
          </div>
        </div>
        <div class="stage">
          <span class="lbl">p-megaMenu</span>
          <nav aria-label="Produkte">
            <p-megaMenu [model]="megaModel" />
          </nav>
        </div>
        <p class="src-note">
          Rollen abgelesen an den ausgelieferten Templates: <code>openng-optimus-ui-listbox.mjs:1501</code>,
          <code>openng-optimus-ui-megamenu.mjs:280</code> und
          <code>openng-optimus-ui-cascadeselect.mjs:1447</code>.
        </p>

        <h3>Was jede davon in den Accessibility Tree schreibt</h3>
        <div class="table-wrap">
          <table>
            <caption>
              ARIA, das die drei Komponenten ausgeben, Optimus UI 2.0.2
            </caption>
            <thead>
              <tr>
                <th>Attribut</th>
                <th><code>p-listbox</code></th>
                <th><code>p-megaMenu</code></th>
                <th><code>p-cascadeSelect</code></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Rolle des Containers</td><td>{{ m.roleListbox }}</td><td>{{ m.roleMega }}</td><td>{{ m.roleCascade }}</td></tr>
              <tr><td>Rolle der Items</td><td><code>option</code></td><td><code>menuitem</code></td><td><code>treeitem</code></td></tr>
              <tr><td><code>aria-label</code></td><td>{{ m.nameListbox }}</td><td>{{ m.nameMega }}</td><td>{{ m.nameCascade }}</td></tr>
              <tr><td><code>aria-labelledby</code></td><td>{{ m.byListbox }}</td><td>{{ m.byMega }}</td><td>{{ m.byCascade }}</td></tr>
              <tr><td><code>aria-activedescendant</code></td><td>{{ m.adYes }}</td><td>{{ m.adYes }}</td><td>{{ m.adYes }}</td></tr>
              <tr><td><code>aria-setsize</code></td><td>{{ m.setListbox }}</td><td>{{ m.setMega }}</td><td>{{ m.setCascade }}</td></tr>
              <tr><td><code>aria-posinset</code></td><td>{{ m.posListbox }}</td><td>{{ m.posMega }}</td><td>{{ m.posCascade }}</td></tr>
              <tr><td><code>aria-expanded</code> an einer Gruppe</td><td>{{ m.expListbox }}</td><td>{{ m.expMega }}</td><td>{{ m.expCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an <code>openng-optimus-ui-listbox.mjs:1501-1543</code>,
          <code>openng-optimus-ui-megamenu.mjs:280-307</code> und
          <code>openng-optimus-ui-cascadeselect.mjs:279-286</code> sowie
          <code>openng-optimus-ui-cascadeselect.mjs:1447-1459</code>.
        </p>
        <p>{{ m.tabindexNote }}</p>
        <p class="src-note">
          Das Binding am Anker ist <code>[attr.tabindex]="-1"</code> im Item-Template
          (<code>openng-optimus-ui-megamenu.mjs:325</code>).
        </p>

        <h3>Das MegaMenu-Modell ist drei Ebenen tief</h3>
        <pre class="code-block"><code>{{ modelShapeSnippet }}</code></pre>
        <p class="src-note">
          Die Verschachtelung ist keine Konvention, die du variieren kannst: Das Panel-Template durchläuft
          <code>processedItem.items</code> als Spalten und jede Spalte als Untermenüs
          (<code>openng-optimus-ui-megamenu.mjs:432-435</code>), und der öffentliche Typ deklariert
          <code>MegaMenuItem.items</code> als <code>MenuItem[][]</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Die drei teilen keinen Mechanismus, also ist die Wahl keine Kosmetik. Wähle danach, was die Sache IST — ein Wert, eine
          Route oder ein Wert am unteren Ende einer Hierarchie — und halte dann die zwei Verträge ein, die jede von ihnen
          dir überlässt: den Namen und die Flag-Kombinationen, die tatsächlich etwas rendern.
        </p>

        <h3>Auswählen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Die Aufgabe</th><th>Komponente</th><th>Warum diese</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.taskAll }}</td><td><code>p-listbox</code></td><td>{{ m.whyListbox }}</td></tr>
              <tr><td>{{ m.taskNav }}</td><td><code>p-megaMenu</code></td><td>{{ m.whyMega }}</td></tr>
              <tr><td>{{ m.taskDeep }}</td><td><code>p-cascadeSelect</code></td><td>{{ m.whyCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Aussage „an Ort und Stelle“ ist die Liste, die die Komponente inline rendert
          (<code>openng-optimus-ui-listbox.mjs:1497</code>), gegenüber dem Panel, das <code>MegaMenuSub</code>
          mit <code>style.display</code> versteckt (<code>openng-optimus-ui-megamenu.mjs:280</code>), und dem
          Overlay von CascadeSelect; die Aussage zur Tiefe ist der Gruppen-Zweig in
          <code>openng-optimus-ui-cascadeselect.mjs:285</code>, der für eine Gruppe kein
          <code>aria-selected</code> ausgibt.
        </p>

        <h3>Checkbox-Listbox: Ein Flag reicht nicht</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — checkbox ohne multiple</span>
            <div class="dd__stage">
              <p-listbox
                [options]="cities"
                optionLabel="name"
                [checkbox]="true"
                ariaLabel="Städte, nur Checkbox"
                [ngModel]="ddSingle()"
                (ngModelChange)="ddSingle.set($event)"
              />
            </div>
            <p class="dd__why">{{ m.ddCheckboxBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — checkbox mit multiple</span>
            <div class="dd__stage">
              <p-listbox
                [options]="cities"
                optionLabel="name"
                [checkbox]="true"
                [multiple]="true"
                ariaLabel="Städte, Mehrfachauswahl"
                [ngModel]="ddMulti()"
                (ngModelChange)="ddMulti.set($event)"
              />
            </div>
            <p class="dd__why">{{ m.ddCheckboxGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Die Checkbox je Option ist durch <code>checkbox &amp;&amp; multiple</code> geschützt
          (<code>openng-optimus-ui-listbox.mjs:1560</code>), der Umschalter im Header durch
          <code>checkbox &amp;&amp; multiple &amp;&amp; showToggleAll</code> (<code>:1383</code>).
        </p>

        <h3>CascadeSelect: Sichtbarer Text und Name sind zwei verschiedene Knoten</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — kein Platzhalter, kein Name</span>
            <div class="dd__stage">
              <app-cascade-select-demo [options]="regions" [optionGroupChildren]="groupChildren" />
              <pre class="code-block"><code>{{ ddCascadeBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddCascadeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Platzhalter plus ariaLabel</span>
            <div class="dd__stage">
              <app-cascade-select-demo
                [options]="regions"
                [optionGroupChildren]="groupChildren"
                placeholder="Ort auswählen"
                ariaLabel="Lieferort"
              />
              <pre class="code-block"><code>{{ ddCascadeGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.ddCascadeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Das leere Feld ist das <code>span</code> in
          <code>openng-optimus-ui-cascadeselect.mjs:1467</code>; der Name sitzt auf dem versteckten Input in
          <code>:1447-1455</code>, weshalb ein <code>&lt;label for&gt;</code> auch auf
          <code>inputId</code> zielen muss.
        </p>

        <h3>Labels der MegaMenu-Leiste laufen über innerHTML</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Markup in einem Leisten-Label</span>
            <div class="dd__stage">
              <nav aria-label="Markup-Demo, Don’t">
                <p-megaMenu [model]="escapeBadModel" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — escape: true am Leisten-Item</span>
            <div class="dd__stage">
              <nav aria-label="Markup-Demo, Do">
                <p-megaMenu [model]="escapeGoodModel" />
              </nav>
            </div>
            <p class="dd__why">{{ m.ddEscapeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Der Zweig ist <code>escape</code> wahr → interpoliertes span, alles andere →
          <code>[innerHTML]</code> (<code>openng-optimus-ui-megamenu.mjs:338-347</code>), und
          <code>escape</code> hat keinen Standard (<code>openng-optimus-ui-api.d.ts:476</code>).
          <code>MegaMenuItem</code> deklariert kein <code>escape</code>, trägt aber
          <code>[key: string]: any</code> (<code>openng-optimus-ui-api.d.ts:752</code>), und Leiste und Spalten
          sind dasselbe Template <code>MegaMenuSub</code>, also nimmt auch ein Leisten-Item den Escape-Zweig.
        </p>

        <h3>Jede der drei benennen</h3>
        <pre class="code-block"><code>{{ namingSnippet }}</code></pre>
        <p class="src-note">
          <code>ariaLabel</code> erreicht die Liste in <code>openng-optimus-ui-listbox.mjs:1507</code> und den
          versteckten Input in <code>openng-optimus-ui-cascadeselect.mjs:1454</code>. Bei MegaMenu wird der Input
          in <code>MegaMenuSub</code> weitergereicht (<code>openng-optimus-ui-megamenu.mjs:1461</code>), und der Host
          dieser Komponente bindet kein Namensattribut (<code>:280</code>), also trägt der Wrapper den Namen.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Listbox pattern</a
            >
            — der Vertrag für Rolle, Auswahl und Benennung, an dem <code>p-listbox</code> geprüft wird.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Menu and Menubar pattern</a
            >
            — der Tastatur- und Benennungsvertrag der Menubar, die <code>p-megaMenu</code> rendert.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Combobox pattern</a
            >
            — was eine Combobox ihrem Popup schuldet, hier einem Baum, einschließlich des Verweises <code>aria-controls</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — die 3:1, die eine Feldkante und ein Fokus-Ring erreichen müssen.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Zwei der drei beziehen ihre Fläche aus der Formularfeld-Kette und eine aus der Content-Kette. Das Kit
          stellt die beiden Feldkanten auf <code>--control-border</code> um, wie bei Select und Textarea daneben,
          und behandelt das geschlossene Cascade Select als das Select, das es ist: gleicher Text, dunkle Füllung, Chevron-Farbe, Rot für ungültig
          und 2px-Fokus-Ring. MegaMenu bekommt diesen Ring an seinem mobilen Button
          (<code>.p-megamenu-button:focus-visible</code>) und einen Untermenü-Chevron in <code>--text-color-secondary</code>.
          In den Listen tragen die per Tastatur aktive Option von Listbox und Cascade Select und das per Tastatur aktive Mega-Menu-Item
          denselben Ring, innen gezeichnet; keine Fokus-Markierung bleibt allein Hintergrund und Farbe überlassen.
        </p>

        <h3>Wurzeln der Aura-Presets</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Komponente</th><th>Hintergrund / Rahmen der Wurzel</th><th>Fokus-Ring im Preset</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-listbox</code></td><td>{{ m.tokListbox }}</td><td>{{ m.ringListbox }}</td></tr>
              <tr><td><code>p-megaMenu</code></td><td>{{ m.tokMega }}</td><td>{{ m.ringMega }}</td></tr>
              <tr><td><code>p-cascadeSelect</code></td><td>{{ m.tokCascade }}</td><td>{{ m.ringCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/listbox/index.mjs</code>,
          <code>&#64;openng/optimus-ui-themes/dist/aura/megamenu/index.mjs</code> und
          <code>&#64;openng/optimus-ui-themes/dist/aura/cascadeselect/index.mjs</code>; die Regeln, die sie
          verarbeiten, aus den passenden Paketen unter <code>&#64;openng/optimus-ui-styles</code>.
        </p>

        <h3>Kontrast: Was dieser Guide zitieren darf und was nicht</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Die Paare, die diese Komponenten schulden, und wo das Kontrast-Gate bei jedem steht (jeder Stil, beide Modi)
            </caption>
            <thead>
              <tr><th>Paar</th><th>An</th><th>Zeile im Kompilat?</th><th>Kriterium</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.crEdgePair }}</td><td><code>p-listbox</code>, <code>p-cascadeSelect</code></td><td>{{ m.crEdgeRow }}</td><td>{{ m.crEdge }}</td></tr>
              <tr><td>{{ m.crFieldPair }}</td><td><code>p-cascadeSelect</code></td><td>{{ m.crFieldRow }}</td><td>{{ m.crField }}</td></tr>
              <tr><td>{{ m.crOptionPair }}</td><td><code>p-listbox</code>, <code>p-cascadeSelect</code></td><td>{{ m.crOptionRow }}</td><td>{{ m.crOption }}</td></tr>
              <tr><td>{{ m.crFocusPair }}</td><td><code>p-megaMenu</code></td><td>{{ m.crFocusRow }}</td><td>{{ m.crFocus }}</td></tr>
              <tr><td>{{ m.crTextPair }}</td><td>alle drei</td><td>{{ m.crNone }}</td><td>{{ m.crText }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> misst die beiden Feldkanten unter ihren eigenen Namen
          (<code>listbox.border.color</code>, <code>cascadeselect.border.color</code>), weil
          <code>src/styles.scss</code> das eigene Token jeder Komponente umstellt (die Regeln <code>.p-listbox</code> und
          <code>.p-cascadeselect</code>) statt des gemeinsamen <code>form.field.border.color</code>, das
          Optimus auf <code>:root</code> auflöst. Der Ring der aktiven Option steckt in der einen Ring-Regel des Kits
          (<code>.p-listbox-option.p-focus</code>,
          <code>.p-cascadeselect-option.p-focus &gt; .p-cascadeselect-option-content</code>, Offset -2px) und ist gemessen
          auf den Optionsfüllungen, auf die er trifft („option list focus“). Der Ring des Mega-Menu-Items
          (<code>.p-megamenu-item.p-focus &gt; .p-megamenu-item-content</code>, innen) und sein Chevron sind gemessen
          über die Menubar-Zeilen („menu focus“): Das Gate stellt sicher, dass Panel- und Chevron-Tokens des Megamenu denen der
          Menubar gleichen. Der Optionstext hat keine Zeile: Das ist Auras <code>list.option.*</code>, das keine Kit-Regel
          umstellt.
        </p>
        <p class="src-note">
          Fokus auf dem geschlossenen Cascade Select: Die Kit-Regel <code>.p-cascadeselect.p-focus</code> zeichnet 2px solid
          <code>--primary-color-fg</code> mit 2px Offset plus einen Rahmen in derselben Farbe (<code>!important</code>, beide
          Modi) — der Ring des Select, per Gate geprüft als „focus ring“ (ab 3,88:1).
        </p>

        <h3>Schmale Viewports</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          Weder <code>&#64;openng/optimus-ui-styles/dist/listbox/index.mjs</code> noch seine Gegenstücke für megamenu und
          cascadeselect enthalten eine <code>&#64;media</code>-Regel; die Breakpoints sind JavaScript
          (<code>openng-optimus-ui-megamenu.mjs:928</code>,
          <code>openng-optimus-ui-cascadeselect.mjs:1404</code>), und die Begrenzung der Listbox ist das inline
          gesetzte <code>max-height</code>, gebunden an <code>scrollHeight</code>, über einem Container mit
          <code>overflow: auto</code>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Die drei überschneiden sich viel weniger, als die Familienähnlichkeit vermuten lässt. Es folgt, was zu genau
          einer von ihnen gehört, was deklariert, aber nie gerendert wird, und die zwei verschiedenen Arten, wie zwei von ihnen den Browser
          nach seiner Breite fragen.
        </p>

        <h3>Selektoren und Form</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Komponente</th><th>Akzeptierte Selektoren</th><th>Outputs</th></tr>
            </thead>
            <tbody>
              <tr><td>Listbox</td><td>{{ m.selListbox }}</td><td>{{ m.outListbox }}</td></tr>
              <tr><td>MegaMenu</td><td>{{ m.selMega }}</td><td>{{ m.outMega }}</td></tr>
              <tr><td>CascadeSelect</td><td>{{ m.selCascade }}</td><td>{{ m.outCascade }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selektor-Strings und Output-Maps aus den kompilierten Deklarationen:
          <code>openng-optimus-ui-listbox.mjs:1353</code>, <code>openng-optimus-ui-megamenu.mjs:1423</code>,
          <code>openng-optimus-ui-cascadeselect.mjs:1441</code>.
        </p>

        <h3>Inputs, die nur eine der drei hat</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>An</th><th>Was es tut</th></tr>
            </thead>
            <tbody>
              <tr><td><code>virtualScroll</code>, <code>dragdrop</code>, <code>filter</code></td><td><code>p-listbox</code></td><td>{{ m.onlyListbox }}</td></tr>
              <tr><td><code>size</code>, <code>variant</code>, <code>appendTo</code>, <code>motionOptions</code></td><td><code>p-cascadeSelect</code></td><td>{{ m.onlyCascade }}</td></tr>
              <tr><td><code>orientation</code></td><td><code>p-megaMenu</code></td><td>{{ m.onlyMega }}</td></tr>
              <tr><td><code>fluid</code></td><td>{{ m.fluidWhere }}</td><td>{{ m.fluidWhat }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kompilierte Input-Listen, <code>openng-optimus-ui-listbox.mjs:1353</code>,
          <code>openng-optimus-ui-megamenu.mjs:1423</code> und
          <code>openng-optimus-ui-cascadeselect.mjs:1441</code>; der MegaMenu-Standard steht in
          <code>openng-optimus-ui-megamenu.mjs:750</code>.
        </p>

        <h3>Deklariert und dann fallen gelassen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Deklariert in</th><th>Was damit passiert</th></tr>
            </thead>
            <tbody>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td><code>openng-optimus-ui-megamenu.mjs:194-195</code></td><td>{{ m.deadMegaName }}</td></tr>
              <tr><td><code>mobileActive</code></td><td><code>openng-optimus-ui-cascadeselect.mjs:1332</code></td><td>{{ m.deadMobileActive }}</td></tr>
              <tr><td>Ziel von <code>aria-controls</code></td><td><code>openng-optimus-ui-cascadeselect.mjs:1458</code></td><td>{{ m.deadControls }}</td></tr>
              <tr><td><code>[attr.ariaPosInset]</code></td><td><code>openng-optimus-ui-listbox.mjs:1543</code></td><td>{{ m.deadPosInset }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Jede Zeile ist ein Binding, das im ausgelieferten Template oder Klassenrumpf existiert und keine erreichbare Wirkung hat.
          Die Zeile <code>mobileActive</code> ist das Fehlen eines Lesezugriffs: Das Signal wird deklariert
          (<code>openng-optimus-ui-cascadeselect.mjs:1332</code>) und gesetzt (<code>:1409</code>), und kein Ausdruck
          im Bundle nimmt seinen Wert.
        </p>

        <h3>Zwei Komponenten, zwei verschiedene Breiten-Sperren</h3>
        <pre class="code-block"><code>{{ matchMediaSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-megamenu.mjs:926-928</code> und
          <code>openng-optimus-ui-cascadeselect.mjs:1402-1404</code>. Der Unterschied zählt, wenn die Komponente
          auf einem Server gerendert wird: Die eine wird über die Plattform abgeschaltet, die andere darüber, ob ein
          <code>defaultView</code> mit <code>matchMedia</code> existiert.
        </p>

        <h3>Checkliste, bevor du eine der drei auslieferst</h3>
        <ul class="checklist">
          <li>{{ m.chkName }}</li>
          <li>{{ m.chkFlags }}</li>
          <li>{{ m.chkEscape }}</li>
          <li>{{ m.chkFocus }}</li>
          <li>{{ m.chkEdge }}</li>
          <li>{{ m.chkMulti }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Manche der Strings, die diese Komponenten ansagen, laufen nie durch dein Template. Sie werden aus der
          eigenen Übersetzungskonfiguration der Bibliothek gelesen — die Seite zu übersetzen ist also nicht dasselbe, wie die
          Komponente zu übersetzen.
        </p>

        <h3>Strings, die die Bibliothek selbst liefert</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>String</th><th>Komponente</th><th>Woher er kommt</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.i18nToggleAll }}</td><td><code>p-listbox</code></td><td><code>translation.aria.selectAll</code> / <code>unselectAll</code></td></tr>
              <tr><td>{{ m.i18nEmptyFilter }}</td><td><code>p-listbox</code></td><td>{{ m.i18nEmptyChain }}</td></tr>
              <tr><td>{{ m.i18nNav }}</td><td><code>p-megaMenu</code></td><td><code>translation.aria.navigation</code></td></tr>
              <tr><td>{{ m.i18nListLabel }}</td><td><code>p-cascadeSelect</code></td><td><code>getTranslation(ARIA).listLabel</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-listbox.mjs:643-644</code> und <code>:622-623</code>,
          <code>openng-optimus-ui-megamenu.mjs:1439</code>,
          <code>openng-optimus-ui-cascadeselect.mjs:792-793</code>.
        </p>

        <h3>Die Zählmeldung nutzt einen Positions-Platzhalter</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-listbox.mjs:631-632</code> ersetzt jedes <code>&#123;0&#125;</code> im
          konfigurierten String und wählt die Anzahl der Auswahl oder die Meldung für eine leere Auswahl, je nachdem, ob
          etwas ausgewählt ist — eine Übersetzung, die den Platzhalter weglässt, verliert die Zahl also still.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.3</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das per Tastatur aktive
            Mega-Menu-Item bekommt den Kit-Ring innen, und sein Chevron ist <code>--text-color-secondary</code>, beides
            gemessen über die Menubar-Zeilen („menu focus“); Lead, Kontrasttabelle und Checkliste nennen keine
            Fokus-Markierung mehr, die nur aus Hintergrund besteht.
          </li>
          <li>
            <strong>v1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Kanten von Listbox und Cascade
            Select sind jetzt das <code>--control-border</code> des Kits, mit eigenen Zeilen in „form field edge“,
            das geschlossene Cascade Select übernimmt Text, Chevron, Rot für ungültig und 2px-Ring des Select
            (<code>.p-cascadeselect.p-focus</code>), und der mobile Button des Mega Menu sowie die per Tastatur aktive Option von Listbox
            und Cascade Select bekommen denselben Ring („option list focus“); Lead, Kontrasttabelle und Checkliste sagen
            das. Das Mega-Menu-Item markiert den Fokus weiterhin allein durch den Hintergrund.
          </li>
          <li>
            <strong>v1.1</strong> — 23.09.2026 — Erneut geprüft gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016):
            Für den Fokus-Ring des Cascade Select ist festgehalten, dass er zu Breite 0 auflöst (nur Rahmenfarbe); der Tab Design
            nennt die Standard-Ruhekante von Listbox und Cascade Select, die keine Kit-Regel umstellt, und ersetzt
            das Raster „keine Zeile“ je Stil durch die drei Paare, die diese Komponenten schulden; abschließende Quellen in Verwendung ergänzt.
          </li>
          <li><strong>v1.0</strong> — erstmals veröffentlicht. Gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ListboxArticleDeComponent extends ListboxArticleComponent {
  override readonly megaModel: MegaMenuItem[] = [
    {
      label: 'Hardware',
      items: [
        [
          { label: 'Bildschirme', items: [{ label: 'Monitore', escape: true }, { label: 'Beamer', escape: true }] },
          { label: 'Eingabe', items: [{ label: 'Tastaturen', escape: true }, { label: 'Mäuse', escape: true }] },
        ],
        [{ label: 'Speicher', items: [{ label: 'SSD', escape: true }, { label: 'NAS', escape: true }] }],
      ],
    },
    {
      label: 'Software',
      items: [[{ label: 'Werkzeuge', items: [{ label: 'Editoren', escape: true }, { label: 'Terminals', escape: true }] }]],
    },
  ];

  override readonly escapeBadModel: MegaMenuItem[] = [
    { label: 'Angebote <strong>neu</strong>', items: [[{ label: 'Aktionen', items: [{ label: 'Pakete', escape: true }] }]] },
  ];

  override readonly escapeGoodModel: MegaMenuItem[] = [
    { label: 'Angebote <strong>neu</strong>', escape: true, items: [[{ label: 'Aktionen', items: [{ label: 'Pakete', escape: true }] }]] },
  ];

  override readonly m = {
    roleListbox: 'listbox, auf dem ul',
    roleMega: 'menubar auf der Wurzelliste, menu auf jeder Panel-Liste',
    roleCascade: 'combobox auf einem versteckten Input, tree auf der Overlay-Liste',
    nameListbox: 'aus ariaLabel gerendert',
    nameMega: 'Input existiert, nichts rendert ihn',
    nameCascade: 'aus ariaLabel gerendert',
    byListbox: 'kein solcher Input',
    byMega: 'Input existiert, nichts rendert ihn',
    byCascade: 'aus ariaLabelledBy gerendert',
    adYes: 'ja',
    setListbox: 'ja, und es lässt Gruppen-Header aus',
    setMega: 'ja',
    setCascade: 'ja, die Länge der aktuellen Ebene',
    posListbox: 'nein — das Binding erzeugt stattdessen ariaposinset',
    posMega: 'ja',
    posCascade: 'ja',
    expListbox: 'entfällt, Gruppen sind Optionen',
    expMega: 'ja, an einem Gruppen-Item',
    expCascade: 'nein, Gruppen-treeitems tragen keins',

    taskAll: 'Jede Wahlmöglichkeit muss auf dem Bildschirm bleiben und bedienbar sein, ohne etwas zu öffnen',
    taskNav: 'Navigation auf oberster Ebene, deren Einträge ein Panel mit Link-Spalten öffnen',
    taskDeep: 'Ein Wert, der am unteren Ende einer Hierarchie von Gruppen sitzt',
    whyListbox: 'Die einzige der drei, die ihre ganze Optionsmenge an Ort und Stelle rendert, ohne Auslöser und ohne Overlay.',
    whyMega: 'Die einzige, deren Modell aus Spalten von Untermenüs besteht statt aus einer flachen Liste.',
    whyCascade: 'Ihre Zwischenebenen sind Gruppen, die du durchläufst, und eine Gruppe lässt sich nicht auswählen.',

    ddCheckboxBad:
      'Das Flag checkbox allein rendert keine Checkbox und kein Alle-auswählen: Beide sind zusätzlich an multiple gebunden, also sieht die Liste aus wie eine gewöhnliche Einfachauswahl, und die Bedienhilfe, die der Aufrufer angefordert hat, fehlt still.',
    ddCheckboxGood:
      'Mit beiden Flags erscheinen die Checkbox je Option und der Umschalter im Header — die einzige Konfiguration, in der der Input checkbox überhaupt eine sichtbare Wirkung hat.',
    ddCascadeBad:
      'Das sichtbare Label ist ein einfaches span, also zeigt das Feld ohne Wert und ohne Platzhalter gar nichts — und ohne ariaLabel hat auch die versteckte Combobox keinen Namen, sodass das Element auf beiden Kanälen zugleich unbeschriftet bleibt.',
    ddCascadeGood:
      'Der Platzhalter füllt das sichtbare span, und ariaLabel benennt den versteckten Input, also bekommen der sehende Leser und der Accessibility Tree ihre Antwort von verschiedenen Knoten — so ist diese Komponente gebaut.',
    ddEscapeBad:
      'Ein Leisten-Label mit Markup wird über innerHTML gerendert, die Tags werden also interpretiert statt angezeigt: escape ist an diesem Item nicht gesetzt und hat keinen Standard, was das Label in diesen Zweig schickt.',
    ddEscapeGood:
      'Dasselbe Label mit escape: true nimmt den interpolierenden Zweig und zeigt das Markup als Text. MegaMenuItem deklariert escape nicht, trägt aber eine Index-Signatur, und die Leiste nutzt dasselbe Item-Template wie die Spalten.',

    tokListbox: 'form.field.background / form.field.border.color',
    tokMega: 'content.background / content.border.color',
    tokCascade: 'form.field.background / form.field.border.color, dazu Rahmenfarben für Hover und Fokus',
    ringListbox:
      'keiner — das Preset hat keinen Key focusRing, und das Stylesheet markiert den Fokus nur mit Hintergrund und Textfarbe der Option; in diesem Kit bekommt die aktive Option den Kit-Ring (unten)',
    ringMega:
      'nur für den mobilen Hamburger-Button (megamenu.mobile.button.focus.ring.*); Aura markiert Items allein über navigation.item.focus.background — in diesem Kit bekommt das aktive Item den Kit-Ring (unten)',
    ringCascade:
      'ein Key, der ins Leere auflöst: cascadeselect.focus.ring verweist auf form.field.focus.ring, das Aura mit Breite 0, Stil none ausliefert — in diesem Kit zeichnet stattdessen die Regel .p-cascadeselect.p-focus den 2px-Ring (unten)',

    crNone: 'keine Zeile',
    crEdgePair: 'ruhende Kante: --control-border (Kit-Regel; Aura-Standard surface.300 / surface.600) auf Grund, Karte und Feldfüllung',
    crEdgeRow: '„form field edge“: listbox.border.color 3,85–6,57:1, cascadeselect.border.color 3,25–5,51:1',
    crEdge: 'SC 1.4.11, 3:1 überall dort, wo die Kante das Feld erkennbar macht — beim geschlossenen Cascade Select immer. Erfüllt in jedem Stil und Modus',
    crFieldPair: 'geschlossenes Feld: Werttext, Platzhalter und Dropdown-Chevron auf der Feldfüllung',
    crFieldRow:
      '„form field text“ (Wert ab 9,35:1, Platzhalter ab 4,76:1) und „form field icon“ (Chevron, --text-color-secondary, 4,79–7,78:1)',
    crField: 'SC 1.4.3, 4,5:1 für den Text; SC 1.4.11, 3:1 für den Chevron. Erfüllt in jedem Stil und Modus',
    crOptionPair:
      'die per Tastatur aktive Option: der Kit-Ring (2px --primary-color-fg, innerhalb der Option) gegen die Optionsfüllung — ruhend, Fokus-Tönung, ausgewählt',
    crOptionRow: '„option list focus“: ab 3,48:1 über alle Optionslisten; die Listbox-Zeilen ab 4,45:1',
    crOption: 'SC 1.4.11, 3:1, und SC 2.4.7 — erfüllt in jedem Stil, jedem Akzent und jedem Modus (die Fokus-Tönung allein liegt bei 1,10–1,19:1)',
    crFocusPair:
      'das per Tastatur aktive Mega-Menu-Item: der Kit-Ring (2px --primary-color-fg, innerhalb des Items) auf dem Fokus-Hintergrund und dem Panel, und der Chevron in --text-color-secondary',
    crFocusRow:
      '„menu focus“ (die Menubar-Zeilen stehen dafür): Ring ab 4,73:1, Chevron ab 4,76:1; die Fokus-Tönung allein liegt bei 1,10–1,19:1 (zur Information)',
    crTextPair: 'Options- und Item-Text auf ruhendem, fokussiertem und ausgewähltem Hintergrund',
    crText: 'SC 1.4.3, 4,5:1 bei den Schriftgrößen des Presets',
    tabindexNote:
      'MegaMenu geht weiter als der virtuelle Cursor: Jeder Item-Anker ist fest auf ' +
      'tabindex="-1" gesetzt, der wandernde Fokus ist also der einzige Weg hinein, und ein ' +
      'browsereigenes Tab in ein Menü-Item passiert nie.',
    crFocus:
      'SC 1.4.11, 3:1, und SC 2.4.7 — vom Ring erfüllt in jedem Stil, jedem Akzent und jedem Modus; der Fokus-Hintergrund ist nicht mehr die einzige Markierung',
    responsive:
      'p-listbox hat kein responsives Verhalten und keinen Breakpoint: Sie behält bei jedem Viewport ihre intrinsische Breite, begrenzt ihre Höhe selbst auf scrollHeight (standardmäßig 14rem) und scrollt darin. p-megaMenu und p-cascadeSelect wechseln beide ihr Layout an einem JavaScript-Breakpoint von max-width 960px — das Mega Menu klappt seine Leiste hinter einen Hamburger-Button ein, und das Cascade Select macht aus seinen seitlich ausklappenden Ebenen eingerückte Inline-Listen. Layout-Leitlinie: Gib der Listbox ein Flex-Elternelement mit min-width: 0, wenn sie schrumpfen muss, und setz breakpoint bei den anderen beiden explizit, statt darauf zu bauen, dass 960px zu deinem Grid passt.',

    selListbox: 'p-listbox, p-listBox, p-list-box',
    selMega: 'p-megaMenu, p-megamenu, p-mega-menu',
    selCascade: 'p-cascadeSelect, p-cascadeselect, p-cascade-select',
    outListbox: 'onChange, onClick, onDblClick, onFilter, onFocus, onBlur, onSelectAllChange, onLazyLoad, onDrop',
    outMega: 'gar keine — die Aktivierung läuft über das command jedes Items',
    outCascade: 'onChange, onGroupChange, onShow, onHide, onClear, onBeforeShow, onBeforeHide, onFocus, onBlur',

    onlyListbox: 'Virtualisierte Zeilen, Umsortieren per CDK-Drag-and-drop und ein eingebautes Filterfeld mit role searchbox.',
    onlyCascade: 'Feldgröße, Variante filled oder outlined, Overlay-Ziel und die Bewegungsoptionen des Overlays.',
    onlyMega: 'Horizontale oder vertikale Leiste; es bestimmt auch, welcher Untermenü-Chevron gezeichnet wird.',
    fluidWhere: 'p-listbox und p-cascadeSelect',
    fluidWhat: 'Bei beiden ein Signal-Input; p-megaMenu hat keinerlei Breiten-Input.',

    deadMegaName:
      'Wird in die Sub-Komponente weitergereicht, deren Map der Host-Properties kein aria-label und kein aria-labelledby trägt — keiner der beiden Inputs erreicht also das DOM.',
    deadMobileActive:
      'Vom Resize-Listener auf false gesetzt und nie gelesen: Beide mobilen Klassen hängen stattdessen an queryMatches().',
    deadControls:
      'Verweist auf eine id der Form <id>_tree, die kein Element im Bundle bekommt, weil die Overlay-Liste role, aria-orientation und aria-label bindet, aber nie id.',
    deadPosInset:
      'Der Attributname ist camelCase, das DOM bekommt also ariaposinset; das korrekt geschriebene aria-setsize sitzt auf demselben Element.',

    chkName: 'Jede Instanz hat einen Namen: ariaLabel an Listbox und Cascade Select, ein beschrifteter nav-Wrapper um das Mega Menu.',
    chkFlags: 'checkbox wird nie ohne multiple gesetzt.',
    chkEscape: 'Jedes Item, dessen Label kein von dir geschriebenes Literal ist, trägt escape: true, Einträge der Leiste eingeschlossen.',
    chkFocus:
      'Außerhalb dieses Kits gibt das Theme dem Mega-Menu-Item eine Fokus-Markierung, die nicht nur ein Farbwechsel ist (sein Preset liefert keinen Ring); hier umrandet das Kit das aktive Item schon innen, wie die aktive Option von Listbox und Cascade Select (per Gate geprüft, „menu focus“).',
    chkEdge:
      'Außerhalb dieses Kits wird die ruhende Kante von Listbox und Cascade Select so umgestellt, dass sie 3:1 gegen ihren Grund schafft; hier erledigt das Kit das schon (--control-border, per Gate geprüft).',
    chkMulti:
      'Für eine Listbox mit Einfachauswahl ist dokumentiert, dass sie aria-multiselectable ansagt, weil das Binding ein Literal auf dem ul ist, das die Komponente selbst rendert.',

    i18nToggleAll: 'Das Label der Alle-auswählen-Checkbox im Header',
    i18nEmptyFilter: 'Die Meldung, wenn ein Filter nichts findet',
    i18nEmptyChain: 'Input emptyFilterMessage, sonst translation.emptySearchMessage, sonst translation.emptyFilterMessage, sonst ein leerer String',
    i18nNav: 'Das Label des mobilen Hamburger-Buttons',
    i18nListLabel: 'Der barrierefreie Name des Overlay-Trees',
  };
}
