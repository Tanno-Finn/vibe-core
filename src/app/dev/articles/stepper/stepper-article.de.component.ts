import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { StepperArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './stepper-article.component';

/**
 * German twin of the Stepper and Steps guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the visible strings in `m`, the
 * p-steps labels and the empty-draft fallback are German. Keep it in step with the
 * English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs stepper`).
 */
@Component({
  selector: 'app-stepper-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'stepper'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Familien, die sich das Aussehen teilen und sonst nichts. <code>p-stepper</code> hält den aktiven Wert und
          rendert die Inhalte; <code>p-steps</code> zeichnet eine Leiste für einen Prozess, der anderswo lebt, und hält
          überhaupt keinen Inhalt. Alles hier unten rendert die Bibliothek, nicht diese Seite.
        </p>

        <h3>p-stepper — die Leiste und die Inhalte</h3>
        <div class="stage">
          <p-stepper [value]="wizard()" (valueChange)="wizard.set($event ?? 1)">
            <p-step-list>
              <p-step [value]="1">{{ m.labelAccount }}</p-step>
              <p-step [value]="2">{{ m.labelAddress }}</p-step>
              <p-step [value]="3">{{ m.labelReview }}</p-step>
            </p-step-list>
            <p-step-panels>
              <p-step-panel [value]="1"><ng-template #content><p class="pane">{{ m.paneAccount }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="2"><ng-template #content><p class="pane">{{ m.paneAddress }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="3"><ng-template #content><p class="pane">{{ m.paneReview }}</p></ng-template></p-step-panel>
            </p-step-panels>
          </p-stepper>
        </div>
        <p class="src-note">
          Die Köpfe kommen aus <code>openng-optimus-ui-stepper.mjs:444-459</code>, die Panel-Inhalte aus dem
          <code>ng-template #content</code>, das jedes <code>p-step-panel</code> projiziert
          (<code>openng-optimus-ui-stepper.mjs:598</code>). Ein Panel ohne dieses Template rendert nichts.
        </p>

        <h3>p-steps — eine Leiste und sonst nichts</h3>
        <div class="stage">
          <p-steps [model]="barItems" [activeIndex]="wizard() - 1" [readonly]="false" (activeIndexChange)="wizard.set($event + 1)" />
        </div>
        <p class="src-note">
          Derselbe Seitenzustand, zweite Darstellung. <code>p-steps</code> erzeugt
          <code>&lt;nav&gt;&nbsp;&gt;&nbsp;&lt;ul&gt;&nbsp;&gt;&nbsp;&lt;li&gt;&nbsp;&gt;&nbsp;&lt;a role="link"&gt;</code>
          (<code>openng-optimus-ui-steps.mjs:248-316</code>) und nummeriert seine Einträge nach dem Schleifenindex
          (<code>:284</code>), nicht nach einem Wert, den du übergibst.
        </p>

        <h3>Ein linearer Stepper zum Selbststeuern</h3>
        <div class="stage">
          <p-stepper [value]="locked()" [linear]="true">
            <p-step-list>
              <p-step [value]="1">{{ m.labelOne }}</p-step>
              <p-step [value]="2">{{ m.labelTwo }}</p-step>
              <p-step [value]="3">{{ m.labelThree }}</p-step>
            </p-step-list>
            <p-step-panels>
              <p-step-panel [value]="1"><ng-template #content><p class="pane">{{ m.paneOne }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="2"><ng-template #content><p class="pane">{{ m.paneTwo }}</p></ng-template></p-step-panel>
              <p-step-panel [value]="3"><ng-template #content><p class="pane">{{ m.paneThree }}</p></ng-template></p-step-panel>
            </p-step-panels>
          </p-stepper>
          <div class="row">
            <p-button label="Zurück" size="small" severity="secondary" [disabled]="locked() === 1" (onClick)="locked.set(locked() - 1)" />
            <p-button label="Weiter" size="small" severity="secondary" [disabled]="locked() === 3" (onClick)="locked.set(locked() + 1)" />
          </div>
        </div>
        <p class="src-note">
          Klick oben auf einen Kopf: Mit <code>linear</code> trägt jeder Kopf außer dem aktuellen das native
          <code>disabled</code>-Attribut (<code>openng-optimus-ui-stepper.mjs:451</code>), auch die schon erledigten.
          Die beiden Buttons gehören dieser Seite, nicht der Komponente.
        </p>

        <h3>Was p-stepper erzeugt</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>
        <p class="src-note">
          Host-Bindings gelesen aus <code>openng-optimus-ui-stepper.mjs:747-748</code> (Stepper),
          <code>:268</code> (Step-Liste), <code>:509-512</code> (Step) und <code>:626-630</code> (Panel).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Eine Frage entscheidet die Familie: Muss die Komponente den Inhalt jeder Stufe halten? Wenn ja, ist es
          <code>p-stepper</code>; sind die Stufen Seiten, Routen oder Schritte auf dem Server, ist die Leiste Dekoration
          und <code>p-steps</code> reicht.
        </p>

        <h3>Welche Familie, und was sie kostet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Frage</th><th><code>p-stepper</code></th><th><code>p-steps</code></th></tr>
            </thead>
            <tbody>
              <tr><td>hält die Inhalte der Stufen</td><td>ja, in <code>p-step-panel</code></td><td>nein</td></tr>
              <tr><td>von Haus aus interaktiv</td><td>ja</td><td>nein — <code>readonly</code> ist standardmäßig <code>true</code></td></tr>
              <tr><td>Tastatur</td><td>ein Tab-Halt pro Kopf, keine Pfeiltasten</td><td>ein Tab-Halt, Pfeiltasten plus Pos1/Ende</td></tr>
              <tr><td>kennt Routen</td><td>nein</td><td>ja, über <code>item.routerLink</code></td></tr>
              <tr><td>die sichtbare Zahl ist</td><td>der <code>value</code>, den du setzt</td><td>der Schleifenindex plus eins</td></tr>
              <tr><td>hält ein Panel am Leben, wenn du es verlässt</td><td>nein — es wird zerstört</td><td>gar keine Panels</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zeilen gelesen aus <code>openng-optimus-ui-stepper.mjs</code> <code>:444-459</code>, <code>:455</code> und
          <code>:592</code> sowie aus <code>openng-optimus-ui-steps.mjs</code> <code>:96</code>, <code>:143-181</code>,
          <code>:225-231</code> und <code>:284</code>.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Panel die einzige Kopie der Eingabe halten lassen</span>
            <div class="dd__stage">
              <p-stepper [value]="ddBad()" (valueChange)="ddBad.set($event ?? 1)">
                <p-step-list>
                  <p-step [value]="1">{{ m.ddStepOne }}</p-step>
                  <p-step [value]="2">{{ m.ddStepTwo }}</p-step>
                </p-step-list>
                <p-step-panels>
                  <p-step-panel [value]="1">
                    <ng-template #content>
                      <label class="fld"><span>{{ m.ddFieldLabel }}</span><input type="text" class="fld__in" /></label>
                    </ng-template>
                  </p-step-panel>
                  <p-step-panel [value]="2"><ng-template #content><p class="pane">{{ m.ddBadHint }}</p></ng-template></p-step-panel>
                </p-step-panels>
              </p-stepper>
            </div>
            <p class="dd__why">{{ m.ddBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — das Feld an ein Signal im Parent binden</span>
            <div class="dd__stage">
              <p-stepper [value]="ddGood()" (valueChange)="ddGood.set($event ?? 1)">
                <p-step-list>
                  <p-step [value]="1">{{ m.ddStepOne }}</p-step>
                  <p-step [value]="2">{{ m.ddStepTwo }}</p-step>
                </p-step-list>
                <p-step-panels>
                  <p-step-panel [value]="1">
                    <ng-template #content>
                      <label class="fld">
                        <span>{{ m.ddFieldLabel }}</span>
                        <input type="text" class="fld__in" [value]="draft()" (input)="onDraft($event)" />
                      </label>
                    </ng-template>
                  </p-step-panel>
                  <p-step-panel [value]="2">
                    <ng-template #content><p class="pane">{{ m.ddGoodEcho }} {{ draftShown() }}</p></ng-template>
                  </p-step-panel>
                </p-step-panels>
              </p-stepper>
            </div>
            <p class="dd__why">{{ m.ddGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Tipp etwas in das linke Feld, geh zum zweiten Schritt und zurück: Die Eingabe ist weg. Der Panel-Inhalt wird
          durch <code>&lt;p-motion [visible]="active()"&gt;</code> projiziert
          (<code>openng-optimus-ui-stepper.mjs:592</code>), dessen Template ein
          <code>&#64;if (rendered())</code> um den Inhalt ist
          (<code>openng-optimus-ui-motion.mjs:404-406</code>) und dessen <code>unmountOnLeave</code> standardmäßig
          <code>true</code> ist (<code>openng-optimus-ui-motion.mjs:116</code>), weil das Panel es nie setzt. Rechts
          lebt der Wert im Parent und übersteht den Hin- und Rückweg.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — <code>linear</code> als die ganze Navigation ausliefern</span>
            <div class="dd__stage">
              <p-stepper [value]="2" [linear]="true">
                <p-step-list>
                  <p-step [value]="1">{{ m.labelOne }}</p-step>
                  <p-step [value]="2">{{ m.labelTwo }}</p-step>
                  <p-step [value]="3">{{ m.labelThree }}</p-step>
                </p-step-list>
              </p-stepper>
            </div>
            <p class="dd__why">{{ m.ddLinearBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eigenes Zurück und Weiter ergänzen</span>
            <div class="dd__stage">
              <p-stepper [value]="locked()" [linear]="true">
                <p-step-list>
                  <p-step [value]="1">{{ m.labelOne }}</p-step>
                  <p-step [value]="2">{{ m.labelTwo }}</p-step>
                  <p-step [value]="3">{{ m.labelThree }}</p-step>
                </p-step-list>
              </p-stepper>
              <div class="row">
                <p-button label="Zurück" size="small" severity="secondary" [disabled]="locked() === 1" (onClick)="locked.set(locked() - 1)" />
                <p-button label="Weiter" size="small" severity="secondary" [disabled]="locked() === 3" (onClick)="locked.set(locked() + 1)" />
              </div>
            </div>
            <p class="dd__why">{{ m.ddLinearGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen setzen <code>linear</code>. Links sind die Köpfe die einzigen Bedienelemente, und jeder Kopf, der
          nicht der aktuelle ist, trägt das native <code>disabled</code>-Attribut
          (<code>openng-optimus-ui-stepper.mjs:402</code>, <code>:451</code>); rechts wird derselbe Stepper von zwei
          Buttons gesteuert, die dieser Seite gehören.
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          Die eigene Schrittanzeige des Kits mit einem echten Erledigt-Zustand ist
          <code>step-indicator.component.ts</code>: Sie führt
          <code>status: 'pending' | 'active' | 'completed' | 'error'</code> pro Schritt, rendert für einen erledigten
          Schritt ein Häkchen-Zeichen und markiert den aktuellen Schritt mit <code>aria-current="step"</code> direkt
          auf dem fokussierbaren Element.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Die Leiste wird aus drei Token-Gruppen gezeichnet — der Zahl, dem Titel und dem Trenner —, und der ganze
          Unterschied zwischen dem aktuellen Schritt und jedem anderen ist die Farbe einer Ziffer. Das ist die
          Design-Entscheidung, die du laut diesem Guide korrigieren sollst.
        </p>

        <h3>Aura-Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Export / Schlüssel</th><th>Wert</th><th>was er färbt</th></tr>
            </thead>
            <tbody>
              <tr><td><code>stepNumber.size</code></td><td>{{ m.numberSize }}</td><td>den Kreis, quadratisch</td></tr>
              <tr><td><code>stepNumber.fontSize</code></td><td>{{ m.numberFont }}</td><td>die Ziffer</td></tr>
              <tr><td><code>stepNumber.background</code></td><td>{{ m.numberBg }}</td><td>Kreisfüllung, jeder Schritt</td></tr>
              <tr><td><code>stepNumber.activeBackground</code></td><td>{{ m.numberActiveBg }}</td><td>Kreisfüllung, aktueller Schritt</td></tr>
              <tr><td><code>stepNumber.borderColor</code></td><td>{{ m.numberBorder }}</td><td>Kreisrand, jeder Schritt</td></tr>
              <tr><td><code>stepNumber.activeBorderColor</code></td><td>{{ m.numberActiveBorder }}</td><td>Kreisrand, aktueller Schritt</td></tr>
              <tr><td><code>stepNumber.color</code> / <code>activeColor</code></td><td>{{ m.numberColors }}</td><td>die Ziffer, erst nicht aktuell, dann aktuell</td></tr>
              <tr><td><code>stepTitle.color</code> / <code>activeColor</code></td><td>{{ m.titleColors }}</td><td>das Label</td></tr>
              <tr><td><code>separator.background</code> / <code>activeBackground</code></td><td>{{ m.sepColors }}</td><td>die Verbindungslinie</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/stepper/index.mjs</code>, Exporte
          <code>stepNumber</code>, <code>stepTitle</code> und <code>separator</code>; die Datei ist ein einzeiliges
          Dist-Bundle und wird nach Export zitiert. <code>.../aura/steps/index.mjs</code> wiederholt dieselbe Form unter
          <code>itemNumber</code> und <code>itemLabel</code>; sein <code>separator</code> trägt nur
          <code>background</code> und keine aktive Variante, also zeichnet eine <code>p-steps</code>-Leiste überhaupt
          keinen erledigten Verbinder.
        </p>

        <h3>Der aktive Zustand ist ein Farbwechsel</h3>
        <p>
          {{ m.colorOnly }}
        </p>
        <p class="src-note">
          Abgelesen an den beiden Paaren in der Tabelle oben: <code>activeBackground</code> ist gleich
          <code>background</code> und <code>activeBorderColor</code> ist gleich <code>borderColor</code> in
          <code>&#64;openng/optimus-ui-themes/dist/aura/stepper/index.mjs</code>. WCAG 2.2 SC 1.4.1
          <a href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html" rel="noopener noreferrer" target="_blank">Use of Color</a>
          ist das Kriterium, das daraus einen Mangel macht statt einer Geschmacksfrage.
        </p>

        <h3>Kontrast</h3>
        <p>{{ m.contrastNote }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> misst die CSS-Variablen des Kits über die vier visuellen Stile in
          beiden Modi, und die Akzentfarbe, mit der der aktive Schritt gemalt wird — im hellen Modus der rohe Akzent des
          Stils, im dunklen eine aufgehellte Stufe davon —, taucht in keiner
          seiner Vordergrund-Zeilen auf. Die Kette steht in <code>theme.service.ts</code>, das den Akzent des Stils in
          <code>semantic.primary.500</code> einspeist, während das Kompilat das separat abgedunkelte
          <code>--primary-color-fg</code> misst. Hier wird kein Verhältnis zitiert; miss den gerenderten Kreis und das
          Label in deinem eigenen Build, wenn du die Zahl brauchst.
        </p>

        <h3>Fokus-Ring</h3>
        <p>{{ m.focusNote }}</p>
        <p class="src-note">
          Regeln aus <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:45-49</code> (der Kopf),
          <code>:111-114</code> (der Wrapper) und <code>&#64;openng/optimus-ui-styles/dist/steps/index.mjs:62-66</code>
          (der Eintrags-Link); die Werte hinter der ersten und der dritten sind die <code>focusRing</code>-Schlüssel der
          Aura-Presets, die zweite nutzt direkt die globalen <code>focus.ring</code>-Token. Der Kit-Ring, der über die
          erste und die dritte zeichnet: die eine Fokus-Ring-Regel in <code>src/styles.scss</code>, deren
          Selektorliste <code>scripts/check-contrast.mjs</code> prüft und in <code>docs/generated/CONTRAST.MD</code>
          misst, <code>focus ring</code>.
        </p>

        <h3>Schmaler Viewport</h3>
        <p>{{ m.viewport }}</p>
        <p class="src-note">
          Gelesen aus <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:2-11</code> und <code>:55-60</code>
          sowie <code>&#64;openng/optimus-ui-styles/dist/steps/index.mjs:6-18</code> und <code>:68-76</code>. Keines der
          beiden Stylesheets enthält eine Media Query.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Sieben Komponenten im einen Bundle, eine im anderen, und vier Inputs, die jede von ihnen annimmt, ohne sie zu
          deklarieren. Unten: die vollständigen Übersichten, die Bindings, die ins Leere gehen, und der Beleg für das
          Unmounten.
        </p>

        <h3>p-stepper-Familie — eigene Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Selektor</th><th>eigene Inputs</th><th>Outputs</th><th>Anmerkung</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-stepper</code></td><td><code>value</code>, <code>linear</code>, <code>motionOptions</code>, <code>transitionOptions</code></td><td><code>valueChange</code></td><td><code>value</code> ist ein <code>model&lt;number | undefined&gt;</code></td></tr>
              <tr><td><code>p-step</code></td><td><code>value</code>, <code>disabled</code></td><td><code>valueChange</code></td><td>rendert den Kopf oder dein <code>#content</code>-Template</td></tr>
              <tr><td><code>p-step-panel</code></td><td><code>value</code></td><td><code>valueChange</code></td><td>braucht ein <code>#content</code>-Template, um überhaupt etwas zu zeigen</td></tr>
              <tr><td><code>p-step-item</code></td><td><code>value</code></td><td><code>valueChange</code></td><td>schiebt seinen Wert in den Step und das Panel, die es umschließt</td></tr>
              <tr><td><code>p-step-list</code></td><td>—</td><td>—</td><td>ein Klassenträger</td></tr>
              <tr><td><code>p-step-panels</code></td><td>—</td><td>—</td><td>ein Klassenträger</td></tr>
              <tr><td><code>p-stepper-separator</code></td><td>—</td><td>—</td><td>von den Komponenten gerendert, selten von dir</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kompilierte Input-Listen aus <code>openng-optimus-ui-stepper.mjs:733</code>, <code>:442</code>,
          <code>:591</code>, <code>:354</code>, <code>:268</code>, <code>:651</code> und <code>:299</code>; die
          Effects von <code>p-step-item</code> stehen in <code>:346-351</code>.
        </p>

        <h3>p-steps — eigene Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Transform</th><th>Standard</th><th>Wirkung</th></tr>
            </thead>
            <tbody>
              <tr><td><code>model</code></td><td>—</td><td><code>undefined</code></td><td>das <code>MenuItem[]</code>, aus dem die Leiste gebaut wird</td></tr>
              <tr><td><code>activeIndex</code></td><td><code>numberAttribute</code></td><td><code>0</code></td><td>welcher Eintrag aktuell ist und welcher der Tab-Halt ist, sofern nicht ein nicht deaktivierter Eintrag seinen eigenen <code>tabindex</code> setzt</td></tr>
              <tr><td><code>readonly</code></td><td><code>booleanAttribute</code></td><td><code>true</code></td><td>schluckt jeden Klick, bis du es auf <code>false</code> setzt</td></tr>
              <tr><td><code>style</code>, <code>styleClass</code></td><td>—</td><td><code>undefined</code></td><td>gehen an das <code>nav</code>-Element</td></tr>
              <tr><td><code>exact</code></td><td><code>booleanAttribute</code></td><td><code>true</code></td><td>nichts — siehe unten</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklarationen in <code>openng-optimus-ui-steps.mjs:86</code>, <code>:91</code>, <code>:96</code>,
          <code>:101-106</code> und <code>:111</code>; die kompilierte Liste mit den Transforms steht in
          <code>:247</code>, und die Klick-Sperre, die <code>readonly</code> speist, in <code>:127-130</code>.
        </p>

        <h3>Die vier geerbten Inputs</h3>
        <p>{{ m.inherited }}</p>
        <p class="src-note">
          Einmal deklariert auf <code>BaseComponent</code>
          (<code>openng-optimus-ui-basecomponent.mjs:428</code>); jede Komponente in beiden Bundles ist mit
          <code>usesInheritance: true</code> kompiliert, deshalb wiederholt keine der Listen oben sie. Das Mergen von
          <code>pt</code> steht in <code>openng-optimus-ui-basecomponent.mjs:345</code>, das das globale Objekt über
          <code>:91</code> heranzieht.
        </p>

        <h3>Bindings, die ins Leere gehen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Oberfläche</th><th>was deklariert ist</th><th>warum es wirkungslos ist</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-stepper</code></td><td><code>transitionOptions</code></td><td>{{ m.deadTransition }}</td></tr>
              <tr><td><code>p-steps</code></td><td><code>exact</code></td><td>{{ m.deadExact }}</td></tr>
              <tr><td><code>p-steps</code>-Eintragsanker</td><td><code>routerLinkActiveOptions</code></td><td>{{ m.deadRlao }}</td></tr>
              <tr><td><code>p-steps</code>-Eintragsanker</td><td><code>aria-expanded</code></td><td>{{ m.deadExpanded }}</td></tr>
              <tr><td><code>p-stepper</code></td><td>Klasse <code>p-readonly</code></td><td>{{ m.deadReadonly }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zeilen gelesen aus <code>openng-optimus-ui-stepper.mjs:703</code> gegen <code>:711-715</code>;
          <code>openng-optimus-ui-steps.mjs:111</code> gegen <code>:282</code> und <code>:302</code>;
          <code>openng-optimus-ui-steps.mjs:268</code> gegen die Input-Liste von RouterLink in <code>:317</code>;
          <code>openng-optimus-ui-steps.mjs:274</code> und <code>:300</code>; sowie
          <code>openng-optimus-ui-stepper.mjs:164</code> gegen
          <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:51</code>.
        </p>

        <h3>Warum das Panel zerstört wird, in drei Zeilen</h3>
        <pre class="code-block"><code>{{ unmountSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-stepper.mjs:592</code>, <code>openng-optimus-ui-motion.mjs:404-406</code> und
          <code>openng-optimus-ui-motion.mjs:110</code>, <code>:116</code>, <code>:367-370</code>. Das
          <code>[disabled]</code> von Motion erreicht nur <code>motionOptions.disabled</code>
          (<code>openng-optimus-ui-motion.mjs:286</code>), also hält das Abschalten der Animation den Inhalt nicht
          gemountet. Prüf es in deinem eigenen Build: Tipp in einem Panel etwas in ein Feld, wechsle weg und zurück, und
          lies das Feld.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>Eine Überschrift oder ein Status-Bereich nennt, welcher Schritt aktuell ist und wie viele es gibt.</li>
          <li>Erledigte Schritte sind durch etwas anderes als Farbe markiert — ein Zeichen, ein Wort oder beides.</li>
          <li>Die Daten jedes Panels leben in der Parent-Komponente, nicht im eigenen Template-Zustand des Panels.</li>
          <li>Mit <code>linear</code> gibt es ein Zurück-Bedienelement, und es funktioniert.</li>
          <li>Ein <code>p-steps</code>, das anklickbar sein soll, trägt <code>[readonly]="false"</code>.</li>
          <li>Step-Werte sind <code>1..n</code>, weil sie angezeigt werden.</li>
          <li>Titel sind übersetzte Strings aus deiner eigenen Komponente, keine Literale im Template.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Keine der beiden Komponenten bringt auch nur einen einzigen Text mit. Jedes Wort, das du siehst, ist deins —
          das ist eine gute Nachricht, bis auf den einen Satz, den eine Schrittleiste am dringendsten braucht und den
          keine der beiden Komponenten für dich sagt.
        </p>

        <h3>Woher jeder Text kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>was gerendert wird</th><th>Quelle</th><th>deine Aufgabe</th></tr>
            </thead>
            <tbody>
              <tr><td>Step-Titel</td><td>der Inhalt, den du in <code>p-step</code> projizierst</td><td>ein übersetzter String aus einem <code>computed()</code></td></tr>
              <tr><td>Step-Nummer</td><td>das Input <code>value</code>, vom Template in einen String verwandelt</td><td>nichts — und nichts ist möglich</td></tr>
              <tr><td><code>p-steps</code>-Label</td><td><code>item.label</code> am <code>MenuItem</code></td><td>das Array neu bauen, wenn die Sprache wechselt</td></tr>
              <tr><td><code>p-steps</code>-Nummer</td><td>der Schleifenindex plus eins</td><td>nichts</td></tr>
              <tr><td>„Schritt 2 von 5“</td><td>nirgends</td><td>alles — siehe unten</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Projektion des Titels in <code>openng-optimus-ui-stepper.mjs:456-458</code>, die Nummer in <code>:455</code>;
          Label und Nummer von <code>p-steps</code> in <code>openng-optimus-ui-steps.mjs:284-289</code>. Keines der
          beiden Bundles enthält einen Übersetzungsschlüssel, ein <code>aria-label</code>-Input oder einen
          <code>Intl</code>-Aufruf.
        </p>

        <h3>Die Nummer ist kein Label</h3>
        <p>{{ m.i18nNumber }}</p>
        <p class="src-note">
          Das Template interpoliert <code>value()</code> direkt
          (<code>openng-optimus-ui-stepper.mjs:455</code>), und derselbe Wert baut die Element-IDs
          (<code>:404-407</code>), also kann er kein lokalisierter String sein, nicht einmal dort, wo sich die Ziffern
          unterscheiden.
        </p>

        <h3>„Schritt 2 von 5“, wenn translate() nur einen Schlüssel nimmt</h3>
        <p>{{ m.i18nPattern }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate</code> nimmt einen Schlüssel und gibt einen String zurück; es hat keine
          Überladung mit Parametern, also passiert das Einsetzen, nachdem es zurückkehrt, und innerhalb des
          <code>computed()</code>, das es liest — und genau das sorgt auch dafür, dass der Satz bei einem
          Sprachwechsel neu ausgewertet wird.
        </p>

        <h3>Länge und Richtung</h3>
        <ul>
          <li>{{ m.i18nLength }}</li>
          <li>{{ m.i18nRtl }}</li>
        </ul>
        <p class="src-note">
          Ellipsen-Regeln in <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:55-60</code> und
          <code>&#64;openng/optimus-ui-styles/dist/steps/index.mjs:68-76</code>; die einzige richtungsabhängige Regel in
          einer der beiden Dateien ist der Versatz des vertikalen Trenners in
          <code>&#64;openng/optimus-ui-styles/dist/stepper/index.mjs:186-188</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Step-Köpfe und
            Eintrags-Links bekommen jetzt den 2px-Ring <code>--primary-color-fg</code> des Kits, gemessen vom Gate
            (<code>focus ring</code>); das Farbpaar des aktiven Schritts ist weiterhin ungemessen.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft:
            Alle Zeilenverweise stimmen; der Abschnitt zum Fokus-Ring sagt nicht mehr, dass der Stepper den Ring des
            Kits erbt — er bekommt Auras 1px-Outline <code>&#123;primary.color&#125;</code>, die keine Kit-Regel aufwertet
            und das Kontrast-Gate nicht misst —, und das Dokument sagt das unter Accessibility.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class StepperArticleDeComponent extends StepperArticleComponent {
  override readonly draftShown = computed(() => (this.draft() ? this.draft() : '(noch nichts eingetippt)'));

  override readonly barItems: MenuItem[] = [{ label: 'Konto' }, { label: 'Adresse' }, { label: 'Prüfen' }];

  /** Visible German strings; same keys as the English `m`. */
  override readonly m = {
    labelAccount: 'Konto',
    labelAddress: 'Adresse',
    labelReview: 'Prüfen',
    paneAccount: 'Schritt eins. Der Inhalt eines Schritts ist das, was du in sein #content-Template legst.',
    paneAddress: 'Schritt zwei. Der Wechsel weg von Schritt eins hat dessen Inhalt zerstört.',
    paneReview: 'Schritt drei. Die Leiste oben ist eine p-step-list; die Inhalte sind p-step-panel-Elemente.',

    labelOne: 'Sammeln',
    labelTwo: 'Kontrollieren',
    labelThree: 'Senden',
    paneOne: 'Mit gesetztem linear sind die beiden anderen Köpfe deaktivierte Buttons.',
    paneTwo: 'Auch der, von dem du gerade kommst.',
    paneThree: 'Zurück muss dein eigenes Bedienelement sein.',

    ddStepOne: 'Eingeben',
    ddStepTwo: 'Bestätigen',
    ddFieldLabel: 'Dein Name',
    ddBadHint: 'Geh jetzt zurück zu Schritt eins.',
    ddGoodEcho: 'Der Parent hat noch:',
    ddBadWhy:
      'Das Feld existiert nur im Panel, und der Panel-Inhalt wird aus dem DOM entfernt, wenn der Schritt verlassen wird, also wird der eingetippte Wert mit ihm zerstört.',
    ddGoodWhy:
      'Dasselbe Feld ist an ein Signal in der Parent-Komponente gebunden, also kann das Panel zerstört und neu gebaut werden, ohne dass der Wert den Parent je verlässt.',
    ddLinearBad:
      'Jeder Kopf außer dem aktuellen ist ein deaktivierter Button, also bietet dieser Stepper überhaupt keinen Weg zurück und keinen nach vorn.',
    ddLinearGood:
      'Derselbe lineare Stepper mit zwei Bedienelementen, die der Seite gehören: Die Reihenfolge wird weiterhin erzwungen, und die Bewegung in beide Richtungen ist möglich.',

    numberSize: '2rem',
    numberFont: '1.143rem, Schriftstärke 500, border-radius 50%',
    numberBg: '{content.background}',
    numberActiveBg: '{content.background} — derselbe Wert',
    numberBorder: '{content.border.color}',
    numberActiveBorder: '{content.border.color} — derselbe Wert',
    numberColors: '{text.muted.color} → {primary.color}',
    titleColors: '{text.muted.color} → {primary.color}, Schriftstärke 500',
    sepColors: '{content.border.color} → {primary.color}, 2px',

    colorOnly:
      'Der aktuelle Schritt wird mit derselben Kreisfüllung und demselben Kreisrand gezeichnet wie jeder andere Schritt; nur Ziffer und Label wechseln die Farbe, vom gedämpften Text-Token zum Primär-Token. Ein Leser, der diese beiden Farbtöne nicht unterscheiden kann, sieht überhaupt keinen aktuellen Schritt — und weil keines der beiden Bundles einen Erledigt-Zustand anbietet, gibt es im Bild nichts anderes, worauf er ausweichen könnte. Ergänze ein Zeichen, ein Wort oder eine Überschrift, die die Stufe benennt.',

    contrastNote:
      'Ziffer und Label sind Text und schulden bei diesen Größen SC 1.4.3, 4,5:1; eine Markierung, die allein einen Zustand trägt, schuldet SC 1.4.11, 3:1. Das aktive Paar wird mit der Optimus-Primärfarbe gemalt, die im hellen Modus zum rohen Akzent des Stils aufgelöst wird und im dunklen Modus zu einer aufgehellten Stufe davon — nicht zu der separat abgedunkelten Vordergrund-Variable, die das Kontrast-Kompilat des Kits misst. Das Kompilat hat deshalb keine Zeile, die für dieses Paar bürgt, und eine benachbarte Zeile zu borgen hieße, eine Zahl zu borgen, die hier nie gemessen wurde.',

    focusNote:
      'Der Step-Kopf bekommt den Fokus-Ring des Kits: .p-step-header und .p-steps-item-link stehen in der einen Ring-Regel des Kit-Stylesheets, einer 2px solid --primary-color-fg-Outline mit 2px Abstand und !important — derselbe Ring wie bei Buttons, Feldern und Radios. Er zeichnet über den Ring der Bibliothek, der aus den komponentenbezogenen Token stepper.step.header.focus.ring kommt, die das Aura-Preset auf den globalen Satz focus.ring abbildet (1px solid {primary.color}, kein Schatten). Das Kontrast-Gate misst diesen Ring auf jeder Seitenfläche (CONTRAST.MD, focus ring, niedrigster Wert 3,88:1), also hält SC 1.4.11 für den Ring überall, wo der Stepper auf einer Kit-Fläche sitzt. Die Bibliotheksregel des p-steps-Eintrags-Links ist an :not(.p-disabled) gebunden; die Kit-Regel nicht, also zeigt auch ein fokussierter deaktivierter Eintrags-Link den Ring. Eine zweite Regel sitzt auf dem p-step-Wrapper selbst, mit den globalen focus.ring-Token und ohne box-shadow; in der Praxis greift sie nie, weil der Wrapper role="presentation" und keinen tabindex trägt und daher nicht fokussierbar ist, solange du ihn nicht dazu machst. Am Wrapper sitzt auch das Attribut aria-current.',

    viewport:
      'Die Kopfleiste von p-stepper scrollt seitwärts, statt umzubrechen: p-steplist ist overflow-x: auto, und jeder Titel ist eine einzelne Zeile mit Ellipse, also wird eine Leiste mit fünf Schritten bei 360px zu einem horizontalen Scroller mit abgeschnittenen Labels. p-steps tut nicht einmal das — seine Liste ist eine schlichte Flex-Zeile ohne Overflow-Regel, also werden seine Einträge gequetscht, bis nur noch die Nummern und ein paar Zeichen übrig sind. Keines der beiden Stylesheets hat eine Media Query. Layout-Empfehlung: Halte Step-Titel bei ein oder zwei Wörtern, und ziehe unterhalb von etwa 30rem die vertikale p-step-item-Anordnung der horizontalen Leiste vor.',

    inherited:
      'dt, unstyled, pt und ptOptions sind einmal auf BaseComponent deklariert und werden von allen acht Komponenten in diesen beiden Bundles geerbt. Sie nehmen sie an, sie führen sie nicht auf, und ein Editor, der aus der kompilierten Input-Liste vervollständigt, wird sie nicht anbieten. pt kaskadiert nicht von einer Parent-Komponente: Jede Komponente löst ihr eigenes Input pt auf, gemergt mit dem globalen pt-Objekt aus der Optimus-Konfiguration und mit nichts von der Komponente darüber. Einen Step-Kopf über pt zu stylen heißt deshalb, das Objekt auf das p-step zu legen, nicht auf das p-stepper.',

    deadTransition:
      'Seit v21 veraltet und von nichts gelesen: Das computed, das die Motion-Optionen baut, liest nur den Pass-through-Abschnitt und das Input motionOptions.',
    deadExact:
      'Seine einzigen Abnehmer sind Attribut-Bindings namens ariaCurrentWhenActive, das weder ein ARIA-Attribut noch, mit dem Präfix attr. gebunden, ein RouterLink-Input ist — und RouterLinkActive kommt im Template gar nicht vor, also wird auch die Klasse, die seine Dokumentation verspricht, nie gesetzt.',
    deadRlao:
      'Am routerLink-Anker gebunden, aber routerLinkActiveOptions gehört zu RouterLinkActive, das das Template nicht nutzt; die Input-Liste von RouterLink enthält es nicht.',
    deadExpanded:
      'aria-expanded wird auf jedem Eintrag ausgegeben, true oder false, auf einem Element mit role="link" — ein Link, der nichts aufklappt, also ist der Zustand Rauschen im Accessibility Tree.',
    deadReadonly:
      'linear fügt dem Stepper-Root die Klasse p-readonly hinzu, während die einzige readonly-Regel im Stepper-Stylesheet p-stepper-readonly selektiert; die beiden Namen treffen sich nie, also hat der Zustand keinen visuellen Ausdruck.',

    i18nNumber:
      'Die Ziffer im Kreis ist der Wert, den du gebunden hast, direkt ins Template interpoliert. Sie ist kein Label, sie lässt sich nicht übersetzen, und sie wird nicht für die Locale formatiert: In keinem der beiden Bundles gibt es einen Intl-Aufruf. Braucht eine Schrift ihre eigenen Ziffern, muss die Nummer ein Titel sein, den du schreibst, und der Wert muss aus dem Blickfeld verschwinden.',

    i18nPattern:
      'Keine der beiden Komponenten sagt, wo du bist. Der Satz muss deiner sein, in einer Live-Region neben der Leiste, und der Übersetzungsdienst des Kits nimmt einen Schlüssel und sonst nichts — also werden die Zahlen in den zurückgegebenen String eingesetzt, innerhalb des computed, das ihn liest.',

    i18nLength:
      'Ein übersetzter Titel bricht nicht um: Er ist eine einzelne Zeile mit Ellipse, also wird ein Label, das auf Englisch zwei Wörter hat und auf Deutsch fünf, abgeschnitten statt neu umbrochen.',
    i18nRtl:
      'Beide Leisten folgen der Schreibrichtung, weil sie Flex-Zeilen sind; die einzige richtungsabhängige Regel in einem der beiden Stylesheets ist der Versatz des vertikalen Trenners in der p-step-item-Anordnung.',
  };
}
