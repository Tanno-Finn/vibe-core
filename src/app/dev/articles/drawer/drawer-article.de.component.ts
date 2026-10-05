import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DrawerArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './drawer-article.component';

/**
 * German twin of the Drawer guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings held in
 * class fields are German. Keep it in step with the English file: same tabs, same
 * element and binding skeleton (`node scripts/check-guide-translations.mjs drawer`).
 */
@Component({
  selector: 'app-drawer-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'drawer'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Drawer ist ein Panel, das an einer Kante des Viewports festgemacht ist. Er existiert für den Fall, den ein
          Dialog schlecht löst: eine Seitenfläche — Navigation, Filter, eine Detailansicht —, die viel Platz braucht,
          während die Seite dahinter genau dort bleibt, wo sie war. Alles unten ist live, auch das Fokus-Instrument, und
          das ist der Teil, den die Bibliothek dir überlässt.
        </p>

        <!-- Playground -->
        <section class="pg" aria-label="Drawer-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-pos-label">position</span>
                <p-select
                  [ariaLabelledBy]="'pg-pos-label'"
                  size="small"
                  [options]="positionOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgPosition()"
                  (ngModelChange)="pgPosition.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-modal">modal <span class="pg__aside">(Maske; steuert die beiden darunter)</span></label>
                <p-toggleswitch inputId="pg-modal" [ngModel]="pgModal()" (ngModelChange)="pgModal.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-dismissible">dismissible <span class="pg__aside">(Klick auf die Maske)</span></label>
                <p-toggleswitch
                  inputId="pg-dismissible"
                  [ngModel]="pgDismissible()"
                  (ngModelChange)="pgDismissible.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-escape">closeOnEscape</label>
                <p-toggleswitch inputId="pg-escape" [ngModel]="pgEscape()" (ngModelChange)="pgEscape.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-closable">closable <span class="pg__aside">(der Header-Button)</span></label>
                <p-toggleswitch
                  inputId="pg-closable"
                  [ngModel]="pgClosable()"
                  (ngModelChange)="pgClosable.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-blockscroll">blockScroll</label>
                <p-toggleswitch
                  inputId="pg-blockscroll"
                  [ngModel]="pgBlockScroll()"
                  (ngModelChange)="pgBlockScroll.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-sem-label">Semantik über <code>pt</code></span>
                <p-select
                  [ariaLabelledBy]="'pg-sem-label'"
                  size="small"
                  [options]="semanticsOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSemantics()"
                  (ngModelChange)="pgSemantics.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <p-button [label]="'Drawer öffnen'" size="small" (onClick)="openPlayground()" />
                <p class="pg__hint">{{ pgHint() }}</p>
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

          <p-drawer
            [visible]="pgVisible()"
            (visibleChange)="pgVisible.set($event)"
            [position]="pgPosition()"
            [header]="'Playground-Drawer'"
            [modal]="pgModal()"
            [dismissible]="pgDismissible()"
            [closeOnEscape]="pgEscape()"
            [closable]="pgClosable()"
            [blockScroll]="pgBlockScroll()"
            [ariaCloseLabel]="'Playground-Drawer schließen'"
            [pt]="pgPt()"
            appendTo="body"
            [style]="pgSize()"
            (onHide)="onPlaygroundHide()"
          >
            <p>
              Was du eingeschaltet hast, gilt hier. Ist <code>closable</code> aus, gibt es keinen Header-Button, also
              bleiben als Ausweg nur Escape und — falls eingeschaltet — die Maske.
            </p>
            <p-button [label]="'Schließen'" size="small" severity="secondary" (onClick)="pgVisible.set(false)" />
          </p-drawer>
        </section>

        <!-- Focus instrument -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Was der Fokus tut, wenn ein Drawer auf- und zugeht</h3>
          </div>
          <p class="ex__note">
            Öffne jeden <strong>mit der Tastatur</strong> (Tab bis zum Button, dann Enter) und lies das Protokoll. Der
            linke ist die Bibliothek im Auslieferungszustand: Der Fokus bleibt auf dem Auslöser, außerhalb des Panels,
            das gerade erschienen ist, und die nächsten Tab-Drücke wandern über die Seite hinter der Maske, statt in den
            Drawer zu gehen. Die Fokusfalle greift erst, wenn der Fokus <em>drinnen</em> ist; ihn dorthin zu bringen und
            danach zurückzugeben, das sind die zwei Zeilen rechts.
          </p>
          <div class="ex__stage">
            <div class="fj">
              <div class="fj__col">
                <span class="row__tag">Bibliotheks-Standard</span>
                <p-button [label]="'Unverdrahtet öffnen'" size="small" severity="secondary" (onClick)="openFocusDemo(false)" />
                <ul class="fj__journal">
                  <li><strong>vor dem Öffnen:</strong> {{ fjBare().before }}</li>
                  <li><strong>nach dem Öffnen:</strong> {{ fjBare().opened }}</li>
                  <li><strong>nach dem Schließen:</strong> {{ fjBare().closed }}</li>
                </ul>
              </div>
              <div class="fj__col">
                <span class="row__tag">Fokus hineingesetzt, Fokus zurückgegeben</span>
                <p-button [label]="'Verdrahtet öffnen'" size="small" (onClick)="openFocusDemo(true)" />
                <ul class="fj__journal">
                  <li><strong>vor dem Öffnen:</strong> {{ fjWired().before }}</li>
                  <li><strong>nach dem Öffnen:</strong> {{ fjWired().opened }}</li>
                  <li><strong>nach dem Schließen:</strong> {{ fjWired().closed }}</li>
                </ul>
              </div>
            </div>
          </div>
          <p class="src-note">
            Prüf es in deinem eigenen Build ohne diese Seite nach: Öffne einen Drawer und lies
            <code>document.activeElement</code> in der Konsole, dann schließ ihn und lies noch einmal. Beide Werte müssen
            den Auslöser nennen.
          </p>
          <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

          <p-drawer
            [visible]="fjVisibleBare()"
            (visibleChange)="fjVisibleBare.set($event)"
            position="right"
            [header]="'Unverdrahteter Drawer'"
            appendTo="body"
            [ariaCloseLabel]="'Schließen'"
            [style]="{ width: 'min(26rem, 100vw)' }"
            (onHide)="afterFocusDemo(false)"
          >
            <p>Nichts hier hat den Fokus bekommen, als das Panel aufging.</p>
            <p-button [label]="'Ein Bedienelement'" size="small" severity="secondary" />
          </p-drawer>

          <p-drawer
            [visible]="fjVisibleWired()"
            (visibleChange)="fjVisibleWired.set($event)"
            position="right"
            [header]="'Verdrahteter Drawer'"
            appendTo="body"
            [ariaCloseLabel]="'Schließen'"
            [style]="{ width: 'min(26rem, 100vw)' }"
            (onShow)="focusFirstControl()"
            (onHide)="afterFocusDemo(true)"
          >
            <p>Das erste Bedienelement bekam den Fokus bei <code>(onShow)</code>.</p>
            <p-button [label]="'Ein Bedienelement'" size="small" severity="secondary" styleClass="fj-first" />
          </p-drawer>
        </section>

        <!-- Navigation drawer -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Navigation, auf der Seite, von der sie kam</h3>
            <button type="button" class="copy-btn" (click)="copy('nav', navSnippet)">
              {{ copiedId() === 'nav' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Der klassische Einsatz: ein Menü, das auf kleinen Viewports außerhalb des Bildschirms liegt. Es ist links
            verankert, weil sein Auslöser an dieser Kante sitzt, und die Liste ist ein echtes
            <code>&lt;nav&gt;</code> mit eigenem Namen — die Landmark des Panels selbst bleibt namenlos, bis du ihr einen
            gibst.
          </p>
          <div class="ex__stage">
            <p-button [label]="'Menü öffnen'" icon="pi pi-bars" size="small" (onClick)="navVisible.set(true)" />
          </div>
          <pre class="code-block"><code>{{ navSnippet }}</code></pre>

          <p-drawer
            [visible]="navVisible()"
            (visibleChange)="navVisible.set($event)"
            position="left"
            [header]="'Menü'"
            appendTo="body"
            [ariaCloseLabel]="'Menü schließen'"
          >
            <nav aria-label="Abschnitte des Guides" class="navdemo">
              <ul>
                <li><a href="#" (click)="$event.preventDefault()">Überblick</a></li>
                <li><a href="#" (click)="$event.preventDefault()">Komponenten</a></li>
                <li><a href="#" (click)="$event.preventDefault()">Grundlagen</a></li>
                <li><a href="#" (click)="$event.preventDefault()">Änderungsprotokoll</a></li>
              </ul>
            </nav>
          </p-drawer>
        </section>

        <!-- Detail drawer with a footer -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Ein Detail-Panel mit festem Footer</h3>
            <button type="button" class="copy-btn" (click)="copy('detail', detailSnippet)">
              {{ copiedId() === 'detail' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Die rechte Kante ist die Konvention für „mehr über das, was ich gerade angeklickt habe“, und sie ist die eine
            Position, an der ein Überschreiben der Breite Pflicht ist: Die ausgelieferten 20rem sind eine Menübreite,
            keine Lesebreite. Der Footer ist ein projiziertes Template, also sitzt er außerhalb des scrollenden Inhalts,
            und seine Buttons bleiben erreichbar.
          </p>
          <div class="ex__stage">
            <p-button [label]="'Details zeigen'" size="small" (onClick)="detailVisible.set(true)" />
          </div>
          <pre class="code-block"><code>{{ detailSnippet }}</code></pre>

          <p-drawer
            [visible]="detailVisible()"
            (visibleChange)="detailVisible.set($event)"
            position="right"
            [header]="'Haussperling'"
            appendTo="body"
            [ariaCloseLabel]="'Details schließen'"
            [style]="{ width: 'min(34rem, 100vw)' }"
          >
            <p>
              Langer Inhalt scrollt in <code>.p-drawer-content</code>, dem Flex-Kind mit
              <code>overflow-y: auto</code>. Header und Footer scrollen nicht mit.
            </p>
            <p>
              Wiederhol diesen Gedanken ein paarmal, und du hast ein realistisches Panel. Es geht darum, dass die beiden
              Rahmenzeilen stehen bleiben, während dieser Absatz sich bewegt.
            </p>
            <p>
              Wiederhol diesen Gedanken ein paarmal, und du hast ein realistisches Panel. Es geht darum, dass die beiden
              Rahmenzeilen stehen bleiben, während dieser Absatz sich bewegt.
            </p>
            <p>
              Wiederhol diesen Gedanken ein paarmal, und du hast ein realistisches Panel. Es geht darum, dass die beiden
              Rahmenzeilen stehen bleiben, während dieser Absatz sich bewegt.
            </p>
            <ng-template #footer>
              <div class="drawer-footer">
                <p-button
                  [label]="'Abbrechen'"
                  size="small"
                  severity="secondary"
                  [text]="true"
                  (onClick)="detailVisible.set(false)"
                />
                <p-button [label]="'Speichern'" size="small" (onClick)="detailVisible.set(false)" />
              </div>
            </ng-template>
          </p-drawer>
        </section>

        <!-- Bottom sheet -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Untere Kante: das Sheet, und die Höhe, die du setzen musst</h3>
            <button type="button" class="copy-btn" (click)="copy('sheet', sheetSnippet)">
              {{ copiedId() === 'sheet' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            <code>position="bottom"</code> kommt mit fest 10rem Höhe, was für eine Bestätigungszeile reicht und für
            sonst nichts. Alles Echte braucht eine explizite Höhe — und eine Obergrenze, damit eine lange Liste nicht zu
            einem Vollbild-Panel wird, das nur aussieht wie ein Sheet.
          </p>
          <div class="ex__stage">
            <p-button
              [label]="'Filter öffnen'"
              icon="pi pi-filter"
              size="small"
              severity="secondary"
              (onClick)="sheetVisible.set(true)"
            />
          </div>
          <pre class="code-block"><code>{{ sheetSnippet }}</code></pre>

          <p-drawer
            [visible]="sheetVisible()"
            (visibleChange)="sheetVisible.set($event)"
            position="bottom"
            [header]="'Filter'"
            appendTo="body"
            [ariaCloseLabel]="'Filter schließen'"
            [style]="{ height: 'min(22rem, 80vh)' }"
          >
            <p>Höhe explizit gesetzt; der Standard hätte diesen Absatz abgeschnitten.</p>
            <p-button [label]="'Anwenden'" size="small" (onClick)="sheetVisible.set(false)" />
          </p-drawer>
        </section>

        <!-- Headless -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Headless: dein Rahmen, und dann gehört dir auch die Benennung</h3>
            <button type="button" class="copy-btn" (click)="copy('headless', headlessSnippet)">
              {{ copiedId() === 'headless' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Das <code>headless</code>-Template ersetzt alles im Panel: keine Header-Zeile, kein Schließen-Button, kein
            Content-Wrapper — und damit kein Padding und kein Scroll-Container. Es ist die richtige Wahl, wenn der Rahmen
            des Panels Teil deines Designs ist, und die falsche, wenn du nur den Header umgestalten wolltest.
          </p>
          <div class="ex__stage">
            <p-button
              [label]="'Headless öffnen'"
              size="small"
              severity="secondary"
              (onClick)="headlessVisible.set(true)"
            />
          </div>
          <pre class="code-block"><code>{{ headlessSnippet }}</code></pre>

          <p-drawer
            [visible]="headlessVisible()"
            (visibleChange)="headlessVisible.set($event)"
            position="right"
            appendTo="body"
            [style]="{ width: 'min(24rem, 100vw)' }"
          >
            <ng-template #headless>
              <div class="headless">
                <div class="headless__bar">
                  <h2 class="headless__title">Eigener Rahmen</h2>
                  <p-button
                    icon="pi pi-times"
                    size="small"
                    [rounded]="true"
                    [text]="true"
                    severity="secondary"
                    [ariaLabel]="'Schließen'"
                    (onClick)="headlessVisible.set(false)"
                  />
                </div>
                <div class="headless__body">
                  <p>
                    Alles hier drin — auch das Padding und die Tatsache, dass dieser Bereich scrollt — ist Markup, das
                    du geschrieben hast.
                  </p>
                </div>
              </div>
            </ng-template>
          </p-drawer>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Ist ein Drawer überhaupt der richtige Container?</h3>
        <p>
          Ein Drawer beantwortet eine Frage gut:
          <em>Wohin mit einer großen Seitenfläche, wenn die Seite dahinter stehen bleiben muss?</em> Ist das nicht die
          Frage, passt einer seiner Nachbarn besser. Die Tabelle ist danach sortiert, wie oft jeder davon die echte
          Antwort ist.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Container</th>
                <th>Er ist die Antwort, wenn …</th>
                <th>Was er für einen Screenreader ist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>eine Inline-<code>&lt;section&gt;</code></td>
                <td>der Inhalt Teil der Seite ist und Platz hat. Immer die erste Antwort.</td>
                <td>was immer du schreibst</td>
              </tr>
              <tr>
                <td>eine Route</td>
                <td>er verlinkbar, neu ladbar, per Zurück-Button erreichbar oder lang genug für eine Seite ist.</td>
                <td>eine Seite</td>
              </tr>
              <tr>
                <td><code>p-drawer</code></td>
                <td>
                  eine breite Seitenfläche — Navigation, Filter, eine Detailansicht — an einer Kante verankert ist und
                  die Seite dahinter sichtbar bleibt.
                </td>
                <td>eine <code>complementary</code>-Landmark, namenlos, bis du sie benennst</td>
              </tr>
              <tr>
                <td><code>p-dialog</code></td>
                <td>
                  eine in sich geschlossene Teilaufgabe blockieren muss, bis sie erledigt ist, mittig auf der Seite.
                  Siehe den Dialog-Guide.
                </td>
                <td><code>dialog</code>, mit einem festen <code>aria-modal="true"</code></td>
              </tr>
              <tr>
                <td><code>p-popover</code></td>
                <td>
                  ein kleines, flüchtiges Panel <em>an seinem Auslöser</em> verankert ist — ein Menü, ein Filterpaar,
                  eine Definition. Siehe den Popover-Guide.
                </td>
                <td><code>dialog</code>, <code>aria-modal</code>, solange offen</td>
              </tr>
              <tr>
                <td><code>p-confirmdialog</code></td>
                <td>„Bist du sicher?“ gefragt wird und sonst nichts.</td>
                <td><code>alertdialog</code></td>
              </tr>
              <tr>
                <td><code>p-menubar</code> oder ein <code>&lt;nav&gt;</code> im Layout</td>
                <td>
                  es um die Hauptnavigation geht. Ein Drawer ist der Ort, an dem sich diese Navigation auf einem
                  schmalen Viewport <em>versteckt</em>, nicht der, an dem sie wohnt.
                </td>
                <td>ein Menü-Widget / eine <code>navigation</code>-Landmark</td>
              </tr>
              <tr>
                <td><code>p-tabs</code> oder ein Accordion</td>
                <td>du zum Drawer gegriffen hast, um parallele Ansichten desselben Themas unterzubringen.</td>
                <td>Tablist / Disclosure-Buttons</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Identitäten in der letzten Spalte sind aus dem ausgelieferten Template jeder Komponente in Optimus UI 2.0.2
          gelesen — <code>role="complementary"</code> für den Drawer (<code>openng-optimus-ui-drawer.mjs:581</code>),
          <code>role="dialog"</code> plus <code>[attr.aria-modal]</code> für das Popover
          (<code>openng-optimus-ui-popover.mjs:418-419</code>). Sie zählen für die Wahl, denn zwei Container, die auf dem
          Bildschirm gleich aussehen, können für einen Screenreader eine Landmark und ein Modal sein.
        </p>

        <h3>Die Grenze zwischen Drawer und Dialog, in je einem Satz</h3>
        <ul>
          <li>
            <strong>Drawer</strong> — die Seite behält ihren Kontext, und du brauchst Breite oder Höhe: Filter neben den
            Ergebnissen, ein Datensatz neben seiner Liste, Navigation auf dem Handy.
          </li>
          <li>
            <strong>Dialog</strong> — die Seite muss warten, und die Aufgabe ist klein genug, um mittig zu stehen:
            umbenennen, bestätigen, ein kurzes Formular. Sein <code>aria-modal="true"</code> ist fest eingetragen, was der
            Dialog-Guide als eigenen Mangel behandelt; was er dafür mitbringt, ist das Hineinsetzen des Fokus, für das der
            Drawer kein Gegenstück hat.
          </li>
          <li>
            <strong>Beide fühlen sich standardmäßig modal an</strong> (Maske an, Escape an, Klick nach außen an), und
            deshalb muss die Wahl am Inhalt getroffen werden, nicht am Verhalten. Das Verhalten ist bei beiden
            einstellbar; die Form und die Lesereihenfolge sind es nicht.
          </li>
        </ul>

        <h3>Welche Kante?</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th><code>position</code></th>
                <th>Ausgelieferte Größe</th>
                <th>Nimm sie für</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>left</code> (Standard)</td>
                <td>20rem breit, volle Höhe</td>
                <td>
                  Navigation und alles, dessen Auslöser in einer linken Leiste sitzt. Die Kante sollte zum Auslöser
                  passen.
                </td>
              </tr>
              <tr>
                <td><code>right</code></td>
                <td>20rem breit, volle Höhe</td>
                <td>Detail- und Inspector-Panels — das Angeklickte bleibt links. Mach es breiter.</td>
              </tr>
              <tr>
                <td><code>top</code></td>
                <td>10rem hoch, volle Breite</td>
                <td>Suche und globale Hinweise. Selten: Es verdeckt den Header, den der Nutzer gerade benutzt hat.</td>
              </tr>
              <tr>
                <td><code>bottom</code></td>
                <td>10rem hoch, volle Breite</td>
                <td>das mobile Sheet — Filter, Sortierung, eine Teilen-Zeile. Setz eine Höhe.</td>
              </tr>
              <tr>
                <td><code>full</code></td>
                <td>der ganze Viewport</td>
                <td>eine mobile Übernahme des Bildschirms. In dieser Größe frag dich, ob es eine Route hätte sein sollen.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Größen sind die ausgelieferten Standardwerte der Positionsklassen; der Tab Design hat sie als gemessene
          Pixel zusammen mit dem Token, aus dem sie kommen. Es gibt zwei Wege zu einem Vollbild-Panel —
          <code>position="full"</code> und <code>[fullScreen]="true"</code> —, und sie sind nicht dasselbe; den
          Unterschied hat der Tab Entwicklung.
        </p>

        <h3>Hausstil</h3>
        <ul>
          <li>
            <strong>Setz eine Breite; liefere für Inhalt nie die Standard-20rem aus.</strong> Die Konvention ist eine
            Viewport-relative Breite mit Obergrenze: <code>[style]="&#123; width: 'min(34rem, 100vw)' &#125;"</code>.
            Der eigene Detail-Drawer dieses Kits — das Eintrags-Panel der Katalogseite in
            <code>catalog.component.ts</code> — ist die Referenzimplementierung dieses Musters.
          </li>
          <li>
            <strong><code>appendTo="body"</code>.</strong> Der Standard ist <code>'self'</code>, und der lässt ein
            <code>position: fixed</code>-Panel in deinem Komponentenbaum, wo jeder Vorfahr mit
            <code>transform</code>, <code>filter</code> oder <code>contain</code> ihm einen neuen Bezugsrahmen gibt. Die
            Maske wird so oder so an <code>&lt;body&gt;</code> angehängt, also leben mit dem Standard die beiden Hälften
            des Overlays in verschiedenen Stacking-Kontexten.
          </li>
          <li>
            <strong>Benenne das Panel.</strong> Eine <code>complementary</code>-Landmark ohne zugänglichen Namen wird als
            „complementary“ angesagt und sonst nichts. Benenne entweder die Landmark über <code>pt</code>, oder setz eine
            benannte Region ins Panel — ein <code>&lt;nav aria-label&gt;</code>, eine Überschrift — und behandle den
            Drawer als Hülle.
          </li>
          <li>
            <strong>Setz <code>ariaCloseLabel</code>, sobald der Header-Button gerendert wird.</strong> Es hat keinen
            Standardwert und keinen Fallback.
          </li>
          <li>
            <strong>Verdrahte Fokus hinein und Fokus zurück.</strong> Bei einem modalen Drawer nicht verhandelbar, bei
            einem nicht modalen gutes Benehmen. Details und Code in Entwicklung.
          </li>
          <li>
            <strong>Ein Drawer zur Zeit.</strong> Zwei offene Drawer schichten sich korrekt, aber sie schließen nicht
            unabhängig voneinander: Ein Escape schließt <em>beide</em>, weil die Bedingung, die der Document-Listener
            prüft, für jeden offenen Drawer erfüllt ist. Ein Panel über einem Panel hat auch keinen Weg zurück. Bleib bei
            einem.
          </li>
        </ul>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Ein modaler Drawer mit <code>[closable]="false"</code>, ohne Fokus-Verdrahtung und ohne sichtbares
              Schließen-Element, in der Annahme, die Maske genüge. Auf einem Touch-Gerät ist die Maske ein schmaler
              Streifen; mit der Tastatur ist der Fokus gar nicht erst ins Panel gelangt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Lass den Header-Button an, gib ihm <code>ariaCloseLabel</code> und setz für den Hauptausweg einen echten
              Button in den Footer. Escape und die Maske sind Abkürzungen, nicht die Oberfläche.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Ein Drawer mit einem Formular, dessen Absende-Button am Ende des scrollenden Inhalts steht. Auf einem
              niedrigen Viewport liegt die Aktion unterhalb des sichtbaren Bereichs eines Panels, das schon ein
              Scroll-Container in einem Scroll-Container ist.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Projizier die Aktionen als <code>footer</code>-Template. Es ist ein Geschwister des Inhalts, kein Teil
              davon, und bleibt deshalb sichtbar, während der Inhalt scrollt.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              Ein Drawer für einen Datensatz, den die Leute verlinken, neu laden oder mit dem Zurück-Button erreichen
              wollen. Er hat keine URL, und Escape verwirft ihn spurlos.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Mach daraus eine Route und behalte den Drawer für die flüchtigen Seitenflächen drumherum. Brauchst du
              beides, steuere <code>visible</code> über einen Query-Parameter.
            </p>
          </div>
        </div>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <p class="dd__why">
              <code>[modal]="false"</code> mit <code>[dismissible]="true"</code> und <code>[blockScroll]="true"</code>,
              in der Erwartung eines leichten Panels, das trotzdem bei einem Klick nach außen schließt und die Seite
              festhält.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <p class="dd__why">
              Entscheide zuerst: modal (Maske, dismissible, Scroll-Sperre alle verfügbar) oder nicht modal (nichts
              davon — die Behandlung des Klicks nach außen gehört dir). Beide Flags leben im
              <code>modal</code>-Zweig.
            </p>
          </div>
        </div>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Modal Dialog pattern</a
            >
            — die vier Klauseln, die eine modale Fläche dem Nutzer schuldet: eine Dialog-Rolle, ein zugänglicher Name,
            Fokus hineingesetzt, Fokus zurückgegeben. Ein modaler Drawer wird genau daran gemessen, und der Tab
            Entwicklung misst, welche Klauseln die Komponente einhält.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#complementary" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>complementary</code> role</a
            >
            — normativ: was die Rolle bedeutet, die der Drawer tatsächlich ausliefert (ein ergänzender Abschnitt der
            Seite), und dass eine Landmark erst nützt, wenn sie einen Namen hat.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-modal" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, <code>aria-modal</code></a
            >
            — warum das Attribut ein Versprechen ist, dass der Rest der Seite inert ist, und warum es deshalb kein
            Gratis-Upgrade ist, es einem Drawer von Hand hinzuzufügen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — das Kriterium, an dem die fehlende Fokus-Rückgabe scheitert, in beide Richtungen: ins Panel hinein und aus
            ihm heraus.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.1.2 No Keyboard Trap</a
            >
            — der Grund, warum <code>[closeOnEscape]="false"</code> plus aktive Fokusfalle einen zweiten, sichtbaren
            Ausweg braucht.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — <code>prefers-reduced-motion</code></a
            >
            — das Media-Feature hinter dem überraschendsten Fehlerbild des Drawers: Wie du das 0.5s-Gleiten unterdrückst,
            entscheidet, ob die Maske je entfernt wird.
          </li>
          <li>
            <a href="https://primeng.org/drawer" target="_blank" rel="noopener noreferrer"> PrimeNG 21 — Drawer</a>
            — die Hersteller-API, die Optimus forkt. Hier gegen den ausgelieferten Quelltext von Optimus UI 2.0.2
            geprüft, und dort zeigen sich die beiden veralteten Inputs und der eine, der nichts mehr tut.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <ul>
          <li>
            <strong>Maske</strong> — ein nacktes <code>&lt;div class="p-drawer-mask p-overlay-mask"&gt;</code>, imperativ
            erzeugt und an <code>&lt;body&gt;</code> angehängt, <em>nicht</em> ein Elternelement des Panels. Fixiert,
            ganzer Viewport, <code>z-index</code> eins unter dem des Panels.
          </li>
          <li>
            <strong>Panel</strong> — <code>.p-drawer.p-component.p-drawer-&lt;position&gt;</code>:
            <code>position: fixed</code>, <code>display: flex</code>, Spaltenrichtung, Hintergrund, Rahmen und Schatten
            aus Token, und <strong>kein border-radius</strong> — Aura gibt dem Drawer kein Radius-Token, also sind die
            Ecken absichtlich eckig. Die visuellen Stile des Kits fügen eine eigene Regel hinzu: Jeder
            <code>html.style-&lt;name&gt;</code>-Block in <code>styles.scss</code> umrandet die Kante, die zur Seite
            zeigt, in <code>--style-outline</code> (1–3px je nach Stil), pro Position mit logischen Seiten — das
            Inline-Ende eines <code>left</code>-Drawers, der Inline-Anfang eines <code>right</code>-Drawers, Block-Ende
            bzw. -Anfang bei <code>top</code> / <code>bottom</code>.
          </li>
          <li>
            <strong>Header</strong> — <code>.p-drawer-header</code>, eine Flex-Zeile mit <code>space-between</code> und
            <code>flex-shrink: 0</code>, die das optionale Header-Template, das <code>.p-drawer-title</code>-Div und den
            Schließen-Button hält.
          </li>
          <li>
            <strong>Titel</strong> — <code>.p-drawer-title</code> ist ein <code>&lt;div&gt;</code>, keine Überschrift.
            Es trägt die Titel-Font-Token und keine Dokumentstruktur.
          </li>
          <li>
            <strong>Inhalt</strong> — <code>.p-drawer-content</code>: <code>flex-grow: 1</code> und
            <code>overflow-y: auto</code>. Das ist der Scroll-Container und der Grund, warum Aktionen in den Footer
            gehören.
          </li>
          <li>
            <strong>Footer</strong> — <code>.p-drawer-footer</code>, nur gerendert, wenn ein Footer-Template projiziert
            wird.
          </li>
          <li>
            Abschnitte tragen <code>data-pc-section</code> (<code>header</code>, <code>content</code>, <code>footer</code>,
            <code>closeicon</code>) — die stabilen Haken für Tests und für <code>pt</code>.
          </li>
        </ul>

        <h3>Token-Kette</h3>
        <p>
          Jedes Flächen-Token des Drawers ist ein Alias der gemeinsamen <code>overlay.modal.*</code>-Gruppe, also sind
          Drawer und Dialog per Konstruktion dasselbe Material. Preset-Werte aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/drawer/index.mjs</code> und der <code>overlay.modal</code>-Gruppe in
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>; die letzten beiden Spalten sind berechneter
          Stil am gerenderten Panel.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>CSS-Variable</th>
                <th>Aura-Alias</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              @for (row of tokenRows; track row.varName) {
                <tr>
                  <td>
                    <code>{{ row.varName }}</code>
                  </td>
                  <td>{{ row.alias }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ tokenNote }}</p>

        <h3>Kontrast</h3>
        <p>
          Gemessen gegen den selbst gemalten Hintergrund des Panels, nicht gegen die Seite dahinter — der Drawer ist eine
          deckende Fläche, also spielt, was hinter der Maske liegt, nie mit.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Hell</th>
                <th>Dunkel</th>
                <th>Untergrenze</th>
              </tr>
            </thead>
            <tbody>
              @for (row of contrastRows; track row.pair) {
                <tr>
                  <td>{{ row.pair }}</td>
                  <td>{{ row.light }}</td>
                  <td>{{ row.dark }}</td>
                  <td>{{ row.floor }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ contrastNote }}</p>

        <h3>Geometrie</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was</th>
                <th>Wert</th>
                <th>Woher es kommt</th>
              </tr>
            </thead>
            <tbody>
              @for (row of geometryRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.value }}</td>
                  <td>{{ row.origin }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ geometryNote }}</p>

        <h3>Der Fokus-Ring</h3>
        <p>{{ focusRingNote }}</p>

        <h3>Bewegung, und die eine Stelle, an der sie nicht kosmetisch ist</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Animation</th>
                <th>Standard</th>
                <th>Unter <code>reduce</code></th>
              </tr>
            </thead>
            <tbody>
              @for (row of motionRows; track row.what) {
                <tr>
                  <td>{{ row.what }}</td>
                  <td>{{ row.normal }}</td>
                  <td>{{ row.reduced }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Das Gleiten des Panels ist Dekoration. <strong>Das Ausblenden der Maske trägt Last:</strong> Die Komponente
          entfernt die Maske in einem <code>animationend</code>-Handler aus dem DOM, ohne Timeout dahinter. Schalte diese
          Animation ab, und der Handler feuert nie. Gemessen mit <code>animation: none</code> auf der Leave-Klasse: Nach
          dem Schließen des Drawers bleibt die Maske in <code>&lt;body&gt;</code>, über den ganzen Viewport,
          <code>pointer-events: auto</code>, und <code>elementFromPoint</code> liefert sie in der Bildschirmmitte immer
          noch zurück — Klicks landen auf ihr, nicht auf der Seite. Das ist eine Seite, die niemand mehr benutzen kann.
          Das Panel selbst ist sicher: Sein Leave läuft über <code>&#64;openng/optimus-ui-motion</code>, das sofort
          auflöst, wenn es keine registrierte Animation findet, und obendrein einen Timeout scharf schaltet.
        </p>
        <p>
          Die Einstellung richtig zu respektieren ist in Ordnung und besser als der Standard: Unter
          <code>reduce</code> überspringt die Motion-Schicht den Übergang des Panels ganz — keine
          <code>p-drawer-enter-*</code>-Klasse wird je gesetzt —, die globale Regel des Kits verkürzt das Ausblenden der
          Maske auf 0.01 ms, beide Animationen enden trotzdem, und das Panel wird ganz aus dem DOM entfernt, statt bei
          <code>display: none</code> geparkt zu werden.
        </p>
        <p class="src-note">
          Deshalb muss eine Reduced-Motion-Regel Animationen verkürzen statt sie zu entfernen, so wie es der globale Block
          in <code>styles.scss</code> tut. Prüf es in deinem eigenen Build: Emuliere
          <code>prefers-reduced-motion: reduce</code>, schließ einen modalen Drawer und zähl die
          <code>.p-drawer-mask</code>-Elemente, die im Dokument übrig bleiben. Die Antwort muss null sein.
        </p>

        <h3>Umgestalten</h3>
        <ul>
          <li>
            Begrenze die Drawer-Token auf eine <code>styleClass</code>, z. B.
            <code>.inspector-panel &#123; --p-drawer-content-padding: 0; &#125;</code> für ein Panel, dessen Inhalt
            seine eigenen Ränder zeichnet. Die Klasse landet auf dem Panel-Element selbst.
          </li>
          <li>
            Breite und Höhe gehören in <code>[style]</code>, nicht in ein Token — die Positionsklassen setzen sie als
            schlichtes CSS, und ein Inline-Style ist das Einzige, das sie ohne Spezifitätskampf schlägt.
          </li>
          <li>
            Setz <code>border-width</code> bewusst. Die Basisregel <code>.p-drawer</code> deklariert
            <code>border-style: solid</code> und eine Rahmenfarbe, aber <strong>keine Breite</strong>, und jede
            Positionsklasse fügt genau eine logische 1px-Kante hinzu — also fallen drei Kanten auf das CSS-Initial
            <code>medium</code> (3px) zurück. <code>.p-drawer-full</code> ist die einzige Bibliotheksregel, die alle vier
            auf 1px setzt. Obendrein umrandet der Block jedes visuellen Stils die zur Seite zeigende Kante in
            <code>--style-outline</code>, pro Position, sodass ein <code>left</code>- und ein <code>right</code>-Drawer
            die Umrandung beide dort bekommen, wo die Seite ist; die drei Bildschirmkanten behalten die
            <code>medium</code>-Breite der Bibliothek, die eine <code>styleClass</code> auf 0 setzen kann.
          </li>
          <li>
            Die Maske nimmt <code>maskStyle</code> als Objekt, serialisiert in ein Inline-<code>style</code>-Attribut;
            einen Input für eine Maskenklasse gibt es nicht. Setz den Hintergrund <em>nicht</em> dort: Die gemeinsame
            Overlay-Regel und ihre beiden Keyframes lesen <code>var(--px-mask-background, …)</code>, also überschreibt
            eine Animation, die noch läuft — oder mit <code>forwards</code> geendet hat —, deinen Inline-Wert. Setz
            stattdessen <code>--px-mask-background</code>, dann stimmen Regel und Keyframes überein.
          </li>
          <li>
            Alles, was von außen mit einem Nachfahren-Selektor erreicht wird, muss <code>appendTo="body"</code> mit
            einrechnen — das Panel liegt nach dem Anhängen nicht mehr in deiner Komponente, also erreichen es
            <code>:host</code>-begrenzte Styles nicht. Das Kit verbietet <code>::ng-deep</code>; nimm eine
            <code>styleClass</code> und eine globale Regel.
          </li>
        </ul>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Kein eingebautes responsives Verhalten: Die Positionsklassen legen ein Links-/Rechts-Panel auf 20rem und ein
          Oben-/Unten-Panel auf 10rem fest, bei jedem Viewport, ohne Breakpoint. Auf einem 320px-Bildschirm ist ein
          Standard-Drawer links oder rechts genau so breit wie der Viewport, und die Seite, die er sichtbar lassen sollte,
          ist weg. Gib dem Panel eine Viewport-relative Breite mit Obergrenze —
          <code>[style]="&#123; width: 'min(34rem, 100vw)' &#125;"</code> — und nimm hin, dass es unterhalb der Grenze zu
          einem Vollbild-Sheet wird; muss die Seite dahinter auf einem Handy lesbar bleiben, ist ein Drawer dort der
          falsche Container.
        </p>

        <h3>Stand bei WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein hier nicht gemessenes Kriterium wird nicht behauptet.
          <strong>Erfüllt</strong> (geprüft in <code>docs/generated/CONTRAST.MD</code>, auf der Panel-Fläche, die der
          Drawer mit dem Dialog teilt): SC 1.4.3 für den Panel-Text (10,35:1 hell / 17,72:1 dunkel gegen eine
          Untergrenze von 4,5:1), SC 1.4.11 für das Icon des Schließen-Buttons (niedrigster Wert 5,21:1) und für den
          Fokus-Ring des Kits gegen das Panel (niedrigster Wert 5,18:1), SC 2.4.7 für diesen Ring und SC 2.5.8 für den
          Schließen-Button mit 40 x 40px. <strong>Nicht erfüllt:</strong> SC 4.1.2 — der Container ist eine statische
          <code>complementary</code>-Landmark ohne Namens-Input, im Baum gemessen als <code>complementary</code> mit leerem
          Namen, und ein nicht gesetztes <code>ariaCloseLabel</code> lässt den reinen Icon-Schließen-Button namenlos;
          und SC 2.4.3, denn der Fokus geht beim Öffnen weder hinein — er bleibt auf dem Auslöser, während Tab über die
          Seite hinter der Maske wandert — noch kehrt er beim Schließen zum Öffner zurück. <strong>Bedingt:</strong>
          SC 2.1.2 — ist der Fokus einmal drinnen, kreist er und kann nicht hinaus, also hält die Falle nur, solange
          Escape funktioniert, und <code>[closeOnEscape]="false"</code> entfernt die Maske, lässt das Panel aber offen,
          was einen zweiten, sichtbaren Ausweg braucht. <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Die API, mit den Standardwerten, die zählen</h3>
        <p>
          <code>DrawerModule</code> aus <code>&#64;openng/optimus-ui/drawer</code>; der Inhalt wird projiziert, und es
          gibt keinen Service. Gelesen aus der ausgelieferten Komponente in Optimus UI 2.0.2
          (<code>openng-optimus-ui-drawer.mjs</code>).
        </p>
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
              <tr>
                <td><code>visible</code></td>
                <td><code>false</code></td>
                <td>
                  Zwei-Wege, und <strong>kein Signal</strong> — ein schlichtes Getter/Setter-Paar (:274-282), dessen
                  Setter nur <code>modalVisible</code> scharf schaltet. Das Motion-System hält das Panel im DOM,
                  bis die Leave-Animation vorbei ist, und ein geschlossenes Panel <em>kann</em> danach bei
                  <code>display: none</code> dort bleiben. Prüf in Tests <code>data-p-open</code> oder das berechnete
                  <code>display</code>, nie die Anwesenheit des Elements.
                </td>
              </tr>
              <tr>
                <td><code>position</code></td>
                <td><code>'left'</code></td>
                <td>
                  Signal-Input. <code>'left' | 'right' | 'top' | 'bottom'</code> — plus <code>'full'</code>, das die
                  Klasse behandelt, das JSDoc aber nicht aufführt.
                </td>
              </tr>
              <tr>
                <td><code>header</code></td>
                <td>—</td>
                <td>Rendert in einem <code>&lt;div&gt;</code>, keiner Überschrift. Siehe „Benennung“ unten.</td>
              </tr>
              <tr>
                <td><code>modal</code></td>
                <td>
                  <strong><code>true</code></strong>
                </td>
                <td>
                  Der Hauptschalter für die Maske und damit für <code>dismissible</code> und <code>blockScroll</code>.
                </td>
              </tr>
              <tr>
                <td><code>dismissible</code></td>
                <td><code>true</code></td>
                <td>Klick auf die Maske schließt. Gelesen, wenn die Maske erzeugt wird, also beim Öffnen.</td>
              </tr>
              <tr>
                <td><code>closeOnEscape</code></td>
                <td><code>true</code></td>
                <td>Steuert nur den Escape-Listener am <em>Document</em>. Siehe „Escape“ unten.</td>
              </tr>
              <tr>
                <td><code>closable</code></td>
                <td><code>true</code></td>
                <td>
                  Rendert den Schließen-Button im Header — zusammen mit dem veralteten <code>showCloseIcon</code>, das
                  ebenfalls true sein muss.
                </td>
              </tr>
              <tr>
                <td><code>ariaCloseLabel</code></td>
                <td>—</td>
                <td>Der einzige Benennungs-Input der Komponente, und er benennt den <em>Button</em>.</td>
              </tr>
              <tr>
                <td><code>blockScroll</code></td>
                <td>
                  <strong><code>false</code></strong>
                </td>
                <td>Sperrt das Scrollen des Body — innerhalb des <code>modal</code>-Zweigs.</td>
              </tr>
              <tr>
                <td><code>appendTo</code></td>
                <td><code>'self'</code></td>
                <td>Signal-Input, fällt auf das globale <code>overlayAppendTo</code> zurück. Nimm <code>"body"</code>.</td>
              </tr>
              <tr>
                <td><code>fullScreen</code></td>
                <td><code>false</code></td>
                <td>Signal-Input. Nicht dasselbe wie <code>position="full"</code>; siehe unten.</td>
              </tr>
              <tr>
                <td><code>maskStyle</code></td>
                <td>—</td>
                <td>Ein Objekt, serialisiert in einen Inline-Style auf der Maske.</td>
              </tr>
              <tr>
                <td><code>closeButtonProps</code></td>
                <td><code>&#123; severity: 'secondary', text: true, rounded: true &#125;</code></td>
                <td>Wird direkt an den inneren <code>p-button</code> durchgereicht.</td>
              </tr>
              <tr>
                <td><code>style</code>, <code>styleClass</code></td>
                <td>—</td>
                <td>Beide landen auf dem Panel-Element. Die Größe gehört hierher.</td>
              </tr>
              <tr>
                <td><code>motionOptions</code></td>
                <td>—</td>
                <td>Signal-Input, in die Optionen der Motion-Direktive gemischt.</td>
              </tr>
              <tr>
                <td><code>autoZIndex</code>, <code>baseZIndex</code></td>
                <td><code>true</code>, <code>0</code></td>
                <td>Schichtung. Lass sie in Ruhe, außer du stapelst Overlays aus zwei Bibliotheken.</td>
              </tr>
              <tr>
                <td><code>showCloseIcon</code></td>
                <td><code>true</code></td>
                <td>
                  <strong>Veraltet</strong> zugunsten von <code>closable</code>. Wird immer noch mit ihm UND-verknüpft,
                  also entfernt false bei einem von beiden den Button.
                </td>
              </tr>
              <tr>
                <td><code>transitionOptions</code></td>
                <td><code>'150ms cubic-bezier(0, 0, 0.2, 1)'</code></td>
                <td>
                  <strong>Immer noch ein Input, und tot.</strong> Markiert mit <code>&#64;deprecated since v21.0.0</code>
                  (:263-268) und von nichts in der Komponente gelesen — nimm <code>motionOptions</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Outputs: <code>visibleChange</code>, <code>onShow</code>, <code>onHide</code>. Templates:
          <code>#header</code>, <code>#footer</code>, <code>#content</code>, <code>#closeicon</code>,
          <code>#headless</code> — jedes auch erreichbar als <code>pTemplate="…"</code>.
        </p>

        <h3>Escape schließt zweimal, und nur einer der Wege sagt es dir</h3>
        <p>
          Es gibt zwei unabhängige Escape-Wege, und sie tun Verschiedenes. Der
          <strong>Document-Listener</strong> wird beim Öffnen gebunden, nur wenn <code>closeOnEscape</code> true ist,
          und ruft das <code>close()</code> der Komponente auf: <code>visibleChange</code> und <code>onHide</code> werden
          ausgegeben, und das Panel geht. Der <strong>eigene <code>(keydown)</code>-Handler des Containers</strong> hängt
          an gar keiner Bedingung und ruft <code>hide(false)</code> auf, das <code>onHide</code> unterdrückt,
          <code>visible</code> nie anfasst und nur die Modalität abbaut.
        </p>
        <p>
          Mit den Standardwerten feuern beide, und der zweite erledigt die eigentliche Arbeit, also sieht nichts falsch
          aus. Schalte das Flag ab, und die Spaltung wird sichtbar:
          <strong
            >mit <code>[closeOnEscape]="false"</code> und dem Fokus im Panel entfernt Escape die Maske und lässt das
            Panel offen</strong
          >
          — in voller Größe, weiter markiert mit <code>data-p-open="true"</code>, und die Seite dahinter ist wieder
          klickbar. Versteh <code>closeOnEscape</code> als „Escape schließt ihn richtig“, nicht als „Escape ist
          abgeschaltet“, und gib einem Drawer, der offen bleiben muss, einen zweiten, sichtbaren Ausweg.
        </p>
        <p>
          Der Document-Weg hat noch eine Bedingung: Er schließt nur, wenn der Inline-<code>z-index</code> des Panels dem
          Wert gleicht, den das Schichtungs-Utility aus genau diesem Attribut zurückliest. Mit
          <code>[autoZIndex]="false"</code> schreibt niemand diesen Inline-Wert, der Vergleich scheitert, und Escape
          entfernt nur die Maske — derselbe Endzustand wie bei <code>[closeOnEscape]="false"</code>. Lass
          <code>autoZIndex</code> in Ruhe. Derselbe selbstbezügliche Vergleich ist der Grund, warum ein zweiter offener
          Drawer nicht vor dem Escape des ersten geschützt ist: Er ist für jedes offene Panel erfüllt.
        </p>
        <p class="src-note">
          Gelesen aus dem Quelltext der Komponente in Optimus UI 2.0.2 — der Container-Handler und
          <code>hide(false)</code> bei <code>openng-optimus-ui-drawer.mjs:406-410</code> gegenüber
          <code>bindDocumentEscapeListener()</code> bei <code>:511-520</code> und <code>close()</code> bei
          <code>:430-435</code> — und im Browser für beide Zustände des Flags bestätigt. Prüf es in deinem Build, indem
          du jeden Schließweg aus <code>(onHide)</code> protokollierst: Die Wege, die dort nicht auftauchen, sind die,
          die das Panel offen gelassen haben.
        </p>

        <h3><code>modal</code> ist der Hauptschalter</h3>
        <p>
          <code>enableModality()</code> wird von <code>show()</code> nur aufgerufen, wenn <code>modal</code> true ist,
          und alles, was das Overlay mit dem Rest der Seite macht, lebt darin: die Maske erzeugen, den Klick-Listener der
          Maske anhängen, wenn <code>dismissible</code> gesetzt ist, und das Scrollen des Body sperren, wenn
          <code>blockScroll</code> gesetzt ist. Also schaltet <code>[modal]="false"</code> beide Flags stillschweigend ab.
          Dazu kommt ein Detail der Reihenfolge: Der Klick-Listener wird angehängt, wenn die Maske <em>erzeugt</em> wird,
          also wirkt ein Umschalten von <code>dismissible</code> von false auf true bei offenem Drawer erst beim nächsten
          Öffnen.
        </p>

        <h3>Zwei Wege, den Bildschirm zu füllen, und sie unterscheiden sich</h3>
        <ul>
          <li>
            <code>position="full"</code> — die Positionsklasse wird <code>p-drawer-full</code>, also geht das Panel auf
            100 % × 100 % mit <code>transition: none</code>, und die Enter-Animation ist das Skalieren und Einblenden von
            <code>p-drawer-enter-full</code>. Die <em>Maske</em> behält ihre gewöhnlichen Klassen.
          </li>
          <li>
            <code>[fullScreen]="true"</code> — setzt <code>p-drawer-full</code> auf das Panel <em>und</em> auf die Maske,
            während die Positionsklasse bleibt, was <code>position</code> sagt. Das Panel trägt also zwei Größenregeln,
            und die spätere im Stylesheet gewinnt.
          </li>
        </ul>
        <p>
          Nimm einen und bleib dabei. <code>position="full"</code> ist die ehrliche Schreibweise für „dieses Panel ist der
          ganze Viewport“; <code>fullScreen</code> liest sich wie ein Zusatz zu einem positionierten Drawer und ist der
          Weg, der eine Klassenkollision erzeugt. Beachte auch, dass das JSDoc des <code>fullScreen</code>-Inputs im
          ausgelieferten Quelltext ein Schließen-Icon beschreibt — ein Copy-paste-Überbleibsel, kein zweites Verhalten.
        </p>

        <h3>Benennung, und was ein Screenreader tatsächlich bekommt</h3>
        <p>
          Das Panel ist eine <code>complementary</code>-Landmark mit statischer Rolle und ohne <code>aria-modal</code>.
          Es gibt keinen <code>ariaLabel</code>- und keinen <code>ariaLabelledBy</code>-Input; <code>header</code> rendert
          in ein <code>&lt;div class="p-drawer-title"&gt;</code>, auf das nichts verweist. Eine namenlose Landmark wird
          allein mit ihrer Rolle angesagt.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Markup</th>
                <th>Knoten im Accessibility Tree</th>
              </tr>
            </thead>
            <tbody>
              @for (row of axRows; track row.markup) {
                <tr>
                  <td>{{ row.markup }}</td>
                  <td>{{ row.node }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ axNote }}</p>
        <p>Zwei Wege, das zu beheben, und die Wahl hängt davon ab, ob der Drawer blockiert:</p>
        <ul>
          <li>
            <strong>Nicht modales Seiten-Panel</strong> — behalte <code>complementary</code> und gib ihm über die
            Pass-through-API einen Namen, oder benenne eine Region <em>im</em> Panel (ein <code>&lt;nav aria-label&gt;</code>,
            ein <code>&lt;h2&gt;</code>) und lass die Landmark generisch. Die zweite Option braucht kein
            Bibliothekswissen und ist der sicherere Standard.
          </li>
          <li>
            <strong>Modaler Drawer</strong> — eine blockierende Fläche sollte ein <code>dialog</code> sein. Überschreib
            die Rolle und setz den Namen auf derselben Pass-through-Route. Füg <em>nicht</em> zusätzlich
            <code>aria-modal="true"</code> hinzu, außer du machst auch den Rest der Seite inert: Das Attribut verspricht,
            dass das Draußen unerreichbar ist, und weder der Drawer noch seine Maske setzt <code>inert</code> oder
            <code>aria-hidden</code> auf irgendetwas.
          </li>
        </ul>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          Die Pass-through-Route ist <code>pt.root</code>, weil der Container mit
          <code>[pBind]="ptm('root')"</code> gebunden ist; die Attribute, die sie setzt, werden nach den statischen des
          Templates angewendet, und genau das lässt sie <code>role</code> überschreiben. Header, Inhalt, Footer und
          Schließen-Button sind <code>pt.header</code>, <code>pt.content</code>, <code>pt.footer</code> und
          <code>pt.pcCloseButton</code>. Prüf das Ergebnis im Accessibility Tree des Browsers, nicht im DOM-Inspektor.
        </p>

        <h3>Fokus: was die Bibliothek tut, und die zwei Dinge, die sie nicht tut</h3>
        <p>
          Der Modal-Vertrag der APG hat vier Klauseln. Der Drawer hält anderthalb davon, und das ist der ganze Grund,
          warum der Tab Beispiele ein Fokus-Instrument hat.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Klausel</th>
                <th>Stand in Optimus UI 2.0.2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Die Fläche hat eine Dialog-Rolle</td>
                <td><strong>Nein</strong> — <code>complementary</code>, fest verdrahtet.</td>
              </tr>
              <tr>
                <td>Sie hat einen zugänglichen Namen</td>
                <td><strong>Nicht standardmäßig</strong> — kein Benennungs-Input für das Panel.</td>
              </tr>
              <tr>
                <td>Der Fokus wandert beim Öffnen hinein</td>
                <td>
                  <strong>Nein</strong> — <code>pFocusTrap</code> setzt nur zwei versteckte Wächter-Spans, und die
                  Komponente ruft nie <code>focus()</code> auf. Der Fokus bleibt auf dem Auslöser.
                </td>
              </tr>
              <tr>
                <td>Der Fokus kreist drinnen, solange offen</td>
                <td>
                  <strong>Ja, unter Bedingung</strong> — die Wächter lassen Tab und Shift+Tab umlaufen, sobald der Fokus
                  drinnen ist. Bis dahin wandert Tab über die Seite hinter der Maske, und das ist derselbe Mangel, von
                  der anderen Seite gesehen.
                </td>
              </tr>
              <tr>
                <td>Der Fokus kehrt beim Schließen zum Öffner zurück</td>
                <td><strong>Nein</strong> — nichts merkt sich den Auslöser.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ focusMeasuredNote }}</p>
        <p>
          Beide Lücken musst du schließen, und beide sind drei Zeilen. Setz den Fokus bei
          <code>(onShow)</code> hinein — auf das erste sinnvolle Bedienelement oder auf eine Überschrift, die du
          fokussierbar gemacht hast, nie auf den Schließen-Button. Gib ihn bei <code>(onHide)</code> zurück, das die
          Komponente für den Schließen-Button, die Maske und den Escape-Weg über das Document ausgibt. Das Kit liefert
          für die zweite Hälfte <code>FocusReturn</code> in <code>src/app/utils/focus-return.ts</code>; es ist
          absichtlich schlicht, ignoriert <code>&lt;body&gt;</code> und tut nichts, wenn der Auslöser das Dokument
          verlassen hat.
        </p>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>

        <h3>SSR</h3>
        <p>
          Das Panel steht in einem <code>&#64;if</code> auf dem internen <code>modalVisible</code>-Flag der Komponente,
          also wird ein geschlossener Drawer als gar nichts vorgerendert — das ist richtig und heißt auch, dass nichts von
          seinem Inhalt im statischen HTML steht. Leg keinen Inhalt in einen Drawer, der crawlbar oder ohne JavaScript
          lesbar sein muss. Ein Drawer, der offen startet, ist etwas anderes: Die Maske wird mit
          <code>document.body</code> erzeugt, und die Wächter-Spans der Fokusfalle entstehen nur im Browser, also weichen
          das serverseitig gerenderte Markup und das hydrierte voneinander ab. Starte lieber geschlossen und öffne aus
          einem Effect heraus.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>
            ☐ Die Container-Entscheidung wurde am Inhalt getroffen: Die Seite dahinter zählt noch, und die Fläche
            braucht eine Kante und Breite.
          </li>
          <li>
            ☐ Eine Breite (oder Höhe, bei top/bottom) ist explizit gesetzt, Viewport-relativ mit Obergrenze. Die
            ausgelieferten 20rem / 10rem gehen nicht an die Nutzer.
          </li>
          <li>☐ <code>appendTo="body"</code>.</li>
          <li>☐ Das Panel hat einen zugänglichen Namen — über <code>pt</code> oder über eine benannte Region darin.</li>
          <li>
            ☐ Ein modaler Drawer trägt entweder <code>role="dialog"</code> über <code>pt</code>, oder er ist ehrlich
            nicht modal. <code>aria-modal</code> ist nicht ohne Inertheit gesetzt.
          </li>
          <li>
            ☐ Der Fokus wird bei <code>(onShow)</code> ins Panel gesetzt und bei <code>(onHide)</code> an den Auslöser
            zurückgegeben, geprüft mit der Tastatur, nicht mit der Maus.
          </li>
          <li>☐ <code>ariaCloseLabel</code> ist gesetzt und übersetzt, sobald der Header-Button gerendert wird.</li>
          <li>☐ Es gibt einen sichtbaren Ausweg, der weder Escape noch die Maske ist.</li>
          <li>☐ Aktionen stehen im <code>footer</code>-Template, nicht am Ende des scrollenden Inhalts.</li>
          <li>
            ☐ Auf <code>dismissible</code> und <code>blockScroll</code> wird nur zusammen mit
            <code>[modal]="true"</code> gebaut.
          </li>
          <li>☐ Reduced Motion wurde emuliert, und die Maske war nach dem Schließen aus dem DOM verschwunden.</li>
          <li>☐ Nichts im Drawer muss crawlbar, verlinkbar oder mit dem Zurück-Button erreichbar sein.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Eine Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), die die drei Dinge festnagelt, die zuerst verrotten — den Namen, die
          Fokus-Rückgabe und das Entfernen der Maske:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Zwei Strings, und einer davon geht leicht verloren</h3>
        <p>
          Die Komponente liest <strong>nichts</strong> aus der Übersetzungskonfiguration der Bibliothek — es gibt keinen
          <code>aria</code>-Eintrag, den sie befragt, und nichts, das man über <code>Optimus.setTranslation</code>
          hineinreichen könnte. Alles, was ein Nutzer hört, kommt aus deinem Template:
        </p>
        <ul>
          <li>
            <strong><code>header</code></strong> — der sichtbare Titel. Binde ihn über ein <code>computed()</code>,
            damit ein Sprachwechsel ihn neu rendert; ein schlichtes Feld wird einmal gelesen und veraltet.
          </li>
          <li>
            <strong><code>ariaCloseLabel</code></strong> — der zugängliche Name des Schließen-Buttons. Er hat keinen
            Standardwert und keinen Fallback, also bleibt der Button ohne ihn nur über sein Icon benannt, und das heißt:
            namenlos. Das ist der, den die Leute vergessen, weil der Button gut aussieht.
          </li>
          <li>
            <strong>Der eigene Name des Panels</strong>, falls du über <code>pt</code> einen setzt — dieselbe Regel: Er
            ist ein String deiner Oberfläche und gehört in die Übersetzungsschicht.
          </li>
          <li>
            <strong>Alles, was du projizierst</strong>, auch die Buttons im Footer und der Rahmen des Headless-Templates.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Länge: Ein 20rem-Panel ist in jeder Sprache ein 20rem-Panel</h3>
        <p>
          Der Header ist eine Flex-Zeile mit <code>space-between</code> und <code>flex-shrink: 0</code>; der Titel ist
          ein 1.5rem-Div neben einem 40px-Button. Ein Titel, der auf Englisch in die Standardbreite passt, kann auf
          Deutsch auf zwei Zeilen umbrechen und den Header höher drücken oder — mit einem langen, ungebrochenen
          Kompositum — überlaufen. Zwei Folgen: Setz die Breite nach der längsten Sprache, die du auslieferst, nicht nach
          Englisch, und halte den Titel so kurz, dass er ein Label ist und kein Satz. Der Inhalt darunter scrollt; der
          Header nicht.
        </p>

        <h3>RTL: physische Position, logischer Rahmen, und sie widersprechen sich</h3>
        <p>
          Eine Positionsklasse mischt die beiden Koordinatensysteme in einer Regel:
          <code>.p-drawer-left</code> setzt <code>left: 0</code> — physisch — und
          <code>border-inline-end-width: 1px</code> — logisch. In einem Dokument von links nach rechts stimmen sie
          überein: Das Panel sitzt physisch links, und die einzige 1px-Kante ist die, die zur Seite zeigt. Stell
          <code>dir</code> auf <code>rtl</code>, und <strong>beide Hälften brechen auf einmal</strong>.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th><code>position</code></th>
                <th>LTR</th>
                <th>RTL</th>
              </tr>
            </thead>
            <tbody>
              @for (row of rtlRows; track row.pos) {
                <tr>
                  <td>
                    <code>{{ row.pos }}</code>
                  </td>
                  <td>{{ row.ltr }}</td>
                  <td>{{ row.rtl }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p>
          Das Panel bewegt sich nicht — <code>left: 0</code> ist <code>left: 0</code> in jeder Richtung —, der Rahmen
          aber schon: Die 1px-Kante landet auf der Seite, die bündig am Viewport liegt, während die übrigen drei beim
          CSS-Initial <code>medium</code> (3px) bleiben, weil die Basisregel keine Breite setzt. <code>left</code> und
          <code>right</code> für RTL zu tauschen behebt die Seite, von der das Panel kommt, und lässt den Rahmen
          verkehrt, ist für sich allein also keine Lösung. Lieferst du RTL aus, setzt du <code>border-width</code>
          explizit, in einer eigenen Regel.
        </p>
        <p class="src-note">
          {{ rtlNote }}
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Stil-Umrandung
            sitzt pro Position auf der zur Seite zeigenden Kante (nicht mehr <code>border-left</code> an jedem Drawer);
            der Schließen-Button bekommt den 2px-Ring des Kits in <code>--primary-color-fg</code>; Panel-Text,
            Schließen-Icon und Ring aus dem Gate zitiert.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) nachgeprüft:
            Jeder <code>html.style-*</code>-Block in <code>styles.scss</code> umrandet die linke Kante des Drawers (und
            zwei setzen seinen Radius flach) — jetzt in der Anatomie, der Geometrie-Tabelle und den Hinweisen zum
            Umgestalten; Token- und Kontrastwerte als Aura-Standardpalette außerhalb des Kontrast-Gates ausgewiesen;
            der Hinweis zum Fokus-Ring nennt das Akzent-Token statt der Hex-Werte eines Akzents; Aussage zu schmalen
            Bildschirmen ergänzt; Verlauf mit dem Neuesten zuerst.
          </li>
          <li>
            <strong>v0.4</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014, ein Fork der Codebasis von
            PrimeNG 21). Zwei Aussagen aus v0.3 kippten zurück: Die Maske wird wieder bedingungslos an
            <code>&lt;body&gt;</code> angehängt (:455), und der Rahmen-Mangel ist da — die Basisregel liefert immer noch
            kein <code>border-width</code>, also stehen drei Kanten auf <code>medium</code> (3px). <code>visible</code>
            ist wieder ein schlichter Getter/Setter, kein <code>model()</code>, und <code>transitionOptions</code> ist als
            toter <code>&#64;deprecated</code>-Input zurück, statt entfernt zu sein. Aura-Token sind die 2.x-Werte (Titel
            wieder 1.5rem); alle Zeilenverweise gegen die Optimus-Bundles neu abgeleitet. Unverändert: der ungesteuerte
            Escape-Weg über den Container, der nackte <code>animationend</code>-Abbau, die unbenannte
            <code>complementary</code>-Rolle.
          </li>
          <li>
            <strong>v0.3</strong> — 23.08.2026 — Gegen PrimeNG 22.1 / Themes 3.0 nachgeprüft. Zwei Upstream-Korrekturen
            festgehalten: Der Rahmen-Mangel ist weg (Basisregel jetzt 1px, keine 3px-<code>medium</code>-Kanten mehr),
            und die Maske landet neben dem Container statt immer auf <code>&lt;body&gt;</code>. <code>visible</code> ist
            ein <code>model()</code>-Signal; <code>transitionOptions</code> wurde entfernt (Bewegung über
            <code>motionOptions</code>). Unverändert und neu bestätigt: der ungesteuerte Escape-Weg über den Container,
            der nackte <code>animationend</code>-Abbau der Maske, die unbenannte <code>complementary</code>-Rolle.
            Zeilenverweise neu abgeleitet; Aura-Drawer-Token nur bei der Titelgröße geändert (1.5→1.125rem).
          </li>
          <li>
            <strong>v0.2</strong> — 20.08.2026 — Zusammenfassung zum Stand bei WCAG 2.2 im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht
            beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erster Guide: die Container-Entscheidung gegen Dialog, Popover,
            Confirmdialog, Menubar, eine Section und eine Route; die fünf Positionen und ihre ausgelieferten Größen;
            die Benennungsgeschichte „Landmark statt Dialog“ mit der Pass-through-Lösung; die zwei Escape-Wege;
            <code>modal</code> als Hauptschalter über <code>dismissible</code> und <code>blockScroll</code>; gemessene
            Aura-Token- und Kontrastketten in beiden Themes; der <code>animationend</code>-Abbau der Maske unter Reduced
            Motion; und das kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DrawerArticleDeComponent extends DrawerArticleComponent {
  // ---------------------------------------------------------------- playground

  override readonly positionOptions = [
    { label: 'left (Standard)', value: 'left' },
    { label: 'right', value: 'right' },
    { label: 'top', value: 'top' },
    { label: 'bottom', value: 'bottom' },
    { label: 'full', value: 'full' },
  ];

  override readonly semanticsOptions = [
    { label: 'keine — die ausgelieferte Landmark', value: 'none' },
    { label: 'nur Name — benannte complementary', value: 'named' },
    { label: 'Rolle + Name — wird als Dialog angesagt', value: 'dialog' },
  ];

  /** The same pass-through objects as the English base, with the German panel name. */
  override readonly pgPt = computed(() => {
    switch (this.pgSemantics()) {
      case 'named':
        return { root: { 'aria-label': 'Playground-Drawer' } };
      case 'dialog':
        return { root: { role: 'dialog', 'aria-label': 'Playground-Drawer' } };
      default:
        return undefined;
    }
  });

  override readonly pgHint = computed(() => {
    const parts: string[] = [];
    parts.push(
      this.pgModal()
        ? 'Modal: Eine Maske wird erzeugt und an body angehängt.'
        : 'Nicht modal: keine Maske — dismissible und blockScroll bewirken nichts.',
    );
    if (this.pgModal() && !this.pgDismissible()) parts.push('Die Maske schließt ihn nicht.');
    if (!this.pgClosable()) parts.push('Kein Header-Button.');
    if (!this.pgEscape())
      parts.push(
        'Escape schließt ihn nicht mehr richtig — baut die Maske aber trotzdem ab, wenn der Fokus im Panel ist.',
      );
    return parts.join(' ');
  });

  // ------------------------------------------------------------ focus journal

  override openFocusDemo(wired: boolean): void {
    super.openFocusDemo(wired);
    const target = wired ? this.fjWired : this.fjBare;
    target.update((s) => (s.opened === 'measuring…' ? { ...s, opened: 'wird gemessen …' } : s));
  }

  /** The same short name for whatever has focus as the English base, in German. */
  protected override describeActive(): string {
    if (!this.isBrowser) return '—';
    const el = document.activeElement;
    if (!el || el === document.body) return 'body — nichts hat den Fokus';
    const tag = el.tagName.toLowerCase();
    const label = el.getAttribute('aria-label') || (el.textContent || '').trim();
    const short = label.length > 28 ? label.slice(0, 28) + '…' : label;
    return short ? `${tag} „${short}“` : tag;
  }

  // ------------------------------------------------------- measured reference

  override readonly tokenRows = [
    {
      varName: '--p-drawer-background',
      alias: '{overlay.modal.background}',
      light: 'rgb(255, 255, 255)',
      dark: 'rgb(24, 24, 27)',
    },
    {
      varName: '--p-drawer-color',
      alias: '{overlay.modal.color} -> {text.color}',
      light: 'rgb(51, 65, 85)',
      dark: 'rgb(255, 255, 255)',
    },
    {
      varName: '--p-drawer-border-color',
      alias: '{overlay.modal.border.color}',
      light: 'rgb(226, 232, 240)',
      dark: 'rgb(63, 63, 70)',
    },
    {
      varName: '--p-drawer-shadow',
      alias: '{overlay.modal.shadow}',
      light: '0 20px 25px -5px rgba(0,0,0,.1), 0 8px 10px -6px rgba(0,0,0,.1)',
      dark: 'identisch',
    },
    { varName: '--p-drawer-header-padding', alias: '{overlay.modal.padding}', light: '20px', dark: 'identisch' },
    {
      varName: '--p-drawer-content-padding',
      alias: 'dasselbe Padding, ohne die obere Kante',
      light: '0 20px 20px',
      dark: 'identisch',
    },
    { varName: '--p-drawer-footer-padding', alias: '{overlay.modal.padding}', light: '20px', dark: 'identisch' },
    {
      varName: '--p-drawer-title-font-size / -weight',
      alias: 'Literale im Preset',
      light: '24px / 600',
      dark: 'identisch',
    },
    { varName: '(es gibt kein Radius-Token)', alias: 'nicht Teil der Drawer-Gruppe', light: '0px', dark: '0px' },
    {
      varName: '--px-mask-background',
      alias: 'mask.background, von jedem Overlay geteilt',
      light: 'rgba(0, 0, 0, 0.4)',
      dark: 'rgba(0, 0, 0, 0.6)',
    },
  ];

  override readonly tokenNote: string = 'Jedes Flächen-Token ist ein Alias von overlay.modal.*, also sind Drawer und Dialog per Konstruktion dasselbe Material — und weder die Gruppe noch das Basis-Stylesheet geben dem Panel einen Eckenradius, weshalb die Ecken eckig sind. Die aufgelösten Werte sind Auras Standard-Surface-Palette (slate hell, zinc dunkel): Kein visueller Stil überschreibt diese Token, und der Akzent erreicht sie nicht. Die Maske wird gar nicht über ein Drawer-Token gestaltet: Sie nimmt den gemeinsamen Masken-Hintergrund der Overlays, und --px-mask-background ist die Variable, die sowohl die Regel als auch ihre Keyframes lesen.';

  override readonly contrastRows = [
    { pair: 'Panel-Text (das geerbte --p-drawer-color)', light: '10,35:1', dark: '17,72:1', floor: '4,5:1' },
    { pair: 'Icon des Schließen-Buttons (--text-color-secondary) auf dem Panel', light: '5,21–7,78:1', dark: '6,78–8,48:1', floor: '3:1' },
    { pair: 'Fokus-Ring des Schließen-Buttons (Kit-Ring) gegen das Panel', light: '5,18–17,85:1', dark: '6,40–16,93:1', floor: '3:1' },
  ];

  override readonly contrastNote: string = 'Zitiert aus dem Kontrast-Gate, docs/generated/CONTRAST.MD. Das Drawer-Panel ist die overlay.modal-Fläche, derselbe Wert wie das Dialog-Panel (die Zeilen „panel outline“ führen drawer.background neben der Card), also sind die dialog.background-Zeilen des Gates die des Drawers: „dialog“ für den Panel-Text und das Schließen-Icon (die Kit-Farbe des sekundären Text-Buttons, --text-color-secondary), „focus ring“ für den 2px-Ring des Kits in --primary-color-fg auf dialog.background, Spannen über die vier visuellen Stile und, beim Ring, über die Akzente. Inhalt, der seine eigene Farbe setzt, liegt außerhalb dieser Zahlen — miss ihn gegen den Panel-Hintergrund, nicht gegen die Seite.';

  override readonly geometryRows = [
    {
      what: 'Panel links / rechts',
      value: '320px breit (20rem), volle Viewport-Höhe',
      origin: 'Positionsklasse, schlichtes CSS',
    },
    {
      what: 'Panel oben / unten',
      value: '160px hoch (10rem), volle Viewport-Breite',
      origin: 'Positionsklasse, schlichtes CSS',
    },
    { what: 'position="full"', value: 'der ganze Viewport, transition: none', origin: 'p-drawer-full' },
    {
      what: 'Rahmen',
      value: '1px an der Kante zur Seite, 3px an den anderen drei',
      origin: 'border-style: solid ohne Breite',
    },
    { what: 'Rahmen, Vollbild', value: 'alle vier mit 1px', origin: 'p-drawer-full setzt border-width: 1px' },
    {
      what: 'Rahmen, visuelle Stile des Kits',
      value: 'nur die Kante zur Seite, 1–3px in --style-outline (logische Seite je Position)',
      origin: 'html.style-<name> .p-drawer-<position> in styles.scss',
    },
    { what: 'Eckenradius', value: '0px', origin: 'kein Token; werkbund und blaupause setzen 0 zusätzlich explizit' },
    { what: 'Schließen-Button / sein Icon', value: '40 x 40px / 16 x 16px', origin: 'p-button, rounded + text' },
  ];

  override readonly geometryNote: string = 'Berechneter Stil auf den Positionsklassen bei einem Viewport von 1440 x 900. Die drei 3px-Kanten sind die CSS-Initialbreite medium, die durchscheint, und box-sizing ist border-box, also gehen sie von der Inhaltsbreite ab, die du setzt.';

  override readonly focusRingNote: string = 'In Ruhe nichts. Per Tastatur fokussiert, bekommt der Schließen-Button den Fokus-Ring des Kits: .p-button:focus-visible steht in der einen Ring-Regel von styles.scss, eine 2px solid --primary-color-fg-Outline mit 2px Abstand und !important, gezeichnet über den eigenen 1px-Ring des sekundären Buttons (Aura {surface.600} / {surface.300}). Das Gate misst ihn auf der Panel-Fläche (CONTRAST.MD, „focus ring“ auf dialog.background, niedrigster Wert 5,18:1). Ein Umstellen von --p-focus-ring-color ändert hier also nichts. Alles, was du ins Panel projizierst, behält den Ring, den es auf der Seite gehabt hätte.';

  override readonly motionRows = [
    {
      what: 'Panel Enter / Leave',
      normal: 'p-animate-drawer-enter|leave-<position>, 0.5s cubic-bezier(0.32, 0.72, 0, 1)',
      reduced: 'ganz übersprungen — keine p-drawer-enter-*-Klasse wird gesetzt',
    },
    {
      what: 'Maske ein- / ausblenden',
      normal: 'p-animate-overlay-mask-enter|leave, 0.3s (mask.transitionDuration)',
      reduced: '0.01ms, aus der globalen Regel des Kits — endet trotzdem, also wird die Maske trotzdem entfernt',
    },
    {
      what: 'Abbau nach dem Schließen',
      normal: 'an die Leave-Animation gekoppelt; das Panel-Element kann bei display: none zurückbleiben',
      reduced: 'nichts, worauf man warten müsste, also läuft das Unmount im nächsten Frame',
    },
  ];

  override readonly axRows = [
    { markup: 'wie ausgeliefert', node: 'complementary, Name „“ — eine Landmark ohne Namen' },
    { markup: '[pt]="{ root: { \'aria-label\': … } }"', node: 'complementary, Name „Playground-Drawer“' },
    { markup: "[pt]=\"{ root: { role: 'dialog', 'aria-label': … } }\"", node: 'dialog, Name „Playground-Drawer“' },
    { markup: 'Schließen-Button mit ariaCloseLabel', node: 'button, Name „Menü schließen“' },
    { markup: 'Schließen-Button ohne', node: 'überhaupt kein aria-label-Attribut; der einzige Inhalt ist ein <svg>' },
  ];

  override readonly axNote: string = 'Aus dem Accessibility Tree des Browsers gelesen, mit offenem Drawer, einmal je Variante. aria-modal erscheint nie, außer du fügst es hinzu — und es hinzuzufügen ist eine Behauptung über den Rest der Seite, die nichts in der Komponente einlöst.';

  override readonly rtlRows = [
    {
      pos: 'left',
      ltr: 'links festgemacht, Rahmen 3/1/3/3 — die 1px-Kante zeigt zur Seite',
      rtl: 'immer noch links festgemacht, Rahmen 3/3/3/1 — die 1px-Kante zeigt zum Viewport-Rand',
    },
    {
      pos: 'right',
      ltr: 'rechts festgemacht, Rahmen 3/3/3/1 — die 1px-Kante zeigt zur Seite',
      rtl: 'immer noch rechts festgemacht, Rahmen 3/1/3/3 — die 1px-Kante zeigt zum Viewport-Rand',
    },
  ];

  override readonly rtlNote: string = 'Berechneter Stil an den gerenderten Panels mit dir="ltr" und danach dir="rtl" am Dokument; Rahmenbreiten im Uhrzeigersinn ab oben gelesen. Die logischen Werte selbst bewegen sich nie — border-inline-start/end bleiben bei einem linken Drawer 3px/1px —, nur ihre physische Zuordnung kippt, und genau das lässt die Regel ihrer eigenen Verankerung widersprechen. Die eine :dir(rtl)-Regel, die das Stylesheet mitliefert, auf .p-drawer-mask, ändert hier nichts: In dieser Bibliothek hat die Maske keine Kinder, die sich umkehren ließen. Die Enter- und Leave-Keyframes verschieben auf der X-Achse mit festen Vorzeichen und spiegeln sich ebenfalls nicht.';

  override readonly focusMeasuredNote: string = 'Mit der Tastatur gemessen: Nach Enter auf dem Auslöser ist document.activeElement immer noch der Auslöser, und die folgenden acht Tab-Drücke wandern über die Bedienelemente der Seite hinter der Maske, ohne je ins Panel zu gelangen. Ist der Fokus einmal drinnen, kreisen Tab und Shift+Tab zwischen den Bedienelementen des Panels und verlassen es nicht. Schließt man ein Panel, das den Fokus hält, fällt der Fokus nach draußen — auf <body> oder auf den Container, der das Panel überlebt —, nie auf den Öffner.';
}
