import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DialogArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './dialog-article.component';

/**
 * German twin of the Dialog guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings held in class
 * fields (focus reports, demo values, example titles and notes) are German. Keep it in
 * step with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs dialog`).
 */
@Component({
  selector: 'app-dialog-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'dialog'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jeder Dialog hier unten öffnet sich wirklich. Fang im Playground an: Er meldet live und in
          <em>deinem</em> Browser, wo der Fokus beim Öffnen des Dialogs gelandet ist und wohin er beim Schließen ging —
          die beiden Fakten, die entscheiden, ob ein Modal überhaupt benutzbar ist.
        </p>

        <!-- Mini playground: configure a dialog, open it, read the focus report. -->
        <section class="pg" aria-label="Dialog-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-modal">modal</label>
                <p-toggleswitch inputId="pg-modal" [ngModel]="pgModal()" (ngModelChange)="pgModal.set($event)" />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-header">showHeader</label>
                <p-toggleswitch
                  inputId="pg-header"
                  [ngModel]="pgShowHeader()"
                  (ngModelChange)="pgShowHeader.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-closable">closable</label>
                <p-toggleswitch
                  inputId="pg-closable"
                  [ngModel]="pgClosable()"
                  (ngModelChange)="pgClosable.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-escape">closeOnEscape</label>
                <p-toggleswitch
                  inputId="pg-escape"
                  [ngModel]="pgCloseOnEscape()"
                  (ngModelChange)="pgCloseOnEscape.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-mask">dismissableMask</label>
                <p-toggleswitch
                  inputId="pg-mask"
                  [ngModel]="pgDismissableMask()"
                  (ngModelChange)="pgDismissableMask.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-focus">focusOnShow</label>
                <p-toggleswitch
                  inputId="pg-focus"
                  [ngModel]="pgFocusOnShow()"
                  (ngModelChange)="pgFocusOnShow.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-trap">focusTrap</label>
                <p-toggleswitch inputId="pg-trap" [ngModel]="pgFocusTrap()" (ngModelChange)="pgFocusTrap.set($event)" />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-maximizable">maximizable</label>
                <p-toggleswitch
                  inputId="pg-maximizable"
                  [ngModel]="pgMaximizable()"
                  (ngModelChange)="pgMaximizable.set($event)"
                />
              </div>
              <div class="pg__field pg__field--switch">
                <label for="pg-body">Body hat ein Textfeld</label>
                <p-toggleswitch
                  inputId="pg-body"
                  [ngModel]="pgBodyFocusable()"
                  (ngModelChange)="pgBodyFocusable.set($event)"
                />
              </div>
              <div class="pg__field">
                <span class="pg__label" id="pg-position-label">position</span>
                <p-select
                  [ariaLabelledBy]="'pg-position-label'"
                  size="small"
                  [options]="positionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgPosition()"
                  (ngModelChange)="pgPosition.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <p-button
                  id="pg-trigger"
                  label="Dialog öffnen"
                  icon="pi pi-external-link"
                  (onClick)="openPlayground()"
                />

                <dl class="probe">
                  <dt>Fokus nach dem Öffnen</dt>
                  <dd>{{ pgFocusOpenReport() }}</dd>
                  <dt>Fokus nach dem Schließen</dt>
                  <dd>{{ pgFocusCloseReport() }}</dd>
                </dl>
              </div>
            </div>
          </div>

          <p-dialog
            [visible]="pgVisible()"
            (visibleChange)="pgVisible.set($event)"
            [header]="pgShowHeader() ? 'Diese Sammlung umbenennen' : ''"
            [showHeader]="pgShowHeader()"
            [modal]="pgModal()"
            [closable]="pgClosable()"
            [closeOnEscape]="pgCloseOnEscape()"
            [dismissableMask]="pgDismissableMask()"
            [focusOnShow]="pgFocusOnShow()"
            [focusTrap]="pgFocusTrap()"
            [maximizable]="pgMaximizable()"
            [draggable]="false"
            [resizable]="false"
            [position]="pgPosition()"
            closeAriaLabel="Umbenennen-Dialog schließen"
            styleClass="pg-dialog"
            [style]="{ width: '90vw', maxWidth: '28rem' }"
            (onShow)="reportFocusAfterOpen()"
            (onHide)="reportFocusAfterClose()"
          >
            @if (pgBodyFocusable()) {
              <label class="dlg__label" for="pg-name">Name der Sammlung</label>
              <input
                pInputText
                id="pg-name"
                class="dlg__input"
                [ngModel]="pgName()"
                (ngModelChange)="pgName.set($event)"
              />
            } @else {
              <p class="dlg__text">Dieser Body hat gar kein fokussierbares Element — achte darauf, was der Fokus-Bericht sagt.</p>
            }
            <ng-template #footer>
              <p-button label="Abbrechen" severity="secondary" [text]="true" (onClick)="pgVisible.set(false)" />
              <p-button label="Umbenennen" (onClick)="pgVisible.set(false)" />
            </ng-template>
          </p-dialog>

          <div class="ex__head">
            <span class="pg__code-label">Erzeugtes Markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
          <p class="src-note">
            Der Fokus-Bericht liest <code>document.activeElement</code> 300 ms nach <code>(onShow)</code> und noch einmal bei
            <code>(onHide)</code> — spät genug, um am eigenen Fokuswechsel der Bibliothek vorbeizukommen, der aus
            <code>onAfterEnter</code> läuft, sobald die Einblend-Animation fertig ist (<code>openng-optimus-ui-dialog.mjs:633-644, :949-951</code
            >). Schalte <code>focusOnShow</code> aus oder leere den Body, und der Bericht sagt dir genau, was ein
            Tastaturnutzer erleben würde.
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
                  <p-button
                    id="ex-basic-trigger"
                    label="Entwurf löschen"
                    severity="danger"
                    [outlined]="true"
                    (onClick)="exBasic.set(true)"
                  />
                }
                @case ('form') {
                  <p-button id="ex-form-trigger" label="Titel bearbeiten" (onClick)="exForm.set(true)" />
                }
                @case ('headless') {
                  <p-button
                    id="ex-headless-trigger"
                    label="Dialog mit eigenem Rahmen öffnen"
                    severity="secondary"
                    (onClick)="exHeadless.set(true)"
                  />
                }
                @case ('nonmodal') {
                  <p-button
                    id="ex-nonmodal-trigger"
                    label="Nicht-modalen Dialog öffnen"
                    severity="secondary"
                    [outlined]="true"
                    (onClick)="exNonModal.set(true)"
                  />
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }

        <!-- The four example dialogs live outside the @for so their markup stays readable. -->

        <p-dialog
          [visible]="exBasic()"
          (visibleChange)="exBasic.set($event)"
          header="Diesen Entwurf löschen?"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Schließen, ohne zu löschen"
          styleClass="ex-dialog"
          [style]="{ width: '90vw', maxWidth: '26rem' }"
          (onHide)="restoreFocus('ex-basic-trigger')"
        >
          <p class="dlg__text">Der Entwurf und seine vier Revisionen werden entfernt. Das lässt sich nicht rückgängig machen.</p>
          <ng-template #footer>
            <p-button label="Entwurf behalten" severity="secondary" [text]="true" (onClick)="exBasic.set(false)" />
            <p-button label="Löschen" severity="danger" (onClick)="exBasic.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="exForm()"
          (visibleChange)="exForm.set($event)"
          header="Titel bearbeiten"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Titel-Editor schließen"
          styleClass="ex-dialog"
          [style]="{ width: '90vw', maxWidth: '30rem' }"
          (onHide)="restoreFocus('ex-form-trigger')"
        >
          <label class="dlg__label" for="ex-form-title">Titel</label>
          <input
            pInputText
            id="ex-form-title"
            class="dlg__input"
            [ngModel]="exFormTitle()"
            (ngModelChange)="exFormTitle.set($event)"
          />
          <p class="dlg__hint">
            Der Fokus landet beim Öffnen hier, weil das erste fokussierbare Element des INHALTS vor dem Schließen-Button gewinnt.
          </p>
          <ng-template #footer>
            <p-button label="Abbrechen" severity="secondary" [text]="true" (onClick)="exForm.set(false)" />
            <p-button label="Speichern" (onClick)="exForm.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="exHeadless()"
          (visibleChange)="exHeadless.set($event)"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          styleClass="ex-dialog"
          closeAriaLabel="Dialog mit eigenem Rahmen schließen"
          [style]="{ width: '90vw', maxWidth: '26rem' }"
          (onHide)="restoreFocus('ex-headless-trigger')"
        >
          <ng-template #header let-ariaLabelledBy="ariaLabelledBy">
            <div class="dlg__own-header">
              <i class="pi pi-map" aria-hidden="true"></i>
              <h2 [id]="ariaLabelledBy" class="dlg__own-title">Dein eigener Rahmen</h2>
            </div>
          </ng-template>
          <p class="dlg__text">
            Dieser Dialog zeichnet seinen eigenen Header über <code>#header</code>, das dir die erzeugte
            <code>ariaLabelledBy</code>-ID im Template-Kontext übergibt. Setz diese ID auf deine Überschrift, und der Dialog
            behält seinen Namen — und beachte, dass <code>showHeader</code> <strong>true</strong> bleibt: Das Header-Template
            lebt innerhalb von <code>*ngIf="showHeader"</code>, also würde das Abschalten des Headers dein eigenes Markup
            gleich mit wegwerfen.
          </p>
          <ng-template #footer>
            <p-button label="Schließen" (onClick)="exHeadless.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="exNonModal()"
          (visibleChange)="exNonModal.set($event)"
          header="Nicht modal — der Hintergrund funktioniert weiter"
          [modal]="false"
          [draggable]="true"
          [resizable]="false"
          closeAriaLabel="Nicht-modalen Dialog schließen"
          styleClass="ex-dialog"
          [position]="'topright'"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('ex-nonmodal-trigger')"
        >
          <p class="dlg__text">
            Versuch, hinter diesem Dialog zu scrollen und zu klicken — es funktioniert. Dann lies, was dieser Dialog einem
            Screenreader trotzdem sagt: <code>aria-modal="true"</code>.
          </p>
        </p-dialog>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Erste Frage: Muss das unterbrechen?</h3>
        <p>
          Ein modaler Dialog ist der teuerste Container im Kit. Er nimmt den ganzen Viewport in Geiselhaft, er zieht den
          Fokus von dem weg, was der Nutzer gerade getan hat, er muss geschlossen werden, bevor irgendetwas anderes passieren
          kann, und — wie der Tab Entwicklung misst — er gibt den Fokus danach
          <strong>nicht</strong> zurück, außer du schreibst das selbst. Der ehrliche Standard lautet:
          <em>Setz es auf die Seite</em>. Greif zu <code>p-dialog</code>, wenn die Unterbrechung der Sinn der Sache ist.
        </p>
        <p>
          Drei Fragen, in dieser Reihenfolge. <strong>Ist die Arbeit ein Umweg von der aktuellen Aufgabe oder die Aufgabe
          selbst?</strong> Wenn sie die Aufgabe ist, gehört sie auf die Seite oder auf eine Route.
          <strong>Ändert die Antwort, was der Nutzer gerade ansieht?</strong> Wenn ja, ist es der falsche Zug, diese Ansicht
          hinter einer Maske zu verstecken — setz das Steuerelement neben die Sache. <strong>Ist es akzeptabel, dass der
          Nutzer seine Stelle verliert?</strong> Ein Modal, das über einem gescrollten Artikel aufgeht und mit dem Fokus am
          Anfang des Dokuments schließt, hat den Nutzer seine Stelle gekostet; das ist der Preis, den du zahlst, und du
          solltest ihn aus einem Grund zahlen.
        </p>

        <h3>Welcher Container? Die ehrliche Tabelle</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Unterbricht?</th>
                <th>Standardmäßig modal</th>
                <th>Schließen</th>
                <th>Nimm es, wenn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>einem Inline-Abschnitt / <code>&lt;details&gt;</code></td>
                <td>nein</td>
                <td>entfällt</td>
                <td>nichts zu schließen</td>
                <td>
                  Der Standard. Der Inhalt gehört zur Seite, der Nutzer behält seine Stelle, und es gibt keinen
                  Fokus-Vertrag, den man falsch machen kann.
                </td>
              </tr>
              <tr>
                <td><code>p-popover</code></td>
                <td>nein — die Seite bleibt bedienbar</td>
                <td>keine Maske; <code>dismissable = true</code></td>
                <td>Klick daneben, <kbd>Esc</kbd></td>
                <td>
                  Ein kurzer, verankerter Einschub zu einem Element: eine Definition, ein Filtermenü, ein „Was ist das?“. Es
                  ist ebenfalls <code>role="dialog"</code>, also gib ihm einen Namen.
                </td>
              </tr>
              <tr>
                <td><code>p-drawer</code></td>
                <td>ja, aber die Seite bleibt sichtbar</td>
                <td><strong>ja</strong> — <code>modal = true</code></td>
                <td>Klick auf die Maske (<code>dismissible = true</code>), <kbd>Esc</kbd>, Schließen-Icon</td>
                <td>
                  Eine lange Nebenfläche — Filter, ein Detail-Panel, Navigation —, bei der der Nutzer die Liste darunter
                  im Blick behalten will. Rendert <code>role="complementary"</code>, nicht <code>dialog</code>.
                </td>
              </tr>
              <tr>
                <td><code>p-dialog</code></td>
                <td><strong>ja</strong>, mit <code>[modal]="true"</code></td>
                <td>nein — <code>modal = false</code> ist der Standard</td>
                <td>
                  Schließen-Icon; <kbd>Esc</kbd> (<code>closeOnEscape = true</code>); Klick auf die Maske nur mit
                  <code>dismissableMask</code>
                </td>
                <td>
                  Eine in sich geschlossene Teilaufgabe, die der Nutzer angefordert hat: umbenennen, hochladen, ein Formular,
                  das für ein Popover zu groß ist, ein Medienbetrachter.
                </td>
              </tr>
              <tr>
                <td><code>p-confirmdialog</code></td>
                <td>ja</td>
                <td><strong>ja</strong></td>
                <td>Buttons zum Annehmen / Ablehnen, <kbd>Esc</kbd></td>
                <td>
                  Genau eine Sache: „Bist du sicher?“. Er rendert <code>role="alertdialog"</code> und fokussiert
                  standardmäßig den Annehmen-Button (<code>defaultFocus = 'accept'</code>) — bau das nicht von Hand mit einem
                  <code>p-dialog</code> nach.
                </td>
              </tr>
              <tr>
                <td>einer Route</td>
                <td>ersetzt die Ansicht</td>
                <td>entfällt</td>
                <td>Zurück-Button</td>
                <td>
                  Alles, worauf der Nutzer verlinken, was er neu laden oder wohin er zurückkehren möchte. Ein Dialog hat
                  keine URL; ein Assistent dahinter lässt sich weder teilen noch als Lesezeichen speichern.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist und was nicht.</strong> Die Spalten „standardmäßig modal“ und „Schließen“ sind aus
          den ausgelieferten Quellen gelesen — <code>modal = false</code> (<code>openng-optimus-ui-dialog.mjs:172</code>),
          <code>closeOnEscape = true</code> (:177), <code>dismissableMask = false</code> (:182); Drawer
          <code>modal = true</code> / <code>dismissible = true</code> (<code>openng-optimus-ui-drawer.mjs:241,251</code>) mit
          <code>role="complementary"</code> (:581); Popover
          <code>dismissable = true</code> (<code>openng-optimus-ui-popover.mjs:64</code>), das
          <code>role="dialog"</code> rendert (:418); Bestätigungsdialog <code>role="alertdialog"</code>
          (<code>openng-optimus-ui-confirmdialog.mjs:523</code>) und
          <code>defaultFocus = 'accept'</code> (:233). Die Spalte „Nimm es, wenn“ ist eine <em>Einschätzung</em>.
        </p>

        <h3>Der Hausstil des Kits für Dialoge</h3>
        <p>Vier Konventionen, und jede gibt es, weil der Standard der Bibliothek andersherum ist:</p>
        <ul>
          <li>
            <strong>Immer modal, immer drei Wege hinaus.</strong>
            <code>[modal]="true" [closable]="true" [dismissableMask]="true" [closeOnEscape]="true"</code>. Ein Dialog, der
            blockiert, soll so aussehen und sich so verhalten, als blockiere er, und der Nutzer soll darin nie in die Enge
            getrieben werden.
          </li>
          <li>
            <strong>Nie verschiebbar, nie in der Größe veränderbar.</strong> Beides steht standardmäßig auf
            <code>true</code>, und beides geht nur mit der Maus; lässt du es an, lieferst du eine Funktion aus, die kein
            Tastaturnutzer erreicht.
          </li>
          <li>
            <strong>Benannt, ohne Ausnahme.</strong> Drei Formen leisten das: <code>[header]</code>;
            <code>#header</code> mit der <code>ariaLabelledBy</code>-ID aus dem Kontext auf der Überschrift; oder, wenn die
            ganze Header-Leiste wegmuss, <code>[showHeader]="false"</code> mit genau dieser ID auf der Überschrift, die du im
            Inhalt zeichnest — so machen es die Dialoge des Kits mit eigenem Rahmen. Die ID ist die Invariante, nicht der
            Header. Keine Option ist es, den Header wegzulassen und ein schlichtes <code>&lt;h2&gt;</code> zu schreiben:
            Optimus gibt <code>aria-labelledby</code> so oder so aus, also lässt eine Überschrift ohne die ID das Attribut
            auf ein Element zeigen, das nie gerendert wurde, und der Dialog endet mit dem zugänglichen Namen
            <strong>&quot;&quot; (der leere String)</strong> — der Tab Entwicklung zeigt den Mechanismus.
          </li>
          <li>
            <strong>Der Fokus geht an den Auslöser zurück.</strong> Das Kit hält dafür ein kleines Hilfsmittel,
            <code>FocusReturn</code> in <code>src/app/utils/focus-return.ts</code>: vor dem Öffnen des Overlays merken,
            aus <code>(onHide)</code> wiederherstellen. Es ist der Musterverweis für alles hier unten — Optimus
            implementiert keinen Teil davon.
          </li>
        </ul>
        <p>
          Die Größe ist die fünfte: <code>[style]</code> mit einer <code>vw</code>-Breite plus einem <code>maxWidth</code>.
          Eine feste Pixelbreite ohne Obergrenze ist der eine wiederkehrende Fehler — sie sieht auf dem Rechner, auf dem
          sie geschrieben wurde, richtig aus und läuft auf einem 360 px breiten Viewport über.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live und zu öffnen. Das
          <span class="tag tag--bad">Don’t</span> steht links, das <span class="tag tag--good">Do</span>
          rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — den Header verstecken und ein &lt;h2&gt; in den Body setzen</span>
            <div class="dd__stage">
              <p-button
                id="dd-name-bad-trigger"
                label="Unbenannten Dialog öffnen"
                severity="secondary"
                (onClick)="ddNameBad.set(true)"
              />
            </div>
            <p class="dd__why">
              Zugänglicher Name: <strong>&quot;&quot; (der leere String)</strong>. Optimus gibt weiterhin
              <code>aria-labelledby</code> aus, aber das Element, das es benennt, wurde nie gerendert, und eine Überschrift
              im Inhalt ist kein Name.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — gib ihm einen echten Header</span>
            <div class="dd__stage">
              <p-button id="dd-name-good-trigger" label="Benannten Dialog öffnen" (onClick)="ddNameGood.set(true)" />
            </div>
            <p class="dd__why">
              Zugänglicher Name: <strong>&quot;Deine Quellen exportieren&quot;</strong>. Nimm entweder <code>[header]</code>,
              oder behalte deinen eigenen Rahmen über <code>#header</code> und setz die <code>ariaLabelledBy</code>-ID aus dem
              Kontext auf deine Überschrift — der Tab Beispiele macht genau das.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — schließen und den Fokus im Stich lassen</span>
            <div class="dd__stage">
              <p-button
                id="dd-return-bad-trigger"
                label="Öffnen, dann Esc drücken"
                severity="secondary"
                (onClick)="openReturnBad()"
              />
              <span class="dd__probe"
                >Nach dem Schließen lag der Fokus auf: <strong>{{ ddReturnBadReport() }}</strong></span
              >
            </div>
            <p class="dd__why">
              Optimus merkt sich nie das Element, das den Dialog geöffnet hat, also fällt der Fokus beim Schließen auf das
              Dokument zurück. Ein Tastaturnutzer landet wieder am Anfang der Seite und muss sich den ganzen Weg zurück tabben.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Fokus in (onHide) zurückgeben</span>
            <div class="dd__stage">
              <p-button id="dd-return-good-trigger" label="Öffnen, dann Esc drücken" (onClick)="openReturnGood()" />
              <span class="dd__probe"
                >Nach dem Schließen lag der Fokus auf: <strong>{{ ddReturnGoodReport() }}</strong></span
              >
            </div>
            <p class="dd__why">
              Vier Zeilen: den Auslöser merken und in <code>(onHide)</code> darauf <code>.focus()</code> aufrufen. WCAG 2.2
              SC 2.4.3 verlangt eine Fokus-Reihenfolge, die „Bedeutung und Bedienbarkeit erhält“ — das hier ist schon alles.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Modal für etwas Passives</span>
            <div class="dd__stage">
              <p-button
                id="dd-passive-bad-trigger"
                label="Was ist ein Token?"
                severity="secondary"
                [text]="true"
                (onClick)="ddPassiveBad.set(true)"
              />
            </div>
            <p class="dd__why">
              Eine Definition aus einem Satz hinter einer Maske: Der Leser verliert den Satz, den er gerade gelesen hat,
              muss schließen und seine Stelle wiederfinden. Glossarbegriffe und Fußnoten sind die klassischen Übeltäter — die
              Unterbrechung kostet mehr, als die Definition wert ist.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — an Ort und Stelle aufklappen</span>
            <div class="dd__stage">
              <button
                type="button"
                class="disclosure"
                [attr.aria-expanded]="ddPassiveOpen()"
                aria-controls="dd-passive-panel"
                (click)="ddPassiveOpen.set(!ddPassiveOpen())"
              >
                Was ist ein Token?
                <i
                  class="pi"
                  [class.pi-chevron-down]="!ddPassiveOpen()"
                  [class.pi-chevron-up]="ddPassiveOpen()"
                  aria-hidden="true"
                ></i>
              </button>
              <div id="dd-passive-panel" class="disclosure__panel" [hidden]="!ddPassiveOpen()">
                Ein Token ist das Stück, das ein Modell tatsächlich liest — ungefähr ein Wortteil.
              </div>
            </div>
            <p class="dd__why">
              Ein Aufklapp-Button plus ein Panel. Nichts bewegt sich, nichts ist gefangen, der Text bleibt, wo der Leser
              ihn verlassen hat — und es gibt keinen Fokus-Vertrag, den man einhalten muss.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — [modal]="false" für eine blockierende Aufgabe</span>
            <div class="dd__stage">
              <p-button
                id="dd-modal-bad-trigger"
                label="Ein nicht-modales „Modal“ öffnen"
                severity="secondary"
                (onClick)="ddModalBad.set(true)"
              />
            </div>
            <p class="dd__why">
              Die Maske lässt Klicks durch und die Seite scrollt weiter — aber Optimus schreibt trotzdem
              <code>aria-modal="true"</code> auf den Dialog (<code>openng-optimus-ui-dialog.mjs:1056</code> ist ein Literal).
              Assistive Technik bekommt gesagt, der Rest der Seite sei nicht verfügbar, obwohl er es ist.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — modal oder kein Dialog</span>
            <div class="dd__stage">
              <p-button id="dd-modal-good-trigger" label="Ein echtes Modal öffnen" (onClick)="ddModalGood.set(true)" />
            </div>
            <p class="dd__why">
              Wenn die Aufgabe blockiert, setz <code>[modal]="true"</code>, damit Maske, Scroll-Sperre und ARIA übereinstimmen.
              Wenn sie nicht blockiert, wolltest du ein Popover, einen Drawer oder ein Panel auf der Seite.
            </p>
          </div>
        </div>

        <!-- The Do/Don't dialogs. -->
        <p-dialog
          [visible]="ddNameBad()"
          (visibleChange)="ddNameBad.set($event)"
          [modal]="true"
          [showHeader]="false"
          [draggable]="false"
          [resizable]="false"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-name-bad-trigger')"
        >
          <h2 class="dlg__own-title">Deine Quellen exportieren</h2>
          <p class="dlg__text">Eine Überschrift im Body ist eine Überschrift, kein Name.</p>
          <ng-template #footer>
            <p-button label="Schließen" (onClick)="ddNameBad.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="ddNameGood()"
          (visibleChange)="ddNameGood.set($event)"
          header="Deine Quellen exportieren"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Export-Dialog schließen"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-name-good-trigger')"
        >
          <p class="dlg__text">Der Header-Text ist der zugängliche Name des Dialogs.</p>
          <ng-template #footer>
            <p-button label="Schließen" (onClick)="ddNameGood.set(false)" />
          </ng-template>
        </p-dialog>

        <p-dialog
          [visible]="ddReturnBad()"
          (visibleChange)="ddReturnBad.set($event)"
          header="Keine Fokus-Rückgabe"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Schließen"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="reportReturnBad()"
        >
          <p class="dlg__text">Drück <kbd>Esc</kbd> und sieh dir den Bericht hinter diesem Dialog an.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddReturnGood()"
          (visibleChange)="ddReturnGood.set($event)"
          header="Der Fokus kommt zurück"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Schließen"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="reportReturnGood()"
        >
          <p class="dlg__text">Drück <kbd>Esc</kbd> und sieh dir den Bericht hinter diesem Dialog an.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddPassiveBad()"
          (visibleChange)="ddPassiveBad.set($event)"
          header="Token"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Definition schließen"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '22rem' }"
          (onHide)="restoreFocus('dd-passive-bad-trigger')"
        >
          <p class="dlg__text">Ein Token ist das Stück, das ein Modell tatsächlich liest — ungefähr ein Wortteil.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddModalBad()"
          (visibleChange)="ddModalBad.set($event)"
          header="Nicht wirklich modal"
          [modal]="false"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Schließen"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-modal-bad-trigger')"
        >
          <p class="dlg__text">Scroll die Seite hinter diesem Dialog — sie bewegt sich.</p>
        </p-dialog>

        <p-dialog
          [visible]="ddModalGood()"
          (visibleChange)="ddModalGood.set($event)"
          header="Wirklich modal"
          [modal]="true"
          [draggable]="false"
          [resizable]="false"
          closeAriaLabel="Schließen"
          styleClass="dd-dialog"
          [style]="{ width: '90vw', maxWidth: '24rem' }"
          (onHide)="restoreFocus('dd-modal-good-trigger')"
        >
          <p class="dlg__text">Scroll die Seite hinter diesem Dialog — sie bewegt sich nicht.</p>
        </p-dialog>

        <h3>Schreib den Dialog wie eine Frage, nicht wie ein Fenster</h3>
        <ul>
          <li>
            <strong>Der Header ist die Frage.</strong> „Diesen Entwurf löschen?“ schlägt „Bestätigung“. Er ist auch der
            zugängliche Name, also das Erste, was ein Screenreader ansagt.
          </li>
          <li>
            <strong>Die Buttons sind die Antworten.</strong> Mit dem Verb vorn und konkret — „Löschen“, „Entwurf behalten“ —,
            nie „OK“/„Abbrechen“ über einer zerstörerischen Aktion.
          </li>
          <li><strong>Ein Dialog, eine Entscheidung.</strong> Wenn dein Dialog Tabs hat, ist er eine Seite.</li>
          <li>
            <strong>Staple keine Dialoge.</strong> Optimus unterstützt es (der Escape-Listener vergleicht z-Indizes und
            schließt nur den obersten), was nicht dasselbe ist, wie dass es benutzbar wäre.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Modal Dialog pattern</a
            >
            — der Vertrag, an dem dieser Guide Optimus prüft: Der Dialog ist benannt, der Fokus wandert beim Öffnen hinein,
            <kbd>Tab</kbd> bleibt darin, und „wenn der Dialog schließt, kehrt der Fokus zu dem Element zurück, das ihn
            aufgerufen hat“ — die eine Klausel, die Optimus nicht implementiert.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-modal" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-modal</code></a
            >
            — „Autoren MÜSSEN sicherstellen, dass ... Inhalt außerhalb des Dialogs inert ist“; die Referenz dafür, warum ein
            bedingungsloses <code>aria-modal="true"</code> auf einem nicht-modalen Dialog eine Lüge ist und warum Scroll
            blockieren nicht dasselbe ist, wie den Hintergrund inert zu machen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — das Kriterium, an dem die fehlende Fokus-Rückgabe scheitert: eine Reihenfolge, die „Bedeutung und
            Bedienbarkeit erhält“.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.1.2 No Keyboard Trap</a
            >
            — eine Fokusfalle ist nur zulässig, weil <kbd>Esc</kbd> dich herausholt; schalte <code>closeOnEscape</code> aus,
            lass <code>focusTrap</code> an, und du hast den Fehlerfall gebaut.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.7 Focus Visible</a
            >
            — der Maßstab für den Fokus-Ring des Schließen-Buttons, im Tab Design in beiden Themes gemessen.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Dialog element</a
            >
            — was dir die Plattform umsonst gibt (Top Layer, <code>::backdrop</code>, echte Inertheit,
            Fokus-Wiederherstellung) und Optimus von Hand nachbaut; die Basislinie, an der die Lücken dieses Guides gemessen
            werden.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — the <code>inert</code> attribute</a
            >
            — der einzeilige Mechanismus, der den Hintergrund wirklich unerreichbar machen würde und den kein Overlay von
            Optimus nutzt.
          </li>
          <li>
            <a href="https://primeng.org/dialog" target="_blank" rel="noopener noreferrer">
              PrimeNG — Dialog component</a
            >
            — die Upstream-API von v21, die Optimus forkt; dieser Guide bildet sie auf die Konventionen des Kits ab und prüft
            sie dann gegen die ausgelieferte Quelle in <code>node_modules</code>.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>
          Ein sichtbarer Dialog besteht aus zwei verschachtelten Elementen plus einem Nebeneffekt auf das Scrollen des Body.
          Solange er geschlossen ist, existiert nichts im DOM — der ganze Teilbaum steht hinter
          <code>&#64;if (renderMask())</code>.
        </p>
        <ul>
          <li>
            <strong>Maske</strong> — <code>div.p-dialog-mask</code>, <code>position: fixed</code>, voller Viewport,
            <code>display: flex</code>. Sie trägt auch die Ausrichtung: <code>position="topright"</code> wird zu
            <code>justify-content: flex-end; align-items: flex-start</code> auf der Maske, nicht zu einer Koordinate am
            Dialog. Bekommt <code>.p-overlay-mask</code> (die getönte Ebene) nur, wenn <code>modal</code> oder
            <code>dismissableMask</code> gesetzt ist, und <code>pointer-events</code> ist <code>auto</code>, wenn modal,
            <code>none</code>, wenn nicht.
          </li>
          <li>
            <strong>Wurzel</strong> — <code>div.p-dialog</code> mit <code>[attr.role]="role"</code> (Standard
            <code>'dialog'</code>), <code>aria-labelledby</code>, einem fest verdrahteten <code>aria-modal="true"</code> und
            der Direktive <code>pFocusTrap</code>.
          </li>
          <li>
            <strong>Fokus-Wächter</strong> — zwei <code>span.p-hidden-accessible.p-hidden-focusable</code>-Knoten, die
            <code>pFocusTrap</code> vor und hinter die Wurzel setzt; fokussierst du einen, springst du ans andere Ende. Das
            ist die ganze Falle.
          </li>
          <li>
            <strong>Header</strong> — <code>div.p-dialog-header</code> (nur mit <code>showHeader</code>), darin
            <code>span.p-dialog-title</code>, dessen <code>id</code> das Ziel von <code>aria-labelledby</code> ist, und
            <code>div.p-dialog-header-actions</code> mit den <code>p-button</code>s zum Maximieren und Schließen.
          </li>
          <li>
            <strong>Inhalt</strong> — <code>div.p-dialog-content</code>: dein projizierter Inhalt und das Element, das
            Optimus zuerst durchsucht, wenn es beim Öffnen den Fokus bewegt.
          </li>
          <li>
            <strong>Footer</strong> — <code>div.p-dialog-footer</code>, nur gerendert, wenn es ein Footer-Template gibt.
          </li>
        </ul>
        <p class="src-note">
          Anatomie gelesen aus dem Inline-Template in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-dialog.mjs</code> (Maske 1007-1020, Wurzel 1022-1042,
          Header 1049-1102, Inhalt 1103-1106, Footer 1107-1110), den Inline-Styles der Maske in 22-47 und den
          Wächter-Spans in <code>openng-optimus-ui-focustrap.mjs</code> (<code>createHiddenFocusableElements</code>), und
          bestätigt gegen den berechneten Stil und den Accessibility Tree.
        </p>
        <p class="src-note">
          <strong>Wo die Maske lebt.</strong> Das <code>parentElement</code> der Maske ist der
          <code>&lt;p-dialog&gt;</code>-Host, nicht <code>&lt;body&gt;</code>: <code>appendTo</code> löst sich zu
          <code>config.overlayAppendTo()</code> auf, und das ist <code>'self'</code> (<code>openng-optimus-ui-config.mjs:88</code>),
          und <code>appendContainer()</code> verschiebt den Wrapper <em>nur</em> dann in den Body, wenn es das nicht ist
          (<code>openng-optimus-ui-dialog.mjs:927-931</code>). Die Folge ergibt sich aus der Quelle: Die Maske ist
          <code>position: fixed</code>, also versteckt oder verschiebt ein Vorfahre mit <code>display: none</code>,
          <code>transform</code>, <code>filter</code> oder <code>contain</code> das ganze Overlay — ein Dialog, der in einem
          versteckten Tab-Panel deklariert ist, kann bei 0×0 aufgehen und den Accessibility Tree nie erreichen.
          <code>appendTo="body"</code> ist der Notausgang.
        </p>

        <h3>Token und gemessene Werte</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Teil</th>
                <th>Aura-Token</th>
                <th>Berechneter Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hintergrund der Maske</td>
                <td>
                  <code>&#123;mask.background&#125;</code> — hell <code>rgba(0,0,0,0.4)</code>, dunkel
                  <code>rgba(0,0,0,0.6)</code>
                </td>
                <td>hell <strong>rgba(0, 0, 0, 0.4)</strong>, dunkel <strong>rgba(0, 0, 0, 0.6)</strong></td>
              </tr>
              <tr>
                <td>Übergang der Maske</td>
                <td><code>&#123;mask.transitionDuration&#125;</code> = 0.3s</td>
                <td>
                  im Ruhezustand berechnet <code>transition-duration: 0s</code> — die Ein- und Ausblend-Bewegung läuft über
                  Klassen, nicht über eine stehende Transition
                </td>
              </tr>
              <tr>
                <td>Hintergrund des Dialogs</td>
                <td><code>&#123;overlay.modal.background&#125;</code></td>
                <td>
                  Auras Standard <code>surface.0</code> (#ffffff) hell / <code>surface.900</code> (zinc #18181b) dunkel — die
                  visuellen Stile ersetzen Auras Surface-Skala nicht
                </td>
              </tr>
              <tr>
                <td>Radius des Dialogs</td>
                <td>
                  <code>&#123;overlay.modal.border.radius&#125;</code> = <code>&#123;border.radius.xl&#125;</code> =
                  12px
                </td>
                <td>Je visuellem Stil in <code>styles.scss</code> gesetzt — siehe die Notiz unten</td>
              </tr>
              <tr>
                <td>Schatten des Dialogs</td>
                <td><code>0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)</code></td>
                <td>Je visuellem Stil in <code>styles.scss</code> gesetzt — siehe die Notiz unten</td>
              </tr>
              <tr>
                <td>Header-Padding / -Abstand</td>
                <td><code>&#123;overlay.modal.padding&#125;</code> = 1.25rem / 0.5rem</td>
                <td>Padding 20px; berechnet <code>gap: normal</code>, also kommt der Header-Abstand von 0.5rem nie zustande</td>
              </tr>
              <tr>
                <td>Titel</td>
                <td>Schriftgröße 1.25rem, Gewicht 600</td>
                <td>20px / 600</td>
              </tr>
              <tr>
                <td>Padding des Inhalts</td>
                <td><code>0 1.25rem 1.25rem 1.25rem</code></td>
                <td>0px 20px 20px</td>
              </tr>
              <tr>
                <td>Footer-Padding / -Abstand</td>
                <td><code>0 1.25rem 1.25rem 1.25rem</code> / 0.5rem</td>
                <td>0px 20px 20px, Abstand 8px</td>
              </tr>
              <tr>
                <td>Box des Schließen-Buttons</td>
                <td>
                  ein <code>p-button</code> mit
                  <code>&#123; severity: 'secondary', variant: 'text', rounded: true &#125;</code>
                </td>
                <td>40 × 40 px — liegt über der Untergrenze von 24px aus WCAG 2.5.8</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen aus <code>&#64;openng/optimus-ui-themes/dist/aura/dialog/index.mjs</code>, aufgelöst gegen
          <code>&#8230;/aura/base/index.mjs</code>; die rechte Spalte ist der berechnete Stil an einem offenen Dialog, gelesen,
          nachdem die Einblend-Transition fertig war. <strong>Diese Werte neu zu messen ist eine Falle, die man kennen
          sollte:</strong> Liest du sie im selben Tick wie das Öffnen, bekommst du die <em>Start</em>werte der Animation,
          nicht die Ruhewerte.
        </p>
        <p class="src-note">
          <strong>Der Rahmen gehört zum visuellen Stil.</strong> Jeder Stilblock in <code>styles.scss</code>
          (<code>html.style-&lt;name&gt; .p-dialog</code>) setzt Rahmen, Radius und Schatten des Dialogs in seiner eigenen
          Umriss-Sprache — <code>werkbund</code> zeichnet einen <code>--style-bw</code>-Rahmen in
          <code>--style-outline</code>, Radius 0, und einen um 8px versetzten Schatten in <code>--style-offset</code>. Maske,
          Padding und Typografie bleiben die von Aura; <code>.p-overlay-mask</code> wird nicht überschrieben. Gestalte einen
          Dialog je Aufrufstelle über <code>styleClass</code> um, und rechne damit, dass der Stilblock bei Rahmen, Radius und
          Schatten gewinnt, außer dein Selektor ist spezifischer.
        </p>

        <h3>Der Fokus-Ring am Schließen-Button</h3>
        <p>
          Der Schließen-Button ist ein echter <code>p-button</code>, also bekommt er den Button-Fokus-Ring des Kits:
          <code>.p-button:focus-visible</code> ist ein Selektor der einen Ring-Regel in <code>styles.scss</code>,
          2px solid <code>--primary-color-fg</code> mit 2px Abstand und <code>!important</code>. Der zeichnet über den
          eigenen Ring der Bibliothek für einen sekundären Text-Button (1px solid <code>&#123;surface.600&#125;</code> /
          <code>&#123;surface.300&#125;</code>). An einem fokussierten Schließen-Button:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Theme</th>
                <th>outline</th>
                <th>outline-offset</th>
                <th>box-shadow</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>hell</td>
                <td>2px solid <code>--primary-color-fg</code> (der Ring des Kits)</td>
                <td>2px</td>
                <td>none</td>
              </tr>
              <tr>
                <td>dunkel</td>
                <td>2px solid <code>--primary-color-fg</code> (der dunkle Akzent-Vordergrund)</td>
                <td>2px</td>
                <td>none</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Geprüft in <code>docs/generated/CONTRAST.MD</code>, Zeile <code>focus ring</code> auf
          <code>dialog.background</code>: 5,18–17,85:1 hell, 6,40–16,93:1 dunkel über alle Stile und Akzente. So prüfst du
          es in deinem eigenen Build: Fokussiere den Schließen-Button und lies das berechnete <code>outline</code>, einmal je
          Theme. Schalte das Theme um und lass einen Frame vergehen, bevor du neu liest — der Klassenwechsel
          landet nicht im selben Tick.
        </p>

        <h3>Position ist eine Ausrichtung der Maske, keine Koordinate</h3>
        <p>
          <code>position</code> nimmt <code>'center'</code> (Standard), <code>'top'</code>, <code>'bottom'</code>,
          <code>'left'</code>, <code>'right'</code> und die vier Ecken. Umgesetzt ist es als
          <code>justify-content</code> / <code>align-items</code> auf der Flex-Maske, also behält der Dialog seine eigene
          Breite und parkt einfach in dieser Ecke. Zwei praktische Folgen: Ein <code>top</code>-Dialog bleibt erreichbar,
          wenn die Bildschirmtastatur die untere Hälfte eines Handybildschirms frisst, und eine <code>position</code> plus
          ein großes <code>maxHeight</code> ist für lange Inhalte die bessere Antwort als <code>maximizable</code>.
        </p>

        <h3>Breite: Wähl eine Viewport-Breite UND eine Obergrenze</h3>
        <p>
          Ein Dialog hat keine Standardbreite — er schmiegt sich an seinen Inhalt, was auf einem 1440px-Bildschirm heißt,
          dass ein Dialog aus zwei Sätzen 1000px breit sein und ein langer an den Rand des Viewports stoßen kann. Die
          Konvention des Kits ist
          <code>[style]="&#123; width: '90vw', maxWidth: '&#8230;' &#125;"</code>: <code>vw</code> für Handys,
          <code>maxWidth</code> für Desktops. Ein nacktes <code>width: '400px'</code> ist der Fehlerfall — keine Obergrenze
          heißt nichts auf einem breiten Bildschirm, und kein <code>vw</code> heißt Überlauf bei 360 px.
          <code>[breakpoints]</code> gibt es für Breiten je Bildschirm, und es fügt zur Laufzeit ein
          <code>&lt;style&gt;</code>-Element ein; zwei Werte schlagen meist eine Map.
        </p>
        <p class="src-note">
          <code>breakpoints</code> → <code>createStyle()</code> (<code>openng-optimus-ui-dialog.mjs:704-728</code>), das ein
          <code>&lt;style&gt;</code> an <code>document.head</code> anhängt, abgesichert durch <code>isPlatformBrowser</code>.
        </p>

        <h3>Bewegung</h3>
        <p>
          Der Dialog kommt mit dem Motion-Preset <code>p-dialog</code> herein und die Maske mit
          <code>p-overlay-mask-enter-active</code>; beide laufen über CSS (<code>pMotion</code>). PrimeNG 22 hatte
          <code>transitionOptions</code> gestrichen; Optimus behält das Input aus v21, aber es setzt nur die
          Ersatzverzögerung des Fokuswechsels — Bewegung stellst du über <code>[motionOptions]</code> und
          <code>[maskMotionOptions]</code> ein. Gemessene Transition an der Dialog-Wurzel: <strong>transition-property
          <code>all</code>, transition-duration <code>0s</code></strong
          >. Respektiere <code>prefers-reduced-motion</code> auf App-Ebene, wenn du das einstellst — ein skalierendes,
          einblendendes Overlay ist genau die Art Bewegung, die vestibuläre Beschwerden auslöst.
        </p>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird nicht
          beansprucht.
          <strong>Bestanden:</strong> SC 2.5.8 für den Schließen-Button mit 40 × 40 px und SC 2.4.7 zusammen mit SC 1.4.11
          für seinen Ring — der 2px-Ring des Kits in <code>--primary-color-fg</code> mit 2px Abstand, niedrigster Wert 5,18:1
          auf dem Panel; das Schließen-Icon niedrigster Wert 5,21:1, Panel-Text 10,35 / 17,72:1 und der Umriss des Stils
          3,85–18,73:1 auf der Seite (die Zeilen „focus ring“, „dialog“ und „panel outline“ in
          <code>docs/generated/CONTRAST.MD</code>).
          <strong>Nicht bestanden:</strong> SC 2.4.3 — nichts merkt sich den Öffner oder stellt ihn wieder her, und nach
          Escape ist das gemessene <code>activeElement</code> <code>document.body</code>, also landet ein Tastaturnutzer
          wieder am Anfang der Seite. <strong>Bedingt:</strong> SC 4.1.2 — <code>[header]</code> benennt den Dialog, aber
          mit <code>[showHeader]="false"</code> ist der gemessene Name leer, und ein nicht gesetztes
          <code>closeAriaLabel</code> lässt den Schließen-Button unbenannt, während <code>aria-modal</code> ein Literal ist,
          das auch unter <code>[modal]="false"</code> true lautet, wo die Maske weder Zeiger noch Scrollen blockiert; und
          SC 2.1.2, wo die Falle nur zulässig ist, weil Escape sie löst — <code>closeOnEscape</code> aus bei
          <code>focusTrap</code> an ist der Fehlerfall. <strong>AAA</strong> ist für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>DialogModule</code> exportiert die Komponente <code>&lt;p-dialog&gt;</code>. Inhalt wird projiziert, also
          schreibst du den Body des Dialogs dort, wo der Dialog deklariert ist — es gibt keinen Service, keine
          Component-Factory, nichts zu registrieren. (Die Bibliothek liefert außerdem <code>DialogService</code> +
          <code>DynamicDialog</code>, um eine Komponente imperativ zu öffnen — eine eigene API mit einem eigenen, anderen
          Fokus-Vertrag; nichts aus diesem Guide lässt sich ungeprüft darauf übertragen.)
        </p>

        <h3>Zentrale Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>visible</code></td>
                <td><code>false</code></td>
                <td>
                  Zweiseitig (<code>[(visible)]</code>) oder aufgeteilt in <code>[visible]</code> +
                  <code>(visibleChange)</code>. Erst das Setzen auf true hängt den ganzen Teilbaum ein.
                </td>
              </tr>
              <tr>
                <td><code>header</code></td>
                <td>—</td>
                <td>Der Titeltext <em>und</em> der zugängliche Name. Lies unten „Benennung“, bevor du ihn weglässt.</td>
              </tr>
              <tr>
                <td><code>modal</code></td>
                <td>
                  <strong><code>false</code></strong>
                </td>
                <td>
                  Getönte Maske, Behandlung von Klicks auf die Maske, Scroll-Sperre für den Body. Du willst fast immer
                  <code>true</code>; der Standard der Bibliothek ist das andere.
                </td>
              </tr>
              <tr>
                <td><code>closable</code></td>
                <td><code>true</code></td>
                <td>Rendert den Schließen-Button — und schaltet <code>dismissableMask</code> und den Escape-Listener frei.</td>
              </tr>
              <tr>
                <td><code>closeOnEscape</code></td>
                <td><code>true</code></td>
                <td><kbd>Esc</kbd>-Handler auf Dokumentebene, nur gebunden, wenn <code>closable</code> ebenfalls true ist.</td>
              </tr>
              <tr>
                <td><code>dismissableMask</code></td>
                <td><code>false</code></td>
                <td>
                  <em>mousedown</em> auf der Maske schließt. Nur gebunden, wenn <code>modal</code> und <code>closable</code>
                  beide true sind.
                </td>
              </tr>
              <tr>
                <td><code>showHeader</code></td>
                <td><code>true</code></td>
                <td>
                  Abschalten entfernt den Titel, den Schließen-Button — und das Element, auf das der zugängliche Name zeigt.
                </td>
              </tr>
              <tr>
                <td><code>focusOnShow</code></td>
                <td><code>true</code></td>
                <td>
                  Bewegt den Fokus nach der Einblend-Transition in den Dialog. Wo er landet, ist nicht offensichtlich — siehe
                  unten.
                </td>
              </tr>
              <tr>
                <td><code>focusTrap</code></td>
                <td><code>true</code></td>
                <td>
                  Fügt die beiden Wächter-Spans hinzu. Lass es an; ein Modal ohne ist ein WCAG-Problem, keine Vorliebe.
                </td>
              </tr>
              <tr>
                <td><code>blockScroll</code></td>
                <td><code>false</code></td>
                <td>Dokumentiert als „Scrollen im Hintergrund blockieren“ — aber sieh dir die Falle an: Für sich allein blockiert es nichts.</td>
              </tr>
              <tr>
                <td><code>draggable</code> / <code>resizable</code></td>
                <td>
                  <strong><code>true</code></strong> / <strong><code>true</code></strong>
                </td>
                <td>
                  Beides nur mit der Maus, beides standardmäßig an. Die Konvention des Kits schaltet beides aus; das solltest
                  du auch, außer du lieferst zusätzlich einen Weg per Tastatur.
                </td>
              </tr>
              <tr>
                <td><code>maximizable</code></td>
                <td><code>false</code></td>
                <td>Fügt einen zweiten Header-Button hinzu. Sein Label kommt aus den ARIA-Übersetzungen der Bibliothek, nicht von dir.</td>
              </tr>
              <tr>
                <td><code>position</code></td>
                <td><code>'center'</code></td>
                <td>Ausrichtung auf der Maske (siehe Design).</td>
              </tr>
              <tr>
                <td><code>style</code> / <code>styleClass</code></td>
                <td>—</td>
                <td>Inline-Stil / Klasse an der Dialog-Wurzel. Hier lebt die Breite.</td>
              </tr>
              <tr>
                <td><code>contentStyle</code> / <code>contentStyleClass</code></td>
                <td>—</td>
                <td>An <code>.p-dialog-content</code> — dort setzt du <code>overflow</code> für einen scrollenden Body.</td>
              </tr>
              <tr>
                <td><code>maskStyle</code> / <code>maskStyleClass</code></td>
                <td>—</td>
                <td>An der Maske.</td>
              </tr>
              <tr>
                <td><code>closeAriaLabel</code></td>
                <td><strong>keiner</strong></td>
                <td>Der zugängliche Name des Schließen-Buttons. Es gibt keinen Ersatzwert — siehe i18n.</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td><code>'self'</code> (aus der globalen Konfiguration)</td>
                <td>
                  <code>'body'</code> entkommt einem abschneidenden oder transformierten Vorfahren. Neu in der Konfiguration
                  von v21; ältere PrimeNG-Versionen hängten standardmäßig an den Body an.
                </td>
              </tr>
              <tr>
                <td><code>baseZIndex</code> / <code>autoZIndex</code></td>
                <td><code>0</code> / <code>true</code></td>
                <td>Schichtung. Der Escape-Handler entscheidet über den z-Index, welcher gestapelte Dialog schließt.</td>
              </tr>
              <tr>
                <td><code>role</code></td>
                <td><code>'dialog'</code></td>
                <td>
                  Setz <code>'alertdialog'</code> nur für eine echte Unterbrechung — oder nimm <code>p-confirmdialog</code>.
                </td>
              </tr>
              <tr>
                <td><code>breakpoints</code></td>
                <td>—</td>
                <td>Eine Breiten-Map je Media Query; fügt zur Laufzeit ein <code>&lt;style&gt;</code> ein.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Standardwerte gelesen aus den Klassenfeldern in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-dialog.mjs</code> (<code>draggable</code> :152,
          <code>resizable</code> :157, <code>modal</code> :172, <code>closeOnEscape</code> :177, <code>dismissableMask</code>
          :182, <code>closable</code> :192, <code>showHeader</code> :217, <code>blockScroll</code> :222,
          <code>focusOnShow</code> :247, <code>focusTrap</code> :262, <code>role</code> :375) und gegengeprüft mit
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-dialog.d.ts</code>
          (Optimus UI 2.0.2).
        </p>

        <h3>Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>Wann</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>visibleChange</code></td>
                <td>Bei jeder Änderung der Sichtbarkeit — auch über den Schließen-Button, <kbd>Esc</kbd> und die Maske.</td>
              </tr>
              <tr>
                <td><code>onShow</code></td>
                <td>Nach der Einblend-Transition, direkt nachdem der Fokus bewegt wurde.</td>
              </tr>
              <tr>
                <td><code>onHide</code></td>
                <td>
                  Nach der Ausblend-Transition und nach dem Abbau. <strong>Hier stellst du den Fokus wieder her.</strong>
                </td>
              </tr>
              <tr>
                <td><code>onMaximize</code></td>
                <td><code>&#123; maximized: boolean &#125;</code>.</td>
              </tr>
              <tr>
                <td><code>onResizeInit</code> / <code>onResizeEnd</code> / <code>onDragEnd</code></td>
                <td>Nur Mausgesten.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Templates</h3>
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
                <td><code>#header</code></td>
                <td>Den Titelbereich — und es bekommt <code>ariaLabelledBy</code> in seinem Template-Kontext. Nutz das.</td>
              </tr>
              <tr>
                <td><code>#footer</code></td>
                <td>Die Aktionszeile.</td>
              </tr>
              <tr>
                <td><code>#content</code></td>
                <td>Alternative zur schlichten Content-Projektion.</td>
              </tr>
              <tr>
                <td><code>#headless</code></td>
                <td>Ersetzt Header, Inhalt und Footer vollständig — dir gehört der ganze Rahmen, auch der Name.</td>
              </tr>
              <tr>
                <td><code>#closeicon</code> / <code>"maximizeicon"</code> / <code>"minimizeicon"</code></td>
                <td>Die drei Icons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ headerTemplateSnippet }}</code></pre>
        <p class="src-note">
          Das Kontextobjekt wird in
          <code>openng-optimus-ui-dialog.mjs:1067</code> gebaut: <code>context: &#123; ariaLabelledBy: computedAriaLabelledBy() &#125;</code>.
          Das ist der einzige unterstützte Weg, dein eigenes Header-Markup <em>und</em> einen funktionierenden zugänglichen
          Namen zu behalten.
        </p>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>
          Jeder Dialog-Token ist als <code>--p-dialog-*</code> verfügbar, und — anders als beim Select — überschreibt nichts
          in der <code>styles.scss</code> des Kits sie, also greifen sie alle. Beschränke sie auf eine Klasse, nie auf
          <code>:root</code>.
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> kommt aus <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p', darkModeSelector: '.dark-theme' &#125;
            &#125; &#125;)</code
          >). Weil der Dialog dort gerendert wird, wo er deklariert ist (<code>appendTo</code> steht standardmäßig auf
          <code>'self'</code>), erreicht ihn ein Stylesheet mit Komponenten-Scope — aber das Attribut der emulierten
          Kapselung überlebt nicht bis in den eigenen Teilbaum des Dialogs, also zielst du mit <code>styleClass</code> und
          einer globalen Regel darauf, genau wie es die Aufrufstellen des Kits tun.
        </p>

        <h3>SSR</h3>
        <p>
          Sicher durch Konstruktion: Solange <code>visible</code> false ist, ist <code>renderMask()</code> false und das
          ganze Template der Komponente leer, also enthält eine vorgerenderte Route überhaupt keinen Dialog. Alles, was das
          DOM anfasst — <code>blockBodyScroll()</code>, die Dokument-Listener, <code>createStyle()</code> —, läuft aus der
          Einblend-Transition oder hinter <code>isPlatformBrowser</code>. Das Risiko ist dein eigener Code: Ein
          <code>(onShow)</code>-Handler, der <code>document</code> oder <code>window</code> liest, braucht die übliche
          Absicherung <code>isPlatformBrowser(platformId)</code>.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>
        <p>
          Für diesen Abschnitt gibt es den Guide. Ein modaler Dialog hat einen Vertrag mit vier Klauseln (APG): Er ist
          <strong>benannt</strong>, der Fokus <strong>wandert hinein</strong>, der Fokus <strong>bleibt drin</strong>, und
          der Fokus <strong>kommt zurück</strong>. Optimus 2.0.2 implementiert zweieinhalb davon.
        </p>

        <h4>1. Benennung — und die Falle in <code>[showHeader]="false"</code></h4>
        <p>Gelesen aus dem Accessibility Tree; die Mechanik steht in der Quelle von Optimus 2.0.2:</p>
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
                <td><code>[header]="'Export your sources'"</code></td>
                <td>&quot;Deine Quellen exportieren&quot;</td>
                <td><strong>Funktioniert.</strong> Der Titel-Span trägt die erzeugte ID.</td>
              </tr>
              <tr>
                <td><code>[showHeader]="false"</code> + ein schlichtes <code>&lt;h2&gt;</code> im Body</td>
                <td>&quot;&quot; (der leere String)</td>
                <td>
                  <strong>Scheitert.</strong> <code>aria-labelledby</code> wird weiterhin ausgegeben und zeigt auf eine ID,
                  die es nicht gibt.
                </td>
              </tr>
              <tr>
                <td><code>#header</code> + <code>[id]="ariaLabelledBy"</code> auf deiner Überschrift</td>
                <td>&quot;Dein eigener Rahmen&quot;</td>
                <td><strong>Funktioniert.</strong> Dein Rahmen, die ID des Dialogs.</td>
              </tr>
              <tr>
                <td>
                  <code>[header]="''"</code> + <code>[showHeader]="false"</code> +
                  <code>[attr.id]="dlg.computedAriaLabelledBy()"</code> auf der Überschrift, die du selbst zeichnest
                  (<code>#dlg</code> am <code>&lt;p-dialog&gt;</code>)
                </td>
                <td>der Text dieser Überschrift</td>
                <td>
                  <strong>Funktioniert.</strong> Die ID existiert, solange <code>header() !== null</code> gilt — ein nicht
                  gebundener Header behält sie, aber das <code>''</code> schützt davor, dass ein Binding, das irgendwann
                  <code>null</code> ergibt, dem Dialog still seinen Namen nimmt.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Der Mechanismus.</strong> Optimus teilt ihn in zwei. <code>ariaLabelledBy</code> ist ein
          <em>Input</em>-Signal, das du selbst setzen darfst, und was am Element ankommt, ist
          <code>computedAriaLabelledBy() = ariaLabelledBy() ?? headerId()</code>
          (<code>openng-optimus-ui-dialog.mjs:380, :515</code>) über
          <code>headerId = computed(() =&gt; this.header() !== null ? this.id + '_header' : null)</code> (:513). Ein nicht
          gebundener <code>header</code> ist <code>undefined</code>, und <code>undefined !== null</code>, also überlebt die
          ID ganz ohne Binding. Die Prüfung ist <em>reaktiv</em>:
          Ein <code>header</code>, der an einen Ausdruck gebunden ist, der irgendwann <code>null</code> ist — eine noch
          nicht geladene Übersetzung, ein geleertes Model —, entfernt die ID und nimmt dem Dialog live seinen Namen,
          samt Attribut, außer du bindest <code>ariaLabelledBy</code>. Die Dialoge des Kits binden
          <code>[header]="''"</code>, um diesen Zustand unerreichbar zu machen. Das Element, das die Bibliothek selbst
          benennen würde — <code>&lt;span [id]="headerId()"&gt;</code> in :1065-1066 —, rendert nur innerhalb von
          <code>*ngIf="showHeader"</code> und ohne projiziertes Header-Template. Die Reparatur hat dieselbe Form wie
          bisher: Eine Template-Referenzvariable am <code>&lt;p-dialog&gt;</code> lässt jede Überschrift, die du renderst,
          die ID beanspruchen.
        </p>

        <h4>2. Fokus hinein — nicht dorthin, wo du es vermuten würdest</h4>
        <p>
          <code>focus()</code> durchsucht der Reihe nach den <strong>Inhalt</strong>, dann den Footer, dann den Header und
          nimmt das erste fokussierbare Element des ersten Containers, der eines hat
          (<code>openng-optimus-ui-dialog.mjs:633-644</code>). Ein Dialog, dessen Body mit einem Textfeld beginnt, öffnet
          also mit dem Cursor in diesem Feld; ein Dialog, dessen Body Fließtext ist, öffnet mit dem Fokus auf dem ersten
          Footer-Button; und nur ein Dialog mit keinem von beiden fällt bis zum Schließen-Button durch. Die drei Fälle:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Body des Dialogs</th>
                <th><code>document.activeElement</code> nach dem Öffnen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Texteingabe + Footer-Buttons</td>
                <td>das Textfeld — <code>&lt;input class="dlg__input"&gt;</code>, im Dialog</td>
              </tr>
              <tr>
                <td>nur Fließtext, Footer-Buttons</td>
                <td>der erste Footer-Button (&quot;Entwurf behalten&quot;)</td>
              </tr>
              <tr>
                <td>nur Fließtext, kein Footer, schließbar</td>
                <td>der Schließen-Button (&quot;Schließen&quot;)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus <code>document.activeElement</code> 300 ms nach <code>(onShow)</code>. Die Verzögerung ist nicht
          optional: Optimus bewegt den Fokus aus <code>onAfterEnter</code>, nach der Einblend-Bewegung und einem kurzen
          internen <code>setTimeout</code>, also meldet alles, was im selben Tick gelesen wird, den Auslöser, nicht den
          Dialog — deshalb verzögert auch der Playground seine Messung.
          <strong>Folge für Autoren:</strong> Wenn das erste fokussierbare Element in deinem Inhalt zerstörerisch ist, ist
          es jetzt das Standardziel eines versehentlichen <kbd>Enter</kbd>. Ordne den Inhalt entweder so, dass das sichere
          Steuerelement zuerst kommt, oder setz <code>[focusOnShow]="false"</code> und bewege den Fokus selbst.
        </p>

        <h4>3. Der Fokus bleibt drin</h4>
        <p>
          <code>pFocusTrap</code> setzt ein verstecktes, fokussierbares <code>&lt;span&gt;</code> vor und hinter die
          Dialog-Wurzel; fokussierst du das letzte, landest du beim ersten echten Element und umgekehrt. Mit Tab durch einen
          Dialog zu gehen verlässt ihn deshalb nie: <strong>Schließen-Button → Eingabefeld → Abbrechen → Speichern →
          Schließen-Button → …</strong>, endlos.
        </p>
        <p class="src-note">
          Mechanismus in <code>openng-optimus-ui-focustrap.mjs</code> (<code>onFirstHiddenElementFocus</code> /
          <code>onLastHiddenElementFocus</code>). Beachte, was das <em>nicht</em> ist: Der Hintergrund wird nie inert
          gemacht, also erreichen ein Screenreader-Nutzer im Lesemodus und alles, was programmatisch ein Element außerhalb
          des Dialogs fokussiert, weiterhin die Seite dahinter. Bei offenem modalen Dialog
          <strong>bekommt nichts außerhalb davon <code>inert</code> oder <code>aria-hidden</code></strong> —
          <code>&lt;main&gt;</code> meldet <code>inert</code> <strong>false</strong> und <code>aria-hidden</code>
          <strong>null</strong>. Die beiden echten Effekte auf den Hintergrund sind die Klasse <code>p-overflow-hidden</code>
          am <code>&lt;body&gt;</code> (berechnet <code>overflow: hidden</code>) und die Maske selbst: Ein Hit-Test auf einen
          Hintergrund-Button über <code>document.elementFromPoint</code> liefert <code>div.p-dialog-mask</code>, also ist
          der <em>Zeiger</em> blockiert — durch ein div, nicht durch Inertheit.
        </p>

        <h4>4. Der Fokus kommt zurück — nicht implementiert</h4>
        <p>
          Es gibt in <code>Dialog</code> und in <code>FocusTrap</code> keinen Code, der sich das zuvor fokussierte Element
          merkt oder es wiederherstellt. <code>onAfterLeave()</code> baut Listener ab, räumt den z-Index weg und gibt
          <code>onHide</code> aus (<code>openng-optimus-ui-dialog.mjs:960-989</code>) — und hört auf. Öffne einen Dialog über
          einen Button und drück <kbd>Esc</kbd>, und <code>document.activeElement</code> ist
          <strong><code>document.body</code> — gar nichts</strong>. Das Do/Don’t-Paar im Tab Verwendung meldet das in deinem
          eigenen Browser.
        </p>
        <p>
          Die Lösung sind vier Zeilen, und jedes Overlay braucht sie. Das Kit hält sie an einer Stelle, statt sie je
          Aufrufstelle neu herzuleiten — <code>FocusReturn</code> in <code>src/app/utils/focus-return.ts</code>, vor dem
          Öffnen merken, aus <code>(onHide)</code> wiederherstellen:
        </p>
        <pre class="code-block"><code>{{ focusReturnSnippet }}</code></pre>

        <h4>Tastatur</h4>
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
                <td><kbd>Esc</kbd></td>
                <td>
                  Schließt — aber nur, wenn <code>closeOnEscape</code> UND <code>closable</code> true sind, und nur den
                  Dialog, dessen z-Index gerade der oberste ist. Der Listener sitzt auf <code>document</code>, also feuert er,
                  wo auch immer der Fokus ist.
                </td>
              </tr>
              <tr>
                <td><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd></td>
                <td>Kreist über die Wächter-Spans innerhalb des Dialogs.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> auf dem Schließen-Button</td>
                <td>Zusätzlich zum Klick ausdrücklich behandelt (<code>(keydown.enter)="close($event)"</code>).</td>
              </tr>
              <tr>
                <td>Verschieben / Größe ändern</td>
                <td>
                  <strong>Nur mit der Maus.</strong> Es gibt keine Entsprechung per Tastatur;
                  <code>[draggable]="false" [resizable]="false"</code> ist der barrierefreie Standard.
                </td>
              </tr>
              <tr>
                <td>Maximieren</td>
                <td>Per Tastatur bedienbar (es ist ein Button), aber sein Label kommt aus der ARIA-Übersetzungstabelle der Bibliothek.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Escape-Handler: <code>bindDocumentEscapeListener()</code>
          (<code>openng-optimus-ui-dialog.mjs:906-919</code>), gebunden aus
          <code>bindGlobalListeners()</code> unter <code>if (this.closeOnEscape &amp;&amp; this.closable)</code> (:854).
          Mit <code>[closable]="false"</code> schließt weder <kbd>Esc</kbd> noch ein mousedown auf der Maske den Dialog — der
          Playground hat einen Schalter dafür. <strong>Mögliches Rauschen in der Konsole:</strong> <code>close()</code> ruft
          <code>event.preventDefault()</code> auf (<code>openng-optimus-ui-dialog.mjs:645-649</code>); wenn ein Schließen per
          <kbd>Esc</kbd> <em>„Unable to preventDefault inside passive event listener invocation“</em> protokolliert, kommt das
          aus der Bibliothek, nicht von deiner Aufrufstelle.
        </p>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Du kannst in einem Satz sagen, warum dieser Inhalt unterbricht, statt auf der Seite zu stehen.</li>
          <li>
            ☐ Der Dialog hat einen zugänglichen Namen: <code>[header]</code> oder <code>#header</code> mit
            <code>[id]="ariaLabelledBy"</code> auf deiner eigenen Überschrift. Im Accessibility Tree geprüft, nicht
            angenommen.
          </li>
          <li>☐ <code>[modal]="true"</code> (der Standard der Bibliothek ist <code>false</code>), wann immer die Aufgabe blockiert.</li>
          <li>☐ <code>[draggable]="false" [resizable]="false"</code>, außer du lieferst für beides einen Weg per Tastatur.</li>
          <li>☐ <kbd>Esc</kbd> schließt ihn, und <code>[closable]="true"</code>, damit der Listener tatsächlich gebunden ist.</li>
          <li>☐ <code>(onHide)</code> gibt den Fokus an das Element zurück, das ihn geöffnet hat.</li>
          <li>☐ Du weißt, wo der Fokus beim Öffnen landet, und es ist kein zerstörerisches Steuerelement.</li>
          <li>☐ <code>closeAriaLabel</code> ist gesetzt und übersetzt — es gibt keinen Standard.</li>
          <li>
            ☐ Die Breite ist <code>vw</code> + <code>maxWidth</code>; der Body scrollt über <code>contentStyle</code>, der
            Dialog läuft bei 360 px nicht über den Viewport hinaus.
          </li>
          <li>☐ Der Fokus ist am Schließen-Button in <strong>beiden</strong> Themes sichtbar.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Ein Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), der die beiden Regeln festnagelt, für die es diesen Guide gibt — der
          Dialog ist benannt, und der Name löst sich zu einem echten Element auf:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Vier Strings, und einer davon hat keinen Standard</h3>
        <ul>
          <li>
            <strong><code>header</code></strong> — der Titel und der zugängliche Name. Binde ihn über ein
            <code>computed()</code> an den <code>TranslationService</code> des Kits, sonst friert er beim Sprachwechsel ein.
          </li>
          <li>
            <strong><code>closeAriaLabel</code></strong> — der Name des Schließen-Buttons. Optimus bindet
            <code>[ariaLabel]="closeAriaLabel"</code> mit
            <strong>keinem Standard und keinem Übersetzungs-Ersatz</strong> (<code>openng-optimus-ui-dialog.mjs:304, :1099</code>),
            anders als die Buttons zum Maximieren/Minimieren, die <code>config.getTranslation(TranslationKeys.ARIA)</code>
            lesen (:548-553). Bleibt es ungesetzt, ist der zugängliche Name des Schließen-Buttons <strong>&quot;&quot; — der
            leere String</strong>.
          </li>
          <li>
            <strong>Die Labels deiner Footer-Buttons</strong> — mit dem Verb vorn, übersetzt und lang genug zum Umbrechen.
            Deutsch läuft 20–40 % länger als Englisch („Delete“ → „Unwiderruflich löschen“).
          </li>
          <li><strong>Der Body</strong> — gewöhnlicher Inhalt; nichts Dialog-Spezifisches.</li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Daraus folgen zwei Regeln, und man dreht sie leicht verkehrt herum. <code>closeAriaLabel</code> erreicht nur dann
          etwas, wenn der Dialog seinen Schließen-Button tatsächlich rendert — mit <code>[showHeader]="false"</code> gibt es
          keinen Button, auf dem das Label landen könnte, und es dort zu setzen ist wirkungslos, liest sich aber wie eine
          Lösung. Umgekehrt liefert jeder Dialog, der den eingebauten Schließen-Button <em>behält</em> und das Label
          ungesetzt lässt, ein Steuerelement mit dem Namen <strong>&quot;&quot;</strong> aus. Binde es über den
          <code>TranslationService</code> des Kits, genauso wie den Header.
        </p>

        <h3>Die eigenen Strings der Bibliothek</h3>
        <p>
          Die Labels für Maximieren/Minimieren kommen aus der eigenen ARIA-Tabelle der Bibliothek, nicht aus deinen
          Bindings. <code>app.config.ts</code> übergibt <code>provideOptimus</code> keinen <code>translation</code>-Block — ein
          statischer könnte einem Sprachwechsel ohnehin nicht folgen. Stattdessen schiebt das Kit die Strings bei jedem
          Sprachwechsel über <code>Optimus.setTranslation</code> hinein, gespeist aus einem <code>i18n</code>-Modul je
          Sprache (<code>optimus.json</code>), also sagt ein maximierbarer Dialog die aktuelle Sprache an:
        </p>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> führt nur eine Ebene tief zusammen, also wird der <code>aria</code>-Block als Ganzes
          ersetzt — spreize zuerst den aktuellen, sonst gehen die Keys verloren, die du nicht aufgeführt hast. Übersetzt ist
          nur das Vokabular, das die gerenderten Komponenten tatsächlich lesen; die Datums-, Filter- und Datei-Upload-Strings
          der Bibliothek bleiben mit Absicht auf ihren englischen Standards.
        </p>

        <h3>Länge: Der Dialog wächst, der Header bricht nicht schön um</h3>
        <p>
          Ein Dialog mit <code>90vw / maxWidth</code> kommt mit einem langen übersetzten Body gut zurecht — zuerst brechen
          der <em>Header</em> und die <em>Footer-Zeile</em>: Der Titel sitzt in einer Flex-Zeile neben den Header-Aktionen,
          und zwei lange Button-Labels nebeneinander laufen auf einem Handy über einen Dialog von 24 rem hinaus. Teste die
          längste Sprache, die du auslieferst, bei 360 px und lass die Footer-Buttons sich stapeln (<code>flex-wrap: wrap</code>
          an <code>.p-dialog-footer</code> oder Buttons in voller Breite auf Mobilgeräten, was die allgemeine Regel des Kits
          für interaktive Oberflächen ist).
        </p>

        <h3>RTL</h3>
        <p>
          Der Dialog bietet ein <code>rtl</code>-Input, und Header und Footer sind Flex-Zeilen, die sich mit
          <code>direction: rtl</code> umkehren; die <code>position</code>-Werte <code>'left'</code>/<code>'right'</code> sind
          allerdings <em>physisch</em> — sie werden zu <code>justify-content: flex-start</code>/<code>flex-end</code>, nicht
          zu logischem Start/Ende. Eine nachgelagerte RTL-Locale müsste diese beiden Werte tauschen. Nicht durch das Rendern
          einer RTL-Locale geprüft — das Kit liefert keine aus.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Schließen-Button
            bekommt den 2px-Ring des Kits in <code>--primary-color-fg</code> (geprüft auf dem Panel, niedrigster Wert 5,18:1)
            statt des sekundären 1px-Rings; Schließen-Icon niedrigster Wert 5,21:1.
          </li>
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Kontrast aus den geprüften Zeilen „dialog“ und „panel outline“ der
            CONTRAST.MD zitiert statt aus der Standardpalette; die Panel-Füllung auf Auras Standard-Surface korrigiert, die
            die Stile nicht ersetzen.
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Das Agent-Doc deckt jetzt auch <code>dynamicdialog</code> ab
            (<code>DialogService</code>, die <code>closable</code>-Falle, die <code>!== false</code>-Standards) und
            <code>focustrap</code> (<code>pFocusTrap</code> gegenüber dem <code>cdkTrapFocus</code> des Kits).
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — „styles.scss hat keine .p-dialog-Regel“ korrigiert: Jeder visuelle Stil setzt
            den Rahmen des Dialogs (Rahmen, Radius, Schatten). Farben als Token neu angegeben (ADR-0016); der Zeilenverweis in
            der Konfiguration für overlayAppendTo ist :88; Notizen „gemessen auf 21.1.9“ entfernt; Historie mit dem Neuesten
            zuerst sortiert.
          </li>
          <li>
            <strong>v0.5</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014). Zwei Aussagen zu v22
            zurückgedreht: <code>pTemplate</code> bindet wieder (die <code>PrimeTemplate</code>-Abfrage aus v21 hat den Fork
            überlebt), und <code>transitionOptions</code> gibt es wieder, jetzt nur noch als Ersatzverzögerung des
            Fokuswechsels. Stattdessen wurde die Benennung modernisiert: <code>ariaLabelledBy</code> ist ein
            <em>Input</em>-Signal, und die ID an <code>aria-labelledby</code> ist
            <code>computedAriaLabelledBy() = ariaLabelledBy() ?? headerId()</code>, also lesen die Dialoge des Kits mit
            eigenem Rahmen jetzt <code>dlg.computedAriaLabelledBy()</code>. Das Computed
            <code>scrollBlockerActive</code> ist weg (das Template bindet <code>modal || blockScroll</code>
            direkt), Inputs sind wieder schlichte Properties, und jeder Zeilenverweis in die Quelle wurde gegen die
            <code>openng-optimus-ui-*</code>-Bundles neu hergeleitet. Die Aura-Token stehen wieder auf den Werten von 2.x —
            der Dialog-Titel ist wieder 1.25rem und der Footer-Abstand 0.5rem. Browser-Messungen (Fokus-Ring, berechnete
            Stile, Accessibility Tree) wurden nicht neu erhoben.
          </li>
          <li>
            <strong>v0.4</strong> — 23.08.2026 — Neu geprüft gegen PrimeNG 22.1. <code>ariaLabelledBy</code> ist jetzt ein
            Computed-Signal (ruf es auf; ein Header, der irgendwann <code>null</code> ist, nimmt dem Dialog live seinen
            Namen — die Dialoge des Kits binden <code>[header]="''"</code> als Schutz). <code>pTemplate</code> bindet in v22
            nichts — alle Templates sind zu Referenznamen umgezogen (<code>#header</code>, <code>#footer</code>).
            <code>transitionOptions</code> ist weg; der Fokus wartet auf die Einblend-Bewegung. Alle Zeilenverweise in die
            Quelle gegen 22.1.2 neu hergeleitet; die Konsolen-Notiz zum passiven Listener auf „gemessen auf 21“
            zurückgestuft. Aura-Token des Dialogs: Titel 1.25→1.125rem, Footer-Abstand 0.5→0.375rem; der Rest bleibt.
          </li>
          <li>
            <strong>v0.3</strong> — 20.08.2026 — Zusammenfassung des WCAG-2.2-Status im Tab Design ergänzt: gemessene
            Kriterien als bestanden / nicht bestanden / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht
            beansprucht.
          </li>
          <li>
            <strong>v0.2</strong> — 30.07.2026 — Bestandslisten der Aufrufstellen durch den Hausstil des Kits und den
            Musterverweis <code>FocusReturn</code> ersetzt; i18n-Abschnitt auf den Laufzeitweg über
            <code>setTranslation</code> korrigiert.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erster Guide: Entscheidungstabelle für Container, Fokus-Playground, vier
            Do/Don’t-Paare, Design-Werte von Aura, Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DialogArticleDeComponent extends DialogArticleComponent {
  override readonly pgName = signal('Quellen für Kapitel 4');

  override readonly pgFocusOpenReport = signal('— öffne den Dialog, um zu messen —');
  override readonly pgFocusCloseReport = signal('— schließ ihn, um zu messen —');

  override readonly ddReturnBadReport = signal('— noch nicht gemessen —');
  override readonly ddReturnGoodReport = signal('— noch nicht gemessen —');

  override openPlayground(): void {
    this.pgFocusOpenReport.set('wird gemessen …');
    this.pgFocusCloseReport.set('— schließ ihn, um zu messen —');
    this.pgVisible.set(true);
  }

  override openReturnBad(): void {
    this.ddReturnBadReport.set('wird gemessen …');
    this.ddReturnBad.set(true);
  }

  override openReturnGood(): void {
    this.ddReturnGoodReport.set('wird gemessen …');
    this.ddReturnGood.set(true);
  }

  /** The same SSR-safe focus description as the English base, in German. */
  protected override describeActiveElement(): string {
    if (typeof document === 'undefined') return 'beim Rendern auf dem Server nicht messbar';
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return 'nichts — document.body (der Fokus ging verloren)';
    if (!el.isConnected) return 'nichts — das fokussierte Element wurde mit dem Dialog entfernt';
    const tag = el.tagName.toLowerCase();
    const cls = (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)[0];
    const name = el.getAttribute('aria-label') ?? (el.textContent ?? '').trim().slice(0, 28);
    const where = el.closest('.p-dialog') ? 'im Dialog' : 'außerhalb des Dialogs';
    return `<${tag}${cls ? '.' + cls : ''}>${name ? ` „${name}“` : ''} — ${where}`;
  }

  override readonly examples: DialogArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLE_TEXT_DE[ex.id],
  }));
}

/** German titles and notes of the examples; id and code stay those of the English base. */
const EXAMPLE_TEXT_DE: Record<string, { title: string; note: string }> = {
  basic: {
    title: 'Die Grundform: eine Frage mit zwei Antworten',
    note: 'Header als Frage, Buttons mit dem Verb vorn, Fokus beim Schließen zurückgegeben.',
  },
  form: {
    title: 'Ein Formular im Dialog — achte darauf, wo der Fokus landet',
    note: 'Das erste fokussierbare Element des INHALTS gewinnt, also startet der Cursor im Textfeld, nicht auf dem Schließen-Button.',
  },
  headless: {
    title: 'Dein eigener Header — ohne den Namen zu verlieren',
    note: '#header übergibt dir in seinem Kontext die erzeugte ariaLabelledBy-ID. Setz sie auf deine Überschrift — und lass showHeader in Ruhe, denn das Template lebt innerhalb seines *ngIf.',
  },
  nonmodal: {
    title: 'Nicht modal — und warum das selten ist, was du willst',
    note: 'Die Seite dahinter funktioniert weiter, aber der Dialog schreibt trotzdem aria-modal="true". Wenn er nicht blockiert, nimm lieber ein Popover oder ein Panel.',
  },
};
