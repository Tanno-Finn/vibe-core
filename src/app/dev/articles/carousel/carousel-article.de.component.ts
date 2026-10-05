import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import type { ButtonProps } from '@openng/optimus-ui/button';
import {
  CarouselArticleComponent,
  ARTICLE_IMPORTS,
  ARTICLE_STYLES,
  type Concept,
  type Figure,
} from './carousel-article.component';

/**
 * German twin of the Carousel and Galleria guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the demo content and the visible
 * strings in `m` are German. Keep it in step with the English file: same tabs, same
 * element and binding skeleton (`node scripts/check-guide-translations.mjs carousel`).
 */
@Component({
  selector: 'app-carousel-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'carousel'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Carousel versteckt alle Einträge bis auf einen hinter einem Control, das die meisten Leser nie anfassen.
          Nimm eines, wenn die Einträge optional, gleich gewichtig und wenige sind — und repariere dann, was die
          Bibliothek offen lässt: Namen, Button-Typen und jede Rotation.
        </p>

        <h3>Ein Begriff je Folie — benannt, typisiert, nie rotierend</h3>
        <p-carousel
          [value]="concepts"
          [numVisible]="1"
          [numScroll]="1"
          [prevButtonProps]="prevProps"
          [nextButtonProps]="nextProps"
          aria-label="KI-Begriffe, einer je Folie"
        >
          <ng-template #item let-concept>
            <div class="slide">
              <h4 class="slide__term">{{ concept.term }}</h4>
              <p class="slide__text">{{ concept.text }}</p>
            </div>
          </ng-template>
        </p-carousel>
        <p class="src-note">
          Ein echtes <code>p-carousel</code>. Die Region wird durch das <code>aria-label</code> auf dem Host benannt;
          die Buttons für zurück und weiter bekommen ihre Namen und <code>type="button"</code> über
          <code>prevButtonProps</code> / <code>nextButtonProps</code>, weil das eigene Label der Komponente auf dem Host
          von <code>p-button</code> landet, nicht auf dem Button darin (<code>openng-optimus-ui-carousel.mjs:881</code>,
          <code>:945</code>; <code>openng-optimus-ui-button.mjs:835</code>).
        </p>

        <h3>Rotation, mit den Controls, die sie schuldet</h3>
        <div class="rotator">
          <button type="button" class="rot-btn" (click)="toggleRotation()">
            <span class="pi" [class.pi-pause]="rotating()" [class.pi-play]="!rotating()" aria-hidden="true"></span>
            {{ rotating() ? 'Folienwechsel stoppen' : 'Folienwechsel starten' }}
          </button>
          <div
            class="rotator__frame"
            (focusin)="onFrameFocus()"
            (mouseenter)="hoverPause(true)"
            (mouseleave)="hoverPause(false)"
            (touchend)="syncAfterInteraction()"
          >
            <p-carousel
              #rotator
              [value]="concepts"
              [numVisible]="1"
              [circular]="true"
              [autoplayInterval]="6000"
              [prevButtonProps]="prevProps"
              [nextButtonProps]="nextProps"
              aria-label="KI-Begriffe, rotierend"
            >
              <ng-template #item let-concept>
                <div class="slide">
                  <h4 class="slide__term">{{ concept.term }}</h4>
                  <p class="slide__text">{{ concept.text }}</p>
                </div>
              </ng-template>
            </p-carousel>
          </div>
          <p class="rot-note">{{ rotationNote() }}</p>
        </div>
        <p class="src-note">
          Der Stopp/Start-Button gehört dieser Seite; die Komponente hat keinen. Er steuert die öffentlichen Methoden
          <code>startAutoplay()</code>, <code>stopAutoplay()</code> und <code>isPlaying()</code>
          (<code>openng-optimus-ui-carousel.d.ts:357-359</code>). Die Rotation startet nicht, wenn
          <code>prefersReducedMotion()</code> aus <code>src/app/utils/reduced-motion.ts</code> eine Präferenz meldet,
          stoppt endgültig, sobald der Fokus in das Carousel kommt, und pausiert, solange der Zeiger darauf ruht — das
          Verhalten, das das APG-Carousel-Pattern vorgibt.
        </p>

        <h3>Galleria: eine Reihe von Abbildungen mit Thumbnails</h3>
        <p-galleria
          [value]="figures"
          [(activeIndex)]="figureIndex"
          [numVisible]="4"
          [showItemNavigators]="false"
          [containerStyle]="galleriaStyle"
        >
          <ng-template #item let-fig>
            <figure class="fig">
              <svg class="fig__svg" viewBox="0 0 160 90" role="img" [attr.aria-label]="fig.alt">
                @switch (fig.kind) {
                  @case ('bars') {
                    <rect class="ink" x="20" y="40" width="20" height="40" />
                    <rect class="ink" x="55" y="20" width="20" height="60" />
                    <rect class="ink" x="90" y="50" width="20" height="30" />
                    <rect class="ink" x="125" y="30" width="20" height="50" />
                  }
                  @case ('clusters') {
                    <circle class="ink" cx="40" cy="30" r="5" />
                    <circle class="ink" cx="50" cy="40" r="5" />
                    <circle class="ink" cx="35" cy="45" r="5" />
                    <circle class="ink2" cx="115" cy="55" r="5" />
                    <circle class="ink2" cx="125" cy="65" r="5" />
                    <circle class="ink2" cx="110" cy="70" r="5" />
                  }
                  @case ('loss') {
                    <polyline class="line" points="15,15 45,45 75,60 105,68 145,72" />
                  }
                  @case ('grid') {
                    <rect class="ink" x="40" y="10" width="20" height="20" />
                    <rect class="ink2" x="60" y="10" width="20" height="20" />
                    <rect class="ink2" x="40" y="30" width="20" height="20" />
                    <rect class="ink" x="60" y="30" width="20" height="20" />
                    <rect class="ink" x="80" y="50" width="20" height="20" />
                    <rect class="ink2" x="100" y="50" width="20" height="20" />
                  }
                }
              </svg>
            </figure>
          </ng-template>
          <ng-template #thumbnail let-fig>
            <span class="thumb" aria-hidden="true">{{ fig.title }}</span>
          </ng-template>
          <ng-template #caption let-fig>
            <p class="fig__caption">{{ fig.title }}</p>
          </ng-template>
        </p-galleria>
        <p class="src-note">
          Ein echtes <code>p-galleria</code> mit Thumbnails und ohne Item-Navigatoren, deren Buttons
          <code>role="navigation"</code> und keinen Namen tragen (<code>openng-optimus-ui-galleria.mjs:1394</code>, <code>:1415</code>).
          Die Thumbnails nehmen Pfeil nach links/rechts, Pos1, Ende, Enter und Leertaste an (<code>:1769-1797</code>);
          ihre zugänglichen Namen sind die bloßen Seitenzahlen aus <code>pageLabel</code>, deshalb benennt sich jede
          Abbildung selbst mit <code>role="img"</code> und einem <code>aria-label</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Soll das überhaupt ein Carousel sein?</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Der Inhalt</th><th>Das Mittel der Wahl</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr><td>Drei bis acht gleich gewichtige Teaser</td><td>ein Raster aus Cards</td><td>{{ m.whenGrid }}</td></tr>
              <tr><td>Schritte, die aufeinander aufbauen</td><td>Stepper</td><td>{{ m.whenSteps }}</td></tr>
              <tr><td>Die Kernbotschaft der Seite</td><td>statischer Inhalt</td><td>{{ m.whenKey }}</td></tr>
              <tr><td>Optionale Extras, wenige, kurze</td><td><code>p-carousel</code>, manuell</td><td>{{ m.whenCarousel }}</td></tr>
              <tr><td>Eine Reihe verwandter Bilder zum Vergleichen</td><td><code>p-galleria</code> mit Thumbnails</td><td>{{ m.whenGalleria }}</td></tr>
              <tr><td>Alles, was von selbst rotieren muss</td><td>neu überdenken</td><td>{{ m.whenRotate }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Belege: Nielsen, „Auto-Forwarding Carousels and Accordions Annoy Users and Reduce Visibility“ (NN/g, 2013) —
          bewegter Inhalt wird als Werbung gelesen und läuft langsamen Lesern davon; Runyon, „Carousel Interaction Stats“
          (2013) — etwa 1 % der Besucher einer Universitäts-Startseite klickten auf einen Carousel-Eintrag, und 84 %
          dieser Klicks gingen auf die erste Position.
        </p>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Kernbotschaft auf Folie 3 von 5</span>
            <div class="dd__stage">
              <div class="mock-slide">
                <strong>Temperatur</strong>
                <span>Eine Einstellung, die die Ausgabe vielfältiger oder vorhersehbarer macht.</span>
                <span class="mock-dots" aria-hidden="true"
                  ><span></span><span></span><span class="on"></span><span></span><span></span
                ></span>
              </div>
            </div>
            <p class="dd__why">{{ m.hiddenWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — dieselben fünf, alle sichtbar</span>
            <div class="dd__stage">
              <ul class="concept-list">
                @for (c of concepts; track c.term) {
                  <li><strong>{{ c.term }}</strong> — {{ c.text }}</li>
                }
              </ul>
            </div>
            <p class="dd__why">{{ m.visibleWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Die linke Fläche ist ein statisches Bild einer Folie und ihrer Indikatorpunkte; die rechte ist die Liste, aus
          der das Carousel im Tab „Beispiele“ gebaut ist. Gleicher Inhalt, gleicher Platz — ein sichtbarer Eintrag
          gegen fünf.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — den Standardnamen der Navigatoren vertrauen</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ defaultNavSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.defaultNavWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — sie über buttonProps benennen und typisieren</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ namedNavSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.namedNavWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Label-Binding bei <code>openng-optimus-ui-carousel.mjs:881</code> und <code>:945</code>; Label und Typ des
          inneren Buttons bei <code>openng-optimus-ui-button.mjs:834-835</code>; die Standardwerte beider Props bei
          <code>openng-optimus-ui-carousel.mjs:285-298</code>.
        </p>

        <h3>Quellen</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-carousel.mjs</code> und <code>openng-optimus-ui-galleria.mjs</code> — jede Rolle,
            jedes Label, jede Taste und jeder Timer, die diese Seite zitiert.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/carousel/" rel="noopener noreferrer" target="_blank"
              >APG — Carousel pattern</a
            >
            — das Rotations-Control, Stopp bei Fokus, Pause bei Hover und <code>aria-live</code> aus während der Rotation.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/carousels/" rel="noopener noreferrer" target="_blank"
              >W3C WAI — Carousels tutorial</a
            >
            — Hinweise zu Struktur, Beschriftung und Animation von derselben Arbeitsgruppe.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html"
              rel="noopener noreferrer"
              target="_blank"
              >WCAG 2.2 — Understanding SC 2.2.2 Pause, Stop, Hide</a
            >
            — warum Bewegung, die von selbst startet und länger als fünf Sekunden dauert, ein Stopp-Control braucht.
          </li>
          <li>
            <a href="https://www.nngroup.com/articles/auto-forwarding/" rel="noopener noreferrer" target="_blank"
              >Nielsen Norman Group — Auto-Forwarding Carousels and Accordions Annoy Users (2013)</a
            >
            — Usability-Belege gegen Rotation.
          </li>
          <li>
            <a
              href="https://erikrunyon.com/2013/01/carousel-interaction-stats/"
              rel="noopener noreferrer"
              target="_blank"
              >Erik Runyon — Carousel Interaction Stats (2013)</a
            >
            — gemessene Klickraten auf Carousels im Produktivbetrieb.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Carousel-Token</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura-Wert</th><th>Wirkung</th></tr>
            </thead>
            <tbody>
              <tr><td><code>carousel.indicator.width</code> / <code>height</code></td><td>2rem / 0.5rem</td><td>{{ m.tokIndicator }}</td></tr>
              <tr><td><code>carousel.indicator.background</code></td><td>surface.200 hell · surface.700 dunkel</td><td>{{ m.tokIndicatorBg }}</td></tr>
              <tr><td><code>carousel.indicator.active.background</code></td><td>primary.color</td><td>{{ m.tokIndicatorActive }}</td></tr>
              <tr><td><code>carousel.indicator.list.gap</code> / <code>padding</code></td><td>0.5rem / 1rem</td><td>{{ m.tokIndicatorList }}</td></tr>
              <tr><td><code>carousel.content.gap</code></td><td>0.25rem</td><td>{{ m.tokContentGap }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/carousel/index.mjs</code>. Die Navigator-Buttons sind
          <code>p-button</code>s (standardmäßig secondary, text, rounded) und malen mit den Button-Token.
          <code>src/styles.scss</code> fasst die beiden Komponenten einmal an: Der Indikator-Button des Carousels steht
          in der einen Fokus-Ring-Liste des Kits (2px <code>--primary-color-fg</code>, 2px Offset), wie die
          Navigator-Buttons als <code>p-button</code>s. Kein visueller Stil hat eine Regel für eine der beiden.
        </p>

        <h3>Galleria-Token</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura-Wert</th><th>Wirkung</th></tr>
            </thead>
            <tbody>
              <tr><td><code>galleria.nav.button.size</code></td><td>3rem</td><td>{{ m.tokGNav }}</td></tr>
              <tr><td><code>galleria.thumbnail.nav.button.size</code></td><td>2rem</td><td>{{ m.tokGThumbNav }}</td></tr>
              <tr><td><code>galleria.caption.background</code> / <code>color</code></td><td>rgba(0, 0, 0, 0.5) / surface.100</td><td>{{ m.tokGCaption }}</td></tr>
              <tr><td><code>galleria.indicator.button.width</code> / <code>height</code></td><td>1rem / 1rem</td><td>{{ m.tokGIndicator }}</td></tr>
              <tr><td><code>galleria.close.button.size</code></td><td>3rem</td><td>{{ m.tokGClose }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/galleria/index.mjs</code>.</p>

        <h3>Kontrast</h3>
        <p>{{ m.contrast }}</p>
        <p class="src-note">
          <code>docs/generated/CONTRAST.MD</code> hat keine Carousel-Gruppe, und das Gate deklariert keine Ausnahmen.
          Der inaktive Indikator malt im hellen Modus <code>surface.200</code> (#e2e8f0) und im dunklen
          <code>surface.700</code> (#3f3f46) — das <code>content.border.color</code> von Aura, das die Datei als
          informative Zeilen <code>progressbar.background</code> führt: 1,23:1 auf <code>--surface-card</code> im hellen
          und 1,26–1,61:1 im dunklen Modus, ohne zugeordnetes Kriterium, weil nichts im Kit sich darauf als Begrenzung
          verlässt. Der aktive Indikator ist <code>primary.color</code>, die Füllung der Checkbox („checkbox &amp;
          radiobutton“, 4,75:1 und mehr auf der Card); der Fokus-Ring des Indikators ist die Zeile „focus ring“ auf den
          Seitenflächen, 3,88:1 und mehr. Die Farben von Caption und Navigatoren der Galleria liegen auf deinem Bild und
          sind nicht im Kontrast-Gate.
        </p>

        <h3>Schmaler Viewport und Touch</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          Media Queries, geschrieben in ein <code>&lt;style&gt;</code> im Head des Dokuments
          (<code>openng-optimus-ui-carousel.mjs:512-545</code>); der JavaScript-Abgleich bei <code>:553-557</code>;
          Wischen bei <code>:782-812</code>. Keines der beiden Komponenten-Stylesheets in
          <code>&#64;openng/optimus-ui-styles/dist</code> enthält eine Media Query.
        </p>

        <h3>Bewegung</h3>
        <p>{{ m.motion }}</p>
        <p class="src-note">
          Inline <code>transition: transform 500ms ease 0s</code> bei <code>openng-optimus-ui-carousel.mjs:737</code>;
          die Regel des Kits ist der Block <code>prefers-reduced-motion</code> oben in <code>src/styles.scss</code>
          (<code>transition-duration: 0.01ms !important</code>). Die Timer sind <code>setInterval</code>-Aufrufe
          (<code>openng-optimus-ui-carousel.mjs:747</code>, <code>openng-optimus-ui-galleria.mjs:908</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Carousel-API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Standard</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>value</code></td><td>—</td><td>{{ m.apiValue }}</td></tr>
              <tr><td><code>numVisible</code> / <code>numScroll</code></td><td>1 / 1</td><td>{{ m.apiNum }}</td></tr>
              <tr><td><code>responsiveOptions</code></td><td>—</td><td>{{ m.apiResponsive }}</td></tr>
              <tr><td><code>orientation</code> / <code>verticalViewPortHeight</code></td><td>horizontal / 300px</td><td>{{ m.apiOrientation }}</td></tr>
              <tr><td><code>circular</code></td><td>false</td><td>{{ m.apiCircular }}</td></tr>
              <tr><td><code>showNavigators</code> / <code>showIndicators</code></td><td>true / true</td><td>{{ m.apiShow }}</td></tr>
              <tr><td><code>autoplayInterval</code></td><td>0</td><td>{{ m.apiAutoplay }}</td></tr>
              <tr><td><code>prevButtonProps</code> / <code>nextButtonProps</code></td><td>secondary, text, rounded</td><td>{{ m.apiButtonProps }}</td></tr>
              <tr><td><code>page</code> · <code>onPage</code></td><td>0</td><td>{{ m.apiPage }}</td></tr>
              <tr><td><code>startAutoplay()</code> · <code>stopAutoplay()</code> · <code>isPlaying()</code></td><td>—</td><td>{{ m.apiMethods }}</td></tr>
              <tr><td>Templates <code>#item</code> · <code>#header</code> · <code>#footer</code></td><td>—</td><td>{{ m.apiTemplates }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs und Outputs aus der kompilierten Komponente bei <code>openng-optimus-ui-carousel.mjs:871</code>;
          Standardwerte bei <code>:186-298</code>; Methoden deklariert bei <code>openng-optimus-ui-carousel.d.ts:357-359</code>.
          <code>Carousel</code> ist standalone.
        </p>

        <h3>Was das Carousel assistiven Technologien zeigt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Teil</th><th>Rendert</th><th>Folge</th></tr>
            </thead>
            <tbody>
              <tr><td>Host</td><td><code>role="region"</code>, kein Name (<code>:871</code>)</td><td>{{ m.a11yHost }}</td></tr>
              <tr><td>Inhalt</td><td><code>aria-live</code> polite, solange Autoplay erlaubt ist (<code>:877</code>)</td><td>{{ m.a11yLive }}</td></tr>
              <tr><td>Zurück / weiter</td><td>Label auf dem Host von <code>p-button</code> (<code>:881</code>, <code>:945</code>)</td><td>{{ m.a11yNav }}</td></tr>
              <tr><td>Folie</td><td><code>role="group"</code>, Roledescription, Label aus einem nullbasierten Index (<code>:917-920</code>)</td><td>{{ m.a11ySlide }}</td></tr>
              <tr><td>Folien außerhalb der Seite</td><td><code>aria-hidden="true"</code>, nicht <code>inert</code> (<code>:918</code>)</td><td>{{ m.a11yHidden }}</td></tr>
              <tr><td>Zirkuläre Klone</td><td>nachgestellte Klone ohne <code>aria-hidden</code> (<code>:928-937</code>)</td><td>{{ m.a11yClones }}</td></tr>
              <tr><td>Indikatoren</td><td>native Buttons, <code>aria-current="page"</code>, Roving Tabindex (<code>:963-979</code>)</td><td>{{ m.a11yDots }}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Was die Galleria zeigt</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Teil</th><th>Rendert</th><th>Folge</th></tr>
            </thead>
            <tbody>
              <tr><td>Item-Navigatoren</td><td><code>&lt;button role="navigation"&gt;</code>, kein Name (<code>:1394</code>, <code>:1415</code>)</td><td>{{ m.gNav }}</td></tr>
              <tr><td>Indikatoren</td><td><code>&lt;li tabindex="0" aria-selected&gt;</code> (<code>:1429-1438</code>)</td><td>{{ m.gDots }}</td></tr>
              <tr><td>Thumbnails</td><td><code>role="tablist"</code> ohne Tabs; Namen aus <code>pageLabel</code> (<code>:1974</code>, <code>:1989</code>)</td><td>{{ m.gThumbs }}</td></tr>
              <tr><td>Vollbild</td><td><code>role="dialog"</code> + <code>aria-modal</code>, Fokusfalle (<code>:642-643</code>, <code>:664-665</code>)</td><td>{{ m.gFull }}</td></tr>
              <tr><td>Autoplay</td><td><code>aria-live</code> polite, solange <code>autoPlay</code> (<code>:964</code>)</td><td>{{ m.gAuto }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zeilennummern in <code>openng-optimus-ui-galleria.mjs</code>. <code>p-galleria</code> ist in einem NgModule
          deklariert (<code>isStandalone: false</code>, <code>:628</code>): Importiere <code>GalleriaModule</code>.
        </p>

        <h3>Rezept: Rotation mit Stopp-Button</h3>
        <pre class="code-block"><code>{{ rotationSnippet }}</code></pre>
        <p class="src-note">
          <code>startAutoplay()</code> setzt ein neues Intervall, ohne ein laufendes zu löschen
          (<code>openng-optimus-ui-carousel.mjs:746-759</code>), also sichere es mit <code>isPlaying()</code> ab. Halte
          <code>autoplayInterval</code> über null, auch wenn die Rotation gestoppt startet: Die Methode liest es als
          Verzögerung.
        </p>

        <h3>Rezept: Galleria im Vollbild, die sich mit Esc schließt</h3>
        <pre class="code-block"><code>{{ fullscreenSnippet }}</code></pre>
        <p class="src-note">
          Die Vollbild-Maske rendert innerhalb des Elements <code>p-galleria</code> (<code>:629-672</code>), also sieht
          ein Key-Listener auf dem Host die Tasten aus dem gefangenen Inhalt. Die Komponente hat keinen Handler für Esc
          und gibt den Fokus nirgendwohin zurück (<code>:594-597</code>); beides ist deine Aufgabe.
        </p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkWhether }}</li>
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkButtons }}</li>
          <li>{{ m.checkRotation }}</li>
          <li>{{ m.checkMotion }}</li>
          <li>{{ m.checkInteractive }}</li>
          <li>{{ m.checkGalleria }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Die Strings, die die Bibliothek liest</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Schlüssel (<code>translation.aria</code>)</th><th>Standard</th><th>Gelesen von</th><th>Übersetzt das Kit?</th></tr>
            </thead>
            <tbody>
              <tr><td><code>prevPageLabel</code> / <code>nextPageLabel</code></td><td>Previous Page / Next Page</td><td>{{ m.i18nNav }}</td><td>ja</td></tr>
              <tr><td><code>slide</code></td><td>Slide</td><td>{{ m.i18nSlide }}</td><td>ja</td></tr>
              <tr><td><code>slideNumber</code></td><td>die bloße Zahl</td><td>{{ m.i18nSlideNumber }}</td><td>nein, mit Absicht</td></tr>
              <tr><td><code>pageLabel</code></td><td>die bloße Zahl</td><td>{{ m.i18nPage }}</td><td>ja — „Seite {{ '{' }}page{{ '}' }}“</td></tr>
              <tr><td><code>close</code></td><td>Close</td><td>{{ m.i18nClose }}</td><td>ja</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Standardwerte in <code>openng-optimus-ui-config.mjs</code> (<code>:184</code>, <code>:198</code>,
          <code>:201-202</code>, <code>:220-221</code>). <code>OptimusA11yService.syncAriaStrings()</code> des Kits in
          <code>src/app/services/optimus-a11y.service.ts</code> gibt Optimus eine feste Liste von <code>aria</code>-Schlüsseln
          (<code>OPTIMUS_ARIA_KEYS</code>) in der Seitensprache: <code>slide</code>, <code>pageLabel</code>,
          <code>prevPageLabel</code>, <code>nextPageLabel</code> und <code>close</code> stehen darauf.
          <code>slideNumber</code> bleibt mit Absicht die bloße Zahl der Bibliothek — das Carousel übergibt einen
          nullbasierten Index, also würde eine Formulierung darum herum „Folie 0“ ansagen.
        </p>

        <h3>Labels je Instanz</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p>{{ m.i18nRoledescription }}</p>

        <h3>Schreibrichtung</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v1.1</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Werte der Indikatoren
            neu zitiert aus den informativen Zeilen <code>progressbar.background</code> (keine deklarierten Ausnahmen
            mehr), der Kit-Ring des Indikators und die aktive Füllung zitiert; <code>slide</code>, <code>pageLabel</code>
            und die Labels der Navigatoren werden jetzt in der Seitensprache übergeben.
          </li>
          <li><strong>v1.0</strong> — 23.09.2026 — Erste Fassung, gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class CarouselArticleDeComponent extends CarouselArticleComponent {
  override readonly concepts: Concept[] = [
    { term: 'Token', text: 'Modelle lesen Text in Stücken, die Token heißen — oft Teile von Wörtern.' },
    { term: 'Kontextfenster', text: 'Die Menge an Text, die ein Modell auf einmal berücksichtigen kann.' },
    { term: 'Temperatur', text: 'Eine Einstellung, die die Ausgabe vielfältiger oder vorhersehbarer macht.' },
    { term: 'Embedding', text: 'Eine Liste von Zahlen, die einen Text in einem Raum von Bedeutungen verortet.' },
    { term: 'Halluzination', text: 'Flüssige Ausgabe, die keine Quelle stützt.' },
  ];

  override readonly prevProps: ButtonProps = {
    severity: 'secondary',
    text: true,
    rounded: true,
    type: 'button',
    ariaLabel: 'Vorherige Folie',
  };
  override readonly nextProps: ButtonProps = {
    severity: 'secondary',
    text: true,
    rounded: true,
    type: 'button',
    ariaLabel: 'Nächste Folie',
  };

  override readonly figures: Figure[] = [
    { kind: 'bars', title: 'Token pro Satz', alt: 'Balkendiagramm: vier Sätze mit 4, 6, 3 und 5 Token.' },
    { kind: 'clusters', title: 'Zwei Cluster', alt: 'Streudiagramm: zwei getrennte Gruppen aus je drei Punkten.' },
    { kind: 'loss', title: 'Trainings-Loss', alt: 'Liniendiagramm: Der Loss fällt steil und flacht dann ab.' },
    { kind: 'grid', title: 'Attention-Gewichte', alt: 'Raster: starke Gewichte auf der Diagonalen, schwächere daneben.' },
  ];

  override readonly rotationNote = computed(() => {
    if (this.rotating()) return 'Wechselt alle 6 Sekunden. Fokus darin stoppt den Wechsel; der Zeiger darauf pausiert ihn.';
    if (this.reducedMotion())
      return 'Kein Wechsel: Dein System verlangt reduzierte Bewegung. Der Button startet ihn trotzdem.';
    return 'Folienwechsel gestoppt.';
  });

  override readonly m = {
    // usage
    whenGrid:
      'Alles ist auf einmal sichtbar und überfliegbar; ein Carousel zeigt einen Eintrag und lässt den Leser für den Rest arbeiten.',
    whenSteps:
      'Eine Abfolge hat eine Reihenfolge und eine Position; ein Stepper benennt beides, wo ein Carousel nur zurück und weiter anbietet.',
    whenKey:
      'Was gelesen werden muss, darf nicht hinter einem Control sitzen, das die meisten Besucher nie bedienen — stell es auf die Seite.',
    whenCarousel:
      'Vertretbar, wenn jeder Eintrag optional ist, die Menge klein ist und die Seite auch dann gut funktioniert, wenn immer nur der erste Eintrag gesehen wird.',
    whenGalleria:
      'Ein Viewer mit Thumbnails passt zu Bildern, die verglichen werden sollen; die Thumbnails dienen zugleich als Überblick und als Tastaturweg.',
    whenRotate:
      'Rotation schuldet ein Stopp-Control (SC 2.2.2), einen Stopp bei Fokus, eine Pause bei Hover und Stille für Screenreader. Den meisten Inhalten bringt sie nichts.',
    hiddenWhy:
      'Vier von fünf Einträgen liegen einen Klick entfernt, den wenige Leser machen, und eine rotierende Fassung zieht weiter, bevor ein langsamer Leser fertig ist.',
    visibleWhy:
      'Fünf kurze Einträge passen als Liste in denselben Platz; jeder Leser sieht alle, in beliebiger Reihenfolge, in seinem eigenen Tempo.',
    defaultNavWhy:
      'Die Komponente bindet ihr Label an den Host von p-button, wo es nichts benennt; der innere Button ist ein reiner Icon-Button ohne Namen, und der Zurück-Button hat keinen type, ist also innerhalb eines Formulars ein Submit-Button.',
    namedNavWhy:
      'buttonProps erreichen den inneren Button: ariaLabel benennt ihn, und type="button" hält ihn aus dem Absenden des Formulars heraus. Gib severity, text und rounded erneut an — das Objekt ersetzt den Standard.',

    // design
    tokIndicator:
      'Jeder Indikator ist 32 mal 8 CSS-Pixel groß. Er besteht SC 2.5.8 (24 mal 24) nur über die Abstandsausnahme, nicht durch seine Größe.',
    tokIndicatorBg: 'Die Füllung jedes inaktiven Indikators.',
    tokIndicatorActive:
      'Die aktuelle Seite. Farbe ist neben aria-current der einzige Unterschied zwischen aktiv und inaktiv.',
    tokIndicatorList: 'Abstand zwischen und um die Indikatoren.',
    tokContentGap: 'Abstand zwischen den Navigatoren und dem Viewport.',
    tokGNav: 'Item-Navigatoren: groß, rund, durchscheinend weiß über dem Bild.',
    tokGThumbNav: 'Die Pfeile neben dem Thumbnail-Streifen.',
    tokGCaption: 'Ein halbtransparentes schwarzes Band über dem Bild; der Textkontrast hängt vom Bild darunter ab.',
    tokGIndicator: 'Runde Indikatorpunkte, 16 mal 16 CSS-Pixel.',
    tokGClose: 'Der Schließen-Button der Vollbildansicht.',
    contrast:
      'Lass die Indikatoren nicht den einzigen Weg tragen, zu erkennen, wo du bist, oder dich zu bewegen. Der aktive ist der Akzent und schafft 3:1 auf der Card, aber die inaktive Füllung hebt sich kaum von der Card ab (etwa 1,2:1), deshalb ist die Reihe der Indikatoren schwer als Gruppe von Controls zu erkennen. Halte die benannten Buttons für zurück und weiter sichtbar, und zeig die Position in Text („2 von 5“), wo es darauf ankommt.',
    narrow:
      'Das Carousel passt seine Größe dem Container an; responsiveOptions ändert numVisible an Breakpoints des Viewports, nicht an Containerbreiten. Schreib Breakpoints in px: Die CSS-Seite nutzt den String in einer Media Query, während die JavaScript-Seite parseInt(breakpoint) gegen window.innerWidth liest, also greift „48rem“ bei 48 Pixeln. Auf Touch blättert ein horizontales Wischen über 20 Pixel, und jedes abbrechbare touchmove auf dem Viewport wird verhindert — ein vertikales Scrollen der Seite, das auf dem Carousel beginnt, scrollt die Seite nicht. Die Galleria hat keinen eigenen Breakpoint außer responsiveOptions für die Zahl der Thumbnails; die Beispiele auf dieser Seite begrenzen sie auf 40rem.',
    motion:
      'Der Folienübergang ist eine inline gesetzte Transform-Transition von 500ms; die globale Reduced-Motion-Regel des Kits überschreibt sie mit einer important-Deklaration, also springen die Folien, statt zu gleiten. Die Autoplay-Timer sind JavaScript und werden von CSS nicht erreicht: Frag prefersReducedMotion() aus src/app/utils/reduced-motion.ts, bevor die Rotation startet, und stopp sie, wenn die Antwort ja ist.',

    // development
    apiValue: 'Die Einträge; jeder wird dem Template #item als impliziter Kontext übergeben — ohne Index.',
    apiNum: 'Einträge je Seite und Einträge je Schritt.',
    apiResponsive: 'Array aus breakpoint, numVisible, numScroll. Die Regel „Breakpoints nur in px“ steht unter Design.',
    apiOrientation: 'Vertikal braucht die feste Viewport-Höhe.',
    apiCircular: 'Läuft im Kreis, indem es Einträge an beiden Enden klont (siehe die Zeile zu den Klonen unten).',
    apiShow: 'Versteck keines von beiden: Die Navigatoren sind der einzige benannte Weg zum Blättern, die Indikatoren der einzige Überblick.',
    apiAutoplay:
      'Millisekunden; über null startet die Rotation beim ersten Rendern. Das Input später zu ändern, startet sie weder noch stoppt es sie.',
    apiButtonProps:
      'Wird an den inneren Button übergeben. Der einzige Weg, ihn zu benennen und seinen Typ zu setzen; ein Ersatzobjekt verwirft die Standardwerte.',
    apiPage: 'Zweiseitig über Input und Output; onPage feuert bei jedem Seitenwechsel, die automatischen eingeschlossen.',
    apiMethods:
      'Öffentlich. stopAutoplay(false) pausiert, ohne die Live-Region abzuschalten; stopAutoplay() stoppt. Sichere startAutoplay() mit isPlaying() ab.',
    apiTemplates: 'Dazu #previousicon und #nexticon für eigene Navigator-Icons.',
    a11yHost: 'Eine unbenannte Region wird nicht als Landmark angeboten. Setz aria-label auf p-carousel.',
    a11yLive:
      'Die APG-Regel ist umgekehrt — aus während der Rotation, polite ohne —, also hört ein Screenreader automatische Wechsel und verpasst manuelle.',
    a11yNav:
      'aria-label auf einem Custom Element ohne Rolle benennt nichts; der innere Icon-Button ist unbenannt. Nimm buttonProps.ariaLabel. Dem Zurück-Button fehlt außerdem type="button", und an den Enden bleiben beide aktiv und fokussierbar — nur eine Klasse p-disabled markiert sie.',
    a11ySlide:
      'Mit dem Standard-slideNumber wird die erste Folie als 0 angesagt. Die Galleria zählt für denselben Schlüssel ab 1.',
    a11yHidden:
      'Links und Buttons auf Folien außerhalb der Seite bleiben in der Tab-Reihenfolge, während sie vor Screenreadern versteckt sind. Halte Folieninhalt nicht interaktiv, oder mach versteckte Folien selbst inert.',
    a11yClones:
      'Mit circular werden die nachgestellten Kopien assistiven Technologien als doppelter Inhalt angeboten.',
    a11yDots:
      'Benannt aus pageLabel — „Seite 2“ im Kit, die bloße Zahl im Standard der Bibliothek. Pfeil nach links und rechts bewegen nur den Fokus; Enter oder Leertaste aktiviert. Pos1 und Ende tun nichts.',
    gNav: 'Werden als unbenannte Navigations-Landmarks angesagt, nicht als Buttons. Lass showItemNavigators aus; nimm Thumbnails.',
    gDots: 'Ein Tab-Stopp je Punkt, keine Rolle, aria-selected auf einem Listeneintrag; Enter und Leertaste aktivieren. Nimm lieber Thumbnails.',
    gThumbs:
      'Eine Tablist, deren Kinder keine Tabs sind; jedes Thumbnail wird aus pageLabel benannt („Seite 3“ im Kit), was nichts über das Bild sagt, also benenne das Bild im Eintrag.',
    gFull:
      'Der Dialog hat keinen Namen und keinen Handler für Esc, und der Fokus wird beim Schließen nicht zurückgegeben. Ergänze alle drei (Rezept unten).',
    gAuto:
      'Dieselbe Umkehrung wie beim Carousel. Binde [autoPlay] an dein eigenes Signal: Das Input ist live, also kann ein Stopp-Button es steuern.',

    checkWhether: 'Entscheide zuerst, ob der Inhalt überhaupt in ein Carousel gehört (Verwendung).',
    checkName: 'Benenne die Region des Carousels mit aria-label auf dem Host.',
    checkButtons:
      'Übergib prevButtonProps und nextButtonProps mit ariaLabel und type="button", und gib severity, text und rounded erneut an.',
    checkRotation:
      'Wenn es rotiert: ein sichtbarer Stopp/Start-Button davor, Stopp bei Fokus, Pause bei Hover, nie gestartet unter reduzierter Bewegung.',
    checkMotion: 'Halte autoplayInterval über null, wenn ein Button die Rotation später starten kann.',
    checkInteractive: 'Halte Folieninhalt frei von Links und Buttons, oder mach Folien außerhalb der Seite selbst inert.',
    checkGalleria:
      'Für p-galleria: Thumbnails an, Item-Navigatoren aus, ein Name auf jedem Bild; Vollbild nur mit eigenem Esc und eigener Fokusrückgabe.',

    // i18n
    i18nNav: 'Navigatoren des Carousels (auf dem Host, siehe Entwicklung) und Pfeile der Galleria-Thumbnails',
    i18nSlide: 'aria-roledescription jeder Folie, beide Komponenten',
    i18nSlideNumber: 'Name der Folie; das Carousel übergibt einen nullbasierten Index, die Galleria einen einsbasierten',
    i18nPage: 'Namen von Indikatoren und Thumbnails',
    i18nClose: 'Schließen-Button der Galleria im Vollbild',
    i18nRoledescription:
      'aria-roledescription („Slide“) hat kein Input je Instanz; das Kit übergibt es in der Seitensprache („Folie“ auf einer deutschen Seite), denn eine Roledescription, die nicht zur Seitensprache passt, ist schlimmer als keine — ein Screenreader spricht sie anstelle der Rolle. Behalte das bei, wenn du eine Sprache ergänzt.',
    i18nRtl:
      'Das Carousel bewegt seine Spur mit translate3d auf der x-Achse und liest nie die Schreibrichtung, also bleiben unter dir="rtl" die Chevrons und die Folienrichtung physisch von links nach rechts. Teste eine Seite von rechts nach links, bevor du es dort einsetzt.',
  };
}
