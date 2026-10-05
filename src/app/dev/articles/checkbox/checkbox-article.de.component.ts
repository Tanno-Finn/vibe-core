import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CheckboxArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './checkbox-article.component';

/**
 * German twin of the Checkbox guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (`m`, the
 * option/row labels and the readouts) are German. Keep it in step with the English
 * file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs checkbox`).
 */
@Component({
  selector: 'app-checkbox-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'checkbox'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jedes Steuerelement unten ist eine echte <code>p-checkbox</code>. Anders als <code>p-select</code> rendert
          diese Komponente ein echtes <code>&lt;input type="checkbox"&gt;</code>, also funktionieren die gewohnten
          HTML-Regeln: <code>&lt;label for&gt;</code> benennt es, ein Klick aufs Label schaltet es um, und
          <kbd>Space</kbd> ist die Taste zum Auslösen. Fang im Playground an und lies dann die drei Abschnitte danach —
          Größen, Gruppen und den Zustand <code>indeterminate</code>, der nicht ist, wonach er aussieht.
        </p>

        <!-- Mini playground: live-configure a checkbox and read back the markup. -->
        <section class="pg" aria-label="Checkbox-Playground">
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
                <label for="pg-indeterminate">Unbestimmt (indeterminate)</label>
                <p-toggleswitch
                  inputId="pg-indeterminate"
                  [ngModel]="pgIndeterminate()"
                  (ngModelChange)="pgIndeterminate.set($event)"
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
                <label for="pg-invalid">Ungültig</label>
                <p-toggleswitch inputId="pg-invalid" [ngModel]="pgInvalid()" (ngModelChange)="pgInvalid.set($event)" />
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
                <label for="pg-icon">Eigenes Icon</label>
                <p-toggleswitch inputId="pg-icon" [ngModel]="pgIcon()" (ngModelChange)="pgIcon.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <div class="cb-row">
                  <p-checkbox
                    id="pg-preview-cb"
                    inputId="pg-preview"
                    [binary]="true"
                    [size]="pgSizeInput()"
                    [indeterminate]="pgIndeterminate()"
                    [disabled]="pgDisabled()"
                    [invalid]="pgInvalid()"
                    [readonly]="pgReadonly()"
                    [checkboxIcon]="pgIcon() ? 'pi pi-bolt' : undefined"
                    [ngModel]="pgValue()"
                    (ngModelChange)="pgValue.set($event)"
                  />
                  <label for="pg-preview">Schick mir die Release Notes</label>
                </div>
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

        <!-- Sizes; the Design tab carries the numbers. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Die drei Größen nebeneinander</h3>
            <button type="button" class="copy-btn" (click)="copy('sizes', sizesCode)">
              {{ copiedId() === 'sizes' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Keine der drei erreicht für sich allein die Mindestzielgröße von 24&nbsp;px — gerettet wird das erst durch das
            klickbare <code>&lt;label&gt;</code> daneben. Die Zahlen stehen im Tab Design.
          </p>
          <div class="ex__stage">
            <div class="sizes">
              <div class="cb-row">
                <p-checkbox
                  id="sz-small"
                  inputId="sz-small-in"
                  size="small"
                  [binary]="true"
                  [ngModel]="szSmall()"
                  (ngModelChange)="szSmall.set($event)"
                />
                <label for="sz-small-in">Klein</label>
              </div>
              <div class="cb-row">
                <p-checkbox
                  id="sz-normal"
                  inputId="sz-normal-in"
                  [binary]="true"
                  [ngModel]="szNormal()"
                  (ngModelChange)="szNormal.set($event)"
                />
                <label for="sz-normal-in">Standard</label>
              </div>
              <div class="cb-row">
                <p-checkbox
                  id="sz-large"
                  inputId="sz-large-in"
                  size="large"
                  [binary]="true"
                  [ngModel]="szLarge()"
                  (ngModelChange)="szLarge.set($event)"
                />
                <label for="sz-large-in">Groß</label>
              </div>
            </div>
          </div>
          <pre class="code-block"><code>{{ sizesCode }}</code></pre>
        </section>

        <!-- A group bound to ONE array. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Eine Gruppe, gebunden an ein Array</h3>
            <button type="button" class="copy-btn" (click)="copy('group-array', groupArrayCode)">
              {{ copiedId() === 'group-array' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Kein <code>[binary]</code>: Jede Box trägt einen <code>value</code>, und alle binden dasselbe Array. Optimus
            fügt den Wert für dich hinzu und entfernt ihn wieder. Erst <code>&lt;fieldset&gt;</code> +
            <code>&lt;legend&gt;</code> gibt den vier Boxen einen gemeinsamen Namen.
          </p>
          <div class="ex__stage">
            <fieldset class="cb-group" id="ex-channels">
              <legend>Benachrichtige mich über</legend>
              @for (ch of channels; track ch.value) {
                <div class="cb-row">
                  <p-checkbox
                    [inputId]="'ch-' + ch.value"
                    [value]="ch.value"
                    [ngModel]="exChannels()"
                    (ngModelChange)="exChannels.set($event)"
                  />
                  <label [for]="'ch-' + ch.value">{{ ch.label }}</label>
                </div>
              }
            </fieldset>
          </div>
          <p class="ex__note">
            Modell gerade: <code>{{ exChannelsText() }}</code>
          </p>
          <pre class="code-block"><code>{{ groupArrayCode }}</code></pre>
        </section>

        <!-- A group of independent booleans. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">…oder eine Gruppe unabhängiger Booleans</h3>
            <button type="button" class="copy-btn" (click)="copy('group-bool', groupBoolCode)">
              {{ copiedId() === 'group-bool' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Gleiches Aussehen, anderes Modell. Nimm das, wenn die Antworten keine Menge bilden: wenn jedes Flag seine
            eigene Bedeutung, seinen eigenen Standardwert und sein eigenes Ziel im Payload hat.
          </p>
          <div class="ex__stage">
            <fieldset class="cb-group">
              <legend>Konto</legend>
              <div class="cb-row">
                <p-checkbox
                  inputId="bl-terms"
                  [binary]="true"
                  [ngModel]="blTerms()"
                  (ngModelChange)="blTerms.set($event)"
                />
                <label for="bl-terms">Ich akzeptiere die Nutzungsbedingungen</label>
              </div>
              <div class="cb-row">
                <p-checkbox
                  inputId="bl-public"
                  [binary]="true"
                  [ngModel]="blPublic()"
                  (ngModelChange)="blPublic.set($event)"
                />
                <label for="bl-public">Mein Profil öffentlich machen</label>
              </div>
            </fieldset>
          </div>
          <pre class="code-block"><code>{{ groupBoolCode }}</code></pre>
        </section>

        <!-- Indeterminate: the parent/child case. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Indeterminate: die Eltern-Box einer teilweise angehakten Menge</h3>
            <button type="button" class="copy-btn" (click)="copy('indeterminate', indeterminateCode)">
              {{ copiedId() === 'indeterminate' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Der eine ehrliche Einsatz von <code>indeterminate</code>: eine „Alle auswählen“-Box, deren Kinder sich
            uneinig sind. Hak ein Kind an und beobachte die Eltern-Box. Lies danach den Tab Entwicklung, denn was du
            siehst, ist <strong>nicht</strong> das, was ein Screenreader vorliest.
          </p>
          <div class="ex__stage">
            <fieldset class="cb-group">
              <legend>Analytics-Ereignisse</legend>
              <div class="cb-row">
                <p-checkbox
                  inputId="tree-all"
                  [binary]="true"
                  [indeterminate]="treeSome()"
                  [ngModel]="treeAll()"
                  (ngModelChange)="setAllEvents($event)"
                />
                <label for="tree-all"><strong>Alle Ereignisse</strong></label>
              </div>
              <div class="cb-children">
                @for (ev of events; track ev.key) {
                  <div class="cb-row">
                    <p-checkbox
                      [inputId]="'tree-' + ev.key"
                      [binary]="true"
                      [ngModel]="treeState()[ev.key]"
                      (ngModelChange)="setEvent(ev.key, $event)"
                    />
                    <label [for]="'tree-' + ev.key">{{ ev.label }}</label>
                  </div>
                }
              </div>
            </fieldset>
          </div>
          <p class="ex__note">
            Zustand der Eltern-Box gerade: <code>{{ treeStateText() }}</code>
          </p>
          <pre class="code-block"><code>{{ indeterminateCode }}</code></pre>
        </section>

        <!-- trueValue / falseValue. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Nicht-boolesche Werte: trueValue / falseValue</h3>
            <button type="button" class="copy-btn" (click)="copy('truefalse', trueFalseCode)">
              {{ copiedId() === 'truefalse' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Wenn das Backend <code>'yes'</code> / <code>'no'</code> statt <code>true</code> /
            <code>false</code> will, halte die Zuordnung im Template, statt sie an drei Stellen zu übersetzen.
          </p>
          <div class="ex__stage">
            <div class="cb-row">
              <p-checkbox
                inputId="tv-box"
                [binary]="true"
                trueValue="yes"
                falseValue="no"
                [ngModel]="tvValue()"
                (ngModelChange)="tvValue.set($event)"
              />
              <label for="tv-box">Den Digest abonnieren</label>
            </div>
            <p class="ex__note">
              Modell: <code>'{{ tvValue() }}'</code>
            </p>
          </div>
          <pre class="code-block"><code>{{ trueFalseCode }}</code></pre>
        </section>

        <!-- States. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Deaktiviert, ungültig, schreibgeschützt</h3>
            <button type="button" class="copy-btn" (click)="copy('states', statesCode)">
              {{ copiedId() === 'states' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Drei Zustände, die ähnlich aussehen und sich sehr unterschiedlich verhalten — vor allem
            <code>readonly</code>, das für eine Checkbox gar kein echter HTML-Zustand ist. Die Messung steht im Tab
            Entwicklung.
          </p>
          <div class="ex__stage">
            <div class="cb-row">
              <p-checkbox inputId="st-disabled" [binary]="true" [disabled]="true" [ngModel]="true" />
              <label for="st-disabled">Deaktiviert, angehakt</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="st-disabled2" [binary]="true" [disabled]="true" [ngModel]="false" />
              <label for="st-disabled2">Deaktiviert, nicht angehakt</label>
            </div>
            <div class="cb-row">
              <p-checkbox
                inputId="st-invalid"
                [binary]="true"
                [invalid]="true"
                [ngModel]="stInvalid()"
                (ngModelChange)="stInvalid.set($event)"
              />
              <label for="st-invalid">Ungültig (Pflicht, nicht angehakt)</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="st-readonly" [binary]="true" [readonly]="true" [ngModel]="false" />
              <label for="st-readonly">Schreibgeschützt</label>
            </div>
          </div>
          <pre class="code-block"><code>{{ statesCode }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Checkbox, Radio oder Switch?</h3>
        <p>
          Drei Steuerelemente, drei verschiedene Fragen. Der Fehler ist fast nie „welches sieht besser aus“ — sondern
          dass von vornherein die falsche Frage gestellt wird. Entscheide,
          <strong>wie viele Antworten erlaubt sind</strong> und <strong>wann die Antwort wirkt</strong>, dann ergibt sich
          das Steuerelement von selbst.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Beantwortet die Frage</th>
                <th>Auswahl</th>
                <th>Wann es wirkt</th>
                <th>Braucht einen Gruppennamen</th>
                <th>Leerer Zustand</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-checkbox</code></td>
                <td>„Was davon trifft zu?“ — oder, allein: „Stimmt das?“</td>
                <td><strong>Null bis viele</strong>, unabhängig</td>
                <td>Beim Absenden / Übernehmen — die Seite verändert sich nicht unter dem Nutzer</td>
                <td>Ja, sobald es mehr als eine gibt</td>
                <td>Erlaubt: Nichts angehakt ist eine gültige Antwort</td>
              </tr>
              <tr>
                <td><code>p-radiobutton</code></td>
                <td>„Welche <em>eine</em>?“</td>
                <td><strong>Genau eine</strong>, gegenseitig ausschließend</td>
                <td>Beim Absenden / Übernehmen</td>
                <td>Ja, immer — ein einzelner Radio-Button ist ein Bug</td>
                <td>Sollte vorausgewählt sein; ein Radio-Button lässt sich nicht wieder abwählen</td>
              </tr>
              <tr>
                <td><code>p-toggleswitch</code></td>
                <td>„Schalt das ein oder aus — jetzt.“</td>
                <td>Ein Boolean</td>
                <td><strong>Sofort</strong>, mit sichtbarer Folge</td>
                <td>Nein — er benennt sich selbst</td>
                <td>Immer an oder aus; einen dritten Zustand gibt es nicht</td>
              </tr>
              <tr>
                <td><code>p-selectbutton</code></td>
                <td>„Welche, aus 2–4 kurzen Optionen?“</td>
                <td>Eine (oder viele mit <code>[multiple]</code>)</td>
                <td>Meist sofort — es ist ein Ansichtsfilter</td>
                <td>Ja</td>
                <td>Einstellbar mit <code>[allowEmpty]</code></td>
              </tr>
              <tr>
                <td><code>p-multiselect</code></td>
                <td>„Was von diesen <em>vielen</em> trifft zu?“</td>
                <td>Null bis viele, hinter einem Overlay</td>
                <td>Beim Absenden / Übernehmen</td>
                <td>Ja — der Auslöser braucht einen Namen</td>
                <td>Erlaubt, als Platzhalter angezeigt</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> „Auswahl“, „Leerer Zustand“ und die Spalte zum
          Gruppennamen sind Verhalten, gelesen aus den Quellen von Optimus&nbsp;UI 2.0.2 in <code>node_modules</code> und
          aus der ARIA-Spezifikation.
          „Wann es wirkt“ ist eine <em>Konvention</em>, keine Messung — es ist die Unterscheidung zwischen Checkbox und
          Switch, auf die sich die Plattform-HIGs geeinigt haben, und sie entscheidet die meisten Diskussionen. Die eine
          harte Regel darunter: Ein Steuerelement, das sofort wirkt, darf nicht in einem Formular stehen, das der Nutzer
          noch absenden muss.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Checkboxen für eine exklusive Wahl</span>
            <div class="dd__stage">
              <div class="cb-col">
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-x-monthly"
                    [binary]="true"
                    [ngModel]="ddExMonthly()"
                    (ngModelChange)="ddExMonthly.set($event)"
                  />
                  <label for="dd-x-monthly">Monatliche Abrechnung</label>
                </div>
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-x-yearly"
                    [binary]="true"
                    [ngModel]="ddExYearly()"
                    (ngModelChange)="ddExYearly.set($event)"
                  />
                  <label for="dd-x-yearly">Jährliche Abrechnung</label>
                </div>
              </div>
            </div>
            <p class="dd__why">
              Hak beide an — das Steuerelement lässt dich, denn eine Checkbox kennt keine Geschwister. Die Exklusivität
              muss dann in TypeScript nachgebaut werden, und ein Screenreader sagt immer noch „Kontrollkästchen, 1 von
              2“, nicht „Optionsfeld, 1 von 2“.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Radio-Buttons in einer benannten Gruppe</span>
            <div class="dd__stage">
              <fieldset class="cb-group cb-group--tight">
                <legend>Abrechnungszeitraum</legend>
                <div class="cb-row">
                  <p-radiobutton
                    inputId="dd-r-monthly"
                    name="dd-billing"
                    value="monthly"
                    [ngModel]="ddBilling()"
                    (ngModelChange)="ddBilling.set($event)"
                  />
                  <label for="dd-r-monthly">Monatliche Abrechnung</label>
                </div>
                <div class="cb-row">
                  <p-radiobutton
                    inputId="dd-r-yearly"
                    name="dd-billing"
                    value="yearly"
                    [ngModel]="ddBilling()"
                    (ngModelChange)="ddBilling.set($event)"
                  />
                  <label for="dd-r-yearly">Jährliche Abrechnung</label>
                </div>
              </fieldset>
            </div>
            <p class="dd__why">
              Der <code>name</code> macht die beiden im eigenen Modell des Browsers zu einer Radio-Gruppe: Exklusivität,
              Navigation mit den Pfeiltasten und die Ansage „1 von 2“ gibt es gratis.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Checkbox, die sofort wirkt</span>
            <div class="dd__stage">
              <div class="cb-row">
                <p-checkbox
                  inputId="dd-inst-bad"
                  [binary]="true"
                  [ngModel]="ddInstant()"
                  (ngModelChange)="ddInstant.set($event)"
                />
                <label for="dd-inst-bad">Hoher Kontrast</label>
              </div>
            </div>
            <p class="dd__why">
              Eine Checkbox liest sich als „Teil eines Formulars, das ich absenden werde“. Ändert sie stattdessen die App
              auf der Stelle, hat der Nutzer kein <em>Abbrechen</em>, und das Häkchen ist ein schwaches Signal für einen
              Zustand, der jetzt schon gilt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Switch für eine sofort wirksame Einstellung</span>
            <div class="dd__stage">
              <div class="cb-row">
                <p-toggleswitch
                  inputId="dd-inst-good"
                  [ngModel]="ddInstant()"
                  (ngModelChange)="ddInstant.set($event)"
                />
                <label for="dd-inst-good">Hoher Kontrast</label>
              </div>
            </div>
            <p class="dd__why">
              Die ganze Bildsprache des Switches ist „an / aus, und zwar jetzt“, und der Schieber wandert, sodass die
              Änderung ohne Lesen erkennbar ist. Dasselbe Modell, das richtige Versprechen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Gruppe, deren Name nur eine Überschrift ist</span>
            <div class="dd__stage">
              <div class="cb-col" id="dd-group-bad">
                <span class="pg__label">Benachrichtige mich über</span>
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-gb-email"
                    [binary]="true"
                    [ngModel]="ddGroupBad()"
                    (ngModelChange)="ddGroupBad.set($event)"
                  />
                  <label for="dd-gb-email">E-Mail</label>
                </div>
                <div class="cb-row">
                  <p-checkbox inputId="dd-gb-push" [binary]="true" [ngModel]="false" />
                  <label for="dd-gb-push">Push-Nachricht</label>
                </div>
              </div>
            </div>
            <p class="dd__why">
              Ein sehender Nutzer liest die Beschriftung über den Boxen. Ein Screenreader-Nutzer, der per Tab direkt zur
              zweiten Box springt, hört nur „Push-Nachricht“ — der gemeinsame Kontext ist ein optischer Zufall, keine
              Beziehung. Genau in diese Form fällt ein Filter-Panel oder ein Einstellungsblock von selbst, weil die
              Beschriftung schon so aussieht, als erledige sie den Job.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Fieldset + Legend</span>
            <div class="dd__stage">
              <fieldset class="cb-group cb-group--tight" id="dd-group-good">
                <legend>Benachrichtige mich über</legend>
                <div class="cb-row">
                  <p-checkbox
                    inputId="dd-gg-email"
                    [binary]="true"
                    [ngModel]="ddGroupGood()"
                    (ngModelChange)="ddGroupGood.set($event)"
                  />
                  <label for="dd-gg-email">E-Mail</label>
                </div>
                <div class="cb-row">
                  <p-checkbox inputId="dd-gg-push" [binary]="true" [ngModel]="false" />
                  <label for="dd-gg-push">Push-Nachricht</label>
                </div>
              </fieldset>
            </div>
            <p class="dd__why">
              Im Accessibility Tree legt das <code>&lt;fieldset&gt;</code> einen <strong>group</strong>-Knoten mit dem
              Namen <strong>„Benachrichtige mich über“</strong> an, dem beide Checkboxen gehören. Der Name wird angesagt,
              sobald der Fokus die Gruppe betritt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — aria-label auf dem Host &lt;p-checkbox&gt;</span>
            <div class="dd__stage">
              <p-checkbox
                id="dd-name-bad"
                [attr.aria-label]="'Nutzungsbedingungen akzeptieren'"
                [binary]="true"
                [ngModel]="ddName()"
                (ngModelChange)="ddName.set($event)"
              />
            </div>
            <p class="dd__why">
              Gemessener zugänglicher Name: <strong>{{ ddNameBadMeasured }}</strong
              >. Das Attribut landet auf dem Element <code>&lt;p-checkbox&gt;</code>, das überhaupt keine Rolle hat; das
              fokussierbare <code>&lt;input&gt;</code> darin bekommt es nie zu sehen. Genau die Falle, die der Guide zu
              Select dokumentiert — und die einzige, die sich übertragen lässt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — &lt;label for&gt; + inputId</span>
            <div class="dd__stage">
              <div class="cb-row">
                <p-checkbox
                  inputId="dd-name-good"
                  [binary]="true"
                  [ngModel]="ddName()"
                  (ngModelChange)="ddName.set($event)"
                />
                <label for="dd-name-good">Nutzungsbedingungen akzeptieren</label>
              </div>
            </div>
            <p class="dd__why">
              Gemessener zugänglicher Name: <strong>„Nutzungsbedingungen akzeptieren“</strong>. Ein echtes
              <code>&lt;input type="checkbox"&gt;</code> <em>ist</em> ein beschriftbares Element, also ist das Muster, das
              bei <code>p-select</code> scheitert, hier das richtige — und es macht den Label-Text zu einer zweiten,
              größeren Klickfläche.
            </p>
          </div>
        </div>

        <h3>Das Label schreiben</h3>
        <ul>
          <li>
            <strong>Positiv formulieren.</strong> „Schick mir den Newsletter“, nicht „Schick mir den Newsletter nicht“ —
            eine angehakte Verneinung ist eine doppelte Verneinung, und Nutzer verstehen sie falsch.
          </li>
          <li>
            <strong>Eine Aussage pro Box.</strong> „Ich akzeptiere die Nutzungsbedingungen und die Datenschutzerklärung“
            sind zwei Einwilligungen hinter einem Häkchen; Aufsichtsbehörden und Nutzer mögen das beide nicht.
          </li>
          <li>
            <strong>Das Label ist der ganze Satz, kein Anhängsel.</strong> Setz jedes Wort in das
            <code>&lt;label&gt;</code>: Text außerhalb davon wird weder mit dem Steuerelement angesagt noch ist er
            klickbar.
          </li>
          <li>
            <strong>Hak keine Einwilligung vor.</strong> Eine Checkbox, die angehakt ausgeliefert wird, ist ein
            Standardwert, und ein Standardwert ist keine Entscheidung.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Checkbox pattern</a
            >
            — der Vertrag aus Rollen und Zuständen, gegen den dieser Guide die Komponente prüft, einschließlich der
            Tri-State-Variante und der Anforderung, dass eine gemischte Checkbox
            <code>aria-checked="mixed"</code> meldet. Er ist die Referenz für den Befund zu indeterminate im Tab
            Entwicklung.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-checked" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-checked</code></a
            >
            — definiert <code>mixed</code> als vollwertigen Wert und sagt, dass er für <code>checkbox</code> gilt; der
            Maßstab für „das Minus-Zeichen ist kein Zustand“.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/input.html#checkbox-state-(type=checkbox)"
              target="_blank"
              rel="noopener noreferrer"
            >
              WHATWG HTML — the Checkbox state</a
            >
            — der normative Text zum IDL-Attribut <code>indeterminate</code> („does not affect the result of form
            submission“, beeinflusst das Ergebnis des Absendens nicht) und dazu, warum eine nicht angehakte Box gar keinen
            Eintrag beisteuert. Beide Aussagen im Tab Entwicklung gehen hierauf zurück.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Label element</a
            >
            — die Liste der <em>beschriftbaren</em> (labelable) Elemente. <code>&lt;input&gt;</code> steht darauf; das
            ist der Mechanismus hinter dem funktionierenden Namen hier und dem scheiternden bei <code>p-select</code>.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.3.1 Info and Relationships</a
            >
            — das Kriterium, an dem eine Checkbox-Gruppe scheitert, wenn ihr Name nur eine optisch benachbarte
            Überschrift ist; die Grundlage des Do/Don’t-Paars zu Fieldset und Legend.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — die Untergrenze von 24&nbsp;px, die die gerenderte Box in allen drei Größen verfehlt, und die „Inline-
            Ausnahme“, die dir ein klickbares Label nicht automatisch verschafft.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — 3:1 für Ränder und Zustände von Steuerelementen; der Maßstab für die gemessenen Kontraste von Rand
            (nicht angehakt) und Füllung (angehakt) im Tab Design.
          </li>
          <li>
            <a href="https://optimus.openng.org/checkbox/" target="_blank" rel="noopener noreferrer">
              Optimus UI — Checkbox component</a
            >
            — die API des Herstellers, die dieser Guide auf die Konventionen des Kits abbildet und dann gegen den
            ausgelieferten Quellcode in <code>node_modules</code> prüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>Eine <code>p-checkbox</code> ist drei Elemente tief, und das, das du siehst, ist nicht das, mit dem du interagierst:</p>
        <ul>
          <li>
            <strong>Root</strong> — der Host <code>&lt;p-checkbox&gt;</code>, Klasse <code>p-checkbox p-component</code>,
            <code>position: relative</code>, <code>display: inline-flex</code>, genau so groß wie die Box. Er trägt die
            Zustandsklassen (<code>p-checkbox-checked p-highlight</code>, <code>p-disabled</code>, <code>p-invalid</code>,
            <code>p-variant-filled</code>) und die Attribute <code>data-p-checked</code> /
            <code>data-p-disabled</code>. Er hat <strong>keine Rolle</strong> — nichts, was du auf ihn setzt, erreicht
            assistive Technik.
          </li>
          <li>
            <strong>Input</strong> — ein echtes <code>&lt;input type="checkbox" class="p-checkbox-input"&gt;</code>,
            absolut positioniert über dem ganzen Root mit <code>opacity: 0</code>, <code>z-index: 1</code>,
            <code>cursor: pointer</code>. Das ist das fokussierbare, beschriftbare Element, das am Formular teilnimmt.
            Alles, was mit Accessibility zu tun hat, gehört hierhin.
          </li>
          <li>
            <strong>Box</strong> — <code>div.p-checkbox-box</code>, das, was du tatsächlich siehst: Rand, Radius,
            Hintergrund und die Transition.
          </li>
          <li>
            <strong>Icon</strong> — ein Inline-<code>&lt;svg&gt;</code> in der Box:
            <code>data-p-icon="check"</code> im angehakten Zustand, <code>data-p-icon="minus"</code> bei indeterminate.
            Ersetzbar durch <code>checkboxIcon</code> (eine Icon-Klasse) oder durch ein Template <code>#icon</code>.
          </li>
        </ul>
        <p class="src-note">
          Anatomie gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-checkbox.mjs</code> (das Template bei 312-341: das Input bei
          312-331, das <code>div</code> der Box bei 332, das <code>svg</code> des Häkchens bei 336, das <code>svg</code> des Minus bei
          338) und aus dem ausgelieferten Stylesheet <code>&#64;openng/optimus-ui-styles/dist/checkbox/index.mjs</code> (<code
            >.p-checkbox-input &#123; opacity: 0; position: absolute; inset: 0; width: 100%; height: 100% &#125;</code
          >) und mit dem berechneten Stil bestätigt.
        </p>

        <h3>Größenskala — Token und gemessene Boxen</h3>
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
                <td><code>--p-checkbox-width</code> / <code>-height</code></td>
                <td>1rem (16px)</td>
                <td>1.25rem (20px)</td>
                <td>1.5rem (24px)</td>
              </tr>
              <tr>
                <td><strong>Box</strong> (aus den Token abgeleitet)</td>
                <td>
                  <strong>{{ m.boxSmall }}</strong>
                </td>
                <td>
                  <strong>{{ m.boxNormal }}</strong>
                </td>
                <td>
                  <strong>{{ m.boxLarge }}</strong>
                </td>
              </tr>
              <tr>
                <td><strong>Klickfläche</strong> (das Input-Overlay, aus den Token abgeleitet)</td>
                <td>
                  <strong>{{ m.hitSmall }}</strong>
                </td>
                <td>
                  <strong>{{ m.hitNormal }}</strong>
                </td>
                <td>
                  <strong>{{ m.hitLarge }}</strong>
                </td>
              </tr>
              <tr>
                <td><code>--p-checkbox-icon-size</code></td>
                <td>0.75rem (12px)</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px)</td>
              </tr>
              <tr>
                <td>border-radius / Rand</td>
                <td colspan="3">{{ m.radius }} / 1px solid</td>
              </tr>
              <tr>
                <td>transition-duration</td>
                <td colspan="3">{{ m.transition }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/checkbox/index.mjs</code>
          (<code>width: '1.25rem'</code>, <code>sm: &#123; width: '1rem' &#125;</code>,
          <code>lg: &#123; width: '1.5rem' &#125;</code>); Box und Klickfläche sind aus den Token abgeleitet. Der Radius
          folgt der Radius-Skala des aktiven visuellen Stils (<code>presetOverrides</code> in
          <code>src/app/services/ui-styles.ts</code>).
        </p>
        <p class="src-note">
          <strong>Die Zielgröße ist hier der Befund.</strong> WCAG 2.2 SC 2.5.8 verlangt ein Ziel von
          24&nbsp;×&nbsp;24&nbsp;px. Die Klickfläche ist das Input-Overlay, das genau so groß ist wie die Box — und auf
          der Skala 16 / 20 / 24&nbsp;px <strong>erreicht es nur <code>large</code></strong>, und zwar exakt, mit
          24&nbsp;×&nbsp;24; <code>small</code> und die Standardgröße verfehlen es. Es gibt zwei ehrliche Lösungen: Stell
          jeder Checkbox ein <code>&lt;label for&gt;</code> zur Seite (ein zweites, viel größeres Ziel — das Muster, das
          jedes Beispiel hier nutzt), oder gib der Zeile Padding und vergrößere das Input-Overlay. Lös es nicht, indem du
          die sichtbare Box größer machst; 20&nbsp;px ist das beabsichtigte visuelle Gewicht in der Standardgröße.
        </p>

        <h3>Interaktionszustände — beide Themes</h3>
        <p>
          Anders als beim Select werden die Farben der Checkbox vom Kit <strong>nicht</strong> überschrieben: Die eine
          Checkbox-Regel in <code>styles.scss</code> ist der Fokus-Ring (<code>.p-checkbox:has(…:focus-visible)</code>).
          Alles andere ist die Token-Schicht von Aura, gespeist von der Surface-Skala des aktiven visuellen Stils und der
          Primary-Skala des Akzents — deshalb nennt die Tabelle Token, keine Farben.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Token-Schicht von Aura</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ruhe</td>
                <td>
                  1px <code>--p-checkbox-border-color</code>, von <code>styles.scss</code> auf das
                  <code>--control-border</code> des Kits umgelenkt, auf <code>&#123;form.field.background&#125;</code>
                </td>
                <td>Rand {{ m.restBorderLight }}</td>
                <td>Rand {{ m.restBorderDark }}</td>
              </tr>
              <tr>
                <td>angehakt</td>
                <td>
                  Hintergrund und Rand <code>&#123;primary.color&#125;</code>, Zeichen
                  <code>&#123;primary.contrast.color&#125;</code>
                </td>
                <td>Füllung {{ m.checkedBgLight }}, Zeichen {{ m.checkedIconLight }}</td>
                <td>Füllung {{ m.checkedBgDark }}, Zeichen {{ m.checkedIconDark }}</td>
              </tr>
              <tr>
                <td>Hover (Zeiger darüber)</td>
                <td>
                  <code>:has(.p-checkbox-input:hover)</code> → Rand
                  <code>&#123;form.field.hover.border.color&#125;</code>; angehakt → die Primary-Hover-Farbe
                </td>
                <td colspan="2">
                  Ein <code>:has()</code>-Selektor auf dem Root, also ist das Hover-Ziel das transparente Input-Overlay —
                  die Box reagiert, obwohl der Zeiger über dem Input liegt, nicht über der Box.
                </td>
              </tr>
              <tr>
                <td>Fokus sichtbar (focus-visible)</td>
                <td>
                  <code>:has(.p-checkbox-input:focus-visible)</code> → eine <strong>Outline</strong> aus den GLOBALEN
                  <code>&#123;focus.ring.*&#125;</code>-Token (1px solid <code>&#123;primary.color&#125;</code>, Offset
                  2px), nicht aus dem genullten <code>form.field.focusRing</code>, den der Select erbt — vom Kit durch
                  die <code>:has()</code>-Regel in <code>styles.scss</code> überschrieben mit 2px solid
                  <code>--primary-color-fg</code>
                </td>
                <td>Outline {{ m.focusOutlineLight }}</td>
                <td>Outline {{ m.focusOutlineDark }}</td>
              </tr>
              <tr>
                <td>deaktiviert</td>
                <td>
                  <code>opacity: 1</code> plus <code>&#123;form.field.disabled.background&#125;</code> und ein gedämpftes
                  Zeichen — <em>nicht</em> die globale Disabled-Opacity von 0,6, die Buttons nutzen
                </td>
                <td colspan="2">{{ m.disabledNote }}</td>
              </tr>
              <tr>
                <td>ungültig</td>
                <td>
                  <code>.p-checkbox.p-invalid &gt; .p-checkbox-box</code> → Rand
                  <code>--p-checkbox-invalid-border-color</code> (Kit: <code>--semantic-red-fg</code>). Optimus ergänzt eine zweite Regel für
                  <code>.ng-invalid.ng-dirty</code>.
                </td>
                <td colspan="2">
                  Eine Änderung der Randfarbe um 1px und sonst nichts — nie das einzige Signal. Kombinier sie mit einer
                  Fehlermeldung und <code>[attr.aria-describedby]</code> auf einem Wrapper, den du kontrollierst.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>So misst du das in deinem Stil:</strong> Lies den berechneten Stil von <code>.p-checkbox-box</code> und
          erreiche den Fokus-Zustand mit der Tastatur, sonst greift <code>:focus-visible</code> nicht und der Ring ist
          nicht da. Regeln aus
          <code>&#64;openng/optimus-ui-styles/dist/checkbox/index.mjs</code>; Token-Definitionen aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/checkbox/index.mjs</code> und dem globalen Block <code>focusRing</code> in
          <code>&#8230;/aura/base/index.mjs</code> (<code
            >width: '1px', style: 'solid', color: '&#123;primary.color&#125;', offset: '2px'</code
          >).
        </p>

        <h3>Kontrast in den Stilen des Kits (per Gate geprüft)</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Hell (4 Stile × 10 Akzente)</th>
                <th>Dunkel (4 Stile × 10 Akzente)</th>
                <th>Benötigt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Rand (nicht angehakt) gegen die Fläche dahinter</td>
                <td>{{ m.contrastRestBorderLight }}</td>
                <td>{{ m.contrastRestBorderDark }}</td>
                <td>3:1 (SC 1.4.11 — der Rand ist das Einzige, was „hier ist ein Steuerelement“ sagt)</td>
              </tr>
              <tr>
                <td>Füllung (angehakt) gegen die Fläche dahinter</td>
                <td>{{ m.contrastCheckedLight }}</td>
                <td>{{ m.contrastCheckedDark }}</td>
                <td>3:1</td>
              </tr>
              <tr>
                <td>Häkchen gegen die Füllung (angehakt)</td>
                <td>{{ m.contrastGlyphLight }}</td>
                <td>{{ m.contrastGlyphDark }}</td>
                <td>3:1 (es ist der Zustandsindikator)</td>
              </tr>
              <tr>
                <td>Fokus-Outline gegen die Fläche dahinter</td>
                <td>{{ m.contrastFocusLight }}</td>
                <td>{{ m.contrastFocusDark }}</td>
                <td>3:1 (SC 1.4.11, Fokusindikator)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Spannen über jeden Stil und Akzent, zitiert aus den Zeilen „checkbox &amp; radiobutton“ von
          <code>docs/generated/CONTRAST.MD</code> — <code>checkbox.border.color</code>,
          <code>&lt;accent&gt;.primary.color</code>, <code>&lt;accent&gt;.checkbox.icon.checked.color</code> — und für
          den Ring aus den Zeilen „focus ring“ (<code>&lt;accent&gt;.--primary-color-fg (kit focus ring)</code>). Das
          Gate berechnet sie bei jedem Build neu aus den Token; zitier also diese Datei, nicht diese Tabelle, wenn es auf
          eine Zahl ankommt. Rand und Punkt des Radiobuttons sind dieselben Paare.
        </p>
        <p class="src-note">
          <strong>Warum die nicht angehakte Box 3:1 hält.</strong> Aura zeichnet sie in
          <code>&#123;form.field.border.color&#125;</code> (<code>surface.300</code>, 1,41:1 hell / 1,34:1 dunkel auf
          seiner Standardpalette) — eine Box ohne Häkchen trägt sonst keinen Hinweis. Das Kit lenkt
          <code>--p-checkbox-border-color</code> auf <code>--control-border</code> um, den Steuerelement-Rand, den jeder
          Stil so wählt, dass er auf allen seinen Flächen 3:1 schafft; die leere Füllung muss nichts mehr tragen.
        </p>

        <h3>Layout: die Zeile, nicht die Box</h3>
        <p>
          Die Komponente richtet ihre Größe nach der Box und nach sonst nichts — kein Label, kein Abstand, keine Zeile.
          Die Konvention des Kits ist eine Flex-Zeile:
        </p>
        <pre class="code-block"><code>{{ rowSnippet }}</code></pre>
        <p>
          Zwei Details, die man leicht falsch macht. <strong>Ausrichtung:</strong> Nimm
          <code>align-items: flex-start</code>, sobald ein Label auf zwei Zeilen umbrechen kann, sonst wandert die Box in
          die vertikale Mitte des Absatzes. <strong>Cursor:</strong> Das Label braucht ein eigenes
          <code>cursor: pointer</code> — der Zeiger-Cursor des Inputs endet an der Box.
        </p>
        <p>
          <strong>Schmale Bildschirme:</strong> Die Box hat kein responsives Verhalten — sie behält ihre Token-Größe in
          jedem Viewport. Was umbricht, ist deine Zeile: Das Label bricht innerhalb der Breite um, die ihm die
          Flex-Zeile lässt, und <code>align-items: flex-start</code> hält die Box in der ersten Zeile. Auch eine Gruppe
          hat kein eigenes Layout: Sie stapelt eine Zeile pro Box, solange dein Markup nichts anderes sagt.
        </p>

        <h3>Stand zu WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird auch
          nicht beansprucht.
          <strong>Erfüllt:</strong> SC 4.1.2 (ein echtes <code>&lt;input type="checkbox"&gt;</code>, benannt durch
          <code>&lt;label for&gt;</code> plus <code>inputId</code>), SC 2.1.1 mit dem browsereigenen Modell — Tab pro
          Box, Space schaltet um — und SC 2.4.7 mit dem Ring des Kits in <code>--primary-color-fg</code> in beiden
          Themes (seine Werte pro Stil und Akzent stehen in den Zeilen „focus ring“ von
          <code>docs/generated/CONTRAST.MD</code>).
          SC 1.4.11 für den Rand ohne Häkchen, die Füllung mit Häkchen und das Zeichen in jedem Stil und Akzent (per Gate
          geprüft, siehe Kontrasttabelle).
          <strong>Bedingt:</strong> SC 2.5.8 — die Klickfläche ist das Input-Overlay, 16 / 20 / 24 px, also ist nur
          <code>large</code> für sich allein ein
          Ziel von 24px, und bei den anderen beiden trägt das klickbare Label; und SC 1.3.1, wo eine Gruppe nur über
          <code>&lt;fieldset&gt;</code> und <code>&lt;legend&gt;</code> oder
          <code>role="group"</code> mit <code>aria-labelledby</code> eine Beziehung ist, nie über eine Überschrift über den Boxen.
          <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>CheckboxModule</code> exportiert die Komponente <code>&lt;p-checkbox&gt;</code> (auch erkannt als
          <code>p-checkBox</code> und <code>p-check-box</code>). Sie ist ein <code>ControlValueAccessor</code>, also
          funktionieren sowohl <code>[(ngModel)]</code> als auch Reactive Forms.
        </p>

        <h3>Die zwei Formen der Bindung</h3>
        <p>Das ist die Entscheidung, die den Rest des Codes prägt, und Optimus trifft sie mit einem einzigen Flag:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>[binary]="true"</code></th>
                <th>Standard (<code>binary</code> nicht gesetzt)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Modell</td>
                <td>Ein Boolean pro Box</td>
                <td><strong>Ein Array, das sich alle Boxen der Gruppe teilen</strong></td>
              </tr>
              <tr>
                <td>Braucht <code>value</code></td>
                <td>Nein</td>
                <td>Ja — es ist das Element im Array</td>
              </tr>
              <tr>
                <td>Umschalten</td>
                <td><code>trueValue</code> ⇄ <code>falseValue</code></td>
                <td>Optimus fügt <code>value</code> für dich ins Array ein bzw. filtert es heraus</td>
              </tr>
              <tr>
                <td>Nimm es, wenn</td>
                <td>Die Flags unabhängig sind: eine Einwilligung, eine Präferenz, eine einzelne switch-artige Option in einem Formular</td>
                <td>Die Antwort eine Menge <em>ist</em>: „welche Kategorien“, „welche Kanäle“ — ein Feld im Payload</td>
              </tr>
              <tr>
                <td>Pass auf</td>
                <td>Kaum etwas</td>
                <td>
                  Das Array muss existieren. Ein Start mit <code>null</code> funktioniert (Optimus legt eines an), ein
                  Start mit <code>undefined</code> in einer Gruppe, deren erster Klick ein Abwählen ist, nicht.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ bindingSnippet }}</code></pre>
        <p class="src-note">
          Gelesen aus <code>updateModel</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-checkbox.mjs:248-277</code>: Der
          nicht-binäre Zweig macht <code>currentModelValue.filter(&#8230;)</code>, wenn die Box schon angehakt ist, und
          sonst <code>[&#8230;currentModelValue, this.value]</code> (:257-267); der binäre Zweig tauscht
          <code>trueValue</code> / <code>falseValue</code> (einfache Properties, Standardwerte <code>true</code> /
          <code>false</code>, :171, :176). Der Getter <code>checked</code> (:210-212) spiegelt das —
          <code>contains(this.value, this.modelValue())</code> für eine Gruppe, <code>modelValue() === trueValue</code> für
          eine binäre Box.
        </p>

        <h3>Die wichtigsten Inputs</h3>
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
                <td><code>binary</code></td>
                <td>boolean</td>
                <td>Wechselt die Form des Modells (siehe oben). Nicht gesetzt heißt „Element im Array“.</td>
              </tr>
              <tr>
                <td><code>value</code></td>
                <td>any</td>
                <td>Das Element im Array für eine Box in einer Gruppe. Wird auch ins Attribut <code>value</code> des Inputs geschrieben.</td>
              </tr>
              <tr>
                <td><code>trueValue</code> / <code>falseValue</code></td>
                <td>any</td>
                <td>
                  Nur im binären Modus. Standardwerte <code>true</code> / <code>false</code>; setz sie, wenn der Payload
                  <code>'yes'</code> / <code>'no'</code> will.
                </td>
              </tr>
              <tr>
                <td><code>inputId</code></td>
                <td>string</td>
                <td>
                  <strong>Die id des echten Inputs.</strong> Darauf zeigt <code>&lt;label for&gt;</code> — und anders
                  als bei <code>p-select</code> funktioniert es.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>string</td>
                <td>
                  Werden als <code>aria-label</code> / <code>aria-labelledby</code> an das Input gebunden. Nutz sie nur,
                  wenn ein sichtbares Label wirklich unmöglich ist.
                </td>
              </tr>
              <tr>
                <td><code>indeterminate</code></td>
                <td>boolean</td>
                <td>
                  Zeichnet ein Minus und zwingt <code>checked</code> auf false. <strong>Nur optisch</strong> — siehe
                  unten.
                </td>
              </tr>
              <tr>
                <td><code>checkboxIcon</code></td>
                <td>string</td>
                <td>
                  Eine Icon-Klasse, die das <code>&lt;svg&gt;</code> des Häkchens ersetzt. Achtung: Sie ersetzt NUR das
                  HÄKCHEN; das Minus von indeterminate bleibt unberührt.
                </td>
              </tr>
              <tr>
                <td><code>readonly</code></td>
                <td>boolean</td>
                <td>
                  Blockiert das Aktualisieren des Modells in <code>handleChange</code>. Es hält den Browser
                  <strong>nicht</strong> davon ab, das Input umzuschalten — siehe den Vorbehalt unten.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code> / <code>invalid</code> / <code>required</code> / <code>name</code></td>
                <td>boolean / string</td>
                <td>
                  Aus <code>BaseEditableHolder</code>. <code>required</code> rendert das Attribut
                  <code>required</code>; <code>name</code> rendert <code>name</code>, was für das native Absenden zählt.
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Signal-Input; für die Standardgröße weglassen.</td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'filled' | 'outlined'</td>
                <td>
                  Signal-Input, fällt auf das globale <code>inputStyle</code> aus <code>app.config.ts</code> zurück.
                </td>
              </tr>
              <tr>
                <td><code>tabindex</code></td>
                <td>number</td>
                <td>
                  Landet auf dem Input. <code>-1</code> macht die Checkbox per Tastatur unerreichbar — nur richtig, wenn
                  etwas anderes in der Zeile fokussierbar ist und den Job übernimmt.
                </td>
              </tr>
              <tr>
                <td><code>inputClass</code> / <code>inputStyle</code></td>
                <td>string / object</td>
                <td>Wird auf das transparente Input angewendet — der Hebel, um die Klickfläche über die Box hinaus zu vergrößern.</td>
              </tr>
              <tr>
                <td><code>autofocus</code></td>
                <td>boolean</td>
                <td>Fokus beim Start. Bei einer Checkbox fast immer falsch: Es verschiebt für alle die Leseposition.</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td>
                  In Optimus wieder vorhanden (<code>&#64;deprecated since v20</code>, :136); PrimeNG&nbsp;22 hatte es
                  entfernt. Nimm trotzdem <code>class</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs geprüft gegen <code>&#64;openng/optimus-ui/types/openng-optimus-ui-checkbox.d.ts</code> (Optimus UI
          2.0.2, <code>node_modules/&#64;openng/optimus-ui/package.json</code>) und die Liste der Bindings in der
          Deklaration <code>ɵcmp</code> der Komponente; <code>disabled</code> / <code>invalid</code> / <code>required</code> /
          <code>name</code> stammen aus <code>openng-optimus-ui-baseeditableholder.d.ts</code>.
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
                <td><code>CheckboxChangeEvent</code></td>
                <td>
                  Die Box wurde umgeschaltet. <code>$event.checked</code> ist der <strong>neue Wert des Modells</strong>
                  — bei einer Gruppe das ganze Array, kein Boolean. Lies den Typ, bevor du dem Namen traust.
                </td>
              </tr>
              <tr>
                <td><code>onFocus</code> / <code>onBlur</code></td>
                <td><code>EventEmitter&lt;Event&gt;</code></td>
                <td>Das Input hat den Fokus bekommen / verloren. <code>onBlur</code> markiert das Control außerdem als touched.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>onChange.emit(&#123; checked: newModelValue, originalEvent: event &#125;)</code>
          bei <code>openng-optimus-ui-checkbox.mjs:276</code> — die Property heißt <code>checked</code>, trägt aber
          <code>newModelValue</code>, was in einer Gruppe das aktualisierte Array ist.
        </p>

        <!-- ============ THE INDETERMINATE SECTION ============ -->
        <h3>Indeterminate: was es ist, und die drei Dinge, die es nicht ist</h3>
        <p>
          Der legitime Einsatz ist eine Eltern-Box über einer Menge von Kindern: alle Kinder angehakt → Eltern-Box
          angehakt; keines → Eltern-Box nicht angehakt; einige → Eltern-Box <em>gemischt</em>. Der Tab Beispiele rendert
          genau das. Verdrahte es als abgeleiteten Wert, nie als Zustand, den du von Hand pflegst:
        </p>
        <pre class="code-block"><code>{{ indeterminateWireSnippet }}</code></pre>
        <p>Jetzt der ehrliche Teil.</p>
        <ol>
          <li>
            <strong>Es ist kein Wert.</strong> Eine Checkbox hat zwei Werte; der dritte Zustand lebt neben dem Wert, nicht
            in ihm. In Optimus liefert der Getter <code>checked</code> immer dann <code>false</code>, wenn das interne
            Signal für indeterminate gesetzt ist (<code>openng-optimus-ui-checkbox.mjs:210-212</code>), also liest sich
            das Modell als nicht angehakt,
            während das Minus auf dem Bildschirm steht.
          </li>
          <li>
            <strong>Es wird nie abgesendet.</strong> Laut HTML-Spezifikation „does not affect the result of form
            submission“ das IDL-Attribut <code>indeterminate</code>, und eine nicht angehakte Checkbox steuert gar keinen
            Eintrag bei. Eine gemischte Eltern-Box sendet also <em>nichts</em>. Sende die Kinder.
          </li>
          <li><strong>In Optimus wird es auch nicht angesagt.</strong> {{ m.indeterminateA11y }}</li>
        </ol>
        <p class="src-note">
          <strong>Gemessen und gelesen.</strong> Die Komponente rendert
          <code>&lt;svg data-p-icon="minus"&gt;</code> in einem Block <code>&#64;if (_indeterminate())</code>
          (<code>openng-optimus-ui-checkbox.mjs:346-348</code>) und bindet <code>[checked]="checked"</code> an das Input
          (:322) — aber
          es gibt nirgends in der Datei ein Property-Binding <code>[indeterminate]</code>, und der String
          <code>aria-checked</code> kommt darin überhaupt nicht vor. Aus dem Accessibility Tree und der DOM-Property
          nebeneinander gelesen:
          {{ m.indeterminateEvidence }}
        </p>
        <p>
          <strong>Der Workaround und sein Preis.</strong> Setz die DOM-Property und den ARIA-Zustand selbst auf dem
          echten Input. Es sind drei Zeilen, sie sind testbar, und nur so existiert der gemischte Zustand für alle, die
          nicht auf den Bildschirm schauen:
        </p>
        <pre class="code-block"><code>{{ indeterminateFixSnippet }}</code></pre>
        <p class="src-note">
          Das ist ein Muster zum Übernehmen, kein Snippet aus der Produktion — geschrieben gegen dieselbe
          <code>inputId</code>, die dir die Komponente schon gibt, also kostet die Übernahme nichts.
        </p>
        <p class="src-note">
          <strong>Noch eine scharfe Kante.</strong> <code>indeterminate</code> ist ein einfacher <code>&#64;Input</code>,
          dessen Wert in <code>ngOnChanges</code> in ein internes Signal kopiert wird
          (<code>openng-optimus-ui-checkbox.mjs:240-244</code>; PrimeNG&nbsp;22 erledigte dasselbe in einem
          <code>effect</code> im Konstruktor), und <code>updateModel</code> leert dieses
          Signal nach jedem Klick (:273-275). Weil <code>ngOnChanges</code> nur feuert, wenn sich der <em>gebundene</em>
          Wert ändert, stellt ein Binding, das nach dem Klick noch <code>true</code> ist, den Zustand nicht wieder her.
          Leite ihn aus den Kindern ab (wie oben), damit der Wert wirklich wechselt, statt ihn auf eine Konstante zu
          nageln.
        </p>

        <h3>Gruppierung: was den Namen wirklich trägt</h3>
        <p>
          Eine einzelne Checkbox benennt sich mit ihrem Label. Eine <em>Gruppe</em> braucht einen zweiten Namen — die
          Frage, die die Boxen beantworten —, und den liefert weder Optimus noch die Checkbox selbst. Es gibt kein
          <code>p-checkbox-group</code> in Optimus&nbsp;UI 2.0.2 — der Einstiegspunkt exportiert <code>Checkbox</code>,
          <code>CheckboxModule</code>, <code>CheckboxClasses</code>, <code>CheckboxStyle</code> und den Value Accessor,
          und keinerlei Gruppe —, also ist das dein Markup. Alle drei Formen unten sind live gerendert und gemessen:
        </p>
        <div class="ex__stage">
          <fieldset class="cb-group cb-group--tight" id="gp-fieldset">
            <legend>Fieldset und Legend</legend>
            <div class="cb-row">
              <p-checkbox inputId="gp-fs-a" [binary]="true" [ngModel]="gpA()" (ngModelChange)="gpA.set($event)" />
              <label for="gp-fs-a">Erste</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="gp-fs-b" [binary]="true" [ngModel]="false" />
              <label for="gp-fs-b">Zweite</label>
            </div>
          </fieldset>
          <div role="group" aria-labelledby="gp-role-label" id="gp-role" class="cb-col">
            <span class="pg__label" id="gp-role-label">Rolle group mit aria-labelledby</span>
            <div class="cb-row">
              <p-checkbox inputId="gp-rl-a" [binary]="true" [ngModel]="gpB()" (ngModelChange)="gpB.set($event)" />
              <label for="gp-rl-a">Erste</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="gp-rl-b" [binary]="true" [ngModel]="false" />
              <label for="gp-rl-b">Zweite</label>
            </div>
          </div>
          <div id="gp-none" class="cb-col">
            <span class="pg__label">Eine Beschriftung und sonst nichts</span>
            <div class="cb-row">
              <p-checkbox inputId="gp-nn-a" [binary]="true" [ngModel]="gpC()" (ngModelChange)="gpC.set($event)" />
              <label for="gp-nn-a">Erste</label>
            </div>
            <div class="cb-row">
              <p-checkbox inputId="gp-nn-b" [binary]="true" [ngModel]="false" />
              <label for="gp-nn-b">Zweite</label>
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Muster</th>
                <th>Gemessene zugängliche Gruppe</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code></td>
                <td>{{ m.groupFieldset }}</td>
                <td>
                  <strong>Bevorzugt.</strong> Kein ARIA nötig, übersteht einen Stylesheet-Reset, und die Legend ist auch
                  für sehende Nutzer eine echte Überschrift.
                </td>
              </tr>
              <tr>
                <td><code>role="group"</code> + <code>aria-labelledby</code></td>
                <td>{{ m.groupRole }}</td>
                <td>
                  <strong>Funktioniert.</strong> Greif dazu, wenn <code>&lt;fieldset&gt;</code>
                  gegen dein Layout arbeitet — es hat hartnäckige Standardstile und ein
                  <code>min-width: min-content</code>, das Flex-/Grid-Kinder zerbricht.
                </td>
              </tr>
              <tr>
                <td>Eine Überschrift oder ein <code>&lt;span&gt;</code> über den Boxen</td>
                <td>{{ m.groupNone }}</td>
                <td>
                  <strong>Scheitert.</strong> Optische Nachbarschaft ist keine Beziehung (WCAG SC 1.3.1) — und genau in
                  diese Form fällt eine Gruppe von selbst, weil die Überschrift schon wie der Name aussieht.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus dem Accessibility Tree: der Knoten, dem die Checkboxen gehören, für jede der drei Formen. Wenn du
          <code>&lt;fieldset&gt;</code> nutzt, setz es bewusst zurück —
          <code>border: 0; margin: 0; padding: 0; min-width: 0</code> —, statt das Element wegen seiner
          Standardwerte zu meiden.
        </p>

        <h3>Formulare</h3>
        <p>
          <code>p-checkbox</code> ist ein <code>ControlValueAccessor</code> und rendert, anders als <code>p-select</code>,
          <em>außerdem</em> ein echtes Formularelement. Das hat zwei Folgen, die du kennen solltest: Das Input nimmt am
          nativen Absenden teil, wenn du ihm einen <code>name</code> gibst und es in einem <code>&lt;form&gt;</code> steht,
          und eine <strong>nicht angehakte</strong> Box steuert überhaupt nichts zu den abgesendeten Daten bei — das
          Fehlen ist das „false“. Braucht ein Backend ein ausdrückliches false, sende das Modell, nicht das Formular.
        </p>
        <p class="src-note">
          <code>[attr.name]="name()"</code> und <code>[attr.required]="required() ? '' : undefined"</code> bei
          <code>openng-optimus-ui-checkbox.mjs:321, 324</code>; das Verhalten beim Absenden ist die WHATWG-Regel, die
          unter Quellen verlinkt ist.
          Abgeleitet aus Spezifikation und Quellcode, nicht aus einem gerenderten nativen Absenden — prüf es nach, wenn du
          dich darauf verlässt.
        </p>

        <h3>readonly ist nicht, was es sagt</h3>
        <p>
          <code>[readonly]="true"</code> rendert das Attribut <code>readonly</code> auf dem Input
          (<code>openng-optimus-ui-checkbox.mjs:325</code>) — aber <code>readonly</code> hat in HTML keine Wirkung auf
          eine Checkbox. Der
          Browser schaltet das Input trotzdem um; nur <code>handleChange</code> (:278-282) weigert sich, das Modell zu
          aktualisieren. Die sichtbare Box bleibt deshalb im alten Zustand, während das Input darunter umgesprungen ist. {{ m.readonlyNote }} Wenn
          du „kann nicht geändert werden“ meinst, nimm <code>[disabled]="true"</code>; wenn du „zur Information
          angezeigt“ meinst, render Text.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Benennung: Das Muster, das bei einem Select scheitert, funktioniert hier</h4>
        <p>
          Die vier Muster unten sind live nebeneinander gerendert, damit die Tabelle darunter berichten kann, was der
          Accessibility Tree über jedes davon tatsächlich sagt. Die Spalte „Name“ ist das, was ein Screenreader ansagt.
        </p>
        <div class="ex__stage">
          <div class="cb-row">
            <p-checkbox inputId="nm-label" [binary]="true" [ngModel]="nmA()" (ngModelChange)="nmA.set($event)" />
            <label for="nm-label">Label mit for + inputId</label>
          </div>
          <div class="cb-row">
            <p-checkbox
              inputId="nm-aria"
              [binary]="true"
              ariaLabel="Input ariaLabel"
              [ngModel]="nmB()"
              (ngModelChange)="nmB.set($event)"
            />
            <span aria-hidden="true">Input ariaLabel</span>
          </div>
          <div class="cb-row">
            <p-checkbox
              inputId="nm-host"
              [attr.aria-label]="'aria-label auf dem Host'"
              [binary]="true"
              [ngModel]="nmC()"
              (ngModelChange)="nmC.set($event)"
            />
            <span aria-hidden="true">aria-label auf dem Host</span>
          </div>
          <div class="cb-row">
            <p-checkbox inputId="nm-none" [binary]="true" [ngModel]="nmD()" (ngModelChange)="nmD.set($event)" />
            <span aria-hidden="true">Gar nichts</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Muster</th>
                <th>Gemessener zugänglicher Name</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;label for="x"&gt;</code> + <code>inputId="x"</code></td>
                <td>{{ m.nameLabelFor }}</td>
                <td>
                  <strong>Funktioniert — und ist die Standardwahl.</strong> Das fokussierbare Element ist ein echtes
                  <code>&lt;input type="checkbox"&gt;</code>, und das ist beschriftbar.
                </td>
              </tr>
              <tr>
                <td><em>Inputs</em> <code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td>{{ m.nameAriaInput }}</td>
                <td>
                  <strong>Funktioniert.</strong> An das Input gebunden (<code>openng-optimus-ui-checkbox.mjs:327-328</code>;
                  die Inputs selbst sind einfache <code>&#64;Input</code>s bei :110 / :115). Nur nutzen,
                  wenn es kein sichtbares Label gibt — du verlierst die zweite Klickfläche.
                </td>
              </tr>
              <tr>
                <td><code>[attr.aria-label]</code> auf dem Host <code>&lt;p-checkbox&gt;</code></td>
                <td>{{ m.nameHostAttr }}</td>
                <td>
                  <strong>Scheitert.</strong> Der Host hat keine Rolle; das Attribut erreicht das Input nie. Dieselbe Falle
                  wie bei <code>p-select</code>.
                </td>
              </tr>
              <tr>
                <td>Nichts — eine nackte Box mit Text daneben</td>
                <td>{{ m.nameNone }}</td>
                <td><strong>Scheitert.</strong> Wird als unbenannte Checkbox angesagt.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Namen gelesen aus dem Accessibility Tree, ein Knoten pro
          <code>inputId</code>. Der Mechanismus ist im Quellcode sichtbar: Das Input trägt
          <code>[attr.id]="inputId"</code> (:318) und <code>[attr.aria-labelledby]</code> /
          <code>[attr.aria-label]</code> (:327-328), während der Host nur <code>class</code> und
          <code>data-p-*</code>-Attribute bindet.
        </p>

        <h4>Tastatur</h4>
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
                <td><kbd>Tab</kbd></td>
                <td>
                  Fokus hinein / hinaus. Jede Checkbox einer Gruppe ist ein eigener Tab-Stopp — das ist richtig, und es
                  ist der Unterschied zu einer Radio-Gruppe.
                </td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Schaltet um. Das erledigt der Browser nativ; Optimus fügt überhaupt keinen Tasten-Handler hinzu.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>
                  Nichts — es sendet das umgebende Formular ab, wie bei jeder nativen Checkbox. Häng keinen Handler dafür an.
                </td>
              </tr>
              <tr>
                <td>Pfeiltasten</td>
                <td>Nichts. Checkboxen sind unabhängig; das Wandern mit den Pfeiltasten ist der Vertrag der Radio-Gruppe.</td>
              </tr>
              <tr>
                <td>Klick aufs Label</td>
                <td>
                  Schaltet um, weil <code>&lt;label for&gt;</code> die Aktivierung an das Input weiterreicht. Dieses
                  Verhalten bekommst du gratis — aber nur, wenn du ein echtes Label nutzt.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-checkbox.mjs</code> bindet <code>focus</code>, <code>blur</code> und <code>change</code> auf dem
          Input (:332-334) und <strong>keinen</strong> <code>keydown</code>-Handler — jedes Tastenverhalten oben ist das
          eigene des Browsers, und deshalb ist es verlässlich.
        </p>

        <h4>Bekannte Lücken — überdeck sie nicht stillschweigend</h4>
        <ul>
          <li>
            <strong>Kein gemischter Zustand für assistive Technik.</strong> Die Messung oben. Das ist eine Lücke
            upstream; den Workaround musst du an jeder Aufrufstelle selbst anwenden.
          </li>
          <li>
            <strong>Der Host verschluckt ARIA.</strong> <code>[attr.aria-describedby]</code>,
            <code>[attr.aria-label]</code> und Verwandte auf <code>&lt;p-checkbox&gt;</code> sind stillschweigend
            wirkungslos. Ein Input <code>ariaDescribedBy</code> gibt es auch nicht — aber es gibt zwei funktionierende
            Wege: Nimm die Beschreibung in den Label-Text auf, oder schieb das Attribut mit dem Pass-through
            <code>pt</code> auf das echte Input. Siehe den nächsten Abschnitt.
          </li>
          <li>
            <strong>Zielgröße.</strong> {{ m.hitNormal }} liegt unter der Untergrenze von 24&nbsp;px aus WCAG 2.2 SC 2.5.8 —
            liefere immer das klickbare Label mit.
          </li>
          <li>
            <strong>Keine Gruppensemantik.</strong> Optimus liefert keine Gruppen-Komponente; wenn du das
            <code>&lt;fieldset&gt;</code> nicht schreibst, tut es niemand.
          </li>
        </ul>

        <h4>Das echte Input erreichen: der Pass-through <code>pt</code></h4>
        <p>
          Die Komponente bindet <code>[pBind]="ptm('input')"</code> auf dem Input-Element
          (<code>openng-optimus-ui-checkbox.mjs:331</code>), und <code>pt</code> ist ein Input von
          <code>BaseComponent</code> (<code>openng-optimus-ui-basecomponent.d.ts:51</code>). Jedes Attribut, das du nicht
          über ein benanntes Input übergeben kannst — <code>aria-describedby</code>, <code>autocomplete</code>, ein
          <code>data-*</code>-Hook für Tests —, lässt sich also auf das Element leiten, das die Rolle tatsächlich trägt:
        </p>
        <div class="ex__stage">
          <div class="cb-col">
            <div class="cb-row">
              <p-checkbox
                inputId="pt-demo"
                [binary]="true"
                [pt]="ptDemoConfig"
                [ngModel]="ptDemo()"
                (ngModelChange)="ptDemo.set($event)"
              />
              <label for="pt-demo">Auch das Archiv löschen</label>
            </div>
            <p class="ex__note" id="pt-demo-desc">Das lässt sich nicht rückgängig machen, sobald der Job gelaufen ist.</p>
          </div>
        </div>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          Live gemessen am Exemplar oben: {{ m.ptDescribedBy }} Bevorzuge ein <code>&lt;label&gt;</code>, das schon alles
          sagt; greif zu <code>pt</code>, wenn der zusätzliche Text eine <em>Beschreibung</em> bleiben muss, statt Teil
          des Namens zu werden.
        </p>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>
            ☐ Jede Checkbox hat ein echtes <code>&lt;label for&gt;</code>, das auf ihre <code>inputId</code> zeigt — kein
            nacktes <code>&lt;span&gt;</code> daneben.
          </li>
          <li>
            ☐ Kein <code>[attr.aria-*]</code> auf dem Host <code>&lt;p-checkbox&gt;</code> soll Accessibility-Arbeit leisten.
          </li>
          <li>
            ☐ Mehr als eine Checkbox → ein <code>&lt;fieldset&gt;&lt;legend&gt;</code> (oder <code>role="group"</code> +
            <code>aria-labelledby</code>), das die Frage trägt.
          </li>
          <li>☐ Die Wahl ist wirklich nicht exklusiv. Ist genau eine Antwort erlaubt, ist es eine Radio-Gruppe.</li>
          <li>☐ Die Änderung wirkt beim Absenden. Wirkt sie sofort, ist es ein Switch.</li>
          <li>☐ Labels sind positiv formuliert und tragen je eine Aussage; keine Einwilligung wird vorangehakt ausgeliefert.</li>
          <li>☐ Der Fokus ist in <strong>beiden</strong> Themes sichtbar, hell und dunkel — prüf es, nimm es nicht an.</li>
          <li>
            ☐ Nutzt du <code>indeterminate</code>? Dann sind auch die DOM-Property und <code>aria-checked="mixed"</code>
            gesetzt, und der Wert der Eltern-Box ist nie das, was abgesendet wird.
          </li>
          <li>☐ <code>readonly</code> wird nicht dort genutzt, wo <code>disabled</code> gemeint ist.</li>
          <li>
            ☐ Gruppen-Bindings nutzen ein Array mit <code>value</code> oder unabhängige Booleans mit
            <code>[binary]="true"</code> — keine wirre Mischung.
          </li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die zwei Regeln festnagelt, für deren Schutz dieser Guide
          existiert — das Label benennt wirklich das Input, und der Host trägt kein ARIA:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Jeder String hier gehört dir</h3>
        <p>
          Ein angenehmer Unterschied zu <code>p-select</code>: Die Checkbox liefert <strong>keinen</strong> eingebauten
          Text. Es gibt keinen Platzhalter, kein „Option List“, nirgends in der Komponente ein fest verdrahtetes
          englisches <code>aria-label</code> — das Template enthält ein <code>&lt;input&gt;</code>, ein
          <code>&lt;div&gt;</code> und ein Icon, und jedes Wort auf dem Bildschirm kommt aus deinem
          <code>&lt;label&gt;</code>. Nichts an einer Checkbox braucht
          <code>provideOptimus(&#123; translation &#125;)</code>.
        </p>
        <p class="src-note">
          Geprüft, indem das ganze Template gelesen wurde (<code>openng-optimus-ui-checkbox.mjs:316-351</code>): Das
          einzige ARIA, das die
          Komponente ausgibt, ist das, was du über <code>ariaLabel</code> / <code>ariaLabelledBy</code> hineingegeben hast.
        </p>
        <ul>
          <li>
            <strong>Das Label</strong> — binde es an einen Übersetzungsschlüssel, genau wie jeden anderen Text. Das Muster
            des Kits ist der <code>TranslationService</code>, aufgelöst über ein <code>computed()</code>, damit ein
            Sprachwechsel neu rendert.
          </li>
          <li>
            <strong>Die Legend</strong> — die Frage der Gruppe ist auch ein String, und genau den vergisst man, weil er
            wie eine Überschrift aussieht und nicht wie das Label eines Steuerelements.
          </li>
          <li><strong>Die Fehlermeldung</strong>, die zu <code>[invalid]</code> gehört.</li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Länge: Das Label bricht um, und das ändert das Layout</h3>
        <p>
          Deutsche Einwilligungssätze sind 20–40 % länger als englische („Ich stimme der Verarbeitung meiner Daten zu“
          gegenüber „I agree to data processing“), und ein Checkbox-Label
          <em>bricht um</em> — es wird nicht abgeschnitten wie der Auslöser eines Selects. Zwei Folgen: Die Zeile muss
          <code>align-items: flex-start</code> haben, damit die Box in der ersten Zeile bleibt, und ein zweispaltiges
          Raster aus Checkboxen franst in den längeren Sprachen aus. Teste das Layout in der längsten Sprache, die du
          auslieferst, nicht auf Englisch.
        </p>
        <pre class="code-block"><code>{{ wrapSnippet }}</code></pre>

        <h3>Bau keinen Satz aus Bruchstücken</h3>
        <p>
          Die verlockende Form ist ein interpoliertes „I accept the“, gefolgt von einem eigenen Link, dessen Text ein
          zweiter Schlüssel ist:
        </p>
        <pre class="code-block"><code>{{ fragmentSnippet }}</code></pre>
        <p>
          Das zerbricht in jeder Sprache mit anderer Wortstellung, und es setzt den halben Satz außerhalb des Labels.
          Übersetze den ganzen Satz als einen Schlüssel mit einem Platzhalter für den Link, und halte jedes Bruchstück
          <em>innerhalb</em> des <code>&lt;label&gt;</code>.
        </p>

        <h3>Ein Link in einem Label ist ein echter Konflikt</h3>
        <p>
          „Ich akzeptiere die <em>Nutzungsbedingungen</em>“ mit <em>Nutzungsbedingungen</em> als Link setzt ein zweites
          interaktives Element in das Label: Ein Klick auf den Link schaltet auch die Checkbox um, und Screenreader sagen
          den Link-Text als Teil des Checkbox-Namens an. Die ehrlichen Lösungen sind, den Link aus dem Label heraus und
          daneben zu setzen oder die Nutzungsbedingungen über einen eigenen Button in einem Dialog zu öffnen. Kämpf nicht
          mit <code>stopPropagation</code> dagegen an — das Problem mit der Ansage bleibt.
        </p>

        <h3>RTL: Hier passt alles</h3>
        <p>
          Das ausgelieferte Stylesheet positioniert das Input mit <code>inset-block-start</code> /
          <code>inset-inline-start</code>, also mit logischen Properties, sodass das Overlay der Schreibrichtung folgt.
          Was <strong>nicht</strong> automatisch folgt, ist deine eigene Zeile: Nimm <code>gap</code> und die
          Flex-Reihenfolge statt <code>margin-right</code>, dann spiegelt sich die Zeile gratis.
        </p>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui-styles/dist/checkbox/index.mjs</code> (<code
            >.p-checkbox-input &#123; inset-block-start: 0; inset-inline-start: 0 &#125;</code
          >). Nicht durch das Rendern einer RTL-Locale geprüft — das Kit liefert keine aus.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Zeile zur
            Fokus-Outline und die WCAG-Zusammenfassung zitieren die Zeilen „focus ring“ des Gates (ab 3,88:1) statt
            „brand foreground“.
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Kontrasttabelle auf die geprüften CONTRAST.MD-Zeilen umgestellt: Der Rand
            ohne Häkchen ist <code>--control-border</code> (≥ 3,85:1), die dunkle Füllung der dunkle Vordergrund der
            Palette; der Rand im ungültigen Zustand ist das Rot des Kits.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Farben als Token für die visuellen Stile neu formuliert (ADR-0016): Die Zustandstabelle nennt
            Aura-Token, die Kontrasttabelle ist als Standardpalette von Aura gekennzeichnet (die Stile des Kits
            sind nicht im Kontrast-Gate), und der Fokus-Ring verweist auf die CONTRAST.MD-Zeilen
            „brand foreground“. „Keine Checkbox-Regel in styles.scss“ korrigiert (der Fokus-Ring ist
            eine); Aussage zu schmalen Bildschirmen ergänzt; Historie mit dem Neuesten zuerst sortiert.
          </li>
          <li>
            <strong>v0.5</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014): Die Skala der Box liegt wieder
            auf den Token von Aura&nbsp;2.x, 1 / 1.25 / 1.5rem, also erfüllt <code>large</code> (24&nbsp;×&nbsp;24) jetzt
            SC 2.5.8, während <code>small</code> und die Standardgröße es weiter verfehlen — der Befund „jede Größe
            verfehlt es“ gilt nicht mehr.
            <code>styleClass</code> gibt es wieder als veraltetes Input, <code>checked</code> ist ein einfacher Getter
            statt eines <code>computed()</code>, und <code>indeterminate</code> wird von <code>ngOnChanges</code>
            gespiegelt statt von einem <code>effect</code> im Konstruktor. Alle Verweise auf Zeilen im Quellcode neu gegen
            <code>openng-optimus-ui-checkbox.mjs</code> abgeleitet; Kontrast- und Fokus-Ring-Zahlen wurden nicht neu
            gemessen (die Farb-Token sind unverändert).
          </li>
          <li>
            <strong>v0.4</strong> — 23.08.2026 — Neu gemessen gegen PrimeNG 22.1.0 / Themes 3.0.0. Aura 3.0 hat die
            Skala der Box von 16/20/24 auf 14/18/20&nbsp;px verkleinert (Standard neu gemessen mit 18&nbsp;×&nbsp;18),
            also erreicht keine Größe für sich allein die 24px aus SC 2.5.8. Die <code>:has()</code>-Familienregel des Kits
            überschreibt jetzt den 1px-Ring von Aura mit dem 2px-Standard des Kits (im Browser geprüft, beide Themes).
            Verweise auf Zeilen im Quellcode auf den Build 22.1 aktualisiert; <code>styleClass</code> ist entfernt,
            <code>formControl</code> ist neu, und das Input trägt jetzt ein wirkungsloses Attribut
            <code>readonly</code>. Die Farb-Token sind unverändert, also gelten die gemessenen Kontrastwerte weiter.
          </li>
          <li>
            <strong>v0.3</strong> — 20.08.2026 — Zusammenfassung zum Stand von WCAG 2.2 im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.2</strong> — 30.07.2026 — Zählungen der Aufrufstellen und Zuordnungen zu einzelnen Dateien entfernt;
            Messmethoden auf ihre Quellenangaben reduziert.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erste Fassung des Guides: die Tabelle Checkbox / Radio / Switch, ein
            Live-Playground, vier gerenderte Do/Don’t-Paare, ein an Aura gemessener Tab Design und das kanonische
            Agent-Dokument.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class CheckboxArticleDeComponent extends CheckboxArticleComponent {
  /** The measured values of the English article, with the prose around them in German. */
  override readonly m = {
    // --- geometry ---
    boxSmall: '16 × 16 px',
    boxNormal: '20 × 20 px',
    boxLarge: '24 × 24 px',
    hitSmall: '16 × 16 px',
    hitNormal: '20 × 20 px',
    hitLarge: '24 × 24 px',
    radius: '{border.radius.sm} (Aura 4px; 0 im visuellen Standardstil)',
    transition: '0.2s',
    // --- color, light theme ---
    restBorderLight: '--control-border auf einer Füllung surface.0',
    checkedBgLight: 'primary.500 (der Akzent)',
    checkedIconLight: 'Primary-Kontrastfarbe (Weiß)',
    focusOutlineLight: '2px solid --primary-color-fg, Offset 2px (Regel des Kits)',
    // --- color, dark theme ---
    restBorderDark: '--control-border auf einer Füllung surface.950',
    checkedBgDark: 'primary.500 (der dunkle Vordergrund des Akzents)',
    checkedIconDark: 'Primary-Kontrastfarbe (surface.900)',
    focusOutlineDark: '2px solid --primary-color-fg, Offset 2px (Regel des Kits)',
    disabledNote:
      'Die Opacity bleibt in beiden Themes 1; die Box nimmt {form.field.disabled.background} und das Zeichen ' +
      '{form.field.disabled.color}. Achtung: Eine deaktivierte ANGEHAKTE Box verliert die Primary-Füllung komplett — ' +
      'deaktiviert-an und deaktiviert-aus unterscheiden sich nur durch ein blasses Zeichen.',
    // --- contrast ranges from docs/generated/CONTRAST.MD ---
    contrastRestBorderLight: '3,85–5,23 : 1 — erfüllt',
    contrastRestBorderDark: '3,97–5,51 : 1 — erfüllt',
    contrastCheckedLight: '4,75–17,85 : 1 — erfüllt',
    contrastCheckedDark: '4,75–17,58 : 1 — erfüllt',
    contrastGlyphLight: '5,18–17,85 : 1 — erfüllt',
    contrastGlyphDark: '6,40–16,93 : 1 — erfüllt',
    contrastFocusLight: '4,42–17,85 : 1 auf ground, card, section — erfüllt („focus ring“)',
    contrastFocusDark: '3,88–17,58 : 1 auf ground, card, section — erfüllt („focus ring“)',
    // --- accessibility tree ---
    nameLabelFor: '„Label mit for + inputId“ — der Label-Text',
    nameAriaInput: '„Input ariaLabel“ — der Wert des Inputs',
    nameHostAttr: '„“ — leer',
    nameNone: '„“ — leer',
    groupFieldset: 'ein group-Knoten mit dem Namen „Fieldset und Legend“, dem beide Boxen gehören',
    groupRole: 'ein group-Knoten mit dem Namen „Rolle group mit aria-labelledby“, dem beide Boxen gehören',
    groupNone: 'überhaupt kein group-Knoten — die beiden Boxen haben keinen gemeinsamen Besitzer',
    indeterminateA11y:
      'Gelesen an einer Eltern-Box im gemischten Zustand, während das Minus auf dem Bildschirm stand: Der ' +
      'Accessibility Tree meldet die Rolle „checkbox“, checked FALSE. Nicht „mixed“ — ' +
      'schlicht nicht angehakt. Einem Screenreader-Nutzer wird gesagt, die Eltern-Box sei aus, und den dritten ' +
      'Zustand, der ihm gezeigt wird, gibt es für ihn nicht.',
    indeterminateEvidence:
      'input.indeterminate === false, input.checked === false, aria-checked === null, ' +
      'svg[data-p-icon=minus] vorhanden, Host-Klasse ohne p-checkbox-checked; der Knoten im Accessibility ' +
      'Tree meldete checked: false.',
    ptDescribedBy:
      'Das Attribut landete auf dem Input (aria-describedby="pt-demo-desc"), der Host trug ' +
      'keines, und der Knoten im Accessibility Tree meldete den Namen „Auch das Archiv löschen“ mit der ' +
      'Beschreibung „Das lässt sich nicht rückgängig machen, sobald der Job gelaufen ist.“ Die Beschreibung ist ' +
      'also echt, und sie blieb aus dem Namen heraus.',
    readonlyNote:
      'Gemessen: Ein Klick auf die schreibgeschützte Box ließ die Host-Klasse ohne p-checkbox-checked (die ' +
      'sichtbare Box rührte sich nicht), während input.checked von false auf true sprang — der gerenderte ' +
      'Zustand und das echte Steuerelement widersprechen sich jetzt, und der Accessibility Tree folgt dem Input.',
  };

  /** The measured name of the "Don't" naming example, quoted in the Usage tab. */
  override readonly ddNameBadMeasured: string = '„“ — leer, eine unbenannte Checkbox';

  override readonly sizeOptions = [
    { label: 'Klein', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Groß', value: 'large' },
  ];

  override readonly channels = [
    { label: 'E-Mail', value: 'email' },
    { label: 'Push-Nachricht', value: 'push' },
    { label: 'SMS', value: 'sms' },
    { label: 'Posteingang in der App', value: 'inapp' },
  ];
  override readonly exChannelsText = computed(() =>
    this.exChannels().length ? `[${this.exChannels().join(', ')}]` : '[] (leer — eine gültige Antwort)',
  );

  override readonly events = [
    { key: 'views', label: 'Seitenaufrufe' },
    { key: 'clicks', label: 'Klick-Ereignisse' },
    { key: 'errors', label: 'Fehlerberichte' },
  ];
  override readonly treeStateText = computed<string>(() =>
    this.treeAll() ? 'angehakt' : this.treeSome() ? 'indeterminate (nur optisch)' : 'nicht angehakt',
  );
}
