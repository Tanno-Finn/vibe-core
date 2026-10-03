import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuideShellComponent, GuideTabDirective } from '../article-shell.component';
import { VIBE_DEV_SENTINEL } from '../../dev-sentinel';

/**
 * Guide article: Editor (Guides, category `library`).
 *
 * Everything claimed here was read off the shipped sources of Optimus UI 2.0.2:
 * `openng-optimus-ui-editor.mjs` (532 lines) is the fesm2022 bundle of that name,
 * `openng-optimus-ui-baseeditableholder.mjs` the base directive it extends.
 *
 * CLAIMS AND THEIR PROVENANCE
 *   - The rich-text engine is loaded with `import('quill')` at first render
 *     (openng-optimus-ui-editor.mjs:255) and a failed load is swallowed into
 *     console.error (:260). `@openng/optimus-ui@2.0.2` lists no `quill` in its
 *     package.json `dependencies`, and the workspace has no `quill` installed
 *     and no `quill` entry in package-lock.json — hence the article renders no
 *     live editor and imports no editor module.
 *   - Server: initQuillEditor returns under isPlatformServer (:247); the whole
 *     init runs in afterNextRender (:196).
 *   - Compiled input/output lists and the selector: :354, :410.
 *   - `readonly` setter calls quill.disable()/enable() (:126-134) and is passed
 *     to the constructor as readOnly (:274). `disabled`, `required`, `name`
 *     come from BaseEditableHolder (openng-optimus-ui-baseeditableholder.mjs:58) and
 *     `disabled` appears nowhere else in the editor bundle; only invalid() is
 *     consumed, for the p-invalid class (:20).
 *   - dt, unstyled, pt, ptOptions come one level higher, from BaseComponent
 *     (openng-optimus-ui-basecomponent.mjs:428); ptm() is bound on toolbar,
 *     groups, controls, and content div (openng-optimus-ui-editor.mjs:362,
 *     :363, :376, :404).
 *   - Value round-trip: writeControlValue (:216-242), setContents/clipboard.convert
 *     (:221), setText('') (:232), isAttachedQuillEditorToDOM (:184-186),
 *     delayedCommand assigned at :227 and :238, declared :173, read nowhere
 *     (those three lines are its only occurrences in the file).
 *   - text-change handler: `if (source === 'user')` (:286), html from
 *     getSemanticHTML() on Quill 2 else `.ql-editor` innerHTML (:287), the
 *     '<p><br></p>' sentinel (:289-291), onModelChange (:298).
 *   - modules shallow merge over { toolbar: toolbarElement } (:269-270).
 *   - Toolbar condition (:355, :361) has three operands; `_headerTemplate`
 *     (:183) is declared and never assigned in the bundle. Default toolbar
 *     markup: :361-402, aria-labels at :376-378, :385-386, :395-397, :400,
 *     unlabeled selects at :364, :369, :381, :382, :387, English option text
 *     at :365-367, :370-372, :388-391.
 *   - Content div (:404) carries no role/aria/id. Quill instance reachable via
 *     onInit (:328-330) or getQuill() (:243); its root element at :315.
 *   - A grep of the bundle for aria-live, role=, tabindex, sanitiz,
 *     DomSanitizer, and bypassSecurityTrust returns nothing; the nine
 *     aria-label occurrences listed above are the only aria attributes.
 *   - CSS from @openng/optimus-ui-styles/dist/editor/index.mjs (981 lines): its
 *     own header names Quill 1.3.3 (:2-7); .ql-container height 100% (:8-15),
 *     .ql-editor height 100% and outline none (:33-45), toolbar button box
 *     24/28px with float left (:303-313), .ql-formats inline-block (:446-449),
 *     placeholder color from dt('form.field.placeholder.color') (:288-296),
 *     the only media query is (pointer: coarse) (:404), the link tooltip is
 *     #fff/#444 with no dt() (:784-790) and its 'Visit URL:' label is CSS
 *     content (:792-795), .p-editor* token rules (:854-981).
 *   - Token aliases from @openng/optimus-ui-themes/dist/aura/editor/index.mjs,
 *     which exports toolbar, toolbarItem, overlay, overlayOption, and content.
 *   - docs/generated/CONTRAST.MD contains no editor row. Body text
 *     ({content.color} = {text.color} on {content.background}) is its "content
 *     panel" row; the toolbar icon ({text.muted.color} = {surface.500}/{surface.400})
 *     equals the paginator.nav.button.color row in light mode and is computed on
 *     {surface.900} in dark (the kit re-pointed button.text.secondary.color, so
 *     that dialog row no longer matches); the frames and the literal tooltip
 *     colors are named as gaps.
 */
