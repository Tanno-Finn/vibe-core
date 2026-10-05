import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './badge-article.component';

/**
 * German twin of the Badge guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs badge`).
 */
@Component({
  selector: 'app-badge-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'badge'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Span, drei Wege, ihn auf die Seite zu bringen. Die Komponente steht dort, wo du sie hinschreibst, die
          Direktive setzt ihn in ein anderes Element, und der Wrapper hängt ihn über einen Block. Alle drei rendern
          dasselbe Badge — sie unterscheiden sich darin, welchem Element der Knoten am Ende gehört, und genau das
          entscheidet, wie der Wert angesagt wird.
        </p>

        <h3>Die drei Wege</h3>
        <div class="stage stage--row">
          <span class="lbl">Komponente</span>
          <p-badge [value]="count()" severity="danger" />
          <span class="lbl">Direktive</span>
          <button type="button" class="plain" pBadge [value]="count()" severity="danger">Posteingang</button>
          <span class="lbl">Wrapper</span>
          <p-overlayBadge [value]="count()" severity="danger">
            <i class="pi pi-envelope" aria-hidden="true"></i>
          </p-overlayBadge>
          <p-button label="+1" size="small" severity="secondary" (onClick)="bump()" />
          <p-button label="Zurücksetzen" size="small" severity="secondary" [text]="true" (onClick)="count.set('3')" />
        </div>
        <p class="src-note">
          Alle drei rendern dasselbe <code>.p-badge</code>-Element. Die Komponente ist das Badge
          (<code>openng-optimus-ui-badge.mjs:392</code>), die Direktive hängt eines als letztes Kind an den Host
          (<code>:262</code>), und der Wrapper rendert eines als Geschwister des Inhalts, den er projiziert
          (<code>openng-optimus-ui-overlaybadge.mjs:103-106</code>).
        </p>

        <h3>Die Elemente, die jeder Weg erzeugt</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Die Direktive setzt außerdem <code>p-overlay-badge</code> auf den Host, an dem sie sitzt
          (<code>openng-optimus-ui-badge.mjs:261</code>) — das ist die Regel, die den Span über die Ecke legt; das
          Root-<code>div</code> des Wrappers trägt stattdessen <code>p-overlaybadge</code>
          (<code>openng-optimus-ui-overlaybadge.mjs:29</code>). Die beiden Klassennamen unterscheiden sich um einen
          Bindestrich und gehören zu zwei verschiedenen Stylesheets.
        </p>

        <h3>Größen und Severities</h3>
        <div class="stage">
          <div class="matrix">
            @for (s of severities; track s) {
              <span class="matrix__cell"><span class="lbl">{{ s || 'Standard' }}</span><p-badge value="8" [severity]="s" /></span>
            }
          </div>
          <div class="matrix matrix--sizes">
            @for (z of sizes; track z) {
              <span class="matrix__cell"><span class="lbl">{{ z || 'Standard' }}</span><p-badge value="8" [badgeSize]="z" /></span>
            }
            <span class="matrix__cell"><span class="lbl">Punkt</span><p-badge severity="danger" /></span>
          </div>
        </div>
        <p class="src-note">
          Die Severity wählt genau eine Klasse (<code>openng-optimus-ui-badge.mjs:42-47</code>); ohne Severity gilt
          die Primärpalette. Der Punkt rechts hat überhaupt keinen <code>value</code>, und genau das wählt
          <code>p-badge-dot</code> (<code>:38</code>).
        </p>

        <h3>Geometrie je Größe</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Stufe</th><th>font-size</th><th>min-width / height</th><th>gewählt durch</th></tr>
            </thead>
            <tbody>
              <tr><td>sm</td><td>{{ m.smFont }}</td><td>{{ m.smBox }}</td><td><code>badgeSize="small"</code></td></tr>
              <tr><td>root</td><td>{{ m.rootFont }}</td><td>{{ m.rootBox }}</td><td>nichts gesetzt</td></tr>
              <tr><td>lg</td><td>{{ m.lgFont }}</td><td>{{ m.lgBox }}</td><td><code>badgeSize="large"</code></td></tr>
              <tr><td>xl</td><td>{{ m.xlFont }}</td><td>{{ m.xlBox }}</td><td><code>badgeSize="xlarge"</code></td></tr>
              <tr><td>Punkt</td><td>—</td><td>{{ m.dotBox }}</td><td>leerer <code>value</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/badge/index.mjs</code>, Exporte
          <code>root</code>, <code>sm</code>, <code>lg</code>, <code>xl</code> und <code>dot</code>; das Schriftgewicht
          ist auf jeder Stufe <code>{{ m.rootWeight }}</code>. Die Regeln, die sie lesen, sind
          <code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:2-14</code> und <code>:16-22</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Den Weg wählst du mit einer einzigen Frage: Gehört die Zahl zum zugänglichen Namen des Elements, auf dem sie
          sitzt, oder steht sie daneben? Die Direktive antwortet „innen“, der Wrapper antwortet „daneben“, und die
          Komponente überlässt die Antwort der Stelle, an die du sie setzt.
        </p>

        <h3>Welcher Weg, und was er kostet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Form</th><th>wo der Knoten landet</th><th>Wirkung auf den Namen des Hosts</th><th>greif dazu, wenn</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-badge</code></td>
                <td>wo du es hinschreibst</td>
                <td>keine eigene — es übernimmt, was das umgebende Element tut</td>
                <td>das Badge im Textfluss neben den Wörtern steht, die es benennen</td>
              </tr>
              <tr>
                <td><code>[pBadge]</code></td>
                <td>letztes Kind des Hosts</td>
                <td>geht in einen aus dem Inhalt berechneten Namen ein</td>
                <td>der Host ein Bedienelement ist und du seinen Namen ausdrücklich festlegst</td>
              </tr>
              <tr>
                <td><code>p-overlayBadge</code></td>
                <td>Geschwister des projizierten Inhalts, in einem Wrapper-<code>div</code></td>
                <td>keine — es geht nie in den Namen des Inhalts ein</td>
                <td>die Markierung über einem Avatar, Icon oder Bild hängt</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Platzierung abgelesen aus <code>openng-optimus-ui-badge.mjs:262</code> und <code>:155-157</code> für die
          Direktive, <code>openng-optimus-ui-overlaybadge.mjs:103-106</code> für den Wrapper. Die Namensspalte folgt
          aus diesen Platzierungen plus der HTML-Regel „Name aus dem Inhalt“, nicht aus einer eigenen Messung.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Punkt als einziger Träger des Zustands</span>
            <div class="dd__stage">
              <p-overlayBadge severity="danger">
                <i class="pi pi-bell dd__icon" aria-hidden="true"></i>
              </p-overlayBadge>
            </div>
            <p class="dd__why">{{ m.ddDotBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — der Zustand als Text, das Badge als sein Bild</span>
            <div class="dd__stage">
              <p-overlayBadge value="3" severity="danger">
                <i class="pi pi-bell dd__icon" aria-hidden="true"></i>
              </p-overlayBadge>
              <span class="dd__caption">3 ungelesene Nachrichten</span>
            </div>
            <p class="dd__why">{{ m.ddDotGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Ein leerer <code>value</code> wählt <code>p-badge-dot</code> (<code>openng-optimus-ui-badge.mjs:38</code>),
          eine bemaßte Box ohne Padding (<code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:16-22</code>), die
          keinen Textknoten enthält — die linke Bühne rendert also eine Markierung, hinter der im Accessibility Tree
          nichts steht, während die rechte einen Textknoten im Badge und einen Satz daneben hat.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Overlay-Badge mit <code>size</code> bemaßen</span>
            <div class="dd__stage">
              <p-overlayBadge value="9" size="xlarge" severity="info">
                <span class="dd__box"></span>
              </p-overlayBadge>
            </div>
            <p class="dd__why">{{ m.ddSizeBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — <code>badgeSize</code>, der Input, der gelesen wird</span>
            <div class="dd__stage">
              <p-overlayBadge value="9" badgeSize="xlarge" severity="info">
                <span class="dd__box"></span>
              </p-overlayBadge>
            </div>
            <p class="dd__why">{{ m.ddSizeGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen binden denselben Wert an dieselbe Komponente; nur der Name des Inputs unterscheidet sich. Das
          Template des Wrappers reicht <code>badgeSize</code> und nicht <code>size</code> an das Badge weiter, das es
          rendert (<code>openng-optimus-ui-overlaybadge.mjs:105</code>), obwohl <code>size</code> als Input deklariert
          ist (<code>:139</code>, kompilierte Liste <code>:102</code>) und sein Setter weiterhin den Deprecation-Hinweis
          ausgibt (<code>:88</code>).
        </p>

        <h3>Kommentierte Quelle</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          Das Muster, das das Kit für eine Zahl an einem Bedienelement nutzt, ist die Benachrichtigungsglocke in
          <code>notification-bell.component.ts</code>: Die Zahl steht im eigenen <code>aria-label</code> des Buttons,
          und die sichtbare Markierung trägt <code>aria-hidden="true"</code>, damit ihr Textknoten aus dem
          Accessibility Tree herausgehalten wird — das <code>aria-label</code> allein würde ihn nicht entfernen.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Ein Badge ist eine farbige Box mit fester Höhe und einem kleinen, fetten Label. Alles daran — die beiden
          Maße, die sieben Farbpaare, die Outline, die die Overlay-Variante von ihrem Untergrund trennt — stammt aus
          dem Aura-Preset, außer vier der Farbpaare, die das Kit neu einfärbt.
        </p>

        <h3>Farbpaare der Severities</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Severity</th><th>Hintergrund (hell / dunkel)</th><th>Text (hell / dunkel)</th></tr>
            </thead>
            <tbody>
              <tr><td>Standard</td><td>{{ m.svPrimaryBg }}</td><td>{{ m.svPrimaryFg }}</td></tr>
              <tr><td>secondary</td><td>{{ m.svSecondaryBg }}</td><td>{{ m.svSecondaryFg }}</td></tr>
              <tr><td>success</td><td>{{ m.svSuccessBg }}</td><td>{{ m.svSuccessFg }}</td></tr>
              <tr><td>info</td><td>{{ m.svInfoBg }}</td><td>{{ m.svInfoFg }}</td></tr>
              <tr><td>warn</td><td>{{ m.svWarnBg }}</td><td>{{ m.svWarnFg }}</td></tr>
              <tr><td>danger</td><td>{{ m.svDangerBg }}</td><td>{{ m.svDangerFg }}</td></tr>
              <tr><td>contrast</td><td>{{ m.svContrastBg }}</td><td>{{ m.svContrastFg }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aura-Paare aus <code>&#64;openng/optimus-ui-themes/dist/aura/badge/index.mjs</code>, Export
          <code>colorScheme</code>; die des Kits aus der <code>.p-badge</code>-Regel in <code>src/styles.scss</code>,
          die <code>--p-badge-&lt;severity&gt;-background</code> / <code>-color</code> setzt. Auras Weiß auf den
          <code>500</code>-Stufen maß 2,28–3,76:1.
        </p>
        <p>
          Zwei davon wandern mit dem Kit-Theme. Das Standard-Badge ist <code>&#123;primary.color&#125;</code>, das
          das Kit zur Laufzeit durch die Akzent-Rampe des Lesers ersetzt, sodass seine Farbe dem Akzent-Picker folgt.
          Und der Radius ist <code>&#123;border.radius.md&#125;</code>, den jeder visuelle Stil setzt — 0 im
          Standardstil werkbund, 12px lernwerkstatt, 10px skizzenbuch, 2px blaupause —, ein mehrstelliges Badge ist
          in werkbund also eine eckige Box; ein einstelliger Wert (<code>p-badge-circle</code>) und der Punkt bleiben
          in jedem Stil mit 50% rund. Kein Block eines visuellen Stils im Kit-Stylesheet fasst <code>.p-badge</code>
          an; die einzige Kit-Regel, die es tut, ist die Neueinfärbung der Severities oben, in jedem Stil gleich.
        </p>
        <p class="src-note">
          Akzent-Rampe: das in <code>src/app/services/theme.service.ts</code> eingemischte Preset
          <code>semantic.primary</code>; Radius-Skala: <code>presetOverrides.primitive.borderRadius</code> in
          <code>src/app/services/ui-styles.ts</code>; die 50%-Regeln aus
          <code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:16-27</code>.
        </p>

        <h3>Welches Kriterium gilt, und was das Gate misst</h3>
        <p>
          <code>docs/generated/CONTRAST.MD</code> prüft jedes Textpaar eines Badges, Gruppe <code>badge</code>, in
          allen vier visuellen Stilen und beiden Modi: die vier Kit-Severities 5,02–6,70:1 im hellen und
          8,15–10,62:1 im dunklen Modus, das Standard-Badge 5,18–17,85:1 über die Akzente, secondary 6,92–10,08:1,
          contrast 19,90–20,17:1 — am niedrigsten 5,02:1 (success, hell). Für die Kante eines Punkts gegen seinen
          Untergrund hat das Gate keine Zeile; sie hängt von der Seite ab. Welches Kriterium jeder Fall schuldet:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Fall</th><th>Kriterium</th><th>Schwelle</th><th>warum</th></tr>
            </thead>
            <tbody>
              <tr><td>Badge mit Wert, jede Größe</td><td>SC 1.4.3</td><td>4,5:1</td><td>{{ m.crText }}</td></tr>
              <tr><td>Punkt-Badge, das Bedeutung trägt</td><td>SC 1.4.11</td><td>3:1</td><td>{{ m.crDot }}</td></tr>
              <tr><td>Punkt-Badge, das sichtbaren Text wiederholt</td><td>—</td><td>—</td><td>{{ m.crDecor }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Großer Text beginnt unter SC 1.4.3 bei 18,66px fett. Die größte Stufe ist
          <code>xl</code> mit <code>{{ m.xlFont }}</code>, Gewicht <code>{{ m.rootWeight }}</code>
          (<code>&#64;openng/optimus-ui-themes/dist/aura/badge/index.mjs</code>, Exporte <code>xl</code> und
          <code>root</code>), die Lockerung auf 3:1 steht also auf keiner Stufe zur Verfügung — die Folgerung ergibt
          sich aus diesen beiden Zahlen, sie wurde nicht eigens gemessen.
        </p>

        <h3>Positionierung, und wo die beiden Overlay-Regeln sich widersprechen</h3>
        <pre class="code-block"><code>{{ positionCssSnippet }}</code></pre>
        <p class="src-note">
          Die Regel der Direktive wird aus <code>openng-optimus-ui-badge.mjs:19-26</code> injiziert, die des Wrappers
          aus <code>openng-optimus-ui-overlaybadge.mjs:16-26</code>. Die erste nutzt das logische
          <code>inset-inline-end</code>, die zweite das physische <code>right</code> — unter
          <code>dir="rtl"</code> wandert das Badge der Direktive also in die vordere Ecke, und das des Wrappers bleibt
          rechts. Nur der Wrapper zeichnet die Outline, aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/overlaybadge/index.mjs</code>, Export <code>root</code>:
          <code>{{ m.outline }}</code>. Das <code>solid</code> steht nicht in diesem Export — es kommt aus dem
          Stylesheet (<code>openng-optimus-ui-overlaybadge.mjs:24</code>).
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Kein eigenes responsives Verhalten: Das Badge behält bei jedem Viewport eine feste Höhe und eine
          Mindestbreite, hat keine Maximalbreite und keinen Umbruch, und das Stylesheet, das es gestaltet, enthält
          keine Media Query — ein langer Wert wächst also in die Breite, bis etwas ihn abschneidet. In den beiden
          Overlay-Formen liegt das halbe Badge ohnehin außerhalb der Box seines Wrappers, also schneidet jeder
          Vorfahre mit <code>overflow: hidden</code> es ab. Hinweis fürs Layout: Begrenze den Wert selbst (höchstens
          drei Zeichen halten jede Stufe in ihrer eigenen Box) und halte die Vorfahren des Overlays frei von
          Overflow-Clipping.
        </p>
        <p class="src-note">
          Feste <code>height</code> und <code>min-width</code> ohne <code>max-width</code> und ohne Umbruch in
          <code>&#64;openng/optimus-ui-styles/dist/badge/index.mjs:2-14</code>, einer Datei, die keine
          <code>&#64;media</code>-Regel enthält. Der Überstand ist das <code>transform</code> in den beiden oben
          zitierten Overlay-Regeln.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Drei Input-Oberflächen, und sie sind nicht dieselbe Oberfläche unter drei Namen. Die Komponente nimmt
          Signal-Inputs, die Direktive klassische und schreibt selbst ins DOM, und der Wrapper deklariert eine Teilmenge neu
          und reicht das meiste davon weiter. Jede nimmt außerdem vier Inputs an, die sie nicht deklariert.
        </p>

        <h3><code>p-badge</code> — die gesamte eigene API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Typ</th><th>gelesen von</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>value</code></td><td>string | number</td><td>Template und Klassenlogik</td><td>leer wählt den Punkt; ein Zeichen wählt den Kreis</td></tr>
              <tr><td><code>severity</code></td><td>sechs Literale</td><td>Klassenlogik</td><td>weggelassen ist die Primärpalette</td></tr>
              <tr><td><code>badgeSize</code></td><td>small | large | xlarge</td><td>Klassenlogik</td><td>der Input, den du nutzen solltest</td></tr>
              <tr><td><code>size</code></td><td>small | large | xlarge</td><td>Klassenlogik und <code>data-p</code></td><td>funktioniert hier, aber sieh dir die beiden anderen Oberflächen an</td></tr>
              <tr><td><code>badgeDisabled</code></td><td>boolesches Attribut</td><td>Style-Binding am Host</td><td>setzt <code>display: none</code>; das Element bleibt im DOM</td></tr>
              <tr><td><code>styleClass</code></td><td>string</td><td>Class-Binding am Host</td><td>seit v20 deprecated zugunsten von <code>class</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs und ihre Leser aus <code>openng-optimus-ui-badge.mjs:344-374</code> (Deklarationen),
          <code>:28-51</code> (die Klassenlogik), <code>:392</code> (das Template) und <code>:399-401</code> (die
          Host-Bindings). <code>small</code> wird von der Klassenlogik akzeptiert (<code>:39</code>), obwohl der
          Doc-Kommentar beider Größen-Inputs nur large und xlarge nennt.
        </p>

        <h3><code>[pBadge]</code> — zehn Inputs, und einer, der keiner ist</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Verhalten</th></tr>
            </thead>
            <tbody>
              <tr><td><code>value</code>, <code>severity</code></td><td>bei einer Änderung auf den erzeugten Span geschrieben</td></tr>
              <tr>
                <td><code>badgeSize</code></td>
                <td>
                  angewendet, während der Span gebaut wird (<code>openng-optimus-ui-badge.mjs:257</code>,
                  <code>:259</code>); eine spätere Änderung wird nicht bemerkt, weil <code>onChanges</code>
                  <code>value, size, severity, disabled, badgeStyle, badgeStyleClass</code> destrukturiert
                  (<code>:172</code>) und <code>setSizeClasses()</code> nur unter <code>if (size)</code> aufruft
                  (<code>:182-184</code>)
                </td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>
                  nach dem Erzeugen nur gelesen, solange <code>badgeSize</code> nicht gesetzt ist, und dann nur für
                  <code>large</code> und <code>xlarge</code> — <code>setSizeClasses</code> fügt <code>p-badge-lg</code>
                  und <code>p-badge-xl</code> hinzu und entfernt sie, nie aber <code>p-badge-sm</code>
                  (<code>:222-250</code>); ein <code>small</code> erreicht den Span nur über die beim Erzeugen gebaute
                  Klasse (<code>:257</code>, Klassenlogik <code>:39</code>). Außerdem gibt er bei jeder Zuweisung einen
                  Deprecation-Hinweis aus (<code>:126</code>)
                </td>
              </tr>
              <tr><td><code>badgeDisabled</code></td><td>Alias des Klassen-Members <code>disabled</code>; entfernt den Span und erzeugt ihn neu, sobald er zurückgesetzt wird</td></tr>
              <tr><td><code>badgeStyle</code>, <code>badgeStyleClass</code></td><td>additiv angewendet; nichts entfernt, was ein früherer Wert gesetzt hat, und ein <code>badgeStyle</code>, der kein Objekt ist, wird ohne Warnung verworfen (<code>:267</code>)</td></tr>
              <tr><td><code>pBadgePT</code>, <code>pBadgeUnstyled</code></td><td>Pass-through- und Unstyled-Flags, in Effects des Konstruktors gelesen</td></tr>
              <tr><td><code>ptBadgeDirective</code></td><td>deprecated Alias von <code>pBadgePT</code></td></tr>
              <tr><td><code>pBadge</code></td><td>gar kein Input — der Selektor, eine Zuweisung daran bleibt also wirkungslos</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarierte Inputs und der Alias <code>badgeDisabled</code> aus
          <code>openng-optimus-ui-badge.mjs:303</code>; der Selektor aus <code>:308</code>. Der Konsolenhinweis steht
          bei <code>:126</code>, die additiven Anwender bei <code>:266-275</code>, der Pfad zum Deaktivieren bei
          <code>:288-301</code>.
        </p>

        <h3>Der tote Input, und der, der nur halb ankommt</h3>
        <pre class="code-block"><code>{{ deadInputSnippet }}</code></pre>
        <p class="src-note">
          <code>p-overlayBadge</code> deklariert <code>size</code> (<code>openng-optimus-ui-overlaybadge.mjs:139</code>,
          kompilierte Liste <code>:102</code>) und reicht nur <code>badgeSize</code> an das Badge weiter, das es rendert
          (<code>:105</code>): Der Wert wird gespeichert und von nichts gelesen. Unabhängig davon wird das Attribut
          <code>data-p</code> der Komponente aus <code>size()</code> und nicht aus <code>badgeSize()</code> gebaut
          (<code>openng-optimus-ui-badge.mjs:376-384</code>), sodass ein Selektor auf dieses Attribut eine Größe nicht
          sieht, die über den empfohlenen Input gesetzt wurde.
        </p>

        <h3>Vier Inputs, die keiner der drei deklariert</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>was er tut</th></tr>
            </thead>
            <tbody>
              <tr><td><code>pt</code></td><td>Pass-through-Attribute je interner Sektion</td></tr>
              <tr><td><code>ptOptions</code></td><td>wie ein <code>pt</code>-Objekt mit dem des Presets zusammengeführt wird</td></tr>
              <tr><td><code>unstyled</code></td><td>rendert ohne die Klassen des Presets</td></tr>
              <tr><td><code>dt</code></td><td>Overrides von Design-Tokens, auf diese Instanz begrenzt</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Einmal auf <code>BaseComponent</code> deklariert (<code>openng-optimus-ui-basecomponent.mjs:428</code>) und
          von allen dreien geerbt, weshalb keine sie in ihren eigenen kompilierten Inputs führt. Lies die Basisklasse,
          bevor du eine Input-Tabelle von Optimus für vollständig erklärst.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>Die Zahl steht irgendwo, wo assistive Technik sie erreicht — in einem zugänglichen Namen oder in einer Statusregion, die dir gehört.</li>
          <li>Ein Badge, das diesen Text verdoppelt, ist im Accessibility Tree verborgen, statt zweimal vorgelesen zu werden.</li>
          <li>Kein Punkt-Badge ist der einzige Träger eines Zustands.</li>
          <li>Größen werden mit <code>badgeSize</code> gesetzt; an <code>[pBadge]</code> ist dieser Wert beim Erzeugen festgelegt und wird nie neu gebunden.</li>
          <li>Der Wert wird begrenzt und formatiert, bevor er gebunden wird.</li>
          <li>Die Overlay-Formen haben keinen Vorfahren, der Overflow abschneidet.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Das Badge trägt nichts zur Übersetzung bei: Es hat keine Strings aus der Bibliothek, kennt keine Locale und
          formatiert nichts selbst. Jede Entscheidung über die Zahl fällt, bevor der Wert gebunden wird — und das
          trifft in diesem Kit auf eine Übersetzungs-API, die einen Key nimmt und sonst nichts.
        </p>

        <h3>Was woher kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>String</th><th>Quelle</th></tr>
            </thead>
            <tbody>
              <tr><td>der eigene Text des Badges</td><td>dein <code>value</code>, unverändert in einen String umgewandelt</td></tr>
              <tr><td>die Obergrenze („99+“, „9+“)</td><td>deine; die Bibliothek hat keine</td></tr>
              <tr><td>Tausendertrennzeichen, Dezimalzeichen</td><td>deine; die Bibliothek ruft nie eine Locale-API auf</td></tr>
              <tr><td>der Satz, der der Zahl ihre Bedeutung gibt</td><td>ein Übersetzungs-Key von dir, am Host-Bedienelement oder in einer Statusregion</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Weder <code>openng-optimus-ui-badge.mjs</code> noch <code>openng-optimus-ui-overlaybadge.mjs</code>
          enthält <code>Intl</code>, <code>toLocaleString</code> oder irgendein Maximum; der Writer der Direktive
          wandelt mit <code>String()</code> um (<code>openng-optimus-ui-badge.mjs:219-220</code>), und das Template der
          Komponente interpoliert den rohen Wert (<code>:392</code>).
        </p>

        <h3>Eine Zahl in einem übersetzten Satz</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate()</code> nimmt einen Key und keine Parameter, also wird die Zahl nach
          dem Nachschlagen eingesetzt, und der Platzhalter muss in der Übersetzung selbst stehen. Der Aufruf gehört in
          ein <code>computed()</code>, damit der String neu berechnet wird, wenn die Sprache wechselt; die
          Referenzverdrahtung ist <code>notification-bell.component.ts</code> zusammen mit ihrem Modul
          <code>notifications.json</code>.
        </p>

        <h3>Was dieses Muster nicht löst</h3>
        <ul class="checklist">
          <li>{{ m.i18nPluralGap }}</li>
          <li>{{ m.i18nDigitGap }}</li>
          <li>{{ m.i18nWidthGap }}</li>
        </ul>
        <p class="src-note">
          Die ersten beiden sind Eigenschaften einer einfachen String-Ersetzung mit nur einer Form, nicht des Badges;
          die dritte folgt aus der festen Geometrie, die unter Design zitiert ist. Für keinen der drei Punkte bietet
          die Bibliothek eine Einstellung.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Badges success,
            info, warn und danger nutzen die semantischen Farben des Kits; jedes Textpaar ist jetzt geprüft
            (CONTRAST.MD <code>badge</code>, am niedrigsten 5,02:1), zitiert unter Design.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft:
            Alle Zeilenverweise halten; der Design-Tab und das Doc sagen jetzt, welche Werte mit dem Kit-Theme wandern
            (das Standard-Badge folgt dem Akzent, der Radius dem <code>border.radius.md</code> des Stils) und welche
            Paare zuerst zu prüfen sind; der Link zu SC 4.1.3 im Doc korrigiert; der Demo-Button der Direktive zeichnet
            seine Kante mit <code>--control-border</code>.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class BadgeArticleDeComponent extends BadgeArticleComponent {
  /** The measured values of the English article, with the prose around them in German. */
  override readonly m = {
    rootFont: '0.75rem (12px)',
    rootBox: '1.5rem / 1.5rem',
    rootWeight: '700',
    smFont: '0.625rem (10px)',
    smBox: '1.25rem / 1.25rem',
    lgFont: '0.875rem (14px)',
    lgBox: '1.75rem / 1.75rem',
    xlFont: '1rem (16px)',
    xlBox: '2rem / 2rem',
    dotBox: '0.5rem / 0.5rem, Padding 0',
    outline: 'width 2px, color {content.background}',

    svPrimaryBg: '{primary.color} / {primary.color}',
    svPrimaryFg: '{primary.contrast.color} / {primary.contrast.color}',
    svSecondaryBg: '{surface.100} / {surface.800}',
    svSecondaryFg: '{surface.600} / {surface.300}',
    svSuccessBg: 'Kit: --semantic-green-fg (green 700 / 300); Aura {green.500} / {green.400}',
    svSuccessFg: 'Weiß / {green.950}',
    svInfoBg: 'Kit: --semantic-blue-fg (blue 700 / 300); Aura {sky.500} / {sky.400}',
    svInfoFg: 'Weiß / {blue.950} (Aura {sky.950})',
    svWarnBg: 'Kit: --semantic-orange-fg (orange 700 / 300); Aura {orange.500} / {orange.400}',
    svWarnFg: 'Weiß / {orange.950}',
    svDangerBg: 'Kit: --semantic-red-fg (red 700 / 300); Aura {red.500} / {red.400}',
    svDangerFg: 'Weiß / {red.950}',
    svContrastBg: '{surface.950} / {surface.0}',
    svContrastFg: '{surface.0} / {surface.950}',

    crText:
      'Der Wert ist Text. Keine Größenstufe erreicht die Schwelle für großen Text, die Lockerung auf 3:1 greift also nie.',
    crDot:
      'Ein Punkt ohne Text ist eine Grafik, die Information vermittelt, also zählt seine Kante gegen den Untergrund, auf dem er sitzt.',
    crDecor:
      'Ein Punkt, der nur einen Satz daneben wiederholt, vermittelt allein nichts und ist dekorativ — verbirg ihn im Accessibility Tree, dann entfällt mit ihm auch das Kriterium.',

    ddDotBad:
      'Der Punkt rendert keinen Textknoten und fehlt deshalb im Accessibility Tree; wer ihn nicht sieht, erfährt gar nichts, und wer ihn sieht, erfährt nicht, was er bedeutet.',
    ddDotGood:
      'Die Zahl ist ein Textknoten im Badge und ein Satz daneben, also bleibt die Bedeutung auch ohne das Bild erhalten, und das Bild ist eine Abkürzung statt der Botschaft.',
    ddSizeBad:
      'Der Wrapper speichert den Wert und reicht einen anderen Input an das Badge weiter, also rendert das Badge in seiner Standardstufe — das Binding bleibt stillschweigend wirkungslos.',
    ddSizeGood:
      'Derselbe Wert auf dem Input, den das Template tatsächlich weiterreicht, also rendert das Badge in der Stufe xlarge.',

    i18nPluralGap:
      'Pluralformen: Ein einzelner gespeicherter String hat eine Form, also braucht eine Sprache, die rund um die Zahl flektiert, entweder eine zahlneutrale Formulierung oder einen Key je Form.',
    i18nDigitGap:
      'Ziffernform und Gruppierung: Das Badge gibt die Zeichen aus, die es bekommt, also muss eine Locale, die gruppiert oder andere Ziffern nutzt, das vor dem Binden erledigen.',
    i18nWidthGap:
      'Länge: Ein übersetzter Satz kann wachsen, und das Badge selbst hat eine feste Höhe und keinen Umbruch, also wird ein langer Wert breiter, statt umzubrechen.',
  };
}
