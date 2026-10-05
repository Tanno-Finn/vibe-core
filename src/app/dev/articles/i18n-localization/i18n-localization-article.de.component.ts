import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  I18nLocalizationArticleComponent,
  ARTICLE_IMPORTS,
  ARTICLE_STYLES,
} from './i18n-localization-article.component';

/**
 * German twin of the I18n & Localization guide (ADR-0018).
 *
 * Extends the English canonical article, so the live probes and code snippets
 * are shared; only the template is German (the English class holds no visible
 * prose — the probes resolve through the TranslationService). Keep it in step
 * with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs i18n-localization`).
 */
@Component({
  selector: 'app-i18n-localization-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'i18n-localization'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Vier Sprachvarianten, ein Nachschlagen und eine Fallback-Kette, die entscheidet, was ein Leser
          sieht, wenn ein Schlüssel fehlt. Alles hier unten wird über denselben Service aufgelöst, den der
          Rest der App nutzt, also ändert ein Sprachwechsel im Header es live.
        </p>

        <h3>Wozu die aktuelle Sprache auflöst</h3>
        <p>
          Vier gewöhnliche Schlüssel des Rahmens, genau jetzt gelesen. Der Code neben der Überschrift ist die
          aktive Variante; wechsle sie, und jeder Wert darunter ändert sich, weil jeder in einem
          <code>computed()</code> steckt, das von den Sprach- und Versions-Signals des Service abhängt.
        </p>
        <div class="probe">
          <div class="probe__head">
            <span class="probe__label">aktive Variante</span>
            <code class="probe__lang">{{ currentLang() }}</code>
          </div>
          @for (row of probe(); track row.key) {
            <div class="probe__row">
              <code>{{ row.key }}</code>
              <span class="probe__val">{{ row.value }}</span>
            </div>
          }
        </div>
        <p class="src-note">
          Beim Rendern aufgelöst über <code>src/app/services/translation.service.ts</code>; die Schlüssel
          liegen im Modul <code>common.json</code> jedes Sprachverzeichnisses.
        </p>

        <h3>Dieselben vier Schlüssel in allen vier Varianten</h3>
        <p>
          Die vereinfachten Varianten sind kein Filter über der Basissprache — sie sind eigene Dateien, deren
          Wortlaut je Sprache entschieden wird. Die letzten beiden Zeilen zeigen es: Für
          <code>common.close</code> ersetzt die deutsche Variante <em>Schließen</em> durch das schlichtere
          <em>Zumachen</em>, während die englische bei <em>Close</em> bleibt, und
          <code>common.search</code> ist in beiden Varianten unverändert. Genau darum geht es —
          Vereinfachen ist ein Urteil, das der Übersetzer jeder Sprache über den eigenen Wortlaut fällt, also
          kann sich ein Schlüssel in einer Variante ändern und in der anderen stehen bleiben.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Schlüssel</th><th><code>en</code></th><th><code>de</code></th><th><code>en-easy</code></th><th><code>de-easy</code></th></tr>
            </thead>
            <tbody>
              <tr><td><code>common.loading</code></td><td>Loading content</td><td>Inhalte werden geladen</td><td>The content is loading.</td><td>Die Inhalte werden geladen.</td></tr>
              <tr><td><code>common.cancel</code></td><td>Cancel</td><td>Abbrechen</td><td>Stop</td><td>Stoppen</td></tr>
              <tr><td><code>common.close</code></td><td>Close</td><td>Schließen</td><td>Close</td><td>Zumachen</td></tr>
              <tr><td><code>common.search</code></td><td>Search...</td><td>Suchen...</td><td>Search...</td><td>Suchen...</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte gelesen aus den vier Dateien <code>common.json</code> unter
          <code>src/assets/i18n/modules/</code>.
        </p>

        <h3>Ein Schlüssel, der nirgends auflöst, rendert als er selbst</h3>
        <p>
          Es gibt keinen Platzhalter, keinen leeren String und keinen Fehler. Das Nachschlagen geht die
          aktuelle Sprache durch, dann ihre Fallback-Kette, und wenn nichts passt, gibt es den Schlüssel
          zurück — und genau den sieht ein Leser und sagt ein Screenreader an. Die Box unten fragt nach einem
          Schlüssel, den kein Modul deklariert:
        </p>
        <div class="miss">
          <span class="miss__what">gerenderte Ausgabe</span>
          <span class="miss__out">{{ missingProbe() }}</span>
        </div>
        <p class="src-note">
          Verhalten abgelesen am abschließenden <code>return key</code> des Fallback-Nachschlagens in
          <code>src/app/services/translation.service.ts</code>; die Probe fragt nach einem Schlüssel, dessen
          erstes Segment kein Modulname ist, also ist er auch für
          <code>scripts/check-i18n-keys.mjs</code> unsichtbar — und das ist die Falle, kein Zufall dieser
          Demo.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Zwei Entscheidungen decken fast jeden String ab: wie der Schlüssel heißt und wo der aufgelöste Wert
          gehalten wird. Liegst du bei der zweiten falsch, stimmt der Text genau einmal — in dem Moment, in
          dem die Komponente erzeugt wurde.
        </p>

        <h3>Die Form eines Schlüssels</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Segment</th><th>Kommt aus</th><th>Beispiel</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Namespace</td>
                <td>dem Dateinamen des Moduls ohne Endung, wörtlich übernommen — keine Änderung der Schreibweise, keine Umwandlung in Kebab-Case</td>
                <td><code>devWorkshop</code>, <code>common</code>, <code>aiTimeline</code></td>
              </tr>
              <tr>
                <td>Pfad</td>
                <td>den verschachtelten Objektschlüsseln in dieser Datei, beliebig tief</td>
                <td><code>guides.relatedTitle</code></td>
              </tr>
              <tr>
                <td>Blatt</td>
                <td>ein String; ein Objekt am Ende des Pfads zählt als Fehltreffer</td>
                <td><code>devWorkshop.guides.relatedTitle</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Herleitung abgelesen am Bundle-Build in <code>scripts/build-i18n-bundles.ts</code>, der jedes Modul
          unter seinem Dateinamen ohne Endung ablegt; die Blatt-Regel aus dem Nachschlagen in
          <code>src/app/services/translation.service.ts</code>, das <code>null</code> zurückgibt, solange der
          aufgelöste Wert kein String ist.
        </p>

        <h3>Das Label-Muster</h3>
        <p>
          Die Konvention des Kits ist ein einziges <code>computed()</code>, das jeden String hält, den ein
          Template braucht, aufgelöst über den Service. Das ist keine Verzierung: Das Nachschlagen liest ein
          Versions-Signal, das hochzählt, wenn ein Bundle fertig geladen ist, also löst ein
          <code>computed()</code> bei einem Sprachwechsel <em>und</em> beim Eintreffen der Übersetzungen neu
          auf — das sind zwei verschiedene Momente, und der zweite ist der, der einen erwischt.
          <code>src/app/dev/articles/article-shell.component.ts</code> ist die Referenzimplementierung.
        </p>
        <pre class="code-block"><code>{{ labelPatternSnippet }}</code></pre>

        <h3>Platzhalter ersetzt du selbst</h3>
        <p>
          Das Nachschlagen gibt den gespeicherten String unverändert zurück. Interpolation ist ein
          <code>String.replace</code> an der Aufrufstelle, und der Bestand kennt zwei Formen — einfache und
          doppelte geschweifte Klammern —, also nimm die, die die benachbarten Schlüssel in deinem Namespace
          schon nutzen, statt eine dritte einzuführen. Es gibt keine Plural-Mechanik: Eine Anzahl, die den
          Satz verändert, braucht einen Schlüssel pro Form und eine Verzweigung, die du schreibst.
        </p>
        <pre class="code-block"><code>{{ placeholderSnippet }}</code></pre>

        <h3>Übersetzten Text durchsuchen</h3>
        <p>
          Dasselbe Kompositum wird in den Varianten auf drei Arten geschrieben: zusammen oder mit Bindestrich im
          Deutschen und Englischen (<em>Code-Review</em>) und mit einem Mediopunkt in einfachem Deutsch
          (<em>Code·review</em>), den der Hausstil für die Fugen langer zusammengesetzter Nomen vorsieht. Ein
          Leser tippt die Form, die er kennt, also vergleichen die Suchen des Kits — Glossar, Katalog,
          Navigation, Sitemap, Zeitleiste, News — gefaltete Strings — kleingeschrieben, Mittelpunkt und alle Bindestrich-Varianten entfernt —
          auf beiden Seiten des Vergleichs.
        </p>
        <pre class="code-block"><code>{{ searchSnippet }}</code></pre>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — einmal in ein Feld auflösen</span>
            <div class="dd__stage">
              <code class="dd__code">readonly title = this.i18n.translate('widget.title');</code>
            </div>
            <p class="dd__why">
              Ein Feld-Initializer läuft, wenn die Komponente erzeugt wird. Ist das Bundle noch nicht da,
              friert der Wert als roher Schlüssel ein, und er ändert sich nie wieder, wenn der Leser die
              Sprache wechselt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — es in einem Computed halten</span>
            <div class="dd__stage">
              <code class="dd__code">readonly title = computed(() =&gt; this.i18n.translate('widget.title'));</code>
            </div>
            <p class="dd__why">
              Das Nachschlagen liest die Sprach- und Versions-Signals des Service, also löst das Computed
              sowohl beim Eintreffen des Bundles als auch bei jedem späteren Wechsel neu auf.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — einen Satz aus Bruchstücken bauen</span>
            <div class="dd__stage">
              <code class="dd__code">t('a.deleted') + ' ' + n + ' ' + t('a.items')</code>
            </div>
            <p class="dd__why">
              Wortstellung, Kasus des Nomens und Position der Zahl sind alle sprachabhängig. Ein Übersetzer,
              der zwei Hälften bekommt, kann nichts davon richten, und die deutsche Hälfte braucht einen
              anderen Kasus, als die englische nahelegt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Schlüssel, ein Platzhalter</span>
            <div class="dd__stage">
              <code class="dd__code">t('a.deleted').replace('&#123;n&#125;', String(n))</code>
            </div>
            <p class="dd__why">
              Der ganze Satz bleibt in der Moduldatei, also kann ein Übersetzer die Zahl dorthin stellen, wo
              die Zielsprache sie haben will.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — mit der Portalsprache formatieren</span>
            <div class="dd__stage">
              <code class="dd__code">d.toLocaleDateString(this.i18n.currentLanguage)</code>
            </div>
            <p class="dd__why">
              Eine vereinfachte Variante ist keine Locale: Kein ISO-Register hat ein Tag dafür. Der Zusatz
              überlebt hier nur, weil <code>easy</code> zufällig als Script-Subtag geparst wird, und ein
              Regionalcode plus dieser Zusatz wirft sofort einen <code>RangeError</code>. Ein nacktes
              <code>toLocaleDateString()</code> ist noch schlimmer: Es formatiert in der Locale des Browsers,
              nicht der Seite, und unterscheidet sich zwischen Prerender und Browser.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Locale-Helfer fragen</span>
            <div class="dd__stage">
              <code class="dd__code">d.toLocaleDateString(dateLocaleFor(this.i18n.currentIntlLocale))</code>
            </div>
            <p class="dd__why">
              Der Helfer entfernt den Zusatz und ergänzt die Hausregion — <code>en-US</code> ergibt
              <em>July 15, 2026</em>, <code>de-DE</code> <em>15. Juli 2026</em> —, sodass die Reihenfolge nie
              vom Standard der Engine für ein nacktes <code>en</code> abhängt. Zahlen nehmen
              <code>numberLocaleFor()</code> oder <code>formatNumberFor()</code> aus derselben Datei.
            </p>
          </div>
        </div>

        <h3>Quellen für diesen Tab</h3>
        <p class="src-note">
          Das Label-Muster ist die Konvention von
          <code>src/app/dev/articles/article-shell.component.ts</code>; der Grund für das Versions-Signal und
          der Vorbehalt zu <code>currentIntlLocale</code> stehen in
          <code>src/app/services/translation.service.ts</code>, dessen eigener Kommentar den
          <code>RangeError</code> nennt. Die Hausregionen sind die Tabelle in
          <code>src/app/utils/date-locale.ts</code>, das Falten ist
          <code>src/app/utils/search-fold.ts</code>. Die zwei Platzhalter-Formen wurden über das deutsche
          Modulverzeichnis gezählt.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Ein Verzeichnis pro Sprache, eine Datei pro Namespace, zur Build-Zeit ein kleines Core-Bundle plus
          Lazy Chunks pro Sprache. Das Interessante ist nicht die Pipeline — es ist die Frage, welche Sprache
          antwortet, wenn die, nach der du gefragt hast, es nicht kann.
        </p>

        <h3>Wo ein String wohnt</h3>
        <p>
          Geschrieben wird in <code>src/assets/i18n/modules/</code>, ein Verzeichnis pro Sprachcode und darin
          eine JSON-Datei pro Namespace. Der Build fasst die Shell-Namespaces einer Sprache zu einem
          Core-Bundle zusammen und schreibt jeden seitengroßen Namespace (aufgelistet in
          <code>src/config/i18n-bundles.json</code>) als eigenen Chunk. Der Core lädt vor der ersten Route;
          die eigenen Namespaces einer Route laden in <code>translationReadyGuard</code>, jeder andere Chunk
          beim ersten Nachschlagen eines seiner Schlüssel. Die gebauten Dateien werden erzeugt, nicht
          versioniert.
        </p>
        <p class="src-note">
          Zusammenbau der Bundles aus <code>scripts/build-i18n-bundles.ts</code>; der Core-Request und seine
          Leiter aus Wiederholung, dann Englisch, dann leer aus
          <code>src/app/services/translation-loader.service.ts</code>.
        </p>

        <h3>Die Fallback-Kette</h3>
        <p>
          Jeder Fehltreffer geht die Kette des Lesers der Reihe nach durch und gibt den ersten Treffer zurück.
          Englisch ist das letzte Glied aller vier, und nach Englisch selbst kommt kein Glied mehr — deshalb ist
          das englische Bundle der Boden des ganzen Systems und nicht eine Sprache unter vieren.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Variante des Lesers</th><th>Kette nach einem Fehltreffer</th><th>Überall fehlend</th></tr>
            </thead>
            <tbody>
              <tr><td><code>en</code></td><td>— keine —</td><td>rendert den Schlüssel</td></tr>
              <tr><td><code>de</code></td><td><code>en</code></td><td>rendert den Schlüssel</td></tr>
              <tr><td><code>en-easy</code></td><td><code>en</code></td><td>rendert den Schlüssel</td></tr>
              <tr><td><code>de-easy</code></td><td><code>de</code>, dann <code>en</code></td><td>rendert den Schlüssel</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Ketten abgelesen am Fallback-Nachschlagen in
          <code>src/app/services/translation.service.ts</code>; <code>translateValue()</code> in derselben
          Datei zieht keine davon heran und gibt stattdessen <code>null</code>
          zurück.
        </p>

        <h3>Die Varianten sind Sprachen, keine Overlays</h3>
        <p>
          Eine vereinfachte Variante hat ihr eigenes Verzeichnis, ihre eigenen Namespace-Dateien und ihren
          eigenen Schlüsselsatz, und ihr Wortlaut wird eigenständig entschieden. Was sie nicht darf, ist in der
          Abdeckung auseinanderlaufen: Das Gate für rohe Schlüssel lässt den Build an jedem Schlüssel
          scheitern, den Englisch hat und eine Variante nicht, also ist die Fallback-Kette ein Sicherheitsnetz
          für einen Schlüssel in Arbeit, kein Freibrief, das Übersetzen auszulassen. Schlüssel, die nur eine
          vereinfachte Variante hat, werden gezählt statt abgelehnt; heute gibt es keine.
        </p>
        <p class="src-note">
          Namespaces und Schlüsselsätze gezählt über die vier Verzeichnisse unter
          <code>src/assets/i18n/modules/</code>: Alle vier haben dieselben 69 Namespaces und dieselben
          3.854 Blattschlüssel. Die Paritätsregel steht in <code>scripts/check-i18n-keys.mjs</code>.
        </p>

        <h3>Textlänge, gemessen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Messgröße</th><th>Wert</th></tr>
            </thead>
            <tbody>
              <tr><td>String-Schlüssel, die Englisch und Deutsch teilen</td><td>3.826</td></tr>
              <tr><td>Zeichen insgesamt, Deutsch ÷ Englisch</td><td>1,08×</td></tr>
              <tr><td>Strings, in denen Deutsch der längere ist</td><td>69,6 % (2.661 von 3.826)</td></tr>
              <tr><td>Verhältnis pro String, Median / p90 / p95 / Maximum</td><td>1,08× / 1,28× / 1,40× / 2,31×</td></tr>
              <tr><td>Längstes ungebrochenes Wort</td><td>25 Zeichen Deutsch, 20 Englisch</td></tr>
              <tr><td>Längste URL</td><td>53 Zeichen Deutsch, 51 Englisch</td></tr>
              <tr><td>Längstes ungebrochenes Token — ein Dateipfad-Zitat</td><td>61 Zeichen in beiden</td></tr>
              <tr><td>Vereinfachte Variante ÷ ihre Basis</td><td>0,72× Deutsch, 0,71× Englisch</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gezählt über jeden Schlüssel, den beide Verzeichnisse als String deklarieren (keiner ist leer). Die
          Quantile pro String laufen über die 3.279 davon, deren englischer Wert mindestens zehn Zeichen hat.
          Wörter und Token sind an Leerraum getrennt, HTML-Tags entfernt; ein Wort ist eine Folge von
          Buchstaben, also zählen Bezeichner in Code-Spans nicht. Die Zeile zu den vereinfachten Varianten
          vergleicht dieselben Schlüssel, misst also den Wortlaut, nicht die Abdeckung.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Die Übersetzungsschicht hat <strong>kein eigenes responsives Verhalten</strong>: Sie misst nichts,
          bricht nichts um und kürzt nichts. Ein String kommt in der Länge an, in der der Übersetzer ihn
          geschrieben hat, bei jedem Viewport — was sich mit dem Viewport ändert, ist nur, ob diese Länge noch
          passt. Die Zahlen oben sind das Budget: Plane für ein Label, das nicht umbrechen darf, etwa das
          1,4-Fache der englischen Breite ein. Für den horizontal schlimmsten Fall ist die Einheit das längste
          ungebrochene <em>Token</em>, nicht das längste Wort — eine Spalte von 360 px muss ein Dateipfad-Zitat
          von 61 Zeichen und eine Lizenz-URL von 53 Zeichen überstehen, weit mehr als das längste deutsche Wort
          mit 25 Zeichen, und keins von beiden wird an einem Schrägstrich umbrochen, solange der Container
          nicht <code>overflow-wrap: anywhere</code> sagt. Hinweis fürs Layout: Gib
          jedem Container, der einen übersetzten String rendert, eine Umbruchregel und ein Flex-Elternelement
          mit <code>min-width: 0</code>, bemiss Controls nach ihrem Inhalt, statt eine Breite am englischen
          Text festzumachen, und lass ein langes Wort umbrechen, statt die Seite seitlich wegzuschieben.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Einen String, einen Namespace oder eine Sprache hinzuzufügen sind drei verschieden große Änderungen.
          Nur die letzte fasst die Konfiguration an, und nur die erste ist vollständig von einem Gate abgedeckt.
        </p>

        <h3>Einen Schlüssel oder einen Namespace hinzufügen</h3>
        <pre class="code-block"><code>{{ addKeySnippet }}</code></pre>
        <p class="src-note">
          Das Gate, das scheitern lässt (<code>scripts/check-i18n-keys.mjs</code>), und der Lückenbericht des
          Bundle-Builds messen beide gegen <code>keySourceLanguage</code> in
          <code>src/config/languages.json</code> — Englisch. Die deutsche
          <code>contentReferenceLanguage</code> ist eine andere Idee: der letzte Rückgriff der
          Inhalts-Bundles, nicht der UI-Strings.
        </p>

        <h3>Eine Sprache hinzufügen</h3>
        <pre class="code-block"><code>{{ addLanguageSnippet }}</code></pre>
        <p class="src-note">
          Form der Config aus <code>src/config/languages.json</code>; die Regeln, die daraus die Liste der
          Sprachauswahl, URL-Präfixe, SEO-Sprachen und beide Fallback-Ketten ableiten, stehen in
          <code>src/config/language-rules.mts</code>, das App und Build-Skripte gemeinsam nutzen.
        </p>

        <h3>Optimus UI seine eigenen Strings geben</h3>
        <p>
          Die Bibliothek liest ihr Screenreader-Vokabular aus ihrer eigenen Config, nicht aus deinen Modulen.
          Die Shell verbindet beides, indem sie die Sync-Methode des Accessibility-Service in einem
          <code>effect()</code> ausführt — ein Effect statt eines einmaligen Aufrufs, weil der erste Durchlauf
          sonst liefe, bevor das Bundle da ist, und der Bibliothek einen rohen Schlüssel gäbe. Der Service
          spreizt den aktuellen <code>aria</code>-Block, bevor er seine Überschreibungen schreibt, und sagt
          neben dem Aufruf, warum: Er behandelt das Zusammenführen so, als ersetze es diesen Block vollständig,
          also überlebt ein Schlüssel nicht, der im Spread fehlt.
          Welche Namen der Bibliothek überhaupt eine Überschreibung wert sind, ist eine Frage der Benennung
          und gehört zu <strong>Richtlinien zur Barrierefreiheit</strong>; hier bleibt die Übergabe.
        </p>
        <pre class="code-block"><code>{{ primeNgSnippet }}</code></pre>
        <p class="src-note">
          Der Effect steht in <code>src/app/app.component.ts</code>; der Spread und der Kommentar, der die
          Tiefe des Zusammenführens angibt, stehen in <code>src/app/services/optimus-a11y.service.ts</code> —
          die Tiefe ist eine eigene Aussage dieses Kits über
          die Bibliothek, und der Spread ist die Art, wie das Kit danach handelt, keine Lesart des
          Bibliotheksquelltexts. Die Schlüssel selbst sind das Modul <code>optimus.json</code> jeder Sprache;
          <code>src/app/app.config.ts</code> gibt der Bibliothek keinen <code>translation</code>-Block
          mit.
        </p>

        <h3>Was die Gates durchsetzen und was sie nicht sehen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Prüfung</th><th>Lässt den Build scheitern, wenn</th><th>Blind für</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>scripts/check-i18n-keys.mjs</code></td>
                <td>
                  ein fester Schlüssel, dessen erstes Segment ein englisches Modul nennt, in diesem Modul nicht
                  auflöst; einer Variante ein Schlüssel fehlt, den Englisch hat; ein Wert leer ist; oder mehr
                  Schlüssel unreferenziert sind, als <code>ORPHAN_BASELINE</code> erlaubt &mdash; null, also
                  scheitert jeder Schlüssel, den nichts liest. Ein zur
                  Laufzeit gebauter Schlüssel zählt nur unter einem Eintrag in <code>DYNAMIC_PREFIXES</code>
                  (Präfix plus Grund) als referenziert, und ein Eintrag, den keine Quelle mehr baut, scheitert als veraltet
                </td>
                <td>ein falsch geschriebenes Namespace-Segment (übersprungen, nicht abgelehnt), ob ein zur Laufzeit gebauter Schlüssel auflöst, und Schlüssel, die nur eine vereinfachte Variante hat (gezählt, nicht abgelehnt)</td>
              </tr>
              <tr>
                <td><code>scripts/check-house-style.mjs</code></td>
                <td>
                  Deutsch oder einfaches Deutsch außerhalb des Impressums die Anrede mit <code>Sie</code> nutzt,
                  einen Genderstern, Doppelpunkt oder eine Paarform statt des generischen Maskulinums,
                  <code>»…«</code> oder ein unpassendes Anführungszeichenpaar statt „…“; Standarddeutsch
                  einen Mediopunkt nutzt oder einfaches Deutsch einen auf ein kurzes Kompositum, außerhalb eines
                  Nomens setzt oder ein Kompositum auf zwei Arten schreibt; Englisch eine britische Schreibung aus
                  seiner Liste oder ein Datum in der Folge Tag-Monat-Jahr nutzt
                </td>
                <td>das Serial Comma, gerade Anführungszeichen in deutscher Prosa, ein förmliches <code>Sie</code> am Satzanfang und ein langes Kompositum, das nirgends getrennt wird</td>
              </tr>
              <tr>
                <td><code>scripts/check-genericity.mjs</code></td>
                <td>ein Übersetzungs<em>wert</em> in irgendeiner Sprache auf die Branding-Sperrliste passt (generische Marker, plus eine Workspace-Liste der Namen, die ein abgeleitetes Projekt nicht tragen darf)</td>
                <td>Branding in Schlüsselnamen und jede Formulierung, die nicht auf der Liste steht</td>
              </tr>
              <tr>
                <td><code>scripts/check-language-guide.mjs</code></td>
                <td>ein Übersetzungsleitfaden einer Sprache eine seiner neun mechanischen Regeln bricht</td>
                <td>ob eine zitierte Regel ihrer angegebenen Quelle treu ist</td>
              </tr>
              <tr>
                <td><code>scripts/build-i18n-bundles.ts</code> mit <code>--prod</code></td>
                <td>ein in der Config genanntes Sprachverzeichnis nicht existiert</td>
                <td>einen fehlenden Namespace in einem Verzeichnis — der Lückenbericht wird ausgegeben, und der Build läuft weiter</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an den Skripten in der ersten Spalte (der Kopf jedes Skripts listet seine Regeln und
          seine blinden Flecken) und an der Kette <code>build:verify</code> in <code>package.json</code>,
          die jede Prüfung außer dem Bundle-Build ausführt. Der Hausstil selbst ist ausgeschrieben in
          <code>directives/languages/de.md</code> und <code>directives/languages/en.md</code>.
        </p>

        <h3>Bevor du es übersetzt nennst</h3>
        <ul class="checklist">
          <li>Der Schlüssel existiert im englischen Modul — der Referenz des Gates und dem Ende jeder Kette.</li>
          <li>Derselbe Schlüssel existiert in den anderen drei Varianten, oder du hast den Fallback-Wortlaut bewusst akzeptiert.</li>
          <li>Jeder sichtbare String wird über den Service gelesen; in einem Template für Leser überlebt kein fester Text.</li>
          <li>Labels stecken in einem <code>computed()</code>, nicht in einem Feld, das bei der Erzeugung aufgelöst wird.</li>
          <li>Datums- und Zahlenangaben laufen über <code>src/app/utils/date-locale.ts</code>, nie über ein nacktes <code>toLocaleString()</code> oder eine fest verdrahtete Locale.</li>
          <li>Ein zur Laufzeit gebauter Schlüssel hat sein Präfix in <code>DYNAMIC_PREFIXES</code>; ein Schlüssel, den nichts mehr liest, ist in allen vier Varianten gelöscht.</li>
          <li>Eine Suche über übersetzten Text faltet beide Seiten mit <code>foldForSearch()</code>.</li>
          <li>IDs, Routensegmente, <code>name</code>-Attribute von Formularen und Optionswerte sind unübersetzt geblieben.</li>
          <li>Die längste Übersetzung passt bei 360 px noch ins Control, oder das Control bricht um.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Die Mechanik, die die App übersetzt, hat eigene Strings, und zwei der Labels, die sie zeigt, gehören
          absichtlich nicht dazu.
        </p>

        <h3>Wer eine Sprache benennt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Label</th><th>Woher es kommt</th><th>Übersetzt?</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Der eigene Name der Sprache in der Liste</td>
                <td><code>nativeName</code> / <code>easyNativeName</code> in <code>src/config/languages.json</code></td>
                <td>nein — ein Endonym, einmal in dieser Sprache geschrieben und mit eigenem <code>lang</code> markiert</td>
              </tr>
              <tr>
                <td>Der Umschalter für einfache Sprache neben der Liste</td>
                <td>das Modul <code>settings.json</code> jeder Sprache</td>
                <td>ja, in allen vier Varianten</td>
              </tr>
              <tr>
                <td>Die Reifemarke an einer nicht finalen Sprache</td>
                <td>ein fester Text in <code>src/app/components/shared/language-picker.component.ts</code></td>
                <td>nein — fest verdrahteter englischer Text in der Option, also wird er Teil des zugänglichen Namens der Option</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Quellen wie in der mittleren Spalte genannt; die Reife selbst ist abgeleitet, nicht geschrieben — sie
          ist das Flag <code>seoEnabled</code> aus <code>src/config/seo-languages.config.ts</code>,
          gelesen über dessen Beta-Helfer, mit entferntem Easy-Zusatz, sodass eine Variante den Status ihrer
          Basissprache erbt.
        </p>

        <h3>Endonyme sind eine Regel, kein Versäumnis</h3>
        <p>
          Eine Sprachliste, die in die aktuelle Sprache übersetzt ist, ist für genau den Leser unbrauchbar, der
          sie braucht: Wer in einer Sprache feststeckt, die er nicht lesen kann, sucht nach dem Wort, das er
          kennt. Die Namen in der Liste so zu belassen heißt, dass sie sich nie bewegen, und deshalb sind sie
          Config-Werte statt Schlüssel. Fügst du eine Sprache hinzu, schreibst du ihr Endonym einmal, in ihrer
          eigenen Schrift, und nie wieder; die Sprachauswahl umgibt es mit einem eigenen <code>lang</code>,
          damit ein Screenreader es in dieser Sprache ausspricht.
        </p>

        <h3>Die Marke, die keine ausgelieferte Sprache auslöst</h3>
        <p>
          Beide ausgelieferten Sprachen sind final, also rendert die Reifemarke bei keiner von beiden. Zu einem
          sichtbaren unübersetzten Wort wird sie in jedem Projekt, das eine Sprache aktiviert, die es nicht ist
          — ein Projekt, das eine solche hinzufügt, gibt dieser Marke also einen Schlüssel, und das ist die
          Regel, die <strong>Richtlinien zur Barrierefreiheit</strong> für jeden Namen aufstellt, den ein Leser hört.
        </p>

        <h3>Was diese Schicht nicht entscheidet</h3>
        <p>
          Das Sprachattribut des Dokuments wird einmal in <code>src/index.html</code> geschrieben und hat
          danach zur Laufzeit genau einen Schreiber — und das ist nicht dieser Service.
          <strong>Richtlinien zur Barrierefreiheit</strong> besitzt diese Regel, einschließlich der Frage, warum
          der Zusatz für vereinfachte Sprache entfernt wird, bevor das Tag geschrieben wird. Die Schreibrichtung
          ist die Grenze desselben Guides: Nirgends ist eine Richtung gesetzt, und eine Sprache, die von rechts
          nach links läuft, hinzuzufügen ist ein Layout-Projekt, kein Übersetzungsprojekt. Welche Schriften der
          Font-Stack tatsächlich darstellen kann, ist Thema von <strong>Typografie</strong>, und es lohnt sich,
          das zu lesen, bevor du eine Sprache hinzufügst, deren Schrift nicht lateinisch ist.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.5</strong> — 23.09.2026 — Die Gates, wie sie jetzt stehen: Das Gate für rohe
            Schlüssel scheitert auch an leeren Werten und an unreferenzierten Schlüsseln jenseits seiner
            Baseline, wobei zur Laufzeit gebaute Präfixe in <code>DYNAMIC_PREFIXES</code> deklariert sind; das
            Hausstil-Gate kommt in die Tabelle. Datums- und Zahlenangaben laufen über
            <code>src/app/utils/date-locale.ts</code>, Suchen falten die Fugenzeichen von Komposita
            (<code>src/app/utils/search-fold.ts</code>). Schlüsselzahlen, Parität und Textlänge über die
            aktuellen Module neu gezählt; die ARIA-Übergabe verweist auf
            <code>optimus-a11y.service.ts</code>; Endonyme kommen aus der Sprach-Config.</li>
          <li><strong>v0.4</strong> — 22.09.2026 — Das Bundle ist geteilt: ein Core pro Sprache
            plus Lazy Chunks (<code>src/config/i18n-bundles.json</code>), geladen vom Route-Guard
            oder beim ersten Nachschlagen. Sprachen, die drei benannten Sprachen und beide Fallback-Ketten kommen
            aus <code>src/config/languages.json</code> über
            <code>src/config/language-rules.mts</code>; Gate und Lückenbericht teilen die englische
            Schlüsselquelle, und das Gate prüft die Parität. <code>languageChanged</code> ist jetzt eine
            aus Signals abgeleitete Sicht, kein Subject.</li>
          <li><strong>v0.3</strong> — 24.08.2026 — Erneut geprüft mit PrimeNG 22.1:
            <code>setTranslation</code> führt weiterhin eine Ebene tief zusammen
            (<code>openng-optimus-ui-config.mjs:246-249</code>), also bleibt der Spread des
            <code>aria</code>-Blocks nötig; die 11 übergebenen Schlüssel und das Fehlen eines
            <code>translation</code>-Blocks in <code>provideOptimus</code> sind unverändert.
            Herkunftsstand angehoben.</li>
          <li><strong>v0.2</strong> — 18.08.2026 — Review-Durchgang. Die Referenz des Lückenberichts ist
            im Build-Skript fest verdrahtet, nicht aus dem Config-Feld genommen, und der Tab Entwicklung
            sagt das jetzt. Die Prosa unter Beispiele beschreibt die Zellen, die die Tabelle tatsächlich enthält.
            Das Budget für schmale Bildschirme wechselt vom längsten Wort zum längsten ungebrochenen Token,
            einer URL mit 54 Zeichen, mit beiden Zahlen in der Tabelle. Die Zusammenführungstiefe der Bibliothek
            wird der eigenen Aussage des Kits zugeschrieben statt der Bibliothek, und die Wahl, welche
            ARIA-Namen überschrieben werden, verweist jetzt auf Richtlinien zur Barrierefreiheit, statt sie zu
            wiederholen. Verwandte Listen wechselseitig mit den vier Geschwister-Guides der Grundlagen
            gemacht.</li>
          <li><strong>v0.1</strong> — 18.08.2026 — Erster Guide: die vier ausgelieferten Varianten und
            ihr Modul-Layout, die Fallback-Kette und was ein vollständiger Fehltreffer rendert, die zwei
            Referenzsprachen, über die die Werkzeuge uneins sind, das Fehlen von Interpolations- und
            Plural-Mechanik, die PrimeNG-ARIA-Übergabe, die über die gemeinsamen Schlüssel gemessene Textlänge
            und das kanonische Agenten-Dokument.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class I18nLocalizationArticleDeComponent extends I18nLocalizationArticleComponent {}
