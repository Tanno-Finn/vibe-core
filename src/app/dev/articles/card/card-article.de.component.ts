import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { CardArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './card-article.component';

/**
 * German twin of the Card guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in the demo
 * fields are German. Keep it in step with the English file: same tabs, same element
 * and binding skeleton (`node scripts/check-guide-translations.mjs card`).
 */
@Component({
  selector: 'app-card-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'card'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Eine Card ist ein Kasten mit Schatten. Das ist die ganze Komponente: sechs
          <code>&lt;div&gt;</code>s, fünf Preset-Stilregeln, kein Zustand, keine Tastatur, keine Rolle. Alles, was eine
          Card <em>nützlich</em> macht — eine Überschrift, eine Begrenzung, eine Gruppierung, die ein Screenreader hören
          kann —, lieferst du selbst. Der Playground unten ist eine echte <code>p-card</code>; die Regler ändern, welche
          ihrer Slots es gibt.
        </p>

        <section class="pg" aria-label="Card-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Einstellen</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-variant-label">Slots</span>
                <p-select
                  [ariaLabelledBy]="'pg-variant-label'"
                  size="small"
                  [options]="variantOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgVariant()"
                  (ngModelChange)="pgVariant.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-sub">Subheader</label>
                <p-toggleswitch inputId="pg-sub" [ngModel]="pgSubtitle()" (ngModelChange)="pgSubtitle.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-clip">Auf den Radius beschneiden</label>
                <p-toggleswitch inputId="pg-clip" [ngModel]="pgClip()" (ngModelChange)="pgClip.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-border">Eine Kante geben</label>
                <p-toggleswitch inputId="pg-border" [ngModel]="pgBorder()" (ngModelChange)="pgBorder.set($event)" />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau — auf dem Seitengrund, nicht auf einem Panel</span>
              <div class="pg__stage">
                @switch (pgVariant()) {
                  @case ('plain') {
                    <p-card
                      [header]="pgTopic"
                      [subheader]="pgSub()"
                      [class.demo-clip]="pgClip()"
                      [class.demo-edge]="pgBorder()"
                    >
                      <p class="demo-p">{{ pgBody }}</p>
                    </p-card>
                  }
                  @case ('heading') {
                    <p-card [subheader]="pgSub()" [class.demo-clip]="pgClip()" [class.demo-edge]="pgBorder()">
                      <ng-template #title
                        ><h4 class="demo-h">{{ pgTopic }}</h4></ng-template
                      >
                      <p class="demo-p">{{ pgBody }}</p>
                    </p-card>
                  }
                  @case ('band') {
                    <p-card
                      [header]="pgTopic"
                      [subheader]="pgSub()"
                      [class.demo-clip]="pgClip()"
                      [class.demo-edge]="pgBorder()"
                    >
                      <ng-template #header>
                        <div class="demo-band"><span>2026</span><span>Methode</span></div>
                      </ng-template>
                      <p class="demo-p">{{ pgBody }}</p>
                    </p-card>
                  }
                  @default {
                    <p-card [subheader]="pgSub()" [class.demo-clip]="pgClip()" [class.demo-edge]="pgBorder()">
                      <ng-template #header>
                        <div class="demo-band"><span>2026</span><span>Methode</span></div>
                      </ng-template>
                      <ng-template #title
                        ><h4 class="demo-h">{{ pgTopic }}</h4></ng-template
                      >
                      <p class="demo-p">{{ pgBody }}</p>
                      <ng-template #footer>
                        <div class="demo-actions">
                          <p-button label="Lesen" size="small" />
                          <p-button label="Später" size="small" severity="secondary" [outlined]="true" />
                        </div>
                      </ng-template>
                    </p-card>
                  }
                }
              </div>
              <p class="ex__note">
                Mit beiden Stil-Schaltern aus ist das die Card, wie dieses Kit sie ausliefert: Der aktive visuelle Stil
                zeichnet ihre Kontur. In reinem Aura, ohne Stilblock, ist sie Weiß auf fast weißem Grund, zusammengehalten
                von einem 1px-Schatten. Jede Variante ist eine eigene
                <code>&lt;p-card&gt;</code> — warum die Slots nicht innerhalb einer Card umgeschaltet werden, zeigt die
                Verschachtelungs-Demo unten.
              </p>
            </div>
          </div>

          <div class="pg__code">
            <div class="ex__head">
              <span class="pg__code-label">Markup</span>
              <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
                {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
            <pre class="code-block code-block--inline"><code>{{ pgCode() }}</code></pre>
          </div>
        </section>

        <h3>Die Anatomie, gerendert</h3>
        <p class="ex__note">
          Sechs Kästen, in dieser Verschachtelung. Die drei, die das Theme tatsächlich stylt, sind markiert; die anderen
          drei sind nackte Container, die du selbst stylen sollst.
        </p>
        <div class="ex__stage ex__stage--anatomy">
          <p-card
            class="demo-anat demo-edge"
            [header]="'Titel (Input oder #title)'"
            [subheader]="'Untertitel (subheader oder #subtitle)'"
          >
            <ng-template #header><div class="demo-band">Header (#header) — ungestylt</div></ng-template>
            <p class="demo-p">Inhalt (Default-Projektion oder #content) — ungestylt</p>
            <ng-template #footer><div class="demo-band">Footer (#footer) — ungestylt</div></ng-template>
          </p-card>
        </div>
        <div class="table-wrap">
          <table>
            <caption class="sr-only">
              Teile der Card und was das Preset-Stylesheet ihnen gibt
            </caption>
            <thead>
              <tr>
                <th>Klasse</th>
                <th>Wo</th>
                <th>Mitgeliefertes Styling</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-card</code></td>
                <td>der <code>&lt;p-card&gt;</code>-Host selbst</td>
                <td>
                  Hintergrund, Farbe, Schatten, Radius — und <code>display: block</code>, weil die eigene angehängte
                  Regel des Bundles die <code>flex column</code> des Presets überschreibt
                </td>
              </tr>
              <tr>
                <td><code>p-card-header</code></td>
                <td>erstes Kind des Hosts</td>
                <td><strong>keines vom Preset</strong> — aber dieses Kit füllt ihn im Dark Mode</td>
              </tr>
              <tr>
                <td><code>p-card-body</code></td>
                <td>zweites Kind des Hosts</td>
                <td>Padding, <code>flex column</code>, Gap</td>
              </tr>
              <tr>
                <td><code>p-card-title</code></td>
                <td>im Body</td>
                <td>font-size, font-weight</td>
              </tr>
              <tr>
                <td><code>p-card-subtitle</code></td>
                <td>im Body</td>
                <td>nur Farbe (die font-size/font-weight-Tokens aus Aura 3.0 sind wieder weg)</td>
              </tr>
              <tr>
                <td><code>p-card-content</code></td>
                <td>im Body</td>
                <td><strong>keines</strong></td>
              </tr>
              <tr>
                <td><code>p-card-footer</code></td>
                <td>im Body</td>
                <td><strong>keines</strong></td>
              </tr>
              <tr>
                <td><code>p-card-caption</code></td>
                <td>—</td>
                <td>gestylt, aber <strong>nie gerendert</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Wo ein Slot-Template stehen darf</h3>
        <p class="ex__note">
          Drei Cards, gleich bis auf die Stelle, an der das <code>#footer</code>-Template deklariert ist. Die Queries
          sehen nur direkte Kinder, also finden nur die ersten beiden es — und die dritte meldet gar nichts.
        </p>
        <div class="ex__stage">
          <p-card class="demo-edge demo-nest" [header]="'Direktes Kind'">
            <p class="demo-p">Template direkt in der Card deklariert.</p>
            <ng-template #footer><div class="demo-band">Footer gerendert</div></ng-template>
          </p-card>

          <p-card class="demo-edge demo-nest" [header]="'In einem Control-Flow-Block'">
            <p class="demo-p">Template in einem Block deklariert, der beim Content-Init wahr ist.</p>
            @if (alwaysTrue) {
              <ng-template #footer><div class="demo-band">Footer gerendert</div></ng-template>
            }
          </p-card>

          <p-card class="demo-edge demo-nest" [header]="'In einem Wrapper-Element'">
            <p class="demo-p">Template ein Element tiefer deklariert.</p>
            <div>
              <ng-template #footer><div class="demo-band">Footer gerendert</div></ng-template>
            </div>
          </p-card>
        </div>
        <p class="src-note">
          Die dritte Card hat keinen Footer, und es gibt keinen Fehler, keine Warnung und keinen leeren Kasten, der
          auffallen würde — der Slot ist einfach nicht Teil des DOM. Ein Control-Flow-Block, dessen Bedingung beim
          Initialisieren des Contents wahr ist, wird noch aufgelöst; was er nicht tut: den Slot zurückbringen, wenn die
          Bedingung später kippt, denn die Card ist <code>OnPush</code>, und eine Query-Änderung allein markiert ihre
          View nicht als dirty. Deklarier Slot-Templates ohne Bedingung und setz die Bedingung in sie hinein.
        </p>

        <h3>Gleiche Höhen: was eine Reihe Cards ab Werk tut</h3>
        <p class="ex__note">
          Drei Cards in einer Grid-Reihe. Das Grid streckt die Cards; nichts streckt ihre Bodys — der Host ist
          <code>display: block</code>, und <code>.p-card-body</code> hat kein <code>flex: 1</code>. Leg den Schalter
          für den Fix um — und achte auf die drei „Öffnen“-Buttons, nicht auf die Card-Konturen: Den Body allein zu
          strecken bewegt nichts, weil ein höherer Flex-Container sein letztes Kind nicht verschiebt.
        </p>
        <div class="ex__head">
          <span class="pg__code-label">{{ stretchFix() ? 'Mit dem Fix' : 'Verhalten ab Werk' }}</span>
          <button type="button" class="copy-btn" (click)="toggleStretch()">
            {{ stretchFix() ? 'Verhalten ab Werk zeigen' : 'Fix anwenden' }}
          </button>
        </div>
        <div class="ex__stage">
          <div class="demo-grid" [class.demo-grid--fixed]="stretchFix()">
            @for (c of stretchCards; track c.id) {
              <p-card
                class="demo-edge"
                [class.demo-col]="stretchFix()"
                [pt]="stretchFix() ? stretchPt : undefined"
                [header]="c.title"
              >
                <p class="demo-p">{{ c.body }}</p>
                <ng-template #footer>
                  <div class="demo-actions"><p-button label="Öffnen" size="small" /></div>
                </ng-template>
              </p-card>
            }
          </div>
        </div>
        <pre class="code-block"><code>{{ stretchSnippet }}</code></pre>

        <h3>Eine Card, die ein Link ist</h3>
        <p class="ex__note">
          Eine Card ist nicht fokussierbar und hat keine Rolle, also ist ein Click-Handler auf dem Host für die Tastatur
          unsichtbar. Setz den echten Link auf die Überschrift und lass ein Pseudo-Element ihn über die Card wachsen:
          ein Tab-Stopp, ein angesagter Name, der ganze Kasten klickbar.
        </p>
        <div class="ex__stage">
          <p-card class="demo-edge demo-linkcard">
            <ng-template #title>
              <h4 class="demo-h">
                <a class="demo-link" href="https://www.w3.org/WAI/ARIA/apg/" rel="noopener noreferrer"
                  >ARIA Authoring Practices</a
                >
              </h4>
            </ng-template>
            <p class="demo-p">
              Die Patterns, an denen sich dieses Kit selbst prüft. Die ganze Card ist die Trefferfläche; der Tab-Stopp
              und der zugängliche Name gehören dem Link.
            </p>
          </p-card>
        </div>
        <pre class="code-block"><code>{{ linkCardSnippet }}</code></pre>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welcher Container</h3>
        <p>
          „Card“ ist ein visuelles Wort, kein semantisches. Bevor du zu
          <code>p-card</code> greifst, entscheide, was der Kasten <em>ist</em>: eine betitelte Region, eine Gruppe von
          Formularfeldern, ein Abschnitt des Dokuments oder nur eine Fläche mit Schatten. Nur das Letzte ist eine Card.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Du willst</th>
                <th>Greif zu</th>
                <th>Weil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Eine Fläche mit Schatten um ansonsten in sich geschlossenen Inhalt</td>
                <td><code>p-card</code></td>
                <td>Sie ist genau das und nichts weiter — keine Rolle, keine Header-Semantik, kein Zustand.</td>
              </tr>
              <tr>
                <td>Eine betitelte Region, optional einklappbar</td>
                <td><code>p-panel</code></td>
                <td>
                  Sein Content-Wrapper trägt <code>role="region"</code> und <code>aria-labelledby</code> mit Verweis auf
                  den Header, und der Umschalter ist ein echter Button mit <code>aria-expanded</code>/<code>aria-controls</code>
                  (<code>openng-optimus-ui-panel.mjs:395-396</code>, <code>:364-365</code>).
                </td>
              </tr>
              <tr>
                <td>Eine Gruppe von Formular-Controls unter einem Label</td>
                <td><code>p-fieldset</code></td>
                <td>
                  Es rendert ein natives <code>&lt;fieldset&gt;</code> mit einer
                  <code>&lt;legend&gt;</code> (<code>openng-optimus-ui-fieldset.mjs:270-271</code>) — die Gruppierung,
                  die Browser und assistive Technik schon verstehen.
                </td>
              </tr>
              <tr>
                <td>Ein Abschnitt in der eigenen Dokumentgliederung der Seite</td>
                <td><code>&lt;section&gt;</code>/<code>&lt;article&gt;</code> + eine Überschrift</td>
                <td>
                  Überschriften sind das, womit Leser navigieren. Eine Card um eine Überschrift fügt einen Kasten hinzu;
                  eine Card <em>statt</em> einer Überschrift entfernt die Gliederung.
                </td>
              </tr>
              <tr>
                <td>Ein betitelter Inhaltsblock in einer Portalseite</td>
                <td><code>app-standard-container</code></td>
                <td>
                  Der eigene Container des Kits: eine typisierte Variante (primary, warning, definition, …), ein Icon, ein
                  i18n-Titel-Key, ein explizites <code>headingLevel</code>, das eine echte
                  <code>&lt;h1&gt;</code>–<code>&lt;h6&gt;</code> ausgibt, und ein einklappbarer Modus mit
                  <code>aria-expanded</code>.
                </td>
              </tr>
              <tr>
                <td>Langer Fließtext mit Lese-Metadaten</td>
                <td><code>app-text-container</code></td>
                <td>Auf demselben Container gebaut, ergänzt Lesezeit, Wortzahl und eine Fortschrittsanzeige.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Kit-Konvention: Inhaltsblöcke auf Seitenebene laufen über den Kit-Container, dem die Überschriftenebene und der
          übersetzte Titel gehören. <code>p-card</code> ist für wiederholte, kleine, in sich geschlossene Elemente — eine
          Zeile in einer Liste von Veranstaltungen, eine Fehlerbox, eine Kachel in einem Grid —, bei denen die umgebende
          Seite die Gliederung schon liefert.
        </p>

        <h3>Wann p-card die falsche Wahl ist</h3>
        <ul>
          <li>
            <strong>Der Kasten braucht einen Namen im Accessibility Tree.</strong> Nichts in <code>p-card</code> erzeugt
            einen. Wenn die Antwort „<code>role</code> und <code>aria-label</code> über <code>pt</code> ergänzen“ lautet,
            hast du <code>p-panel</code> von Hand nachgebaut — nimm es.
          </li>
          <li>
            <strong>Der Kasten klappt ein.</strong> Kein <code>collapsed</code>, kein Umschalter, keine Animation.
            <code>p-panel</code> und <code>p-fieldset</code> bringen beide eines mit.
          </li>
          <li>
            <strong>Der ganze Kasten ist das Bedienelement.</strong> Eine Card ist nicht fokussierbar und sendet keine
            Events. Setz entweder einen echten Link oder Button hinein oder nimm <code>p-button</code>.
          </li>
          <li>
            <strong>Du wolltest nur Padding und einen Rahmen.</strong> Eine <code>&lt;section&gt;</code> mit zwei
            Kit-Tokens ist billiger als eine Komponente, und sie kann eine Überschrift tragen.
          </li>
          <li>
            <strong>Die Card ist der Hauptinhalt der Seite.</strong> Eine Card um eine ganze Route fügt einen Schatten
            hinzu und verbirgt nichts; die Semantik gehört auf <code>&lt;main&gt;</code>.
          </li>
        </ul>

        <h3>Do / Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <div class="dd__stage">
              <p-card class="demo-edge" [header]="'Vektordatenbanken'">
                <p class="demo-p">Achtzehn-Pixel-Schrift in Gewicht 500, und keine Überschrift.</p>
              </p-card>
            </div>
            <p class="dd__why">
              <code>[header]</code> rendert ein <code>&lt;div class="p-card-title"&gt;</code>. Es sieht mit 18px/500 wie
              eine Überschrift aus und ist für eine Überschriftenliste unsichtbar, also wird ein Card-Grid zu einer Wand
              aus Text, durch die man nicht navigieren kann.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p-card class="demo-edge">
                <ng-template #title><h4 class="demo-h">Vektordatenbanken</h4></ng-template>
                <p class="demo-p">Dieselben Pixel, und sie steht in der Gliederung.</p>
              </p-card>
            </div>
            <p class="dd__why">
              <code>#title</code> projiziert in denselben gestylten Kasten, also behältst du das Aussehen und wählst die
              Ebene. Eine Überschrift pro Card, auf der Ebene, die die umgebende Seite vorgibt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <div class="dd__stage">
              <p-card class="demo-edge demo-band-fill">
                <ng-template #header><div class="demo-band demo-band--solid">Gefüllter Header</div></ng-template>
                <p class="demo-p">Die Ecken verraten es.</p>
              </p-card>
            </div>
            <p class="dd__why">
              Der Host behält <code>overflow: visible</code>, und der Header hat keinen eigenen Radius, also malt ein
              gefüllter Header eckige Ecken über die runden der Card (sichtbar in einem Stil mit Radius; der von werkbund
              ist 0).
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p-card class="demo-edge demo-clip demo-band-fill">
                <ng-template #header><div class="demo-band demo-band--solid">Gefüllter Header</div></ng-template>
                <p class="demo-p">Vom Host beschnitten.</p>
              </p-card>
            </div>
            <p class="dd__why">
              <code>overflow: hidden</code> auf dem Host beschneidet jeden Slot auf den Radius. Das ist die eine Zeile, die
              jede Card mit gefülltem Header in diesem Kit trägt.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t</span>
            <div class="dd__stage">
              <p class="dd__why">
                <code>&lt;p-card (click)="open(item)"&gt;</code> — kein Tab-Stopp, keine Rolle, kein Key-Handler. Eine
                Card nur für die Maus.
              </p>
            </div>
            <p class="dd__why">
              Wer <code>tabindex</code> und <code>role="button"</code> über <code>pt</code> ergänzt, schuldet danach
              Enter- <em>und</em> Leertasten-Behandlung und verschluckt jeden Link darin.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do</span>
            <div class="dd__stage">
              <p class="dd__why">
                Ein echtes <code>&lt;a&gt;</code> im Titel, per Pseudo-Element über die Card gestreckt. Ein Tab-Stopp,
                der Linktext als Name.
              </p>
            </div>
            <p class="dd__why">
              Die gerenderte Fassung steht unter Beispiele. Halte andere interaktive Elemente aus einer Card mit
              gestrecktem Link heraus oder heb sie über das Overlay.
            </p>
          </div>
        </div>

        <h3>Kommentierter Quelltext</h3>
        <p class="ex__note">Die Playground-Card, mit jeder Entscheidung darin benannt.</p>
        <pre class="code-block"><code>{{ annotatedSource }}</code></pre>

        <h3>Quellen</h3>
        <ul>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#region" target="_blank" rel="noopener noreferrer"
              >WAI-ARIA 1.2 — <code>region</code></a
            >
            — was <code>p-panel</code> bereitstellt und <code>p-card</code> nicht: eine benannte Landmark.
          </li>
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element"
              target="_blank"
              rel="noopener noreferrer"
              >HTML — the <code>fieldset</code> element</a
            >
            — die native Gruppierung, die <code>p-fieldset</code> rendert, und der Grund, warum eine Card der falsche
            Kasten für Bedienelemente ist.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
              target="_blank"
              rel="noopener noreferrer"
              >WCAG 2.2 — SC 1.4.11 Non-text Contrast</a
            >
            — warum eine Card-Kante keine UI-Komponente ist und eine blasse Kante darum zulässig, aber keine Begrenzung
            ist.
          </li>
          <li>
            <a href="https://optimus.openng.org/card/" target="_blank" rel="noopener noreferrer">Optimus UI — Card</a>
            — die API des Herstellers; jede Aussage hier ist gegen den ausgelieferten Quelltext von 2.0.2 geprüft.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Alles, was eine Card stylt</h3>
        <p>
          In einer laufenden App tragen neun Regeln <code>p-card</code> im Selektor, aus drei Quellen:
          <strong>fünf</strong> aus dem Preset-Stylesheet, <strong>eine</strong>, die das Angular-Paket darüber anhängt,
          und <strong>drei</strong> aus der eigenen <code>styles.scss</code> dieses Kits — zwei für das dunkle Theme und
          die Konturregel des aktiven visuellen Stils (<code>html.style-&lt;name&gt; .p-card</code>). PrimeNG 22 hatte
          die angehängte Regel gestrichen; Optimus liefert sie wieder aus.
        </p>
        <pre class="code-block"><code>{{ shippedCss }}</code></pre>
        <ul>
          <li>
            <strong>Der Host ist <code>display: block</code>.</strong> Die <code>.p-card</code>-Regel des Presets endet
            mit <code>display: flex; flex-direction: column</code>, aber das Komponenten-Bundle hängt seine eigene
            <code>.p-card &#123; display: block &#125;</code> dahinter — gleiche Spezifität, später, also gewinnt block.
            Reihen mit gleicher Höhe brauchen darum drei Regeln, eine davon für den Host (siehe Beispiele).
          </li>
          <li>
            <strong>Das Preset stylt weder Header noch Footer.</strong> Seine fünf Regeln decken nur Root, Caption, Body,
            Titel und Untertitel ab: <code>.p-card-header</code> und <code>.p-card-footer</code> bekommen vom Theme kein
            Padding, keinen Trenner und keinen Hintergrund. Der Footer erbt wenigstens den 0.5rem-Gap des Bodys, weil er
            dessen Flex-Kind ist; der Header sitzt außerhalb des Bodys und bekommt nichts.
            <em>Im dunklen Theme dieses Kits ist der Header die Ausnahme</em> — siehe den nächsten Abschnitt.
          </li>
          <li>
            <strong><code>.p-card-caption</code> ist gestylt, wird aber nie gerendert</strong> — siehe Entwicklung. Das
            Token <code>card.caption.gap</code> hat keinen Leser.
          </li>
        </ul>

        <h3>Token-Kette</h3>
        <p>
          Aura bildet die Farb-Tokens der Card auf seine eigene semantische Ebene ab; nichts hier ist eine rohe Farbe außer
          dem Schatten. Die Werte sind Auras Standardpalette (slate hell, zinc dunkel), die kein visueller Stil
          überschreibt — aber in diesem Kit werden die dunklen Farben, der Radius, der Rahmen und der Schatten durch die
          Kit-Regeln unten ersetzt.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Aura-Quelle</th>
                <th>Hell</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>card.background</code></td>
                <td><code>&#123;content.background&#125;</code></td>
                <td><code>#ffffff</code></td>
                <td><code>#18181b</code></td>
              </tr>
              <tr>
                <td><code>card.color</code></td>
                <td><code>&#123;content.color&#125;</code></td>
                <td><code>#334155</code></td>
                <td><code>#ffffff</code></td>
              </tr>
              <tr>
                <td><code>card.borderRadius</code></td>
                <td><code>&#123;border.radius.xl&#125;</code></td>
                <td colspan="2"><code>12px</code> in reinem Aura; jeder visuelle Stil ersetzt ihn (siehe Geometrie)</td>
              </tr>
              <tr>
                <td><code>card.shadow</code></td>
                <td>Literal</td>
                <td colspan="2"><code>0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)</code></td>
              </tr>
              <tr>
                <td><code>card.body.padding</code></td>
                <td>Literal</td>
                <td colspan="2"><code>1.25rem</code> → 20px (Aura 3.0 hatte 1.125rem)</td>
              </tr>
              <tr>
                <td><code>card.body.gap</code></td>
                <td>Literal</td>
                <td colspan="2"><code>0.5rem</code> → 8px</td>
              </tr>
              <tr>
                <td><code>card.title.fontSize</code> / <code>fontWeight</code></td>
                <td>Literal</td>
                <td colspan="2"><code>1.25rem</code> → 20px / <code>500</code> (Aura 3.0 hatte 1.125rem)</td>
              </tr>
              <tr>
                <td><code>card.subtitle.color</code></td>
                <td><code>&#123;text.muted.color&#125;</code></td>
                <td><code>#64748b</code></td>
                <td><code>#a1a1aa</code></td>
              </tr>
              <tr>
                <td><code>card.subtitle.fontSize</code> / <code>fontWeight</code></td>
                <td>—</td>
                <td colspan="2"><strong>nicht ausgeliefert</strong> in Aura 2.x — der Untertitel erbt 16px / normal</td>
              </tr>
              <tr>
                <td><code>card.caption.gap</code></td>
                <td>Literal</td>
                <td colspan="2"><code>0.5rem</code> — <strong>unerreichbar</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Definitionen: <code>&#64;openng/optimus-ui-themes/dist/aura/card/index.mjs</code>; Werte über die
          Aura-Basispalette in beiden Farbschemata aufgelöst.
        </p>

        <h3>Das dunkle Theme ist nicht das von Aura</h3>
        <p>
          Dieses Kit überschreibt die Farben der Card im Dark Mode mit <code>!important</code>
          (<code>styles.scss</code>), also erreichen die dunklen Card-Farben von Aura die Seite nie: Der Hintergrund ist
          <code>--surface-card</code> des aktiven visuellen Stils (werkbund <code>#1d1d21</code>), nicht das
          <code>#18181b</code> des Tokens; die Farbe ist <code>--text-color</code> des Stils, nicht <code>#ffffff</code>.
          Der dunkle Schatten <code>0 2px 8px rgba(0, 0, 0, 0.3)</code> ist nur ein Default, ohne
          <code>!important</code>: Er schlägt Auras zweilagigen Token-Schatten, weicht aber der eigenen Schatten-Signatur
          jedes visuellen Stils (nächster Abschnitt). Der Untertitel wird <em>nicht</em> überschrieben, behält also das
          Aura-Token und landet auf einem anderen Hintergrund, als Aura angenommen hat.
        </p>
        <p>
          Die zweite Kit-Regel ist die, die die Faustregel „das Theme stylt keinen Header“ bricht: Im Dark Mode wird
          <code>.p-card-header</code> mit <code>--surface-section</code> des Stils gefüllt, gegenüber einem transparenten
          Header im Light Mode. Sie setzt außerdem
          <code>border-bottom-color</code>, was nichts bewirkt, bis du selbst eine Rahmenbreite lieferst. Ein Header, den
          du im Light Mode als transparentes Band entworfen hast, kommt im Dark Mode also als gefülltes Band an, ob du
          eines wolltest oder nicht.
        </p>
        <p class="src-note">
          Folge für alle, die umstylen: <code>card.background</code> im Preset zu ändern bewegt nur das helle Theme. Das
          dunkle Theme bewegt sich, wenn sich die Surface-Tokens des Kits bewegen (<code>ui-styles.ts</code>, pro Stil).
        </p>

        <h3>Der visuelle Stil umrandet jede Card</h3>
        <p>
          Jeder <code>html.style-&lt;name&gt;</code>-Block in <code>styles.scss</code> gibt <code>.p-card</code> einen
          <code>--style-outline</code>-Rahmen und eigenen Radius und Schatten: werkbund 3px hell / 2px dunkel, Radius 0,
          kein Schatten; lernwerkstatt 2px mit einem um 3px versetzten Schatten, Radius 16px; skizzenbuch 1.5px, ein
          Papierschatten und ein handgezeichneter Radius; blaupause 1px, Radius 2px, kein Schatten. Die Signatur hält
          auch im Dark Mode — der dunkle Kit-Schatten oben ist nur der Fallback, den ein Stil ohne eigenen bekäme. In
          diesem Kit hat eine Card also immer eine gezeichnete Kante — außerhalb davon (reines Aura) hat sie nur den
          Schatten.
        </p>

        <h3>Kontrast zur Fläche dahinter</h3>
        <p>
          Eine Card sitzt auf dem Seitengrund, der in jedem visuellen Stil nur eine Nuance neben der Card-Fläche liegt —
          die Flächen allein sind keine Begrenzung. Was die Card abgrenzt, ist die Kontur des Stils, deren Kontrast weit
          streut.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Paar</th>
                <th>Hell</th>
                <th>Dunkel</th>
                <th>Lesart</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Card-Fläche gegen den Seitengrund</td>
                <td><strong>1,02:1 bis 1,09:1</strong></td>
                <td><strong>1,09:1 bis 1,13:1</strong></td>
                <td>
                  In keinem Stil eine Begrenzung durch die Flächen. Kein SC-Verstoß — eine Card-Kante ist keine
                  UI-Komponente.
                </td>
              </tr>
              <tr>
                <td>die Kontur des Stils (<code>--style-outline</code>) gegen den Seitengrund (per Gate geprüft)</td>
                <td>3,85:1 bis 17,17:1</td>
                <td>4,32:1 bis 16,28:1</td>
                <td>
                  Die gezeichnete Kante, mindestens 3:1 in jedem Stil und Modus. Am niedrigsten hell und dunkel:
                  blaupause (3,85:1, 4,32:1); die dunkle Kontur von lernwerkstatt ist <code>#969491</code>, 5,5:1 auf
                  ihrem Grund.
                </td>
              </tr>
              <tr>
                <td>die Card-Farbe auf dem Card-Hintergrund — was Titel und Fließtext erben</td>
                <td>10,35:1</td>
                <td>14,86:1 (werkbund)</td>
                <td>
                  Hell ist Auras <code>card.color</code> auf Weiß, in jedem Stil gleich. Dunkel ist
                  <code>--text-color</code> des Kits auf <code>--surface-card</code> — die Zeile <em>body text</em> in
                  <code>docs/generated/CONTRAST.MD</code>, pro Stil. Text, den du selbst umfärbst, landet woanders.
                </td>
              </tr>
              <tr>
                <td>Untertitel auf der Card</td>
                <td>4,76:1</td>
                <td>5,12:1 bis 6,56:1</td>
                <td>
                  Auras <code>&#123;text.muted.color&#125;</code> auf der Card: besteht AA für normalen Text mit 0,26 Reserve
                  im Light Mode. Verkleinere ihn nicht: Bei 16px gibt es keinen Spielraum. Dunkel am niedrigsten auf der
                  blaupause-Card.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Per Gate geprüft in <code>docs/generated/CONTRAST.MD</code>: die Kontur („panel outline“,
          <code>--style-outline</code> auf <code>--surface-ground</code> und <code>--surface-card</code>) und der dunkle
          Fließtext („body text“). Die Werte des Untertitels entsprechen den geprüften Zeilen
          <code>paginator.nav.button.color</code> (dasselbe <code>&#123;text.muted.color&#125;</code> auf der Card). Die
          Zahlen für Fläche gegen Grund und für den hellen Fließtext sind aus den Card- und Text-Tokens von Aura und den
          Flächen je Stil in <code>ui-styles.ts</code> zusammengerechnet.
        </p>
        <p>
          <strong>Folge fürs Design.</strong> In diesem Kit zeichnet der Stil die Kante; außerhalb davon braucht eine
          Card, die als eigenes Objekt lesbar sein muss — eine Kachel in einem Grid, eine Zeile in einer Liste —, eine
          eigene Kante (<code>1px solid</code> mit einem Rahmen-Token) oder eine Section-Fläche statt des Grunds. Der
          mitgelieferte Schatten allein verschwindet auf blassem Grund, im Druck und unter Forced Colors.
        </p>

        <h3>Geometrie</h3>
        <ul>
          <li>
            Radius vom aktiven visuellen Stil — werkbund 0, lernwerkstatt 16px, skizzenbuch handgezeichnet, blaupause
            2px (reines Aura: 12px, <code>&#123;border.radius.xl&#125;</code>). Kein Slot hat einen eigenen Radius, und
            der Host beschneidet nicht: Ein gefüllter Header oder Footer braucht <code>overflow: hidden</code> auf dem
            Host.
          </li>
          <li>
            Body-Padding <strong>20px</strong> auf allen vier Seiten (wieder Aura 2.x; Aura 3.0 hatte 18px); Gap zwischen
            Titel, Untertitel, Inhalt und Footer <strong>8px</strong>. Der Header liegt außerhalb des Bodys und bekommt
            keins von beiden.
          </li>
          <li>
            Titel <strong>20px / 500</strong> (Aura 3.0 hatte ihn auf 18px geschrumpft). Das ist die Größe einer
            <code>&lt;h2&gt;</code> und schwerer als Fließtext — eine bewusste Größe „sieht aus wie eine Überschrift“,
            und genau deshalb muss er auch eine <em>sein</em>.
          </li>
          <li>
            Kein Rahmen vom Preset (der Rahmen des Kits kommt aus dem Stilblock), keine min-height, keine max-width.
            <strong>Auf einem schmalen Bildschirm</strong> tut die Card nichts von sich aus: Ihre Breite kommt ganz vom
            Elternelement, also ist eine Card im normalen Fluss so breit wie die Seite, und ihr Inhalt bricht um. Eine
            Reihe Cards bricht nur um, wenn das Grid um sie herum es tut — gib dem Grid einen
            <code>auto-fill</code>/<code>minmax()</code>-Track oder einen Breakpoint.
          </li>
        </ul>

        <h3>Bewegung und Forced Colors</h3>
        <p>
          Die Card bringt keine Transition und keine Animation mit, also hat
          <code>prefers-reduced-motion</code> nichts zu unterdrücken. Eine Hover-Anhebung, falls du sie ergänzt, musst
          du selbst absichern. Unter Forced Colors entfernt die Plattform den Schatten, und eine Card ohne Rahmen wird
          unsichtbar; die Stil-Kontur des Kits überlebt als Rahmen in Systemfarbe.
        </p>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird nicht
          beansprucht.
          <strong>Erfüllt:</strong> SC 1.4.3 für den Text, den die Card liefert — Titel und Fließtext messen 10,35:1 hell
          und im Dark Mode das Fließtext-Verhältnis des Stils auf <code>--surface-card</code> (14,86:1 in werkbund), der
          Untertitel 4,76:1 hell / 5,12:1 oder mehr dunkel — AA bei 16px mit 0,26 Reserve im Light Mode. <strong>Nicht erfüllt:</strong> keines der gemessenen Kriterien —
          die Card-Fläche gegen den Grund dahinter liegt bei 1,02:1 bis 1,13:1, was gar keine Begrenzung ist, aber kein
          Fall für SC 1.4.11, weil eine Card-Kante keine UI-Komponente ist; die Kante liefert die Stil-Kontur. <strong>Bedingt:</strong> SC 1.3.1 — das
          Input <code>header</code> rendert ein <code>&lt;div&gt;</code> in 20px / 500, das wie eine Überschrift aussieht
          und für eine Überschriftenliste unsichtbar ist; eine echte Überschrift muss aus dem <code>#title</code>-Template
          kommen. Darüber hinaus steuert die Card keine eigene Rolle, keinen Namen, keinen Fokus und keine Tastatur bei,
          also hat hier kein weiteres Kriterium etwas zu messen. <strong>AAA</strong> wird für diese Komponente nicht
          bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs — alle vier</h3>
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
                <td><code>header</code></td>
                <td><em>undefined</em></td>
                <td>
                  String, ein schlichtes <code>&#64;Input()</code>. Rendert in <code>.p-card-title</code>,
                  <strong>nicht</strong> in <code>.p-card-header</code> (<code>openng-optimus-ui-card.mjs:207</code>).
                  Wird ignoriert, wenn ein <code>#title</code>-Template vorhanden ist.
                </td>
              </tr>
              <tr>
                <td><code>subheader</code></td>
                <td><em>undefined</em></td>
                <td>
                  String, schlichtes <code>&#64;Input()</code>, in <code>.p-card-subtitle</code>; dieselbe
                  Vorrangregel (<code>:215</code>).
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Zurück in Optimus:</strong> <code>style</code> (ein Setter, der jeden Key auf das Host-Element
                  schreibt, <code>:113-128</code>) und <code>styleClass</code> (<code>&#64;deprecated since v20.0.0</code>,
                  eingemischt vom Host-Binding <code>cn(cx('root'), styleClass)</code>, <code>:198</code>). PrimeNG 22 hatte
                  beide entfernt. Style den Host trotzdem mit schlichtem <code>class</code>/<code>[class]</code>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Es gibt keine Outputs, keinen Service und keine exportierten Methoden außer
          <code>getBlockableElement()</code> (<code>openng-optimus-ui-card.mjs:169</code>), die für
          <code>p-blockUI</code> existiert.
        </p>

        <h3>Die Wege, einen Slot zu füllen, und wie jeder still ausfällt</h3>
        <p>
          Die fünf Slots — <code>header</code>, <code>title</code>, <code>subtitle</code>, <code>content</code>,
          <code>footer</code> — nehmen ein Template über zwei Mechanismen an. (Der dritte, <code>pTemplate</code>, ist
          <strong>zurück</strong>: Eine <code>ContentChildren(PrimeTemplate)</code>-Query (<code>:315-318</code>) speist
          einen Switch in <code>onAfterContentInit</code> (<code>:173-196</code>), also funktioniert Code aus der Zeit
          von 21 mit <code>pTemplate="footer"</code> wieder. PrimeNG 22 hatte ihn entfernt.)
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Weg</th>
                <th>Braucht</th>
                <th>Fällt aus durch</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;ng-template #footer&gt;</code></td>
                <td>Nichts außer dem Import der Komponente — es ist eine schlichte Template-Referenz.</td>
                <td>
                  Einwickeln. Die Query ist <code>&#123; descendants: false &#125;</code>
                  (<code>openng-optimus-ui-card.mjs:300-315</code>), also muss das Template ein
                  <em>direktes</em> Kind von <code>&lt;p-card&gt;</code> sein: Ein <code>&lt;div&gt;</code> tiefer, und der
                  Slot rendert still nicht. Ein Control-Flow-Block ist kein Wrapper-Element — er wird aufgelöst, wenn er
                  beim Content-Init wahr ist —, aber ihn später umzuschalten bringt den Slot nicht zurück.
                </td>
              </tr>
              <tr>
                <td><code>&lt;p-footer&gt;</code> / <code>&lt;p-header&gt;</code></td>
                <td>
                  <code>SharedModule</code> (oder <code>CardModule</code>, das es exportiert); das sind nicht-standalone
                  Komponenten (<code>openng-optimus-ui-api.mjs:709</code>/<code>:722</code>).
                </td>
                <td>
                  Fehlenden Import — aber <em>nicht</em> Einwickeln. Die Facet-Queries sind nackte
                  <code>ContentChild(Header|Footer)</code>, also <code>descendants: true</code>
                  (<code>openng-optimus-ui-card.mjs:294-299</code>), daher <em>wird</em> ein verschachteltes
                  <code>&lt;p-header&gt;</code> gefunden — und rendert einen <em>leeren</em> <code>.p-card-header</code>-Kasten,
                  weil das <code>ng-content select="p-header"</code> daneben nur direkte Kinder projiziert. PrimeNG 22
                  hatte diesen halben Ausfall beseitigt; Optimus hat ihn wieder. Ohne den Import ist das Element wirkungslos,
                  und Angular meldet nichts.
                  Altlast-Weg; nimm lieber die Template-Referenzen.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Wenn ein Footer nicht erscheint, prüf zuerst, ob ein Wrapper-Element um das
          <code>ng-template</code> liegt, dann das <code>imports</code>-Array.
        </p>

        <h3>Pass-Through-Ziele</h3>
        <p>
          <code>pt</code> erreicht sechs der acht Klassennamen. Der Host nimmt sowohl <code>host</code> als auch
          <code>root</code>, zusammengeführt und geschrieben aus
          <code>onAfterViewChecked</code> (<code>openng-optimus-ui-card.mjs:96</code>) — so ergänzt du eine Rolle oder
          ein Label:
        </p>
        <pre class="code-block"><code>{{ ptSnippet }}</code></pre>
        <ul>
          <li>
            Erreichbar: <code>root</code>/<code>host</code> (beide auf <code>&lt;p-card&gt;</code>), <code>header</code>,
            <code>body</code>, <code>title</code>, <code>subtitle</code>, <code>content</code>, <code>footer</code>.
          </li>
          <li>
            <strong>Unerreichbar: <code>caption</code>.</strong> Die Klasse steht in der Map
            (<code>openng-optimus-ui-card.mjs:25</code>), und das Preset stylt sie, aber das Template
            (<code>:198-233</code>) rendert das Element nie — Titel und Untertitel sind direkte Kinder
            des Bodys. Ein Eintrag <code>pt.caption</code> bleibt wirkungslos.
          </li>
          <li>
            Weil <code>setAttrs</code> nach den View-Checks läuft, landen über <code>pt.root</code> geschriebene Attribute
            nach jedem Attribut, das beim Erzeugen auf den Host kommt. Das eigene Template der Card setzt keines, also
            gibt es nichts, womit sie kollidieren könnten.
          </li>
        </ul>

        <h3>Layout: Die Card streckt ihren eigenen Body nicht</h3>
        <p>
          In einer Grid- oder Flex-Reihe streckt sich der Host, aber <code>.p-card-body</code> behält die Höhe seines
          Inhalts, also stehen die Footer in einer Reihe Cards nicht auf einer Linie. Drei Regeln beheben das (der Host
          ist <code>display: block</code>), und sie gehören in die Seite, nicht in eine Wrapper-Komponente — die letzte
          ist die, die man weglässt, weil ein wachsender Flex-Container sein letztes Kind nicht verschiebt:
        </p>
        <pre class="code-block"><code>{{ stretchSnippet }}</code></pre>
        <p class="src-note">
          Gemessen an der Reihe aus drei Cards unter Beispiele: Mit den
          mitgelieferten Regeln saßen die Footer der beiden kürzeren Cards
          <strong>91.2px</strong> über dem der hohen Card, in beiden Themes. Den Body allein zu strecken änderte daran
          nichts — das letzte Kind des Bodys bleibt, wo es war. Mit der Footer-Regel teilen sich die drei Footer eine
          Grundlinie. Die Zahl ist eine Eigenschaft dieses Inhalts; der Versatz ist eine Eigenschaft der Komponente —
          weder das Preset noch das Bundle gibt <code>.p-card-body</code> ein <code>flex: 1</code>.
        </p>

        <h3>SSR</h3>
        <p>
          Die Card fasst keine Browser-API an: kein <code>window</code>, kein <code>document</code>, keine Timer, keine
          <code>ViewChild</code>-Messung. Sie wird ohne Plattform-Guard vorgerendert und hydriert. Für alles, was du
          hineinprojizierst, gilt die übliche Kit-Regel.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>
            ☐ Genau eine echte Überschrift pro Card, auf der Ebene, die die umgebende Seite vorgibt — über
            <code>#title</code>, nicht <code>[header]</code>.
          </li>
          <li>
            ☐ Die Card ist nicht das Einzige, was ihren Inhalt gruppiert: Eine Liste von Cards ist ein
            <code>&lt;ul&gt;</code>/<code>&lt;li&gt;</code>, oder jede Card trägt <code>role="group"</code> und einen
            Namen über <code>pt.root</code>. Keine Landmark — eine Seite voller Landmarks ist eine Seite ohne.
          </li>
          <li>
            ☐ Kein Click-Handler, kein <code>tabindex</code> und kein <code>role="button"</code> auf dem Host;
            Interaktion lebt in einem echten Link oder Button darin.
          </li>
          <li>
            ☐ Die Card hat eine sichtbare Kante — einen Rahmen oder eine abgesetzte Fläche —, wo immer ihre Begrenzung
            Bedeutung trägt.
          </li>
          <li>☐ <code>overflow: hidden</code> auf dem Host, wenn irgendein Slot einen Hintergrund hat.</li>
          <li>☐ Footer-Aktionen in <code>#footer</code>, nicht an den Inhalt angehängt, damit der Body-Gap greift.</li>
          <li>☐ Cards in einer gestreckten Reihe tragen beide Body-Stretch-Regeln, oder keine von ihnen hat einen Footer.</li>
          <li>☐ <code>class</code>, nie <code>styleClass</code> (zurück in Optimus, aber deprecated).</li>
          <li>
            ☐ Prüf im Accessibility Tree des Browsers: Die Card steuert keine Rolle und keinen Namen bei — was die Region
            benennt, muss aus deinem eigenen Markup kommen.
          </li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Jeder String in einer Card gehört dir</h3>
        <p>
          <code>p-card</code> liest nichts aus der Übersetzungskonfiguration von Optimus — es gibt keinen
          <code>aria</code>-Key, kein Default-Label, nichts, was die Bibliothek ausfüllen würde. Zwei Inputs nehmen Text,
          <code>header</code> und <code>subheader</code>, und beide kommen aus deinem Katalog. Binde sie über ein
          <code>computed()</code> über den <code>TranslationService</code> des Kits, damit ein Sprachwechsel sie neu
          rendert; ein schlichtes Feld wird einmal erfasst und veraltet.
        </p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Die Länge ist das ganze i18n-Risiko</h3>
        <p>
          Eine Card hat kein Abschneiden, kein <code>text-overflow</code> und keine Mindesthöhe. Sie wächst mit ihrem
          Text, was der richtige Default ist — und der Grund, warum ein in einer Sprache abgestimmtes Card-Grid in einer
          anderen bricht. Deutsch läuft 20–40 % länger als Englisch; ein Titel aus zwei Wörtern wird zu einem aus drei
          Zeilen, und ein Grid aus Cards mit fester Höhe schneidet ab oder läuft über.
        </p>
        <ul>
          <li>
            <strong>Setz nie eine feste Höhe auf eine Card.</strong> Setz ein Minimum, wenn die Reihe einen Rhythmus
            braucht, und lass die höchste Card entscheiden.
          </li>
          <li>
            <strong>Nutz die Body-Stretch-Regeln, statt Höhen von Hand anzugleichen</strong> (Tab „Entwicklung“) — sie
            richten die Footer aus, egal was die Textlänge tut.
          </li>
          <li>
            <strong>Teste den Untertitel mit zwei Zeilen.</strong> Er ist die Zeile in gedämpfter Farbe, und zwei Zeilen
            gedämpfter Text bei 4,76:1 sind der Punkt, an dem eine Card anfängt, wie Rauschen zu wirken.
          </li>
          <li>
            <strong>Übersetze nicht in die Klassenliste.</strong> Sprachspezifische Abstandsklassen sind ein Zeichen, dass
            das Layout gegen den Text kämpft; reparier das Layout.
          </li>
        </ul>

        <h3>RTL: Die Card ist richtungsneutral</h3>
        <p>
          In keiner Regel, die <code>.p-card</code> betrifft, kommt ein <code>[dir]</code>-Selektor oder eine logische
          Property vor — das Padding ist eine symmetrische Kurzschreibweise, der Radius ist einheitlich, und der Schatten
          ist rein vertikal. Gemessen unter <code>dir="rtl"</code> gegen <code>dir="ltr"</code> an denselben Knoten:
          Host, Header, Body, Titel, Untertitel, Inhalt und Footer behalten identische Breite, Höhe, padding-left/right,
          Margins, alle vier Eckradien und denselben <code>box-shadow</code>; nur das berechnete
          <code>direction</code> kippt, und <code>text-align</code> bleibt <code>start</code>, also richtet sich der Text
          von selbst neu aus. Die Position steht <em>nicht</em> auf dieser Liste: Eine Card, die schmaler ist als ihr
          Container, wandert an die andere Kante, weil ihr Container <code>direction</code> folgt, nicht weil die Card
          sich spiegelt. Zwei der visuellen Stile des Kits ergänzen physische Asymmetrie, die sich ebenfalls nicht
          spiegelt: der um <code>3px 3px</code> versetzte Schatten von lernwerkstatt und der handgezeichnete Radius von
          skizzenbuch — dekorativ und in RTL harmlos.
        </p>
        <p>
          Was sich <em>doch</em> spiegelt, ist der Inhalt, den du schreibst. In derselben Messung tauschte eine
          Header-Zeile aus zwei Spans unter <code>justify-content: space-between</code> die Enden genau wie beabsichtigt.
          Also: nichts zu tun für die Card, alles zu tun für die Zeile darin — logische Properties für dein eigenes
          Padding und deine Margins, und keine Annahme, dass „das Jahr links steht“.
        </p>
        <p class="src-note">
          Zum Nachstellen: Setz <code>dir="rtl"</code> auf das Dokument-Element und vergleiche
          <code>getBoundingClientRect()</code> und berechnete Styles derselben Knoten mit dem LTR-Lauf.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.7</strong> — 01.10.2026 — Die dunklen Flächen von lernwerkstatt sind neutral geworden und mit ihnen
            die dunkle Kontur: <code>#969491</code>, das Grau der Control-Kanten des Stils, 5,5:1 auf ihrem Grund, statt
            <code>#9c8fac</code>.
          </li>
          <li>
            <strong>v0.6</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Stil-Kontur ist per
            Gate geprüft („panel outline“, ab 3,85:1 — die dunkle Kontur von lernwerkstatt ist jetzt <code>#9c8fac</code>,
            keine 1,17:1 mehr); der dunkle Card-Schatten ist ein Default, der der Signatur jedes Stils weicht; das
            i18n-Beispiel nennt einen existierenden Key.
          </li>
          <li>
            <strong>v0.5</strong> — 23.09.2026 — Gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016) neu geprüft: Jeder Stilblock umrandet
            <code>.p-card</code> und setzt Radius und Schatten, also werden die Lesart „1,00:1, Kante nur durch Schatten“,
            der 12px-Radius und die dunklen rgb()-Messwerte durch die Regeln je Stil, Token-Namen und aus den heutigen
            Tokens zusammengerechneten Kontrast ersetzt (dunkler Fließtext zitiert aus CONTRAST.MD); die Header-Größe
            von 20px in der WCAG-Zusammenfassung korrigiert; Aussage zu schmalen Bildschirmen unter Design; kommentierte
            Quellen als Abschluss von Verwendung; Agent-Doku gekürzt.
          </li>
          <li>
            <strong>v0.4</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014). Vier Aussagen aus v0.3 kippten
            zurück in ihre Form aus v21: <code>style</code>/<code>styleClass</code> und der <code>pTemplate</code>-Weg
            existieren wieder, die Facet-Queries sind <code>descendants: true</code> (der halbe Ausfall mit leerem Header
            ist zurück), und die angehängte Regel <code>.p-card &#123; display: block &#125;</code> schlägt die Flex-Spalte
            des Presets, also braucht der Fix für gleiche Höhen wieder drei Regeln. Die Aura-Tokens stehen wieder auf den
            Werten von 2.x (Body-Padding und Titel 1.25rem; der Untertitel hat nur ein Farb-Token), also gelten die Farb-
            und RTL-Messungen aus der Zeit von 21 unverändert. Alle Zeilenverweise gegen die Optimus-Bundles neu
            ermittelt.
          </li>
          <li>
            <strong>v0.3</strong> — 24.08.2026 — Gegen PrimeNG 22.1.2 / Aura 3.0 neu verifiziert: <code>style</code>/<code
              >styleClass</code
            >
            als Inputs und der <code>pTemplate</code>-Weg entfernt; die <code>display: block</code>-Falle upstream behoben
            (der Host ist eine Flex-Spalte — der Fix für gleiche Höhen schrumpft auf zwei Regeln); Facet-Queries jetzt wie
            die Template-Referenzen nur für direkte Kinder (der halbe Ausfall mit leerem Header ist weg); Geometrie von
            Aura 3.0 neu gemessen (Body-Padding und Titel 18px, Untertitel bekam explizite Schrift-Tokens);
            <code>.p-card-caption</code> als weiterhin tot bestätigt; alle Zeilenverweise neu ermittelt. Farbmessungen
            aus 21 gelten weiter — die Farb-Tokens der Card sind unverändert.
          </li>
          <li>
            <strong>v0.2</strong> — 20.08.2026 — WCAG-2.2-Statuszusammenfassung im Tab „Design“ ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.1</strong> — 30.07.2026 — Erster Guide: die Entscheidungstabelle für Container (Card / Panel /
            Fieldset / Section / Kit-Container), die vollständige Fläche des mitgelieferten CSS, die Aura-Token-Kette mit
            gegen die echte Fläche gemessenem Kontrast in beiden Themes, der tote <code>caption</code>-Pfad, die drei
            Template-Wege und wie jeder still ausfällt, der Body-Stretch-Fix, ein gemessenes RTL-Ergebnis und die
            kanonische Agent-Doku.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class CardArticleDeComponent extends CardArticleComponent {
  override readonly variantOptions = [
    { label: 'Titel über [header] — ein gestyltes div', value: 'plain' },
    { label: 'Titel über #title — eine echte Überschrift', value: 'heading' },
    { label: 'Header-Band + Titel über [header]', value: 'band' },
    { label: 'Band + Überschrift + Footer-Aktionen', value: 'full' },
  ];

  override readonly pgTopic: string = 'Retrieval-augmented Generation';
  override readonly pgBody: string =
    'Das Modell schlägt die Antwort nach, bevor es sie schreibt. Alles Schwierige an der Methode steckt ' +
    'im Nachschlagen.';

  override readonly pgSub = computed<string | undefined>(() => (this.pgSubtitle() ? 'Sechs Minuten, Mittelstufe' : undefined));

  override readonly stretchCards = [
    { id: 'a', title: 'Kurz', body: 'Eine Zeile.' },
    {
      id: 'b',
      title: 'Lang',
      body:
        'Vier oder fünf Zeilen Beschreibung, wie sie eine Redaktion schreibt, wenn das Thema neu ist ' +
        'und der Leser noch keinen Zugang dazu hat, und genau dann sieht ein Card-Grid nicht mehr ' +
        'aufgeräumt aus.',
    },
    { id: 'c', title: 'Mittel', body: 'Zwei Zeilen, plus oder minus ein Nebensatz.' },
  ];
}
