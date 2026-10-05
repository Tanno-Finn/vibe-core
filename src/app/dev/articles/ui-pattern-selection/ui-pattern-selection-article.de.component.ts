import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  UiPatternSelectionArticleComponent,
  ARTICLE_IMPORTS,
  ARTICLE_STYLES,
} from './ui-pattern-selection-article.component';

/**
 * German twin of the UI Pattern Selection guide (ADR-0018).
 *
 * Extends the English canonical article, so the code snippets are shared; only the
 * template is German. Keep it in step with the English file: same tabs, same element
 * and binding skeleton (`node scripts/check-guide-translations.mjs ui-pattern-selection`).
 */
@Component({
  selector: 'app-ui-pattern-selection-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'ui-pattern-selection'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Entscheidungen, gerendert statt beschrieben. Beide hat dieses Kit schon getroffen, und beide sind auf
          einem Screenshot unsichtbar — was die Optionen trennt, ist, wer den Inhalt erreichen kann und wem die
          Überschrift gehört.
        </p>

        <h3>Drei Wege, eine Erklärung anzuhängen, und nur zwei davon sind Muster</h3>
        <p>Derselbe Satz, auf drei Arten angeboten. Probier jede mit dem Zeiger und dann nur mit der Tastatur.</p>
        <div class="stage stage--row">
          <div class="stage__item">
            <span class="stage__cap">natives title</span>
            <span class="faux-help" title="Ein Schwellenwert, oberhalb dessen eine Stichprobe als Ausreißer zählt.">
              Schwellenwert <span aria-hidden="true">(?)</span>
            </span>
          </div>
          <div class="stage__item">
            <span class="stage__cap">pTooltip</span>
            <button
              type="button"
              class="icon-btn"
              aria-label="Schwellenwert zurücksetzen"
              pTooltip="Schwellenwert zurücksetzen"
              tooltipPosition="top"
            >
              <span aria-hidden="true">&#8635;</span>
            </button>
          </div>
          <div class="stage__item">
            <span class="stage__cap">app-info-tooltip</span>
            <span class="faux-help">
              Schwellenwert
              <app-info-tooltip
                text="Ein Schwellenwert, oberhalb dessen eine Stichprobe als Ausreißer zählt."
                forLabel="Schwellenwert"
              >
              </app-info-tooltip>
            </span>
          </div>
        </div>
        <p class="src-note">
          Verhalten und das Kriterium, gegen das es gebaut ist, aus dem Kit-Doc
          <code>src/assets/design-system/info-tooltip.md</code> und der Komponente, die es dokumentiert,
          <code>src/app/components/shared/info-tooltip.component.ts</code>. Die Stufe darüber — eine Blase nur für den
          Zeiger, die nicht mehr tragen darf als den eigenen Namen eines Controls — ist durch SC 1.4.13 begrenzt und
          durch die Regel zum zugänglichen Namen, die <strong>Richtlinien zur Barrierefreiheit</strong> verantwortet;
          den eigenen Vertrag der Bibliothekskomponente beschreibt der Guide <strong>Tooltip</strong>. Das erste
          Element ist das native Attribut, dessen zugängliche Bereitstellung der HTML-Standard verlangt und die
          Browser nicht liefern.
        </p>

        <h3>Ein Block mit Titel: das Primitive des Kits gegen die Box der Bibliothek</h3>
        <p>
          Gleicher Inhalt, gleiche Breite. Das Kit-Primitive bringt eine semantische Variante mit, eine echte
          Überschrift auf der Ebene, die du nennst, und ein optionales Einklappen; die Bibliotheks-Card bringt eine
          Fläche mit, und die Überschrift bleibt deine Aufgabe.
        </p>
        <div class="stage stage--stack">
          <app-standard-container [config]="{ type: 'info', title: 'Stichprobenschwelle', headingLevel: 4 }">
            <p class="m0">
              Heb den Schwellenwert an, um mehr Stichproben zu behalten. Der Container liefert den Akzent, das Icon und
              das Überschriften-Tag.
            </p>
          </app-standard-container>

          <p-card>
            <ng-template #header>
              <h4 class="card-h">Stichprobenschwelle</h4>
            </ng-template>
            <p class="m0">
              Heb den Schwellenwert an, um mehr Stichproben zu behalten. Die Überschrift oben ist von Hand geschriebenes
              Markup, weil die Card keine beisteuert.
            </p>
          </p-card>
        </div>
        <p class="src-note">
          Variantensatz, Steuerung der Überschrift und Einklapp-Verhalten aus
          <code>src/assets/design-system/standard-container.md</code>; was die Card selbst nicht beisteuert, beschreibt
          der Guide <strong>Card</strong>, dessen Tab Verwendung schon die Vergleichstabelle der Container enthält, die
          dieser Guide nicht wiederholt.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Die erste Frage ist nie, welches Control. Sie lautet, welche von drei Schichten den Bedarf schon abdeckt —
          denn zwei davon antworten ohne Entscheidung, und nur die dritte ist eine Abwägung.
        </p>

        <h3>Frag die drei Schichten der Reihe nach</h3>
        <ol class="steps">
          <li>
            <strong>Liefert das Kit es schon?</strong> Die Galerie besteht aus den eigenen Primitives des Kits, jedes
            mit einem Doc aus sechs Abschnitten. Deckt eines rund 80&nbsp;% des Bedarfs ab, lautet die Antwort: nutzen
            oder erweitern — ein fast doppeltes Primitive ist auf Dauer ein zweites Ding, das gepflegt werden muss.
          </li>
          <li>
            <strong>Verantwortet ein Guide die Grenze?</strong> Jede Bibliothekskomponente, die dieses Kit
            dokumentiert, nennt ihre eigenen Grenzen in <code>When to use</code> und <code>When not to use</code>. Lies
            die Regel des zuständigen Guides; rekonstruier keinen Schwellenwert, den du nur halb im Kopf hast.
          </li>
          <li>
            <strong>Sonst ist es einfaches HTML.</strong> Eine Bibliothekskomponente, die nur Zustandsmechanik
            hinzufügt, die du nie einschaltest, ist eine Abhängigkeit ohne Grund.
          </li>
        </ol>
        <p class="src-note">
          Die Wiederverwendungsregel und die Leseleiter darunter stehen in der Kit-eigenen Direktive
          <code>directives/design-system.md</code>; das Inventar der Schichten sind
          <code>src/app/dev/design-registry.ts</code> und <code>src/app/dev/articles/article-registry.ts</code>.
        </p>

        <h3>Wo das Kit antwortet, bevor die Bibliothek erreicht ist</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bedarf</th>
                <th>Die Antwort des Kits</th>
                <th>Warum es nicht die der Bibliothek ist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ein Inhaltsblock mit Titel, optional einklappbar</td>
                <td><code>app-standard-container</code></td>
                <td>
                  Neun semantische Varianten, eine Überschrift auf der Ebene, die du nennst, und ein Einklappen, das
                  Fragmente kennt; der Lese-Wrapper, der Definitionsblock und die Quiz-Hülle sind darauf gebaut statt
                  daneben
                </td>
              </tr>
              <tr>
                <td>Längerer Fließtext mit Lese-Elementen</td>
                <td><code>app-text-container</code></td>
                <td>Fügt Lesezeit, Wortzahl und einen Fortschrittsbalken über demselben Container hinzu</td>
              </tr>
              <tr>
                <td>Ein, zwei Sätze Hilfe neben einem Control</td>
                <td><code>app-info-tooltip</code></td>
                <td>Öffnet sich bei Klick oder Fokus, mit Esc schließbar, bemessen für eine kurze Blase</td>
              </tr>
              <tr>
                <td>Ein flüchtiger Hinweis „hat geklappt“</td>
                <td><code>ToastService</code>, gerendert von <code>app-toast-container</code></td>
                <td>Die Shell rendert schon eine Warteschlange mit eigenen Positionen und Typen</td>
              </tr>
              <tr>
                <td>Das Warten auf Shell-Ebene vor der ersten Ansicht</td>
                <td><code>app-loading-overlay</code></td>
                <td>Ein Overlay für die ganze Shell, nicht ein Spinner pro Seite</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit-Primitives und ihre Inputs aus ihren kanonischen Docs unter
          <code>src/assets/design-system/</code>; die beiden Zeilen mit Service dahinter aus
          <code>src/app/services/toast.service.ts</code> und
          <code>src/app/components/shared/app-loading-overlay.component.ts</code>, beide von der App-Shell
          eingebunden. Die Gegenstücke der Bibliothek sind in <strong>Rückmeldungen</strong> und
          <strong>Fortschritt</strong> dokumentiert und bleiben die richtige Lektüre, wenn du ihre Mechanik brauchst.
        </p>

        <h3>Welcher Guide welche Grenze verantwortet</h3>
        <p>
          Eine Verweistabelle, kein zweites Regelwerk. Jede Zeile nennt den Guide, dessen
          <code>When to use</code> maßgeblich ist; wo diese Tabelle und dieser Abschnitt sich widersprechen, gewinnt der
          Guide, und die Zeile ist veraltet.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Die Frage, die vor dir liegt</th>
                <th>Verantwortet von</th>
                <th>Die Regel, die er nennt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ein Wert aus einer Liste, und die Liste ist lang</td>
                <td>Select</td>
                <td>Rund 5&ndash;25 bekannte Optionen, wenig Platz, Beschriftungen, die keine Erklärung brauchen</td>
              </tr>
              <tr>
                <td>Ein Wert, ganze Menge sichtbar, wirkt beim Klick</td>
                <td>Select Button</td>
                <td>2&ndash;4 kurze, sich ausschließende Werte, die bei deiner schmalsten Breite in eine Zeile passen</td>
              </tr>
              <tr>
                <td>Ein Wert, ganze Menge sichtbar, wirkt beim Absenden</td>
                <td>Radio Button</td>
                <td>Genau eine von 2&ndash;5 benannten Optionen, als Formularfeld, das nie leer sein kann</td>
              </tr>
              <tr>
                <td>Null bis viele unabhängige Antworten</td>
                <td>Checkbox</td>
                <td>„Was davon trifft zu?“, wirkt beim Absenden, und nichts angekreuzt ist zulässig</td>
              </tr>
              <tr>
                <td>Eine Einstellung, die sofort wirkt</td>
                <td>Toggle Switch</td>
                <td>Ein An/Aus-Zustand, der in dem Moment wirkt, in dem er umgelegt wird</td>
              </tr>
              <tr>
                <td>Zu viele Kandidaten zum Auflisten, oder unbegrenzt viele</td>
                <td>AutoComplete</td>
                <td>Hunderte, entfernt geladen oder offen, und der Nutzer kann das Ziel benennen</td>
              </tr>
              <tr>
                <td>Datensätze nebeneinander</td>
                <td>Table</td>
                <td>
                  Über Spalten verglichen, mit echtem Sortieren, Auswählen oder Blättern &mdash; sonst ein einfaches
                  table-Element
                </td>
              </tr>
              <tr>
                <td>Parallele Ansichten eines Themas</td>
                <td>Tabs</td>
                <td>
                  Zwei bis etwa vier Beschriftungen; alles, was verlinkbar oder neu ladbar sein muss, wird eine Route
                  oder spiegelt seinen Wert in einen Query-Parameter
                </td>
              </tr>
              <tr>
                <td>Eine modale Unterbrechung</td>
                <td>Dialog</td>
                <td>Eine abgeschlossene Teilaufgabe, die der Nutzer gerade angefordert hat &mdash; nie der Standard-Container</td>
              </tr>
              <tr>
                <td>Ein Panel, hinter dem die Seite bedienbar bleibt</td>
                <td>Popover, Drawer</td>
                <td>An einem Auslöser verankert, oder an einen Rand geheftet und von dir bemessen</td>
              </tr>
              <tr>
                <td>Etwas ist passiert oder passiert gerade</td>
                <td>Rückmeldungen, Fortschritt, Skeleton</td>
                <td>Ein Zustand, der bestehen bleibt, ein zählbares Warten, oder ein Warten, dessen Layout du zeichnen kannst</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Jede Zelle ist das eigene <code>When to use</code> des zuständigen Guides, verdichtet;
          <code>node scripts/design-guides.mjs sections &quot;When to use&quot;</code> liefert sie alle ungekürzt in
          einem Aufruf, und in dieser Form liest du sie, bevor du Markup schreibst.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; Hilfe in einem nativen title verstecken</span>
            <div class="dd__stage">
              <code class="dd__code"
                >&lt;span title="Above this, a sample counts as an outlier."&gt;Threshold&lt;/span&gt;</code
              >
            </div>
            <p class="dd__why">
              Der HTML-Standard verlangt von Browsern, das Attribut zugänglich bereitzustellen, und sie tun es nicht:
              Es erscheint beim Überfahren mit dem Zeiger und in manchen Screenreadern als Ersatzbeschreibung. Genau
              diese Lücke ist der eigene Grund des Standards, von dem Verlass darauf abzuraten — jeder ohne Zeiger sieht
              eine Erklärung, die er nicht öffnen kann, und ihre Darstellung gehört dem Browser statt dir.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; der Erklärung einen Auslöser geben</span>
            <div class="dd__stage">
              <code class="dd__code"
                >Threshold &lt;app-info-tooltip [text]="help()" forLabel="Threshold"&gt;&lt;/app-info-tooltip&gt;</code
              >
            </div>
            <p class="dd__why">
              Ein echter Button in der Tab-Reihenfolge, der sich bei Klick oder Fokus öffnet und mit Esc schließen
              lässt. Ist der Text der eigene Name des Controls statt einer Erklärung, gehört er stattdessen in
              <code>pTooltip</code> neben den zugänglichen Namen.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; einen Dialog für Inhalt öffnen, der eine Adresse hat</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;p-dialog [(visible)]="detailOpen"&gt; … the record … &lt;/p-dialog&gt;</code>
            </div>
            <p class="dd__why">
              Ein Dialog hat keine eigene Adresse. Solange du seinen Öffnungszustand nicht selbst in die URL spiegelst
              — als Query-Parameter oder über ein Auxiliary Outlet, das der Ebene ein Segment gibt —, kann der Leser ihn
              weder verlinken noch neu laden noch zu ihm zurückkehren, und die Zurück-Taste des Browsers verlässt die
              Seite statt der Ebene. Der Guide Dialog nennt dieselbe Grenze von der anderen Seite: Tabs oder Schritte
              darin bedeuten, dass es eine Seite ist.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; der Ansicht eine Route geben</span>
            <div class="dd__stage">
              <!-- Entities decode before interpolation is scanned, so a doubled brace
                   entity comes back as a real binding and Angular goes looking for a
                   "record" property. Single entity braces are safe (every other guide
                   uses them); a doubled pair needs the interpolated-string escape. -->
              <code class="dd__code"
                >&lt;a [routerLink]="['/records', record.id]"&gt;{{ '{{' }} record.name {{ '}}' }}&lt;/a&gt;</code
              >
            </div>
            <p class="dd__why">
              Routen sind der Standard des Kits für eine eigene Ansicht, deklariert in
              <code>src/app/app.routes.ts</code>. Heb die modale Ebene für eine Teilaufgabe auf, die der Leser gerade
              angefordert hat und in Sekunden erledigt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; ein umrandetes Panel von Hand bauen</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;div class="my-panel"&gt;&lt;h3&gt;Sources&lt;/h3&gt; … &lt;/div&gt;</code>
            </div>
            <p class="dd__why">
              Ein neues Panel ist ein neuer Satz an Entscheidungen über Abstände, Rahmen und Akzent, der von denen
              wegdriftet, die die Galerie schon getroffen hat, und es erbt nichts vom Einklappen, von der
              Überschriftenebene oder vom Deep-Link-Verhalten, das der Container des Kits mitbringt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; die Variante nehmen, die es gibt</span>
            <div class="dd__stage">
              <!-- Braces in template TEXT are not text: the opening one starts an ICU
                   expression and the closing one reads as a control-flow block close,
                   which together swallowed the rest of this template (NG5002). Both are
                   written as HTML entities here and render as the characters they name. -->
              <code class="dd__code"
                >&lt;app-standard-container [config]="&#123; type: 'info', title: t(), headingLevel: 3 &#125;"&gt;</code
              >
            </div>
            <p class="dd__why">
              Ein Aufruf beantwortet, ob es existiert:
              <code>design-guides.mjs list --layer kit</code>. Das Primitive zu erweitern lässt eine Stelle zum
              Reparieren; ein fast doppeltes lässt zwei.
            </p>
          </div>
        </div>

        <h3>Quellen für diesen Tab</h3>
        <p class="src-note">
          Inventar der Schichten aus <code>src/app/dev/design-registry.ts</code> und
          <code>src/app/dev/articles/article-registry.ts</code>; die Wiederverwendungsschwelle aus
          <code>directives/design-system.md</code>; jede Verweiszeile aus dem eigenen Abschnitt
          <code>When to use</code> des genannten Guides; die verlangte Bereitstellung des nativen Attributs und dass
          davon abgeraten wird, aus dem Abschnitt des HTML-Standards, den das Agenten-Doc zitiert.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Zwei Rangfolgen entscheiden die meisten Flächen: wie weit ein Muster den Leser von dem wegführt, was er gerade
          tat, und wie viel von der Fläche es beansprucht. Beide haben eine billigste Stufe, die funktioniert, und die
          billigste Stufe, die funktioniert, ist die Antwort.
        </p>

        <h3>Die Unterbrechungsleiter</h3>
        <p>
          Steig nur auf, wenn die Stufe darunter wirklich versagt. Jede Stufe kostet den Leser etwas, das die Stufe
          darunter nicht kostet.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stufe</th>
                <th>Was sie dem Leser nimmt</th>
                <th>Mechanik verantwortet von</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>An Ort und Stelle &mdash; aufklappen, einblenden oder eine andere Route</td>
                <td>Nichts; die Adresse beschreibt weiterhin, was auf dem Bildschirm ist</td>
                <td>die Container-Primitives des Kits</td>
              </tr>
              <tr>
                <td>Verankertes Panel</td>
                <td>Die Seite bleibt bedienbar, aber das Panel verschwindet beim nächsten Klick daneben</td>
                <td>Popover</td>
              </tr>
              <tr>
                <td>Rand-Panel</td>
                <td>
                  Ein Streifen des Viewports; die Maske hält den Zeiger auf, aber der Fokus ist nicht gefangen, und Tab
                  wandert weiter durch die Seite dahinter
                </td>
                <td>Drawer</td>
              </tr>
              <tr>
                <td>Modales Fenster</td>
                <td>Alles: den Fokus, den Hintergrund, die Zurück-Taste, die URL</td>
                <td>Dialog</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Stufen sind die eigenen Geltungsbereiche der drei Overlay-Guides; die Zeile zum Rand-Panel ist der eigene
          Abschnitt Accessibility von <strong>Drawer</strong>, der festhält, dass nichts außerhalb des Panels inert
          gemacht wird und dass der Fokus weder von selbst hineingeht noch zurückkehrt. Die abschließende Regel ist die
          von Dialog, die festhält, dass ein Dialog nie ein Standard-Container ist und dass die erste Antwort lautet, es
          auf die Seite zu stellen.
        </p>

        <h3>Die Flächenhierarchie</h3>
        <p>
          Container verschachteln sich in diesem Kit nach Absicht statt nach Tiefe: Eine Seite besitzt eine Überschrift,
          ein Abschnitt einen Block mit Titel, ein Block seinen Inhalt. Drei Flächen des Kits sind auf einem Container
          gebaut statt daneben &mdash; der Lese-Wrapper, der Definitionsblock und die Quiz-Hülle sitzen alle auf
          <code>app-standard-container</code> &mdash;, deshalb ist es billiger, diese Kette zu erweitern, als eine
          parallele zu beginnen. Die übrigen sind Geschwister, keine Schichten: Das eigene <code>When not to use</code>
          des Containers verweist das Card-Raster, den einzeiligen Callout, die Seitenleisten-Liste und die
          Kennzahl-Kachel an eigene Primitives. Welches davon zu welchem Inhalt passt, steht im eigenen
          <code>When not to use</code> jedes Primitives, und sie nennen einander ausdrücklich.
        </p>
        <p class="src-note">
          Aufbau gelesen aus <code>src/assets/design-system/standard-container.md</code> und den Abschnitten
          <code>When not to use</code> der Geschwister-Docs des Kits im selben Verzeichnis;
          <code>node scripts/design-guides.mjs sections &quot;when not to use&quot; --layer kit</code>
          liefert sie zusammen.
        </p>

        <h3>Was dieser Korpus nicht entscheidet</h3>
        <p>
          Eng benannt, damit die Lücke nicht für eine Regel gehalten wird. Das Regal <code>layouts</code> beantwortet
          den Aufbau von drei Seitentypen &mdash; <strong>Artikel-Layout</strong>, <strong>Demo-Layout</strong> und
          <strong>Hub-Layout</strong> &mdash;, und für Raster-Rhythmus und Abstands-Komposition darüber hinaus gibt es
          hier keine dokumentierte Antwort, eine Fläche, die eine braucht, trifft die Entscheidung also selbst. Auf der
          Seite der Bibliothek erklärt noch kein Guide manche Komponenten, die das Paket exportiert; ihre Grenzen gibt
          es nur dort, wo ein Geschwister-Guide sie zufällig erwähnt, eine davon zu wählen ist also eine Entscheidung
          ohne zuständiges <code>When to use</code>. Alles außerhalb dieser beiden Lücken ist entweder ein
          Kit-Primitive mit Doc oder ein Guide mit einem <code>When to use</code>.
        </p>
        <p class="src-note">
          Die Menge der Kategorien gelesen aus <code>src/app/dev/articles/article-registry.ts</code>, die auch
          <code>node scripts/design-guides.mjs list --json</code> ausliefert; die nicht abgedeckten
          Bibliothekskomponenten sind das, was <code>node scripts/design-guides.mjs coverage</code> ausgibt, gezählt aus
          der Liste <code>covers:</code> jedes Guides gegen die eigenen Exporte des Pakets.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Die Wahl des Musters hat <strong>überhaupt kein Laufzeitverhalten</strong> &mdash; sie misst nichts und
          bricht nichts um, weil sie geschieht, bevor es Markup gibt. Was der Viewport ändert, ist, welche Muster
          verfügbar bleiben, und drei davon scheitern früh genug, um die Wahl zu entscheiden statt nur das Styling: Ein
          Segmented Control muss seine ganze Menge bei der schmalsten Breite, die du unterstützt, in eine Zeile bringen,
          eine Tab-Leiste scrollt ab etwa vier Beschriftungen seitwärts, und die Optionen außerhalb des Bildschirms
          hören auf zu existieren, und eine Spaltenmenge schrumpft weder, noch bricht sie um. Design-Empfehlung: Wähl
          das Muster zuerst bei 360&nbsp;px und lass den breiten Viewport es erben &mdash; ein Segmented Control, das
          nicht passt, wird ein Select, eine Tab-Leiste, die nicht passt, wird zu Routen oder gestapelten Abschnitten,
          und eine Tabelle, die nicht passt, lässt Spalten weg oder scrollt in ihrem Wrapper. Die Breakpoints je Muster
          und die gemessenen Breiten dahinter gehören den zuständigen Guides, und die Textlängen, die ein Control über
          seine Breite treiben, gehören zu <strong>I18n &amp; Lokalisierung</strong>.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Die Entscheidung besteht aus drei Fragen, und keine davon braucht die laufende App. Den zuständigen Guide zu
          lesen kostet weniger als das Review, das auf das falsche Muster folgt.
        </p>

        <h3>Die drei Fragen als Aufrufe</h3>
        <pre class="code-block"><code>{{ decideSnippet }}</code></pre>
        <p class="src-note">
          Befehle und ihre Schichten aus <code>scripts/design-guides.mjs</code>, dessen Leseleiter in
          <code>directives/design-system.md</code> dargelegt ist; beide Schichten bedient dasselbe Script, also sind
          <code>--layer</code> und <code>--scope</code> der einzige Unterschied zwischen der Frage an die Galerie und der
          Frage an die Guides.
        </p>

        <h3>Ein Muster hinzufügen, das das Kit nicht hat</h3>
        <pre class="code-block"><code>{{ addPatternSnippet }}</code></pre>
        <p class="src-note">
          Die Weggabelung zwischen Registry und Ausnahme und ihre Fehlerfälle aus
          <code>scripts/check-design-system.mjs</code>, das eine Komponente scheitern lässt, die weder in
          <code>src/app/dev/design-registry.ts</code> noch in <code>src/app/dev/design-registry.exclusions.json</code>
          steht, und ebenso eine, die in beiden steht.
        </p>

        <h3>Was ein Gate über ein Muster klären kann und was nicht</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Prüfung</th>
                <th>Klärt</th>
                <th>Kann nicht klären</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>scripts/check-design-system.mjs</code></td>
                <td>
                  dass jede Komponente im Komponentenbaum bewusst als wiederverwendbares Primitive oder als Einzelstück
                  eingeordnet wurde und dass eine registrierte ein Doc und eine Live-Demo hat
                </td>
                <td>ob das Primitive, das du registriert hast, eines doppelt, das schon da war</td>
              </tr>
              <tr>
                <td><code>scripts/check-design-guides.mjs</code></td>
                <td>
                  dass Registry-Eintrag, Agenten-Doc, Tabs und Route eines Guides übereinstimmen und dass seine Zitate
                  noch existieren
                </td>
                <td>ob das Muster, das dieser Guide dokumentiert, das richtige für deine Fläche war</td>
              </tr>
              <tr>
                <td><code>scripts/check-i18n-keys.mjs</code></td>
                <td>dass ein literaler Key in deinem Markup aufgelöst wird, in allen vier Sprachvarianten</td>
                <td>ob der aufgelöste Text noch in das Control passt, das du gewählt hast</td>
              </tr>
              <tr>
                <td><code>scripts/check-contrast.mjs</code></td>
                <td>
                  dass ein Token-Paar des Kits und jedes Widget-Paar von Optimus UI, das das Gate aus dem Aura-Preset so
                  auflöst, wie das Kit es konfiguriert, das Kriterium erfüllt, das dafür gilt, je visuellem Stil und
                  Modus
                </td>
                <td>
                  ein Paar, das keine Zeile aufführt &mdash; ein Widget, das das Gate nicht misst, oder eine Farbe, die
                  eine Komponente zur Laufzeit mit Deckkraft oder einem Verlauf zusammensetzt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an den vier Scripts aus der ersten Spalte; der Geltungsbereich der Kontrast-Zeile ist der Kopf von
          <code>docs/generated/CONTRAST.MD</code>, und <strong>Farbsystem</strong> verantwortet die Zusammenstellung,
          aus der diese Zahlen zitiert sind.
        </p>

        <h3>Bevor du das Muster als gewählt bezeichnest</h3>
        <ul class="checklist">
          <li>
            Die Galerie wurde zuerst gefragt, und die Antwort wurde festgehalten &mdash; wiederverwenden, erweitern
            oder ein Grund, warum keins passt.
          </li>
          <li>Das <code>When to use</code> des zuständigen Guides wurde gelesen, nicht aus dem Gedächtnis genommen.</li>
          <li>Das Muster ist die billigste Stufe der Unterbrechungsleiter, die noch funktioniert.</li>
          <li>Alles, was verlinkbar, neu ladbar oder teilbar sein muss, hat eine Route.</li>
          <li>
            Jede Erklärung hat einen Auslöser, den die Tastatur erreicht; kein Hilfetext steckt in einem nativen
            <code>title</code>.
          </li>
          <li>Die Wahl fiel bei der schmalsten Breite, die du unterstützt, nicht bei der Desktop-Breite.</li>
          <li>Die längste Übersetzung jeder Beschriftung passt noch in das Muster, oder das Muster bricht um.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Übersetzung ändert nicht das Verhalten eines Musters; sie ändert, ob das Muster je das richtige war. Drei
          Entscheidungen fallen über die Textlänge, bevor sie über irgendetwas anderes fallen.
        </p>

        <h3>Die Entscheidungen, die ein längerer Text kippt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Muster</th>
                <th>Was der längere Text damit macht</th>
                <th>Die Wahl, die übrig bleibt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Segmented Control</td>
                <td>
                  Die Menge passt nicht mehr in eine Zeile, und das Control bricht entweder zu einem mehrdeutigen Block
                  um oder schiebt die Zeile seitwärts
                </td>
                <td>Ein Select, dessen Breite unabhängig von den Optionsbeschriftungen ist</td>
              </tr>
              <tr>
                <td>Tab-Leiste</td>
                <td>
                  Die Beschriftungen wachsen, die Leiste scrollt, und die Optionen jenseits des Rands hören für jeden auf
                  zu existieren, der nicht nach ihnen sucht
                </td>
                <td>Routen oder gestapelte Abschnitte mit Überschriften</td>
              </tr>
              <tr>
                <td>Control nur mit Icon und Tooltip</td>
                <td>
                  Sichtbar ändert sich nichts &mdash; genau das ist das Risiko: Die ganze Bedeutung hängt jetzt an einem
                  übersetzten Text in einem Overlay
                </td>
                <td>Ein beschriftetes Control, überall dort, wo die Zeile die Breite dafür hat</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Fehlerfälle sind die eigenen Aussagen der zuständigen Guides zur schmalen Breite &mdash; Select Button
          dazu, in eine Zeile zu passen, Tabs zur scrollenden Leiste; das Längenbudget, das sie auslöst, wird in
          <strong>I18n &amp; Lokalisierung</strong> gemessen, und dieser Guide zitiert es, statt es neu zu messen.
        </p>

        <h3>Eine vereinfachte Lesestufe ist eine Sprache, kein Modus</h3>
        <p>
          Eine Variante, die für leichteres Lesen geschrieben ist, ist eine eigene Sprache mit eigenen Texten; sie
          erreicht also dasselbe Muster mit anderem Wortlaut &mdash; manchmal kürzer, manchmal nicht. Zwei Folgen für
          die Auswahl: Ein Muster, dessen Bedeutung ein Icon trägt, verlagert die ganze Last auf den Overlay-Text, also
          genau den Text, auf den ein Leser einer vereinfachten Variante am wenigsten verzichten kann; und ein Muster,
          das Optionen hinter einem Aufklapper versteckt, verlangt von diesem Leser, sich zu merken, was versteckt war.
          Nimm lieber das Muster, das die Wörter auf dem Bildschirm lässt, wenn die Zeile sie sich leisten kann.
        </p>
        <p class="src-note">
          Das Variantenmodell, die Fallback-Kette und das gemessene Ausdehnungsbudget gehören zu
          <strong>I18n &amp; Lokalisierung</strong>; dieser Guide sagt nur, welches Muster dieses Budget ausschließt.
        </p>

        <h3>Was die Auswahl nicht entscheidet</h3>
        <p>
          Wo ein Text liegt, wie ein Key heißt, welche Sprache bei einem Fehltreffer antwortet und was ein nicht
          aufgelöster Key rendert, gehört alles zu <strong>I18n &amp; Lokalisierung</strong>. Die Dokumentsprache, die
          Schreibrichtung und der zugängliche Name, den ein gewähltes Control tragen muss, gehören zu
          <strong>Richtlinien zur Barrierefreiheit</strong>. Dieser Guide verantwortet nur den Schritt vor beiden: ob
          das Muster den Text überhaupt aufnehmen kann.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> &mdash; 23.09.2026 &mdash; Die erklärten Lücken sind neu gefasst: Der
            Bibliotheks-Tooltip, Menu, Accordion und Stepper haben jetzt Guides, also ist die Liste
            <code>planned:</code> nicht mehr die Lücke; die nicht abgedeckten Bibliothekskomponenten sind das, was
            <code>design-guides.mjs coverage</code> ausgibt, und das Regal Layouts beantwortet drei Seitentypen. Die
            Zeile des Kontrast-Gates deckt die Widget-Paare von Optimus UI ab, die es jetzt misst, und die Zeile des
            Key-Gates dessen Parität über vier Varianten.
          </li>
          <li>
            <strong>v0.5</strong> &mdash; 24.08.2026 &mdash; Gegen PrimeNG 22.1.2 neu geprüft: Dieser Guide macht
            keine eigenen Aussagen über das DOM der Bibliothek, also hat sich nur der Herkunftsstand bewegt. Der
            gerenderte Vergleich mit <code>p-card</code> nutzt das Template <code>#header</code> als direktes Kind,
            genau der Weg, der in v22 erhalten bleibt. Die erklärten Lücken (acht <code>planned:</code>-IDs,
            Raster-Rhythmus) gegen die Registry neu geprüft; die Referenzseite <code>/feedback</code> brachte keine
            Verwendung, die einer dokumentierten Grenze widerspricht (ihre PrimeNG-Oberfläche sind
            <code>p-checkbox</code> und <code>p-message</code>, beide nach ihren zuständigen Guides verwendet).
          </li>
          <li>
            <strong>v0.4</strong> &mdash; 18.08.2026 &mdash; Der Herkunftshinweis unter den erklärten Lücken verweist
            für das, was nichts abdeckt, nicht mehr auf die Coverage-Map: Diese Zeile erscheint nur für eine Kategorie
            ohne Guide, und der Korpus hat jetzt keine. Er verweist stattdessen auf die Registry und
            <code>list --json</code>. Der nicht abgedeckte Bereich heißt so, wie der Eintrag darunter ihn schon
            gemeldet hat &mdash; Raster-Rhythmus und Abstands-Komposition.
          </li>
          <li>
            <strong>v0.3</strong> &mdash; 18.08.2026 &mdash; Das Regal <code>layouts</code> ist nicht mehr leer: Der
            Abschnitt zu den erklärten Lücken und die Liste der Grenzen verweisen den Aufbau einer Artikelseite jetzt an
            <strong>Artikel-Layout</strong> und nennen nur Raster-Rhythmus und Abstands-Komposition als noch nicht
            abgedeckt.
          </li>
          <li>
            <strong>v0.2</strong> &mdash; 18.08.2026 &mdash; Korrekturdurchgang. Die Regel zum nativen
            <code>title</code> ist so neu gefasst, wie der HTML-Standard sie fasst: Die zugängliche Bereitstellung wird
            von Browsern <em>verlangt</em>, wird nicht geliefert, und vom Verlass auf das Attribut wird genau deshalb
            abgeraten. Das Quellenzitat wandert zu &sect;&nbsp;3.2.6.1 des Standards, und SC 1.4.13 ist neu eingeordnet
            als der Vertrag, den eine vom Autor gebaute Hover-Blase schuldet &mdash; seine Ausnahme für Browser ist der
            Grund, warum es das native Attribut nicht regelt. Die Obergrenze für einen <code>pTooltip</code>-Text stützt
            sich auf dieses Kriterium und auf die Regel zum zugänglichen Namen, nicht auf verbreitete Praxis. Die
            Flächenhierarchie nennt die drei Primitives, die tatsächlich auf dem Container gebaut sind, und markiert den
            Rest als Geschwister, die sein <code>When not to use</code> anderswohin verweist. Die Drawer-Stufe ist auf
            die Mechanik korrigiert, die dieser Guide festhält: Die Maske hält den Zeiger auf, nichts wird inert, und
            Tab erreicht weiter die Seite dahinter. Die Adressierbarkeit von Overlays weitet sich vom Query-Parameter
            auf die URL, und die Verweiszeile zu Tabs bekommt den Query-Parameter-Zweig zurück, den ihr eigener Guide
            nennt.
          </li>
          <li>
            <strong>v0.1</strong> &mdash; 18.08.2026 &mdash; Erster Guide: die Frage nach den drei Schichten, die fünf
            Bedarfe, die das Kit beantwortet, bevor die Bibliothek erreicht ist, die Verweistabelle zu den zuständigen
            Guides, die Unterbrechungsleiter, die zwei erklärten Lücken im Korpus, die Einschränkungen durch schmale
            Bildschirme und Übersetzung, die eine Wahl kippen, und das kanonische Agenten-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class UiPatternSelectionArticleDeComponent extends UiPatternSelectionArticleComponent {}
