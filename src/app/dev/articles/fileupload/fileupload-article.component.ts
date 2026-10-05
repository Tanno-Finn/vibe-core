import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FileUploadModule } from '@openng/optimus-ui/fileupload';
import type { FileSelectEvent, FileUploadHandlerEvent } from '@openng/optimus-ui/types/fileupload';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/** Standalone imports, shared with the German twin beside this file (ADR-0018). */
export const ARTICLE_IMPORTS = [GuideShellComponent, GuideTabDirective, FileUploadModule];

/** Component styles, shared with the German twin, so both languages render with the same rules. */
export const ARTICLE_STYLES = `
      app-fileupload-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-fileupload-article .stage {
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        margin-block: 0.75rem;
      }

      app-fileupload-article .stage--row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.9rem;
      }

      app-fileupload-article .stage__out {
        margin: 0.75rem 0 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
        min-height: 1.2em;
      }

      app-fileupload-article .dd {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-block: 0.75rem;
      }

      app-fileupload-article .dd__cell {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
      }

      app-fileupload-article .dd__cell--bad {
        border-left: 3px solid var(--semantic-red-fg);
      }

      app-fileupload-article .dd__cell--good {
        border-left: 3px solid var(--semantic-green-fg);
      }

      app-fileupload-article .dd__stage {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: var(--surface-section);
        min-height: 3.5rem;
      }

      app-fileupload-article .dd__stage--stack {
        flex-direction: column;
        align-items: stretch;
        gap: 0.6rem;
      }

      app-fileupload-article .dd__alert {
        margin: 0;
        font-size: 0.85rem;
        color: var(--semantic-red-fg);
      }

      app-fileupload-article .dd__why {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-color-secondary);
      }

      app-fileupload-article .tag {
        align-self: flex-start;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 0.15em 0.55em;
        border-radius: 999px;
      }

      app-fileupload-article .tag--bad {
        background: color-mix(in srgb, var(--semantic-red-fg) 14%, transparent);
        color: var(--semantic-red-fg);
      }

      app-fileupload-article .tag--good {
        background: color-mix(in srgb, var(--semantic-green-fg) 16%, transparent);
        color: var(--semantic-green-fg);
      }

      app-fileupload-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      @media (max-width: 640px) {
        app-fileupload-article .dd {
          grid-template-columns: 1fr;
        }
      }
    `;

