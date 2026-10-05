import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PopoverArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './popover-article.component';

/**
 * German twin of the Popover guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the focus read-out, the playground
 * options and the measured-value texts shown in the page are German. Keep it in step
 * with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs popover`).
 */
@Component({
  selector: 'app-popover-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'popover'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Popover ist ein Panel, das an dem Element verankert ist, auf das du geklickt hast, während die Seite
          dahinter benutzbar bleibt. Alles hier unten ist echtes <code>p-popover</code>: der Playground, die
          Live-Anzeige des Fokus, die zeigt, wohin der Cursor tatsächlich springt, das Panel, das nahe dem unteren
          Fensterrand über seinen Trigger klappt, und das, das sich am Bildschirmrand rechtsbündig ausrichtet.
        </p>

        <!-- Live focus read-out -->
        <section class="probe" aria-live="off">
          <span class="probe__label">document.activeElement</span>
          <code class="probe__value">{{ activeDesc() }}</code>
          <span class="probe__hint">
            Öffne unten ein beliebiges Panel und beobachte diese Zeile. So siehst du am schnellsten, wohin der Fokus
            tatsächlich geht: zum ersten Element im Panel mit dem Attribut
            <code>autofocus</code> — und das ist in dieser Bibliotheksversion sein erster <code>p-button</code>, solange
            du nichts anderes festlegst.
          </span>
        </section>

        <!-- Playground -->
        <section class="pg" aria-label="Popover-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Konfigurieren</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-dismissable">dismissable (Klick außerhalb schließt)</label>
                <p-toggleswitch
                  inputId="pg-dismissable"
                  [ngModel]="pgDismissable()"
                  (ngModelChange)="pgDismissable.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-autofocus">ein Element mit dem Attribut autofocus im Panel</label>
                <p-toggleswitch
                  inputId="pg-autofocus"
                  [ngModel]="pgAutofocus()"
                  (ngModelChange)="pgAutofocus.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-focusonshow">focusOnShow (standardmäßig an)</label>
                <p-toggleswitch
                  inputId="pg-focusonshow"
                  [ngModel]="pgFocusOnShow()"
                  (ngModelChange)="pgFocusOnShow.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-appendto-label">appendTo</span>
                <p-select
                  [ariaLabelledBy]="'pg-appendto-label'"
                  size="small"
                  [options]="appendToOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAppendTo()"
                  (ngModelChange)="pgAppendTo.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-name">dem Panel einen zugänglichen Namen geben</label>
                <p-toggleswitch inputId="pg-name" [ngModel]="pgNamed()" (ngModelChange)="pgNamed.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <p-button
                  id="pg-trigger"
                  label="Spalteneinstellungen"
                  icon="pi pi-sliders-h"
                  severity="secondary"
                  [outlined]="true"
                  [pt]="pgTriggerPt()"
                  (onClick)="pgPanel.toggle($event)"
                />
                <p-popover
                  #pgPanel
                  [dismissable]="pgDismissable()"
                  [focusOnShow]="pgFocusOnShow()"
                  [appendTo]="pgAppendTo()"
                  [ariaLabel]="pgNamed() ? 'Spalteneinstellungen' : undefined"
                  [pt]="ptPanelId"
                  (onShow)="pgOpen.set(true)"
                  (onHide)="pgOpen.set(false)"
                >
                  <div class="panel">
                    <h4 class="panel__title">Spalteneinstellungen</h4>
                    @if (pgAutofocus()) {
                      <label class="panel__label" for="pg-filter">Spalten filtern</label>
                      <input pInputText id="pg-filter" [pAutoFocus]="true" placeholder="Zum Filtern tippen" />
                    } @else {
                      <p class="panel__body">
                        Kein Feld trägt das Attribut autofocus — die beiden Buttons darunter aber schon, ob du es
                        wolltest oder nicht, also landet der Fokus auf Zurücksetzen.
                      </p>
                    }
                    <div class="panel__row">
                      <p-button label="Zurücksetzen" severity="secondary" [text]="true" size="small" />
                      <p-button label="Anwenden" size="small" (onClick)="pgPanel.hide()" />
                    </div>
                  </div>
                </p-popover>
                <p class="pg__hint">
                  {{ pgOpen() ? 'Offen' : 'Geschlossen' }} &middot; das Panel ist <code>role="dialog"</code> mit
                  <code>aria-modal="{{ pgOpen() }}"</code>, sobald es offen ist, egal was der Rest dieser Konfiguration
                  sagt.
                </p>
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

        <!-- Passive detail -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Der Normalfall: ein Detail, das der Nutzer sehen wollte</h3>
            <button type="button" class="copy-btn" (click)="copy('detail', detailCode)">
              {{ copiedId() === 'detail' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Passiver Inhalt, ein Trigger, nichts abzuschicken. Der Trigger ist ein gewöhnlicher Button, der seinen
            eigenen Zustand meldet; das Panel hat einen Namen, also ist der Knoten im Accessibility Tree kein anonymer
            Dialog.
          </p>
          <div class="ex__stage">
            <span class="prose">
              Retrieval-Augmented Generation stützt eine Antwort auf abgerufene Dokumente
              <p-button
                id="detail-trigger"
                label="Was ist Grounding?"
                [link]="true"
                size="small"
                [pt]="detailTriggerPt()"
                (onClick)="detailPanel.toggle($event)"
              />
              — und zwar, bevor das Modell ein Wort schreibt.
            </span>
            <p-popover
              #detailPanel
              [ariaLabel]="'Grounding, Definition'"
              (onShow)="detailOpen.set(true)"
              (onHide)="detailOpen.set(false)"
            >
              <div class="panel panel--prose">
                <h4 class="panel__title">Grounding</h4>
                <p class="panel__body">
                  Eine erzeugte Aussage an eine abgerufene Quelle binden, damit man die Behauptung prüfen kann, statt
                  sie glauben zu müssen. Eine Antwort ohne Grounding kann trotzdem stimmen — sie bringt nur keinen
                  Beleg mit.
                </p>
              </div>
            </p-popover>
          </div>
          <pre class="code-block"><code>{{ detailCode }}</code></pre>
        </section>

        <!-- Interactive panel with autofocus + closeCallback -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Ein interaktives Panel: autofocus hinein, closeCallback hinaus</h3>
            <button type="button" class="copy-btn" (click)="copy('form', formCode)">
              {{ copiedId() === 'form' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Sobald das Panel ein Bedienelement enthält, muss der Fokus hinein — und dafür braucht es ein Element mit
            dem Attribut <code>autofocus</code>, und genau das schreibt <code>pAutoFocus</code>. Der Schließen-Button
            hier kommt aus dem <code>closeCallback</code> des Templates <code>#content</code>, der einzigen
            Schließmöglichkeit, die die Komponente anbietet.
          </p>
          <div class="ex__stage">
            <p-button
              id="form-trigger"
              label="Label hinzufügen"
              icon="pi pi-tag"
              size="small"
              [pt]="formTriggerPt()"
              (onClick)="formPanel.toggle($event)"
            />
            <p-popover #formPanel [ariaLabel]="'Label hinzufügen'" (onShow)="formOpen.set(true)" (onHide)="onFormHide()">
              <ng-template #content let-close="closeCallback">
                <div class="panel">
                  <h4 class="panel__title">Label hinzufügen</h4>
                  <label class="panel__label" for="label-name">Name</label>
                  <input
                    pInputText
                    id="label-name"
                    [pAutoFocus]="true"
                    [ngModel]="labelName()"
                    (ngModelChange)="labelName.set($event)"
                  />
                  <div class="panel__row">
                    <p-button
                      label="Abbrechen"
                      severity="secondary"
                      [text]="true"
                      size="small"
                      (onClick)="close($event)"
                    />
                    <p-button label="Speichern" size="small" (onClick)="close($event)" />
                  </div>
                </div>
              </ng-template>
            </p-popover>
            <span class="ex__aside">
              Bei <code>(onHide)</code> geht der Fokus zurück auf den Trigger — das erledigt die Komponente nicht für
              dich. Zuletzt gespeicherter Name: <code>{{ savedName() || '—' }}</code>
            </span>
          </div>
          <pre class="code-block"><code>{{ formCode }}</code></pre>
        </section>

        <!-- Positioning: flip and edge -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Wo es landet: darunter, nach oben geklappt oder rechtsbündig</h3>
            <button type="button" class="copy-btn" (click)="copy('place', placeCode)">
              {{ copiedId() === 'place' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Es gibt keinen Input <code>position</code>. Das Panel sitzt unter seinem Trigger und richtet sich am
            Inline-Anfang des Triggers aus; es klappt nach oben, wenn es darunter nicht passt, und verschiebt sich so,
            dass seine rechte Kante bündig sitzt, wenn es rechts über den Viewport hinausragen würde. Um das Klappen zu
            sehen, scroll diese Seite, bis der linke Trigger nahe dem unteren Fensterrand sitzt, und öffne ihn dann.
          </p>
          <div class="ex__stage ex__stage--split">
            <div class="place place--left">
              <p-button
                id="flip-trigger"
                label="Öffnet darunter oder darüber"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="flipPanel.toggle($event)"
              />
              <p-popover #flipPanel [ariaLabel]="'Demonstration der Platzierung'">
                <div class="panel panel--tall">
                  <h4 class="panel__title">Platzierung</h4>
                  <p class="panel__body">
                    Hoch genug, um unter einem Trigger nahe dem unteren Fensterrand nicht zu passen. Klappt es nach
                    oben, bekommt die Wurzel <code>p-popover-flipped</code> und
                    <code>data-p-popover-flipped="true"</code>, und der CSS-Pfeil wandert von der oberen an die untere
                    Kante.
                  </p>
                </div>
              </p-popover>
            </div>
            <div class="place place--right">
              <p-button
                id="edge-trigger"
                label="Öffnet am rechten Rand"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="edgePanel.toggle($event)"
              />
              <p-popover #edgePanel [ariaLabel]="'Demonstration des rechten Rands'">
                <div class="panel panel--wide">
                  <h4 class="panel__title">Rechter Rand</h4>
                  <p class="panel__body">
                    Breiter als der Platz bis zum Rand des Viewports, also wird die rechte Kante des Panels auf die
                    rechte Kante des Triggers zurückgezogen, und der Pfeil gleitet mit, um über dem Trigger zu bleiben.
                  </p>
                </div>
              </p-popover>
            </div>
          </div>
          <pre class="code-block"><code>{{ placeCode }}</code></pre>
        </section>

        <!-- Dismissal -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Schließen: Klick außerhalb, Escape, Scrollen, Größenänderung</h3>
            <button type="button" class="copy-btn" (click)="copy('dismiss', dismissCode)">
              {{ copiedId() === 'dismiss' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Das linke Panel ist der Standard. Das rechte setzt
            <code>[dismissable]="false"</code>: Ein Klick auf die Seite schließt es nicht mehr — Escape aber schon,
            von überall im Dokument, weil es für diesen Listener keinen Schalter gibt. Der dritte Trigger steckt in
            einer scrollenden Box, und das ist das Schließen, mit dem niemand rechnet.
          </p>
          <div class="ex__stage ex__stage--split">
            <div class="place">
              <p-button
                id="dismiss-default"
                label="dismissable (Standard)"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="dismissA.toggle($event)"
              />
              <p-popover #dismissA [ariaLabel]="'Schließbares Panel'">
                <div class="panel panel--prose">
                  <p class="panel__body">Klick irgendwo außerhalb oder drück Escape.</p>
                </div>
              </p-popover>
            </div>
            <div class="place">
              <p-button
                id="dismiss-sticky"
                label="dismissable false"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="dismissB.toggle($event)"
              />
              <p-popover #dismissB [dismissable]="false" [ariaLabel]="'Haftendes Panel'">
                <div class="panel panel--prose">
                  <p class="panel__body">
                    Ein Klick außerhalb lässt dieses Panel offen. Escape schließt es trotzdem — diese Komponente hat
                    kein <code>closeOnEscape</code>.
                  </p>
                </div>
              </p-popover>
            </div>
          </div>
          <div class="scrollbox" tabindex="0" role="group" aria-label="Scrollender Container">
            <p class="scrollbox__filler">Scroll diese Box, während das Panel offen ist.</p>
            <p-button
              id="scroll-trigger"
              label="Trigger in einer scrollenden Box"
              size="small"
              severity="secondary"
              [outlined]="true"
              (onClick)="scrollPanel.toggle($event)"
            />
            <p-popover #scrollPanel [ariaLabel]="'Demonstration: Schließen beim Scrollen'">
              <div class="panel panel--prose">
                <p class="panel__body">
                  Scrollen in der Box schließt dieses Panel. Das Panel wird einmal positioniert, beim Öffnen, und die
                  Antwort der Komponente auf einen sich bewegenden Anker ist Ausblenden statt Neuausrichten.
                </p>
              </div>
            </p-popover>
            <p class="scrollbox__filler">Mehr Inhalt, damit die Box wirklich scrollt.</p>
            <p class="scrollbox__filler">Und noch mehr.</p>
          </div>
          <pre class="code-block"><code>{{ dismissCode }}</code></pre>
        </section>

        <!-- Against a tooltip -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Seite an Seite mit einem Tooltip</h3>
            <button type="button" class="copy-btn" (click)="copy('vs', vsCode)">
              {{ copiedId() === 'vs' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Derselbe Anker, dieselbe Ecke des Bildschirms, zwei verschiedene Verträge. Fahr mit der Maus über den
            ersten Button und klick den zweiten. Den Tooltip erreichst du per Tastatur nicht mehr, sobald er angezeigt
            wird, und er kann keinen Link enthalten; das Popover kann alles enthalten und schließt bei Escape. Das
            Panel hier geht außerdem den anderen Weg zum Namen — <code>[ariaLabelledBy]</code>, das auf seine eigene
            Überschrift zeigt, statt <code>[ariaLabel]</code>.
          </p>
          <div class="ex__stage">
            <p-button
              label="Hover hier (Tooltip)"
              size="small"
              severity="secondary"
              [outlined]="true"
              pTooltip="Ein kurzer, nicht interaktiver Hinweis. Hier drin lässt sich nichts anklicken."
              tooltipPosition="bottom"
            />
            <p-button
              id="vs-trigger"
              label="Klick hier (Popover)"
              size="small"
              [pt]="vsTriggerPt()"
              (onClick)="vsPanel.toggle($event)"
            />
            <p-popover
              #vsPanel
              [ariaLabelledBy]="'vs-heading'"
              (onShow)="vsOpen.set(true)"
              (onHide)="vsOpen.set(false)"
            >
              <div class="panel panel--prose">
                <h4 class="panel__title" id="vs-heading">Interaktiver Inhalt</h4>
                <p class="panel__body">
                  Interaktiver Inhalt ist der ganze Unterschied:
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    >ein Link, den die Tastatur erreicht</a
                  >, und ein Button.
                </p>
                <div class="panel__row">
                  <p-button label="Schließen" size="small" severity="secondary" [text]="true" (onClick)="vsPanel.hide()" />
                </div>
              </div>
            </p-popover>
          </div>
          <pre class="code-block"><code>{{ vsCode }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche verankerte Oberfläche, und was jede verspricht</h3>
        <p>
          Das Popover steht mitten in einer Familie von Overlays, die alle ähnlich aussehen und sich völlig
          unterschiedlich verhalten. Zwei Fragen entscheiden es fast immer: <strong>Kann man mit dem Inhalt
          interagieren</strong>, und <strong>muss der Rest der Seite warten</strong>. Ein Tooltip scheitert an der
          ersten, ein Dialog beantwortet die zweite mit Ja, und ein Popover ist, was übrig bleibt: interaktiver Inhalt,
          für den die Seite nicht anhalten muss.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Oberfläche</th>
                <th>Greif dazu, wenn</th>
                <th>Im Accessibility Tree</th>
                <th>Schließen</th>
                <th>Fokus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Nichts</strong> — setz es auf die Seite</td>
                <td>Der Inhalt gehört zum Thema der Seite und ist kein Umweg. Immer die erste Antwort.</td>
                <td>Gewöhnlicher Inhalt, in Lesereihenfolge.</td>
                <td>Nicht nötig.</td>
                <td>Unverändert.</td>
              </tr>
              <tr>
                <td><strong>Inline-Disclosure</strong> — ein Button plus <code>&#64;if</code></td>
                <td>Passives Detail, das im Fluss stehen kann: eine Definition, eine Fußnote, eine Erklärung.</td>
                <td>Inhalt in DOM-Reihenfolge, nach seinem Trigger.</td>
                <td>Derselbe Button.</td>
                <td>Bleibt auf dem Trigger; der Inhalt ist der nächste Tab-Stopp. Überhaupt keine Overlay-Mechanik.</td>
              </tr>
              <tr>
                <td><code>pTooltip</code></td>
                <td>Ein kurzer Hinweis zu einem Bedienelement, das der Nutzer nicht anfassen muss.</td>
                <td>
                  Ein Knoten mit <code>role="tooltip"</code> (<code>openng-optimus-ui-tooltip.mjs:479</code>), der
                  <strong>nicht</strong> per <code>aria-describedby</code> mit dem Trigger verknüpft ist.
                </td>
                <td>Zeiger verlässt den Trigger, Blur oder Escape (<code>hideOnEscape</code>).</td>
                <td>
                  Bewegt sich nie. Nichts darin ist erreichbar — ein Link oder Button in einem Tooltip ist schon von
                  der Bauart her unbenutzbar.
                </td>
              </tr>
              <tr>
                <td><code>p-popover</code></td>
                <td>
                  Interaktiver oder umfangreicher Inhalt, der zu einem Trigger gehört, während die Seite dahinter
                  benutzbar bleibt.
                </td>
                <td>
                  <code>role="dialog"</code> mit <code>aria-modal="true"</code>, solange offen ({{ ariaModalFinding }}).
                </td>
                <td>
                  Klick außerhalb (<code>dismissable</code>, standardmäßig an), Escape, Scrollen eines Vorfahren,
                  Größenänderung des Fensters.
                </td>
                <td>{{ focusSummary }}</td>
              </tr>
              <tr>
                <td><code>p-menu [popup]</code> / <code>p-tieredmenu</code></td>
                <td>Das Panel ist eine Liste von <em>Befehlen</em> und sonst nichts.</td>
                <td><code>role="menu"</code> mit Menüeinträgen und wanderndem <code>tabindex</code>.</td>
                <td>Klick außerhalb, Escape, Auswahl eines Eintrags.</td>
                <td>
                  In die Liste, Pfeiltasten zwischen den Einträgen — der Tastaturvertrag eines Menüs, den ein Popover
                  voller Buttons nicht hat.
                </td>
              </tr>
              <tr>
                <td><code>p-confirmpopup</code></td>
                <td>„Das löschen?“ direkt neben dem Button, der es löschen würde.</td>
                <td>
                  <code>role="alertdialog"</code>
                  (<code>openng-optimus-ui-confirmpopup.mjs:502</code>), mit Fokusfalle und
                  <code>autofocus</code> auf einem seiner beiden Buttons.
                </td>
                <td>Bestätigen, Ablehnen, Klick außerhalb, Escape.</td>
                <td>
                  In das Panel, und dort gefangen. Die einzige verankerte Oberfläche der Bibliothek, die dir die
                  Fokusarbeit abnimmt.
                </td>
              </tr>
              <tr>
                <td><code>p-dialog [modal]</code></td>
                <td>
                  Eine Teilaufgabe, die blockieren muss: ein Formular, zu groß für ein Panel, eine destruktive
                  Bestätigung mit Folgen, die man lesen muss.
                </td>
                <td><code>role="dialog"</code>, <code>aria-modal="true"</code>, dazu eine Maske.</td>
                <td>Schließen-Button, Escape, Klick auf die Maske.</td>
                <td>
                  In den Inhalt, gefangen von <code>pFocusTrap</code>, und <em>nicht</em> wiederhergestellt — siehe
                  den Dialog-Guide.
                </td>
              </tr>
              <tr>
                <td><code>p-drawer</code></td>
                <td>Eine lange Fläche am Rand — Navigation, eine Filterleiste — mit der Seite weiter im Blick.</td>
                <td><code>role="complementary"</code>.</td>
                <td>Schließen-Button, Escape, Klick auf die Maske.</td>
                <td>In den Drawer; standardmäßig modal.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Spalte zum Tree ist eine Lesung des Accessibility Tree jeder gerenderten Oberfläche oder das
          role-Attribut im ausgelieferten Template an der genannten Zeile; die Spalten zu Fokus und Schließen für
          <code>p-popover</code> sind gemessen, und die Zahlen stehen im Tab Entwicklung. <strong>Nicht gemessen</strong>
          ist die Spalte „Greif dazu, wenn“ — das ist eine Einschätzung, und ihre ehrliche Form sind die zwei Fragen
          über der Tabelle.
        </p>

        <h3>Der Trigger ist die halbe Komponente</h3>
        <p>
          <code>p-popover</code> bringt keinen Trigger mit. Du bringst einen Button mit und rufst
          <code>toggle($event)</code> auf dem Panel auf — und damit gehört auch die Disclosure-Semantik dir, und sie
          ist der Teil, der am häufigsten fehlt. Drei Dinge, keines davon optional:
        </p>
        <ul>
          <li>
            <strong><code>aria-expanded</code></strong>, gebunden an den Offen-Zustand, damit ein Screenreader-Nutzer
            weiß, dass es das Panel gibt und ob es gerade angezeigt wird. Der Zustand kommt aus <code>(onShow)</code> /
            <code>(onHide)</code> oder aus <code>overlayVisible</code> der Panel-Referenz.
          </li>
          <li>
            <strong><code>aria-haspopup="dialog"</code></strong
            >, weil das die Rolle ist, die das Panel tatsächlich ansagt. <code>"true"</code> ist die alte Schreibweise
            und bedeutet <code>"menu"</code> — zutreffend nur, wenn du wirklich ein Menü hineinsetzt.
          </li>
          <li>
            <strong>Ein zugänglicher Name für das Panel</strong> — <code>[ariaLabel]</code> oder
            <code>[ariaLabelledBy]</code>. Ein <code>dialog</code>-Knoten ohne Namen wird als anonymer Dialog angesagt,
            und ein Nutzer, der darin landet, hat keine Ahnung, wofür er da ist.
          </li>
        </ul>

        <h4>Wo diese Attribute landen müssen</h4>
        <p>
          Mit <code>p-button</code> als Trigger ist das die Falle, an der das Muster tatsächlich scheitert.
          <code>&lt;p-button&gt;</code> ist ein Komponenten-Element, und der klickbare <code>&lt;button&gt;</code> wird
          <em>darin</em> gerendert, also bleibt ein Attribut-Binding auf <code>&lt;p-button&gt;</code> am Wrapper hängen
          — der keine Rolle hat und nicht das ist, was ein Screenreader ansagt. {{ wrapperAttrFinding }}
        </p>
        <p>
          Der Weg, der den echten Button erreicht, ist das Pass-through-Objekt: Der innere Button bindet den Abschnitt
          <code>root</code>, also landet <code>[pt]="&#123; root: &#123; 'aria-expanded': … &#125; &#125;"</code>
          auf ihm. Bau es in einem <code>computed()</code> statt als Inline-Literal — ein neues Objekt bei jedem
          Change-Detection-Durchlauf setzt einen Signal-Input ohne Grund neu. Ein schlichter
          <code>&lt;button&gt;</code> als Trigger hat dieses Problem gar nicht, und das ist ein legitimer Grund, ihn
          für eine Disclosure vorzuziehen.
        </p>
        <p>
          <code>aria-controls</code> lohnt sich, wenn du es einrichten kannst: Die Wurzel des Panels hat keine eigene
          id, also gib ihr eine über denselben Mechanismus am Popover —
          <code>[pt]="&#123; root: &#123; id: 'my-panel' &#125; &#125;"</code> — und lass den Trigger darauf zeigen.
          {{ ptIdFinding }} Es ist das schwächste der vier, weil <code>aria-controls</code> lückenhaft unterstützt wird,
          und die ersten drei tragen das Muster allein.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Attribute am Wrapper, kein Name am Panel</span>
            <div class="dd__stage">
              <p-button
                id="bad-trigger"
                label="Details"
                size="small"
                severity="secondary"
                [outlined]="true"
                [attr.aria-expanded]="badOpen()"
                [attr.aria-haspopup]="'dialog'"
                (onClick)="badName.toggle($event)"
              />
              <p-popover #badName (onShow)="badOpen.set(true)" (onHide)="badOpen.set(false)">
                <div class="panel panel--prose">
                  <p class="panel__body">Zwei Sätze Detail, in einem anonymen Dialog.</p>
                </div>
              </p-popover>
              <span class="dd__aside">Die Bindings sehen richtig aus und erreichen nichts.</span>
            </div>
            <p class="dd__why">
              Zwei Mängel auf einmal. Die Disclosure-Attribute stehen auf
              <code>&lt;p-button&gt;</code>, also sitzen sie am Wrapper-Element statt an dem Button, den ein
              Screenreader ansagt — {{ wrapperAttrFinding }} Und das Panel hat keinen Namen: {{ unnamedFinding }} Das
              Wort „Details“ steht auf dem Button, nicht am Dialog, also hört der Nutzer es nicht mehr, sobald er im
              Panel ist.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Disclosure-Trigger und ein benanntes Panel</span>
            <div class="dd__stage">
              <p-button label="Details" size="small" [pt]="goodTriggerPt()" (onClick)="goodName.toggle($event)" />
              <p-popover
                #goodName
                [ariaLabel]="'Sendungsdetails'"
                (onShow)="goodOpen.set(true)"
                (onHide)="goodOpen.set(false)"
              >
                <div class="panel panel--prose">
                  <h4 class="panel__title">Sendungsdetails</h4>
                  <p class="panel__body">Dieselben zwei Sätze, in einem Dialog mit Namen.</p>
                </div>
              </p-popover>
              <span class="dd__aside">Dieselben drei Angaben, über <code>[pt]</code> geleitet.</span>
            </div>
            <p class="dd__why">
              Dieselben Attribute, über das Pass-through-Objekt geliefert, damit sie auf dem inneren
              <code>&lt;button&gt;</code> landen, dazu ein Name am Panel. Die sichtbare Überschrift und der zugängliche
              Name sollten dieselben Wörter sein — erst dadurch lesen sich Panel und Button als eine Sache.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — interaktiver Inhalt in einem Tooltip</span>
            <div class="dd__stage">
              <p-button
                label="Hover für Optionen"
                size="small"
                severity="secondary"
                [outlined]="true"
                pTooltip="Umbenennen, Duplizieren, Löschen — nichts davon lässt sich anklicken."
                tooltipPosition="bottom"
              />
              <span class="dd__aside">Fahr mit der Maus darüber und versuch dann, die Wörter mit Tab zu erreichen.</span>
            </div>
            <p class="dd__why">
              Ein Tooltip verschwindet, wenn der Zeiger den Trigger verlässt, und steht nicht in der Tab-Reihenfolge,
              also ist alles darin Dekoration. Er ist außerdem nicht per <code>aria-describedby</code> mit dem Trigger
              verdrahtet, also gehört sein Text nicht zu dem, was der Trigger ansagt. Inhalt, mit dem man interagieren
              soll, braucht eine Oberfläche, die man betreten kann.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Popover für alles Klickbare</span>
            <div class="dd__stage">
              <p-button label="Optionen" size="small" [pt]="optTriggerPt()" (onClick)="optPanel.toggle($event)" />
              <p-popover #optPanel [ariaLabel]="'Optionen'" (onShow)="optOpen.set(true)" (onHide)="optOpen.set(false)">
                <div class="panel">
                  <p-button label="Umbenennen" size="small" severity="secondary" [text]="true" />
                  <p-button label="Duplizieren" size="small" severity="secondary" [text]="true" />
                </div>
              </p-popover>
              <span class="dd__aside">Erreichbar, schließbar, benannt.</span>
            </div>
            <p class="dd__why">
              Besteht das Panel aus nichts als Befehlen, passt <code>p-menu [popup]</code> besser — es bringt den
              Pfeiltasten-Vertrag mit, den eine Reihe Buttons in einem Dialog nicht hat. Die Faustregel: nur Befehle,
              nimm ein Menü; alles andere, ein Popover.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Fokusziel dem Zufall überlassen</span>
            <div class="dd__stage">
              <p-button
                label="Umbenennen"
                size="small"
                severity="secondary"
                [outlined]="true"
                (onClick)="badForm.toggle($event)"
              />
              <p-popover #badForm [ariaLabel]="'Umbenennen, ohne Fokus'">
                <div class="panel">
                  <label class="panel__label" for="bad-rename">Neuer Name</label>
                  <input pInputText id="bad-rename" />
                  <div class="panel__row">
                    <p-button label="Speichern" size="small" />
                  </div>
                </div>
              </p-popover>
              <span class="dd__aside">Öffne es und beobachte die Fokus-Anzeige oben im Tab Beispiele.</span>
            </div>
            <p class="dd__why">
              <code>focusOnShow</code> ist standardmäßig an und fokussiert das erste Element mit dem
              <em>Attribut</em> <code>autofocus</code> — und {{ autofocusAttrFinding }} Öffnen setzt den Cursor also
              auf <strong>Speichern</strong>, an dem Feld vorbei, in das der Nutzer tippen wollte. Danach stellt auch
              nichts den Fokus wieder her, und weil das Panel an <code>&lt;body&gt;</code> angehängt ist, führt Tab vom
              Trigger aus weiter in die Seite statt in das Panel. {{ tabOrderFinding }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — autofocus hinein, Fokus beim Schließen zurück</span>
            <div class="dd__stage">
              <p-button
                id="good-form-trigger"
                label="Umbenennen"
                size="small"
                [pt]="goodFormTriggerPt()"
                (onClick)="goodForm.toggle($event)"
              />
              <p-popover #goodForm [ariaLabel]="'Umbenennen'" (onShow)="goodFormOpen.set(true)" (onHide)="onGoodFormHide()">
                <div class="panel">
                  <label class="panel__label" for="good-rename">Neuer Name</label>
                  <input pInputText id="good-rename" [pAutoFocus]="true" />
                  <div class="panel__row">
                    <p-button label="Speichern" size="small" (onClick)="goodForm.hide()" />
                  </div>
                </div>
              </p-popover>
              <span class="dd__aside">Der Fokus geht ins Feld und kommt zum Button zurück.</span>
            </div>
            <p class="dd__why">
              Zwei Ergänzungen entscheiden es. <code>pAutoFocus</code> am Feld schreibt das Attribut
              <code>autofocus</code>, nach dem die Komponente sucht, und weil die Suche den <em>ersten</em> Treffer in
              Dokumentreihenfolge nimmt, gewinnt ein Feld über den Buttons. Und <code>(onHide)</code> setzt den Fokus
              zurück auf den Trigger, weil nichts in der Komponente festhält, woher er kam — ohne das landet der Cursor
              beim Schließen des Panels auf <code>&lt;body&gt;</code>.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — es als modal behandeln, weil es das behauptet</span>
            <div class="dd__stage">
              <p-button
                label="Löschen bestätigen"
                size="small"
                severity="danger"
                [outlined]="true"
                (onClick)="badModal.toggle($event)"
              />
              <p-popover #badModal [ariaLabel]="'Löschen bestätigen'">
                <div class="panel panel--prose">
                  <p class="panel__body">
                    12 Einträge löschen? Solange das offen ist, lässt sich die Seite dahinter voll anklicken, per Tab
                    erreichen und scrollen.
                  </p>
                  <div class="panel__row">
                    <p-button label="Löschen" size="small" severity="danger" />
                  </div>
                </div>
              </p-popover>
              <span class="dd__aside">Öffne es und drück Tab: Du bist sofort draußen.</span>
            </div>
            <p class="dd__why">
              Die Wurzel setzt <code>aria-modal="true"</code>, sobald sie sichtbar ist, und das ist das einzig Modale
              daran: keine Maske, kein <code>inert</code>, keine Fokusfalle, nichts, was das Scrollen blockiert. Eine
              destruktive Bestätigung, aus der ein verirrtes Tab herausspaziert, steckt im falschen Container.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die Oberfläche wählen, die zum Risiko passt</span>
            <div class="dd__stage">
              <span class="dd__aside">
                Destruktiv und verankert → <code>p-confirmpopup</code>: dieselbe Platzierung, dazu eine echte
                Fokusfalle und <code>role="alertdialog"</code>.
              </span>
              <span class="dd__aside"> Blockierend und umfangreich → <code>p-dialog [modal]="true"</code>. </span>
              <span class="dd__aside"> Umkehrbar und billig → ein Popover oder gar kein Overlay. </span>
            </div>
            <p class="dd__why">
              Das Popover ist die richtige Antwort für Inhalt, von dem der Nutzer ohne Folgen weggehen kann. Sobald
              das Verlassen mitten in der Aufgabe etwas kostet, muss die Oberfläche den Fokus halten — und diese tut
              das nicht, egal was ihr ARIA sagt.
            </p>
          </div>
        </div>

        <h3>Zwei Gewohnheiten, die nichts kosten</h3>
        <ul>
          <li>
            <strong>Ein Panel pro Seite, gedanklich.</strong> Ein Popover pro Tabellenzeile ist ein Popover pro
            Markup-Zeile und ein Schwarm von Triggern, die alle „mehr“ sagen. Verankere ein Panel und richte es neu
            aus: <code>toggle(event, target)</code> nimmt das Element, an dem verankert wird, und die Komponente zeigt
            sich am neuen Ziel neu an, wenn sich das Ziel geändert hat.
          </li>
          <li>
            <strong>Rechne damit, dass es versehentlich geschlossen wird.</strong> Klick außerhalb, Escape, Scrollen
            eines Vorfahren und eine Größenänderung des Fensters schließen es, und keines davon fragt nach. Alles, was
            in ein Popover getippt wird, wird entweder bei jeder Änderung gespeichert oder ist billig zu verlieren.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Modal Dialog pattern</a
            >
            — der Vertrag, den <code>role="dialog"</code> plus <code>aria-modal="true"</code> verspricht: Der Fokus
            geht hinein, bleibt drin und kehrt zurück, und alles außerhalb ist inert. Diese Komponente sagt die Rolle
            an und hält keine der Klauseln ein — das ist das Wichtigste, was man über sie wissen muss.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Disclosure pattern</a
            >
            — die Trigger-Hälfte: ein Button mit <code>aria-expanded</code>, der Inhalt steuert. Es ist das Muster,
            das das Markup des Popovers selbst nicht abdeckt, und der Grund, warum <code>aria-expanded</code> hier auf
            der Pflichtliste steht und nicht auf der Liste des Wünschenswerten.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-haspopup</code></a
            >
            — normativ: die erlaubten Werte und die Tatsache, dass <code>"true"</code> gleichbedeutend mit
            <code>"menu"</code> ist. Diese Gleichsetzung ist der Grund, warum ein Popover-Trigger
            <code>"dialog"</code> sagen sollte.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-modal" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-modal</code></a
            >
            — die Bedeutung der Eigenschaft ist ein Versprechen über den Rest der Seite, und Autoren wird gesagt, dass
            Inhalt außerhalb inert gemacht werden muss. Ein fest gebundenes <code>true</code> an einem nicht modalen
            Panel ist ein Mangel, keine Stilfrage.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — was ein an <code>&lt;body&gt;</code> angehängtes Overlay gefährdet: Die Tab-Reihenfolge nach dem
            Trigger ist die DOM-Reihenfolge, nicht die visuelle, solange du den Fokus nicht selbst bewegst.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.13 Content on Hover or Focus</a
            >
            — schließbar, überfahrbar, dauerhaft. Das ist die Klausel, die Hover als Popover-Trigger ausschließt, und
            der Grund, warum die Grenze zwischen Tooltip und Popover für die Konformität zählt und nicht nur für den
            Geschmack.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/Popover_API"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — Popover API</a
            >
            — die Plattform-Basis, die jünger ist als diese Komponente: Top Layer, Light Dismiss,
            <code>popovertarget</code>, das den Trigger gratis verdrahtet. Nützlich als Maßstab dafür, was die
            Bibliothek von Hand nachbaut und wo sie zurückbleibt.
          </li>
          <li>
            <a href="https://primeng.org/popover" target="_blank" rel="noopener noreferrer"> PrimeNG — Popover</a>
            — die Upstream-Doku der v21-API, die Optimus UI forkt; hier gegen den ausgelieferten Quelltext von
            &#64;openng/optimus-ui 2.0.2 geprüft statt zitiert, und drei der dokumentierten Inputs erweisen sich als
            unerreichbar.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <ul>
          <li>
            <strong>Host</strong> — <code>&lt;p-popover&gt;</code>. Rendert selbst nichts; mit dem Standardwert von
            <code>appendTo</code> ist das Panel nicht einmal sein Kind.
          </li>
          <li>
            <strong>Wurzel</strong> — <code>div.p-popover.p-component</code>, erst erzeugt, wenn das Panel mindestens
            einmal angezeigt wurde (das Template steckt in einem <code>&#64;if (render)</code>).
            <code>position: absolute</code> kommt aus der eigenen Inline-Style-Map der Komponente, die Koordinaten aus
            dem Positionierungsaufruf und die Ebene aus <code>ZIndexUtils</code>.
          </li>
          <li>
            <strong>Inhalt</strong> — <code>div.p-popover-content</code>, ein Padding-Token, kein Scroll-Container und
            keine maximale Höhe. Projizierter Inhalt und das Template <code>#content</code> rendern beide hier.
          </li>
          <li>
            <strong>Pfeil</strong> — zwei CSS-Dreiecke, <code>::before</code> (Rahmenfarbe) und
            <code>::after</code> (Hintergrund), bemessen aus <code>--p-popover-gutter</code> und positioniert bei
            <code>calc(arrow-offset + arrow-left)</code>. Derselbe Gutter ist der
            <code>margin-block-start</code> des Panels, also sind Pfeilhöhe und Abstand eine einzige Zahl.
          </li>
          <li>
            <strong>Geklappt</strong> — <code>.p-popover-flipped</code> plus
            <code>data-p-popover-flipped="true"</code>, wenn das Panel über seinem Trigger sitzt: Der Margin wandert
            ans Block-Ende, und beide Dreiecke wechseln an die untere Kante.
          </li>
        </ul>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-popover.mjs</code> (Klassen-Map
          <code>:22-25</code>, Inline-Style <code>:19-21</code>, Template <code>:411-434</code>) und seinem Stylesheet
          <code>&#64;openng/optimus-ui-styles/dist/popover/index.mjs</code>. Auf
          <code>&#64;openng/optimus-ui-themes</code> 2.0.2 (ein Fork von Aura 2.x) ist <code>arrowOffset</code> wieder
          <code>1.25rem</code> — das eine Token, das die Themes 3.0 von PrimeNG auf <code>1.125rem</code> verschoben
          hatten. Der Gutter bleibt <code>10px</code>; jeder andere Wert ist ein Verweis auf
          <code>overlay.popover.*</code>.
        </p>

        <h3>Token-Kette, beide Themes</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Quelle in Aura</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-popover-background</code></td>
                <td>
                  <code>&#123;overlay.popover.background&#125;</code> → <code>&#123;surface.0&#125;</code> /
                  <code>&#123;surface.900&#125;</code>
                </td>
                <td>
                  <code>{{ tokBgLight }}</code>
                </td>
                <td>
                  <code>{{ tokBgDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-color</code></td>
                <td><code>&#123;overlay.popover.color&#125;</code> → <code>&#123;text.color&#125;</code></td>
                <td>
                  <code>{{ tokTextLight }}</code>
                </td>
                <td>
                  <code>{{ tokTextDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-border-color</code></td>
                <td>
                  <code>&#123;overlay.popover.border.color&#125;</code> → <code>&#123;surface.200&#125;</code> /
                  <code>&#123;surface.700&#125;</code>
                </td>
                <td>
                  <code>{{ tokBorderLight }}</code>
                </td>
                <td>
                  <code>{{ tokBorderDark }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-border-radius</code></td>
                <td>
                  <code>&#123;overlay.popover.border.radius&#125;</code> → <code>&#123;border.radius.md&#125;</code>
                </td>
                <td colspan="2">
                  <code>{{ tokRadius }}</code>
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-content-padding</code></td>
                <td><code>&#123;overlay.popover.padding&#125;</code></td>
                <td colspan="2">
                  <code>{{ tokPadding }}</code> — {{ contentPaddingNote }}
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-gutter</code></td>
                <td>Literal im Popover-Preset</td>
                <td colspan="2">
                  <code>{{ tokGutter }}</code> — der Abstand <em>und</em> die Pfeilgröße
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-arrow-offset</code></td>
                <td>Literal im Popover-Preset</td>
                <td colspan="2">
                  <code>{{ tokArrowOffset }}</code> vom Inline-Anfang des Panels
                </td>
              </tr>
              <tr>
                <td><code>--p-popover-arrow-left</code></td>
                <td><strong>kein Preset-Wert</strong> — vom Positionierungscode als Inline-Custom-Property geschrieben</td>
                <td colspan="2">{{ arrowLeftFinding }}</td>
              </tr>
              <tr>
                <td><code>--p-popover-shadow</code></td>
                <td><code>&#123;overlay.popover.shadow&#125;</code>, geteilt mit dem Select-Overlay und Menüs</td>
                <td colspan="2">
                  <code>{{ tokShadow }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Quellen in Aura aus <code>&#64;openng/optimus-ui-themes/dist/aura/popover/index.mjs</code> — acht Werte
          (sieben auf <code>root</code>, einer auf <code>content</code>), sechs davon Verweise und zwei Literale. Die
          Verweise lösen sich in <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> auf, und nicht alle
          an einer Stelle: Radius, Padding und Schatten stehen im obersten Block <code>overlay.popover</code>, während
          Hintergrund, Rahmenfarbe und Textfarbe je Schema unter <code>colorScheme.light</code> / <code>.dark</code>
          liegen. Hintergrund und Text lösen sich in die Aura-Standardpalette für Flächen auf (slate hell, zinc dunkel),
          die weder ein visueller Stil noch ein Akzent überschreibt; der Rahmen stammt vom Kit: Die Regel
          <code>.p-popover</code> in <code>styles.scss</code> setzt <code>--p-popover-border-color</code> auf
          <code>--style-outline</code>. Der Radius folgt dem <code>border.radius.md</code> des visuellen Stils. Es gibt
          <strong>kein Token für Breite oder maximale Breite</strong>: Das Panel wird allein durch seinen Inhalt bemessen.
        </p>

        <h3>Kontrast — gemessen gegen die Flächen, die tatsächlich gemalt werden</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Anforderung</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Panel-Text auf Panel-Hintergrund</td>
                <td>SC 1.4.3, 4,5:1</td>
                <td>
                  <strong>{{ crTextLight }}:1</strong>
                </td>
                <td>
                  <strong>{{ crTextDark }}:1</strong>
                </td>
              </tr>
              <tr>
                <td>Panel-Rahmen gegen das, was hinter dem Panel liegt</td>
                <td>SC 1.4.11, 3:1 für eine Grenze, die Bedeutung trägt</td>
                <td>{{ crBorderLight }}:1</td>
                <td>{{ crBorderDark }}:1</td>
              </tr>
              <tr>
                <td>Panel-Hintergrund gegen das, was dahinter liegt</td>
                <td>keine — aber erst das macht das Panel als Ebene lesbar</td>
                <td>{{ crBgLight }}:1</td>
                <td>{{ crBgDark }}:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ contrastNote }}
        </p>

        <h3>Platzierung, genau so, wie sie berechnet wird</h3>
        <p>
          Ein einziger Aufruf von <code>absolutePosition(container, target, false)</code> beim Öffnen entscheidet alles,
          und es lohnt sich, seine vier Zweige zu kennen, weil es keinen Input gibt, der sie überschreibt:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bedingung</th>
                <th>Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Panel passt unter den Trigger</td>
                <td>
                  Obere Kante an der Unterkante des Triggers, dazu der Gutter als <code>margin-block-start</code>.
                  <code>transform-origin: top</code>.
                </td>
              </tr>
              <tr>
                <td>Unterkante des Triggers + Panel-Höhe überschreitet die Viewport-Höhe</td>
                <td>
                  Nach oben geklappt: obere Kante an der Oberkante des Triggers minus Panel-Höhe,
                  <code>transform-origin: bottom</code>, der Gutter-Margin ans Block-Ende verschoben und der Pfeil an die
                  untere Kante. Am oberen Rand des <em>Viewports</em> begrenzt, falls das negativ würde — der
                  Ersatzwert ist der Scroll-Offset des Fensters, nicht null. {{ flipFinding }}
                </td>
              </tr>
              <tr>
                <td>Panel passt horizontal</td>
                <td>
                  Inline-Anfang bündig mit dem Inline-Anfang des Triggers; der Pfeil sitzt am festen
                  <code>arrow-offset</code>.
                </td>
              </tr>
              <tr>
                <td>Panel würde rechts über den Viewport hinausragen</td>
                <td>
                  Nach links gezogen, bis seine rechte Kante die rechte Kante des Triggers trifft (bei 0 begrenzt), und
                  <code>--p-popover-arrow-left</code> wird auf die Differenz minus den doppelten Rahmenradius gesetzt,
                  damit der Pfeil über dem Trigger bleibt. {{ edgeFinding }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Zweige stammen aus <code>absolutePosition</code> in
          <code>&#64;openng/optimus-ui-utils/dist/dom/index.mjs</code>, die Pfeil-Arithmetik aus <code>align()</code> in
          <code>openng-optimus-ui-popover.mjs:267-283</code>; die zwei Befunde in der Tabelle sind Messungen von
          Computed Style und Geometrie an einem gerenderten Panel. Beachte, was <em>nicht</em> in der Liste steht: keine
          vertikale Zentrierung, keine Platzierung links oder rechts und kein nachträgliches Neuausrichten — das Panel
          schließt sich stattdessen. {{ scrollFinding }}
          {{ resizeFinding }}
        </p>

        <h3>Bewegung</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Ausgeliefert</th>
                <th>Bei <code>reduce</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eintreten (<code>.p-anchored-overlay-enter-active</code>)</td>
                <td>
                  <code>{{ motionEnter }}</code>
                </td>
                <td>
                  <code>{{ motionEnterReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>Verlassen (<code>.p-anchored-overlay-leave-active</code>)</td>
                <td>
                  <code>{{ motionLeave }}</code>
                </td>
                <td>
                  <code>{{ motionLeaveReduced }}</code>
                </td>
              </tr>
              <tr>
                <td>die zwei veralteten Transition-Inputs</td>
                <td colspan="2">Immer noch Inputs, immer noch ungelesen. {{ deadTransitionFinding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>p-anchored-overlay</code> ist der <em>Name</em> der Bewegung — das Präfix der Klassen
          <code>-enter-active</code> / <code>-leave-active</code>. Die Keyframes, auf die er zeigt, sind
          <code>p-animate-anchored-overlay-enter</code> und <code>-leave</code>, einmal definiert in
          <code>&#64;openng/optimus-ui-styles/dist/base/index.mjs</code>: Deckkraft 0 → 1 mit <code>scale(0.93)</code>
          → 1 über 300 ms, geteilt mit jedem verankerten Overlay der Bibliothek. Anders als die meiste Bewegung dieser
          Bibliothek <strong>beachtet</strong> sie das Media-Feature von selbst: <code>&#64;openng/optimus-ui-motion</code>
          setzt seine Option <code>safe</code> standardmäßig auf <code>true</code> und überspringt die Animation, wenn
          <code>prefers-reduced-motion</code> gesetzt ist. {{ reducedStillWorksFinding }} Überschreib die Dauer über
          <code>motionOptions</code>, nie über die veralteten Transition-Inputs.
        </p>

        <h3>Die Größe liegt ganz bei dir</h3>
        <p>
          Es gibt kein Breiten-Token, kein <code>max-height</code> und keinen Scroll-Container. Ein Panel mit einem
          Absatz ist so breit, wie der Absatz sein will; ein Panel mit einer langen Liste wächst, bis es unten aus dem
          Fenster läuft, wo nichts es scrollt, weil die Seite dahinter scrollt — und Scrollen eines scrollbaren
          Vorfahren des Triggers schließt das Panel. Daraus folgen zwei Regeln, und sie sind das ganze Styling eines
          Popovers:
        </p>
        <pre class="code-block"><code>{{ sizingSnippet }}</code></pre>
        <p class="src-note">
          Begrenz die Breite, damit Übersetzungen das Panel nicht quer über den Viewport ziehen, und begrenz die Höhe
          des Inhalts mit einem eigenen Scroll-Container, damit ein langes Panel erreichbar bleibt. Beides ist
          gewöhnliches CSS auf deinem eigenen Inhalts-Wrapper — kein <code>::ng-deep</code> nötig, weil das Padding des
          Panels eine Custom Property ist und alles darin dir gehört. Der Input <code>styleClass</code> erreicht die
          Wurzel, falls du das Panel selbst brauchst.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Kein eingebautes responsives Verhalten. Das Panel behält in jedem Viewport seine Inhaltsbreite und wird
          einmal platziert, beim Öffnen; eine Kollision am rechten Rand richtet es nur an der rechten Kante des
          Triggers aus, es schrumpft nie. Ein Panel, das breiter ist als ein Handy-Bildschirm, läuft deshalb an einer
          Seite hinaus — begrenz den Wrapper mit <code>max-width: min(24rem, calc(100vw - 2rem))</code>. Auf
          Touch-Geräten schließt eine Größenänderung des Fensters (die Bildschirmtastatur geht auf) es nicht
          (<code>openng-optimus-ui-popover.mjs:345-349</code>), also kann es dort stehen bleiben, wo der Trigger vorher
          war.
        </p>

        <h3>Stand bei WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird auch
          nicht beansprucht. <strong>Erfüllt:</strong> SC 1.4.3 für Panel-Text auf dem Panel-Hintergrund, 10,35:1 hell
          und 17,72:1 dunkel (Aura-Standardpalette, aus den Tokens berechnet), und
          SC 2.1.1 fürs Schließen — ein Escape-Listener auf Dokumentebene ohne Schalter, der das Panel schließt, wo
          auch immer der Fokus ist. <strong>Nicht erfüllt:</strong> SC 2.4.3 — der Fokus wird nie zurückgegeben;
          gemessen nach Escape ist das aktive Element der Body, und weil das Panel das letzte Kind des Body ist, führt
          ein Tab vom Trigger aus in die Seite. Der Panel-Rahmen wird nicht gegen SC 1.4.11 gezählt — eine Panel-Kante
          ist weder die Grenze eines Bedienelements noch eine Zustandsanzeige —, schafft aber trotzdem 3:1: das
          <code>--style-outline</code> des Kits, mit 3,97:1 oder mehr gegen die Card geprüft (<code>panel outline</code>
          in <code>docs/generated/CONTRAST.MD</code>). <strong>Bedingt:</strong> SC 4.1.2 — den Namen des Panels und
          <code>aria-expanded</code> und <code>aria-haspopup</code> am Trigger musst du liefern; ohne Namen sagt sich
          das Panel als Dialog mit leerem Namen an, und an einem Button-Host erreichen diese Attribute den inneren
          Button nur über den Pass-through-Input. <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Vor v18 hieß diese Komponente <code>p-overlayPanel</code> / <code>OverlayPanelModule</code>; diesen
          Einstiegspunkt gibt es nicht mehr (in v18 entfernt), also müssen ältere Beispiele und Antworten erst
          übertragen werden, bevor sie kompilieren.
        </p>
        <p>
          Eine Standalone-Komponente, kein Service, kein Trigger, kein Input <code>visible</code>: Du hältst eine
          Template-Referenz und rufst Methoden darauf auf. Der Zustand lebt in der Komponenteninstanz als
          <code>overlayVisible</code>, lesbar, aber nicht bindbar — spiegel ihn aus <code>(onShow)</code> /
          <code>(onHide)</code> in ein Signal, wenn der Trigger ihn braucht, und das tut er.
        </p>

        <h3>Inputs</h3>
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
                <td><code>appendTo</code></td>
                <td><code>'body'</code></td>
                <td>
                  Signal-Input. <strong>Das JSDoc eine Zeile darüber sagt immer noch <code>'self'</code></strong> — der
                  Code ist <code>input('body')</code>. Lass es so: Der Positionierungscode schreibt Koordinaten relativ
                  zum Dokument, also landet ein Panel, das irgendwo mit einem positionierten Offset-Parent angehängt
                  wird, an der falschen Stelle.
                </td>
              </tr>
              <tr>
                <td><code>dismissable</code></td>
                <td><code>true</code></td>
                <td>
                  Ein Klick außerhalb schließt. Der Listener am Dokument wird so oder so gebunden und kehrt früh zurück,
                  wenn das false ist, also spart Ausschalten keinen Listener.
                </td>
              </tr>
              <tr>
                <td><code>focusOnShow</code></td>
                <td><code>true</code></td>
                <td>
                  Fokussiert das <strong>erste Element mit dem Attribut <code>autofocus</code></strong> in
                  Dokumentreihenfolge und sonst nichts — aber lies: {{ autofocusAttrFinding }}
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td><em>nicht gesetzt</em></td>
                <td>Der zugängliche Name des Panels. Eins von beiden ist in der Praxis Pflicht — siehe Barrierefreiheit.</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td><em>nicht gesetzt</em></td>
                <td>Klasse an der Wurzel, zusammengeführt mit den eigenen Klassen der Komponente.</td>
              </tr>
              <tr>
                <td><code>style</code></td>
                <td><em>nicht gesetzt</em></td>
                <td>
                  <code>ngStyle</code> an der Wurzel. Wird <em>nach</em> dem Inline-<code>position: absolute</code>
                  angewendet — schreib hier keine Positionierung hinein.
                </td>
              </tr>
              <tr>
                <td><code>autoZIndex</code> / <code>baseZIndex</code></td>
                <td><code>true</code> / <code>0</code></td>
                <td>
                  Ebenenverwaltung über den gemeinsamen Overlay-Zähler. Lass sie in Ruhe, solange du keinen
                  Stapelkonflikt hast.
                </td>
              </tr>
              <tr>
                <td><code>motionOptions</code></td>
                <td><em>nicht gesetzt</em></td>
                <td>
                  Signal-Input, über das Pass-through-Objekt <code>motion</code> gelegt. Der unterstützte Weg, die
                  Animation zu ändern oder abzuschalten.
                </td>
              </tr>
              <tr>
                <td><code>ariaCloseLabel</code></td>
                <td><em>nicht gesetzt</em></td>
                <td><strong>Tot — auch in Optimus 2.0.2 noch.</strong> {{ deadCloseLabelFinding }}</td>
              </tr>
              <tr>
                <td><code>showTransitionOptions</code> / <code>hideTransitionOptions</code></td>
                <td><code>'.12s …'</code> / <code>'.1s linear'</code></td>
                <td>
                  <strong>Seit v21 veraltet und ungelesen.</strong> Keiner der beiden Werte erreicht das Template; die
                  Animation ist die 300-ms-Animation <code>p-anchored-overlay</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus der ausgelieferten Klasse und ihrer kompilierten Input-Map
          (<code>openng-optimus-ui-popover.mjs:54-126</code> und die Input-Map von ɵcmp (:410), &#64;openng/optimus-ui
          2.0.2). Die drei markierten Zeilen sind der Grund, den Quelltext zu lesen statt der Input-Liste: Ein
          dokumentierter Input, den kein Template verwendet, sieht von außen genauso aus wie ein funktionierender.
        </p>

        <h3>Methoden, Outputs, Templates</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Form</th>
                <th>Hinweise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>toggle(event, target?)</code></td>
                <td>Methode</td>
                <td>
                  Der normale Einstiegspunkt. Mit einem zweiten Argument verankerst du ein Panel an vielen Triggern;
                  hat sich das Ziel geändert, blendet es sich aus und am neuen wieder ein.
                </td>
              </tr>
              <tr>
                <td><code>show(event, target?)</code> / <code>hide()</code></td>
                <td>Methode</td>
                <td>
                  <code>show</code> nimmt den Anker aus dem Argument, sonst aus <code>currentTarget</code>, sonst aus
                  <code>target</code> — übergib das Event.
                </td>
              </tr>
              <tr>
                <td><code>overlayVisible</code></td>
                <td>Property</td>
                <td>
                  Schlichter Boolean, in der Praxis nur lesbar. Er kann den Expanded-Zustand des Triggers speisen, wenn
                  du hinnimmst, in einem Template etwas zu lesen, das kein Signal ist, aber ein Pass-through-Objekt in
                  einem <code>computed()</code> braucht ein Signal, gespiegelt aus <code>(onShow)</code> /
                  <code>(onHide)</code>.
                </td>
              </tr>
              <tr>
                <td><code>(onShow)</code></td>
                <td>sendet <code>null</code></td>
                <td>Feuert aus dem Enter-Hook, nach der Positionierung und nachdem die Listener gebunden sind.</td>
              </tr>
              <tr>
                <td><code>(onHide)</code></td>
                <td>sendet <code>&#123;&#125;</code></td>
                <td>
                  Feuert nach der Leave-Animation, sobald das Panel abgebaut ist. <strong>Stell hier den Fokus
                  wieder her.</strong>
                </td>
              </tr>
              <tr>
                <td><code>#content</code> / <code>pTemplate="content"</code></td>
                <td><code>ng-template</code></td>
                <td>
                  Der Kontext ist <code>&#123; closeCallback &#125;</code> — die einzige Schließmöglichkeit der
                  Komponente. Beide Schreibweisen binden: Der Fork hat die v21-Query <code>PrimeTemplate</code> behalten
                  (<code>:163-171</code>), und das Outlet nimmt <code>contentTemplate || _contentTemplate</code>
                  (<code>:431</code>). Projiziertes <code>&lt;ng-content&gt;</code> und dieses Template rendern beide,
                  also nimm eins von beiden.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Die vier Fokusfragen</h3>
        <p>Dieselben vier, die dieses Kit jedem Overlay stellt. Ein Popover beantwortet eine davon von selbst:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Frage</th>
                <th>Antwort</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Geht der Fokus <strong>hinein</strong>?</td>
                <td>{{ focusInFinding }}</td>
              </tr>
              <tr>
                <td>Bleibt der Fokus <strong>drin</strong>?</td>
                <td>Nein. Es gibt keine Fokusfalle und kein <code>inert</code>. {{ tabOrderFinding }}</td>
              </tr>
              <tr>
                <td>Kommst du mit Escape <strong>hinaus</strong>?</td>
                <td>Ja, und du kannst es nicht abschalten. {{ escapeFinding }}</td>
              </tr>
              <tr>
                <td>Kommt der Fokus <strong>zurück</strong>?</td>
                <td>{{ focusBackFinding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Antworten gelesen aus <code>document.activeElement</code> rund um jeden Übergang und aus dem gerenderten DOM,
          dazu <code>focus()</code> und der Escape-Host-Listener in
          <code>openng-optimus-ui-popover.mjs:322-328</code> und <code>:332-334</code>. Stell es in deinem eigenen
          Build nach, indem du <code>document.activeElement</code> bei <code>focusin</code> protokollierst, während du
          ein Panel öffnest, per Tab durchgehst und schließt.
        </p>
        <p>
          Damit ist das Fokusziel etwas, das du wählen musst, statt es zu erben. Ein Panel mit
          <strong>passivem</strong> Inhalt sollte den Fokus auf dem Trigger lassen — der Nutzer liest es und macht
          weiter —, aber ein <code>p-button</code> irgendwo darin nimmt dir diese Entscheidung ab, also stiehlt ein
          passives Panel mit einem Schließen-Button darin beim Öffnen den Fokus. Ein <strong>interaktives</strong>
          Panel will den Fokus auf seinem ersten Feld, also setzt du <code>pAutoFocus</code> dorthin und lässt die
          Dokumentreihenfolge den Rest erledigen. So oder so entscheiden zwei Zeilen: das gewollte Ziel für
          <code>autofocus</code> und <code>[autofocus]="false"</code> an jedem <code>p-button</code>, der keins sein
          soll (die Direktive entfernt das Attribut genau bei diesem Wert, und nur bei diesem).
        </p>
        <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

        <h3>Schließen hat vier Ursachen, und zwei davon überraschen</h3>
        <ul>
          <li>
            <strong>Klick außerhalb</strong> — ein <code>click</code>-Listener am Dokument (<code>touchstart</code>
            unter iOS). Klicks im Panel, im Trigger oder solche, die der gemeinsame Overlay-Service markiert hat,
            werden ignoriert.
          </li>
          <li>
            <strong>Escape</strong> — ein Host-Listener <code>document:keydown.escape</code>, der <code>hide()</code>
            aufruft. Er ist pro Instanz für die ganze Lebensdauer der Komponente gebunden, nicht nur solange sie offen
            ist, und es gibt keinen Input, der ihn abschaltet.
          </li>
          <li>
            <strong>Scrollen eines Vorfahren</strong> — jeder Vorfahre des <em>Triggers</em>, dessen berechnetes
            Overflow <code>auto</code> oder <code>scroll</code> ist, bekommt einen Scroll-Listener, der das Panel
            ausblendet. Das Dokument selbst ist ausgenommen, also schließt gewöhnliches Scrollen der Seite es nicht.
            {{ scrollFinding }}
          </li>
          <li>
            <strong>Größenänderung des Fensters</strong> — blendet das Panel aus, außer auf Touch-Geräten, wo es die
            Prüfung gibt, weil eine Software-Tastatur ein Resize auslöst. {{ resizeFinding }}
          </li>
        </ul>
        <p class="src-note">
          Gelesen aus <code>bindDocumentClickListener</code> (<code>:168-185</code>), dem Escape-Host-Listener
          (<code>:332-334</code>), <code>bindScrollListener</code> (<code>:360-371</code>) und
          <code>onWindowResize</code> (<code>:341-345</code>); die Befunde zu Scrollen und Größenänderung sind
          Verhaltensmessungen an einem gerenderten Panel.
        </p>

        <h3>Den Trigger verdrahten</h3>
        <pre class="code-block"><code>{{ triggerSnippet }}</code></pre>
        <p>
          Die eine nicht offensichtliche Zeile ist die Pass-through-id. Das Wurzelelement bekommt einen erzeugten
          Attribut-Selektor, aber keine <code>id</code>, also hat <code>aria-controls</code> kein Ziel, bis du eine
          lieferst — und das Pass-through-Objekt ist der unterstützte Weg zu den Attributen der Wurzel. {{ ptIdFinding }}
        </p>

        <h3>SSR</h3>
        <p>
          Sicher, und billiger, als es aussieht. Das Markup des Panels steckt in
          <code>&#64;if (render)</code>, und <code>render</code> wird erst beim ersten <code>show()</code> wahr, also
          gibt ein Server-Render <strong>nichts</strong> aus — kein versteckter Inhalt im HTML, kein Inhalt zum
          Hydrieren und kein Crawler, der Panel-Text für Seitentext hält. Die drei Listener stehen alle hinter Guards
          mit <code>isPlatformBrowser</code>. Zwei Folgen: Inhalt in einem Popover ist für alles unsichtbar, was das
          statische HTML liest (setz nie etwas hinein, das indexiert werden soll), und das erste Öffnen bezahlt das
          Erzeugen des Inhalts, also halt schwere Arbeit aus dem Panel-Inhalt heraus oder lade sie per Lazy Loading
          bei <code>(onShow)</code>.
        </p>

        <h3>Der Abbau wartet auf einen Change-Detection-Durchlauf</h3>
        <p>
          <code>hide()</code> setzt <code>overlayVisible</code> auf false und ruft
          <code>markForCheck</code> auf (<code>:334-337</code>). Der <em>Abbau</em> passiert später, am Ende der
          Leave-Animation: Der Leave-Hook setzt <code>render</code> auf false und sendet <code>(onHide)</code>, markiert
          die View aber <strong>nicht</strong> selbst (<code>:304-321</code>) — er verlässt sich auf die Markierung,
          die das Output-Binding der View liefert, also verschwindet das Element bei dieser
          <code>OnPush</code>-Komponente im folgenden Change-Detection-Durchlauf.
        </p>
        <p>
          Daraus folgen zwei Dinge, und keines ist gefährlich. In einer <strong>Fixture</strong> führt niemand die
          Change Detection für dich aus, also ist „geschlossen“ über das Fehlen von <code>.p-popover</code> zu prüfen
          unzuverlässig — prüf <code>overlayVisible</code> oder das berechnete <code>display</code> des Elements. Und
          der Inhalt eines geschlossenen Panels kann im Dokument noch abfragbar sein, also ist ein Popover kein Ort für
          etwas, das du nicht ohnehin auf die Seite setzen würdest. Ein schwerer Panel-Inhalt behält außerdem seine
          Kosten nach dem ersten Öffnen, statt sie erneut zu bezahlen.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Wie das Panel für einen Screenreader aussieht</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Gerendert</th>
                <th>Knoten im Accessibility Tree</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Panel mit <code>[ariaLabel]</code></td>
                <td>{{ axNamed }}</td>
              </tr>
              <tr>
                <td>Panel ohne Namen</td>
                <td>{{ unnamedFinding }}</td>
              </tr>
              <tr>
                <td>Panel mit <code>[ariaLabelledBy]</code></td>
                <td>{{ labelledByFinding }}</td>
              </tr>
              <tr>
                <td>Trigger, Panel offen</td>
                <td>{{ axTrigger }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ axNote }}
        </p>

        <h4>Die Rolle und das Versprechen, das sie nicht hält</h4>
        <p>
          Die Wurzel ist <code>role="dialog"</code> mit <code>[attr.aria-modal]="overlayVisible"</code>, also sagt sich
          jedes offene Popover als modaler Dialog an. Der modale Vertrag der APG hat vier Klauseln — Fokus hinein,
          Fokus bleibt, Fokus kehrt zurück, alles andere inert —, und diese Komponente setzt <strong>keine</strong>
          davon um: keine Maske, kein <code>inert</code>, kein <code>aria-hidden</code> am Rest der Seite, keine
          Fokusfalle und keine Aufzeichnung des Fokus.
          {{ ariaModalFinding }}
        </p>
        <p>
          Zwei praktische Folgen. Setz nichts in ein Popover, das nicht auf halbem Weg liegen gelassen werden darf —
          ein verirrtes Tab verlässt es lautlos. Und rechne damit, dass die Screenreader-Ansage zu viel verspricht: Ein
          Nutzer, dem „Dialog“ gesagt wird, erwartet zu Recht, dass der Rest der Seite außer Reichweite ist, und das ist
          er nicht. Wo diese Diskrepanz wirklich zählt, nimm <code>p-dialog [modal]="true"</code> oder
          <code>p-confirmpopup</code>, die beide eine echte Falle einrichten.
        </p>

        <h4>Checkliste für die Abnahme</h4>
        <ul class="checklist">
          <li>
            ☐ Der Trigger ist ein echter <code>button</code>, und das Paar <code>aria-expanded</code> /
            <code>aria-haspopup="dialog"</code> sitzt an <em>diesem</em> Element — zurückgelesen aus dem
            Accessibility Tree, nicht aus dem Markup. An einem <code>p-button</code> heißt das: der Weg über
            <code>[pt]</code>.
          </li>
          <li>
            ☐ Das Panel hat einen zugänglichen Namen (<code>[ariaLabel]</code> oder <code>[ariaLabelledBy]</code>), und
            er stimmt mit der sichtbaren Überschrift überein.
          </li>
          <li>
            ☐ Enthält das Panel ein Bedienelement, trägt das erste <code>pAutoFocus</code>; wenn nicht, bleibt der
            Fokus bewusst auf dem Trigger.
          </li>
          <li>
            ☐ <code>(onHide)</code> stellt den Fokus auf dem Trigger wieder her — geprüft für Escape, für einen Klick
            außerhalb und für den eigenen Schließen-Button des Panels.
          </li>
          <li>☐ Nichts im Panel ist destruktiv oder nicht speicherbar, weil jeder Weg zum Schließen lautlos ist.</li>
          <li>☐ Das Panel hat eine Breitenbegrenzung und, falls es wachsen kann, eine scrollende Inhaltsbox.</li>
          <li>
            ☐ Platzierung nahe dem unteren und dem rechten Fensterrand geprüft: Es klappt nach oben und richtet sich
            rechtsbündig aus, und der Pfeil folgt.
          </li>
          <li>
            ☐ Kontrast des Panels gegen die Fläche, über der es schwebt, in beiden Themes gemessen — das Panel ist eine
            Ebene, und der Rahmen ist es, der das sagt.
          </li>
          <li>
            ☐ Kein Inhalt, der indexiert, von einem Crawler übersetzt oder ohne JavaScript vorhanden sein muss, steckt
            im Panel.
          </li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die drei Dinge festnagelt, die zuerst verrotten — die
          Disclosure-Verdrahtung, den Namen des Panels und das Wiederherstellen des Fokus:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Die Bibliothek liefert keine Strings — du lieferst vier</h3>
        <p>
          <code>p-popover</code> liest nichts aus der Übersetzungskonfiguration von Optimus: kein „Schließen“, kein
          „Weitere Informationen“, nichts, was du mit <code>setTranslation</code> überschreiben könntest. Jedes Wort
          rund um ein Popover gehört dir, und es sind mehr, als das Markup vermuten lässt:
        </p>
        <ul>
          <li>
            das <strong>Label des Triggers</strong> — und es muss den Inhalt benennen, nicht die Geste:
            „Sendungsdetails“, nicht „Mehr“;
          </li>
          <li>
            der <strong>zugängliche Name des Panels</strong> (<code>[ariaLabel]</code>), der dieselben Wörter tragen
            sollte wie die sichtbare Überschrift;
          </li>
          <li>der <strong>Inhalt des Panels</strong>, einschließlich der Überschrift;</li>
          <li>
            das <strong>Label jedes Schließen-Buttons, den du selbst renderst</strong> — die Komponente hat keinen, und
            ihr Input <code>ariaCloseLabel</code> ist tot, also gibt es diesen String nur, wenn du den Button
            geschrieben hast.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p>
          Binde alle vier über <code>computed()</code>, damit ein Sprachwechsel sie neu rendert. Ein schlichtes Feld
          wird einmal erfasst und veraltet beim nächsten Wechsel — und ein Popover ist genau der Ort, an dem das
          unbemerkt bleibt, weil ein geschlossenes Panel nicht auf dem Bildschirm steht, wo es falsch aussehen könnte.
        </p>

        <h3>Länge: Das Panel hat keine eigene Breite</h3>
        <p>
          Das ist die Übersetzungsfalle, die zu dieser Komponente gehört. Ohne Breiten-Token und ohne
          <code>max-width</code> wird das Panel durch seinen Inhalt bemessen — ein String, der 30 % länger ist, ergibt
          also ein 30 % breiteres Panel, und ein einziges langes Wort ohne Umbruch ein Panel, das breiter ist als der
          Viewport und das der Platzierungscode dann gegen den rechten Rand quetscht. Ein <code>max-width</code> auf
          deinem Inhalts-Wrapper ist hier kein Feinschliff; es ist der Unterschied zwischen einem Panel und einem
          Balken quer über den Bildschirm. Gib ihm eins, in <code>rem</code> oder <code>ch</code>, und lass den Text
          umbrechen.
        </p>

        <h3>RTL</h3>
        <p>
          Das Stylesheet ist mit logischen Eigenschaften geschrieben — <code>margin-block-start</code> für den Gutter,
          damit das Klappen in beiden Schreibrichtungen funktioniert —, aber der <em>Pfeil</em> wird mit einem
          physischen <code>left</code> platziert, und die horizontale Platzierung wird als Koordinate der linken Kante
          berechnet. {{ rtlFinding }}
        </p>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui-styles/dist/popover/index.mjs</code> (die Pfeil-Regeln nutzen
          <code>left</code> und <code>margin-left</code>) und aus dem Richtungszweig in <code>absolutePosition</code>,
          der dieselbe Zahl der linken Kante in <code>inset-inline-end</code> schreibt, wenn die berechnete Richtung
          des Panels von rechts nach links läuft. Lieferst du eine RTL-Sprache aus, prüf die Position des Panels
          gegenüber seinem Trigger, bevor du der Platzierung traust, und rechne damit, den Pfeil selbst festzusetzen.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Panel-Rahmen ist
            das <code>--style-outline</code> des Kits (vorher Auras Kante mit 1,23:1), geprüft in
            <code>panel outline</code> mit 3,97:1 oder mehr gegen die Card; Token-Tabelle, Kontrasttabelle und
            WCAG-Stand aktualisiert.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft:
            Panel-Farben als Aura-Standardpalette ausgewiesen (kein Stil, kein Akzent und keine Kit-Regel berührt sie),
            Radius je visuellem Stil, die Verhältnisse zur Fläche dahinter gegen das <code>--surface-card</code> jedes
            Stils neu berechnet und als außerhalb des Kontrast-Gates markiert; Rollen-Zitate für Tooltip und
            Confirmpopup auf <code>:479</code> und <code>:502</code> korrigiert; Aussage zum schmalen Bildschirm
            ergänzt.
          </li>
          <li>
            <strong>v0.4</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014). Drei Befunde aus v22
            kippten zurück in ihre v21-Form: <code>overlayVisible</code> und <code>render</code> sind wieder schlichte
            Booleans (keine Signals), <code>showTransitionOptions</code>/<code>hideTransitionOptions</code> sind immer
            noch deklarierte Inputs (veraltet, von nichts gelesen) statt entfernt, <code>pTemplate="content"</code>
            bindet wieder neben <code>#content</code>, und der Widerspruch zwischen JSDoc und Code bei
            <code>appendTo</code> ('self' gegen <code>input('body')</code>) ist zurück — der Fork hat die Korrektur von
            PrimeNG nicht übernommen. Alle Zeilenverweise gegen <code>openng-optimus-ui-popover.mjs</code> 2.0.2 neu
            abgeleitet; auf dem Token-Fork von Aura 2.x ist <code>arrowOffset</code> wieder <code>1.25rem</code>.
            <code>ariaCloseLabel</code> ist immer noch deklariert und wird immer noch von nichts gelesen.
          </li>
          <li>
            <strong>v0.3</strong> — 23.08.2026 — Gegen PrimeNG 22.1 neu geprüft: <code>overlayVisible</code> ist jetzt
            ein Signal (ruf es auf), der Widerspruch zwischen JSDoc und Code bei appendTo ist upstream behoben (überall
            'body'), <code>showTransitionOptions</code>/<code>hideTransitionOptions</code> wurden ganz entfernt
            (Bewegung über <code>motionOptions</code>/<code>pMotion</code>), das Content-Template bindet über
            <code>#content</code> (<code>pTemplate</code> ist in v22 tot), und <code>ariaCloseLabel</code> ist immer
            noch deklariert und wird immer noch von nichts gelesen. Alle Zeilenverweise auf den Quelltext gegen 22.1.2
            neu abgeleitet; die Popover-Tokens von Aura haben sich nur bei <code>arrowOffset</code> geändert.
          </li>
          <li>
            <strong>v0.2</strong> — 20.08.2026 — Zusammenfassung des Stands bei WCAG 2.2 im Design-Tab ergänzt:
            gemessene Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich
            nicht beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erste Fassung des Guides: die Abgrenzung von Popover, Tooltip, Dialog
            und Menü entlang der Achsen Interaktivität und Blockieren, die gemessenen Token- und Kontrastketten in
            beiden Themes, die Mechanik von Platzierung und Schließen einschließlich Klappen und Kollision am Rand, die
            vier Fokusfragen mit ihren gemessenen Antworten, die drei unerreichbaren Inputs und das kanonische
            Agenten-Dokument.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class PopoverArticleDeComponent extends PopoverArticleComponent {
  /** Live description of document.activeElement — the focus read-out, in German. */
  override readonly activeDesc = signal('(noch nichts — klick irgendwohin oder drück Tab)');

  /**
   * A short, readable identifier for whatever currently holds focus.
   * browser-only: reached only from a focusin listener.
   */
  protected override describeActive(): string {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return 'body — nichts fokussiert';
    const tag = el.tagName.toLowerCase();
    const id = el.id ? '#' + el.id : '';
    const label = el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 28) ?? '';
    const inPanel = el.closest('.p-popover') ? '  [im Panel]' : '';
    return tag + id + (label ? ' „' + label + '“' : '') + inPanel;
  }

  override readonly appendToOptions = [
    { label: "'body' (Standard)", value: 'body' },
    { label: "'self' — die Positionierung bricht", value: 'self' },
  ];

  // --- Measured values: the prose around them in German -----------------------
  override readonly tokBorderLight = 'das Kit: --style-outline (Aura #e2e8f0)';
  override readonly tokBorderDark = 'das Kit: --style-outline (Aura #3f3f46)';
  override readonly tokRadius =
    '0 werkbund, 12px lernwerkstatt (Standard), 10px skizzenbuch, 2px blaupause (Aura ab Werk 6px)';

  override readonly crTextLight = '10,35';
  override readonly crTextDark = '17,72';
  override readonly crBorderLight = '4,09–18,73';
  override readonly crBorderDark = '3,97–14,86';
  override readonly crBgLight = '1,00';
  override readonly crBgDark = '1,05–1,35';
  override readonly contrastNote =
    'Die Fläche hinter dem Panel ist das --surface-card des Kits — #ffffff im hellen Modus für alle vier ' +
    'visuellen Stile und im dunklen je Stil; die Spannen laufen über alle vier. Die Zeilen zu Rahmen und ' +
    'Hintergrund sind in docs/generated/CONTRAST.MD geprüft, Gruppe „panel outline“: Die Kit-Regel ' +
    '.p-popover in styles.scss lenkt --p-popover-border-color auf --style-outline um, dieselbe Farbe, die ' +
    'die Stile Cards und Dialogen geben (Auras eigene Kante lag auf Weiß bei 1,23:1), und das Gate misst sie ' +
    'auf der Card und auf dem Grund; das Hintergrund-Paar steht dort nur zur Information. Das Text-Paar ist ' +
    'Auras eigenes ({overlay.popover.color} auf dem Panel), aus den Token-Werten berechnet, und schafft 4,5:1 ' +
    'in beiden Modi mit reichlich Abstand. Der Panel-Hintergrund gleicht weiterhin der Card, über der er ' +
    'schwebt (1,00:1 hell, 1,05:1 im dunklen werkbund), also markiert die Stil-Kontur die Ebene, mit dem ' +
    'Schatten von 10 % als zweitem Hinweis. Das äußere Dreieck des Pfeils nimmt dieselbe Rahmenfarbe an.';
  override readonly contentPaddingNote =
    'eine gewöhnliche Custom Property, und genau so änderst du sie auch. Begrenz jede Überschreibung auf ' +
    'ein Panel; eine nicht gekapselte Regel für .p-popover-content stimmt jedes Popover in der App um';

  override readonly arrowLeftFinding =
    'Gemessen 0px, solange das Panel am Inline-Anfang seines Triggers ausgerichtet ist; an einem Panel, ' +
    'das sich rechtsbündig ausrichten musste, wurde 339.89px geschrieben, was den Pfeil von seinem ' +
    'Ruhe-Offset von 20px auf 359.89px verschob.';
  override readonly flipFinding =
    'Gemessen an einem nach oben geklappten Panel: Klasse und Data-Attribut sind beide gesetzt, ' +
    'margin-block-start wird -10px und margin-block-end 10px, und das Panel sitzt genau ' +
    'einen Gutter über seinem Trigger.';
  override readonly edgeFinding =
    'Gemessen an einem rechtsbündigen Panel: Seine rechte Kante landet auf der rechten Kante des Triggers, ' +
    'und die Pfeil-Variable wird mit der Strecke geschrieben, um die sich das Panel verschoben hat (339.89px ' +
    'am gemessenen Panel), was den Pfeil von seinem Ruhe-Offset von 20px zurück zum Trigger trägt.';
  override readonly scrollFinding =
    'Gemessen: Scrollen eines Vorfahren des Triggers mit overflow:auto blendet das Panel aus, Scrollen ' +
    'der Seite dagegen nicht — dort bleibt es die ganze Zeit einen Gutter unter seinem Trigger.';
  override readonly resizeFinding =
    'Gemessen: Jede Größenänderung des Fensters blendet ein offenes Panel sofort aus, außer auf Touch-Geräten.';
  override readonly ptIdFinding =
    'Gemessen: Die Pass-through-id landet am Wurzelelement, also verweist das aria-controls des Triggers ' +
    'auf einen Knoten, den es gibt.';
  override readonly rtlFinding =
    'Gemessen mit dir="rtl": Die Platzierung wird NICHT gespiegelt. Die LINKE Kante des Panels trifft ' +
    'weiterhin die linke Kante des Triggers, also ragt es am Inline-Ende des Triggers um so viel hinaus, ' +
    'wie das Panel breiter ist als der Trigger, und der Pfeil bleibt physisch bei left 20px — er markiert ' +
    'den Anker nicht mehr.';

  override readonly motionEnter =
    'p-animate-anchored-overlay-enter, 300ms cubic-bezier(.19,1,.22,1): opacity 0 bis 1, scale(0.93) bis 1';
  override readonly motionLeave = 'p-animate-anchored-overlay-leave, 300ms, dieselbe Kurve';
  override readonly motionEnterReduced =
    'nie angewendet — an der Wurzel erscheint überhaupt keine Klasse p-anchored-overlay';
  override readonly motionLeaveReduced = 'nie angewendet';
  override readonly reducedStillWorksFinding =
    'Gemessen unter dem emulierten Media-Feature: Die Enter-Klassen erscheinen an der Wurzel gar nicht ' +
    'erst, das Panel ist ab dem ersten Frame deckend, weiterhin an body angehängt und an seinem Trigger ' +
    'positioniert, und Escape schließt es weiterhin. Der Ausweichpfad ruft die Enter-Hooks synchron auf, ' +
    'also hängt kein Verhalten an der Animation. Emulier das Feature und lies die Klassenliste der Wurzel, ' +
    'um es in deinem eigenen Build zu bestätigen.';
  override readonly deadTransitionFinding =
    'PrimeNG 22 hat sie gestrichen; Optimus behält die v21-Inputs (openng-optimus-ui-popover.mjs:107 ' +
    'und :113, veraltet seit v21.0.0), liest aber keinen davon — das Template bindet stattdessen ' +
    'motionOptions (pMotion), also ändert Setzen nichts.';
  override readonly deadCloseLabelFinding =
    'Deklariert in openng-optimus-ui-popover.mjs:91 und von keinem Template und keiner Methode gelesen. ' +
    'Gemessen am gerenderten Panel: Sein einziges Kind ist .p-popover-content, und es gibt keinen ' +
    'Schließen-Button, den das Label benennen könnte. Render deinen eigenen Schließen-Button und ' +
    'benenne den.';

  override readonly ariaModalFinding =
    'im Accessibility Tree gemessen als Dialog mit modal: true, während die Seite dahinter ' +
    'anklickbar, per Tab erreichbar und scrollbar bleibt';
  override readonly focusSummary =
    'Hinein nur zu einem Element mit dem Attribut autofocus — und das hat jeder p-button. Keine Falle, keine Rückgabe. Escape schließt immer.';
  override readonly focusInFinding =
    'Nur zum ersten Element mit dem Attribut autofocus, in Dokumentreihenfolge. Gemessen: Ein Panel ' +
    'mit einem Input und zwei p-buttons fokussiert den ersten BUTTON; setz pAutoFocus auf den Input, ' +
    'und der Fokus geht stattdessen dorthin; ein Panel aus schlichtem Markup lässt den Fokus auf dem Trigger.';
  override readonly focusBackFinding =
    'Nein. Gemessen nach Escape aus einem Panel, das den Fokus hatte: document.activeElement ist body.';
  override readonly escapeFinding =
    'Gemessen: Escape schließt das Panel, auch wenn der Fokus außerhalb liegt, und sogar mit ausgeschaltetem dismissable.';
  override readonly tabOrderFinding =
    'Gemessen: Mit dem Fokus auf dem Trigger springt ein Tab zum nächsten Bedienelement der SEITE, und das Panel bleibt offen.';
  override readonly axNamed = 'dialog, Name aus ariaLabel, modal: true';
  override readonly axTrigger =
    'button, Name aus dem Label, expanded: true, haspopup: "dialog" — wenn die Attribute über [pt] geleitet werden';
  override readonly unnamedFinding =
    'im Accessibility Tree gemessen, kommt der Knoten als Dialog mit leerem Namen zurück.';
  override readonly labelledByFinding =
    'Dialog, benannt nach dem referenzierten Element. Das großgeschriebene [attr.aria-labelledBy] im ' +
    'ausgelieferten Template landet als kleingeschriebenes Attribut, weil setAttribute Attributnamen ' +
    'in einem HTML-Dokument in Kleinbuchstaben umwandelt.';
  override readonly axNote =
    'Aus dem Accessibility Tree eines gerenderten Panels und seines Triggers gelesen. Zwei Dinge lohnt ' +
    'es sich mitzunehmen. Der Dialog-Knoten ist vorhanden und modal, egal was du sonst konfigurierst, ' +
    'also ist sein Name der einzige Teil dieser Ansage, den du steuerst — und ein unbenanntes Panel wird ' +
    'als anonymer Dialog angesagt. Und der Trigger trägt den Disclosure-Zustand nur, wenn die Attribute ' +
    'das Button-Element erreicht haben: Lies das aus dem Tree statt aus dem Markup, denn das Markup kann ' +
    'richtig aussehen und nichts erreichen.';
  override readonly wrapperAttrFinding =
    'am gerenderten DOM gemessen, sitzen die Bindings am Element p-button, das keine Rolle trägt, ' +
    'während der innere Button, den ein Screenreader ansagt, keines der beiden Attribute hat. ' +
    'Über [pt] geleitet, kommt derselbe Button aus dem Accessibility Tree mit ' +
    'expanded: true und haspopup: "dialog" zurück.';
  override readonly autofocusAttrFinding =
    'in Optimus 2.0.2 schreibt jeder p-button eins: Die Direktive AutoFocus setzt das Attribut, ' +
    'solange ihr Input nicht genau false ist (openng-optimus-ui-autofocus.mjs:23-28), und Button ' +
    'bindet es an autofocus || buttonProps?.autofocus, was standardmäßig undefined ist ' +
    '(openng-optimus-ui-button.mjs:844). Also fokussiert das Panel seinen ersten Button.';
}
