import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from '@openng/optimus-ui/api';
import { ConfirmdialogArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './confirmdialog-article.component';

/**
 * German twin of the Confirm Dialog and Confirm Popup guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the visible strings in `m` and the
 * texts the demo handlers write are German. Keep it in step with the English file:
 * same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs confirmdialog`).
 *
 * The demo labels are German; the illustrative markup samples on the page keep their
 * English text verbatim (they are code). The library defaults Yes/No stay English, as the
 * library ships them.
 */
@Component({
  selector: 'app-confirmdialog-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  providers: [ConfirmationService],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'confirmdialog'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Komponenten teilen sich einen Service. Ihre Sichtbarkeit bindest du nie: Du rufst
          <code>ConfirmationService.confirm()</code> mit einem Objekt auf, das die Nachricht, die Beschriftungen und die
          Callbacks trägt, und die Instanz, deren Key passt, öffnet sich. Der Dialog übernimmt den Bildschirm; das Popup
          hängt an dem Element, das du als Ziel angibst.
        </p>

        <h3>Beide Oberflächen, ein Service</h3>
        <div class="stage stage--row">
          <p-button label="Per Dialog löschen" severity="danger" (onClick)="askDialog()" />
          <p-button label="Per Popup löschen" severity="danger" [outlined]="true" (onClick)="askPopup($event)" />
          <p-button label="Protokoll zurücksetzen" severity="secondary" [text]="true" (onClick)="outcome.set(emptyLog)" />
        </div>
        <p class="outcome" aria-live="polite">{{ outcome() }}</p>
        <p-confirmDialog key="guideDemo" header="Diesen Entwurf löschen?" />
        <p-confirmpopup key="guidePopup" />
        <p class="src-note">
          Beide Instanzen sind live, und beide haben einen Key, also erreicht jeder Aufruf genau eine davon
          (<code>openng-optimus-ui-confirmdialog.mjs:343</code>, <code>openng-optimus-ui-confirmpopup.mjs:232</code>). Die Zeile darüber meldet,
          welcher Callback lief und was er bekommen hat.
        </p>

        <h3>Was der Dialog ausgibt</h3>
        <pre class="code-block"><code>{{ dialogMarkupSnippet }}</code></pre>
        <p class="src-note">
          Der Confirm Dialog rendert einen inneren <code>p-dialog</code>, dessen <code>role="alertdialog"</code> fest im
          Template steht (<code>openng-optimus-ui-confirmdialog.mjs:523</code>). Der Name kommt aus der Header-ID, die der Dialog berechnet
          (<code>openng-optimus-ui-dialog.mjs:513-516</code>) und auf dem Titel-Span rendert (<code>openng-optimus-ui-dialog.mjs:1066</code>); der Span
          der Nachricht trägt keine ID, also beschreibt nichts den Dialog. Den Fokus setzt der innere Dialog, sobald das Overlay
          eingeblendet ist (<code>openng-optimus-ui-dialog.mjs:949-952</code>), auf das erste fokussierbare Element, das er findet,
          Inhalt vor Footer (<code>openng-optimus-ui-dialog.mjs:633-641</code>) — und der Inhalt ist hier ein Icon
          und eine Nachricht, also ist der Ablehnen-Button der erste Kandidat. Der Schließen-Button im Header bekommt seinen Namen
          allein aus <code>closeAriaLabel</code> (<code>openng-optimus-ui-dialog.mjs:1099</code>), das der Confirm
          Dialog nie bindet, also wird er ohne Namen gerendert.
        </p>

        <h3>Was das Popup ausgibt</h3>
        <pre class="code-block"><code>{{ popupMarkupSnippet }}</code></pre>
        <p class="src-note">
          Die Wurzel des Popups trägt <code>role="alertdialog"</code> und die Fokusfallen-Direktive
          (<code>openng-optimus-ui-confirmpopup.mjs:498-502</code>), aber kein <code>aria-modal</code>, kein <code>aria-labelledby</code> und kein
          <code>aria-describedby</code>. Seine Buttons nehmen ihr <code>aria-label</code> aus genau der Beschriftung, die sie
          schon zeigen (<code>:529</code>, <code>:548</code>).
        </p>

        <h3>Welcher Schließweg was meldet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Wie es schließt</th><th>Dialog</th><th>Popup</th></tr>
            </thead>
            <tbody>
              <tr><td>Bestätigen-Button</td><td>{{ m.pathAcceptD }}</td><td>{{ m.pathAcceptP }}</td></tr>
              <tr><td>Ablehnen-Button</td><td>{{ m.pathRejectD }}</td><td>{{ m.pathRejectP }}</td></tr>
              <tr><td>Escape</td><td>{{ m.pathEscapeD }}</td><td>{{ m.pathEscapeP }}</td></tr>
              <tr><td>Schließen-Icon / Klick daneben</td><td>{{ m.pathMaskD }}</td><td>{{ m.pathMaskP }}</td></tr>
              <tr><td>Scrollen oder Größenänderung</td><td>{{ m.pathScrollD }}</td><td>{{ m.pathScrollP }}</td></tr>
              <tr><td><code>ConfirmationService.close()</code></td><td>{{ m.pathCloseD }}</td><td>{{ m.pathCloseP }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Wege des Dialogs aus <code>openng-optimus-ui-confirmdialog.mjs:448-453</code> (<code>close()</code>),
          <code>:478-485</code> (<code>onVisibleChange</code>), <code>:486-491</code> und <code>:492-497</code>;
          Wege des Popups aus <code>openng-optimus-ui-confirmpopup.mjs:285-289</code>, <code>:368-374</code>, <code>:375-381</code>,
          <code>:410-415</code>, <code>:425-429</code> und <code>:443-447</code>. Das Scrollverhalten des Dialogs ist
          das geerbte von <code>p-dialog</code>: Er blockiert das Scrollen der Seite, statt sich zu schließen
          (<code>openng-optimus-ui-confirmdialog.mjs:186</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche Oberfläche, und ob du überhaupt fragen solltest</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Die Situation</th><th>Greif zu</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Die Aktion lässt sich rückgängig machen</td>
                <td>ausführen, dann Rückgängig anbieten</td>
                <td>{{ m.whenUndo }}</td>
              </tr>
              <tr>
                <td>Unumkehrbar, und der Leser ist dabei, den Kontext zu verlassen</td>
                <td><code>p-confirmDialog</code></td>
                <td>{{ m.whenDialog }}</td>
              </tr>
              <tr>
                <td>Unumkehrbar, klein, und es gehört zu einem Control</td>
                <td><code>p-confirmpopup</code></td>
                <td>{{ m.whenPopup }}</td>
              </tr>
              <tr>
                <td>Der Leser muss etwas liefern</td>
                <td><code>p-dialog</code></td>
                <td>{{ m.whenDialogPlain }}</td>
              </tr>
              <tr>
                <td>Nichts steht auf dem Spiel, du willst nur berichten</td>
                <td>eine Message oder ein Toast</td>
                <td>{{ m.whenMessage }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die drei Schließwege des Popups — Klick daneben
          (<code>openng-optimus-ui-confirmpopup.mjs:410-415</code>), Größenänderung des Fensters (<code>:425-429</code>) und Scrollen des Ziels
          (<code>:443-447</code>) — rufen <code>hide()</code> und sonst nichts auf, also kann ein Leser die Frage verschwinden
          lassen, ohne dass einer der Callbacks läuft. Der Dialog hat keinen solchen Weg: Jeder Ausgang aus ihm meldet sich über
          <code>accept</code> oder über <code>reject</code>.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Frage, beantwortet mit Yes und No</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__msg">Bist du sicher?</p>
                <div class="mock__row">
                  <p-button label="No" severity="secondary" size="small" [text]="true" />
                  <p-button label="Yes" size="small" />
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddVerbBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — das Verb der Aktion auf dem Bestätigen-Button</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__msg">Den Entwurf „Notizen Woche 3“ löschen? Das lässt sich nicht rückgängig machen.</p>
                <div class="mock__row">
                  <p-button label="Entwurf behalten" severity="secondary" size="small" [text]="true" />
                  <p-button label="Entwurf löschen" severity="danger" size="small" />
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddVerbGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen sind gerenderte Buttons in der Footer-Reihenfolge, die die Komponenten verwenden — Ablehnen zuerst, Bestätigen
          danach (<code>openng-optimus-ui-confirmdialog.mjs:580</code> und <code>:597</code>). Die Standardbeschriftungen sind der Grund,
          warum sich die linke so leicht ausliefern lässt: Ohne <code>acceptLabel</code> fallen die Komponenten auf
          <code>config.getTranslation</code> zurück (<code>openng-optimus-ui-confirmdialog.mjs:504-509</code>), dessen Standardwerte
          <code>Yes</code> und <code>No</code> sind (<code>openng-optimus-ui-config.mjs:130-131</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Confirm Dialog ohne Header</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__title mock__title--empty"><span class="mock__note">(leerer Titel-Span)</span></p>
                <p class="mock__msg">Der Entwurf wird gelöscht. Das lässt sich nicht rückgängig machen.</p>
                <p-button label="Unbenannten Dialog öffnen" severity="secondary" size="small" (onClick)="askUnnamed()" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddHeaderBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Header, der die Entscheidung benennt</span>
            <div class="dd__stage">
              <div class="mock">
                <p class="mock__title">Diesen Entwurf löschen?</p>
                <p class="mock__msg">Der Entwurf wird gelöscht. Das lässt sich nicht rückgängig machen.</p>
                <p-button label="Benannten Dialog öffnen" severity="secondary" size="small" (onClick)="askDialog()" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddHeaderGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Die Titelzeilen sind Mock-ups des Headers, den der innere Dialog rendert; die Buttons darunter öffnen dieselben
          Live-Instanzen wie die Bühne oben auf der Seite. <code>p-dialog</code> berechnet sein
          <code>aria-labelledby</code> aus der Header-ID (<code>openng-optimus-ui-dialog.mjs:513-516</code>) und rendert diese ID auf dem
          Titel-Span, ob es nun einen Header gibt, der hineinpasst, oder nicht (<code>openng-optimus-ui-dialog.mjs:1066</code>). Die Folge
          ergibt sich aus diesen beiden Zeilen: Mit einem leeren Header zeigt die ID, über die der alertdialog benannt wird, auf ein
          Element ohne Text.
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          <code>option()</code> schaut zuerst in die <code>Confirmation</code> und erst dann in die Komponente
          (<code>openng-optimus-ui-confirmdialog.mjs:397-405</code>), deshalb gehört fast alles, was sich zu setzen lohnt, in den Aufruf
          statt ins Template.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura-Wert</th><th>Was es tut</th></tr>
            </thead>
            <tbody>
              <tr><td><code>confirmdialog.icon.size</code></td><td><code>2rem</code></td><td>{{ m.tokCdIconSize }}</td></tr>
              <tr>
                <td><code>confirmdialog.icon.color</code></td>
                <td><code>&#123;overlay.modal.color&#125;</code></td>
                <td>{{ m.tokCdIconColor }}</td>
              </tr>
              <tr><td><code>confirmdialog.content.gap</code></td><td><code>1rem</code></td><td>{{ m.tokCdGap }}</td></tr>
              <tr>
                <td><code>confirmpopup.background</code></td>
                <td><code>&#123;overlay.popover.background&#125;</code></td>
                <td>{{ m.tokCpBg }}</td>
              </tr>
              <tr><td><code>confirmpopup.gutter</code></td><td><code>10px</code></td><td>{{ m.tokCpGutter }}</td></tr>
              <tr><td><code>confirmpopup.arrowOffset</code></td><td><code>1.25rem</code></td><td>{{ m.tokCpArrow }}</td></tr>
              <tr><td><code>confirmpopup.icon.size</code></td><td><code>1.5rem</code></td><td>{{ m.tokCpIconSize }}</td></tr>
              <tr><td><code>confirmpopup.footer.gap</code></td><td><code>0.5rem</code></td><td>{{ m.tokCpFooterGap }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus den Exporten von <code>&#64;openng/optimus-ui-themes/dist/aura/confirmdialog/index.mjs</code> und
          <code>&#64;openng/optimus-ui-themes/dist/aura/confirmpopup/index.mjs</code>, beides einzeilige Dist-Bundles.
          Die Regeln, die sie verwenden, sind
          <code>&#64;openng/optimus-ui-styles/dist/confirmdialog/index.mjs:2-13</code> und
          <code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:2-34</code>. Die Pfeil-Regel liest zwei
          Werte, nicht einen: <code>calc(arrow.offset + arrow.left)</code>
          (<code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:52</code>), wobei der zweite die Custom
          Property <code>--p-confirmpopup-arrow-left</code> ist, die <code>alignArrow()</code> bei jedem Öffnen aus dem Abstand
          zwischen dem Overlay und seinem Ziel setzt (<code>openng-optimus-ui-confirmpopup.mjs:334-343</code>,
          aufgerufen unter <code>:299</code>). Öffne das Popup von einem breiten Auslöser aus und lies diese Property am Overlay ab,
          um zu sehen, wie sie sich ändert.
        </p>

        <h3>Was der visuelle Stil ändert</h3>
        <p>{{ m.styleFrame }}</p>
        <p class="src-note">
          Die Rahmenregeln sind die <code>.p-dialog</code>-Selektoren in den <code>html.style-&lt;name&gt;</code>-Blöcken von
          <code>src/styles.scss</code>; die Radius-Skala ist das <code>presetOverrides.primitive.borderRadius</code> jedes Stils in
          <code>src/app/services/ui-styles.ts</code>. Kein Stilblock nennt <code>.p-confirmpopup</code> oder
          <code>.p-confirmdialog</code>.
        </p>

        <h3>Kontrast: welches Kriterium gilt</h3>
        <p>{{ m.contrastPara }}</p>
        <p class="src-note">
          Die Dialog-Fläche ist geprüft: <code>docs/generated/CONTRAST.MD</code>, Gruppe <code>dialog</code>, misst
          <code>dialog.color</code> auf <code>dialog.background</code> mit 10,35:1 hell / 17,72:1 dunkel in jedem
          visuellen Stil, und das sind die Nachricht und das Icon des Confirm Dialogs (<code>&#123;overlay.modal.color&#125;</code>);
          das Schließen-Icon und der 2px-Fokus-Ring des Kits auf diesem Panel sind ebenfalls geprüft (<code>dialog</code>,
          <code>focus ring</code>). Das Popup hat keine Zeile — sein Text auf <code>&#123;overlay.popover.background&#125;</code>
          ist Auras Paar —, also sind die Token-Namen oben die Paare, die du prüfen musst, wenn du es umfärbst. Bestätigen und Ablehnen sind
          <code>p-button</code>s und tragen die geprüften Beschriftungen und den Ring aus dem Button-Guide.
        </p>

        <h3>Schmaler Viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          Keines der beiden Komponenten-Stylesheets enthält eine Media Query oder eine Container Query, und das Stylesheet des Popups setzt
          überhaupt keine Breite — <code>position: absolute</code> unter
          <code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:3</code>, die Flächenregeln unter
          <code>:7-11</code>, Inhalt und Footer unter <code>:15-34</code>. Die Breiten pro Breakpoint des Dialogs werden
          aus dem Input <code>breakpoints</code> in ein eingefügtes Style-Element generiert
          (<code>openng-optimus-ui-confirmdialog.mjs:428-447</code>), und dieses Element wird einmal gebaut, aus
          <code>onInit</code> (<code>:358-360</code>). Das Popup schließt sich bei einer Größenänderung des Fensters, es sei denn, das Gerät meldet
          Touch (<code>openng-optimus-ui-confirmpopup.mjs:425-429</code>).
        </p>

        <h3>Wo sie im Stapel liegen</h3>
        <p>{{ m.zIndex }}</p>
        <p class="src-note">
          Der Dialog erbt die Modal-Ebene seines inneren <code>p-dialog</code>; das Popup registriert sich selbst unter
          der Overlay-Ebene in <code>setZIndex()</code> (<code>openng-optimus-ui-confirmpopup.mjs:329-333</code>). Die beiden Basen sind
          <code>modal: 1100</code> und <code>overlay: 1000</code>
          (<code>openng-optimus-ui-config.mjs:235-240</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs von p-confirmDialog</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Standard</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>key</code></td><td>—</td><td>{{ m.apiKey }}</td></tr>
              <tr><td><code>header</code> · <code>message</code> · <code>icon</code></td><td>—</td><td>{{ m.apiContent }}</td></tr>
              <tr>
                <td><code>acceptLabel</code> · <code>rejectLabel</code></td>
                <td>—</td>
                <td>{{ m.apiLabels }}</td>
              </tr>
              <tr>
                <td><code>acceptVisible</code> · <code>rejectVisible</code></td>
                <td><code>true</code></td>
                <td>{{ m.apiVisible }}</td>
              </tr>
              <tr><td><code>closable</code></td><td><code>true</code></td><td>{{ m.apiClosable }}</td></tr>
              <tr><td><code>closeOnEscape</code></td><td><code>true</code></td><td>{{ m.apiEscape }}</td></tr>
              <tr><td><code>dismissableMask</code></td><td>nicht gesetzt</td><td>{{ m.apiMask }}</td></tr>
              <tr><td><code>modal</code> · <code>blockScroll</code></td><td><code>true</code></td><td>{{ m.apiModal }}</td></tr>
              <tr><td><code>breakpoints</code></td><td>—</td><td>{{ m.apiBreakpoints }}</td></tr>
              <tr><td><code>position</code> · <code>draggable</code></td><td><code>center</code> · <code>true</code></td><td>{{ m.apiPosition }}</td></tr>
              <tr><td><code>appendTo</code></td><td><code>body</code></td><td>{{ m.apiAppendTo }}</td></tr>
              <tr>
                <td><code>defaultFocus</code></td>
                <td><code>accept</code></td>
                <td>{{ m.apiDefaultFocus }}</td>
              </tr>
              <tr>
                <td><code>focusTrap</code> · <code>rtl</code> · <code>transitionOptions</code></td>
                <td><code>true</code> · <code>false</code> · <code>150ms …</code></td>
                <td>{{ m.apiUnforwarded }}</td>
              </tr>
              <tr>
                <td><code>closeAriaLabel</code> · <code>acceptAriaLabel</code> · <code>rejectAriaLabel</code></td>
                <td>—</td>
                <td>{{ m.apiAriaLabels }}</td>
              </tr>
              <tr>
                <td><code>dt</code> · <code>unstyled</code> · <code>pt</code> · <code>ptOptions</code></td>
                <td>—</td>
                <td>{{ m.apiInherited }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarierte Inputs aus den kompilierten Komponenten-Metadaten unter <code>openng-optimus-ui-confirmdialog.mjs:517</code> und dem
          Decorator-Block unter <code>:731-838</code>. Die letzte Zeile steht in keinem von beiden: <code>dt</code>, <code>unstyled</code>,
          <code>pt</code> und <code>ptOptions</code> sind Signal-Inputs, geerbt von <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:42-63</code>) — geh die Vererbungskette ab, bevor du eine
          Optimus-API-Tabelle vollständig nennst. Das einzige Output ist <code>onHide</code>.
        </p>

        <h3>Sieben tote Inputs, drei Arten zu scheitern</h3>
        <p>{{ m.deadInputs }}</p>
        <pre class="code-block"><code>{{ deadInputSnippet }}</code></pre>
        <p class="src-note">
          <code>getElementToFocus()</code> ist unter <code>openng-optimus-ui-confirmdialog.mjs:411-427</code> definiert, und sein Name kommt
          sonst nirgends in der Datei vor; die Klassennamen, nach denen es sucht, passen nicht zu denen, die
          <code>getButtonStyleClass()</code> auf die Buttons setzt (<code>:17-23</code>, <code>:406-410</code>).
          <code>focusTrap</code>, <code>rtl</code> und <code>transitionOptions</code> sind unter
          <code>:228</code>, <code>:191</code> und <code>:223</code> deklariert und tauchen in keinem Binding des inneren
          <code>p-dialog</code> auf (Template unter <code>:518-616</code>), der alle drei als eigene Inputs hat.
          <code>closeAriaLabel</code>, <code>acceptAriaLabel</code> und <code>rejectAriaLabel</code>
          (<code>:131</code>, <code>:136</code>, <code>:156</code>) kommen nur dort und im Decorator-Block vor; die
          Footer-Buttons lesen stattdessen <code>acceptButtonProps.ariaLabel</code> (<code>:586</code>,
          <code>:603</code>), und das eigene <code>closeAriaLabel</code> des inneren Dialogs bleibt ebenfalls ungebunden.
        </p>

        <h3>Inputs von p-confirmpopup</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Standard</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>key</code></td><td>—</td><td>{{ m.cpKey }}</td></tr>
              <tr><td><code>defaultFocus</code></td><td><code>accept</code></td><td>{{ m.cpDefaultFocus }}</td></tr>
              <tr><td><code>visible</code></td><td>nicht gesetzt</td><td>{{ m.cpVisible }}</td></tr>
              <tr><td><code>appendTo</code></td><td><code>body</code></td><td>{{ m.cpAppendTo }}</td></tr>
              <tr><td><code>autoZIndex</code></td><td><code>true</code></td><td>{{ m.cpAutoZ }}</td></tr>
              <tr><td><code>baseZIndex</code></td><td><code>0</code></td><td>{{ m.cpBaseZ }}</td></tr>
              <tr>
                <td><code>showTransitionOptions</code> · <code>hideTransitionOptions</code></td>
                <td>—</td>
                <td>{{ m.cpTransitions }}</td>
              </tr>
              <tr><td><code>motionOptions</code></td><td>—</td><td>{{ m.cpMotion }}</td></tr>
              <tr><td><code>style</code> · <code>styleClass</code></td><td>—</td><td>{{ m.cpStyle }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarierte Inputs aus <code>openng-optimus-ui-confirmpopup.mjs:489</code> und dem Decorator-Block unter <code>:652-688</code>.
          Das Popup hat keine Outputs. Alles andere, was es rendert — Nachricht, Icon, Beschriftungen, Button-Props, das Ziel, an dem es
          hängt —, kommt in der <code>Confirmation</code>, nicht als Input.
        </p>

        <h3>Ein Service, zwei Arten, eine Anfrage zu verlieren</h3>
        <pre class="code-block"><code>{{ routingSnippet }}</code></pre>
        <p class="src-note">
          Key-Vergleich unter <code>openng-optimus-ui-confirmdialog.mjs:343</code> und <code>openng-optimus-ui-confirmpopup.mjs:232</code>; der
          <code>null</code>-Zweig, den <code>close()</code> auslöst, läuft davor
          (<code>openng-optimus-ui-confirmdialog.mjs:339-342</code>, <code>openng-optimus-ui-confirmpopup.mjs:222-225</code>). Ein zweites
          <code>confirm()</code>, während eines offen ist, ersetzt <code>confirmation</code> und beide Emitter, ohne das
          Paar davor auszulösen oder abzumelden (<code>openng-optimus-ui-confirmdialog.mjs:343-354</code>).
        </p>

        <h3>Das Argument von reject lesen</h3>
        <pre class="code-block"><code>{{ rejectSnippet }}</code></pre>
        <p class="src-note">
          <code>ConfirmEventType</code> ist <code>ACCEPT = 0</code>, <code>REJECT = 1</code>,
          <code>CANCEL = 2</code> (<code>openng-optimus-ui-api.mjs:12-14</code>). Der Dialog meldet
          <code>CANCEL</code> aus <code>close()</code> (<code>openng-optimus-ui-confirmdialog.mjs:448-453</code>) und
          <code>REJECT</code> vom Button (<code>:492-497</code>); das Popup meldet überhaupt ohne Argument
          (<code>openng-optimus-ui-confirmpopup.mjs:375-378</code>), also lässt sich derselbe Handler zwischen beiden nicht ohne einen
          Standardwert teilen.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkHeader }}</li>
          <li>{{ m.checkVerb }}</li>
          <li>{{ m.checkFocus }}</li>
          <li>{{ m.checkReject }}</li>
          <li>{{ m.checkHtml }}</li>
          <li>{{ m.checkKey }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Woher die Buttons ihre Wörter bekommen</h3>
        <p>{{ m.i18nLibrary }}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Kommt aus</th><th>Folgt einem Sprachwechsel im Kit?</th></tr>
            </thead>
            <tbody>
              <tr><td>Beschriftung des Bestätigen-Buttons</td><td>{{ m.i18nAcceptSrc }}</td><td>{{ m.i18nAcceptSwitch }}</td></tr>
              <tr><td>Beschriftung des Ablehnen-Buttons</td><td>{{ m.i18nRejectSrc }}</td><td>{{ m.i18nRejectSwitch }}</td></tr>
              <tr><td>Header und Nachricht</td><td>{{ m.i18nBodySrc }}</td><td>{{ m.i18nBodySwitch }}</td></tr>
              <tr><td>Name des Schließen-Icons (Dialog)</td><td>{{ m.i18nCloseSrc }}</td><td>{{ m.i18nCloseSwitch }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Rückfallkette ist <code>acceptLabel</code>, dann <code>acceptButtonProps.label</code>, dann
          <code>config.getTranslation(TranslationKeys.ACCEPT)</code>
          (<code>openng-optimus-ui-confirmdialog.mjs:504-509</code>, <code>openng-optimus-ui-confirmpopup.mjs:476-481</code>); die Schlüssel sind
          <code>accept</code> und <code>reject</code> (<code>openng-optimus-ui-api.mjs:796-797</code>), und die
          Standardwerte der Konfiguration sind <code>Yes</code> und <code>No</code>
          (<code>openng-optimus-ui-config.mjs:130-131</code>). Was das Kit selbst in diese Konfiguration schreibt, ersetzt den
          <code>aria</code>-Block und sonst nichts, also behalten diese beiden ihre englischen Standardwerte — die Referenz-Implementierung
          ist <code>src/app/services/optimus-a11y.service.ts</code>. Dieser <code>aria</code>-Block erreicht das
          Schließen-Icon ohnehin nicht: <code>p-dialog</code> liest <code>maximizeLabel</code> und
          <code>minimizeLabel</code> daraus (<code>openng-optimus-ui-dialog.mjs:548-553</code>) und benennt den
          Schließen-Button aus seinem eigenen Input <code>closeAriaLabel</code>
          (<code>openng-optimus-ui-dialog.mjs:1099</code>), das das Template des Confirm Dialogs weder
          direkt noch über <code>closeButtonProps</code> bindet
          (<code>openng-optimus-ui-confirmdialog.mjs:518-616</code>); sein eigenes <code>closeAriaLabel</code>
          (<code>:131</code>) wird nirgends gelesen. Öffne einen Confirm Dialog mit Schließen-Icon und untersuche diesen Button
          auf ein <code>aria-label</code>. <code>closable</code> steuert außerdem den Escape-Listener, den der innere Dialog
          bindet (<code>openng-optimus-ui-dialog.mjs:854</code>), also entfernt das Abschalten das Icon und die
          Escape-Taste zusammen.
        </p>

        <h3>Die Beschriftungen gehören dir, also binde sie reaktiv</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Das Kit-Muster: <code>TranslationService.translate()</code>, gelesen in einem <code>computed</code>, sodass das
          Computed vom Übersetzungsversions-Signal des Services abhängt und bei einem Sprachwechsel neu läuft. Eine
          <code>Confirmation</code> ist ein schlichtes Objekt, das einmal gelesen wird, wenn der Dialog sich öffnet, also müssen die Werte
          im Moment des Aufrufs aktuell sein — was ein Computed garantiert und ein beim Erzeugen festgehaltenes Feld nicht.
        </p>

        <h3>Länge und Richtung</h3>
        <p>{{ m.i18nLength }}</p>
        <p class="src-note">
          Das Stylesheet des Popups setzt weder eine Breite noch eine maximale Breite
          (<code>&#64;openng/optimus-ui-styles/dist/confirmpopup/index.mjs:2-13</code>), und der Pfeil wird
          mit <code>left</code> (<code>:52</code>) platziert, aus einem Wert, den die Komponente in Seitenkoordinaten misst
          (<code>openng-optimus-ui-confirmpopup.mjs:334-343</code>). Der Dialog rendert bei einem Sprachwechsel neu, weil er
          den Übersetzungs-Observer der Konfiguration abonniert
          (<code>openng-optimus-ui-confirmdialog.mjs:361-365</code>); das Popup abonniert ihn überhaupt nicht.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Nachricht und Icon des Confirm
            Dialogs sind über das Dialog-Panel geprüft (CONTRAST.MD <code>dialog</code>, 10,35 / 17,72:1),
            seine Buttons tragen den Kit-Ring; das Popup hat noch immer keine Zeile.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft:
            Alle Zeilenverweise halten (zwei korrigiert: die Klassen-Map ist <code>:17-23</code>, die Fokusfalle des Popups
            <code>:498</code>); ein Design-Abschnitt dazu, was der Stil ändert — der <code>.p-dialog</code>-Rahmen pro Stil,
            den der Confirm Dialog erbt, der stilabhängige Radius des Popups — und ein passender Stolperstein in der Doku.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Fassung, gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ConfirmdialogArticleDeComponent extends ConfirmdialogArticleComponent {
  override readonly emptyLog: string = 'Noch keine Antwort.';
  /** The base initializer copied the English emptyLog into the signal; start from the German one. */
  override readonly outcome = signal(this.emptyLog);

  override askDialog(): void {
    this.confirmationService.confirm({
      key: 'guideDemo',
      message: 'Der Entwurf „Notizen Woche 3“ wird entfernt. Das lässt sich nicht rückgängig machen.',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Entwurf löschen',
      rejectLabel: 'Entwurf behalten',
      acceptButtonProps: { severity: 'danger' },
      accept: () => this.outcome.set('accept() lief — der Dialog wurde bestätigt.'),
      reject: (type: ConfirmEventType) =>
        this.outcome.set(
          type === ConfirmEventType.CANCEL
            ? 'reject() lief mit CANCEL — Escape, das Schließen-Icon oder die Maske.'
            : 'reject() lief mit REJECT — der Ablehnen-Button.',
        ),
    });
  }

  override askUnnamed(): void {
    this.confirmationService.confirm({
      key: 'guideDemo',
      header: '',
      message: 'Derselbe Dialog, geöffnet ohne Header.',
      acceptLabel: 'Entwurf löschen',
      rejectLabel: 'Entwurf behalten',
      acceptButtonProps: { severity: 'danger' },
      accept: () => this.outcome.set('accept() lief — der unbenannte Dialog wurde bestätigt.'),
      reject: () => this.outcome.set('reject() lief — der unbenannte Dialog wurde abgelehnt.'),
    });
  }

  override askPopup(event: MouseEvent): void {
    this.confirmationService.confirm({
      key: 'guidePopup',
      target: event.currentTarget as EventTarget,
      message: 'Diesen Entwurf löschen?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Löschen',
      rejectLabel: 'Behalten',
      acceptButtonProps: { severity: 'danger' },
      accept: () => this.outcome.set('accept() lief — das Popup wurde bestätigt, der Fokus ging zurück an den Auslöser.'),
      reject: () => this.outcome.set('reject() lief ohne Argument — das Popup übergibt keines.'),
    });
  }

  override readonly m = {
    // examples — close paths
    pathAcceptD: 'accept() läuft, dann hide(ACCEPT).',
    pathAcceptP: 'accept() läuft, dann kehrt der Fokus zum Ziel zurück.',
    pathRejectD: 'reject(REJECT) läuft.',
    pathRejectP: 'reject() läuft ohne Argument, dann kehrt der Fokus zum Ziel zurück.',
    pathEscapeD: 'reject(CANCEL) läuft — derselbe Callback wie beim Button, ein anderes Argument.',
    pathEscapeP: 'reject() läuft, es sei denn, die Confirmation hat closeOnEscape auf false gesetzt.',
    pathMaskD: 'reject(CANCEL) läuft. Die Maske schließt nur, wenn dismissableMask gesetzt ist.',
    pathMaskP: 'Nichts läuft. Das Popup verschwindet, und keiner der Callbacks wird aufgerufen.',
    pathScrollD: 'Nichts: Der Dialog blockiert das Scrollen der Seite, statt sich zu schließen.',
    pathScrollP: 'Nichts läuft. Scrollen des Ziels oder eine Größenänderung des Fensters blendet es still aus.',
    pathCloseD: 'Nichts läuft. Der Dialog verschwindet, egal welchen Key er hat.',
    pathCloseP: 'Nichts läuft. Das Popup verschwindet, egal welchen Key es hat.',

    // usage — which surface
    whenUndo:
      'Eine Bestätigung kostet jeden Leser einen Schritt, um den seltenen vor einem Fehler zu bewahren; Rückgängig kostet nur den Leser, der den Fehler gemacht hat. Bevorzuge Rückgängig überall, wo sich die Operation umkehren lässt, und heb die Frage für das auf, was sich nicht umkehren lässt.',
    whenDialog:
      'Der Dialog ist modal, blockiert das Scrollen der Seite, und jeder seiner Ausgänge meldet sich zurück — ein Leser kann die Frage nicht verschwinden lassen, ohne dass eine Antwort festgehalten wird.',
    whenPopup:
      'Das Popup hält die Entscheidung neben der Sache, um die es geht, und gibt den Fokus danach an den Auslöser zurück. Der Preis ist, dass ein Klick woanders, ein Scrollen oder eine Größenänderung es ohne Antwort schließt.',
    whenDialogPlain:
      'Diese beiden Komponenten rendern eine Nachricht und zwei Buttons. Sobald der Leser etwas tippen, wählen oder erklären muss, ist die Oberfläche ein schlichter Dialog mit einem Formular darin.',
    whenMessage:
      'Eine Bestätigung ist eine Frage. Wenn es nichts zu entscheiden gibt, sagt eine Inline-Message oder ein Toast dasselbe, ohne den Leser als Geisel zu nehmen.',

    // usage — do/don't
    ddVerbBad:
      'Yes und No beantworten eine Frage, die der Leser sich aus der Nachricht erst zusammensetzen muss, und sie lesen sich bei einem Löschen genauso wie bei einem Veröffentlichen. Sie sind außerdem das, was du standardmäßig bekommst: Lass acceptLabel ungesetzt, und die Komponenten fallen auf die Konfiguration zurück, deren Werte genau diese beiden englischen Wörter sind.',
    ddVerbGood:
      'Der Bestätigen-Button nennt die Aktion, also funktioniert er auch für sich allein gelesen — und so wird ein Button mit einem Screenreader gelesen, der von einem fokussierbaren Element zum nächsten springt. Der Ablehnen-Button nennt die Alternative, statt die Frage zu verneinen, und die destruktive Severity legt das Gewicht auf die unumkehrbare Seite.',
    ddHeaderBad:
      'Der Dialog ist ein alertdialog, dessen zugänglicher Name auf einen leeren Span auflöst. Nichts sonst in der Komponente liefert einen: Es gibt kein aria-label-Input, das die Wurzel erreicht, und die Nachricht ist auch nicht als Beschreibung verknüpft.',
    ddHeaderGood:
      'Der Header wird zur ID, auf die aria-labelledby zeigt, also sagt der alertdialog an, worum es geht, sobald er den Fokus übernimmt. Das kostet eine Property in der Confirmation oder ein Input an der Instanz.',

    // design
    tokCdIconSize: 'Das Warn-Icon neben der Nachricht. Es ist in rem gesetzt, skaliert also mit der Root-Schriftgröße.',
    tokCdIconColor:
      'Dieselbe Farbe wie der Text des modalen Overlays, das heißt, das Icon wird nicht nach Severity eingefärbt: Ein Icon, das Bedeutung trägt, muss eine eigene Farbe bekommen.',
    tokCdGap: 'Der Abstand zwischen Icon und Nachricht im Dialog-Inhalt, der als Flex-Zeile angelegt ist.',
    tokCpBg: 'Das Popup malt den Popover-Hintergrund, statt die Seite zu erben, also hebt es sich von jeder Fläche ab.',
    tokCpGutter: 'Der Abstand zwischen dem Popup und dem Element, an dem es verankert ist, angewendet als oberer Margin.',
    tokCpArrow:
      'Wie weit rechts vom Rand des Popups der Pfeil beginnt. Die Regel addiert einen zweiten Wert dazu, den die Komponente beim Öffnen des Popups berechnet und in eine Custom Property schreibt, sodass der Pfeil dem Auslöser folgt — aber er zielt auf den linken Rand des Auslösers, nicht auf seine Mitte, also sitzt der Pfeil bei einem breiten Auslöser unter dessen linkem Ende.',
    tokCpIconSize: 'Das Popup-Icon ist kleiner als das des Dialogs, und das ist die visuelle Hälfte davon, dass die Oberflächen unterschiedlich viel Gewicht haben.',
    tokCpFooterGap: 'Der Abstand zwischen Ablehnen und Bestätigen im Footer des Popups, der rechtsbündig ist.',

    styleFrame:
      'Die beiden Oberflächen nehmen den visuellen Stil des Kits unterschiedlich an. Der Confirm Dialog rendert einen p-dialog, und jeder visuelle Stil gestaltet .p-dialog direkt um: Rahmen, Radius und Schatten kommen aus dem Stilblock, nicht aus den modalen Aura-Tokens — in werkbund ein Rahmen aus --style-bw in --style-outline, Radius 0 und eine um 8px versetzte Farbfläche; in blaupause ein 1px-Rahmen ohne Schatten; in lernwerkstatt und skizzenbuch ein abgerundeter Rahmen mit versetztem Schatten bzw. Papierschatten. Das Popup hat keine solche Regel: Sein Radius ist overlay.popover.border.radius, der auf die Radius-Skala des Stils border.radius.md auflöst (0 in werkbund, 12px in lernwerkstatt, 10px in skizzenbuch, 2px in blaupause), und Rahmen und Schatten bleiben die Popover-Werte von Aura.',

    contrastPara:
      'Beide Oberflächen rendern Text, also ist das Kriterium für die Nachricht SC 1.4.3 Contrast (Minimum) mit 4,5:1, nicht das 3:1 für große Schrift — keines der beiden Presets setzt eine Schriftgröße, also erbt die Nachricht den Fließtext. Wo das Icon Bedeutung trägt statt Dekoration, schuldet es SC 1.4.11 Non-text Contrast mit 3:1 gegen die Fläche dahinter, und diese Fläche ist der Overlay-Hintergrund, den die Komponente selbst malt, nicht die Seite. Für den Dialog hält das Gate beides, weil Nachricht und Icon die Textfarbe des Dialog-Panels nehmen (siehe unten); für das Popup gibt es kein gemessenes Paar, weil seine Farben Aura-Preset-Werte sind, die das Kompilat nicht aufführt. Sobald du eine dieser Farben mit dt überschreibst, wird die Prüfung zu deiner Aufgabe.',

    narrow:
      'Keine der beiden Komponenten hat ein eigenes responsives Verhalten, und die beiden scheitern unterschiedlich. Der Dialog nimmt seine Breite von p-dialog und bricht nur um, wenn du ihm eine breakpoints-Map gibst, die beim Init einmal in ein eingefügtes Style-Element kompiliert wird; ohne diese Map ist die Breite in jedem Viewport das, worauf der innere Dialog auflöst. Das Popup hat überhaupt keine Breitenregel, also ist es so breit, wie seine Nachricht es will, und kann mit einem langen Satz einen schmalen Viewport überschreiten; seine Position wird aus dem Auslöser berechnet, und bei einer Größenänderung des Fensters schließt es sich, statt sich neu zu platzieren, es sei denn, das Gerät meldet Touch-Unterstützung. Layout-Empfehlung: Gib dem Dialog für alles unter etwa 48rem eine breakpoints-Map, und halt die Nachricht des Popups auf einer kurzen Zeile, damit seine eigene Breite in ein Smartphone passt.',

    zIndex:
      'Die beiden Oberflächen liegen auf verschiedenen Ebenen des gemeinsamen Overlay-Stapels. Der Dialog steigt mit der Modal-Basis auf und bringt eine Maske mit; das Popup steigt mit der Overlay-Basis auf, derselben, die Menüs und andere verankerte Overlays nutzen. Was daraus für dich folgt: Ein Popup, das geöffnet wird, während ein Dialog offen ist, wird darunter gemalt, also gehört eine verankerte Bestätigung zur Seite, nicht zu einer modalen Oberfläche, die schon auf dem Bildschirm ist.',

    // development — dialog API
    apiKey: 'Wird mit dem Key der Confirmation verglichen. Auf beiden Seiten ungesetzt heißt: ungesetzt passt zu ungesetzt, also öffnet ein Aufruf ohne Key jede Instanz ohne Key.',
    apiContent:
      'Alle drei übergibst du meist besser in der Confirmation, weil das Objekt vor der Komponente befragt wird. Der Header ist das, was den Dialog benennt; die Nachricht wird als HTML gerendert.',
    apiLabels:
      'Fällt auf die Einträge accept und reject der Optimus-Konfiguration zurück, die standardmäßig Englisch sind. Übergib deine eigenen für alles, was ein Leser sieht.',
    apiVisible: 'Blendet den entsprechenden Button aus. Ohne Ablehnen-Button bleibt ein Dialog, dessen einzige Ausgänge Bestätigen, Escape und das Schließen-Icon sind.',
    apiClosable: 'Rendert das Schließen-Icon im Header. Es läuft über denselben Weg wie Escape, meldet also einen Abbruch — und der innere Dialog bindet seinen Escape-Listener nur, wenn dies eingeschaltet ist, also entfernt das Abschalten beide Ausgänge.',
    apiEscape: 'Escape schließt und meldet einen Abbruch über den reject-Callback. Das Abschalten entfernt einen Schließweg, den ein Tastaturnutzer erwartet.',
    apiMask: 'Bleibt ungesetzt, also schließt ein Klick auf die Maske standardmäßig nicht. Schalte es nur ein, wo ein Abbruch wirklich harmlos ist.',
    apiModal: 'Der Dialog ist modal und blockiert das Scrollen der Seite, solange er offen ist.',
    apiBreakpoints:
      'Eine Map von max-width auf Dialogbreite, kompiliert in ein Style-Element, das in den Head des Dokuments eingefügt wird. Sie wird aus onInit gebaut, also erzeugt eine spätere Änderung der Map sie nicht neu.',
    apiPosition: 'Standardmäßig mittig und am Header ziehbar — das wird an den inneren Dialog weitergereicht, anders als bei mehreren seiner Nachbarn.',
    apiAppendTo: 'Das Overlay wird standardmäßig an den Body gehängt, und das hält es aus einem abgeschnittenen oder transformierten Vorfahren heraus.',
    apiDefaultFocus:
      'Deklariert, dokumentiert und gelesen von einer Methode, die niemand aufruft. Es hat auf diese Komponente keine Wirkung; der Fokus landet dort, wo der innere Dialog ihn hinsetzt.',
    apiUnforwarded:
      'Alle drei sind am Confirm Dialog deklariert, und alle drei gibt es am inneren p-dialog, aber das Template bindet keines davon. Der innere Dialog läuft deshalb mit seinen eigenen Standardwerten, und die sind für die Fokusfalle zufällig eingeschaltet.',
    apiAriaLabels:
      'Drei Benennungs-Inputs, die nie gelesen werden. Die Buttons Bestätigen und Ablehnen nehmen ihr aria-label stattdessen aus dem ariaLabel des entsprechenden Button-Props-Objekts. Das Schließen-Icon nimmt gar nichts: Der innere Dialog benennt es aus seinem eigenen closeAriaLabel, das dieses Template nicht bindet, also wird das Icon ganz ohne zugänglichen Namen ausgeliefert.',
    apiInherited: 'Geerbte Signal-Inputs aus BaseComponent: Design-Tokens mit Geltungsbereich, Rendern ohne Styles und Pass-through-Attribute mit ihren Optionen.',

    deadInputs:
      'Sieben Inputs des Dialogs erreichen nie den Code, der sie lesen soll, und sie scheitern auf drei verschiedene Arten. defaultFocus wird gelesen — aber nur in einer Methode, die keine andere Zeile der Datei aufruft, und diese Methode sucht nach Elementklassen, die die Komponente nicht erzeugt, also würde sie selbst bei einem Aufruf nichts finden. focusTrap, rtl und transitionOptions werden im Wrapper ebenfalls nirgends gelesen: Sie beschreiben den inneren Dialog, der alle drei selbst hat, und das Template, das ihn instanziiert, bindet keines davon. closeAriaLabel, acceptAriaLabel und rejectAriaLabel werden deklariert und danach nie wieder erwähnt, und das ist die dritte Art — kein Leser und keine Weitergabe an eine Komponente, die einen hätte. Die Unterscheidung zählt beim Debuggen: ein toter Aufrufpfad, ein nicht weitergereichtes Input und eine Deklaration ganz ohne Leser.',

    // development — popup API
    cpKey: 'Dieselbe Vergleichsregel wie beim Dialog. Gib dem Popup einen eigenen Key, sobald im selben Baum ein Confirm Dialog existiert, sonst öffnet ein Aufruf beide.',
    cpDefaultFocus:
      'Hier wird es beachtet: Das Popup fokussiert den Bestätigen- oder den Ablehnen-Button, während das Overlay eingeblendet wird. Die Prüfung testet nur, ob der Wert gesetzt ist, und behandelt dann alles, was nicht accept ist, als reject — also fokussiert none den Ablehnen-Button statt nichts.',
    cpVisible: 'Ein optionales Signal-Input, das die interne Sichtbarkeit überschreibt. Ungesetzt steuert der Service sie.',
    cpAppendTo: 'Standardmäßig der Body. Das Popup wird absolut zum Ziel positioniert, also ändert ein Anhängen anderswo nur seinen umgebenden Block.',
    cpAutoZ: 'Registriert das Overlay im gemeinsamen Stapel unter der Overlay-Basis und entfernt es wieder, wenn der Container zerstört wird.',
    cpBaseZ: 'Deklariert und nie gelesen. Die Ebene kommt aus der Basis der Konfiguration, also kann dieses Input das Popup weder nach oben noch nach unten verschieben.',
    cpTransitions: 'Beide sind zugunsten von motionOptions als veraltet markiert, und keines wird irgendwo in der Komponente gelesen.',
    cpMotion: 'Wird über die Pass-through-Motion-Optionen gemischt und an die Motion-Direktive übergeben, die das Ein- und Ausblenden steuert.',
    cpStyle: 'Wird auf die Wurzel des Overlays angewendet. Nachricht, Icon und Button-Props reisen stattdessen alle in der Confirmation.',

    checkHeader: 'Jeder Confirm Dialog bekommt einen Header. Ohne ihn hat der alertdialog einen leeren zugänglichen Namen.',
    checkVerb: 'Der Bestätigen-Button nennt die Aktion. Yes und No sind die Standardwerte, keine Entscheidung.',
    checkFocus:
      'Nachdem ein Confirm Dialog sich geschlossen hat, setzt dein Code den Fokus zurück auf den Auslöser. Das Popup tut das bei Bestätigen und Ablehnen, aber nicht, wenn es still durch einen Klick daneben, eine Größenänderung oder ein Scrollen des Ziels geschlossen wird.',
    checkReject: 'Der reject-Callback läuft auch bei Abbrüchen. Lies sein Argument, und denk daran, dass das Popup keines übergibt.',
    checkHtml: 'Die Nachricht des Dialogs wird innerHTML zugewiesen. Setz sie nie aus etwas zusammen, das ein Nutzer beeinflussen kann.',
    checkKey: 'Zwei Instanzen in einem Baum heißt zwei Keys. Denk daran, dass close() Keys ignoriert und beide ausblendet.',

    // i18n
    i18nLibrary:
      'Die beiden Button-Beschriftungen sind die einzigen Texte, die diese Komponenten selbst liefern können, und sie kommen aus der Optimus-Konfiguration statt aus dem Kit. Alles andere — der Header, die Nachricht, die Icon-Klasse — gehört dir und wird in der Confirmation übergeben, in dem Moment, in dem du die Frage stellst.',
    i18nAcceptSrc: 'acceptLabel, dann acceptButtonProps.label, dann der Schlüssel accept der Optimus-Konfiguration.',
    i18nAcceptSwitch: 'Nur wenn du es übergibst. Der Standardwert der Konfiguration ist das englische Yes, und das Kit übersetzt diesen Schlüssel nicht.',
    i18nRejectSrc: 'rejectLabel, dann rejectButtonProps.label, dann der Schlüssel reject der Optimus-Konfiguration.',
    i18nRejectSwitch: 'Nur wenn du es übergibst. Der Standardwert der Konfiguration ist das englische No.',
    i18nBodySrc: 'Die Confirmation, die du für jeden Aufruf baust.',
    i18nBodySwitch: 'Ja, solange die Werte zum Zeitpunkt des Aufrufs aus einem Computed gelesen und nicht einmal festgehalten werden.',
    i18nCloseSrc:
      'Nirgends. Der innere Dialog benennt seinen Schließen-Button aus seinem Input closeAriaLabel, das der Confirm Dialog nie bindet, und der Confirm Dialog deklariert ein eigenes closeAriaLabel, das nichts liest.',
    i18nCloseSwitch:
      'Nein, weil es keinen Namen gibt, der wechseln könnte. Übergib closable: false, statt einen Icon-Button auszuliefern, den keine Sprache benennt — aber dieser Schalter nimmt Escape mit, also sind Bestätigen und Ablehnen dann der einzige Ausweg.',

    i18nLength:
      'Plane für das Popup, nicht für den Dialog. Der Dialog bricht innerhalb der Breite um, die er hat, und wächst nach unten, und das ist der gutmütige Fall. Das Popup hat keine eigene Breite, also verdoppelt eine Nachricht, die auf Deutsch oder Finnisch doppelt so lang wird, die Breite des Overlays. Halt das Popup bei einer kurzen Frage und setz die Details in die Seite. Die Schreibrichtung ist bei keinem der beiden Teil der Abmachung: Das Popup wird aus physischen Koordinaten platziert, und sein Pfeil wird mit left positioniert, sowohl in der Regel als auch in dem Wert, den die Komponente berechnet, also bekommt eine Seite von rechts nach links dieselbe Geometrie wie eine von links nach rechts.',
  };
}
