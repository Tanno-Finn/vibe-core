import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AutoCompleteArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES, City } from './autocomplete-article.component';

/**
 * German twin of the AutoComplete guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings held in class
 * fields (city list, select options, example titles and notes) are German. Keep it in
 * step with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs autocomplete`).
 */
@Component({
  selector: 'app-autocomplete-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'autocomplete'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jedes Steuerelement hier unten ist ein echtes <code>p-autocomplete</code> über dieselbe Liste von
          {{ allCities.length }} Städten. Fang im Playground an: Die Schalter ändern die drei Entscheidungen, auf die es
          ankommt — gibt es einen Dropdown-Button, ist die Antwort eine Menge, und darf der Nutzer einen Wert erfinden —,
          und das Markup darunter zieht mit. Jedes Feld ist mit einem schlichten <code>&lt;label for&gt;</code> benannt,
          das hier funktioniert und bei einem <code>p-select</code> nicht.
        </p>

        <!-- Mini playground: live-configure an autocomplete and read back the markup. -->
        <section class="pg" aria-label="AutoComplete-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Konfigurieren</legend>

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
                <label for="pg-dropdown">Dropdown-Button</label>
                <p-toggleswitch
                  inputId="pg-dropdown"
                  [ngModel]="pgDropdown()"
                  (ngModelChange)="pgDropdown.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-multiple">Mehrfach (Chips)</label>
                <p-toggleswitch inputId="pg-multiple" [ngModel]="pgMultiple()" (ngModelChange)="onPgMultiple($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-force">Auswahl erzwingen</label>
                <p-toggleswitch inputId="pg-force" [ngModel]="pgForce()" (ngModelChange)="pgForce.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-clear">Löschen-Button zeigen</label>
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
              <label class="pg__preview-label" for="pg-city">Stadt</label>
              <div class="pg__stage">
                <p-autocomplete
                  inputId="pg-city"
                  [suggestions]="pgSuggestions()"
                  (completeMethod)="completePlayground($event)"
                  optionLabel="name"
                  [size]="pgSizeInput()"
                  [dropdown]="pgDropdown()"
                  [multiple]="pgMultiple()"
                  [forceSelection]="pgForce()"
                  [showClear]="pgClear()"
                  [disabled]="pgDisabled()"
                  placeholder="Tipp den Anfang einer Stadt"
                  emptyMessage="Keine Stadt passt zu diesem Text"
                  dropdownAriaLabel="Alle Städte zeigen"
                  [ngModel]="pgValue()"
                  (ngModelChange)="pgValue.set($event)"
                />
              </div>
              <p class="pg__hint">
                Tipp zwei Buchstaben. Schalte <em>Auswahl erzwingen</em> ein, verlass das Feld mitten in einem halb
                getippten Wort und sieh zu, was das Steuerelement mit deinem Text macht.
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
            Eine Vorschlagsquelle, drei <code>size</code>-Werte. Der Tab „Design“ hat die Token-Tabelle und die
            gemessenen Höhen hinter dem Unterschied.
          </p>
          <div class="ex__stage">
            <div class="sizes">
              <div class="sizes__row">
                <label class="pg__label" for="sz-small">Klein</label>
                <p-autocomplete
                  inputId="sz-small"
                  size="small"
                  [dropdown]="true"
                  [suggestions]="szSuggestions()"
                  (completeMethod)="completeSizes($event)"
                  optionLabel="name"
                  dropdownAriaLabel="Alle Städte zeigen"
                  [ngModel]="szSmall()"
                  (ngModelChange)="szSmall.set($event)"
                />
              </div>
              <div class="sizes__row">
                <label class="pg__label" for="sz-normal">Standard</label>
                <p-autocomplete
                  inputId="sz-normal"
                  [dropdown]="true"
                  [suggestions]="szSuggestions()"
                  (completeMethod)="completeSizes($event)"
                  optionLabel="name"
                  dropdownAriaLabel="Alle Städte zeigen"
                  [ngModel]="szNormal()"
                  (ngModelChange)="szNormal.set($event)"
                />
              </div>
              <div class="sizes__row">
                <label class="pg__label" for="sz-large">Groß</label>
                <p-autocomplete
                  inputId="sz-large"
                  size="large"
                  [dropdown]="true"
                  [suggestions]="szSuggestions()"
                  (completeMethod)="completeSizes($event)"
                  optionLabel="name"
                  dropdownAriaLabel="Alle Städte zeigen"
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
                    <label class="pg__label" for="ex-basic">Stadt</label>
                    <p-autocomplete
                      inputId="ex-basic"
                      [suggestions]="exBasicSuggestions()"
                      (completeMethod)="completeBasic($event)"
                      optionLabel="name"
                      placeholder="Tipp los"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [ngModel]="exBasic()"
                      (ngModelChange)="exBasic.set($event)"
                    />
                  </div>
                }
                @case ('dropdown') {
                  <div class="field">
                    <label class="pg__label" for="ex-dd-blank">Dropdown, Modus blank</label>
                    <p-autocomplete
                      inputId="ex-dd-blank"
                      [dropdown]="true"
                      dropdownMode="blank"
                      [suggestions]="exDdSuggestions()"
                      (completeMethod)="completeDropdown($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Alle Städte zeigen"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [ngModel]="exDdBlank()"
                      (ngModelChange)="exDdBlank.set($event)"
                    />
                  </div>
                  <div class="field">
                    <label class="pg__label" for="ex-dd-current">Dropdown, Modus current</label>
                    <p-autocomplete
                      inputId="ex-dd-current"
                      [dropdown]="true"
                      dropdownMode="current"
                      [suggestions]="exDdSuggestions()"
                      (completeMethod)="completeDropdown($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Nach dem Getippten suchen"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [ngModel]="exDdCurrent()"
                      (ngModelChange)="exDdCurrent.set($event)"
                    />
                  </div>
                }
                @case ('grouped') {
                  <div class="field">
                    <label class="pg__label" for="ex-grouped">Stadt, nach Land</label>
                    <p-autocomplete
                      inputId="ex-grouped"
                      [dropdown]="true"
                      [group]="true"
                      optionGroupLabel="region"
                      optionGroupChildren="items"
                      [suggestions]="exGroupSuggestions()"
                      (completeMethod)="completeGrouped($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Alle Städte nach Land zeigen"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [ngModel]="exGrouped()"
                      (ngModelChange)="exGrouped.set($event)"
                    />
                  </div>
                }
                @case ('multiple') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-multiple">Städte zum Vergleichen</label>
                    <p-autocomplete
                      inputId="ex-multiple"
                      [multiple]="true"
                      [suggestions]="exMultiSuggestions()"
                      (completeMethod)="completeMulti($event)"
                      optionLabel="name"
                      placeholder="Stadt hinzufügen"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [ngModel]="exMulti()"
                      (ngModelChange)="exMulti.set($event)"
                    />
                    <p class="field__hint">
                      Ist das Textfeld leer, entfernt <kbd>Backspace</kbd> den letzten Chip, und <kbd>←</kbd> wechselt
                      in die Chip-Reihe.
                    </p>
                  </div>
                }
                @case ('tags') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-tags">Tags, die du erfindest</label>
                    <p-autocomplete
                      inputId="ex-tags"
                      [multiple]="true"
                      [typeahead]="false"
                      [addOnBlur]="true"
                      separator=","
                      placeholder="Tag tippen, dann Enter"
                      [ngModel]="exTags()"
                      (ngModelChange)="exTags.set($event)"
                    />
                    <p class="field__hint">
                      Gar keine Vorschläge: <code>[typeahead]="false"</code> macht aus dem Steuerelement ein Token-Feld.
                      <kbd>Enter</kbd>, ein Komma oder das Verlassen des Felds übernimmt, was du getippt hast.
                    </p>
                  </div>
                }
                @case ('force') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-force">Stadt (muss aus der Liste stammen)</label>
                    <p-autocomplete
                      inputId="ex-force"
                      [dropdown]="true"
                      [forceSelection]="true"
                      [suggestions]="exForceSuggestions()"
                      (completeMethod)="completeForce($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Alle Städte zeigen"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [pt]="ptForceHint"
                      [ngModel]="exForce()"
                      (ngModelChange)="exForce.set($event)"
                    />
                    <p class="field__hint" id="ex-force-hint">
                      Tipp <em>Lis</em> und klick daneben. Der Text wird gelöscht, weil er keinem Vorschlag exakt
                      entspricht. Dieses Schweigen ist das eigene Verhalten des Steuerelements, also muss der Hinweis die
                      Regel tragen.
                    </p>
                  </div>
                }
                @case ('async') {
                  <div class="field field--wide">
                    <label class="pg__label" for="ex-async">Stadt (Abfrage beim Server)</label>
                    <p-autocomplete
                      inputId="ex-async"
                      [minQueryLength]="2"
                      [delay]="400"
                      [suggestions]="exAsyncSuggestions()"
                      (completeMethod)="completeAsync($event)"
                      optionLabel="name"
                      placeholder="Mindestens zwei Buchstaben"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [ngModel]="exAsync()"
                      (ngModelChange)="exAsync.set($event)"
                    />
                    <p class="field__hint">
                      Ein simulierter Round Trip von 600 ms hinter einem Tastendruck-Debounce von 400 ms und einer
                      Untergrenze von zwei Zeichen. Der Spinner stoppt, wenn das Vorschlags-Array neu zugewiesen wird —
                      nicht, wenn die Anfrage zurückkommt.
                    </p>
                  </div>
                }
                @case ('template') {
                  <div class="field">
                    <label class="pg__label" for="ex-template">Stadt mit Land</label>
                    <p-autocomplete
                      inputId="ex-template"
                      [dropdown]="true"
                      [suggestions]="exTplSuggestions()"
                      (completeMethod)="completeTemplate($event)"
                      optionLabel="name"
                      dropdownAriaLabel="Alle Städte zeigen"
                      emptyMessage="Keine Stadt passt zu diesem Text"
                      [ngModel]="exTemplate()"
                      (ngModelChange)="exTemplate.set($event)"
                    >
                      <ng-template #item let-city>
                        <span class="opt">
                          <strong>{{ city.name }}</strong>
                          <span class="opt__meta">{{ city.region }}</span>
                        </span>
                      </ng-template>
                    </p-autocomplete>
                  </div>
                }
                @case ('states') {
                  <div class="field">
                    <label class="pg__label" for="ex-disabled">Deaktiviert</label>
                    <p-autocomplete
                      inputId="ex-disabled"
                      [disabled]="true"
                      [dropdown]="true"
                      optionLabel="name"
                      dropdownAriaLabel="Alle Städte zeigen"
                      [ngModel]="stateCity"
                    />
                  </div>
                  <div class="field">
                    <label class="pg__label" for="ex-invalid">Ungültig</label>
                    <p-autocomplete
                      inputId="ex-invalid"
                      [invalid]="true"
                      [suggestions]="exStateSuggestions()"
                      (completeMethod)="completeStates($event)"
                      optionLabel="name"
                      placeholder="Tipp los"
                      [pt]="ptInvalid"
                    />
                    <p class="field__hint field__hint--error" id="ex-invalid-msg">Wähl eine Stadt aus den Vorschlägen.</p>
                  </div>
                  <div class="field">
                    <label class="pg__label" for="ex-readonly">Schreibgeschützt</label>
                    <p-autocomplete
                      inputId="ex-readonly"
                      [readonly]="true"
                      [dropdown]="true"
                      optionLabel="name"
                      dropdownAriaLabel="Alle Städte zeigen"
                      [ngModel]="stateCity"
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
        <h3>Wann schlägt Tippen eine Liste? Die ehrliche Tabelle</h3>
        <p>
          Ein Autocomplete ist das einzige Steuerelement dieser Familie, das dem Nutzer im Ruhezustand
          <strong>nichts</strong> zeigt. Das ist sein ganzer Preis, und er kauft genau eines: einen Antwortraum, der zu
          groß, zu weit entfernt oder zu offen ist, um ihn aufzuzählen. Entscheide danach,
          <strong
            >wie viele Kandidaten es gibt, ob der Nutzer das Ziel benennen kann, ob die Antwort ein Wert sein darf, den
            niemand aufgelistet hat, und ob die Menge der Antworten beim Entscheiden sichtbar sein muss</strong
          >.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Kandidaten</th>
                <th>Sichtbar im Ruhezustand</th>
                <th>Wie der Nutzer ans Ziel kommt</th>
                <th>Wert außerhalb der Liste?</th>
                <th>Mehrfach</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-select</code></td>
                <td>~5&#8211;25, bekannt und geladen</td>
                <td>einer &#8212; der aktuelle Wert</td>
                <td>Öffnen, überfliegen, wählen. Nichts zu tippen.</td>
                <td>Nein</td>
                <td>Nein</td>
              </tr>
              <tr>
                <td><code>p-select [filter]</code></td>
                <td>~15&#8211;60, bekannt und geladen</td>
                <td>einer</td>
                <td>Öffnen, dann blättern <em>oder</em> eingrenzen. Die Liste ist der Rückweg.</td>
                <td>Nein</td>
                <td>Nein</td>
              </tr>
              <tr>
                <td><code>p-listbox</code></td>
                <td>~3&#8211;15, wenn die Seite die Höhe hergibt</td>
                <td><strong>alle Zeilen</strong>, kein Overlay</td>
                <td>Überfliegen und wählen, nichts verborgen.</td>
                <td>Nein</td>
                <td><code>[multiple]</code></td>
              </tr>
              <tr>
                <td><code>p-multiselect</code></td>
                <td>~5&#8211;60</td>
                <td>eine Zusammenfassung der gewählten Menge</td>
                <td>Öffnen, blättern, ankreuzen. Filter optional.</td>
                <td>Nein</td>
                <td><strong>Ja</strong> &#8212; der Grund, es zu nehmen</td>
              </tr>
              <tr>
                <td><code>p-autocomplete</code></td>
                <td><strong>Hunderte, entfernt oder unbegrenzt</strong></td>
                <td><strong>nichts</strong> &#8212; ein leeres Textfeld</td>
                <td>Tippen; Vorschläge kommen je Anfrage. Blättern ist unmöglich.</td>
                <td><strong>Ja, standardmäßig</strong> &#8212; siehe unten</td>
                <td><code>[multiple]="true"</code></td>
              </tr>
              <tr>
                <td><code>p-autocomplete [dropdown]</code></td>
                <td>Hunderte, entfernt oder unbegrenzt</td>
                <td>nichts, aber ein Button verspricht eine Liste</td>
                <td>Tippen <em>oder</em> den Button drücken, um alles zu sehen. Kauft den Hinweis auf die Liste zurück.</td>
                <td>Ja, standardmäßig</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>p-autocomplete [multiple] [typeahead]="false"</code></td>
                <td>keine &#8212; der Nutzer erfindet sie</td>
                <td>die bisher hinzugefügten Chips</td>
                <td>Tippen, dann <kbd>Enter</kbd> / ein Trennzeichen / Blur. Gar keine Vorschläge.</td>
                <td>Genau darum geht es (Tag-Eingabe)</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td>natives <code>&lt;datalist&gt;</code></td>
                <td>eine begrenzte Liste, die du im HTML ausliefern kannst</td>
                <td>nichts</td>
                <td>Tippen; der Browser schlägt vor. Null JS, null Styling, keine Anfrage an den Server.</td>
                <td>Ja</td>
                <td>Nein</td>
              </tr>
              <tr>
                <td><code>&lt;input pInputText&gt;</code></td>
                <td>keine</td>
                <td>nichts</td>
                <td>Tippen. Das System hat keine Meinung zur Antwort.</td>
                <td>Nur Werte</td>
                <td>entfällt</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> Die Verhaltensspalten sind aus den Quellen von Optimus UI
          2.0.2 in <code>node_modules</code> gelesen; die Spannen der Kandidatenzahl sind eine <em>Einschätzung</em>
          dazu, „wie weit ein Nutzer überfliegen kann, bevor Tippen das Scrollen schlägt“, und du solltest sie
          verschieben, wenn dein Inhalt etwas anderes sagt. Zwei Zeilen übersieht man leicht, und oft sind sie richtig:
          <code>&lt;datalist&gt;</code>, wenn die Liste klein, statisch und lokal ist &#8212; es kostet kein Bundle und
          kein Accessibility-Risiko &#8212; und <code>p-select [filter]</code>, das einem Nutzer die Suche gibt, der
          trotzdem noch blättern kann. Konvention des Kits: Geschlossene Auswahlen sind <code>p-select</code>, Freitext
          ist <code>&lt;input pInputText&gt;</code> mit einem <code>&lt;label for&gt;</code>, und zu einem Feld mit
          Vorschlägen greifst du erst, wenn keins von beiden passt.
        </p>

        <h3>Der Standard ist ein Freitextfeld, das nebenbei Vorschläge macht</h3>
        <p>
          Das ist der Teil, der Leute überrascht, die von <code>p-select</code> kommen. Im Einzelmodus wird jeder
          Tastendruck direkt in das Form-Control geschrieben: <code>onInput</code> ruft <code>updateModel(query)</code>
          auf, sobald <code>multiple</code> und <code>forceSelection</code> beide aus sind
          (<code>openng-optimus-ui-autocomplete.mjs:963-965</code>). Tipp drei Buchstaben und geh weg, und dein Model
          hält den String <em>„Lis“</em> &#8212; keine Stadt, nicht <code>null</code>. Drei Auswege, nach Vorzug
          geordnet:
        </p>
        <ul>
          <li>
            <strong>Nimm Freitext mit Absicht an.</strong> Ein Suchfeld, ein frei formulierter Ort, ein Tag: Binde an
            einen <code>string</code>, behandle Vorschläge als Komfort und sag es im Typ.
          </li>
          <li>
            <strong>Validiere die Form, die du brauchst.</strong> Behalte das freie Tippen und lass einen Validator alles
            ablehnen, was keines deiner Objekte ist. Der Nutzer behält seinen Text und bekommt eine Meldung, mit der er
            etwas anfangen kann.
          </li>
          <li>
            <strong><code>[forceSelection]="true"</code>, mit einer sichtbaren Regel.</strong> Tippen berührt das Model
            gar nicht mehr; bei <code>change</code> gleicht das Steuerelement den Text mit den sichtbaren Vorschlägen ab
            und löscht das Feld, wenn nichts <em>exakt</em> passt (<code>:1298-1315</code>). Stilles Löschen ist schon
            für sich ein Usability-Mangel, also kombiniere es mit einem Hinweis, der die Regel nennt, und mit
            <code>[dropdown]="true"</code>, damit die gültigen Antworten überhaupt erreichbar sind.
          </li>
        </ul>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &#8212; ein Tippfeld für sechs bekannte Optionen</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-few-bad">Diagrammtyp</label>
                <p-autocomplete
                  inputId="dd-few-bad"
                  [suggestions]="ddFewSuggestions()"
                  (completeMethod)="completeFew($event)"
                  optionLabel="label"
                  placeholder="Tipp los"
                  [ngModel]="ddFewText()"
                  (ngModelChange)="ddFewText.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Der Nutzer kann nicht wissen, dass es sechs Antworten gibt, geschweige denn, wie sie heißen. Ein leeres Feld
              verlangt von ihm, das Vokabular deines Datenmodells zu erraten.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &#8212; zeig die geschlossene Liste</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-few-good-label">Diagrammtyp</span>
                <p-select
                  [ariaLabelledBy]="'dd-few-good-label'"
                  [options]="chartOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Diagrammtyp wählen"
                  [ngModel]="ddFewValue()"
                  (ngModelChange)="ddFewValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Ein Klick zeigt den ganzen Antwortraum, und das Model kann nur einen Wert halten, den du definiert hast. Greif
              zum Autocomplete, wenn die Liste nicht mehr passt &#8212; nicht vorher.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &#8212; forceSelection für sich allein</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-force-bad">Stadt</label>
                <p-autocomplete
                  inputId="dd-force-bad"
                  [forceSelection]="true"
                  [suggestions]="ddForceSuggestions()"
                  (completeMethod)="completeDdForce($event)"
                  optionLabel="name"
                  placeholder="Tipp los"
                  [ngModel]="ddForceBad()"
                  (ngModelChange)="ddForceBad.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Tipp <em>Lis</em>, klick weg: Der Text verschwindet ohne Meldung, ohne Fehlerzustand und ohne Hinweis, dass
              nur gelistete Städte zählen. Nichts auf dem Bildschirm lässt auf die Regel schließen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &#8212; nenn die Regel und öffne die Liste</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-force-good">Stadt</label>
                <p-autocomplete
                  inputId="dd-force-good"
                  [forceSelection]="true"
                  [dropdown]="true"
                  [suggestions]="ddForceSuggestions()"
                  (completeMethod)="completeDdForce($event)"
                  optionLabel="name"
                  placeholder="Tipp los"
                  dropdownAriaLabel="Alle Städte zeigen"
                  [pt]="ptDdForceHint"
                  [ngModel]="ddForceGood()"
                  (ngModelChange)="ddForceGood.set($event)"
                />
                <p class="field__hint" id="dd-force-good-hint">Wähl eine der gelisteten Städte.</p>
              </div>
            </div>
            <p class="dd__why">
              Der Hinweis erreicht das Input über das <code>pt</code>-Pass-through, also wird die Einschränkung angesagt,
              bevor das Löschen jemanden überraschen kann, und der Dropdown-Button macht die erlaubten Antworten ohne
              Raten erreichbar.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &#8212; den Placeholder zum Label machen</span>
            <div class="dd__stage">
              <div class="field">
                <p-autocomplete
                  [suggestions]="ddLabelSuggestions()"
                  (completeMethod)="completeDdLabel($event)"
                  optionLabel="name"
                  placeholder="Stadt"
                  [ngModel]="ddLabelBad()"
                  (ngModelChange)="ddLabelBad.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Das Feld links ist nicht namenlos &#8212; gemessen ist sein Accessible Name der Placeholder, weil das der
              letzte Rückgriff in der Namensberechnung ist. Es ist trotzdem der falsche Name: Das Wort „Stadt“
              verschwindet vom Bildschirm, sobald irgendetwas getippt ist, genau dann, wenn der Nutzer am dringendsten
              wissen muss, worauf er antwortet.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &#8212; ein natives Label, gebunden über inputId</span>
            <div class="dd__stage">
              <div class="field">
                <label class="pg__label" for="dd-label-good">Stadt</label>
                <p-autocomplete
                  inputId="dd-label-good"
                  [suggestions]="ddLabelSuggestions()"
                  (completeMethod)="completeDdLabel($event)"
                  optionLabel="name"
                  placeholder="Tipp los"
                  [ngModel]="ddLabelGood()"
                  (ngModelChange)="ddLabelGood.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              <code>inputId</code> landet auf einem echten <code>&lt;input&gt;</code>, das ein labelbares Element
              <em>ist</em>, also bindet <code>&lt;label for&gt;</code>. Das ist die eine Stelle, an der sich der Rat des
              Select-Guides umkehrt: Dort ist das native Label nutzlos, hier ist es die richtige Antwort.
            </p>
          </div>
        </div>

        <h3>Schreib die Vorschlagsliste für einen Leser, der mitten im Wort steckt</h3>
        <ul>
          <li>
            <strong>Sortiere nach Wahrscheinlichkeit, nicht nach dem Alphabet.</strong> Der Nutzer liest die ersten zwei
            Zeilen und sonst nichts. Präfix-Treffer vor Teilstring-Treffern, Beliebtes vor Abseitigem.
          </li>
          <li>
            <strong>Zeig, was unterscheidet.</strong> Zwei Städte namens Springfield brauchen ihre Region in der Zeile,
            sonst ist die Liste ein Münzwurf; nutze das Item-Template und halte den Zusatztext zweitrangig.
          </li>
          <li>
            <strong>Sortiere die Liste nie um, während sie offen ist.</strong> Der Fokus wird über
            <code>aria-activedescendant</code> gegen einen Index verfolgt, also verschiebt jedes Verschieben von Zeilen
            das Ziel unter dem Finger des Nutzers.
          </li>
          <li>
            <strong>Begrenze die Treffermenge.</strong> Das Overlay scrollt ab <code>scrollHeight</code> (Standard
            <code>200px</code>); eine Anfrage, die 500 Zeilen liefert, ist ein Scrollbalken, keine Antwort. Gib die
            besten 10 zurück und sag es.
          </li>
          <li>
            <strong>Pack nicht den ganzen Katalog in eine Anfrage.</strong> Ist der Antwortraum klein genug, um ihn
            vollständig zurückzugeben, hätte das Steuerelement ein <code>p-select</code> sein sollen.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer">
              W3C &#8212; APG, Combobox pattern</a
            >
            &#8212; der Vertrag aus Rollen und Zuständen, gegen den dieser Guide die Bibliothek prüft:
            <code>role="combobox"</code> auf dem Texteingabefeld, <code>aria-expanded</code> folgt dem Popup,
            <code>aria-controls</code> zeigt auf die Listbox, und <code>aria-activedescendant</code> benennt die
            sichtbar fokussierte Option.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; APG, Editable Combobox with List Autocomplete</a
            >
            &#8212; genau die Variante, die ein <code>p-autocomplete</code> umsetzt, und die Quelle der
            Tastatur-Erwartungen im Tab „Entwicklung“ (Pfeil runter öffnet, ohne auszuwählen, Escape schließt und behält
            den Fokus, Enter übernimmt die fokussierte Option).
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#listbox" target="_blank" rel="noopener noreferrer">
              W3C &#8212; WAI-ARIA 1.2, <code>listbox</code> role</a
            >
            &#8212; „the listbox role requires ownership of an element using the option or group role“: die Referenz
            dafür, warum ein als
            <code>role="option"</code> gerenderter Gruppen-Header und eine darin verschachtelte Combobox Defekte sind und
            keine Stilfragen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; WCAG 2.2 SC 3.3.2 Labels or Instructions</a
            >
            &#8212; das Kriterium hinter der Regel für ein dauerhaftes Label und hinter der Forderung, dass ein
            <code>forceSelection</code>-Feld seine Einschränkung nennt, bevor es sie durchsetzt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            &#8212; das Kriterium, an dem ein auf null gesetzter Fokus-Ring scheitert, solange nichts anderes einen
            zeichnet; der Tab „Design“ zeigt den Ring des Kits in beiden Modi.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &#8212; WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            &#8212; der Maßstab für „N Ergebnisse verfügbar“: Die Bibliothek liefert eine Live-Region, und das
            i18n-Gegenstück dieses Tabs zeigt, welcher String sie erreicht.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN &#8212; The <code>&lt;datalist&gt;</code> element</a
            >
            &#8212; der Nachbar ohne JavaScript in der Tabelle oben, samt seiner echten Grenzen: kein Styling, keine
            Anfrage an den Server und eine uneinheitliche Darstellung je nach Browser.
          </li>
          <li>
            <a href="https://optimus.openng.org/autocomplete/" target="_blank" rel="noopener noreferrer">
              Optimus UI &#8212; AutoComplete</a
            >
            &#8212; die API-Oberfläche des Herstellers, die dieser Guide auf die Konventionen des Kits abbildet und dann
            gegen den ausgelieferten Quellcode prüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie &#8212; zwei verschiedene Steuerelemente hinter einem Tag</h3>
        <p>
          Der Host <code>&lt;p-autocomplete&gt;</code> trägt
          <code>p-autocomplete p-component p-inputwrapper</code> plus jede Zustandsklasse (<code>p-focus</code>,
          <code>p-invalid</code>, <code>p-autocomplete-open</code>, <code>p-autocomplete-clearable</code>). Was er
          umschließt, hängt ganz von <code>multiple</code> ab:
        </p>
        <ul>
          <li>
            <strong>Einzelmodus</strong> &#8212; ein
            <code>&lt;input class="p-autocomplete-input p-inputtext p-component"&gt;</code>
            mit <code>role="combobox"</code>, <code>aria-autocomplete="list"</code>, <code>aria-expanded</code>,
            <code>aria-controls</code> und <code>aria-activedescendant</code>. Die sichtbare Box <em>ist</em> das Input.
          </li>
          <li>
            <strong>Mehrfachmodus</strong> &#8212; ein <code>&lt;ul class="p-autocomplete-input-multiple"&gt;</code> ist
            die sichtbare Box. Sie hält je Wert ein <code>li.p-autocomplete-chip-item</code> (jedes umschließt einen
            <code>p-chip</code>) und als letztes ein <code>li.p-autocomplete-input-chip</code>
            mit dem Texteingabefeld &#8212; das weiterhin
            <code>role="combobox"</code> trägt, gemessen aber nur die Klasse <code>p-autocomplete-input</code>: keine
            <code>pInputText</code>-Direktive, also ist es kein <code>.p-inputtext</code>. Das Input im Einzelmodus misst
            <code>p-autocomplete-input p-component p-inputtext</code>.
          </li>
          <li>
            <strong>Löschen-Icon</strong> &#8212; <code>[showClear]</code> rendert ein <code>aria-hidden</code>-SVG mit
            einem Klick-Handler; es ist kein Button und per Tastatur nicht erreichbar.
          </li>
          <li>
            <strong>Dropdown-Button</strong> &#8212; <code>[dropdown]="true"</code> rendert einen echten
            <code>&lt;button type="button"&gt;</code>, dessen Accessible Name aus
            <code>dropdownAriaLabel</code> kommt und <em>leer</em> ist, wenn du ihn nicht setzt.
          </li>
          <li>
            <strong>Overlay</strong> &#8212; <code>div.p-autocomplete-overlay</code> mit
            <code>ul.p-autocomplete-list[role=listbox]</code> und <code>id="&lt;id&gt;_list"</code>; Zeilen sind
            <code>li.p-autocomplete-option[role=option]</code>, und das gilt auch für Gruppen-Header und die Zeile mit der
            Leer-Meldung.
          </li>
          <li>
            <strong>Live-Region</strong> &#8212; ein einzelnes
            <code>span[role=status][aria-live=polite].p-hidden-accessible</code>, gerendert <em>innerhalb</em> des
            Overlays, also existiert es nur, solange das Overlay offen ist.
          </li>
        </ul>
        <p class="src-note">
          Anatomie gelesen aus <code>openng-optimus-ui-autocomplete.mjs</code> (Optimus UI 2.0.2): das Input des
          Einzelmodus bei 1590-1634, die Chip-Liste bei 1642-1728, der Dropdown-Button bei 1735, die Optionsliste bei
          1788-1833 und die Status-Region bei 1837; Klassennamen aus der Style-Map bei 60-104. Das Paar
          <code>p-inputtext p-component</code> stammt aus der eigenen Root-Klasse der
          <code>pInputText</code>-Direktive (<code>openng-optimus-ui-inputtext.mjs:26</code>) &#8212; deshalb ist es im
          Einzelmodus vorhanden und im Mehrfachmodus nicht.
        </p>

        <h3>Größenskala &#8212; Tokens und gemessene Höhen</h3>
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
                <td><strong>gemessene Input-Höhe</strong></td>
                <td><strong>33px</strong></td>
                <td><strong>39px</strong></td>
                <td><strong>46px</strong></td>
              </tr>
              <tr>
                <td>Breite des Dropdown-Buttons</td>
                <td>2rem</td>
                <td>2.5rem</td>
                <td>3rem</td>
              </tr>
              <tr>
                <td>border-radius / border</td>
                <td colspan="3">
                  <code>&#123;form.field.border.radius&#125;</code> (je visuellem Stil: 0 Werkbund, 12px Lernwerkstatt,
                  10px Skizzenbuch, 2px Blaupause) / 1px solid &#8212; die hinteren Ecken werden flach auf 0, wo ein
                  Dropdown-Button anschließt; auf dem Input im Einzelmodus gilt zusätzlich die eigene Breite (und in
                  Werkbund und Blaupause der Radius) der Stilregel für <code>input.p-inputtext</code>
                </td>
              </tr>
              <tr>
                <td>transition-duration</td>
                <td colspan="3">0.2s</td>
              </tr>
              <tr>
                <td>Box im Mehrfachmodus, leer</td>
                <td colspan="3">
                  <strong>39px</strong> &#8212; genauso viel wie ein Feld im Einzelmodus, und zwei Chips (je 29px) messen
                  immer noch 39px. Nichts fixiert die Höhe: Sie wächst erst, wenn die Reihe <em>umbricht</em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen aus <code>&#64;openng/optimus-ui-themes/dist/aura/autocomplete/index.mjs</code>, das jeden
          Root-Wert über <code>&#123;form.field.*&#125;</code> in <code>&#8230;/aura/base/index.mjs</code> auflöst
          &#8212; dieselbe Familie, die auch die Guides zu Select und Text Inputs messen, also sind ein kleines
          Autocomplete und ein kleines Select schon von der Bauart her gleich hoch. Die Höhen sind gerenderte Box-Höhen
          bei Auras 1px-Rahmen; der schwerere Rahmen der Stilregel auf dem Input im Einzelmodus addiert 2px in Werkbund
          und Lernwerkstatt und 1px in Skizzenbuch. Die Dropdown-Breiten sind die eigenen Literale
          <code>dropdown.width</code> / <code>sm</code> / <code>lg</code> des Presets. Alle drei Größen liegen für das
          Feld selbst über der Zielgrößen-Untergrenze von 24px aus WCAG 2.5.8; eine Optionszeile im Overlay hat ein
          Padding von <code>8px 12px</code> und misst 37px.
        </p>

        <h3>Interaktionszustände &#8212; und wo das Kit eingreift</h3>
        <p>
          Drei Schichten stylen dieses Steuerelement: die <em>Aura-Token-Schicht</em>, die Optimus ausliefert
          (Formularfeld-Farben aus Auras Standardpalette slate/zinc, die die visuellen Stile nicht ersetzen), die
          <code>styles.scss</code> dieses Kits und die Regel <code>input.p-inputtext</code> in jedem
          <code>html.style-*</code>-Block. Das Input im Einzelmodus ist ein <code>pInputText</code>, also erreichen es
          die <code>.p-inputtext</code>-Regeln; das <code>&lt;ul&gt;</code> im Mehrfachmodus ist keins, also gibt das Kit
          ihm eigene <code>.p-autocomplete</code>-Regeln (Kante, Invalid-Token, Fokus-Ring, dunkle Füllung, Chip-Ring).
          Beide Modi landen beim selben Ring und beim selben Rot, aber nicht bei derselben Kante.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Aura-Token-Schicht</th>
                <th>Einzelmodus, dieses Kit</th>
                <th>Mehrfachmodus, dieses Kit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ruhe</td>
                <td>
                  1px <code>&#123;form.field.border.color&#125;</code> auf <code>&#123;form.field.background&#125;</code>
                </td>
                <td>
                  Der Rahmen ist die Kontur des Stils (Breite und Farbe aus der Stilregel), in beiden Farbmodi. Dunkel:
                  Füllung <code>--surface-section</code>, Text <code>--text-color</code>, Placeholder
                  <code>--control-placeholder</code> (Element-Tokens aus <code>.dark-theme .p-inputtext</code>). Kante
                  3,25&#8211;18,73:1 und Placeholder 4,76:1 oder mehr über alle Stile
                  (<code>docs/generated/CONTRAST.MD</code>, „form field edge“ und „form field text“, die
                  <code>inputtext</code>-Zeilen).
                </td>
                <td>
                  1px <code>--control-border</code> (Kit-Regel <code>.p-autocomplete</code>, auch auf dem Dropdown-Button),
                  in beiden Farbmodi: 3,25&#8211;5,51:1 gegen die Hintergründe, die Card und die eigene Füllung der Box
                  (<code>CONTRAST.MD</code>, „form field edge“, die <code>autocomplete.border.color</code>-Zeilen).
                  Dunkel: Füllung <code>--surface-section</code>, Text <code>--text-color</code>, Placeholder
                  <code>--control-placeholder</code> (<code>.dark-theme .p-autocomplete</code>), wie beim Input im
                  Einzelmodus („form field text“, die <code>autocomplete</code>-Zeilen).
                </td>
              </tr>
              <tr>
                <td>Hover</td>
                <td><code>&#123;form.field.hover.border.color&#125;</code></td>
                <td colspan="2">Wie Aura in beiden Farbmodi &#8212; die Hover-Regeln mit drei Klassen schlagen die Stilregel.</td>
              </tr>
              <tr>
                <td>Fokus &#8212; das Feld</td>
                <td>
                  <code>&#123;form.field.focus.border.color&#125;</code> (<code>&#123;primary.color&#125;</code>) plus ein
                  Fokus-Ring, den Aura mit <strong>Breite 0, Stil none</strong> ausliefert (<code>formField.focusRing</code>).
                </td>
                <td>
                  Rahmentönung <em>plus</em> der 2px-Ring <code>--primary-color-fg</code> des Kits mit 2px Offset
                  (<code>.p-inputtext:focus-visible</code>, beide Farbmodi).
                </td>
                <td>
                  Derselbe Kit-Ring und ein Rahmen in <code>--primary-color-fg</code>, auf der Box, solange ihr Input den
                  Fokus hat (<code>.p-autocomplete.p-focus .p-autocomplete-input-multiple</code>, beide Farbmodi).
                </td>
              </tr>
              <tr>
                <td>Fokus &#8212; der Dropdown-Button</td>
                <td>
                  <code>dropdown.focusRing</code> verweist auf die <strong>globalen</strong>
                  <code>&#123;focus.ring.*&#125;</code>: 1px solid <code>&#123;primary.color&#125;</code> mit 2px Offset
                  &#8212; nicht auf den genullten Formularfeld-Ring.
                </td>
                <td colspan="2">
                  Stattdessen der Kit-Ring, in beiden Farbmodi: <code>.p-autocomplete-dropdown:focus-visible</code> steht
                  in der einen Ring-Regel des Kits, 2px <code>--primary-color-fg</code> mit 2px Offset,
                  <code>!important</code> &#8212; derselbe Ring wie am Feld, nicht Auras 1px.
                </td>
              </tr>
              <tr>
                <td>ungültig</td>
                <td>
                  <code>&#123;red.400&#125;</code> hell / <code>&#123;red.300&#125;</code> dunkel auf dem Rahmen, ein roter
                  Placeholder; kein Icon, kein Text.
                </td>
                <td>
                  Placeholder-Tönung immer. Rahmen <code>--semantic-red-fg</code> bei jedem der beiden Auslöser &#8212;
                  auch bei <code>[invalid]</code> allein &#8212;, weil die Kit-Regel <code>input.p-inputtext.p-invalid</code>
                  (<code>!important</code>) die Stilregel schlägt; die <code>ng-invalid ng-dirty</code>-Regel des Hosts
                  (<code>openng-optimus-ui-autocomplete.mjs:28-35</code>) malt denselben Token.
                </td>
                <td>
                  Beide Auslöser malen <code>--semantic-red-fg</code> (das Kit biegt
                  <code>--p-autocomplete-invalid-border-color</code> um):
                  <code>.p-autocomplete.p-invalid .p-autocomplete-input-multiple</code>
                  (<code>optimus-ui-styles/dist/autocomplete/index.mjs:183</code>, gespeist von der Root-Klassen-Map bei
                  <code>openng-optimus-ui-autocomplete.mjs:64</code>) und dieselbe <code>ng-invalid ng-dirty</code>-Regel.
                </td>
              </tr>
              <tr>
                <td>deaktiviert</td>
                <td>
                  <code>&#123;form.field.disabled.background&#125;</code> und
                  <code>&#123;form.field.disabled.color&#125;</code>; <code>opacity</code> unverändert.
                </td>
                <td colspan="2">
                  Wie Aura in beiden Farbmodi &#8212; die dunkle Kit-Regel biegt nur die Ruhe-Tokens um, also bleibt ein
                  deaktiviertes Feld unterscheidbar.
                </td>
              </tr>
              <tr>
                <td>schreibgeschützt</td>
                <td>
                  Kein Token, keine Regel &#8212; das native <code>readonly</code>-Attribut ist gesetzt, und nichts wird
                  anders gerendert.
                </td>
                <td colspan="2">Sieht in beiden Modi editierbar aus. Wenn Schreibschutz wichtig ist, sag es im Text.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura-Spalte: <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (<code>formField</code>) und
          <code>&#8230;/aura/autocomplete/index.mjs</code>. Kit-Spalten: die Regeln <code>.dark-theme .p-inputtext</code>,
          <code>.p-inputtext:focus-visible</code>, <code>input.p-inputtext.p-invalid</code>, <code>.p-autocomplete</code>
          und <code>.p-autocomplete.p-focus</code> sowie die <code>html.style-*</code>-Blöcke in
          <code>styles.scss</code>; die Gewinner folgen aus der Spezifität der Selektoren &#8212;
          <code>html.style-* input.p-inputtext</code> schlägt <code>.p-inputtext.p-invalid</code>, also trägt die
          Invalid-Kante des Kits <code>!important</code>. Prüf es in deinem Build: Markier ein unberührtes Feld mit
          <code>[invalid]</code> und lies die berechnete <code>border-color</code> des Inputs.
        </p>
        <p class="src-note">
          <strong>Außerhalb des Stylesheets dieses Kits</strong> hat das Token-Feld wieder Auras genullten Ring. Setz
          <code>--p-autocomplete-focus-ring-width</code>, <code>-style</code>, <code>-color</code> und
          <code>-offset</code> auf eine Klasse <em>um</em> das Formular, nicht auf <code>:root</code>: Das Theme
          deklariert seine Tokens auf <code>:root, :host</code> aus einem zur Laufzeit eingefügten
          <code>&lt;style&gt;</code>-Element neu, das nach dem Stylesheet landet und bei gleicher Spezifität gewinnt.
        </p>

        <h3>Das Overlay und die Optionszeilen</h3>
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
                <td>Overlay-Breite</td>
                <td>
                  <code>min-width: 100%</code> des Hosts &#8212; gemessen gleich der eigenen Breite des Felds bei jedem
                  getesteten Viewport; sie wächst mit langen Zeilen und schrumpft nie unter das Steuerelement
                </td>
              </tr>
              <tr>
                <td>Overlay-Radius / -Rahmen / -Schatten</td>
                <td>
                  <code>&#123;border.radius.md&#125;</code> (je Stil); 1px <code>&#123;surface.200&#125;</code> hell,
                  <code>&#123;surface.700&#125;</code> dunkel (Auras Standardpalette);
                  <code>0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -2px rgba(0,0,0,.1)</code>
                </td>
              </tr>
              <tr>
                <td>Scroll-Höhe</td>
                <td>
                  <code>scrollHeight</code>, Standard <code>200px</code> (<code>openng-optimus-ui-autocomplete.mjs:266</code>);
                  ab ein paar hundert Zeilen nimm <code>[virtualScroll]</code> mit <code>virtualScrollItemSize</code>
                </td>
              </tr>
              <tr>
                <td>Listen-Padding / -Abstand</td>
                <td>4px / 2px</td>
              </tr>
              <tr>
                <td>Options-Padding / -Radius / -Höhe</td>
                <td>8px 12px / 4px / 37px</td>
              </tr>
              <tr>
                <td>Option &#8212; fokussiert</td>
                <td>
                  Der Kit-Ring innerhalb der Zeile gezeichnet (<code>.p-autocomplete-option.p-focus</code>, 2px
                  <code>--primary-color-fg</code>, Offset -2px; „option list focus“ in <code>CONTRAST.MD</code>, 3,48:1
                  und mehr) über Auras Füllung, <code>&#123;surface.100&#125;</code> hell; 24 % von
                  <code>&#123;primary.400&#125;</code> dunkel
                </td>
              </tr>
              <tr>
                <td>Option &#8212; ausgewählt</td>
                <td>
                  16 % von <code>&#123;primary.400&#125;</code> dunkel; <code>&#123;primary.50&#125;</code> hell &#8212;
                  der Akzent um 90 % aufgehellt, eine schwache Tönung auf dem weißen Overlay. Wenn eine ausgewählte Zeile
                  auffindbar sein muss, render die Markierung selbst in <code>#item</code>
                </td>
              </tr>
              <tr>
                <td>Gruppen-Header</td>
                <td>
                  font-weight 600, Padding 8px 12px, transparenter Hintergrund &#8212; und <code>role="option"</code>,
                  siehe „Entwicklung“
                </td>
              </tr>
              <tr>
                <td>Overlay-Tokens</td>
                <td>
                  Das Preset bildet sie auf <code>&#123;overlay.select.*&#125;</code> ab &#8212; buchstäblich dieselbe
                  Familie wie bei <code>p-select</code>, also bleiben ein gethemtes Dropdown und ein gethemtes
                  Autocomplete gratis visuell einheitlich
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus den aufgelösten Custom Properties und dem berechneten Style eines geöffneten Overlays; Token-Namen
          aus <code>&#64;openng/optimus-ui-themes/dist/aura/autocomplete/index.mjs</code>. Das Overlay wird in einen
          <code>.p-overlay-content</code>-Wrapper teleportiert, also kann eine Aufrufstelle, die ihren eigenen Container
          mit <code>overflow: hidden</code> beschneidet, die Liste trotzdem abschneiden &#8212; <code>appendTo="body"</code>
          ist der Ausweg, um den Preis, jedes Overlay-Styling über <code>panelStyleClass</code> einzugrenzen.
        </p>

        <h3>Chips: Geometrie, und das eine, was du bei 360px prüfen solltest</h3>
        <p>
          Ein Chip ist ein <code>p-chip</code> in einem <code>li</code>; Aura gibt dem Autocomplete-Chip drei eigene
          Tokens &#8212; <code>chip.borderRadius</code> (<code>&#123;border.radius.sm&#125;</code>) plus einen
          Fokus-Hintergrund und eine Fokus-Farbe je Farbschema (<code>surface.200</code> auf <code>surface.800</code>
          hell, <code>surface.700</code> auf <code>surface.0</code> dunkel) &#8212;, alles andere erbt er von der
          Chip-Komponente: 29px hoch, Padding 4px/12px, Radius <code>&#123;border.radius.sm&#125;</code> (0 in Werkbund,
          8px Lernwerkstatt, 6px Skizzenbuch, 2px Blaupause), Füllung <code>&#123;surface.100&#125;</code> hell und
          <code>&#123;surface.800&#125;</code> dunkel (Auras Standardpalette). Der per Tastatur fokussierte Chip behält
          Auras Fokus-Tönung und bekommt den Kit-Ring innen gezeichnet
          (<code>.p-autocomplete-chip-item.p-focus .p-autocomplete-chip</code>, 2px <code>--primary-color-fg</code>,
          Offset -2px, weil die Feld-Box ein paar px nach außen abschneidet): „focus ring“, eingerückte Zeilen auf
          <code>autocomplete.chip.focus.background</code>, 3,78:1 und mehr.
        </p>
        <p>
          Die Chip-Reihe bricht um, statt zu scrollen. Zwei kurze Chips passen noch in die 39px, die ein Feld im
          Einzelmodus einnimmt, also ist das Wachstum unsichtbar, bis die Reihe umbricht &#8212; und dann springt sie um
          eine ganze Zeile auf einmal. Auf einem schmalen Viewport kann eine Auswahl aus vier Chips zu vier gestapelten
          Reihen werden und den Rest des Formulars aus dem Bildschirm schieben. Wenn das zählt, begrenze die Anzahl,
          kürze die Labels oder verlege die Auswahl in eine Liste unter dem Feld.
        </p>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide belegen kann &#8212; ein nicht aufgeführtes Kriterium wird nicht
          beansprucht.
          <strong>Erfüllt:</strong> SC 4.1.2 im Einzelmodus (ein Input mit <code>role="combobox"</code>, labelbar über
          <code>&lt;label for&gt;</code> und <code>inputId</code>); SC 2.4.7 für den Dropdown-Button, beide Feldmodi und
          den fokussierten Chip (der 2px-Ring <code>--primary-color-fg</code> des Kits auf allen vieren, beide
          Farbmodi; „focus ring“ im Kontrast-Gate); und SC 2.5.8 für das
          Feld selbst &#8212; 33px klein, 39px Standard, 46px groß, jede Größe über der Untergrenze von 24px; SC 1.4.3
          und 1.4.11 für Text, Placeholder und Kante des Felds in beiden Modi und jedem Stil, die
          <code>--control-border</code>-Kante des Token-Felds und das Dropdown-Icon eingeschlossen (Kontrast-Gate,
          „form field edge“ und „form field icon“). <strong>Bedingt:</strong> SC 4.1.2 im
          Mehrfachmodus &#8212; das Textfeld trägt weiterhin <code>role="combobox"</code>, sitzt aber in einer
          Optionszeile und hat keinen typisierten Pass-through-Weg für einen Namen; der Accessible Name des
          Dropdown-Buttons ist leer, solange <code>dropdownAriaLabel</code> nicht gesetzt ist; und SC 3.3.1 braucht
          deinen eigenen Fehlertext, weil die rote Invalid-Kante des Kits Farbe ist, kein Text.
          <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>AutoCompleteModule</code> exportiert die Komponente unter drei Selektoren (<code>p-autoComplete</code>,
          <code>p-autocomplete</code>, <code>p-auto-complete</code>); nimm bevorzugt den durchgehend kleingeschriebenen.
          Sie ist ein <code>ControlValueAccessor</code>, der <code>BaseInput</code> erweitert, also funktionieren
          <code>[(ngModel)]</code>, <code>formControlName</code> und die gemeinsamen Inputs <code>size</code> /
          <code>variant</code> / <code>fluid</code> /
          <code>invalid</code>
          alle.
        </p>

        <h3>Der Vertrag von completeMethod</h3>
        <p>Das ist der ganze Motor, und er hat vier Regeln, die leicht zu brechen sind:</p>
        <ol>
          <li>
            <strong>Das Filtern gehört dir.</strong> Das Steuerelement filtert nie etwas. Es sendet
            <code>completeMethod</code> mit <code>&#123; originalEvent, query &#125;</code> und rendert, was immer du in
            <code>[suggestions]</code> legst.
          </li>
          <li>
            <strong>Weise ein neues Array zu.</strong> <code>search()</code> setzt vor dem Senden ein internes
            <code>loading</code>-Flag, und nur der Hook für geänderte Vorschläge senkt es wieder und öffnet das Overlay
            (<code
              >openng-optimus-ui-autocomplete.mjs:1340</code
            >
            und <code>:839-848</code>). Ein Push ins bestehende Array ändert nichts auf dem Bildschirm; ein
            Codepfad, der nie zuweist, lässt den Spinner für immer drehen. Lass auch den Fehlerzweig ein leeres Array
            zuweisen.
          </li>
          <li>
            <strong>Zwei Schwellen steuern den Aufruf.</strong> <code>minQueryLength</code> (kein eigener Standard; es
            fällt auf das weiterhin ausgelieferte, veraltete <code>minLength</code> zurück, Standard <code>1</code>) und
            <code>delay</code> (Standard <code>300</code> ms)
            &#8212; und die Anfrage fällt ganz weg, wenn sie leer ist (<code>:1337</code>). Erhöhe beide für eine
            entfernte Quelle; senke sie nur für ein lokales Array.
          </li>
          <li>
            <strong>Späte Antworten werden nicht abgeglichen.</strong> Nichts ordnet eine Antwort der Anfrage zu, die sie
            ausgelöst hat, also kann eine langsame Anfrage eine neuere überschreiben. Verwirf veraltete Antworten selbst
            &#8212; vergleich mit der aktuellen Anfrage oder nimm einen Operator im Stil von switch.
          </li>
        </ol>
        <pre class="code-block"><code>{{ completeSnippet }}</code></pre>

        <h3>Zentrale Inputs</h3>
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
                <td><code>suggestions</code></td>
                <td>any[]</td>
                <td>Die Zeilen, die <em>jetzt</em> gezeigt werden. Weise es neu zu, verändere es nie.</td>
              </tr>
              <tr>
                <td><code>optionLabel</code></td>
                <td>string</td>
                <td>Property mit dem sichtbaren Text. Auch das, womit <code>forceSelection</code> abgleicht.</td>
              </tr>
              <tr>
                <td><code>optionValue</code></td>
                <td>string</td>
                <td>Property, die statt des ganzen Objekts ins Model geschrieben wird.</td>
              </tr>
              <tr>
                <td><code>optionDisabled</code></td>
                <td>string</td>
                <td>Property, die eine Zeile als nicht auswählbar markiert.</td>
              </tr>
              <tr>
                <td><code>minQueryLength</code></td>
                <td>number</td>
                <td>
                  Zeichen vor der ersten Anfrage. Kein eigener Standard; ungesetzt fällt es auf das veraltete
                  <code>minLength</code> (Standard <code>1</code>) zurück, das Optimus weiterhin ausliefert.
                </td>
              </tr>
              <tr>
                <td><code>delay</code></td>
                <td>number</td>
                <td>Tastendruck-Debounce in ms, Standard <code>300</code>.</td>
              </tr>
              <tr>
                <td><code>forceSelection</code></td>
                <td>boolean</td>
                <td>
                  Tippen schreibt nicht mehr ins Model; ein nicht passender Eintrag wird beim Übernehmen gelöscht. Siehe die
                  Fallstricke.
                </td>
              </tr>
              <tr>
                <td><code>dropdown</code></td>
                <td>boolean</td>
                <td>
                  Fügt den Auslöser-Button hinzu. <code>dropdownMode</code> ist <code>'blank'</code> (fragt den leeren
                  String ab, zeigt also alles) oder <code>'current'</code> (fragt das Getippte erneut ab).
                </td>
              </tr>
              <tr>
                <td><code>multiple</code></td>
                <td>boolean</td>
                <td>
                  Das Model wird ein Array; Werte werden als Chips gerendert. Ändert das DOM, das ARIA und das
                  Tastaturmodell.
                </td>
              </tr>
              <tr>
                <td><code>unique</code></td>
                <td>boolean</td>
                <td>Standard <strong>true</strong>: Ein schon gewählter Wert kann nicht zweimal hinzugefügt werden.</td>
              </tr>
              <tr>
                <td><code>typeahead</code></td>
                <td>boolean</td>
                <td>
                  Standard <code>true</code>. Setz <code>false</code> für ein reines Token-Feld &#8212; dann fragt
                  <em>nichts</em> ab, und nur Enter / <code>separator</code> / <code>addOnBlur</code> /
                  <code>addOnTab</code> fügen Werte hinzu.
                </td>
              </tr>
              <tr>
                <td><code>separator</code></td>
                <td>string | RegExp</td>
                <td>
                  Übernimmt bei diesem Zeichen einen Chip. Nur im Mehrfachmodus mit <code>typeahead: false</code>; teilt
                  auch eingefügten Text auf.
                </td>
              </tr>
              <tr>
                <td><code>addOnBlur</code> / <code>addOnTab</code></td>
                <td>boolean</td>
                <td>
                  Übernehmen den offenen Text beim Verlassen des Felds / bei <kbd>Tab</kbd>. Beide stehen standardmäßig auf
                  <code>false</code>, also geht getippter, aber nicht übernommener Text still verloren.
                </td>
              </tr>
              <tr>
                <td><code>completeOnFocus</code></td>
                <td>boolean</td>
                <td>Fragt einmal beim ersten Fokus ab, noch vor jedem Tippen.</td>
              </tr>
              <tr>
                <td><code>autoOptionFocus</code></td>
                <td>boolean</td>
                <td>
                  Standard <strong>false</strong>: Beim Öffnen ist keine Zeile fokussiert, und
                  <code>aria-activedescendant</code> fehlt bis zur ersten Pfeiltaste.
                </td>
              </tr>
              <tr>
                <td><code>selectOnFocus</code> / <code>autoHighlight</code></td>
                <td>boolean</td>
                <td>
                  Schreiben die fokussierte Zeile ins Model, während der Fokus wandert. Bequem mit der Maus, feindselig mit
                  der Tastatur.
                </td>
              </tr>
              <tr>
                <td><code>focusOnHover</code></td>
                <td>boolean</td>
                <td>Standard <strong>true</strong>: Die Maus verschiebt den Index des Tastaturfokus.</td>
              </tr>
              <tr>
                <td><code>group</code></td>
                <td>boolean</td>
                <td>
                  Mit <code>optionGroupLabel</code> + <code>optionGroupChildren</code> (Standard <code>'items'</code>).
                  Lies den ARIA-Vorbehalt unten.
                </td>
              </tr>
              <tr>
                <td><code>emptyMessage</code></td>
                <td>string</td>
                <td>
                  Die Zeile „nichts gefunden“. Achte auf den Namen: Er überschreibt das <code>emptySearchMessage</code>
                  der Bibliothek, nicht ihr <code>emptyMessage</code>.
                </td>
              </tr>
              <tr>
                <td><code>selectionMessage</code> / <code>emptySelectionMessage</code></td>
                <td>string</td>
                <td>
                  Der Text der Live-Region, <code>&#123;0&#125;</code> ersetzt durch die Zahl der gewählten Werte. Diese
                  erreichen den Nutzer tatsächlich. Siehe den Tab „Internationalisierung (i18n)“.
                </td>
              </tr>
              <tr>
                <td><code>searchMessage</code></td>
                <td>string</td>
                <td>
                  <strong>In Optimus 2.0.2 nie gerendert.</strong> Sein einziger Abnehmer ist die Zeile für leere
                  Ergebnisse, die nur existiert, wenn es keine Ergebnisse gibt &#8212; und in diesem Zustand nimmt der
                  Getter den <code>emptySearchMessage</code>-Zweig. Die Ergebniszahl wird deshalb nie angesagt.
                </td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  Setzt die <code>id</code> des echten Inputs &#8212; und lässt damit
                  <code>&lt;label for&gt;</code> funktionieren.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>Landen auf demselben Input. Nur verwenden, wo es keine sichtbare Beschriftung gibt.</td>
              </tr>
              <tr>
                <td><code>dropdownAriaLabel</code></td>
                <td>string</td>
                <td>
                  Der Accessible Name des Auslöser-Buttons. <strong>Kein Standard</strong> &#8212; ungesetzt heißt ein
                  Button ohne Namen.
                </td>
              </tr>
              <tr>
                <td><code>showClear</code></td>
                <td>boolean</td>
                <td>Fügt ein Löschen-Icon nur für die Maus hinzu, sobald ein Wert existiert.</td>
              </tr>
              <tr>
                <td><code>scrollHeight</code></td>
                <td>string</td>
                <td>Höhe der Overlay-Liste, Standard <code>'200px'</code>.</td>
              </tr>
              <tr>
                <td><code>virtualScroll</code> + <code>virtualScrollItemSize</code></td>
                <td>boolean + number</td>
                <td>Für sehr lange Treffermengen; die Zeilengröße ist fest und Pflicht.</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td>Signal-Input</td>
                <td>
                  <code>'body'</code> entkommt einem beschneidenden Vorfahren; style das Overlay danach über
                  <code>panelStyleClass</code>.
                </td>
              </tr>
              <tr>
                <td><code>searchLocale</code></td>
                <td>(siehe Fallstricke)</td>
                <td>
                  Gedacht als Locale für die Groß-/Kleinschreibung beim Abgleich von <code>forceSelection</code> &#8212;
                  aber mit einer booleschen Transformation deklariert.
                </td>
              </tr>
              <tr>
                <td>
                  <code>size</code> / <code>variant</code> / <code>fluid</code> / <code>invalid</code> /
                  <code>disabled</code> / <code>required</code> / <code>name</code>
                </td>
                <td>&#8212;</td>
                <td>
                  Geerbt von <code>BaseInput</code> und <code>BaseEditableHolder</code>, genau wie bei einem Texteingabefeld.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs und Standardwerte gelesen aus der Klasse <code>AutoComplete</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-autocomplete.mjs</code> (Optimus UI 2.0.2, Version aus
          <code>node_modules/&#64;openng/optimus-ui/package.json</code>): <code>minLength</code> 210, <code>delay</code>
          220, <code>scrollHeight</code> 266, <code>unique</code> 336, <code>completeOnFocus</code> 346,
          <code>showEmptyMessage</code> 361, <code>dropdownMode</code> 366, <code>addOnTab</code> 376,
          <code>optionGroupChildren</code> 418, <code>autoOptionFocus</code> 477, <code>focusOnHover</code> 497,
          <code>typeahead</code> 503, <code>addOnBlur</code> 509.
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
                <td><code>completeMethod</code></td>
                <td><code>&#123; originalEvent, query &#125;</code></td>
                <td>Eine Anfrage ist fällig. Dein einziges Signal zum Laden.</td>
              </tr>
              <tr>
                <td><code>onSelect</code> / <code>onUnselect</code></td>
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>Ein Vorschlag wurde gewählt / ein Chip wurde entfernt.</td>
              </tr>
              <tr>
                <td><code>onAdd</code></td>
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>
                  Ein Wert, den der Nutzer <em>getippt</em> hat, wurde übernommen (Trennzeichen, Enter, Blur, Tab, Einfügen).
                </td>
              </tr>
              <tr>
                <td><code>onClear</code></td>
                <td>&#8212;</td>
                <td>Das Löschen-Icon wurde benutzt, oder der Text im Einzelmodus wurde geleert.</td>
              </tr>
              <tr>
                <td><code>onDropdownClick</code></td>
                <td><code>&#123; originalEvent, query &#125;</code></td>
                <td>Der Auslöser-Button wurde gedrückt.</td>
              </tr>
              <tr>
                <td><code>onShow</code> / <code>onHide</code></td>
                <td>&#8212;</td>
                <td>Overlay geöffnet / geschlossen.</td>
              </tr>
              <tr>
                <td><code>onFocus</code> / <code>onBlur</code></td>
                <td>Event</td>
                <td>Das Input hat den Fokus bekommen / verloren.</td>
              </tr>
              <tr>
                <td><code>onInputKeydown</code> / <code>onKeyUp</code></td>
                <td>KeyboardEvent</td>
                <td>Rohe Tasten-Events, gesendet vor der eigenen Behandlung der Komponente.</td>
              </tr>
              <tr>
                <td><code>onLazyLoad</code></td>
                <td>Scroller-Event</td>
                <td>Das virtuelle Scrollen braucht das nächste Stück.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Templates</h3>
        <p>
          Optimus fragt diese über den <strong>Namen der Template-Referenz</strong> ab &#8212;
          <code>&lt;ng-template #item let-option&gt;</code> &#8212; und akzeptiert, weil die Content-Query für
          <code>PrimeTemplate</code> aus v21 in diesem Fork überlebt hat, weiterhin die alte Form
          <code>pTemplate="item"</code>. Wähl einen Stil pro Projekt.
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
                <td>Eine Vorschlagszeile. Kontext: die Option, plus <code>index</code>.</td>
              </tr>
              <tr>
                <td><code>#selecteditem</code></td>
                <td>
                  Den Inhalt eines Chips im Mehrfachmodus. Im Einzelmodus wirkt es nicht &#8212; dort zeigt das Input
                  schlichten Text.
                </td>
              </tr>
              <tr>
                <td><code>#group</code></td>
                <td>Eine Gruppen-Header-Zeile.</td>
              </tr>
              <tr>
                <td><code>#header</code> / <code>#footer</code></td>
                <td>Rahmen-Inhalt über / unter der Liste.</td>
              </tr>
              <tr>
                <td><code>#empty</code></td>
                <td>Die Zeile „nichts gefunden“, anstelle von <code>emptyMessage</code>.</td>
              </tr>
              <tr>
                <td><code>#loader</code></td>
                <td>Skeleton-Zeilen fürs virtuelle Scrollen.</td>
              </tr>
              <tr>
                <td>
                  <code>#removeicon</code>, <code>#clearicon</code>, <code>#dropdownicon</code>,
                  <code>#loadingicon</code>
                </td>
                <td>Die vier Icons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ templateSnippet }}</code></pre>
        <p class="src-note">
          Slot-Namen aus den Content-Queries der Komponente (<code>itemTemplate</code>,
          <code>selectedItemTemplate</code>, <code>groupTemplate</code>, <code>headerTemplate</code>,
          <code>footerTemplate</code>, <code>emptyTemplate</code>, <code>loaderTemplate</code>,
          <code>removeIconTemplate</code>, <code>clearIconTemplate</code>, <code>dropdownIconTemplate</code>,
          <code>loadingIconTemplate</code>) in <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-autocomplete.mjs</code>.
        </p>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>
          Jeder Token ist als <code>--p-autocomplete-*</code> verfügbar, aber die Root-Tokens (Rahmen, Hintergrund,
          Padding, Radius, Placeholder, Fokus-Ring) malen nur die Box im <strong>Mehrfachmodus</strong>. Das Input im
          Einzelmodus ist ein <code>pInputText</code> und liest stattdessen <code>--p-inputtext-*</code> &#8212; theme
          es so, wie der Guide zu Text Inputs es beschreibt, einschließlich der Stilregel, die seine Rahmenfarbe festlegt.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom Property</th>
                <th>Steuert</th>
                <th>Gewinnt in diesem Kit?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>--p-autocomplete-border-radius</code>, <code>-padding-x</code> / <code>-y</code>,
                  <code>-border-color</code>, <code>-placeholder-color</code>
                </td>
                <td>Die Box im Mehrfachmodus.</td>
                <td>
                  Rahmenfarbe: nein, das Kit deklariert sie am Element (<code>--control-border</code>);
                  Placeholder-Farbe: nur hell, dunkel deklariert sie ebenfalls am Element
                  (<code>--control-placeholder</code>); die übrigen dort ja. Keine Wirkung auf das Input im Einzelmodus.
                </td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-dropdown-width</code></td>
                <td>Spalte des Auslöser-Buttons (und der Einzug des Loaders).</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td>
                  <code>--p-autocomplete-option-padding</code> / <code>--p-autocomplete-option-border-radius</code>
                </td>
                <td>Vorschlagszeilen.</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-chip-border-radius</code></td>
                <td>Chip-Ecken im Mehrfachmodus.</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-invalid-border-color</code></td>
                <td>Invalid-Rahmen.</td>
                <td>
                  Nein: Das Kit deklariert sie am Element (<code>--semantic-red-fg</code>). Sie malt nur die Box im
                  Mehrfachmodus; das Input im Einzelmodus nimmt das Rot aus <code>input.p-inputtext.p-invalid</code> des
                  Kits.
                </td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-focus-ring-width</code> und Verwandte</td>
                <td>Fokus-Kontur der Box im Mehrfachmodus.</td>
                <td>
                  Hier nicht nötig: Die Regel <code>.p-autocomplete.p-focus</code> des Kits zeichnet den Ring mit
                  <code>!important</code>. Außerhalb des Kits ja, von einem Vorfahren aus (Aura liefert die Breite
                  <code>0</code>).
                </td>
              </tr>
              <tr>
                <td><code>--p-autocomplete-dropdown-focus-ring-width</code></td>
                <td>Kontur des Auslöser-Buttons.</td>
                <td>
                  Nein: Die Ring-Regel des Kits (<code>.p-autocomplete-dropdown:focus-visible</code>,
                  <code>!important</code>) gewinnt. Außerhalb des Kits ist es Auras globaler 1px-Ring, nicht null.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> ist in <code>app.config.ts</code> konfiguriert (Theme-Optionen von
          <code>provideOptimus</code>). Sie auf <code>:root</code> zu setzen funktioniert nicht &#8212; siehe den Tab
          „Design“ zum <code>&lt;style&gt;</code>-Element zur Laufzeit, das es übertrumpft.
        </p>

        <h3>Formulare</h3>
        <p>
          Es wird ein echtes <code>&lt;input&gt;</code> gerendert, also nimmt dieses Steuerelement anders als
          <code>p-select</code> an einem nativen Formular teil &#8212; es reicht <code>name</code>, <code>required</code>,
          <code>readonly</code>, <code>minlength</code>, <code>maxlength</code> und <code>pattern</code> direkt aus
          <code>BaseInput</code> durch. Was es <em>nicht</em> tut, ist zu garantieren, dass das Angular-Model zum
          sichtbaren Text passt: In der Standardkonfiguration ist das Model, was getippt wurde, und mit
          <code>forceSelection</code> ist das Model immer nur ein gewähltes Objekt, während das Input kurz Text halten
          kann, der gleich gelöscht wird. Validiere das Model, nie das Input.
        </p>

        <h3>Fallstricke</h3>
        <ul>
          <li>
            <strong>Das veränderte Vorschlags-Array.</strong> Das Overlay öffnet sich als Reaktion auf eine neue
            Referenz; ein <code>push</code> an Ort und Stelle zeigt nichts und lässt den Spinner laufen.
          </li>
          <li>
            <strong><code>forceSelection</code> gleicht exakt ab, nicht großzügig.</strong>
            <code>isOptionMatched</code> vergleicht das komplette kleingeschriebene <code>optionLabel</code> mit der
            kompletten kleingeschriebenen Eingabe (<code>openng-optimus-ui-autocomplete.mjs:918</code>), und zwar gegen
            die <em>gerade sichtbaren</em> Vorschläge. Ein Nutzer, der eine echte Stadt schneller tippt, als die Anfrage
            zurückkommt, bekommt seinen Text trotzdem gelöscht.
          </li>
          <li>
            <strong>Ein <code>minQueryLength</code> von <code>0</code> wird uneinheitlich gelesen.</strong> Der Tipp-Pfad
            nutzt <code>minQueryLength || minLength</code> (<code>:955</code>), also fällt <code>0</code> auf
            <code>1</code> durch, während der <code>forceSelection</code>-Pfad <code>??</code> nutzt (<code>:1379</code>)
            und es respektiert. PrimeNG 22 hat <code>minLength</code> entfernt; Optimus behält das Paar aus v21, also ist
            die Asymmetrie in ihrer ursprünglichen Form zurück.
          </li>
          <li>
            <strong><code>searchLocale</code> kann keine Locale empfangen.</strong> Es ist mit einer booleschen
            Transformation deklariert, also kommt <code>searchLocale="de-DE"</code> als <code>true</code> an; der Aufruf
            von <code>toLocaleLowerCase</code> fällt dann still auf die Standard-Locale der Laufzeit zurück. Verlass dich
            nicht darauf für das türkische <em>i</em> mit und ohne Punkt oder Ähnliches &#8212; normalisiere stattdessen
            deine Labels.
          </li>
          <li>
            <strong><code>#selecteditem</code> bewirkt im Einzelmodus nichts.</strong> Der Auslöser ist ein Input; es
            kann nur Text halten.
          </li>
          <li>
            <strong>Nicht übernommener Text verschwindet.</strong> In einem Token-Feld wird Text, der noch in der Box
            steht, wenn der Nutzer sie verlässt, verworfen, sofern nicht <code>addOnBlur</code> (oder
            <code>addOnTab</code>) gesetzt ist.
          </li>
          <li>
            <strong><code>focusOnHover</code> ist standardmäßig an</strong>, also kann eine verirrte Maus die Zeile
            verschieben, die <kbd>Enter</kbd> übernimmt.
          </li>
          <li>
            <strong>Overlay abgeschnitten von einem Vorfahren mit <code>overflow: hidden</code></strong> &#8594;
            <code>appendTo="body"</code>.
          </li>
        </ul>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Benennung: das Gegenteil des Select-Guides</h4>
        <p>
          Das fokussierbare Element ist hier ein echtes <code>&lt;input&gt;</code>, und ein Input ist ein labelbares
          Element &#8212; also ist das Muster, das bei einem <code>p-select</code> still scheitert, hier das richtige:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Muster</th>
                <th>Accessible Name</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>Die Beschriftung &#8212; gemessen „Stadt“</td>
                <td>
                  <strong>Funktioniert &#8212; nimm das.</strong> Eine sichtbare Beschriftung, die zugleich der
                  programmatische Name ist, und ein Klick darauf fokussiert das Feld.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>Der String, den du übergibst</td>
                <td>
                  <strong>Funktioniert.</strong> Beide werden an dasselbe Input gebunden. Nur verwenden, wenn es wirklich
                  keine sichtbare Beschriftung gibt.
                </td>
              </tr>
              <tr>
                <td><code>[attr.aria-label]</code> auf <code>&lt;p-autocomplete&gt;</code></td>
                <td>Unverändert &#8212; das Host-Attribut geht nicht in den Namen ein (Accessibility Tree)</td>
                <td>
                  <strong>Scheitert.</strong> Das Attribut landet auf dem rollenlosen Host-Wrapper, nicht auf der Combobox.
                </td>
              </tr>
              <tr>
                <td>nur <code>placeholder</code></td>
                <td><strong>Der Placeholder-Text</strong> &#8212; was immer der Hinweis sagt</td>
                <td>
                  <strong>Scheitert in der Praxis.</strong> Nicht, weil der Name leer ist &#8212; <code>placeholder</code>
                  ist der letzte Rückgriff in der Berechnung des Accessible Name, also <em>wird</em> er angesagt &#8212;,
                  sondern weil dieser Name beim ersten Tastendruck vom Bildschirm verschwindet und ein Hinweis kein Label
                  ist.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>ariaLabel</code> / <code>ariaLabelledBy</code> / <code>inputId</code> werden alle an das Element
          <code>#focusInput</code> gebunden (<code>openng-optimus-ui-autocomplete.mjs:1590-1634</code>, Optimus UI
          2.0.2); der Host bekommt nur die Root-Klasse und die Style-Bindings. Prüf es in deinem eigenen Build: Der
          Accessible Name des Combobox-Knotens muss die Beschriftung sein, und der Dropdown-Button muss einen eigenen
          Namen haben.
        </p>
        <p>
          Dieselbe Asymmetrie entscheidet, wie ein Hinweis oder eine Fehlermeldung verknüpft wird. Es gibt keinen Input
          <code>ariaDescribedBy</code>, und ein <code>aria-describedby</code>-Attribut auf dem Host ist dort genauso
          unsichtbar wie ein <code>aria-label</code>. Der unterstützte Weg ist das Pass-through:
          <code
            >[pt]="&#123; pcInputText: &#123; root: &#123; 'aria-describedby': 'city-rule' &#125; &#125; &#125;"</code
          >. Beachte das verschachtelte <code>root</code>: <code>pcInputText</code> leitet an die
          <code>pInputText</code>-Direktive weiter, deren eigene Pass-through-Form <code>&#123; root &#125;</code> ist
          (<code>InputTextPassThroughOptions</code>), also besteht ein flacher Attribut-Beutel dort die Typprüfung nicht.
          Dasselbe gilt für
          <code>aria-invalid</code>, das <code>[invalid]</code> nicht setzt &#8212; es fügt nur die Zustandsklasse hinzu.
        </p>
        <p>
          <strong>Dieser Weg deckt nur den Einzelmodus ab.</strong> Das Input im Mehrfachmodus ist mit
          <code>[pBind]="ptm('input')"</code> gebunden (<code>openng-optimus-ui-autocomplete.mjs:1693</code>), und
          <code>input</code> ist kein Schlüssel von <code>AutoCompletePassThroughOptions</code> &#8212; das
          <code>root</code>, <code>pcInputText</code>, <code>inputMultiple</code>, <code>chipItem</code>,
          <code>pcChip</code>, <code>chipIcon</code>, <code>inputChip</code> und die Overlay-Teile anbietet, aber nichts,
          was auf das eigene <code>&lt;input&gt;</code> des Token-Felds aufgelöst wird. Also erreicht
          <code>pcInputText</code> dort still nichts, und es gibt <em>kein</em> typisiertes Pass-through für
          <code>aria-describedby</code> oder <code>aria-invalid</code> an einem Chips-Steuerelement. Schreib die
          Einschränkung stattdessen in den Label-Text und drück Ungültigkeit als Meldung aus, die der sehende Nutzer und
          der Screenreader-Nutzer beide bekommen.
        </p>

        <h4>Das Combobox-Muster, gemessen an der APG</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>APG erwartet</th>
                <th>Optimus UI 2.0.2 rendert</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>role="combobox"</code> auf dem Texteingabefeld</td>
                <td><code>role="combobox"</code> auf dem <code>&lt;input&gt;</code> selbst</td>
                <td>Erfüllt</td>
              </tr>
              <tr>
                <td><code>aria-autocomplete="list"</code></td>
                <td>Statisches Attribut auf dem Input</td>
                <td>Erfüllt</td>
              </tr>
              <tr>
                <td><code>aria-expanded</code> folgt dem Popup</td>
                <td><code>"false"</code> geschlossen, <code>"true"</code> offen</td>
                <td>Erfüllt</td>
              </tr>
              <tr>
                <td><code>aria-controls</code> benennt die Listbox, solange sie offen ist</td>
                <td><code>&lt;id&gt;_list</code>, solange offen; geschlossen wird das Attribut entfernt</td>
                <td>Erfüllt</td>
              </tr>
              <tr>
                <td><code>aria-activedescendant</code> benennt die sichtbar fokussierte Option</td>
                <td>Fehlt beim Öffnen; nach <kbd>↓</kbd> hält es die id der fokussierten Zeile</td>
                <td>
                  Erfüllt, mit einem Vorbehalt: <code>autoOptionFocus</code> ist standardmäßig <code>false</code>, also
                  ist bis zu einer Pfeiltaste keine Zeile fokussiert.
                </td>
              </tr>
              <tr>
                <td>die Kinder des Popups sind <code>option</code> oder <code>group</code></td>
                <td>
                  Zeilen sind <code>li[role=option]</code> mit <code>aria-setsize</code> / <code>aria-posinset</code> /
                  <code>aria-selected</code> &#8212; aber das sind Gruppen-Header und die Leer-Zeile auch
                </td>
                <td>
                  <strong>Nicht erfüllt</strong>, wenn <code>[group]</code> an ist, und nicht erfüllt von der Zeile mit der
                  Leer-Meldung.
                </td>
              </tr>
              <tr>
                <td>eine Combobox ist kein Nachfahre einer <code>option</code></td>
                <td>
                  Im Mehrfachmodus sitzt das Input in <code>li[role=option]</code> innerhalb der Chip-
                  <code>ul[role=listbox]</code>
                </td>
                <td>
                  <strong>Nicht erfüllt</strong> &#8212; ein Defekt verschachtelter Rollen, den du an der Aufrufstelle nicht
                  beheben kannst.
                </td>
              </tr>
              <tr>
                <td>Ergebniszahlen werden höflich angesagt</td>
                <td>Ein <code>span[role=status][aria-live=polite]</code>, innerhalb des Overlays</td>
                <td>
                  Teilweise: Die Region existiert nur, solange das Overlay offen ist, und sie trägt die
                  <em>Auswahl</em>-Meldung, nicht die Ergebniszahl.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Tastatur &#8212; Einzelmodus</h4>
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
                <td>Fokus hinein / hinaus; das Feld ist ein normaler Tab-Stopp.</td>
                <td>Übernimmt die fokussierte Zeile, falls es eine gibt, und geht dann weiter.</td>
              </tr>
              <tr>
                <td><kbd>↓</kbd> / <kbd>↑</kbd></td>
                <td>Öffnet die Liste, wenn es Vorschläge gibt; ändert den Wert nicht.</td>
                <td>Nächste / vorige Zeile.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>Cursor an Anfang / Ende des Texts (mit <kbd>Shift</kbd> wird markiert).</td>
                <td>Genauso &#8212; sie wirken auf den Text, nicht auf die Liste.</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> / <kbd>PageDown</kbd></td>
                <td>&#8212;</td>
                <td>Scrollt die Liste zur ersten / letzten Zeile.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Nichts (das Formular wird womöglich abgeschickt).</td>
                <td>Übernimmt die fokussierte Zeile und schließt.</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>&#8212;</td>
                <td>Schließt und gibt den Fokus ans Input zurück.</td>
              </tr>
              <tr>
                <td><kbd>←</kbd> / <kbd>→</kbd></td>
                <td>Bewegen den Cursor.</td>
                <td>Bewegen den Cursor und heben den Zeilenfokus auf.</td>
              </tr>
              <tr>
                <td><kbd>Backspace</kbd></td>
                <td>Bearbeitet den Text wie in jedem Input.</td>
                <td>Genauso.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4>Tastatur &#8212; Mehrfachmodus, und wie ein Chip entfernt wird</h4>
        <ul>
          <li>
            <strong><kbd>Backspace</kbd> in einem leeren Textfeld entfernt den letzten Chip</strong> und sendet
            <code>onUnselect</code> (<code>openng-optimus-ui-autocomplete.mjs:1284-1290</code>).
          </li>
          <li>
            <strong><kbd>←</kbd> in einem leeren Textfeld wechselt in die Chip-Reihe</strong> (<code>:1159</code>), die
            ein <code>ul</code> mit <code>tabindex="-1"</code> ist &#8212; nur auf diesem Weg erreichbar, nie per
            <kbd>Tab</kbd>. Von dort laufen <kbd>←</kbd> / <kbd>→</kbd> durch die Chips (der fokussierte zeigt den
            Kit-Ring in seinem Inneren), und <kbd>Backspace</kbd> entfernt den fokussierten
            (<code>:986</code>, <code>:1280</code>); <kbd>Delete</kbd> wird nicht behandelt. Danach kehrt der Fokus ins
            Textfeld zurück (<code>:1315</code>).
          </li>
          <li>
            <strong>Das eigene Entfernen-Icon des Chips ist nur für die Maus</strong> &#8212; ein nacktes
            <code>&lt;span&gt;</code> mit einem Klick-Handler: keine <code>role</code>, kein <code>tabindex</code>, also
            weder fokussierbar noch als Aktion angesagt (sein inneres SVG ist <code>aria-hidden</code>). An der
            Aufrufstelle lässt sich das nicht beheben; die Tastaturwege oben sind alles, also beschreib das kleine Kreuz
            nicht als den Weg, einen Wert zu entfernen.
          </li>
          <li>
            <strong>Jeder Chip ist eine <code>option</code> mit <code>aria-selected="true"</code></strong> in einer
            horizontalen Listbox, benannt per <code>aria-label</code> aus <code>optionLabel</code>. Gib jedem Chip ein
            Label, das auch ohne Kontext Sinn ergibt, denn das ist der einzige Text, den ein Screenreader bekommt.
          </li>
        </ul>

        <h4>Bekannte Lücken in der Bibliothek &#8212; überdeck sie nicht stillschweigend</h4>
        <ul>
          <li>
            <strong>Gruppen-Header und die Leer-Zeile sind Optionen</strong>
            (<code>openng-optimus-ui-autocomplete.mjs:1791</code>, <code>:1827</code>), also werden sie mitgezählt und
            als wählbar angesagt. Nimm lieber flache Ergebnislisten; wenn Gruppierung unverzichtbar ist, halte die Zahl
            der Gruppen klein.
          </li>
          <li>
            <strong>Der Dropdown-Button kann namenlos sein.</strong> <code>dropdownAriaLabel</code> hat keinen Standard
            und keinen Rückgriff auf den Übersetzungsdienst &#8212; ein ungesetztes liefert einen Button ohne Accessible
            Name aus.
          </li>
          <li>
            <strong>Das Löschen-Icon ist per Tastatur nicht erreichbar</strong>, also ist <code>showClear</code> nur ein
            Angebot für die Maus. Tastaturnutzer löschen, indem sie den Text markieren und entfernen.
          </li>
          <li>
            <strong>Eine Combobox innerhalb einer Option</strong> im Mehrfachmodus (siehe die APG-Tabelle) und eine
            Chip-Container-<code>listbox</code>, deren letztes Kind eine unbenannte <code>option</code> ist, die dieses
            Input umschließt.
          </li>
          <li>
            <strong>Außerhalb dieses Kits kein Ring in keinem der beiden Feldmodi</strong> &#8212; Aura setzt den
            Feld-Ring auf null; das Kit zeichnet schon einen in beiden Modi, und der Tab „Design“ hat die Tokens, um ihn
            anderswo wiederherzustellen.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>
            ☐ Eine sichtbare Beschriftung existiert und ist mit <code>&lt;label for&gt;</code> + <code>inputId</code>
            gebunden (oder, nur wenn es keine Beschriftung gibt, <code>ariaLabel</code>).
          </li>
          <li>☐ <code>placeholder</code> ist ein Hinweis, nicht das Label.</li>
          <li>
            ☐ <code>[dropdown]="true"</code>, außer der Nutzer kennt das Vokabular nachweislich &#8212; und dann ist
            <code>dropdownAriaLabel</code> gesetzt und übersetzt.
          </li>
          <li>
            ☐ Der Model-Typ ist ehrlich: <code>string</code>, wenn Freitext erlaubt ist, sonst dein Objekt &#8212; und
            wenn nicht, erzwingt ihn <code>forceSelection</code> oder ein Validator.
          </li>
          <li>
            ☐ Mit <code>forceSelection</code>: eine sichtbare Regel, mit dem Input verknüpft über
            <code>[pt]="&#123; pcInputText: &#123; root: &#123; 'aria-describedby': … &#125; &#125; &#125;"</code>
            &#8212; nur im Einzelmodus; ein Token-Feld hat kein typisiertes Pass-through zu seinem Input, also muss die
            Regel im Label stehen. So oder so wird ein abgelehnter Eintrag ohne Meldung gelöscht.
          </li>
          <li>
            ☐ <code>completeMethod</code> weist auf jedem Pfad ein <em>neues</em> Array zu, auch auf dem Fehlerpfad.
          </li>
          <li>
            ☐ Der Fokus ist am Feld in <strong>beiden</strong> Themes sichtbar &#8212; prüf es, nimm es nicht an.
          </li>
          <li>
            ☐ Tastatur: erreichbar per <kbd>Tab</kbd>; <kbd>↓</kbd> öffnet, <kbd>Enter</kbd> übernimmt, <kbd>Esc</kbd>
            schließt und behält den Fokus.
          </li>
          <li>
            ☐ Mehrfachmodus: Das Label jedes Chips liest sich auch allein sinnvoll, und das Entfernen ist als
            <kbd>Backspace</kbd> dokumentiert (das Icon ist nur für die Maus).
          </li>
          <li>
            ☐ <code>emptyMessage</code> und die beiden Auswahlmeldungen sind übersetzt; ein Sprachwechsel baut sie neu.
          </li>
          <li>☐ Die Vorschlagszeile zeigt, was zwei ähnliche Labels unterscheidet.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die zwei Regeln festnagelt, die am ehesten wieder kaputtgehen
          &#8212; das Label benennt wirklich die Combobox, und der Auslöser-Button hat wirklich einen Namen:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Deine Strings</h3>
        <ul>
          <li>
            <strong>Das Label und der Placeholder</strong> &#8212; das Label trägt die Bedeutung, der Placeholder höchstens
            ein Beispiel für die Form der Eingabe („Tipp den Anfang einer Stadt“), nie den Namen des Felds.
          </li>
          <li>
            <strong><code>emptyMessage</code></strong> &#8212; die Zeile „nichts gefunden“. Formulier sie als nächsten
            Schritt, nicht als Sackgasse: Nenn, wonach gesucht wurde und was man versuchen kann.
          </li>
          <li>
            <strong><code>dropdownAriaLabel</code></strong> &#8212; der einzige Accessible Name des Auslöser-Buttons. Es
            gibt keinen Standard, also liefert eine nicht übersetzte Aufrufstelle einen namenlosen Button aus.
          </li>
          <li>
            <strong>Vorschlags-Labels sind Inhalt.</strong> Wenn deine Zeilen übersetzt werden, bau sie über den
            <code>TranslationService</code> des Kits im <code>completeMethod</code>-Handler (oder in einer
            <code>computed()</code>-Quelle), damit ein Sprachwechsel sie neu baut; eine einmal erfasste Liste veraltet.
          </li>
          <li>
            <strong><code>selectionMessage</code> und <code>emptySelectionMessage</code></strong> &#8212;
            Status-Strings nur für Screenreader mit einem Zähl-Platzhalter <code>&#123;0&#125;</code>, angesagt über die
            Live-Region des Overlays. Auch die musst du übersetzen; der nächste Abschnitt zeigt, warum die
            Bibliotheksbrücke des Kits das nicht für dich erledigt. (<code>searchMessage</code> sieht aus wie ein
            dritter, aber nichts rendert ihn &#8212; siehe die Tabelle.)
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Ein Bibliotheks-String wird für dich lokalisiert, vier nicht</h3>
        <p>
          Optimus hat ein eigenes Übersetzungs-Bundle, und diese Komponente liest
          <strong>fünf</strong> Strings daraus &#8212; aber sie liegen an zwei verschiedenen Stellen, und nur eine davon
          liegt auf dem Weg, den dieses Kit schon pflegt.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Bibliotheks-Schlüssel</th>
                <th>Englischer Standard</th>
                <th>Von diesem Kit lokalisiert?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name der Vorschlags-Listbox</td>
                <td><code>aria.listLabel</code></td>
                <td><code>'Option List'</code></td>
                <td>
                  <strong>Ja</strong> &#8212; das Kit schiebt bei jedem Sprachwechsel seine eigene
                  <code>assets/i18n/modules/&lt;lang&gt;/optimus.json</code> in den <code>aria</code>-Block.
                </td>
              </tr>
              <tr>
                <td>„N Ergebnisse verfügbar“</td>
                <td><code>searchMessage</code></td>
                <td><code>'Search results are available'</code></td>
                <td>
                  <strong>Gegenstandslos &#8212; in Optimus 2.0.2 von dieser Komponente nicht gerendert.</strong> Das
                  einzige Markup, das ihn liest, ist die Zeile für leere Ergebnisse, und die wird nur gerendert, wenn die
                  Ergebniszahl null ist, wo der Getter auf <code>emptySearchMessage</code> fällt. Ihn zu übersetzen ändert
                  nichts; die Ergebniszahl wird überhaupt nie angesagt, und das ist die Lücke bei SC 4.1.3, die unter
                  „Verwendung“ &#8594; „Quellen“ genannt ist.
                </td>
              </tr>
              <tr>
                <td>Nichts gefunden</td>
                <td><code>emptySearchMessage</code></td>
                <td><code>'No results found'</code></td>
                <td>Nein. Beachte, dass der Input, der ihn überschreibt, <code>emptyMessage</code> heißt.</td>
              </tr>
              <tr>
                <td>„N Einträge ausgewählt“</td>
                <td><code>selectionMessage</code></td>
                <td><code>'&#123;0&#125; items selected'</code></td>
                <td>Nein. Auch im Englischen ohne Plural-Behandlung.</td>
              </tr>
              <tr>
                <td>Nichts ausgewählt</td>
                <td><code>emptySelectionMessage</code></td>
                <td><code>'No selected item'</code></td>
                <td>Nein.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Die Spaltung ist in einem Screenshot voll DOM zu sehen. Läuft das Kit auf Deutsch, trägt die Vorschlagsliste
          <code>aria-label="Optionsliste"</code> &#8212; der eigene String des Kits, durch den
          <code>aria</code>-Block geschoben &#8212;, während die Live-Region im selben Overlay
          <em>„No selected item“</em> liest und nach einer Auswahl <em>„1 items selected“</em>. Zwei Ansagen aus einer
          Komponente, eine übersetzt und eine nicht, dazu eine englische Zahl ohne Plural. Alles, was ein
          Screenreader-Nutzer hier hört und was du nicht selbst geschrieben hast, ist in der falschen Sprache.
        </p>
        <p class="src-note">
          Standardwerte aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-config.mjs</code>
          (<code>:169-172</code> für die vier Meldungen auf oberster Ebene, <code>:227</code> für
          <code>aria.listLabel</code>); die eigene Auflösungsreihenfolge der Komponente ist „dein Input, dann die
          Übersetzung der Bibliothek, dann ein leerer String“
          (<code>openng-optimus-ui-autocomplete.mjs:737-753</code>).
          Die Folge für eine mehrsprachige App: Die vier Strings auf oberster Ebene sind auch über
          <code>Optimus.setTranslation</code> erreichbar, aber sie stehen <em>nicht</em> im <code>aria</code>-Block, den
          das Kit schon neu schiebt, also erweitere entweder diesen Push oder übergib die vier Inputs an jeder
          Aufrufstelle. Die Inputs zu übergeben ist die kleinere Änderung und die, die das Snippet oben zeigt.
        </p>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>

        <h3>Abgleich über Sprachen hinweg</h3>
        <ul>
          <li>
            <strong>Der Abgleich gehört dir, also gehört dir auch die Normalisierung.</strong> Hier gibt es kein
            <code>filterMatchMode</code>: Dein <code>completeMethod</code> entscheidet, ob „osterreich“ auch
            „Österreich“ findet. Normalisiere beide Seiten (<code>String.prototype.normalize</code> plus Entfernen der
            Diakritika), statt dich auf <code>includes</code> zu verlassen.
          </li>
          <li>
            <strong><code>forceSelection</code> gleicht Groß-/Kleinschreibung mit einer Locale an, die du nicht setzen
            kannst</strong> &#8212; der Input <code>searchLocale</code> ist mit einer booleschen Transformation
            deklariert, also nutzt der Vergleich still die Standard-Locale der Laufzeit. In Sprachen, in denen die
            Groß-/Kleinschreibung von der Locale abhängt, vergleich eigene normalisierte Schlüssel, statt dem
            Label-Abgleich zu vertrauen.
          </li>
          <li>
            <strong>Sortiere je Sprache.</strong> Ein Ranking mit Präfix-Treffern zuerst, das im Englischen funktioniert,
            kann in einer Sprache falsch sein, in der das bedeutungstragende Wort zuletzt kommt; sortiere mit
            <code>localeCompare</code> in der aktiven Sprache, wenn du auf alphabetisch zurückfällst.
          </li>
        </ul>

        <h3>Länge und Layout</h3>
        <p>
          Deutsche Vorschlags-Labels sind 20&#8211;40 % länger als englische, und die beiden Modi scheitern
          unterschiedlich: Das Input im Einzelmodus zeigt eine Zeile Text, die unter dem Cursor horizontal scrollt,
          während die Chip-Reihe im Mehrfachmodus <em>umbricht</em> und das Steuerelement nach unten wachsen lässt. Gib
          dem Feld eine ausdrückliche Breite, teste die längste Sprache, die du auslieferst, und prüf eine Auswahl aus
          drei Chips bei 360px, bevor du es fertig nennst.
        </p>

        <h3>RTL</h3>
        <p>
          Das Overlay, das Löschen-Icon und der Dropdown-Button sind mit logischen Properties positioniert, also
          spiegeln sie sich unter <code>direction: rtl</code> ohne Arbeit an jeder Aufrufstelle. Heute ist hier nichts
          verdrahtet &#8212; das Kit liefert nur LTR-Sprachen aus &#8212;, und die Umbruchreihenfolge der Chip-Reihe ist
          nicht gegen eine gerenderte RTL-Locale geprüft.
        </p>
        <p class="src-note">
          Gelesen aus den ausgelieferten Stylesheet-Regeln für die Dropdown- und Löschen-Icon-Teile des Autocompletes.
          Nicht gegen eine gerenderte RTL-Locale geprüft.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der per Tastatur
            fokussierte Chip trägt den Kit-Ring in seinem Inneren (im Gate, eingerückte „focus ring“-Zeilen), die dunkle
            Box im Mehrfachmodus ist mit <code>--surface-section</code> gefüllt und hat Text und Placeholder der Felder,
            und die Spanne der Kante des Token-Felds ist neu zitiert (3,25&#8211;5,51:1).
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Token-Feld und der
            Dropdown-Button haben jetzt den 2px-Ring des Kits (die aktive Vorschlagszeile auch, innen gezeichnet), das
            Token-Feld die Kante <code>--control-border</code>, und
            beide Modi zeichnen die
            Invalid-Kante <code>--semantic-red-fg</code>, auch bei <code>[invalid]</code> allein. Die Zustandstabelle,
            die Theming-Tabelle, die Fallstricke und die WCAG-Zusammenfassung sagen das (das Scheitern an SC 1.4.11 ist
            weg), zitiert aus „form field edge“.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Neu geprüft gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016).
            Die Zustandsmatrix, die Overlay- und Chip-Werte, die Theming-Tabelle und die WCAG-Zusammenfassung beschreiben
            das heutige Kit: Die dunkle <code>.p-inputtext</code>-Regel biegt Tokens um (Hover, Fokus, Invalid und
            Disabled im Einzelmodus werden wieder gerendert), der Kit-Ring deckt das Input im Einzelmodus in beiden
            Farbmodi ab, und die <code>input.p-inputtext</code>-Regel jedes Stils unterdrückt im Einzelmodus die
            Rahmentönung von <code>[invalid]</code>. Die Theming-Tabelle sagt jetzt, welche Tokens welchen Modus
            erreichen (das Input im Einzelmodus liest <code>--p-inputtext-*</code>). Verhältnisse für Kante und
            Placeholder im Einzelmodus aus dem Kontrast-Gate zitiert; die Standard-Kante des Token-Felds als unter 3:1
            angegeben. Vier Zeilenverweise in die Bibliothek korrigiert; Radien je Stil; das Agent-Dokument unter das
            Größenziel gekürzt.
          </li>
          <li>
            <strong>v0.4</strong> &#8212; 02.09.2026 &#8212; Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): Zwei der drei
            in v0.3 festgehaltenen v22-Korrekturen sind wieder weg &#8212; das veraltete <code>minLength</code> ist
            zurück (und <code>minQueryLength</code> hat jetzt keinen eigenen Standard mehr), und
            <code>searchLocale</code> hat wieder seine boolesche Transformation; <code>[invalid]</code> erreicht das
            Token-Feld weiterhin, aber über
            <em>beides</em>, den <code>.p-autocomplete.p-invalid</code>-Style und einen wieder hinzugefügten
            <code>.ng-invalid.ng-dirty</code>-Block. <code>loading</code> ist wieder eine schlichte Property, und jeder
            Zeilenverweis wurde gegen die Optimus-Bundles neu hergeleitet; Aura-Tokens auf dem 2.x-Preset neu gelesen
            (<code>&#123;red.400&#125;</code>/<code>&#123;red.300&#125;</code>, genullte
            <code>form.field.focus.ring.*</code>).
          </li>
          <li>
            <strong>v0.3</strong> &#8212; 23.08.2026 &#8212; Neu geprüft gegen PrimeNG 22.1. Zwei Korrekturen in der
            Bibliothek festgehalten: <code>[invalid]</code> erreicht jetzt das Token-Feld (die Bindung an die Klasse
            <code>.p-invalid</code> ersetzte den Umweg über <code>.ng-invalid.ng-dirty</code>), und
            <code>searchLocale</code> hat seine boolesche Transformation verloren. Das veraltete <code>minLength</code>
            wurde entfernt (die Asymmetrie bei <code>minQueryLength: 0</code> überlebt). Die Fokus-Geschichte des Kits
            aktualisiert: Das Input im Einzelmodus ist von der Familienregel für den Fokus-Ring des Kits abgedeckt (im
            Browser geprüft), das Token-Feld noch nicht. <code>searchMessage</code> wird weiterhin nie gerendert.
            Zeilenverweise gegen 22.1.2 neu hergeleitet.
          </li>
          <li>
            <strong>v0.2</strong> &#8212; 20.08.2026 &#8212; WCAG-2.2-Statuszusammenfassung im Tab „Design“ ergänzt:
            gemessene Kriterien zusammengefasst als erfüllt / nicht erfüllt / bedingt, nicht gemessene Kriterien
            ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> &#8212; 30.07.2026 &#8212; Erste Fassung des Guides: die Entscheidungstabelle Select
            gegen Autocomplete, ein Live-Playground, drei gerenderte Do/Don’t-Paare, die Design- und ARIA-Messungen je
            Modus und das kanonische Agent-Dokument.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class AutoCompleteArticleDeComponent extends AutoCompleteArticleComponent {
  /** The same city list in German; every example and the ranking run over it. */
  override readonly allCities: City[] = [
    { name: 'Amsterdam', region: 'Niederlande' },
    { name: 'Antwerpen', region: 'Belgien' },
    { name: 'Athen', region: 'Griechenland' },
    { name: 'Barcelona', region: 'Spanien' },
    { name: 'Basel', region: 'Schweiz' },
    { name: 'Belgrad', region: 'Serbien' },
    { name: 'Bergen', region: 'Norwegen' },
    { name: 'Berlin', region: 'Deutschland' },
    { name: 'Bilbao', region: 'Spanien' },
    { name: 'Bologna', region: 'Italien' },
    { name: 'Bordeaux', region: 'Frankreich' },
    { name: 'Bratislava', region: 'Slowakei' },
    { name: 'Bremen', region: 'Deutschland' },
    { name: 'Brünn', region: 'Tschechien' },
    { name: 'Brügge', region: 'Belgien' },
    { name: 'Brüssel', region: 'Belgien' },
    { name: 'Budapest', region: 'Ungarn' },
    { name: 'Bukarest', region: 'Rumänien' },
    { name: 'Dresden', region: 'Deutschland' },
    { name: 'Dublin', region: 'Irland' },
    { name: 'Edinburgh', region: 'Vereinigtes Königreich' },
    { name: 'Florenz', region: 'Italien' },
    { name: 'Frankfurt', region: 'Deutschland' },
    { name: 'Genf', region: 'Schweiz' },
    { name: 'Göteborg', region: 'Schweden' },
    { name: 'Graz', region: 'Österreich' },
    { name: 'Hamburg', region: 'Deutschland' },
    { name: 'Helsinki', region: 'Finnland' },
    { name: 'Innsbruck', region: 'Österreich' },
    { name: 'Köln', region: 'Deutschland' },
    { name: 'Kopenhagen', region: 'Dänemark' },
    { name: 'Krakau', region: 'Polen' },
    { name: 'Leipzig', region: 'Deutschland' },
    { name: 'Lissabon', region: 'Portugal' },
    { name: 'Ljubljana', region: 'Slowenien' },
    { name: 'London', region: 'Vereinigtes Königreich' },
    { name: 'Lyon', region: 'Frankreich' },
    { name: 'Madrid', region: 'Spanien' },
    { name: 'Mailand', region: 'Italien' },
    { name: 'Malmö', region: 'Schweden' },
    { name: 'Marseille', region: 'Frankreich' },
    { name: 'München', region: 'Deutschland' },
    { name: 'Neapel', region: 'Italien' },
    { name: 'Nizza', region: 'Frankreich' },
    { name: 'Oslo', region: 'Norwegen' },
    { name: 'Paris', region: 'Frankreich' },
    { name: 'Porto', region: 'Portugal' },
    { name: 'Prag', region: 'Tschechien' },
    { name: 'Reykjavík', region: 'Island' },
    { name: 'Riga', region: 'Lettland' },
    { name: 'Rom', region: 'Italien' },
    { name: 'Rotterdam', region: 'Niederlande' },
    { name: 'Salzburg', region: 'Österreich' },
    { name: 'Sevilla', region: 'Spanien' },
    { name: 'Sofia', region: 'Bulgarien' },
    { name: 'Stockholm', region: 'Schweden' },
    { name: 'Stuttgart', region: 'Deutschland' },
    { name: 'Tallinn', region: 'Estland' },
    { name: 'Thessaloniki', region: 'Griechenland' },
    { name: 'Turin', region: 'Italien' },
    { name: 'Valencia', region: 'Spanien' },
    { name: 'Vilnius', region: 'Litauen' },
    { name: 'Warschau', region: 'Polen' },
    { name: 'Wien', region: 'Österreich' },
    { name: 'Zagreb', region: 'Kroatien' },
    { name: 'Zürich', region: 'Schweiz' },
  ];

  override readonly sizeOptions = [
    { label: 'Klein', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Groß', value: 'large' },
  ];

  override readonly stateCity: City = { name: 'Wien', region: 'Österreich' };

  override readonly chartOptions = [
    { label: 'Balkendiagramm', value: 'bar' },
    { label: 'Liniendiagramm', value: 'line' },
    { label: 'Streudiagramm', value: 'scatter' },
    { label: 'Kreisdiagramm', value: 'pie' },
    { label: 'Heatmap', value: 'heatmap' },
    { label: 'Flächendiagramm', value: 'area' },
  ];

  /** Titles and notes in German; the code of every example stays as in English. */
  override readonly examples: { id: string; title: string; note: string; code: string }[] = [
    {
      id: 'basic',
      title: 'Die Grundform: tippen, dann wählen',
      note: 'Ein Label, ein Vorschlags-Array, eine completeMethod. Nichts schränkt das Model ein — was du tippst, hält das Form-Control.',
      code: `<label for="city">City</label>
<p-autocomplete
  inputId="city"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [placeholder]="t('city.placeholder')"
  [emptyMessage]="t('city.noMatch')"
  [(ngModel)]="city" />

// in the component
readonly cities = signal<City[]>([]);
searchCities(event: AutoCompleteCompleteEvent): void {
  // ALWAYS assign a new array: the overlay opens as a reaction to the change.
  this.cities.set(this.rank(event.query));
}`,
    },
    {
      id: 'dropdown',
      title: 'Der Dropdown-Button und seine zwei Modi',
      note: 'dropdownMode="blank" fragt den leeren String ab, also bedeutet der Button „zeig mir alles“. „current“ fragt das Getippte erneut ab. Blank ist der Hinweis auf die Liste; current ist ein neuer Versuch.',
      code: `<p-autocomplete inputId="city" [dropdown]="true" dropdownMode="blank"
  [dropdownAriaLabel]="t('city.showAll')"
  [suggestions]="cities()" (completeMethod)="searchCities($event)"
  optionLabel="name" [(ngModel)]="city" />`,
    },
    {
      id: 'grouped',
      title: 'Gruppierte Vorschläge',
      note: 'Drei Inputs und ein ARIA-Vorbehalt: Die Bibliothek markiert Gruppen-Header als Optionen. Lies „Entwicklung“, bevor du Gruppen auslieferst.',
      code: `<p-autocomplete inputId="city" [dropdown]="true"
  [group]="true" optionGroupLabel="region" optionGroupChildren="items"
  [suggestions]="cityGroups()" (completeMethod)="searchGrouped($event)"
  optionLabel="name" [(ngModel)]="city" />

searchGrouped(event: AutoCompleteCompleteEvent): void {
  this.cityGroups.set(groupByRegion(this.rank(event.query)));
}`,
    },
    {
      id: 'multiple',
      title: 'Mehrfach: Die Antwort ist eine Menge',
      note: 'Das Model wird ein Array, und die Werte werden als Chips gerendert. Das Entfernen-Icon ist nur für die Maus — Backspace im leeren Textfeld ist der Weg per Tastatur.',
      code: `<label for="cities">Cities to compare</label>
<p-autocomplete
  inputId="cities"
  [multiple]="true"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [placeholder]="t('city.add')"
  [(ngModel)]="selectedCities" />`,
    },
    {
      id: 'tags',
      title: 'Ein Token-Feld: gar keine Vorschläge',
      note: 'Mit [typeahead]="false" wird nichts abgefragt, und der Nutzer erfindet die Werte. Setz addOnBlur, sonst wird Text, der in der Box bleibt, verworfen.',
      code: `<label for="tags">Tags</label>
<p-autocomplete
  inputId="tags"
  [multiple]="true"
  [typeahead]="false"
  [addOnBlur]="true"
  separator=","
  [placeholder]="t('tags.placeholder')"
  [(ngModel)]="tags" />`,
    },
    {
      id: 'force',
      title: 'forceSelection, verantwortungsvoll umgesetzt',
      note: 'Tippen schreibt nicht mehr ins Model, und ein nicht passender Eintrag wird ohne Meldung gelöscht. Erst der Hinweis und das Dropdown machen das akzeptabel.',
      code: `<label for="city">City</label>
<p-autocomplete
  inputId="city"
  [forceSelection]="true"
  [dropdown]="true"
  [dropdownAriaLabel]="t('city.showAll')"
  [suggestions]="cities()"
  (completeMethod)="searchCities($event)"
  optionLabel="name"
  [pt]="{ pcInputText: { root: { 'aria-describedby': 'city-rule' } } }"
  [(ngModel)]="city" />
<small id="city-rule">{{ t('city.rule') }}</small>`,
    },
    {
      id: 'async',
      title: 'Eine entfernte Quelle: Schwellen und veraltete Antworten',
      note: 'minQueryLength und delay halten die Zahl der Anfragen klein; die Prüfung der Antwort verhindert, dass eine langsame Antwort eine neuere überschreibt.',
      code: `<p-autocomplete inputId="city" [minQueryLength]="2" [delay]="400"
  [suggestions]="cities()" (completeMethod)="searchCities($event)"
  optionLabel="name" [(ngModel)]="city" />

private pending = '';
searchCities(event: AutoCompleteCompleteEvent): void {
  this.pending = event.query;
  this.api.cities(event.query).subscribe({
    next: (rows) => {
      if (event.query !== this.pending) return;   // a newer query won
      this.cities.set(rows);                      // new reference: overlay opens
    },
    error: () => this.cities.set([]),             // ALSO assign, or the spinner never stops
  });
}`,
    },
    {
      id: 'template',
      title: 'Eigene Vorschlagszeilen',
      note: 'Zeig, was unterscheidet. #selecteditem gibt es auch, aber es wirkt nur auf Chips — im Einzelmodus kann das Input nur Text halten.',
      code: `<p-autocomplete inputId="city" [dropdown]="true"
  [suggestions]="cities()" (completeMethod)="searchCities($event)"
  optionLabel="name" [(ngModel)]="city">
  <ng-template #item let-city>
    <span class="opt">
      <strong>{{ city.name }}</strong>
      <span class="opt__meta">{{ city.region }}</span>
    </span>
  </ng-template>
</p-autocomplete>`,
    },
    {
      id: 'states',
      title: 'Deaktiviert, ungültig, schreibgeschützt',
      note: 'Ungültig ist eine Rahmenfarbe und sonst nichts, also ist die Meldung daneben nicht optional — und bei einem Token-Feld gibt es keine Rahmenänderung und keinen Weg, die Meldung an das Input zu hängen. Schreibgeschützt sieht genauso aus wie editierbar.',
      code: `<p-autocomplete inputId="city" [disabled]="true" … />

<p-autocomplete inputId="city"
  [invalid]="form.controls.city.invalid && form.controls.city.touched"
  [pt]="{ pcInputText: { root: { 'aria-invalid': 'true', 'aria-describedby': 'city-msg' } } }" … />
<small id="city-msg">{{ t('city.error') }}</small>

<p-autocomplete inputId="city" [readonly]="true" … />`,
    },
  ];
}
