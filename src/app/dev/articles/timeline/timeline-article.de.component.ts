import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TimelineArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './timeline-article.component';

/**
 * German twin of the Timeline guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (select
 * option labels, the list's accessible name, the demo events) are German. Keep it
 * in step with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs timeline`).
 */
@Component({
  selector: 'app-timeline-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'timeline'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Eine Timeline ist eine Schiene: ein Marker je Eintrag, ein Verbinder dazwischen und dein Inhalt daneben. Das
          ist die ganze Komponente — ein <code>&#64;for</code> über <code>value</code>, drei Boxen je Ereignis, ein
          Stylesheet. Sie hat keine Rolle, keinen Namen, kein Tastaturmodell und keinen Breakpoint. Der Playground
          unten ist eine echte <code>p-timeline</code>; die Controls ändern die beiden Inputs, die über ihre Geometrie
          entscheiden.
        </p>

        <section class="pg" aria-label="Playground für das Timeline-Layout">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-layout-label">layout</span>
                <p-select
                  [ariaLabelledBy]="'pg-layout-label'"
                  size="small"
                  [options]="layoutOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgLayout()"
                  (ngModelChange)="pgLayout.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-align-label">align</span>
                <p-select
                  [ariaLabelledBy]="'pg-align-label'"
                  size="small"
                  [options]="alignOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgAlign()"
                  (ngModelChange)="pgAlign.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-opp">Gegenüberliegenden Slot füllen</label>
                <p-toggleswitch inputId="pg-opp" [ngModel]="pgOpposite()" (ngModelChange)="pgOpposite.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-marker">Eigener Marker</label>
                <p-toggleswitch inputId="pg-marker" [ngModel]="pgMarker()" (ngModelChange)="pgMarker.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-list">Listen-Semantik über pt</label>
                <p-toggleswitch inputId="pg-list" [ngModel]="pgList()" (ngModelChange)="pgList.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau — die Root-Klasse ist das, was die Controls wirklich ändern</span>
              <div class="pg__stage">
                <!-- The component is OnPush and its slots are content queries: a slot template switched
                     on after content-init is not guaranteed to render. Re-creating the timeline per slot
                     combination keeps the demo reliable; in your own code keep slot templates unconditional. -->
                @for (key of [pgSlotKey()]; track key) {
                  <p-timeline
                    class="demo-tl"
                    [value]="events"
                    [layout]="pgLayout()"
                    [align]="pgAlign()"
                    [pt]="pgList() ? listPt : emptyPt"
                  >
                    @if (pgOpposite()) {
                      <ng-template #opposite let-event>
                        <time class="demo-time" [attr.datetime]="event.iso">{{ event.year }}</time>
                      </ng-template>
                    }
                    @if (pgMarker()) {
                      <ng-template #marker let-event>
                        <span class="demo-marker"><span aria-hidden="true">{{ event.glyph }}</span></span>
                      </ng-template>
                    }
                    <ng-template #content let-event>
                      <h4 class="demo-h">{{ event.title }}</h4>
                      <p class="demo-p">{{ event.summary }}</p>
                    </ng-template>
                  </p-timeline>
                }
              </div>
              <p class="pg__read">
                Root-Klasse: <code>{{ pgRootClass() }}</code>
              </p>
            </div>
          </div>
        </section>
        <p class="src-note">
          Die Anzeige ist so zusammengesetzt, wie die Komponente sie zusammensetzt: <code>'p-timeline p-component'</code>,
          dann <code>'p-timeline-' + align</code>, dann <code>'p-timeline-' + layout</code>, aus der Classes-Map in
          <code>openng-optimus-ui-timeline.mjs</code> (2.0.2).
        </p>

        <h3>Was ein Ereignis rendert</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Das DOM eines einzelnen Ereignisses, von außen nach innen
            </caption>
            <thead>
              <tr>
                <th>Element</th>
                <th>Klasse</th>
                <th>Gerendert</th>
                <th>Trägt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Host</td>
                <td><code>p-timeline p-component p-timeline-&lt;align&gt; p-timeline-&lt;layout&gt;</code></td>
                <td>einmal</td>
                <td>Flex-Spalte, dazu <code>data-p</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event</code></td>
                <td>je Eintrag</td>
                <td>Flex-Zeile, <code>min-height</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-opposite</code></td>
                <td><strong>immer</strong>, auch leer</td>
                <td><code>flex: 1</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-separator</code></td>
                <td>je Eintrag</td>
                <td><code>flex: 0</code>, Spalte</td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-marker</code></td>
                <td>nur ohne <code>#marker</code>-Template</td>
                <td>leer; gezeichnet von zwei Pseudo-Elementen</td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-connector</code></td>
                <td>bei jedem Eintrag außer dem letzten</td>
                <td><code>flex-grow: 1</code></td>
              </tr>
              <tr>
                <td><code>div</code></td>
                <td><code>p-timeline-event-content</code></td>
                <td>je Eintrag</td>
                <td><code>flex: 1</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Struktur aus dem Inline-Template von <code>openng-optimus-ui-timeline.mjs</code> (2.0.2), Klassennamen aus
          dessen Classes-Map; die Flex-Werte aus <code>&#64;openng/optimus-ui-styles/dist/timeline/index.mjs</code>.
        </p>

        <h3>Die Hälfte, um die niemand gebeten hat</h3>
        <p>
          Schalte oben <em>Gegenüberliegenden Slot füllen</em> aus, und das Layout ändert sich nicht: Die
          gegenüberliegende Box ist noch da, immer noch <code>flex: 1</code>, nur leer. Bei
          <code>align="alternate"</code> ist das das Feature — dadurch spiegeln sich die beiden Seiten. Bei
          <code>align="left"</code> ist es die halbe Breite für nichts, und die Lösung ist ein Pass-through, kein
          fehlendes Template:
        </p>
        <pre class="code-block"><code>{{ oppositeFixSnippet }}</code></pre>

        <h3>Unterhalb des Breakpoints</h3>
        <p>
          Es gibt keine Variante für schmale Bildschirme zu zeigen, weil es keine gibt: Das Preset enthält keine Media
          Query, und die Komponente nimmt kein Breakpoint-Input. Was ein Aufrufer tun kann, ist <code>align</code> aus
          seiner eigenen Query umzuschalten; das behält eine Komponente und ein DOM:
        </p>
        <pre class="code-block"><code>{{ responsiveSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Die meisten Chronologien in diesem Kit sollten keine <code>p-timeline</code> sein. Zwei Kit-Komponenten decken
          schon die Formen ab, die in Portal-Inhalten wiederkehren, und jede von ihnen liefert die Semantik mit, die
          diese hier nicht hat. Greif zur Bibliothekskomponente, wenn du die Chronologie-Seite selbst baust.
        </p>

        <h3>Welche Schiene für welche Aufgabe</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Form</th>
                <th>Nimm</th>
                <th>Warum nicht <code>p-timeline</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eine statische Liste datierter Ereignisse in einem Artikel</td>
                <td><code>app-timeline</code></td>
                <td>Sie liefert <code>role="list"</code> / <code>role="listitem"</code> und ein <code>headingLevel</code>-Input; du müsstest beides von Hand nachbauen.</td>
              </tr>
              <tr>
                <td>Eine Jahresschiene, aus der der Leser Einträge auswählt</td>
                <td><code>app-interactive-timeline</code></td>
                <td>Die Einträge sind Buttons mit <code>aria-pressed</code>; <code>p-timeline</code> hat überhaupt kein Interaktionsmodell.</td>
              </tr>
              <tr>
                <td>Schritte durch den eigenen Ablauf der App</td>
                <td><code>p-steps</code> / <code>p-stepper</code></td>
                <td>Die tragen den Zustand des aktuellen Schritts; eine Timeline hat keine Vorstellung davon, „wo du gerade bist“.</td>
              </tr>
              <tr>
                <td>Datensätze, Feld für Feld verglichen</td>
                <td><code>p-table</code></td>
                <td>Ein Vergleich braucht Spalten und Sortierung, keine Schiene.</td>
              </tr>
              <tr>
                <td>Eine ganzseitige Chronologie, die du selbst gestaltest</td>
                <td><code>p-timeline</code></td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Oberflächen der Kit-Komponenten aus ihren Komponenten-Quellen gelesen; die Alternativen aus der Bibliothek
          aus ihren ausgelieferten Bundles von Optimus UI 2.0.2.
        </p>

        <h3>Der Slot-Vertrag</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Query</th>
                <th>Kontext</th>
                <th>Wenn er fehlt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#content</code></td>
                <td><code>ContentChild('content', &#123; descendants: false &#125;)</code></td>
                <td><code>$implicit</code> = der Eintrag</td>
                <td>eine leere Content-Box, trotzdem <code>flex: 1</code></td>
              </tr>
              <tr>
                <td><code>#opposite</code></td>
                <td><code>ContentChild('opposite', &#123; descendants: false &#125;)</code></td>
                <td><code>$implicit</code> = der Eintrag</td>
                <td>eine leere Box, die trotzdem die halbe Zeile einnimmt</td>
              </tr>
              <tr>
                <td><code>#marker</code></td>
                <td><code>ContentChild('marker', &#123; descendants: false &#125;)</code></td>
                <td><code>$implicit</code> = der Eintrag</td>
                <td>der Punkt des Presets, gezeichnet mit zwei Pseudo-Elementen</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Query-Optionen und die Template-Outlets aus <code>openng-optimus-ui-timeline.mjs</code> (2.0.2); der Weg über
          <code>pTemplate="content|opposite|marker"</code> löst über dieselben Felder auf, per
          <code>PrimeTemplate</code>-Content-Query.
        </p>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Slot-Template in einem Wrapper</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ slotBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Die Slot-Queries sind <code>descendants: false</code>. Ein Element tiefer, und das Template wird nie
              gefunden: kein Fehler, keine Warnung, nur der Standardpunkt und eine leere Content-Box.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein direktes Kind, die Bedingung innen</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ slotGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Das Template bleibt ein direktes Kind von <code>&lt;p-timeline&gt;</code>; alles Bedingte lebt darin, wo
              es ganz normal neu ausgewertet wird.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Kategorie als Markerfarbe</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ colorBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Der Marker ist eine leere Box ohne Text. Ein Leser, der die Farbtöne nicht unterscheiden kann, bekommt
              überhaupt keine Kategorie — SC 1.4.1.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Farbe plus ein Textträger</span>
            <div class="dd__stage">
              <pre class="code-block code-block--inline"><code>{{ colorGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Der Farbton bleibt als schneller visueller Index; die Kategorie selbst wird aus dem Inhalt gelesen, wo
              assistive Technik sie erreicht.
            </p>
          </div>
        </div>

        <h3>Eine Referenzimplementierung</h3>
        <p>
          Die Chronologie-Seite des Kits ist das Muster zum Abschauen: eine einzelne <code>p-timeline</code> mit
          <code>align="alternate"</code> für breite Viewports, eine von Hand gebaute einspaltige Liste für schmale und
          eine Media Query, die genau eine davon zeigt. Zwei DOM-Bäume sind der Preis einer Komponente ohne eigenes
          responsives Verhalten.
        </p>

        <h3>Quellen</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#list" rel="noopener noreferrer" target="_blank">
              WAI-ARIA 1.2 — <code>list</code> / <code>listitem</code></a
            >
            — die Struktur, die die Komponente weglässt, und die <code>pt</code> zurückbringen kann.
          </li>
          <li>
            <a href="https://www.w3.org/TR/css-flexbox-1/#order-accessibility" rel="noopener noreferrer" target="_blank">
              CSS Flexbox 1 — Reordering and Accessibility</a
            >
            — die eigene Regel der Spezifikation zum visuellen Umordnen, und mehr tut <code>align="alternate"</code>
            nicht.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html" rel="noopener noreferrer" target="_blank">
              WCAG 2.2 — SC 1.3.2 Meaningful Sequence</a
            >
            — das Kriterium, das ein abwechselndes Layout erfüllen muss.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" rel="noopener noreferrer" target="_blank">
              WCAG 2.2 — SC 1.4.1 Use of Color</a
            >
            — warum ein farbcodierter Marker einen zweiten Träger braucht.
          </li>
          <li>
            <a href="https://optimus.openng.org/timeline" rel="noopener noreferrer" target="_blank">Optimus UI — Timeline</a>
            — die API-Seite des Herstellers; jede Aussage auf dieser Seite wurde gegen den ausgelieferten Quelltext von
            2.0.2 nachgeprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Alles Visuelle an einer Timeline kommt aus einem Stylesheet und einer Token-Datei (vierzehn Werte). Nichts wird berechnet, nichts
          wird zur Laufzeit gemessen, und nichts reagiert auf den Viewport.
        </p>

        <h3>Die Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>CSS-Variable</th>
                <th>Aura-Wert</th>
                <th>Wo er landet</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>timeline.event.min.height</code></td>
                <td><code>--p-timeline-event-min-height</code></td>
                <td>{{ m.minHeight }}</td>
                <td>jedes Ereignis außer dem letzten (beim letzten <code>0</code>)</td>
              </tr>
              <tr>
                <td><code>timeline.vertical.event.content.padding</code></td>
                <td><code>--p-timeline-vertical-event-content-padding</code></td>
                <td>{{ m.vPadding }}</td>
                <td>Content und Gegenseite, vertikales Layout</td>
              </tr>
              <tr>
                <td><code>timeline.horizontal.event.content.padding</code></td>
                <td><code>--p-timeline-horizontal-event-content-padding</code></td>
                <td>{{ m.hPadding }}</td>
                <td>Content und Gegenseite, horizontales Layout</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.size</code></td>
                <td><code>--p-timeline-event-marker-size</code></td>
                <td>{{ m.markerSize }}</td>
                <td>Breite und Höhe des Markers</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.border.radius</code></td>
                <td><code>--p-timeline-event-marker-border-radius</code></td>
                <td>{{ m.radius }}</td>
                <td>Umriss des Markers und das <code>::after</code>-Overlay</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.border.width</code> / <code>.color</code></td>
                <td><code>--p-timeline-event-marker-border-width</code> / <code>-color</code></td>
                <td>{{ m.markerBorder }}</td>
                <td>der Ring um den Punkt</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.background</code></td>
                <td><code>--p-timeline-event-marker-background</code></td>
                <td>{{ m.markerBackground }}</td>
                <td>Füllung des Markers</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.content.size</code> / <code>.background</code></td>
                <td><code>--p-timeline-event-marker-content-size</code> / <code>-background</code></td>
                <td>{{ m.markerDot }}</td>
                <td>der <code>::before</code>-Punkt</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.content.border.radius</code></td>
                <td><code>--p-timeline-event-marker-content-border-radius</code></td>
                <td>{{ m.radius }}</td>
                <td>der eigene Umriss des <code>::before</code>-Punkts</td>
              </tr>
              <tr>
                <td><code>timeline.event.marker.content.inset.shadow</code></td>
                <td><code>--p-timeline-event-marker-content-inset-shadow</code></td>
                <td>zwei gestapelte Schatten</td>
                <td>das <code>::after</code>-Overlay</td>
              </tr>
              <tr>
                <td><code>timeline.event.connector.size</code> / <code>.color</code></td>
                <td><code>--p-timeline-event-connector-size</code> / <code>-color</code></td>
                <td>{{ m.connector }}</td>
                <td>Stärke des Verbinders (Breite, wenn vertikal, Höhe, wenn horizontal)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/timeline/index.mjs</code> (2.0.2); die Variablennamen
          folgen dem <code>p</code>-Präfix und dem Kebab-Pfad, die in <code>&#64;openng/optimus-ui-styled</code>
          dokumentiert sind. Werte in geschweiften Klammern sind semantische Aura-Referenzen, keine Literale.
        </p>

        <h3>Einen Token zu überschreiben geht nicht da, wo du denkst</h3>
        <p>
          Die <code>--p-timeline-*</code>-Deklarationen werden von einem <code>&lt;style&gt;</code>-Element nach
          <code>:root,:host</code> geschrieben, das die Bibliothek zur Laufzeit einfügt und das nach dem Stylesheet der
          Anwendung landet. Eine erneute <code>:root</code>-Deklaration in <code>src/styles.scss</code> ist deshalb bei
          der Spezifität gleichauf und verliert bei der Reihenfolge — dasselbe Muster, das das Kit schon für seine
          Select-Overrides dokumentiert. Zwei Dinge funktionieren:
        </p>
        <pre class="code-block"><code>{{ tokenOverrideSnippet }}</code></pre>
        <p class="src-note">
          Präfix und Standardselektor aus <code>&#64;openng/optimus-ui-styled</code>; die Folge der Einfügereihenfolge ist
          der Befund, der in <code>src/styles.scss</code> für den Fokus-Ring des Select schon festgehalten ist.
        </p>

        <h3>Was jeder Layout-Modus wirklich ist</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Root-Klasse</th>
                <th>Regel, die sie auslöst</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-timeline-left</code></td>
                <td>Gegenseite <code>text-align: right</code>, Content <code>text-align: left</code></td>
              </tr>
              <tr>
                <td><code>p-timeline-right</code></td>
                <td>Ereignis <code>flex-direction: row-reverse</code>, dazu die gespiegelte Textausrichtung</td>
              </tr>
              <tr>
                <td><code>p-timeline-alternate</code></td>
                <td>vertikal: <code>row-reverse</code> bei geraden Ereignissen; horizontal: <code>column-reverse</code> bei geraden Ereignissen</td>
              </tr>
              <tr>
                <td><code>p-timeline-bottom</code></td>
                <td>Ereignis <code>flex-direction: column-reverse</code></td>
              </tr>
              <tr>
                <td><code>p-timeline-top</code></td>
                <td><strong>überhaupt keine Regel</strong> — es ist der horizontale Ruhezustand</td>
              </tr>
              <tr>
                <td><code>p-timeline-horizontal</code></td>
                <td>Root wird zur Zeile; Ereignisse werden zu Spalten mit <code>flex: 1</code> (das letzte <code>0</code>)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Bestand der Regeln direkt aus <code>&#64;openng/optimus-ui-styles/dist/timeline/index.mjs</code> (2.0.2) gelesen —
          das ganze Preset, keine Stichprobe.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          <strong>Keinerlei eigenes responsives Verhalten.</strong> Das Preset enthält keine Media Query, und die
          Komponente nimmt kein Breakpoint-Input, also rendert eine Schiene mit <code>align="alternate"</code> auch bei
          360 px noch zwei <code>flex: 1</code>-Spalten plus einen Marker — etwa 170 px je Hälfte, den 18-px-Marker
          halbiert abgezogen, davon sind 2 &times; 16 px Content-Padding, bleiben rund 139 px für Text, also zwei oder
          drei Wörter pro Zeile. Hinweis fürs Layout: Schalte <code>align</code> unterhalb von etwa <code>48rem</code>
          auf <code>"left"</code> um und hol dir die gegenüberliegende Hälfte mit <code>pt.eventOpposite</code> zurück,
          oder blende die Timeline unter diesem Breakpoint aus und rendere stattdessen eine einspaltige Liste.
        </p>

        <h3>Kontrast</h3>
        <p>
          Der Marker-Ring und der Verbinder lesen beide Auras <code>content.border.color</code>. Das Kontrast-Kompilat
          des Kits prüft die Timeline nicht, führt dieselbe Farbe aber als die informativen
          <code>progressbar.background</code>-Zeilen: 1,13–1,76:1 auf dem Seitengrund, 1,23–1,61:1 auf der Card —
          eine Dekoration, keine Begrenzung. Wenn ein Marker oder ein Verbinder Bedeutung trägt statt Dekoration, mal
          ihn mit einem gemessenen Kit-Token neu: <code>--control-border</code> auf <code>--surface-card</code> erreicht
          im Stil werkbund 5,23:1 hell und 4,91:1 dunkel und in keinem der vier visuellen Stile weniger als 3,97:1
          (blaupause, dunkel), gegenüber den 3:1, die SC 1.4.11 von einer bedeutungstragenden Begrenzung verlangt.
        </p>
        <p class="src-note">
          Verhältnisse zitiert aus <code>docs/generated/CONTRAST.MD</code>, Abschnitte „control boundary“ und „progressbar
          &amp; slider“ (die Aura-Track-Zeilen, derselbe Token), jeder Stil und Modus. Kein Block eines visuellen Stils in
          <code>styles.scss</code> fasst die Timeline an, also sind ihre Geometrie und Ringfarben in jedem Stil gleich;
          nur der Markerpunkt folgt dem Akzent, über <code>&#123;primary.color&#125;</code>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Vier Inputs, drei Slots, acht Pass-through-Abschnitte, keine Outputs und keine Methoden. Das Verhalten, das
          man kennen sollte, steckt nicht in der API-Oberfläche, sondern in zwei Angular-Details: wie
          <code>value</code> deklariert ist und wie das <code>&#64;for</code> trackt.
        </p>

        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Typ</th>
                <th>Standard</th>
                <th>Hinweis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>any[]</td>
                <td><code>undefined</code></td>
                <td>schlichtes <code>&#64;Input()</code>, kein Signal</td>
              </tr>
              <tr>
                <td><code>layout</code></td>
                <td><code>'vertical' | 'horizontal'</code></td>
                <td><code>'vertical'</code></td>
                <td>das einzige Input, das wirklich typisiert ist</td>
              </tr>
              <tr>
                <td><code>align</code></td>
                <td><code>string</code></td>
                <td><code>'left'</code></td>
                <td>untypisiert; das JSDoc lässt <code>'alternate'</code> weg, das trotzdem funktioniert</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td><code>string</code></td>
                <td><code>undefined</code></td>
                <td>veraltet seit v20.0.0, wird aber weiter in die Host-Klasse gemischt — nimm <code>class</code></td>
              </tr>
              <tr>
                <td><code>pt</code>, <code>dt</code>, <code>unstyled</code>, <code>ptOptions</code></td>
                <td>Signal-Inputs</td>
                <td>—</td>
                <td>geerbt von der Basiskomponente der Bibliothek, nicht hier deklariert</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarationen und Standardwerte aus <code>openng-optimus-ui-timeline.mjs</code> und den passenden
          Typdeklarationen unter <code>&#64;openng/optimus-ui/types</code> (2.0.2); die geerbten vier aus
          <code>openng-optimus-ui-basecomponent.mjs</code>.
        </p>

        <h3>Change Detection</h3>
        <p>
          Die Komponente ist <code>OnPush</code>, und <code>value</code> ist ein klassisches <code>&#64;Input()</code>.
          Etwas in das Array zu pushen, das du schon übergeben hast, ändert auf dem Bildschirm nichts, weil sich keine
          Input-Referenz geändert und nichts die View markiert hat. Die verlässliche Form ist ein neues Array — und das
          bekommst du gratis, wenn das Eltern-Template ein Signal liest:
        </p>
        <pre class="code-block"><code>{{ valueSnippet }}</code></pre>
        <p>
          Die Schleife trackt das Eintragsobjekt selbst. Deine Einträge neu aufzubauen — ein erneuter Abruf, der
          frische Objekte mappt — ist deshalb ein kompletter Abriss: Jeder Ereignis-Knoten wird zerstört und neu
          erzeugt, und alles Zustandsbehaftete in deinem <code>#content</code> (ein geöffnetes Aufklappelement, ein
          fokussierter Link, eine Scroll-Position) geht mit. Halte die Objektidentität über Aktualisierungen hinweg
          stabil, wenn der Inhalt Zustand hält.
        </p>

        <h3>Pass-through-Abschnitte</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Abschnitt</th>
                <th>Erreicht</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>host</code>, <code>root</code></td>
                <td>das <code>&lt;p-timeline&gt;</code>-Element — nach jedem View-Check darauf gemischt</td>
              </tr>
              <tr>
                <td><code>event</code></td>
                <td>die Zeile je Eintrag</td>
              </tr>
              <tr>
                <td><code>eventOpposite</code>, <code>eventContent</code></td>
                <td>die beiden <code>flex: 1</code>-Hälften</td>
              </tr>
              <tr>
                <td><code>eventSeparator</code></td>
                <td>die Spalte, die Marker und Verbinder hält</td>
              </tr>
              <tr>
                <td><code>eventMarker</code></td>
                <td>nur den Standardpunkt — ein <code>#marker</code>-Template ersetzt das Element</td>
              </tr>
              <tr>
                <td><code>eventConnector</code></td>
                <td>den Verbinder, beim letzten Eintrag nicht vorhanden</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abschnittsnamen aus der Classes-Map in <code>openng-optimus-ui-timeline.mjs</code> (2.0.2); das Mischen auf den
          Host läuft aus <code>onAfterViewChecked</code> über die Bind-Host-Direktive der Bibliothek.
        </p>

        <h3>Styling reicht weiter, als du wolltest</h3>
        <p>
          Die Komponente rendert mit <code>ViewEncapsulation.None</code>, also ist das Preset global und ebenso jede
          Regel, die du gegen seine Klassennamen schreibst. Ein nacktes <code>.p-timeline-event &#123; … &#125;</code> in
          einem Komponenten-Stylesheet stimmt jede Timeline der Anwendung um. Schränk es über einen Vorfahren ein, oder
          nimm <code>pt</code>, damit die Regel der Instanz nicht entkommen kann.
        </p>

        <h3>Serverseitiges Rendern</h3>
        <p>
          Nichts abzusichern: Die Komponente liest kein <code>window</code>, registriert keinen Listener, startet keinen
          Timer und misst nichts. Sie rendert allein aus <code>value</code>, also stimmen das vorgerenderte und das
          hydrierte Markup überein, solange deine Einträge übereinstimmen.
        </p>

        <h3>Bevor du es fertig nennst</h3>
        <ul class="checklist">
          <li>☐ Der Root hat über <code>pt.root</code> eine Rolle und einen zugänglichen Namen.</li>
          <li>☐ Jedes Slot-Template ist ein direktes Kind von <code>&lt;p-timeline&gt;</code>.</li>
          <li>☐ <code>value</code> wird ersetzt, nie verändert.</li>
          <li>☐ Jedes Icon in einem <code>#marker</code>-Template ist <code>aria-hidden</code>.</li>
          <li>☐ Keine Bedeutung hängt allein an der Markerfarbe.</li>
          <li>☐ Fokussierbarer Inhalt in <code>#content</code> zeigt einen sichtbaren Fokus-Ring — die Timeline liefert keinen.</li>
          <li>☐ Die Antwort für schmale Bildschirme ist aufgeschrieben und umgesetzt, nicht angenommen.</li>
          <li>☐ Keine Regel irgendwo zielt auf <code>.p-timeline-event-left</code> oder <code>-right</code>.</li>
          <li>☐ Ein leeres <code>value</code> rendert eine leere Schiene — deinen Leerzustand baust du selbst.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Die Komponente liefert überhaupt keine Strings mit — keine ARIA-Standardwerte, keine Labels, keine eingefügte
          Konfiguration. Jedes Wort in einer Timeline hast du selbst hineingegeben; das macht die Übersetzung einfach
          und die Länge zum einzigen echten Risiko.
        </p>

        <h3>Woher die Strings kommen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Zuständig</th>
                <th>Wie</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Der zugängliche Name der Liste</td>
                <td>du</td>
                <td>das <code>aria-label</code> von <code>pt.root</code>, aus einem <code>computed()</code> über den Übersetzungsservice</td>
              </tr>
              <tr>
                <td>Titel, Zusammenfassung, Links des Eintrags</td>
                <td>du</td>
                <td>Bindings in <code>#content</code></td>
              </tr>
              <tr>
                <td>Das Datum neben dem Eintrag</td>
                <td>du</td>
                <td><code>#opposite</code>, formatiert mit <code>Intl</code> für das aktuelle Locale</td>
              </tr>
              <tr>
                <td>Marker-Text</td>
                <td>du oder niemand</td>
                <td>der Standardmarker ist leer; ein eigener sollte dekorativ bleiben</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Bibliotheksseite dieser Tabelle ist das Fehlen selbst: Es gibt nirgends in
          <code>openng-optimus-ui-timeline.mjs</code> (2.0.2) ARIA-Konfigurationskeys oder eine eingefügte Übersetzung.
        </p>

        <h3>Datumsangaben gehören in den gegenüberliegenden Slot, und in Intl</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Die Quelle des Locales und die Pflicht zum <code>computed()</code> folgen dem i18n-Vertrag des Kits; im Guide
          <code>i18n-localization</code> stehen die Regeln für Keys und Locales, denen dieses Snippet folgt.
        </p>

        <h3>Länge in einer festen Hälfte</h3>
        <p>
          Eine vertikale Timeline gibt jedem Eintrag genau die halbe Breite des Containers minus die Markerspalte, und
          diese Hälfte wächst nicht mit, wenn eine Übersetzung länger wird. Plane für einen Titel, der nicht auf eine
          dritte Zeile umbrechen darf, etwa das 1,4-Fache der englischen Breite ein, und denk daran, dass die
          gegenüberliegende Hälfte derselben Einschränkung unterliegt, auch wenn sie meist nur vier Zeichen enthält.
        </p>

        <h3>Rechts-nach-links</h3>
        <p>
          Das Preset schreibt am Root der Timeline fest <code>direction: ltr</code> vor, und jede Layout-Regel ist in
          physischen Begriffen geschrieben — <code>row-reverse</code>, <code>text-align: left</code>,
          <code>text-align: right</code> — ohne logische Eigenschaften und nirgends mit einer <code>:dir()</code>-Regel.
          In einem <code>dir="rtl"</code>-Teilbaum spiegelt sich die Schiene deshalb nicht: <code>align="left"</code>
          bleibt optisch links, und Text in deinen Slots wird LTR gerendert, solange du <code>direction</code> auf deinem
          eigenen Inhalt nicht zurücksetzt. Dieses Kit liefert vier Sprachvarianten von links nach rechts aus, also wird
          hier derzeit nichts davon beansprucht — aber eine Variante von rechts nach links bräuchte einen ausdrücklichen
          Override am Root, kein <code>dir</code> auf Dokumentebene.
        </p>
        <p class="src-note">
          Die <code>direction</code>-Deklaration und das Fehlen logischer Eigenschaften aus
          <code>&#64;openng/optimus-ui-styles/dist/timeline/index.mjs</code> (2.0.2) gelesen; die ausgelieferten Sprachen
          aus der Sprachkonfiguration des Kits.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Standardfarbe von
            Marker und Verbinder wird jetzt aus den informativen <code>progressbar.background</code>-Zeilen zitiert statt
            mit „nicht im Kompilat“.
          </li>
          <li>
            <strong>v1.1</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft:
            alle Zeilenbelege halten; die Verhältnisse für die Control-Begrenzung je Stil neu aus CONTRAST.MD zitiert
            (das alte Paar stammte aus der Zeit vor den Stilen); festgehalten, dass kein Stil-Block die Timeline anfasst;
            die Abgrenzung zählt zwei Kit-Timelines, nicht drei; Historien-Format angeglichen; Agent-Doc gekürzt.
          </li>
          <li>
            <strong>v1.0</strong> — 04.09.2026 — Erste Ausgabe. Gemessen gegen Optimus UI 2.0.2: Komponenten-Bundle,
            Style-Preset und Aura-Token-Datei.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TimelineArticleDeComponent extends TimelineArticleComponent {
  override readonly layoutOptions = [
    { label: 'vertical (Standard)', value: 'vertical' },
    { label: 'horizontal', value: 'horizontal' },
  ];

  override readonly alignOptions = [
    { label: 'left (Standard)', value: 'left' },
    { label: 'right', value: 'right' },
    { label: 'alternate (undokumentiert)', value: 'alternate' },
    { label: 'top (keine Regel)', value: 'top' },
    { label: 'bottom', value: 'bottom' },
  ];

  override readonly listPt = {
    root: { role: 'list', 'aria-label': 'Versionsgeschichte' },
    event: { role: 'listitem' },
  };

  override readonly events = [
    { year: '2021', iso: '2021-03-01', glyph: '◆', title: 'Das Kit beginnt', summary: 'Eine Seite, ein Stylesheet, kein Designsystem.' },
    { year: '2023', iso: '2023-07-01', glyph: '◆', title: 'Tokens kommen', summary: 'Farbe und Abstände wandern aus den Komponenten heraus.' },
    { year: '2025', iso: '2025-02-01', glyph: '◆', title: 'Die Galerie erscheint', summary: 'Die Registry wird zur einzigen Quelle der Wahrheit.' },
    { year: '2026', iso: '2026-09-01', glyph: '◆', title: 'Guides-Schicht', summary: 'Agent-Docs und Artikel-Tabs aus einer Datei.' },
  ];
}
