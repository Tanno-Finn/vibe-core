import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditorArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './editor-article.component';

/**
 * German twin of the Editor guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs editor`).
 */
@Component({
  selector: 'app-editor-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'editor'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Unten erscheint kein funktionierender Editor. Die Komponente ist ein dünner Angular-Wrapper um Quill: Sie
          rendert eine Toolbar und eine leere Box und verlangt dann vom Browser eine Bibliothek, von der
          <code>&#64;openng/optimus-ui&#64;2.0.2</code> nicht abhängt und die dieses Kit nicht installiert. Was folgt,
          ist das, was der Wrapper selbst ausgibt — und mehr bekommt niemand, bis die Engine installiert ist.
        </p>

        <h3>Was die Komponente beiträgt und was nicht</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Arbeitsteilung zwischen der Angular-Komponente und der Quill-Laufzeit
            </caption>
            <thead>
              <tr><th>Teil</th><th>Stammt aus</th><th>Existiert ohne <code>quill</code></th></tr>
            </thead>
            <tbody>
              <tr><td>Toolbar-Buttons und Selects</td><td>dem Komponenten-Template</td><td>ja — gerendert, wirkungslos</td></tr>
              <tr><td>Toolbar-Verhalten, Picker, Icons</td><td>Quills Toolbar-Modul</td><td>nein</td></tr>
              <tr><td>Inhaltsbox</td><td>dem Komponenten-Template</td><td>ja — ein leeres <code>div</code></td></tr>
              <tr><td><code>contenteditable</code>, <code>.ql-editor</code>, Tippen</td><td>Quill</td><td>nein</td></tr>
              <tr><td>CSS für beide Hälften</td><td>dem Stylesheet der Bibliothek</td><td>ja — außer wenn <code>unstyled</code> gesetzt ist</td></tr>
              <tr><td><code>onInit</code>, <code>onTextChange</code>, Formularwert</td><td>Quill-Events</td><td>nein</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das Template rendert die Toolbar und ein nacktes Inhalts-<code>div</code>
          (<code>openng-optimus-ui-editor.mjs:361-404</code>); alles andere entsteht in
          <code>createQuillEditor</code>, nachdem <code>import('quill')</code> aufgelöst ist (<code>:255</code>,
          <code>:266-331</code>). Das Stylesheet ist ein Komponenten-Style: <code>EditorStyle extends BaseStyle</code>
          umhüllt es (<code>openng-optimus-ui-editor.mjs:26-28</code>, das
          <code>&#64;openng/optimus-ui-styles/editor</code> in <code>:13</code> importiert, was zu
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs</code> aufgelöst wird), und die Komponente
          injiziert es in <code>:190</code>; es kommt also mit der Komponente, außer der geerbte Input
          <code>unstyled</code> schaltet die Style-Schicht ab
          (<code>openng-optimus-ui-basecomponent.mjs:428</code>).
        </p>

        <h3>Die Standard-Toolbar, so wie die Komponente sie schreibt</h3>
        <pre class="code-block"><code>{{ toolbarSnippet }}</code></pre>
        <p class="src-note">
          Gekürzt aus dem kompilierten Template (<code>openng-optimus-ui-editor.mjs:361-402</code>): sechs
          <code>span.ql-formats</code>-Gruppen, neun Buttons mit englischen <code>aria-label</code>s und fünf
          <code>select</code>-Elemente ohne. Die beiden Farb-<code>select</code>s tragen überhaupt kein <code>&lt;option&gt;</code>
          (<code>:381-382</code>).
        </p>

        <h3>So sieht ein gescheitertes Laden der Engine aus</h3>
        <pre class="code-block"><code>{{ failureSnippet }}</code></pre>
        <p class="src-note">
          Der Fehlerpfad ist <code>.catch((e) => console.error(e.message))</code>
          (<code>openng-optimus-ui-editor.mjs:260</code>). Es gibt keine Fehlerausgabe, kein Ersatzfeld und keinen
          Zustand, auf den das Template reagiert: Die Seite behält die Toolbar, die sie schon gezeichnet hat.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Zwei Entscheidungen, in dieser Reihenfolge. Erstens: Braucht dieses Feld wirklich HTML, obwohl es eine
          Laufzeit-Bibliothek nachzieht, die das Kit nicht mitliefert? Zweitens, wenn du dich dafür entschieden hast:
          Wer benennt den editierbaren Bereich, denn die Komponente kann es nicht.
        </p>

        <h3>Bevor du danach greifst</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Das Feld enthält</th><th>Greif zu</th><th>Weil</th></tr>
            </thead>
            <tbody>
              <tr><td>Einen Namen, einen Titel, einen Suchbegriff</td><td><code>p-inputtext</code></td><td>eine Zeile, kein Formatierungsvokabular</td></tr>
              <tr><td>Einen Kommentar, eine Beschreibung, Notizen</td><td><code>p-textarea</code></td><td>auch viele Zeilen brauchen keine Überschriften</td></tr>
              <tr><td>Strukturierten Fließtext, den eine Person verfasst</td><td><code>p-editor</code> + <code>quill</code></td><td>Überschriften, Links und Listen müssen das Speichern überstehen</td></tr>
              <tr><td>Strukturierten Fließtext, ohne Budget für eine Engine</td><td><code>p-textarea</code> + eine Markup-Konvention</td><td>eine Toolbar, die nichts tut, ist schlimmer als keine</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ m.chooseNote }}</p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein editierbarer Bereich ohne Namen</span>
            <div class="dd__stage">
              <div class="fac">
                <div class="fac__bar" aria-hidden="true"><span>B</span><span>I</span><span>U</span></div>
                <div class="fac__box" contenteditable="true">Entwurfstext…</div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein sichtbares Label und derselbe Text am editierbaren Element</span>
            <div class="dd__stage">
              <div class="fac">
                <span class="fac__label" id="editor-guide-label">Artikeltext</span>
                <div class="fac__bar" aria-hidden="true"><span>B</span><span>I</span><span>U</span></div>
                <div
                  class="fac__box"
                  id="editor-guide-box"
                  contenteditable="true"
                  role="textbox"
                  aria-multiline="true"
                  aria-labelledby="editor-guide-label"
                >
                  Entwurfstext…
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen sind handgeschriebene Nachbildungen der Form, die Quill erzeugt, keine
          <code>p-editor</code>-Instanzen — die Engine fehlt. Die Regel, die sie zeigen, ist die der Komponente: Ihr
          Inhaltselement ist ein nacktes <code>div</code> ohne <code>role</code>, <code>aria-label</code> oder
          <code>id</code> (<code>openng-optimus-ui-editor.mjs:404</code>), und das Element, das editierbar wird, ist
          Quills Kind-Element <code>.ql-editor</code>, das kein Input der Komponente erreicht.
        </p>

        <h3>Das echte Element benennen</h3>
        <pre class="code-block"><code>{{ namingSnippet }}</code></pre>
        <p class="src-note">
          <code>onInit</code> ist der DOM-Name der Property <code>onEditorInit</code>
          (<code>openng-optimus-ui-editor.mjs:354</code>), und sein Payload ist die Quill-Instanz
          (<code>:328-330</code>); <code>quill.root</code> ist das Element, an das die Komponente selbst ihre Focus-
          und Blur-Listener hängt (<code>:315</code>, <code>:326-327</code>). Dieselbe Instanz bekommst du später über
          <code>getQuill()</code> (<code>:243</code>).
        </p>

        <h3>Der Wert-Rundlauf, kommentiert</h3>
        <pre class="code-block"><code>{{ roundTripSnippet }}</code></pre>
        <p class="src-note">
          Abgelesen an <code>writeControlValue</code> (<code>openng-optimus-ui-editor.mjs:216-242</code>) und am
          <code>text-change</code>-Handler (<code>:285-300</code>). Beide Richtungen sind an Bedingungen geknüpft, und
          beide Bedingungen haben einen Zweig, der nichts Beobachtbares tut — das Schreiben bei abgehängtem Element und
          die Änderung, die nicht vom Nutzer kommt.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Stylesheet, das diese Komponente injiziert, sind zwei zusammengeheftete Stylesheets: eine mitgelieferte
          Kopie von Quills eigenem „snow“-Theme, geschrieben in festen Hex-Farben, und ein kürzerer Satz Regeln, der
          Teile davon aus Theme-Token neu einfärbt. Welche der beiden Hälften eine Fläche besitzt, entscheidet, ob sie
          den Styles des Kits überhaupt folgt.
        </p>

        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Alias</th><th>Färbt</th></tr>
            </thead>
            <tbody>
              <tr><td><code>editor.toolbar.background</code></td><td>{{ m.tokToolbarBg }}</td><td>die Toolbar-Leiste</td></tr>
              <tr><td><code>editor.toolbar.borderColor</code></td><td>{{ m.tokToolbarBorder }}</td><td>den 1px-Rahmen der Toolbar</td></tr>
              <tr><td><code>editor.toolbarItem.color</code></td><td>{{ m.tokItem }}</td><td>Strich und Füllung der Icons in Ruhe</td></tr>
              <tr><td><code>editor.toolbarItem.activeColor</code></td><td>{{ m.tokItemActive }}</td><td>ein angewandtes Format</td></tr>
              <tr><td><code>editor.content.background</code></td><td>{{ m.tokContentBg }}</td><td>die Schreibfläche</td></tr>
              <tr><td><code>editor.content.color</code></td><td>{{ m.tokContentFg }}</td><td>den Text, der geschrieben wird</td></tr>
              <tr><td><code>editor.overlay.background</code></td><td>{{ m.tokOverlayBg }}</td><td>einen aufgeklappten Picker</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aliase aus <code>&#64;openng/optimus-ui-themes/dist/aura/editor/index.mjs</code> (ein einzeiliges
          Dist-Bundle, zitiert über seine Exporte <code>toolbar</code>, <code>toolbarItem</code>, <code>overlay</code>,
          <code>overlayOption</code>, <code>content</code>); die Regeln, die sie verwenden, stehen in
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs:854-981</code>.
        </p>

        <h3>Was die Token nicht erreichen</h3>
        <p>
          Die mitgelieferte Quill-Hälfte enthält 47 literale Hex-Farbwerte aus 15 verschiedenen Codes, und die
          Token-Regeln überschreiben nur einen Teil davon.
          Der Link-Tooltip ist das sichtbare Opfer: <code>background: #fff</code> mit <code>color: #444</code>, kein
          <code>dt()</code>-Aufruf und kein Dark-Mode-Selektor, also bleibt er ein weißes Popup auf einer dunklen Seite.
          Sein Label ist CSS-<code>content</code> statt Markup.
        </p>
        <p class="src-note">
          Gezählt über die mitgelieferte Hälfte von
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs</code> (<code>:1-853</code>; die
          <code>.p-editor</code>-Token-Regeln beginnen in <code>:854</code> und bringen kein eigenes Literal mit).
          <code>:784-790</code> für die Tooltip-Box,
          <code>:792-795</code> für das Label <code>'Visit URL:'</code>; der Header der Datei selbst nennt Quill 1.3.3
          als Herkunft dieser Hälfte (<code>:2-7</code>).
        </p>

        <h3>Kontrast: was das Kompilat sagen kann und was nicht</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Token-Paare des Editors gegen <code>docs/generated/CONTRAST.MD</code>, gleich in allen vier visuellen Stilen
            </caption>
            <thead>
              <tr><th>Paar</th><th>heller Modus</th><th>dunkler Modus</th><th>Kriterium</th></tr>
            </thead>
            <tbody>
              <tr><td>Fließtext: <code>&#123;content.color&#125;</code> auf <code>&#123;content.background&#125;</code></td><td>{{ m.crTextLight }}</td><td>{{ m.crTextDark }}</td><td>SC 1.4.3, 4,5:1</td></tr>
              <tr><td>Toolbar-Icon in Ruhe: <code>&#123;text.muted.color&#125;</code> auf <code>&#123;content.background&#125;</code></td><td>{{ m.crIconLight }}</td><td>{{ m.crIconDark }}</td><td>SC 1.4.11, 3:1</td></tr>
              <tr><td>Rahmen von Toolbar und Inhalt: <code>&#123;content.border.color&#125;</code></td><td>{{ m.contrastGap }}</td><td>{{ m.contrastGap }}</td><td>SC 1.4.11, 3:1</td></tr>
              <tr><td>Link-Tooltip: <code>#444</code> als Literal auf <code>#fff</code></td><td>{{ m.contrastGap }}</td><td>{{ m.contrastGap }}</td><td>SC 1.4.3, 4,5:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ m.contrastNote }}</p>

        <h3>Höhe und schmale Viewports</h3>
        <p>
          <strong>Die Komponente hat weder eine eigene Höhe noch eigenes responsives Verhalten.</strong> Container und
          Schreibfläche haben beide <code>height: 100%</code>, also schrumpft ein Editor, dessen Inhalts-div keine Höhe
          bekommt, auf die Toolbar plus eine Haarlinie; gib ihm eine über <code>[style]</code>, das an dieses div
          gebunden ist. Horizontal sind die Toolbar-Gruppen Inline-Blocks aus gefloateten Buttons, also brechen sie in
          weitere Zeilen um, wenn der Container schmaler wird — die Toolbar wird höher, nichts scrollt seitwärts, und
          nichts klappt in ein Menü zusammen. Die einzige Media Query im ganzen Stylesheet ist ein
          <code>(pointer: coarse)</code>-Block, der nur Hover-Farben neutralisiert, also bekommen Touch-Geräte dasselbe
          Layout mit derselben Button-Höhe von 24px.
        </p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs:8-15</code> und <code>:33-45</code> für die beiden
          <code>height: 100%</code>-Regeln, <code>:303-313</code> für die gefloateten 24×28px-Buttons, <code>:446-449</code>
          für die Inline-Block-Gruppen, <code>:404</code> für die einzige Media Query; <code>[style]</code> erreicht das
          Inhalts-div über <code>ngStyle</code> (<code>openng-optimus-ui-editor.mjs:404</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Neun eigene Inputs, sechs Outputs und acht geerbte — vier Formular-Inputs, von denen ein einziger gelesen
          wird, plus vier Passthrough-Inputs, die das DOM tatsächlich erreichen. Interessant an der Oberfläche ist nicht,
          was sie anbietet, sondern welche der angebotenen Dinge mit der Engine verdrahtet sind.
        </p>

        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Wo er landet</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>placeholder</code></td><td>Quill-Optionen</td><td>von CSS aus einem Data-Attribut gerendert</td></tr>
              <tr><td><code>formats</code></td><td>Quill-Optionen</td><td>die Liste der erlaubten Formate</td></tr>
              <tr><td><code>modules</code></td><td>Quill-Optionen</td><td>flach über den eingebauten Toolbar-Eintrag gemergt</td></tr>
              <tr><td><code>bounds</code>, <code>scrollingContainer</code>, <code>debug</code></td><td>Quill-Optionen</td><td>unverändert weitergereicht</td></tr>
              <tr><td><code>readonly</code></td><td>Konstruktor und Setter</td><td>der einzige funktionierende Weg, das Feld zu sperren</td></tr>
              <tr><td><code>style</code></td><td>Inhalts-<code>div</code></td><td>über <code>ngStyle</code> — hier gehört die Höhe hin</td></tr>
              <tr><td><code>styleClass</code></td><td>Host-Klasse</td><td>seit v20 veraltet, nimm <code>class</code></td></tr>
              <tr><td><code>invalid</code> (geerbt)</td><td><code>p-invalid</code> am Host</td><td>ein Haken — dieses Stylesheet definiert keine Regel dafür</td></tr>
              <tr><td><code>disabled</code>, <code>required</code>, <code>name</code> (geerbt)</td><td>nirgends</td><td>von der Basis-Direktive angenommen, vom Editor nicht gelesen</td></tr>
              <tr><td><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> (geerbt)</td><td>Token, Style-Schicht, DOM-Attribute</td><td>aus <code>BaseComponent</code>, eine Ebene weiter oben — <code>pt</code> ist der einzige Weg, Attribute an Toolbar und Inhalts-div zu setzen</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Eigene Inputs aus der kompilierten Deklaration (<code>openng-optimus-ui-editor.mjs:354</code>) und dem
          Optionsobjekt, das sie speisen (<code>:271-280</code>); die Formular-Inputs aus
          <code>openng-optimus-ui-baseeditableholder.mjs:58</code>, die Passthrough-Inputs aus
          <code>openng-optimus-ui-basecomponent.mjs:428</code>, verwendet über <code>ptm()</code> an Toolbar,
          Gruppen, Controls und Inhalts-div (<code>openng-optimus-ui-editor.mjs:362</code>, <code>:363</code>,
          <code>:376</code>, <code>:404</code>). <code>invalid()</code> wird in
          <code>openng-optimus-ui-editor.mjs:20</code> gelesen; eine Suche in
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs</code> nach <code>p-invalid</code> findet nichts,
          also gestaltest du die Klasse selbst.
        </p>

        <h3>Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Binding</th><th>Property</th><th>Feuert, wenn</th></tr>
            </thead>
            <tbody>
              <tr><td><code>(onInit)</code></td><td><code>onEditorInit</code></td><td>die Instanz existiert — der einzige Zugriff auf sie im Template</td></tr>
              <tr><td><code>(onTextChange)</code></td><td><code>onTextChange</code></td><td>eine Person editiert; nie bei programmatischen Änderungen</td></tr>
              <tr><td><code>(onSelectionChange)</code></td><td><code>onSelectionChange</code></td><td>die Auswahl oder der Cursor sich bewegt</td></tr>
              <tr><td><code>(onEditorChange)</code></td><td><code>onEditorChange</code></td><td>sich der Editor irgendwie ändert, mit dem Namen des Events — kein <code>source</code>-Guard, also auch bei programmatischen Änderungen</td></tr>
              <tr><td><code>(onFocus)</code>, <code>(onBlur)</code></td><td><code>onFocus</code>, <code>onBlur</code></td><td>Listener auf dem editierbaren Root</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Namen und Aliase aus der kompilierten Deklaration (<code>openng-optimus-ui-editor.mjs:354</code>); der
          Guard <code>source === 'user'</code>, der den Payload von text-change und das Formular-Update steuert, steht in
          <code>:286</code>; das Abo auf <code>editor-change</code> in <code>:309-314</code> hat keinen solchen Guard.
          Focus- und Blur-Listener in <code>:326-327</code>, in <code>onDestroy</code> wieder entfernt
          (<code>:332-344</code>).
        </p>

        <h3>Zwei stille Zweige</h3>
        <pre class="code-block"><code>{{ branchSnippet }}</code></pre>
        <p class="src-note">
          <code>delayedCommand</code> kommt im Bundle dreimal vor: deklariert in
          <code>openng-optimus-ui-editor.mjs:173</code>, zugewiesen in <code>:227</code> und <code>:238</code>. Nichts
          liest es, also läuft der Schreibvorgang, den es hält, nie. Der zweite Zweig ist das <code>else</code> von
          <code>if (source === 'user')</code> (<code>:286</code>), das es gar nicht gibt.
        </p>

        <h3>Server-Rendering</h3>
        <p>
          Die Initialisierung ist in <code>afterNextRender</code> gekapselt und kehrt auf dem Server zusätzlich früh
          zurück, also enthält ein vorgerendertes Dokument das Toolbar-Markup und ein leeres Inhalts-div — korrekt,
          wirkungslos und dasselbe, was ein Browser ohne die Engine am Ende hat. Die Engine hängt sich danach auf dem
          Client an, sobald der dynamische Import aufgelöst ist.
        </p>
        <p class="src-note">
          <code>openng-optimus-ui-editor.mjs:196</code> für den Render-Hook, <code>:247-249</code> für den
          <code>isPlatformServer</code>-Guard.
        </p>

        <h3>Checkliste, bevor du ein Rich-Text-Feld auslieferst</h3>
        <ul class="checklist">
          <li>{{ m.checkInstall }}</li>
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkToolbar }}</li>
          <li>{{ m.checkEmpty }}</li>
          <li>{{ m.checkSanitize }}</li>
          <li>{{ m.checkHeight }}</li>
          <li>{{ m.checkDisabled }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Die Toolbar spricht Englisch und bietet keinen Weg, sie um etwas anderes zu bitten. Das ist der eine Teil der
          Komponente, an den eine Übersetzungsschicht nichts binden kann, also muss die Entscheidung fallen, bevor das
          Feld ausgeliefert wird, nicht danach.
        </p>

        <h3>Wo das Englisch steht</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Geschrieben in</th><th>Aus deiner App erreichbar</th></tr>
            </thead>
            <tbody>
              <tr><td>Neun Button-<code>aria-label</code>s</td><td>dem kompilierten Template</td><td>nein</td></tr>
              <tr><td>„Heading“, „Subheading“, „Normal“</td><td>dem kompilierten Template</td><td>nein</td></tr>
              <tr><td>„Sans Serif“, „Serif“, „Monospace“</td><td>dem kompilierten Template</td><td>nein</td></tr>
              <tr><td>„center“, „right“, „justify“</td><td>dem kompilierten Template</td><td>nein</td></tr>
              <tr><td>„Visit URL:“ am Link-Tooltip</td><td>CSS-<code>content</code></td><td>nur durch Überschreiben der Regel</td></tr>
              <tr><td><code>placeholder</code></td><td>deinem Binding</td><td>ja</td></tr>
              <tr><td>Die fünf Farb- und Picker-<code>select</code>s</td><td>—</td><td>sie haben kein Label, das man übersetzen könnte</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Labels in <code>openng-optimus-ui-editor.mjs:376-378</code>, <code>:385-386</code>, <code>:395-397</code>,
          <code>:400</code>; Optionstext in <code>:365-367</code>, <code>:370-372</code>, <code>:388-391</code>;
          Selects ohne Label in <code>:364</code>, <code>:369</code>, <code>:381</code>, <code>:382</code>,
          <code>:387</code>; das Tooltip-Label in
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs:792-795</code>.
        </p>

        <h3>Der einzige Hebel: die Toolbar ersetzen</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Ein projiziertes <code>&lt;p-header&gt;</code>, ein <code>#header</code>-Template oder ein
          <code>&lt;ng-template pTemplate="header"&gt;</code> schaltet die eingebaute Toolbar komplett ab
          (<code>openng-optimus-ui-editor.mjs:355-361</code>; das dritte füllt <code>headerTemplate</code> in
          <code>onAfterContentInit</code>, <code>:201-209</code>) — ein teilweises Überschreiben gibt es nicht. Was du
          dann projizierst, muss Quills eigene Klassennamen tragen, weil das Toolbar-Modul sich an diese bindet.
        </p>
        <p class="src-note">
          Hier nicht gemessen: was Quills Picker-Widgets offenlegen, sobald sie diese <code>select</code>-Elemente
          ersetzen. Dieses Markup kommt aus der Engine, die nicht Teil von <code>&#64;openng/optimus-ui</code> ist.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Fließtext aus der Zeile
            „content panel“ zitiert; das Toolbar-Icon leiht sich nicht mehr die Zeile des Text-Buttons im Dialog, die
            das Kit neu eingefärbt hat.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Die Kontrasttabelle zitiert die Zeilen des Kompilats, die die
            Token-Paare für Text und Toolbar-Icon des Editors auflösen; Rahmen und Tooltip als Lücken benannt.
          </li>
          <li><strong>1.0</strong> — 06.09.2026 — Erste Version, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class EditorArticleDeComponent extends EditorArticleComponent {
  override readonly m = {
    chooseNote:
      'Die unterste Zeile ist keine rhetorische Option: Ohne quill-Paket rendert die Komponente trotzdem ihre ' +
      'Toolbar, also ist ein Feld, das editierbar aussieht und es nicht ist, der Standardfall des Scheiterns, kein Randfall.',

    ddNameBad:
      'Die editierbare Box hat keinen Namen, also kündigt ein Screenreader einen unbenannten Bearbeitungsbereich an, ' +
      'und wer per Sprachsteuerung arbeitet, hat nichts, was er sagen könnte, um sie zu erreichen. Genau das rendert ' +
      'p-editor heute: Die Komponente gibt ihrem Inhaltselement keine role, kein aria-label und keine id.',
    ddNameGood:
      'Ein sichtbares Label, auf das das editierbare Element verweist, benennt es für alle; role und aria-multiline ' +
      'teilen assistiver Technik mit, dass es ein mehrzeiliges Textfeld ist. Bei p-editor müssen dieselben drei ' +
      'Attribute im onInit-Handler am Root der Engine gesetzt werden, weil kein Input dieses Element erreicht.',

    tokToolbarBg: '{content.background}',
    tokToolbarBorder: '{content.border.color}',
    tokItem: '{text.muted.color}',
    tokItemActive: '{primary.color}',
    tokContentBg: '{content.background}',
    tokContentFg: '{content.color}',
    tokOverlayBg: '{overlay.select.background}',

    contrastGap: 'keine Zeile',
    crTextLight: '10,35:1',
    crTextDark: '17,72:1',
    crIconLight: '4,76:1',
    crIconDark: '6,91:1',
    contrastNote:
      'Das Kompilat hat keine Editor-Zeile, misst aber das Fließtext-Paar genau: die Zeile „content panel“, ' +
      'text.color auf content.background ({surface.0} / {surface.900}). Das Toolbar-Icon ist {text.muted.color}; im ' +
      'hellen Modus auf Weiß ist es dasselbe Paar wie die geprüfte Zeile paginator.nav.button.color (4,76:1), und im ' +
      'dunklen Modus auf {surface.900} wird es hier berechnet (6,91:1) — die Zeile des Text-Buttons im Dialog steht ' +
      'nicht mehr dafür, weil das Kit sekundäre Text-Buttons in --text-color-secondary neu einfärbt. Die Rahmen und ' +
      'der Tooltip stehen in keiner Zeile; miss sie im Browser, sobald die Engine installiert ist und die echten ' +
      'Elemente existieren.',

    checkInstall:
      'quill ist eine Abhängigkeit dieser Anwendung, mit fester Version, und sein Fehlen lässt den Build scheitern ' +
      'statt einen Nutzer.',
    checkName: 'Der editierbare Root trägt einen Namen, der im onInit-Handler gesetzt wird, und der Accessibility Tree zeigt ihn.',
    checkToolbar:
      'Alle 14 Toolbar-Controls stehen im Markup vor dem Inhalts-div, also kommen sie in der Tab-Reihenfolge vor dem ' +
      'Text, außer du hast einen Roving Tabindex eingebaut.',
    checkEmpty: 'Ob das Feld leer ist, entscheidet textValue, nicht der HTML-String.',
    checkSanitize: 'Das gespeicherte HTML wird überall sanitisiert, wo es wieder gerendert wird, auch in deiner eigenen Vorschau.',
    checkHeight: 'Das Inhalts-div hat über [style] eine explizite Höhe.',
    checkDisabled: 'Gesperrt wird mit readonly; kein Codepfad verlässt sich auf [disabled] oder ein deaktiviertes FormControl.',
  };
}
