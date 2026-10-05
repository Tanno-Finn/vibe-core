import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import type { FileSelectEvent, FileUploadHandlerEvent } from '@openng/optimus-ui/types/fileupload';
import { FileUploadArticleComponent, ARTICLE_IMPORTS, ARTICLE_STYLES } from './fileupload-article.component';

/** German readouts for the literals the English template writes into `log` from event bindings. */
const LOG_DE: Record<string, string> = {
  'onClear fired': 'onClear ausgelöst',
};

/** A `log` signal that maps the template's English event-binding literals to German on `set`. */
function germanLog(): WritableSignal<string> {
  const log = signal('');
  const set = log.set.bind(log);
  log.set = (value: string) => set(LOG_DE[value] ?? value);
  return log;
}

/**
 * German twin of the File Upload guide (ADR-0018).
 *
 * Extends the English canonical article, so state, measured values and code snippets
 * are shared; only the template, the readouts and the visible strings in `m` are
 * German. Keep it in step with the English file: same tabs, same element and binding
 * skeleton (`node scripts/check-guide-translations.mjs fileupload`).
 */
@Component({
  selector: 'app-fileupload-article-de',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'fileupload'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Zwei Komponenten in einem Selektor. Der Modus advanced ist ein Panel mit Ablagefläche, Warteschlange und
          Fortschrittsbalken; der Modus basic ist ein Button und ein Label. Sie teilen sich jeden Input, und fast nichts
          vom Verhalten des Modus advanced übersteht den Wechsel — damit ist <code>mode</code> die erste Entscheidung,
          kein Styling-Detail.
        </p>

        <h3>Modus advanced, mit einem Handler statt einer URL</h3>
        <div class="stage">
          <p-fileupload
            mode="advanced"
            customUpload
            multiple
            accept="image/*,.pdf"
            [maxFileSize]="2000000"
            [fileLimit]="3"
            (uploadHandler)="handleUpload($event)"
            (onSelect)="noteSelect($event)"
            (onClear)="log.set('onClear fired')"
          />
          <p class="stage__out" aria-live="polite">{{ log() }}</p>
        </div>
        <p class="src-note">
          <code>customUpload</code> leitet den Upload-Button auf den Output <code>uploadHandler</code> um statt auf den
          eingebauten Request (<code>openng-optimus-ui-fileupload.mjs:736-744</code>), also braucht dieses Beispiel keinen
          Endpunkt. Wähl eine Datei über 2&nbsp;MB oder eine vierte Datei, um die zwei Validierungsmeldungen zu sehen.
        </p>

        <h3>Modus basic</h3>
        <div class="stage stage--row">
          <p-fileupload mode="basic" customUpload chooseLabel="Eine Datei anhängen" (uploadHandler)="handleUpload($event)" />
        </div>
        <p class="src-note">
          Der Modus basic rendert die Meldungen, einen Button und ein Label-Span
          (<code>openng-optimus-ui-fileupload.mjs:1152-1198</code>) — kein Content-Element, also keine Ablagefläche, keinen
          Fortschrittsbalken und keine Dateiliste. Der Button ruft immer <code>onBasicUploaderClick()</code> auf, unter dem
          Label <code>chooseButtonLabel</code> (<code>:1161</code>, <code>:1163</code>); nur sein Icon wechselt zum
          Upload-Icon, sobald Dateien in der Warteschlange stehen und <code>auto</code> aus ist (<code>:1170-1177</code>),
          während der Getter <code>basicButtonLabel</code>, der ihn umbenennen würde (<code>:536-541</code>), von keinem
          Template gebunden wird. Ohne <code>auto</code> kann dieser Modus den Upload also nicht starten — ruf
          <code>upload()</code> an der Instanz auf.
        </p>

        <h3>Was jeder Modus rendert</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Oberfläche je Modus, aus den zwei Template-Zweigen
            </caption>
            <thead>
              <tr>
                <th>Teil</th>
                <th><code>mode="advanced"</code></th>
                <th><code>mode="basic"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Validierungsmeldungen</td><td>{{ m.advMessages }}</td><td>{{ m.basMessages }}</td></tr>
              <tr><td>Ablagefläche</td><td>{{ m.advDrop }}</td><td>{{ m.basDrop }}</td></tr>
              <tr><td>Fortschrittsbalken</td><td>{{ m.advProgress }}</td><td>{{ m.basProgress }}</td></tr>
              <tr><td>Datei-Warteschlange</td><td>{{ m.advQueue }}</td><td>{{ m.basQueue }}</td></tr>
              <tr><td>Buttons Upload/Cancel</td><td>{{ m.advButtons }}</td><td>{{ m.basButtons }}</td></tr>
              <tr><td>Liste der hochgeladenen Dateien</td><td>{{ m.advUploaded }}</td><td>{{ m.basUploaded }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Abgelesen an den zwei Zweigen <code>*ngIf="mode === …"</code> in
          <code>openng-optimus-ui-fileupload.mjs</code>: advanced <code>:997-1151</code>, basic
          <code>:1152-1198</code>.
        </p>

        <h3>Die Warteschlangen-Zeile, die die Bibliothek für dich baut</h3>
        <pre class="code-block"><code>{{ fileRowSnippet }}</code></pre>
        <p class="src-note">
          Die Zeile kommt aus der internen Komponente <code>[pFileContent]</code> im selben Bundle
          (<code>:156-176</code>). Das Vorschaubild <code>&lt;img&gt;</code> wird für jede Datei gerendert
          (<code>:158</code>), obwohl <code>objectURL</code> nur für Dateien gesetzt wird, die auf
          <code>/^image\\//</code> passen (<code>:526-528</code>, <code>:653-655</code>), also bekommt eine PDF-Zeile ein
          Bildelement ohne Quelle; es trägt <code>role="presentation"</code> und bleibt damit aus dem Accessibility Tree
          heraus.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Die Komponente validiert, reiht ein und lädt hoch. Sie sagt dem Nutzer nicht, wenn der Upload fehlgeschlagen
          ist, und sie spricht nicht die Sprache deiner Anwendung. Beides liegt bei dir, und beides lässt man leicht weg,
          weil der Standard fertig aussieht.
        </p>

        <h3>Do und Don’t</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — den Upload ohne Fehlerpfad ausliefern</span>
            <div class="dd__stage">
              <p-fileupload mode="basic" customUpload chooseLabel="Bericht senden" (uploadHandler)="handleUpload($event)" />
            </div>
            <p class="dd__why">{{ m.ddErrBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — den Fehler selbst rendern</span>
            <div class="dd__stage dd__stage--stack">
              <p-fileupload mode="basic" customUpload chooseLabel="Bericht senden" (uploadHandler)="handleUpload($event)" />
              <p class="dd__alert" role="alert">Upload fehlgeschlagen — der Bericht wurde nicht gesendet. Versuch es noch einmal.</p>
            </div>
            <p class="dd__why">{{ m.ddErrGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen laufen mit <code>customUpload</code>, also startet der eingebaute Request nie, und der Fehler
          erreicht dich in deinem eigenen Handler (<code>openng-optimus-ui-fileupload.mjs:736-744</code>). Der eingebaute
          Weg hilft nicht mehr: Sein Fehler-Callback setzt <code>uploading = false</code> und gibt <code>onError</code>
          aus (<code>:795-798</code>), ohne <code>progress</code> oder <code>files</code> zurückzusetzen und ohne etwas in
          <code>msgs</code> zu schieben. So oder so würde sich auf der linken Bühne nichts ändern; die rechte Bühne
          verantwortet ihre eigene Meldung.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don’t — die Buttons dem Locale der Bibliothek überlassen</span>
            <div class="dd__stage">
              <p-fileupload mode="basic" customUpload (uploadHandler)="handleUpload($event)" />
            </div>
            <p class="dd__why">{{ m.ddLabelBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — die Labels übergeben, die du übersetzt</span>
            <div class="dd__stage">
              <p-fileupload
                mode="basic"
                customUpload
                chooseLabel="Anhang hinzufügen"
                (uploadHandler)="handleUpload($event)"
              />
            </div>
            <p class="dd__why">{{ m.ddLabelGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Beide Bühnen sind dieselbe Komponente im selben Modus; nur <code>chooseLabel</code> unterscheidet sich. Ohne es
          fällt der Button auf <code>choose</code> aus dem Optimus-Locale zurück
          (<code>openng-optimus-ui-fileupload.mjs:969-971</code>), dessen ausgelieferter Wert Englisch ist
          (<code>openng-optimus-ui-config.mjs:132</code>). Der Tab Internationalisierung (i18n) listet, welche Strings
          überhaupt keinen Input haben.
        </p>

        <h3>Kommentierter Quellcode</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          <code>uploadHandler</code> bekommt <code>&#123; files &#125;</code> und sonst nichts
          (<code>openng-optimus-ui-fileupload.mjs:740-742</code>); die Warteschlange danach zu leeren ist Sache des
          Aufrufers, weil das eingebaute <code>clear()</code> nur auf dem eigenen Request-Weg der Bibliothek läuft
          (<code>:784</code>).
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          Eine Aura-Token-Gruppe, sieben Exporte und ein Stylesheet, das sie ohne eine einzige Media-Query verbraucht.
          Was die Komponente bei 360&nbsp;px tut, folgt aus diesem Fehlen, nicht aus einem Breakpoint.
        </p>

        <h3>Aura-Token-Kette</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Token-Gruppe, ihr Aura-Wert und die Regel, die sie verbraucht
            </caption>
            <thead>
              <tr>
                <th>Export</th>
                <th>Wichtige Werte</th>
                <th>Verbraucht von</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>root</code></td><td>{{ m.tkRoot }}</td><td><code>.p-fileupload-advanced</code></td></tr>
              <tr><td><code>header</code></td><td>{{ m.tkHeader }}</td><td><code>.p-fileupload-header</code></td></tr>
              <tr><td><code>content</code></td><td>{{ m.tkContent }}</td><td><code>.p-fileupload-content</code></td></tr>
              <tr><td><code>file</code></td><td>{{ m.tkFile }}</td><td><code>.p-fileupload-file</code></td></tr>
              <tr><td><code>fileList</code></td><td>{{ m.tkFileList }}</td><td><code>.p-fileupload-file-list</code></td></tr>
              <tr><td><code>progressbar</code></td><td>{{ m.tkProgress }}</td><td><code>.p-fileupload-content .p-progressbar</code></td></tr>
              <tr><td><code>basic</code></td><td>{{ m.tkBasic }}</td><td><code>.p-fileupload-basic-content</code></td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Werte aus <code>&#64;openng/optimus-ui-themes/dist/aura/fileupload/index.mjs</code> (ein einzeiliges
          Dist-Bundle, nach Export-Namen zitiert); die Selektoren aus
          <code>&#64;openng/optimus-ui-styles/dist/fileupload/index.mjs</code>, 87 Zeilen, keine Media-Query.
        </p>

        <h3>Die Drag-over-Hervorhebung und was das Kompilat darüber sagen kann</h3>
        <p>
          Solange ein Drag über dem Content-Element liegt, fügt die Komponente <code>p-fileupload-highlight</code> hinzu
          und setzt <code>data-p-highlight="true"</code>; beim Verlassen und beim Ablegen entfernt sie die Klasse und
          setzt das Attribut zurück auf <code>false</code>. Die Klasse ist die sichtbare Hälfte: ein gestrichelter
          1px-Rahmen in <code>content.highlightBorderColor</code>, das Aura zu <code>{{ m.highlightToken }}</code>
          auflöst. Dieser Rahmen ist das einzige Signal, dass die Ablagefläche scharf ist, also schuldet er
          <strong>SC 1.4.11, 3:1</strong> gegen das Panel dahinter.
        </p>
        <p class="src-note">
          Heller Modus: Das Panel ist <code>&#123;content.background&#125;</code>, <code>#ffffff</code>, und
          <code>docs/generated/CONTRAST.MD</code> misst genau dieses Paar unter <code>checkbox &amp; radiobutton</code>
          — <code>&lt;accent&gt;.primary.color</code> auf <code>--surface-card</code> (<code>#ffffff</code> im hellen
          Block jedes Stils): 5,18:1 (sunset) bis 17,85:1 (contrast), SC 1.4.11 verlangt 3:1. Dunkler Modus: Das Panel
          ist <code>&#123;surface.900&#125;</code> (<code>#18181b</code>), das keine Zeile direkt misst; die nächsten
          Zeilen, auf dem dunklen <code>--surface-card</code> jedes Stils, setzen jeden Akzent auf 4,75:1 oder mehr — die
          dunkle Akzent-Rampe ist aus dem kontrastangepassten Vordergrund gebaut, und das Gate erklärt keine Ausnahmen.
          Jede dunkle Karte ist heller als <code>#18181b</code>, und jedes dunkle <code>primary.color</code> ist ein heller
          Ton, also kann das Paar mit dem Panel nur höher liegen.
        </p>
        <p class="src-note">
          Die Klasse wird nur hinzugefügt, wenn <code>unstyled</code> aus ist, während <code>data-p-highlight</code> in
          jedem Fall gesetzt wird (<code>openng-optimus-ui-fileupload.mjs:902-920</code>) — ein Build mit unstyled hat den
          Zustand also im DOM und keinen sichtbaren Rahmen, bis du dieses Attribut selbst stylst.
        </p>

        <h3>Auf einem schmalen Bildschirm</h3>
        <p>
          <strong>Es gibt keinen Breakpoint.</strong> Das Stylesheet enthält keine Media-Query, also bricht nichts nach
          Breite um. Was stattdessen passiert, unterscheidet sich je Zeile: Der Header ist eine Flex-Reihe <em>ohne</em>
          <code>flex-wrap</code>, also bleiben Choose, Upload und Cancel in einer Zeile und laufen über das Panel hinaus,
          sobald ihre gemeinsame Breite es übersteigt; die Dateizeile und der Inhalt des Modus basic setzen
          <em>sehr wohl</em> <code>flex-wrap: wrap</code>, also brechen diese um. Der Dateiname hat keine eigene Regel —
          kein <code>overflow</code>, kein <code>text-overflow</code> —, also wird ein langer Name ohne Umbruchstelle nicht
          gekürzt und verbreitert seine Zeile. Layout-Empfehlung: Gib dem Panel ein Elternelement mit
          <code>min-width: 0</code>, und kürze entweder die drei Button-Labels oder blende zwei davon unterhalb deines
          eigenen Breakpoints mit <code>showUploadButton</code> / <code>showCancelButton</code> aus.
        </p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/fileupload/index.mjs</code>: Header <code>:13-24</code>, Dateizeile
          <code>:46-53</code>, Inhalt des Modus basic <code>:81-86</code>; die Datei definiert keine Regel
          <code>.p-fileupload-file-name</code> und keinen <code>&#64;media</code>-Block.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Das Spannende an dieser Komponente ist nicht ihre API-Oberfläche, sondern ihre Buchführung: was die Outputs
          tatsächlich transportieren und was die zwei Zähler tun, wenn Dateien kommen und gehen.
        </p>

        <h3>Outputs und was sie transportieren</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Emit-Stellen, abgelesen am Rumpf der Komponente
            </caption>
            <thead>
              <tr>
                <th>Output</th>
                <th>Payload</th>
                <th>Feuert, wenn</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>onSelect</code></td><td>{{ m.evSelect }}</td><td>{{ m.whSelect }}</td></tr>
              <tr><td><code>onBeforeUpload</code></td><td>{{ m.evBefore }}</td><td>{{ m.whBefore }}</td></tr>
              <tr><td><code>onSend</code></td><td>{{ m.evSend }}</td><td>{{ m.whSend }}</td></tr>
              <tr><td><code>onProgress</code></td><td>{{ m.evProgress }}</td><td>{{ m.whProgress }}</td></tr>
              <tr><td><code>onUpload</code></td><td>{{ m.evUpload }}</td><td>{{ m.whUpload }}</td></tr>
              <tr><td><code>onError</code></td><td>{{ m.evError }}</td><td>{{ m.whError }}</td></tr>
              <tr><td><code>onClear</code></td><td>{{ m.evClear }}</td><td>{{ m.whClear }}</td></tr>
              <tr><td><code>onRemove</code></td><td>{{ m.evRemove }}</td><td>{{ m.whRemove }}</td></tr>
              <tr><td><code>onRemoveUploadedFile</code></td><td>{{ m.evRemoveUp }}</td><td>{{ m.whRemoveUp }}</td></tr>
              <tr><td><code>uploadHandler</code></td><td>{{ m.evHandler }}</td><td>{{ m.whHandler }}</td></tr>
              <tr><td><code>onImageError</code></td><td>{{ m.evImageError }}</td><td>{{ m.whImageError }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Emit-Stellen in <code>openng-optimus-ui-fileupload.mjs</code>: <code>:660</code>, <code>:749</code>,
          <code>:766</code>, <code>:790</code>, <code>:778</code>, <code>:781</code> und <code>:797</code>,
          <code>:819</code>, <code>:832</code>, <code>:844</code>, <code>:740</code>, <code>:964</code>. Payload-Formen aus
          <code>openng-optimus-ui-types-fileupload.d.ts</code>.
        </p>

        <h3>Die zwei Fehlerpfade</h3>
        <pre class="code-block"><code>{{ errorPathSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-fileupload.mjs:763-798</code>, gekürzt. Die zwei Zeilen, die die Warteschlange nach
          <code>uploadedFiles</code> verschieben und sie leeren (<code>:783-784</code>), stehen nach der Status-Verzweigung,
          also erreichen beide Zweige sie; der Fehler-Callback (<code>:795-798</code>) erreicht keine davon.
        </p>

        <h3>Buchführung des Dateilimits</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Welchen Zähler jeder Guard liest
            </caption>
            <thead>
              <tr>
                <th>Guard</th>
                <th><code>auto</code></th>
                <th>Zählt</th>
                <th>Vergleich</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>isChooseDisabled()</code></td><td>an</td><td>{{ m.limA }}</td><td>{{ m.limAcmp }}</td></tr>
              <tr><td><code>isChooseDisabled()</code></td><td>aus</td><td>{{ m.limB }}</td><td>{{ m.limBcmp }}</td></tr>
              <tr><td><code>isFileLimitExceeded()</code></td><td>an</td><td>{{ m.limC }}</td><td>{{ m.limCcmp }}</td></tr>
              <tr><td><code>isFileLimitExceeded()</code></td><td>aus</td><td>{{ m.limD }}</td><td>{{ m.limDcmp }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-fileupload.mjs:846-861</code>. Die zwei Guards vergleichen unterschiedlich, also ist bei
          genau <code>fileLimit</code> Dateien der Choose-Button deaktiviert, während die Limit-Meldung nicht erscheint;
          <code>uploadedFileCount</code> wird bei einer 2xx-Antwort erhöht (<code>:776</code>) und unter
          <code>customUpload</code> schon beim Auslösen des Uploads (<code>:738</code>) — beides nur, wenn
          <code>fileLimit</code> gesetzt ist —, und er wird nie verringert: <code>removeUploadedFile</code> fasst nur das
          Array an (<code>:841-845</code>), und <code>customUpload</code> füllt <code>uploadedFiles</code> nie
          (<code>:783</code>), also gibt es dort nichts zu entfernen.
        </p>

        <h3>Checkliste für Accessibility und Qualität</h3>
        <ul class="checklist">
          <li>{{ m.ck1 }}</li>
          <li>{{ m.ck2 }}</li>
          <li>{{ m.ck3 }}</li>
          <li>{{ m.ck4 }}</li>
          <li>{{ m.ck5 }}</li>
          <li>{{ m.ck6 }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          Neun für den Nutzer sichtbare Strings, zwei Quellen. Acht kommen aus dem Optimus-Locale, drei davon lassen sich
          über einen Input überschreiben; der neunte, die Validierungsmeldungen, existiert nur als Inputs. Das Locale ist
          ein eigener Dienst, getrennt von den Übersetzungen des Kits, also folgt es einem Sprachwechsel nicht von selbst.
        </p>

        <h3>Woher jeder String kommt</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Sichtbare Strings und der einzige Weg, jeden davon zu ändern
            </caption>
            <thead>
              <tr>
                <th>String</th>
                <th>Quelle</th>
                <th>Ausgelieferter Wert</th>
                <th>Wie du ihn änderst</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Choose-Button</td><td>{{ m.i18nLocale }}</td><td><code>Choose</code></td><td>{{ m.i18nChoose }}</td></tr>
              <tr><td>Upload-Button</td><td>{{ m.i18nLocale }}</td><td><code>Upload</code></td><td>{{ m.i18nUpload }}</td></tr>
              <tr><td>Cancel-Button</td><td>{{ m.i18nLocale }}</td><td><code>Cancel</code></td><td>{{ m.i18nCancel }}</td></tr>
              <tr><td>Badge einer wartenden Datei</td><td>{{ m.i18nLocale }}</td><td><code>Pending</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Badge einer hochgeladenen Datei</td><td>{{ m.i18nLocale }}</td><td><code>Completed</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Label im Modus basic, keine Datei</td><td>{{ m.i18nLocale }}</td><td><code>No file chosen</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Label im Modus basic, n Dateien</td><td>{{ m.i18nLocale }}</td><td><code>Files</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Größeneinheiten</td><td>{{ m.i18nLocale }}</td><td>{{ m.i18nUnits }}</td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Größenzahl</td><td>{{ m.i18nSizeSrc }}</td><td><code>1.234</code></td><td>{{ m.i18nSizeHow }}</td></tr>
              <tr><td>Validierungsmeldungen</td><td>{{ m.i18nInput }}</td><td>{{ m.i18nMsgDefault }}</td><td>{{ m.i18nMsgHow }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Locale-Standards in <code>openng-optimus-ui-config.mjs</code>: <code>:132-137</code> für die Button-Labels, die
          Badges und die Größeneinheiten, <code>:174-175</code> für die zwei Labels des Modus basic. Die sechs
          Meldungs-Inputs und ihre englischen Standards stehen in <code>openng-optimus-ui-fileupload.mjs:268-293</code>;
          die Größenzahl ist <code>toFixed(3)</code> in <code>formatSize</code> (<code>:144-154</code>), also ist ihr
          Trennzeichen auch auf einer deutschen Seite ein Punkt, wo die Hausregel des Kits ein Komma ist
          (<code>numberLocaleFor</code> in <code>src/app/utils/date-locale.ts</code>).
        </p>

        <h3>Die Anzahl, die nie ankommt</h3>
        <p>
          Im Modus basic mit mehreren gewählten Dateien ist das Label
          <code>getTranslation('fileChosenMessage')?.replace('&#123;0&#125;', files.length)</code>. Der ausgelieferte
          Wert ist das nackte Wort <code>Files</code>, das keinen Platzhalter enthält — die Ersetzung tut also nichts, und
          die Anzahl erscheint nie. Eine einzelne Datei zeigt stattdessen ihren eigenen Namen, und null Dateien zeigen
          <code>No file chosen</code>. Wenn du „3 Dateien“ willst, muss dein Locale-String den Platzhalter tragen.
        </p>
        <p class="src-note">
          <code>openng-optimus-ui-fileupload.mjs:619-628</code>; der Standard, auf dem es arbeitet, ist
          <code>openng-optimus-ui-config.mjs:174</code>.
        </p>

        <h3>Das Locale bei einem Sprachwechsel mitziehen</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> führt in das aktuelle Übersetzungsobjekt zusammen und schiebt es durch
          <code>translationObserver</code> (<code>openng-optimus-ui-config.mjs:242</code>, <code>:246-249</code>); die
          Komponente abonniert diesen Observer und markiert sich zur Prüfung
          (<code>openng-optimus-ui-fileupload.mjs:557-561</code>), also übernimmt ein schon gerenderter Upload die neuen
          Strings, ohne neu erzeugt zu werden.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 23.09.2026 — Mit den Kontrast- und Fokus-Runden abgeglichen: die dunkle
            Drag-over-Messung neu zitiert (jeder Akzent 4,75:1 oder mehr auf den dunklen Karten; die Ausnahme für den
            Akzent contrast ist weg).
          </li>
          <li>
            <strong>1.1</strong> — 23.09.2026 — Drag-over-Kontrast aus dem Kompilat zitiert (hell), die dunkle Lücke
            benannt; die nicht lokalisierte Größenzahl; das Locale-Snippet injiziert <code>Optimus</code>.
          </li>
          <li><strong>1.0</strong> — 06.09.2026 — Erste Version, gemessen gegen Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class FileUploadArticleDeComponent extends FileUploadArticleComponent {
  override readonly log = germanLog();

  override handleUpload(event: FileUploadHandlerEvent): void {
    this.log.set('uploadHandler hat ' + event.files.length + ' Datei(en) erhalten — kein Request wurde gesendet.');
  }

  override noteSelect(event: FileSelectEvent): void {
    this.log.set('onSelect: ' + event.currentFiles.length + ' Datei(en) in der Warteschlange.');
  }

  override readonly m = {
    advMessages: 'ja, im Content-Element — nach dem Fortschrittsbalken, vor den Dateilisten',
    basMessages: 'ja, über dem Button',
    advDrop: 'ja — dragenter / dragleave / drop am Content-Element',
    basDrop: 'kein Content-Element, also keine',
    advProgress: 'ja, solange die Warteschlange nicht leer ist',
    basProgress: 'keiner',
    advQueue: 'ja — eine Zeile je Datei, mit einem Entfernen-Button',
    basQueue: 'keine; stattdessen ein Label-Span',
    advButtons: 'beide, außer auto ist gesetzt',
    basButtons:
      'keiner; der eine Button öffnet immer die Dateiauswahl, und nur sein Icon ändert sich, sobald Dateien in der Warteschlange stehen',
    advUploaded: 'ja, eine zweite Liste mit einem Erfolgs-Badge',
    basUploaded: 'keine',

    ddErrBad:
      'Die Komponente reagiert auf einen fehlgeschlagenen Request, indem sie intern den Spinner stoppt und ein Event ausgibt. Auf dem Bildschirm ändert sich nichts: keine Meldung, kein Zurücksetzen, und der Fortschrittsbalken behält seinen letzten Wert — der Nutzer sieht also ein Formular, das scheinbar funktioniert hat.',
    ddErrGood:
      'Der Fehler ist ein gerendertes Element, das der Nutzer lesen kann, so markiert, dass assistive Technik es ansagt, und es sagt, was nicht passiert ist, statt nur, dass etwas schiefging.',
    ddLabelBad:
      'Button und Label lesen sich unabhängig von der umgebenden Seite Englisch, weil sie aus dem Locale der Bibliothek kommen, das getrennt von den Übersetzungen der Anwendung konfiguriert wird.',
    ddLabelGood:
      'Das Label wird übergeben, also ist es einer deiner übersetzten Strings und wechselt mit dem Rest der Seite.',

    tkRoot:
      'background {content.background}, borderColor {content.border.color}, color {content.color}, borderRadius {content.border.radius}, transitionDuration {transition.duration}',
    tkHeader: 'background transparent, color {text.color}, padding 1.125rem, borderWidth 0, borderRadius 0, gap 0.5rem',
    tkContent: 'highlightBorderColor {primary.color}, padding 0 1.125rem 1.125rem 1.125rem, gap 1rem',
    tkFile: 'padding 1rem, gap 1rem, borderColor {content.border.color}, info.gap 0.5rem',
    tkFileList: 'gap 0.5rem',
    tkProgress: 'height 0.25rem',
    tkBasic: 'gap 0.5rem',
    highlightToken: '{primary.color}',

    evSelect: 'originalEvent, files (diese Auswahl), currentFiles (ganze Warteschlange)',
    whSelect: 'nach jeder Auswahl oder jedem Ablegen, vor der Limit-Prüfung',
    evBefore: 'formData — leer, damit du anhängen kannst',
    whBefore: 'einmal je eingebautem Request, bevor die Dateien angehängt werden',
    evSend: 'originalEvent, formData',
    whSend: 'beim Event HttpEventType.Sent',
    evProgress: 'originalEvent, progress (0–100, gerundet)',
    whProgress:
      'bei jedem Upload-Progress-Event; der Prozentwert wird nur neu berechnet, wenn das Event eine geladene Menge trägt',
    evUpload: 'originalEvent, files',
    whUpload: 'bei einem Response-Event mit einem 2xx-Status',
    evError: 'files, und error nur von der zweiten Emit-Stelle',
    whError: 'aus dem Zweig für Nicht-2xx-Antworten oder aus dem Fehler-Callback der Subscription — unterschiedliche Payloads',
    evClear: 'keine Payload',
    whClear: 'beim Cancel-Button und am Ende jeder abgeschlossenen Antwort',
    evRemove: 'originalEvent, file',
    whRemove: 'wenn eine Datei aus der Warteschlange entfernt wird',
    evRemoveUp: 'file, files (die verbleibende Liste der hochgeladenen Dateien)',
    whRemoveUp: 'wenn eine Datei aus der Liste der hochgeladenen Dateien entfernt wird',
    evHandler: 'files',
    whHandler: 'statt des eingebauten Requests, wenn customUpload gesetzt ist',
    evImageError: 'das Browser-Event',
    whImageError: 'nie mit der eingebauten Dateizeile — kein Template bindet es',

    limA: 'files.length',
    limAcmp: 'fileLimit <= count',
    limB: 'files.length + uploadedFileCount',
    limBcmp: 'fileLimit <= count',
    limC: 'files.length',
    limCcmp: 'fileLimit < count',
    limD: 'files.length + uploadedFileCount',
    limDcmp: 'fileLimit < count',

    ck1: 'Das sichtbare Bedienelement ist der Choose-Button: Sein Label ist der zugängliche Name, also muss es sagen, was angehängt wird, nicht nur „Choose“.',
    ck2: 'Jeder Fehlerpfad rendert Text, den der Nutzer lesen kann; die Komponente liefert keinen.',
    ck3: 'Ist der Upload die Hauptaktion der Seite, bekommt der Fortschrittsbalken über das Pass-through einen Namen — er hat eine Rolle und einen Wert, aber keinen eigenen Namen.',
    ck4: 'Ablegen ist ein Extra, nie der einzige Weg: Die Ablagefläche gibt es nur im Modus advanced, und sie hat keine Tastatur-Entsprechung.',
    ck5: 'accept, maxFileSize und fileLimit auf dem Client werden auf dem Server wiederholt; alle drei lassen sich trivial umgehen.',
    ck6: 'Object-URLs, die für Bildvorschauen erzeugt werden, widerruft dein Code, wenn die Warteschlange lange lebt — die Komponente erzeugt sie und widerruft sie nie.',

    i18nLocale: 'Optimus-Locale',
    i18nInput: 'Input der Komponente',
    i18nChoose: 'chooseLabel oder das Locale',
    i18nUpload: 'uploadLabel oder das Locale',
    i18nCancel: 'cancelLabel oder das Locale',
    i18nOnlyLocale: 'nur das Locale — es gibt keinen Input',
    i18nUnits: 'B, KB, MB, GB, TB, PB, EB, ZB, YB',
    i18nMsgDefault: 'sechs englische Strings; fünf davon tragen einen Platzhalter {0}',
    i18nMsgHow: 'die sechs Inputs invalidFile…',
    i18nSizeSrc: 'die Komponente: toFixed(3), nie lokalisiert',
    i18nSizeHow:
      'nur ein #file-Template, das die Größe selbst formatiert, z. B. mit formatNumberFor(value, language, 1) aus dem Kit — ein deutscher Leser hält 1.234 MB für 1234 MB',
  };
}
