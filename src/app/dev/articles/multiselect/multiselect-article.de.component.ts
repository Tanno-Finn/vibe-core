import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MultiselectArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './multiselect-article.component';

/**
 * German twin of the MultiSelect guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers and code snippets are
 * shared; only the template, the demo option labels and the visible strings in `m`
 * are German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs multiselect`).
 */
@Component({
  selector: 'app-multiselect-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'multiselect'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Control, zwei Anzeigemodi, eine Überlaufregel. Alles hier unten ist live — öffne die Panels auch mit der
          Tastatur: Die Leertaste schaltet um, Umschalt erweitert, Strg oder Cmd + A nimmt alles.
        </p>

        <h3>Anzeige mit Kommas, und wo sie zusammenfällt</h3>
        <p>
          Das Standardfeld listet die Auswahl durch Kommas getrennt auf, bis
          <code>maxSelectedLabels</code> (3) überschritten ist — dann fällt es zu einer Zusammenfassung zusammen. Wähl
          vier Themen, um den Wechsel zu sehen.
        </p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap" id="ms-comma-label">comma (Standard)</span>
            <p-multiselect
              inputId="ms-comma"
              [ariaLabelledBy]="'ms-comma-label'"
              [options]="topicOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Themen wählen"
              appendTo="body"
              [ngModel]="commaPick()"
              (ngModelChange)="commaPick.set($event)"
              name="ms-comma"
            />
            <span class="stage__note">{{ commaPick().length }} ausgewählt</span>
          </div>
          <div class="stage__item">
            <span class="stage__cap" id="ms-chip-label">Chip-Anzeige</span>
            <p-multiselect
              inputId="ms-chip"
              [ariaLabelledBy]="'ms-chip-label'"
              display="chip"
              [options]="topicOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Themen wählen"
              appendTo="body"
              [ngModel]="chipPick()"
              (ngModelChange)="chipPick.set($event)"
              name="ms-chip"
            />
            <span class="stage__note">Chips verschwinden per Klick; die Liste ist der Weg für die Tastatur</span>
          </div>
        </div>
        <p class="src-note">
          Standardwerte, gemessen im ausgelieferten Quelltext: <code>display</code> 'comma'
          (<code>openng-optimus-ui-multiselect.mjs:595</code>), <code>maxSelectedLabels</code> 3 (<code>:977</code>);
          darüber rendert das Feld die Übersetzung <code>selectionMessage</code> mit eingesetzter Anzahl
          (<code>:1269-1276</code>).
        </p>

        <h3>Filter und die Checkbox im Header</h3>
        <p>
          Beide sind ab Werk eingeschaltet: Das Suchfeld filtert beim Tippen, die Checkbox im Header wählt alles aus,
          was der Filter gerade zeigt, oder hebt die Auswahl auf.
        </p>
        <div class="stage">
          <div class="stage__item">
            <span class="stage__cap" id="ms-filter-label">Filter + Alle auswählen (die Standardwerte)</span>
            <p-multiselect
              inputId="ms-filter"
              [ariaLabelledBy]="'ms-filter-label'"
              [options]="countryOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Länder wählen"
              appendTo="body"
              [ngModel]="filterPick()"
              (ngModelChange)="filterPick.set($event)"
              name="ms-filter"
            />
          </div>
        </div>
        <p class="src-note">
          <code>filter</code> und <code>showToggleAll</code> stehen standardmäßig auf true
          (<code>openng-optimus-ui-multiselect.mjs:388,:455</code>); der Filtertext überlebt das Schließen des Panels,
          solange <code>resetFilterOnHide</code> nicht gesetzt ist (<code>:470</code>).
        </p>

        <h3>Der ungültige Zustand, so weit verdrahtet, wie das Control es zulässt</h3>
        <div class="stage">
          <div class="stage__item">
            <span class="stage__cap" id="ms-invalid-label">mindestens ein Thema erforderlich</span>
            <p-multiselect
              inputId="ms-invalid"
              [ariaLabelledBy]="requiredPick().length === 0 ? 'ms-invalid-label ms-invalid-error' : 'ms-invalid-label'"
              [options]="topicOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Mindestens eins wählen"
              appendTo="body"
              [invalid]="requiredPick().length === 0"
              [ngModel]="requiredPick()"
              (ngModelChange)="requiredPick.set($event)"
              name="ms-invalid"
            />
            @if (requiredPick().length === 0) {
              <small class="field-error" id="ms-invalid-error">
                <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
                Wähl mindestens ein Thema.
              </small>
            }
          </div>
        </div>
        <p class="src-note">
          <code>invalid</code> ist von der editierbaren Basis geerbt und bleibt ein manueller Boolean
          (<code>openng-optimus-ui-baseeditableholder.mjs:17</code>). Die Combobox bindet kein
          <code>aria-invalid</code>, und die Komponente hat keinen Input <code>ariaDescribedBy</code>; ihr einziger Weg
          für Attribute ist <code>ptm('hiddenInput')</code> (<code>openng-optimus-ui-multiselect.mjs:1873</code>), und
          das ist kein Schlüssel der typisierten Pass-Through-Optionen. Diese Demo hängt deshalb die id des Fehlers an
          <code>ariaLabelledBy</code> an, solange der Fehler sichtbar ist, sodass die Meldung Teil des Namens ist. Das
          Timing-Gate, das ein echtes Formular darum legt, ist Sache des Guides <strong>Formulare</strong>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Das Model ist ein Array; alles andere folgt aus drei Entscheidungen — wie ein gewählter Wert identifiziert
          wird, wie das Feld zusammenfasst und ob das Panel seine eingebaute Suche braucht.
        </p>

        <h3>Die Optionen verdrahten</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>
        <p>
          Ohne <code>optionValue</code> hält das Model ganze Optionsobjekte, verglichen per Referenz: Ein vorausgewähltes
          Model aus einem zweiten Abruf passt auf nichts, und das Feld bleibt leer. Halte entweder primitive Werte im
          Model (<code>optionValue</code>) oder nenn ein Identitätsfeld (<code>dataKey</code>).
        </p>

        <h3>Die Grenze, gegen ihre vier Nachbarn</h3>
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
                <td>Ein Wert aus der Liste</td>
                <td><code>p-select</code></td>
              </tr>
              <tr>
                <td>Eine Menge aus ~8–60 bekannten Optionen, zusammengefasst in einem Feld</td>
                <td><code>p-multiselect</code></td>
              </tr>
              <tr>
                <td>60+, entfernt geladen oder Freitext-Einträge</td>
                <td><code>p-autocomplete</code> (mit <code>multiple</code> für Mengen)</td>
              </tr>
              <tr>
                <td>Wenige Optionen, die als Felder sichtbar bleiben sollen</td>
                <td>eine Gruppe aus <code>p-checkbox</code></td>
              </tr>
              <tr>
                <td>Die Menge als sichtbare Tokens bearbeitet, ohne Overlay</td>
                <td>die Muster aus <strong>Tags und Chips</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Grenzen zur Einzelwahl und zum entfernten Laden zitieren die eigenen Zeilen „When to use“ der zuständigen
          Guides (<code>select.agent.md</code>, <code>autocomplete.agent.md</code>) — lies sie dort, nicht aus dem
          Gedächtnis.
        </p>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Platzhalter, der die Beschriftung ersetzt</span>
            <div class="dd__stage">
              <p-multiselect
                [options]="topicOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Themen"
                appendTo="body"
                ariaLabel="Schlechtes Beispiel: Platzhalter als Beschriftung"
                [ngModel]="ddBadPick()"
                (ngModelChange)="ddBadPick.set($event)"
                name="ms-dd-bad"
              />
            </div>
            <p class="dd__why">
              Der Name des Felds verschwindet hinter der ersten Auswahl, und das fokussierbare Element ist eine versteckte
              Combobox, die kein <code>label[for]</code> erreicht — es bleibt nichts übrig, das das Control benennt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine Beschriftung, verdrahtet über ariaLabelledBy</span>
            <div class="dd__stage dd__stage--stack">
              <span class="field-label" id="ms-dd-good-label">Themen</span>
              <p-multiselect
                inputId="ms-dd-good"
                [ariaLabelledBy]="'ms-dd-good-label'"
                [options]="topicOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Themen wählen"
                appendTo="body"
                [ngModel]="ddGoodPick()"
                (ngModelChange)="ddGoodPick.set($event)"
                name="ms-dd-good"
              />
            </div>
            <p class="dd__why">
              Die sichtbare Beschriftung übersteht jede Auswahl und wird als Name der Combobox angesagt; der Platzhalter
              zeigt wieder nur ein Beispiel, statt zu benennen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Suchfeld über fünf Optionen</span>
            <div class="dd__stage dd__stage--stack">
              <span class="field-label" id="ms-dd-f-bad-label">Schweregrad</span>
              <p-multiselect
                inputId="ms-dd-f-bad"
                [ariaLabelledBy]="'ms-dd-f-bad-label'"
                [options]="severityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Schweregrade wählen"
                appendTo="body"
                [ngModel]="ddFilterBad()"
                (ngModelChange)="ddFilterBad.set($event)"
                name="ms-dd-f-bad"
              />
            </div>
            <p class="dd__why">
              Der Standardfilter fügt ein Suchfeld, einen Fokus-Stopp und einen Zustand für leere Ergebnisse zu einer
              Liste hinzu, die das Auge schneller überfliegt, als die Hand tippt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Filter unter ~8 Optionen abschalten</span>
            <div class="dd__stage dd__stage--stack">
              <span class="field-label" id="ms-dd-f-good-label">Schweregrad</span>
              <p-multiselect
                inputId="ms-dd-f-good"
                [ariaLabelledBy]="'ms-dd-f-good-label'"
                [options]="severityOptions"
                optionLabel="label"
                optionValue="value"
                [filter]="false"
                placeholder="Schweregrade wählen"
                appendTo="body"
                [ngModel]="ddFilterGood()"
                (ngModelChange)="ddFilterGood.set($event)"
                name="ms-dd-f-good"
              />
            </div>
            <p class="dd__why">
              <code>[filter]="false"</code> — das Panel öffnet direkt auf die Optionen, und der Header behält nur die
              Checkbox zum Auswählen aller.
            </p>
          </div>
        </div>

        <h3>Quellen, kommentiert</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA APG — Listbox pattern</a
            >
            — der Tastaturvertrag für Mehrfachauswahl, den diese Komponente umsetzt: Die Leertaste schaltet um,
            Umschalt erweitert, Strg/Cmd+A wählt alles aus.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-multiselectable" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — aria-multiselectable</a
            >
            — das Attribut, das einem Screenreader-Nutzer sagt, dass die Liste mehr als eine Antwort annimmt, bevor er
            eine Option erreicht.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA APG — Combobox pattern</a
            >
            — die Hälfte mit dem Auslöser: eine zugeklappte Combobox, die ein Listbox-Popup öffnet.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 4.1.2 Name, Role, Value</a
            >
            — warum die sichtbare Beschriftung die versteckte Combobox über
            <code>ariaLabelledBy</code> erreichen muss.
          </li>
          <li>
            <a href="https://primeng.org/multiselect" target="_blank" rel="noopener noreferrer"
              >PrimeNG — MultiSelect</a
            >
            — API-Referenz des Upstreams für die Codebasis, die Optimus forkt; jede Aussage hier ist gegen den
            ausgelieferten Quelltext von Optimus UI 2.0.2 neu geprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Optisch ist das geschlossene Control ein Formularfeld: Jedes Root-Token verweist auf den Block
          <code>form.field.*</code>, also teilt es die Paddings und den Radius je Stil mit den Feldern daneben — und die
          Regeln des Kits für Rand, Icon, ungültigen Zustand, Fokus und dunkle Füllung (unten). Das Panel bringt
          seine eigenen Maße mit — und
          seine eigene Antwort darauf, wie eine ausgewählte Zeile aussieht.
        </p>

        <h3>Maße von Feld und Panel</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wert (aufgelöst)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Root font-size / Paddings</td>
                <td>{{ m.rootFont }} · {{ m.rootPad }} (der formField-Block)</td>
              </tr>
              <tr>
                <td>Root border-radius</td>
                <td>{{ m.rootRadius }}</td>
              </tr>
              <tr>
                <td>Breite des Dropdown-Auslösers</td>
                <td>{{ m.dropdownWidth }}</td>
              </tr>
              <tr>
                <td>Listen-Padding / -Abstand</td>
                <td>{{ m.listPad }} / {{ m.listGap }}</td>
              </tr>
              <tr>
                <td>Options-Padding / -Radius / -Abstand</td>
                <td>{{ m.optionPad }} / {{ m.optionRadius }} / {{ m.optionGap }}</td>
              </tr>
              <tr>
                <td>Padding des Panel-Headers</td>
                <td>{{ m.headerPad }}</td>
              </tr>
              <tr>
                <td>Chip border-radius</td>
                <td>{{ m.chipRadius }}</td>
              </tr>
              <tr>
                <td>Rand im ungültigen Zustand</td>
                <td>{{ m.invalidBorder }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aliasse aus <code>&#64;openng/optimus-ui-themes/dist/aura/multiselect/index.mjs</code>, aufgelöst über die
          semantische Basis desselben Pakets (Aura 2.x — der Themes-Fork von Optimus behält die Werte von 2.x); die
          Radius-Stufen sind je visuellem Stil das <code>presetOverrides.primitive.borderRadius</code> in
          <code>ui-styles.ts</code>.
        </p>

        <h3>Was das Kit umgestaltet und was es lässt</h3>
        <p>
          Die Regeln des Kits für <code>.p-multiselect</code> in <code>styles.scss</code> lenken die eigenen Tokens des
          Elements um und zeichnen den einen Fokus-Ring des Kits; jedes Paar unten ist in
          <code>docs/generated/CONTRAST.MD</code> per Gate geprüft.
        </p>
        <ul>
          <li>
            <strong>Der Fokus ist der Ring des Kits.</strong> Der Fokus-Ring des Roots verweist auf das genullte
            <code>&#123;form.field.focus.ring.*&#125;</code>
            (<code>&#64;openng/optimus-ui-themes/dist/aura/multiselect/index.mjs</code>), also zeichnet die Regel
            <code>.p-multiselect:not(.p-disabled).p-focus</code> des Kits 2px solid <code>--primary-color-fg</code> mit
            2px Abstand, dazu einen Rand in derselben Farbe (<code>!important</code>, beide Modi) &#8212; derselbe Ring
            wie bei Select und den Textfeldern („focus ring“, 3,88:1 und mehr). Im Panel trägt die per Tastatur aktive
            Option (<code>.p-multiselect-option.p-focus</code>) denselben Ring, nach innen gezeichnet, über Auras
            schwacher Fokus-Tönung („option list focus“, 3,48:1 und mehr).
          </li>
          <li>
            <strong>Rand, Chevron und ungültiger Rand sind Kit-Tokens.</strong> Ruhender Rand
            <code>--control-border</code>, 3,25&#8211;5,51:1 gegen Grund, Card und die eigene Füllung des Felds („form
            field edge“, <code>multiselect.border.color</code>); Dropdown-Chevron und Lösch-Icon
            <code>--text-color-secondary</code>, 4,79&#8211;7,78:1 („form field icon“); ungültiger Rand
            <code>--semantic-red-fg</code>, das Rot, das die Textfelder nutzen.
          </li>
          <li>
            <strong>Im Dark Mode übernimmt es die Füllung der Felder.</strong> Wie ein dunkles <code>p-select</code> und
            <code>pInputText</code> füllt ein dunkles Multiselect mit <code>--surface-section</code>, mit
            <code>--text-color</code> und <code>--control-placeholder</code> (<code>.dark-theme .p-multiselect</code>;
            Auras <code>&#123;surface.950&#125;</code> wirkte daneben wie eine schwarze Platte): Wert 9,35:1 und mehr,
            Platzhalter 4,76:1 und mehr („form field text“). Sein Panel-Filter ist ein <code>pInputText</code> und
            übernimmt Rand und Ring im Stil des Textfelds.
          </li>
        </ul>

        <h3>Die hervorgehobene ausgewählte Zeile</h3>
        <p>
          Auras 2.x in Optimus verweist <code>option.selectedBackground</code> und
          <code>option.selectedFocusBackground</code> auf <code>&#123;list.option.selected.background&#125;</code> und
          <code>&#123;list.option.selected.focus.background&#125;</code>, die die semantische Basis zu
          <code>&#123;highlight.background&#125;</code> auflöst — <code>&#123;primary.50&#125;</code> im Light Mode,
          ein <code>color-mix</code> aus <code>&#123;primary.400&#125;</code> im Dark Mode. Die Tönung gilt, solange
          <code>highlightOnSelect</code> true ist, sein Standardwert (<code>openng-optimus-ui-multiselect.mjs:677</code>),
          also trägt eine ausgewählte Option die Tönung <em>und</em> die Checkbox. Auras 3.0 in PrimeNG 22 setzte beide
          Tokens fest auf das Literal
          <code>transparent</code> und ließ die Checkbox als einzigen Träger; diese Annahme übersteht den Wechsel nicht.
          Prüfenswert ist stattdessen der Kontrast der Tönung gegen deine eigene Primärfarben-Skala.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Das geschlossene Feld verhält sich wie jedes Formularfeld: volle Breite in seiner Spalte, die Zusammenfassung
          wird mit Auslassungspunkten gekürzt statt umzubrechen. Das Overlay-Panel behält seine eigene, an den Auslöser
          gebundene Breite und scrollt intern ab
          <code>scrollHeight</code> (Standard 200px) — auf sehr schmalen Bildschirmen brechen Chips im Feld um, das
          dadurch höher wird; nimm die Anzeige mit Kommas, wo vertikaler Platz knapp ist.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Unter der Oberfläche ist das die editierbare Basis plus eine Listbox: Der Formularvertrag ist geerbt, die
          Templates sind Referenznamen, und die Tastenbelegung ist die der APG.
        </p>

        <h3>Der geerbte Formularvertrag</h3>
        <p>
          <code>MultiSelect extends BaseEditableHolder</code>
          (<code>openng-optimus-ui-multiselect.mjs:338</code>): <code>required</code>, <code>invalid</code>,
          <code>disabled</code>, <code>name</code> und der ControlValueAccessor kommen aus der Basis — das Model ist ein
          Array, und <code>invalid</code> bleibt ein manueller Boolean. Das Verdrahtungsmuster samt Timing-Gate ist Sache
          des Guides <strong>Formulare</strong>.
        </p>

        <h3>Referenznamen der Templates</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Referenz</th>
                <th>Rendert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Optionszeile</td>
                <td><code>#item</code></td>
                <td>den Inhalt einer Option</td>
              </tr>
              <tr>
                <td>Feldinhalt</td>
                <td><code>#selecteditems</code></td>
                <td>die Zusammenfassung des geschlossenen Felds</td>
              </tr>
              <tr>
                <td>Gruppen-Header</td>
                <td><code>#group</code></td>
                <td>eine Zeile einer Optionsgruppe</td>
              </tr>
              <tr>
                <td>Panel-Rahmen</td>
                <td><code>#header</code> · <code>#filter</code> · <code>#footer</code></td>
                <td>über / anstelle des Filters / unter der Liste</td>
              </tr>
              <tr>
                <td>Leerzustände</td>
                <td><code>#empty</code> · <code>#emptyfilter</code></td>
                <td>keine Optionen / kein Filtertreffer</td>
              </tr>
              <tr>
                <td>Icons</td>
                <td><code>#dropdownicon</code> · <code>#chipicon</code> · <code>#itemcheckboxicon</code></td>
                <td>Auslöser, Chip entfernen, Options-Checkbox</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Referenznamen der Content-Children aus den Queries der ausgelieferten Komponente
          (<code>openng-optimus-ui-multiselect.mjs:1846</code>). Derselbe Query-Block trägt noch das v21-Prädikat
          <code>PrimeTemplate</code>, also bindet die ältere Form <code>pTemplate="item"</code> in Optimus wieder —
          PrimeNG 22 hatte sie gestrichen. Nimm die Referenznamen; in dieser Form ist das ganze Kit geschrieben.
        </p>

        <h3>Tastenbelegung</h3>
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
                <td>Pfeil nach unten / Pfeil nach oben</td>
                <td>öffnet das Panel, bewegt dann die aktive Option</td>
              </tr>
              <tr>
                <td>Pos1 / Ende · Bild auf / Bild ab</td>
                <td>springt innerhalb der Liste</td>
              </tr>
              <tr>
                <td>Leertaste / Enter</td>
                <td>schaltet die aktive Option um</td>
              </tr>
              <tr>
                <td>Umschalt + Pfeiltasten</td>
                <td>erweitert die Auswahl als Bereich</td>
              </tr>
              <tr>
                <td>Strg/Cmd + A</td>
                <td>wählt jede sichtbare Option aus — wählt aus, schaltet nie um</td>
              </tr>
              <tr>
                <td>druckbare Zeichen</td>
                <td>öffnen und suchen (das Filterfeld nimmt sie auf, wenn es sichtbar ist)</td>
              </tr>
              <tr>
                <td>Esc</td>
                <td>schließt das Panel, Fokus zurück aufs Feld</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Der keydown-Switch im ausgelieferten Quelltext (<code>openng-optimus-ui-multiselect.mjs:1289-1344</code>,
          Strg/Cmd+A bei <code>:1329</code>).
        </p>

        <h3>Checkliste zur Abnahme</h3>
        <ul class="checklist">
          <li>☐ Sichtbare Beschriftung über <code>ariaLabelledBy</code> mit der Combobox verdrahtet.</li>
          <li>
            ☐ <code>optionValue</code> oder <code>dataKey</code> gesetzt, wann immer das Model das Options-Array
            überlebt.
          </li>
          <li>
            ☐ Überlauf-Beschriftung übersetzt — <code>selectedItemsLabel</code> oder eine per Bridge weitergereichte
            <code>selectionMessage</code>.
          </li>
          <li>
            ☐ <code>filter</code> unter ~8 Optionen abgeschaltet; <code>resetFilterOnHide</code> bedacht, wo er
            eingeschaltet bleibt.
          </li>
          <li>☐ <code>appendTo="body"</code> in jedem Container, der abschneidet.</li>
          <li>
            ☐ Ungültiger Zustand über das Timing-Gate des Formulars gebunden, der Fehlertext sichtbar und seine id an
            <code>ariaLabelledBy</code> angehängt.
          </li>
          <li>
            ☐ Tastaturfokus auf dem geschlossenen Feld zeigt den Ring des Kits (<code>.p-multiselect.p-focus</code>) —
            oder deinen eigenen, außerhalb dieses Kits.
          </li>
          <li>
            ☐ Im Accessibility Tree geprüft: Der Name der Combobox ist die Beschriftung, die Liste meldet multiselectable,
            die Optionen melden ihren checked-Zustand.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Drei Texte dieser Komponente kommen aus der eigenen Übersetzungskonfiguration der Bibliothek — und die Bridge
          des Kits reicht die ARIA-Texte schon weiter. Der vierte ist die Falle.
        </p>

        <h3>Wer was übersetzt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Text</th>
                <th>Quelle</th>
                <th>In der Bridge des Kits?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name der Liste</td>
                <td><code>aria.listLabel</code></td>
                <td>ja — unter den weitergereichten Keys</td>
              </tr>
              <tr>
                <td>Name der Header-Checkbox</td>
                <td><code>aria.selectAll</code> / <code>aria.unselectAll</code></td>
                <td>ja — beide weitergereicht</td>
              </tr>
              <tr>
                <td>Überlauf-Zusammenfassung („{{ '{' }}0{{ '}' }} items selected“)</td>
                <td><code>selectionMessage</code> auf oberster Ebene</td>
                <td><strong>nein</strong> — die Bridge reicht nur <code>aria.*</code> weiter</td>
              </tr>
              <tr>
                <td>Platzhalter, Optionsbeschriftungen, Beschriftung, Fehler</td>
                <td>deine Keys über den Übersetzungsservice des Kits</td>
                <td>entfällt</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Quellen der Beschriftungen im ausgelieferten Quelltext
          (<code>openng-optimus-ui-multiselect.mjs:999,:1002,:1269-1276</code>; Standardtext
          <code>openng-optimus-ui-config.mjs:170</code>); die Mechanik der Bridge und ihre Key-Liste sind Sache von
          <strong>I18n &amp; Lokalisierung</strong>.
        </p>
        <p>
          Also: Ein Formular im Kit, das <code>maxSelectedLabels</code> überschreiten kann, zeigt in jeder Sprache eine
          englische Zusammenfassung, bis du <code>[selectedItemsLabel]</code> einen übersetzten Text übergibst (behalte
          den Platzhalter <code>{{ '{' }}0{{ '}' }}</code> — die Anzahl wird darin eingesetzt) oder die Bridge über
          <code>aria.*</code> hinaus erweiterst.
        </p>

        <h3>Wo längerer Text drückt</h3>
        <ul>
          <li>
            <strong>Die Anzeige mit Kommas</strong> kürzt mit Auslassungspunkten — Ausdehnung kostet Sichtbarkeit,
            nicht Layout. Das Panel behält jede vollständige Beschriftung.
          </li>
          <li>
            <strong>Chips</strong> brechen um und lassen das Feld in die Höhe wachsen; lange Optionsbeschriftungen
            machen in Sprachen, die sich ausdehnen, hohe Felder — ein weiterer Grund, warum die Anzeige mit Kommas der
            Standard für dichte Formulare ist.
          </li>
          <li>
            <strong>Der Filter-Platzhalter</strong> (<code>filterPlaceHolder</code>) und der Name des Suchfelds
            (<code>ariaFilterLabel</code>) sind deine Keys, budgetiert wie jede Beschriftung (~1,4×).
          </li>
        </ul>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Ein dunkles
            Multiselect füllt mit <code>--surface-section</code> und mit Text und Platzhalter der Felder, also ist der
            Hinweis „behält Auras Füllung“ weg; die Spannen für Rand und Icon neu zitiert aus „form field edge“ und
            „form field icon“.
          </li>
          <li>
            <strong>v0.4</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Kit zeichnet jetzt
            den Ring um <code>.p-multiselect.p-focus</code> und die aktive Option und lenkt Rand
            (<code>--control-border</code>), Chevron und Lösch-Icon (<code>--text-color-secondary</code>) sowie den
            ungültigen Rand (<code>--semantic-red-fg</code>) um, alles per Gate geprüft; der Abschnitt Design, die Zeile
            zum ungültigen Rand, die Checkliste und das Agenten-Doc sagen das.
          </li>
          <li>
            <strong>v0.3</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft.
            Radien gelten jetzt je Stil; ein neuer Abschnitt Design sagt, was das Kit nicht umgestaltet — kein
            Fokus-Ring erreicht <code>.p-multiselect</code> (nur Tönung des Rands), der Dark Mode behält Auras
            Feldfüllung, und der Standardrand bleibt unter 3:1, wo die geprüften Ränder von Select, Textarea und Input
            bestehen — mit passender Zeile in der Checkliste. <code>highlightOnSelect</code> als Schalter hinter der
            Tönung der ausgewählten Zeile genannt. Das Agenten-Doc faltet die verirrte Geometrie-Notiz in Pitfalls ein
            und bleibt unter dem Größenziel. Das Beispiel zum ungültigen Zustand behauptet kein volles Tripel mehr: Die
            Combobox hat keinen Weg für <code>aria-invalid</code> oder <code>ariaDescribedBy</code>, also kommt die id des
            Fehlers zu <code>ariaLabelledBy</code>.
          </li>
          <li>
            <strong>v0.2</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014). Zwei Aussagen haben sich
            umgekehrt: Die ausgewählte Zeile ist nicht mehr transparent — Auras 2.x verweist
            <code>option.selectedBackground</code> auf <code>&#123;highlight.background&#125;</code> —, und
            <code>overlayVisible</code> hat seinen Output <code>overlayVisibleChange</code> verloren, ist also wieder ein
            Einweg-Input; die v21-Query <code>PrimeTemplate</code> besteht weiter, also bindet <code>pTemplate</code>
            wieder. Alle Zeilenverweise gegen die Optimus-Bundles neu abgeleitet (Inputs sind einfache Properties, keine
            Signals), und die Panel-Maße neu von der Basis von Aura 2.x abgelesen (Dropdown 2.5rem, Options-Padding
            0.5rem 0.75rem, Header-Padding 0.5rem 1rem 0.25rem 1rem).
          </li>
          <li>
            <strong>v0.1</strong> — 24.08.2026 — Erster Guide, gemessen an primeng&#64;22.1.2 und den Token-Dateien von
            Aura 3.0: die Checkbox-Listbox hinter einem Combobox-Auslöser, der Überlauf ab drei Beschriftungen und sein
            unübersetzter Standardtext, der ab Werk eingeschaltete Filter, die transparente ausgewählte Zeile und der
            geerbte Vertrag der editierbaren Basis. Löst die Verweise <code>planned:multiselect</code> aus den Guides
            zu Select und AutoComplete auf.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class MultiselectArticleDeComponent extends MultiselectArticleComponent {
  override readonly topicOptions = [
    { label: 'Neuronale Netze', value: 'nn' },
    { label: 'Prompting', value: 'prompting' },
    { label: 'Embeddings', value: 'embeddings' },
    { label: 'Fine-Tuning', value: 'finetuning' },
    { label: 'Evaluation', value: 'evaluation' },
  ];
  override readonly countryOptions = [
    { label: 'Argentinien', value: 'ar' },
    { label: 'Australien', value: 'au' },
    { label: 'Österreich', value: 'at' },
    { label: 'Belgien', value: 'be' },
    { label: 'Brasilien', value: 'br' },
    { label: 'Kanada', value: 'ca' },
    { label: 'Dänemark', value: 'dk' },
    { label: 'Finnland', value: 'fi' },
    { label: 'Frankreich', value: 'fr' },
    { label: 'Deutschland', value: 'de' },
    { label: 'Japan', value: 'jp' },
    { label: 'Niederlande', value: 'nl' },
    { label: 'Norwegen', value: 'no' },
    { label: 'Portugal', value: 'pt' },
    { label: 'Spanien', value: 'es' },
    { label: 'Schweden', value: 'se' },
  ];
  override readonly severityOptions = [
    { label: 'Info', value: 'info' },
    { label: 'Niedrig', value: 'low' },
    { label: 'Mittel', value: 'medium' },
    { label: 'Hoch', value: 'high' },
    { label: 'Kritisch', value: 'critical' },
  ];

  override readonly m = {
    rootFont: 'kein Basis-Token (sm 0.875rem · lg 1.125rem)',
    rootPad: '0.75rem / 0.5rem',
    rootRadius:
      '{form.field.border.radius} = border.radius.md: 0 Werkbund, 12px Lernwerkstatt, 10px Skizzenbuch, 2px Blaupause',
    dropdownWidth: '2.5rem',
    listPad: '0.25rem 0.25rem',
    listGap: '2px',
    optionPad: '0.5rem 0.75rem',
    optionRadius: 'border.radius.sm (0 / 8px / 6px / 2px je Stil)',
    optionGap: '0.5rem',
    headerPad: '0.5rem 1rem 0.25rem 1rem',
    chipRadius: 'border.radius.sm (0 / 8px / 6px / 2px je Stil)',
    invalidBorder: '--semantic-red-fg (Kit-Token; Aura red.400 / red.300)',
  };
}
