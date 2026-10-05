import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccordionArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './accordion-article.component';

/**
 * German twin of the Accordion guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs accordion`).
 */
@Component({
  selector: 'app-accordion-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'accordion'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Accordion ist eine Spalte aus Headern, von denen jeder einen Inhalt darunter öffnet. Alles hier unten ist
          die echte Optimus-UI-Komponente — die Composition-API, die das Ein-Element-<code>p-accordionTab</code>
          abgelöst hat: ein <code>p-accordion</code> mit <code>p-accordion-panel</code>-Elementen, jedes mit einem
          <code>p-accordion-header</code> und einem <code>p-accordion-content</code>.
        </p>

        <section class="pg" aria-label="Accordion-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>
              <label class="pg__row" for="pg-multiple">
                <p-toggleswitch
                  inputId="pg-multiple"
                  [ngModel]="pgMultiple()"
                  (ngModelChange)="onMultiple($event)"
                />
                <span>Mehrere Panels offen</span>
              </label>
              <label class="pg__row" for="pg-sof">
                <p-toggleswitch
                  inputId="pg-sof"
                  [ngModel]="pgSelectOnFocus()"
                  (ngModelChange)="pgSelectOnFocus.set($event)"
                />
                <span>Beim Fokus öffnen</span>
              </label>
              <label class="pg__row" for="pg-disabled">
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
                <span>Mittleres Panel deaktivieren</span>
              </label>
            </fieldset>

            <div class="pg__stage">
              <p-accordion
                [value]="pgValue()"
                [multiple]="pgMultiple()"
                [selectOnFocus]="pgSelectOnFocus()"
                (valueChange)="onPgValue($event)"
              >
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Was es kostet</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">Ein Pauschalpreis pro Anfrage, monatlich abgerechnet.</p>
                  </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="1" [disabled]="pgDisabled()">
                  <p-accordion-header>Wie schnell es ist</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">Etwa eine Sekunde bis zum ersten sichtbaren Ergebnis.</p>
                  </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="2">
                  <p-accordion-header>Wo die Daten liegen</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">In der Region, die du beim Anlegen des Workspace wählst.</p>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
          </div>
          <p class="pg__readout">
            <span class="pg__readout-label">value</span>
            <span class="pg__readout-value">{{ pgReadout() }}</span>
          </p>
          <p class="src-note">
            Die Anzeige ist die eigene <code>valueChange</code>-Payload der Komponente. Das Umschalten von „Mehrere
            Panels offen“ setzt sie zurück, weil sich der Typ des Inputs mit dem Modus ändert.
          </p>
        </section>

        <h3>Die gerenderte Anatomie</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Host-Bindings aus <code>openng-optimus-ui-accordion.mjs:298</code> (Header) und <code>:408</code> (Inhalt);
          die generierten IDs aus <code>:177</code>, <code>:183</code>, <code>:393</code> und <code>:395</code>.
        </p>

        <h3>Ein langes Label bei schmaler Breite</h3>
        <p>
          Der Header ist eine Flex-Zeile ohne <code>white-space</code>- und ohne <code>text-overflow</code>-Regel. Ein
          Label, das nicht passt, bricht also um, und der Header wird höher. Genau diese Eigenschaft macht das Accordion
          zum längentoleranten Geschwister einer Tab-Leiste.
        </p>
        <div class="ex__stage narrow">
          <p-accordion [value]="longValue()" (valueChange)="onLongValue($event)">
            <p-accordion-panel [value]="0">
              <p-accordion-header>
                Welche personenbezogenen Daten der Assistent nach dem Ende eines Gesprächs aufbewahrt
              </p-accordion-header>
              <p-accordion-content>
                <p class="panel-body">Nichts außer der Workspace-Kennung.</p>
              </p-accordion-content>
            </p-accordion-panel>
          </p-accordion>
        </div>
        <p class="src-note">
          Header-Regeln aus <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs:10-30</code> — der gesamte
          Deklarationsblock enthält keine Eigenschaft für Umbruch oder Abschneiden.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Das Accordion konkurriert mit drei anderen Steuerelementen, und die Wahl entscheidet eine einzige Frage: Was
          will der Leser mit den Abschnitten tun?
        </p>

        <h3>Welches Steuerelement</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Der Leser will …</th>
                <th>Steuerelement</th>
                <th>Warum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>mehrere Abschnitte vergleichen, überfliegen oder drucken</td>
                <td><code>p-accordion [multiple]</code></td>
                <td>Alle können gleichzeitig offen stehen, in Lesereihenfolge, in einer Spalte.</td>
              </tr>
              <tr>
                <td>eine Ansicht eines Themas nach der anderen ansehen</td>
                <td><code>p-tabs</code></td>
                <td>Eine Tablist beantwortet „welche Ansicht“ und hält genau ein Panel am Leben.</td>
              </tr>
              <tr>
                <td>Stufen in fester Reihenfolge durcharbeiten</td>
                <td><code>p-stepper</code></td>
                <td>Die Reihenfolge ist die Botschaft; ein Accordion drückt überhaupt keine Reihenfolge aus.</td>
              </tr>
              <tr>
                <td>sowieso alles lesen</td>
                <td>ein schlichter Stapel aus Überschriften</td>
                <td>Ein Aufklapper, den jeder öffnet, ist ein Klick zwischen dem Leser und dem Text.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Abgrenzung zu Tabs ist dieselbe, die der Tabs-Guide von der anderen Seite zieht; dass sich alles bis auf
          nichts schließen lässt, ist <code>updateValue</code>, <code>openng-optimus-ui-accordion.mjs:606-608</code>.
        </p>

        <h3>Der value-Vertrag, je Modus</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Modus</th>
                <th><code>value</code> enthält</th>
                <th>Nichts offen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard</td>
                <td>{{ m.singleValue }}</td>
                <td>{{ m.singleEmpty }}</td>
              </tr>
              <tr>
                <td><code>[multiple]="true"</code></td>
                <td>{{ m.multiValue }}</td>
                <td>{{ m.multiEmpty }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Beide Zweige von <code>updateValue</code>, <code>openng-optimus-ui-accordion.mjs:592-613</code>; der
          verworfene Skalar ist der <code>Array.isArray</code>-Guard bei <code>:595</code>.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Aufklapper um zwei kurze Sätze</span>
            <div class="dd__stage">
              <p-accordion [value]="ddTinyValue()" (valueChange)="onDdTiny($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Öffnungszeiten</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">Montag bis Freitag, 9 bis 17 Uhr.</p>
                  </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="1">
                  <p-accordion-header>Telefon</p-accordion-header>
                  <p-accordion-content>
                    <p class="panel-body">Der Empfang nimmt in dieser Zeit Anrufe an.</p>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              Zwei Fakten, die jeder braucht, hinter zwei Klicks und außer Reichweite der Suche auf der Seite —
              zugeklappte Inhalte werden mit <code>visibility</code> versteckt, nicht mit
              <code>hidden="until-found"</code>.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — stapel sie unter echten Überschriften</span>
            <div class="dd__stage">
              <h4 class="plain-head">Öffnungszeiten</h4>
              <p class="panel-body">Montag bis Freitag, 9 bis 17 Uhr.</p>
              <h4 class="plain-head">Telefon</h4>
              <p class="panel-body">Der Empfang nimmt in dieser Zeit Anrufe an.</p>
            </div>
            <p class="dd__why">
              Beide Fakten sind sichtbar, durchsuchbar und in der Gliederung des Dokuments — in die der
              Accordion-Header, ein Element mit <code>role="button"</code>, nie aufgenommen wird.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein ungeschütztes Textfeld in einem Panel</span>
            <div class="dd__stage">
              <p-accordion [value]="ddFieldBad()" (valueChange)="onDdFieldBad($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Notiz hinterlassen</p-accordion-header>
                  <p-accordion-content>
                    <label class="field-label" for="dd-bad-note">Notiz</label>
                    <textarea id="dd-bad-note" class="field" rows="2">Setz den Cursor hierher und drück die Pfeiltaste nach oben.</textarea>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              Die Wurzel des Accordions bricht jedes <kbd>&#8593;</kbd> <kbd>&#8595;</kbd> und jedes
              <kbd>Home</kbd> <kbd>End</kbd> ohne Umschalttaste ab, das bei ihr ankommt — der Cursor bewegt sich im Feld
              nicht mehr.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — stopp das Event am Inhalt</span>
            <div class="dd__stage">
              <p-accordion [value]="ddFieldGood()" (valueChange)="onDdFieldGood($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Notiz hinterlassen</p-accordion-header>
                  <p-accordion-content (keydown)="$event.stopPropagation()">
                    <label class="field-label" for="dd-good-note">Notiz</label>
                    <textarea id="dd-good-note" class="field" rows="2">Hier bewegt sich der Cursor ganz normal.</textarea>
                  </p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              Der Schutz kostet nichts — die eigene Tastenbehandlung des Headers sitzt über dem Inhalt und bleibt davon
              unberührt.
            </p>
          </div>
        </div>

        <p class="src-note">
          Die abgebrochenen Tasten stammen vom Wurzel-Handler bei <code>openng-optimus-ui-accordion.mjs:526</code>;
          seine <code>preventDefault</code>-Aufrufe bei <code>:549</code>, <code>:554</code>, <code>:559</code> und
          <code>:587</code> laufen auf jedem Pfad, auch auf denen, die nichts bewegen (Tab „Entwicklung“).
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Accordion pattern</a
            >
            — die Rollen, die Struktur „Überschrift umschließt Button“ und der Tastaturvertrag, an dem dieser Guide die
            Komponente prüft.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noopener noreferrer"
              >W3C — APG, Tabs pattern</a
            >
            — die Alternative, gegen die die Auswahltabelle abgrenzt: eine Ansicht zur Zeit, Pfeiltasten zwischen den
            Tabs.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — warum ein Header, dessen Zustand an Farbe und Chevron hängt, einen zweiten Träger braucht, der keine Farbe
            ist.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html" target="_blank" rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 2.1.1 Keyboard</a
            >
            — was die verschluckten Pfeil- und Home/End-Tasten der Wurzelebene für Felder in einem Panel aufs Spiel
            setzen.
          </li>
          <li>
            <a href="https://optimus.openng.org/accordion/" target="_blank" rel="noopener noreferrer"
              >Optimus UI — Accordion</a
            >
            — die API des Herstellers, hier gegen den ausgelieferten Quelltext von 2.0.2 geprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Accordion ist vollständig über Aura-Tokens gestaltet; dieses Kit liefert keine eigenen Accordion-Regeln
          mit. Was du siehst, ist also das Preset plus das Theme.
        </p>

        <h3>Die Aura-Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wert</th>
                <th>Was er färbt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>accordion.header.padding</code></td>
                <td>{{ m.headerPadding }}</td>
                <td>Die ganze Header-Zeile, an allen vier Seiten.</td>
              </tr>
              <tr>
                <td><code>accordion.header.fontWeight</code></td>
                <td>{{ m.headerWeight }}</td>
                <td>Das Label.</td>
              </tr>
              <tr>
                <td><code>accordion.header.color</code></td>
                <td>{{ m.headerColor }}</td>
                <td>Geschlossenes Label; Hover und geöffnet lösen beide zur normalen Textfarbe auf.</td>
              </tr>
              <tr>
                <td><code>accordion.header.background</code></td>
                <td>{{ m.headerBackground }}</td>
                <td>Geschlossen, Hover, geöffnet und geöffnet mit Hover — ein Wert, viermal.</td>
              </tr>
              <tr>
                <td><code>accordion.panel.borderWidth</code></td>
                <td>{{ m.panelBorder }}</td>
                <td>Ein unterer Rahmen pro Panel, der Trenner zwischen ihnen; kein Panel hat einen oberen Rahmen.</td>
              </tr>
              <tr>
                <td><code>accordion.content.padding</code></td>
                <td>{{ m.contentPadding }}</td>
                <td>Der Inhalt — ohne oberes Padding, er hängt also direkt unter seinem Header.</td>
              </tr>
              <tr>
                <td><code>accordion.header.focusRing</code></td>
                <td>{{ m.focusRing }}</td>
                <td>Der Tastatur-Ring, innerhalb der Header-Kante gezeichnet.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/accordion/index.mjs</code>, für den Fokus-Ring
          aufgelöst gegen <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>.
        </p>

        <h3>Der Fokus-Ring ist der eine Ring des Kits</h3>
        <p>
          Aura umrandet den Header mit seinem 1px-Basis-Ring bei Offset -1px. Das Kit ersetzt ihn durch den Ring, den
          jedes fokussierbare Optimus-Teil trägt: 2px <code>--primary-color-fg</code>, <em>innerhalb</em> des Headers
          gezeichnet (Offset -2px), weil der Header an das nächste Panel stößt. Auras Regel ist ein
          Nachfahren-Selektor, und die Kit-Regel greift allein am Header (<code>.p-accordionheader:focus-visible</code>),
          darum ist der Ring das eine Stück Header-Styling, das einen Überschriften-Wrapper übersteht. Innen trifft der
          Ring in jedem Zustand auf den eigenen <code>content.background</code> des Headers — dieselben Werte wie
          <code>dialog.background</code>, auf dem die „focus ring“-Zeilen von CONTRAST.MD den Kit-Ring über jeden Stil,
          Modus und Akzent mit {{ m.ringContrast }} messen.
        </p>
        <pre class="code-block"><code>{{ focusRuleSnippet }}</code></pre>
        <p class="src-note">
          Auras Regel aus <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs:52</code>; der Kit-Ring und
          seine Inset-Regel in <code>src/styles.scss</code> (die eine Ring-Liste, gemessen von
          <code>scripts/check-contrast.mjs</code>).
        </p>

        <h3>Acht Regeln, die an einem direkten Kind hängen</h3>
        <p>
          Wer <code>p-accordion-header</code> in eine Überschrift packt — was das APG-Pattern verlangt —, schiebt ihn
          eine Ebene tiefer und nimmt ihm stillschweigend sein Styling. Das sind die Regeln, die dann nicht mehr
          greifen:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Preset-Zeile</th>
                <th>Greift an</th>
                <th>Was verloren geht</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>:32, :38, :43</td>
                <td>erstes / letztes / letztes und geöffnetes Panel</td>
                <td>Die abgerundeten Ecken oben und unten am ganzen Stapel.</td>
              </tr>
              <tr>
                <td>:58</td>
                <td>geschlossen, aktiviert, mit Hover</td>
                <td>Hover-Hintergrund und Label-Farbe — die Hover-Farbe des Chevrons (<code>:63</code>) bleibt.</td>
              </tr>
              <tr>
                <td>:67, :72, :76, :81</td>
                <td>geöffnetes Panel und geöffnet mit Hover</td>
                <td>Der geöffnete Zustand komplett — Label-Farbe und Chevron-Farbe.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selektorliste gelesen aus <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs</code>; jede der acht
          ist als <code>… &gt; .p-accordionheader</code> geschrieben. Zwei Header-Regeln sind als Nachfahren geschrieben
          und überstehen einen Wrapper: der Fokus-Ring bei <code>:52</code> und der Chevron-Hover bei <code>:63</code>.
        </p>

        <h3>Kontrast</h3>
        <p>
          Ohne Anpassung ist der Inhalt Auras <code>accordion.content.color</code> (<code>&#123;text.color&#125;</code>)
          auf <code>accordion.content.background</code> (<code>&#123;content.background&#125;</code>) — Auras
          generisches Panel-Paar, das das Gate als „content panel“-Zeile von CONTRAST.MD misst
          (<code>text.color</code> auf <code>content.background</code>, {{ m.panelContrast }}). Der geschlossene Header
          ist Auras gedämpfte Farbe auf demselben Hintergrund, die keine Zeile misst — prüf sie pro Theme, wenn du sie
          umgestaltest.
        </p>
        <p>
          <em>Falls</em> du den Inhalt stattdessen auf den Kit-Token setzt — wie diese Seite es tut, indem sie
          <code>p &#123; color: var(--text-color) &#125;</code> über ihre eigenen Demos legt —, misst das Paar
          <code>--text-color</code> auf <code>--surface-card</code> im Standardstil <code>werkbund</code>
          <strong>{{ m.contrastLight }}</strong> hell und <strong>{{ m.contrastDark }}</strong> dunkel, beide klar über
          den 4,5:1, die SC 1.4.3 verlangt; die anderen Stile stehen daneben.
        </p>
        <p class="src-note">
          Aura-Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/accordion/index.mjs</code>. Das Kit mischt zur
          Laufzeit nur die <code>presetOverrides</code> (Radien) des aktiven visuellen Stils und die Akzent-Rampe in
          Aura (<code>definePreset</code> in <code>src/app/services/theme.service.ts</code>), und
          <code>styles.scss</code> hat keinen <code>--p-accordion-*</code>-Override. Die Verhältnisse der Token-Paare
          sind die „body text“-Zeilen von <code>docs/generated/CONTRAST.MD</code>, die bei jedem Build aus den echten
          Token-Werten neu erzeugt wird.
        </p>

        <h3>Schmale Bildschirme</h3>
        <p>
          <strong>Kein eingebautes responsives Verhalten, und keins nötig.</strong> Das Preset enthält keine Media Query,
          und die Komponente nimmt keinen Breakpoint-Input; das Panel ist eine Flex-Box in Spaltenrichtung, die bei
          jedem Viewport ihren Container füllt, und der Header ist eine Flex-Zeile, deren Label umbricht. Bei 360px wird
          das Steuerelement höher, nie breiter — und genau das ist der ganze Grund, es dort einer Tab-Leiste
          vorzuziehen. Für das Layout: Gib ihm ein Flex-Elternelement mit <code>min-width: 0</code> und plane auf jeder
          Seite {{ m.headerPadding }} Header-Padding ein, bevor dein Label beginnt.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs und Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>An</th>
                <th>Hinweise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td><code>p-accordion</code>, <code>p-accordion-panel</code></td>
                <td>Auf beiden ein <code>model()</code>. Der Wert des Panels landet in der DOM-ID.</td>
              </tr>
              <tr>
                <td><code>[multiple]</code></td>
                <td><code>p-accordion</code></td>
                <td>Ändert den Typ von <code>value</code> zu einem Array.</td>
              </tr>
              <tr>
                <td><code>[selectOnFocus]</code></td>
                <td><code>p-accordion</code></td>
                <td>Standardmäßig aus: Pfeiltasten bewegen den Fokus, ohne etwas zu öffnen.</td>
              </tr>
              <tr>
                <td><code>[disabled]</code></td>
                <td><code>p-accordion-panel</code></td>
                <td>Nimmt den Header aus der Tab-Reihenfolge und aus der Navigation per Pfeiltasten.</td>
              </tr>
              <tr>
                <td><code>expandIcon</code> / <code>collapseIcon</code></td>
                <td><code>p-accordion</code></td>
                <td>Klassennamen für einen Ersatz-Chevron; ein <code>#toggleicon</code>-Template gewinnt über beide.</td>
              </tr>
              <tr>
                <td><code>styleClass</code>, <code>transitionOptions</code></td>
                <td><code>p-accordion</code></td>
                <td>Veraltet seit v20.0.0 und v21.0.0 — nimm <code>class</code> und <code>motionOptions</code>.</td>
              </tr>
              <tr>
                <td><code>valueChange</code></td>
                <td><code>p-accordion</code></td>
                <td>Der eine Output, der jede Änderung mitbekommt.</td>
              </tr>
              <tr>
                <td><code>onOpen</code> / <code>onClose</code></td>
                <td><code>p-accordion</code></td>
                <td>{{ m.openCloseScope }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarationen aus <code>openng-optimus-ui-accordion.mjs:462-524</code> und <code>:126-142</code>; die
          Auslösung nur bei Klick aus <code>:196-211</code>.
        </p>

        <h3>Die Tastaturebene an der Wurzel tut nichts außer abbrechen</h3>
        <p>
          Zwei Handler hören auf Pfeiltasten. Der eigene des Headers funktioniert und ist der, den du spürst. Die Wurzel
          des Accordions führt eine zweite Kopie aus, die ihre Ziele über ein Attribut sucht, das die Komponenten nicht
          ausgeben — sie findet also nichts, bewegt nichts und bricht die Taste trotzdem ab.
        </p>
        <pre class="code-block"><code>{{ deadLookupSnippet }}</code></pre>
        <p class="src-note">
          Abfrage aus <code>openng-optimus-ui-accordion.mjs:566-582</code>; die ausgegebenen Attribute aus
          <code>openng-optimus-ui-basecomponent.mjs:355</code> und <code>:359</code>. Der Header-Host trägt
          <code>data-pc-name="accordionheader"</code> <em>und</em> <code>data-pc-section="root"</code>: Jedes
          <code>ptm</code>-Element bekommt ein <code>data-pc-section</code> mit seinem eigenen Section-Key
          (<code>:359</code>), während <code>:355</code> ein zweiter, unabhängiger Mechanismus ist, unter dem ein
          durchgereichtes <code>data-pc-section</code> das <code>data-pc-name</code> umbenennt. Kein Element trägt
          irgendwo <code>data-pc-section="accordionheader"</code>.
        </p>
        <p>
          Die Folge ist kein kaputtes Accordion, sondern ein kaputtes Panel: Alles im Inhalt, das
          <kbd>&#8593;</kbd> <kbd>&#8595;</kbd> <kbd>Home</kbd> <kbd>End</kbd> selbst nutzt — ein Textfeld, eine
          Listbox, ein Scroll-Container —, verliert diese Tasten. Schütz den Inhalt, wie im zweiten Paar im Tab
          „Verwendung“.
        </p>

        <h3>Nichts ist lazy, und nichts wird ausgehängt</h3>
        <p>
          Anders als <code>p-tabs</code> hat das Accordion überhaupt keinen <code>lazy</code>-Input. Jeder Inhalt wird
          mit der Seite gebaut, landet im vorgerenderten HTML und bleibt im DOM, wenn sich das Panel schließt.
        </p>
        <pre class="code-block"><code>{{ motionSnippet }}</code></pre>
        <p class="src-note">
          Template aus <code>openng-optimus-ui-accordion.mjs:409-416</code>; die angewandten Styles aus
          <code>openng-optimus-ui-motion.mjs:26-29</code>. <code>p-motion</code> setzt diese Versteck-Styles in einem
          <code>effect</code> beim ersten Mounten (<code>openng-optimus-ui-motion.mjs:328-333</code>), nicht in einem
          Lifecycle-Hook, der nur im Browser läuft.
        </p>
        <ul>
          <li>Gut für Inhalte: Alles steht im vorgerenderten HTML und ist ohne Klick indexierbar.</li>
          <li>
            Teuer für Widgets: Pack einen aufwendigen Inhalt in dein eigenes <code>&#64;if</code> auf den Wert des
            Accordions, dann wird er gebaut, wenn sich das Panel zum ersten Mal öffnet.
          </li>
          <li>
            <code>visibility: hidden</code> nimmt einen geschlossenen Inhalt aus der Tab-Reihenfolge und aus dem
            Accessibility Tree — aber auch aus der Suche des Browsers auf der Seite.
          </li>
        </ul>

        <h3>Verdrahten</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>Panel-Werte sind kurz, stabil und unübersetzt — sie sind DOM-IDs.</li>
          <li><code>value</code> passt zum Modus: ein Array unter <code>[multiple]</code>, sonst ein Skalar.</li>
          <li>Jedes Panel mit einem Feld, einem Scroller oder eigenen Pfeiltasten stoppt <code>keydown</code>.</li>
          <li>Der Zustand kommt aus <code>valueChange</code>, nicht aus <code>onOpen</code> / <code>onClose</code>.</li>
          <li>Die Überschriften-Frage ist bewusst beantwortet, nicht per Voreinstellung.</li>
          <li>Ein aufwendiger Inhalt steht hinter deinem eigenen <code>&#64;if</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Das Accordion ist die seltene Optimus-Komponente, die selbst nichts zu übersetzen hat: Das Bundle verweist
          überhaupt nicht auf die Übersetzungskonfiguration. Jedes Wort, das ein Nutzer liest, ist ein Wort, das du
          hineinprojiziert hast.
        </p>

        <h3>Was woher kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sichtbares Element</th>
                <th>Quelle</th>
                <th>Folge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Header-Label</td>
                <td>dein projizierter Inhalt</td>
                <td>Bau es in einem <code>computed()</code>, damit es sich beim Sprachwechsel neu aufbaut.</td>
              </tr>
              <tr>
                <td>Inhalt</td>
                <td>dein projizierter Inhalt</td>
                <td>Steht in jeder Sprachvariante der vorgerenderten Seite.</td>
              </tr>
              <tr>
                <td>Chevron</td>
                <td>die Bibliothek</td>
                <td>{{ m.iconNaming }}</td>
              </tr>
              <tr>
                <td>Panel-<code>value</code></td>
                <td>dein Code</td>
                <td>Übersetz ihn nie — er ist die Hälfte von zwei DOM-IDs.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gemessen über <code>openng-optimus-ui-accordion.mjs</code>: null Vorkommen von <code>translation</code>,
          und beide Chevron-Zweige tragen <code>aria-hidden="true"</code> (<code>:304-316</code>).
        </p>

        <h3>Länge und Richtung</h3>
        <ul>
          <li>
            Eine Übersetzung, die länger ausfällt, bricht den Header um, statt ihn abzuschneiden — die Eigenschaft, die
            ein Accordion für eine Sprache, die du nicht gemessen hast, sicherer macht als eine Tab-Leiste.
          </li>
          <li>
            Die Eckradien sind als logische Eigenschaften geschrieben
            (<code>border-start-start-radius</code>, <code>border-end-end-radius</code>), die abgerundeten Ecken folgen
            also <code>dir="rtl"</code>, ohne dass du etwas tun musst.
          </li>
          <li>
            Der Chevron zeigt geschlossen nach unten und geöffnet nach oben — eine Richtung, die keine Sprache trägt und
            darum keine Spiegelung braucht.
          </li>
        </ul>
        <p class="src-note">
          Radien aus <code>&#64;openng/optimus-ui-styles/dist/accordion/index.mjs:34-40</code>; die beiden Chevrons aus
          <code>openng-optimus-ui-accordion.mjs:304-316</code>.
        </p>

        <h3>Das reaktive Label</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate()</code> in <code>src/app/services/translation.service.ts</code> ist der
          Lookup des Kits, und er liest <code>translationsVersion()</code> — das sorgt dafür, dass ein
          <code>computed()</code> darum neu ausgewertet wird, sobald eine Sprachdatei ankommt.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.3</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Header trägt den
            einen 2px-Ring des Kits innerhalb seiner Kante (CONTRAST.MD „focus ring“); das Paar für den Inhalt ist jetzt
            eine geprüfte „content panel“-Zeile.
          </li>
          <li>
            <strong>v0.2</strong> — 23.09.2026 — Die Verhältnisse für Fließtext auf die CONTRAST.MD-Zeilen des
            visuellen Standardstils aktualisiert (18,73:1 / 14,86:1; die alten Zahlen stammten aus der Zeit vor
            ADR-0016); den Hinweis „Aura unverändert“ korrigiert (die Radien des Stils und die Akzent-Rampe werden zur
            Laufzeit eingemischt); kommentierte Quellen als Abschluss des Tabs „Verwendung“ ergänzt.
          </li>
          <li>
            <strong>v0.1</strong> — 05.09.2026 — Erste Fassung des Guides, gemessen an Optimus UI 2.0.2.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class AccordionArticleDeComponent extends AccordionArticleComponent {
  /** The measured values of the English article, with the prose around them in German. */
  override readonly m = {
    singleValue: 'ein Panel-Wert oder undefined',
    singleEmpty: 'ja — ein Klick auf den offenen Header schreibt undefined',
    multiValue: 'ein Array aus Panel-Werten',
    multiEmpty: 'ja — das Array leert sich',
    headerPadding: '1.125rem',
    headerWeight: '600',
    headerColor: 'text.muted.color, bei Hover und im geöffneten Zustand text.color',
    headerBackground: 'content.background',
    panelBorder: '0 0 1px 0',
    contentPadding: '0 1.125rem 1.125rem 1.125rem',
    focusRing: 'Aura: focus.ring.width (1px) bei Offset -1px — das Kit ersetzt ihn: 2px --primary-color-fg bei -2px',
    ringContrast: '5,18–17,85:1 (SC 1.4.11 verlangt 3:1)',
    panelContrast: '10,35–17,72:1 über alle Stile und Modi',
    contrastLight: '18,73:1',
    contrastDark: '14,86:1',
    openCloseScope: 'Nur bei Klick — ein Umschalten per Tastatur und ein Schreiben aus dem Code lösen keines von beiden aus.',
    iconNaming: 'Beide Chevrons sind aria-hidden, das Icon benennt also in keiner Sprache etwas.',
  };
}
