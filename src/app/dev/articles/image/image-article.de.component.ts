import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ImageArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './image-article.component';

/**
 * German twin of the Image and ImageCompare guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template, the visible strings in `m` and the
 * pass-through names in `previewPt` / `comparePt` are German. Keep it in step with
 * the English file: same tabs, same element and binding skeleton
 * (`node scripts/check-guide-translations.mjs image`).
 */
@Component({
  selector: 'app-image-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Unencapsulated so the layout rules below reach the library's subtree; every
  // selector is prefixed with the host tag instead.
  encapsulation: ViewEncapsulation.None,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'image'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          <code>p-image</code> ist ein <code>&lt;img&gt;</code>, das eine Vorschau im Vollbild öffnen kann;
          <code>p-imagecompare</code> legt zwei Bilder übereinander und lässt einen Slider eines davon freilegen. Beide
          reichen deinen Alt-Text durch, und beide lassen Lücken, die du schließen musst: einen Dialog ohne Namen, ein
          vergrößertes Bild ohne Alt-Text, einen Slider ohne Namen und ein Handle, das auf hellen Bildern verschwindet.
        </p>

        <h3>Ein informatives Bild, ohne Vorschau</h3>
        <figure class="fig">
          <p-image [src]="chartUri" [alt]="m.chartAlt" [imageStyle]="fluid" />
          <figcaption>{{ m.chartCaption }}</figcaption>
        </figure>
        <p class="src-note">
          <code>alt</code> wird als <code>[attr.alt]</code> auf das gerenderte <code>&lt;img&gt;</code> gebunden
          (<code>openng-optimus-ui-image.mjs:516</code>). Bleibt es ungesetzt, fehlt das Attribut — es ist nicht leer.
        </p>

        <h3>Die Vorschau, mit geschlossenen Lücken</h3>
        <figure class="fig">
          <span #zoomHost class="zoom-host">
            <p-image
              [src]="chartUri"
              [alt]="m.chartAlt"
              [preview]="true"
              [imageStyle]="fluid"
              [pt]="previewPt"
              (onHide)="restoreFocus(zoomHost)" />
          </span>
          <figcaption id="img-guide-cap">{{ m.chartCaption }}</figcaption>
        </figure>
        <p>{{ m.previewTry }}</p>
        <p class="src-note">
          Drei Pass-through-Attribute: ein Name für die Maske mit <code>role="dialog"</code>, ein <code>alt</code> für
          das vergrößerte Bild und eine Beschreibung für den Vorschau-Button, die auf die Bildunterschrift zeigt
          (<code>pt</code>-Abschnitte <code>mask</code>, <code>original</code>, <code>previewMask</code>). Der
          <code>onHide</code>-Handler gibt den Fokus an den Vorschau-Button zurück, was die Bibliothek nur bei Escape tut.
          Die Fokus-Ringe brauchen hier nichts: Das globale Stylesheet des Kits gibt dem Vorschau-Button seinen einen
          2px-Ring und den Toolbar-Buttons denselben Ring in ihrer Icon-Farbe.
        </p>

        <h3>Ein dekoratives Bild</h3>
        <div class="stage">
          <p-image [src]="waveUri" alt="" [imageStyle]="fluid" />
        </div>
        <p class="src-note">
          <code>alt=""</code> rendert ein leeres Attribut und nimmt das Bild aus dem Accessibility Tree. Ein dekoratives
          Bild bekommt nie <code>preview</code>: Das würde einen Button ohne erkennbaren Zweck in die Tab-Reihenfolge
          setzen.
        </p>

        <h3>ImageCompare, benannt und sichtbar gemacht</h3>
        <figure class="fig">
          <p-imagecompare [pt]="comparePt" [dt]="compareDt" class="compare">
            <ng-template #left>
              <img [src]="sceneGrayUri" [alt]="m.grayAlt" />
            </ng-template>
            <ng-template #right>
              <img [src]="sceneColorUri" [alt]="m.colorAlt" />
            </ng-template>
          </p-imagecompare>
          <figcaption>{{ m.compareCaption }}</figcaption>
        </figure>
        <p class="src-note">
          Das Range-Input bekommt seinen Namen über den Pass-through-Abschnitt <code>slider</code> — das Input
          <code>ariaLabel</code> würde auf dem Host landen, nicht auf dem Input
          (<code>openng-optimus-ui-imagecompare.mjs:136-140</code>). Das Handle wird über <code>dt</code> neu gestaltet:
          weiß mit einem dunklen 2px-Ring und einem 3px-Fokus-Ring in der Akzentfarbe, statt des serienmäßigen Weiß mit
          30 % Deckkraft. Die Bildunterschrift trägt den Vergleich in Worten.
        </p>

        <h3>Was die Vorschau beim Öffnen rendert</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Template in <code>openng-optimus-ui-image.mjs:529-613</code>. Namen in Anführungszeichen sind die englischen
          Standardwerte aus <code>openng-optimus-ui-config.mjs:184</code> und <code>:222-226</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welcher Alt-Text</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Das Bild ist …</th><th><code>alt</code></th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr><td>Informativ (ein Foto, eine Illustration, die etwas aussagt)</td><td>die Aussage, in einem Satz</td><td>{{ m.altInformative }}</td></tr>
              <tr><td>Dekorativ (Stimmung, Wiederholung der Bildunterschrift)</td><td><code>""</code></td><td>{{ m.altDecorative }}</td></tr>
              <tr><td>Komplex (Diagramm, Schaubild)</td><td>kurze Zusammenfassung + die Daten als Text</td><td>{{ m.altComplex }}</td></tr>
              <tr><td>Der einzige Inhalt eines Links oder Buttons</td><td>das Ziel oder die Aktion</td><td>{{ m.altFunctional }}</td></tr>
              <tr><td>Text, als Bild gesetzt</td><td>derselbe Text</td><td>{{ m.altText }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Die Kategorien folgen dem W3C Images Tutorial; SC 1.1.1 verlangt eine davon für jedes
          <code>&lt;img&gt;</code>. Die Bibliothek fügt keine eigene hinzu.
        </p>

        <h3>Vorschau: wann sie sich lohnt</h3>
        <p>{{ m.previewWhen }}</p>

        <h3>ImageCompare: wann nicht</h3>
        <p>{{ m.compareWhen }}</p>
        <ul class="checklist">
          <li>{{ m.compareNot1 }}</li>
          <li>{{ m.compareNot2 }}</li>
          <li>{{ m.compareNot3 }}</li>
          <li>{{ m.compareNot4 }}</li>
        </ul>
        <p>{{ m.compareInstead }}</p>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Alt, das den Dateityp nennt</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" alt="Diagramm" [imageStyle]="fluid" />
            </div>
            <p class="dd__why">{{ m.altBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die Aussage des Diagramms</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" [alt]="m.chartAlt" [imageStyle]="fluid" />
            </div>
            <p class="dd__why">{{ m.altGoodWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — der Slider als einziger Träger des Unterschieds</span>
            <div class="dd__stage">
              <p-imagecompare [pt]="comparePt" [dt]="compareDt" class="compare">
                <ng-template #left><img [src]="sceneGrayUri" alt="Landschaft" /></ng-template>
                <ng-template #right><img [src]="sceneColorUri" alt="Landschaft" /></ng-template>
              </p-imagecompare>
            </div>
            <p class="dd__why">{{ m.compareBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — beide Bilder, und der Unterschied in Worten</span>
            <div class="dd__stage">
              <div class="pair">
                <figure>
                  <img [src]="sceneGrayUri" [alt]="m.grayAlt" />
                  <figcaption>Vorher</figcaption>
                </figure>
                <figure>
                  <img [src]="sceneColorUri" [alt]="m.colorAlt" />
                  <figcaption>Nachher</figcaption>
                </figure>
              </div>
              <p class="pair__note">{{ m.compareCaption }}</p>
            </div>
            <p class="dd__why">{{ m.compareGoodWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Vorschaubild, das nur vergrößert lesbar ist</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" [alt]="m.chartAlt" [preview]="true" [imageStyle]="thumb" />
            </div>
            <p class="dd__why">{{ m.thumbBadWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — an Ort und Stelle lesbar, die Daten daneben</span>
            <div class="dd__stage">
              <p-image [src]="chartUri" [alt]="m.chartAlt" [imageStyle]="fluid" />
              <p class="pair__note">{{ m.chartCaption }}</p>
            </div>
            <p class="dd__why">{{ m.thumbGoodWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Alle sechs Zellen sind live. Die Zoom-Grenze und das fehlende Verschieben stehen in
          <code>openng-optimus-ui-image.mjs:333-338</code> und <code>:474-476</code>: Die Vorschau ist eine
          CSS-Transformation, kein Scrollen, kein Ziehen.
        </p>

        <h3>Quellen</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-image.mjs</code> und <code>openng-optimus-ui-imagecompare.mjs</code> (Optimus UI
            2.0.2) — jedes Binding, jeder Tasten-Handler und jede Fokus-Bewegung, die hier zitiert werden.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-styles/dist/image/index.mjs</code>,
            <code>&#64;openng/optimus-ui-styles/dist/imagecompare/index.mjs</code> und die passenden Aura-Token-Dateien —
            die Fokus-Stile, das Handle und die Geometrie.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/images/decision-tree/" rel="noopener noreferrer" target="_blank"
              >W3C alt decision tree</a
            >
            — die fünf Fälle in der Tabelle oben.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html" rel="noopener noreferrer"
              target="_blank">WCAG 2.2 SC 1.1.1</a
            >
            — Textalternativen, und was als Dekoration zählt.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" rel="noopener noreferrer" target="_blank"
              >APG Dialog (Modal)</a
            >
            — ein Dialog braucht einen Namen, einen Anfangsfokus, eine Fokusfalle und die Rückgabe des Fokus auf jedem
            Weg hinaus.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" rel="noopener noreferrer"
              target="_blank">WCAG 2.2 SC 2.4.7</a
            >
            und
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" rel="noopener noreferrer"
              target="_blank">SC 1.4.11</a
            >
            — der Vorschau-Button und das Vergleichs-Handle im Auslieferungszustand.
          </li>
          <li>
            <a href="https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range)" rel="noopener noreferrer"
              target="_blank">HTML, range state</a
            >
            — warum der Vergleichs-Slider schon mit der Tastatur funktioniert.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura-Wert</th><th>Was er färbt</th></tr>
            </thead>
            <tbody>
              <tr><td><code>image.preview.mask.background</code></td><td><code>&#123;mask.background&#125;</code></td><td>{{ m.tokMaskBg }}</td></tr>
              <tr><td><code>image.preview.mask.color</code></td><td><code>&#123;mask.color&#125;</code></td><td>{{ m.tokMaskFg }}</td></tr>
              <tr><td><code>image.toolbar.*</code></td><td>siehe Anmerkung</td><td>{{ m.tokToolbar }}</td></tr>
              <tr><td><code>image.action.color</code> / <code>.hover.color</code></td><td><code>&#123;surface.50&#125;</code> / <code>&#123;surface.0&#125;</code></td><td>{{ m.tokAction }}</td></tr>
              <tr><td><code>image.action.size</code> / <code>.icon.size</code></td><td>3rem / 1.5rem</td><td>{{ m.tokActionSize }}</td></tr>
              <tr><td><code>image.action.focus.ring.*</code></td><td><code>&#123;focus.ring.*&#125;</code></td><td>{{ m.tokActionRing }}</td></tr>
              <tr><td><code>imagecompare.handle.size</code> / <code>.hover.size</code></td><td>15px / 30px</td><td>{{ m.tokHandleSize }}</td></tr>
              <tr><td><code>imagecompare.handle.background</code></td><td><code>rgba(255,255,255,0.3)</code></td><td>{{ m.tokHandleBg }}</td></tr>
              <tr><td><code>imagecompare.handle.focus.ring.color</code></td><td><code>rgba(255,255,255,0.3)</code></td><td>{{ m.tokHandleRing }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/image/index.mjs</code> und
          <code>…/aura/imagecompare/index.mjs</code>; Toolbar: 1rem von oben und vom Ende, <code>rgba(255,255,255,0.1)</code>
          mit 8px Backdrop-Blur, 30px Radius — das Kit färbt sie in <code>rgba(0,0,0,0.6)</code> um
          (<code>.p-image-toolbar</code> in <code>src/styles.scss</code>). <code>&#123;mask.background&#125;</code> und
          der Fokus-Ring stammen aus <code>…/aura/base/index.mjs</code>; die Ring-Liste des Kits ersetzt diesen Ring am
          Vorschau-Button und an den Toolbar-Buttons. Kein <code>html.style-*</code>-Block berührt eine der beiden
          Komponenten, und keiner dieser Token liest die Radius-Skala des Stils.
        </p>

        <h3>Fokus-Sichtbarkeit und Kontrast, im Kit</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Element</th><th>Fokus-Indikator</th><th>Kontrast</th></tr>
            </thead>
            <tbody>
              <tr><td>Vorschau-Button</td><td>{{ m.focPreview }}</td><td>{{ m.crPreview }}</td></tr>
              <tr><td>Toolbar-Buttons</td><td>{{ m.focAction }}</td><td>{{ m.crAction }}</td></tr>
              <tr><td>Vergleichs-Handle</td><td>{{ m.focHandle }}</td><td>{{ m.crHandle }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Geprüft: die Toolbar-Zeilen von <code>docs/generated/CONTRAST.MD</code> („image preview“,
          <code>image.action.color</code> auf der Platte über der Maske über jeder Seitenfläche) und der Kit-Ring auf den
          Seitenflächen („focus ring“). Nicht geprüft: Das Augen-Symbol auf dem Schleier und das Vergleichs-Handle liegen
          auf dem Bild selbst, wo es kein Token-Paar gibt — berechnet mit der WCAG-2.2-Formel aus den serienmäßigen
          Token-Werten über reinem Weiß und Schwarz.
        </p>

        <h3>Was das Kit schon tut, und der Fix, der dir bleibt</h3>
        <pre class="code-block"><code>{{ focusCssSnippet }}</code></pre>
        <pre class="code-block"><code>{{ compareDtSnippet }}</code></pre>
        <p class="src-note">
          Die eigene Regel der Bibliothek ist <code>.p-image-preview-mask:focus-visible</code> mit
          <code>outline: 0 none</code>; die Ring-Regel des Kits in <code>src/styles.scss</code> überschreibt sie global mit
          <code>!important</code>, weil der Button kein Kapselungsattribut trägt. Füge keine zweite Ring-Regel und keinen
          <code>dt</code>-Ring für eines der beiden Teile hinzu. Das Vergleichs-Handle bleibt deine Sache: Die
          Firefox-Thumb-Regel liest ein Token <code>handle.border.style</code>, das das Aura-Preset nicht definiert, also
          setz es zusammen mit dem Rahmen.
        </p>

        <h3>Schmale Bildschirme</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          <code>.p-image-original</code> ist auf <code>100vw</code> mal <code>100vh</code> begrenzt; die Inline-Größe des
          Vorschau-Buttons kommt aus <code>height + 'px'</code> und <code>width + 'px'</code>
          (<code>openng-optimus-ui-image.mjs:530</code>); <code>.p-imagecompare</code> ist <code>width: 100%</code>
          mit <code>aspect-ratio: 16 / 9</code>. Keines der beiden Stylesheets hat eine Media Query.
        </p>

        <h3>Bewegung</h3>
        <p>{{ m.motion }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs von p-image</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Anmerkung</th></tr>
            </thead>
            <tbody>
              <tr><td><code>src</code>, <code>srcSet</code>, <code>sizes</code>, <code>loading</code></td><td>{{ m.apiSrc }}</td></tr>
              <tr><td><code>alt</code></td><td>{{ m.apiAlt }}</td></tr>
              <tr><td><code>width</code>, <code>height</code></td><td>{{ m.apiSize }}</td></tr>
              <tr><td><code>imageClass</code>, <code>imageStyle</code></td><td>{{ m.apiImageStyle }}</td></tr>
              <tr><td><code>preview</code></td><td>{{ m.apiPreview }}</td></tr>
              <tr><td><code>previewImageSrc</code>, <code>previewImageSrcSet</code>, <code>previewImageSizes</code></td><td>{{ m.apiPreviewSrc }}</td></tr>
              <tr><td><code>appendTo</code></td><td>{{ m.apiAppendTo }}</td></tr>
              <tr><td>Übergangs- und Bewegungs-Inputs</td><td>{{ m.apiMotion }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklariert in <code>openng-optimus-ui-image.mjs:128-232</code>; Outputs <code>onShow</code>,
          <code>onHide</code>, <code>onImageError</code> in <code>:258-269</code>. Templates <code>#image</code>
          (erhält <code>errorCallback</code>), <code>#preview</code>, <code>#indicator</code> und fünf Icon-Templates.
          Pass-through-Abschnitte: <code>image</code>, <code>previewMask</code>, <code>previewIcon</code>,
          <code>mask</code>, <code>toolbar</code>, die fünf Button-Abschnitte, <code>original</code>.
        </p>

        <h3>Die Vorschau, Taste für Taste</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Schritt</th><th>Was passiert</th><th>Quelle</th></tr>
            </thead>
            <tbody>
              <tr><td>Mit Tab zum Bild</td><td>{{ m.kTab }}</td><td><code>:529-537</code></td></tr>
              <tr><td>Eingabetaste oder Leertaste</td><td>{{ m.kOpen }}</td><td><code>:384-392</code>, <code>:431-441</code></td></tr>
              <tr><td>Tab im Dialog</td><td>{{ m.kTrap }}</td><td><code>:546</code>, <code>:568-579</code></td></tr>
              <tr><td>Hinein- / Herauszoomen</td><td>{{ m.kZoom }}</td><td><code>:327-338</code></td></tr>
              <tr><td>Esc</td><td>{{ m.kEsc }}</td><td><code>:399-411</code>, <code>:504-508</code></td></tr>
              <tr><td>Schließen-Button, Backdrop</td><td>{{ m.kClose }}</td><td><code>:393-398</code>, <code>:483-485</code></td></tr>
            </tbody>
          </table>
        </div>

        <h3>Die Lücken schließen</h3>
        <pre class="code-block"><code>{{ previewFixSnippet }}</code></pre>
        <p class="src-note">
          Die Pass-through-Attribute setzt die Direktive <code>pBind</code> mit <code>setAttribute</code>
          (<code>openng-optimus-ui-bind.mjs:31-50</code>). Auf <code>mask</code>, <code>original</code> und
          <code>slider</code> sind sie sicher, weil die Bibliothek dort kein gleichnamiges Attribut bindet; das
          <code>aria-label</code> des Vorschau-Buttons bindet die Bibliothek selbst, deshalb wird der Button beschrieben,
          nicht umbenannt.
        </p>

        <h3>p-imagecompare</h3>
        <p>{{ m.apiCompare }}</p>
        <pre class="code-block"><code>{{ compareSnippet }}</code></pre>

        <h3>Server-Rendering</h3>
        <p>{{ m.ssr }}</p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkAlt }}</li>
          <li>{{ m.checkPreviewName }}</li>
          <li>{{ m.checkFocus }}</li>
          <li>{{ m.checkRing }}</li>
          <li>{{ m.checkCompareName }}</li>
          <li>{{ m.checkCompareText }}</li>
          <li>{{ m.checkStrings }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Alt-Text ist Inhalt</h3>
        <p>{{ m.i18nAlt }}</p>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>

        <h3>Die eigenen Texte der Bibliothek</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Schlüssel (<code>translation.aria</code>)</th><th>Standard</th><th>Wo</th><th>Kit</th></tr>
            </thead>
            <tbody>
              <tr><td><code>zoomImage</code></td><td>Zoom Image</td><td>Vorschau-Button</td><td>Seitensprache</td></tr>
              <tr><td><code>rotateRight</code>, <code>rotateLeft</code></td><td>Rotate Right, Rotate Left</td><td>Toolbar</td><td>Seitensprache</td></tr>
              <tr><td><code>zoomIn</code>, <code>zoomOut</code></td><td>Zoom In, Zoom Out</td><td>Toolbar</td><td>Seitensprache</td></tr>
              <tr><td><code>close</code></td><td>Close</td><td>Toolbar</td><td>Seitensprache</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Standardwerte in <code>openng-optimus-ui-config.mjs:184</code> und <code>:222-226</code>. Das Kit übergibt
          Optimus einen festen Satz von <code>aria</code>-Schlüsseln in der Seitensprache (<code>OPTIMUS_ARIA_KEYS</code>
          und <code>syncAriaStrings()</code> in <code>src/app/services/optimus-a11y.service.ts</code>); alle sechs
          Vorschau-Schlüssel sind darin enthalten. ImageCompare hat keine Texte.
        </p>

        <h3>Text in Bildern</h3>
        <p>{{ m.i18nText }}</p>

        <h3>Schreibrichtung</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.1</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Die Ringe von
            Vorschau-Button und Toolbar, die Toolbar-Platte und die fünf Vorschau-Texte gehören jetzt dem Kit und werden
            aus CONTRAST.MD zitiert; die eigene Ring-Regel und das <code>dt</code> dieser Seite sind entfernt.
          </li>
          <li><strong>1.0</strong> — 23.09.2026 — Erste Fassung, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class ImageArticleDeComponent extends ImageArticleComponent {
  override readonly previewPt = {
    mask: { 'aria-label': 'Vergrößertes Diagramm: Wahrscheinlichkeiten für das nächste Token' },
    original: {
      alt: 'Balkendiagramm mit fünf Kandidaten für das nächste Token. Der erste Balken erreicht etwa 60 Prozent; die anderen vier bleiben jeweils unter 15 Prozent.',
    },
    previewMask: { 'aria-describedby': 'img-guide-cap' },
  };

  override readonly comparePt = { slider: { 'aria-label': 'Eingefärbter Anteil des Bildes, in Prozent' } };

  /** Visible German strings; same keys as the English `m`. */
  override readonly m = {
    chartAlt:
      'Balkendiagramm mit fünf Kandidaten für das nächste Token. Der erste erreicht etwa 60 Prozent; die anderen vier bleiben jeweils unter 15 Prozent.',
    chartCaption:
      'Wahrscheinlichkeiten für das nächste Token: 60, 12, 9, 6 und 4 Prozent für die fünf wahrscheinlichsten Kandidaten.',
    previewTry:
      'Geh mit Tab zum Diagramm und drück die Eingabetaste: Der Fokus landet auf „Schließen“, Tab läuft reihum durch die fünf Toolbar-Buttons, und Esc, „Schließen“ oder ein Klick auf den Backdrop bringen dich zurück zum Diagramm.',
    grayAlt: 'Eine Landschaft in Graustufen: ein kleines Haus auf einem Hügel unter der Sonne.',
    colorAlt: 'Dieselbe Landschaft in Farbe: blauer Himmel, gelbe Sonne, grüner Hügel, ein Haus mit rotem Dach.',
    compareCaption:
      'Die Einfärbung fügt einen blauen Himmel, eine gelbe Sonne, einen grünen Hügel und ein rotes Dach hinzu. Formen und Bildaufbau bleiben unverändert.',

    // usage — alt table
    altInformative:
      'Sag, was das Bild zum umgebenden Text beiträgt, nicht, wie es im Detail aussieht. Kein „Bild von“ — das sagt die Rolle schon.',
    altDecorative:
      'Ein leeres Alt nimmt das Bild aus dem Baum. Ein fehlendes Alt bewirkt das Gegenteil: Viele Screenreader weichen auf den Dateinamen aus.',
    altComplex:
      'Ein Alt fasst einen Satz, keine Tabelle. Setz die Zahlen in die Bildunterschrift oder in eine Tabelle neben dem Bild, und beschränk das Alt auf die Erkenntnis.',
    altFunctional:
      'Das Bild ist der Linktext. „Profil“ oder „Bericht herunterladen“ sagt dem Nutzer, wohin er kommt; eine Beschreibung des Bildes tut das nicht.',
    altText:
      'Ein Bild von Text lässt sich nicht übersetzen, nicht vergrößern und nicht umgestalten. Nimm lieber echten Text; wenn nicht, wiederholt das Alt ihn Wort für Wort.',

    previewWhen:
      'Schalte die Vorschau ein, wenn ein Leser davon profitiert, das Bild größer als die Spalte zu sehen: ein Foto mit Details, ein Screenshot. Lass sie bei dekorativen Bildern und bei Bildern in Links aus. Die Vorschau ist keine Lesehilfe für Kleingedrucktes — der Zoom endet bei 140 % und lässt sich nicht verschieben.',
    compareWhen:
      'Der Vergleich ist bedienbar: Der Slider ist ein natives Range-Input, also erreicht Tab ihn, und die Pfeiltasten, Pos1 und Ende bewegen ihn ohne jede Hilfe der Bibliothek. Was er nicht kann, ist irgendwem zu sagen, was sich verändert hat. Das Freilegen ist ein Zuschnitt (Clip) auf einem der beiden Bilder; ein Screenreader hört zwei Alt-Texte und einen Slider, dessen Zahl nichts verändert, was er wahrnehmen kann.',
    compareNot1:
      'Nutze ihn nicht, wenn der Unterschied die Botschaft ist und jeden Leser erreichen muss — sag den Unterschied im Text.',
    compareNot2:
      'Nutze ihn nicht für Bilder mit unterschiedlicher Größe oder unterschiedlichem Ausschnitt: Beide werden in eine feste 16:9-Box gestreckt.',
    compareNot3: 'Nutze ihn nicht für feine Details, die Zoom brauchen — die Komponente hat keinen.',
    compareNot4:
      'Liefere ihn nicht mit dem serienmäßigen Handle aus: Weiß mit 30 % Deckkraft ist auf einem hellen Bild unsichtbar, fokussiert oder nicht.',
    compareInstead:
      'Stattdessen: zwei Abbildungen nebeneinander (auf schmalen Bildschirmen untereinander), jede mit eigenem Alt und eigener Bildunterschrift, und ein Satz, der die Veränderung benennt. Setz ImageCompare als Erweiterung obendrauf, nie an dessen Stelle.',

    altBadWhy:
      '„Diagramm“ ist das, was die Rolle schon ansagt. Der Leser erfährt, dass es ein Diagramm gibt, nicht, was es zeigt.',
    altGoodWhy: 'Das Alt trägt die Erkenntnis; die Bildunterschrift trägt die Zahlen für jeden, der sie haben will.',
    compareBadWhy:
      'Beide Alts sagen „Landschaft“, und nichts sonst beschreibt die Veränderung. Ein Screenreader-Nutzer hört zweimal dasselbe Wort und einen Slider; ein Tastatur-Nutzer kann die Kante bewegen, bekommt aber keine Worte für das, was erscheint.',
    compareGoodWhy:
      'Jeder bekommt beide Bilder, eine Bildunterschrift pro Bild und den Unterschied in einem Satz. Das funktioniert auch ohne den Slider, auf jeder Bildschirmbreite.',
    thumbBadWhy:
      'Bei 6rem lassen sich die Balken nicht vergleichen, und die Vorschau vergrößert das Bild auf den Viewport und höchstens 140 % davon. Der einzige Weg zu den Daten führt durch ein Modal.',
    thumbGoodWhy:
      'Das Diagramm ist in Spaltenbreite lesbar, und die Bildunterschrift nennt die Zahlen, also braucht es weder Sehkraft noch Zoom.',

    // design
    tokMaskBg:
      'den Schleier des Vorschau-Buttons bei Hover oder Fokus und den Vollbild-Backdrop: rgba(0,0,0,0.4) hell, rgba(0,0,0,0.6) dunkel',
    tokMaskFg: 'das Augen-Symbol auf dem Vorschau-Button: {surface.200}',
    tokToolbar:
      'die Pille mit den fünf Buttons, fest 1rem von oben und vom Ende; Aura macht sie zu Glas mit 10 % Weiß, das Kit zu einer Platte mit 60 % Schwarz',
    tokAction: 'die Toolbar-Icons: fast weiß in beiden Farbschemata, weil die Platte immer dunkel ist',
    tokActionSize: 'jeder Toolbar-Button ist 48px im Quadrat — über dem Zielgrößen-Minimum von 24px',
    tokActionRing:
      'Aura: 1px solid {primary.color} mit 2px Abstand — das Kit ersetzt ihn durch seinen 2px-Ring in der eigenen Farbe des Icons (currentColor)',
    tokHandleSize:
      'den Thumb des Range-Inputs; das ganze Input überspannt das Bild, also ist die Zielfläche für den Zeiger groß',
    tokHandleBg: 'den Thumb selbst, standardmäßig ohne Rahmen',
    tokHandleRing: 'den einzigen Fokus-Indikator des Inputs, das outline: none hat',

    focPreview:
      'der eine Ring des Kits, 2px --primary-color-fg mit 2px Abstand, über dem outline: 0 none der Bibliothek; der Button blendet außerdem von opacity 0 zur Maskenfarbe über',
    crPreview:
      'der Ring auf den Seitenflächen 3,88–17,85:1 (CONTRAST.MD „focus ring“); das Augen-Symbol auf dem Schleier über einem weißen Bild 2,31:1 — hängt vom Bild ab, nicht geprüft',
    focAction:
      '2px-Ring in der Icon-Farbe (currentColor) mit 2px Abstand; das Padding der Toolbar hält ihn auf der Platte',
    crAction:
      'Icons auf der Platte mit 60 % Schwarz 10,38–19,75:1, bei Hover 8,06–17,03:1, über jeder Seitenfläche (CONTRAST.MD „image preview“); der Ring hat dieselbe Farbe',
    focHandle: '1px-Outline in Weiß mit 30 % Deckkraft um einen Thumb in Weiß mit 30 % Deckkraft',
    crHandle: '1,00:1 über Weiß, 2,46:1 über Schwarz — unsichtbar auf hellen Bildern',

    narrow:
      'Das Vorschaubild hat kein eigenes responsives Verhalten: Mit den Inputs width und height behält es diese Pixel und läuft über, und der Vorschau-Button übernimmt dieselben Pixel aus seinem Inline-Style. Lass width und height ungesetzt und bemiss das Bild mit imageStyle (width 100%, height auto, ein aspect-ratio, um den Platz zu reservieren) auf einem Host auf Blockebene. Die Vorschau passt in jeden Viewport — das Bild ist auf 100vw mal 100vh begrenzt, und die Toolbar braucht etwa 306px von der Endkante, sodass sie bei 320px den oberen Teil des Bildes verdeckt —, aber ein gezoomtes Bild, das über den Viewport hinauswächst, wird abgeschnitten und lässt sich weder scrollen noch verschieben. ImageCompare ist width 100% bei festem 16:9-Verhältnis und schrumpft mit seinem Container; auf einem Smartphone werden die Bilder klein, und der Thumb bleibt 15px (24px mit dem Fix).',
    motion:
      'Die Vorschau blendet und skaliert über 300ms ein und aus, die Maske über 150ms, und Drehen und Zoomen animieren die Transformation über 300ms; das Vergleichs-Handle gleitet mit dem Transition-Token 0.2s. Keines der Stylesheets fragt prefers-reduced-motion ab. Der globale Reduced-Motion-Block des Kits in src/styles.scss kürzt jede Animation und jede Transition auf 0.01ms, also wird unter reduce alles davon zu einem sofortigen Wechsel.',

    // development
    apiSrc:
      'Werden als Attribute an das <img> weitergegeben. loading="lazy" beachtet nur das Vorschaubild; das Vorschau-Bild lädt beim Öffnen.',
    apiAlt: 'Als Attribut gebunden; ungesetzt heißt: gar kein Alt. Das vergrößerte Bild bekommt es nie.',
    apiSize:
      'Attribute auf dem Vorschaubild und außerdem die Inline-Höhe und -Breite des Vorschau-Buttons in px. Strings wie "100%" werden zu "100%px" und verworfen.',
    apiImageStyle: 'Klasse und Inline-Style für das <img> des Vorschaubilds — der Weg, es flexibel zu machen.',
    apiPreview: 'Fügt den Vorschau-Button und das Overlay hinzu. Boolesches Attribut.',
    apiPreviewSrc: 'Eine größere Datei für das Overlay; fällt auf src zurück.',
    apiAppendTo: 'Wohin das Overlay kommt; Standard ist "self", sodass Stile mit Artikel-Geltungsbereich es erreichen.',
    apiMotion:
      'showTransitionOptions, hideTransitionOptions, modalEnterAnimation, modalLeaveAnimation, maskMotionOptions, motionOptions — nur Timing.',

    kTab: 'Der einzige Halt ist ein unsichtbarer <button> über dem Bild, benannt aus der globalen Konfiguration („Zoom Image“ als Standard; das Kit übergibt ihn in der Seitensprache) — derselbe Name für jedes Bild auf der Seite.',
    kOpen:
      'Die Maske rendert als role="dialog" aria-modal="true" ohne Namen; die Seite hört auf zu scrollen; nach 25ms springt der Fokus auf „Schließen“.',
    kTrap:
      'pFocusTrap läuft reihum durch „Nach rechts drehen“, „Nach links drehen“, „Herauszoomen“, „Hineinzoomen“, „Schließen“. Ein Zoom-Button an seiner Grenze wird deaktiviert und fällt aus dem Zyklus.',
    kZoom:
      'Nur Buttons — keine +/−-Tasten, kein Mausrad, kein Verschieben. Schritte von 0,1 ab 1; Hineinzoomen endet bei 1,4, Herauszoomen bei 0,5. Die Grenzen sind keine Inputs. Der Button, der seine Grenze erreicht, wird unter dem Fokus deaktiviert, und der Fokus fällt auf den Body des Dokuments; der nächste Tab landet auf „Schließen“.',
    kEsc: 'Schließt, und der Fokus kehrt nach 25ms zum Vorschau-Button zurück. Ein zweiter Handler am Dokument schließt ebenfalls.',
    kClose:
      'Schließt, ohne den Fokus zu bewegen: Der fokussierte Button wird entfernt, und der Fokus fällt auf das Dokument. Nach einem Klick in der Toolbar setzt der erste Klick auf den Backdrop nur ein Flag zurück; erst der zweite schließt.',

    apiCompare:
      'Die Inputs tabindex, ariaLabel und ariaLabelledby werden alle auf den Host gebunden, der keine Rolle hat — ein Name dort erreicht den Slider nicht, und tabindex fügt einen zweiten, nutzlosen Tab-Halt hinzu. Die Templates #left und #right rendern je ein Element; das zweite muss ein <img> direkt vor dem Input sein, weil das Stylesheet img + img zuschneidet und das Script previousElementSibling zuschneidet. #left ist die untere Ebene, sichtbar zur Endseite des Handles hin; #right liegt oben und wird von der Startkante her freigelegt. Der Slider beginnt bei 50, hat die Schrittweite 1, und es gibt weder ein Input, um den Start zu setzen, noch ein Output, um die Position zu lesen; aria-valuetext wird nie gesetzt, also wird der Wert als nackte Zahl angesagt.',
    ssr: 'Beide rendern auf dem Server vollständig. Das Vorschau-Overlay existiert erst nach einem Klick. ImageCompare startet seinen MutationObserver nur im Browser (isPlatformBrowser, openng-optimus-ui-imagecompare.mjs:121), und p-image lauscht in jeder Instanz auf Escape am Dokument, ob offen oder nicht.',

    checkAlt: 'Jedes p-image hat ein Alt — einen Satz, oder "" für Dekoration. Lass es nie ungesetzt.',
    checkPreviewName:
      'Mit eingeschalteter Vorschau: pt benennt die Maske, gibt dem vergrößerten Bild sein Alt und beschreibt den Vorschau-Button über die Bildunterschrift.',
    checkFocus:
      'onHide gibt den Fokus an den Vorschau-Button zurück, sodass „Schließen“ und der Backdrop sich wie Escape verhalten.',
    checkRing:
      'Keine eigene Ring-Regel und kein eigenes dt auf .p-image-preview-mask oder den Toolbar-Buttons — das Kit gibt beiden einen Ring; eine zweite Regel würde auseinanderlaufen.',
    checkCompareName:
      'ImageCompare: Name über pt.slider, das Handle über dt neu gestalten, nie tabindex setzen.',
    checkCompareText: 'Der Unterschied zwischen den beiden Bildern steht als Text neben dem Vergleich.',
    checkStrings:
      'Die Vorschau-Texte kommen vom Kit in der Seitensprache; eine neue Locale ergänzt sie in ihrer optimus.json.',

    // i18n
    i18nAlt:
      'Jedes Alt, jede Bildunterschrift und jeder Pass-through-Name ist Text in deinem Template, also folgt er dem Muster des Kits: ein Übersetzungsschlüssel, gelesen in einem computed. Varianten in Leichter Sprache brauchen ihr eigenes Alt — kürzere Sätze, kein Fachjargon —, keine Kopie des Standard-Alts.',
    i18nText:
      'Alles, was im Bild geschrieben steht, bleibt in einer Sprache, lässt sich nicht mit dem Seitentext vergrößern und muss im Alt wiederholt werden. Die Beispiele auf dieser Seite tragen deshalb keinen Text in ihren Bildern.',
    i18nRtl:
      'Die Toolbar der Vorschau wird mit inset-inline-end platziert, wandert unter dir="rtl" also nach links. ImageCompare liest dir="rtl" von seinem nächsten Vorfahren, beobachtet das Dokument-Element auf Änderungen und spiegelt den Zuschnitt: Das obere Bild wird von der rechten Kante her freigelegt.',
  };
}
