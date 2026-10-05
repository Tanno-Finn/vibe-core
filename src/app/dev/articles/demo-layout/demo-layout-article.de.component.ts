import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DemoLayoutArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './demo-layout-article.component';

/**
 * German twin of the Demo Layout guide (ADR-0018).
 *
 * Extends the English canonical article, so the code snippets are shared; only the
 * template is German (the class holds no visible prose outside code). Keep it in step
 * with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs demo-layout`).
 */
@Component({
  selector: 'app-demo-layout-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'demo-layout'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Eine Demo in diesem Kit ist keine Seite mit einem Template drumherum. Sie ist eine Seitenkomponente, die
          einer Vorlage folgt, und diese Vorlage ist das Layout. Zu sehen, was diese Seite enthält und bei welcher
          Breite sich ihr interaktiver Kern neu anordnet, ist schon der größte Teil der Arbeit.
        </p>

        <h3>Die Vorlage, in der Reihenfolge, in der sie rendert</h3>
        <p>
          Jede Zeile unten ist Markup, das die Seite selbst schreibt — nichts kommt ungefragt dazu, und genau das
          macht daraus ein Muster statt eines Templates.
        </p>
        <div class="skel">
          <div class="skel__band">
            <span class="skel__cap">die Seitenkomponente — ihr Host ist der Größen-Container</span>
            <div class="skel__row">app-page-header — die eine h1, dann ein Untertitel</div>
            <div class="skel__row">app-example-box — worum es auf dieser Seite geht</div>
            <div class="skel__band skel__band--body">
              <span class="skel__cap">app-standard-container, Typ demo — eine h2</span>
              <div class="skel__row">Bühne — ein Canvas mit role=&quot;img&quot; und einem Namen</div>
              <div class="skel__row">Panel — beschriftete Bedienelemente, Buttons, dann die Live-Region</div>
            </div>
            <div class="skel__row skel__row--muted">Erklärung, Checkpoint, Takeaways, verwandte Inhalte</div>
          </div>
        </div>
        <p>
          Die Bühne steht im Dokument zuerst, das Panel danach. Bei einer Spalte steht damit das, was bedient wird,
          über den Bedienelementen, die es steuern; bei zwei Spalten steht es links. Eine
          <code>order</code>-Eigenschaft ist in keiner Richtung im Spiel.
        </p>
        <p class="src-note">
          Seitenreihenfolge, Überschriftenebenen und Reihenfolge der Teile aus der Vorlage,
          <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>Derselbe Kern bei zwei Breiten</h3>
        <p>
          Beide Kästen unten tragen identisches Markup und eine gemeinsame Regel. Der einzige Unterschied ist, wie
          viel Platz ihnen ihr Wrapper gibt — der Viewport ist für beide derselbe, und genau darum geht es. Die
          Schwelle ist hier kleiner als die der Vorlage, damit beide Zustände auf dieser Seite nebeneinander passen.
        </p>
        <div class="cq-row">
          <div class="cq-box cq-box--narrow">
            <div class="cq-card">
              <div class="cq-head">Schmaler Wrapper</div>
              <div class="cq-body">
                <div class="cq-stage">Bühne</div>
                <div class="cq-panel">Panel</div>
              </div>
            </div>
          </div>
          <div class="cq-box cq-box--wide">
            <div class="cq-card">
              <div class="cq-head">Breiter Wrapper</div>
              <div class="cq-body">
                <div class="cq-stage">Bühne</div>
                <div class="cq-panel">Panel</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Nur die Position ändert sich: Das Panel behält in beiden Zuständen seinen Rahmen, sein Padding und seinen
          eigenen Grund, also liest es sich als ein Kasten mit Bedienelementen, ob es neben der Bühne sitzt oder
          darunter.
        </p>
        <p class="src-note">
          Das gezeigte Verhalten ist die <code>&#64;container</code>-Regel der Vorlage
          (<code>src/app/pages/example-demo/example-demo.component.ts</code>), deren Komponenten-Host der
          Größen-Container ist und deren Panel-Grund außerhalb dieser Regel deklariert ist.
        </p>

        <h3>Die zwei Formen, in denen eine Demo ausgeliefert wird</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Form</th><th>Rahmen</th><th>Überschriften</th><th>Nimmt</th></tr>
            </thead>
            <tbody>
              <tr><td>Geroutete Demo-Seite</td><td>Die Vorlage — Seiten-Header, Standard-Container</td><td>Eine <code>h1</code>, eine <code>h2</code> je Container</td><td>Kein Config-Input</td></tr>
              <tr><td>In einen Artikel eingebettetes Widget</td><td>Keiner — den liefert der Artikelabschnitt</td><td>Inhalts-<code>h3</code>/<code>h4</code> unter den Überschriften des Artikels</td><td><code>config = input.required&lt;XConfig&gt;()</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die geroutete Form ist <code>src/app/pages/example-demo/</code>; die eingebetteten Widgets liegen unter
          <code>src/app/components/didactic/</code> und werden von den Artikelseiten unter
          <code>src/app/pages/articles/</code> eingebunden.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Was du schreibst, in welcher Reihenfolge, und was registriert sein muss, bevor eine Demo unter einer URL
          erreichbar ist.
        </p>

        <h3>Die Teile, in Dokumentreihenfolge</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Teil</th><th>Element</th><th>Enthält</th><th>Optional</th></tr>
            </thead>
            <tbody>
              <tr><td>Seiten-Header</td><td><code>app-page-header</code></td><td>Die eine <code>h1</code> und einen Untertitel</td><td>Nein</td></tr>
              <tr><td>Demo-Abschnitt</td><td><code>app-standard-container</code>, <code>type: &#39;demo&#39;</code></td><td>Eine <code>h2</code>, einen Einleitungssatz und das Grid</td><td>Nein</td></tr>
              <tr><td>Bühne</td><td><code>canvas</code> mit <code>role=&quot;img&quot;</code>, <code>svg</code> oder schlichtes DOM</td><td>Das, was der Leser bedient, plus seine Textzusammenfassung für Forced Colors</td><td>Nein</td></tr>
              <tr><td>Panel</td><td><code>div</code></td><td>Beschriftete Bedienelemente, Buttons, die Live-Region</td><td>Nein</td></tr>
              <tr><td>Erklärung, Checkpoint, Takeaways</td><td><code>app-standard-container</code>, <code>app-checkpoint</code>, <code>app-takeaways-list</code></td><td>Was man beobachten soll und was es bedeutet</td><td>Ja</td></tr>
              <tr><td>Verwandte Inhalte</td><td><code>app-demo-related</code></td><td>Den <code>related</code>-Block des Registry-Eintrags</td><td>Ja</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aus der Vorlage gelesen, <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>Wo eine Demo registriert wird</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Artefakt</th><th>Datei</th><th>Steuert</th></tr>
            </thead>
            <tbody>
              <tr><td>Die Komponente</td><td><code>src/app/pages/&lt;id&gt;/</code></td><td>Die Demo-Seite, aus der Vorlage kopiert</td></tr>
              <tr><td>Die Route</td><td><code>src/app/app.routes.ts</code></td><td>Die URL, den Navigationseintrag, die Weiterleitung über die Seiten-ID</td></tr>
              <tr><td>Der Registry-Eintrag</td><td><code>src/assets/data/core/demos/index.json</code></td><td>Das Hub-Raster, die Freigabesperre, die Querverweise</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Die Aufteilung ist keine Kosmetik. Eine Demo, die im JSON fehlt, ist unter ihrer URL trotzdem erreichbar,
          taucht aber nie im Hub auf und wird nie durch ihr Veröffentlichungsdatum gesperrt — der Guard behandelt
          einen nicht registrierten Pfad als Nicht-Demo und lässt ihn durch, wobei er im Dev-Modus eine Warnung in
          die Konsole schreibt, damit der fehlende Eintrag auffällt, bevor er ausgeliefert wird. Das umgekehrte
          Versäumnis ist lauter: Ein Eintrag, dessen <code>path</code> zu keiner Route passt, ist eine Hub-Kachel,
          die auf die Wildcard-Route durchfällt.
        </p>
        <p class="src-note">
          Feldbedeutungen aus dem Interface <code>DemoMeta</code> in
          <code>src/app/services/demos.service.ts</code>; das Durchlassen eines nicht registrierten Pfads aus
          <code>src/app/guards/demo-release.guard.ts</code>.
        </p>

        <h3>Do/Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — nach dem Viewport umschalten</span>
            <div class="dd__stage"><code class="dd__code">{{ badQuery }}</code></div>
            <p class="dd__why">
              Eine Demo wird bei mehreren Breiten eingebunden. Eine Viewport-Abfrage gibt ihr zwei Spalten in einer
              schmalen Spalte oder einem Seitenpanel, oder lässt sie in einer breiten gestapelt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — nach dem Container umschalten</span>
            <div class="dd__stage"><code class="dd__code">{{ goodQuery }}</code></div>
            <p class="dd__why">
              Der Host erklärt sich selbst zum Query-Container, also beantwortet die Regel die eine Frage, auf die es
              ankommt: Wie breit ist diese Demo, wo immer man sie hingesetzt hat?
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Bedienelemente vor der Bühne</span>
            <div class="dd__stage"><code class="dd__code">{{ badOrder }}</code></div>
            <p class="dd__why">
              Bei einer Spalte liest sich das wie ein Formular mit einem Bild darunter, und wer per Tastatur kommt,
              trifft auf jedes Bedienelement, bevor er weiß, worauf es wirkt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Bühne, dann Panel</span>
            <div class="dd__stage"><code class="dd__code">{{ goodOrder }}</code></div>
            <p class="dd__why">
              Eine Dokumentreihenfolge bedient beide Layouts: oben bei einer Spalte, links bei zweien. Eine
              <code>order</code>-Eigenschaft braucht es nirgends.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Live-Region lokal umstylen</span>
            <div class="dd__stage"><code class="dd__code">{{ badSrOnly }}</code></div>
            <p class="dd__why">
              Jede Deklaration der globalen Klasse ist <code>!important</code>, also verliert eine normal gewichtete
              Kopie gegen alle neun — totes Gewicht, das wie Kontrolle aussieht. <code>!important</code> an der Kopie
              würde gewinnen und ist die falsche Korrektur.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die globale Klasse so nutzen, wie sie ist</span>
            <div class="dd__stage"><code class="dd__code">{{ goodSrOnly }}</code></div>
            <p class="dd__why">
              Eine Klasse, eine Definition. Muss die Region sichtbar sein, ist sie keine Live-Region — sie ist eine
              Anzeige und gehört als solche ins Panel.
            </p>
          </div>
        </div>
        <p class="src-note">
          Die globale Klasse und ihre <code>!important</code>-Deklarationen aus
          <code>src/styles.scss</code>; die Spaltenregel und die Reihenfolge der Teile aus der Vorlage,
          <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/css-contain-3/" target="_blank" rel="noopener noreferrer"
              >W3C — CSS Containment Level 3</a
            >
            — <code>container-type: inline-size</code> und wie <code>&#64;container</code> seinen Container findet.
          </li>
          <li>
            <a href="https://www.w3.org/TR/css-cascade-4/" target="_blank" rel="noopener noreferrer"
              >W3C — CSS Cascading and Inheritance Level 4</a
            >
            — warum eine wichtige Deklaration eine lokale Kopie von <code>.sr-only</code> schlägt.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html" target="_blank" rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            — die Live-Region, die eine Änderung meldet, ohne den Fokus zu verschieben.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Layout besteht aus vier Deklarationen und einer Schwelle. Was zwischen Demos variieren darf, ist das
          Verhältnis; was nicht variiert, ist, welches Element die Frage stellt.
        </p>

        <h3>Der Spaltenwechsel, Deklaration für Deklaration</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Deklaration</th><th>Sitzt auf</th><th>Wert in der Vorlage</th></tr>
            </thead>
            <tbody>
              <tr><td><code>container-type</code></td><td>dem Komponenten-Host</td><td><code>inline-size</code></td></tr>
              <tr><td>Schwelle</td><td>der <code>&#64;container</code>-Regel</td><td><code>min-width: 700px</code></td></tr>
              <tr><td><code>grid-template-columns</code></td><td>dem Grid, innerhalb der Regel</td><td><code>minmax(0, 1.3fr) minmax(15rem, 1fr)</code>; außerhalb <code>1fr</code></td></tr>
              <tr><td><code>gap</code></td><td>dem Grid</td><td><code>var(--space-4, 1.25rem)</code></td></tr>
              <tr><td><code>align-items</code></td><td>dem Grid</td><td><code>start</code></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Die Bühne bekommt den größeren Anteil, und das Panel hat eine Untergrenze von <code>15rem</code>, damit die
          Bedienelemente nicht zerquetscht werden; eine Obergrenze gibt es nicht, also wächst das Panel auf einer
          breiten Seite im selben Verhältnis mit der Bühne. Außerhalb der Abfrage ist das Grid einspaltig, und nur
          der Abstand greift.
        </p>
        <p class="src-note">
          Werte aus den Regeln <code>:host</code>, <code>.demo-layout</code> und <code>&#64;container</code>
          in <code>src/app/pages/example-demo/example-demo.component.ts</code>.
        </p>

        <h3>Die zwei Gründe und was auf ihnen stehen darf</h3>
        <p>
          Eine Demo hat zwei Hintergründe: den Standard-Container um sie herum, auf
          <code>--surface-card</code>, und das Panel und den Canvas, auf
          <code>--surface-section</code>. Text, der auf dem einen lesbar ist, ist es auf dem anderen nicht
          automatisch, und der visuelle Stil entscheidet über beide.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Paar</th><th>werkbund, hell/dunkel</th><th>Alle vier Stile, niedrigster Wert</th><th>SC 1.4.3 verlangt</th></tr>
            </thead>
            <tbody>
              <tr><td><code>--text-color</code> auf <code>--surface-card</code></td><td>18,73:1 / 14,86:1</td><td>11,32:1 (skizzenbuch, dunkel)</td><td>4,5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> auf <code>--surface-card</code></td><td>7,78:1 / 6,59:1</td><td>5,21:1 (blaupause, hell)</td><td>4,5:1</td></tr>
              <tr><td><code>--text-color</code> auf <code>--surface-section</code></td><td>16,00:1 / 13,32:1</td><td>9,35:1 (blaupause, dunkel)</td><td>4,5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> auf <code>--surface-section</code></td><td>6,65:1 / 5,91:1</td><td>4,64:1 (blaupause, hell)</td><td>4,5:1</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Sekundärtext auf dem Panel-Grund hat von den vier Zeilen den knappsten Spielraum — eine Bildunterschrift
          oder ein Hinweis, der Bedeutung tragen muss, ist in vollem <code>--text-color</code> sicherer. Der Rahmen
          der Bühne ist eine andere Sache: <code>--surface-border</code> ist seiner Rolle nach dekorativ und nicht an
          SC 1.4.11 gebunden, also ist der Rahmen um eine Bühne Dekoration, und alles, was der Leser unterscheiden
          muss, braucht seinen eigenen Kontrast.
        </p>
        <p class="src-note">
          Werte aus den „body text“-Zeilen von <code>docs/generated/CONTRAST.MD</code> zitiert, je visuellem Stil
          und Modus; die Gründe aus <code>.standard-container</code> in
          <code>src/app/components/shared/standard-container.component.ts</code> sowie aus
          <code>.controls-panel</code> und <code>.demo-canvas</code> in der Vorlage.
        </p>

        <h3>Was auf einem schmalen Bildschirm passiert</h3>
        <p>
          Unter 700px Breite der Demo selbst — nicht des Viewports — ist das Grid einspaltig: Bühne, dann Panel,
          jeweils in voller Breite, das Panel mit seinem Grund und Rahmen. Der Canvas skaliert mit seinem
          <code>aspect-ratio</code>; die Button-Reihe bricht um, jeder Button nimmt mindestens <code>8rem</code>, und
          Buttons mit <code>btn-mobile-full</code> werden ab 640px <em>Viewport</em>-Breite und darunter
          vollbreit — der eine Breakpoint in diesem Layout, der noch am Fenster hängt. Der Standard-Container
          schneidet seine Content-Box ab (<code>overflow: hidden</code> an seinem Collapse-Wrapper), also wird
          alles, was breiter als der Container ist, ohne Scroll-Möglichkeit abgeschnitten: Gib der Bühne eine
          prozentuale Breite und ein Seitenverhältnis, und gib jeder Tabelle oder breiten Abbildung im Panel ein
          eigenes <code>overflow-x: auto</code>. Was der Aufrufer tun muss: nichts weiter, wenn die Demo der Vorlage
          folgt — der Host misst sich selbst.
        </p>
        <p class="src-note">
          Der Umbruch aus den Grid-Regeln der Vorlage, die Button-Reihe aus ihren
          <code>.control-buttons</code>-Regeln; die 640px-Regel aus der Utility <code>btn-mobile-full</code>
          in <code>src/styles.scss</code>; das Abschneiden aus <code>.content-clip</code> in
          <code>src/app/components/shared/standard-container.component.ts</code>.
        </p>

        <h3>Die Layout-API, die ungenutzt ausgeliefert wurde — jetzt gelöscht</h3>
        <p>
          Eine Falle war es wert, benannt zu werden, weil ihr Name genau zu diesem Muster passte: Das Kit
          deklarierte einen Helfer <code>demo-layout()</code> und drei Verhältnis-Token, und nichts unter
          <code>src/</code> rief je eines davon auf. Sie beschrieben eine Viewport-gesteuerte Flex-Aufteilung, die
          keine ausgelieferte Demo nutzt, deshalb wurden sie am 20.08.2026 gelöscht. Wenn du ihnen in älterem
          Material begegnest: Das ausgelieferte Muster ist die Container-Query auf dem Demo-Host, nie dieses Mixin.
        </p>
        <pre class="code-block"><code>{{ deadApiSnippet }}</code></pre>
        <p class="src-note">
          Frühere Deklarationsstelle: <code>src/styles/design-tokens.scss</code>, die jetzt den Löschvermerk trägt.
          Aufrufstellen: keine unter <code>src/</code>, weder vorher noch seitdem.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Eine Demo ist eine Seitenkomponente plus zwei Registrierungen für ihre URL. Die Komponente ist die
          interessante Hälfte; die Registrierungen sind eine Checkliste.
        </p>

        <h3>Der interaktive Kern als Rezept</h3>
        <p class="src-note">
          Form und Deklarationen folgen der Vorlage,
          <code>src/app/pages/example-demo/example-demo.component.ts</code>; die Buttons folgen der Utility
          <code>btn-mobile-full</code> in <code>src/styles.scss</code>.
        </p>
        <pre class="code-block"><code>{{ widgetSnippet }}</code></pre>
        <p>
          Zwei Dinge darin sind Struktur und keine Geschmackssache. Der Host ist der Query-Container, und das Grid
          ist sein Nachfahre — eine Container-Query trifft nie das Element, das <code>container-type</code>
          deklariert, also lässt ein Verschieben auf das Grid der Regel nichts zum Messen. Und die Live-Region ist
          ein einzelner, immer gerenderter Knoten im Panel, dessen Text sich ändert; eine Region, die zusammen mit
          ihrer Meldung eingefügt wird, wird oft nicht angesagt.
        </p>

        <h3>Prüfen ohne Browser</h3>
        <pre class="code-block"><code>{{ checkSnippet }}</code></pre>
        <p>
          Die ersten beiden beantworten die Fragen, die zur Laufzeit keinen Fehler werfen: ob der Wechsel den
          Container oder das Fenster fragt, und ob die Demo, die die Route ausliefert, die Demo ist, die der Hub
          kennt. Die dritte ist die Wiederverwendungsfrage — ein Bedienelement, das du gerade von Hand bauen willst,
          ist vielleicht schon dokumentiert, und <strong>UI-Muster wählen</strong> ist der Ort, an den diese
          Entscheidung gehört.
        </p>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>☐ Der Komponenten-Host deklariert <code>container-type: inline-size</code>.</li>
          <li>☐ Die Bühne steht im Dokument vor dem Panel; nirgends eine <code>order</code>-Eigenschaft.</li>
          <li>☐ Der Spaltenwechsel ist eine <code>&#64;container</code>-Regel, keine Media-Query.</li>
          <li>☐ Der Canvas ist <code>role=&quot;img&quot;</code> mit übersetztem Namen und einer
            Textzusammenfassung für Forced Colors.</li>
          <li>☐ Das Panel enthält eine <code>sr-only</code>-Live-Region, die nur bei abgeschlossenen Änderungen
            beschrieben wird.</li>
          <li>☐ Ein Reset-Bedienelement, beschriftet mit dem, was es wiederherstellt.</li>
          <li>☐ Keine komponentenlokale <code>.sr-only</code>-Regel.</li>
          <li>☐ Bei 320px wird nichts am Container-Rand abgeschnitten.</li>
          <li>☐ Eine geroutete Demo steht sowohl in der Routendatei als auch in der Demo-Registry, mit demselben
            Pfad.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Eine Demo übersetzt nichts für dich. Jeder String darin — Titel, Einleitung, Beschriftungen der
          Bedienelemente, der Name des Canvas, die Ansagen, die niemand sieht — ist einer, den die Seite selbst
          auflöst.
        </p>

        <h3>Ein Namespace, eine Methode</h3>
        <p>
          Die Vorlage deklariert eine Methode <code>translate(key)</code>, die an den Übersetzungsdienst
          weiterreicht, und jeder Key, den sie liest, liegt im eigenen Namespace der Demo. Ansagen und die
          Zusammenfassung für Forced Colors werden genauso gebaut, mit Platzhaltern, die nach der Übersetzung
          ersetzt werden, sodass ein Übersetzer den ganzen Satz sieht.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Die Methode, der Namespace und das Ersetzen der Platzhalter aus
          <code>src/app/pages/example-demo/example-demo.component.ts</code>; die in Artikel eingebetteten Widgets
          unter <code>src/app/components/didactic/</code> lesen ihren eigenen Namespace auf dieselbe Weise.
        </p>

        <h3>Welche Strings dem Layout nicht gehören</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Kommt aus</th><th>Reagiert auf einen Sprachwechsel</th></tr>
            </thead>
            <tbody>
              <tr><td>Titel, Einleitung, Beschriftungen der Bedienelemente</td><td>Deinen Keys, über die Methode</td><td>Beim nächsten Check, wenn im Template aufgelöst statt in einem Feld zwischengespeichert</td></tr>
              <tr><td>Der Name des Canvas und die Zusammenfassung für Forced Colors</td><td>Deinen Keys, als Attribute gebunden</td><td>Genauso — es sind Template-Bindings wie alle anderen</td></tr>
              <tr><td>Ansagen der Live-Region</td><td>Deinen Keys, aufgelöst, als die Aktion lief</td><td>Nein — erst, wenn die Aktion wieder läuft</td></tr>
              <tr><td>Titel und Beschreibung der Hub-Kachel</td><td>Keys im Registry-Eintrag der Demo</td><td>Ja</td></tr>
              <tr><td>Geschätzte Dauer</td><td>Dem Registry-Eintrag, so ausgegeben, wie er dasteht</td><td>Nein — sie ist ein Literal, samt Einheit</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Key-Felder und ihr literales <code>estimatedTime</code> aus dem Interface
          <code>DemoMeta</code> in <code>src/app/services/demos.service.ts</code>; der Zeitpunkt der Ansagen aus den
          Aktions-Handlern der Vorlage.
        </p>

        <h3>Wo längerer Text drückt</h3>
        <p>
          Die Bühne ist sicher — sie enthält Geometrie, keine Sätze. Der Druck liegt ganz im Panel, und die
          Untergrenze setzt das Budget: Bei zwei Spalten bricht eine Beschriftung, die über die Panel-Untergrenze
          von 15rem hinauswächst, in eine zweite Zeile um und schiebt jedes Bedienelement darunter nach unten. Das
          Panel hat keine Obergrenze, also wächst das Budget auf einer breiten Seite nur; eine Button-Beschriftung
          hat am wenigsten Platz, weil die Button-Reihe bei 8rem je Button umbricht. Ein Satz in der Live-Region hat
          überhaupt kein visuelles Budget und darf so lang sein, wie er sein muss. Behandle die Beschriftungen von
          Buttons und Slidern als das strenge Budget, und halte den Einleitungssatz bei einem Gedanken statt bei
          einer Textzeile. Key-Benennung, Namespaces und die Varianten in Einfacher Sprache stehen in
          <strong>I18n &amp; Lokalisierung</strong>.
        </p>
        <p class="src-note">
          Panel-Untergrenze aus dem Wert von <code>grid-template-columns</code> in der
          <code>&#64;container</code>-Regel der Vorlage; die Button-Basis aus ihren
          <code>.control-buttons</code>-Regeln.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.6</strong> — 23.09.2026 — Auf das umgestellt, was ausgeliefert wird: Die selbst gerahmten
            Widget-Karten, die dieser Guide beschrieb, wurden aus dem Kit entfernt, also folgt der Vertrag jetzt der
            Vorlagen-Seite (<code>example-demo</code>) — der Komponenten-Host als Größen-Container, eine Schwelle von
            700px, ein Panel, dessen Grund nicht von der Abfrage abhängt, ein <code>h2</code>-Abschnitt statt eines
            festen <code>h3</code>-Headers, und die Live-Region muss das Panel nicht mehr eröffnen. Kontrasttabelle
            je visuellem Stil neu aus dem Kompilat zitiert (ADR-0016); Aussage zum schmalen Bildschirm, Rezept,
            i18n-Methode und Zusammenfassung passend neu geschrieben; kommentierte Quellen schließen den Tab
            Verwendung ab.</li>
          <li><strong>v0.5</strong> — 02.09.2026 — Erneut geprüft auf Angular 22.1.4 / Optimus UI 2.0.2 (ADR-0014): Das <code>styleClass</code> des Snippets an <code>p-button</code> kommt weiterhin an — Optimus behält es als veralteten Input, der den Host erreicht; Pin auf 22.1.4 angehoben, nichts, was dieser Guide misst, hat sich geändert.</li>
          <li><strong>v0.4</strong> — 24.08.2026 — Nach dem Upgrade auf Angular 22.1.3 / PrimeNG 22.1 erneut
            geprüft. Eine Prüfung zählte: Das <code>styleClass</code> des Snippets an <code>p-button</code>
            übersteht v22 — die Button-Komponente behielt diesen Input, während der Großteil der Bibliothek ihn
            verlor. Der Rahmen selbst gehört dem Kit und ist unverändert; Herkunfts-Pin angehoben.</li>
          <li><strong>v0.3</strong> — 20.08.2026 — Das Kit hat zwei Regeln dieses Guides eingeholt: Die
            wirkungslosen komponentenlokalen <code>.sr-only</code>-Kopien wurden in der ganzen App gelöscht, und
            der Spaltenwechsel der Vorlagen-Seite wurde eine Container-Query (er war älter als die Regel und schaltete
            nach dem Viewport um). Die ungenutzte API
            <code>demo-layout()</code>/<code>--layout-demo-*</code> wurde aus der Token-Datei gelöscht; der
            Abschnitt im Tab Design hält sie jetzt als Geschichte fest. Der Release-Guard warnt im Dev-Modus, wenn
            eine Demo-Route keinen Registry-Eintrag hat. Die Vorlagen-Seite bindet jetzt
            <code>app-demo-related</code> ein, also hat der Fußbereich mit verwandten Inhalten ein lebendes
            Beispiel.</li>
          <li><strong>v0.2</strong> — 19.08.2026 — Kontrastwerte nach den Token-Entscheidungen der Grundlagen aus
            dem neu erzeugten Kompilat aktualisiert: Sekundärtext jetzt 4,83/4,59:1 im hellen Modus (neu abgestuft
            auf <code>#6b7280</code>), und das <code>--surface-border</code> des Bühnenrahmens ist seit der
            Aufteilung in <code>--control-border</code> seiner Rolle nach dekorativ statt einer erklärten
            Ausnahme.</li>
          <li><strong>v0.1</strong> — 18.08.2026 — Erster Guide: die Demo-Karte und ihre drei Teile in
            Dokumentreihenfolge, die zwei Formen, in denen eine Demo ausgeliefert wird, der Spaltenwechsel als
            Abfrage auf der Karte statt auf dem Viewport, das Panel, das seinen Grund erst bei zwei Spalten bekommt,
            die zwei Hintergründe mit ihren gemessenen Textpaaren, der Layout-Helfer, der ohne Aufrufstelle
            ausgeliefert wird, die zwei Registrierungen, die eine geroutete Demo braucht, und die Beschriftungen der
            Bedienelemente als strenges Übersetzungsbudget des Layouts.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class DemoLayoutArticleDeComponent extends DemoLayoutArticleComponent {}
