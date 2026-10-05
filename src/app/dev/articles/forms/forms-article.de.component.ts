import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './forms-article.component';

/**
 * German twin of the Forms guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` and the
 * demo dates are German. Keep it in step with the English file: same tabs, same element
 * and binding skeleton (`node scripts/check-guide-translations.mjs forms`).
 */
@Component({
  selector: 'app-forms-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'forms'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Formular ist ein Vertrag über Timing: worum der Leser gebeten wird, wann sich das Formular beschweren darf
          und was mit seiner Aufmerksamkeit passiert, sobald es antwortet. Die drei Demos unten zeigen diese drei
          Momente.
        </p>

        <h3>Ein Fehler, der auf Blur oder Absenden wartet</h3>
        <p>
          Tipp eine ungültige Adresse ein und sieh zu, wie nichts passiert; verlass das Feld oder drück den Button, und
          die Beschwerde erscheint — per id mit dem Input verdrahtet, nicht bloß in der Nähe platziert.
        </p>
        <form class="demo-form" (ngSubmit)="demoSubmit()" novalidate>
          <div class="field">
            <label for="fx-demo-email">E-Mail</label>
            <input
              pInputText
              id="fx-demo-email"
              type="email"
              name="demo-email"
              autocomplete="off"
              placeholder="name&#64;example.org"
              [invalid]="demoShows()"
              [attr.aria-invalid]="demoShows()"
              [attr.aria-describedby]="demoShows() ? 'fx-demo-email-error' : null"
              [ngModel]="demoEmail()"
              (ngModelChange)="demoEmail.set($event)"
              (blur)="demoTouched.set(true)"
            />
            @if (demoShows()) {
              <small class="field-error" id="fx-demo-email-error">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                Gib eine Adresse mit einem &#64; und einer Domain ein.
              </small>
            }
          </div>
          <div class="demo-actions">
            <button pButton type="submit"><span pButtonLabel>Absenden</span></button>
            <button pButton type="button" severity="secondary" [outlined]="true" (click)="demoReset()">
              <span pButtonLabel>Demo zurücksetzen</span>
            </button>
          </div>
          <p class="demo-state" aria-live="polite">
            Wert gültig: {{ demoValid() ? 'ja' : 'nein' }} · berührt: {{ demoTouched() ? 'ja' : 'nein' }} · abgeschickt:
            {{ demoSubmitted() ? 'ja' : 'nein' }} · Fehler sichtbar: {{ demoShows() ? 'ja' : 'nein' }}
          </p>
        </form>
        <p class="src-note">
          Das Gate ist der eigene Zustand der Komponente, nicht der der Bibliothek: Der
          <code>invalid</code>-Input von Optimus ist ein boolescher Signal-Input ohne Blick auf das Angular-Form-Control
          (<code>openng-optimus-ui-baseeditableholder.mjs:17</code>); das Timing „berührt oder abgeschickt“ ist die
          Kit-Konvention aus <code>src/app/pages/feedback/feedback.component.ts</code>.
        </p>

        <h3>Die Invalid-Verdrahtung, aus und an</h3>
        <p>
          Dasselbe Feld zweimal, das zweite mit dem vollständigen Fehler-Tripel gebunden. Der Rahmen kommt von
          <code>[invalid]</code>; was ein Screenreader erfährt, kommt von den beiden ARIA-Attributen daneben.
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap">gültig</span>
            <input
              pInputText
              type="text"
              [ngModel]="staticOk"
              name="fx-static-ok"
              aria-label="Gültiges Beispielfeld"
              readonly
            />
          </div>
          <div class="stage__item">
            <span class="stage__cap">ungültig, vollständig verdrahtet</span>
            <input
              pInputText
              type="text"
              [ngModel]="staticBad"
              name="fx-static-bad"
              aria-label="Ungültiges Beispielfeld"
              readonly
              [invalid]="true"
              aria-invalid="true"
              aria-describedby="fx-static-error"
            />
            <small class="field-error" id="fx-static-error">
              <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
              Dieses Datum liegt in der Zukunft.
            </small>
          </div>
        </div>
        <p class="src-note">
          <code>[invalid]</code> rendert die Klasse <code>p-invalid</code> (<code>openng-optimus-ui-inputtext.mjs:31</code>),
          die den Rahmen auf die Invalid-Rahmenfarbe des Themes umschaltet; die Token stehen in der Tabelle im Tab
          Design.
        </p>

        <h3>Drei Hüllen, ein Label</h3>
        <p>
          Dasselbe Feld, das Label auf drei Arten angehängt. Alle drei sind ein echtes <code>&lt;label for&gt;</code>,
          das du geschrieben hast: <code>p-floatLabel</code> und <code>p-iftaLabel</code> projizieren nackten Inhalt und
          bringen kein eigenes Label-Element mit. Tipp ins mittlere Feld, und das Label hebt sich; setz das Häkchen, und
          das Float-Label kommt nie wieder herunter, weil schon ein <code>placeholder</code>-Attribut allein als
          „gefüllt“ zählt.
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap">einfaches Label darüber</span>
            <label for="fx-hull-plain">Anzeigename</label>
            <input
              pInputText
              id="fx-hull-plain"
              type="text"
              name="fx-hull-plain"
              [ngModel]="hullName()"
              (ngModelChange)="hullName.set($event)"
            />
          </div>
          <div class="stage__item">
            <span class="stage__cap">p-floatLabel</span>
            <p-floatLabel>
              <input
                pInputText
                id="fx-hull-float"
                type="text"
                name="fx-hull-float"
                [attr.placeholder]="hullPlaceholder() ? 'z. B. Ada L.' : null"
                [ngModel]="hullName()"
                (ngModelChange)="hullName.set($event)"
              />
              <label for="fx-hull-float">Anzeigename</label>
            </p-floatLabel>
          </div>
          <div class="stage__item">
            <span class="stage__cap">p-iftaLabel</span>
            <p-iftaLabel>
              <input
                pInputText
                id="fx-hull-ifta"
                type="text"
                name="fx-hull-ifta"
                [ngModel]="hullName()"
                (ngModelChange)="hullName.set($event)"
              />
              <label for="fx-hull-ifta">Anzeigename</label>
            </p-iftaLabel>
          </div>
        </div>
        <div class="demo-actions">
          <label class="hull-toggle" for="fx-hull-ph">
            <input
              id="fx-hull-ph"
              type="checkbox"
              name="fx-hull-ph"
              [ngModel]="hullPlaceholder()"
              (ngModelChange)="hullPlaceholder.set($event)"
            />
            dem Float-Label-Feld einen Placeholder geben
          </label>
          <button pButton type="button" severity="secondary" [outlined]="true" (click)="hullReset()">
            <span pButtonLabel>Demo zurücksetzen</span>
          </button>
        </div>
        <p class="src-note">
          Das Anheben ist reines CSS auf dem Wrapper, und einer seiner Auslöser ist
          <code>.p-floatlabel:has(input[placeholder]) label</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:37</code>). Das Ifta-Label bewegt sich nie: Seine
          Position ist eine einzige statische Regel (<code>&#64;openng/optimus-ui-styles/dist/iftalabel/index.mjs:10</code>).
          Beide Wrapper setzen außerdem <code>pointer-events: none</code> auf das Label (jeweils <code>:9</code>) — ein
          Klick auf eines der beiden Labels fokussiert das Feld also nicht, ein einfaches Label über dem Feld schon.
        </p>

        <h3>Fokus in Inhalt, den du gerade aufgedeckt hast</h3>
        <p>
          Der eine Ort, an den <code>[pAutoFocus]</code> gehört: Inhalt, den die eigene Aktion des Lesers gerade auf den
          Bildschirm gebracht hat. Drück den Button, und das Notizfeld erscheint mit dem Fokus schon darin; schließ es und
          öffne es wieder, und das neue Feld ist wieder fokussiert, weil jeder <code>&#64;if</code>-Durchlauf eine neue
          Instanz der Direktive erzeugt. Nichts auf dieser Seite nimmt beim Laden den Fokus.
        </p>
        <div class="demo-form">
          <div class="demo-actions">
            <button pButton type="button" [attr.aria-expanded]="noteOpen()" (click)="toggleNote()">
              <span pButtonLabel>{{ noteOpen() ? 'Notizfeld schließen' : 'Notiz hinzufügen' }}</span>
            </button>
          </div>
          @if (noteOpen()) {
            <div class="field">
              <label for="fx-af-note">Notiz</label>
              <input pInputText id="fx-af-note" type="text" autocomplete="off" [pAutoFocus]="true" />
            </div>
          }
        </div>
        <p class="src-note">
          Der Fokus wird aus einem <code>setTimeout</code> auf das erste fokussierbare Kindelement des Hosts gesetzt,
          oder auf den Host selbst, und nur, solange der Input truthy ist (<code>openng-optimus-ui-autofocus.mjs:38-50</code>).
          Die Situationen, in denen er das falsche Werkzeug ist, stehen in der Tabelle im Tab Entwicklung.
        </p>

        <h3>Die ganze Maschine: idle → sending → sent oder error</h3>
        <p>
          Ein Absenden ist ein Zustand, kein Moment. Solange es läuft, ist der Button deaktiviert und sagt das auch; das
          Ergebnis ersetzt das Formular oder rendert eine Inline-Meldung — jeder Zustand wird einmal über eine einzige
          höfliche Live-Region angesagt. Die Referenzimplementierung genau dieser Maschine, mit Fokusübergaben bei jedem
          Zweigwechsel, liegt unter
          <code>/feedback</code>.
        </p>
        <pre class="code-block"><code>{{ machineSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Ein Feldmuster, wiederholt: ein per id verdrahtetes Label, das Control, ein optionaler Hinweis und ein Fehler,
          der nur so lange im DOM steht, wie er sichtbar sein darf. Das Formular besitzt das Timing; das Feld besitzt die
          Verdrahtung.
        </p>

        <h3>Das Feldmuster, Teil für Teil</h3>
        <pre class="code-block"><code>{{ fieldSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Das Label</strong> zielt auf die id des gerenderten Inputs — bei nativen Elementen die id, die du
            geschrieben hast, bei Wrapper-Komponenten der Input <code>inputId</code>. Ein Control, dessen fokussierbares
            Element ein <code>span[role="combobox"]</code> ist (das Select), kann kein <code>label[for]</code> nehmen: Gib
            ihm eine sichtbare Beschriftung und richte <code>ariaLabelledBy</code> auf deren id.
          </li>
          <li>
            <strong>Das Fehler-Tripel</strong> reist zusammen: <code>[invalid]</code> zeichnet den Rahmen,
            <code>aria-invalid</code> markiert den Zustand, und <code>aria-describedby</code> nennt die id des Hinweises
            <em>und</em> die des Fehlers — so wird die Erklärung dort vorgelesen, wo das Feld ist, statt erst beim Absuchen
            entdeckt zu werden.
          </li>
          <li>
            <strong><code>novalidate</code></strong> schaltet die eigenen Blasen des Browsers ab, damit deine übersetzten,
            am Feld verankerten Fehler die einzige Stimme sind. Behalte die semantischen Attribute <code>type</code> und
            <code>autocomplete</code> trotzdem — sie steuern Tastaturen und Autofill, nicht die Validierung.
          </li>
        </ul>

        <h3>Das Zustandsmodell: Signals, ein reiner Validator, ein Touched-Set</h3>
        <pre class="code-block"><code>{{ modelSnippet }}</code></pre>
        <p>
          Nichts davon ist Bibliotheksmechanik: Der Entwurf ist ein einfaches Objekt über den Signals, der Validator ist
          eine reine Funktion, die Fehler-ids zurückgibt, und <code>shows()</code> ist der einzige Ort, an dem die
          Timing-Regel lebt. Ein Absendeversuch markiert alle Felder auf einmal als berührt, damit alle offenen
          Beschwerden zusammen erscheinen statt eine pro Suchrunde.
        </p>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — bei jedem Tastendruck meckern</span>
            <div class="dd__stage">
              <div class="field">
                <label for="fx-dd-eager">Benutzername</label>
                <input
                  pInputText
                  id="fx-dd-eager"
                  type="text"
                  name="fx-dd-eager"
                  [invalid]="eagerName().length > 0 && eagerName().length < 4"
                  [ngModel]="eagerName()"
                  (ngModelChange)="eagerName.set($event)"
                />
                @if (eagerName().length > 0 && eagerName().length < 4) {
                  <small class="field-error">
                    <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                    Mindestens 4 Zeichen.
                  </small>
                }
              </div>
            </div>
            <p class="dd__why">
              Das Feld wird als falsch markiert, während der Leser die richtige Antwort noch tippt — das Formular
              schreit unfertige Arbeit an, und ein Screenreader hört die Beschwerde bei jedem Zeichen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — erst beim Verlassen des Felds prüfen</span>
            <div class="dd__stage">
              <div class="field">
                <label for="fx-dd-calm">Benutzername</label>
                <input
                  pInputText
                  id="fx-dd-calm"
                  type="text"
                  name="fx-dd-calm"
                  [invalid]="calmShows()"
                  [attr.aria-invalid]="calmShows()"
                  [attr.aria-describedby]="calmShows() ? 'fx-dd-calm-error' : null"
                  [ngModel]="calmName()"
                  (ngModelChange)="calmName.set($event)"
                  (blur)="calmTouched.set(true)"
                />
                @if (calmShows()) {
                  <small class="field-error" id="fx-dd-calm-error">
                    <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                    Mindestens 4 Zeichen.
                  </small>
                }
              </div>
            </div>
            <p class="dd__why">
              Dieselbe Regel, angewandt, sobald der Leser das Feld verlassen oder auf Absenden gedrückt hat — der Fehler
              beschreibt eine fertige Antwort, und die ARIA-Verdrahtung erscheint mit ihm.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — der Placeholder ist das Label</span>
            <div class="dd__stage">
              <div class="field">
                <input
                  pInputText
                  type="text"
                  name="fx-dd-ph"
                  placeholder="Deine E-Mail-Adresse"
                  aria-label="Schlechtes Beispiel: Placeholder als Label"
                  [ngModel]="''"
                />
              </div>
            </div>
            <p class="dd__why">
              Der Name des Felds verschwindet beim ersten Tastendruck, der Placeholder-Kontrast liegt absichtlich unter
              dem Textkontrast, und es bleibt nichts übrig, worauf ein Label zeigen könnte — SC 3.3.2 verlangt ein Label
              oder eine Anweisung, die stehen bleibt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Label, das bleibt, ein Placeholder, der vorführt</span>
            <div class="dd__stage">
              <div class="field">
                <label for="fx-dd-lbl">E-Mail</label>
                <input
                  pInputText
                  id="fx-dd-lbl"
                  type="email"
                  name="fx-dd-lbl"
                  placeholder="name&#64;example.org"
                  [ngModel]="''"
                />
              </div>
            </div>
            <p class="dd__why">
              Das Label trägt den Namen und überlebt die Eingabe; der Placeholder ist auf das reduziert, was er gut kann —
              ein durchgespieltes Beispiel des erwarteten Formats.
            </p>
          </div>
        </div>

        <h3>Die Hüllen um ein Feld</h3>
        <p>
          Optimus liefert vier Wrapper, die um ein Control herum sitzen, statt selbst eines zu sein. Jeder ist eine
          Komponente, deren ganzes Template <code>&lt;ng-content&gt;</code> plus eine Klasse auf dem Host ist — sie
          ergänzen Geometrie, nie Semantik, und keiner von ihnen steuert ein Label, einen Namen oder eine Beschreibung
          bei. Was im Accessibility Tree landet, ist weiterhin genau das, was du in sie hineingeschrieben hast.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hülle</th>
                <th>Was sie tut</th>
                <th>Was sie nicht tut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-floatLabel</code></td>
                <td>positioniert dein Label über dem Feld und hebt es bei Fokus oder Inhalt an, allein per CSS</td>
                <td>ein Label mitliefern; das Label klickbar halten; das Label zurückholen, sobald es einen Placeholder gibt</td>
              </tr>
              <tr>
                <td><code>p-iftaLabel</code></td>
                <td>positioniert dein Label statisch im oberen Padding des Felds</td>
                <td>ein Label mitliefern; das Label klickbar halten; einen eigenen Input annehmen</td>
              </tr>
              <tr>
                <td><code>p-iconfield</code> + <code>p-inputicon</code></td>
                <td>positioniert ein dekoratives Icon absolut an der vorderen oder hinteren Kante des Felds</td>
                <td>das Icon zu einem zugänglichen Namen, einem Button oder einem Status machen</td>
              </tr>
              <tr>
                <td><code>p-fluid</code></td>
                <td>sagt den Controls, die danach fragen, dass sie in voller Breite rendern sollen</td>
                <td>eigenes CSS mitbringen; Controls erreichen, die nicht danach fragen</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Alle vier Templates sind ein nacktes <code>&lt;ng-content&gt;</code>:
          <code>openng-optimus-ui-floatlabel.mjs:74</code>, <code>openng-optimus-ui-iftalabel.mjs:64</code>,
          <code>openng-optimus-ui-iconfield.mjs:71</code>, <code>openng-optimus-ui-fluid.mjs:52</code>.
          <code>p-iftaLabel</code> und <code>p-fluid</code> deklarieren überhaupt keine Inputs; die vier, die trotzdem an
          ihnen auftauchen — <code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> — sind geerbt
          von <code>openng-optimus-ui-basecomponent.mjs:428</code>.
        </p>

        <h4>Die Wahl zwischen den beiden Label-Hüllen</h4>
        <p>
          Nimm bevorzugt ein einfaches Label über dem Feld. Wo das Design das Label im Feld verlangt, ist
          <code>p-iftaLabel</code> die sicherere der beiden: Sein Label ist eine statische Regel und bleibt jederzeit
          lesbar, während das Float-Label nur über einem leeren, unfokussierten Feld sichtbar ist und in dem Moment
          schrumpft, in dem es sich hebt. Keines ist klickbar — beide Wrapper setzen <code>pointer-events: none</code> auf
          das Label —, also geben beide die Zielfläche auf, die ein normales Label einem motorisch eingeschränkten oder
          ungenau zeigenden Nutzer bietet, und das Float-Label gibt zusätzlich eine stabile Leseposition auf.
          <strong>Ein Placeholder hebt ein Float-Label vollständig auf:</strong> Einer der Auslöser für das Anheben ist die
          bloße Anwesenheit des Attributs, sodass Label und Placeholder übereinander landen, mit dem Label klein und
          angehoben ab dem ersten Paint. Wenn du beides brauchst, ist genau das das Argument für ein Label über dem Feld.
        </p>
        <p class="src-note">
          Nachstellen: Leg ein Float-Label um ein Feld, gib dem Feld einen Placeholder und lade die Seite, ohne sie zu
          berühren. Das Label rendert vor jeder Interaktion im angehobenen, geschrumpften Zustand.
        </p>

        <h4>Die Icon-Hülle trägt keine Bedeutung</h4>
        <p>
          <code>p-inputicon</code> rendert ein Span mit einer Klasse und deinem projizierten Icon. Es hat keine Rolle, also
          sagt eine Lupe neben einem Feld nur sehenden Lesern „Suche“; schreib dieses Wort ins Label. Soll das Icon gedrückt
          werden — ein Passwort aufdecken, einen Wert löschen, eine Auswahl öffnen —, dann ist es ein Button, und eine
          Icon-Hülle ist der falsche Container dafür.
        </p>

        <h3>Quellen, kommentiert</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 3.3.1 Error Identification</a
            >
            — der Fehler wird im Text am fehlerhaften Element benannt; der Grund, warum Fehler Sätze mit ids sind und
            keine Rahmen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 3.3.2 Labels or Instructions</a
            >
            — die Latte, an der das Muster „Placeholder als Label“ scheitert.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 1.3.5 Identify Input Purpose</a
            >
            — warum Namens- und E-Mail-Felder auch unter <code>novalidate</code> <code>autocomplete</code>-Token tragen.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html"
              target="_blank"
              rel="noopener noreferrer"
              >HTML Living Standard — form control infrastructure</a
            >
            — was <code>novalidate</code> abschaltet (die Oberfläche der Constraint Validation) und was es anlässt (Typen,
            Autofill, Absenden).
          </li>
          <li>
            <a href="https://angular.dev/guide/forms/template-driven-forms" target="_blank" rel="noopener noreferrer"
              >Angular — template-driven forms</a
            >
            — die NgModel-Mechanik unter dem geteilten Binding des Kits.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Theme bepreist jedes Feld gleich: ein Padding-Paar, drei Größen, eine Invalid-Farbe — und einen Fokus-Ring,
          den es absichtlich nicht zeichnet. Wie ein Formular aussieht, ist größtenteils das, was der formField-Token-Block
          sagt, plus die zwei Konventionen des Kits obendrauf.
        </p>

        <h3>Der formField-Token-Block</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>size="small"</code></th>
                <th>Standard</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size</td>
                <td>{{ m.smFont }}</td>
                <td>{{ m.baseFont }}</td>
                <td>{{ m.lgFont }}</td>
              </tr>
              <tr>
                <td>padding-x</td>
                <td>{{ m.smPadX }}</td>
                <td>{{ m.basePadX }}</td>
                <td>{{ m.lgPadX }}</td>
              </tr>
              <tr>
                <td>padding-y</td>
                <td>{{ m.smPadY }}</td>
                <td>{{ m.basePadY }}</td>
                <td>{{ m.lgPadY }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustands-Token</th>
                <th>hell</th>
                <th>dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rahmen</td>
                <td>surface.300</td>
                <td>surface.600</td>
              </tr>
              <tr>
                <td>Rahmen bei Fokus</td>
                <td colspan="2">primary.color (beide Themes)</td>
              </tr>
              <tr>
                <td>Rahmen bei ungültig</td>
                <td>red.400</td>
                <td>red.300</td>
              </tr>
              <tr>
                <td>Placeholder bei ungültig</td>
                <td>red.600</td>
                <td>red.400</td>
              </tr>
              <tr>
                <td>Hintergrund bei deaktiviert</td>
                <td>surface.200</td>
                <td>surface.700</td>
              </tr>
              <tr>
                <td>Fokus-Ring</td>
                <td colspan="2">Breite 0 · Stil none · Farbe transparent · Offset 0 · Schatten none</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Alle Werte aus dem Block <code>semantic.formField</code> von
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (Aura 2.x, Themes 2.0.2). Nur sm und lg sind
          als Token angelegt: Es gibt kein Basis-Token <code>fontSize</code>, und die Basisgröße ist ein Literal
          <code>font-size: 1rem</code> in <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code>.
        </p>
        <p>
          Das sind die Werte des Presets; die ruhende Kante, die Invalid-Kante und das dunkle Feld sind nicht das, was hier
          rendert. Auras Kante <code>surface.300</code> hat 1,48:1 auf Weiß, zu blass, um ein Control zu erkennen, also
          richtet <code>src/styles.scss</code> das eigene Rahmen-Token jedes Felds — Select, Multiselect, Cascade Select,
          Listbox, Autocomplete, die Buttons des Input Number, den Trigger-Button des Date Pickers, Textarea, Checkbox,
          Radio Button — neu aus auf
          <code>--control-border</code>, und jeder visuelle Stilblock malt die Kante von <code>input.p-inputtext</code> in
          seinem eigenen Outline-Token (<code>--style-outline</code>; <code>--style-outline-soft</code> in skizzenbuch),
          drei davon in größerer Stärke (lernwerkstatt wechselt im Dark Mode auf
          <code>--control-border</code>, wo seine Outline fast schwarz ist). Auras Invalid-Kante <code>red.400</code>
          hat 2,77:1 auf Weiß, also zeigt das Invalid-Token jedes Felds auf <code>--semantic-red-fg</code>, und
          <code>input.p-inputtext.p-invalid</code> malt es mit <code>!important</code> über die Stil-Outline. Die
          Dropdown-Chevrons und Feld-Icons nehmen <code>--text-color-secondary</code>; das Float- und das Ifta-Label ruhen
          auf <code>--text-color-secondary</code> und werden bei Fokus zu <code>--text-color</code> und bei ungültig rot.
          Im Dark Mode ruht jede Feldhülle — Textfelder, Textarea, Select, Multiselect, Tree Select und die Box des
          Autocomplete im Multiple-Modus — auf <code>--surface-section</code> mit <code>--text-color</code> und
          <code>--control-placeholder</code>. Hover- und Disabled-Zustände lesen weiter die Token des Presets.
        </p>
        <p class="src-note">
          Regeln in <code>src/styles.scss</code> (die elementbezogenen Token-Blöcke neben der Fokusregel des Selects, die
          Regel für die Invalid-Kante und die Regel für <code>input.p-inputtext</code> in jedem Block
          <code>html.style-*</code>); jedes daraus entstehende Paar ist in <code>docs/generated/CONTRAST.MD</code> unter
          <em>form field edge</em>, <em>form field text</em>, <em>form field icon</em>, <em>float label</em> und
          <em>field placeholder</em> abgesichert, je Stil und Modus — die
          Control-Kanten ab 3,25:1, die Invalid-Kante ab 5,66:1.
        </p>
        <p>
          Der genullte Fokus-Ring ist die tragende Zeile: Ein Formular, das allein vom Theme gestylt wird, hat
          <strong>keinen sichtbaren Tastaturfokus</strong> auf seinen Feldern. Das Kit stellt ihn mit einem einzigen Ring in
          <code>src/styles.scss</code> wieder her — 2px solid <code>--primary-color-fg</code> mit 2px Offset — auf
          <code>:focus-visible</code> für Textfelder, Checkboxen, Radio Buttons, Toggle Switches, Slider-Griffe, Buttons
          und die Dropdown-Teile von Date Picker und Autocomplete, und auf der Host-Klasse <code>.p-focus</code> für
          Select, Multiselect, Cascade Select, Tree Select und das Token-Feld des Autocomplete (abgesichert als
          <em>focus ring</em>, ab 3,88:1); in ihren Optionslisten trägt die per Tastatur aktive Option den Ring nach innen
          (<em>option list focus</em>), ebenso der per Tastatur fokussierte Chip eines Autocomplete im Multiple-Modus. Eine Control-Art außerhalb dieser Liste bringt ihre eigene Regel mit;
          <strong>Accessibility Guidelines</strong> besitzt den Standard.
        </p>

        <h3>Fehlertext</h3>
        <p>
          Ein Fehler ist ein Icon plus ein Satz im roten Textton, unter seinem Feld — Farbe ist der zweite Träger, nie der
          einzige. Die Zähler-Variante (n / max) nutzt
          <code>tabular-nums</code>, damit die Zahl beim Tippen nicht wackelt, und das Rotwerden am Limit ist wieder der
          zweite Träger: Der Satz „zu lang“ ist der erste.
        </p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stil / Modus</th>
                <th>Vordergrund</th>
                <th>Hintergrund</th>
                <th>Verhältnis</th>
                <th>SC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund · hell</td>
                <td><code>--semantic-red-fg</code> <code>#b91c1c</code></td>
                <td><code>--surface-card</code> <code>#ffffff</code></td>
                <td>6,47:1</td>
                <td>1.4.3 (verlangt 4,5:1)</td>
              </tr>
              <tr>
                <td>werkbund · dunkel</td>
                <td><code>--semantic-red-fg</code> <code>#fca5a5</code></td>
                <td><code>--surface-card</code> <code>#1d1d21</code></td>
                <td>8,85:1</td>
                <td>1.4.3 (verlangt 4,5:1)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zeilen aus <code>docs/generated/CONTRAST.MD</code>, Block <em>semantic text</em>. Dasselbe Paar schafft 4,5:1 in
          allen vier Stilen in beiden Modi, der rote Fehlerton ist also nie das, was scheitert — und genau deshalb ist der
          Fehlerfall der andere: Eine Farbe, die besteht, sagt trotzdem niemandem etwas, der sie nicht sehen kann.
        </p>

        <h3>Was rot wird, wenn ein Label im Feld sitzt</h3>
        <p>
          Die beiden Label-Hüllen tragen je zwei Invalid-Regeln, die <em>dein</em> Label umfärben: eine auf
          <code>.p-invalid</code>, die dem von dir gebundenen <code>[invalid]</code> folgt, und eine auf
          <code>.ng-invalid.ng-dirty</code>, die Angulars Dirty-Zustand folgt. Die zweite ist eine Ergänzung von Optimus,
          im Quelltext als solche markiert.
        </p>
        <p class="src-note">
          Die <code>.p-invalid</code>-Regeln sind
          <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:102</code> und
          <code>&#64;openng/optimus-ui-styles/dist/iftalabel/index.mjs:33</code>; das an dirty gekoppelte Paar wird in den
          Komponenten selbst angehängt, unter einem Kommentar „For Optimus“
          (<code>openng-optimus-ui-floatlabel.mjs:14</code>, <code>openng-optimus-ui-iftalabel.mjs:16</code>).
        </p>
        <p>
          Beide Regeln ändern eine Farbe und sonst nichts. Folge: Mit einem Label im Feld und ohne Satz darunter ist der
          ganze Fehler ein Farbwechsel am Label — SC 1.4.1 in einer Zeile. Und weil die zweite Regel auf
          <em>dirty</em> reagiert, kann dieser Farbton schon beim ersten Tastendruck kommen, vor dem Gate „berührt oder
          abgeschickt“.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Felder sind in jedem Viewport volle Breite, also wird die Spalte einfach schmaler; nichts bricht in eine zweite
          Spalte um. Die Kit-Konvention fügt einen Breakpoint hinzu: Unter 600px stapelt sich die Aktionszeile, ein Button
          in voller Breite pro Zeile, die Hauptaktion zuerst. Lange Labels und Fehlersätze brechen um — genau deshalb
          stehen Fehler unter dem Feld, wo Umbrechen nichts kostet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Jede editierbare Optimus-Komponente ist darunter dieselbe Komponente: Eine Basisklasse trägt den Formularvertrag,
          eine zweite die Eingabefläche. Wer die beiden Listen kennt, weiß, was jedes Control in einem Formular annimmt.
        </p>

        <h3>Was jedes editierbare Control erbt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Schicht</th>
                <th>Member</th>
                <th>Wo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>BaseEditableHolder</td>
                <td>
                  <code>required</code> · <code>invalid</code> · <code>disabled</code> · <code>name</code>
                  (Signal-Inputs) + die Leitungen des ControlValueAccessor
                </td>
                <td><code>openng-optimus-ui-baseeditableholder.mjs:11-56</code></td>
              </tr>
              <tr>
                <td>BaseInput (eingabeartige Controls)</td>
                <td>
                  <code>fluid</code> · <code>variant</code> · <code>size</code> · <code>inputSize</code> ·
                  <code>pattern</code> · <code>min</code> / <code>max</code> / <code>step</code> ·
                  <code>minlength</code> / <code>maxlength</code>
                </td>
                <td><code>openng-optimus-ui-baseinput.mjs</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Ausgelieferter Quelltext von &#64;openng/optimus-ui&#64;2.0.2. Zwei Kompositionen, die man kennen sollte:
          <code>$disabled = disabled() || _disabled()</code> — der Input und Angulars <code>setDisabledState</code> werden
          ODER-verknüpft (<code>openng-optimus-ui-baseeditableholder.mjs:33</code>) — und der Getter
          <code>hasFluid = fluid() ?? !!pcFluid</code>, der auf einen <code>p-fluid</code>-Vorfahren zurückfällt
          (<code>openng-optimus-ui-baseinput.mjs:7,:80</code>). Das Kit nutzt
          <code>p-fluid</code> nicht; es setzt <code>width: 100%</code> in CSS.
        </p>

        <h3>Was ng-invalid tut — und warum du trotzdem [invalid] bindest</h3>
        <p>
          Angular versieht den Host mit <code>ng-invalid</code>/<code>ng-dirty</code>/<code>ng-touched</code>. Der Input
          <code>invalid</code> setzt <code>p-invalid</code> (<code>openng-optimus-ui-inputtext.mjs:31</code>), und an
          dieser Klasse hängt der ganze Invalid-Look. Aber Optimus hat eine zweite, engere Regel wieder eingeführt, die
          PrimeNG 22 gestrichen hatte: <code>.p-inputtext.ng-invalid.ng-dirty</code> malt Rahmen- und Placeholder-Farbe
          selbst neu (<code>:16-22</code>) — 22 der ausgelieferten Bundles tragen einen gleichwertigen Block.
        </p>
        <p>
          Die beiden Schichten treffen sich also jetzt doch, und zwar schlecht: Diese Regel feuert bei <em>dirty</em>,
          also beim ersten Tastendruck, nicht bei deinem Gate „berührt oder abgeschickt“, und sie malt nur eine Farbe —
          kein <code>aria-invalid</code>, kein Satz. Ein Feld kann deshalb rot werden, während der Fehler des Guides noch
          korrekt verborgen ist. Berechne die Gültigkeit selbst und binde das Tripel: <code>[invalid]</code> bleibt der
          eine Schalter, der den vollständigen, angesagten Zustand trägt, und er hält die Timing-Regel an einer sichtbaren
          Stelle statt in Angulars Dirty/Touched-Heuristik.
        </p>

        <h3>Wie ein Feld sagt, dass es Pflicht ist</h3>
        <p>
          <code>required</code> ist ein Signal-Input auf der editierbaren Basisklasse, dort dokumentiert als „There must be
          a value (if set)“. Er validiert nichts — wie <code>invalid</code> ist er ein Boolean, den du setzt —, aber anders
          als <code>invalid</code> erreicht er das DOM. <strong>Wie weit er reicht, hängt vom Control ab.</strong>
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Gruppe</th>
                <th>Controls</th>
                <th>Was auf dem gerenderten Input landet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>beides</td>
                <td><code>p-autocomplete</code>, <code>p-datepicker</code>, <code>p-select</code></td>
                <td>natives <code>required</code> und <code>aria-required</code></td>
              </tr>
              <tr>
                <td>nur nativ</td>
                <td>
                  <code>p-checkbox</code>, <code>p-radiobutton</code>, <code>p-toggleswitch</code>,
                  <code>p-multiselect</code>, <code>p-cascadeselect</code>, <code>p-password</code>,
                  <code>p-inputotp</code>, <code>p-rating</code>, <code>p-knob</code>
                </td>
                <td>nur natives <code>required</code></td>
              </tr>
              <tr>
                <td>nativ, plus ein zweiter Schalter</td>
                <td><code>p-inputmask</code>, <code>p-inputnumber</code></td>
                <td>
                  natives <code>required</code>; ihr <code>aria-required</code> folgt einem eigenen Input
                  <code>ariaRequired</code>, das Setzen des einen setzt also nicht das andere
                </td>
              </tr>
              <tr>
                <td>keines von beiden</td>
                <td><code>[pInputText]</code>, <code>[pTextarea]</code></td>
                <td>es gibt keinen Input <code>required</code> — du schreibst das native Attribut selbst</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>required</code> wird einmal deklariert, in <code>openng-optimus-ui-baseeditableholder.mjs:11</code>. Die
          beiden Input-Direktiven erweitern stattdessen den Model-Holder (<code>openng-optimus-ui-inputtext.mjs:69</code>,
          <code>openng-optimus-ui-textarea.mjs:69</code>), der Vertrag endet also eine Klasse vor ihnen. Die Spaltung der
          dritten Zeile sieht man direkt nebeneinander: <code>openng-optimus-ui-select.mjs:1712</code> bindet
          <code>aria-required</code> an <code>required()</code>, während
          <code>openng-optimus-ui-inputnumber.mjs:1287</code> es an <code>ariaRequired</code> bindet. Nachstellen: Setz
          das Flag auf je einem Control aus jeder Gruppe und lies die gerenderten Attribute am fokussierbaren Element ab.
        </p>
        <p>
          Natives <code>required</code> reicht, um angesagt zu werden — assistive Technik meldet es aus der Property, und
          <code>novalidate</code> unterdrückt nur die eigenen Fehlerblasen des Browsers, nicht den Zustand. Die ehrliche
          Antwort lautet also: Die Pflicht <em>wird</em> für jedes Control angesagt, das den Input hat, und
          <code>aria-required</code> in der ersten Zeile ist doppelt genäht. Die Lücke, die zählt, sind die dritte Zeile und
          das Sternchen: Ein <code>*</code> im Label ist ein Zeichen ohne angehängte Bedeutung. Schreib das Wort in den
          Label-Text oder markier stattdessen die optionalen Felder — und setz das Attribut unabhängig davon, was du
          anzeigst.
        </p>

        <h3>Wie ein Fehler zu seinem Feld findet</h3>
        <p>
          <strong>Keine Komponente verknüpft je eine Meldung für dich mit einem Control.</strong> Die Verknüpfung ist eine
          id, die du dem Fehlerknoten gibst, und ein <code>aria-describedby</code>, das du am Control bindest — das Paar,
          das der Feld-Snippet im Tab Verwendung zeigt, und der Grund, warum beide Seiten eine id tragen, die nur du synchron
          hältst. Genau ein Control bietet dafür überhaupt einen typisierten Input an, <code>ariaDescribedBy</code> von
          <code>p-inputnumber</code>; überall sonst schreibst du das Attribut auf den Host oder erreichst es, wo das
          fokussierbare Element innen gerendert wird, über das Pass-through-Objekt weiter unten.
        </p>
        <p>
          Damit ist die Wahl des Fehlerknotens eine echte Wahl. <code>p-message</code> ist die Meldungs-Anatomie der
          Bibliothek, aber ihr Host ist eine dauerhafte Live-Region: Sie sagt sich beim Rendern selbst an, wo auch immer
          der Fokus ist. Als Fehler eines einzelnen Felds ist das eine zweite Ansage zusätzlich zur Beschreibung, und ein
          Absenden, das vier Fehler aufdeckt, löst vier davon aus. Behalte <code>p-message</code> für den Fehler des
          ganzen Formulars — ein Knoten, eine Ansage — und lass den Fehler eines Felds ein einfaches Element sein, das nur
          <code>aria-describedby</code> erreicht.
        </p>
        <pre class="code-block"><code>{{ errorNodeSnippet }}</code></pre>
        <p class="src-note">
          Die Live-Region-Attribute sind statische Host-Attribute an der Meldungskomponente, keine Inputs
          (<code>openng-optimus-ui-message.mjs:350-351</code>) — <strong>Feedback Messages</strong> besitzt diese Anatomie.
          Die Komponente rendert außerdem kein Icon, solange keines benannt ist (<code>:249</code>), eine Severity kommt
          also als Farbe plus dein Satz an.
        </p>

        <h3>Wohin <code>p-fluid</code> reicht und wo es aufhört</h3>
        <p>
          <code>p-fluid</code> sieht aus wie ein Styling-Wrapper und ist keiner: <strong>Kein Stylesheet im Theme oder im
          Style-Paket enthält eine Regel <code>.p-fluid</code>.</strong> Die Klasse ist wirkungslos. Der Effekt reist
          stattdessen per Dependency Injection — ein Control fragt seine Vorfahren nach einer <code>Fluid</code>-Instanz
          und rendert, wenn es eine findet, über seine eigene Fluid-Klasse in voller Breite.
        </p>
        <p>
          Nur manche Controls fragen. Einige fragen über die gemeinsame Input-Basis (<code>p-autocomplete</code>,
          <code>p-datepicker</code>, <code>p-inputmask</code>, <code>p-inputnumber</code>, <code>p-password</code>,
          <code>p-select</code>); die übrigen fragen direkt (<code>pButton</code>, <code>p-cascadeselect</code>,
          <code>[pInputText]</code>, <code>p-multiselect</code>, <code>[pTextarea]</code>, <code>p-treeselect</code>).
          Alles andere — Checkbox, Radio Button, Toggle Switch, Select Button, Slider, Rating, OTP — ignoriert den Wrapper
          vollständig. Folge: Ein Formular in einem einzigen <code>p-fluid</code> kommt halb gestreckt heraus, und die
          schmal gebliebenen Controls sind genau die, die niemand zu prüfen denkt.
        </p>
        <p class="src-note">
          Die Suche ist <code>inject(Fluid, &#123; optional: true, host: true, skipSelf: true &#125;)</code> mit
          <code>hasFluid = fluid() ?? !!pcFluid</code> (<code>openng-optimus-ui-baseinput.mjs:7</code> und
          <code>:80</code>); der Wrapper selbst deklariert nur seine Klasse
          (<code>openng-optimus-ui-fluid.mjs:9</code>). Nachstellen: Leg einen Wrapper um ein Textfeld und eine Checkbox
          und vergleich ihre gerenderten Breiten. Wo der Wrapper nicht hinreicht, funktioniert der Input
          <code>[fluid]</code> pro Control weiterhin.
        </p>

        <h3>Ein Input, der nichts ändert</h3>
        <p>
          <code>p-iconfield</code> nimmt eine <code>iconPosition</code> von <code>'left'</code> oder <code>'right'</code>
          und macht daraus eine Klasse auf dem Host. <strong>Keine der beiden Klassen ist irgendwo gestylt.</strong> Die
          Seite des Icons entscheidet allein die Reihenfolge im Dokument: Die Positionierungsregeln hängen an
          <code>:first-child</code> und
          <code>:last-child</code>, ebenso das Padding, das den Text davon freihält. Schreib das Icon vor den Input für ein
          vorangestelltes Icon, danach für ein nachgestelltes, und behandle <code>iconPosition</code> als wirkungslos.
        </p>
        <p class="src-note">
          Die Klassen entstehen in <code>openng-optimus-ui-iconfield.mjs:13-14</code> und werden nirgends verwendet; die
          Regeln, die das Icon tatsächlich platzieren, sind
          <code>&#64;openng/optimus-ui-styles/dist/iconfield/index.mjs:16-22</code>. Nachstellen: Render ein Icon-Feld mit
          dem Icon zuerst geschrieben und der Position auf die Gegenseite gesetzt, und sieh nach, welche Kante es belegt.
        </p>
        <p>
          Zwei weitere Inputs derselben Komponente sind nicht für Autoren gedacht: <code>styleClass</code> ist zugunsten von
          <code>class</code> als veraltet markiert, und <code>hostName</code> existiert, damit die Pass-through-Mechanik
          ihren Konfigurationseintrag findet.
        </p>

        <h3>Fokusübergaben bei Zweigwechseln</h3>
        <p>
          Erfolgs-Panels, zweistufige Bestätigungen und geleerte Listen zerstören alle das Element, auf dem der Nutzer
          gerade stand. Erst rendern, dann fokussieren, was es ersetzt hat:
        </p>
        <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

        <h3>Erster Fokus: wohin <code>pAutoFocus</code> gehört und wohin nicht</h3>
        <p>
          <code>[pAutoFocus]</code> ist eine Standalone-Direktive mit einem gleichnamigen Input. Außer wenn der Input
          <code>false</code> ist, schreibt sie ein natives <code>autofocus</code>-Attribut auf ihren Host, geschrieben nach dem Einfügen, sodass
          die eigene Autofocus-Verarbeitung des Browsers nie darauf reagiert. Ist der Input truthy, fokussiert sie außerdem,
          aus einem <code>setTimeout</code> nach dem Prüfen der View, das erste fokussierbare Kindelement des Hosts oder,
          wenn es keines gibt, den Host selbst. Das tut sie einmal pro Instanz der Direktive und nur im Browser. Achtzehn Bundles der Bibliothek betten sie ein, die meisten hinter einem eigenen
          <code>autofocus</code>-Input, also gilt alles unten ebenso für <code>autofocus</code> von
          <code>p-select</code> wie für die nackte Direktive.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Wer den ersten Fokus setzt</th>
                <th>Warum nicht <code>pAutoFocus</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eine geroutete Seite lädt</td>
                <td>Die App-Shell: <code>&lt;main&gt;</code> bei jedem <code>NavigationEnd</code></td>
                <td>
                  Der Timer der Direktive konkurriert mit der Shell; ein Leser, der mitten im Formular landet, überspringt
                  die Überschrift, die Anleitung und den Skip-Link, und eine Touch-Tastatur verdeckt den halben Bildschirm
                </td>
              </tr>
              <tr>
                <td>Ein Dialog öffnet sich</td>
                <td><code>focusOnShow</code> von <code>p-dialog</code>: sein erstes fokussierbares Element, nach der Eingangsanimation</td>
                <td>Der eigene Timer des Dialogs läuft nach dem der Direktive und gewinnt; stell stattdessen das richtige Control an den Anfang</td>
              </tr>
              <tr>
                <td>Ein Absenden scheitert an der Validierung</td>
                <td>Niemand, oder dein expliziter <code>.focus()</code> auf das erste ungültige Feld</td>
                <td>Die Felder existieren schon, und ihre Direktiven haben schon gefeuert; nichts läuft erneut</td>
              </tr>
              <tr>
                <td>Ein Zweigwechsel ersetzt, was den Fokus hatte</td>
                <td>Dein expliziter <code>.focus()</code>, nach dem Rendern (oben)</td>
                <td>Funktioniert bei einem neu erzeugten Zweig, aber der explizite Aufruf nennt das Ziel und läuft in bekannter Reihenfolge</td>
              </tr>
              <tr>
                <td>Ein Klick deckt ein Inline-Feld oder einen nächsten Schritt auf</td>
                <td><code>[pAutoFocus]="true"</code> auf dem aufgedeckten Feld oder seinem Container</td>
                <td>— das ist der Einsatzzweck: Der Leser hat den Inhalt angefordert, und der Fokus folgt der Anforderung</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ autofocusSnippet }}</code></pre>
        <p class="src-note">
          Verhalten der Direktive aus <code>openng-optimus-ui-autofocus.mjs</code>: das Schreiben des Attributs
          <code>:21-32</code>, die Truthiness-Prüfung und der Guard <code>isPlatformBrowser</code> <code>:39</code>, die
          Suche nach dem ersten fokussierbaren Element <code>:41-47</code>, das Nur-einmal-Flag <code>:48</code>, der
          Input-Alias <code>pAutoFocus</code> <code>:61-64</code>. Der erste Fokus des Dialogs ist
          <code>openng-optimus-ui-dialog.mjs:620-627</code> und <code>:949-952</code>; der der Shell ist das
          <code>NavigationEnd</code>-Abonnement in
          <code>src/app/app.component.ts</code>.
        </p>

        <h3>Einen Input erreichen, den die Komponente nicht freigibt</h3>
        <p>
          <code>p-checkbox</code> hat keinen Input <code>ariaDescribedBy</code>; das Pass-through-Objekt ist der
          unterstützte Weg auf das echte <code>&lt;input&gt;</code>, das sie rendert:
        </p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>
            ☐ Jedes Control beschriftet — <code>label[for]</code>/<code>inputId</code>, oder Beschriftung +
            <code>ariaLabelledBy</code> auf Combobox-Hosts.
          </li>
          <li>☐ <code>novalidate</code> auf dem Formular; Fehler übersetzt und am Feld verankert.</li>
          <li>
            ☐ <code>[invalid]</code> + <code>aria-invalid</code> + <code>aria-describedby</code> zusammen gebunden, mit
            Gate auf „berührt oder abgeschickt“.
          </li>
          <li>☐ Absenden markiert alle Felder als berührt; ein ungültiges Absenden ändert keinen Zustand, den es nicht erklären kann.</li>
          <li>☐ Jeder Zweigwechsel übergibt den Fokus an das, was den Zweig ersetzt hat.</li>
          <li>
            ☐ Kein <code>pAutoFocus</code> (oder <code>autofocus</code> einer Komponente) beim Laden der Seite oder in einem
            Dialog; wo es eingesetzt wird, ist es gebunden — <code>[pAutoFocus]="true"</code> — auf Inhalt, den der Leser
            gerade aufgedeckt hat.
          </li>
          <li>☐ Ergebnis einmal angesagt: Region mit <code>role="status"</code> + verschobener Fokus, kein Toast obendrauf.</li>
          <li>☐ Overlay-Controls in abschneidenden Containern tragen <code>appendTo="body"</code>.</li>
          <li>☐ Tastaturfokus auf jedem Control sichtbar — Familienregeln oder dein eigenes <code>:focus-visible</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Ein Formular besteht größtenteils aus Strings: Labels, Hinweise, ein Fehlersatz pro Regel und die zwei oder drei
          Wörter auf dem Absende-Button, die sich ändern, während er läuft. Alle sind Keys; die einzigen Übersetzungen, die
          die Bibliothek selbst braucht, sind ihre ARIA-Strings, die
          <strong>I18n &amp; Localization</strong> über die Config-Brücke leitet.
        </p>

        <h3>Ein Key pro Feld und Regel</h3>
        <p>
          Der Fehler-Namespace ist flach und pro Regel angelegt (<code>error.emailInvalid</code>,
          <code>error.messageTooShort</code>, <code>error.consentRequired</code>) — eine Regel löst genau einen ganzen Satz
          aus. Setz einen Fehler nie aus Fragmenten zusammen: Wortstellung und Fall gehören dem Übersetzer. Die
          Pflichtmarkierung ist ein eigener Key, als Text im Label gerendert, kein nacktes Sternchen, das ein Screenreader
          als „Stern“ vorliest.
        </p>

        <h3>Wo längerer Text drückt</h3>
        <ul>
          <li>
            <strong>Labels</strong> sitzen über Feldern in voller Breite, also bricht längerer Text um, statt zu kollidieren
            — plan ungefähr das 1,4-Fache der englischen Breite ein, bevor du von einer Zeile ausgehst.
          </li>
          <li>
            <strong>Fehlersätze</strong> brechen absichtlich unter dem Feld um; das Icon bleibt links in der ersten Zeile.
          </li>
          <li>
            <strong>Das Label des Absende-Buttons</strong> ändert sich beim Senden („Wird gesendet …“); bemiss den Button
            für den längeren der beiden Zustände in der längsten Sprache, oder nimm den Breitensprung hin.
          </li>
          <li>
            <strong>Placeholder</strong> werden übersetzt wie jeder String, führen aber nur das Format vor — das Label trägt
            den Namen, also verliert ein abgeschnittener Placeholder ein Beispiel, nicht die Bedeutung des Felds.
          </li>
          <li>
            <strong>Der Zähler</strong> („140 / 600“) besteht aus sprachneutralen Ziffern mit einem
            <code>sr-only</code>-Präfix, das benennt, was gezählt wird — dieses Präfix ist der Key.
          </li>
          <li>
            <strong>Ein Label im Feld</strong> hat überhaupt keinen Platz zum Umbrechen: Es ist absolut auf einer einzigen
            Zeile über oder in dem Control positioniert, und die Float-Variante verkleinert es nach dem Anheben noch weiter.
            Ein Label, das auf Englisch passt, läuft auf Deutsch oder Finnisch über die Kante des Felds hinaus, statt
            umzubrechen. Muss ein Formular jede Sprache überstehen, gehört das Label über das Feld.
          </li>
        </ul>
        <p class="src-note">
          Key-Formen und die Fallback-Kette sind das Terrain von <strong>I18n &amp; Localization</strong>; das Budget des
          1,4-Fachen ist die W3C-Richtlinie zur Textlänge, die dieser Guide zitiert.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokusrunden: Design ergänzt die Kante
            des Trigger-Buttons im Date Picker, die Label-Farben des Kits (Float und Ifta), die dunkle Füllung jeder
            Feldhülle und den Ring auf dem fokussierten Autocomplete-Chip, jeweils im Kompilat abgesichert.
          </li>
          <li>
            <strong>v0.4</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokusrunden: Design listet jedes Feld,
            das das Kit auf <code>--control-border</code> umlenkt, die Invalid-Kante des Kits mit <code>--semantic-red-fg</code>
            (nicht mehr „das Token des Presets“), die Icon-Farbe und wohin der eine Ring des Kits reicht, jeweils im
            Kompilat abgesichert.
          </li>
          <li>
            <strong>v0.3</strong> — 23.09.2026 — Der Guide behandelt jetzt <code>[pAutoFocus]</code>: seinen Vertrag im
            Agent-Dokument, ein Live-Beispiel an aufgedecktem Inhalt und eine Tabelle in Entwicklung, wohin der erste Fokus
            stattdessen gehört (Laden der Seite, Dialoge, gescheitertes Absenden). Design nennt die umgelenkte Feldkante und
            die dunkle Feldfläche des Kits neben der Preset-Tabelle, abgesichert im Kontrast-Kompilat.
          </li>
          <li>
            <strong>v0.2</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): Die Aussage „ng-invalid
            bewegt nichts“ hat sich umgekehrt — Optimus führt eine Rahmenregel <code>.ng-invalid.ng-dirty</code> wieder ein
            (22 Bundles), ein Feld kann also beim ersten Tastendruck rot werden, vor dem Gate „berührt oder abgeschickt“.
            Token-Tabelle neu von Aura 2.x abgelesen: Paddings sm/base/lg 0.375/0.5/0.625rem in y und 0.625/0.75/0.875rem
            in x, Schriftgrößen sm/lg 0.875/1.125rem, ohne Basis-Token <code>fontSize</code> (die Basis 1rem ist ein
            CSS-Literal); Fokus-Ring weiterhin vollständig genullt. Basisklassen-Verweise gegen die Optimus-Bundles neu
            hergeleitet (<code>hasFluid</code> bei baseinput <code>:80</code>, nicht <code>:85</code>).
          </li>
          <li>
            <strong>v0.1</strong> — 24.08.2026 — Erste Fassung des Guides: das Feldmuster und sein Fehler-Tripel, das
            Validierungsmodell aus Signals und Computeds mit Touched-Gate, der Basisklassen-Vertrag, den jedes editierbare
            Control erbt (gemessen an primeng&#64;22.1.2 und dem formField-Block von Aura 3.0), und die Zustandsmaschine
            fürs Absenden mit Fokusübergaben.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class FormsArticleDeComponent extends FormsArticleComponent {
  /** The demo dates in German notation (shown in the read-only example fields). */
  override readonly staticOk: string = '03.11.2024';
  override readonly staticBad: string = '03.11.2044';

  /** The measured values of the English article, with the prose around them in German. */
  override readonly m = {
    smFont: '0.875rem (14px)',
    baseFont: '1rem (16px, CSS-Literal — kein Token)',
    lgFont: '1.125rem (18px)',
    smPadX: '0.625rem',
    basePadX: '0.75rem',
    lgPadX: '0.875rem',
    smPadY: '0.375rem',
    basePadY: '0.5rem',
    lgPadY: '0.625rem',
  };
}
