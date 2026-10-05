import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TooltipArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './tooltip-article.component';

/**
 * German twin of the Tooltip guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs tooltip`).
 */
@Component({
  selector: 'app-tooltip-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tooltip'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Tooltip ist eine Direktive, keine Komponente: Du setzt <code>pTooltip</code> auf ein Element, das du schon
          hast, und die Direktive baut in dem Moment, in dem der Tooltip erscheint, einen losgelösten Knoten und löscht
          ihn wieder, wenn er verschwindet. Diese eine Design-Entscheidung erklärt das meiste, was folgt — der Knoten
          steht nie in deinem Template, und nichts im Markup, das du geschrieben hast, zeigt auf ihn.
        </p>

        <h3>Der Standard: Hover, nach rechts</h3>
        <div class="stage stage--row">
          <p-button label="Speichern" severity="secondary" pTooltip="Schreibt den Entwurf auf den Server" />
          <p-button label="Standardmäßig rechts" severity="secondary" pTooltip="Kein tooltipPosition gesetzt" />
        </div>
        <p class="src-note">
          Zwei Live-Instanzen. <code>tooltipPosition</code> ist standardmäßig <code>right</code>
          (<code>openng-optimus-ui-tooltip.mjs:170</code>) und <code>tooltipEvent</code> standardmäßig
          <code>hover</code> (<code>:71</code>, <code>:171</code>).
        </p>

        <h3>Nur Hover, gegenüber Hover und Fokus</h3>
        <div class="stage stage--row">
          <p-button label="Nur Hover (Standard)" severity="secondary" pTooltip="An den Zeiger gebunden, nicht an den Fokus" />
          <p-button
            label="Hover und Fokus"
            severity="secondary"
            tooltipEvent="both"
            tooltipPosition="bottom"
            pTooltip="Auch an den Fokus gebunden"
          />
        </div>
        <p class="src-note">
          Der Hover-Zweig bindet <code>mouseenter</code>, <code>click</code>, <code>mouseleave</code>,
          <code>touchstart</code> und <code>touchend</code> (<code>openng-optimus-ui-tooltip.mjs:249-261</code>);
          <code>focus</code> und <code>blur</code> werden nur gebunden, wenn <code>tooltipEvent</code>
          <code>focus</code> oder <code>both</code> ist (<code>:262-271</code>). Prüf es allein mit der Tastatur: Geh
          mit Tab auf jeden der beiden Buttons und achte darauf, welcher eine Blase zeigt.
        </p>

        <h3>Position, und was am Rand passiert</h3>
        <div class="stage stage--row">
          <p-button label="top" severity="secondary" tooltipPosition="top" pTooltip="Über dem Auslöser" />
          <p-button label="bottom" severity="secondary" tooltipPosition="bottom" pTooltip="Unter dem Auslöser" />
          <p-button label="left" severity="secondary" tooltipPosition="left" pTooltip="Links vom Auslöser" />
          <p-button label="right" severity="secondary" tooltipPosition="right" pTooltip="Rechts vom Auslöser" />
        </div>
        <p class="src-note">
          Jede Position hat eine Ausweichkette — <code>top</code> versucht oben, unten, rechts, links
          (<code>openng-optimus-ui-tooltip.mjs:568-573</code>). Der nächste Kandidat kommt nur zum Zug, solange der
          platzierte Knoten noch außerhalb des Viewports liegt (<code>:575-582</code>, Grenztest in
          <code>:673-681</code>), und die Platzierung endet beim ersten Kandidaten, der passt.
        </p>

        <h3>Langer Text, und wie der Knoten aussieht</h3>
        <div class="stage stage--row">
          <p-button
            label="Ein langer Hinweis"
            severity="secondary"
            tooltipPosition="bottom"
            pTooltip="Tooltips sind auf 12.5rem begrenzt und brechen um; sie wachsen nicht mit, um einen so langen Satz aufzunehmen."
          />
        </div>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Struktur aus <code>openng-optimus-ui-tooltip.mjs:473-505</code>: ein Root-Div mit einer Klasse aus
          <code>preAlign</code> (<code>:668-672</code>), ein Pfeil-Div, ein Text-Div. Neben der Klasse und den
          <code>data-pc-section</code>-Markierungen schreibt die Direktive ein einziges Attribut,
          <code>role="tooltip"</code> (<code>:479</code>). Jede Deklaration im <code>style</code> wird aus JavaScript
          geschrieben: <code>width</code> und <code>pointer-events</code> in <code>create()</code>
          (<code>:495-504</code>), <code>display</code> in <code>show()</code> (<code>:534</code>), <code>left</code>
          und <code>top</code> in <code>alignTooltip()</code> (<code>:652-657</code>), <code>opacity</code>, das die
          Einblendung von null anhebt (<code>:537</code>), und <code>z-index</code> durch die Registrierung im Stapel
          (<code>:538-539</code>) — die 1102 oben ergibt ein leerer Stapel, Basis plus zwei
          (<code>openng-optimus-ui-utils.mjs:284-289</code>). Der Textknoten hält den Tooltip-Text des Auslösers, oben
          gekürzt, nicht sein Label. Breite und Umbruch aus
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs:5</code> und <code>:19-20</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche Fläche für welche Erklärung</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Was du zu sagen hast</th><th>Greif zu</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Der Name eines Bedienelements, das nur ein Icon hat</td>
                <td><code>aria-label</code> plus <code>pTooltip</code></td>
                <td>{{ m.whenIconName }}</td>
              </tr>
              <tr>
                <td>Eine kurze Wiederholung, nett zu haben, gefahrlos zu verpassen</td>
                <td><code>pTooltip</code></td>
                <td>{{ m.whenHint }}</td>
              </tr>
              <tr>
                <td>Information, ohne die sich die Aufgabe nicht erledigen lässt</td>
                <td>sichtbarer Text</td>
                <td>{{ m.whenEssential }}</td>
              </tr>
              <tr>
                <td>Ein oder zwei Sätze Hilfe neben einem Bedienelement</td>
                <td>eine Fläche, die sich per Klick oder Fokus öffnet</td>
                <td>{{ m.whenHelp }}</td>
              </tr>
              <tr>
                <td>Alles mit einem Link, einem Button oder einem Feld darin</td>
                <td><code>p-popover</code></td>
                <td>{{ m.whenInteractive }}</td>
              </tr>
              <tr>
                <td>Eine Validierungsmeldung für ein Feld</td>
                <td>Inline-Meldung, verknüpft über <code>aria-describedby</code></td>
                <td>{{ m.whenError }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Trennlinie ist, was den Accessibility Tree erreicht: Der Tooltip-Knoten trägt
          <code>role="tooltip"</code> und überhaupt keine Verknüpfung (<code>openng-optimus-ui-tooltip.mjs:479</code>),
          und er existiert im DOM nur, solange er angezeigt wird (<code>:473-505</code> erzeugt ihn,
          <code>:734-750</code> entfernt ihn).
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — der Tooltip als einziger Name des Buttons</span>
            <div class="dd__stage">
              <button type="button" class="icon-btn" pTooltip="Löschen" tooltipPosition="bottom">
                <i class="pi pi-trash" aria-hidden="true"></i>
              </button>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein aria-label, mit dem Tooltip daneben</span>
            <div class="dd__stage">
              <button
                type="button"
                class="icon-btn"
                aria-label="Löschen"
                pTooltip="Löschen"
                tooltipEvent="both"
                tooltipPosition="bottom"
              >
                <i class="pi pi-trash" aria-hidden="true"></i>
              </button>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Buttons sind live und tragen denselben Tooltip-Text; nur der rechte trägt ein
          <code>aria-label</code>. Nichts verbindet einen Tooltip-Knoten mit seinem Auslöser: Die Direktive schreibt
          <code>role="tooltip"</code> (<code>openng-optimus-ui-tooltip.mjs:479</code>) und kein
          <code>aria-describedby</code>, keine <code>id</code> und keinen <code>title</code> — keines der drei kommt
          irgendwo in der Datei vor. Prüf es im Accessibility Tree des Browsers: Der Name des linken Buttons muss leer
          herauskommen.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Hinweis, den man nicht in Ruhe lesen kann</span>
            <div class="dd__stage">
              <p-button
                label="Exportieren"
                severity="secondary"
                pTooltip="CSV, durch Semikolon getrennt, eine Zeile pro Teilnehmer, UTF-8 mit BOM für Tabellen-Importe."
              />
            </div>
            <p class="dd__why">{{ m.ddHoverBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — erreichbar, und er übersteht den Weg</span>
            <div class="dd__stage">
              <p-button
                label="Exportieren"
                severity="secondary"
                tooltipEvent="both"
                [autoHide]="false"
                tooltipPosition="bottom"
                pTooltip="Exportiert CSV. Das Format ist unter der Tabelle beschrieben."
              />
            </div>
            <p class="dd__why">{{ m.ddHoverGood }}</p>
          </div>
        </div>
        <p class="src-note">
          <code>autoHide</code> ist standardmäßig <code>true</code> und setzt dann
          <code>pointer-events: none</code> auf den Knoten (<code>openng-optimus-ui-tooltip.mjs:121</code>,
          <code>:498-500</code>); <code>false</code> hebt das auf und bindet einen <code>mouseleave</code>-Listener am
          Knoten selbst (<code>:501-504</code>), während der Verlassen-Handler des Auslösers eine Bewegung auf die Blase
          als „noch drin“ behandelt (<code>:378-381</code>).
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          Die beiden Aliase sind die, über die Leute stolpern: <code>content</code> ist als <code>pTooltip</code>
          freigegeben (<code>openng-optimus-ui-tooltip.mjs:831-833</code>) und <code>disabled</code> als
          <code>tooltipDisabled</code> (<code>:834-836</code>).
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Tooltip-Token</th><th>Aura-Wert</th><th>Was er tut</th></tr>
            </thead>
            <tbody>
              <tr><td><code>tooltip.max.width</code></td><td><code>12.5rem</code></td><td>{{ m.tokMaxWidth }}</td></tr>
              <tr><td><code>tooltip.gutter</code></td><td><code>0.25rem</code></td><td>{{ m.tokGutter }}</td></tr>
              <tr>
                <td><code>tooltip.padding</code></td>
                <td><code>0.5rem 0.75rem</code></td>
                <td>{{ m.tokPadding }}</td>
              </tr>
              <tr>
                <td><code>tooltip.background</code></td>
                <td><code>&#123;surface.700&#125;</code></td>
                <td>{{ m.tokBackground }}</td>
              </tr>
              <tr>
                <td><code>tooltip.color</code></td>
                <td><code>&#123;surface.0&#125;</code></td>
                <td>{{ m.tokColor }}</td>
              </tr>
              <tr>
                <td><code>tooltip.shadow</code></td>
                <td><code>&#123;overlay.popover.shadow&#125;</code></td>
                <td>{{ m.tokShadow }}</td>
              </tr>
              <tr>
                <td><code>tooltip.border.radius</code></td>
                <td><code>&#123;overlay.popover.border.radius&#125;</code></td>
                <td>{{ m.tokRadius }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus den Exporten <code>root</code> und <code>colorScheme</code> von
          <code>&#64;openng/optimus-ui-themes/dist/aura/tooltip/index.mjs</code>, einem einzeiligen Dist-Bundle. Die
          Regeln, die sie verbrauchen, sind
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs:5</code>, <code>:10-16</code>,
          <code>:18-26</code> und die vier Pfeil-Regeln in <code>:36-60</code>, die den Pfeil aus denselben Gutter- und
          Hintergrund-Werten zeichnen. Die Radius-Skala pro Stil ist
          <code>presetOverrides.primitive.borderRadius</code> in <code>src/app/services/ui-styles.ts</code>.
        </p>

        <h3>Kontrast: welches Kriterium gilt</h3>
        <p>{{ m.contrastPara }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> führt in keinem seiner vier Blöcke für die visuellen Stile
          (werkbund, lernwerkstatt, skizzenbuch, blaupause) eine Tooltip-Zeile, in keinem der beiden Modi: Das Kompilat
          misst die eigenen Token des Kits, und die Blase malt aus dem Aura-Preset. Die Hex-Werte sind die Auflösungen
          von <code>&#123;surface.700&#125;</code> und <code>&#123;surface.0&#125;</code> in den hellen und dunklen
          <code>colorScheme</code>-Blöcken von <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>.
        </p>

        <h3>Schmaler Viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs</code> enthält keine Media Query und keine
          Container Query; die Grenze ist <code>max-width</code> in <code>:5</code>, und der Umbruch ist
          <code>white-space: pre-line</code> und <code>word-break: break-word</code> in <code>:19-20</code>. Der
          Resize-Handler blendet aus, statt neu zu platzieren (<code>openng-optimus-ui-tooltip.mjs:682-684</code>), und
          der Scroll-Handler tut dasselbe (<code>:697-706</code>).
        </p>

        <h3>Wo er im Stapel sitzt</h3>
        <p>{{ m.zIndex }}</p>
        <p class="src-note">
          <code>tooltipZIndex</code> ist standardmäßig <code>auto</code>
          (<code>openng-optimus-ui-tooltip.mjs:175</code>), was über
          <code>ZIndexUtils.set('tooltip', …, config.zIndex.tooltip)</code> läuft (<code>:538-539</code>). Der
          Basiswert ist <code>1100</code> in <code>openng-optimus-ui-config.mjs:239</code> — dieselbe Basis wie
          <code>modal</code> in <code>:236</code> —, und die tatsächlich geschriebene Zahl wird aus dem letzten Eintrag
          im gemeinsamen Stapel abgeleitet, in <code>openng-optimus-ui-utils.mjs:284-289</code>. Die Direktive hat
          außerdem einen Sonderfall für einen Auslöser in <code>p-dialog</code>, der Anzeige und Platzierung aufschiebt
          (<code>:526-532</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Werte</th><th>Standard</th><th>Anmerkung</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>pTooltip</code></td>
                <td>string · TemplateRef</td>
                <td>—</td>
                <td>{{ m.apiContent }}</td>
              </tr>
              <tr>
                <td><code>tooltipPosition</code></td>
                <td><code>right</code> · <code>left</code> · <code>top</code> · <code>bottom</code></td>
                <td><code>right</code></td>
                <td>{{ m.apiPosition }}</td>
              </tr>
              <tr>
                <td><code>tooltipEvent</code></td>
                <td><code>hover</code> · <code>focus</code> · <code>both</code></td>
                <td><code>hover</code></td>
                <td>{{ m.apiEvent }}</td>
              </tr>
              <tr>
                <td><code>tooltipDisabled</code></td>
                <td>boolean</td>
                <td>—</td>
                <td>{{ m.apiDisabled }}</td>
              </tr>
              <tr>
                <td><code>autoHide</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiAutoHide }}</td>
              </tr>
              <tr>
                <td><code>hideOnEscape</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiEscapeKey }}</td>
              </tr>
              <tr>
                <td><code>escape</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiEscape }}</td>
              </tr>
              <tr>
                <td><code>showDelay</code> · <code>hideDelay</code> · <code>life</code></td>
                <td>number (ms)</td>
                <td>—</td>
                <td>{{ m.apiDelays }}</td>
              </tr>
              <tr>
                <td><code>showOnEllipsis</code></td>
                <td>boolean</td>
                <td><code>false</code></td>
                <td>{{ m.apiEllipsis }}</td>
              </tr>
              <tr>
                <td><code>fitContent</code></td>
                <td>boolean</td>
                <td><code>true</code></td>
                <td>{{ m.apiFitContent }}</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td><code>body</code> · <code>target</code> · Element</td>
                <td><code>body</code></td>
                <td>{{ m.apiAppendTo }}</td>
              </tr>
              <tr>
                <td><code>positionTop</code> · <code>positionLeft</code></td>
                <td>number (px)</td>
                <td>—</td>
                <td>{{ m.apiOffsets }}</td>
              </tr>
              <tr>
                <td><code>tooltipStyleClass</code> · <code>tooltipZIndex</code> · <code>positionStyle</code></td>
                <td>string</td>
                <td><code>auto</code> für den z-index</td>
                <td>{{ m.apiStyling }}</td>
              </tr>
              <tr>
                <td><code>tooltipOptions</code></td>
                <td>Options-Objekt</td>
                <td>—</td>
                <td>{{ m.apiOptions }}</td>
              </tr>
              <tr>
                <td><code>dt</code> · <code>unstyled</code> · <code>pt</code> · <code>ptOptions</code></td>
                <td>geerbte Signal-Inputs</td>
                <td>—</td>
                <td>{{ m.apiInherited }}</td>
              </tr>
              <tr>
                <td><code>pTooltipPT</code> · <code>pTooltipUnstyled</code> · <code>ptTooltip</code></td>
                <td>Signal-Inputs</td>
                <td>—</td>
                <td>{{ m.apiDirectivePt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarierte Inputs und ihre Aliase aus der kompilierten Direktive in
          <code>openng-optimus-ui-tooltip.mjs:782</code> und den Decorator-Metadaten in <code>:791-839</code>. Die
          vorletzte Zeile steht in keinem von beiden: <code>dt</code>, <code>unstyled</code>, <code>pt</code> und
          <code>ptOptions</code> sind Signal-Inputs, geerbt von <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:42-63</code>, deklariert in <code>:428</code>) — geh die
          Vererbungskette ab, bevor du eine API-Tabelle von Optimus für vollständig erklärst. Outputs gibt es keine.
        </p>

        <h3>Ein deaktiviertes Bedienelement ist das klassische Verschwinden</h3>
        <pre class="code-block"><code>{{ disabledSnippet }}</code></pre>
        <p class="src-note">
          Zeiger-Listener kommen an das eigene Host-Element der Direktive,
          <code>this.el.nativeElement</code> (<code>openng-optimus-ui-tooltip.mjs:253-255</code>), während der
          Fokus-Listener an <code>querySelector('.p-component')</code> kommt oder, wenn es das nicht gibt, an den Host
          (<code>:265-268</code>, mit dem Sonderfall für den Input-Wrapper in <code>:665-667</code>). Ein deaktiviertes
          Formular-Element ist nicht fokussierbar, was den Fokus-Weg in den ersten beiden Varianten entscheidet. Den
          Zeiger-Weg entscheidet die Bibliothek nicht: Ob ein deaktiviertes Bedienelement oder sein aktiver Wrapper noch
          <code>mouseenter</code> bekommt, ist eine Frage des Browsers, und deshalb ist die dritte Variante — ein
          aktiver, fokussierbarer Host, der nicht das deaktivierte Bedienelement ist — diejenige, die nicht von der
          Antwort abhängt.
        </p>

        <h3>Der Knoten, auf den du nicht verweisen kannst</h3>
        <p>{{ m.nodeLifecycle }}</p>
        <p class="src-note">
          <code>create()</code> baut den Knoten bei jedem Anzeigen (<code>openng-optimus-ui-tooltip.mjs:473-505</code>,
          aufgerufen aus <code>:524</code>), und <code>remove()</code> löscht ihn beim Ausblenden
          (<code>:734-750</code>). Die id im Options-Objekt (<code>:186</code>) wird nur jemals zurück in dieses Objekt
          geschrieben (<code>:338-340</code>); eine Suche nach <code>aria</code>, <code>describedby</code> und
          <code>title</code> in der Datei findet nichts außer der <code>role</code> in <code>:479</code>.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkKeyboard }}</li>
          <li>{{ m.checkTouch }}</li>
          <li>{{ m.checkEssential }}</li>
          <li>{{ m.checkEscapeHtml }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Was die Bibliothek beisteuert</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          Die Direktive rendert, was immer <code>pTooltip</code> ergibt
          (<code>openng-optimus-ui-tooltip.mjs:551-565</code>), und liest keinen Übersetzungsschlüssel; das
          Optimus-Konfigurationsobjekt hat keinen Tooltip-Eintrag — das einzige <code>tooltip</code>-Mitglied von
          <code>openng-optimus-ui-config.mjs</code> ist <code>zIndex.tooltip</code> in <code>:239</code>.
        </p>

        <h3>Das Label gehört dir, also binde es reaktiv</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Das Muster des Kits: <code>TranslationService.translate()</code>, gelesen in einem <code>computed</code>,
          sodass das computed vom Signal für die Übersetzungsversion des Dienstes abhängt und bei einem Sprachwechsel
          neu läuft. Ein Tooltip, der an ein schlichtes Feld gebunden ist, behält den String, mit dem er geboren wurde.
          Die Referenz-Implementierung für die ganze Icon-Button-Form — zugänglicher Name und Tooltip aus demselben
          Schlüssel — ist <code>src/app/components/frame/notification-bell.component.ts</code>.
        </p>

        <h3>Länge, Zeilenumbrüche und Richtung</h3>
        <p>{{ m.i18nLength }}</p>
        <p class="src-note">
          <code>white-space: pre-line</code> und <code>word-break: break-word</code> unter der Grenze von
          <code>12.5rem</code>, alle drei in
          <code>&#64;openng/optimus-ui-styles/dist/tooltip/index.mjs:5</code> und <code>:19-20</code>. Die Platzierung
          wird aus physischen Koordinaten berechnet (<code>openng-optimus-ui-tooltip.mjs:598-658</code>), und die vier
          Positions-Schlüsselwörter sind physisch, nicht logisch.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.1</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft:
            Alle Zeilenverweise stimmen; die Token-Kette sagt, dass die Grautöne der Blase in jedem Stil die von Aura
            sind und der Radius der <code>border.radius.md</code> des Stils ist; das Agenten-Dokument auf das
            Größenziel gekürzt.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TooltipArticleDeComponent extends TooltipArticleComponent {
  /** Visible German strings; same keys as the English `m`. */
  override readonly m = {
    // usage — which surface
    whenIconName:
      'Der Tooltip ist die Kopie eines Namens für sehende Zeiger-Nutzer, den das Bedienelement schon haben muss. Er kann nicht der Name sein: Nichts verknüpft den Tooltip-Knoten mit seinem Auslöser, also bleibt ein Icon-Button ohne Label ohne Label.',
    whenHint:
      'Eine Wiederholung oder ein Tastenkürzel ist das, wofür die Rolle da ist. Geht sie verloren, kostet das den Leser nichts — und genau das ist der Test dafür, ob überhaupt etwas in einen Tooltip gehört.',
    whenEssential:
      'Ein Tooltip ist nicht für jeden Leser erreichbar und bleibt nicht so lange stehen, wie der Leser es will. Alles, wovon die Aufgabe abhängt, gehört dorthin, wo man es lesen, markieren und noch einmal lesen kann.',
    whenHelp:
      'Ein oder zwei Sätze brauchen eine Fläche, die sich bewusst öffnet und offen bleibt. Eine Hover-Blase, die auf dem Weg zu ihr verschwindet, ist eine schlechtere Fassung derselben Idee.',
    whenInteractive:
      'Der Knoten wird außerhalb deines Templates gebaut, steht nicht in der Tab-Reihenfolge und hat standardmäßig pointer-events: none. Ein Bedienelement darin ist weder für den Zeiger noch für die Tastatur erreichbar.',
    whenError:
      'Eine Validierungsmeldung muss mit dem Feld angesagt werden und ein zweites Lesen überstehen. Das ist aria-describedby auf einem Knoten, der im DOM bleibt — und das ist der Tooltip-Knoten nicht.',

    // usage — do/don't
    ddNameBad:
      'Der Button hat keinen Text und kein aria-label, also ist sein zugänglicher Name leer. Der Tooltip füllt die Lücke nicht: Der Knoten trägt role="tooltip" und keine id, und nichts am Button zeigt auf ihn. Mit der standardmäßigen Bindung nur an Hover sieht ein Tastatur-Nutzer die Blase auch nie, also ist das Bedienelement im Baum namenlos und unter dem Cursor stumm.',
    ddNameGood:
      'Der Name lebt am Bedienelement, wo jeder Leser und jede Art der Navigation ihn findet; der Tooltip wiederholt ihn für einen sehenden Zeiger-Nutzer und, mit tooltipEvent="both", für einen sehenden Tastatur-Nutzer. Das Icon ist aria-hidden, damit der Name nicht doppelt angesagt wird.',
    ddHoverBad:
      'Drei Fakten, die man im Kopf behalten muss, solange die Blase steht. Sie ist nur an Hover gebunden, man kann sie selbst nicht mit dem Zeiger berühren, weil autoHide pointer-events auf none lässt, und sie verschwindet in dem Moment, in dem der Zeiger den Auslöser verlässt.',
    ddHoverGood:
      'Der Hinweis ist kurz, und das Detail lebt auf der Seite. tooltipEvent="both" gibt dem Tastatur-Fokus dieselbe Blase, und autoHide="false" macht den Knoten mit dem Zeiger berührbar — die Hover-Hälfte von WCAG 2.2 SC 1.4.13, die die Standardwerte ausgeschaltet lassen.',

    // design
    tokMaxWidth:
      'Die harte Grenze der Blase bei jedem Viewport. Text bricht darin um; der Knoten wächst nie mit, um einen Satz aufzunehmen.',
    tokGutter:
      'Zwei Aufgaben auf einmal: der Abstand zwischen Auslöser und Blase, geschrieben als Padding am Root, und die Rahmenbreite, die den Pfeil zeichnet.',
    tokPadding: 'Innenabstand des Textknotens — 0.5rem in Block-Richtung, 0.75rem in Inline-Richtung.',
    tokBackground:
      'Das Tooltip-Preset nennt in beiden Farbschemata dasselbe Token, aber das Token selbst unterscheidet sich: surface.700 ist im hellen Schema slate.700 (#334155) und im dunklen zinc.700 (#3f3f46). So oder so ist es ein dunkles Grau, das die Blase selbst malt, nie die Fläche, auf der sie sitzt. Das Kit ersetzt nur die Primär-Rampe des Presets, also sind diese Grautöne in jedem visuellen Stil gleich.',
    tokColor: 'surface.0 ist in beiden Farbschemata #ffffff, also ist der Text so oder so weiß auf der dunklen Blase.',
    tokShadow:
      'Geteilt mit dem Popover-Overlay, sodass die beiden verankerten Flächen sich gleich weit von der Seite abheben.',
    tokRadius:
      'Ebenfalls mit dem Popover-Overlay geteilt, und der eine Wert hier, der sich mit dem Kit-Theme bewegt: Er wird zu border.radius.md aufgelöst, den jeder visuelle Stil setzt — 0 in werkbund, 12px im Standard lernwerkstatt, 10px skizzenbuch, 2px blaupause (Aura serienmäßig 6px). Kein Stil-Block im Kit-Stylesheet berührt .p-tooltip.',

    contrastPara:
      'Die Blase rendert Text, also ist das Kriterium SC 1.4.3 Contrast (Minimum), und zwar mit 4,5:1 statt der 3:1 für großen Text, weil das Preset überhaupt keine font-size setzt — die Blase erbt die Größe, wo immer sie landet, und das ist Fließtext. Das Paar, das das einhalten muss, ist tooltip.color über tooltip.background — der Knoten malt seinen eigenen Hintergrund und erbt nie die Fläche dahinter, also ist das zu prüfende Paar im hellen und im dunklen Modus dasselbe, auch wenn surface.700 in jedem zu einem anderen Grau aufgelöst wird. Hier wird kein Verhältnis zitiert: Das Kontrast-Kompilat des Kits misst Kit-Token, und beide hier sind Werte des Aura-Presets, also ist das Nennen des Kriteriums die ehrliche Hälfte der Antwort, und ein benachbartes Paar zu zitieren wäre die unehrliche. Sobald du die Blase mit dt umfärbst, wird diese Prüfung deine Sache: Wer eine der beiden Farben überschreibt, bricht eine Paarung, die das Preset geklärt hatte.',

    narrow:
      'Kein eigenes responsives Verhalten, und eine harte Grenze. Die Blase ist bei jedem Viewport max-width: 12.5rem — sie wird auf dem Desktop nie breiter und auf dem Smartphone nie schmaler. Stattdessen bricht sie um, beachtet Zeilenumbrüche in deinem String, weil der Textknoten white-space: pre-line hat, und bricht innerhalb eines langen Wortes um, statt überzulaufen. Im Stylesheet der Komponente gibt es keine Media Query und keine Container Query. Sitzt ein Auslöser nah an einem Bildschirmrand, versucht die Platzierungskette zuerst die gegenüberliegende Seite und dann die andere Achse: Ein Tooltip oben oder unten weicht auf rechts und dann links aus, einer links oder rechts auf oben und dann unten. Passt keiner der vier Kandidaten, bleibt die Blase dort, wo der letzte Versuch sie hingesetzt hat, statt in den sichtbaren Bereich geklemmt zu werden. Layout-Empfehlung: Nimm für Auslöser in einer schmalen Spalte lieber tooltipPosition="bottom", wo sich die Grenze und die Ausweichkette um den wenigsten Platz streiten.',

    zIndex:
      'Die Blase bekommt keinen festen z-index. Bleibt er beim Standard, registriert die Direktive den Knoten im bibliotheksweiten Overlay-Stapel unter der Tooltip-Basis 1100 — derselben Basis, die ein modaler Dialog bekommt —, und die tatsächlich geschriebene Zahl wird aus dem letzten Eintrag in diesem Stapel abgeleitet statt allein aus der Basis. Was daraus für dich folgt: Tooltip und Dialog sind in diesem Stapel gleichrangig, also entscheidet die Reihenfolge, in der sie geöffnet wurden, welcher oben malt, nicht ihre Art. Die Direktive schließt die Blase beim Scrollen und bei einer Größenänderung des Fensters, was die meisten Übergänge zwischen den beiden abdeckt.',

    // development
    apiContent:
      'Der Alias des Inputs content, deshalb schreibst du pTooltip und nicht content. Eine TemplateRef wird angenommen und als eingebettete View gerendert — das ist eine Hilfe für die Formatierung, kein Freibrief, Bedienelemente hineinzusetzen.',
    apiPosition:
      'Physische Schlüsselwörter. Jedes hat seine eigene Ausweichkette, die nur versucht wird, solange der platzierte Knoten außerhalb des Viewports liegt.',
    apiEvent:
      'Der Standard bindet nur Zeiger und Touch. focus oder both bringt den Tooltip in Reichweite einer Tastatur; der Fokus-Listener hängt sich an das innere .p-component, wenn der Host eines hat. Setz es einmal: Die Listener werden gebunden, nachdem die View initialisiert ist, und erst beim Zerstören wieder gelöst, also schreibt eine spätere Änderung dieses Inputs das Options-Objekt neu und bindet nichts neu.',
    apiDisabled:
      'Mit Alias: Das Attribut heißt tooltipDisabled, nicht disabled. Sein Setter deaktiviert außerdem einen Tooltip, der in dem Moment gerade angezeigt wird.',
    apiAutoHide:
      'True lässt den Knoten bei pointer-events: none, also kann man ihn nicht mit dem Zeiger berühren, und der Leser verliert ihn auf dem Weg dorthin. False macht ihn berührbar und bindet mouseleave am Knoten selbst.',
    apiEscapeKey:
      'Ein keydown.escape-Listener auf Dokumentebene, gebunden, solange der Tooltip aktiv ist — er macht die Blase schließbar, ohne den Zeiger zu bewegen. Das Input selbst ist wirkungslos: onChanges schreibt keinen Schlüssel hideOnEscape in das Options-Objekt, und der Listener wird aus getOption(\'hideOnEscape\') gebunden, also ändert [hideOnEscape]="false" nichts. Der einzige Schalter, der ihn erreicht, ist [tooltipOptions]="{ hideOnEscape: false }".',
    apiEscape:
      'Hat nichts mit der Esc-Taste zu tun: true fügt den Inhalt als Textknoten ein, false weist ihn innerHTML zu. Binde false nie an einen String, den ein Nutzer beeinflussen kann.',
    apiDelays:
      'showDelay und hideDelay verzögern Anzeigen und Ausblenden; life blendet die Blase nach ihrer Dauer aus, ob der Zeiger noch auf dem Auslöser ist oder nicht. life ist das, was dich auf die falsche Seite der Anforderung an die Beständigkeit in SC 1.4.13 bringt.',
    apiEllipsis:
      'Zeigt den Tooltip nur, wenn der Auslöser tatsächlich abgeschnitten ist, gemessen als offsetWidth unter scrollWidth oder offsetHeight unter scrollHeight, also zählt auch eine begrenzte mehrzeilige Zelle. Gemacht für eine Tabellenzelle, überall sonst still.',
    apiFitContent:
      'Setzt width: fit-content auf den Knoten. Es wird direkt von der Instanz der Direktive gelesen statt aus dem Options-Objekt, also kann tooltipOptions es nicht ändern.',
    apiAppendTo:
      'Im Effekt body. Das Signal-Input existiert, und ein computed bezieht die app-weite Overlay-Einstellung ein, aber der Wert, an den der Knoten angehängt wird, kommt aus dem Options-Objekt, dessen Standard body ist, und dieses computed wird auf diesem Weg nirgends gelesen.',
    apiOffsets: 'Wird nach der Platzierung in Pixeln zu den berechneten Werten left und top addiert.',
    apiStyling:
      'tooltipStyleClass landet auf dem Root-Knoten neben der Positions-Klasse. tooltipZIndex nimmt einen festen Wert statt der verwalteten Ebene. positionStyle überschreibt die absolute Positionierung.',
    apiOptions:
      'Ein Objekt, über die Standardwerte gemergt, das das meiste von oben auf einmal setzt. Greif zuerst zu den einzelnen Inputs — aber prüf, wo jedes landet: hideOnEscape und fitContent werden nie in dieses Objekt geschrieben, was das Objekt zum einzigen Weg zu hideOnEscape macht und zu gar keinem Weg zu fitContent.',
    apiInherited:
      'Geerbt von BaseComponent: Design-Token mit Geltungsbereich, Rendern ohne Stile und Pass-through-Attribute mit ihren Optionen.',
    apiDirectivePt:
      'Das Pass-through-Paar mit Geltungsbereich der Direktive plus ihr eigenes Unstyled-Flag. ptTooltip ist zugunsten von pTooltipPT veraltet.',

    nodeLifecycle:
      'Es gibt keinen Tooltip-Knoten, auf den man zeigen könnte. Er wird gebaut, wenn der Tooltip erscheint, und gelöscht, wenn er verschwindet, er trägt nie eine id, und kein Attribut verbindet ihn mit dem Auslöser — ein aria-describedby, das du selbst schreibst, wäre also die ganze Zeit, in der der Tooltip nicht angezeigt wird, ein ins Leere zeigender Verweis. Behandle die Blase als Dekoration über einem Element, das schon benannt ist, nie als den Weg, eines zu benennen oder zu beschreiben.',

    checkName:
      'Jeder Auslöser hat seinen eigenen zugänglichen Namen — sichtbaren Text oder aria-label —, bevor ein Tooltip dazukommt. Der Tooltip wiederholt den Namen; er kann ihn nicht ersetzen.',
    checkKeyboard:
      'Setz tooltipEvent="both" überall, wo der Auslöser fokussierbar ist. Mit dem Standard bindet der Fokus nichts, und ein Tastatur-Nutzer sieht den Tooltip nie.',
    checkTouch:
      'Bei Touch öffnet sich die Blase bei touchstart und schließt sich, mit autoHide beim Standard, bei touchend wieder. Geh davon aus, dass ein Touch-Leser sie für die Dauer eines Drucks bekommt oder gar nicht.',
    checkEssential:
      'Nichts, was die Aufgabe braucht, lebt nur in einem Tooltip. Sag es auf der Seite, und lass den Tooltip es wiederholen.',
    checkEscapeHtml:
      'Lass escape auf true. False weist den String innerHTML zu, was jeden vom Nutzer beeinflussten Text zu Markup macht.',

    // i18n
    i18nLibrary:
      'Nichts. Der Tooltip hat keinen von der Bibliothek gelieferten Text, kein eigenes Label und keinen Eintrag in der Übersetzungskonfiguration von Optimus. Jedes Zeichen, das ein Leser sieht, kommt aus deinem Binding, was die Lokalisierung eines Tooltips zur Lokalisierung eines einzigen schlichten UI-Strings macht — und es ist oft genug derselbe String wie der zugängliche Name des Bedienelements, dass ein Schlüssel beiden dienen sollte.',
    i18nLength:
      'Plane für die Grenze, nicht für deine Sprache. Die Blase ist höchstens 12.5rem breit und bricht um; ein deutsches Kompositum oder eine finnische Kasusform macht sie nicht breiter, sondern höher, und ein Wort, das länger als die Grenze ist, wird mitten im Wort umbrochen, statt überlaufen zu dürfen. Zeilenumbrüche in deinem String bleiben erhalten, weil der Textknoten pre-line ist — das ist der eine Formatierungshebel, den du hast, und es lohnt sich, ihn zu nutzen, statt zu hoffen, dass der Umbruch gut fällt. Die Richtung gehört nicht zum Paket: Die vier Positions-Schlüsselwörter sind physisch, und die Platzierung wird aus physischen Koordinaten berechnet, also bleibt ein rechts platzierter Tooltip auf einer RTL-Seite physisch rechts. Wähle top oder bottom überall, wo sich die Leserichtung umkehren kann.',
  };
}
