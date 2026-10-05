import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ColorSystemArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './color-system-article.component';

/** Visible status lines of the color-alone demo, in German. */
const CARRIER_DE = {
  shown: 'Beschriftungen sichtbar — der Zustand hat zwei Träger.',
  hidden: 'Beschriftungen ausgeblendet — der Farbton ist jetzt der einzige Träger.',
};

/**
 * German twin of the Color System guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in the demo
 * fields are German. Keep it in step with the English file: same tabs, same element
 * and binding skeleton (`node scripts/check-guide-translations.mjs color-system`).
 */
@Component({
  selector: 'app-color-system-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'color-system'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Farbsystem ist kein Moodboard. Es ist eine Menge von Gründen, eine Menge von Vordergründen und eine Liste,
          welche Paare gemessen wurden. Alles unten rendert im visuellen Stil, im Akzent und im Modus, den du gerade
          ansiehst; jedes Verhältnis daneben ist aus dem Kontrast-Kompilat zitiert, das der Build aus denselben
          Token-Werten neu erzeugt.
        </p>

        <h3>Jeder Grund, mit dem Text, der auf ihm gemessen ist</h3>
        <p>
          Vier Flächen können hinter einem Textlauf liegen, und jeder visuelle Stil bringt pro Modus seine eigenen vier
          mit. Zwei Textrollen werden in jedem Stil gegen alle vier gemessen. Die Zahlen auf den Feldern sind die von
          werkbund; die Tabelle danach nennt das knappste Paar jedes Stils.
        </p>
        <div class="grounds">
          <div class="gr gr--ground">
            <strong>--surface-ground</strong>
            <p class="gr__body">Fließtext, --text-color</p>
            <p class="gr__sec">Begleittext, --text-color-secondary</p>
            <span class="gr__num">werkbund: 17,17:1 &middot; 7,14:1 hell &nbsp;|&nbsp; 16,28:1 &middot; 7,22:1 dunkel</span>
          </div>
          <div class="gr gr--card">
            <strong>--surface-card</strong>
            <p class="gr__body">Fließtext, --text-color</p>
            <p class="gr__sec">Begleittext, --text-color-secondary</p>
            <span class="gr__num">werkbund: 18,73:1 &middot; 7,78:1 hell &nbsp;|&nbsp; 14,86:1 &middot; 6,59:1 dunkel</span>
          </div>
          <div class="gr gr--section">
            <strong>--surface-section</strong>
            <p class="gr__body">Fließtext, --text-color</p>
            <p class="gr__sec">Begleittext, --text-color-secondary</p>
            <span class="gr__num">werkbund: 16,00:1 &middot; 6,65:1 hell &nbsp;|&nbsp; 13,32:1 &middot; 5,91:1 dunkel</span>
          </div>
          <div class="gr gr--hover">
            <strong>--surface-hover</strong>
            <p class="gr__body">Fließtext, --text-color</p>
            <p class="gr__sec">Begleittext, --text-color-secondary</p>
            <span class="gr__num">werkbund: 15,56:1 &middot; 6,47:1 hell &nbsp;|&nbsp; 13,32:1 &middot; 5,91:1 dunkel</span>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <caption>
              Knappstes Fließtext-Paar pro visuellem Stil — immer
              <code>--text-color-secondary</code>, auf dem genannten Grund
            </caption>
            <thead>
              <tr>
                <th>Stil</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>6,47:1 auf <code>--surface-hover</code></td>
                <td>5,91:1 auf <code>--surface-section</code> / <code>--surface-hover</code></td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>5,06:1 auf <code>--surface-hover</code></td>
                <td>5,46:1 auf <code>--surface-hover</code></td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>4,57:1 auf <code>--surface-hover</code></td>
                <td>4,57:1 auf <code>--surface-hover</code></td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>4,55:1 auf <code>--surface-hover</code></td>
                <td>4,84:1 auf <code>--surface-hover</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Verhältnisse aus <code>docs/generated/CONTRAST.MD</code>, Gruppe „body text“, eine Tabelle pro Stil und Modus;
          SC 1.4.3 verlangt 4,5:1. Die Flächen- und Textwerte sind die <code>surfaces</code> jedes Stils in
          <code>src/app/services/ui-styles.ts</code>.
        </p>

        <h3>Die sechs semantischen Farbtöne, im Fließtext</h3>
        <p>
          Das sind die eigenen Tinten des Kits: ein Wert pro Modus, in jedem Stil derselbe, und gemessen auf dem Grund
          und der Card aller vier Stile. Sie sind Vordergründe:
          <span class="sem sem--blue">Blau</span>, <span class="sem sem--orange">Orange</span>,
          <span class="sem sem--green">Grün</span>, <span class="sem sem--red">Rot</span>,
          <span class="sem sem--cyan">Cyan</span> und <span class="sem sem--pink">Pink</span> — Hervorhebungen
          mitten im laufenden Text und der Severity-Text von Buttons, Badges und Messages.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Hell</th>
                <th>werkbund Grund / Card</th>
                <th>Dunkel</th>
                <th>werkbund Grund / Card</th>
                <th>Dunkel, Minimum über vier Stile</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--semantic-blue-fg</code></td>
                <td><code>#1d4ed8</code></td>
                <td>6,14:1 / 6,70:1</td>
                <td><code>#93c5fd</code></td>
                <td>10,20:1 / 9,32:1</td>
                <td>7,28:1</td>
              </tr>
              <tr>
                <td><code>--semantic-orange-fg</code></td>
                <td><code>#c2410c</code></td>
                <td>4,75:1 / 5,18:1</td>
                <td><code>#fdba74</code></td>
                <td>10,91:1 / 9,96:1</td>
                <td>7,79:1</td>
              </tr>
              <tr>
                <td><code>--semantic-green-fg</code></td>
                <td><code>#15803d</code></td>
                <td>4,60:1 / 5,02:1</td>
                <td><code>#86efac</code></td>
                <td>13,10:1 / 11,97:1</td>
                <td>9,35:1</td>
              </tr>
              <tr>
                <td><code>--semantic-red-fg</code></td>
                <td><code>#b91c1c</code></td>
                <td>5,93:1 / 6,47:1</td>
                <td><code>#fca5a5</code></td>
                <td>9,69:1 / 8,85:1</td>
                <td>6,92:1</td>
              </tr>
              <tr>
                <td><code>--semantic-cyan-fg</code></td>
                <td><code>#0e7490</code></td>
                <td>4,91:1 / 5,36:1</td>
                <td><code>#67e8f9</code></td>
                <td>12,69:1 / 11,59:1</td>
                <td>9,06:1</td>
              </tr>
              <tr>
                <td><code>--semantic-pink-fg</code></td>
                <td><code>#be185d</code></td>
                <td>5,53:1 / 6,04:1</td>
                <td><code>#f9a8d4</code></td>
                <td>10,15:1 / 9,26:1</td>
                <td>7,24:1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus den Blöcken <code>:root</code> und <code>.dark-theme</code> in <code>styles.scss</code>; Verhältnisse
          aus <code>docs/generated/CONTRAST.MD</code>, Gruppe „semantic text“. Der helle Grund von werkbund ist der
          dunkelste helle Grund der vier Stile, darum ist seine helle Spalte zugleich das Minimum über vier Stile; das
          dunkle Minimum hat blaupause, auf seiner Card.
        </p>

        <h3>Zwei Skalen namens primary: die des Stils und die des Akzents</h3>
        <p>
          Beide Farbfelder unten malt je eine einzige Deklaration. Das linke liest eine Stufe von
          <code>--primary-&lt;step&gt;</code>, die der Theme-Service aus der Markenskala des aktiven visuellen Stils füllt;
          das rechte liest die Hintergrundrolle des Akzents. Wechsle den Akzent, und nur das rechte bewegt sich; wechsle
          den visuellen Stil, und nur das linke.
        </p>
        <div class="demo2">
          <figure class="swatch-fig">
            <div class="swatch swatch--palette"></div>
            <figcaption><code>var(--primary-500)</code> — die Marke des Stils</figcaption>
          </figure>
          <figure class="swatch-fig">
            <div class="swatch swatch--brand"></div>
            <figcaption><code>var(--primary-bg)</code> — der Akzent</figcaption>
          </figure>
        </div>
        <pre class="code-block"><code>{{ amberSnippet }}</code></pre>
        <p class="src-note">
          <code>--primary-50</code>…<code>--primary-900</code> werden aus <code>brandScale</code> des aktiven Stils in
          <code>theme.service.ts</code> geschrieben (<code>buildTokenMaps</code>); das Amber der statischen Palette,
          <code>#f59e0b</code>, ist nur zu sehen, bevor der Service zum ersten Mal läuft. <code>--primary-bg</code> wird
          pro Akzent und Modus aus <code>THEME_COLORS</code> geschrieben; <code>--primary-color</code> ist sein Alias und
          der Name, den das Kontrast-Kompilat verwendet.
        </p>

        <h3>Farbton allein, und Farbton mit einem zweiten Träger</h3>
        <p>
          Die Zeile unten rendert zwei Zustände. Drück den Button, um die Beschriftungen wegzunehmen und nur die Farbe zu
          behalten — der Unterschied ist das, was einem Leser in einem Forced-Colors-Modus, bei einem Graustufendruck
          oder mit einer Rot-Grün-Sehschwäche bleibt.
        </p>
        <div class="insp">
          <button pButton type="button" (click)="toggleLabels()">
            <span pButtonLabel>{{ labelsOn() ? 'Beschriftungen ausblenden' : 'Beschriftungen einblenden' }}</span>
          </button>
          <p class="insp__state" role="status">{{ carrierState() }}</p>
        </div>
        <div class="states">
          <span class="st st--ok"
            ><span class="st__dot"></span>
            @if (labelsOn()) {
              Bestanden
            }
          </span>
          <span class="st st--warn"
            ><span class="st__dot"></span>
            @if (labelsOn()) {
              Prüfen
            }
          </span>
          <span class="st st--bad"
            ><span class="st__dot"></span>
            @if (labelsOn()) {
              Fehlgeschlagen
            }
          </span>
        </div>
        <p class="src-note">
          Die Punkte sind mit <code>--semantic-green-fg</code>, <code>--semantic-orange-fg</code> und
          <code>--semantic-red-fg</code> gemalt; dieser Block ist Live-Ausgabe, keine Referenztabelle.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Eine Farbe zu wählen heißt hier zwei Entscheidungen: welche Rolle das Ding spielt und auf welchem Grund es
          stehen wird. Triffst du beide richtig, ist das Paar schon gemessen — in jedem Stil, Modus und Akzent; liegst du
          bei der zweiten falsch, gibt es keine Zahl, auf die du dich stützen kannst, egal wie die erste ausfiel.
        </p>

        <h3>Drei Fragen, der Reihe nach</h3>
        <ul>
          <li>
            <strong>Ist es Text, eine Füllung, eine Kante oder Fokus?</strong> Text nimmt eine <code>*-fg</code>- oder
            <code>--text-color*</code>-Rolle, eine Füllung nimmt <code>--primary-bg</code> / <code>--accent-surface</code> /
            ein <code>--surface-*</code>, die Kante eines Controls nimmt <code>--control-border</code>, der Tastaturfokus
            nimmt den einen Ring des Kits in <code>--primary-color-fg</code>.
          </li>
          <li>
            <strong>Welcher Grund liegt dahinter?</strong> Das entscheidet über die Zeile der Tabelle unten und damit
            darüber, ob es überhaupt eine Zahl gibt.
          </li>
          <li>
            <strong>Trägt die Farbe Bedeutung?</strong> Dann braucht sie neben dem Farbton einen zweiten Träger — ein
            Wort, ein Icon, eine Form.
          </li>
        </ul>

        <h3>Welches Token für welche Aufgabe</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aufgabe</th>
                <th>Token, auf seinem Grund</th>
                <th>CONTRAST.MD-Gruppe</th>
                <th>Knappste Zeile, hell / dunkel</th>
                <th>SC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fließtext</td>
                <td><code>--text-color</code> auf jeder der vier Flächen</td>
                <td>body text</td>
                <td>9,96:1 / 8,81:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Begleittext, Feld-Icons</td>
                <td><code>--text-color-secondary</code> auf jeder der vier Flächen</td>
                <td>body text, form field icon</td>
                <td>4,55:1 / 4,57:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Hervorhebung im Text, Severity-Text</td>
                <td><code>--semantic-&lt;hue&gt;-fg</code> auf <code>--surface-ground</code> / <code>--surface-card</code></td>
                <td>semantic text, text &amp; link button, message &amp; toast</td>
                <td>4,60:1 / 5,92:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Link, Titel, Icon, Outlined-Kante</td>
                <td>
                  <code>--primary-color-fg</code>, <code>--gradient-accent-color-fg</code> auf
                  <code>--surface-ground</code> / <code>--surface-card</code>
                </td>
                <td>brand foreground</td>
                <td>4,51:1 / 4,75:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Beschriftung auf dem gefüllten Button</td>
                <td>
                  <code>--primary-color-text</code> auf beiden Stopps von <code>--primary-color</code> →
                  <code>--gradient-accent-color</code>
                </td>
                <td>filled button (hover)</td>
                <td>4,73:1 / 6,33:1 mit Hover</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Getöntes Panel und sein Text</td>
                <td><code>--accent-on-surface</code> auf <code>--accent-surface</code></td>
                <td>accent surface</td>
                <td>7,62:1 / 9,53:1</td>
                <td>1.4.3</td>
              </tr>
              <tr>
                <td>Kante von Feld, Checkbox, Radio, Switch, Slider</td>
                <td><code>--control-border</code> auf Grund, Card, Section</td>
                <td>control boundary, checkbox &amp; radiobutton, toggleswitch</td>
                <td>3,64:1 / 3,25:1</td>
                <td>1.4.11</td>
              </tr>
              <tr>
                <td>Tastaturfokus</td>
                <td>2px-Ring in <code>--primary-color-fg</code> auf jeder Fläche, nach innen gesetzt auf einer gewählten Zeile</td>
                <td>focus ring, menu focus</td>
                <td>4,42:1 / 3,52:1</td>
                <td>1.4.11</td>
              </tr>
              <tr>
                <td>Kante eines ungültigen Felds</td>
                <td><code>--semantic-red-fg</code> auf dem Grund des Felds</td>
                <td>form field edge</td>
                <td>5,93:1 / 5,66:1</td>
                <td>1.4.11</td>
              </tr>
              <tr>
                <td>Gewählte Tabellenzeile</td>
                <td>4px-Balken in <code>--primary-color-fg</code> auf der Zeilentönung</td>
                <td>table &amp; paginator</td>
                <td>5,14:1 / 3,52:1</td>
                <td>1.4.11</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Jede Zahl ist aus <code>docs/generated/CONTRAST.MD</code> zitiert: die niedrigste Zeile dieser Aufgabe über die
          vier visuellen Stile, beide Modi wie angegeben, und über die zehn Akzente, wo das Token vom Akzent abhängt. Einen
          einzelnen Stil und Akzent schlägst du in den eigenen Tabellen des Kompilats nach.
        </p>
        <p>
          <strong>Eine Paarung außerhalb dieser Tabelle ist ungemessen, nicht freigegeben.</strong> Die semantischen
          Farbtöne und die Marken-Vordergründe sind nur auf <code>--surface-ground</code> und <code>--surface-card</code>
          gemessen — setz einen davon auf <code>--surface-section</code>, und das Kompilat sagt dazu nichts.
        </p>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — den Farbton allein die Botschaft tragen lassen</span>
            <div class="dd__stage">
              <span class="st st--ok"><span class="st__dot"></span></span>
              <span class="st st--bad"><span class="st__dot"></span></span>
            </div>
            <p class="dd__why">
              In einem Forced-Colors-Modus ersetzt das Betriebssystem beide Werte, und in Graustufen oder bei einer
              Rot-Grün-Sehschwäche sind die zwei Punkte zweimal derselbe Punkt — der Zustand hat keinen anderen Träger,
              auf den er zurückfallen kann (SC 1.4.1).
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Farbton plus ein Wort</span>
            <div class="dd__stage">
              <span class="st st--ok"><span class="st__dot"></span>Bestanden</span>
              <span class="st st--bad"><span class="st__dot"></span>Fehlgeschlagen</span>
            </div>
            <p class="dd__why">
              Die Farbe bleibt der schnelle Kanal für alle, die ihn nutzen können, und die Beschriftung ist das, was eine
              ersetzte Palette, einen Schwarz-Weiß-Druck und einen Screenreader übersteht.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Vordergrund-Tinte als Füllung unter Weiß verwenden</span>
            <div class="dd__stage">
              <code class="dd__code">background: var(--semantic-red-fg); color: #fff;</code>
            </div>
            <p class="dd__why">
              Im dunklen Modus ist diese Tinte das blasse <code>#fca5a5</code>, und Weiß darauf wurde nie gemessen. Das
              Badge des Kits füllt mit derselben Tinte nur, weil es die Beschriftung im Dunkeln auf die 950er-Stufe des
              Farbtons umstellt — ein Paar, das das Gate unter „badge“ führt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — lass sie ein Vordergrund bleiben</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--semantic-red-fg);</code>
            </div>
            <p class="dd__why">
              Auf einer Card sind das unter werkbund 6,47:1 im Hellen und 8,85:1 im Dunkeln, und in keinem Stil und
              keinem Modus unter 6,47:1, gegenüber den 4,5:1 von SC 1.4.3 — eine Zeile des Kompilats statt einer Annahme.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Markenstufe des Stils für den Akzent lesen</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-500);</code>
            </div>
            <p class="dd__why">
              Diese Stufe gehört zur Markenskala des visuellen Stils: Sie bleibt stehen, wenn der Leser den Akzent
              wechselt, kippt nicht mit dem Modus, und kein Paar misst sie als Text.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die Vordergrundrolle des Akzents lesen</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-fg);</code>
            </div>
            <p class="dd__why">
              Pro Akzent und Modus geschrieben und für alle zehn Paletten in jedem Stil gegen beide Gründe gemessen —
              im Kompilat unter seinem wertgleichen Alias <code>--primary-color-fg</code>, dessen knappste Zeile in beiden
              Modi 4,75:1 ist.
            </p>
          </div>
        </div>

        <h3>Quellen</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            — die Schwelle von 4,5:1 für jede Textzeile oben.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — die Schwelle von 3:1 für Control-Kanten, den Fokus-Ring und den Balken der gewählten Zeile.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — warum ein Zustand neben seinem Farbton einen Träger braucht.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Jede Farbe auf dem Bildschirm stammt aus einer von wenigen Token-Familien, und sie unterscheiden sich in den
          zwei Eigenschaften, die für eine Entscheidung zählen: welche Achse den Wert bewegt — visueller Stil, Akzent oder
          Modus — und ob das Gate gemessen hat, was darauf stehen darf.
        </p>

        <h3>Von Aura bis auf den Bildschirm: die Token-Schichten</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Schicht</th>
                <th>Beispiele</th>
                <th>Bewegt sich mit</th>
                <th>Geschrieben in</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aura-Primitives</td>
                <td><code>--p-green-500</code>, <code>--p-slate-300</code></td>
                <td>nichts — feste Farbton-Rampen</td>
                <td>dem Aura-Preset</td>
              </tr>
              <tr>
                <td>Aura-Semantik</td>
                <td><code>--p-primary-color</code>, <code>--p-surface-200</code>, <code>--p-content-background</code></td>
                <td>Modus; <code>primary</code> auch mit dem Akzent</td>
                <td>Aura, mit <code>semantic.primary</code> ersetzt durch <code>widgetPrimarySemantic</code></td>
              </tr>
              <tr>
                <td>Aura-Komponente</td>
                <td><code>--p-checkbox-border-color</code>, <code>--p-message-warn-color</code></td>
                <td>Modus, und womit auch immer das Kit es umlenkt</td>
                <td>Aura, plus das Button-Delta des Stils; umgelenkt in <code>styles.scss</code></td>
              </tr>
              <tr>
                <td>Rollen-Tokens des Kits</td>
                <td><code>--surface-*</code>, <code>--text-color*</code>, <code>--control-border</code></td>
                <td>visuellem Stil × Modus</td>
                <td><code>surfaces</code> in <code>ui-styles.ts</code>, inline auf <code>&lt;html&gt;</code></td>
              </tr>
              <tr>
                <td>Akzentrollen des Kits</td>
                <td><code>--primary-bg</code>, <code>--primary-fg</code>, <code>--accent-surface</code></td>
                <td>Akzent × Modus</td>
                <td><code>THEME_COLORS</code> in <code>theme.service.ts</code>, inline auf <code>&lt;html&gt;</code></td>
              </tr>
              <tr>
                <td>Tinten des Kits</td>
                <td><code>--semantic-&lt;hue&gt;-fg</code></td>
                <td>nur dem Modus</td>
                <td><code>styles.scss</code>, <code>:root</code> und <code>.dark-theme</code></td>
              </tr>
              <tr>
                <td>Statische Palette</td>
                <td><code>--blue-500</code>, <code>--color-blue-500</code></td>
                <td>nichts — außer <code>--primary-&lt;step&gt;</code>, überschrieben von der Markenskala des Stils</td>
                <td><code>design-tokens.scss</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das Preset ist <code>definePreset(Aura, style.presetOverrides)</code>, zusammengeführt mit der Akzent-Rampe in
          <code>applyTheme</code>, <code>theme.service.ts</code>; die Rollen- und Akzent-Tokens des Kits sind
          <code>buildTokenMaps</code> in derselben Datei. Die statische Palette ist die Map <code>$colors</code>: 122
          Einträge, jeder ausgegeben als <code>--color-&lt;name&gt;</code> und <code>--&lt;name&gt;</code>, ohne dunkles
          Gegenstück. Wo jede Schicht in der Kaskade sitzt, steht im Guide zu Design-Tokens.
        </p>

        <h3>Die Kit-Tokens, auf die die Widgets umgelenkt sind</h3>
        <p>
          Die Standard-Widgetfarben von Aura wurden für die eigenen Slate- und Zinc-Flächen von Aura gewählt.
          <code>styles.scss</code> lenkt jede Widget-Rolle, die Bedeutung trägt, stattdessen auf ein Kit-Token um, auf
          dem eigenen Selektor der Komponente, und das Gate misst das Widget mit angewandter Umlenkung. Sechs Kit-Tokens
          erledigen fast die ganze Arbeit:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kit-Token</th>
                <th>Widget-Rollen, die es trägt</th>
                <th>CONTRAST.MD-Gruppen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--control-border</code></td>
                <td>
                  Feldkanten (Text-Inputs, Select, Multiselect, Autocomplete, Input Number, Cascade Select, Listbox),
                  Kante von Checkbox und Radio, Track des ausgeschalteten Switch, Slider-Track und Ring des Griffs
                </td>
                <td>form field edge, checkbox &amp; radiobutton, toggleswitch, progressbar &amp; slider</td>
              </tr>
              <tr>
                <td><code>--primary-color-fg</code></td>
                <td>
                  der eine 2px-Fokus-Ring auf jedem fokussierbaren Optimus-Teil (innerhalb des Teils gezeichnet, wo sein
                  Container abschneidet), der Balken der gewählten Zeile, die gedrückte Toggle-Pille, der Progress Spinner
                </td>
                <td>focus ring, menu focus, table &amp; paginator, togglebutton &amp; selectbutton, progress spinner</td>
              </tr>
              <tr>
                <td><code>--semantic-&lt;hue&gt;-fg</code></td>
                <td>jede ungültige Kante (Rot), Severity-Text-Buttons, Badge-Füllungen, Text von Message und Toast</td>
                <td>form field edge, text &amp; link button, badge, message &amp; toast</td>
              </tr>
              <tr>
                <td><code>--text-color-secondary</code></td>
                <td>Chevrons und Lösch-Icons in Feldern, Untermenü-Chevrons, der sekundäre Text-Button, Hover von Switch und Slider</td>
                <td>form field icon, menu focus, text &amp; link button</td>
              </tr>
              <tr>
                <td><code>--surface-card</code></td>
                <td>Griffe von Switch und Slider, Füllungen von Tabelle und Paginator</td>
                <td>toggleswitch, progressbar &amp; slider, table &amp; paginator</td>
              </tr>
              <tr>
                <td><code>--style-outline</code></td>
                <td>Popover-Rahmen, Drawer-Umriss und die Signaturkante von Text-Inputs — die eigene Tinte des Stils</td>
                <td>panel outline, form field edge</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Umlenkungen sind die Regeln auf Komponenten-Selektoren in <code>styles.scss</code> (<code>.p-checkbox</code>,
          <code>.p-toggleswitch</code>, <code>.p-slider</code>, <code>.p-message</code>, die Fokus-Ring-Regel des Kits und
          ihre Selektorliste); <code>scripts/check-contrast.mjs</code> liest dieselben Regeln und löst die Token-Module von
          Aura aus <code>&#64;openng/optimus-ui-themes/dist/aura</code> mit ihnen angewandt auf.
        </p>

        <h3>Die Akzentpaletten tragen zwei Rollen, nicht eine Farbe</h3>
        <p>
          Jede der zehn Paletten hält acht Werte: eine Hintergrundrolle für Füllungen und Verlaufsstopps, eine
          Vordergrundrolle für Links, Titel, Icons, Outlined-Kanten und den Fokus-Ring, jede in einer hellen und einer
          dunklen Variante. Die Vordergrundwerte sind <strong>pro Palette kuratiert, nicht abgeleitet</strong> aus den
          Hintergrundwerten — das sieht man in der Tabelle: Im hellen Modus fallen die beiden Rollen in allen zehn
          Paletten zusammen, im dunklen weichen sie in neun voneinander ab. <code>contrast</code> ist die eine, die in
          beiden Modi zusammenfällt, weil ihr ganzes Design ein einziger Helligkeitspol pro Modus ist.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Palette</th>
                <th>Hintergrund, hell</th>
                <th>Hintergrund, dunkel</th>
                <th>Vordergrund, hell</th>
                <th>Vordergrund, dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>sunset</td>
                <td><code>#c2410c</code></td>
                <td><code>#9a3412</code></td>
                <td><code>#c2410c</code></td>
                <td><code>#fb923c</code></td>
              </tr>
              <tr>
                <td>fire</td>
                <td><code>#cd1d1d</code></td>
                <td><code>#a71818</code></td>
                <td><code>#cd1d1d</code></td>
                <td><code>#f87171</code></td>
              </tr>
              <tr>
                <td>coral</td>
                <td><code>#a8124e</code></td>
                <td><code>#880f3f</code></td>
                <td><code>#a8124e</code></td>
                <td><code>#f472b6</code></td>
              </tr>
              <tr>
                <td>forest</td>
                <td><code>#157836</code></td>
                <td><code>#11612c</code></td>
                <td><code>#157836</code></td>
                <td><code>#4ade80</code></td>
              </tr>
              <tr>
                <td>ocean</td>
                <td><code>#0a756d</code></td>
                <td><code>#086058</code></td>
                <td><code>#0a756d</code></td>
                <td><code>#2dd4bf</code></td>
              </tr>
              <tr>
                <td>aurora</td>
                <td><code>#077288</code></td>
                <td><code>#065d6e</code></td>
                <td><code>#077288</code></td>
                <td><code>#22d3ee</code></td>
              </tr>
              <tr>
                <td>twilight</td>
                <td><code>#3346d3</code></td>
                <td><code>#2638b0</code></td>
                <td><code>#3346d3</code></td>
                <td><code>#85a7ff</code></td>
              </tr>
              <tr>
                <td>mystic</td>
                <td><code>#b8147f</code></td>
                <td><code>#9a116a</code></td>
                <td><code>#b8147f</code></td>
                <td><code>#f9a8d4</code></td>
              </tr>
              <tr>
                <td>stone</td>
                <td><code>#776558</code></td>
                <td><code>#605247</code></td>
                <td><code>#776558</code></td>
                <td><code>#d6d3d1</code></td>
              </tr>
              <tr>
                <td>contrast</td>
                <td><code>#0f172a</code></td>
                <td><code>#f8fafc</code></td>
                <td><code>#0f172a</code></td>
                <td><code>#f8fafc</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das Primary-Paar von <code>THEME_COLORS</code> in <code>theme.service.ts</code>; das Akzent-Paar hat dieselbe
          Form und dieselbe Aufteilung in hell und dunkel. Die Widget-Rampe, die Aura übergeben wird
          (<code>--p-primary-50</code>…<code
            >950</code
          >), ist im hellen Modus aus dem hellen <strong>Hintergrund</strong>wert abgeleitet und im dunklen aus dem dunklen
          <strong>Vordergrund</strong>wert, wo <code>primary.color</code> von Aura auf diese 500er-Stufe zeigt — darum
          trägt eine angehakte Checkbox, ein Badge oder ein primärer Text-Button im Dunkeln dieselbe Farbe wie
          <code>--primary-color-fg</code> (<code>widgetPrimarySemantic</code>).
        </p>

        <h3>Was das Gate misst</h3>
        <p>
          <code>scripts/check-contrast.mjs</code> bildet jedes Paar für jeden visuellen Stil × Modus, und pro Akzent, wo
          das Paar davon abhängt, und lässt den Build scheitern, wenn eines sein Kriterium verfehlt oder das Kompilat
          veraltet ist. Die Gruppen fallen in zwei Familien:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Familie</th>
                <th>Gruppen</th>
                <th>Gelesen aus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kit-Tokens</td>
                <td>
                  body text, semantic text, control boundary, brand foreground, filled button und sein Hover, accent
                  surface, severity button und sein Hover, outlined severity, brand chip, floating action button, field
                  placeholder, dev toggle
                </td>
                <td><code>ui-styles.ts</code>, <code>styles.scss</code>, <code>THEME_COLORS</code></td>
              </tr>
              <tr>
                <td>Optimus-Widgets</td>
                <td>
                  checkbox &amp; radiobutton, toggleswitch, form field edge / text / icon, float label, tag, chip, dialog,
                  skeleton, progressbar &amp; slider, togglebutton &amp; selectbutton, menu focus, panel outline, content
                  panel, table &amp; paginator, badge, message &amp; toast, text &amp; link button, filled button
                  (contrast), avatar, image preview, focus ring, progress spinner
                </td>
                <td>den Token-Modulen von Aura, mit der Akzent-Rampe und jeder Umlenkung aus <code>styles.scss</code> angewandt</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Gruppennamen sind die <code>####</code>-Überschriften von <code>docs/generated/CONTRAST.MD</code>, dessen
          Kopf die gemessene Gesamtzahl und die Zahl der deklarierten Ausnahmen nennt — null. Welches Kriterium für eine
          Gruppe gilt, wird aus der Rolle entschieden, die sie spielt, und im Script daneben festgehalten. Dekoration ist
          als informativ geführt (SC „none“): das Skeleton, der Progress-Track, die Zeilen- und Panel-Füllungen.
        </p>

        <h3>Die Beschriftung des gefüllten Buttons wird lockerer gewählt, als sie beurteilt wird</h3>
        <p>
          Ein gefüllter Button malt einen Verlauf zwischen zwei Akzent-Stopps, und die Laufzeit wählt zwischen einer
          weißen und einer dunklen Beschriftung, indem sie Weiß mit der
          <strong>durchschnittlichen</strong> Helligkeit der beiden Stopps bei einer Schwelle von <strong>3:1</strong>
          vergleicht. Das Gate akzeptiert diese Begründung nicht: Die Beschriftung ist Text in normaler Größe, also misst
          es die gewählte Farbe gegen <strong>jeden</strong> Stopp bei <strong>4,5:1</strong>, in Ruhe und unter dem
          Hover-Filter — ein Durchschnitt kann das Ende eines Verlaufs, das der Text tatsächlich kreuzt, nicht retten.
          Jeder Akzent schafft es heute: 4,92:1 als knappster Wert in Ruhe im Hellen und 6,75:1 im Dunkeln, 4,73:1 und
          6,33:1 mit Hover. Die Heuristik hat das nicht belegt; die Messungen haben es.
        </p>
        <p class="src-note">
          Die Auswahl trifft <code>getOptimalTextColor</code> in <code>theme.service.ts</code>, die Hover-Richtung
          <code>hoverBrightnessFor</code> in <code>ui-styles.ts</code>; die Messung an zwei Stopps sind die Gruppen „filled button“ und „filled button (hover)“
          von <code>docs/generated/CONTRAST.MD</code>.
        </p>

        <h3>Wo die Farben ihr Kriterium verfehlen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Verhältnis</th>
                <th>Braucht</th>
                <th>SC</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4">Nirgends. Jedes gemessene Paar erfüllt sein Kriterium, Kit-Tokens und Widgets gleichermaßen.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Das Register ist aus Entscheidung leer, nicht aus Versehen: Ein Paar, das verfehlt, wird mit einem Kit-Token
          behoben — so wie der Switch-Track, der Slider und die dunkle Widget-Rampe — oder mit Begründung deklariert, nie
          mit neuer Schwelle versehen. Eine Control-Kante, die mit dem dekorativen <code>--surface-border</code>
          gezeichnet ist, ist ein Fehler, keine Ausnahme.
        </p>
        <p class="src-note">
          Die Ausnahmetabelle von <code>docs/generated/CONTRAST.MD</code>; die beiden Register sind
          <code>KNOWN_EXCEPTIONS</code> und <code>KNOWN_EXCEPTION_RULES</code> in <code>scripts/check-contrast.mjs</code>,
          beide leer.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          <strong>Keine Farbe in diesem Kit reagiert auf die Viewport-Breite.</strong> Das kompilierte globale Stylesheet
          hat Viewport-Breakpoints bei 768, 640 und 600 px, und kein einziger davon deklariert eine Custom Property — sie
          bewegen Layout, nie einen Farbwert. Der einzige Media-Block, der überhaupt Tokens neu definiert, ist der
          Druckzweig, dessen Mechanik in den Guide zu Design-Tokens gehört; druckst du aus dem dunklen Modus, wendet
          <code>ThemeService</code> selbst die helle Variante von Stil und Akzent des Lesers an, also druckt eine Seite
          immer auf hellem Papier. Was daraus für dich folgt: Ein Paar, das du bei 1.440 px geprüft hast, ist dasselbe
          Paar bei 360 px, es gibt also auf dem Smartphone nichts nachzuprüfen, und ebenso nichts, was dich rettet — es
          gibt keine hellere „Mobile-Palette“, auf die man zurückfallen könnte. Zwei weitere Umgebungen solltest du
          kennen: Der eine Block <code>prefers-contrast: high</code> passt eine Regel an statt eines Tokens, und der eine
          Block <code>forced-colors: active</code> malt den Balken der gewählten Zeile in der Systemfarbe
          <code>Highlight</code>; überall sonst ersetzt das Betriebssystem die Palette ganz durch seine eigene.
        </p>
        <p class="src-note">
          Die Media-Blöcke von <code>src/styles.scss</code>: Nur der Druckzweig deklariert Custom Properties — die
          Breakpoints bei 768 / 640 / 600 px, der Block <code>prefers-contrast</code> und der Block
          <code>forced-colors</code> deklarieren keine.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Eine Farbänderung ist nie nur eine Farbänderung: Der Wert, das Paar, das er erzeugt, und das Kompilat, das es
          festhält, bewegen sich zusammen, in einem Commit.
        </p>

        <h3>Wohin eine neue Farbe gehört</h3>
        <ul>
          <li>
            <strong>Sie unterscheidet sich pro visuellem Stil</strong> — ein Feld des Stils in <code>ui-styles.ts</code>,
            für beide Modi aller vier Stile. Das Gate liest diese Datei als Text, nach dem Parser-Vertrag in ihrem Kopf.
          </li>
          <li>
            <strong>Sie unterscheidet sich pro Akzent</strong> — <code>THEME_COLORS</code> in <code>theme.service.ts</code>,
            beide Rollen, beide Modi.
          </li>
          <li>
            <strong>Sie ist eine Tinte für das ganze Kit</strong> — <code>styles.scss</code>, im Block <code>:root</code>
            und im Block <code>.dark-theme</code>, so wie <code>--semantic-&lt;hue&gt;-fg</code> deklariert ist.
          </li>
          <li>
            <strong>Sie färbt ein Optimus-Widget um</strong> — lenk das Komponenten-Token auf eines der Kit-Tokens oben
            um, auf dem eigenen Selektor der Komponente, und stell sicher, dass das Gate diese Regel liest.
          </li>
        </ul>

        <h3>Eine Farbe hinzufügen, die das Gate misst</h3>
        <pre class="code-block"><code>{{ addColorSnippet }}</code></pre>
        <p>
          Schritt 2 ist der, den man leicht überspringt und der teuer wird, wenn man ihn überspringt. Ein Token ohne Paar
          ist eine Farbe, die niemand misst; sie sieht im Stil und Modus, in dem du gearbeitet hast, gut aus und bleibt
          in den anderen unbemerkt, bis ein Leser sie meldet.
        </p>

        <h3>Ein Verhältnis zitieren</h3>
        <pre class="code-block"><code>{{ citeSnippet }}</code></pre>
        <p>
          Eine zitierte Zahl veraltet laut, weil das Kompilat bei jedem Build neu erzeugt wird und der Drift-Check
          anschlägt. Eine Zahl, die aus einem Color Picker abgetippt wurde, veraltet still, und der Seite ist nicht
          anzusehen, welche der beiden du gerade liest — darum nennt das Zitat das Paar, den Stil und das Kriterium, nicht
          das Werkzeug.
        </p>

        <h3>Wenn ein Paar noch nicht bestehen kann</h3>
        <pre class="code-block"><code>{{ exceptionSnippet }}</code></pre>
        <p>
          Der Mechanismus hat zwei Schneiden, und beide sind tragend. Ein durchfallendes Paar, das nicht deklariert ist,
          lässt den Build scheitern. Ein deklariertes Paar, das inzwischen besteht, lässt den Build ebenfalls scheitern,
          und ebenso ein Eintrag, dessen ID zu keinem gemessenen Paar mehr passt — weil eine Ausnahme, die niemand
          entfernt, eine falsche Aussage darüber ist, wo das Kit steht. Stattdessen die Schwelle zu senken, würde das Gate
          für jedes andere Paar mit derselben Rolle blind machen.
        </p>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>Jede Farbe kommt aus einem Rollen-Token, nicht aus einer Palettenstufe oder einem Literal.</li>
          <li>Jede Kombination aus Vordergrund und Grund steht in der Aufgaben-Tabelle oder in einer Zeile des Kompilats.</li>
          <li>Ein stilabhängiger Wert existiert in allen vier Stilen, beiden Modi; ein kitweiter in beiden Blöcken.</li>
          <li>Das Kontrast-Gate lief im selben Commit erneut mit seinem Schreib-Flag.</li>
          <li>Eine neue Farbrolle hat ein Paar im Gate, nicht nur einen Wert im Stylesheet.</li>
          <li>Jeder Zustand hat neben seinem Farbton einen Träger.</li>
          <li>Jede Control-Kante zeichnet <code>--control-border</code>, nie <code>--surface-border</code> allein.</li>
          <li>Jedes Verhältnis in der Änderung ist aus dem Kompilat zitiert.</li>
          <li>Geprüft unter einem zweiten visuellen Stil und einem zweiten Akzent, nicht nur unter den Standards.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Nichts in diesem System wird übersetzt — ein Farb-Token hält einen Wert, und ein Wert hat keine Sprache. Was
          sich zwischen Locales ändert, ist, was eine Farbe bedeuten soll, und das ist eine Designentscheidung, die die
          Token-Schicht dir bewusst nicht abnimmt.
        </p>

        <h3>Die Farbton-Tokens sind nach Farbtönen benannt, nicht nach Bedeutungen</h3>
        <p>
          Die sechs Tinten heißen <code>--semantic-blue-fg</code> und Geschwister, nicht <code>--error-fg</code> oder
          <code>--success-fg</code>. Diese Benennung ist die ehrliche: Die Verbindung zwischen einem Farbton und einer
          Bedeutung ist eine Konvention, und Konventionen unterscheiden sich zwischen Zielgruppen und Kulturen — Rot als
          Gefahr, Rot als Fest, Grün als sicher, Grün als unerfahren. Das Token garantiert einen Farbton, der auf seinen
          gemessenen Gründen lesbar ist; die Bedeutung wird dort vergeben, wo er verwendet wird — die Severity-Regeln des
          Kits ordnen warn Orange und danger Rot zu —, und die Oberfläche sollte auch dann funktionieren, wenn ein Leser
          die Konvention nicht teilt.
        </p>
        <p class="src-note">
          Die sechs Tokens sind unter ihren Farbtonnamen in beiden Blöcken von <code>styles.scss</code> deklariert; die
          Severity-Zuordnung sind die Regeln für <code>.p-button</code>, <code>.p-badge</code> und <code>.p-message</code>
          in derselben Datei.
        </p>

        <h3>Der zweite Träger ist das, was die Übersetzung übersteht</h3>
        <p>
          Ein Zustand, ausgedrückt als Farbton plus Wort, übersteht alles, was die Token-Schicht nicht kontrollieren kann:
          eine übersetzte Beschriftung, einen Schwarz-Weiß-Druck, ein Betriebssystem mit erzwungener Palette, einen Leser
          mit Farbsehschwäche. Er gibt auch Übersetzern etwas in die Hand — eine Farbe lässt sich nicht übersetzen,
          „Fehlgeschlagen“ schon, und eine Legende, die an Wörter statt an Farbfelder gebunden ist, ist die, die in der
          Zielsprache korrekt bleibt.
        </p>

        <h3>Die Schreibrichtung berührt die Farbe nicht</h3>
        <p>
          Kein Farb-Token kennt eine Richtung, und keines sollte es: Eine Farbe ist ein Wert, keine Seite. Dasselbe Paar
          gilt unter einer Schrift von rechts nach links, und ein gespiegeltes Layout ändert, welches Element wo sitzt,
          ohne zu ändern, welcher Grund dahinter liegt. Was du nach dem Spiegeln nachprüfen musst, ist darum das Layout,
          nicht der Kontrast.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Hinweis zu schmalen
            Bildschirmen sagt, dass eine Seite auch aus dem dunklen Modus auf hellem Papier druckt (<code>ThemeService</code>
            wechselt zur hellen Variante); die Aussagen zum kuratierten Vordergrund und zur Beschriftung des gefüllten
            Buttons gegen den Service nachgeprüft, der keine Kontrast-Helfer zur Laufzeit mehr trägt.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Für die visuellen Stile und die geprüfte Widget-Schicht neu geschrieben:
            jedes Verhältnis pro Stil neu zitiert (werkbund-Zahlen plus das Minimum über vier Stile), die Token-Schichten
            von den Aura-Primitives bis zu den Stil-, Akzent- und Tinten-Tokens des Kits, eine Aufgaben-Tabelle
            (Control-Kante, Fokus-Ring, ungültige Kante, Balken der gewählten Zeile, Severity-Text), die sechs Kit-Tokens,
            auf die die Widgets umgelenkt sind, die dunkle Widget-Rampe aus
            <code>primaryFgDark</code>, <code>--primary-&lt;step&gt;</code> als Markenskala des Stils und ein Gate mit
            null Ausnahmen, Widget-Paare eingeschlossen.
          </li>
          <li>
            <strong>v0.4</strong> — 23.08.2026 — Gegen &#64;openng/optimus-ui-themes&#64;3.0.0 (PrimeNG 22) neu geprüft: Das
            Kontrast-Gate lief über alle 194 Paare mit einem Diff von null erneut — Aura 3.0 behielt die Farbwerte, also
            steht jedes zitierte Verhältnis. Das Preset gibt seine Farben jetzt als <code>light-dark()</code>-Werte aus
            (Mechanik im Guide zu Design-Tokens); die drei Farbfamilien des Kits sind nicht betroffen.
          </li>
          <li>
            <strong>v0.3</strong> — 19.08.2026 — Die beiden geplanten Token-Entscheidungen sind umgesetzt:
            <code>--text-color-secondary</code> auf <code>#6b7280</code> umgetönt (4,59:1 auf den Panel-Tönen, was
            beide Ausnahmen für Begleittext schließt) und <code>--control-border</code> für Control-Kanten bei 3:1
            abgespalten (<code
              >#868d95</code
            >
            hell, <code>#94a3b8</code> dunkel), womit <code>--surface-border</code> der Dekoration bleibt. Alle Zahlen
            aus dem neu erzeugten Kompilat aktualisiert; das Register führt jetzt eine Ausnahme.
          </li>
          <li>
            <strong>v0.2</strong> — 18.08.2026 — Zwei Korrekturen aus dem Review der a11y-guidelines. Die Do/Don’t-Zelle
            zum Marken-Vordergrund schrieb <code>--primary-color-fg</code> 4,92:1 zu, was die Zeile seines Nachbarn
            <code>--gradient-accent-color-fg</code> ist; das knappste helle Paar des Tokens selbst ist 5,18:1. Und die
            Regel zum zweiten Träger wird von SHOULD zu MUST hochgestuft, weil SC 1.4.1 Stufe A ist und der
            Accessibility-Guide sie bereits als MUST nannte.
          </li>
          <li>
            <strong>v0.1</strong> — 18.08.2026 — Erster Guide: die drei Farbfamilien und was jede garantiert, die zehn
            Markenpaletten in beiden Rollen, die Paarungstabelle Grund für Grund, die sieben gemessenen Gruppen und die
            neun deklarierten Ausnahmen, die Regel für die Beschriftung des gefüllten Buttons und das kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ColorSystemArticleDeComponent extends ColorSystemArticleComponent {
  override readonly carrierState = signal(CARRIER_DE.shown);

  override toggleLabels(): void {
    const next = !this.labelsOn();
    this.labelsOn.set(next);
    this.carrierState.set(next ? CARRIER_DE.shown : CARRIER_DE.hidden);
  }
}
