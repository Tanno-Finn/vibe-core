import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToggleSwitchArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './toggleswitch-article.component';

/** German prose for the examples; id and code come from the English base. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  basic: {
    title: 'Der Standard: Label, Switch, sofortige Wirkung',
    note: 'Ein benachbartes Label mit for + inputId. Ein Name, ein Ziel, kein ARIA nötig.',
  },
  described: {
    title: 'Eine Einstellungszeile mit Beschreibung',
    note: 'Das Label benennt, die zweite Zeile erklärt. Halt die Erklärung aus dem Namen heraus.',
  },
  values: {
    title: 'Nicht-boolesches Model: trueValue / falseValue',
    note: 'Das Model hält deine eigenen Werte — und das Label sagt, was AN bedeutet („Neueste zuerst“), nicht, worum es im Feld geht („Sortierung“). Ein Switch hat keinen Platz, um die andere Seite zu benennen.',
  },
  states: {
    title: 'Alle Zustände nebeneinander',
    note: 'Deaktiviert behält hier die volle Opacity (das ausgelieferte Stylesheet setzt für diese Komponente opacity 1); ungültig ist ein 1px-Rahmen und sonst nichts.',
  },
  handle: {
    title: 'Eigenes Handle-Template',
    note: 'Der einzige Content-Slot. Er bekommt einen Kontextwert checked — und das Icon bleibt dekorativ.',
  },
};

/**
 * German twin of the Toggle Switch guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in class
 * fields are German. Keep it in step with the English file: same tabs, same
 * element and binding skeleton (`node scripts/check-guide-translations.mjs toggleswitch`).
 */
