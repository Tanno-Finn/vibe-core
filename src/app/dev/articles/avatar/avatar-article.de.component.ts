import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AvatarArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './avatar-article.component';

/**
 * German twin of the Avatar and AvatarGroup guide (ADR-0018).
 *
 * Extends the English canonical article, so state, handlers, measured values and
 * code snippets are shared; only the template and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and
 * binding skeleton (`node scripts/check-guide-translations.mjs avatar`).
 */
@Component({
  selector: 'app-avatar-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'avatar'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Ein Avatar ist eine kleine Box mit Initialen, einem Icon oder einem Bild darin. Er sagt nichts darüber, wen er
          zeigt: Der Host hat keine Rolle, und das Bild hat keinen Alternativtext. Der Name kommt immer von dir —
          entweder als sichtbarer Text daneben oder als Name, den du dem Avatar selbst gibst.
        </p>

        <h3>Drei Arten von Inhalt, zwei Formen, drei Größen</h3>
        <div class="stage">
          <ul class="grid" role="list">
            <li>
              <p-avatar label="AL" aria-hidden="true" />
              <span>label</span>
            </li>
            <li>
              <p-avatar icon="pi pi-user" aria-hidden="true" />
              <span>icon</span>
            </li>
            <li>
              <p-avatar [image]="portraitUri" aria-hidden="true" />
              <span>image</span>
            </li>
            <li>
              <p-avatar label="AL" shape="circle" aria-hidden="true" />
              <span>circle</span>
            </li>
            <li>
              <p-avatar label="AL" size="large" aria-hidden="true" />
              <span>large</span>
            </li>
            <li>
              <p-avatar label="AL" size="xlarge" shape="circle" aria-hidden="true" />
              <span>xlarge</span>
            </li>
          </ul>
        </div>
        <p class="src-note">
          Echte <code>p-avatar</code>-Instanzen aus <code>&#64;openng/optimus-ui/avatar</code>. Das sichtbare Wort unter
          jeder Box ist ihre Beschriftung, also sind die Boxen vor assistiver Technik verborgen. Die Größen sind
          <code>avatar.width</code> 2rem, <code>avatar.lg.width</code> 3rem, <code>avatar.xl.width</code> 4rem in
          <code>&#64;openng/optimus-ui-themes/dist/aura/avatar/index.mjs</code>.
        </p>

        <h3>Eine Autorenzeile: Der Name ist Text, der Avatar ist Dekoration</h3>
        <div class="stage">
          <p class="byline">
            <p-avatar [image]="portraitUri" shape="circle" size="large" aria-hidden="true" />
            <span><strong>Ada Example</strong><br /><span class="muted">Autorin</span></span>
          </p>
        </div>
        <p class="src-note">
          Der Name der Person ist sichtbarer Text, also ergänzt der Avatar nichts, was ein Screenreader braucht:
          <code>aria-hidden="true"</code> hält ihn aus dem Baum heraus. Name und Porträt sind synthetisch.
        </p>

        <h3>Ein alleinstehender Avatar: Benenne den Host und gib ihm eine Rolle</h3>
        <div class="stage">
          <p-avatar label="AE" shape="circle" role="img" ariaLabel="Ada Example" />
          <p-avatar [image]="portraitUri" shape="circle" role="img" ariaLabel="Ada Example" />
        </div>
        <p class="src-note">
          <code>ariaLabel</code> wird auf den Host geschrieben und im image-Zweig auch auf das innere
          <code>&lt;img&gt;</code> (<code>openng-optimus-ui-avatar.mjs:177</code>, <code>:186</code>). Das statische
          <code>role="img"</code> macht den Host zu einem benennbaren Bild, dessen Kinder präsentational sind, also wird
          der Name einmal angesagt und die Initialen werden nicht buchstabiert.
        </p>

        <h3>Eine Gruppe mit Überlauf-Zähler</h3>
        <div class="stage">
          <p-avatar-group role="img" [attr.aria-label]="m.groupName">
            <p-avatar label="AE" shape="circle" />
            <p-avatar label="GH" shape="circle" />
            <p-avatar label="KJ" shape="circle" />
            <p-avatar label="+3" shape="circle" />
          </p-avatar-group>
        </div>
        <p class="src-note">
          <code>p-avatar-group</code> rendert nichts außer <code>&lt;ng-content&gt;</code> auf einem Flex-Host
          (<code>openng-optimus-ui-avatargroup.mjs:62</code>); die Überlappung ist
          <code>.p-avatar-group .p-avatar + .p-avatar</code> mit <code>margin-inline-start: -0.75rem</code>. Die ganze
          Gruppe ist hier ein Bild, benannt mit dem vollständigen Satz, für den die Bilder stehen.
        </p>

        <h3>Wenn das Bild nicht lädt</h3>
        <div class="stage stage--col">
          <button type="button" class="demo-btn" [attr.aria-pressed]="broken()" (click)="toggleBroken()">
            Fehlgeschlagenes Bild simulieren
          </button>
          <p class="byline">
            @if (failed()) {
              <p-avatar label="AE" shape="circle" size="large" aria-hidden="true" />
            } @else {
              <p-avatar
                [image]="broken() ? brokenUri : portraitUri"
                shape="circle"
                size="large"
                aria-hidden="true"
                (onImageError)="failed.set(true)" />
            }
            <span><strong>Ada Example</strong></span>
          </p>
        </div>
        <p class="src-note">
          <code>onImageError</code> gibt das <code>error</code>-Event des Bildes weiter
          (<code>openng-optimus-ui-avatar.mjs:137-139</code>). Die Komponente fällt nicht von selbst zurück: Der Handler
          setzt ein <code>label</code> ein, das im Template vor <code>image</code> gewinnt
          (<code>:170-179</code>). Die fehlerhafte Quelle ist eine kaputte Data-URI, also verlässt keine Anfrage die Seite.
        </p>

        <h3>Was die Komponente rendert</h3>
        <pre class="code-block"><code>{{ anatomySnippet }}</code></pre>
        <p class="src-note">
          Host-Bindings aus <code>openng-optimus-ui-avatar.mjs:184-189</code>, Template aus <code>:168-181</code>.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <h3>Welches Muster für den Namen</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Situation</th><th>Markup</th><th>Warum</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Der Name steht sichtbar neben dem Avatar</td>
                <td><code>aria-hidden="true"</code> an <code>p-avatar</code></td>
                <td>{{ m.useAdjacent }}</td>
              </tr>
              <tr>
                <td>Der Avatar steht allein</td>
                <td><code>role="img"</code> + <code>ariaLabel</code></td>
                <td>{{ m.useAlone }}</td>
              </tr>
              <tr>
                <td>Der Avatar öffnet ein Profil</td>
                <td>ein Link drumherum, der Avatar verborgen</td>
                <td>{{ m.useLink }}</td>
              </tr>
              <tr>
                <td>Ein Stapel Personen, als eine Tatsache</td>
                <td><code>p-avatar-group role="img"</code> + ein Name</td>
                <td>{{ m.useGroup }}</td>
              </tr>
              <tr>
                <td>Jede Person im Stapel zählt</td>
                <td>eine Liste, keine überlappende Gruppe</td>
                <td>{{ m.useList }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Keiner der beiden Hosts bindet eine Rolle (<code>openng-optimus-ui-avatar.mjs:184-189</code>,
          <code>openng-optimus-ui-avatargroup.mjs:62</code>). Ein autonomes Custom Element wird auf
          <code>generic</code> abgebildet (HTML-AAM), und WAI-ARIA 1.2 verbietet, ein generisches Element zu benennen —
          also ist ein <code>ariaLabel</code> auf einem Host ohne Rolle kein verlässlicher Name.
        </p>

        <h3>Do und Don’t</h3>
        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — Initialen als einziger Name</span>
            <div class="dd__stage">
              <p-avatar label="AE" shape="circle" />
            </div>
            <p class="dd__why">{{ m.initialsWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — der volle Name, einmal</span>
            <div class="dd__stage">
              <p-avatar label="AE" shape="circle" role="img" ariaLabel="Ada Example" />
            </div>
            <p class="dd__why">{{ m.initialsDoWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — ein Klick-Handler am Avatar</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ clickBadSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.clickWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — ein echter Link, der Avatar darin</span>
            <div class="dd__stage">
              <pre class="code-block"><code>{{ clickGoodSnippet }}</code></pre>
            </div>
            <p class="dd__why">{{ m.clickDoWhy }}</p>
          </div>
        </div>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — eine überlappende Gruppe von Personen, die jeweils zählen</span>
            <div class="dd__stage">
              <p-avatar-group role="img" aria-label="Reviewer">
                <p-avatar label="AE" />
                <p-avatar label="GH" />
                <p-avatar label="KJ" />
              </p-avatar-group>
            </div>
            <p class="dd__why">{{ m.groupWhy }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — eine Liste mit Namen</span>
            <div class="dd__stage">
              <ul class="people" aria-label="Reviewer">
                <li><p-avatar label="AE" shape="circle" aria-hidden="true" /> Ada Example</li>
                <li><p-avatar label="GH" shape="circle" aria-hidden="true" /> Grace Hopkins</li>
                <li><p-avatar label="KJ" shape="circle" aria-hidden="true" /> Kay Jensen</li>
              </ul>
            </div>
            <p class="dd__why">{{ m.groupDoWhy }}</p>
          </div>
        </div>
        <p class="src-note">
          Alle sechs Zellen sind echt oder zitieren das Markup, das sie beschreiben. Die Überlappung in der ersten Gruppe
          ist der Inline-Margin des Stylesheets von <code>-0.75rem</code> in der Standardgröße; die eckige Form folgt dem
          Radius des visuellen Stils.
        </p>

        <h3>Quellen</h3>
        <ul class="checklist">
          <li>
            <code>openng-optimus-ui-avatar.mjs</code> und <code>openng-optimus-ui-avatargroup.mjs</code> (Optimus UI
            2.0.2) — jeder Input, jedes Host-Binding und jeder Template-Zweig, der hier zitiert wird.
          </li>
          <li>
            <code>&#64;openng/optimus-ui-styles/dist/avatar/index.mjs</code> — die Box, die Bildgröße und die Überlappung
            der Gruppe; <code>&#64;openng/optimus-ui-themes/dist/aura/avatar/index.mjs</code> — die Token-Standardwerte.
          </li>
          <li>
            <a href="https://www.w3.org/TR/wai-aria-1.2/#img" rel="noopener noreferrer" target="_blank">WAI-ARIA 1.2,
              img role</a>
            — warum <code>role="img"</code> einen Namen tragen kann und seine Kinder verbirgt.
          </li>
          <li>
            <a href="https://www.w3.org/TR/html-aam-1.0/" rel="noopener noreferrer" target="_blank">HTML-AAM</a>
            — autonome Custom Elements werden auf <code>generic</code> abgebildet, das keinen Namen bekommen darf.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html" rel="noopener noreferrer"
              target="_blank">WCAG 2.2 SC 1.1.1</a>
            — jedes Bild braucht eine Textalternative oder muss als dekorativ markiert sein.
          </li>
          <li>
            <a href="https://www.w3.org/WAI/tutorials/images/decorative/" rel="noopener noreferrer" target="_blank"
              >W3C Images Tutorial, decorative images</a>
            — wann ein Bild neben seiner eigenen Beschriftung Dekoration ist.
          </li>
        </ul>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <h3>Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Aura-Wert</th><th>Löst auf zu</th></tr>
            </thead>
            <tbody>
              <tr><td><code>avatar.background</code></td><td><code>&#123;content.border.color&#125;</code></td><td>{{ m.tokBg }}</td></tr>
              <tr><td><code>avatar.color</code></td><td><code>&#123;content.color&#125;</code></td><td>{{ m.tokFg }}</td></tr>
              <tr><td><code>avatar.border.radius</code></td><td><code>&#123;content.border.radius&#125;</code></td><td>{{ m.tokRadius }}</td></tr>
              <tr><td><code>avatar.width</code> / <code>.lg</code> / <code>.xl</code></td><td>2rem · 3rem · 4rem</td><td>{{ m.tokSize }}</td></tr>
              <tr><td><code>avatar.font.size</code> / <code>.lg</code> / <code>.xl</code></td><td>1rem · 1.5rem · 2rem</td><td>{{ m.tokFont }}</td></tr>
              <tr><td><code>avatar.group.border.color</code></td><td><code>&#123;content.background&#125;</code></td><td>{{ m.tokGroupBorder }}</td></tr>
              <tr><td><code>avatar.group.offset</code> / <code>.lg</code> / <code>.xl</code></td><td>-0.75rem · -1rem · -1.5rem</td><td>{{ m.tokOffset }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/avatar/index.mjs</code>; semantische Auflösungen aus
          <code>&#64;openng/optimus-ui-themes/dist/aura/base/index.mjs</code> (slate hell, zinc dunkel, ab Werk).
        </p>

        <h3>Eckenradius je visuellem Stil</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Stil</th><th><code>border.radius.md</code></th><th>Eckiger Avatar, 2rem</th></tr>
            </thead>
            <tbody>
              <tr><td>werkbund</td><td>0</td><td>{{ m.radWerkbund }}</td></tr>
              <tr><td>lernwerkstatt</td><td>12px</td><td>{{ m.radLern }}</td></tr>
              <tr><td>skizzenbuch</td><td>10px</td><td>{{ m.radSkizze }}</td></tr>
              <tr><td>blaupause</td><td>2px</td><td>{{ m.radBlau }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>primitive.borderRadius</code> wird je Stil in <code>src/app/services/ui-styles.ts</code> überschrieben;
          <code>shape="circle"</code> setzt <code>border-radius: 50%</code> auf Host und Bild und ignoriert den Stil.
          Kein <code>html.style-*</code>-Block in <code>src/styles.scss</code> berührt den Avatar.
        </p>

        <h3>Kontrast</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Paar</th><th>Hell</th><th>Dunkel</th><th>Kriterium</th></tr>
            </thead>
            <tbody>
              <tr><td>Label-Text auf Avatar-Hintergrund</td><td>{{ m.crTextLight }}</td><td>{{ m.crTextDark }}</td><td>SC 1.4.3, 4,5:1</td></tr>
              <tr><td>Avatar-Hintergrund auf <code>--surface-card</code></td><td>{{ m.crBgCard }}</td><td>{{ m.crBgCardDark }}</td><td>{{ m.crBgNote }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Das Label-Paar ist im Gate: die Zeilen „avatar“ in <code>docs/generated/CONTRAST.MD</code>
          (<code>avatar.color</code> auf <code>avatar.background</code>, <code>#334155</code> auf <code>#e2e8f0</code>;
          <code>#ffffff</code> auf <code>#3f3f46</code>), gleich in jedem visuellen Stil, bei jedem Build neu berechnet.
          Die Box gegen die Card ist nur zur Information und nicht im Gate — berechnet mit der Formel aus WCAG 2.2 gegen
          die Card-Flächen von werkbund (<code>#ffffff</code>, <code>#1d1d21</code>).
        </p>

        <h3>Das Bild wird gestreckt, nicht beschnitten</h3>
        <p>{{ m.stretch }}</p>
        <pre class="code-block"><code>{{ coverSnippet }}</code></pre>
        <p class="src-note">
          <code>.p-avatar img</code> setzt <code>width: 100%; height: 100%</code> und sonst nichts in
          <code>&#64;openng/optimus-ui-styles/dist/avatar/index.mjs</code>; der Pass-through-Abschnitt <code>image</code>
          ist das <code>&lt;img&gt;</code> (<code>openng-optimus-ui-avatar.mjs:177</code>).
        </p>

        <h3>Schmale Bildschirme</h3>
        <p>{{ m.narrow }}</p>
        <p class="src-note">
          Das Avatar-Stylesheet hat keine Media oder Container Query; <code>.p-avatar-group</code> ist
          <code>display: flex</code> ohne <code>flex-wrap</code>.
        </p>

        <h3>Bewegung</h3>
        <p>{{ m.motion }}</p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <h3>Inputs und Output von p-avatar</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Member</th><th>Typ / Standard</th><th>Hinweis</th></tr>
            </thead>
            <tbody>
              <tr><td><code>label</code></td><td>string</td><td>{{ m.apiLabel }}</td></tr>
              <tr><td><code>icon</code></td><td>string (Icon-Klassen)</td><td>{{ m.apiIcon }}</td></tr>
              <tr><td><code>image</code></td><td>string (URL)</td><td>{{ m.apiImage }}</td></tr>
              <tr><td><code>size</code></td><td><code>'normal'</code> · <code>'large'</code> · <code>'xlarge'</code></td><td>{{ m.apiSize }}</td></tr>
              <tr><td><code>shape</code></td><td><code>'square'</code> · <code>'circle'</code></td><td>{{ m.apiShape }}</td></tr>
              <tr><td><code>ariaLabel</code> / <code>ariaLabelledBy</code></td><td>string</td><td>{{ m.apiAria }}</td></tr>
              <tr><td><code>styleClass</code></td><td>string</td><td>{{ m.apiStyleClass }}</td></tr>
              <tr><td><code>onImageError</code></td><td>Output, <code>Event</code></td><td>{{ m.apiError }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Deklariert in <code>openng-optimus-ui-avatar.mjs:89-135</code>; <code>dt</code>, <code>pt</code> und
          <code>unstyled</code> sind von <code>BaseComponent</code> geerbt. Pass-through-Abschnitte:
          <code>host</code>, <code>root</code>, <code>label</code>, <code>icon</code>, <code>image</code>.
        </p>

        <h3>p-avatar-group</h3>
        <p>{{ m.apiGroup }}</p>
        <p class="src-note">
          <code>openng-optimus-ui-avatargroup.mjs:62</code> — drei Selektoren, zwei Inputs, ein Template aus
          <code>&lt;ng-content&gt;</code>. Sein CSS steht im Avatar-Stylesheet, also hat die Gruppe keine Styles, bis ein
          Avatar auf der Seite sie geladen hat.
        </p>

        <h3>Fallback bei einem fehlgeschlagenen Bild</h3>
        <pre class="code-block"><code>{{ fallbackSnippet }}</code></pre>
        <p class="src-note">
          Der label-Zweig wird zuerst geprüft (<code>openng-optimus-ui-avatar.mjs:170</code>), also ersetzt ein nach dem
          Fehler gesetztes <code>label</code> das kaputte Bild, ohne <code>image</code> zu entfernen.
        </p>

        <h3>Server-Rendering</h3>
        <p>{{ m.ssr }}</p>

        <h3>Checkliste</h3>
        <ul class="checklist">
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkRole }}</li>
          <li>{{ m.checkInteractive }}</li>
          <li>{{ m.checkFallback }}</li>
          <li>{{ m.checkGroup }}</li>
          <li>{{ m.checkData }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <h3>Was die Bibliothek beiträgt</h3>
        <p>{{ m.i18nLibrary }}</p>
        <p class="src-note">
          Das Avatar-Template rendert nur dein <code>label</code>; aus der Übersetzungskonfiguration von Optimus wird
          nichts gelesen.
        </p>

        <h3>Initialen reisen nicht mit</h3>
        <p>{{ m.i18nInitials }}</p>

        <h3>Der Name, übersetzt</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          Das Muster des Kits: <code>TranslationService.translate()</code> in einem <code>computed</code>, das bei einem
          Sprachwechsel neu läuft.
        </p>

        <h3>Schreibrichtung</h3>
        <p>{{ m.i18nRtl }}</p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.1</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: Das Label-Paar wird aus
            den Zeilen „avatar“ der geprüften CONTRAST.MD zitiert.
          </li>
          <li><strong>1.0</strong> — 23.09.2026 — Erste Version, gemessen an Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class AvatarArticleDeComponent extends AvatarArticleComponent {
  override readonly m = {
    groupName: 'Bearbeitet von Ada Example, Grace Hopkins, Kay Jensen und 3 weiteren Personen',

    // usage — naming table
    useAdjacent:
      'Der Name steht schon als Text im Baum. Eine zweite Kopie vom Avatar ist Rauschen; Initialen würden Buchstabe für Buchstabe vorgelesen.',
    useAlone:
      'role="img" macht aus dem generischen Host ein Bild, das einen Namen tragen darf, und macht seine Kinder präsentational — die Initialen oder das innere Bild werden nicht doppelt gelesen.',
    useLink:
      'Der Link ist das interaktive Element und nimmt seinen Namen aus dem sichtbaren Namen in ihm. Der Avatar hat keine eigene Tastaturbedienung, keinen eigenen Fokus und keine eigene Rolle.',
    useGroup:
      'Wenn der Stapel eine Sache bedeutet („7 Personen haben das bearbeitet“), sagt es ein Name für die ganze Gruppe. Die Mitglieder sind präsentationale Kinder des Bildes.',
    useList:
      'Die Überlappung verdeckt einen Teil jedes Avatars außer dem letzten, und eine Gruppe hat keine Listen-Semantik. Wenn jede Person zählt, liefert eine Liste Anzahl, Reihenfolge und einen Namen pro Eintrag.',

    // usage — do/don't
    initialsWhy:
      'Ohne Rolle oder Namen ist das Label-Span reiner Text: Ein Screenreader liest „A E“, was weder ein Name ist noch ein Hinweis darauf, dass es für eine Person steht.',
    initialsDoWhy:
      'role="img" mit ariaLabel sagt einmal „Ada Example, Grafik“ an. Die Initialen bleiben sichtbar und fallen als präsentationale Kinder aus dem Baum.',
    clickWhy:
      'p-avatar hat keinen tabindex, keine Rolle und keine Tastenbehandlung: Eine Maus kann ihn anklicken, eine Tastatur erreicht ihn nicht, und ein Screenreader weiß nicht, dass er etwas tut.',
    clickDoWhy:
      'Der Anker bringt Fokus, Enter, die Rolle link und einen Namen aus dem sichtbaren Text mit; der Avatar darin ist als Dekoration verborgen.',
    groupWhy:
      'Jeder Avatar außer dem letzten ist teilweise verdeckt, und der eine Bildname muss jede Person tragen. Niemand kann von einem Reviewer zum nächsten wechseln.',
    groupDoWhy:
      'Eine Liste sagt an, wie viele Reviewer es sind, und lässt einen Screenreader sie einzeln durchgehen; die sichtbaren Namen machen die Initialen dekorativ.',

    // design
    tokBg: '{surface.200} hell (#e2e8f0), {surface.700} dunkel (#3f3f46)',
    tokFg: '{text.color}: {surface.700} hell (#334155), {surface.0} dunkel (#ffffff)',
    tokRadius: '{border.radius.md} — je visuellem Stil, siehe die nächste Tabelle; circle ignoriert ihn',
    tokSize: 'Breite und Höhe der Box; das Bild füllt sie mit 100% × 100%',
    tokFont: 'Label-Größe; Icons nutzen avatar.icon.size (1rem · 1.5rem · 2rem)',
    tokGroupBorder:
      'ein 2px-Ring in {surface.0} hell (#ffffff), {surface.900} dunkel (#18181b) — Aura ab Werk, nicht der Seitengrund des Kits',
    tokOffset: 'negativer Margin auf inline-start bei jedem Avatar nach dem ersten, je Größe',
    radWerkbund: 'ein scharfkantiges Quadrat',
    radLern: 'ein abgerundetes Quadrat, bei dieser Größe nahe am Kreis',
    radSkizze: 'ein abgerundetes Quadrat',
    radBlau: 'ein fast scharfkantiges Quadrat',

    crTextLight: '8,40:1',
    crTextDark: '10,44:1',
    crBgCard: '1,23:1',
    crBgCardDark: '1,61:1',
    crBgNote: 'keins — ein Avatar ist kein Bedienelement; nur zur Information',

    stretch:
      'Das innere Bild wird in beiden Richtungen auf die Box gezogen, ohne object-fit, also wird ein Porträt, das nicht quadratisch ist, gestaucht statt beschnitten. Beschneide es an der Quelle oder setz object-fit: cover über den Pass-through-Abschnitt auf das Bild.',
    narrow:
      'Kein eigenes responsives Verhalten. Avatar-Größen sind in jedem Viewport feste rem-Werte; die Gruppe ist eine einzelne Flex-Zeile, die nie umbricht und aus ihrem Container läuft, wenn die Breite nicht reicht. Begrenze die sichtbare Anzahl und schließ mit einem „+N“-Avatar ab, oder wechsle unter deinem eigenen Breakpoint zu einer Liste.',
    motion:
      'Keine. Die Styles von Avatar und Gruppe deklarieren keine Transition und keine Animation, also ändert sich unter prefers-reduced-motion nichts.',

    // development
    apiLabel: 'Text in der Box. Wird zuerst geprüft: Ist er gesetzt, werden icon und image ignoriert.',
    apiIcon: 'Klassenliste für ein Span mit Icon-Font (das Kit lädt @openng/icons). Das Span hat kein aria-hidden.',
    apiImage: 'Als <img [src]> ohne alt-Attribut gerendert; nur gebunden, wenn label und icon leer sind.',
    apiSize: 'Ergänzt p-avatar-lg oder p-avatar-xl; „normal“ ergänzt nichts.',
    apiShape: 'circle ergänzt p-avatar-circle (Radius 50% an Host und Bild).',
    apiAria:
      'Wird auf den Host geschrieben, der keine Rolle hat. ariaLabel wird im image-Zweig außerdem auf das innere <img> geschrieben — der einzige Weg, auf dem dieses Bild einen Namen bekommt.',
    apiStyleClass: 'Seit v20.0.0 veraltet — nimm class.',
    apiError: 'Gibt das error-Event des <img> weiter. Kein eingebauter Fallback.',
    apiGroup:
      'Ein Wrapper mit der Klasse p-avatar-group und sonst nichts: Inputs styleClass und style, keine Rolle, kein Name, keine Anzahl, keine Logik für Überlauf. Den „+N“-Avatar schreibst du selbst. Die Überlappung und der 2px-Ring kommen aus Regeln im Avatar-Stylesheet, die auf .p-avatar-group .p-avatar zielen.',
    ssr: 'Nichts nur für den Browser: Beide Komponenten rendern auf dem Server vollständig. Das error-Event des Bildes feuert nur im Browser, also erscheint ein Fallback, der in onImageError entschieden wird, erst nach der Hydration.',

    checkName:
      'Jeder Avatar ist entweder neben einem sichtbaren Namen verborgen oder trägt role="img" und ein ariaLabel mit dem vollen Namen.',
    checkRole: 'Kein ariaLabel auf einem Host ohne Rolle — ein generisches Element kann keinen Namen bekommen.',
    checkInteractive: 'Klickbare Avatare sitzen in einem echten <a> oder <button>; nie ein (click) auf p-avatar.',
    checkFallback: 'Ein Bild-Avatar behandelt onImageError, indem er auf ein Label umschaltet.',
    checkGroup: 'Eine Gruppe ist ein Bild mit einem Satz, oder sie ist eine Liste — nie eine Reihe unbenannter Bilder.',
    checkData: 'Porträts und Namen in Beispielen sind synthetisch (PRIV-001).',

    // i18n
    i18nLibrary:
      'Nichts. Der Avatar hat keine eingebauten Texte und keinen Eintrag in der Übersetzungskonfiguration von Optimus. Das Label, der Name und jede „+N“-Anzahl gehören dir, und ihre Übersetzung auch.',
    i18nInitials:
      'Zwei Buchstaben aus Vor- und Nachname sind eine Gewohnheit der lateinischen Schrift. Namen mit Partikeln, einteilige Namen und nicht-lateinische Schriften lassen sich nicht darauf reduzieren, und ein Screenreader buchstabiert Initialen in der Sprache der Seite. Leite ein Label mit Bedacht ab, halte es rein visuell und lass den zugänglichen Namen den vollen Namen sein. In Varianten in Leichter Sprache zeig den Namen als Text neben dem Avatar.',
    i18nRtl:
      'Die Überlappung der Gruppe nutzt margin-inline-start, also läuft der Stapel unter dir="rtl" von rechts mit derselben Überlappung. Der Avatar selbst hat keine richtungsabhängige Regel.',
  };
}
