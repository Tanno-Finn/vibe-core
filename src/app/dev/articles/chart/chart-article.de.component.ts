import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './chart-article.component';

/**
 * German twin of the Chart guide (ADR-0018).
 *
 * Extends the English canonical article, so measured values and code snippets are
 * shared; only the template and the visible strings in `m` are German. Keep it in
 * step with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs chart`).
 */
@Component({
  selector: 'app-chart-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'chart'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Auf dieser Seite gibt es keinen echten Chart, und das ist die erste Tatsache über die Komponente. Dieses Kit
          installiert <code>chart.js</code> und rendert nie ein <code>p-chart</code>; das Modul darf nur hinter einer
          Lazy-Grenze erreicht werden, und dieses Kit hält keine Aufrufstelle dafür. Was folgt, ist das Markup, das die
          Komponente ausgibt, und die Komposition, die um sie herum stehen muss.
        </p>
        <p class="src-note">
          <code>src/app/shared/optimus-prebundle.ts</code> erreicht das Modul über einen dynamischen <code>import()</code>
          hinter einer <code>isDevMode()</code>-Sperre — ein Hinweis für den Dev-Server, keine gerenderte Komponente.
        </p>

        <h3>Was die Komponente ausgibt</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Das ganze Template, in der Struktur wörtlich, aus
          <code>openng-optimus-ui-chart.mjs:193-201</code>; die Wurzelklasse aus der Map <code>classes</code>
          (<code>:14-16</code>) und der Inline-Style der Wurzel aus <code>:11-13</code>. Achte darauf, was
          <em>nicht</em> da ist: kein Inhalt zwischen den Canvas-Tags, und genau dort setzt HTML den Fallback eines Canvas hin.
        </p>

        <h3>Die Komposition, die ihn lesbar macht</h3>
        <div class="stage">
          <figure class="demo-fig">
            <figcaption id="demo-cap">Gemeldete Vorfälle pro Quartal, 2025 (synthetisch)</figcaption>
            <div class="demo-canvas" aria-hidden="true">
              <span>Canvas — hier würde der Chart malen</span>
            </div>
            <details class="demo-details">
              <summary>Datentabelle</summary>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Quartal</th>
                      <th scope="col">Region A</th>
                      <th scope="col">Region B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><th scope="row">Q1</th><td>18</td><td>31</td></tr>
                    <tr><th scope="row">Q2</th><td>24</td><td>27</td></tr>
                    <tr><th scope="row">Q3</th><td>41</td><td>22</td></tr>
                    <tr><th scope="row">Q4</th><td>37</td><td>19</td></tr>
                  </tbody>
                </table>
              </div>
            </details>
          </figure>
        </div>
        <p class="src-note">
          Der graue Kasten steht dort, wo das <code>p-chart</code> hinkäme; alles um ihn herum ist der Teil, den die
          Komponente nicht liefert. Die <code>figcaption</code> ist das, worauf <code>[ariaLabelledBy]</code> zeigen
          würde, und die Tabelle ist die Textalternative, die SC 1.1.1 verlangt — die Komponente hat kein Input, das
          eines von beiden erzeugen könnte.
        </p>

        <h3>Dieselbe Komposition als Rezept</h3>
        <pre class="code-block"><code>{{ compositionSnippet }}</code></pre>
        <p class="src-note">
          <code>[ariaLabelledBy]</code> landet auf dem Canvas als <code>aria-labelledby</code>
          (<code>openng-optimus-ui-chart.mjs:196</code>), also benennt die Caption die Grafik einmal, und der Leser
          bekommt denselben Satz nicht zweimal zu hören.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Eine Chart-Bibliothek ist eine große Antwort, und dieses Kit enthält Canvases, die ohne eine gebaut wurden.
          Die Entscheidung zwischen beidem ist mehr wert als jede Option, die du danach setzt.
        </p>

        <h3>Welche Form</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was der Leser braucht</th>
                <th>Form</th>
                <th>Warum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>den Trend oder die Verteilung, nicht die Zahlen</td>
                <td><code>p-chart</code></td>
                <td>{{ m.whenChart }}</td>
              </tr>
              <tr>
                <td>die exakten Zahlen, oder weniger als etwa sechs davon</td>
                <td>eine Tabelle — <code>table</code></td>
                <td>{{ m.whenTable }}</td>
              </tr>
              <tr>
                <td>das Bild verändern und zusehen, wie es reagiert</td>
                <td>dein eigener 2D-Kontext — <code>demo-layout</code></td>
                <td>{{ m.whenOwnCanvas }}</td>
              </tr>
              <tr>
                <td>ein Verhältnis, ein Fertigstellungsstand</td>
                <td><code>progress</code></td>
                <td>{{ m.whenProgress }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die mittlere Zeile ist gemessen, nicht bevorzugt: <code>example-demo.component.ts</code> unter
          <code>src/app/pages/example-demo/</code> ruft <code>getContext</code> auf und importiert überhaupt keine
          Chart-Bibliothek. Die Konvention, für die sie steht, ist die allgemeine — eine Demo, deren Leser den Frame
          steuert, zeichnet ihren eigenen Canvas, weil eine Chart-Bibliothek die Animationsschleife besitzt, die diese
          Steuerung braucht.
        </p>

        <h3>Was tatsächlich durchgereicht wird</h3>
        <p>
          Der Wrapper ist mit Absicht dünn. <code>type</code>, <code>data</code>, <code>options</code> und
          <code>plugins</code> werden so an <code>new Chart(...)</code> übergeben, wie sie ankommen, also ist die
          Options-Oberfläche von Chart.js die API, gegen die du in Wahrheit schreibst. Der Wrapper steuert genau zwei
          eigene Werte bei, und er schreibt beide in das Objekt, das <em>du</em> übergeben hast, statt in eine Kopie.
        </p>
        <pre class="code-block"><code>{{ passthroughSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-chart.mjs:144-161</code>. Die Folge verdient es, klar gesagt zu werden: Ein
          <code>options</code>-Objekt, das zwei Charts teilen oder das nach dem Rendern zurückgelesen wird, ist nicht
          mehr das Objekt, das du geschrieben hast.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Name, wo ein Äquivalent geschuldet ist</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddNameOnlySnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Ein Screenreader sagt vier Wörter an, und die vier Quartale, zwei Regionen und acht Werte sind weg.
              SC 1.1.1 verlangt eine Alternative, die denselben Zweck erfüllt, und ein Canvas hat keine Struktur, auf
              die er zurückfallen könnte.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — gib ihm eine Caption, dann schreib die Tabelle</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddFigureSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Die Caption benennt die Grafik einmal über <code>ariaLabelledBy</code>, und die Tabelle trägt die Zahlen
              für alle — auch für den Leser, der einfach einen Wert ablesen will.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die schon übergebenen Daten verändern</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddMutateSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              {{ m.mutationWhy }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein neues Objekt zuweisen</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddAssignSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Eine neue Referenz erreicht den Setter, der Setter ruft <code>reinit()</code> auf, und der Chart wird
              zerstört und mit den neuen Zahlen neu gebaut.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Modul aus einer Datei importieren, die die Shell lädt</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddEagerSnippet }}</code></pre>
            </div>
            <p class="dd__why">
              {{ m.eagerWhy }}
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — es hinter einer Lazy-Grenze halten</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ ddLazySnippet }}</code></pre>
            </div>
            <p class="dd__why">
              Der Import liegt in einer lazy geladenen Komponente, also bleiben das Modul und seine Abhängigkeit im
              Chunk dieser Route — unten gemessen mit {{ m.chunkRaw }} roh.
            </p>
          </div>
        </div>
        <p class="src-note">
          Das Paar zum Verändern folgt aus den Settern bei <code>openng-optimus-ui-chart.mjs:97-114</code>; das Paar zum
          Import aus <code>chart.js/auto</code> bei <code>:4</code> und dem Eintrag <code>sideEffects</code> im eigenen
          Manifest von <code>chart.js</code>.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.1.1 Non-text Content</a
            >
            — eine Textalternative, die denselben Zweck erfüllt; ein kurzer Name auf dem Canvas ist keine.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — warum jede Datenreihe neben ihrem Farbton einen weiteren Träger braucht.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/canvas.html#the-canvas-element"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, the canvas element</a
            >
            — der Fallback-Inhalt, den das Template der Komponente leer lässt.
          </li>
          <li>
            <a href="https://www.chartjs.org/docs/4.5.1/" target="_blank" rel="noopener noreferrer"
              >Chart.js 4.5.1 documentation</a
            >
            — die Options-Oberfläche, die <code>type</code>, <code>plugins</code> und <code>options</code> unverändert erreichen.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Ein Canvas liegt außerhalb von CSS. Chart.js bekommt Farb<em>werte</em> übergeben und malt sie in eine Bitmap;
          eine Custom Property, eine Theme-Klasse und ein Wechsel des visuellen Stils gehen alle an ihm vorbei. Alles
          hier unten handelt davon, die Palette des Kits über diese Grenze zu bringen, und davon, was beim darauf
          folgenden Umschalten passiert.
        </p>

        <h3>Womit Chart.js standardmäßig malt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Standard</th>
                <th>Wert</th>
                <th>Was er färbt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>Chart.defaults.color</code></td>
                <td>{{ m.cjsColor }}</td>
                <td>Allen Text: Ticks, Legendenlabels, Titel.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.borderColor</code></td>
                <td>{{ m.cjsBorder }}</td>
                <td>Gitterlinien und Elementränder.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.backgroundColor</code></td>
                <td>{{ m.cjsBackground }}</td>
                <td>Balken- und Flächenfüllungen ohne explizite Farbe.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.font.family</code></td>
                <td>{{ m.cjsFont }}</td>
                <td>Jeden String auf dem Canvas — nicht den Font-Stack des Kits.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.responsive</code></td>
                <td>{{ m.cjsResponsive }}</td>
                <td>Ob überhaupt ein Resize Observer gebunden wird.</td>
              </tr>
              <tr>
                <td><code>Chart.defaults.maintainAspectRatio</code></td>
                <td>{{ m.cjsAspect }}</td>
                <td>Ob die Höhe der Breite oder dem Elternelement folgt.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Der Konstruktor <code>Defaults</code>,
          <code>node_modules/chart.js/dist/chunks/helpers.dataset.js:1021-1064</code> — <code>color</code> bei
          <code>:1026</code>, <code>borderColor</code> <code>:1025</code>, <code>backgroundColor</code>
          <code>:1024</code>, <code>font</code> <code>:1037-1043</code>, <code>maintainAspectRatio</code>
          <code>:1054</code>, <code>responsive</code> <code>:1059</code>. Kein einziger davon ist ein Token. Der Wrapper
          lässt die vier Zeilen zu Farbe und Schrift in Ruhe; die letzten beiden schreibt er selbst, in das
          Options-Objekt, das du übergeben hast (<code>openng-optimus-ui-chart.mjs:147</code>, <code>:149-151</code>).
        </p>

        <h3>Kit-Token über die Grenze bringen</h3>
        <pre class="code-block"><code>{{ tokenReadSnippet }}</code></pre>
        <p class="src-note">
          Es gibt keinen unterstützten Weg außer diesem: Die Werte müssen zu Strings aufgelöst sein, bevor sie übergeben
          werden, weil <code>new Chart(...)</code> schlichte Objekte bekommt
          (<code>openng-optimus-ui-chart.mjs:153-158</code>) und den Computed Style des DOM nie selbst anfasst.
        </p>

        <h3>Farben der Datenreihen, und was das Kompilat klärt und was nicht</h3>
        <p>
          Die sechs <code>--semantic-*-fg</code>-Token sind die fertige kategoriale Palette des Kits — sechs
          unterscheidbare Farbtöne, die schon gegen die Flächen gemessen sind, auf denen sie sitzen, in jedem visuellen
          Stil und in beiden Modi.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wert hell</th>
                <th>Verhältnis hell auf <code>--surface-card</code></th>
                <th>Spanne dunkel über die vier Stile</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>--semantic-blue-fg</code></td><td><code>#1d4ed8</code></td><td>6,70:1</td><td>7,28:1 – 9,32:1</td></tr>
              <tr><td><code>--semantic-orange-fg</code></td><td><code>#c2410c</code></td><td>5,18:1</td><td>7,79:1 – 9,96:1</td></tr>
              <tr><td><code>--semantic-green-fg</code></td><td><code>#15803d</code></td><td>5,02:1</td><td>9,35:1 – 11,97:1</td></tr>
              <tr><td><code>--semantic-red-fg</code></td><td><code>#b91c1c</code></td><td>6,47:1</td><td>6,92:1 – 8,85:1</td></tr>
              <tr><td><code>--semantic-cyan-fg</code></td><td><code>#0e7490</code></td><td>5,36:1</td><td>9,06:1 – 11,59:1</td></tr>
              <tr><td><code>--semantic-pink-fg</code></td><td><code>#be185d</code></td><td>6,04:1</td><td>7,24:1 – 9,26:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ m.contrastProvenance }}
        </p>
        <p>
          {{ m.contrastLimit }}
        </p>

        <h3>Farbe kann nicht der Träger sein</h3>
        <p>
          SC 1.4.1 ist das Kriterium, auf das die Palette oben keine Antwort gibt. Zwei dieser sechs Farbtöne sind ein
          Rot und ein Grün, und das Verhältnis, das jeder davon gegen die Card hält, sagt nichts darüber, ob ein Leser
          sie voneinander unterscheiden kann. Gib jeder Datenreihe ein zweites, nicht farbliches Signal —
          <code>pointStyle</code> für eine Linie oder ein Streudiagramm, <code>borderDash</code> für eine Linie, ein
          schraffiertes <code>backgroundColor</code> oder ein direktes Label für einen Balken — und sorg dafür, dass der
          Name der Datenreihe in der Legende und in der Datentabelle steht, wo Farbe überhaupt keine Rolle spielt.
        </p>

        <h3>Der Theme-Wechsel: Nichts passiert</h3>
        <p>
          {{ m.themeSwitch }}
        </p>
        <p class="src-note">
          Die Setter bei <code>openng-optimus-ui-chart.mjs:97-114</code> sind der einzige Auslöser zum Neuzeichnen, den
          die Komponente anbietet, und <code>reinit()</code> (<code>:178-183</code>) ist das, was sie aufrufen. Der
          visuelle Stil des Kits und sein Hell/Dunkel-Modus sind Computed Signals auf <code>ThemeService</code> —
          <code>style()</code> und <code>isDarkMode()</code> in <code>src/app/services/theme.service.ts</code> —, und
          davon sollte das neu bauende <code>computed()</code> abhängen. Chart.js selbst löst Optionen lazy über einen
          Proxy auf (<code>node_modules/chart.js/dist/chunks/helpers.dataset.js:1666</code>); was ein Wechsel nicht
          erzeugt, ist das Update, das ihn befragen würde.
        </p>

        <h3>Bei schmalem Viewport</h3>
        <p>
          {{ m.narrowStatement }}
        </p>
        <p class="src-note">
          <code>responsive</code> ist standardmäßig <code>true</code> (<code>openng-optimus-ui-chart.mjs:82</code>); der
          Resize-Pfad ist <code>dist/chart.js:5728</code> (<code>_initialize</code> ruft <code>resize()</code> auf, wenn
          responsive), <code>:6266</code> (<code>bindEvents</code> verzweigt in
          <code>bindResponsiveEvents</code>) und der Observer selbst bei <code>:3389</code>, <code>:3402</code>.
          <code>maintainAspectRatio</code> ist standardmäßig <code>true</code>
          (<code>chunks/helpers.dataset.js:1054</code>) und wird vom Wrapper auf <code>false</code> gesetzt, sobald
          <code>width</code> oder <code>height</code> angegeben ist (<code>openng-optimus-ui-chart.mjs:149-151</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Neun Inputs, ein Output, vier Methoden. Die zwei Dinge, die du vor allen anderen wissen solltest, sind, was
          ein Neuzeichnen auslöst und was die Abhängigkeit wiegt.
        </p>

        <h3>Die vollständige Liste der Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Typ</th>
                <th>Hinweis</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>type</code></td><td><code>string</code></td><td>{{ m.inType }}</td></tr>
              <tr><td><code>data</code></td><td><code>object</code></td><td>{{ m.inData }}</td></tr>
              <tr><td><code>options</code></td><td><code>object</code></td><td>{{ m.inOptions }}</td></tr>
              <tr><td><code>plugins</code></td><td><code>array</code></td><td>{{ m.inPlugins }}</td></tr>
              <tr><td><code>width</code> / <code>height</code></td><td><code>string</code></td><td>{{ m.inSize }}</td></tr>
              <tr><td><code>responsive</code></td><td><code>booleanAttribute</code></td><td>{{ m.inResponsive }}</td></tr>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td><code>string</code></td><td>{{ m.inAria }}</td></tr>
              <tr><td><code>pt</code> / <code>ptOptions</code> / <code>dt</code> / <code>unstyled</code></td><td>Signal-Inputs</td><td>{{ m.inInherited }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die neun eigenen Inputs sind die Map <code>inputs</code> der Komponente,
          <code>openng-optimus-ui-chart.mjs:192</code>, mit ihren Deklarationen bei <code>:62-114</code>; die vier
          geerbten sind <code>openng-optimus-ui-basecomponent.mjs:428</code>. Das einzige Output,
          <code>onDataSelect</code>, ist bei <code>:119</code> deklariert.
        </p>

        <h3>Was ein Neuzeichnen auslöst</h3>
        <pre class="code-block"><code>{{ lifecycleSnippet }}</code></pre>
        <p>
          Daraus folgen zwei Dinge. Das erste Zeichnen kann nicht von einem Setter kommen: <code>reinit()</code> kehrt
          sofort zurück, solange <code>this.chart</code> noch undefined ist, also erscheint der Chart in
          <code>onAfterViewInit</code> mit den <code>data</code>, die bis dahin gesetzt waren. Und jede spätere Änderung
          ist ein <em>Zerstören und Neubauen</em>, kein Update — Eingangsanimationen laufen erneut, und alles, was
          Chart.js gehalten hat (Hover-Zustand, eine Zoom-Position aus einem Plugin), ist weg. Wo das zählt, halte ein
          <code>&#64;ViewChild(UIChart)</code>, verändere über <code>getCanvas()</code> oder die Instanz, und ruf
          <code>refresh()</code> auf, das an <code>chart.update()</code> weiterleitet.
        </p>
        <p class="src-note">
          <code>openng-optimus-ui-chart.mjs:97-114</code> (die Setter), <code>:178-183</code>
          (<code>reinit</code>), <code>:131-134</code> (<code>onAfterViewInit</code>), <code>:173-177</code>
          (<code>refresh</code>), <code>:184-190</code> (<code>onDestroy</code>, das die Instanz zerstört).
        </p>

        <h3>Was die Abhängigkeit kostet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Chunk</th>
                <th>Build</th>
                <th>Roh</th>
                <th>Geschätzte Übertragung</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>openng-optimus-ui-chart</code></td><td>Browser</td><td>{{ m.chunkRaw }}</td><td>{{ m.chunkTransfer }}</td></tr>
              <tr><td><code>openng-optimus-ui-chart</code></td><td>Server</td><td>{{ m.chunkServer }}</td><td>—</td></tr>
              <tr><td>Initial-Bundle, zum Vergleich</td><td>Browser</td><td>{{ m.initialRaw }}</td><td>{{ m.initialTransfer }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          {{ m.bundleProvenance }}
        </p>

        <h3>Ihn aus dem Initial-Bundle heraushalten</h3>
        <pre class="code-block"><code>{{ lazySnippet }}</code></pre>
        <p class="src-note">
          Der Mechanismus ist <code>chart.js/auto</code> (<code>openng-optimus-ui-chart.mjs:4</code>), dessen
          Einstiegsdatei <code>Chart.register(...registerables)</code> auf Modulebene aufruft; weil <code>chart.js</code>
          diesen Einstieg in seiner eigenen Liste <code>sideEffects</code> nennt, darf ein Bundler ihn nicht weglassen.
          Daher die Regel: Erreiche das Modul nur hinter einer Lazy-Grenze. <code>src/app/shared/optimus-prebundle.ts</code>
          ist das ausgearbeitete Beispiel und sperrt seinen dynamischen <code>import()</code> hinter <code>isDevMode()</code>.
        </p>

        <h3>Die Tastaturlücke</h3>
        <p>
          {{ m.keyboardGap }} Sie zu schließen heißt, den Canvas selbst zu besitzen: ein Cursor, den du mit den
          Pfeiltasten über dieselben Punkte bewegst, die ein Zeiger treffen kann, und der unterwegs angesagt wird. Ein
          <code>p-chart</code> hat nichts Gleichwertiges und kein Input, das so etwas ergänzen würde.
        </p>
        <p class="src-note">
          <code>onCanvasClick</code> und sein <code>(click)</code>-Binding,
          <code>openng-optimus-ui-chart.mjs:135-143</code> und <code>:199</code>; die ausgegebene Payload wird aus
          <code>getElementsAtEventForMode</code> gebaut, das ein Maus-Event nimmt und kein Tastatur-Gegenstück hat.
        </p>

        <h3>Eine Methode, die wirft</h3>
        <p>
          {{ m.generateLegend }}
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>Nichts importiert <code>&#64;openng/optimus-ui/chart</code> außerhalb einer Lazy-Grenze.</li>
          <li>Der Chart sitzt in einer <code>figure</code> mit Caption, und <code>ariaLabelledBy</code> zeigt darauf.</li>
          <li>Eine echte Tabelle trägt dieselben Zahlen, sichtbar oder in einem <code>details</code>.</li>
          <li>Jede Datenreihe hat neben der Farbe einen weiteren Träger und einen Namen in Legende und Tabelle.</li>
          <li><code>data</code> und <code>options</code> werden als neue Objekte neu gebaut — kein push, keine Änderungen an Ort und Stelle.</li>
          <li>Das <code>options</code>-Objekt wird nicht zwischen Charts geteilt und nach dem Rendern nicht zurückgelesen.</li>
          <li>Farben werden in dem neu bauenden <code>computed()</code> aus Token gelesen, das vom Theme abhängt.</li>
          <li>Nichts ruft <code>generateLegend()</code> auf.</li>
          <li>Alles, was <code>onDataSelect</code> auslöst, ist auch über ein DOM-Control erreichbar.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Jedes Wort auf einem Chart ist gemalt, nicht geschrieben. Das hat eine angenehme Folge — es gibt keinen
          Bibliotheks-String zu übersetzen — und eine harte: Nichts auf dem Canvas rendert neu, wenn die Sprache
          wechselt, es sei denn, du gibst der Komponente ein neues Objekt.
        </p>

        <h3>Woher die Strings kommen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was der Leser sieht</th>
                <th>Wo du es hinschreibst</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Kategorienamen an der Achse</td><td><code>data.labels</code></td></tr>
              <tr><td>Namen der Datenreihen in Legende und Tooltip</td><td><code>data.datasets[n].label</code></td></tr>
              <tr><td>Titel und Untertitel</td><td><code>options.plugins.title</code>, <code>.subtitle</code></td></tr>
              <tr><td>Tooltip-Text</td><td><code>options.plugins.tooltip.callbacks</code></td></tr>
              <tr><td>Formatierte Tick-Werte</td><td><code>options.scales[id].ticks.callback</code></td></tr>
              <tr><td>Der zugängliche Name</td><td><code>[ariaLabel]</code> oder die <code>figcaption</code></td></tr>
              <tr><td>Die Datentabelle daneben</td><td>dein eigenes Template — die ehrliche Hälfte der Lokalisierung</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Plugin-IDs sind <code>legend</code>, <code>title</code>, <code>subtitle</code> und <code>tooltip</code>
          (<code>node_modules/chart.js/dist/chart.js:8742</code>, <code>:8943</code>, <code>:8981</code>,
          <code>:9878</code>). Die Komponente steuert keinen eigenen String bei: Ihr Template ist ein nackter Canvas
          (<code>openng-optimus-ui-chart.mjs:193-201</code>), also gibt es hier nichts, was eine Locale der Bibliothek
          übersetzen könnte.
        </p>

        <h3>Ein Sprachwechsel ist ein Neubau</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate(key)</code> liest das Signal <code>translationsVersion</code> des Service
          (<code>src/app/services/translation.service.ts</code>), also läuft ein <code>computed()</code> darüber bei
          einem Sprachwechsel erneut und erzeugt ein neues Objekt — genau das, was der Setter <code>data</code> bei
          <code>openng-optimus-ui-chart.mjs:100-103</code> braucht, um es zu bemerken. Auf diesem Service gibt es kein
          <code>instant()</code>.
        </p>

        <h3>Länge, Zahlen und Richtung</h3>
        <p>
          {{ m.i18nLength }}
        </p>
        <p>
          {{ m.i18nRtl }}
        </p>
        <p class="src-note">
          Die Legende liest <code>options.plugins.legend.rtl</code> und <code>textDirection</code>
          (<code>node_modules/chart.js/dist/chart.js:8462-8463</code>, <code>:8506</code>, <code>:8585</code>), und der
          Tooltip sein eigenes <code>rtl</code> (<code>:9574</code>, <code>:9661</code>). Beides sind Optionen, die du
          setzt; keine davon wird aus der Richtung des Dokuments abgeleitet, und der Wrapper übergibt keine von beiden.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>1.1</strong> — 23.09.2026 — Tabelle der Reihenfarben gegen das Kompilat neu geprüft (alle 48 Zeilen
            halten); Bundle-Werte aus dem aktuellen Produktions-Build neu abgelesen (Chunk-Übertragung 62,38 kB, Initial
            gesamt 1,62 MB / 327,40 kB); kommentierte Quellen schließen den Tab „Verwendung“ ab; Doku unter das Größenziel
            gekürzt.</li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Fassung, gemessen gegen Optimus UI 2.0.2 und
            chart.js 4.5.1.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ChartArticleDeComponent extends ChartArticleComponent {
  override readonly m = {
    // usage — which shape
    whenChart:
      'Das Auge liest Steigung, Streuung und Anteile schneller als eine Zahlenspalte — und nur dann, wenn es genug Zahlen gibt, damit eine Form entsteht.',
    whenTable:
      'Unter etwa sechs Werten fügt ein Chart einen Schritt zum Entschlüsseln hinzu und nimmt Genauigkeit weg. Eine Tabelle ist außerdem das, was ein Screenreader von einem Chart bekommt, also muss sie ohnehin geschrieben werden.',
    whenOwnCanvas:
      'Eine Chart-Bibliothek besitzt die Animationsschleife und zeichnet aus einem Datenmodell neu; eine Demo braucht Kontrolle über jeden Frame und meist einen Tastatur-Cursor über der Bühne, und keins von beiden bietet p-chart.',
    whenProgress:
      'Ein Wert gegen ein Maximum ist ein Balken, den das Kit schon mitliefert, mit Rolle und Namen, ohne die 208 kB.',

    // usage — do/don't rationales
    mutationWhy:
      'Das Array ist dasselbe Objekt, also läuft der Setter für data nie, reinit() wird nie aufgerufen, und der Canvas malt weiter die alten Zahlen. Nichts meldet einen Fehler — der Chart ist einfach veraltet.',
    eagerWhy:
      'chart.js/auto führt Chart.register(...registerables) auf Modulebene aus, und chart.js deklariert diesen Einstieg in sideEffects, also überlebt der Import das Tree-Shaking, und die ganze Bibliothek landet für jeden Besucher im Initial-Bundle, ob mit Chart oder ohne.',

    // design — chart.js defaults
    cjsColor: "'#666' — ein festes Grau, nicht --text-color",
    cjsBorder: "'rgba(0,0,0,0.1)' — unsichtbar auf einer dunklen Fläche",
    cjsBackground: "'rgba(0,0,0,0.1)'",
    cjsFont: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif bei 12px",
    cjsResponsive: 'true — ein Resize Observer wird gebunden',
    cjsAspect: 'true, bis der Wrapper es für dich abschaltet',

    // design — contrast
    contrastProvenance:
      'Jedes Verhältnis wörtlich zitiert aus docs/generated/CONTRAST.MD, Block „semantic text“, Vordergrund auf --surface-card. Die helle Spalte ist in allen vier visuellen Stilen gleich, weil --surface-card in jedem davon zu #ffffff aufgelöst wird; die dunklen Spannen umfassen die vier Stilblöcke, deren Cards sich unterscheiden: werkbund #1d1d21, lernwerkstatt #292725, skizzenbuch #2f2b26, blaupause #10305c. Alle Zeilen sind SC 1.4.3 und verlangen 4,5:1. Die niedrigste der 48 ist 5,02:1 — --semantic-green-fg #15803d auf #ffffff, heller Modus, in allen vier Stilen; der knappste dunkle Block ist blaupause, dessen niedrigster Wert 6,92:1 für --semantic-red-fg #fca5a5 ist.',
    contrastLimit:
      'Was diese Zahlen nicht klären: Das Kompilat misst ein Token gegen eine Fläche, nie eine Datenreihe gegen die Reihe daneben. Eine Linie auf der Card ist ein grafisches Objekt nach SC 1.4.11 und schuldet 3:1 gegenüber dem, worauf sie liegt — und wo sich zwei Reihen überlagern, ist das die jeweils andere, und das hat hier niemand gemessen. Nimm die Tabelle als Beleg, dass jeder Farbton auf dem Grund lesbar ist, und den Abschnitt darunter als Grund, warum das nicht reicht.',

    // design — theme switch and narrow viewport
    themeSwitch:
      'Chart.js friert Farben nicht beim Erzeugen ein — Optionen werden über einen Lazy-Resolver gelesen und bei jedem Update neu ausgewertet. Der Grund, warum nichts neu malt, ist schlichter als ein Schnappschuss: Ein Klassenwechsel auf dem Dokumentelement löst kein Update aus, und eine als String übergebene Farbe befragt CSS ohnehin nie. Ein Wechsel von Theme oder visuellem Stil lässt einen Chart auf unbestimmte Zeit in der vorigen Palette gemalt. Die Lösung ist kein Aufruf zum Neuzeichnen, sondern ein neues Objekt: Bau data und options in einem computed(), das von den Signals für Stil und Modus abhängt, damit der Wechsel neue Referenzen erzeugt, die Setter feuern und reinit() den Chart mit frisch gelesenen Token neu baut.',
    narrowStatement:
      'Bleibt responsive auf seinem Standard, folgt der Chart seinem Elternelement: Chart.js bindet einen Resize Observer an den Container des Canvas und zeichnet bei jeder Größenänderung neu, also braucht die Komponente ein Elternelement mit Größe und sonst nichts. maintainAspectRatio ist standardmäßig true, das heißt, die Höhe wird aus der Breite abgeleitet — ein Chart in einer 320px-Spalte wird niedrig statt gequetscht. [width] oder [height] zu setzen, schaltet das stillschweigend ab, und der Kasten behält dann bei jedem Viewport die Größe, die du ihm gegeben hast, also ist eine feste Breite das Einzige, was du auf einem schmalen Bildschirm nicht tun solltest. Was der Aufrufer bei kleinen Größen schuldet, ist der Inhalt, nicht der Kasten: Tick-Labels der Achsen, eine Legende und dichte Punktmarker schrumpfen nicht mit dem Canvas, also lass die Legende unterhalb von etwa 30rem Containerbreite weg und lass stattdessen die Datentabelle die Namen der Datenreihen tragen.',

    // development — inputs
    inType:
      'Chart-Typ von Chart.js, direkt an new Chart(...) übergeben. Jeder Typ, den chart.js/auto registriert, ist verfügbar.',
    inData: 'Ein Setter: Ein neues Objekt zeichnet neu, ein verändertes nicht.',
    inOptions: 'Ebenfalls ein Setter — und das Objekt, in das die Komponente zwei eigene Werte schreibt.',
    inPlugins: 'Plugins je Chart, standardmäßig ein leeres Array; unverändert weitergereicht.',
    inSize: 'CSS-Längen auf dem Wurzelelement, und der Auslöser, der maintainAspectRatio: false setzt.',
    inResponsive: 'Standard true. Wird in dein Options-Objekt geschrieben, statt intern gehalten zu werden.',
    inAria: 'Gebunden an aria-label und aria-labelledby auf dem Canvas. Nur ein Name — nie die Alternative.',
    inInherited:
      'Die vier aus BaseComponent; pt erreicht den Canvas ebenso wie die Wurzel, über ptm und die Host-Direktive pBind.',

    // development — bundle
    chunkRaw: '207,97 kB',
    chunkTransfer: '62,38 kB',
    chunkServer: '207,91 kB',
    initialRaw: '1,62 MB',
    initialTransfer: '327,40 kB',
    bundleProvenance:
      'Produktions-Build, Größentabelle der Angular CLI, @openng/optimus-ui@2.0.2: der Lazy-Chunk namens openng-optimus-ui-chart im Browser-Build und noch einmal im Server-Build, neben der Initial-Summe aus demselben Build. Der Chunk ist in beiden lazy, und das ist die Sperre hinter isDevMode() in src/app/shared/optimus-prebundle.ts, die ihre Arbeit tut — chart.js fehlt im Initial-Bundle.',

    // development — behavior
    keyboardGap:
      'onDataSelect wird aus einem Click-Handler auf dem Canvas ausgegeben, und das ist die einzige Interaktion, die die Komponente verdrahtet. Der Canvas bekommt keinen tabindex, keine Rolle außer img und keinen Key-Handler, also kann ein Tastatur- oder Schalternutzer überhaupt keinen Datenpunkt wählen — und eine Rolle img würde ihm ohnehin sagen, dass es nichts zu bedienen gibt.',
    generateLegend:
      'generateLegend() leitet an chart.generateLegend() weiter, eine Methode, die Chart.js in Version 3 entfernt hat. Sie kommt weder in der Distribution 4.5.1 noch in deren Typdeklarationen vor, also wirft der Aufruf einen TypeError, statt Markup zurückzugeben. Der Ersatz ist Konfiguration, kein Aufruf: options.plugins.legend, wobei das Legend-Plugin seine eigenen Labels erzeugt.',

    // i18n
    i18nLength:
      'Nichts auf einem Canvas bricht für dich um. Ein Legendeneintrag oder ein Achsenlabel, das in der Übersetzung um 40 % wächst, wird abgeschnitten oder überlappt seinen Nachbarn, statt umzubrechen, und keine CSS-Regel erreicht es. Plane für die längste Sprache: Kürze die Kategorielabels, verschieb die vollen Namen in die Datentabelle, und setz die Legende lieber unter den Plot als daneben.',
    i18nRtl:
      'Auch die Richtung wird nicht geerbt. Chart.js kehrt Legende und Tooltip nur um, wenn man es ihm sagt, über deren eigene Optionen rtl und textDirection; der Wrapper übergibt keine von beiden, also rendert eine RTL-Seite einen Chart von links nach rechts, solange der Aufrufer sie nicht in options setzt. Mit Zahlen ist es dasselbe — formatiere sie mit Intl.NumberFormat in einem Tick- oder Tooltip-Callback, denn der Canvas hat keine eigene Locale.',
  };
}