@Component({
  selector: 'app-editor-article',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GuideShellComponent, GuideTabDirective],
  template: `
    <span hidden [attr.data-dev-sentinel]="sentinel"></span>
    <app-guide-shell [entryId]="'editor'">
      <!-- ================= EXAMPLES ================= -->
      <ng-template appGuideTab="examples">
        <p class="lead">
          No working editor appears below. The component is a thin Angular wrapper around Quill: it renders a toolbar
          and an empty box, then asks the browser for a library that <code>&#64;openng/optimus-ui&#64;2.0.2</code> does
          not depend on and this kit does not install. What follows is what the wrapper itself emits, which is all
          anyone gets until the engine is installed.
        </p>

        <h3>What the component contributes, and what it does not</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Division of labor between the Angular component and the Quill runtime
            </caption>
            <thead>
              <tr><th>Part</th><th>Comes from</th><th>Exists without <code>quill</code></th></tr>
            </thead>
            <tbody>
              <tr><td>Toolbar buttons and selects</td><td>the component template</td><td>yes — rendered, inert</td></tr>
              <tr><td>Toolbar behavior, pickers, icons</td><td>Quill's toolbar module</td><td>no</td></tr>
              <tr><td>Content box</td><td>the component template</td><td>yes — an empty <code>div</code></td></tr>
              <tr><td><code>contenteditable</code>, <code>.ql-editor</code>, typing</td><td>Quill</td><td>no</td></tr>
              <tr><td>CSS for both halves</td><td>the library stylesheet</td><td>yes — unless <code>unstyled</code> is set</td></tr>
              <tr><td><code>onInit</code>, <code>onTextChange</code>, form value</td><td>Quill events</td><td>no</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          The template renders the toolbar and a bare content <code>div</code>
          (<code>openng-optimus-ui-editor.mjs:361-404</code>); everything else is created in
          <code>createQuillEditor</code> after <code>import('quill')</code> resolves (<code>:255</code>,
          <code>:266-331</code>). The stylesheet is a component style: <code>EditorStyle extends BaseStyle</code> wraps it
          (<code>openng-optimus-ui-editor.mjs:26-28</code>, importing
          <code>&#64;openng/optimus-ui-styles/editor</code> at <code>:13</code>, which resolves to
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs</code>) and the component
          injects it at <code>:190</code>, so it arrives with the component unless the inherited
          <code>unstyled</code> input turns the style layer off
          (<code>openng-optimus-ui-basecomponent.mjs:428</code>).
        </p>

        <h3>The default toolbar, as the component writes it</h3>
        <pre class="code-block"><code>{{ toolbarSnippet }}</code></pre>
        <p class="src-note">
          Abridged from the compiled template (<code>openng-optimus-ui-editor.mjs:361-402</code>): six
          <code>span.ql-formats</code> groups, nine buttons with English <code>aria-label</code>s and five
          <code>select</code> elements with none. The two color <code>select</code>s carry no <code>&lt;option&gt;</code> at all
          (<code>:381-382</code>).
        </p>

        <h3>What a failed engine load looks like</h3>
        <pre class="code-block"><code>{{ failureSnippet }}</code></pre>
        <p class="src-note">
          The failure path is <code>.catch((e) => console.error(e.message))</code>
          (<code>openng-optimus-ui-editor.mjs:260</code>). There is no error output, no fallback field, and no
          state the template reacts to: the page keeps the toolbar it already drew.
        </p>
      </ng-template>

      <!-- ================= USAGE ================= -->
      <ng-template appGuideTab="usage">
        <p class="lead">
          Two decisions, in this order. First: does this field really need HTML, given that it drags in a runtime
          library the kit does not ship? Second, once you have decided yes: who names the editable region, because the
          component cannot.
        </p>

        <h3>Before you reach for it</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>The field holds</th><th>Reach for</th><th>Because</th></tr>
            </thead>
            <tbody>
              <tr><td>A name, a title, a search term</td><td><code>p-inputtext</code></td><td>one line, no formatting vocabulary</td></tr>
              <tr><td>A comment, a description, notes</td><td><code>p-textarea</code></td><td>many lines still need no headings</td></tr>
              <tr><td>Structured prose a person authors</td><td><code>p-editor</code> + <code>quill</code></td><td>headings, links, and lists have to survive storage</td></tr>
              <tr><td>Structured prose, no engine budget</td><td><code>p-textarea</code> + a markup convention</td><td>a toolbar that does nothing is worse than none</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ m.chooseNote }}</p>

        <h3>Do and don't</h3>

        <div class="dd">
          <div class="dd__cell dd__cell--bad">
            <span class="tag tag--bad">Don't — an editable region with no name</span>
            <div class="dd__stage">
              <div class="fac">
                <div class="fac__bar" aria-hidden="true"><span>B</span><span>I</span><span>U</span></div>
                <div class="fac__box" contenteditable="true">Draft text…</div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddNameBad }}</p>
          </div>
          <div class="dd__cell dd__cell--good">
            <span class="tag tag--good">Do — a visible label, and the same string on the editable element</span>
            <div class="dd__stage">
              <div class="fac">
                <span class="fac__label" id="editor-guide-label">Article body</span>
                <div class="fac__bar" aria-hidden="true"><span>B</span><span>I</span><span>U</span></div>
                <div
                  class="fac__box"
                  id="editor-guide-box"
                  contenteditable="true"
                  role="textbox"
                  aria-multiline="true"
                  aria-labelledby="editor-guide-label"
                >
                  Draft text…
                </div>
              </div>
            </div>
            <p class="dd__why">{{ m.ddNameGood }}</p>
          </div>
        </div>
        <p class="src-note">
          Both stages are hand-written facsimiles of the shape Quill produces, not <code>p-editor</code> instances —
          the engine is absent. The rule they illustrate is the component's: its content element is a bare
          <code>div</code> with no <code>role</code>, <code>aria-label</code> or <code>id</code>
          (<code>openng-optimus-ui-editor.mjs:404</code>), and the element that becomes editable is Quill's
          <code>.ql-editor</code> child, which no input of the component addresses.
        </p>

        <h3>Naming the real thing</h3>
        <pre class="code-block"><code>{{ namingSnippet }}</code></pre>
        <p class="src-note">
          <code>onInit</code> is the DOM name of the <code>onEditorInit</code> property
          (<code>openng-optimus-ui-editor.mjs:354</code>) and its payload is the Quill instance
          (<code>:328-330</code>); <code>quill.root</code> is the element the component itself attaches focus and
          blur listeners to (<code>:315</code>, <code>:326-327</code>). The same instance is available later through
          <code>getQuill()</code> (<code>:243</code>).
        </p>

        <h3>The value round-trip, annotated</h3>
        <pre class="code-block"><code>{{ roundTripSnippet }}</code></pre>
        <p class="src-note">
          Read off <code>writeControlValue</code> (<code>openng-optimus-ui-editor.mjs:216-242</code>) and the
          <code>text-change</code> handler (<code>:285-300</code>). Both directions are conditional, and both
          conditions have a branch that does nothing observable — the detached write and the non-user edit.
        </p>
      </ng-template>

      <!-- ================= DESIGN ================= -->
      <ng-template appGuideTab="design">
        <p class="lead">
          The stylesheet this component injects is two stylesheets stapled together: a vendored copy of Quill's own
          "snow" theme, written in fixed hex colors, and a shorter set of rules that repaint parts of it from theme
          tokens. Which of the two owns a given surface decides whether it follows the kit's styles at all.
        </p>

        <h3>Token chain</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Token</th><th>Alias</th><th>Paints</th></tr>
            </thead>
            <tbody>
              <tr><td><code>editor.toolbar.background</code></td><td>{{ m.tokToolbarBg }}</td><td>the toolbar strip</td></tr>
              <tr><td><code>editor.toolbar.borderColor</code></td><td>{{ m.tokToolbarBorder }}</td><td>the toolbar's 1px frame</td></tr>
              <tr><td><code>editor.toolbarItem.color</code></td><td>{{ m.tokItem }}</td><td>icon stroke and fill at rest</td></tr>
              <tr><td><code>editor.toolbarItem.activeColor</code></td><td>{{ m.tokItemActive }}</td><td>an applied format</td></tr>
              <tr><td><code>editor.content.background</code></td><td>{{ m.tokContentBg }}</td><td>the writing surface</td></tr>
              <tr><td><code>editor.content.color</code></td><td>{{ m.tokContentFg }}</td><td>the text being written</td></tr>
              <tr><td><code>editor.overlay.background</code></td><td>{{ m.tokOverlayBg }}</td><td>an expanded picker</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Aliases from <code>&#64;openng/optimus-ui-themes/dist/aura/editor/index.mjs</code> (a single-line dist
          bundle, cited by its exports <code>toolbar</code>, <code>toolbarItem</code>, <code>overlay</code>,
          <code>overlayOption</code>, <code>content</code>); the rules that consume them are
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs:854-981</code>.
        </p>

        <h3>What the tokens do not reach</h3>
        <p>
          The vendored Quill half carries 47 literal hex color values drawn from 15 distinct codes, and the token
          rules override only some of them.
          The link tooltip is the visible casualty: <code>background: #fff</code> with <code>color: #444</code>, no
          <code>dt()</code> call and no dark-mode selector, so it stays a white popup on a dark page. Its label is CSS
          <code>content</code> rather than markup.
        </p>
        <p class="src-note">
          The count is over the vendored half of
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs</code> (<code>:1-853</code>; the
          <code>.p-editor</code> token rules begin at <code>:854</code> and add no literal of their own).
          <code>:784-790</code> for the tooltip box,
          <code>:792-795</code> for the <code>'Visit URL:'</code> label; the file's own header names Quill 1.3.3 as
          the origin of that half (<code>:2-7</code>).
        </p>

        <h3>Contrast: what the compilat can and cannot say</h3>
        <div class="table-wrap">
          <table>
            <caption>
              Editor token pairs against <code>docs/generated/CONTRAST.MD</code>, the same in all four visual styles
            </caption>
            <thead>
              <tr><th>Pair</th><th>light mode</th><th>dark mode</th><th>Criterion</th></tr>
            </thead>
            <tbody>
              <tr><td>Body text: <code>&#123;content.color&#125;</code> on <code>&#123;content.background&#125;</code></td><td>{{ m.crTextLight }}</td><td>{{ m.crTextDark }}</td><td>SC 1.4.3, 4.5:1</td></tr>
              <tr><td>Toolbar icon at rest: <code>&#123;text.muted.color&#125;</code> on <code>&#123;content.background&#125;</code></td><td>{{ m.crIconLight }}</td><td>{{ m.crIconDark }}</td><td>SC 1.4.11, 3:1</td></tr>
              <tr><td>Toolbar and content frames: <code>&#123;content.border.color&#125;</code></td><td>{{ m.contrastGap }}</td><td>{{ m.contrastGap }}</td><td>SC 1.4.11, 3:1</td></tr>
              <tr><td>Link tooltip: literal <code>#444</code> on <code>#fff</code></td><td>{{ m.contrastGap }}</td><td>{{ m.contrastGap }}</td><td>SC 1.4.3, 4.5:1</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">{{ m.contrastNote }}</p>

        <h3>Height and narrow viewports</h3>
        <p>
          <strong>The component has no intrinsic height and no responsive behavior of its own.</strong> The container
          and the writing area are both <code>height: 100%</code>, so an editor whose content div gets no height
          collapses to the toolbar plus a hairline; give it one through <code>[style]</code>, which is bound to that
          div. Horizontally, the toolbar groups are inline-blocks of floated buttons, so they wrap onto further rows as
          the container narrows — the toolbar grows taller, nothing scrolls sideways, and nothing collapses into a menu.
          The single media query in the whole stylesheet is a <code>(pointer: coarse)</code> block that only neutralizes
          hover colors, so touch devices get the same layout at the same 24px button height.
        </p>
        <p class="src-note">
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs:8-15</code> and <code>:33-45</code> for the two
          <code>height: 100%</code> rules, <code>:303-313</code> for the floated 24×28px buttons, <code>:446-449</code>
          for the inline-block groups, <code>:404</code> for the only media query; <code>[style]</code> reaches the
          content div through <code>ngStyle</code> (<code>openng-optimus-ui-editor.mjs:404</code>).
        </p>
      </ng-template>

      <!-- ================= DEVELOPMENT ================= -->
      <ng-template appGuideTab="development">
        <p class="lead">
          Nine own inputs, six outputs, and eight inherited ones — four form inputs of which a single one is read, plus
          four passthrough inputs that do reach the DOM. The interesting part of the surface is not what it offers but
          which of the offered things are wired to the engine.
        </p>

        <h3>Inputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Input</th><th>Where it lands</th><th>Note</th></tr>
            </thead>
            <tbody>
              <tr><td><code>placeholder</code></td><td>Quill options</td><td>rendered by CSS from a data attribute</td></tr>
              <tr><td><code>formats</code></td><td>Quill options</td><td>the list of formats to allow</td></tr>
              <tr><td><code>modules</code></td><td>Quill options</td><td>shallow-merged over the built-in toolbar entry</td></tr>
              <tr><td><code>bounds</code>, <code>scrollingContainer</code>, <code>debug</code></td><td>Quill options</td><td>forwarded verbatim</td></tr>
              <tr><td><code>readonly</code></td><td>constructor and setter</td><td>the only working way to lock the field</td></tr>
              <tr><td><code>style</code></td><td>content <code>div</code></td><td>via <code>ngStyle</code> — this is where height goes</td></tr>
              <tr><td><code>styleClass</code></td><td>host class</td><td>deprecated since v20, use <code>class</code></td></tr>
              <tr><td><code>invalid</code> (inherited)</td><td><code>p-invalid</code> on the host</td><td>a hook — this stylesheet defines no rule for it</td></tr>
              <tr><td><code>disabled</code>, <code>required</code>, <code>name</code> (inherited)</td><td>nowhere</td><td>accepted by the base directive, unread by the editor</td></tr>
              <tr><td><code>dt</code>, <code>unstyled</code>, <code>pt</code>, <code>ptOptions</code> (inherited)</td><td>tokens, style layer, DOM attributes</td><td>from <code>BaseComponent</code>, one level further up — <code>pt</code> is the only way to put attributes on toolbar and content div</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Own inputs from the compiled declaration (<code>openng-optimus-ui-editor.mjs:354</code>) and the option
          object they feed (<code>:271-280</code>); the form inputs from
          <code>openng-optimus-ui-baseeditableholder.mjs:58</code>, the passthrough ones from
          <code>openng-optimus-ui-basecomponent.mjs:428</code>, consumed through <code>ptm()</code> on toolbar,
          groups, controls, and content div (<code>openng-optimus-ui-editor.mjs:362</code>, <code>:363</code>,
          <code>:376</code>, <code>:404</code>). <code>invalid()</code> is read at
          <code>openng-optimus-ui-editor.mjs:20</code>; a search of
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs</code> for <code>p-invalid</code> returns nothing,
          so the class is yours to style.
        </p>

        <h3>Outputs</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Binding</th><th>Property</th><th>Fires when</th></tr>
            </thead>
            <tbody>
              <tr><td><code>(onInit)</code></td><td><code>onEditorInit</code></td><td>the instance exists — the only handle on it in the template</td></tr>
              <tr><td><code>(onTextChange)</code></td><td><code>onTextChange</code></td><td>a person edits; never for programmatic changes</td></tr>
              <tr><td><code>(onSelectionChange)</code></td><td><code>onSelectionChange</code></td><td>the selection or caret moves</td></tr>
              <tr><td><code>(onEditorChange)</code></td><td><code>onEditorChange</code></td><td>any editor change with its event name — no <code>source</code> guard, so programmatic ones too</td></tr>
              <tr><td><code>(onFocus)</code>, <code>(onBlur)</code></td><td><code>onFocus</code>, <code>onBlur</code></td><td>listeners on the editable root</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Names and aliases from the compiled declaration (<code>openng-optimus-ui-editor.mjs:354</code>); the
          <code>source === 'user'</code> guard that gates the text-change payload and the form update is at
          <code>:286</code>; the <code>editor-change</code> subscription at <code>:309-314</code> has no such guard.
          Focus and blur listeners at <code>:326-327</code>, removed again in <code>onDestroy</code>
          (<code>:332-344</code>).
        </p>

        <h3>Two silent branches</h3>
        <pre class="code-block"><code>{{ branchSnippet }}</code></pre>
        <p class="src-note">
          <code>delayedCommand</code> occurs three times in the bundle: declared at
          <code>openng-optimus-ui-editor.mjs:173</code>, assigned at <code>:227</code> and <code>:238</code>. Nothing
          reads it, so the write it holds never runs. The second branch is the <code>else</code> of
          <code>if (source === 'user')</code> (<code>:286</code>), which does not exist at all.
        </p>

        <h3>Server rendering</h3>
        <p>
          Initialization is wrapped in <code>afterNextRender</code> and additionally returns early on the server, so a
          prerendered document contains the toolbar markup and an empty content div — correct, inert, and the same
          thing a browser without the engine ends up with. The engine attaches on the client afterwards, when the
          dynamic import resolves.
        </p>
        <p class="src-note">
          <code>openng-optimus-ui-editor.mjs:196</code> for the render hook, <code>:247-249</code> for the
          <code>isPlatformServer</code> guard.
        </p>

        <h3>Checklist before shipping a rich-text field</h3>
        <ul class="checklist">
          <li>{{ m.checkInstall }}</li>
          <li>{{ m.checkName }}</li>
          <li>{{ m.checkToolbar }}</li>
          <li>{{ m.checkEmpty }}</li>
          <li>{{ m.checkSanitize }}</li>
          <li>{{ m.checkHeight }}</li>
          <li>{{ m.checkDisabled }}</li>
        </ul>
      </ng-template>

      <!-- ================= I18N ================= -->
      <ng-template appGuideTab="i18n">
        <p class="lead">
          The toolbar speaks English and offers no way to ask it not to. This is the one part of the component where a
          translation layer has nothing to bind to, so the decision has to be made before the field ships, not after.
        </p>

        <h3>Where the English lives</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>String</th><th>Written in</th><th>Reachable from your app</th></tr>
            </thead>
            <tbody>
              <tr><td>Nine button <code>aria-label</code>s</td><td>the compiled template</td><td>no</td></tr>
              <tr><td>"Heading", "Subheading", "Normal"</td><td>the compiled template</td><td>no</td></tr>
              <tr><td>"Sans Serif", "Serif", "Monospace"</td><td>the compiled template</td><td>no</td></tr>
              <tr><td>"center", "right", "justify"</td><td>the compiled template</td><td>no</td></tr>
              <tr><td>"Visit URL:" on the link tooltip</td><td>CSS <code>content</code></td><td>only by overriding the rule</td></tr>
              <tr><td><code>placeholder</code></td><td>your binding</td><td>yes</td></tr>
              <tr><td>The five color and picker <code>select</code>s</td><td>—</td><td>they have no label to translate</td></tr>
            </tbody>
          </table>
        </div>
        <p class="src-note">
          Labels at <code>openng-optimus-ui-editor.mjs:376-378</code>, <code>:385-386</code>, <code>:395-397</code>,
          <code>:400</code>; option text at <code>:365-367</code>, <code>:370-372</code>, <code>:388-391</code>;
          unlabeled selects at <code>:364</code>, <code>:369</code>, <code>:381</code>, <code>:382</code>,
          <code>:387</code>; the tooltip label at
          <code>&#64;openng/optimus-ui-styles/dist/editor/index.mjs:792-795</code>.
        </p>

        <h3>The only lever: replace the toolbar</h3>
        <pre class="code-block"><code>{{ i18nSnippet }}</code></pre>
        <p class="src-note">
          A projected <code>&lt;p-header&gt;</code>, a <code>#header</code> template or an
          <code>&lt;ng-template pTemplate="header"&gt;</code> switches the built-in toolbar off entirely
          (<code>openng-optimus-ui-editor.mjs:355-361</code>; the third fills <code>headerTemplate</code> in
          <code>onAfterContentInit</code>, <code>:201-209</code>) — there is no partial override. What you project
          then has to carry Quill's own class names, because the toolbar module binds to those.
        </p>
        <p class="src-note">
          Not measured here: what Quill's picker widgets expose once they replace those <code>select</code> elements.
          That markup comes from the engine, which is not part of <code>&#64;openng/optimus-ui</code>.
        </p>
      </ng-template>

      <!-- ================= HISTORY ================= -->
      <ng-template appGuideTab="history">
        <ul class="history">
          <li>
            <strong>1.2</strong> — 2026-09-23 — Synced with the contrast and focus rounds: body text cited from the
            "content panel" row; the toolbar icon no longer borrows the dialog text-button row, which the kit repainted.
          </li>
          <li>
            <strong>1.1</strong> — 2026-09-23 — Contrast table quotes the compilat rows that resolve the editor's text
            and toolbar-icon token pairs; frames and tooltip named as gaps.
          </li>
          <li><strong>1.0</strong> — 2026-09-06 — First version, measured against Optimus UI 2.0.2.</li>
        </ul>
      </ng-template>
    </app-guide-shell>
  `,
  styles: [
    `
      app-editor-article .lead {
        font-size: 1.05rem;
        color: var(--text-color-secondary);
      }

      app-editor-article .fac {
        width: 100%;
        max-width: 22rem;
      }

      app-editor-article .fac__label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        margin-block-end: 0.35rem;
      }

      app-editor-article .fac__bar {
        display: flex;
        gap: 0.35rem;
        padding: 0.3rem 0.5rem;
        border: 1px solid var(--surface-border);
        border-block-end: 0;
        background: var(--surface-section);
        font-weight: 700;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }

      app-editor-article .fac__box {
        min-height: 4.5rem;
        padding: 0.6rem 0.7rem;
        border: 1px solid var(--surface-border);
        background: var(--surface-card);
        color: var(--text-color);
      }

      app-editor-article .fac__box:focus-visible {
        outline: 2px solid var(--primary-color-fg);
        outline-offset: 2px;
      }

      app-editor-article .checklist {
        margin: 0;
        padding-inline-start: 1.2rem;
      }

      app-editor-article .checklist li {
        margin-block: 0.3rem;
      }
    `,
  ],
})
export class EditorArticleComponent {
  readonly sentinel = VIBE_DEV_SENTINEL;

