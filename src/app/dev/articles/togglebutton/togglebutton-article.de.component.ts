import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToggleButtonArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './togglebutton-article.component';

/**
 * German twin of the Toggle Button guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` and
 * `sizes` are German. Keep it in step with the English file: same tabs, same element
 * and binding skeleton (`node scripts/check-guide-translations.mjs togglebutton`).
 */
@Component({
  selector: 'app-togglebutton-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'togglebutton'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Toggle Button ist ein Button, der gedrückt bleibt. Er ist keine Checkbox mit Rahmen und kein eckig
          gezeichneter Switch: Das Element ist ein Custom Element mit <code>role="button"</code> und
          <code>aria-pressed</code>, und dieses zweite Attribut ist der ganze Unterschied zwischen einem Control,
          dessen Zustand bekannt ist, und einem, dessen Zustand nur sichtbar ist.
        </p>

        <h3>Das Control und was es meldet</h3>
        <div class="stage stage--row">
          <p-togglebutton
            [ariaLabel]="'Fett'"
            onLabel="Fett"
            offLabel="Fett"
            onIcon="pi pi-check"
            offIcon="pi pi-minus"
            [(ngModel)]="bold" />
          <span class="readout">aria-pressed = <strong>{{ boldPressed() }}</strong></span>
          <p-button label="Zurücksetzen" size="small" severity="secondary" [text]="true" (onClick)="bold = false" />
        </div>
        <p class="src-note">
          Das Attribut wird in der Host-Map von <code>openng-optimus-ui-togglebutton.mjs:280</code> bedingungslos als
          <code>checked ? "true" : "false"</code> gebunden; es ist also in beiden Zuständen vorhanden und wird nicht
          erst beim Drücken hinzugefügt.
        </p>

        <h3>Größen, volle Breite und die Seite des Icons</h3>
        <div class="stage">
          <div class="matrix">
            @for (s of sizes; track s.id) {
              <span class="matrix__cell">
                <span class="lbl">{{ s.id }}</span>
                <p-togglebutton
                  [ariaLabel]="s.id"
                  [onLabel]="s.label"
                  [offLabel]="s.label"
                  [size]="s.value"
                  [(ngModel)]="sizeDemo" />
              </span>
            }
            <span class="matrix__cell">
              <span class="lbl">Standard</span>
              <p-togglebutton
                [ariaLabel]="'Standard'"
                onLabel="Standard"
                offLabel="Standard"
                [(ngModel)]="sizeDemo" />
            </span>
            <span class="matrix__cell">
              <span class="lbl">iconPos right</span>
              <p-togglebutton
                [ariaLabel]="'Anheften'"
                onLabel="Anheften"
                offLabel="Anheften"
                onIcon="pi pi-check"
                offIcon="pi pi-minus"
                iconPos="right"
                [(ngModel)]="pinned" />
            </span>
          </div>
          <div class="stage__fluid">
            <p-togglebutton
              [ariaLabel]="'Volle Breite'"
              onLabel="Volle Breite"
              offLabel="Volle Breite"
              [fluid]="true"
              [(ngModel)]="wide" />
          </div>
        </div>
        <p class="src-note">
          <code>size</code> fügt <code>p-togglebutton-sm</code> / <code>-lg</code> und die passende
          <code>p-inputfield-*</code>-Klasse hinzu (<code>openng-optimus-ui-togglebutton.mjs:36-37</code>);
          <code>iconPos="right"</code> wirkt über <code>order: 1</code> auf
          <code>p-togglebutton-icon-right</code>, eine Regel, die die Bibliothek zusätzlich zum gemeinsamen Stylesheet
          mitbringt (<code>:21-23</code>). <code>fluid</code> setzt <code>width: 100%</code>
          (<code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>).
        </p>

        <h3>Button-Gruppe und was sie nicht tut</h3>
        <div class="stage">
          <p class="lbl">p-buttonGroup um p-button — eine Fuge</p>
          <p-buttonGroup>
            <p-button label="Ausschneiden" severity="secondary" />
            <p-button label="Kopieren" severity="secondary" />
            <p-button label="Einfügen" severity="secondary" />
          </p-buttonGroup>
          <p class="lbl lbl--spaced">p-buttonGroup um p-togglebutton — nichts fällt zusammen</p>
          <p-buttonGroup>
            <p-togglebutton [ariaLabel]="'Links'" onLabel="Links" offLabel="Links" [(ngModel)]="g1" />
            <p-togglebutton [ariaLabel]="'Mitte'" onLabel="Mitte" offLabel="Mitte" [(ngModel)]="g2" />
            <p-togglebutton [ariaLabel]="'Rechts'" onLabel="Rechts" offLabel="Rechts" [(ngModel)]="g3" />
          </p-buttonGroup>
        </div>
        <p class="src-note">
          Jede Gruppierungsregel ist gegen <code>.p-button</code> oder das Element <code>p-button</code> geschrieben
          (<code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code>, dazu die Optimus-Ergänzungen in
          <code>openng-optimus-ui-buttongroup.mjs:11-33</code>). Die Root-Klasse eines Toggle Buttons ist
          <code>p-togglebutton</code> (<code>openng-optimus-ui-togglebutton.mjs:31</code>), also erreicht ihn kein
          Selektor — auch nicht die Ein-Fugen-Regel des Kits in <code>styles.scss</code>, die ebenfalls auf
          <code>.p-button</code> zielt. Die Gruppe selbst (Benennung, Fugen je visuellem Stil) ist im Toolbar-Guide
          beschrieben.
        </p>

        <h3>Was jedes davon ausgibt</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Host-Attribute aus der kompilierten Host-Map (<code>openng-optimus-ui-togglebutton.mjs:280</code>) und den
          Decorator-Metadaten (<code>:301-312</code>); das Markup der Gruppe aus
          <code>openng-optimus-ui-buttongroup.mjs:70</code>. <code>data-pc-name</code> und <code>data-p</code>
          werden ebenfalls bedingungslos gebunden und sind hier der Lesbarkeit halber weggelassen.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welches Control, und warum</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Ein Boolean, fünf plausible Controls
            </caption>
            <thead>
              <tr>
                <th>Wenn die Antwort lautet …</th>
                <th>Nimm</th>
                <th>Weil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ m.qButton }}</td>
                <td><code>p-togglebutton</code></td>
                <td>{{ m.aButton }}</td>
              </tr>
              <tr>
                <td>{{ m.qSwitch }}</td>
                <td><code>p-toggleswitch</code></td>
                <td>{{ m.aSwitch }}</td>
              </tr>
              <tr>
                <td>{{ m.qCheckbox }}</td>
                <td><code>p-checkbox</code></td>
                <td>{{ m.aCheckbox }}</td>
              </tr>
              <tr>
                <td>{{ m.qSelect }}</td>
                <td><code>p-selectbutton</code></td>
                <td>{{ m.aSelect }}</td>
              </tr>
              <tr>
                <td>{{ m.qAction }}</td>
                <td><code>p-button</code></td>
                <td>{{ m.aAction }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          SelectButton umhüllt diese Komponente und überschreibt ihr <code>onLabel</code> /
          <code>offLabel</code> mit dem Label der Option
          (<code>openng-optimus-ui-selectbutton.mjs:319-320</code>); deshalb ist eine Gruppe mit nur einer Option nie
          der billigere Weg zu einem einzelnen Toggle.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Name, der sich beim Drücken ändert</span>
            <div class="dd__stage">
              <p-togglebutton onLabel="Details ausblenden" offLabel="Details anzeigen" [(ngModel)]="ddName" />
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Name, der Zustand in aria-pressed</span>
            <div class="dd__stage">
              <p-togglebutton
                [ariaLabel]="'Details'"
                onLabel="Details"
                offLabel="Details"
                onIcon="pi pi-eye"
                offIcon="pi pi-eye-slash"
                [(ngModel)]="ddName2" />
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Ohne <code>ariaLabel</code> kommt der Name aus dem Label-Span, der je nach Zustand
          <code>onLabel</code> oder <code>offLabel</code> ausgibt
          (<code>openng-optimus-ui-togglebutton.mjs:290</code>); <code>ariaLabel</code> ist ein Host-Attribut
          (<code>:280</code>) und überschreibt den Namen aus dem Inhalt.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Zustand allein über die Farbe</span>
            <div class="dd__stage">
              <p-togglebutton [ariaLabel]="'Raster'" onLabel="Raster" offLabel="Raster" [(ngModel)]="ddColour" />
              <p-togglebutton [ariaLabel]="'Liste'" onLabel="Liste" offLabel="Liste" [(ngModel)]="ddColour2" />
            </div>
            <p class="dd__why">{{ m.ddColourBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Icon-Paar neben der Farbe</span>
            <div class="dd__stage">
              <p-togglebutton
                [ariaLabel]="'Raster'"
                onLabel="Raster"
                offLabel="Raster"
                onIcon="pi pi-check"
                offIcon="pi pi-minus"
                [(ngModel)]="ddColour3" />
              <p-togglebutton
                [ariaLabel]="'Liste'"
                onLabel="Liste"
                offLabel="Liste"
                onIcon="pi pi-check"
                offIcon="pi pi-minus"
                [(ngModel)]="ddColour4" />
            </div>
            <p class="dd__why">{{ m.ddColourGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Im Aura-Preset sind der Root-Hintergrund, der Hover-Hintergrund und der Checked-Hintergrund derselbe
          Token, und nur <code>content.checkedBackground</code>, <code>content.checkedShadow</code> und die
          Label-Farbe unterscheiden sich (<code>&#64;openng/optimus-ui-themes/dist/aura/togglebutton/index.mjs</code>).
          Das Kit füllt die gedrückte Pille mit dem Akzent (Tab „Design“), den das Gate mit ≥&nbsp;3:1 vom Segment
          abhebt — trotzdem bleibt es eine Füllung, also ist das Icon-Paar weiterhin das Formsignal.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Gruppe auf p-buttonGroup benennen</span>
            <div class="dd__stage">
              <p-buttonGroup aria-label="Textausrichtung">
                <p-button label="Links" severity="secondary" />
                <p-button label="Mitte" severity="secondary" />
              </p-buttonGroup>
            </div>
            <p class="dd__why">{{ m.ddGroupBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein eigenes Gruppen-Element, von dir benannt</span>
            <div class="dd__stage">
              <div role="group" aria-label="Textausrichtung">
                <p-buttonGroup>
                  <p-button label="Links" severity="secondary" />
                  <p-button label="Mitte" severity="secondary" />
                </p-buttonGroup>
              </div>
            </div>
            <p class="dd__why">{{ m.ddGroupGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Das <code>role="group"</code> der Komponente sitzt auf ihrem inneren Span
          (<code>openng-optimus-ui-buttongroup.mjs:70</code>), und das Host-Element bindet überhaupt kein
          ARIA-Attribut — die Klasse deklariert in ihren 109 Zeilen keinen Host-Block.
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          Die Konvention des Kits für jeden sichtbaren String ist
          <code>TranslationService.translate(key)</code> in einem <code>computed()</code>; der Service nimmt einen
          Key und sonst nichts. Das Sortier-Control des Katalogs ist eine Referenzimplementierung eines so
          verdrahteten Controls aus der <code>p-togglebutton</code>-Familie.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-pressed" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 &mdash; aria-pressed</a
            >
            &mdash; das Attribut, für das diese Komponente existiert, und was seine drei Werte bedeuten.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer"
              >W3C APG &mdash; Button pattern, toggle buttons</a
            >
            &mdash; die Regel, dass sich der Name eines Toggle Buttons nicht mit seinem Zustand ändern darf.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            &mdash; woran ein gedrückter Zustand scheitert, der allein über die Farbe transportiert wird.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            &mdash; die 3:1, die die gedrückte Pille schuldet, sobald sie den Zustand kennzeichnet.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>
          Zwei Elemente erledigen die ganze Arbeit. Der Host <code>p-togglebutton</code> ist der Button: Rahmen,
          Padding, Radius, Fokus-Ring. In ihm ist ein einzelner <code>span.p-togglebutton-content</code> die Pille,
          die sich beim Zustandswechsel tatsächlich ändert, und in ihr sitzen der optionale Icon-Span und der
          Label-Span.
        </p>

        <h3>Was sich zwischen den beiden Zuständen ändert — Aura und was das Kit malt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Eigenschaft</th>
                <th>Nicht gedrückt</th>
                <th>Gedrückt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Host-Hintergrund</td>
                <td>{{ m.tokRootBg }}</td>
                <td>{{ m.tokRootBgChecked }}</td>
              </tr>
              <tr>
                <td>Host-Rahmenfarbe</td>
                <td>{{ m.tokRootBorder }}</td>
                <td>{{ m.tokRootBorderChecked }}</td>
              </tr>
              <tr>
                <td>Content-Hintergrund</td>
                <td>{{ m.tokContentBg }}</td>
                <td>{{ m.tokContentBgChecked }}</td>
              </tr>
              <tr>
                <td>Content-Schatten</td>
                <td>{{ m.tokContentShadow }}</td>
                <td>{{ m.tokContentShadowChecked }}</td>
              </tr>
              <tr>
                <td>Label-Farbe</td>
                <td>{{ m.tokLabel }}</td>
                <td>{{ m.tokLabelChecked }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und -Werte aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/togglebutton/index.mjs</code> (Exporte
          <code>root</code>, <code>icon</code>, <code>content</code>, <code>colorScheme</code>), geschrieben als
          hell / dunkel. Die Regeln, die sie verbrauchen, stehen in
          <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>. Die Kit-Werte stammen aus der
          <code>.p-togglebutton</code>-Regel in <code>src/styles.scss</code>, die die
          <code>--p-togglebutton-*</code>-Variablen in jedem Stil und Modus neu zuweist.
        </p>

        <h3>Geometrie und was <code>size</code> wirklich ändert</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>size="small"</code></th>
                <th>Standard</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Host-Padding</td>
                <td>{{ m.padSm }}</td>
                <td>{{ m.padMd }}</td>
                <td>{{ m.padLg }}</td>
              </tr>
              <tr>
                <td>Content-Padding</td>
                <td>{{ m.cpadSm }}</td>
                <td>{{ m.cpadMd }}</td>
                <td>{{ m.cpadLg }}</td>
              </tr>
              <tr>
                <td>Schriftgröße</td>
                <td>{{ m.fsSm }}</td>
                <td>{{ m.fsMd }}</td>
                <td>{{ m.fsLg }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gleiche Quelle wie oben (<code>root.sm</code>, <code>root.lg</code>, <code>content.sm</code>,
          <code>content.lg</code>). Beide Padding-Stufen sind über alle drei Größen identisch, also bewegen sich nur
          die Schriftgröße und die geerbte Zeilenbox.
        </p>

        <h3>Welches Kriterium der gedrückte Zustand schuldet</h3>
        <p>
          Zwei verschiedene Regeln greifen, und welche gilt, hängt davon ab, was die Bedeutung trägt. Das Label ist
          Text und schuldet <strong>SC 1.4.3</strong>, 4,5:1 gegen alles, was dahinter liegt. Die Pille ist eine
          Fläche, und sobald sie das ist, was „gedrückt“ sagt, ist sie ein Nicht-Text-Indikator und schuldet
          <strong>SC 1.4.11</strong>, 3:1 gegen die nicht gedrückte Fläche daneben. Und wenn für beide Zustände ein
          einziges Label ohne Icon-Paar verwendet wird, drückt allein die Farbe den Zustand aus, und das ist
          <strong>SC 1.4.1</strong> — ein Kriterium, das kein Kontrastverhältnis erfüllen kann, weil die Lösung ein
          zweiter Kanal ist und keine dunklere Farbe.
        </p>
        <p class="src-note">
          Alle drei Paare sind in <code>docs/generated/CONTRAST.MD</code>, <code>togglebutton &amp;
          selectbutton</code>, je Stil × Akzent × Modus geprüft. Die gedrückte Pille (<code>--primary-color-fg</code>)
          auf dem <code>--surface-section</code>-Segment: 3,88–16,84:1 (SC 1.4.11; am niedrigsten in blaupause dunkel,
          fire). Das gedrückte Label (<code>--surface-card</code> auf der Pille): 4,75–17,85:1. Das nicht gedrückte
          Label (<code>--text-color-secondary</code>) auf dem Segment: 6,65:1 hell / 5,91:1 dunkel in werkbund, am
          niedrigsten 4,64:1 (blaupause, hell). Auras eigene Pille war Weiß auf <code>surface.100</code>, 1,10:1
          hell und 1,34:1 dunkel. Die Füllung ist ein Helligkeitssprung, nicht nur ein Farbton; ein Icon-Paar fügt
          für SC 1.4.1 trotzdem das Formsignal hinzu.
        </p>

        <h3>Fokus und deaktiviert</h3>
        <p>
          Der Fokus-Ring ist der eine Ring des Kits: <code>.p-togglebutton:focus-visible</code> steht in der
          <code>styles.scss</code>-Regel, die 2px <code>--primary-color-fg</code> mit 2px Abstand zeichnet
          (<code>!important</code>, über dem 1px-<code>focus.ring</code> des Presets), gemessen in CONTRAST.MD,
          <code>focus ring</code>. Der Host nimmt den Fokus (<code>tabindex="0"</code>), also liegt der Ring um das
          ganze Segment. Mit dem deaktivierten Aussehen ist es eine andere Geschichte — das Preset liefert
          <code>togglebutton.disabled.*</code>-Farben, aber ihre einzige Regel ist
          <code>.p-togglebutton:disabled</code>, und <code>:disabled</code> trifft nie ein Custom Element. Was du
          tatsächlich siehst, ist die globale Opacity von <code>.p-disabled</code>. Dieselbe Falle erwischt auch
          Regeln auf Kit-Seite: Ein Selektor mit <code>:enabled</code> oder <code>:disabled</code> gegen
          <code>.p-togglebutton</code> ist von Anfang an tot. Selektiere <code>.p-disabled</code> oder das Attribut
          <em>mit seinem Wert</em>, <code>[data-p-disabled="true"]</code>. Ohne Wert trifft der Attribut-Selektor
          jeden Toggle Button: <code>data-p-disabled</code> ist bedingungslos an <code>$disabled()</code> gebunden,
          das zu <code>false</code> statt zu <code>undefined</code> auflöst, also trägt ein aktivierter Button
          <code>data-p-disabled="false"</code>. Aus demselben Grund trifft <code>:not(:disabled)</code> immer, und
          deshalb greift die Hover-Regel auch bei einem deaktivierten Button weiter.
        </p>
        <p class="src-note">
          Fokus- und Disabled-Regeln aus
          <code>&#64;openng/optimus-ui-styles/dist/togglebutton/index.mjs</code>; die Opacity, die tatsächlich greift,
          aus <code>&#64;openng/optimus-ui-styles/dist/base/index.mjs</code>. Die bedingungslose Attribut-Bindung und
          das Computed, das sie liest, stehen in <code>openng-optimus-ui-togglebutton.mjs:280</code> und
          <code>:310</code>.
        </p>

        <h3>Was das Kit darüberlegt: visuelle Stile und Ripple</h3>
        <p>
          Die Farben sind die <code>.p-togglebutton</code>-Regel des Kits (siehe die Zustandstabelle) &mdash; der
          Button-Block des <code>ThemeService</code> im Kit ist an <code>.p-button</code> gebunden, und diese Klasse
          trägt ein Toggle Button nicht. Auch die Form ist nicht die von Aura: Jeder
          <code>html.style-&lt;name&gt;</code>-Block in <code>styles.scss</code> (ADR-0016) zielt auf
          <code>.p-togglebutton</code>, und der Host-Radius (<code>&#123;content.border.radius&#125;</code>, also
          <code>&#123;border.radius.md&#125;</code>) folgt dem <code>presetOverrides.primitive.borderRadius</code> des
          jeweiligen Stils.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Stil</th>
                <th>Was der Host bekommt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>werkbund</td>
                <td>
                  Rahmen <code>var(--style-bw) solid var(--style-outline)</code> (3px hell, 2px dunkel), Radius 0,
                  kein Schatten, die Display-Schrift
                </td>
              </tr>
              <tr>
                <td>lernwerkstatt</td>
                <td>2px-Outline plus ein um 2px versetzter Schatten, die Display-Schrift mit 700, große Radien</td>
              </tr>
              <tr>
                <td>skizzenbuch</td>
                <td>1.5px-Outline, Papierschatten, ein handgezeichneter Radius</td>
              </tr>
              <tr>
                <td>blaupause</td>
                <td>die Display-Schrift mit 600, gesperrtes Label in Großbuchstaben; Rahmen unverändert</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Zwei Folgen. Die Outline gibt dem Host in drei Stilen eine sichtbare Grenze, während der gedrückte Zustand in
          allen vier die gefüllte Pille ist. Und das Eindrücken der Stile umgeht die <code>:enabled</code>-Falle: Es
          ist als <code>.p-togglebutton[data-p-disabled='false']:active</code> geschrieben, das Attribut mit seinem
          Wert, also drücken werkbund, lernwerkstatt und skizzenbuch einen Toggle Button genauso ein wie einen
          <code>p-button</code>; blaupause drückt keinen von beiden ein.
        </p>
        <p>
          <strong>Ripple.</strong> Die Komponente trägt <code>Ripple</code> als Host-Direktive
          (<code>openng-optimus-ui-togglebutton.mjs:300</code>), und das Kit schaltet die globale
          <code>ripple</code>-Konfiguration ein, also bekommt der Host <code>.p-ripple</code>
          (<code>position: relative; overflow: hidden</code>) und eine <code>mousedown</code>-Welle; der Vertrag steht
          im Button-Guide, der <code>pRipple</code> behandelt.
        </p>
        <p class="src-note">
          Die <code>.p-togglebutton</code>-Selektoren in den vier <code>html.style-&lt;name&gt;</code>-Blöcken von
          <code>styles.scss</code>; Radien aus <code>src/app/services/ui-styles.ts</code>; die Liste der
          Host-Direktiven in den Metadaten der Komponente unter <code>openng-optimus-ui-togglebutton.mjs:300</code>.
        </p>

        <h3>Schmale Bildschirme</h3>
        <p>
          Keine der beiden Komponenten verhält sich von sich aus responsiv: Der Toggle Button behält bei jedem
          Viewport seine natürliche Breite, schneidet nie ab und bricht sein Label nie um, und
          <code>p-buttonGroup</code> ist eine <code>inline-flex</code>-Zeile ohne Umbruchregel, also läuft eine
          Gruppe, die breiter als ihre Spalte ist, seitlich über, statt neu zu fließen. Hinweis fürs Layout: Setz
          <code>[fluid]="true"</code> in einem begrenzten Elternelement für einen einzelnen Button, und gib einer
          Gruppe ein eigenes Elternelement mit <code>flex-wrap: wrap</code> — oder geh unterhalb von etwa
          <code>30rem</code> auf weniger Buttons herunter.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>ToggleButton-Inputs und welche davon ankommen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Wirkung</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>onLabel</code> / <code>offLabel</code></td><td>{{ m.inLabels }}</td><td>wirksam</td></tr>
              <tr><td><code>onIcon</code> / <code>offIcon</code></td><td>{{ m.inIcons }}</td><td>wirksam</td></tr>
              <tr><td><code>iconPos</code></td><td>{{ m.inIconPos }}</td><td>wirksam</td></tr>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td>{{ m.inAria }}</td><td>wirksam</td></tr>
              <tr><td><code>size</code></td><td>{{ m.inSize }}</td><td>wirksam</td></tr>
              <tr><td><code>fluid</code></td><td>{{ m.inFluid }}</td><td>wirksam</td></tr>
              <tr><td><code>allowEmpty</code></td><td>{{ m.inAllowEmpty }}</td><td>wirksam</td></tr>
              <tr><td><code>tabindex</code></td><td>{{ m.inTabindex }}</td><td>wirksam, mit einem toten Zweig</td></tr>
              <tr><td><code>styleClass</code></td><td>{{ m.inStyleClass }}</td><td>wirksam, veraltet</td></tr>
              <tr><td><code>inputId</code></td><td>{{ m.inInputId }}</td><td><strong>wirkungslos</strong></td></tr>
              <tr><td><code>autofocus</code></td><td>{{ m.inAutofocus }}</td><td><strong>wirkungslos</strong></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarationen und die kompilierte Input-Liste in
          <code>openng-optimus-ui-togglebutton.mjs:280</code>; <code>inputId</code> bei <code>:172</code> und
          <code>autofocus</code> bei <code>:187</code> stehen in dieser Liste und an keiner anderen Stelle der Datei —
          keine Host-Bindung liest sie, das Template enthält keine <code>id</code>, und die Host-Direktiven sind
          <code>Ripple</code> und <code>Bind</code>.
        </p>

        <h3>Die vier plus vier, die sie erbt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Von</th>
                <th>Was im DOM ankommt</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>disabled</code></td><td>BaseEditableHolder</td><td>{{ m.ihDisabled }}</td></tr>
              <tr><td><code>invalid</code></td><td>BaseEditableHolder</td><td>{{ m.ihInvalid }}</td></tr>
              <tr><td><code>required</code></td><td>BaseEditableHolder</td><td>{{ m.ihRequired }}</td></tr>
              <tr><td><code>name</code></td><td>BaseEditableHolder</td><td>{{ m.ihName }}</td></tr>
              <tr><td><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code></td><td>BaseComponent</td><td>{{ m.ihBase }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklariert in <code>openng-optimus-ui-baseeditableholder.mjs:58</code> und
          <code>openng-optimus-ui-basecomponent.mjs:428</code>; die Komponente setzt
          <code>usesInheritance: true</code> (<code>openng-optimus-ui-togglebutton.mjs:280</code>) und listet keinen
          der acht selbst auf, deshalb sind sie in einer generierten API-Tabelle unsichtbar.
        </p>

        <h3>Die zwei Template-Slots und die pTemplate-Kopien, die die Guards nie befragen</h3>
        <pre class="code-block"><code>{{ slotSnippet }}</code></pre>
        <p class="src-note">
          Die Queries sind <code>ContentChild('icon')</code> und <code>ContentChild('content')</code>, beide mit
          <code>&#123; descendants: false &#125;</code>
          (<code>openng-optimus-ui-togglebutton.mjs:365-370</code>); die <code>PrimeTemplate</code>-Query bei
          <code>:371-373</code> füllt eigene Felder (<code>:246-259</code>), die die Guards des Templates bei
          <code>:283</code> und <code>:282</code> nie befragen.
        </p>

        <h3>Formulare und was ein Submit mitnimmt</h3>
        <pre class="code-block"><code>{{ formsSnippet }}</code></pre>
        <p class="src-note">
          Der Value Accessor ist bei <code>openng-optimus-ui-togglebutton.mjs:91-95</code> registriert, und
          <code>writeControlValue</code> weist <code>checked</code> direkt zu (<code>:267-271</code>). Da der Host
          kein Formular-Control ist, nimmt ein nativer Formular-Submit für ihn nichts mit, und
          <code>[allowEmpty]="false"</code> blockiert das Lösen in <code>toggle</code> (<code>:120</code>) und nicht
          am Model.
        </p>

        <h3>Accessibility-Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.ckName }}</li>
          <li>{{ m.ckPressed }}</li>
          <li>{{ m.ckDisabled }}</li>
          <li>{{ m.ckGroup }}</li>
          <li>{{ m.ckColour }}</li>
          <li>{{ m.ckKeyboard }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Die einzigen zwei Strings der Bibliothek</h3>
        <p>
          Fast jedes Optimus-Control überlässt dir den Text. Dieses nicht ganz: <code>onLabel</code> hat den
          Standardwert <code>'Yes'</code> und <code>offLabel</code> den Wert <code>'No'</code>, und ein Button, der
          ohne einen der beiden Inputs gerendert wird, zeigt diese englischen Wörter in jeder Sprache, die du
          auslieferst. Es sind die einzigen Hersteller-Strings im Bundle, und sie laufen nicht über die
          Übersetzungskonfiguration der Bibliothek, also gibt es nichts, was sich zentral überschreiben ließe — setz
          immer beide Inputs.
        </p>
        <p class="src-note">
          Standardwerte bei <code>openng-optimus-ui-togglebutton.mjs:136</code> und <code>:141</code>; der Label-Span
          gibt sie direkt aus (<code>:290</code>). <code>openng-optimus-ui-buttongroup.mjs</code> rendert keinen
          eigenen Text — sein Template ist ein einzelner <code>&lt;span&gt;</code> mit einem
          <code>&lt;ng-content&gt;</code> (<code>:70</code>).
        </p>

        <h3>Ein Label übersetzen, das sich nicht ändern darf</h3>
        <p>
          Der zugängliche Name muss in beiden Zuständen identisch bleiben, also speist derselbe übersetzte String
          <code>ariaLabel</code>, <code>onLabel</code> und <code>offLabel</code>. Das ist ein Key, einmal in einem
          <code>computed()</code> aufgelöst, damit er bei einem Sprachwechsel neu aufgelöst wird.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate(key)</code> nimmt einen Key und gibt einen String zurück; es akzeptiert
          keine Interpolationsparameter, also wird alles Variable nach dem Aufruf zusammengesetzt.
        </p>

        <h3>Länge ist ein Layout-Risiko, kein Abschneide-Risiko</h3>
        <p>
          Nichts in den beiden Komponenten kürzt mit Auslassungspunkten oder bricht absichtlich um: Das Label ist ein
          schlichter Span in einer <code>inline-flex</code>-Content-Box, also macht eine Übersetzung, die 40 % länger
          ist, den Button breiter. In einer <code>p-buttonGroup</code> vervielfacht sich diese Verbreiterung mit der
          Zahl der Buttons in der Zeile. Plane mit der längsten Sprache, die du auslieferst, wenn du entscheidest, wie
          viele Buttons eine Zeile fassen kann, und zieh Icon plus Name einem ganzen Satz vor.
        </p>

        <h3>Rechts-nach-links</h3>
        <p>
          Die Eckregeln der Gruppe sind mit logischen Eigenschaften geschrieben
          (<code>border-start-end-radius</code> und Verwandte), und ihr Zusammenfallen der Rahmen nutzt
          <code>border-inline-end</code>, also fallen in einem gespiegelten Layout ohne Hilfe die richtigen Kanten
          zusammen. Die Icon-Seite des Toggle Buttons selbst ist die Ausnahme: <code>iconPos="right"</code> ist als
          <code>order: 1</code> in einer Flex-Zeile umgesetzt, die der Schreibrichtung folgt — „right“ heißt also
          „hinten“, was meistens das ist, was du willst, und heißt nie eine feste physische Seite.
        </p>
        <p class="src-note">
          Logische Eigenschaften in <code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code>; die
          <code>order: 1</code>-Regel in <code>openng-optimus-ui-togglebutton.mjs:21-23</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: die gedrückte Pille
            des Kits (<code>--primary-color-fg</code>, geprüft ≥&nbsp;3,88:1), der eine Fokus-Ring, das Eindrücken,
            das jetzt auslöst, nicht gedrücktes Label am niedrigsten 4,64:1; die Button-Gruppe verweist auf den
            Toolbar-Guide.
          </li>
          <li>
            <strong>v1.1</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft: neuer Design-Abschnitt dazu, was die
            <code>.p-togglebutton</code>-Regel jedes Stils hinzufügt und warum ihr <code>:enabled:active</code>-Eindrücken nie greift; die
            <code>Ripple</code>-Host-Direktive dokumentiert; Label-Kontrast aus dem Kontrast-Gate zitiert (das
            <code>--text-color-secondary</code>-Label des Kits, am niedrigsten 4,76:1); den Beleg für das tote Attribut nach <code>:310</code> verschoben; kommentierte
            Quellen in „Verwendung“ ergänzt; Historie ins gemeinsame Footer-Format überführt; Agent-Doc unter das Größenziel gekürzt.
          </li>
          <li>
            <strong>v1.0</strong> &mdash; 05.09.2026 &mdash; Erstveröffentlichung; gemessen gegen Optimus UI 2.0.2.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ToggleButtonArticleDeComponent extends ToggleButtonArticleComponent {
  override readonly sizes: ToggleButtonArticleComponent['sizes'] = [
    { id: 'small', label: 'Klein', value: 'small' },
    { id: 'large', label: 'Groß', value: 'large' },
  ];

  override readonly m = {
    qButton: 'Er gehört in eine Toolbar, und das Drücken ist die Aktion',
    aButton: 'Ein gedrückter Button ist ein Button; aria-pressed trägt den Zustand, ohne eine zweite Control-Form hinzuzufügen — um den Preis, dass nichts davon in einem nativen Formular-Submit ankommt.',
    qSwitch: 'Es ist eine Einstellung, die in dem Moment wirkt, in dem sie sich bewegt',
    aSwitch: 'Ein Switch liest sich als Einstellung, nicht als Aktion, und sein Zustand ist auf einen Blick erkennbar.',
    qCheckbox: 'Sie wird jetzt beantwortet und beim Absenden angewendet',
    aCheckbox: 'Eine Checkbox rendert ein natives Input, also trägt sie name, required und einen Submit-Wert — das klassische Control für „jetzt beantworten, beim Absenden anwenden“.',
    qSelect: 'Es gibt zwei oder mehr benannte Alternativen',
    aSelect: 'Eine segmentierte Gruppe zeigt die ganze Menge auf einmal, und sie hat ein multiple-Input, also können eine oder mehrere davon gedrückt sein.',
    qAction: 'Es passiert einmal und bleibt nicht an',
    aAction: 'Ein Befehl hat keinen Zustand zu melden, also wäre aria-pressed eine Lüge.',

    ddNameBad:
      'Der zugängliche Name ist das sichtbare Label, und das Label wechselt mit dem Zustand — ein Screenreader-Nutzer, der zu „Details anzeigen“ navigiert ist, findet an derselben Stelle „Details ausblenden“, und das liest sich wie ein anderes Control statt wie ein geändertes.',
    ddNameGood:
      'Ein Name in beiden Zuständen, ein Icon-Paar, das seine Form ändert, und der Zustand selbst kommt über aria-pressed — der Name identifiziert das Control, das Attribut meldet seinen Zustand.',
    ddColourBad:
      'Die beiden Buttons unterscheiden sich nur in der Füllung der inneren Pille; das Kit hebt diese Füllung mit 3:1 vom Segment ab, aber ein Nutzer, der eine gefüllte Pille nicht von einer leeren unterscheiden kann, bekommt trotzdem kein zweites Signal dafür, „welcher an ist“.',
    ddColourGood:
      'Das Icon unterscheidet sich in der Form wie in der Farbe, also ist der gedrückte Button erkennbar, ohne sich überhaupt auf die Fläche zu verlassen.',
    ddGroupBad:
      'Das Attribut landet auf dem äußeren Custom Element, das keine Rolle trägt; das Element, das tatsächlich role="group" hat, ist der Span darin, und der bleibt unbenannt.',
    ddGroupGood:
      'Rolle und Name sitzen auf demselben Element, also wird die Gruppe mit ihrem Zweck angesagt — und die Bibliothek erledigt weiter die einzige Aufgabe, die sie hat: die Ecken.',

    tokRootBg: '{surface.100} / {surface.950} in Aura; das Kit malt --surface-section',
    tokRootBgChecked: 'in beiden Schichten unverändert',
    tokRootBorder: '{surface.100} / {surface.950} in Aura; das Kit malt --surface-section',
    tokRootBorderChecked: 'in beiden Schichten unverändert',
    tokContentBg: 'transparent',
    tokContentBgChecked: '{surface.0} / {surface.800} in Aura; das Kit füllt mit --primary-color-fg',
    tokContentShadow: 'none',
    tokContentShadowChecked: '0px 1px 2px 0px rgba(0, 0, 0, 0.02), 0px 1px 2px 0px rgba(0, 0, 0, 0.04)',
    tokLabel: '{surface.500} / {surface.400} in Aura; das Kit rendert --text-color-secondary',
    tokLabelChecked: '{surface.900} / {surface.0} in Aura; das Kit rendert --surface-card',

    padSm: '0.25rem',
    padMd: '0.25rem',
    padLg: '0.25rem',
    cpadSm: '0.25rem 0.75rem',
    cpadMd: '0.25rem 0.75rem',
    cpadLg: '0.25rem 0.75rem',
    fsSm: '{form.field.sm.font.size}',
    fsMd: '1rem (aus der Host-Regel, kein Token)',
    fsLg: '{form.field.lg.font.size}',

    inLabels: 'Text des Label-Spans, gewählt nach dem aktuellen Zustand.',
    inIcons: 'Klassen-String auf dem Icon-Span; lass beide weg, und es wird kein Icon-Span gerendert.',
    inIconPos: 'Wählt die linke oder rechte Icon-Klasse; nur die rechte trägt eine order-Regel, die das Icon hinter das Label schiebt.',
    inAria: 'Host-aria-label / -aria-labelledby; überschreibt den Namen aus dem Inhalt.',
    inSize: 'Fügt das Klassenpaar sm / lg hinzu; ändert nur die Schriftgröße.',
    inFluid: 'Fügt die fluid-Klasse hinzu, Breite 100 %.',
    inAllowEmpty: 'false blockiert das Lösen im toggle-Handler.',
    inTabindex: 'Wird in den tabindex des Hosts geschrieben; sein Standardwert 0 macht den Disabled-Fallback unerreichbar.',
    inStyleClass: 'Wird an die Host-Klasse angehängt; nimm lieber das schlichte class-Binding.',
    inInputId: 'Nichts. Es wird keine id geschrieben, und es gibt kein labelbares Element, auf das ein Label zeigen könnte.',
    inAutofocus: 'Nichts. Es wird keine Autofocus-Direktive angewendet, und keine Basisklasse liest die Eigenschaft.',

    ihDisabled: 'Die Klasse p-disabled und der Guard in toggle; kein disabled-Attribut, kein aria-disabled.',
    ihInvalid: 'Die Klasse p-invalid und eine Rahmenfarbe; kein aria-invalid.',
    ihRequired: 'Nichts.',
    ihName: 'Nichts — der Host ist kein Formular-Control.',
    ihBase: 'Theme-Overrides, Unstyled-Modus und Pass-through-Attribute; keines davon ist an der Komponente deklariert.',

    ckName: 'Genau ein zugänglicher Name, in beiden Zuständen identisch, gesetzt mit ariaLabel oder ariaLabelledBy.',
    ckPressed: 'aria-pressed vorhanden und wechselnd — prüf es im Accessibility Tree, nicht im Markup.',
    ckDisabled: 'Ein deaktivierter Button wird entweder von dir aus der Tab-Reihenfolge genommen oder gar nicht gerendert.',
    ckGroup: 'Jede Gruppe solcher Buttons wird auf einem eigenen Element benannt, nie auf p-buttonGroup.',
    ckColour: 'Ein zweites Signal für den gedrückten Zustand, das nicht die Farbe ist.',
    ckKeyboard: 'Eingabetaste und Leertaste schalten beide um; nirgends in der UI wird eine Erwartung an Pfeiltasten geweckt.',
  };
}
