import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RadioButtonArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './radiobutton-article.component';

/** German prose of the examples, keyed by example id. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  canonical: {
    title: 'Die kanonische Gruppe',
    note: 'Fieldset, Legend, ein gemeinsamer Name, eine Beschriftung pro Option. Spring einmal mit Tab hinein und nutz die Pfeiltasten — das ist der ganze Vertrag.',
  },
  describe: {
    title: 'Optionen mit Beschreibung',
    note: 'Das Detail gehört neben die Beschriftung, nicht hinein, damit das Klickziel so groß bleibt wie eine Antwort. Es gibt keinen Input ariaDescribedBy — pt ist der Weg.',
  },
  sizes: {
    title: 'Größen: small, default, large',
    note: 'Der Input size ändert die Größe von Box und Punkt und fasst sonst nichts an — Zeilenhöhe, Abstand und Beschriftung gehören in allen dreien dir.',
  },
  variant: {
    title: 'Umrandet und gefüllt',
    note: 'Die Variante ändert nur den Hintergrund im nicht gewählten Zustand; ein ausgewähltes Radio sieht in beiden Fällen gleich aus. Setz sie pro Komponente oder global über die Konfiguration inputStyle / inputVariant.',
  },
  states: {
    title: 'Eine Option deaktiviert, eine ungültige Gruppe, eine deaktivierte Gruppe',
    note: 'Oben: Eine deaktivierte Option ist ein echter deaktivierter Input — geh mit Tab durch und beachte, dass sie übersprungen wird, anders als ein deaktiviertes Segment eines Segmented Controls. Mitte: [invalid] färbt den Ring um und sagt nichts an, deshalb wird die Meldung darunter vom Fieldset aus referenziert. Unten: die ganze Gruppe deaktiviert, ihre Antwort bleibt sichtbar.',
  },
  other: {
    title: 'Eine Option, die eine Nachfrage öffnet',
    note: 'Die klassische Zeile „Sonstiges“. Lass das zusätzliche Feld im Fieldset und hinter der Option, zu der es gehört, damit die Lesereihenfolge der visuellen entspricht.',
  },
};

/**
 * German twin of the Radio Button guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (option
 * labels, example titles and notes, the prose of the measured values) are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs radiobutton`).
 */
