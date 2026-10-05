import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './skeleton-article.component';

/** German title and note per example id; id and code stay from the English base. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  lines: {
    title: 'Textzeilen mit ausgefranstem Rand',
    note: 'Die Grundform. Variier die Breiten — ein bündiger Block wirkt wie ein Darstellungsfehler, nicht wie Fließtext.',
  },
  circle: {
    title: 'Kreise: shape gegen borderRadius',
    note: 'shape="circle" + size ist die lesbare Schreibweise; borderRadius="50%" auf einer nicht quadratischen Box ergibt eine Ellipse.',
  },
  sizing: {
    title: 'Standardwerte, width/height und was size überschreibt',
    note: 'Erster Balken: gar keine Inputs (100% x 1rem). Dritter Balken: size gewinnt — die Breite wird ignoriert.',
  },
  static: {
    title: 'animation="none" — und der Tippfehler, der nichts tut',
    note: 'Nur der exakte String „none“ wird erkannt. Der dritte Balken sagt animation="shimmer" und wellt trotzdem.',
  },
};

/**
 * German twin of the Skeleton guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs skeleton`).
 */
@Component({
  selector: 'app-skeleton-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'skeleton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Skeleton ist ein Versprechen über die Form dessen, was gleich kommt. Alles hier unten ist ein echtes
          <code>p-skeleton</code>; der Playground wechselt zwischen dem Platzhalter und dem Inhalt, für den er steht,
          denn dieser Wechsel — nicht der Schimmer — ist das, was entweder funktioniert oder die Seite unter dem Cursor
          des Lesers verschiebt.
        </p>

        <!-- Playground: the loading state is itself a control. -->
        <section class="pg" aria-label="Skeleton-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-loading">Ladezustand</label>
                <p-toggleswitch inputId="pg-loading" [ngModel]="pgLoading()" (ngModelChange)="pgLoading.set($event)" />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-shape-label">Form</span>
                <p-select
                  [ariaLabelledBy]="'pg-shape-label'"
                  size="small"
                  [options]="shapeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgShape()"
                  (ngModelChange)="pgShape.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-anim-label">Animation</span>
                <p-select
                  [ariaLabelledBy]="'pg-anim-label'"
                  size="small"
                  [options]="animationOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAnimation()"
                  (ngModelChange)="pgAnimation.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-radius-label">Eckenradius</span>
                <p-select
                  [ariaLabelledBy]="'pg-radius-label'"
                  size="small"
                  [options]="radiusOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgRadius()"
                  (ngModelChange)="pgRadius.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-announce">Wartezeit ansagen</label>
                <p-toggleswitch
                  inputId="pg-announce"
                  [ngModel]="pgAnnounce()"
                  (ngModelChange)="pgAnnounce.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau — eine Autorenkarte</span>
              <div class="pg__stage">
                @if (pgLoading()) {
                  <div
                    class="card"
                    [attr.aria-busy]="pgAnnounce() ? 'true' : null"
                    [attr.role]="pgAnnounce() ? 'status' : null"
                  >
                    @if (pgAnnounce()) {
                      <span class="sr-only">Die Autorenkarte wird geladen</span>
                    }
                    <div class="card__row">
                      <p-skeleton
                        [shape]="pgShape()"
                        [animation]="pgAnimation()"
                        [borderRadius]="pgRadius()"
                        size="3rem"
                      />
                      <div class="card__lines">
                        <p-skeleton
                          [animation]="pgAnimation()"
                          [borderRadius]="pgRadius()"
                          width="9rem"
                          height="1.25rem"
                        />
                        <p-skeleton
                          [animation]="pgAnimation()"
                          [borderRadius]="pgRadius()"
                          width="6rem"
                          height="1rem"
                        />
                      </div>
                    </div>
                    <p-skeleton [animation]="pgAnimation()" [borderRadius]="pgRadius()" width="100%" height="3rem" />
                  </div>
                } @else {
                  <div class="card">
                    <div class="card__row">
                      <span class="avatar" aria-hidden="true">AM</span>
                      <div class="card__lines">
                        <strong class="card__name">Ada M. Rivera</strong>
                        <span class="card__role">Forschungsingenieurin</span>
                      </div>
                    </div>
                    <p class="card__bio">
                      Arbeitet an Evaluations-Harnesses. Schreibt darüber, warum der Benchmark, dem du vertraust, meist
                      genau das misst, was du ohnehin schon geglaubt hast.
                    </p>
                  </div>
                }
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

        <!-- The whole decision space, running at once. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Vier Antworten auf dieselbe Wartezeit, nebeneinander</h3>
            <button type="button" class="copy-btn" (click)="startRun()" [disabled]="running()">
              {{ running() ? 'Läuft …' : '2,5 s Ladezeit starten' }}
            </button>
          </div>
          <p class="ex__note">
            Drück den Button und sieh zu, wie alle vier Panels <em>dieselbe</em> Wartezeit von 2,5 Sekunden behandeln. Die
            Unterschiede sind nicht kosmetisch: Nur eines sagt dir, wie lange es dauert, nur eines sagt dir, was kommt, und
            nur drei sagen dir überhaupt etwas.
          </p>
          <div class="strat">
            <div class="strat__cell">
              <span class="strat__tag">Skeleton</span>
              <div class="strat__stage">
                @if (running()) {
                  <div class="mini" role="status" aria-busy="true">
                    <span class="sr-only">Der Bericht wird geladen</span>
                    <p-skeleton width="70%" height="1.25rem" />
                    <p-skeleton width="100%" height="1rem" />
                    <p-skeleton width="88%" height="1rem" />
                  </div>
                } @else {
                  <div class="mini">
                    <strong class="mini__title">Quartalsbericht</strong>
                    <p class="mini__body">Elf Experimente, vier davon reproduziert.</p>
                  </div>
                }
              </div>
              <p class="strat__why">Das Layout ist bekannt, also bewegt sich die Box nie. Sagt nichts über die Dauer.</p>
            </div>

            <div class="strat__cell">
              <span class="strat__tag">Spinner</span>
              <div class="strat__stage">
                @if (running()) {
                  <div class="mini mini--center" role="status">
                    <span class="sr-only">Der Bericht wird geladen</span>
                    <!-- Optimus has styleClass back on p-progressspinner as @deprecated; the size still comes from [style] -->
                    <p-progressspinner
                      strokeWidth="4"
                      [ariaLabel]="'Der Bericht wird geladen'"
                      [style]="{ width: '2.5rem', height: '2.5rem' }"
                    />
                  </div>
                } @else {
                  <div class="mini">
                    <strong class="mini__title">Quartalsbericht</strong>
                    <p class="mini__body">Elf Experimente, vier davon reproduziert.</p>
                  </div>
                }
              </div>
              <p class="strat__why">
                Ehrlich, wenn du weder die Dauer noch die Form kennst. Kostet beim Eintreffen einen Layout-Sprung.
              </p>
            </div>

            <div class="strat__cell">
              <span class="strat__tag">Fortschrittsbalken</span>
              <div class="strat__stage">
                @if (running()) {
                  <div class="mini mini--center">
                    <p-progressbar
                      [value]="progress()"
                      [attr.aria-label]="'Der Bericht wird geladen'"
                      [style]="{ width: '100%' }"
                    />
                    <span class="mini__pct">{{ progress() }}%</span>
                  </div>
                } @else {
                  <div class="mini">
                    <strong class="mini__title">Quartalsbericht</strong>
                    <p class="mini__body">Elf Experimente, vier davon reproduziert.</p>
                  </div>
                }
              </div>
              <p class="strat__why">
                Der einzige, der „wie lange noch?“ beantwortet — und der einzige, den du nicht vortäuschen darfst, wenn du
                nicht messen kannst.
              </p>
            </div>

            <div class="strat__cell">
              <span class="strat__tag">Nichts</span>
              <div class="strat__stage">
                @if (!running()) {
                  <div class="mini">
                    <strong class="mini__title">Quartalsbericht</strong>
                    <p class="mini__body">Elf Experimente, vier davon reproduziert.</p>
                  </div>
                } @else {
                  <div class="mini mini--center"><span class="mini__blank">&nbsp;</span></div>
                }
              </div>
              <p class="strat__why">
                Die richtige Antwort unter etwa 300 ms — ein Indikator, der innerhalb eines Wimpernschlags erscheint und
                wieder verschwindet, wirkt wie ein Fehler, nicht wie Feedback.
              </p>
            </div>
          </div>
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
                @case ('lines') {
                  <div class="stack" role="status" aria-busy="true">
                    <span class="sr-only">Der Artikel wird geladen</span>
                    <p-skeleton width="60%" height="1.75rem" />
                    <p-skeleton height="1rem" />
                    <p-skeleton height="1rem" />
                    <p-skeleton width="82%" height="1rem" />
                  </div>
                }
                @case ('circle') {
                  <div class="stack stack--row">
                    <p-skeleton shape="circle" size="3rem" />
                    <p-skeleton shape="circle" size="2rem" />
                    <p-skeleton shape="circle" size="1.25rem" />
                    <p-skeleton width="6rem" height="3rem" borderRadius="50%" />
                  </div>
                }
                @case ('sizing') {
                  <div class="stack">
                    <p-skeleton />
                    <p-skeleton width="12rem" height="2.5rem" />
                    <p-skeleton size="2.5rem" width="12rem" />
                    <p-skeleton width="12rem" height="2.5rem" borderRadius="999px" />
                  </div>
                }
                @case ('static') {
                  <div class="stack">
                    <p-skeleton height="1.5rem" animation="none" />
                    <p-skeleton height="1.5rem" animation="wave" />
                    <p-skeleton height="1.5rem" animation="shimmer" />
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
        <h3>Welcher Ladezustand? Die ehrliche Tabelle</h3>
        <p>
          Hier gibt es keinen Standard. Die Wahl ergibt sich aus zwei Fragen, die du beantworten kannst, bevor du irgendein
          Markup schreibst — <strong>kenne ich die Form dessen, was ankommt?</strong> und
          <strong>weiß ich, wie lange es dauert?</strong> — plus einer dritten, die beide überstimmt:
          <strong>ist die Wartezeit lang genug, um sie überhaupt zu zeigen?</strong>
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Dauer</th>
                <th>Layout</th>
                <th>Was der Nutzer erfährt</th>
                <th>Wer es ansagt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nichts</strong></td>
                <td>Unter ~300 ms</td>
                <td>beliebig</td>
                <td>Nichts — und genau nichts ist passiert.</td>
                <td>Niemand. Sag stattdessen das <em>Ergebnis</em> an.</td>
              </tr>
              <tr>
                <td><code>p-skeleton</code></td>
                <td>~0,3–5 s, unbekannt, aber begrenzt</td>
                <td><strong>bekannt</strong> — du kannst die Boxen zeichnen</td>
                <td>Was kommt und ungefähr wie viel davon. Keine Zeitangabe.</td>
                <td>
                  <strong>Du.</strong> Jedes Skeleton ist <code>aria-hidden="true"</code>; der Container muss die Ansage tragen.
                </td>
              </tr>
              <tr>
                <td><code>p-progressspinner</code></td>
                <td>unbekannt oder länger als ein paar Sekunden</td>
                <td>unbekannt oder eine ganze Ansicht</td>
                <td>„Irgendetwas passiert.“ Sonst nichts.</td>
                <td>
                  Er hat einen echten <code>ariaLabel</code>-Input, gebunden an <code>[attr.aria-label]</code> auf dem Host
                  (<code>openng-optimus-ui-progressspinner.mjs:111</code>, Host-Block) — aber pack ihn trotzdem in
                  <code>role="status"</code>, sonst existiert der Name und niemand sagt ihn an.
                </td>
              </tr>
              <tr>
                <td><code>p-progressbar</code></td>
                <td><strong>messbar</strong> — Bytes, Schritte, Einträge</td>
                <td>beliebig</td>
                <td>Wie weit es ist, also wie lange noch.</td>
                <td>
                  <code>role="progressbar"</code> ist ein Host-Attribut, und es gibt
                  <strong>keinen <code>ariaLabel</code>-Input</strong> — aber anders als ein Skeleton IST das ein benennbarer
                  Knoten: <code>[attr.aria-label]</code> auf dem Host funktioniert (gemessen). Siehe den Kit-Defekt unten.
                </td>
              </tr>
              <tr>
                <td><code>p-progressbar mode="indeterminate"</code></td>
                <td>unbekannt, lang</td>
                <td>beliebig</td>
                <td>Dasselbe wie ein Spinner, nur als Streifen. Wähl ihn wegen des Platzes, in den er passt, nicht wegen zusätzlicher Information.</td>
                <td>Wie oben.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> Die Spalte „Wer es ansagt“ ist gemessen und belegt (das
          <code>aria-hidden</code>-Host-Binding in <code>openng-optimus-ui-skeleton.mjs:129</code>; der Gang durch den
          Accessibility Tree im Tab Entwicklung). Die <strong>Dauer-Bänder sind eine Einschätzung, keine Messung</strong>. Sie
          bilden Nielsens drei klassische Antwortzeit-Grenzen ab — 0,1 s wirkt sofort, 1 s hält den Gedankenfluss des
          Nutzers, 10 s ist die Obergrenze der Aufmerksamkeit —, und die Untergrenze von ~300 ms ist der Punkt, an dem ein
          Platzhalter, der erscheint und wieder verschwindet, wie ein Darstellungsfehler aussieht statt wie Feedback.
          Verschieb die Bänder, wenn dein Inhalt widerspricht; zitier sie nicht als Befund.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Platzhalter in der falschen Größe</span>
            <div class="dd__stage">
              <button type="button" class="copy-btn" (click)="toggleShift()">
                {{ shiftLoading() ? 'Inhalt zeigen' : 'Skeleton zeigen' }}
              </button>
              <div class="shift">
                @if (shiftLoading()) {
                  <div class="shift__box" id="shift-bad-skeleton">
                    <p-skeleton width="100%" height="1rem" />
                  </div>
                } @else {
                  <div class="shift__box" id="shift-bad-real">
                    <p class="shift__text">
                      Drei Zeilen Zusammenfassung, die der einzeilige Platzhalter nie eingeplant hat, also springt alles
                      darunter in dem Moment, in dem der Fetch zurückkommt.
                    </p>
                  </div>
                }
                <div class="shift__marker">↑ alles hier drunter bewegt sich</div>
              </div>
            </div>
            <p class="dd__why">
              Schalt es um: Der Skeleton-Block ist
              <strong>{{ shiftBadSkeletonPx }}px</strong> hoch, der echte Inhalt
              <strong>{{ shiftBadRealPx }}px</strong> — ein Sprung von <strong>{{ shiftBadDeltaPx }}px</strong> für jedes
              Element darunter. Ein Skeleton, das die Größe rät, hat dir genau den Layout-Shift eingebracht, den du
              vermeiden wolltest.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die echte Box reservieren</span>
            <div class="dd__stage">
              <button type="button" class="copy-btn" (click)="toggleShift()">
                {{ shiftLoading() ? 'Inhalt zeigen' : 'Skeleton zeigen' }}
              </button>
              <div class="shift">
                @if (shiftLoading()) {
                  <div class="shift__box shift__box--lines" id="shift-good-skeleton">
                    <p-skeleton width="100%" height="1rem" />
                    <p-skeleton width="100%" height="1rem" />
                    <p-skeleton width="64%" height="1rem" />
                  </div>
                } @else {
                  <div class="shift__box" id="shift-good-real">
                    <p class="shift__text">
                      Drei Zeilen Zusammenfassung, die der dreizeilige Platzhalter exakt reserviert hat, also bewegt sich
                      nichts darunter, wenn der Fetch zurückkommt.
                    </p>
                  </div>
                }
                <div class="shift__marker">↑ nichts hier drunter bewegt sich</div>
              </div>
            </div>
            <p class="dd__why">
              Dieselben zwei Messungen: Skeleton <strong>{{ shiftGoodSkeletonPx }}px</strong>, Inhalt
              <strong>{{ shiftGoodRealPx }}px</strong> — eine Differenz von <strong>{{ shiftGoodDeltaPx }}px</strong>. Triff
              die Zeilenzahl und die Zeilenhöhe, nicht „ungefähr einen Absatz“.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Stille für den Screenreader</span>
            <div class="dd__stage">
              <div class="mini">
                <p-skeleton width="70%" height="1.25rem" />
                <p-skeleton width="100%" height="1rem" />
              </div>
            </div>
            <p class="dd__why">
              Beide Elemente sind <code>aria-hidden="true"</code> — das ist ein fest verdrahtetes Host-Binding, kein
              Standard, den du abschalten kannst (<code>openng-optimus-ui-skeleton.mjs:129</code>). Ohne Wrapper zeigt der
              Accessibility Tree einen leeren Bereich: Ein Screenreader-Nutzer hört den alten Inhalt verschwinden und dann
              nichts. Der Fehler wird leicht übersehen, gerade weil die visuelle Seite fertig aussieht.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — lass den Container sprechen</span>
            <div class="dd__stage">
              <div class="mini" role="status" aria-busy="true">
                <span class="sr-only">Der Bericht wird geladen</span>
                <p-skeleton width="70%" height="1.25rem" />
                <p-skeleton width="100%" height="1rem" />
              </div>
            </div>
            <p class="dd__why">
              <code>role="status"</code> macht den Wrapper zu einer höflichen Live-Region; <code>aria-busy="true"</code>
              sagt assistiven Technologien, dass die Region gerade aktualisiert wird; die <code>.sr-only</code>-Zeile gibt
              ihr etwas zu sagen. Entferne <code>aria-busy</code> und tausch den Text gegen das Ergebnis, wenn die Daten da
              sind.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — „lädt“ aus Leere ableiten</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ emptyBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Ein leeres Ergebnis und ein gescheiterter Request sehen beide genau wie „lädt noch“ aus, also hört der
              Schimmer nie auf. Das verräterische Zeichen ist ein Error-Handler, der die Collection auf
              <code>[]</code> setzt — mit dieser Form <em>startet</em> das Leeren der Daten den Ladezustand, statt ihn zu
              beenden, und der Kommentar über so einer Zeile behauptet meist das Gegenteil.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — drei Zustände, ein expliziter Schalter</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ emptyGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Laden, leer und gescheitert sind drei verschiedene Dinge, und der Nutzer verdient drei verschiedene
              Antworten. Ein Skeleton ist nur für die erste richtig.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Skeleton für eine unvorhersehbare Form</span>
            <div class="dd__stage">
              <div class="mini">
                <p-skeleton width="100%" height="1rem" />
                <p-skeleton width="100%" height="1rem" />
                <p-skeleton width="100%" height="1rem" />
              </div>
            </div>
            <p class="dd__why">
              Suchergebnisse, die 0, 3 oder 200 Zeilen sein können: Jedes Skeleton, das du zeichnest, ist geraten, und
              falsch geraten heißt Layout-Shift plus ein falsches Versprechen darüber, wie viel kommt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Spinner, wenn du keine Form versprechen kannst</span>
            <div class="dd__stage">
              <div class="mini mini--center" role="status">
                <span class="sr-only">Suche läuft</span>
                <p-progressspinner
                  strokeWidth="4"
                  [ariaLabel]="'Suche läuft'"
                  [style]="{ width: '2.5rem', height: '2.5rem' }"
                />
              </div>
            </div>
            <p class="dd__why">
              Ein Spinner verspricht nichts als Aktivität, und genau das weißt du. Reservier den Platz, in dem er sitzt,
              damit die Ergebnisse ihn beim Eintreffen nicht beiseiteschieben.
            </p>
          </div>
        </div>

        <h3>Das Skeleton ist ein Versprechen — halt es</h3>
        <ul>
          <li>
            <strong>Zeichne das Layout, nicht ein Rechteck.</strong> Sechs identische graue Balken sind ein Spinner mit
            zusätzlichem DOM. Bilde die Überschrift, den Avatar, den Absatz, die Chips nach.
          </li>
          <li>
            <strong>Variier die Zeilenbreiten.</strong> Echte Prosa hat eine ausgefranste letzte Zeile; ein perfekt
            bündiger Block wirkt wie ein Darstellungsartefakt. Eine Folge wie 100 %, 98 %, 92 %, 85 %, dann ein kurzes Paar
            40/30 %, liest sich wie ein Absatz.
          </li>
          <li>
            <strong>Begrenz die Anzahl.</strong> Zeig so viele Platzhalterzeilen, wie in den Viewport passen, nicht so
            viele, wie die Antwort enthalten könnte. Ein Bildschirm voll ist schon großzügig; eine Platzhalterliste in
            voller Länge ist ein Versprechen, das du nicht halten kannst.
          </li>
          <li>
            <strong>Lass ein Skeleton nie den Endzustand sein.</strong> Jedes Skeleton braucht einen Timeout, einen
            Fehlerzweig und einen Leer-Zweig, sonst wird es zur dauerhaften Lüge.
          </li>
          <li>
            <strong>Stapel es nicht mit einem globalen Overlay.</strong> Das Kit verwischt während des
            Translation-ready-Gates schon die ganze Seite hinter <code>app-loading-overlay</code>; ein Skeleton darunter ist
            unsichtbare Arbeit.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-busy" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-busy</code></a
            >
            — die normative Definition von „ein Element wird gerade verändert“: Setz es auf den Container, der ersetzt
            wird, nicht auf die Platzhalter, und erwarte, dass assistive Technologien die Ansage aufschieben, bis es
            wieder entfernt ist. Das ist die Spezifikation hinter der ganzen Spalte „Wer es ansagt“.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/alert/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Alert pattern and live regions</a
            >
            — warum eine Lademeldung in eine höfliche Region gehört (<code>role="status"</code>) statt in eine
            bestimmende: Die Wartezeit ist kein Notfall und darf nicht unterbrechen, was der Nutzer gerade liest.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.3.3 Animation from Interactions (AAA)</a
            >
            — durch Interaktion ausgelöste Bewegung muss abschaltbar sein, sofern sie nicht wesentlich ist. Ein endloser
            Schimmer von 1,2 s ist genau diese Bewegung, und Optimus liefert keinen Ausschalter; der Tab Design behandelt
            die globale Regel, die darauf antwortet.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.2.2 Pause, Stop, Hide</a
            >
            — die Fünf-Sekunden-Regel für automatisch bewegte Inhalte. Ein Skeleton, das seinen Fetch überlebt, macht aus
            einer konformen Wartezeit von drei Sekunden eine Daueranimation.
          </li>
          <li>
            <a href="https://web.dev/articles/cls" target="_blank" rel="noopener noreferrer">
              web.dev — Cumulative Layout Shift</a
            >
            — die Metrik, die die Regel „passende Maße“ schützen soll. Sie ist auch der ehrliche Grund, warum ein falsch
            dimensioniertes Skeleton schlimmer ist als gar keins: Es verschiebt zweimal.
          </li>
          <li>
            <a
              href="https://www.nngroup.com/articles/response-times-3-important-limits/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nielsen Norman Group — Response Times: The 3 Important Limits</a
            >
            — 0,1 s / 1 s / 10 s. Der Ursprung der Dauer-Bänder in der Tabelle oben, zitiert als die Einschätzung, die sie
            ist, und nicht als gemessene Schwelle.
          </li>
          <li>
            <a href="https://optimus.openng.org/skeleton/" target="_blank" rel="noopener noreferrer">
              Optimus UI — Skeleton component</a
            >
            — die API-Oberfläche des Herstellers (sieben Inputs in 2.0.2, keine Outputs), die dieser Guide auf die
            Konventionen des Kits abbildet und dann gegen den ausgelieferten Quellcode prüft.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — <code>prefers-reduced-motion</code></a
            >
            — das Media-Feature, das das ausgelieferte Skeleton-CSS nicht abfragt und auf das der globale Catch-all des Kits
            in <code>styles.scss</code> stellvertretend antwortet.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie — eine leere Box und ein Pseudo-Element</h3>
        <p>
          <code>p-skeleton</code> hat das kürzeste Template in Optimus: Es ist wörtlich <code>template: ''</code>. Alles,
          was du siehst, ist das Host-Element plus ein <code>::after</code>-Pseudo-Element, weshalb ein Skeleton nie Inhalt
          enthalten kann und es auch nie muss.
        </p>
        <ul>
          <li>
            <strong>Host</strong> — <code>&lt;p-skeleton class="p-skeleton p-component"&gt;</code>,
            <code>display: block</code>, <code>overflow: hidden</code>, <code>position: relative</code> (ein Inline-Style,
            den die Komponente selbst schreibt), plus <code>aria-hidden="true"</code> und ein <code>data-p</code>-Attribut,
            das die Form trägt.
          </li>
          <li>
            <strong>Größe</strong> — <code>width</code> / <code>height</code> / (oder <code>size</code>) /
            <code>borderRadius</code> werden vom Getter <code>containerStyle</code> als <em>Inline-Styles</em> geschrieben,
            schlagen also jede Stylesheet-Regel, die nicht <code>!important</code> ist.
          </li>
          <li>
            <strong>Schimmer</strong> — <code>.p-skeleton::after</code>, absolut positioniert, ein
            <code>linear-gradient</code> mit drei Stopps (transparent → Highlight → transparent), verschoben von
            <code>-100%</code> nach <code>100%</code>.
          </li>
          <li>
            <strong>Modifikatoren</strong> — <code>.p-skeleton-circle</code> (<code>border-radius: 50%</code>) und
            <code>.p-skeleton-animation-none</code> (<code>animation: none</code> auf dem Pseudo-Element). Das ist die
            gesamte Klassen-Oberfläche.
          </li>
        </ul>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-skeleton.mjs</code> (die Klassen-Map bei <code>:14-21</code>, die
          Host-Bindings bei <code>:128-133</code>, Optimus 2.0.2) und dem Stylesheet, das es importiert,
          <code>&#64;openng/optimus-ui-styles/dist/skeleton/index.mjs</code> — ein einziger <code>style</code>-String mit 50 Zeilen,
          unten vollständig zitiert.
        </p>

        <h3>Standardwerte und die Rangfolge bei der Größe</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Wirkung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>shape</code></td>
                <td><code>'rectangle'</code></td>
                <td>Nur <code>'circle'</code> wird gesondert behandelt; es ergänzt <code>border-radius: 50%</code>.</td>
              </tr>
              <tr>
                <td><code>animation</code></td>
                <td><code>'wave'</code></td>
                <td>Nur <code>'none'</code> wird gesondert behandelt. Siehe die Falle unten.</td>
              </tr>
              <tr>
                <td><code>width</code></td>
                <td><code>'100%'</code></td>
                <td>Inline-<code>width</code>.</td>
              </tr>
              <tr>
                <td><code>height</code></td>
                <td><code>'1rem'</code></td>
                <td>
                  Inline-<code>height</code> — gemessen <strong>{{ measuredDefaultHeight }}</strong> bei der
                  Root-Schriftgröße des Kits.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td><em>nicht gesetzt</em></td>
                <td>
                  <strong>Überschreibt beide</strong>, <code>width</code> und <code>height</code>, mit demselben Wert — ein
                  Quadrat (oder, mit <code>shape="circle"</code>, ein Kreis).
                </td>
              </tr>
              <tr>
                <td><code>borderRadius</code></td>
                <td><em>nicht gesetzt</em></td>
                <td>Fällt auf den Theme-Token zurück; jede CSS-Länge oder <code>%</code> funktioniert.</td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Veraltet, nicht entfernt:</strong> <code>styleClass</code> — Optimus deklariert es noch
                  (<code>&#64;deprecated since v20.0.0</code>), und der Host liest es in
                  <code>cn(cx('root'), styleClass)</code> bei <code>:130</code>, also kompiliert und funktioniert das Binding.
                  Nimm trotzdem einfach <code>class</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Standardwerte sind die Initialisierer der Klassenfelder in
          <code>openng-optimus-ui-skeleton.mjs</code> (<code>shape</code> :72, <code>animation</code> :77, <code>width</code> :92,
          <code>height</code> :97, Optimus 2.0.2); die Rangfolge ist der Getter <code>containerStyle</code>, der
          mit <code>if (this.size)</code> verzweigt, bevor er überhaupt auf <code>width</code>/<code>height</code> schaut.
          Die Box-Größen sind Computed Style an einem gerenderten Skeleton.
        </p>

        <h3>Farbe — beide Themes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-skeleton-background</code></td>
                <td>
                  <code>{{ tokenBgLight }}</code>
                </td>
                <td>
                  <code>{{ tokenBgDark }}</code>
                </td>
              </tr>
              <tr>
                <td>berechneter Hintergrund (gerendert)</td>
                <td>
                  <code>{{ computedBgLight }}</code>
                </td>
                <td>
                  <code>{{ computedBgDark }}</code>
                </td>
              </tr>
              <tr>
                <td>Fläche, auf der es liegt</td>
                <td>
                  <code>{{ surfaceLight }}</code>
                </td>
                <td>
                  <code>{{ surfaceDark }}</code>
                </td>
              </tr>
              <tr>
                <td><strong>Kontrast, Skeleton gegen Fläche</strong> (CONTRAST.MD, informativ)</td>
                <td>
                  <strong>{{ contrastLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ contrastDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td><code>--p-skeleton-animation-background</code> (der Schimmer)</td>
                <td>
                  <code>{{ tokenShimmerLight }}</code>
                </td>
                <td>
                  <code>{{ tokenShimmerDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-skeleton-border-radius</code></td>
                <td colspan="2">
                  <code>{{ tokenRadius }}</code> — der gemeinsame Content-Radius
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ contrastNote }}
        </p>

        <h3>Die Animation, genau so, wie sie ausgeliefert wird</h3>
        <pre class="code-block"><code>{{ shipedCss }}</code></pre>
        <p class="src-note">
          Das ist das vollständige Stylesheet, kopiert aus
          <code>&#64;openng/optimus-ui-styles/dist/skeleton/index.mjs</code> und aus seiner escapten Einzeilenform aufgeklappt.
          Zwei Dinge lohnen das zweite Lesen. Es gibt darin
          <strong>keinen <code>prefers-reduced-motion</code>-Block</strong> — der Schimmer von 1,2 s ist bedingungslos und
          endlos. Und es <em>gibt</em> einen RTL-Keyframe, geschlüsselt auf <code>[dir='rtl']</code>, sodass der Schwung in
          einem Dokument von rechts nach links korrekt die Richtung umkehrt, ohne Arbeit an jeder Aufrufstelle.
        </p>

        <h3>Reduzierte Bewegung: Das Kit beantwortet, was die Bibliothek nicht beantwortet</h3>
        <p>
          <code>styles.scss</code> beginnt mit einem globalen <code>&#64;media (prefers-reduced-motion: reduce)</code>-Block,
          der <code>animation-duration: 0.01ms !important</code> und
          <code>animation-iteration-count: 1 !important</code> auf <code>*, *::before, *::after</code> setzt. Zwei
          Entscheidungen darin lohnen das Abschauen. Das <code>!important</code> ist keine Schlamperei: Optimus injiziert sein
          Komponenten-CSS über ein <code>&lt;style&gt;</code>-Tag zur Laufzeit, das <em>nach</em> dem Stylesheet landet, also
          würde bei gleicher Spezifität sonst die Bibliothek gewinnen. Und die Dauer ist <code>0.01ms</code> statt
          <code>none</code>, damit <code>animationend</code>/<code>transitionend</code> weiterhin feuern und Komponentenlogik,
          die darauf wartet, nicht hängen bleibt.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Emuliertes Media-Feature</th>
                <th><code>.p-skeleton::after</code> animation-duration</th>
                <th>iteration-count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>prefers-reduced-motion: no-preference</code></td>
                <td>
                  <code>{{ motionNormalDuration }}</code>
                </td>
                <td>
                  <code>{{ motionNormalIterations }}</code>
                </td>
              </tr>
              <tr>
                <td><code>prefers-reduced-motion: reduce</code></td>
                <td>
                  <code>{{ motionReducedDuration }}</code>
                </td>
                <td>
                  <code>{{ motionReducedIterations }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ motionNote }}
        </p>

        <h3>Layout-Shift — der ganze Zweck, in zwei Zahlen</h3>
        <p>
          Ein Skeleton existiert, um die Box offen zu halten. Beim Do/Don’t-Paar im Tab Verwendung verschiebt das
          unpassende Paar alles darunter um
          <strong>{{ shiftBadDeltaPx }}px</strong>; das passende Paar verschiebt es um
          <strong>{{ shiftGoodDeltaPx }}px</strong>. Davon gibt es keine clevere Variante — entweder hast du den echten
          Inhalt gemessen oder nicht.
        </p>
        <p class="src-note">
          {{ shiftNote }}
        </p>

        <h3>Abstände: die Klasse, die es nicht gibt</h3>
        <p>
          Der häufigste Weg, auf dem ein Skeleton-Block still seinen Rhythmus verliert, ist eine Utility-Klasse, die
          niemand definiert. <code>mb-3</code>, <code>mb-2</code>, <code>mt-2</code> und ihre Verwandten sehen nach
          Bootstrap oder PrimeFlex aus, und keins von beiden ist hier eine Abhängigkeit — also kompiliert
          <code>&lt;p-skeleton class="mb-3" /&gt;</code>, rendert und fügt überhaupt keinen Margin hinzu. Eine Klasse, die
          in den gekapselten Styles irgendeiner Komponente <em>definiert</em> ist, ist nicht besser: Emulated Encapsulation
          hält sie von jedem Skeleton anderswo fern. Gib Skeletons den Abstand über den Container (<code>gap</code> an
          einem Flex- oder Grid-Elternelement), nicht über Klassen pro Element; ein Gap kann nicht still fehlen.
        </p>
        <p class="src-note">
          So prüfst du ein Projekt darauf: Liste jeden <code>class</code>/<code>styleClass</code>-Wert, der an einem
          Skeleton verwendet wird, und such dann jeden Namen per grep im globalen Stylesheet und in
          <code>node_modules</code>. Alles, was nur im <code>styles</code>-Array einer Komponente vorkommt, zählt als
          fehlend.
        </p>

        <h3>Schmale Bildschirme</h3>
        <p>
          Das Skeleton hat kein eigenes responsives Verhalten: <code>width</code> und <code>height</code> sind
          Inline-Styles, also folgt eine prozentuale Breite dem Container in jedem Viewport, und eine feste
          <code>px</code>-Breite läuft über ihn hinaus. Umbrechen muss das Layout, das du nachbildest — wenn der echte
          Inhalt unterhalb eines Breakpoints von einem Grid auf eine einzelne Spalte wechselt, muss der Platzhalter am
          selben Breakpoint wechseln, sonst passiert der Shift, gegen den du ihn gebaut hast, trotzdem.
        </p>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird nicht
          beansprucht. <strong>Erfüllt:</strong> SC 2.2.2 für einen Nutzer mit reduzierter Bewegung: Der globale Catch-all
          des Kits bringt den Schimmer von {{ motionNormalDuration }} / {{ motionNormalIterations }} auf
          {{ motionReducedDuration }} / {{ motionReducedIterations }}, sodass er einmal läuft statt für immer.
          <strong>Nicht erfüllt:</strong> Keins der gemessenen Kriterien schlägt fehl. <strong>Bedingt:</strong> noch
          einmal SC 2.2.2, überall dort, wo dieser Catch-all fehlt oder das Skeleton seinen Fetch überlebt — das
          ausgelieferte Stylesheet enthält keinen <code>prefers-reduced-motion</code>-Block, also ist der Schimmer sonst
          bedingungslos; und SC 4.1.3, weil der Platzhalter durch ein konstantes Binding <code>aria-hidden</code> ist und im
          Accessibility Tree null liefert, also wird die Wartezeit nur dort angesagt, wo der Container die Live-Region trägt
          und <code>aria-busy</code> entfernt, wenn der Inhalt ankommt. SC 1.4.3 und SC 1.4.11 werden in keine Richtung
          beansprucht: Die Werte {{ contrastLight }}:1 hell / {{ contrastDark }}:1 dunkel sind als informativ erfasst, denn
          ein verborgener Platzhalter ohne Text liegt außerhalb beider Kriterien. <strong>AAA</strong> wird nur bewertet,
          wo dieser Guide es nennt: SC 2.3.3 verlangt, dass solche Bewegung abschaltbar ist, die Bibliothek liefert keinen
          Ausschalter, und die globale Regel des Kits ist das, was darauf antwortet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>SkeletonModule</code> exportiert die Standalone-Komponente <code>Skeleton</code> (du kannst
          <code>Skeleton</code> auch direkt importieren). Es gibt keine Direktiven-Form, keinen
          <code>ControlValueAccessor</code> und <strong>überhaupt keine Outputs</strong> — ein Skeleton ist reine
          Darstellung, auf die man nicht hören kann.
        </p>

        <h3>Inputs — alle sieben</h3>
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
                <td><code>shape</code></td>
                <td><code>'rectangle' | 'circle'</code></td>
                <td>
                  Standard <code>'rectangle'</code>. <code>'circle'</code> ergänzt die Klasse mit dem 50-%-Radius — kombinier
                  es mit <code>size</code>, nicht mit <code>width</code>/<code>height</code>.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>string</td>
                <td>
                  Eine CSS-Länge für beide Dimensionen. Gewinnt gegen <code>width</code> und <code>height</code>.
                </td>
              </tr>
              <tr>
                <td><code>width</code></td>
                <td>string</td>
                <td>
                  Standard <code>'100%'</code>. Prozentwerte sind meist das, was du willst — sie überstehen Übersetzung und
                  Umbruch.
                </td>
              </tr>
              <tr>
                <td><code>height</code></td>
                <td>string</td>
                <td>
                  Standard <code>'1rem'</code>. Triff die Zeilenhöhe des Texts, für den du stehst, nicht seine
                  Schriftgröße.
                </td>
              </tr>
              <tr>
                <td><code>borderRadius</code></td>
                <td>string</td>
                <td>Jede CSS-Länge oder jeder Prozentwert; nicht gesetzt fällt es auf den Theme-Token zurück.</td>
              </tr>
              <tr>
                <td><code>animation</code></td>
                <td>string</td>
                <td><code>'none'</code> schaltet den Schimmer ab. Alles andere ist die Welle — siehe die Falle unten.</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td><strong>Veraltet seit v20.0.0</strong> (so steht es im Quellcode). Nimm <code>class</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Geprüft gegen die Klasse <code>Skeleton</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-skeleton.mjs:62-97</code> und die kompilierte Input-Map bei
          <code>:116</code> (Optimus 2.0.2, <code>node_modules/&#64;openng/optimus-ui/package.json</code>). Der Veraltet-Hinweis
          ist das eigene JSDoc des Herstellers am Feld <code>styleClass</code>.
        </p>

        <h3>Die <code>animation</code>-Falle</h3>
        <p><code>animation</code> ist als freier String typisiert und wird immer nur mit einem einzigen Literal verglichen:</p>
        <pre class="code-block"><code>{{ animationSourceSnippet }}</code></pre>
        <p>
          Also rendern <code>animation="shimmer"</code>, <code>animation="pulse"</code> und <code>animation="non"</code>
          alle still die Standard-Welle. Der Tab Beispiele rendert alle drei nebeneinander — der dritte Balken ist ein
          Tippfehler und sieht genau aus wie der zweite. Wenn der Schimmer weg soll, ist die einzige Schreibweise, die
          funktioniert, <code>animation="none"</code>; wenn er für einen ganzen Teilbaum weg soll, sprich
          <code>.p-skeleton::after</code> selbst an.
        </p>

        <h3>Styling: Inline-Styles schlagen dein Stylesheet</h3>
        <p>
          <code>width</code>, <code>height</code>, <code>size</code> und <code>borderRadius</code> schreibt der Getter
          <code>containerStyle</code> in das <code>style</code>-Attribut des Elements, also kann eine CSS-Regel auf
          <code>.p-skeleton</code> sie ohne <code>!important</code> nicht ändern. Farbe und Radius-Fallback kommen aus
          Tokens und lassen sich normal überschreiben:
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> wird in <code>app.config.ts</code> gesetzt (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). Token-Namen aus <code>&#64;openng/optimus-ui-themes/dist/aura/skeleton/index.mjs</code>, deren gesamter Inhalt
          <code>borderRadius</code>, <code>background</code> und <code>animationBackground</code> je Farbschema ist —
          sonst gibt es nichts zu themen.
        </p>

        <h3>SSR</h3>
        <p>
          Das Skeleton selbst ist SSR-sicher: kein <code>window</code>, kein <code>document</code>, keine Timer. Nicht
          automatisch sicher ist der Zustand <em>drumherum</em>. Eine Komponente, die mit
          <code>loading = true</code> startet und das in einem rein browserseitigen Effect zurücksetzt, prerendert das
          Skeleton ins statische HTML, und genau das zeigen dann Suchmaschinen und der erste Paint. Lös die Daten entweder
          beim Prerendern auf oder starte aus einem Zustand, dessen Server-Render der echte Inhalt ist.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Was ein Skeleton ansagt: nichts, mit Absicht</h4>
        <p>Das Host-Binding ist kein Standard — es ist eine Konstante:</p>
        <pre class="code-block"><code>{{ ariaHostSnippet }}</code></pre>
        <p>
          Es gibt keinen Input, der es ändert, und keinen <code>pt</code>-Slot für das <code>aria-hidden</code> des Hosts,
          der das Binding überlebt. Die Folge im Accessibility Tree: <strong>{{ a11yTreeFinding }}</strong>
        </p>
        <p class="src-note">
          {{ a11yTreeNote }}
        </p>

        <h4>Wer ist also zuständig? Der Container.</h4>
        <p>
          WAI-ARIA 1.2 definiert <code>aria-busy</code> auf dem Element, <em>das gerade verändert wird</em> — der Region,
          deren Inhalt gleich ersetzt wird —, und es existiert genau dafür, dass assistive Technologien die Ansage eines
          halb aufgebauten Teilbaums aufschieben können. Dieses Element ist deine Liste, dein Karten-Grid, dein
          Artikeltext. Es ist nie der Platzhalter.
        </p>
        <pre class="code-block"><code>{{ containerSnippet }}</code></pre>
        <ul>
          <li>
            <strong><code>role="status"</code></strong> macht die Region höflich: Sie wird angesagt, wenn der Nutzer
            gerade nichts tut, und unterbricht nie. Nimm <code>role="alert"</code> nur, wenn die Wartezeit selbst ein Fehler
            ist.
          </li>
          <li>
            <strong><code>aria-busy="true"</code></strong>, solange die Platzhalter stehen, und
            <strong>entfernt</strong>, wenn der Inhalt ankommt — eine Region, die beschäftigt bleibt, ist eine Region, die
            womöglich nie angesagt wird.
          </li>
          <li>
            <strong>Ein visuell verborgener Satz</strong> gibt der Live-Region etwas zu sagen. Die Utility
            <code>.sr-only</code> ist global in <code>styles.scss</code> definiert.
          </li>
          <li>
            <strong>Sag das Ende an, nicht nur den Anfang.</strong> Wenn du den <code>.sr-only</code>-Text durch „42
            Einträge geladen“ ersetzt, wird dieselbe Region gratis zur Abschlussmeldung.
          </li>
        </ul>

        <h4>Bewegung</h4>
        <p>
          Der Schimmer ist dekorativ und endlos. Er ist hier nur deshalb unbedenklich, weil
          <code>styles.scss</code> ihn global unter <code>prefers-reduced-motion: reduce</code> neutralisiert (Tab
          Design). Wenn du diese Komponente in ein Projekt ohne diesen Catch-all übernimmst, setz
          <code>animation="none"</code> hinter der Media Query selbst — Optimus tut es nicht für dich.
        </p>

        <h4>Bekannte Lücken in Upstream und Kit — nicht still überdecken</h4>
        <ul>
          <li>
            <strong>Optimus:</strong> kein Schutz für reduzierte Bewegung im Skeleton-Stylesheet und keine Möglichkeit,
            eine ganze App aus der Welle herauszunehmen, außer mit einer globalen CSS-Regel.
          </li>
          <li>
            <strong>Optimus:</strong> <code>p-progressbar</code> gibt <code>aria-level</code> auf
            <code>role="progressbar"</code> aus, was ARIA nur auf <code>role="heading"</code> erlaubt; axe-core stuft das
            als kritisch ein. Es ist nicht optional — der Host-Block bindet <code>'[attr.aria-level]': 'value + unit'</code>
            bedingungslos, also liefert ein ungeschützter Balken so etwas wie
            <code>aria-level="36%"</code> aus. Dieselbe Komponente hat außerdem
            <strong>überhaupt keinen <code>ariaLabel</code>-Input</strong> — ihre Optimus-Input-Liste ist
            <code>value, showValue, styleClass, valueStyleClass, unit, mode, color</code>
            (<code>openng-optimus-ui-progressbar.mjs:136</code>).
            <strong>Das macht sie nicht unbenennbar</strong>, und das ist die eine Stelle, an der sich ein
            Fortschrittsbalken von einem Skeleton unterscheidet: Er ist ein echter Knoten mit <code>role="progressbar"</code>,
            also benennt ihn <code>[attr.aria-label]</code> auf dem Host — und der Name bleibt Tick für Tick erhalten,
            während <code>aria-valuenow</code> steigt; die Host-Direktive <code>Bind</code> von Optimus überschreibt ihn nie.
            Die DOM-Property-Schreibweise <code>[ariaLabel]</code> funktioniert genauso. Eine umschließende Live-Region ist
            die Alternative, nicht die einzige Möglichkeit.
          </li>
          <li>
            <strong>Kit:</strong> Die Korrektur für das ungültige Attribut ist
            <code>StripInvalidAriaDirective</code>
            (<code>src/app/directives/strip-invalid-aria.directive.ts</code>), und die Falle ist die Formulierung im eigenen
            Docstring: Eine <em>Standalone</em>-Direktive hängt sich nie „global“ an, sondern nur dort, wo eine Komponente
            sie in <code>imports</code> listet. Kit-Regel: Überall, wo du ein <code>p-progressbar</code> renderst, importier
            die Direktive in genau dieser Komponente — ein fehlender Import, und der Schutz läuft still nicht.
          </li>
          <li>
            <strong>Disziplin, kein Defekt:</strong> Die Ansage, der Fehlerzweig und der Leer-Zweig müssen auf jedem
            Bildschirm von Hand ergänzt werden, weil nichts in der Komponente danach fragt. Deshalb stehen sie in der
            Checkliste unten ganz vorn.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Die Wartezeit ist länger als die Flacker-Schwelle — sonst zeig nichts.</li>
          <li>☐ Du kannst das ankommende Layout zeichnen. Wenn nicht, ist das ein Spinner, kein Skeleton.</li>
          <li>☐ Die Box des Platzhalters entspricht der Box des echten Inhalts; du hast gemessen, nicht geraten.</li>
          <li>
            ☐ Der Container trägt <code>role="status"</code> (oder eine gleichwertige Live-Region) und
            <code>aria-busy="true"</code>, und ein visuell verborgener Satz benennt, was geladen wird.
          </li>
          <li>☐ <code>aria-busy</code> wird <strong>entfernt</strong>, wenn der Inhalt ankommt.</li>
          <li>☐ „Lädt“ kommt aus einem expliziten Schalter — nie aus <code>list.length === 0</code>.</li>
          <li>☐ Es gibt einen Fehlerzweig und einen Leer-Zweig. Das Skeleton ist nicht der Endzustand.</li>
          <li>☐ Die Zeilenbreiten variieren; der Platzhalter bildet die echte Struktur nach statt eines Stapels identischer Balken.</li>
          <li>☐ Reduzierte Bewegung wird respektiert — geprüft, nicht angenommen (Media-Feature emulieren).</li>
          <li>☐ Kein globales blockierendes Overlay deckt dieselbe Region schon ab.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die Ansage-Regel festnagelt — sie prüft, dass der
          <em>Container</em> die Semantik trägt, nicht das Skeleton, und schützt vor genau der Regression, die dieser Guide
          verhindern soll:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Das Skeleton hat keine Strings — die Wartezeit schon</h3>
        <p>
          <code>p-skeleton</code> rendert keinen Text und nimmt kein Label, also gibt es in der Komponente nichts zu
          übersetzen. Das ist eine Falle, keine Erleichterung: Der übersetzbare Teil eines Ladezustands ist der Satz, den
          du in die Live-Region schreibst, und weil die Komponente nicht danach fragt, ist es der Teil, den man vergisst.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Benenn die Sache, nicht den Vorgang.</strong> „Das Glossar wird geladen“ ist nützlich; „Lädt …“ auf
            jedem Bildschirm ist Rauschen. Nimm einen Key pro Region.
          </li>
          <li>
            <strong>Übersetz auch die Abschlussmeldung.</strong> Dieselbe Region sollte am Ende „42 Einträge geladen“
            sagen, und dieser String ist ein Plural — lös ihn über den <code>TranslationService</code> des Kits auf, statt
            eine Zahl an ein Fragment zu hängen.
          </li>
          <li>
            <strong>Binde über ein <code>computed()</code></strong>, damit ein Sprachwechsel den Text der Live-Region neu
            rendert; ein einfaches Feld wird einmal erfasst und veraltet.
          </li>
        </ul>

        <h3>Breiten: Prozente reisen mit, Pixel nicht</h3>
        <p>
          Die Maße eines Skeletons sind der eine Teil eines Ladezustands, der wirklich sprachneutral ist — aber nur, wenn
          du sie so schreibst. Ein Platzhalter mit
          <code>width="70%"</code> steht für eine deutsche Überschrift genauso wie für eine englische; ein Platzhalter mit
          <code>width="180px"</code> wurde an einer Sprache gemessen und ist in den anderen siebenundzwanzig falsch.
          Deutsch läuft 20–40 % länger als Englisch, und das ist genau die Spanne zwischen „die Box hat sich nicht bewegt“
          und „die Box hat sich bewegt“. Bevorzuge Prozente und <code>rem</code>-Höhen; heb feste Pixelbreiten für Dinge
          auf, die wirklich fest sind, etwa einen Avatar oder ein Badge.
        </p>
        <p class="src-note">
          Das verräterische Zeichen ist ein Platzhalter, dessen Breite eine runde Pixelzahl ist: <code>80px</code>,
          <code>100px</code>, <code>90px</code>. Das sind fast immer die Breiten der Chips oder Labels, die der Autor in
          einer Sprache auf dem Bildschirm hatte, und sie bewegen sich nicht, wenn der Text es tut.
        </p>

        <h3>Fortschritts-Labels sind die teuren</h3>
        <p>
          Wenn du stattdessen zu <code>p-progressbar</code> greifst, ändert sich die Form der Kosten: Ein determinierter
          Balken braucht ein Label, das eine Zahl trägt („Schritt 3 von 7“, „12 von 40 Quellen“), und solche Labels sind
          auf Plural und Wortstellung empfindlich, wie es „Lädt“ nicht ist. Das ist ein echter Grund, ein Skeleton zu
          bevorzugen, wenn die Form bekannt ist — es verlegt die Wartezeit ins Layout statt in den String-Katalog.
        </p>

        <h3>RTL: Hier ist alles in Ordnung</h3>
        <p>
          Das ausgelieferte Stylesheet definiert einen zweiten Keyframe,
          <code>p-skeleton-animation-rtl</code>, ausgewählt über <code>[dir='rtl'] .p-skeleton::after</code>, sodass der
          Schwung in einem RTL-Dokument von rechts nach links läuft, ohne Arbeit an jeder Aufrufstelle. Die Breiten sind
          Prozente und die Box ist symmetrisch, also muss sonst nichts gespiegelt werden.
        </p>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui-styles/dist/skeleton/index.mjs</code> (im Tab Design vollständig zitiert).
          <strong>Nicht durch Rendern einer RTL-Locale geprüft</strong> — das Kit liefert nur LTR-Sprachen aus, also gibt es
          hier nichts, womit man es rendern könnte.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Kontrastwerte aus den informativen Zeilen von CONTRAST.MD zitiert
            (1,13–1,23:1 hell, 1,16–1,20:1 dunkel, vier Styles); die helle Füllung korrigiert auf Auras Standard-Wert
            <code>surface.200</code>, den die Styles nicht ersetzen.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Farbtabelle als Tokens für die visuellen Styles neu gefasst (ADR-0016); die
            Verhältnisse 1,17:1 / 1,19:1 sind als auf der Standard-Palette berechnet gekennzeichnet; der Radius folgt dem
            Style; Aussage zu schmalen Bildschirmen ergänzt; Historie mit dem Neuesten zuerst sortiert.
          </li>
          <li>
            <strong>v0.5</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014): Die Entfernung von
            <code>styleClass</code> in v22 ist rückgängig gemacht — Optimus liefert es wieder als <code>&#64;deprecated</code>-Input
            aus, den der Host tatsächlich liest, also sind es <strong>sieben Inputs</strong>, und sie sind einfache
            <code>&#64;Input()</code>-Properties statt Signal-Inputs (<code>containerStyle</code> ist ein Getter, kein
            Computed). <code>p-progressSpinner</code>/<code>p-progress-spinner</code> sind wieder gültige Selektoren.
            Zeilenverweise gegen die Optimus-Bundles neu abgeleitet (Standardwerte :72/:77/:92/:97, Host-Block :128-133,
            <code>aria-hidden</code> :129 unverändert); die Aura-Tokens haben wieder ihre 2.x-Werte, also die hier schon
            gemessenen, daher gelten die Farb- und Radiuswerte weiter und wurden nicht neu gemessen.
          </li>
          <li>
            <strong>v0.4</strong> — 24.08.2026 — Erneut gegen PrimeNG 22.1.2 / Aura 3.0 geprüft:
            <code>styleClass</code> entfernt (jetzt sechs Inputs; ein übrig gebliebenes statisches
            <code>styleClass="…"</code>-Attribut am Spinner-Beispiel dieser Seite war still wirkungslos und wurde
            entfernt); <code>aria-hidden</code>-Host-Binding, Standardwerte, die Sonderbehandlung von
            <code>animation</code> und die Rangfolge bei der Größe alle im 22er-Quellcode mit frischen Zeilenverweisen
            erneut bestätigt. Farbmessungen aus 21 gelten weiter — die Skeleton-Tokens sind unverändert.
          </li>
          <li>
            <strong>v0.3</strong> — 20.08.2026 — WCAG-2.2-Status-Zusammenfassung im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.2</strong> — 30.07.2026 — Inventare pro Bildschirm durch die Regeln ersetzt, für die sie Belege
            waren; der Abschnitt zu Abstandsklassen als allgemeine Falle neu geschrieben; toter ADR-Verweis durch die
            Begründung ersetzt, für die er stand.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erster Guide: die Entscheidungstabelle für Ladezustände (Skeleton /
            Spinner / Fortschrittsbalken / nichts), ein Playground, dessen Ladezustand selbst ein Bedienelement ist, ein
            Live-Vergleich in vier Panels mit derselben Wartezeit von 2,5 s, vier gerenderte Do/Don’t-Paare und das
            kanonische Agent-Dokument.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class SkeletonArticleDeComponent extends SkeletonArticleComponent {
  override readonly shapeOptions = [
    { label: 'Rechteck', value: 'rectangle' },
    { label: 'Kreis', value: 'circle' },
  ];

  override readonly animationOptions = [
    { label: 'wave (Standard)', value: 'wave' },
    { label: 'none', value: 'none' },
  ];

  override readonly radiusOptions = [
    { label: 'Theme-Standard', value: '' },
    { label: '0 — scharfkantig', value: '0' },
    { label: '12px', value: '12px' },
    { label: '999px — Pille', value: '999px' },
  ];

  override readonly shiftNote: string =
    'Höhen gelesen mit getBoundingClientRect() bei 16px Root-Schriftgröße: 16 -> 72 für das ' +
    'unpassende Paar, 72 -> 72 für das passende. Das passende Paar ist Arithmetik, kein ' +
    'Augenmaß: 3 Balken x 1rem + 2 Abstände x 0.75rem ergibt 3 Textzeilen x 1.5rem Zeilenhöhe. ' +
    'Änderst du die Typo-Skala, musst du die Summe neu rechnen.';

  override readonly measuredDefaultHeight: string = '16px (100% x 1rem: 416 x 16 in einem 1280px-Viewport)';
  override readonly computedBgLight: string = 'Auras Standard-surface.200 (slate.200 #e2e8f0) in jedem Style';
  override readonly computedBgDark: string = '6 % Weiß, über die Fläche darunter komponiert';
  override readonly contrastLight: string = '1,13–1,23';
  override readonly contrastDark: string = '1,16–1,20';
  override readonly tokenRadius: string = '{content.border.radius} (Aura 6px; 0 im Standard-Visual-Style)';
  override readonly contrastNote: string =
    'Token-Werte aus @openng/optimus-ui-themes/dist/aura/skeleton/index.mjs — die ganze Datei ' +
    'besteht aus drei Werten: Der helle Hintergrund löst {surface.200} auf, der dunkle ist fest verdrahtetes ' +
    '6 % Weiß. {surface.200} ist Auras eigene Skala, die die visuellen Styles nicht ersetzen; die ' +
    'Seitenflächen sind die des Kits, vom ThemeService aus dem aktiven Style geschrieben. Der dunkle ' +
    'Wert ist der komponierte: Ein durchscheinender Platzhalter sieht auf dem Papier besser aus als auf dem ' +
    'Bildschirm. Die Spannen (1,13–1,23:1 hell, 1,16–1,20:1 dunkel, über die vier Styles) sind die ' +
    'informativen „skeleton“-Zeilen von docs/generated/CONTRAST.MD, bei jedem Build vom Kontrast-Gate ' +
    'neu erzeugt. VORBEHALT: Die Zahlen sind informativ, kein ' +
    'WCAG-Ergebnis. Ein Skeleton ist aria-hidden-Dekoration ohne Text und ohne Bedeutung, also ' +
    'gelten SC 1.4.3 und SC 1.4.11 dafür nicht. Sie werden zitiert, weil ein Platzhalter, den du ' +
    'nicht sehen kannst, ein Platzhalter ist, der seine Aufgabe nicht erfüllt.';

  override readonly motionNote: string =
    "Gelesen aus getComputedStyle(el, '::after').animationDuration und " +
    '.animationIterationCount an einem gerenderten Skeleton, einmal pro emuliertem Wert des Media-' +
    'Features. Der reduzierte Wert ist die CSSOM-Serialisierung der 0.01ms des Kits; der ' +
    'Befund ist nicht die genaue Zahl, sondern dass es nicht 1.2s ist und dass der Schimmer einmal ' +
    'statt endlos läuft. Ohne den globalen Catch-all würden beide Zeilen 1.2s / infinite zeigen, ' +
    'weil das ausgelieferte Skeleton-Stylesheet überhaupt keinen prefers-reduced-motion-Block enthält. ' +
    'Prüf das, indem du das Media-Feature emulierst und die berechnete animation-duration liest — ' +
    'das CSS zu lesen sagt dir nicht, welche Regel gewonnen hat. Dieselbe Messung klärt auch den ' +
    'animation-Input: animation="none" ergibt animation-name "none" (das Element trägt ' +
    '.p-skeleton-animation-none), während animation="shimmer" ' +
    'p-skeleton-animation 1.2s ergibt — identisch mit dem unberührten Standard.';

  override readonly a11yTreeFinding: string =
    'Ein Snapshot mit einem <p-skeleton> als Wurzel liefert null. Das Element ist nicht im Baum, und ' +
    'nichts darin ist es; die umschließende Status-Region dagegen erscheint mit ihrem ' +
    '.sr-only-Satz als Namen.';
  override readonly a11yTreeNote: string =
    'Der Mechanismus ist das oben zitierte Host-Binding, keine Heuristik: aria-hidden="true" ' +
    'entfernt das Element und alle seine Nachfahren, weshalb auch ein Label oder eine Rolle, die du ' +
    'einem Skeleton gibst, nie auftauchen kann. Um es in deinem eigenen Build zu bestätigen, nimm einen ' +
    'Snapshot des Accessibility Tree mit dem Platzhalter als Wurzel und noch einmal mit seinem Container.';

  override readonly examples: SkeletonArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));
}
