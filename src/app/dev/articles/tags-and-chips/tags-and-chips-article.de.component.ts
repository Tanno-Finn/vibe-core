import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TagsAndChipsArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './tags-and-chips-article.component';

/**
 * German twin of the Tags and Chips guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in the class
 * fields are German. Keep it in step with the English file: same tabs, same element
 * and binding skeleton (`node scripts/check-guide-translations.mjs tags-and-chips`).
 */
@Component({
  selector: 'app-tags-and-chips-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'tags-and-chips'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Komponenten, ein wiederkehrender Fehler. Ein <code>p-tag</code> ist ein
          <strong>Etikett, das das System an etwas heftet</strong> — ein Status, ein Zustand, eine Kategorie. Ein
          <code>p-chip</code> ist ein <strong>kompakter Stellvertreter für ein Ding</strong> — eine Person, eine Datei,
          ein Filter, den der Nutzer hinzugefügt hat —, deshalb kann nur der Chip ein Bild tragen und nur der Chip
          entfernt werden. Alles hier unten ist ein echtes Bedienelement; der Playground konfiguriert beide
          nebeneinander und schreibt das Markup aus.
        </p>

        <!-- Mini playground: two configurators, one for each component. -->
        <section class="pg" aria-label="Playground für Tag und Chip">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Tag konfigurieren</legend>

              <div class="pg__field">
                <span class="pg__label" id="pg-tag-sev-label">Severity</span>
                <p-selectbutton
                  [ariaLabelledBy]="'pg-tag-sev-label'"
                  [options]="severityOptions"
                  optionLabel="label"
                  optionValue="value"
                  [allowEmpty]="false"
                  size="small"
                  [ngModel]="pgSeverity()"
                  (ngModelChange)="pgSeverity.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-tag-rounded">Abgerundet</label>
                <p-toggleswitch
                  inputId="pg-tag-rounded"
                  [ngModel]="pgRounded()"
                  (ngModelChange)="pgRounded.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-tag-icon">Icon</label>
                <p-toggleswitch inputId="pg-tag-icon" [ngModel]="pgTagIcon()" (ngModelChange)="pgTagIcon.set($event)" />
              </div>

              <div class="pg__preview-wrap">
                <span class="pg__preview-label">Vorschau</span>
                <div class="pg__stage">
                  <p-tag
                    [value]="pgTagValue()"
                    [severity]="pgSeverityInput()"
                    [rounded]="pgRounded()"
                    [icon]="pgTagIcon() ? 'pi pi-check-circle' : undefined"
                  />
                </div>
              </div>

              <div class="ex__head">
                <span class="pg__code-label">Erzeugtes Markup</span>
                <button type="button" class="copy-btn" (click)="copy('pg-tag', pgTagCode())">
                  {{ copiedId() === 'pg-tag' ? 'Kopiert' : 'Kopieren' }}
                </button>
              </div>
              <pre class="code-block"><code>{{ pgTagCode() }}</code></pre>
            </fieldset>

            <fieldset class="pg__controls">
              <legend>Chip konfigurieren</legend>

              <div class="pg__field pg__field--switch">
                <label for="pg-chip-removable">Entfernbar</label>
                <p-toggleswitch
                  inputId="pg-chip-removable"
                  [ngModel]="pgRemovable()"
                  (ngModelChange)="pgRemovable.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-chip-icon">Icon</label>
                <p-toggleswitch
                  inputId="pg-chip-icon"
                  [ngModel]="pgChipIcon()"
                  (ngModelChange)="pgChipIcon.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-chip-image">Bild (schlägt das Icon)</label>
                <p-toggleswitch
                  inputId="pg-chip-image"
                  [ngModel]="pgChipImage()"
                  (ngModelChange)="pgChipImage.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-chip-disabled">Deaktiviert</label>
                <p-toggleswitch
                  inputId="pg-chip-disabled"
                  [ngModel]="pgChipDisabled()"
                  (ngModelChange)="pgChipDisabled.set($event)"
                />
              </div>

              <div class="pg__preview-wrap">
                <span class="pg__preview-label">Vorschau</span>
                <div class="pg__stage">
                  @if (pgChipVisible()) {
                    <p-chip
                      [label]="'Ada Lovelace'"
                      [icon]="pgChipIcon() && !pgChipImage() ? 'pi pi-user' : undefined"
                      [image]="pgChipImage() ? avatarDataUri : undefined"
                      [alt]="pgChipImage() ? 'Porträt von Ada Lovelace' : undefined"
                      [removable]="pgRemovable()"
                      [disabled]="pgChipDisabled()"
                      (onRemove)="pgChipVisible.set(false)"
                    />
                  } @else {
                    <p-button
                      label="Chip zurückholen"
                      size="small"
                      [text]="true"
                      (click)="pgChipVisible.set(true)"
                    />
                  }
                </div>
                <p class="pg__hint">
                  Entfernen blendet den Chip aus <em>und</em> meldet es dem Parent. Der Button oben ist der Parent, der ihn
                  zurücklegt — der Chip kann sich nicht selbst wiederherstellen (siehe Entwicklung → „Entfernen ist nicht
                  kontrolliert“).
                </p>
              </div>

              <div class="ex__head">
                <span class="pg__code-label">Erzeugtes Markup</span>
                <button type="button" class="copy-btn" (click)="copy('pg-chip', pgChipCode())">
                  {{ copiedId() === 'pg-chip' ? 'Kopiert' : 'Kopieren' }}
                </button>
              </div>
              <pre class="code-block"><code>{{ pgChipCode() }}</code></pre>
            </fieldset>
          </div>
        </section>

        <!-- The severity row: one tag per severity, in the Design tab's order. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Alle Severities nebeneinander</h3>
            <button type="button" class="copy-btn" (click)="copy('sev', severityCode)">
              {{ copiedId() === 'sev' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Alle sieben, in der Reihenfolge der Kontrasttabelle im Tab Design. Achte auf den ersten: gar keine
            <code>severity</code> ist nicht „neutral“ — es ist die <em>Marken</em>palette, sie ändert sich also mit der
            Farbe, die der Leser in den Einstellungen gewählt hat.
          </p>
          <div class="ex__stage" id="sev-row">
            @for (s of severityRow; track s.id) {
              <div class="sev">
                <p-tag [attr.data-sev]="s.id" [value]="s.label" [severity]="s.severity" />
                <span class="sev__caption">{{ s.caption }}</span>
              </div>
            }
          </div>
          <pre class="code-block"><code>{{ severityCode }}</code></pre>
        </section>

        <!-- Chip anatomy variants. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Was ein Chip tragen kann</h3>
            <button type="button" class="copy-btn" (click)="copy('chipvariants', chipVariantsCode)">
              {{ copiedId() === 'chipvariants' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Label, Icon, Bild, Entfernen-Control, deaktiviert. Bild und Entfernen-Control sind die zwei Dinge, die ein
            <code>p-tag</code> nicht kann — und sie sind der Grund, zum Chip zu greifen.
          </p>
          <div class="ex__stage" id="chip-row">
            <p-chip label="Nur Text" />
            <p-chip label="Mit Icon" icon="pi pi-file" />
            <p-chip label="Ada Lovelace" [image]="avatarDataUri" alt="Porträt von Ada Lovelace" />
            @if (demoChipVisible()) {
              <p-chip label="Entfernbar" [removable]="true" (onRemove)="demoChipVisible.set(false)" />
            } @else {
              <p-button label="Wiederherstellen" size="small" [text]="true" (click)="demoChipVisible.set(true)" />
            }
            <p-chip label="Deaktiviert" icon="pi pi-ban" [removable]="true" [disabled]="true" />
          </div>
          <pre class="code-block"><code>{{ chipVariantsCode }}</code></pre>
        </section>

        <!-- The two collections, next to each other. -->
        <section class="ex">
          <div class="ex__head">
            <h3 class="ex__title">Dieselbe Seite, beide Aufgaben</h3>
            <button type="button" class="copy-btn" (click)="copy('both', bothCode)">
              {{ copiedId() === 'both' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <p class="ex__note">
            Ein Karten-Header sagt, <em>was das System über das Element weiß</em> — Tags. Die Filterleiste zeigt,
            <em>was der Nutzer hinzugefügt hat</em>, und lässt ihn es zurücknehmen — Chips. Beim Lesen des Markups
            erkennst du, was was ist, ohne den Bildschirm zu sehen.
          </p>
          <div class="ex__stage ex__stage--column">
            <div class="card-demo">
              <div class="card-demo__head">
                <h4 class="card-demo__title">Prompt Engineering für Einsteiger</h4>
                <div class="card-demo__tags">
                  <p-tag value="Entwurf" severity="warn" [rounded]="true" />
                  <p-tag value="Einsteiger" severity="info" [rounded]="true" />
                  <p-tag value="Aktualisiert" severity="success" [rounded]="true" icon="pi pi-check" />
                </div>
              </div>
              <p class="card-demo__body">
                Drei Zustände, die der Leser nicht gewählt hat und nicht entfernen kann. Jeder ist ein Wort, nicht nur
                eine Farbe.
              </p>
            </div>

            <div class="card-demo">
              <div class="card-demo__head">
                <span class="card-demo__title">Aktive Filter</span>
              </div>
              <div class="card-demo__chips">
                @for (f of activeFilters(); track f.id) {
                  <p-chip [label]="f.label" [removable]="true" (onRemove)="dropFilter(f.id)" />
                }
                @if (activeFilters().length === 0) {
                  <span class="card-demo__empty">Keine Filter — hol welche zurück:</span>
                }
                @if (activeFilters().length < allFilters.length) {
                  <p-button label="Filter zurücksetzen" size="small" [text]="true" (click)="resetFilters()" />
                }
              </div>
              <p class="card-demo__body">
                Jeder Chip ist ein Objekt, das der Nutzer dort abgelegt hat. Geh mit Tab auf einen, drück
                <kbd>Enter</kbd> — er ist weg. (Drück <kbd>Space</kbd>, und nichts passiert; siehe Entwicklung.)
              </p>
            </div>
          </div>
          <pre class="code-block"><code>{{ bothCode }}</code></pre>
        </section>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Die Grenze in einem Satz</h3>
        <p class="rule-line">
          <strong>Ein Tag ist etwas, das das System über ein Element sagt; ein Chip ist ein Element.</strong>
        </p>
        <p>
          Dieser eine Test entscheidet fast jeden Fall. „Entwurf“, „Beta“, „3 Fehler“, „Fortgeschritten“ — das Urteil
          des Systems, auf eine Karte gedruckt: <code>p-tag</code>. „Ada Lovelace“, „report-q3.pdf“, „Kapitel:
          Prompting“ — ein Ding, das der Nutzer gewählt, aufgelistet und womöglich wieder zurückgenommen hat:
          <code>p-chip</code>. Die zwei Folgefragen sind mechanisch: <em>Kann es ein Gesicht tragen?</em> und <em>Kann
          der Nutzer es löschen?</em> Beide sind nur beim Chip ein Ja.
        </p>

        <h3>Welche nehmen? Die ehrliche Tabelle</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Greif zu</th>
                <th>Es steht für</th>
                <th>Wer es dort abgelegt hat</th>
                <th>Interaktiv?</th>
                <th>Trägt ein Bild</th>
                <th>Farbsystem</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>p-tag</code></td>
                <td>einen Status, einen Zustand, eine Kategorie</td>
                <td>das System</td>
                <td><strong>nein</strong> — keine Rolle, kein tabindex, keine Handler</td>
                <td>nein (nur Icon, 12px)</td>
                <td><code>severity</code> × 6 + der Marken-Default</td>
              </tr>
              <tr>
                <td><code>p-chip</code></td>
                <td>ein Objekt: eine Person, eine Datei, einen gewählten Filter</td>
                <td>meist der Nutzer</td>
                <td>nur sein <em>Entfernen</em>-Control</td>
                <td><strong>ja</strong> — <code>image</code> + <code>alt</code>, 32px-Kreis</td>
                <td>eine neutrale Fläche; keine Severities</td>
              </tr>
              <tr>
                <td><code>p-selectbutton</code></td>
                <td>eine Wahl zwischen Optionen</td>
                <td>der Nutzer, durch Drücken</td>
                <td><strong>ja</strong>, und es ist eine echte Radio-/Checkbox-Gruppe</td>
                <td>nein</td>
                <td>gewählt / nicht gewählt</td>
              </tr>
              <tr>
                <td><code>p-togglebutton</code></td>
                <td>einen unabhängigen An/Aus-Filter</td>
                <td>der Nutzer, durch Drücken</td>
                <td><strong>ja</strong>, mit <code>aria-pressed</code></td>
                <td>nein</td>
                <td>an / aus</td>
              </tr>
              <tr>
                <td><code>p-button</code> (text / outlined)</td>
                <td>eine Aktion</td>
                <td>—</td>
                <td><strong>ja</strong></td>
                <td>nein</td>
                <td>Severities, als Buttons</td>
              </tr>
              <tr>
                <td><code>p-badge</code> / <code>pBadge</code></td>
                <td>eine Zahl oder einen Punkt an einem anderen Control</td>
                <td>das System</td>
                <td>nein</td>
                <td>nein</td>
                <td>Severities</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Was diese Tabelle ist.</strong> Die Spalten 4–6 sind Verhalten, gelesen aus den Quellen von Optimus UI
          2.0.2 in <code>node_modules</code> und gegen die gerenderten Beispiele geprüft; die Spalten 2–3 sind die
          <em>redaktionelle</em> Regel, der dieses Kit folgt, nichts, was die Bibliothek erzwingt — nichts hindert dich,
          einen <code>p-tag</code> an ein vom Nutzer erstelltes Objekt zu hängen. Es wird nur ein Etikett, das der Nutzer
          nicht abnehmen kann.
        </p>

        <h3>Die Grauzone: „Filter-Chips“ sind Toggle-Buttons</h3>
        <p>
          Die pillenförmige Filterreihe, die jedes Produkt hat — das sind weder Chips noch Tags. Es ist eine
          <strong>Gruppe von Toggles, die zufällig Pillenform haben</strong>. Womit du sie auch renderst, es muss
          fokussierbar sein, muss sagen, ob es an ist, und muss auf <kbd>Space</kbd> reagieren. Weder <code>p-tag</code>
          noch <code>p-chip</code> tut irgendetwas davon, also ist die ehrliche Antwort <code>p-selectbutton</code> (oder
          <code>p-togglebutton</code> für einen einzelnen unabhängigen) — siehe den
          <a routerLink="/dev/design/guide/button">Button-Guide</a> für die ganze Familie der Aktionen. Wer
          <code>role="button"</code> und <code>tabindex="0"</code> an einen Tag schraubt, bekommt ein Control, das Chrome
          fokussiert und das sich per Tastatur nicht bedienen lässt, weil darunter kein Key-Handler liegt.
        </p>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Gerenderte Paare, beide Seiten live. Das <span class="tag tag--bad">Don’t</span> steht links, das
          <span class="tag tag--good">Do</span> rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Tag, der sich als Filter-Button ausgibt</span>
            <div class="dd__stage">
              @for (f of ddFilterOptions; track f.value) {
                <p-tag
                  [value]="f.label + (ddBadFilters().includes(f.value) ? ' ✓' : '')"
                  [severity]="ddBadFilters().includes(f.value) ? 'success' : 'secondary'"
                  role="button"
                  tabindex="0"
                  class="fake-button"
                  [attr.aria-pressed]="ddBadFilters().includes(f.value)"
                  (click)="toggleBadFilter(f.value)"
                />
              }
            </div>
            <p class="dd__why">
              Das Muster, wie es meist geschrieben wird: <code>role="button"</code>, <code>tabindex="0"</code> und
              <code>aria-pressed</code> an einen Tag geschraubt — <em>ohne</em> Key-Handler, weil die eine eigene Sache
              sind, an die man denken muss. Fokussiere einen und drück <kbd>Enter</kbd> oder <kbd>Space</kbd>: nichts
              schaltet um, weil ein <code>p-tag</code> keine eigene Tastaturbehandlung mitbringt. Das ist der Preis des
              Musters: Jede Tastatur-Bedienung ist von Hand geschrieben, und sobald eine vergessen wird, ist das Control
              fokussierbar, aber tot.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine echte Mehrfachauswahl aus Toggles</span>
            <div class="dd__stage">
              <span class="sr-only" id="dd-filter-good-label">Medientypen</span>
              <p-selectbutton
                [ariaLabelledBy]="'dd-filter-good-label'"
                [options]="ddFilterOptions"
                optionLabel="label"
                optionValue="value"
                [multiple]="true"
                [ngModel]="ddGoodFilters()"
                (ngModelChange)="ddGoodFilters.set($event)"
              />
            </div>
            <p class="dd__why">
              Ein Import, kein handgestricktes ARIA. Jede Option ist ein echter Button mit
              <code>aria-pressed</code>, per Tastatur erreichbar und bedienbar, und der gedrückte Zustand hängt nicht
              allein an der Farbe.
            </p>
          </div>
        </div>
        <p class="src-note">
          <strong>Selbst die sorgfältige Fassung dieses Musters leckt.</strong> Schreib auch die zwei Key-Handler und ein
          <code>[attr.aria-label]</code>, das dem Zustand folgt, und das Control schaltet tatsächlich auf beiden Tasten
          um — das <code>aria-label</code> wirkt hier sogar, anders als an einem <code>p-select</code>, gerade weil der
          Host ein explizites <code>role="button"</code> trägt. Zwei Mängel überleben diese Sorgfalt trotzdem, und beide
          sind typisch statt exotisch. Ein <code>(keydown.space)</code>-Handler, der nicht <code>preventDefault()</code>
          aufruft, schaltet um <em>und</em> scrollt die Seite, weil der Tag kein <code>&lt;button&gt;</code> ist und
          nichts das Standardverhalten unterdrückt. Und der gewählte Zustand landet meist angehängt am Label —
          <code>value + ' ✓'</code> —, was eine Zustandsmarke in übersetzten Inhalt steckt und dem Screenreader ein
          Häkchen zum Vorlesen gibt statt eines gedrückten Zustands. Das Argument gegen das Muster lautet also nicht „es
          ist kaputt“, sondern „es sind sieben handgeschriebene Attribute und Handler, die nachbauen, was
          <code>p-selectbutton</code> mitbringt, und sie driften auseinander“.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein entfernbarer Tag (nur Maus)</span>
            <div class="dd__stage">
              @for (f of ddRemovableBad(); track f) {
                <p-tag
                  [value]="f"
                  severity="info"
                  [rounded]="true"
                  icon="pi pi-times"
                  class="fake-button"
                  (click)="removeBad(f)"
                />
              }
              @if (ddRemovableBad().length === 0) {
                <p-button label="Zurücksetzen" size="small" [text]="true" (click)="resetBad()" />
              }
            </div>
            <p class="dd__why">
              Ein Click-Handler an einem <code>p-tag</code> mit einem Kreuz-Icon — die Form, zu der eine Zeile „aktiver
              Filter“ heranwächst, wenn niemand fragt, welche Komponente es hätte sein sollen. Kein <code>role</code>,
              kein <code>tabindex</code>, kein Name: Ein Tastaturnutzer kann den Filter überhaupt nicht löschen, und das ✕
              ist Dekoration statt eines Buttons. Der Tag rendert nichts Fokussierbares, also gibt es hier kein ARIA zu
              vergessen — es gibt nur die falsche Komponente.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein entfernbarer Chip</span>
            <div class="dd__stage">
              @for (f of ddRemovableGood(); track f) {
                <p-chip [label]="f" [removable]="true" (onRemove)="removeGood(f)" />
              }
              @if (ddRemovableGood().length === 0) {
                <p-button label="Zurücksetzen" size="small" [text]="true" (click)="resetGood()" />
              }
            </div>
            <p class="dd__why">
              Kit-Konvention für widerrufbare Filter, und eine Zeile kürzer als die Tag-Fassung. Das ✕ ist ein echtes
              <code>role="button"</code> mit <code>tabindex="0"</code> und einem Namen. Zwei Vorbehalte bleiben bei dir:
              Der Name kommt aus dem eigenen Vokabular der Bibliothek und muss aus deiner i18n-Schicht gespeist werden, und
              nur <kbd>Enter</kbd> und <kbd>Backspace</kbd> funktionieren — nicht <kbd>Space</kbd>.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Severity als die ganze Botschaft</span>
            <div class="dd__stage">
              <p-tag value="Kapitel 3" severity="danger" />
              <p-tag value="Kapitel 4" severity="success" />
              <p-tag value="Kapitel 5" severity="warn" />
            </div>
            <p class="dd__why">
              Drei gleich aussehende Labels in drei Farben. <code>severity</code> schreibt eine CSS-Klasse und ein
              <code>data-p</code>-Attribut — <strong>nichts davon erreicht den Accessibility Tree</strong>. Ein Screenreader
              hört „Kapitel 3, Kapitel 4, Kapitel 5“; genauso jeder, der Rot nicht von Grün unterscheiden kann.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — sag es im Value</span>
            <div class="dd__stage">
              <p-tag value="Kapitel 3 · überfällig" severity="danger" icon="pi pi-exclamation-triangle" />
              <p-tag value="Kapitel 4 · fertig" severity="success" icon="pi pi-check" />
              <p-tag value="Kapitel 5 · läuft" severity="warn" icon="pi pi-clock" />
            </div>
            <p class="dd__why">
              Der Zustand steht im Text, die Farbe wiederholt ihn nur, und das Icon liefert einen dritten Kanal. Jetzt
              übersteht der Tag Graustufen, einen Screenreader und einen übersetzten Build.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Chip für einen Status</span>
            <div class="dd__stage">
              <p-chip label="Entwurf" />
              <p-chip label="Fortgeschritten" />
            </div>
            <p class="dd__why">
              Preis, Schwierigkeit, Deployment — drei Status, wie sie im Buche stehen — als Chips gerendert. Sie kommen
              alle im selben neutralen Grau heraus, die Severity-Skala ist also weg; und die Aufrufstelle malt dann jeden
              mit einem Inline-<code>[style]</code>-Objekt aus TypeScript neu an, und so stirbt ein Design-System.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Tag mit Severity</span>
            <div class="dd__stage">
              <p-tag value="Entwurf" severity="warn" [rounded]="true" />
              <p-tag value="Fortgeschritten" severity="info" [rounded]="true" />
            </div>
            <p class="dd__why">
              Dieselben Wörter, halb so viel Markup, und die Farbe kommt aus dem Theme statt aus einem Inline-Style — sie
              folgt also der gewählten Palette des Lesers und dem Dark-Mode-Kontrastfix des Kits. Lies vor der Wahl der
              Severity aber den Tab Design: Zwei von ihnen bestehen im Light Mode mit fast keinem Spielraum.
            </p>
          </div>
        </div>

        <h3>Sammlungen: Wie viele sind zu viele?</h3>
        <ul>
          <li>
            <strong>Tags auf einer Karte: zwei oder drei.</strong> Sie konkurrieren mit dem Titel. Bei mehr als drei hört der
            Leser auf, sie zu lesen, und der Karten-Header bricht auf einem 360px-Bildschirm in eine zweite Zeile um.
          </li>
          <li>
            <strong>Chips in einer Filterleiste: so viele, wie der Nutzer angelegt hat</strong> — aber lass sie umbrechen,
            scroll sie nie horizontal und gib der Reihe eine <code>&lt;span&gt;</code>-Beschriftung („Aktive Filter:“),
            damit die Gruppe einen Namen hat.
          </li>
          <li>
            <strong>Gib einer Chip-Sammlung einen Ausweg „Alle löschen“.</strong> Acht Chips mit je einem
            <kbd>Enter</kbd> zu entfernen ist eine Plackerei, und jedes Entfernen verschiebt den Fokus (siehe Tab
            Entwicklung).
          </li>
          <li>
            <strong>Sortiere eine Chip-Sammlung nicht.</strong> Der Nutzer hat sie in einer Reihenfolge angelegt;
            Umsortieren unter seinen Händen verschiebt das ✕, auf das er gezielt hat.
          </li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — das Kriterium, an dem eine nackte <code>severity</code> scheitert: Farbe darf nicht das einzige visuelle
            Mittel sein, eine Information zu vermitteln. Das ist das ganze Argument dafür, den Zustand in den
            <code>value</code> des Tags zu schreiben.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 1.4.3 Contrast (Minimum)</a
            >
            — die Schwelle 4,5:1, gegen die die Severity-Tabelle im Tab Design gemessen ist (Tag-Text ist in Aura 3.0
            12px fett und erreicht damit nicht die 18.66px-Ausnahme für „großen Text“).
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — 24×24 CSS-Pixel. Die Referenz für das Entfernen-Control des Chips, das Aura 2.x — das Token-Set, das
            Optimus mitbringt — auf <code>1rem</code> (16px) bemisst.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer">
              W3C — APG, Button pattern</a
            >
            — „aktiviert durch <kbd>Enter</kbd> <em>und</em> <kbd>Space</kbd>“. Der Vertrag, den das
            <code>role="button"</code>-Entfernen-Control des Chips nicht ganz erfüllt.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#generic" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA 1.2, the <code>generic</code> role</a
            >
            — „die Rolle generic … unterstützt das Attribut aria-label nicht“. Warum das <code>aria-label</code> am Host
            des Chips kein verlässlicher Name ist.
          </li>
          <li>
            <a href="https://optimus.openng.org/tag" target="_blank" rel="noopener noreferrer"> Optimus UI — Tag</a> und
            <a href="https://optimus.openng.org/chip" target="_blank" rel="noopener noreferrer">Chip</a>
            — die API-Oberfläche des Herstellers, geprüft gegen die ausgelieferten
            <code>node_modules/&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tag.mjs</code> und
            <code>openng-optimus-ui-chip.mjs</code>, statt sie auf Treu und Glauben zu übernehmen.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>Beide Komponenten rendern ihr eigenes Host-Element, ohne Wrapper und ohne natives Control.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                <th><code>p-tag</code></th>
                <th><code>p-chip</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Host</td>
                <td>
                  <code>&lt;p-tag class="p-tag p-component p-tag-&lt;severity&gt;"&gt;</code>,
                  <code>data-p</code> spiegelt severity + rounded
                </td>
                <td>
                  <code>&lt;p-chip class="p-chip p-component"&gt;</code>, <code>aria-label</code> = das Label,
                  <code>data-p="removable"</code>
                </td>
              </tr>
              <tr>
                <td>Icon</td>
                <td><code>span.p-tag-icon</code>, 0.625rem — nur gerendert, wenn <code>icon</code> gesetzt ist</td>
                <td><code>span.p-chip-icon</code>, 0.875rem</td>
              </tr>
              <tr>
                <td>Bild</td>
                <td>—</td>
                <td>
                  <code>img.p-chip-image</code>, 2rem-Kreis, mit einem negativen
                  <code>margin-inline-start</code> von <code>chip.padding.y</code> ins Padding gezogen
                </td>
              </tr>
              <tr>
                <td>Label</td>
                <td><code>span.p-tag-label</code></td>
                <td><code>div.p-chip-label</code> (ein Block-Element in einer Inline-Flex-Box)</td>
              </tr>
              <tr>
                <td>Entfernen</td>
                <td>—</td>
                <td>
                  <code>svg.p-chip-remove-icon</code> (oder ein Span mit deiner Icon-Klasse), <code>role="button"</code>,
                  <code>tabindex="0"</code>, <code>aria-label</code>
                </td>
              </tr>
              <tr>
                <td>Projektion</td>
                <td colspan="2">
                  Beide beginnen mit <code>&lt;ng-content&gt;</code>, freier Inhalt landet also <em>vor</em> Icon und
                  Label.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus den Inline-Templates in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-tag.mjs</code> und <code>openng-optimus-ui-chip.mjs</code>
          (Optimus UI 2.0.2, <code>node_modules/&#64;openng/optimus-ui/package.json</code>); die DOM-Struktur wurde in der
          laufenden App auf 21 bestätigt — die Templates sind in Optimus unverändert.
        </p>

        <h3>Geometrie — Tokens und gemessene Boxen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Eigenschaft</th>
                <th><code>p-tag</code></th>
                <th><code>p-chip</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size / weight</td>
                <td>0.875rem (14px) / <strong>700</strong></td>
                <td>
                  geerbt (hier 16px) / normal — Aura 2.x hat kein <code>chip.label</code>-Token, und das Stylesheet hat
                  keine <code>.p-chip-label</code>-Regel
                </td>
              </tr>
              <tr>
                <td>padding</td>
                <td>0.25rem 0.5rem (4/8px)</td>
                <td>0.5rem block, 0.75rem inline (8/12px)</td>
              </tr>
              <tr>
                <td>gap</td>
                <td>0.25rem</td>
                <td>0.5rem</td>
              </tr>
              <tr>
                <td>border-radius</td>
                <td>6px, oder 12px mit <code>[rounded]</code></td>
                <td>16px, immer</td>
              </tr>
              <tr>
                <td>Icon-Größe</td>
                <td>0.75rem (12px)</td>
                <td>1rem (16px)</td>
              </tr>
              <tr>
                <td><strong>Höhe</strong></td>
                <td>
                  <strong>{{ M.tagHeight }}</strong>
                </td>
                <td>
                  <strong>{{ M.chipHeight }}</strong>
                </td>
              </tr>
              <tr>
                <td>mit Bild</td>
                <td>—</td>
                <td>
                  <strong>{{ M.chipImageHeight }}</strong> (2rem-Avatar + halbes Padding)
                </td>
              </tr>
              <tr>
                <td>Box des Entfernen-Controls</td>
                <td>—</td>
                <td>
                  <strong>{{ M.removeIconBox }}</strong> — das 1rem-Token, ohne Padding drumherum
                </td>
              </tr>
              <tr>
                <td>Transition</td>
                <td>keine deklariert</td>
                <td>
                  keine am Chip selbst; 0.2s auf <code>outline-color</code> und <code>box-shadow</code> des
                  <em>Entfernen-Controls</em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Token-Namen und -Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/tag/index.mjs</code> und
          <code>&#8230;/aura/chip/index.mjs</code> (<code>--p-tag-*</code> / <code>--p-chip-*</code>). Die Höhen sind der
          berechnete Style gerenderter Controls bei 16px Root-Schrift, vor jedem Rahmen eines visuellen Stils: Jeder
          Style-Block in <code>styles.scss</code> (<code>html.style-&lt;name&gt; .p-tag</code>) gibt dem Tag einen
          Outline-Rahmen in <code>--style-outline</code> und einen eigenen Radius, was die Höhe vergrößert. <strong>Die
          zwei Zahlen, auf die es ankommt:</strong> Ein Chip ist rund ein Drittel höher als ein Tag, also sieht eine
          Mischung in einer Reihe wie ein Fehler aus, selbst wenn es keiner ist; und die Box des Entfernen-Controls mit
          {{ M.removeIconBox }} liegt deutlich unter den 24×24 CSS-Pixeln von WCAG 2.2 SC 2.5.8 —
          {{ M.removeSpacingNote }}
        </p>

        <h3>Severity: Farbe, und nur Farbe</h3>
        <p>
          <code>severity</code> hängt eine Klasse an (<code>p-tag-success</code>, …) und schreibt <code>data-p</code>. Das
          ist der ganze Mechanismus — geprüft in der Map <code>classes.root</code> oben in
          <code>openng-optimus-ui-tag.mjs</code>, einem schlichten Objekt aus Klassennamen-Prädikaten ohne jede
          Attribut-Ausgabe. Es gibt kein <code>role="status"</code>, kein <code>aria-label</code>, keinen versteckten
          Text. Was auch immer die Farbe bedeutet, der <code>value</code> muss es ebenfalls sagen.
        </p>
        <p>
          Ein Tag <strong>ohne</strong> <code>severity</code> ist auch nicht neutral: Die Basisregel <code>.p-tag</code>
          malt ihn aus <code>tag.primary.*</code>, also aus der <em>Marken</em>palette, die dieses Kit den Leser ändern
          lässt (<code>THEME_COLORS</code> in <code>theme.service.ts</code> bringt zehn mit). Ein Default-Tag hat deshalb
          für verschiedene Leser verschiedene Farben — gut für „hervorgehoben“, falsch für alles, was einen bestimmten
          Zustand bedeutet.
        </p>

        <h4>Kontrast, beide Themes</h4>
        <p>
          Text in 14px <strong>fett</strong> ist unter WCAG kein „großer Text“ (der beginnt bei 18.66px fett), also liegt
          die Latte bei <strong>4,5:1</strong>. Gemessen an einem Tag pro Severity, wobei jeder Hintergrund die
          Vorfahrenkette hinunter verrechnet wird — das zählt, weil Auras dunkle Severities
          <code>color-mix(&#8230;, transparent 84%)</code> sind und nur über der Fläche richtig aussehen, auf der sie
          gerade liegen. Wo ein Bereich angegeben ist, ist es die Spanne über die drei dunklen Flächen dieses Kits; die
          genaue Verrechnungsregel steht unter der Tabelle, denn eine Kontrastzahl ohne ihre Methode ist keine Messung.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>severity</th>
                <th>Hell — Farben</th>
                <th>Hell</th>
                <th>Dunkel — Farben</th>
                <th>Dunkel</th>
              </tr>
            </thead>
            <tbody>
              @for (r of contrastRows; track r.sev) {
                <tr>
                  <td>
                    <code>{{ r.sev }}</code>
                  </td>
                  <td class="mono">{{ r.lightColors }}</td>
                  <td [class.fail]="r.lightFail">
                    <strong>{{ r.light }}</strong
                    >{{ r.lightFail ? ' ✕' : r.light.startsWith('per') ? '' : ' ✓' }}
                  </td>
                  <td class="mono">{{ r.darkColors }}</td>
                  <td [class.fail]="r.darkFail">
                    <strong>{{ r.dark }}</strong
                    >{{ r.darkFail ? ' ✕' : r.dark.startsWith('per') ? '' : ' ✓' }}
                  </td>
                </tr>
              }
              <tr>
                <td><code>p-chip</code> (keine Severities)</td>
                <td class="mono">{{ chipContrast.lightColors }}</td>
                <td [class.fail]="chipContrast.lightFail">
                  <strong>{{ chipContrast.light }}</strong
                  >{{ chipContrast.lightFail ? ' ✕' : '' }}
                </td>
                <td class="mono">{{ chipContrast.darkColors }}</td>
                <td [class.fail]="chipContrast.darkFail">
                  <strong>{{ chipContrast.dark }}</strong
                  >{{ chipContrast.darkFail ? ' ✕' : '' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <strong>Die Methode, weil diese Zahl von der Methode abhängt.</strong> Lies die aufgelöste
          <code>background-color</code> des Tags, geh die Vorfahrenkette hinauf und verrechne, bis ein deckender
          Hintergrund gefunden ist, und wende die WCAG-Formel für relative Leuchtdichte gegen <em>diesen</em> an.
          Wiederhole das pro Theme und lass den Wechsel sich setzen, bevor du liest — Werte aus demselben Tick wie ein
          Theme-Wechsel beschreiben noch das alte Theme.
          {{ M.contrastNote }}
        </p>

        <h4>Das Kit flickt fünf davon, und zwei Fälle fallen durch</h4>
        <p>
          Die <code>styles.scss</code> des Kits trägt fünf <code>!important</code>-Overrides unter
          <code>.dark-theme .p-tag.p-tag-*</code>, die Auras dunkle Tönungen durch satte Hintergründe der Stufe 700 mit
          weißem Text ersetzen, für <code>success</code>, <code>info</code>, <code>warn</code>, <code>danger</code> und
          <code>secondary</code>. Ihr eigener Kommentar begründet sie mit unbehandelten Tönungen von „3,9–4,4:1“.
          {{ M.overrideNote }}
        </p>
        <p class="src-note">
          Was die fünf Regeln nicht abdecken: einen <code>p-tag</code> ohne <code>severity</code> und
          <code>severity="contrast"</code>. Der Fall ohne Severity ist nicht hypothetisch — er entsteht versehentlich,
          sobald eine Aufrufstelle den Input vergisst oder <strong><code>'warning'</code></strong
          > übergibt, einen Wert aus der Zeit von PrimeNG 17. Optimus prüft weiterhin <code>severity === 'warn'</code> und
          sonst nichts (die Map <code>classes.root</code> in <code>openng-optimus-ui-tag.mjs</code>), also trifft
          <code>'warning'</code> keine Klasse, und der Tag rendert stillschweigend in der Markenpalette statt in Orange.
          Es ist ein Tippfehler, den das Typsystem nicht fangen kann, wenn der Wert aus einer Methode kommt, deren
          Rückgabetyp noch die alte Union deklariert — ein grep lohnt sich in jeder Codebasis, die durch ein Upgrade von
          v17 gegangen ist.
        </p>

        <h3>Der Chip hat keine Severity-Skala — und genau darum geht es</h3>
        <p>
          Aura gibt dem Chip genau ein Farbpaar pro Theme (<code>{{ '{' }}surface.800{{ '}' }}</code> auf
          <code>{{ '{' }}surface.100{{ '}' }}</code> im Hellen, <code>{{ '{' }}surface.0{{ '}' }}</code> auf
          <code>{{ '{' }}surface.800{{ '}' }}</code> im Dunklen) und keine Varianten. Das ist bewusstes Design, keine
          Lücke: Ein Chip steht für ein <em>Objekt</em>, und Objekte haben keine Severities. Wenn du dich dabei ertappst,
          einen roten Chip zu wollen, wolltest du einen Tag.
        </p>
        <p>
          Was eine Codebasis stattdessen tut, sobald sie entschieden hat, dass ein Chip rot sein muss: Sie bindet ein
          Inline-<code>[style]</code>-Objekt aus einer Methode <code>get&#8230;ChipStyle()</code>. Diese Farben werden in
          TypeScript berechnet: Sie umgehen das Theme komplett, folgen nicht dem Dark-Mode-Schalter und vermehren sich —
          eine Methode pro Attribut, ein Attribut pro Karte. Der Katalog dieses Kits ist die Stelle, wo es hier passiert
          ist.
        </p>
        <p class="src-note">
          Wenn ein Chip wirklich eine Farbe tragen muss, ist der billige Ausweg
          <code>styleClass</code> plus eine CSS-Regel, die Custom Properties <code>--primary-*</code> liest, <em>mit</em>
          einem Gegenstück unter <code>.dark-theme</code> — das folgt wenigstens dem Theme. Es ist immer noch die falsche
          <em>Komponente</em> für einen Status; es ist nur nicht zusätzlich eine Umgehung des Themes.
        </p>

        <h3>Fokus und Bewegung</h3>
        <ul>
          <li>
            <strong>Nur das Entfernen-Control des Chips ist fokussierbar</strong>, und es trägt den einen Fokus-Ring des
            Kits — den Ring, den jeder fokussierbare Optimus-Teil trägt, anstelle von Auras 1px-<code>focus.ring</code>:
            {{ M.focusRing }}
          </li>
          <li>
            <strong>Der Ring wird mit <code>outline</code> auf einen Kreis gezeichnet</strong>
            (<code>border-radius: 50%</code>), er schmiegt sich also an das Icon. Bei {{ M.removeIconBox }} plus Offset
            ist er klein, aber sichtbar.
          </li>
          <li>
            <strong>Sonst bewegt sich nichts.</strong> Der Chip animiert nur <code>outline-color</code> und
            <code>box-shadow</code>; der Tag hat überhaupt keine Transition. Entfernen geschieht sofort (<code
              >display: none</code
            >), ohne Ausblend-Animation, die <code>prefers-reduced-motion</code> beachten müsste — wenn du eine willst,
            gehört sie dir.
          </li>
        </ul>

        <h3>Schmale Bildschirme</h3>
        <p>
          Keine der beiden Komponenten hat responsives Verhalten: Beide sind inline-flex, behalten ihre Größe in jedem
          Viewport und kürzen nie — ein langer Value oder ein langes Label macht die Pille einfach breiter. Der Umbruch
          gehört der Reihe, in die du sie setzt: Gib ihr <code>display: flex; flex-wrap: wrap</code> und ein
          <code>gap</code>, damit eine Tag-Reihe oder eine Filter-Chip-Leiste bei 360px in eine zweite Zeile umbricht,
          statt zu scrollen oder die Karte breiter zu drücken.
        </p>

        <h3>Stand WCAG 2.2</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen ist, wird nicht
          beansprucht. <strong>Erfüllt:</strong> SC 1.4.3 für die vier Zustands-Severities, die in beiden Themes 4,5:1
          übertreffen (hell 4,52–5,30, dunkel 5,02–6,47, unabhängig von Stil und Akzent); und SC 2.4.7 für das
          Entfernen-Control des Chips, dessen Ring der 2px-Ring des Kits mit 2px Offset ist, sichtbar in beiden Themes
          und am Chip abgesichert (4,73:1 und mehr). <strong>Nicht erfüllt:</strong> SC 1.4.1
          — Severity ist Farbe und sonst nichts, gemessen als nackter StaticText-Knoten ohne Rolle und ohne Namen, also
          muss der Zustand auch im Value stehen; SC 2.5.8 — das Entfernen-Control ist eine 16×16px-Box (Aura 2.x
          <code>chip.removeIcon.size</code> 1rem) gegen die Untergrenze von 24×24, und eine enge Reihe verliert obendrein
          die Abstandsausnahme; und SC 2.4.3 — nach einem Entfernen liegt der Fokus gemessen auf dem Body des Dokuments
          statt irgendwo in der Nähe des verschwundenen Chips. SC 1.4.3 gilt auch für die Tags ohne Severity (jeder
          Akzent, 7,62:1 und mehr), <code>secondary</code> und <code>contrast</code> und für den Chip (abgesichert,
          siehe Tabelle). <strong>Bedingt:</strong> SC 4.1.2
          für das Entfernen-Control, das ein
          echter Button mit Namen und Tab-Stopp ist, dessen Handler aber nur auf Enter und Backspace antwortet, sodass
          Space nichts tut und der Vertrag der angekündigten Rolle nicht erfüllt ist. <strong>AAA</strong> ist für diese
          Komponente nicht bewertet.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          Zwei getrennte Entry Points, jeder exportiert eine Standalone-Komponente. Keine ist ein
          <code>ControlValueAccessor</code>, und keine nimmt an Formularen teil — es sind Anzeigekomponenten mit, im Fall
          des Chips, einem Event.
        </p>

        <h3><code>p-tag</code> — die ganze API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Input</th>
                <th>Typ</th>
                <th>Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>value</code></td>
                <td>string</td>
                <td>Der Text. Gerendert in <code>span.p-tag-label</code>.</td>
              </tr>
              <tr>
                <td><code>severity</code></td>
                <td><code>BadgeSeverity</code> = <code>'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'</code></td>
                <td>Hängt eine Klasse an. Lass ihn weg, und du bekommst die Markenpalette.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>string</td>
                <td>
                  Klasse eines Icon-Font-Glyphen, z. B. <code>pi pi-check</code>. Gerendert ohne
                  <code>aria-hidden</code>, aber auch ohne Rolle, für AT also so oder so unsichtbar.
                </td>
              </tr>
              <tr>
                <td><code>rounded</code></td>
                <td>boolean</td>
                <td>
                  Tauscht 6px gegen 12px Radius. Mit <code>booleanAttribute</code> transformiert, also funktioniert ein
                  nacktes <code>rounded</code>.
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>Veraltet, nicht entfernt:</strong> <code>styleClass</code> — PrimeNG 22 hat es gestrichen;
                  Optimus behält den Input aus v21, seit v20 als <code>&#64;deprecated</code> markiert, und er erreicht
                  weiterhin den Host (<code>[class]="cn(cx('root'), styleClass)"</code>). Nimm trotzdem einfach
                  <code>class</code>.
                </td>
              </tr>
              <tr>
                <td><code>&lt;ng-template #icon&gt;</code></td>
                <td>Template</td>
                <td>
                  Ersetzt den Icon-Span. Der einzige Content-Slot (direktes Kind — die Query ist
                  <code>&#123; descendants: false &#125;</code>).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Das ist die komplette Oberfläche: <strong>fünf Inputs (einer veraltet), null Outputs, keine Methoden</strong> —
          die Zeile <code>#icon</code> oben ist ein Content-Slot, kein Input. Braucht eine Anforderung irgendetwas
          anderes — einen Klick, einen Zustand, einen Namen —, ist es kein Tag.
        </p>

        <h3><code>p-chip</code> — die ganze API</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Typ</th>
                <th>Bedeutung</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>label</code></td>
                <td>string</td>
                <td>Der Text — und, wörtlich, das <code>aria-label</code> des Hosts.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>string</td>
                <td>
                  Icon-Klasse. Wird ignoriert, wenn <code>image</code> gesetzt ist (das Template ist ein
                  <code>*ngIf/else</code>).
                </td>
              </tr>
              <tr>
                <td><code>image</code></td>
                <td>string</td>
                <td>Ein <code>&lt;img src&gt;</code>, gerendert als 2rem-Kreis.</td>
              </tr>
              <tr>
                <td><code>alt</code></td>
                <td>string</td>
                <td>
                  Der Alt-Text des Bildes. <strong>Setz ihn immer</strong> — er ist standardmäßig leer, was den Avatar zu
                  einem namenlosen Bild macht.
                </td>
              </tr>
              <tr>
                <td><code>removable</code></td>
                <td>boolean</td>
                <td>Rendert das Entfernen-Control. Lies vorher unten „Entfernen ist nicht kontrolliert“.</td>
              </tr>
              <tr>
                <td><code>removeIcon</code></td>
                <td>string</td>
                <td>Icon-Klasse für das Entfernen-Control statt des eingebauten Times-Circle-SVGs.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>
                  Fügt <code>p-disabled</code> hinzu und setzt den <code>tabindex</code> des Entfernen-Controls auf
                  <code>-1</code>. Es fügt <strong>kein</strong> <code>aria-disabled</code> hinzu, und der Click-Handler
                  feuert weiterhin.
                </td>
              </tr>
              <tr>
                <td><code>chipProps</code></td>
                <td>object</td>
                <td>
                  Setzt alles oben Genannte gesammelt aus einem Objekt. Weist im Setter private Felder mit
                  <code>_</code>-Präfix zu und spiegelt eine Teilmenge in <code>ngOnChanges</code> — ein seltsamer, teils
                  doppelter Weg; nimm lieber explizite Inputs.
                </td>
              </tr>
              <tr>
                <td><code>(onRemove)</code></td>
                <td><code>MouseEvent | KeyboardEvent</code></td>
                <td>Feuert, <em>nachdem</em> der Chip sich ausgeblendet hat.</td>
              </tr>
              <tr>
                <td><code>(onImageError)</code></td>
                <td><code>Event</code></td>
                <td>Der Avatar konnte nicht laden — wechsle zu einem Icon oder zu Initialen.</td>
              </tr>
              <tr>
                <td><code>&lt;ng-template #removeicon&gt;</code></td>
                <td>Template</td>
                <td>
                  Ersetzt das Entfernen-Glyph. Der Wrapper behält <code>role="button"</code>, den tabindex und das
                  aria-label, das ist also sicher.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Member gelesen aus den Klassen <code>Chip</code> und <code>Tag</code> in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-chip.mjs</code> / <code>openng-optimus-ui-tag.mjs</code>,
          die Host-Bindings aus dem <code>host:</code>-Block jeder Komponente statt aus der Doku.
        </p>

        <h3>Entfernen ist nicht kontrolliert</h3>
        <p>Das ist das eine, was du wissen musst, bevor du einen entfernbaren Chip auslieferst. Der Handler hat drei Zeilen:</p>
        <pre class="code-block"><code>{{ closeSnippet }}</code></pre>
        <p>Daraus folgen drei Konsequenzen:</p>
        <ul>
          <li>
            <strong>Du kannst ein Entfernen nicht verhindern.</strong> Der Chip ist schon ausgeblendet, wenn
            <code>onRemove</code> bei dir ankommt, also sind „Bist du sicher?“-Abläufe unmöglich, ohne den Chip selbst
            neu zu rendern.
          </li>
          <li>
            <strong>Er blendet aus, er hängt nicht aus.</strong> <code>visible: false</code> wird über den Style-Hook zu
            einem Inline-<code>display: none</code> — das Element bleibt im DOM. (Der Hook ist
            <code>display: !instance.visible &amp;&amp; 'none'</code>, was den Wert <code>false</code> liefert, solange
            der Chip sichtbar ist; Angular verwirft falsy Style-Werte, also wird nichts geschrieben — gemessen trägt ein
            sichtbarer Chip überhaupt kein <code>style</code>-Attribut.) Wenn dein Parent das Element <em>auch</em> aus
            seiner Liste entfernt, verschwindet der ganze Knoten; vergisst er es, bekommst du einen unsichtbaren Chip,
            der sein <code>aria-label</code> im Tree behält. Steuere die Sammlung immer aus deinem eigenen Model und lass
            <code>&#64;for</code> das Entfernen erledigen.
          </li>
          <li>
            <strong>Wieder anzeigen braucht eine neue Komponente.</strong> <code>visible</code> ist ein schlichtes Feld,
            kein <code>@Input</code>, also kann der Parent es nicht zurücksetzen. Füg das Element wieder ins Model ein und
            lass <code>&#64;for</code> einen frischen Chip erzeugen — genau das tun die Buttons „Wiederherstellen“ im Tab
            Beispiele.
          </li>
        </ul>
        <pre class="code-block"><code>{{ collectionSnippet }}</code></pre>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>
          Jedes Token ist als <code>--p-tag-*</code> / <code>--p-chip-*</code> verfügbar, und Geometrie geht sauber
          durch. Bei der Farbe greift das Kit ein: Die fünf <code>!important</code>-Tag-Regeln für den Dark Mode in
          <code>styles.scss</code> schlagen jede Custom Property, die du setzt. Begrenze Overrides auf eine Klasse, nie
          global.
        </p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Das Präfix <code>p</code> wird in <code>app.config.ts</code> gesetzt (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). Ein Vorbehalt, den du kennen solltest: Optimus injiziert den Token-Block einer Komponente, wenn diese
          Komponente zum ersten Mal rendert, also liest sich <code>--p-chip-*</code> auf einer Seite ohne Chip als leerer
          String zurück — gemessen, und eine echte Falle, wenn du Tokens aus der Konsole abfragst.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>

        <h4>Was der Accessibility Tree tatsächlich bekommt</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Gemessene Rolle / Name</th>
                <th>Urteil</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;p-tag severity="success" value="Verfügbar"&gt;</code></td>
                <td>{{ M.a11yTag }}</td>
                <td>
                  <strong>Nur Text.</strong> Die Severity steht in keiner Form im Tree — weder als Rolle noch als Zustand
                  noch als Beschreibung.
                </td>
              </tr>
              <tr>
                <td><code>&lt;p-chip label="Kapitel 3"&gt;</code>-Host</td>
                <td>{{ M.a11yChipHost }}</td>
                <td>{{ M.a11yChipHostVerdict }}</td>
              </tr>
              <tr>
                <td>das Entfernen-Control des Chips</td>
                <td>{{ M.a11yRemove }}</td>
                <td>
                  <strong>Ein echter Button</strong> — benannt aus dem eigenen Vokabular der Bibliothek, nicht von deiner
                  Aufrufstelle (siehe Tab Internationalisierung (i18n)).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gelesen aus dem Accessibility Tree mit eingeschlossenen uninteressanten Knoten — ein
          <code>p-tag</code> ist genau die Art Knoten, die ein gefilterter Snapshot weglässt, also zeigt dir eine Ansicht
          „nur Interessantes“ nichts und lässt dich das Falsche schließen.
          {{ M.a11yNote }}
        </p>

        <h4>Tastatur — gemessen, Taste für Taste</h4>
        <p>
          Der Tag hat kein Tastaturverhalten zum Testen: Nichts an ihm ist fokussierbar. Für das Entfernen-Control des
          Chips, mit dem Control im Fokus:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Ergebnis</th>
                <th>Erwartet vom APG-Button-Pattern</th>
              </tr>
            </thead>
            <tbody>
              @for (k of keyRows; track k.key) {
                <tr>
                  <td>
                    <kbd>{{ k.key }}</kbd>
                  </td>
                  <td [class.fail]="k.fail">{{ k.result }}</td>
                  <td>{{ k.expected }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Der Mechanismus ist eine Methode in <code>openng-optimus-ui-chip.mjs</code>:
          <code>onKeydown(e) &#123; if (e.key === 'Enter' || e.key === 'Backspace') this.close(e); &#125;</code>.
          <kbd>Space</kbd> steht nicht darin, also verfehlt ein <code>role="button"</code>-Element stillschweigend das
          Pattern, das es deklariert — und weil das Element ein <code>&lt;svg&gt;</code> ist, kein
          <code>&lt;button&gt;</code>, ergänzt der Browser nichts.
          {{ M.keyboardNote }}
        </p>

        <h4>Fokus nach dem Entfernen</h4>
        <p>
          {{ M.focusAfterRemove }} Was der Browser auch damit macht, die Lösung liegt bei dir: Bewege den Fokus nach
          <code>onRemove</code> gezielt — auf den nächsten Chip oder, wenn die Liste jetzt leer ist, auf die Beschriftung
          der Gruppe.
        </p>
        <pre class="code-block"><code>{{ focusSnippet }}</code></pre>

        <h4>Bekannte Lücken — überkleistere sie nicht stillschweigend</h4>
        <ul>
          <li>
            <strong>Severity ist für assistive Technik unsichtbar.</strong> Kein Fehler, den du mit einem Wrapper beheben
            kannst — schreib die Bedeutung in den <code>value</code>.
          </li>
          <li>
            <strong>Der Name des Entfernen-Controls ist standardmäßig das englische Literal „Remove“</strong> und von der
            Aufrufstelle aus nicht erreichbar. Global behebbar; siehe Tab Internationalisierung (i18n).
          </li>
          <li>
            <strong><kbd>Space</kbd> aktiviert das Entfernen-Control nicht</strong>, und pro Aufrufstelle gibt es keinen
            Workaround außer <code>&lt;ng-template #removeicon&gt;</code> plus eigenem Key-Handler.
          </li>
          <li>
            <strong>Das Entfernen-Control misst {{ M.removeIconBox }}</strong> — unter den 24×24 von SC 2.5.8. Auf einem
            Handy, neben einem anderen Chip, ist es ein wirklich schwer zu treffendes Ziel.
          </li>
          <li>
            <strong><code>[disabled]</code> an einem Chip ist Kosmetik</strong> plus ein <code>tabindex="-1"</code>:
            kein <code>aria-disabled</code>, und der Klick-Pfad ist weiter aktiv, also kann ein Mausnutzer einen
            „deaktivierten“ Chip entfernen. Im Template geprüft — das Binding <code>(click)="close($event)"</code> ist
            nicht durch <code>disabled</code> geschützt.
          </li>
        </ul>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>
            ☐ Der Ein-Satz-Test ergibt die Komponente, die du tatsächlich verwendet hast: Ist es eine Aussage über ein
            Element oder ein Element?
          </li>
          <li>
            ☐ Kein <code>p-tag</code> in der Datei trägt <code>(click)</code>, <code>role</code> oder
            <code>tabindex</code>.
          </li>
          <li>
            ☐ Die Bedeutung jedes Tags übersteht Graustufen — der Zustand steht im <code>value</code>, nicht nur in
            <code>severity</code>.
          </li>
          <li>
            ☐ Die verwendete Severity ist eine der fünf, die das Kit für den Dark Mode flickt, oder du hast den Kontrast
            selbst geprüft.
          </li>
          <li>☐ Jedes <code>[image]</code> hat ein echtes <code>alt</code>.</li>
          <li>
            ☐ Entfernbare Chips werden von einem Model + <code>&#64;for</code> gesteuert, und <code>onRemove</code>
            aktualisiert dieses Model.
          </li>
          <li>☐ Der Fokus wird nach einem Entfernen ausdrücklich verschoben.</li>
          <li>☐ Eine Chip-Gruppe hat eine sichtbare Beschriftung und ein „Alle löschen“, wenn sie mehr als drei fassen kann.</li>
          <li>☐ Kein <code>[style]</code>-Objekt malt pro Aufrufstelle einen Chip oder einen Tag neu an.</li>
        </ul>

        <h4>Testen</h4>
        <p>
          Ein Spec im echten Setup des Kits (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>), der die zwei Regeln festnagelt, die am häufigsten zurückfallen —
          ein Tag, der inert bleibt, und ein entfernbarer Chip, dessen Parent die Sammlung besitzt:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Deine Strings</h3>
        <ul>
          <li>
            <strong><code>value</code> und <code>label</code> sind Inhalt.</strong> Binde sie an den
            <code>TranslationService</code> des Kits und baue jede Liste daraus in einem <code>computed()</code>, damit
            ein Sprachwechsel neu rendert — ein schlichtes Feld wird einmal erfasst und friert ein.
          </li>
          <li>
            <strong>Ein Statuswort ist kein Status-Key.</strong> Tags rendern meist ein Enum (<code>draft</code>,
            <code>published</code>); übersetze über eine Key-Map, nie indem du den Enum-Wert großschreibst.
          </li>
          <li>
            <strong>Auch <code>alt</code> ist ein String.</strong> Der Alt-Text eines Avatars ist genauso übersetzbar wie
            das Label daneben.
          </li>
        </ul>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Der eigene String der Bibliothek: „Remove“</h3>
        <p>
          Das Entfernen-Control des Chips benennt sich aus
          <code>config.getTranslation(ARIA).removeLabel</code>, dessen ausgelieferter Standard das englische Literal
          <code>'Remove'</code> ist
          (<code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-config.mjs:229</code>). Nichts, was du an einen
          <code>&lt;p-chip&gt;</code> schreibst, erreicht es — es ist global, und es ist der einzige Bibliotheks-String,
          den eine dieser zwei Komponenten erzeugt. Anders als das fest einprogrammierte Trigger-Label des Selects
          <em>ist</em> dieser hier erreichbar:
        </p>
        <pre class="code-block"><code>{{ primengTranslationSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Speis ihn, oder liefere Englisch aus.</strong> Ein statischer <code>translation</code>-Block in
            <code>provideOptimus</code> deckt eine einsprachige App ab. Dieses Kit wechselt die Sprache zur Laufzeit,
            also hält es das ARIA-Vokabular in seinen eigenen Übersetzungsmodulen und schiebt es bei jedem Wechsel erneut
            in die <code>Optimus</code>-Config — derselbe
            Mechanismus, der die Scroll-Pfeile der Tab-Leiste benennt.
          </li>
          <li>
            <strong>Zusammenführen, nicht ersetzen.</strong> <code>setTranslation</code> führt eine Ebene tief zusammen,
            ein frisches <code>aria</code>-Objekt wirft also jeden Key weg, den du nicht aufgeführt hast. Spreize zuerst
            den aktuellen Block.
          </li>
          <li>
            <strong>Dann prüf es.</strong> Der Name taucht nur im Accessibility Tree auf, eine falsche oder fehlende
            Übersetzung ist auf dem Bildschirm also unsichtbar: Lies den Namen des Entfernen-Buttons dort, in einer
            Sprache, die nicht der Standard ist.
          </li>
        </ul>
        <p class="src-note">
          Gelesen aus dem Standard-Übersetzungsobjekt in <code>openng-optimus-ui-config.mjs</code> und dem Getter
          <code>removeAriaLabel</code> in <code>openng-optimus-ui-chip.mjs</code>.
        </p>

        <h3>Länge: Tags kürzen nicht, sie wachsen</h3>
        <p>
          Keine der beiden Komponenten setzt <code>white-space</code>, <code>overflow</code> oder eine maximale Breite,
          also macht ein langer übersetzter Value die Box breiter und bricht in einer begrenzten Spalte in eine zweite
          Zeile um. {{ M.wrapNote }} Das ist
          freundlicher als die Ellipse des Selects, bedeutet aber:
          <strong>Eine Reihe Tags bricht neu um, wenn die Sprache wechselt</strong>: Deutsche Statuswörter sind 20–40 %
          länger als englische („Veröffentlicht“ gegenüber „Published“), und ein Karten-Header, in den auf Englisch drei
          Tags passen, fasst auf Deutsch zwei.
        </p>
        <ul>
          <li>
            Lass den Container umbrechen (<code>display: flex; flex-wrap: wrap</code>) — nie
            <code>overflow: hidden</code> an einer Tag-Reihe.
          </li>
          <li>Prüf den Karten-Header bei 360px in der längsten Sprache, die du auslieferst, nicht auf Englisch.</li>
          <li>Erzwinge keine Breite an einem Tag; wenn die Reihe einzeilig sein muss, liefere weniger Tags aus.</li>
        </ul>

        <h3>RTL</h3>
        <p>
          Der Chip ist durchgehend in logischen Properties geschrieben —
          <code>padding-inline</code>, <code>padding-block</code>, <code>margin-inline-start</code> am Avatar, und die
          Regel <code>:has(.p-chip-remove-icon)</code> strafft <code>padding-inline-end</code> —, also tauschen Avatar
          und ✕ unter <code>direction: rtl</code> korrekt die Seiten. Der Tag nutzt eine schlichte
          <code>padding</code>-Kurzschreibweise, die ohnehin symmetrisch ist. Nichts hier braucht Arbeit pro Aufrufstelle.
        </p>
        <p class="src-note">
          Gelesen aus den ausgelieferten Regeln in
          <code>&#64;openng/optimus-ui-styles/dist/chip/index.mjs</code> und <code>&#8230;/tag/index.mjs</code>. Nicht
          durch Rendern einer RTL-Locale geprüft — das Kit liefert keine aus.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.9</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Entfernen-Control
            des Chips trägt den einen 2px-Ring des Kits, zitiert aus der Zeile „focus ring“ am Chip in CONTRAST.MD.
          </li>
          <li>
            <strong>v0.8</strong> — 23.09.2026 — Jede Kontrastzeile aus den abgesicherten Zeilen „tag“ und „chip“ von
            CONTRAST.MD zitiert; die Zeilen „per style — measure“ ausgefüllt (diese Farben sind Auras eigene Skala, die
            die Stile nicht ersetzen); der Tag ohne Severity umfasst alle zehn Akzente.
          </li>
          <li>
            <strong>v0.7</strong> — 23.09.2026 — Kontrasttabelle danach aufgeteilt, was die visuellen Stile (ADR-0016) ändern: Die vier
            Zustands-Severities halten in jedem Stil; die Tags ohne Severity, secondary und contrast sowie der Chip
            folgen dem Akzent oder der Flächenskala des Stils und sind mit „measure“ markiert. Tag-Rahmen pro Stil
            vermerkt; Fokus-Ring als <code>&#123;primary.color&#125;</code> angegeben; Aussage zu schmalen Bildschirmen
            ergänzt; Verweiszeile auf das Agent-Doc auf den Standardwortlaut zurückgesetzt; Historie mit dem Neuesten
            zuerst sortiert.
          </li>
          <li>
            <strong>v0.6</strong> — 02.09.2026 — Auf Optimus UI 2.0.2 umgestellt (ADR-0014). Zwei Aussagen aus v22
            gekippt: <code>styleClass</code> ist nicht entfernt — Optimus behält es als <code>&#64;deprecated</code>-Input,
            der weiterhin am Host landet, also hat <code>p-tag</code> wieder fünf Inputs; und es gibt keinen Typ
            <code>TagSeverity</code>, <code>severity</code> ist als <code>BadgeSeverity</code> typisiert (dieselben sechs
            Werte). Die ganze Geometrie steht wieder auf
            Aura 2.x, neu gelesen aus
            <code>&#64;openng/optimus-ui-themes/dist/aura/tag/index.mjs</code> und seinem Chip-Geschwister: Tag 14px/700 bei
            4/8px Padding, Icon 12px; Chip 8/12px Padding, 2rem-Bild, 16px-Entfernen-Control und gar kein
            <code>chip.label</code>-Token
            — also bleiben die Höhenmessungen aus 21 unverändert, und die Lücke zu SC 2.5.8 ist 16×16, nicht 14×14.
            Zeilenverweise gegen die Optimus-Bundles neu hergeleitet (config <code>removeLabel</code> bei :229).
          </li>
          <li>
            <strong>v0.5</strong> — 24.08.2026 — Gegen PrimeNG 22.1.2 / Aura 3.0 neu geprüft:
            <code>styleClass</code> aus <code>p-tag</code> entfernt (jetzt vier Inputs); die Geometrie ist überall
            geschrumpft — Tag 12px/700 bei 2/6px Padding, Chip-Label ein explizites 12px-Token, Entfernen-Control auf
            14×14px verkleinert (noch weiter unter SC 2.5.8); Severity-Union, Tastaturvertrag des Entfernens (nur
            Enter/Backspace), unkontrolliertes <code>close()</code> und das doppelt angesagte Chip-Label in den Quellen
            von 22 alle erneut bestätigt. Die Farbmessungen aus 21 gelten weiter — die Farb-Tokens von Tag und Chip sind
            unverändert.
          </li>
          <li>
            <strong>v0.4</strong> — 20.08.2026 — Zusammenfassung zum Stand WCAG 2.2 im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht
            beansprucht.
          </li>
          <li>
            <strong>v0.3</strong> — 30.07.2026 — Neu geschrieben, um Befunde zu nennen statt zu erzählen, wie sie
            gefunden wurden; Zuordnungen zu Aufrufstellen durch allgemeine Muster ersetzt, und das Kapitel „Remove“ um
            den Übersetzungsmechanismus herum neu geschrieben, der es tatsächlich speist.
          </li>
          <li>
            <strong>v0.2</strong> — 29.07.2026 — Die Dark-Kontrastzahl ohne Severity auf 5,14/6,93/8,38 über die drei
            dunklen Flächen korrigiert und die Verrechnungsregel angegeben; der Tag hat fünf Inputs, nicht sechs.
          </li>
          <li>
            <strong>v0.1</strong> — 29.07.2026 — Erster Guide, als ein Dokument geschrieben, weil die zwei Komponenten als
            Paar falsch gewählt werden: ein Live-Playground für beide, vier Do/Don’t-Paare und eine
            Severity-Kontrasttabelle in beiden Themes.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class TagsAndChipsArticleDeComponent extends TagsAndChipsArticleComponent {
  /** The playground tag's text when no severity is chosen (the severity names stay code). */
  override readonly pgTagValue = computed<string>(() =>
    this.pgSeverity() === 'none' ? 'Hervorgehoben' : this.pgSeverity(),
  );

  override readonly severityRow: TagsAndChipsArticleComponent['severityRow'] = [
    { id: 'none', severity: undefined, label: 'Hervorgehoben', caption: 'ohne severity — Markenpalette' },
    { id: 'secondary', severity: 'secondary', label: 'Entwurf', caption: 'secondary' },
    { id: 'success', severity: 'success', label: 'Veröffentlicht', caption: 'success' },
    { id: 'info', severity: 'info', label: 'Einsteiger', caption: 'info' },
    { id: 'warn', severity: 'warn', label: 'Prüfung fällig', caption: 'warn' },
    { id: 'danger', severity: 'danger', label: 'Defekter Link', caption: 'danger' },
    { id: 'contrast', severity: 'contrast', label: 'Neu', caption: 'contrast' },
  ];

  override readonly M = {
    tagHeight: '27px',
    chipHeight: '37px',
    chipImageHeight: '40px',
    removeIconBox: '16×16px',
    removeSpacingNote:
      'SC 2.5.8 lässt Abstand ein zu kleines Ziel retten, aber nur, wenn ein darauf zentrierter 24px-Kreis nichts ' +
      'anderes überlappt, also verliert eine enge Chip-Reihe auch diese Ausnahme. Miss deine eigenen Abstände.',
    contrastNote:
      'Jede Zeile ist abgesichert: die Zeilen „tag“ und „chip“ von docs/generated/CONTRAST.MD, bei jedem Build ' +
      'neu berechnet. Die Zustands-Severities, secondary, contrast und der Chip lesen feste Aura-Stufen (Auras ' +
      'eigene slate/zinc-Skala — die visuellen Stile ersetzen sie nicht) oder die dunklen Overrides der Stufe 700 ' +
      'des Kits, also gilt eine Zahl in jedem Stil. Der Tag ohne Severity folgt dem Akzent des Lesers: Seine ' +
      'Spanne umfasst zehn Akzente, und im Dark Mode wird die 16-%-Tönung über beide Seitenflächen verrechnet. ' +
      'Achte auf die Einheiten: Der Browser liefert sie als color(srgb … / 0.16), was ein naiver Parser als voll ' +
      'deckend liest und das Verhältnis überschätzt. Zwei Margen im Light Mode sind dünn (warn 4,52, success ' +
      '4,57), ein kleiner Schubs an der Palette bricht sie also.',
    overrideNote:
      'Rechnet man Auras unbehandelte dunkle Tönungen aus den Token-Werten nach (eine 16-%-Mischung der Stufe 500 ' +
      'unter Text der Stufe 300) über dunklen Flächen, ergeben sich Verhältnisse deutlich über 4,5 auf den ' +
      'Flächen, auf denen das geprüft wurde, die genannten 3,9–4,4:1 hängen also von der Fläche ab. Behalte die ' +
      'Regeln trotzdem: Ein deckender Hintergrund ist unabhängig von allem, was dahinter liegt, und das ist für ' +
      'sich schon etwas wert.',
    focusRing:
      '2px solid --primary-color-fg bei 2px Offset in beiden Themes (src/styles.scss). Das Padding von 0.5rem ' +
      'hält den Ring auf dem Chip, also wird er dort gemessen: die Zeile „focus ring“ auf chip.background in ' +
      'docs/generated/CONTRAST.MD, 4,73–16,30:1 über jeden Stil, jeden Modus und jeden Akzent.',
    a11yTag: 'StaticText „Veröffentlicht“ — überhaupt kein Wrapper-Knoten',
    a11yChipHost: 'generic, Name „Ada Lovelace“ — plus ein StaticText „Ada Lovelace“ darin',
    a11yChipHostVerdict:
      'Doppelt angesagt. Laut ARIA 1.2 unterstützt die Rolle generic kein aria-label; Chrome legt es trotzdem ' +
      'offen, also landet das Label sowohl als Name des Containers als auch als sein Text. Halbwegs harmlos, ' +
      'aber es heißt, dass du label nicht als Ort für zusätzlichen Kontext nutzen kannst.',
    a11yRemove: 'button, Name aus Translation.aria.removeLabel (Standard „Remove“)',
    a11yNote:
      'Das Ergebnis für den Tag hängt nicht von der umgebenden Seite ab: Wo immer er rendert, trägt der Host ' +
      'keine Rolle, kein aria-label und keinen tabindex, und der Tree bekommt StaticText und sonst nichts.',
    keyboardNote:
      'Das Verhalten gehört der Komponente selbst, es ist also überall gleich, wo ein entfernbarer Chip auftaucht.',
    focusAfterRemove:
      'Gemessen: Mit fokussiertem Entfernen-Control lässt ein Druck auf Enter document.activeElement auf ' +
      '<body> stehen — der Fokus-Ring verschwindet einfach, und der nächste Tab beginnt wieder oben im ' +
      'Dokument.',
    wrapNote:
      'An beiden gemessen: white-space wird zu normal berechnet und overflow zu visible, ohne max-width.',
  };

  override readonly contrastRows: TagsAndChipsArticleComponent['contrastRows'] = [
    {
      sev: '(keine)',
      lightColors: 'Akzent: {primary.700} auf {primary.100}',
      light: '7,62–16,33',
      lightFail: false,
      darkColors: 'Akzent: {primary.300} auf 16-%-Tönung über ground / card',
      dark: '7,89–13,49',
      darkFail: false,
    },
    {
      sev: 'secondary',
      lightColors: '#475569 auf #f1f5f9',
      light: '6,92',
      lightFail: false,
      darkColors: '#ffffff auf #475569 (Kit)',
      dark: '7,58',
      darkFail: false,
    },
    {
      sev: 'success',
      lightColors: '#15803d auf #dcfce7',
      light: '4,57',
      lightFail: false,
      darkColors: '#ffffff auf #15803d (Kit)',
      dark: '5,02',
      darkFail: false,
    },
    {
      sev: 'info',
      lightColors: '#0369a1 auf #e0f2fe',
      light: '5,17',
      lightFail: false,
      darkColors: '#ffffff auf #0369a1 (Kit)',
      dark: '5,93',
      darkFail: false,
    },
    {
      sev: 'warn',
      lightColors: '#c2410c auf #ffedd5',
      light: '4,52',
      lightFail: false,
      darkColors: '#ffffff auf #c2410c (Kit)',
      dark: '5,18',
      darkFail: false,
    },
    {
      sev: 'danger',
      lightColors: '#b91c1c auf #fee2e2',
      light: '5,30',
      lightFail: false,
      darkColors: '#ffffff auf #b91c1c (Kit)',
      dark: '6,47',
      darkFail: false,
    },
    {
      sev: 'contrast',
      lightColors: '#ffffff auf #020617',
      light: '20,17',
      lightFail: false,
      darkColors: '#09090b auf #ffffff',
      dark: '19,90',
      darkFail: false,
    },
  ];

  override readonly chipContrast = {
    lightColors: '#1e293b auf #f1f5f9',
    light: '13,35 ✓',
    lightFail: false,
    darkColors: '#ffffff auf #27272a',
    dark: '14,89 ✓',
    darkFail: false,
  };

  override readonly keyRows: TagsAndChipsArticleComponent['keyRows'] = [
    {
      key: 'Tab',
      result: 'Erreicht das Entfernen-Control (tabindex="0"); der Chip selbst wird nie fokussiert.',
      expected: 'Ja — ein Button gehört in die Tab-Reihenfolge.',
      fail: false,
    },
    {
      key: 'Enter',
      result: 'Entfernt den Chip. Der Fokus fällt auf <body> zurück.',
      expected: 'Aktiviert. Fokus-Management ist Sache des Autors.',
      fail: false,
    },
    {
      key: 'Space',
      result: 'Nichts passiert — und die Seite scrollt, weil nichts preventDefault aufruft.',
      expected: 'Muss aktivieren. Das ist die eine Taste, die das Pattern verlangt und die die Komponente weglässt.',
      fail: true,
    },
    {
      key: 'Backspace',
      result: 'Entfernt den Chip, genau wie Enter.',
      expected: 'Nicht Teil des Button-Patterns — eine Zugabe, kein Ersatz.',
      fail: false,
    },
    {
      key: 'Delete',
      result: 'Nichts passiert.',
      expected: 'Nicht verlangt, aber die Taste, die die meisten Nutzer nach Backspace probieren.',
      fail: true,
    },
  ];
}
