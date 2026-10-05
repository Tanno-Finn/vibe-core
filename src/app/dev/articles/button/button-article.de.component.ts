import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ButtonArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './button-article.component';

/** German titles and notes of the examples; id and code stay those of the English base. */
const EXAMPLE_TEXT_DE: Record<string, { title: string; note: string }> = {
  variants: {
    title: 'Betonungsstufen',
    note: 'Primär (gefüllt), sekundär (outlined) und Text — ein primärer Button pro Ansicht.',
  },
  icon: {
    title: 'Mit Icon',
    note: 'Stell das Icon voran; setz es nur bei einer Bewegung nach vorn ans Ende (iconPos="right").',
  },
  icononly: {
    title: 'Nur Icon (braucht ariaLabel)',
    note: 'Kein sichtbarer Text, also ist ein ariaLabel Pflicht für den zugänglichen Namen.',
  },
  loading: {
    title: 'Laden & deaktiviert',
    note: 'Klick auf „Speichern“, um einen echten Ladezustand von 2 s zu sehen; Laden blockiert Klicks, Disabled ist inaktiv.',
  },
  sizes: {
    title: 'Größen',
    note: 'Klein, Standard und groß — für den Standard lässt du size weg.',
  },
  fullwidth: {
    title: 'Volle Breite auf Smartphones',
    note: 'btn-mobile-full streckt den Button nur bei ≤640px auf 100%.',
  },
};

/**
 * German twin of the Button guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings (option
 * labels, example titles and notes, the playground label) are German. Keep it in
 * step with the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs button`).
 */
