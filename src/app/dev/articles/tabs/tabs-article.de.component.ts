import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TabsArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './tabs-article.component';

/** German counterparts of the English TAB_LABELS, same order (playground and overflow demos). */
const TAB_LABELS_DE = [
  'Übersicht',
  'Aktivität',
  'Einstellungen',
  'Mitglieder',
  'Abrechnung',
  'Integrationen',
  'Webhooks',
  'Audit-Log',
  'Gefahrenzone',
];

/** Prose of the examples in German; id and code come from the English base. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  basic: {
    title: 'Drei Ansichten eines Datensatzes',
    note: 'Die Grundform. Fünf Elemente, ein Wert, und die ARIA-Verdrahtung wird für dich generiert.',
  },
  disabled: {
    title: 'Ein deaktivierter Tab',
    note: 'Von den Pfeiltasten übersprungen, aus der Tab-Reihenfolge genommen, trotzdem als deaktiviert angesagt.',
  },
  overflow: {
    title: 'So sieht Overflow aus',
    note: 'Neun Tabs in einer 22rem breiten Spalte. Die Leiste scrollt mit verborgener Scrollbar; die Chevrons sind der einzige Hinweis darauf.',
  },
  icons: {
    title: 'Icons und Zahlen in einer Beschriftung',
    note: 'Ein Tab projiziert beliebigen Inhalt — und das heißt, alles davon wird zum zugänglichen Namen.',
  },
};

/**
 * German twin of the Tabs guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (measured
 * values, tab labels, tablist names, example prose, the panel readout) are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs tabs`).
 */
