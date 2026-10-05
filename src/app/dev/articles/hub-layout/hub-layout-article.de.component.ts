import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubLayoutArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './hub-layout-article.component';

/**
 * German twin of the Hub Layout guide (ADR-0018).
 *
 * Extends the English canonical article, so the code snippets are shared; only
 * the template is German (the English class holds no visible prose). Keep it in
 * step with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs hub-layout`).
 */
@Component({
  selector: 'app-hub-layout-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'hub-layout'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Hub ist die Seite, die zwischen einem Leser und einer Sammlung steht: ein Titel, eine Möglichkeit,
          sie einzugrenzen, und ein Raster aus Karten. Das Kit liefert ein Template, das die ganze Seite ist,
          und die Teile, aus denen dieses Template besteht, sind dieselben Teile, die ein von Hand gebauter Hub
          selbst zusammensetzen muss.
        </p>

        <h3>Die vier Teile, in der Reihenfolge, in der sie rendern</h3>
        <p>
          Nichts hier ist in dem Sinn optional, dass man es weglassen könnte &mdash; ein Hub ohne Filterbereich
          ist ein Hub mit leerem Filterbereich, und ein Hub ohne das dritte Band muss trotzdem entscheiden, was
          erscheint, wenn das Raster leer ist.
        </p>
        <div class="skel">
          <div class="skel__band">
            <span class="skel__cap">die Seite</span>
            <div class="skel__row">Header &mdash; das eine h1, ein Vorspann, sonst nichts</div>
            <div class="skel__row">Filter &mdash; Suche, Chips, Sortierung; dann ein höflicher Statusbereich</div>
            <div class="skel__band skel__band--body">
              <span class="skel__cap">das Sammlungsband &mdash; genau eines davon rendert</span>
              <div class="skel__row">Skeletons, solange der Index unterwegs ist</div>
              <div class="skel__row">das Kartenraster</div>
              <div class="skel__row">nichts gefunden &mdash; oder nichts geladen</div>
            </div>
          </div>
        </div>
        <p class="src-note">
          Reihenfolge der Teile, der Statusbereich außerhalb der Zweige und der gegenseitige Ausschluss im
          Sammlungsband sind abgelesen aus
          <code>src/app/components/shared/content-hub-template.component.ts</code>; das einzelne
          <code>h1</code> aus <code>src/app/components/shared/page-header.component.ts</code>.
        </p>

        <h3>Ein Rezept, drei Breiten</h3>
        <p>
          Alle drei Raster unten haben identisches Markup und eine gemeinsame Regel. Nur die Breite ihres
          Wrappers unterscheidet sich, und die Zahl der Spuren ergibt sich aus der Rechnung, nicht aus einem
          Breakpoint &mdash; in diesem Beispiel gibt es überhaupt keine Media Query. Die Untergrenze ist hier
          kleiner, als ein echter Hub sie nähme, damit alle drei nebeneinander passen.
        </p>
        <div class="gd-row">
          <div class="gd-box gd-box--s">
            <div class="gd-cap">schmal</div>
            <div class="gd-grid">
              <div class="gd-cell">Karte</div><div class="gd-cell">Karte</div>
              <div class="gd-cell">Karte</div><div class="gd-cell">Karte</div>
            </div>
          </div>
          <div class="gd-box gd-box--m">
            <div class="gd-cap">mittel</div>
            <div class="gd-grid">
              <div class="gd-cell">Karte</div><div class="gd-cell">Karte</div>
              <div class="gd-cell">Karte</div><div class="gd-cell">Karte</div>
            </div>
          </div>
          <div class="gd-box gd-box--l">
            <div class="gd-cap">breit</div>
            <div class="gd-grid">
              <div class="gd-cell">Karte</div><div class="gd-cell">Karte</div>
              <div class="gd-cell">Karte</div><div class="gd-cell">Karte</div>
            </div>
          </div>
        </div>
        <p>
          Im breiten Raster ist die letzte Zeile kurz, und die leeren Spuren bleiben stehen &mdash; das ist
          <code>auto-fill</code> &mdash;, sodass die Karte ihre Spurbreite behält, statt sich über die Zeile
          auszudehnen. <code>1fr</code> als Obergrenze der Spur macht alle Spuren gleich und nimmt den
          übrigen Platz auf; deshalb braucht das Rezept keine Regel für eine ausgefranste letzte Zeile.
          <code>auto-fit</code> ist die Option, die diese leeren Spuren zusammenfallen lässt.
        </p>
        <p class="src-note">
          Die gezeigte Regel ist die Deklaration <code>.content-grid</code> in
          <code>src/app/components/shared/content-hub-template.component.ts</code>, mit kleinerer
          Spur-Untergrenze.
        </p>

        <h3>Die drei Zustände einer Sammlung</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Zustand</th><th>Die Bedingung, an der man ihn erkennt</th><th>Was der Leser bekommt</th></tr>
            </thead>
            <tbody>
              <tr><td>Lädt</td><td>ein ausdrückliches Flag, gesetzt vor dem Request</td><td>Skeletons, plus ein Statusbereich, der das sagt</td></tr>
              <tr><td>Nichts geladen</td><td>das Laden ist fehlgeschlagen, egal wie hoch die Zahl ist</td><td>Ein Fehler und ein Erneut-Versuchen &mdash; nie ein Filter-Hinweis</td></tr>
              <tr><td>Nichts gefunden</td><td>Daten sind angekommen UND die gefilterte Liste ist leer</td><td>Ein Leerzustand und ein Control, das die Filter zurücksetzt</td></tr>
              <tr><td>Gefüllt</td><td>die gefilterte Liste ist nicht leer</td><td>Das Raster, und die Anzahl wird angesagt</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Zwei davon werden routinemäßig zu einem zusammengelegt. „Lädt“ aus einer leeren Sammlung abzuleiten
          ist die Variante, aus der es kein Zurück gibt: Ein fehlgeschlagenes Laden lässt die Sammlung für
          immer leer, also schimmert die Seite, solange sie offen ist.
        </p>
        <p>
          Das Template deckt alle vier Zeilen ab: Sein Statusbereich sagt, dass das Laden läuft oder
          fehlgeschlagen ist, und sobald die Daten da sind, sagt er an, wie viele Karten die Filter übrig
          gelassen haben, eine halbe Sekunde nach der letzten Filteränderung, sodass Tippen im Suchfeld eine
          Ansage ergibt statt einer pro Tastendruck.
        </p>
        <p class="src-note">
          Die Zustände sind abgelesen aus
          <code>src/app/components/shared/content-hub-template.component.ts</code>, das alle drei Zweige
          mitliefert: Ein Flag <code>loadFailed</code> rendert das Band mit Fehler und Erneut-Versuchen,
          getrennt vom Zustand „nichts gefunden“ und seinem Control zum Zurücksetzen der Filter; sein Bereich
          mit <code>role=&quot;status&quot;</code> zeigt die Meldungen zu Laden und Ladefehler, danach den Satz
          <code>common.resultCount</code>, verzögert um
          <code>RESULT_ANNOUNCE_DELAY_MS</code> (500&nbsp;ms).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          An das Template zu delegieren heißt, ein Config-Objekt und eine Zuordnung zu schreiben. Keins von
          beiden ist lang; beide sind die Stellen, an denen Hubs schiefgehen, weil der Typ mehr annimmt, als
          die Komponente liest, und mehr fallen lässt, als sie meldet.
        </p>

        <h3>Was das Template annimmt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Feld</th><th>Vom Typ verlangt</th><th>Was es steuert</th></tr>
            </thead>
            <tbody>
              <tr><td><code>titleKey</code></td><td>Ja</td><td>Das <code>h1</code> und das Label des Header-Bereichs</td></tr>
              <tr><td><code>subtitleKey</code></td><td>Ja</td><td>Den Vorspann unter dem Titel</td></tr>
              <tr><td><code>ctaLabelKey</code></td><td>Ja</td><td>Das Label auf dem einen Button jeder Karte</td></tr>
              <tr><td><code>fromParam</code></td><td>Nein</td><td>Einen Query-Parameter, der an jeden Kartenlink angehängt wird</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen am Interface <code>ContentHubConfig</code> und an jeder seiner Verwendungen in
          <code>src/app/components/shared/content-hub-template.component.ts</code>. Jedes Feld, das der Typ
          verlangt, wird auch gelesen &mdash; zwei, die er einst verlangte und nie las
          (<code>contentType</code>, <code>icon</code>), wurden aus dem Interface entfernt.
        </p>

        <h3>Was ein Eintrag mitbringt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Feld</th><th>Pflicht</th><th>Was erscheint, wenn du es mitgibst</th></tr>
            </thead>
            <tbody>
              <tr><td><code>id</code>, <code>path</code></td><td>Ja</td><td>Der Track-Key und das Ziel der Karte</td></tr>
              <tr><td><code>titleKey</code>, <code>descriptionKey</code></td><td>Ja</td><td>Die Überschrift der Karte und ihr gekürzter Text</td></tr>
              <tr><td><code>category</code></td><td>Ja</td><td>Ein Meta-Chip und eine Achse des Chip-Filters</td></tr>
              <tr><td><code>difficulty</code></td><td>Nein</td><td>Ein Severity-Tag und die zweite Filterachse</td></tr>
              <tr><td><code>estimatedTime</code></td><td>Nein</td><td>Ein Meta-Chip und die dritte Sortierung</td></tr>
              <tr><td><code>featured</code></td><td>Nein</td><td>Ein Tag, ein Rahmen und die Standard-Sortierung</td></tr>
              <tr><td><code>draft</code>, <code>publishDate</code></td><td>Nein</td><td>Die Tags „Entwurf“ und „geplant“</td></tr>
              <tr><td><code>icon</code>, <code>tags</code></td><td>Nein</td><td>Das Karten-Icon; für Tags noch nichts</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Die Zuordnung ist die ganze Angriffsfläche für Fehler. Jedes dieser Felder hat dein eigener Datentyp
          vermutlich schon unter demselben Namen, und ein Feld, das in der Zuordnung fehlt, ist nirgends ein
          Fehler &mdash; es ist ein Badge, das still nie rendert, und eine Filterachse, die still nie erscheint.
        </p>
        <p class="src-note">
          Bedeutung der Felder aus dem Interface <code>ContentItem</code> und dem Karten-Markup in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; die Datentypen des Index
          verlangen mehr &mdash; <code>BaseIndexContentMeta</code> in
          <code>src/app/services/base-index-content.service.ts</code> verlangt zusätzlich
          <code>estimatedTime</code>, <code>difficulty</code> und <code>featured</code>, die
          <code>ContentItem</code> optional lässt.
        </p>

        <h3>Do / Don’t</h3>
        <p class="src-note">
          Die Ableitungsregel aus Angulars Vertrag für das Signal-Tracking; die Zustände und das Kartenelement
          aus <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; von einem einfachen Input ableiten</span>
            <div class="dd__stage"><code class="dd__code">{{ badDerive }}</code></div>
            <p class="dd__why">
              Ein Computed verfolgt die Signals, die es beim Berechnen liest. Ein Input-Array ist keins,
              also speichert dieses Computed sein erstes Ergebnis &mdash; genommen, als die Sammlung noch leer
              war &mdash; und rechnet nie neu.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; von einem Signal ableiten</span>
            <div class="dd__stage"><code class="dd__code">{{ goodDerive }}</code></div>
            <p class="dd__why">
              Ein einziges Signal, das in der Ableitung gelesen wird, reicht, um sie lebendig zu machen. Die
              Filteroptionen erscheinen dann, wenn die Daten erscheinen, statt bei dem stehen zu bleiben, was der
              Skeleton-Durchlauf gesehen hat.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; ein Zustand für alles</span>
            <div class="dd__stage"><code class="dd__code">{{ badStates }}</code></div>
            <p class="dd__why">
              Leere ist das Symptom dreier verschiedener Ursachen. Wer nach einem fehlgeschlagenen Request
              hört, er solle einen anderen Filter versuchen, ändert Filter, die nie das Problem waren.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; eine Bedingung je Ursache</span>
            <div class="dd__stage"><code class="dd__code">{{ goodStates }}</code></div>
            <p class="dd__why">
              Das Fehler-Flag kommt vom Loader, nicht aus der Anzahl, also wird ein fehlgeschlagenes Laden nie
              mit einem laufenden Laden verwechselt oder mit einem Filter, der nichts gefunden hat.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t &mdash; eine Karte, die sich wie ein Link verhält</span>
            <div class="dd__stage"><code class="dd__code">{{ badCard }}</code></div>
            <p class="dd__why">
              Die Aktivierung per Tastatur ist die leichte Hälfte. Die Hälfte, die kein Handler zurückbringt, ist
              die URL: Mittelklick, in neuem Tab öffnen, Link kopieren und die Adressvorschau beim Überfahren.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do &mdash; eine Karte, die ein Link ist</span>
            <div class="dd__stage"><code class="dd__code">{{ goodCard }}</code></div>
            <p class="dd__why">
              Ein Element trägt das Ziel, den Fokus und den Namen. Nichts darin braucht einen Tabindex, und die
              Überschrift bleibt eine Überschrift, statt zum Label zu werden.
            </p>
          </div>
        </div>
        <p class="src-note">
          Das Template hält diese Regeln selbst ein, also erbt ein Hub, der delegiert, sie: Der eine CTA der
          Karte ist ein <code>&lt;a pButton&gt;</code> mit <code>routerLink</code> —
          ein echter Link mit einem <code>href</code> im vorgerenderten HTML —, beschrieben durch seinen
          Kartentitel über <code>aria-describedby</code>, und die Überschriften für Ladefehler und „nichts
          gefunden“ sind <code>h2</code>, die Ebene der Kartentitel, die sie ersetzen. Abgelesen am Karten- und
          Zustands-Markup in <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/TR/css-grid-2/" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; CSS Grid Layout Module Level 2</a
            >
            &mdash; Wiederholen bis zum Füllen: Mit <code>auto-fill</code> gibt es eine Wiederholung, wenn jede Anzahl überlaufen würde.
          </li>
          <li>
            <a href="https://angular.dev/guide/signals" target="_blank" rel="noopener noreferrer"
              >Angular &mdash; Signals guide</a
            >
            &mdash; nur Signals, die während einer Ableitung gelesen werden, werden verfolgt, und der Wert wird zwischengespeichert.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; WCAG 2.2 SC 4.1.3 Status Messages</a
            >
            &mdash; eine Ergebnisanzahl ist eine Statusmeldung und muss ankommen, ohne den Fokus zu verschieben.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer"
              >W3C &mdash; WAI-ARIA APG, Button pattern</a
            >
            &mdash; ein Umschalt-Button trägt <code>aria-pressed</code>; ein Control, das navigiert, ist ein Link.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Das Raster besteht aus vier Deklarationen, und die Spaltenzahl ist keine davon. Alles andere auf
          dieser Seite &mdash; der Grund, auf dem die Karten liegen, die Breite, bei der die Seite endet
          &mdash; ist eine Token-Entscheidung, die schon getroffen ist.
        </p>

        <h3>Das Spur-Rezept, Deklaration für Deklaration</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Deklaration</th><th>Wert im ausgelieferten Raster</th><th>Was sie entscheidet</th></tr>
            </thead>
            <tbody>
              <tr><td><code>display</code></td><td><code>grid</code></td><td>Dass die Zeile durch Platzierung gefüllt wird, nicht durch Umbruch</td></tr>
              <tr><td>Wiederholung</td><td><code>auto-fill</code></td><td>So viele Spuren, wie passen; leere bleiben stehen</td></tr>
              <tr><td>Spur-Untergrenze</td><td><code>min(320px, 100%)</code></td><td>Die schmalste sinnvolle Breite der Karte, begrenzt durch den Container</td></tr>
              <tr><td>Spur-Obergrenze</td><td><code>1fr</code></td><td>Dass alle Spuren gleich sind und kein Restplatz bleibt</td></tr>
              <tr><td><code>gap</code></td><td><code>var(--space-6)</code></td><td>Den Rhythmus, aus der Abstandsskala statt aus einem festen Wert</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>auto-fill</code> und <code>auto-fit</code> unterscheiden sich erst, wenn die Einträge ausgehen:
          <code>auto-fit</code> lässt die leeren Spuren zusammenfallen, sodass vier Karten in einer Zeile mit
          fünf Spuren wachsen, bis sie die ganze Breite teilen. Keins von beiden ist falsch; ein Hub, dessen
          Kartenzahl stark schwankt, wirkt mit <code>auto-fill</code> ruhiger, weil die Kartenbreite nicht mehr
          davon abhängt, wie viele Ergebnisse der Filter übrig gelassen hat.
        </p>
        <p class="src-note">
          Werte aus der Regel <code>.content-grid</code> in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; das Abstands-Token aus
          <code>src/styles/design-tokens.scss</code>.
        </p>

        <h3>Die Spaltenleiter, die diese Zahlen ergeben</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Breite der Content-Box des Rasters</th><th>Spuren</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr><td>unter 664px</td><td>1</td><td>Zwei Spuren plus ein Gap brauchen 664px</td></tr>
              <tr><td>664px bis 1007px</td><td>2</td><td>Drei Spuren plus zwei Gaps brauchen 1008px</td></tr>
              <tr><td>1008px und mehr</td><td>3</td><td>Vier bräuchten 1352px, mehr als die Container-Grenze</td></tr>
              <tr><td>Viewport bis einschließlich 768px</td><td>1</td><td>Die eine Media Query übersteuert die Rechnung</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Die Obergrenze ist die interessante Zeile. Die Seite endet bei der Breite des Section-Containers, und
          nach dessen horizontalem Padding bekommt das Raster nie genug Platz für eine vierte Spur &mdash;
          dieses Rezept ist also ein dreispaltiges Layout, das sich intrinsisch verhält, kein Layout mit drei
          Breakpoints. Die Media Query ist auch nicht überflüssig: Zwischen etwa 728px und 768px Viewport
          ergäbe die Rechnung allein zwei schmale Spalten, und die Query wählt stattdessen eine breite.
        </p>
        <p>
          Diese Query ist eine Viewport-Query, und zwar mit Absicht &mdash; das Gegenteil der Regel, die
          <strong>Demo-Layout</strong> für eine Demo aufstellt. Die beiden widersprechen sich nicht:
          Eine Demo wird in mehreren Breiten eingebunden, also muss sie nach sich selbst fragen,
          während ein Hub die Seite <em>ist</em> und sein Raster so breit ist, wie das Fenster es zulässt. Ein
          Hub, der in eine schmalere Spalte eingebettet ist, ist der Fall, in dem das nicht mehr stimmt, und
          dort ist die Frage an den Container zu stellen.
        </p>
        <p class="src-note">
          Berechnet aus der Spur-Untergrenze, dem <code>gap</code> und der Container-Grenze, die in
          <code>src/app/components/shared/content-hub-template.component.ts</code> deklariert sind, zusammen
          mit den Container-Token in <code>src/styles/design-tokens.scss</code>, bei 16px Root. Die
          Viewport-Zahlen enthalten das eigene horizontale Padding der App-Shell
          (<code>.content-container</code> in <code>src/app/app.component.ts</code>) zusätzlich zu dem des
          Hubs.
        </p>

        <h3>Text auf einer Karte, und auf einer Karte unter dem Zeiger</h3>
        <p>
          Ein Hub hat mehr Fläche als jede andere Seitenform, und seine Gründe sind nicht gleich sicher.
          Kartentext besteht bequem; dieselbe gedämpfte Farbe auf dem Hover-Ton hat den knappsten Abstand. Die
          eigene Karte des Templates bleibt auf <code>--surface-card</code> und hebt beim Hover nur ihren
          Schatten an; eine von Hand gebaute Karte, die <code>--surface-hover</code> malt, muss sich an der
          dritten Zeile messen lassen.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Paar</th><th>werkbund, hell / dunkel</th><th>Alle vier Stile, niedrigster</th><th>Kriterium</th></tr>
            </thead>
            <tbody>
              <tr><td><code>--text-color</code> auf <code>--surface-card</code></td><td>18,73:1 / 14,86:1</td><td>11,32:1 (skizzenbuch, dunkel)</td><td>SC 1.4.3, 4,5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> auf <code>--surface-card</code></td><td>7,78:1 / 6,59:1</td><td>5,21:1 (blaupause, hell)</td><td>SC 1.4.3, 4,5:1</td></tr>
              <tr><td><code>--text-color-secondary</code> auf <code>--surface-hover</code></td><td>6,47:1 / 5,91:1</td><td>4,55:1 (blaupause, hell)</td><td>SC 1.4.3, 4,5:1</td></tr>
              <tr><td><code>--control-border</code> auf <code>--surface-card</code></td><td>5,23:1 / 4,91:1</td><td>3,97:1 (blaupause, dunkel)</td><td>SC 1.4.11, 3:1</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Zwei Folgen für ein Kartenraster. Eine Meta-Zeile in <code>--text-color-secondary</code>
          erfüllt das Kriterium auf jedem Grund in jedem visuellen Stil, auf dem Hover-Ton aber mit einem
          Abstand von Hundertsteln &mdash; die Meta-Zeile darf also keine Information tragen, die ein Leser
          verpassen könnte, ohne es zu merken. Und der eigene Rahmen der Karte, gezeichnet mit dem dekorativen
          <code>--surface-border</code>, darf Karten optisch trennen, aber nichts, was ein Leser wahrnehmen
          muss &mdash; ein ausgewählter Zustand, ein Fokus-Ring, eine Entwurfsmarkierung &mdash;, darf allein
          darauf beruhen; eine Kante, die etwas Interaktives kenntlich macht, zeichnet
          <code>--control-border</code>.
        </p>
        <p class="src-note">
          Zahlen zitiert aus den Zeilen „body text“ und „control boundary“ von
          <code>docs/generated/CONTRAST.MD</code>, je visuellem Stil und Modus; die Kartengründe aus den
          Regeln <code>.content-card</code> in
          <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>

        <h3>Was auf einem schmalen Bildschirm passiert</h3>
        <p>
          Das Raster wird einspaltig, auf zwei voneinander unabhängigen Wegen: Unter 664px Content-Box passt
          nach der Spurrechnung nur eine Spalte, und bei einem Viewport bis einschließlich 768px erzwingt die
          eine Media Query ohnehin eine. Die Untergrenze <code>min(320px, 100%)</code> sorgt dafür, dass das
          Minimum von 320px nicht zum Überlauf wird &mdash; ohne sie schiebt eine Spur, die breiter ist als ihr
          Container, die Seite seitlich weg, weil ein Raster ohne Platz für auch nur eine Wiederholung diese
          eine trotzdem anlegt. Die Filterzeile wird von einer zentrierten, umbrechenden Zeile zu einer Spalte,
          und das Suchfeld geht auf volle Breite; die Karten selbst schneiden nichts ab &mdash; die
          Beschreibung ist bei jeder Breite auf drei Zeilen gekürzt, und der Titel bricht um.
          Was der Aufrufer tun muss: nichts, wenn der Hub die Seite ist. Ein Hub in einer schmaleren Spalte
          braucht eine niedrigere Spur-Untergrenze, weil die Untergrenze eine feste Länge ist und nicht mit
          ihrem Container skaliert.
        </p>
        <p class="src-note">
          Einklappverhalten und Zeilenkürzung aus den Regeln <code>.content-grid</code>,
          <code>.filters-section</code> und <code>.card-description</code> in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; der Rückfall bei Überlauf
          aus CSS Grid Level 2.
        </p>

        <h3>Die benannte Breakpoint-Skala &mdash; gelöscht, und warum die Zahlen feste Werte sind</h3>
        <p>
          Das Kit deklarierte früher eine Breakpoint-Map und ein Mixin dazu, und keine Komponente konnte je
          eins davon aufrufen: Komponenten-CSS steht in Inline-Arrays <code>styles</code>, und es gibt
          nirgends ein Komponenten-Stylesheet, aus dem man die Token-Datei importieren könnte. Beide wurden am
          20.08.2026 gelöscht. Schreib die Zahl als festen Wert &mdash; <code>768px</code> ist die eine
          Einklappstufe des Kits, und sie zu treffen ist der Weg, auf dem ein Hub mit dem Rest des Kits
          übereinstimmt, statt eine eigene Stufe zu erfinden.
        </p>
        <p class="src-note">
          Frühere Stelle der Deklaration: <code>src/styles/design-tokens.scss</code>, die jetzt den
          Löschvermerk trägt. Aufrufstellen unter <code>src/app/</code>: keine, weder vorher noch seitdem.
        </p>
        <pre class="code-block"><code>{{ deadApiSnippet }}</code></pre>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Ein Hub ist eine Komponente, eine Datenquelle und eine Route. Die Komponente ist so oder so kurz
          &mdash; delegiert ist sie ein Config-Objekt und eine Zuordnung, von Hand gebaut sind es die vier
          Teile und ihre drei Zustände.
        </p>

        <h3>Die Dateien, aus denen ein Hub zusammengesetzt ist</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Artefakt</th><th>Wo</th><th>Steuert</th></tr>
            </thead>
            <tbody>
              <tr><td>Die Seitenkomponente</td><td><code>src/app/pages/&lt;id&gt;/</code></td><td>Die Zuordnung, das Laden, die drei Zustände</td></tr>
              <tr><td>Die Route</td><td><code>src/app/app.routes.ts</code></td><td>Die URL und den Navigationseintrag</td></tr>
              <tr><td>Der Index</td><td><code>src/assets/data/core/&lt;kind&gt;/index.json</code></td><td>Jede Karte auf der Seite</td></tr>
              <tr><td>Der Service</td><td><code>src/app/services/</code></td><td>Abrufen, Cachen und die Sichtbarkeitsprüfung</td></tr>
              <tr><td>Die Labels</td><td><code>src/assets/i18n/modules/&lt;lang&gt;/</code></td><td>Jeden String, auch die Chip-Labels</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Index und Routen müssen in beide Richtungen übereinstimmen. Ein Index-Eintrag, dessen
          <code>path</code> zu keiner Route passt, ist eine Karte, die auf die Not-found-Seite führt; eine Route
          ohne Index-Eintrag ist eine Seite, die existiert, aber in keinem Hub erscheint.
        </p>
        <p class="src-note">
          Die Aufteilung ist abgelesen aus <code>src/app/pages/demos-overview/</code> zusammen mit dem Service
          und dem Interface in <code>src/app/services/demos.service.ts</code>.
        </p>

        <h3>Ein von Hand gebauter Hub, minimal</h3>
        <p class="src-note">
          Die Form folgt dem Template in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; der Seiten-Header ist
          <code>src/app/components/shared/page-header.component.ts</code>.
        </p>
        <pre class="code-block"><code>{{ hubSnippet }}</code></pre>
        <p>
          Drei Dinge darin sind Struktur, nicht Geschmack. Der Statusbereich liegt außerhalb der drei Zweige,
          also ist er da, bevor der erste von ihnen rendert, und kann deshalb aktualisiert werden, statt erst
          beim Entstehen angesagt zu werden. Das Fehler-Flag kommt vom Loader und nicht aus der Anzahl. Und die
          Raster-Regel nennt nirgends eine Spaltenzahl.
        </p>

        <h3>Prüfen ohne Browser</h3>
        <pre class="code-block"><code>{{ checkSnippet }}</code></pre>
        <p>
          Die ersten beiden beantworten die Fragen, die zur Laufzeit keinen Fehler auslösen: ob das Raster einen
          schmalen Container überlaufen kann und ob jede Karte zu einem Ziel führt, das der Router kennt. Die
          dritte ist die Frage nach Wiederverwendung &mdash; die Karte, die du gleich von Hand bauen willst, ist
          vielleicht schon dokumentiert, und <strong>UI-Muster wählen</strong> ist der Ort für diese
          Entscheidung.
        </p>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>&#9744; Genau ein <code>h1</code>, und es kommt aus der Page-Header-Komponente.</li>
          <li>&#9744; Jede Karte rendert eine echte Überschrift, eine Ebene unter ihrer Gruppierung.</li>
          <li>&#9744; Die Überschrift des Leerzustands steht auf der Ebene, auf der die Karten standen.</li>
          <li>&#9744; Laden, Ladefehler und „nichts gefunden“ sind drei getrennte Bedingungen.</li>
          <li>&#9744; Die Ergebnisanzahl wird aus einem höflichen Bereich angesagt, still während des Ladens.</li>
          <li>&#9744; Filteroptionen und gefilterte Einträge werden aus Signals abgeleitet.</li>
          <li>&#9744; Die Spur-Untergrenze steckt in <code>min(&hellip;, 100%)</code>.</li>
          <li>&#9744; Nichts in einer Karte trägt eine fest verdrahtete <code>id</code>.</li>
          <li>&#9744; Bei 320px wird nichts abgeschnitten, und keine Zeile scrollt seitlich.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Ein Hub übersetzt selbst fast nichts. Sein eigener Rahmen ist schon übersetzt, seine Karten tragen
          Schlüssel statt Text, und der eine String, den er auflöst, indem er den Schlüssel zur Laufzeit baut,
          ist der, der still kaputtgehen kann.
        </p>

        <h3>Wer was übersetzt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Kommt aus</th><th>Du lieferst</th></tr>
            </thead>
            <tbody>
              <tr><td>Placeholder der Suche, Sortier-Labels, „Alle“</td><td>Dem gemeinsamen Namespace des Rahmens</td><td>Nichts</td></tr>
              <tr><td>Leerzustand und sein Button</td><td>Dem gemeinsamen Namespace des Rahmens</td><td>Nichts</td></tr>
              <tr><td>Schwierigkeits-Tags und -Chips</td><td>Einem Namespace, der nach dem Wert verschlüsselt ist</td><td>Nichts, für die drei bekannten Werte</td></tr>
              <tr><td>Seitentitel und Vorspann</td><td>Deinen Schlüsseln, in der Config benannt</td><td>Zwei Schlüssel</td></tr>
              <tr><td>Kartentitel und Beschreibung</td><td>Deinen Schlüsseln, an jedem Datensatz</td><td>Zwei Schlüssel pro Eintrag</td></tr>
              <tr><td>Kategorie-Chips und Meta</td><td>Einem Namespace, der nach dem Wert verschlüsselt ist</td><td>Einen Eintrag pro Kategorie, die du erfindest</td></tr>
              <tr><td>Geschätzte Zeit</td><td>Dem Datensatz, so ausgegeben, wie er ist</td><td>Die Einheit, im festen Wert selbst</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Welche Strings der Rahmen besitzt, ist abgelesen an den Übersetzungsaufrufen in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; die Schlüssel pro Eintrag
          aus dem Interface <code>ContentItem</code> in derselben Datei.
        </p>

        <h3>Eine Kategorie ist ein Schlüsselfragment, kein Label</h3>
        <p>
          Der Chip und die Karten-Meta geben die Kategorie nicht aus. Sie geben das Ergebnis eines Nachschlagens
          aus, dessen Schlüssel aus einem festen Präfix und dem Kategoriewert zusammengesetzt wird. Daraus folgen
          zwei Dinge. Eine Kategorie, die niemand übersetzt hat, rendert als ihr eigener Punkt-Pfad, im Chip und
          auf jeder Karte, die sie trägt. Und das Schlüssel-Gate kann nicht helfen: Es löst feste Schlüssel auf,
          und ein zur Laufzeit zusammengesetzter Schlüssel ist keiner &mdash; er wird absichtlich übersprungen,
          weil das Präfix allein kein auflösbarer Pfad ist.
        </p>
        <p class="src-note">
          Das Zusammensetzen ist abgelesen am Markup von Kategorie-Chip und Meta in
          <code>src/app/components/shared/content-hub-template.component.ts</code>; die Forderung nach festen
          Schlüsseln aus <code>scripts/check-i18n-keys.mjs</code>.
        </p>
        <pre class="code-block"><code>{{ categorySnippet }}</code></pre>

        <h3>Wohin längerer Text drückt</h3>
        <p>
          Die Karte ist die engste Box auf der Seite, und ihre schmalste Breite ist die Spur-Untergrenze, also
          ist diese Zahl das Übersetzungsbudget: Ein Titel, der nicht passt, bricht um, und eine Karte, die höher
          wird, streckt ihre ganze Zeile, sodass der Spielraum in den kürzeren Karten landet, statt etwas
          seitlich wegzuschieben.
          Die Beschreibung ist der nachsichtige Teil &mdash; sie ist auf drei Zeilen gekürzt, sodass eine
          Übersetzung, die doppelt so lang ist wie das Original, optisch nichts kostet und einen Leser das Ende
          des Satzes kostet. Die strengen Teile sind die, die nicht sauber umbrechen können: die Filter-Chips,
          die in mehr Zeilen umbrechen und das Raster nach unten schieben, und das CTA-Label, das auf einem
          Button über die volle Breite steht und auf jeder Karte derselbe String ist. Schlüsselbenennung,
          Namespaces und die Varianten in einfacher Sprache gehören zu <strong>I18n &amp; Lokalisierung</strong>.
        </p>
        <p class="src-note">
          Die Spur-Untergrenze und die Kürzung auf drei Zeilen aus den Regeln <code>.content-grid</code> und
          <code>.card-description</code> in
          <code>src/app/components/shared/content-hub-template.component.ts</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.9</strong> &mdash; 23.09.2026 &mdash; Mit den Template-Korrekturen desselben Tages
            abgeglichen: Der CTA der Karte ist ein echter Link, die Zustandsüberschriften sind <code>h2</code>, und
            der Statusbereich sagt die gefilterte Anzahl an, sodass das Template jetzt die Regeln einhält, die es
            früher brach.</li>
          <li><strong>v0.8</strong> &mdash; 23.09.2026 &mdash; Kontrasttabelle je visuellem Stil neu aus dem
            Kompilat zitiert (die Zahlen waren älter als ADR-0016); das vierteilige Skelett schreibt dem Template
            keinen zählenden Live-Bereich mehr zu &mdash; sein Statusbereich meldet nur das Laden &mdash;, und die
            zwei Template-Regeln, die es selbst nicht einhält (ein CTA als
            <code>button</code> mit <code>routerLink</code>, <code>h3</code>-Zustandsüberschriften
            unter <code>h2</code>-Karten), sind benannt; der Querverweis auf Demo-Layout folgt der Neufassung
            jenes Guides; kommentierte Quellen schließen den Tab Verwendung ab.</li>
          <li><strong>v0.7</strong> &mdash; 02.09.2026 &mdash; Erneut geprüft mit Angular 22.1.4 / Optimus UI 2.0.2 (ADR-0014): Die Direktiven <code>pButtonLabel</code> / <code>pButtonIcon</code> des Karten-CTA gibt es in Optimus unverändert; Stand auf 22.1.4 angehoben, nichts, was dieser Guide misst, hat sich geändert.</li>
          <li><strong>v0.6</strong> &mdash; 24.08.2026 &mdash; Erneut geprüft nach dem Upgrade auf
            Angular 22.1.3 / PrimeNG 22.1: Das Template bleibt eine geschlossene Box mit denselben Config- und
            Eintragsfeldern, und sein Karten-CTA nutzt jetzt die v22-Kinder <code>pButtonLabel</code> /
            <code>pButtonIcon</code>. Nichts, was dieser Guide sagt, hat sich verschoben; Herkunftsstand
            angehoben.</li>
          <li><strong>v0.5</strong> &mdash; 20.08.2026 &mdash; Die unerreichbare Breakpoint-API
            (<code>$breakpoints</code>, <code>respond-to()</code>, <code>container()</code>) wurde
            aus der Token-Datei gelöscht; der Abschnitt im Design-Tab hält sie als Geschichte fest, und die
            Regel bleibt: Schreib den festen Wert, auf den Stufen des Kits.</li>
          <li><strong>v0.4</strong> &mdash; 20.08.2026 &mdash; Das ausgelieferte Template hat die eigenen
            Regeln des Guides eingeholt: <code>items</code> ist ein Signal-Input, sodass die Filter-Chips
            lebendig abgeleitet werden, statt beim Skeleton-Durchlauf einzufrieren; ein Input <code>loadFailed</code>
            und ein Output <code>retry</code> trennen das fehlgeschlagene Laden vom Zustand „nichts gefunden“; das
            Skeleton-Raster klappt an derselben Stufe von 768px ein wie das Kartenraster; die Zeitsortierung
            normalisiert auf Minuten statt <code>parseInt</code>; und die nie gelesenen Config-Felder
            <code>contentType</code>/<code>icon</code> wurden entfernt.</li>
          <li><strong>v0.3</strong> &mdash; 19.08.2026 &mdash; Kontrastzahlen aus dem neu erzeugten
            Kompilat nach den Token-Entscheidungen der Grundlagen aufgefrischt: Die Zeilen für Sekundärtext
            bestehen jetzt (neu abgestuft auf <code>#6b7280</code>), und die Rahmenzeile zeigt
            <code>--control-border</code>, das Token, das eine Control-Kante seit der Aufteilung zeichnet.</li>
          <li><strong>v0.2</strong> &mdash; 19.08.2026 &mdash; Review-Durchgang: die Demo unter Beispiele
            als das <code>auto-fill</code> beschrieben, das sie deklariert, die Spaltenschwellen mit dem
            Padding der App-Shell berechnet, das Chip-Versprechen des Templates auf Achsen mit
            mehr als einem Wert eingegrenzt und das Rezept für den von Hand gebauten Hub an einer markierten
            Grenze zwischen Template und Styles geteilt.</li>
          <li><strong>v0.1</strong> &mdash; 18.08.2026 &mdash; Erster Guide: die vier Teile, aus denen eine
            Hub-Seite besteht, das eine Template, das dafür mitkommt, und die zwei Config-Felder, die es nie
            liest, die Zuordnung als Ort, an dem Badges verloren gehen, das intrinsische Spur-Rezept und die
            dreispaltige Leiter, die es ergibt, die drei Datenzustände, die routinemäßig zu einem
            zusammengelegt werden, die Ableitung, die einfriert, wenn sie einen einfachen Input liest, die Karte,
            die ein Link statt eines Buttons ist, das Paar aus gedämpftem Text, das auf dem Hover-Grund
            durchfällt, und der Kategoriewert, der ein Schlüsselfragment ist, das das Gate nicht prüfen kann.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class HubLayoutArticleDeComponent extends HubLayoutArticleComponent {}
