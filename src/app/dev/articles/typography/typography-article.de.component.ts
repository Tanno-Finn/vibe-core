import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TypographyArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './typography-article.component';

/**
 * German twin of the Typography guide (ADR-0018).
 *
 * Extends the English canonical article, so the sentinel and the code snippets are
 * shared; only the template is German. Keep it in step with the English file: same
 * tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs typography`).
 */
@Component({
  selector: 'app-typography-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'typography'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Die Schrift des Kits besteht aus drei Skalen und sieben Familiennamen, und fast nichts davon wird für dich
          angewandt. Alles unten wird aus den Tokens selbst gerendert, du siehst also, wozu das aktuelle Theme und die
          aktuelle Schriftwahl tatsächlich auflösen — auch an den Stellen, an denen ein Token eine Schrift nennt, die das
          Kit nie lädt.
        </p>

        <h3>Die Größenskala, gerendert</h3>
        <p>
          Dreizehn Stufen, alle in <code>rem</code>. Die ersten acht sind doppelt deklariert — einmal von der erzeugten
          Skala und einmal, identisch, vom handgeschriebenen Stylesheet; die letzten fünf gibt es nur in der erzeugten
          Skala. Stufen über <code>3xl</code> überlassen wir der Tabelle in „Verwendung“, weil <code>8rem</code> in einer
          Textspalte zu rendern dir nichts sagt, was die Zahl nicht schon sagt.
        </p>
        <div class="scale">
          <div class="scale__row">
            <code>--font-size-xs</code><span class="s-xs">Franz jagt im Taxi quer durch Bayern</span>
          </div>
          <div class="scale__row">
            <code>--font-size-sm</code><span class="s-sm">Franz jagt im Taxi quer durch Bayern</span>
          </div>
          <div class="scale__row">
            <code>--font-size-base</code><span class="s-base">Franz jagt im Taxi quer durch Bayern</span>
          </div>
          <div class="scale__row">
            <code>--font-size-lg</code><span class="s-lg">Franz jagt im Taxi quer durch Bayern</span>
          </div>
          <div class="scale__row"><code>--font-size-xl</code><span class="s-xl">Franz jagt im Taxi quer</span></div>
          <div class="scale__row"><code>--font-size-2xl</code><span class="s-2xl">Franz jagt im Taxi</span></div>
          <div class="scale__row"><code>--font-size-3xl</code><span class="s-3xl">Franz jagt</span></div>
        </div>
        <p class="src-note">
          Stufenwerte aus <code>$font-sizes</code> in <code>src/styles/design-tokens.scss</code>; die acht Stufen
          <code>xs</code> bis <code>4xl</code> werden in <code>src/styles.scss</code> mit identischen Werten erneut
          deklariert.
        </p>

        <h3>Die Gewichtsleiter</h3>
        <p>
          Neun Gewichts-Tokens, 100 bis 900. Ob sie wie neun Gewichte aussehen, hängt ganz von der Schrift davor ab: Jede
          Fließtextschrift, die das Kit laden kann, bringt zwei Schnitte mit, 400 und 700, und die Überschriftenschriften
          der visuellen Stile einen, also löst der Browser die übrigen Stufen nach seinen Font-Matching-Regeln auf, statt
          dass ein Designer sie gezeichnet hätte. Wechsle die Schrift in den Benutzereinstellungen und sieh zu, wie diese
          Leiter zusammenfällt.
        </p>
        <div class="ladder">
          <span class="w-100">100</span>
          <span class="w-200">200</span>
          <span class="w-300">300</span>
          <span class="w-400">400</span>
          <span class="w-500">500</span>
          <span class="w-600">600</span>
          <span class="w-700">700</span>
          <span class="w-800">800</span>
          <span class="w-900">900</span>
        </div>
        <p class="src-note">
          Gewichtswerte aus <code>$font-weights</code> in <code>src/styles/design-tokens.scss</code>; der Bestand an
          Schnitten gezählt über die <code>&#64;font-face</code>-Regeln in <code>src/assets/fonts/</code>.
        </p>

        <h3>Die Familien-Tokens, nebeneinander</h3>
        <p>
          Sieben Familiennamen sind deklariert, und sie sind nicht gleichwertig. Zwei tragen die eigene Mechanik des Kits:
          <code>--font-family</code>, das <code>body</code> liest und die Schriftwahl umschreibt, und
          <code>--font-mono</code>. Zwei weitere beginnen mit einer Schrift, für die es im ganzen Kit kein
          <code>&#64;font-face</code> gibt, was du in ihrer Zeile liest, ist also der zweite oder dritte Eintrag des Stacks,
          nicht der erste. Die Zeile unten rendert <code>--font-family</code>, den Namen, den <code>body</code> liest;
          <code>--font-base</code> — der maßgebliche Name des Kits für dasselbe — trägt den identischen Wert und würde
          identisch rendern.
        </p>
        <div class="fams">
          <div class="fam">
            <code>--font-family</code><span class="f-ui">Falsches Üben von Xylophonmusik quält jeden größeren Zwerg — 0O1lI</span>
          </div>
          <div class="fam">
            <code>--font-mono</code><span class="f-mono">Falsches Üben von Xylophonmusik quält jeden größeren Zwerg — 0O1lI</span>
          </div>
          <div class="fam">
            <code>--font-serif</code><span class="f-serif">Falsches Üben von Xylophonmusik quält jeden größeren Zwerg — 0O1lI</span>
          </div>
          <div class="fam">
            <code>--font-heading</code><span class="f-heading">Falsches Üben von Xylophonmusik quält jeden größeren Zwerg — 0O1lI</span>
          </div>
        </div>
        <p class="src-note">
          Werte der Familien-Tokens aus dem kompilierten globalen Stylesheet gelesen;
          <code>--font-base</code> wird zusätzlich von <code>src/app/services/font.service.ts</code> als Inline-Style
          auf das Wurzelelement geschrieben.
        </p>

        <h3>Die Zeilenhöhen-Skala hat kein gerendertes Zuhause</h3>
        <p>
          Es gibt sechs Zeilenhöhen-Tokens, von <code>1</code> bis <code>2</code>. Das globale Stylesheet des Kits
          enthält fünf <code>line-height</code>-Deklarationen, und keine davon liest ein Zeilenhöhen-Token — es sind
          Literale, und die einzige, die auf <code>body</code> landet, sitzt im Druckzweig. Auf dem Bildschirm läuft
          Fließtext darum mit dem <code>normal</code> des User Agents, bis eine Komponente etwas anderes sagt.
        </p>
        <div class="lh">
          <p class="lh--tight">
            tight (1.25) — Schrift ist ein System von Verhältnissen, und der Zeilenabstand ist das Verhältnis, das
            entscheidet, ob ein Absatz eine Wand ist oder eine Seite.
          </p>
          <p class="lh--relaxed">
            relaxed (1.625) — Schrift ist ein System von Verhältnissen, und der Zeilenabstand ist das Verhältnis, das
            entscheidet, ob ein Absatz eine Wand ist oder eine Seite.
          </p>
        </div>
        <p class="src-note">
          Deklarationen gezählt über das kompilierte globale Stylesheet; Token-Werte aus
          <code>$line-heights</code> in <code>src/styles/design-tokens.scss</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Wähl das Token nach der Aufgabe, lies es mit <code>var()</code>, und wisse, welcher der sieben Familiennamen
          tatsächlich mit etwas verbunden ist. Die Mechanik der Token-Schichten — wer wen überschreibt und wo ein Override
          sitzen muss — gehört zu <strong>Design-Tokens</strong>; in diesem Tab geht es darum, nach welchem typografischen
          Namen du greifst.
        </p>

        <h3>Die Größenskala</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wert</th>
                <th>bei 16px Wurzelgröße</th>
                <th>SC 1.4.3 großer Text?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--font-size-xs</code></td>
                <td>0.75rem</td>
                <td>12px</td>
                <td>nein</td>
              </tr>
              <tr>
                <td><code>--font-size-sm</code></td>
                <td>0.875rem</td>
                <td>14px</td>
                <td>nein</td>
              </tr>
              <tr>
                <td><code>--font-size-base</code></td>
                <td>1rem</td>
                <td>16px</td>
                <td>nein</td>
              </tr>
              <tr>
                <td><code>--font-size-lg</code></td>
                <td>1.125rem</td>
                <td>18px</td>
                <td>nein</td>
              </tr>
              <tr>
                <td><code>--font-size-xl</code></td>
                <td>1.25rem</td>
                <td>20px</td>
                <td>nur ab Gewicht 700</td>
              </tr>
              <tr>
                <td><code>--font-size-2xl</code></td>
                <td>1.5rem</td>
                <td>24px</td>
                <td>ja</td>
              </tr>
              <tr>
                <td><code>--font-size-3xl</code></td>
                <td>1.875rem</td>
                <td>30px</td>
                <td>ja</td>
              </tr>
              <tr>
                <td><code>--font-size-4xl</code></td>
                <td>2.25rem</td>
                <td>36px</td>
                <td>ja</td>
              </tr>
              <tr>
                <td><code>--font-size-5xl</code></td>
                <td>3rem</td>
                <td>48px</td>
                <td>ja</td>
              </tr>
              <tr>
                <td><code>--font-size-6xl</code></td>
                <td>3.75rem</td>
                <td>60px</td>
                <td>ja</td>
              </tr>
              <tr>
                <td><code>--font-size-7xl</code></td>
                <td>4.5rem</td>
                <td>72px</td>
                <td>ja</td>
              </tr>
              <tr>
                <td><code>--font-size-8xl</code></td>
                <td>6rem</td>
                <td>96px</td>
                <td>ja</td>
              </tr>
              <tr>
                <td><code>--font-size-9xl</code></td>
                <td>8rem</td>
                <td>128px</td>
                <td>ja</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>$font-sizes</code> in <code>src/styles/design-tokens.scss</code>; die px-Spalte setzt die
          Standard-Wurzelgröße des Browsers voraus, die das Kit nie festlegt. Die Spalte zu großem Text wendet die
          Schwelle von WCAG 2.2 an (18pt, oder 14pt fett), keine Regel des Kits.
        </p>

        <h3>Die Familien-Tokens, und womit jedes verbunden ist</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Beginnt mit</th>
                <th>Greif danach, wenn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--font-base</code></td>
                <td>dem System-Stack</td>
                <td>
                  du die UI-Schrift brauchst — das ist der maßgebliche Name des Kits dafür, und die Schriftwahl schreibt
                  ihn um
                </td>
              </tr>
              <tr>
                <td><code>--font-family</code></td>
                <td>demselben System-Stack</td>
                <td>
                  der Legacy-Alias, behalten, weil <code>body</code> ihn noch liest; identischer Wert, identisches
                  Schreiben zur Laufzeit, ihn zu verwenden funktioniert also — aber eine neue Regel sollte
                  <code>--font-base</code> nennen
                </td>
              </tr>
              <tr>
                <td><code>--font-mono</code></td>
                <td><code>Fira Code</code></td>
                <td>
                  Code, Tasten, IDs, Tabellenziffern — der eine Monospace-Name; seine ersten beiden Einträge werden nicht
                  mitgeliefert, also löst er weiter unten auf
                </td>
              </tr>
              <tr>
                <td><code>--font-serif</code></td>
                <td><code>Georgia</code></td>
                <td>
                  eine bewusste Serifen-Passage; der Stack endet auf das generische <code>serif</code>, also löst er
                  immer auf — die benannten Einträge nicht: <code>Georgia</code> und <code>Cambria</code> sind auf einem
                  Standard-Linux nicht vorhanden
                </td>
              </tr>
              <tr>
                <td><code>--font-heading</code></td>
                <td><code>Poppins</code></td>
                <td>nur mit deinem eigenen <code>&#64;font-face</code> für den ersten Eintrag, sonst bekommst du seinen Fallback</td>
              </tr>
              <tr>
                <td><code>--font-display</code></td>
                <td><code>Poppins</code></td>
                <td>derselbe Wert wie <code>--font-heading</code>, derselbe Vorbehalt</td>
              </tr>
              <tr>
                <td><code>--font-sans</code></td>
                <td><code>Inter</code></td>
                <td>
                  nie für die UI-Schrift: Er beginnt mit einer Schrift der Schriftwahl, die erst existiert, wenn der Leser
                  sie auswählt, und er ist nicht das, was die Schriftwahl umschreibt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Werte aus dem kompilierten globalen Stylesheet gelesen; was wann geladen wird, geprüft gegen die
          <code>&#64;font-face</code>-Regeln in <code>src/assets/fonts/</code> und die Asset-Globs in
          <code>angular.json</code>. Welcher der beiden UI-Schriftnamen maßgeblich ist, legt das Kit selbst fest,
          festgehalten im Kommentar über den statischen Schrift-Tokens in <code>src/styles.scss</code> und im Kopf von
          <code>src/app/services/font.service.ts</code>; beide
          Namen sind im kompilierten Stylesheet statisch mit dem identischen Stack deklariert, und
          <code>src/app/services/font.service.ts</code> schreibt beide um, also löst jeder beim ersten Paint auf — die
          Wahl zwischen ihnen ist Konvention, nicht Mechanik.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine Größe als Literal getippt</span>
            <div class="dd__stage">
              <code class="dd__code">font-size: 14px;</code>
            </div>
            <p class="dd__why">
              Eine px-Größe ignoriert die Wurzel-Schriftgröße des Nutzers, sie skaliert also nicht mit dem Rest der Seite
              — und sie hinterlässt in der Skala einen Wert neben der Leiter, nach dem niemand greppen kann.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die Stufe, als Token gelesen</span>
            <div class="dd__stage">
              <code class="dd__code">font-size: var(--font-size-sm);</code>
            </div>
            <p class="dd__why">
              Jede Stufe ist ein <code>rem</code>, folgt also der Wurzelgröße des Nutzers; und der Name sagt, welche
              Sprosse der Leiter du gemeint hast.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Mono-Stack, an der Aufrufstelle erfunden</span>
            <div class="dd__stage">
              <code class="dd__code">font-family: var(--font-family-mono);</code>
            </div>
            <p class="dd__why">
              <code>--font-family-mono</code> ist kein Token dieses Kits: Es ist nirgends deklariert, also ist die
              Deklaration ohne Fallback zum Computed-Value-Zeitpunkt ungültig, und das Element behält stattdessen die
              geerbte UI-Schrift.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — das eine Monospace-Token</span>
            <div class="dd__stage">
              <code class="dd__code">font-family: var(--font-mono);</code>
            </div>
            <p class="dd__why">
              Ein Name, ein Stack, eine Stelle zum Ändern — und er endet auf das generische
              <code>monospace</code>, löst also auf jeder Plattform auf.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Gewicht, das die Schrift nicht hat</span>
            <div class="dd__stage">
              <code class="dd__code">font-weight: var(--font-weight-medium);</code>
            </div>
            <p class="dd__why">
              Mit einer aktiven Schrift aus der Schriftwahl gibt es keinen 500er-Schnitt, und das Font-Matching von CSS
              löst 500 nach unten auf 400 auf — die Betonung, die du wolltest, rendert als Fließtext.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Gewicht mit eigenem Schnitt, oder ein zweiter Träger</span>
            <div class="dd__stage">
              <code class="dd__code">font-weight: var(--font-weight-bold);</code>
            </div>
            <p class="dd__why">
              400 und 700 sind die beiden Gewichte, die jede ladbare Fließtextschrift im Kit tatsächlich mitbringt; alles
              Feinere braucht einen echten Schnitt oder einen Träger jenseits des Gewichts, etwa Farbe oder Größe.
            </p>
          </div>
        </div>

        <h3>Die Utility-Klassen sind keine Tokens</h3>
        <p>
          Das Stylesheet erzeugt eine <code>.text-&lt;step&gt;</code>-Klasse für jede der 13 Größen und eine
          <code>.font-&lt;name&gt;</code>-Klasse für jedes der 9 Gewichte. Sie sind bequem, und sie sind eine Falle: Jede
          einzelne ist als Literalwert mit <code>!important</code> kompiliert, nicht als <code>var()</code>. Wer
          <code>--font-size-sm</code> nachgelagert überschreibt, bewegt jede Regel, die das Token liest, und lässt
          <code>.text-sm</code> genau dort, wo es war. Beachte auch, dass <code>.text-&lt;name&gt;</code> doppelt erzeugt
          wird — einmal pro Größenstufe und einmal pro Palettenfarbe —, also setzt <code>.text-sm</code> eine Größe,
          während <code>.text-blue-500</code> eine Farbe setzt.
        </p>
        <p class="src-note">
          Gezählt im kompilierten globalen Stylesheet: 135 <code>.text-*</code>-Regeln (13 Größen plus 122
          Palettenfarben, keine Namenskollision) und 9 <code>.font-*</code>-Regeln, alle ausgegeben von den
          <code>&#64;each</code>-Schleifen am Ende von <code>src/styles/design-tokens.scss</code>.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Interessante an der Typografie dieses Kits ist, wie wenig davon angewandt wird. Werte werden großzügig
          deklariert und sparsam verbraucht, und in der Lücke zwischen beidem wohnt jede Überraschung dieses Tabs.
        </p>

        <h3>Wo typografische Werte geschrieben werden</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Schicht</th>
                <th>Schreibt</th>
                <th>Von schwach nach stark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>design-tokens.scss</code></td>
                <td>
                  13 Größenstufen, 9 Gewichte, 6 Zeilenhöhen und 5 Familiennamen (<code>--font-sans</code>,
                  <code>--font-serif</code>, <code>--font-mono</code>, <code>--font-heading</code>,
                  <code>--font-display</code>)
                </td>
                <td>1 — die erzeugten Skalen</td>
              </tr>
              <tr>
                <td><code>styles.scss</code></td>
                <td>
                  die ersten 8 Größenstufen, 6 Gewichte, 5 Zeilenhöhen, dazu <code>--font-base</code>,
                  <code>--font-family</code> und ein zweites <code>--font-mono</code>
                </td>
                <td>2 — dieselben Namen, später im Stylesheet</td>
              </tr>
              <tr>
                <td>der Namensraum <code>--p-*</code></td>
                <td>nichts Typografisches, das dieses Kit deklariert</td>
                <td>3 — die Preset-Schicht; <strong>Design-Tokens</strong> erklärt den Mechanismus</td>
              </tr>
              <tr>
                <td><code>font.service.ts</code></td>
                <td>
                  <code>--font-base</code>, <code>--font-family</code> und das <code>--font-heading</code> des aktiven
                  Stils, als Inline-Style auf dem Wurzelelement
                </td>
                <td>4 — von keinem Selektor zu schlagen</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Namen gezählt im kompilierten globalen Stylesheet; das Schreiben zur Laufzeit gelesen aus
          <code>src/app/services/font.service.ts</code>. Die Laufzeitschicht für Farbe,
          <code>src/app/services/theme.service.ts</code>, schreibt selbst keine typografische Eigenschaft: Sie übergibt die Schriften des visuellen
          Stils an <code>applyStyleFonts</code> im Font-Service. Wie die vier Schichten allgemein zusammenwirken, erklärt <strong>Design-Tokens</strong>, dem die Kaskade gehört.
        </p>

        <h3>Derselbe Name, zwei Werte: <code>--font-mono</code></h3>
        <p>
          <code>--font-mono</code> ist das eine typografische Token, das in beiden Stylesheets mit
          <em>unterschiedlichem</em> Inhalt deklariert ist. Die erzeugte Skala gibt ihm acht Einträge; das
          handgeschriebene Stylesheet gibt ihm fünf und lässt <code>Menlo</code>, <code>Monaco</code> und
          <code>Liberation Mono</code> weg. Das handgeschriebene Stylesheet steht bei gleicher Spezifität später, also
          malt der Stack mit fünf Einträgen, und der mit acht erreicht nie einen Bildschirm. Beide beginnen mit
          <code>Fira Code</code> und <code>JetBrains Mono</code>, und das Kit liefert für keine von beiden ein
          <code>&#64;font-face</code> mit, also rendert Code in der Praxis im ersten Eintrag, der auf dem Betriebssystem
          vorhanden ist.
        </p>
        <p class="src-note">
          Beide Deklarationen gelesen aus dem kompilierten globalen Stylesheet, in Quellreihenfolge; der Bestand an
          Schnitten aus <code>src/assets/fonts/</code>, das keine Monospace-Familie enthält.
        </p>

        <h3>Was das globale Stylesheet tatsächlich malt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Eigenschaft</th>
                <th>Deklarationen</th>
                <th>Wo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>font-family</code></td>
                <td>14</td>
                <td>
                  zweimal für die Icon-Schrift, einmal auf <code>body</code> mit <code>var(--font-family)</code>, einmal
                  auf <code>h1</code>–<code>h6</code> und neunmal in den visuellen Stilen mit
                  <code>var(--font-heading)</code>, einmal als <code>monospace</code> im Druckzweig
                </td>
              </tr>
              <tr>
                <td><code>font-size</code></td>
                <td>30</td>
                <td>
                  22 in <code>rem</code>, 8 in <code>pt</code> — und alle acht in <code>pt</code> stehen im
                  Druckzweig
                </td>
              </tr>
              <tr>
                <td><code>font-weight</code></td>
                <td>22</td>
                <td>Utilities, Komponentenregeln und die visuellen Stile; keine auf einem Fließtext-Element</td>
              </tr>
              <tr>
                <td><code>line-height</code></td>
                <td>5</td>
                <td>
                  alles Literale; keine liest ein <code>--line-height-*</code>-Token, und die einzige auf
                  <code>body</code> steht im Druckzweig
                </td>
              </tr>
              <tr>
                <td><code>letter-spacing</code></td>
                <td>2</td>
                <td>
                  beide im visuellen Stil blaupause (seine Buttons und der Seitentitel); das Kit hat kein Token dafür
                </td>
              </tr>
              <tr>
                <td><code>html &#123; font-size &#125;</code></td>
                <td>0</td>
                <td>
                  keine Regel setzt <code>font-size</code> auf <code>html</code>. Die Regeln, die bei <code>html</code>
                  beginnen — Theme-Klassen, die vier visuellen Stile, der Druckzweig —, stylen Nachfahren oder Farbe, und
                  keine davon berührt die Wurzelgröße, sie bleibt also, was der Nutzer eingestellt hat
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gezählt über das kompilierte globale Stylesheet, Definitionen von Custom Properties aus den Zählungen
          ausgenommen.
        </p>

        <h3>Überschriften kommen vom User Agent</h3>
        <p>
          Außerhalb des Druckzweigs hat das globale Stylesheet des Kits eine Regel <em>auf Elementebene</em> für
          <code>h1</code>–<code>h6</code>, <code>p</code>, <code>a</code>, <code>code</code> oder <code>pre</code>:
          <code>h1</code>–<code>h6</code> lesen <code>var(--font-heading)</code> als Familie, und sonst nichts — keine
          Größe, kein Gewicht, kein Außenabstand. Jeder andere nackte Element-Selektor auf diese Namen sitzt in
          <code>&#64;media print</code>. Fünf Regeln erreichen sie doch, und jede ist auf eine Komponente begrenzt:
          <code>.cookie-text .cookie-title</code>, <code>.cookie-text p</code>,
          <code>.cookie-settings-header .cookie-settings-title</code>, <code>.cookie-category-header .cookie-category-title</code>
          und <code>.cookie-category-header p</code>, jede setzt eine literale <code>font-size</code> und zwei davon eine
          literale <code>line-height</code>. In diesen Komponenten ist eine Überschrift also nicht Browser-Standard;
          überall sonst ist ihre Größe es, weil das Stylesheet global am Fließtext typografisch nur zweierlei tut: eine
          Familie auf <code>body</code> und eine Familie auf den Überschriften. Überschriftengrößen, Außenabstände von
          Überschriften, die Monospace-Vorgabe in <code>code</code>, die Unterstreichung eines Links — all das ist das
          User-Agent-Stylesheet, das der Rendering-Abschnitt von HTML festlegt (<code>h1</code> mit <code>2em</code> bis
          hinunter zu <code>h6</code> mit <code>0.67em</code>, wobei ein <code>h1</code> in Sectioning Content weiter
          herabgestuft wird). Die Folge für den Aufrufer: Eine Überschrift, die außerhalb einer Komponente rendert, die
          Überschriften stylt, ist nicht „ungestylter Kit-Standard“, sondern Browser-Standard, und sie folgt der
          Größenskala nicht, solange du sie nicht dazu bringst.
        </p>
        <p class="src-note">
          Selektoren aufgezählt über das kompilierte globale Stylesheet: jede Regel, deren Selektor auf einem dieser
          Elementnamen endet, nackt oder begrenzt, mit aufgelöstem At-Rule-Kontext.
        </p>

        <h3>Schmale Bildschirme: Die Schrift bewegt sich nicht</h3>
        <p>
          <strong>Das Kit hat keine responsive Typografie.</strong> Das kompilierte globale Stylesheet enthält fünf
          Viewport-Media-Blöcke — zwei bei <code>max-width: 768px</code>, zwei bei <code>600px</code>, einen bei
          <code>640px</code> —, und kein einziger davon deklariert <code>font-size</code>, <code>font-weight</code>,
          <code>line-height</code> oder <code>font-family</code>; sie ändern nur Padding, Layout-Richtung und
          Button-Breite. Es gibt im Stylesheet keine <code>clamp()</code>-Schriftgröße und keine fluide Skala, die man
          erben könnte. Der einzige Zweig, der Größe oder Familie ändert, ist <code>&#64;media print</code>, der auf eine
          <code>pt</code>-Leiter umschaltet und eine Zeilenhöhe auf <code>body</code> setzt (druckst du aus dem dunklen
          Modus, schaltet <code>ThemeService</code> außerdem auf die helle Variante, also landet die Schrift auf hellem
          Papier). Er ist allerdings nicht der einzige typografische Zweig — er ist der einzige <em>Viewport</em>-Zweig:
          <code>&#64;media (prefers-contrast: high)</code> hebt <code>.glossary-highlight</code> auf
          <code>font-weight: 600</code>, das ist eine Präferenz-Abfrage, keine Breiten-Abfrage, und sie ändert das
          Gewicht, nicht die Größe. Was der Aufrufer tun muss: Wenn eine Überschrift auf dem Smartphone kleiner werden
          soll, deklarier das im eigenen Komponenten-Stylesheet und nimm die kleinere Stufe aus derselben Skala — und
          verlass dich darauf, dass jede Stufe ein <code>rem</code> ist, die ganze Seite also schon mit der eigenen
          Schriftgrößen-Einstellung des Lesers skaliert (WCAG SC 1.4.4), ganz ohne Media Query.
        </p>
        <p class="src-note">
          Media-Blöcke und ihre Deklarationen aufgezählt im kompilierten globalen Stylesheet, Präferenz-Abfragen
          eingeschlossen; dass es keine <code>font-size</code> auf <code>html</code> gibt, im selben Durchgang geprüft.
        </p>

        <h3>Großer Text ist eine Größenfrage, die das Token-Gate nicht stellen kann</h3>
        <p>
          Das Kontrastminimum von WCAG hat für großen Text eine niedrigere Schwelle — 3:1 statt 4,5:1 —, und groß heißt
          18pt oder 14pt fett. Auf der Skala des Kits liegt diese Schwelle zwischen
          <code>--font-size-xl</code> und <code>--font-size-2xl</code>: Ab 24px qualifiziert Text ohne Weiteres, 20px nur
          ab Gewicht 700 oder schwerer. Das Kontrast-Kompilat kann davon nichts wissen, weil es Farb-Tokens misst und ein
          Token keine Größe hat, also wird jedes Textpaar darin bei 4,5:1 beurteilt. Das ist die strenge Lesart, und sie
          ist der richtige Standard; die Paarungsregeln selbst sind das Gebiet von <strong>Farbsystem</strong>. Die
          Textfarben gehören zum aktiven visuellen Stil, also wird ein Verhältnis pro Stil und Modus zitiert. Zwei Zahlen
          zur Orientierung: <code>--text-color</code> auf <code>--surface-card</code> ergibt im Stil werkbund 18,73:1 im
          Hellen und 14,86:1 im Dunkeln, und die knappste Fließtext-Zeile über alle vier Stile ist
          <code>--text-color-secondary</code> auf <code>--surface-hover</code> mit 4,55:1 (blaupause, hell) — SC 1.4.3
          verlangt 4,5:1.
        </p>
        <p class="src-note">
          Verhältnisse zitiert aus <code>docs/generated/CONTRAST.MD</code>, Gruppe „body text“, die
          <code>scripts/check-contrast.mjs</code> aus den Stilwerten in <code>src/app/services/ui-styles.ts</code> neu
          erzeugt; die Größenschwelle ist die Definition von großem Text in WCAG 2.2,
          kein Wert des Kits.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Drei Dinge braucht eine Aufgabe auf diesem Gebiet meistens: eine neue Stufe in einer Skala, eine Änderung an der
          Schrift, die der Nutzer sieht, und einen Weg, ein lebendes Token von einem toten zu unterscheiden.
        </p>

        <h3>Eine Stufe zu einer Skala hinzufügen</h3>
        <p>
          Die Skalen sind Sass-Maps, und jede Map treibt sowohl eine Custom Property als auch eine Utility-Klasse an. Ein
          neuer Schlüssel gibt dir beides; einen Verbraucher gibt er dir nicht.
        </p>
        <pre class="code-block"><code>{{ addStepSnippet }}</code></pre>

        <h3>Die UI-Schrift zur Laufzeit ändern</h3>
        <p>
          Die Schriftwahl ist ein Service, kein Stylesheet. Sie schreibt den gewählten Stack als Inline-Style auf das
          Wurzelelement, die stärkste Schicht der Kaskade — eine Komponente, die ihre eigene <code>font-family</code>
          fest einträgt, steigt also still aus der Wahl des Nutzers aus, auch aus der legasthenie-freundlichen Schrift.
        </p>
        <pre class="code-block"><code>{{ runtimeSnippet }}</code></pre>

        <h3>Die Namen, die wie Hooks aussehen und keine sind</h3>
        <p>
          Fünf typografische Custom Properties werden in <code>:root</code> ausgegeben, die keine Regel im Kit liest:
          <code>--button-font-weight</code>, <code>--tooltip-font-size</code>, <code>--code-font-family</code>,
          <code>--code-font-size</code> und <code>--code-line-height</code>. Sie lesen sich wie Komponenten-Hooks, aber
          die Komponenten, die sie nennen, sind Optimus-UI-Komponenten, und Optimus UI liest stattdessen den Namensraum
          <code>--p-*</code> — in dem das eigene Stylesheet des Kits kein typografisches Mitglied deklariert. Einen davon
          zu setzen ändert nichts. Ein sechster Name, <code>--font-family-mono</code>, ist das Spiegelbild: nirgends
          deklariert, also bekommt ein Leser immer nur seinen eigenen Fallback. Seit dem 23.09.2026 liest ihn keine Datei
          des Kits mehr: Das Karteikarten-Deck, der Path Resolver und die Impressumsseite lesen alle
          <code>--font-mono</code>.
        </p>
        <p class="src-note">
          Die fünf Namen gelesen aus der Map der Komponenten-Tokens in
          <code>src/styles/design-tokens.scss</code> und im kompilierten globalen Stylesheet als vorhanden bestätigt;
          dass es keine typografische <code>--p-*</code>-Deklaration und kein <code>--font-family-mono</code> gibt, im
          selben Stylesheet festgestellt. Auch das Preset fügt keine hinzu: <code>src/app/app.config.ts</code> startet mit
          Aura, und <code>src/app/services/theme.service.ts</code> ersetzt es durch das Delta des visuellen Stils (Radien
          und dunkle Button-Farben) plus die Akzent-Rampe — in keinem von beiden ein typografisches Token.
        </p>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>Jede Größe, jedes Gewicht und jeder Zeilenabstand im Diff liest ein Token; keine nackte <code>px</code>-Schriftgröße überlebt.</li>
          <li>
            Monospace ist <code>var(--font-mono)</code> — kein handgeschriebener Stack, nicht <code>--font-family-mono</code>.
          </li>
          <li>Keine neue Regel setzt <code>font-family</code> auf ein Fließtext-Element; die UI-Schrift bleibt die Wahl des Nutzers.</li>
          <li>Jedes Gewicht außer 400 oder 700 ist entweder durch einen echten Schnitt gedeckt oder mit einem zweiten Träger gepaart.</li>
          <li>
            Nichts legt <code>html &#123; font-size &#125;</code> fest, und keine neue Größe ist außerhalb des Druckzweigs in
            <code>px</code> oder <code>pt</code> angegeben.
          </li>
          <li>
            Wenn sich Schrift an einem Breakpoint ändert, lebt die Änderung im eigenen Stylesheet der Komponente und
            landet auf einer Stufe der Skala.
          </li>
          <li>
            Neue Textfarben-Paare sind gemessen — führ <code>node scripts/check-contrast.mjs</code> aus und zitier die Zeile.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Token-Werte werden nie übersetzt, und <strong>Design-Tokens</strong> sagt bereits, warum die Schreibrichtung in
          die Eigenschaft gehört und nicht in den Wert. Hierher gehört, was nur die Typografie beantworten kann: welche
          Schriftsysteme der Font-Stack dieses Kits tatsächlich rendern kann, und mit wessen Dateien.
        </p>

        <h3>Der Standard-Stack, Eintrag für Eintrag</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Position</th>
                <th>Einträge</th>
                <th>Vom Kit mitgeliefert?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1–6</td>
                <td>
                  <code>-apple-system</code>, <code>BlinkMacSystemFont</code>, <code>Segoe UI</code>,
                  <code>Roboto</code>, <code>Helvetica</code>, <code>Arial</code>
                </td>
                <td>nein — absichtlich auf dem Betriebssystem vorhanden, darum lädt der erste Paint keine Schrift</td>
              </tr>
              <tr>
                <td>7–10</td>
                <td>
                  <code>Noto Sans KR</code>, <code>Noto Sans Devanagari</code>, <code>Noto Sans Bengali</code>,
                  <code>Noto Sans Gurmukhi</code>
                </td>
                <td>
                  nein — für Hangul und drei indische Schriften genannt, aber das Kit deklariert für keine Noto-Familie ein
                  <code>&#64;font-face</code>
                </td>
              </tr>
              <tr>
                <td>11</td>
                <td><code>sans-serif</code></td>
                <td>die generische Familie, immer auflösbar</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Die Folge lohnt, klar ausgesprochen zu werden: Die vier Noto-Einträge sind eine
          <em>Bitte</em>, keine Garantie. Sie rendern, wenn auf dem Betriebssystem des Lesers diese Familien zufällig
          installiert sind, und fallen auf <code>sans-serif</code> durch, wenn nicht. Nichts im Kit lädt sie herunter —
          kein Stylesheet, kein Asset-Glob und kein Markup im Kit zeigt überhaupt auf einen externen Font-Host. Wenn deine
          Locales eines dieser Schriftsysteme garantiert brauchen, liefere seine Dateien so mit, wie die Schriften der
          Schriftwahl mitgeliefert werden, und füge ein <code>&#64;font-face</code> hinzu; den Stack zu erweitern allein
          bringt keine Abdeckung.
        </p>
        <p class="src-note">
          Stack gelesen aus <code>--font-family</code> im kompilierten globalen Stylesheet und aus
          <code>SYSTEM_STACK</code> in <code>src/app/services/font.service.ts</code>; dass es keinen Verweis auf einen
          Webfont-Host und kein Noto-<code>&#64;font-face</code> gibt, festgestellt über <code>src/</code> und
          <code>angular.json</code>.
        </p>

        <h3>Was das Kit lädt</h3>
        <p>
          Vierzehn Stylesheets in <code>src/assets/fonts/</code>, jedes nur dann als <code>&lt;link&gt;</code> eingefügt,
          wenn es gebraucht wird: acht Schriften hinter der Schriftwahl, geladen, wenn der Leser eine auswählt, und sechs
          weitere, die nur ein visueller Stil anfordert — seine Fließtextschrift oder eine Überschriftenschrift, die ein
          einziges Gewicht mitbringt. Vierundzwanzig <code>&#64;font-face</code>-Regeln insgesamt, und sie sind einheitlich:
          nur lateinisches Subset, Gewicht 400 oder 700, nur aufrecht, nur <code>woff2</code>,
          <code>font-display: swap</code>. Beachte, wo das Subsetting lebt: Keine der vierundzwanzig trägt einen
          <code>unicode-range</code>-Deskriptor. Die Beschränkung auf Latein ist in die <code>woff2</code>-Dateien selbst
          eingebacken, der Browser fällt also bei fehlender Glyphenabdeckung an einer gewählten Schrift vorbei, nicht an
          einem deklarierten Bereich — die praktische Wirkung ist dieselbe, aber nichts im CSS nennt die Grenze. Drei
          Folgen, sobald eine davon aktiv ist. Kursiv wird vom Browser synthetisiert, weil es keinen kursiven Schnitt
          gibt. Gewicht 500 und 600 haben auch keinen Schnitt, also löst das Font-Matching von CSS 500 nach unten auf 400
          und 600 nach oben auf 700 auf. Und eine gewählte Schrift deckt nur Latein ab — jeder nicht-lateinische Textlauf
          auf der Seite fällt an ihr vorbei in die Fallback-Kette oben, weshalb die gewählte Familie zuerst steht und der
          System-Stack dahinter, statt an ihrer Stelle.
        </p>
        <p class="src-note">
          Gezählt über die vierzehn Stylesheets in <code>src/assets/fonts/</code> — 24 <code>&#64;font-face</code>-Regeln,
          0 <code>unicode-range</code>-Deskriptoren; die Stil-Schriften sind die <code>fonts</code>-Einträge in
          <code>src/app/services/ui-styles.ts</code>; die Dateien stammen aus den <code>&#64;fontsource</code>-Paketen, die
          die Asset-Globs in <code>angular.json</code> kopieren (<code>&#64;fontsource/inter</code> 5.3.0 und Geschwister,
          <code>&#64;fontsource/opendyslexic</code> 5.2.5). Das einzige <code>&#64;font-face</code> im globalen
          Stylesheet selbst ist die Icon-Schrift, mit <code>font-display: block</code>.
        </p>

        <h3>Die Legasthenie-Schrift hat eine Schriftsystem-Sperre</h3>
        <p>
          Der Schalter für die lesefreundliche Schrift führt zu OpenDyslexic, dessen rein lateinische Dateien kein
          Bengalisch, Devanagari, Gurmukhi oder Hangul rendern können. Der Font-Service stellt das als Abfrage bereit,
          statt den Schalter Tofu erzeugen zu lassen: Er meldet die lesefreundliche Schrift für diese Sprachen als nicht
          unterstützt und entfernt vorher ein Leichte-Sprache-Suffix, damit eine Variante dem Schriftsystem ihrer
          Basissprache folgt. Kyrillisch und Griechisch bleiben aktiviert, weil sie teilweise abgedeckt sind. Jede Locale,
          die du hinzufügst und deren Hauptschriftsystem nicht unterstützt ist, muss in diese Menge aufgenommen werden —
          der Schalter leitet die Abdeckung nicht aus den Schriftdateien ab.
        </p>
        <p class="src-note">
          Verhalten gelesen aus <code>supportsReadableFont</code> und seiner Menge nicht unterstützter Sprachen in
          <code>src/app/services/font.service.ts</code>.
        </p>

        <h3>Länge und Richtung</h3>
        <p>
          Deutsche Komposita werden lang, und die Skala fängt das nicht auf — eine Stufe ist eine Größe, kein Budget.
          Bemiss Textcontainer an ihrem Inhalt und lass die Stufe den Rhythmus um sie herum setzen. Die Richtung ist
          dieselbe Geschichte eine Schicht tiefer und wird in
          <strong>Design-Tokens</strong> behandelt: Kein typografisches Token kennt eine Richtung, also verhindert Abstand
          über logische Eigenschaften, dass diese Schicht einer Schrift von rechts nach links im Weg steht. Rechts-nach-links
          macht das Kit dadurch nicht — nichts hier schreibt <code>dir</code>, und keine <code>rtl</code>-Regel wird
          mitgeliefert, die Richtung kippt also gar nicht erst. Diese Grenze gehört zu
          <strong>Richtlinien zur Barrierefreiheit</strong>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Karteikarten-Deck
            und der Path Resolver lesen jetzt <code>--font-mono</code>, ebenso die Impressumsseite, also liest keine Datei
            des Kits mehr <code>--font-family-mono</code>; Druck im dunklen Modus landet auf hellem Papier, umgeschaltet von
            <code>ThemeService</code>.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Kontrastzahlen folgen den visuellen Stilen (Fließtext unter werkbund, die
            knappste Zeile für Begleittext über alle vier Stile); der Bestand an Schnitten zählt die sechs Stylesheets, die
            nur die Stile laden (14 Dateien, 24 Schnitte, Überschriftenschriften mit einem Gewicht); der Hinweis zum Preset
            nennt das Delta des Stils und die Akzent-Rampe; Zeilenangaben in <code>src/</code> durch benannte Stellen
            ersetzt; fünf globale <code>line-height</code>-Deklarationen.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Deklarationen über das kompilierte globale Stylesheet neu gezählt, nach
            den vier visuellen Stilen und dem Entfernen der toten globalen Popover-Styles: 14 <code>font-family</code>,
            30 <code>font-size</code>, 22 <code>font-weight</code>, 5 <code>line-height</code>, 2
            <code>letter-spacing</code>; <code>h1</code>–<code>h6</code> tragen jetzt außerhalb des Drucks eine
            Familienregel; fünf auf Komponenten begrenzte Regeln erreichen Fließtext-Elemente, fünf Viewport-Media-Blöcke;
            die Icon-Schrift ist openng-icons. Die Kommentar-Fundstelle zu <code>--font-base</code> ist nach
            <code>styles.scss:359–360</code> gewandert, seine Deklaration nach
            <code>:516</code>.
          </li>
          <li>
            <strong>v0.4</strong> — 24.08.2026 — Auf &#64;openng/optimus-ui-themes 3.0.0 neu geprüft: Die fünf wirkungslosen
            Komponenten-Hook-Namen werden weiter ausgegeben und von nichts gelesen, das Kit deklariert weiter kein
            typografisches <code>--p-*</code>-Mitglied, und die Kontrastzahlen gelten weiter — Themes 3.0 hat keine
            Farbwerte geändert. Die Deklaration von <code>--font-base</code> ist nach <code>styles.scss:451</code>
            gewandert; Herkunftsangabe angehoben.
          </li>
          <li>
            <strong>v0.3</strong> — 18.08.2026 — Der Absatz zur Richtung trug die Behauptung, die aus
            <strong>Design-Tokens</strong> bereits zurückgezogen war: Richtungsneutrale Tokens räumen ein Hindernis weg,
            sie machen das Kit nicht rechts-nach-links-fähig. Auf den gemessenen Stand korrigiert — kein <code>dir</code>
            wird geschrieben, und keine <code>rtl</code>-Regel wird mitgeliefert — und auf den Guide verwiesen, der die
            Grenze hält.
          </li>
          <li>
            <strong>v0.2</strong> — 18.08.2026 — Review-Durchgang. Zwei Verneinungen auf das eingeengt, was tatsächlich
            gezählt wurde: Die fehlenden Fließtext-Regeln fehlen nur auf Elementebene, und <code>html</code> wird von
            fünf Regeln getroffen, von denen keine <code>font-size</code> setzt. <code>&#64;media print</code> heißt
            jetzt der einzige typografische <em>Viewport</em>-Zweig, mit <code>&#64;media (prefers-contrast: high)</code>
            daneben genannt. Die Empfehlung zur UI-Schrift folgt der eigenen Festlegung des Kits:
            <code>--font-base</code> maßgeblich, <code>--font-family</code> der Legacy-Alias.
          </li>
          <li>
            <strong>v0.1</strong> — 18.08.2026 — Erster Guide: die drei Skalen und die sieben Familiennamen an ihrer
            Quelle gemessen, die zwei auseinanderlaufenden Monospace-Stacks, was das globale Stylesheet tatsächlich malt,
            das Fehlen responsiver Schrift, der rein lateinische Bestand an Schnitten hinter der Schriftwahl und das
            kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TypographyArticleDeComponent extends TypographyArticleComponent {}