@Component({
  selector: 'app-tabs-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tabs'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Du liest das hier in einem Tab. Die Leiste oben ist <em>kein</em> <code>p-tabs</code> — sie ist handgeschriebenes
          Markup in <code>article-shell.component.ts</code>, und der Tab Design vergleicht die beiden Umsetzungen
          Attribut für Attribut. Alles darunter ist die echte Optimus-UI-Komponente: die neue <code>p-tabs</code>-Familie,
          die <code>TabView</code> abgelöst hat.
        </p>

        <!-- Mini playground: live-configure a tab set and read back the markup. -->
        <section class="pg" aria-label="Tabs-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Konfigurieren</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-count-label">Anzahl der Tabs</span>
                <p-select
                  [ariaLabelledBy]="'pg-count-label'"
                  size="small"
                  [options]="countOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgCount()"
                  (ngModelChange)="onCountChange($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-lazy">Panels lazy laden</label>
                <p-toggleswitch inputId="pg-lazy" [ngModel]="pgLazy()" (ngModelChange)="pgLazy.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-sof">Bei Fokus aktivieren</label>
                <p-toggleswitch
                  inputId="pg-sof"
                  [ngModel]="pgSelectOnFocus()"
                  (ngModelChange)="pgSelectOnFocus.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-scrollable">Scrollbar</label>
                <p-toggleswitch
                  inputId="pg-scrollable"
                  [ngModel]="pgScrollable()"
                  (ngModelChange)="pgScrollable.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-navigators">Navigationspfeile zeigen</label>
                <p-toggleswitch
                  inputId="pg-navigators"
                  [ngModel]="pgNavigators()"
                  (ngModelChange)="pgNavigators.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Dritten Tab deaktivieren</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau — probier die Pfeiltasten</span>
              <div class="pg__stage" id="pg-stage">
                <p-tabs
                  [value]="pgValue()"
                  (valueChange)="onPgValue($event)"
                  [lazy]="pgLazy()"
                  [selectOnFocus]="pgSelectOnFocus()"
                  [scrollable]="pgScrollable()"
                  [showNavigators]="pgNavigators()"
                >
                  <p-tablist [pt]="pgTablistPt">
                    @for (t of pgTabs(); track t.value) {
                      <p-tab [value]="t.value" [disabled]="pgDisabled() && t.value === 2">
                        {{ t.label }}
                      </p-tab>
                    }
                  </p-tablist>
                  <p-tabpanels>
                    @for (t of pgTabs(); track t.value) {
                      <p-tabpanel [value]="t.value">
                        <p class="panel-body">
                          <span class="panel-marker" data-panel-marker>{{ t.label }}</span>
                          — dieser Absatz steht erst im DOM, wenn sein Panel gerendert wurde. Schalte „Panels lazy laden“
                          um und drück „Gerenderte Panels zählen“, um das zu beobachten.
                        </p>
                      </p-tabpanel>
                    }
                  </p-tabpanels>
                </p-tabs>
              </div>
              <div class="pg__readout">
                <button type="button" class="copy-btn" (click)="countPanels()">Gerenderte Panels zählen</button>
                <span class="pg__readout-value">{{ panelReadout() }}</span>
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
          <p class="src-note">
            Die Anzeige zählt die <code>[data-panel-marker]</code>-Elemente in der Bühne — eines je
            <em>gerendertem</em> Panel-Inhalt, nicht je <code>&lt;p-tabpanel&gt;</code>-Host (die Hosts gibt es immer; nur
            ihr Inhalt ist bedingt).
          </p>
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
                  <p-tabs [value]="exBasic()" (valueChange)="setNum(exBasic, $event)">
                    <p-tablist [pt]="basicPt">
                      <p-tab [value]="0">Übersicht</p-tab>
                      <p-tab [value]="1">Aktivität</p-tab>
                      <p-tab [value]="2">Einstellungen</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                      <p-tabpanel [value]="0" tabindex="0">
                        <p class="panel-body">
                          Drei Ansichten eines Datensatzes. Das Panel behält seine Scrollposition und seinen Formularzustand,
                          während du weg- und zurückwechselst. Dieses Panel trägt <code>tabindex="0"</code> — drück Tab auf
                          dem aktiven Tab, und der Fokus landet hier, wie es die APG verlangt.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="1" tabindex="0">
                        <p class="panel-body">
                          Nichts hier ist eine andere <em>Seite</em> — es ist derselbe Datensatz, aus einem anderen Winkel.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="2" tabindex="0">
                        <p class="panel-body">
                          Braucht ein Panel eine eigene URL, ist es eine Route, kein Tab. Siehe den Tab Verwendung.
                        </p>
                      </p-tabpanel>
                    </p-tabpanels>
                  </p-tabs>
                }
                @case ('disabled') {
                  <p-tabs [value]="exDisabled()" (valueChange)="setNum(exDisabled, $event)">
                    <p-tablist [pt]="disabledPt">
                      <p-tab [value]="0">Entwurf</p-tab>
                      <p-tab [value]="1" [disabled]="true">Prüfung</p-tab>
                      <p-tab [value]="2">Verlauf</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                      <p-tabpanel [value]="0">
                        <p class="panel-body">
                          Geh mit den Pfeiltasten an „Prüfung“ vorbei — der deaktivierte Tab wird von <code>findNextTab</code>
                          übersprungen, nicht bloß unklickbar gemacht.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="1"><p class="panel-body">Unerreichbar.</p></p-tabpanel>
                      <p-tabpanel [value]="2">
                        <p class="panel-body">
                          Auch ein deaktivierter Tab rendert seinen Panel-Inhalt ins DOM, sofern nicht die ganze Gruppe
                          <code>[lazy]</code> ist.
                        </p>
                      </p-tabpanel>
                    </p-tabpanels>
                  </p-tabs>
                }
                @case ('overflow') {
                  <div class="narrow">
                    <p-tabs [value]="exOverflow()" (valueChange)="setNum(exOverflow, $event)">
                      <p-tablist [pt]="overflowPt">
                        @for (t of manyTabs; track t.value) {
                          <p-tab [value]="t.value">{{ t.label }}</p-tab>
                        }
                      </p-tablist>
                      <p-tabpanels>
                        @for (t of manyTabs; track t.value) {
                          <p-tabpanel [value]="t.value">
                            <p class="panel-body">
                              Panel {{ t.label }}. Neun Beschriftungen in einer 22rem breiten Spalte: Die Leiste scrollt,
                              und zwei Chevron-Buttons erscheinen.
                            </p>
                          </p-tabpanel>
                        }
                      </p-tabpanels>
                    </p-tabs>
                  </div>
                }
                @case ('icons') {
                  <p-tabs [value]="exIcons()" (valueChange)="setNum(exIcons, $event)">
                    <p-tablist [pt]="iconsPt">
                      <p-tab [value]="0">
                        <i class="pi pi-file" aria-hidden="true"></i>
                        <span>Dokument</span>
                      </p-tab>
                      <p-tab [value]="1">
                        <i class="pi pi-comments" aria-hidden="true"></i>
                        <span>Kommentare</span>
                        <span class="count-chip">4</span>
                      </p-tab>
                    </p-tablist>
                    <p-tabpanels>
                      <p-tabpanel [value]="0">
                        <p class="panel-body">
                          Ein Tab ist ein Slot für Content Projection, also passt beliebiges Markup hinein — aber alles
                          zusammen wird zum zugänglichen Namen des Tabs.
                        </p>
                      </p-tabpanel>
                      <p-tabpanel [value]="1">
                        <p class="panel-body">
                          Dieser Tab wird als „Kommentare 4“ angesagt. Dekorative Icons brauchen <code>aria-hidden</code>,
                          Zahlen müssen sich als Wörter lesen lassen.
                        </p>
                      </p-tabpanel>
                    </p-tabpanels>
                  </p-tabs>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Tabs, Accordion, Stepper oder Routen? Die ehrliche Tabelle</h3>
        <p>
          Alle vier zeigen eine Sache auf einmal. Sie unterscheiden sich darin, <strong>wer die Reihenfolge bestimmt</strong>,
          <strong>ob zwei Abschnitte gleichzeitig offen sein können</strong> und
          <strong>ob die Wahl ein Neuladen oder einen geteilten Link übersteht</strong>. Beantworte diese drei, und das
          Bedienelement wählt sich von selbst.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Beziehung</th>
                <th>Gleichzeitig offen</th>
                <th>Reihenfolge</th>
                <th>In der URL</th>
                <th>Smartphone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-tabs</code></td>
                <td><strong>Parallele Ansichten EINES Themas</strong> — derselbe Datensatz, anderer Blickwinkel.</td>
                <td>genau einer</td>
                <td>frei, beliebige Reihenfolge</td>
                <td><strong>nein</strong> — das verdrahtest du selbst (siehe unten)</td>
                <td>
                  Eine waagerechte Leiste; ab etwa 4 kurzen Beschriftungen scrollt sie seitwärts, und die Tabs außerhalb
                  des Bildschirms existieren für den Leser nicht mehr.
                </td>
              </tr>
              <tr>
                <td><code>p-accordion</code></td>
                <td>Überfliegbare <strong>Abschnitte einer Spalte</strong> — eine lange Seite, zusammengefaltet.</td>
                <td><strong>mehrere</strong>, mit <code>[multiple]="true"</code></td>
                <td>frei</td>
                <td>nein</td>
                <td>Passt am besten: Jeder Header ist eine Zeile in voller Breite, und nichts liegt außerhalb des Bildschirms.</td>
              </tr>
              <tr>
                <td><code>p-stepper</code></td>
                <td>Etappen <strong>einer Aufgabe</strong> mit Anfang und Ende.</td>
                <td>einer</td>
                <td><strong>erzwungen</strong> — du darfst Schritt n+1 an Schritt n koppeln</td>
                <td>nein (außer du gibst jedem Schritt eine Route)</td>
                <td>Es gibt eine vertikale Variante; die Fortschrittsanzeige ist der eigentliche Sinn.</td>
              </tr>
              <tr>
                <td>Routen / getrennte Seiten</td>
                <td>Ansichten, die ein Nutzer <strong>verlinken, als Lesezeichen speichern, neu laden oder in einem neuen Tab öffnen</strong> will.</td>
                <td>eine je URL</td>
                <td>frei</td>
                <td><strong>ja</strong> — genau darum geht es</td>
                <td>Wie jede Seite; der Zurück-Button funktioniert, was er bei Tabs nie tut.</td>
              </tr>
              <tr>
                <td>keins davon</td>
                <td>Abschnitte, die ein Leser <strong>vergleichen oder durchsuchen</strong> will.</td>
                <td>alle</td>
                <td>Lesereihenfolge</td>
                <td>Anker</td>
                <td>Einfach untereinander stellen. Scrollen ist billig; das Suchen in fünf Tabs nicht.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> Die Spalten „Gleichzeitig offen“, „Reihenfolge“ und „In der
          URL“ beschreiben Verhalten, gelesen aus den Optimus-UI-Quellen in <code>node_modules</code> und an den
          gerenderten Beispielen geprüft. Die Empfehlungen sind eine <em>Einschätzung</em>: Die Zeilen zu Accordion und
          Stepper sind aus der Bibliothek dokumentiert, und die vier Fragen unten zeigen, wie dieses Kit zwischen ihnen
          entscheidet.
        </p>

        <h3>Vier Fragen, bevor du zu einer Tab-Gruppe greifst</h3>
        <ul>
          <li>
            <strong>Würde ein Nutzer je zwei Panels nebeneinander sehen wollen?</strong> Wenn ja, sind Tabs falsch — sie
            machen jeden Vergleich zur Gedächtnisübung.
          </li>
          <li>
            <strong>Muss die Wahl ein Neuladen, ein Lesezeichen oder einen eingefügten Link überstehen?</strong> Dann
            gehört der Zustand in die URL. Tabs halten ihn in einem Signal der Komponente, das mit der Seite stirbt; eine
            Route hält ihn in der Adressleiste. Das Do/Don’t unten zeigt den Mittelweg — eine Tab-Gruppe, deren Wert in
            einen Query-Parameter gespiegelt wird.
          </li>
          <li>
            <strong>Gibt es eine Reihenfolge, die der Nutzer nicht brechen darf?</strong> Das ist ein Stepper. Tabs laden
            zum Herumspringen ein, und eine Tab-Leiste kann „noch nicht“ nicht ausdrücken.
          </li>
          <li>
            <strong>Muss der Inhalt auffindbar sein?</strong> Panel-Inhalt in einem verborgenen Tab überspringt die
            Suche im Browser ebenso wie der Druck. Wenn Leute diesen Inhalt durchsuchen oder drucken, stell ihn
            untereinander oder nimm ein Accordion, das sie öffnen können.
          </li>
        </ul>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Tabs für Abschnitte, die man überfliegt</span>
            <div class="dd__stage">
              <p-tabs [value]="ddScanTab()" (valueChange)="setNum(ddScanTab, $event)">
                <p-tablist [pt]="scanPt">
                  <p-tab [value]="0">Kosten</p-tab>
                  <p-tab [value]="1">Latenz</p-tab>
                  <p-tab [value]="2">Datenschutz</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="0"><p class="panel-body">Etwa 0,02 € pro Anfrage.</p></p-tabpanel>
                  <p-tabpanel [value]="1"><p class="panel-body">Rund 800 ms bis zum ersten Token.</p></p-tabpanel>
                  <p-tabpanel [value]="2"><p class="panel-body">Die Daten bleiben in der EU.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              Drei Fakten, die ein Leser <em>gegeneinander</em> abwägen will, und das Bedienelement lässt ihn genau einen
              sehen. Strg+F findet keinen der beiden verborgenen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Accordion, das sich gleichzeitig öffnen lässt</span>
            <div class="dd__stage">
              <p-accordion [value]="ddScanPanels()" [multiple]="true" (valueChange)="onScanPanels($event)">
                <p-accordion-panel [value]="0">
                  <p-accordion-header>Kosten</p-accordion-header>
                  <p-accordion-content><p class="panel-body">Etwa 0,02 € pro Anfrage.</p></p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="1">
                  <p-accordion-header>Latenz</p-accordion-header>
                  <p-accordion-content><p class="panel-body">Rund 800 ms bis zum ersten Token.</p></p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel [value]="2">
                  <p-accordion-header>Datenschutz</p-accordion-header>
                  <p-accordion-content><p class="panel-body">Die Daten bleiben in der EU.</p></p-accordion-content>
                </p-accordion-panel>
              </p-accordion>
            </div>
            <p class="dd__why">
              <code>[multiple]="true"</code> lässt alle drei offen stehen, in einer Spalte, in Lesereihenfolge — und auf
              dem Smartphone liegt nichts seitlich außerhalb des Bildschirms.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Wahl, die der Nutzer nicht teilen kann</span>
            <div class="dd__stage">
              <p-tabs [value]="ddPlainTab()" (valueChange)="setStr(ddPlainTab, $event)">
                <p-tablist [pt]="plainPt">
                  <p-tab [value]="'chart'">Diagramm</p-tab>
                  <p-tab [value]="'table'">Tabelle</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="'chart'"><p class="panel-body">Diagrammansicht.</p></p-tabpanel>
                  <p-tabpanel [value]="'table'"><p class="panel-body">Tabellenansicht.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              Wechsle zu Tabelle, kopier die Adresse, schick sie einem Kollegen: Er bekommt das Diagramm. Neu laden: Du
              bekommst das Diagramm. Der Zustand lebt in einem Signal und stirbt mit der Seite.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — spiegel den Wert in die URL</span>
            <div class="dd__stage">
              <p-tabs [value]="urlTab()" (valueChange)="onUrlTab($event)">
                <p-tablist [pt]="urlPt">
                  <p-tab [value]="'chart'">Diagramm</p-tab>
                  <p-tab [value]="'table'">Tabelle</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="'chart'"><p class="panel-body">Diagrammansicht.</p></p-tabpanel>
                  <p-tabpanel [value]="'table'"><p class="panel-body">Tabellenansicht.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              Live: Ein Wechsel schreibt <code>?view=…</code> in die Adressleiste (<code>replaceUrl</code>, damit der
              Zurück-Button nicht zugemüllt wird), und der Startwert wird aus der Route zurückgelesen. Probier es aus, dann
              lade neu.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Tablist am Host benennen</span>
            <div class="dd__stage">
              <p-tabs [value]="ddNameBad()" (valueChange)="setNum(ddNameBad, $event)">
                <p-tablist aria-label="Berichtsansichten">
                  <p-tab [value]="0">Zusammenfassung</p-tab>
                  <p-tab [value]="1">Detail</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="0"><p class="panel-body">Zusammenfassung.</p></p-tabpanel>
                  <p-tabpanel [value]="1"><p class="panel-body">Detail.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              <code>role="tablist"</code> sitzt auf einem inneren <code>div</code>, nicht auf <code>&lt;p-tablist&gt;</code>.
              Im Accessibility Tree hat diese Tablist <strong>überhaupt keinen Namen</strong> — das
              Attribut ist auf einem Wrapper ohne Rolle gelandet.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — benenn sie über [pt]</span>
            <div class="dd__stage">
              <p-tabs [value]="ddNameGood()" (valueChange)="setNum(ddNameGood, $event)">
                <p-tablist [pt]="namedTablistPt">
                  <p-tab [value]="0">Zusammenfassung</p-tab>
                  <p-tab [value]="1">Detail</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel [value]="0"><p class="panel-body">Zusammenfassung.</p></p-tabpanel>
                  <p-tabpanel [value]="1"><p class="panel-body">Detail.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              Der Pass-through-Input setzt das Attribut auf das Element, das die Rolle wirklich trägt. Gemessener Name:
              <strong>„Berichtsansichten“</strong>. Er muss allerdings auf <code>&lt;p-tablist&gt;</code> sitzen —
              <code>pt</code> wird nicht vererbt, also ließe dich dasselbe Objekt auf <code>&lt;p-tabs&gt;</code> mit
              der Zelle links zurück. Eine Tablist pro Seite kommt ohne Namen aus; zwei nicht.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Leiste, die niemand lesen kann</span>
            <div class="dd__stage">
              <div class="narrow">
                <p-tabs [value]="ddManyTab()" (valueChange)="setNum(ddManyTab, $event)">
                  <p-tablist [pt]="manyPt">
                    @for (t of manyTabs; track t.value) {
                      <p-tab [value]="t.value">{{ t.label }}</p-tab>
                    }
                  </p-tablist>
                  <p-tabpanels>
                    @for (t of manyTabs; track t.value) {
                      <p-tabpanel [value]="t.value"
                        ><p class="panel-body">{{ t.label }}</p></p-tabpanel
                      >
                    }
                  </p-tabpanels>
                </p-tabs>
              </div>
            </div>
            <p class="dd__why">
              Neun Tabs in einer schmalen Spalte. Die meisten Wahlmöglichkeiten liegen hinter einem Chevron außerhalb des
              Bildschirms, und übersetzte Beschriftungen machen es schlimmer, nicht besser.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — weniger Tabs oder ein anderes Bedienelement</span>
            <div class="dd__stage">
              <div class="narrow">
                <p-tabs [value]="ddFewTab()" (valueChange)="setNum(ddFewTab, $event)">
                  <p-tablist [pt]="fewPt">
                    <p-tab [value]="0">Übersicht</p-tab>
                    <p-tab [value]="1">Details</p-tab>
                    <p-tab [value]="2">Protokoll</p-tab>
                  </p-tablist>
                  <p-tabpanels>
                    <p-tabpanel [value]="0"><p class="panel-body">Alles auf einen Blick.</p></p-tabpanel>
                    <p-tabpanel [value]="1"><p class="panel-body">Die ausführliche Fassung.</p></p-tabpanel>
                    <p-tabpanel [value]="2"><p class="panel-body">Was wann passiert ist.</p></p-tabpanel>
                  </p-tabpanels>
                </p-tabs>
              </div>
            </div>
            <p class="dd__why">
              Drei Beschriftungen passen in 22rem, mit Luft. Hat der Inhalt wirklich neun Teile, braucht er eine Seitenleiste,
              ein <code>p-select</code> oder neun Routen — nicht neun Tabs.
            </p>
          </div>
        </div>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Tabs pattern</a
            >
            — der Vertrag aus Rollen und Zuständen (<code>tablist</code>, <code>tab</code>, <code>tabpanel</code>,
            <code>aria-selected</code>, <code>aria-controls</code>) und die Tastaturbelegung, an der dieser Guide die
            Bibliothek prüft, Taste für Taste.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — APG, Tabs with Manual Activation</a
            >
            — die Referenzumsetzung des Modus, den Optimus standardmäßig ausliefert, samt der Regel, dass das Tab-Panel
            <code>tabindex="0"</code> bekommt, wenn es kein fokussierbares Element enthält (Optimus tut das nicht — siehe
            Entwicklung).
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Accordion pattern</a
            >
            — das Gegenmuster in der Entscheidungstabelle: Header sind Buttons mit
            <code>aria-expanded</code>, und mehrere Bereiche dürfen gleichzeitig offen sein.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — das Kriterium hinter der Messung des Fokus-Rings im Tab Design; ein Roving Tabindex macht den
            Fokusindikator zum einzigen Hinweis, wo du gerade bist.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — die Untergrenze von 24 × 24 CSS-Pixeln, an der die gemessenen Tab-Boxen geprüft werden.
          </li>
          <li>
            <a href="https://optimus.openng.org/tabs/" target="_blank" rel="noopener noreferrer"> Optimus UI — Tabs component</a>
            — die API-Oberfläche des Herstellers für die Struktur nach TabView; jede Aussage hier wurde erneut an der
            ausgelieferten <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tabs.mjs</code> geprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie — fünf Elemente, und die Rolle sitzt nicht, wo du sie vermutest</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <ul>
          <li>
            <strong><code>p-tabs</code></strong> — der Zustandshalter. Wird gerendert als
            <code>&lt;p-tabs class="p-tabs p-component" id="pn_id_N"&gt;</code>, eine Flex-Spalte. Ihm gehört
            <code>value</code>, und seine generierte <code>id</code> ist das Präfix jeder Kind-ID.
          </li>
          <li>
            <strong><code>p-tablist</code></strong> — ein Wrapper mit <code>overflow: hidden</code>. Darin: ein
            optionaler Zurück-Button, ein scrollendes <code>div.p-tablist-content.p-tablist-viewport</code> und darin ein
            inneres <code>div.p-tablist-tab-list</code>, das
            <strong><code>role="tablist"</code></strong> trägt (:411). PrimeNG 22 hatte diese Ebene weggeglättet; Optimus
            behält sie, deshalb heißt der Pass-through-Abschnitt <code>tabList</code>, nicht <code>content</code>.
          </li>
          <li>
            <strong><code>p-tab</code></strong> — ein Custom Element, <em>kein</em> <code>&lt;button&gt;</code>, mit
            <code>role="tab"</code>, <code>id</code>, <code>aria-controls</code>, <code>aria-selected</code>,
            <code>aria-disabled</code>, <code>data-p-active</code> und einem Roving <code>tabindex</code>.
          </li>
          <li>
            <strong>der Aktiv-Balken</strong> — <code>span.p-tablist-active-bar</code>, <code>role="presentation"</code>,
            ein Geschwister der Tabs innerhalb der Tablist. Breite und Versatz werden bei jedem Wertwechsel per
            JavaScript geschrieben.
          </li>
          <li>
            <strong><code>p-tabpanels</code> / <code>p-tabpanel</code></strong> — <code>role="presentation"</code> und
            <code>role="tabpanel"</code>. Das inaktive Panel behält das schlichte HTML-Attribut <code>hidden</code>.
          </li>
        </ul>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tabs.mjs</code> (das Template der TabList in 403-408 mit
          <code>role="tablist"</code> auf dem inneren div in 404 und dem Inkbar-span in 406; die Host-Bindings von Tab in
          683-693; die von TabPanel in 818-825; die von TabPanels in 884-887) und am gerenderten Baum des
          Playgrounds oben bestätigt.
        </p>

        <h3>Tokens — Aura liefert das eine, dieses Kit rendert etwas anderes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teil</th>
                <th>Token-Ebene von Aura</th>
                <th>Was dieses Kit tatsächlich rendert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tab-Padding</td>
                <td><code>1rem 1.125rem</code></td>
                <td>
                  <strong>0.75rem 1rem</strong> — die Regel <code>.p-tabs .p-tab</code> des Kits ersetzt es (gemessen: 12px
                  16px).
                </td>
              </tr>
              <tr>
                <td>Tab-Rahmen</td>
                <td>
                  <code>tab.borderWidth</code> ist <code>0 0 1px 0</code>, Rahmenfarbe <code>content.border.color</code>,
                  <code>activeBorderColor</code> <code>primary.color</code> — die Unterstreichung von Aura 2.x ist zurück
                  (PrimeNG 22 / Aura 3.0 hatte sie auf null gesetzt); der gleitende Aktiv-Balken ist eine zweite Markierung
                  von 1px bei <code>bottom: -1px</code>
                </td>
                <td>
                  <code>border: none</code> plus ein ausdrückliches <code>border-bottom: 2px solid transparent</code> und
                  <code>margin-bottom: -1px</code> — eine Unterstreichung von <strong>2px</strong>, nicht 1px.
                </td>
              </tr>
              <tr>
                <td>Tab-Farbe</td>
                <td>
                  Ruhe <code>&#123;text.muted.color&#125;</code>, aktiv <code>&#123;primary.color&#125;</code>, Hover
                  <code>&#123;text.color&#125;</code>
                </td>
                <td>
                  Ruhe <code>var(--text-color-secondary)</code>, aktiv <code>var(--primary-color-fg)</code>. Hover ist
                  der von Aura — das Kit liefert keine Hover-Regel, siehe den Hinweis zur Kaskade unten.
                </td>
              </tr>
              <tr>
                <td>Tab-font-weight</td>
                <td><code>600</code></td>
                <td>Unverändert — die Kit-Regel rührt sie nicht an.</td>
              </tr>
              <tr>
                <td>Tablist-Hintergrund / -Rahmen</td>
                <td><code>&#123;content.background&#125;</code>, border-width <code>0 0 1px 0</code></td>
                <td>
                  <code>background: transparent</code> und ein eigenes
                  <code>border-bottom: 1px solid var(--surface-border)</code> auf <code>.p-tabs .p-tablist</code>.
                </td>
              </tr>
              <tr>
                <td>Panel-Padding</td>
                <td><code>0.875rem 1.125rem 1.125rem 1.125rem</code> auf dem Panel, plus ein Panel-Hintergrund</td>
                <td>
                  <code>background: transparent</code> auf beiden, und das Padding vom Kit aufgeteilt: <code>0</code> auf
                  <code>.p-tabs .p-tabpanels</code>, <code>1rem 0</code> auf <code>.p-tabs .p-tabpanel</code> — der Inhalt
                  schließt bündig mit der Seite ab.
                </td>
              </tr>
              <tr>
                <td>Aktiv-Balken</td>
                <td>
                  Höhe <code>1px</code>, <code>inset-block-end: -1px</code>, Hintergrund
                  <code>&#123;primary.color&#125;</code>, Transition <code>250ms cubic-bezier(0.35,0,0.25,1)</code>
                </td>
                <td>
                  <strong>Unterdrückt.</strong> <code>.p-tabs .p-tablist-active-bar</code> ist <code>display: none</code>,
                  also ist der 2px-Rahmen des Kits die einzige Markierung. Warum, steht im Hinweis unten.
                </td>
              </tr>
              <tr>
                <td>Fokus-Ring</td>
                <td>
                  <code>&#123;focus.ring.*&#125;</code> (1px) bei Offset <code>-1px</code> auf
                  <code>.p-tab:not(.p-disabled):focus-visible</code>
                </td>
                <td>
                  <strong>Ersetzt.</strong> Der eine Ring des Kits — 2px <code>--primary-color-fg</code>, innerhalb des
                  Tabs bei Offset <code>-2px</code> gezeichnet, weil die Leiste in einem Overflow-Container scrollt, der
                  einen äußeren Ring abschneiden würde.
                </td>
              </tr>
              <tr>
                <td>Navigations-Button</td>
                <td>Breite <code>2.5rem</code>, absolut positioniert, mit einem breiten box-shadow-Verlauf über dem Leistenrand</td>
                <td>Unverändert, außer dass sein Fokus-Ring derselbe innenliegende Kit-Ring ist.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura-Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/tabs/index.mjs</code>; Basis-CSS (einschließlich
          <code>.p-tablist-viewport &#123; overflow-x: auto &#125;</code> und der <code>:focus-visible</code>-Regeln)
          aus <code>&#64;openng/optimus-ui-styles/dist/tabs/index.mjs</code>. Die Overrides des Kits stammen aus dem
          Block in <code>styles.scss</code> mit der Überschrift „Optimus UI Tabs Component (v18+) - Global Overrides / Ensures
          consistent styling after migration from TabView“.
        </p>

        <h3>Gerenderte Werte (Aura plus das Stylesheet des Kits)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tab-Box („Overview“ der englischen Fassung)</td>
                <td>
                  <strong>{{ m.tabBox }}</strong>
                </td>
              </tr>
              <tr>
                <td>Tab-Padding / font-weight</td>
                <td>{{ m.tabPadding }} / {{ m.tabWeight }}</td>
              </tr>
              <tr>
                <td>aktiver Tab: die Unterstreichung des Kits</td>
                <td>{{ m.activeBorder }}</td>
              </tr>
              <tr>
                <td>aktiver Tab: der gleitende Balken von Aura</td>
                <td>{{ m.activeBar }}</td>
              </tr>
              <tr>
                <td>Fokus-Ring</td>
                <td>{{ m.focusRing }}</td>
              </tr>
              <tr>
                <td>Transition auf <code>.p-tab</code></td>
                <td>{{ m.transition }}</td>
              </tr>
              <tr>
                <td>Hover auf einem inaktiven Tab</td>
                <td>{{ m.hover }}</td>
              </tr>
              <tr>
                <td>Panel-Inhalte im DOM</td>
                <td>{{ m.lazy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Geometrie ist Computed Style und Layout-Box einer gerenderten Tab-Gruppe; Farben sind als die Tokens
          angegeben, aus denen sie sich auflösen, weil sie mit Stil, Akzent und Modus wandern (ADR-0016). Die Tab-Regeln
          des Kits werden von keinem <code>html.style-&lt;name&gt;</code>-Block angefasst. Der Kontrast der Beschriftung steht
          in <code>docs/generated/CONTRAST.MD</code>: <code>--primary-color-fg</code> (aktiv) unter
          <code>brand foreground</code>, niedrigster Wert 4,75:1 auf <code>--surface-ground</code>; <code>--text-color-secondary</code>
          (Ruhe) unter <code>body text</code>, niedrigster Wert 4,55:1. Das Kit malt den Tab transparent, also trifft der
          innenliegende Fokus-Ring auf die Seitenfläche dahinter: die Zeilen „focus ring“ auf <code>--surface-ground</code>,
          <code>--surface-card</code> und <code>--surface-section</code>, 3,88–17,85:1. <code>.p-tab</code> blendet Farbe
          und Rahmen über 0.2s über, lass einen Zustand also erst zur Ruhe kommen, bevor du ihn abliest.
        </p>

        <h3>Eine Unterstreichung und keine Hover-Regel — beides mit Absicht</h3>
        <p>
          Zwei Markierungen <em>könnten</em> den aktiven Tab kennzeichnen: das eigene <code>border-bottom: 2px</code> des
          Kits und der absolut positionierte <code>.p-tablist-active-bar</code> von Aura, der in 250 ms zwischen den Tabs
          gleitet. Im hellen Modus haben sie dieselbe Farbe, im dunklen nicht — der Rahmen nimmt das
          <code>--primary-color-fg</code> des Kits, der Balken das <code>primary.color</code> des Presets, zwei fast
          gleiche Töne des Akzents, 1px voneinander entfernt. Also unterdrückt das Kit den Balken
          (<code>.p-tabs .p-tablist-active-bar &#123; display: none &#125;</code>, was Auras
          Ein-Klassen-Regel <code>display: block</code> schlägt) und behält den eigenen Rahmen als einzige Markierung. Der
          Preis ist die Animation: Die Markierung springt jetzt sofort um, statt zu gleiten.
        </p>
        <p>
          Der Hover-Zustand dagegen ist der von Aura, weil er nichts anderes sein kann.
          <code>.p-tabs .p-tab:hover</code> hat die Spezifität (0,3,0); Auras
          <code>.p-tab:not(.p-tab-active):not(.p-disabled):hover</code> hat (0,4,0) und setzt sowohl <code>color</code> als
          auch die Kurzschreibweise <code>border-color</code> — die das ausgeschriebene <code>border-bottom-color</code>
          überschreibt, das eine Kit-Regel malen würde, und die Farbe gleich mit. Das Kit liefert deshalb <em>gar keine</em>
          Hover-Regel für Tabs statt einer toten; gerendert wird {{ m.hover }}. Willst du einen anderen Hover, änder die
          Theme-Tokens oder erhöh die Spezifität bewusst — eine Regel mit (0,3,0) ist verschwendete Arbeit.
        </p>

        <h3>Overflow: Die Leiste scrollt immer</h3>
        <p>
          <code>.p-tablist-viewport</code> ist <code>overflow-x: auto</code> mit <code>scrollbar-width: none</code> und
          <code>scroll-behavior: smooth</code> — bedingungslos, ob du <code>[scrollable]</code> übergibst oder nicht.
          Was <code>[scrollable]</code> tatsächlich tut: Es hängt die Klasse <code>p-tabs-scrollable</code> an die Wurzel, und
          diese Klasse hat <strong>null</strong>
          Regeln im ausgelieferten Stylesheet (<code>&#64;openng/optimus-ui-styles/dist/tabs/index.mjs</code>); das Computed
          <code>TabList.scrollable</code> (<code>openng-optimus-ui-tabs.mjs:293</code>) wird im Template nie gelesen.
          Die Chevron-Buttons kommen von <code>showNavigators</code> (Standard <code>true</code>) plus einer laufenden
          Overflow-Messung in <code>updateButtonState()</code> (:355-363), aufgefrischt von einem <code>ResizeObserver</code>.
        </p>
        <p class="src-note">
          Gemessen am Overflow-Beispiel: {{ m.overflow }} Zwei Folgen für Autoren. Eine verborgene Scrollbar heißt, dass
          das Chevron-Paar der einzige Hinweis auf Overflow ist — entfernst du es mit <code>[showNavigators]="false"</code>,
          bekommen Mausnutzer eine Leiste, die scrollt, ohne es irgendwie anzuzeigen. Und der Chevron „zurück“ existiert
          erst, wenn du schon gescrollt hast (<code>isPrevButtonEnabled</code> ist <code>scrollLeft !== 0</code>,
          <code>:361</code>), die Leiste ist also absichtlich asymmetrisch.
        </p>

        <h3>Die Leiste über diesem Artikel ist kein <code>p-tabs</code></h3>
        <p>
          Die Guide-Shell baut das Muster selbst, in etwa dreißig Zeilen Markup plus einem Tastatur-Handler
          (<code>article-shell.component.ts</code>), und die Detailseite der Komponenten tut dasselbe
          (<code>dev-design-detail.component.ts</code>). Eine selbstgebaute Tablist mit der aus der Bibliothek zu vergleichen,
          ist der billigste Weg zu sehen, was dir die Bibliothek wirklich bringt — und was nicht:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Selbstgebaute Tablist</th>
                <th><code>p-tabs</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tab-Element</td>
                <td><code>&lt;button type="button"&gt;</code> — native Semantik, native Aktivierung</td>
                <td><code>&lt;p-tab&gt;</code>, ein Custom Element mit <code>role="tab"</code></td>
              </tr>
              <tr>
                <td>Name der Tablist</td>
                <td>Was immer du auf das Element mit <code>role="tablist"</code> schreibst — trivial richtig</td>
                <td>Keiner, außer du ergänzt <code>[pt]</code>; ein <code>aria-label</code> am Host wird stillschweigend ignoriert</td>
              </tr>
              <tr>
                <td>Aktivierung</td>
                <td>Was immer du umsetzt — die Shells des Kits wählen bei Pfeiltaste</td>
                <td>Standardmäßig <strong>manuell</strong>; <code>[selectOnFocus]</code> schaltet um</td>
              </tr>
              <tr>
                <td>Roving Tabindex</td>
                <td>Pflegst du selbst, ein Eintrag je Tab</td>
                <td>Gratis, und korrekt</td>
              </tr>
              <tr>
                <td>IDs / <code>aria-controls</code></td>
                <td>Von Hand geschrieben und von Hand synchron gehalten</td>
                <td>Aus der ID der Tabs generiert</td>
              </tr>
              <tr>
                <td>Panels</td>
                <td>Alle im DOM, inaktive <code>hidden</code> — keine Lazy-Option, außer du baust eine</td>
                <td>Standardmäßig genauso, plus <code>[lazy]</code></td>
              </tr>
              <tr>
                <td>Panel-<code>tabindex</code></td>
                <td>Setzt du selbst — die Shells des Kits tun es</td>
                <td><strong>Fehlt</strong>; ergänz ein statisches <code>tabindex="0"</code></td>
              </tr>
              <tr>
                <td>Overflow</td>
                <td>Was immer du wählst — die Shells des Kits brechen in eine zweite Zeile um</td>
                <td>Waagerechtes Scrollen plus Chevrons</td>
              </tr>
              <tr>
                <td>Aktiv-Markierung</td>
                <td>Ein Rahmen, meist ohne Animation</td>
                <td>Ein Rahmen plus der gleitende Balken von Aura (dieses Kit unterdrückt den Balken)</td>
              </tr>
              <tr>
                <td>deaktivierte Tabs</td>
                <td>Überspringst du selbst im Pfeiltasten-Handler</td>
                <td>Übersprungen von <code>findNextTab</code>/<code>findPrevTab</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die ehrliche Zusammenfassung: Die zwei Dinge, die das Selbstbauen fast zufällig richtig macht, sind genau die
          zwei, die die Bibliothek falsch macht — die Tablist hat einen Namen, weil du ihn auf das richtige Element
          geschrieben hast, und das Panel ist fokussierbar, weil nichts es für dich generiert hat. Was die Bibliothek
          beisteuert, sind die generierte Paarung von Tab und Panel, das Überspringen deaktivierter Tabs, die
          Scroll-Mechanik und ein Tastaturmodus, den du bewusst wählen musst. Alles andere ist Pflege, die du selbst
          übernimmst, in jeder Sprache und bei jeder Breite.
        </p>

        <h3>Größe und Layout</h3>
        <ul>
          <li>
            <code>.p-tabs</code> ist <code>display: flex; flex-direction: column</code> und nimmt die Breite seines
            Containers an — gib dem Container die Breite, nicht den Tabs.
          </li>
          <li>
            <code>.p-tab</code> ist <code>flex-shrink: 0; white-space: nowrap</code>: Beschriftungen brechen nie um und
            schrumpfen nie. Eine lange übersetzte Beschriftung verbreitert die Leiste, bis sie überläuft.
          </li>
          <li>
            Es gibt keine vertikale Variante. Der Tastatur-Handler reagiert nur auf <kbd>←</kbd>/<kbd>→</kbd>, und nichts
            schreibt <code>aria-orientation</code>, also würde eine per CSS optisch vertikal gebaute Leiste als waagerechte
            angesagt und sich so verhalten.
          </li>
        </ul>

        <h3>Stand bei WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird auch
          nicht beansprucht. <strong>Erfüllt:</strong> SC 4.1.2 für die Tabs und die Panels, die <code>role="tab"</code>
          und <code>role="tabpanel"</code>, <code>aria-selected</code>, <code>aria-disabled</code> und die generierte
          Paarung aus <code>aria-controls</code> und <code>aria-labelledby</code> tragen, alles am gerenderten Baum
          bestätigt; SC 2.1.1 mit umlaufenden Pfeiltasten, Home und End, Enter und Leertaste sowie deaktivierten Tabs, die
          beim Durchlaufen übersprungen werden; SC 2.4.7 mit dem Kit-Ring, der in beiden Themes rendert, 2px solid bei
          einem outline-offset von -2px; und SC 2.5.8, die Tab-Box misst 100 × 47px, identisch in beiden Themes und in
          beiden Achsen über der 24px-Untergrenze. <strong>Nicht erfüllt:</strong> Keines der gemessenen Kriterien
          scheitert. <strong>Bedingt:</strong> SC 2.1.1 für das Panel — dafür wird kein <code>tabindex</code> generiert,
          ein Panel ohne fokussierbares Element ist also nicht erreichbar, und nur ein statisches Attribut behebt das;
          und SC 4.1.2 für die Tablist selbst, gemessen ohne zugänglichen Namen, weil <code>role="tablist"</code> auf
          einem inneren Element sitzt, das ein am Host geschriebener Name nie erreicht. <strong>AAA</strong> wird für
          diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>TabsModule</code> exportiert alle fünf Komponenten. Das ist die Struktur ab v18, die
          <code>TabView</code>/<code>p-tabPanel</code> abgelöst hat; in dieser Version gibt es kein <code>TabViewModule</code>
          mehr und keine Direktiven-Form. Keine der fünf ist ein <code>ControlValueAccessor</code> — eine Tab-Gruppe ist
          kein Formularelement.
        </p>

        <h3><code>p-tabs</code> — Inputs und Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Typ / Standard</th>
                <th>Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td><code>model&lt;string | number | undefined&gt;()</code></td>
                <td>
                  Der Wert des aktiven Tabs. Zweiwege (<code>[(value)]</code>) oder <code>[value]</code> +
                  <code>(valueChange)</code>. <strong>Nicht <code>any</code>:</strong> Unter
                  <code>strictTemplates</code> kann ein eng typisiertes Signal <code>$event</code> nicht direkt annehmen —
                  verenge ihn in einem Handler (dieser Artikel tut das, siehe sein <code>setNum</code>). Verglichen wird mit
                  <code>equals()</code> aus <code>&#64;openng/optimus-ui-utils</code>.
                </td>
              </tr>
              <tr>
                <td><code>lazy</code></td>
                <td>boolean, <code>false</code></td>
                <td>
                  Panels rendern bei der ersten Aktivierung statt vorab. Gilt für jedes Panel;
                  <code>p-tabpanel</code> hat ein eigenes <code>lazy</code> für ein einzelnes.
                </td>
              </tr>
              <tr>
                <td><code>selectOnFocus</code></td>
                <td>boolean, <code>false</code></td>
                <td>
                  <strong>Automatische Aktivierung.</strong> Damit wählt die Pfeiltaste einen Tab aus, sobald sie ihn
                  erreicht; ohne bewegen die Pfeile nur den Fokus, und du bestätigst mit Enter/Leertaste.
                </td>
              </tr>
              <tr>
                <td><code>scrollable</code></td>
                <td>boolean, <code>false</code></td>
                <td>
                  Hängt <code>p-tabs-scrollable</code> an die Wurzel. In Optimus 2.0.2 trägt diese Klasse immer noch keine
                  Regeln — lies den Tab Design, bevor du dich darauf verlässt.
                </td>
              </tr>
              <tr>
                <td><code>showNavigators</code></td>
                <td>boolean, <code>true</code></td>
                <td>
                  Die Chevron-Buttons, die erscheinen, sobald die Leiste überläuft. Ihre Beschriftungen kommen aus
                  <code>translation.aria.previous/next</code> der Bibliothek.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number, <code>0</code></td>
                <td>
                  Der Tabindex des <em>aktiven</em> Tabs (und der Navigations-Buttons). Inaktive Tabs sind immer
                  <code>-1</code>.
                </td>
              </tr>
              <tr>
                <td><code>pt</code> / <code>dt</code> / <code>unstyled</code></td>
                <td>object</td>
                <td>
                  Aus <code>BaseComponent</code>: Pass-through-Attribute, Design-Tokens je Instanz, Ausstieg aus dem Styling.
                  <code>pt</code> ist der einzige Weg zum inneren Element mit <code>role="tablist"</code> — schreib es aber
                  auf <strong><code>p-tablist</code></strong
                  >: <code>pt</code> wird <strong>nicht</strong> an Kind-Komponenten vererbt (<code>$pt</code> löst nur
                  den eigenen <code>pt</code>-Input dieser Komponente auf, <code>openng-optimus-ui-basecomponent.mjs:84-85</code>),
                  also erreicht dasselbe Objekt auf <code>p-tabs</code> nichts.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Der einzige Output ist <code>valueChange</code> (der Schreiber des <code>model()</code>). Es gibt kein Paar
          <code>onOpen</code>/<code>onClose</code> und kein abbrechbares Event — muss ein Wechsel verhindert werden
          können (ungespeicherte Änderungen), halte <code>value</code> in einem eigenen Signal und entscheide im Handler,
          ob du ihn schreibst.
        </p>

        <h3>Die anderen vier</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Komponente</th>
                <th>Inputs</th>
                <th>Rendert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-tablist</code></td>
                <td>— (plus <code>pt</code>); Templates <code>#previcon</code>, <code>#nexticon</code></td>
                <td>Wrapper → Scroll-Viewport → <code>div[role=tablist]</code> + der Aktiv-Balken.</td>
              </tr>
              <tr>
                <td><code>p-tab</code></td>
                <td><code>value</code>, <code>disabled</code></td>
                <td>Host mit <code>role="tab"</code>, projizierter Inhalt als Beschriftung.</td>
              </tr>
              <tr>
                <td><code>p-tabpanels</code></td>
                <td>—</td>
                <td>Wrapper mit <code>role="presentation"</code> und dem Panel-Padding.</td>
              </tr>
              <tr>
                <td><code>p-tabpanel</code></td>
                <td><code>value</code>, <code>lazy</code>; Content Child <code>#content</code></td>
                <td>
                  <code>role="tabpanel"</code>, <code>aria-labelledby</code>, <code>[hidden]</code>, wenn inaktiv.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs geprüft an <code>&#64;openng/optimus-ui/types/openng-optimus-ui-tabs.d.ts</code> und an der ausgelieferten
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tabs.mjs</code> (Optimus UI 2.0.2,
          <code>node_modules/&#64;openng/optimus-ui/package.json</code>); <code>pt</code>/<code>dt</code>/ <code>unstyled</code> aus
          <code>openng-optimus-ui-basecomponent.mjs</code>.
        </p>

        <h3>IDs werden generiert — und das ist dein <code>aria-controls</code></h3>
        <p>
          <code>p-tabs</code> generiert <code>id="pn_id_N"</code>, und jedes Kind leitet sich davon ab: Ein Tab bekommt
          <code>&lt;tabsId&gt;_tab_&lt;value&gt;</code>, ein Panel <code>&lt;tabsId&gt;_tabpanel_&lt;value&gt;</code>, und
          die beiden verweisen mit <code>aria-controls</code> / <code>aria-labelledby</code> aufeinander. Diese
          Verdrahtung bekommst du gratis — sie heißt aber auch: <strong>Der Wert landet in der DOM-ID</strong>. Nimm
          kurze, stabile Werte aus String oder Zahl; ein Objekt als Wert wird zu etwas Unbrauchbarem stringifiziert, und
          ein Wert, der sich zwischen zwei Renderläufen ändert, zerreißt die Paarung.
        </p>

        <h3>Lazy Panels: Was „lazy“ wirklich verspricht</h3>
        <pre class="code-block"><code>{{ lazySnippet }}</code></pre>
        <ul>
          <li>
            <strong>Aus (der Standard):</strong> Jeder Panel-Inhalt entsteht mit der Seite. Fünf schwere Panels kosten
            Komponenten, HTTP-Aufrufe in deren Konstruktoren und Canvases für fünf Panels — bevor der Nutzer sich auch nur
            eines angesehen hat.
          </li>
          <li>
            <strong>An:</strong> Ein Panel wird beim ersten Aktivwerden eingehängt — und <strong>bleibt eingehängt</strong>.
            <code>shouldRender</code> rastet an einem schlichten Feld <code>hasBeenRendered</code> ein
            (<code>openng-optimus-ui-tabs.mjs:796-807</code>), ein erneuter Besuch führt den Konstruktor also nie noch einmal
            aus. Zustand und Scrollposition überleben; der Speicherverbrauch auch.
          </li>
          <li>
            Greif <strong>nie</strong> zu lazy, um ein Panel vor dem Accessibility Tree zu verbergen — ein inaktives Panel
            ist bereits <code>hidden</code>. Lazy ist ein Kostenregler, sonst nichts.
          </li>
          <li>
            <strong>SSR:</strong> Mit lazy aus werden alle Panels ins HTML vorgerendert (gut für Crawler, schwer für die
            Nutzlast); mit lazy an existiert in der Server-Ausgabe nur das Startpanel. Entscheide, was du brauchst, bevor
            du umschaltest.
          </li>
        </ul>

        <h3>Den Wert in der URL halten</h3>
        <p>
          Das Muster hinter dem Do/Don’t im Tab Verwendung. Die Tab-Gruppe bleibt die maßgebliche Quelle fürs Rendern;
          der Query-Parameter ist ein Spiegel, der sie verlinkbar macht.
        </p>
        <pre class="code-block"><code>{{ urlSnippet }}</code></pre>

        <h3>SSR</h3>
        <ul>
          <li>
            Alles, was in der Komponente nur im Browser läuft, ist bereits abgesichert: <code>updateInkBar</code> läuft
            innerhalb von <code>isPlatformBrowser</code> + <code>setTimeout</code>, der <code>ResizeObserver</code> und der
            <code>MutationObserver</code> binden in <code>onAfterViewInit</code> / hinter derselben Absicherung.
          </li>
          <li>
            Das Risiko sind deine eigenen Tab-Inhalte. Ein Panel, das bei der Konstruktion <code>window</code>/<code>document</code>
            anfasst, läuft beim Prerendern für <em>jedes</em> Panel, außer <code>[lazy]</code> ist an — die Absicherung
            gehört so oder so in deinen Code (siehe <code>AGENTS.md</code> → Code style).
          </li>
          <li>
            Der Aktiv-Balken wird per JavaScript bemessen, also liefert das vorgerenderte HTML einen Balken ohne Breite,
            und er springt bei der Hydration an seinen Platz. Harmlos, aber mach von diesem ersten Frame keinen
            Screenshot-Test.
          </li>
        </ul>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Was die Bibliothek für dich verdrahtet</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Anforderung (APG)</th>
                <th>Optimus UI 2.0.2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>role="tablist"</code>, das die Tabs enthält</td>
                <td>
                  <strong>Ja</strong> — auf <code>div.p-tablist-tab-list</code>, nicht auf dem
                  <code>&lt;p-tablist&gt;</code>-Host.
                </td>
              </tr>
              <tr>
                <td>jeder Tab <code>role="tab"</code> mit <code>aria-selected</code></td>
                <td><strong>Ja</strong>, plus <code>aria-disabled</code> und <code>data-p-active</code>.</td>
              </tr>
              <tr>
                <td><code>aria-controls</code> → Panel, <code>aria-labelledby</code> → Tab</td>
                <td><strong>Ja</strong>, beide aus der ID der Tabs generiert.</td>
              </tr>
              <tr>
                <td>nur der aktive Tab in der Tab-Reihenfolge</td>
                <td><strong>Ja</strong> — Roving Tabindex (<code>disabled ? -1 : active ? tabindex() : -1</code>).</td>
              </tr>
              <tr>
                <td>Pfeiltasten wechseln zwischen Tabs, Home/End an die Enden</td>
                <td><strong>Ja</strong>, mit Umlauf.</td>
              </tr>
              <tr>
                <td>ein zugänglicher Name an der Tablist</td>
                <td>
                  <strong>Nein</strong> — nichts setzt einen, und das Host-Attribut erreicht die Rolle nicht. Nimm
                  <code>[pt]</code>.
                </td>
              </tr>
              <tr>
                <td><code>tabindex="0"</code> auf einem Panel ohne fokussierbaren Inhalt</td>
                <td><strong>Nein</strong> — wird nie gesetzt. Siehe die Lücke unten.</td>
              </tr>
              <tr>
                <td><code>aria-orientation</code>, wenn die Leiste nicht waagerecht ist</td>
                <td><strong>Nein</strong> — und einen vertikalen Modus gibt es nicht.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Tastatur — gemessen, nicht angenommen</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Standard (<code>selectOnFocus</code> aus)</th>
                <th>Mit <code>[selectOnFocus]="true"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>
                  Betritt die Leiste auf dem <em>aktiven</em> Tab (Roving Tabindex); ein weiterer Druck sollte ins Panel
                  führen und tut es nicht — {{ m.tabKey }}. Das erste Beispiel oben behebt das; die anderen absichtlich
                  nicht.
                </td>
                <td>Genauso.</td>
              </tr>
              <tr>
                <td><kbd>→</kbd> / <kbd>←</kbd></td>
                <td>
                  <strong>Bewegt nur den Fokus</strong>, mit Umlauf an den Enden; das Panel wechselt erst, wenn du bestätigst.
                  Gemessen: Der Fokus wanderte, <code>aria-selected</code> nicht.
                </td>
                <td>Bewegt den Fokus <em>und</em> wechselt das Panel.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>Fokussiert den ersten / letzten aktivierbaren Tab.</td>
                <td>Fokussiert und wählt ihn aus.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> / <kbd>Space</kbd></td>
                <td>Aktiviert den fokussierten Tab.</td>
                <td>Schon aktiviert; die Taste wird trotzdem behandelt.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>
                  <strong>Eigenheit:</strong> scrollt den ersten / letzten Tab ins Bild,
                  <em>ohne Fokus oder Auswahl zu bewegen</em> — und ruft <code>preventDefault()</code> auf, also scrollt
                  auch die Seite nicht.
                </td>
                <td>Genauso.</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd> / <kbd>↓</kbd></td>
                <td>Nicht behandelt — aber siehe den Hinweis zur Propagation.</td>
                <td>Genauso.</td>
              </tr>
              <tr>
                <td>deaktivierte Tabs</td>
                <td>
                  Übersprungen von <code>findNextTab</code>/<code>findPrevTab</code>, die auch den span des Aktiv-Balkens überspringen.
                </td>
                <td>Genauso.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus <code>Tab.onKeyDown</code> und seinen Handlern (<code>openng-optimus-ui-tabs.mjs:573-660</code>) und an
          der Tastatur gemessen:
          {{ m.keyboard }}
        </p>

        <h4>Bekannte Lücken — überdeck sie nicht stillschweigend</h4>
        <ul>
          <li>
            <strong>Jedes Keydown wird verschluckt.</strong> <code>onKeyDown</code> endet mit einem bedingungslosen
            <code>event.stopPropagation()</code> (<code>:588</code>) — auch bei Tasten, die es gar nicht behandelt.
            {{ m.stopPropagation }} Ein Shortcut-Listener auf Dokumentebene sieht deshalb nichts, solange ein Tab den
            Fokus hat. Hat deine App globale Tasten, binde sie mit <code>capture: true</code> oder nimm die tote Zone hin.
          </li>
          <li>
            <strong>Das Panel ist nicht fokussierbar.</strong> Die APG verlangt <code>tabindex="0"</code> auf einem
            Tabpanel ohne fokussierbares Element, damit Tastaturnutzer es lesen können. Optimus setzt es nie — das
            Aura-Theme liefert sogar ein Token <code>tabpanel.focusRing</code>, das deshalb nie erscheinen kann
            ({{ m.panelFocus }}); sobald du das Attribut ergänzt, markiert es der eine Ring des Kits (2px
            <code>--primary-color-fg</code>, außen). Beheb das mit einem schlichten statischen Attribut am Host:
            <code>&lt;p-tabpanel [value]="0" tabindex="0"&gt;</code>, wie es das erste Beispiel oben tut. <strong>Beachte,
            was <em>nicht</em> funktioniert:</strong> Der naheliegende Pass-through,
            <code>[pt]="&#123; root: &#123; tabindex: 0 &#125; &#125;"</code>, erreicht den Panel-Host überhaupt nicht,
            obwohl derselbe <code>pt</code>-Mechanismus das innere div der Tablist sehr wohl erreicht. Prüf einen
            Pass-through im DOM, bevor du ihm traust.
          </li>
          <li>
            <strong>Die Tablist hat keinen Namen.</strong> Zwei Tab-Gruppen auf einer Seite sind zwei unbenannte
            „Tab-Liste“-Landmarken in der Liste eines Screenreaders. Benenn sie über <code>[pt]</code> auf
            <code>p-tablist</code>, was nachweislich funktioniert — jede Tab-Gruppe in diesem Guide ist so benannt.
          </li>
          <li>
            <strong>Die Navigations-Buttons nehmen ihre Namen aus dem eigenen Vokabular der Bibliothek.</strong>
            <code>config.translation.aria.previous</code> / <code>.next</code> stehen standardmäßig auf den englischen
            Literalen „Previous“ / „Next“ (<code>openng-optimus-ui-config.mjs:185-186</code>). Dieses Kit speist sie
            stattdessen aus seiner i18n-Schicht; ein nachgelagertes Kit, das das nicht tut, liefert zwei englische Wörter
            in jede andere Sprache aus — siehe den Tab Internationalisierung (i18n).
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>
            ☐ Der Inhalt ist wirklich ein Thema, aus mehreren Blickwinkeln gesehen — keine Schritte, keine Abschnitte
            zum Vergleichen, keine Seiten, die eine URL verdienen.
          </li>
          <li>
            ☐ Höchstens etwa vier Tabs bei der schmalsten unterstützten Breite, geprüft bei 360px mit der längsten
            Sprache, die du auslieferst.
          </li>
          <li>☐ Die Tablist trägt einen Namen über <code>[pt]</code>, wenn die Seite mehr als eine hat.</li>
          <li>☐ Panels ohne fokussierbaren Inhalt bekommen <code>tabindex="0"</code>.</li>
          <li>
            ☐ Erreichbar mit <kbd>Tab</kbd>, bedienbar mit <kbd>←</kbd>/<kbd>→</kbd>/ <kbd>Home</kbd>/<kbd>End</kbd>,
            aktiviert mit <kbd>Enter</kbd>; Fokus sichtbar in <strong>beiden</strong> Themes.
          </li>
          <li>
            ☐ Eine bewusste Entscheidung zu <code>[selectOnFocus]</code>: automatisch nur, wenn der Wechsel billig und
            frei von Nebenwirkungen ist.
          </li>
          <li>☐ Eine bewusste Entscheidung zu <code>[lazy]</code>, mit den Kosten fürs Prerendern im Blick.</li>
          <li>
            ☐ Tab-Beschriftungen kommen aus dem Übersetzungsdienst, und das Array ist ein <code>computed()</code>, damit
            ein Sprachwechsel sie neu rendert.
          </li>
          <li>☐ Kein globaler Tastatur-Shortcut hängt an Events, die aus einem fokussierten Tab hochblubbern.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die beiden Regeln festnagelt, die am ehesten zurückfallen —
          manuelle Aktivierung und die generierte Paarung:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Beschriftungen sind Inhalt, und ihre Länge ist ein Layout-Risiko</h3>
        <p>
          Eine Tab-Leiste ist die unnachgiebigste Stelle eines Layouts für übersetzten Text.
          <code>.p-tab</code> ist <code>white-space: nowrap</code> und <code>flex-shrink: 0</code>, eine Beschriftung
          bricht also nie um und schrumpft nie: Deutsche Beschriftungen sind 20–40 % länger als englische („Einstellungen“
          statt „Settings“), und der Überlauf schickt den Leser hinter einen Chevron statt in eine umbrochene Zeile. Plane
          die Zahl der Tabs für die längste Sprache, nicht für Englisch.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Bau die Beschriftungen in einem <code>computed()</code></strong>, das den
            <code>TranslationService</code> des Kits aufruft, damit ein Sprachwechsel sie neu baut. Ein schlichtes Feld
            wird einmal erfasst und veraltet.
          </li>
          <li>
            <strong>Halte <code>value</code> aus der Übersetzung heraus.</strong> Werte werden zu DOM-IDs und gehören in
            die URL; sie müssen über alle Sprachen stabil sein. Übersetz die Beschriftung, nie den Schlüssel.
          </li>
          <li>
            <strong>Miss nach einem Sprachwechsel neu.</strong> Die Navigations-Buttons erscheinen über einen
            <code>ResizeObserver</code> auf der Tablist, ein breiterer Satz Beschriftungen bringt sie also automatisch
            zurück — aber der Aktiv-Balken wird in einem <code>setTimeout</code> positioniert, das am <em>Wert</em> hängt,
            nicht am Text der Beschriftung. Eine Beschriftung, die ihre Breite ohne Wertwechsel ändert, lässt den Balken
            stehen, wo er war, bis zum nächsten Wechsel. (Ein <code>MutationObserver</code> auf dem aktiven Tab deckt
            Textänderungen in diesem Tab ab; ein Sprachwechsel, der die Breite eines <em>anderen</em> Tabs ändert,
            bewegt den Balken nicht.)
          </li>
        </ul>

        <h3>Die eigenen Strings der Bibliothek brauchen Futter, einmal</h3>
        <p>
          Die beiden Chevron-Buttons werden benannt aus
          <code>config.translation.aria.previous</code> und <code>.next</code>, deren Standardwerte die englischen
          Literale <code>'Previous'</code> und <code>'Next'</code> sind (<code>openng-optimus-ui-config.mjs:185-186</code>).
          Es sind keine Strings pro Aufrufstelle: Nichts, was du auf ein <code>p-tabs</code> schreibst, erreicht sie. Dieses
          Kit hält sie in seinen eigenen Übersetzungsmodulen und schiebt bei jedem Sprachwechsel den ganzen
          <code>aria</code>-Block in die Konfiguration der Bibliothek — derselbe Mechanismus, der „Option List“ im Select
          und „Remove“ im Chip übersetzt. Zwei Dinge musst du in deinem eigenen Kit richtig machen:
        </p>
        <ul>
          <li>
            <strong>Füttere sie, oder du lieferst Englisch aus.</strong> Ein statischer <code>translation</code>-Block in
            <code>provideOptimus</code> reicht für eine einsprachige App; eine App, die zur Laufzeit die Sprache wechselt,
            muss <code>setTranslation</code> bei jedem Wechsel erneut aufrufen.
          </li>
          <li>
            <strong>Zusammenführen, nicht ersetzen.</strong> <code>setTranslation</code> führt nur eine Ebene tief
            zusammen, ein frisches <code>aria</code>-Objekt wirft also jeden Schlüssel weg, den du nicht aufgeführt hast.
            Spreize zuerst den aktuellen Block.
          </li>
        </ul>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>

        <h3>Schreibrichtung</h3>
        <p>
          Die Scroll-Rechnung kennt RTL — <code>onPrevButtonClick</code> und <code>onNextButtonClick</code> negieren
          <code>scrollLeft</code> unter <code>isRTL()</code>, und die Chevrons werden über eine
          <code>:dir(rtl)</code>-Drehung im Basis-Stylesheet gespiegelt. Nichts davon ist heute verdrahtet (das Kit liefert
          nur LTR-Sprachen aus), und es wurde nicht durch das Rendern einer RTL-Locale geprüft, weil es keine zum Rendern gibt.
        </p>

        <h3>Verborgene Panels und die eigenen Werkzeuge des Lesers</h3>
        <p>
          Übersetzt oder nicht: Ein Panel hinter einem inaktiven Tab ist unsichtbar für die Suche auf der Seite, für den
          Druck und für die eingebaute Übersetzung des sichtbaren Viewports im Browser. Muss ein Leser, der die Sprache
          wechselt, über deinen Inhalt hinweg suchen, gehört dieser Inhalt gar nicht in Tabs — das ist die vierte Frage
          aus dem Tab Verwendung, erreicht von der i18n-Seite.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Tabs und
            Navigations-Buttons tragen den einen 2px-Ring des Kits innerhalb ihrer Kante (CONTRAST.MD „focus ring“); das
            niedrigste Verhältnis der aktiven Beschriftung auf 4,75:1 korrigiert.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Erneut geprüft an Optimus UI 2.0.2 und den visuellen Stilen (ADR-0016): gerenderte Farben nach Token benannt statt
            mit Ablesungen aus der alten Palette; Kontrast der Tab-Beschriftungen aus dem Kontrast-Gate zitiert; vier veraltete
            Zeilenverweise in die Bibliothek korrigiert (Lazy-Einrasten, Auflösung von <code>$pt</code>, Tasten-Handler);
            Werkzeugnamen aus dem Text für Leser entfernt; Agent-Doc unter die Zielgröße gekürzt; Historie neueste zuerst sortiert.
          </li>
          <li>
            <strong>v0.5</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014). Drei Aussagen aus v22
            kehren sich wieder um: Die innere Ebene <code>div.p-tablist-tab-list</code> existiert wieder und trägt
            <code>role="tablist"</code> (der Pass-through-Abschnitt ist also <code>tabList</code>, nicht
            <code>content</code>), <code>scrollStrategy</code> existiert nicht, und Aura ist zurück auf den Werten von 2.x —
            <code>tab.borderWidth: 0 0 1px 0</code> mit einem <code>activeBorderColor</code>, Aktiv-Balken 1px bei
            <code>bottom: -1px</code>. Zeilenverweise gegen die Optimus-Bundles neu ermittelt; die Messungen der Computed
            Styles wurden nicht wiederholt.
          </li>
          <li>
            <strong>v0.4</strong> — 23.08.2026 — Erneut geprüft an PrimeNG 22.1 / Aura 3.0, die die Leiste neu gestaltet
            haben: Upstream ist die Tab-Unterstreichung weg (<code>tab.borderWidth: 0</code>, Rahmen transparent, Aktiv-Balken
            bei <code>bottom: 0</code>) — die eigene 2px-Markierung des Kits plus unterdrückter Aktiv-Balken ergibt weiterhin
            genau eine Markierung. Der Pass-through-Abschnitt der Tablist ist umgezogen (<code>tabList</code> → <code>content</code>,
            alle Beispiele migriert), die innere Ebene <code>p-tablist-tab-list</code> aus v21 ist weg, <code>scrollStrategy</code>
            ist neu, und <code>[scrollable]</code> tut weiterhin nichts. Zeilenverweise gegen 22.1.2 neu ermittelt.
          </li>
          <li>
            <strong>v0.3</strong> — 20.08.2026 — Zusammenfassung des Stands bei WCAG 2.2 im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.2</strong> — 30.07.2026 — Neu geschrieben, um Befunde zu nennen statt zu erzählen, wie sie gefunden
            wurden. Am aktuellen Stylesheet des Kits korrigiert: Der aktive Tab trägt jetzt eine Unterstreichung (der
            gleitende Balken von Aura ist unterdrückt), und das Kit liefert keine Hover-Regel für Tabs; die Scroll-Chevrons
            werden aus der i18n-Schicht des Kits gespeist, nicht englisch belassen.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erster Guide: die Entscheidungstabelle Tabs/Accordion/Stepper/Routen, ein
            Live-Playground mit einem Zähler für gerenderte Panels, vier Do/Don’t-Paare, ein Tab Design zu Aura und Kit und
            das kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TabsArticleDeComponent extends TabsArticleComponent {
  /** The measured values of the English article, with the prose around them in German. */
  override readonly m = {
    tabBox:
      '100 × 47px („Overview“, Standardschrift) — die Breite folgt der Beschriftung und der Schrift des aktiven Stils; liegt in beiden Achsen über der 24px-Untergrenze von SC 2.5.8',
    tabPadding: '12px 16px (das Token sagt 1rem 1.125rem)',
    tabWeight: '600 (der Wert von Aura, vom Kit nicht angetastet)',
    activeBorder:
      '2px solid var(--primary-color-fg) — der kontrastangepasste Akzent-Vordergrund des Kits, je Akzent und Modus',
    activeBar:
      'nicht gerendert — das Kit setzt display: none darauf; nicht unterdrückt ist er 1px hoch und gleitet über 0.25s cubic-bezier(0.35, 0, 0.25, 1) in {primary.color}, einem anderen Ton als der Rahmen darüber',
    focusRing:
      'outline 2px solid var(--primary-color-fg) bei outline-offset -2px — der eine Ring des Kits, innerhalb des Tabs gezeichnet (Auras 1px {focus.ring} ist überschrieben); 3,88–17,85:1 auf den Seitenflächen hinter dem transparenten Tab (CONTRAST.MD „focus ring“)',
    transition: 'border-color 0.2s, color 0.2s — die zwei des Kits, anstelle von Auras Transition über fünf Eigenschaften',
    hover:
      'das Paar von Aura: Die Beschriftung wechselt von --text-color-secondary des Kits zu {text.color}, und der untere Rahmen von transparent zu {content.border.color}',
    overflow:
      'neun Tabs (englische Beschriftungen) in einer 22rem breiten Spalte messen eine Leiste von 908px in einem Viewport von 352px. In Ruhe rendert genau EIN Chevron („weiter“); nach 200px Scrollen erscheinen beide.',
    tabKey:
      'ohne das Attribut verlässt der Fokus die Tab-Gruppe ganz und landet auf dem nächsten Link danach; mit einem statischen tabindex="0" auf dem Panel landet er auf dem Panel selbst (role="tabpanel")',
    keyboard:
      'ArrowRight bewegte den Fokus von Tab 1 zu Tab 2, während aria-selected auf Tab 1 „true“ blieb; erst Enter verschob es. Mit [selectOnFocus]="true" bewegte dasselbe ArrowRight beides.',
    stopPropagation:
      'Ein auf einem Tab ausgelöstes Keydown erreicht nie einen Listener am Dokument, während dasselbe Event, auf <body> ausgelöst, ihn erreicht.',
    lazy: '3 von 3 Panel-Inhalten im DOM mit lazy aus; 1 von 3 mit lazy an, steigend auf 2 nach dem Besuch eines zweiten Tabs — und bei 2 bleibend nach dem Zurückwechseln',
    panelFocus: 'das Attribut fehlt am Panel-Host schlicht',
  };

  override readonly countOptions = [
    { label: '3 Tabs', value: 3 },
    { label: '5 Tabs', value: 5 },
    { label: '9 Tabs', value: 9 },
  ];

  override readonly panelReadout = signal('noch nicht gezählt');

  override readonly pgTabs = computed(() =>
    TAB_LABELS_DE.slice(0, this.pgCount()).map((label, value) => ({ label, value })),
  );

  override readonly pgTablistPt = { tabList: { 'aria-label': 'Playground-Ansichten' } };
  override readonly basicPt = { tabList: { 'aria-label': 'Ansichten des Datensatzes' } };
  override readonly disabledPt = { tabList: { 'aria-label': 'Dokumentstatus' } };
  override readonly overflowPt = { tabList: { 'aria-label': 'Projektbereiche' } };
  override readonly iconsPt = { tabList: { 'aria-label': 'Dokument und Kommentare' } };
  override readonly scanPt = { tabList: { 'aria-label': 'Kriterien des Modells' } };
  override readonly plainPt = { tabList: { 'aria-label': 'Datenansichten, nicht teilbar' } };
  override readonly urlPt = { tabList: { 'aria-label': 'Datenansichten, teilbar' } };
  override readonly manyPt = { tabList: { 'aria-label': 'Zu viele Bereiche' } };
  override readonly fewPt = { tabList: { 'aria-label': 'Drei Bereiche' } };
  override readonly namedTablistPt = { tabList: { 'aria-label': 'Berichtsansichten' } };

  override readonly manyTabs = TAB_LABELS_DE.map((label, value) => ({ label, value }));

  override readonly examples: TabsArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));

  override countPanels(): void {
    if (typeof document === 'undefined') return;
    const stage = document.getElementById('pg-stage');
    if (!stage) return;
    const rendered = stage.querySelectorAll('[data-panel-marker]').length;
    const total = this.pgCount();
    this.panelReadout.set(`${rendered} von ${total} Panel-Inhalten im DOM (lazy ${this.pgLazy() ? 'an' : 'aus'})`);
  }
}
