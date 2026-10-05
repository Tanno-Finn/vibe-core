import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './progress-article.component';

/** German title and note per example id; id and code stay from the English base. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  modes: {
    title: 'Die beiden Modi und die Wertanzeige, die du meist abschaltest',
    note: 'Dreimal dieselbe Komponente. Die dritte hat keinen Wert zu zeigen und sagt das, indem sie aria-valuenow weglässt.',
  },
  content: {
    title: 'unit und das Content-Template, das die Wertanzeige ersetzt',
    note: 'unit wird unverändert an die Zahl gehängt. Das Content-Template bekommt den Wert als $implicit und rendert weiter innerhalb der Füllung.',
  },
  clip: {
    title: 'Zwei Arten, wie die eingebaute Wertanzeige verschwindet',
    note: 'Die Wertanzeige lebt in der Füllung, und die Füllung schneidet ab. Ein schmaler Balken bei niedrigem Wert schneidet sie seitlich ab; ein dünner Track schneidet sie oben und unten ab, bei jedem Wert.',
  },
  spinner: {
    title: 'Spinner: Größe, Strich und die eine Farbe',
    note: 'Der erste ist unverändert — 100px im Quadrat. Keiner durchläuft vier Palettenfarben: Das Kit setzt alle vier Stopps global auf --primary-color-fg, also ist jeder Spinner in beiden Schemata die eine Akzentfarbe.',
  },
  meter: {
    title: 'p-metergroup: ein Stand aus Teilen, keine Aufgabe',
    note: 'role="meter", von dir benannt. aria-valuenow ist die Summe als Prozent von min..max, also behalte min 0 / max 100 und nenn die Aufteilung in aria-valuetext. Jeder Eintrag braucht eine Farbe: Ein Segment ohne Farbe hat keinen Hintergrund.',
  },
};

/**
 * German twin of the Progress guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings held in
 * class fields are German. Keep it in step with the English file: same tabs, same
 * element and binding skeleton (`node scripts/check-guide-translations.mjs progress`).
 */