  /** Flat prose and measurement constants — substituted by the tab extractor. */
  readonly m = {
    chooseNote:
      'The bottom row is not a rhetorical option: with no quill package present the component still renders its ' +
      'toolbar, so a field that looks editable and is not is the default failure mode, not an edge case.',

    ddNameBad:
      'The editable box has no name, so a screen reader announces an unlabeled editing region and a voice-control ' +
      'user has nothing to say to reach it. This is what p-editor renders today: the component gives its content ' +
      'element no role, no aria-label, and no id.',
    ddNameGood:
      'A visible label, referenced from the editable element, names it for everyone; role and aria-multiline tell ' +
      'assistive technology it is a multi-line text field. With p-editor the same three attributes have to be set ' +
      'on the engine root in the onInit handler, because no input reaches that element.',

    tokToolbarBg: '{content.background}',
    tokToolbarBorder: '{content.border.color}',
    tokItem: '{text.muted.color}',
    tokItemActive: '{primary.color}',
    tokContentBg: '{content.background}',
    tokContentFg: '{content.color}',
    tokOverlayBg: '{overlay.select.background}',

    contrastGap: 'no row',
    crTextLight: '10.35:1',
    crTextDark: '17.72:1',
    crIconLight: '4.76:1',
    crIconDark: '6.91:1',
    contrastNote:
      'The compilat has no editor row, but it measures the body-text pair exactly: the "content panel" row, ' +
      'text.color on content.background ({surface.0} / {surface.900}). The toolbar icon is {text.muted.color}; in ' +
      'light mode on white it is the same pair as the gated paginator.nav.button.color row (4.76:1), and in dark ' +
      'mode on {surface.900} it is computed here (6.91:1) — the dialog text-button row no longer stands in for it, ' +
      'because the kit repaints secondary text buttons in --text-color-secondary. The frames and the tooltip are in ' +
      'no row; measure them in the browser once the engine is installed and the real elements exist.',

    checkInstall: 'quill is a dependency of this application, pinned, and its absence fails the build rather than a user.',
    checkName: 'The editable root carries a name set in the onInit handler, and the accessibility tree shows it.',
    checkToolbar:
      'All 14 toolbar controls stand before the content div in the markup, so they precede the text in tab order ' +
      'unless you added a roving tabindex.',
    checkEmpty: 'Emptiness is decided on textValue, not on the HTML string.',
    checkSanitize: 'The stored HTML is sanitized wherever it is rendered back, including your own preview.',
    checkHeight: 'The content div has an explicit height through [style].',
    checkDisabled: 'Locking uses readonly; no code path relies on [disabled] or a disabled FormControl.',
  };

