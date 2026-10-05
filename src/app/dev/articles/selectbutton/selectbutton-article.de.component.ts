import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { SelectButtonArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './selectbutton-article.component';

/** German prose for the examples; id and code stay those of the English base. */
const EXAMPLES_DE: Record<string, { title: string; note: string }> = {
  canonical: {
    title: 'Der kanonische Fall: eines von dreien, immer beantwortet',
    note: 'Drei kurze Substantive, eine Zeile, und allowEmpty ausgeschaltet, damit der Wert nie null werden kann.',
  },
  three: {
    title: 'Ein Umschalter für die Dichte',
    note: 'Dieselbe Form steuert hier eine Anzeigeeinstellung statt eines Filters.',
  },
  multiple: {
    title: 'Mehrfachmodus',
    note: 'Das Model ist ein Array, und jedes Segment schaltet für sich um. Fünf Segmente sind schon an der Grenze dessen, was eine Reihe trägt.',
  },
  item: {
    title: 'Eigener Segment-Inhalt',
    note: 'Das #item-Template ersetzt den Inhalt eines Segments. Die Icons sind hier dekorativ, deshalb bleibt das Label.',
  },
  sizes: {
    title: 'Größen: small, Standard, large',
    note: 'Der size-Input verschiebt die font-size und sonst nichts — das Padding ist in allen dreien identisch.',
  },
  fluid: {
    title: 'Volle Breite mit gleich breiten Segmenten',
    note: 'fluid setzt width:100% auf die Gruppe und flex:1 auf jedes Segment. Ändere die Fenstergröße, und die Drittel bleiben gleich.',
  },
  states: {
    title: 'Eine deaktivierte Option, eine ungültige Gruppe, eine deaktivierte Gruppe',
    note: 'Oben: optionDisabled macht „Legacy“ unbenutzbar — geh mit Tab in die Gruppe und achte darauf, dass es trotzdem den Fokus bekommt. Mitte: [invalid] zeichnet eine 1px-Outline und kündigt nichts an. Unten: die ganze Gruppe deaktiviert.',
  },
};

/**
 * German twin of the SelectButton guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the option labels, the example
 * prose and the visible strings in `m` are German. Keep it in step with the
 * English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs selectbutton`).
 */
@Component({
  selector: 'app-selectbutton-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'selectbutton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jedes Control hier unten ist ein echter <code>p-selectbutton</code>: eine Reihe verbundener Segmente, von denen
          genau eines (oder im Mehrfachmodus beliebig viele) gedrückt ist. Fang im Playground an und lies dann die
          Varianten darunter samt Markup.
        </p>

        <section class="pg" aria-label="SelectButton-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Konfigurieren</legend>

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

              <div class="pg__field pg__field--switch">
                <label for="pg-multiple">Mehrfachauswahl</label>
                <p-toggleswitch
                  inputId="pg-multiple"
                  [ngModel]="pgMultiple()"
                  (ngModelChange)="pgMultiple.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-allowempty">Leer erlauben</label>
                <p-toggleswitch
                  inputId="pg-allowempty"
                  [ngModel]="pgAllowEmpty()"
                  (ngModelChange)="pgAllowEmpty.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-fluid">Volle Breite</label>
                <p-toggleswitch inputId="pg-fluid" [ngModel]="pgFluid()" (ngModelChange)="pgFluid.set($event)" />
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
              <span class="pg__preview-label" id="pg-preview-label">Vorschau</span>
              <div class="pg__stage">
                @if (pgMultiple()) {
                  <p-selectbutton
                    [ariaLabelledBy]="'pg-preview-label'"
                    [options]="pgOptions()"
                    optionLabel="label"
                    optionValue="value"
                    [multiple]="true"
                    [allowEmpty]="pgAllowEmpty()"
                    [size]="pgSizeInput()"
                    [fluid]="pgFluid()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgMultiValue()"
                    (ngModelChange)="pgMultiValue.set($event ?? [])"
                  />
                } @else {
                  <p-selectbutton
                    [ariaLabelledBy]="'pg-preview-label'"
                    [options]="pgOptions()"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="pgAllowEmpty()"
                    [size]="pgSizeInput()"
                    [fluid]="pgFluid()"
                    [disabled]="pgDisabled()"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                  />
                }
              </div>
              <p class="pg__readout">
                Model: <code>{{ pgReadout() }}</code>
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
            Schalte <em>Leer erlauben</em> ein und klick auf das gedrückte Segment: Das Model springt auf
            <code>null</code>. Das ist der ausgelieferte Standard — siehe den Tab Verwendung.
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
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-canonical'"
                    [options]="periodOptions"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ngModel]="period()"
                    (ngModelChange)="period.set($event)"
                  />
                }
                @case ('three') {
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-three'"
                    [options]="densityOptions"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ngModel]="density()"
                    (ngModelChange)="density.set($event)"
                  />
                }
                @case ('multiple') {
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-multiple'"
                    [options]="dayOptions"
                    optionLabel="label"
                    optionValue="value"
                    [multiple]="true"
                    [ngModel]="days()"
                    (ngModelChange)="days.set($event ?? [])"
                  />
                  <span class="ex__readout">{{ daysReadout() }}</span>
                }
                @case ('item') {
                  <p-selectbutton
                    [ariaLabelledBy]="'ex-item'"
                    [options]="alignOptions"
                    optionLabel="label"
                    optionValue="value"
                    [allowEmpty]="false"
                    [ngModel]="align()"
                    (ngModelChange)="align.set($event)"
                  >
                    <ng-template #item let-option>
                      <i [class]="option.icon" aria-hidden="true"></i>
                      <span>{{ option.label }}</span>
                    </ng-template>
                  </p-selectbutton>
                }
                @case ('sizes') {
                  <div class="ex__stack">
                    <p-selectbutton
                      size="small"
                      [ariaLabelledBy]="'ex-sizes'"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="sizeSmall()"
                      (ngModelChange)="sizeSmall.set($event)"
                    />
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-sizes'"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="sizeNormal()"
                      (ngModelChange)="sizeNormal.set($event)"
                    />
                    <p-selectbutton
                      size="large"
                      [ariaLabelledBy]="'ex-sizes'"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="sizeLarge()"
                      (ngModelChange)="sizeLarge.set($event)"
                    />
                  </div>
                }
                @case ('fluid') {
                  <div class="ex__stack">
                    <p-selectbutton
                      [fluid]="true"
                      [ariaLabelledBy]="'ex-fluid'"
                      [options]="densityOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="fluidValue()"
                      (ngModelChange)="fluidValue.set($event)"
                    />
                  </div>
                }
                @case ('states') {
                  <div class="ex__stack">
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-states'"
                      [options]="planOptions"
                      optionLabel="label"
                      optionValue="value"
                      optionDisabled="soldOut"
                      [allowEmpty]="false"
                      [ngModel]="plan()"
                      (ngModelChange)="plan.set($event)"
                    />
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-states'"
                      [invalid]="true"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [ngModel]="invalidValue()"
                      (ngModelChange)="invalidValue.set($event)"
                    />
                    <p-selectbutton
                      [ariaLabelledBy]="'ex-states'"
                      [disabled]="true"
                      [options]="periodOptions"
                      optionLabel="label"
                      optionValue="value"
                      [allowEmpty]="false"
                      [ngModel]="'month'"
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
        <p class="lead">
          SelectButton ist das am häufigsten falsch gewählte Control der Bibliothek, weil vier andere Komponenten nur
          haarscharf daneben liegen. Dieser ganze Tab handelt von genau dieser Grenze.
        </p>

        <h3>Vier Fragen, in dieser Reihenfolge</h3>
        <ol>
          <li>
            <strong>Ändert die Wahl, was auf dem Bildschirm steht, oder welchen Wert etwas hat?</strong> Zwischen
            parallelen <em>Ansichten desselben Gegenstands</em> zu wechseln ist Navigation — <code>p-tabs</code>. Einen
            Wert setzen, den dann etwas anderes liest (eine Sortierung, einen Diagrammzeitraum, ein Formularfeld), ist
            Auswahl — SelectButton.
          </li>
          <li>
            <strong>Ist die Antwort ein einziges Ja/Nein oder eines von mehreren benannten Dingen?</strong> Ein einzelner
            Boolean, der sofort wirkt, ist ein <code>p-toggleswitch</code>. Zwei <em>benannte</em> Optionen („Raster“ /
            „Liste“) haben keine Ruhestellung und sind ein SelectButton.
          </li>
          <li>
            <strong>Ist das ein Formularfeld, das abgeschickt und validiert wird?</strong> Dann erwartet die assistive
            Technologie des Nutzers Radio-Semantik — eine Radio-Gruppe. SelectButton rendert gedrückte Buttons in einer
            schlichten Gruppe und trägt zu einem nativen Formular-Submit nichts bei.
          </li>
          <li>
            <strong>Passen alle Optionen bei deiner schmalsten Breite in eine Zeile?</strong> Zwei bis vier kurze Labels:
            SelectButton. Mehr als das, lange Labels oder Optionen, die eine Erklärung brauchen: <code>p-select</code>.
          </li>
        </ol>

        <h3>Die Tabelle zur Control-Wahl</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Control</th>
                <th>Warum nicht SelectButton</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2&ndash;4 kurze, sich gegenseitig ausschließende Werte, immer sichtbar, sofort angewendet</td>
                <td>
                  <strong><code>p-selectbutton</code></strong>
                </td>
                <td>&mdash;</td>
              </tr>
              <tr>
                <td>Parallele Ansichten eines Datensatzes (Übersicht / Aktivität / Einstellungen)</td>
                <td><code>p-tabs</code></td>
                <td>
                  Tabs besitzen <code>role="tablist"</code> und die Panel-Verdrahtung; ein Segmented Control kündigt
                  Buttons an, und das Panel ist mit nichts verknüpft.
                </td>
              </tr>
              <tr>
                <td>Eine einzelne An/Aus-Einstellung, die in dem Moment wirkt, in dem sie sich bewegt</td>
                <td><code>p-toggleswitch</code></td>
                <td>
                  Ein „An / Aus“-Paar verbraucht ein ganzes Segmented Control für einen Zustand, den ein Switch auf einen
                  Blick zeigt &mdash; und der Switch hat eine Ruhestellung.
                </td>
              </tr>
              <tr>
                <td>Ein einzelner An/Aus-Zustand, der wie ein Button <em>aussehen</em> muss (ein Toolbar-Control, „Fett“, „Stumm“)</td>
                <td><code>p-togglebutton</code></td>
                <td>
                  SelectButton ist ein Gruppen-Wrapper um genau diese Komponente; eine Gruppe mit einer Option legt eine
                  <code>role="group"</code>, ein Options-Array und ein leerbares Model um einen einzigen gedrückten Button.
                  Greif direkt zum Kind &mdash; es nimmt <code>onLabel</code> / <code>offLabel</code>,
                  <code>onIcon</code> / <code>offIcon</code> und ein eigenes <code>ariaLabel</code>, und nichts davon
                  reicht die Gruppe durch.
                </td>
              </tr>
              <tr>
                <td>Eine Pflichtauswahl in einem abgeschickten, validierten Formular</td>
                <td>Radio-Gruppe</td>
                <td>
                  Keine Radio-Semantik, kein <code>required</code> im Markup, kein Wert in einem nativen Submit &mdash;
                  siehe den Tab Entwicklung.
                </td>
              </tr>
              <tr>
                <td>5&ndash;25 Optionen oder Labels, die nicht in eine Zeile passen</td>
                <td><code>p-select</code></td>
                <td>Segmente werden nie gekürzt; sie brechen die Zeile um oder schieben das Layout auseinander.</td>
              </tr>
              <tr>
                <td>Null bis viele unabhängige Optionen in einem Formular</td>
                <td>Checkbox-Gruppe</td>
                <td>
                  <code>[multiple]="true"</code> funktioniert, kündigt aber gedrückte Buttons statt ankreuzbarer Einträge
                  an, und kein Pflicht- oder Fehlerzustand erreicht das Markup.
                </td>
              </tr>
              <tr>
                <td>Aktionen, die etwas <em>tun</em> (Exportieren, Löschen)</td>
                <td><code>p-button</code></td>
                <td>Ein gedrücktes Segment ist ein Zustand, kein Befehl; nach einer Aktion bleibt hier nichts gedrückt.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Vier Fehler, die du dir merken solltest, auf beiden Seiten gerendert. Das
          <span class="tag tag--bad">Don’t</span> steht links, das <span class="tag tag--good">Do</span>
          rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; ein Segmented Control als Seitennavigation</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-nav-bad'"
                [options]="sectionOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddNav()"
                (ngModelChange)="ddNav.set($event)"
              />
            </div>
            <p class="dd__why" id="dd-nav-bad">
              Drei Buttons werden als Buttons angekündigt. Nichts sagt irgendwem, dass ein Panel darunter zum gedrückten
              gehört, und es gibt keinen Tastatur-Vertrag für Panels.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; Tabs, mit echter Tab-Semantik</span>
            <div class="dd__stage">
              <p-tabs [value]="ddTab()" (valueChange)="onDdTab($event)">
                <p-tablist [pt]="{ tabList: { 'aria-label': 'Bereiche des Datensatzes' } }">
                  @for (s of sectionOptions; track s.value) {
                    <p-tab [value]="s.value">{{ s.label }}</p-tab>
                  }
                </p-tablist>
                <p-tabpanels>
                  @for (s of sectionOptions; track s.value) {
                    <p-tabpanel [value]="s.value" tabindex="0">
                      <span class="dd__panel">Panel {{ s.label }}</span>
                    </p-tabpanel>
                  }
                </p-tabpanels>
              </p-tabs>
            </div>
            <p class="dd__why">
              <code>role="tablist"</code>, Navigation mit den Pfeiltasten und jedes Panel mit seinem Tab verdrahtet
              &mdash; der ganze Vertrag, der dem Segmented Control fehlt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; An / Aus als zwei Segmente</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-bool-bad'"
                [options]="onOffOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddBool()"
                (ngModelChange)="ddBool.set($event)"
              />
            </div>
            <p class="dd__why" id="dd-bool-bad">
              Zwei Segmente, zwei Wörter, und den Zustand muss man trotzdem daran ablesen, welches gedrückt aussieht.
              „Aus“ wird außerdem als Button angekündigt, den man drücken kann.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; ein Switch, ein Label</span>
            <div class="dd__stage">
              <div class="dd__switch">
                <label for="dd-notifications">E-Mail-Benachrichtigungen</label>
                <p-toggleswitch
                  inputId="dd-notifications"
                  [ngModel]="ddSwitch()"
                  (ngModelChange)="ddSwitch.set($event)"
                />
              </div>
            </div>
            <p class="dd__why">
              <code>role="switch"</code> trägt den Zustand, das Label benennt die Sache, und er braucht nur einen
              Bruchteil der Breite.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; sechs Optionen in einer Reihe</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-many-bad'"
                [options]="countryOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddMany()"
                (ngModelChange)="ddMany.set($event)"
              />
            </div>
            <p class="dd__why" id="dd-many-bad">
              Segmente richten ihre Größe nach dem Inhalt und werden nie gekürzt, also bricht eine lange Reihe entweder zu
              einem Block um oder macht die Zeile breiter als die Spalte.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; ein Select mit fester Breite</span>
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
            <p class="dd__why">Ein Trigger mit vorhersehbarer Breite, und die Liste wächst, ohne das Layout anzufassen.</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; den leerbaren Standard stehen lassen</span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-empty-bad'"
                [options]="periodOptions"
                optionLabel="label"
                optionValue="value"
                [ngModel]="ddEmpty()"
                (ngModelChange)="ddEmpty.set($event)"
              />
              <span class="ex__readout">Model: {{ ddEmpty() ?? 'null' }}</span>
            </div>
            <p class="dd__why" id="dd-empty-bad">
              Klick auf das gedrückte Segment: Das Model ist <code>null</code>, und jedes Segment sieht ungedrückt aus.
              Was auch immer diesen Wert liest, hat jetzt keine Antwort.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; <code>[allowEmpty]="false"</code></span>
            <div class="dd__stage">
              <p-selectbutton
                [ariaLabelledBy]="'dd-empty-good'"
                [options]="periodOptions"
                optionLabel="label"
                optionValue="value"
                [allowEmpty]="false"
                [ngModel]="ddKept()"
                (ngModelChange)="ddKept.set($event)"
              />
              <span class="ex__readout">Model: {{ ddKept() }}</span>
            </div>
            <p class="dd__why" id="dd-empty-good">
              Ein Klick auf das gedrückte Segment bewirkt jetzt nichts, und das Control hat immer eine Antwort &mdash;
              genau das bedeutet „eines davon“.
            </p>
          </div>
        </div>

        <h3>Die Labels schreiben</h3>
        <ul>
          <li>
            <strong>Substantive und Adjektive, keine Verben.</strong> Segmente sind Zustände („Kompakt“, „Woche“,
            „Raster“), keine Befehle. Ein Verb-Label liest sich wie ein Button, der etwas tut und dann gedrückt hängen
            bleibt.
          </li>
          <li>
            <strong>Wo möglich ein Wort pro Segment.</strong> Der ganze Sinn des Controls ist, dass alle Antworten
            gleichzeitig sichtbar sind; zweizeilige Segmente machen das zunichte.
          </li>
          <li>
            <strong>Parallele Grammatik über die ganze Reihe.</strong> „Tag / Woche / Monat“, nie „Tag / Diese Woche /
            Monatlich“.
          </li>
          <li>
            <strong>Benenne die Gruppe, nicht die Optionen.</strong> Die Beschriftung über dem Control sagt, was gewählt
            wird; die Segmente sagen die Antworten.
          </li>
        </ul>

        <h3>Kommentierte Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-pressed" target="_blank" rel="noopener noreferrer">
              W3C &mdash; WAI-ARIA 1.2, <code>aria-pressed</code></a
            >
            &mdash; definiert den Toggle-Button-Zustand, den jedes Segment tatsächlich ausgibt, und wie er sich von
            <code>aria-checked</code> unterscheidet; die Grundlage für den Semantik-Abschnitt weiter unten.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Button pattern (incl. toggle buttons)</a
            >
            &mdash; der Tastatur-Vertrag (Enter und Leertaste) und die Regel, dass ein Toggle-Button sein Label behält,
            während sich der Zustand ändert, und sich nie selbst umbenennt.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Radio Group pattern</a
            >
            &mdash; der Roving-Tabindex-Vertrag mit Pfeiltasten, den man einem Segmented Control oft unterstellt;
            nützlich gerade weil SelectButton ihn nicht umsetzt.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noopener noreferrer">
              W3C &mdash; APG, Tabs pattern</a
            >
            &mdash; was „Navigation zwischen parallelen Ansichten“ verlangt, und damit, was die erste Frage in diesem Tab
            eigentlich fragt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            &mdash; die Untergrenze von 3:1, an der die Anzeige des gedrückten Zustands im Tab Design gemessen wird.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            &mdash; die Untergrenze von 4,5:1 für die Segment-Labels, die das Label-Token des Kits in jedem Stil hält.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C &mdash; WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            &mdash; die Untergrenze von 24&nbsp;CSS-px, an der die Standardhöhe eines Segments geprüft wird.
          </li>
          <li>
            <a href="https://primeng.org/selectbutton" target="_blank" rel="noopener noreferrer">
              PrimeNG &mdash; SelectButton</a
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
          Das Host-Element ist die Gruppe; es rendert keinen eigenen Wrapper. Jede Option wird zu einem
          <code>p-togglebutton</code>-Kind, und jedes davon legt sein Label in ein inneres Content-Span &mdash; das Teil,
          das tatsächlich den gedrückten Look trägt.
        </p>
        <ul>
          <li>
            <strong>Gruppe</strong> &mdash; <code>.p-selectbutton</code>: <code>display: inline-flex</code>,
            <code>user-select: none</code> und der äußere Eckenradius.
          </li>
          <li>
            <strong>Segment</strong> &mdash; <code>.p-togglebutton</code>: Hintergrund, 1px Rahmen, 0.25rem Padding und
            die Fokus-Outline. Innerhalb der Gruppe wird sein Radius auf 0 und sein Rahmen auf <code>1px 1px 1px 0</code>
            zurückgesetzt, sodass Nachbarn sich eine Kante teilen; nur das erste und das letzte Segment bekommen die
            äußeren Radien zurück.
          </li>
          <li>
            <strong>Content</strong> &mdash; <code>.p-togglebutton-content</code>: die innere Pille,
            <code>0.25rem 0.75rem</code> Padding, zentriertes Flex mit 0.5rem Abstand. Ihr
            Hintergrund ist das, was sich ändert, wenn ein Segment gedrückt wird.
          </li>
          <li>
            <strong>Label / Icon</strong> &mdash; <code>.p-togglebutton-label</code> und
            <code>.p-togglebutton-icon</code>, beide mit <code>transition: none</code>, damit Text nie überblendet.
          </li>
        </ul>
        <p class="src-note">
          Struktur aus <code>openng-optimus-ui-selectbutton.mjs:313-335</code> (ein
          <code>p-togglebutton</code> pro Option, Optimus UI 2.0.2); Layout-Literale aus <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code> und
          <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>.
        </p>

        <h3>Token-Kette: Aura &rarr; Kit</h3>
        <p>
          Das <code>selectbutton</code>-Preset ist fast leer &mdash; es besitzt den äußeren Radius und die Farbe der
          Fehler-Outline, sonst nichts. Jedes Farb-, Padding- und Schrift-Token kommt aus dem
          <code>togglebutton</code>-Preset.
        </p>
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
                <td><code>selectbutton.border.radius</code></td>
                <td><code>&#123;form.field.border.radius&#125;</code></td>
                <td><code>&#123;border.radius.md&#125;</code> &mdash; je nach visuellem Stil (Aura ab Werk 6px, werkbund 0)</td>
              </tr>
              <tr>
                <td><code>selectbutton.invalid.border.color</code></td>
                <td><code>&#123;form.field.invalid.border.color&#125;</code></td>
                <td>das gemeinsame Formularfehler-Rot</td>
              </tr>
              <tr>
                <td><code>togglebutton.padding</code></td>
                <td>0.25rem</td>
                <td>4px, alle drei Größen</td>
              </tr>
              <tr>
                <td><code>togglebutton.content.padding</code></td>
                <td>0.25rem 0.75rem</td>
                <td>4px / 12px, alle drei Größen</td>
              </tr>
              <tr>
                <td><code>togglebutton.font.size</code></td>
                <td>&mdash; kein Root-Token in Aura 2.x</td>
                <td>das Stylesheet schreibt <code>font-size: 1rem</code> fest; nur sm/lg haben Tokens</td>
              </tr>
              <tr>
                <td><code>togglebutton.border.radius</code></td>
                <td><code>&#123;content.border.radius&#125;</code></td>
                <td>je nach visuellem Stil (innerhalb der Gruppe auf 0 zurückgesetzt, außer unter skizzenbuch)</td>
              </tr>
              <tr>
                <td><code>togglebutton.gap</code></td>
                <td>0.5rem</td>
                <td>8px, Icon &harr; Label</td>
              </tr>
              <tr>
                <td><code>togglebutton.font.weight</code></td>
                <td>500</td>
                <td>&mdash;</td>
              </tr>
              <tr>
                <td><code>togglebutton.transition.duration</code></td>
                <td><code>&#123;form.field.transition.duration&#125;</code></td>
                <td>0.2s</td>
              </tr>
              <tr>
                <td><code>togglebutton.focus.ring.*</code></td>
                <td><code>&#123;focus.ring.*&#125;</code></td>
                <td>
                  1px solid <code>&#123;primary.color&#125;</code>, Offset 2px &mdash; ersetzt durch den Ring des Kits: 2px
                  <code>--primary-color-fg</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui-themes/dist/aura/selectbutton/index.mjs</code> und
          <code>&#8230;/aura/togglebutton/index.mjs</code>, aufgelöst gegen <code>&#8230;/aura/base/index.mjs</code>.
          <strong>Achte auf den Fokus-Ring:</strong> Auras ist der globale 1px-<code>focus.ring</code>; das Kit zeichnet
          stattdessen seinen einen Ring (<code>.p-togglebutton:focus-visible</code> in <code>styles.scss</code>, 2px
          <code>--primary-color-fg</code> mit 2px Offset, <code>!important</code>) &mdash; derselbe Ring wie bei Feldern
          und Buttons.
        </p>

        <h3>Was das Kit darüberlegt: die visuellen Stile</h3>
        <p>
          Die Verlaufsebene des <code>ThemeService</code>, die gefüllte Buttons neu malt, ist auf <code>.p-button</code>
          beschränkt &mdash; eine Klasse, die die Segmente nicht tragen &mdash; also kommen die <strong>Farben</strong>
          aus einer eigenen Regel des Kits: <code>.p-togglebutton</code> in <code>styles.scss</code> biegt die
          <code>--p-togglebutton-*</code>-Variablen auf die Flächen, Textfarben und den Akzent-Vordergrund des Kits um
          (nächster Abschnitt). Die
          <strong>Form</strong> dagegen nicht: Der <code>html.style-&lt;name&gt;</code>-Block jedes visuellen Stils in
          <code>styles.scss</code> (ADR-0016) zielt auf <code>.p-togglebutton</code>, also auf jedes Segment.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stil</th>
                <th>Was jedes Segment bekommt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>
                  <code>var(--style-bw) solid var(--style-outline)</code>-Rahmen (3px hell, 2px dunkel), Radius 0, kein
                  Schatten, Display-Schrift, Eindrücken per <code>translate(2px, 2px)</code> bei
                  <code>[data-p-disabled='false']:active</code>
                </td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>2px Outline plus ein um 2px versetzter Schatten, Display-Schrift in 700, Eindrück-Transform</td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>1.5px Outline, Papierschatten, ein handgezeichneter Radius an jedem Segment, ein Druck um 1px</td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>Display-Schrift in 600, gesperrte Großbuchstaben-Labels &mdash; keine Änderung am Rahmen</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die <code>.p-togglebutton</code>-Selektoren in den vier <code>html.style-&lt;name&gt;</code>-Blöcken von
          <code>styles.scss</code>. Das Eindrücken hängt am Attribut samt Wert, weil <code>:enabled</code>
          nie auf das Custom Element passt. Zwei Folgen: In drei Stilen trägt jedes Segment seine eigene Tinten-Outline,
          sodass die Segmentgrenzen klar sind; und die Großbuchstaben-Labels von blaupause sind breiter, was der
          Abschnitt zur Breite weiter unten auffangen muss.
        </p>

        <h3>Wie „gedrückt“ signalisiert wird</h3>
        <p>
          Aura signalisiert die Auswahl <strong>nur über Flächen</strong>: eine weiße Pille auf einem hellgrauen Segment,
          nirgends eine Markenfarbe. Das Kit behält den Mechanismus &mdash; nur die innere Content-Pille und das Label
          ändern sich &mdash; füllt die Pille aber mit dem Akzent-Vordergrund, sodass das gedrückte Segment auf einen
          Blick erkennbar ist.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ebene</th>
                <th>Aura (hell / dunkel)</th>
                <th>Was das Kit rendert (beide Modi)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gruppenhintergrund</td>
                <td colspan="2">
                  keiner &mdash; <code>.p-selectbutton</code> malt nichts; die Segmente tragen die Füllung
                </td>
              </tr>
              <tr>
                <td>Hintergrund und Rahmen des Segments</td>
                <td><code>&#123;surface.100&#125;</code> / <code>&#123;surface.950&#125;</code></td>
                <td><code>--surface-section</code></td>
              </tr>
              <tr>
                <td>Hintergrund des gedrückten Segments</td>
                <td>identisch mit dem Segment</td>
                <td>identisch mit dem Segment</td>
              </tr>
              <tr>
                <td>gedrückte <em>Content</em>-Pille</td>
                <td><code>&#123;surface.0&#125;</code> / <code>&#123;surface.800&#125;</code></td>
                <td><code>--primary-color-fg</code></td>
              </tr>
              <tr>
                <td>Label, nicht gedrückt</td>
                <td><code>&#123;surface.500&#125;</code> / <code>&#123;surface.400&#125;</code></td>
                <td><code>--text-color-secondary</code></td>
              </tr>
              <tr>
                <td>Label und Icon, gedrückt</td>
                <td><code>&#123;surface.900&#125;</code> / <code>&#123;surface.0&#125;</code></td>
                <td><code>--surface-card</code></td>
              </tr>
              <tr>
                <td>Hover, nicht gedrückt</td>
                <td>nur die Label-Farbe; <code>hover.background</code> gleicht der Basis</td>
                <td><code>--surface-hover</code> hinter <code>--text-color</code></td>
              </tr>
              <tr>
                <td>Erhöhung im gedrückten Zustand</td>
                <td colspan="2"><code>content.checked.shadow</code> &mdash; zwei 1px-Schatten mit 2&nbsp;% und 4&nbsp;% Schwarz</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Was das Gate hält, in jedem Stil × Akzent × Modus:</p>
        <ul>
          <li>
            <strong>Die gedrückte Pille schafft die Kontrast-Untergrenze für Nicht-Text.</strong> Gegen das nicht
            gedrückte Segment misst sie <strong>{{ m.pressedContrastLight }}</strong> im hellen Modus und
            <strong>{{ m.pressedContrastDark }}</strong> im dunklen Modus über die Akzente von werkbund, am niedrigsten
            3,88:1 (blaupause dunkel, fire) &mdash; SC 1.4.11 verlangt 3:1. Auras eigene weiße Pille lag bei 1,10:1 hell
            und 1,34:1 dunkel. Der Forced-Colors-Modus lässt die Füllung weg, dann hängt der Zustand an
            <code>aria-pressed</code> und, falls du eines ergänzt, an einem Icon.
          </li>
          <li>
            <strong>Die Labels schaffen SC 1.4.3.</strong> Das nicht gedrückte Label ist <code>--text-color-secondary</code>
            auf dem Segment: <strong>{{ m.labelContrastLight }}</strong> hell und <strong>{{ m.labelContrastDark }}</strong>
            dunkel in werkbund, am niedrigsten 4,64:1 (blaupause, hell). Das gedrückte Label auf der Pille:
            <strong>{{ m.pressedLabelLight }}</strong> hell, <strong>{{ m.pressedLabelDark }}</strong> dunkel in
            werkbund, am niedrigsten 4,75:1. Überschreib <code>--p-togglebutton-color</code> nicht mit einem helleren
            Grau; Auras eigener Wert lag bei 4,34:1.
          </li>
        </ul>
        <p class="src-note">
          Aura-Ebenen aus <code>&#8230;/aura/togglebutton/index.mjs</code> (Aura 2.x: ein
          <code>colorScheme.light</code>- / <code>colorScheme.dark</code>-Block, kein <code>light-dark()</code>); die
          Kit-Spalte aus der <code>.p-togglebutton</code>-Regel in <code>styles.scss</code>. Verhältnisse zitiert aus
          <code>docs/generated/CONTRAST.MD</code>, <code>togglebutton &amp; selectbutton</code>:
          <code>&lt;accent&gt;.togglebutton.content.checked.background</code> auf <code>togglebutton.background</code>
          (die Pille), <code>togglebutton.checked.color</code> auf der Pille und <code>togglebutton.color</code> auf
          <code>togglebutton.background</code>.
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
                <td>font-size</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
                <td>1.125rem (18px)</td>
              </tr>
              <tr>
                <td>Segment-Padding</td>
                <td colspan="3">0.25rem &mdash; von <code>size</code> unverändert</td>
              </tr>
              <tr>
                <td>Content-Padding</td>
                <td colspan="3">
                  0.25rem 0.75rem &mdash; von <code>size</code> unverändert
                </td>
              </tr>
              <tr>
                <td>Segmenthöhe (aus den Tokens abgeleitet)</td>
                <td>{{ m.hSmall }}</td>
                <td>{{ m.hDefault }}</td>
                <td>{{ m.hLarge }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die <code>sm</code>- / <code>lg</code>-Blöcke in <code>&#8230;/aura/togglebutton/index.mjs</code> überschreiben
          <em>nur</em> <code>fontSize</code>; ihre Padding-Werte gleichen den Standardwerten. Die Höhe ist font-size &times;
          line-height plus die beiden festen Paddings und der Rahmen, deshalb ist die Skala so flach. Die Höhen
          gelten für Auras 1px-Rahmen; die Outline eines visuellen Stils legt ihre zusätzliche Breite an beiden Kanten
          drauf (werkbund hell: 3px).
          Jede Größe schafft die 24px-Untergrenze von
          SC 2.5.8; <code>small</code> ist die, die du gegen 44px prüfen musst, wenn du SC 2.5.5 brauchst.
        </p>

        <h3>Breite: standardmäßig nach Inhalt, gleich breite Segmente mit <code>fluid</code></h3>
        <p>
          Segmente richten sich nach ihren Labels, also ergibt eine Reihe ungleich langer Wörter ein ungleichmäßiges
          Control, und eine längere Übersetzung macht es still und leise breiter. <code>[fluid]="true"</code> setzt
          <code>width: 100%</code> auf die Gruppe und <code>flex: 1 1 0</code> auf jedes Segment &mdash; gleiche Drittel,
          feste Außenbreite. <strong>Schmale
          Bildschirme:</strong> Das Control hat kein eigenes responsives Verhalten; Segmente rutschen nie in eine zweite
          Zeile und werden nie gekürzt, also läuft ein Control mit Inhaltsbreite unterhalb seiner Inhaltsbreite aus seinem
          Container heraus, und ein fluides bricht die Labels innerhalb jedes Segments um. Das ist der unterstützte Weg
          zu einem Segmented Control in voller Breite; eine handgeschriebene <code>display: flex</code>-Regel auf der
          Gruppe ist nicht nötig und kämpft gegen die ausgelieferte an.
        </p>
        <p class="src-note">
          <code>.p-selectbutton-fluid</code> und <code>.p-selectbutton-fluid .p-togglebutton</code> in
          <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code>.
        </p>

        <h3>Fokus</h3>
        <p>
          Jedes Segment ist für sich fokussierbar, und die Outline wird am Segment gezeichnet, nicht an der Gruppe. Weil
          Nachbarn sich einen Rahmen teilen, hebt die ausgelieferte Regel ein fokussiertes Segment mit
          <code>position: relative; z-index: 1</code> an, damit sein Ring nicht vom nächsten Segment übermalt wird.
          Gemessen an einem fokussierten Segment: <strong>{{ m.focusOutline }}</strong> mit Offset
          <strong>{{ m.focusOffset }}</strong
          >, identisch in beiden Modi. Gib keinem umgebenden Element, das das Control eng umschließt,
          <code>overflow: hidden</code> &mdash; der Ring wird 2px außerhalb davon gezeichnet.
        </p>
        <p class="src-note">
          Das Anheben: <code>.p-selectbutton .p-togglebutton:focus-visible</code> in
          <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code>. Der Ring: die eine Fokus-Ring-Regel des
          Kits in <code>styles.scss</code> (<code>.p-togglebutton:focus-visible</code>), gemessen in
          <code>docs/generated/CONTRAST.MD</code>, Zeile <code>focus ring</code>, 3,88&ndash;17,85:1 auf den
          Seitenflächen.
        </p>

        <h3>Stand bei WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst &mdash; ein Kriterium, das hier nicht gemessen wird, wird
          auch nicht beansprucht.
          <strong>Erfüllt:</strong> SC 2.1.1, wobei <code>Enter</code> und <code>Space</code> jedes Segment bedienen und
          jedes Segment ein eigener Tab-Stopp ist; SC 2.4.7 mit dem in beiden Modi gemessenen Ring ({{ m.focusOutline }}
          mit Offset {{ m.focusOffset }}); und SC 2.5.8, von allen drei Größen geschafft mit {{ m.hSmall }} /
          {{ m.hDefault }} / {{ m.hLarge }}; SC 1.4.11 für die gedrückte Pille (am niedrigsten 3,88:1 gegen das Segment)
          und SC 1.4.3 für jedes Label, beide im <code>CONTRAST.MD</code>-Gate geprüft. <strong>Nicht erfüllt:</strong>
          keines der gemessenen Kriterien.
          <strong>Bedingt:</strong> SC 4.1.2 &mdash; die
          Gruppe gibt Toggle-Buttons mit <code>aria-pressed</code> aus, trägt aber keinen eigenen Namen und kündigt
          nichts an, bis die Aufrufstelle einen liefert. <strong>AAA</strong> wird nicht bewertet, außer dem einen
          Kriterium, das dieser Guide berührt: SC 2.5.5 verlangt 44px, was keine gemessene Segmenthöhe erreicht.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ m.devImport }}</code></pre>
        <p>
          Der Selektor akzeptiert <code>p-selectbutton</code>, <code>p-selectbutton</code> und
          <code>p-select-button</code>. Er ist ein <code>ControlValueAccessor</code>, also binden sowohl
          <code>ngModel</code> als auch Reactive Forms.
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
                <td><code>options</code></td>
                <td>any[]</td>
                <td>Die Options-Objekte. Bau sie in einem <code>computed()</code>, damit die Labels der Sprache folgen.</td>
              </tr>
              <tr>
                <td><code>optionLabel</code></td>
                <td>string</td>
                <td>
                  Feld mit dem sichtbaren Label. Fehlt es, wird ein <code>label</code>-Feld der Option verwendet, falls es
                  definiert ist, und erst wenn auch das fehlt, die Option selbst.
                </td>
              </tr>
              <tr>
                <td><code>optionValue</code></td>
                <td>string</td>
                <td>
                  Feld mit dem Model-Wert.
                  <strong>Lässt du es weg, bekommt das Model das ganze Options-Objekt</strong>, sobald
                  <code>optionLabel</code> gesetzt ist.
                </td>
              </tr>
              <tr>
                <td><code>optionDisabled</code></td>
                <td>string</td>
                <td>Feld, das eine Option unbenutzbar macht; fällt auf ein <code>disabled</code>-Feld der Option zurück.</td>
              </tr>
              <tr>
                <td><code>multiple</code></td>
                <td>boolean</td>
                <td>Das Model wird ein Array; jedes Segment schaltet unabhängig um.</td>
              </tr>
              <tr>
                <td><code>allowEmpty</code></td>
                <td>boolean</td>
                <td>
                  <strong>Standard true.</strong> Ein Klick auf das gedrückte Segment leert das Model auf <code>null</code>.
                  Setz <code>false</code> für „genau eines davon“.
                </td>
              </tr>
              <tr>
                <td><code>unselectable</code></td>
                <td>boolean</td>
                <td>
                  Altes Gegenstück zum Input darüber &mdash; ein schlichter Setter, der
                  <code>allowEmpty = !value</code> schreibt (<code>openng-optimus-ui-selectbutton.mjs:103-106</code>), also
                  teilen sich beide Inputs ein Feld, und die Reihenfolge der Zuweisung entscheidet. Nimm
                  <code>allowEmpty</code>, nie beide.
                </td>
              </tr>
              <tr>
                <td><code>dataKey</code></td>
                <td>string</td>
                <td>Identitätsfeld, mit dem Options-Werte verglichen werden, wenn sie Objekte sind.</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Nur die Schriftgröße &mdash; siehe den Tab Design.</td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>Volle Breite, gleich breite Segmente.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  Deaktiviert die ganze Gruppe; die Segmente bleiben trotzdem in der Tab-Reihenfolge &mdash; siehe die
                  Stolperfallen.
                </td>
              </tr>
              <tr>
                <td><code>invalid</code></td>
                <td>boolean</td>
                <td>Fügt eine 1px-Outline in der Fehlerfarbe hinzu. Angekündigt wird nichts &mdash; ergänze Text.</td>
              </tr>
              <tr>
                <td><code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>Ids, die die Gruppe benennen. Der einzige Input zur Benennung, den es gibt.</td>
              </tr>
              <tr>
                <td><code>required</code>, <code>name</code></td>
                <td>boolean, string</td>
                <td>Akzeptiert und von der Editable-Holder-Basis geerbt, aber keines von beiden erreicht hier das DOM.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>Wird an jedes Segment weitergereicht, nicht nur an das erste.</td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>Akzeptiert, nie angewendet &mdash; siehe die Stolperfalle unten.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs gelesen aus der Komponentendeklaration in
          <code>openng-optimus-ui-selectbutton.mjs</code> (Optimus UI 2.0.2 &mdash; schlichte
          <code>&#64;Input()</code>-Properties außer <code>size</code> und <code>fluid</code>, die Signals sind;
          <code>styleClass</code> gibt es noch, es wird aber an jedes Segment weitergereicht, <code>:316</code>, also nimm
          lieber <code>class</code>);
          <code>required</code> / <code>invalid</code> / <code>disabled</code> / <code>name</code> sind geerbt von
          <code>BaseEditableHolder</code>. Die Regel zum Objekt-Model ist der <code>getOptionValue</code>-Fallback in
          <code>openng-optimus-ui-selectbutton.mjs:195-197</code>.
        </p>

        <h3>Outputs und das Item-Template</h3>
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
                <td><code>&#123; originalEvent, value &#125;</code></td>
                <td>Nachdem das Model geschrieben ist; <code>value</code> ist das neue Model, im Mehrfachmodus ein Array.</td>
              </tr>
              <tr>
                <td><code>onOptionClick</code></td>
                <td><code>&#123; originalEvent, option, index &#125;</code></td>
                <td>
                  Derselbe Moment, trägt aber das Options-Objekt und seinen Index &mdash; nimm es, wenn du wissen musst,
                  <em>welches</em> Segment sich bewegt hat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Keines der beiden Outputs feuert bei einem Klick, der nichts ändert (ein gedrücktes Segment unter
          <code>[allowEmpty]="false"</code> oder eine deaktivierte Option). Es gibt einen Content-Slot, der den Inhalt
          eines Segments ersetzt:
        </p>
        <pre class="code-block"><code>{{ m.itemSnippet }}</code></pre>
        <p class="src-note">
          <code>onOptionSelect</code> kehrt vor jedem Emit früh zurück, wenn der Klick nichts bewirkt
          (<code>openng-optimus-ui-selectbutton.mjs:201-231</code>). Der Slot ist das <code>#item</code>-Content-Child — ein
          <code>&#64;ContentChild</code> nur für direkte Kinder (<code>&#123; descendants: false &#125;</code>,
          <code>:414-415</code>); die <code>PrimeTemplate</code>-Query aus v21 lebt daneben weiter
          (<code>:417-418</code>), also bindet <code>pTemplate</code> wieder.
        </p>

        <h3>Formulare</h3>
        <p>
          Reactive Forms funktionieren über den Value Accessor, aber es gibt kein natives Formular-Control im DOM: kein
          <code>input</code>, kein <code>name</code>-Attribut, keinen Wert in einem nativen Submit. Behandle es als reines
          Angular-Feld.
        </p>
        <pre class="code-block"><code>{{ m.formSnippet }}</code></pre>

        <h3>Stolperfallen in der ausgelieferten Implementierung</h3>
        <ul>
          <li>
            <strong>Optionen werden über ihr Label verfolgt</strong>, nicht über Wert oder Index: Die interne Schleife
            ist <code>track getOptionLabel(option)</code>. Zwei Optionen mit demselben Label erzeugen doppelte
            Track-Keys, und ein Sprachwechsel ändert jeden Key auf einmal, also wird jedes Segment zerstört und neu
            gebaut, und der Fokus innerhalb der Gruppe geht verloren. Halte die Labels pro Control eindeutig.
          </li>
          <li>
            <strong><code>tabindex</code> bewirkt nichts.</strong> Der Input existiert und wird transformiert, aber er
            wird weder am Host gebunden noch an die Segmente weitergereicht. Jedes Segment trägt sein eigenes
            <code>tabindex="0"</code>, also hat ein Control mit N Optionen N Tab-Stopps.
          </li>
          <li>
            <strong>Es gibt keine Navigation mit den Pfeiltasten.</strong> Die Komponente definiert einen
            Roving-Tabindex-Helfer und ruft ihn nie auf. Dokumentiere deinen Nutzern keine Pfeiltasten, und setz den
            Tastatur-Vertrag einer Radio-Gruppe nicht voraus.
          </li>
          <li>
            <strong>Ein deaktiviertes Segment bleibt in der Tab-Reihenfolge &mdash; und wird nicht als deaktiviert
            angekündigt.</strong>
            Der Host von ToggleButton bindet
            <code>tabindex !== undefined ? tabindex : (!$disabled() ? 0 : -1)</code>
            (<code>openng-optimus-ui-togglebutton.mjs:280</code>), aber <code>tabindex</code> steht standardmäßig auf
            <code>0</code> (<code>:177</code>), und SelectButton überschreibt das nie, also kann der
            <code>&minus;1</code>-Zweig nie laufen. PrimeNG 22 hatte das behoben; Optimus, aus der Codebasis von v21
            geforkt, behält den toten Fallback.
            Die einzige Deaktiviert-Markierung im DOM ist <code>data-p-disabled</code> &mdash; kein
            <code>aria-disabled</code> &mdash; also landet der Tastaturfokus auf einem Segment, das stumm ist, blass
            aussieht und nichts tut. Wenn eine Wahl ausgeschlossen sein muss, entferne die Option lieber, statt sie zu
            deaktivieren; behältst du sie, schreib den Grund als Text neben die Gruppe.
          </li>
          <li>
            <strong>Die eigenen Disabled-Tokens der Komponente greifen nie.</strong> Der deaktivierte Look kommt aus der
            globalen <code>.p-disabled</code>-Regel (opacity 0.6 plus <code>pointer-events: none</code>), nicht aus
            <code>togglebutton.disabled.background/color</code>: Die Regel, die sie nutzen würde, ist als
            <code>.p-togglebutton:disabled</code> geschrieben, und <code>:disabled</code> passt nie auf ein Custom
            Element. Der übrig gebliebene <code>cursor: pointer</code>, den du auf einem deaktivierten Segment siehst,
            hat dieselbe Ursache. Verschwende keine Zeit damit, <code>--p-togglebutton-disabled-*</code> zu justieren;
            es ist wirkungslos.
          </li>
          <li>
            <strong><code>[invalid]</code> ist eine 1px-Outline und sonst nichts</strong> &mdash; kein
            <code>aria-invalid</code>, keine Beschreibung. Kombiniere es mit einer sichtbaren Meldung, auf die das Feld
            verweist.
          </li>
          <li>
            <strong>Objekte als Model-Werte</strong> brauchen <code>dataKey</code>, sonst ist die Gleichheit strukturell,
            und eine neu geladene Option kann aufhören, zum Model zu passen.
          </li>
        </ul>

        <h3>Tastatur</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd></td>
                <td>
                  Springt zum <em>nächsten Segment</em>, nicht über das Control hinweg. Jedes Segment ist ein eigener
                  Tab-Stopp &mdash; deaktivierte eingeschlossen.
                </td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Schaltet das fokussierte Segment um; die Standardaktion wird verhindert.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Wie Enter.</td>
              </tr>
              <tr>
                <td><kbd>&larr;</kbd> <kbd>&rarr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd></td>
                <td><strong>Nichts.</strong> Es wird kein Handler ausgeliefert.</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> / <kbd>End</kbd></td>
                <td>Nichts.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Tastenbehandlung gehört zu ToggleButton, nicht zu SelectButton:
          <code>openng-optimus-ui-togglebutton.mjs:107-118</code> behandelt nur <code>Enter</code> und <code>Space</code>.
          Prüf die Zahl der Tab-Stopps im Browser, indem du mit Tab durch das Control gehst &mdash; eine Gruppe mit vier
          Optionen braucht vier Tastendrücke, um sie zu durchqueren.
        </p>

        <h3>Barrierefreiheit</h3>
        <ul>
          <li>
            <strong>Die Gruppe ist eine schlichte <code>role="group"</code></strong> und jede Option ein
            <code>role="button"</code> mit <code>aria-pressed</code> &mdash; nicht <code>radio</code>, nicht
            <code>aria-checked</code>. Screenreader-Nutzer hören „&lt;Label&gt;, Umschaltfläche, gedrückt“, ohne eine
            Position wie „1 von 3“, weil eine Gruppe keine Set-Semantik hat.
          </li>
          <li>
            <strong>Benenne die Gruppe mit <code>ariaLabelledBy</code></strong>, das auf die sichtbare Beschriftung zeigt.
            Es gibt keinen <code>ariaLabel</code>-Input; ein schlichtes <code>[attr.aria-label]</code> am Host kommt auch
            an, weil am Host die Rolle sitzt &mdash; aber eine sichtbare Beschriftung ist besser, und das macht auch das
            Kit (Vorbild: <code>theme-picker.component.ts</code>).
          </li>
          <li>
            <strong>Ohne Namen kündigt die Gruppe überhaupt nichts an</strong>, und der Nutzer hört drei Toggle-Buttons
            ohne Zusammenhang.
          </li>
          <li>
            <strong>Jedes Segment behält in beiden Zuständen ein Label</strong> &mdash; den gedrückten Zustand trägt
            <code>aria-pressed</code>. Tausch den Text nie gegen „Ausgewählt“.
          </li>
          <li>
            <strong>Füg dem Host kein <code>role="radiogroup"</code> hinzu:</strong> Die Kinder sind Buttons, und eine
            Radiogroup, deren Kinder keine Radios sind, kündigt eine leere Menge an.
          </li>
          <li>
            <strong>Deaktivierte Optionen tragen kein <code>aria-disabled</code></strong> (und Tab hält trotzdem bei
            ihnen) &mdash; siehe die Stolperfalle oben. Die Option zu entfernen ist besser, als sie zu deaktivieren.
          </li>
          <li>
            <strong>Kontrast</strong> &mdash; die gedrückte Pille und die Labels bestehen SC 1.4.11 und 1.4.3 nur mit der
            <code>.p-togglebutton</code>-Regel des Kits (Tab Design), also überschreib ihre Tokens nicht. Die Pille ist
            trotzdem eine Füllung, die der Forced-Colors-Modus weglässt; wo die Wahl zählt, stütz sie mit etwas anderem
            ab: einer Anzeige direkt daneben oder einer Ansicht, die sich tatsächlich ändert.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>
            &#9744; Die Gruppe hat einen zugänglichen Namen über <code>ariaLabelledBy</code> (oder ein
            <code>aria-label</code> am Host).
          </li>
          <li>&#9744; <code>[allowEmpty]="false"</code>, wann immer der Wert Pflicht ist.</li>
          <li>&#9744; Zwei bis vier Segmente, die alle bei der schmalsten unterstützten Breite in eine Zeile passen.</li>
          <li>&#9744; Die Labels sind eindeutig, substantivisch und in einem <code>computed()</code> gebaut.</li>
          <li>&#9744; Die Zahl der Tab-Stopps entspricht der Zahl der Optionen, und jedes Segment zeigt einen Fokus-Ring.</li>
          <li>&#9744; Der gedrückte Zustand ist erkennbar, ohne sich allein auf die Pille zu verlassen.</li>
          <li>&#9744; Kein umgebender Text und keine Hilfe deutet eine Bedienung per Pfeiltasten an.</li>
          <li>&#9744; Wird der Wert abgeschickt oder validiert, ist das stattdessen eine Radio-Gruppe.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Ein Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), der die zwei Fakten prüft, die am ehesten zurückfallen &mdash; die
          Gedrückt-Semantik und den leerbaren Standard:
        </p>
        <pre class="code-block"><code>{{ m.testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Jeder Text am Control gehört dir</h3>
        <p>
          SelectButton und ToggleButton lesen nichts aus der Übersetzungskonfiguration der Bibliothek &mdash; es gibt
          keinen <code>aria</code>-Key, kein Standard-Label, nichts, was man durch <code>setTranslation</code> schleusen
          könnte. Die Segment-Labels und die Beschriftung der Gruppe sind der einzige Text, und beides kommt aus deiner
          Übersetzungsschicht.
        </p>
        <pre class="code-block"><code>{{ m.i18nSnippet }}</code></pre>
        <p class="src-note">
          Weder <code>openng-optimus-ui-selectbutton.mjs</code> noch
          <code>openng-optimus-ui-togglebutton.mjs</code> verweist auf die Bibliothekskonfiguration oder ihr
          Übersetzungsobjekt (nachgeprüft, Optimus UI 2.0.2). Die Standardwerte „Yes“ / „No“ für <code>onLabel</code> /
          <code>offLabel</code>, die ToggleButton mitbringt, werden an jedem Segment mit deinem Options-Label
          überschrieben, können hier also nie auftauchen.
        </p>

        <h3>Die Länge der Labels ist ein Layout-Risiko, kein Kürzungsrisiko</h3>
        <p>
          Segmente richten sich nach dem Inhalt und kürzen nie mit Auslassungspunkten. Eine Übersetzung, die 40&nbsp;%
          länger ist, macht das Control deshalb breiter, bis es umbricht oder aus seiner Spalte läuft &mdash; das deutsche
          „Woche / Monat / Jahr“ gegenüber dem englischen „Day / Week / Month“ reicht schon, um eine Toolbar zu
          verschieben. Zwei Gegenmittel, in dieser Reihenfolge:
        </p>
        <ul>
          <li>
            <strong>Plane für die längste Sprache, die du auslieferst</strong>, wenn du dich für zwei, drei oder vier
            Segmente entscheidest. Eine Reihe, die nur auf Englisch passt, ist keine Reihe.
          </li>
          <li>
            <strong><code>[fluid]="true"</code> in einem begrenzten Container</strong> fixiert die Außenbreite und teilt sie
            gleichmäßig auf, sodass Wachstum zu schmaleren Segmenten wird statt zu einem breiteren Control. Die Labels
            brechen dann innerhalb eines Segments um; prüf das höchste.
          </li>
        </ul>

        <h3>Bei Sprachwechsel neu bauen</h3>
        <p>
          Bau <code>options</code> in einem <code>computed()</code> aus dem Übersetzungsdienst, nie als schlichtes Feld
          &mdash; ein schlichtes Array friert seine Labels bei der Konstruktion ein. Beachte die Nebenwirkung: Weil die
          Komponente Optionen über ihr Label verfolgt, zerstört ein Sprachwechsel jedes Segment und baut es neu, also geht
          der Fokus innerhalb des Controls verloren. Steht eine Sprachauswahl neben einem Segmented Control, erwarte
          nicht, dass der Fokus den Wechsel übersteht.
        </p>

        <h3>Leichte Sprache und RTL</h3>
        <ul>
          <li>
            <strong>Varianten in Leichter Sprache</strong> brauchen das schlichteste einzelne Wort pro Segment und keine
            Abkürzungen. Passt die einfache Formulierung nicht in drei Segmente, ist das das Signal für ein Select, nicht
            dafür, bis über die Verständlichkeit hinaus zu kürzen.
          </li>
          <li>
            <strong>RTL erledigt das ausgelieferte CSS.</strong> Die geteilten Rahmen und die äußeren Ecken sind mit
            logischen Properties ausgedrückt (<code>border-inline-start-width</code>,
            <code>border-start-start-radius</code>), sodass die Gruppe ohne Aufwand korrekt spiegelt. Die
            <em>Reihenfolge</em> der Optionen ist die deines Arrays &mdash; sie spiegelt sich optisch, was ein Leser
            erwartet; dreh das Array nicht zum Ausgleich um.
          </li>
        </ul>
        <p class="src-note">
          Regeln mit logischen Properties in
          <code>&#64;openng/optimus-ui-styles/dist/selectbutton/index.mjs</code>. Dieses Kit liefert nur LTR-Sprachen aus,
          der RTL-Hinweis ist also für nachgelagerte Erweiterungen.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die gedrückte Pille ist
            die <code>--primary-color-fg</code>-Füllung des Kits, geprüft auf ≥&nbsp;3,88:1 (vorher Auras 1,10:1 / 1,34:1,
            ungeprüft); Segmente tragen den Fokus-Ring des Kits; das Eindrücken greift jetzt; nicht gedrücktes Label am
            niedrigsten 4,64:1.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) nachgeprüft: Die Aussage „das Kit legt keine Ebene darüber“ ersetzt
            durch das, was die <code>.p-togglebutton</code>-Regel jedes Stils mit jedem Segment macht (Outline, Radius, Schrift, Eindrücken); der
            Gruppenradius hängt vom Stil ab; der Label-Kontrast aus dem Kontrast-Gate zitiert (das
            <code>--text-color-secondary</code>-Label des Kits, am niedrigsten 4,76:1, ersetzt Auras durchfallende 4,34:1), das Pillen-Paar
            als Standardpalette und ungeprüft gekennzeichnet; die Label-Regel des Kits dokumentiert;
            Aussage zu schmalen Bildschirmen ergänzt; Formulierungen mit „Theme“ auf Modi und Akzente umgestellt; Agent-Doku unter das Größenziel gekürzt.
          </li>
          <li>
            <strong>v0.4</strong> &mdash; 02.09.2026 &mdash; Auf Optimus UI 2.0.2 umgestellt (ADR-0014). Drei Aussagen aus v22
            wieder umgedreht: Deaktivierte Segmente bleiben in der Tab-Reihenfolge (der <code>&minus;1</code>-Fallback ist
            wieder tot, weil <code>tabindex</code> standardmäßig 0 ist), die Gruppe bindet kein <code>ariaLabel</code> pro
            Segment (nur <code>onLabel</code> / <code>offLabel</code>), und <code>unselectable</code> ist ein schlichter
            Setter, der <code>allowEmpty</code> schreibt, statt ein eigener Signal-Input. Die Tokens stehen wieder auf
            Aura 2.x &mdash; Content-Padding 4/12px, kein Root-Token für font-size (1rem fest verdrahtet), Größenskala
            14/16/18px &mdash; also gelten die Höhenmessungen aus PrimeNG 21 (37/39/42px) wieder; die Farb-Tokens und ihre
            Kontrastverhältnisse sind unverändert.
            Alle Zeilenverweise gegen die Optimus-Bundles neu ermittelt.
          </li>
          <li>
            <strong>v0.3</strong> &mdash; 24.08.2026 &mdash; Gegen PrimeNG 22.1.2 / Aura 3.0 nachgeprüft: Deaktivierte
            Segmente verlassen jetzt die Tab-Reihenfolge (ToggleButton fällt auf tabindex &minus;1 zurück &mdash; die
            Stolperfalle aus 21, dass sie fokussierbar bleiben, ist behoben, die Hälfte ohne <code>aria-disabled</code>
            bleibt); jedes Segment bekommt <code>ariaLabel</code> = sein Options-Label; <code>unselectable</code> ist ein
            eigener Input, der <code>allowEmpty</code> überschreibt; Content-Padding auf 2/10px verkleinert und die
            Schriftskala eine Stufe heruntergesetzt (14px Standard); Höhen aus den Tokens neu abgeleitet; Zeilenverweise
            neu ermittelt. Die Farbmessungen aus 21 gelten weiter &mdash; die Farb-Tokens von togglebutton sind
            unverändert.
          </li>
          <li>
            <strong>v0.2</strong> &mdash; 20.08.2026 &mdash; Zusammenfassung zum Stand bei WCAG 2.2 im Design-Tab ergänzt:
            gemessene Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht
            beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> &mdash; 30.07.2026 &mdash; Erster Guide: Beispiele, die Grenze bei der Control-Wahl
            gegenüber Tabs / Switch / Radio / Select, Design-Tokens und Kontrast, Stolperfallen bei der Entwicklung, i18n
            und die kanonische Agent-Doku.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class SelectButtonArticleDeComponent extends SelectButtonArticleComponent {
  // --- Option sets (labels German, values unchanged) -------------------------
  override readonly periodOptions = [
    { label: 'Tag', value: 'day' },
    { label: 'Woche', value: 'week' },
    { label: 'Monat', value: 'month' },
  ];
  override readonly densityOptions = [
    { label: 'Kompakt', value: 'compact' },
    { label: 'Gemütlich', value: 'cozy' },
    { label: 'Geräumig', value: 'roomy' },
  ];
  override readonly dayOptions = [
    { label: 'Mo', value: 'mon' },
    { label: 'Di', value: 'tue' },
    { label: 'Mi', value: 'wed' },
    { label: 'Do', value: 'thu' },
    { label: 'Fr', value: 'fri' },
  ];
  override readonly alignOptions = [
    { label: 'Links', value: 'left', icon: 'pi pi-align-left' },
    { label: 'Mitte', value: 'center', icon: 'pi pi-align-center' },
    { label: 'Rechts', value: 'right', icon: 'pi pi-align-right' },
  ];
  override readonly planOptions = [
    { label: 'Basis', value: 'basic', soldOut: false },
    { label: 'Pro', value: 'pro', soldOut: false },
    { label: 'Legacy', value: 'legacy', soldOut: true },
  ];
  override readonly sectionOptions = [
    { label: 'Übersicht', value: 'overview' },
    { label: 'Aktivität', value: 'activity' },
    { label: 'Einstellungen', value: 'settings' },
  ];
  override readonly onOffOptions = [
    { label: 'An', value: true },
    { label: 'Aus', value: false },
  ];
  override readonly countryOptions = [
    { label: 'Deutschland', value: 'de' },
    { label: 'Österreich', value: 'at' },
    { label: 'Schweiz', value: 'ch' },
    { label: 'Niederlande', value: 'nl' },
    { label: 'Luxemburg', value: 'lu' },
    { label: 'Liechtenstein', value: 'li' },
  ];

  override readonly daysReadout = computed(() => {
    const v = this.days();
    return v.length ? v.join(', ') : '(keine)';
  });

  // --- Playground ------------------------------------------------------------
  override readonly countOptions = [
    { label: '2 Optionen', value: 2 },
    { label: '3 Optionen', value: 3 },
    { label: '4 Optionen', value: 4 },
  ];
  override readonly sizeOptions = [
    { label: 'Klein', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Groß', value: 'large' },
  ];

  protected override readonly pgPool = [
    { label: 'Tag', value: 'day' },
    { label: 'Woche', value: 'week' },
    { label: 'Monat', value: 'month' },
    { label: 'Jahr', value: 'year' },
  ];

  // --- Examples: German title and note, English id and code -----------------
  override readonly examples: SelectButtonArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLES_DE[ex.id],
  }));

  /** The measured values of the English article, with the prose around them in German. */
  override readonly m: SelectButtonArticleComponent['m'] = {
    pressedContrastLight: '4,42–15,25:1',
    pressedContrastDark: '5,44–14,39:1',
    labelContrastLight: '6,65:1',
    labelContrastDark: '5,91:1',
    pressedLabelLight: '5,18–17,85:1',
    pressedLabelDark: '6,07–16,06:1',
    hSmall: '≈37px',
    hDefault: '≈39px',
    hLarge: '≈42px',
    focusOutline: '2px solid, im Akzent-Vordergrund (--primary-color-fg)',
    focusOffset: '2px',
    devImport: this.m.devImport,
    itemSnippet: this.m.itemSnippet,
    formSnippet: this.m.formSnippet,
    i18nSnippet: this.m.i18nSnippet,
    testSnippet: this.m.testSnippet,
  };
}
