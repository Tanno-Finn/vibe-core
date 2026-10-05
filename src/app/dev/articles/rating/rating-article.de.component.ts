import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RatingArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './rating-article.component';

/**
 * German twin of the Rating guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers and code snippets are
 * shared; only the template, the value readout and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs rating`).
 */
@Component({
  selector: 'app-rating-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'rating'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Eine Sternleiste sieht aus wie ein einziges Control, besteht aber aus fünf. Die Komponente zeichnet nichts, das du fokussieren
          kannst: Jeder Stern ist ein natives <code>input[type=radio]</code>, auf ein Pixel beschnitten, mit einem
          gefüllten oder einem umrissenen Stern daneben gezeichnet. Lies die Beispiele als Radio-Gruppen, und der Rest
          dieses Guides ergibt sich daraus.
        </p>

        <h3>Bearbeitbar, schreibgeschützt, deaktiviert</h3>
        <div class="stage">
          <fieldset class="rating-field">
            <legend>Wie nützlich war diese Seite?</legend>
            <p-rating [ngModel]="score()" (ngModelChange)="score.set($event)" />
            <p class="stage-note">Ausgewählt: {{ scoreLabel() }}</p>
          </fieldset>
        </div>
        <div class="stage">
          <p-rating [ngModel]="3" [readonly]="true" />
          <span class="stage-note">readonly — Zeiger blockiert, per Tastatur weiterhin erreichbar</span>
        </div>
        <div class="stage">
          <p-rating [ngModel]="3" [disabled]="true" />
          <span class="stage-note"
            >disabled — die Radios tragen das Attribut disabled und verlassen die Tab-Reihenfolge</span
          >
        </div>
        <p class="src-note">
          Drei Live-Instanzen von <code>p-rating</code> aus <code>&#64;openng/optimus-ui/rating</code>. Die Komponente
          behandelt nur Klick, Fokus, Blur und Change — in <code>openng-optimus-ui-rating.mjs</code> gibt es keinen
          Handler für <code>keydown</code> oder <code>keyup</code> —, eine Pfeiltaste ist also die eigene Behandlung
          gleichnamiger Radios durch den Browser, und das <code>change</code>, das sie auslöst, landet in der
          Auswahlmethode, die unter Entwicklung beschrieben ist.
        </p>

        <h3>Was die Komponente je Stern ausgibt</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Struktur aus dem Template der Komponente, <code>openng-optimus-ui-rating.mjs:266-312</code>; die Regel zum
          Verstecken aus <code>openng-optimus-ui-base.mjs:28-42</code>. Beachte, was fehlt: keine Rolle am Host, kein
          <code>aria-labelledby</code> und kein Element um die Optionen, das einen Gruppennamen tragen könnte.
        </p>

        <h3>Zehn Sterne, eine Zeile</h3>
        <div class="stage">
          <p-rating [ngModel]="7" [stars]="10" [readonly]="true" />
        </div>
        <p class="src-note">
          <code>[stars]</code> wird einmal in <code>onInit</code> gelesen
          (<code>openng-optimus-ui-rating.mjs:177-183</code>) und nie neu aufgebaut.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welches Control</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Situation</th><th>Greif zu</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr><td>Ein Leser bewertet etwas auf einer groben ordinalen Skala</td><td><code>p-rating</code></td><td>{{ m.whenRating }}</td></tr>
              <tr><td>Ein Durchschnitt oder eine schon abgegebene Bewertung wird angezeigt</td><td>Dein eigenes Markup</td><td>{{ m.whenStatic }}</td></tr>
              <tr><td>Die Optionen haben Namen, keine Ränge</td><td><code>radiobutton</code></td><td>{{ m.whenRadio }}</td></tr>
              <tr><td>Eine feine oder stufenlose Skala</td><td><code>slider</code></td><td>{{ m.whenSlider }}</td></tr>
              <tr><td>Zwei bis vier beschriftete Optionen, nebeneinander</td><td><code>selectbutton</code></td><td>{{ m.whenSegments }}</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Leiste an der Komponente selbst benennen</span>
            <div class="dd__stage">
              <p-rating
                aria-label="Wie nützlich war diese Seite?"
                [ngModel]="ddNameBad()"
                (ngModelChange)="ddNameBad.set($event)" />
            </div>
            <p class="dd__why">{{ m.namelessWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Namen an ein echtes gruppierendes Element setzen</span>
            <div class="dd__stage">
              <fieldset class="rating-field">
                <legend>Wie nützlich war diese Seite?</legend>
                <p-rating [ngModel]="ddNameGood()" (ngModelChange)="ddNameGood.set($event)" />
              </fieldset>
            </div>
            <p class="dd__why">{{ m.fieldsetWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Leisten sind live. Die Host-Bindings, die über das Ergebnis entscheiden, stehen in
          <code>openng-optimus-ui-rating.mjs:370-373</code>: eine Klasse und ein data-Attribut, keine Rolle.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — readonly nutzen, um eine Bewertung anzuzeigen</span>
            <div class="dd__stage">
              <p-rating [ngModel]="4" [readonly]="true" />
            </div>
            <p class="dd__why">{{ m.readonlyWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein Bild mit Namen rendern</span>
            <div class="dd__stage">
              <span role="img" aria-label="4 von 5 Sternen" class="static-score">
                <span aria-hidden="true">
                  <i class="pi pi-star-fill"></i><i class="pi pi-star-fill"></i><i class="pi pi-star-fill"></i
                  ><i class="pi pi-star-fill"></i><i class="pi pi-star static-score__off"></i>
                </span>
              </span>
            </div>
            <p class="dd__why">{{ m.imgWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Die schreibgeschützte Leiste ist ein echtes <code>p-rating</code>: Springst du mit Tab hinein, sind die fünf Radios noch
          da, weil <code>readonly</code> ein Attribut ausgibt, das HTML für diesen Input-Typ nicht definiert
          (<code>openng-optimus-ui-rating.mjs:276</code>), und kein <code>aria-readonly</code>. Das Bild daneben ist
          einfaches Markup — ein Knoten, ein Name, kein Tab-Stopp.
        </p>
        <pre class="code-block"><code>{{ ddImgSnippet }}</code></pre>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — beide Icons gegen dieselbe Form tauschen</span>
            <div class="dd__stage">
              <p-rating
                iconOnClass="pi pi-star-fill"
                iconOffClass="pi pi-star-fill"
                [iconOffStyle]="dimmedIcon"
                [ngModel]="ddIconBad()"
                (ngModelChange)="ddIconBad.set($event)" />
            </div>
            <p class="dd__why">{{ m.sameShapeWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — gefüllt gegen umrissen beibehalten</span>
            <div class="dd__stage">
              <p-rating [ngModel]="ddIconGood()" (ngModelChange)="ddIconGood.set($event)" />
              <p-rating
                iconOnClass="pi pi-heart-fill"
                iconOffClass="pi pi-heart"
                [ngModel]="ddIconHeart()"
                (ngModelChange)="ddIconHeart.set($event)" />
            </div>
            <p class="dd__why">{{ m.twoShapeWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Die Standard-Icons sind zwei Komponenten, <code>star-fill</code> und <code>star</code>
          (<code>openng-optimus-ui-rating.mjs:295</code>, <code>:306</code>); eine Klassen-Überschreibung ersetzt das svg
          durch ein span (<code>:292</code>, <code>:303</code>). Die Icon-Schrift des Kits ist
          <code>&#64;openng/icons</code>, geladen in <code>src/styles.scss</code> — eine Klasse, die sie nicht
          definiert, rendert ein leeres span.
        </p>

        <h3>Kommentierter Quelltext der empfohlenen Form</h3>
        <pre class="code-block"><code>{{ recommendedSnippet }}</code></pre>

        <h3>Quellen</h3>
        <ul class="sources">
          <li>
            <a
              href="https://html.spec.whatwg.org/multipage/input.html#radio-button-state-(type=radio)"
              target="_blank"
              rel="noopener noreferrer"
              >WHATWG — HTML Standard, radio button state</a
            >
            — Gruppierung über <code>name</code>, die eigene Pfeiltasten-Behandlung des Browsers und kein
            <code>readonly</code> für diesen Input-Typ.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#generic" target="_blank" rel="noopener noreferrer"
              >W3C — WAI-ARIA 1.2, role generic</a
            >
            — Benennung verboten: warum ein Label am Host verworfen wird.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 1.4.1 Use of Color</a
            >
            — warum gefüllte und leere Sterne sich in der Form unterscheiden müssen.
          </li>
          <li>
            <a
              href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html"
              target="_blank"
              rel="noopener noreferrer"
              >W3C — WCAG 2.2 SC 2.5.8 Target Size (Minimum)</a
            >
            — die 24 × 24, die der Stern des Presets verfehlt.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Die Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Wert im Aura-Preset</th><th>Wo er ankommt</th></tr>
            </thead>
            <tbody>
              <tr><td><code>rating.gap</code></td><td>{{ m.tokGap }}</td><td>Spaltenabstand der Inline-Flex-Zeile</td></tr>
              <tr><td><code>rating.icon.size</code></td><td>{{ m.tokSize }}</td><td><code>font-size</code>, <code>width</code> und <code>height</code> jedes Icons</td></tr>
              <tr><td><code>rating.icon.color</code></td><td>{{ m.tokColor }}</td><td>Nicht ausgewählte Sterne</td></tr>
              <tr><td><code>rating.icon.active.color</code></td><td>{{ m.tokActive }}</td><td>Ausgewählte Sterne</td></tr>
              <tr><td><code>rating.icon.hover.color</code></td><td>{{ m.tokHover }}</td><td>Hover, unterdrückt unter <code>p-disabled</code> und <code>p-readonly</code></td></tr>
              <tr><td><code>rating.focus.ring.*</code></td><td>{{ m.tokRing }}</td><td><code>outline</code> und <code>box-shadow</code> von <code>.p-rating-option.p-focus-visible</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/rating/index.mjs</code>; die Regeln, die sie nutzen,
          aus <code>&#64;openng/optimus-ui-styles/dist/rating/index.mjs</code>. Wo die Tabelle statt eines Literals einen
          Preset-Verweis nennt, löst das Theme ihn beim Build auf.
        </p>

        <h3>Kontrast eines Sterns in Kit-Tinte</h3>
        <p>{{ m.contrastIntro }}</p>
        <p>{{ m.contrastCriterion }}</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Visueller Stil</th><th>Light Mode</th><th>Dark Mode</th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>7,78:1</td><td>6,59:1</td></tr>
              <tr><td>lernwerkstatt</td><td>5,79:1</td><td>6,56:1</td></tr>
              <tr><td>skizzenbuch</td><td>5,56:1</td><td>5,38:1</td></tr>
              <tr><td>blaupause</td><td>5,21:1</td><td>6,29:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Zeilen wörtlich zitiert aus <code>docs/generated/CONTRAST.MD</code>, Block „body text“,
          <code>--text-color-secondary</code> auf <code>--surface-card</code>, alle vier visuellen Stile und beide
          Modi. Die Werte für ausgewählte Sterne oben sind die Zeilen der Gruppe „checkbox &amp; radiobutton“ für
          <code>primary.color</code> auf <code>--surface-card</code>; die Icon-Tokens stammen aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/rating/index.mjs</code>.
        </p>

        <h3>Zielgröße</h3>
        <p>{{ m.targetSize }}</p>
        <p class="src-note">
          Berechnet aus zwei Preset-Werten, <code>rating.icon.size</code> und <code>rating.gap</code>
          (<code>&#64;openng/optimus-ui-themes/dist/aura/rating/index.mjs</code>), gegen die Regel, die das Icon in
          <code>&#64;openng/optimus-ui-styles/dist/rating/index.mjs</code> bemisst; die Options-Box fügt kein eigenes
          Padding hinzu. Kriterium: WCAG 2.2 SC 2.5.8.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>{{ m.narrowStatement }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Die API-Oberfläche</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Art</th><th>Was es tut</th></tr>
            </thead>
            <tbody>
              <tr><td><code>stars</code></td><td>Input, <code>numberAttribute</code>, Standard 5</td><td>{{ m.inStars }}</td></tr>
              <tr><td><code>readonly</code></td><td>Input, <code>booleanAttribute</code></td><td>{{ m.inReadonly }}</td></tr>
              <tr><td><code>autofocus</code></td><td>Input, <code>booleanAttribute</code></td><td>{{ m.inAutofocus }}</td></tr>
              <tr><td><code>iconOnClass</code>, <code>iconOffClass</code></td><td>Input</td><td>{{ m.inIconClass }}</td></tr>
              <tr><td><code>iconOnStyle</code>, <code>iconOffStyle</code></td><td>Input</td><td>{{ m.inIconStyle }}</td></tr>
              <tr><td><code>disabled</code>, <code>name</code></td><td>Geerbter Input</td><td>{{ m.inInherited }}</td></tr>
              <tr><td><code>required</code>, <code>invalid</code></td><td>Geerbter Input</td><td>{{ m.inRequiredInvalid }}</td></tr>
              <tr><td><code>onRate</code></td><td>Output</td><td>{{ m.outRate }}</td></tr>
              <tr><td><code>onFocus</code>, <code>onBlur</code></td><td>Output</td><td>{{ m.outFocus }}</td></tr>
              <tr><td><code>#onicon</code>, <code>#officon</code></td><td>Content-Template</td><td>{{ m.inTemplates }}</td></tr>
              <tr><td>Wert</td><td><code>NG_VALUE_ACCESSOR</code></td><td>{{ m.inValue }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Input- und Output-Deklarationen aus <code>openng-optimus-ui-rating.mjs:266</code> und den Property-Dekoratoren
          bei <code>:376-408</code>; der Value Accessor aus <code>:84-88</code>. Die letzten zwei Zeilen stehen gar
          nicht in dieser Deklaration — sie sind geerbt von
          <code>openng-optimus-ui-baseeditableholder.mjs:58</code>, und das Template nutzt sie bei <code>:273</code>,
          <code>:275</code> und <code>:277</code>.
        </p>

        <h3>Vier Verhaltensweisen, die du kennen solltest, bevor du sie verdrahtest</h3>
        <h4>Zwei Wege, bei null zu landen</h4>
        <p>{{ m.toggleOff }}</p>
        <p>{{ m.toggleOffKeyboard }}</p>
        <h4>Sterne werden einmal gezählt</h4>
        <p>{{ m.starsOnce }}</p>
        <h4>Der Fokus-Ring hängt an einer nicht standardisierten Event-Property</h4>
        <p>{{ m.focusRing }}</p>
        <h4>Der ungültige Zustand rendert nichts</h4>
        <p>{{ m.invalidState }}</p>
        <p class="src-note">
          Lösch-Zweig aus <code>onOptionSelect</code> (<code>openng-optimus-ui-rating.mjs:204-215</code>, die Bedingung
          bei <code>:206</code>), der fokussierte Index aus <code>onInputFocus</code> (<code>:226</code>) und
          <code>onChange</code> (<code>:216-217</code>); das Stern-Array aus <code>onInit</code>
          (<code>:177-183</code>); das Ring-Flag aus <code>:227</code>, <code>:218</code> und der Class-Map bei
          <code>:38</code>; die Klassen für ungültig bei <code>:41-42</code> und ihre einzige Regel in
          <code>&#64;openng/optimus-ui-styles/dist/rating/index.mjs:50-52</code>.
        </p>

        <h3>Checkliste, bevor das ausgeliefert wird</h3>
        <ul class="checklist">
          <li>Die Leiste sitzt in einer beschrifteten Gruppe, und die Beschriftung steht nicht an <code>p-rating</code> selbst.</li>
          <li>Eine Bewertung, die nur angezeigt wird, nutzt kein <code>p-rating</code>.</li>
          <li>Etwas Sichtbares nennt den aktuellen Wert in Worten, für den Leser, der gefüllte Sterne nicht zählen kann.</li>
          <li>Das Löschen ist erreichbar, ohne auf den aktuellen Stern zu zielen.</li>
          <li><code>[stars]</code> ist eine Konstante zu dem Zeitpunkt, an dem die Komponente erzeugt wird.</li>
          <li>Der Tastaturfokus ist in den Browsern sichtbar, die du unterstützt, und das Model hält noch den Stern, zu
            dem der Leser mit den Pfeiltasten gegangen ist — prüf beides mit der Tastatur, nicht mit der Maus.</li>
          <li>Der Fehlerzustand wird von deinem eigenen Markup getragen, nicht von <code>[invalid]</code>.</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Zwei Quellen, eine Leiste</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Text</th><th>Kommt aus</th><th>Wie er übersetzt wird</th></tr>
            </thead>
            <tbody>
              <tr><td>Der Gruppenname</td><td>Dein Template</td><td>{{ m.i18nGroup }}</td></tr>
              <tr><td>Der Name je Stern</td><td>Die Optimus-Konfiguration</td><td>{{ m.i18nStar }}</td></tr>
              <tr><td>Der sichtbare Werttext</td><td>Dein Template</td><td>{{ m.i18nValue }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>starAriaLabel</code> bei <code>openng-optimus-ui-rating.mjs:240-242</code> liest
          <code>config.translation.aria.star</code> und <code>aria.stars</code>; die englischen Standardwerte sind in
          <code>openng-optimus-ui-config.mjs:180-181</code> deklariert. Die Komponente bietet keinen eigenen Input für
          ein Label.
        </p>

        <h3>Das Stern-Vokabular setzen</h3>
        <p>{{ m.i18nSwitch }}</p>
        <pre class="code-block"><code>{{ translationSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> (<code>openng-optimus-ui-config.mjs:246-249</code>) führt nur auf oberster Ebene
          zusammen, also ersetzt das Objekt, das für <code>aria</code> übergeben wird, den ganzen Block
          <code>aria</code>. Änderungen werden über <code>translationObserver</code> veröffentlicht, die Observable-Seite
          eines <code>Subject</code> (<code>:241-242</code>), die diese <code>OnPush</code>-Komponente nicht abonniert.
        </p>

        <h3>Was der Platzhalter nicht ausdrücken kann</h3>
        <p>{{ m.i18nPlural }}</p>

        <h3>Den Gruppennamen in diesem Kit übersetzen</h3>
        <pre class="code-block"><code>{{ i18nGroupSnippet }}</code></pre>
        <p class="src-note">
          Das übliche Muster des Kits: <code>TranslationService.translate()</code>, gelesen in einem
          <code>computed</code>, wodurch das computed vom Signal der Übersetzungsversion des Service abhängt und beim
          Sprachwechsel neu läuft. Nichts auf diesem Weg berührt die Optimus-Konfiguration.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: die Zeilen für
            ausgewählte Sterne neu zitiert (dunkel 4,75:1 und mehr, die Ausnahme für den Kontrast-Akzent ist weg); der
            Ring ist dort, wo die Komponente ihn zeigt, der eine 2px-Ring des Kits.
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Design zitiert die Zeilen der Zusammenstellung für die Farbe
            ausgewählter Sterne (<code>primary.color</code> auf der Card, jeder Stil und Modus, die Ausnahme für den
            Kontrast-Akzent benannt), statt die gerenderte Leiste ungemessen zu nennen; kommentierte Quellen schließen
            den Tab Verwendung ab; Doc unter das Größenziel gekürzt.
          </li>
          <li><strong>1.0</strong> — 05.09.2026 — Erste Version, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class RatingArticleDeComponent extends RatingArticleComponent {
  override scoreLabel(): string {
    const v = this.score();
    return v === null ? 'noch nichts' : v + ' von 5';
  }

  override readonly m = {
    // usage — which control
    whenRating:
      'Fünf geordnete Stufen, keine Beschriftungen zu lesen, und die Form der Antwort kennt jeder. Die Skala muss ordinal und grob sein, weil nichts die Stufen unterscheidet außer ihrer Position.',
    whenStatic:
      'Eine Bewertung, die niemand ändern kann, ist keine Eingabe. Der Modus readonly rendert weiterhin fokussierbare Radio Buttons, er drückt einem Tastatur-Leser also ein Control in die Hand, das nichts tut.',
    whenRadio:
      'Sterne tragen einen Rang und sonst nichts. Sobald die Optionen Bedeutungen haben, die ein Leser lesen muss, brauchen sie sichtbare Beschriftungen, und dafür hat diese Komponente keinen Platz.',
    whenSlider:
      'Zehn Stufen sind schon eine lange Zeile, und die Zeile bricht nie um; ein stufenloser Wert gehört auf eine Schiene mit einer angezeigten Zahl.',
    whenSegments:
      'Benannte Alternativen, die in eine Zeile passen, lesen sich als Segmente schneller als ein Rang, den ein Leser entschlüsseln muss.',

    // usage — do/don't rationales
    namelessWhy:
      'Der Host wird als einfaches Element gerendert: Seine einzigen Bindings sind eine Klasse und ein data-Attribut, ohne Rolle. Ein Name an einem Element mit generischer Semantik wird nicht bereitgestellt, also werden die Radios darin einzeln angesagt, ohne jede Ahnung, was bewertet wird.',
    fieldsetWhy:
      'Die Legend benennt die Gruppe für jeden Leser, die Radios erben diesen Kontext, und der Name übersteht die Übersetzung, weil er ein gewöhnlicher Text in deinem Template ist.',
    readonlyWhy:
      'readonly setzt ein Attribut, das HTML für Radio Buttons nicht definiert, und fügt kein aria-readonly hinzu, also bleiben die Radios in der Tab-Reihenfolge und werden als wählbar angesagt. Was die Änderung blockiert, ist ein Schutz in JavaScript, den assistive Technik nie sieht.',
    imgWhy:
      'Ein Knoten, ein Name, ein Wert, außerhalb der Tab-Reihenfolge — genau das ist eine gedruckte Bewertung. Diese Semantik nutzt app-generic-card für die Bewertungen auf ihren Cards; die Tinte wählst du, und ein Stern, der Bedeutung trägt, braucht die 3:1 aus SC 1.4.11 gegen die Fläche dahinter.',
    sameShapeWhy:
      'Beide Klassen lösen sich zum selben Glyph auf, und nur die Farbe trennt einen gefüllten Stern von einem leeren, was SC 1.4.1 für jeden verfehlt, der diesen Unterschied nicht erkennen kann — und unter einem Forced-Colors-Modus ganz verschwindet.',
    twoShapeWhy:
      'Die Standardwerte sind zwei verschiedene Icons, ein gefüllter Stern und ein umrissener, also übersteht der Zustand Graustufen, eine Farbsehschwäche und eine erzwungene Palette. Überschreib das Paar nur mit zwei Formen, die genauso klar unterscheidbar bleiben.',

    // design — tokens
    tokGap: '0.25rem',
    tokSize: '1rem',
    tokColor: 'ein Preset-Verweis auf die gedämpfte Textfarbe',
    tokActive: 'ein Preset-Verweis auf die Primärfarbe',
    tokHover: 'ein Preset-Verweis auf die Primärfarbe',
    tokRing:
      'fünf Preset-Verweise — Breite, Stil, Farbe, Abstand und Schatten; der eine Ring des Kits (2px --primary-color-fg, 2px Abstand) ersetzt sie an derselben Klasse',

    // design — contrast
    contrastIntro:
      'Eine gerenderte Leiste malt ihre ausgewählten Sterne in {primary.color}, dem Akzent, und ihre leeren in {text.muted.color}; kein visueller Stil lenkt eine davon um. Die Zusammenstellung misst die ausgewählte Farbe auf der Card als Checkbox-Füllung (Zeilen <accent>.primary.color auf --surface-card, Gruppe „checkbox & radiobutton“, SC 1.4.11): 5,18:1 bis 17,85:1 im Light Mode und 4,75:1 bis 16,06:1 im Dark Mode, jeder Stil und alle zehn Akzente — die dunkle Akzent-Skala kommt aus dem kontrastangepassten Vordergrund, und das Gate hat keine Ausnahmen. Die Farbe leerer Sterne ist nicht im Gate. Die Tabelle unten klärt den Fall, den ein Aufrufer ganz in der Hand hat: einen Stern in der sekundären Kit-Tinte auf einer Card, die Tinte, die das Markup der statischen Bewertung im Tab Verwendung seinen leeren Sternen gibt.',
    contrastCriterion:
      'Ein Stern ist eine Grafik, kein Text: Für ihn gilt SC 1.4.11 mit 3:1, während die Zusammenstellung diese Zeilen gegen SC 1.4.3 mit 4,5:1 berechnet. Alle acht überschreiten beide Schwellen, die niedrigste mit 5,21:1, blaupause im Light Mode. Das Paar, das keine Tabelle klärt, ist das, das in einer gerenderten Leiste die Bedeutung trägt, gefüllter Stern gegen leeren Stern — deshalb unterscheiden sich die beiden Standard-Icons in der Form, nicht nur in der Farbe.',
    targetSize:
      'Jede Options-Box ist ein Icon breit, also ist sie bei den Preset-Werten ein Ziel von 16 × 16 CSS-Pixeln mit 4 Pixeln zwischen den Nachbarn: 20 Pixel von Mitte zu Mitte. SC 2.5.8 (AA) verlangt 24 × 24, und seine Abstandsausnahme rettet das auch nicht, weil Kreise von 24 Pixeln im Abstand von 20 Pixeln sich überlappen. Erhöh rating.icon.size, oder gib der Option Padding und verbreitere rating.gap passend, überall dort, wo das Kriterium gilt.',
    narrowStatement:
      'Kein eigenes responsives Verhalten: Die Zeile ist ein inline-flex ohne flex-wrap, also behält sie bei jedem Viewport ihre eigene Breite — fünf Sterne sind bei den Preset-Werten etwa 96 Pixel breit und passen überall hin, zehn sind etwa 196 Pixel und laufen in einem schmaleren Container einfach über, statt umzubrechen. Layout-Empfehlung: Bleib bei fünf für ein Formular, das ein Smartphone zu sehen bekommt, und wo du mehr brauchst, setz die Leiste in einen Container, der scrollt, statt in einen, der abschneidet.',

    // development — API
    inStars:
      'Wie viele Optionen gerendert werden. Wird einmal bei der Initialisierung gelesen; eine spätere Änderung baut die Zeile nicht neu auf.',
    inReadonly:
      'Blockiert Klick, Auswahl und Fokusbehandlung in JavaScript und fügt die Klasse p-readonly hinzu. An der bereitgestellten Semantik ändert es nichts.',
    inAutofocus: 'Wird an die autofocus-Direktive auf jedem versteckten Radio weitergereicht.',
    inIconClass:
      'Ersetzt das Standard-Icon durch ein span mit dieser Klasse — der Notausgang zu einer Icon-Schrift. Eine Klasse, die die Schrift nicht definiert, rendert ein leeres span.',
    inIconStyle: 'Ein Inline-Style-Objekt am Icon, angewandt auf das Standard-svg wie auf ein span auf Klassenbasis.',
    inInherited:
      'Keines von beiden ist an der Komponente deklariert: Beide kommen aus der Basis editable-holder, die sie erweitert. disabled erreicht jedes Radio als echtes Attribut disabled und nimmt die Leiste aus der Tab-Reihenfolge; name ersetzt den Gruppennamen, den die Komponente sonst erzeugen würde, und genau das lässt zwei Leisten eine Radio-Gruppe teilen — oder kollidieren.',
    inRequiredInvalid:
      'Ebenfalls geerbt, und die beiden verhalten sich sehr unterschiedlich. required erreicht jedes Radio als Attribut (`:275`). invalid fügt den Icons nur eine Klasse hinzu, und hinter dieser Klasse steht keine wirksame Regel: Der Fehlerzustand muss aus deinem eigenen Markup kommen.',
    outRate:
      'Gibt bei jeder Änderung das ursprüngliche Event und den neuen Wert aus, auch beim Löschen, wo der Wert null ist.',
    outFocus:
      'Blur feuert immer. Focus nicht: Der Handler kehrt vor dem Ausgeben zurück, solange die Leiste schreibgeschützt oder deaktiviert ist, also meldet eine schreibgeschützte Leiste, in die ein Leser weiterhin hineintabben kann, nichts.',
    inTemplates:
      'Content-Templates, die das Icon ganz ersetzen; der Kontext trägt die Sternnummer und die Klasse, die die Komponente benutzt hätte.',
    inValue:
      'Eine Zahl oder null über ngModel oder ein Form Control — die Komponente registriert einen Value Accessor, also ist sie ein gewöhnliches Formularfeld.',

    // development — behaviors
    toggleOff:
      'Der Auswahl-Handler schreibt null statt der Zahl, wenn eine von zwei Bedingungen gilt: Der Stern, der ausgewählt wird, trägt schon den Wert des Models, oder es ist der Stern, dessen Index die Komponente gerade als fokussiert festhält. Die erste ist das dokumentierte Feature — erneutes Auswählen löscht eine Bewertung, und das ist der einzige Lösch-Weg, den die Komponente einem Zeiger bietet. Die zweite ist derselbe Zweig, aus einer anderen Richtung erreicht, weil der Fokus-Handler diesen Index auf den Stern setzt, dessen verstecktes Radio gerade den Fokus bekommen hat, und ein change-Event direkt in dieselbe Methode führt.',
    toggleOffKeyboard:
      'Egal auf welchem Weg er erreicht wird: Ein Aufrufer muss null als legitimen Model-Wert behandeln und lesen, was tatsächlich ankam, statt den gedrückten Stern anzunehmen. Steuer die Leiste in deinem Build mit der Tastatur und lies das Model nach jeder Taste: Der Lösch-Zweig feuert immer dann, wenn der Stern, der ausgewählt wird, derjenige ist, der schon den Fokus hat.',
    invalidState:
      'invalid zu setzen fügt beiden Icons eine Klasse hinzu, und sonst passiert nichts. Die einzige Regel, die für diese Klasse geschrieben ist, setzt einen stroke aus einem Token, den das Aura-Preset nie deklariert, und die Sternpfade werden mit fill statt stroke gemalt — zwei voneinander unabhängige Gründe, warum die Leiste genau so aussieht wie vorher. Ein Fehler muss von deinem eigenen Markup getragen werden: eine Meldung neben der Gruppe und die Gruppe selbst markiert, an dem Element, das den Namen trägt.',
    starsOnce:
      'Das Array der Optionen wird bei der Initialisierung gebaut und nie wieder, also bleibt die Zeile bei ihrer ersten Länge, wenn du die Anzahl an etwas bindest, das sich ändert, während das Model höhere Zahlen bereitwillig annimmt. Behandle die Anzahl als Konstante, oder erzeug die Komponente neu, wenn sie sich ändern muss.',
    focusRing:
      'Der sichtbare Ring ist eine Klasse, die die Komponente nur hinzufügt, wenn sie glaubt, dass der Fokus von einer Tastatur kam, und das entscheidet sie, indem sie das Fokus-Event nach einer nicht standardisierten Property fragt, die nur Chromium-basierte Browser liefern. Wo die Property fehlt, ist der Vergleich false, und ein einfaches Hineintabben zeichnet keinen Ring — das versteckte Radio kann auch den Browser-Standard nicht zeigen, weil es auf ein Pixel beschnitten ist. Nach einer Wertänderung setzt die Komponente das Flag selbst, also erscheint der Ring, sobald der Leser etwas ausgewählt hat. Wenn er erscheint, ist er der eine Ring des Kits — 2px --primary-color-fg, an genau dieser Klasse festgemacht (src/styles.scss), 3,88:1 und mehr auf den Seitenflächen —, das Kit macht den Ring also kräftig, nicht häufiger. Prüf das mit der Tastatur in jeder Engine, die du unterstützt.',

    // i18n
    i18nGroup:
      'Ein gewöhnlicher Text in deinem Markup — übersetz ihn so, wie jede andere Beschriftung im Kit übersetzt wird: über den Übersetzungsservice, gelesen in einem computed.',
    i18nStar:
      'Nicht deiner: Die Komponente baut ihn aus den Einträgen aria.star und aria.stars der Optimus-Konfiguration, die für die ganze Anwendung gleich sind. Optimus setzt sie standardmäßig englisch; der OptimusA11yService des Kits übergibt sie aus optimus.json in der Sprache der Seite, also heißt der erste Stern auf einer deutschen Seite „1 Stern“.',
    i18nValue:
      'Der Satz, der die Bewertung in Worten nennt, gehört ebenfalls dir, und er ist es, der den Wert zu einem Leser trägt, der die Beschriftungen der Radios nicht hört.',
    i18nPlural:
      'Das Vokabular besteht aus zwei Texten und einer Ersetzung: ein Text für genau einen Stern, einer für jede andere Zahl, mit der Anzahl in einen literalen Platzhalter eingefügt. Sprachen, die bei zwei, bei der letzten Ziffer oder nach einer Paukal-Klasse flektieren, lassen sich in dieser Form überhaupt nicht ausdrücken, und der Platzhalter muss die Übersetzung wörtlich überstehen, sonst verschwindet die Zahl aus der Beschriftung.',
    i18nSwitch:
      'Das Stern-Vokabular ist Zustand der Anwendung, nicht der Komponente: eine Einstellung für jede Leiste in der Anwendung und keine Möglichkeit, sie je Instanz zu variieren. Setz es, bevor die Leiste rendert, und erzeug oder rendere die Leiste neu, wenn sich die Sprache ändert, während sie auf dem Bildschirm ist.',
  };
}
