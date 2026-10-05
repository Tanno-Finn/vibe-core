import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { MenuItem } from '@openng/optimus-ui/api';
import { MenuArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './menu-article.component';

/**
 * German twin of the Menu, TieredMenu, and ContextMenu guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers and code snippets are
 * shared; the template, the demo labels and menu models, and the visible strings in
 * `m` are German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs menu`).
 */
@Component({
  selector: 'app-menu-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'menu'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Drei Komponenten, ein <code>MenuItem[]</code> und drei verschiedene Antworten auf dieselben drei Fragen: Wohin
          geht der Fokus, was erreicht eine Tastatur, und wer entscheidet, wo das Panel landet. Alles unten ist live —
          öffne jedes Menü und geh es mit der Tastatur statt mit der Maus durch.
        </p>

        <h3>Die drei Menüs, gerendert</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="lbl">p-menu, inline</span>
            <p-menu [model]="flat" [ariaLabel]="labels.inlineMenu" />
          </div>
          <div class="col">
            <span class="lbl">p-menu, Popup</span>
            <p-button label="Aktionen" size="small" severity="secondary" (onClick)="popupMenu.toggle($event)" />
            <p-menu #popupMenu [model]="flat" [popup]="true" [ariaLabel]="labels.popupMenu" />
          </div>
          <div class="col">
            <span class="lbl">p-tieredMenu, inline</span>
            <p-tieredMenu [model]="tiered" [ariaLabel]="labels.tieredMenu" />
          </div>
          <div class="col">
            <span class="lbl">p-contextMenu, an einem Ziel</span>
            <div #ctxTarget class="target" tabindex="0" role="group" [attr.aria-label]="labels.ctxTarget">
              {{ labels.ctxHint }}
            </div>
            <p-button label="Menü öffnen" size="small" severity="secondary" (onClick)="ctxMenu.show($event)" />
            <p-contextMenu #ctxMenu [target]="ctxTarget" [model]="tiered" [ariaLabel]="labels.ctxMenu" />
          </div>
        </div>
        <p class="src-note">
          Das Popup öffnet das eigene <code>toggle()</code> der Komponente
          (<code>openng-optimus-ui-menu.mjs:476-482</code>); das Kontextmenü lauscht auf ein
          <code>contextmenu</code>-Event an dem Element, das an <code>target</code> gebunden ist
          (<code>openng-optimus-ui-contextmenu.mjs:864-891</code>), und wird hier zusätzlich von einem Button geöffnet, weil
          ein Rechtsklick keine Tastaturgeste ist.
        </p>

        <h3>Was jede Wurzel ausgibt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Komponente</th><th>Listenelement</th><th>Eintragselement</th><th>Beziehungsattribute am Eintrag</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-menu</code></td>
                <td>{{ m.menuList }}</td>
                <td>{{ m.menuItem }}</td>
                <td>{{ m.menuRel }}</td>
              </tr>
              <tr>
                <td><code>p-tieredMenu</code></td>
                <td>{{ m.tieredList }}</td>
                <td>{{ m.tieredItem }}</td>
                <td>{{ m.tieredRel }}</td>
              </tr>
              <tr>
                <td><code>p-contextMenu</code></td>
                <td>{{ m.ctxList }}</td>
                <td>{{ m.ctxItem }}</td>
                <td>{{ m.ctxRel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an den Templates: <code>openng-optimus-ui-menu.mjs:897</code> und <code>:953</code>/<code>:983</code>,
          <code>openng-optimus-ui-tieredmenu.mjs:270-277</code> und <code>:303-313</code>,
          <code>openng-optimus-ui-contextmenu.mjs:250-258</code> und <code>:281-292</code>. Prüf im Accessibility Tree des
          Browsers, dass die Liste, die du fokussierst, diejenige ist, die den von dir gesetzten Namen trägt.
        </p>

        <h3>Das Markup, das ein einzelner Eintrag erzeugt</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Der Anker ist da, ob der Eintrag ein Ziel hat oder nicht. Es gibt zwei Anker-Zweige: Einer nimmt ein
          <code>href</code> aus <code>url</code> (<code>openng-optimus-ui-menu.mjs:177</code>), der andere ist ein
          <code>routerLink</code>-Anker, dessen <code>href</code> Angulars eigene Direktive schreibt
          (<code>:191</code>). Beide setzen fest <code>tabindex="-1"</code> (<code>:179</code>, <code>:193</code>), ebenso die
          Anker-Zweige der anderen beiden (<code>openng-optimus-ui-tieredmenu.mjs:331</code>,
          <code>openng-optimus-ui-contextmenu.mjs:310</code>), und genau das hält den Eintrag aus der Tab-Reihenfolge heraus — <code>routerLink</code> wird also gelesen, aber ein Menüeintrag
          ist trotzdem kein erreichbares Ziel.
        </p>

        <h3>Ein Gruppen-Header in <code>p-menu</code></h3>
        <div class="stage">
          <p-menu [model]="grouped" [ariaLabel]="labels.groupedMenu" />
        </div>
        <p class="src-note">
          Die Entscheidung fällt einmal für das ganze Model, nicht pro Eintrag: <code>hasSubMenu()</code> ist
          <code>model.some(i =&gt; i.items)</code> (<code>openng-optimus-ui-menu.mjs:854</code>), und das Template
          verzweigt darauf bei <code>:908</code> und <code>:964</code>. Im gruppierten Zweig wird jeder Eintrag der obersten
          Ebene, der kein Trenner ist, als <code>&lt;li role="none"&gt;</code> gerendert (<code>:921</code>), und nur
          <code>submenu.items</code> werden zu Zeilen mit <code>role="menuitem"</code> (<code>:953</code>) — ein Eintrag der
          obersten Ebene ohne <code>items</code> endet in einem Model, in dem irgendein anderer Eintrag welche hat, also als
          Beschriftung ohne Rolle, ohne Namen und ohne Klick-Handler. Der Header trägt weder <code>role="group"</code> noch ein eigenes <code>aria-labelledby</code>
          — das eine <code>aria-labelledby</code> im Bundle sitzt auf dem Listenelement
          (<code>:903</code>) und benennt das ganze Menü —, die visuelle Gruppierung hat also kein Gegenstück im
          Accessibility Tree.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Wähle nach der Form des Models und nach der Geste, die es öffnet. Eine flache Liste von Befehlen ist
          <code>p-menu</code>; verschachtelte Befehle sind <code>p-tieredMenu</code>; Befehle, die zu einem Ding gehören,
          das man rechtsklickt, sind <code>p-contextMenu</code>. Eine horizontale Leiste aus Menüs ist <code>p-menubar</code>,
          das seinen eigenen Guide hat.
        </p>

        <h3>Welche der vier, und was sie kostet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Komponente</th><th>nimm sie, wenn</th><th>geöffnet durch</th><th>der Preis</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-menu</code></td>
                <td>{{ m.pickMenu }}</td>
                <td>{{ m.openMenu }}</td>
                <td>{{ m.costMenu }}</td>
              </tr>
              <tr>
                <td><code>p-tieredMenu</code></td>
                <td>{{ m.pickTiered }}</td>
                <td>{{ m.openTiered }}</td>
                <td>{{ m.costTiered }}</td>
              </tr>
              <tr>
                <td><code>p-contextMenu</code></td>
                <td>{{ m.pickCtx }}</td>
                <td>{{ m.openCtx }}</td>
                <td>{{ m.costCtx }}</td>
              </tr>
              <tr>
                <td><code>p-menubar</code></td>
                <td>{{ m.pickBar }}</td>
                <td>{{ m.openBar }}</td>
                <td>{{ m.costBar }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Zeile zu <code>p-menubar</code> ist ein Verweis, keine Zusammenfassung: Diese Komponente hat ihren eigenen
          Guide mit eigenen Messungen, und nichts davon wird hier wiederholt.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Befehle, die nur ein Rechtsklick erreicht</span>
            <div class="dd__stage">
              <div #ddTargetBad class="target" tabindex="0" role="group" [attr.aria-label]="labels.ddBadTarget">
                {{ labels.ddBadHint }}
              </div>
              <p-contextMenu #ddBadMenu [target]="ddTargetBad" [model]="flat" [ariaLabel]="labels.ddBadMenu" />
            </div>
            <p class="dd__why">{{ m.ddCtxBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — dieselben Befehle zusätzlich hinter einem echten Control</span>
            <div class="dd__stage">
              <div #ddTargetGood class="target" tabindex="0" role="group" [attr.aria-label]="labels.ddGoodTarget">
                {{ labels.ddGoodHint }}
              </div>
              <p-button label="Zeilenaktionen" size="small" severity="secondary" (onClick)="ddGoodMenu.show($event)" />
              <p-contextMenu #ddGoodMenu [target]="ddTargetGood" [model]="flat" [ariaLabel]="labels.ddGoodMenu" />
            </div>
            <p class="dd__why">{{ m.ddCtxGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Der einzige Listener, den die Komponente bindet, ist der für <code>triggerEvent</code>, Standard
          <code>contextmenu</code> (<code>openng-optimus-ui-contextmenu.mjs:708</code>,
          <code>:864-891</code>), und er wird einmal bei der Initialisierung gebunden, an dasjenige von
          <code>global</code> und <code>target</code>, das in diesem Moment gesetzt ist. Welcher der beiden Wege genommen
          wird, entscheidet sich ebenfalls dort, anhand von <code>isIOS() || isAndroid()</code> (<code>:861-863</code>) statt
          anhand einer Touch-Fähigkeit — und in diesem Zweig ist es nicht ein Listener, sondern zwei, <code>touchstart</code>
          und <code>touchend</code> (<code>:880-886</code>), die einen langen Druck mit <code>pressDelay</code> 500 ms
          steuern (<code>:763</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Markup in einem Label per <code>escape: false</code></span>
            <div class="dd__stage">
              <p-menu [model]="escapedOff" [ariaLabel]="labels.ddEscapeBad" />
            </div>
            <p class="dd__why">{{ m.ddEscapeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein schlichtes Label, Dekoration über <code>icon</code></span>
            <div class="dd__stage">
              <p-menu [model]="escapedOn" [ariaLabel]="labels.ddEscapeGood" />
            </div>
            <p class="dd__why">{{ m.ddEscapeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen binden zwei Einträge an dieselbe Komponente; links ist <code>escape</code> abgeschaltet und die
          Labels tragen Markup, rechts trifft beides nicht zu. Der Standardzweig interpoliert das Label als Text
          (<code>openng-optimus-ui-menu.mjs:223</code>); <code>escape: false</code> nimmt den anderen Zweig
          (<code>:225</code>), der das Label durch <code>SafeHtmlPipe</code> schickt — und diese Pipe ruft
          <code>bypassSecurityTrustHtml</code> auf (<code>:135</code>), sodass Angulars Sanitizer für diesen String
          abgeschaltet ist. Dieselbe Pipe gibt den Wert außerhalb des Browsers unverändert zurück (<code>:132-134</code>). Diese Polarität hat
          nur <code>p-menu</code>: <code>p-tieredMenu</code> und <code>p-contextMenu</code> prüfen den rohen
          Wert über <code>getItemProp</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:344</code>, <code>openng-optimus-ui-contextmenu.mjs:324</code>),
          ein nicht gesetztes <code>escape</code> ist dort also falsy, und das Label geht in den
          Zweig <code>#htmlLabel</code> mit <code>[innerHTML]</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:355</code>, <code>openng-optimus-ui-contextmenu.mjs:335</code>).
          Keines dieser beiden Bundles enthält <code>bypassSecurityTrustHtml</code> oder
          <code>safeHtml</code>, Angular bereinigt also weiterhin, was es rendert — aber der Standard ist dort
          Markup, nicht Text, und nur <code>escape: true</code> führt in den Text-Zweig.
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          <code>model</code> ist nicht in allen drei dasselbe Konstrukt. Bei <code>p-tieredMenu</code> und
          <code>p-contextMenu</code> ist es ein Setter, der den verarbeiteten Eintragsbaum einmal pro Zuweisung neu aufbaut
          (<code>openng-optimus-ui-tieredmenu.mjs:734</code>,
          <code>openng-optimus-ui-contextmenu.mjs:697-699</code>), eine Mutation des Arrays erreicht die View also
          überhaupt nie. Bei <code>p-menu</code> ist es ein einfaches Feld (<code>openng-optimus-ui-menu.mjs:327</code>),
          über das das Template direkt iteriert (<code>:965</code>), unter <code>OnPush</code> (<code>:1001</code>), eine
          Mutation zeigt sich also, wann immer die Komponente das nächste Mal geprüft wird, statt dann, wenn du sie gemacht
          hast. So oder so ist die Konvention des Kits ein <code>computed()</code>, das ein frisches Array zurückgibt, und
          genau das lässt auch einen Sprachwechsel durchschlagen.
        </p>

        <h3>Quellen</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" target="_blank" rel="noopener noreferrer"
              >W3C APG — Menu and Menubar</a
            >
            — das Menü-Muster, auf das sich alle drei berufen: Rollen, der Tastaturvertrag und wohin der Fokus beim
            Schließen zurückkehrt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — die 3:1, die ein Fokusindikator schuldet, der nur aus einem Hintergrund besteht.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — was ein Menü schuldet, das sich schließt, ohne seinen Trigger wiederherzustellen, oder ein offenes Untermenü
            in der Tab-Reihenfolge lässt.
          </li>
          <li>
            <code>openng-optimus-ui-menu.mjs</code>, <code>openng-optimus-ui-tieredmenu.mjs</code> und
            <code>openng-optimus-ui-contextmenu.mjs</code> in <code>&#64;openng/optimus-ui/fesm2022</code> (2.0.2) — der ausgelieferte Quelltext, in den jeder Zeilenverweis dieses Guides zeigt.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Alle drei sind dieselbe Box: eine umrandete Fläche mit einer gepolsterten Liste aus gepolsterten Zeilen, gespeist
          aus der gemeinsamen Gruppe <code>navigation</code> des Aura-Presets. Visuell unterscheiden sie sich nur im
          Schatten, im Untermenü und darin, ob das Panel von einem Trigger oder von einem Zeiger platziert wird.
        </p>

        <h3>Die gemeinsame Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Teil</th><th>Preset-Key</th><th>aufgelöster Wert</th></tr>
            </thead>
            <tbody>
              <tr><td>Listen-Padding / Abstand</td><td><code>navigation.list</code></td><td>{{ m.tokList }}</td></tr>
              <tr><td>Eintrags-Padding / Abstand</td><td><code>navigation.item</code></td><td>{{ m.tokItem }}</td></tr>
              <tr><td>Eintragsecke</td><td><code>navigation.item.borderRadius</code></td><td>{{ m.tokItemRadius }}</td></tr>
              <tr><td>Gruppen-Header</td><td><code>navigation.submenuLabel</code></td><td>{{ m.tokSubmenuLabel }}</td></tr>
              <tr><td>Untermenü-Chevron</td><td><code>navigation.submenuIcon.size</code></td><td>{{ m.tokSubmenuIcon }}</td></tr>
              <tr><td>Panel-Schatten</td><td><code>overlay.navigation.shadow</code></td><td>{{ m.tokShadow }}</td></tr>
              <tr><td>fokussierte Zeile</td><td><code>navigation.item.focusBackground</code></td><td>{{ m.tokFocusBg }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Keys und Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> und den drei
          Komponenten-Presets <code>&#64;openng/optimus-ui-themes/dist/aura/menu/index.mjs</code>,
          <code>.../aura/tieredmenu/index.mjs</code> und <code>.../aura/contextmenu/index.mjs</code> — minifizierte
          einzeilige Bundles, deshalb zitiert nach Pfad und Export (<code>root</code>, <code>list</code>,
          <code>item</code>, <code>separator</code>, dazu <code>submenuLabel</code> beim Menu und
          <code>submenu</code>/<code>submenuIcon</code> bei den anderen beiden). Alle drei Presets lösen
          <code>root.shadow</code> zum selben <code>overlay.navigation.shadow</code> auf; der Unterschied liegt darin, wo das
          Stylesheet ihn malt. <code>p-contextMenu</code> malt ihn bedingungslos auf seine Wurzel
          (<code>&#64;openng/optimus-ui-styles/dist/contextmenu/index.mjs:7</code>), die anderen beiden nur auf ihre
          Popup-Wurzelklasse (<code>.../menu/index.mjs:69-70</code> mit
          <code>openng-optimus-ui-menu.mjs:34</code>, <code>.../tieredmenu/index.mjs:123-125</code> mit
          <code>openng-optimus-ui-tieredmenu.mjs:32</code>) — ein inline eingesetztes <code>p-menu</code> oder
          <code>p-tieredMenu</code> ist also flach, ein Popup von beiden nicht.
        </p>
        <p>
          <strong>Über die visuellen Stile hinweg.</strong> Nur die Ecken bewegen sich: Das
          <code>&#123;content.border.radius&#125;</code> des Panels und das <code>&#123;border.radius.sm&#125;</code> der Zeile lösen
          sich über die <code>presetOverrides</code> des aktiven Stils auf (<code>src/app/services/ui-styles.ts</code>) — eckig in
          werkbund, runder in lernwerkstatt (dem Standard) und skizzenbuch, fast eckig in blaupause. Kein Stil überschreibt die
          Farb-Token von <code>navigation</code>, die Farben von Panel und Label sind also in jedem Stil Auras Standardpalette.
          <code>src/styles.scss</code> ergänzt den einen Fokus-Ring des Kits auf dem fokussierten Eintrag aller drei und setzt
          das Eintrags-Icon aller drei sowie den Untermenü-Chevron von Tiered und Context Menu auf
          <code>--text-color-secondary</code>.
        </p>

        <h3>Der Fokusindikator: der Ring des Kits</h3>
        <p>
          Aura zeichnet keinen Fokus-Ring. In allen drei Stylesheets setzt die Liste <code>outline: 0 none</code>, und die
          fokussierte Zeile — markiert mit der Klasse <code>.p-focus</code>, weil der DOM-Fokus auf der Liste bleibt — wird
          durch einen Tausch von Hintergrund- und Textfarbe gezeichnet; in keinem davon gibt es eine Regel
          <code>:focus-visible</code>. Das Kit ergänzt den Ring, den jeder fokussierbare Optimus-Teil trägt: 2px
          <code>--primary-color-fg</code> auf der Content-Box des fokussierten Eintrags, nach innen gezeichnet (Offset -2px),
          weil die Zeilen 2px auseinander in einem Panel sitzen, das abschneidet. Er muss sich sowohl vom Fokus-Farbton
          innen als auch vom Panel außen abheben, und das tut er, in jedem Stil, Modus und Akzent.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Fläche</th><th>Kriterium</th><th>Schwelle</th><th>was sie erfüllt (CONTRAST.MD „menu focus“)</th></tr>
            </thead>
            <tbody>
              <tr><td>Eintrags-Label</td><td>SC 1.4.3</td><td>4,5:1</td><td>{{ m.crLabel }}</td></tr>
              <tr><td>fokussierte Zeile</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crFocus }}</td></tr>
              <tr><td>Untermenü-Chevron</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crChevron }}</td></tr>
              <tr><td>Eintrags-Icon</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crIcon }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Regeln: <code>&#64;openng/optimus-ui-styles/dist/menu/index.mjs:13</code> und <code>:51-53</code>,
          <code>.../tieredmenu/index.mjs:16</code> und <code>:80-82</code>,
          <code>.../contextmenu/index.mjs:16</code> und <code>:81-83</code>. Die Verhältnisse sind die Zeilen „menu focus“ in
          <code>docs/generated/CONTRAST.MD</code>: gemessen an den Token der Menubar, und das Gate stellt sicher, dass Menu,
          Tiered Menu und Context Menu zu demselben Panel, Farbton, Chevron und Icon auflösen — die Zeilen gelten also für
          alle drei.
          Auras Farbton allein steht dort als informativ (1,10:1 hell, 1,19:1 dunkel), der Grund, warum das Kit den
          Ring ergänzt.
        </p>

        <h3>Wo jedes Panel platziert wird</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Panel</th><th>verankert an</th><th>Kollisionsbehandlung</th><th>Schreibrichtung</th></tr>
            </thead>
            <tbody>
              <tr><td>{{ m.posMenuWhat }}</td><td>{{ m.posMenuAnchor }}</td><td>{{ m.posMenuFlip }}</td><td>{{ m.posMenuDir }}</td></tr>
              <tr><td>{{ m.posTieredWhat }}</td><td>{{ m.posTieredAnchor }}</td><td>{{ m.posTieredFlip }}</td><td>{{ m.posTieredDir }}</td></tr>
              <tr><td>{{ m.posCtxWhat }}</td><td>{{ m.posCtxAnchor }}</td><td>{{ m.posCtxFlip }}</td><td>{{ m.posCtxDir }}</td></tr>
              <tr><td>{{ m.posCtxSubWhat }}</td><td>{{ m.posCtxSubAnchor }}</td><td>{{ m.posCtxSubFlip }}</td><td>{{ m.posCtxSubDir }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-tieredmenu.mjs:182-188</code> delegiert an <code>nestedPosition</code>, einen Export von
          <code>&#64;openng/optimus-ui-utils/dist/dom/index.mjs</code> (minifiziert, nach Export zitiert), der sowohl einen
          horizontalen als auch einen vertikalen Versatz berechnet und <code>inset-inline-start</code> schreibt;
          <code>openng-optimus-ui-contextmenu.mjs:231-244</code> schreibt bedingungslos <code>top: 0px</code> und das
          physische <code>left</code>. Die eigene Wurzel des Kontextmenüs wird nach den Seitenkoordinaten des Events platziert
          und klappt auf beiden Achsen um (<code>:1275-1301</code>).
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          <code>p-menu</code> und <code>p-contextMenu</code> haben kein responsives Verhalten;
          <code>p-tieredMenu</code> hat genau eines. Jede Wurzel trägt <code>min-width: 12.5rem</code> (200px), und keines
          der drei Stylesheets enthält eine Media Query, ein <code>max-height</code> oder ein
          <code>overflow-y</code> — kein Panel wird also je schmaler als 200px, und keines scrollt in sich, wie lang das
          Model auch wird. Was <code>p-tieredMenu</code> ergänzt, ist ein Breakpoint in JavaScript statt in CSS: Unterhalb
          von <code>breakpoint</code> (Standard <code>960px</code>) setzt es <code>p-tieredmenu-mobile</code> auf seine
          Wurzel, und seine Untermenüs klappen nicht mehr seitlich aus — sie stapeln sich im Fluss, ohne Schatten, um 1rem
          eingerückt. Das Kontextmenü liefert dieselben Stylesheet-Regeln mit, bekommt die Klasse aber nie, also stapelt es
          nie. Layout-Hinweise: Halte das Model kurz genug, dass es in die Viewport-Höhe passt, gib einem Inline-Menü ein
          Elternelement, das scrollen darf, platziere einen Popup-Trigger dort, wo daneben noch 200px Platz haben — und verlass
          dich außerhalb von
          <code>p-tieredMenu</code> nicht auf die gestapelte Form.
        </p>
        <p class="src-note">
          <code>min-width</code> bei <code>&#64;openng/optimus-ui-styles/dist/menu/index.mjs:7</code>,
          <code>.../tieredmenu/index.mjs:7</code>, <code>.../contextmenu/index.mjs:8</code>; keines der drei enthält eine
          <code>&#64;media</code>-Regel, ein <code>max-height</code> oder ein <code>overflow-y</code>. Der Schalter des
          Tiered Menu ist keine CSS-Media-Query, sondern ein <code>matchMedia</code>-Listener im Bundle:
          <code>breakpoint</code>, Standard <code>960px</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:760</code>), wird während
          <code>onInit</code> (<code>:941-951</code>) zu einer Query, deren Ergebnis <code>p-tieredmenu-mobile</code> in der
          Klassen-Map der Wurzel steuert (<code>:33</code>), und <code>.../tieredmenu/index.mjs:128-134</code> macht jedes
          Untermenü unter dieser Klasse zu <code>position: static</code> mit dem Einrückungs-Token
          <code>submenu.mobileIndent</code> (1rem). Dieselben Regeln gibt es bei
          <code>.../contextmenu/index.mjs:124-135</code>, wo die Klasse nie gesetzt wird.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Drei Input-Oberflächen, die gleich aussehen und es nicht sind. Jede deklariert Inputs, die sie nie liest, und
          jede nimmt vier an, die sie nicht deklariert. Die Tabellen unten markieren für jeden Input, ob der Wert etwas
          erreicht, das ihn liest.
        </p>

        <h3><code>p-menu</code> — eigene Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Standard</th><th>erreicht</th></tr>
            </thead>
            <tbody>
              <tr><td><code>model</code></td><td>—</td><td>{{ m.inMenuModel }}</td></tr>
              <tr><td><code>popup</code></td><td><code>false</code></td><td>{{ m.inMenuPopup }}</td></tr>
              <tr><td><code>tabindex</code></td><td><code>0</code></td><td>{{ m.inMenuTabindex }}</td></tr>
              <tr><td><code>ariaLabel</code>, <code>ariaLabelledBy</code></td><td>—</td><td>{{ m.inMenuAria }}</td></tr>
              <tr><td><code>appendTo</code></td><td>Config-Standard</td><td>{{ m.inMenuAppendTo }}</td></tr>
              <tr><td><code>autoZIndex</code>, <code>baseZIndex</code></td><td><code>true</code>, <code>0</code></td><td>{{ m.inMenuZ }}</td></tr>
              <tr><td><code>id</code>, <code>style</code>, <code>styleClass</code></td><td>generierte id</td><td>{{ m.inMenuChrome }}</td></tr>
              <tr><td><code>motionOptions</code></td><td>—</td><td>{{ m.inMenuMotion }}</td></tr>
              <tr><td><code>showTransitionOptions</code>, <code>hideTransitionOptions</code></td><td>gesetzt</td><td>{{ m.inMenuDeadTransition }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarationen bei <code>openng-optimus-ui-menu.mjs:327-397</code>, kompilierte Input-Liste bei <code>:869</code>.
          Die beiden Transition-Inputs halten Standardwerte und tauchen sonst nirgends in der Datei auf. Das
          <code>#header</code>-Template wird abgefragt (<code>:869</code>, Feld bei <code>:520-521</code>), und die
          Content-Query weist es auch zu, aber es kommt in keinem Zweig des Templates vor — <code>#start</code>,
          <code>#end</code>, <code>#item</code> und <code>#submenuheader</code> sind die vier, die rendern. Ein
          <code>pTemplate="header"</code> ist schlimmer als ignoriert: <code>onAfterContentInit</code> hat keinen
          <code>header</code>-Fall, also fällt es in den <code>default</code>-Zweig (<code>:554-556</code>) und
          wird stillschweigend zum Eintrags-Template.
        </p>

        <h3><code>p-tieredMenu</code> und <code>p-contextMenu</code> — was sich unterscheidet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th><code>p-tieredMenu</code></th><th><code>p-contextMenu</code></th></tr>
            </thead>
            <tbody>
              <tr><td><code>popup</code></td><td>{{ m.cmpPopupT }}</td><td>{{ m.cmpPopupC }}</td></tr>
              <tr><td><code>target</code>, <code>global</code></td><td>{{ m.cmpTargetT }}</td><td>{{ m.cmpTargetC }}</td></tr>
              <tr><td><code>triggerEvent</code></td><td>{{ m.cmpTriggerT }}</td><td>{{ m.cmpTriggerC }}</td></tr>
              <tr><td><code>breakpoint</code></td><td>{{ m.cmpBreakT }}</td><td>{{ m.cmpBreakC }}</td></tr>
              <tr><td><code>autoDisplay</code></td><td>{{ m.cmpAutoT }}</td><td>{{ m.cmpAutoC }}</td></tr>
              <tr><td><code>disabled</code></td><td>{{ m.cmpDisabledT }}</td><td>{{ m.cmpDisabledC }}</td></tr>
              <tr><td><code>tabindex</code></td><td>{{ m.cmpTabT }}</td><td>{{ m.cmpTabC }}</td></tr>
              <tr><td><code>pressDelay</code></td><td>{{ m.cmpPressT }}</td><td>{{ m.cmpPressC }}</td></tr>
              <tr><td><code>showTransitionOptions</code>, <code>hideTransitionOptions</code></td><td>{{ m.cmpTransT }}</td><td>{{ m.cmpTransC }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kompilierte Input-Listen bei <code>openng-optimus-ui-tieredmenu.mjs:1459</code> und
          <code>openng-optimus-ui-contextmenu.mjs:1424</code>. Der halb tote
          <code>breakpoint</code> des Kontextmenüs ist die Klassen-Map bei
          <code>openng-optimus-ui-contextmenu.mjs:38</code>: Sie liest <code>instance.queryMatches</code>, ohne das Signal
          aufzurufen, und die dort übergebene Instanz ist das <code>ContextMenuSub</code>, dessen Felder
          (<code>:129-142</code>) kein solches Member enthalten — während das Gegenstück des Tiered Menu bei
          <code>openng-optimus-ui-tieredmenu.mjs:33</code> das Signal auf einer Komponente aufruft, die es hat.
        </p>

        <h3>Tasten, gemessen an den drei Key-Handlern</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Taste</th><th><code>p-menu</code></th><th><code>p-tieredMenu</code></th><th><code>p-contextMenu</code></th></tr>
            </thead>
            <tbody>
              <tr><td>Pfeil nach unten / oben</td><td>{{ m.kbArrowM }}</td><td>{{ m.kbArrowT }}</td><td>{{ m.kbArrowC }}</td></tr>
              <tr><td>Pfeil nach rechts / links</td><td>{{ m.kbLatM }}</td><td>{{ m.kbLatT }}</td><td>{{ m.kbLatC }}</td></tr>
              <tr><td>Pos1 / Ende</td><td>{{ m.kbHomeM }}</td><td>{{ m.kbHomeT }}</td><td>{{ m.kbHomeC }}</td></tr>
              <tr><td>Enter / Leertaste</td><td>{{ m.kbEnterM }}</td><td>{{ m.kbEnterT }}</td><td>{{ m.kbEnterC }}</td></tr>
              <tr><td>Escape</td><td>{{ m.kbEscM }}</td><td>{{ m.kbEscT }}</td><td>{{ m.kbEscC }}</td></tr>
              <tr><td>Tab</td><td>{{ m.kbTabM }}</td><td>{{ m.kbTabT }}</td><td>{{ m.kbTabC }}</td></tr>
              <tr><td>druckbares Zeichen</td><td>{{ m.kbTypeM }}</td><td>{{ m.kbTypeT }}</td><td>{{ m.kbTypeC }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Handler: <code>openng-optimus-ui-menu.mjs:648-733</code>,
          <code>openng-optimus-ui-tieredmenu.mjs:1056-1102</code>,
          <code>openng-optimus-ui-contextmenu.mjs:1038-1084</code>. Beim Öffnen eines Menüs wird nichts hervorgehoben: Ein
          <code>p-menu</code>-Popup fokussiert die Liste, ohne einen Eintrag auszuwählen
          (<code>openng-optimus-ui-menu.mjs:574</code>, <code>:632</code>), und der entsprechende Aufruf für ein inline eingesetztes
          <code>p-tieredMenu</code> ist auskommentiert (<code>openng-optimus-ui-tieredmenu.mjs:1209</code>) — die erste
          Pfeiltaste behebt das. Ein <code>p-tieredMenu</code>-Popup und ein <code>p-contextMenu</code> fokussieren jeweils
          ihre Wurzelliste, sobald das Overlay eingeblendet ist (<code>openng-optimus-ui-tieredmenu.mjs:1229-1237</code>,
          <code>openng-optimus-ui-contextmenu.mjs:1205-1208</code>). Die Zeilen Escape und Tab für <code>p-menu</code>
          stammen aus einem gemeinsamen Fall (<code>openng-optimus-ui-menu.mjs:671-678</code>), der für beide Tasten
          <code>focus(this.target)</code> und dann <code>hide()</code> aufruft und kein
          <code>preventDefault()</code> aufruft, sodass die eigene sequenzielle Navigation von Tab beim Trigger weitermacht.
        </p>

        <h3>Die zusätzlichen Tab-Stopps in einem verschachtelten Menü</h3>
        <pre class="code-block"><code>{{ tabStopSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-tieredmenu.mjs:437-453</code> und
          <code>openng-optimus-ui-contextmenu.mjs:414-428</code> instanziieren die verschachtelte Liste, ohne
          <code>tabindex</code> zu binden und ohne <code>menuKeydown</code>, <code>menuFocus</code> oder
          <code>menuBlur</code> anzuschließen; der eigene Standard der Sub-Komponente ist <code>0</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:158</code>,
          <code>openng-optimus-ui-contextmenu.mjs:142</code>), und das Listenelement bindet ihn direkt
          (<code>:273</code> und <code>:254</code>). Das macht eine offene Untermenü-Liste fokussierbar, aber sie ist nur
          <code>display: flex</code>, solange ihr Eintrag aktiv ist
          (<code>openng-optimus-ui-tieredmenu.mjs:26</code>), und Tab auf der Wurzelliste führt zuerst <code>hide()</code> aus
          (<code>:1169-1176</code>; das Kontextmenü hat ein eigenes bei
          <code>openng-optimus-ui-contextmenu.mjs:1148-1155</code>), was jede Ebene leert. Was den Fall am Leben hält:
          Ein inline eingesetztes <code>p-tieredMenu</code> bindet keinen Listener für Klicks außerhalb — die Bindung steht
          hinter <code>if (this.popup)</code> in <code>onOverlayAfterEnter</code>
          (<code>openng-optimus-ui-tieredmenu.mjs:1229-1231</code>) —, und <code>onMenuBlur</code>
          (<code>:1212-1217</code>) leert nur <code>dirty</code> und die Info zum fokussierten Eintrag, nie
          <code>activeItemPath</code>. Ein per Klick oder Taste geöffnetes Untermenü bleibt deshalb offen und bleibt
          <code>display: flex</code>, nachdem der Fokus weitergezogen ist. Welches Element Tab dann tatsächlich erreicht, ist eine Browserfrage, die das Bundle nicht
          beantwortet; prüf es im Browser. Die verschachtelte Liste des Kontextmenüs bekommt außerdem kein
          <code>ariaLabelledBy</code>, wo das Tiered Menu die id des Eltern-Eintrags übergibt.
        </p>

        <h3><code>MenuItem</code>-Felder, je Komponente</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Feld</th><th><code>p-menu</code></th><th><code>p-tieredMenu</code></th><th><code>p-contextMenu</code></th></tr>
            </thead>
            <tbody>
              <tr><td><code>label</code>, <code>icon</code>, <code>command</code>, <code>disabled</code>, <code>visible</code>, <code>separator</code>, <code>url</code>, <code>routerLink</code>, <code>styleClass</code>, <code>escape</code></td><td>{{ m.miCore }}</td><td>{{ m.miCore }}</td><td>{{ m.miCore }}</td></tr>
              <tr><td><code>items</code></td><td>{{ m.miItemsM }}</td><td>{{ m.miItemsT }}</td><td>{{ m.miItemsT }}</td></tr>
              <tr><td><code>badge</code></td><td>{{ m.miBadgeM }}</td><td>{{ m.miBadgeT }}</td><td>{{ m.miBadgeM }}</td></tr>
              <tr><td><code>tooltip</code></td><td>{{ m.miNo }}</td><td>{{ m.miYes }}</td><td>{{ m.miNo }}</td></tr>
              <tr><td><code>tooltipOptions</code></td><td>{{ m.miYes }}</td><td>{{ m.miYes }}</td><td>{{ m.miYes }}</td></tr>
              <tr><td><code>expanded</code>, <code>tooltipPosition</code></td><td>{{ m.miNo }}</td><td>{{ m.miNo }}</td><td>{{ m.miNo }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das Interface ist in <code>&#64;openng/optimus-ui/types/openng-optimus-ui-api.d.ts</code> deklariert, das alle
          menüartigen Komponenten der Bibliothek teilen — dass ein Feld im Typ existiert, sagt also nichts darüber, ob die
          Komponente, an die du es gebunden hast, es liest. <code>label</code> und <code>disabled</code> dürfen auch
          Funktionen sein und werden vor der Verwendung aufgelöst (<code>openng-optimus-ui-menu.mjs:623-628</code>).
        </p>

        <h3>Vier Inputs, die keine der drei deklariert</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>was er tut</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pt</code></td><td>Pass-through-Attribute je internem Abschnitt</td></tr>
              <tr><td><code>ptOptions</code></td><td>wie ein <code>pt</code>-Objekt mit dem eigenen des Presets zusammengeführt wird</td></tr>
              <tr><td><code>unstyled</code></td><td>rendert ohne die Klassen des Presets</td></tr>
              <tr><td><code>dt</code></td><td>Design-Token-Überschreibungen, auf diese Instanz begrenzt</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Einmal auf <code>BaseComponent</code> deklariert
          (<code>openng-optimus-ui-basecomponent.mjs:428</code>) und von allen drei geerbt, weshalb keine von ihnen sie in
          ihren eigenen kompilierten Inputs auflistet. Lies die Basisklasse, bevor du eine Input-Tabelle von Optimus für
          vollständig erklärst.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>Jedes Menü hat einen Namen — <code>ariaLabel</code> oder <code>ariaLabelledBy</code> —, weil die Liste das ist, worauf ein Screenreader landet.</li>
          <li>Jeder Eintrag ist ein Befehl mit einem <code>label</code>; Ziele sind Links außerhalb eines Menüs.</li>
          <li>Keine eigene Fokusregel auf den Einträgen — der eine Ring des Kits markiert die fokussierte Zeile schon auf dem Farbton und dem Panel; eine zweite Regel würde auseinanderlaufen.</li>
          <li>Nichts ist nur per Rechtsklick oder nur per Hover erreichbar.</li>
          <li>Der ganze Weg — öffnen, in ein Untermenü hinein, wieder heraus, schließen — wird mit der Tastatur durchgegangen, einschließlich dessen, was eine offene verschachtelte Liste der Tab-Reihenfolge hinzufügt.</li>
          <li><code>model</code> wird bei jeder Änderung als neues Array aufgebaut, Sprachwechsel eingeschlossen.</li>
          <li>Kein <code>escape: false</code> auf einem Label, das aus irgendetwas gebaut ist, das ein Nutzer oder eine API geliefert hat — und in einem <code>p-tieredMenu</code> oder <code>p-contextMenu</code> ein explizites <code>escape: true</code>, weil ein nicht gesetzter Wert das Label dort als Markup rendert.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Keine der drei steuert einen einzigen String bei. Wo die Menubar sich für ihren Hamburger einen Namen aus der
          Übersetzungs-Config der Bibliothek leiht, haben diese hier überhaupt keinen eingebauten Text — jedes Label, jeder
          Name, jeder leere Zustand gehört dir, und alles kommt über <code>model</code> herein.
        </p>

        <h3>Was woher kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>String</th><th>Quelle</th></tr>
            </thead>
            <tbody>
              <tr><td>Eintrags-Labels, Gruppen-Header, Badge-Text</td><td>dein <code>MenuItem[]</code></td></tr>
              <tr><td>der zugängliche Name des Menüs</td><td>dein <code>ariaLabel</code> oder ein Element, auf das du <code>ariaLabelledBy</code> richtest</td></tr>
              <tr><td>das Label des Triggers und sein Hinweis „öffnet ein Menü“</td><td>deines, am Button — keine Komponente schreibt es</td></tr>
              <tr><td>alles, was die Bibliothek mitliefert</td><td>nichts; keine der drei liest die Übersetzungs-Config</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Über alle drei Bundles durchsucht: kein Verweis auf <code>config.translation</code> und kein literaler String für
          Nutzer. Das eine von der Bibliothek gerenderte Zeichen ist der Untermenü-Chevron, ein <code>svg</code> mit
          <code>aria-hidden</code> (<code>openng-optimus-ui-tieredmenu.mjs:421-427</code>).
        </p>

        <h3>Ein übersetztes Model, das einen Sprachwechsel übersteht</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate()</code> nimmt einen Key und sonst nichts
          (<code>translation.service.ts</code>), also gehört der Aufruf in ein <code>computed()</code>: Das Signal
          wertet bei einem Sprachwechsel neu aus und reicht der Komponente ein neues Array, und das ist die einzige Art von
          Änderung, auf die ihr <code>model</code>-Setter reagiert.
        </p>

        <h3>Was das nicht löst</h3>
        <ul class="checklist">
          <li>{{ m.i18nRtlGap }}</li>
          <li>{{ m.i18nWidthGap }}</li>
          <li>{{ m.i18nTypeaheadGap }}</li>
        </ul>
        <p class="src-note">
          Das Erste ist der Platzierungsunterschied, den Design nennt; das Zweite folgt aus dem festen
          <code>min-width</code> und dem Fehlen jeder Umbruchregel; das Dritte daraus, dass der Typeahead die getippten
          Zeichen mit einem einfachen Kleinbuchstaben-Vergleich gegen das Label prüft
          (<code>openng-optimus-ui-tieredmenu.mjs:1316-1343</code>).
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.3</strong> — 23.09.2026 — Abgeglichen mit der letzten Fokusrunde: Das Eintrags-Icon aller drei Menüs ist
            <code>--text-color-secondary</code>, abgesichert in „menu focus“.
          </li>
          <li>
            <strong>1.2</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokusrunden: Der fokussierte Eintrag trägt
            den einen 2px-Ring des Kits, und der Chevron von Tiered und Context Menu ist <code>--text-color-secondary</code>,
            beides zitiert aus CONTRAST.MD „menu focus“; der Rat „bring deinen eigenen Ring mit“ ist entfernt.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Neu geprüft gegen Optimus UI 2.0.2 und die visuellen Stile: Jeder
            Zeilenverweis hält; Design nennt, was die Stile ändern (nur Eckenradien, keine Farbe und keine Menüregel), und
            verweist auf das im Menubar-Guide berechnete Standard-Fokuspaar von Aura; Verwendung schließt mit kommentierten
            Quellen.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class MenuArticleDeComponent extends MenuArticleComponent {
  /** Visible strings of the live stages, in German. */
  override readonly labels = {
    inlineMenu: 'Dokumentaktionen',
    popupMenu: 'Dokumentaktionen, Popup',
    tieredMenu: 'Exportoptionen',
    groupedMenu: 'Dokumentaktionen nach Abschnitt',
    ctxMenu: 'Aktionen für den Beispielbereich',
    ctxTarget: 'Beispielbereich',
    ctxHint: 'Hier rechtsklicken oder die Kontextmenü-Taste drücken',
    ddBadMenu: 'Zeilenaktionen, nur per Rechtsklick',
    ddBadTarget: 'Beispielzeile ohne Control',
    ddBadHint: 'Der Rechtsklick ist der einzige Weg hinein',
    ddGoodMenu: 'Zeilenaktionen',
    ddGoodTarget: 'Beispielzeile mit Control',
    ddGoodHint: 'Rechtsklicken oder den Button nutzen',
    ddEscapeBad: 'Labels mit Markup',
    ddEscapeGood: 'Schlichte Labels',
  };

  override readonly flat: MenuItem[] = [
    { label: 'Umbenennen', icon: 'pi pi-pencil' },
    { label: 'Duplizieren', icon: 'pi pi-copy' },
    { separator: true },
    { label: 'Archivieren', icon: 'pi pi-inbox' },
    { label: 'Löschen', icon: 'pi pi-trash', disabled: true },
  ];

  override readonly grouped: MenuItem[] = [
    { label: 'Bearbeiten', items: [{ label: 'Umbenennen', icon: 'pi pi-pencil' }, { label: 'Duplizieren', icon: 'pi pi-copy' }] },
    { label: 'Lebenszyklus', items: [{ label: 'Archivieren', icon: 'pi pi-inbox' }, { label: 'Löschen', icon: 'pi pi-trash' }] },
  ];

  override readonly tiered: MenuItem[] = [
    { label: 'Umbenennen', icon: 'pi pi-pencil' },
    {
      label: 'Exportieren',
      icon: 'pi pi-upload',
      items: [
        { label: 'Als CSV' },
        { label: 'Als JSON' },
        { label: 'Als Archiv', items: [{ label: 'Zip' }, { label: 'Tar' }] },
      ],
    },
    { separator: true },
    { label: 'Löschen', icon: 'pi pi-trash' },
  ];

  override readonly escapedOff: MenuItem[] = [
    { label: '<b>Jetzt</b> veröffentlichen', escape: false },
    { label: 'Als <i>Entwurf</i> speichern', escape: false },
  ];

  override readonly escapedOn: MenuItem[] = [
    { label: 'Jetzt veröffentlichen', icon: 'pi pi-send' },
    { label: 'Als Entwurf speichern', icon: 'pi pi-file' },
  ];

  /** The measured values of the English article, with the prose around them in German. */
  override readonly m = {
    menuList: 'ul role="menu", tabindex aus dem Input, aria-activedescendant',
    menuItem: 'li role="menuitem", aria-label, aria-disabled',
    menuRel: 'keine — eine flache Liste hat kein haspopup, expanded, setsize oder posinset',
    tieredList: 'ul role="menu", tabindex, aria-orientation="vertical", aria-activedescendant',
    tieredItem: 'li role="menuitem", aria-label, aria-disabled',
    tieredRel: 'aria-haspopup und aria-expanded an Gruppeneinträgen, aria-setsize und aria-posinset an allen',
    ctxList: 'ul role="menu", tabindex, aria-orientation="vertical", aria-activedescendant',
    ctxItem: 'li role="menuitem", aria-label, aria-disabled',
    ctxRel: 'die vier des Tiered Menu plus aria-level, das das Tiered Menu nicht setzt',

    pickMenu: 'eine flache Liste von Befehlen hängt an einem Control oder steht inline als Panel',
    openMenu: 'toggle() von deinem Trigger aus, oder gar nichts, wenn inline',
    costMenu: 'keine Untermenüs und kein Typeahead; ein Gruppen-Header ist eine dekorative Zeile ohne zugängliche Gruppierung',
    pickTiered: 'dasselbe, aber die Befehle sind verschachtelt',
    openTiered: 'toggle() von deinem Trigger aus; das erste Untermenü per Klick, Enter oder ArrowRight, Hover wechselt erst danach; nichts, wenn inline',
    costTiered: 'eine Untermenü-Liste, die noch offen ist, nachdem der Fokus weitergezogen ist, ist für sich fokussierbar, und Tab hinaus stellt den Trigger nicht wieder her',
    pickCtx: 'Befehle gehören zu einem Bereich oder einer Zeile, auf die der Nutzer zeigt',
    openCtx: 'ein contextmenu-Event am target oder am Dokument, oder ein langer Druck auf Touch-Geräten',
    costCtx: 'das Schließen stellt den Fokus auf nichts zurück, und die Trigger-Bindung wird einmal bei der Initialisierung gelesen',
    pickBar: 'die Befehle sitzen in einer horizontalen Leiste aus Menüs',
    openBar: 'behandelt im Menubar-Guide',
    costBar: 'eine eigene Komponente mit eigenem Guide — nichts davon wird hier wiederholt',

    tokList: 'Padding 0.25rem 0.25rem, Abstand 2px',
    tokItem: 'Padding 0.5rem 0.75rem, Abstand 0.5rem',
    tokItemRadius: '{border.radius.sm}',
    tokSubmenuLabel: 'Padding 0.5rem 0.75rem, font-weight 600 (nur p-menu)',
    tokSubmenuIcon: '0.875rem',
    tokShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    tokFocusBg: '{surface.100} hell / {surface.800} dunkel, Text {text.hover.color}',

    crLabel:
      'Die Label-Farbe gegen den Panel-Hintergrund, in jedem Zustand einschließlich des fokussierten — Aura-Standard, hier nicht abgesichert; der Menubar-Guide berechnet sie mit 10,35:1 hell, 17,72:1 dunkel.',
    crFocus:
      'Der Ring des Kits gegen den Fokus-Farbton und gegen das Panel: 4,73–16,30:1 und 5,18–17,85:1 über jeden Stil, Modus und Akzent. Der Farbton allein hat 1,10:1 / 1,19:1, informativ.',
    crChevron:
      'Der Chevron des Kits (--text-color-secondary) auf dem Panel und auf dem Fokus-Farbton: 5,21–8,48:1 und 4,76–7,13:1 — das einzige Signal, dass ein Eintrag ein Untermenü hat (Tiered und Context Menu; p-menu hat keines).',
    crIcon:
      'Die Icon-Farbe des Kits (--text-color-secondary; Aura surface.400 hatte 2,56:1) auf dem Panel und auf dem Fokus-Farbton: 5,21–8,48:1 und 4,76–7,13:1 — auf 3:1 gehalten, damit ein Eintrag nur mit Icon besteht.',

    posMenuWhat: 'p-menu-Popup',
    posMenuAnchor: 'das Element, das das an toggle() übergebene Event ausgelöst hat',
    posMenuFlip: 'an den Positionierungshelfer der Bibliothek delegiert; schließt bei Größenänderung des Fensters und beim Scrollen eines Vorfahren',
    posMenuDir: 'nicht zutreffend — ein Panel, kein seitlicher Versatz',
    posTieredWhat: 'p-tieredMenu-Untermenü',
    posTieredAnchor: 'der Eltern-Eintrag',
    posTieredFlip: 'horizontaler und vertikaler Versatz, gegen den Viewport berechnet',
    posTieredDir: 'logisch — schreibt inset-inline-start, spiegelt sich also unter dir="rtl"',
    posCtxWhat: 'p-contextMenu-Wurzel',
    posCtxAnchor: 'die Seitenkoordinaten des Events plus ein Pixel',
    posCtxFlip: 'klappt am rechten und unteren Rand nach links und oben um und wird dann in den Scrollbereich eingepasst',
    posCtxDir: 'physisch left und top, aus dem Zeiger berechnet',
    posCtxSubWhat: 'p-contextMenu-Untermenü',
    posCtxSubAnchor: 'der Eltern-Eintrag',
    posCtxSubFlip: 'nur horizontal — top wird bei jedem Öffnen auf 0px gesetzt, ein tiefes Untermenü läuft also unten hinaus',
    posCtxSubDir: 'physisch left, spiegelt sich also nicht unter dir="rtl"',

    inMenuModel: 'ein einfaches Feld, kein Setter; das Template iteriert unter OnPush direkt über das Array, ein mutiertes Array rendert also erst bei der nächsten Prüfung der Komponente neu',
    inMenuPopup: 'den ganzen Overlay-Pfad — Positionierung, den Klick-Listener am Dokument, die Fokusrückgabe bei Escape',
    inMenuTabindex: 'das Listenelement; das ist der einzige Tab-Stopp der Komponente',
    inMenuAria: 'das Listenelement, und sie sind der einzige Benennungsweg, den die Komponente anbietet',
    inMenuAppendTo: 'wohin der Overlay-Container beim Öffnen verschoben und von wo er beim Schließen zurückgeholt wird',
    inMenuZ: 'die Schichtung des Popup-Containers; beide werden bei jedem Öffnen gelesen',
    inMenuChrome: 'das Container-Element; eine fehlende id wird generiert, sie unterscheidet sich also pro Rendering',
    inMenuMotion: 'die Motion-Direktive am Overlay-Container',
    inMenuDeadTransition: 'nichts — mit Standardwerten deklariert und nirgends im Bundle gelesen',

    cmpPopupT: 'ja — toggle() von einem Trigger aus, oder weglassen für ein Inline-Panel',
    cmpPopupC: 'kein solcher Input; es ist immer ein Overlay',
    cmpTargetT: 'keine solchen Inputs',
    cmpTargetC: 'ja, und sie werden einmal bei der Initialisierung gelesen; ist keiner gesetzt, wird überhaupt kein Listener gebunden',
    cmpTriggerT: 'kein solcher Input',
    cmpTriggerC: 'ja, Standard contextmenu; auf iOS und Android gegen einen langen Druck getauscht',
    cmpBreakT: 'lebendig: setzt die Mobile-Klasse auf die Wurzel, die die Untermenüs stapelt, und unterdrückt darunter das Öffnen per Hover. Der Input-Wert wird einmal beim Init gelesen, der Treffer selbst bleibt über einen Change-Listener lebendig',
    cmpBreakC: 'halb tot: die Hover-Unterdrückung funktioniert, die Mobile-Klasse greift nie',
    cmpAutoT: 'ja, Standard true — aber er leitet nur das mouseenter weiter; das Menü reagiert darauf, solange es dirty ist, was ein Klick oder eine Tastenaktivierung setzt, also öffnet Hover nie das erste Untermenü',
    cmpAutoC: 'kein solcher Input; Hover öffnet das Untermenü immer',
    cmpDisabledT: 'erreicht nur den tabindex der Wurzelliste; blockiert weder Hover noch ein programmatisches show()',
    cmpDisabledC: 'kein solcher Input',
    cmpTabT: 'ja, nur auf der Wurzelliste',
    cmpTabC: 'kein solcher Input; die Wurzelliste behält den Standard 0 der Sub-Komponente',
    cmpPressT: 'kein solcher Input',
    cmpPressC: 'ja, 500 ms, genutzt für den langen Druck auf Touch-Geräten',
    cmpTransT: 'mit Standardwerten deklariert und nirgends gelesen',
    cmpTransC: 'nicht deklariert',

    kbArrowM: 'bewegt sich um einen Eintrag und überspringt deaktivierte; springt an keinem Ende um',
    kbArrowT: 'bewegt sich um einen Eintrag und überspringt deaktivierte; springt nicht um',
    kbArrowC: 'bewegt sich um einen Eintrag und überspringt deaktivierte; springt nicht um',
    kbLatM: 'nichts — die Liste ist flach',
    kbLatT: 'Rechts öffnet das Untermenü und geht hinein; Links schließt eine Ebene',
    kbLatC: 'Rechts öffnet das Untermenü und geht hinein; Links schließt eine Ebene',
    kbHomeM: 'erster Eintrag / letzter Eintrag',
    kbHomeT: 'erster Eintrag / letzter Eintrag',
    kbHomeC: 'erster Eintrag / letzter Eintrag',
    kbEnterM: 'klickt den fokussierten Eintrag; in einem Popup wird zuerst der Trigger fokussiert, dann schließt das Menü',
    kbEnterT: 'klickt den fokussierten Eintrag',
    kbEnterC: 'klickt den fokussierten Eintrag',
    kbEscM: 'in einem Popup: fokussiert den Trigger und schließt; inline: nichts',
    kbEscT: 'schließt jede offene Ebene, nicht nur das aktuelle Untermenü; in einem Popup wird wieder der Trigger fokussiert, inline die Wurzelliste',
    kbEscC: 'schließt das Menü; danach ist nichts fokussiert',
    kbTabM: 'in einem Popup: fokussiert den Trigger und schließt, ohne preventDefault — der Browser springt also vom Trigger aus weiter',
    kbTabT: 'schließt das Menü, ohne den Trigger wiederherzustellen',
    kbTabC: 'schließt das Menü, ohne irgendetwas wiederherzustellen',
    kbTypeM: 'nichts — der Key-Handler hat keinen Zweig für druckbare Zeichen',
    kbTypeT: 'springt zum nächsten Eintrag, dessen Label mit den getippten Zeichen beginnt; der Puffer leert sich nach 500 ms',
    kbTypeC: 'derselbe Typeahead',

    miCore: 'gelesen',
    miItemsM: 'als Gruppen-Header gelesen, und sobald ein Eintrag es hat, wird jeder Eintrag der obersten Ebene zu einem; die Kinder werden in dieselbe flache Liste geplättet',
    miItemsT: 'als Untermenü gelesen, in beliebiger Tiefe',
    miBadgeM: 'gelesen',
    miBadgeT: 'gelesen, aber als einfaches span statt als p-badge',
    miYes: 'gelesen',
    miNo: 'nicht gelesen',

    ddCtxBad:
      'Der einzige Listener gilt einer Zeigergeste, die Befehle existieren also für einen Mausnutzer und für niemanden sonst — und das Panel gibt keinen sichtbaren Hinweis, dass es da ist.',
    ddCtxGood:
      'Dasselbe Model hinter einem Control, das in der Tab-Reihenfolge steht und einen Namen hat, sodass die Befehle ohne Zeiger erreichbar sind; der Rechtsklick bleibt als die Abkürzung, die er ist. Ein Vorbehalt: show() positioniert das Panel nach den Seitenkoordinaten des Events, die ein aus Enter oder Leertaste erzeugter Klick nicht mitbringt — prüf, wo es landet, und gib show() eigene Koordinaten, falls es in der Seitenecke aufgeht.',
    ddEscapeBad:
      'Das Label wird als HTML mit umgangenem Sanitizer eingefügt, ein Label, das aus irgendetwas zusammengesetzt ist, das ein Nutzer oder eine API geliefert hat, ist also ein Einfallstor für Injection — und der zugängliche Name ist der rohe String samt spitzer Klammern, weil aria-label an das ungeparste Label gebunden ist.',
    ddEscapeGood:
      'Das Label ist ein Textknoten, sein zugänglicher Name sind genau die Wörter darin, und die visuelle Betonung kommt aus dem Icon-Slot, den die Komponente schon bereitstellt.',

    i18nRtlGap:
      'Die Spiegelung ist nicht einheitlich: Das Tiered Menu platziert seine Untermenüs logisch und das Kontextmenü physisch, unter dir="rtl" verhalten sich die beiden also nicht gleich.',
    i18nWidthGap:
      'Länge: Das Panel hat eine feste Mindestbreite, kein Maximum und keine Umbruchregel, eine längere Übersetzung verbreitert also das Panel, statt umzubrechen.',
    i18nTypeaheadGap:
      'Der Typeahead vergleicht das Label ab seinen ersten Zeichen, er folgt also dem übersetzten Wort statt einem stabilen Kürzel, und eine Sprache, deren Eingabe eine Komposition braucht, erreicht ihn überhaupt nicht.',
  };
}
