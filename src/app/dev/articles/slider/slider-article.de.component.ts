import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SliderArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './slider-article.component';

/** German prose of the examples, keyed by example id. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  basic: {
    title: 'Die Grundform: Beschriftung, Wert, Name',
    note: 'Die Beschriftung trägt die Zahl und ist das Ziel von [ariaLabelledBy]. Ein String, zwei Zielgruppen.',
  },
  range: {
    title: 'Bereich — ein Intervall, zwei Handles',
    note: 'Das Modell wird zu [start, end]. Drück zweimal Tab, um beide Handles zu erreichen; beide sagen denselben Namen an.',
  },
  vertical: {
    title: 'Vertikale Ausrichtung',
    note: 'Braucht eine explizite Höhe — das Stylesheet garantiert nur min-height 100px. Die Pfeiltasten bilden weiterhin hoch = mehr ab.',
  },
  paired: {
    title: 'Slider plus Zahlenfeld, ein Modell',
    note: 'Die Antwort, wann immer Präzision manchmal zählt. Beachte, dass p-inputnumber inputId SEHR WOHL hat — es rendert ein echtes <input>.',
  },
  commit: {
    title: 'onChange vs. onSlideEnd',
    note: 'Zieh den Handle und nutz dann die Pfeiltasten: onSlideEnd feuert bei Tastatureingabe überhaupt nie — nur Ziehen und Klicks auf die Spur erreichen es. Plane dafür.',
  },
  states: {
    title: 'Deaktiviert und ungültig',
    note: 'Deaktiviert nimmt den Handle ganz aus der Tab-Reihenfolge. Ungültig fügt eine Klasse hinzu, die Aura nicht stylt — kombinier es mit einer Meldung.',
  },
};

/**
 * German twin of the Slider guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (step
 * options, example titles and notes, the fallbacks of the live ARIA readout) are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs slider`).
 */