  readonly toolbarSnippet =
    '<div class="p-editor-toolbar">\n' +
    '  <span class="ql-formats">\n' +
    '    <select class="ql-header">…</select>   <!-- no label -->\n' +
    '    <select class="ql-font">…</select>     <!-- no label -->\n' +
    '  </span>\n' +
    '  <span class="ql-formats">\n' +
    '    <button class="ql-bold" aria-label="Bold" type="button"></button>\n' +
    '    <button class="ql-italic" aria-label="Italic" type="button"></button>\n' +
    '    <button class="ql-underline" aria-label="Underline" type="button"></button>\n' +
    '  </span>\n' +
    '  <span class="ql-formats">\n' +
    '    <select class="ql-color"></select>     <!-- no label, no options -->\n' +
    '    <select class="ql-background"></select>\n' +
    '  </span>\n' +
    '  <!-- lists and align, link/image/code, clean: six groups in all -->\n' +
    '</div>\n' +
    '<div [class]="cx(\'content\')"></div>      <!-- no role, no name, empty -->';

  readonly failureSnippet =
    '// openng-optimus-ui-editor.mjs, initQuillEditor\n' +
    "import('quill')\n" +
    '  .then((quillModule) => {\n' +
    '    this.dynamicQuill = quillModule.default;\n' +
    '    this.createQuillEditor();\n' +
    '  })\n' +
    '  .catch((e) => console.error(e.message));\n\n' +
    '// Consequences when the import rejects:\n' +
    '//   - createQuillEditor never runs, so this.quill stays undefined\n' +
    '//   - (onInit) never fires, and getQuill() returns undefined\n' +
    '//   - the content div never becomes contenteditable\n' +
    '//   - writeControlValue keeps the value on the instance but writes nothing:\n' +
    '//     everything after this.value = value sits inside if (this.quill)\n' +
    '//   - the form control keeps whatever value it had, and never changes';

