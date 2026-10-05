import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputLabelsArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './input-labels-article.component';

/**
 * German twin of the Input Labels guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the prose in `m` and the prefilled
 * demo value are German. Keep it in step with the English file: same tabs, same
 * element and binding skeleton (`node scripts/check-guide-translations.mjs input-labels`).
 */
@Component({
  selector: 'app-input-labels-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'input-labels'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Wrapper, eine Aufgabe: das Label, das der Aufrufer schon geschrieben hat, irgendwo in den Kasten des Felds
          setzen. Keiner von beiden liefert ein Label, eine ID oder ein ARIA-Attribut mit — das ganze Template jedes Wrappers
          ist eine nackte Content-Projektion. Alles, was du unten siehst, ist CSS, das auf Klassen reagiert, die das
          Kind-Steuerelement sich selbst gibt.
        </p>

        <h3>Die beiden Hüllen nebeneinander</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">p-floatLabel (Standard-Variante „over“)</span>
            <p-floatLabel>
              <input
                pInputText
                id="il-float"
                name="il-float"
                [ngModel]="floatName()"
                (ngModelChange)="floatName.set($event)"
              />
              <label for="il-float">Anzeigename</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">p-iftaLabel</span>
            <p-iftaLabel>
              <input
                pInputText
                id="il-ifta"
                name="il-ifta"
                [ngModel]="iftaName()"
                (ngModelChange)="iftaName.set($event)"
              />
              <label for="il-ifta">Anzeigename</label>
            </p-iftaLabel>
          </div>
        </div>
        <p class="hint">{{ m.sideBySide }}</p>

        <h3>Die drei Float-Varianten</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">variant="over"</span>
            <p-floatLabel variant="over">
              <input pInputText id="il-v-over" name="il-v-over" [ngModel]="vName()" (ngModelChange)="vName.set($event)" />
              <label for="il-v-over">Stadt</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">variant="on"</span>
            <p-floatLabel variant="on">
              <input pInputText id="il-v-on" name="il-v-on" [ngModel]="vName()" (ngModelChange)="vName.set($event)" />
              <label for="il-v-on">Stadt</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">variant="in"</span>
            <p-floatLabel variant="in">
              <input pInputText id="il-v-in" name="il-v-in" [ngModel]="vName()" (ngModelChange)="vName.set($event)" />
              <label for="il-v-in">Stadt</label>
            </p-floatLabel>
          </div>
        </div>
        <div class="demo-actions">
          <button pButton type="button" severity="secondary" [outlined]="true" (click)="resetVariants()">
            <span pButtonLabel>Demo zurücksetzen</span>
          </button>
        </div>
        <p class="src-note">
          Alle drei Felder teilen sich ein Signal, also bewegt Tippen in einem davon alle drei Labels zugleich. Die Klasse,
          die die Geometrie wählt, ist <code>p-floatlabel-over</code>/<code>-on</code>/<code>-in</code>, ausgegeben vom
          Input <code>variant</code> (<code>openng-optimus-ui-floatlabel.mjs:22-24</code>, Standard
          <code>'over'</code> bei <code>:72</code>).
        </p>

        <h3>Die Placeholder-Falle</h3>
        <p>{{ m.placeholderProse }}</p>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">kein Placeholder — das Label ruht im Feld</span>
            <p-floatLabel>
              <input pInputText id="il-ph-off" name="il-ph-off" [ngModel]="phName()" (ngModelChange)="phName.set($event)" />
              <label for="il-ph-off">Spitzname</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">placeholder="z. B. Ada" — das Label kommt nie zurück</span>
            <p-floatLabel>
              <input
                pInputText
                id="il-ph-on"
                name="il-ph-on"
                placeholder="z. B. Ada"
                [ngModel]="phName()"
                (ngModelChange)="phName.set($event)"
              />
              <label for="il-ph-on">Spitzname</label>
            </p-floatLabel>
          </div>
        </div>
        <p class="src-note">
          Das rechte Feld trifft ab seinem ersten Rendering auf
          <code>.p-floatlabel:has(input[placeholder]) label</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:37</code>): Schon das Attribut allein ist einer der
          Auslöser fürs Anheben, also ist das Label klein und angehoben, solange das Feld noch leer ist.
        </p>

        <h3>Was ein nacktes Input mit beiden Hüllen macht</h3>
        <div class="stage stage--row">
          <div class="col">
            <span class="cap">Kind mit pInputText</span>
            <p-floatLabel>
              <input pInputText id="il-classed" name="il-classed" [ngModel]="bareName()" (ngModelChange)="bareName.set($event)" />
              <label for="il-classed">Straße</label>
            </p-floatLabel>
          </div>
          <div class="col">
            <span class="cap">Kind ohne pInputText — kaputt</span>
            <p-floatLabel>
              <input
                class="il-bare"
                id="il-bare"
                name="il-bare"
                [ngModel]="bareName()"
                (ngModelChange)="bareName.set($event)"
              />
              <label for="il-bare">Straße</label>
            </p-floatLabel>
          </div>
        </div>
        <p class="src-note">
          Das rechte Input erhält nie <code>.p-filled</code> — diese Klasse kommt aus der eigenen Klassen-Map der Direktive
          (<code>openng-optimus-ui-inputtext.mjs:28</code>) —, also bleiben als Auslöser nur <code>:has(input:focus)</code>
          und Autofill (Floatlabel-Styles :30, :32): Das Label hebt sich, während du tippst, und fällt beim Blur zurück über den Wert. Beide Felder sind an dasselbe Signal gebunden.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Eine Hülle ist drei Dinge zugleich: ein Wrapper-Element, ein Label, das du schreibst, und ein Kind-Steuerelement,
          das die richtigen Klassen trägt. Lass eines davon weg, und das Ergebnis ist kein schlechteres Label — es ist gar
          kein Label oder ein Label, das quer über dem Wert klebt.
        </p>

        <h3>Das vollständige Feld</h3>
        <pre class="code-block"><code>{{ fieldSnippet }}</code></pre>
        <p class="src-note">
          Das Paar aus <code>for</code>/<code>id</code> ist das, was das Label bindet; das Verschachteln in der Hülle bindet
          nichts, weil das Template der Hülle ein nacktes <code>&lt;ng-content&gt;</code> ist
          (<code>openng-optimus-ui-floatlabel.mjs:74</code>, <code>openng-optimus-ui-iftalabel.mjs:64</code>).
        </p>

        <h3>Welche Kinder jede Hülle positionieren kann</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kind</th>
                <th>Bekommt einen Auslöser fürs Anheben</th>
                <th>Bekommt Platz fürs Label</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>input[pInputText]</code></td>
                <td><code>.p-filled</code>, <code>:focus</code>, Autofill</td>
                <td>ja — <code>.p-inputtext</code> steht auf beiden Padding-Listen</td>
              </tr>
              <tr>
                <td><code>textarea[pTextarea]</code></td>
                <td><code>.p-filled</code>, <code>:focus</code></td>
                <td>ja — dazu eine Ruheregel nur für Float, die das Label oben festhält</td>
              </tr>
              <tr>
                <td><code>p-select</code>, <code>p-multiselect</code>, <code>p-treeselect</code>, <code>p-cascadeselect</code></td>
                <td><code>.p-inputwrapper-filled</code> / <code>-focus</code></td>
                <td>ja — über ihr <code>…-label</code>-Element</td>
              </tr>
              <tr>
                <td><code>p-autocomplete</code> (multiple)</td>
                <td><code>.p-inputwrapper-filled</code> / <code>-focus</code></td>
                <td>ja — <code>.p-autocomplete-input-multiple</code></td>
              </tr>
              <tr>
                <td><code>p-datepicker</code>, <code>p-inputnumber</code>, <code>p-password</code></td>
                <td><code>.p-inputwrapper-filled</code> / <code>-focus</code></td>
                <td>ja — ihr gerendertes Feld ist ein <code>.p-inputtext</code></td>
              </tr>
              <tr>
                <td>ein einfaches <code>&lt;input&gt;</code></td>
                <td>nur <code>:focus</code> und ein <code>placeholder</code>-Attribut</td>
                <td>nein — es passt auf keine der beiden Padding-Listen</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Auslöser-Selektoren aus <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:30-38</code>; die
          Padding-Listen aus <code>:58-65</code> (nur unter <code>.p-floatlabel-in</code>) und
          <code>&#64;openng/optimus-ui-styles/dist/iftalabel/index.mjs:21-28</code> (ohne Bedingung). Die Klassen selbst
          kommen von den Steuerelementen: <code>openng-optimus-ui-inputtext.mjs:28</code> und
          <code>openng-optimus-ui-select.mjs:52</code> samt seinen sieben verwandten Wrapper-Bundles.
        </p>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Float-Label mit Placeholder</span>
            <div class="dd__stage">
              <p-floatLabel>
                <input
                  pInputText
                  id="il-dd-bad"
                  name="il-dd-bad"
                  placeholder="you@example.org"
                  [ngModel]="ddMail()"
                  (ngModelChange)="ddMail.set($event)"
                />
                <label for="il-dd-bad">E-Mail</label>
              </p-floatLabel>
            </div>
            <p class="dd__why">
              Schon das Attribut allein löst das Anheben aus, also startet das Label klein und angehoben und kehrt nie
              zurück — das Feld hat zwei konkurrierende Beschriftungen und keinen Ruhezustand.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — das Format als Hinweis unter dem Feld</span>
            <div class="dd__stage">
              <p-floatLabel>
                <input
                  pInputText
                  id="il-dd-good"
                  name="il-dd-good"
                  aria-describedby="il-dd-good-hint"
                  [ngModel]="ddMail()"
                  (ngModelChange)="ddMail.set($event)"
                />
                <label for="il-dd-good">E-Mail</label>
              </p-floatLabel>
              <span class="hint" id="il-dd-good-hint">Format: you&#64;example.org</span>
            </div>
            <p class="dd__why">
              Das Label behält seine Ruheposition und seine volle Größe, und das Format bleibt als Hinweis über
              aria-describedby erhalten, statt in dem Moment zu verschwinden, in dem jemand tippt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Ifta-Label über einem führenden Icon</span>
            <div class="dd__stage">
              <p-iftaLabel>
                <p-iconfield>
                  <p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>
                  <input pInputText id="il-dd-icon-bad" name="il-dd-icon-bad" [ngModel]="ddCity()" (ngModelChange)="ddCity.set($event)" />
                </p-iconfield>
                <label for="il-dd-icon-bad">Stadt</label>
              </p-iftaLabel>
            </div>
            <p class="dd__why">
              Das Ifta-Stylesheet hat keine Regel, die das Label an einem führenden Icon vorbeischiebt, also teilen sich
              beide denselben Startabstand und überlappen.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Float-Label, das für das Icon verschoben wird</span>
            <div class="dd__stage">
              <p-floatLabel>
                <p-iconfield>
                  <p-inputicon><i class="pi pi-search" aria-hidden="true"></i></p-inputicon>
                  <input pInputText id="il-dd-icon-good" name="il-dd-icon-good" [ngModel]="ddCity()" (ngModelChange)="ddCity.set($event)" />
                </p-iconfield>
                <label for="il-dd-icon-good">Stadt</label>
              </p-floatLabel>
            </div>
            <p class="dd__why">
              Das Float-Stylesheet hat eine Regel für führende Icons, die das Label am Icon vorbeischiebt, also bleiben
              beide lesbar.
            </p>
          </div>
        </div>
        <p class="src-note">
          Die Regel, die es nur auf einer Seite gibt:
          <code>.p-floatlabel:has(.p-inputicon:first-child) label</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:26</code>). Die einzige Icon-Regel des
          Ifta-Stylesheets passt stattdessen die vertikale Position des Icons an (<code>.../iftalabel/index.mjs:44</code>).
        </p>

        <h3>Quellen für diesen Tab</h3>
        <ul class="src-list">
          <li>
            <a href="https://html.spec.whatwg.org/multipage/forms.html#the-label-element" rel="noopener noreferrer"
              >HTML Living Standard — the <code>label</code> element</a
            >: legt fest, dass <code>for</code>/<code>id</code> ein Label bindet, weshalb das Verschachteln in einer Hülle,
            die nichts rendert, nichts bindet.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html" rel="noopener noreferrer"
              >WCAG 2.2 SC 3.3.2, Labels or Instructions</a
            >: das Kriterium, an dem ein Placeholder als Label scheitert, und der Grund, warum beide Hüllen trotzdem ein echtes Label brauchen.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events" rel="noopener noreferrer"
              >MDN — <code>pointer-events</code></a
            >: was beide Hüllen am Label-Element aufgeben, und warum Klicken zum Fokussieren nicht mehr funktioniert.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Jede Hülle besitzt eine Token-Gruppe, und die beiden Gruppen sind nicht symmetrisch: Das Float-Label hat eine
          Active-Farbe und drei Geometrien, das Ifta-Label hat eine Geometrie und überhaupt keinen Active-Zustand.
        </p>

        <h3>Token-Gruppen, wie Aura sie ausliefert</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>floatlabel</code></th>
                <th><code>iftalabel</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>color</code></td>
                <td><code>&#123;form.field.float.label.color&#125;</code></td>
                <td>derselbe Token</td>
              </tr>
              <tr>
                <td><code>focus.color</code></td>
                <td><code>&#123;form.field.float.label.focus.color&#125;</code></td>
                <td>derselbe Token</td>
              </tr>
              <tr>
                <td><code>active.color</code></td>
                <td><code>&#123;form.field.float.label.active.color&#125;</code></td>
                <td>— es gibt keine Active-Farbe</td>
              </tr>
              <tr>
                <td><code>invalid.color</code></td>
                <td><code>&#123;form.field.float.label.invalid.color&#125;</code></td>
                <td>derselbe Token</td>
              </tr>
              <tr>
                <td>Schriftgröße</td>
                <td><code>1rem</code> in Ruhe, <code>active.font.size</code> <code>0.75rem</code> angehoben</td>
                <td><code>font.size</code> <code>0.75rem</code>, immer</td>
              </tr>
              <tr>
                <td>Schriftstärke</td>
                <td><code>500</code> in Ruhe, <code>400</code> angehoben</td>
                <td><code>400</code>, immer</td>
              </tr>
              <tr>
                <td><code>transition.duration</code></td>
                <td><code>0.2s</code></td>
                <td><code>0.2s</code> — bei einem Label, das sich nie bewegt</td>
              </tr>
              <tr>
                <td>Padding oben im Input</td>
                <td><code>in.input.padding.top</code> <code>1.5rem</code> (nur Variante <code>in</code>)</td>
                <td><code>input.padding.top</code> <code>1.5rem</code>, immer</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und -Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/floatlabel/index.mjs</code> und
          <code>.../aura/iftalabel/index.mjs</code>. Die Ruhegröße des Float-Labels ist kein Token — sie wird geerbt, und
          nur der angehobene Zustand hat eine Größe.
        </p>

        <h3>Die drei Float-Geometrien</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Variante</th>
                <th>Angehobene Position</th>
                <th>Platz, den sie braucht</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>over</code> (Standard)</td>
                <td><code>top: -1.25rem</code>, über dem Rahmen des Felds</td>
                <td>1.25rem freier Raum über dem Feld</td>
              </tr>
              <tr>
                <td><code>on</code></td>
                <td><code>top: 0</code> mit <code>translateY(-50%)</code> — mittig auf dem Rahmen</td>
                <td>vertikal keinen; es malt einen Hintergrund-Chip über den Rahmen</td>
              </tr>
              <tr>
                <td><code>in</code></td>
                <td><code>top: &#123;form.field.padding.y&#125;</code>, im Feld</td>
                <td>keinen — das obere Padding des Felds selbst wächst auf 1.5rem</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Positionen aus <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:79</code> (<code>in</code>),
          <code>:91-95</code> (<code>on</code>) und <code>:39</code> (das gemeinsame Anheben von <code>over</code>); die
          Werte dahinter sind <code>over.active.top</code> <code>-1.25rem</code>,
          <code>on.active.background</code> <code>&#123;form.field.background&#125;</code> und
          <code>in.input.padding.top</code> <code>1.5rem</code> in
          <code>&#64;openng/optimus-ui-themes/dist/aura/floatlabel/index.mjs</code>.
        </p>

        <h3>Was ein Label umfärbt</h3>
        <p>{{ m.colorProse }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code>, Gruppe „float label“, misst das Float-Label auf der Feldfüllung in jedem
          Stil und Modus (SC 1.4.3, verlangt 4,5:1): Ruhe und Active (<code>--text-color-secondary</code>)
          4,79&#8211;7,78:1, Fokus (<code>--text-color</code>) 9,35&#8211;18,73:1, ungültig
          (<code>--semantic-red-fg</code>) 5,66&#8211;7,93:1. Ein auf die Seite angehobenes Label mit <code>variant="over"</code>
          ist dasselbe <code>--text-color-secondary</code>, 4,90&#8211;7,78:1 auf Grund und Card („body text“). Das
          Ifta-Label übernimmt dieselben drei Farben des Kits und wird in derselben Gruppe auf der Feldfüllung gemessen
          (<code>iftalabel.color</code> 4,79&#8211;7,78:1, <code>iftalabel.focus.color</code> 9,35&#8211;18,73:1,
          <code>iftalabel.invalid.color</code> 5,66&#8211;7,93:1); Auras dunkles <code>&#123;surface.400&#125;</code>
          lag unter blaupause bei 4,19:1.
        </p>

        <h3>Was das Kit um die Hüllen herum ändert</h3>
        <p>{{ m.kitProse }}</p>
        <p class="src-note">
          Die Token-Regeln <code>.p-floatlabel</code> und <code>.dark-theme .p-floatlabel</code>, die Regeln
          <code>html.style-&lt;name&gt; input.p-inputtext</code> je Stil, <code>input.p-inputtext.p-invalid</code> und der
          Token-Block <code>.dark-theme .p-inputtext</code> in <code>src/styles.scss</code>, gegenüber
          <code>.p-inputtext.p-invalid</code> in <code>&#64;openng/optimus-ui-styles/dist/inputtext/index.mjs</code> und
          <code>.p-floatlabel-on:has(…) label</code> bei <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:91-95</code>.
          Die Token-Regel <code>.p-iftalabel</code> und die dunklen Füllungsblöcke für <code>.p-textarea</code>, <code>.p-multiselect</code>,
          <code>.p-treeselect</code> und <code>.p-autocomplete</code> stehen daneben.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>{{ m.narrowProse }}</p>
        <p class="src-note">
          Beide Wurzeln sind <code>display: block; position: relative</code>, und beide Labels sind
          <code>position: absolute</code> ohne Regel für Breite, Umbruch oder Abschneiden
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:2-19</code>,
          <code>.../iftalabel/index.mjs:2-19</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Hier gibt es fast kein TypeScript. Ein Input an einer der beiden Komponenten, keine Outputs, kein Lifecycle außer
          dem erneuten Anwenden durchgereichter Attribute — das Verhalten, das ein Aufrufer debuggt, ist fast immer ein
          CSS-Selektor, der gegriffen hat oder nicht.
        </p>

        <h3>Der Vertrag der Komponenten</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>FloatLabel</code></th>
                <th><code>IftaLabel</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Selektoren</td>
                <td><code>p-floatlabel</code>, <code>p-floatLabel</code>, <code>p-float-label</code></td>
                <td><code>p-iftalabel</code>, <code>p-iftaLabel</code>, <code>p-ifta-label</code></td>
              </tr>
              <tr>
                <td>Template</td>
                <td colspan="2">
                  <code>&lt;ng-content&gt;&lt;/ng-content&gt;</code> — sonst nichts, in beiden
                </td>
              </tr>
              <tr>
                <td>Eigene Inputs</td>
                <td><code>variant</code>: <code>over</code> | <code>on</code> | <code>in</code>, Standard <code>over</code></td>
                <td>keine — das Bundle importiert <code>Input</code> nie</td>
              </tr>
              <tr>
                <td>Outputs</td>
                <td colspan="2">keine</td>
              </tr>
              <tr>
                <td>Geerbt</td>
                <td colspan="2"><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> aus <code>BaseComponent</code></td>
              </tr>
              <tr>
                <td>Root-Klasse</td>
                <td><code>p-floatlabel</code> + <code>-over</code>/<code>-on</code>/<code>-in</code></td>
                <td><code>p-iftalabel</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an <code>openng-optimus-ui-floatlabel.mjs:74</code> (Selektoren und Template),
          <code>:72</code> (der Standardwert von <code>variant</code>) und <code>:22-24</code> (die Klassen-Map), gegenüber
          <code>openng-optimus-ui-iftalabel.mjs:64</code>, <code>:3</code> (die Import-Liste, ohne
          <code>Input</code>) und <code>:21</code>.
        </p>

        <h3>Woran jeder Zustand hängt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Float-Label</th>
                <th>Ifta-Label</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fokussiert</td>
                <td><code>:has(input:focus)</code>, <code>:has(.p-inputwrapper-focus)</code> → Anheben + Fokusfarbe</td>
                <td>nur Fokusfarbe; keine Bewegung</td>
              </tr>
              <tr>
                <td>Gefüllt</td>
                <td><code>:has(input.p-filled)</code>, <code>:has(.p-inputwrapper-filled)</code> → Anheben + Active-Farbe</td>
                <td>keine Regel — das Label ist schon aus dem Weg</td>
              </tr>
              <tr>
                <td>Automatisch ausgefüllt</td>
                <td><code>:has(input:-webkit-autofill)</code> → Anheben</td>
                <td>keine Regel</td>
              </tr>
              <tr>
                <td>Hat einen Placeholder</td>
                <td><code>:has(input[placeholder])</code> → dauerhaftes Anheben</td>
                <td>keine Regel</td>
              </tr>
              <tr>
                <td>Ungültig, per Binding</td>
                <td colspan="2"><code>:has(.p-invalid) label</code> → Fehlerfarbe, in beiden</td>
              </tr>
              <tr>
                <td>Ungültig, per Angular-Zustand</td>
                <td colspan="2"><code>:has(.ng-invalid.ng-dirty) label</code> → Fehlerfarbe, in beiden</td>
              </tr>
              <tr>
                <td>Deaktiviert</td>
                <td colspan="2">keine Regel in einem der beiden Stylesheets — das Label behält seine Farbe</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Selektoren aus <code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:30-56</code> und
          <code>.../iftalabel/index.mjs:33-42</code>; das Paar <code>.ng-invalid.ng-dirty</code> hängt Optimus in den
          Komponenten-Bundles selbst an (<code>openng-optimus-ui-floatlabel.mjs:14-16</code>,
          <code>openng-optimus-ui-iftalabel.mjs:16-18</code>). Keines der beiden Stylesheets enthält den String
          <code>disabled</code>.
        </p>

        <h3>Ein Label debuggen, das sich nicht bewegt</h3>
        <p>{{ m.debugProse }}</p>
        <pre class="code-block"><code>{{ debugSnippet }}</code></pre>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>Ein echtes <code>&lt;label for&gt;</code> in der Hülle und eine passende <code>id</code> auf dem gerenderten Input.</li>
          <li>Für einen Combobox-Host, der kein <code>for</code> annimmt, stattdessen eine Beschriftung plus <code>ariaLabelledBy</code>.</li>
          <li>Kein <code>placeholder</code> an einem Feld mit Float-Label — das Format gehört in einen Hinweis über aria-describedby.</li>
          <li>Ein Kind mit den Klassen der Bibliothek, nie ein nacktes <code>&lt;input&gt;</code>.</li>
          <li>1.25rem freier Raum über jedem Feld mit <code>variant="over"</code>.</li>
          <li>Kein führendes <code>p-inputicon</code> unter einem Ifta-Label, und eine <code>p-inputgroup</code> um eine Hülle herum, nie in ihr.</li>
          <li><code>[invalid]</code> zusammen mit <code>aria-invalid</code> und <code>aria-describedby</code> gebunden.</li>
          <li>Das Label ist nicht klickbar — prüf, dass keine Anleitung irgendwo den Nutzer auffordert, es anzuklicken.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Diese Hüllen tragen genau einen übersetzten Text, und den hast du geschrieben: das Label. Nichts wird aus dem
          Config-Objekt von Optimus gelesen, und nichts braucht einen Hook für den Sprachwechsel. Was sich mit der Sprache
          ändert, ist, wie viel Platz der Text braucht — und ein Label im Feld hat davon weniger als jede andere
          Label-Position.
        </p>

        <h3>Woher jeder Text kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Text</th>
                <th>Quelle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Das Label</td>
                <td>Dein Template — ein Übersetzungs-Key, der dir gehört</td>
              </tr>
              <tr>
                <td>Alles andere</td>
                <td>Nichts: Keines der beiden Bundles liest <code>getTranslation</code> oder das Config-Objekt</td>
              </tr>
              <tr>
                <td>Leserichtung</td>
                <td>Erledigt — der horizontale Versatz ist eine logische Property</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Beide Labels sind mit <code>inset-inline-start</code> versetzt, nicht mit <code>left</code>
          (<code>&#64;openng/optimus-ui-styles/dist/floatlabel/index.mjs:16</code>,
          <code>.../iftalabel/index.mjs:16</code>), und die Verschiebung für führende Icons am Float-Label nutzt dieselbe
          Property (<code>:27</code>) — ein RTL-Dokument spiegelt also beide Hüllen ohne Zutun des Autors.
        </p>

        <h3>Das Längenbudget</h3>
        <p>{{ m.i18nBudgetProse }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>your-module.</code> oben ist ein Platzhalter: Einen solchen Key gibt es in diesem Kit nicht. Das
          Label ist absolut positioniert, ohne Regel für Umbruch oder Abschneiden in einem der beiden Stylesheets, also läuft
          eine lange Übersetzung über, statt abgeschnitten zu werden — deshalb ist das Budget eine Anweisung für die
          Übersetzung und keine CSS-Korrektur.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            v1.3 — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Ifta-Label übernimmt die Kit-Farben des
            Float-Labels und wird in „float label“ geprüft (Zeilen iftalabel); die dunklen Füllungen von Textarea,
            MultiSelect, TreeSelect und AutoComplete im Multiple-Modus sind <code>--surface-section</code>, der dunkle
            <code>on</code>-Chip ist dort also kein Fleck mehr.
          </li>
          <li>
            v1.2 — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Farben des Float-Labels sind jetzt
            Kit-Tokens, geprüft in „float label“ (Ruhe und Active <code>--text-color-secondary</code>, Fokus
            <code>--text-color</code>, ungültig <code>--semantic-red-fg</code>); der dunkle <code>on</code>-Chip passt zum
            Feld; die ungültige Kante wird mit dem Label rot. Das Ifta-Label bleibt beim Grau von Aura, sein dunkler Wert ist
            weiterhin nicht erfasst.
          </li>
          <li>
            v1.1 — 23.09.2026 — Erneut geprüft an Optimus UI 2.0.2 und den visuellen Stilen (ADR-0016): Das helle Label im
            Feld zitiert die Placeholder-Zeile „form field text“, mit der es einen Wert teilt; das dunkle Label, die
            Fokusfarbe und das angehobene Over-Label sind als nicht erfasst benannt; neuer Design-Abschnitt zu den
            Kit-Regeln um die Hüllen (die ungültige Kante und der dunkle <code>on</code>-Chip); Agent-Doku unter ihr
            Byte-Ziel gekürzt.
          </li>
          <li>v1.0 — 07.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class InputLabelsArticleDeComponent extends InputLabelsArticleComponent {
  /** The prefilled street of the bare-input demo, as a German address. */
  override readonly bareName = signal('Alan-Turing-Straße');

  /** The prose and measured values of the English article, in German. */
  override readonly m = {
    sideBySide:
      'Beide Felder enthalten ein echtes label-Element, das du geschrieben hast. Tipp ins linke, und sein Label hebt sich ' +
      'aus dem Feld; das rechte Label bewegt sich nie, weil seine Position eine einzige statische Regel ist. Klick auf ' +
      'eines der beiden Labels: Nichts passiert, weil beide Hüllen pointer-events: none darauf setzen.',
    placeholderProse:
      'Ein Placeholder ist unter einem Float-Label keine zweite Beschriftung — er hebt das Float dauerhaft auf. Schon ' +
      'das bloße Vorhandensein des Attributs ist einer der Auslöser fürs Anheben, also startet das Label klein und ' +
      'angehoben über einem leeren Feld und kehrt nie in seine Ruheposition zurück.',
    colorProse:
      'Vier Zustände, drei Farben. In Ruhe und gefüllt nutzt das Float-Label denselben Wert — Aura löst sowohl ' +
      'floatLabelColor als auch floatLabelActiveColor im hellen Modus zu {surface.500} und im dunklen zu {surface.400} ' +
      'auf, und dieses Kit setzt beide auf --text-color-secondary um —, also ändert das Anheben Größe und Position, nicht ' +
      'den Kontrast. Fokus dunkelt das Label zu --text-color ab (Auras floatLabelFocusColor ist hell {primary.600}, ' +
      'dunkel {primary.color}; der Ring sagt schon „fokussiert“), und ungültig nimmt --semantic-red-fg an, die Farbe ' +
      'der ungültigen Kante. Das Ifta-Label hat überhaupt keine eigene Active-Farbe: Es bleibt dauerhaft auf seinem ' +
      'Ruhewert, bei 0.75rem, und das Kit gibt ihm dieselben drei Farben — --text-color-secondary, ' +
      '--text-color bei Fokus, --semantic-red-fg bei ungültig.',
    kitProse:
      'Das Kit gestaltet das Float-Label und das Feld in beiden Hüllen um, und beide stimmen jetzt überein. Ungültig: ' +
      '[invalid] am Kind färbt das Label über :has(.p-invalid) um, und die Kit-Regel input.p-inputtext.p-invalid ' +
      '(!important) schlägt die Kanten-Regel des Stils, also wird die Kante mit ihm --semantic-red-fg; die Regeln für ' +
      'ng-invalid.ng-dirty greifen ebenfalls. Die Variante on: Ihr angehobener Chip verdeckt den oberen Rahmen, und im ' +
      'dunklen Modus malt das Kit ihn --surface-section, die Füllung, die jedes dunkle Kit-Feld hat — Input, Select, ' +
      'Textarea, MultiSelect, TreeSelect und das Feld von AutoComplete im Multiple-Modus —, also ist der Chip in jedem ' +
      'Stil unsichtbar („float label“, on.active.background auf dem Feld, 1,00:1). Nur ein eigener Feldhintergrund ' +
      'zeigt ihn noch als Fleck; setz den Chip dann passend um.',
    narrowProse:
      'Keine der beiden Hüllen fließt um, stapelt oder schneidet ab, bei keinem Viewport. Beide Wurzeln sind ' +
      'display: block, nehmen also die Breite ihres Containers an, und das Label ist absolut positioniert, ohne eigene ' +
      'Regel für width, max-width oder white-space — ein Label, das länger ist als das Feld, bricht also auf eine zweite, ' +
      'ebenfalls absolut positionierte Zeile um und verdeckt den Wert, bei 360px genau wie bei 1440px. Für das Layout: ' +
      'Plan das Label für das schmalste Feld, das die Seite ausliefert, oder setz das Label über das Feld und nimm keine Hülle.',
    debugProse:
      'Ein Label, das stehen bleibt, ist fast immer ein Selektor, der nicht gegriffen hat, und es gibt nur drei ' +
      'Kandidaten. Untersuch das gerenderte Input: Hat es weder die Klasse .p-filled noch .p-inputwrapper-filled, ist ' +
      'das Kind kein Steuerelement der Bibliothek, und nichts außer dem Fokus hebt das Label an. Hat es ein ' +
      'placeholder-Attribut, war das Label von Anfang an nie unten. Liegt der Feldtext unter dem Label, steht das Kind ' +
      'nicht auf der Padding-Liste, die Platz reserviert.',
    i18nBudgetProse:
      'Ein Label im Feld konkurriert mit dem Wert um denselben Kasten. Das Float-Label hat nur bei leerem Feld volle ' +
      'Größe und angehoben 0.75rem; das Ifta-Label hat immer 0.75rem und teilt seine Zeile mit nichts. Deutsche und ' +
      'finnische Labels sind üblicherweise 30–40 % länger als englische, und keine der beiden Hüllen kürzt, bricht ' +
      'sauber um oder schneidet ab — das Budget gehört also in die Übersetzungsanweisungen für den Key, nicht in eine ' +
      'CSS-Regel.',
  };
}