@Component({
  selector: 'app-slider-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'slider'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jedes Control hier unten ist ein echter <code>p-slider</code>. Der Playground liest seinen eigenen gerenderten
          Handle aus dem DOM zurück, das ARIA-Panel darunter ist also keine Behauptung — es ist das, was ein Screenreader
          gerade übergeben bekommt. Beachte, dass sich <strong>jedes</strong> Beispiel über den <em>Input</em>
          <code>[ariaLabel]</code> oder <code>[ariaLabelledBy]</code> benennt und jedes Beispiel seinen Wert als Text
          zeigt: Die Tabs Verwendung und Entwicklung erklären, warum beides nicht verhandelbar ist.
        </p>

        <!-- Mini playground: live-configure a slider and read back both markup and ARIA. -->
        <section class="pg" aria-label="Slider-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-step-label">Schrittweite</span>
                <p-select
                  [ariaLabelledBy]="'pg-step-label'"
                  size="small"
                  [options]="stepOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgStep()"
                  (ngModelChange)="pgStep.set($event); scheduleRead()"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-range">Bereich (zwei Handles)</label>
                <p-toggleswitch
                  inputId="pg-range"
                  [ngModel]="pgRange()"
                  (ngModelChange)="pgRange.set($event); scheduleRead()"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-vertical">Vertikal</label>
                <p-toggleswitch
                  inputId="pg-vertical"
                  [ngModel]="pgVertical()"
                  (ngModelChange)="pgVertical.set($event); scheduleRead()"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-animate">Klicks auf die Leiste animieren</label>
                <p-toggleswitch inputId="pg-animate" [ngModel]="pgAnimate()" (ngModelChange)="pgAnimate.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Deaktiviert</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event); scheduleRead()"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label" id="pg-preview-label">
                Vorschau — Temperatur:
                <strong>{{ pgReadout() }}</strong>
              </span>
              <div class="pg__stage" [class.pg__stage--vertical]="pgVertical()" #pgStage>
                @if (pgRange()) {
                  <p-slider
                    [ariaLabelledBy]="'pg-preview-label'"
                    [min]="0"
                    [max]="40"
                    [step]="pgStep() ?? undefined"
                    [range]="true"
                    [orientation]="pgVertical() ? 'vertical' : 'horizontal'"
                    [animate]="pgAnimate()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgRangeValue()"
                    (ngModelChange)="pgRangeValue.set($event)"
                    (onChange)="scheduleRead()"
                  />
                } @else {
                  <p-slider
                    [ariaLabelledBy]="'pg-preview-label'"
                    [min]="0"
                    [max]="40"
                    [step]="pgStep() ?? undefined"
                    [orientation]="pgVertical() ? 'vertical' : 'horizontal'"
                    [animate]="pgAnimate()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                    (onChange)="scheduleRead()"
                  />
                }
              </div>
            </div>
          </div>

          <!-- Live ARIA readout — measured, not asserted. -->
          <div class="aria-panel">
            <div class="aria-panel__head">
              <span class="pg__code-label">Was Hilfstechnik gerade jetzt übergeben bekommt</span>
              <button type="button" class="copy-btn" (click)="scheduleRead()">Neu lesen</button>
            </div>
            @if (ariaRows().length === 0) {
              <p class="ex__note">Bewege einen Handle (oder drück Neu lesen), um den DOM auszulesen.</p>
            } @else {
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Handle</th>
                      <th>role</th>
                      <th>barrierefreier Name</th>
                      <th>valuenow</th>
                      <th>min / max</th>
                      <th>orientation</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of ariaRows(); track row.section) {
                      <tr>
                        <td>
                          <code>{{ row.section }}</code>
                        </td>
                        <td>
                          <code>{{ row.role }}</code>
                        </td>
                        <td>{{ row.name }}</td>
                        <td>
                          <strong>{{ row.now }}</strong>
                        </td>
                        <td>{{ row.min }} / {{ row.max }}</td>
                        <td>{{ row.orientation }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              <p class="ex__note">
                Modellwert: <code>{{ pgModelText() }}</code
                >. Mit <code>Step = none</code> wird das Modell auf ganze Zahlen abgerundet, und mit zwei Handles tragen
                beide Zeilen <em>denselben</em> Namen — keins von beidem ist eine Macke der Demo, beides erklärt der Tab
                Entwicklung.
              </p>
            }
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Erzeugtes Markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('basic') {
                  <div class="field">
                    <span class="pg__label" id="ex-basic-label">
                      Lernrate: <strong>{{ exBasic() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-basic-label'"
                      [min]="0"
                      [max]="100"
                      [step]="5"
                      [ngModel]="exBasic()"
                      (ngModelChange)="exBasic.set($event)"
                    />
                  </div>
                }
                @case ('range') {
                  <div class="field">
                    <span class="pg__label" id="ex-range-label">
                      Jahresbereich: <strong>{{ exRange()[0] }} – {{ exRange()[1] }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-range-label'"
                      [min]="1950"
                      [max]="2026"
                      [step]="1"
                      [range]="true"
                      [ngModel]="exRange()"
                      (ngModelChange)="exRange.set($event)"
                    />
                  </div>
                }
                @case ('vertical') {
                  <div class="field field--vertical">
                    <span class="pg__label" id="ex-vertical-label">
                      Lautstärke: <strong>{{ exVertical() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-vertical-label'"
                      orientation="vertical"
                      [min]="0"
                      [max]="100"
                      [step]="1"
                      [ngModel]="exVertical()"
                      (ngModelChange)="exVertical.set($event)"
                    />
                  </div>
                }
                @case ('paired') {
                  <div class="field paired">
                    <span class="pg__label" id="ex-paired-label">
                      Budget (EUR): <strong>{{ exPaired() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-paired-label'"
                      [min]="0"
                      [max]="5000"
                      [step]="50"
                      [ngModel]="exPaired()"
                      (ngModelChange)="exPaired.set($event)"
                    />
                    <p-inputnumber
                      inputId="ex-paired-number"
                      ariaLabel="Budget in Euro, exakter Wert"
                      [min]="0"
                      [max]="5000"
                      [step]="50"
                      [showButtons]="true"
                      [ngModel]="exPaired()"
                      (ngModelChange)="exPaired.set($event ?? 0)"
                    />
                  </div>
                }
                @case ('commit') {
                  <div class="field">
                    <span class="pg__label" id="ex-commit-label">
                      Stichprobengröße: <strong>{{ exCommit() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-commit-label'"
                      [min]="1"
                      [max]="200"
                      [step]="1"
                      [ngModel]="exCommit()"
                      (onChange)="onCommitDrag($event)"
                      (onSlideEnd)="onCommitEnd()"
                    />
                    <p class="ex__note">
                      <code>onChange</code> hat <strong>{{ dragTicks() }}</strong>-mal ausgelöst, <code>onSlideEnd</code>
                      <strong>{{ commitTicks() }}</strong>-mal. Billige Arbeit gehört in das erste, teure Arbeit in das
                      zweite.
                    </p>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <span class="pg__label" id="ex-disabled-label"> Deaktiviert: <strong>30</strong> </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-disabled-label'"
                      [min]="0"
                      [max]="100"
                      [step]="1"
                      [disabled]="true"
                      [ngModel]="30"
                    />
                  </div>
                  <div class="field">
                    <span class="pg__label" id="ex-invalid-label">
                      Ungültig: <strong>{{ exInvalid() }}</strong>
                    </span>
                    <p-slider
                      [ariaLabelledBy]="'ex-invalid-label'"
                      [min]="0"
                      [max]="100"
                      [step]="1"
                      [invalid]="true"
                      [ngModel]="exInvalid()"
                      (ngModelChange)="exInvalid.set($event)"
                    />
                  </div>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Ziehen, tippen oder wählen? Die ehrliche Tabelle</h3>
        <p>
          Ein Slider ist das richtige Control, wenn der Nutzer <strong>nach einer Wirkung sucht, nicht eine Zahl
          eingibt</strong> — wenn „ein bisschen mehr“ ein vollständiger Gedanke ist und das Ergebnis sichtbar wird, während
          sich der Handle bewegt. Sobald der Nutzer mit einer bestimmten Zahl im Kopf ankommt, wird das Ziehen zum
          Geschicklichkeitsspiel, und der Slider ist das falsche Control.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Die Absicht des Nutzers</th>
                <th>Wertebereich</th>
                <th>Exakte Eingabe</th>
                <th>Tastaturkosten eines großen Sprungs</th>
                <th>Touch / Smartphone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-slider</code></td>
                <td>„Irgendwo hier ungefähr“ — ein Ergebnis steuern und zusehen, wie es sich ändert.</td>
                <td>Kontinuierlich oder fein abgestuft numerisch.</td>
                <td><strong>Keine.</strong> Es gibt kein Textfeld, in das man tippen könnte.</td>
                <td>
                  Ein <kbd>step</kbd> pro Pfeiltaste; <kbd>PageUp</kbd>/<kbd>PageDown</kbd> entsprechen den Pfeiltasten,
                  sobald ein <code>step</code> gesetzt ist, und im Bereichsmodus immer. 0–200 in Schritten von 1 sind 200
                  Tastendrücke; <kbd>Home</kbd>/<kbd>End</kbd> springen an die Enden.
                </td>
                <td>
                  Eine kleine Scheibe auf einer 3px-Spur — Auras Standard liegt unter der Untergrenze von WCAG 2.5.8, und
                  es ist genau das eine Ziel, das präzise getroffen werden muss.
                </td>
              </tr>
              <tr>
                <td><code>p-inputnumber</code></td>
                <td>„Es ist 1750.“ Die Zahl selbst ist die Antwort.</td>
                <td>Beliebig, auch unbegrenzt und mit Dezimalstellen.</td>
                <td><strong>Ja</strong> — tippen, einfügen, einen Tippfehler korrigieren.</td>
                <td>Kostenlos: eintippen. <code>[showButtons]</code> ergänzt ±step-Buttons.</td>
                <td>
                  Ein echtes <code>&lt;input&gt;</code>, also erscheint die numerische Tastatur des Betriebssystems, und
                  <code>inputId</code> + <code>&lt;label for&gt;</code> funktionieren wirklich.
                </td>
              </tr>
              <tr>
                <td><code>p-slider</code> + <code>p-inputnumber</code>, dasselbe Modell</td>
                <td>Beides: erst erkunden, dann festnageln.</td>
                <td>Begrenzt numerisch, wo Präzision manchmal zählt.</td>
                <td>Ja, über das Feld.</td>
                <td>Kostenlos.</td>
                <td>Kostet vertikalen Platz; gib dem Paar eine Beschriftung und benenne beide Controls.</td>
              </tr>
              <tr>
                <td><code>p-select</code> / <code>p-selectbutton</code></td>
                <td>Die Stufen sind benannt, nicht gemessen („Niedrig / Mittel / Hoch“).</td>
                <td>Eine Handvoll diskreter Stufen.</td>
                <td>Entfällt — der Nutzer wählt ein Label.</td>
                <td>Ein Tastendruck (Type-ahead / Pfeiltaste).</td>
                <td>Ziele in voller Größe; kein Zielen nötig.</td>
              </tr>
              <tr>
                <td><code>p-slider [range]</code></td>
                <td>Ein Intervall, dessen zwei Enden zusammengehören („1950 bis 2026“).</td>
                <td>Numerisches Intervall.</td>
                <td>Nein.</td>
                <td>Wie oben, pro Handle.</td>
                <td>
                  Zwei 20px-Ziele, die übereinander landen können. Lies die Benennungslücke im Tab Entwicklung, bevor du
                  das wählst.
                </td>
              </tr>
              <tr>
                <td>zwei getrennte Slider / Felder</td>
                <td>Zwei Werte, die bloß zufällig nebeneinanderliegen.</td>
                <td>Beliebig.</td>
                <td>Kommt drauf an.</td>
                <td>Kommt drauf an.</td>
                <td>Die einzige Option, bei der jeder Wert seinen eigenen Namen tragen kann — was <code>[range]</code> nicht kann.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> Die Verhaltensspalten sind aus den Quellen von Optimus UI
          2.0.2 in <code>node_modules</code> gelesen; die Geometriezahlen sind die Aura-2.x-Token (Design und Entwicklung
          führen sie). Die Absichtsspalte ist ein <em>Urteil</em>: Sie kodiert „ist die Zahl die Antwort, oder ist die
          Zahl ein Drehregler“, und du solltest sie überstimmen, wenn dein Inhalt etwas anderes sagt. Kit-Konvention:
          Slider sind horizontal, jeder einzelne wird über den Input <code>[ariaLabel]</code> /
          <code>[ariaLabelledBy]</code> benannt und zeigt seinen Wert als Text — und das Kit liefert überhaupt kein
          numerisches Texteingabefeld, die Zeilen <code>p-inputnumber</code> und „Slider plus Feld“ sind also aus der
          Bibliothek dokumentiert statt aus einer Aufrufstelle, die du hier lesen kannst.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Slider ohne Zahl</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-value-bad-label">Schwellenwert</span>
                <p-slider
                  [ariaLabelledBy]="'dd-value-bad-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddValue()"
                  (ngModelChange)="ddValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              <code>p-slider</code> rendert nirgends einen Wert — nicht im Handle, nicht in einem Tooltip, nirgends (die
              ganze Komponente besteht aus drei <code>&lt;span&gt;</code>s um ein verstecktes natives Range-Input; siehe
              die Anatomie im Tab Design). Ein sehender Nutzer muss raten, was er eingestellt hat, und kann es dir in einem
              Bug-Report nicht zurückmelden.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — zeig den Wert in der Beschriftung</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-value-good-label">
                  Schwellenwert: <strong>{{ ddValue() }}%</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-value-good-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddValue()"
                  (ngModelChange)="ddValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Die Beschriftung trägt die Zahl <em>und</em> ist das Ziel von <code>[ariaLabelledBy]</code>, derselbe Text
              bedient also beide Leser. Das ist die Kit-Konvention für jeden Slider, den es ausliefert, und sie ist der
              Grund, warum es funktioniert.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — benenne ihn mit &lt;label for&gt; oder einem Host-Attribut</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-name-bad"
                  >Dämpfung: <strong>{{ ddName() }}</strong></label
                >
                <p-slider
                  id="dd-name-bad"
                  [attr.aria-label]="'Dämpfung'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Beide Mechanismen gehen ins Leere. <code>&lt;label for&gt;</code> löst zu nichts auf —
              <code>label.control</code> ist <code>null</code>, weil <code>&lt;p-slider&gt;</code> ein Custom Element ist
              und Custom Elements nicht beschriftbar sind — und der Handle-Span darin trägt keine <code>id</code>, die ein
              <code>for</code> finden könnte. <code>[attr.aria-label]</code> landet auf demselben rollenlosen Host, nicht
              auf dem Handle darin. Nichts rettet eins von beiden: Der Handle links hat überhaupt keinen barrierefreien Namen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — nutz den Input [ariaLabelledBy]</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-name-good-label"
                  >Dämpfung: <strong>{{ ddName() }}</strong></span
                >
                <p-slider
                  [ariaLabelledBy]="'dd-name-good-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Der Input wird als <code>[attr.aria-labelledby]</code> an den Handle-Span gebunden, der tatsächlich
              <code>role="slider"</code> trägt (<code>openng-optimus-ui-slider.mjs:649</code>), der Name kommt also ohne
              Patch an — und weil er auf die lebende Beschriftung zeigt, bleibt er richtig, wenn sich der Wert ändert.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Bereich für zwei unabhängige Werte</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-range-bad-label">
                  Min.- / Max.-Preis: <strong>{{ ddRange()[0] }} / {{ ddRange()[1] }}</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-range-bad-label'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [range]="true"
                  [ngModel]="ddRange()"
                  (ngModelChange)="ddRange.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Ein Input <code>ariaLabel</code>, zwei Handles — das Kit setzt denselben String auf beide (<code
                >openng-optimus-ui-slider.mjs:675-676, :701-702</code
              >). Das Bereichsbeispiel im Tab Beispiele zeigt die Folge in seiner eigenen ARIA-Auslesung: zwei
              Slider-Knoten mit demselben Namen, die sich nur in ihrem Wert unterscheiden. Ein Screenreader-Nutzer hört
              diesen Namen zweimal und muss erschließen, an welchem Ende er ist. Zwei Slider kosten eine zusätzliche
              Beschriftung und beseitigen die Mehrdeutigkeit vollständig.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — zwei Slider, zwei Namen</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-range-good-lo"
                  >Niedrigster Preis: <strong>{{ ddLo() }}</strong></span
                >
                <p-slider
                  [ariaLabelledBy]="'dd-range-good-lo'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddLo()"
                  (ngModelChange)="setLo($event)"
                />
                <span class="pg__label" id="dd-range-good-hi"
                  >Höchster Preis: <strong>{{ ddHi() }}</strong></span
                >
                <p-slider
                  [ariaLabelledBy]="'dd-range-good-hi'"
                  [min]="0"
                  [max]="100"
                  [step]="1"
                  [ngModel]="ddHi()"
                  (ngModelChange)="setHi($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Jedes Ende bekommt seine eigene Beschriftung, seinen eigenen barrierefreien Namen und seinen eigenen
              Tastatur-Fokusstopp, und die Reihenfolge erzwingst du selbst. Heb dir <code>[range]</code> für ein einzelnes
              Intervall auf, das sich als eine Idee liest („der gezeigte Zeitraum“), bei dem „Anfang“ und „Ende“ aus dem
              Kontext klar sind.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — für eine präzise Zahl ziehen</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-precise-bad-label">
                  Budget: <strong>{{ ddPreciseA() }} EUR</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-precise-bad-label'"
                  [min]="0"
                  [max]="5000"
                  [step]="1"
                  [ngModel]="ddPreciseA()"
                  (ngModelChange)="ddPreciseA.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              5.000 Schritte auf rund 500 Pixeln: Ein Pixel sind zehn Euro, eine Maus kann „1.750“ also schlicht nicht
              ausdrücken. Per Tastatur sind es bis zu 5.000 Pfeiltastendrücke, weil auch
              <kbd>PageUp</kbd> um <code>step</code> springt. Motorisch eingeschränkte Nutzer und Screenreader-Nutzer zahlen
              diesen Preis voll.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — kombinier ihn mit einem Feld, oder lass den Slider weg</span>
            <div class="dd__stage">
              <div class="field paired">
                <span class="pg__label" id="dd-precise-good-label">
                  Budget: <strong>{{ ddPreciseB() }} EUR</strong>
                </span>
                <p-slider
                  [ariaLabelledBy]="'dd-precise-good-label'"
                  [min]="0"
                  [max]="5000"
                  [step]="50"
                  [ngModel]="ddPreciseB()"
                  (ngModelChange)="ddPreciseB.set($event)"
                />
                <p-inputnumber
                  inputId="dd-precise-number"
                  ariaLabel="Budget in Euro, exakter Wert"
                  [min]="0"
                  [max]="5000"
                  [showButtons]="true"
                  [ngModel]="ddPreciseB()"
                  (ngModelChange)="ddPreciseB.set($event ?? 0)"
                />
              </div>
            </div>
            <p class="dd__why">
              Der Slider behält das grobe Erkunden (Schrittweite 50, ~100 erreichbare Positionen); das Feld nimmt jeden
              exakten Wert mit einem Tastendruck. Hat das Erkunden überhaupt keinen Wert, liefer das Feld allein aus — ein
              Slider, mit dem man nicht zielen kann, ist Dekoration.
            </p>
          </div>
        </div>

        <h3>Faustregeln, die den Kontakt mit dem Kit überlebt haben</h3>
        <ul>
          <li>
            <strong>Render den Wert immer als Text.</strong> Die Komponente zeigt nichts; die Beschriftung ist die einzige
            Anzeige, und sie dient zugleich als barrierefreier Name.
          </li>
          <li>
            <strong>Zähl die Pfeiltastendrücke.</strong> <code>(max - min) / step</code> sind die Tastaturkosten, um den
            Bereich zu durchqueren. Ab rund 100 mach entweder <code>step</code> gröber oder ergänze ein Feld —
            <kbd>PageUp</kbd> rettet dich nicht.
          </li>
          <li>
            <strong>Halte die Wirkung während des Ziehens sichtbar.</strong> Erscheint das Ergebnis erst nach dem
            Loslassen, ist der eine Vorteil des Sliders weg; nimm ein Feld.
          </li>
          <li>
            <strong>Gib ihm die Breite explizit.</strong> Der Host ist <code>display: block</code>
            ohne intrinsische Breite; in einem Flex- oder Grid-Kind kann er zusammenfallen. Kit-Konvention: Jede
            Aufrufstelle setzt sie, entweder mit einer gescopten
            <code>p-slider &#123; width: 100% &#125;</code>-Regel oder inline per
            <code>[style]="&#123;'width': '100%'&#125;"</code>. Ohne kommt niemand davon.
          </li>
          <li>
            <strong>Mach ihn nie zum einzigen Weg zu einem Wert.</strong> WCAG 2.1.1 handelt von der Tastatur, aber ein
            Slider mit 5.000 Schritten ist technisch bedienbar und praktisch nicht.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/slider/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Slider pattern</a
            >
            — der Tastaturvertrag, gegen den dieser Guide das Kit prüft, einschließlich „Page Up: Increase the value by a
            larger amount“ und der Anforderung, dass die Rolle
            <code>slider</code> <code>aria-valuenow</code>, <code>aria-valuemin</code> und
            <code>aria-valuemax</code> trägt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — APG, Multi-Thumb Slider pattern</a
            >
            — „Each thumb has an accessible label“, genau die Anforderung, die der einzelne Input
            <code>ariaLabel</code> des Kits nicht erfüllen kann; die Grundlage des Bereichs-Do/Don’t oben.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-valuetext</code></a
            >
            — „if the value is not a number, or the number is not the user-facing value“, setze valuetext; die Referenz
            dafür, warum ein rohes <code>aria-valuenow</code> für einen Prozentwert, eine Währung oder einen
            Dämpfungsfaktor nicht genügt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — die Untergrenze von 24x24 CSS-Pixeln, unter der Auras 20x20-Handle liegt, die Ausnahmeliste, unter die er
            nicht fällt, und damit der Grund, warum dieses Kit die Größen-Token überschreibt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 für die Teile eines Controls, die einen Zustand vermitteln; der Maßstab für die 3px-Spur gegen den
            Seitenhintergrund und für die Fokus-Outline.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — das Kriterium, gegen das der Tab Design die Handle-Outline misst, in beiden Themes.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — die Liste der <em>beschriftbaren</em> Elemente. Ein Custom Element wie <code>&lt;p-slider&gt;</code> gehört
            nicht dazu, und das ist der Mechanismus hinter dem toten <code>&lt;label for&gt;</code>.
          </li>
          <li>
            <a href="https://primeng.org/slider" target="_blank" rel="noopener noreferrer">
              PrimeNG — Slider component</a
            >
            — die Upstream-API, die Optimus forkt; dieser Guide bildet sie auf die Konventionen des Kits ab und prüft dann
            jede Behauptung gegen den ausgelieferten Optimus-Quelltext, der dort abweicht, wo der Fork beim v21-Code
            geblieben ist.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>
          Hier gibt es <em>kein</em> natives <code>&lt;input type="range"&gt;</code> — der Neubau aus PrimeNG 22 ist nicht
          in diesem Fork. Das fokussierbare Element und die gesamte ARIA-Oberfläche ist der Handle-<code>&lt;span&gt;</code>
          selbst. Das Host-Element ist die Spur, und alles Sichtbare ist ein positionierter <code>&lt;span&gt;</code>:
        </p>
        <ul>
          <li>
            <strong>Spur</strong> — der <code>&lt;p-slider&gt;</code>-Host selbst: <code>display: block</code>,
            <code>position: relative</code>, Hintergrund und Radius der Spur, dazu die Zustandsklassen
            (<code>p-disabled</code>, <code>p-invalid</code>, <code>p-slider-horizontal</code> / <code>-vertical</code>,
            <code>p-slider-animate</code>). In horizontaler Ausrichtung ist seine <em>Höhe die Spurdicke</em> — 3px.
          </li>
          <li>
            <strong>Bereichsfüllung</strong> — <code>span.p-slider-range</code>, absolut positioniert, bemessen über
            <code>inset-inline-start</code> + <code>width</code> (logisch, kehrt sich also unter RTL um).
          </li>
          <li>
            <strong>Handle</strong> — <code>span.p-slider-handle</code>, die sichtbare Scheibe. Er trägt selbst
            <code>role="slider"</code>, dazu
            <code>aria-valuemin</code>/<code>-valuenow</code>/<code>-valuemax</code>, <code>aria-orientation</code>, die
            beiden Benennungsattribute und den Tab-Stopp — der Span ist das, was den Fokus bekommt und den barrierefreien
            Namen trägt; den Fokus-Ring zeichnet <code>.p-slider-handle:focus-visible</code>. Mit
            <code>[range]="true"</code> gibt es zwei Handles, unterschieden durch
            <code>data-pc-section="startHandler"/"endHandler"</code>.
          </li>
          <li>
            <strong>Handle-Kern</strong> — ein <code>::before</code>-Pseudoelement, 16x16, in der Oberflächenfarbe mit
            weichem Schatten gemalt; der „Ring“-Look ist also in Wahrheit eine 20px-Scheibe mit einer 16px-Scheibe
            obendrauf.
          </li>
          <li>
            <strong>Sonst nichts.</strong> Keine Wertblase, keine Teilstriche, keine Markierungen, kein Tooltip — soll der
            Nutzer die Zahl sehen, renderst du sie.
          </li>
        </ul>
        <p class="src-note">
          Anatomie gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-slider.mjs</code> (Optimus UI
          2.0.2: Bereichsfüllung bei :598-628, der einzelne Handle bei :629-656 mit seinem ARIA bei :645-651, die zwei
          Bereichs-Handles bei :658-708) und aus dem ausgelieferten Stylesheet
          <code>&#64;openng/optimus-ui-styles/dist/slider/index.mjs</code> (2.0.2 — es gibt keine Regel
          <code>.p-slider-input</code>, der Ring sitzt am Handle).
        </p>

        <h3>Geometrie — Auras Token, und der eine, den das Kit ändert</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teil</th>
                <th>Token</th>
                <th>Aura-Standard</th>
                <th>Was dieses Kit rendert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Spurdicke</td>
                <td><code>--p-slider-track-size</code></td>
                <td>3px</td>
                <td>Gleich — Host <code>height: 3px</code>, unabhängig von der Breite</td>
              </tr>
              <tr>
                <td>Spurradius</td>
                <td><code>--p-slider-track-border-radius</code></td>
                <td><code>&#123;content.border.radius&#125;</code> (6px)</td>
                <td>
                  Die Radius-Skala des aktiven visuellen Stils (0 in <code>werkbund</code>, 12px im Standard
                  <code>lernwerkstatt</code>); Host
                  <code>display: block</code> / <code>position: relative</code>
                </td>
              </tr>
              <tr>
                <td>Spurfarbe</td>
                <td><code>--p-slider-track-background</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td>
                  <code>--control-border</code> (Kit, <code>styles.scss</code>) — Auras <code>surface.200</code> /
                  <code>surface.700</code> maßen 1,13–1,76:1 auf den Untergründen der Stile
                </td>
              </tr>
              <tr>
                <td>Bereichsfüllung</td>
                <td><code>--p-slider-range-background</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>Die Primärfarbe des Themes, je gewähltem Farb-Theme</td>
              </tr>
              <tr class="row--warn">
                <td><strong>Handle</strong></td>
                <td><code>--p-slider-handle-width</code> / <code>-height</code></td>
                <td>20px / 20px</td>
                <td>
                  <strong>24 x 24</strong> — das Kit hebt beide Token auf <code>.p-slider</code> in
                  <code>styles.scss</code> an; siehe unten
                </td>
              </tr>
              <tr>
                <td>Handle-Radius</td>
                <td><code>--p-slider-handle-border-radius</code></td>
                <td>50%</td>
                <td>Gleich</td>
              </tr>
              <tr>
                <td>Handle-Kern (<code>::before</code>)</td>
                <td><code>--p-slider-handle-content-width</code> / <code>-height</code></td>
                <td>16px / 16px</td>
                <td>Gleich — Schatten <code>0 0.5px 0 rgba(0,0,0,.08), 0 1px 1px rgba(0,0,0,.14)</code></td>
              </tr>
              <tr>
                <td>Fokus-Ring</td>
                <td><code>--p-slider-handle-focus-ring-*</code></td>
                <td>1px solid, Offset 2px, kein Schatten</td>
                <td>2px solid <code>--primary-color-fg</code>, Offset 2px (der Kit-Ring); siehe die Zustandstabelle unten</td>
              </tr>
              <tr>
                <td>Transition</td>
                <td><code>--p-slider-transition-duration</code></td>
                <td>0.2s</td>
                <td>Gleich — auf background/color/border/shadow/outline</td>
              </tr>
              <tr>
                <td>Cursor</td>
                <td>—</td>
                <td><code>grab</code>, <code>touch-action: none</code></td>
                <td>Gleich</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und Standardwerte aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/slider/index.mjs</code>
          (<code>track.size: '3px'</code>, <code>handle: &#123; width: '20px', height: '20px' &#125;</code>,
          <code>handle.content: &#123; width: '16px', height: '16px' &#125;</code>,
          <code>handle.focusRing: &#123;focus.ring.*&#125;</code>); die Boxgrößen sind der berechnete Style an einem
          gerenderten Handle. Achte darauf, welcher Fokus-Ring-Token das ist: Der Slider-Handle nutzt den <em>globalen</em>
          <code>&#123;focus.ring.*&#125;</code> (1px solid, Offset 2px), <strong>nicht</strong> den
          <code>&#123;form.field.focusRing&#125;</code>, den Aura für textartige Inputs auf null setzt — selbst ohne
          dieses Kit bekommt ein Slider also eine 1px-Outline. In diesem Kit ersetzt sie der eine Kit-Ring (2px, unten).
        </p>

        <h3>Die 24-Pixel-Untergrenze: warum das Kit die Handle-Größe überschreibt</h3>
        <p>
          WCAG 2.2 SC 2.5.8 verlangt ein Ziel von 24 x 24 CSS-Pixeln, und Auras Handle misst
          <strong>20 x 20</strong> — vier Pixel zu wenig. Keine der Ausnahmen greift: Der Handle ist kein Inline-Text, nicht
          vom User-Agent gesteuert und in dieser Größe nicht „wesentlich“. Die 3px-Spur hilft auch nicht; sie ist
          horizontal ein breites Ziel und vertikal fast nichts. Also hebt das Kit die beiden Größen-Token zentral an:
        </p>
        <pre class="code-block"><code>{{ targetSizeSnippet }}</code></pre>
        <p>Drei Details machen diese Überschreibung sicher zum Kopieren, und sie sind der Grund, warum sie so geschrieben ist:</p>
        <ul>
          <li>
            <strong>Der Handle bleibt auf der Spur.</strong> Seine zentrierenden Margins leiten sich aus denselben beiden
            Token ab (<code>margin-block-start: calc(-1 * calc(handle.height / 2))</code> in
            <code>&#64;openng/optimus-ui-styles/dist/slider/index.mjs</code>), wer die Token ändert, verschiebt die Margins
            also mit. Würdest du stattdessen <code>width</code>/<code>height</code> direkt setzen, rutschte der Handle aus
            der Mitte.
          </li>
          <li>
            <strong>Sie ist auf <code>.p-slider</code> deklariert, nicht auf <code>:root</code>.</strong> Das Kit spielt
            seinen eigenen <code>:root</code>-Token-Block aus einem <code>&lt;style&gt;</code>-Tag zur Laufzeit ein, der
            nach dem Kit-Stylesheet landet und bei gleicher Spezifität gewinnen würde. Eine Klasse schlägt ihn ohne
            <code>!important</code>.
          </li>
          <li>
            <strong>Es ist eine Token-Entscheidung, keine der Aufrufstelle.</strong> Die Alternative — ein Wrapper mit
            vertikalem Padding — vergrößert das Zeigerziel, ohne das visuelle Design zu ändern, und ist eine Überlegung
            wert, wenn eine 24px-Scheibe für dein Layout zu wuchtig ist. So oder so: Entscheide es einmal und zentral.
          </li>
        </ul>
        <p class="src-note">
          Nicht behauptet: keine Messung auf einem echten Touch-Gerät. Der Kontrast ist per Gate geprüft: Spur und
          Handle-Ring sind <code>--control-border</code>, 3,85–5,23:1 hell / 3,97–5,51:1 dunkel auf Untergrund und Karte
          in jedem Stil (die Zeilen „progressbar &amp; slider“ in <code>docs/generated/CONTRAST.MD</code>). Klicks auf die
          Spur solltest du trotzdem kennen — ein Klick irgendwo auf den Host lässt den Wert an diese Position springen
          (Host-<code>click</code> → <code>onHostClick</code> → <code>onBarClick</code>,
          <code>openng-optimus-ui-slider.mjs:180-182, :259-271</code>).
        </p>

        <h3>Interaktionszustände</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Aura-Token-Ebene</th>
                <th>Was dieses Kit rendert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ruhe</td>
                <td>
                  Handle-Hintergrund <code>&#123;content.border.color&#125;</code>, Kern in
                  <code>&#123;surface.0&#125;</code> (hell) / <code>&#123;surface.950&#125;</code> (dunkel)
                </td>
                <td>
                  Das Kit lenkt Ring und Spur auf <code>--control-border</code> um und den Kern auf
                  <code>--surface-card</code>: ein Ring ≥ 3:1 auf jeder Seitenoberfläche (per Gate geprüft) um eine
                  kartenfarbene Scheibe. Füllung <code>&#123;primary.color&#125;</code>.
                </td>
              </tr>
              <tr>
                <td>Hover</td>
                <td>
                  <code>.p-slider:not(.p-disabled) .p-slider-handle:hover</code> → Hintergrund
                  <code>&#123;slider.handle.hover.background&#125;</code>, Kern →
                  <code>&#123;content.background&#125;</code>
                </td>
                <td>
                  Aura lässt den Ring beim Hover in der Ruhefarbe; das Kit dunkelt ihn (hell) ab / hellt ihn (dunkel) auf
                  zu <code>--text-color-secondary</code>. Bewusst dezent; verlass dich nicht darauf, um Bedienbarkeit zu
                  signalisieren.
                </td>
              </tr>
              <tr>
                <td>focus-visible</td>
                <td>
                  <code>.p-slider-handle:focus-visible</code> → <code>outline</code> aus
                  <code>&#123;focus.ring.width/style/color&#125;</code> mit <code>&#123;focus.ring.offset&#125;</code>;
                  die Basisregel setzt in Ruhe außerdem <code>outline-color: transparent</code>.
                </td>
                <td>
                  <strong>Der Kit-Ring.</strong> <code>.p-slider-handle:focus-visible</code> steht in der einen Ring-Regel
                  des Kits: <code>2px solid var(--primary-color-fg)</code> bei <code>outline-offset: 2px</code>,
                  <code>!important</code>, beide Themes — der Ring, den jedes Feld und jeder Button zeigt, anstelle von
                  Auras 1px.
                </td>
              </tr>
              <tr>
                <td>deaktiviert</td>
                <td>
                  <code>.p-disabled</code> auf dem Host; der Handle behält seine Farben, und das Attribut
                  <code>tabindex</code> wird vollständig entfernt (<code
                    >[attr.tabindex]="$disabled() ? null : tabindex"</code
                  >).
                </td>
                <td>
                  Die globale <code>--p-disabled-opacity: 0.6</code> greift. Weil der Handle die Tab-Reihenfolge verlässt,
                  statt als <code>aria-disabled</code> markiert zu werden, kann ein Tastaturnutzer nicht auf ihm landen, um
                  zu entdecken, dass er deaktiviert ist — nenne den Grund in benachbartem Text.
                </td>
              </tr>
              <tr>
                <td>ungültig</td>
                <td><code>[invalid]="true"</code> fügt dem Host <code>p-invalid</code> hinzu.</td>
                <td>
                  Auras Slider-Preset definiert <strong>keine</strong> Farben für ungültig, die Klasse landet also, und
                  visuell ändert sich nichts. Muss der ungültige Zustand an einem Slider sichtbar sein, style
                  <code>.p-invalid</code> selbst und kombinier es mit einer Textmeldung.
                </td>
              </tr>
              <tr>
                <td>Ziehen</td>
                <td>
                  der Host bekommt <code>data-p-sliding="true"</code>; die <code>transition</code> des Handles steht auf
                  <code>none</code>, solange <code>dragging</code> gilt.
                </td>
                <td>
                  Gleich. <code>[animate]="true"</code> fügt <code>p-slider-animate</code> hinzu, das während eines
                  Ziehens entfernt und beim Loslassen wiederhergestellt wird, also animieren nur <em>Klicks</em>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Eine Falle, die es wert ist, wiederholt zu werden, bevor du einen Fokus-Ring misst.</strong>
          <code>outline-color</code> steht in der <code>transition</code>-Liste des Handles (<code
            >background, color, border-color, box-shadow, outline-color</code
          >, alle <code>0.2s</code>), ein berechneter Style, der im selben Tick wie <code>.focus()</code> gelesen wird,
          meldet also <code>outline-color: rgba(0,0,0,0)</code> — transparent — und sieht genau aus wie ein fehlender
          Fokus-Indikator. Ist er nicht: Wart die Transition ab, und die Farbe ist da. Jede automatische
          Accessibility-Prüfung, die direkt nach dem Fokussieren einen Screenshot macht oder misst, meldet hier ein
          falsches Positiv. Die Zustandsregeln selbst sind das ausgelieferte Stylesheet in
          <code>&#64;openng/optimus-ui-styles/dist/slider/index.mjs</code> (2.0.2), und die Klassen-/Attributlogik ist
          <code>openng-optimus-ui-slider.mjs</code> (Optimus UI 2.0.2 — das Ziehen erscheint als Host-Attribut
          <code>data-p-sliding</code>, und der aktive Bereichs-Handle bekommt zusätzlich
          <code>p-slider-handle-active</code>). Die Farbe des Rings ist das <code>--primary-color-fg</code> des Akzents,
          dessen Verhältnisse auf jeder Seitenoberfläche die per Gate geprüften Zeilen „focus ring“ in CONTRAST.MD sind
          (≥ 3,88:1).
        </p>

        <h3>Was das Kit ändert und was es in Ruhe lässt</h3>
        <p>
          Das globale Stylesheet berührt den Slider an drei Stellen: die beiden Handle-Größen-Token oben, die Farben von
          Spur, Handle-Ring und Kern (<code>--control-border</code>, <code>--surface-card</code>) und den Fokus-Ring
          (die eine Ring-Regel des Kits, <code>!important</code>, also landet <code>--p-slider-handle-focus-ring-*</code>
          nicht mehr). Alles
          andere in der Tabelle ist die unveränderte Aura-Ebene — anders als bei
          <code>p-select</code> gibt es keine <code>!important</code>-Farbüberschreibung, die gegen die Token kämpft,
          eine nachgelagerte Überschreibung jeder anderen <code>--p-slider-*</code>-Eigenschaft landet also wie geschrieben.
        </p>
        <p>
          Restyling pro Aufrufstelle ist eine andere Sache und verdient es, als Muster benannt zu werden: Der
          Datumsbereichs-Slider der Zeitleiste trägt seinen eigenen gescopten Block unter einer
          <code>styleClass</code> — eine dickere Spur, einen Handle in der Primärfarbe mit Oberflächenrand, eine
          Hover-Skalierung und einen Fokus-Schatten. Das ist ein legitimes lokales Design, aber es bedeutet, dass
          Messungen an einem umgestylten Slider nicht den Standard beschreiben. Wenn du Geometrie zitierst, zitier sie von
          einem ungestylten.
        </p>

        <h3>Breite und Layout</h3>
        <p>
          Der Host ist <code>display: block</code> ohne eigene Breite, er füllt also einen Block-Container und kann als
          Flex- oder Grid-Element auf nichts zusammenfallen. Kit-Konvention ist deshalb, sie an jeder Aufrufstelle zu
          setzen — eine gescopte <code>p-slider &#123; width: 100%; display: block; &#125;</code>-Regel oder inline
          <code>[style]</code>, wo die Komponente kein eigenes Stylesheet hat. Vertikale Slider bekommen vom
          ausgelieferten Stylesheet <code>min-height: 100px</code> und eine Breite gleich der Spurgröße — gib ihnen eine
          explizite Höhe, sonst bleiben sie bei diesem Minimum.
        </p>
        <p>
          <strong>Schmale Bildschirme:</strong> kein Breakpoint und kein eingebautes responsives Verhalten. Ein
          horizontaler Slider dehnt oder staucht sich bei jeder Breite mit seinem Container, während der 24px-Handle fest
          bleibt; eine schmale Spur bedeutet also weniger Pixel pro Schritt, und ein feiner <code>step</code> wird per
          Touch schwer zu treffen. Halte
          die Spur auf Smartphones in voller Breite und kombinier sie mit <code>p-inputnumber</code>, wenn Präzision zählt.
        </p>

        <h3>Status nach WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird nicht
          behauptet.
          <strong>Erfüllt:</strong> SC 2.5.8, weil das Kit den Handle auf 24 x 24 anhebt, wo Aura 2.x 20
          x 20 ausliefert; SC 2.1.1 mit dem Tastaturmodell aus dem Quelltext von Optimus 2.0.2 (Pfeiltasten um einen
          Schritt, <code>Home</code>
          und <code>End</code> zu den Grenzen — die Seitentasten fallen auf die Pfeiltasten zusammen, sobald ein
          <code>step</code> gesetzt ist, was eine Lücke gegenüber der APG ist, kein Verstoß gegen 2.1.1); und SC 2.4.7 mit
          dem Kit-Ring <code>2px solid</code>
          <code>--primary-color-fg</code> bei <code>outline-offset: 2px</code>, in beiden Themes.
          <strong>Nicht erfüllt:</strong>
          SC 4.1.2 im Bereichsmodus — beide Handles tragen denselben barrierefreien Namen. Der deaktivierte Fall: Es gibt
          kein natives Input, das ein <code>disabled</code>-Attribut tragen könnte, ein deaktivierter Slider
          verliert also nur seinen <code>tabindex</code> — unerreichbar, und zwar stillschweigend.
          <strong>Bedingt:</strong> SC 4.1.2 im
          Einzelmodus — der Handle-Span stellt <code>role="slider"</code> mit seinen Wertattributen bereit, aber nur die
          beiden Benennungs-Inputs benennen ihn, und es gibt keinen Rückgriff auf den Wert, unbenannt heißt also
          unbenannt. SC 1.4.11 ist für Spur und Handle-Ring erfüllt (per Gate geprüft, ≥ 3,85:1) und für den Fokus-Ring
          (per Gate geprüft, „focus ring“, ≥ 3,88:1).
          <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>SliderModule</code> exportiert die Komponente <code>&lt;p-slider&gt;</code>; eine Direktivenform gibt es
          nicht. Sie ist ein <code>ControlValueAccessor</code> (<code>SLIDER_VALUE_ACCESSOR</code>), also funktionieren
          <code>[(ngModel)]</code> und <code>formControlName</code> beide — mit <code>[range]="true"</code> ist das
          Modell ein Array aus zwei Elementen, sonst eine Zahl.
        </p>

        <h3>Inputs — die ganze Liste</h3>
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
                <td><code>min</code> / <code>max</code></td>
                <td>number (Standard 0 / 100)</td>
                <td>Grenzen. Per <code>numberAttribute</code> transformiert, also funktioniert auch <code>min="0"</code>.</td>
              </tr>
              <tr>
                <td><code>step</code></td>
                <td>number</td>
                <td>
                  Schrittweite. <strong>Lies den Abschnitt unten</strong> — ohne Wert bekommst du keine kontinuierlichen
                  Werte.
                </td>
              </tr>
              <tr>
                <td><code>range</code></td>
                <td>boolean</td>
                <td>Zwei Handles; das Modell wird zu <code>[start, end]</code>.</td>
              </tr>
              <tr>
                <td><code>orientation</code></td>
                <td>'horizontal' | 'vertical'</td>
                <td>Vertikal braucht eine explizite Höhe (min. 100px aus dem Stylesheet).</td>
              </tr>
              <tr>
                <td><code>animate</code></td>
                <td>boolean</td>
                <td>Animiert den Handle, wenn der Nutzer auf die Spur klickt. Beim Ziehen unterdrückt.</td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  <strong>Der einzige funktionierende barrierefreie Name.</strong> Sie landen auf dem nativen Range-Input
                  in jedem Handle. Mit <code>range</code> bekommen beide Handles denselben.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number (Standard 0)</td>
                <td>
                  Wird auf jeden Handle-Span angewendet. Setz ihn nur dann auf <code>-1</code>, wenn etwas anderes den
                  Fokus dorthin bewegt.
                </td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>
                  Über <code>pAutoFocus</code> — nur am einzelnen Handle und am <em>Start</em>-Handle des Bereichs
                  gebunden, nie am End-Handle.
                </td>
              </tr>
              <tr class="row--warn">
                <td>
                  <code>minStepsBetweenHandles</code>, <code>disabledMinHandle</code> / <code>disabledMaxHandle</code>
                </td>
                <td>—</td>
                <td>
                  <strong>Gibt es nicht.</strong> PrimeNG 22 hat sie ergänzt; Optimus forkt den v21-Code und hat weder
                  einen Mindestabstand zwischen den Handles noch ein Deaktivieren pro Handle.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code> / <code>invalid</code> / <code>required</code> / <code>name</code></td>
                <td>Signal-Inputs</td>
                <td>
                  Geerbt von <code>BaseEditableHolder</code>. <code>disabled</code> entfernt nur den
                  <code>tabindex</code> des Handles und fügt <code>p-disabled</code> hinzu — es gibt kein natives Input,
                  das ein echtes <code>disabled</code>-Attribut tragen könnte; <code>invalid</code> fügt eine Klasse hinzu,
                  die Aura nicht stylt.
                </td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td>
                  Existiert wieder und funktioniert noch (wird in die Host-Klasse verkettet, <code>:596</code>), ist aber
                  seit v20 <code>&#64;deprecated</code> — nimm lieber <code>class</code>.
                </td>
              </tr>
              <tr class="row--warn">
                <td><code>inputId</code></td>
                <td>—</td>
                <td>
                  <strong>Gibt es nicht.</strong> Wer es übergibt, schreibt ein wirkungsloses Attribut auf das Host-Element
                  und benennt nichts — der Fehler bleibt stumm, weil Angular sich über ein unbekanntes Attribut an einem
                  Custom Element nicht beschwert.
                </td>
              </tr>
              <tr class="row--warn">
                <td><code>size</code>, <code>fluid</code>, <code>variant</code></td>
                <td>—</td>
                <td>
                  Gibt es ebenfalls nicht — der Slider ist kein <code>BaseInput</code>. Es gibt keine Größenskala; ändere
                  stattdessen <code>--p-slider-track-size</code> und die Handle-Token.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die vollständige Liste der deklarierten Inputs ist
          <code
            >animate, min, max, orientation, step, range, styleClass, ariaLabel, ariaLabelledBy, tabindex,
            autofocus</code
          >
          — gelesen aus der <code>inputs:</code>-Map der kompilierten Komponente
          (<code>openng-optimus-ui-slider.mjs:596</code>, Optimus UI 2.0.2) und gegengeprüft mit
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-slider.d.ts</code>. Alles, was nicht in
          dieser Liste steht, außer <code>required</code> / <code>invalid</code> / <code>disabled</code> /
          <code>name</code> aus <code>openng-optimus-ui-baseeditableholder.d.ts</code>, ist entweder geerbt oder gibt es
          nicht.
        </p>

        <h3>Outputs: <code>onChange</code> ist nicht <code>onSlideEnd</code></h3>
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
                <td><code>onChange</code></td>
                <td>
                  <code>&#123; event, value &#125;</code>, oder <code>&#123; event, values &#125;</code> mit
                  <code>range</code>
                </td>
                <td>
                  <strong>Jede</strong> Wertänderung — jeder Mousemove-Tick während eines Ziehens, jeder Pfeiltastendruck,
                  jeder Klick auf die Spur.
                </td>
              </tr>
              <tr>
                <td><code>onSlideEnd</code></td>
                <td>dieselbe Form</td>
                <td>
                  <code>mouseup</code> am Dokument nach einem Ziehen, <code>touchend</code> und ein Klick auf die Spur.
                  <strong>Nie von der Tastatur</strong> — die Emissionen <code>change</code> und Blur aus PrimeNG 22 sind
                  mit dem nativen Input verschwunden.
                </td>
              </tr>
              <tr>
                <td><code>ngModelChange</code></td>
                <td>number | number[]</td>
                <td>Derselbe Takt wie <code>onChange</code> (beide kommen aus <code>updateValue</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Leg billiges Live-Feedback in <code>onChange</code> und alles Teure — einen Netzwerkaufruf, eine neue
          Simulation, ein URL-Update — in <code>onSlideEnd</code>. Das Tastaturloch aus v21 ist in voller Größe zurück:
          Pfeiltasten, Seitentasten,
          <code>Home</code> und <code>End</code> emittieren nur <code>onChange</code>, und kein Blur und kein
          <code>change</code> rettet sie. Debounce entweder <code>onChange</code>, oder behandle beides —
          <code>onSlideEnd</code> allein verliert jeden per Tastatur gesetzten Wert. Der Tab Beispiele zählt beides live.
        </p>
        <p class="src-note">
          Emissionsstellen gelesen aus <code>openng-optimus-ui-slider.mjs</code> (Optimus UI 2.0.2):
          <code>onChange</code> aus <code>updateValue</code> (:531 Bereich, :544 einzeln), <code>onSlideEnd</code> aus
          dem <code>mouseup</code>-Listener am Dokument (:369-371), <code>onDragEnd</code> (:251-253) und
          <code>onBarClick</code> (:267-269) — und nirgends in <code>onKeyDown</code>
          (:273-305).
        </p>

        <h3><code>step</code> tut mehr, als du denkst</h3>
        <ul>
          <li>
            <strong>Kein <code>step</code> heißt nicht kontinuierlich.</strong> Pfeiltasten bewegen um ±1
            (<code>:312</code>, <code>:320</code>), und <code>getNormalizedValue</code> rundet das Ergebnis ab
            (<code>:557-565</code>). Ein Slider ohne Schrittweite liefert deshalb nur ganze Zahlen. Für eine Genauigkeit
            von 0,5 musst du <code>[step]="0.5"</code> sagen.
          </li>
          <li>
            <strong>Gebrochene Schrittweiten werden auf die Zahl der Nachkommastellen der Schrittweite selbst
            gerundet</strong>, über <code>toFixed</code> in <code>getNormalizedValue</code> (<code>:557-565</code>),
            und genau das verhindert, dass <code>[step]="0.1"</code> <code>0.30000000000000004</code> erzeugt.
          </li>
          <li>
            <strong>Die Seitentasten schlagen die Pfeiltasten nur, wenn kein <code>step</code> gesetzt ist</strong> —
            dann ±10 (<code>:317-318</code>, <code>:336-337</code>). Mit gesetztem <code>step</code>, und im
            Bereichsmodus in jedem Fall (<code>:308-313</code>, <code>:327-332</code>), bewegen sie genau einen Schritt.
            Der Seitensprung von 10 × step aus PrimeNG 22 ist nicht in diesem Fork.
          </li>
          <li>
            <strong>Werte rasten nicht in ein Raster ein, das bei <code>min</code> verankert ist.</strong>
            <code>handleStepChange</code> (<code>:414-426</code>) schreitet relativ zum <em>vorherigen</em> Wert, ein
            Modell, das neben dem Raster startet (etwa 7 mit <code>[step]="5"</code>), behält seinen Versatz also für
            immer — 7, 12, 17. Initialisiere auf dem Raster oder normalisiere den Wert selbst.
          </li>
        </ul>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>
          Jeder Slider-Token ist als <code>--p-slider-*</code> verfügbar. Die Farb- und Größen-Token des Kits sitzen auf
          dem Element <code>.p-slider</code>, eine Überschreibung muss dieses Element also mit einer eigenen Klasse
          benennen (Snippet unten); seine einzige <code>!important</code>-Regel ist der Fokus-Ring, den die Ring-Token
          deshalb nicht mehr erreichen:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom Property</th>
                <th>Steuert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-slider-track-size</code> / <code>-background</code> / <code>-border-radius</code></td>
                <td>Die Leiste selbst (Höhe bei horizontal, Breite bei vertikal).</td>
              </tr>
              <tr>
                <td><code>--p-slider-range-background</code></td>
                <td>Den gefüllten Teil.</td>
              </tr>
              <tr>
                <td><code>--p-slider-handle-width</code> / <code>-height</code></td>
                <td>Das Trefferziel. Heb beide auf 24px an, um SC 2.5.8 zu erfüllen.</td>
              </tr>
              <tr>
                <td><code>--p-slider-handle-background</code> / <code>-hover-background</code></td>
                <td>Die äußere Scheibe.</td>
              </tr>
              <tr>
                <td><code>--p-slider-handle-content-*</code></td>
                <td>Die 16px-Kernscheibe: Größe, Radius, Hintergrund, Hover-Hintergrund, Schatten.</td>
              </tr>
              <tr>
                <td>
                  <code>--p-slider-handle-focus-ring-width</code> / <code>-style</code> / <code>-color</code> /
                  <code>-offset</code> / <code>-shadow</code>
                </td>
                <td>
                  Die Fokus-Outline. Aura liefert 1px solid, Offset 2px; in diesem Kit überschreibt der eine Kit-Ring
                  (<code>!important</code>) Breite, Stil, Farbe und Offset, also landet nur noch <code>-shadow</code>.
                </td>
              </tr>
              <tr>
                <td><code>--p-slider-transition-duration</code></td>
                <td>0.2s auf Hintergrund, Farbe, Rahmen, Schatten und Outline.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> wird in <code>app.config.ts</code> gesetzt (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >); der Token-Baum ist <code>&#64;openng/optimus-ui-themes/dist/aura/slider/index.mjs</code>.
        </p>

        <h3>SSR</h3>
        <p>
          Die Komponente selbst ist serverfest — der einzige Host-Listener in den Metadaten ist <code>click</code>
          (<code>:596</code>), und die Drag-Listener <code>mousemove</code>/<code>mouseup</code> am Dokument werden erst
          bei Bedarf in <code>bindDragListeners</code> gebunden, hinter einem <code>isPlatformBrowser</code>-Guard und
          innerhalb von <code>runOutsideAngular</code> (<code>:348-381</code>) — der guard-freie Umbau auf
          Host-Pointer-Events aus PrimeNG 22 ist nicht in diesem Fork, aber der Guard aus v21 erledigt dieselbe Arbeit.
          Das Risiko ist deine
          <em>Aufrufstelle</em>: Jeder Code, der die Geometrie des Handles liest oder den DOM liest, um zu prüfen, was
          angesagt wurde (wie es der Playground im Tab Beispiele tut), muss abgesichert sein — der liest den Handle aus
          einem <code>viewChild</code> innerhalb eines Guards, der nur im Browser läuft.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Benennung: drei Muster, eins funktioniert</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Muster</th>
                <th>Was tatsächlich passiert</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>id="x"</code> auf <code>&lt;p-slider&gt;</code></td>
                <td>
                  <code>label.control</code> löst zu <code>null</code> auf. Ein Custom Element ist nicht beschriftbar,
                  das Label benennt also nichts — und die Beschriftung sieht auf dem Bildschirm trotzdem richtig aus, was
                  genau diesen Fehler so schwer bemerkbar macht.
                </td>
                <td><strong>Scheitert.</strong></td>
              </tr>
              <tr>
                <td><code>[attr.aria-label]</code> auf <code>&lt;p-slider&gt;</code></td>
                <td>
                  Das Attribut sitzt auf dem Host, der keine Rolle hat, die fokussierbaren Handle-Spans darin sehen es
                  also nie. Der Accessibility Tree meldet für jeden Handle einen leeren Namen.
                </td>
                <td><strong>Scheitert.</strong></td>
              </tr>
              <tr>
                <td><em>Inputs</em> <code>[ariaLabel]</code> / <code>[ariaLabelledBy]</code></td>
                <td>
                  Gebunden als <code>[attr.aria-label]</code> / <code>[attr.aria-labelledby]</code> direkt auf dem
                  Handle-Span, der <code>role="slider"</code> trägt
                  (<code>openng-optimus-ui-slider.mjs:649-650</code>), also meldet der Baum einen <code>slider</code> mit
                  der Beschriftung als Namen und dem Modellwert als Wert.
                </td>
                <td><strong>Funktioniert.</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Bindings im Quelltext von Optimus UI 2.0.2 geprüft; Namen im Accessibility Tree gelesen.
          <strong>Beachte den Unterschied zu <code>p-select</code>:</strong> Wo ein unbenanntes Select darauf
          zurückfällt, seinen aktuellen Wert anzusagen, hat ein unbenannter Slider <em>überhaupt keinen</em>
          barrierefreien Namen — das Template bindet <code>ariaLabel</code> ohne Fallback-Ausdruck, es gibt also nichts,
          das man für ein funktionierendes Label halten könnte. Prüf es in deinem eigenen Build: Fokussier einen Handle
          und lies seinen Knoten im Accessibility Tree des Browsers; der Name muss deine Beschriftung sein.
        </p>

        <h4>Versuch nicht, einen unbenannten Slider global zu retten</h4>
        <p>
          Die Benennungsregel oben hat eine naheliegend aussehende Abkürzung: einen
          <code>MutationObserver</code> installieren, das <code>aria-label</code> des Hosts auf jeden Handle kopieren, dem
          eins fehlt, und den Rest mit einem Fallback-Literal bestempeln. Dieses Kit hat genau das gebaut und dann wieder
          entfernt. Zwei Gründe, und beide lassen sich verallgemeinern:
        </p>
        <ul>
          <li>
            <strong>Der Observer verliert das Rennen.</strong> Er sieht einen Handle-Span, wenn der Knoten hinzugefügt
            wird, aber das Klassen-Binding des Handles wird danach angewendet — auf einer Route, auf der Handles ohne
            eigenen Mutation Record erscheinen, läuft die Regel also nie. Ein Benennungsmechanismus, dessen Ergebnis vom
            Render-Timing abhängt, ist kein Benennungsmechanismus; er lässt dieselbe Aufrufstelle auf einem Bildschirm
            bestehen und auf einem anderen namenlos ausliefern.
          </li>
          <li>
            <strong>Das Fallback-Literal ist nicht übersetzbar.</strong> Ein fest einkodiertes <code>'Slider'</code> ist
            in jeder Sprache ein englisches Wort, und es versteckt den echten Fehler hinter einem Namen, der technisch
            vorhanden ist und dem Nutzer nichts sagt.
          </li>
        </ul>
        <p>
          Es gibt eine zweite Fassung derselben Versuchung: <code>aria-valuenow</code> aus dem Prozentwert des
          Inline-<code>inset-inline-start</code> des Handles neu zu berechnen. An einem einzelnen
          Slider bindet das Kit das Attribut an den Modellwert (<code>openng-optimus-ui-slider.mjs:647</code>), ein aus
          Pixeln abgeleiteter, per <code>Math.round</code> gerundeter Ersatz kann einen richtigen Wert also nur
          verschlechtern. Bei einer gebrochenen Schrittweite tut er das: Ein Slider bei <code>21.7</code> sagt
          <code>22</code> an, und einer, der von 0 bis 1 in Schritten von 0,1 läuft, legt jede Position auf
          <code>0</code> oder <code>1</code> zusammen. Die Bereichs-Handles sind die Ausnahme, und der Grund sind keine
          Pixel: <code>:673</code>/<code>:699</code> binden <code>value[0]</code>/<code>value[1]</code>,
          aber im Bereichsmodus hält die Komponente ihr Modell in <code>values</code>, also rendern beide Handles ganz
          ohne <code>aria-valuenow</code>. Die Reparatur ist das Modell, das du schon hast, geschrieben an der
          Aufrufstelle.
        </p>
        <p class="src-note">
          Wo dieses Kit heute steht: Keine globale Regel berührt Slider, das <code>aria-valuenow</code> eines einzelnen
          Sliders kommt von der Komponente, der eine Bereichs-Slider in der App (der Datumsbereich der Zeitleiste)
          schreibt das <code>aria-valuenow</code> seiner Handles aus seinem eigenen Signal <code>dateRange</code>, und
          jeder Slider wird an seiner Aufrufstelle über <code>[ariaLabel]</code> oder <code>[ariaLabelledBy]</code>
          benannt. Gefunden von <code>npm run check:a11y</code>
          am 22.09.2026.
        </p>

        <h4>Tastatur</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Vertrag (APG)</th>
                <th>Optimus UI 2.0.2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>Den Thumb fokussieren.</td>
                <td>Ja — jeder Handle-Span ist <code>tabindex="0"</code>, ein Bereichs-Slider sind also zwei Tab-Stopps.</td>
              </tr>
              <tr>
                <td><kbd>→</kbd> / <kbd>↑</kbd></td>
                <td>Um einen Schritt erhöhen.</td>
                <td>+step.</td>
              </tr>
              <tr>
                <td><kbd>←</kbd> / <kbd>↓</kbd></td>
                <td>Um einen Schritt verringern.</td>
                <td>-step.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd></td>
                <td>Auf das Minimum setzen.</td>
                <td>Ja — springt direkt auf <code>min</code>.</td>
              </tr>
              <tr>
                <td><kbd>End</kbd></td>
                <td>Auf das Maximum setzen.</td>
                <td>Ja — springt direkt auf <code>max</code>.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>Um einen <em>größeren</em> Betrag ändern.</td>
                <td>
                  <strong>Nur wenn kein <code>step</code> gesetzt ist</strong> — dann ±10. Mit <code>step</code>, und im
                  Bereichsmodus immer, entsprechen sie den Pfeiltasten. Der Sprung von 10 × step aus PrimeNG 22 ist nicht
                  in diesem Fork.
                </td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd></td>
                <td>—</td>
                <td>Nicht behandelt; der Wert ändert sich nicht.</td>
              </tr>
              <tr>
                <td>RTL</td>
                <td><kbd>←</kbd> sollte in einem Rechts-nach-links-Layout erhöhen.</td>
                <td>
                  Nicht umgesetzt: <code>ArrowLeft</code> verringert immer (<code>:306-324</code>), während die
                  Zeigerpositionierung RTL sehr wohl <em>berücksichtigt</em>. Siehe den Tab Internationalisierung (i18n).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus <code>onKeyDown</code> (<code>openng-optimus-ui-slider.mjs:273-305</code>), das nach
          <code>event.code</code> verzweigt — physische Tasten, es übersteht also auch Nicht-QWERTY-Layouts. Die
          Seitentasten laufen über <code>decrementValue</code>/<code>incrementValue</code> mit einem Flag
          <code>pageKey</code>, das nur im Zweig für einzelne Werte ohne Schrittweite gelesen wird (<code>:317-318</code>,
          <code>:336-337</code>). Die Zahlen aus 21 wurden pro Taste im Browser bestätigt, und dieser Handler ist derselbe
          v21-Code, aber miss pro Taste neu, wenn eine Behauptung hier tragend wird.
        </p>

        <h4>Bekannte Lücken — überdeck sie nicht stillschweigend</h4>
        <ul>
          <li>
            <strong>Zwei Handles, ein Name.</strong> <code>ariaLabel</code> und <code>ariaLabelledBy</code> werden auf
            beide Bereichs-Handles gebunden (<code>:675-676</code>, <code>:701-702</code>). Es gibt keinen Input pro
            Handle, die APG-Anforderung für mehrere Thumbs („each thumb has an accessible label“) lässt sich über die
            öffentliche API also nicht erfüllen — nur mit einem <code>pt</code>-Pass-through oder zwei getrennten
            Slidern. Das Bereichsbeispiel im Tab Beispiele liest seine eigenen Handles aus dem DOM zurück und zeigt den
            doppelten Namen in seiner ARIA-Tabelle.
          </li>
          <li>
            <strong>Kein <code>aria-valuetext</code>.</strong> Die Komponente gibt es nie aus und bietet keinen Input
            dafür, ein Wert, der für etwas anderes steht (ein Prozentwert, ein Dämpfungsfaktor, eine Währung), wird also
            als nackte Zahl angesagt. Der Workaround des Kits ist, die Lesart in den Namen einzubacken —
            <code>[ariaLabel]="'Anzahl Punkte: ' + n()"</code> — was funktioniert, um den Preis, dass die Zahl zweimal
            angesagt wird (einmal als Name, einmal als Wert).
          </li>
          <li>
            <strong>Deaktiviert verlässt die Tab-Reihenfolge, stillschweigend.</strong> Es gibt kein natives Input, das
            ein echtes <code>disabled</code>-Attribut tragen könnte; <code>$disabled()</code> setzt nur den
            <code>tabindex</code> des Handles auf null (<code>:644</code>, <code>:670</code>, <code>:696</code>),
            während <code>role="slider"</code> bleibt. Der Handle ist nicht fokussierbar und sagt keinen deaktivierten
            Zustand an, Tastaturnutzer können also nicht auf ihm landen, um herauszufinden, warum. Schreib den Grund in
            Text.
          </li>
          <li>
            <strong>Nichts sagt die eigenen Grenzen des Bereichs als Text an.</strong> <code>aria-valuemin</code>/<code
              >-valuemax</code
            >
            sind Zahlen; wenn „1950“ „der Anfang des Archivs“ bedeutet, sag es in der Beschriftung.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Der aktuelle Wert wird als sichtbarer Text neben dem Control gerendert.</li>
          <li>
            ☐ Benannt mit dem <strong>Input</strong> <code>[ariaLabel]</code> oder <code>[ariaLabelledBy]</code> —
            nicht mit <code>&lt;label for&gt;</code>, nicht mit <code>[attr.aria-label]</code> auf dem Host, nicht mit
            <code>inputId</code> (das es nicht gibt).
          </li>
          <li>☐ <code>(max - min) / step</code> ist eine Zahl von Pfeiltastendrücken, die du selbst akzeptieren würdest.</li>
          <li>
            ☐ <kbd>Tab</kbd> erreicht den Handle, Pfeiltasten bewegen ihn, <kbd>Home</kbd>/<kbd>End</kbd> erreichen die
            Grenzen — im Browser geprüft, nicht angenommen.
          </li>
          <li>☐ Die Fokus-Outline ist im hellen <strong>und</strong> im dunklen Theme sichtbar.</li>
          <li>
            ☐ Alles Teure hängt an <code>onSlideEnd</code> <em>und</em> ist trotzdem per Tastatur erreichbar (die es nie
            auslöst).
          </li>
          <li>☐ Der Slider hat eine explizite Breite (oder einen Block-Container) und wurde bei 360px geprüft.</li>
          <li>
            ☐ Mit <code>[range]</code>: Die beiden Enden sind wirklich ein Intervall, und der gemeinsame barrierefreie Name
            ist ein bewusster Kompromiss.
          </li>
          <li>☐ Die Einheit steht in der Beschriftung, und das Dezimaltrennzeichen der Zahl ist nach Locale formatiert.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die Benennungsregel festnagelt — sie prüft, dass der
          <em>Handle</em> den Namen trägt, nicht der Host, und dass niemand <code>inputId</code> wieder einführt:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Deine Strings</h3>
        <ul>
          <li>
            <strong>Der barrierefreie Name ist Inhalt.</strong> Binde <code>[ariaLabel]</code> an einen übersetzten
            String, oder lass <code>[ariaLabelledBy]</code> auf die Beschriftung zeigen, die du ohnehin übersetzt — das
            Zweite ist besser, weil dann der eine String nicht vom anderen abdriften kann.
          </li>
          <li>
            <strong>Die Einheit gehört in die Beschriftung, nicht in den Kopf des Lesers.</strong> „Schwellenwert: 42“ ist
            mehrdeutig; „Schwellenwert: 42 %“ nicht — und der Screenreader bekommt die Einheit gratis, wenn die
            Beschriftung das Label ist.
          </li>
          <li>
            <strong>Wenn du den Wert in den Namen einbackst, bau ihn reaktiv neu.</strong> Das Muster des Kits ist ein
            <code>computed()</code>, das einen übersetzten Wortstamm mit dem aktuellen Wert verkettet; ein einfaches Feld
            wird einmal erfasst und veraltet bei einem Sprachwechsel.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Zahlen sind nicht sprachneutral</h3>
        <p>
          <code>aria-valuenow</code> ist immer eine einfache Maschinenzahl, und du kannst sie nicht ändern, aber die Zahl,
          die <em>du</em> renderst, gehört dir: Aus 3.5 wird auf Deutsch „3,5“, und Tausendertrennzeichen unterscheiden
          sich überall. Formatier den sichtbaren Wert mit <code>Intl.NumberFormat</code> (oder Angulars
          <code>number</code>-Pipe) in der aktiven Sprache. Backst du den Wert auch in <code>ariaLabel</code> ein,
          formatier ihn dort ebenfalls, sonst hört ein deutscher Nutzer die englische Form.
        </p>

        <h3>Der Slider hat keine eigenen Strings — und das schiebt die ganze Last zu dir</h3>
        <p>
          Anders als das Select oder der Tag liefert der Slider des Kits <strong>kein</strong> eingebautes Vokabular: Nichts
          im Übersetzungsdienst berührt ihn, und es gibt kein eingebautes Label, das man überschreiben oder vergessen
          könnte. Jedes Wort, das ein Screenreader an einem Slider vorliest, ist ein Wort, das du geschrieben hast; das
          klingt nach einer guten Nachricht und ist in Wahrheit das Gegenteil — ein Slider, den niemand benannt hat, wird
          nicht in schlechtem Englisch angesagt, er wird als gar nichts angesagt. Binde
          <code>[ariaLabel]</code> oder lass <code>[ariaLabelledBy]</code> auf eine übersetzte Beschriftung zeigen, und
          behandle einen globalen „Fallback-Namen“ als das Anti-Pattern, das der Tab Entwicklung beschreibt: Er ist schon
          vom Aufbau her nicht übersetzbar.
        </p>

        <h3>Länge: Beschriftungen brechen um, Slidern ist das egal</h3>
        <p>
          Anders als der Trigger des Selects hat ein Slider keinen eigenen Text, der abgeschnitten werden könnte,
          übersetzte Labels kosten dich innerhalb des Controls also nichts. Der Druck wandert in die Beschriftung darüber:
          „Anzahl der Stichproben pro Durchgang“ ist weit länger als „Sample size“, und eine Beschriftung, die auf zwei
          Zeilen umbricht, ändert die Höhe jeder Control-Zeile um sie herum. Reservier den Platz und teste das Layout in
          deiner längsten Sprache bei 360px.
        </p>

        <h3>RTL: halb unterstützt, und die fehlende Hälfte ist die Tastatur</h3>
        <ul>
          <li>
            <strong>Das Layout kehrt sich richtig um.</strong> Die Bereichsfüllung und die Handles werden mit
            <code>inset-inline-start</code> positioniert, und die Zeigerberechnung berücksichtigt RTL ausdrücklich
            (<code>isRTL(this.el.nativeElement)</code>, <code>openng-optimus-ui-slider.mjs:451-463</code>), Ziehen
            funktioniert also in einem Rechts-nach-links-Dokument.
          </li>
          <li>
            <strong>Die Tastatur kehrt sich nicht um.</strong> <code>ArrowLeft</code> ist unabhängig von der Richtung
            direkt mit <code>decrementValue</code> verdrahtet (<code>:276-280</code>), in einem RTL-Layout bewegt die
            linke Pfeiltaste den Handle also nach visuell rechts, während sie den Wert senkt. Die APG erwartet die
            umgekehrte Zuordnung.
          </li>
        </ul>
        <p class="src-note">
          Aus dem ausgelieferten Quelltext gelesen; <strong>nicht gegen eine gerenderte RTL-Locale geprüft</strong>.
          Behandle die Layout-Hälfte als „sollte funktionieren“ und die Tastatur-Hälfte als bekannten Fehler, den du vor dem
          Ausliefern jeder RTL-Sprache erneut prüfst.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Fokus-Ring des
            Handles ist der 2px-Ring <code>--primary-color-fg</code> des Kits (war Auras 1px), zitiert aus „focus ring“;
            der Rat „heb den Ring-Token an“, die Theming-Aussagen und das Snippet folgen den elementgebundenen Token des
            Kits.
          </li>
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Spur und Handle-Ring jetzt <code>--control-border</code>, Kern
            <code>--surface-card</code> (Kit); Kontrast zitiert aus den per Gate geprüften Zeilen in CONTRAST.MD
            (1,13:1 → ≥ 3,85:1).
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Farben und der Spurradius als Token für die visuellen Stile neu
            formuliert (ADR-0016); die dunklen rgb()-Messwerte durch die Token-Tatsache ersetzt, die sie zeigten (Handle
            und Spur teilen sich <code>&#123;content.border.color&#125;</code>); Hinweise „gemessen an 21“ entfernt;
            Aussage zu schmalen Bildschirmen ergänzt.
          </li>
          <li>
            <strong>v0.6</strong> — 02.09.2026 — Neu auf Optimus UI 2.0.2 aufgesetzt (ADR-0014): Der Fork trägt den
            Slider aus PrimeNG 21, die meisten Verbesserungen aus v0.5 sind also wieder weg. Der Handle ist ein schlichtes
            <code>&lt;span role="slider"&gt;</code> — kein natives <code>&lt;input type="range"&gt;</code>, kein echtes
            <code>disabled</code>-Attribut, und <code>onSlideEnd</code> ist von der Tastatur wieder unerreichbar; die
            Seitentasten schlagen die Pfeiltasten nur, wenn kein <code>step</code> gesetzt ist, Werte schreiten vom
            vorherigen Wert aus, statt in ein Raster bei <code>min</code> einzurasten, <code>styleClass</code> existiert
            wieder (deprecated), und <code>minStepsBetweenHandles</code> / <code>disabledMinHandle</code> /
            <code>disabledMaxHandle</code> gibt es nicht. Alle Zeilenverweise neu abgeleitet gegen
            <code>openng-optimus-ui-slider.mjs</code>; Geometrie neu aus Aura 2.x gelesen (20px-Handle, 3px-Spur), die
            24px-Überschreibung des Kits bleibt also nötig. Browser-Messungen aus dem Durchgang mit 21 wurden nicht
            wiederholt.
          </li>
          <li>
            <strong>v0.5</strong> — 24.08.2026 — Erneut geprüft gegen PrimeNG 22.1.2 / Aura 3.0. Der Handle wurde upstream
            um ein verstecktes natives <code>&lt;input type="range"&gt;</code> herum neu gebaut — die ARIA-Oberfläche, der
            Fokus und die <code>disabled</code>-Semantik sind alle dorthin gewandert (die Live-ARIA-Auslesung des Artikels
            und das Test-Snippet wurden umgestellt). Dokumentierte Upstream-Fixes: Seitentasten springen jetzt für jeden
            Handle um 10 × step, Werte rasten in das bei <code>min</code> verankerte Schrittraster ein,
            <code>onSlideEnd</code> feuert beim Blur des Handles (Tastaturnutzer erreichen es, spät).
            <code>styleClass</code> entfernt; neue Inputs <code>minStepsBetweenHandles</code> /
            <code>disabledMinHandle</code> / <code>disabledMaxHandle</code>. Geometrie in Aura 3.0 unverändert (20px-Handle,
            3px-Spur) — die 24px-Überschreibung des Kits bleibt nötig.
          </li>
          <li>
            <strong>v0.4</strong> — 20.08.2026 — Zusammenfassung des Status nach WCAG 2.2 im Tab Design ergänzt:
            gemessene Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene Kriterien
            ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.3</strong> — 30.07.2026 — Wahrheits- und Redaktionsdurchgang: das Kapitel zum Laufzeit-Patch durch
            den aktuellen Mechanismus und eine Warum-nicht-Regel ersetzt, der Geometrie-Abschnitt rund um die
            24px-Handle-Überschreibung des Kits neu geschrieben, Zählungen von Aufrufstellen durch Konventionen ersetzt,
            Belege auf Zitate gekürzt.
          </li>
          <li>
            <strong>v0.2</strong> — 29.07.2026 — Review-Durchgang: Aussagen zu Benennung, Geometrie und Breite erneut
            geprüft; <code>data-pc-section</code> auf Kleinschreibung korrigiert.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erster Guide: die Entscheidungstabelle Ziehen oder Tippen, ein Playground,
            der sein eigenes ARIA aus dem DOM zurückliest, vier gerenderte Do/Don’t-Paare, der Tab Design und das
            kanonische Agent-Dokument.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class SliderArticleDeComponent extends SliderArticleComponent {
  /** Step choices of the playground, with German labels; the values are the English ones. */
  override readonly stepOptions = [
    { label: 'keine (nur ganze Zahlen)', value: null },
    { label: '0,1 — gebrochen', value: 0.1 },
    { label: '1', value: 1 },
    { label: '5', value: 5 },
  ];

  /** Example titles and notes in German; id and code come from the English base. */
  override readonly examples: SliderArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));

  /** Same DOM read as the English article, with the fallback texts of the readout in German. */
  override readAria(): void {
    const stage = this.pgStage()?.nativeElement;
    if (!stage) return;
    const inputs = Array.from(stage.querySelectorAll<HTMLElement>('.p-slider-handle'));
    this.ariaRows.set(
      inputs.map((h, i) => ({
        section: h.getAttribute('data-pc-section') ?? `Handle ${i}`,
        role: h.getAttribute('role') ?? '(keine Rolle)',
        name:
          h.getAttribute('aria-label') ??
          (h.getAttribute('aria-labelledby')
            ? `über aria-labelledby="${h.getAttribute('aria-labelledby')}"`
            : '(kein Name)'),
        now: h.getAttribute('aria-valuenow') ?? '(fehlt)',
        min: h.getAttribute('aria-valuemin') ?? '—',
        max: h.getAttribute('aria-valuemax') ?? '—',
        orientation: h.getAttribute('aria-orientation') ?? '—',
      })),
    );
  }
}