/**
 * Guide article: File Upload (Guides, category `library`).
 *
 * Everything this article claims was read off the shipped sources of Optimus UI
 * 2.0.2. `openng-optimus-ui-fileupload.mjs` (1582 lines) is the fesm2022 bundle
 * of that name; the styles and theme files are cited in full below.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - Selector `p-fileupload, p-fileUpload`, the whole input/output/query list
 *     and the two mode templates: openng-optimus-ui-fileupload.mjs:996-1199.
 *     Advanced markup :997-1151, basic markup :1152-1198.
 *   - Inherited dt/unstyled/pt/ptOptions come from BaseComponent
 *     (openng-optimus-ui-basecomponent.mjs:428, usesInheritance on :996).
 *   - Validation: validate() checks accept first, then maxFileSize (:686-705);
 *     isFileTypeValid splits on comma and compares MIME class or extension
 *     (:706-724); messages are pushed as {severity:'error', text} (:690-702).
 *   - checkFileLimit (:862-875) pushes the limit message and filters it out
 *     again by substring match on invalidFileLimitMessageSummary (:873).
 *   - Upload: uploader() (:735-800). formData.append(this.name, …) :753.
 *     Response branch :771-785 — the uploadedFiles move (:783) and clear()
 *     (:784) sit OUTSIDE the status if/else (:774-782). Error callback
 *     :795-798 leaves progress untouched and pushes no message.
 *   - Limit accounting: uploadedFileCount grows at :776 (2xx response) and
 *     at :738 (customUpload), both only when fileLimit is set;
 *     removeUploadedFile does not decrement it (:841-845), isChooseDisabled
 *     (:854-861) and isFileLimitExceeded (:846-853) read it in the non-auto
 *     branch only. Auto-upload guard :663.
 *   - Object URLs created at :527 and :654; onImageLoad (:728) and imageError
 *     (:963) are referenced by no template in the bundle (grep over the file
 *     returns only the declarations).
 *   - Dedup on name+type+size :673-680; msgs cleared on each selection :646.
 *   - a11y: file inputs hidden by @openng/optimus-ui-styles/dist/fileupload/index.mjs:2-4;
 *     aria-label from aria.browseFiles on those inputs :998 and :1186;
 *     chooseButtonLabel :969-971. p-message host role/aria-live is static
 *     (openng-optimus-ui-message.mjs:247); progressbar role and aria-valuenow
 *     (openng-optimus-ui-progressbar.mjs:136), and FileUpload passes only
 *     [value] and [showValue]="false" (:1108). Choose button binds both
 *     (onClick) :1007 and (keydown.enter) :1008.
 *   - i18n: locale defaults in openng-optimus-ui-config.mjs — choose :132,
 *     completed :133, upload :134, cancel :135, pending :136, fileSizeTypes
 *     :137, fileChosenMessage :174, noFileChosenMessage :175, aria.browseFiles
 *     :230; setTranslation :246-249. basicFileChosenLabel :619-628 calls
 *     replace('{0}', …) on a default that contains no {0}.
 *   - Layout: @openng/optimus-ui-styles/dist/fileupload/index.mjs — header flex
 *     without wrap :13-24, file row wraps :46-53, basic content wraps :81-86;
 *     the file has no rule for .p-fileupload-file-name and no @media at all.
 *   - Tokens from @openng/optimus-ui-themes/dist/aura/fileupload/index.mjs
 *     (single-line dist bundle, values cited by export name).
 *   - docs/generated/CONTRAST.MD has no fileupload row. In light mode the
 *     drag-over border ({primary.color}) sits on {content.background} = #ffffff,
 *     the exact pair its `<accent>.primary.color` on `--surface-card` rows measure
 *     (every style's light --surface-card is #ffffff); the dark panel is
 *     {surface.900}, which no row measures — darker than every style's dark
 *     card, where the same rows put every accent at >= 4.75:1.
 *   - File sizes: formatSize (:144-154) is toFixed(3) plus a fileSizeTypes unit,
 *     so the decimal separator is always a period, whatever the page language.
 */