  readonly namingSnippet =
    '<p-editor\n' +
    '  formControlName="body"\n' +
    "  [style]=\"{ height: '18rem' }\"\n" +
    '  [placeholder]="i18n.translate(placeholderKey)"\n' +
    '  (onInit)="nameEditable($event)" />\n\n' +
    '// The editable element is Quill\'s, so the name is set on Quill\'s root.\n' +
    '// placeholderKey and labelKey are keys in your own i18n module.\n' +
    'nameEditable(e: { editor: { root: HTMLElement } }): void {\n' +
    "  e.editor.root.setAttribute('aria-label', this.i18n.translate(this.labelKey));\n" +
    "  e.editor.root.setAttribute('aria-multiline', 'true');\n" +
    '}';

  readonly roundTripSnippet =
    '// IN — writeControlValue, called by the forms API\n' +
    'if (this.quill) {                       // no engine yet: the value is kept on the instance only\n' +
    '  if (value) { setContents(clipboard.convert(...)) } else { setText("") }\n' +
    '  // and each of those runs now only if the content element is connected;\n' +
    '  // otherwise it is parked in delayedCommand, which nothing ever executes\n' +
    '}\n\n' +
    '// OUT — the text-change handler\n' +
    "if (source === 'user') {                // programmatic edits take no branch at all\n" +
    '  html = isQuill2 ? getSemanticHTML() : innerHTML of .ql-editor\n' +
    "  if (html === '<p><br></p>') html = null;   // one exact string, nothing else\n" +
    '  emit onTextChange; onModelChange(html); onModelTouched();\n' +
    '}';

