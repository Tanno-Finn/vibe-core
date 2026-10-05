import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { SelectArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './select-article.component';

/** German prose for the examples; id and code stay with the English base. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  basic: {
    title: 'Eine einzelne Auswahl',
    note: 'Die Grundform: eine sichtbare Beschriftung und [ariaLabelledBy], das auf deren id zeigt.',
  },
  grouped: {
    title: 'Gruppierte Optionen',
    note: 'Gruppen brauchen drei Inputs. Lies vor dem Einsatz den Vorbehalt zu Gruppen-Headern unter Entwicklung.',
  },
  filter: {
    title: 'Filter für eine lange Liste',
    note: 'Öffne es und tippe. Alle drei Filter-Texte übersetzt du selbst.',
  },
  clear: {
    title: 'Optionaler Wert: Platzhalter plus Leeren',
    note: 'Mit showClear nimmt der Nutzer eine Auswahl zurück. Ohne das ist ein optionaler Filter eine Einbahnstraße.',
  },
  template: {
    title: 'Eigene Darstellung der Optionen',
    note: 'Definiere selectedItem immer dann, wenn du item definierst, sonst widersprechen sich Trigger und Liste.',
  },
  states: {
    title: 'Deaktiviert, lädt, ungültig',
    note: 'Deaktiviert dämpft die Beschriftung (das Kit biegt das Token um, es färbt die Beschriftung nicht ein); beim Laden gehen Tasten ins Leere.',
  },
};

/** German labels of the chart types, keyed by value. */
const CHART_DE: Record<string, string> = {
  bar: 'Balkendiagramm',
  'grouped-bar': 'Gruppierte Balken',
  line: 'Liniendiagramm',
  area: 'Flächendiagramm',
  scatter: 'Streudiagramm',
  pie: 'Kreisdiagramm',
  heatmap: 'Heatmap',
};

/** German country names, keyed by the English value (the value stays English). */
const COUNTRY_DE: Record<string, string> = {
  albania: 'Albanien',
  andorra: 'Andorra',
  austria: 'Österreich',
  belarus: 'Belarus',
  belgium: 'Belgien',
  'bosnia-and-herzegovina': 'Bosnien und Herzegowina',
  bulgaria: 'Bulgarien',
  croatia: 'Kroatien',
  cyprus: 'Zypern',
  czechia: 'Tschechien',
  denmark: 'Dänemark',
  estonia: 'Estland',
  finland: 'Finnland',
  france: 'Frankreich',
  germany: 'Deutschland',
  greece: 'Griechenland',
  hungary: 'Ungarn',
  iceland: 'Island',
  ireland: 'Irland',
  italy: 'Italien',
  kosovo: 'Kosovo',
  latvia: 'Lettland',
  liechtenstein: 'Liechtenstein',
  lithuania: 'Litauen',
  luxembourg: 'Luxemburg',
  malta: 'Malta',
  moldova: 'Moldau',
  monaco: 'Monaco',
  montenegro: 'Montenegro',
  netherlands: 'Niederlande',
  'north-macedonia': 'Nordmazedonien',
  norway: 'Norwegen',
  poland: 'Polen',
  portugal: 'Portugal',
  romania: 'Rumänien',
  'san-marino': 'San Marino',
  serbia: 'Serbien',
  slovakia: 'Slowakei',
  slovenia: 'Slowenien',
  spain: 'Spanien',
  sweden: 'Schweden',
  switzerland: 'Schweiz',
  ukraine: 'Ukraine',
  'united-kingdom': 'Vereinigtes Königreich',
};

/** German labels of the playground sizes and the sort order, keyed by value. */
const OPTION_DE: Record<string, string> = {
  small: 'Klein',
  normal: 'Normal',
  large: 'Groß',
  desc: 'Neueste zuerst',
  asc: 'Älteste zuerst',
};

/**
 * German twin of the Select guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers and code snippets
 * are shared; only the template and the visible option labels and example prose
 * are German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs select`).
 */
@Component({
  selector: 'app-select-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'select'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jedes Steuerelement hier unten ist ein echtes <code>p-select</code>. Fang im Playground an, stell dort eine
          Konfiguration ein und kopier ihr Markup; die Blöcke darunter stellen jedes gerenderte Steuerelement neben
          seinen exakten Code. Beachte, dass sich <strong>jedes</strong> Beispiel mit <code>[ariaLabelledBy]</code>
          benennt — die Tabs Verwendung und Entwicklung zeigen mit Messungen, warum die naheliegenden Alternativen nicht
          funktionieren.
        </p>

        <!-- Mini playground: live-configure a select and read back the markup. -->
        <section class="pg" aria-label="Select-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

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

              <div class="pg__field pg__field--switch">
                <label for="pg-grouped">Gruppierte Optionen</label>
                <p-toggleswitch inputId="pg-grouped" [ngModel]="pgGrouped()" (ngModelChange)="pgGrouped.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-filter">Filtern</label>
                <p-toggleswitch inputId="pg-filter" [ngModel]="pgFilter()" (ngModelChange)="pgFilter.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-clear">Leeren anzeigen</label>
                <p-toggleswitch inputId="pg-clear" [ngModel]="pgClear()" (ngModelChange)="pgClear.set($event)" />
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
              <span class="pg__preview-label" id="pg-preview-label">Vorschau — Diagrammtyp</span>
              <div class="pg__stage">
                <p-select
                  [ariaLabelledBy]="'pg-preview-label'"
                  [options]="pgGrouped() ? groupedChartOptions : chartOptions"
                  [group]="pgGrouped()"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  optionLabel="label"
                  optionValue="value"
                  [size]="pgSizeInput()"
                  [filter]="pgFilter()"
                  filterBy="label"
                  [showClear]="pgClear()"
                  [disabled]="pgDisabled()"
                  placeholder="Diagrammtyp wählen"
                  [ngModel]="pgValue()"
                  (ngModelChange)="pgValue.set($event)"
                  [style]="{ width: '100%' }"
                />
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

        <!-- Sizes; the Design tab carries the token table behind them. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Die drei Größen nebeneinander</h3>
            <button type="button" class="copy-btn" (click)="copy('sizes', sizesCode)">
              {{ copiedId() === 'sizes' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Ein Modell, drei Werte für <code>size</code>. Der Tab Design zeigt die Token-Tabelle hinter dem
            Höhenunterschied.
          </p>
          <div class="ex__stage">
            <div class="sizes">
              <div class="sizes__row">
                <span class="pg__label" id="sz-small-label">Klein</span>
                <p-select
                  id="sz-small"
                  [ariaLabelledBy]="'sz-small-label'"
                  size="small"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="szSmall()"
                  (ngModelChange)="szSmall.set($event)"
                />
              </div>
              <div class="sizes__row">
                <span class="pg__label" id="sz-normal-label">Standard</span>
                <p-select
                  id="sz-normal"
                  [ariaLabelledBy]="'sz-normal-label'"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="szNormal()"
                  (ngModelChange)="szNormal.set($event)"
                />
              </div>
              <div class="sizes__row">
                <span class="pg__label" id="sz-large-label">Groß</span>
                <p-select
                  id="sz-large"
                  [ariaLabelledBy]="'sz-large-label'"
                  size="large"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="szLarge()"
                  (ngModelChange)="szLarge.set($event)"
                />
              </div>
            </div>
          </div>
          <pre class="code-block"><code>{{ sizesCode }}</code></pre>
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
                    <span class="pg__label" id="ex-basic-label">Diagrammtyp</span>
                    <p-select
                      [ariaLabelledBy]="'ex-basic-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="exBasic()"
                      (ngModelChange)="exBasic.set($event)"
                    />
                  </div>
                }
                @case ('grouped') {
                  <div class="field">
                    <span class="pg__label" id="ex-grouped-label">Diagrammtyp, nach Familie</span>
                    <p-select
                      [ariaLabelledBy]="'ex-grouped-label'"
                      [options]="groupedChartOptions"
                      [group]="true"
                      optionGroupLabel="label"
                      optionGroupChildren="items"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="exGrouped()"
                      (ngModelChange)="exGrouped.set($event)"
                    />
                  </div>
                }
                @case ('filter') {
                  <div class="field">
                    <span class="pg__label" id="ex-filter-label">Land</span>
                    <p-select
                      [ariaLabelledBy]="'ex-filter-label'"
                      [options]="countryOptions"
                      optionLabel="label"
                      optionValue="value"
                      [filter]="true"
                      filterBy="label"
                      filterPlaceholder="Tippen, um die Liste einzugrenzen"
                      ariaFilterLabel="Tippen, um die Liste einzugrenzen"
                      emptyFilterMessage="Kein Land passt zu diesem Text"
                      placeholder="Land wählen"
                      [ngModel]="exFilter()"
                      (ngModelChange)="exFilter.set($event)"
                    />
                  </div>
                }
                @case ('clear') {
                  <div class="field">
                    <span class="pg__label" id="ex-clear-label">Optionaler Filter</span>
                    <p-select
                      [ariaLabelledBy]="'ex-clear-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Alle Diagrammtypen"
                      [showClear]="true"
                      [ngModel]="exClear()"
                      (ngModelChange)="exClear.set($event)"
                    />
                  </div>
                }
                @case ('template') {
                  <div class="field">
                    <span class="pg__label" id="ex-template-label">Diagrammtyp mit Icons</span>
                    <p-select
                      [ariaLabelledBy]="'ex-template-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="exTemplate()"
                      (ngModelChange)="exTemplate.set($event)"
                    >
                      <ng-template let-option #selectedItem>
                        <span class="opt"><i [class]="option.icon" aria-hidden="true"></i>{{ option.label }}</span>
                      </ng-template>
                      <ng-template let-option #item>
                        <span class="opt"><i [class]="option.icon" aria-hidden="true"></i>{{ option.label }}</span>
                      </ng-template>
                    </p-select>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <span class="pg__label" id="ex-disabled-label">Deaktiviert</span>
                    <p-select
                      [ariaLabelledBy]="'ex-disabled-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [disabled]="true"
                      [ngModel]="'bar'"
                    />
                  </div>
                  <div class="field">
                    <span class="pg__label" id="ex-loading-label">Lädt</span>
                    <p-select
                      [ariaLabelledBy]="'ex-loading-label'"
                      [options]="noOptions"
                      optionLabel="label"
                      optionValue="value"
                      [loading]="true"
                      placeholder="Optionen werden geladen"
                    />
                  </div>
                  <div class="field">
                    <span class="pg__label" id="ex-invalid-label">Ungültig</span>
                    <p-select
                      [ariaLabelledBy]="'ex-invalid-label'"
                      [options]="chartOptions"
                      optionLabel="label"
                      optionValue="value"
                      [invalid]="true"
                      placeholder="Eins wählen"
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
        <h3>Welches Steuerelement? Die ehrliche Tabelle</h3>
        <p>
          Ein <code>p-select</code> ist nur deshalb der Standard, weil es kompakt ist — es kostet den Nutzer einen Klick,
          überhaupt die Auswahl zu sehen, und es versteckt den Antwortraum hinter einem Trigger. Wähle danach,
          <strong
            >wie viele Optionen es gibt, ob der Nutzer sie benennen kann, ob die Antwort eine Menge ist und ob die
            Optionen beim Entscheiden sichtbar sein müssen</strong
          >.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Optionen</th>
                <th>Sichtbar im Ruhezustand</th>
                <th>Suche</th>
                <th>Mehrfach</th>
                <th>Touch / Smartphone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-selectbutton</code></td>
                <td>2–4, kurze Beschriftungen</td>
                <td><strong>alle</strong>, als Segmente in einer Zeile</td>
                <td>nein</td>
                <td><code>[multiple]="true"</code></td>
                <td>
                  Jede Option ist ein eigenes Ziel; ab etwa 3 Einträgen bricht die Zeile unschön um — gib ihr
                  <code>styleClass="w-full"</code> und prüf sie bei 360px.
                </td>
              </tr>
              <tr>
                <td><code>p-radiobutton</code></td>
                <td>2–6</td>
                <td><strong>alle</strong>, untereinander mit Beschriftungen</td>
                <td>nein</td>
                <td>nein (das wäre eine Checkbox)</td>
                <td>Am besten: eine große Zeile je Option, kein Overlay, nichts zum Danebentippen.</td>
              </tr>
              <tr>
                <td><code>p-select</code></td>
                <td>~5–25</td>
                <td>eine — der aktuelle Wert</td>
                <td>nein</td>
                <td>nein</td>
                <td>
                  Ein Ziel, dann eine Overlay-Liste. Kein Auswahlrad des Betriebssystems (es ist kein natives
                  <code>&lt;select&gt;</code>).
                </td>
              </tr>
              <tr>
                <td><code>p-select [filter]</code></td>
                <td>~15–60</td>
                <td>eine</td>
                <td>ja — im Client, über die schon geladenen Optionen</td>
                <td>nein</td>
                <td>
                  Beim Öffnen bekommt das Filterfeld den Fokus, die Bildschirmtastatur erscheint also sofort. Gut, wenn
                  der Nutzer das Wort kennt, feindselig, wenn er nur stöbert.
                </td>
              </tr>
              <tr>
                <td><code>p-multiselect</code></td>
                <td>~5–60</td>
                <td>eine Zusammenfassung der gewählten Menge</td>
                <td>ja, mit <code>[filter]="true"</code></td>
                <td><strong>ja</strong> — das ist der Grund, es zu nehmen</td>
                <td>Wie oben, und zusätzlich muss die gewählte Menge lesbar bleiben, wenn sie wächst.</td>
              </tr>
              <tr>
                <td><code>p-autocomplete</code></td>
                <td>60+, entfernt geladen oder offen</td>
                <td>keine — ein leeres Textfeld</td>
                <td>ja, beim Tippen; unterstützt Vorschläge per Lazy Loading oder vom Server</td>
                <td><code>[multiple]="true"</code></td>
                <td>
                  Erst tippen. Nur richtig, wenn der Nutzer das Ziel benennen kann; ein stöbernder Nutzer bekommt ein
                  leeres Feld und keinen Hinweis, was er tun kann.
                </td>
              </tr>
              <tr>
                <td>natives <code>&lt;select&gt;</code></td>
                <td>beliebig</td>
                <td>eine</td>
                <td>Type-ahead des Betriebssystems</td>
                <td><code>multiple</code></td>
                <td>
                  Die einzige Option, die das Auswahlrad des Betriebssystems, natives Absenden im Formular und null
                  JavaScript bekommt — um den Preis von Optionen, die sich nicht gestalten lassen.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> Die Spalten sind Verhalten, gelesen aus den Quellen von
          Optimus UI in <code>node_modules</code>. Die Spannen für die Zahl der Optionen sind eine <em>Einschätzung</em>,
          keine Messung — sie stehen für „wie weit kann ein Nutzer eine eingeklappte Liste überfliegen, bevor Suchen
          schneller ist als Scrollen“, und du solltest sie verschieben, wenn dein Inhalt etwas anderes sagt.
          Kit-Konvention: Eine Einzelauswahl ist überall <code>p-select</code> oder <code>p-selectbutton</code>, und
          jedes davon wird mit <code>[ariaLabelledBy]</code> benannt; die Zeilen zu Multiselect und Autocomplete sind
          aus der Bibliothek dokumentiert, nicht aus einer Aufrufstelle, die du hier lesen kannst.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Dropdown für eine Ja-oder-Nein-Wahl</span>
            <div class="dd__stage">
              <p-select
                [ariaLabelledBy]="'dd-binary-bad-label'"
                [options]="binaryOptions"
                optionLabel="label"
                optionValue="value"
                [ngModel]="ddBinary()"
                (ngModelChange)="ddBinary.set($event)"
              />
              <span class="sr-only" id="dd-binary-bad-label">Sortierung, als Dropdown</span>
            </div>
            <p class="dd__why">
              Zwei Optionen, ein Klick zum Öffnen, einer zum Wählen, und die Alternative bleibt unsichtbar, bis man nach
              ihr sucht.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — beide Möglichkeiten zeigen</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-binary-good-label">Sortierung</span>
              <p-selectbutton
                [ariaLabelledBy]="'dd-binary-good-label'"
                [options]="binaryOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddBinary()"
                (ngModelChange)="ddBinary.set($event)"
              />
            </div>
            <p class="dd__why">
              Beide Zustände sind im Ruhezustand lesbar, und jeder ist nur einen Tipp entfernt. Dasselbe Modell, die
              halbe Interaktion.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — mit einem &lt;label for&gt; benennen</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-name-bad">Diagrammtyp</label>
                <p-select
                  inputId="dd-name-bad"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Zugänglicher Name des Steuerelements links: <strong>„{{ ddNameLabel() }}“</strong> — der aktuelle Wert,
              nicht „Diagrammtyp“. Ändere die Auswahl, und der Name ändert sich mit. Das fokussierbare Element ist ein
              <code>&lt;span&gt;</code>, und <code>&lt;label for&gt;</code> bindet sich nur an beschriftbare Elemente.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — mit [ariaLabelledBy] benennen</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-name-good-label">Diagrammtyp</span>
                <p-select
                  [ariaLabelledBy]="'dd-name-good-label'"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Der Input landet auf dem Element, das tatsächlich <code>role="combobox"</code> trägt, also sagt das
              Steuerelement „Diagrammtyp“ und den Wert getrennt an.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine lange Liste ohne Einstieg</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-long-bad-label">Land, ungefiltert</span>
              <p-select
                [ariaLabelledBy]="'dd-long-bad-label'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Land wählen"
                [ngModel]="ddLong()"
                (ngModelChange)="ddLong.set($event)"
              />
            </div>
            <p class="dd__why">
              {{ countryOptions.length }} Optionen hinter einer Scrollleiste. Type-ahead gibt es, aber es vergleicht
              nur das erste Zeichen und ist für den Nutzer unsichtbar.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Filter ergänzen</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-long-good-label">Land, gefiltert</span>
              <p-select
                [ariaLabelledBy]="'dd-long-good-label'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Land wählen"
                [filter]="true"
                filterBy="label"
                filterPlaceholder="Tippen, um die Liste einzugrenzen"
                ariaFilterLabel="Tippen, um die Liste einzugrenzen"
                emptyFilterMessage="Kein Land passt zu diesem Text"
                [ngModel]="ddLong()"
                (ngModelChange)="ddLong.set($event)"
              />
            </div>
            <p class="dd__why">
              Ein sichtbares Textfeld, verglichen über <code>filterBy</code>. Übersetze <code>filterPlaceholder</code>,
              <code>ariaFilterLabel</code> und <code>emptyFilterMessage</code> — das sind deine Texte, nicht die der
              Bibliothek.
            </p>
          </div>
        </div>

        <h3>Ein Platzhalter ist keine Beschriftung</h3>
        <p>
          <code>placeholder</code> verschwindet, sobald ein Wert gewählt ist, also kann er nicht der Name des
          Steuerelements sein. Hier ist er wenigstens optisch abgesetzt: <code>.p-select-label.p-placeholder</code>
          liest <code>--p-select-placeholder-color</code>, im hellen Modus ein gedämpftes Grau und im dunklen Modus
          <code>--control-placeholder</code> des Kits (sein Verhältnis je visuellem Stil steht in der Zeile „field
          placeholder“ von <code>docs/generated/CONTRAST.MD</code>), während ein gewählter Wert
          <code>--text-color</code> liest. Jedes <code>color … !important</code> auf <code>.p-select-label</code>
          würde diesen Unterschied löschen, weil alle drei Zustände auf diesem einen Element sitzen. Abgesetzt oder
          nicht: Liefere immer eine sichtbare Beschriftung neben dem Steuerelement und lass
          <code>[ariaLabelledBy]</code> auf sie zeigen.
        </p>

        <h3>Sortiere die Optionen für den Leser, nicht für die Datenbank</h3>
        <ul>
          <li>
            <strong>Zuerst die natürliche Reihenfolge</strong> — Größen gehen S, M, L; Monate von Januar bis Dezember.
            Alphabetisch ist eine Notlösung, kein Standard.
          </li>
          <li>
            <strong>Sortiere übersetzte Beschriftungen mit <code>localeCompare</code></strong
            >, in der aktiven Sprache — eine Sortierung nach Byte-Reihenfolge setzt „Österreich“ hinter „Zypern“.
          </li>
          <li>
            <strong>Sortiere nie um, während das Overlay offen ist.</strong> Die Liste wird über
            <code>aria-activedescendant</code> gesteuert; wer Einträge unter dem Cursor verschiebt, verschiebt die
            Auswahl, auf die der Nutzer gerade zielt.
          </li>
          <li>
            <strong>Gruppiere mit <code>[group]="true"</code></strong> nur, wenn die Gruppen dem Leser etwas bedeuten —
            und lies vorher den Vorbehalt im Tab Entwicklung, denn Optimus kennzeichnet Gruppen-Header als Optionen.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — APG, Select-Only Combobox example</a
            >
            — genau der Tastaturvertrag, gegen den dieser Guide die Komponente prüft, einschließlich „Down Arrow opens
            the listbox without moving focus or changing selection“ und „Escape closes the listbox and sets visual
            focus on the combobox“.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Combobox pattern</a
            >
            — der Vertrag für Rollen und Zustände (<code>aria-expanded</code>, <code>aria-controls</code>,
            <code>aria-activedescendant</code>) und die Regel, dass der zugängliche Name aus einer echten Beschriftung,
            aus <code>aria-labelledby</code> oder aus <code>aria-label</code> kommt — die Grundlage der
            Benennungstabelle.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#listbox" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>listbox</code> role</a
            >
            — „the listbox role requires ownership of an element using the option or group role“; die Referenz dafür,
            warum ein Gruppen-Header keine
            <code>option</code> sein darf.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.3.1 Info and Relationships</a
            >
            — die Beziehung zwischen Beschriftung und Steuerelement muss programmatisch sein, nicht nur optisch; genau
            daran scheitert hier das Muster <code>&lt;label for&gt;</code> lautlos.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — das Kriterium, das scheitert, wenn die einzige Fokus-Anzeige eines Steuerelements eine Randfarbe ist, die
            ein Stylesheet-Override schon festgenagelt hat. Das Kit erfüllt es in beiden Themes mit einer expliziten
            Outline <code>.p-select.p-focus</code> in <code>styles.scss</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 für Fokus-Anzeigen und Grenzen von Steuerelementen; der Maßstab für einen Fokus-Zustand, der nur ein
            Wechsel der Randfarbe um 1px ist.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — die Liste der <em>beschriftbaren</em> Elemente. Ein <code>&lt;span&gt;</code> gehört nicht dazu, und
            das ist der Mechanismus hinter dem scheiternden Namen.
          </li>
          <li>
            <a href="https://primeng.org/select" target="_blank" rel="noopener noreferrer">
              PrimeNG — Select component</a
            >
            — die Upstream-API von v21 (Inputs, Outputs, Templates), die Optimus geforkt hat, übertragen auf die
            Konventionen des Kits und dann gegen die ausgelieferte Optimus-Quelle geprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>
          <code>p-select</code> rendert <strong>kein natives <code>&lt;select&gt;</code></strong
          >. Das Host-Element selbst ist das sichtbare Steuerelement (<code>display: inline-flex</code>,
          <code>class="p-select"</code>), und das fokussierbare Element darin ist ein Span:
        </p>
        <ul>
          <li>
            <strong>Root</strong> — der Host <code>&lt;p-select&gt;</code>: Hintergrund, 1px Rand, Radius und jede
            Zustandsklasse (<code>p-focus</code>, <code>p-disabled</code>, <code>p-invalid</code>,
            <code>p-variant-filled</code>).
          </li>
          <li>
            <strong>Label</strong> — <code>span.p-select-label</code> mit <code>role="combobox"</code>,
            <code>tabindex="0"</code>, <code>aria-haspopup="listbox"</code>, <code>aria-expanded</code> und
            <code>id</code> = deine <code>inputId</code>. <em>Dieses</em> Element bekommt den Fokus und trägt den
            zugänglichen Namen.
          </li>
          <li>
            <strong>Leeren-Icon</strong> — erscheint mit <code>[showClear]="true"</code>, sobald ein Wert existiert;
            positioniert mit <code>inset-inline-end</code>, also logisch und sicher für RTL.
          </li>
          <li>
            <strong>Dropdown-Trigger</strong> — <code>div.p-select-dropdown</code>, 2.5rem breit,
            <code>role="button"</code> mit einem fest eingebauten englischen
            <code>aria-label="dropdown trigger"</code> (siehe den Tab i18n).
          </li>
          <li>
            <strong>Overlay</strong> — <code>div.p-select-overlay</code>, teleportiert in einen Wrapper
            <code>.p-overlay-content</code>, <code>min-width: 100%</code> des Triggers.
          </li>
          <li>
            <strong>Liste</strong> — <code>ul[role="listbox"]</code> mit <code>id="&lt;selectId&gt;_list"</code>;
            Optionen sind <code>li[role="option"]</code> — und das sind auch Gruppen-Header und die Leer-Meldung.
          </li>
        </ul>
        <p class="src-note">
          Anatomie gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs</code> (der Span
          <code>#focusInput</code> bei 1688 mit seinem ARIA bei 1699-1708, das Trigger-Div bei 1758, die Liste bei 1871,
          das Gruppen-<code>&lt;li&gt;</code> bei 1874); Rollen im Accessibility Tree bestätigt.
        </p>

        <h3>Größenskala — Tokens und gemessene Höhen</h3>
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
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
                <td>1.125rem (18px)</td>
              </tr>
              <tr>
                <td>padding-block (y)</td>
                <td>0.375rem (6px)</td>
                <td>0.5rem (8px)</td>
                <td>0.625rem (10px)</td>
              </tr>
              <tr>
                <td>padding-inline (x)</td>
                <td>0.625rem (10px)</td>
                <td>0.75rem (12px)</td>
                <td>0.875rem (14px)</td>
              </tr>
              <tr>
                <td><strong>gemessene Höhe des Steuerelements</strong></td>
                <td><strong>33px</strong></td>
                <td><strong>39px</strong></td>
                <td><strong>46px</strong></td>
              </tr>
              <tr>
                <td>Breite des Dropdown-Triggers</td>
                <td colspan="3">2.5rem (40px), alle Größen</td>
              </tr>
              <tr>
                <td>border-radius / border</td>
                <td colspan="3">
                  <code>&#123;form.field.border.radius&#125;</code> (Aura 6px; 0 im visuellen Standardstil) / 1px
                  solid
                </td>
              </tr>
              <tr>
                <td>transition-duration</td>
                <td colspan="3">0.2s</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/select/index.mjs</code>, wobei
          <code>&#123;form.field.*&#125;</code> gegen <code>&#8230;/aura/base/index.mjs</code> aufgelöst wird. Der Radius
          ist die eine Zeile, die die visuellen Stile des Kits ändern: Die <code>presetOverrides</code> jedes Stils in
          <code>src/app/services/ui-styles.ts</code> schreiben die Radius-Skala um (<code>werkbund</code> drückt sie auf
          0). Die drei Höhen sind berechneter Stil: Ein Select hat kein festes Höhen-Token — es ist Inhalt + Padding +
          2px Rand. <strong>Alle drei liegen über der Untergrenze von 24px für Ziele aus WCAG 2.5.8</strong>, aber nur
          der Trigger: Eine einzelne Option im Overlay hat ein Padding von 0.5rem/0.75rem.
        </p>

        <h3>Interaktionszustände — zwei Schichten</h3>
        <p>
          Wie beim Button gestalten zwei Quellen ein Select: die <em>Aura-Token-Schicht</em>, die Optimus mitliefert, und
          die <code>styles.scss</code> dieses Kits. Das Kit biegt <em>Element-Tokens</em> für das ruhende Feld, seine
          Icons und den ungültigen Rand um (damit jede Zustandsregel weiter ihr eigenes Token liest) und ergänzt eine
          Regel mit <code>!important</code>, für den Fokus. Jedes Paar wird in <code>docs/generated/CONTRAST.MD</code>
          geprüft.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Aura-Token-Schicht</th>
                <th>Was dieses Kit tatsächlich rendert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ruhe</td>
                <td>
                  1px <code>&#123;form.field.border.color&#125;</code> auf <code>&#123;form.field.background&#125;</code>
                </td>
                <td>
                  Label in <code>--text-color</code> (beide Themes, über <code>--p-select-color</code>). Rand
                  <code>--control-border</code> in beiden Themes (<code>--p-select-border-color</code>), 3,25&#8211;5,51:1
                  („form field edge“); Chevron und Leeren-Icon <code>--text-color-secondary</code>, 4,79&#8211;7,78:1
                  („form field icon“, Auras surface.400 lag auf Weiß bei 2,56:1). Dunkel: Hintergrund
                  <code>--surface-section</code> (<code>--p-select-background</code>). Alles Element-Tokens, kein
                  <code>!important</code> — die Regeln für deaktiviert und ungültig müssen weiter ihre eigenen Tokens
                  lesen.
                </td>
              </tr>
              <tr>
                <td>Hover</td>
                <td>
                  <code>.p-select:not(.p-disabled):hover</code> → Rand
                  <code>&#123;form.field.hover.border.color&#125;</code>
                </td>
                <td>
                  Wie Aura, beide Themes — die Hover-Regel liest <code>--p-select-hover-border-color</code>, und das
                  lässt das Kit in Ruhe.
                </td>
              </tr>
              <tr>
                <td>focus-visible</td>
                <td>
                  <code>.p-focus</code> → Rand <code>&#123;form.field.focus.border.color&#125;</code>. Aura selbst malt
                  <strong>keinen Ring</strong>: Es setzt die Breite des focusRing auf <code>0</code>, den Stil auf
                  <code>none</code>, den Schatten auf <code>none</code>.
                </td>
                <td>
                  <strong>Kit-Override, beide Themes:</strong> Outline <code>2px solid var(--primary-color-fg)</code>
                  bei <code>2px</code> Offset. Ohne ihn ist der Fokus nur ein Wechsel der Randfarbe um 1px auf die
                  Primärfarbe, <code>outline: 0px none</code>.
                </td>
              </tr>
              <tr>
                <td>deaktiviert</td>
                <td>
                  <code>opacity: 1</code> plus <code>&#123;form.field.disabled.background&#125;</code> und eine gedämpfte
                  Label-Farbe — beachte, dass das <em>nicht</em> die globale Disabled-Opacity 0.6 ist, die Buttons nutzen.
                </td>
                <td>
                  Gleich. Das Kit setzt <code>--p-select-color</code> auf dem Element, statt das Label einzufärben, also
                  kommt Auras <code>&#123;form.field.disabled.color&#125;</code> weiter auf dem Bildschirm an, sichtbar
                  gedämpft gegenüber dem ruhenden <code>--text-color</code>.
                </td>
              </tr>
              <tr>
                <td>ungültig</td>
                <td>
                  <code>.p-invalid</code> → Rand <code>&#123;form.field.invalid.border.color&#125;</code>, Platzhalter
                  in der Fehlerfarbe
                </td>
                <td>
                  Rand <code>--semantic-red-fg</code> in beiden Themes: Die Regel für ungültig liest
                  <code>--p-select-invalid-border-color</code>, und das Kit biegt es auf das Rot um, das jedes Feld nutzt
                  (Auras red.400 lag auf Weiß bei 2,77:1). Die Platzhalterfarbe im ungültigen Zustand kommt aus einer
                  eigenen Regel (<code>.p-select.p-invalid .p-select-label.p-placeholder</code>), die spezifischer ist als
                  die Platzhalter-Regel im Ruhezustand.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Warum der Fokus-Zustand eine eigene Regel braucht.</strong> Aura setzt den Fokus-Ring auf null
          (<code>formField.focusRing</code>, Breite 0 / Stil none / Schatten none, in
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>), damit bleibt der Wechsel der Randfarbe
          über <code>.p-focus</code> die gesamte Fokus-Anzeige — eine dünne Tönung von 1px in beiden Themes, zu wenig,
          um SC 2.4.7 allein zu tragen. Die
          dunkle Ruhe-Regel des Kits berührt diesen Wechsel nicht: Sie biegt <code>--p-select-border-color</code> um,
          während Auras Fokus-Regel <code>--p-select-focus-border-color</code> liest, ein Token daneben. Prüf das in
          deinem eigenen Theme: Fokussiere das Steuerelement und vergleiche <code>getComputedStyle</code> mit seinem
          Ruhezustand.
        </p>
        <p class="src-note">
          <strong>Eine Regel, beide Themes.</strong> <code>styles.scss</code> enthält
          <code
            >.p-select.p-focus &#123; outline: 2px solid var(--primary-color-fg) !important; outline-offset: 2px
            !important; border-color: … !important &#125;</code
          >. Zwei Dinge solltest du wissen, bevor du den Ansatz übernimmst. Stattdessen die Design-Tokens zu füttern
          (<code
            >--p-select-focus-ring-width</code
          >
          und Verwandte) sieht sauberer aus, funktioniert aber <em>nicht</em>: Optimus schreibt diese Tokens auf
          <code>:root</code>, und zwar aus einem zur Laufzeit eingefügten <code>&lt;style&gt;</code>-Tag, der nach
          diesem Stylesheet landet und bei gleicher Spezifität gewinnt — das Token ergibt weiter <code>0</code>. Und das
          <code>!important</code> ist keine Dekoration: Auras eigenes <code>.p-select:not(.p-disabled).p-focus</code>
          ist um eine Klasse spezifischer als die Kit-Regel. Weil sie ins Stylesheet gehört, ändert sich keine
          Aufrufstelle.
        </p>

        <h3>Das Overlay</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teil</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Breite des Overlays</td>
                <td>
                  <code>min-width: 100%</code> des Triggers — es wächst mit langen Optionen und wird nie schmaler als das
                  Steuerelement
                </td>
              </tr>
              <tr>
                <td>Radius / Schatten des Overlays</td>
                <td>
                  <code>&#123;border.radius.md&#125;</code> (folgt dem visuellen Stil);
                  <code>0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)</code>
                </td>
              </tr>
              <tr>
                <td>Padding / Abstand der Liste</td>
                <td>0.25rem / 2px</td>
              </tr>
              <tr>
                <td>Padding / Radius der Option</td>
                <td>0.5rem 0.75rem / <code>&#123;border.radius.sm&#125;</code></td>
              </tr>
              <tr>
                <td>Option — fokussiert</td>
                <td>
                  Der Kit-Ring, innerhalb der Option gezeichnet (<code>.p-select-option.p-focus</code>: 2px
                  <code>--primary-color-fg</code>, Offset -2px), über Auras Tönung
                  <code>--p-select-option-focus-background</code> (<code>&#123;surface.100&#125;</code> / dunkel
                  <code>&#123;surface.800&#125;</code>, 1,10&#8211;1,19:1 auf dem Panel, allein zu blass). Die Option mit
                  <code>.p-focus</code> ist die aktive der Tastatur, und sie folgt auch dem Zeiger. Eine fokussierte
                  <em>gewählte</em> Option behält im dunklen Modus die schlichte Auswahlfüllung. Ring 3,48:1 und mehr auf
                  jeder Füllung, auf die er trifft (<code>CONTRAST.MD</code>, „option list focus“).
                </td>
              </tr>
              <tr>
                <td>Option — gewählt</td>
                <td>
                  <code>&#123;highlight.background&#125;</code> — <code>primary.50</code> im hellen Modus,
                  <code>color-mix(in srgb, primary.400, transparent 84%)</code> im dunklen Modus: in beiden Fällen ein
                  <em>blasser</em> Schleier; kombiniere es mit <code>[checkmark]="true"</code>, wenn die Auswahl nicht zu
                  übersehen sein darf
                </td>
              </tr>
              <tr>
                <td>Gruppen-Header</td>
                <td>font-weight 600, padding 0.5rem 0.75rem</td>
              </tr>
              <tr>
                <td>Scroll-Höhe</td>
                <td>
                  <code>scrollHeight</code>, Standard <code>200px</code> — darüber scrollt die Liste; ab einigen hundert
                  Optionen nimm <code>[virtualScroll]</code> mit <code>virtualScrollItemSize</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen aus <code>&#64;openng/optimus-ui-themes/dist/aura/select/index.mjs</code> und
          <code>&#8230;/aura/base/index.mjs</code>. Im dunklen Modus zwingt <code>styles.scss</code> zusätzlich das
          Overlay auf <code>--surface-card</code>, den Optionstext auf <code>--text-color</code> und den Hover der Option
          auf <code>--surface-hover</code> (alle <code>!important</code>). Das Overlay wird in einen Wrapper
          <code>.p-overlay-content</code> gehängt, also kann eine Aufrufstelle, die ihren eigenen Container beschneidet
          (<code
            >overflow: hidden</code
          >), die Liste trotzdem abschneiden — genau das umgehen die Stellen im Kit, die <code>appendTo="body"</code>
          nutzen.
        </p>

        <h3>Das Label wird gekürzt — es bricht nie um</h3>
        <p>
          <code>.p-select-label</code> ergibt
          <code>white-space: nowrap; overflow: hidden; text-overflow: ellipsis</code> (gemessen). Eine lange
          Options-Beschriftung wird bei jeder Breite des Steuerelements mit Auslassungspunkten abgeschnitten, und das
          <em>Overlay</em> darf breiter sein als der Trigger, der Trigger aber nicht. Gib einem Select mit übersetzten
          Beschriftungen echte Breite (<code
            >[style]="&#123; width: '100%' &#125;"</code
          >
          oder <code>styleClass="w-full"</code>, die Kit-Utility in <code>styles.scss</code>), und teste mit der
          längsten Sprache, die du auslieferst.
        </p>
        <p>
          <strong>Schmale Bildschirme:</strong> kein eingebautes responsives Verhalten und kein Breakpoint. Der Host ist
          <code>display: inline-flex</code>, und das Label (<code>flex: 1 1 auto; width: 1%</code>) wird bei jedem
          Viewport gekürzt statt umbrochen; das Overlay ist mindestens so breit wie der Trigger. Hinweis zum Layout: Gib
          dem Select auf Smartphones <code>fluid</code> oder eine Breite von 100% in einem Eltern-Element mit
          <code>min-width: 0</code>.
        </p>

        <h3>Stand WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird auch
          nicht beansprucht. <strong>Erfüllt:</strong> SC 2.1.1 mit dem dokumentierten Tastenmodell — Pfeil runter und
          hoch öffnen, Enter und Space öffnen, Home, End, PageUp und PageDown bewegen, Escape schließt und setzt den
          Fokus zurück, druckbare Zeichen springen per Type-ahead — SC 2.4.7 mit der eigenen 2px-Outline des Kits bei
          2px Offset, der Zustand ausdrücklich benannt, weil Aura den Fokus-Ring auf null setzt und nur eine Randtönung
          von 1px übrig lässt, und SC 2.5.8 für den Trigger,
          gemessen mit 33px, 39px und 46px über die drei Größen. <strong>Nicht erfüllt:</strong> SC 4.1.2 —
          Gruppen-Header und die Leer-Meldung sind innerhalb der Listbox als <code>role="option"</code> exponiert, und
          der Dropdown-Trigger trägt einen fest eingebauten englischen Namen; beides liegt upstream und ist weder über
          einen Input noch über den Übersetzungsdienst erreichbar. <strong>Bedingt:</strong> SC 4.1.2 für den
          zugänglichen Namen, der nur über <code>ariaLabelledBy</code> oder <code>ariaLabel</code> ankommt — eine native
          Label-Verknüpfung oder ein Attribut auf dem Host fallen beide darauf zurück, den aktuellen Wert als Namen
          anzusagen; und SC 2.5.8, das der Trigger erfüllt, eine Option im Overlay mit ihrem Padding von 0.5rem 0.75rem
          aber nicht. <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>SelectModule</code> exportiert die Komponente <code>&lt;p-select&gt;</code>. Eine Direktiven-Form gibt
          es nicht. Sie ist ein <code>ControlValueAccessor</code>, funktioniert also mit <code>[(ngModel)]</code> und
          mit Reactive Forms — aber unter „Formulare“ unten steht, was sie <em>nicht</em> tut.
        </p>

        <h3>Wichtige Inputs</h3>
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
                <td><code>options</code></td>
                <td>any[]</td>
                <td>
                  Die Liste. Binde ein <code>computed()</code>, damit übersetzte Beschriftungen bei einem Sprachwechsel
                  neu gerendert werden.
                </td>
              </tr>
              <tr>
                <td><code>optionLabel</code></td>
                <td>string</td>
                <td>Eigenschaft mit dem sichtbaren Text.</td>
              </tr>
              <tr>
                <td><code>optionValue</code></td>
                <td>string</td>
                <td>Eigenschaft mit dem Modellwert. Lässt du sie weg, wird das ganze Objekt zum Wert.</td>
              </tr>
              <tr>
                <td><code>optionDisabled</code></td>
                <td>string</td>
                <td>Eigenschaft, die eine Option als nicht wählbar markiert.</td>
              </tr>
              <tr>
                <td><code>group</code></td>
                <td>boolean</td>
                <td>
                  Optionen sind Gruppen-Objekte — kombiniere es mit <code>optionGroupLabel</code> und
                  <code>optionGroupChildren</code> (Standard <code>'items'</code>).
                </td>
              </tr>
              <tr>
                <td><code>placeholder</code></td>
                <td>string</td>
                <td>Wird angezeigt, solange der Wert leer ist. Keine Beschriftung (siehe Verwendung).</td>
              </tr>
              <tr>
                <td><code>showClear</code></td>
                <td>boolean</td>
                <td>Ergänzt ein Leeren-Icon, sobald ein Wert existiert; sendet <code>onClear</code>.</td>
              </tr>
              <tr>
                <td><code>filter</code></td>
                <td>boolean</td>
                <td>
                  Suchfeld im Header des Overlays. <code>filterBy</code> = kommagetrennte Felder,
                  <code>filterMatchMode</code> = standardmäßig <code>'contains'</code>, <code>filterLocale</code> für
                  Groß- und Kleinschreibung nach Gebietsschema.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  <strong>Der einzige zugängliche Name, der funktioniert.</strong> Sie landen auf dem Element mit
                  <code>role="combobox"</code>.
                </td>
              </tr>
              <tr>
                <td><code>ariaFilterLabel</code></td>
                <td>string</td>
                <td>Zugänglicher Name des Filterfelds.</td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  Setzt die <code>id</code> des Combobox-Spans. Nützlich für Tests und als Ziel von
                  <code>aria-describedby</code> — es bringt <code>&lt;label for&gt;</code> <strong>nicht</strong> zum
                  Laufen.
                </td>
              </tr>
              <tr>
                <td><code>emptyMessage</code> / <code>emptyFilterMessage</code></td>
                <td>string</td>
                <td>Deine Texte für „keine Optionen“ und „nichts gefunden“. Übersetze beide.</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Weglassen für den Standard (geerbt von <code>BaseInput</code>).</td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'filled' | 'outlined'</td>
                <td>
                  Standard <code>'outlined'</code> — das Kit setzt <code>inputStyle: 'outlined'</code> global in
                  <code>app.config.ts</code>.
                </td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>Nimmt 100% des Containers ein (oder erbt es von einem Vorfahren <code>p-fluid</code>).</td>
              </tr>
              <tr>
                <td><code>disabled</code> / <code>invalid</code> / <code>required</code> / <code>name</code></td>
                <td>boolean / string</td>
                <td>
                  Aus <code>BaseEditableHolder</code>; <code>required</code> setzt zusätzlich <code>aria-required</code>.
                </td>
              </tr>
              <tr>
                <td><code>loading</code></td>
                <td>boolean</td>
                <td>Spinner im Trigger; solange true, werden Tasten ignoriert.</td>
              </tr>
              <tr>
                <td><code>checkmark</code></td>
                <td>boolean</td>
                <td>
                  Ergänzt ein Häkchen-Icon an der gewählten Option — lohnt sich, so blass wie die Auswahltönung ist.
                </td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td>Signal-Input</td>
                <td>
                  <code>'body'</code> entkommt einem beschneidenden Vorfahren. Kostet dich das CSS-Containment, also
                  grenze jedes Overlay-Styling über <code>panelStyleClass</code> ein.
                </td>
              </tr>
              <tr>
                <td><code>virtualScroll</code> + <code>virtualScrollItemSize</code></td>
                <td>boolean + number</td>
                <td>Für sehr lange Listen; die Eintragsgröße ist Pflicht und fest.</td>
              </tr>
              <tr>
                <td><code>editable</code></td>
                <td>boolean</td>
                <td>
                  Tauscht den Span gegen ein echtes <code>&lt;input&gt;</code> und lässt den Nutzer einen freien Wert
                  tippen. Wenn du das brauchst, willst du wahrscheinlich <code>p-autocomplete</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs geprüft gegen <code>&#64;openng/optimus-ui/types/openng-optimus-ui-select.d.ts</code> (Optimus UI
          2.0.2, <code>node_modules/&#64;openng/optimus-ui/package.json</code>); <code>size</code>, <code>variant</code>,
          <code>fluid</code> aus <code>openng-optimus-ui-baseinput.d.ts</code> und <code>disabled</code> /
          <code>invalid</code> / <code>required</code> / <code>name</code> aus
          <code>openng-optimus-ui-baseeditableholder.d.ts</code>.
        </p>

        <h3>Outputs</h3>
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
                <td><code>SelectChangeEvent</code></td>
                <td>Ein Wert wurde gewählt — <code>$event.value</code> ist der neue Modellwert.</td>
              </tr>
              <tr>
                <td><code>onFilter</code></td>
                <td><code>SelectFilterEvent</code></td>
                <td>
                  Der Filtertext hat sich geändert (nutz das, um mit <code>[lazy]</code> eine Abfrage am Server
                  auszulösen).
                </td>
              </tr>
              <tr>
                <td><code>onClear</code></td>
                <td><code>EventEmitter&lt;Event&gt;</code></td>
                <td>Das Leeren-Icon wurde benutzt.</td>
              </tr>
              <tr>
                <td><code>onShow</code> / <code>onHide</code></td>
                <td><code>EventEmitter&lt;AnimationEvent&gt;</code></td>
                <td>Overlay geöffnet / geschlossen.</td>
              </tr>
              <tr>
                <td><code>onFocus</code> / <code>onBlur</code></td>
                <td><code>EventEmitter&lt;Event&gt;</code></td>
                <td>Die Combobox hat den Fokus bekommen / verloren.</td>
              </tr>
              <tr>
                <td><code>onLazyLoad</code></td>
                <td><code>SelectLazyLoadEvent</code></td>
                <td>Das virtuelle Scrollen braucht den nächsten Abschnitt.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Genaue Emitter-Typen aus der Klasse <code>Select</code> in
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-select.d.ts</code>.
        </p>

        <h3>Templates</h3>
        <p>
          Projiziere ein Template über seinen Referenznamen (<code>#item</code>, <code>#selectedItem</code>, &#8230;),
          wenn die Inputs den Inhalt nicht ausdrücken können. (Optimus hat die Content-Query <code>PrimeTemplate</code>
          aus v21 zurückgebracht, also bindet die ältere Form <code>pTemplate="item"</code> wieder —
          <code>openng-optimus-ui-select.mjs:941-996</code> — aber Referenznamen bleiben die Konvention des Kits.) Die
          Schriftauswahl des Kits ist das
          Referenzmuster: Sie rendert jede Option in ihrer eigenen Schrift, über <code>item</code> +
          <code>selectedItem</code>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Ersetzt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#item</code></td>
                <td>Eine Optionszeile im Overlay.</td>
              </tr>
              <tr>
                <td><code>#selectedItem</code></td>
                <td>
                  Den im Trigger angezeigten Wert. Definiere es immer dann, wenn du <code>item</code> definierst, sonst
                  widersprechen sich Trigger und Liste.
                </td>
              </tr>
              <tr>
                <td><code>#group</code></td>
                <td>Eine Gruppen-Header-Zeile.</td>
              </tr>
              <tr>
                <td><code>#header</code> / <code>"footer"</code></td>
                <td>Rahmen über / unter der Liste.</td>
              </tr>
              <tr>
                <td><code>#filter</code></td>
                <td>Die ganze Filterzeile (dann ist ihr zugänglicher Name deine Sache).</td>
              </tr>
              <tr>
                <td><code>#empty</code> / <code>"emptyfilter"</code></td>
                <td>Die Zeilen „hier ist nichts“ / „nichts gefunden“.</td>
              </tr>
              <tr>
                <td>
                  <code>#dropdownicon</code>, <code>"clearicon"</code>, <code>"filtericon"</code>,
                  <code>"loadingicon"</code>
                </td>
                <td>Die vier Icons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ templateSnippet }}</code></pre>
        <p class="src-note">
          Slot-Namen aus den Content-Queries in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs</code> (<code>itemTemplate</code>,
          <code>groupTemplate</code>, <code>selectedItemTemplate</code>, <code>headerTemplate</code>,
          <code>filterTemplate</code>, <code>footerTemplate</code>, <code>emptyFilterTemplate</code>,
          <code>emptyTemplate</code>, <code>dropdownIconTemplate</code>, <code>loadingIconTemplate</code>,
          <code>clearIconTemplate</code>, <code>filterIconTemplate</code>).
        </p>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>
          Jedes Select-Token ist als <code>--p-select-*</code> verfügbar. Geometrie kommt durch (der Radius folgt dem
          aktiven visuellen Stil); <strong>bei Farbe ist es gemischt</strong> — das Kit biegt mehrere dieser Tokens in
          <code>styles.scss</code> selbst um, und seine Fokus-Regel ist <code>!important</code>:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom Property</th>
                <th>Steuert</th>
                <th>Setzt sich in diesem Kit durch?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-select-border-radius</code></td>
                <td>Eckenradius (Aura 6px; die Radius-Skala des visuellen Stils).</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-select-padding-x</code> / <code>-y</code></td>
                <td>Padding des Triggers.</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-select-dropdown-width</code></td>
                <td>Spalte des Trigger-Icons (2.5rem).</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-select-option-padding</code> / <code>--p-select-option-border-radius</code></td>
                <td>Optionszeilen.</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-select-border-color</code></td>
                <td>Rand im Ruhezustand.</td>
                <td>
                  Nein — <code>.p-select</code> in <code>styles.scss</code> deklariert es auf dem Element
                  (<code>--control-border</code>, beide Themes), und das schlägt einen geerbten Wert. Dasselbe gilt für
                  <code>--p-select-dropdown-color</code>, <code>-clear-icon-color</code> und
                  <code>-invalid-border-color</code>.
                </td>
              </tr>
              <tr>
                <td><code>--p-select-focus-border-color</code></td>
                <td>Rand im Fokus.</td>
                <td>
                  Nein — <code>.p-select.p-focus</code> in <code>styles.scss</code> setzt <code>border-color</code>
                  selbst, mit <code>!important</code> in beiden Themes, also erreicht das Token den Rand nie.
                </td>
              </tr>
              <tr>
                <td><code>--p-select-placeholder-color</code></td>
                <td>Platzhaltertext.</td>
                <td>
                  Nur hell — das dunkle Theme biegt es auf <code>--control-placeholder</code> um (Verhältnis je Stil in
                  <code>docs/generated/CONTRAST.MD</code>, „field placeholder“).
                </td>
              </tr>
              <tr>
                <td><code>--p-select-focus-ring-width</code></td>
                <td>Fokus-Outline.</td>
                <td>
                  Nein — Optimus schreibt die Fokus-Ring-Tokens auf <code>:root</code> neu, aus einem zur Laufzeit
                  eingefügten <code>&lt;style&gt;</code>-Tag, der zuletzt landet. Die Outline
                  <code>.p-select.p-focus</code> des Kits ist der Ring.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> wird in <code>app.config.ts</code> gesetzt (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). Die beiden Override-Regeln stehen wörtlich im Tab Design.
        </p>

        <h3>Formulare</h3>
        <p>
          <code>p-select</code> ist ein <code>ControlValueAccessor</code>, also funktionieren <code>[(ngModel)]</code>,
          <code>formControlName</code> und Validierung. Was es <strong>nicht</strong> ist: ein Formularelement im Sinne
          von HTML. Im Standardmodus (nicht <code>editable</code>) rendert es überhaupt kein <code>&lt;input&gt;</code>,
          kein <code>&lt;select&gt;</code> und kein verstecktes Feld, also trägt ein natives Absenden des Formulars
          nichts davon mit — der Wert lebt nur im Angular-Modell. Wenn eine Seite ohne JavaScript funktionieren muss,
          nimm ein natives <code>&lt;select&gt;</code>.
        </p>
        <p class="src-note">
          Geprüft gegen <code>openng-optimus-ui-select.mjs</code> (Optimus UI 2.0.2): Die Zeichenkette
          <code>type="hidden"</code> kommt in der Datei nicht vor, und der nicht editierbare Zweig rendert nur den
          <code>&lt;span&gt;</code>.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Benennung: drei Muster, eins funktioniert</h4>
        <p>
          Die Spalte „Name“ zeigt, was ein Screenreader für ein Select ansagt, das die Option
          <em>Balkendiagramm</em> unter der Beschriftung <em>Diagrammtyp</em> zeigt:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Muster</th>
                <th>Zugänglicher Name</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>[attr.aria-label]="…"</code> auf <code>&lt;p-select&gt;</code></td>
                <td>„Balkendiagramm“ — der aktuelle Wert</td>
                <td>
                  <strong>Scheitert.</strong> Das Attribut landet auf dem Host, und der hat keine Rolle; die
                  Hilfstechnologie sieht es nie.
                </td>
              </tr>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>„Balkendiagramm“ — der aktuelle Wert</td>
                <td>
                  <strong>Scheitert.</strong> <code>&lt;label for&gt;</code> bindet sich nur an beschriftbare Elemente;
                  die Combobox ist ein <code>&lt;span&gt;</code>.
                </td>
              </tr>
              <tr>
                <td><code>[ariaLabelledBy]="'x-label'"</code> (oder <code>ariaLabel</code>)</td>
                <td>Name „Diagrammtyp“, Wert „Balkendiagramm“</td>
                <td>
                  <strong>Funktioniert.</strong> Der Input wird an das Element mit <code>role="combobox"</code>
                  gebunden.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gemessen im Accessibility Tree; der Mechanismus steht in der Optimus-Quelle.
          <code>ariaLabel</code> / <code>ariaLabelledBy</code> werden als <code>[attr.aria-label]</code> /
          <code>[attr.aria-labelledby]</code> an den Span <code>#focusInput</code> gebunden
          (<code>openng-optimus-ui-select.mjs:1701-1702</code>), und wenn <code>ariaLabel</code> leer ist, ist der
          Rückfall <code>label()</code> — der Text der gewählten Option. Deshalb sagt ein unbenanntes Select seinen
          <em>Wert</em> als seinen <em>Namen</em> an, und deshalb scheitern beide gescheiterten Muster auf dieselbe Weise.
          Prüf das in deinem eigenen Build: Untersuche den Combobox-Knoten im Accessibility Tree des Browsers — der Name
          muss die Beschriftung sein, nicht der aktuelle Wert.
        </p>

        <h4>Tastatur</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Geschlossen</th>
                <th>Offen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>Fokus hinein / hinaus (der Span hat <code>tabindex="0"</code>).</td>
                <td>Schließt das Overlay und geht weiter.</td>
              </tr>
              <tr>
                <td><kbd>↓</kbd></td>
                <td>Öffnet die Liste, ohne den Wert zu ändern.</td>
                <td>Fokussiert die nächste Option.</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd></td>
                <td>Öffnet die Liste.</td>
                <td>Fokussiert die vorherige Option.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>—</td>
                <td>Erste / letzte Option.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>—</td>
                <td>Springt eine Seite durch die Liste.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> / <kbd>Space</kbd></td>
                <td>Öffnet die Liste.</td>
                <td>Wählt die fokussierte Option und schließt.</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>—</td>
                <td>
                  Schließt und gibt den Fokus an die Combobox zurück (gemessen: Der Fokus kommt wirklich zurück).
                </td>
              </tr>
              <tr>
                <td>druckbares Zeichen</td>
                <td>Öffnet die Liste und springt zum ersten Treffer.</td>
                <td>Type-ahead innerhalb der Liste.</td>
              </tr>
              <tr>
                <td><kbd>Delete</kbd></td>
                <td>
                  Leert den Wert — nur wenn <code>[showClear]</code> gesetzt ist (onDeleteKey,
                  openng-optimus-ui-select.mjs:1469). <kbd>Backspace</kbd> tut bei einem nicht editierbaren Select nichts
                  (onBackspaceKey, :1569).
                </td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus <code>onKeyDown</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-select.mjs:1265-1328</code> und
          live stichprobenartig geprüft (<kbd>↓</kbd> setzte <code>aria-expanded="true"</code>; <kbd>Esc</kbd> setzte es
          zurück auf <code>false</code>, mit dem Fokus auf der Combobox). Es entspricht dem Vertrag der
          Select-only-Combobox aus der APG, verlinkt unter Quellen. <strong>Mit <code>[filter]="true"</code> ändert
          sich das Bild:</strong> Das Öffnen verschiebt den DOM-Fokus in das Filterfeld <code>&lt;input&gt;</code>,
          also trägt der Filter <code>aria-activedescendant</code>, nicht die Combobox (gemessen:
          <code>aria-activedescendant</code> der Combobox war <code>null</code>, während die Liste offen war).
        </p>

        <h4>Bekannte Lücken upstream — kaschiere sie nicht stillschweigend</h4>
        <ul>
          <li>
            <strong>Gruppen-Header sind Optionen.</strong> Mit <code>[group]="true"</code> rendert Optimus den Header
            als <code>&lt;li class="p-select-option-group" role="option"&gt;</code>
            (<code>openng-optimus-ui-select.mjs:1874</code>). ARIA 1.2 verlangt
            <code>role="group"</code>, also zählt ein Screenreader die Header mit und sagt sie als wählbare Optionen an.
            Halte die Zahl der Gruppen klein, und nimm lieber flache Listen, wenn die Gruppierung nur Dekoration ist.
          </li>
          <li>
            <strong>Die Leer-Meldung ist auch eine Option</strong> — die Zeile „keine Ergebnisse“ ist ebenfalls
            <code>role="option"</code> (<code>openng-optimus-ui-select.mjs:1899</code>), also wird „1 Option“
            angesagt, wenn es keine gibt.
          </li>
          <li>
            <strong>Der Trigger hat einen festen englischen Namen</strong> — <code>aria-label="dropdown trigger"</code>
            ist ein Literal (<code>openng-optimus-ui-select.mjs:1758</code>), weder je Aufrufstelle noch über die
            Übersetzungskonfiguration erreichbar; siehe den Tab i18n.
          </li>
          <li>
            <strong>Ein genullter Fokus-Ring</strong> — Aura liefert ihn so aus, also kann ein Stylesheet, das zusätzlich
            <code>border-color</code> festnagelt, das Steuerelement ganz ohne sichtbaren Fokus-Zustand zurücklassen. Der
            Tab Design zeigt die Kaskade und die zentrale Korrektur des Kits.
          </li>
        </ul>

        <h4>Checkliste für die Abnahme</h4>
        <ul class="checklist">
          <li>
            ☐ Das Steuerelement hat eine sichtbare Beschriftung UND <code>[ariaLabelledBy]</code>, das auf sie zeigt
            (oder <code>ariaLabel</code>, wenn es wirklich keine Beschriftung gibt).
          </li>
          <li>
            ☐ Weder ein <code>&lt;label for&gt;</code> noch ein <code>[attr.aria-label]</code> auf dem Host übernimmt
            die Benennung.
          </li>
          <li>☐ <code>placeholder</code> übernimmt nicht die Aufgabe der Beschriftung.</li>
          <li>
            ☐ Erreichbar mit <kbd>Tab</kbd>, bedienbar mit <kbd>↓</kbd> / <kbd>Enter</kbd> / <kbd>Esc</kbd>;
            <kbd>Esc</kbd> gibt den Fokus an den Trigger zurück.
          </li>
          <li>
            ☐ Der Fokus ist im hellen <strong>und</strong> im dunklen Theme sichtbar — prüf es, nimm es nicht an.
          </li>
          <li>
            ☐ Mit <code>[filter]</code>: <code>ariaFilterLabel</code>, <code>filterPlaceholder</code> und
            <code>emptyFilterMessage</code> sind alle übersetzt.
          </li>
          <li>
            ☐ Options-Beschriftungen kommen aus dem Übersetzungsdienst, und das Array ist ein <code>computed()</code>,
            damit ein Sprachwechsel sie neu rendert.
          </li>
          <li>
            ☐ Das Steuerelement ist breit genug für die längste übersetzte Beschriftung, oder du hast die
            Auslassungspunkte akzeptiert.
          </li>
          <li>
            ☐ Mehr als ~25 Optionen → ein Filter; weniger als ~5 → prüf, ob <code>p-radiobutton</code> oder
            <code>p-selectbutton</code> das bessere Steuerelement ist.
          </li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die Benennungsregel festschreibt — sie prüft, dass das
          <em>Combobox</em>-Element den Namen trägt, nicht der Host:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Deine Texte</h3>
        <ul>
          <li>
            <strong>Options-Beschriftungen sind Inhalt, kein Code.</strong> Bau das Array in einem
            <code>computed()</code>, das den <code>TranslationService</code> des Kits aufruft, damit ein Sprachwechsel
            die Beschriftungen neu aufbaut; ein einfaches Feld wird einmal erfasst und veraltet.
          </li>
          <li>
            <strong>Fünf Inputs brauchen eine Übersetzung, nicht einer</strong> — <code>placeholder</code>,
            <code>filterPlaceholder</code>, <code>ariaFilterLabel</code>, <code>emptyMessage</code> und
            <code>emptyFilterMessage</code>. Das Gate für rohe Schlüssel (<code>check-i18n-keys.mjs</code>) hilft nur
            bei Schlüsseln, die du tatsächlich referenzierst.
          </li>
          <li>
            <strong>Sortiere nach dem Übersetzen.</strong> Sortiere das gebaute Array mit <code>localeCompare</code> in
            der aktiven Sprache, nie die Quellliste nach ihren englischen Beschriftungen.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Zwei Texte kommen von Optimus, nicht aus deinem Template</h3>
        <p>
          Das <code>aria-label</code> der Listbox und das <code>aria-label="dropdown trigger"</code> des Triggers werden
          jedem Screenreader-Nutzer angesagt und tauchen nirgends in deinem Markup auf. Sie sind <em>nicht</em>
          dasselbe Problem:
        </p>
        <ul>
          <li>
            <strong>Das Label der Listbox lässt sich korrigieren.</strong> Sein Standard ist das englische Literal
            <code>'Option List'</code> (<code>openng-optimus-ui-config.mjs:227</code>), überschreibbar über den
            Schlüssel <code>aria.listLabel</code> des Optimus-Übersetzungsdienstes. Weil es ein <em>Dienst</em> ist und
            kein statischer Provider-Wert, muss eine mehrsprachige App ihn bei jedem Sprachwechsel neu setzen — ein
            Block <code>translation</code>, einmal an <code>provideOptimus</code> übergeben, würde die App in einer
            Sprache einfrieren. Das Kit hält die Texte deshalb in seiner eigenen i18n-Schicht
            (<code>assets/i18n/modules/&lt;lang&gt;/optimus.json</code>) und schiebt sie über
            <code>Optimus.setTranslation</code> aus einem Effect auf die aktive Sprache hinein; ein deutscher Leser hört
            „Optionsliste“. Beachte, dass <code>setTranslation</code> nur eine Ebene tief zusammenführt, also wird der
            Block <code>aria</code> komplett ersetzt — spreize den aktuellen hinein, sonst gehen die Schlüssel verloren,
            die du nicht aufgeführt hast.
          </li>
          <li>
            <strong>Das Label des Triggers nicht.</strong> <code>aria-label="dropdown trigger"</code> ist ein fest
            eingebautes Literal im Template der Komponente (<code>openng-optimus-ui-select.mjs:1758</code>), weder über
            den Übersetzungsdienst noch über einen Input an der Aufrufstelle erreichbar. Übrig bleiben eine Korrektur
            upstream oder ein Override über <code>pt</code> (Pass-through); dieser Guide beansprucht keinen
            funktionierenden Workaround.
          </li>
        </ul>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>
        <p class="src-note">
          Der Schlüssel ist <code>aria</code> (<code>Translation.aria</code>), nicht <code>ariaLabel</code>; derselbe
          Block trägt auch <code>removeLabel</code>, <code>previous</code>/<code>next</code> und die Labels zum
          Maximieren, auf die die Guides zu Tag, Tabs und Dialog verweisen. Abgeleitete Kits, die diesen Schritt
          auslassen, liefern in jeder Sprache die englischen Standardwerte aus.
        </p>

        <h3>Länge: Der Trigger kürzt, das Overlay nicht</h3>
        <p>
          Deutsche Options-Beschriftungen sind 20–40% länger als englische („Streudiagramm“ gegenüber „Scatter“), und
          der Trigger schneidet mit Auslassungspunkten ab, statt umzubrechen (gemessen im Tab Design). Zwei Folgen: Gib
          Selects mit übersetzten Beschriftungen eine explizite Breite, und lass das Label nie den einzigen Ort sein, an
          dem ein Wert lesbar ist — wenn die Wahl nach dem Schließen des Dropdowns wichtig ist, wiederhole sie im
          umgebenden Text.
        </p>

        <h3>Filtern über Sprachen hinweg</h3>
        <ul>
          <li>
            <code>filterMatchMode</code> ist standardmäßig <code>'contains'</code>, und der Vergleich ignoriert Groß- und
            Kleinschreibung über <code>filterLocale</code>. Setz es auf die aktive Sprache, sonst passen das türkische i
            mit und ohne Punkt (und Ähnliches) nicht.
          </li>
          <li>
            Das Filtern ignoriert diakritische Zeichen <strong>nicht</strong>: Wer „osterreich“ tippt, findet
            „Österreich“ nicht. Wenn deine Optionen Akzente tragen, ergänze ein normalisiertes Suchfeld und lass
            <code>filterBy</code> auf beide zeigen — genau das macht der Schnellwechsel der Guide-Shell selbst mit
            <code>filterBy="label,search"</code>.
          </li>
        </ul>

        <h3>RTL: Hier passt es</h3>
        <p>
          Anders als <code>iconPos</code> beim Button baut das Select auf logischen Eigenschaften auf: Der Trigger nutzt
          <code>border-start-end-radius</code> und das Leeren-Icon <code>inset-inline-end</code>, also spiegeln sich
          beide unter <code>direction: rtl</code> korrekt. Heute ist hier nichts verdrahtet — das Kit liefert nur
          LTR-Sprachen aus —, aber eine abgeleitete RTL-Erweiterung braucht für diese Komponente keine Arbeit je
          Aufrufstelle.
        </p>
        <p class="src-note">
          Gelesen aus den ausgelieferten Stylesheet-Regeln für <code>.p-select-dropdown</code> und
          <code>.p-select-clear-icon</code>. Nicht gegen ein gerendertes RTL-Gebietsschema geprüft.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Abgeglichen mit den Runden zu Kontrast und Fokus: Der Rand im
            Ruhezustand ist <code>--control-border</code> in beiden Themes, Chevron und Leeren-Icon
            <code>--text-color-secondary</code>, der ungültige Rand <code>--semantic-red-fg</code>, und die per Tastatur
            aktive Option trägt den Kit-Ring in sich, jeweils belegt mit ihrer Zeile aus CONTRAST.MD; die Tabellen zu
            Zuständen, Overlay und Theming sagen das.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Tabellen zu Zuständen und Theming neu gefasst für den Ansatz mit
            Element-Tokens und die visuellen Stile: Hover- und Fehler-Ränder kommen in beiden Themes an, die
            Fokus-Ring-Tokens sind kein funktionierender Override, Farben werden als Tokens benannt (Verhältnisse in
            <code>docs/generated/CONTRAST.MD</code>), Radien folgen dem Stil. Zeilenverweise zur Tastatur korrigiert
            (:1469, :1569); Verhalten auf schmalen Bildschirmen beschrieben.
          </li>
          <li>
            <strong>v0.5</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014). Zwei Aussagen aus v22
            kehren sich um: <code>pTemplate</code> bindet wieder (die Content-Query <code>PrimeTemplate</code> aus v21
            ist zurück, abgebildet in <code>onAfterContentInit</code>, :941-996), und
            <code>ariaLabel</code>/<code>ariaLabelledBy</code> sind wieder einfache Inputs, mit dem Rückfall für einen
            leeren Namen direkt im Template (:1701-1702), kein <code>$ariaLabel</code> als computed. Zeilenverweise
            gegen die Optimus-Bundles neu ermittelt (Combobox-Span :1700, Gruppen-Header :1874, Leer-Zeile :1899,
            „dropdown trigger“ :1758, <code>onKeyDown</code> :1265-1328, Konfiguration <code>'Option List'</code>
            :227); der Einstiegspunkt für Übersetzungen ist <code>Optimus.setTranslation</code>. Aura ist zurück auf
            2.x: Der Dropdown-Trigger misst wieder 2.5rem, passend zu dem, was die Größentabelle schon zeigte.
          </li>
          <li>
            <strong>v0.4</strong> — 23.08.2026 — Erneut geprüft gegen PrimeNG 22.1: Alle Befunde zu Benennung und Rollen
            gelten unverändert weiter (Combobox-Span, Gruppen-Header als <code>role="option"</code>, das fest eingebaute
            Literal „dropdown trigger“ — jetzt bei :1802), Templates binden über Referenznamen (<code>#item</code>,
            <code>#selectedItem</code>; <code>pTemplate</code> ist in v22 tot), und das Demo-Markup wurde migriert.
            Aura 3.0: Dropdown-Breite 2.5→2.25rem, Abstände des Häkchens angepasst; Farben unverändert. Zeilenverweise
            gegen 22.1.2 neu ermittelt.
          </li>
          <li>
            <strong>v0.3</strong> — 20.08.2026 — Zusammenfassung zum Stand WCAG 2.2 im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht
            beansprucht.
          </li>
          <li>
            <strong>v0.2</strong> — 30.07.2026 — Redaktioneller Durchgang: Belege auf Zitate gekürzt; die
            Benennungstabelle als Muster statt als Aufrufstellen neu gefasst; der Abschnitt i18n rund um den
            Übersetzungsdienst und den Effect beim Sprachwechsel neu geschrieben.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erster Guide: die Tabelle zur Wahl des Steuerelements, ein
            Live-Playground, drei gerenderte Do/Don’t-Paare, der Tab Design zu Aura und das kanonische Agent-Dokument.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class SelectArticleDeComponent extends SelectArticleComponent {
  /** Chart types with German labels; values and icons stay as in English. */
  override readonly chartOptions: SelectArticleComponent['chartOptions'] = this.chartOptions.map((o) => ({ ...o, label: CHART_DE[o.value] ?? o.label }));

  override readonly groupedChartOptions = [
    {
      label: 'Vergleich',
      items: [
        { label: CHART_DE['bar'], value: 'bar' },
        { label: CHART_DE['grouped-bar'], value: 'grouped-bar' },
      ],
    },
    {
      label: 'Verlauf über die Zeit',
      items: [
        { label: CHART_DE['line'], value: 'line' },
        { label: CHART_DE['area'], value: 'area' },
      ],
    },
    {
      label: 'Verteilung',
      items: [
        { label: CHART_DE['scatter'], value: 'scatter' },
        { label: CHART_DE['heatmap'], value: 'heatmap' },
      ],
    },
  ];

  override readonly binaryOptions: SelectArticleComponent['binaryOptions'] = this.binaryOptions.map((o) => ({ ...o, label: OPTION_DE[o.value] ?? o.label }));

  /** Country names in German, sorted for a German reader (the guide's own rule); values stay English. */
  override readonly countryOptions: SelectArticleComponent['countryOptions'] = this.countryOptions
    .map((o) => ({ ...o, label: COUNTRY_DE[o.value] ?? o.label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'de'));

  override readonly sizeOptions: SelectArticleComponent['sizeOptions'] = this.sizeOptions.map((o) => ({ ...o, label: OPTION_DE[o.value] ?? o.label }));

  override readonly ddNameLabel = computed(
    () => this.chartOptions.find((o) => o.value === this.ddName())?.label ?? 'Diagrammtyp',
  );

  override readonly examples: SelectArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));
}