@Component({
  selector: 'app-fileupload-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: ARTICLE_IMPORTS,
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'fileupload'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          Two components in one selector. Advanced mode is a panel with a drop area, a queue, and a progress bar; basic
          mode is a button and a label. They share every input, and almost none of the advanced behavior survives the
          switch — which makes <code>mode</code> the first decision, not a styling detail.
        </p>

        <h3>Advanced mode, with a handler instead of a URL</h3>
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
          <code>customUpload</code> routes the Upload button to the <code>uploadHandler</code> output instead of the
          built-in request (<code>openng-optimus-ui-fileupload.mjs:736-744</code>), so this example needs no endpoint.
          Pick a file over 2&nbsp;MB, or a fourth file, to see the two validation messages.
        </p>

        <h3>Basic mode</h3>
        <div class="stage stage--row">
          <p-fileupload mode="basic" customUpload chooseLabel="Attach one file" (uploadHandler)="handleUpload($event)" />
        </div>
        <p class="src-note">
          Basic mode renders the messages, one button, and one label span
          (<code>openng-optimus-ui-fileupload.mjs:1152-1198</code>) — no content element, so no drop target, no progress
          bar and no file list. The button always calls <code>onBasicUploaderClick()</code> under the label
          <code>chooseButtonLabel</code> (<code>:1161</code>, <code>:1163</code>); only its icon switches to the upload
          icon once files are queued and <code>auto</code> is off (<code>:1170-1177</code>), while the
          <code>basicButtonLabel</code> getter that would relabel it (<code>:536-541</code>) is bound by no template.
          So without <code>auto</code> this mode has no way to start the upload — call <code>upload()</code> on the
          instance.
        </p>

        <h3>What each mode renders</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Surface per mode, from the two template branches
            </caption>
            <thead>
              <tr>
                <th>Part</th>
                <th><code>mode="advanced"</code></th>
                <th><code>mode="basic"</code></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Validation messages</td><td>{{ m.advMessages }}</td><td>{{ m.basMessages }}</td></tr>
              <tr><td>Drop target</td><td>{{ m.advDrop }}</td><td>{{ m.basDrop }}</td></tr>
              <tr><td>Progress bar</td><td>{{ m.advProgress }}</td><td>{{ m.basProgress }}</td></tr>
              <tr><td>File queue</td><td>{{ m.advQueue }}</td><td>{{ m.basQueue }}</td></tr>
              <tr><td>Upload / Cancel buttons</td><td>{{ m.advButtons }}</td><td>{{ m.basButtons }}</td></tr>
              <tr><td>Uploaded list</td><td>{{ m.advUploaded }}</td><td>{{ m.basUploaded }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Read off the two <code>*ngIf="mode === …"</code> branches in
          <code>openng-optimus-ui-fileupload.mjs</code>: advanced <code>:997-1151</code>, basic
          <code>:1152-1198</code>.
        </p>

        <h3>The queue row the library builds for you</h3>
        <pre class="code-block"><code>{{ fileRowSnippet }}</code></pre>
        <p class="src-note">
          The row comes from the internal <code>[pFileContent]</code> component in the same bundle
          (<code>:156-176</code>). The thumbnail <code>&lt;img&gt;</code> is rendered for every file
          (<code>:158</code>) although <code>objectURL</code> is only set for files matching
          <code>/^image\\//</code> (<code>:526-528</code>, <code>:653-655</code>), so a PDF row gets an image element
          with no source; it carries <code>role="presentation"</code>, so it stays out of the accessibility tree.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          The component validates, queues, and uploads. It does not tell the user when the upload failed, and it does not
          speak your application's language. Both are yours, and both are easy to leave out because the default looks
          finished.
        </p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — ship the upload without a failure path</span>
            <div class="dd__stage">
              <p-fileupload mode="basic" customUpload chooseLabel="Send report" (uploadHandler)="handleUpload($event)" />
            </div>
            <p class="dd__why">{{ m.ddErrBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — render the failure yourself</span>
            <div class="dd__stage dd__stage--stack">
              <p-fileupload mode="basic" customUpload chooseLabel="Send report" (uploadHandler)="handleUpload($event)" />
              <p class="dd__alert" role="alert">Upload failed — the report was not sent. Try again.</p>
            </div>
            <p class="dd__why">{{ m.ddErrGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages run with <code>customUpload</code>, so the built-in request never starts and the failure reaches
          you in your own handler (<code>openng-optimus-ui-fileupload.mjs:736-744</code>). The built-in path is no more
          helpful: its error callback sets <code>uploading = false</code> and emits <code>onError</code>
          (<code>:795-798</code>) without resetting <code>progress</code> or <code>files</code> and without pushing into
          <code>msgs</code>. Either way nothing on the left stage would change; the right stage owns its own message.
        </p>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — leave the buttons to the library locale</span>
            <div class="dd__stage">
              <p-fileupload mode="basic" customUpload (uploadHandler)="handleUpload($event)" />
            </div>
            <p class="dd__why">{{ m.ddLabelBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — pass the labels you translate</span>
            <div class="dd__stage">
              <p-fileupload
                mode="basic"
                customUpload
                chooseLabel="Add attachment"
                (uploadHandler)="handleUpload($event)"
              />
            </div>
            <p class="dd__why">{{ m.ddLabelGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages are the same component with the same mode; only <code>chooseLabel</code> differs. Without it the
          button falls back to the Optimus locale's <code>choose</code>
          (<code>openng-optimus-ui-fileupload.mjs:969-971</code>), whose shipped value is English
          (<code>openng-optimus-ui-config.mjs:132</code>). The I18n tab lists which strings have no input at all.
        </p>

        <h3>Annotated source</h3>
        <pre class="code-block"><code>{{ usageSnippet }}</code></pre>
        <p class="src-note">
          <code>uploadHandler</code> receives <code>&#123; files &#125;</code> and nothing else
          (<code>openng-optimus-ui-fileupload.mjs:740-742</code>); clearing the queue afterwards is the caller's job,
          because the built-in <code>clear()</code> only runs on the library's own request path (<code>:784</code>).
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          One Aura token group, seven exports, and a stylesheet that consumes them without a single media query. What
          the component does at 360&nbsp;px follows from that absence, not from a breakpoint.
        </p>

        <h3>Aura token chain</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Token group, its Aura value, and the rule that consumes it
            </caption>
            <thead>
              <tr>
                <th>Export</th>
                <th>Key values</th>
                <th>Consumed by</th>
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
          Values from <code>&#64;openng/optimus-ui-themes/dist/aura/fileupload/index.mjs</code> (a single-line dist
          bundle, cited by export name); the selectors from
          <code>&#64;openng/optimus-ui-styles/dist/fileupload/index.mjs</code>, 87 lines, no media query.
        </p>

        <h3>The drag-over highlight, and what the compilat can say about it</h3>
        <p>
          While a drag is over the content element the component adds <code>p-fileupload-highlight</code> and sets
          <code>data-p-highlight="true"</code>; on leave and on drop it removes the class and sets the attribute back to
          <code>false</code>. The class is the visible half: a 1px dashed border in
          <code>content.highlightBorderColor</code>, which Aura resolves to <code>{{ m.highlightToken }}</code>. That
          border is the only signal that the drop target is armed, so it owes <strong>SC 1.4.11, 3:1</strong> against the
          panel behind it.
        </p>
        <p class="src-note">
          Light mode: the panel is <code>&#123;content.background&#125;</code>, <code>#ffffff</code>, and
          <code>docs/generated/CONTRAST.MD</code> measures exactly that pair under <code>checkbox &amp; radiobutton</code>
          — <code>&lt;accent&gt;.primary.color</code> on <code>--surface-card</code> (<code>#ffffff</code> in every
          style's light block): 5.18:1 (sunset) to 17.85:1 (contrast), SC 1.4.11 needs 3:1. Dark mode: the panel is
          <code>&#123;surface.900&#125;</code> (<code>#18181b</code>), which no row measures directly; the nearest rows, on
          each style's dark <code>--surface-card</code>, put every accent at 4.75:1 or more — the dark accent ramp is
          built from the contrast-adjusted foreground, and the gate declares no exceptions. Every dark card is lighter
          than <code>#18181b</code> and every dark <code>primary.color</code> is a light tone, so the panel pair can
          only sit higher.
        </p>
        <p class="src-note">
          The class is added only when <code>unstyled</code> is off, while <code>data-p-highlight</code> is set either
          way (<code>openng-optimus-ui-fileupload.mjs:902-920</code>) — an unstyled build therefore has the state in the
          DOM and no visible border until you style that attribute yourself.
        </p>

        <h3>On a narrow screen</h3>
        <p>
          <strong>No breakpoint exists.</strong> The stylesheet contains no media query, so nothing reflows by width.
          What happens instead differs per row: the header is a flex row <em>without</em>
          <code>flex-wrap</code>, so Choose / Upload / Cancel keep one line and overflow the panel once their combined
          width exceeds it; the file row and the basic-mode content <em>do</em> set
          <code>flex-wrap: wrap</code>, so those wrap. The file name has no rule of its own — no
          <code>overflow</code>, no <code>text-overflow</code> — so a long unbroken name is not truncated and widens its
          row. Layout guidance: give the panel a <code>min-width: 0</code> parent, and either shorten the three button
          labels or hide two of them with <code>showUploadButton</code> / <code>showCancelButton</code> below your own
          breakpoint.
        </p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/fileupload/index.mjs</code>: header <code>:13-24</code>, file row
          <code>:46-53</code>, basic content <code>:81-86</code>; the file defines no
          <code>.p-fileupload-file-name</code> rule and no <code>&#64;media</code> block.
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          The interesting part of this component is not its API surface but its bookkeeping: what the outputs actually
          carry, and what the two counters do when files come and go.
        </p>

        <h3>Outputs and what they carry</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Emit sites, read off the component body
            </caption>
            <thead>
              <tr>
                <th>Output</th>
                <th>Payload</th>
                <th>Fires when</th>
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
          Emit sites in <code>openng-optimus-ui-fileupload.mjs</code>: <code>:660</code>, <code>:749</code>,
          <code>:766</code>, <code>:790</code>, <code>:778</code>, <code>:781</code> and <code>:797</code>,
          <code>:819</code>, <code>:832</code>, <code>:844</code>, <code>:740</code>, <code>:964</code>. Payload shapes
          from <code>openng-optimus-ui-types-fileupload.d.ts</code>.
        </p>

        <h3>The two error paths</h3>
        <pre class="code-block"><code>{{ errorPathSnippet }}</code></pre>
        <p class="src-note">
          <code>openng-optimus-ui-fileupload.mjs:763-798</code>, abridged. The two lines that move the queue into
          <code>uploadedFiles</code> and clear it (<code>:783-784</code>) sit after the status branch, so both branches
          reach them; the error callback (<code>:795-798</code>) reaches neither.
        </p>

        <h3>File-limit accounting</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Which counter each guard reads
            </caption>
            <thead>
              <tr>
                <th>Guard</th>
                <th><code>auto</code></th>
                <th>Counts</th>
                <th>Comparison</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>isChooseDisabled()</code></td><td>on</td><td>{{ m.limA }}</td><td>{{ m.limAcmp }}</td></tr>
              <tr><td><code>isChooseDisabled()</code></td><td>off</td><td>{{ m.limB }}</td><td>{{ m.limBcmp }}</td></tr>
              <tr><td><code>isFileLimitExceeded()</code></td><td>on</td><td>{{ m.limC }}</td><td>{{ m.limCcmp }}</td></tr>
              <tr><td><code>isFileLimitExceeded()</code></td><td>off</td><td>{{ m.limD }}</td><td>{{ m.limDcmp }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          <code>openng-optimus-ui-fileupload.mjs:846-861</code>. The two guards use different comparisons, so at exactly
          <code>fileLimit</code> files the Choose button is disabled while the limit message is not shown;
          <code>uploadedFileCount</code> is incremented on a 2xx response (<code>:776</code>) and, under
          <code>customUpload</code>, already when the upload is triggered (<code>:738</code>) — both only if
          <code>fileLimit</code> is set — and it is never decremented: <code>removeUploadedFile</code> touches only the
          array (<code>:841-845</code>), and <code>customUpload</code> never fills <code>uploadedFiles</code>
          (<code>:783</code>), so there is nothing there to remove.
        </p>

        <h3>Accessibility and quality checklist</h3>
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
          Nine user-visible strings, two sources. Eight come from the Optimus locale, three of those overridable by an
          input; the ninth, the validation messages, exists as inputs only. The locale is a separate service from the
          kit's own translations, so it does not follow a language switch on its own.
        </p>

        <h3>Where each string comes from</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Visible strings and the only route to change each
            </caption>
            <thead>
              <tr>
                <th>String</th>
                <th>Source</th>
                <th>Shipped value</th>
                <th>How to change it</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Choose button</td><td>{{ m.i18nLocale }}</td><td><code>Choose</code></td><td>{{ m.i18nChoose }}</td></tr>
              <tr><td>Upload button</td><td>{{ m.i18nLocale }}</td><td><code>Upload</code></td><td>{{ m.i18nUpload }}</td></tr>
              <tr><td>Cancel button</td><td>{{ m.i18nLocale }}</td><td><code>Cancel</code></td><td>{{ m.i18nCancel }}</td></tr>
              <tr><td>Queued-file badge</td><td>{{ m.i18nLocale }}</td><td><code>Pending</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Uploaded-file badge</td><td>{{ m.i18nLocale }}</td><td><code>Completed</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Basic label, no file</td><td>{{ m.i18nLocale }}</td><td><code>No file chosen</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Basic label, n files</td><td>{{ m.i18nLocale }}</td><td><code>Files</code></td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Size units</td><td>{{ m.i18nLocale }}</td><td>{{ m.i18nUnits }}</td><td>{{ m.i18nOnlyLocale }}</td></tr>
              <tr><td>Size number</td><td>{{ m.i18nSizeSrc }}</td><td><code>1.234</code></td><td>{{ m.i18nSizeHow }}</td></tr>
              <tr><td>Validation messages</td><td>{{ m.i18nInput }}</td><td>{{ m.i18nMsgDefault }}</td><td>{{ m.i18nMsgHow }}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Locale defaults in <code>openng-optimus-ui-config.mjs</code>: <code>:132-137</code> for the button labels, the
          badges and the size units, <code>:174-175</code> for the two basic-mode labels. The six message inputs and
          their English defaults are in <code>openng-optimus-ui-fileupload.mjs:268-293</code>; the size number is
          <code>toFixed(3)</code> in <code>formatSize</code> (<code>:144-154</code>), so its separator is a period on a
          German page too, where the kit's house style is a comma (<code>numberLocaleFor</code> in
          <code>src/app/utils/date-locale.ts</code>).
        </p>

        <h3>The count that does not arrive</h3>
        <p>
          In basic mode with several files selected the label is
          <code>getTranslation('fileChosenMessage')?.replace('&#123;0&#125;', files.length)</code>. The shipped
          value is the bare word <code>Files</code>, which contains no placeholder — so the replacement is a no-op and
          the count never appears. A single file shows its own name instead, and zero files show
          <code>No file chosen</code>. If you want "3 files", your locale string must carry the placeholder.
        </p>
        <p class="src-note">
          <code>openng-optimus-ui-fileupload.mjs:619-628</code>; the default it operates on is
          <code>openng-optimus-ui-config.mjs:174</code>.
        </p>

        <h3>Keeping the locale in step with a language switch</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          <code>setTranslation</code> merges into the current translation object and pushes it through
          <code>translationObserver</code> (<code>openng-optimus-ui-config.mjs:242</code>, <code>:246-249</code>); the
          component subscribes to that observer and marks itself for check
          (<code>openng-optimus-ui-fileupload.mjs:557-561</code>), so an already-rendered upload picks the new strings
          up without being recreated.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: the dark drag-over reading
            re-cited (every accent 4.75:1 or more on the dark cards; the contrast-accent exception is gone).
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Drag-over contrast cited from the compilat (light) with the dark gap
            named; the unlocalized size number; the locale snippet injects <code>Optimus</code>.
          </li>
          <li><strong>1.0</strong> — 2026-09-06 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [ARTICLE_STYLES],
})
export class FileUploadArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  readonly log = signal('');

  handleUpload(event: FileUploadHandlerEvent): void {
    this.log.set('uploadHandler received ' + event.files.length + ' file(s) — no request was sent.');
  }

  noteSelect(event: FileSelectEvent): void {
    this.log.set('onSelect: ' + event.currentFiles.length + ' file(s) queued.');
  }

  /** Flat measurement constants — substituted by the tab extractor. */
  readonly m = {
    advMessages: 'yes, inside the content element — after the progress bar, before the file lists',
    basMessages: 'yes, above the button',
    advDrop: 'yes — dragenter / dragleave / drop on the content element',
    basDrop: 'no content element, so none',
    advProgress: 'yes, while the queue is non-empty',
    basProgress: 'none',
    advQueue: 'yes — one row per file, with a remove button',
    basQueue: 'none; one label span instead',
    advButtons: 'both, unless auto is set',
    basButtons: 'neither; the single button always opens the file picker, and only its icon changes once files are queued',
    advUploaded: 'yes, a second list with a success badge',
    basUploaded: 'none',

    ddErrBad:
      'The component reacts to a failed request by stopping the spinner internally and emitting an event. Nothing on screen changes: no message, no reset, and the progress bar keeps its last value — so the user is left looking at a form that appears to have worked.',
    ddErrGood:
      'The failure is a rendered element the user can read, marked so assistive technology announces it, and it says what did not happen rather than only that something went wrong.',
    ddLabelBad:
      'The button and the label read English regardless of the surrounding page, because they come from the library locale, which is configured separately from the application translations.',
    ddLabelGood:
      'The label is passed in, so it is one of your translated strings and changes with the rest of the page.',

    tkRoot: 'background {content.background}, borderColor {content.border.color}, color {content.color}, borderRadius {content.border.radius}, transitionDuration {transition.duration}',
    tkHeader: 'background transparent, color {text.color}, padding 1.125rem, borderWidth 0, borderRadius 0, gap 0.5rem',
    tkContent: 'highlightBorderColor {primary.color}, padding 0 1.125rem 1.125rem 1.125rem, gap 1rem',
    tkFile: 'padding 1rem, gap 1rem, borderColor {content.border.color}, info.gap 0.5rem',
    tkFileList: 'gap 0.5rem',
    tkProgress: 'height 0.25rem',
    tkBasic: 'gap 0.5rem',
    highlightToken: '{primary.color}',

    evSelect: 'originalEvent, files (this pick), currentFiles (whole queue)',
    whSelect: 'after each pick or drop, before the limit check',
    evBefore: 'formData — empty, for you to append to',
    whBefore: 'once per built-in request, before the files are appended',
    evSend: 'originalEvent, formData',
    whSend: 'on the HttpEventType.Sent event',
    evProgress: 'originalEvent, progress (0-100, rounded)',
    whProgress: 'on every upload-progress event; the percentage is recomputed only when the event carries a loaded count',
    evUpload: 'originalEvent, files',
    whUpload: 'on a Response event with a 2xx status',
    evError: 'files, and error only from the second emit site',
    whError: 'from the non-2xx response branch, or from the subscription error callback — different payloads',
    evClear: 'no payload',
    whClear: 'on the Cancel button and at the end of every completed response',
    evRemove: 'originalEvent, file',
    whRemove: 'when a queued file is removed',
    evRemoveUp: 'file, files (the remaining uploaded list)',
    whRemoveUp: 'when a file is removed from the uploaded list',
    evHandler: 'files',
    whHandler: 'instead of the built-in request when customUpload is set',
    evImageError: 'the browser event',
    whImageError: 'never with the built-in file row — no template binds it',

    limA: 'files.length',
    limAcmp: 'fileLimit <= count',
    limB: 'files.length + uploadedFileCount',
    limBcmp: 'fileLimit <= count',
    limC: 'files.length',
    limCcmp: 'fileLimit < count',
    limD: 'files.length + uploadedFileCount',
    limDcmp: 'fileLimit < count',

    ck1: 'The visible control is the Choose button: its label is the accessible name, so it must say what is being attached, not just "Choose".',
    ck2: 'Every failure path renders text the user can read; the component supplies none.',
    ck3: 'If the upload is the main action of the page, the progress bar is given a name through the pass-through — it has a role and a value but no name of its own.',
    ck4: 'Dropping is an extra, never the only route: the drop target exists in advanced mode only and has no keyboard equivalent.',
    ck5: 'Client-side accept, maxFileSize, and fileLimit are duplicated server-side; all three are trivially bypassed.',
    ck6: 'Object URLs created for image previews are revoked by your code if the queue is long-lived — the component creates them and never revokes them.',

    i18nLocale: 'Optimus locale',
    i18nInput: 'component input',
    i18nChoose: 'chooseLabel, or the locale',
    i18nUpload: 'uploadLabel, or the locale',
    i18nCancel: 'cancelLabel, or the locale',
    i18nOnlyLocale: 'locale only — no input exists',
    i18nUnits: 'B, KB, MB, GB, TB, PB, EB, ZB, YB',
    i18nMsgDefault: 'six English strings; five of them carry a {0} placeholder',
    i18nMsgHow: 'the six invalidFile… inputs',
    i18nSizeSrc: 'the component: toFixed(3), never localized',
    i18nSizeHow:
      'only a #file template that formats the size itself, e.g. with formatNumberFor(value, language, 1) from the kit — a German reader takes 1.234 MB for 1234 MB',
  };

  readonly fileRowSnippet: string = '<!-- one row per file, from [pFileContent] -->\n' +
    '<div class="p-fileupload-file">\n' +
    '  <img role="presentation" alt="report.pdf" src="…" width="50">   <!-- always rendered -->\n' +
    '  <div class="p-fileupload-file-info">\n' +
    '    <div class="p-fileupload-file-name">report.pdf</div>\n' +
    '    <span class="p-fileupload-file-size">1.234 MB</span>          <!-- 3 decimals; only a 0-byte file prints none -->\n' +
    '  </div>\n' +
    '  <p-badge class="p-fileupload-file-badge" value="Pending"></p-badge>   <!-- no severity here; the uploaded list passes severity="success" -->\n' +
    '  <div class="p-fileupload-file-actions">\n' +
    '    <button class="p-fileupload-file-remove-button">…</button>    <!-- icon only, no label -->\n' +
    '  </div>\n' +
    '</div>';

  readonly usageSnippet: string = '// The component never tells the user that the upload failed. You do.\n' +
    'readonly failed = signal(false);\n' +
    'readonly busy = signal(false);\n\n' +
    'send(files: File[]): void {\n' +
    '  this.failed.set(false);\n' +
    '  this.busy.set(true);\n' +
    '  this.api.upload(files).subscribe({\n' +
    '    next: () => { this.busy.set(false); this.uploader.clear(); },   // clear() is yours in customUpload\n' +
    '    error: () => { this.busy.set(false); this.failed.set(true); },\n' +
    '  });\n' +
    '}\n\n' +
    '<!-- and in the template -->\n' +
    '<p-fileupload #uploader mode="advanced" customUpload multiple\n' +
    '              accept="image/*,.pdf" [maxFileSize]="2000000" [fileLimit]="3"\n' +
    '              [chooseLabel]="t(\'your-module.choose\')"\n' +
    '              (uploadHandler)="send($event.files)" />\n' +
    '@if (failed()) { <p role="alert">{{ t(\'your-module.failed\') }}</p> }';

  readonly errorPathSnippet: string = '.subscribe((event) => {\n' +
    '    switch (event.type) {\n' +
    '        case HttpEventType.Response:\n' +
    '            this.uploading = false;\n' +
    '            this.progress = 0;\n' +
    '            if (event["status"] >= 200 && event["status"] < 300) {\n' +
    '                if (this.fileLimit) { this.uploadedFileCount += this.files.length; }\n' +
    '                this.onUpload.emit({ originalEvent: event, files: this.files });\n' +
    '            } else {\n' +
    '                this.onError.emit({ files: this.files });        // no error property\n' +
    '            }\n' +
    '            this.uploadedFiles = [...this.uploadedFiles, ...this.files];  // both branches\n' +
    '            this.clear();                                                 // both branches\n' +
    '            break;\n' +
    '        // …\n' +
    '    }\n' +
    '}, (error) => {\n' +
    '    this.uploading = false;                     // progress and files untouched\n' +
    '    this.onError.emit({ files: this.files, error: error });\n' +
    '});';

  readonly i18nSnippet: string = "// The Optimus locale is a separate store from the kit's translations:\n" +
    '// nothing connects them, so a language switch must push into both.\n' +
    '// Extend the kit sync in optimus-a11y.service.ts rather than adding a second one.\n' +
    "import { Optimus } from '@openng/optimus-ui/config';\n" +
    'private readonly optimus = inject(Optimus);\n\n' +
    'applyLanguage(): void {\n' +
    '  this.optimus.setTranslation({\n' +
    "    choose: this.t('your-module.choose'),\n" +
    "    upload: this.t('your-module.send'),\n" +
    "    cancel: this.t('your-module.cancel'),\n" +
    "    pending: this.t('your-module.pending'),\n" +
    "    completed: this.t('your-module.completed'),\n" +
    "    noFileChosenMessage: this.t('your-module.noFile'),\n" +
    "    fileChosenMessage: this.t('your-module.nFiles'),   // must contain {0} to show the count\n" +
    "    fileSizeTypes: this.t('your-module.sizeUnits').split(','),\n" +
    '  });\n' +
    '}';
}
