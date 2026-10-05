import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import type { MenuItem } from '@openng/optimus-ui/api';
import { MenubarArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './menubar-article.component';

/** German texts for the journal lines the English handlers and template bindings write. */
const LOG_DE: Record<string, string> = {
  'menu focused': 'Menü fokussiert',
  'menu blurred': 'Menü verlassen',
};

/**
 * German twin of the Menubar guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (menu models,
 * select options, journal lines) are German. Keep it in step with the English file:
 * same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs menubar`).
 */
@Component({
  selector: 'app-menubar-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'menubar'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Eine horizontale Leiste aus Menüs, gespeist aus einem Array von <code>MenuItem</code>s, mit einem zweiten
          Rendering-Zweig, der unterhalb eines Breakpoints zum Hamburger wird. Sie ist ein echtes Menü-Widget im Sinne
          von ARIA — ein Tab-Stopp, Pfeiltasten im Inneren, Untermenüs, die auf- und zugehen — und genau das ist zugleich
          ihre Stärke und der Grund, warum sie für die meiste Website-Navigation die falsche Komponente ist. Der
          Playground ist ein laufendes <code>p-menubar</code>; jedes Bedienelement unten ändert einen Input.
        </p>

        <section class="pg" aria-label="Menubar-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-shape-label">Form der Einträge</span>
                <p-select
                  [ariaLabelledBy]="'pg-shape-label'"
                  size="small"
                  [options]="shapeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgShape()"
                  (ngModelChange)="pgShape.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-autodisplay">Beim Überfahren öffnen (autoDisplay)</label>
                <p-toggleswitch
                  inputId="pg-autodisplay"
                  [ngModel]="pgAutoDisplay()"
                  (ngModelChange)="pgAutoDisplay.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-autohide">Schließen, wenn die Maus die Leiste verlässt (autoHide)</label>
                <p-toggleswitch
                  inputId="pg-autohide"
                  [ngModel]="pgAutoHide()"
                  (ngModelChange)="pgAutoHide.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-mobile">Mobilen Zweig erzwingen</label>
                <p-toggleswitch inputId="pg-mobile" [ngModel]="pgMobile()" (ngModelChange)="pgMobile.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <p-menubar
                  [model]="pgModel()"
                  [autoDisplay]="pgAutoDisplay()"
                  [autoHide]="pgAutoHide()"
                  [breakpoint]="pgBreakpoint()"
                  ariaLabel="Playground-Menü"
                  (onFocus)="log('menu focused')"
                  (onBlur)="log('menu blurred')"
                />
              </div>
              <p class="ex__note">
                Tab erreicht die Leiste genau einmal; von dort bewegen die Pfeiltasten einen virtuellen Cursor. Der
                Breakpoint ist auf einen Wert festgenagelt, der entweder immer oder nie greift, sodass der Schalter oben
                den Zweig bestimmt und nicht deine Fensterbreite.
              </p>
              <div class="journal" role="status" aria-live="polite" aria-atomic="false">
                <span class="journal__label">Protokoll</span>
                @if (journal().length === 0) {
                  <p class="journal__empty">Noch nichts — fokussiere die Leiste und drück eine Taste.</p>
                } @else {
                  <ol class="journal__list">
                    @for (line of journal(); track line.id) {
                      <li>{{ line.text }}</li>
                    }
                  </ol>
                }
              </div>
            </div>
          </div>

          <div class="pg__code">
            <div class="ex__head">
              <span class="pg__code-label">Markup</span>
              <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
                {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
            <pre class="code-block code-block--inline"><code>{{ pgCode() }}</code></pre>
          </div>
        </section>

        <h3>Die Anatomie, gerendert</h3>
        <p class="ex__note">
          Drei Ebenen, per Tastatur oder Maus geöffnet. Jede Liste, die du unten siehst — die Leiste selbst und beide
          Panels — ist dieselbe Komponenteninstanz in Rekursion, und deshalb tragen alle dieselbe Rolle.
        </p>
        <div class="ex__stage ex__stage--tall" id="fx-nested">
          <p-menubar [model]="nestedModel" breakpoint="1px" ariaLabel="Anatomie-Menü" />
        </div>
        <div class="table-wrap">
          <table>
            <caption class="sr-only">
              Teile der Menubar, ihr Element und ihr mitgeliefertes Styling
            </caption>
            <thead>
              <tr>
                <th>Klasse</th>
                <th>Element</th>
                <th>Was es ist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-menubar</code></td>
                <td>der Host <code>&lt;p-menubar&gt;</code></td>
                <td>Die Leiste: Flex-Zeile, Hintergrund, Rahmen, Radius, Padding.</td>
              </tr>
              <tr>
                <td><code>p-menubar-start</code></td>
                <td><code>&lt;div&gt;</code></td>
                <td>Wird nur gerendert, wenn ein Template <code>#start</code> existiert.</td>
              </tr>
              <tr>
                <td><code>p-menubar-button</code></td>
                <td><code>&lt;a role="button"&gt;</code></td>
                <td>Der Hamburger. <code>display: none</code>, bis die Leiste in ihrem mobilen Zweig ist.</td>
              </tr>
              <tr>
                <td><code>p-menubar-root-list</code></td>
                <td><code>&lt;ul tabindex="0"&gt;</code></td>
                <td>Der einzige Tab-Stopp und das Element, dem <code>aria-activedescendant</code> gehört.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item</code></td>
                <td><code>&lt;li role="menuitem"&gt;</code></td>
                <td>Trägt die Zustandsklassen und jedes <code>aria-*</code>, das der Eintrag hat.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item-content</code></td>
                <td><code>&lt;div&gt;</code></td>
                <td>Die Trefferfläche und die Box, die der Hintergrund für Fokus/Hover/Aktiv füllt.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item-link</code></td>
                <td><code>&lt;a tabindex="-1"&gt;</code></td>
                <td>Der Anker. Absichtlich nicht fokussierbar; das Padding sitzt hier.</td>
              </tr>
              <tr>
                <td><code>p-menubar-item-icon</code> / <code>-label</code></td>
                <td><code>&lt;span&gt;</code></td>
                <td>Aus <code>item.icon</code> und <code>item.label</code>.</td>
              </tr>
              <tr>
                <td><code>p-menubar-submenu-icon</code></td>
                <td><code>&lt;svg&gt;</code></td>
                <td>Chevron: auf der obersten Ebene nach unten, darunter nach rechts.</td>
              </tr>
              <tr>
                <td><code>p-menubar-submenu</code></td>
                <td><code>&lt;ul role="menubar"&gt;</code></td>
                <td>Das Panel. Absolut positioniert, <code>z-index: 1</code>, keine Kollisionsbehandlung.</td>
              </tr>
              <tr>
                <td><code>p-menubar-separator</code></td>
                <td><code>&lt;li role="separator"&gt;</code></td>
                <td>Aus <code>item.separator</code>. Nur innerhalb eines Untermenüs gestylt.</td>
              </tr>
              <tr>
                <td><code>p-menubar-end</code></td>
                <td><code>&lt;div&gt;</code></td>
                <td>Wird immer gerendert — mit dem Template <code>#end</code> oder mit projiziertem Inhalt.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Der mobile Zweig, auf einem Desktop-Bildschirm</h3>
        <p class="ex__note">
          Unterhalb des Breakpoints rendert dasselbe Markup anders: Die Leiste schrumpft zum Hamburger, die Root-Liste
          wird zu einem absolut positionierten Panel unter der Leiste, und Untermenüs klappen nicht mehr seitlich aus —
          sie rücken an Ort und Stelle ein, wie bei einem Akkordeon. Diese Instanz ist in diesem Zweig festgenagelt,
          damit er sichtbar ist, egal was dein Fenster tut.
        </p>
        <div class="ex__stage ex__stage--tall" id="fx-mobile">
          <p-menubar [model]="nestedModel" breakpoint="99999px" ariaLabel="Menü im mobilen Zweig" />
        </div>
        <p class="src-note">
          Solange das Panel zu ist, ist der Hamburger der Tab-Stopp; öffnest du es mit Enter, wandert der Fokus auf die
          Root-Liste, und dort lebt in beiden Zweigen das Tastaturmodell der Einträge. Hier gemessen: <kbd>ArrowRight</kbd>
          springt weiterhin zwischen den Einträgen der obersten Ebene, obwohl sie jetzt untereinander stehen, und
          <kbd>Escape</kbd> bringt den Fokus zurück auf den Hamburger, <strong>ohne das Panel zu schließen</strong> — es
          bleibt offen, und <code>aria-expanded</code> bleibt <code>true</code>.
        </p>

        <h3>Schreibrichtung</h3>
        <p class="ex__note">
          Dasselbe Modell, zweimal, nur das Attribut <code>dir</code> am Wrapper unterscheidet sich. Öffne in beiden ein
          Untermenü: Der Fluss, der End-Slot und das mobile Panel spiegeln sich; der Ausklapp-Versatz eines Panels der
          zweiten Ebene und das Chevron-Zeichen nicht.
        </p>
        <div class="ex__stage ex__stage--dir">
          <div class="dir-cell" id="fx-ltr" dir="ltr">
            <span class="dir-cell__label">dir="ltr"</span>
            <p-menubar [model]="dirModel" breakpoint="1px" ariaLabel="LTR-Menü">
              <ng-template #end><span class="dir-end">End-Slot</span></ng-template>
            </p-menubar>
          </div>
          <div class="dir-cell" id="fx-rtl" dir="rtl">
            <span class="dir-cell__label">dir="rtl"</span>
            <p-menubar [model]="dirModel" breakpoint="1px" ariaLabel="RTL-Menü">
              <ng-template #end><span class="dir-end">End-Slot</span></ng-template>
            </p-menubar>
          </div>
        </div>
        <p class="src-note">Die Zahlen beider Läufe stehen im Tab Internationalisierung (i18n).</p>

        <h3>Dieselbe Navigation ohne Menubar</h3>
        <p class="ex__note">
          Zum Vergleich: eine Landmark und eine Liste von Links. Jeder Eintrag ist ein Tab-Stopp, jeder Eintrag ist für
          einen Screenreader ein Link, die Seitensuche des Browsers findet ihn, und ein Mittelklick öffnet ihn in einem
          Tab. Nichts davon ist eine Komponente.
        </p>
        <div class="ex__stage">
          <nav class="plain-nav" aria-label="Beispiel einer schlichten Navigation">
            <ul>
              <li><a href="#fx-nested" aria-current="page">Überblick</a></li>
              <li><a href="#fx-nested">Methoden</a></li>
              <li><a href="#fx-nested">Glossar</a></li>
              <li><a href="#fx-nested">Zeitleiste</a></li>
            </ul>
          </nav>
        </div>
        <pre class="code-block"><code>{{ plainNavSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche Navigation</h3>
        <p>
          Die Frage, die hier entscheidet, ist nicht „horizontal oder vertikal“, sondern <em>was die Einträge sind</em>.
          Eine Menubar ist ein Menü aus <strong>Befehlen</strong> — die Datei/Bearbeiten-Leiste einer Anwendung.
          Bereiche einer Website sind keine Befehle; sie sind Orte, und Orte sind Links.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Du willst</th>
                <th>Greif zu</th>
                <th>Weil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Die Hauptnavigation einer Website oder Content-App</td>
                <td><code>&lt;nav&gt;</code> + eine Liste von <code>&lt;a&gt;</code></td>
                <td>
                  Jedes Ziel bleibt ein Link: fokussierbar, auffindbar, in einem neuen Tab zu öffnen, angesagt als
                  „Link“. Eine Menubar macht aus jedem ein <code>menuitem</code>, dessen Anker <code>tabindex="-1"</code>
                  hat.
                </td>
              </tr>
              <tr>
                <td>Ein Anwendungsmenü aus Befehlen, gruppiert, mit Untermenüs</td>
                <td><code>p-menubar</code></td>
                <td>
                  Das ist genau das ARIA-Menubar-Pattern: ein Tab-Stopp, Durchlaufen per Pfeiltasten, Befehle hinter
                  <code>item.command</code>.
                </td>
              </tr>
              <tr>
                <td>Parallele Ansichten eines Themas, alle auf derselben Seite</td>
                <td><code>p-tabs</code></td>
                <td>
                  Tabs besitzen je ein Panel und sagen diese Beziehung an. Eine Menubar besitzt nichts; sie löst nur aus.
                </td>
              </tr>
              <tr>
                <td>Dieselbe Hauptnavigation auf einem Smartphone</td>
                <td><code>p-drawer</code> mit dem <code>&lt;nav&gt;</code> darin</td>
                <td>
                  Ein Off-Canvas-Panel, das du steuerst, mit deinem eigenen Auslöser und deiner eigenen Fokusführung —
                  statt eines zweiten, anders funktionierenden Zweigs eines Menü-Widgets.
                </td>
              </tr>
              <tr>
                <td>Ein Menü, das an einem einzelnen Button hängt</td>
                <td><code>p-menu</code> (flach) oder <code>p-tieredmenu</code> (verschachtelt)</td>
                <td>
                  Dasselbe Eintragsmodell, dieselbe Tastaturmechanik, keine Leiste. Eine Menubar mit einem einzigen
                  Root-Eintrag ist ein Tieredmenu mit zusätzlichem Drumherum.
                </td>
              </tr>
              <tr>
                <td>Ein breites Panel mit Spalten von Links unter jedem Eintrag</td>
                <td><code>p-megamenu</code></td>
                <td>
                  Ihr Modell ist ein Raster aus Spalten; ein Untermenü der Menubar ist eine einzelne schmale Spalte mit
                  <code>12.5rem</code> Mindestbreite.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Die Rollenfrage, ehrlich beantwortet</h3>
        <p>
          Das APG-Menubar-Pattern ist für Anwendungsmenüs definiert, und es erkauft seinen einzigen Tab-Stopp, indem es
          die Einträge aus der Tab-Reihenfolge nimmt. Dieser Tausch ist richtig für Datei/Bearbeiten/Ansicht und falsch
          für einen Website-Header, und die ARIA-Spezifikation sagt das mit eigenen Worten: <code>menuitem</code> ist
          „an option in a set of choices contained by a menu“, also eine Option in einer Auswahl, die ein Menü enthält,
          kein Ziel. Websites, die es trotzdem verwenden, geben jedem Tastatur- und Screenreader-Nutzer eine Navigation
          in die Hand, die sich wie ein Menü verhält.
        </p>
        <p>
          Was die Komponente tatsächlich rendert, abgelesen aus dem Accessibility Tree: Die Leiste ist eine
          <code>menubar</code>; jeder Eintrag ist ein <code>menuitem</code>, benannt nach <code>item.label</code>; und in
          jedem steckt ein verschachtelter <code>link</code>-Knoten mit demselben Namen — ein Anker ganz ohne
          <code>href</code>, außer du hast dem Eintrag eine <code>url</code> oder einen <code>routerLink</code> gegeben,
          und so oder so mit <code>tabindex="-1"</code>. Jedes Untermenü ist ebenfalls eine <code>menubar</code>, weil die
          Rolle ein statisches Host-Binding an der rekursiven Komponente ist
          (<code>openng-optimus-ui-menubar.mjs:587</code>); ein Panel wird also als zweite Menüleiste angesagt statt als
          das Menü, das es ist.
        </p>
        <p>
          Zwei Folgen. Ein Ziel in dieser Leiste wird zweimal angesagt — einmal als Menüeintrag, einmal als der Link
          darin — und ist nur über die eigenen Pfeiltasten des Menüs erreichbar: kein Tab, keine Seitensuche, kein
          Mittelklick. Und der verschachtelte Link ist nur dem Namen nach ein Link, denn ohne <code>url</code> oder
          <code>routerLink</code> hat er keine Adresse, zu der er führen könnte. Prüf es in deinem eigenen Build: Öffne
          ein Untermenü und lies den Accessibility Tree; das Panel sollte „Menü“ sagen, und hier sagt es „Menüleiste“.
        </p>
        <p class="src-note">
          <strong>Konvention des Kits.</strong> Die Hauptnavigation ist in diesem Kit eine Landmark
          <code>&lt;nav&gt;</code> mit übersetztem <code>aria-label</code>, einem Skip-Link davor und einer
          suchgesteuerten Sitemap hinter einem Button —
          <code>src/app/components/frame/app-header.component.ts</code> ist die Referenzimplementierung (der Skip-Link
          sitzt in <code>src/app/app.component.ts</code>). Wo dort ein <code>p-menubar</code> auftaucht,
          ist es der Flex-Container des Headers, kein Menü: Sein Modell ist leer, und sein Inhalt lebt in
          <code>#start</code> und <code>#end</code>.
        </p>

        <h3>Wenn du sie als Gerüst nutzt, bring sie zum Schweigen</h3>
        <p>
          Nutzt du die Leiste rein fürs Layout — <code>#start</code> und <code>#end</code>, kein Modell —, bleibt
          trotzdem ein echtes <code>&lt;ul role="menubar" tabindex="0"&gt;</code> auf der Seite. Gemessen an so einer
          Leiste: eine Box von 0x0, keine Kinder und ein Platz in der sequenziellen Tab-Reihenfolge des Dokuments
          zwischen dem, was vor und nach dem Header steht. Es gibt keinen Input dafür, und Pass-through erreicht nur
          <em>einen Teil</em> davon.
        </p>
        <div class="table-wrap">
          <table>
            <caption class="sr-only">
              Welche Pass-through-Schlüssel an der Root-Liste bestehen bleiben
            </caption>
            <thead>
              <tr>
                <th>Schlüssel</th>
                <th>Hält?</th>
                <th>Gemessen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>tabindex: '-1'</code></td>
                <td><strong>Ja</strong></td>
                <td>
                  Die Komponente schreibt <code>tabindex</code> einmal, als statisches Attribut, also ist der
                  Pass-through-Schreibvorgang der letzte. Vom ersten Paint an vorhanden — es steht schon im
                  servergerenderten HTML —, und die Liste ist auf jedem Host aus der sequenziellen Tab-Reihenfolge.
                </td>
              </tr>
              <tr>
                <td><code>'aria-hidden': 'true'</code></td>
                <td><strong>Ja</strong></td>
                <td>
                  Nichts in der Komponente schreibt es. Gemessen auf zwei Hosts: Die leere Liste ist
                  <em>aus dem Accessibility Tree verschwunden</em> — kein Knoten, kein Name.
                </td>
              </tr>
              <tr>
                <td><code>role</code> — jeder Wert</td>
                <td><strong>Nein</strong></td>
                <td>
                  <code>role</code> ist ein Host-Binding, das die Komponente selbst durchsetzt
                  (<code>openng-optimus-ui-menubar.mjs:587</code>). Auf einem <code>OnPush</code>-Host verlieren
                  <code>'presentation'</code>, <code>'none'</code> und <code>null</code> gleichermaßen: Die Liste las sich
                  beim Laden weiterhin als <code>menubar</code>, ebenso nach einem Tab-Wechsel, einem Resize, einem
                  Scrollen und einem Klick anderswo. Nur ein Mousedown auf der Leiste selbst drehte es um. Auf einem Host
                  mit Default-Change-Detection kommt der spätere Durchlauf an — das Ergebnis hängt also von einer
                  Strategie ab, die anderswo gewählt wird.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Das verlässliche Paar ist also <code>tabindex</code> plus <code>aria-hidden</code>, und die Rolle bleibt, wo
          sie ist. Das ist auch das bessere ARIA: <code>role="presentation"</code> an einem Element mit
          <code>tabindex="-1"</code> ist ein Widerspruch, den die Spezifikation auflöst, indem sie die Rolle ignoriert.
        </p>
        <p class="dd__why">
          <strong>Nur für eine Leiste ohne Modell.</strong> <code>aria-hidden</code> an etwas, das Fokus bekommen kann,
          ist ein Fehler; hier ist es genau deshalb sicher, weil eine leere Menubar keine Einträge, keinen Hamburger und
          keinen Codepfad hat, der die Liste fokussiert. Setz es nie an eine Menubar, die tatsächlich Einträge hat.
        </p>
        <div class="ex__stage" id="fx-chrome">
          <p-menubar [model]="emptyModel" breakpoint="1px" [pt]="chromePt">
            <ng-template #start><strong class="chrome-brand">Marke</strong></ng-template>
            <ng-template #end><span class="dir-end">Bedienelemente</span></ng-template>
          </p-menubar>
        </div>
        <pre class="code-block"><code>{{ chromePtSnippet }}</code></pre>
        <p class="src-note">
          Zwei Flex-Container und eine Überschrift kosten hier weniger als eine Komponente, und sie brauchen keine
          Errata. Greif nur dann zum Pass-through, wenn die Leiste schon an ihrem Platz ist.
        </p>

        <h3>Do / Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <div class="dd__stage" id="fx-badnav">
              <p-menubar [model]="badNavModel" breakpoint="1px" ariaLabel="Bereiche" />
            </div>
            <p class="dd__why">
              Bereiche einer Website als Menüeinträge. Vier Ziele hinter einem einzigen Tab-Stopp, jedes angesagt als
              Menüeintrag, der einen Link umschließt, den man nicht per Tab erreicht, und weit und breit kein Untermenü,
              das das Widget rechtfertigen würde. Die Einträge ohne Chevron brechen außerdem das Versprechen des Patterns
              selbst: Die Pfeiltasten bewegen einen Cursor über Dinge, die keine Auswahl sind.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <nav class="plain-nav" aria-label="Do-Beispiel">
                <ul>
                  <li><a href="#fx-nested" aria-current="page">Überblick</a></li>
                  <li><a href="#fx-nested">Methoden</a></li>
                  <li><a href="#fx-nested">Glossar</a></li>
                  <li><a href="#fx-nested">Zeitleiste</a></li>
                </ul>
              </nav>
            </div>
            <p class="dd__why">
              Eine Landmark, eine Liste, vier Links, <code>aria-current="page"</code> an dem, auf dem du gerade bist. Das
              ist kleiner, es überlebt ohne JavaScript, und es ist das, was Nutzer jeder assistiven Technologie schon
              kennen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <div class="dd__stage">
              <p class="dd__why">
                <code>menuItems.push(&#123; label: 'New' &#125;)</code> — das Array verändern, das du an
                <code>[model]</code> übergeben hast.
              </p>
            </div>
            <p class="dd__why">
              <code>model</code> ist ein schlichter Setter, der den Eintragsbaum aus dem zugewiesenen Wert neu aufbaut
              (<code>openng-optimus-ui-menubar.mjs:660-663</code>). Eine Änderung an Ort und Stelle löst den Setter nie
              erneut aus, also bleibt der neue Eintrag unsichtbar, bis irgendetwas anderes den Input neu zuweist.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p class="dd__why">
                <code>model = [...menuItems, &#123; label: 'New' &#125;]</code> oder ein <code>computed()</code>, das ein
                frisches Array zurückgibt.
              </p>
            </div>
            <p class="dd__why">
              Eine neue Array-Referenz berechnet den Baum neu und hält die Schlüssel, nach denen das Tastaturmodell
              indiziert, im Einklang mit dem, was auf dem Bildschirm steht.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <div class="dd__stage">
              <p class="dd__why">
                <code>breakpoint</code> auf dem Standardwert lassen und hoffen: Bei <code>960px</code> wird die Leiste
                stillschweigend zum Hamburger, auf einem Tablet im Hochformat genauso wie auf einem Smartphone.
              </p>
            </div>
            <p class="dd__why">
              Der Umschalter ist eine Media Query, die einmal aus dem Input erzeugt wird
              (<code>openng-optimus-ui-menubar.mjs:874</code>), also muss sich der Breakpoint deines Layouts nach ihr
              richten, nicht umgekehrt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p class="dd__why">
                Setz <code>breakpoint</code> auf denselben Wert, an dem dein Stylesheet umschaltet, und geh beide Zweige
                durch: In beiden läuft derselbe Handler, aber nicht mit demselben Ergebnis — Escape schließt das mobile
                Panel nicht.
              </p>
            </div>
            <p class="dd__why">
              Den Input später zu ändern, bewirkt nichts: Der Listener wird in
              <code>onInit</code> gebaut und nie neu aufgebaut.
            </p>
          </div>
        </div>

        <h3>Kommentierter Quelltext</h3>
        <p class="ex__note">Ein Befehlsmenü, so geschrieben, wie die Komponente benutzt werden will.</p>
        <pre class="code-block"><code>{{ annotatedSource }}</code></pre>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" target="_blank" rel="noopener noreferrer"
              >W3C ARIA Authoring Practices — Menubar</a
            >
            — das Pattern, auf das sich diese Komponente beruft. Gegen seinen Abschnitt zur Tastatur ist die gemessene
            Matrix im Tab Entwicklung geprüft, Umbruch am Ende und Enter/Space inklusive.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#menuitem" target="_blank" rel="noopener noreferrer"
              >ARIA 1.2 — <code>menuitem</code></a
            >
            — „an option in a set of choices contained by a menu“. Der eine Satz, der die ganze Frage „Ist das
            Navigation?“ oben entscheidet.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#presentation" target="_blank" rel="noopener noreferrer"
              >ARIA 1.2 — <code>presentation</code></a
            >
            — warum eine Rolle <code>presentation</code> an einem fokussierbaren Element ignoriert wird, und deshalb
            versucht das Gerüst-Rezept gar nicht erst, eine zu setzen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 1.4.11 Non-text Contrast</a
            >
            — die 3:1, die Auras Fokus-Hintergrund (1,10:1), Chevron und Eintrags-Icon (2,56:1) verfehlen und die Ring,
            Chevron und Icon des Kits schaffen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 2.4.7 Focus Visible</a
            >
            — woran ein Indikator scheitert, den man nicht sieht, und der Grund, warum ein Hintergrundwechsel allein
            nicht genügt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 2.5.8 Target Size (Minimum)</a
            >
            — das Minimum von 24px, das der Optimus-Hamburger (28x28 laut Token) schafft.
          </li>
          <li>
            <a href="https://primeng.org/menubar" target="_blank" rel="noopener noreferrer">PrimeNG — Menubar</a> — die
            Upstream-API-Doku des Forks. Jeder Standardwert in diesem Guide wurde im ausgelieferten Quelltext von
            Optimus UI 2.0.2 nachgelesen, statt ihn von dort zu übernehmen.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Zwei Flächen, nicht eine</h3>
        <p>
          Die Leiste und das Untermenü-Panel sind getrennt gethemt — zwei Token-Gruppen, beide aufgelöst zu
          <code>&#123;content.background&#125;</code> —, und sie liegen auf verschiedenen Dingen: die Leiste auf dem
          Seitengrund, das Panel auf der Leiste. Jede Kontrastfrage unten wird deshalb gegen beide Flächen gestellt. Die
          Flächen und Labels sind Auras Standardpalette, in jedem Stil gleich; das Kit ergänzt zwei eigene Regeln in
          <code>src/styles.scss</code> — den einen Fokus-Ring von 2px am fokussierten Eintrag und am Hamburger sowie
          Chevron und Eintrags-Icon des Untermenüs in <code>--text-color-secondary</code> —, und ein Stil ändert den
          Radius und, über den Akzent, den Ring.
        </p>

        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura-Quelle</th>
                <th>Aufgelöst zu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>menubar.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td><code>#ffffff</code> / <code>#18181b</code></td>
              </tr>
              <tr>
                <td><code>menubar.borderColor</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td><code>#e2e8f0</code> / <code>#3f3f46</code></td>
              </tr>
              <tr>
                <td><code>menubar.padding</code> / <code>gap</code></td>
                <td>Literal</td>
                <td><code>0.5rem 0.75rem</code> / <code>0.5rem</code></td>
              </tr>
              <tr>
                <td><code>menubar.item.color</code></td>
                <td><code>&#123;navigation.item.color&#125;</code></td>
                <td><code>#334155</code> / <code>#ffffff</code></td>
              </tr>
              <tr>
                <td><code>menubar.item.focusBackground</code></td>
                <td><code>&#123;navigation.item.focus.background&#125;</code></td>
                <td><code>#f1f5f9</code> / <code>#27272a</code></td>
              </tr>
              <tr>
                <td><code>menubar.item.activeBackground</code></td>
                <td><code>&#123;navigation.item.active.background&#125;</code></td>
                <td>dieselben zwei Werte — Fokus und Aktiv sehen gleich aus</td>
              </tr>
              <tr>
                <td><code>menubar.baseItem.padding</code></td>
                <td><code>&#123;navigation.item.padding&#125;</code></td>
                <td><code>0.5rem 0.75rem</code> — oberste Ebene</td>
              </tr>
              <tr>
                <td><code>menubar.item.padding</code></td>
                <td><code>&#123;navigation.item.padding&#125;</code></td>
                <td>derselbe Wert, Untermenü-Ebene</td>
              </tr>
              <tr>
                <td><code>menubar.submenu.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td><code>#ffffff</code> / <code>#18181b</code> — identisch mit der Leiste</td>
              </tr>
              <tr>
                <td><code>menubar.submenu.shadow</code></td>
                <td><code>&#123;overlay.navigation.shadow&#125;</code></td>
                <td><code>0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1)</code></td>
              </tr>
              <tr>
                <td><code>menubar.submenu.mobileIndent</code></td>
                <td>Literal</td>
                <td><code>1rem</code> → 16px</td>
              </tr>
              <tr>
                <td><code>menubar.submenu.icon.size</code></td>
                <td><code>&#123;navigation.submenu.icon.size&#125;</code></td>
                <td><code>0.875rem</code> → 14px</td>
              </tr>
              <tr>
                <td><code>menubar.separator.borderColor</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td><code>#e2e8f0</code> / <code>#3f3f46</code></td>
              </tr>
              <tr>
                <td><code>menubar.mobileButton.size</code></td>
                <td>Literal</td>
                <td><code>1.75rem</code> → 28px, <code>border-radius: 50%</code></td>
              </tr>
              <tr>
                <td><code>menubar.mobileButton.focusRing.*</code></td>
                <td><code>&#123;focus.ring.*&#125;</code></td>
                <td>
                  Aura: <code>1px solid</code> mit <code>2px</code> Abstand in <code>&#123;primary.color&#125;</code>.
                  Ersetzt durch den einen Ring des Kits: <code>2px solid var(--primary-color-fg)</code> mit
                  <code>2px</code>
                </td>
              </tr>
              <tr>
                <td><code>menubar.submenu.icon.color</code> (Ruhe, Fokus, Aktiv)</td>
                <td><code>&#123;navigation.submenu.icon.color&#125;</code></td>
                <td>
                  Aura: <code>&#123;surface.400&#125;</code> / <code>&#123;surface.500&#125;</code>. Vom Kit in allen drei
                  Zuständen auf <code>var(--text-color-secondary)</code> umgelenkt
                </td>
              </tr>
              <tr>
                <td><code>menubar.item.icon.color</code> (Ruhe, Fokus, Aktiv)</td>
                <td><code>&#123;navigation.item.icon.color&#125;</code></td>
                <td>
                  Aura: <code>&#123;surface.400&#125;</code> / <code>&#123;surface.500&#125;</code>. Vom Kit in allen drei
                  Zuständen auf <code>var(--text-color-secondary)</code> umgelenkt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Definitionen: <code>&#64;openng/optimus-ui-themes/dist/aura/menubar/index.mjs</code>; die Hex-Werte sind
          Auras Standard-Flächenpalette (Slate hell, Zinc dunkel) aus <code>.../aura/base/index.mjs</code>, die kein
          <code>presetOverrides</code> eines visuellen Stils (<code>src/app/services/ui-styles.ts</code>) ersetzt. Die
          beiden Kit-Zeilen stammen aus <code>src/styles.scss</code>: dem Block für Chevron und Icon von
          <code>.p-menubar</code> und der einen Fokus-Ring-Liste.
        </p>

        <h3>Kontrast gegen die Fläche dahinter</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Hell</th>
                <th>Dunkel</th>
                <th>Lesart</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hintergrund der Leiste gegen die Seite dahinter</td>
                <td>messen</td>
                <td>messen</td>
                <td>
                  Hängt vom <code>--surface-ground</code> des visuellen Stils ab, das kein Aura-Token ist: Zu erwarten ist
                  etwa 1:1, also trägt der 1px-Rahmen der Leiste die Grenze.
                </td>
              </tr>
              <tr>
                <td>Eintrags-Label auf der Leiste</td>
                <td>10,35:1</td>
                <td>17,72:1</td>
                <td>Komfortabel in beiden Themes.</td>
              </tr>
              <tr>
                <td>Eintrags-Label auf dem Untermenü-Panel</td>
                <td>10,35:1</td>
                <td>17,72:1</td>
                <td>Dasselbe, weil der Panel-Hintergrund dem Hintergrund der Leiste gleicht.</td>
              </tr>
              <tr>
                <td>Untermenü-Chevron, auf der Leiste / auf dem Fokus-Hintergrund (Gate)</td>
                <td>5,21–7,78:1 / 4,76–7,11:1</td>
                <td>6,78–8,48:1 / 5,70–7,13:1</td>
                <td>
                  Das <code>--text-color-secondary</code> des Kits; Auras eigenes <code>&#123;surface.400&#125;</code>
                  lag bei 2,56:1. Das Chevron ist das einzige Zeichen dafür, dass ein Eintrag ein Menü öffnet, also trägt
                  es Bedeutung und ist keine Dekoration.
                </td>
              </tr>
              <tr>
                <td>Eintrags-Icon, auf der Leiste / auf dem Fokus-Hintergrund (Gate)</td>
                <td>5,21–7,78:1 / 4,76–7,11:1</td>
                <td>6,78–8,48:1 / 5,70–7,13:1</td>
                <td>
                  Das <code>--text-color-secondary</code> des Kits; Auras eigenes
                  <code>&#123;navigation.item.icon.color&#125;</code> lag bei 2,56:1. Auf 3:1 gehalten, damit auch ein
                  Eintrag nur mit Icon besteht.
                </td>
              </tr>
              <tr>
                <td>Fokus-Hintergrund gegen die Leiste und gegen das Untermenü-Panel</td>
                <td>1,10:1</td>
                <td>1,19:1</td>
                <td>Nur zur Information (Gate, kein Minimum) — der Ring des Kits unten ist der Indikator, nicht dieser
                  Wechsel.</td>
              </tr>
              <tr>
                <td><strong>Fokus-Ring des Kits auf dem Fokus-Hintergrund / auf der Leiste (Gate)</strong></td>
                <td><strong>4,73–16,30:1 / 5,18–17,85:1</strong></td>
                <td><strong>5,38–14,24:1 / 6,40–16,93:1</strong></td>
                <td>Jeder Akzent und jeder Stil; das Panel gleicht der Leiste, also gelten dort dieselben Zahlen.</td>
              </tr>
              <tr>
                <td>Label auf dem Fokus-Hintergrund</td>
                <td>13,35:1</td>
                <td>14,89:1</td>
                <td>Der Text bleibt lesbar. Es ist die Box darum, die man nicht erkennt.</td>
              </tr>
              <tr>
                <td>Untermenü-Panel gegen das, was dahinter liegt</td>
                <td>1,00:1</td>
                <td>1,00:1</td>
                <td>Panel über Leiste: Schatten und 1px-Rahmen sind die einzige Trennung.</td>
              </tr>
              <tr>
                <td>Trennlinie und Panel-Rahmen, auf dem Panel</td>
                <td>1,23:1</td>
                <td>1,70:1</td>
                <td>Eine Haarlinie. Gut als Dekoration, nutzlos als Struktur.</td>
              </tr>
              <tr>
                <td>Hamburger-Zeichen auf der Leiste</td>
                <td>4,76:1</td>
                <td>6,91:1</td>
                <td>Besteht.</td>
              </tr>
              <tr>
                <td>Fokus-Ring des Hamburgers auf der Leiste (Gate)</td>
                <td>5,18–17,85:1</td>
                <td>6,40–16,93:1</td>
                <td>Der eine Ring des Kits, außerhalb des 28px-Buttons, auf dem eigenen Hintergrund der Leiste.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Mit Gate markierte Zeilen werden bei jedem Build in <code>docs/generated/CONTRAST.MD</code> gemessen, Gruppe
          „menu focus“ (das Chevron, das Eintrags-Icon, der Fokus-Hintergrund, der Ring auf beiden Flächen, über jeden
          Stil, jeden Modus und jeden Akzent). Die übrigen sind aus den Aura-Standard-Hex-Werten berechnet, zu denen die
          Token-Tabelle auflöst (hell: Slate auf <code>#ffffff</code>; dunkel: Zinc auf <code>#18181b</code>) — in jedem
          visuellen Stil gleich; die Zeile Leiste gegen Seite hängt vom Stil ab und hat keine feste Zahl.
        </p>

        <h3>Der Fokus-Indikator: Auras Wechsel und der Ring des Kits</h3>
        <p>
          Im ausgelieferten Stylesheet gibt es keine Regel <code>:focus-visible</code> für Menüeinträge. Die Root-Liste
          behält den DOM-Fokus und markiert den Eintrag unter dem Tastatur-Cursor mit der Klasse <code>.p-focus</code>
          (das Modell <code>aria-activedescendant</code>), und Aura zeigt diesen Eintrag nur, indem es seinen Hintergrund
          auf <code>menubar.item.focus.background</code> wechselt — denselben Wert, den Hover nutzt, <strong>1,10:1</strong>
          gegen die Leiste im hellen Theme und <strong>1,19:1</strong> im dunklen, auf dem Panel genauso wie auf der
          Leiste.
        </p>
        <p>
          Das Kit ergänzt den echten Indikator bereits: <code>.p-menubar-item.p-focus &gt; .p-menubar-item-content</code>
          ist ein Eintrag seiner einen Fokus-Ring-Liste in <code>src/styles.scss</code> — 2px
          <code>--primary-color-fg</code>, innerhalb des Eintrags gezeichnet (Abstand -2px), weil die Einträge in einem
          abschneidenden Panel 2px auseinander sitzen, und mit <code>&gt;</code> verknüpft, damit ein fokussierter
          Elterneintrag nicht sein ganzes offenes Untermenü umringt. Er schafft 3:1 auf beiden Flächen (Tabelle oben),
          und weil Hover keinen Ring zeigt, lassen sich Fokus und Hover jetzt unterscheiden. Füg keine zweite Ring-Regel
          hinzu.
        </p>

        <h3>Geometrie</h3>
        <ul>
          <li>
            <strong>Leiste, wie die Tokens sie definieren:</strong> Padding 8px&nbsp;12px, Gap 8px, ein 1px-Rahmen und
            der Radius <code>&#123;content.border.radius&#125;</code> → <code>&#123;border.radius.md&#125;</code>, den der
            aktive visuelle Stil setzt: 0 in werkbund, 12px im Standardstil lernwerkstatt, 10px skizzenbuch, 2px
            blaupause (Aura-Standard: 6px).
          </li>
          <li>
            <strong>Leiste, wie dieses Kit sie rendert:</strong> Eine Regel in
            <code>src/app/components/frame/app-header.component.ts</code> — ohne Scope, weil diese Komponente
            <code>ViewEncapsulation.None</code> nutzt — setzt jedes <code>p-menubar</code> der App auf
            <code>border-radius: 0</code>, <code>padding: 0.4rem 1rem</code> (6.4px&nbsp;16px) und
            <code>position: relative</code>, sodass der Radius oben an einer Leiste nie sichtbar wird. Jeder Block
            <code>html.style-&lt;name&gt;</code> in <code>src/styles.scss</code> gestaltet außerdem die Header-Leiste
            (<code>.main-menubar</code>) um: kein Rahmen, aber eine Unterkante in <code>--style-outline</code>. Das
            Padding der Einträge wird nicht überschrieben.
          </li>
          <li>
            <strong>Einträge der obersten Ebene:</strong> Link-Padding 8px&nbsp;12px, Inhaltsradius
            <code>&#123;border.radius.md&#125;</code> aus <code>menubar.baseItem.*</code> — ein anderes Token-Paar als das
            der Untermenü-Einträge, deren Radius <code>&#123;border.radius.sm&#125;</code> ist (0 in werkbund;
            Aura-Standard 4px). Das Chevron misst 14x14 und wird mit <code>margin-left: auto</code> ans Ende geschoben.
          </li>
          <li>
            <strong>Untermenü-Panel:</strong> eine <code>min-width</code> von 12.5rem (200px) und kein Maximum, Padding
            4px, Gap 2px, Radius <code>&#123;border.radius.md&#125;</code>, <code>z-index: 1</code>.
          </li>
          <li>
            <strong>Auf einem schmalen Bildschirm:</strong> Unterhalb von <code>breakpoint</code> (Standard
            <code>960px</code>, einmal beim Init gelesen) wechselt die Leiste in ihren Hamburger-Zweig; darüber bricht
            eine Leiste, der die Breite ausgeht, ihre Root-Liste in eine zweite Zeile um (<code>flex-wrap: wrap</code>)
            und scrollt nie. Setz <code>breakpoint</code> auf den Wert deines eigenen Layouts.
          </li>
          <li>
            <strong>Die Positionierung ist statisch, und nichts weicht einer Kollision aus.</strong> Das Panel der
            ersten Ebene hat überhaupt keine Regel für <code>top</code>/<code>left</code> — es sitzt an seiner statischen
            Position, also ist sein Containing Block der positionierte Vorfahre, den es zufällig findet. Die zweite Ebene
            hat <code>left: 100%; top: 0</code>. Liegt die Leiste am rechten Rand des Viewports, enden beide Panels jenseits
            davon, das Dokument wächst nicht mit, um sie zu erreichen, und keines klappt um.
          </li>
          <li>
            <strong>Mobiler Zweig:</strong> Der Button misst 28x28 (das Token <code>1.75rem</code>) bei
            <code>border-radius: 50%</code> — klar über dem Minimum von 24px aus SC 2.5.8. Die Root-Liste wird zu einem
            absolut positionierten Panel in voller Breite unter der Leiste; Untermenüs werden <code>position: static</code>,
            volle Breite, mit 16px <code>padding-inline-start</code> und ohne Schatten oder Rahmen. Die Chevrons tragen hier
            den Zustand offen/geschlossen: Das Chevron eines Root-Eintrags ist im geschlossenen Zustand nicht
            transformiert und um <code>-180deg</code> gedreht, sobald sein Panel offen ist; das einer verschachtelten
            Gruppe steht geschlossen auf <code>rotate(90deg)</code> und offen auf <code>rotate(-90deg)</code>
            (<code>&#64;openng/optimus-ui-styles/dist/menubar/index.mjs:251-260</code>).
          </li>
        </ul>

        <h3>Bewegung und Forced Colors</h3>
        <p>
          Genau eine Sache ist animiert: <code>transform 0.2s</code> an den mobilen Chevrons. Die Panels werden über
          <code>display</code> umgeschaltet, also kann nichts mitten in einer Transition hängen bleiben — und die
          Hover-/Fokus-Transition der Einträge <em>läuft überhaupt nicht</em>.
        </p>
        <p class="src-note">
          Dieser letzte Teil widerspricht dem Token, und das Token ist die Falle.
          <code>menubar.transitionDuration</code> (ein Alias des semantischen <code>transition.duration</code>) löst zu
          <code>0.2s</code> auf, und die Basisregel verlangt <code>transition: background …, color …</code> an
          <code>.p-menubar-item-content</code> — aber das Preset liefert auch eine Sammelregel, die
          <code>div.p-menubar-item-content</code> unter zwei Dutzend Selektoren mit <code>transition: none</code> nennt
          (<code>&#64;openng/optimus-ui-themes/dist/aura/css/index.mjs</code>). Die höhere Spezifität gewinnt: Die
          berechnete <code>transition-property</code> ist <code>none</code> bei ausgeschalteter reduzierter Bewegung,
          während die Custom Property weiterhin <code>0.2s</code> meldet. Lies den berechneten Stil, nie das Token, bevor
          du hier etwas abstimmst.
        </p>
        <p>
          Unter Forced Colors werden die Hintergründe des Autors durch die Systempalette ersetzt, also bliebe einem
          Fokuszustand, der nur über den Hintergrund getragen wird, nichts mehr, was ihn trägt — der zweite Grund, warum
          der Ring des Kits eine Outline ist und kein stärkerer Wechsel. Anders als die Zahlen oben ist das eine
          Erwartung aus der Funktionsweise des Forced-Colors-Modus, nichts, was hier gemessen wurde.
        </p>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen ist, wird nicht
          beansprucht. <strong>Bestanden:</strong> SC 1.4.3 für die Eintrags-Labels, 10,35:1 hell / 17,72:1 dunkel auf
          der Leiste wie auf dem Panel; SC 2.1.1, wobei Home/End, das Wechseln der Ebenen, das Überspringen deaktivierter
          Einträge und Trennlinien und Tab nach draußen gemessen funktionieren; SC 1.4.11 für das Hamburger-Zeichen
          (4,76:1 / 6,91:1), für Untermenü-Chevron und Eintrags-Icon (ab 4,76:1, Gate) und für den Fokus-Ring des Kits an
          den Einträgen und am Hamburger (ab 4,73:1 auf jeder Fläche, auf die er trifft, Gate); SC 2.4.7, weil dieser
          Ring in beiden Themes gezeichnet wird und sich von Hover unterscheidet; und SC 2.5.8 für den mobilen Button
          mit 28x28px. <strong>Nicht bestanden:</strong> keines der gemessenen Kriterien, so wie das Kit es ausliefert —
          Aura allein fällt dreimal durch SC 1.4.11 (der Fokus-Wechsel mit 1,10:1, das Chevron mit 2,56:1 und das
          Eintrags-Icon mit 2,56:1), und genau das beheben die Regeln des Kits. <strong>AAA</strong> ist für diese
          Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs, mit den Standardwerten, die der Quelltext tatsächlich hat</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Was es tut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>model</code></td>
                <td><em>undefined</em></td>
                <td>
                  <code>MenuItem[]</code>. In Optimus wieder ein schlichter Setter (PrimeNG 22 hatte einen Signal-Input);
                  eine Zuweisung baut den verarbeiteten Eintragsbaum neu auf
                  (<code>openng-optimus-ui-menubar.mjs:660-663</code>). Das Array an Ort und Stelle zu verändern, bewirkt
                  nichts.
                </td>
              </tr>
              <tr>
                <td><code>breakpoint</code></td>
                <td><code>'960px'</code></td>
                <td>
                  Wird einmal in <code>matchMedia('(max-width: …)')</code> gespeist, in <code>onInit</code>
                  (<code>:787-788</code>, <code>:874</code>). Eine spätere Änderung bewirkt nichts.
                </td>
              </tr>
              <tr>
                <td><code>autoDisplay</code></td>
                <td>
                  <strong><code>true</code></strong>
                </td>
                <td>
                  Root-Untermenüs öffnen sich beim Überfahren (<code>:687</code>, Gate <code>:215</code>) — aber erst nach
                  dem ersten Mousedown oder Klick in der Leiste (<code>:929</code>, <code>:1010</code>).
                </td>
              </tr>
              <tr>
                <td><code>autoHide</code></td>
                <td><em>undefined</em> (falsy)</td>
                <td>
                  Schließt den offenen Pfad, wenn der Zeiger die Leiste verlässt. Wird einmal in <code>onInit</code> in den
                  Service gelesen (<code>:789</code>), ist also nicht reaktiv.
                </td>
              </tr>
              <tr>
                <td><code>autoHideDelay</code></td>
                <td><code>100</code></td>
                <td>
                  Millisekunden, bevor <code>autoHide</code> auslöst. Wird ebenfalls einmal in den Service gelesen
                  (<code>:790</code>).
                </td>
              </tr>
              <tr>
                <td><code>motionOptions</code></td>
                <td>—</td>
                <td>
                  <strong>Weg.</strong> Die Motion-Schicht von PrimeNG 22 ist nicht im Optimus-Fork: Das Bundle enthält
                  kein <code>pMotion</code> und keinen Input <code>motionOptions</code>. Untermenüs werden über
                  <code>display</code> umgeschaltet.
                </td>
              </tr>
              <tr>
                <td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td>
                <td><em>undefined</em></td>
                <td>
                  Landen auf der Root-Liste (<code>:1364-1365</code>). Einer der beiden ist der einzige Weg, das Menü zu
                  benennen.
                </td>
              </tr>
              <tr>
                <td><code>id</code></td>
                <td>generiert</td>
                <td>
                  Die id der Root-Liste und der Stamm jeder Eintrags-id; fällt zurück auf
                  <code>uuid('pn_id_')</code> (<code>:794</code>).
                </td>
              </tr>
              <tr>
                <td><code>autoZIndex</code> / <code>baseZIndex</code></td>
                <td><code>true</code> / <code>0</code></td>
                <td>
                  <strong>Wirkungslos.</strong> Deklariert (<code>:676</code>, <code>:681</code>) und weitergereicht
                  (<code>:1360-1361</code>), aber kein Template liest einen der beiden. Der eine Aufruf für die
                  Schichtung nimmt seinen Wert aus der globalen Konfiguration (<code>:985</code>); Desktop-Untermenüs
                  haben schlicht <code>z-index: 1</code>.
                </td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>—</td>
                <td>
                  <strong>Zurück in Optimus</strong> — PrimeNG 22 hat es entfernt, der v21-Fork deklariert es noch
                  (<code>:671</code>) und liest es in die Host-Klasse (<code>:1465</code>). Weiterhin
                  <code>&#64;deprecated</code> seit v20; nimm schlicht <code>class</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Outputs gibt es nur zwei, <code>onFocus</code> und <code>onBlur</code>, beide von der Root-Liste. Es gibt kein
          „Untermenü geöffnet“, kein „Eintrag gewählt“: Die Aktivierung eines Eintrags ist <code>item.command</code>, je
          Eintrag.
        </p>

        <h3>Welche MenuItem-Felder diese Komponente liest</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Feld</th>
                <th>Wirkung in einer Menubar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>label</code></td>
                <td>
                  Der sichtbare Text <em>und</em> das <code>aria-label</code> des Eintrags (<code>:249</code>) — ein eigenes
                  Template <code>#item</code> ändert also den angesagten Namen nicht.
                </td>
              </tr>
              <tr>
                <td><code>items</code></td>
                <td>
                  Macht ihn zu einer Gruppe: Chevron, <code>aria-haspopup="menu"</code>, <code>aria-expanded</code> und
                  eine verschachtelte Liste.
                </td>
              </tr>
              <tr>
                <td><code>command</code></td>
                <td>Wird bei Klick und bei Enter/Space mit <code>&#123; originalEvent, item &#125;</code> aufgerufen.</td>
              </tr>
              <tr>
                <td>
                  <code>routerLink</code> + <code>queryParams</code>, <code>fragment</code>, <code>state</code>, …
                </td>
                <td>
                  Wechselt in den Router-Zweig; der Anker bekommt
                  <code>routerLinkActive="p-menubar-item-link-active"</code> — eine Klasse ohne mitgelieferte Regel, also
                  gestalte sie selbst.
                </td>
              </tr>
              <tr>
                <td><code>url</code>, <code>target</code>, <code>title</code></td>
                <td>Zweig mit schlichtem Anker. Trotzdem <code>tabindex="-1"</code>.</td>
              </tr>
              <tr>
                <td><code>icon</code>, <code>iconClass</code>, <code>iconStyle</code></td>
                <td>
                  Klassenliste am Icon-Span. Es wird kein <code>aria-hidden</code> gesetzt — dekorative Icons sind dein
                  Problem.
                </td>
              </tr>
              <tr>
                <td><code>badge</code>, <code>badgeStyleClass</code></td>
                <td>
                  Rendert ein <code>p-badge</code> im Link. Der Badge-Text ist nicht Teil des zugänglichen Namens des
                  Eintrags, weil <code>aria-label</code> den Teilbaum überschreibt.
                </td>
              </tr>
              <tr>
                <td><code>separator</code></td>
                <td>
                  Rendert <code>&lt;li role="separator"&gt;</code>. Nur innerhalb eines Untermenüs gestylt — eine
                  Trennlinie zwischen Root-Einträgen ist unsichtbar.
                </td>
              </tr>
              <tr>
                <td><code>visible: false</code></td>
                <td>
                  Der Eintrag wird gar nicht gerendert und fällt aus den Zählungen <code>aria-setsize</code>/<code
                    >aria-posinset</code
                  >
                  heraus.
                </td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>
                  Wird vom Tastaturmodell übersprungen und bekommt <code>aria-disabled="true"</code> (<code>:250</code>)
                  — <strong>bleibt aber in der Menge</strong>. In einem Panel mit zwei Einträgen, dessen zweiter
                  deaktiviert ist: <code>aria-posinset="2"</code> von <code>aria-setsize="2"</code>. Nur Trennlinien sind
                  von den Zählungen ausgenommen (<code>:233-239</code>).
                </td>
              </tr>
              <tr>
                <td><code>escape</code></td>
                <td>
                  <strong>Kein Standardwert.</strong> Falsy heißt, das Label geht durch
                  <code>[innerHTML]</code> (<code>:298</code>, <code>:356</code>) — siehe Tab Internationalisierung (i18n).
                </td>
              </tr>
              <tr>
                <td><code>tooltipOptions</code></td>
                <td>
                  Der einzige Weg zu einem Tooltip. <code>item.tooltip</code> und <code>item.tooltipPosition</code>
                  existieren im Interface und werden hier <strong>nicht gelesen</strong>.
                </td>
              </tr>
              <tr>
                <td>
                  <code>id</code>, <code>style</code>, <code>styleClass</code>, <code>labelClass</code>,
                  <code>linkClass</code>, <code>automationId</code>
                </td>
                <td>Gehen direkt an das entsprechende Element durch.</td>
              </tr>
              <tr>
                <td><code>expanded</code>, <code>tabindex</code></td>
                <td>
                  <strong>Nicht gelesen.</strong> Der offene Zustand ist der eigene <code>activeItemPath</code> der
                  Komponente; die Tab-Reihenfolge ist fest.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Tastatur, Taste für Taste gemessen</h3>
        <p>
          Der Fokus landet einmal auf der Root-Liste; von dort bewegt sich ein virtueller Cursor über
          <code>aria-activedescendant</code>, und <code>document.activeElement</code> ändert sich nie. Die Tabelle unten
          zeigt, was die Tasten an einer gerenderten Leiste mit drei Ebenen getan haben. Vier Einträge weichen vom
          APG-Menubar-Pattern ab, und einer davon schlägt auf die Seite durch.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Auf einem Root-Eintrag</th>
                <th>In einem Untermenü</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Tab</code> hinein</td>
                <td colspan="2">
                  Der Cursor geht auf den ersten aktiven Eintrag. Im mobilen Zweig ist der Hamburger der Stopp, solange das
                  Panel zu ist.
                </td>
              </tr>
              <tr>
                <td><code>ArrowRight</code> / <code>ArrowLeft</code></td>
                <td>
                  Nächster / vorheriger Root-Eintrag. <strong>Kein Umlauf</strong> — an beiden Enden bleibt der Cursor
                  einfach stehen.
                </td>
                <td>
                  Rechts öffnet eine Gruppe und geht hinein, auf einem Blatt tut es nichts. Links schließt das Panel und
                  kehrt zum Elterneintrag zurück.
                </td>
              </tr>
              <tr>
                <td><code>ArrowDown</code></td>
                <td>
                  Auf einer Gruppe: öffnet das Panel und fokussiert seinen <em>ersten</em> Eintrag.
                  <strong
                    >Auf einem Eintrag ohne Untermenü: Nichts passiert, und das Event wird nicht abgebrochen — die Seite
                    scrollt.</strong
                  >
                </td>
                <td>Nächster Eintrag; Trennlinien und deaktivierte Einträge werden übersprungen. Kein Umlauf.</td>
              </tr>
              <tr>
                <td><code>ArrowUp</code></td>
                <td>
                  Auf einer Gruppe: öffnet das Panel und fokussiert seinen <em>letzten</em> Eintrag. Auf einem Blatt:
                  nichts, aber das Event <em>wird</em> abgebrochen.
                </td>
                <td>Vorheriger Eintrag; vom ersten aus verlässt es das Panel und schließt es.</td>
              </tr>
              <tr>
                <td><code>Home</code> / <code>End</code></td>
                <td>Erster / letzter Root-Eintrag.</td>
                <td>Erster / letzter Eintrag des offenen Panels.</td>
              </tr>
              <tr>
                <td><code>Enter</code> / <code>Space</code></td>
                <td>
                  Auf einer Gruppe: öffnet das Panel, <strong>lässt den Cursor aber auf dem Root-Eintrag</strong>, also
                  braucht es weiterhin eine Pfeiltaste, um hineinzukommen.
                </td>
                <td>Führt <code>item.command</code> aus oder folgt dem Link und schließt das Menü.</td>
              </tr>
              <tr>
                <td><code>Escape</code></td>
                <td colspan="2">
                  <strong>Schließt alle offenen Panels auf einmal</strong>, aus jeder Tiefe, und setzt den Cursor zurück
                  auf den Root-Eintrag. Es geht nicht eine Ebene zurück.
                </td>
              </tr>
              <tr>
                <td>ein druckbares Zeichen</td>
                <td colspan="2">
                  Springt zum nächsten Eintrag der aktuellen Ebene, dessen Label damit beginnt, mit Umlauf, und mit einem
                  Puffer von 500&nbsp;ms für die Suche nach mehreren Zeichen. Das Event wird <strong>nicht</strong>
                  abgebrochen.
                </td>
              </tr>
              <tr>
                <td><code>Tab</code> hinaus</td>
                <td colspan="2">
                  Schließt alles und geht weiter zum nächsten Element der Seite. Der Fokus kommt nie von selbst in die
                  Leiste zurück.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="src-note">
          <strong>Der mobile Zweig nutzt denselben Handler, und eine Taste verhält sich dort anders.</strong> Bei offenem
          Panel: <kbd>Escape</kbd> setzt den Fokus zurück auf den Hamburger, schließt
          das Panel aber nicht — <code>hide()</code> setzt <code>mobileActive</code> nie zurück
          (<code>:993-1002</code>), also bleibt die Liste sichtbar mit
          <code>aria-expanded="true"</code>. Schließ es aus deinem eigenen Code, wenn Escape „geschlossen“ heißen muss,
          und denk daran, dass die Pfeiltasten weiterhin eine horizontale Leiste durchlaufen, während das Panel gestapelt
          ist.
        </p>

        <h3>Templates</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Template</th>
                <th>Wo es landet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#start</code></td>
                <td>
                  Ein <code>&lt;div class="p-menubar-start"&gt;</code> vor dem Hamburger. Wird gar nicht gerendert, wenn
                  es fehlt.
                </td>
              </tr>
              <tr>
                <td><code>#end</code></td>
                <td>
                  <code>&lt;div class="p-menubar-end"&gt;</code>. Fehlt es, rendert dieselbe Box stattdessen deinen
                  projizierten Inhalt — die Box existiert also immer.
                </td>
              </tr>
              <tr>
                <td><code>#item</code></td>
                <td>
                  Ersetzt den ganzen Anker, mit dem Kontext <code>&#123; $implicit: item, root: boolean &#125;</code>.
                  Dann gehören dir Anker, Icon und Label — aber nicht das <code>aria-label</code>, das weiterhin aus
                  <code>item.label</code> kommt.
                </td>
              </tr>
              <tr>
                <td><code>#menuicon</code></td>
                <td>Ersetzt das Hamburger-Zeichen.</td>
              </tr>
              <tr>
                <td><code>#submenuicon</code></td>
                <td>
                  Ersetzt <strong>beide</strong> Chevrons — das nach unten auf der obersten Ebene und das nach rechts
                  darunter — mit einem einzigen Template. In seinem Kontext gibt es kein Root-Flag.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Alle fünf Queries sind <code>&#123; descendants: false &#125;</code>: Das Template muss ein direktes Kind von
          <code>&lt;p-menubar&gt;</code> sein. Die alte Schreibweise <code>pTemplate</code> <strong>funktioniert in
          Optimus teilweise wieder</strong>: PrimeNG 22 hatte sie gestrichen, die v21-Codebasis des Forks behält die Query
          <code>&#64;ContentChildren(PrimeTemplate)</code> (<code>:1326</code>) und sammelt alle fünf Namen in
          <code>_startTemplate</code>…<code>_itemTemplate</code> (<code>:829-849</code>). Vier davon werden als Fallbacks
          <code>x || _x</code> gelesen (<code>:1327</code>, <code>:1346</code>, <code>:1367</code>,
          <code>:1380</code>) — aber <code>_itemTemplate</code> wird nie gelesen: Die Root-Liste bindet schlicht
          <code>[itemTemplate]="itemTemplate"</code> (<code>:1356</code>), also rendert <code>pTemplate="item"</code>
          weiterhin nichts. Nimm nur die Referenznamen mit <code>#</code>.
        </p>

        <h3>Pass-through, und in welchem Zweig jeder Schlüssel existiert</h3>
        <p>
          <code>pt</code> wird in jede Untermenü-Ebene weitergereicht (<code>openng-optimus-ui-menubar.mjs:396</code>),
          also gilt ein Schlüssel, der einen Teil eines Eintrags benennt, auf <em>allen</em> Ebenen zugleich — es gibt
          keinen Selektor je Ebene. Zwei Schlüssel existieren nur in einem Zweig:
        </p>
        <ul>
          <li>
            <code>root</code> / <code>host</code> — wird ab <code>onAfterViewChecked</code> (<code>:652</code>) auf den
            Host <code>&lt;p-menubar&gt;</code> gemergt. Beide Zweige.
          </li>
          <li>
            <code>rootList</code> — das <code>&lt;ul&gt;</code>. Beide Zweige; der einzige Weg zu seiner
            <code>role</code> und seinem <code>tabindex</code>.
          </li>
          <li>
            <code>button</code>, <code>buttonIcon</code> — <strong>nur im mobilen Zweig.</strong> Das Element steht
            oberhalb des Breakpoints im DOM, aber mit <code>display: none</code>, und es wird gar nicht gerendert, wenn
            <code>model</code> leer ist. Sein <code>aria-expanded</code> ist bis zum ersten Umschalten an ein undefiniertes
            Feld gebunden, also liefert eine Leiste, die nie geöffnet wurde, den Button <em>ohne</em> das Attribut aus;
            gemessen erscheint es als <code>"false"</code> erst, nachdem das Panel einmal geschlossen wurde. Schreib es
            über <code>pt.button</code>, wenn das wichtig ist.
          </li>
          <li>
            <code>start</code> — <strong>nur wenn ein Template <code>#start</code> existiert</strong>; <code>end</code>
            ist immer vorhanden.
          </li>
          <li>
            <code>item</code>, <code>itemContent</code>, <code>itemLink</code>, <code>itemIcon</code>,
            <code>itemLabel</code>, <code>submenuIcon</code>, <code>submenu</code>, <code>separator</code>,
            <code>pcBadge</code> — jede Ebene. Die Schlüssel auf Eintragsebene erhalten ein Kontextobjekt mit
            <code>item</code>, <code>index</code>, <code>active</code>, <code>focused</code>, <code>disabled</code> und
            <code>level</code> (<code>:220-229</code>), und so erreichst du nur eine einzige Ebene.
          </li>
        </ul>

        <h3>Sackgassen in Optimus UI 2.0.2</h3>
        <ul>
          <li>
            <strong>Die Untermenü-Rolle ist fest verdrahtet, und Pass-through kann sie nicht zurücknehmen.</strong> Das
            Host-Binding <code>'[attr.role]': "'menubar'"</code> (<code>:587</code>) sitzt an der rekursiven
            Komponente, also ist jedes Untermenü ebenfalls eine Menüleiste. Auf einem <code>OnPush</code>-Host:
            <code>pt.rootList</code> mit <code>role</code> auf <code>presentation</code>, <code>none</code> oder
            <code>null</code> las sich beim Laden und bei jeder Interaktion, die die Leiste nicht berührte, weiterhin als
            <code>menubar</code> — die Komponente setzt das Binding erneut durch, und erst ihre eigene Change Detection
            entscheidet es. Andere Schlüssel sind nicht betroffen: <code>tabindex</code> und <code>aria-hidden</code>
            halten, weil nichts anderes sie schreibt. Und ein <code>pt</code>-Schlüssel gilt für alle Ebenen zugleich.
          </li>
          <li>
            <strong><code>item.to</code> existiert nicht.</strong> Die Prüfung für <code>aria-haspopup</code> liest es
            (<code>:251</code>); <code>MenuItem</code> hat kein solches Feld, also bekommt jede Gruppe
            <code>aria-haspopup="menu"</code>, Router-Links eingeschlossen.
          </li>
          <li>
            <strong>Die schlichte Schreibweise <code>id="…"</code> verdoppelt die id.</strong> Der Wert wird zur id der
            Root-Liste und zum Stamm jeder Eintrags-id, und das wörtliche Attribut bleibt <em>zusätzlich</em> am Element
            <code>&lt;p-menubar&gt;</code> stehen — gemessen: zwei Elemente im Dokument mit einer id. Als Binding
            geschrieben, <code>[id]="expr"</code>, setzt Angular den Input, ohne ein Host-Attribut auszugeben, und es gibt
            kein Duplikat. Nimm lieber das Binding, oder setz die id an einen Wrapper.
          </li>
          <li>
            <strong>Der zugängliche Name ist der rohe Label-String.</strong> Das <code>aria-label</code> am
            <code>&lt;li&gt;</code> ist wörtlich <code>item.label</code> (<code>:249</code>) — ein Label mit Markup
            wird samt Markup angesagt, egal was <code>escape</code> sagt, und ein eigenes Template <code>#item</code> kann
            das nicht ändern. Es überschreibt außerdem alles im Inneren, also ist ein Badge nie Teil des Namens.
          </li>
          <li>
            <strong>Die eigene Oberfläche von MenubarSub ist weitgehend wirkungslos.</strong> Seine Inputs
            <code>ariaLabel</code>, <code>ariaLabelledBy</code>, <code>autoZIndex</code> und <code>baseZIndex</code>
            liest sein Template nie, und seine Outputs <code>menuFocus</code>, <code>menuBlur</code> und
            <code>menuKeydown</code> werden nie ausgelöst. Die Eltern-Komponente bindet trotzdem zwei davon
            (<code>:1360-1361</code>). Ziel nicht auf sie.
          </li>
          <li>
            <strong>Das <code>aria-labelledby</code> eines Untermenüs kann ins Leere zeigen.</strong> Es verweist auf die
            id des Label-Spans des Elterneintrags (<code>:392</code>); diese id wird im Zweig mit schlichtem Anker gesetzt
            (<code>:289</code>, <code>:299</code>) und <em>nicht</em> im Router-Zweig (<code>:349-357</code>). Eine
            Gruppe, deren Elterneintrag <code>routerLink</code> nutzt, benennt ihr Panel also nach einer id, die nicht im
            Dokument steht. Prüf es wie jede Referenz: Lies das Panel im Accessibility Tree und sieh nach, ob es einen
            Namen hat.
          </li>
        </ul>

        <h3>SSR</h3>
        <p>
          Die einzige Browser-API ist <code>matchMedia</code>, und sie sitzt hinter einer Prüfung
          <code>isPlatformBrowser</code> (<code>openng-optimus-ui-menubar.mjs:871-885</code>), also lässt sich die
          Komponente prerendern. Was sie prerendert, ist immer der <strong>Desktop-Zweig</strong>: Das Signal der Media
          Query startet mit <code>false</code> und wird auf dem Client gefüllt. Gemessen an der Serverantwort für eine
          Leiste, die im mobilen Zweig festgenagelt ist — das Root-Element trägt <code>p-menubar</code> und nicht
          <code>p-menubar-mobile</code>, also zeichnet sich ein schmaler Client nach der Hydration in den Hamburger um.
        </p>
        <p class="src-note">
          Die generierte <code>id</code> ist ein <code>uuid('pn_id_')</code> je Instanz
          (<code>:794</code>), auf jeder Plattform unabhängig erzeugt, also teilen Server-Render und Client sie nicht.
          Nichts außerhalb der Komponente darf auf sie verweisen — setz
          <code>id</code> selbst, wenn du einen stabilen Griff brauchst.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>☐ Die Einträge sind wirklich Befehle. Sind sie Ziele, ist das die falsche Komponente.</li>
          <li>
            ☐ <code>ariaLabel</code> oder <code>ariaLabelledBy</code> ist gesetzt und übersetzt — ohne das hat die
            Menüleiste keinen Namen.
          </li>
          <li>☐ Jeder Eintrag hat ein <code>label</code>; ein Eintrag nur mit Icon hat überhaupt keinen zugänglichen Namen.</li>
          <li>
            ☐ <code>escape</code> passend zum Katalog gesetzt — reiner Text heißt <code>escape: true</code> an jedem
            Eintrag.
          </li>
          <li>
            ☐ <code>breakpoint</code> passt zum Breakpoint deines eigenen Layouts, und beide Zweige wurden mit der
            Tastatur durchlaufen.
          </li>
          <li>
            ☐ Die Leiste ist nicht der einzige Weg zu irgendetwas dahinter: Ein geschlossenes Untermenü ist für die
            Seitensuche unsichtbar, und kein Eintrag lässt sich in einem neuen Tab öffnen.
          </li>
          <li>
            ☐ Keine eigene Fokus-Regel an den Einträgen — der Ring des Kits markiert den Eintrag <code>.p-focus</code>
            bereits auf Leiste und Panel (ab 4,73:1); eine zweite Regel würde davon abdriften.
          </li>
          <li>
            ☐ Kein Untermenü sitzt so nah an einem Rand des Viewports, dass es abgeschnitten wird: Nichts in dieser
            Komponente positioniert neu.
          </li>
          <li>☐ Kein Markup in irgendeinem <code>label</code> — es landet wörtlich im zugänglichen Namen.</li>
          <li>☐ <code>class</code> — <code>styleClass</code> kompiliert in Optimus wieder, bleibt aber veraltet.</li>
          <li>
            ☐ Im Accessibility Tree des Browsers prüfen: Die Leiste ist benannt, Einträge werden mit dem Label angesagt,
            das du übersetzt hast, und du hast entschieden, dass „Menüleiste“ das ist, was ein Untermenü sagen soll.
          </li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Ein Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), das die beiden strukturellen Fakten oben festschreibt: Die
          Root-Liste ist der einzige Tab-Stopp und trägt den Namen, und ein Untermenü-Panel wird als zweite
          <code>menubar</code> gerendert statt als Menü.
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Ein String aus der Bibliothek, alles andere von dir</h3>
        <p>
          Der zugängliche Name des Hamburgers ist
          <code>config.translation.aria.navigation</code>, Standard
          <code>'Navigation'</code> (<code>openng-optimus-ui-config.mjs:187</code>). Das ist der einzige String, den
          <code>p-menubar</code> aus der Übersetzungskonfiguration von Optimus nimmt, er existiert nur im mobilen Zweig,
          und er ist über keinen Input erreichbar — setz ihn global, oder überschreib das <code>aria-label</code> des
          Elements über <code>pt.button</code>.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Alles andere — Eintrags-Labels, der eigene Name des Menüs, Badge-Text — kommt aus deinem Modell. Weil
          <code>model</code> seinen Eintragsbaum nur bei einer Zuweisung neu aufbaut, muss ein Sprachwechsel ein
          <em>neues Array</em> erzeugen: Ein
          <code>computed()</code> über den Übersetzungsservice tut das; ein Feld, das einmal im Konstruktor zugewiesen
          wird, tut es nicht, und die Leiste behält die Sprache, in der sie entstanden ist.
        </p>

        <h3>Labels sind HTML, solange du nichts anderes sagst</h3>
        <p>
          <code>MenuItem.escape</code> tut, was sein Name sagt — und es hat <strong>keinen Standardwert</strong>, also
          gewinnt der falsy-Zweig, und ein nicht gesetztes Label geht durch <code>[innerHTML]</code>
          (<code>openng-optimus-ui-menubar.mjs:298</code>). Mit demselben String in zwei Einträgen: Nicht gesetzt, wird
          das Label echtes Markup — ein Kind <code>&lt;b&gt;</code> mit font-weight 700, und <code>&amp;amp;</code> wird
          zu <code>&amp;</code> dekodiert. Mit <code>escape: true</code> wird es wörtlich ausgegeben, Entities und Tags
          inklusive.
        </p>
        <div class="ex__stage ex__stage--tall" id="fx-escape">
          <p-menubar [model]="escapeModel" breakpoint="1px" ariaLabel="Escape-Demo" />
        </div>
        <p class="ex__note">
          Beide Einträge tragen denselben Label-String. Der erste lässt
          <code>escape</code> ungesetzt; der zweite setzt <code>escape: true</code>.
        </p>
        <p>
          Der Sanitizer von Angular entfernt Skripte, also ist das keine Lücke für Injection — es ist eine Frage der
          Korrektheit, und welche Einstellung richtig ist, hängt davon ab, was dein Katalog speichert.
          <strong>Katalog mit reinem Text — der Normalfall: Setz <code>escape: true</code></strong>
          an jedem Eintrag, und ein Label mit <code>&amp;</code> oder <code>&lt;</code> zeigt genau diese Zeichen.
          <strong>Katalog mit kodierten Entities: Lass es ungesetzt</strong> und nimm hin, dass jedes verirrte Tag in
          einer Übersetzung zu lebendigem Markup wird. Was du nicht tun darfst, ist beides zu mischen, denn dann liest
          sich derselbe Eintrag in der Menubar anders als überall sonst in der App.
        </p>

        <h3>Länge</h3>
        <ul>
          <li>
            Die Root-Liste hat <code>flex-wrap: wrap</code>, also bekommt eine zu schmale Leiste eine zweite Zeile, statt
            zu scrollen — und die Höhe der Leiste ändert sich mit der Sprache. Nichts wird abgeschnitten.
          </li>
          <li>
            Ein Untermenü-Panel hat <code>min-width: 12.5rem</code> und kein Maximum: Ein langer Eintrag verbreitert das
            ganze Panel, und ein Panel, das über den Rand des Viewports hinauswächst, wird nicht zurückgeschoben.
          </li>
          <li>
            Im mobilen Zweig ist das Panel <code>width: 100%</code> der Leiste, also brechen lange Labels dort stattdessen
            um. Prüf die Sprache mit den längsten Wörtern, nicht mit dem längsten Satz.
          </li>
        </ul>

        <h3>RTL</h3>
        <p>
          Gemessen an zwei identischen Menubars, die sich nur in <code>dir</code> unterscheiden, mit je einem offenen
          Untermenü der zweiten Ebene. Der Großteil der Leiste spiegelt sich; das Ausklapp-Panel nicht.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was</th>
                <th>Spiegelt sich</th>
                <th>Gemessen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Reihenfolge der Root-Einträge</td>
                <td>Ja</td>
                <td>Der erste Eintrag wandert vom linken an den rechten Rand, und die übrigen folgen.</td>
              </tr>
              <tr>
                <td>Der Slot <code>#end</code></td>
                <td>Ja</td>
                <td>
                  Sein Auto-Margin dreht sich um: Aus <code>margin-left: 188.7px</code> wird
                  <code>margin-right: 188.7px</code> — dieselbe Box, andere Seite.
                </td>
              </tr>
              <tr>
                <td>Panel der ersten Ebene</td>
                <td>Ja</td>
                <td>
                  Es hat keine Positionierungsregel und folgt seiner statischen Position, also richtet es sich in beiden
                  Richtungen an der Startkante des Eintrags aus.
                </td>
              </tr>
              <tr>
                <td>Position des Untermenü-Chevrons</td>
                <td>Ja</td>
                <td>Das Auto-Margin dreht sich genauso um, also bleibt es am Inline-Ende seiner Zeile.</td>
              </tr>
              <tr>
                <td>Chevron der obersten Ebene</td>
                <td>entfällt</td>
                <td>Es zeigt nach unten. Nichts zu spiegeln, und nichts bewegt sich.</td>
              </tr>
              <tr>
                <td><strong>Panel der zweiten Ebene</strong></td>
                <td><strong>Nein</strong></td>
                <td>
                  Seine Regel ist das physische <code>left: 100%</code> ohne richtungsbewusstes Gegenstück. Gemessen:
                  berechnetes <code>left: 190px</code> in <em>beiden</em> Richtungen, also beginnt das Panel so oder so an
                  der <em>physischen</em> rechten Kante des Elterneintrags. In LTR ist das vorwärts, weg vom
                  Eltern-Panel. In RTL ist es rückwärts: Das Ausklapp-Panel überlappt die rechte Kante des Eltern-Panels
                  um 5px, und die restlichen 195px hängen außerhalb davon.
                </td>
              </tr>
              <tr>
                <td><strong>Chevron-Zeichen</strong></td>
                <td><strong>Nein</strong></td>
                <td>
                  Es bleibt auf jeder Ebene das nach rechts zeigende Icon, also zeigt es in RTL von der Leserichtung weg.
                </td>
              </tr>
              <tr>
                <td>Mobiles Panel</td>
                <td>Identisch</td>
                <td>Es hat die volle Breite der Leiste, also messen beide Richtungen dieselbe Box.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zum Nachstellen: Render dasselbe Modell unter <code>dir="rtl"</code> und <code>dir="ltr"</code>, öffne in
          beiden ein Untermenü der zweiten Ebene und vergleich <code>getBoundingClientRect()</code> des Panels mit dem
          seines Elterneintrags.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Abgeglichen mit der letzten Fokus-Runde: Das Eintrags-Icon ist in allen
            drei Zuständen <code>--text-color-secondary</code> und im Gate „menu focus“ geprüft; der bedingte Hinweis zu
            SC 1.4.11 ist weg.
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Der fokussierte Eintrag
            und der Hamburger tragen den einen 2px-Ring des Kits, das Untermenü-Chevron ist
            <code>--text-color-secondary</code>; beides zitiert aus CONTRAST.MD „menu focus“, und die zwei Verstöße gegen
            SC 1.4.11 sind nach „vom Kit behoben“ gewandert.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile neu geprüft. Design:
            Farben als Auras Standardpalette gekennzeichnet (kein Stil überschreibt sie), die Zeilen für Seitengrund und
            akzentabhängige Werte mit „messen“ markiert; der Fokus-Ring folgt <code>&#123;primary.color&#125;</code>,
            Radien folgen dem aktiven Stil; die Header-Regel des Kits ist in <code>app-header.component.ts</code> zitiert;
            eine ausdrückliche Aussage zu schmalen Bildschirmen. Neun veraltete Zeilenverweise korrigiert
            (<code>:249</code>, <code>:250</code>, <code>:298</code>, <code>:392</code>, <code>:587</code>,
            <code>:652</code>, <code>:794</code>, <code>:993-1002</code>, <code>:1360-1361</code>); Messmarker zur
            Build-Version entfernt; Historie mit dem Neuesten zuerst; Doku auf das Byte-Ziel gekürzt.
          </li>
          <li>
            <strong>v0.5</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014): Jeder Zeilenverweis gegen
            die Optimus-Bundles neu hergeleitet. Vier Aussagen kehrten zu ihrer v21-Form zurück — <code>model</code> ist
            ein schlichter Setter, kein Signal-Input; <code>styleClass</code> existiert und wird in die Host-Klasse
            gelesen; <code>pTemplate</code> wird wieder eingesammelt (auch wenn <code>pTemplate="item"</code> weiterhin
            nie gelesen wird); und <code>motionOptions</code>/<code>pMotion</code> sind mit der Motion-Schicht
            verschwunden, also schalten Panels über <code>display</code>. Die Geometrie steht wieder auf Aura-2.x-Tokens:
            Leiste und Einträge 8x12px, mobiler Button 28px, mobiler Einzug 16px; die Farb-Tokens lösen zu denselben
            Werten auf, also gelten die Kontrastzahlen weiter. Browser-Messungen wurden nicht wiederholt und bleiben mit
            „measured (21)“ markiert.
          </li>
          <li>
            <strong>v0.4</strong> — 24.08.2026 — Gegen PrimeNG 22.1 (Aura 3.0) neu geprüft: alle Zeilenverweise neu
            hergeleitet; <code>model</code> ist ein Signal-Input mit einem Eintragsbaum aus <code>computed()</code>;
            <code>styleClass</code> und der alte Weg über <code>pTemplate</code> wurden entfernt; <code>motionOptions</code>
            und die Untermenü-Animation über die Motion-Schicht sind neu; der Escape-Fehler im mobilen Zweig, die
            Pfeiltasten ohne Umlauf und das Durchschlagen von ArrowDown als Seiten-Scroll sind jetzt am Quelltext
            bestätigt. Aura-3.0-Geometrie: Leiste 6x10px, Einträge 4x10px, mobiler Button 24px (jetzt genau das Minimum
            von SC 2.5.8), mobiler Einzug 14px; Farb-Tokens unverändert, also gelten alle Kontrastzahlen weiter.
            Browser-Messungen, die nicht wiederholt wurden, sind mit „measured (21)“ markiert.
          </li>
          <li>
            <strong>v0.3</strong> — 20.08.2026 — Zusammenfassung des WCAG-2.2-Status im Tab Design ergänzt: gemessene
            Kriterien zusammengefasst als bestanden / nicht bestanden / bedingt, nicht gemessene Kriterien ausdrücklich
            nicht beansprucht. TestBed-Snippet im Tab Entwicklung ergänzt.
          </li>
          <li>
            <strong>v0.2</strong> — 30.07.2026 — Das Gerüst-Rezept nennt jetzt die beiden Pass-through-Schlüssel, die
            halten, und sagt, warum <code>role</code> nicht dazugehört; ein Abschnitt Quellen; und Korrekturen an den
            Aussagen zu Bewegung, <code>autoZIndex</code>, deaktivierten Einträgen in der Menge, Geometrie der Leiste,
            RTL-Überlappung und mobilen Chevrons.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erster Guide: die Entscheidungstabelle zur Navigation und die
            Rollenfrage, beantwortet aus dem Accessibility Tree, die vollständige Oberfläche aus Inputs und
            <code>MenuItem</code> mit den Standardwerten des Quelltexts, eine Tastaturmatrix, Taste für Taste gemessen,
            die Aura-Token-Kette mit Kontrast je Fläche und Theme in beiden Themes, der Befund zum Fokus-Indikator, der
            mobile Zweig und seine Pass-through-Wege, das Verhalten von <code>escape</code>, ein gemessenes RTL-Ergebnis
            und die kanonische Agent-Doku.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class MenubarArticleDeComponent extends MenubarArticleComponent {
  /** The template's (onFocus)/(onBlur) bindings pass English journal lines; show them in German. */
  override log(text: string): void {
    super.log(LOG_DE[text] ?? text);
  }

  override readonly shapeOptions = [
    { label: 'Nur Labels', value: 'plain' },
    { label: 'Icons, ein Badge, eine Trennlinie', value: 'rich' },
    { label: 'Mit einem deaktivierten Eintrag', value: 'disabled' },
  ];

  override readonly pgModel = computed<MenuItem[]>(() => {
    const shape = this.pgShape();
    const rich = shape === 'rich';
    const file: MenuItem[] = [
      { label: 'Neu', escape: true, icon: rich ? 'pi pi-plus' : undefined, command: () => this.log('Befehl: Neu') },
      {
        label: 'Öffnen',
        escape: true,
        icon: rich ? 'pi pi-folder-open' : undefined,
        command: () => this.log('Befehl: Öffnen'),
      },
      ...(rich ? [{ separator: true } as MenuItem] : []),
      {
        label: 'Exportieren',
        escape: true,
        items: [
          { label: 'Als Markdown', escape: true, command: () => this.log('Befehl: Exportieren / Markdown') },
          { label: 'Als JSON', escape: true, command: () => this.log('Befehl: Exportieren / JSON') },
        ],
      },
    ];
    return [
      { label: 'Datei', escape: true, icon: rich ? 'pi pi-file' : undefined, items: file },
      {
        label: 'Bearbeiten',
        escape: true,
        icon: rich ? 'pi pi-pencil' : undefined,
        items: [
          { label: 'Rückgängig', escape: true, command: () => this.log('Befehl: Rückgängig') },
          {
            label: 'Wiederholen',
            escape: true,
            disabled: shape === 'disabled',
            command: () => this.log('Befehl: Wiederholen'),
          },
        ],
      },
      {
        label: 'Hilfe',
        escape: true,
        badge: rich ? '2' : undefined,
        command: () => this.log('Befehl: Hilfe'),
      },
    ];
  });

  override readonly nestedModel: MenuItem[] = [
    {
      label: 'Datei',
      escape: true,
      icon: 'pi pi-file',
      items: [
        { label: 'Neu', escape: true, icon: 'pi pi-plus' },
        { separator: true },
        {
          label: 'Exportieren',
          escape: true,
          items: [
            { label: 'Als Markdown', escape: true },
            { label: 'Als JSON', escape: true },
            { label: 'Als druckbare Seite', escape: true },
          ],
        },
      ],
    },
    {
      label: 'Bearbeiten',
      escape: true,
      icon: 'pi pi-pencil',
      items: [
        { label: 'Rückgängig', escape: true },
        { label: 'Wiederholen', escape: true, disabled: true },
      ],
    },
    { label: 'Hilfe', escape: true, badge: '2' },
  ];

  override readonly dirModel: MenuItem[] = [
    {
      label: 'Menü',
      escape: true,
      items: [
        {
          label: 'Untermenü',
          escape: true,
          items: [
            { label: 'Blatt eins', escape: true },
            { label: 'Blatt zwei', escape: true },
          ],
        },
        { label: 'Einfacher Eintrag', escape: true },
      ],
    },
    { label: 'Zweites', escape: true },
  ];

  /** The same label twice: once with `escape` unset, once with it set. */
  protected override readonly escapeLabel: string = 'Werkzeuge &amp; <b>Beta</b>';

  /** Rebuilt here: the base field copied the English label at construction. */
  override readonly escapeModel: MenuItem[] = [{ label: this.escapeLabel }, { label: this.escapeLabel, escape: true }];

  override readonly badNavModel: MenuItem[] = [
    { label: 'Überblick', escape: true },
    { label: 'Methoden', escape: true },
    { label: 'Glossar', escape: true },
    { label: 'Zeitleiste', escape: true },
  ];
}
