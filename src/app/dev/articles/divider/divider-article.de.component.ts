import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DividerArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './divider-article.component';

/**
 * German twin of the Divider guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs divider`).
 */
@Component({
  selector: 'app-divider-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'divider'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Divider ist ein Pixel Rahmen auf einem Pseudo-Element. Was ihn einen Guide wert macht, ist nicht die Linie,
          sondern das Element darunter: Der Host meldet sich immer als Trenner, und alles, was du projizierst, landet
          in diesem Trenner.
        </p>

        <h3>Die drei Rahmenstile, horizontal</h3>
        <div class="stage stage--block">
          <p>Über der durchgezogenen Linie.</p>
          <p-divider />
          <p>Zwischen durchgezogen und gestrichelt.</p>
          <p-divider type="dashed" />
          <p>Zwischen gestrichelt und gepunktet.</p>
          <p-divider type="dotted" />
          <p>Unter der gepunkteten Linie.</p>
        </div>
        <p class="src-note">
          Drei echte Instanzen von <code>p-divider</code> aus <code>&#64;openng/optimus-ui/divider</code>. Der Stil
          wird über kombinierte Selektoren gesetzt — <code>.p-divider-dashed.p-divider-horizontal:before</code> und
          seine Geschwister in <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code>.
        </p>

        <h3>Inhalt in der Linie, und wo er sitzt</h3>
        <div class="stage stage--block">
          <p-divider align="left"><span class="chip">left</span></p-divider>
          <p-divider align="center"><span class="chip">center</span></p-divider>
          <p-divider align="right"><span class="chip">right</span></p-divider>
        </div>
        <p class="src-note">
          <code>align</code> ist nicht nur eine Klasse: Es wird als Inline-<code>justify-content</code> für einen
          horizontalen Divider und als <code>align-items</code> für einen vertikalen geschrieben
          (<code>openng-optimus-ui-divider.mjs:11-16</code>). Die Werte hängen vom Layout ab —
          <code>left/center/right</code> horizontal, <code>top/center/bottom</code> vertikal. <code>align</code>
          wegzulassen ist nicht dasselbe wie <code>left</code>: Die Inline-Ausrichtung fällt auf
          <code>center</code> (<code>:13</code>), während die Klassenliste trotzdem
          <code>p-divider-left</code> trägt (<code>:22</code>).
        </p>

        <h3>Vertikal, in einer Flex-Zeile</h3>
        <div class="stage stage--row">
          <span>Entwurf</span>
          <p-divider layout="vertical" />
          <span>In Prüfung</span>
          <p-divider layout="vertical" type="dotted" />
          <span>Veröffentlicht</span>
        </div>
        <p class="src-note">
          Die vertikale Linie hat keine eigene Höhe: <code>.p-divider-vertical</code> setzt
          <code>min-height: 100%</code>, und ihr <code>:before</code> setzt <code>height: 100%</code>. Die Bühne oben ist
          eine Flex-Zeile mit <code>align-items: stretch</code>, was die verwendete Quergröße des Dividers festlegt — und
          das <code>:before</code>, das am Divider selbst positioniert ist, nimmt seine 100 % von dieser Box.
        </p>

        <h3>Was die Komponente rendert</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Host-Bindings aus <code>openng-optimus-ui-divider.mjs:124-130</code>, Template aus <code>:117-121</code>.
          Die kompilierte Komponente bei <code>:105</code> hält <code>role</code> in <code>host.attributes</code> und die
          vier Bindings in <code>host.properties</code> — ein statisches Attribut, kein Binding — und der projizierte
          Inhalt ist ein Kind des Elements, das es trägt.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche Grenze</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Was du trennst</th><th>Greif zu</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Zwei Inhaltsabschnitte in einem Bereich, kein neues Thema</td>
                <td><code>p-divider</code></td>
                <td>{{ m.whenDivider }}</td>
              </tr>
              <tr>
                <td>Ein neues Thema mit einem Namen</td>
                <td>Überschrift + <code>section</code></td>
                <td>{{ m.whenSection }}</td>
              </tr>
              <tr>
                <td>Eine benannte Gruppe von Formular-Controls</td>
                <td><code>fieldset</code> / <code>legend</code></td>
                <td>{{ m.whenFieldset }}</td>
              </tr>
              <tr>
                <td>Einträge einer Liste</td>
                <td>Listen-Markup + CSS-Rahmen</td>
                <td>{{ m.whenList }}</td>
              </tr>
              <tr>
                <td>Nichts — du willst Luft</td>
                <td>Margin-Token</td>
                <td>{{ m.whenSpacing }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Der Unterschied liegt darin, was das Element sagt, nicht darin, was es zeichnet: Der Divider-Host trägt
          <code>role="separator"</code> bedingungslos (<code>openng-optimus-ui-divider.mjs:105</code>), also ist jeder
          einzelne eine Grenze, die assistiven Technologien angekündigt wird, ob du eine gemeint hast oder nicht.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — den Divider den Abschnittsnamen tragen lassen</span>
            <div class="dd__stage">
              <p-divider align="left"><span class="chip">Abrechnung</span></p-divider>
              <p class="dd__body">Karte mit Endziffern 4242</p>
            </div>
            <p class="dd__why">{{ m.contentNameWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine echte Überschrift, die Linie dekorativ</span>
            <div class="dd__stage">
              <h4 class="dd__h">Abrechnung</h4>
              <p-divider />
              <p class="dd__body">Karte mit Endziffern 4242</p>
            </div>
            <p class="dd__why">{{ m.headingWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Beispiele sind echt. Der projizierte Span in der linken Zelle ist ein Kind des Elements mit
          <code>role="separator"</code> (Template bei <code>openng-optimus-ui-divider.mjs:117-121</code>), und WAI-ARIA
          1.2 erklärt die Kinder dieser Rolle für präsentational.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein vertikaler Divider in einem Block-Elternelement</span>
            <div class="dd__stage">
              <div class="probe probe--block">
                <span>Entwurf</span>
                <p-divider layout="vertical" />
                <span>Veröffentlicht</span>
              </div>
            </div>
            <p class="dd__why">{{ m.verticalBlockWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine Flex-Zeile, die streckt</span>
            <div class="dd__stage">
              <div class="probe probe--row">
                <span>Entwurf</span>
                <p-divider layout="vertical" />
                <span>Veröffentlicht</span>
              </div>
            </div>
            <p class="dd__why">{{ m.verticalFlexWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Regeln aus <code>.p-divider-vertical</code> und <code>.p-divider-vertical:before</code> in
          <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code>; wie eine prozentuale
          <code>min-height</code> gegen einen Containing Block mit automatischer Höhe aufgelöst wird, regelt CSS 2.1,
          Abschnitt 10.7.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#separator" target="_blank" rel="noopener noreferrer"
              >W3C — WAI-ARIA 1.2, role separator</a
            >
            — die Definition hinter „unbenannter thematischer Umbruch“ und die Eigenschaft der präsentationalen Kinder.
          </li>
          <li>
            <a href="https://www.w3.org/TR/CSS21/visudet.html#min-max-heights" target="_blank" rel="noopener noreferrer"
              >W3C — CSS 2.1, section 10.7</a
            >
            — warum eine prozentuale <code>min-height</code> einen vertikalen Divider in einem Block-Elternelement ohne
            Höhe lässt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — die 3:1, die eine Linie schuldet, sobald sie allein einen Unterschied trägt.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Divider-Token</th><th>Aura-Wert</th><th>Auflösung, und was sie bewirkt</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>divider.border.color</code></td>
                <td><code>&#123;content.border.color&#125;</code></td>
                <td>{{ m.tokenBorder }}</td>
              </tr>
              <tr>
                <td><code>divider.content.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td>{{ m.tokenContentBg }}</td>
              </tr>
              <tr>
                <td><code>divider.content.color</code></td>
                <td><code>&#123;text.color&#125;</code></td>
                <td>{{ m.tokenContentFg }}</td>
              </tr>
              <tr>
                <td><code>divider.horizontal.margin</code></td>
                <td><code>1rem 0</code></td>
                <td>{{ m.tokenHMargin }}</td>
              </tr>
              <tr>
                <td><code>divider.horizontal.padding</code></td>
                <td><code>0 1rem</code></td>
                <td>{{ m.tokenHPadding }}</td>
              </tr>
              <tr>
                <td><code>divider.vertical.margin</code></td>
                <td><code>0 1rem</code></td>
                <td>{{ m.tokenVMargin }}</td>
              </tr>
              <tr>
                <td><code>divider.vertical.padding</code></td>
                <td><code>0.5rem 0</code></td>
                <td>{{ m.tokenVPadding }}</td>
              </tr>
              <tr>
                <td><code>divider.horizontal.content.padding</code></td>
                <td><code>0 0.5rem</code></td>
                <td>{{ m.tokenHContentPadding }}</td>
              </tr>
              <tr>
                <td><code>divider.vertical.content.padding</code></td>
                <td><code>0.5rem 0</code></td>
                <td>{{ m.tokenVContentPadding }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/divider/index.mjs</code>; die semantischen Auflösungen
          von <code>&#123;content.border.color&#125;</code>, <code>&#123;content.background&#125;</code> und
          <code>&#123;text.color&#125;</code> aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code>, hell und dunkel. Die Linie ist immer
          <code>1px</code> — die Breite steht fest im Stylesheet und ist nicht als Token zugänglich.
        </p>

        <h3>Kontrast: welches Kriterium gilt</h3>
        <p>{{ m.contrastPara }}</p>
        <p class="src-note">
          Die Linie ist das unveränderte <code>&#123;content.border.color&#125;</code>: Die visuellen Stile ändern nur
          Radien und den Button (<code>presetOverrides</code> in <code>src/app/services/ui-styles.ts</code>).
          <code>docs/generated/CONTRAST.MD</code> hat keine Divider-Gruppe; ihre informativen
          <code>progressbar.background</code>-Zeilen (Gruppe „progressbar &amp; slider“, kein Kriterium, jeder Stil und
          Modus) messen dieselbe Farbe auf
          <code>--surface-ground</code> und <code>--surface-card</code>. Der zitierte Satz ist der Kommentar über der
          <code>--control-border</code>-Deklaration in <code>src/styles.scss</code>.
        </p>

        <h3>Schmaler Viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code> enthält keine Media Query und keine Container
          Query; die Margins und Paddings oben sind feste <code>rem</code>-Werte aus dem Aura-Preset.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Werte</th><th>Standard</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>layout</code></td>
                <td><code>horizontal</code> · <code>vertical</code></td>
                <td><code>horizontal</code></td>
                <td>{{ m.apiLayout }}</td>
              </tr>
              <tr>
                <td><code>type</code></td>
                <td><code>solid</code> · <code>dashed</code> · <code>dotted</code></td>
                <td><code>solid</code></td>
                <td>{{ m.apiType }}</td>
              </tr>
              <tr>
                <td><code>align</code></td>
                <td><code>left/center/right</code> · <code>top/center/bottom</code></td>
                <td>—</td>
                <td>{{ m.apiAlign }}</td>
              </tr>
              <tr>
                <td><code>styleClass</code></td>
                <td>string</td>
                <td>—</td>
                <td>{{ m.apiStyleClass }}</td>
              </tr>
              <tr>
                <td><code>dt</code></td>
                <td>Token-Objekt</td>
                <td>—</td>
                <td>{{ m.apiDt }}</td>
              </tr>
              <tr>
                <td><code>unstyled</code></td>
                <td>boolean</td>
                <td>—</td>
                <td>{{ m.apiUnstyled }}</td>
              </tr>
              <tr>
                <td><code>pt</code> / <code>ptOptions</code></td>
                <td><code>host</code> · <code>root</code> · <code>content</code></td>
                <td>—</td>
                <td>{{ m.apiPt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die ersten vier sind an der Komponente deklariert (<code>openng-optimus-ui-divider.mjs:134-142</code>). Die
          letzten vier sind Signal-Inputs, geerbt von <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:42-63</code>), und erscheinen nicht in der eigenen kompilierten
          Input-Liste der Komponente bei <code>openng-optimus-ui-divider.mjs:105</code> — geh die Vererbungskette ab,
          bevor du eine Optimus-API-Tabelle für vollständig erklärst. Die drei <code>pt</code>-Abschnitte sind die, nach
          denen die Komponente tatsächlich fragt: <code>ptms(['host', 'root'])</code> auf den Host in
          <code>onAfterViewChecked</code> (<code>:73</code>) und <code>ptm('content')</code> auf das innere Div
          (<code>:106</code>). Outputs gibt es keine.
        </p>

        <h3>Die undefined-Klassenfalle</h3>
        <pre class="code-block"><code>{{ undefinedSnippet }}</code></pre>
        <p class="src-note">
          Die Klassenliste der Wurzel wird per String-Verkettung gebaut — <code>'p-divider-' + instance.layout</code>
          und <code>'p-divider-' + instance.type</code> bei <code>openng-optimus-ui-divider.mjs:17-30</code>. Jede Regel,
          die dem Host eine Box gibt oder die Linie zeichnet, hängt an der Layout-Klasse, und die Rahmenstile brauchen
          die Type-Klasse daneben; nur <code>.p-divider-content</code>, das den Chip malt, steht auf
          seiner eigenen Klasse.
        </p>

        <h3>Tokens auf einen Divider begrenzen</h3>
        <pre class="code-block"><code>{{ dtSnippet }}</code></pre>
        <p class="src-note">
          <code>dt</code> ist der geerbte Input für begrenzte Tokens
          (<code>openng-optimus-ui-basecomponent.mjs:42</code>). Das globale Preset ist Aura plus das Delta des visuellen
          Stils und die Akzent-Rampe (<code>src/app/services/theme.service.ts</code>), von denen keines ein Divider-Token
          berührt, also ist ein Override je Instanz der vorgesehene Weg, davon abzuweichen.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkRole }}</li>
          <li>{{ m.checkText }}</li>
          <li>{{ m.checkVertical }}</li>
          <li>{{ m.checkBinding }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Was die Bibliothek beiträgt</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          Das Template der Komponente (<code>openng-optimus-ui-divider.mjs:117-121</code>) enthält keinen Textknoten, und
          die Komponente liest nichts aus der Übersetzungskonfiguration von Optimus.
        </p>

        <h3>Schreibrichtung</h3>
        <p>{{ m.i18nRtl }}</p>
        <p class="src-note">
          Logische Properties (<code>inset-inline-start</code>, <code>border-inline-start</code>,
          <code>border-block-start</code>) und die Regel
          <code>.p-divider-left:dir(rtl), .p-divider-right:dir(rtl)</code>, beide in
          <code>&#64;openng/optimus-ui-styles/dist/divider/index.mjs</code>. Dass
          <code>p-divider-left</code> auch die Standardklasse ist, kommt aus dem Klassen-Builder, dessen Bedingung
          <code>!instance.align || instance.align === 'left'</code> lautet
          (<code>openng-optimus-ui-divider.mjs:22</code>).
        </p>

        <h3>Dein eigenes Label, wenn du auf einem bestehst</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Das gewöhnliche Muster des Kits: <code>TranslationService.translate()</code>, gelesen in einem
          <code>computed</code>, sodass das Computed vom Übersetzungsversions-Signal des Service abhängt und bei einem
          Sprachwechsel neu läuft. Nichts auf diesem Weg berührt die Optimus-Konfiguration.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Linienfarbe wird aus
            den informativen <code>progressbar.background</code>-Zeilen zitiert (die Slider-Spur ist jetzt
            <code>--control-border</code> und misst sie nicht mehr).
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Der Kontrast-Abschnitt zitiert die Kompilat-Zeilen, die die Linienfarbe
            messen; den Hinweis „Aura unverändert“ korrigiert (Stil-Delta und Akzent-Rampe werden zur Laufzeit
            eingemischt, keines berührt den Divider); kommentierte Quellen schließen den Tab „Verwendung“ ab.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Version, gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DividerArticleDeComponent extends DividerArticleComponent {
  /** The rulings and readings of the English article, in German. */
  override readonly m = {
    // usage — which boundary
    whenDivider:
      'Ein thematischer Umbruch innerhalb eines Bereichs, bei dem der Umbruch keinen Namen hat. Genau das bedeutet role="separator", und mehr kann ein Divider nicht sagen.',
    whenSection:
      'Ein benanntes Thema braucht einen Namen im Accessibility Tree. Eine Überschrift gibt Lesern eine Landmarke, an der sie navigieren können; eine Linie gibt ihnen ein Pixel.',
    whenFieldset:
      'Eine Gruppe von Controls braucht eine programmatische Verbindung zwischen ihrem Namen und ihren Mitgliedern. Ein Trenner zieht eine Grenze, ohne irgendetwas zu gruppieren.',
    whenList:
      'Listen-Markup kündigt die Anzahl der Einträge und ihre Grenzen bereits an. Ein Trenner zwischen den Zeilen fügt je Zeile eine zweite, überflüssige Grenzansage hinzu.',
    whenSpacing:
      'Ein Divider, der keine Bedeutung trägt, liefert trotzdem role="separator" aus. Wenn du nur die 1rem Luft willst, nimm den Margin und lass die Semantik weg.',

    // usage — do/don't
    contentNameWhy:
      'WAI-ARIA 1.2 macht die Kinder von role="separator" präsentational, also wird ein in die Linie projizierter Name nicht als Inhalt dieses Knotens offengelegt: Der Abschnitt bleibt im Accessibility Tree ohne Namen und außer Reichweite der Navigation über Überschriften.',
    headingWhy:
      'Die Überschrift benennt den Abschnitt für jeden Leser und jeden Navigationsmodus; die Linie daneben bleibt, was sie ist, eine Dekoration ohne Namen, der verloren gehen könnte.',
    verticalBlockWhy:
      'Ein vertikaler Divider hat keine eigene Höhe: Seine Regel setzt min-height: 100% und die Linie height: 100%. Eine prozentuale min-height gegen einen Containing Block mit automatischer Höhe wird zu null aufgelöst (CSS 2.1, 10.7), was das Block-Padding des Presets übrig lässt — 0.5rem oben und 0.5rem unten — und eine Linie, die nicht höher ist.',
    verticalFlexWhy:
      'Stretch sorgt nicht dafür, dass die prozentuale min-height aufgelöst wird; es setzt die verwendete Quergröße des Elements direkt. Das gibt der Divider-Box eine Höhe, und die Linie — ein absolut positioniertes :before, dessen Containing Block der Divider selbst ist — nimmt ihre 100 % von dieser Box.',

    // design — token chain
    tokenBorder: '{surface.200} hell, {surface.700} dunkel',
    tokenContentBg: '{surface.0} hell, {surface.900} dunkel — ein deckender Chip, egal worauf der Divider sitzt',
    tokenContentFg: '{text.color}, also {surface.700} hell und {surface.0} dunkel',
    tokenHMargin: '1rem über und unter der Linie, keiner in Zeilenrichtung',
    tokenHPadding: '1rem Padding in Zeilenrichtung, damit ein Inhalts-Chip nie den Rand erreicht',
    tokenVMargin: '1rem links und rechts der Linie, keiner in Blockrichtung',
    tokenVPadding: '0.5rem oben und unten — zusammen die ganze Höhe eines vertikalen Dividers, dessen Elternelement ihn nicht streckt',
    tokenHContentPadding: '0.5rem Padding in Zeilenrichtung im Chip, das die Linie um ihn herum unterbricht',
    tokenVContentPadding: '0.5rem Padding in Blockrichtung im Chip, das vertikale Gegenstück',

    contrastPara:
      'Ein Divider, der nur trennt, ist Dekoration: Er kennzeichnet kein Control und trägt keinen Text, also gilt SC 1.4.11 (Non-text Contrast, 3:1) für ihn nicht, und auch kein anderes Kriterium. Das Kriterium greift in dem Moment, in dem die Linie tragend wird — wo die Grenze das Einzige ist, das einem Leser sagt, dass zwei Blöcke verschiedene Dinge sind, ist die Linie eine bedeutungstragende Grafik und schuldet 3:1 gegen ihren Hintergrund. Die Divider-Linie erreicht das nicht: Sie malt {content.border.color}, und das Kontrast-Kompilat führt diese Farbe (als Aura-Fortschrittsspur, progressbar.background) mit 1,13:1 bis 1,23:1 auf den hellen Untergründen und 1,26:1 bis 1,76:1 auf den dunklen, über alle vier visuellen Stile. Das Kit erklärt dieselbe Absicht für seine eigene Haarlinie: src/styles.scss gibt Control-Kanten ein kontrastreicheres --control-border, mit dem Kommentar, dass SC 1.4.11 3:1 verlangt, „which the decorative --surface-border deliberately does not meet“ (was das dekorative --surface-border absichtlich nicht erreicht). Lies das auch als Regel für Divider: Lass eine Haarlinie nie den einzigen Träger eines Unterschieds sein.',

    narrow:
      'Kein eigenes responsives Verhalten. Ein horizontaler Divider ist width: 100% und folgt seinem Container in jedem Viewport; ein vertikaler behält seine 1rem Margins in Zeilenrichtung und wird nie horizontal, weil das Stylesheet der Komponente keine Media Query und keine Container Query enthält. Wenn eine Flex-Zeile unter deinem eigenen Breakpoint zu einer Spalte umbricht, geht der vertikale Divider mit und schrumpft auf sein Padding — stell das Layout am selben Breakpoint selbst um, oder lass den Divider weg und den Zeilenabstand (Gap) die Trennung tragen.',

    // development
    apiLayout: 'Zugleich der Wert von aria-orientation auf dem Host, direkt durchgebunden.',
    apiType: 'Nur der Rahmenstil. Wirkt über einen kombinierten Selektor, braucht also eine Layout-Klasse daneben.',
    apiAlign:
      'Abhängig vom Layout: left/center/right werden horizontal gelesen, top/center/bottom vertikal. Geschrieben als Inline-justify-content oder -align-items. Ungesetzt ist es nicht neutral — die Inline-Ausrichtung fällt auf center, während ein horizontaler Divider die Klasse p-divider-left bekommt und ein vertikaler p-divider-center.',
    apiStyleClass: 'Veraltet seit v20.0.0 — nimm class. Es wird in die Klassenliste des Hosts gemischt.',
    apiDt: 'Geerbt. Design-Tokens, begrenzt auf diese Instanz.',
    apiUnstyled: 'Geerbt. Rendert ohne die Preset-Styles — die Linie verschwindet mit ihnen.',
    apiPt: 'Geerbt. Drei Abschnitte wirken: host und root werden zusammengeführt und nach jedem View-Check auf das Host-Element geschrieben, content auf das innere Div.',

    checkRole:
      'Frag dich, ob du überhaupt einen Trenner gemeint hast. Jeder p-divider kündigt einen an; eine rein dekorative Linie zeichnest du besser als Rahmen am Nachbarn.',
    checkText:
      'Halte Bedeutung aus der Linie heraus. Alles Projizierte sitzt im Separator-Element, dessen Kinder präsentational sind.',
    checkVertical:
      'Gib einem vertikalen Divider ein Elternelement, das streckt, oder eine explizite Höhe. Ohne beides ist er ein bisschen Padding und keine sichtbare Linie.',
    checkBinding:
      'Binde layout oder type nie an einen Wert, der undefined sein kann. Der Klassenname wird daraus zusammengesetzt, also ergibt undefined p-divider-undefined, und keine Regel greift.',

    // i18n
    i18nLibrary:
      'Nichts. Der Divider hat keinen eigenen Text, keinen Label-Input und keinen Eintrag in der Übersetzungskonfiguration von Optimus. Der einzige String, den er ausgibt, ist aria-orientation, dessen Wert das Layout-Schlüsselwort ist und nicht sichtbar wird. Alles Lesbare in einem Divider ist Inhalt, den du projiziert hast, und er wird lokalisiert wie jeder andere Inhalt in deinem Template.',
    i18nRtl:
      'Das Stylesheet ist durchgehend in logischen Properties geschrieben, also folgt die Linie dem Schreibmodus ohne Arbeit auf deiner Seite. Eine Regel geht darüber hinaus auf die Richtung ein: p-divider-left und p-divider-right kehren unter :dir(rtl) die Flex-Richtung um, sodass „left“ weiter den Anfang der Zeile meint statt den physischen linken Rand. Achte darauf, welche Divider das betrifft — ein horizontaler Divider trägt p-divider-left, sobald align left oder ungesetzt ist, also gilt die Regel auch für den Standard-Divider, nicht nur für die, die du von Hand ausgerichtet hast. Nichts anderes in der Komponente liest die Richtung.',
  };
}
