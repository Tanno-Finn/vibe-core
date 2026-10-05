import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MessageService, type ToastMessageOptions } from '@openng/optimus-ui/api';
import { FeedbackMessagesArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './feedback-messages-article.component';

/**
 * German twin of the Feedback Messages guide (ADR-0018). Same template structure as the English
 * canonical, prose translated; code, identifiers and measured values stay as in English.
 */
@Component({
  selector: 'app-feedback-messages-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  providers: [MessageService],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'feedback-messages'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Komponenten, eine Aufgabe: sagen, was gerade passiert ist. <code>p-message</code> ist ein Kasten im
          Layout — er steht neben der Sache, um die es geht, und bleibt, bis ihn etwas entfernt. <code>p-toast</code>
          ist ein Overlay, das in einer Ecke erscheint und nach Ablauf eines Timers verschwindet. Alles hier unten ist
          live, auch die Messinstrumente, denn die Unterschiede, auf die es ankommt, liegen im Accessibility Tree und
          im Timing, nicht im Markup.
        </p>

        <!-- The two shapes -->
        <section class="pg" aria-label="Inline-Meldung und Toast nebeneinander">
          <div class="two">
            <div class="two__cell">
              <span class="two__title">Inline — <code>p-message</code></span>
              <p-message severity="warn"> Deine Sitzung läuft in 5 Minuten ab. Speichere deinen Entwurf, um ihn zu behalten. </p-message>
              <p class="two__note">Im Fluss, schiebt den Inhalt darunter nach unten. Nichts entfernt sie außer dir.</p>
            </div>
            <div class="two__cell">
              <span class="two__title">Overlay — <code>p-toast</code></span>
              <p-button label="Entwurf speichern" size="small" (onClick)="demoSave()" />
              <p class="two__note">
                Über der Seite, nach drei Sekunden weg, keine Kosten im Layout — und keine zweite Chance, ihn zu lesen.
              </p>
            </div>
          </div>
        </section>

        <h3>Die Inline-Matrix</h3>
        <p>
          Sechs Severities über drei Varianten. Die Standardvariante ist gefüllt, <code>outlined</code> lässt den
          Hintergrund weg und behält den Rahmen, <code>simple</code> lässt beides weg und übrig bleibt farbiger Text. Der
          Tab Design listet den Kontrast jeder Zelle dieses Rasters gegen ihre Fläche in beiden Themes.
        </p>
        <div class="mx-controls">
          <div class="pg__field">
            <span class="pg__label" id="mx-size-label">size</span>
            <p-select
              [ariaLabelledBy]="'mx-size-label'"
              size="small"
              [options]="sizeOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="mxSize()"
              (ngModelChange)="mxSize.set($event)"
            />
          </div>
          <div class="pg__field pg__field--switch">
            <label for="mx-icon">Icon anzeigen</label>
            <p-toggleswitch inputId="mx-icon" [ngModel]="mxIcon()" (ngModelChange)="mxIcon.set($event)" />
          </div>
          <div class="pg__field pg__field--switch">
            <label for="mx-closable">closable</label>
            <p-toggleswitch inputId="mx-closable" [ngModel]="mxClosable()" (ngModelChange)="mxClosable.set($event)" />
          </div>
        </div>
        <div class="mx">
          @for (variant of variants; track variant.value) {
            <div class="mx__col">
              <span class="mx__head">{{ variant.label }}</span>
              @for (sev of severities; track sev) {
                <p-message
                  [severity]="sev"
                  [variant]="variant.value"
                  [size]="mxSize()"
                  [closable]="mxClosable()"
                  [icon]="mxIcon() ? iconFor(sev) : undefined"
                  [attr.data-mx]="sev + '/' + (variant.value || 'filled')"
                >
                  {{ sev }} — Franz jagt im komplett verwahrlosten Taxi
                </p-message>
              }
            </div>
          }
        </div>

        <h3>Eine Inline-Meldung zu schließen entfernt nichts</h3>
        <p>
          <code>closable</code> gibt dir einen Schließen-Button; ein Druck darauf setzt ein internes Signal und spielt
          eine Einklapp-Animation ab. Das Element ist danach immer noch da — eingeklappt, bei Opacity 0 und im
          Accessibility Tree weiterhin ein <code>alert</code>. Drück beide Schließen-Buttons, dann miss.
        </p>
        <div class="two">
          <div class="two__cell">
            <span class="two__title">Nur <code>closable</code></span>
            <div class="probe" data-probe="bare">
              <p-message severity="info" [closable]="true"> Schließbar, und niemand hört darauf. </p-message>
            </div>
          </div>
          <div class="two__cell">
            <span class="two__title">Closable + <code>&#64;if</code></span>
            <div class="probe" data-probe="wired">
              @if (wiredVisible()) {
                <p-message severity="info" [closable]="true" (onClose)="wiredVisible.set(false)">
                  Schließbar, und der Host entfernt sie.
                </p-message>
              }
            </div>
          </div>
        </div>
        <div class="inst">
          <p-button label="Beide Proben messen" size="small" severity="secondary" (onClick)="measureProbes()" />
          <p-button label="Zurücksetzen" size="small" severity="secondary" [text]="true" (onClick)="resetProbes()" />
          <dl class="inst__out">
            <div>
              <dt>Probe ohne Verdrahtung</dt>
              <dd>{{ probeBare() }}</dd>
            </div>
            <div>
              <dt>verdrahtete Probe</dt>
              <dd>{{ probeWired() }}</dd>
            </div>
          </dl>
        </div>

        <h3>Überschreiben, was sie ansagt</h3>
        <p>
          Eine Inline-Meldung ist ein <code>alert</code>, ob sie es verdient oder nicht. Ein schreibgeschützter Hinweis,
          der ab dem ersten Rendern auf der Seite steht, muss niemanden unterbrechen; eine Validierungs-Zusammenfassung,
          die nach einem gescheiterten Absenden erscheint, schon. Der Pass-through ist der einzige Weg zu dieser
          Entscheidung — es gibt kein Input —, und er wird aus einem Lifecycle-Hook angewendet, landet also
          <em>nach</em> den eigenen Attributen des Templates, statt gegen sie zu verlieren.
        </p>
        <div class="inst">
          <div class="pg__field">
            <span class="pg__label" id="pt-label">pt.root</span>
            <p-select
              [ariaLabelledBy]="'pt-label'"
              size="small"
              [options]="ptOptions"
              optionLabel="label"
              optionValue="value"
              [ngModel]="ptMode()"
              (ngModelChange)="ptMode.set($event)"
            />
          </div>
          <div class="probe" data-probe="pt">
            <p-message severity="info" [pt]="ptObject()"> Dieses Dokument ist schreibgeschützt. </p-message>
          </div>
          <p-button label="Das gerenderte Element auslesen" size="small" severity="secondary" (onClick)="measurePt()" />
          <dl class="inst__out">
            <div>
              <dt>gerenderte Attribute</dt>
              <dd>{{ ptOut() }}</dd>
            </div>
            <div>
              <dt>variant="text"</dt>
              <dd>{{ variantTextOut() }}</dd>
            </div>
          </dl>
          <div class="probe" data-probe="variant-text">
            <p-message severity="info" variant="text"> Eine Variante, die die Typings anbieten und das Theme nicht. </p-message>
          </div>
        </div>

        <h3>Toast-Playground</h3>
        <p>
          Eine <code>p-toast</code>-Instanz, gesteuert über <code>MessageService.add()</code>. Der Code unter den
          Reglern ist der Aufruf, nicht das Markup — das Markup ist ein Tag mit einer Position.
        </p>
        <section class="pg" aria-label="Toast-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>
              <div class="pg__field">
                <span class="pg__label" id="tg-sev-label">severity</span>
                <p-select
                  [ariaLabelledBy]="'tg-sev-label'"
                  size="small"
                  [options]="severityOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="tgSeverity()"
                  (ngModelChange)="tgSeverity.set($event)"
                />
              </div>
              <div class="pg__field">
                <span class="pg__label" id="tg-pos-label">position</span>
                <p-select
                  [ariaLabelledBy]="'tg-pos-label'"
                  size="small"
                  [options]="positionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="tgPosition()"
                  (ngModelChange)="tgPosition.set($event)"
                />
              </div>
              <div class="pg__field">
                <span class="pg__label" id="tg-life-label">life (ms)</span>
                <p-select
                  [ariaLabelledBy]="'tg-life-label'"
                  size="small"
                  [options]="lifeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="tgLife()"
                  (ngModelChange)="tgLife.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="tg-sticky">sticky <span class="pg__aside">(ignoriert life)</span></label>
                <p-toggleswitch inputId="tg-sticky" [ngModel]="tgSticky()" (ngModelChange)="tgSticky.set($event)" />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="tg-closable">closable</label>
                <p-toggleswitch
                  inputId="tg-closable"
                  [ngModel]="tgClosable()"
                  (ngModelChange)="tgClosable.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="tg-detail">Detailzeile</label>
                <p-toggleswitch inputId="tg-detail" [ngModel]="tgDetail()" (ngModelChange)="tgDetail.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Auslöser</span>
              <div class="pg__stage">
                <p-button label="Toast zeigen" size="small" (onClick)="showToast()" />
                <p-button label="Drei zeigen" size="small" severity="secondary" (onClick)="showThree()" />
                <p-button
                  label="Alle sechs Severities zeigen"
                  size="small"
                  severity="secondary"
                  (onClick)="showAllSeverities()"
                />
                <p-button label="Alle entfernen" size="small" severity="secondary" [text]="true" (onClick)="clearToasts()" />
                <p class="pg__hint">{{ tgHint() }}</p>
              </div>
            </div>
          </div>
          <div class="pg__code">
            <span class="pg__code-label">MessageService-Aufruf</span>
            <button type="button" class="copy-btn" (click)="copy('tg', tgCode())">
              {{ copiedId() === 'tg' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ tgCode() }}</code></pre>
        </section>

        <h3>Was der Toast mit dem Fokus macht und was er ansagt</h3>
        <p>
          Der Schließen-Button kommt mit einem nackten <code>autofocus</code>-Attribut, und das wirft eine berechtigte
          Frage auf: Zieht ein Toast den Fokus von dem weg, was du gerade tust? Setz den Fokus ins Feld, zeig einen Toast
          und lies das Instrument ab. Dann schließ den Toast per Klick auf seinen Button und lies die zweite Zeile — ein
          Bedienelement, das sich selbst entfernt, muss den Fokus irgendwo hinterlassen.
        </p>
        <div class="inst">
          <label class="inst__field">
            <span>Tipp zuerst hier, dann drück den Button</span>
            <input type="text" class="inst__input" id="fj-input" />
          </label>
          <p-button label="Sticky-Toast zeigen und messen" size="small" (onClick)="measureFocusJourney()" />
          <dl class="inst__out">
            <div>
              <dt>Fokus vorher</dt>
              <dd>{{ fjBefore() }}</dd>
            </div>
            <div>
              <dt>Fokus 450 ms nach dem Erscheinen</dt>
              <dd>{{ fjAfter() }}</dd>
            </div>
            <div>
              <dt>Meldungselement</dt>
              <dd>{{ fjAttrs() }}</dd>
            </div>
            <div>
              <dt>Fokus nach dem Schließen per Klick</dt>
              <dd>{{ fjClosed() }}</dd>
            </div>
          </dl>
        </div>

        <h3>Zwei Busse, zwei Toasts: <code>key</code></h3>
        <p>
          Ein zweiter <code>p-toast</code> mit <code>key="side"</code> teilt sich denselben Service und nimmt nur
          Meldungen an, die denselben Key tragen. Das Routing ist exakte Gleichheit, also zeigt der Toast ohne Key auch
          nie eine Meldung mit Key.
        </p>
        <div class="inst">
          <p-button label="add() ohne key" size="small" severity="secondary" (onClick)="showUnkeyed()" />
          <p-button label="add({ key: 'side' })" size="small" severity="secondary" (onClick)="showKeyed()" />
          <p-button label="clear('side')" size="small" severity="secondary" [text]="true" (onClick)="clearKeyed()" />
        </div>

        <!-- The two live toast outlets -->
        <p-toast [position]="tgPosition()" />
        <p-toast key="side" position="bottom-left" />
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche Fläche</h3>
        <p>
          Die Wahl lautet nicht „inline oder Overlay“. Sie lautet: <em>Wie schlimm ist es, wenn das niemand liest?</em>
          Ein Toast ist die einzige Fläche in dieser Tabelle, die mit „nicht schlimm“ antwortet — alles andere gibt es,
          weil die Antwort „schlimm“ war.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Greif zu</th>
                <th>Warum nicht die anderen</th>
              </tr>
            </thead>
            <tbody>
              @for (row of surfaceRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>
                    <code>{{ row.use }}</code>
                  </td>
                  <td>{{ row.why }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <h3>Wann ein Toast die falsche Antwort ist</h3>
        <ul>
          <li>
            <strong>Die Meldung verlangt eine Handlung.</strong> „Upload fehlgeschlagen — erneut versuchen?“ in einem
            Toast ist ein Drei-Sekunden-Fenster für eine Entscheidung. Setz die Handlung dorthin, wo der Fehler ist: eine
            Inline-Meldung mit einem Button darin oder ein Dialog, wenn es wirklich blockiert.
          </li>
          <li>
            <strong>Die Meldung muss sich erneut lesen lassen.</strong> Ein Toast ist weg und nicht wiederherstellbar; es
            gibt keinen Verlauf, kein Log, nichts, wohin man zurückscrollen kann. Wenn der Nutzer sie vielleicht zweimal
            braucht, gehört sie ins Layout.
          </li>
          <li>
            <strong>Der Nutzer kann das Timing nicht steuern.</strong> Ein Standard-Toast verschwindet nach drei
            Sekunden, ob er gelesen wurde oder nicht — Hovern pausiert ihn, aber nur, wenn du zufällig darauf zeigst, und
            ein Tastatur- oder Screenreader-Nutzer hat nichts Vergleichbares. Das ist das WCAG-Argument „Timing
            Adjustable“ in einem Satz.
          </li>
          <li>
            <strong>Sie gehört zu einem Formularfeld.</strong> Die Konvention des Kits für Validierung ist ein
            Hinweiselement unter dem Input, referenziert über <code>aria-describedby</code>, plus
            <code>aria-invalid</code> am Bedienelement — siehe den Guide „Texteingaben“. Ein Meldungskasten, der über dem
            Formular schwebt, ist nicht dasselbe: Der Fehler muss vom Feld aus erreichbar sein, in dessen eigener
            zugänglicher Beschreibung.
          </li>
          <li>
            <strong>Es ist Fortschritt, kein Ergebnis.</strong> Arbeit, die noch läuft, ist eine Progress- oder
            Skeleton-Fläche; eine Meldung ist für das Ergebnis da.
          </li>
        </ul>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Ein fehlgeschlagenes Speichern als Toast melden, weil der Erfolgsfall auch einer ist und Symmetrie
              aufgeräumt wirkt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Trenn sie: Erfolg geht nach Ablauf eines Timers, ein Fehler bleibt. Ein Fehler-Toast ist entweder
              <code>sticky</code> oder eine Inline-Meldung neben der Sache, die fehlgeschlagen ist.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              <code>&lt;p-message [closable]="true"&gt;</code> setzen und annehmen, dass der Schließen-Button sie
              entfernt. Sie klappt zu nichts zusammen und bleibt als Alert im Baum.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Wickel sie in das <code>&#64;if</code>, dem ihr Zustand gehört, und lösch den Zustand in
              <code>(onClose)</code>. Das Sichtbarkeits-Signal der Komponente ist Darstellung; deine Bedingung ist die
              Wahrheit.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Den ganzen Satz in <code>summary</code> packen, weil <code>detail</code> kleiner gerendert wird und
              unwichtig aussieht.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              <code>summary</code> ist das Ergebnis in drei Wörtern; <code>detail</code> ist der eine Satz, der folgt.
              Beide werden als eine Einheit vorgelesen — die Meldung ist <code>aria-atomic</code>.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              <code>MessageService</code> an zwei Stellen bereitstellen — einmal in einer Komponente und einmal in der
              App — und sich dann wundern, warum die Hälfte der Toasts nie erscheint.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Ein Provider für ein Outlet. Er hat kein <code>providedIn</code>, also <em>ist</em> der Injector, in den
              du ihn setzt, der Bus; ein zweiter ist ein zweiter Bus, dem niemand zuhört.
            </p>
          </div>
        </div>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#alert" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>alert</code> role</a
            >
            — normativ: Ein Alert ist eine assertive Live-Region für eine zeitkritische Meldung, und er darf keinen Fokus
            bekommen. Beide Komponenten liefern die Rolle aus; das ist die Definition, an der sie gemessen werden,
            einschließlich des aria-live-Werts, der mit ihr kommt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            — das Kriterium, das entscheidet, ob eine Bestätigung als zugestellt gilt: Sie muss die assistive Technologie
            erreichen, ohne den Fokus zu bewegen. Auch der Grund, warum eine Live-Region existieren muss, bevor der Text
            es tut.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.2.1 Timing Adjustable</a
            >
            — der Drei-Sekunden-Standard, gelesen als Zeitlimit für Inhalt, und die Bedingungen, unter denen eine sich
            selbst schließende Meldung überhaupt vertretbar ist.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/autofocus"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — the <code>autofocus</code> attribute</a
            >
            — was das Attribut, das der Schließen-Button des Toasts trägt, laut Spezifikation tun soll, und warum die
            Frage „stiehlt ein Toast den Fokus“ durch Messung beantwortet werden muss statt durch Lesen des Templates.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <ul>
          <li>
            <strong>Inline-Meldung</strong> — das <code>&lt;p-message&gt;</code>-Element selbst ist der Kasten:
            <code>display: grid</code> mit einer Zeile, ein Rand, gezeichnet als <code>outline</code> (nicht als Border),
            und ein Radius-Token. Darin ein Wrapper, eine Flex-Inhaltszeile, ein optionales Icon, der Text-Span, in dem
            dein projizierter Inhalt landet, und der optionale Schließen-Button, nach außen geschoben durch
            <code>margin-inline-start: auto</code>.
          </li>
          <li>
            <strong>Toast-Wurzel</strong> — <code>&lt;p-toast&gt;</code> bleibt, wo du es deklariert hast, und wird durch
            Inline-Styles zum Overlay: <code>position: fixed</code> plus die beiden Abstände, die seine Position
            vorgibt, immer <code>20px</code>. Die Breite kommt aus einem Token; die Wurzel hat keine Rolle und keinen
            Namen.
          </li>
          <li>
            <strong>Toast-Meldung</strong> — ein Div pro Meldung, mit Border, Radius, Backdrop-Blur und Schatten, das
            Icon, eine Textspalte aus <code>summary</code> + <code>detail</code> und den Schließen-Button enthält.
            Dieses Div, nicht die Wurzel, ist die Live-Region.
          </li>
        </ul>
        <p class="src-note">{{ anatomyNote }}</p>

        <h3>Die Token-Kette</h3>
        <p>
          Beide Komponenten lösen ihre Fläche aus einem Block pro Severity im Aura-Preset auf. Die Form ist für alle
          sechs Severities identisch, also reicht eine Severity, um die Kette zu lesen:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Eigenschaft</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              @for (row of tokenRows; track row.token) {
                <tr>
                  <td>{{ row.el }}</td>
                  <td>
                    <code>{{ row.prop }}</code>
                  </td>
                  <td>
                    <code>{{ row.token }}</code>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Zwei Asymmetrien solltest du kennen, bevor du umstylst. Die Inline-Meldung zeichnet ihre Kante mit
          <code>outline</code>, nimmt damit nicht am Layout teil und lässt sich nicht mit einer
          <code>border</code>-Kurzschreibweise überschreiben; der Toast nutzt eine echte <code>border</code>. Und der
          Toast hat ein eigenes Farb-Token für <code>detail</code>, das einen anderen Wert hat als die Textfarbe der
          Meldung — die zweite Zeile ist bewusst leiser.
        </p>

        <h3>Kontrast, per Gate geprüft</h3>
        <p>
          Jede Severity ist eine andere Fläche, und jede davon ist im Dark Mode noch einmal eine andere und pro Variante
          noch einmal. Aura färbt die Severities aus seinen <code>500</code>/<code>600</code>-Primitiven, die in
          mehreren Zellen 4,5:1 verfehlten (hell, warn 2,84:1 auf seiner Tönung); das Kit lenkt Text, Icon und Outline
          von info, success, warn und error beider Komponenten auf seine semantischen Farben um
          (<code>--semantic-blue-fg</code>, <code>-green-fg</code>, <code>-orange-fg</code> für warn,
          <code>-red-fg</code>) und den Text von secondary outlined / simple auf <code>--text-color-secondary</code>.
          Die Tönung hinter dem gefüllten Kasten bleibt die von Aura, also ist die dunkle Füllung größtenteils die Seite
          dahinter, und die Seite gehört zum Stil. Die Tabelle gibt den per Gate geprüften Bereich über die vier
          visuellen Stile an.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Severity</th>
                <th>Fläche</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              @for (row of contrastRows; track row.key) {
                <tr>
                  <td>{{ row.severity }}</td>
                  <td>{{ row.surface }}</td>
                  <td [class.bad]="row.lightFail">{{ row.light }}</td>
                  <td [class.bad]="row.darkFail">{{ row.dark }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ contrastNote }}</p>

        <h3>Geometrie und der Fokus-Ring</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              @for (row of geometryRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          <strong>Auf einem schmalen Bildschirm</strong> gehen die beiden getrennte Wege. Die Inline-Meldung ist ein
          Block im Fluss: Sie nimmt die Breite ihres Containers an, und ihr Text bricht um. Der Toast hat kein
          eingebautes responsives Verhalten — die Wurzel behält die Token-Breite <code>25rem</code> bei jedem Viewport
          und sitzt <code>20px</code> von ihrer verankerten Kante entfernt, läuft also unterhalb von etwa
          <code>27.5rem</code> über die gegenüberliegende Kante hinaus. Übergib <code>breakpoints</code>, z. B.
          <code>&#123; '30rem': &#123; width: 'calc(100vw - 2.5rem)' &#125; &#125;</code>, was der Toast mit
          <code>!important</code> in eine Media Query schreibt.
        </p>
        <p class="src-note">
          Breite der Wurzel aus <code>&#64;openng/optimus-ui-styles/dist/toast/index.mjs</code> (<code>.p-toast</code>),
          Abstände und die Breakpoint-Regel aus <code>openng-optimus-ui-toast.mjs:21-28</code> und <code>:641-649</code>.
        </p>

        <h3>Bewegung, und welche der beiden hängen bleiben kann</h3>
        <p>
          Die beiden Komponenten animieren über völlig verschiedene Mechanik, und die entscheidet, was passiert, wenn
          Animationen unterdrückt werden.
        </p>
        <ul>
          <li>
            <strong>Der Toast</strong> läuft über die Motion-Schicht, die drei Notausgänge hat: Sie überspringt Bewegung
            ganz, wenn der Nutzer reduzierte Bewegung bevorzugt, sie löst sofort auf, wenn am Element keine Animation
            oder Transition registriert ist, und sie stellt als Rückfallnetz einen Timeout. Das Entfernen treibt der
            After-Leave-Hook an, also verschwindet ein Toast auch dann, wenn jede Animation abgeschaltet ist.
          </li>
          <li>
            <strong>Die Inline-Meldung</strong> hat keine solche Schicht. Ihr Einklappen <em>ist</em> die
            Keyframe-Animation — die Leave-Klasse endet bei <code>opacity: 0</code> mit
            <code>animation-fill-mode: forwards</code>. Schalte die Animation mit <code>animation: none</code> ab, und
            eine „geschlossene“ Meldung bleibt voll sichtbar und voll bedienbar, weil sich sonst nie etwas geändert hat.
          </li>
          <li>
            Die globale Reduced-Motion-Regel des Kits setzt <code>animation-duration: 0.01ms</code> statt
            <code>none</code>, und genau deshalb tritt dieser Fehlerfall hier nicht auf: Das Einklappen läuft weiterhin,
            sofort. Ein lokales Override, das zu <code>none</code> greift, bringt ihn zurück.
          </li>
        </ul>
        <p class="src-note">{{ motionNote }}</p>

        <h3>Stapelung</h3>
        <p>
          Die Toast-Wurzel bekommt ihren <code>z-index</code> bei der ersten Enter-Animation vom gemeinsamen
          Layer-Manager, aus derselben Stufe, die ein Dialog und ein Drawer nutzen, und gibt ihn zurück, wenn die
          letzte Meldung geht. Zwei Folgen: Ein Toast, der <em>vor</em> einem Modal geöffnet wurde, liegt darunter,
          einer, der danach geöffnet wurde, liegt darüber, und keiner liegt per Design über dem anderen — die Stufe ist
          geteilt, die Reihenfolge entscheidet. Wenn ein Toast ein Modal überleben muss, gib ihm einen
          <code>baseZIndex</code> oberhalb der Stufe.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ebene</th>
                <th>Gemessen</th>
              </tr>
            </thead>
            <tbody>
              @for (row of stackRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein hier nicht gemessenes Kriterium wird nicht behauptet.
          <strong>Erfüllt:</strong> SC 4.1.3 für die Inline-Meldung, die ab dem ersten Rendern mit
          <code>role="alert"</code> und <code>aria-live="polite"</code> im Baum steht, sodass eine Textänderung
          angesagt wird, ohne dass sich der Fokus bewegt — und gemessen bewegt sich der Fokus bei keiner der beiden
          Komponenten, trotz des nackten <code>autofocus</code> am Schließen-Button des Toasts; SC 1.4.3 für jede
          Severity und Variante über Grund und Card des Stils, niedrigster Wert 4,60:1, per Gate geprüft in
          <code>docs/generated/CONTRAST.MD</code> (<code>message &amp; toast</code>); und SC 1.4.11 für den Ring des
          Schließen-Buttons, 2px in der eigenen Textfarbe des Hinweises, der damit dieselben ≥&nbsp;4,5:1 trägt.
          <strong>Nicht erfüllt:</strong> keines der gemessenen Kriterien. <strong>Bedingt:</strong> SC 1.4.3 für einen
          Toast, der über etwas anderem als dem Seitengrund oder einer Card schwebt — die Füllung ist halbtransparent,
          also verrechnet sich die dunkle Tönung mit allem, was dahinter liegt, und das Gate misst nur diese beiden
          Flächen; SC 4.1.3 für den Toast, dessen Alert-Knoten und Text im selben Update in den Baum kommen — es gibt
          keine Inhaltsänderung zu beobachten, nur einen frisch eingefügten Alert, den Browser zwar auf ein
          Plattform-Alert-Ereignis abbilden, der aber das fragile Ende des Mechanismus ist; und SC 2.2.1, weil der
          Drei-Sekunden-Standard ein Zeitlimit ist, das nur ein Zeiger pausieren kann, sodass eine Meldung, die gelesen
          werden muss, sticky sein muss. <strong>AAA</strong> wird für diese Komponenten nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3><code>p-message</code> — Inputs mit ihren ausgelieferten Standardwerten</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Hinweis</th>
              </tr>
            </thead>
            <tbody>
              @for (row of messageApiRows; track row.name) {
                <tr>
                  <td>
                    <code>{{ row.name }}</code>
                  </td>
                  <td>
                    <code>{{ row.def }}</code>
                  </td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Templates: <code>#container</code> (ersetzt den ganzen Inhalt und bekommt einen <code>closeCallback</code>),
          <code>#icon</code>, <code>#closeicon</code>. Output: <code>(onClose)</code>. Es gibt überhaupt kein
          Sichtbarkeits-Input — die Komponente besitzt ein internes Signal und legt es nie offen, also ist die Bedingung
          des Hosts der einzige Griff, den du hast.
        </p>

        <h3><code>p-toast</code> — Inputs mit ihren ausgelieferten Standardwerten</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Hinweis</th>
              </tr>
            </thead>
            <tbody>
              @for (row of toastApiRows; track row.name) {
                <tr>
                  <td>
                    <code>{{ row.name }}</code>
                  </td>
                  <td>
                    <code>{{ row.def }}</code>
                  </td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <h3>Der Service-Vertrag</h3>
        <p>
          <code>MessageService</code> ist ein Bus aus zwei Subjects und sonst nichts — kein Store, kein Zustand, kein
          Replay. Ein Toast, der nach einem <code>add()</code> entsteht, zeigt nichts; eine Meldung, die ohne
          eingehängten Toast gesendet wird, geht verloren. Er trägt kein <code>providedIn</code>, muss also von Hand
          bereitgestellt werden, und der Injector, den du wählst, ist der Bus: Ihn in einer Komponente noch einmal
          bereitzustellen, gibt diesem Teilbaum einen privaten Service und trennt ihn stillschweigend vom Outlet der App.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Vertrag</th>
              </tr>
            </thead>
            <tbody>
              @for (row of serviceRows; track row.name) {
                <tr>
                  <td>
                    <code>{{ row.name }}</code>
                  </td>
                  <td>{{ row.note }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>Jedes Feld einer Meldung:</p>
        <pre class="code-block"><code>{{ messageOptionsSnippet }}</code></pre>

        <h3>Benennung, Rollen und was tatsächlich im Baum ankommt</h3>
        <p>
          Beide Komponenten legen ihre Live-Region-Semantik fest als statische Attribute an, und beide leiten
          Pass-through-Attribute über die Bind-Direktive auf dasselbe Element, angewendet aus einem Lifecycle-Hook —
          nach den eigenen Attributen des Templates. Also gewinnt der Pass-through, unter beiden
          Change-Detection-Strategien:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Ausgeliefert</th>
                <th>Weg zum Überschreiben</th>
              </tr>
            </thead>
            <tbody>
              @for (row of ariaRows; track row.el) {
                <tr>
                  <td>{{ row.el }}</td>
                  <td>
                    <code>{{ row.ships }}</code>
                  </td>
                  <td>
                    <code>{{ row.route }}</code>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ ariaNote }}</p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>

        <h3>Das Ansageproblem, genau betrachtet</h3>
        <p>
          Eine Live-Region wird angesagt, wenn sich ihr <em>Inhalt</em> ändert, während die Region schon im
          Accessibility Tree steht. Der Toast funktioniert nicht so, und der Baum zeigt es: Einen anzuzeigen fügt den
          <code>alert</code>-Knoten und seinen Text im selben Update in den Baum ein — Region und Inhalt kommen
          zusammen an, es gibt also keine Inhaltsänderung zu beobachten, nur einen neuen Alert. Browser bilden einen
          frisch eingefügten <code>alert</code> zwar auf ein Plattform-Alert-Ereignis ab, weshalb Toasts meist zu hören
          sind; trotzdem ist das das fragile Ende des Mechanismus, und deshalb ist dieselbe Meldung, in eine Region
          geschoben, die schon auf der Seite stand, der robustere Aufbau — abonnier den Service und spiegle sie dort.
          Prüf es im Accessibility Tree des Browsers: Genau ein Knoten sollte <code>live="assertive"</code> tragen, und
          das sollte die Meldung sein, nicht die Wurzel.
        </p>
        <p>
          Die Inline-Meldung hat die umgekehrte Eigenschaft und eine andere Falle: Sie steht ab dem ersten Rendern im
          Baum — der Server schickt sie schon mit —, sagt beim Laden also nichts an, und eine Meldung, die bloß
          <em>ihren Text ändert</em>, ist genau der Fall, für den die Region gemacht ist. Eine Meldung, die erscheint,
          weil eine Bedingung umgeschlagen ist, wird als neuer Alert angesagt; eine, deren Text du veränderst, wird als
          Inhaltsänderung angesagt, und zwar nur deshalb zuverlässig, weil die Rolle die Region atomar macht. Beides ist
          in Ordnung; nicht in Ordnung ist anzunehmen, der Kasten werde gehört, weil er sichtbar ist.
        </p>

        <h3>Fokus und die Tastatur</h3>
        <ul>
          @for (item of focusRows; track item) {
            <li>{{ item }}</li>
          }
        </ul>

        <h3>SSR</h3>
        <p>{{ ssrNote }}</p>

        <h3>Accessibility-Checkliste</h3>
        <ul class="check">
          @for (item of checklist; track item) {
            <li>{{ item }}</li>
          }
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die beiden Fakten aus der Tabelle oben festnagelt: Die
          Live-Region-Semantik der Inline-Meldung besteht aus statischen Host-Attributen, und der Pass-through
          überschreibt sie, weil er aus einem Lifecycle-Hook geschrieben wird.
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Ein String kommt aus der Bibliothek — und er bleibt leicht auf Englisch stehen</h3>
        <p>
          Alles, was ein Nutzer in diesen beiden Komponenten liest, kommt aus deinem Code, mit genau einer Ausnahme: dem
          zugänglichen Namen des Schließen-Buttons. Beide Komponenten nehmen ihn aus der eigenen ARIA-Tabelle der
          Bibliothek (<code>translation.aria.close</code>, Standard <code>"Close"</code>), und keine bietet ein Input,
          um ihn zu überschreiben. Es gibt keinen Notausgang pro Instanz — der einzige Weg, ihn zu übersetzen, ist, die
          Tabelle zu setzen.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">{{ i18nNote }}</p>

        <h3>Was dir gehört</h3>
        <ul>
          <li>
            <strong><code>summary</code> und <code>detail</code></strong> — bau sie zum Zeitpunkt von
            <code>add()</code> aus dem Übersetzungsservice. Ein Toast wird einmal erzeugt und rendert nie neu; ein
            Sprachwechsel, nachdem er erschienen ist, erreicht ihn nicht, und das ist gerade deshalb in Ordnung, weil er
            gleich verschwindet.
          </li>
          <li>
            <strong>Der projizierte Inhalt der Inline-Meldung</strong> — der <em>bleibt</em> auf der Seite, also binde
            ihn wie jeden anderen Text über ein <code>computed()</code>, sonst veraltet er bei einem Sprachwechsel.
          </li>
          <li>
            <strong>Ein überschriebener Name</strong>, falls du einen über den Pass-through setzt — dieselbe Regel, er
            ist UI-Text.
          </li>
        </ul>

        <h3>Länge: Der Toast ist ein Kasten mit fester Breite und hartem Umbruch</h3>
        <p>
          Die Breite der Toast-Wurzel ist fest, keine Maximalbreite, also macht eine längere Sprache ihn nicht breiter —
          er wächst nach unten. (Die tatsächliche Breite ist das Token <code>toast.width</code>,
          <code>25rem</code> — siehe den Tab Design.) Das Stylesheet setzt
          <code>white-space: pre-line</code> und <code>word-break: break-word</code> auf die Wurzel: Zeilenumbrüche in
          deinem String werden beachtet (gewollt — du kannst formatieren), und ein langes Kompositum wird mitten im Wort
          umbrochen, statt überzulaufen. Beides ersetzt keine kurze Zusammenfassung. Die Inline-Meldung hat keine eigene
          Breite und übernimmt die des Containers, dort ist das Risiko also das umgekehrte: eine seitenbreite Meldung mit
          einem Satz aus zwei Wörtern darin.
        </p>

        <h3>RTL</h3>
        <p>
          Das Stylesheet beantwortet diese Frage nicht: Render beide Komponenten in einem
          <code>dir="rtl"</code>-Teilbaum und vergleich die Kästen mit demselben Markup in LTR. Die Hälfte von dem, was
          folgt, spiegelt sich, die andere Hälfte nicht.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was</th>
                <th>LTR</th>
                <th>RTL</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rtlRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.ltr }}</td>
                  <td>{{ row.rtl }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ rtlNote }}</p>
        <p>Live, in einem RTL-Teilbaum — die Meldung spiegelt sich, die Ecke nicht:</p>
        <div class="rtl-demo" dir="rtl">
          <p-message severity="warn" [closable]="true"> ההודעה הזאת נטענת בכיוון ימין־לשמאל </p-message>
          <p-button label="הצג הודעה צפה" size="small" (onClick)="showRtlToast()" />
          <p-toast key="rtl" position="top-right" />
        </div>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Severities auf den
            semantischen Farben des Kits, die Kontrasttabelle aus dem Gate zitiert (niedrigster Wert 4,60:1, keine
            durchfallende Zeile), der Ring des Schließen-Buttons in der eigenen Farbe des Hinweises; WCAG-Status
            aktualisiert.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Erneut geprüft gegen Optimus UI 2.0.2 und die visuellen Stile
            (ADR-0016): Alle Zeilenverweise stimmen; die Kontrasttabelle ist als Aura-Standardpalette gekennzeichnet
            (die Severity-Farben sind Aura-Primitive, die kein Stil überschreibt; die Spalte Dunkel folgt der Seite des
            Stils) und als außerhalb des Kontrast-Gates markiert; die Radien von Meldung und Toast folgen dem
            <code>border.radius.md</code> des Stils; eine Aussage zu schmalen Bildschirmen im Tab Design ergänzt; das
            Agenten-Dokument gekürzt und seine abschließende Verweiszeile wiederhergestellt.
          </li>
          <li>
            <strong>v0.4</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): jeder Zeilenverweis
            gegen die Optimus-Bundles neu hergeleitet, und der Toast lebt jetzt in einem eigenen Bundle
            (<code>openng-optimus-ui-toast.mjs</code>). Drei Behauptungen aus v22 sind hier FALSCH: Es gibt kein
            Sonner-Stacking (<code>mode</code>/<code>stackGap</code>/<code>stackVisibleLimit</code> und Wischen
            existieren nicht), kein <code>handleFocusOnRemove</code> — der Fokus fällt auf <code>&lt;body&gt;</code> —,
            und Hover-Verlassen startet die VOLLE Lebensdauer neu, statt den Rest fortzusetzen. Die veralteten Inputs aus
            v21 sind zurück und kompilieren (<code>text</code>/<code>escape</code>/<code>style</code>/<code>styleClass</code>
            rendern sogar; die Transform-/Transition-Optionen sind wirkungslos). Die Geometrie ist zurück auf Aura 2.x:
            Schließen-Buttons 28px, Meldungstext 1rem, Toast-Breite das 25rem-Token, ohne dass eine Basisregel es
            übersteuert, Blur 1.5px hell / 10px dunkel; die Farbwerte sind unverändert, also trägt die Kontrasttabelle
            weiterhin.
          </li>
          <li>
            <strong>v0.3</strong> — 24.08.2026 — Erneut verifiziert gegen PrimeNG 22.1 (Aura 3.0): alle Zeilenverweise
            neu hergeleitet. Entfernt in v22: bei p-message <code>text</code>/<code>escape</code>/<code>style</code>/<code>styleClass</code>
            und die Transition-Inputs beider Komponenten (in 21 veraltet und wirkungslos) — Bindings kompilieren nicht
            mehr; <code>motionOptions</code> ersetzt sie. Neu in v22: Der Toast stapelt standardmäßig im Sonner-Stil
            (<code>mode</code>, <code>stackGap</code>, <code>stackVisibleLimit</code>, Wischen zum Schließen), eine
            Hover-Pause, die die <em>verbleibende</em> Lebensdauer fortsetzt, und Fokus, der beim Schließen zu einem
            benachbarten Toast wandert. Aura 3.0 hat die Geometrie verdichtet (Meldungstext 0.875rem, Schließen-Buttons
            24px, Toast-Icons 1rem), und eine späte Basisregel heftet die Toast-Breite über das 22rem-Token hinweg auf
            18.75rem; die Farb-Tokens sind unverändert, also trägt die Kontrasttabelle. Nicht wiederholte
            Browsermessungen sind als auf 21 gemessen markiert.
          </li>
          <li>
            <strong>v0.2</strong> — 20.08.2026 — WCAG-2.2-Statusübersicht im Tab Design ergänzt: gemessene Kriterien
            zusammengefasst als erfüllt / nicht erfüllt / bedingt, nicht gemessene Kriterien ausdrücklich nicht
            behauptet. TestBed-Snippet im Tab Entwicklung ergänzt.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erster Guide für die Feedback-Familie: die Grenze zwischen inline und
            Overlay gegenüber Dialog, Confirm Dialog, Validierung auf Feldebene und einer dauerhaften Live-Region; die
            gemessene Ansage-Matrix für beide Komponenten einschließlich des Paars aus role und aria-live, das die
            Inline-Meldung ausliefert; die <code>autofocus</code>-Frage per Messung geklärt; <code>MessageService</code>
            als Bus ohne Wurzel und sein Key-Routing; die Falle, dass das Einklappen eine Animation ist und eine
            „geschlossene“ Meldung auf der Seite lässt; Kontrast pro Severity für beide Flächen in beiden Themes; die
            gemeinsame Modal-z-index-Stufe; und das kanonische Agenten-Dokument.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class FeedbackMessagesArticleDeComponent extends FeedbackMessagesArticleComponent {
  // ------------------------------------------------------------ inline matrix

  override readonly variants: FeedbackMessagesArticleComponent['variants'] = [
    { label: 'Standard (gefüllt)', value: undefined as undefined | 'outlined' | 'simple' },
    { label: 'outlined', value: 'outlined' as const },
    { label: 'simple', value: 'simple' as const },
  ];

  override readonly sizeOptions: FeedbackMessagesArticleComponent['sizeOptions'] = [
    { label: 'small', value: 'small' as const },
    { label: 'normal (nicht gesetzt)', value: undefined },
    { label: 'large', value: 'large' as const },
  ];

  // ----------------------------------------------------------- removal probes

  override readonly probeBare = signal('drück den Schließen-Button, dann miss');
  override readonly probeWired = signal('drück den Schließen-Button, dann miss');

  override resetProbes(): void {
    this.wiredVisible.set(true);
    this.probeBare.set('drück den Schließen-Button, dann miss');
    this.probeWired.set('drück den Schließen-Button, dann miss');
  }

  // browser-only: reached only from the demo button handlers.
  protected override describeProbe(name: string): string {
    const host = document.querySelector(`[data-probe="${name}"]`);
    const el = host?.querySelector('p-message');
    if (!el) return 'kein p-message-Element im DOM';
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return `noch im DOM — role=${el.getAttribute('role')}, Opacity ${cs.opacity}, Höhe ${rect.height.toFixed(1)}px`;
  }

  // --------------------------------------------------------- pass-through probe

  override readonly ptOptions: FeedbackMessagesArticleComponent['ptOptions'] = [
    { label: 'keiner — was ausgeliefert wird', value: 'none' },
    { label: 'status + polite — nicht unterbrechen', value: 'status' },
    { label: 'alert + assertive — unterbrechen', value: 'assertive' },
  ];

  override readonly ptOut = signal('drück den Button');
  override readonly variantTextOut = signal('drück den Button');

  override measurePt(): void {
    if (!this.isBrowser) return;
    const el = document.querySelector('[data-probe="pt"] p-message');
    this.ptOut.set(el ? `role=${el.getAttribute('role')} aria-live=${el.getAttribute('aria-live')}` : 'nicht gerendert');
    const vt = document.querySelector('[data-probe="variant-text"] p-message');
    if (!vt) {
      this.variantTextOut.set('nicht gerendert');
      return;
    }
    const cs = getComputedStyle(vt);
    this.variantTextOut.set(
      `class="${vt.className.replace(/ng-\S+\s*/g, '').trim()}" background=${cs.backgroundColor}`,
    );
  }

  // ------------------------------------------------------------- toast player

  override readonly severityOptions: FeedbackMessagesArticleComponent['severityOptions'] = [
    { label: 'success', value: 'success' },
    { label: 'info (Standard)', value: 'info' },
    { label: 'warn', value: 'warn' },
    { label: 'error', value: 'error' },
    { label: 'secondary', value: 'secondary' },
    { label: 'contrast', value: 'contrast' },
  ];

  override readonly positionOptions: FeedbackMessagesArticleComponent['positionOptions'] = [
    { label: 'top-right (Standard)', value: 'top-right' },
    { label: 'top-center', value: 'top-center' },
    { label: 'top-left', value: 'top-left' },
    { label: 'bottom-right', value: 'bottom-right' },
    { label: 'bottom-center', value: 'bottom-center' },
    { label: 'bottom-left', value: 'bottom-left' },
    { label: 'center', value: 'center' },
  ];

  override readonly lifeOptions: FeedbackMessagesArticleComponent['lifeOptions'] = [
    { label: '3000 (der Standard)', value: 3000 },
    { label: '1500', value: 1500 },
    { label: '8000', value: 8000 },
  ];

  override readonly tgHint = computed(() => {
    const parts: string[] = [];
    parts.push(
      this.tgSticky()
        ? 'Sticky: gar kein Timer — er bleibt, bis er geschlossen oder entfernt wird.'
        : `Verschwindet nach ${this.tgLife()} ms; darauf zeigen pausiert den Timer, wegbewegen startet ihn von vorn.`,
    );
    if (!this.tgClosable()) parts.push('Kein Schließen-Button: Mit sticky bleibt kein Ausweg außer „Alle entfernen“.');
    return parts.join(' ');
  });

  protected override toastPayload(severity: string): ToastMessageOptions {
    const msg: ToastMessageOptions = {
      severity,
      summary: this.summaryFor(severity),
      closable: this.tgClosable(),
    };
    if (this.tgDetail()) msg.detail = 'Ein Satz Kontext, nicht mehr.';
    if (this.tgSticky()) msg.sticky = true;
    else msg.life = this.tgLife();
    return msg;
  }

  protected override summaryFor(severity: string): string {
    switch (severity) {
      case 'success':
        return 'Entwurf gespeichert';
      case 'warn':
        return 'Mit Warnungen gespeichert';
      case 'error':
        return 'Speichern fehlgeschlagen';
      case 'secondary':
        return 'Nichts zu speichern';
      case 'contrast':
        return 'Autospeichern ist an';
      default:
        return 'Entwurf gespeichert';
    }
  }

  override demoSave(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Entwurf gespeichert',
      detail: 'Alle Änderungen sind lokal gespeichert.',
    });
  }

  override showUnkeyed(): void {
    this.messageService.add({ severity: 'info', summary: 'Kein Key', detail: 'Nur das Outlet ohne Key nimmt diese an.' });
  }

  override showKeyed(): void {
    this.messageService.add({
      key: 'side',
      severity: 'info',
      summary: 'key: side',
      detail: 'Unten links, ein eigenes Outlet.',
    });
  }

  // ----------------------------------------------------------- focus journal

  override measureFocusJourney(): void {
    if (!this.isBrowser) return;
    const input = document.getElementById('fj-input') as HTMLInputElement | null;
    input?.focus();
    this.fjBefore.set(this.describeActive());
    this.fjAfter.set('messe …');
    this.fjAttrs.set('messe …');
    this.fjClosed.set('schließ den Toast, um zu messen');
    this.messageService.add({
      severity: 'info',
      summary: 'Fokus-Probe',
      detail: 'Schließ mich mit dem Button in diesem Toast.',
      sticky: true,
    });
    setTimeout(() => {
      this.fjAfter.set(this.describeActive());
      const el = document.querySelector('.p-toast-message');
      this.fjAttrs.set(
        el
          ? `role=${el.getAttribute('role')} aria-live=${el.getAttribute('aria-live')} aria-atomic=${el.getAttribute('aria-atomic')}`
          : 'kein Meldungselement gefunden',
      );
      const btn = document.querySelector<HTMLElement>('.p-toast-message .p-toast-close-button');
      btn?.addEventListener(
        'click',
        () => {
          setTimeout(() => this.fjClosed.set(this.describeActive()), 400);
        },
        { once: true },
      );
    }, 450);
  }

  // browser-only: reached only from the demo button handlers.
  protected override describeActive(): string {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return 'document.body — nichts fokussiert';
    const id = el.id ? `#${el.id}` : '';
    const cls =
      el.className && typeof el.className === 'string'
        ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
        : '';
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  }

  // ------------------------------------------------------------------- usage

  override readonly surfaceRows: FeedbackMessagesArticleComponent['surfaceRows'] = [
    {
      what: 'Eine Bestätigung, auf die niemand reagieren muss („Gespeichert“)',
      use: 'p-toast',
      why: 'Ein Inline-Kasten würde das Layout verschieben für eine Tatsache, die in zwei Sekunden veraltet ist.',
    },
    {
      what: 'Ein Zustand, der bestehen bleibt (Nur-Lese-Modus, eine ablaufende Sitzung, eine gescheiterte Synchronisierung)',
      use: 'p-message',
      why: 'Ein Toast geht; der Zustand nicht. Die Meldung gehört neben das, was sie einschränkt.',
    },
    {
      what: 'Ein Fehler, den der Nutzer in diesem Formularfeld beheben muss',
      use: 'Hinweis + aria-describedby',
      why: 'Der Fehler muss Teil der Feldbeschreibung sein, erreichbar vom Feld selbst — siehe den Guide „Texteingaben“.',
    },
    {
      what: 'Eine Frage, die das Weiterkommen blockiert („Das löschen?“)',
      use: 'p-confirmdialog',
      why: 'Keine der beiden Flächen nimmt eine Antwort an; eine Meldung mit Buttons in einer Ecke ist ein Dialog mit der falschen Rolle.',
    },
    {
      what: 'Ein Fehlschlag mit einem offensichtlichen Ausweg („Erneut versuchen“)',
      use: 'p-message + Button',
      why: 'Ein Toast ist ein Drei-Sekunden-Fenster für eine Entscheidung. Lass die Handlung neben dem Fehlschlag.',
    },
    {
      what: 'Ein laufender Zähler, ein Filterergebnis, ein „3 von 47 angezeigt“',
      use: 'eine dauerhafte Live-Region',
      why: 'Keine der beiden Komponenten ist eine Status-Region, die dir gehört; eine Region, die schon auf der Seite steht, sagt ihre eigenen Aktualisierungen zuverlässig an.',
    },
    {
      what: 'Eine Benachrichtigung in einer App, die schon eine Toast-Fläche hat',
      use: 'die Fläche, die sie schon hat',
      why: 'Dieses Kit ist so eine App: Es hängt einen eigenen Toast-Container an der App-Wurzel ein, gespeist von seinem eigenen Service — app-toast-container ist die Referenzimplementierung. Ein p-toast-Outlet daneben ist eine zweite Overlay-Wurzel, die in derselben z-index-Stufe konkurriert, mit eigenem Bus, eigener Benennung und eigenen Timern. Wähl eines pro App.',
    },
  ];

  // ------------------------------------------------------------------ design

  override readonly anatomyNote: string =
    'Klassennamen und Struktur ausgelesen aus den ausgelieferten Komponenten-Templates und den Aura-Stylesheets ' +
    'für Message und Toast, Optimus UI 2.0.2 / Aura 2.x.';

  override readonly tokenRows: FeedbackMessagesArticleComponent['tokenRows'] = [
    { el: 'Meldungskasten', prop: 'background', token: 'message.<severity>.background' },
    { el: 'Meldungskasten', prop: 'outline-color', token: 'message.<severity>.border.color' },
    { el: 'Meldungskasten', prop: 'color', token: 'message.<severity>.color' },
    { el: 'Meldungskasten', prop: 'border-radius', token: 'message.border.radius' },
    {
      el: 'Meldung, outlined',
      prop: 'color / outline-color',
      token: 'message.<severity>.outlined.color / .outlined.border.color',
    },
    { el: 'Meldung, simple', prop: 'color', token: 'message.<severity>.simple.color' },
    {
      el: 'Schließen-Button der Meldung',
      prop: 'focus outline',
      token: 'message.<severity>.close.button.focus.ring.color — übermalt vom Kit-Ring (currentColor)',
    },
    { el: 'Toast-Wurzel', prop: 'width', token: 'toast.width' },
    {
      el: 'Toast-Meldung',
      prop: 'background / border-color / color',
      token: 'toast.<severity>.background / .border.color / .color',
    },
    { el: 'Detailzeile des Toasts', prop: 'color', token: 'toast.<severity>.detail.color' },
    {
      el: 'Schließen-Button des Toasts',
      prop: 'focus outline',
      token: 'focus.ring.* + toast.<severity>.close.button.focus.ring.color — übermalt vom Kit-Ring (currentColor)',
    },
  ];

  override readonly contrastNote: string =
    'Zitiert aus docs/generated/CONTRAST.MD, Gruppe „message & toast“: die Text- und Iconfarbe ' +
    '(ein Token) auf der Severity-Tönung, verrechnet über --surface-ground und über --surface-card ' +
    '(gefüllter Kasten, Meldung und Toast gleichermaßen), und die outlined-/simple-Farbe auf diesen beiden Flächen ' +
    '(outlined und simple teilen sich einen Wert pro Severity). Die Bereiche laufen über die vier visuellen Stile. ' +
    'Die Farben sind die Kit-Regeln auf .p-message und .p-toast in src/styles.scss; secondary und ' +
    'contrast gefüllt behalten Auras eigene Paare, per Gate genauso geprüft. Die Tönung ist nicht deckend — 95 % im ' +
    'hellen, 16 % im dunklen Theme, dazu ein Backdrop-Blur —, also folgt die Spalte Dunkel der Seitenfläche des ' +
    'aktiven Stils, und ein Toast, der über etwas anderem schwebt, verrechnet sich damit: Prüf dort erneut. ' +
    'Der Fokus-Ring des Schließen-Buttons wird in currentColor gezeichnet, der Textfarbe des Hinweises, also erbt er ' +
    'das Verhältnis der jeweiligen Zeile.';

  override readonly contrastRows: FeedbackMessagesArticleComponent['contrastRows'] = [
    {
      key: 'success-filled',
      severity: 'success',
      surface: 'gefüllter Kasten',
      light: '4,79–4,80:1',
      dark: '7,09–10,11:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'success-outline',
      severity: 'success',
      surface: 'outlined / simple',
      light: '4,60–5,02:1',
      dark: '9,35–13,10:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'info-filled',
      severity: 'info',
      surface: 'gefüllter Kasten',
      light: '6,15–6,17:1',
      dark: '5,94–8,42:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'info-outline',
      severity: 'info',
      surface: 'outlined / simple',
      light: '6,14–6,70:1',
      dark: '7,28–10,20:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'warn-filled',
      severity: 'warn',
      surface: 'gefüllter Kasten',
      light: '5,01:1',
      dark: '5,92–8,07:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'warn-outline',
      severity: 'warn',
      surface: 'outlined / simple',
      light: '4,75–5,18:1',
      dark: '7,79–10,91:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'error-filled',
      severity: 'error',
      surface: 'gefüllter Kasten',
      light: '5,91–5,96:1',
      dark: '6,27–8,22:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'error-outline',
      severity: 'error',
      surface: 'outlined / simple',
      light: '5,93–6,47:1',
      dark: '6,92–9,69:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'secondary-filled',
      severity: 'secondary',
      surface: 'gefüllter Kasten',
      light: '6,92:1',
      dark: '10,08:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'secondary-outline',
      severity: 'secondary',
      surface: 'outlined / simple',
      light: '4,90–7,78:1',
      dark: '5,38–7,40:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'contrast-filled',
      severity: 'contrast',
      surface: 'gefüllter Kasten',
      light: '17,06:1',
      dark: '19,90:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'contrast-outline',
      severity: 'contrast',
      surface: 'outlined / simple',
      light: '11,35–18,73:1',
      dark: '11,32–16,28:1',
      lightFail: false,
      darkFail: false,
    },
    {
      key: 'detail',
      severity: 'alle sechs',
      surface: 'Detailzeile des Toasts',
      light: '9,45–17,85:1',
      dark: '9,96–19,90:1',
      lightFail: false,
      darkFail: false,
    },
  ];

  override readonly geometryRows: FeedbackMessagesArticleComponent['geometryRows'] = [
    {
      what: 'Innenabstand des Meldungsinhalts',
      value: '8px 12px; 6px 10px bei size="small", 10px 14px bei size="large"',
    },
    { what: 'Meldungstext', value: '1rem / 500; 0.875rem bei small, 1.125rem bei large. Icon 1.125rem (1rem bei small, 1.25rem bei large).' },
    {
      what: 'Kante der Meldung',
      value:
        '1px Outline (keine Border); Radius {content.border.radius} = {border.radius.md}, den der visuelle Stil setzt: 0 werkbund, 12px lernwerkstatt, 10px skizzenbuch, 2px blaupause (Aura-Standard 6px); outlined erhöht die Outline-Breite, simple entfernt Kante und Schatten',
    },
    { what: 'Schließen-Button, beide Komponenten', value: '28 x 28 px, vollständig rund (Aura 2.x; 3.0 hatte ihn auf 24 verkleinert)' },
    {
      what: 'Fokus-Ring des Schließen-Buttons',
      value:
        'Der Kit-Ring: 2px solid currentColor bei 2px Offset (styles.scss, über Auras 1px) — die Textfarbe der Severity, also entspricht sein Kontrast gegen den Kasten der Textzeile oben',
    },
    {
      what: 'Timing des Rings',
      value: 'outline-color wird über 0.2s überblendet: Lies sie nach der Transition ab, sonst misst du ein laufendes Überblenden',
    },
    {
      what: 'Toast-Wurzel',
      value:
        'position: fixed, 20px von jeder Kante, an der sie verankert ist (Inline-Styles, openng-optimus-ui-toast.mjs:21-28). Breite: das Token toast.width, 25rem — keine Basisregel übersteuert es',
    },
    {
      what: 'Toast-Meldung',
      value:
        '1px Border + derselbe stilabhängige Radius; Backdrop-Blur 1.5px im hellen, 10px im dunklen Theme; Toasts sind eine schlichte Liste, per Margin 1rem auseinander — es gibt kein Token für einen Stapelabstand',
    },
    {
      what: 'Toast-Text',
      value: 'summary 1rem / 500, detail 0.875rem in einem eigenen Farb-Token',
    },
    {
      what: 'Schließen-Button des Toasts',
      value: 'im Fluss, aber mit margin -25% / right -25% in die Ecke gezogen; gespiegelt durch eine :dir(rtl)-Regel',
    },
  ];

  override readonly motionNote: string =
    'Gemessen: Unter prefers-reduced-motion verschwindet der Toast trotzdem planmäßig, und er verschwindet auch, ' +
    'wenn auf beiden Elementen animation: none erzwungen ist. Eine Inline-Meldung, die unter ' +
    'animation: none geschlossen wird, bleibt bei Opacity 1 und voller Höhe, nur mit der Leave-Klasse versehen.';

  override readonly stackRows: FeedbackMessagesArticleComponent['stackRows'] = [
    {
      what: 'Toast-Wurzel, erstes Outlet',
      value:
        'z-index 1102 — die konfigurierte Modal-Stufe (1100) plus das Inkrement des Layer-Managers. Bis die erste Meldung hereinanimiert, trägt die Wurzel keinen eigenen z-index.',
    },
    {
      what: 'Ein zweites Outlet',
      value: '1104 — jedes Outlet nimmt sich beim ersten Hereinanimieren seinen eigenen Wert aus derselben Stufe',
    },
    { what: 'Dialog und Drawer', value: 'dieselbe Stufe: Die Fläche, die zuletzt hereinkommt, liegt oben' },
    {
      what: 'Der Haken',
      value:
        'der Toast wird nicht in den Body portiert: Ein fixes Element, das mit z-index 1 an den Body gehängt wird, malt ÜBER einen Toast mit 1102, weil ein positionierter Vorfahre mit z-index den Stacking-Kontext des Toasts besitzt',
    },
  ];

  // ------------------------------------------------------------- development

  override readonly messageApiRows: FeedbackMessagesArticleComponent['messageApiRows'] = [
    {
      name: 'severity',
      def: "'info'",
      note: 'success | info | warn | error | secondary | contrast. Unbekannte Werte erzeugen trotzdem eine Klasse, also rendert ein Tippfehler einen ungestylten Kasten.',
    },
    { name: 'variant', def: 'undefined', note: "'outlined' lässt die Füllung weg, 'simple' lässt Füllung, Rahmen und Schatten weg." },
    { name: 'size', def: 'undefined', note: "'small' | 'large'; alles andere wird ignoriert." },
    { name: 'closable', def: 'false', note: 'Fügt den Schließen-Button hinzu. Entfernt das Element NICHT — siehe Fallstricke.' },
    {
      name: 'life',
      def: 'undefined',
      note: 'Ein einmaliger Timer, beim Init gesetzt, der die Meldung ausblendet. Derselbe Vorbehalt: kein Entfernen.',
    },
    {
      name: 'icon',
      def: 'undefined',
      note: 'Ein Klassen-String an einem <i>. Kein Standard-Icon pro Severity — die Inline-Meldung liefert keines aus.',
    },
    { name: 'closeIcon', def: 'undefined', note: 'Dasselbe für den Schließen-Button; sonst ein inline eingebettetes Times-SVG.' },
    {
      name: 'motionOptions',
      def: 'undefined',
      note: 'Optionen für die Enter-/Leave-Bewegung; zusammengeführt mit dem Motion-Pass-through.',
    },
    {
      name: 'text / escape, style / styleClass, show/hideTransitionOptions',
      def: 'siehe Hinweis',
      note: 'Zurück als veraltete Inputs aus v21 (openng-optimus-ui-message.mjs:89-158): text/escape/style/styleClass kompilieren UND rendern; die beiden Transition-Optionen kompilieren, sind aber wirkungslos — motionOptions treibt die Animation an.',
    },
  ];

  override readonly toastApiRows: FeedbackMessagesArticleComponent['toastApiRows'] = [
    {
      name: 'position',
      def: "'top-right'",
      note: 'top/bottom × left/center/right, dazu center. Physische Ecken — siehe den Tab Internationalisierung (i18n).',
    },
    {
      name: 'life',
      def: '3000',
      note: 'Der Standard des Outlets. Eine Meldung kann ihn überschreiben; eine Meldung mit life: 0 fällt auf diesen zurück.',
    },
    { name: 'key', def: 'undefined', note: 'Routing über exakte Gleichheit. Ein Outlet ohne Key nimmt nur Meldungen ohne Key an.' },
    {
      name: 'autoZIndex',
      def: 'true',
      note: 'Nimmt sich beim ersten Enter einen z-index aus der gemeinsamen Modal-Stufe und gibt ihn frei, wenn es leer ist.',
    },
    {
      name: 'baseZIndex',
      def: '0',
      note: 'Falsy heißt „nimm die konfigurierte Modal-Stufe“. Setz ihn, um über einem Dialog zu liegen.',
    },
    {
      name: 'preventOpenDuplicates',
      def: 'false',
      note: 'Vergleicht severity + summary + detail mit den gerade angezeigten Meldungen.',
    },
    {
      name: 'preventDuplicates',
      def: 'false',
      note: 'Derselbe Vergleich gegen jede Meldung, die dieses Outlet je angezeigt hat.',
    },
    {
      name: 'breakpoints',
      def: 'undefined',
      note: 'Schreibt ein <style>-Element in den <head> mit Überschreibungen der Wurzel pro Breakpoint.',
    },
    { name: 'motionOptions', def: 'undefined', note: 'Optionen für die Motion-Schicht; an jede Meldung weitergereicht.' },
    {
      name: 'styleClass, show/hideTransformOptions, show/hideTransitionOptions',
      def: 'siehe Hinweis',
      note: 'Alle vier gibt es wieder (openng-optimus-ui-toast.mjs:468-486). styleClass landet am Host; die Transform-/Transition-Optionen werden nie an ein Toast-Element weitergereicht, sind also wirkungslos.',
    },
  ];

  override readonly serviceRows: FeedbackMessagesArticleComponent['serviceRows'] = [
    {
      name: 'add(message)',
      note: 'Schiebt eine Meldung auf den Bus. Kein Rückgabewert, kein Handle, kein Weg, genau diese Meldung danach zu aktualisieren oder zu schließen.',
    },
    {
      name: 'addAll(messages)',
      note: 'Eine Emission mit einem Array; jedes eingehängte Outlet filtert sie nach Key. Billiger als N Aufrufe, gleiches Ergebnis.',
    },
    {
      name: 'clear(key?)',
      note: 'Mit Key wird nur das Outlet geleert, das ihn trägt; ohne werden alle Outlets geleert. Es gibt kein „nur diese eine Meldung entfernen“.',
    },
    {
      name: 'messageObserver / clearObserver',
      note: 'Die rohen Subjects. Selbst zu abonnieren ist der unterstützte Weg, Meldungen in ein Log oder eine dauerhafte Live-Region zu spiegeln.',
    },
  ];

  override readonly ariaRows: FeedbackMessagesArticleComponent['ariaRows'] = [
    {
      el: 'Inline-Meldung, Host-Element',
      ships: 'role="alert" aria-live="polite"',
      route: 'pt.root — gemessen: schreibt role="status" aria-live="polite" über beide',
    },
    {
      el: 'Toast-Wurzel',
      ships: 'keine Rolle, kein Name, kein aria-live',
      route: 'pt.root — z. B. ein aria-label; es gibt nichts zu überschreiben',
    },
    {
      el: 'Toast-Meldung',
      ships: 'role="alert" aria-live="assertive" aria-atomic="true"',
      route: 'pt.message',
    },
    {
      el: 'Schließen-Button, beide',
      ships: 'aria-label aus der Bibliothekskonfiguration, Standard "Close"',
      route: 'Optimus.setTranslation — es gibt kein Input',
    },
  ];

  override readonly ariaNote: string =
    'Das Paar an der Inline-Meldung ist kein Widerspruch, sondern eine Herabstufung, und es löst sich so auf, ' +
    'wie die Spezifikation es sagt: Im Accessibility Tree ist der Knoten ein Alert mit ' +
    'live="polite" und atomic=true (atomic kommt von der Rolle, nicht aus dem Markup). Die Toast-Meldung ' +
    'ist die einzige assertive Live-Region, die eine der beiden Komponenten erzeugt. Der Pass-through ' +
    'erreicht den Baum, nicht nur das DOM: Mit pt.root wird dieselbe Meldung als status exponiert, ' +
    'live="polite", und er gewinnt auch auf OnPush-Hosts.';

  override readonly focusRows: FeedbackMessagesArticleComponent['focusRows'] = [
    'Ein Toast nimmt keinen Fokus. Sein Schließen-Button trägt ein nacktes autofocus-Attribut, aber der Button wird in ein lebendes Dokument eingefügt, statt mit ihm geparst zu werden, und Browser reagieren bei so einem Element nicht auf autofocus: Der Fokus bleibt in dem Feld, in dem der Nutzer gerade getippt hat.',
    'Die Tab-Reihenfolge enthält jeden Schließen-Button eines Toasts — an der Stelle, an der du das p-toast-Tag ins Dokument gesetzt hast, also weit weg von dem, was der Nutzer gerade tat. Das Meldungs-Div selbst trägt keinen tabindex. Den Schließen-Button eines Overlays in der Ecke zu erreichen, kann heißen, sich erst durch den Rest der Seite zu tabben.',
    'Escape tut nichts. Es gibt in der ganzen Komponente keinen Key-Handler außer keydown.enter am Schließen-Button; die Leertaste funktioniert trotzdem, weil der Button ein natives <button> ist.',
    'Einen Toast zu schließen übergibt den Fokus an niemanden: Optimus hat kein handleFocusOnRemove, also wird der Schließen-Button mit seiner Meldung entfernt, und der Fokus fällt auf <body>. Wenn ein Toast schließbar ist, stell den Fokus selbst in (onClose) wieder her.',
    'Hovern über dem Container pausiert den Timer, und Verlassen startet die VOLLE Lebensdauer NEU — mouseenter/mouseleave sind die einzigen Listener, es gibt kein Pointer-Down und kein Wischen. Tastaturfokus pausiert ebenfalls nichts: Es gibt keinen Fokus-Listener.',
    'Eine Inline-Meldung ist nicht fokussierbar und nimmt nicht an der Tab-Reihenfolge teil, bis sie einen Schließen-Button hat. Sobald sie closable ist, ist dieser Button ein Tab-Stopp, der in der Reihenfolge bleibt, selbst nachdem die Meldung zu nichts zusammengeklappt ist — ein Grund mehr, warum der Host sie entfernen muss.',
  ];

  override readonly ssrNote: string =
    'Beide Komponenten rendern auf dem Server, aber nur eine von beiden rendert etwas. Eine Inline-' +
    'Meldung steht im ausgelieferten HTML, komplett mit role="alert" und aria-live="polite", ist also ' +
    'Teil des ersten Renderns und des Dokuments, das ein Crawler sieht; ein Toast-Outlet ist ein leerer, ' +
    'fixer Container, weil Meldungen immer erst zur Laufzeit über den Service ankommen. Zwei ' +
    'Folgen: Eine Meldung, die ohne JavaScript sichtbar sein muss, muss eine Inline-Meldung sein, ' +
    'und die Abstände der Toast-Wurzel sind Inline-Styles (20px pro verankerter Kante, null für die ' +
    'ungenutzten — openng-optimus-ui-toast.mjs:21-28) — eine Erinnerung daran, dass diese ' +
    'Abstände physisch sind.';

  override readonly checklist: FeedbackMessagesArticleComponent['checklist'] = [
    'Jeder Toast, der einen Fehlschlag meldet, ist sticky, oder der Fehlschlag ist zusätzlich irgendwo sichtbar, wo er bleibt.',
    'Nichts, worauf der Nutzer reagieren muss, lebt nur in einem Toast.',
    'Der Schließen-Button hat einen Namen in der aktuellen Sprache — er kommt aus der Bibliothekskonfiguration, nicht aus einem Input.',
    'summary und detail lesen sich als ein Satz, weil sie als eine Einheit angesagt werden.',
    'Kein Toast wird benutzt, um eine Änderung anzusagen, die der Nutzer gerade per Tastatur gemacht hat, während der Fokus woanders auf der Seite ist — prüf im Accessibility Tree, dass der Alert-Knoten erscheint.',
    'Eine Inline-Meldung, die sich wegklicken lässt, wird durch die Bedingung ihres Hosts entfernt, nicht nur geschlossen.',
    'Eine Meldung, deren Text sich ändert, wird neu aufgebaut, nicht verändert, sonst wird die Änderung nicht angesagt.',
    'Farbe ist nie der einzige Träger der Severity: Das Icon oder der Wortlaut sagt es auch.',
    'MessageService wird genau einmal bereitgestellt, für das Outlet, das die Meldungen empfangen muss.',
  ];

  // --------------------------------------------------------------------- i18n

  override readonly i18nNote: string =
    'setTranslation führt nur eine Ebene tief zusammen, also wird der aria-Block komplett ersetzt — spreize ' +
    'zuerst den aktuellen, sonst fallen die fünfzig Keys, die du nicht aufgeführt hast, auf Englisch zurück. Das Kit ' +
    'setzt diese Tabelle bei jedem Sprachwechsel; close gehört dazu, weil diese beiden ' +
    'Komponenten die einzigen sind, die es lesen.';

  override readonly rtlRows: FeedbackMessagesArticleComponent['rtlRows'] = [
    {
      what: 'Inline-Meldung: Icon, Text, Schließen-Button',
      ltr: 'Icon links, Schließen-Button rechts',
      rtl: 'gespiegelt — Icon rechts, Schließen-Button links',
    },
    {
      what: 'Toast-Meldung: Icon, Text, Schließen-Button',
      ltr: 'Icon links, Schließen-Button rechts',
      rtl: 'gespiegelt, einschließlich des Überstands des Schließen-Buttons, durch eine :dir(rtl)-Regel',
    },
    { what: 'Toast-Ecke bei position="top-right"', ltr: 'oben rechts', rtl: 'immer noch oben rechts — unverändert' },
    {
      what: 'Toast-Abstände',
      ltr: 'right: 20px / top: 20px',
      rtl: 'right: 20px / top: 20px — physisch, als Inline-Styles geschrieben',
    },
  ];

  override readonly rtlNote: string =
    'Das Innere beider Komponenten spiegelt sich korrekt, weil es ' +
    'aus logischen Eigenschaften gebaut ist. Die Ecke des Toasts nicht: position ist ein physischer Schlüssel, ' +
    'kompiliert zu inline top/right/bottom/left, also ist „top-right“ in LTR die End-Ecke und in RTL die ' +
    'Start-Ecke — wo eine Benachrichtigung üblicherweise nicht erwartet wird. Dreh die Position ' +
    'selbst um, wenn sich die Dokumentrichtung umdreht.';
}
