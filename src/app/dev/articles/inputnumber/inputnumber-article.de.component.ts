import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputnumberArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './inputnumber-article.component';

/**
 * German twin of the InputNumber guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs inputnumber`).
 */
@Component({
  selector: 'app-inputnumber-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'inputnumber'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Alles hier unten ist eine einzige Komponente in verschiedenen Kleidern. Tipp in eines der Felder — Buchstaben
          werden stillschweigend verschluckt, die Pfeiltasten zählen um den Schritt weiter, und was du siehst, ist
          <code>Intl.NumberFormat</code>, das das Model für eine Locale darstellt.
        </p>

        <h3>Ein Wert, zwei Locales</h3>
        <p>
          Beide Felder teilen sich ein Model. Die Trennzeichen — und welche Taste als Dezimalzeichen gilt — gehören zur
          Locale, nicht zur Komponente.
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <label for="in-de">Deutsche Formatierung (de-DE)</label>
            <p-inputnumber
              inputId="in-de"
              locale="de-DE"
              [minFractionDigits]="1"
              [maxFractionDigits]="2"
              [ngModel]="shared()"
              (ngModelChange)="shared.set($event)"
              name="in-de"
            />
          </div>
          <div class="stage__item">
            <label for="in-en">Englische Formatierung (en-US)</label>
            <p-inputnumber
              inputId="in-en"
              locale="en-US"
              [minFractionDigits]="1"
              [maxFractionDigits]="2"
              [ngModel]="shared()"
              (ngModelChange)="shared.set($event)"
              name="in-en"
            />
          </div>
        </div>
        <p class="src-note">
          Der Formatierer und seine Ziffern je Locale werden im ausgelieferten Quelltext gebaut
          (<code>openng-optimus-ui-inputnumber.mjs:428-429</code>). Ist keine <code>locale</code> gesetzt, gewinnt die
          eigene Locale der Laufzeitumgebung (<code>:236</code>) — binde in der App das <code>currentIntlLocale</code>
          des Kits, damit die Ziffern der Seitensprache folgen.
        </p>

        <h3>Währung und die Spin-Buttons</h3>
        <div class="stage stage--row">
          <div class="stage__item">
            <label for="in-eur">Betrag (EUR, de-DE)</label>
            <p-inputnumber
              inputId="in-eur"
              mode="currency"
              currency="EUR"
              locale="de-DE"
              [min]="0"
              [max]="10000"
              [step]="10"
              [ngModel]="amount()"
              (ngModelChange)="amount.set($event)"
              name="in-eur"
            />
          </div>
          <div class="stage__item">
            <label for="in-stacked">Gestapelte Buttons (Standard-Layout)</label>
            <p-inputnumber
              inputId="in-stacked"
              [showButtons]="true"
              [min]="0"
              [max]="100"
              [ngModel]="qty()"
              (ngModelChange)="qty.set($event)"
              name="in-stacked"
            />
          </div>
          <div class="stage__item">
            <label for="in-horizontal">Horizontale Buttons</label>
            <p-inputnumber
              inputId="in-horizontal"
              [showButtons]="true"
              buttonLayout="horizontal"
              [min]="0"
              [max]="100"
              [ngModel]="qty()"
              (ngModelChange)="qty.set($event)"
              name="in-horizontal"
            />
          </div>
        </div>
        <p class="src-note">
          Die Buttons sind reine Zeiger-Dekoration — <code>tabindex="-1"</code> und <code>aria-hidden="true"</code> im
          ausgelieferten Template; Tab landet auf dem Input, wo Pfeil nach oben/unten um den Schritt weiterzählen
          (<code>:673-679</code>).
        </p>

        <h3>Der ungültige Zustand</h3>
        <div class="stage">
          <div class="stage__item">
            <label for="in-invalid">Teilnehmer (1–30)</label>
            <p-inputnumber
              inputId="in-invalid"
              [min]="0"
              [max]="99"
              [invalid]="outOfRange()"
              [ariaDescribedBy]="outOfRange() ? 'in-invalid-error' : 'in-invalid-hint'"
              [ngModel]="participants()"
              (ngModelChange)="participants.set($event)"
              name="in-invalid"
            />
            <small class="hint" id="in-invalid-hint">Zwischen 1 und 30.</small>
            @if (outOfRange()) {
              <small class="field-error" id="in-invalid-error">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                Gib eine Zahl zwischen 1 und 30 ein.
              </small>
            }
          </div>
        </div>
        <p class="src-note">
          <code>invalid</code> ist der geerbte manuelle Boolean (<code>openng-optimus-ui-baseeditableholder.mjs:17</code>),
          und — anders als die Checkbox — hat diese Komponente einen echten <code>ariaDescribedBy</code>-Input, sodass der
          Fehlertext die Beschreibung des Felds ist. Nirgends in <code>openng-optimus-ui-inputnumber.mjs</code> wird
          <code>aria-invalid</code> gebunden, und in jedem visuellen Stil wird die Rahmentönung von
          <code>[invalid]</code> überschrieben (Tab „Design“), also trägt die sichtbare, verknüpfte Meldung den Zustand.
          Zeitpunkte der Validierung in echten Formularen sind das Terrain des Guides <strong>Formulare</strong>; diese
          Demo validiert direkt.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Die eine Entscheidung, die vor jedem Prop steht: Wird mit diesem Wert gerechnet? Eine Menge ja; eine Kennung
          sieht nur so aus. Danach ist die Verdrahtung das Feld-Muster mit drei numerischen Extras.
        </p>

        <h3>Die Verdrahtung</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>
        <ul>
          <li>
            <code>min</code>/<code>max</code>/<code>step</code> werden sowohl in die nativen Attribute als auch in
            <code>aria-valuemin</code>/<code>max</code> gespiegelt — eine Quelle, zwei Ausprägungen.
          </li>
          <li>
            Das Model aktualisiert sich bei jedem Tastendruck; <code>onInput</code> liefert <code>value</code> und
            <code>formattedValue</code>. <strong>Es gibt kein <code>onChange</code></strong> — validiere aus dem Model,
            wie bei jedem Feld.
          </li>
          <li>
            <code>suffix</code> und <code>prefix</code> werden im Feld gerendert — gib ihnen übersetzte Keys und hänge nie
            selbst eine Einheit an den Wert.
          </li>
        </ul>

        <h3>Die Grenze</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Der Bedarf</th>
                <th>Greif zu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eine exakte Menge, ein Schwellenwert oder ein Betrag</td>
                <td><code>p-inputnumber</code></td>
              </tr>
              <tr>
                <td>Grobe, stufenlose Einstellung nach Gefühl</td>
                <td><code>p-slider</code> — für präzise Eingabe beide auf einem Model koppeln</td>
              </tr>
              <tr>
                <td>Einer von wenigen diskreten Werten</td>
                <td><code>p-select</code> / <code>p-selectbutton</code></td>
              </tr>
              <tr>
                <td>Text in Ziffernform: IDs, Telefonnummern, Postleitzahlen</td>
                <td><code>pInputText</code> + <code>inputmode</code> (<strong>Texteingaben</strong>)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Kopplung mit dem Slider und ihre Grenze stehen in der Entscheidungstabelle des Slider-Guides; die Regel für
          Text in Ziffernform ist das Terrain von <strong>Texteingaben</strong>. Beides wird zitiert, nicht neu hergeleitet.
        </p>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Kennung in einem Zahlenfeld</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-plz-bad">Postleitzahl</label>
              <p-inputnumber
                inputId="in-dd-plz-bad"
                [ngModel]="plzBad()"
                (ngModelChange)="plzBad.set($event)"
                name="in-dd-plz-bad"
              />
            </div>
            <p class="dd__why">
              Der Leser hat die Dresdner Postleitzahl 01099 eingegeben: Die führende Null ist weg, und ein
              Tausendertrennzeichen hat zerteilt, was nie eine Menge war — Zahlenformatierung, angewandt auf Text.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Text in Ziffernform bleibt Text</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-plz-good">Postleitzahl</label>
              <input
                pInputText
                id="in-dd-plz-good"
                type="text"
                inputmode="numeric"
                autocomplete="postal-code"
                [ngModel]="plzGood()"
                (ngModelChange)="plzGood.set($event)"
                name="in-dd-plz-good"
              />
            </div>
            <p class="dd__why">
              Ein Texteingabefeld mit <code>inputmode="numeric"</code>: Die Handy-Tastatur zeigt trotzdem Ziffern, die
              Null und die exakte Zeichenkette bleiben erhalten, und <code>autocomplete</code> kann seine Arbeit tun.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Einschränkungen, die nur der Tastenfilter kennt</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-silent">Losgröße</label>
              <p-inputnumber
                inputId="in-dd-silent"
                [min]="1"
                [max]="30"
                [ngModel]="silent()"
                (ngModelChange)="silent.set($event)"
                name="in-dd-silent"
              />
            </div>
            <p class="dd__why">
              Buchstaben verschwinden lautlos, und nichts nennt den Bereich 1–30 — der Leser lernt die Regeln, indem er an
              ihnen scheitert.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein sichtbarer Hinweis, mit dem Feld verknüpft</span>
            <div class="dd__stage dd__stage--stack">
              <label for="in-dd-hinted">Losgröße</label>
              <p-inputnumber
                inputId="in-dd-hinted"
                [min]="1"
                [max]="30"
                [ariaDescribedBy]="'in-dd-hinted-hint'"
                [ngModel]="hinted()"
                (ngModelChange)="hinted.set($event)"
                name="in-dd-hinted"
              />
              <small class="hint" id="in-dd-hinted-hint">Ganze Zahl zwischen 1 und 30.</small>
            </div>
            <p class="dd__why">
              Der Bereich steht dort, wo das Feld ist, und wird über
              <code>ariaDescribedBy</code> mit ihm vorgelesen — der stille Filter wird zur Bequemlichkeit statt zum
              einzigen Lehrer.
            </p>
          </div>
        </div>

        <h3>Quellen, kommentiert</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA APG — Spinbutton pattern</a
            >
            — der Tastatur-Vertrag: Pfeiltasten zählen weiter, Pos1/Ende springen zu den Grenzen.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-valuenow" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — aria-valuenow</a
            >
            — der Wert, den ein Spinbutton offenlegen muss, während er sich ändert.
          </li>
          <li>
            <a href="https://tc39.es/ecma402/#numberformat-objects" target="_blank" rel="noopener noreferrer"
              >ECMA-402 — Intl.NumberFormat</a
            >
            — die Auflösung der Locale, die Standardwerte für Nachkommastellen und warum der Währungsmodus einen
            Währungscode verlangt.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/interaction.html#attr-inputmode"
              target="_blank"
              rel="noopener noreferrer"
              >HTML Living Standard — inputmode</a
            >
            — Ziffern-Tastaturen ohne <code>type="number"</code>, für die Werte, die keine Zahlen sind.
          </li>
          <li>
            <a href="https://primeng.org/inputnumber" target="_blank" rel="noopener noreferrer"
              >PrimeNG — InputNumber</a
            >
            — die Upstream-API-Doku der v21-Linie, die Optimus UI forkt; jede Aussage hier wurde gegen den
            ausgelieferten Quelltext von Optimus UI 2.0.2 erneut geprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Die eigene Token-Datei der Komponente ist fast leer: Das Feld ist darunter ein
          <code>pInputText</code> und nimmt jede Optik aus dem formField-Block. Was die Datei tatsächlich definiert, ist
          die Button-Spalte.
        </p>

        <h3>Der Button-Token-Block</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Button-Breite</td>
                <td>{{ m.btnWidth }}</td>
              </tr>
              <tr>
                <td>Button-Hintergrund</td>
                <td>{{ m.btnBg }}</td>
              </tr>
              <tr>
                <td>Hintergrund bei Hover / aktiv</td>
                <td>{{ m.btnHover }}</td>
              </tr>
              <tr>
                <td>Icon-Farbe</td>
                <td>{{ m.btnColor }}</td>
              </tr>
              <tr>
                <td>Rahmenfarbe</td>
                <td>{{ m.btnBorder }}</td>
              </tr>
              <tr>
                <td>root (ganze Komponente)</td>
                <td>{{ m.rootOnly }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-themes/dist/aura/inputnumber/index.mjs</code> (Aura 2.x), darüber die
          <code>.p-inputnumber</code>-Regel des Kits in <code>styles.scss</code>: Auras surface.400-Icon (2,56:1 auf Weiß)
          und die Standard-Button-Kante werden durch geprüfte Kit-Tokens ersetzt — Icon 4,79&#8211;7,78:1, Kante
          3,25&#8211;5,51:1 (<code>docs/generated/CONTRAST.MD</code>, „form field edge“, die
          <code>inputnumber.button</code>-Zeilen). Die Buttons bleiben <code>aria-hidden</code>; die barrierefreie
          Bedienung hängt nie davon ab, sie zu sehen.
        </p>

        <h3>Was das Kit und die visuellen Stile mit dem Feld machen</h3>
        <p>
          Das innere Feld ist ein <code>&lt;input pInputText&gt;</code>, also erreicht es jede Kit- und Stilregel für
          <code>.p-inputtext</code> in <code>styles.scss</code>; die Button-Spalte hat ihre eigene
          <code>.p-inputnumber</code>-Regel (siehe oben):
        </p>
        <ul>
          <li>
            <strong>Fokus</strong>: der 2px-Ring des Kits in <code>--primary-color-fg</code>
            (<code>.p-inputtext:focus-visible</code>) in beiden Modi, über Auras Rahmentönung in
            <code>&#123;primary.color&#125;</code>.
          </li>
          <li>
            <strong>Dark Mode</strong>: Das Feld nimmt die Element-Tokens des Kits (<code>--surface-section</code> als
            Füllung, <code>--control-placeholder</code>); die transparenten Buttons zeigen den Container hinter ihnen.
          </li>
          <li>
            <strong>Rahmen</strong>: Die <code>input.p-inputtext</code>-Regel jedes visuellen Stils setzt die Rahmenfarbe
            des Felds auf die Kontur des Stils (und in drei Stilen eine dickere Breite) — 3,25&#8211;18,73:1 über die
            Stile, geprüft in <code>docs/generated/CONTRAST.MD</code> („form field edge“, die
            <code>inputtext</code>-Zeilen). Die Buttons nehmen den 1px-<code>--control-border</code> des Kits (geprüft,
            siehe oben), sodass mit <code>showButtons</code> das Feld und seine Button-Spalte in den Stilen, deren Kontur
            nicht <code>--control-border</code> ist, verschiedene Kanten tragen; beide bestehen SC 1.4.11.
          </li>
          <li>
            <strong>Ungültig</strong>: Die Stilregel sticht <code>.p-invalid</code>, also ergänzt das Kit
            <code>input.p-inputtext.p-invalid</code> (<code>--semantic-red-fg</code>, <code>!important</code>):
            <code>[invalid]</code> allein zeichnet in jedem Stil die rote Kante, ebenso wie Angulars
            <code>p-inputnumber.ng-invalid.ng-dirty &gt; .p-inputtext</code>
            (<code>openng-optimus-ui-inputnumber.mjs:23-27</code>). Die Kante ist nur Farbe — trag den Zustand im Text.
          </li>
        </ul>
        <p class="src-note">
          Abgeleitet aus den Selektoren in <code>styles.scss</code> (den Regeln <code>.dark-theme .p-inputtext</code>,
          Fokus, ungültig und <code>html.style-*</code>) gegen <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code> und
          den eigenen Regelblock der Komponente; prüf es in deinem Build, indem du die berechnete <code>border-color</code>
          des Inputs ausliest, während <code>[invalid]</code> auf einem unberührten Feld gesetzt ist.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Kein eigenes responsives Verhalten: Das Feld behält die Breite, die du ihm gibst, also gib ihm wie jedem Input
          die volle Spaltenbreite des Kits. Die gestapelte Button-Spalte kostet feste 2.5rem dieser Breite; das
          horizontale Layout kostet sie doppelt, links und rechts — lass in engen Spalten <code>showButtons</code> aus,
          die Tastatur zählt ohnehin weiter.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Eine Vererbungskette erklärt die API: <code>InputNumber extends BaseInput</code>, also kommen der
          Formular-Vertrag, die gespiegelten Einschränkungen und die Größen-Props aus der Basis — lokal sind nur der
          Formatierer und die Spin-Mechanik.
        </p>

        <h3>Tastaturbelegung — und ihre eine Lücke</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Wirkung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Pfeil nach oben / Pfeil nach unten</td>
                <td>zählt um ±<code>step</code> weiter (Standard 1), begrenzt auf die Grenzen</td>
              </tr>
              <tr>
                <td>Pos1 / Ende</td>
                <td>
                  springt zu <code>min</code> / <code>max</code> — <strong>übersprungen, wenn die Grenze 0 ist</strong>
                  (Wahrheitswert-Prüfung)
                </td>
              </tr>
              <tr>
                <td>Ziffern, Dezimalzeichen, Minus</td>
                <td>akzeptiert nach den Ziffern der aktiven Locale</td>
              </tr>
              <tr>
                <td>alles andere Druckbare</td>
                <td>stillschweigend verschluckt</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das Weiterzählen steht in <code>openng-optimus-ui-inputnumber.mjs:673-679</code>; das abgesicherte Pos1/Ende in
          <code>:793-803</code> — <code>if (this.min())</code> ist bei einer Grenze von null falsch, also bleibt Pos1 bei
          einem Bereich ab 0 wirkungslos, während Pfeil nach unten dort trotzdem stoppt.
        </p>

        <h3>Ablauf der Events</h3>
        <pre class="code-block"><code>{{ eventSnippet }}</code></pre>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>☐ <code>[locale]</code> an das <code>currentIntlLocale</code> des Kits gebunden.</li>
          <li>
            ☐ <code>label[for]</code>/<code>inputId</code> verdrahtet; Hinweise und Fehler über <code>ariaDescribedBy</code>.
          </li>
          <li>☐ Bereich und Schritt in einem sichtbaren Hinweis genannt, wo sie die Eingabe einschränken.</li>
          <li>☐ Mit dem Wert wird gerechnet — Kennungen sind in ein Texteingabefeld gewandert.</li>
          <li>☐ <code>mode="currency"</code> immer zusammen mit <code>currency</code>.</li>
          <li>☐ Die Validierung liest das Model bei jedem Tastendruck — nichts wartet auf ein Change-Event.</li>
          <li>
            ☐ Im Accessibility Tree geprüft: Rolle spinbutton, das Label als Name, aria-valuemin/max/now vorhanden.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Das ist das Formular-Control des Kits, das am stärksten von der Locale abhängt: Dasselbe Model rendert je
          Sprache andere Zeichen, und die Komponente folgt bereitwillig der falschen Locale, wenn du sie lässt.
        </p>

        <h3>Die Locale ist ein Input, und der Standard ist für dieses Kit falsch</h3>
        <p>
          Ohne Wert löst <code>Intl.NumberFormat</code> die Locale der <em>Laufzeitumgebung</em> auf — das Betriebssystem
          des Lesers, nicht die Sprache der Seite. Eine deutsche Seite, auf einem englischen System angesehen, zeigt
          <code>1,234.5</code> zwischen deutschen Sätzen. Die Kit-Regel ist ein einziges Binding:
          <code>[locale]="i18n.currentIntlLocale"</code> — dieselbe bereinigte Locale, die jedes Datum und jede Sortierung
          schon verwendet (<strong>I18n &amp; Lokalisierung</strong>).
        </p>
        <pre class="code-block"><code>{{ localeSnippet }}</code></pre>

        <h3>Was die Locale ändert</h3>
        <ul>
          <li>
            <strong>Trennzeichen</strong> — Tausender- und Dezimaltrennzeichen tauschen zwischen Locales die Rollen
            (1.234,56 gegenüber 1,234.56); die Komponente akzeptiert auch die Dezimal-<em>Taste</em> je Locale.
          </li>
          <li>
            <strong>Ziffern</strong> — der Formatierer baut seinen Ziffernsatz je Locale, sodass nicht-lateinische
            Ziffernsysteme nativ gerendert und gelesen werden.
          </li>
          <li>
            <strong>Platzierung der Währung</strong> — Symbol davor oder danach, mit oder ohne Abstand, kommt aus den
            CLDR-Daten, nie aus deinem Template.
          </li>
        </ul>

        <h3>Deine Keys</h3>
        <ul>
          <li>
            <code>prefix</code>/<code>suffix</code> sind Anzeige-Strings — übersetzte Keys, mit dem Breitenbudget von
            ~1,4× wie jedes Label.
          </li>
          <li>
            Der sichtbare Bereichshinweis ist ein Key; behalte die Zahlen darin als Ziffern (die Locale-Formatierung
            gehört ins Feld, nicht in den Satz).
          </li>
          <li>
            Geldbeträge bleiben <code>mode="currency"</code> — nie ein Suffix-String, der einen nachahmt; Platzierung
            und Abstand sind Fakten der Locale.
          </li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.4</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Spin-Buttons tragen
            jetzt die <code>--control-border</code>-Kante und das <code>--text-color-secondary</code>-Icon des Kits
            (geprüft, „form field edge“), und <code>[invalid]</code> allein zeichnet die <code>--semantic-red-fg</code>-Kante
            des Kits auf dem Feld.
          </li>
          <li>
            <strong>v0.3</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile neu geprüft (ADR-0016). Neuer Design-Abschnitt dazu, was
            das Kit und die Stile mit dem inneren <code>pInputText</code> machen — Fokus-Ring des Kits, dunkle Element-Tokens,
            der Stil-Rahmen, den die Spin-Buttons nicht teilen, und die Rahmentönung von <code>[invalid]</code>, die die
            Stilregel überschreibt (die <code>ng-invalid ng-dirty</code>-Regel malt weiterhin). Das Beispiel zum ungültigen
            Zustand behauptet kein Dreifaches mehr: Es wird kein <code>aria-invalid</code> gebunden, die verknüpfte
            Meldung trägt den Zustand. Agent-Doku unter dem Größenziel.
          </li>
          <li>
            <strong>v0.2</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): Jeder Zeilenverweis neu
            hergeleitet gegen <code>openng-optimus-ui-inputnumber.mjs</code> — die Inputs für Formatierung, Spinner und
            Bearbeitung sind dort einfache v21-<code>&#64;Input</code>-Properties, keine Input-Signale, daher zitieren
            ihre Standardwerte jetzt :246/:261/:231/:140/:150/:236 und den Spinbutton-Block :1266/:1272-1274/:1294. Die
            Token-Datei ist Aura 2.x: Der Spin-Button ist <strong>2.5rem</strong> breit, nicht 2.25rem, und seine
            Hell-/Dunkel-Farben stehen in einem <code>colorScheme</code>-Block statt in <code>light-dark()</code>. Das
            Verhalten ist unverändert: Der Browser-Locale-Standard, die reinen Zeiger-Buttons und die Pos1/Ende-Lücke
            bei einer Grenze von null gelten weiterhin.
          </li>
          <li>
            <strong>v0.1</strong> — 24.08.2026 — Erster Guide, gemessen an primeng&#64;22.1.2 und der Aura-3.0-Token-Datei:
            der Spinbutton-Input hinter Intl.NumberFormat, die reinen Zeiger-Spin-Buttons, der Browser-Locale-Standard
            und die currentIntlLocale-Regel des Kits, die Pos1/Ende-Lücke bei einer Grenze von null und die Grenze
            zwischen Kennung und Menge. Löst die <code>planned:inputnumber</code>-Verweise aus den Guides Slider und
            Texteingaben auf.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class InputnumberArticleDeComponent extends InputnumberArticleComponent {
  /** The measured values of the English article, with the prose around them in German. */
  override readonly m = {
    btnWidth: '2.5rem',
    btnBg: 'transparent',
    btnHover: 'surface.100 / surface.200 hell · surface.800 / surface.700 dunkel',
    btnColor: '--text-color-secondary (Kit; Aura surface.400), beide Themes',
    btnBorder: '--control-border in allen Zuständen (Kit; Aura form.field.border.color)',
    rootOnly: 'eine Übergangsdauer — sonst nichts',
  };
}
