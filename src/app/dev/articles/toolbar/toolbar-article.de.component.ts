import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { ToolbarArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './toolbar-article.component';

/** German readouts for the English action names that the template's event bindings pass to log(). */
const LOG_DE: Record<string, string> = {
  Run: 'Ausführen',
  Step: 'Schritt',
  Reset: 'Zurücksetzen',
  Settings: 'Einstellungen',
  'Zoom out': 'Verkleinern',
  'Reset zoom': 'Zoom zurücksetzen',
  'Zoom in': 'Vergrößern',
  Save: 'Speichern',
  'Save as draft': 'Als Entwurf speichern',
  'Save a copy': 'Kopie speichern',
  Export: 'Exportieren',
  'Export as CSV': 'Als CSV exportieren',
  'Export as JSON': 'Als JSON exportieren',
  'Smaller text': 'Text kleiner',
  'Larger text': 'Text größer',
};

/**
 * German twin of the Toolbar, Button Group, and Split Button guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (m, the demo
 * labels, the action readout) are German. Keep it in step with the English file:
 * same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs toolbar`).
 */
@Component({
  selector: 'app-toolbar-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'toolbar'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Drei Komponenten stellen Buttons nebeneinander, und jede verspricht etwas mehr, als sie hält. Die Toolbar
          kündigt ein Tastaturmodell an, das sie nicht umsetzt, die Button Group zeichnet eine Gruppe, die niemand benennen
          kann, und der Split Button öffnet ein Menü, aus dem er den Fokus nicht zurückgibt.
        </p>

        <h3>Die Toolbar im Auslieferungszustand</h3>
        <div class="stage">
          <p-toolbar aria-label="Demo-Steuerung (Standard der Bibliothek)">
            <ng-template #start>
              <div class="bar-group">
                <p-button label="Ausführen" icon="pi pi-play" size="small" (onClick)="log('Run')" />
                <p-button label="Schritt" icon="pi pi-step-forward" size="small" severity="secondary" [outlined]="true" (onClick)="log('Step')" />
                <p-button label="Zurücksetzen" icon="pi pi-refresh" size="small" severity="secondary" [outlined]="true" (onClick)="log('Reset')" />
              </div>
            </ng-template>
            <ng-template #end>
              <p-button icon="pi pi-cog" size="small" [text]="true" ariaLabel="Einstellungen" (onClick)="log('Settings')" />
            </ng-template>
          </p-toolbar>
        </div>
        <p class="src-note">
          Geh mit Tab hindurch: vier Buttons, vier Tab-Stopps, und die Pfeiltasten tun nichts. Der Host trägt
          <code>role="toolbar"</code> (<code>openng-optimus-ui-toolbar.mjs:170</code>), aber die Komponente bindet kein
          <code>keydown</code> und verwaltet keinen <code>tabindex</code> — ihr ganzes Template ist Projektion
          (<code>:123-138</code>).
        </p>

        <h3>Dieselbe Toolbar mit Pfeiltasten</h3>
        <div class="stage">
          <p-toolbar aria-label="Demo-Steuerung (Roving Focus)" (keydown)="onToolbarKeydown($event)">
            <ng-template #start>
              <div class="bar-group">
                @for (tool of tools; track tool.id; let i = $index) {
                  <button
                    pButton
                    type="button"
                    size="small"
                    data-roving
                    [severity]="i === 0 ? undefined : 'secondary'"
                    [outlined]="i !== 0"
                    [attr.tabindex]="activeTool() === i ? 0 : -1"
                    (focus)="activeTool.set(i)"
                    (click)="log(tool.label)"
                  >
                    <i [class]="tool.icon" pButtonIcon aria-hidden="true"></i>
                    <span pButtonLabel>{{ tool.label }}</span>
                  </button>
                }
              </div>
            </ng-template>
            <ng-template #end>
              <button
                pButton
                type="button"
                size="small"
                [text]="true"
                data-roving
                aria-label="Einstellungen"
                [attr.tabindex]="activeTool() === tools.length ? 0 : -1"
                (focus)="activeTool.set(tools.length)"
                (click)="log('Settings')"
              >
                <i class="pi pi-cog" pButtonIcon aria-hidden="true"></i>
              </button>
            </ng-template>
          </p-toolbar>
        </div>
        <p class="src-note">
          Ein Tab-Stopp; <kbd>←</kbd>/<kbd>→</kbd> wechseln zwischen den Buttons, <kbd>Home</kbd>/<kbd>End</kbd> springen
          an die Enden, und wer mit Tab zurückkommt, landet wieder auf dem Button, den er verlassen hat. Der Handler sitzt
          auf dem Host von <code>p-toolbar</code> und schiebt ein <code>tabindex="0"</code> durch native
          <code>pButton</code>-Buttons — das Rezept steht unter Entwicklung.
        </p>

        <h3>Eine Button Group</h3>
        <div class="stage">
          <p id="tb-zoom-label" class="stage__label">Zoom</p>
          <div role="group" aria-labelledby="tb-zoom-label">
            <p-buttonGroup>
              <p-button icon="pi pi-search-minus" ariaLabel="Verkleinern" severity="secondary" [outlined]="true" size="small" (onClick)="log('Zoom out')" />
              <p-button label="100 %" severity="secondary" [outlined]="true" size="small" (onClick)="log('Reset zoom')" />
              <p-button icon="pi pi-search-plus" ariaLabel="Vergrößern" severity="secondary" [outlined]="true" size="small" (onClick)="log('Zoom in')" />
            </p-buttonGroup>
          </div>
        </div>
        <pre class="code-block"><code>{{ groupAnatomySnippet }}</code></pre>
        <p class="src-note">
          Die Komponente hat überhaupt kein Input (<code>openng-optimus-ui-buttongroup.mjs:69</code>); ihr Template ist ein
          einziges <code>&lt;span role="group"&gt;</code> um die projizierten Buttons (<code>:70</code>). Der Name oben
          kommt vom umgebenden <code>div role="group"</code> mit <code>aria-labelledby</code>, und den schreibst du selbst.
        </p>

        <h3>Ein Split Button</h3>
        <div class="stage">
          <p-splitbutton
            #saveSplit
            label="Speichern"
            icon="pi pi-save"
            expandAriaLabel="Weitere Speicheroptionen"
            [model]="saveItems"
            (onClick)="log('Save')"
            (onMenuHide)="onSaveMenuHide()"
          />
          <p class="stage__status" aria-live="polite">Letzte Aktion: {{ lastAction() }}</p>
        </div>
        <p class="src-note">
          Öffne das Menü mit <kbd>↓</kbd> auf dem Chevron, wähle einen Eintrag oder drück <kbd>Esc</kbd>: Der Fokus kehrt
          zum Chevron zurück. Diese Rückkehr ergänzt der <code>onMenuHide</code>-Handler dieser Seite — die
          Wiederherstellung der Bibliothek zielt auf das nicht fokussierbare Host-Element (siehe Entwicklung).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welche Komponente</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Du hast</th><th>Nimm</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr><td>Drei oder mehr Bedienelemente, die auf einen Bereich wirken (eine Demo-Bühne, einen Editor)</td><td><code>p-toolbar</code> + deine Pfeiltasten</td><td>{{ m.whenToolbar }}</td></tr>
              <tr><td>Zwei oder drei verwandte Aktionen, die als ein Block wirken sollen</td><td><code>p-buttonGroup</code> in deiner eigenen benannten Gruppe</td><td>{{ m.whenGroup }}</td></tr>
              <tr><td>Eine Standardaktion und ein paar Varianten davon</td><td><code>p-splitbutton</code></td><td>{{ m.whenSplit }}</td></tr>
              <tr><td>Mehrere Aktionen, von denen keine der offensichtliche Standard ist</td><td><code>p-button</code> + <code>p-menu [popup]</code></td><td>{{ m.whenMenuButton }}</td></tr>
              <tr><td>Eine Wahl aus wenigen, die ausgewählt bleibt</td><td><code>p-selectbutton</code></td><td>{{ m.whenSelect }}</td></tr>
              <tr><td>Eine Kopfzeile mit Titel und Button</td><td>ein Flex-<code>div</code></td><td>{{ m.whenPlainRow }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Schwelle für die Toolbar („drei oder mehr Bedienelemente“) und die Tastaturverträge stammen aus den
          WAI-ARIA-APG-Patterns Toolbar und Menu Button, verlinkt unter Quellen.
        </p>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Split Button ohne expandAriaLabel</span>
            <div class="dd__stage">
              <p-splitbutton label="Exportieren" [model]="exportItems" (onClick)="log('Export')" />
            </div>
            <p class="dd__why">{{ m.ddUnnamedWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — benenne den Chevron</span>
            <div class="dd__stage">
              <p-splitbutton label="Exportieren" expandAriaLabel="Weitere Exportformate" [model]="exportItems" (onClick)="log('Export')" />
            </div>
            <p class="dd__why">{{ m.ddNamedWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Der Name des Chevrons ist <code>menuButtonProps?.ariaLabel || expandAriaLabel</code>, ohne Standardwert
          (<code>openng-optimus-ui-splitbutton.mjs:399</code>); sein einziger Inhalt ist ein SVG-Icon (<code>:406-414</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — darauf zählen, dass die Gruppe sich selbst benennt</span>
            <div class="dd__stage">
              <p class="stage__label">Textgröße</p>
              <p-buttonGroup>
                <p-button label="Kleiner" severity="secondary" [outlined]="true" size="small" (onClick)="log('Smaller text')" />
                <p-button label="Größer" severity="secondary" [outlined]="true" size="small" (onClick)="log('Larger text')" />
              </p-buttonGroup>
            </div>
            <p class="dd__why">{{ m.ddGroupBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — pack sie in eine Gruppe, die du benennen kannst</span>
            <div class="dd__stage">
              <p id="tb-size-label" class="stage__label">Textgröße</p>
              <div role="group" aria-labelledby="tb-size-label">
                <p-buttonGroup>
                  <p-button label="Kleiner" severity="secondary" [outlined]="true" size="small" (onClick)="log('Smaller text')" />
                  <p-button label="Größer" severity="secondary" [outlined]="true" size="small" (onClick)="log('Larger text')" />
                </p-buttonGroup>
              </div>
            </div>
            <p class="dd__why">{{ m.ddGroupGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Das innere <code>span role="group"</code> erzeugt das Template der Komponente
          (<code>openng-optimus-ui-buttongroup.mjs:70</code>), und es erhält kein Attribut vom Host.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA APG, Toolbar pattern</a>
            — der Vertrag aus einem Tab-Stopp und Pfeiltasten, den <code>role="toolbar"</code> ankündigt, und die Schwelle von drei Bedienelementen.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA APG, Menu Button pattern</a>
            — wohin der Fokus beim Öffnen geht (erster oder letzter Eintrag) und beim Schließen (zurück zum Button).
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#group" target="_blank" rel="noopener noreferrer">W3C — WAI-ARIA 1.2, role group</a>
            — warum eine unbenannte Gruppe eine Struktur ist und keine Ansage.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html" target="_blank" rel="noopener noreferrer">W3C — WCAG 2.2 SC 2.4.3 Focus Order</a>
            — was ein Menü schuldet, das beim Schließen den Fokus fallen lässt.
          </li>
          <li>
            <code>&#64;openng/optimus-ui</code> 2.0.2 — <code>fesm2022/openng-optimus-ui-toolbar.mjs</code>,
            <code>openng-optimus-ui-buttongroup.mjs</code>, <code>openng-optimus-ui-splitbutton.mjs</code> und
            <code>openng-optimus-ui-tieredmenu.mjs</code>: jede
            Aussage zum Verhalten auf dieser Seite, mit Zeilenangabe.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Tokens</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura-Wert</th><th>Was er einfärbt</th></tr>
            </thead>
            <tbody>
              <tr><td><code>toolbar.background</code></td><td><code>&#123;content.background&#125;</code></td><td>{{ m.tokToolbarBg }}</td></tr>
              <tr><td><code>toolbar.border.color</code></td><td><code>&#123;content.border.color&#125;</code></td><td>{{ m.tokToolbarBorder }}</td></tr>
              <tr><td><code>toolbar.padding</code> / <code>gap</code></td><td><code>0.75rem</code> / <code>0.5rem</code></td><td>{{ m.tokToolbarSpace }}</td></tr>
              <tr><td><code>splitbutton.border.radius</code></td><td><code>&#123;form.field.border.radius&#125;</code></td><td>{{ m.tokSplitRadius }}</td></tr>
              <tr><td><code>splitbutton.rounded.border.radius</code></td><td><code>2rem</code></td><td>{{ m.tokSplitRounded }}</td></tr>
              <tr><td>Button Group</td><td>keiner</td><td>{{ m.tokGroup }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/toolbar/index.mjs</code> und
          <code>…/aura/splitbutton/index.mjs</code>; die Button Group bringt keine Preset-Datei mit, nur Regeln in
          <code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code>.
        </p>

        <h3>Die Fuge, je visuellem Stil</h3>
        <p>{{ m.seamIntro }}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Visueller Stil</th><th>Fuge, gefüllter Split Button (hell / dunkel)</th><th>Fuge, Outlined-Gruppe</th><th>Äußere Ecken und Schatten</th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>3px / 2px</td><td>2px</td><td>{{ m.seamWerkbund }}</td></tr>
              <tr><td>lernwerkstatt</td><td>2px / 2px</td><td>2px</td><td>{{ m.seamLern }}</td></tr>
              <tr><td>skizzenbuch</td><td>1px / 2px</td><td>2px</td><td>{{ m.seamSkizze }}</td></tr>
              <tr><td>blaupause</td><td>1px / 2px</td><td>2px</td><td>{{ m.seamBlau }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Fuge ist die <code>border-inline-start</code> des zweiten Segments; die
          <code>border-inline-end-width</code> des ersten Segments ist 0. Die Breiten sind die Button-Rahmen: der
          Button-Block des ThemeService in <code>src/app/services/theme.service.ts</code> (<code>border: var(--button-border, none)
          !important</code> bei gefüllten, <code>border: 2px solid … !important</code> bei Outlined-Buttons) und, in
          lernwerkstatt, skizzenbuch und werkbund, die Regeln <code>.p-button:not(.p-button-text):not(.p-button-link)</code> in den
          <code>html.style-*</code>-Blöcken von <code>src/styles.scss</code>. Diese <code>!important</code>-Rahmen
          schlagen die Fugen der Bibliothek (<code>border-inline-end: 0 none</code> in
          <code>&#64;openng/optimus-ui-styles/dist/buttongroup/index.mjs</code> und <code>…/splitbutton/index.mjs</code>,
          <code>border-right: 0 none</code> für <code>p-button</code>-Kinder,
          <code>openng-optimus-ui-buttongroup.mjs:16-19</code>), darum setzt die Kit-Regel „eine Fuge“ in
          <code>src/styles.scss</code> die Fuge mit <code>!important</code> und einem Selektor mit ID-Gewicht
          (<code>:not(#kit-join)</code>) erneut. Die inneren Radien sind in jedem Stil auf null gesetzt.
        </p>

        <h3>Fokus und Kontrast</h3>
        <p>{{ m.focusContrast }}</p>
        <p class="src-note">
          Verhältnisse aus <code>docs/generated/CONTRAST.MD</code>, Block werkbund: <code>--control-border</code> auf
          <code>--surface-card</code> liegt bei 5,23:1 hell und 4,91:1 dunkel (SC 1.4.11 verlangt 3:1); die Label-Paare der
          gefüllten Buttons erreichen dort alle 4,5:1. Der Ring: Zeile <code>focus ring</code>, 3,88–17,85:1 auf den
          Seitenflächen und dem Dialog-Panel. Die eigene Kante der Toolbar aus <code>&#123;content.border.color&#125;</code>
          hat keine Zeile im Kompilat. Das fokussierte Segment wird in beiden Stylesheets der Bibliothek durch
          <code>z-index: 1</code> angehoben (<code>.p-buttongroup .p-button:focus</code>, <code>.p-splitbutton-button.p-button:focus-visible</code>).
        </p>

        <h3>Schmaler Viewport</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>.p-toolbar</code> ist <code>display: flex; flex-wrap: wrap; justify-content: space-between</code>, und
          <code>.p-toolbar-start/-center/-end</code> sind <code>display: flex</code> ohne Umbruch
          (<code>&#64;openng/optimus-ui-styles/dist/toolbar/index.mjs</code>); <code>.p-buttongroup</code> und
          <code>.p-splitbutton</code> sind <code>inline-flex</code>. Keines der drei Stylesheets enthält eine Media Query.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Komponente</th><th>Input</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-toolbar</code></td><td><code>ariaLabelledBy</code></td><td>{{ m.apiToolbarLabelledBy }}</td></tr>
              <tr><td><code>p-toolbar</code></td><td>Templates <code>#start</code>, <code>#center</code>, <code>#end</code></td><td>{{ m.apiToolbarSlots }}</td></tr>
              <tr><td><code>p-buttonGroup</code></td><td>—</td><td>{{ m.apiGroup }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>label</code>, <code>icon</code>, <code>iconPos</code>, <code>severity</code>, <code>outlined</code>, <code>text</code>, <code>size</code>, <code>raised</code>, <code>rounded</code></td><td>{{ m.apiSplitLook }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>model</code></td><td>{{ m.apiSplitModel }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>expandAriaLabel</code>, <code>buttonProps</code>, <code>menuButtonProps</code></td><td>{{ m.apiSplitAria }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>disabled</code>, <code>buttonDisabled</code>, <code>menuButtonDisabled</code></td><td>{{ m.apiSplitDisabled }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>appendTo</code>, <code>menuStyle</code>, <code>menuStyleClass</code>, <code>tooltip</code>, <code>autofocus</code>, <code>tabindex</code></td><td>{{ m.apiSplitMisc }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td><code>dir</code>, <code>plain</code></td><td>{{ m.apiSplitDead }}</td></tr>
              <tr><td><code>p-splitbutton</code></td><td>Outputs <code>onClick</code>, <code>onDropdownClick</code>, <code>onMenuShow</code>, <code>onMenuHide</code></td><td>{{ m.apiSplitOutputs }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-toolbar.mjs:122</code>, <code>openng-optimus-ui-buttongroup.mjs:69</code>,
          <code>openng-optimus-ui-splitbutton.mjs:86-271</code> und dessen kompilierte Input-Liste bei <code>:335</code>.
        </p>

        <h3>Tastatur: was das Pattern verlangt und was ausgeliefert wird</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Taste</th><th>APG erwartet</th><th>Optimus 2.0.2 tut</th></tr>
            </thead>
            <tbody>
              <tr><td>Mit Tab in eine Toolbar</td><td>{{ m.kbTabApg }}</td><td>{{ m.kbTabShip }}</td></tr>
              <tr><td><kbd>←</kbd> <kbd>→</kbd> in einer Toolbar</td><td>{{ m.kbArrowApg }}</td><td>{{ m.kbArrowShip }}</td></tr>
              <tr><td><kbd>↓</kbd> auf dem Chevron</td><td>{{ m.kbDownApg }}</td><td>{{ m.kbDownShip }}</td></tr>
              <tr><td><kbd>↑</kbd> auf dem Chevron</td><td>{{ m.kbUpApg }}</td><td>{{ m.kbUpShip }}</td></tr>
              <tr><td><kbd>Enter</kbd> / <kbd>Space</kbd> auf dem Chevron</td><td>{{ m.kbEnterApg }}</td><td>{{ m.kbEnterShip }}</td></tr>
              <tr><td><kbd>Esc</kbd> im Menü</td><td>{{ m.kbEscApg }}</td><td>{{ m.kbEscShip }}</td></tr>
              <tr><td>Einen Eintrag auslösen</td><td>{{ m.kbItemApg }}</td><td>{{ m.kbItemShip }}</td></tr>
              <tr><td><kbd>Tab</kbd> im Menü</td><td>{{ m.kbMenuTabApg }}</td><td>{{ m.kbMenuTabShip }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Tasten des Split Buttons: <code>openng-optimus-ui-splitbutton.mjs:316-325</code>. Seite des Menüs:
          <code>openng-optimus-ui-tieredmenu.mjs</code> — <code>show()</code> setzt den fokussierten Index zurück (<code>:1312</code>),
          die Liste erhält den Fokus nach der Einblend-Animation (<code>:1236</code>), <code>hide(event, true)</code> fokussiert
          <code>relatedTarget || target</code> (<code>:1288</code>), Esc (<code>:1164-1168</code>), Tab
          (<code>:1169-1176</code>), Auslösen eines Blatteintrags (<code>:1037-1041</code>). Der Split Button übergibt sein
          Host-Element als <code>currentTarget</code> (<code>openng-optimus-ui-splitbutton.mjs:318</code>), und ein
          <code>p-splitbutton</code>-Element hat keinen <code>tabindex</code>.
        </p>

        <h3>Rezept: Roving Focus auf p-toolbar</h3>
        <pre class="code-block"><code>{{ rovingSnippet }}</code></pre>
        <p class="src-note">
          Das Muster ist der wandernde <code>tabindex</code> aus dem APG-Toolbar-Pattern. Schreib ihn auf native
          <code>pButton</code>-Buttons: Eine <code>p-button</code>-Komponente rendert ihren eigenen inneren
          <code>&lt;button&gt;</code>, den ein <code>tabindex</code> auf dem Host nicht erreicht.
        </p>

        <h3>Rezept: den Fokus nach dem Menü des Split Buttons zurückgeben</h3>
        <pre class="code-block"><code>{{ restoreSnippet }}</code></pre>
        <p class="src-note">
          <code>onMenuHide</code> feuert aus dem <code>hide()</code> des Menüs bei jedem Schließen — Esc, Tab, Eintrag, Klick
          außerhalb (<code>openng-optimus-ui-splitbutton.mjs:326-329</code>). Die Prüfung, ob der Fokus noch im Overlay
          liegt (<code>.p-tieredmenu-overlay</code>, <code>openng-optimus-ui-tieredmenu.mjs:32</code>), stellt ihn beim
          Schließen per Tastatur wieder her und lässt einen Klick außerhalb in Ruhe. Bei Tab läuft die Wiederherstellung
          noch im Keydown, sodass der Tab des Browsers danach vom Chevron aus weiterspringt.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkToolbarName }}</li>
          <li>{{ m.checkToolbarKeys }}</li>
          <li>{{ m.checkGroupName }}</li>
          <li>{{ m.checkSplitName }}</li>
          <li>{{ m.checkSplitFocus }}</li>
          <li>{{ m.checkSplitEscape }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Texte</h3>
        <p>{{ m.i18nStrings }}</p>
        <p class="src-note">
          Keines der drei Templates enthält einen Textknoten (<code>openng-optimus-ui-toolbar.mjs:123-138</code>,
          <code>openng-optimus-ui-buttongroup.mjs:70-72</code>, <code>openng-optimus-ui-splitbutton.mjs:336-429</code>),
          und keines liest die Übersetzungskonfiguration von Optimus.
        </p>

        <h3>Von rechts nach links</h3>
        <p>{{ m.i18nRtl }}</p>
        <p class="src-note">
          Logische Radien und <code>border-inline-end</code> in <code>&#64;openng/optimus-ui-styles/dist/splitbutton/index.mjs</code>
          und <code>…/buttongroup/index.mjs</code>; das physische <code>border-right</code> für <code>p-button</code>-Kinder
          in <code>openng-optimus-ui-buttongroup.mjs:16-19</code>. Das Input <code>dir</code> des Split Buttons ist
          deklariert (<code>openng-optimus-ui-splitbutton.mjs:179</code>) und wird nirgends gelesen.
        </p>

        <h3>Ein übersetztes Model</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>1.1</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die doppelte Fuge behebt die Kit-Regel „eine Fuge“ (Design-Tabelle und RTL-Hinweis neu geschrieben), die Segmente tragen den Fokus-Ring des Kits.</li>
          <li><strong>1.0</strong> — 23.09.2026 — Erste Fassung: Toolbar, Button Group und Split Button, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ToolbarArticleDeComponent extends ToolbarArticleComponent {
  override readonly lastAction = signal('keine');

  override readonly tools = [
    { id: 'run', label: 'Ausführen', icon: 'pi pi-play' },
    { id: 'step', label: 'Schritt', icon: 'pi pi-step-forward' },
    { id: 'reset', label: 'Zurücksetzen', icon: 'pi pi-refresh' },
  ];

  override readonly saveItems: MenuItem[] = [
    { label: 'Als Entwurf speichern', escape: true, command: () => this.log('Save as draft') },
    { label: 'Kopie speichern', escape: true, command: () => this.log('Save a copy') },
  ];

  override readonly exportItems: MenuItem[] = [
    { label: 'Als CSV exportieren', escape: true, command: () => this.log('Export as CSV') },
    { label: 'Als JSON exportieren', escape: true, command: () => this.log('Export as JSON') },
  ];

  /** The template passes the English action names; the readout shows them in German. */
  override log(action: string): void {
    super.log(LOG_DE[action] ?? action);
  }

  /** The rulings and readings of the English article, in German. */
  override readonly m = {
    // usage — which one
    whenToolbar:
      'role="toolbar" sagt einem Screenreader, dass er einen einzigen Tab-Stopp und Pfeiltasten zwischen den Bedienelementen erwarten soll. Das lohnt sich ab drei Bedienelementen, und erst, wenn du die Tasten ergänzt, die die Komponente weglässt.',
    whenGroup:
      'Die Gruppe verbindet Rahmen und Radien; die Semantik, die du brauchst — einen Namen für die Gruppe —, kommt aus einem Wrapper, den du selbst schreibst, denn die Komponente nimmt kein Input an.',
    whenSplit:
      'Die linke Hälfte führt die Aktion aus, die die meisten wollen; der Chevron hält ihre Varianten („Speichern“ neben „Als Entwurf speichern“). Ist keine Aktion der offensichtliche Standard, wird die linke Hälfte zum Ratespiel.',
    whenMenuButton:
      'Ein benannter Button mit aria-haspopup öffnet die Liste, und jede Aktion ist vom selben Ausgangspunkt einen Tastendruck entfernt. Den Popup-Vertrag beschreibt der Guide „Menu, TieredMenu und ContextMenu“.',
    whenSelect:
      'Eine Button Group hat keinen ausgewählten Zustand; verbundene Buttons, die wie ein Segmented Control aussehen, sich die Wahl aber nicht merken, führen Augen und Screenreader gleichermaßen in die Irre.',
    whenPlainRow:
      'role="toolbar" auf einer Zeile mit einer Überschrift, einem Text und einem Button kündigt ein Widget an, das es nicht gibt. Reines Layout braucht keine Rolle.',

    // usage — do/don't
    ddUnnamedWhy:
      'Der Chevron ist ein Button nur mit Icon und ohne Standardnamen, also sagt ein Screenreader neben „Exportieren“ nur „Schalter, reduziert, hat Popup“ an — ein Bedienelement ohne Zweck. Axe meldet das als button-name.',
    ddNamedWhy:
      'expandAriaLabel benennt den Chevron nach dem, was er öffnet. aria-expanded und aria-haspopup tragen weiterhin den Zustand; der Name muss nur sagen, welche Optionen dahinter warten.',
    ddGroupBadWhy:
      'Die Komponente rendert span role="group" ohne Namen und ohne Weg, einen zu übergeben, und das sichtbare „Textgröße“ ist nur ein Absatz. Unbenannte Gruppen werden meist nicht angesagt, also kommen die beiden Buttons als „Kleiner“ und „Größer“ an, ohne gemeinsamen Kontext.',
    ddGroupGoodWhy:
      'Ein div role="group" mit aria-labelledby, das auf die sichtbare Überschrift zeigt, gibt dem Paar einen Namen, den Screenreader beim Betreten ansagen. Die innere unbenannte Gruppe bleibt, harmlos.',

    // design
    tokToolbarBg: 'Der Hintergrund der Leiste: die Aura-Inhaltsfläche, dieselbe wie bei einer Card.',
    tokToolbarBorder: 'Ein dekorativer Rahmen von einem Pixel; er kennzeichnet kein Bedienelement und schuldet daher kein Kontrastverhältnis.',
    tokToolbarSpace: 'Innenabstand der Leiste und Abstand zwischen ihren Gruppen start, center und end — nicht zwischen deinen Buttons, die in deinem eigenen Container sitzen.',
    tokSplitRadius: 'Die äußeren Ecken des Paars; die inneren Ecken setzt das Stylesheet auf null.',
    tokSplitRounded: 'Die äußeren Ecken bei rounded="true".',
    tokGroup: 'Kein Preset: Die Gruppe entfernt nur innere Rahmen und Radien der Buttons, die sie enthält.',
    seamIntro:
      'Sowohl die Gruppe als auch der Split Button verbinden ihre Buttons, indem sie den Rahmen an der inneren Kante wegnehmen. Das Kit malt jeden Rahmen eines Buttons, der kein Text-Button ist, mit !important, was allein schon dieses Wegnehmen überstimmen und die Fuge doppelt zeichnen würde; eine Kit-Regel in styles.scss setzt das Wegnehmen erneut, sodass jeder visuelle Stil und jeder Modus eine einzige Fuge zeigt, so dick wie die äußere Kante. Die inneren Ecken werden eckig.',
    seamWerkbund: 'Eckige äußere Ecken, kein Schatten: Die Segmente wirken wie zwei aneinandergepresste Blöcke.',
    seamLern: 'Pillenförmige äußere Ecken (999px); jedes Segment wirft seinen eigenen versetzten 2px-Schatten, auch auf seinen Nachbarn.',
    seamSkizze: 'Der handgezeichnete äußere Radius; ein weicher Schatten je Segment.',
    seamBlau: '2px äußerer Radius, kein Schatten — die flachste Fuge.',
    focusContrast:
      'Weder die Toolbar noch die Gruppe zeichnet einen eigenen Fokus-Indikator — jeder Button behält den Fokus-Ring des Kits (2px, der Akzent-Vordergrund, 2px Abstand), und das fokussierte Segment einer Gruppe oder eines Split Buttons wird über seinen Nachbarn gehoben, damit der Ring nicht verdeckt wird. Segmentkanten sind Button-Rahmen, also gilt der Kontrast aus dem Guide „Button“ unverändert; der Rahmen der Toolbar ist Dekoration.',
    narrow:
      'Die Toolbar bricht um, ihre Gruppen nicht. .p-toolbar ist eine umbrechende Flex-Zeile, also rutscht die end-Gruppe unter die start-Gruppe, sobald die Breite ihres Inhalts unterschritten wird; jede Gruppe ist eine nicht umbrechende Flex-Zeile und läuft über ihren Container hinaus, wenn sie allein zu breit ist. Eine Button Group und ein Split Button sind inline-flex und brechen nie um. Setz deine Buttons in einen umbrechenden Flex-Container innerhalb von #start (wie die Beispiele), beschränk eine Gruppe auf zwei oder drei Segmente, und verschieb unter etwa 30rem Nebenaktionen in einen Menü-Button, statt die Leiste seitlich scrollen zu lassen.',

    // development — inputs
    apiToolbarLabelledBy:
      'Das einzige Input zur Benennung. Ein einfaches aria-label-Attribut auf dem Host funktioniert ebenso, denn das Host-Element ist dasjenige mit der Rolle.',
    apiToolbarSlots:
      'Template-Refs oder pTemplate „start“/„left“, „end“/„right“, „center“. Einfach projizierter Inhalt wird zuerst gerendert, vor den drei Slots.',
    apiGroup: 'Kein Input und kein Output. Selektoren p-buttonGroup, p-buttongroup, p-button-group.',
    apiSplitLook: 'Werden an beide Buttons weitergegeben (label und icon nur an den Haupt-Button). raised und rounded fügen nur Root-Klassen hinzu.',
    apiSplitModel: 'MenuItem[] für das Popup-TieredMenu. Setz escape: true bei jedem Eintrag — das TieredMenu rendert ein nicht gesetztes escape als HTML.',
    apiSplitAria:
      'expandAriaLabel benennt den Chevron; menuButtonProps kann dessen aria-label, aria-haspopup, aria-expanded und aria-controls überschreiben. buttonProps.ariaLabel benennt den Haupt-Button.',
    apiSplitDisabled:
      'disabled setzt beide Hälften. buttonDisabled allein wird ignoriert, sobald ein Content-Template verwendet wird, denn dieser Zweig bindet stattdessen disabled.',
    apiSplitMisc: 'appendTo ist standardmäßig „body“; der Rest geht direkt an den Haupt-Button oder das Menü durch.',
    apiSplitDead: 'Deklariert und nirgends gelesen — dir spiegelt nichts, plain gestaltet nichts.',
    apiSplitOutputs:
      'onClick nur für den Haupt-Button; onDropdownClick erhält kein Event, wenn das Menü per Pfeiltaste geöffnet wurde.',

    // development — keyboard
    kbTabApg: 'Ein einziger Tab-Stopp für die ganze Toolbar, der auf dem zuletzt fokussierten Bedienelement landet.',
    kbTabShip: 'Jedes Bedienelement ist ein eigener Tab-Stopp.',
    kbArrowApg: 'Fokus zum vorigen oder nächsten Bedienelement bewegen, wahlweise mit Umlauf; Pos1 und Ende springen an die Enden.',
    kbArrowShip: 'Nichts. Ergänz sie selbst (Rezept unten).',
    kbDownApg: 'Das Menü öffnen und den ersten Eintrag fokussieren.',
    kbDownShip: 'Schaltet das Menü um; der Fokus landet auf der Liste ohne aktiven Eintrag, ein zweiter Druck auf Pfeil nach unten erreicht den ersten Eintrag.',
    kbUpApg: 'Das Menü öffnen und den letzten Eintrag fokussieren (im Pattern optional).',
    kbUpShip: 'Wie Pfeil nach unten: öffnet, kein Eintrag aktiv.',
    kbEnterApg: 'Das Menü öffnen und den ersten Eintrag fokussieren.',
    kbEnterShip: 'Nativer Button-Klick: öffnet, Liste fokussiert, kein Eintrag aktiv.',
    kbEscApg: 'Das Menü schließen und den Fokus an den Button zurückgeben.',
    kbEscShip: 'Schließt, fokussiert dann den Host von p-splitbutton, der nicht fokussierbar ist — der Fokus geht verloren, sobald die Liste entfernt wird.',
    kbItemApg: 'Den Befehl ausführen, das Menü schließen, den Button fokussieren (außer der Befehl verschiebt den Fokus).',
    kbItemShip: 'Führt aus, schließt, fokussiert erneut die sich schließende Liste — der Fokus geht verloren.',
    kbMenuTabApg: 'Das Menü schließen; der Fokus geht weiter.',
    kbMenuTabShip: 'Schließt; die Liste liegt am Ende von body, also geht Tab von dort weiter, nicht vom Split Button.',

    checkToolbarName: 'Benenne jede p-toolbar (aria-label oder ariaLabelledBy); eine Seite mit zwei unbenannten Toolbars bietet zwei gleiche Quasi-Landmarks.',
    checkToolbarKeys: 'Ergänz entweder Roving Focus mit den Pfeiltasten, oder verwende p-toolbar nicht — eine Zeile mit zwei Buttons braucht keine Toolbar-Rolle.',
    checkGroupName: 'Pack eine Button Group, deren Buttons nur zusammen Sinn ergeben, in ein div role="group" mit aria-labelledby.',
    checkSplitName: 'Setz expandAriaLabel bei jedem Split Button, gebunden an einen i18n-Key.',
    checkSplitFocus: 'Behandle onMenuHide und gib den Fokus an den Chevron zurück, wenn er noch im Overlay liegt.',
    checkSplitEscape: 'Setz escape: true bei jedem Model-Eintrag, dessen Label du nicht selbst geschrieben hast.',

    // i18n
    i18nStrings:
      'Die Bibliothek steuert keinen Text bei. Alles Lesbare gehört dir: der Name der Toolbar, das Label des Split Buttons, expandAriaLabel (das überhaupt keinen Standardwert hat) und jedes MenuItem-Label. Übersetz sie wie jeden anderen Template-Text, und lass den Labels Platz zum Wachsen — Deutsch läuft länger, und ein Split Button richtet seine Größe nach seinem Label.',
    i18nRtl:
      'Der Split Button spiegelt korrekt: Seine Radien und der entfernte innere Rahmen sind logische Properties. Die Button Group spiegelt bei nativen pButton-Kindern (logische Regeln), aber nicht bei p-button-Komponenten: Die zusätzliche Regel, die p-button-Kinder verbindet, entfernt border-right, eine physische Seite, also würde sie unter dir="rtl" die äußere Kante statt der Fuge entfernen. In diesem Kit überstimmen die erzwungenen Button-Rahmen (Tab Design) beide Regeln der Bibliothek, und die eigene Fugen-Regel des Kits, die sie ersetzt, ist mit logischen Properties geschrieben, sodass die einzige Fuge in beiden Richtungen auf der inneren Kante landet. Das Roving-Rezept oben liest die berechnete Richtung und tauscht Pfeil nach links und Pfeil nach rechts, was das APG-Pattern in einer Toolbar von rechts nach links erwartet.',
  };
}