@Component({
  selector: 'app-progress-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'progress'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Komponenten, eine Frage: <em>Kannst du messen, worauf du wartest?</em> Ein determinierter
          <code>p-progressbar</code> beantwortet „Wie lange noch?“; ein unbestimmter Balken und ein
          <code>p-progressspinner</code> beantworten nur „Läuft noch“. Alles hier unten ist live — der Playground, die
          Füllung, die eine Sekunde nach der Zahl ankommt, und die Wertanzeige, die verschwindet, wenn die Füllung schmal wird.
        </p>

        <!-- Playground -->
        <section class="pg" aria-label="Fortschrittsbalken-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-mode-label">Modus</span>
                <p-select
                  [ariaLabelledBy]="'pg-mode-label'"
                  size="small"
                  [options]="modeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgMode()"
                  (ngModelChange)="pgMode.set($event)"
                />
              </div>

              <div class="pg__field">
                <label class="pg__label" for="pg-value">Wert — {{ pgValue() }}%</label>
                <p-slider
                  [ariaLabel]="'Fortschrittswert in Prozent'"
                  [min]="0"
                  [max]="100"
                  [ngModel]="pgValue()"
                  (ngModelChange)="pgValue.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-showvalue">showValue (Wert anzeigen)</label>
                <p-toggleswitch
                  inputId="pg-showvalue"
                  [ngModel]="pgShowValue()"
                  (ngModelChange)="pgShowValue.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-unit-label">unit (Einheit)</span>
                <p-select
                  [ariaLabelledBy]="'pg-unit-label'"
                  size="small"
                  [options]="unitOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgUnit()"
                  (ngModelChange)="pgUnit.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-color">Input color (umgeht das Token)</label>
                <p-toggleswitch inputId="pg-color" [ngModel]="pgColor()" (ngModelChange)="pgColor.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-thin">Dünner Track (4px, Form des Lesefortschritts im Kit)</label>
                <p-toggleswitch inputId="pg-thin" [ngModel]="pgThin()" (ngModelChange)="pgThin.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <div class="pg__bar" [class.pg__bar--thin]="pgThin()">
                  <p-progressbar
                    [mode]="pgMode()"
                    [value]="pgValue()"
                    [showValue]="pgShowValue()"
                    [unit]="pgUnit()"
                    [color]="pgColor() ? '#0f766e' : undefined"
                    [attr.aria-label]="'Importing sources'"
                    [attr.aria-valuetext]="pgMode() === 'determinate' ? pgValue() + ' Prozent importiert' : null"
                  />
                </div>
                <p class="pg__hint">
                  Zugänglicher Name: <code>Importing sources</code>.
                  {{
                    pgMode() === 'determinate'
                      ? 'aria-valuenow=' + pgValue()
                      : 'Kein aria-valuenow — ein unbestimmter Balken hat keinen Wert zu melden.'
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Erzeugtes Markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        <!-- The value is instant, the fill is not -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Die Zahl kommt zuerst, die Füllung eine Sekunde später</h3>
            <button type="button" class="copy-btn" (click)="jump()">In einem Tick von 0 auf 100 springen</button>
          </div>
          <p class="ex__note">
            Drück den Button. <code>value</code> — und damit <code>aria-valuenow</code> — ist sofort 100; das
            mitgelieferte Stylesheet animiert die Füllung mit einer einsekündigen <code>width</code>-Transition, also
            hinkt das, was ein sehender Nutzer sieht, dem hinterher, was ein Screenreader-Nutzer schon gehört hat.
          </p>
          <div class="ex__stage ex__stage--block">
            <div class="jump__bar" #jumpBar>
              <p-progressbar [value]="jumpValue()" [showValue]="false" [attr.aria-label]="'Import-Fortschritt'" />
            </div>
            <div class="jump__read">
              <span><strong>value / aria-valuenow:</strong> {{ jumpValue() }}</span>
              <span><strong>gerenderte Füllung:</strong> {{ jumpFillPct() }}%</span>
            </div>
          </div>
          <p class="src-note">
            Die Lücke ist der Punkt, kein Render-Artefakt: Miss die Breite der Füllung, während der Wert schon
            feststeht, und nimm die Transition als Grund, warum ein Balken nie der einzige Kanal für einen Wert sein darf, auf den es ankommt.
          </p>
        </section>

        <!-- Determinate, indeterminate, spinner -->
        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage ex__stage--block">
              @switch (ex.id) {
                @case ('modes') {
                  <div class="rows">
                    <div class="row">
                      <span class="row__tag">determiniert, 62%</span>
                      <div class="row__bar">
                        <p-progressbar [value]="62" [attr.aria-label]="'Upload, determiniertes Beispiel'" />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">determiniert, showValue aus</span>
                      <div class="row__bar">
                        <p-progressbar
                          [value]="62"
                          [showValue]="false"
                          [attr.aria-label]="'Upload, ohne Anzeige im Balken'"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">unbestimmt</span>
                      <div class="row__bar">
                        <p-progressbar mode="indeterminate" [attr.aria-label]="'Suche, unbestimmtes Beispiel'" />
                      </div>
                    </div>
                  </div>
                }
                @case ('content') {
                  <div class="rows">
                    <div class="row">
                      <span class="row__tag">unit=" of 40"</span>
                      <div class="row__bar">
                        <p-progressbar
                          [value]="12"
                          unit=" of 40"
                          [attr.aria-label]="'Geprüfte Quellen'"
                          [attr.aria-valuetext]="'12 von 40 Quellen geprüft'"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">Content-Template</span>
                      <div class="row__bar">
                        <p-progressbar
                          [value]="72"
                          [attr.aria-label]="'Seiten werden gerendert'"
                          [attr.aria-valuetext]="'Schritt 5 von 7'"
                        >
                          <ng-template #content let-value>
                            <span class="bar__custom">Schritt 5 von 7 &middot; {{ value }}%</span>
                          </ng-template>
                        </p-progressbar>
                      </div>
                    </div>
                  </div>
                }
                @case ('clip') {
                  <div class="rows">
                    <div class="row">
                      <span class="row__tag">schmaler Balken, value=3, showValue an</span>
                      <div class="row__bar row__bar--narrow">
                        <p-progressbar [value]="3" [attr.aria-label]="'Beispiel: abgeschnittene Anzeige'" />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">4px-Track, value=62, showValue an</span>
                      <div class="row__bar row__bar--thin">
                        <p-progressbar [value]="62" [attr.aria-label]="'Beispiel: Anzeige im dünnen Track'" />
                      </div>
                    </div>
                    <div class="row">
                      <span class="row__tag">dieselben zwei Werte, Anzeige außerhalb</span>
                      <div class="row__bar row__bar--narrow row__bar--split">
                        <p-progressbar [value]="3" [showValue]="false" [attr.aria-label]="'Anzeige außerhalb des Balkens'" />
                        <span class="row__pct">3%</span>
                      </div>
                    </div>
                  </div>
                }
                @case ('spinner') {
                  <div class="spin-grid">
                    <div class="spin-cell">
                      <span class="row__tag">Standardwerte (100px)</span>
                      <p-progressspinner [ariaLabel]="'Lädt, Standard-Spinner'" />
                    </div>
                    <div class="spin-cell">
                      <span class="row__tag">3rem, strokeWidth 4</span>
                      <p-progressspinner
                        strokeWidth="4"
                        [ariaLabel]="'Lädt, kleiner Spinner'"
                        [style]="{ width: '3rem', height: '3rem' }"
                      />
                    </div>
                    <div class="spin-cell">
                      <span class="row__tag">animationDuration 6s</span>
                      <p-progressspinner
                        strokeWidth="4"
                        animationDuration="6s"
                        [ariaLabel]="'Lädt, langsamer Spinner'"
                        [style]="{ width: '3rem', height: '3rem' }"
                      />
                    </div>
                  </div>
                }
                @case ('meter') {
                  <div class="rows">
                    <p-metergroup
                      [value]="meterItems"
                      [attr.aria-label]="'Genutztes Kontextfenster'"
                      [attr.aria-valuetext]="meterValuetext"
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
        <h3>Welcher Indikator, und was er kostet</h3>
        <p>
          Eine Frage entscheidet zwischen den beiden Modi von <code>p-progressbar</code>:
          <strong>Gibt es eine Menge, die du wirklich zählen kannst</strong> — Bytes, Zeilen, Schritte, Dateien? Wenn ja, ist
          ein determinierter Balken der einzige Indikator, der „Wie lange noch?“ beantwortet. Wenn nein, ist alles andere auf
          dieser Seite eine Art zu sagen „Läuft noch“, und du wählst das, was in den Platz passt. Ob die Wartezeit stattdessen
          ein vorgezeichnetes Layout verdient, ist die Frage des Skeleton-Guides, nicht dieses hier.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Indikator</th>
                <th>Greif dazu, wenn</th>
                <th>Im Accessibility Tree</th>
                <th>Bei reduzierter Bewegung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nichts</strong></td>
                <td>Die Wartezeit ist so kurz, dass ein Indikator nur aufblitzen und verschwinden würde.</td>
                <td>Nichts. Kündige das <em>Ergebnis</em> an.</td>
                <td>Unverändert — die ehrliche Grundlinie.</td>
              </tr>
              <tr>
                <td><code>p-progressbar</code> determiniert</td>
                <td>Eine zählbare Menge: Bytes, Zeilen, Schritte, Einträge.</td>
                <td><code>progressbar</code> mit einem Wert ({{ axDeterminate }}).</td>
                <td>
                  Weiter lesbar: Die Füllung ist eine Breite, keine Animation. Nur die einsekündige Transition wird gekappt.
                </td>
              </tr>
              <tr>
                <td><code>p-progressbar mode="indeterminate"</code></td>
                <td>Nichts zu zählen, und der Platz ist ein Streifen: eine Toolbar-Kante, ein Karten-Header.</td>
                <td><code>progressbar</code> mit einem Namen und <strong>ohne Wert</strong> ({{ axIndeterminate }}).</td>
                <td><strong>Unsichtbar.</strong> {{ reducedIndeterminateFinding }}</td>
              </tr>
              <tr>
                <td><code>p-progressspinner</code></td>
                <td>Nichts zu zählen, und der Platz ist ein Block: ein Panel, ein Overlay, die Nachbarschaft eines Buttons.</td>
                <td><code>progressbar</code> mit einem Namen und ohne Wert — derselbe Knotentyp wie der unbestimmte Balken.</td>
                <td>Überlebt als statischer Bogen: Das Strichmuster bleibt mitten im Kreis stehen, statt zu verschwinden.</td>
              </tr>
              <tr>
                <td><code>p-skeleton</code></td>
                <td>Du kannst das kommende Layout vorzeichnen und willst die Box offen halten.</td>
                <td>Nichts — es ist <code>aria-hidden</code>; der Container kündigt an.</td>
                <td>Schimmer gekappt; die Boxen bleiben.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Spalte zum Tree ist eine Accessibility-Tree-Lesung jedes gerenderten Indikators; die Spalte zur reduzierten
          Bewegung ist eine Lesung des berechneten Stils unter dem emulierten Media Feature, beide mit ihren Zahlen im Tab Design zitiert.
          <strong>Nicht gemessen</strong> ist die Spalte „Greif dazu, wenn“: Sie ist ein Urteil darüber, welcher
          Kanal die Information trägt, und der einzige harte Teil daran ist Ehrlichkeit darüber, ob du überhaupt etwas zählen kannst.
        </p>

        <h3>Fälsch nie die Zahl</h3>
        <p>
          Ein determinierter Balken ist ein Versprechen mit Einheit. Kommt der Wert von einem Timer statt von erledigter
          Arbeit, hast du einen Fortschrittsbalken gebaut, der lügt — und er lügt auf die ärgerlichste Art, die es gibt: Er
          erreicht 90% und bleibt stehen. Die Regel ist mechanisch:
          <strong>Kannst du Zähler und Nenner nicht benennen, ist der Modus unbestimmt</strong>. „Erledigte Anfragen /
          eingereihte Anfragen“ ist ein Balken. „Ungefähr so lange, wie das meistens dauert“ ist keiner.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Wert, den ein Timer erfindet</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar [value]="fakeValue()" [attr.aria-label]="'Simulierter Fortschritt'" />
              </div>
              <button type="button" class="copy-btn" (click)="startFake()" [disabled]="faking()">
                {{ faking() ? 'Fälscht ...' : 'Fälschung starten' }}
              </button>
            </div>
            <p class="dd__why">
              Dieser Balken ist ein <code>setInterval</code> ohne Verbindung zu irgendeiner Arbeit. Er bleibt bei {{ fakeCeiling }}%
              stehen, weil erfundener Fortschritt immer das tut: Dem Timer gehen die Schätzungen aus, bevor dem Job die
              Arbeit ausgeht. Jede Zahl, die er einem Screenreader gemeldet hat, war falsch.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — sag „läuft“, wenn das alles ist, was du weißt</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar mode="indeterminate" [attr.aria-label]="'Läuft'" />
              </div>
              <span class="dd__aside">Derselbe Streifen, keine falsche Behauptung.</span>
            </div>
            <p class="dd__why">
              Der unbestimmte Modus lässt <code>value</code> weg und damit <code>aria-valuenow</code>: Der Knoten sagt
              weiter „in Arbeit“ und behauptet keine Position. Wechsle zu determiniert, sobald du eine echte Zählung
              hast — beide Modi im Lauf einer Wartezeit zu mischen ist in Ordnung und oft richtig.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Indikator ohne Namen</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar [value]="46" [showValue]="false" />
              </div>
              <span class="dd__aside">Kein <code>aria-label</code>, kein Wrapper.</span>
            </div>
            <p class="dd__why">
              <code>role="progressbar"</code> ist ein statisches Host-Attribut, also existiert der Knoten immer — ein
              namenloser wird als bloßer Fortschrittsindikator mit Prozentzahl und ohne Gegenstand angesagt. {{ axUnnamedFinding }} Es gibt
              <strong>kein Input <code>ariaLabel</code> am Balken</strong>, und genau deshalb ist das der häufige
              Fehler.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — gib ihm einen Namen, und schreib den Wert aus, wenn er kein Prozentwert ist</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar
                  [value]="46"
                  [showValue]="false"
                  [attr.aria-label]="'Quellen werden importiert'"
                  [attr.aria-valuetext]="'18 von 40 Quellen importiert'"
                />
              </div>
              <span class="dd__aside">Benannt, und der Wert liest sich als Zählung.</span>
            </div>
            <p class="dd__why">
              <code>[attr.aria-label]</code> ist die Schreibweise, zu der du greifst: Ein Attribut-Binding rendert in jedem
              Renderer, auch in einem serverseitigen, während die Schreibweise als DOM-Property auf ARIA-Reflection angewiesen ist.
              <code>[attr.aria-valuetext]</code> ersetzt „46 Prozent“ durch den Satz, mit dem ein Nutzer etwas anfangen kann — die Bibliothek
              setzt kein eigenes <code>aria-valuetext</code>, also ist es deins.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — showValue als Anzeige vertrauen</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar [value]="4" [attr.aria-label]="'Abgeschnittene Anzeige'" />
              </div>
              <span class="dd__aside">value=4, <code>showValue</code> an — und nichts Lesbares.</span>
            </div>
            <p class="dd__why">
              Die Anzeige wird <em>innerhalb</em> der Füllung gerendert, und die Füllung hat <code>overflow: hidden</code>.
              {{ clipFinding }} Ein Balken, der absichtlich dünn ist — etwa ein Lesefortschritts-Streifen —, versteckt sie bei
              jedem Wert.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — setz die Zahl neben den Balken</span>
            <div class="dd__stage">
              <div class="row__bar row__bar--split">
                <p-progressbar [value]="4" [showValue]="false" [attr.aria-label]="'Anzeige neben dem Balken'" />
                <span class="row__pct">4%</span>
              </div>
              <span class="dd__aside"><code>[showValue]="false"</code> plus dein eigenes Label.</span>
            </div>
            <p class="dd__why">
              Dein eigenes Label überlebt jeden Wert, nimmt die Schriftskala und die Übersetzung, die du gemeint hast, und kann „4
              von 100 Dateien“ sagen statt „4%“. Das ist auch die Form des Kits für einen Fortschrittsstreifen: ein dünner Track mit der
              Beschriftung außerhalb.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein unbestimmter Balken als einziges Feedback</span>
            <div class="dd__stage">
              <div class="row__bar">
                <p-progressbar mode="indeterminate" [attr.aria-label]="'Läuft, nur Bewegung'" />
              </div>
              <span class="dd__aside">Hier ist nichts außer Bewegung.</span>
            </div>
            <p class="dd__why">
              Der ganze Indikator <em>ist</em> die Animation: zwei Pseudo-Elemente, die über einen sonst leeren Track
              wischen. Kapp die Animation — was jede Einstellung für reduzierte Bewegung tut —, und der Streifen liest sich als leere Box.
              {{ reducedIndeterminateFinding }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — kombinier ihn mit einem Wort, oder nimm einen Spinner</span>
            <div class="dd__stage">
              <div class="dd__pair">
                <p-progressspinner
                  strokeWidth="4"
                  [ariaLabel]="'Läuft'"
                  [style]="{ width: '2rem', height: '2rem' }"
                />
                <span class="dd__aside">Statischer Bogen, wenn Bewegung aus ist — weiter sichtbar.</span>
              </div>
              <div class="row__bar">
                <p-progressbar mode="indeterminate" [attr.aria-label]="'Quellen werden geprüft'" />
              </div>
              <span class="dd__aside">Sichtbare Beschriftung: „Quellen werden geprüft ...“</span>
            </div>
            <p class="dd__why">
              Der Spinner fällt auf einen sichtbaren Bogen zurück, weil sein Strichmuster eine Farbe auf der Fläche ist, nicht nur eine Bewegung. Ein
              unbestimmter Balken ist in Ordnung, wenn etwas anderes — eine Beschriftung, ein deaktivierter Button, ein Spinner — weiter
              ohne Bewegung kommuniziert.
            </p>
          </div>
        </div>

        <h3>Zwei Gewohnheiten, die nichts kosten</h3>
        <ul>
          <li>
            <strong>Ein Indikator pro Wartezeit.</strong> Ein Spinner in jeder Zeile einer ladenden Tabelle sind elf Fortschrittsknoten
            im Accessibility Tree, die dasselbe sagen. Setz einen Indikator auf die Region.
          </li>
          <li>
            <strong>Beende das Warten hörbar.</strong> Ein Progressbar-Knoten, der 100 erreicht, ist keine Ansage; die höfliche
            Live-Region, die „40 von 40 importiert“ sagt, ist eine. Die Konvention des Kits für diese Region —
            <code>role="status"</code> plus ein <code>.sr-only</code>-Satz — ist dieselbe, die der Skeleton-Guide
            dokumentiert, und die beiden Indikatoren teilen sie.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/meter/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Meter pattern</a
            >
            — die Unterscheidung, auf die sich dieser Guide ganz oben stützt: Ein Meter ist ein aktueller Stand (Platte voll, Akku), eine
            Progressbar ist eine Aufgabe auf dem Weg zum Abschluss. Wer die falsche wählt, baut ein Control, das nie endet oder
            nie anfängt.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#progressbar" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>progressbar</code> role</a
            >
            — normativ: die erforderlichen und unterstützten Eigenschaften der Rolle und die Regel, dass eine unbestimmte Progressbar
            <code>aria-valuenow</code> weglässt, statt Null zu senden. Sie listet auch, zu welchen Rollen
            <code>aria-level</code> gehört — die ganze Geschichte hinter der Strip-Direktive des Kits.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-valuetext</code></a
            >
            — die Eigenschaft, die aus „46“ „18 von 40 Quellen“ macht; normativer Rat, sie nur zu nutzen, wenn die rohe Zahl
            für sich allein nichts aussagt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — die 3:1-Untergrenze, die die Füllung gegen ihren Track schaffen muss, und der Grund, warum der mitgelieferte Farbzyklus des
            Spinners hier gemessen statt geglaubt wird.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.2.2 Pause, Stop, Hide</a
            >
            — fünf Sekunden automatische Bewegung sind die Obergrenze. Ein unbestimmter Indikator, der seine Anfrage überlebt,
            verletzt sie, und beide Komponenten hier animieren von Haus aus endlos.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — <code>prefers-reduced-motion</code></a
            >
            — das Media Feature, das keine der beiden Komponenten abfragt. Das Kit beantwortet es global, und der Tab Design misst,
            wie jeder Indikator aussieht, sobald es beachtet wird.
          </li>
          <li>
            <a href="https://optimus.openng.org/progressbar" target="_blank" rel="noopener noreferrer">
              Optimus UI — ProgressBar</a
            >
            — die API-Oberfläche des Herstellers (sieben Inputs, keine Outputs in 2.0.2), hier gegen den ausgelieferten Quellcode geprüft
            statt zitiert.
          </li>
          <li>
            <a href="https://optimus.openng.org/progressspinner" target="_blank" rel="noopener noreferrer">
              Optimus UI — ProgressSpinner</a
            >
            — fünf Inputs in 2.0.2, darunter ein echtes <code>ariaLabel</code>: Dieses Input ist der größte einzelne
            API-Unterschied zwischen den beiden Komponenten in diesem Guide.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <ul>
          <li>
            <strong>Balken-Host</strong> — <code>&lt;p-progressbar class="p-progressbar p-component"&gt;</code>:
            <code>display: block</code>, <code>position: relative</code>, <code>overflow: hidden</code>, Höhe und
            Hintergrund aus Tokens, dazu ein Attribut <code>data-p</code>, das den Modus trägt.
          </li>
          <li>
            <strong>Füllung</strong> — <code>.p-progressbar-value</code>, absolut positioniert, <code>height: 100%</code>,
            <code>width</code> inline als <code>value%</code> geschrieben, und <code>transition: width 1s ease-in-out</code>.
          </li>
          <li>
            <strong>Wertanzeige</strong> — <code>.p-progressbar-label</code>, ein Flex-Kind <em>der Füllung</em>. Diese
            Verschachtelung ist der Grund, warum die Zahl bei niedrigen Werten verschwindet.
          </li>
          <li>
            <strong>Unbestimmt</strong> — dasselbe Füll-Element ohne Breite, mit zwei Pseudo-Elementen
            (<code>::before</code>, <code>::after</code>), die in Schleifen von 2,1 s darüberwischen, das zweite um 1,15
            s verzögert.
          </li>
          <li>
            <strong>Spinner</strong> — ein Host mit einem <code>::before</code>-Padding-Trick für das quadratische Seitenverhältnis, ein
            <code>&lt;svg&gt;</code>
            (<code>.p-progressspinner-spin</code>), das rotiert, und ein
            <code>&lt;circle r="20"&gt;</code> (<code>.p-progressspinner-circle</code>), dessen Strichmuster und Strichfarbe
            selbst animiert sind.
          </li>
        </ul>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-progressbar.mjs</code> (die Klassen-Map oben in der Datei,
          Template und Host-Block im ɵcmp bei <code>:136</code>) und
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-progressspinner.mjs</code> (<code>:90</code>), dazu ihren Stylesheets
          <code>&#64;openng/optimus-ui-styles/dist/progressbar/index.mjs</code> und
          <code>&#64;openng/optimus-ui-styles/dist/progressspinner/index.mjs</code> (2.0.2). Optimus UI 2.0.2.
        </p>

        <h3>Token-Kette — der Balken, beide Themes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura-Quelle</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-progressbar-height</code></td>
                <td><code>1.25rem</code>, Literal (Aura 2.x — Aura 3.0 hatte ihn auf 1.125rem verkleinert)</td>
                <td colspan="2">
                  <code>{{ tokenHeight }}</code> = <code>{{ measuredHeight }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-background</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td>
                  <code>{{ trackLight }}</code>
                </td>
                <td>
                  <code>{{ trackDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-value-background</code></td>
                <td><code>&#123;primary.color&#125;</code></td>
                <td>
                  <code>{{ fillLight }}</code>
                </td>
                <td>
                  <code>{{ fillDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-label-color</code></td>
                <td><code>&#123;primary.contrast.color&#125;</code></td>
                <td>
                  <code>{{ labelLight }}</code>
                </td>
                <td>
                  <code>{{ labelDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-border-radius</code></td>
                <td><code>&#123;content.border.radius&#125;</code></td>
                <td colspan="2">
                  <code>{{ tokenRadius }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-progressbar-label-font-size</code> / <code>-label-font-weight</code></td>
                <td>Literale</td>
                <td colspan="2">
                  <code>{{ labelFont }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura-Quellen aus <code>&#64;openng/optimus-ui-themes/dist/aura/progressbar/index.mjs</code>
          (das ganze Preset sind sieben Werte). Der Track ist Auras Standard <code>&#123;surface.200&#125;</code> (slate) /
          <code>&#123;surface.700&#125;</code> (zinc), den kein visueller Stil überschreibt. Füllung und Wertanzeige folgen
          dem <strong>Akzent</strong>, nicht dem visuellen Stil: <code>ThemeService</code> schreibt den Akzent in
          <code>semantic.primary</code>, also ist <code>&#123;primary.color&#125;</code> im hellen Schema Stufe 500 des Akzents
          und im dunklen eine Stufe der Farbreihe, die aus dem kontrastangepassten dunklen Vordergrund des Akzents gebaut ist
          (<code>primaryFgDark</code>) — die gezeigten Werte sind der Standard-Akzent <code>sunset</code>. Der Radius
          folgt dem <code>border.radius.md</code> des visuellen Stils.
        </p>

        <h3>Kontrast — was welche Hürde nehmen muss</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Anforderung</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Füllung gegen Track (die Information)</td>
                <td>SC 1.4.11, 3:1</td>
                <td>
                  <strong>{{ contrastFillTrackLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ contrastFillTrackDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td>Text von <code>showValue</code> auf der Füllung</td>
                <td>SC 1.4.3, 4,5:1 (12px fett)</td>
                <td>
                  <strong>{{ contrastLabelLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ contrastLabelDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td>Track gegen die Fläche drumherum</td>
                <td>keine — dekorativ</td>
                <td>{{ contrastTrackSurfaceLight }}:1</td>
                <td>{{ contrastTrackSurfaceDark }}:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ contrastNote }}
        </p>

        <h3>Aura liefert einen vierfarbigen Spinner-Zyklus — das Kit ersetzt ihn durch eine Farbe</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stopp</th>
                <th>Aura</th>
                <th>Wert hell</th>
                <th>gegen helles <code>--surface-section</code>, vier Stile</th>
                <th>Wert dunkel</th>
                <th>gegen dunkles <code>--surface-section</code>, vier Stile</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-progressspinner-color-one</code></td>
                <td><code>&#123;red.500&#125;</code> / <code>&#123;red.400&#125;</code></td>
                <td>
                  <code>{{ spinOneLight }}</code>
                </td>
                <td>{{ spinOneLightCr }}:1</td>
                <td>
                  <code>{{ spinOneDark }}</code>
                </td>
                <td>{{ spinOneDarkCr }}:1</td>
              </tr>
              <tr>
                <td><code>--p-progressspinner-color-two</code></td>
                <td><code>&#123;blue.500&#125;</code> / <code>&#123;blue.400&#125;</code></td>
                <td>
                  <code>{{ spinTwoLight }}</code>
                </td>
                <td>{{ spinTwoLightCr }}:1</td>
                <td>
                  <code>{{ spinTwoDark }}</code>
                </td>
                <td>{{ spinTwoDarkCr }}:1</td>
              </tr>
              <tr>
                <td><code>--p-progressspinner-color-three</code></td>
                <td><code>&#123;green.500&#125;</code> / <code>&#123;green.400&#125;</code></td>
                <td>
                  <code>{{ spinThreeLight }}</code>
                </td>
                <td>
                  <strong>{{ spinThreeLightCr }}:1</strong>
                </td>
                <td>
                  <code>{{ spinThreeDark }}</code>
                </td>
                <td>{{ spinThreeDarkCr }}:1</td>
              </tr>
              <tr>
                <td><code>--p-progressspinner-color-four</code></td>
                <td><code>&#123;yellow.500&#125;</code> / <code>&#123;yellow.400&#125;</code></td>
                <td>
                  <code>{{ spinFourLight }}</code>
                </td>
                <td>
                  <strong>{{ spinFourLightCr }}:1</strong>
                </td>
                <td>
                  <code>{{ spinFourDark }}</code>
                </td>
                <td>{{ spinFourDarkCr }}:1</td>
              </tr>
              <tr>
                <td>alle vier Stopps auf <code>--primary-color-fg</code></td>
                <td>das Kit (<code>styles.scss</code>), per Gate geprüft</td>
                <td>
                  <code>{{ brandLight }}</code>
                </td>
                <td>{{ contrastBrandLight }}:1</td>
                <td>
                  <code>{{ brandDark }}</code>
                </td>
                <td>{{ contrastBrandDark }}:1</td>
              </tr>
              <tr>
                <td>alle vier Stopps auf <code>--primary-color</code></td>
                <td>die Falle, wenn du überschreibst</td>
                <td>
                  <code>{{ brandWrongLight }}</code>
                </td>
                <td>{{ contrastBrandWrongLight }}:1</td>
                <td>
                  <code>{{ brandWrongDark }}</code>
                </td>
                <td>
                  <strong>{{ contrastBrandWrongDark }}:1</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura-Quellen aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/progressspinner/index.mjs</code> (vier Paletten-Referenzen pro
          Farbschema, sonst nichts); die Stoppwerte sind Aura-Primitive und bewegen sich weder mit dem visuellen Stil noch mit dem
          Akzent. {{ surfaceBasis }} Sich selbst überlassen, würden der grüne und der gelbe Stopp
          <strong>das Nicht-Text-Minimum von 3:1 auf jeder hellen Fläche verfehlen</strong>, und es sind keine optionalen Stopps: Ein
          sechssekündiger <code>@keyframes</code>-Block führt den Strich durch alle vier. {{ spinCycleFinding }}
        </p>
        <p class="src-note">
          Daher die Kit-Regel — <strong>alle vier Stopps auf <code>--primary-color-fg</code></strong> an jedem
          <code>.p-progressspinner</code> — und, in der letzten Zeile, die Falle für alle, die sie überschreiben: Dieses Kit führt
          zwei Custom Properties für die Marke, und nur die Vordergrund-Property ist in beiden Schemata auf Kontrast abgestimmt.
          <code>--primary-color</code> ist die Hintergrundrolle des Kits und löst im Dark Mode zu einem dunkleren Ton auf, also
          erzeugt ein Spinner, der darauf gesetzt wird, einen Strich, der fast verschwindet ({{ contrastBrandWrongDark }}:1) — schlimmer
          als der Standard-Zyklus. <strong>Lass die Kit-Regel in Ruhe, oder miss deine Überschreibung in beiden Schemata.</strong>
          Das kit-eigene <code>app-loading-overlay</code> legt keine eigene Farbe mehr fest; es folgt derselben globalen
          Regel. Jeder Spinner im Tab Beispiele zeigt das.
        </p>

        <h3>Bewegung, genau wie ausgeliefert</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Animation</th>
                <th>Ausgeliefert</th>
                <th>Unter <code>reduce</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>determinierte Füllung (<code>transition: width</code>)</td>
                <td>
                  <code>{{ transitionNormal }}</code>
                </td>
                <td>
                  <code>{{ transitionReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>unbestimmte Wischer (<code>::before</code> / <code>::after</code>)</td>
                <td>
                  <code>{{ indetNormal }}</code>
                </td>
                <td>
                  <code>{{ indetReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>Spinner-Rotation (<code>.p-progressspinner-spin</code>)</td>
                <td>
                  <code>{{ spinNormal }}</code>
                </td>
                <td>
                  <code>{{ spinReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>Spinner-Strichmuster + Farbzyklus (<code>.p-progressspinner-circle</code>)</td>
                <td>
                  <code>{{ circleNormal }}</code>
                </td>
                <td>
                  <code>{{ circleReduced }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ motionNote }}
        </p>

        <h3>Die Folge: Einer dieser Indikatoren verschwindet</h3>
        <p>
          Kapp die Animationen, und die beiden unbestimmten Indikatoren gehen getrennte Wege.
          <strong>Der Spinner überlebt</strong>: Sein Bogen ist ein Strichmuster, das eben animiert ist, also malt eine
          angehaltene Animation weiter ungefähr drei Viertel eines Kreises. Der <strong>unbestimmte Balken nicht</strong>:
          {{ reducedIndeterminateFinding }} Und weil der Track mit ungefähr {{ contrastTrackSurfaceLight }}:1
          gegen die Fläche steht, ist das, was bleibt, nicht einmal eindeutig ein Balken.
        </p>
        <p class="src-note">
          Prüf das Paar in deinem eigenen Build: Emulier <code>prefers-reduced-motion: reduce</code>
          und lies die berechnete Breite der wischenden Pseudo-Elemente. Das CSS zu lesen sagt dir nicht, welche Regel gewonnen hat,
          und ein Screenshot sagt dir nicht, warum.
        </p>

        <h3>Größe: das Höhen-Token und die Form, die das Kit tatsächlich nutzt</h3>
        <p>
          Der Standard-Balken ist <code>{{ measuredHeight }}</code> hoch — ein kräftiger Streifen, bemessen für die Wertanzeige darin. Ein
          Fortschrittsindikator, der nicht als Zahl gelesen werden soll, will meist viel dünner sein, also eine
          Überschreibung der Höhe pro Region plus <code>[showValue]="false"</code>: Der Lesefortschritts-Streifen des Kits ist ein
          4px-Track mit der Beschriftung daneben, und das Muster steckt in <code>text-container.component.ts</code>. Zwei
          Dinge reisen mit dieser Entscheidung: Ein dünner Track versteckt die eingebaute Wertanzeige bei jedem Wert, und eine kürzere
          <code>width</code>-Transition als die ausgelieferte eine Sekunde verhindert, dass ein schnell wechselnder Wert sichtbar hinterherhinkt.
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> kommt aus den Theme-Optionen von <code>provideOptimus</code> im Kit, in
          <code>app.config.ts</code>. Höhe, Farben und Radius sind gewöhnliche Custom Properties, also verschiebt ein bereichsbezogener Block
          sie; die <code>width</code> der Füllung ist ein Inline-Style, den die Komponente schreibt, und lässt sich so nicht
          überschreiben. Beim Umfärben wird es teuer: {{ recolourCaution }}
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Kein eigenes responsives Verhalten. Der Balken ist <code>display: block</code> und nimmt bei jedem Viewport die Breite
          seines Containers an, also wird er mit dem Layout schmaler; zuerst scheitert die eingebaute Wertanzeige, die die Füllung
          bei niedrigen Werten abschneidet — setz die Zahl neben den Balken. Der Spinner bleibt ein festes Quadrat von 100px, bis du ihn bemisst, und
          <code>p-metergroup</code> hält seine Meter in voller Breite, während seine Label-Liste umbricht
          (<code>flex-wrap: wrap</code>). Keine der drei braucht einen eigenen Breakpoint.
        </p>
        <p class="src-note">
          Layout-Regeln aus <code>&#64;openng/optimus-ui-styles/dist/progressbar/index.mjs</code>,
          <code>…/progressspinner/index.mjs</code> und <code>…/metergroup/index.mjs</code> (2.0.2).
        </p>

        <h3>Stand WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen ist, wird nicht beansprucht.
          <strong>Erfüllt</strong> (Standard-Akzent <code>sunset</code>; jeder Akzent ist in CONTRAST.MD per Gate geprüft): SC 1.4.11
          für die Füllung gegen ihren Track, 4,20:1 hell / 4,61:1 dunkel (3,78:1 beim niedrigsten Akzent), SC 1.4.3 für die
          Wertanzeige von <code>showValue</code> auf der Füllung, 5,18:1 / 7,83:1, SC 1.4.11 für den Strich des Spinners, den das Kit
          auf <code>--primary-color-fg</code> setzt (3,88:1 und mehr auf jeder Fläche), und SC 4.1.2 für die Rolle,
          vorhanden an beiden Komponenten, mit <code>aria-valuenow</code>, das dem Wert folgt und im unbestimmten Modus
          wegfällt. <strong>Verfehlt:</strong> keines der gemessenen Kriterien, so wie das Kit es ausliefert — Auras eigener vierfarbiger
          Zyklus würde SC 1.4.11 verfehlen (Grün {{ spinThreeLightCr }}:1, Gelb {{ spinFourLightCr }}:1 auf den hellen
          Section-Flächen), weshalb das Kit ihn ersetzt. <strong>Bedingt:</strong> SC 4.1.2 am Balken, der außerdem ein auf dieser Rolle ungültiges <code>aria-level</code>
          ausliefert — <code>40%</code> determiniert, das Literal <code>undefined%</code> unbestimmt —, überall dort, wo die
          Strip-Direktive an der Aufrufstelle nicht importiert ist, und dessen zugänglichen Namen nur du liefern kannst; und SC
          2.2.2, das beide Komponenten von Haus aus verletzen, sobald ein unbestimmter Indikator die Anfrage überlebt, über die er
          berichtet. <strong>AAA</strong> ist für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Zwei unabhängige Module; keins hat Outputs, keins ist ein Formular-Control. Der dritte Import ist keine Dekoration —
          siehe den Abschnitt zum ungültigen Attribut weiter unten.
        </p>

        <h3>Inputs von <code>p-progressbar</code></h3>
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
                <td>Zahl (<code>numberAttribute</code>)</td>
                <td>
                  0–100. Im unbestimmten Modus undefined; die Breite der Füllung wird inline als <code>value%</code> geschrieben.
                </td>
              </tr>
              <tr>
                <td><code>mode</code></td>
                <td><code>'determinate' | 'indeterminate'</code></td>
                <td>Standard <code>'determinate'</code>. Jeder andere String rendert keinen der beiden Zweige — einen leeren Track.</td>
              </tr>
              <tr>
                <td><code>showValue</code></td>
                <td>Boolean (<code>booleanAttribute</code>)</td>
                <td>
                  Standard <strong><code>true</code></strong
                  >. Rendert <code>value</code> + <code>unit</code> innerhalb der Füllung. Ausgeblendet, wenn <code>value</code> 0
                  oder null ist.
                </td>
              </tr>
              <tr>
                <td><code>unit</code></td>
                <td>String</td>
                <td>Standard <code>'%'</code>, ohne Trennzeichen und ohne Formatierung an die Zahl gehängt.</td>
              </tr>
              <tr>
                <td><code>color</code></td>
                <td>String</td>
                <td>
                  Inline-<code>background</code> auf der Füllung. Umgeht das Token, folgt also nicht dem Theme —
                  greif stattdessen zu einer bereichsbezogenen Custom Property.
                </td>
              </tr>
              <tr>
                <td><code>valueStyleClass</code></td>
                <td>String</td>
                <td>Klasse am Füll-Element; der unterstützte Weg, die Füllung ohne <code>::ng-deep</code> zu stylen.</td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Zurück in Optimus:</strong> <code>styleClass</code> — PrimeNG 22 hat es entfernt, der v21-Fork behält
                  es als <code>&#64;deprecated</code>-Input, das weiter funktioniert. Schreib trotzdem einfaches <code>class</code>.
                  Keins davon ist ein Signal-Input; es sind einfache Properties mit <code>&#64;Input()</code>-Dekoratoren.
                </td>
              </tr>
              <tr>
                <td>Template <code>#content</code></td>
                <td><code>ng-template</code></td>
                <td>
                  Ersetzt die Wertanzeige; bekommt den Wert als <code>$implicit</code>. Wird weiter innerhalb der Füllung gerendert; ein
                  <code>ContentChild('content', &#123; descendants: false &#125;)</code>, also nur ein direktes Kind.
                  <code>pTemplate="content"</code> bindet auch — die v21-Query auf <code>PrimeTemplate</code> ist noch da.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Inputs von <code>p-progressspinner</code></h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>ariaLabel</code></td>
                <td><em>nicht gesetzt</em></td>
                <td>Ein echtes Input, gebunden an <code>aria-label</code> am Host. Setz es — die Rolle ist immer da.</td>
              </tr>
              <tr>
                <td><code>strokeWidth</code></td>
                <td><code>'2'</code></td>
                <td>
                  SVG-Strichbreite auf einem Kreis <code>r="20"</code> in einer <code>viewBox="25 25 50 50"</code>, skaliert also
                  mit der Box.
                </td>
              </tr>
              <tr>
                <td><code>animationDuration</code></td>
                <td><code>'2s'</code></td>
                <td>
                  Inline am <code>&lt;svg&gt;</code>; wirkt <strong>nur auf die Rotation</strong>. Strichmuster- und
                  Farbzyklus behalten ihre eigenen Dauern.
                </td>
              </tr>
              <tr>
                <td><code>fill</code></td>
                <td><code>'none'</code></td>
                <td>Die Füllung des Kreises; lass sie, außer du willst eine gefüllte Scheibe.</td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Kein determinierter Spinner:</strong> Die Inputs <code>value</code>/<code>min</code>/<code>max</code>,
                  die PrimeNG 22 ergänzt hat, gibt es in Optimus nicht, und auch nicht das Attribut <code>data-state</code>, das sie
                  steuerten. Fünf Inputs, und der Host trägt nie ein <code>aria-valuenow</code>. <code>styleClass</code>
                  ist auch hier zurück, <code>&#64;deprecated</code> — nimm einfaches <code>class</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Beide Tabellen sind aus den ausgelieferten Klassen und ihren kompilierten Input-Maps gelesen
          (<code>openng-optimus-ui-progressbar.mjs:136</code>,
          <code>openng-optimus-ui-progressspinner.mjs:90</code>, Optimus UI 2.0.2). Die Größe ist bei keiner der beiden Komponenten ein Input: Der
          Balken nimmt die Breite seines Elternelements und seine Höhe aus einem Token; der Spinner ist laut
          eigenem Stylesheet ein Quadrat von <code>100px</code>, bis du ihm ein <code>[style]</code> oder eine Klasse gibst.
        </p>

        <h3>Was der Host ausgibt</h3>
        <pre class="code-block"><code>{{ hostSnippet }}</code></pre>
        <ul>
          <li>
            <strong><code>role="progressbar"</code> ist am Balken ein statisches Attribut</strong>
            und am Spinner ein Binding. So oder so ist es immer vorhanden: Es gibt keinen „dekorativen“ Modus und keinen Weg,
            einen versteckten Indikator aus dem Tree zu nehmen, außer mit
            <code>aria-hidden</code> an einem Wrapper.
          </li>
          <li>
            <strong><code>aria-valuenow</code> folgt <code>value</code></strong
            >. Im unbestimmten Modus ist <code>value</code> undefined, Angular lässt das Attribut weg, und der Knoten
            liest sich korrekt als „in Arbeit, Position unbekannt“.
          </li>
          <li>
            <strong>Der Spinner meldet überhaupt keinen Wert</strong> und setzt <code>aria-busy="true"</code> an sich selbst —
            weshalb eine umschließende Live-Region, nicht der Spinner, die Wartezeit tatsächlich ansagt.
          </li>
          <li>
            <strong>Keine der beiden Komponenten ist eine Live-Region.</strong> Ein steigendes <code>aria-valuenow</code> wird von
            Hilfstechnik abgefragt, nicht angesagt. Wenn der Nutzer das Ergebnis hören muss, sag es in einer
            Region mit <code>role="status"</code>.
          </li>
        </ul>

        <h3>Das ungültige Attribut und die Kit-Regel, die daraus folgt</h3>
        <p>
          Der Host-Block des Balkens bindet <code>[attr.aria-level]</code> bedingungslos an <code>value + unit</code>.
          <code>aria-level</code> ist für Überschriften definiert; an <code>role="progressbar"</code> ist es ungültig, und
          automatische Audits stufen es als kritisch ein. Zwei Folgen, die du kennen solltest, bevor du es debuggst:
        </p>
        <ul>
          <li>
            Ein determinierter Balken liefert so etwas wie <code>aria-level="40%"</code> aus — und mit einer eigenen <code>unit</code>
            das, was diese Verkettung ergibt (<code>aria-level="12 of 40"</code>). Ein
            <strong>unbestimmter</strong> Balken liefert {{ ariaLevelIndeterminate }} aus, weil derselbe Ausdruck mit
            <code>value</code> undefined läuft.
          </li>
          <li>
            Die Antwort des Kits ist <code>StripInvalidAriaDirective</code>
            (<code>src/app/directives/strip-invalid-aria.directive.ts</code>), die das Attribut entfernt und es immer wieder
            entfernt, wenn die Change Detection es neu setzt. Sie ist
            <strong>standalone und greift über den Element-Selektor</strong>, hängt sich also nur in einer Komponente an, die
            sie in <code>imports</code> listet.
            <strong
              >Kit-Regel: Wo immer <code>ProgressBarModule</code> in einem <code>imports</code>-Array steht, steht die Direktive
              daneben.</strong
            >
            Gemessen mit importierter Direktive: {{ ariaLevelGuarded }}
          </li>
        </ul>
        <p class="src-note">
          Beide Lesungen stammen aus den gerenderten Host-Attributen, mit und ohne die Direktive in den
          <code>imports</code> der Komponente. Um eine eigene Ansicht zu prüfen, lies die Attribute des Elements mit
          <code>role="progressbar"</code>, während sich der Wert bewegt — das Attribut wird bei jedem Tick neu gesetzt, also reicht ein einzelner Schnappschuss
          nicht.
        </p>

        <h3>Benennung: Die beiden Schreibweisen sind nicht gleichwertig</h3>
        <p>
          Der Balken hat <strong>kein Input <code>ariaLabel</code></strong>. <code>[ariaLabel]="…"</code> am
          Element kompiliert trotzdem — Angular weicht auf ein DOM-Property-Binding aus, und die ARIA-Reflection des Browsers macht
          aus dieser Property das Attribut. Das funktioniert im Browser und erzeugt nichts in einem Renderer ohne Reflection,
          und dazu gehört serverseitiges Rendering. <code>[attr.aria-label]</code> ist ein Attribut-Binding und deshalb
          die Schreibweise, die überall hält. Der Spinner hat dieses Problem nicht: <code>ariaLabel</code> ist dort ein
          echtes Input.
        </p>
        <pre class="code-block"><code>{{ namingSnippet }}</code></pre>

        <h3>Einen echten Balken verdrahten</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>
        <p>
          Drei Details in diesem Snippet verdienen ihren Platz. Der Wert ist aus
          <em>gezählter Arbeit</em> abgeleitet, kann also nicht lügen. <code>aria-valuetext</code> trägt die Zählung, weil „46“ nicht
          das ist, was der Nutzer hören will. Und die Region — nicht der Balken — sagt das Ende an.
        </p>

        <h3>SSR</h3>
        <p>
          Beide Komponenten lassen sich gefahrlos prerendern: kein <code>window</code>, keine Timer, keine Messung. Nicht gefahrlos ist
          der Zustand um sie herum. Ein Balken, der bei <code>value = 0</code> startet, wird als leerer Track vorgerendert, also zeigt das statische
          HTML einen Job, der nie begonnen hat; ein unbestimmter Balken wird als leerer Streifen vorgerendert, dessen einziger Inhalt
          eine Animation ist, die der Server nie abspielt. Render lieber den aufgelösten Zustand, und denk daran, dass die Strip-Direktive
          ein Schutz im Lebenszyklus des Browsers ist — das Attribut, das sie entfernt, kann im serverseitig gerenderten Markup noch stehen.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Wie jeder Indikator für einen Screenreader aussieht</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Gerendert</th>
                <th>Knoten im Accessibility Tree</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>determinierter Balken, benannt</td>
                <td>{{ axDeterminate }}</td>
              </tr>
              <tr>
                <td>unbestimmter Balken, benannt</td>
                <td>{{ axIndeterminate }}</td>
              </tr>
              <tr>
                <td>Spinner mit <code>ariaLabel</code></td>
                <td>{{ axSpinner }}</td>
              </tr>
              <tr>
                <td>Balken ohne Namen</td>
                <td>{{ axUnnamedFinding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ axNote }}
        </p>

        <h4>Bewegung</h4>
        <p>
          Keins der beiden Stylesheets fragt <code>prefers-reduced-motion</code> ab. Das Kit neutralisiert alles global aus
          <code>styles.scss</code>, und der Tab Design hat die Zahlen pro Animation. Wer eine der Komponenten ohne diese
          Sammelregel in ein Projekt übernimmt, bekommt zwei endlose Animationen ohne Ausstieg — und der unbestimmte Balken ist
          der, der einen Fallback braucht, nicht nur eine langsamere Schleife.
        </p>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Der Modus ist ehrlich: determiniert nur, wenn es einen Zähler und einen Nenner gibt.</li>
          <li>
            ☐ Der Indikator hat einen zugänglichen Namen — <code>[attr.aria-label]</code> am Balken,
            <code>ariaLabel</code> am Spinner oder einen beschrifteten Wrapper.
          </li>
          <li>☐ <code>aria-valuetext</code> ist gesetzt, wann immer der Wert kein reiner Prozentwert ist.</li>
          <li>
            ☐ <code>ProgressBarModule</code> und <code>StripInvalidAriaDirective</code> sind zusammen importiert; der
            gerenderte Host trägt kein <code>aria-level</code>.
          </li>
          <li>
            ☐ Die Zahl, die der Nutzer braucht, ist auch bei niedrigen Werten lesbar — außerhalb der Füllung, oder <code>showValue</code> ist aus.
          </li>
          <li>
            ☐ Es gibt eine Abschlussansage in einer höflichen Live-Region und einen Fehlerzweig für die Wartezeit, die scheitert.
          </li>
          <li>
            ☐ Reduzierte Bewegung wurde durch Emulieren des Media Features geprüft — besonders bei einem unbestimmten Balken, der
            dann gar nicht mehr sichtbar ist.
          </li>
          <li>☐ Ein Indikator pro Wartezeit, nicht einer pro Zeile.</li>
          <li>☐ Nichts an der Wartezeit hängt davon ab, dass die einsekündige Transition der Füllung fertig ist.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die drei Regeln festnagelt, die zuerst verrotten — das ungültige Attribut, den
          Namen und den fehlenden Wert im unbestimmten Modus:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Die Bibliothek liefert keine Strings — du lieferst vier</h3>
        <p>
          Keine der beiden Komponenten liest etwas aus der Übersetzungskonfiguration von Optimus
          (<code>Optimus.setTranslation</code>): Es gibt keinen String für „lädt“, kein
          „Prozent erledigt“, nichts zu überschreiben. Alles, was ein Nutzer rund um einen Fortschrittsindikator hört oder liest, ist
          deins, und es ist mehr, als man erwartet:
        </p>
        <ul>
          <li>der <strong>zugängliche Name</strong> — was voranschreitet („Quellen werden importiert“);</li>
          <li>
            das <strong><code>aria-valuetext</code></strong> — der Wert als Satz („18 von 40 Quellen importiert“);
          </li>
          <li>die <strong>sichtbare Beschriftung</strong>, wenn die Zahl neben dem Balken steht;</li>
          <li>die <strong>Abschlussmeldung</strong> in der Live-Region — immer mit Pluralform.</li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p>
          Binde alle vier über <code>computed()</code>, damit ein Sprachwechsel sie neu rendert; ein einfaches Feld wird einmal erfasst
          und ist beim nächsten Wechsel veraltet.
        </p>

        <h3><code>unit</code> ist eine String-Verkettung, und genau das ist die Falle</h3>
        <p>
          Die eingebaute Wertanzeige ist <code>value</code>, gefolgt von <code>unit</code>, ohne etwas dazwischen und ohne
          Formatierung. Zwei Dinge brechen bei der Übersetzung. Das
          <strong>Prozentzeichen steht nicht überall hinten und nicht überall ohne Leerzeichen</strong>
          — die französische Konvention setzt ein geschütztes Leerzeichen davor, und mehrere Locales stellen das Zeichen voran —, also ist ein
          wörtliches <code>'%'</code> ein westeuropäischer Standard und kein neutraler. Und die
          <strong>Zahl ist nicht lokalisiert</strong>: Sie läuft durch einfache Interpolation, also behält ein Dezimalwert seinen
          Punkt, wo ein deutscher Leser ein Komma erwartet. Wenn die Zahl wichtig ist, render sie selbst im Content-Template
          mit der Locale-bewussten Formatierung, die der Rest deiner App nutzt, und lass <code>unit</code> in Ruhe.
        </p>
        <p class="src-note">
          Gelesen aus dem Template der Komponente selbst: Das Label-Element interpoliert
          <code>value</code> und dann <code>unit</code>, direkt nebeneinander, ohne Trennzeichen und ohne Zahlenformatierung;
          <code>unit</code> ist standardmäßig <code>'%'</code>.
        </p>

        <h3>Länge: Die Wertanzeige hat fast keinen Platz</h3>
        <p>
          Eine übersetzte Einheit oder ein eigenes Content-Template konkurriert mit der Füllung um Platz, und die Füllung ist
          <code>overflow: hidden</code>. „12 of 40“ ist bei 30% schon eine lange Wertanzeige; derselbe String in einer Sprache, die
          30% länger läuft, wird bei einem Wert abgeschnitten, bei dem der englische noch passte. Das ist das stärkste praktische Argument
          dafür, die Zahl in einer mehrsprachigen UI <em>außerhalb</em> des Balkens zu halten — außerhalb bricht sie um, statt zu verschwinden.
        </p>

        <h3>RTL</h3>
        <p>
          Die unbestimmten Keyframes sind mit logischen Properties geschrieben (<code>inset-inline-start</code> /
          <code>inset-inline-end</code>), also läuft der Wischer in einem Dokument von rechts nach links richtig herum, ohne
          Arbeit an jeder Aufrufstelle. Die determinierte Füllung ist vom Inline-Start aus positioniert und wächst in Inline-Richtung, was
          aus demselben Grund korrekt spiegelt. Der Spinner dreht sich unabhängig von der Richtung im Uhrzeigersinn, was üblich ist
          und keine Spiegelung braucht.
        </p>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui-styles/dist/progressbar/index.mjs</code>.
          <strong>Nicht durch Rendern einer RTL-Locale geprüft</strong> — dieses Kit liefert nur Sprachen von links nach rechts aus, also
          gibt es hier nichts, wogegen man es rendern könnte.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Kit setzt alle vier Spinner-Stopps
            auf <code>--primary-color-fg</code> (die Konvention „bereichsbezogen selbst setzen“ und ihre Demo entfernt); Paare von Balken und
            Spinner aus CONTRAST.MD zitiert, dunkle Füllung neu aus der Farbreihe <code>primaryFgDark</code> gelesen.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Neu geprüft gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016):
            Füllung und Wertanzeige als akzentgesteuerte Aura-Tokens benannt, der Radius pro Stil, flächenabhängige Verhältnisse
            gegen die Section-Flächen der vier Stile neu berechnet und als außerhalb des Kontrast-Gates markiert; Aussage zum schmalen
            Bildschirm ergänzt; <code>p-metergroup</code> aufgenommen (Abdeckung, Vertrag der Agent-Doc, ein Live-Beispiel).
          </li>
          <li>
            <strong>v0.4</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): Drei Befunde aus v0.3
            sind in ihre v21-Form zurückgekippt — die camelCase-Selektoren
            (<code>p-progressBar</code>/<code>p-progressSpinner</code>) kompilieren wieder, <code>styleClass</code> ist an
            beiden als <code>&#64;deprecated</code>-Input zurück, und der Spinner hat keinen determinierten Modus
            (<code>value</code>/<code>min</code>/<code>max</code> und <code>data-state</code> sind weg, fünf Inputs).
            Aura 2.x setzt die Balkenhöhe zurück auf <code>1.25rem</code> = 20px mit einer Wertanzeige von 12px und löst den
            Spinner-Zyklus über einen <code>colorScheme</code>-Block statt <code>light-dark()</code> auf, gleiche Farben.
            Zeilenverweise neu gegen die Optimus-Bundles abgeleitet (Balken-Host <code>:136</code>, Spinner
            <code>:90</code>); das ungültige <code>aria-level</code>-Binding wird weiter ausgeliefert und steht inline im Host-Block,
            ohne berechneten Getter dahinter.
          </li>
          <li>
            <strong>v0.3</strong> — 24.08.2026 — Neu geprüft gegen PrimeNG 22.1.2 / Aura 3.0: camelCase-Selektoren sind
            weg (nur noch Kleinschreibung); <code>styleClass</code> aus beiden Komponenten entfernt; das ungültige
            <code>aria-level</code>-Binding <strong>wird weiter ausgeliefert</strong> (die Regel zu
            <code>StripInvalidAriaDirective</code> bleibt); der Spinner hat einen determinierten Modus bekommen
            (<code>value</code>/<code>min</code>/<code>max</code>); die Balkenhöhe ist auf 18px mit einer Wertanzeige von 10px geschrumpft.
            Die Farbmessungen aus 21 gelten weiter — die Farb-Tokens sind unverändert.
          </li>
          <li>
            <strong>v0.2</strong> — 20.08.2026 — Zusammenfassung des Stands WCAG 2.2 im Tab Design ergänzt: gemessene Kriterien
            als erfüllt / verfehlt / bedingt zusammengefasst, ungemessene Kriterien ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erste Fassung des Guides: die Entscheidung determiniert/unbestimmt/Spinner entlang
            der Achse, was sich zählen lässt, gemessene Token- und Kontrastketten für beide Komponenten in beiden Themes, das
            unterschiedliche Verhalten von Spinner und unbestimmtem Balken bei reduzierter Bewegung, die Regeln zur Benennung und zum ungültigen Attribut und
            die kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ProgressArticleDeComponent extends ProgressArticleComponent {
  // --- Playground ------------------------------------------------------------
  override readonly modeOptions = [
    { label: 'determiniert (Standard)', value: 'determinate' },
    { label: 'unbestimmt', value: 'indeterminate' },
  ];

  override readonly unitOptions = [
    { label: '% (Standard)', value: '%' },
    { label: 'Leerzeichen + % (französischer Stil)', value: ' %' },
    { label: ' of 40', value: ' of 40' },
    { label: 'keine', value: '' },
  ];

  // --- Measured values -------------------------------------------------------
  override readonly tokenRadius: string =
    'border.radius.md des visuellen Stils: 0 werkbund, 12px lernwerkstatt (Standard), 10px skizzenbuch, ' +
    '2px blaupause (Aura-Standard 6px)';

  override readonly contrastFillTrackLight: string = '4,20';
  override readonly contrastFillTrackDark: string = '4,61';
  override readonly contrastLabelLight: string = '5,18';
  override readonly contrastLabelDark: string = '7,83';
  override readonly contrastTrackSurfaceLight: string = '1,05–1,16';
  override readonly contrastTrackSurfaceDark: string = '1,03–1,44';
  override readonly contrastNote: string =
    'Standard-Akzent sunset. Die ersten beiden Zeilen sind in docs/generated/CONTRAST.MD per Gate geprüft, Gruppe ' +
    '„progressbar & slider“ (<accent>.progressbar.value.background auf progressbar.background ' +
    'und das Label auf der Füllung), für jeden Akzent und Stil: Füllung gegen Track 3,78–14,48:1, Wertanzeige ' +
    '5,18–17,85:1. Sie vergleichen den Balken mit sich selbst und halten auf jedem Hintergrund. Die dritte ' +
    'Zeile hängt davon ab, wo du den Balken platzierst, und dient nur der Information: Die Datei listet den Track auf dem ' +
    'Grund und der Card (progressbar.background, kein Kriterium, 1,13–1,76:1), und gegen die ' +
    '--surface-section der vier Stile liegt er bei 1,05–1,16:1 im hellen und 1,03–1,44:1 im dunklen Schema — ' +
    'praktisch unsichtbar, und genau deshalb liest sich ein LEERER Balken wie gar kein Balken.';

  override readonly spinOneLightCr: string = '3,21–3,55';
  override readonly spinTwoLightCr: string = '3,14–3,47';
  override readonly spinThreeLightCr: string = '1,95–2,15';
  override readonly spinFourLightCr: string = '1,64–1,81';
  override readonly spinOneDarkCr: string = '3,88–5,44';
  override readonly spinTwoDarkCr: string = '4,22–5,92';
  override readonly spinThreeDarkCr: string = '6,16–8,64';
  override readonly spinFourDarkCr: string = '7,01–9,83';
  override readonly contrastBrandLight: string = '4,42–4,89';
  override readonly contrastBrandDark: string = '4,74–6,65';
  override readonly contrastBrandWrongLight: string = '4,42–4,89';
  override readonly contrastBrandWrongDark: string = '1,47–2,06';
  override readonly recolourCaution: string =
    'Das Paar aus Füllung und Track liegt am nächsten an seiner Untergrenze von 3:1 (4,20:1 hell beim Standard-Akzent, ' +
    '3,78:1 am niedrigsten, beim Akzent fire im Dark Mode), also kann ein hellerer Track oder eine dunklere Füllung es darunter drücken — und ' +
    'eine Umfärbung außerhalb der Tokens ist nicht mehr das, was das Gate misst. Die Überschreibung der Höhe kostet ' +
    'nichts; jede Überschreibung einer Farbe muss in beiden Schemata neu berechnet werden.';
  override readonly surfaceBasis: string =
    'Verhältnisse gegen eine Fläche sind aus den Token-Werten berechnet, gegen die --surface-section jedes visuellen Stils ' +
    '(werkbund, lernwerkstatt, skizzenbuch, blaupause), und als Spanne ' +
    'über die vier angegeben; die letzten beiden Zeilen nutzen den Standard-Akzent sunset. Die Kit-Zeile ist per Gate geprüft ' +
    '(„progress spinner“, jeder Akzent: 3,88–17,85:1 über Grund, Card und Section); die ' +
    'Standard-Stopps und die Falle mit --primary-color sind hier berechnet, außerhalb des Gates.';

  override readonly indetNormal: string = '2.1s infinite, zweiter Wischer um 1.15s verzögert';
  override readonly indetReduced: string = '1e-05s, 1 Iteration — und beide Wischer 0px breit';
  override readonly spinReduced: string = '1e-05s, 1 Iteration';
  override readonly circleNormal: string = 'p-progressspinner-dash 1.5s + p-progressspinner-color 6s, beide infinite';
  override readonly circleReduced: string = '1e-05s, 1 Iteration';
  override readonly motionNote: string =
    'Dauern und Iterationszahlen sind der berechnete Stil der gerenderten Elemente — der ' +
    'Füllung, ihres ::before und ::after, des svg und des circle — unter jedem Wert des ' +
    'Media Features. Die Lesung 1e-05s ist die CSSOM-Serialisierung der 0.01ms des Kits; der ' +
    'Befund ist nicht die genaue Zahl, sondern dass hier nichts von sich aus reduzierte Bewegung beachtet: ' +
    'Ohne die globale Sammelregel würde jede Zeile wie die ausgelieferte Spalte aussehen. Beachte, dass das ' +
    'Input animationDuration des Spinners immer nur die Rotation berührt — Strichmuster- und Farbzyklus ' +
    'behalten 1.5s und 6s, egal, was du übergibst.';
  override readonly reducedIndeterminateFinding: string =
    'Mit gekappter Animation werden beide wischenden Pseudo-Elemente zu 0px Breite berechnet, also ' +
    'rendert der Streifen als ungefüllter Track.';

  override readonly axDeterminate: string =
    'der Knoten trägt den Wert aus aria-valuenow und, wenn gesetzt, aria-valuetext daneben';
  override readonly axIndeterminate: string = 'überhaupt kein Wert-Schlüssel — nichts im Knoten behauptet eine Position';
  override readonly spinCycleFinding: string =
    'Die Keyframes interpolieren zwischen den Stopps, also durchläuft der unveränderte Strich auch ' +
    'Zwischenmischungen; mit den vier identischen Stopps des Kits bleibt der Strich durchgehend auf der einen ' +
    'Akzentfarbe.';
  override readonly axSpinner: string = 'Name aus ariaLabel, kein Wert — nicht zu unterscheiden von einem unbestimmten Balken';
  override readonly axUnnamedFinding: string =
    'In einer Lesung des Accessibility Tree kommt ein unbenannter BALKEN mit leerem Namen und weiterhin ' +
    'angehängtem Wert zurück — eine Position ohne etwas, zu dem sie gehört; ein unbenannter Spinner kommt ' +
    'mit leerem Namen und ebenfalls ohne Wert zurück.';
  override readonly axNote: string =
    'Schnappschüsse des Accessibility Tree der gerenderten Beispiele auf dieser Seite, ein Knoten pro ' +
    'Indikator. Zwei Dinge lohnen sich zu merken. Wert und Werttext sitzen gleichzeitig auf dem Knoten ' +
    '— aria-valuetext ersetzt aria-valuenow dort nicht; ARIA gibt ihm Vorrang, ' +
    'wenn der Wert GESPROCHEN wird, also sagt ein Screenreader den Satz statt der ' +
    'Prozentzahl, während der Zahlenwert verfügbar bleibt. Und ein Spinner und ein unbestimmter ' +
    'Balken erzeugen denselben Knoten, also ist die Wahl zwischen ihnen visuell, nicht semantisch. Nachvollziehen ' +
    'lässt sich das, indem du einen Schnappschuss des Accessibility Tree mit dem Indikator als Wurzel machst und Name, Wert ' +
    'und Werttext liest.';

  override readonly ariaLevelIndeterminate: string = 'den wörtlichen String aria-level="undefined%"';
  override readonly ariaLevelGuarded: string =
    'kein aria-level an irgendeinem gerenderten Balken, determiniert oder unbestimmt, während aria-valuenow sich ' +
    'weiter aktualisierte.';
  override readonly clipFinding: string =
    'Gemessen an einem 200px breiten Balken bei Wert 3: Die Füllung ist 6px breit und die Box der Wertanzeige 17px, also ' +
    'wird die Zahl abgeschnitten — während derselbe Wert auf einem 910px breiten Balken 27px Füllung hat und sie zeigt. ' +
    'Die Schwelle ist die Textbreite, nicht der Wert.';

  // --- Static example data ---------------------------------------------------
  override readonly examples: ProgressArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));

  override readonly meterItems = [
    { label: 'Systemprompt', value: 12, color: 'var(--p-primary-color)' },
    { label: 'Unterhaltung', value: 38, color: 'var(--text-color-secondary)' },
  ];
  override readonly meterValuetext: string = '50% des Kontextfensters genutzt: Systemprompt 12%, Unterhaltung 38%';
}
