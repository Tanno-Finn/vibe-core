import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DesignTokensArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './design-tokens-article.component';

/**
 * German twin of the Design Tokens guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the inspector's visible strings
 * (its status line and the empty-value marker) are German. Keep it in step with
 * the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs design-tokens`).
 */
@Component({
  selector: 'app-design-tokens-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'design-tokens'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Tokens sind kein Dokument — sie sind die Werte, die dein Browser gerade jetzt hält. Der Inspektor unten liest
          sie aus der laufenden Seite aus und antwortet deshalb in dem Theme, das du tatsächlich vor dir hast. Wechsle
          das Theme oder die Markenfarbe und lies neu: Die Namen bleiben, die Werte wandern.
        </p>

        <h3>Live-Token-Inspektor</h3>
        <p>
          Aufgelöste Werte der zentralen Rollen-Tokens, gelesen vom Dokumentelement. Dieser Block ist Live-Ausgabe, keine
          Referenztabelle — die Zahlen ändern sich mit deinem Theme.
        </p>
        <div class="insp">
          <button pButton type="button" (click)="readTokens()"><span pButtonLabel>Tokens neu lesen</span></button>
          <p class="insp__state" role="status">{{ inspectorState() }}</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Farbfeld</th>
                <th>Aufgelöster Wert</th>
              </tr>
            </thead>
            <tbody>
              @for (t of liveTokens(); track t.name) {
                <tr>
                  <td>
                    <code>{{ t.name }}</code>
                  </td>
                  <td><span class="sw" [style.background]="t.value"></span></td>
                  <td>
                    <code>{{ t.value }}</code>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="3">Drück „Tokens neu lesen“ — der Inspektor läuft nur im Browser.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen mit getComputedStyle auf dem Dokumentelement; die Token-Namen sind die Rollen-Tokens, die das
          semantische Mapping des Agent-Docs auflistet.
        </p>

        <h3>Ein begrenzter Override, nebeneinander</h3>
        <p>
          Eine Custom Property, die auf einem Element gesetzt ist, gilt für dieses Element und alles darin. Beide Panels
          unten nutzen dieselbe Regel — <code>background: var(--surface-card)</code> —, und nur das rechte trägt einen
          Override.
        </p>
        <div class="demo2">
          <div class="panel">
            <strong>Geerbt</strong>
            <p>Liest <code>--surface-card</code> und <code>--text-color</code> des Themes.</p>
          </div>
          <div class="panel panel--tinted">
            <strong>Überschrieben</strong>
            <p>Dieselbe Regel, mit zwei Tokens, die nur auf diesem Element neu definiert sind.</p>
          </div>
        </div>
        <pre class="code-block"><code>{{ scopeSnippet }}</code></pre>
        <p class="src-note">
          Der Override-Mechanismus ist CSS Custom Properties L1 — eine auf einem Element gesetzte Eigenschaft wird von
          seinem Teilbaum geerbt; damit das funktioniert, braucht es nichts aus diesem Kit.
        </p>

        <h3>Was malt, bevor dein CSS es tut</h3>
        <p>
          Der erste Paint nutzt überhaupt keine Tokens. Ein Block im Head der Seite setzt die Theme-Klasse auf das
          Wurzelelement und codiert einen Hintergrund und eine Textfarbe fest, sodass schon der allererste Frame zum
          gespeicherten Theme passt, statt weiß aufzublitzen; für einen wiederkehrenden Leser spielt er außerdem die
          Token-Map ab, die der Theme-Service beim letzten Besuch gespeichert hat. Die beiden Literale duplizieren
          <code>--surface-ground</code> und <code>--text-color</code> des Standard-Stils von Hand — wenn du den
          Standard-Stil neu abtönst, ist dieser Block ein weiterer Ort, an dem der Wert lebt, und das Kontrast-Gate lässt
          den Build scheitern, bis er passt.
        </p>
        <p class="src-note">
          Der Bootstrap-Block sitzt im Index-HTML der Anwendung, vor dem Stylesheet-Link; die Klasse, die er setzt, ist
          dieselbe, an der das dunkle Theme hängt. Prüfung 1 von <code>scripts/check-contrast.mjs</code> vergleicht seine
          zwei Regeln und die First-Paint-Blöcke von <code>styles.scss</code> mit dem Standard-Stil in
          <code>src/app/services/ui-styles.ts</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Ein Token zu verwenden ist ein einziger Funktionsaufruf. Alles Schwierige an Tokens ist die Entscheidung,
          <em>welchen</em> Namen du liest und <em>wo</em> du einen neuen Wert hinschreibst.
        </p>

        <h3>Welche Schicht fasse ich an?</h3>
        <ul>
          <li>
            <strong>Einen Wert lesen</strong> — immer <code>var(--token)</code>, nie den Hex-Wert. Du musst nicht wissen,
            welche Schicht ihn erzeugt hat.
          </li>
          <li>
            <strong>Eine Komponente ändern</strong> — setz das Token auf den Host oder Wrapper dieser Komponente.
            Begrenzt, umkehrbar, für alles andere unsichtbar.
          </li>
          <li>
            <strong>Eine Flächen- oder Textfarbe ändern</strong> — sie gehört zu einem visuellen Stil: Bearbeite diesen
            Stil in <code>ui-styles.ts</code>, pro Modus. Beim Standard-Stil aktualisiere außerdem seine First-Paint-Kopie
            in <code>styles.scss</code> und im Index-HTML; das Kontrast-Gate scheitert, bis alle drei übereinstimmen.
          </li>
          <li>
            <strong>Ein kitweites Token hinzufügen, das kein Stil variiert</strong> — <code>styles.scss</code>, im hellen
            und im dunklen Block, so wie <code>--semantic-&lt;hue&gt;-fg</code> deklariert ist.
          </li>
          <li>
            <strong>Eine Markenfarbe ändern</strong> — sie steht gar nicht in einem Stylesheet; die zehn Akzentpaletten
            leben in <code>THEME_COLORS</code> in <code>theme.service.ts</code>.
          </li>
          <li>
            <strong>Das Aussehen einer Optimus-UI-Komponente ändern</strong> — das ist der Namensraum
            <code>--p-*</code>, und er gehört in den Guide dieser Komponente.
          </li>
        </ul>

        <h3>Der Fallback-Vertrag</h3>
        <p>
          <code>var(--token, fallback)</code> nimmt den Fallback, wenn das Token <em>undefiniert</em> ist. Es nimmt ihn
          nicht, wenn das Token definiert, aber <em>leer</em> ist — eine leere Custom Property ist ein gültiger,
          definierter Wert, und sie einzusetzen macht die Deklaration zum Zeitpunkt des berechneten Werts ungültig, also
          berechnet sich die Eigenschaft zu ihrem geerbten Wert (oder zu ihrem Anfangswert, wenn sie nicht erbt). Sie
          fällt <em>nicht</em> auf die vorherige Deklaration zurück. Das ist nicht hypothetisch: Vier semantische
          Farb-Tokens dieses Kits wurden im dunklen Theme einmal leer ausgegeben (siehe Entwicklung).
        </p>
        <pre class="code-block"><code>{{ fallbackSnippet }}</code></pre>
        <p class="src-note">Verhalten definiert durch CSS Custom Properties L1, „guaranteed-invalid value“.</p>

        <h3>Die Namensräume</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Präfix</th>
                <th>Was er enthält</th>
                <th>Sicher zu überschreiben?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--surface-*</code> / <code>--text-color*</code> / <code>--control-border</code></td>
                <td>Untergründe, Text und Control-Kanten des aktiven visuellen Stils. Zur Laufzeit geschrieben.</td>
                <td>Nur begrenzt — eine globale Regel verliert gegen die Inline-Schicht; ein neuer Wert gehört in den Stil.</td>
              </tr>
              <tr>
                <td><code>--semantic-&lt;hue&gt;-fg</code></td>
                <td>Kitweite Textfarben für Inline-Hervorhebungen und Schweregrad-Text. Hell und dunkel, in jedem Stil gleich.</td>
                <td>Begrenzt, oder in beiden <code>styles.scss</code>-Blöcken.</td>
              </tr>
              <tr>
                <td><code>--primary-bg</code> / <code>--primary-fg</code> / <code>--accent-*</code></td>
                <td>Akzentrollen. Zur Laufzeit pro Akzent und Modus geschrieben.</td>
                <td>Nur begrenzt — eine globale Regel verliert gegen die Inline-Schicht.</td>
              </tr>
              <tr>
                <td><code>--primary-&lt;step&gt;</code></td>
                <td>Die Markenskala des aktiven Stils, nicht der Akzent. Zur Laufzeit geschrieben.</td>
                <td>Nur für die Gestaltung des Stils lesen; der Akzent ist <code>--primary-fg</code>.</td>
              </tr>
              <tr>
                <td>
                  <code>--space-*</code>, <code>--radius-*</code>, <code>--shadow-*</code>, <code>--z-*</code>,
                  <code>--container-*</code>
                </td>
                <td>Geordnete Skalen. Nicht themeabhängig.</td>
                <td>Ja, aber wähl lieber eine andere Stufe.</td>
              </tr>
              <tr>
                <td><code>--blue-500</code> und <code>--color-blue-500</code></td>
                <td>Die rohe Palette, zweimal unter zwei Namen ausgegeben.</td>
                <td>Lies keines von beiden — sie tragen keine Rolle.</td>
              </tr>
              <tr>
                <td><code>--p-*</code></td>
                <td>Der Aura-Namensraum von Optimus UI: Primitive, semantische und Komponenten-Ebene.</td>
                <td>Nur pro Komponente, auf ihrem eigenen Selektor, und nur wo ihr Guide es sagt.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Präfixe abgelesen an den ausgegebenen Custom Properties im kompilierten globalen Stylesheet; die doppelte
          Benennung der Palette wird einmal pro Paletteneintrag in
          <code>design-tokens.scss</code> erzeugt.
        </p>

        <h3>Do / Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Literal, das ein Token dupliziert</span>
            <div class="dd__stage">
              <div class="mini mini--hard"><span>Festes #ffffff-Panel</span></div>
            </div>
            <p class="dd__why">
              Im hellen Modus sieht es richtig aus, im dunklen Modus wird es zu Weiß auf Weiß, und das Kontrast-Gate kann
              es nicht sehen, weil es Tokens misst, keine Literale.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — das Rollen-Token lesen</span>
            <div class="dd__stage">
              <div class="mini"><span>var(--surface-card)-Panel</span></div>
            </div>
            <p class="dd__why">
              Eine Regel, beide Themes, und das Paar taucht im Kontrast-Kompilat auf, wo der Build eine Regression erwischt
              statt eines Lesers.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — aus dem Stylesheet einer Komponente umthemen</span>
            <div class="dd__stage">
              <code class="dd__code">:root &#123; --surface-card: #eef; &#125;</code>
            </div>
            <p class="dd__why">
              Eine Komponente, die auf die Wurzel schreibt, malt die ganze Anwendung neu, von wo auch immer sie gerade
              eingehängt ist, und die nächste Komponente, die das tut, gewinnt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Override auf deinen Teilbaum begrenzen</span>
            <div class="dd__stage">
              <code class="dd__code">.my-panel &#123; --surface-card: #eef; &#125;</code>
            </div>
            <p class="dd__why">
              Der Override erreicht genau den Teilbaum, der ihn verlangt hat, und jede verschachtelte Komponente
              funktioniert weiter, weil sie noch denselben Token-Namen liest.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Text in der Hintergrundrolle malen</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-bg);</code>
            </div>
            <p class="dd__why">
              Die Hintergrundrolle ist darauf abgestimmt, <em>hinter</em> hellem Text zu sitzen. Als Textfarbe auf hellem
              Untergrund ist sie das falsche Ende des Verhältnisses, für das sie gemessen wurde.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Text in der Vordergrundrolle malen</span>
            <div class="dd__stage">
              <code class="dd__code">color: var(--primary-fg);</code>
            </div>
            <p class="dd__why">
              Die Vordergrundrolle ist die kuratierte Variante pro Theme, abgestimmt auf den Seitenuntergrund im passenden
              Modus — genau dieses Paar misst das Kompilat.
            </p>
          </div>
        </div>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Vier Schichten schreiben in einen gemeinsamen Satz von Namen. Nichts in CSS kennzeichnet eine Custom Property
          als zu einer Schicht gehörig, also entscheidet allein die Kaskade, „welcher Wert malt“ — und darum ist die
          Reihenfolge unten das Nützlichste, was du über dieses Kit wissen kannst.
        </p>

        <h3>Die vier Schichten, von der schwächsten zur stärksten</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Schicht</th>
                <th>Geschrieben wo</th>
                <th>Geschlagen von</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Generierte Skalen und Palette</td>
                <td><code>design-tokens.scss</code>, kompiliert zu <code>:root</code> und <code>.dark-theme</code></td>
                <td>Schichten 2–4</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Rollen-Tokens des Kits (First-Paint-Kopie des Standard-Stils) und Umleitungen für Komponenten</td>
                <td>
                  <code>styles.scss</code>, handgeschriebenes <code>:root</code> und <code>.dark-theme</code>, dazu
                  <code>--p-*</code>-Umleitungen auf Komponenten-Selektoren
                </td>
                <td>Schicht 4 für jeden Namen, den die Laufzeit schreibt; Schicht 3 für jeden <code>--p-*</code>-Namen, der auf <code>:root</code> gesetzt ist</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Bibliotheks-Namensraum <code>--p-*</code></td>
                <td>
                  Aura-2.x-Preset mit eingemischtem Delta des Stils und der Akzent-Rampe, zur Laufzeit als
                  <code>:root,:host</code>-Block <em>nach</em> dem Kit-Stylesheet eingefügt, dazu ein zweiter Token-Block unter
                  <code>.dark-theme</code></td>
                <td>
                  Einem Selektor, der enger ist als <code>:root</code>, <code>!important</code> oder Schicht 4 — nicht von
                  einer weiteren <code>:root</code>-Regel
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Stil, Akzent und Modus zur Laufzeit</td>
                <td>
                  <code>theme.service.ts</code> — die Token-Map aus aktivem Stil × Akzent × Modus, als Inline-Style auf dem
                  Wurzelelement
                </td>
                <td>Nichts außer <code>!important</code> oder einem engeren Element</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Reihenfolge der Schichten geprüft am kompilierten globalen Stylesheet: Die Blöcke von Schicht 1 stehen vor denen
          von Schicht 2, weil <code>styles.scss</code> <code>design-tokens.scss</code> ganz oben einbindet, und beide
          schreiben schlichtes <code>:root</code> / <code>.dark-theme</code> — gleiche Spezifität, also entscheidet die
          Reihenfolge im Quelltext. Schicht 4 ist <code>buildTokenMaps</code> in <code>theme.service.ts</code>, als
          Inline-Style angewendet. Die Position von Schicht 3 ist in <code>styles.scss</code> neben der Fokus-Ring-Regel des
          Selects festgehalten: Ein <code>--p-select-focus-ring-*</code>-Token, das auf <code>:root</code> neu deklariert
          wird, berechnet sich trotzdem zum Wert des Presets, weil der eigene <code>:root</code>-Block des Presets später
          eingefügt wird.
        </p>

        <h3>Drei Ebenen in <code>--p-*</code>, und wo das Kit sie umleitet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Ebene</th>
                <th>Beispiel</th>
                <th>Geschrieben von</th>
                <th>Umleitung durch das Kit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Primitive</td>
                <td><code>--p-green-500</code>, <code>--p-border-radius-md</code></td>
                <td>Aura, dazu die <code>borderRadius</code>-Primitives des Stils</td>
                <td>Keine — direkt gelesen nur für eine feste Farbtonstufe</td>
              </tr>
              <tr>
                <td>Semantisch</td>
                <td><code>--p-primary-color</code>, <code>--p-surface-300</code>, <code>--p-content-background</code></td>
                <td>Aura, wobei <code>semantic.primary</code> durch die Akzent-Rampe ersetzt ist</td>
                <td>Keine — die Rampe ist die Eingabe des Kits</td>
              </tr>
              <tr>
                <td>Komponente</td>
                <td><code>--p-checkbox-border-color</code>, <code>--p-message-warn-color</code></td>
                <td>Aura, dazu das Button-Delta des Stils</td>
                <td>
                  <code>styles.scss</code>, auf dem Komponenten-Selektor, auf ein Kit-Token gerichtet
                  (<code>--control-border</code>, <code>--semantic-&lt;hue&gt;-fg</code>, <code>--primary-color-fg</code>)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Ebenen so, wie die Styled-Engine sie ausgibt (<code>&#64;openng/optimus-ui-styled/dist/index.mjs</code>,
          <code>getCommon</code> für Primitive und Semantik, ein Block pro Komponente); die Reihenfolge des Zusammenführens
          ist <code>definePreset(Aura, style.presetOverrides)</code>, dann <code>widgetPrimarySemantic</code>, in
          <code>theme.service.ts</code>. Die Akzent-Rampe nimmt im hellen Modus das <code>primaryColor</code> der Palette und
          im dunklen ihr <code>primaryFgDark</code>, wobei <code>primary.color</code> auf Stufe 500 zeigt — der Akzent eines
          Widgets im dunklen Modus ist also dieselbe Farbe wie <code>--primary-color-fg</code>. Jedes umgeleitete Paar ist
          eine Zeile in <code>docs/generated/CONTRAST.MD</code>.
        </p>

        <h3>Wo ein <code>--p-*</code>-Override hingehört</h3>
        <p>
          Das Preset ist kein Stylesheet, das du in der Reihenfolge überholen kannst. Optimus UI schreibt seinen
          <code>--p-*</code>-Block aus einem zur Laufzeit eingefügten Style-Element auf <code>:root</code>, und das landet
          nach dem eigenen Stylesheet des Kits; bei gleicher Spezifität gewinnt der spätere Block — eine
          <code>:root</code>-Regel von dir für einen dieser Namen ist also überall tot, nicht nur in der Komponente.
          <strong>Setz einen <code>--p-*</code>-Override auf den eigenen Selektor der Komponente</strong>
          — <code>.p-slider</code>, <code>.p-select</code> —, wo eine Klasse das nackte <code>:root</code> des Presets in
          der Spezifität schlägt und wo der Override nur die Komponente erreicht, die ihn verlangt hat. Der Fix für die
          Zielgröße des Sliders in <code>styles.scss</code> ist das Referenzmuster: Die beiden Handle-Tokens sind genau aus
          diesem Grund auf <code>.p-slider</code> deklariert statt auf <code>:root</code>.
        </p>
        <p class="src-note">
          Die Rangfolge ist in <code>styles.scss</code> an den beiden Regeln festgehalten, die sie erzwungen hat, dem
          <code>.p-select</code>-Fokus-Ring und den <code>.p-slider</code>-Handle-Tokens; prüf sie in deinem eigenen
          Build, indem du einen <code>--p-*</code>-Namen auf <code>:root</code> neu deklarierst und den berechneten Wert an
          der Komponente zurückliest.
        </p>

        <h3>Was die Neudeklarationen kosten</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Messgröße</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Custom-Property-Deklarationen im kompilierten globalen Stylesheet</td>
                <td>985</td>
              </tr>
              <tr>
                <td>Verschiedene Custom-Property-Namen</td>
                <td>726</td>
              </tr>
              <tr>
                <td>Neudeklarationen (Deklarationen minus verschiedene Namen)</td>
                <td>259</td>
              </tr>
              <tr>
                <td>Verschiedene <code>--p-*</code>-Namen, die das Kit selbst setzt</td>
                <td>139</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gezählt über das kompilierte globale Stylesheet (<code>src/styles.scss</code> mit dem Icon-Stylesheet, das es
          importiert). Eine Neudeklaration ist für sich keine Verschwendung — der helle und der dunkle Block sind je eine
          —, aber sie ist der Grund, warum dir die erste Definition eines Tokens nichts sagt. Die Laufzeitschicht legt ihre
          eigene Map obendrauf, und deren Größe hängt vom aktiven Stil ab.
        </p>

        <h3>Ein Token, vier Werte</h3>
        <p><code>--text-color</code> ist der deutlichste Fall, weil die Schichten sich widersprechen:</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Schicht</th>
                <th>Heller Wert</th>
                <th>Erreicht den Bildschirm?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1 — generiert</td>
                <td><code>#1e293b</code></td>
                <td>Nein — von Schicht 2 überdeckt</td>
              </tr>
              <tr>
                <td>2 — Stylesheet</td>
                <td><code>#121212</code> (der des Standard-Stils)</td>
                <td>Ja, bis die Laufzeitschicht schreibt</td>
              </tr>
              <tr>
                <td>4 — Laufzeit</td>
                <td>der des aktiven Stils: <code>#121212</code> werkbund, <code>#2b2622</code> lernwerkstatt</td>
                <td>Ja — Inline-Style, endgültig</td>
              </tr>
              <tr>
                <td>
                  Boot-Block — deklariert kein Token; er malt die Eigenschaft <code>color</code> direkt auf das Wurzelelement
                </td>
                <td><code>#121212</code></td>
                <td>Ja, nur für den ersten Frame eines ersten Besuchs</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte gelesen aus <code>design-tokens.scss</code>, <code>styles.scss</code>, den <code>surfaces</code> jedes
          Stils in <code>src/app/services/ui-styles.ts</code> und dem Bootstrap-Block im Head. Das Kontrast-Kompilat misst
          die Laufzeitwerte, pro Stil (Zeilen „body text“).
        </p>

        <h3>Wie der dunkle Modus tatsächlich umschaltet</h3>
        <p>
          Hinter dem dunklen Theme steht keine Media Query. Eine Klasse — <code>dark-theme</code> — trägt es. Der
          Bootstrap-Block im Head setzt diese Klasse <em>nur auf das Wurzelelement</em>, aus der gespeicherten Präferenz
          oder der Systemeinstellung; der Theme-Service setzt sie danach maßgeblich auf das Wurzelelement <em>und</em> den
          Body. Jeder dunkle Wert in den Schichten 1 und 2 hängt an diesem einen Klassenselektor. Weil eine Klasse ein
          nacktes <code>:root</code> in der Spezifität schlägt, muss der dunkle Block nicht später in der Datei stehen —
          nur die hellen Blöcke konkurrieren über die Reihenfolge im Quelltext.
        </p>
        <p>
          Schicht 3 schaltet ebenfalls über einen Selektor um. Das Aura-2.x-Preset von Optimus UI trägt zwei getrennte
          Token-Blöcke, <code>colorScheme.light</code> und <code>colorScheme.dark</code>; im Basis-Preset gibt es nirgends
          ein <code>light-dark()</code> (<code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>). Die
          Styled-Engine löst den konfigurierten <code>darkModeSelector</code> auf und gibt den dunklen Block darunter aus
          (<code>&#64;openng/optimus-ui-styled/dist/index.mjs</code>, <code>getColorSchemeOption</code>). Darum wird
          <code>--p-content-background</code> zweimal geschrieben — aus
          <code>colorScheme.light.content.background</code> auf <code>:root,:host</code> und aus
          <code>colorScheme.dark.content.background</code> unter <code>.dark-theme</code>. Die Folge für dich: Ein
          einmal deklarierter <code>--p-*</code>-Farb-Override gilt in <em>beiden</em> Modi, also kombinier ihn mit
          einer <code>.dark-theme</code>-Regel, wann immer er dem Theme folgen muss.
        </p>
        <p class="src-note">
          Der Selektor für den dunklen Modus wird dort konfiguriert, wo Optimus UI bereitgestellt wird —
          <code>provideOptimus</code> in <code>app.config.ts</code>, <code>darkModeSelector: '.dark-theme'</code> — und
          bei jedem Theme-Wechsel in <code>theme.service.ts</code> neu angewendet. Abgelesen am Preset und an der
          Styled-Engine.
        </p>

        <h3>Die Laufzeitschicht leitet Farben arithmetisch ab</h3>
        <p>
          Die Akzent-Rampe, die dem Aura-Preset übergeben wird — im hellen Modus aus dem hellen <code>primaryColor</code>
          der Palette gebaut, im dunklen aus ihrem <code>primaryFgDark</code> —, und die getönte
          <code>--accent-surface</code>-Familie werden aus einer Farbe berechnet, indem auf jeden sRGB-Kanal ein fester
          Betrag addiert oder davon abgezogen und dann begrenzt wird. Das ist kein wahrnehmungsgerechtes Aufhellen oder
          Abdunkeln, und die Begrenzung ist in der Ausgabe sichtbar: Im dunklen Modus landet <code>--accent-surface</code>
          bei vier der zehn Marken-Themes auf reinem <code>#000000</code> und bei einem fünften bis auf neun an Schwarz
          heran, obwohl der Code es als ungefähr eine 950er-Stufe beschreibt. Das zugehörige Text-Token wird genauso
          abgeleitet, also messen die Paare trotzdem gut —
          <code>--accent-on-surface</code> auf <code>--accent-surface</code> reicht im dunklen Modus von 9,53:1 bis 20,70:1
          gegenüber der 4,5:1-Schwelle von SC 1.4.3 —, aber die Flächen sind viel schlechter voneinander zu unterscheiden,
          als ihre Namen vermuten lassen.
        </p>
        <p class="src-note">
          Ableitung gelesen aus <code>lightenHex</code>, <code>darkenHex</code> und <code>widgetPrimarySemantic</code> in
          <code>theme.service.ts</code>; die aufgelösten Werte und jedes hier zitierte Verhältnis stammen aus den Zeilen
          „accent surface“ in <code>docs/generated/CONTRAST.MD</code>, das sie bei jedem Build aus den echten Tokens neu
          berechnet.
        </p>

        <h3>Wie das Gate die Schichten beweist</h3>
        <p>
          Kontrast wird von einem Gate geregelt, nicht vom Review: <code>check-contrast.mjs</code> löst alle vier Schichten
          so auf, wie der Browser es tut — die Werte der Stile, die <code>styles.scss</code>-Tokens, die Akzentpaletten und
          die eigenen Token-Module von Aura mit jeder angewendeten <code>styles.scss</code>-Umleitung — und misst jedes
          Paar für jeden visuellen Stil × Modus, und pro Akzent, wo das Paar davon abhängt. Kit-Tokens und
          Optimus-Widget-Tokens gleichermaßen; keine deklarierte Ausnahme bleibt. Die Trennung, die für jemanden, der
          Tokens verwendet, am meisten zählt: <code>--surface-border</code> ist nur Dekoration — Haarlinien zwischen Zeilen
          und Karten — und muss SC 1.4.11 nicht erfüllen; die Kante von allem Interaktiven zeichnet
          <code>--control-border</code>, dessen knappste Zeile bei 3,25:1 liegt (blaupause, dunkel, auf
          <code>--surface-section</code>; SC 1.4.11 verlangt 3:1). Ein Control, dessen einziges Erkennungsmerkmal das
          dekorative Token ist, ist ein Defekt, den das Gate nicht sehen kann, also ist die Wahl des Tokens der Prüfpunkt
          im Review.
        </p>
        <p class="src-note">
          Gruppen „control boundary“ und „form field edge“ in <code>docs/generated/CONTRAST.MD</code>; sein Kopf nennt die
          gemessene Gesamtzahl und die Zahl der deklarierten Ausnahmen, null.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          <strong>Kein Token in diesem Kit hängt vom Viewport ab.</strong> Die einzige an eine Media Query gebundene
          Neudefinition von Tokens im gesamten kompilierten Stylesheet ist ein Druckzweig, der 19 Tokens des dunklen
          Themes wieder hell macht — 17 Flächen und 2 Textfarben. Er ist der Fallback: Beim Drucken im dunklen Modus wendet
          <code>ThemeService</code> bei <code>beforeprint</code> die helle Variante von Stil und Akzent des Lesers an und
          stellt bei <code>afterprint</code> dunkel wieder her, sodass eine dunkle Seite auf hellem Papier gedruckt wird.
          Es gibt keinen Breakpoint, an dem <code>--space-4</code> schrumpft oder <code>--font-size-base</code> eine Stufe
          kleiner wird, und kein Token ändert sich bei 360 px. Was das für dich heißt: Responsives Verhalten schreibst du
          selbst. Wähl in deiner eigenen Media Query eine kleinere Stufe aus der Skala, begrenz die Breite mit den
          <code>--container-*</code>-Tokens, und erwarte nicht, dass die Token-Schicht von sich aus irgendetwas umbricht.
        </p>
        <p class="src-note">
          Festgestellt, indem jeder Media-Block im kompilierten globalen Stylesheet nach Custom-Property-Deklarationen
          durchsucht wurde: Druck ist der einzige, der welche trägt.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Drei Rezepte decken fast jede Token-Änderung ab: eines für einen Teilbaum überschreiben, ein neues ins Theme
          aufnehmen und einen Wert erreichen, den die Laufzeitschicht besitzt.
        </p>

        <h3>Für einen Teilbaum überschreiben</h3>
        <pre class="code-block"><code>{{ scopeSnippet }}</code></pre>
        <p>
          Zieh das allem anderen vor. Es kann keine andere Komponente kaputt machen, es übersteht einen Theme-Wechsel, weil
          die Tokens, die es nicht anfasst, weiter normal aufgelöst werden, und es verschwindet, indem du eine Regel löschst.
        </p>

        <h3>Ein Token ins Theme aufnehmen</h3>
        <pre class="code-block"><code>{{ addTokenSnippet }}</code></pre>
        <p>
          Nimm es in beide Blöcke auf, auch wenn die beiden Werte heute gleich sind — ein Token, das nur im hellen Block
          existiert, behält im dunklen Modus stillschweigend seinen hellen Wert, und das ist der Fehler, der im Review am
          schwersten auffällt. Ist das neue Token eine Farbe für Text oder eine Control-Kante, lass das Kontrast-Gate mit
          seinem Schreib-Flag im selben Commit laufen, damit das Kompilat das Paar kennenlernt.
        </p>

        <h3>Einen Wert erreichen, den die Laufzeitschicht besitzt</h3>
        <pre class="code-block"><code>{{ runtimeSnippet }}</code></pre>
        <p>
          Die Laufzeit-Eigenschaften sind Inline-Style auf dem Wurzelelement. Inline-Style gewinnt gegen jeden
          Stylesheet-Selektor, unabhängig von der Spezifität, also ist eine
          <code>:root</code>-Regel für einen dieser Namen schon bei der Ankunft tot. Begrenz deinen Override entweder auf
          ein Element weiter unten — wo du überhaupt nicht mehr mit dem Inline-Style der Wurzel konkurrierst — oder änder
          den Wert an seiner Quelle: den Stil in <code>ui-styles.ts</code> oder die Akzentpalette in
          <code>theme.service.ts</code>.
        </p>

        <h3>Zwei Tokens, die nicht wie geschrieben funktionierten</h3>
        <p>
          Beide sind inzwischen repariert, und beide zeigen, was du prüfen musst, wenn du ein Token hinzufügst. Die dunklen
          <code>--success-color</code>, <code>--warning-color</code>, <code>--danger-color</code> und
          <code>--info-color</code> wurden <em>leer</em> ausgegeben: Die dunkle Map las <code>*-400</code>-Paletten-Schlüssel,
          die die Farb-Map nicht definierte, also lieferte <code>var(--danger-color, red)</code> nichts und auch keinen
          Fallback. Die Map hat jetzt die vier Schlüssel, und die Tokens werden aufgelöst. <code>--input-focus-ring</code>
          war ein Schatten, der das undefinierte <code>--primary-500-rgb</code> las und keinen Verwender hatte; er wurde
          entfernt. Es gibt kein Fokus-Token: Der Fokus-Indikator eines Felds ist der eine Kit-Ring in
          <code>styles.scss</code> (2px <code>--primary-color-fg</code>), gemessen in der Gruppe „focus ring“ von
          <code>CONTRAST.MD</code>.
        </p>
        <p class="src-note">
          <code>design-tokens.scss</code>: die <code>*-400</code>-Schweregrad-Schlüssel und der Kommentar, wo
          <code>input-focus-ring</code> stand.
        </p>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>Keine fest codierte Farbe, die ein Rollen-Token schon benennt.</li>
          <li>Jedes neue Farb-Token existiert im hellen und im dunklen Block.</li>
          <li>Das Kontrast-Gate lief erneut mit seinem Schreib-Flag, falls sich ein Farbwert bewegt hat.</li>
          <li>Overrides sind auf das engste Element begrenzt, das sie braucht.</li>
          <li>Kein Override zielt aus einer Regel auf Wurzelebene auf eine Eigenschaft, die der Laufzeit gehört.</li>
          <li>Text nutzt die Vordergrundrolle, und Füllungen nutzen die Hintergrundrolle.</li>
          <li>Nichts verlässt sich allein auf das Border-Token, um ein Control zu kennzeichnen.</li>
          <li>Geprüft in beiden Modi und unter einem zweiten visuellen Stil und Akzent, nicht nur in dem, in dem du gearbeitet hast.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Tokens enthalten Werte, nie Text, also wird hier nichts übersetzt. Zwei Dinge ändern sich trotzdem mit der
          Sprache, und beide solltest du kennen, bevor du die Schrift- oder die Layout-Tokens anfasst.
        </p>

        <h3>Das Schrift-Token trägt einen Fallback für mehrere Schriftsysteme</h3>
        <p>
          Die Standard-UI-Schrift ist ein System-Stack, gewählt, damit der erste Paint keinen Font-Download kostet. Es ist
          aber kein schlichter System-Stack: Er nennt vier Varianten von Noto Sans — Koreanisch, Devanagari, Bengali und
          Gurmukhi — vor dem generischen
          <code>sans-serif</code> als Abschluss. Lies diese vier als <em>Bitte</em>, nicht als Versprechen. Das Kit
          deklariert kein <code>&#64;font-face</code> für irgendeine Noto-Familie und verweist auf keinen externen
          Font-Host, also malen sie dort, wo das Betriebssystem des Lesers sie schon mitbringt, und fallen sonst auf
          <code>sans-serif</code> durch. Ein Schriftsystem zu garantieren heißt, seine Dateien so mitzuliefern, wie die
          Schriften der Auswahl mitgeliefert werden; <strong>Typografie</strong> geht den Stack Eintrag für Eintrag durch.
          Wenn du den Stack für ein neues Schriftsystem erweiterst, erweitere ihn im Token — nicht in einem
          <code>font-family</code> pro Komponente, das die Schriftauswahl zur Laufzeit dann nicht mehr überschreiben kann.
        </p>
        <p class="src-note">
          Das Schrift-Token ist in <code>styles.scss</code> deklariert und wird zur Laufzeit von
          <code>font.service.ts</code> neu geschrieben, das es als Inline-Style auf das Wurzelelement setzt — derselbe
          Mechanismus aus Schicht 4, den das Theme nutzt. Dass keine Noto-Familie geladen wird, wurde über
          <code>src/</code> und <code>angular.json</code> festgestellt: Kein <code>&#64;font-face</code> nennt eine, und
          <code>src/index.html</code> verlinkt überhaupt keinen Font-Host.
        </p>

        <h3>Layout-Tokens sind Skalare, keine Richtungen</h3>
        <p>
          Kein Token im Kit kennt eine Richtung: <code>--space-4</code> ist eine Länge, kein Links und kein Rechts. Das ist
          die richtige Form — Richtung gehört in die Eigenschaft, nicht in den Wert. Wende Abstände über logische
          Eigenschaften an (<code>padding-inline</code>, <code>margin-inline-start</code>), und die Token-Schicht ist
          kein Hindernis mehr für eine Rechts-nach-links-Schrift — sie macht das Kit aber nicht rechts-nach-links, das ist
          eine eigene und viel größere Aufgabe: Nichts hier schreibt <code>dir</code>, und keine <code>rtl</code>-Regel
          wird ausgeliefert, also kippt die Richtung von vornherein nie. Diese Grenze beschreibt
          <code>a11y-guidelines</code>. Ein Token-Paar, das nach physischen Seiten benannt ist, müsste pro Richtung
          dupliziert werden und würde auseinanderlaufen.
        </p>
        <p class="src-note">
          Geprüft anhand der ausgegebenen Custom-Property-Namen: Die Skalen für Abstand, Radius und Container sind alle
          schlichte Längen, ohne Start/Ende- oder Links/Rechts-Varianten.
        </p>

        <h3>Längentoleranz ist eine Layout-Frage, keine Token-Frage</h3>
        <p>
          Deutsch läuft länger als Englisch und Finnisch noch länger, aber kein Token fängt das ab. Die
          <code>--container-*</code>-Skala begrenzt eine Lesebreite; sie hält ein Label nicht davon ab, in eine zweite Zeile
          umzubrechen. Bemiss Controls nach ihrem Inhalt und lass das Token den Rhythmus um sie herum setzen.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Die vier dunklen
            Schweregrad-Tokens werden aufgelöst, und <code>--input-focus-ring</code> ist weg (die Tabelle „funktioniert
            nicht“ wurde zu einem Hinweis), das Fallback-Beispiel nennt kein echtes Token mehr, und Druck im dunklen Modus
            ist der helle Wechsel von <code>ThemeService</code> mit dem Media-Block als Fallback.
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Auf die visuellen Stile und die per Gate geprüfte Widget-Schicht gebracht:
            Schicht 2 ist die First-Paint-Kopie des Standard-Stils (vom Kontrast-Gate gleich gehalten), Schicht 3 wird aus dem
            Delta des Stils und der Akzent-Rampe gebaut (dunkel aus <code>primaryFgDark</code>), mit einer neuen
            Ebenen-Tabelle, Schicht 4 ist die Map aus Stil × Akzent × Modus; die Werte von <code>--text-color</code>, die
            Zählung der Neudeklarationen und der Gate-Absatz (null Ausnahmen, Widget-Paare eingeschlossen) aktualisiert; der
            falsche Hinweis, die Laufzeit schreibe <code>--success-color</code> neu, entfernt.
          </li>
          <li>
            <strong>v0.6</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014). Die Mechanik von
            Schicht 3 aus v0.5 stimmt wieder nicht: Optimus liefert Aura <em>2.x</em>, dessen Basis-Preset
            <code>colorScheme.light</code>- / <code>colorScheme.dark</code>-Blöcke hat und kein einziges
            <code>light-dark()</code>-Token, also gibt die Engine einen zweiten dunklen Token-Block unter
            <code>darkModeSelector</code> aus — der Design-Tab und die Schichten-Tabelle sagen das jetzt, und der Rat zum
            Überschreiben dreht sich von „liefere dein eigenes <code>light-dark()</code>-Paar“ zu „kombinier es mit einer
            <code>.dark-theme</code>-Regel“. Die Kit-Schichten 1, 2 und 4 sind unberührt; die 32 <code>--p-*</code>-Namen,
            die in <code>styles.scss</code> neu deklariert werden, ergaben neu gezählt dasselbe.
          </li>
          <li>
            <strong>v0.5</strong> — 23.08.2026 — Neu geprüft gegen &#64;openng/optimus-ui-themes&#64;3.0.0 (PrimeNG 22). Schicht
            3 hat den Mechanismus gewechselt: Farb-Tokens sind jetzt einzelne <code>light-dark(light, dark)</code>-Werte auf
            <code>:root, :host</code>, umgeschaltet durch eine eingefügte <code>color-scheme</code>-Deklaration statt durch
            einen zweiten dunklen Token-Block — in der laufenden App gemessen und im Design-Tab dokumentiert, mit den beiden
            Folgen für Overrides und <code>getComputedStyle</code>. Die Kit-Schichten 1, 2 und 4 sind unberührt; die 194
            gemessenen Paare liefen erneut mit null Abweichung.
          </li>
          <li>
            <strong>v0.4</strong> — 19.08.2026 — Die Token-Entscheidungen der Grundlagen sind gelandet:
            <code>--control-border</code> gibt es für Control-Kanten (3:1 auf jedem Untergrund, beide Themes), und
            <code>--surface-border</code> ist nur Dekoration; <code>--text-color-secondary</code> neu abgetönt auf
            <code>#6b7280</code>. Die Zahl der Ausnahmen im Gate-Absatz ging von neun auf eins.
          </li>
          <li>
            <strong>v0.3</strong> — 18.08.2026 — Aus dem Review von a11y-guidelines: Der Absatz zu logischen Eigenschaften
            versprach, dasselbe Token „funktioniert unverändert unter einer Rechts-nach-links-Schrift“, und das liest sich
            wie eine Fähigkeit, die das Kit nicht hat. Richtungsneutrale Tokens räumen ein Hindernis weg; nichts schreibt
            <code>dir</code>, und keine <code>rtl</code>-Regel wird ausgeliefert, und der Satz sagt das jetzt.
          </li>
          <li>
            <strong>v0.2</strong> — 18.08.2026 — Durchgang für die Konsistenz des Korpus. Der i18n-Tab behauptete, die
            Seite lade die Varianten von Noto Sans und die genannten Schriftsysteme würden deshalb verlässlich gerendert; sie
            lädt keine, also liest der Absatz sie jetzt als Fallback-Wunsch, mit seiner Herkunft daneben.
          </li>
          <li>
            <strong>v0.1</strong> — 18.08.2026 — Erster Guide: die vier Token-Schichten und ihre Kaskade, der
            Fallback-Vertrag und die Falle des leeren Tokens, Override-Rezepte, die Ableitung zur Laufzeit und ihre
            Begrenzung, die Regelung des Kontrasts und das kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DesignTokensArticleDeComponent extends DesignTokensArticleComponent {
  override readonly inspectorState = signal('Noch nicht gelesen.');

  /** Same reading as the English method; only the empty marker and the status line are German. */
  override readTokens(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const root = this.document.documentElement;
    const view = this.document.defaultView;
    if (!view) return;
    const styles = view.getComputedStyle(root);
    this.liveTokens.set(
      this.inspected.map((name) => ({
        name,
        value: styles.getPropertyValue(name).trim() || '(leer)',
      })),
    );
    const theme = root.classList.contains('dark-theme') ? 'dunklen' : 'hellen';
    this.inspectorState.set(this.inspected.length + ' Tokens im ' + theme + ' Theme gelesen.');
  }
}