@Component({
  selector: 'app-radiobutton-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'radiobutton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jede Gruppe unten ist eine echte Menge von <code>p-radiobutton</code>-Komponenten. Anders als bei den meisten
          Controls in diesem Kit gibt es keine Gruppen-Komponente: Eine Radio-Gruppe setzt du aus einzelnen Radios, einem
          gemeinsamen <code>name</code>, einem <code>&lt;fieldset&gt;</code> und einem <code>&lt;label&gt;</code> pro
          Option zusammen. Die Beispiele sind genau dieser Zusammenbau.
        </p>

        <section class="pg" aria-label="RadioButton-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-count-label">Optionen</span>
                <p-select
                  [ariaLabelledBy]="'pg-count-label'"
                  size="small"
                  [options]="countOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgCount()"
                  (ngModelChange)="pgCount.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Größe</span>
                <p-select
                  [ariaLabelledBy]="'pg-size-label'"
                  size="small"
                  [options]="sizeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSize()"
                  (ngModelChange)="pgSize.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-layout-label">Anordnung</span>
                <p-select
                  [ariaLabelledBy]="'pg-layout-label'"
                  size="small"
                  [options]="layoutOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgLayout()"
                  (ngModelChange)="pgLayout.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-filled">Gefüllte Variante</label>
                <p-toggleswitch inputId="pg-filled" [ngModel]="pgFilled()" (ngModelChange)="pgFilled.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-invalid">Ungültig</label>
                <p-toggleswitch inputId="pg-invalid" [ngModel]="pgInvalid()" (ngModelChange)="pgInvalid.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Deaktiviert</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <fieldset class="rb-group" [class.rb-group--row]="pgLayout() === 'row'">
                  <legend>Lieferung</legend>
                  @for (o of pgOptions(); track o.value) {
                    <div class="rb-row">
                      <p-radiobutton
                        name="rb-pg"
                        [inputId]="'pg-' + o.value"
                        [value]="o.value"
                        [size]="pgSizeInput()"
                        [variant]="pgFilled() ? 'filled' : 'outlined'"
                        [invalid]="pgInvalid()"
                        [disabled]="pgDisabled()"
                        [ngModel]="pgValue()"
                        (ngModelChange)="pgValue.set($event)"
                      />
                      <label [for]="'pg-' + o.value">{{ o.label }}</label>
                    </div>
                  }
                </fieldset>
              </div>
              <p class="pg__readout">
                Modell: <code>{{ pgReadout() }}</code>
              </p>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Erzeugtes Markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
          <p class="ex__note">
            Spring mit Tab in die Gruppe und drück die Pfeiltasten: Die Auswahl wandert und das Modell folgt, weil jedes
            Radio oben denselben <code>name</code> trägt. Das ist Browserverhalten, kein Feature der Bibliothek &mdash; im
            Tab Verwendung steht das Paar, das zeigt, was ohne ihn passiert.
          </p>
        </section>

        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title" [id]="'ex-' + ex.id">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('canonical') {
                  <fieldset class="rb-group" id="ex-canonical-group">
                    <legend>Liefergeschwindigkeit</legend>
                    @for (o of shippingOptions; track o.value) {
                      <div class="rb-row">
                        <p-radiobutton
                          name="rb-canonical"
                          [inputId]="'ship-' + o.value"
                          [value]="o.value"
                          [ngModel]="shipping()"
                          (ngModelChange)="shipping.set($event)"
                        />
                        <label [for]="'ship-' + o.value">{{ o.label }}</label>
                      </div>
                    }
                  </fieldset>
                  <span class="ex__readout">Modell: {{ shipping() }}</span>
                }
                @case ('describe') {
                  <fieldset class="rb-group">
                    <legend>Tarif</legend>
                    @for (o of planOptions; track o.value) {
                      <div class="rb-row rb-row--desc">
                        <p-radiobutton
                          name="rb-plan"
                          [inputId]="'plan-' + o.value"
                          [value]="o.value"
                          [pt]="{ input: { 'aria-describedby': 'plan-' + o.value + '-hint' } }"
                          [ngModel]="plan()"
                          (ngModelChange)="plan.set($event)"
                        />
                        <div class="rb-text">
                          <label [for]="'plan-' + o.value">{{ o.label }}</label>
                          <span class="rb-hint" [id]="'plan-' + o.value + '-hint'">{{ o.hint }}</span>
                        </div>
                      </div>
                    }
                  </fieldset>
                }
                @case ('sizes') {
                  <div class="ex__stack">
                    @for (s of sizeRows; track s.key) {
                      <fieldset class="rb-group rb-group--row">
                        <legend>{{ s.label }}</legend>
                        @for (o of twoOptions; track o.value) {
                          <div class="rb-row">
                            <p-radiobutton
                              [name]="'rb-size-' + s.key"
                              [inputId]="'size-' + s.key + '-' + o.value"
                              [value]="o.value"
                              [size]="s.size"
                              [ngModel]="sizeValues()[s.key]"
                              (ngModelChange)="setSizeValue(s.key, $event)"
                            />
                            <label [for]="'size-' + s.key + '-' + o.value">{{ o.label }}</label>
                          </div>
                        }
                      </fieldset>
                    }
                  </div>
                }
                @case ('variant') {
                  <div class="ex__stack">
                    <fieldset class="rb-group rb-group--row" id="ex-variant-outlined">
                      <legend>Umrandet (Standard)</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-var-out"
                            [inputId]="'var-out-' + o.value"
                            [value]="o.value"
                            [ngModel]="varOutlined()"
                            (ngModelChange)="varOutlined.set($event)"
                          />
                          <label [for]="'var-out-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                    <fieldset class="rb-group rb-group--row" id="ex-variant-filled">
                      <legend>Gefüllt</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-var-fill"
                            variant="filled"
                            [inputId]="'var-fill-' + o.value"
                            [value]="o.value"
                            [ngModel]="varFilled()"
                            (ngModelChange)="varFilled.set($event)"
                          />
                          <label [for]="'var-fill-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                  </div>
                }
                @case ('states') {
                  <div class="ex__stack">
                    <fieldset class="rb-group" id="ex-states-partial">
                      <legend>Eine Option deaktiviert</legend>
                      @for (o of seatOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-seat"
                            [inputId]="'seat-' + o.value"
                            [value]="o.value"
                            [disabled]="o.soldOut"
                            [ngModel]="seat()"
                            (ngModelChange)="seat.set($event)"
                          />
                          <label [for]="'seat-' + o.value" [class.rb-label--off]="o.soldOut">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                    <fieldset class="rb-group rb-group--row" id="ex-states-invalid" aria-describedby="ex-states-error">
                      <legend>Ungültige Gruppe</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-inv"
                            [inputId]="'inv-' + o.value"
                            [value]="o.value"
                            [invalid]="true"
                            [required]="true"
                            [ngModel]="invalidValue()"
                            (ngModelChange)="invalidValue.set($event)"
                          />
                          <label [for]="'inv-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                    <p class="rb-error" id="ex-states-error">Wähl eine Option, um fortzufahren.</p>
                    <fieldset class="rb-group rb-group--row" id="ex-states-disabled">
                      <legend>Ganze Gruppe deaktiviert</legend>
                      @for (o of twoOptions; track o.value) {
                        <div class="rb-row">
                          <p-radiobutton
                            name="rb-dis"
                            [inputId]="'dis-' + o.value"
                            [value]="o.value"
                            [disabled]="true"
                            [ngModel]="'yes'"
                          />
                          <label [for]="'dis-' + o.value">{{ o.label }}</label>
                        </div>
                      }
                    </fieldset>
                  </div>
                }
                @case ('other') {
                  <fieldset class="rb-group">
                    <legend>Grund</legend>
                    @for (o of reasonOptions; track o.value) {
                      <div class="rb-row">
                        <p-radiobutton
                          name="rb-reason"
                          [inputId]="'reason-' + o.value"
                          [value]="o.value"
                          [ngModel]="reason()"
                          (ngModelChange)="reason.set($event)"
                        />
                        <label [for]="'reason-' + o.value">{{ o.label }}</label>
                      </div>
                    }
                    @if (reason() === 'other') {
                      <div class="rb-followup">
                        <label for="reason-other-text">Erzähl uns mehr</label>
                        <input
                          id="reason-other-text"
                          type="text"
                          class="rb-input"
                          [value]="reasonText()"
                          (input)="onReasonText($event)"
                        />
                      </div>
                    }
                  </fieldset>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Eine Radio-Gruppe beantwortet eine Frage mit genau einer Option aus einer sichtbaren, benannten Menge, und sie
          ist das einzige Control der Bibliothek, das das mit echter Formular-Semantik tut. Alles auf diesem Tab ist die
          Grenze zwischen ihr und den Controls, die ihr ähnlich sehen.
        </p>

        <h3>Vier Fragen, der Reihe nach</h3>
        <ol>
          <li>
            <strong>Wie viele Antworten dürfen gleichzeitig zutreffen?</strong> Mehr als eine oder keine ist eine
            Checkbox-Gruppe. Genau eine ist eine Radio-Gruppe. Das ist die einzige Frage, deren richtige Antwort nicht vom
            Layout abhängt, und sie kommt zuerst.
          </li>
          <li>
            <strong>Wird die Auswahl mit dem Formular abgeschickt, validiert oder zurückgesetzt?</strong> Wenn ja, ist die
            Antwort eine Radio-Gruppe, auch wenn ein Segmented Control schöner aussähe: Sie ist hier das einzige exklusive
            Control, das <code>name</code>, <code>required</code> und <code>checked</code> ins DOM bringt, und das einzige,
            dessen Exklusivität eine Garantie des Browsers ist statt der Buchführung einer Komponente.
          </li>
          <li>
            <strong>Wirkt die Auswahl in dem Moment, in dem sie getroffen wird?</strong> Eine Einstellung, die sofort
            greift, ist ein Switch (ein Boolean) oder ein Segmented Control (zwei bis vier Werte). Eine Radio-Gruppe setzt
            ein Speichern oder ein Weiter voraus.
          </li>
          <li>
            <strong>Wie viele Optionen, und wie lang sind die Beschriftungen?</strong> Zwei bis fünf kurze, untereinander
            gestapelt: Radio-Gruppe. Sechs oder mehr, oder Optionen, die je einen Satz Erklärung brauchen, oder eine Menge,
            die zur Laufzeit wächst: <code>p-select</code>.
          </li>
        </ol>

        <h3>Die Tabelle zur Wahl des Controls</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Control</th>
                <th>Warum keine Radio-Gruppe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Genau eine von 2&ndash;5 benannten Optionen, in einem Formular, das abgeschickt oder validiert wird</td>
                <td>
                  <strong><code>p-radiobutton</code></strong>
                </td>
                <td>&mdash;</td>
              </tr>
              <tr>
                <td>Null bis viele unabhängige Antworten</td>
                <td><code>p-checkbox</code></td>
                <td>
                  Eine Radio-Gruppe kann der Nutzer nicht leeren: Ist einmal eine Option gewählt, führt der einzige Weg zurück
                  zu „nichts ausgewählt“ über einen Leeren-Button, den du selbst schreibst.
                </td>
              </tr>
              <tr>
                <td>2&ndash;4 kurze exklusive Optionen, die beim Klick greifen, alle sichtbar in einer Reihe</td>
                <td><code>p-selectbutton</code></td>
                <td>
                  An einer Radio-Gruppe ist hier nichts falsch; das Segmented Control ist dichter und liest sich als
                  View-Control. Dreh es um, wenn der Wert ein Formularfeld ist: SelectButton legt gedrückte Buttons offen und
                  trägt nichts zu einem Submit bei.
                </td>
              </tr>
              <tr>
                <td>Ein Boolean, der sofort greift (Benachrichtigungen an/aus)</td>
                <td><code>p-toggleswitch</code></td>
                <td>
                  Zwei Radios mit den Beschriftungen An und Aus verbrauchen eine ganze Gruppe und zwei Tab-Stopps Lesezeit für
                  einen Zustand, den ein Switch auf einen Blick zeigt.
                </td>
              </tr>
              <tr>
                <td>Ein Boolean, der in einer Toolbar wie ein Button aussehen muss („Fett“, „Stumm“)</td>
                <td><code>p-togglebutton</code></td>
                <td>
                  Ein einzelnes Radio ist die eine Form, die eine Radio-Gruppe nie annehmen darf: Es lässt sich anhaken und nie
                  wieder abhaken, der Nutzer kann seinen ersten Klick also nicht rückgängig machen.
                </td>
              </tr>
              <tr>
                <td>Genau eine von 6&ndash;25 Optionen, oder Beschriftungen, die länger als ein paar Wörter sind</td>
                <td><code>p-select</code></td>
                <td>
                  Radios kosten je eine Zeile und klappen nie zusammen; eine lange Menge schiebt das Formular unter den
                  sichtbaren Bereich und macht aus der Auswahl ein Scrollen.
                </td>
              </tr>
              <tr>
                <td>Genau eine aus einer langen Liste, die sichtbar bleiben und an Ort und Stelle scrollen soll</td>
                <td><code>p-listbox</code></td>
                <td>
                  Eine Listbox ist ein Tab-Stopp mit einem Scroll-Viewport; eine Radio-Gruppe ist ein Stapel im
                  Dokumentfluss, der die Seite wachsen lässt. Beachte den Tausch: Eine Listbox sagt <code>option</code> an,
                  nicht <code>radio</code>, und trägt keinen <code>name</code>.
                </td>
              </tr>
              <tr>
                <td>Wechsel zwischen parallelen Ansichten eines Themas</td>
                <td><code>p-tabs</code></td>
                <td>
                  Das ist Navigation, kein Wert. Tabs besitzen die Verdrahtung von Tablist und Panel; eine Radio-Gruppe hat
                  überhaupt keine Beziehung zu einem Panel.
                </td>
              </tr>
              <tr>
                <td>
                  Eine exklusive Auswahl an einer Stelle, an der das Formular-Styling des Themes nicht greift &mdash; ein
                  Print-Stylesheet, eine nackte Hilfsseite, eine Komponente, die kein Optimus-Modul hereinziehen darf
                </td>
                <td><code>&lt;input type="radio"&gt;</code></td>
                <td>
                  Daran ist nichts falsch. Die Komponente umhüllt genau dieses Element und fügt den Aura-Look plus einen
                  <code>ControlValueAccessor</code> hinzu &mdash; keine Gruppe, keine Tastaturbehandlung, kein ARIA über das
                  des nativen Inputs hinaus. Außerdem <em>verlangt</em> sie ein Angular-Formular-Binding, das der schlichte
                  Input nicht braucht. Greif zum nativen Element, wenn du den Look nicht brauchst.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Die letzte Zeile ist die, die du dir merken solltest:
          <strong>Alles, was dieses Control gut kann, erbt es.</strong> Die Gruppierung, die Pfeiltasten, die
          Exklusivität, die Beschriftung und das Submit-Verhalten gehören dem Browser; die Komponente steuert Theming und
          Angular-Formular-Integration bei. Deshalb verwendet der Rest dieses Guides den größten Teil seiner Länge auf
          Markup, das du um sie herum schreibst, statt auf Inputs, die du ihr übergibst.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Vier Fehler, die du dir merken solltest, auf beiden Seiten gerendert. Das
          <span class="tag tag--bad">Don’t</span> steht links, das <span class="tag tag--good">Do</span> rechts. Das
          erste Paar ist das, das einen ganzen Tastaturvertrag kostet.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; Radios ohne gemeinsamen Namen</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight" id="dd-name-bad">
                <legend>Abrechnungszeitraum</legend>
                @for (o of billingOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      [inputId]="'bad-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddBad()"
                      (ngModelChange)="ddBad.set($event)"
                    />
                    <label [for]="'bad-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why" id="dd-name-bad-why">
              Es sieht richtig aus, weil das gemeinsame Angular-Modell die anderen abwählt. Aber diese drei Inputs sind
              überhaupt keine Radio-Gruppe: Jeder ist ein eigener Tab-Stopp, und nichts im DOM verbindet sie. Geh mit Tab
              durch beide Zellen und zähl mit.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; ein Name für die ganze Gruppe</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight" id="dd-name-good">
                <legend>Abrechnungszeitraum</legend>
                @for (o of billingOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-good"
                      [inputId]="'good-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddGood()"
                      (ngModelChange)="ddGood.set($event)"
                    />
                    <label [for]="'good-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why">
              Ein Tab-Stopp für die ganze Gruppe, Pfeiltasten, die die Auswahl bewegen, und eine echte Radio-Gruppe im DOM,
              die ohne Hilfe von Angular exklusiv bleibt. Der
              <code>name</code> ist es, der alle drei erkauft &mdash; siehe den Tab Entwicklung.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; ein einzelnes Radio als Ja/Nein</span>
            <div class="dd__stage">
              <div class="rb-row">
                <p-radiobutton
                  name="rb-dd-lone"
                  inputId="dd-lone"
                  [binary]="true"
                  [ngModel]="ddLone()"
                  (ngModelChange)="ddLone.set($event)"
                />
                <label for="dd-lone">Ich akzeptiere die Bedingungen</label>
              </div>
            </div>
            <p class="dd__why">
              Klick es an. Jetzt gibt es keinen Weg zurück: Ein Radio hat keine Nutzergeste, die es abwählt, eine
              versehentlich gegebene Zustimmung lässt sich also ohne ein Zurücksetzen nicht widerrufen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; eine Checkbox für einen Boolean</span>
            <div class="dd__stage">
              <div class="rb-row">
                <p-checkbox
                  inputId="dd-consent"
                  [binary]="true"
                  [ngModel]="ddConsent()"
                  (ngModelChange)="ddConsent.set($event)"
                />
                <label for="dd-consent">Ich akzeptiere die Bedingungen</label>
              </div>
            </div>
            <p class="dd__why">
              Eine Checkbox schaltet in beide Richtungen, wird als Checkbox angesagt und ist das, was eine Zustimmung sein
              muss, damit man sie nach dem Erteilen wieder verweigern kann.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; neun Optionen als Radios</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight rb-group--scroll">
                <legend>Land</legend>
                @for (o of countryOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-many"
                      [inputId]="'many-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddMany()"
                      (ngModelChange)="ddMany.set($event)"
                    />
                    <label [for]="'many-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why">
              Neun Zeilen Formular für eine Antwort. Die Menge ist außerdem von der Sorte, die wächst, und jeder neue Wert ist
              eine weitere Zeile in jedem Layout, das dieses Formular einbettet.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; ein Select, eine Zeile hoch</span>
            <div class="dd__stage">
              <span class="pg__label" id="dd-country-label">Land</span>
              <p-select
                [ariaLabelledBy]="'dd-country-label'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                [ngModel]="ddSelect()"
                (ngModelChange)="ddSelect.set($event)"
              />
            </div>
            <p class="dd__why">
              Ein Trigger mit vorhersehbarer Höhe, eine filterbare Liste und eine Menge, die sich verdoppeln kann, ohne das
              Layout anzufassen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; eine Überschrift statt einer Gruppe</span>
            <div class="dd__stage">
              <div class="rb-group rb-group--tight" id="dd-group-bad">
                <span class="rb-fake-legend">Kontaktiere mich per</span>
                @for (o of contactOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-nogroup"
                      [inputId]="'ng-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddNoGroup()"
                      (ngModelChange)="ddNoGroup.set($event)"
                    />
                    <label [for]="'ng-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </div>
            </div>
            <p class="dd__why">
              Der Text darüber ist ein Geschwister, kein Container. Im Accessibility Tree sitzen die Radios in überhaupt
              keiner benannten Gruppe, und ein Screenreader-Nutzer, der per Tastatur ankommt, hört nur „E-Mail, Radiobutton“,
              ohne zu wissen, wonach gefragt wird.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; Fieldset mit Legend</span>
            <div class="dd__stage">
              <fieldset class="rb-group rb-group--tight" id="dd-group-good">
                <legend>Kontaktiere mich per</legend>
                @for (o of contactOptions; track o.value) {
                  <div class="rb-row">
                    <p-radiobutton
                      name="rb-dd-group"
                      [inputId]="'gr-' + o.value"
                      [value]="o.value"
                      [ngModel]="ddGroup()"
                      (ngModelChange)="ddGroup.set($event)"
                    />
                    <label [for]="'gr-' + o.value">{{ o.label }}</label>
                  </div>
                }
              </fieldset>
            </div>
            <p class="dd__why">
              Das <code>&lt;fieldset&gt;</code> legt einen Gruppenknoten offen, der von seiner <code>&lt;legend&gt;</code>
              benannt wird, und jedes Radio darin wird mit der Frage angesagt, die es beantwortet.
            </p>
          </div>
        </div>

        <h3>Die Gruppe benennen, wenn die Frage schon auf dem Bildschirm steht</h3>
        <p>
          Die Gruppe braucht das <code>&lt;fieldset&gt;</code> auch dann, wenn eine sichtbare Überschrift oder Frage schon
          sagt, was gewählt wird &mdash; visuelle Nachbarschaft ist keine Beziehung. Die Konvention des Kits für diesen Fall
          ist ein <code>&lt;fieldset&gt;</code>, dessen <code>&lt;legend&gt;</code> die Utility <code>.sr-only</code> aus
          <code>styles.scss</code> trägt, mit <code>aria-labelledby</code>, das auf den sichtbaren Text zeigt: Der
          Gruppenknoten existiert und ist benannt, und die Beschriftung wird nicht zweimal vorgelesen.
          Referenzimplementierung: <code>quiz-container.component.ts</code> (gemeinsamer <code>name</code>,
          <code>&lt;label for&gt;</code>, <code>.sr-only</code>-Legend).
        </p>

        <h3>Die Beschriftungen schreiben</h3>
        <ul>
          <li>
            <strong>Die Legend fragt, die Beschriftungen antworten.</strong> „Liefergeschwindigkeit“ über „Standard /
            Express“, nie „Wähl deine Liefergeschwindigkeit“ über „Standard wählen“.
          </li>
          <li>
            <strong>Parallele Grammatik, beim einfachen Lesen gegenseitig ausschließend.</strong> Wenn zwei Beschriftungen
            für einen Nutzer beide zutreffen könnten, ist das Control falsch, nicht die Formulierung.
          </li>
          <li>
            <strong>Pack die Erklärung in eine Beschreibung, nicht in die Beschriftung.</strong> Eine Beschriftung, die sich
            zu einem Satz auswächst, macht das klickbare Ziel zu einem Absatz; verschieb das Detail in eine Hinweiszeile
            und referenzier sie vom Input aus.
          </li>
          <li>
            <strong>Beschrifte nie eine Option mit „Keine“, um einen leeren Zustand vorzutäuschen</strong>, außer „keine“ ist
            eine echte Antwort, die du speicherst. Wenn die Frage unbeantwortet bleiben darf, sind Checkboxen oder eine
            ausdrückliche Option „Keine Präferenz“ die ehrlichen Formen.
          </li>
        </ul>

        <h3>Kommentierte Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Radio Group pattern</a
            >
            &mdash; der Tastaturvertrag, den dieses Control vom Browser bekommt: ein Tab-Stopp pro Gruppe, Pfeiltasten, die
            die Auswahl bewegen, und der Roving Focus, der folgt.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)"
              target="_blank"
              rel="noopener noreferrer"
            >
              WHATWG HTML &mdash; the radio button state</a
            >
            &mdash; definiert die Radio-Button-Gruppe als die Inputs, die innerhalb eines Form Owners einen Namen teilen,
            und hält fest, dass keine Nutzergeste ein Radio abwählt; die Grundlage der Regeln zu Gruppierung und einzelnem
            Radio hier.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#radiogroup" target="_blank" rel="noopener noreferrer">
              W3C &mdash; WAI-ARIA 1.2, <code>radiogroup</code></a
            >
            &mdash; was ein Gruppenknoten seinen Kindern schuldet, und warum eine Überschrift über einem Stapel Radios keiner
            ist.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN &mdash; <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code></a
            >
            &mdash; das native Gruppierungselement, das dieser Guide durchgehend nutzt, samt dem Zurücksetzen seines
            Standard-Stylings und seinem Verhalten, die Legend als Namen zu nehmen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            &mdash; die Untergrenze von 24&nbsp;CSS-px, an der die Radio-Box im Tab Design gemessen wird, und der Grund,
            warum die Beschriftung klickbar sein muss.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            &mdash; die Untergrenze von 3:1 für den nicht gewählten Ring und die gewählte Füllung, beide im Tab Design je
            Modus gemessen.
          </li>
          <li>
            <a href="https://primeng.org/radiobutton" target="_blank" rel="noopener noreferrer">
              PrimeNG 21 &mdash; RadioButton</a
            >
            &mdash; die Upstream-API, die Optimus forkt, hier gegen den ausgelieferten Quellcode nachgeprüft statt
            zitiert.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>
          Die Komponente ist ein Quadrat von 1.25rem und sonst nichts &mdash; keine Beschriftung, keine Zeile, kein
          Abstand. Alles drumherum gehört dir.
        </p>
        <ul>
          <li>
            <strong>Host</strong> &mdash; <code>.p-radiobutton</code>: <code>position: relative</code>,
            <code>inline-flex</code>, <code>vertical-align: bottom</code>, bemessen aus
            <code>radiobutton.width/height</code>. Die Zustandsklassen landen hier (<code>.p-radiobutton-checked</code>,
            <code>.p-disabled</code>, <code>.p-invalid</code>, <code>.p-variant-filled</code>), weshalb die Regeln des
            Themes am Host ansetzen und nicht an einer Pseudoklasse.
          </li>
          <li>
            <strong>Input</strong> &mdash; <code>.p-radiobutton-input</code>: ein ECHTES
            <code>&lt;input type="radio"&gt;</code>, absolut über den ganzen Host gelegt, mit <code>opacity: 0</code> und
            <code>z-index: 1</code>. Es ist das Klickziel, das Fokusziel, das beschriftbare Element und das, was ein
            Formular abschickt.
          </li>
          <li>
            <strong>Box</strong> &mdash; <code>.p-radiobutton-box</code>: der sichtbare Kreis. Rahmen, Hintergrund,
            Box-Shadow und die Fokus-Outline werden hier gemalt, gesteuert von den Zustandsklassen des Hosts und von
            <code>:has()</code>-Selektoren, die <code>:hover</code> / <code>:focus-visible</code> des Inputs lesen.
          </li>
          <li>
            <strong>Icon</strong> &mdash; <code>.p-radiobutton-icon</code>: der innere Punkt. Er steht immer im DOM und ist
            doppelt versteckt: Sein <code>background</code> im Ruhezustand ist <code>transparent</code>, und zusätzlich
            schrumpft ihn <code>transform: scale(0.1)</code>. Das Auswählen des Radios gibt ihm die Icon-Farbe und
            <code>scale(1)</code>, der Punkt springt also auf, statt einzublenden &mdash; und eine Regel, die nur das
            Transform wiederherstellt, lässt ihn unsichtbar.
          </li>
        </ul>
        <p class="src-note">
          Template aus <code>openng-optimus-ui-radiobutton.mjs:269-291</code> (Optimus UI 2.0.2); jede oben zitierte Regel
          steht in <code>&#64;openng/optimus-ui-styles/dist/radiobutton/index.mjs</code> (2.0.2).
        </p>

        <h3>Token-Kette: Aura &rarr; Kit</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura-Wert</th>
                <th>Löst auf zu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>radiobutton.width/height</code></td>
                <td>1.25rem</td>
                <td>20px (sm 1rem, lg 1.5rem) — Aura 2.x</td>
              </tr>
              <tr>
                <td><code>radiobutton.background</code></td>
                <td><code>&#123;form.field.background&#125;</code></td>
                <td>die gemeinsame Input-Oberfläche</td>
              </tr>
              <tr>
                <td><code>radiobutton.border.color</code></td>
                <td><code>&#123;form.field.border.color&#125;</code></td>
                <td>der gemeinsame Input-Rahmen &mdash; vom Kit auf <code>--control-border</code> umgelenkt</td>
              </tr>
              <tr>
                <td><code>radiobutton.checked.background</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>die Primärfarbe des Akzents, von diesem Kit je Akzent neu registriert</td>
              </tr>
              <tr>
                <td><code>radiobutton.checked.border.color</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>&mdash; Ring und Füllung sind eine Farbe</td>
              </tr>
              <tr>
                <td><code>radiobutton.icon.checked.color</code></td>
                <td><code>&#123;primary.contrast.color&#125;</code></td>
                <td>der Punkt, konstruktionsbedingt mit der Füllung gepaart</td>
              </tr>
              <tr>
                <td><code>radiobutton.icon.size</code></td>
                <td>0.75rem</td>
                <td>12px (sm 0.5rem, lg 1rem) — Aura 2.x</td>
              </tr>
              <tr>
                <td><code>radiobutton.filled.background</code></td>
                <td><code>&#123;form.field.filled.background&#125;</code></td>
                <td>nur solange nicht gewählt &mdash; die gewählte Füllung gewinnt</td>
              </tr>
              <tr>
                <td><code>radiobutton.disabled.background</code></td>
                <td><code>&#123;form.field.disabled.background&#125;</code></td>
                <td>eine echte deaktivierte Oberfläche, kein Verblassen</td>
              </tr>
              <tr>
                <td><code>radiobutton.invalid.border.color</code></td>
                <td><code>&#123;form.field.invalid.border.color&#125;</code></td>
                <td>das gemeinsame Rot für Formularfehler</td>
              </tr>
              <tr>
                <td><code>radiobutton.focus.ring.*</code></td>
                <td><code>&#123;focus.ring.*&#125;</code></td>
                <td>1px solid <code>&#123;primary.color&#125;</code>, Offset 2px</td>
              </tr>
              <tr>
                <td><code>radiobutton.transition.duration</code></td>
                <td><code>&#123;form.field.transition.duration&#125;</code></td>
                <td>0.2s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui-themes/dist/aura/radiobutton/index.mjs</code>, aufgelöst gegen
          <code>&#8230;/aura/base/index.mjs</code>. <strong>Achte auf den Fokus-Ring:</strong> Er erbt die
          <em>globale</em> Gruppe <code>focus.ring</code>, nicht den <code>form.field.focusRing</code>, den Aura für
          input-förmige Controls auf null setzt &mdash; anders als <code>p-select</code> zeigt ein Radio also ab Werk in
          beiden Modi einen Ring von 1px. Dieses Kit ersetzt ihn durch seinen einen Ring von 2px (unten).
        </p>

        <h3>Was das Kit obendrauf legt: zwei Tokens und der Ring</h3>
        <p>
          <code>styles.scss</code> lenkt zwei Radio-Tokens auf <code>.p-radiobutton</code> um:
          <code>--p-radiobutton-border-color</code> auf das <code>--control-border</code> des Kits, weil Auras
          <code>form.field.border.color</code> den nicht gewählten Ring unter 3:1 ließ, und
          <code>--p-radiobutton-invalid-border-color</code> auf <code>--semantic-red-fg</code> (Auras red.400 lag bei
          2,77:1 auf Weiß). Beide sind auf das Element beschränkt, die Regeln für Hover, Auswahl und Fokus behalten also
          ihre eigenen Tokens. Der Fokus-Ring ist die eine Ring-Regel des Kits, die die Radio-Box neben der Checkbox
          aufführt:
          <code>.p-radiobutton:has(.p-radiobutton-input:focus-visible) .p-radiobutton-box</code>, 2px solid
          <code>--primary-color-fg</code> bei 2px Offset, <code>!important</code>. Keiner der Blöcke
          <code>html.style-&lt;name&gt;</code> (ADR-0016) fasst das Radio an, und die Radius-Overrides der Stile
          erreichen keinen Kreis. Die andere Nicht-Aura-Regel im Spiel kommt
          mit der Komponente selbst (<code>openng-optimus-ui-radiobutton.mjs:17-22</code>): ein Selektor
          <code>ng-invalid.ng-dirty</code> auf den drei akzeptierten Host-Tags, der den Box-Rahmen mit
          <code>radiobutton.invalid.border.color</code> malt, sodass ein Validierungsfehler in Reactive Forms den Ring
          färbt, ohne dass du <code>[invalid]</code> setzt. Dir gehört alles außerhalb des Quadrats von 20px &mdash; die
          Zeile, der Abstand, die Typografie der Beschriftung, die Abstände im Stapel.
        </p>

        <h3>Kontrast, in beiden Modi</h3>
        <p>
          Jede Zeile ist zitiert aus <code>docs/generated/CONTRAST.MD</code> (<code>checkbox &amp; radiobutton</code> und
          <code>body text</code>) für den Stil <strong>werkbund</strong> und den Standard-Akzent <strong>sunset</strong>,
          gegen <code>--surface-card</code>; das Gate prüft dieselben Paare für jeden Stil, jeden Akzent und jeden Modus.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Hell</th>
                <th>Dunkel</th>
                <th>Untergrenze</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>nicht gewählter Ring</strong> (<code>--control-border</code>) gegen die Karte</td>
                <td>
                  <strong>{{ m.uncheckedBorderLight }}</strong>
                </td>
                <td>
                  <strong>{{ m.uncheckedBorderDark }}</strong>
                </td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>gewählte Füllung gegen die Inhaltsfläche</td>
                <td>{{ m.checkedFillLight }}</td>
                <td>{{ m.checkedFillDark }}</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>innerer Punkt gegen die gewählte Füllung</td>
                <td>{{ m.dotLight }}</td>
                <td>{{ m.dotDark }}</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>Fokus-Ring gegen die Inhaltsfläche</td>
                <td>{{ m.focusRingLight }}</td>
                <td>{{ m.focusRingDark }}</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>Fließtext gegen die Inhaltsfläche</td>
                <td>{{ m.labelLight }}</td>
                <td>{{ m.labelDark }}</td>
                <td>4,5:1 (SC 1.4.3)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Der nicht gewählte Ring ist die Zeile, auf die es ankommt</strong> &mdash; er ist das Einzige, was sagt:
          „Hier ist ein Control.“ Auf Auras Standard-Token maß er 1,48:1 hell / 2,29:1 dunkel; auf dem
          <code>--control-border</code> des Kits liegt er in jedem Stil und Modus über 3:1, am niedrigsten bei 3,85:1
          (blaupause, hell, auf <code>--surface-ground</code>). Die gewählte Füllung ist das
          <code>&#123;primary.color&#125;</code> des Akzents, der Punkt dessen gepaarte Kontrastfarbe und der Fokus-Ring
          das <code>--primary-color-fg</code> des Akzents. Es bleibt keine Ausnahme: Die dunkle Widget-Rampe kommt jetzt
          aus dem dunklen Vordergrund jeder Palette, sodass jeder Akzent &mdash; <strong>contrast</strong> im Dark Mode
          eingeschlossen &mdash; die gewählte Füllung bei 4,75:1 oder mehr und den Ring bei 3,88:1 oder mehr auf jeder
          Seitenfläche hält. Überschreib <code>--p-radiobutton-border-color</code> nicht mit einem helleren Wert &mdash; das
          Gate deckt nur das Token ab, das das Kit setzt.
        </p>
        <p class="src-note">
          Zeilen aus <code>docs/generated/CONTRAST.MD</code>: <code>checkbox.border.color</code> (dasselbe
          <code>--control-border</code>, das das Radio liest), <code>sunset.primary.color</code> und
          <code>sunset.checkbox.icon.checked.color</code> auf dem gewählten Hintergrund, unter
          <code>checkbox &amp; radiobutton</code>; der Ring ist <code>sunset.--primary-color-fg (kit focus ring)</code>
          unter <code>focus ring</code>; die Beschriftung ist <code>--text-color</code> auf <code>--surface-card</code>
          unter <code>body text</code> (niedrigster Stil 11,32:1). Token-Ebenen in
          <code>&#8230;/aura/radiobutton/index.mjs</code>; die Kit-Regel ist der Block <code>.p-radiobutton</code> in
          <code>styles.scss</code>. Reproduzier das, indem du das berechnete
          <code>border-color</code> und <code>background-color</code> von <code>.p-radiobutton-box</code> in jedem Zustand
          und den <code>background</code> von <code>.p-radiobutton-icon</code> gegen die Fläche dahinter liest.
        </p>

        <h3>Geometrie und die Größenskala</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Eigenschaft</th>
                <th><code>size="small"</code></th>
                <th>Standard</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Box-Token</td>
                <td>1rem</td>
                <td>1.25rem</td>
                <td>1.5rem</td>
              </tr>
              <tr>
                <td>Box in px</td>
                <td>{{ m.boxSmall }}</td>
                <td>{{ m.boxDefault }}</td>
                <td>{{ m.boxLarge }}</td>
              </tr>
              <tr>
                <td>Punkt-Token</td>
                <td>0.5rem</td>
                <td>0.75rem</td>
                <td>1rem</td>
              </tr>
              <tr>
                <td>24px allein über die Box</td>
                <td>darunter</td>
                <td>darunter</td>
                <td><strong>genau 24px</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Blöcke <code>sm</code> / <code>lg</code> in <code>&#8230;/aura/radiobutton/index.mjs</code> (Aura 2.x); die
          Größenklassen <code>.p-radiobutton-sm</code> /
          <code>-lg</code> ändern die Größe von Host und Box.
          <strong>Was das für SC 2.5.8 bedeutet:</strong>
          Nur <code>large</code> erreicht für sich allein 24&nbsp;px als Ziel; small und default verlassen sich auf das
          klickbare <code>&lt;label&gt;</code> und auf die
          Abstandsausnahme des Erfolgskriteriums, die aufeinanderfolgende Zeilen so weit auseinander verlangt, dass ein Kreis
          von 24&nbsp;px, auf ein Radio zentriert, das nächste nicht erreicht. Gib den Zeilen Abstand und mach die
          Beschriftung zum Teil des Ziels.
        </p>

        <h3>Deaktiviert: echte Tokens, kein Verblassen</h3>
        <p>
          Das ist erwähnenswert, weil das benachbarte Segmented Control das Gegenteil tut. Das ausgelieferte CSS setzt
          <code>opacity: 1</code> auf ein deaktiviertes Radio, überschreibt damit das globale Verblassen von
          <code>.p-disabled</code> und malt die Box dann aus <code>radiobutton.disabled.background</code>,
          <code>radiobutton.checked.disabled.border.color</code> und <code>radiobutton.icon.disabled.color</code>. Diese
          Overrides stehen unter <code>.p-radiobutton.p-disabled</code>, einem Klassenselektor auf dem Host-Element, also
          greifen sie &mdash; die gemessene Opacity eines deaktivierten Radios ist <strong>{{ m.disabledOpacity }}</strong
          >, die Box wird aus den Disabled-Tokens gemalt statt verblasst. Die Tokens lohnen sich also zum Feintuning,
          anders als der wirkungslose Satz <code>togglebutton.disabled.*</code> &mdash; dessen Regeln als
          <code>.p-togglebutton:disabled</code> in <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>
          geschrieben sind, und diese Komponente rendert kein inneres <code>button</code>-Element, auf das
          <code>:disabled</code> passen könnte. Die Beschriftung neben dem Radio wird gar nicht angefasst: Dimm sie selbst,
          sonst liest sich eine deaktivierte Option als verfügbar.
        </p>
        <p class="src-note">
          <code>.p-radiobutton.p-disabled</code> und die drei Regeln danach in
          <code>&#64;openng/optimus-ui-styles/dist/radiobutton/index.mjs</code>. Die deaktivierte Beschriftung daneben dimmst
          du selbst; nichts in der Komponente reicht über ihr eigenes Quadrat hinaus.
        </p>

        <h3>Fokus</h3>
        <p>
          Der Ring wird auf die Box gezeichnet, nicht auf den Input, über
          <code>:has(.p-radiobutton-input:focus-visible)</code> &mdash; der unsichtbare Input nimmt den Fokus, und der
          sichtbare Kreis reagiert. Gemessen an einem fokussierten Radio: <strong>{{ m.focusOutline }}</strong> bei Offset
          <strong>{{ m.focusOffset }}</strong
          >, in beiden Modi gleich. Zwei Folgen: Ein Vorfahr mit <code>overflow: hidden</code>, der die Zeile eng umschließt,
          schneidet den Ring ab, und eine Regel, die den Input anders versteckt (<code>display: none</code>, ein
          Clip-Rechteck), nimmt der Komponente den Fokus ganz. Style <code>.p-radiobutton-input</code> nie um.
        </p>

        <h3>Die Gruppe anordnen</h3>
        <ul>
          <li>
            <strong>Standardmäßig vertikal.</strong> Eine gestapelte Gruppe wird als Menge von Antworten auf eine Frage
            erfasst; eine Reihe davon liest sich wie eine Toolbar, und Beschriftungen unterschiedlicher Länge machen die
            Abstände unregelmäßig. Reihen sind für höchstens zwei kurze Optionen.
          </li>
          <li>
            <strong>Am ersten Zeilenanfang ausrichten, nicht an der Mitte.</strong> Mit einer Beschreibung unter der
            Beschriftung hält <code>align-items: flex-start</code> den Kreis neben der Beschriftung, statt ihn in der
            Mitte des Blocks schweben zu lassen.
          </li>
          <li>
            <strong>Setz das Fieldset zurück.</strong> Browser geben <code>&lt;fieldset&gt;</code> einen eigenen Rahmen,
            einen Margin und ein Padding; setz sie bewusst, statt das Element zu meiden.
          </li>
          <li>
            <strong>Bemiss die Zeilen nach dem Ziel, nicht nach der Schrift.</strong> Der Kreis misst 20px; die Zeile muss
            mindestens 24px hoch sein, damit die Beschriftung ein konformes Ziel ergibt.
          </li>
          <li>
            <strong>Schmale Bildschirme.</strong> Die Komponente hat kein responsives Verhalten: Der Kreis behält in jedem
            Viewport seine feste Größe, und das Layout ist die Zeile, die du baust. Ein vertikaler Stapel braucht nichts;
            eine horizontale Reihe muss umbrechen dürfen (<code>flex-wrap: wrap</code>) oder unter etwa 30rem in den Stapel
            wechseln, und eine lange Beschriftung bricht neben dem Kreis um, wenn ihre Zeile ein Flex-Container mit
            <code>align-items: flex-start</code> ist.
          </li>
        </ul>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst &mdash; ein Kriterium, das hier nicht gemessen wird, wird
          nicht beansprucht.
          <strong>Erfüllt:</strong> SC 4.1.2 (ein <code>radio</code>-Knoten, benannt durch seine Beschriftung), SC 2.1.1
          mit dem browsernativen Tastaturmodell der Gruppe, SC 2.4.7 mit dem in beiden Modi gemessenen Ring und SC 1.4.11
          für den nicht gewählten Ring (Kit-<code>--control-border</code>, am niedrigsten 3,85:1), die gewählte Füllung,
          den inneren Punkt und den Fokus-Ring, alle in <code>CONTRAST.MD</code> für jeden Stil, jeden Akzent und jeden
          Modus geprüft, ohne Ausnahme.
          <strong>Bedingt:</strong> SC 2.5.8 &mdash; nur <code>large</code> (24px) ist für sich allein ein Ziel; small
          und default erreichen es über die Höhe der Zeile und die klickbare Beschriftung. <strong>AAA</strong> wird für
          diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ m.devImport }}</code></pre>
        <p>
          Der Selektor akzeptiert <code>p-radiobutton</code>, <code>p-radiobutton</code> und <code>p-radio-button</code>.
          Er ist ein <code>ControlValueAccessor</code>, also binden sowohl <code>ngModel</code> als auch Reactive Forms
          &mdash; und anders als bei den meisten Controls ist eines davon <em>Pflicht</em>: siehe die erste Falle.
        </p>

        <h3>Wie eine Gruppe tatsächlich zur Gruppe wird</h3>
        <p>
          Es gibt keine Gruppen-Komponente. Exklusivität, Tastaturnavigation und Ansage kommen von drei verschiedenen
          Stellen, und es ist durchaus möglich, eines ohne die anderen zu bekommen &mdash; genau das sind die meisten
          kaputten Radio-Gruppen.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was du willst</th>
                <th>Was es liefert</th>
                <th>Was ohne es passiert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ein Tab-Stopp für die ganze Gruppe</td>
                <td>
                  Die eigene Radio-Gruppe des Browsers: <code>[name]</code>, gebunden an jedes Radio, das den Input als
                  echtes Attribut <code>name</code> erreicht. Gemessen: Ein Druck auf <kbd>Tab</kbd> durchquert eine
                  benannte Gruppe mit drei Optionen, drei Drücke eine namenlose.
                </td>
                <td>
                  Jedes Radio ist ein eigener Tab-Stopp, und eine lange Gruppe wird zum Tab-Tunnel. Die Bibliothek
                  liefert keinerlei <code>keydown</code>-Handler mit, es gibt also nichts, was das ausgleicht.
                </td>
              </tr>
              <tr>
                <td>Immer nur eines gleichzeitig ausgewählt im DOM</td>
                <td>
                  Derselbe <code>name</code> &mdash; die eigene Garantie des Browsers. Die
                  <code>RadioControlRegistry</code> der Bibliothek fügt eine zweite, unabhängige hinzu: Sie schreibt
                  <code>false</code> in jeden Geschwister-Accessor, der eine NgControl-Wurzel und einen
                  <code>name()</code> teilt.
                </td>
                <td>
                  <em>Sieht</em> trotzdem richtig aus, solange alle Radios an ein Modell binden, weil der Wertvergleich in
                  <code>writeControlValue</code> die anderen abwählt. Schlichte namenlose Radios verhalten sich nicht so
                  &mdash; zwei können gleichzeitig ausgewählt sein. Genau deshalb besteht eine namenlose
                  <code>p-radiobutton</code>-Gruppe einen Klicktest und ist trotzdem kaputt.
                </td>
              </tr>
              <tr>
                <td>Die Frage der Gruppe in der Ansage</td>
                <td>
                  Ein <code>&lt;fieldset&gt;</code> mit einer <code>&lt;legend&gt;</code> um die Menge herum. Gemessen: Es
                  legt einen <code>group</code>-Knoten offen, der von der Legend benannt wird und die Radios besitzt.
                </td>
                <td>
                  Radios werden einzeln angesagt, in keiner Gruppe. Eine Überschrift über dem Stapel erzeugt überhaupt
                  keinen Gruppenknoten &mdash; gemessen.
                </td>
              </tr>
              <tr>
                <td>Ein Wert in einem nativen Formular-Submit</td>
                <td>Nichts, worauf du dich verlassen kannst &mdash; siehe „Formulare“ unten.</td>
                <td>&mdash;</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>[attr.name]="name()"</code> bei <code>openng-optimus-ui-radiobutton.mjs:274</code>;
          <code>RadioControlRegistry</code> bei <code>:85-97</code>, registriert in <code>onInit</code> bei
          <code>:213-215</code> und befragt in <code>select</code> bei <code>:222-229</code>; der Modellvergleich bei
          <code>:251</code> (Optimus UI 2.0.2). Anzahl der Tab-Stopps und der Gruppenknoten gemessen im Browser und im
          Accessibility Tree. Prüf es in deinem eigenen Build: Geh mit Tab über die Gruppe und zähl die Drücke; dann such
          einen <code>group</code>-Knoten über den Radios, benannt von der Legend.
        </p>
        <p>
          <strong>Außerhalb eines Formulars ist das Dokument der Gruppierungsbereich.</strong> Eine Radio-Gruppe ist die
          Menge der Inputs, die einen Namen <em>innerhalb ihres Form Owners</em> teilen; ohne
          <code>&lt;form&gt;</code>-Vorfahr ist dieser Owner das Dokument. Zwei unabhängige Gruppen auf einer Seite, die
          beide <code>name="type"</code> verwenden, verschmelzen zu einer, und eine Auswahl in der zweiten wählt die erste
          ab. Gib dem Wert einen Namensraum, oder setz jede Gruppe in ein eigenes Formular.
        </p>

        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Typ</th>
                <th>Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>any</td>
                <td>
                  Der Wert dieser Option. Wird mit <code>==</code> mit dem gebundenen Modell verglichen, also passen
                  <code>1</code> und <code>'1'</code> zueinander.
                </td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td>string</td>
                <td>
                  <strong>Faktisch Pflicht.</strong> Erreicht den Input als echtes Attribut <code>name</code>; er sorgt
                  dafür, dass der Browser die Menge als eine Gruppe behandelt.
                </td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>Die <code>id</code> des Inputs, also das Ziel deines <code>&lt;label for&gt;</code>.</td>
              </tr>
              <tr>
                <td><code>binary</code></td>
                <td>boolean</td>
                <td>
                  Das Modell ist ein Boolean statt eines Wertvergleichs. Eine Form mit einzelnem Radio &mdash; lies den Tab
                  Verwendung, bevor du sie einsetzt.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Ändert die Größe von Box und Punkt; sonst nichts in der Zeile.</td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'outlined' | 'filled'</td>
                <td>
                  Nur der Hintergrund im nicht gewählten Zustand. Fällt auf die anwendungsweite Konfiguration
                  <code>inputStyle</code> und dann <code>inputVariant</code> zurück (<code>:202</code>); beide gibt es in
                  Optimus noch.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  Setzt ein echtes Attribut <code>disabled</code> auf den Input &mdash; wirklich nicht fokussierbar und als
                  deaktiviert angesagt.
                </td>
              </tr>
              <tr>
                <td><code>required</code></td>
                <td>boolean</td>
                <td>Setzt ein echtes Attribut <code>required</code> auf den Input.</td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>Färbt den Box-Rahmen um. Angesagt wird nichts &mdash; füg eine Meldung hinzu und referenzier sie.</td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  Landen auf dem Input. Bevorzug ein echtes <code>&lt;label for&gt;</code>; nutz diese nur, wenn es keine
                  sichtbare Beschriftung gibt, auf die du zeigen kannst.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>Wird an den Input weitergereicht. Ihn zu setzen ist fast immer falsch &mdash; siehe die Fallen.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>
                  Fokussiert dieses Radio beim Laden. In einer Gruppe immer nur das ausgewählte. Hat keinen Standardwert,
                  das ist der Bug mit dem Phantom-Attribut weiter unten.
                </td>
              </tr>
              <tr>
                <td><code>pt</code></td>
                <td>object</td>
                <td>
                  Der einzige Weg zu zusätzlichen Input-Attributen, z.&nbsp;B. <code>aria-describedby</code>. Es gibt
                  keinen eigenen Input dafür.
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Veraltet:</strong> <code>styleClass</code> (<code>:153-158</code>, seit Upstream v20) — kompiliert
                  noch, aber nutz schlichtes <code>class</code>. Nur <code>size</code>, <code>variant</code> und die
                  geerbten <code>name</code>/<code>disabled</code>/<code>required</code>/<code>invalid</code> sind
                  Signal-Inputs; der Rest sind schlichte <code>&#64;Input</code>-Properties (<code>:132-168</code>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Outputs</h3>
        <p>
          Drei, und die erste Überraschung ist, welcher fehlt: <strong>Es gibt kein <code>onChange</code></strong
          >. Nutz das Modell oder <code>onClick</code>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>Payload</th>
                <th>Wann</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>onClick</code></td>
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>
                  Nachdem dieses Radio ausgewählt wurde. Er feuert nie für das Radio, das dadurch <em>ab</em>gewählt wurde,
                  eine Gruppe braucht also einen Handler pro Option oder ein Abo auf das Modell.
                </td>
              </tr>
              <tr>
                <td><code>onFocus</code></td>
                <td>Event</td>
                <td>Der Input hat den Fokus bekommen.</td>
              </tr>
              <tr>
                <td><code>onBlur</code></td>
                <td>Event</td>
                <td>Der Input hat den Fokus verloren; hier wird das Form Control als touched markiert.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Formulare</h3>
        <p>
          Reactive Forms und <code>ngModel</code> funktionieren beide über den Value Accessor. Zwei Dinge funktionieren
          nicht so, wie das native Element vermuten lässt:
        </p>
        <ul>
          <li>
            <strong><code>formControlName</code> gibt dir keinen <code>name</code>.</strong> Der Input
            <code>name</code> fällt nicht auf den Namen des Controls zurück, eine reaktive Gruppe ohne explizites
            <code>[name]</code> rendert also Inputs ohne Attribut name &mdash; die Exklusivität überlebt über die Registry,
            der Tastaturvertrag nicht. Binde <code>name</code> immer zusätzlich zu <code>formControlName</code>.
          </li>
          <li>
            <strong>Ein nativer Submit trägt den Wert der Option nicht.</strong> Das Attribut <code>value</code> des Inputs
            ist an den Modellwert der Komponente gebunden, der bei einem Radio das ausgewählte <em>Boolean</em> ist
            &mdash; gemessen <code>{{ m.nativeValueAttr }}</code> auf dem ausgewählten Input und <code>value="false"</code>
            auf seinen Geschwistern, egal was der Input <code>[value]</code> sagte. Lies die Antwort aus dem
            Angular-Formular; nie aus <code>FormData</code>.
          </li>
        </ul>
        <pre class="code-block"><code>{{ m.formSnippet }}</code></pre>
        <p class="src-note">
          <code>name</code> ist auf <code>BaseEditableHolder</code> als nacktes <code>input()</code> ohne Standardwert
          deklariert; <code>[attr.value]="modelValue()"</code> bei <code>openng-optimus-ui-radiobutton.mjs:278</code>,
          und <code>modelValue</code> wird bei <code>:222</code> und <code>:252</code> aus <code>this.checked</code>
          geschrieben (Optimus UI 2.0.2).
        </p>

        <h3>Fallen in der ausgelieferten Implementierung</h3>
        <ul>
          <li>
            <strong>Jedes Radio braucht ein Formular-Binding.</strong> <code>onInit</code> löst <code>NgControl</code>
            ohne Fallback-Wert aus dem Injector auf und registriert es, also ist <code>ngModel</code> oder
            <code>formControlName</code> nicht optional: Es gibt keinen unkontrollierten Modus, in dem die Komponente nur
            einen ausgewählten Kreis aus einem Attribut zeichnet.
          </li>
          <li>
            <strong>Das Phantom-Attribut <code>autofocus</code> ist zurück.</strong> PrimeNG 22 gab dem Input den
            Standardwert <code>false</code>; Optimus hat wieder die Form von v21 &mdash; <code>autofocus</code> ist ein
            nicht initialisiertes schlichtes <code>&#64;Input</code> (<code>:163</code>), das in
            <code>[pAutoFocus]="autofocus"</code> (<code>:286</code>) geleitet wird, es kommt also als
            <code>undefined</code> an, und die AutoFocus-Direktive entfernt das Attribut nur bei einem strikten
            <code>false</code> (<code>openng-optimus-ui-autofocus.mjs:23-27</code>). Nichts stiehlt den Fokus &mdash; der
            Fokus-Aufruf braucht einen truthy Wert (<code>:39</code>) &mdash;, aber jedes Radio rendert
            <code>autofocus="true"</code>. Behalte das Binding <code>[autofocus]="false"</code> oder stell es wieder her.
          </li>
          <li>
            <strong>Setz nie <code>tabindex="-1"</code>, um den Tab-Stopp auf eine umgebende Zeile zu verlegen.</strong> Es
            wird an den Input weitergereicht und nimmt die Gruppe ganz aus der Tab-Reihenfolge: Ein Tastaturnutzer erreicht
            ein fokussierbares <code>&lt;div&gt;</code> ohne Rolle, die Pfeiltasten tun nichts, und der Roving Focus, der
            eine Radio-Gruppe benutzbar macht, ist weg. Wenn die ganze Zeile klickbar sein soll, nimm dafür das
            <code>&lt;label&gt;</code> &mdash; es ist per Definition ein Klickziel und kostet kein ARIA.
          </li>
          <li>
            <strong>Zwei Gruppen, ein Name, kein Formular.</strong> Sie verschmelzen; siehe den Abschnitt zur Gruppierung
            oben.
          </li>
          <li>
            <strong><code>value</code> wird mit <code>==</code> verglichen</strong
            >, nicht mit <code>===</code>. Praktisch für numerische IDs, die als Strings ankommen, eine Falle für
            <code>0</code>, <code>''</code> und <code>null</code>. Objekte werden per Referenz verglichen, und es gibt hier
            kein <code>dataKey</code> &mdash; binde primitive Werte.
          </li>
          <li>
            <strong><code>[invalid]</code> ist eine Rahmenfarbe und sonst nichts</strong> &mdash; es fügt dem Host eine
            Klasse <code>p-invalid</code> hinzu und nirgends ein <code>aria-invalid</code>, gemessen. Schreib den Fehler als
            Text, referenzier ihn vom Fieldset aus mit <code>aria-describedby</code> und füg <code>[required]</code> hinzu,
            wenn das Feld wirklich Pflicht ist &mdash; das erreicht DOM und Accessibility Tree tatsächlich.
          </li>
          <li>
            <strong>Kein Input <code>ariaDescribedBy</code>.</strong> Beschreibungen erreichen den Input nur über
            <code>[pt]="&#123; input: &#123; 'aria-describedby': … &#125; &#125;"</code>; ein
            <code>[attr.aria-describedby]</code> auf dem Host landet auf einem Custom Element ohne Rolle und wird ignoriert.
          </li>
          <li>
            <strong>Die ausgewählte Option zu deaktivieren versteckt die Antwort.</strong> Ein deaktiviertes Radio behält
            seinen ausgewählten Zustand und seinen Wert im Modell, aber der Nutzer kann nicht mehr sehen, warum. Entfern
            lieber die Option oder deaktivier die ganze Gruppe.
          </li>
        </ul>

        <h3>Tastatur</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Ergebnis in einer benannten Gruppe</th>
                <th>Ohne gemeinsamen Namen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>
                  Betritt die Gruppe einmal, landet auf dem ausgewählten Radio (oder dem ersten, wenn keines ausgewählt ist),
                  und verlässt beim nächsten Druck die ganze Gruppe.
                </td>
                <td>Hält nacheinander auf jedem Radio &mdash; gemessen, ein Stopp pro Option.</td>
              </tr>
              <tr>
                <td><kbd>&darr;</kbd> / <kbd>&rarr;</kbd></td>
                <td>
                  Bewegt den Fokus zum nächsten Radio <em>und wählt es aus</em>, wählt das vorherige ab und springt am Ende
                  an den Anfang.
                </td>
                <td>
                  Der Fokus bewegt sich trotzdem, und das neu fokussierte Radio wird ausgewählt, aber auf DOM-Ebene wird
                  nichts abgewählt &mdash; gemessen an schlichten namenlosen Inputs, am Ende sind zwei ausgewählt. Mit der
                  Komponente verdeckt das gemeinsame Modell das.
                </td>
              </tr>
              <tr>
                <td><kbd>&uarr;</kbd> / <kbd>&larr;</kbd></td>
                <td>Dasselbe, rückwärts.</td>
                <td>Wie oben, rückwärts.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Wählt das fokussierte Radio aus. Wählt es nie ab.</td>
                <td>Dasselbe.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Schickt das Formular ab, falls es eines gibt.</td>
                <td>Dasselbe.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Alles davon ist das native Verhalten der Radio-Gruppe im Browser: <code>openng-optimus-ui-radiobutton.mjs</code>
          bindet überhaupt keinen Tasten-Handler, die Ergebnisse gehören also dem Browser, nicht der Bibliothek. Die
          Pfeiltasten bewegen deshalb die <em>Auswahl</em>, nicht nur den Fokus &mdash; das Standardverhalten von Radios,
          und der Grund, warum eine Radio-Gruppe nie dort eingesetzt werden darf, wo das Durchgehen der Optionen einen
          Nebeneffekt hat.
        </p>

        <h3>Barrierefreiheit</h3>
        <ul>
          <li>
            <strong>Die Rolle ist nativ.</strong> Jede Komponente legt aus ihrem echten Input einen <code>radio</code>-Knoten
            offen, benannt durch ihre Beschriftung, mit dem ausgewählten Zustand darauf &mdash; gemessen im Accessibility
            Tree. Auf dem Host-Element wird überhaupt nichts offengelegt: keine Rolle, kein Name, also ist
            <code>aria-*</code>, das auf <code>&lt;p-radiobutton&gt;</code> geschrieben wird, wirkungslos.
          </li>
          <li>
            <strong>Benenne jedes Radio mit einem <code>&lt;label for&gt;</code></strong>, das auf <code>inputId</code>
            zeigt. Der Input ist ein beschriftbares Element, das ist also Accessible Name und zusätzliches Klickziel in
            einem.
          </li>
          <li>
            <strong>Benenne die Gruppe mit einem <code>&lt;fieldset&gt;</code> und einer <code>&lt;legend&gt;</code>.</strong>
            Wo die Frage schon sichtbar über der Gruppe steht, behalte das Fieldset und gib der Legend die Utility
            <code>.sr-only</code> mit <code>aria-labelledby</code> auf den sichtbaren Text &mdash; die Konvention des Kits
            für gruppierte Formular-Controls (Referenz: <code>quiz-container.component.ts</code>).
          </li>
          <li>
            <strong>Beschreibungen kommen über <code>pt</code> auf den Input</strong
            >, Fehler auf Gruppenebene über <code>aria-describedby</code> auf das Fieldset.
          </li>
          <li>
            <strong>Deaktiviert ist hier ehrlich.</strong> Das echte Attribut <code>disabled</code> bedeutet nicht
            fokussierbar und als deaktiviert angesagt &mdash; beides gemessen. Es bedeutet aber auch unsichtbar für
            Tastaturnutzer, jede Erklärung muss also als Text neben der Gruppe stehen.
          </li>
          <li>
            <strong>Eine ungültige Gruppe sagt nichts an; eine Pflichtgruppe schon.</strong>
            <code>[invalid]="true"</code> lässt den Accessibility Tree unberührt &mdash; gemessen mit umgefärbtem Rahmen
            und einem Knoten, der weiterhin gültig meldet. Was den Tree erreicht, ist <code>[required]="true"</code>: Ein
            echtes Attribut <code>required</code> lässt eine unbeantwortete Gruppe über die native Constraint Validation als
            ungültig melden. Nutz <code>required</code> für die Semantik und Text für die Meldung; nie
            <code>[invalid]</code> allein.
          </li>
          <li>
            <strong>Zielgröße:</strong> Die Box misst in der Standardgröße 20px (Aura 2.x), unter der Untergrenze von 24px;
            nur <code>size="large"</code> erreicht 24px. Die klickbare Beschriftung und ausreichender Zeilenabstand
            schließen die Lücke; bau keine Radio-Zeile ohne Beschriftung.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>&#9744; Jedes Radio der Gruppe trägt denselben <code>[name]</code>, eindeutig auf der Seite.</li>
          <li>
            &#9744; Die Gruppe ist in ein <code>&lt;fieldset&gt;</code> mit einer <code>&lt;legend&gt;</code> gefasst
            (sichtbar, oder <code>.sr-only</code> plus <code>aria-labelledby</code>).
          </li>
          <li>&#9744; Jedes Radio hat ein <code>&lt;label for&gt;</code>, das auf seine <code>inputId</code> zeigt.</li>
          <li>&#9744; In die Gruppe zu tabben kostet einen Druck; die Pfeiltasten bewegen die Auswahl.</li>
          <li>&#9744; Der Fokus-Ring ist in beiden Modi auf der Box sichtbar und wird von keinem Vorfahr abgeschnitten.</li>
          <li>&#9744; Die Zeile ist mindestens 24px hoch, damit die Beschriftung ein konformes Ziel ist.</li>
          <li>&#9744; Ein Validierungsfehler ist Text, der vom Fieldset referenziert wird, nicht nur <code>[invalid]</code>.</li>
          <li>
            &#9744; Die Antwort darf berechtigterweise nie leer sein &mdash; sonst ist das eine Checkbox-Gruppe oder ein
            Select.
          </li>
          <li>&#9744; Kein <code>tabindex</code> irgendwo auf oder um die Radios.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die zwei Fakten prüft, die am ehesten zurückfallen &mdash; dass der
          Name das DOM erreicht und dass die Gruppe exklusiv ist:
        </p>
        <pre class="code-block"><code>{{ m.testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Jeder String am Control gehört dir</h3>
        <p>
          RadioButton liest nichts aus der Übersetzungskonfiguration der Bibliothek &mdash; keinen
          <code>aria</code>-Schlüssel, kein Standard-Label, nichts, was über <code>setTranslation</code> einzuspeisen wäre.
          Die drei Strings einer Radio-Gruppe sind die Legend, die Beschriftungen der Optionen und etwaiger Hinweistext,
          und alle drei kommen aus deiner Übersetzungsschicht.
        </p>
        <pre class="code-block"><code>{{ m.i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-radiobutton.mjs</code> referenziert weder das Übersetzungsobjekt der Konfiguration noch
          irgendeinen <code>aria</code>-Schlüssel (nachgeprüft, Optimus UI 2.0.2).
        </p>

        <h3>Was nicht übersetzt werden darf</h3>
        <ul>
          <li>
            <strong><code>name</code></strong> ist maschinelle Identität, kein Text. Ein übersetzter Name zerbricht die
            Gruppe in dem Moment, in dem zwei Sprachen sich uneinig sind, und ein Name, der durch Interpolation eines
            übersetzten Strings entsteht, ist derselbe Bug mit Extraschritten.
          </li>
          <li>
            <strong><code>inputId</code> und das <code>&lt;label for&gt;</code></strong> müssen aus dem stabilen Wert der
            Option abgeleitet werden, nie aus ihrer Beschriftung. Ein Sprachwechsel, der IDs ändert, zerbricht still jede
            Label-Zuordnung auf der Seite.
          </li>
          <li>
            <strong><code>value</code></strong> ist das, was gespeichert wird. Wenn er je der sichtbaren Beschriftung
            gleicht, ändert sich die gespeicherte Antwort mit der Sprache der Oberfläche.
          </li>
        </ul>

        <h3>Die Länge der Beschriftung ist ein Umbruchproblem, kein Breitenproblem</h3>
        <p>
          Das ist die eine Stelle, an der eine Radio-Gruppe leichter zu übersetzen ist als ein Segmented Control: Eine
          vertikale Gruppe nimmt eine um 40&nbsp;% längere Übersetzung auf, indem sie nach unten wächst, nichts läuft also
          über und nichts wird abgeschnitten. Zwei Dinge brauchen trotzdem Aufmerksamkeit:
        </p>
        <ul>
          <li>
            <strong>Umbrochene Beschriftungen brauchen Ausrichtung oben.</strong> Mit <code>align-items: center</code>
            schiebt eine zweizeilige Beschriftung den Kreis in die Mitte des Blocks. <code>flex-start</code> hält ihn neben
            der ersten Zeile.
          </li>
          <li>
            <strong>Eine horizontale Gruppe nimmt nichts auf.</strong> Wenn du die Optionen in einer Reihe angeordnet hast,
            weil sie auf Englisch hineinpassten, plan die Reihe für die längste Sprache, die du auslieferst, oder stapel sie
            stattdessen.
          </li>
        </ul>

        <h3>Bei Sprachwechsel neu aufbauen</h3>
        <p>
          Bau die Optionsliste in einem <code>computed()</code> aus dem Übersetzungsservice, damit die Beschriftungen einem
          Wechsel folgen; lass <code>track</code> auf dem Wert der Option, damit die Zeilen nicht zerstört und neu gebaut
          werden und der Fokus in der Gruppe erhalten bleibt. Weil IDs und Name aus dem Wert statt aus der Beschriftung
          abgeleitet sind, muss sich sonst nichts ändern.
        </p>

        <h3>Leichte Sprache und RTL</h3>
        <ul>
          <li>
            <strong>Varianten in Leichter Sprache</strong> wollen eine kurze Antwort pro Option und die ausformulierte
            Frage in der Legend. Wo eine Beschriftung in einfacher Sprache einen Satz braucht, setz den Satz in eine
            Hinweiszeile unter die Beschriftung, statt die Beschriftung wachsen zu lassen &mdash; das Klickziel bleibt so
            groß wie eine Antwort, nicht wie ein Absatz.
          </li>
          <li>
            <strong>RTL erledigt das ausgelieferte CSS.</strong> Der Input wird mit <code>inset-inline-start</code>
            positioniert, die Box spiegelt sich also ohne Aufwand. Was sich nicht von selbst spiegelt, ist deine Zeile: Nutz
            <code>flex-direction: row</code> mit logischem Padding statt eines fest eingetragenen
            <code>margin-left</code>, dann wandert der Kreis auf die richtige Seite der Beschriftung.
          </li>
        </ul>
        <p class="src-note">
          <code>.p-radiobutton-input &#123; inset-inline-start: 0 &#125;</code> in
          <code>&#64;openng/optimus-ui-styles/dist/radiobutton/index.mjs</code>. Dieses Kit liefert nur LTR-Sprachen aus, der
          Hinweis zu RTL ist also für nachgelagerte Erweiterungen.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Fokus-Ring ist der
            2px-Ring <code>--primary-color-fg</code> des Kits (vorher Auras 1px), zitiert aus „focus ring“; die
            Ungültig-Kante ist <code>--semantic-red-fg</code>; die Dark-Mode-Ausnahme des Akzents contrast ist weg (die
            dunkle Widget-Rampe kommt aus dem dunklen Vordergrund jeder Palette), daher listet die WCAG-Zusammenfassung
            keinen Verstoß; dunkle Zeilen neu zitiert.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) nachgeprüft:
            Kontrastzeilen sagen jetzt, worauf sie beruhen, und zitieren das Kontrast-Gate — der nicht gewählte Ring jetzt
            auf dem <code>--control-border</code> des Kits (am niedrigsten 3,85:1, vorher 1,48:1 auf Auras Token), die
            gewählten Zeilen je Akzent mit benannter Dark-Mode-Ausnahme des Akzents contrast, die Beschriftung aus
            <code>body text</code>; die eine Radio-Regel des Kits dokumentiert; veraltete Warnung „nicht kopieren“ an der
            Referenzimplementierung entfernt; Aussage zu schmalen Bildschirmen ergänzt; fehlplatzierte Textbausteine zu
            visuellen Stilen aus dem Agent-Doc entfernt, das unter das Größenziel gekürzt ist.
          </li>
          <li>
            <strong>v0.4</strong> &mdash; 02.09.2026 &mdash; Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): Die
            Box-Skala liegt wieder auf den Tokens von Aura 2.x (16/20/24px), <code>size="large"</code> ist also wieder ein
            konformes Ziel von 24px, und drei Aussagen zu v22 kippten &mdash; <code>styleClass</code> existiert als
            <code>&#64;deprecated</code>, <code>inputStyle</code> wird weiterhin neben <code>inputVariant</code> gelesen,
            und das Phantom-Attribut <code>autofocus="true"</code> ist zurück, weil der Input wieder ein nicht
            initialisiertes schlichtes <code>&#64;Input</code> ist. Die meisten Inputs sind schlichte Properties, keine
            Signals; alle Zeilenverweise gegen die Optimus-Bundles neu abgeleitet. Farb- und Browsermessungen aus 21
            gelten unverändert.
          </li>
          <li>
            <strong>v0.3</strong> &mdash; 24.08.2026 &mdash; Gegen PrimeNG 22.1.2 / Aura 3.0 nachgeprüft: Die Box-Skala
            schrumpfte auf 14/18/20px &mdash; keine Größe erreicht mehr das Ziel von 24px aus SC 2.5.8 (in 2.x traf large
            es genau); der Bug mit dem Phantom-Attribut <code>autofocus</code> ist upstream behoben (der Standardwert ist
            jetzt genau <code>false</code>); <code>styleClass</code> entfernt, Inputs sind Signal-Inputs,
            <code>tabindex</code> als number typisiert, der Selektor bekam einen Alias <code>p-radio-button</code>; alle
            Zeilenverweise neu abgeleitet. Farbmessungen aus 21 gelten weiter &mdash; die Farb-Tokens von radiobutton sind
            unverändert.
          </li>
          <li>
            <strong>v0.2</strong> &mdash; 20.08.2026 &mdash; WCAG-2.2-Statuszusammenfassung im Tab Design ergänzt:
            gemessene Kriterien als erfüllt / verfehlt / bedingt zusammengefasst, nicht gemessene Kriterien ausdrücklich
            nicht beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> &mdash; 30.07.2026 &mdash; Erste Fassung des Guides: Beispiele, die Grenze der
            Control-Wahl gegen jedes benachbarte Control, die drei Gruppierungsmechanismen, Design-Tokens und Kontrast,
            i18n und das kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class RadioButtonArticleDeComponent extends RadioButtonArticleComponent {
  /** Option sets with German labels and hints; values and flags are the English ones. */
  override readonly twoOptions = [
    { label: 'Ja', value: 'yes' },
    { label: 'Nein', value: 'no' },
  ];
  override readonly shippingOptions = [
    { label: 'Standard, 3–5 Tage', value: 'standard' },
    { label: 'Express, nächster Tag', value: 'express' },
    { label: 'Abholung im Laden', value: 'pickup' },
  ];
  override readonly planOptions = [
    { label: 'Free', value: 'free', hint: 'Ein Projekt, Community-Support.' },
    { label: 'Team', value: 'team', hint: 'Zehn Projekte, gemeinsame Workspaces.' },
    { label: 'Business', value: 'business', hint: 'Unbegrenzte Projekte, priorisierter Support.' },
  ];
  override readonly seatOptions = [
    { label: 'Gang', value: 'aisle', soldOut: false },
    { label: 'Mitte', value: 'middle', soldOut: false },
    { label: 'Fenster (ausverkauft)', value: 'window', soldOut: true },
  ];
  override readonly reasonOptions = [
    { label: 'Zu teuer', value: 'price' },
    { label: 'Mir fehlt eine Funktion', value: 'feature' },
    { label: 'Etwas anderes', value: 'other' },
  ];
  override readonly billingOptions = [
    { label: 'Monatlich', value: 'monthly' },
    { label: 'Jährlich', value: 'yearly' },
    { label: 'Nach Verbrauch', value: 'payg' },
  ];
  override readonly contactOptions = [
    { label: 'E-Mail', value: 'email' },
    { label: 'Telefon', value: 'phone' },
    { label: 'Post', value: 'post' },
  ];
  override readonly countryOptions = [
    { label: 'Österreich', value: 'at' },
    { label: 'Belgien', value: 'be' },
    { label: 'Dänemark', value: 'dk' },
    { label: 'Deutschland', value: 'de' },
    { label: 'Liechtenstein', value: 'li' },
    { label: 'Luxemburg', value: 'lu' },
    { label: 'Niederlande', value: 'nl' },
    { label: 'Schweden', value: 'se' },
    { label: 'Schweiz', value: 'ch' },
  ];

  override readonly sizeRows: RadioButtonArticleComponent['sizeRows'] = [
    { key: 'sm', label: 'klein (small)', size: 'small' },
    { key: 'md', label: 'Standard', size: undefined },
    { key: 'lg', label: 'groß (large)', size: 'large' },
  ];

  /** Playground choices with German labels; the values are the English ones. */
  override readonly countOptions = [
    { label: '2 Optionen', value: 2 },
    { label: '3 Optionen', value: 3 },
    { label: '5 Optionen', value: 5 },
  ];
  override readonly sizeOptions = [
    { label: 'Klein', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Groß', value: 'large' },
  ];
  override readonly layoutOptions = [
    { label: 'Gestapelt', value: 'column' },
    { label: 'Reihe', value: 'row' },
  ];

  protected override readonly pgPool = [
    { label: 'Standard', value: 'standard' },
    { label: 'Express', value: 'express' },
    { label: 'Abholung im Laden', value: 'pickup' },
    { label: 'Kurier', value: 'courier' },
    { label: 'Packstation', value: 'locker' },
  ];

  /** Example titles and notes in German; id and code come from the English base. */
  override readonly examples: RadioButtonArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));

  /** The measured values of the English article, with the prose around them in German; code stays English. */
  override readonly m: RadioButtonArticleComponent['m'] = {
    uncheckedBorderLight: '5,23:1',
    uncheckedBorderDark: '4,91:1',
    checkedFillLight: '5,18:1',
    checkedFillDark: '7,42:1',
    dotLight: '5,18:1',
    dotDark: '7,83:1',
    focusRingLight: '5,18:1',
    focusRingDark: '7,42:1',
    labelLight: '18,73:1',
    labelDark: '14,86:1',
    boxSmall: '16 x 16px',
    boxDefault: '20 x 20px',
    boxLarge: '24 x 24px',
    disabledOpacity: '1, nicht das globale 0.6',
    focusOutline: '2px solid var(--primary-color-fg), der Ring des Kits',
    focusOffset: '2px, ohne Box-Shadow',
    nativeValueAttr: 'value="true"',
    devImport: this.m.devImport,
    formSnippet: this.m.formSnippet,
    i18nSnippet: this.m.i18nSnippet,
    testSnippet: this.m.testSnippet,
  };
}