@Component({
  selector: 'app-button-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'button'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Jeder Button unten ist ein echter <code>p-button</code>. Fang im Playground an, um eine Variante einzustellen
          und ihr Markup zu kopieren; die Blöcke darunter stellen jedem gerenderten Control den exakten Code zur Seite.
        </p>

        <!-- Mini playground: live-configure a button and read back the markup. -->
        <section class="pg" aria-label="Button-Playground">
          <div class="pg__grid">
            <fieldset class="pg__controls">
              <legend>Konfigurieren</legend>

              <!-- p-select is named through [ariaLabelledBy], not <label for>: its focusable
                   element is a <span role="combobox">, which a label cannot bind to. The
                   Select guide's naming table covers all three patterns. -->
              <div class="pg__field">
                <span class="pg__label" id="pg-severity-label">Severity</span>
                <p-select
                  [ariaLabelledBy]="'pg-severity-label'"
                  size="small"
                  [options]="severityOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSeverity()"
                  (ngModelChange)="pgSeverity.set($event)"
                />
              </div>

              <div class="pg__field">
                <span class="pg__label" id="pg-variant-label">Variante</span>
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

              <div class="pg__field">
                <span class="pg__label" id="pg-size-label">Size</span>
                <p-select
                  [ariaLabelledBy]="'pg-size-label'"
                  size="small"
                  [options]="sizeOptions"
                  optionLabel="label"
                  optionValue="value"
                  [ngModel]="pgSize()"
                  (ngModelChange)="pgSize.set($event)"
                />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-icon">Icon vorn</label>
                <p-toggleswitch inputId="pg-icon" [ngModel]="pgIcon()" (ngModelChange)="pgIcon.set($event)" />
              </div>

              <div class="pg__field pg__field--switch">
                <label for="pg-disabled">Disabled</label>
                <p-toggleswitch
                  inputId="pg-disabled"
                  [ngModel]="pgDisabled()"
                  (ngModelChange)="pgDisabled.set($event)"
                />
              </div>
            </fieldset>

            <div class="pg__preview">
              <span class="pg__preview-label">Vorschau</span>
              <div class="pg__stage">
                <p-button
                  label="Änderungen speichern"
                  [severity]="pgSeverity()"
                  [outlined]="pgVariant() === 'outlined'"
                  [text]="pgVariant() === 'text'"
                  [size]="pgSizeInput()"
                  [icon]="pgIcon() ? 'pi pi-check' : ''"
                  [disabled]="pgDisabled()"
                />
              </div>
            </div>
          </div>

          <div class="ex__head">
            <span class="pg__code-label">Erzeugtes Markup</span>
            <button type="button" class="copy-btn" (click)="copy('playground', pgCode())">
              {{ copiedId() === 'playground' ? 'Kopiert' : 'Kopieren' }}
            </button>
          </div>
          <pre class="code-block"><code>{{ pgCode() }}</code></pre>
        </section>

        @for (ex of examples; track ex.id) {
          <section class="ex">
            <div class="ex__head">
              <h3 class="ex__title">{{ ex.title }}</h3>
              <button type="button" class="copy-btn" (click)="copy(ex.id, ex.code)">
                {{ copiedId() === ex.id ? 'Kopiert' : 'Kopieren' }}
              </button>
            </div>
            <p class="ex__note">{{ ex.note }}</p>
            <div class="ex__stage">
              @switch (ex.id) {
                @case ('variants') {
                  <p-button label="Speichern" />
                  <p-button label="Abbrechen" severity="secondary" [outlined]="true" />
                  <p-button label="Mehr erfahren" [text]="true" />
                }
                @case ('icon') {
                  <p-button label="Herunterladen" icon="pi pi-download" />
                  <p-button label="Weiter" icon="pi pi-arrow-right" iconPos="right" />
                }
                @case ('icononly') {
                  <p-button
                    icon="pi pi-trash"
                    severity="danger"
                    [rounded]="true"
                    [text]="true"
                    ariaLabel="Zeile löschen"
                  />
                }
                @case ('loading') {
                  <p-button
                    [label]="loadingDemo() ? 'Speichert' : 'Speichern (klick mich)'"
                    [loading]="loadingDemo()"
                    (onClick)="runLoadingDemo()"
                  />
                  <p-button label="Absenden" [disabled]="true" />
                }
                @case ('sizes') {
                  <p-button label="Klein" size="small" />
                  <p-button label="Normal" />
                  <p-button label="Groß" size="large" />
                }
                @case ('fullwidth') {
                  <div class="ex__stack">
                    <p-button label="Volle Breite auf Smartphones" styleClass="btn-mobile-full" />
                  </div>
                }
              }
            </div>
            <pre class="code-block"><code>{{ ex.code }}</code></pre>
          </section>
        }
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Button oder Link?</h3>
        <p>
          Der mit Abstand häufigste Fehler. Ein <strong>Button führt eine Aktion aus</strong> (speichern, löschen, einen
          Dialog öffnen, absenden). Ein <strong>Link navigiert</strong> zu einer anderen Route oder URL. Ist das Ziel ein
          Ort, nimm einen Anker / <code>routerLink</code>, gern als Button gestaltet — nie einen <code>p-button</code> mit
          einem manuellen <code>router.navigate</code> im Click-Handler.
        </p>
        <ul>
          <li><strong>Aktion</strong> → <code>&lt;p-button (onClick)="save()"&gt;</code></li>
          <li>
            <strong>Navigation</strong> → <code>&lt;a routerLink="/learn"&gt;</code> (siehe die als Link gestalteten
            Muster der Komponenten-Galerie)
          </li>
        </ul>

        <h3>Do / Don’t</h3>
        <p class="ex__note">
          Die gerenderten Paare unten sind die drei Fehler, die du dir merken solltest. Das
          <span class="tag tag--bad">Don’t</span> steht links, das <span class="tag tag--good">Do</span>
          rechts.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — zwei konkurrierende primäre Buttons</span>
            <div class="dd__stage">
              <p-button label="Speichern" />
              <p-button label="Veröffentlichen" />
            </div>
            <p class="dd__why">Beide tragen die Markenfüllung, also liest sich keiner als Hauptaktion.</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein primärer, ein unterstützender</span>
            <div class="dd__stage">
              <p-button label="Veröffentlichen" />
              <p-button label="Entwurf speichern" severity="secondary" [outlined]="true" />
            </div>
            <p class="dd__why">Ein einzelner gefüllter Button setzt die Hierarchie; ein Outlined-Button unterstützt ihn.</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Button, der navigiert</span>
            <div class="dd__stage">
              <p-button label="Zum Dev-Hub" icon="pi pi-arrow-right" iconPos="right" />
            </div>
            <p class="dd__why">
              Ein Click-Handler, der <code>router.navigate</code> aufruft, macht Mittelklick, „In neuem Tab öffnen“ und
              „Link kopieren“ kaputt.
            </p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein echter Link, als Button gestaltet</span>
            <div class="dd__stage">
              <!-- A genuinely working link — the example practices what it
                   preaches (middle-click, copy-link, correct role all real). -->
              <a class="link-btn" routerLink="/dev">
                Zum Dev-Hub <i class="pi pi-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
            <p class="dd__why">
              Ein <code>&lt;a routerLink&gt;</code> behält jede Navigationsmöglichkeit und die richtige Rolle.
            </p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — vages Label</span>
            <div class="dd__stage">
              <p-button label="OK" />
              <p-button label="Ja" severity="secondary" [outlined]="true" />
            </div>
            <p class="dd__why">Aus dem Kontext gelesen sagt „OK“ nichts über das Ergebnis.</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — Label mit dem Verb</span>
            <div class="dd__stage">
              <p-button label="Konto löschen" severity="danger" />
              <p-button label="Konto behalten" severity="secondary" [outlined]="true" />
            </div>
            <p class="dd__why">Das Verb nennt das Ergebnis, also ist die Wahl überall lesbar.</p>
          </div>
        </div>

        <h3>Eine primäre Aktion pro Ansicht</h3>
        <p>
          Eine Ansicht sollte genau einen gefüllten primären Button haben — das, was der Nutzer am ehesten tun soll. Alles
          andere ist <code>severity="secondary" [outlined]="true"</code> oder <code>[text]="true"</code>. Zwei
          konkurrierende primäre Buttons heißen, dass sich keiner als primär liest.
        </p>

        <h3>Labels mit dem Verb</h3>
        <p>
          Benenne das Ergebnis, nicht den Mechanismus: <em>Änderungen speichern</em>, <em>Konto löschen</em>,
          <em>Quiz starten</em> — nicht <em>OK</em>, <em>Absenden</em> oder <em>Ja</em>. Satzschreibung, das Verb trägt
          das Label (die Leitlinie des GOV.UK Design System unten; im Deutschen steht es als Infinitiv am Ende). Ein Label,
          das aus dem Kontext gelesen wird — von einem Screenreader oder in einer Liste von Controls —, muss trotzdem sagen,
          was der Button tut.
        </p>

        <h3>Wenn etwas anderes besser passt</h3>
        <ul>
          <li>
            Eine von wenigen sich gegenseitig ausschließenden Optionen direkt auswählen → <code>p-selectbutton</code>,
            keine Reihe von Buttons.
          </li>
          <li>Eine An/Aus-Einstellung, die sofort greift → <code>p-toggleswitch</code>.</li>
          <li>Ein Binärwert in einem Formular, das später abgeschickt wird → eine Checkbox, kein Toggle-Button.</li>
        </ul>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/" target="_blank" rel="noopener noreferrer">
              W3C — WAI-ARIA APG, Button pattern</a
            >
            — der kanonische Tastaturvertrag (Enter / Leertaste) und die Regel für den zugänglichen Namen von
            Icon-only-Buttons.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 4.1.2 Name, Role, Value</a
            >
            — warum jedes Control einen programmatischen Namen braucht; das Rückgrat der
            <code>ariaLabel</code>-Pflicht.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.1.1 Keyboard</a
            >
            — jede Button-Funktion muss per Tastatur bedienbar sein; verankert die Regel „nimm einen echten
            <code>&lt;button&gt;</code>“.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — die Untergrenze von 24×24&nbsp;CSS-px, an der die mobile Volle-Breite-Regel und die Größe der
            Icon-only-Buttons gemessen werden.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — The Button element</a
            >
            — native Semantik (Fokussierbarkeit, Teilnahme an Formularen, Enter/Leertaste), die
            <code>p-button</code> erbt, weil er einen echten <code>&lt;button&gt;</code> rendert.
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled"
              target="_blank"
              rel="noopener noreferrer"
            >
              MDN — aria-disabled</a
            >
            — der Unterschied zwischen nativem <code>disabled</code> (nicht fokussierbar, schwach angesagt) und
            <code>aria-disabled</code> (fokussierbar, auffindbar); Grundlage der Entscheidungstabelle zum Disabled-Muster.
          </li>
          <li>
            <a href="https://design-system.service.gov.uk/components/button/" target="_blank" rel="noopener noreferrer">
              GOV.UK Design System — Button</a
            >
            — eine produktionsreife Primärquelle zu Button-Texten (Satzschreibung, beschreiben die Aktion) und dazu,
            warum deaktivierte Buttons Nutzern schaden.
          </li>
          <li>
            <a href="https://optimus.openng.org/button/" target="_blank" rel="noopener noreferrer">
              Optimus UI — Button component</a
            >
            — die vollständige Input-/Output-/Template-API, die dieser Guide auf die Konventionen des Kits abbildet.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Anatomie</h3>
        <p>
          Ein <code>p-button</code> rendert einen nativen <code>&lt;button class="p-button p-component"&gt;</code> (Root),
          der seine Teile mit <code>display: inline-flex</code> und einem tokengesteuerten Abstand anordnet. Die Teile:
        </p>
        <ul>
          <li>
            <strong>Container</strong> — der <code>.p-button</code>-Root: Hintergrund, Rahmen, Padding, Radius,
            Fokus-Outline.
          </li>
          <li><strong>Label</strong> — <code>.p-button-label</code>, Schriftgewicht 500.</li>
          <li>
            <strong>Icon</strong> — <code>.p-button-icon</code>, platziert über <code>iconPos</code> (left / right / top
            / bottom).
          </li>
          <li>
            <strong>Lade-Icon</strong> — <code>.p-button-loading-icon</code>, ein Spinner, der das vordere Icon ersetzt,
            solange <code>loading</code> true ist.
          </li>
          <li>
            <strong>Badge</strong> — optionales <code>.p-badge</code>-Kind, dimensioniert über
            <code>button.badge.size</code> (1rem), gesteuert vom <code>badge</code>-Input.
          </li>
          <li>
            <strong>Fokus-Ring</strong> — die <code>:focus-visible</code>-Outline (siehe die Zustandstabelle), nie
            entfernt.
          </li>
          <li>
            <strong>Ink</strong> — ein <code>.p-ink</code>-Span, den das eingebaute <code>pRipple</code> anhängt, solange
            die globale <code>ripple</code>-Konfiguration an ist; <code>aria-hidden</code>, siehe Entwicklung → Ripple.
          </li>
        </ul>
        <p class="src-note">
          Anatomie geprüft an <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs</code> und an der Klassen-Map in
          <code>&#64;openng/optimus-ui/fesm2022/openng-optimus-ui-button.mjs</code>.
        </p>

        <h3>Größenskala — echte Token-Werte</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th><code>size="small"</code></th>
                <th>Standard</th>
                <th><code>size="large"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>font-size</td>
                <td>0.875rem (14px)</td>
                <td>1rem (16px) — CSS-Literal, kein Token</td>
                <td>1.125rem (18px)</td>
              </tr>
              <tr>
                <td>padding-block (y)</td>
                <td>0.375rem (6px)</td>
                <td>0.5rem (8px)</td>
                <td>0.625rem (10px)</td>
              </tr>
              <tr>
                <td>padding-inline (x)</td>
                <td>0.625rem (10px)</td>
                <td>0.75rem (12px)</td>
                <td>0.875rem (14px)</td>
              </tr>
              <tr>
                <td>Icon-only-Breite / rounded-Höhe</td>
                <td>2rem (32px)</td>
                <td>2.5rem (40px)</td>
                <td>3rem (48px)</td>
              </tr>
              <tr>
                <td>gap (Icon↔Label)</td>
                <td colspan="3">0.5rem (8px), alle Größen</td>
              </tr>
              <tr>
                <td>border-radius</td>
                <td colspan="3">
                  je visuellem Stil (Aura-Standard 6px; werkbund 0, lernwerkstatt 999px, skizzenbuch handgezeichnet,
                  blaupause 2px); <code>rounded</code>: 2rem
                </td>
              </tr>
              <tr>
                <td>font-weight des Labels</td>
                <td colspan="3">500</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Gemessen am Preset <strong>Aura 2.x</strong>, das
          <code>&#64;openng/optimus-ui-themes</code> 2.0.2 mitliefert (das aktive Preset des Kits, <code>app.config.ts</code>):
          <code>&#64;openng/optimus-ui-themes/dist/aura/button/index.mjs</code> löst
          <code>&#123;form.field.*&#125;</code> gegen <code>&#8230;/aura/base/index.mjs</code> auf (formField paddingX
          0.75rem / paddingY 0.5rem; sm 0.625 / 0.375; lg 0.875 / 0.625; iconOnlyWidth 2.5rem, sm 2rem, lg 3rem).
          <strong>Die Skala von Aura&nbsp;3.0 ist wieder weg</strong> — PrimeNG&nbsp;22 lieferte einen verdichteten Satz
          (Standard-Schriftgröße 14px, Icon-only 28/36/42px); Optimus ist zurück bei den größeren 2.x-Werten, also passt
          ein Screenshot aus der 22er-Zeit nicht mehr. Es gibt <strong>kein <code>button.font.size</code>-Token</strong>:
          Die Root-Schriftgröße ist ein <code>1rem</code>-Literal in
          <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs:14</code>, und nur
          <code>sm</code>/<code>lg</code> tragen Schriftgrößen-Token. Text-Buttons haben keine feste Höhe — die Höhe ist
          Inhalt + Padding; nur Icon-only-Buttons fixieren die Breite (und, mit <code>rounded</code>, die Höhe) auf das
          Icon-only-Token. Der Radius ist der eine Geometriewert, der sich bewegt: Jeder visuelle Stil setzt
          <code>button.root.borderRadius</code> über seine <code>presetOverrides</code> in
          <code>src/app/services/ui-styles.ts</code>.
        </p>

        <h3>Interaktionszustände — die Ebenen</h3>
        <p>
          Ein gefüllter primärer Button wird von übereinandergestapelten Quellen gestaltet. Die <em>Aura-Token-Ebene</em>
          ist das, was Optimus mitliefert; die Spalte <em>Kit-Rendering</em> ist das, was du tatsächlich siehst, denn der
          <code>ThemeService</code> des Kits schreibt einen statischen <code>!important</code>-Block darüber, der nur
          Token liest (deshalb zeigen die Live-Beispiele oben einen Verlauf statt einer flachen Füllung), und der
          <code>html.style-&lt;name&gt;</code>-Block des aktiven visuellen Stils in <code>styles.scss</code> ergänzt
          Outline, Schrift und gedrückten Zustand.
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Zustand</th>
                <th>Aura-Token-Ebene</th>
                <th>Was dieses Kit tatsächlich rendert</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Grundfüllung</td>
                <td>flach <code>&#123;primary.color&#125;</code>, 1px-Rahmen</td>
                <td>
                  <code>background: linear-gradient(135deg, primary → accent) !important</code>;
                  <code>border: var(--button-border, none) !important</code> — jeder visuelle Stil setzt seine eigene
                  Tintenkante (werkbund: 3px im hellen Modus, 2px im dunklen)
                </td>
              </tr>
              <tr>
                <td>Hover</td>
                <td>Farbe springt eine Stufe weiter (<code>&#123;primary.hover.color&#125;</code>)</td>
                <td>
                  Verschiebung der Verlaufs-<code>background-position</code> + <code>filter: var(--primary-hover-filter)</code>,
                  eine je Akzent und Modus berechnete Helligkeit, damit das Label 4,5:1 hält;
                  <code>transition: background-position 0.4s, filter 0.3s</code>
                </td>
              </tr>
              <tr>
                <td>aktiv</td>
                <td>Farbe springt eine zweite Stufe weiter (<code>&#123;primary.active.color&#125;</code>)</td>
                <td>
                  keine Farbstufe; werkbund, lernwerkstatt und skizzenbuch drücken den Button ein
                  (<code>:enabled:active</code> <code>transform: translate(…)</code>), blaupause tut nichts
                </td>
              </tr>
              <tr>
                <td>focus-visible</td>
                <td>
                  <strong>1px solid</strong> <code>&#123;primary.color&#125;</code>, <strong>Offset 2px</strong>,
                  box-shadow none
                </td>
                <td>
                  der <strong>eine Kit-Ring</strong>: <strong>2px solid</strong> <code>--primary-color-fg</code> (der
                  kontrastangepasste Akzent), <strong>Offset 2px</strong>, <code>!important</code> — derselbe Ring wie
                  bei Feldern, Radios und Segmenten (siehe Hinweis)
                </td>
              </tr>
              <tr>
                <td>deaktiviert</td>
                <td colspan="2">
                  <code>opacity: 0.6</code> (<code>--p-disabled-opacity</code>) + <code>cursor: default</code>; kein
                  Hover/Active. In beiden Ebenen gleich.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Spalte Kit-Rendering ist gelesen aus dem statischen <code>&lt;style id="button-gradient-styles"&gt;</code>,
          das <code>ThemeService.applyButtonGradientStyles()</code> einmal schreibt (seine Werte sind Token, die
          <code>buildTokenMaps</code> je Stil, Akzent und Modus setzt), und aus den
          <code>html.style-&lt;name&gt;</code>-Button-Regeln in <code>styles.scss</code>. Die Aura-Token-Ebene stammt aus
          <code>&#8230;/aura/button/index.mjs</code> + dem Basis-<code>focusRing</code> (1px / solid / 2px).
          <strong>Fokus-Ring:</strong> <code>.p-button:focus-visible</code> ist ein Selektor der einen Ring-Regel des Kits
          in <code>styles.scss</code>, die den 1px-Ring <code>&#123;primary.color&#125;</code> des Presets
          mit <code>!important</code> schlägt; <code>--primary-color-fg</code> ist der Akzent-Vordergrund, den
          <code>ThemeService</code> je Theme lesbar hält. Gemessen in <code>docs/generated/CONTRAST.MD</code>,
          Zeile <code>focus ring</code> (Seitenflächen und das Dialog-Panel, ≥&nbsp;3,88:1). Die Disabled-Opacity von 0.6
          ist die globale Regel in
          <code>&#64;openng/optimus-ui-styles/dist/base/index.mjs</code>.
        </p>

        <h3>Hierarchie der Betonung &amp; die Akzent-Ebene</h3>
        <p>
          Die Markenfarbe des Kits ist ein Design-Token, kein fester Wert: <code>--primary-color*</code> wird zur Laufzeit
          von <code>ThemeService</code> aus dem gewählten Akzent (sunset, ocean, forest, …) und dem Modus gesetzt; das
          <code>#f59e0b</code> in <code>styles.scss</code> ist nur der <em>Fallback</em> vor dem JavaScript. Die Betonung
          kommt aus drei Stufen:
        </p>
        <ul>
          <li>
            <strong>Primär</strong> — der standardmäßig gefüllte <code>p-button</code>, reserviert für die eine primäre
            Aktion. Beachte: Die Füllung ist ein <strong>Verlauf</strong> (primary → accent), erzwungen von
            <code>ThemeService.applyButtonGradientStyles()</code> mit <code>!important</code>, nicht die flache Aura-Füllung.
          </li>
          <li>
            <strong>Sekundär</strong> — <code>severity="secondary" [outlined]="true"</code>: ein Card-Hintergrund, Label und
            2px-Rahmen in <code>--outlined-secondary-fg</code> (eine Tinte, die jeder Stil ableitet, um 4,5:1 auf der Card
            zu halten); werkbund, lernwerkstatt und skizzenbuch zeichnen ihre eigene Outline über diesen Rahmen. Ein
            schlichtes <code>[outlined]="true"</code> (ohne Severity) nimmt die Outline des Stils
            (<code>--style-btn-outlined-border</code>) und <code>--text-color</code> für sein Label.
          </li>
          <li>
            <strong>Text</strong> — <code>[text]="true"</code>. Weder Füllung noch Rahmen, für Aktionen mit wenig Gewicht
            oder tertiäre Aktionen (z. B. „Mehr erfahren“). Das Label ist bei primary die 500er-Stufe des Akzents; die
            anderen Severities nehmen die semantischen Tinten des Kits (<code>--semantic-&lt;hue&gt;-fg</code>), secondary
            nimmt <code>--text-color-secondary</code>, contrast und der schlichte Button <code>--text-color</code> — in
            beiden Modi, ohne Füllung: Ein Text-Severity-Button im Dunkelmodus bleibt transparent (die alten
            <code>--p-button-&lt;severity&gt;-*</code>-Blöcke, die ihn als gefüllte Scheibe malten, sind weg).
          </li>
        </ul>
        <p>
          Semantische Varianten (<code>severity="success"</code>, <code>"danger"</code>) tragen Bedeutung, keine
          Dekoration — nimm <code>danger</code> nur für destruktive Aktionen. Das Kit malt auch sie: gefüllte Severities
          aus <code>--gradient-&lt;severity&gt;-from/-to/-text</code>, Outlined-Varianten aus
          <code>--outlined-&lt;severity&gt;-fg</code>, beide je visuellem Stil gesetzt; im Dunkelmodus liefern die
          <code>presetOverrides</code> jedes Stils zusätzlich ein eigenes Schema für gefüllte Severities, das der
          Verlaufsblock übermalt.
        </p>

        <h3>Icon-Platzierung &amp; Mobilgeräte</h3>
        <p>
          Führ bei den meisten Aktionen mit dem Icon (<code>icon="pi pi-download"</code>); setz es nur bei einer Bewegung
          „vorwärts / weiter“ an die hintere Kante (<code>iconPos="right"</code>). <strong>Schmale Bildschirme:</strong>
          Ein Button hat kein eigenes responsives Verhalten — er behält in jedem Viewport seine Inhaltsbreite, und eine
          Reihe von Buttons braucht einen umbrechenden Container (<code>flex-wrap: wrap</code>). Auf Smartphones
          (≤&nbsp;640px) gib einem primären Button, der gut erreichbar sein muss, volle Breite über die globale Utility
          <code>styleClass="btn-mobile-full"</code> (definiert in <code>styles.scss</code>; oberhalb des Breakpoints
          wirkungslos), damit das Touch-Ziel die 24px-Untergrenze von WCAG 2.5.8 bequem überschreitet.
        </p>

        <h3>WCAG-2.2-Status</h3>
        <p>
          Die Zusammenfassung dessen, was dieser Guide misst — ein Kriterium, das hier nicht gemessen wird, wird nicht
          beansprucht. <strong>Erfüllt:</strong> SC 4.1.2 (ein nativer <code>&lt;button&gt;</code>, benannt durch sein
          sichtbares Label oder durch <code>ariaLabel</code>), SC 2.1.1 mit dem nativen Tastaturmodell des Buttons — Tab,
          um ihn zu erreichen, Enter beim Drücken, Leertaste beim Loslassen —, SC 2.4.7 und SC 1.4.11 mit dem 2px-Ring
          <code>--primary-color-fg</code> des Kits bei 2px Abstand, und SC 1.4.3 für die Label-Paare, die das
          Kontrast-Gate berechnet (siehe unten). <strong>Nicht erfüllt:</strong> keines der gemessenen Kriterien.
          <strong>Bedingt:</strong> SC 2.5.8 — nur Icon-only-Buttons fixieren eine Größe (32px small, 40px Standard, 48px
          large mit den Aura-2.x-Token, die Optimus mitliefert — der Satz von PrimeNG 22 / Aura 3.0 war mit 28/36/42px
          eine Stufe kleiner); ein Text-Button hat gar keine feste Höhe, also ist sein Ziel Inhalt plus Padding, und auf
          Smartphones ist die mobile Volle-Breite-Utility der dokumentierte Weg zu einem bequemen Ziel.
          <strong>AAA</strong> wird für diese Komponente nicht bewertet.
        </p>
        <p class="src-note">
          Label-Kontrast aus <code>docs/generated/CONTRAST.MD</code>, Zeilen <code>filled button</code>,
          <code>filled button (hover)</code>, <code>severity button</code>, <code>outlined severity</code>,
          <code>text &amp; link button</code> und <code>filled button (contrast)</code>: Jedes Paar aus Stil × Akzent ×
          Modus erreicht 4,5:1 — niedrigster gefüllter Wert 4,73:1 (sunset, Hover, heller Modus), niedrigster Text-Button
          4,60:1, niedrigster Wert insgesamt 4,52:1 (lernwerkstatt danger, Hover). Der Ring: Zeile <code>focus ring</code>,
          3,88–17,85:1 auf den Seitenflächen und dem Dialog-Panel.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Import</h3>
        <pre class="code-block"><code>{{ devImport }}</code></pre>
        <p>
          <code>ButtonModule</code> stellt die Komponente <code>&lt;p-button&gt;</code> und die Directive
          <code>pButton</code> bereit. Nimm die <strong>Komponente</strong> für eigenständige Aktionen (sie kümmert sich um
          Label, Icon, Laden, Größe); nimm die <strong>Directive</strong> auf einem nativen <code>&lt;button&gt;</code>,
          wenn du volle Kontrolle über das Element brauchst (z. B. den Submit-Button eines Formulars oder einen
          Zurück-Button in einer Toolbar).
        </p>
        <p>
          <strong>Deprecated, nicht entfernt:</strong> PrimeNG&nbsp;22 hat <code>label</code> und <code>icon</code> aus
          der Directive gestrichen; Optimus behält sie als funktionierende Setter, markiert mit <code>&#64;deprecated</code>
          (<code>openng-optimus-ui-button.d.ts:227,234</code>), also kompilieren alte Bindings weiter und stempeln
          weiterhin die Spans (<code>createLabel</code>/<code>createIcon</code>, <code>:490</code>/<code>:498</code>).
          Nimm trotzdem die Kind-Form, markiert mit den Directives <code>pButtonIcon</code> / <code>pButtonLabel</code>
          (sie stempeln <code>.p-button-icon</code> / <code>.p-button-label</code>, die die Regeln zur Icon-Reihenfolge
          und das Label-Gewicht 500 tragen; bloßer Text rendert ungestylt). <code>iconPos</code> ist ein aktiver, nicht
          deprecated Directive-Input. Die Directive trägt außerdem
          <code>severity</code>/<code>outlined</code>/<code>text</code>/<code>plain</code>/<code>size</code>/
          <code>rounded</code>/<code>raised</code>/<code>loadingIcon</code>/
          <code>fluid</code>/<code>loading</code> — aber <strong>nicht</strong> <code>variant</code> oder <code>link</code>,
          die es nur an der Komponente gibt; zum Deaktivieren nimm das native <code>disabled</code>-Attribut
          (<code>openng-optimus-ui-button.mjs</code>: Directive <code>:222</code>, deklarierte Inputs <code>:546</code>;
          <code>pButtonIcon</code> <code>:164</code>, <code>pButtonLabel</code> <code>:110</code>).
        </p>
        <pre class="code-block"><code>{{ directiveSnippet }}</code></pre>

        <h3>Zentrale Inputs</h3>
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
                <td><code>label</code></td>
                <td>string</td>
                <td>Sichtbarer Text — binde einen i18n-Wert, nie einen fest codierten String.</td>
              </tr>
              <tr>
                <td><code>icon</code></td>
                <td>string</td>
                <td>PrimeIcons-Klasse, z. B. <code>pi pi-download</code>.</td>
              </tr>
              <tr>
                <td><code>iconPos</code></td>
                <td>'left' | 'right' | 'top' | 'bottom'</td>
                <td>Seite des Icons; Standard left. Physisch, nicht logisch — siehe den Tab Internationalisierung (i18n) zu RTL.</td>
              </tr>
              <tr>
                <td><code>severity</code></td>
                <td>ButtonSeverity</td>
                <td>
                  <code>secondary</code>, <code>success</code>, <code>info</code>, <code>warn</code>,
                  <code>danger</code>, <code>help</code>, <code>contrast</code> (oder für primary weglassen).
                </td>
              </tr>
              <tr>
                <td><code>variant</code></td>
                <td>'outlined' | 'text'</td>
                <td>
                  Alternative zu den Booleans <code>[outlined]</code>/<code>[text]</code>. PrimeNG&nbsp;22 hatte
                  <code>'link'</code> in der Union; Optimus nicht — nimm das Boolean <code>[link]</code>. Nur an der
                  Komponente, nicht an der Directive.
                </td>
              </tr>
              <tr>
                <td><code>outlined</code></td>
                <td>boolean</td>
                <td>Mit Rahmen, ohne Füllung — der übliche sekundäre Look.</td>
              </tr>
              <tr>
                <td><code>text</code></td>
                <td>boolean</td>
                <td>Weder Füllung noch Rahmen — tertiäre Aktionen.</td>
              </tr>
              <tr>
                <td><code>raised</code></td>
                <td>boolean</td>
                <td>
                  Fügt einen Höhenschatten hinzu (<code>button.raised.shadow</code>). Hier stilabhängig: werkbund entfernt
                  Schatten, lernwerkstatt und skizzenbuch ersetzen sie durch eigene.
                </td>
              </tr>
              <tr>
                <td><code>rounded</code></td>
                <td>boolean</td>
                <td>Pillen-Radius (2rem); ein Kreis bei Icon-only.</td>
              </tr>
              <tr>
                <td><code>link</code></td>
                <td>boolean</td>
                <td>Rendert im Stil eines Inline-Links (bleibt ein <code>&lt;button&gt;</code>).</td>
              </tr>
              <tr>
                <td><code>loading</code></td>
                <td>boolean</td>
                <td>Zeigt einen Spinner und blockiert Klicks, solange true.</td>
              </tr>
              <tr>
                <td><code>disabled</code></td>
                <td>boolean</td>
                <td>Nicht interaktiv; halt es ehrlich (siehe das Disabled-Muster unten).</td>
              </tr>
              <tr>
                <td><code>size</code></td>
                <td>'small' | 'large'</td>
                <td>Für die Standardgröße weglassen.</td>
              </tr>
              <tr>
                <td><code>fluid</code></td>
                <td>boolean</td>
                <td>Nimmt 100% der Containerbreite ein (oder erbt sie von einem <code>p-fluid</code>-Vorfahren).</td>
              </tr>
              <tr>
                <td><code>badge</code></td>
                <td>string</td>
                <td>Rendert ein <code>p-badge</code>-Kind (z. B. eine Anzahl).</td>
              </tr>
              <tr>
                <td><code>badgeSeverity</code></td>
                <td>'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast'</td>
                <td>Farbe dieses Badges (Standard secondary).</td>
              </tr>
              <tr>
                <td><code>ariaLabel</code></td>
                <td>string</td>
                <td>Zugänglicher Name — PFLICHT bei Icon-only-Buttons.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Inputs geprüft an <code>&#64;openng/optimus-ui/types/openng-optimus-ui-button.d.ts</code> (Optimus UI
          2.0.2). Diese Tabelle ist die der <strong>Komponente</strong>; die Teilmenge der Directive steht oben. Die Inputs
          der Komponente sind <strong>schlichte Properties</strong>, keine Signal-Inputs — PrimeNG&nbsp;22 hatte sie zu
          <code>InputSignal</code> umgebaut, Optimus ist zurück bei der v21-Form (<code>isSignal: false</code> in der
          ganzen Input-Map von <code>ɵcmp</code>, <code>openng-optimus-ui-button.mjs:832</code>). Die eine Ausnahme ist
          <code>fluid</code>, ein <code>InputSignalWithTransform</code>. Ein Lesen im Code ist daher ein Property-Zugriff
          (<code>btn.label</code>), kein Aufruf. <code>buttonProps</code> (Objekt zum gesammelten Setzen) gibt es an
          Komponente und Directive, an Letzterer als <code>&#64;deprecated</code>; einen <code>iconOnly</code>-Input gibt
          es nicht — Icon-only wird aus dem Fehlen eines Labels abgeleitet. Unions: <code>variant = 'outlined' | 'text'</code>;
          <code
            >ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' |
            'contrast'</code
          >
          (nullable) (<code>openng-optimus-ui-types-button.d.ts:126</code>).
        </p>

        <h3>Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Output</th>
                <th>Payload</th>
                <th>Wann</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>onClick</code></td>
                <td><code>EventEmitter&lt;MouseEvent&gt;</code></td>
                <td>
                  Der Button wird geklickt (nimm das an <code>&lt;p-button&gt;</code>; an einem nativen
                  <code>&lt;button pButton&gt;</code> nimm schlichtes <code>(click)</code>).
                </td>
              </tr>
              <tr>
                <td><code>onFocus</code></td>
                <td><code>EventEmitter&lt;FocusEvent&gt;</code></td>
                <td>Der Button bekommt den Fokus.</td>
              </tr>
              <tr>
                <td><code>onBlur</code></td>
                <td><code>EventEmitter&lt;FocusEvent&gt;</code></td>
                <td>Der Button verliert den Fokus.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Exakte Event-Typen aus der Klasse <code>Button</code> in <code>&#64;openng/optimus-ui/types/openng-optimus-ui-button.d.ts</code> —
          wieder schlichte <code>EventEmitter</code> (<code>new EventEmitter()</code> bei
          <code>openng-optimus-ui-button.mjs:746</code>, <code>:753</code>, <code>:760</code>). PrimeNG&nbsp;22 hatte
          sie auf <code>output()</code>-basierte <code>OutputEmitterRef</code>s umgestellt; Optimus behält die v21-Form,
          also stehen die Emitter auf einem RxJS-<code>Subject</code>, und <code>.pipe()</code> / die
          <code>async</code>-Pipe funktionieren wieder. Die Syntax der Handler im Template ist in beiden Fällen gleich.
        </p>

        <h3>Template-Slots</h3>
        <p>
          Für Inhalt, den die Inputs nicht ausdrücken können, projiziere eine
          <strong>benannte Template-Referenz</strong> (<code>#content</code>, <code>#icon</code>,
          <code>#loadingicon</code>). PrimeNG&nbsp;22 hatte den alten <code>pTemplate</code>-Weg gestrichen;
          <strong>Optimus behält ihn</strong> — eine <code>&#64;ContentChildren(PrimeTemplate)</code>-Query speist einen
          Switch in <code>onAfterContentInit</code> auf <code>'content'</code>/<code>'icon'</code>/<code>'loadingicon'</code>
          (<code>openng-optimus-ui-button.mjs:787-802</code>), und jeder Slot wird als
          <code>xTemplate || _xTemplate</code> gerendert. Nimm lieber die <code>#</code>-Ref-Form; <code>pTemplate</code>
          ist der Fallback, der weiterhin bindet:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Slot</th>
                <th>Ersetzt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>#content</code></td>
                <td>Den ganzen Button-Inhalt (das Layout von Icon + Label liegt bei dir).</td>
              </tr>
              <tr>
                <td><code>#icon</code></td>
                <td>Nur das Icon (z. B. ein Inline-SVG statt eines PrimeIcons).</td>
              </tr>
              <tr>
                <td><code>#loadingicon</code></td>
                <td>Den Spinner, der angezeigt wird, solange <code>loading</code> true ist.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre class="code-block"><code>{{ slotSnippet }}</code></pre>
        <p class="src-note">
          Slots geprüft an den Content-Queries von <code>Button</code> in
          <code>&#64;openng/optimus-ui/types/openng-optimus-ui-button.d.ts</code> (<code>contentTemplate</code>, <code>iconTemplate</code>,
          <code>loadingIconTemplate</code> — <code>&#64;ContentChild</code>-Queries per Decorator, keine Signal-Queries,
          auf den Prädikaten <code>#content</code>/<code>#icon</code>/<code>#loadingicon</code>, <code>:449-459</code>,
          neben der <code>&#64;ContentChildren(PrimeTemplate)</code>-Query bei <code>:460</code>).
        </p>

        <h3>Theming mit CSS Custom Properties</h3>
        <p>
          Jedes Button-Token ist als Custom Property <code>--p-button-*</code> verfügbar, also kannst du ein Detail über
          eine gescopte Klasse umgestalten. <strong>Vorbehalt für dieses Kit:</strong> Die Verlaufsebene des
          <code>ThemeService</code> erzwingt <code>background</code>, <code>border</code> und Text-<code>color</code> des
          gefüllten Buttons mit <code>!important</code> — diese <em>Farb</em>-Properties gewinnen gegen jeden
          <code>--p-button-*</code>-Override, also färbst du gefüllte Buttons über die Token um, nicht hier. Padding, Gap
          und Größe gehen durch; der Radius nur dort, wo der Block des aktiven Stils ihn nicht festnagelt:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Custom Property</th>
                <th>Steuert</th>
                <th>Gewinnt in diesem Kit?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--p-button-border-radius</code></td>
                <td>Eckenradius (je Stil; Aura-Standard 6px).</td>
                <td>
                  Nicht unter werkbund — dessen Stilblock setzt <code>border-radius: 0</code> auf jeden Nicht-Text-Button;
                  sonst ja
                </td>
              </tr>
              <tr>
                <td><code>--p-button-padding-x</code> / <code>--p-button-padding-y</code></td>
                <td>Padding der Standardgröße.</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-button-gap</code></td>
                <td>Abstand Icon↔Label (0.5rem).</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-button-icon-only-width</code></td>
                <td>Quadratgröße bei Icon-only (2.5rem mit den Aura-2.x-Token, die Optimus mitliefert).</td>
                <td>Ja</td>
              </tr>
              <tr>
                <td><code>--p-button-primary-background</code></td>
                <td>Füllung des gefüllten Buttons.</td>
                <td>Nein — geschlagen vom eingefügten <code>!important</code>-Verlauf</td>
              </tr>
              <tr>
                <td><code>--p-button-primary-focus-ring-color</code></td>
                <td>Farbe der Fokus-Outline.</td>
                <td>
                  Nein — die eine Fokus-Ring-Regel des Kits (<code>--primary-color-fg</code>, <code>!important</code>)
                  zeichnet darüber
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Ein Geometrie-Override, der wirklich greift (keine fest codierten Farben, übersteht einen Preset-Wechsel):</p>
        <pre class="code-block"><code>{{ themingSnippet }}</code></pre>
        <p class="src-note">
          Die Property-Namen folgen dem Präfix <code>p</code>, gesetzt in <code>app.config.ts</code> (<code
            >provideOptimus(&#123; theme: &#123; options: &#123; prefix: 'p' &#125; &#125; &#125;)</code
          >). Der Vorbehalt zu Farb-Overrides ist die eingefügte Regel für gefüllte Buttons (<code
            >background/border/color … !important</code
          >). Um gefüllte Buttons downstream umzugestalten, ändere die Token, die diese Ebene liest — den Eintrag eines
          Stils in <code>src/app/services/ui-styles.ts</code> (<code>--button-border</code>, die Severity-Füllungen,
          <code>presetOverrides.components.button</code>) —, statt mit <code>--p-button-*</code> dagegen anzukämpfen; der
          Block <code>applyButtonGradientStyles()</code> selbst ist statisch und wird einmal geschrieben.
        </p>

        <h3>Ripple (<code>pRipple</code>)</h3>
        <p>
          Der Tinteneffekt beim Drücken ist eine eigene Directive, <code>pRipple</code> aus <code>RippleModule</code>
          (<code>&#64;openng/optimus-ui/ripple</code>; die Standalone-Klasse ist <code>Ripple</code>, ohne Inputs, ohne
          Outputs). <code>&lt;p-button&gt;</code> trägt sie bereits auf seinem inneren Button
          (<code>openng-optimus-ui-button.mjs:842</code>); die Directive <code>pButton</code> nicht, also schreibt ein
          nativer Button, der passen soll, <code>pRipple</code> neben <code>pButton</code> — der Aktions-Button des Toasts
          in <code>toast-container.component.ts</code> ist die Referenz.
        </p>
        <pre class="code-block"><code>{{ rippleSnippet }}</code></pre>
        <ul>
          <li>
            <strong>Globaler Schalter.</strong> Nichts rendert, solange die App-Konfiguration ihn nicht einschaltet:
            <code>ripple</code> steht standardmäßig auf <code>false</code> (<code>openng-optimus-ui-config.mjs:78</code>),
            und das Kit setzt <code>ripple: true</code> in <code>provideOptimus</code> (<code>app.config.ts</code>). Die
            Directive beobachtet dieses Signal und fügt ihre Tinte live hinzu oder entfernt sie
            (<code>openng-optimus-ui-ripple.mjs:72-84</code>).
          </li>
          <li>
            <strong>Nur Zeiger.</strong> Sie hört auf <code>mousedown</code> (<code>:77</code>), also zeigt eine
            Aktivierung per Tastatur keine Tinte. Der Ripple ist nie das einzige Feedback — das sind der Fokus-Ring und das
            Ergebnis der Aktion.
          </li>
          <li>
            <strong>Vor assistiven Technologien verborgen.</strong> Die Tinte ist ein
            <code>&lt;span class="p-ink" aria-hidden="true" role="presentation"&gt;</code>, angehängt an den Host
            (<code>:138-144</code>); sie trägt nichts zum zugänglichen Namen bei.
          </li>
          <li>
            <strong>Nebenwirkung am Host.</strong> Der Host bekommt <code>.p-ripple</code> =
            <code>position: relative; overflow: hidden</code> (<code>:13-16</code>), was alles abschneidet, was außerhalb
            positioniert ist — setz <code>pRipple</code> nicht auf ein Element, dessen Kinder überstehen müssen.
          </li>
          <li>
            <strong>Bewegung.</strong> Ein Skalieren-und-Ausblenden über 0.4s (<code>&#64;openng/optimus-ui-styles/dist/ripple/index.mjs</code>)
            in <code>ripple.background</code>, <code>rgba(0,0,0,0.1)</code> hell und <code>rgba(255,255,255,0.3)</code>
            dunkel (<code>&#8230;/aura/ripple/index.mjs</code>). Unter <code>prefers-reduced-motion: reduce</code> kürzt der
            globale Catch-all oben in <code>styles.scss</code> jede Animation auf 0.01ms, also erscheint die Tinte nicht;
            eine Regel je Komponente ist nicht nötig.
          </li>
        </ul>

        <h3>Formulare &amp; i18n</h3>
        <p>
          Für das Submit-Control eines Formulars nimm lieber die Directive auf einem echten Submit-Button, damit die native
          Formular-Semantik hält:
          <code>&lt;button pButton type="submit"&gt;&lt;span pButtonLabel&gt;… &lt;/span&gt;&lt;/button&gt;</code> (in
          Optimus gibt es den <code>label</code>-Input der Directive noch, aber er ist <code>&#64;deprecated</code> — siehe
          den Hinweis oben). Speis das Label immer aus einem
          Übersetzungsschlüssel, aufgelöst über den <code>TranslationService</code> des Kits (typischerweise eine
          <code>computed()</code>-Label-Map in der Komponente) — nie aus einem fest codierten String —, damit der Button
          mit allem anderen lokalisiert wird.
        </p>

        <!-- ============ QUALITY / ACCESSIBILITY ============ -->
        <h3>Barrierefreiheit</h3>
        <ul>
          <li>
            <strong>Zugänglicher Name</strong> — jeder Button hat sichtbaren Text ODER ein <code>ariaLabel</code>. Ein
            Icon-only-Button ohne beides ist für einen Screenreader unbrauchbar (WCAG 4.1.2).
          </li>
          <li>
            <strong>Echtes Button-Element</strong> — <code>p-button</code> / <code>pButton</code> rendern einen nativen
            <code>&lt;button&gt;</code>. Häng nie einen Klick an ein <code>&lt;div&gt;</code> oder <code>&lt;span&gt;</code>:
            kein Fokus, kein Enter/Leertaste, keine Rolle.
          </li>
          <li>
            <strong>Sichtbarer Fokus</strong> — entferne den Fokus-Ring nicht; das Kit zeichnet eine 2px-Outline
            <code>--primary-color-fg</code> bei <code>:focus-visible</code> mit 2px Abstand, per Gate ≥&nbsp;3:1.
          </li>
          <li>
            <strong>Kontrast</strong> — die Button-Token des Kits werden vom Kontrast-Gate auf 4,5:1 gehalten (Tab Design →
            WCAG-Status); überschreib sie nicht mit Ad-hoc-Farben, die das Label darunter drücken.
          </li>
        </ul>

        <h4>Tastatur</h4>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Taste</th>
                <th>Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd></td>
                <td>Bewegt den Fokus hinein/hinaus, in DOM-Reihenfolge. Ein nativ <code>disabled</code> Button wird ganz übersprungen.</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd></td>
                <td>Löst beim Drücken der Taste aus.</td>
              </tr>
              <tr>
                <td><kbd>Space</kbd></td>
                <td>Löst beim Loslassen der Taste aus (natives Button-Verhalten).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Nach dem Button-Pattern der W3C APG und der nativen Semantik von <code>&lt;button&gt;</code> (verlinkt unter
          Quellen).
        </p>

        <h4>Zustandssemantik: gedrückt vs. Popup</h4>
        <ul>
          <li>
            <strong>Toggle-Button</strong> (ein Button, der „an“ bleibt) → <code>aria-pressed="true|false"</code>. Nimm das
            nur für ein echtes An/Aus-Control, das als Button gerendert wird; für einen Einstellungs-Toggle nimm lieber
            <code>p-toggleswitch</code>.
          </li>
          <li>
            <strong>Auslöser für Menü / Dialog</strong> → <code>aria-haspopup="menu"</code> (oder <code>"dialog"</code>)
            plus <code>aria-expanded</code>, das den Offen-Zustand spiegelt.
          </li>
          <li>Setz nie beides auf denselben Button — sie beschreiben verschiedene Widgets.</li>
        </ul>

        <h4>Zugängliches Deaktivieren: bewusst wählen</h4>
        <p>
          Ein ausgegrauter <code>disabled</code>-Button ist oft eine Usability-Falle: Er ist nicht fokussierbar, also
          können Screenreader- und Tastaturnutzer ihn nicht erreichen, um herauszufinden, <em>warum</em> er aus ist, und
          der Grund ist meist unsichtbar. Entscheide je Fall:
        </p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Situation</th>
                <th>Muster</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Formular unvollständig, könnte aber gültig werden</td>
                <td>
                  Lass den Button <strong>aktiv</strong>; beim Klick validieren und den Fokus auf den ersten Fehler setzen.
                  <em>Oder</em> nimm <code>aria-disabled="true"</code> (fokussierbar) mit einem sichtbaren Grund, und führ
                  die Aktion nicht aus.
                </td>
              </tr>
              <tr>
                <td>Aktion in diesem Kontext dauerhaft unmöglich</td>
                <td>Lass den Button ganz <strong>weg</strong> — zeig kein Control, das nie funktionieren kann.</td>
              </tr>
              <tr>
                <td>Wirklich inaktiv, und der Grund ist auf dem Bildschirm schon offensichtlich</td>
                <td>
                  Natives <code>[disabled]="true"</code> ist vertretbar — aber nur, wenn der Verlust der Fokussierbarkeit
                  (und der Ansage) den Nutzer nichts kostet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Begründung: MDN <code>aria-disabled</code> und die Leitlinie „don’t disable buttons“ des GOV.UK Design System
          (beide verlinkt unter Quellen).
        </p>

        <h4>Abnahme-Checkliste</h4>
        <ul class="checklist">
          <li>☐ Jeder Button hat ein sichtbares Label oder ein <code>ariaLabel</code>.</li>
          <li>☐ Er rendert einen nativen <code>&lt;button&gt;</code> (kein klickbares div/span).</li>
          <li>☐ Erreichbar und bedienbar per <kbd>Tab</kbd> + <kbd>Enter</kbd>/<kbd>Space</kbd>.</li>
          <li>☐ Der Fokus-Ring ist sichtbar und nicht wegüberschrieben.</li>
          <li>☐ Genau ein primärer (gefüllter) Button pro Ansicht.</li>
          <li>☐ Das Label nennt das Verb und ist aus dem Kontext heraus lesbar.</li>
          <li>☐ Der Disabled-Zustand ist eine bewusste Wahl (siehe die Tabelle), kein Reflex.</li>
        </ul>

        <h4>Teste es</h4>
        <p>
          Ein Spec, das dem echten Setup des Kits entspricht (TestBed + Vitest über
          <code>&#64;angular/build:unit-test</code>) — es rendert einen Icon-only-Button und prüft, dass sein zugänglicher
          Name aus <code>ariaLabel</code> kommt:
        </p>
        <pre class="code-block"><code>{{ testSnippet }}</code></pre>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <ul>
          <li>
            <strong>Labels über Schlüssel</strong> — codier Button-Text nie fest; binde einen Übersetzungsschlüssel, damit
            das Raw-Key-Gate (<code>check-i18n-keys.mjs</code>) prüfen kann, dass er aufgelöst wird.
          </li>
          <li>
            <strong>Längentoleranz</strong> — deutsche Labels sind spürbar länger als englische („Speichern“ statt
            „Save“, „Herunterladen“ statt „Download“). Lass Buttons sich nach dem Inhalt richten und die Reihe umbrechen;
            leg nie eine Breite fest, die ein übersetztes Label abschneidet.
          </li>
          <li>
            <strong>Leichte Sprache</strong> — in den <code>*-easy</code>-Varianten nimm das schlichteste Verb („Start“,
            „Weiter“, „Fertig“) und meide zusammengesetzte Substantive; das Label führt trotzdem mit dem Verb.
          </li>
        </ul>

        <h3>RTL: <code>iconPos</code> ist physisch, nicht logisch</h3>
        <p>
          Ein vorangestelltes Icon wandert unter RTL <em>nicht</em> automatisch auf die Seite, an der das Lesen beginnt.
          Optimus positioniert das Icon mit Flexbox-<code>order</code> plus <code>:dir(rtl)</code>-Overrides in
          <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs</code>:
        </p>
        <pre class="code-block"><code>{{ rtlSnippet }}</code></pre>
        <p>
          Diese <code>:dir(rtl)</code>-Regeln <strong>neutralisieren</strong> die Spiegelung, die eine
          schlichte Flex-Reihe anwenden würde, und nageln das Icon so auf eine <strong>physische</strong> Seite fest:
          <code>iconPos="left"</code> bleibt visuell links und <code>iconPos="right"</code> visuell rechts, in LTR wie in
          RTL. Ein „vorangestelltes“ Icon, auf <code>left</code> gesetzt, landet in einer RTL-Sprache also auf der
          <em>hinteren</em> Seite.
        </p>
        <p>
          Wenn du das Kit um eine RTL-Sprache erweiterst, dreh <code>iconPos</code> reaktiv um, damit das Icon der
          Leserichtung folgt:
        </p>
        <pre class="code-block"><code>{{ rtlWorkaround }}</code></pre>
        <p class="src-note">
          Dieses Kit liefert nur LTR-Sprachen aus, also ist hier heute nichts verdrahtet — der Abschnitt existiert für
          RTL-Erweiterungen downstream. Verhalten gelesen aus
          <code>&#64;openng/optimus-ui-styles/dist/button/index.mjs</code> (2.0.2 — die <code>:dir(rtl)</code>-Regeln zur
          Reihenfolge sind unverändert bei <code>:33-45</code>); der Button-Root ist <code>display: inline-flex</code> in
          derselben Datei.
        </p>
      </ng-template>

      <!-- ================= HISTORY (renders as a footer, not a tab) ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>v0.10</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: der eine Fokus-Ring des
            Kits (2px <code>--primary-color-fg</code>), Text-Buttons auf den semantischen Tinten des Kits und auch im
            Dunkelmodus transparent, Text- und Contrast-Buttons jetzt per Gate geprüft.
          </li>
          <li>
            <strong>v0.9</strong> — 23.09.2026 — Erneut geprüft gegen Optimus UI 2.0.2 und die visuellen Stile (ADR-0016):
            Die Render-Ebenen umfassen jetzt die Blöcke je Stil und den reinen Token-Block des ThemeService (Rahmen,
            Hover-Filter, gedrückter Zustand, Radius je Stil); Sekundär- und Severity-Buttons so beschrieben, wie das Kit
            sie malt; Label-Kontrast aus dem Kontrast-Gate zitiert; Aussage zu schmalen Bildschirmen ergänzt. Die
            Ripple-Directive (<code>pRipple</code>) eingegliedert: <code>covers: [button, ripple]</code>, Vertrag in
            Entwicklung und im Agent-Doc.
          </li>
          <li>
            <strong>v0.8</strong> — 02.09.2026 — Neu aufgesetzt auf Optimus UI 2.0.2 (ADR-0014): vier v22-Aussagen
            zurückgedreht — die Directive <code>pButton</code> behält <code>label</code>/<code>icon</code> als
            funktionierende, aber <code>&#64;deprecated</code> Setter (<code>iconPos</code> gar nicht deprecated), die
            Inputs der Komponente sind wieder schlichte Properties statt <code>InputSignal</code>, Outputs sind
            <code>EventEmitter</code>, und der Slot-Weg über <code>pTemplate</code> bleibt; <code>variant</code> hat
            <code>'link'</code> verloren, das ein Boolean bleibt. Größenskala neu gelesen aus den Aura-2.x-Token, die
            Optimus mitliefert (Padding 0.75/0.5rem, Icon-only 32/40/48px, kein Token für die Root-Schriftgröße — ein
            <code>1rem</code>-Literal in der Styles-Ebene). Alle Zeilenverweise neu abgeleitet gegen Bundle und Typings von
            <code>openng-optimus-ui-button</code>.
          </li>
          <li>
            <strong>v0.7</strong> — 24.08.2026 — Erneut geprüft gegen PrimeNG 22.1.2 / Aura 3.0:
            Die Directive <code>pButton</code> verlor <code>label</code>/<code>icon</code>/<code>iconPos</code> (jetzt Kinder über
            <code>pButtonIcon</code>/<code>pButtonLabel</code>, mit Migrations-Snippet); Größenskala neu gemessen
            (Aura 3.0 verkleinerte alles um eine Stufe — Schrift 14px als Standard, Icon-only 28/36/42px); Inputs sind
            Signal-Inputs, Outputs sind <code>OutputEmitterRef</code>s; Slot-Weg über <code>pTemplate</code> entfernt;
            Union von <code>variant</code> um <code>'link'</code> erweitert.
          </li>
          <li>
            <strong>v0.6</strong> — 20.08.2026 — Zusammenfassung zum WCAG-2.2-Status im Tab Design ergänzt: gemessene
            Kriterien als erfüllt / nicht erfüllt / bedingt zusammengefasst, nicht gemessene ausdrücklich nicht beansprucht.
          </li>
          <li>
            <strong>v0.5</strong> — 30.07.2026 — Redaktioneller Durchgang: Belege auf Zitate gekürzt, Zeilenverweise in die
            App durch Methoden- und Selektornamen ersetzt.
          </li>
          <li>
            <strong>v0.4</strong> — 29.07.2026 — Selects im Playground über <code>[ariaLabelledBy]</code> neu benannt;
            Querverweis auf die Benennungstabelle des Select-Guides.
          </li>
          <li>
            <strong>v0.3</strong> — 22.07.2026 — Abschnitt zum Fokus-Ring neu geschrieben, rund um die neu registrierte
            Skala <code>semantic.primary</code>.
          </li>
          <li>
            <strong>v0.2</strong> — 22.07.2026 — Referenz-Durchgang: Playground und Lade-Demo, Do/Don’t-Paare, Tabs Design
            und Entwicklung, Tiefe bei der Barrierefreiheit, RTL-Abschnitt, das zweischichtige Styling-Modell des
            <code>ThemeService</code>, erweiterte Quellen.
          </li>
          <li>
            <strong>v0.1</strong> — 22.07.2026 — Erster Guide: Beispiele, Verwendung, Design, Entwicklung, Qualität, i18n,
            Quellen und das kanonische Agent-Doc.
          </li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ButtonArticleDeComponent extends ButtonArticleComponent {
  override readonly severityOptions = [
    { label: 'Primary (Standard)', value: 'primary' },
    { label: 'Secondary', value: 'secondary' },
    { label: 'Success', value: 'success' },
    { label: 'Info', value: 'info' },
    { label: 'Warn', value: 'warn' },
    { label: 'Danger', value: 'danger' },
    { label: 'Contrast', value: 'contrast' },
  ];
  override readonly variantOptions = [
    { label: 'Gefüllt', value: 'filled' },
    { label: 'Outlined', value: 'outlined' },
    { label: 'Text', value: 'text' },
  ];
  override readonly sizeOptions = [
    { label: 'Klein', value: 'small' },
    { label: 'Normal', value: 'normal' },
    { label: 'Groß', value: 'large' },
  ];

  /** Same markup as the English playground, with the German preview label. */
  override readonly pgCode = computed(() => {
    const attrs: string[] = ['label="Änderungen speichern"'];
    if (this.pgSeverity() && this.pgSeverity() !== 'primary') attrs.push(`severity="${this.pgSeverity()}"`);
    if (this.pgVariant() === 'outlined') attrs.push('[outlined]="true"');
    if (this.pgVariant() === 'text') attrs.push('[text]="true"');
    if (this.pgSizeInput()) attrs.push(`size="${this.pgSizeInput()}"`);
    if (this.pgIcon()) attrs.push('icon="pi pi-check"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    return `<p-button\n  ${attrs.join('\n  ')} />`;
  });

  override readonly examples: ButtonArticleComponent['examples'] = this.examples.map((ex) => ({
    ...ex,
    ...EXAMPLE_TEXT_DE[ex.id],
  }));
}
