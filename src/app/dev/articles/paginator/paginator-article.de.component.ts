import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { PaginatorState } from '@openng/optimus-ui/types/paginator';
import { PaginatorArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './paginator-article.component';

/**
 * German twin of the Paginator guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the stand-in records, the
 * announcement and the visible strings in `m` are German. Keep it in step with
 * the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs paginator`).
 */
@Component({
  selector: 'app-paginator-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'paginator'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Der Paginator rendert eine Reihe Buttons und gibt eine Seite aus. Er rendert nie die Sammlung, lädt nie etwas
          und sagt nie laut, dass sich die Seite geändert hat — alles hier unten ist diese eine Reihe mit anderen
          Props, plus die Teile, die ein Aufrufer selbst mitbringen muss.
        </p>

        <h3>Die alltägliche Form, durchgehend verdrahtet</h3>
        <div class="stage stage--col">
          <ul class="slice">
            @for (item of visible(); track item) {
              <li>{{ item }}</li>
            }
          </ul>
          <nav aria-label="Beispieldatensätze">
            <p-paginator
              [rows]="rows()"
              [first]="first()"
              [totalRecords]="total"
              [rowsPerPageOptions]="[5, 10, 20]"
              [showCurrentPageReport]="true"
              [currentPageReportTemplate]="m.reportWired"
              (onPageChange)="onPage($event)"
            />
          </nav>
          <p class="sr-only" aria-live="polite">{{ announcement() }}</p>
          <p class="hint">
            Live-Anzeige — first: <code>{{ first() }}</code
            >, rows: <code>{{ rows() }}</code
            >, page: <code>{{ page() }}</code
            >. Die höfliche Region oben gehört dieser Seite, nicht der Komponente; wechsle die Seite, und ein
            Screenreader hört „{{ announcement() }}“.
          </p>
        </div>
        <p class="hint">{{ m.exWiredNote }}</p>

        <h3>Die Platzhalter des Berichts, alle sechs</h3>
        <div class="stage stage--col">
          <p-paginator
            [rows]="6"
            [first]="12"
            [totalRecords]="40"
            [showCurrentPageReport]="true"
            [showPageLinks]="false"
            [currentPageReportTemplate]="m.reportAllSix"
          />
        </div>
        <p class="src-note">
          Die sechs Namen oben sind der vollständige Satz; der Getter ersetzt jeden davon einmal
          (<code>openng-optimus-ui-paginator.mjs:523-531</code>). Ein siebter Name wird so gerendert, wie er dasteht.
        </p>

        <h3>Zwei Zustände, die du sehen solltest, bevor du sie auslieferst</h3>
        <div class="stage stage--col">
          <p class="hint">{{ m.exEmptyLabel }}</p>
          <p-paginator [rows]="10" [totalRecords]="0" [showCurrentPageReport]="true" />
          <p class="hint">{{ m.exSingleLabel }}</p>
          <p-paginator [rows]="10" [totalRecords]="4" [alwaysShow]="false" />
        </div>
        <p class="src-note">
          Leer ist <code>empty()</code>, die Seitenzahl mit null verglichen (<code>:517-519</code>); die verschwundene
          Leiste ist das <code>display</code>-Host-Binding unter <code>alwaysShow: false</code> (<code>:336-338</code>).
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          In dieser Bibliothek gibt es zwei Paginatoren, und sie sind dieselbe Komponente. Die Frage ist nie, welchen du
          nimmst, sondern wem die Liste gehört: Wenn eine Bibliothek die Zeilen rendert, rendert sie auch die Leiste.
        </p>

        <h3>Eigenständig oder eingebettet</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Die Sammlung wird gerendert von</th>
                <th>Greif zu</th>
                <th>Warum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Deinem eigenen Template — Cards, eine Liste, ein Bericht</td>
                <td><code>p-paginator</code> eigenständig</td>
                <td>Sonst kennt niemand die Anzahl der Datensätze oder weiß, wo der Ausschnitt beginnt.</td>
              </tr>
              <tr>
                <td><code>p-table</code></td>
                <td><code>[paginator]="true"</code> an der Tabelle</td>
                <td>Die Tabelle bettet diese Komponente schon ein und reicht einundzwanzig Bindings an sie weiter (neunzehn Paginator-Inputs plus die geerbten <code>pt</code> und <code>unstyled</code>).</td>
              </tr>
              <tr>
                <td><code>p-dataview</code></td>
                <td><code>[paginator]="true"</code> an der View</td>
                <td>Wieder dieselbe Komponente, nur ohne das Sprung-zur-Seite-Input und ohne die Ziffern-Locale.</td>
              </tr>
              <tr>
                <td>Ein Strom ohne Ende</td>
                <td>Ein „Mehr laden“-Button</td>
                <td>Seiten brauchen eine Gesamtzahl; ein Feed hat keine.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die beiden Einbettungen und ihre weitergereichten Inputs:
          <code>openng-optimus-ui-table.mjs:3104-3128</code> und
          <code>openng-optimus-ui-dataview.mjs:487-508</code>.
        </p>

        <h3>Gib der Leiste eine Landmark und eine Stimme</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die nackte Komponente, allein auf der Seite</span>
            <div class="dd__stage">
              <p-paginator [rows]="10" [first]="20" [totalRecords]="80" />
            </div>
            <p class="dd__why">{{ m.ddNavBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein benanntes nav darum und eine höfliche Region daneben</span>
            <div class="dd__stage">
              <nav aria-label="Suchergebnisse">
                <p-paginator [rows]="10" [first]="20" [totalRecords]="80" />
              </nav>
              <p class="hint">plus ein <code>&lt;p class="sr-only" aria-live="polite"&gt;</code>, das du beim Seitenwechsel beschreibst</p>
            </div>
            <p class="dd__why">{{ m.ddNavGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Das Bundle enthält kein <code>nav</code>, keine <code>role</code> und kein <code>aria-live</code>; die
          einzigen Bindings des Hosts sind <code>class</code> und <code>style.display</code>
          (<code>openng-optimus-ui-paginator.mjs:533</code>).
        </p>

        <h3>Lass „Erste Seite“ nie den einzigen Weg zurück sein</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Seitenlinks aus, „Erste Seite“ als Rücksprung</span>
            <div class="dd__stage">
              <p-paginator [rows]="10" [totalRecords]="80" [showPageLinks]="false" />
            </div>
            <p class="dd__why">{{ m.ddFirstBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Seitenlinks an, damit Seite eins ein Link mit Zustand ist</span>
            <div class="dd__stage">
              <p-paginator [rows]="10" [totalRecords]="80" />
            </div>
            <p class="dd__why">{{ m.ddFirstGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Auf Seite eins trägt der Button „Erste Seite“ die Klasse <code>p-disabled</code> (<code>:25-30</code>) und
          kein <code>[disabled]</code>-Attribut (<code>:543</code>), anders als „Vorherige Seite“, „Nächste Seite“ und
          „Letzte Seite“ (<code>:554</code>, <code>:608</code>, <code>:619</code>). Prüf es im Accessibility Tree des
          Browsers: Auf Seite eins muss der Button „Erste Seite“ als deaktiviert gemeldet werden, und heute wird er das
          nicht.
        </p>

        <h3>Kommentierter Quelltext — die Form zum Kopieren</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>

        <h3>Quellen</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#aria-current" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — <code>aria-current</code></a
            >
            — warum der Link der aktuellen Seite <code>page</code> trägt und warum nur ein Link das darf.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/status-changes.html" target="_blank" rel="noopener noreferrer"
              >WCAG 2.2 — SC 4.1.3 Status Messages</a
            >
            — ein Seitenwechsel, der keinen Fokus bewegt, schuldet trotzdem eine Ansage; die höfliche Region oben ist
            diese Ansage.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/"
              target="_blank"
              rel="noopener noreferrer"
              >W3C APG — Landmark Regions</a
            >
            — das benannte <code>nav</code>, das die Komponente dir überlässt.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Die Geometrie der Leiste ist die des Aura-Presets, und kein Block eines visuellen Stils fasst sie an; nur der
          Eckenradius des Roots (<code>&#123;content.border.radius&#125;</code>) folgt dem Stil. Ihre Farben regelt das
          Kit an drei Stellen, alle in <code>src/styles.scss</code> und alle vom Kontrast-Gate gemessen: Die Leiste malt
          das <code>--surface-card</code> des Stils, die aktuelle Seite nimmt das eigene gefüllte Paar des Akzents, und
          jeder Button trägt den einen Fokus-Ring des Kits.
        </p>

        <h3>Aura-Tokens, aus denen die Leiste gebaut ist</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Standardwerte der Paginator-Tokens, Aura-Preset
            </caption>
            <thead>
              <tr>
                <th>Token</th>
                <th>Wert</th>
                <th>Was es dimensioniert oder einfärbt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>root.padding</code> / <code>root.gap</code></td>
                <td>{{ m.tokenRoot }}</td>
                <td>Das Band um die Reihe und der Abstand zwischen den Buttons</td>
              </tr>
              <tr>
                <td><code>navButton.width</code> / <code>height</code></td>
                <td>{{ m.tokenNavBox }}</td>
                <td>Jeden Button in der Reihe — das Zeigerziel</td>
              </tr>
              <tr>
                <td><code>navButton.borderRadius</code></td>
                <td>{{ m.tokenNavRadius }}</td>
                <td>Den runden Button-Chip</td>
              </tr>
              <tr>
                <td><code>navButton.color</code> / <code>selectedBackground</code></td>
                <td>{{ m.tokenNavColor }}</td>
                <td>Die Glyphenfarbe im Ruhezustand und die Füllung hinter der aktuellen Seite</td>
              </tr>
              <tr>
                <td><code>navButton.focusRing.*</code></td>
                <td>{{ m.tokenFocus }}</td>
                <td>Auras Ring, den der eine Ring des Kits an jedem Button ersetzt</td>
              </tr>
              <tr>
                <td><code>jumpToPageInput.maxWidth</code></td>
                <td>{{ m.tokenJump }}</td>
                <td>Das Zahlenfeld unter <code>showJumpToPageInput</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und -Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/paginator/index.mjs</code>; die Regeln,
          die sie verbrauchen, einschließlich der <code>:focus-visible</code>-Selektorliste, aus
          <code>&#64;openng/optimus-ui-styles/dist/paginator/index.mjs</code>.
        </p>

        <h3>Auf einem schmalen Bildschirm bricht die Reihe um — sie scrollt nie und schneidet nie ab</h3>
        <p>{{ m.responsive }}</p>
        <p class="src-note">
          <code>.p-paginator</code> ist <code>display: flex</code> mit <code>flex-wrap: wrap</code> und
          <code>justify-content: center</code> (<code>&#64;openng/optimus-ui-styles/dist/paginator/index.mjs</code>);
          die Rechnung nutzt die Werte für <code>navButton</code> und <code>root.gap</code> aus der Tabelle oben.
        </p>

        <h3>Was das Kontrast-Kompilat hier misst</h3>
        <p>{{ m.contrastGap }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code>, Gruppen „table &amp; paginator“ (die Leiste, die Glyphe im Ruhezustand,
          die aktuelle Seite) und „focus ring“ (der Ring auf <code>paginator.background</code>); die Füllung und das Paar
          der aktuellen Seite werden im <code>.p-paginator</code>-Block von <code>src/styles.scss</code> umgelenkt, der
          Ring stammt aus der einen Ring-Liste des Kits dort.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Vier Zahlen steuern alles: <code>first</code>, <code>rows</code>, <code>totalRecords</code> und
          <code>pageLinkSize</code>. Drei davon haben Standardwerte, die nicht funktionieren, und die Komponente besitzt
          keine davon länger als einen Klick.
        </p>

        <h3>Inputs und ihre ausgelieferten Standardwerte</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Standard</th>
                <th>Was es tut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>rows</code></td>
                <td><code>0</code></td>
                <td>Seitengröße. Jede Seitenberechnung teilt durch diesen Wert, es ungesetzt zu lassen ist also kein Standard.</td>
              </tr>
              <tr>
                <td><code>totalRecords</code></td>
                <td><code>0</code></td>
                <td>Die Anzahl, aus der die Seitenrechnung abgeleitet wird. Null heißt: Die ganze Leiste ist wirkungslos, aber sichtbar.</td>
              </tr>
              <tr>
                <td><code>first</code></td>
                <td><code>0</code></td>
                <td>Nullbasierter Zeilen-Offset — kein Seitenindex.</td>
              </tr>
              <tr>
                <td><code>pageLinkSize</code></td>
                <td><code>5</code></td>
                <td>Wie viele nummerierte Links erscheinen; die aktuelle Seite wird nahe der Mitte gehalten.</td>
              </tr>
              <tr>
                <td><code>alwaysShow</code></td>
                <td><code>true</code></td>
                <td>Behält die Leiste bei einer einzigen Seite; <code>false</code> setzt <code>display: none</code>.</td>
              </tr>
              <tr>
                <td><code>showFirstLastIcon</code> / <code>showPageLinks</code></td>
                <td><code>true</code> / <code>true</code></td>
                <td>Die zwei Flags, die entscheiden, wie breit die Reihe wird.</td>
              </tr>
              <tr>
                <td><code>currentPageReportTemplate</code></td>
                <td><code>{{ m.reportDefault }}</code></td>
                <td>Englischer Fließtext mit einem Platzhalter darin — kein Übersetzungs-Key.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Reihenfolge der Deklarationen im Bundle: <code>openng-optimus-ui-paginator.mjs:172</code>, <code>:183</code>,
          <code>:213</code>, <code>:223</code>, <code>:228</code>, <code>:233</code>, <code>:260</code>; <code>first</code> hat
          keinen Initialwert am Input, seine <code>0</code> stammt aus <code>_first = 0</code> in <code>:331</code>.
        </p>

        <h3>Der Rückschreib-Vertrag</h3>
        <p>{{ m.writeBack }}</p>
        <pre class="code-block"><code>{{ eventSnippet }}</code></pre>
        <p class="src-note">
          Das ausgegebene Objekt wird in <code>changePage</code> gebaut (<code>:454-468</code>). Die kompilierte
          Output-Liste deklariert <code>onPageChange</code> und sonst nichts (<code>:533</code>), deshalb gibt es keine
          Zwei-Wege-Form von <code>first</code> oder <code>rows</code>.
        </p>

        <h3>Die Reihenfolge der Slots ist nicht konfigurierbar</h3>
        <p>{{ m.slotOrder }}</p>
        <p class="src-note">
          Abgelesen am Inline-Template (<code>openng-optimus-ui-paginator.mjs:534-671</code>); die kompilierte
          Input-Liste in <code>:533</code> enthält kein Layout-Input.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>{{ m.ck1 }}</li>
          <li>{{ m.ck2 }}</li>
          <li>{{ m.ck3 }}</li>
          <li>{{ m.ck4 }}</li>
          <li>{{ m.ck5 }}</li>
          <li>{{ m.ck6 }}</li>
          <li>{{ m.ck7 }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Kein einziger String dieser Komponente kommt aus deinem Template. Jeder Button-Name wird beim Rendern aus der
          gemeinsamen Optimus-Konfiguration gelesen — die das Kit in der Seitensprache befüllt —, und der Seitenbericht
          ist ein englischer Satz mit einem Platzhalter darin, den nur dein Binding übersetzen kann.
        </p>

        <h3>Woher jeder String kommt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was gesprochen oder gezeigt wird</th>
                <th>Quelle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Namen der Buttons Erste Seite / Vorherige Seite / Nächste Seite / Letzte Seite</td>
                <td>
                  Konfiguration <code>aria</code>: <code>firstPageLabel</code>, <code>prevPageLabel</code>,
                  <code>nextPageLabel</code>, <code>lastPageLabel</code>
                </td>
              </tr>
              <tr>
                <td>Name eines Seitenlinks</td>
                <td>Konfiguration <code>aria.pageLabel</code> — Standard ist die nackte Zahl</td>
              </tr>
              <tr>
                <td>Name der Auswahl für Zeilen pro Seite</td>
                <td>Konfiguration <code>aria.rowsPerPageLabel</code></td>
              </tr>
              <tr>
                <td>Name der Auswahl zum Springen auf eine Seite</td>
                <td>Konfiguration <code>aria.jumpToPageDropdownLabel</code></td>
              </tr>
              <tr>
                <td>Name des Eingabefelds zum Springen auf eine Seite</td>
                <td>Nichts — der Key existiert, und keine Komponente liest ihn</td>
              </tr>
              <tr>
                <td>Der Bericht zur aktuellen Seite</td>
                <td>Dein <code>currentPageReportTemplate</code>-Binding</td>
              </tr>
              <tr>
                <td>Das <code>showAll</code>-Label in den Zeilen-Optionen</td>
                <td>Dein Literal, innerhalb des Options-Arrays</td>
              </tr>
              <tr>
                <td>Sichtbare Seitenziffern</td>
                <td><code>Intl.NumberFormat</code> unter dem <code>locale</code>-Input</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die sieben Keys und ihre englischen Standardwerte stehen im gemeinsamen <code>aria</code>-Block
          (<code>openng-optimus-ui-config.mjs:176-210</code>); die Komponente liest sie über
          <code>getAriaLabel</code> und <code>getPageAriaLabel</code>
          (<code>openng-optimus-ui-paginator.mjs:366-371</code>).
        </p>

        <h3>Was das Kit schon übergibt</h3>
        <p>{{ m.i18nGap }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>syncAriaStrings</code> und <code>OPTIMUS_ARIA_KEYS</code> in
          <code>src/app/services/optimus-a11y.service.ts</code>; die Strings in
          <code>src/assets/i18n/modules/&lt;locale&gt;/optimus.json</code>. Erweitere die Liste, ersetze nicht den Aufruf:
          <code>setTranslation</code> führt nur eine Ebene tief zusammen, also muss der <code>aria</code>-Block
          ausgebreitet werden, bevor die Keys hinzukommen.
        </p>

        <h3>Zwei Dinge, die ein Sprachwechsel nicht behebt</h3>
        <ul class="checklist">
          <li>{{ m.i18nDigit }}</li>
          <li>{{ m.i18nReport }}</li>
        </ul>
        <p class="src-note">
          Die Ziffern-Aufspaltung ist <code>getLocalization</code> gegenüber dem Rohwert in
          <code>getPageAriaLabel</code> (<code>openng-optimus-ui-paginator.mjs:369-383</code>); der Standard des Berichts
          ist das String-Literal in <code>:213</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.2</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Die Leiste malt
            <code>--surface-card</code>, die aktuelle Seite nimmt das gefüllte Paar des Akzents und jeder Button den einen
            Ring des Kits, alles zitiert aus CONTRAST.MD; die sieben aria-Keys übergibt das Kit jetzt in der Seitensprache.
          </li>
          <li>
            <strong>v1.1</strong> — 23.09.2026 — Neu geprüft gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016):
            Alle Zeilenzitate halten außer dem Rückschreiben der Zeilen pro Seite (<code>:644</code>, nicht
            <code>:643</code>); das Farb-Token der Nav-Buttons korrigiert (ausgewählter Text ist
            <code>highlight.color</code>); Werte für Ruhezustand und aktuelle Seite aus den Tokens ergänzt; festgehalten,
            dass kein Stil-Block die Leiste anfasst; kommentierte Quellen schließen den Tab Verwendung ab; Agent-Doku
            gekürzt.
          </li>
          <li><strong>v1.0</strong> — 07.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class PaginatorArticleDeComponent extends PaginatorArticleComponent {
  /** German stand-in collection for the wired example (same length as the English one). */
  protected override readonly records = Array.from({ length: 47 }, (_, i) => 'Datensatz ' + String(i + 1));

  override onPage(event: PaginatorState): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? this.rows());
    this.announcement.set('Seite ' + String((event.page ?? 0) + 1) + ' von ' + String(event.pageCount ?? 1));
  }

  override readonly m = {
    exWiredNote:
      'Der Ausschnitt, die Anzeige und die Ansage gehören alle zu dieser Seite. Die Komponente hat die Reihe Buttons und ein Event beigesteuert; sie hat die Liste nicht angefasst, und sie hat nichts gesagt.',
    exEmptyLabel:
      'Nichts zu blättern: totalRecords ist 0, also sind „Vorherige Seite“, „Nächste Seite“ und „Letzte Seite“ deaktiviert, es werden keine Seitenlinks gerendert, und der Bericht sagt 0 of 0 — während die Leiste selbst auf dem Bildschirm bleibt.',
    exSingleLabel:
      'Nur eine Seite, mit alwaysShow auf false: Der Host bekommt display none, und die Leiste verschwindet ganz.',
    ddNavBad:
      'Ein Screenreader-Nutzer trifft auf eine unbeschriftete Gruppe von Buttons ohne Landmark, zu der er springen kann, und ohne Hinweis, welche Liste sie blättert; nach einem Klick wird nichts angesagt, weil die Komponente keine Live-Region besitzt.',
    ddNavGood:
      'Das nav gibt der Leiste einen Namen und einen Landmark-Halt, und die höfliche Region macht aus einem stummen DOM-Tausch einen Satz. Beides schreibst du selbst: Die Bibliothek liefert keins von beiden.',
    ddFirstBad:
      'Ohne Seitenlinks ist „Erste Seite“ der einzige Weg zurück zum Anfang — und auf Seite eins ist es der eine Button, der fokussierbar bleibt und sich als aktiviert meldet, also wird dem Tastatur-Nutzer eine verfügbare Aktion angekündigt, die nichts tut.',
    ddFirstGood:
      'Die nummerierten Links geben Seite eins ein Ziel, das aria-current trägt, und „Vorherige Seite“ deaktiviert sich an der Grenze wirklich. Behalte „Erste Seite“ als Abkürzung, nie als einzigen Weg.',
    tokenRoot: '0.5rem 1rem Padding, 0.25rem Abstand',
    tokenNavBox: '2.5rem Mindestbreite × 2.5rem Höhe (40 × 40 px bei ein oder zwei Ziffern; breitere Seitenzahlen wachsen)',
    tokenNavRadius: '50% — ein Kreis',
    tokenNavColor:
      '{text.muted.color} im Ruhezustand; Aura: {highlight.color} auf {highlight.background} für die aktuelle Seite — das Kit lenkt das auf primary.color mit primary.contrast.color um',
    tokenFocus:
      'die globale Gruppe {focus.ring.*} (1px) — das Kit ersetzt sie: 2px --primary-color-fg mit 2px Abstand',
    tokenJump: '2.5rem maximale Breite',
    reportDefault: '{currentPage} of {totalPages}',
    reportWired: 'Datensätze {first} bis {last} von {totalRecords}',
    reportAllSix: 'Seite {currentPage}/{totalPages} · Zeilen {rows} · {first}–{last} von {totalRecords}',
    responsive:
      'Die Leiste ist eine umbrechende Flex-Zeile, zentriert in ihrem Container: Sie fließt in eine zweite und dritte Zeile um, und nichts wird je versteckt, abgeschnitten oder gescrollt. Der Standardsatz — Erste Seite, Vorherige Seite, fünf Seitenlinks, Nächste Seite, Letzte Seite — besteht aus neun 2.5rem-Buttons plus acht 0.25rem-Abständen, braucht also 24.5rem (392px) Inhaltsbreite und bricht darunter um; eine Auswahl für Zeilen pro Seite oder ein Seitenbericht schiebt die Schwelle höher. Wenn bei 360px eine einzige Zeile zählt, senk pageLinkSize auf 3 und setz showFirstLastIcon auf false, statt die Reihe kleiner zu stylen.',
    contrastGap:
      'Jedes Farbpaar der Leiste ist durch das Gate geprüft. Die Leiste malt --surface-card (paginator.background auf --surface-card, 1,00:1, damit sie auf einer Card nie als Platte erscheint). Die Glyphe im Ruhezustand ist Auras {text.muted.color} darauf: paginator.nav.button.color, 4,76:1 hell und je nach Stil 5,12–6,56:1 dunkel — das Paar, das seiner Untergrenze am nächsten ist. Aura markierte die aktuelle Seite nur mit dem Highlight-Farbton (1,00–1,10:1 gegen die Leiste im hellen Modus), also gibt das Kit ihr stattdessen das eigene gefüllte Paar des Akzents: Die Füllung paginator.nav.button.selected.background hebt sich mit 4,75–17,85:1 von der Leiste ab (SC 1.4.11), und ihr Label liest sich darauf mit 5,18–17,85:1 (SC 1.4.3), über jeden Stil, Modus und Akzent. Der Fokus-Ring des Kits auf der Leiste ist die Zeile „focus ring“ auf paginator.background, 4,75–17,85:1.',
    writeBack:
      'Die Komponente hält first und rows intern und gibt sie einmal pro Seitenwechsel zurück. Sie gibt weder firstChange noch rowsChange aus, also gibt es hier kein Zwei-Wege-Binding mit eckigen Klammern und runden Klammern: Der Parent bleibt nur maßgeblich, wenn er beide Werte im Handler zurückschreibt. Das gilt auch für die Auswahl für Zeilen pro Seite, die rows direkt in die Komponente schreibt und es über dasselbe eine Event meldet.',
    slotOrder:
      'Linker Slot, Bericht zur aktuellen Seite, Erste Seite, Vorherige Seite, Seitenlinks, Auswahl zum Springen auf eine Seite, Nächste Seite, Letzte Seite, Eingabefeld zum Springen auf eine Seite, Auswahl für Zeilen pro Seite, rechter Slot. Diese Reihenfolge steht im Template fest, und kein Input ordnet sie um — die Sichtbarkeits-Flags entfernen nur Teile. Wenn etwas vor oder nach der Reihe sitzen muss, sind die zwei Template-Slots die ganze Antwort, und ihren Inhalt zugänglich zu machen ist deine Sache.',
    ck1: 'rows und totalRecords sind gebunden, und first wird im Seiten-Handler zurückgeschrieben.',
    ck2: 'Die Komponente sitzt in einem nav, das die Sammlung benennt, die sie blättert.',
    ck3: 'Eine höfliche Region, die dir gehört, nennt nach jedem Wechsel die neue Seite.',
    ck4: 'aria.pageLabel ist eine Wendung, damit ein Seitenlink nicht als nackte Ziffer angesagt wird — das Kit übergibt eine in jeder Sprache; behalte sie, wenn du eine eigene übergibst.',
    ck5: 'currentPageReportTemplate kommt aus der Übersetzungsschicht, nicht aus dem englischen Standard; die sieben aria-Keys tun das schon (das Kit übergibt sie).',
    ck6: 'Der Leerzustand ist dein eigener, keine wirkungslose Leiste über nichts.',
    ck7: 'Fokus-Ring, ausgewählte Seite und Glyphe im Ruhezustand als Computed Style in beiden Themes geprüft; die Reihe bei 360px geprüft, wo sie umbricht.',
    i18nGap:
      'Bei den Button-Namen ist keine mehr offen: Das Kit übergibt seine aria-Keys (OPTIMUS_ARIA_KEYS) bei jedem Sprachwechsel in der Seitensprache an die Optimus-Konfiguration, und alle sieben Keys, die diese Komponente liest, sind darunter — pageLabel als Wendung („Page {page}“, „Seite {page}“) statt des ausgelieferten nackten Platzhalters. Deine Sache bleibt das Berichts-Template unten. Ein neuer Key kommt in diese Liste und in die vier optimus.json-Dateien, die eine Spec gleich hält.',
    i18nDigit:
      'Ein gesetztes locale lokalisiert die sichtbaren Ziffern über Intl.NumberFormat, aber der zugängliche Name wird aus dem Rohwert gebaut — unter einer Locale mit nicht lateinischen Ziffern zeigt der Button ein Zeichen und sagt ein anderes an. Lass locale entweder ungesetzt oder nimm hin, dass die beiden auseinanderlaufen.',
    i18nReport:
      'currentPageReportTemplate hat als Standard englischen Fließtext, den keine Übersetzungsschicht erreicht, weil er ein Standardwert ist und kein Key. Binde ihn in jeder Sprache aus deinen eigenen Strings, auch in denen, in denen die Wortstellung um die Platzhalter anders ist.',
  };
}
