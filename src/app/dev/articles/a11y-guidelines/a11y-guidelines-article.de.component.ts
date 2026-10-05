import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { A11yGuidelinesArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './a11y-guidelines-article.component';

/**
 * German twin of the Accessibility Guidelines guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (the
 * announcement, the demo language names, the two ratio readouts) are German.
 * Keep it in step with the English file: same tabs, same element and binding
 * skeleton (`node scripts/check-guide-translations.mjs a11y-guidelines`).
 */
@Component({
  selector: 'app-a11y-guidelines-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'a11y-guidelines'">

      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Die Barrierefreiheits-Schicht des Kits ist klein und konkret: ein Motion-Schalter, eine
          Fokus-Form, eine Klasse für versteckten Text und eine App-Shell. Alles hier unten ist das
          Echte und kein Bild davon — der Ring erscheint, wenn du per Tab hineinspringst, die Probe
          liest deine eigenen Betriebssystem-Einstellungen, und der Announcer ist eine Live-Region,
          auf die du einen Screenreader richten kannst.
        </p>

        <h3>Der Fokus-Ring, gerendert</h3>
        <p>
          Spring per Tab in diese drei. Alle drei bekommen denselben Ring, weil die Form eine
          Konvention des Kits ist und keine globale Regel: eine 2px-Outline mit 2px Abstand, nur bei
          Tastaturfokus gezeichnet. Klickst du sie stattdessen mit der Maus an, erscheint kein Ring —
          diese Regeln stehen auf <code>:focus-visible</code>, und das ist der Kit-Standard. Es ist
          eine Konvention, keine Garantie: Ältere Regeln im Baum hängen dieselbe Form noch an ein
          nacktes <code>:focus</code>, wo auch ein Mausklick sie zeichnet.
        </p>
        <div class="stage">
          <button type="button" class="ring-demo">Nativer Button</button>
          <a class="ring-demo" href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html"
             target="_blank" rel="noopener noreferrer">Nativer Link (SC 2.4.7)</a>
          <span class="ring-demo" role="button" tabindex="0">Element mit Rolle</span>
        </div>
        <p class="src-note">
          Ring-Form aus der einen Kit-Ring-Regel in <code>src/styles.scss</code> (neben den
          Formularfeld-Regeln), deren Selektorliste jeden per Tastatur fokussierbaren Optimus-UI-Teil
          und die Cookie-Buttons abdeckt; die <code>:focus-visible</code>-Regeln des globalen
          Stylesheets sind alle auf Klassen begrenzt, keine davon gilt auf Elementebene oder
          universell.
        </p>

        <h3>Wonach dein Rechner fragt</h3>
        <p>
          Jede Präferenz-Abfrage, die das Kit irgendwo beantwortet, ist hier direkt ablesbar, weil
          jede davon eine Media Query ist und sonst nichts. Die vierte Abfrage in der Design-Tabelle,
          <code>prefers-reduced-transparency</code>, wird nirgends beantwortet und hat deshalb nichts
          zu prüfen. Ändere die Einstellung in deinem Betriebssystem, und diese Box ändert sich mit —
          ohne Neuladen, ohne Signal, ohne Service.
        </p>
        <div class="probe">
          <div class="probe__row">
            <code>prefers-reduced-motion</code>
            <span class="probe__val"><span class="pm-no">no-preference</span><span class="pm-yes">reduce</span></span>
          </div>
          <div class="probe__row">
            <code>prefers-contrast</code>
            <span class="probe__val"><span class="pc-no">no-preference</span><span class="pc-yes">high</span></span>
          </div>
          <div class="probe__row">
            <code>forced-colors</code>
            <span class="probe__val"><span class="fc-no">none</span><span class="fc-yes">active</span></span>
          </div>
        </div>
        <p class="src-note">
          Gerendert aus drei Media Queries im eigenen Stylesheet dieses Artikels. Auf welche davon
          das Kit selbst reagiert und wo, steht in der ersten Tabelle unter Design.
        </p>

        <h3>Eine Live-Region, die du hören kannst</h3>
        <p>
          Der Zähler unten schreibt in ein visuell verstecktes <code>.sr-only</code>-Element mit
          <code>aria-live="polite"</code>. Sehende Leser bekommen die Zahl im Button, ein
          Screenreader bekommt den Satz. Der Spiegel darunter zeigt den versteckten Text, damit du
          siehst, was angesagt wird, ohne etwas einschalten zu müssen.
        </p>
        <div class="stage stage--column">
          <button type="button" class="ring-demo" (click)="bump()">
            Punkt hinzufügen — Summe {{ score() }}
          </button>
          <span class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement() }}</span>
          <p class="mirror"><span class="mirror__tag">angesagt</span> {{ announcement() }}</p>
        </div>
        <p class="src-note">
          <code>.sr-only</code> ist einmal global in <code>src/styles.scss</code> deklariert; die
          Live-Region-Attribute stehen an dieser Aufrufstelle, weil das Kit keine
          Announcer-Komponente mitliefert.
        </p>

        <h3>Der Skip-Link, beide Zustände</h3>
        <p>
          Der echte ist der erste fokussierbare Knoten der Seite — drück auf einer beliebigen Route
          Tab aus der Adressleiste heraus, und er klappt herunter. Er ist nicht aus
          <code>.sr-only</code> gebaut: Er sitzt oberhalb der oberen Kante und gleitet zurück, behält
          also seine Größe und ist beim Ankommen zu sehen. Die beiden Zustände stehen hier
          nebeneinander.
        </p>
        <div class="skip">
          <div class="skip__frame"><span class="skip__pill skip__pill--hidden">Zum Inhalt springen</span><span class="skip__label">in Ruhe — über der Viewport-Kante</span></div>
          <div class="skip__frame"><span class="skip__pill">Zum Inhalt springen</span><span class="skip__label">fokussiert — bündig mit der Oberkante</span></div>
        </div>
        <p class="src-note">
          Nachgestellt aus den <code>.skip-link</code>-Regeln in
          <code>src/app/app.component.ts</code>; Ziel und Fokusverhalten des echten Links stehen
          unter Entwicklung.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Ein Control ist hier barrierefrei, weil sein Autor vier Dinge verdrahtet hat, nicht weil
          das Kit es getan hätte. Das Kit besitzt Motion und die Klasse für versteckten Text
          vollständig; für den Ring gibt es dir eine Form vor, für den Namen und die Ansage gar
          nichts.
        </p>

        <h3>Die vier Aufgaben, und wer sie erledigt</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Aufgabe</th><th>Was das Kit dir gibt</th><th>Was du noch schreibst</th></tr></thead>
            <tbody>
              <tr>
                <td>Zugänglicher Name</td>
                <td>Nichts Globales. Den Übersetzungsservice und die Gewohnheit gebundener Attribute.</td>
                <td><code>[attr.aria-label]</code> oder ein echtes Label, aus einem Übersetzungsschlüssel.</td>
              </tr>
              <tr>
                <td>Sichtbarer Fokus</td>
                <td>Eine Konvention — 2px-Outline, 2px Abstand, Markenfarbe — und eine auf eine Klasse begrenzte Regel.</td>
                <td>Die <code>:focus-visible</code>-Regel selbst, auf deinem eigenen Selektor.</td>
              </tr>
              <tr>
                <td>Ansage von Zuständen</td>
                <td><code>.sr-only</code>, global, und sonst nichts.</td>
                <td>Die Live-Region, ihre Dringlichkeit und den Text, der darin landet.</td>
              </tr>
              <tr>
                <td>Motion</td>
                <td>Einen universellen <code>prefers-reduced-motion</code>-Auffangblock über alle CSS-Transitions und -Animationen.</td>
                <td>Die JavaScript-Hälfte — alles, was der Auffangblock nicht erreicht — über den Reduced-Motion-Helfer.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit-Spalte abgelesen an <code>src/styles.scss</code> und der App-Shell
          (<code>src/app/app.component.ts</code> und ihre Kinder in
          <code>src/app/components/frame/</code>); wie weit die Motion-Zeile reicht, ist Thema der
          zweiten Tabelle unter Design.
        </p>

        <h3>Do / Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Outline entfernen und Ersatz versprechen</span>
            <div class="dd__stage">
              <button type="button" class="ring-demo ring-demo--broken">Spring per Tab hinein — nichts</button>
            </div>
            <p class="dd__why">
              Dieser Button trägt wirklich <code>outline: none</code> plus
              <code>box-shadow: 0 0 0 3px rgba(var(--primary-color), .1)</code>. Ein
              <code>var()</code>, das eine Farbe enthält, kann keine Kanalliste sein, also ist der
              Schatten zum Zeitpunkt des berechneten Werts ungültig und fällt weg. Die Outline ist
              schon weg, und das Control hat überhaupt keinen Tastatur-Indikator mehr.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Ring in der Form des Kits zeichnen</span>
            <div class="dd__stage">
              <button type="button" class="ring-demo">Spring per Tab hinein — 2px-Ring</button>
            </div>
            <p class="dd__why">
              Zwei Eigenschaften auf <code>:focus-visible</code>, beide gültig, beide per Theme
              gesteuert. Eine Outline zu entfernen ist nur sicher, wenn der Ersatz auch rendert — und
              der sicherste Ersatz ist die Outline.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Control auf Englisch benennen</span>
            <div class="dd__stage stage--column">
              <button type="button" class="ring-demo ring-demo--icon" aria-label="Close"
                      (click)="cycleLang()">
                <i class="pi pi-times" aria-hidden="true"></i>
              </button>
              <p class="mirror"><span class="mirror__tag">angesagt</span> Close</p>
            </div>
            <p class="dd__why">
              Drück den Button: Die Seitensprache wechselt reihum, die sichtbare Umgebung würde
              folgen — und der Name bleibt <em>Close</em>, weil er ein Literal ist. Der Name ist das
              Einzige, was ein Screenreader-Nutzer von einem Control nur mit Icon bekommt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Namen an einen Schlüssel binden</span>
            <div class="dd__stage stage--column">
              <button type="button" class="ring-demo ring-demo--icon" [attr.aria-label]="boundName()"
                      (click)="cycleLang()">
                <i class="pi pi-times" aria-hidden="true"></i>
              </button>
              <p class="mirror"><span class="mirror__tag">angesagt</span> {{ boundName() }}</p>
            </div>
            <p class="dd__why">
              Derselbe Button, der Name an einen Schlüssel gebunden: Er folgt der Seitensprache
              (<strong>{{ demoLangLabel() }}</strong>), und das sichtbare Label — wo es eines gibt —
              bleibt im zugänglichen Namen enthalten, und genau darauf gleicht die Sprachsteuerung ab.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — das Ergebnis nur auf dem Bildschirm zeigen</span>
            <div class="dd__stage"><span class="dd__badge dd__badge--red">3 Fehler</span></div>
            <p class="dd__why">
              Die Farbe trägt den Schweregrad, und nichts sagt die Änderung an: Ein
              Screenreader-Nutzer, der die Prüfung ausgelöst hat, hört Stille, und ein farbenblinder
              Nutzer liest eine neutrale Zahl.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — es in Text sagen und ansagen</span>
            <div class="dd__stage"><span class="dd__badge dd__badge--red">&#9888; 3 Fehler</span><span class="dd__code">+ .sr-only[aria-live]</span></div>
            <p class="dd__why">
              Ein Icon oder Wort neben dem Farbton erfüllt die Farbregel; eine höfliche Live-Region
              macht dieselbe Änderung hörbar, ohne den Fokus zu stehlen.
            </p>
          </div>
        </div>

        <h3>Welches Kriterium jede Gewohnheit erfüllt</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Gewohnheit</th><th>Erfolgskriterium</th><th>Stufe</th></tr></thead>
            <tbody>
              <tr><td>Skip-Link am Header vorbei</td><td>SC 2.4.1 Bypass Blocks</td><td>A</td></tr>
              <tr><td>Jedes Control per Tastatur erreichbar und bedienbar</td><td>SC 2.1.1 Keyboard</td><td>A</td></tr>
              <tr><td>Der Ring ist sichtbar und nicht entfernt</td><td>SC 2.4.7 Focus Visible</td><td>AA</td></tr>
              <tr><td>Der Ring ist vor seinem Untergrund erkennbar</td><td>SC 1.4.11 Non-text Contrast</td><td>AA</td></tr>
              <tr><td>Text und sein Untergrund sind ein gemessenes Paar</td><td>SC 1.4.3 Contrast (Minimum)</td><td>AA</td></tr>
              <tr><td>Ein zweiter Träger neben dem Farbton</td><td>SC 1.4.1 Use of Color</td><td>A</td></tr>
              <tr><td>Motion folgt der Reduced-Motion-Präferenz</td><td>SC 2.3.3 Animation from Interactions</td><td>AAA</td></tr>
              <tr><td>Ein Ziel, groß genug zum Treffen</td><td>SC 2.5.8 Target Size (Minimum)</td><td>AA</td></tr>
              <tr><td><code>lang</code> passt zur gerenderten Sprache</td><td>SC 3.1.1 Language of Page</td><td>A</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kriterien und Stufen aus WCAG 2.2, verlinkt in den Quellen des Agent-Docs. Das Kit erfüllt
          die ersten drei und das letzte in seiner Shell; der Rest liegt bei der Aufrufstelle.
          SC 2.5.8 wird pro Control erfüllt statt global — der Slider-Handle-Override in
          <code>src/styles.scss</code> ist das Referenzmuster, und Design sagt, was das dir
          überlässt.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Zwei Sass-Dateien, beide global, und nirgends ein Komponenten-Stylesheet — jeder
          Komponenten-Style im Kit ist ein Inline-Literal aus reinem CSS. Diese eine strukturelle
          Tatsache entscheidet das meiste von dem, was folgt: Eine globale Regel ist die einzige,
          die alles erreichen kann, und ein Sass-Mixin erreicht gar nichts.
        </p>

        <h3>Die Präferenz-Abfragen, die das Kit beantwortet</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Abfrage</th><th>Wo</th><th>Was sie deklariert</th></tr></thead>
            <tbody>
              <tr>
                <td><code>prefers-reduced-motion: reduce</code></td>
                <td>Globaler Auffangblock, dazu Blöcke pro Komponente</td>
                <td><code>animation-duration</code> und <code>transition-duration</code> auf <code>0.01ms !important</code>, <code>animation-iteration-count: 1</code>, <code>scroll-behavior: auto</code>, auf <code>*</code>, <code>*::before</code>, <code>*::after</code></td>
              </tr>
              <tr>
                <td><code>prefers-contrast: high</code></td>
                <td>Nur auf das Feature begrenzt</td>
                <td>Eine dickere Unterstreichung und ein kräftigeres Gewicht auf der Glossar-Hervorhebung, eine 3px-Fokus-Outline darauf, ein 2px-Rahmen am Glossar-Popover — dazu einige auf Komponenten begrenzte Blöcke außerhalb des globalen Stylesheets</td>
              </tr>
              <tr>
                <td><code>forced-colors: active</code></td>
                <td>Nur auf Komponenten begrenzt; das globale Stylesheet deklariert keinen</td>
                <td>Meist <code>border</code>, <code>background</code> und <code>forced-color-adjust</code>, in den didaktischen Komponenten und im Tooltip</td>
              </tr>
              <tr>
                <td><code>prefers-reduced-transparency</code></td>
                <td>Nirgends</td>
                <td>Nicht beantwortet</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gezählt über jede <code>&#64;media</code>-At-Rule in den versionierten Dateien unter
          <code>src/</code>; der Auffangblock selbst ist der Block ganz oben in
          <code>src/styles.scss</code>. Um zu prüfen, was tatsächlich ausgeliefert wird, lies das
          globale Stylesheet, das die <code>build:verify</code>-Kette erzeugt.
        </p>

        <h3>Warum 0.01ms und nicht none</h3>
        <p>
          Der Kommentar des Auffangblocks nennt selbst den Grund: Eine Dauer von null Millisekunden
          ist immer noch eine Transition, also feuert <code>transitionend</code> weiter, und
          Bibliotheksinterna, die darauf warten, funktionieren weiter, während sich nichts
          Wahrnehmbares bewegt. Er sagt auch, wofür der Block da ist — die spezifischen Blöcke weiter
          unten im Stylesheet bleiben, wirken zusätzlich, und der Auffangblock übernimmt den Rest.
          Das ist die Motion-Politik des Kits in einem Satz: Das Abschalten ist global und
          automatisch; eine Bewegung wieder <em>ein</em>zuschalten ist die Ausnahme, für die eine
          Komponente argumentieren muss.
        </p>
        <p>
          Was er nicht erreicht, ist die andere Hälfte der Animationsfläche. Der Block ist CSS, also
          laufen ein Aufruf der Web Animations API, eine <code>requestAnimationFrame</code>-Schleife,
          ein Canvas-Render und ein explizites
          <code>scrollIntoView(&#123; behavior: 'smooth' &#125;)</code> genau so, wie sie
          geschrieben sind — Letzteres, weil eine explizite Behavior-Option die Eigenschaft
          <code>scroll-behavior</code> überschreibt, statt sie zu lesen. Diese werden in TypeScript
          abgesichert oder gar nicht: Jeder Scroll-Aufruf nimmt sein Behavior aus
          <code>scrollBehavior()</code>, und timergesteuerte Bewegung fragt
          <code>prefersReducedMotion()</code>, beide in <code>src/app/utils/reduced-motion.ts</code>.
        </p>
        <p class="src-note">
          Grund zitiert aus dem Kommentar des Auffangblocks in <code>src/styles.scss</code>; die
          Rangfolge der Option ist CSSOM View, verlinkt in den Quellen des Agent-Docs.
        </p>

        <h3>Der Ring, und die Farbfrage darin</h3>
        <p>
          Es gibt keine universelle Fokus-Regel, aber es gibt einen Ring für alles, was das Kit aus
          der Bibliothek mitliefert. Das globale Stylesheet zeichnet die Kit-Form — 2px, solid,
          <code>--primary-color-fg</code>, mit 2px Abstand, <code>!important</code> — auf jeden per
          Tastatur fokussierbaren Optimus-UI-Teil in einer einzigen Selektorliste: Felder, die
          Kästchen von Checkbox, Radio und Switch, Buttons, Segmente von Toggle und Select-Button,
          Stepper-Köpfe, Tabs, Accordion-Header, Menüeinträge, Tabellenzeilen und Sortier-Header,
          Paginator, Slider-Handle, Rating, Tree, Datepicker, Breadcrumb — und die Cookie-Buttons.
          Auras eigener 1px-<code>focusRing</code> (für die Text-Controls und das Select ganz auf
          null gesetzt) erscheint nie. Teile in einem abschneidenden Container bekommen den Ring
          nach innen (Abstand −2px, derselbe Ring); die Schließen-Buttons von Messages und Toasts
          und die Aktionen der Bildvorschau bekommen ihn in ihrer eigenen Farbe
          (<code>currentColor</code>), weil sie auf Tönungen und Flächen sitzen, auf denen kein
          Akzent 3:1 hält. Zwei auf Klassen begrenzte Regeln stehen neben der Liste, mit derselben
          Form und demselben Token: der Host-Zustand des Selects (<code>.p-select.p-focus</code>)
          und die Glossar-Hervorhebung — die eigene Konvention des Kits, die ihr Alter zeigt,
          geschrieben auf nacktem <code>:focus</code> statt auf <code>:focus-visible</code>. Für
          alles andere in der App hat noch ein Autor den Ring selbst geschrieben.
        </p>
        <p class="src-note">
          Die Ring-Regel, ihr Inset-Gegenstück und die <code>currentColor</code>-Regel stehen neben
          der Select-Regel in <code>src/styles.scss</code>, deren Kommentare die Form, das
          Fokusmodell jedes Teils und den Grund für <code>!important</code> nennen;
          <code>scripts/check-contrast.mjs</code> prüft die Selektorlisten
          (<code>KIT_RING_SELECTORS</code>, <code>KIT_RING_INSET</code>) und misst den Ring in
          <code>docs/generated/CONTRAST.MD</code>, Gruppe <code>focus ring</code> — niedrigster Wert
          3,88:1 auf den Seitenflächen, 3,52:1 nach innen auf einer ausgewählten Tabellenzeile.
          Prüf es in deinem Build: Fokussiere ein Feld per Tastatur und lies die berechnete Outline,
          sobald ihre Farb-Transition gelaufen ist.
        </p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Token</th><th>Rolle</th><th>Als Vordergrund gemessen?</th><th>Niedrigstes Verhältnis auf einem Untergrund</th></tr></thead>
            <tbody>
              <tr>
                <td><code>--primary-color</code></td>
                <td>Die <em>Füllung</em> der Marke; der Alias von <code>--primary-bg</code></td>
                <td>Nein — sie taucht im Kompilat nur als Hintergrund auf</td>
                <td>—</td>
              </tr>
              <tr>
                <td><code>--primary-color-fg</code></td>
                <td>Der kontrastangepasste <em>Vordergrund</em> der Marke</td>
                <td>Ja — auf beiden Untergründen, für alle zehn Paletten, in allen vier visuellen Stilen und beiden Modi</td>
                <td>{{ ringLightMin }} hell, {{ ringDarkMin }} dunkel</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Verhältnisse zitiert aus der Gruppe für den Marken-Vordergrund in
          <code>docs/generated/CONTRAST.MD</code>, dort gegen SC 1.4.3 mit 4,5:1 bewertet; ein
          Fokus-Indikator wird gegen SC 1.4.11 mit 3:1 bewertet, und beide Werte schaffen das.
          Für <code>--primary-color</code> gibt es keine Vordergrund-Zeile zum Zitieren.
        </p>
        <p>
          Die Folge passt in einen Satz. Ein Ring in <code>--primary-color-fg</code> hat in jedem
          Theme und jeder Markenpalette eine gemessene Zahl hinter sich; ein Ring in
          <code>--primary-color</code> ist die Füllrolle, als Linie benutzt, und seine Lesbarkeit
          vor der Seite ist ungemessen statt freigegeben. Die eine Ring-Regel des Kits nutzt das
          Vordergrund-Token, und ihr Kommentar sagt, warum: Es ist die kontrastangepasste
          Markenfarbe, die der Theme-Service pro Theme pflegt.
        </p>

        <h3>Was die Shell beiträgt</h3>
        <p>
          Vier Dinge, alle aus der App-Shell (<code>src/app/app.component.ts</code>, ihr Header in
          <code>src/app/components/frame/app-header.component.ts</code> und
          <code>src/app/services/optimus-a11y.service.ts</code>), alle über jeder Route: ein
          Skip-Link als erster fokussierbarer Knoten; der Satz an Landmarks
          (<code>header[role=banner]</code>, <code>nav[role=navigation]</code> mit übersetztem
          Label, der Hauptcontainer als natives <code>main[tabindex=-1]</code> (das einzige
          <code>main</code> auf der Seite, darum rendern geroutete Seiten nie ein eigenes) und
          <code>footer[role=contentinfo]</code> aus der Footer-Komponente); der Fokus wandert nach
          jeder abgeschlossenen Navigation auf diesen Hauptcontainer, mit
          <code>preventScroll: true</code>, damit der Router weiter die Scroll-Position bestimmt;
          und eine kleine Patch-Schicht zur Laufzeit über dem Markup der Bibliothek, beschrieben
          unter Entwicklung.
        </p>
        <p>
          Ein weiteres Stück Shell ist modal, und es ist die Referenz für einen handgebauten
          Dialog: Der Cookie-Einstellungsdialog ist <code>role="dialog"</code> mit
          <code>aria-modal="true"</code>, beschriftet und beschrieben durch seinen eigenen Titel und
          Text. <code>cdkTrapFocus</code> aus dem CDK hält Tab darin und setzt mit Auto-Capture beim
          Öffnen den Fokus auf sein erstes Control; Escape und der Schließen-Button geben den Fokus
          an das Element zurück, das ihn geöffnet hat — oder, wenn dieser Auslöser im gerade
          verschwundenen Banner saß, an die Main-Landmark, statt ihn auf den Body des Dokuments
          fallen zu lassen.
        </p>
        <p class="src-note">
          Landmarks abgelesen an den Templates von Shell und Header und an der Footer-Komponente;
          der Fokuswechsel ist das <code>NavigationEnd</code>-Abonnement in
          <code>app.component.ts</code>, abgesichert durch <code>isPlatformBrowser</code>, weil es
          das Dokument anfasst. Die Fokusfalle des Dialogs, der Escape-Listener und beide
          Fokus-Rückgaben stehen in <code>src/app/components/frame/cookie-consent.component.ts</code>.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          Nichts in diesem Guide hängt von Breakpoints ab. Der Auffangblock, die Fokus-Konvention,
          <code>.sr-only</code>, der Skip-Link und der Satz an Landmarks tragen überhaupt keine
          Viewport-Media-Query — nur die Präferenz-Abfragen oben —, also verhalten sie sich bei
          360px und bei 2560px gleich. Was sich bei dieser Breite wirklich ändert, ist die
          Zielgröße, und das Kit erfüllt SC 2.5.8 Control für Control statt mit einer Regel, die
          alles erreicht. Zwei Mechanismen stehen im globalen Stylesheet, und beide lohnen das
          Kopieren: Der Slider hebt Auras 20&#215;20-Handle auf 24&#215;24, indem er
          <code>--p-slider-handle-width</code>/<code>-height</code> auf <code>.p-slider</code>
          überschreibt, und der Schließen-Button des Cookie-Dialogs ist von vornherein 44&#215;44
          groß. <em>Keinen</em> Mechanismus hat die Abkürzung: <code>.touch-target-44</code> und
          <code>.touch-target-expanded</code> sind im globalen Stylesheet deklariert und werden von
          nichts angewendet, also ist ein Klassenname hier kein Weg zur Untergrenze.
          Layout-Hinweis: SC 2.5.8 verlangt 24&#215;24 CSS px (AA) — gib einem Touch-Control
          selbst so viel, nimm <code>2.75rem</code>, wo das Layout es zulässt, denn 44px ist der
          AAA-Wert aus SC 2.5.5, und lass benachbarte Trefferflächen nicht überlappen.
        </p>
        <p class="src-note">
          Handle-Token-Override, Größe des Schließen-Buttons und beide Utility-Deklarationen aus
          <code>src/styles.scss</code> — der Slider-Block nennt SC 2.5.8 in seinem eigenen
          Kommentar; dass die Utilities keine Aufrufstelle haben, wurde über die versionierten
          Dateien unter <code>src/</code> gezählt.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Ein barrierefreies Control zu bauen ist hier vier Entscheidungen und ein Rezept. Ein
          unzugängliches Control der Bibliothek zu reparieren ist eine andere Aufgabe, und das Kit
          hat schon einen Ort dafür.
        </p>

        <h3>Ein eigenes Widget, verdrahtet</h3>
        <pre class="code-block"><code>{{ widgetSnippet }}</code></pre>
        <p class="src-note">
          Muster zusammengesetzt aus den Konventionen, die dieser Guide misst; die Ring-Form und die
          Klasse für versteckten Text kommen vom Kit, die Rolle, die Tasten und die Ansage von der
          Aufrufstelle.
        </p>

        <h3>Die Patch-Schicht zur Laufzeit</h3>
        <p>
          Manches Markup der Bibliothek lässt sich nicht aus einem Template reparieren, weil die
          Komponente es selbst schreibt. Die Shell antwortet darauf mit einem
          <code>MutationObserver</code>, der eine kleine Patch-Funktion über das Dokument und über
          jeden hinzugefügten Knoten laufen lässt. Ein Patch ist übrig: Er entfernt eine
          präsentationale Rolle vom Container des Tab-Panels, wo sie mit den semantischen Kindern
          darunter kollidiert.
        </p>
        <p>
          Der interessante Teil dieser Funktion ist, was sie ablehnt. Sie dokumentiert vier Patches,
          die sie bewusst weglässt — eine Rolle für den Host des Toggle-Buttons, die Benennung von
          Slidern, das Neuberechnen des aktuellen Slider-Werts und die Benennung der Scroll-Buttons
          der Tab-Leiste —, jeden mit dem Befund, der ihn ausgeschlossen hat: eine Rolle, die die
          Komponente schon auf ihrem eigenen Host bindet, eine Regel, die nie gegriffen hat, weil der
          Knoten gemeldet wurde, bevor seine eigenen Bindings angewendet waren, eine Neuberechnung,
          die einen korrekten Wert durch einen gerundeten ersetzt hat, und ein englisches Literal,
          das über einen Namen gestempelt wurde, den die Bibliothek schon in der Seitensprache
          liefert. Nimm die Lehre mit, bevor du zum Observer greifst: <strong>Ein Patch, der läuft,
          nachdem die Komponente gerendert hat, ist ein Wettlauf, und ein Name ist nur dann
          verlässlich, wenn er an der Aufrufstelle vergeben wird.</strong>
        </p>
        <p class="src-note">
          Der Patch und alle vier Auslassungen stehen in der Patch-Funktion in
          <code>src/app/services/optimus-a11y.service.ts</code>, jede mit ihrer eigenen Messung.
        </p>

        <h3>Was tatsächlich geprüft wird</h3>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Prüfung</th><th>Läuft wo</th><th>Deckt ab</th></tr></thead>
            <tbody>
              <tr>
                <td><code>scripts/check-contrast.mjs</code></td>
                <td><code>build:verify</code> und der Harness</td>
                <td>
                  Token-Paare des Kits und die Widget-Paare von Optimus UI, aufgelöst aus dem
                  Aura-Preset so, wie das Kit es konfiguriert (Checkbox, Select- und Feldkanten, Tag,
                  Dialog, Progress Bar und mehr), in jedem visuellen Stil und Modus, gegen SC 1.4.3 und
                  SC 1.4.11; offene Ausnahmen sind oben in <code>docs/generated/CONTRAST.MD</code>
                  deklariert
                </td>
              </tr>
              <tr>
                <td>Die manuelle Checkliste</td>
                <td>Von Hand, pro Oberfläche</td>
                <td>Tastaturpfad, Fokusreihenfolge, Namen und Rollen, Landmarks, Motion</td>
              </tr>
              <tr>
                <td><code>scripts/check-a11y.mjs</code> (<code>npm run check:a11y</code>)</td>
                <td>CI, nach dem Production-Build; der Health-Check <code>a11y-built-pages</code></td>
                <td>
                  axe-core in Headless Chrome auf einer festen Stichprobe vorgerenderter Routen, beide
                  Sprachen, beide Themes; Verstöße gegen <code>[hard]</code>-A11Y-Regeln blockieren
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Liste der Gates abgelesen an der <code>build:verify</code>-Kette in
          <code>package.json</code> und an <code>scripts/verify-harness.mjs</code>; die Checkliste
          ist <code>directives/accessibility-workflow.md</code>, die Regeln, denen sie dient, sind
          <code>base/standards/A11Y.md</code>.
        </p>

        <h3>Eine API, die wie die Antwort aussieht und keine ist</h3>
        <p>
          Bis zum 24.09.2026 deklarierte <code>src/styles/design-tokens.scss</code> einen
          <code>visually-hidden()</code>- und einen <code>focus-ring()</code>-Mixin. Keiner war
          brauchbar oder wurde benutzt: Das Kit hat kein Komponenten-Stylesheet, also kann keine
          Komponente einen Mixin einbinden, und <code>visually-hidden()</code> duplizierte nur
          <code>.sr-only</code> unter anderem Namen. <code>focus-ring()</code> war schlimmer: Er
          expandierte zu <code>outline: none</code> plus einem Schatten, der zum Zeitpunkt des
          berechneten Werts ungültig ist, entfernte also den Ring, den er zu zeichnen behauptete.
          Beide sind gelöscht. Versteck Text mit <code>.sr-only</code>; der Ring ist die Kit-Ring-Regel
          in <code>src/styles.scss</code> — erweitere ihre Selektorliste für ein neues Widget.
        </p>
        <p class="src-note">
          Gelöschte Mixin-Rümpfe: <code>git log -- src/styles/design-tokens.scss</code>; dass es kein
          <code>&#64;include</code> außerhalb dieser Datei und kein <code>styleUrls</code> im Kit
          gibt, wurde über die versionierten Dateien unter <code>src/</code> gezählt.
        </p>

        <h3>Abnahme-Checkliste</h3>
        <ul class="checklist">
          <li>Tab erreicht das Control, Eingabetaste oder Leertaste bedient es, Esc verlässt alles, was den Fokus festhält.</li>
          <li>Der Ring erscheint bei Tastaturfokus und nicht beim Klick, mit 2px und 2px Abstand.</li>
          <li>Der zugängliche Name kommt aus einem Übersetzungsschlüssel und enthält das sichtbare Label.</li>
          <li>Jede Zustandsänderung, die ein sehender Nutzer sieht, hat eine Textentsprechung, höflich angesagt.</li>
          <li>Keine Bedeutung hängt allein am Farbton.</li>
          <li>Jede JavaScript-getriebene Bewegung fragt <code>prefersReducedMotion()</code>, und jeder Scroll-Aufruf nimmt <code>scrollBehavior()</code>.</li>
          <li>Ein Modal hält den Fokus fest, schließt mit Esc und gibt den Fokus an seinen Auslöser zurück.</li>
          <li>Farbpaare werden aus dem Kompilat zitiert, nie mit der Pipette gemessen.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Ein zugänglicher Name ist ein String, also gilt jede Übersetzungsregel auch für ihn — und
          zwei der Strings, die ein Screenreader vorliest, gehören gar nicht dir: Die Bibliothek
          liefert ihre eigenen mit, und die Dokumentsprache schreibt die App.
        </p>

        <h3>Namen werden gebunden, nicht geschrieben</h3>
        <p>
          Die Konvention ist ein gebundenes Attribut statt eines Literals:
          <code>[attr.aria-label]="translate('…')"</code>. Ein statisches <code>aria-label</code>
          ist der Entwickler-Werkstatt vorbehalten, deren Guides eine Datei pro Sprache ausliefern
          (den englischen Artikel und seinen deutschen Zwilling, ADR-0018), sodass jede Datei ihr
          eigenes Literal trägt; auf jeder Oberfläche für Leser ist ein Literal ein Name, der nie
          übersetzt wird. Dasselbe gilt für <code>aria-labelledby</code> und
          <code>aria-describedby</code> — sie zeigen auf Knoten, deren Text schon übersetzt ist, und
          darum sind sie meist die günstigere Wahl. Dekorative Icons tragen
          <code>aria-hidden="true"</code>, damit der Name vom Control kommt und nicht von der Glyphe.
        </p>

        <h3>Das eigene Screenreader-Vokabular der Bibliothek</h3>
        <p>
          Optimus UI liefert eigene ARIA-Strings mit und setzt sie standardmäßig auf Englisch. Sie
          sind unsichtbar, also verrät nichts auf dem Bildschirm, dass eine deutsche Seite einem
          Screenreader ein englisches Listen-Label übergibt. Die Shell überschreibt dieses Vokabular
          in der Seitensprache, und zwar bewusst nur die Schlüssel, die die Komponenten in diesem Kit
          wirklich lesen — das Listen-Label, das Entfernen-Label, Zurück und Weiter der
          Scroll-Buttons der Tab-Leiste, das Paar für „Alle auswählen“, die Wörter des Ratings, das
          Maximieren-Paar und den Schließen-Button von Message und Toast, der keinen eigenen Input
          für seinen Namen hat. Das Vokabular für Datum, Filter und Upload bleibt englisch: Nichts
          hier rendert es, und es zu übersetzen wäre in jeder Sprache totes Gewicht.
        </p>
        <p class="src-note">
          Schlüsselliste und ihre Begründung aus der ARIA-Sync-Methode in
          <code>src/app/services/optimus-a11y.service.ts</code>; das Zusammenführen geht nur eine
          Ebene tief, darum wird der Block aufgespreizt, bevor er geschrieben wird.
        </p>

        <h3>Die Dokumentsprache</h3>
        <p>
          <code>document.documentElement.lang</code> hat genau einen Schreiber, und das ist die
          Regel und kein Zufall des Codes: Ein zweiter Schreiber, der dasselbe
          Sprachwechsel-Ereignis abonniert, würde das Ergebnis über die Reihenfolge der Abonnements
          entscheiden, und davon sollte ein Dokumentattribut nicht abhängen. Der eine Schreiber ist
          der SEO-Service, und er schreibt die <em>auflösbare Basis</em>sprache — das Suffix der
          Leichten Sprache wird vorher entfernt, weil es keinen ISO-Code für
          „Easy&nbsp;&lt;x&gt;“ gibt und ein Screenreader, der das Tag nicht auflösen kann, für die
          ganze Seite auf die falsche Stimme zurückfällt. Die Sprachkennung des Portals ist etwas
          anderes als das Sprach-Tag, und nur eines von beiden gehört in <code>lang</code>.
        </p>
        <p class="src-note">
          Schreiber und Entfernungsregel in <code>src/app/services/meta-seo.service.ts</code>, dessen
          eigener Kommentar den Grund nennt; der Service wird von der App-Shell instanziiert, läuft
          also auf jeder Route.
        </p>

        <h3>Schreibrichtung</h3>
        <p>
          Das Kit setzt kein <code>dir</code>-Attribut, liefert keine <code>rtl</code>-Regel und
          bietet keinen Richtungsschalter: Jedes Layout ist von links nach rechts und bleibt es,
          egal in welcher Sprache der Inhalt ist. Das ist eine Grenze, kein Feature. Eine
          Rechts-nach-links-Sprache hinzuzufügen heißt, zuerst den <code>dir</code>-Schreiber zu
          schreiben und dann jedes physische <code>left</code> / <code>right</code> in den
          Komponenten-Styles zu prüfen. Diese Prüfung hat einen teilweisen Vorsprung und nicht mehr:
          Etwa die Hälfte der Guides zu Bibliothekskomponenten vermerkt, ob die eigenen Styles ihrer
          Komponente logische Eigenschaften nutzen, der Rest schweigt, und kein Agent-Doc trägt den
          Befund überhaupt — nimm diese Vermerke also als Ausgangspunkt, nicht als Abdeckung.
        </p>
        <p class="src-note">
          Fehlen eines <code>dir</code>-Schreibers und jeder <code>rtl</code>-Regel gezählt über die
          versionierten Dateien unter <code>src/</code>; die Vermerke zu logischen Eigenschaften,
          die es gibt, stehen in den Design-Tabs der Komponenten-Guides.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li><strong>v0.8</strong> — 24.09.2026 — Der tote <code>focus-ring()</code>-Mixin und die beiden
            nie eingebundenen Mixins, die ihn aufriefen (<code>button-base()</code>, <code>input-base()</code>),
            sind aus <code>design-tokens.scss</code> gelöscht, und mit ihnen die unbenutzten
            <code>visually-hidden()</code>, <code>card-base()</code> und <code>truncate()</code> sowie
            die ungelesenen <code>--focus-ring</code>-Tokens; der Tab Entwicklung verweist auf
            <code>.sr-only</code> und die Kit-Ring-Regel.
          </li>
          <li><strong>v0.7</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Der
            Megamenü-Eintrag und der Autocomplete-Chip bekommen ebenfalls den Kit-Ring, und das tote
            <code>--input-focus-ring</code>-Token, das die Quellenvermerke zitierten, ist weg.
          </li>
          <li><strong>v0.6</strong> — 23.09.2026 — Abgeglichen mit den Kontrast- und Fokus-Runden: Die eine
            Kit-Ring-Regel deckt jetzt jeden fokussierbaren Optimus-UI-Teil und die Cookie-Buttons ab (die
            Familien- und Cookie-Regeln sind weg), gemessen in der Gruppe <code>focus ring</code> des Gates;
            der Rollen-Patch für den Toggle-Button ist entfernt, also bleiben ein Patch zur Laufzeit und vier
            dokumentierte Auslassungen.
          </li>
          <li><strong>v0.5</strong> — 23.09.2026 — Auf den aktuellen Stand des Kits gebracht: Die
            JavaScript-Hälfte von Reduced Motion ist der Helfer <code>src/app/utils/reduced-motion.ts</code>,
            die Main-Landmark ist ein natives <code>&lt;main&gt;</code>, und der Cookie-Einstellungsdialog
            ist als modale Referenz der Shell benannt (Fokusfalle, Escape, Fokus-Rückgabe). Das
            Kontrast-Gate misst jetzt auch Widget-Paare von Optimus UI; das niedrigste Verhältnis des
            Ring-Tokens wird über alle vier visuellen Stile zitiert (4,75:1). Das Agent-Doc ist auf das
            Ziel gekürzt.</li>
          <li><strong>v0.4</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014). Die
            Preset-Fakten stehen wieder auf Aura 2.x und wurden dort neu gelesen: Der globale
            <code>focusRing</code> ist weiter 1px solid primary mit 2px Abstand, und
            <code>form.field.focusRing</code> ist weiter auf null gesetzt, aber der Slider-Handle ist
            20&#215;20, und die Checkbox ist <em>nicht</em> ringlos — sie erbt den globalen 1px-Ring,
            den die Kit-Regel ersetzt, statt ihn zu ergänzen. Zwei veraltete Zeilenverweise im Repo im
            Kopfblock wurden neu ermittelt (<code>styles.scss:1164</code>,
            <code>design-tokens.scss:660</code>).</li>
          <li><strong>v0.3</strong> — 23.08.2026 — Neu gemessen gegen PrimeNG 22.1.0 /
            Themes 3.0.0. Die Ring-Geschichte bekommt eine zweite Ebene: Seit dieser Version
            zeichnen Familienregeln in <code>styles.scss</code> den 2px-Kit-Ring auf die ringlosen
            Formular-Controls von PrimeNG (<code>.p-inputtext</code>, <code>.p-textarea</code>, das
            Checkbox-Kästchen, <code>.p-select</code>) — im Browser in beiden Themes geprüft —,
            während jedes andere Element noch seinen eigenen zeichnet. Preset-Fakten in Themes 3.0
            neu geprüft: Der globale 1px-Ring und der auf null gesetzte
            <code>form.field.focusRing</code> gelten beide weiter.</li>
          <li><strong>v0.2</strong> — 18.08.2026 — Review-Durchgang. SC 2.5.8 wird pro Control erfüllt,
            nicht nirgends: Der Slider-Handle-Override und der 44&#215;44-Schließen-Button werden als
            die Mechanismen genannt, die unbenutzten Utilities als der fehlende Teil, und die
            24px-Untergrenze wird vom 44px-AAA-Wert getrennt. <code>:focus-visible</code> wird als
            Kit-Standard benannt statt als universelle Tatsache, die Ring-Regeln des globalen
            Stylesheets werden als drei gezählt, die Do/Don’t-Paare zu Ring und Benennung rendern
            echte Controls, und der RTL-Hinweis ist auf das eingegrenzt, was die Komponenten-Guides
            tatsächlich vermerken. Zwei Defekt-Einordnungen verlassen den Text: <code>lang</code>
            wird als die Regel mit einem einzigen Schreiber dokumentiert, die sie ist, und der
            Reduced-Motion-Hinweis behält den Mechanismus ohne den Fehlerbericht.</li>
          <li><strong>v0.1</strong> — 18.08.2026 — Erster Guide: die vier globalen Mechanismen an
            ihrer Quelle gemessen, der Reduced-Motion-Auffangblock und was er nicht erreicht, die Form
            des Fokus-Rings und das ungemessene Farb-Token, in dem die meisten Regeln ihn malen, die
            beiden toten Sass-Mixins, die unbenutzten Touch-Target-Utilities, die Patch-Schicht zur
            Laufzeit mit ihren drei dokumentierten Entfernungen, die beiden Schreiber von
            <code>lang</code> und das kanonische Agent-Doc.</li>
        </ul>
      </ng-template>

    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class A11yGuidelinesArticleDeComponent extends A11yGuidelinesArticleComponent {
  /** The live region's sentence, in German. */
  override readonly announcement = computed(() =>
    this.score() === 0 ? '' : 'Punkt hinzugefügt. Die Summe ist jetzt ' + this.score() + '.'
  );

  /** Language names in German; each close name stays in its own language. */
  protected override readonly demoLangs = [
    { label: 'Englisch', close: 'Close' },
    { label: 'Deutsch', close: 'Schließen' },
    { label: 'Französisch', close: 'Fermer' },
  ];

  override readonly ringLightMin: string = '4,75:1';
  override readonly ringDarkMin: string = '4,75:1';
}