  readonly branchSnippet =
    '// 1. A write while the editor element is detached\n' +
    'this.delayedCommand = command;   // assigned at :227 and :238\n' +
    '// ...and read nowhere. The value never reaches the editor;\n' +
    '// re-patch the control once the editor is on screen.\n\n' +
    '// 2. A change that did not come from a keystroke\n' +
    "this.quill.on('text-change', (delta, oldContents, source) => {\n" +
    "  if (source === 'user') { /* the only path that touches the form */ }\n" +
    '  // no else: setContents/setText through getQuill() leave the control stale\n' +
    '});';

  readonly i18nSnippet =
    '<!-- Replacing the toolbar replaces ALL of it, including the nine English labels -->\n' +
    '<p-editor formControlName="body">\n' +
    '  <p-header>\n' +
    '    <span class="ql-formats">\n' +
    '      <button class="ql-bold" type="button" [attr.aria-label]="i18n.translate(\'your-module.editor.bold\')"></button>\n' +
    '      <button class="ql-italic" type="button" [attr.aria-label]="i18n.translate(\'your-module.editor.italic\')"></button>\n' +
    '    </span>\n' +
    '  </p-header>\n' +
    '</p-editor>\n\n' +
    '<!-- The ql-* class names are the contract with Quill\'s toolbar module; the aria-label is yours -->';
}
