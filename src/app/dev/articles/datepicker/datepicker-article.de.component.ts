import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DatePickerArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './datepicker-article.component';

/**
 * German twin of the DatePicker guide (ADR-0018).
 *
 * Extends the English canonical article, so state, measured values and code
 * snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs datepicker`).
 */
@Component({
  selector: 'app-datepicker-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'datepicker'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Control, zwei Eingabewege, die übereinstimmen müssen: ein Textfeld, in das man tippen kann, und ein
          Kalender-Dialog, durch den man mit den Pfeiltasten geht. Alles hier unten ist dieselbe Komponente mit anderen
          Props — was sich ändert, ist, welche der beiden Hälften erreichbar ist und was der Kalender über sich selbst
          preisgibt.
        </p>

        <h3>Die alltägliche Form</h3>
        <div class="stage stage--col">
          <label class="field-label" for="dp-basic">Abreisedatum</label>
          <p-datepicker inputId="dp-basic" [showIcon]="true" [(ngModel)]="single" />
          <span class="hint">{{ m.basicHint }}</span>
        </div>

        <h3>Auswahlmodi</h3>
        <div class="stage stage--row stage--wrap">
          <div class="col">
            <label class="field-label" for="dp-range">Zeitraum</label>
            <p-datepicker inputId="dp-range" selectionMode="range" [showIcon]="true" [(ngModel)]="range" />
          </div>
          <div class="col">
            <label class="field-label" for="dp-multi">Mehrere</label>
            <p-datepicker inputId="dp-multi" selectionMode="multiple" [showIcon]="true" [(ngModel)]="multi" />
          </div>
          <div class="col">
            <label class="field-label" for="dp-month">Nur Monat</label>
            <p-datepicker inputId="dp-month" view="month" dateFormat="mm/yy" [showIcon]="true" [(ngModel)]="month" />
          </div>
        </div>
        <p class="src-note">
          <code>selectionMode</code> steht standardmäßig auf <code>'single'</code> und <code>view</code> auf
          <code>'date'</code> (<code>openng-optimus-ui-datepicker.mjs:492</code>, <code>:954</code>); die Monatsansicht
          ersetzt das Raster durch eine Liste von Monatsnamen (<code>:3506-3513</code>).
        </p>

        <h3>Inline und die Button-Leiste</h3>
        <div class="stage stage--row stage--wrap">
          <p-datepicker [inline]="true" [showButtonBar]="true" [(ngModel)]="inlineValue" />
          <p class="note">{{ m.inlineNote }}</p>
        </div>
        <p class="src-note">
          Inline entfallen <code>role="dialog"</code> und <code>aria-modal</code>; beide sind hinter
          <code>inline ? null : …</code> gebunden (<code>openng-optimus-ui-datepicker.mjs:3374-3375</code>).
        </p>

        <h3>Mit Zeitauswahl</h3>
        <div class="stage stage--col">
          <label class="field-label" for="dp-time">Termin</label>
          <p-datepicker
            inputId="dp-time"
            [showTime]="true"
            [showSeconds]="false"
            hourFormat="24"
            [showIcon]="true"
            [(ngModel)]="withTime"
          />
        </div>
        <p class="src-note">
          <code>hourFormat</code> steht auf <code>'24'</code> (<code>openng-optimus-ui-datepicker.mjs:846</code>); der
          Am/Pm-Umschalter wird nur unter <code>hourFormat="12"</code> gerendert und benennt sich über die
          Übersetzungsschlüssel <code>am</code>/<code
            >pm</code
          >
          (<code>:3683</code>, <code>:3701</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Die Entscheidung lautet selten „Kalender oder kein Kalender“. Es geht darum, ob der Wert ein Punkt in einem
          Kalender ist, über den jemand räumlich nachdenkt, oder eine Zahl, die er schon kennt — und im zweiten Fall
          sind drei schlichte Felder schneller als jedes Raster.
        </p>

        <h3>Welches Control für welches Datum</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Der Wert</th>
                <th>Control</th>
                <th>Warum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ein Tag, gewählt im Verhältnis zu anderen Tagen — „der Freitag nach dem nächsten“</td>
                <td><code>p-datepicker</code></td>
                <td>Das Raster zeigt die Lage der Wochentage und die Nachbartage; ein Textfeld tut das nicht.</td>
              </tr>
              <tr>
                <td>Ein Datum, das die Person auswendig kennt — ein Geburtsdatum</td>
                <td>Drei schlichte Felder oder ein maskiertes Texteingabefeld</td>
                <td>Acht Ziffern zu tippen schlägt, einen Kalender vierhundert Monate zurückzublättern.</td>
              </tr>
              <tr>
                <td>Ein Monat oder ein Quartal</td>
                <td><code>p-datepicker</code> mit <code>view="month"</code></td>
                <td>Das Tagesraster wird nie gezeigt, der zusätzliche Schritt entfällt.</td>
              </tr>
              <tr>
                <td>Ein Anfang und ein Ende</td>
                <td>Ein <code>p-datepicker</code> mit <code>selectionMode="range"</code></td>
                <td>Ein Overlay hält beide Enden vergleichbar; zwei Felder lassen sie einander widersprechen.</td>
              </tr>
              <tr>
                <td>Nur eine Uhrzeit</td>
                <td><code>p-datepicker</code> mit <code>[timeOnly]="true"</code></td>
                <td>Der Kalender-Container wird übersprungen, nur der Spinner-Block wird gerendert.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Modi und Ansichten sind Inputs derselben Komponente: <code>selectionMode</code>, <code>view</code>,
          <code>timeOnly</code> (<code>openng-optimus-ui-datepicker.mjs:492</code>, <code>:685-691</code>,
          <code>:442</code>).
        </p>

        <h3>Benenne das Feld und gib dem Kalender eine Tastatur-Tür</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Placeholder als Name</span>
            <div class="dd__stage">
              <p-datepicker placeholder="mm/dd/yy" />
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein sichtbares Label, über <code>inputId</code> gebunden, plus ein echter Trigger</span>
            <div class="dd__stage">
              <label class="field-label" for="dp-dd-good">Rechnungsdatum</label>
              <p-datepicker inputId="dp-dd-good" [showIcon]="true" iconDisplay="button" />
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Der Trigger ist ein echtes <code>&lt;input type="text"&gt;</code> mit
          <code>[attr.id]="inputId"</code> (<code>openng-optimus-ui-datepicker.mjs:3287-3295</code>), deshalb bindet
          <code>&lt;label for&gt;</code> daran; die Button-Variante ist der Zweig unter
          <code>iconDisplay === 'button'</code> (<code>:3332-3350</code>).
        </p>

        <h3>Das Feld leeren</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — <code>showClear</code> als einziger Weg zurück zum leeren Feld</span>
            <div class="dd__stage">
              <p-datepicker [showClear]="true" [(ngModel)]="clearDemo" />
            </div>
            <p class="dd__why">{{ m.ddClearBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die Button-Leiste, deren Clear ein echter Button ist (inline gezeigt)</span>
            <div class="dd__stage">
              <p-datepicker [showButtonBar]="true" [inline]="true" [(ngModel)]="clearDemo2" />
            </div>
            <p class="dd__why">{{ m.ddClearGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Die Leeren-Schaltfläche ist ein <code>&lt;svg&gt;</code> mit <code>(click)="clear()"</code>, ohne Tabindex,
          Rolle oder Label (<code>openng-optimus-ui-datepicker.mjs:3326-3331</code>); die Button-Leiste rendert einen
          <code>p-button</code>, dessen Label aus dem Schlüssel <code>clear</code> kommt (<code>:3712-3743</code>).
        </p>

        <h3>Kommentierter Quelltext — die Form zum Kopieren</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          In einem Control treffen zwei visuelle Systeme aufeinander. Das Textfeld malt das Kit mit seinem eigenen
          Stylesheet, weil Aura Formularfelder ohne Fokus-Ring lässt; das Kalender-Panel malt Aura — die eine
          <code>.p-datepicker</code>-Token-Regel des Kits färbt nur das Icon im Feld um. Der Fokus ist die Ausnahme: Der
          eine Ring des Kits erreicht jeden fokussierbaren Teil, Feld und Panel gleichermaßen.
        </p>

        <h3>Aura-Token, aus denen das Panel gebaut ist</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Standardwerte der Datepicker-Token, Aura-Preset
            </caption>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wert</th>
                <th>Was es bemisst</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>date.width</code> / <code>date.height</code></td>
                <td>{{ m.dateBox }}</td>
                <td>Die Tageszelle — das Zeigerziel</td>
              </tr>
              <tr>
                <td><code>date.borderRadius</code></td>
                <td>{{ m.dateRadius }}</td>
                <td>Der runde Tages-Chip</td>
              </tr>
              <tr>
                <td><code>date.selectedBackground</code></td>
                <td>{{ m.dateSelectedBg }}</td>
                <td>Der gewählte Tag</td>
              </tr>
              <tr>
                <td><code>today.background</code></td>
                <td>{{ m.todayBg }}</td>
                <td>Die Füllung für heute, hell / dunkel</td>
              </tr>
              <tr>
                <td><code>dropdown.width</code></td>
                <td>{{ m.dropdownWidth }}</td>
                <td>Der Trigger-Button, Standard / sm / lg</td>
              </tr>
              <tr>
                <td><code>panel.shadow</code> / <code>panel.padding</code></td>
                <td>{{ m.panelChain }}</td>
                <td>Das Overlay selbst</td>
              </tr>
              <tr>
                <td><code>panel.borderRadius</code></td>
                <td>{{ m.panelRadius }}</td>
                <td>Die Ecken des Overlays — sie folgen dem visuellen Stil; der Tages-Chip nicht</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und -Werte aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/datepicker/index.mjs</code>; die Regeln, die sie verwenden, aus
          <code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs</code>. Jeder visuelle Stil setzt die
          Radius-Primitive in seinen <code>presetOverrides</code> (<code>src/app/services/ui-styles.ts</code>), über die
          <code>&#123;content.border.radius&#125;</code> aufgelöst wird.
        </p>

        <h3>Ein Fokus-Ring für das ganze Control</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fokussiertes Element</th>
                <th>Nur Aura</th>
                <th>Dieses Kit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Das Textfeld</td>
                <td>{{ m.ringNone }}</td>
                <td>{{ m.ringInput }} — <code>.p-inputtext:focus-visible</code></td>
              </tr>
              <tr>
                <td>Eine Tages-, Monats- oder Jahreszelle</td>
                <td>{{ m.ringDay }} (<code>datepicker.date.focusRing</code> → globales <code>focus.ring</code>)</td>
                <td>
                  {{ m.ringInput }} — <code>.p-datepicker-day</code>, <code>-month</code>, <code>-year:focus-visible</code>
                </td>
              </tr>
              <tr>
                <td>Der Trigger-Button (<code>iconDisplay="button"</code>), Monats- und Jahresauswahl</td>
                <td>{{ m.ringDay }} (<code>datepicker.dropdown.focusRing</code>, dieselbe globale Gruppe)</td>
                <td>{{ m.ringInput }} — <code>.p-datepicker-dropdown</code>, <code>-select-month</code>, <code>-select-year</code></td>
              </tr>
              <tr>
                <td>Zurück-/Weiter-Buttons und die Buttons der Button-Leiste im Panel</td>
                <td>{{ m.ringDay }}</td>
                <td>{{ m.ringInput }} — es sind <code>p-button</code>s (<code>.p-button:focus-visible</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Auras Tagesring setzt <code>.p-datepicker-day:focus-visible</code>
          (<code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs:242-246</code>); die globale Gruppe ist 1px solid
          <code>&#123;primary.color&#125;</code> mit 2px Abstand
          (<code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>), während die gemeinsame Gruppe
          <code>form.field.focusRing</code> auf null gesetzt ist. Die eine Ring-Regel des Kits in <code>src/styles.scss</code>
          listet jeden Teil oben auf, sodass das ganze Control einen Ring zeigt, geprüft als „focus ring“ in
          <code>docs/generated/CONTRAST.MD</code> (3,88:1 und mehr auf den Seitenflächen).
        </p>
        <p>{{ m.ringVerify }}</p>

        <h3>Heute ist nur durch die Füllung markiert</h3>
        <p>{{ m.todayProse }}</p>
        <p class="src-note">
          <code>.p-datepicker-today &gt; .p-datepicker-day</code> setzt nur <code>background</code> und
          <code>color</code> (<code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs:258-261</code>); nirgends in
          <code>openng-optimus-ui-datepicker.mjs</code> kommt <code>aria-current</code> vor.
        </p>

        <h3>Kontrast</h3>
        <p>{{ m.contrastProse }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code>, <code>werkbund</code>-Zeilen unter <code>form field text</code>:
          <code>inputtext.color</code> auf <code>inputtext.background</code> hat 10,35:1 hell / 13,32:1 dunkel, und
          <code>inputtext.placeholder.color</code> auf demselben Hintergrund 4,76:1 hell / 5,91:1 dunkel (SC 1.4.3
          verlangt 4,5:1); unter <code>form field edge</code> hat die Kontur des Stils auf <code>inputtext.background</code>
          18,73:1 / 13,32:1 (SC 1.4.11 verlangt 3:1). Die anderen drei Stile haben dieselben Zeilen. Ein ungültiges Feld
          bekommt die Kante <code>--semantic-red-fg</code> des Kits (<code>inputtext.invalid.border.color</code>, 6,47:1
          hell / 7,93:1 dunkel). Das Icon im Feld (<code>iconDisplay="input"</code>) bekommt
          <code>--text-color-secondary</code> aus der <code>.p-datepicker</code>-Regel des Kits — den Wert, den die Zeile
          <code>password.icon.color</code> auf demselben Feld misst, 7,78:1 / 5,91:1 („form field icon“; Auras
          surface.400 hatte 2,56:1 auf Weiß). Die Kante des Trigger-Buttons ist in jedem Zustand das
          <code>--control-border</code> des Kits (Auras slate.300 hatte 1,48:1 auf Weiß):
          <code>datepicker.dropdown.border.color</code> 3,74&#8211;5,51:1 auf Grund, Karte und eigener Füllung („form
          field edge“), und sein Icon <code>datepicker.dropdown.color</code> 6,92:1 hell / 10,08:1 dunkel („form field
          icon“). Kein Paar des Kalender-Panels ist im Gate.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>{{ m.responsiveProse }}</p>
        <p class="src-note">
          <code>createResponsiveStyle()</code> kehrt zurück, ohne etwas zu tun, außer bei
          <code>numberOfMonths &gt; 1 &amp;&amp; responsiveOptions</code>
          (<code>openng-optimus-ui-datepicker.mjs:3136</code>); die Media Queries, die es schreibt, blenden nur
          überzählige Monatsgruppen aus. <code>touchUI</code> ist der getrennte Opt-in, der den Positionierungszweig ganz
          überspringt und eine bildschirmfüllende modale Maske hinzufügt (<code>:2743-2746</code>, <code>:2769-2775</code>);
          weder die Masken-Regel (<code>&#64;openng/optimus-ui-styles/dist/base/index.mjs:57-65</code>) noch die
          Datepicker-Styles enthalten eine Regel, die das Panel zentriert. Das Inline-Panel ist die eine ausgelieferte
          Ausnahme von der Aussage zur Breite: <code>.p-datepicker-panel-inline</code> setzt
          <code>overflow-x: auto</code>
          (<code>&#64;openng/optimus-ui-styles/dist/datepicker/index.mjs:99-103</code>), während das Overlay-Panel
          <code>width: auto</code> und keine Overflow-Regel hat (<code>:89-97</code>).
        </p>

        <h3>Bewegung</h3>
        <p>{{ m.motionProse }}</p>
        <p class="src-note">
          Das Panel steckt in <code>p-motion</code> (<code>openng-optimus-ui-datepicker.mjs:3359</code>);
          <code>&#64;openng/optimus-ui-motion</code> 2.0.2 liest die berechneten Transitions- und Animationsdauern und
          hat keinen eigenen Reduced-Motion-Zweig. Der globale <code>prefers-reduced-motion</code>-Block des Kits in
          <code>src/styles.scss</code> setzt beide auf 0.01ms statt auf none, damit das <code>animationend</code>, auf das
          die <code>touchUI</code>-Maske wartet (<code>:2786-2787</code>), trotzdem feuert.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Die Komponente ist ein <code>ControlValueAccessor</code> über ein <code>Date</code>, ein <code>Date[]</code>
          oder einen String, abhängig von zwei voneinander unabhängigen Props. Die meisten Überraschungen sitzen dort, wo
          ein Wert des Autors und ein Wert aus der Config aufeinandertreffen.
        </p>

        <h3>Tastatur im Raster</h3>
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
                <td><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd></td>
                <td>Einen Tag / eine Woche weiter; wer über den Rand hinausgeht, blättert den Monat um</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> <kbd>Space</kbd></td>
                <td>Den fokussierten Tag auswählen</td>
              </tr>
              <tr>
                <td><kbd>PageUp</kbd> <kbd>PageDown</kbd></td>
                <td>Derselbe Tag, vorheriger / nächster Monat</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd> <kbd>End</kbd></td>
                <td>Erster / letzter Tag des angezeigten Monats</td>
              </tr>
              <tr>
                <td><kbd>Esc</kbd></td>
                <td>Das Panel schließen und den Fokus ins Feld zurückgeben</td>
              </tr>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>
                  Kreist im Panel, solange <code>focusTrap</code> an ist; ist es aus, schließt nur der vordere Rand das
                  Panel — Umschalt+Tab auf dem ersten Element kehrt vor <code>preventDefault()</code> zurück, sodass der
                  Fokus ein Panel verlässt, das offen bleibt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das alles ist ein einziger Switch in <code>onDateCellKeydown</code>
          (<code>openng-optimus-ui-datepicker.mjs:1831-1990</code>); die Aufteilung bei Tab ist der
          <code>focusTrap</code>-Zweig von <code>trapFocus</code> (<code>:2274-2324</code>), der
          <code>hideOverlay()</code> nur in seinem Zweig für den vorderen Rand aufruft (<code>:2314</code>) und wenn der
          Fokus gar nicht im Panel ist (<code>:2289</code>); der hintere Rand kehrt zurück, ohne zu schließen
          (<code>:2291</code>). <code>focusTrap</code> steht standardmäßig auf <code>true</code> (<code>:562</code>).
        </p>

        <h3>Inputs, die weniger tun, als ihr Name verspricht</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Was tatsächlich passiert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>locale</code></td>
                <td>{{ m.deadLocale }}</td>
              </tr>
              <tr>
                <td><code>[firstDayOfWeek]="0"</code></td>
                <td>{{ m.deadFirstDay }}</td>
              </tr>
              <tr>
                <td>Programmatische Eingabe oder Eingabe ohne Tastatur</td>
                <td>{{ m.deadUserInput }}</td>
              </tr>
              <tr>
                <td><code>iconAriaLabel</code> ohne <code>showIcon</code></td>
                <td>{{ m.deadIconLabel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>locale</code> ist ein Getter über <code>_locale</code> ohne <code>&#64;Input</code> und ohne Zuweisung im
          Bundle (<code>openng-optimus-ui-datepicker.mjs:947</code>, <code>:959-961</code>);
          <code>getFirstDateOfWeek()</code> ist ein <code>||</code>-Fallback (<code>:2827-2828</code>);
          <code>onUserInput</code> kehrt früh zurück, solange <code>isKeydown</code> nicht gesetzt ist, und das geschieht
          nur in <code>onInputKeydown</code> (<code>:1807</code>).
        </p>

        <h3>Das Panel per Tastatur öffnen</h3>
        <p>{{ m.openProse }}</p>
        <pre class="code-block"><code>{{ openSnippet }}</code></pre>
        <p class="src-note">
          <code>onInputFocus</code> öffnet nur unter <code>showOnFocus</code>, das standardmäßig auf
          <code>true</code> steht (<code>openng-optimus-ui-datepicker.mjs:467</code>); der ArrowDown-Zweig von
          <code>onInputKeydown</code> ist durch <code>this.contentViewChild</code> abgesichert (<code>:1808</code>), das
          erst existiert, wenn das Overlay gerendert wurde.
        </p>

        <h3>Form des Werts</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Props</th>
                <th>Wert im Model</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard</td>
                <td><code>Date</code></td>
              </tr>
              <tr>
                <td><code>selectionMode="multiple"</code></td>
                <td><code>Date[]</code>, begrenzt durch <code>maxDateCount</code></td>
              </tr>
              <tr>
                <td><code>selectionMode="range"</code></td>
                <td><code>[start, end]</code> — der zweite Eintrag bleibt <code>null</code>, bis der Zeitraum geschlossen ist</td>
              </tr>
              <tr>
                <td><code>dataType="string"</code></td>
                <td>Der formatierte String, kein <code>Date</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>dataType</code> steht auf <code>'date'</code> und <code>selectionMode</code> auf
          <code>'single'</code> (<code>openng-optimus-ui-datepicker.mjs:487</code>, <code>:492</code>);
          <code>isValidSelection</code> akzeptiert einen Zeitraum der Länge 1 und verlangt sonst
          <code>value[1] &gt;= value[0]</code>.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>Ein sichtbares Label, gebunden mit <code>&lt;label for&gt;</code> + <code>inputId</code> (hier funktioniert das).</li>
          <li>Ein per Tastatur erreichbarer Weg zum Öffnen: Lass <code>showOnFocus</code> an oder liefere den Trigger-Button mit.</li>
          <li>
            Verlass dich nie allein auf das <code>showClear</code>-Icon — ergänze die Button-Leiste oder einen eigenen Button mit Label.
          </li>
          <li>Nenn das erwartete Format neben dem Feld; der Placeholder ersetzt das nicht.</li>
          <li>Schick das Datumsvokabular bei jedem Sprachwechsel durch <code>Optimus.setTranslation</code>.</li>
          <li>Prüf den angesagten Tag: Der Name der Zelle ist die nackte Zahl, der Monat muss also von woanders kommen.</li>
          <li>Prüf unter <code>appendTo="body"</code>, dass das Panel noch im Fokusbereich des Dialogs liegt.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Fast nichts in diesem Control übersetzt dein Template. Monatsnamen, Wochentagskürzel, die beiden Buttons der
          Leiste und jedes Navigations-Label werden beim Rendern aus dem Optimus-Config-Objekt gelesen — und die
          bestehende Sprach-Synchronisierung des Kits fasst keinen davon an.
        </p>

        <h3>Woher jeder String kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Quelle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>placeholder</code>, <code>ariaLabel</code>, <code>iconAriaLabel</code></td>
                <td>Dein Template — binde sie an Übersetzungsschlüssel</td>
              </tr>
              <tr>
                <td>Wochentagsköpfe, Monatsnamen, Monatskürzel</td>
                <td>Optimus-Config: <code>dayNamesMin</code>, <code>monthNames</code>, <code>monthNamesShort</code></td>
              </tr>
              <tr>
                <td>Name des Panels, Navigations-Buttons, Kopf der Wochenspalte</td>
                <td>
                  <code>chooseDate</code>, <code>prevMonth</code>/<code>nextMonth</code>,
                  <code>prevYear</code>/<code>nextYear</code>, <code>prevDecade</code>/<code>nextDecade</code>,
                  <code>weekHeader</code>
                </td>
              </tr>
              <tr>
                <td>Button-Leiste</td>
                <td><code>today</code>, <code>clear</code></td>
              </tr>
              <tr>
                <td>Labels des Zeit-Spinners und Am/Pm</td>
                <td><code>prevHour</code>…<code>nextSecond</code>, <code>am</code>, <code>pm</code></td>
              </tr>
              <tr>
                <td>Datumsformat und Wochenbeginn</td>
                <td><code>dateFormat</code>, <code>firstDayOfWeek</code> — aus der Config, außer du überschreibst den Input</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Standardwerte für jeden Schlüssel oben liegen auf der obersten Ebene des Übersetzungsobjekts der Config
          (<code>openng-optimus-ui-config.mjs:138-163</code>): englische Namen, <code>dateFormat: 'mm/dd/yy'</code>,
          <code>firstDayOfWeek: 0</code>. Die Komponente liest sie über <code>getTranslation(…)</code> in ihrem
          Template (<code>openng-optimus-ui-datepicker.mjs:3463</code>, <code>:3719</code>, <code>:3732</code>) und in
          den Gettern <code>prevIconAriaLabel</code>/<code>nextIconAriaLabel</code> (<code>:965-970</code>).
        </p>

        <h3>Die Lücke, die du selbst schließen musst</h3>
        <p>{{ m.i18nGapProse }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> führt eine Ebene tief zusammen und schickt dann das ganze Objekt durch
          <code>translationSource</code> (<code>openng-optimus-ui-config.mjs:246-249</code>); die Komponente abonniert
          dieses Observable in <code>onInit</code> und baut ihre Wochentagszeile neu
          (<code>openng-optimus-ui-datepicker.mjs:992-995</code>). Die eigene Sync-Methode des Kits in
          <code>optimus-a11y.service.ts</code> ist das Muster, das du erweiterst, nicht ersetzt; die Locale kommt aus
          <code>dateLocaleFor()</code> in <code>src/app/utils/date-locale.ts</code>, derselben Zuordnung, mit der jedes
          andere Datum im Kit formatiert wird.
        </p>

        <h3>Zwei Dinge, die ein Sprachwechsel nicht von selbst richtet</h3>
        <ul class="checklist">
          <li>{{ m.i18nFormatNote }}</li>
          <li>{{ m.i18nWeekNote }}</li>
        </ul>
        <p class="src-note">
          Beides sind <code>||</code>-Fallbacks: <code>getDateFormat()</code> und <code>getFirstDateOfWeek()</code>
          (<code>openng-optimus-ui-datepicker.mjs:2824-2828</code>). In der Format-Grammatik ist <code>yy</code> das
          vierstellige Jahr (<code>:2882-2883</code>); der Wochen-Builder liest <code>dayNamesMin</code>
          (<code>:1074-1082</code>).
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            v1.3 — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Kante des Trigger-Buttons ist das
            <code>--control-border</code> des Kits, und sie und das Trigger-Icon sind im Gate („form field edge“, „form field icon“).
          </li>
          <li>
            v1.2 — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Icon im Feld ist das
            <code>--text-color-secondary</code> des Kits, die ungültige Kante <code>--semantic-red-fg</code>, und der eine
            2px-Ring des Kits deckt jetzt Feld, Trigger, Zellen, Auswahlen und Panel-Buttons ab — aus der Tabelle „zwei Ringe“
            wurde „Nur Aura vs. dieses Kit“. Die Standardkante des Triggers ist als nicht geprüft benannt.
          </li>
          <li>
            v1.1 — 23.09.2026 — Kontrast zitiert die Zeilen des Felds im Kompilat; das Datumsvokabular folgt den
            Datums-Locales des Kits (en-US, de-DE); Panel-Radius je visuellem Stil; Bewegung unter Reduced Motion.
          </li>
          <li>v1.0 — 06.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DatePickerArticleDeComponent extends DatePickerArticleComponent {
  override readonly m = {
    basicHint:
      'Das Feld nimmt Tippen an und der Kalender Klicken; beide schreiben denselben Wert ins Model, und das Format, auf das sie sich einigen, kommt aus der Config, nicht aus der Locale des Browsers.',
    inlineNote:
      'Inline rendert dasselbe Panel ohne Overlay, es ist also weder ein Dialog noch modal — nichts hält den Fokus fest, und nichts schließt mit Escape von außerhalb des Rasters.',

    dateBox: '2rem / 2rem (32px), Padding 0.25rem',
    dateRadius: '50% — ein runder Chip',
    dateSelectedBg: '{primary.color}, Text {primary.contrast.color}',
    todayBg: '{surface.200} hell / {surface.700} dunkel',
    dropdownWidth: '2.5rem Standard, 2rem sm, 3rem lg',
    panelChain: '{overlay.popover.shadow} / {overlay.popover.padding}',
    panelRadius:
      '{content.border.radius} → {border.radius.md}: 0 in werkbund, 12px lernwerkstatt, 10px skizzenbuch, 2px blaupause; der Tages-Chip behält sein festes 50%',

    ringInput: '2px solid var(--primary-color-fg), 2px Abstand, !important',
    ringDay: '1px solid {primary.color}, 2px Abstand',
    ringNone: 'keiner — form.field.focusRing hat Breite 0, Stil none',

    ringVerify:
      'Zum Prüfen fokussiere das Feld, drück dann den Trigger und geh mit den Pfeiltasten ins Raster: Der Ring behält von Teil zu Teil seine Breite und sein Farb-Token. Außerhalb dieses Kits zeigt derselbe Weg keinen Ring am Feld und einen dünneren 1px-Ring an allem anderen.',

    todayProse:
      'Die Zelle für heute unterscheidet sich von ihren Nachbarn durch Hintergrund- und Textfarbe und durch sonst nichts — keine Kante, kein Zeichen, kein Textzusatz — und sie trägt keinen ARIA-Zustand, sodass ein Screenreader-Nutzer nicht erfährt, welcher Tag heute ist. Wenn diese Unterscheidung in deinem Formular zählt, schreib sie in den Beschreibungstext des Felds, statt dich auf die Füllung zu verlassen.',

    contrastProse:
      'Das Textfeld ist ein pInputText, also misst das Kompilat es: Text, Placeholder und Kante bestehen in jedem Stil und beiden Modi, ebenso Kante und Icon des Trigger-Buttons. Das Kalender-Panel hat dort keine Zeile — weder der Tages-Chip noch der gewählte Tag noch die Füllung für heute. Was die Kriterien verlangen, bleibt gleich: Tageszahlen sind Text in normaler Größe und brauchen 4,5:1 nach SC 1.4.3, und der gewählte Chip ist das, was den aktuellen Zustand kenntlich macht, also braucht seine Kante gegen das Panel 3:1 nach SC 1.4.11. Miss diese beiden Paare in deinem eigenen Build, bevor du eine eigene Primärfarbe auslieferst.',
    motionProse:
      'Das Panel blendet und skaliert sich über den Motion-Wrapper der Bibliothek ein und aus, der sich nach den berechneten CSS-Dauern richtet. Unter prefers-reduced-motion kürzt das Stylesheet des Kits diese Dauern auf fast null, sodass das Panel sofort erscheint und verschwindet, ohne zusätzliche Arbeit an der Aufrufstelle. Bewegung, die du selbst rund um den Picker skriptest — etwa ein Feld nach einem Validierungsfehler ins Bild scrollen —, fragt scrollBehavior() oder prefersReducedMotion() aus src/app/utils/reduced-motion.ts, statt smooth fest zu verdrahten.',

    responsiveProse:
      'Ein Overlay-Panel mit einem Monat hat kein eigenes responsives Verhalten: Es behält bei jedem Viewport seine eigene Breite und bleibt am Feld verankert, sodass ein Picker mit zwei Monaten auf einem 360px breiten Bildschirm seitlich überläuft, statt umzubrechen. Das Inline-Panel ist die Ausnahme — es scrollt von selbst horizontal. Darüber hinaus gibt es zwei Schalter, und beide musst du ausdrücklich anfordern: responsiveOptions, das nur überzählige Monatsgruppen unterhalb der Breakpoints ausblendet, die du angibst, und bei einem einzelnen Monat gar nichts tut, und touchUI, das das Panel nicht mehr am Feld positioniert und eine bildschirmfüllende Maske dahinterlegt, sodass die Lage des Panels deinem eigenen CSS überlassen bleibt. Es gibt keinen eingebauten Breakpoint, auf den du dich stützen kannst — auf Viewports in Smartphone-Größe nimm lieber touchUI oder numberOfMonths von 1, und wähl die Schwelle selbst.',

    deadLocale:
      'Nichts. Es ist ein schreibgeschützter Getter über ein privates Feld, das die Komponente nie zuweist und nie als Input anbietet, also liest er immer undefined; diese Komponente hat kein locale-Prop.',
    deadFirstDay:
      'Fällt auf den Wert aus der Config zurück. Die Abfrage ist ein ||-Fallback, und 0 ist falsy — ein Binding von 0, das Sonntag erzwingen soll, kann also eine Config, die 1 sagt, nicht überschreiben. Ändere stattdessen den Wert in der Config. Auch ein Binding von 7 ist kein Ausweg: Der Wochen-Builder indiziert mit dem Wert direkt ein Label-Array aus sieben Einträgen, sodass eine 7 jeden Spaltenkopf undefined lässt.',
    deadUserInput:
      'Kommt nie im Model an. Der Input-Handler kehrt zurück, solange nicht zuerst ein Keydown kam, also lassen ein Einfügen per Rechtsklick, ein Drag-and-drop oder ein Autofill des Browsers das Feld mit Text zurück, den der Formularwert nicht hat.',
    deadIconLabel:
      'Es wird nichts gerendert, das es tragen könnte. Das Label landet nur auf dem Trigger-Button, und den gibt es nur, wenn showIcon gesetzt ist und iconDisplay auf button steht.',

    openProse:
      'Es gibt keinen Handler für Alt+ArrowDown, und ein einfaches ArrowDown führt nur in ein Overlay, das schon offen ist. Der ganze Tastaturweg in den Kalender ist also showOnFocus (standardmäßig an, öffnet das Panel in dem Moment, in dem das Feld den Fokus bekommt) oder der Trigger-Button. Wer showOnFocus abschaltet, ohne den Trigger mitzuliefern, lässt Tastaturnutzern nur das Textfeld und sonst nichts.',

    i18nGapProse:
      'Das Kit schickt bei jedem Sprachwechsel schon übersetzte Strings an Optimus, aber nur für das aria-Unterobjekt — und jeder String, den diese Komponente liest, liegt auf der obersten Ebene desselben Übersetzungsobjekts. Ein Kit, das auf Deutsch umschaltet, zeigt also weiter einen englischen Kalender, bis du diesen Push um die Datumsschlüssel erweiterst. Monats- und Wochentagsnamen brauchen überhaupt keine Übersetzungsschlüssel: Intl.DateTimeFormat erzeugt sie für die Locale, die dateLocaleFor() zurückgibt (en-US für Englisch, de-DE für Deutsch, die Easy-Varianten wie ihre Basis), dieselbe Zuordnung, mit der der Rest des Kits Datumsangaben formatiert. Nur die Labels der Buttons und der Navigation brauchen eigene Schlüssel. Die Komponente baut ihre Wochentagszeile bei der Übersetzungs-Benachrichtigung der Config neu.',

    i18nFormatNote:
      'Datumsformat: dateFormat fällt auf das ‚mm/dd/yy‘ der Config zurück. In dieser Grammatik ist yy das vierstellige Jahr, das ergibt also 07/15/2026 — den numerischen en-US-Stil des Kits. Deutsch braucht ‚dd.mm.yy‘ (15.07.2026, der de-DE-Stil); schick es mit dem übrigen Vokabular, nicht pro Feld.',
    i18nWeekNote:
      'Wochenbeginn: firstDayOfWeek fällt auf den Config-Wert 0 (Sonntag) zurück, der für en-US richtig ist; de-DE beginnt am Montag, also schick 1 für Deutsch und auf dem Rückweg wieder 0. Setz es in der Config: Der Input ist ein ||-Test und kann Sonntag nicht mehr ausdrücken, sobald die Config etwas anderes sagt.',

    ddNameBad:
      'Ein Placeholder ist kein Name: Er verschwindet, sobald ein Datum gewählt ist, er wird als Wert statt als Label angesagt, und hier ist er außerdem der einzige Hinweis auf das erwartete Format — genau in dem Moment, in dem man ihn wieder bräuchte, ist er weg.',
    ddNameGood:
      'Das Label ist ein echtes Element, gebunden an eine echte Input-ID, also übersteht es die Auswahl und bleibt im Accessibility Tree; der Trigger-Button gibt Tastaturnutzern einen zweiten, ausdrücklichen Weg in den Kalender.',
    ddClearBad:
      'Das Leeren-Zeichen ist ein schlichtes SVG mit einem Klick-Handler — kein Tab-Stopp, keine Rolle, kein zugänglicher Name —, es ist also mit der Maus erreichbar und mit sonst nichts, und ein Tastaturnutzer kann ein falsches Datum nur rückgängig machen, indem er den Text bearbeitet.',
    ddClearGood:
      'Die Button-Leiste rendert Clear und Today als echte Buttons im Panel, also sind beide im Tab-Zyklus erreichbar und beide sagen einen Namen aus der Übersetzungs-Config an; die Leiste ist in einem Overlay-Picker dieselbe, hier wird sie inline gezeigt, damit sie auf dem Bildschirm ist.',
  };
}
