import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldsetArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './fieldset-article.component';

/**
 * German twin of the Fieldset and Panel guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs fieldset`).
 */
@Component({
  selector: 'app-fieldset-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'fieldset'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Kästen mit derselben Silhouette: ein Rahmen, oben eine fette Zeile, wahlweise ein Toggle. Der eine ist
          ein natives Gruppierungselement und benennt, was in ihm steckt; der andere ist ein div mit einem span darin.
          Zu welchem du greifst, ist keine Stilfrage.
        </p>

        <h3>Beide im Ruhezustand</h3>
        <div class="stage stage--row">
          <p-fieldset legend="Kontaktdaten">
            <div class="field">
              <label for="ex-street">Straße</label>
              <input pInputText id="ex-street" />
            </div>
            <div class="field">
              <label for="ex-city">Ort</label>
              <input pInputText id="ex-city" />
            </div>
          </p-fieldset>
          <p-panel header="Versionshinweise">
            <p class="tight">Drei Fehlerbehebungen und ein neuer Guide zum Gruppieren.</p>
          </p-panel>
        </div>
        <p class="src-note">
          Der linke Kasten ist ein echtes <code>&lt;fieldset&gt;</code>, dessen erstes Kind ein echtes
          <code>&lt;legend&gt;</code> ist (<code>openng-optimus-ui-fieldset.mjs:270-271</code>). Der rechte Kasten ist
          ein Host-Element mit einem Header-<code>&lt;div&gt;</code> (<code>openng-optimus-ui-panel.mjs:346</code>),
          das einen Titel-<code>&lt;span&gt;</code> enthält (<code>:348</code>).
        </p>

        <h3>Beide zum Auf- und Zuklappen</h3>
        <div class="stage stage--row">
          <p-fieldset
            legend="Lieferoptionen"
            [toggleable]="true"
            [collapsed]="fieldsetCollapsed()"
            (collapsedChange)="fieldsetCollapsed.set($event)"
          >
            <p class="tight">Zugeklappt: {{ fieldsetCollapsed() ? 'ja' : 'nein' }}</p>
          </p-fieldset>
          <p-panel
            header="Lieferoptionen"
            [toggleable]="true"
            [collapsed]="panelCollapsed()"
            (collapsedChange)="panelCollapsed.set($event ?? false)"
          >
            <p class="tight">Zugeklappt: {{ panelCollapsed() ? 'ja' : 'nein' }}</p>
          </p-panel>
        </div>
        <p class="src-note">
          Beide Toggles sitzen im Header-Bereich, und beide senden <code>collapsedChange</code>. Unterschiedlich ist
          das Element unter dem Zeiger: ein <code>&lt;button&gt;</code> im Legend
          (<code>openng-optimus-ui-fieldset.mjs:273-284</code>) gegenüber einem <code>&lt;p-button&gt;</code> in einem
          Header-div (<code>openng-optimus-ui-panel.mjs:355-371</code>).
        </p>

        <h3>Was jede der beiden ausgibt</h3>
        <pre class="code-block"><code>{{ emittedMarkupSnippet }}</code></pre>

        <h3>Die zwei Toggle-Anatomien</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Aspekt</th><th><code>p-fieldset</code></th><th><code>p-panel</code></th></tr>
            </thead>
            <tbody>
              <tr><td>Element unter dem Zeiger</td><td>natives <code>&lt;button&gt;</code> im <code>&lt;legend&gt;</code></td><td><code>&lt;p-button&gt;</code>-Element in einem Header-<code>&lt;div&gt;</code></td></tr>
              <tr><td>Element, das den Fokus bekommt</td><td>genau dieses <code>&lt;button&gt;</code></td><td>das innere <code>&lt;button&gt;</code>, das Button rendert</td></tr>
              <tr><td>Trägt <code>aria-expanded</code></td><td>der fokussierte Button</td><td>das Wrapper-Element, nicht das fokussierte</td></tr>
              <tr><td>Zugänglicher Name des Toggles</td><td><code>aria-label</code> aus <code>legend</code></td><td>standardmäßig keiner am fokussierten Button</td></tr>
              <tr><td>Tastatur</td><td>Enter und Leertaste</td><td>Enter und Leertaste</td></tr>
              <tr><td>Gruppenname für assistive Technik</td><td>das <code>&lt;legend&gt;</code>, nativ</td><td>keiner — der Titel-span benennt nichts</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Fieldset-Zeilen aus <code>openng-optimus-ui-fieldset.mjs:270-284</code>; Panel-Zeilen aus
          <code>openng-optimus-ui-panel.mjs:346-371</code> zusammen mit dem Button-Template in
          <code>openng-optimus-ui-button.mjs:833-849</code>, wo das Element deklariert ist, das tatsächlich den Fokus
          bekommt.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Die Frage, die dieser Guide beantwortet, ist nicht, welcher Kasten richtig aussieht. Sie lautet: Braucht die
          Gruppe einen Namen, braucht sie eine Überschrift, und darf sie verschwinden?
        </p>

        <h3>Welcher Kasten</h3>
        <div class="table-wrap">
          <table>
            <caption>Gruppierende Container nach der Aufgabe, die sie erfüllen</caption>
            <thead>
              <tr><th>Komponente</th><th>Benennt die Gruppe</th><th>Klappt zu</th><th>Greif dazu, wenn</th></tr>
            </thead>
            <tbody>
              <tr><td><code>p-fieldset</code></td><td>ja, nativ</td><td>optional</td><td>Formular-Controls unter einen Namen gehören</td></tr>
              <tr><td><code>p-panel</code></td><td>nein</td><td>optional</td><td>ein betitelter Inhaltsblock zuklappen darf</td></tr>
              <tr><td><code>p-card</code></td><td>nein</td><td>nein</td><td>eine Fläche ganz ohne Rolle gewünscht ist</td></tr>
              <tr><td><code>p-accordion</code></td><td>je Panel</td><td>ja</td><td>mehrere Abschnitte unabhängig geöffnet werden</td></tr>
              <tr><td><code>app-standard-container</code></td><td>über eine echte Überschrift</td><td>ja</td><td>ein betitelter Abschnitt einer Portalseite gebraucht wird</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Spalte zur Benennung ist Markup, keine Meinung: <code>&lt;fieldset&gt;</code> plus
          <code>&lt;legend&gt;</code> (<code>openng-optimus-ui-fieldset.mjs:270-271</code>) gegenüber einem
          Titel-<code>&lt;span&gt;</code> (<code>openng-optimus-ui-panel.mjs:348</code>); die Region je Panel des
          Accordions stammt aus <code>openng-optimus-ui-accordion.mjs:408</code>.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — der Name der Gruppe ist nur eine fette Zeile</span>
            <div class="dd__stage">
              <div class="fake-group">
                <span class="fake-legend">Kontaktdaten</span>
                <div class="field">
                  <label for="bad-street">Straße</label>
                  <input pInputText id="bad-street" />
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Fieldset, dessen Legend der Name ist</span>
            <div class="dd__stage">
              <p-fieldset legend="Kontaktdaten">
                <div class="field">
                  <label for="good-street">Straße</label>
                  <input pInputText id="good-street" />
                </div>
              </p-fieldset>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen enthalten dasselbe Control und dieselben Worte. Nur die rechte legt sie in das Elementpaar, das
          die HTML-Spezifikation für das Gruppieren von Formular-Controls definiert
          (<code>openng-optimus-ui-fieldset.mjs:270-271</code>).
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Pflichtfeld in einer zugeklappten Gruppe</span>
            <div class="dd__stage">
              <form (submit)="$event.preventDefault()">
                <p-fieldset legend="Rechnungsadresse" [toggleable]="true" [collapsed]="true">
                  <div class="field">
                    <label for="bad-zip">Postleitzahl (Pflichtfeld)</label>
                    <input pInputText id="bad-zip" required />
                  </div>
                </p-fieldset>
                <button type="submit">Absenden</button>
              </form>
            </div>
            <p class="dd__why">{{ m.ddRequiredBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Pflichtfelder in einer Gruppe, die offen bleibt</span>
            <div class="dd__stage">
              <form (submit)="$event.preventDefault()">
                <p-fieldset legend="Rechnungsadresse">
                  <div class="field">
                    <label for="good-zip">Postleitzahl (Pflichtfeld)</label>
                    <input pInputText id="good-zip" required />
                  </div>
                </p-fieldset>
                <button type="submit">Absenden</button>
              </form>
            </div>
            <p class="dd__why">{{ m.ddRequiredGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Die linke Gruppe ist zugeklappt, also trägt ihr Content-Container ein Inline-<code>display: none</code>
          (<code>openng-optimus-ui-motion.mjs:493</code>, angewendet in <code>:23-24</code>), während das Control selbst
          im DOM und im Formular bleibt. Drück beide Absenden-Buttons: Der rechte setzt die eigene Meldung des Browsers
          an ein Feld, das du sehen kannst, der linke verweigert das Absenden, ohne irgendetwas zu zeigen.
        </p>

        <h3>Kommentierter Quelltext</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          Die zwei Reparaturen, die das Panel braucht, sind das eigene Namens-Input des inneren Buttons
          (<code>openng-optimus-ui-button.mjs:835</code>) und das Pass-through, das sein Root-Element erreicht
          (<code>openng-optimus-ui-panel.mjs:369</code> in <code>openng-optimus-ui-button.mjs:845</code>).
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, the fieldset element</a
            >
            — die native Benennung der Gruppe über <code>legend</code>, die ein fetter span nicht leisten kann.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#interactively-validate-the-constraints"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, interactively validate the constraints</a
            >
            — der Schritt, der an einem Pflicht-Control hängen bleibt, das ein Zuklappen versteckt hat.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 4.1.2 Name, Role, Value</a
            >
            — warum Name und Zustand am nicht fokussierbaren Panel-Wrapper nicht zählen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.11 Non-text Contrast</a
            >
            — das 3:1, das ein Rahmen schuldet, sobald er allein die Gruppierung trägt.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Beide Komponenten zeichnen einen 1px-Rahmen und ein fettes Label, und beide beziehen ihre Farben aus derselben
          <code>content.*</code>-Familie. Die Unterschiede, auf die es ankommt: wo das Padding sitzt und auf welchem
          Element der Fokus-Ring landet.
        </p>

        <h3>Aura-Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Slot</th><th><code>p-fieldset</code></th><th><code>p-panel</code></th></tr>
            </thead>
            <tbody>
              <tr><td>Rahmen</td><td><code>1px solid &#123;content.border.color&#125;</code></td><td><code>1px solid &#123;content.border.color&#125;</code></td></tr>
              <tr><td>Kasten-Padding</td><td><code>0 1.125rem 1.125rem 1.125rem</code></td><td>keins am Root</td></tr>
              <tr><td>Header-Padding</td><td><code>0.5rem 0.75rem</code> (Legend)</td><td><code>1.125rem</code>, aufklappbar <code>0.375rem 1.125rem</code></td></tr>
              <tr><td>Header-Schriftstärke</td><td><code>600</code></td><td><code>600</code></td></tr>
              <tr><td>Content-Padding</td><td><code>0</code></td><td><code>0 1.125rem 1.125rem 1.125rem</code></td></tr>
              <tr><td>Farbe des Toggle-Icons</td><td><code>&#123;text.muted.color&#125;</code></td><td>das Button-Preset</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/fieldset/index.mjs</code> und
          <code>.../aura/panel/index.mjs</code> (einzeilige dist-Bundles, zitiert nach Export); die Regeln, die sie
          verbrauchen, aus <code>&#64;openng/optimus-ui-styles/dist/fieldset/index.mjs</code> und
          <code>.../panel/index.mjs</code>.
        </p>

        <h3>Der Rahmen ist es, der die Gruppe trägt</h3>
        <p>{{ m.frameCriterion }}</p>
        <div class="table-wrap">
          <table>
            <caption>Rahmen-Token des Kits gegen die Card-Fläche, je visuellem Stil und Modus</caption>
            <thead>
              <tr><th>Stil</th><th>hell</th><th>dunkel</th><th>SC</th><th>braucht</th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>5,23:1</td><td>4,91:1</td><td>1.4.11</td><td>3:1</td></tr>
              <tr><td>lernwerkstatt</td><td>4,15:1</td><td>4,89:1</td><td>1.4.11</td><td>3:1</td></tr>
              <tr><td>skizzenbuch</td><td>4,22:1</td><td>4,25:1</td><td>1.4.11</td><td>3:1</td></tr>
              <tr><td>blaupause</td><td>4,09:1</td><td>3,97:1</td><td>1.4.11</td><td>3:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Zeilen sind <code>--control-border</code> auf <code>--surface-card</code> (Gruppe „control boundary“),
          zitiert aus <code>docs/generated/CONTRAST.MD</code>. Die Werte für den Standardrahmen sind die informativen
          <code>progressbar.background</code>-Zeilen dieser Datei auf <code>--surface-ground</code> und
          <code>--surface-card</code> (Gruppe „progressbar &amp; slider“): Die Aura-Fortschrittsspur löst dasselbe
          <code>content.border.color</code> auf. (Die Slider-Spur tut das nicht mehr — das Kit lenkt sie auf
          <code>--control-border</code> um.)
        </p>

        <h3>Fokus-Ring</h3>
        <p>{{ m.focusRing }}</p>
        <p class="src-note">
          <code>.p-fieldset-toggle-button:focus-visible</code> in
          <code>&#64;openng/optimus-ui-styles/dist/fieldset/index.mjs</code> löst
          <code>fieldset.legend.focusRing.*</code> auf, das Aura auf die globale <code>focus.ring.*</code>-Familie
          abbildet; die eine Ring-Liste des Kits in <code>src/styles.scss</code> überschreibt das, gemessen in
          <code>docs/generated/CONTRAST.MD</code> „focus ring“.
        </p>

        <h3>Schmaler Viewport</h3>
        <p>{{ m.viewport }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Fünfzehn wirksame Inputs über beide Komponenten verteilt, vier weitere, die geerbt sind und in keiner der
          kompilierten Listen auftauchen, und drei, die überhaupt nirgends gelesen werden.
        </p>

        <h3><code>p-fieldset</code>-Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Wirkt auf</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td><code>legend</code></td><td>den Label-span im Legend und das <code>aria-label</code> des Toggles</td><td>aktiv</td></tr>
              <tr><td><code>toggleable</code></td><td>den Legend-Zweig und die Root-Klasse</td><td>aktiv</td></tr>
              <tr><td><code>collapsed</code></td><td><code>aria-expanded</code>, <code>aria-hidden</code>, das Motion-Binding</td><td>aktiv</td></tr>
              <tr><td><code>style</code></td><td><code>ngStyle</code> am inneren <code>&lt;fieldset&gt;</code></td><td>aktiv</td></tr>
              <tr><td><code>styleClass</code></td><td>die Klassenliste des inneren <code>&lt;fieldset&gt;</code></td><td>aktiv</td></tr>
              <tr><td><code>motionOptions</code></td><td>die Optionen der Motion-Direktive</td><td>aktiv</td></tr>
              <tr><td><code>transitionOptions</code></td><td>nichts</td><td>tot</td></tr>
              <tr><td><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code></td><td>die Styling-Schicht</td><td>geerbt, nicht deklariert</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Eigene Inputs aus der kompilierten Deklaration <code>openng-optimus-ui-fieldset.mjs:269</code>; die geerbten
          vier aus <code>openng-optimus-ui-basecomponent.mjs:428</code>, die beide Komponenten erweitern
          (<code>usesInheritance: true</code>), ohne sie zu wiederholen.
        </p>

        <h3><code>p-panel</code>-Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Wirkt auf</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td><code>id</code></td><td>die Host-ID und jede darunter erzeugte ID</td><td>aktiv</td></tr>
              <tr><td><code>header</code></td><td>den Titel-span und das Host-<code>aria-label</code> des Toggles</td><td>aktiv</td></tr>
              <tr><td><code>toggleable</code></td><td>den Toggle-Button und die Root-Klassen</td><td>aktiv</td></tr>
              <tr><td><code>collapsed</code></td><td>das Motion-Binding und die ARIA des Wrappers</td><td>aktiv</td></tr>
              <tr><td><code>showHeader</code></td><td>den ganzen Header-Block</td><td>aktiv</td></tr>
              <tr><td><code>toggler</code></td><td>welcher Klick-Handler umschaltet</td><td>aktiv</td></tr>
              <tr><td><code>toggleButtonProps</code></td><td>den inneren Button, samt seinem Namen</td><td>aktiv</td></tr>
              <tr><td><code>styleClass</code></td><td>die Klassenliste des Hosts</td><td>aktiv, veraltet</td></tr>
              <tr><td><code>motionOptions</code></td><td>die Optionen der Motion-Direktive</td><td>aktiv</td></tr>
              <tr><td><code>iconPos</code></td><td>drei Klassennamen, die kein Stylesheet definiert</td><td>tot</td></tr>
              <tr><td><code>transitionOptions</code></td><td>nichts</td><td>tot</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Eigene Inputs aus <code>openng-optimus-ui-panel.mjs:344</code>. Die Klassen für die Icon-Position entstehen in
          <code>:33-35</code>; die Strings <code>p-panel-icons-start</code>, <code>-end</code> und
          <code>-center</code> kommen in keinem Stylesheet unter <code>&#64;openng/optimus-ui-styles/dist</code> und in
          keinem Stylesheet des Kits vor, und der Header ist ohnehin eine <code>space-between</code>-Flex-Zeile.
        </p>

        <h3>Templates</h3>
        <p>{{ m.templates }}</p>

        <h3>Was ein Zuklappen tatsächlich tut</h3>
        <pre class="code-block"><code>{{ collapseSnippet }}</code></pre>
        <p class="src-note">
          Hide-Strategie und ihre Wirkung aus <code>openng-optimus-ui-motion.mjs:493</code> und <code>:23-24</code>; das
          Fehlen einer Unmount-Option aus der Input-Liste der Direktive in <code>:693</code>, gegenüber dem eigenen
          <code>mountOnEnter</code>/<code>unmountOnLeave</code> der <code>p-motion</code>-Komponente in
          <code>:110</code> und <code>:116</code>.
        </p>

        <h3>Der tabindex-Durchlauf</h3>
        <p>{{ m.tabIndexSweep }}</p>

        <h3>Die Region, die keinen Namen hat</h3>
        <p>{{ m.unnamedRegion }}</p>
        <p class="src-note">
          Container-ARIA in <code>openng-optimus-ui-fieldset.mjs:325-326</code> und
          <code>openng-optimus-ui-panel.mjs:395-396</code>; das einzige Element, das im Fieldset jemals die
          referenzierte ID trägt, ist der Toggle-Button in <code>openng-optimus-ui-fieldset.mjs:274</code>.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>Eine Gruppe von Formular-Controls nutzt <code>p-fieldset</code>, keinen gestylten Kasten.</li>
          <li>Überall, wo die Gruppe in die Gliederung des Dokuments gehört, gibt es eine Überschrift.</li>
          <li>Der Panel-Toggle hat Namen und Aufklapp-Zustand an dem Element, das den Fokus bekommt.</li>
          <li>Kein <code>required</code>-Control und keine Fehlermeldung liegt in einer zuklappbaren Gruppe.</li>
          <li>Kein vom Autor gesetzter <code>tabindex</code> in einer zuklappbaren Gruppe.</li>
          <li>Der Rahmen erreicht 3:1 überall dort, wo er allein die Gruppierung trägt.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Ein Legend und ein Panel-Header sind UI-Strings wie alle anderen, mit einer Besonderheit: Der Legend ist
          zugleich der zugängliche Name des Toggles; wer ihn übersetzt, übersetzt also zwei Dinge auf einmal.
        </p>

        <h3>Die Strings hineinbekommen</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Der Übersetzungsdienst des Kits bietet <code>translate(key)</code> — ein Key, kein Interpolationsargument —,
          deshalb wird ein Header, der sich ändert, im <code>computed()</code> zusammengesetzt, bevor er gebunden wird.
        </p>

        <h3>Was übersetzt wird und was nicht</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Wert</th><th>Übersetzt</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr><td><code>legend</code> / <code>header</code></td><td>ja</td><td>sichtbarer Text und der Name des Toggles</td></tr>
              <tr><td><code>toggleButtonProps.ariaLabel</code></td><td>ja</td><td>der einzige Name, den der fokussierte Button bekommt</td></tr>
              <tr><td><code>id</code> an <code>p-panel</code></td><td>nein</td><td>daraus werden DOM-IDs</td></tr>
              <tr><td><code>toggler</code>, <code>iconPos</code></td><td>nein</td><td>Aufzählungswerte, die die Komponente liest</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Länge</h3>
        <p>{{ m.lengthNote }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Die Werte für den
            Standardrahmen kommen jetzt aus den <code>progressbar.background</code>-Zeilen (die Slider-Spur ist jetzt
            <code>--control-border</code>); der Toggle trägt den einen 2px-Ring des Kits.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Design zitiert die Zeilen des Kompilats, die die Standardfarbe des Rahmens
            messen (1,13–1,76:1, unter den 3:1, die ein tragender Rahmen schuldet), statt zu behaupten, es gebe keinen
            Wert; kommentierte Quellen schließen den Tab Verwendung ab; Versionsgeschichte im Markup des Korpus.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class FieldsetArticleDeComponent extends FieldsetArticleComponent {
  override readonly m = {
    ddNameBad:
      'Die fette Zeile ist ein span. Nichts verbindet sie mit dem Control darunter, ein Screenreader-Nutzer, der auf ' +
      'dem Feld landet, hört also nur das Label des Feldes und erfährt nie, zu welcher Gruppe es gehört.',
    ddNameGood:
      'Dieselben Worte stehen in einem legend innerhalb eines fieldset, dem Elementpaar, das HTML für das Gruppieren ' +
      'von Formular-Controls definiert — der Gruppenname reist mit jedem Control darin mit, ohne zusätzliches Markup.',
    ddRequiredBad:
      'Die Postleitzahl ist Pflicht, und ihr Container ist display: none. Sie ist noch im Formular und noch ungültig, ' +
      'kann aber keinen Fokus bekommen, also blockiert der Browser das Absenden, ohne irgendwem eine Meldung zu zeigen.',
    ddRequiredGood:
      'Dasselbe Feld in einer Gruppe, die nie zuklappt, bleibt fokussierbar, also kann die Validierung darauf zeigen, ' +
      'und der Leser sieht, warum sich das Formular nicht absenden lässt.',
    frameCriterion:
      'Ein Rahmen, der die Gruppe erst zur Gruppe macht, ist bedeutungstragender Nicht-Text-Inhalt und schuldet ' +
      'SC 1.4.11, also 3:1 gegen die Fläche dahinter. Der ausgelieferte Rahmen schafft das nicht: Er nimmt das ' +
      'Optimus-Token content.border.color, das kein visueller Stil umlenkt und das das Kontrast-Kompilat des Kits ' +
      'auf den hellen Untergründen mit 1,13:1 bis 1,23:1 und auf den dunklen mit 1,26:1 bis 1,76:1 misst. Ein ' +
      'Legend oder Header, der die Gruppe benennt, trägt sie auch ohne den Rahmen; wo der Rahmen allein die ' +
      'Gruppierung tragen muss, überschreib ihn mit --control-border, dessen Werte unten folgen.',
    focusRing:
      'Der Fieldset-Toggle trägt den einen Fokus-Ring des Kits — 2px --primary-color-fg mit 2px Abstand, anstelle ' +
      'von Auras 1px globalem focus.ring —, und die Regel hängt an der Button-Klasse statt an einem ' +
      'Direct-Child-Selektor, also bricht sie nicht, wenn du den Inhalt des Legend umschließt. Auf den ' +
      'Seitenflächen misst er 3,88–17,85:1 über jeden Stil, Modus und Akzent. Der Panel-Toggle ist ein Button und ' +
      'trägt denselben Ring wie jeder Button.',
    viewport:
      'Kein eingebautes responsives Verhalten und keine Media Query in einem der beiden Stylesheets. Der ' +
      'p-panel-Host ist display: block; der p-fieldset-Host ist ein ungestyltes Inline-Element um ein fieldset auf ' +
      'Blockebene, also füllen beide Kästen bei jedem Viewport die Breite ihres Containers, aber eine Breite oder ' +
      'ein vertikaler Margin am p-fieldset-Host greift nicht — dimensionier diesen über einen Wrapper oder pt.root. ' +
      'Ein langer Legend oder Header bricht in eine zweite Zeile um, statt abgeschnitten zu werden, und kein ' +
      'Content-Wrapper in einem der beiden Stylesheets setzt overflow, breiter Inhalt wird im Ruhezustand also nie ' +
      'für dich abgeschnitten oder gescrollt — nur die 0.2s lange Zuklapp-Animation setzt overflow. ' +
      'Hinweis zum Layout: Gib einer breiten Tabelle oder einem Codeblock in der Gruppe ' +
      'einen eigenen Scroll-Container.',
    templates:
      'p-fieldset projiziert header, content, expandicon und collapseicon; p-panel projiziert header, content, footer, ' +
      'icons und headericons. Eine Asymmetrie entscheidet über ein Design: Wenn p-fieldset aufklappbar ist, wird das ' +
      'header-Template innerhalb des Toggle-Buttons gerendert, darf also weder einen Link noch einen Button noch eine ' +
      'Überschrift enthalten. Ein Panel-header-Template rendert neben dem Toggle und hat keine solche Einschränkung.',
    tabIndexSweep:
      'Jedes Auf- und Zuklappen durchläuft den Inhalt nach input, button, select, a, textarea und [tabindex], setzt ' +
      'beim Zuklappen tabindex auf -1 und ENTFERNT das Attribut beim Aufklappen. Das Entfernen ist die zerstörerische ' +
      'Hälfte: Ein Widget mit Roving Tabindex, eine Toolbar oder ein Grid, das seine Tab-Stopps selbst verwaltet, ' +
      'verliert sie beim ersten Aufklappen. Der Durchlauf läuft außerdem nur über den Toggle-Pfad, nie bei einem ' +
      'Schreiben auf collapsed, ein programmatisches Zuklappen überspringt ihn also.',
    unnamedRegion:
      'Beide Content-Container sind role="region", beschriftet über eine ID, die auf _header endet. In p-panel gehört ' +
      'diese ID dem Titel-span und zusätzlich dem Toggle-Button, eine ID zu viel für ein Dokument. In p-fieldset ' +
      'existiert die ID nur, wenn die Komponente aufklappbar ist, ein einfaches Fieldset liefert also eine Region ' +
      'ganz ohne zugänglichen Namen aus — harmlos, aber nicht die Landmark, die die Rolle nahelegt.',
    lengthNote:
      'Ein Legend vergrößert die Rahmenkerbe, in der er sitzt, und ein Panel-Titel die Header-Zeile; keiner von ' +
      'beiden schneidet ab, ein deutscher oder finnischer String mit dreifacher englischer Länge bricht den Kasten ' +
      'also um, statt abgeschnitten zu werden. Prüf die längste Sprache im schmalsten Layout, denn ein zweizeiliger ' +
      'Legend verändert die Höhe von allem daneben.',
  };
}
