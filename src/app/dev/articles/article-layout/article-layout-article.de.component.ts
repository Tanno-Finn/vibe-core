import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArticleLayoutArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './article-layout-article.component';

/**
 * German twin of the Article Layout guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers and code snippets
 * are shared; only the template and the visible panel rows in `stRows` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs article-layout`).
 */
@Component({
  selector: 'app-article-layout-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'article-layout'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Eine Artikelseite in diesem Kit ist eine Komponente, die um deinen Body-Text gelegt wird. Was dieser
          Wrapper schon rendert, ist genau der Teil, den die meisten neuen Seiten aus Versehen nachbauen &mdash;
          deshalb lohnt sich ein Blick darauf, bevor du die erste Zeile Markup schreibst.
        </p>

        <h3>Die Seite, in der Reihenfolge, in der sie rendert</h3>
        <p>
          Alles im äußeren Band kommt von
          <code>&lt;app-lesson-template&gt;</code>, ob du es anforderst oder nicht, und zwar in der Reihenfolge, in der
          das Template es ins Dokument schreibt. Das innere Band ist der Projektions-Slot &mdash; der
          einzige Teil, den ein Seitenautor schreibt.
        </p>
        <div class="skel">
          <div class="skel__band skel__band--frame">
            <span class="skel__cap">Template</span>
            <div class="skel__row">Seiten-Header &mdash; die eine h1, Untertitel, Badges</div>
            <div class="skel__row">Toolbar &mdash; Zurück &middot; Kategorie, Lesezeit, Schwierigkeit &middot; Teilen</div>
            <div class="skel__row">Fortschrittsbalken &mdash; role=&quot;progressbar&quot;, oben im Viewport gezeichnet</div>
            <div class="skel__row skel__row--muted">FAB-Registrierungen &mdash; Inhaltsverzeichnis, Leichte Sprache</div>

            <div class="skel__band skel__band--body">
              <span class="skel__cap">dein Body</span>
              <div class="skel__row">Lead &mdash; einleitende Absätze, ohne eigene Überschrift</div>
              <div class="skel__row">Themenabschnitte &mdash; eine id, eine h2, die Blöcke</div>
              <div class="skel__row">der interaktive Abschnitt</div>
              <div class="skel__row">Takeaways &rarr; Quiz &rarr; Checkpoint</div>
            </div>

            <div class="skel__row skel__row--muted">verwandte Tools &middot; Ressourcen &middot; zitierte Quellen</div>
            <div class="skel__row skel__row--muted">verwandte Inhalte &mdash; aufgelöst aus dem Artikel-JSON</div>
          </div>
        </div>
        <p>
          Eine Zeile steht nicht dort, wo sie zu stehen scheint. Der Fortschrittsbalken ist
          <code>position: fixed; top: 0</code>, er wird also über dem Header gezeichnet, obwohl er nach der
          Toolbar rendert. Die Reihenfolge oben ist die Dokumentreihenfolge &mdash; ihr folgt die Lesereihenfolge,
          und sie müsste eine Seite nachbilden, die den Rahmen selbst nachbaut.
        </p>
        <p class="src-note">
          Dokumentreihenfolge, die feste Platzierung des Fortschrittsbalkens, der Projektions-Slot und die vier
          angehängten Footer gelesen aus
          <code>src/app/components/shared/lesson-template.component.ts</code>; die Footer werden
          aus <code>src/assets/data/core/articles/</code> gespeist und erscheinen nur, wenn diese Datei
          etwas nennt.
        </p>

        <h3>Ein Block bringt seine eigene Überschrift mit</h3>
        <p>
          Zweimal derselbe Container, nur in der angeforderten Ebene verschieden. Nichts hier ist
          ein handgeschriebenes Tag: Die Zahl ist ein Input, und der Block gibt sie aus. Beide stehen auf
          4 und 5, damit die Gliederung dieser Seite intakt bleibt.
        </p>
        <div class="stage stage--stack">
          <app-standard-container
            [config]="{ type: 'info', title: 'Bereitstellungsbereich', headingLevel: 4 }">
            <p class="m0">
              Mit Ebene 4 angefordert, rendert dieser Titel als h4. Akzent, Icon und
              optionales Einklappen kommen mit.
            </p>
          </app-standard-container>

          <app-standard-container
            [config]="{ type: 'warning', title: 'Bereitstellungsbereich', headingLevel: 5 }">
            <p class="m0">
              Mit Ebene 5 angefordert, rendert derselbe Block eine h5. Ihn zu platzieren ist deshalb eine
              Strukturentscheidung, keine Stilfrage.
            </p>
          </app-standard-container>
        </div>
        <p class="src-note">
          Varianten, Steuerung der Überschrift und Einklappverhalten aus
          <code>src/assets/design-system/standard-container.md</code> und der Komponente, die es
          dokumentiert, <code>src/app/components/shared/standard-container.component.ts</code>.
        </p>

        <h3>Zurück an den Anfang eines Panels, nicht der Seite</h3>
        <p>
          Die Seite hat ihr Nach-oben-Element schon: den schwebenden Button der Shell, unten rechts, sobald du
          weit genug gescrollt hast. <code>&lt;p-scrolltop target="parent"&gt;</code> ist für eine Box mit eigenem Scrollen.
          Scroll im Panel unten: Nach {{ stThreshold }}px erscheint der Button, angeheftet an die Unterkante des
          Panels; drück ihn, und das Panel springt an seinen Anfang zurück, während der Fokus auf die Überschrift des Panels wandert.
        </p>
        <div class="st-panel" role="region" aria-labelledby="st-panel-title" tabindex="0">
          <h4 id="st-panel-title" class="st-panel__title" tabindex="-1" #stTitle>Versionshinweise (Auszug)</h4>
          @for (row of stRows; track row) {
            <p class="st-panel__row">{{ row }}</p>
          }
          <p-scrolltop
            target="parent"
            [threshold]="stThreshold"
            [behavior]="stBehavior()"
            icon="pi pi-arrow-up"
            buttonAriaLabel="Zurück zum Anfang der Versionshinweise"
            (click)="stTitle.focus({ preventScroll: true })"
          />
        </div>
        <p class="src-note">
          Inputs und Verhalten aus <code>openng-optimus-ui-scrolltop.mjs</code> (<code>:79-131</code>, der Klick in
          <code>:168-174</code>); das Scrollverhalten kommt aus <code>src/app/utils/reduced-motion.ts</code>, daher
          ist der Sprung bei reduzierter Bewegung sofort. Das Panel ist fokussierbar, damit eine Tastatur es scrollen kann.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Zwei Verträge entscheiden, ob eine neue Seite funktioniert: was das Template von dir braucht, und
          was dein Body dem Inhaltsverzeichnis schuldet. Beide scheitern still, wenn sie gebrochen werden.
        </p>

        <h3>Die Regionen, in Dokumentreihenfolge</h3>
        <p>
          Dokumentreihenfolge, nicht die Reihenfolge auf dem Bildschirm: Der Fortschrittsbalken ist am Viewport fixiert und wird
          über dem Header gezeichnet, obwohl das Template ihn nach der Toolbar schreibt.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Region</th><th>Was sie ist</th><th>Wer sie schreibt</th></tr>
            </thead>
            <tbody>
              <tr><td>Seiten-Header</td><td>Die <code>h1</code> der Seite, der Untertitel, die Badges für Entwurf und geplante Veröffentlichung</td><td>Template, aus <code>meta</code></td></tr>
              <tr><td>Toolbar</td><td>Zurück-Link, die Meta-Chips, Kopieren/Teilen/Drucken</td><td>Template, aus <code>meta</code></td></tr>
              <tr><td>Lesefortschritt</td><td>Ein 4px-Balken mit <code>role=&quot;progressbar&quot;</code>, gesteuert von der Scrollposition und oben am Viewport fixiert</td><td>Template</td></tr>
              <tr><td>Schwebende Buttons</td><td>Inhaltsverzeichnis und Leichte Sprache, eingetragen in den gemeinsamen FAB-Stapel</td><td>Template &mdash; der eine aus <code>tocItems</code>, der andere danach, ob es für diese id eine vereinfachte Fassung gibt</td></tr>
              <tr><td>Body</td><td>Alles zwischen dem Rahmen und den Footern</td><td class="td-you">Du</td></tr>
              <tr><td>Referenz-Footer</td><td>Verwandte Tools, verwandte Ressourcen, zitierte Quellen</td><td>Template, aus dem Artikel-JSON</td></tr>
              <tr><td>Verwandte Inhalte</td><td>Redaktionelle und über den Graphen aufgelöste Links für diese Artikel-id</td><td>Template, aus dem Artikel-JSON</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Reihenfolge und Zuständigkeit gelesen aus
          <code>src/app/components/shared/lesson-template.component.ts</code>; die Footer-Quellen
          aus den Dateien je Artikel unter <code>src/assets/data/core/articles/</code>.
        </p>

        <h3>Was das Template von dir braucht</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Pflicht</th><th>Was es steuert</th></tr>
            </thead>
            <tbody>
              <tr><td><code>meta</code></td><td>Ja</td><td>Fehlt es, rendert das Template seinen Ladezustand und sonst nichts</td></tr>
              <tr><td><code>meta.id</code></td><td>Ja</td><td>Muss der Artikel-id im Core-JSON gleichen &mdash; die Footer, der Button für Leichte Sprache und die FAB-Keys lösen alle darüber auf</td></tr>
              <tr><td><code>meta.titleKey</code></td><td>Ja</td><td>Die <code>h1</code> und der Text, der beim Teilen der Seite verwendet wird. <code>title</code> ist ein eigenes optionales Feld, der statische Fallback für einen Key, der nicht auflöst</td></tr>
              <tr><td><code>meta.readingTime</code></td><td>Ja</td><td>Ein Meta-Chip, wörtlich ausgegeben</td></tr>
              <tr><td><code>meta.difficultyKey</code></td><td>Ja</td><td>Ein Meta-Chip, übersetzt</td></tr>
              <tr><td><code>meta.difficulty</code></td><td>Ja</td><td><strong>Nichts.</strong> Das eine Feld, das Pflicht ist und nie gelesen wird &mdash; der Chip daneben kommt aus <code>difficultyKey</code>. Gib ihm einen Wert, den der Typ akzeptiert, und mach weiter</td></tr>
              <tr><td><code>meta.focus</code></td><td>Ja</td><td>Welcher Inhaltstyp für Leichte Sprache nachgeschlagen wird: <code>theory</code> fragt nach einem Artikel, <code>practice</code> nach einer Seite</td></tr>
              <tr><td><code>meta.categoryKey</code></td><td>Nein</td><td>Der akzentuierte Kategorie-Chip. Das separate Feld <code>category</code> ist optional und ebenso ungelesen</td></tr>
              <tr><td><code>meta.subtitleKey</code>, <code>chapters</code>, <code>publishDate</code>, <code>draft</code>, <code>scheduledFor</code></td><td>Nein</td><td>Jedes fügt dem Header oder der Toolbar ein Element hinzu und fehlt sonst</td></tr>
              <tr><td><code>tocItems</code></td><td>Nein, aber einmal</td><td>Ein bis zu deinem eigenen <code>ngOnInit</code> nicht leeres Array registriert den Button; die Prüfung wird nicht wiederholt</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Feldnamen und ihre Wirkung aus dem Interface <code>LessonMeta</code> und dem
          Template, das es verarbeitet,
          <code>src/app/components/shared/lesson-template.component.ts</code>; die Pflichtmenge ist
          die, die das Interface ohne <code>?</code> deklariert.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; ein zweites Dokument öffnen</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;article&gt;&lt;h1&gt;Version control&lt;/h1&gt; … &lt;/article&gt;</code>
            </div>
            <p class="dd__why">
              Das Template hat die Region schon geöffnet und die Seitenüberschrift aus
              <code>meta</code> gerendert. Eine zweite hinterlässt die Seite mit zwei Überschriften auf oberster Ebene und einer
              Artikel-Region in einer anderen verschachtelt &mdash; so bieten die Navigation per Überschrift und die per Region
              beide eine Auswahl, die nichts bedeutet.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; auf der zweiten Ebene beginnen</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;section id="repository" class="article-section"&gt;&lt;h2&gt;…&lt;/h2&gt;</code>
            </div>
            <p class="dd__why">
              Dein Body beginnt unter einer vorhandenen <code>h1</code>, also sind seine eigenen Abschnitte Ebene 2
              und die Blöcke darin stehen auf 3. Die id ist das, wohin das Inhaltsverzeichnis springt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; eine id nennen, die nichts trägt</span>
            <div class="dd__stage">
              <code class="dd__code">&#123; id: 'deep-dive', label: t('article.toc.deepDive') &#125;</code>
            </div>
            <p class="dd__why">
              Navigation ist ein Nachschlagen per id, gefolgt von einem Scrollen. Geht das Nachschlagen ins Leere, gibt es
              keinen Fehler, keinen Fallback und keine sichtbare Änderung: Der Eintrag bleibt in der Liste und tut
              nichts, wenn man ihn drückt &mdash; schlimmer, als ihn gar nicht anzubieten.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; die Liste aus den gerenderten ids ableiten</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;section id="deep-dive"&gt; … &#123; id: 'deep-dive', label: … &#125;</code>
            </div>
            <p class="dd__why">
              Eine id, zweimal geschrieben, im Gleichschritt. Ein Abschnitt, den du bewusst aus der Liste lässt, ist
              in Ordnung &mdash; ein Exkurs, den der Leser überspringen darf, braucht kein Sprungziel. Ein Eintrag
              ohne Abschnitt ist es nie.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; einen breiten Block selbst seinen Weg nach draußen suchen lassen</span>
            <div class="dd__stage">
              <code class="dd__code">&lt;pre&gt;git commit --amend --no-edit --author="…"&lt;/pre&gt;</code>
            </div>
            <p class="dd__why">
              Die Artikelspalte schneidet horizontalen Überlauf ab, statt ihn zu scrollen, und das
              Abschneiden ist still: Auf einem Handy ist das Zeilenende einfach nicht da, und keine
              Scrollleiste und keine Wischgeste holt es zurück.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; ihm einen eigenen Scroller geben</span>
            <div class="dd__stage">
              <code class="dd__code">pre &#123; overflow-x: auto; white-space: pre; &#125;</code>
            </div>
            <p class="dd__why">
              Eine Regel je breitem Block &mdash; Code, eine Tabelle, ein Diagramm mit fester Breite &mdash; hält
              den Überlauf im Block, wo der Leser ihn erreicht. Eine Tabelle kann stattdessen auch
              einen Wrapper bekommen, der scrollt.
            </p>
          </div>
        </div>

        <h3>Quellen für diesen Tab</h3>
        <p class="src-note">
          Reihenfolge der Regionen, die Pflicht-Inputs und die einmalige FAB-Registrierung aus
          <code>src/app/components/shared/lesson-template.component.ts</code>; der Sprungmechanismus
          aus <code>src/app/components/shared/table-of-contents-fab.component.ts</code>; das
          Abschneiden ist der Wert <code>hidden</code> der CSS-Eigenschaft overflow, zitiert
          im Agent-Doc.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Layout hat zwei Bänder und eine Spalte. Fast jedes Maß, das ein Seitenautor
          gern nehmen würde, hat das Template-Stylesheet schon genommen.
        </p>

        <h3>Die Spalte</h3>
        <p>
          Der Artikel-Container ist zentriert, auf das Breiten-Token
          <code>--container-section</code> begrenzt und an beiden Seiten gepolstert. Er setzt außerdem
          <code>overflow-x: hidden</code>, die folgenreichste einzelne Zeile im
          Layout: Ein Kind, das breiter als die Spalte ist, wird an der Padding-Box abgeschnitten, und der User Agent
          darf dafür keine Scrollmöglichkeit anbieten. Deshalb bringt jeder breite Block
          seinen eigenen Scroller mit. Welche Breiten die Token-Skala bietet und was ein Token überhaupt enthalten darf,
          gehört zu <strong>Design-Tokens</strong>.
        </p>
        <p class="src-note">
          Breite, Padding und die Overflow-Regel aus dem
          Block <code>.lesson-container</code> in
          <code>src/app/components/shared/lesson-template.component.ts</code>; der Token-Wert
          wird aus der Container-Map in <code>src/styles/design-tokens.scss</code> ausgegeben.
        </p>

        <h3>Welcher Block welche Überschrift ausgibt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Block</th><th>Ausgegebene Überschrift</th><th>Gewählt durch</th></tr>
            </thead>
            <tbody>
              <tr><td><code>app-page-header</code></td><td><code>h1</code></td><td>Fest &mdash; das Template rendert sie einmal</td></tr>
              <tr><td><code>app-standard-container</code></td><td><code>h1</code>&ndash;<code>h6</code></td><td><code>config.headingLevel</code>, Standard 3</td></tr>
              <tr><td><code>app-definition</code></td><td><code>h2</code>&ndash;<code>h6</code> für den Titel, dazu eine feste <code>h3</code> über jedem Beispiel und jeder Option nur für den Druck</td><td>Input <code>headingLevel</code>, Standard 3 &mdash; es verschiebt nur den Titel, eine mit 4 oder 5 angeforderte Definition setzt also eine <code>h3</code> darunter</td></tr>
              <tr><td><code>app-checkpoint</code></td><td><code>h2</code>&ndash;<code>h6</code></td><td>Input <code>headingLevel</code>, Standard 3</td></tr>
              <tr><td><code>app-text-container</code></td><td><code>h2</code></td><td>Fest &mdash; es gibt seinem umschlossenen Container Ebene 2</td></tr>
              <tr><td><code>app-quiz-container</code></td><td><code>h3</code>, dazu eine <code>h2</code>, sobald es ein Ergebnis zeigt</td><td>Fest &mdash; es übergibt keine Ebene, also gilt der Standard des Containers</td></tr>
              <tr><td><code>app-example-box</code></td><td>keine</td><td>Sein Titel ist ein gestyltes <code>div</code> und gehört zu keiner Gliederung</td></tr>
              <tr><td><code>app-comparison</code>, <code>app-step-indicator</code>, <code>app-stat-card</code>, <code>app-takeaways-list</code></td><td>keine</td><td>Sie tragen Beschriftungen, keine Überschriften</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus jeder Komponente unter <code>src/app/components/shared/</code> und
          <code>src/app/components/didactic/</code>: der Überschriften-Zweig im Template, der
          deklarierte Standard des Ebenen-Inputs und jedes Überschriften-Tag, das das Template außerhalb
          dieses Zweigs schreibt.
        </p>

        <h3>Zwei Wege zur Gliederung, eine Regel</h3>
        <p>
          Entweder gehört die Überschrift dem Abschnitt, und die Blöcke bleiben auf ihrem Standard &mdash;
          <code>&lt;section&gt;</code> plus deine eigene <code>h2</code>, Container auf 3 &mdash; oder
          sie gehört dem Block, und es gibt gar kein section-Element: Setz die id auf den Block, fordere
          Ebene 2 an, und sein Titel wird zur Abschnittsüberschrift. Beide geben einer Seite eine
          <code>h1</code> und keine Lücke in den Ebenen darunter. Die Lücke entsteht, wenn ein Block auf
          seinem Standard 3 bleibt, ohne irgendeine Überschrift der Ebene 2 darüber &mdash; genau das passiert,
          wenn eine auf die zweite Art gebaute Seite einen Block bekommt, dessen Ebene niemand gesetzt hat. Die Schriftskala,
          die diese Ebenen rendert, ist
          <strong>Typografie</strong>; die programmatische Struktur, für die sie stehen, ist das Gebiet von
          <strong>Richtlinien zur Barrierefreiheit</strong>.
        </p>
        <p class="src-note">
          Beide Muster werden ausgeliefert: das mit Abschnitten in den ausgearbeiteten Artikelseiten unter
          <code>src/app/pages/articles/</code>, das mit Block-Titeln in der Vorlagenseite
          <code>src/app/pages/articles/seed-article-1/seed-article-1.component.ts</code>.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Das Layout gibt dem Body <strong>gar keinen Breakpoint</strong>: Er ist bei jeder Breite eine Spalte
          und wird nur so schmal, wie das Padding seines Containers es wird. Jede Stufe, die
          gratis kommt, steckt im Rahmen, und es ist eine Leiter mit vier Stufen.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Unter</th><th>Was sich ändert</th></tr>
            </thead>
            <tbody>
              <tr><td>1024px</td><td>Die Meta-Chips verlassen die Toolbar-Zeile und stehen zentriert in einer eigenen Zeile</td></tr>
              <tr><td>768px</td><td>Die Toolbar stapelt sich in Zurück, Meta, Teilen; der Zurück-Button wird volle Breite, und das Padding der Spalte wird neu geschrieben statt verringert &mdash; die Seiten werden schmaler, oben wächst es</td></tr>
              <tr><td>480px</td><td>Die Teilen-Buttons schrumpfen von 44 auf 40px, die Meta-Chips geben eine Stufe Padding und etwas Schriftgröße ab, die Footer-Raster fallen auf eine Spalte mit gestapelten Link-Paaren, und das Inhaltsverzeichnis-Panel wird auf den Viewport begrenzt</td></tr>
              <tr><td>380px / 360px</td><td>Die Chips verlieren erneut Padding; bei 360px bricht ihr Text nicht mehr um und wird an der Kante des Chips mit Auslassungspunkten gekürzt</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Jeder Breakpoint oben ist eine Media Query in
          <code>src/app/components/shared/lesson-template.component.ts</code>, außer der Begrenzung des
          Panels, die in
          <code>src/app/components/shared/table-of-contents-fab.component.ts</code> steht.
        </p>
        <p>
          Layout-Leitlinie für den Body: Geh von der Spalte aus und von nichts sonst. Ein Grid, das du einführst,
          fällt nur zusammen, wenn du diese Regel selbst schreibst, und ein Kind mit fester Breite schrumpft nicht,
          bricht nicht um und scrollt nicht &mdash; es wird an der Spaltenkante abgeschnitten. Gib also einem mehrspaltigen Grid eine
          einspaltige Regel bei der Breite, bei der seine Karten nicht mehr passen, gib jedem breiten Block
          <code>overflow-x: auto</code>, und prüf die Seite bei 360px, bevor du irgendetwas stylst,
          denn dort hört ein Block, der nicht passt, auf, eine Stilfrage zu sein. Die
          Mindestgröße der Bedienelemente, die der Rahmen rendert, ist Gebiet von
          <strong>Richtlinien zur Barrierefreiheit</strong>, nicht von diesem Guide.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Eine neue Artikelseite besteht aus drei Dateien, die sich auf eine id einigen müssen. Nichts erzwingt diese
          Einigung beim Build, deshalb ist sie das Erste, was du prüfst.
        </p>

        <h3>Die drei Dateien und die id, die sie verbindet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Datei</th><th>Trägt</th><th>Bricht still, wenn falsch</th></tr>
            </thead>
            <tbody>
              <tr><td>Die Komponente unter <code>src/app/pages/articles/</code></td><td>Den Body, <code>meta</code>, <code>tocItems</code></td><td>Nein &mdash; ein fehlendes <code>meta</code> ist als Ladezustand sichtbar</td></tr>
              <tr><td>Die Route in <code>src/app/app.routes.ts</code></td><td>Den Pfad, den Key für den Navigationstitel, die kurze Seiten-id für Druck- und QR-Links</td><td>Nein &mdash; die Seite ist einfach nicht erreichbar</td></tr>
              <tr><td>Der Eintrag unter <code>src/assets/data/core/articles/</code></td><td>Verwandte Links, zitierte Quellen, Verweise auf Tools und Ressourcen</td><td>Ja &mdash; eine abweichende id lässt alle vier Footer ohne Meldung wegfallen</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Vorlage verbindet alle drei unter einer id und sagt das in ihrem eigenen Kopfkommentar:
          <code>src/app/pages/articles/seed-article-1/seed-article-1.component.ts</code> mit ihrer
          Route und ihrem Eintrag in <code>src/assets/data/core/articles/</code>.
        </p>

        <h3>Die kleinste vollständige Seite</h3>
        <pre class="code-block"><code>{{ pageSnippet }}</code></pre>
        <p>
          Zwei Dinge darin sind Timing, nicht Geschmack. <code>tocItems</code> muss befüllt sein, bis
          das Template <code>ngAfterViewInit</code> erreicht, denn dort wird der
          schwebende Button registriert, und das Array wird nie wieder angesehen &mdash; es danach
          aus einer aufgelösten Anfrage zu füllen, lässt die Seite ganz ohne Inhaltsverzeichnis. Und
          die Labels sind Strings statt Keys, sie müssen also neu gebaut werden, wenn die Sprache
          wechselt; der Tab <code>i18n</code> zeigt beide ausgelieferten Wege dafür.
        </p>
        <p class="src-note">
          Registrierungspunkt und seine einmalige Sperre aus dem
          <code>ngAfterViewInit</code> von
          <code>src/app/components/shared/lesson-template.component.ts</code>.
        </p>

        <h3>Nach oben: der Button des Kits oder <code>p-scrolltop</code></h3>
        <p>
          Ein Artikel braucht kein eigenes Nach-oben-Element. Die App-Shell bindet
          <code>app-scroll-to-top-fab</code> einmal ein, über jeder Route, und es trägt sich selbst in den Stapel der
          schwebenden Buttons ein. <code>p-scrolltop</code> beantwortet eine andere Frage — ein Panel in der Seite, das
          selbst scrollt — und ist in dieser Rolle erst sicher, wenn drei seiner Standards überschrieben sind.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th></th><th><code>app-scroll-to-top-fab</code> (Kit)</th><th><code>&lt;p-scrolltop&gt;</code> (Optimus UI)</th></tr>
            </thead>
            <tbody>
              <tr><td>Scrollt</td><td>Das Fenster</td><td>Das Fenster (<code>target="window"</code>, Standard) oder sein Elternelement (<code>target="parent"</code>)</td></tr>
              <tr><td>Wo es sitzt</td><td>Im Stapel der schwebenden Buttons, unten rechts, über dem Cookie-Banner</td><td>Fest unten rechts für das Fenster, über dem Kit-Stapel; sticky an der Unterkante des Elternelements für ein Panel</td></tr>
              <tr><td>Erscheint nach</td><td>1.000 px (<code>showAfterScroll</code>)</td><td>400 px (<code>threshold</code>)</td></tr>
              <tr><td>Barrierefreier Name</td><td>Der Key <code>textContainer.backToTop</code>, in allen vier Sprachen</td><td><code>buttonAriaLabel</code> &mdash; ohne Standard, ein nicht gesetzter hinterlässt also einen namenlosen Icon-Button</td></tr>
              <tr><td>Reduzierte Bewegung</td><td>Sofortiger Sprung: Verhalten aus <code>scrollBehavior()</code></td><td>Standardmäßig <code>behavior="smooth"</code>; eine explizite Option, die die CSS-Generalregel nicht überschreiben kann</td></tr>
              <tr><td>Wer es platziert</td><td>Die Shell &mdash; eine Seite fügt nichts hinzu</td><td>Du, als letztes Kind des scrollenden Panels</td></tr>
              <tr><td>Fokus nach dem Sprung</td><td>Wandert vor dem Scrollen zur Main-Landmark (<code>preventScroll</code>), wenn der Button den Fokus hatte</td><td>Fällt auf den Body des Dokuments, wenn der Button verschwindet &mdash; ihn weiterzugeben ist deine Sache</td></tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ scrollTopSnippet }}</code></pre>
        <p>
          Eine Lücke lässt die Bibliothek offen: den Fokus. <code>p-scrolltop</code> entfernt seinen Button, sobald das Panel wieder
          oben ist, und der Browser lässt den Fokus mit ihm auf den Body des Dokuments fallen. Die Komponente hat für diesen
          Moment kein Output, aber ihr Klick steigt zum Host auf, und dort gibt das Snippet den Fokus an die Überschrift des Panels weiter
          &mdash; derselbe Schritt, den der Kit-FAB für die Seite macht, wo der Fokus zur Main-Landmark geht.
        </p>
        <p class="src-note">
          Kit-Spalte aus <code>src/app/components/shared/scroll-to-top-fab.component.ts</code> und seiner Einbindung in
          <code>src/app/app.component.ts</code>; Bibliotheksspalte aus <code>openng-optimus-ui-scrolltop.mjs</code>
          &mdash; Inputs <code>:79-131</code>, der Scroll-Aufruf <code>:168-174</code>, sticky gegenüber fest
          <code>:177</code>, Listener am Elternelement <code>:198-203</code>, das Entfernen nach der Austrittsbewegung
          <code>:184-197</code>, der namenlose Button <code>:245</code> &mdash; und die Regeln für fest und sticky in
          <code>&#64;openng/optimus-ui-styles/dist/scrolltop/index.mjs</code>.
        </p>

        <h3>Prüfen ohne Browser</h3>
        <pre class="code-block"><code>{{ checkSnippet }}</code></pre>
        <p>
          Die ersten beiden beantworten die Fragen, an denen kein Laufzeitfehler hängt: ob jeder
          Eintrag in der Liste ein Ziel hat und ob die id in der Komponente die id in den
          Daten ist. Die dritte ist die Frage nach Wiederverwendung &mdash; ein Block, den du gleich von Hand bauen willst, gibt es vielleicht
          schon, und <strong>UI-Muster wählen</strong> ist der Ort, an dem das entschieden wird.
        </p>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>&#9744; Ein <code>&lt;app-lesson-template&gt;</code>, eine <code>h1</code>, ein Fortschrittsbalken &mdash; alle vom Template.</li>
          <li>&#9744; <code>meta.id</code> ist byte-identisch mit der Artikel-id in den Core-Daten.</li>
          <li>&#9744; Jeder Eintrag in <code>tocItems</code> hat ein Element mit dieser id.</li>
          <li>&#9744; Die Liste ist nicht leer, bis das Template <code>ngAfterViewInit</code> erreicht.</li>
          <li>&#9744; Die Labels überstehen einen Sprachwechsel.</li>
          <li>&#9744; Zwischen der <code>h1</code> und dem tiefsten Block wird keine Überschriftenebene übersprungen.</li>
          <li>&#9744; Jeder Codeblock, jede Tabelle und jede Abbildung mit fester Breite scrollt in sich selbst.</li>
          <li>&#9744; Bei 360px wird nichts an der Spaltenkante abgeschnitten.</li>
          <li>&#9744; Kein Nach-oben-Button auf Seitenebene; ein <code>p-scrolltop</code> nur in einem scrollenden Panel, mit <code>target="parent"</code>, einem übersetzten Namen, <code>scrollBehavior()</code> und einer Fokus-Übergabe.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Der Rahmen übersetzt sich selbst. Der eine Teil des Layouts, der das nicht tut, ist das
          Inhaltsverzeichnis, weil es als fertiger Text übergeben wird statt als Keys.
        </p>

        <h3>Wer was übersetzt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Kommt aus</th><th>Reagiert auf einen Sprachwechsel</th></tr>
            </thead>
            <tbody>
              <tr><td>Titel, Untertitel, Kategorie-Chip, Schwierigkeits-Chip</td><td>Keys in <code>meta</code>, vom Template übersetzt</td><td>Ja</td></tr>
              <tr><td>Zurück-Link, Teilen-Labels, Fortschritts-Label, die Wörter rund um die Footer</td><td>Die eigenen Keys des Templates</td><td>Ja</td></tr>
              <tr><td>Lesezeit</td><td><code>meta.readingTime</code>, ausgegeben wie übergeben</td><td>Nein &mdash; es ist ein Literal, samt Einheit</td></tr>
              <tr><td>Veröffentlichungs- und Planungsdatum</td><td>Formatiert nach dem Locale des Lesers</td><td>Ja</td></tr>
              <tr><td>Labels des Inhaltsverzeichnisses</td><td>Dein Array, als einfache Strings</td><td>Nur, wenn du es neu baust</td></tr>
              <tr><td>Block-Titel und Fließtext</td><td>Deine Keys, aufgelöst dort, wo du die Übersetzung aufrufst</td><td>Hängt davon ab, wie du sie gebunden hast</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Welche Strings dem Rahmen gehören, und die locale-abhängige Datumsformatierung, aus
          <code>src/app/components/shared/lesson-template.component.ts</code>.
        </p>

        <h3>Zwei ausgelieferte Wege, die Liste aktuell zu halten</h3>
        <p>
          Ein Getter liefert bei jeder Prüfung frisch übersetzte Labels &mdash; am kürzesten zu schreiben,
          und er legt jedes Mal ein neues Array an, wenn die Seite geprüft wird. Ein Feld, das aus einer
          Subscription auf den Sprachwechsel neu gebaut wird, behält eine stabile Referenz und kostet eine Subscription und ein
          Aufräumen. Beide stehen im Code, beide sind korrekt, und die Wahl ist eine Frage der Change Detection,
          nicht der Übersetzung. Nicht optional ist, eins von beiden zu tun: Eine Liste,
          die einmal im Konstruktor gebaut wird, ist in der Sprache eingefroren, in der der Leser ankam.
        </p>
        <pre class="code-block"><code>{{ tocSnippet }}</code></pre>
        <p class="src-note">
          Die Getter-Form ist die Vorlagenseite unter
          <code>src/app/pages/articles/seed-article-1/</code>; die Subscription-Form nutzen
          die ausgearbeiteten Seiten daneben unter <code>src/app/pages/articles/</code>.
        </p>

        <h3>Was längerer Text mit diesem Layout macht</h3>
        <p>
          Die Body-Spalte ist nicht die Druckstelle &mdash; Fließtext bricht neu um. Die Toolbar ist es. Ihre
          Meta-Chips brechen als Gruppe in weitere Zeilen um, und auch der Text in einem Chip bricht um, sodass
          ein langes Kategorie- oder Schwierigkeits-Label zuerst seinen eigenen Chip höher macht. Auf der schmalsten Stufe
          der Leiter hört das auf: Der Text bricht nicht mehr um und wird an der Kante des Chips mit Auslassungspunkten
          gekürzt, sodass sich ein abgeschnittenes Label wenigstens selbst verrät. Das Inhaltsverzeichnis-Panel
          verhält sich genauso, aber an einer festen Begrenzung statt an einem Breakpoint, auf jedem Viewport
          &mdash; genau dort wird ein Abschnittsname, der sich erst am Ende unterscheidet, unleserlich.
          Auslassungspunkte markieren den Verlust, machen ihn aber nicht rückgängig: Halte beide in jeder
          Sprache kurz, und behandle das als Budget, nicht als Vorliebe. Wo diese Budgets aufgeschrieben
          sind, wie ein Key benannt wird und was ein Leser sieht, wenn er fehlt, ist
          <strong>I18n &amp; Lokalisierung</strong>; welche Schriften der Font-Stack tatsächlich
          rendern kann, ist <strong>Typografie</strong>.
        </p>
        <p class="src-note">
          Umbruch der Chips und die Auslassungspunkte bei 360px aus den Regeln <code>.meta-item</code> und
          <code>.meta-text</code> in
          <code>src/app/components/shared/lesson-template.component.ts</code>; die Auslassungspunkte
          des Panels aus der Regel <code>.item-text</code> in
          <code>src/app/components/shared/table-of-contents-fab.component.ts</code> &mdash; dem
          Muster, das die Chips übernommen haben.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.7</strong> &mdash; 23.09.2026 &mdash; Mit den Fixes vom selben Tag abgeglichen: Der Kit-FAB gibt
            den Fokus jetzt an die Main-Landmark weiter (neue Vergleichszeile), und <code>scrollBehavior()</code> liefert
            <code>'auto' | 'smooth'</code>, sodass Beispiel und Snippet es ohne Einengung übergeben.</li>
          <li><strong>v0.6</strong> &mdash; 23.09.2026 &mdash; Der Guide deckt jetzt <code>p-scrolltop</code> ab: seinen
            Vertrag im Agent-Doc, ein Live-Beispiel mit Panel und einen Vergleich in Entwicklung mit dem kiteigenen
            <code>app-scroll-to-top-fab</code> &mdash; das Nach-oben der Seite gehört der Shell, die Bibliothekskomponente ist
            für ein Panel mit eigenem Scrollen, mit übersetztem Namen, Verhalten bei reduzierter Bewegung und einer Fokus-Übergabe.</li>
          <li><strong>v0.5</strong> &mdash; 02.09.2026 &mdash; Erneut geprüft auf Angular 22.1.4 / Optimus UI 2.0.2 (ADR-0014): Die Registrierung des Inhaltsverzeichnisses, das Abschneiden der Spalte und die Projektionsregeln zitieren keine Quellzeile aus Bibliothek oder Framework; Pin auf 22.1.4 angehoben, nichts, was dieser Guide misst, hat sich geändert.</li>
          <li><strong>v0.4</strong> &mdash; 24.08.2026 &mdash; Erneut geprüft nach dem Upgrade auf
            Angular 22.1.3 / PrimeNG 22.1: Die Registrierung des Inhaltsverzeichnisses läuft weiterhin einmal in
            <code>ngAfterViewInit</code> hinter der Längenprüfung, die Spalte schneidet weiterhin bei
            <code>overflow-x: hidden</code> ab, und der Fortschrittsbalken ist unverändert. Nichts in diesem
            Layout hat sich bewegt; Provenienz-Pin angehoben.</li>
          <li><strong>v0.3</strong> &mdash; 20.08.2026 &mdash; Das Template hat zwei
            Befunde nachgeholt: Das Abschneiden der Chips bei 360px zeichnet jetzt Auslassungspunkte &mdash; der Text ist in ein
            Flex-Item <code>.meta-text</code> gewandert, das Muster, das <code>.item-text</code> schon nutzte
            &mdash; und der Dialog für Leichte Sprache bekommt denselben Inhaltstyp, den die Registry-Prüfung
            aus <code>focus</code> berechnet, statt eines fest verdrahteten <code>page</code>.</li>
          <li><strong>v0.2</strong> &mdash; 18.08.2026 &mdash; Korrekturdurchgang. Das Seitengerüst
            und die Regionen-Tabelle sind in Dokumentreihenfolge neu gefasst, mit dem Fortschrittsbalken dort, wo das
            Template ihn schreibt &mdash; nach der Toolbar &mdash; und seinem am Viewport fixierten Zeichnen
            als Grund genannt, warum sich die beiden Reihenfolgen unterscheiden. <code>titleKey</code> ist ohne Bedingung
            Pflicht, und <code>title</code> wird als das beschrieben, was es ist: der optionale statische
            Fallback. <code>meta.difficulty</code> kommt in die Input-Tabelle als das eine Feld, das
            Pflicht ist und nie gelesen wird. Das Verhalten der Chips unter 360px ist korrigiert: Der Text bricht um,
            und das Abschneiden, das ihn beendet, zeichnet keine Auslassungspunkte, was die Chips zu einem strengeren
            Übersetzungsbudget macht, als Auslassungspunkte es täten. Die Breakpoint-Leiter bekommt die Chip-Stufe
            bei 480px zurück, und die Zeile für 768px sagt nicht mehr, das Padding der Spalte sinke, wenn nur
            dessen Seiten es tun. <code>app-definition</code> ist als Komponente festgehalten, die feste
            <code>h3</code> neben dem Titel ausgibt, dessen Ebene sie setzt. Die Falle des kopierten Stylesheets ist neu gefasst
            als Regel über Geltungsbereich statt als Behauptung über ungenutzte Regeln, und
            <strong>Design-Tokens</strong> und <strong>I18n &amp; Lokalisierung</strong>, auf die der Text
            schon verwies, werden gegenseitige <code>related</code>-Einträge.</li>
          <li><strong>v0.1</strong> &mdash; 18.08.2026 &mdash; Erster Guide: die zwei Zuständigkeitsbänder
            einer Artikelseite, die Render-Reihenfolge des Rahmens, die Inputs, die das Template
            braucht, und was jedes steuert, die Überschriftenebene, die jeder ausgelieferte Block ausgibt, die zwei
            Gliederungsmuster, die Spalte und ihr Abschneiden, die Breakpoint-Leiter des Rahmens, die
            drei Dateien, aus denen eine Seite zusammengesetzt ist, und das Inhaltsverzeichnis als der eine Teil des
            Layouts, der sich nicht selbst übersetzt.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ArticleLayoutArticleDeComponent extends ArticleLayoutArticleComponent {
  override readonly stRows = Array.from(
    { length: 14 },
    (_, i) => `Eintrag ${14 - i}: eine kurze Notiz, wiederholt, damit das Panel etwas zum Scrollen hat.`,
  );
}
