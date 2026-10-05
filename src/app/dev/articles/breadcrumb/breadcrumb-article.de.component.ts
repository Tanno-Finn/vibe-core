import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuItem } from '@openng/optimus-ui/api';
import { BreadcrumbArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './breadcrumb-article.component';

/**
 * German twin of the Breadcrumb guide (ADR-0018).
 *
 * Extends the English canonical article, so state, measured values and code snippets
 * are shared; only the template, the demo trails and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and binding
 * skeleton (`node scripts/check-guide-translations.mjs breadcrumb`).
 */
@Component({
  selector: 'app-breadcrumb-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'breadcrumb'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Breadcrumb ist eine einzeilige Antwort auf „Wo bin ich?“. Alles hier unten ist die echte
          Optimus-UI-Komponente: ein <code>p-breadcrumb</code>, gefüttert mit einem <code>MenuItem[]</code>, mit einem
          optionalen <code>home</code>-Wurzeleintrag und einem Chevron, den die Bibliothek zwischen die Einträge zeichnet.
        </p>

        <h3>Playground</h3>
        <div class="stage">
          <p-breadcrumb
            [model]="playgroundModel()"
            [home]="playgroundHome()"
            [homeAriaLabel]="'Startseite'"
            [pt]="navName"></p-breadcrumb>
        </div>
        <div class="controls">
          <label class="ctl" for="bc-home">
            <p-toggleswitch inputId="bc-home" [(ngModel)]="showHomeModel"></p-toggleswitch>
            <span>Home-Eintrag</span>
          </label>
          <label class="ctl" for="bc-deep">
            <p-toggleswitch inputId="bc-deep" [(ngModel)]="deepModel"></p-toggleswitch>
            <span>neun Krumen</span>
          </label>
          <label class="ctl" for="bc-inert">
            <p-toggleswitch inputId="bc-inert" [(ngModel)]="inertLastModel"></p-toggleswitch>
            <span>inaktive letzte Krume</span>
          </label>
        </div>
        <p class="src-note">
          Die drei Schalter steuern nichts als die Inputs <code>model</code> und <code>home</code> — die Komponente hat
          insgesamt fünf Inputs (<code>openng-optimus-ui-breadcrumb.mjs:202</code>), und keiner davon ist eine Variante,
          eine Größe oder eine Dichte.
        </p>

        <h3>Die gerenderte Anatomie</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Die Elementstruktur und ihre Klassennamen, aus dem Template der Komponente
          (<code>openng-optimus-ui-breadcrumb.mjs:203-205</code>) und der <code>classes</code>-Map (<code>:19-27</code>).
          Achte auf das äußerste Element: Die Komponente <em>ist</em> das <code>nav</code>.
        </p>

        <h3>Ein Pfad mit neun Krumen in einer 360px-Spalte</h3>
        <div class="stage stage--narrow">
          <p-breadcrumb [model]="longTrail" [pt]="navName"></p-breadcrumb>
        </div>
        <p class="src-note">
          Die Spalte ist genau {{ m.narrowWidth }} breit. Nichts bricht um und nichts wird gekürzt — zieh im Pfad, oder
          drück <kbd>Tab</kbd> durch ihn hindurch, und er scrollt seitwärts
          (<code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:5</code>, <code>:14</code>).
        </p>

        <h3>Ein eigenes Trennzeichen</h3>
        <div class="stage">
          <p-breadcrumb [model]="shortTrail" [pt]="navName">
            <ng-template #separator><span class="slash">/</span></ng-template>
          </p-breadcrumb>
        </div>
        <p class="src-note">
          Der projizierte Inhalt ersetzt nur den Chevron; das <code>&lt;li&gt;</code> darum behält
          <code>aria-hidden="true"</code> (<code>openng-optimus-ui-breadcrumb.mjs:285</code>, <code>:377</code>), also
          kann ein Trennzeichen nie Bedeutung tragen.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Drei Bedienelemente in diesem Kit zeichnen eine waagrechte Reihe kurzer Labels, und nur bei einem davon geht es
          um die Position in einer Hierarchie. Wer nach dem Aussehen wählt, landet bei einem Breadcrumb, der einen
          Assistenten erzählt.
        </p>

        <h3>Welches Bedienelement</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Der Leser will wissen …</th>
                <th>Bedienelement</th>
                <th>Warum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>wo diese Seite steht und wie es nach oben geht</td>
                <td><code>p-breadcrumb</code></td>
                <td>Eine geordnete Liste von Vorfahren, die bei der aktuellen Seite endet.</td>
              </tr>
              <tr>
                <td>wohin er als Nächstes gehen könnte</td>
                <td><code>p-menubar</code> oder ein <code>&lt;nav&gt;</code> mit Links</td>
                <td>Eine Menge von Zielen ist keine Abstammung; nichts daran ist nach Tiefe geordnet.</td>
              </tr>
              <tr>
                <td>wie weit er in einer Aufgabe ist</td>
                <td>ein Stepper</td>
                <td>Schritte lassen sich abschließen und sind zeitlich geordnet; Vorfahren sind beides nicht.</td>
              </tr>
              <tr>
                <td>wie er hierhergekommen ist</td>
                <td>nichts — dafür gibt es den Zurück-Button</td>
                <td>Ein Breadcrumb gibt die Struktur der URL wieder, nicht den Verlauf des Besuchs.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Abgrenzung gegen eine Befehlsleiste ist dieselbe, die der Guide Menubar von der anderen Seite zieht; die
          Abstammungs-Aussage ist das eigene <code>&lt;ol&gt;</code> der Komponente
          (<code>openng-optimus-ui-breadcrumb.mjs:204</code>).
        </p>

        <h3>Welche <code>MenuItem</code>-Felder wirken</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Feld</th>
                <th>Wirkung hier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>label</code></td>
                <td>Der sichtbare Text, standardmäßig escaped ({{ m.escapeDefault }}).</td>
              </tr>
              <tr>
                <td><code>routerLink</code></td>
                <td>Navigation innerhalb der App, plus die RouterLink-Inputs, die das Template weiterreicht.</td>
              </tr>
              <tr>
                <td><code>url</code></td>
                <td>Ein schlichtes <code>href</code> — der Browser lädt das Dokument neu.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>Ein Klassenname an einem <code>span</code> vor dem Label.</td>
              </tr>
              <tr>
                <td><code>command</code></td>
                <td>Läuft beim Klick; ohne Linkziel wird vorher die Standardaktion abgebrochen.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>Entfernt <code>tabindex</code>, bricht den Klick ab, gibt nichts aus.</td>
              </tr>
              <tr>
                <td><code>visible</code></td>
                <td><code>false</code> entfernt den Eintrag — und verschiebt die Markierung der aktuellen Seite.</td>
              </tr>
              <tr>
                <td><code>items</code>, <code>separator</code>, <code>expanded</code>, <code>tooltip</code></td>
                <td>{{ m.inertFields }}</td>
              </tr>
              <tr>
                <td><code>'aria-current'</code></td>
                <td>{{ m.ariaCurrentField }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an den beiden Anker-Zweigen, <code>openng-optimus-ui-breadcrumb.mjs:307-334</code> (schlicht) und
          <code>:337-372</code> (Router); die wirkungslosen Felder sind die, die das Template nie liest. Tooltips erreichen
          den Eintrag nur über <code>tooltipOptions</code> am <code>&lt;li&gt;</code> (<code>:299</code>).
        </p>

        <h3>Verdrahtung</h3>
        <pre class="code-block"><code>{{ wiringSnippet }}</code></pre>

        <h3>Woher der Pfad dieses Kits kommt</h3>
        <p>
          Der seitenweite Pfad ist nicht von Hand geschrieben. Das <code>app-breadcrumb</code> des Kits leitet ihn aus der
          Router-Konfiguration ab: <code>routedPagesByPath()</code> indiziert die Routen, die eine Seite laden und einen
          <code>titleKey</code> tragen (Weiterleitungen, die Wildcard und <code>:param</code>-Pfade bleiben außen vor),
          und <code>routeBreadcrumbs()</code> macht aus dem aktuellen Pfad höchstens zwei Krumen — die Gruppe der Route
          (<code>groupTitleKey</code>, kein Link) und die Seite selbst (<code>titleKey</code>). Die Startseite und jeder
          Pfad, der keine geroutete Seite ist, ergeben keinen Pfad, und bei einem Pfad aus einer Krume rendert der Wrapper
          nichts. Eine tiefere Hierarchie wird ausdrücklich über <code>[customBreadcrumbs]</code> übergeben. Es gibt keine
          Zuordnung von Routen zu Labels, die man synchron halten müsste: Ein Pfad kann nur eine Route benennen, die
          existiert. Der Wrapper folgt bereits beiden Dos unten: Er rendert eine Landmark — das eigene
          <code>&lt;nav&gt;</code> der Bibliothek, benannt über <code>pt.root</code> — und seine letzte Krume ist die
          aktuelle Seite, ohne Link und mit <code>tabindex: '-1'</code>, während die Bibliothek
          <code>aria-current="page"</code> daraufstempelt.
        </p>
        <p class="src-note">
          <code>routeBreadcrumbs()</code> in <code>src/app/components/shared/breadcrumb.component.ts</code>;
          <code>routedPagesByPath()</code> in <code>src/app/utils/routed-pages.ts</code>; das Verhalten von Landmark,
          aktueller Seite und Tab-Stopp sichert <code>src/app/components/shared/breadcrumb.component.spec.ts</code>. Die
          JSON-LD-<code>BreadcrumbList</code> (<code>src/app/services/structured-data.service.ts</code>) liest denselben
          Index.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Komponente in ein eigenes nav packen</span>
            <div class="dd__stage">
              <nav aria-label="Brotkrümelnavigation">
                <p-breadcrumb [model]="shortTrail"></p-breadcrumb>
              </nav>
            </div>
            <p class="dd__why">
              Zwei verschachtelte Navigations-Landmarks für einen Pfad. Eine Landmark-Liste im Screenreader zeigt beide,
              und die innere ist unbenannt — die Wurzel der Komponente ist bereits ein <code>&lt;nav&gt;</code>.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — das nav benennen, das die Komponente schon rendert</span>
            <div class="dd__stage">
              <p-breadcrumb [model]="shortTrail" [pt]="navName"></p-breadcrumb>
            </div>
            <p class="dd__why">
              Eine Landmark, benannt über <code>pt.root</code> — der einzige Weg auf Input-Ebene, weil diese Komponente
              keinen <code>ariaLabel</code>-Input hat.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die letzte Krume auf sich selbst verlinken lassen</span>
            <div class="dd__stage">
              <p-breadcrumb [model]="lastLinkedTrail" [pt]="navName"></p-breadcrumb>
            </div>
            <p class="dd__why">
              Die aktuelle Seite ist ein Tab-Stopp, der nirgendwohin führt, wo der Leser nicht schon ist. Gib ihr ein
              Ziel, und sie ist ein Selbstlink; gib ihr keines, und sie ist trotzdem fokussierbar, weil jeder Anker eines
              Eintrags <code>tabindex="0"</code> bekommt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die letzte Krume inaktiv machen</span>
            <div class="dd__stage">
              <p-breadcrumb [model]="lastInertTrail" [pt]="navName"></p-breadcrumb>
            </div>
            <p class="dd__why">
              Kein <code>url</code>, kein <code>routerLink</code>, <code>tabindex: '-1'</code>. Die Bibliothek stempelt
              trotzdem <code>aria-current="page"</code> darauf, also wird sie weiter als aktuelle Seite angesagt.
            </p>
          </div>
        </div>

        <p class="src-note">
          Die Aussage zu den verschachtelten Landmarks ist die Wurzel der Komponente bei
          <code>openng-optimus-ui-breadcrumb.mjs:203</code>; der bedingungslose Tab-Stopp ist
          <code>[attr.tabindex]="menuitem?.disabled ? null : menuitem?.tabindex || '0'"</code> (<code>:314</code>,
          <code>:347</code>).
        </p>

        <h3>Quellen</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/" target="_blank" rel="noopener noreferrer"
              >W3C APG — Breadcrumb</a
            >
            — der Vertrag aus <code>nav</code> + <code>aria-current</code> und die aktuelle Seite als reiner Text.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/location.html" target="_blank" rel="noopener noreferrer"
              >WCAG 2.2 SC 2.4.8 Location</a
            >
            — warum es den Pfad gibt.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 SC 2.4.3 Focus Order</a
            >
            — was eine letzte Krume kostet, die ein Tab-Stopp ohne Ziel ist.
          </li>
          <li>
            <a href="https://optimus.openng.org/breadcrumb/" target="_blank" rel="noopener noreferrer"
              >Optimus UI — Breadcrumb</a
            >
            — die API des Herstellers, gelesen gegen den Quellcode von 2.0.2.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Der Breadcrumb wird aus Aura-Token gestylt; <code>src/styles.scss</code> fasst ihn einmal an, in der gemeinsamen
          Schicht — der Krumen-Link ist ein Eintrag in der einen Fokus-Ring-Liste des Kits —, und kein
          <code>html.style-&lt;name&gt;</code>-Block nennt ihn, also siehst du das Aura-Preset plus den Radius des aktiven
          visuellen Stils und den Ring des Kits. Eine Aufrufstelle, die <code>styleClass</code> übergibt, legt ihre eigenen
          Regeln obendrauf — der <code>app-breadcrumb</code>-Wrapper des Kits tut genau das, und anders als die toten
          Deep-Selektoren daneben greifen diese Regeln: <code>styleClass</code> wird an die Klassenliste des
          Wurzel-<code>&lt;nav&gt;</code> angehängt (<code>cn(cx('root'), styleClass)</code>,
          <code>openng-optimus-ui-breadcrumb.mjs:203</code>).
        </p>

        <h3>Aura-Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Was es malt</th>
                <th>Komponenten-Token</th>
                <th>Löst auf zu</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Hintergrund des Pfads</td>
                <td><code>breadcrumb.background</code></td>
                <td>{{ m.tokenBackground }}</td>
              </tr>
              <tr>
                <td>Krumen-Label</td>
                <td><code>breadcrumb.item.color</code></td>
                <td>{{ m.tokenItemColor }}</td>
              </tr>
              <tr>
                <td>Krumen-Label bei Hover</td>
                <td><code>breadcrumb.item.hover.color</code></td>
                <td>{{ m.tokenItemHover }}</td>
              </tr>
              <tr>
                <td>Chevron</td>
                <td><code>breadcrumb.separator.color</code></td>
                <td>{{ m.tokenSeparator }}</td>
              </tr>
              <tr>
                <td>Eckenradius der Krume</td>
                <td><code>breadcrumb.item.border.radius</code></td>
                <td>{{ m.tokenRadius }}</td>
              </tr>
              <tr>
                <td>Padding/Gap</td>
                <td><code>breadcrumb.padding</code>, <code>breadcrumb.gap</code></td>
                <td>{{ m.tokenSpacing }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und ihre Ziele aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/breadcrumb/index.mjs</code>; die semantische Schicht, in der sie
          landen, ist <code>.../aura/base/index.mjs</code>. Die Radius-Kette endet beim aktiven visuellen Stil, dessen
          <code>presetOverrides</code> <code>primitive.borderRadius</code> setzen
          (<code>src/app/services/ui-styles.ts</code>) — der Standardstil löst ihn zu 0 auf.
        </p>

        <h3>Der Fokus-Ring ist der eine Ring des Kits</h3>
        <p>
          Aura umringt eine Krume mit <code>breadcrumb.item.focusRing.*</code>, das auf den globalen
          <code>focus.ring.*</code> (1px) zeigt. Das Kit ersetzt ihn durch den Ring, den jedes fokussierbare Optimus-Teil
          trägt — {{ m.focusRing }}. Geh per Tab in den Pfad unten, und der Ring ist sichtbar, ohne dass du etwas tun
          musst.
        </p>
        <div class="stage">
          <p-breadcrumb [model]="shortTrail" [pt]="navName"></p-breadcrumb>
        </div>
        <pre class="code-block"><code>{{ focusRuleSnippet }}</code></pre>
        <p class="src-note">
          Die Regel von Aura ist <code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:47-51</code>, ihre
          Token-Ziele <code>.../aura/breadcrumb/index.mjs</code> und <code>.../aura/base/index.mjs</code>; die Regel des
          Kits (<code>.p-breadcrumb-item-link:focus-visible</code>) steht in der einen Ring-Liste von
          <code>src/styles.scss</code>, gemessen in <code>docs/generated/CONTRAST.MD</code> „focus ring“. Beide sind
          schlichte Klassenselektoren mit einer Pseudoklasse; die zwei Hover-Regeln neben der von Aura (<code>:53</code>,
          <code>:66</code>) sind die mit Nachfahren-Selektor, also bricht ein Wrapper-Element keine davon.
        </p>

        <h3>Bei 360px: Er scrollt, er bricht nie um</h3>
        <p>
          {{ m.narrowStatement }} Es gibt weder einen Breakpoint noch eine Kürzung, weder in der Komponente noch in ihrem
          Stylesheet — das Verhalten ist bei jedem Viewport gleich, und der einzige Hebel des Aufrufers ist die Länge von
          <code>model</code>. Layout-Empfehlung: Halte den Pfad bei etwa fünf Krumen, oder kürze ihn selbst (eine
          Auslassungs-Krume mit <code>tabindex: '-1'</code>, die für die mittleren Vorfahren steht), statt zu erwarten,
          dass die Komponente das tut.
        </p>
        <p class="src-note">
          <code>overflow-x: auto</code> an der Wurzel und <code>flex-wrap: nowrap</code> an der Liste
          (<code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:5</code>, <code>:14</code>); die Scrollleiste wird
          in WebKit bei <code>:28</code> entfernt, und genau das macht den Überlauf stumm statt nur eng.
        </p>

        <h3>Kontrast</h3>
        <p>
          Die Krumen-Farben oben lösen sich innerhalb der Flächenpalette von <em>Aura</em> auf, nicht in den
          <code>--surface-*</code>/<code>--text-*</code>-Token dieses Kits, also misst das Kontrast-Kompilat des Kits sie
          nicht — ein Verhältnis daraus für die gerenderte Komponente zu zitieren hieße, das falsche Paar zu zitieren. Was
          das Kompilat klärt, ist die Paarung, die du bekommst, wenn du den Pfad mit Kit-Token überschreibst, und das ist
          meist überhaupt der Grund, ihn anzufassen: {{ m.contrastSecondaryGround }}, und {{ m.contrastSecondaryCard }}.
        </p>
        <p class="src-note">
          Beide Zeilen zitiert aus <code>docs/generated/CONTRAST.MD</code>, Abschnitt <code>## style: werkbund
          (default)</code> → <code>### light mode</code>; die Abschnitte lernwerkstatt, skizzenbuch und blaupause tragen
          für dasselbe Paar ihre eigenen Zahlen, in beiden Modi. Neu erzeugt aus den echten Token-Werten von
          <code>scripts/check-contrast.mjs</code>. Die Aura-eigene Paarung (<code>&#123;text.muted.color&#125;</code> auf
          <code>&#123;content.background&#125;</code>) bekommt hier bewusst keine Zahl: Sie ist kein Paar, das das
          Kontrast-Gate abdeckt.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Fünf Inputs, ein Output, zwei Templates. Spannend ist nicht die Oberfläche — sondern welchen Teil des
          Accessibility-Vertrags die Komponente schon einhält und welche Hälfte sie zurückgibt.
        </p>

        <h3>Die vollständige Input-Liste</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Typ</th>
                <th>Hinweis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>model</code></td>
                <td><code>MenuItem[]</code></td>
                <td>{{ m.modelNote }}</td>
              </tr>
              <tr>
                <td><code>home</code></td>
                <td><code>MenuItem</code></td>
                <td>{{ m.homeNote }}</td>
              </tr>
              <tr>
                <td><code>homeAriaLabel</code></td>
                <td><code>string</code></td>
                <td>Benennt den Home-Link; wird von nichts geschlagen, schlägt den Standard aus der Konfiguration.</td>
              </tr>
              <tr>
                <td><code>style</code> / <code>styleClass</code></td>
                <td><code>object</code> / <code>string</code></td>
                <td>{{ m.styleClassNote }}</td>
              </tr>
              <tr>
                <td><code>pt</code> / <code>ptOptions</code> / <code>dt</code> / <code>unstyled</code></td>
                <td>Signal-Inputs</td>
                <td>Die vier von <code>BaseComponent</code> geerbten; <code>pt.root</code> ist der Weg zur Benennung.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die fünf eigenen Inputs sind die <code>inputs</code>-Map der Komponente,
          <code>openng-optimus-ui-breadcrumb.mjs:202</code>; die geerbten vier —
          <code>pt</code>, <code>ptOptions</code>, <code>dt</code>, <code>unstyled</code> — sind
          <code>openng-optimus-ui-basecomponent.mjs:428</code>. Es gibt kein <code>ariaLabel</code> und kein
          <code>ariaLabelledBy</code> — <code>p-menubar</code> hat beide, diese Komponente nicht.
        </p>

        <h3>Das nav benennen</h3>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <p class="src-note">
          <code>ptm('root')</code> wird über die Host-Direktive <code>pBind</code> an das <code>&lt;nav&gt;</code>
          gebunden (<code>openng-optimus-ui-breadcrumb.mjs:203</code>), also landet jedes Attribut unter dem
          <code>root</code>-Key auf der Landmark.
        </p>

        <h3>Wer <code>aria-current</code> setzt</h3>
        <pre class="code-block"><code>{{ currentSnippet }}</code></pre>
        <p>
          Zwei Folgen, die man sich merken sollte. <code>isCurrentPage</code> läuft vom Ende her und hält beim ersten
          Eintrag an, der nicht <code>visible: false</code> ist — wer also das Blatt versteckt, verschiebt die Markierung
          der aktuellen Seite still auf dessen Elternteil. Und der Router-Zweig leitet den Wert über
          <code>ariaCurrentWhenActive</code>, das RouterLinkActive nur anwendet, solange dieser Link zur URL passt: Eine
          letzte Krume, die woandershin zeigt, sagt nichts an.
        </p>
        <p class="src-note">
          <code>isCurrentPage</code> bei <code>openng-optimus-ui-breadcrumb.mjs:190-200</code>; die beiden Verbraucher bei
          <code>:316</code> (schlicht) und <code>:355</code> (Router).
        </p>

        <h3>Die letzte Krume ist so oder so ein Tab-Stopp</h3>
        <p>
          {{ m.tabStop }} Das Breadcrumb-Muster der APG sieht die aktuelle Seite als reinen Text vor oder als Link mit
          <code>aria-current="page"</code> — nicht als fokussierbares Element ohne Ziel. <code>tabindex: '-1'</code> am
          letzten Eintrag schließt die Lücke; das Attribut-Binding liest <code>menuitem?.tabindex</code>, bevor es auf
          <code>'0'</code> zurückfällt, also gewinnt dein Wert.
        </p>
        <p class="src-note">
          <code>[attr.tabindex]</code> an beiden Anker-Zweigen,
          <code>openng-optimus-ui-breadcrumb.mjs:314</code> und <code>:347</code>; das <code>href</code>, das ohne
          <code>url</code> <code>null</code> ist, bei <code>:308</code>.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>Nirgends ein vom Aufrufer gestelltes <code>&lt;nav&gt;</code> um die Komponente.</li>
          <li>Die Landmark hat einen Namen, gesetzt über <code>pt.root</code>.</li>
          <li>Interne Krumen nutzen <code>routerLink</code>; nur externe nutzen <code>url</code>.</li>
          <li>Die letzte Krume hat kein Linkziel und <code>tabindex: '-1'</code>.</li>
          <li>Der Home-Eintrag hat einen zugänglichen Namen, wenn er nur ein Icon zeigt.</li>
          <li><code>model</code> wird bei Routen- und Sprachwechsel als neues Array gebaut.</li>
          <li>Keine Stylesheet-Regel nennt <code>p-menuitem-link</code>, <code>p-menuitem-text</code>,
            <code>p-menuitem-icon</code>, <code>p-breadcrumb-home</code> oder <code>p-breadcrumb-chevron</code> — die Map
            gibt <code>p-breadcrumb-home-item</code> und <code>p-breadcrumb-item-icon</code> aus, also sind alle fünf
            tot.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Fast alles, was ein Breadcrumb sagt, kommt aus deinem Model. Die Bibliothek steuert genau einen String bei, und
          der erscheint nur in einem Fall, den du ohnehin behandeln solltest.
        </p>

        <h3>Der eine String der Bibliothek</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>String</th>
                <th>Woher er kommt</th>
                <th>Wann er verwendet wird</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ m.ariaHomeValue }}</td>
                <td><code>config.translation.aria.home</code></td>
                <td>{{ m.ariaHomeWhen }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Fallback-Kette ist <code>homeLinkAriaLabel</code>,
          <code>openng-optimus-ui-breadcrumb.mjs:125-131</code>; der Standardwert ist
          <code>openng-optimus-ui-config.mjs:188</code>. Jedes andere Wort im Pfad ist ein <code>label</code>, das du
          geliefert hast.
        </p>

        <h3>Labels sind ein computed, nie ein zwischengespeicherter String</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>TranslationService.translate(key)</code> liest das <code>translationsVersion</code>-Signal des Dienstes
          (<code>src/app/services/translation.service.ts</code>), also läuft ein <code>computed()</code> darüber bei einem
          Sprachwechsel erneut und liefert ein neues Array — genau das braucht der schlichte <code>&#64;Input()</code>, um
          es zu bemerken. Ein <code>instant()</code> gibt es in diesem Dienst nicht.
        </p>

        <h3>Das Home nur mit Icon</h3>
        <p>
          Ein Home-Eintrag mit <code>icon</code> und ohne <code>label</code> rendert einen Anker, dessen einziger Inhalt
          ein Icon-<code>span</code> ohne Text ist — der Link hat also keinen zugänglichen Namen, wenn du keinen lieferst:
          Übergib <code>homeAriaLabel</code> (übersetzt, wie jeden anderen sichtbaren String), oder gib dem Eintrag ein
          sichtbares <code>label</code> — dann gibt die Komponente bewusst kein <code>aria-label</code> aus, sodass der
          sichtbare Text und der angesagte Name derselbe String bleiben.
        </p>

        <h3>RTL</h3>
        <p>
          Der Chevron spiegelt sich unter RTL selbst, und sonst braucht nichts in der Komponente eine richtungsabhängige
          Regel: Die Liste ist eine schlichte Flex-Reihe, also kehrt die Schreibrichtung die Reihenfolge der Krumen von
          allein um. Deine Labels brauchen trotzdem eine eigene Prüfung auf Länge — ein Pfad, der auf Englisch in eine
          Zeile passt, ist in einer Sprache, die 40 % länger läuft, dieselbe Reihe ohne Umbruch, die scrollt.
        </p>
        <p class="src-note">
          <code>{{ m.rtlRule }}</code>,
          <code>&#64;openng/optimus-ui-styles/dist/breadcrumb/index.mjs:24</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Der Krumen-Link trägt den
            einen 2px-Ring des Kits (CONTRAST.MD „focus ring“); das <code>app-breadcrumb</code> des Kits rendert eine
            Landmark und eine nicht verlinkte aktuelle Seite.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Verwendung nennt, woher der Pfad des Kits kommt (aus den Routen abgeleitet,
            keine Routen-Map), und schließt mit kommentierten Quellen; Playground-Schalter einmal benannt, mit ihrem
            sichtbaren Label; Design hält fest, dass die visuellen Stile keine Breadcrumb-Regel hinzufügen; Kontrast nach
            Abschnitt zitiert; Bereich von <code>isCurrentPage</code> auf <code>:190-200</code> korrigiert; Doku auf das
            Byte-Ziel gekürzt.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Version, gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class BreadcrumbArticleDeComponent extends BreadcrumbArticleComponent {
  override readonly navName = { root: { 'aria-label': 'Brotkrümelnavigation' } };

  protected override readonly shallow: MenuItem[] = [
    { label: 'Katalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
  ];

  protected override readonly deep: MenuItem[] = [
    { label: 'Katalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Orientierung', routerLink: '/dev/design' },
    { label: 'Hierarchisch', routerLink: '/dev/design' },
    { label: 'Pfade', routerLink: '/dev/design' },
    { label: 'Vorfahren', routerLink: '/dev/design' },
    { label: 'Tiefe acht', routerLink: '/dev/design' },
    { label: 'Tiefe neun', routerLink: '/dev/design' },
  ];

  override readonly shortTrail: MenuItem[] = [
    { label: 'Katalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Breadcrumb', tabindex: '-1' },
  ];

  override readonly longTrail: MenuItem[] = [...this.deep, { label: 'Ein Blatt mit einem langen Namen', tabindex: '-1' }];

  override readonly lastLinkedTrail: MenuItem[] = [
    { label: 'Katalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Breadcrumb', routerLink: '/dev/design/guide/breadcrumb' },
  ];

  override readonly lastInertTrail: MenuItem[] = [
    { label: 'Katalog', routerLink: '/dev/design' },
    { label: 'Navigation', routerLink: '/dev/design' },
    { label: 'Breadcrumb', tabindex: '-1' },
  ];

  override readonly m = {
    narrowWidth: '360px',
    escapeDefault: 'der Escape-Zweig gewinnt, solange escape nicht ausdrücklich false ist',
    inertFields:
      'Vom Template nie gelesen — ein Breadcrumb hat keine Verschachtelung, keinen eigenen Trenner-Eintrag und keinen Tooltip-Input',
    ariaCurrentField: 'Überhaupt kein MenuItem-Feld; aria-current setzt die Bibliothek selbst',
    tokenBackground: '{content.background}',
    tokenItemColor: '{text.muted.color}, also {surface.500} hell und {surface.400} dunkel',
    tokenItemHover: '{text.color}',
    tokenSeparator: '{navigation.item.icon.color}',
    tokenRadius: '{content.border.radius} → {border.radius.md}, den der visuelle Standardstil auf 0 setzt',
    tokenSpacing: '1rem Padding, 0.5rem Gap — Literale im Preset, keine Token-Referenzen',
    focusRing:
      '2px solid --primary-color-fg mit 2px Abstand, auf der Seitenfläche um die Krume: 3,88–17,85:1 über jeden Stil, jeden Modus und jeden Akzent (SC 1.4.11 verlangt 3:1)',
    narrowStatement:
      'Der Pfad behält bei jedem Viewport seine natürliche Breite und scrollt waagrecht innerhalb seiner eigenen Wurzel, sobald er nicht mehr passt; er bricht nie in eine zweite Zeile um und kürzt nie ein Label.',
    contrastSecondaryGround:
      '--text-color-secondary auf --surface-ground hat im Stil werkbund, heller Modus, 7,14:1 (SC 1.4.3 verlangt 4,5:1)',
    contrastSecondaryCard:
      '--text-color-secondary auf --surface-card hat in demselben Stil und Modus 7,78:1; die anderen drei visuellen Stile haben im Kompilat eigene Zeilen, bis hinunter zu 4,90:1 (blaupause, heller Modus)',
    modelNote: 'Ein schlichter @Input(), kein Signal — weise ein neues Array zu, Mutation bewirkt unter OnPush nichts',
    homeNote: 'undefined ist dasselbe, wie es wegzulassen: Der Home-Eintrag und sein Trenner sind beide bedingt',
    styleClassNote: 'Beide landen am Wurzel-nav; hier nicht veraltet, anders als bei mehreren Geschwister-Komponenten',
    tabStop:
      'Jeder Anker eines Eintrags bekommt tabindex="0", außer der Eintrag ist deaktiviert, und sein href ist null, wenn der Eintrag kein url hat — eine letzte Krume ohne Linkziel ist also trotzdem fokussierbar und trotzdem kein Link.',
    rtlRule: '.p-breadcrumb-separator-icon:dir(rtl) { transform: rotate(180deg); }',
    ariaHomeValue: "'Home'",
    ariaHomeWhen: 'Nur wenn home kein sichtbares Label hat und kein homeAriaLabel übergeben wurde',
  };
}
