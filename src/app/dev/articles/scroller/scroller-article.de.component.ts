import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Row, ScrollerArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './scroller-article.component';

/**
 * German twin of the Scroller guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the demo labels and the visible
 * strings in `m` are German. Keep it in step with the English file: same tabs, same
 * element and binding skeleton (`node scripts/check-guide-translations.mjs scroller`).
 */
@Component({
  selector: 'app-scroller-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'scroller'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein virtueller Scroller hält die Seite schnell, indem er den Großteil der Liste aus ihr heraushält. Alles, was
          ein Browser oder ein Screenreader mit einer Liste macht — suchen, vorlesen, zählen, den Fokus halten —, funktioniert
          nur mit dem Teil, der da ist.
        </p>

        <h3>Zehntausend Zeilen, ein Dutzend im DOM</h3>
        <div class="stage">
          <p-scroller
            [items]="rows"
            [itemSize]="rowSize"
            scrollHeight="240px"
            styleClass="demo-scroller"
            [pt]="plainPt"
            (onScrollIndexChange)="onRange($event)"
          >
            <ng-template #item let-row let-options="options">
              <div class="row" [class.row--odd]="options.odd" [style.height.px]="rowSize">{{ row.label }}</div>
            </ng-template>
          </p-scroller>
          <p class="stage__status">Gerade gerendert: Zeilen {{ rangeFirst() + 1 }}–{{ rangeLast() }} von {{ rows.length }}.</p>
        </div>
        <p class="src-note">
          Such auf der Seite nach „Zeile 10000“, bevor du scrollst: Der einzige Treffer steht in diesem Satz, weil es diese
          Zeile noch nicht gibt. Der Scroller rendert <code>items.slice(first, last)</code> (<code>openng-optimus-ui-scroller.mjs:516-536</code>)
          und vertritt den Rest durch einen Platzhalter von <code>items.length × itemSize</code> (<code>:885-899</code>).
        </p>

        <h3>Dieselbe Liste, mit Listensemantik und einer Sprungmöglichkeit</h3>
        <div class="stage">
          <div class="jump">
            <label for="sc-jump">Zu Zeile springen</label>
            <input id="sc-jump" type="number" min="1" [max]="rows.length" [value]="jumpTarget()" (input)="onJumpInput($event)" />
            <p-button label="Los" size="small" severity="secondary" [outlined]="true" (onClick)="jump()" />
          </div>
          <p-scroller #listScroller [items]="rows" [itemSize]="rowSize" scrollHeight="240px" styleClass="demo-scroller" [pt]="listPt">
            <ng-template #content let-items let-options="options">
              <ul role="list" [class]="options.contentStyleClass" [style]="options.contentStyle">
                @for (row of items; track row.id; let i = $index) {
                  <li
                    class="row"
                    [class.row--odd]="options.getItemOptions(i).odd"
                    [style.height.px]="rowSize"
                    [attr.aria-setsize]="rows.length"
                    [attr.aria-posinset]="options.getItemOptions(i).index + 1"
                  >
                    {{ row.label }}
                  </li>
                }
              </ul>
            </ng-template>
          </p-scroller>
        </div>
        <p class="src-note">
          Das <code>#content</code>-Template rendert ein echtes <code>ul</code>/<code>li</code> und setzt
          <code>aria-setsize</code> und <code>aria-posinset</code> aus <code>getItemOptions(i)</code>, dessen
          <code>index</code> absolut ist (<code>openng-optimus-ui-scroller.mjs:1104-1115</code>). Der Scroll-Container
          wird über <code>pt.root</code> benannt. „Los“ ruft <code>scrollToIndex</code> mit
          <code>scrollBehavior()</code> aus <code>src/app/utils/reduced-motion.ts</code> auf.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Wann sich der Ausschnitt lohnt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Die Liste</th><th>Greif zu</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr><td>Tausende gleichförmige Zeilen, die Leute scrollen, auswählen oder überfliegen (Logs, Token-Listen, eine große Optionsmenge)</td><td><code>p-scroller</code></td><td>{{ m.whenScroller }}</td></tr>
              <tr><td>Hunderte Optionen in einem Select oder einer Listbox</td><td><code>[virtualScroll]</code> an dieser Komponente</td><td>{{ m.whenBuiltIn }}</td></tr>
              <tr><td>Text, den Leute lesen oder durchsuchen (Glossar, Artikellisten, Zeitleisten)</td><td>eine einfache Liste, gefiltert oder paginiert</td><td>{{ m.whenReading }}</td></tr>
              <tr><td>Einträge unterschiedlicher Höhe</td><td>eine einfache Liste oder Paginierung</td><td>{{ m.whenVariable }}</td></tr>
              <tr><td>Ein paar hundert einfache Zeilen</td><td>eine einfache Liste</td><td>{{ m.whenSmall }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die feste Höhe kommt vom Platzhalter und der Transformation: Beide werden allein aus <code>itemSize</code>
          berechnet (<code>openng-optimus-ui-scroller.mjs:885-914</code>); keine Zeile wird je gemessen.
        </p>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Glossar in einem virtuellen Scroller</span>
            <div class="dd__stage">
              <p-scroller [items]="terms" [itemSize]="rowSize" scrollHeight="160px" styleClass="demo-scroller" [pt]="termsPt">
                <ng-template #item let-term>
                  <p class="term term--clip" [style.height.px]="rowSize"><strong>{{ term.label }}</strong> — {{ definition }}</p>
                </ng-template>
              </p-scroller>
            </div>
            <p class="dd__why">{{ m.ddBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine einfache, durchsuchbare Liste</span>
            <div class="dd__stage">
              <ul class="plain-list" tabindex="0" aria-label="Glossarbegriffe (einfache Liste)">
                @for (term of terms.slice(0, 40); track term.id) {
                  <li class="term"><strong>{{ term.label }}</strong> — {{ definition }}</li>
                }
              </ul>
            </div>
            <p class="dd__why">{{ m.ddGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Links: 400 Einträge, festgehalten auf <code>itemSize</code> 40, sodass jede Definition auf eine Zeile gekürzt
          wird. Rechts: die ersten 40 derselben Einträge als gewöhnliches Markup in einer scrollenden Box, alle im DOM.
          Such auf der Seite nach „Begriff 37“: Er wird nur rechts gefunden.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-setsize" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA 1.2, aria-setsize and aria-posinset</a>
            — die Attribute, die genau für diesen Fall gedacht sind: eine Menge, deren Mitglieder nicht alle im DOM sind.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.4.3 Focus Order</a>
            — was eine fokussierte Zeile kaputt macht, die aus dem DOM entfernt wird.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.4.5 Multiple Ways</a>
            — warum ein Sprung oder ein Filter neben eine Liste gehört, die die Suche auf der Seite nicht durchsuchen kann.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.1.1 Keyboard</a>
            — erst der fokussierbare Scroll-Container lässt Tastaturnutzer überhaupt scrollen.
          </li>
          <li>
            <code>&#64;openng/optimus-ui</code> 2.0.2 — <code>fesm2022/openng-optimus-ui-scroller.mjs</code>: jede Aussage
            zum Verhalten auf dieser Seite, mit Zeile zitiert.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Tokens</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura-Wert</th><th>Was er malt</th></tr>
            </thead>
            <tbody>
              <tr><td><code>virtualscroller.loader.mask.background</code></td><td><code>&#123;content.background&#125;</code></td><td>{{ m.tokMask }}</td></tr>
              <tr><td><code>virtualscroller.loader.mask.color</code></td><td><code>&#123;text.muted.color&#125;</code></td><td>{{ m.tokMaskColor }}</td></tr>
              <tr><td><code>virtualscroller.loader.icon.size</code></td><td><code>2rem</code></td><td>{{ m.tokIcon }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/virtualscroller/index.mjs</code>. Zeilen haben kein
          Token: Ihr Aussehen ist ganz dein Item-Template. Keines dieser Paare steht in
          <code>docs/generated/CONTRAST.MD</code>.
        </p>

        <h3>Fokus</h3>
        <p>{{ m.focus }}</p>
        <p class="src-note">
          <code>.p-virtualscroller</code> setzt <code>outline: 0 none</code> im CSS der Komponente
          (<code>openng-optimus-ui-scroller.mjs:15-22</code>). <code>src/styles.scss</code> führt
          <code>.p-virtualscroller:focus-visible</code> im einen Ring des Kits, nach innen versetzt (Offset <code>-2px</code>);
          die Demos auf dieser Seite fügen keine eigene Outline hinzu.
        </p>

        <h3>Schmaler Viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>setSize()</code> schreibt <code>scrollHeight</code> (oder die gemessene Höhe) als Inline-Höhe
          (<code>openng-optimus-ui-scroller.mjs:865-884</code>); eine Größenänderung des Fensters startet die
          Bereichsberechnung nur neu, wenn sich die Höhe ändert (<code>:1058-1076</code>). <code>.p-virtualscroller-content</code> ist
          <code>position: absolute; min-width: 100%</code> (<code>:24-30</code>). Keine Media Query im CSS der Komponente.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs, die das Verhalten bestimmen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Standard</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>items</code></td><td>—</td><td>{{ m.apiItems }}</td></tr>
              <tr><td><code>itemSize</code></td><td><code>0</code></td><td>{{ m.apiItemSize }}</td></tr>
              <tr><td><code>scrollHeight</code> / <code>scrollWidth</code></td><td>—</td><td>{{ m.apiScrollHeight }}</td></tr>
              <tr><td><code>orientation</code></td><td><code>'vertical'</code></td><td>{{ m.apiOrientation }}</td></tr>
              <tr><td><code>numToleratedItems</code></td><td>ein halber Viewport</td><td>{{ m.apiTolerated }}</td></tr>
              <tr><td><code>tabindex</code></td><td><code>0</code></td><td>{{ m.apiTabindex }}</td></tr>
              <tr><td><code>lazy</code>, <code>step</code>, <code>loading</code></td><td><code>false</code>, <code>0</code>, —</td><td>{{ m.apiLazy }}</td></tr>
              <tr><td><code>showLoader</code>, <code>delay</code></td><td><code>false</code>, <code>0</code></td><td>{{ m.apiLoader }}</td></tr>
              <tr><td><code>appendOnly</code></td><td><code>false</code></td><td>{{ m.apiAppendOnly }}</td></tr>
              <tr><td><code>disabled</code></td><td><code>false</code></td><td>{{ m.apiDisabled }}</td></tr>
              <tr><td><code>trackBy</code></td><td>Identität des Items</td><td>{{ m.apiTrackBy }}</td></tr>
              <tr><td>Outputs</td><td>—</td><td>{{ m.apiOutputs }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Setter und Standardwerte bei <code>openng-optimus-ui-scroller.mjs:148-446</code>; Outputs <code>:405-417</code>;
          die kompilierte Input-Liste bei <code>:1130</code>. <code>dt</code>, <code>unstyled</code>, <code>pt</code> und
          <code>ptOptions</code> sind von <code>BaseComponent</code> geerbt.
        </p>

        <h3>Was assistive Technologien bekommen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Bedarf</th><th>Ausgeliefert</th><th>Was du ergänzt</th></tr>
            </thead>
            <tbody>
              <tr><td>Ein Name und eine Rolle für die Scroll-Box</td><td>{{ m.atNameShip }}</td><td>{{ m.atNameAdd }}</td></tr>
              <tr><td>Listensemantik und -größe</td><td>{{ m.atListShip }}</td><td>{{ m.atListAdd }}</td></tr>
              <tr><td>Scrollen per Tastatur</td><td>{{ m.atKeysShip }}</td><td>{{ m.atKeysAdd }}</td></tr>
              <tr><td>Fokus auf einer Zeile</td><td>{{ m.atFocusShip }}</td><td>{{ m.atFocusAdd }}</td></tr>
              <tr><td>Suche auf der Seite, Lesen im Lesemodus</td><td>{{ m.atFindShip }}</td><td>{{ m.atFindAdd }}</td></tr>
              <tr><td>Ladezustand</td><td>{{ m.atLoadShip }}</td><td>{{ m.atLoadAdd }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Wurzel-Template <code>openng-optimus-ui-scroller.mjs:1184</code> (tabindex, class, Scroll-Listener, pBind —
          sonst nichts); der Loader ist ein SVG-Spinner ohne Text (<code>:1214</code>). Das Entfernen der Zeilen ist das
          <code>&#64;for</code> über <code>loadedItems</code> (<code>:1189</code>).
        </p>

        <h3>Rezept: Listensemantik über das Content-Template</h3>
        <pre class="code-block"><code>{{ listSnippet }}</code></pre>

        <h3>Rezept: zu einer Zeile springen</h3>
        <pre class="code-block"><code>{{ jumpSnippet }}</code></pre>
        <p class="src-note">
          <code>scrollToIndex(index, behavior = 'auto')</code> (<code>openng-optimus-ui-scroller.mjs:684</code>) reicht das
          Verhalten an <code>scrollTo</code> weiter. Ein explizites <code>'smooth'</code> überstimmt das Reduced-Motion-CSS
          des Kits, also frag <code>scrollBehavior()</code>.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkNeed }}</li>
          <li>{{ m.checkSize }}</li>
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkList }}</li>
          <li>{{ m.checkFind }}</li>
          <li>{{ m.checkFocus }}</li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit der letzten Fokus-Runde abgeglichen: Der Ring des Kits führt jetzt
            <code>.p-virtualscroller:focus-visible</code> (nach innen versetzt), die Outline des Containers zeichnest also nicht mehr du.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die eigene Outline des
            Containers ist weiterhin deine Sache und jetzt mit den Werten des Kit-Rings benannt (die Ring-Liste des Kits
            lässt den Container aus).
          </li>
          <li><strong>1.0</strong> — 23.09.2026 — Erste Version, gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ScrollerArticleDeComponent extends ScrollerArticleComponent {
  // --- demo content, in German --------------------------------------------
  override readonly rows: Row[] = Array.from({ length: 10000 }, (_, i) => ({ id: i, label: 'Zeile ' + (i + 1) }));
  override readonly terms: Row[] = Array.from({ length: 400 }, (_, i) => ({ id: i, label: 'Begriff ' + (i + 1) }));
  override readonly definition: string =
    'eine synthetische Glossar-Definition, lang genug, um in einer schmalen Spalte auf eine zweite oder dritte Zeile umzubrechen, so wie echte Definitionen es tun.';

  override readonly plainPt = { root: { 'aria-label': 'Zehntausend Zeilen (einfach)', role: 'region' } };
  override readonly listPt = { root: { 'aria-label': 'Zehntausend Zeilen (Liste)', role: 'region' } };
  override readonly termsPt = { root: { 'aria-label': 'Glossarbegriffe (virtuell)', role: 'region' } };

  /** The rulings and readings of the English article, in German. */
  override readonly m = {
    // usage
    whenScroller:
      'Der Render-Aufwand wächst mit dem DOM, und ein paar tausend Zeilen aus echten Komponenten bringen eine Seite zum Ruckeln. Wenn jede Zeile gleich hoch ist und niemand auf der Seite nach einer suchen muss, kauft der Ausschnitt Geschwindigkeit zu einem Accessibility-Preis, den du abbezahlen kannst.',
    whenBuiltIn:
      'Select, Listbox, MultiSelect, Tree und Table betten genau diesen Scroller hinter einem Flag ein und kümmern sich selbst um die Semantik der Optionen; ihre Guides behandeln das.',
    whenReading:
      'Die Suche auf der Seite sieht nur gerenderte Zeilen, und ein Screenreader im Lesemodus liest das DOM, das er bekommt. Leser durchsuchen Glossare mit Strg+F; gib ihnen den ganzen Text und grenz ihn stattdessen mit einem Filter oder mit Seiten ein.',
    whenVariable:
      'itemSize ist eine einzige Zahl für jede Zeile. Der Platzhalter und der Versatz des Inhalts werden daraus berechnet, und keine Zeile wird je gemessen, also landet eine Zeile anderer Höhe an der falschen Stelle, und der Scrollbereich passt nicht mehr zum Inhalt.',
    whenSmall:
      'Ein paar hundert Textzeilen sind für einen Browser billig. Der Ausschnitt würde Suche, Vorlesen und Fokus-Stabilität kosten, für eine Beschleunigung, die niemand bemerkt.',

    ddBadWhy:
      'Eine feste Zeilenhöhe zwingt jede Definition auf eine abgeschnittene Zeile, und nur das gute Dutzend Einträge rund um den Viewport existiert: Die Suche auf der Seite verfehlt den Rest, und der Text, wegen dem ein Leser gekommen ist, ist in den angezeigten Einträgen abgeschnitten.',
    ddGoodWhy:
      'Jeder Eintrag ist im DOM, also findet Strg+F „Begriff 37“, ein Screenreader liest am Stück durch, und jeder Absatz nimmt sich die Höhe, die er braucht. In Glossar-Größe kostet das nichts Messbares.',

    // design
    tokMask: 'Die Überlagerung hinter dem Lade-Spinner, nur mit showLoader und während des Ladens.',
    tokMaskColor: 'Die Farbe des Spinners auf dieser Überlagerung.',
    tokIcon: 'Größe des Spinners.',
    focus:
      'Der Scroll-Container ist standardmäßig ein Tab-Stopp, und sein Komponenten-CSS entfernt die Outline. Der eine Fokus-Ring des Kits führt .p-virtualscroller:focus-visible, also sieht ein Tastaturnutzer, der hineintabbt, 2px --primary-color-fg innerhalb des Containers — innerhalb, weil der Scroller in einem Select-Overlay oder einer Tabelle eine abschneidende Box von Rand zu Rand ausfüllt. Der Ring liegt auf den Zeilen, die er scrollt; die „focus ring“-Zeilen von docs/generated/CONTRAST.MD messen ihn mit 3,48:1 und mehr (SC 1.4.11 verlangt 3:1). Füg keine eigene Outline hinzu.',
    narrow:
      'Kein eigenes responsives Verhalten. Die Höhe ist in jedem Viewport das, was scrollHeight sagt, inline geschrieben; die Breite des Containers folgt dem Elternelement. Die Inhaltsbox darin ist absolut positioniert mit min-width: 100%, also bricht eine Zeile, die für eine schmale Spalte zu lang ist, nicht um: Sie verbreitert den Inhalt, und die Liste scrollt seitwärts. Gib der Inhaltsbox width: 100% (die Demos hier tun das) und halte jede Zeile mit einer Ellipse auf einer Zeile; eine umbrochene Zeile würde das feste itemSize ohnehin sprengen. Um itemSize für ein schmales Layout zu ändern, erzeug den Scroller neu — sein Resize-Listener startet die Bereichsberechnung nur neu, wenn sich die Höhe ändert.',

    // development — inputs
    apiItems: 'Das ganze Array. Gerendert wird immer nur ein Ausschnitt davon.',
    apiItemSize:
      'Pflicht: die feste Höhe (vertikal), Breite (horizontal) oder [Höhe, Breite] (beides) eines Items, in px. Wird nie gemessen; der Platzhalter ist items.length × itemSize.',
    apiScrollHeight: 'Die Größe des Viewports, inline geschrieben. „100%“ lässt den Host sein Elternelement füllen.',
    apiOrientation: "'vertical', 'horizontal' oder 'both' (ein 2-D-Raster aus Zeilen × Spalten).",
    apiTolerated: 'Zusätzliche Items, die rund um den Viewport gerendert werden, standardmäßig ceil(viewport / 2). Mehr heißt flüssigeres schnelles Scrollen, ein größeres DOM, ein größeres Fenster für die Suche auf der Seite.',
    apiTabindex: 'Am Scroll-Container. Behalte es: Ohne es kann ein Tastaturnutzer eine Liste ohne fokussierbare Zeilen nicht scrollen.',
    apiLazy: 'lazy gibt onLazyLoad(first, last) aus und lässt dich items füllen, während der Nutzer scrollt; step setzt die Seitengröße, loading zeigt den Loader.',
    apiLoader: 'Eine Lade-Überlagerung, während delay (ms) die Aktualisierung des Bereichs entprellt. Der Standard-Loader ist ein unbeschrifteter Spinner.',
    apiAppendOnly: 'Behält jede bisher gerenderte Zeile — das DOM wächst nur. Die Suche auf der Seite funktioniert dann hinter dem Nutzer, nie vor ihm.',
    apiDisabled: 'Schaltet die Virtualisierung ab: Projizierter Inhalt und das Content-Template rendern mit allen Items. Ein ehrlicher Weg für „alle anzeigen“ oder den Druck.',
    apiTrackBy: 'Die Identität der Zeilen für das @for. Gib eine an, wenn items neu gebaut werden, sonst erzeugt jedes Scrollen die Zeilen neu.',
    apiOutputs: 'onScroll (jedes Scroll-Event), onScrollIndexChange ({ first, last } bei einer Bereichsänderung), onLazyLoad.',

    // development — AT
    atNameShip: 'Ein div mit tabindex="0" und ohne Rolle oder Namen.',
    atNameAdd: "pt: { root: { 'aria-label': …, role: 'region' } } — der Name, den ein Nutzer beim Hineintabben hört.",
    atListShip: 'Einfache divs, keine Listenrolle und keine Größe: Ein Screenreader kann nur das gute Dutzend gerenderter Zeilen zählen.',
    atListAdd: 'Ein #content-Template mit ul/li, aria-setsize = items.length und aria-posinset = getItemOptions(i).index + 1. Die Unterstützung dafür an Listeneinträgen unterscheidet sich je Screenreader; teste deinen.',
    atKeysShip: 'Browser-nativ: Pfeiltasten, Bild auf/ab und Pos1/Ende scrollen den fokussierten Container.',
    atKeysAdd: 'Nichts, solange der Container sein tabindex behält (der Ring des Kits zeigt seinen Fokus).',
    atFocusShip: 'Eine fokussierte Zeile, die aus dem Ausschnitt scrollt, wird zerstört, und der Fokus fällt auf den body des Dokuments zurück.',
    atFocusAdd: 'Vermeide fokussierbare Zeilen. Wenn Zeilen etwas auslösen müssen, halte den Fokus auf dem Container und bewege eine Hervorhebung (aria-activedescendant), wie es die Listbox tut.',
    atFindShip: 'Für Strg+F existieren nur gerenderte Zeilen. Ein Screenreader im Lesemodus liest die gerenderten Zeilen; ob das Weitergehen über die letzte hinaus den Container scrollt und mehr rendert, hängt von Screenreader und Browser ab.',
    atFindAdd: 'Ein Filter oder ein Sprung-Control neben der Liste (SC 2.4.5), oder keine Virtualisierung.',
    atLoadShip: 'Ein Spinner-SVG ohne Text und ohne Live-Region.',
    atLoadAdd: 'Eine höfliche (polite) Live-Region, die sagt, was gerade lädt, gespeist aus deinem Lazy-Load-Handler.',

    checkNeed: 'Stell sicher, dass die Liste lang und gleichförmig genug ist, um einen Ausschnitt zu brauchen; für Inhalte zum Lesen und Durchsuchen ist sie es nicht.',
    checkSize: 'Gib jeder Zeile genau itemSize an Höhe, box-sizing eingeschlossen, und halte den Text auf einer Zeile.',
    checkName: 'Benenne den Scroll-Container über pt.root; überlass seinen Fokus-Ring dem Kit.',
    checkList: 'Rendere Listensemantik mit aria-setsize und aria-posinset aus getItemOptions().',
    checkFind: 'Biete einen Filter oder ein Sprung-Control an, weil die Suche auf der Seite nur den Ausschnitt sieht.',
    checkFocus: 'Halte interaktive Controls aus den Zeilen heraus, oder verwalte den Fokus am Container.',
  };
}