@Component({
  selector: 'app-toggleswitch-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'toggleswitch'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jedes Control hier unten ist ein echter <code>p-toggleswitch</code>. Ein Switch ist ein
          <strong>Lichtschalter</strong>: In dem Moment, in dem sich der Griff bewegt, hat sich das, was er steuert,
          schon geändert. Hat dein Screen einen Speichern-Button, auf den der Switch wartet, wolltest du eine Checkbox —
          der Tab „Verwendung“ entscheidet das mit einer Tabelle und vier gerenderten Paaren.
        </p>

        <!-- Mini playground: live-configure a switch and read back the markup. -->
        <section class="pg" aria-label="Toggle-Switch-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Konfigurieren</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Größe (siehe Hinweis)</span>
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
                <label for="pg-disabled">Deaktiviert</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-readonly">Schreibgeschützt</label>
                <p-toggleswitch
                  inputId="pg-readonly"
                  [ngModel]="pgReadonly()"
                  (ngModelChange)="pgReadonly.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-invalid">Ungültig</label>
                <p-toggleswitch inputId="pg-invalid" [ngModel]="pgInvalid()" (ngModelChange)="pgInvalid.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-required">Pflichtfeld</label>
                <p-toggleswitch
                  inputId="pg-required"
                  [ngModel]="pgRequired()"
                  (ngModelChange)="pgRequired.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <div class="switch-row">
                  <label for="pg-preview">Dark mode</label>
                  <p-toggleswitch
                    inputId="pg-preview"
                    [size]="pgSizeInput()"
                    [disabled]="pgDisabled()"
                    [readonly]="pgReadonly()"
                    [invalid]="pgInvalid()"
                    [required]="pgRequired()"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                  />
                </div>
                <p class="pg__readout">
                  Wert des Models: <code>{{ pgValue() }}</code>
                </p>
              </div>
            </div>
          </div>

          <p class="ex__note">
            <strong>Das Größen-Control bewirkt nichts</strong> — und genau darum geht es. Das Aura-Preset dieser
            Komponente definiert keine Small/Large-Tokens, und das ausgelieferte Stylesheet hat keinen Größen-Selektor,
            deshalb rendern <code>size="small"</code> und <code>size="large"</code>
            genau wie der Standard (gemessen; siehe den Tab „Design“).
          </p>

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
                  <div class="switch-row">
                    <label for="ex-basic">Show the circle</label>
                    <p-toggleswitch inputId="ex-basic" [ngModel]="exBasic()" (ngModelChange)="exBasic.set($event)" />
                  </div>
                }
                @case ('described') {
                  <div class="setting-row">
                    <span class="setting-text">
                      <label class="setting-title" for="ex-described">Glossar-Hervorhebung</label>
                      <span class="setting-desc" id="ex-described-desc">
                        Markiert bekannte Begriffe in jedem Artikel und öffnet per Klick eine Definition.
                      </span>
                    </span>
                    <p-toggleswitch
                      inputId="ex-described"
                      [ngModel]="exDescribed()"
                      (ngModelChange)="exDescribed.set($event)"
                    />
                  </div>
                }
                @case ('values') {
                  <div class="switch-row">
                    <label for="ex-values">Neueste zuerst</label>
                    <p-toggleswitch
                      inputId="ex-values"
                      trueValue="desc"
                      falseValue="asc"
                      [ngModel]="exValues()"
                      (ngModelChange)="exValues.set($event)"
                    />
                    <code class="readout">{{ exValues() }}</code>
                  </div>
                }
                @case ('states') {
                  <div class="switch-row">
                    <label for="ex-st-off">Aus</label>
                    <p-toggleswitch inputId="ex-st-off" [ngModel]="false" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-on">An</label>
                    <p-toggleswitch inputId="ex-st-on" [ngModel]="true" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-dis">Deaktiviert, aus</label>
                    <p-toggleswitch inputId="ex-st-dis" [disabled]="true" [ngModel]="false" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-dison">Deaktiviert, an</label>
                    <p-toggleswitch inputId="ex-st-dison" [disabled]="true" [ngModel]="true" />
                  </div>
                  <div class="switch-row">
                    <label for="ex-st-inv">Ungültig</label>
                    <p-toggleswitch inputId="ex-st-inv" [invalid]="true" [ngModel]="false" />
                  </div>
                }
                @case ('handle') {
                  <div class="switch-row">
                    <label for="ex-handle">Ton</label>
                    <p-toggleswitch inputId="ex-handle" [ngModel]="exHandle()" (ngModelChange)="exHandle.set($event)">
                      <ng-template #handle let-checked="checked">
                        <i
                          class="pi"
                          [class.pi-volume-up]="checked"
                          [class.pi-volume-off]="!checked"
                          aria-hidden="true"
                        ></i>
                      </ng-template>
                    </p-toggleswitch>
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
        <h3>Switch oder Checkbox? Eine Frage entscheidet</h3>
        <p>
          <strong>Wirkt die Änderung in dem Moment, in dem sich das Control bewegt?</strong> Wenn ja, ist es ein Switch.
          Muss der Nutzer danach noch etwas drücken — Speichern, Übernehmen, Absenden, Suchen —, ist es eine Checkbox.
          Alles andere (Form, Größe, wie modern es aussieht) ist Dekoration über dieser einen Frage.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>p-toggleswitch</code></th>
                <th><code>p-checkbox</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Denkmodell</td>
                <td>Ein Lichtschalter — der Raum ist schon heller.</td>
                <td>Ein Formularfeld — du füllst eine Antwort aus.</td>
              </tr>
              <tr>
                <td>Wann die Wirkung eintritt</td>
                <td><strong>Sofort</strong>, beim Umschalten.</td>
                <td>Wenn eine spätere Aktion das Formular abschickt.</td>
              </tr>
              <tr>
                <td>Angesagte Rolle</td>
                <td><code>switch</code> — „ein“ / „aus“ (gemessen).</td>
                <td><code>checkbox</code> — „aktiviert“ / „nicht aktiviert“.</td>
              </tr>
              <tr>
                <td>Kardinalität</td>
                <td>Genau ein unabhängiger Boolean.</td>
                <td>Ein Boolean oder ein Eintrag aus einer Menge, von der du mehrere anhaken kannst.</td>
              </tr>
              <tr>
                <td>Gruppen</td>
                <td>Ein Stapel unabhängiger Einstellungen, jede wirkt für sich.</td>
                <td>Eine Liste, in der „Alle auswählen“ und „3 von 7 ausgewählt“ Sinn ergeben.</td>
              </tr>
              <tr>
                <td>Unbestimmt / teilweise</td>
                <td>Unmöglich — ein Switch hat zwei Stellungen.</td>
                <td>Nativ: <code>indeterminate</code>.</td>
              </tr>
              <tr>
                <td>Pflicht, um weiterzukommen</td>
                <td>Falsches Control („AGB akzeptieren“ ist kein Lichtschalter).</td>
                <td>Das richtige — und es validiert.</td>
              </tr>
              <tr>
                <td>Rückgängig machen</td>
                <td>Zurückschalten muss es wirklich rückgängig machen, und zwar billig.</td>
                <td>Abbrechen verwirft das ganze Formular.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> Die Zeile „Angesagte Rolle“ ist im Accessibility Tree
          gemessen. Der Rest ist eine <em>Design-Abwägung</em>, destilliert aus den zwei Primärquellen in der Liste
          unten — der Definition der ARIA-Rolle <code>switch</code> („represents an on/off switch“) und dem
          APG-Switch-Pattern. Kein Hersteller schreibt sie vor; hat dein Produkt eine Konvention, gewinnt diese
          Konvention, aber schreib sie auf. Die Zeile lohnt einen Blick in deinem eigenen Build, denn eine von Hand
          gestylte Checkbox in einer Spalte echter Switches sieht identisch aus und wird anders angesagt.
        </p>

        <h3>Die Grauzone: Einstellungsseiten, die automatisch speichern</h3>
        <p>
          Der ehrliche Grenzfall. Eine Einstellungsseite ohne Speichern-Button ist genau der Ort, an den Switches
          gehören — das Umschalten <em>ist</em> das Speichern. Aber drei Dinge müssen stimmen, und genau die lassen die
          meisten Umsetzungen aus:
        </p>
        <ul>
          <li>
            <strong>Das Schreiben passiert wirklich sofort</strong>, nicht in einer Warteschlange hinter einem Speichern,
            das später auftaucht. Kann eine Leiste „Du hast ungespeicherte Änderungen“ erscheinen, hast du Checkboxen im
            Kostüm eines Switches.
          </li>
          <li>
            <strong>Fehler sind sichtbar.</strong> Ein sofortiges Schreiben kann scheitern (offline, vom Server
            abgelehnt). Dann muss der Switch zurückspringen <em>und</em> sagen, warum — ein Switch, der stumm
            zurückspringt, ist schlimmer als gar kein Feedback.
          </li>
          <li>
            <strong>Das Ergebnis ist wahrnehmbar oder umkehrbar.</strong> „Dark Mode“ zeigt sich selbst. „Meinen Verlauf
            löschen“ tut das nicht und ist destruktiv — das braucht einen Button und eine Bestätigung, keinen Switch.
          </li>
        </ul>
        <p>
          Konvention im Kit: Jeder Einstellungs-Switch schreibt bei <code>(ngModelChange)</code> über einen Service,
          und kein Screen mit Switches trägt zusätzlich einen Speichern-Button — siehe
          <code>user-settings</code> für die Referenzzeile. Die eine Form, die draußen bleibt, ist ein Switch, der
          zwischen zwei <em>benannten</em> Optionen wählt: Das ist eine Auswahl, kein An/Aus-Zustand (siehe das erste
          Paar unten).
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Switch zwischen zwei benannten Optionen</span>
            <div class="dd__stage">
              <div class="two-sided">
                <span [class.two-sided--active]="!ddScope()">Gefiltert (12)</span>
                <p-toggleswitch
                  inputId="dd-scope-bad"
                  ariaLabel="Export-Umfang"
                  [ngModel]="ddScope()"
                  (ngModelChange)="ddScope.set($event)"
                />
                <span [class.two-sided--active]="ddScope()">Alle (238)</span>
              </div>
            </div>
            <p class="dd__why">
              Keine Seite ist „aus“, also hat der Switch keine natürliche Ruhestellung, und ein Screenreader hört
              „Export-Umfang, Switch, ein“ — das Wort „Alle“ kommt im Namen nirgends vor. Verräterisch ist das Markup:
              Eine Beschriftung auf <em>beiden</em> Seiten eines Switches heißt, das Control ist eine Auswahl zwischen
              zwei Optionen im Kostüm eines Switches.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — beide Optionen benennen</span>
            <div class="dd__stage">
              <div class="field">
                <span class="pg__label" id="dd-scope-good-label">Export-Umfang</span>
                <p-selectbutton
                  [ariaLabelledBy]="'dd-scope-good-label'"
                  [options]="scopeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [allowEmpty]="false"
                  [ngModel]="ddScopeValue()"
                  (ngModelChange)="ddScopeValue.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              Zwei sich ausschließende, gleich gewichtete Alternativen sind ein
              <code>p-selectbutton</code>: Beide Labels sind im Ruhezustand lesbar, beide werden angesagt, und die Gruppe
              hat einen zugänglichen Namen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Switch, der auf Speichern wartet</span>
            <div class="dd__stage">
              <div class="mini-form">
                <div class="switch-row">
                  <label for="dd-defer-bad">Schick mir den Newsletter</label>
                  <p-toggleswitch
                    inputId="dd-defer-bad"
                    [ngModel]="ddDeferBad()"
                    (ngModelChange)="ddDeferBad.set($event)"
                  />
                </div>
                <p-button label="Speichern" size="small" severity="secondary" [disabled]="true" />
              </div>
            </div>
            <p class="dd__why">
              Der Griff hat sich bewegt, also glaubt der Nutzer, es sei erledigt — aber bis Speichern ist nichts
              passiert. Jeder Switch in einem Formular mit Absenden-Button ist ein Versprechen, das die Seite bricht.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — aufgeschobener Zustand ist eine Checkbox</span>
            <div class="dd__stage">
              <div class="mini-form">
                <div class="switch-row">
                  <p-checkbox
                    inputId="dd-defer-good"
                    [binary]="true"
                    [ngModel]="ddDeferGood()"
                    (ngModelChange)="ddDeferGood.set($event)"
                  />
                  <label for="dd-defer-good">Schick mir den Newsletter</label>
                </div>
                <p-button label="Speichern" size="small" severity="secondary" [disabled]="true" />
              </div>
            </div>
            <p class="dd__why">
              Eine Checkbox liest sich als „eine Antwort, die ich ausfülle“, und der Speichern-Button ist der Moment, in
              dem sie wahr wird. Dasselbe Model, ein ehrliches Versprechen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Beschriftung, die nur ein &lt;span&gt; ist</span>
            <div class="dd__stage">
              <div class="switch-row">
                <span>Show the circle</span>
                <p-toggleswitch [ngModel]="ddNameBad()" (ngModelChange)="ddNameBad.set($event)" />
              </div>
              <p class="dd__readout">gemessener zugänglicher Name: <code>""</code> — leer</p>
            </div>
            <p class="dd__why">
              Es sieht beschriftet aus und ist es nicht. Ohne <code>inputId</code>, ohne <code>ariaLabel</code> und ohne
              <code>&lt;label&gt;</code> kommt der zugängliche Name <strong>leer</strong> heraus: Ein Screenreader sagt
              „Switch, ein“ an, ohne jede Ahnung, was eingeschaltet ist. Als Klickziel ist die Beschriftung außerdem tot.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — &lt;label for&gt; + inputId</span>
            <div class="dd__stage">
              <div class="switch-row">
                <label for="dd-name-good">Show the circle</label>
                <p-toggleswitch
                  inputId="dd-name-good"
                  [ngModel]="ddNameGood()"
                  (ngModelChange)="ddNameGood.set($event)"
                />
              </div>
              <p class="dd__readout">gemessener zugänglicher Name: <code>"Show the circle"</code></p>
            </div>
            <p class="dd__why">
              Zwei Attribute, drei Gewinne: Der Name stimmt, die Beschriftung wird Teil des Klickziels, und — anders als
              bei <code>p-select</code> — das funktioniert überhaupt, weil das fokussierbare Element hier wirklich ein
              beschriftbares <code>&lt;input&gt;</code> ist.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — [readonly], um einen Switch einzufrieren</span>
            <div class="dd__stage">
              <div class="switch-row">
                <label for="dd-ro-bad">Auto-Sync (schreibgeschützt)</label>
                <p-toggleswitch
                  inputId="dd-ro-bad"
                  [readonly]="true"
                  [ngModel]="ddReadonly()"
                  (ngModelChange)="ddReadonly.set($event)"
                />
              </div>
              <p class="dd__readout">
                Model <code>{{ ddReadonly() }}</code>
              </p>
            </div>
            <p class="dd__why">
              Das Model ist geschützt, aber das Control nimmt weiter den Fokus, schluckt weiter
              <kbd>Space</kbd> und trägt kein <code>aria-readonly</code> — also wird es als völlig bedienbarer Switch
              angesagt, der sich still verweigert. Nichts auf dem Screen sagt, warum.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — [disabled], mit dem Grund daneben</span>
            <div class="dd__stage">
              <div class="switch-row">
                <label for="dd-ro-good">Auto-Sync</label>
                <p-toggleswitch inputId="dd-ro-good" [disabled]="true" [ngModel]="true" />
              </div>
              <p class="dd__readout">Braucht ein Konto — melde dich an, um das zu ändern.</p>
            </div>
            <p class="dd__why">
              <code>[disabled]</code> setzt <code>disabled</code> auf das echte Input, also wird der Zustand angesagt,
              das Control verlässt die Tab-Reihenfolge, und der Satz darunter liefert das fehlende „Warum“. Konvention im
              Kit: Ein deaktivierter Switch bringt den Grund immer als sichtbaren Text mit — siehe
              <code>theme-picker</code> für die Referenzzeile.
            </p>
          </div>
        </div>

        <h3>Schreib das Label als Sache, nicht als Befehl</h3>
        <ul>
          <li>
            <strong>Ein Substantiv oder ein Zustand, nie eine Verbphrase.</strong> „Dark Mode“, „Glossar-Hervorhebung“,
            „Auto-Sync“ — nicht „Dark Mode aktivieren“. Ein Switch trägt das Verb schon in seiner Stellung; ein Label,
            das zusätzlich „aktivieren“ sagt, liest sich wie ein Button und lässt „aus“ mehrdeutig („habe ich das
            Aktivieren deaktiviert?“).
          </li>
          <li>
            <strong>Nie verneinen.</strong> „Seitenleiste ausblenden“ macht aus der Aus-Stellung eine doppelte
            Verneinung. Dreh die Formulierung um, nicht die Bedeutung.
          </li>
          <li>
            <strong>Schreib den Zustand nicht ins Label.</strong> „Dark Mode: an“ kämpft gegen das Control, das schon
            „an“ sagt, und driftet ab, sobald die beiden sich widersprechen.
          </li>
          <li>
            <strong>Erklärungen gehören in eine Beschreibung, nicht in den Namen.</strong> Eine kurze zweite Zeile unter
            dem Label — das Settings-Row-Pattern des Kits — schlägt ein langes Label, das der Switch aus der Zeile
            drängt.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#switch" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, the <code>switch</code> role</a
            >
            — definiert einen Switch als „a type of checkbox that represents on/off values, as opposed to
            checked/unchecked values“ und verlangt <code>aria-checked</code>. Das ist die normative Grundlage für die
            ganze Trennung zwischen Switch und Checkbox oben und dafür, <code>role="switch"</code> im gerenderten DOM zu
            erwarten.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/switch/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Switch pattern</a
            >
            — der Tastatur-Vertrag, gegen den dieser Guide die Komponente prüft: „Space: toggles the switch“, mit
            <kbd>Enter</kbd> nur als optionales Extra. Genau das hat die Messung in „Entwicklung“ gefunden.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — Farbe darf nicht der einzige Träger einer Information sein. Deshalb zählt die Stellung des gleitenden
            Griffs so viel wie die Farbe der Spur, und deshalb darf ein Switch nicht der einzige Ort sein, an dem ein
            Zustand sichtbar ist.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 für die Teile eines Controls, die seinen Zustand vermitteln. Der Maßstab für die gemessenen Kontraste
            von Spur und Griff im Tab „Design“.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — 24 × 24 CSS-Pixel. Der Switch misst 40 × 24, besteht also genau an der Untergrenze — der Grund, warum der
            Tab „Design“ für ein Label als zusätzliches Klickziel argumentiert.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — die Liste der beschriftbaren Elemente (ein <code>&lt;input&gt;</code> gehört dazu) und das
            Aktivierungsverhalten, das einen Klick auf ein Label an sein Control weiterreicht: der Mechanismus hinter
            dem funktionierenden Namen und dem Paar mit umschließendem Label oben.
          </li>
          <li>
            <a href="https://optimus.openng.org/toggleswitch/" target="_blank" rel="noopener noreferrer">
              Optimus UI — ToggleSwitch component</a
            >
            — die API-Oberfläche des Herstellers (Inputs, Output, Handle-Template), die dieser Guide auf das Kit abbildet
            und dann gegen den ausgelieferten Quelltext in <code>node_modules</code> prüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie — drei Elemente, eines davon unsichtbar</h3>
        <ul>
          <li>
            <strong>Root</strong> — der <code>&lt;p-toggleswitch&gt;</code>-Host selbst (<code
              >display: inline-block</code
            >, <code>position: relative</code>), dimensioniert über die Tokens für Breite und Höhe. Er trägt die
            Zustandsklassen (<code>p-toggleswitch-checked</code>, <code>p-disabled</code>, <code>p-invalid</code>) und
            dazu die Attribute <code>data-p-checked</code> / <code>data-p-disabled</code>, gegen die du stylen oder
            testen kannst.
          </li>
          <li>
            <strong>Input</strong> — <code>input.p-toggleswitch-input</code>, <code>type="checkbox"</code> mit
            <code>role="switch"</code>, absolut über die ganze Komponente gelegt, mit <code>opacity: 0</code> und
            <code>z-index: 1</code>. <em>Das</em> ist es, was Fokus, Klicks und die Tastatur tatsächlich treffen — die
            sichtbaren Teile sind Dekoration darunter.
          </li>
          <li>
            <strong>Slider</strong> — <code>div.p-toggleswitch-slider</code>, die Spur: volle Größe, 1px Rahmen, 30px
            Radius, und das Element, das die Fokus-Outline trägt.
          </li>
          <li>
            <strong>Handle</strong> — <code>div.p-toggleswitch-handle</code>, ein Kreis von 1rem, positioniert über
            <code>inset-inline-start</code> (logisch, kippt also unter RTL) und animiert über
            <code>slide.duration</code>. Ein optionales <code>#handle</code>-Template rendert darin, mit einem
            Kontextwert <code>checked</code>.
          </li>
        </ul>
        <p class="src-note">
          Anatomie gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-toggleswitch.mjs</code> (Optimus UI 2.0.2, das
          Template der Komponente bei :219-244) und aus dem ausgelieferten Stylesheet
          <code>&#64;openng/optimus-ui-styles/dist/toggleswitch/index.mjs</code> (2.0.2); Rollen im Accessibility Tree
          bestätigt.
        </p>

        <h3>Geometrie (Aura-2.x-Preset von Optimus, aus den Tokens abgeleitet)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teil</th>
                <th>Token</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Control</td>
                <td><code>--p-toggleswitch-width</code> / <code>-height</code></td>
                <td>
                  2.5rem × 1.5rem = <strong>40 × 24 px</strong> — genau auf der Untergrenze von SC 2.5.8.
                </td>
              </tr>
              <tr>
                <td>Griff</td>
                <td><code>--p-toggleswitch-handle-size</code></td>
                <td>1rem = <strong>16 × 16 px</strong></td>
              </tr>
              <tr>
                <td>Innenabstand</td>
                <td><code>--p-toggleswitch-gap</code></td>
                <td>0.25rem (4px) auf jeder Seite</td>
              </tr>
              <tr>
                <td>Weg des Griffs</td>
                <td>abgeleitet</td>
                <td>
                  <code>width − (handle + 2·gap)</code> = 16px Weg — <code>inset-inline-start</code> 4px → 20px
                </td>
              </tr>
              <tr>
                <td>Radius</td>
                <td><code>--p-toggleswitch-border-radius</code></td>
                <td>30px (bei dieser Höhe vollständig rund); Griff 50%</td>
              </tr>
              <tr>
                <td>Rahmen</td>
                <td><code>--p-toggleswitch-border-width</code></td>
                <td>1px, Farbe <code>transparent</code> in jedem Zustand außer ungültig</td>
              </tr>
              <tr>
                <td>Gleiten</td>
                <td><code>--p-toggleswitch-slide-duration</code></td>
                <td>0.2s auf <code>inset-inline-start</code></td>
              </tr>
              <tr>
                <td>Farbübergang</td>
                <td><code>--p-toggleswitch-transition-duration</code></td>
                <td>0.2s</td>
              </tr>
              <tr>
                <td><code>size="small"</code> / <code>"large"</code></td>
                <td>—</td>
                <td>
                  <strong>Keine Wirkung</strong> — keine <code>sm</code>/<code>lg</code>-Tokens oder -Selektoren im
                  Aura-Preset von Optimus.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Dass die Größe nichts tut, ist ein Fakt aus dem Quelltext, kein Theming-Zufall.</strong>
          <code>&#64;openng/optimus-ui-themes/dist/aura/toggleswitch/index.mjs</code> enthält überhaupt keine
          <code>sm</code>/<code>lg</code>-Keys, und das ausgelieferte Stylesheet baut seine Regeln aus genau fünf
          Klassennamen —
          <code>.p-toggleswitch</code>, <code>-input</code>, <code>-slider</code>, <code>-handle</code>,
          <code>-checked</code> — <strong>ohne einen größenbezogenen Selektor darunter</strong>. Das Input
          <code>size</code> existiert (ein Input-Signal, <code>:134</code>) und wird stillschweigend angenommen — nichts in der Komponente liest es. Brauchst du einen kleineren Switch,
          überschreib die drei Geometrie-Custom-Properties selbst; das Snippet steht unter „Entwicklung“.
        </p>
        <p class="src-note">
          <strong>Zielgröße.</strong> 40 × 24 px erfüllen WCAG 2.2 SC 2.5.8 (24 × 24) in einer Achse genau auf dem
          Minimum und verfehlen das AAA-Maß 44 × 44 von SC 2.5.5 deutlich. Ein <code>&lt;label for&gt;</code> daneben
          kostet nichts und verdreifacht das Klickziel ungefähr — der stärkste praktische Grund, immer eines
          mitzuliefern.
        </p>

        <h3>Zustandsfarben — beide Themes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Teil</th>
                <th>Dunkles Theme</th>
                <th>Helles Theme</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="2">aus</td>
                <td>Spur</td>
                <td colspan="2"><code>--control-border</code> (Kit; Aura: <code>&#123;surface.700&#125;</code> / <code>&#123;surface.300&#125;</code>)</td>
              </tr>
              <tr>
                <td>Griff</td>
                <td colspan="2"><code>--surface-card</code> (Kit; Aura: <code>&#123;surface.400&#125;</code> / <code>&#123;surface.0&#125;</code>)</td>
              </tr>
              <tr>
                <td rowspan="2">an</td>
                <td>Spur</td>
                <td colspan="2"><code>&#123;primary.color&#125;</code></td>
              </tr>
              <tr>
                <td>Griff</td>
                <td><code>&#123;surface.900&#125;</code></td>
                <td><code>&#123;surface.0&#125;</code></td>
              </tr>
              <tr>
                <td>deaktiviert</td>
                <td>Spur / Griff</td>
                <td colspan="2">
                  Eigene Tokens, <strong>Opacity bleibt 1</strong> — das ausgelieferte CSS setzt
                  <code>.p-toggleswitch.p-disabled &#123; opacity: 1 &#125;</code>, also nutzt dieses Control
                  <em>nicht</em> die globale Disabled-Opacity von 0.6 wie die Buttons.
                </td>
              </tr>
              <tr>
                <td>ungültig</td>
                <td>Rahmen der Spur</td>
                <td colspan="2">
                  <code>--p-toggleswitch-invalid-border-color</code> — von der Kit-Regel
                  <code>.p-toggleswitch</code> auf <code>--semantic-red-fg</code> umgebogen (Auras red.400 lag bei
                  2,77:1 auf Weiß), geprüft über die Zeilen <code>inputtext.invalid.border.color</code> („form field
                  edge“, 5,93:1 und mehr auf Grund und Card); der Rahmen ist das <em>einzige</em> Signal für ungültig, und
                  er ist 1px breit auf einem Control mit transparentem Rahmen.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen aus <code>&#64;openng/optimus-ui-themes/dist/aura/toggleswitch/index.mjs</code>. Den
          Aus-Zustand biegt das Kit um (<code>styles.scss</code>, <code>.p-toggleswitch</code>): Der Rahmen des Switches
          ist <code>transparent</code>, also ist die Aus-Spur seine einzige Kante, und Auras Standard-Spur maß
          1,26–1,76:1 auf den Stil-Gründen, ihr weißer heller Griff 1,48:1 auf dieser Spur. Der An-Zustand ist der von
          Aura: der Akzent (<code>primary.color</code>) mit einem Griff in <code>surface.0</code> /
          <code>surface.900</code>.
        </p>

        <h3>Kontrast in den Stilen des Kits (per Gate geprüft)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Dunkel (4 Stile × 10 Akzente)</th>
                <th>Hell (4 Stile × 10 Akzente)</th>
                <th>Braucht</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aus-Spur gegen Seite (Grund, Card)</td>
                <td>{{ contrast.offVsPageDark }}:1</td>
                <td>{{ contrast.offVsPageLight }}:1</td>
                <td>3:1 (SC 1.4.11)</td>
              </tr>
              <tr>
                <td>Griff gegen seine Spur, aus</td>
                <td>{{ contrast.handleOffDark }}:1</td>
                <td>{{ contrast.handleOffLight }}:1</td>
                <td>3:1</td>
              </tr>
              <tr>
                <td>Griff gegen seine Spur, an</td>
                <td>{{ contrast.handleOnDark }}:1</td>
                <td>{{ contrast.handleOnLight }}:1</td>
                <td>3:1</td>
              </tr>
              <tr>
                <td>An-Spur gegen Seite</td>
                <td>{{ contrast.onVsPageDark }}:1</td>
                <td>{{ contrast.onVsPageLight }}:1</td>
                <td>3:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Bereiche zitiert aus den Zeilen „toggleswitch“ von <code>docs/generated/CONTRAST.MD</code> (die An-Spur ist die
          Zeile <code>primary.color</code> des Akzents unter „checkbox &amp; radiobutton“); das Gate rechnet sie bei
          jedem Build neu. Gegen <code>--surface-section</code> ist die Aus-Spur die Zeile „control boundary“ derselben
          Datei. Der Griff bewegt sich trotzdem, also hängt der Zustand nie allein an der Farbe — lass es so.
        </p>
        <h3>Fokus — der Ring des Kits</h3>
        <p>
          Das Aura-Preset richtet den <code>focusRing</code> dieser Komponente auf den <strong>globalen</strong>
          Fokus-Ring — Breite 1px, Stil solid, Farbe <code>&#123;primary.color&#125;</code>, Offset 2px —, nicht auf
          <code>form.field.focusRing</code>, den Aura für das Select auf null setzt. Auras Regel ist
          <code>.p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider</code>;
          die eine Ring-Regel des Kits in <code>styles.scss</code> nennt denselben Slider
          (<code>.p-toggleswitch:has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider</code>) und zeichnet
          <code>2px solid var(--primary-color-fg)</code> bei <code>outline-offset: 2px</code>, <code>!important</code>,
          also:
        </p>
        <ul>
          <li>Die Outline landet auf dem <em>Slider</em>, nicht auf dem unsichtbaren Input.</li>
          <li>
            Sie hängt an <code>:focus-visible</code>, also fokussiert ein Mausklick, ohne einen Ring zu zeichnen —
            korrektes Verhalten und der Grund, warum ein programmatisches <code>.focus()</code> in einem Test womöglich
            keine Outline zeigt.
          </li>
          <li>
            Es ist derselbe 2px-Ring, den jedes Feld und jeder Button im Kit zeigt, in beiden Themes, geprüft als „focus
            ring“ in <code>docs/generated/CONTRAST.MD</code> (3,88:1 und mehr auf den Seitenflächen).
          </li>
        </ul>

        <h3>Layout: Label links, Switch rechts — und nie zentriert</h3>
        <p>
          Beide Kit-Patterns setzen den Switch an das hintere Ende einer Zeile und das Label an das vordere
          (<code>user-settings</code>, <code>theme-picker</code>). Bleib dabei: Eine Spalte von Switches an einer
          gemeinsamen rechten Kante lässt sich als Liste von Zuständen überfliegen, und das Label darf umbrechen, ohne
          das Control zu verschieben. Zwei Regeln folgen aus der Geometrie oben:
        </p>
        <ul>
          <li>
            <strong>Gib der Zeile eine feste Switch-Spalte</strong>, damit die Griffe in einer Linie stehen; ein Switch,
            der mit der Label-Länge wandert, liest sich wie Rauschen.
          </li>
          <li>
            <strong>Mach die Zeile nicht kleiner als das Control.</strong> Mit 24px Höhe erreicht der Switch die
            Untergrenze der Zielgröße gerade so, ohne jeden Puffer; erst vertikales Padding in der Zeile und das
            klickbare Label machen ihn zu einem bequemen Klickziel.
          </li>
        </ul>
        <p>
          <strong>Schmale Screens:</strong> Der Switch hat kein responsives Verhalten — er bleibt bei jedem Viewport
          40 × 24 px und schrumpft nie. Nur das Label fließt um: Gib ihm <code>flex: 1; min-width: 0</code>, damit es
          neben der festen Switch-Spalte in eine zweite Zeile umbricht, statt das Control aus der Zeile zu schieben.
        </p>

        <h3>Status nach WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen ist, wird nicht
          beansprucht. <strong>Erfüllt:</strong> SC 4.1.2 (ein <code>switch</code>-Knoten im Accessibility Tree, benannt
          über sein Label oder über <code>ariaLabel</code>, mit <code>aria-checked</code>, das beim Umschalten kippt),
          SC 2.1.1 mit dem nativen Checkbox-Modell — Space schaltet um, Enter tut nichts, was APG erlaubt —, SC 2.4.7
          mit dem Ring des Kits in beiden Themes (per Gate geprüft, „focus ring“) und SC 1.4.11 für die Aus-Spur, beide
          Griffe und die An-Spur in jedem Stil und Akzent (per Gate geprüft; am niedrigsten {{ contrast.lowest }}:1,
          siehe die Kontrasttabelle). SC 2.5.8 ist <strong>erfüllt</strong> — das Control misst 40 × 24 px (aus den
          Tokens abgeleitet), genau auf der Untergrenze, und die beschriftete Zeile bleibt das vernünftige Klickziel.
          <strong>Bedingt:</strong> SC 1.4.1 — der Wechsel zwischen an und aus wird vom wandernden Griff ebenso
          getragen wie von der Farbe, aber der ungültige Zustand ist eine 1px-Rahmenfarbe und sonst nichts; und SC
          2.5.3, das nur gilt, solange eine sichtbare Beschriftung und ein <code>ariaLabel</code> am selben Switch
          dasselbe sagen. <strong>AAA</strong> wird nur bewertet, wo dieser Guide es misst: SC 2.5.5 (44 × 44) wird mit
          40 × 24 px verfehlt; kein anderes AAA-Kriterium ist bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>ToggleSwitchModule</code> exportiert die Komponente. Der Selektor akzeptiert drei Schreibweisen —
          <code>p-toggleswitch</code>, <code>p-toggleSwitch</code> und <code>p-toggle-switch</code> (<code>:250</code>);
          PrimeNG 22 hatte den camelCase-Alias gestrichen, Optimus behält den Satz aus v21. Dieses Kit nutzt überall die
          kleingeschriebene, damit eine einzige Schreibweise weiterhin jede Aufrufstelle findet. Der Name aus PrimeNG 20,
          <code>p-inputSwitch</code>, ist <strong>weg</strong>: Es gibt keinen Entry Point <code>inputswitch</code> in
          Optimus, und das Kit enthält ihn kein einziges Mal.
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
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  Setzt die <code>id</code> des echten <code>&lt;input&gt;</code>. <strong>Nutz es</strong> — genau das
                  bringt <code>&lt;label for&gt;</code> zum Funktionieren.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  Als <code>aria-label</code> / <code>aria-labelledby</code> an das Input gebunden. Jedes der beiden
                  <em>überschreibt</em> ein <code>&lt;label for&gt;</code>.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  Aus <code>BaseEditableHolder</code>. Setzt ein echtes <code>disabled</code>-Attribut auf das Input:
                  nicht fokussierbar, angesagt, blockiert.
                </td>
              </tr>
              <tr>
                <td><code>readonly</code></td>
                <td>boolean</td>
                <td>
                  Blockiert nur den Klick-Handler — kein Attribut, kein <code>aria-readonly</code>, weiter fokussierbar.
                  Siehe die Warnung unten.
                </td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>Fügt <code>p-invalid</code> hinzu; rendert als 1px-Rahmenfarbe und sonst nichts.</td>
              </tr>
              <tr>
                <td><code>required</code></td>
                <td>boolean</td>
                <td>
                  Setzt das Attribut <code>required</code> auf das Input. Bei einem Switch ist das meist ein Warnsignal
                  — siehe „Verwendung“.
                </td>
              </tr>
              <tr>
                <td><code>trueValue</code> / <code>falseValue</code></td>
                <td>any</td>
                <td>
                  Was das Model in jeder Stellung hält (Standard <code>true</code>/<code>false</code>).
                  <code>checked()</code> ist <code>modelValue() === trueValue</code> — strikte Gleichheit, Objekte
                  passen also nicht.
                </td>
              </tr>
              <tr>
                <td><code>name</code></td>
                <td>string</td>
                <td>Wird direkt in das Attribut <code>name</code> des Inputs geschrieben.</td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>Wird an das Input weitergereicht. Lass es in Ruhe, wenn du keinen echten Grund hast.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>Über <code>pAutoFocus</code> auf dem Input.</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>
                  <strong>Angenommen und ignoriert</strong> — für diese Komponente gibt es keine Größen-Tokens oder
                  -Selektoren (Tab „Design“).
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Zurück aus v21:</strong> <code>styleClass</code> — PrimeNG 22 hat es entfernt, Optimus liefert
                  es wieder als <code>&#64;deprecated</code>-Input, das weiterhin auf dem Host landet
                  (<code>cn(cx('root'), styleClass)</code>, <code>:285</code>). Nimm lieber schlichtes
                  <code>class</code>. Nur <code>size</code> ist ein Signal-Input; die übrigen sind schlichte
                  <code>&#64;Input()</code>-Properties, wobei <code>disabled</code>/<code>invalid</code>/<code>required</code>/<code>name</code>
                  als Signals aus <code>BaseEditableHolder</code> kommen.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus der Klasse <code>ToggleSwitch</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-toggleswitch.mjs:86-216</code> und
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-toggleswitch.d.ts</code> (Optimus UI 2.0.2,
          <code>node_modules/&#64;openng/optimus-ui/package.json</code>); <code>disabled</code>, <code>invalid</code>,
          <code>required</code> und <code>name</code> kommen aus <code>BaseEditableHolder</code>.
        </p>

        <h3>Output — einer, und er feuert nach dem Model</h3>
        <pre class="code-block"><code>{{ outputSnippet }}</code></pre>
        <p>
          <code>onChange</code> sendet <code>&#123; originalEvent, checked &#125;</code>, wobei <code>checked</code> der
          <em>neue</em> Wert des Models ist (<code>trueValue</code>/<code>falseValue</code>, nicht unbedingt ein
          Boolean). Er feuert <em>nach</em> <code>ngModelChange</code>, also wähl eines von beiden — beide zu nutzen
          heißt, denselben Zustand zweimal zu schreiben. Die eine legitime Kombination ist gewollt:
          <code>[(ngModel)]</code> hält den Wert, und <code>(onChange)</code> löst den Seiteneffekt aus — die Form, die
          <code>language-picker</code> für seinen Schalter für Leichte Sprache nutzt.
        </p>

        <h3>Eigener Griff</h3>
        <p>
          Ein <code>#handle</code>-Template rendert im wandernden Kreis und bekommt einen Kontextwert
          <code>checked</code> — der einzige Content-Slot, den diese Komponente hat. Beschränk es auf ein Icon: Der Griff
          misst 16 × 16 px und wächst nicht.
        </p>
        <pre class="code-block"><code>{{ handleSnippet }}</code></pre>
        <p class="src-note">
          Content-Query bei <code>openng-optimus-ui-toggleswitch.mjs:319-321</code>
          (<code>&#64;ContentChild('handle', &#123; descendants: false &#125;)</code>), gerendert bei :240-242 mit
          <code>context: &#123; checked: checked() &#125;</code>. Jedes Icon darin ist dekorativ — der Zustand steht
          schon in <code>aria-checked</code>, also markier es mit <code>aria-hidden="true"</code> und lass das Icon nie
          den einzigen Hinweis sein.
        </p>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>
          <code>styles.scss</code> berührt diese Komponente an drei Stellen: Ein <code>.p-toggleswitch</code>-Block
          biegt die Farben der Aus-Spur und des Griffs am Element um (ein Vorfahre kann die nicht überschreiben; nenn
          das Element), ein zweiter den Rahmen für ungültig auf <code>--semantic-red-fg</code>, und die eine Ring-Regel
          des Kits zeichnet den Fokus-Ring mit <code>!important</code>, sodass die <code>-focus-ring-*</code>-Tokens
          nicht ankommen. Jedes Größen-Token gewinnt weiterhin von einem Vorfahren aus:
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> und <code>darkModeSelector: '.dark-theme'</code> stammen aus den Theme-Optionen von
          <code>provideOptimus</code> in <code>app.config.ts</code> des Kits. Begrenz Overrides auf eine Klasse — ein
          globaler Override auf <code>:root</code> ändert jeden Switch der App auf einmal.
        </p>

        <h3>Formulare — dieser hier ist wirklich ein Form-Control</h3>
        <p>
          Anders als <code>p-select</code> rendert ein Toggle Switch ein echtes <code>&lt;input type="checkbox"&gt;</code>
          und schreibt <code>[attr.name]</code> darauf, also sieht ein natives Absenden des Formulars ihn auch. Zwei
          Einschränkungen, bevor du dich darauf verlässt:
        </p>
        <ul>
          <li>
            Die Komponente setzt nie ein Attribut <code>value</code>, also sendet ein eingeschalteter Switch den
            HTML-Standard <code>on</code> — <em>nicht</em> deinen <code>trueValue</code>. Ein ausgeschalteter sendet gar
            nichts, was normales Checkbox-Verhalten ist und eine klassische Quelle für Bugs der Sorte „das Flag geht nie
            aus“.
          </li>
          <li>
            <code>trueValue</code>/<code>falseValue</code> leben rein im Angular-Model. Für ein natives Absenden sind sie
            unsichtbar.
          </li>
        </ul>
        <p>
          Für alles in Angular ist er ein schlichter <code>ControlValueAccessor</code>: <code>[(ngModel)]</code>,
          <code>formControlName</code> und Validatoren funktionieren alle, und <code>ng-invalid.ng-dirty</code> bekommt
          eine eigene Rahmenregel, die die Komponente selbst mitliefert (<code>openng-optimus-ui-toggleswitch.mjs:19-21</code>).
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Benennung: drei Patterns, und welches gewinnt</h4>
        <p>Die Spalte „Name“ ist das, was der Accessibility Tree meldet, also das, was ein Screenreader ansagt:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pattern</th>
                <th>Zugänglicher Name</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>Der Text des Labels — Rolle <code>switch</code></td>
                <td>
                  <strong>Funktioniert</strong> und liefert auch ein Klickziel. Das fokussierbare Element ist ein echtes
                  <code>&lt;input&gt;</code>, und das ist beschriftbar.
                </td>
              </tr>
              <tr>
                <td><code>[ariaLabel]</code> + <code>inputId</code>, Beschriftung in einem <code>&lt;span&gt;</code></td>
                <td>Der String aus <code>ariaLabel</code> — Rolle <code>switch</code></td>
                <td>
                  <strong>Funktioniert</strong> für den Namen, aber die sichtbare Beschriftung ist nicht klickbar: Das
                  Klickziel bleibt 36 × 22.
                </td>
              </tr>
              <tr>
                <td>Beides zugleich</td>
                <td>Der String aus <code>ariaLabel</code></td>
                <td>
                  <strong>Funktioniert und versteckt eine Falle.</strong> <code>aria-label</code> schlägt das
                  Label-Element; driften die beiden Texte also je auseinander, ist der sichtbare Text nicht der
                  gesprochene — ein Verstoß gegen WCAG 2.5.3 (Label in Name), der nur darauf wartet, zu passieren.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Der Mechanismus steht im Quelltext: <code>ariaLabel</code> und <code>ariaLabelledBy</code> werden als Attribute
          an das Input gebunden (<code>openng-optimus-ui-toggleswitch.mjs:229-230</code>), und <code>inputId</code> wird
          zu seiner <code>id</code> (:221) — alle drei sind in Optimus schlichte Properties, keine Signals.
          <strong>Wähl eines</strong>: ein benachbartes <code>&lt;label for&gt;</code>, wenn die Beschriftung sichtbar
          ist (bevorzugt — größeres Klickziel), oder <code>ariaLabel</code>, wenn sie es wirklich nicht ist. Um einen
          Screen voller Switches in deinem eigenen Build zu prüfen, lies den Accessibility Tree und bestätige, dass jeder
          Knoten mit der Rolle <em>switch</em> die Beschriftung trägt, die du daneben siehst.
        </p>

        <h4>Tastatur — nur Space</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Verhalten</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>Fokus hinein / hinaus. Das Input ist ein normaler Tab-Stopp, außer bei <code>[disabled]</code>.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>
                  <strong>Schaltet um</strong> (gemessen): <code>aria-checked</code> kippt, der Host bekommt
                  <code>p-toggleswitch-checked</code> und <code>data-p-checked="true"</code>.
                </td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>
                  <strong>Nichts</strong> (gemessen). Natives Checkbox-Verhalten — und APG führt Enter als optional, das
                  ist also konform, nicht kaputt.
                </td>
              </tr>
              <tr>
                <td>Pfeiltasten</td>
                <td>Nichts.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Komponente hat <strong>überhaupt keinen Tastatur-Handler</strong> — der einzige Listener ist der
          <code>click</code>-Handler <code>onHostClick</code> am Host (<code>openng-optimus-ui-toggleswitch.mjs:164</code>); alles
          zur Tastatur kommt von der nativen Checkbox, deren Aktivierungsverhalten einen <code>click</code> auslöst, der
          zum Host hochblubbert. Zwei Folgen, die du kennen solltest: Der Switch ist gratis per Tastatur bedienbar, und
          innerhalb eines <code>&lt;form&gt;</code> schickt <kbd>Enter</kbd> das Formular ab, statt umzuschalten.
        </p>

        <h4>[readonly] tut nicht, was es verspricht</h4>
        <p>
          <code>readonly</code> wird nur im Guard des Umschaltens geprüft (<code>openng-optimus-ui-toggleswitch.mjs:180</code>). Das
          gerenderte Input bekommt kein Attribut <code>readonly</code> — das auf einer Checkbox ohnehin wirkungslos wäre
          —, kein <code>disabled</code> und kein <code>aria-readonly</code>. Ein schreibgeschützter Switch wird also als
          gewöhnlicher bedienbarer Switch angesagt, nimmt den Fokus, akzeptiert <kbd>Space</kbd> und verweigert still.
          Schlimmer noch: Der Browser kippt bei diesem Klick die Property <code>checked</code> des nativen Inputs,
          während das Angular-Binding keine Änderung sieht und sie deshalb nie zurückschreibt. <strong>Nimm
          <code>[disabled]</code></strong
          >, und schreib den Grund als sichtbaren Text daneben.
        </p>
        <p class="src-note">
          Gemessen: Ein einzelner Klick auf einen schreibgeschützten Switch lässt die native Property
          <code>checked</code> bei <code>false</code>, während <code>aria-checked</code> weiter <code>"true"</code>
          liest und der Host weiter <code>p-toggleswitch-checked</code> trägt. Der sichtbare Switch lügt nie; das DOM
          darunter schon. Erbst du einen Switch mit <code>[readonly]</code>, klick ihn einmal und vergleich die Property
          <code>checked</code> des Inputs mit seinem Attribut <code>aria-checked</code>.
        </p>

        <h4>Zwei Dinge, die man erwartet und die hier nicht stimmen</h4>
        <ul>
          <li>
            <strong>Den Switch in sein eigenes <code>&lt;label&gt;</code> zu packen, schaltet <em>nicht</em> doppelt
            um.</strong>
            Die Sorge ist berechtigt — der Host hat einen Klick-Listener, und ein Label reicht Klicks an sein Control
            weiter —, aber gemessen erzeugt eine Geste genau eine Änderung am Model, egal ob der Klick auf dem Switch
            oder auf dem Label-Text landet. Der Grund steckt in der Anatomie: Das unsichtbare Input bedeckt das ganze
            Control mit <code>z-index: 1</code>, also trifft ein „Klick auf den Slider“ schon das Input, und das
            Aktivierungsverhalten des Labels wird für sein eigenes Control übersprungen. Ein benachbartes
            <code>&lt;label for&gt;</code> bleibt die bessere Form (es übersteht Umbauten und liest sich klarer), aber
            das ist eine Vorliebe, kein Bug.
          </li>
          <li>
            <strong
              >Jeder gerenderte Switch trägt <code>autofocus="true"</code> im DOM — und keiner davon fokussiert sich
              selbst.</strong
            >
            Das Attribut steht bedingungslos da; der Fokus bleibt, wo die Seite ihn hingesetzt hat. Ursache ist ein
            strikter Vergleich in der Direktive <code>pAutoFocus</code>, die die Komponente bedingungslos bindet: Sie
            entfernt das Attribut nur <code>if (this.autofocus === false)</code> und <em>setzt</em> es sonst
            (<code>openng-optimus-ui-autofocus.mjs:25-29</code>) — und ein nicht gesetztes Input ist
            <code>undefined</code>, nicht <code>false</code>. Das eigentliche Fokussieren ist getrennt durch eine
            Truthiness-Prüfung abgesichert (:39), deshalb bewegt sich nichts. Heute harmlos, aber nutz
            <code>[autofocus]</code> an einem Switch nicht als Test-Hook: Das Attribut ist so oder so da.
          </li>
        </ul>

        <h4>Alles andere muss das Kit selbst liefern</h4>
        <ul>
          <li>
            <strong>In dieser Komponente gibt es keine Hersteller-Strings.</strong> Kein einziges Label, kein Title,
            kein Fallback — das DOM, das sie rendert, ist ein Input und zwei Divs. Jedes Wort, das ein Nutzer hört,
            kommt von dir, und das ist selten und gut (vergleich den fest verdrahteten „dropdown trigger“ des Selects).
          </li>
          <li>
            <strong>Eine Beschreibung muss von Hand verdrahtet werden.</strong> Es gibt kein Input
            <code>ariaDescribedBy</code>. Hat die Zeile eine zweite erklärende Zeile, gib ihr eine <code>id</code> und
            erreiche das Input von außen, oder akzeptier, dass die Beschreibung nur visuell ist.
          </li>
          <li>
            <strong>Zustandsänderungen sind stumm.</strong> <code>aria-checked</code> kippt, was die meisten
            Screenreader an einem fokussierten Control ansagen — aber wenn das Umschalten woanders auf der Seite etwas
            ändert, braucht diese Änderung ihre eigene Live-Region.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Die Änderung wirkt sofort — sonst ist das eine Checkbox.</li>
          <li>
            ☐ Genau einmal benannt: ein benachbartes <code>&lt;label for&gt;</code> + <code>inputId</code>,
            <em>oder</em> <code>ariaLabel</code> — nicht beides mit unterschiedlichem Text.
          </li>
          <li>☐ Das Label ist ein Substantiv oder ein Zustand, kein Befehl, und nicht verneint.</li>
          <li>
            ☐ Erreichbar mit <kbd>Tab</kbd>, schaltet mit <kbd>Space</kbd> um; der Fokus-Ring ist in
            <strong>beiden</strong> Themes sichtbar.
          </li>
          <li>☐ Ein <em>ausgeschalteter</em> Switch ist auf der Fläche, auf die du ihn setzt, noch sichtbar — er hat keinen eigenen Rahmen.</li>
          <li>
            ☐ Ein eingefrorener Zustand nutzt <code>[disabled]</code>, nie <code>[readonly]</code>, und der Grund steht
            daneben.
          </li>
          <li>
            ☐ Die Zeile gibt dem Label genug Padding, um ein Klickziel zu sein — der Switch allein ist 22px hoch, unter
            der Untergrenze von 24px.
          </li>
          <li>☐ Kann das Schreiben scheitern, schiebt der Fehler den Switch zurück <em>und</em> sagt es.</li>
          <li>☐ Nicht genutzt, um zwischen zwei benannten Optionen zu wählen — das ist ein <code>p-selectbutton</code>.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die zwei Regeln festnagelt, für deren Schutz es diesen Guide
          gibt — das Control ist ein <code>switch</code>, und das Label benennt es wirklich:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Jeder String gehört dir</h3>
        <p>
          Das ist der ungewöhnliche Fall: <code>p-toggleswitch</code> liefert <strong>überhaupt keinen Text</strong>
          mit. Kein Placeholder, kein Fallback-Name, kein fest verdrahtetes englisches aria-label — das gerenderte DOM ist
          ein Input und zwei leere Divs. Es gibt also nichts in <code>provideOptimus(&#123; translation: … &#125;)</code>
          zu reparieren, und ebenso nichts, hinter dem man sich verstecken könnte: Ist ein Switch unbenannt, liegt das
          ganz an deiner Aufrufstelle.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Gelesen aus dem Template der Komponente (<code>openng-optimus-ui-toggleswitch.mjs:220-244</code>): Die einzigen Attribute mit
          Text sind die, die du bindest, also ist das <code>aria-label</code> des gerenderten Inputs genau der String, den
          du übergeben hast.
        </p>

        <h3>Label-Länge ist ein Layout-Problem, kein Abschneide-Problem</h3>
        <p>
          Der Switch ist eine feste Box von 40px, die nie schrumpft, also schiebt ein längeres übersetztes Label die
          Zeile, statt das Control abzuschneiden. Deutsche Einstellungs-Labels sind 20–40 % länger als englische
          („Glossary highlighting“ → „Glossar-Hervorhebungen“), und die Beschreibungszeile darunter wächst noch mehr. Gib
          der Label-Spalte <code>min-width: 0</code> und lass sie umbrechen; halt den Switch in einer festen hinteren
          Spalte. Teste die längste Sprache, die du auslieferst, bei 360px Breite — dort kollidiert ein zweizeiliges
          Label zuerst mit dem Control.
        </p>

        <h3>Übersetz nicht an/aus — das Control sagt es schon</h3>
        <ul>
          <li>
            Der Zustand steckt in <code>aria-checked</code>, das der Screenreader in der eigenen Sprache des Nutzers
            wiedergibt. Ein sichtbarer Text „An“/„Aus“ dazu heißt, ein Wort zu übersetzen, das die Plattform schon
            spricht, und er driftet ab, sobald die beiden sich widersprechen.
          </li>
          <li>
            Zeigst du <em>doch</em> auf jeder Seite ein Label, hast du eine Auswahl zwischen zwei Optionen gebaut und zwei
            Labels übersetzt, die der zugängliche Name nicht enthält. Nimm ein <code>p-selectbutton</code> — ein Name,
            beide Optionen einmal übersetzt.
          </li>
          <li>
            Bau das Label nie durch Zusammenkleben von Fragmenten (<code>t('enable') + ' ' + t('darkMode')</code>). Die
            Wortstellung unterscheidet sich je Sprache; liefere einen Key pro Label.
          </li>
        </ul>

        <h3>RTL: nichts zu tun</h3>
        <p>
          Der Griff ist über <code>inset-inline-start</code> positioniert, und die Spur nutzt einen symmetrischen
          Radius, also gleitet der Switch unter <code>direction: rtl</code> von selbst in die andere Richtung — die
          An-Stellung landet links, und das ist die richtige Konvention für RTL-Schriften. Nichts hier braucht Arbeit an
          einzelnen Aufrufstellen.
        </p>
        <p class="src-note">
          Gelesen aus dem ausgelieferten Stylesheet (<code>&#64;openng/optimus-ui-styles/dist/toggleswitch/index.mjs</code>: das
          <code>inset-inline-start: dt('toggleswitch.gap')</code> des Griffs und die Checked-Regel, die
          <code>width − (handle.size + gap)</code> berechnet). <strong>Nicht durch Rendern einer RTL-Locale
          geprüft</strong> — dieses Kit liefert nur LTR-Sprachen aus.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Der Rahmen für ungültig
            ist das <code>--semantic-red-fg</code> des Kits, geprüft über die Zeilen
            <code>inputtext.invalid.border.color</code>, nicht mehr das ungeprüfte Rot von Aura.
          </li>
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Der Fokus-Ring ist der
            2px-Ring <code>--primary-color-fg</code> des Kits auf dem Slider (vorher Auras 1px), zitiert aus „focus
            ring“; der Rat „das Ring-Token anheben“ samt Snippet ist weg, der Theming-Hinweis nennt die zwei Regeln des
            Kits, und der Rahmen für ungültig ist als ungeprüftes Rot von Aura benannt.
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Das Kit biegt jetzt den Aus-Zustand um (Spur
            <code>--control-border</code>, Griff <code>--surface-card</code>); die Kontrasttabelle zitiert die geprüften
            Zeilen aus CONTRAST.MD (am niedrigsten 3,85:1) statt der zwei Verstöße der Standardpalette.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Zustandsfarben als Aura-Tokens für die visuellen Stile neu formuliert (ADR-0016); die Kontrasttabelle
            ist als Standardpalette von Aura gekennzeichnet (die Stile des Kits sind nicht im Kontrast-Gate); die
            Truthiness-Prüfung von autofocus bei :39 zitiert; Aussage zu schmalen Screens in „Design“ ergänzt;
            Versionsvergleiche am Rand und Verweise auf das Test-Rig gekürzt.
          </li>
          <li>
            <strong>v0.5</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014). Drei Aussagen aus v0.4
            zurückgedreht: Die Geometrie steht wieder auf den Werten von Aura 2.x (2.5 × 1.5rem = <strong>40 × 24 px</strong>,
            Griff 1rem, 16px Weg), SC 2.5.8 ist also auf dem Minimum erfüllt, statt zu scheitern; der camelCase-Alias
            <code>p-toggleSwitch</code> für den Selektor und <code>styleClass</code> existieren beide wieder (Letzteres als
            <code>&#64;deprecated</code>, aber funktionierendes Input). Nur <code>size</code> ist ein Signal-Input — es
            bleibt wirkungslos —, während <code>inputId</code>/<code>ariaLabel</code>/<code>ariaLabelledBy</code> schlichte
            Properties sind; alle Zeilenverweise gegen das Optimus-Bundle neu abgeleitet. Die Farb-Tokens halten dieselben
            Werte, also gelten die Kontrastzahlen aus 21 weiter.
          </li>
          <li>
            <strong>v0.4</strong> — 24.08.2026 — Neu geprüft gegen PrimeNG 22.1.2 / Aura 3.0: Das Control schrumpfte auf
            36 × 22 px mit einem 14px-Griff — <strong>jetzt unter der Untergrenze von 24px aus SC 2.5.8</strong>, die
            2.x genau traf; <code>styleClass</code> und der camelCase-Alias <code>p-toggleSwitch</code> für den Selektor
            entfernt; <code>size</code> als weiterhin wirkungslos bestätigt; alle Zeilenverweise neu abgeleitet.
            Farbmessungen aus 21 gelten weiter — die Farb-Tokens von toggleswitch sind unverändert.
          </li>
          <li>
            <strong>v0.3</strong> — 20.08.2026 — Zusammenfassung zum Status nach WCAG 2.2 im Tab „Design“ ergänzt:
            gemessene Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich
            nicht beansprucht.
          </li>
          <li>
            <strong>v0.2</strong> — 30.07.2026 — Neu geschrieben, um Befunde zu nennen statt des Wegs dorthin; Verweise
            auf Aufrufstellen durch Konventionen des Kits ersetzt.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erster Guide: Switch gegen Checkbox, ein Live-Playground, vier
            Do/Don’t-Paare, Geometrie, Farben, Kontrast und Fokus in beiden Themes.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ToggleSwitchArticleDeComponent extends ToggleSwitchArticleComponent {
  override readonly contrast = {
    offVsPageDark: '3,97–5,51',
    offVsPageLight: '3,85–5,23',
    handleOffDark: '3,97–4,91',
    handleOffLight: '4,09–5,23',
    handleOnDark: '6,40–16,93',
    handleOnLight: '5,18–17,85',
    onVsPageDark: '4,75–17,58',
    onVsPageLight: '4,75–17,85',
    lowest: '3,85',
  };

  override readonly sizeOptions = [
    { label: 'Klein', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Groß', value: 'large' },
  ];

  override readonly scopeOptions = [
    { label: 'Gefiltert (12)', value: 'filtered' },
    { label: 'Alle (238)', value: 'all' },
  ];

  override readonly examples: ToggleSwitchArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));
}
